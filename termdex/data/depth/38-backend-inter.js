/* ==========================================================================
   Depth pass 38 — intermediate backend architecture.

   Several of these are the practical vocabulary of running services in
   production: what you do when a dependency fails, when a message cannot be
   processed, when a retry storm forms. The recurring lesson is that the
   naive version of each — retry immediately, cache forever, fail hard — is
   the one that turns a small problem into an outage.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "exponential-backoff",

      why: {
        before: "A failed request was retried immediately, or after a fixed " +
          "delay. Simple, and it works when failures are isolated and " +
          "transient.",
        problem: "Failures are rarely isolated. When a service degrades, " +
          "**every client retries at once**, adding load to the thing already " +
          "struggling — a **retry storm** that converts a recoverable blip " +
          "into an outage. Fixed delays make it worse: all clients retry in " +
          "**lockstep**, producing synchronised traffic spikes that repeat " +
          "forever.",
        shift: "**Wait longer after each failure, and randomise the wait.** " +
          "Exponential growth reduces load on a struggling service, and " +
          "**jitter** breaks the synchronisation so clients spread out instead " +
          "of arriving together."
      },

      num: {
        t: "Backoff strategies",
        h: ["Strategy", "Delays (base 100ms)", "Problem"],
        r: [
          ["Immediate retry", "0, 0, 0, 0", "**amplifies the outage**"],
          ["Fixed", "100, 100, 100", "**synchronised — thundering herd**"],
          ["Exponential", "100, 200, 400, 800", "**still synchronised**"],
          ["**Exponential + full jitter**", "**rand(0,100), rand(0,200)…**", "**the correct answer**"]
        ],
        n: "**Jitter is not optional and it is the part most often omitted.** " +
          "Without it, a thousand clients that all failed at the same moment " +
            "retry at the same moment, then again at the same moment — the " +
          "spike simply repeats at doubling intervals. AWS's analysis found " +
          "**full jitter** (`sleep = random(0, base × 2^attempt)`) performs " +
          "best, better than adding a small random offset. Two other rules " +
          "matter: **cap the delay** (an unbounded exponential reaches hours) " +
          "and **cap the attempt count**, because retrying forever turns a " +
          "failed request into a permanently consumed thread. And retries are " +
          "only safe on **idempotent** operations — retrying a non-idempotent " +
          "payment is how duplicate charges happen."
      },

      miss: [
        {
          w: "Exponential backoff alone prevents retry storms.",
          r: "Without **jitter**, clients that failed simultaneously retry " +
            "simultaneously — the storm repeats at doubling intervals rather " +
            "than being dispersed. Exponential growth reduces total load; " +
            "jitter is what breaks the synchronisation."
        },
        {
          w: "You should retry until it succeeds.",
          r: "Unbounded retries hold connections and threads indefinitely, " +
            "exhausting the client's own resources. Cap both **attempts** and " +
            "**total elapsed time**, then fail — and pair with a **circuit " +
            "breaker** so you stop calling a service that is clearly down."
        },
        {
          w: "Retrying is always safe if the request failed.",
          r: "A timeout does **not** mean the request was not processed — the " +
            "response may simply have been lost. Retrying a non-idempotent " +
            "operation can duplicate it. This is exactly why **idempotency " +
            "keys** exist."
        },
        {
          w: "You should retry every error.",
          r: "Retry **transient** failures — timeouts, 503, connection resets. " +
            "Retrying a `400` or `401` will never succeed and simply wastes " +
            "the attempt budget. Distinguishing retryable from terminal errors " +
            "is part of getting this right."
        }
      ],

      trade: {
        buys: [
          "Transient failures recover without human intervention.",
          "Reduces load on a struggling dependency rather than adding to it.",
          "Jitter disperses synchronised client behaviour.",
          "Standard, widely implemented in client libraries."
        ],
        costs: [
          "Increases tail latency for requests that eventually succeed.",
          "Holds resources while waiting.",
          "Unsafe for non-idempotent operations without an idempotency key.",
          "Parameters — base, cap, attempts — need tuning."
        ],
        avoid: [
          "The operation is not idempotent and has no idempotency key.",
          "The error is terminal — retrying a 400 will never work.",
          "Latency budget leaves no room for waiting.",
          "A **circuit breaker** should have opened; retrying a dead service " +
            "helps nobody."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dead-letter-queue",

      why: {
        before: "A message that could not be processed was retried. If it " +
          "still failed, it was retried again — and the queue kept " +
          "redelivering it.",
        problem: "A **poison message** — malformed, referencing deleted data, " +
          "triggering a bug — will never succeed. It blocks the queue in " +
          "ordered systems, consumes processing capacity forever in unordered " +
          "ones, and generates unbounded error logs. Meanwhile the messages " +
          "behind it wait.",
        shift: "After N failed attempts, **move it aside**. A dead letter " +
          "queue holds messages that could not be processed, so the main queue " +
          "continues while the failures are preserved for inspection. It " +
          "converts *silent infinite retry* into *visible, bounded failure*."
      },

      num: {
        t: "What a DLQ needs to be useful",
        h: ["Element", "Why"],
        r: [
          ["**Max receive count**", "**typically 3–5 before moving**"],
          ["**Alerting on DLQ depth**", "**a silent DLQ is a data-loss bug**"],
          ["Failure context", "why it failed, not just the payload"],
          ["**A replay mechanism**", "**fixing the bug must not lose messages**"],
          ["Retention policy", "messages expire — usually 14 days"]
        ],
        n: "**An unmonitored DLQ is worse than no DLQ**, and this is the most " +
          "common failure: messages move there silently, nobody looks, " +
          "retention expires, and data is lost with no alert. The DLQ made the " +
          "failure invisible rather than visible. The second most common gap " +
          "is **no replay path** — you find the bug, fix it, and then discover " +
          "there is no tooling to reprocess the thousand messages sitting in " +
          "the DLQ, so someone writes a script under pressure. Both should be " +
          "built at the same time as the DLQ itself. Note also that **the DLQ " +
          "does not tell you why** the message failed unless you record it — " +
          "the payload alone rarely reveals the cause."
      },

      miss: [
        {
          w: "A dead letter queue prevents message loss.",
          r: "It **defers** it. Messages in a DLQ have retention limits — " +
            "typically 14 days — and expire silently. Without monitoring and a " +
            "replay process, a DLQ is a place messages go to be lost more " +
            "slowly."
        },
        {
          w: "Messages in the DLQ failed because of a bad message.",
          r: "Often the **consumer** was at fault — a deployment bug, a " +
            "downstream outage, a transient failure that outlasted the retry " +
            "budget. Perfectly valid messages land in DLQs routinely, which is " +
            "exactly why replay matters."
        },
        {
          w: "You should retry many times before dead-lettering.",
          r: "Excessive retries delay detection and waste capacity. **3–5 " +
            "attempts** with backoff is typical: enough for transient " +
            "failures, quick enough that genuine poison messages are surfaced " +
            "promptly rather than blocking throughput."
        },
        {
          w: "Setting up a DLQ is the fix.",
          r: "It is the **detection mechanism**. Without an alert on depth, " +
            "recorded failure reasons, and a replay path, you have added a " +
            "queue nobody watches. All three are part of the pattern, not " +
            "optional extras."
        }
      ],

      trade: {
        buys: [
          "Poison messages stop blocking the main queue.",
          "Failures are preserved for inspection rather than lost.",
          "Bounds retry cost.",
          "DLQ depth is a clear health signal."
        ],
        costs: [
          "Another queue to monitor and operate.",
          "Requires an alert or it hides failures.",
          "Requires a replay mechanism to be useful.",
          "Retention limits mean messages can still be lost.",
          "Ordering is broken for messages that were dead-lettered."
        ],
        avoid: [
          "You will not monitor it — an unwatched DLQ hides problems.",
          "Messages are genuinely disposable, where dropping is acceptable.",
          "The system requires strict ordering and skipping a message is " +
            "unacceptable.",
          "You have no plan for reprocessing what lands there."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "graceful-degradation",

      why: {
        before: "A page rendered fully or returned an error. If any dependency " +
          "failed, the request failed — all-or-nothing.",
        problem: "That makes the whole system only as available as its **least " +
          "reliable dependency**. A product page needing six services with " +
          "99.9% availability each is 99.4% available overall — and most of " +
          "those services are not essential. A recommendations outage should " +
          "not prevent someone buying something.",
        shift: "**Rank dependencies by criticality and degrade rather than " +
          "fail.** Show the product, the price and the buy button; omit the " +
          "recommendations. The user gets a reduced but useful experience " +
          "instead of an error page, and the core transaction still completes."
      },

      num: {
        t: "Availability compounds — unless you degrade",
        h: ["Dependencies (99.9% each)", "All required", "Only 1 required"],
        r: [
          ["1", "99.9%", "99.9%"],
          ["3", "99.7%", "**99.9%**"],
          ["6", "**99.4%**", "**99.9%**"],
          ["10", "**99.0%**", "**99.9%**"]
        ],
        n: "The middle column is why *just make everything reliable* does not " +
          "work: **availability multiplies**, so ten good dependencies produce " +
          "a mediocre system. Degradation breaks the multiplication for " +
          "everything you can do without. Making it work requires three " +
          "things: an explicit **criticality ranking** (which failures are " +
          "acceptable), a **fallback** for each non-critical dependency " +
          "(cached data, a default, an omitted section), and **timeouts short " +
          "enough to degrade before the user gives up** — a fallback that " +
          "triggers after 30 seconds has not helped anyone. The pattern pairs " +
          "naturally with **circuit breakers**, which decide when to stop " +
          "calling and start serving the fallback."
      },

      miss: [
        {
          w: "Graceful degradation means catching exceptions and continuing.",
          r: "It means **deciding in advance** what the reduced experience is. " +
            "Swallowing an exception and rendering an empty region is not " +
            "degradation — it is a broken page. The fallback must be a " +
            "deliberate, designed state."
        },
        {
          w: "You should degrade for any dependency failure.",
          r: "Only for **non-critical** ones. Silently degrading a payment " +
            "confirmation or a permission check produces something worse than " +
            "an error — an operation that appears to have worked. Criticality " +
            "must be explicit per dependency."
        },
        {
          w: "The user should not notice the degradation.",
          r: "Often they should. Silently serving stale prices or an incomplete " +
            "list erodes trust when discovered. A brief *some features are " +
            "temporarily unavailable* is usually better than pretending, " +
            "particularly where the missing data affects a decision."
        },
        {
          w: "Timeouts are a separate concern from degradation.",
          r: "They are the **trigger**. A fallback that only fires after a " +
            "30-second timeout is useless — the user left. Timeouts must be " +
            "short enough that degrading is faster than the user's patience, " +
            "which usually means single-digit seconds at most."
        }
      ],

      trade: {
        buys: [
          "System availability stops being the product of its dependencies.",
          "Core functionality survives peripheral outages.",
          "Better user experience than an error page.",
          "Buys time to fix the underlying problem."
        ],
        costs: [
          "Every fallback path is code to write, test and maintain.",
          "Degraded paths are rarely exercised, so they rot.",
          "Silent degradation can mislead users.",
          "Requires explicit criticality decisions."
        ],
        avoid: [
          "The dependency is genuinely critical — payment, authentication.",
          "Degraded output would be misleading rather than merely reduced.",
          "You cannot test the fallback paths; untested fallbacks fail when " +
            "needed.",
          "There is no meaningful reduced experience to offer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cache-invalidation",

      why: {
        before: "A cache stored a computed value and served it on subsequent " +
          "requests. Enormously effective, and the value was assumed to stay " +
          "correct.",
        problem: "The underlying data changes, and the cache does not know. " +
          "Now you have two copies of the truth and one of them is wrong — " +
          "and the system cannot tell which. This is why Phil Karlton's line " +
          "about the two hard problems in computer science is quoted so often: " +
          "**knowing when a cached value became wrong is genuinely difficult**.",
        shift: "Choose an invalidation strategy **explicitly**, understanding " +
          "that each is a different trade between staleness, complexity and " +
          "load. The options are bounded and each has a characteristic " +
          "failure."
      },

      num: {
        t: "Invalidation strategies",
        h: ["Strategy", "Staleness", "Complexity", "Fails by"],
        r: [
          ["**TTL expiry**", "**bounded, always present**", "**trivial**", "serving stale data"],
          ["Explicit invalidation on write", "near-zero", "**high**", "**missing a key**"],
          ["Write-through", "none", "moderate", "slower writes"],
          ["Versioned keys", "none", "moderate", "unbounded growth"],
          ["**Stale-while-revalidate**", "brief, in background", "moderate", "brief staleness"]
        ],
        n: "**TTL is the pragmatic default precisely because it cannot be " +
          "forgotten.** Explicit invalidation is correct when it works and " +
          "requires knowing **every key derived from the changed data**, " +
          "across every layer — application cache, CDN, browser — and missing " +
          "one produces stale data that persists indefinitely with no " +
          "expiry to save you. **Versioned keys** sidestep the problem " +
          "entirely: include a version or timestamp in the key, so updating " +
          "the data changes the key and the old entry simply ages out. Two " +
          "operational hazards to design for: **stampedes** (jitter the TTLs, " +
          "or use single-flight) and **multi-layer caching**, where " +
          "invalidating your application cache does nothing about the CDN " +
          "copy."
      },

      miss: [
        {
          w: "Explicit invalidation is more correct than TTL.",
          r: "It is more correct **when you get every key**. Missing one leaves " +
            "data stale **forever**, with no expiry as a backstop. TTL is " +
            "always slightly stale and **self-healing**, which is often the " +
            "better failure mode."
        },
        {
          w: "Invalidating the cache means deleting the key.",
          r: "Deleting causes the next request to miss and recompute — and " +
            "under load, **many** requests miss simultaneously and all " +
            "recompute. **Updating** the value in place, or serving stale while " +
            "refreshing behind, avoids the stampede."
        },
        {
          w: "You only need to invalidate your own cache.",
          r: "Caches are layered: browser, CDN, reverse proxy, application, " +
            "database buffer pool. Invalidating the application cache does " +
            "nothing about a CDN copy with an hour of TTL remaining. Cache " +
            "headers must be planned alongside application invalidation."
        },
        {
          w: "Longer TTLs are riskier than shorter ones.",
          r: "Longer TTLs mean more staleness and **fewer, larger stampedes**. " +
            "Shorter ones mean fresher data and more origin load. Neither is " +
            "riskier in general — and **jittering** the TTL matters more than " +
            "its length, because unjittered TTLs set during a deploy all expire " +
            "together."
        }
      ],

      trade: {
        buys: [
          "Keeps a cache useful without serving indefinitely stale data.",
          "TTL is trivial and self-healing.",
          "Explicit invalidation gives near-real-time freshness.",
          "Versioned keys sidestep invalidation entirely."
        ],
        costs: [
          "Explicit invalidation must find every derived key.",
          "Multi-layer caches multiply the problem.",
          "Deletion causes stampedes under load.",
          "Every strategy trades staleness against complexity."
        ],
        avoid: [
          "The data must always be current — do not cache it.",
          "You cannot enumerate the keys a change affects — use TTL or " +
            "versioned keys instead.",
          "The computation is cheap enough that caching adds risk for little " +
            "gain.",
          "You would use explicit invalidation without a TTL backstop."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "modular-monolith",

      why: {
        before: "The choice was presented as binary: a **monolith** (simple to " +
          "deploy, tends toward tangled coupling) or **microservices** " +
          "(independently deployable, distributed-system complexity).",
        problem: "Many teams adopted microservices to escape a tangled " +
          "monolith and got a **distributed monolith** — services that must be " +
          "deployed together, share a database, and now have network calls " +
          "between the tangles. They took on distributed complexity and kept " +
          "the coupling.",
        shift: "Recognise that **modularity and distribution are independent " +
          "decisions**. A modular monolith enforces strict boundaries between " +
          "modules — separate schemas, communication only through public " +
          "interfaces — inside a **single deployable**. You get the " +
          "architectural discipline without the network."
      },

      num: {
        t: "Three positions",
        h: ["", "Big-ball-of-mud", "**Modular monolith**", "Microservices"],
        r: [
          ["Deployment", "one unit", "**one unit**", "many"],
          ["Boundaries", "**none**", "**enforced in code**", "network-enforced"],
          ["Transactions", "**local ACID**", "**local ACID**", "**sagas**"],
          ["Debugging", "one process", "**one process, one trace**", "distributed tracing"],
          ["Scaling", "whole app", "whole app", "**per service**"],
          ["Team independence", "low", "moderate", "**high**"]
        ],
        n: "The **transactions** row is the underrated advantage: a modular " +
          "monolith keeps **local ACID transactions across module " +
          "boundaries**, where microservices need sagas with compensating " +
          "actions. That single difference removes an enormous amount of " +
          "complexity. Enforcement is what makes the pattern real rather than " +
          "aspirational — **ArchUnit** in Java, module systems, or simply " +
          "separate database schemas with no cross-schema queries. Without " +
          "mechanical enforcement, module boundaries erode exactly as they did " +
          "in the monolith. The strategic argument is that a modular monolith " +
          "is also the **best preparation for extraction**: when a module " +
          "genuinely needs independent scaling, a clean boundary makes it a " +
          "tractable change rather than a rewrite."
      },

      miss: [
        {
          w: "A modular monolith is a stepping stone you will outgrow.",
          r: "It is a **valid destination**. Shopify, GitHub and Stack Overflow " +
            "run enormous modular monoliths. Extraction should be driven by a " +
            "specific need — independent scaling, team autonomy, isolation — " +
            "not by an assumed progression."
        },
        {
          w: "Modules just need to be in separate packages or namespaces.",
          r: "Without **enforcement**, boundaries erode. Someone imports an " +
            "internal class, queries another module's tables directly, and the " +
            "modularity is gone. Tooling that fails the build on a boundary " +
            "violation is what makes it hold."
        },
        {
          w: "You cannot scale a monolith.",
          r: "You scale it **horizontally** — run more instances behind a load " +
            "balancer. What you cannot do is scale **one module " +
            "independently**. If one component genuinely needs ten times the " +
            "resources of the rest, that is a real argument for extraction; " +
            "otherwise it is not."
        },
        {
          w: "Microservices are better for large teams.",
          r: "They help when teams need **independent deployment**. A modular " +
            "monolith with clear module ownership works well for many large " +
            "teams, and avoids the distributed-systems tax. Team size alone is " +
            "not the deciding factor — deployment coupling is."
        }
      ],

      trade: {
        buys: [
          "Enforced boundaries without distributed complexity.",
          "Local ACID transactions across module boundaries.",
          "One deployment, one log, one trace — vastly simpler debugging.",
          "No network latency between modules.",
          "Clean boundaries make later extraction tractable."
        ],
        costs: [
          "All modules deploy together.",
          "Cannot scale one module independently.",
          "One language and runtime for everything.",
          "A failure can affect the whole process.",
          "Boundary enforcement needs tooling and discipline."
        ],
        avoid: [
          "One component genuinely needs independent scaling.",
          "Teams must deploy on independent schedules.",
          "Different components need different languages or runtimes.",
          "You need strong fault isolation between components.",
          "The system is small enough that even modules are overhead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "server-sent-events",

      why: {
        before: "Getting updates from a server meant **polling** — asking " +
          "every few seconds whether anything changed. Wasteful when nothing " +
          "has, and always slightly stale.",
        problem: "**WebSockets** solve it with full-duplex communication, and " +
          "they are a different protocol: they need an upgrade handshake, they " +
          "do not work through some proxies, they lose HTTP's semantics " +
          "(caching, auth headers, compression), and you must implement " +
          "reconnection yourself.",
        shift: "For **one-way** server-to-client streaming — notifications, " +
          "live scores, progress updates, LLM token streaming — you do not " +
          "need full duplex. SSE keeps an **ordinary HTTP connection** open " +
          "and streams text events down it, with **automatic reconnection and " +
          "event-id resumption built into the browser**."
      },

      num: {
        t: "SSE against WebSockets against polling",
        h: ["", "SSE", "WebSocket", "Polling"],
        r: [
          ["Direction", "**server → client**", "**bidirectional**", "client-initiated"],
          ["Protocol", "**plain HTTP**", "upgrade to ws://", "HTTP"],
          ["**Auto-reconnect**", "**built in**", "**you implement it**", "n/a"],
          ["Resume after drop", "**`Last-Event-ID` header**", "manual", "n/a"],
          ["Binary data", "**no — text only**", "yes", "yes"],
          ["**HTTP/1.1 connection limit**", "**6 per domain**", "not affected", "affected"]
        ],
        n: "**Automatic reconnection with `Last-Event-ID` is SSE's most " +
          "underrated feature**: the browser reconnects on its own and sends " +
          "the last event id it received, so the server can resume from that " +
          "point. With WebSockets you write all of that yourself, and most " +
          "implementations get it partly wrong. The trap is the last row: " +
          "**over HTTP/1.1 browsers allow only six connections per domain**, " +
          "and an open SSE stream consumes one — so a user with several tabs " +
          "open can exhaust the limit and block ordinary requests. **HTTP/2 " +
          "multiplexing removes this entirely**, which is why SSE became " +
          "practical again. It is also what **LLM token streaming** uses, " +
          "including OpenAI's API."
      },

      miss: [
        {
          w: "WebSockets are strictly better than SSE.",
          r: "They are better for **bidirectional** communication. For " +
            "one-way streaming SSE is simpler: plain HTTP, automatic " +
            "reconnection, works through proxies, keeps auth headers and " +
            "compression. Choosing WebSockets for a one-way feed means " +
            "implementing reconnection you would have got free."
        },
        {
          w: "SSE cannot send data from client to server.",
          r: "The **stream** is one-way; the client makes ordinary HTTP " +
            "requests for anything it needs to send. For most applications " +
            "that is entirely sufficient — a chat client posts messages by " +
            "POST and receives them by SSE."
        },
        {
          w: "The six-connection limit makes SSE unusable.",
          r: "It applies to **HTTP/1.1** only. Over HTTP/2 streams are " +
            "multiplexed over one connection and the limit disappears. Since " +
            "HTTP/2 is near-universal, this is largely a historical concern — " +
            "and a real one if you must support HTTP/1.1."
        },
        {
          w: "You need a library to use SSE.",
          r: "`EventSource` is **built into every modern browser** and is a few " +
            "lines to use. The server side is plain HTTP with " +
            "`Content-Type: text/event-stream` and a specific text format. " +
            "Libraries add convenience, not capability."
        }
      ],

      trade: {
        buys: [
          "Automatic reconnection and resumption, free.",
          "Plain HTTP — works with proxies, auth, compression, caching.",
          "Built into browsers via `EventSource`.",
          "Simple server implementation.",
          "The standard mechanism for LLM token streaming."
        ],
        costs: [
          "One-way only.",
          "Text only — binary needs encoding.",
          "Six-connection limit on HTTP/1.1.",
          "Long-lived connections consume server resources.",
          "Some proxies buffer responses and break streaming."
        ],
        avoid: [
          "You need genuine bidirectional, low-latency communication — " +
            "**WebSockets**.",
          "You need binary data.",
          "Updates are rare and polling would be simpler.",
          "You must support HTTP/1.1 with many concurrent streams per user."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sticky-session",

      why: {
        before: "A load balancer distributed requests across identical servers, " +
          "and any server could serve any request. That is what made " +
          "horizontal scaling work.",
        problem: "Applications kept **session state in memory** — logged-in " +
          "user, shopping cart, wizard progress. Route the next request to a " +
          "different server and that state is gone, so the user is logged out " +
          "mid-checkout.",
        shift: "**Pin each client to one server.** The load balancer routes by " +
          "a cookie or source IP so a session always reaches the same " +
          "instance. It works, and it **undoes much of the point of load " +
          "balancing** — which is why it should be understood as a workaround " +
          "rather than a design."
      },

      num: {
        t: "What stickiness costs",
        h: ["Property", "Stateless", "Sticky"],
        r: [
          ["Load distribution", "**even**", "**uneven — long sessions pile up**"],
          ["Draining a server", "**immediate**", "**wait, or drop sessions**"],
          ["Server failure", "transparent", "**those users lose state**"],
          ["Autoscaling", "**effective**", "new servers get no existing traffic"],
          ["Deployment", "rolling, invisible", "disruptive"]
        ],
        n: "The **draining** row is where stickiness hurts most in practice: " +
          "you cannot remove a server for deployment without either waiting " +
          "for every session to end — which may be hours — or dropping them. " +
          "That turns routine deploys into a scheduling problem. The correct " +
          "fix is almost always to **externalise the session**: put it in " +
          "Redis, or use a **signed token** (JWT or an encrypted cookie) so " +
          "the state travels with the request and any server can handle it. " +
          "The legitimate remaining uses are narrow — **WebSocket " +
          "connections** are inherently bound to one server, and a large " +
          "**in-memory cache** per server can make stickiness a genuine " +
          "performance win rather than a crutch."
      },

      miss: [
        {
          w: "Sticky sessions are a normal way to handle logged-in users.",
          r: "They are a **workaround for in-memory session state**. The " +
            "standard approach is externalising sessions to Redis or using " +
            "signed tokens, which keeps servers stateless and every benefit of " +
            "load balancing intact."
        },
        {
          w: "Stickiness only affects load distribution.",
          r: "It affects **deployment, autoscaling and failure handling**. You " +
            "cannot drain a server quickly, new instances receive no existing " +
            "traffic, and an instance failure loses its users' state. The " +
            "operational cost exceeds the balancing cost."
        },
        {
          w: "IP-based stickiness is a reliable way to pin sessions.",
          r: "Many users share an IP — corporate NAT, mobile carriers — so a " +
            "large group lands on one server. And mobile clients change IP when " +
            "switching networks, losing their session. **Cookie-based** " +
            "stickiness is more reliable where stickiness is needed at all."
        },
        {
          w: "WebSockets require sticky sessions.",
          r: "A WebSocket **connection** is bound to one server by nature, and " +
            "that is not the same as session stickiness — a reconnecting client " +
            "can be routed anywhere if the application state lives elsewhere. " +
            "Externalising state still applies."
        }
      ],

      trade: {
        buys: [
          "In-memory session state works without externalising it.",
          "Per-server caches stay warm for a given user.",
          "Trivial to enable at the load balancer.",
          "Necessary for long-lived connections in some designs."
        ],
        costs: [
          "Uneven load distribution.",
          "Draining a server means waiting or dropping sessions.",
          "Server failure loses its users' state.",
          "Undermines autoscaling.",
          "Makes rolling deployments disruptive."
        ],
        avoid: [
          "You can externalise session state — Redis or signed tokens.",
          "You need effective autoscaling or frequent deployments.",
          "Sessions are long-lived, making draining impractical.",
          "You are using it to avoid designing stateless servers, which is " +
            "the usual reason."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "twelve-factor-app",

      why: {
        before: "Applications were deployed onto **specific servers** with " +
          "hand-tuned configuration, local file storage, and OS services " +
          "installed and configured by hand. Each environment was unique and " +
          "assembled by someone who remembered how.",
        problem: "Nothing is reproducible. Staging differs from production in " +
          "ways nobody has documented, scaling means replicating a hand-built " +
          "machine, and a server failure means rebuilding from memory. Cloud " +
          "platforms made this worse by making instances disposable.",
        shift: "Heroku codified **twelve principles** for applications suited " +
          "to cloud deployment, and the through-line is: **the application is " +
          "stateless and disposable, everything environment-specific comes " +
          "from configuration, and every backing service is an attached " +
          "resource.** It became the de facto standard for cloud-native design " +
          "long before Kubernetes."
      },

      num: {
        t: "The factors that matter most in practice",
        h: ["Factor", "Rule", "Why"],
        r: [
          ["**III. Config**", "**in the environment, not the code**", "**same build, every environment**"],
          ["IV. Backing services", "attached resources", "swap a database with a URL change"],
          ["**VI. Processes**", "**stateless and share-nothing**", "**any instance serves any request**"],
          ["IX. Disposability", "fast start, graceful shutdown", "autoscaling and rolling deploys"],
          ["**X. Dev/prod parity**", "**keep them similar**", "*works on my machine*"],
          ["XI. Logs", "**write to stdout**", "the platform handles routing"]
        ],
        n: "**Config in the environment** is the single most consequential " +
          "factor: it means one build artefact is promoted unchanged through " +
          "staging to production, so what you tested is exactly what ships. " +
          "Config baked into the build means rebuilding per environment, which " +
          "reintroduces the problem the whole methodology exists to remove. " +
          "**Logs to stdout** is the one most often violated by habit — " +
          "applications writing to files require log shipping, rotation and " +
          "volume mounts, where a stream lets the platform route it. Note that " +
          "the methodology **predates Kubernetes** and containers: it was " +
          "written for Heroku, and much of what Kubernetes assumes about " +
          "applications is essentially these twelve rules made mandatory."
      },

      miss: [
        {
          w: "Twelve-factor is outdated because it predates Kubernetes.",
          r: "Kubernetes **assumes** most of it — stateless processes, config " +
            "from environment, logs to stdout, graceful shutdown. The " +
            "methodology described what platforms would come to require. Some " +
            "factors have aged (the build/release/run split is more nuanced " +
            "now), and the core holds."
        },
        {
          w: "Config in the environment means environment variables " +
            "specifically.",
          r: "The principle is **config lives outside the build artefact**. " +
            "Environment variables were Heroku's mechanism; secret managers, " +
            "mounted config files and parameter stores all satisfy it — and " +
            "are better for secrets, which environment variables leak into " +
            "process listings and crash dumps."
        },
        {
          w: "Stateless means the application stores no data.",
          r: "It means the **process** holds no state between requests. Data " +
            "lives in attached backing services — databases, caches, object " +
            "storage. The point is that any instance can serve any request and " +
            "instances can be destroyed freely."
        },
        {
          w: "You must follow all twelve factors.",
          r: "They are **guidance for a particular deployment model**. A batch " +
            "job, a desktop application or a stateful database does not fit, " +
            "and forcing it produces awkward architecture. Apply the ones that " +
            "match how the thing actually runs."
        }
      ],

      trade: {
        buys: [
          "One build artefact promoted unchanged across environments.",
          "Horizontal scaling by adding identical instances.",
          "Fast, reliable deployment and rollback.",
          "Backing services swappable by configuration.",
          "Aligns with what modern platforms expect."
        ],
        costs: [
          "Externalising state is real work for existing applications.",
          "Strict statelessness rules out some in-memory optimisations.",
          "Environment variables are a poor place for secrets.",
          "Not every workload fits the model."
        ],
        avoid: [
          "The workload is inherently stateful — a database, a stateful " +
            "stream processor.",
          "It is a desktop or mobile application, where the model does not " +
            "apply.",
          "You would use environment variables for secrets rather than a " +
            "secret manager.",
          "The application is a batch job with a different lifecycle."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
