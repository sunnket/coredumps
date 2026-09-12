/* ==========================================================================
   Depth pass 13 — architecture patterns and the databases built for shapes
   relational engines handle badly.

   A thread running through the architecture terms: every one of them is
   about *where you draw a line*. DDD draws it around a model's meaning,
   hexagonal around what the application owns, bulkheads around what can
   fail together. Drawing the line in the wrong place is the expensive
   mistake, and no amount of good code inside a bad boundary recovers it.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "bounded-context",

      why: {
        before: "A large system aimed at one **canonical data model** — a " +
          "single `Customer` class, one definition, shared by every part of the " +
          "business. It sounds obviously correct.",
        problem: "It collapses under contact with a real organisation. To " +
          "sales, a customer is a lead with a pipeline stage. To billing, a " +
          "payment method and a tax jurisdiction. To support, a ticket history. " +
          "The unified model becomes a class with ninety fields where each " +
          "team uses twelve and nobody may change any of them safely.",
        shift: "Accept that **the same word means different things in " +
          "different parts of a business**, and that this is correct rather " +
          "than sloppy. Draw explicit boundaries around each meaning. Inside a " +
          "boundary the language is precise and consistent; between them, " +
          "translate explicitly."
      },

      num: {
        t: "Relationships between contexts",
        h: ["Pattern", "Meaning", "Use when"],
        r: [
          ["Shared kernel", "a shared subset of the model", "two close teams"],
          ["Customer-supplier", "downstream influences upstream", "clear dependency"],
          ["Conformist", "downstream just accepts the model", "no influence"],
          ["**Anti-corruption layer**", "translate at the boundary", "legacy or external"],
          ["Published language", "a documented shared format", "many consumers"]
        ],
        n: "The **anti-corruption layer** is the one that repeatedly earns its " +
          "keep: a translation layer that stops another system's model leaking " +
          "into yours. Without it, a legacy schema's assumptions propagate " +
          "through your codebase until your domain model *is* theirs. Note also " +
          "that a bounded context is **not** the same as a microservice — a " +
          "context is a modelling boundary, and it can be a module inside a " +
          "monolith. Conflating the two is what produces distributed monoliths."
      },

      miss: [
        {
          w: "A bounded context is a microservice.",
          r: "It is a **linguistic and modelling** boundary. It may be " +
            "deployed as a service, or as a package inside a monolith. " +
            "Deciding the deployment boundary is a separate question with " +
            "separate trade-offs — and drawing service boundaries *before* " +
            "understanding context boundaries is the usual route to a " +
            "distributed monolith."
        },
        {
          w: "Duplicating the Customer model across contexts is bad design.",
          r: "It is the **point**. Each context defines the customer it needs. " +
            "The alternative — one shared model — creates coupling where every " +
            "team must agree on every change. Duplication of *data shape* is " +
            "cheaper than coupling of *meaning*."
        },
        {
          w: "You should identify contexts by looking at the data model.",
          r: "Identify them by **language and ownership**. Where does a word " +
            "change meaning? Where does one team's decision stop affecting " +
            "another's? Event storming and conversations with domain experts " +
            "find these; an ER diagram does not."
        },
        {
          w: "Bounded contexts are worth applying to any project.",
          r: "DDD's machinery pays off in **complex domains with genuine " +
            "business rules**. On a CRUD application with a simple domain it is " +
            "ceremony — a repository, an aggregate and a domain event wrapped " +
            "around what is really an INSERT. Eric Evans is explicit that DDD " +
            "is for the *core* domain, not everything."
        }
      ],

      trade: {
        buys: [
          "Each team owns a model that fits its actual work.",
          "Removes the coupling of one canonical schema.",
          "Makes language precise inside a boundary.",
          "A principled basis for later service boundaries."
        ],
        costs: [
          "Translation at every boundary is real code to write and maintain.",
          "Data is duplicated and must be kept acceptably consistent.",
          "Requires genuine domain understanding, which takes time.",
          "Over-applied, it fragments a simple system for no benefit."
        ],
        avoid: [
          "The domain is simple CRUD with no meaningful business rules.",
          "The team is small enough to hold one model in its head.",
          "You are drawing boundaries from a database diagram rather than the " +
            "business.",
          "You are using it as a synonym for *microservice* — that confusion " +
            "causes more harm than the pattern prevents."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hexagonal-architecture",

      why: {
        before: "Layered architecture — UI on top, business logic in the " +
          "middle, database at the bottom — with each layer depending " +
          "downward.",
        problem: "The business logic depends on the database. Change ORM, and " +
          "the domain changes. Test a business rule, and you need a database " +
          "running. The most valuable and most stable part of the system is " +
          "coupled to its most replaceable part, and depends on it in the wrong " +
          "direction.",
        shift: "**Invert the dependency.** The application defines interfaces " +
          "(*ports*) for what it needs — *save this order*, *send this email*. " +
          "Infrastructure implements them (*adapters*). Now the database " +
          "depends on the domain rather than the reverse, and the domain can be " +
          "tested and understood with no infrastructure at all."
      },

      num: {
        t: "What moves where",
        h: ["Concern", "Layered", "Hexagonal"],
        r: [
          ["Domain depends on", "the database", "**nothing**"],
          ["Testing business logic", "needs a database", "pure unit tests"],
          ["Swapping Postgres for another store", "touches the domain", "one adapter"],
          ["Direction of dependency", "downward", "**inward, always**"]
        ],
        n: "The rule reduces to one line: **dependencies point inward, toward " +
          "the domain**. Everything else follows. The practical payoff most " +
          "often felt is testing — business rules become fast deterministic " +
          "unit tests with no fixtures, no containers and no cleanup, which is " +
          "the difference between a suite that runs in two seconds and one that " +
          "runs in four minutes. The most common failure is a **leaky port**: " +
          "an interface that returns an ORM entity or takes a database-specific " +
          "query object has not inverted anything, it has just added a file."
      },

      miss: [
        {
          w: "Hexagonal architecture means having a repository interface.",
          r: "A repository returning ORM entities has moved the coupling, not " +
            "removed it. The port must speak the **domain's** language — domain " +
            "objects in, domain objects out. If swapping the database would " +
            "still change the domain, the boundary is decorative."
        },
        {
          w: "It is the same as clean architecture or onion architecture.",
          r: "They are close relatives with the same core rule — dependencies " +
            "point inward — and different vocabularies and layer counts. " +
            "Cockburn's hexagonal (2005) came first; Uncle Bob's clean " +
            "architecture generalised it. Arguing about the differences is " +
            "usually less useful than applying the shared rule."
        },
        {
          w: "You need an interface for every external dependency.",
          r: "You need one where the **boundary is meaningful** — something you " +
            "might replace, or something that makes tests slow. Wrapping the " +
            "standard library's date functions in a port is ceremony. The " +
            "judgement is which dependencies genuinely threaten the domain."
        },
        {
          w: "It slows development down for no benefit on small projects.",
          r: "Often true, and worth saying plainly. On a small CRUD service the " +
            "indirection costs more than it returns. It pays where the **domain " +
            "logic is genuinely complex** and where you will maintain the " +
            "system for years — which is not most services."
        }
      ],

      trade: {
        buys: [
          "Business logic testable with no infrastructure at all.",
          "Infrastructure genuinely replaceable behind a stable interface.",
          "The domain becomes readable as a description of the business.",
          "Delays technology decisions until you know more."
        ],
        costs: [
          "More files, more indirection, more mapping code.",
          "Mapping between domain and persistence models by hand.",
          "Easy to implement superficially and gain nothing.",
          "Overkill for simple applications."
        ],
        avoid: [
          "The application is thin CRUD with almost no domain logic.",
          "It is a prototype or a short-lived service.",
          "The team will implement the shape without the discipline, producing " +
            "cost without benefit.",
          "You will never plausibly change the infrastructure and tests are " +
            "already fast."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bulkhead",

      why: {
        before: "A service used one shared thread pool or connection pool for " +
          "everything it did. Simple, and efficient in the common case.",
        problem: "One slow dependency consumes the whole pool. If the " +
          "recommendation service hangs, every thread ends up blocked on it — " +
          "and now checkout fails too, because there are no threads left for " +
          "it. A non-critical dependency has taken down a critical path.",
        shift: "Borrow from shipbuilding: **compartments**. Give each " +
          "dependency its own bounded pool. When recommendations exhaust their " +
          "ten threads, checkout still has its twenty. The failure is contained " +
          "to the compartment that caused it."
      },

      num: {
        t: "Shared against isolated pools, 50 threads",
        h: ["Scenario", "Shared pool", "Bulkheads"],
        r: [
          ["All healthy", "flexible allocation", "some idle capacity"],
          ["Recommendations hang", "**all 50 blocked**", "10 blocked, 40 free"],
          ["Effect on checkout", "**fails**", "unaffected"],
          ["Peak burst on one path", "absorbs it", "may reject"]
        ],
        n: "The trade is **utilisation against isolation**. A shared pool uses " +
          "resources more efficiently when everything is healthy; bulkheads " +
          "leave capacity idle in exchange for containment. That is a good " +
          "trade for anything on a critical path and a poor one for a batch " +
          "worker. Bulkheads pair naturally with **circuit breakers** — the " +
          "bulkhead limits how much damage a slow dependency can do, and the " +
          "breaker stops calling it entirely once it is clearly failing."
      },

      miss: [
        {
          w: "A bulkhead is the same as a circuit breaker.",
          r: "A bulkhead **limits concurrent usage** so one dependency cannot " +
            "consume everything. A breaker **stops calling** a dependency that " +
            "is failing. One is a quota, the other is a switch. They solve " +
            "adjacent problems and are usually deployed together."
        },
        {
          w: "Bulkheads mean one thread pool per downstream service.",
          r: "The partition should follow **failure domains and criticality**, " +
            "not the service list. Group non-critical calls together and give " +
            "the checkout path its own compartment. Fifty pools for fifty " +
            "dependencies is unmanageable and wastes capacity."
        },
        {
          w: "Sizing the pools is a matter of dividing capacity evenly.",
          r: "Size by **criticality and expected concurrency**, not fairly. The " +
            "payment path deserves headroom it rarely uses; the analytics call " +
            "deserves a small pool it will occasionally exhaust harmlessly. " +
            "Equal division defeats the purpose."
        },
        {
          w: "Async code does not need bulkheads because nothing blocks.",
          r: "The resource being exhausted changes — connections, memory, " +
            "in-flight request slots, event-loop pressure — and it can still " +
            "be exhausted. Async removes *thread* blocking, not the need to " +
            "bound concurrency per dependency."
        }
      ],

      trade: {
        buys: [
          "One failing dependency cannot consume the whole service.",
          "Critical paths keep capacity regardless of what else is failing.",
          "Failure becomes localised and diagnosable.",
          "Makes degradation graceful rather than total."
        ],
        costs: [
          "Lower utilisation — reserved capacity sits idle.",
          "Pool sizing is another set of parameters to get right.",
          "A path can be rejected while capacity exists elsewhere.",
          "More configuration and more to monitor."
        ],
        avoid: [
          "There is only one downstream dependency to isolate from.",
          "It is a batch job where total failure is acceptable and utilisation " +
            "matters most.",
          "The platform already isolates workloads — separate pods or " +
            "processes are a bulkhead.",
          "Traffic is too low for exhaustion to be plausible."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cassandra",

      why: {
        before: "Scaling writes meant sharding a relational database by hand, " +
          "with a primary per shard and a painful story for failover and " +
          "rebalancing.",
        problem: "Amazon's Dynamo paper framed the real requirement: a shopping " +
          "cart must accept writes **even during a partition**, because a " +
          "rejected *add to cart* is lost revenue. Relational systems choose " +
          "consistency and refuse the write.",
        shift: "Build for availability first. Every node is equal — **no " +
          "leader** — data is placed by consistent hashing around a ring, and " +
          "writes go to whichever replicas are reachable. Consistency becomes a " +
          "**per-query choice** rather than a property of the system."
      },

      num: {
        t: "Tunable consistency: R + W > RF gives strong consistency",
        h: ["RF", "Write", "Read", "Strong?", "Tolerates"],
        r: [
          ["3", "ONE", "ONE", "no", "2 node failures"],
          ["3", "QUORUM (2)", "QUORUM (2)", "**yes**", "1 node failure"],
          ["3", "ALL (3)", "ONE", "yes", "0 failures on write"],
          ["3", "ONE", "ALL (3)", "yes", "0 failures on read"]
        ],
        n: "The `R + W > RF` rule is the whole model: if reads and writes " +
          "overlap on at least one replica, a read must see the latest write. " +
          "**QUORUM/QUORUM** is the usual choice — strong consistency while " +
          "still tolerating one node down. The far more important design " +
          "constraint is that **Cassandra requires you to model tables around " +
          "queries**: there are no joins, no ad-hoc `WHERE`, and a query that " +
          "does not include the partition key requires a full cluster scan. You " +
          "denormalise and write the same data into several tables, one per " +
          "access pattern."
      },

      miss: [
        {
          w: "Cassandra is eventually consistent, so it cannot be used for " +
            "important data.",
          r: "Consistency is **tunable per query**. `QUORUM` reads and writes " +
            "give linearizable-enough behaviour for most purposes, and " +
            "lightweight transactions offer compare-and-set via Paxos. You " +
            "choose the guarantee per operation, which is more flexible than " +
            "one global setting."
        },
        {
          w: "It is a drop-in replacement for a relational database at scale.",
          r: "CQL looks like SQL and behaves fundamentally differently. **No " +
            "joins, no aggregations across partitions, no ad-hoc queries.** " +
            "Migrating means redesigning the data model around access patterns " +
            "— usually a rewrite, not a migration."
        },
        {
          w: "Adding secondary indexes solves the query flexibility problem.",
          r: "Cassandra's secondary indexes are **local to each node**, so a " +
            "query using one must contact every node in the cluster. They are " +
            "acceptable for low-cardinality columns within a partition and a " +
            "performance trap otherwise. The intended answer is another table."
        },
        {
          w: "Deletes free up space.",
          r: "Deletes write **tombstones**, which persist until compaction " +
            "after `gc_grace_seconds` (10 days by default). A workload with " +
            "heavy deletes accumulates tombstones that slow reads dramatically " +
            "— reading a partition means scanning its tombstones too. " +
            "Queue-like workloads are a known anti-pattern for exactly this " +
            "reason."
        }
      ],

      trade: {
        buys: [
          "Linear write scalability by adding nodes.",
          "No single point of failure — every node is equal.",
          "Multi-datacentre replication as a first-class feature.",
          "Per-query consistency tuning.",
          "Excellent for time-series and high-volume writes."
        ],
        costs: [
          "No joins or ad-hoc queries; the model is query-driven.",
          "Data duplicated across tables, kept consistent by the application.",
          "Tombstones make delete-heavy workloads pathological.",
          "Operationally demanding — compaction, repair, tuning.",
          "Changing access patterns can mean rewriting the data model."
        ],
        avoid: [
          "You need joins, transactions or ad-hoc analytics.",
          "The workload is read-heavy with complex queries — use Postgres.",
          "The data volume genuinely fits on one machine.",
          "The workload is queue-shaped, which tombstones punish severely.",
          "The team cannot operate a distributed database; it is not " +
            "low-maintenance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "clickhouse",

      why: {
        before: "Analytics ran on the same row-oriented database as the " +
          "application, or on a data warehouse that took minutes per query.",
        problem: "Row storage is exactly wrong for analytics. `SELECT " +
          "avg(price) FROM orders` must read **every column of every row** to " +
          "get one, because a row is stored contiguously. On a table with 50 " +
          "columns you read 50× the data you need.",
        shift: "Store by **column**. Each column is contiguous on disk, so a " +
          "query reads only the columns it names. That also makes compression " +
          "far better — adjacent values in a column are similar and often " +
          "repeat — and enables **vectorised execution**, processing blocks of " +
          "values in tight SIMD loops rather than row-by-row."
      },

      num: {
        t: "Why columnar wins for analytics",
        h: ["Property", "Row store", "Column store"],
        r: [
          ["Reads for a 3-of-50-column query", "all 50", "**3**"],
          ["Typical compression", "2–3×", "**10–30×**"],
          ["Single-row lookup by key", "**fast**", "slow"],
          ["Single-row update", "**fast**", "very expensive"],
          ["Aggregation over billions", "minutes", "sub-second"]
        ],
        n: "Compression is the underrated part: a column of country codes " +
          "compresses enormously because it is a small set of repeated values, " +
          "and less data read is directly less time. ClickHouse routinely " +
          "scans **billions of rows per second per server**. The costs are the " +
          "mirror image — it is **not a transactional database**: no real " +
          "`UPDATE`/`DELETE` semantics (they are asynchronous mutations that " +
          "rewrite parts), no foreign keys, eventual deduplication rather than " +
          "unique constraints, and single-row lookups that a relational index " +
          "would answer instantly."
      },

      miss: [
        {
          w: "ClickHouse can replace Postgres for the application database.",
          r: "It has no transactions, no meaningful updates, no constraints and " +
            "no fast point lookups. It is an **OLAP** engine sitting beside an " +
            "OLTP database, not instead of it. The usual architecture is " +
            "Postgres for the application and ClickHouse fed from it for " +
            "analytics."
        },
        {
          w: "It is fast, so schema design does not matter much.",
          r: "The **`ORDER BY` key** is the single most consequential decision " +
            "— it determines physical ordering and therefore which queries can " +
            "skip data via the sparse primary index. A query that does not " +
            "align with it scans everything. Getting it wrong turns " +
            "sub-second queries into minutes."
        },
        {
          w: "`ReplacingMergeTree` gives you unique rows.",
          r: "Deduplication happens **during background merges**, at an " +
            "unspecified time. Until then duplicates are visible. Queries " +
            "needing guaranteed deduplication must use `FINAL` — which is " +
            "expensive — or aggregate defensively. Treating it as a uniqueness " +
            "constraint produces wrong results."
        },
        {
          w: "You should insert rows as they arrive, like any database.",
          r: "Each insert creates a **part** on disk, and thousands of small " +
            "parts overwhelm the merge process — the *too many parts* error is " +
            "the classic beginner failure. Insert in **batches of tens of " +
            "thousands**, or use asynchronous inserts. It is designed for bulk " +
            "ingestion, not row-at-a-time."
        }
      ],

      trade: {
        buys: [
          "Sub-second aggregation over billions of rows.",
          "10–30× compression, so storage costs collapse.",
          "Familiar SQL interface.",
          "Scales horizontally, and vertically very well."
        ],
        costs: [
          "No transactions, constraints or real updates.",
          "Slow single-row lookups.",
          "Schema and `ORDER BY` design are unforgiving.",
          "Requires batched inserts.",
          "Eventual deduplication rather than uniqueness."
        ],
        avoid: [
          "It is your transactional application database.",
          "The workload is point lookups and single-row updates.",
          "Data volume is small — Postgres handles analytics fine up to " +
            "surprisingly large sizes.",
          "You need strong consistency and constraints.",
          "Data arrives one row at a time with no buffering layer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "window-function",

      why: {
        before: "Answering *how does each employee's salary compare to their " +
          "department average* meant either a self-join against a grouped " +
          "subquery, or pulling the data into application code and looping.",
        problem: "`GROUP BY` **collapses** rows — you get one row per " +
          "department and lose the individual employees. But the question needs " +
          "both: every row, *and* an aggregate computed over a related set of " +
          "rows. SQL had no way to express that without a join.",
        shift: "Compute an aggregate **without collapsing**. A window function " +
          "defines a set of rows related to the current row — its *window* — " +
          "and computes over it while every row survives. `avg(salary) OVER " +
          "(PARTITION BY dept)` gives each employee their department's average " +
          "alongside their own salary."
      },

      num: {
        t: "The functions worth knowing",
        h: ["Function", "Returns", "Classic use"],
        r: [
          ["`ROW_NUMBER()`", "1,2,3,4 — no ties", "deduplication, pagination"],
          ["`RANK()`", "1,2,2,4 — gaps after ties", "leaderboards"],
          ["`DENSE_RANK()`", "1,2,2,3 — no gaps", "ranking categories"],
          ["`LAG()` / `LEAD()`", "previous / next row", "change over time"],
          ["`SUM() OVER (ORDER BY …)`", "running total", "cumulative metrics"],
          ["`NTILE(4)`", "quartile bucket", "segmentation"]
        ],
        n: "The single most useful pattern in practice is **deduplication**: " +
          "`ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC)` " +
          "then filter to `= 1` keeps the newest row per email — a query that " +
          "is genuinely awkward any other way. The crucial subtlety is that " +
          "**adding `ORDER BY` inside `OVER` changes the default frame** from " +
          "the whole partition to *everything up to the current row*, which is " +
          "why `SUM() OVER (PARTITION BY x)` is a total and `SUM() OVER " +
          "(PARTITION BY x ORDER BY d)` is a running total. That default " +
          "surprises almost everyone once."
      },

      miss: [
        {
          w: "Window functions are just a nicer syntax for GROUP BY.",
          r: "`GROUP BY` **collapses** rows; windows **preserve** them. They " +
            "answer different questions. You can also use both in one query — " +
            "windows are evaluated *after* grouping, so you can rank the " +
            "grouped results."
        },
        {
          w: "You can filter on a window function in the WHERE clause.",
          r: "You cannot. Windows are computed **after** `WHERE`, so the column " +
            "does not exist yet — you need a subquery or CTE and then filter " +
            "outside it. This trips up nearly everyone the first time they try " +
            "`WHERE ROW_NUMBER() = 1`."
        },
        {
          w: "They are slow and should be avoided on large tables.",
          r: "They are usually **faster** than the self-join alternative, " +
            "because the data is scanned once and sorted once rather than " +
            "joined. They do need a sort per partition, so an index matching " +
            "the `PARTITION BY`/`ORDER BY` helps considerably."
        },
        {
          w: "`RANK()` and `ROW_NUMBER()` are interchangeable.",
          r: "They differ exactly on ties. `ROW_NUMBER` gives distinct numbers " +
            "arbitrarily; `RANK` gives ties the same number and skips " +
            "subsequent ones. Using `ROW_NUMBER` for a leaderboard silently " +
            "breaks ties by whatever order the engine chose."
        }
      ],

      trade: {
        buys: [
          "Aggregates alongside detail rows, with no join.",
          "Running totals, moving averages and rank in plain SQL.",
          "Usually faster than the self-join equivalent.",
          "Standard SQL, supported everywhere modern."
        ],
        costs: [
          "Requires a sort per partition unless an index matches.",
          "Cannot be filtered in the same query level.",
          "Frame semantics are subtle and easy to get wrong.",
          "Can materialise a lot of intermediate state on huge partitions."
        ],
        avoid: [
          "A plain `GROUP BY` answers the question — it is simpler and cheaper.",
          "You need the result filtered and a `GROUP BY` with `HAVING` would " +
            "do.",
          "The dataset is small and being processed in application code anyway.",
          "The engine is old enough to lack support — some very old MySQL " +
            "versions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "leader-election",

      why: {
        before: "A background job — sending nightly invoices, expiring " +
          "sessions, compacting a log — ran on *the* server. There was one, so " +
          "it ran once.",
        problem: "Run three replicas for availability and the job runs three " +
          "times: three invoice emails, three compactions racing each other. " +
          "The obvious fix — a config flag marking one instance special — " +
          "reintroduces the single point of failure you added replicas to " +
          "remove.",
        shift: "Let the cluster **elect** one. Nodes compete for a lease in a " +
          "consensus store; the winner acts as leader and renews it " +
          "periodically. If it dies, the lease expires and another node takes " +
          "over automatically. Exactly one leader at a time, with no static " +
          "configuration."
      },

      num: {
        t: "Failover timing",
        h: ["Parameter", "Typical", "Effect"],
        r: [
          ["Lease duration", "15s", "upper bound on leaderless time"],
          ["Renewal interval", "5s", "more traffic, faster detection"],
          ["Failover window", "**up to lease duration**", "the availability gap"]
        ],
        n: "There is an unavoidable gap: after a leader dies, nobody leads " +
          "until its lease expires. Shortening the lease shortens the gap and " +
          "increases the risk of a **spurious failover** from a brief network " +
          "hiccup — during which the old leader may still believe it leads. " +
          "That is why **fencing tokens** matter: the lease carries a " +
          "monotonically increasing number, and downstream systems reject " +
          "writes carrying an older token. Without fencing, a paused leader " +
          "(GC pause, VM migration) can wake up and write after being replaced."
      },

      miss: [
        {
          w: "Leader election guarantees exactly one leader.",
          r: "It guarantees **at most one leader holds a valid lease**. A " +
            "leader that has been paused — a long GC pause, a suspended VM — " +
            "may not yet know its lease expired and can still attempt writes. " +
            "Fencing tokens are what make this safe; the election alone does " +
            "not."
        },
        {
          w: "You can implement it with a database row and a timestamp.",
          r: "Naive implementations have subtle races around clock skew, " +
            "renewal failures and split-brain during partitions. Use a system " +
            "designed for it — **etcd**, **ZooKeeper**, or Kubernetes leases, " +
            "which are built on exactly this."
        },
        {
          w: "The leader should do all the work.",
          r: "Usually it should only do the work that **must be singular**. " +
            "Making the leader handle all requests wastes the other replicas " +
            "and makes failover far more disruptive. Elect a leader for the " +
            "coordination task and let everyone serve traffic."
        },
        {
          w: "It makes the system more available.",
          r: "It makes it **correct** while replicated, and introduces a brief " +
            "unavailability window on every failover. It is a consistency " +
            "mechanism. If the task could tolerate running more than once, " +
            "idempotency is cheaper and has no failover gap at all."
        }
      ],

      trade: {
        buys: [
          "Exactly-one execution of singular tasks across a replicated fleet.",
          "Automatic failover with no manual intervention.",
          "No static special-instance configuration.",
          "A clear model for coordination that everyone can reason about."
        ],
        costs: [
          "A failover gap where nothing is leading.",
          "A dependency on a consensus store, which must itself be available.",
          "Fencing is required for real safety and is often omitted.",
          "Renewal traffic and operational complexity."
        ],
        avoid: [
          "The task is **idempotent** and running twice is harmless — that is " +
            "simpler and strictly more available.",
          "Work can be partitioned so each node owns a disjoint slice.",
          "A managed scheduler already guarantees single execution.",
          "The brief failover gap is unacceptable — you need a different " +
            "design entirely."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "turing-complete",

      why: {
        before: "Every new programming language raised the question of whether " +
          "it could express *everything* — and there was no way to answer it " +
          "except by trying things.",
        problem: "Comparing languages by feature lists is unbounded and " +
          "subjective. You need a fixed reference point: a definition of " +
          "*computable at all*, against which any system can be measured.",
        shift: "Turing's 1936 machine is that reference. A system is **Turing " +
          "complete** if it can simulate one — which requires only conditional " +
          "branching and unbounded memory. The **Church-Turing thesis** then " +
          "makes the striking claim that this captures *everything " +
          "mechanically computable*: lambda calculus, recursive functions and " +
          "Turing machines all define the same set."
      },

      num: {
        t: "Accidentally Turing complete",
        h: ["System", "Intended as", "Complete?"],
        r: [
          ["Conway's Game of Life", "a cellular automaton", "**yes**"],
          ["Magic: The Gathering", "a card game", "**yes**"],
          ["x86 `mov` instruction alone", "one instruction", "**yes**"],
          ["PowerPoint animations", "presentations", "**yes**"],
          ["Regular expressions (true)", "pattern matching", "no"],
          ["SQL (pre-CTE)", "queries", "no"],
          ["HTML", "markup", "no"]
        ],
        n: "The recurring lesson is that **Turing completeness is very easy to " +
          "achieve by accident**, and that this is usually a security problem " +
          "rather than a feature. If a configuration format, a template " +
          "language or a document format is accidentally Turing complete, then " +
          "*what does this input do* becomes **undecidable** — you cannot " +
          "analyse it, bound its runtime, or prove it safe. This is why " +
          "sandboxes deliberately restrict languages, why Bitcoin Script is " +
          "intentionally not complete, and why **Dhall**, **Starlark** and " +
          "similar configuration languages advertise *total* or " +
          "*non-Turing-complete* as a selling point."
      },

      miss: [
        {
          w: "Turing complete means powerful or capable.",
          r: "It means *can compute anything computable, given unbounded time " +
            "and memory*. It says **nothing about speed, ergonomics or " +
            "expressiveness**. Brainfuck is Turing complete; so is Python. They " +
            "are equally *capable* in this precise sense and not remotely " +
            "comparable as tools."
        },
        {
          w: "Regular expressions are Turing complete.",
          r: "**True** regular expressions are not — they recognise regular " +
            "languages and cannot even match balanced parentheses. Modern " +
            "regex *engines* add backreferences and lookahead, which take them " +
            "beyond regular, and some (with recursion) reach completeness. The " +
            "theoretical construct and the practical library are different " +
            "things."
        },
        {
          w: "Real computers are Turing complete.",
          r: "Strictly, no — a Turing machine has **infinite** tape and real " +
            "machines have finite memory, making them technically finite state " +
            "machines. The distinction is formally important and practically " +
            "irrelevant, since the state count is astronomically large."
        },
        {
          w: "Turing completeness is always desirable in a language.",
          r: "Often the opposite. A configuration language, a query language, " +
            "or a smart contract language benefits from being **deliberately " +
            "limited**, because limitation makes analysis possible — you can " +
            "guarantee termination, bound resource use, and reason about what " +
            "an input will do."
        }
      ],

      trade: {
        buys: [
          "A precise, universal definition of computational capability.",
          "Lets any two systems be compared on one axis.",
          "Explains why undecidability applies so broadly.",
          "Makes *deliberately limited* a defensible design choice."
        ],
        costs: [
          "Says nothing about efficiency or usability.",
          "Frequently used as a vague synonym for *powerful*.",
          "Achieved accidentally, usually to the system's detriment.",
          "The infinite-memory idealisation does not match real machines."
        ],
        avoid: [
          "Choosing a language for real work — completeness is table stakes " +
            "and tells you nothing useful.",
          "Designing a configuration or query language, where you want the " +
            "opposite.",
          "Reasoning about performance, which it does not address.",
          "You need guaranteed termination — that requires a *total* language."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
