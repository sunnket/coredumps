/* ==========================================================================
   Depth pass 8 — distributed architecture patterns.

   Almost every term here exists because a single process stopped being
   enough, and each one trades a guarantee you had for free inside one
   process — atomicity, ordering, a single source of truth — for something
   that survives a machine dying. The recurring lesson is that these patterns
   are expensive, and most systems adopt them long before they need them.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "saga-pattern",

      why: {
        before: "A business operation spanning several tables was one database " +
          "transaction. Begin, do the work, commit — and on failure, roll back " +
          "everything automatically.",
        problem: "Split those tables across services and the transaction has " +
          "nowhere to live. **Two-phase commit** exists but blocks: if the " +
          "coordinator dies after prepare, every participant holds locks " +
          "indefinitely. Across services owned by different teams with " +
          "different databases, it is not viable.",
        shift: "Give up atomicity and get **eventual consistency with " +
          "compensation**. Split the operation into local transactions, each " +
          "committing independently, and pair each with a **compensating " +
          "action** that semantically undoes it. Failure at step four runs the " +
          "compensations for steps three, two and one in reverse."
      },

      num: {
        t: "Orchestration against choreography",
        h: ["", "Orchestration", "Choreography"],
        r: [
          ["Control flow", "one coordinator", "events, no centre"],
          ["Visibility", "easy — one place", "hard — trace across services"],
          ["Coupling", "coordinator knows all", "services know events"],
          ["Failure handling", "explicit, in the saga", "each service decides"],
          ["Good for", "4+ steps, complex logic", "2–3 steps, loose coupling"]
        ],
        n: "The rule of thumb: **choreography past three or four steps becomes " +
          "impossible to reason about** — nobody can answer *what happens if " +
          "this fails* because the answer is distributed across every service. " +
          "Orchestration centralises that at the cost of a component that knows " +
          "the whole flow. Note that compensation is **not rollback**: a " +
          "refund is not the erasure of a payment, it is a second transaction. " +
          "Both appear on the customer's statement, and that is a product " +
          "decision as much as a technical one."
      },

      miss: [
        {
          w: "A saga gives you distributed transactions.",
          r: "It explicitly gives them up. There is no isolation — other " +
            "transactions **see intermediate states**, so a customer can " +
            "briefly observe an order that exists with a payment that has not " +
            "settled. Sagas trade the ACID *I* for availability, and the " +
            "application must be designed for those windows to be visible."
        },
        {
          w: "Compensating actions undo the original operation.",
          r: "They *semantically* offset it. You cannot un-send an email, " +
            "un-ship a parcel or un-charge a card — you send an apology, issue " +
            "a return label, process a refund. Some steps have **no** " +
            "compensation at all, which is why those must be ordered last: " +
            "the *pivot transaction* after which the saga can only go forward."
        },
        {
          w: "Sagas are how microservices should always handle multi-step work.",
          r: "They are what you use when the data genuinely lives in separate " +
            "services. If the operation spans tables that could live in one " +
            "database, a **local ACID transaction** is dramatically simpler and " +
            "correct by construction. Many sagas exist only because service " +
            "boundaries were drawn in the wrong place."
        },
        {
          w: "If a compensation fails, retry it until it works.",
          r: "That is the right instinct and it is not sufficient. " +
            "Compensations must be **idempotent** and must eventually succeed, " +
            "which means a poison-message path, a dead-letter queue and a human " +
            "escalation. A saga stuck half-applied with a failing compensation " +
            "is the worst state the system can be in, and it requires an " +
            "operational answer, not just a retry loop."
        }
      ],

      trade: {
        buys: [
          "Multi-service operations without distributed locks or 2PC.",
          "Each service keeps its own database and deploys independently.",
          "No blocking coordinator, so one slow service does not freeze others.",
          "Failure handling becomes explicit rather than implicit."
        ],
        costs: [
          "No isolation — intermediate states are visible to everyone.",
          "Every step needs a compensating action designed and tested.",
          "Debugging spans services; you need distributed tracing to see " +
            "anything.",
          "Substantially more code and more failure modes than one transaction."
        ],
        avoid: [
          "The data could live in one database — use a local transaction.",
          "The operation is read-only; there is nothing to compensate.",
          "Steps genuinely cannot be compensated and must be atomic — rethink " +
            "the boundaries.",
          "The team lacks tracing and idempotency discipline; a saga without " +
            "them is unoperable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "event-sourcing",

      why: {
        before: "The database stored **current state**. An update overwrote a " +
          "row, and what it used to be was gone unless someone had thought to " +
          "write an audit log.",
        problem: "That destroys information every time. *Why is this balance " +
          "£40?* becomes unanswerable. Bugs cannot be replayed, auditors " +
          "cannot verify, and any question nobody anticipated when designing " +
          "the schema is permanently unanswerable.",
        shift: "Invert it: store the **facts**, derive the state. An append-only " +
          "log of immutable events is the source of truth, and current state is " +
          "just a fold over that log. Nothing is ever destroyed, so any " +
          "question about the past remains answerable — and new questions can " +
          "be answered retroactively by replaying."
      },

      num: {
        t: "What it costs and what it enables",
        h: ["Aspect", "State-based", "Event-sourced"],
        r: [
          ["Storage", "one row", "every change, forever"],
          ["Read current state", "one query", "replay, or a snapshot"],
          ["Point-in-time state", "impossible", "replay to that point"],
          ["Audit trail", "bolted on", "inherent"],
          ["Schema change", "migrate rows", "**versioned event handlers**"]
        ],
        n: "**Snapshots** are what make it practical: replaying ten years of " +
          "events on every read is absurd, so you persist the folded state " +
          "every N events and replay only from there. The genuinely hard part " +
          "is **schema evolution** — events are immutable and live forever, so " +
          "a five-year-old event in an obsolete format must still deserialise " +
          "today. You end up versioning events and writing upcasters, and that " +
          "burden never goes away. Storage growth is unbounded by design."
      },

      miss: [
        {
          w: "Event sourcing means having an audit log.",
          r: "An audit log is written *alongside* state and can drift from it. " +
            "In event sourcing the log **is** the state — there is no other " +
            "source of truth to disagree with. If you only need an audit trail, " +
            "write an audit table; it is far cheaper."
        },
        {
          w: "You can fix a mistake by editing or deleting the bad event.",
          r: "Events are immutable, and this is the point. Corrections are new " +
            "**compensating events** — the accounting model, where you post a " +
            "reversing entry rather than erasing the original. This collides " +
            "directly with GDPR's right to erasure, which is a genuine and " +
            "unresolved tension; the usual workaround is crypto-shredding, " +
            "storing personal data encrypted and destroying the key."
        },
        {
          w: "Event sourcing requires CQRS.",
          r: "They pair naturally and are independent. CQRS separates read and " +
            "write models; event sourcing determines how the write side stores " +
            "data. You can do either alone. They are usually seen together " +
            "because replaying events for every read is impractical, so a " +
            "projected read model follows almost inevitably."
        },
        {
          w: "It is the right default for a system that matters.",
          r: "It is a specialist choice with a heavy tax: eventual consistency " +
            "in read models, event versioning forever, harder debugging, and a " +
            "team that must all understand it. It earns its place in finance, " +
            "insurance, logistics and anywhere the *history* is the product. " +
            "For CRUD it is a large amount of complexity for nothing."
        }
      ],

      trade: {
        buys: [
          "Complete, non-repudiable history — the audit trail is inherent.",
          "Time travel: reconstruct the state at any past moment.",
          "New read models can be built retroactively by replaying.",
          "Debugging by replaying the exact sequence that caused a bug.",
          "A natural fit for domains that are literally about events."
        ],
        costs: [
          "Unbounded storage growth.",
          "Event schema versioning is permanent and unavoidable.",
          "Read models are eventually consistent, which surprises users.",
          "Deleting personal data conflicts with immutability.",
          "A significant conceptual burden for the whole team."
        ],
        avoid: [
          "The domain is CRUD and history is genuinely uninteresting.",
          "You need an audit trail only — write an audit table.",
          "The team is small and unfamiliar with it; the failure modes are " +
            "subtle.",
          "Strong read-after-write consistency is a hard product requirement.",
          "Regulatory erasure requirements conflict with an immutable log."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cqrs",

      why: {
        before: "One model served both writes and reads. The same `Order` class " +
          "and the same tables handled placing an order and rendering the " +
          "dashboard.",
        problem: "The two have opposite needs. Writes want normalisation, " +
          "invariants and small transactions. Reads want denormalisation, " +
          "joins pre-computed and whatever shape the screen needs. A single " +
          "model serves neither — you get either slow reads or a write model " +
          "contorted for query convenience.",
        shift: "Separate them. Commands change state through a model built for " +
          "invariants; queries read from one or more models built for the " +
          "screens that need them. Each side gets to be right for its job, and " +
          "each can scale independently."
      },

      num: {
        t: "Where the complexity moves",
        h: ["Concern", "Single model", "CQRS"],
        r: [
          ["Read performance", "limited by write schema", "shaped per query"],
          ["Scaling", "together", "independently"],
          ["Consistency", "immediate", "**eventual on reads**"],
          ["Code paths", "one", "two, plus projection"],
          ["Deployable units", "1", "2–3+"]
        ],
        n: "The cost is concentrated in one row: **eventual consistency**. A " +
          "user submits a form and the read model has not caught up, so their " +
          "change appears to have vanished. The lag is usually milliseconds and " +
          "occasionally seconds under load, and the UI must handle it — by " +
          "showing the submitted value optimistically, or by polling until the " +
          "projection catches up. Teams that skip this are the ones who report " +
          "CQRS *did not work for us*."
      },

      miss: [
        {
          w: "CQRS means two databases.",
          r: "It means two **models**. The lightest version is two sets of " +
            "classes over one database — commands write through the domain " +
            "model, queries read with plain SQL into DTOs. Separate stores are " +
            "the heavyweight variant, and most systems that benefit never need " +
            "it."
        },
        {
          w: "CQRS requires event sourcing.",
          r: "They are independent. You can project a read model from database " +
            "triggers, change-data-capture, or a plain synchronous write to " +
            "both. Event sourcing is one way to produce the events that update " +
            "projections; it is not a prerequisite."
        },
        {
          w: "Separating reads and writes makes the system simpler.",
          r: "It makes each **side** simpler and the **system** more complex — " +
            "two models, a projection pipeline, and a consistency gap where " +
            "there was none. It is a trade you make when one model is provably " +
            "failing both jobs, not a general cleanliness improvement."
        },
        {
          w: "Apply it across the whole application for consistency.",
          r: "It should be applied **per bounded context**, and usually only to " +
            "the one or two where read and write loads genuinely diverge. A " +
            "system that is CQRS everywhere has usually paid the cost " +
            "everywhere and collected the benefit in one place."
        }
      ],

      trade: {
        buys: [
          "Read models shaped exactly for the screens that use them.",
          "Independent scaling — read replicas without touching the write path.",
          "A write model free to enforce invariants without query concerns.",
          "Several read models over the same data for different consumers."
        ],
        costs: [
          "Eventual consistency, which the UI must handle explicitly.",
          "Two models and a projection pipeline to build and operate.",
          "Projections can lag, fail, or need rebuilding.",
          "More moving parts to deploy, monitor and debug."
        ],
        avoid: [
          "Reads and writes have similar shapes and volumes — most CRUD.",
          "The team cannot absorb eventual consistency in the UX.",
          "A read replica or a materialised view would solve the actual " +
            "problem more cheaply.",
          "You are applying it to the whole system rather than the one context " +
            "that needs it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "consensus",

      why: {
        before: "One node held the truth. Everyone asked it, and if it died " +
          "the system stopped.",
        problem: "Replicating for availability means several nodes each holding " +
          "a copy — and now they can disagree. Worse, they cannot reliably tell " +
          "a **crashed** peer from a **slow** one, because there is no way to " +
          "distinguish a dead machine from a delayed message.",
        shift: "Agree on an **order of operations** rather than on values. If " +
          "every node applies the same commands in the same sequence, they " +
          "converge by construction. Raft and Paxos both work by electing a " +
          "leader and having a **majority** acknowledge each entry before it " +
          "counts as committed."
      },

      num: {
        t: "Cluster size, quorum, and failures tolerated",
        h: ["Nodes", "Quorum", "Failures tolerated"],
        r: [
          ["3", "2", "1"],
          ["5", "3", "2"],
          ["7", "4", "3"],
          ["4", "3", "1"]
        ],
        n: "Note the row for **4 nodes**: it tolerates the same single failure " +
          "as 3 while needing a larger quorum, so even numbers are strictly " +
          "worse. Majority quorums are what make split-brain impossible — two " +
          "disjoint majorities cannot exist. **3 or 5 is almost always the " +
          "right answer**; more nodes means more availability and *slower " +
          "writes*, since every commit waits for a majority. The **FLP " +
          "impossibility** result proves no deterministic algorithm can " +
          "guarantee consensus in a fully asynchronous network with even one " +
          "faulty node, which is why real systems use timeouts and settle for " +
          "*eventually* making progress."
      },

      miss: [
        {
          w: "Consensus means all nodes agree.",
          r: "It means a **majority** agrees, and that is deliberate. Requiring " +
            "unanimity would mean one slow node blocks everything. Minority " +
            "nodes may lag or be partitioned away, and they catch up later — " +
            "they are not part of the commit decision."
        },
        {
          w: "Raft and Paxos make the system more available.",
          r: "They make it **consistent**, and they *reduce* availability by " +
            "design: a partitioned minority refuses to serve writes rather than " +
            "risk divergence. These are **CP** systems in CAP terms. If you " +
            "want availability during a partition you want a different design " +
            "entirely."
        },
        {
          w: "More nodes means better fault tolerance.",
          r: "It means more tolerated failures and **slower writes**, because " +
            "every commit waits for a larger majority. Going from 3 to 7 " +
            "doubles tolerated failures and measurably increases latency. " +
            "Beyond 5 or 7 the trade is almost always bad."
        },
        {
          w: "You should implement Raft yourself; the paper is readable.",
          r: "The paper is readable and the implementation is not. Membership " +
            "changes, log compaction, snapshot transfer and the correctness of " +
            "every edge case have defeated many teams. Use **etcd**, " +
            "**ZooKeeper** or an embedded library. Consensus is the canonical " +
            "example of code you should not write."
        }
      ],

      trade: {
        buys: [
          "A single agreed order of operations despite failures.",
          "Split-brain becomes impossible via majority quorums.",
          "Automatic leader election and failover.",
          "The foundation for locks, leases and configuration stores."
        ],
        costs: [
          "Every write waits for a majority — latency is bounded by the " +
            "slowest of them.",
          "A partitioned minority is unavailable by design.",
          "Odd cluster sizes and careful membership changes required.",
          "Notoriously difficult to implement correctly."
        ],
        avoid: [
          "Availability matters more than consistency — choose an AP design " +
            "and reconcile later.",
          "The data is naturally partitionable with no cross-partition " +
            "invariants.",
          "Write latency is critical and the cluster spans regions.",
          "A managed service already provides it — use etcd or ZooKeeper " +
            "rather than building."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sharding",

      why: {
        before: "The database grew, so you bought a bigger machine. Vertical " +
          "scaling: more RAM, more cores, faster disks.",
        problem: "There is a largest machine, and its price curve is brutal " +
          "near the top. More immediately, a single machine has one write path " +
          "— replicas scale reads, and every write still funnels through one " +
          "primary.",
        shift: "Split the **data** across machines by a shard key, so each " +
          "holds a slice and each has its own write path. Capacity becomes a " +
          "purchasing decision again. The price is that any query or " +
          "transaction spanning shards is now a distributed problem."
      },

      num: {
        t: "Shard key strategies",
        h: ["Strategy", "Even load?", "Range queries?", "Rebalancing"],
        r: [
          ["Hash of key", "yes", "**no**", "hard (or consistent hashing)"],
          ["Range", "no — hot spots", "yes", "easy — split a range"],
          ["Directory / lookup", "yes", "yes", "easy"],
          ["Geographic", "depends", "within region", "moderate"]
        ],
        n: "The shard key is **the** decision, and it is close to irreversible " +
          "— changing it means rewriting every row. Two failure modes dominate. " +
          "Sharding on a monotonic key like `created_at` sends **every new " +
          "write to the last shard**, so you have one hot machine and n-1 idle " +
          "ones. And sharding by `customer_id` works beautifully until one " +
          "customer is a thousand times larger than the rest — the classic " +
          "multi-tenant hot shard. Choose a key that appears in nearly every " +
          "query, or you will fan out to all shards on every request."
      },

      miss: [
        {
          w: "Sharding makes queries faster.",
          r: "It makes queries **that include the shard key** faster, because " +
            "they touch one machine holding less data. Queries without it must " +
            "**scatter-gather** across every shard and merge — often *slower* " +
            "than the unsharded original, and bounded by the slowest shard."
        },
        {
          w: "You can add shards whenever you need more capacity.",
          r: "With plain modulus hashing, adding a shard remaps almost every " +
            "key and requires moving nearly all the data. **Consistent " +
            "hashing** or a **directory** service is what makes resharding " +
            "tolerable, and it must be designed in from the beginning."
        },
        {
          w: "Transactions still work, they just span shards.",
          r: "Cross-shard transactions need two-phase commit, which most " +
            "sharded systems deliberately do not offer. In practice you " +
            "**design so transactions stay within one shard** — which is why " +
            "the shard key is chosen around transactional boundaries as much " +
            "as around data volume."
        },
        {
          w: "Sharding is how you scale a database.",
          r: "It is the **last** step. Before it: indexes, query tuning, " +
            "caching, read replicas, archiving cold data, and a bigger machine. " +
            "Modern hardware handles far more than most teams assume — a single " +
            "Postgres instance comfortably serves tens of thousands of " +
            "transactions per second. Sharding early is a common and expensive " +
            "mistake."
        }
      ],

      trade: {
        buys: [
          "Horizontal scaling of writes, not just reads.",
          "Data beyond what one machine can hold.",
          "Smaller working sets and indexes per machine.",
          "A failure takes out one shard, not the whole database."
        ],
        costs: [
          "Cross-shard queries fan out and are slow.",
          "Cross-shard transactions are effectively unavailable.",
          "The shard key is close to permanent, and hot shards are hard to fix.",
          "Operational burden multiplies — backups, migrations, monitoring per " +
            "shard.",
          "Joins across shards must be done in the application."
        ],
        avoid: [
          "You have not exhausted indexing, caching, replicas and a bigger " +
            "machine.",
          "Queries rarely include a natural shard key.",
          "The workload needs cross-entity transactions.",
          "A managed distributed database — Spanner, CockroachDB, Vitess — " +
            "would handle it for you."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "circuit-breaker",

      why: {
        before: "A failing dependency was handled with retries and a timeout. " +
          "Call it, wait, retry, eventually give up.",
        problem: "Under load that is precisely wrong. If a downstream service " +
          "is struggling, every caller waiting on a 30-second timeout holds a " +
          "thread or connection for 30 seconds. The pool exhausts, the caller " +
          "stops serving *unrelated* requests, and its own callers begin to " +
          "fail. Retries add load to the thing already drowning. This is a " +
          "**cascading failure**.",
        shift: "Borrow the electrical metaphor. Count failures; past a " +
          "threshold, **open** the circuit and fail immediately without " +
          "calling. Periodically allow one probe through (**half-open**) and " +
          "close again if it succeeds. Failing fast protects both the caller's " +
          "resources and the struggling dependency."
      },

      num: {
        t: "The three states",
        h: ["State", "Behaviour", "Transition"],
        r: [
          ["Closed", "calls pass through", "→ open at failure threshold"],
          ["Open", "**fail immediately**", "→ half-open after a timeout"],
          ["Half-open", "one trial call", "→ closed on success, open on failure"]
        ],
        n: "Typical settings: open at a **50% failure rate** over a rolling " +
          "window of at least **20 requests**, stay open for **30 seconds**. " +
          "The minimum-request threshold matters — without it, one failure out " +
          "of one request is a 100% failure rate and the breaker opens on " +
          "noise. The largest win is in the **open** state: a call that would " +
          "have blocked for 30 seconds returns in microseconds, so threads are " +
          "never consumed and the caller stays healthy for everything else it " +
          "does."
      },

      miss: [
        {
          w: "A circuit breaker prevents failures.",
          r: "It makes failures **fast and contained**. The dependency is still " +
            "down and those requests still fail — they just fail in " +
            "microseconds instead of holding a connection for thirty seconds. " +
            "The point is protecting the caller and everything else it serves."
        },
        {
          w: "It is just a fancy retry policy.",
          r: "It is close to the opposite. Retries *increase* load on a " +
            "struggling service; a breaker *removes* load so it can recover. " +
            "They compose — retry within a breaker — but a retry without a " +
            "breaker is how a slow dependency becomes an outage."
        },
        {
          w: "Open the circuit as soon as you see failures.",
          r: "Too aggressive and it opens on transient noise, taking down a " +
            "healthy dependency from the caller's perspective. Hence the " +
            "minimum-request threshold and the rolling window. Tuning it too " +
            "tight is a common way to *cause* the incident you were preventing."
        },
        {
          w: "Every outbound call should have one.",
          r: "A breaker needs a **fallback** — cached data, a default, a " +
            "degraded response. If the only fallback is an error, you have " +
            "changed a slow error into a fast one, which helps the thread pool " +
            "and not the user. Non-idempotent writes also need care: failing " +
            "fast on a payment is not obviously better than waiting."
        }
      ],

      trade: {
        buys: [
          "Stops one failing dependency from exhausting the caller's resources.",
          "Removes load from a struggling service so it can recover.",
          "Fast, predictable failure instead of long timeouts.",
          "A natural place to serve a cached or degraded response."
        ],
        costs: [
          "Requests fail while open, including ones that might have succeeded.",
          "Thresholds and windows need tuning per dependency.",
          "State is usually per-instance, so behaviour differs across a fleet.",
          "One more component that can misbehave under unusual conditions."
        ],
        avoid: [
          "There is no meaningful fallback and failing fast helps nobody.",
          "The dependency is local and cannot realistically be slow.",
          "Traffic is too low to distinguish signal from noise.",
          "A service mesh or platform already provides it — do not implement " +
            "it twice."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "service-mesh",

      why: {
        before: "Retries, timeouts, mTLS, tracing and circuit breaking were " +
          "implemented in each service, usually via a shared client library.",
        problem: "That library has to exist for every language you use, and " +
          "upgrading it means redeploying **every** service. In a polyglot " +
          "estate you either restrict language choice or reimplement the same " +
          "networking logic several times, inconsistently.",
        shift: "Move it out of the process. A **sidecar proxy** beside each " +
          "service intercepts all traffic, so retries, mTLS, routing and " +
          "telemetry become infrastructure configured centrally rather than " +
          "code compiled into every application."
      },

      num: {
        t: "What a sidecar costs",
        h: ["Resource", "Typical per pod", "At 500 pods"],
        r: [
          ["Memory", "~50–100 MB", "25–50 GB"],
          ["CPU", "~0.1 core idle", "50 cores"],
          ["Added latency", "~0.5–2ms per hop", "compounds per hop"]
        ],
        n: "The latency compounds: a request crossing five services passes " +
          "**ten** proxies (out and in at each hop), so 1ms each becomes 10ms " +
          "added. That is the honest reason **ambient** or sidecar-less meshes " +
          "emerged — a per-node proxy instead of a per-pod one cuts the " +
          "overhead substantially. The general rule: below roughly **20 " +
          "services**, a mesh usually costs more in operational complexity than " +
          "it returns."
      },

      miss: [
        {
          w: "A service mesh makes microservices reliable.",
          r: "It gives you retries, timeouts and breakers **for free at the " +
            "network layer**. It cannot fix a bad service boundary, a chatty " +
            "API, or a distributed transaction that should not exist. It " +
            "improves the plumbing, not the architecture."
        },
        {
          w: "It is transparent to the application.",
          r: "Mostly, and the exceptions bite. Retries at the mesh layer on a " +
            "non-idempotent endpoint cause duplicates. mTLS changes how the " +
            "service sees client identity. Startup ordering matters — traffic " +
            "before the sidecar is ready fails. Debugging now involves a proxy " +
            "the application team did not write."
        },
        {
          w: "You need a mesh to do mTLS between services.",
          r: "It is the easiest way at scale, and not the only one. TLS " +
            "terminated at an ingress plus network policy covers many threat " +
            "models. SPIFFE/SPIRE issues workload identity without a full mesh. " +
            "If mTLS is your only requirement, a mesh is a large hammer."
        },
        {
          w: "Adopt a mesh when you move to microservices.",
          r: "Adopt it when the pain it solves is real — usually somewhere past " +
            "twenty services, several languages, or a compliance requirement " +
            "for encryption in transit. Early adoption means running a complex " +
            "distributed system to manage a simple one."
        }
      ],

      trade: {
        buys: [
          "Retries, timeouts, breakers and mTLS with no application code.",
          "Uniform behaviour across every language in the estate.",
          "Consistent distributed tracing and traffic metrics.",
          "Traffic shifting for canary and blue-green deploys."
        ],
        costs: [
          "Memory and CPU per pod, which is substantial at scale.",
          "Added latency at every hop, compounding across a call chain.",
          "A genuinely complex control plane to operate and upgrade.",
          "A new layer in every debugging session."
        ],
        avoid: [
          "Fewer than about twenty services — libraries are simpler.",
          "A single language, where a shared client library covers it.",
          "Latency budgets are tight and hops are many.",
          "The team cannot operate the control plane; an unmaintained mesh is " +
            "worse than none."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "query-optimiser",

      why: {
        before: "Early databases executed queries as literally written. The " +
          "order of joins in your SQL was the order they ran, so performance " +
          "was the programmer's problem.",
        problem: "That makes SQL's declarative promise a lie, and the " +
          "programmer's job impossible. The best plan depends on table sizes, " +
          "data distribution, indexes and available memory — all of which " +
          "change over time and none of which the query text knows.",
        shift: "Let the database decide. The optimiser enumerates plans, " +
          "**estimates the cost of each using statistics** about the data, and " +
          "picks the cheapest. You describe the result; it chooses the method. " +
          "That separation is the reason SQL has outlived every framework built " +
          "on top of it."
      },

      num: {
        t: "Join strategies the optimiser chooses between",
        h: ["Join type", "Cost", "Chosen when"],
        r: [
          ["Nested loop", "O(n × m)", "one side tiny, indexed inner"],
          ["Hash join", "O(n + m)", "large unsorted, equality join"],
          ["Merge join", "O(n + m) if sorted", "both sorted, or indexed"]
        ],
        n: "Everything rests on **cardinality estimates** — how many rows a " +
          "step will produce. Estimates come from sampled histograms, and " +
          "errors **compound multiplicatively** through a plan: a 10× " +
          "underestimate at each of three joins is a 1000× error at the top, " +
          "which is how the optimiser picks a nested loop for a million rows " +
          "and the query takes an hour. This is why `ANALYZE` matters, why " +
          "correlated columns (`city` and `postcode`) break estimates, and why " +
          "`EXPLAIN ANALYZE` — showing **estimated against actual** rows — is " +
          "the single most useful tuning tool there is."
      },

      miss: [
        {
          w: "The order of joins in my SQL affects the plan.",
          r: "For a cost-based optimiser, generally not — it reorders freely " +
            "based on statistics. Rewriting the query to *hint* at an order " +
            "usually changes nothing. Where join order does start to matter is " +
            "beyond the optimiser's search limit (`join_collapse_limit` in " +
            "Postgres, default 8), past which it stops exhaustively searching."
        },
        {
          w: "A slow query means a missing index.",
          r: "Often it means **stale statistics**. If the optimiser thinks a " +
            "table has 1,000 rows and it has 10 million, it will choose a plan " +
            "that is catastrophically wrong while a perfectly good index sits " +
            "unused. Run `ANALYZE` before adding indexes."
        },
        {
          w: "`EXPLAIN` tells you what the database did.",
          r: "`EXPLAIN` shows the **plan and estimates**; `EXPLAIN ANALYZE` " +
            "actually runs it and shows real timings and row counts. The gap " +
            "between estimated and actual rows is the diagnostic — a large " +
            "divergence tells you exactly where the optimiser was misled."
        },
        {
          w: "Query hints are the way to fix a bad plan.",
          r: "They freeze a decision that was correct for today's data and will " +
            "be wrong after it grows. Hints are a last resort. Fix the " +
            "statistics, add the index, rewrite the predicate so it is " +
            "sargable, or increase the statistics target — all of these keep " +
            "adapting as the data changes."
        }
      ],

      trade: {
        buys: [
          "Declarative SQL — describe the result, not the algorithm.",
          "Plans adapt automatically as data volume and distribution change.",
          "Decades of algorithmic work you get for free.",
          "The same query stays fast as the database evolves."
        ],
        costs: [
          "Plans can change unexpectedly after a statistics update.",
          "Cardinality estimation errors compound and produce disasters.",
          "Optimisation itself takes time on complex queries.",
          "Debugging requires understanding a component you did not write."
        ],
        avoid: [
          "You are on a key-value store — there is no plan to choose.",
          "The query is trivial and there is only one sensible plan.",
          "You need absolutely deterministic performance — prepared statements " +
            "with a fixed plan, or a stored procedure.",
          "The bottleneck is network or application code, not the database."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
