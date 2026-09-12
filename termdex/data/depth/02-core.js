/* ==========================================================================
   Depth pass 2 — networking, the web, and how software actually ships.
   Same four sections, same rule: nothing here replaces existing content.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "tcp",

      why: {
        before: "The network layer below TCP — IP — makes no promises at all. " +
          "Packets can arrive out of order, arrive twice, or vanish entirely, " +
          "and IP will not tell you which happened.",
        problem: "Almost no application wants that. A file transfer that " +
          "silently drops a packet produces a corrupt file. Every program " +
          "would have to reimplement ordering, retransmission and duplicate " +
          "detection, and each would get it subtly wrong.",
        shift: "Put the reliability in one place, below the application. TCP " +
          "numbers every byte, acknowledges what arrived, retransmits what did " +
          "not, and hands the application a clean ordered stream. The " +
          "application writes bytes and reads bytes; everything else is hidden."
      },

      num: {
        t: "The cost of setting up a connection",
        h: ["Step", "Round trips", "At 50ms RTT"],
        r: [
          ["TCP handshake (SYN, SYN-ACK, ACK)", "1", "50ms"],
          ["TLS 1.2 handshake", "2", "100ms"],
          ["TLS 1.3 handshake", "1", "50ms"],
          ["First byte of data (TCP + TLS 1.3)", "2", "100ms"]
        ],
        n: "You pay **100ms before a single byte of your request is sent**, on " +
          "a link where the data itself might take 5ms. This is why connection " +
          "reuse matters more than almost any other optimisation: HTTP " +
          "keep-alive, connection pools and HTTP/2 multiplexing all exist to " +
          "amortise this. It is also why **slow start** hurts — a new " +
          "connection begins by sending only ~10 packets and doubles each " +
          "round trip, so a fresh connection is slow even after it is open."
      },

      miss: [
        {
          w: "TCP guarantees my data arrives.",
          r: "It guarantees that *if* it arrives it is in order and " +
            "uncorrupted, and it will retry — but a connection can fail " +
            "permanently. A successful `write()` means the data reached your " +
            "kernel's send buffer, **not** that it reached the other machine, " +
            "and certainly not that the application there processed it. If you " +
            "need to know it was handled, the other end must tell you."
        },
        {
          w: "A TCP connection is a physical thing that stays open.",
          r: "It is only shared state — a handful of numbers at each end. If " +
            "both sides go quiet, nothing on the wire keeps it alive, and a " +
            "NAT or firewall in between will silently drop the mapping after " +
            "a few minutes. Neither end is told. That is why long-lived " +
            "connections need keep-alives, and why a socket can appear open " +
            "yet be dead."
        },
        {
          w: "TCP is slow because of the handshake.",
          r: "The handshake is one round trip. What actually limits throughput " +
            "on a fast, long link is the **window**: TCP will not have more " +
            "than one window of unacknowledged data in flight, so maximum " +
            "throughput is roughly *window ÷ RTT*. With a 64KB window and a " +
            "100ms RTT that caps you at about 5 Mbit/s no matter how fast the " +
            "link is. Window scaling exists to fix exactly this."
        },
        {
          w: "Packet loss means a bad network cable.",
          r: "On the internet, loss is mostly **congestion** — a router's queue " +
            "filled and it dropped what it could not hold. TCP treats loss as " +
            "its congestion signal and deliberately slows down. This is why a " +
            "single lossy hop tanks throughput far more than the loss rate " +
            "suggests, and why bufferbloat is so damaging: oversized queues " +
            "hide the loss signal until latency is already terrible."
        }
      ],

      trade: {
        buys: [
          "An ordered, reliable byte stream — the application ignores loss " +
            "entirely.",
          "Congestion control that keeps the shared network usable.",
          "Universally supported, and traverses almost any middlebox."
        ],
        costs: [
          "A round trip before any data moves, plus slow start after that.",
          "**Head-of-line blocking**: one lost packet stalls everything behind " +
            "it, even data that already arrived.",
          "Per-connection state at both ends, which bounds how many a server " +
            "can hold."
        ],
        avoid: [
          "Live audio or video, where a late packet is worthless — **UDP** and " +
            "conceal the gap instead.",
          "You are multiplexing many independent streams and one stalling all " +
            "of them is unacceptable — this is exactly why **QUIC** was built " +
            "on UDP.",
          "A single small request-response, such as a DNS query, where the " +
            "handshake costs more than the data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cache",

      why: {
        before: "Every request did the full work — query the database, render " +
          "the page, call the service — even when the answer was identical to " +
          "the one given a second earlier.",
        problem: "Storage is a pyramid and each level down is roughly two " +
          "orders of magnitude slower. A CPU register is under a nanosecond; " +
          "RAM is ~100ns; an SSD is ~100µs; a cross-region network call is " +
          "~100ms. Recomputing something you already know wastes the entire " +
          "difference.",
        shift: "Keep the answer closer to where it is needed. Every cache is " +
          "the same bet: that the same thing will be asked for again soon " +
          "(**temporal locality**), and that memory is cheaper than the work."
      },

      num: {
        t: "Latency, and what a cache saves",
        h: ["Where the answer comes from", "Typical latency", "Relative"],
        r: [
          ["CPU L1 cache", "~1ns", "1×"],
          ["RAM", "~100ns", "100×"],
          ["In-process cache", "~100ns", "100×"],
          ["Redis, same datacentre", "~0.5ms", "500,000×"],
          ["SSD read", "~100µs", "100,000×"],
          ["Database query", "~5ms", "5,000,000×"],
          ["Cross-region call", "~100ms", "100,000,000×"]
        ],
        n: "Hit rate dominates everything, and the maths is unkind. At a **95%** " +
          "hit rate with a 0.5ms cache and a 50ms miss, the average is " +
          "`0.95×0.5 + 0.05×50 = 2.9ms` — the 5% of misses account for **86%** " +
          "of the total time. Going from 95% to 99% roughly halves average " +
          "latency. This is why cache tuning is almost always about the misses."
      },

      miss: [
        {
          w: "Caching makes everything faster.",
          r: "It makes *repeated* reads faster and adds a consistency problem " +
            "you did not have. Every cache is a second copy of the truth, and " +
            "now you own the question of when it is wrong. Phil Karlton's line " +
            "is famous because it is true: the two hard problems are cache " +
            "invalidation and naming things."
        },
        {
          w: "I will just clear the cache when the data changes.",
          r: "That is the hard part, not the easy part. You have to know every " +
            "key derived from the changed data, across every layer — browser, " +
            "CDN, application, database buffer pool — and some of them you do " +
            "not control. This is why **TTL-based expiry** is so common: it is " +
            "not more correct, it just bounds how long you are wrong."
        },
        {
          w: "A bigger cache is a better cache.",
          r: "Only up to the working set. Past that you are paying for memory " +
            "that holds things nobody asks for. Worse, a large cache makes " +
            "**cold starts** dangerous: restart a service with an empty cache " +
            "and the full load hits your database at once. That is a *thundering " +
            "herd*, and it takes systems down."
        },
        {
          w: "Cache misses are just slow — they are not dangerous.",
          r: "They can be fatal. If a hot key expires and a thousand requests " +
            "all miss simultaneously, all thousand hit the database at once — " +
            "**cache stampede**. The fixes are a lock so one request " +
            "recomputes while the rest wait, or jittered TTLs so keys do not " +
            "expire together, or serving stale data while refreshing behind it."
        }
      ],

      trade: {
        buys: [
          "Orders of magnitude less latency on repeated reads.",
          "Large reduction in load on the expensive system underneath.",
          "Absorbs traffic spikes that would otherwise reach the database."
        ],
        costs: [
          "A second copy of the truth, and therefore staleness you must reason " +
            "about.",
          "Memory, and an eviction policy that is another thing to tune.",
          "A new failure mode: stampedes and cold starts can be worse than no " +
            "cache at all.",
          "Harder debugging — *works for me* is often *I have a warm cache*."
        ],
        avoid: [
          "The data must be exactly current — a bank balance, a stock count at " +
            "checkout, a permission check.",
          "Reads are not repeated. Caching unique keys is pure overhead.",
          "The underlying operation is already fast; a cache in front of a 1ms " +
            "query buys almost nothing and costs correctness.",
          "Writes vastly outnumber reads, so entries are invalidated before " +
            "they are ever read."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "idempotency",

      why: {
        before: "A client sent a request and waited. If the reply never " +
          "arrived, it retried — and hoped.",
        problem: "A lost *response* is indistinguishable from a lost *request*. " +
          "The client cannot tell whether the payment went through and the " +
          "receipt was lost, or nothing happened at all. Retrying might charge " +
          "the customer twice; not retrying might charge them zero.",
        shift: "Make repeating the request harmless. If the second attempt " +
          "produces the same result as the first, the client can retry freely " +
          "and the ambiguity disappears. It is the property that makes " +
          "distributed systems recoverable at all."
      },

      num: {
        t: "HTTP methods, by design",
        h: ["Method", "Idempotent", "Safe"],
        r: [
          ["`GET`", "yes", "yes"],
          ["`HEAD`", "yes", "yes"],
          ["`PUT`", "yes", "no"],
          ["`DELETE`", "yes", "no"],
          ["`POST`", "**no**", "no"],
          ["`PATCH`", "not necessarily", "no"]
        ],
        n: "`DELETE` is idempotent even though the first call changes state and " +
          "the second does not: the *end state* is identical, which is the " +
          "actual definition. `POST` is the odd one out, and it is why payment " +
          "APIs require an **idempotency key** — a client-generated id that the " +
          "server stores with the result, so a repeat of the same key returns " +
          "the original outcome instead of charging again. Stripe keeps these " +
          "keys for **24 hours**."
      },

      miss: [
        {
          w: "Idempotent means the function has no side effects.",
          r: "That is *safe*, a different property. `DELETE` has a very real " +
            "side effect and is still idempotent — running it five times " +
            "leaves the same world as running it once. Safe means *changes " +
            "nothing*; idempotent means *changes nothing further*."
        },
        {
          w: "Idempotent means it returns the same response every time.",
          r: "It means the same **state**. A repeated `DELETE` may legitimately " +
            "return `204` the first time and `404` after. The resource is gone " +
            "either way, which is what the property is about. Some APIs return " +
            "`204` every time purely to make retrying clients simpler."
        },
        {
          w: "My endpoint is idempotent because it uses `PUT`.",
          r: "The method is a *promise you are making*, not a guarantee the " +
            "framework enforces. A `PUT` that appends to a list, increments a " +
            "counter or sends an email is not idempotent no matter what verb it " +
            "is behind. The HTTP spec describes intended semantics; your code " +
            "has to honour them."
        },
        {
          w: "Adding an idempotency key makes retries safe.",
          r: "Only if the key is stored **atomically with the effect**. If you " +
            "charge the card and then record the key, a crash between those two " +
            "steps gives you a double charge on retry. The write of the key and " +
            "the work must be in one transaction, or you need a state machine " +
            "that can recover from the half-done state."
        }
      ],

      trade: {
        buys: [
          "Retries become safe, which is what makes at-least-once delivery " +
            "usable.",
          "Network timeouts stop being ambiguous.",
          "Message queues, load balancers and clients can all retry without " +
            "coordination."
        ],
        costs: [
          "Storage and lookup for keys or deduplication state.",
          "That state needs its own expiry policy and its own consistency " +
            "story.",
          "Some operations are genuinely awkward to make idempotent — anything " +
            "naturally expressed as *add one*."
        ],
        avoid: [
          "The operation is genuinely incremental and the client can send a " +
            "target value instead — prefer `set balance to 90` over " +
            "`subtract 10`.",
          "Exactly-once is achievable end to end, such as within a single " +
            "database transaction; you do not need the ceremony.",
          "The cost of the duplicate is trivially small and detectable later " +
            "— sometimes reconciliation is cheaper than prevention."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "docker",

      why: {
        before: "Software was installed onto servers. Dependencies, library " +
          "versions and config were properties of the *machine*, built up over " +
          "months by hand and by scripts nobody fully remembered.",
        problem: "*Works on my machine* was structurally true. Production had " +
          "a different libc, a different Python patch version, a different " +
          "environment variable — and the difference only revealed itself at " +
          "the worst moment. Reproducing a bug meant reproducing a whole server.",
        shift: "Ship the dependencies **with** the application as one immutable " +
          "image. The kernel is shared with the host, so unlike a virtual " +
          "machine there is no second operating system to boot — which is why " +
          "a container starts in milliseconds and a VM takes tens of seconds."
      },

      num: {
        t: "Container against virtual machine",
        h: ["Property", "Container", "Virtual machine"],
        r: [
          ["Start time", "~50–500ms", "~30–60s"],
          ["Image size", "5MB–1GB", "1–20GB"],
          ["Memory overhead", "~0 (shared kernel)", "512MB–2GB per guest"],
          ["Density per host", "100s", "10s"],
          ["Isolation boundary", "kernel namespaces", "hypervisor"]
        ],
        n: "The isolation row is the one that matters for security. Containers " +
          "share the host kernel, so a kernel vulnerability is a path out of " +
          "the container; a VM has a much smaller attack surface. This is why " +
          "multi-tenant platforms running untrusted code use " +
          "**microVMs** (Firecracker, gVisor) rather than plain containers — " +
          "they want VM isolation with container start times."
      },

      miss: [
        {
          w: "A container is a lightweight virtual machine.",
          r: "It is a **process** on the host with a restricted view of the " +
            "world — namespaces limit what it can see, cgroups limit what it " +
            "can use. Run `ps` on the host and you see the container's " +
            "processes listed like any other. There is no guest kernel, and " +
            "nothing is being emulated."
        },
        {
          w: "Docker makes my application portable everywhere.",
          r: "Portable across *hosts with a compatible kernel and the same CPU " +
            "architecture*. An image built on an Apple Silicon Mac will not run " +
            "on an x86 server without a rebuild or emulation, and a container " +
            "built against a new kernel feature will fail on an older host. " +
            "This surprises people constantly."
        },
        {
          w: "Data in a container is saved.",
          r: "The writable layer dies with the container. Anything that must " +
            "outlive it needs a **volume** or a bind mount. Losing a database " +
            "because it was written into the container filesystem is one of " +
            "the most common first mistakes."
        },
        {
          w: "`latest` is the latest version.",
          r: "It is just the default tag, and it points at whatever was pushed " +
            "last — which may be older than another tag, and will silently " +
            "change under you. Deploying `:latest` means two servers started an " +
            "hour apart can be running different code. Always pin a version, " +
            "ideally by digest."
        }
      ],

      trade: {
        buys: [
          "One artefact that runs identically on a laptop, in CI and in " +
            "production.",
          "Start times in milliseconds, which is what makes autoscaling and " +
            "per-request isolation practical.",
          "Dependency conflicts stop being a machine-level problem.",
          "Immutable images make rollback trivial — redeploy the old tag."
        ],
        costs: [
          "Weaker isolation than a VM: shared kernel, larger blast radius.",
          "Another layer to debug — networking, storage and DNS all now have a " +
            "container-shaped answer.",
          "Image sprawl and registry storage, which grows quietly.",
          "Stateful workloads need real thought about volumes and ordering."
        ],
        avoid: [
          "You are running genuinely untrusted code — use a VM or a microVM.",
          "The workload needs direct hardware or a specific kernel version.",
          "It is a single static binary on one server; a container may add more " +
            "operational surface than it removes.",
          "A desktop application with a GUI, where the model fits badly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rest",

      why: {
        before: "Services talked over SOAP and XML-RPC: heavy XML envelopes, a " +
          "WSDL contract to generate clients from, and a new verb invented for " +
          "every operation.",
        problem: "The complexity was in the wrong place. Every API was its own " +
          "vocabulary, so nothing was cacheable by generic infrastructure, " +
          "nothing was inspectable without tooling, and every integration " +
          "started with reading a schema.",
        shift: "Fielding's 2000 dissertation observed that the **web itself** " +
          "already scaled to a planet, and asked what properties made that " +
          "work. The answer: address things as resources with URLs, use the " +
          "verbs HTTP already has, and keep each request self-contained. Do " +
          "that and every proxy, cache and CDN in the world already understands " +
          "your API."
      },

      num: {
        t: "Status codes people actually get wrong",
        h: ["Code", "Means", "Common misuse"],
        r: [
          ["`200`", "OK", "returned with an error in the body"],
          ["`201`", "Created", "used where `200` is right"],
          ["`400`", "Client sent something invalid", "used for auth failures"],
          ["`401`", "Not authenticated", "used when the user *is* known"],
          ["`403`", "Authenticated, not allowed", "confused with `401`"],
          ["`404`", "No such resource", "used to hide `403`, deliberately"],
          ["`409`", "Conflict with current state", "rarely used, often should be"],
          ["`422`", "Understood, semantically wrong", "confused with `400`"]
        ],
        n: "The `401` / `403` split trips almost everyone: **401 means *I do " +
          "not know who you are*, 403 means *I know exactly who you are and " +
          "the answer is no*.** A `401` invites the client to retry with " +
          "credentials; a `403` tells it not to bother. Returning `404` instead " +
          "of `403` is a legitimate choice when the existence of the resource " +
          "is itself sensitive."
      },

      miss: [
        {
          w: "REST means JSON over HTTP.",
          r: "REST says nothing about JSON — it is an architectural style, and " +
            "Fielding's thesis predates JSON's popularity. Most *REST* APIs are " +
            "really *HTTP APIs*, which is fine, but the words are not " +
            "interchangeable. The formal test involves constraints most APIs " +
            "do not meet."
        },
        {
          w: "A RESTful URL should describe the action, like `/getUser?id=5`.",
          r: "URLs name **resources**, the method names the action: " +
            "`GET /users/5`. If your URLs contain verbs you have rebuilt RPC " +
            "with extra steps — and lost caching, because a generic cache " +
            "cannot know `/getUser` is safe to store while `GET` is defined to " +
            "be."
        },
        {
          w: "Statelessness means the server stores no data.",
          r: "It means the server keeps no **client session state between " +
            "requests** — every request carries what it needs to be understood. " +
            "The database is still full of state. This is what lets any server " +
            "in a pool answer any request, which is what makes horizontal " +
            "scaling straightforward."
        },
        {
          w: "Return `200` with `{\"error\": \"not found\"}` so clients can " +
            "parse it.",
          r: "This breaks every layer that reads status codes — caches will " +
            "store the error, retry logic will treat it as success, and " +
            "monitoring will report a healthy service. The status code *is* " +
            "part of the response, and it is the part infrastructure can read."
        }
      ],

      trade: {
        buys: [
          "Every cache, proxy, CDN and load balancer already understands it.",
          "Statelessness makes horizontal scaling nearly free.",
          "Inspectable with `curl` and a browser; no client generation needed.",
          "A shared vocabulary that most developers already hold."
        ],
        costs: [
          "**Over-fetching and under-fetching**: a fixed resource shape rarely " +
            "matches what a screen needs, so clients get too much or make " +
            "several round trips.",
          "No standard for querying nested data — hence GraphQL.",
          "Verbose over the wire compared to a binary protocol.",
          "Versioning is unsolved; every team invents its own convention."
        ],
        avoid: [
          "Clients need to shape their own queries across nested data — " +
            "**GraphQL** exists for this.",
          "Service-to-service calls in a latency-sensitive path — **gRPC** is " +
            "smaller and faster with a real schema.",
          "The interaction is a persistent stream or truly bidirectional — use " +
            "**WebSockets** or SSE.",
          "The operation genuinely is a procedure call, not a resource change. " +
            "Forcing it into a noun helps nobody."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "garbage-collection",

      why: {
        before: "You allocated memory and you freed it, by hand. Every " +
          "allocation needed a matching free on every path out of the " +
          "function, including the error paths.",
        problem: "Humans are bad at this, and the failures are severe. Free too " +
          "late and you leak; free twice and you corrupt the heap; free too " +
          "early and you have a **use-after-free**, which is one of the most " +
          "reliably exploitable classes of bug in existence. Microsoft and " +
          "Google have both reported that around **70%** of their security " +
          "vulnerabilities are memory-safety issues.",
        shift: "Let the runtime decide when memory is unreachable and reclaim " +
          "it. You trade a slice of throughput and some control over *when* " +
          "for the removal of an entire category of bug."
      },

      num: {
        t: "Generational collection — why it works",
        h: ["Generation", "Typical survival rate", "Collected"],
        r: [
          ["Young (nursery)", "~2–5%", "very often, very fast"],
          ["Old (tenured)", "~90%+", "rarely, expensively"]
        ],
        n: "This is the **generational hypothesis**: *most objects die young*. " +
          "Because a young-generation collection only has to copy the few " +
          "survivors, its cost is proportional to what *lives*, not to what " +
          "was allocated — so allocating a million short-lived objects can be " +
          "nearly free to collect. Modern collectors keep pauses under **10ms** " +
          "(Go, ZGC, Shenandoah) by doing most of the work concurrently, where " +
          "older stop-the-world collectors could pause for **seconds** on a " +
          "large heap."
      },

      miss: [
        {
          w: "Garbage collection means you cannot leak memory.",
          r: "You cannot leak *unreachable* memory. You can absolutely leak by " +
            "keeping references you no longer need — a cache with no eviction, " +
            "a listener never removed, a static list that only grows. The GC " +
            "sees a live reference and correctly keeps the object. The bug is " +
            "in your reachability graph, not the collector."
        },
        {
          w: "Setting a variable to null frees the memory.",
          r: "It removes *one* reference. The object is collected only when " +
            "**no** references remain, and only whenever the collector next " +
            "runs and decides to. `null`-ing a local at the end of a method is " +
            "almost always pointless — it was going out of scope anyway."
        },
        {
          w: "GC makes a program slower.",
          r: "It changes *where* the time goes. Allocation in a generational " +
            "collector is often just a pointer bump — **faster** than a " +
            "general-purpose `malloc`. The cost is unpredictable pauses, not " +
            "raw throughput. For most workloads that is a good trade; for a " +
            "trading system or a game frame budget it is not."
        },
        {
          w: "Calling `System.gc()` or `runtime.GC()` fixes memory pressure.",
          r: "It is a *suggestion*, often ignored, and when honoured it usually " +
            "forces an expensive full collection you did not need. If you are " +
            "reaching for it, the real problem is almost always a reference " +
            "you are still holding."
        }
      ],

      trade: {
        buys: [
          "Eliminates use-after-free, double-free and most leak classes.",
          "Removes ownership bookkeeping from every function signature.",
          "Fast allocation — often a pointer bump in the nursery.",
          "Makes complex data structures with shared ownership practical."
        ],
        costs: [
          "Pauses at times you do not choose, which is fatal for hard real-time.",
          "Higher memory footprint — collectors need headroom, often 2× the " +
            "live set, to stay efficient.",
          "CPU spent tracing rather than doing work.",
          "Leaks become subtler: a retained reference is harder to find than a " +
            "missing `free`."
        ],
        avoid: [
          "Hard real-time systems with a guaranteed deadline — flight control, " +
            "medical devices.",
          "Memory is severely constrained, as on a microcontroller.",
          "You need deterministic destruction for non-memory resources — file " +
            "handles and sockets want RAII or explicit `close`, since " +
            "finalisers run at an unspecified time or never.",
          "The language offers ownership instead — **Rust** gets memory safety " +
            "at compile time with no collector at all."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
