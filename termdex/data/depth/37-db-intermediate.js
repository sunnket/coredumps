/* ==========================================================================
   Depth pass 37 — the intermediate tier begins: database fundamentals.

   These are the terms people use daily and rarely examine. The recurring
   theme is that each is a **deliberate trade against normalisation or
   against consistency**, made for performance, and each carries a cost that
   only surfaces later — stale data, hidden logic, lock contention.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "b-tree",

      why: {
        before: "In-memory search used binary trees — halve the search space " +
          "at each node, `O(log₂ n)` comparisons. Optimal when a comparison is " +
          "the unit of cost.",
        problem: "On disk it is not. Reading **one byte costs the same as " +
          "reading 8KB**, because storage transfers whole pages. A binary tree " +
          "of a million rows is 20 levels deep, and each level is a separate " +
          "page read — 20 disk seeks for one lookup, where the comparisons " +
          "themselves are free by comparison.",
        shift: "Make each node **as wide as a page**. Store hundreds of keys " +
          "per node instead of one, so the tree becomes shallow and wide: " +
          "`log₂₅₆ n` instead of `log₂ n`. The optimisation target changes from " +
          "*minimise comparisons* to **minimise page reads**, and that single " +
          "change is why every database index is a B-tree."
      },

      num: {
        t: "Depth at one million rows",
        h: ["Structure", "Fan-out", "Depth", "Disk reads"],
        r: [
          ["Binary tree", "2", "**20**", "**20**"],
          ["B-tree", "~256", "**3**", "**3**"],
          ["B-tree at 1 **billion** rows", "~256", "**4**", "**4**"]
        ],
        n: "The third row is the one to internalise: **a thousand times more " +
          "data costs one extra page read**. That is why B-trees scale so " +
          "gracefully, and why the top levels are almost always cached in " +
          "memory — meaning a lookup in practice is often one or two actual " +
          "disk reads. Databases use **B+ trees** specifically: all data lives " +
          "in the leaves, which are linked in a list, so a range scan walks " +
          "the leaf chain sequentially rather than traversing the tree " +
          "repeatedly. That is what makes `WHERE date BETWEEN x AND y` fast. " +
          "Note also the **write** cost — keeping nodes sorted means an insert " +
          "may split a page and propagate upward, which is precisely the cost " +
          "**LSM trees** avoid by trading read performance for write " +
          "throughput."
      },

      miss: [
        {
          w: "B-tree stands for binary tree.",
          r: "It does not — nodes have **hundreds** of children, not two. " +
            "Bayer never explained what the B meant; balanced, Bayer and Boeing " +
            "are all proposed. It is emphatically not binary, and the confusion " +
            "obscures the whole design rationale."
        },
        {
          w: "B-trees are the best index structure for all workloads.",
          r: "They are optimal for **read-heavy and range-query** workloads. " +
            "For write-heavy workloads, **LSM trees** (used by Cassandra, " +
            "RocksDB, ClickHouse) buffer writes in memory and flush " +
            "sequentially, achieving far higher write throughput at the cost " +
            "of read amplification."
        },
        {
          w: "The tree is rebalanced like an AVL tree, with rotations.",
          r: "B-trees maintain balance by **splitting** full nodes and " +
            "**merging** underfull ones, not by rotation. Because all leaves " +
            "are at the same depth by construction, growth happens at the " +
            "**root** — the tree gets taller only when the root splits."
        },
        {
          w: "A B+ tree is a minor variant.",
          r: "It is the one databases actually use, and the difference matters: " +
            "storing data only in **linked leaves** makes range scans " +
            "sequential rather than requiring repeated tree traversal, and it " +
            "increases fan-out in internal nodes since they hold only keys."
        }
      ],

      trade: {
        buys: [
          "Three or four page reads regardless of table size.",
          "Range queries and sorted iteration are cheap.",
          "Depth grows logarithmically — a billion rows costs one more level.",
          "Self-balancing with guaranteed worst-case bounds."
        ],
        costs: [
          "Writes may split pages and propagate upward.",
          "Random insertion order fragments pages.",
          "Storage overhead — pages are not kept full.",
          "Lower write throughput than LSM trees."
        ],
        avoid: [
          "The workload is write-heavy — **LSM trees** are designed for it.",
          "You only need exact-match lookup with no ranges — a **hash index** " +
            "is faster.",
          "Everything fits in memory and you need no ordering.",
          "The data is append-only and never queried by key."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "materialised-view",

      why: {
        before: "A **view** is a saved query — referencing it re-runs the " +
          "underlying SQL every time. Convenient for readability, and it costs " +
          "the full query on every access.",
        problem: "Some queries are genuinely expensive: aggregating a hundred " +
          "million rows, joining six tables, computing a daily rollup. Running " +
          "that on every dashboard load is unaffordable, and the underlying " +
          "data may have changed by only a handful of rows.",
        shift: "**Store the result.** A materialised view physically persists " +
          "the query output, so reads are as fast as reading a table. The " +
          "price is that it is a **cache**, with everything that implies: it " +
          "goes stale, and something must refresh it."
      },

      num: {
        t: "The refresh strategies",
        h: ["Strategy", "Freshness", "Cost", "Availability"],
        r: [
          ["**Manual `REFRESH`**", "**stale until you run it**", "full recompute", "**blocks reads**"],
          ["`REFRESH CONCURRENTLY`", "same", "slower", "**reads continue**"],
          ["Scheduled", "bounded staleness", "periodic", "depends"],
          ["**Incremental**", "**near-real-time**", "**only changed rows**", "good"],
          ["On commit (Oracle)", "always fresh", "**slows every write**", "good"]
        ],
        n: "**PostgreSQL has no built-in incremental refresh** — `REFRESH " +
          "MATERIALIZED VIEW` recomputes the whole thing, which for a large " +
          "aggregation can take minutes and, without `CONCURRENTLY`, holds an " +
          "exclusive lock the entire time. `CONCURRENTLY` avoids blocking " +
          "readers but requires a unique index and runs slower. Oracle and SQL " +
          "Server offer incremental and on-commit options that Postgres " +
          "does not, and third-party extensions like pg_ivm are filling the " +
          "gap. The practical consequence: in Postgres, **a materialised view " +
          "is a scheduled batch job wearing a table's clothes**, and you must " +
          "decide explicitly how stale is acceptable."
      },

      miss: [
        {
          w: "A materialised view updates automatically when the data changes.",
          r: "In PostgreSQL and most engines, **no** — you must refresh it " +
            "explicitly or on a schedule. Oracle offers on-commit refresh, at " +
            "the cost of slowing every write to the base tables. Assuming " +
            "auto-refresh is the most common and most damaging mistake."
        },
        {
          w: "It is just a view with better performance.",
          r: "It is a **stored copy** with a staleness window. A view is always " +
            "current and costs a query; a materialised view is fast and " +
            "possibly wrong. They are different objects with different " +
            "correctness properties, not two performance levels."
        },
        {
          w: "`REFRESH` is a background operation that does not affect users.",
          r: "Plain `REFRESH MATERIALIZED VIEW` takes an **exclusive lock** — " +
            "readers block for its entire duration, which can be minutes. " +
            "`CONCURRENTLY` fixes this and requires a unique index on the " +
            "view."
        },
        {
          w: "You should materialise any slow query.",
          r: "First check whether **indexing or query rewriting** fixes it — " +
            "those keep the data current. Materialising accepts staleness and " +
            "adds a refresh job to operate. It is the right answer for genuine " +
            "aggregations over large data, not for a query that is slow because " +
            "it is missing an index."
        }
      ],

      trade: {
        buys: [
          "Expensive aggregations become table-speed reads.",
          "Can be indexed like any table.",
          "Removes repeated computation for dashboards and reports.",
          "Isolates analytical load from the base tables."
        ],
        costs: [
          "Data is stale between refreshes.",
          "Refresh is expensive and may lock readers.",
          "Storage duplicated.",
          "A refresh schedule to operate and monitor.",
          "No incremental refresh in PostgreSQL."
        ],
        avoid: [
          "The data must be current — use a plain view or query.",
          "An index or query rewrite would fix the performance.",
          "The base data changes constantly, so refresh never catches up.",
          "The query is cheap enough that materialising buys little."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "denormalisation",

      why: {
        before: "Normalisation is the default and for good reason: each fact " +
          "stored **exactly once**, so it cannot become inconsistent, and " +
          "updates touch one row.",
        problem: "Reading normalised data means **joins**, and joins cost. A " +
          "product listing needing name, category, brand, price and review " +
          "count joins five tables, and at scale that query becomes the " +
          "bottleneck — even though nothing about it is logically complex.",
        shift: "Deliberately **duplicate data to avoid the join**. Store the " +
          "category name on the product row alongside the category id. Reads " +
          "get faster; writes must now update every copy, and the possibility " +
          "of inconsistency is reintroduced by design."
      },

      num: {
        t: "The trade, made explicit",
        h: ["", "Normalised", "Denormalised"],
        r: [
          ["Storage", "**minimal**", "duplicated"],
          ["Reads", "joins required", "**single-table**"],
          ["Writes", "**one row**", "**every copy**"],
          ["Consistency", "**guaranteed by structure**", "**your responsibility**"],
          ["Schema change", "one place", "everywhere it was copied"]
        ],
        n: "The **consistency** row is where denormalisation actually hurts, " +
          "and it hurts later. Every duplicated value is a place the data can " +
          "drift, and drift is silent — nothing errors, the numbers just stop " +
          "agreeing. The disciplined approaches are: **derive rather than " +
          "duplicate** (a materialised view or a summary table refreshed from " +
          "the source), or **duplicate only immutable values** (the price *at " +
          "time of order* is genuinely a different fact from the current " +
          "price, so storing it on the order is normalisation, not " +
          "denormalisation). The rule that survives contact with production: " +
          "**normalise first, denormalise with evidence** — a measured slow " +
          "query, not an anticipated one."
      },

      miss: [
        {
          w: "Denormalisation means your schema design was wrong.",
          r: "It is a **deliberate optimisation** applied to a correct design. " +
            "Normalisation optimises for write integrity; denormalisation " +
            "trades some of that for read speed. Data warehouses denormalise " +
            "as standard practice — star schemas are denormalised by design."
        },
        {
          w: "Storing the order's price on the order row is denormalisation.",
          r: "It is **not** — the price at time of purchase is a genuinely " +
            "different fact from the product's current price, and it must be " +
            "stored because it cannot be derived. Confusing *historical " +
            "snapshot* with *duplicated current value* is a common error in " +
            "both directions."
        },
        {
          w: "You should denormalise proactively for performance.",
          r: "Premature denormalisation adds consistency risk for speed you " +
            "have not shown you need. **Measure first.** Modern databases join " +
            "far faster than people assume, and an index frequently solves what " +
            "looked like a join problem."
        },
        {
          w: "Once denormalised, you must maintain copies in application code.",
          r: "**Triggers**, **materialised views** and **change-data-capture " +
            "pipelines** can maintain derived copies without scattering update " +
            "logic through the application. Application-maintained duplication " +
            "is the most error-prone option, not the only one."
        }
      ],

      trade: {
        buys: [
          "Removes joins from hot read paths.",
          "Simpler queries against a single table.",
          "Can be decisive for read-heavy workloads at scale.",
          "Standard and correct practice in analytical schemas."
        ],
        costs: [
          "Data can drift out of sync, silently.",
          "Writes must update every copy.",
          "More storage.",
          "Schema changes touch every duplicate.",
          "Update logic to write, test and maintain."
        ],
        avoid: [
          "You have not measured a real read bottleneck.",
          "An index or query rewrite would solve it.",
          "The data changes frequently — synchronisation cost dominates.",
          "Consistency is critical and you cannot guarantee the copies agree.",
          "A **materialised view** would give the same reads with derivation " +
            "rather than duplication."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "trigger",

      why: {
        before: "Rules like *update the modified timestamp* or *write an audit " +
          "row* lived in application code, executed by whichever service " +
          "performed the write.",
        problem: "Multiple applications, admin tools, migration scripts and " +
          "manual `psql` sessions all write to the same tables — and each " +
          "would need to remember the rule. Any path that forgets it silently " +
          "breaks the invariant, and there is no way to enforce it from the " +
          "application layer.",
        shift: "Move the rule into the **database**, where every write path " +
          "must pass. A trigger fires automatically on insert, update or " +
          "delete, so the guarantee holds regardless of who is writing — " +
          "which is exactly what makes triggers valuable and exactly what " +
          "makes them dangerous."
      },

      num: {
        t: "What triggers are good and bad at",
        h: ["Use", "Verdict"],
        r: [
          ["Audit logging", "**good — must catch every path**"],
          ["`updated_at` timestamps", "**good — trivial and universal**"],
          ["Enforcing invariants", "good, if constraints cannot express it"],
          ["**Business logic**", "**bad — invisible and untestable**"],
          ["**Calling external services**", "**bad — inside the transaction**"],
          ["Cascading updates", "**dangerous — can chain unboundedly**"]
        ],
        n: "The defining problem with triggers is **invisibility**: a developer " +
          "reading the application code sees an `INSERT` and has no indication " +
          "that three other tables were also modified. Debugging *why did this " +
          "row change* becomes archaeology across trigger definitions. They " +
          "also run **inside the transaction**, so a slow trigger extends every " +
          "write's lock duration, and a trigger calling an external service " +
          "holds a database transaction open across a network call — which is " +
          "how a slow HTTP endpoint takes down a database. The rule that " +
          "works: **triggers for invariants that must hold on every path; " +
          "application code for business logic.**"
      },

      miss: [
        {
          w: "Triggers are always bad practice.",
          r: "They are the **right tool** for guarantees that must hold " +
            "regardless of write path — audit trails, timestamps, invariants " +
            "beyond what constraints express. The objection is to business " +
            "logic in triggers, not to triggers."
        },
        {
          w: "A trigger runs after the transaction commits.",
          r: "It runs **inside** the transaction. If it fails, the whole " +
            "transaction rolls back; if it is slow, every write is slow and " +
            "locks are held longer. This is why calling external services from " +
            "a trigger is a serious mistake."
        },
        {
          w: "Row-level and statement-level triggers are interchangeable.",
          r: "A **row-level** trigger fires once per affected row — an " +
            "`UPDATE` touching a million rows fires it a million times. A " +
            "**statement-level** trigger fires once. Choosing row-level for a " +
            "bulk operation is a common cause of unexplained slowness."
        },
        {
          w: "You can safely have triggers that update other tables with " +
            "triggers.",
          r: "Trigger chains are **very hard to reason about** and can " +
            "recurse. Some databases limit depth; some do not. A change to one " +
            "table cascading through four others is a genuine operational " +
            "hazard, and it will be discovered during an incident."
        }
      ],

      trade: {
        buys: [
          "Guarantees hold across every write path, including manual ones.",
          "Audit trails that cannot be bypassed.",
          "Enforces invariants declarative constraints cannot express.",
          "Runs atomically within the transaction."
        ],
        costs: [
          "Invisible from the application code.",
          "Extends transaction duration and lock hold time.",
          "Hard to test, version and debug.",
          "Trigger chains are difficult to reason about.",
          "Row-level triggers are pathological on bulk operations."
        ],
        avoid: [
          "A **constraint** would express the rule declaratively — always " +
            "prefer that.",
          "It is business logic — put it in the application where it is " +
            "visible.",
          "It would call an external service.",
          "The operation is bulk and a row-level trigger would fire millions " +
            "of times.",
          "The team would not know the trigger exists."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "common-table-expression",

      why: {
        before: "Complex queries meant **nested subqueries** — a query inside " +
          "a query inside a query — read inside-out, with the same subquery " +
          "often repeated in several places.",
        problem: "That is genuinely hard to read and to modify. A five-level " +
          "nested query has no names for its intermediate results, so " +
          "understanding it means mentally executing it, and changing one part " +
          "risks breaking another.",
        shift: "**Name the intermediate steps.** A `WITH` clause defines named " +
          "temporary result sets at the top, so the query reads top to bottom " +
          "like a program with variables. And **recursive CTEs** add something " +
          "genuinely new: a query that references itself, which is how you " +
          "traverse hierarchies and graphs in SQL at all."
      },

      num: {
        t: "What CTEs give you",
        h: ["Capability", "Note"],
        r: [
          ["**Readability**", "**named steps, read top-down**"],
          ["Reuse within a query", "reference the same CTE twice"],
          ["**Recursion**", "**org charts, graph traversal, sequences**"],
          ["**Optimisation fence**", "**Postgres < 12 always materialised**"],
          ["Scope", "one statement only — not persistent"]
        ],
        n: "The **optimisation fence** is the historical trap worth knowing: " +
          "**PostgreSQL before version 12 always materialised CTEs**, " +
          "computing them fully rather than inlining them into the outer " +
          "query — so a CTE could be dramatically slower than the equivalent " +
          "subquery because predicates were not pushed down into it. Postgres " +
          "12 made CTEs inlinable by default, with `MATERIALIZED` and `NOT " +
          "MATERIALIZED` hints for explicit control. Other engines behave " +
          "differently. **Recursive CTEs** are the more interesting capability: " +
          "an anchor query plus a recursive term that references the CTE, " +
          "unioned together — which lets plain SQL walk a hierarchy of unknown " +
          "depth, something otherwise requiring application code or a graph " +
          "database."
      },

      miss: [
        {
          w: "CTEs are always faster than subqueries.",
          r: "They are usually about **readability**, not speed. In PostgreSQL " +
            "before 12 they were often **slower**, because materialisation " +
            "blocked predicate pushdown. Modern versions inline them, making " +
            "performance comparable — check your engine and version."
        },
        {
          w: "A CTE is like a temporary table you can reuse across queries.",
          r: "It exists for **one statement only**. Referencing it from a " +
            "second query is an error. For reuse across statements you need a " +
            "temporary table, a view, or a materialised view."
        },
        {
          w: "Recursive CTEs are just syntax for loops.",
          r: "They are **set-based** — each iteration operates on the entire " +
            "result of the previous one, not on individual rows. That is why " +
            "they express graph traversal naturally, and why an infinite loop " +
            "on cyclic data is a real hazard requiring a depth limit or cycle " +
            "detection."
        },
        {
          w: "Referencing a CTE twice computes it once.",
          r: "Only if the engine materialises it. If it is inlined, it is " +
            "**computed once per reference**. In Postgres 12+ you can force " +
            "single evaluation with `MATERIALIZED` when the CTE is expensive " +
            "and used repeatedly."
        }
      ],

      trade: {
        buys: [
          "Named intermediate steps — dramatically more readable.",
          "Recursion, enabling hierarchy and graph traversal in SQL.",
          "Reusable within a statement.",
          "Standard SQL, supported everywhere modern."
        ],
        costs: [
          "Historically an optimisation fence in PostgreSQL.",
          "Scope limited to one statement.",
          "Recursive CTEs can loop forever on cyclic data.",
          "Deeply nested CTEs can still be hard to follow."
        ],
        avoid: [
          "A simple join or subquery is clearer for a short query.",
          "You need reuse across statements — use a view or temp table.",
          "You are on an old PostgreSQL and the CTE blocks a needed " +
            "optimisation.",
          "Traversal is deep and frequent — a graph database may fit better."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "base",

      why: {
        before: "**ACID** was the standard: transactions that are atomic, " +
          "consistent, isolated and durable, and a system that refuses the " +
          "write rather than risk breaking them.",
        problem: "Across many machines, ACID is expensive. Guaranteeing " +
          "isolation and immediate consistency requires coordination on every " +
          "write, which means latency and — during a network partition — " +
          "**refusing to serve**. For a shopping cart or a social feed, " +
          "refusing writes to preserve strict consistency is the wrong trade.",
        shift: "Accept weaker guarantees for availability. **BASE** — Basically " +
          "Available, Soft state, Eventually consistent — is the deliberate " +
          "opposite of ACID, and the acronym is a chemistry joke: acids and " +
          "bases are opposites. The system always accepts writes and converges " +
          "afterwards."
      },

      num: {
        t: "ACID against BASE",
        h: ["", "ACID", "BASE"],
        r: [
          ["During a partition", "**refuse writes**", "**accept them**"],
          ["Consistency", "immediate", "**eventual**"],
          ["Conflict handling", "prevented by locks", "**resolved after the fact**"],
          ["Application burden", "low", "**must tolerate staleness**"],
          ["CAP position", "**CP**", "**AP**"]
        ],
        n: "The **application burden** row is the one people underestimate: " +
          "BASE moves work from the database into your code. A user updates " +
          "their profile and sees the old version on the next page load; two " +
          "concurrent writes conflict and something must decide which wins. " +
          "**Last-write-wins silently discards data**, which is why CRDTs and " +
          "vector clocks exist. The framing is also less binary than the " +
          "acronyms suggest — most real systems are **mixed**: Cassandra offers " +
          "tunable consistency per query, and a single application typically " +
          "wants ACID for payments and BASE for view counts. The useful " +
          "question is not *which model* but *which guarantee does this " +
          "particular operation need*."
      },

      miss: [
        {
          w: "BASE means the data is unreliable.",
          r: "It means reads may be **stale for a window**, usually " +
            "milliseconds. The data converges. For a follower count, a like, or " +
            "a product view counter that is entirely acceptable; for a bank " +
            "balance it is not. *Unreliable* conflates staleness with " +
            "incorrectness."
        },
        {
          w: "You choose ACID or BASE for your whole system.",
          r: "You choose **per operation**. Order placement wants ACID; the " +
            "recommendation sidebar wants BASE. Many databases support both — " +
            "Cassandra's `QUORUM` reads and writes give strong consistency on " +
            "demand within an AP system."
        },
        {
          w: "Eventually consistent means it converges quickly.",
          r: "*Eventually* is a formal guarantee with **no time bound**. In " +
            "practice it is milliseconds; during a partition it can be minutes " +
            "or longer. If your application needs a bound, you need to " +
            "**measure and monitor** the lag rather than assume it."
        },
        {
          w: "BASE systems cannot support transactions.",
          r: "Many now do. MongoDB has multi-document transactions, DynamoDB " +
            "has them, and Cassandra offers lightweight transactions via " +
            "Paxos. The historical split between the models has blurred " +
            "considerably."
        }
      ],

      trade: {
        buys: [
          "Availability during partitions and failures.",
          "Lower write latency — no coordination on every write.",
          "Scales horizontally without distributed locking.",
          "Right for high-volume data where staleness is harmless."
        ],
        costs: [
          "Reads can be stale, and the application must handle it.",
          "Conflict resolution becomes your responsibility.",
          "Last-write-wins silently loses data.",
          "Harder to reason about and to test.",
          "No time bound on convergence."
        ],
        avoid: [
          "The operation involves money, inventory or permissions.",
          "The application cannot present stale data acceptably.",
          "You have no conflict resolution strategy.",
          "The data fits on one machine — single-node ACID is simpler and " +
            "cheaper."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stored-procedure",

      why: {
        before: "Application code sent SQL statements to the database one at a " +
          "time, with logic and control flow living in the application and " +
          "each statement crossing the network.",
        problem: "For multi-step operations that is slow and racy. A procedure " +
          "reading a balance, checking it, and updating it makes three round " +
          "trips — each adding latency, and the gap between read and write is " +
          "a window for another transaction to interfere.",
        shift: "**Move the procedure into the database.** Logic executes " +
          "beside the data with no round trips, in a single transaction, and " +
          "the application calls it as one operation. In the client-server era " +
          "this was transformative; in the age of ORMs and version-controlled " +
          "application code, the trade looks different."
      },

      num: {
        t: "Where stored procedures still win — and lose",
        h: ["Concern", "Stored procedure", "Application code"],
        r: [
          ["**Round trips**", "**one**", "many"],
          ["**Version control**", "**awkward**", "**natural**"],
          ["Testing", "**hard**", "easy"],
          ["Code review", "often skipped", "standard"],
          ["Portability", "**engine-specific dialect**", "portable"],
          ["Bulk data operations", "**very fast**", "slow across the wire"]
        ],
        n: "The **version control** row is the decisive modern objection: " +
          "procedures live in the database, so they are easily changed without " +
          "review, deployed outside your release process, and drift from " +
          "whatever is in the repository. Teams that use them successfully " +
          "treat them as code — in migrations, in git, deployed through the " +
          "same pipeline — and teams that do not end up with logic nobody can " +
          "find. Where they remain genuinely superior is **data-intensive " +
          "operations**: a procedure that processes a million rows entirely " +
          "inside the database avoids moving those rows across the network, " +
          "and no amount of application optimisation matches that."
      },

      miss: [
        {
          w: "Stored procedures are faster because they are precompiled.",
          r: "Modern databases cache execution plans for **any** parameterised " +
            "query, so a prepared statement gets the same benefit. The real " +
            "performance advantage is **eliminating network round trips** for " +
            "multi-step and data-intensive work."
        },
        {
          w: "They are obsolete — business logic belongs in the application.",
          r: "For most logic, yes. For **bulk data processing** they remain " +
            "decisively faster, because the alternative moves large volumes " +
            "across the network. ETL and batch operations are where they still " +
            "genuinely win."
        },
        {
          w: "They provide security by preventing SQL injection.",
          r: "Only if they use **parameters**. A stored procedure that " +
            "concatenates its inputs into dynamic SQL is exactly as vulnerable " +
            "as application code doing the same. The protection comes from " +
            "parameterisation, not from the procedure."
        },
        {
          w: "Stored procedures are portable across databases.",
          r: "**PL/pgSQL, T-SQL and PL/SQL are different languages.** Moving " +
            "between engines means rewriting every procedure. This is a real " +
            "lock-in cost that application-side logic does not have."
        }
      ],

      trade: {
        buys: [
          "One round trip for multi-step operations.",
          "Very fast for bulk data processing.",
          "Atomic execution within one transaction.",
          "Shared logic across applications hitting the same database.",
          "Can restrict direct table access, granting only procedure " +
            "execution."
        ],
        costs: [
          "Awkward to version control and review.",
          "Hard to test.",
          "Engine-specific — a real portability barrier.",
          "Logic hidden from developers reading application code.",
          "Scaling means scaling the database, which is expensive."
        ],
        avoid: [
          "The logic is business rules better kept in the application.",
          "You need portability across database engines.",
          "The team cannot bring them under version control and review.",
          "It is a simple query — a parameterised statement is equivalent.",
          "You would scale by adding application servers, not database " +
            "capacity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "referential-integrity",

      why: {
        before: "Relationships between tables were a **convention**: an " +
          "`order.customer_id` was understood to reference `customer.id`, and " +
          "nothing enforced it.",
        problem: "Conventions break. A delete removes a customer and leaves a " +
          "thousand orphaned orders pointing at a row that no longer exists. " +
          "A typo inserts an order for customer 9999 who never existed. " +
          "Neither errors, and both corrupt the data silently — the query " +
          "joining them simply returns fewer rows than expected, and nobody " +
          "notices for months.",
        shift: "Let the **database enforce it**. A foreign key constraint " +
          "guarantees every reference points at a row that exists, rejecting " +
          "any write that would break it. The guarantee holds for every write " +
          "path — application, admin tool, migration script, manual session — " +
          "which is what makes it structurally different from validation in " +
          "application code."
      },

      num: {
        t: "Referential actions on delete",
        h: ["Action", "Behaviour", "Use when"],
        r: [
          ["`RESTRICT` / `NO ACTION`", "**refuse the delete**", "**the safe default**"],
          ["**`CASCADE`**", "**delete the children too**", "**genuine ownership**"],
          ["`SET NULL`", "null the reference", "the link is optional"],
          ["`SET DEFAULT`", "point at a default row", "rare"]
        ],
        n: "**`CASCADE` is more dangerous than it looks.** Deleting one row can " +
          "silently remove thousands across many tables, and cascades chain — " +
          "a delete on `customer` can propagate through orders to order lines " +
          "to shipments. Use it only where the child genuinely **cannot exist " +
          "without** the parent. The other thing that catches people: " +
          "**foreign keys require an index on the referencing column** for " +
          "deletes to be fast, and most databases do **not** create it " +
          "automatically — PostgreSQL and MySQL InnoDB differ here, and a " +
          "missing index makes every parent delete scan the child table. " +
          "The performance objection to foreign keys is real but small: they " +
          "cost a lookup per write, and the corruption they prevent is " +
          "expensive and permanent."
      },

      miss: [
        {
          w: "Application-level validation makes foreign keys unnecessary.",
          r: "Application code is **one write path**. Admin tools, migration " +
            "scripts, data imports, background jobs and manual sessions all " +
            "bypass it. The constraint holds regardless of who is writing, " +
            "which is precisely the point."
        },
        {
          w: "Foreign keys hurt performance too much at scale.",
          r: "They cost an index lookup per write — real and usually small. " +
            "Large systems do sometimes drop them for write throughput, and " +
            "that is a **deliberate trade accepting responsibility for " +
            "integrity**, not a free optimisation. Orphaned data accumulates " +
            "quietly."
        },
        {
          w: "`ON DELETE CASCADE` is a convenience for cleaning up.",
          r: "It is a **loaded weapon**. One delete can remove thousands of " +
            "rows across many tables, and cascades chain. Use it only where the " +
            "child cannot meaningfully exist without the parent — an order line " +
            "without its order — and never as a convenience."
        },
        {
          w: "Foreign keys are automatically indexed.",
          r: "The **referenced** column must be unique and is therefore " +
            "indexed. The **referencing** column usually is not indexed " +
            "automatically in PostgreSQL, and without that index every parent " +
            "delete scans the child table. It is one of the most common causes " +
            "of unexpectedly slow deletes."
        }
      ],

      trade: {
        buys: [
          "Orphaned rows become impossible.",
          "Enforced on every write path, not just the application.",
          "Documents relationships in the schema itself.",
          "Lets the query planner reason about relationships.",
          "Catches bugs at the point of the bad write."
        ],
        costs: [
          "An index lookup per insert and update.",
          "Deletes are slower, especially without the child index.",
          "Can complicate bulk loading and migrations.",
          "`CASCADE` is dangerous if used carelessly.",
          "Cross-shard and cross-service references cannot be enforced."
        ],
        avoid: [
          "The reference crosses a service or shard boundary — the database " +
            "cannot see it.",
          "You are bulk loading and will re-enable constraints afterwards.",
          "Write throughput is critical and you have accepted responsibility " +
            "for integrity explicitly.",
          "The relationship is genuinely optional and unenforceable."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
