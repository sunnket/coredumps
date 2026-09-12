/* ==========================================================================
   Depth pass 19 — data engineering: streams, table formats, and the failure
   modes that only appear at scale.

   Two threads run through these. First, **distributed processing is only as
   fast as its slowest partition** — which is why skew, bucketing and
   partitioning decisions dominate real performance far more than engine
   choice. Second, **the boundary between "a pile of files" and "a table" is
   a transaction log** — which is the entire contribution of Iceberg and
   Delta Lake.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "data-skew",

      why: {
        before: "Distributed processing assumed work divides evenly. Split the " +
          "data into 200 partitions across 200 cores and finish in 1/200th of " +
          "the time.",
        problem: "Real data is not uniform. Partition orders by `customer_id` " +
          "and one enterprise customer has ten million rows while the median " +
          "has forty. **One task processes 40% of the data** while 199 sit " +
          "idle, and the job takes as long as that single task.",
        shift: "Recognise that a distributed job's runtime is set by its " +
          "**slowest partition**, not its average. Every mitigation is a way " +
          "of breaking up the heavy key: salting it across several partitions, " +
          "broadcasting the small side of a join, or handling hot keys " +
          "separately."
      },

      num: {
        t: "What skew does to a job",
        h: ["Distribution", "Slowest task", "Wall clock", "Cores useful"],
        r: [
          ["Even, 200 partitions", "0.5%", "**1×**", "200"],
          ["One key at 20%", "20%", "**~40×**", "effectively 5"],
          ["One key at 50%", "50%", "**~100×**", "effectively 2"]
        ],
        n: "The wall-clock column is the point: skew does not slow a job " +
          "proportionally, it **collapses your parallelism**. The standard " +
          "diagnostic is the Spark UI's task duration distribution — if the max " +
          "is far above the median, you have skew, and no amount of extra " +
          "cluster capacity will help. The fixes in order of preference: " +
          "**broadcast join** if one side fits in memory (eliminates the " +
          "shuffle entirely), **salting** the hot key by appending a random " +
          "suffix and aggregating twice, or **adaptive query execution**, which " +
          "Spark 3 enables by default and which splits skewed partitions " +
          "automatically. `NULL` is a frequent culprit and easy to miss — " +
          "millions of rows with a null join key all hash to one partition."
      },

      miss: [
        {
          w: "Adding more executors fixes a slow job.",
          r: "If the job is skewed, extra executors sit **idle** while one task " +
            "grinds. You are paying for capacity that cannot be used. Check " +
            "the task duration distribution before scaling — this is the most " +
            "common wasted-money mistake in data engineering."
        },
        {
          w: "Increasing the partition count spreads skew out.",
          r: "Partitions are assigned by **hashing the key**, so all rows with " +
            "the same key land together regardless of how many partitions " +
            "exist. Doubling partitions does not split a hot key at all — only " +
            "changing the key does, which is what salting means."
        },
        {
          w: "Skew is a data quality problem to fix upstream.",
          r: "Often the skew is **real and correct** — one customer genuinely " +
            "is a thousand times larger, one product genuinely sells more. " +
            "Zipf-distributed data is the norm, not an anomaly. You handle it " +
            "in processing rather than pretending it away."
        },
        {
          w: "Salting solves it cleanly.",
          r: "Salting requires a **two-stage aggregation** — aggregate by " +
            "salted key, then re-aggregate by the real key — which complicates " +
            "the query and does not work for all operations. It is effective " +
            "and it is not free, which is why broadcast joins and AQE are " +
            "tried first."
        }
      ],

      trade: {
        buys: [
          "Understanding it turns a mysterious slow job into a diagnosable one.",
          "Broadcast joins remove the shuffle entirely when applicable.",
          "AQE handles many cases automatically in modern Spark.",
          "Salting makes genuinely pathological keys tractable."
        ],
        costs: [
          "Salting adds a two-stage aggregation and complexity.",
          "Broadcast joins need one side small enough for memory.",
          "Detecting skew requires reading execution metrics.",
          "Mitigations are query-specific rather than general."
        ],
        avoid: [
          "The data is genuinely uniform — measure before optimising.",
          "The dataset is small enough that one machine handles it.",
          "The engine's adaptive execution already handles it — check first.",
          "The bottleneck is I/O or serialisation rather than partition " +
            "imbalance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "apache-iceberg",

      why: {
        before: "A data lake was directories of Parquet files, with Hive " +
          "tracking tables as **directory paths**. A partition was a folder, " +
          "and listing a table meant listing directories in object storage.",
        problem: "Several things break. Listing millions of files on S3 is slow " +
          "and expensive. There are **no transactions** — a reader can see a " +
          "half-written commit. Schema changes require rewriting everything. " +
          "And partitioning is baked into the directory layout, so changing it " +
          "means rewriting the table.",
        shift: "Add a **metadata layer**: a set of manifest files listing " +
          "exactly which data files constitute the table at each snapshot, with " +
          "column statistics. A commit is an **atomic pointer swap** to a new " +
          "metadata file. The table becomes a *log of snapshots* rather than a " +
          "directory."
      },

      num: {
        t: "Hive tables against Iceberg",
        h: ["Capability", "Hive", "Iceberg"],
        r: [
          ["Table = ", "a directory", "**a metadata tree**"],
          ["Planning", "list all directories", "read manifests + stats"],
          ["Atomic commits", "**no**", "yes"],
          ["Schema evolution", "rewrite", "**metadata-only**"],
          ["Partition change", "rewrite the table", "**hidden partitioning**"],
          ["Time travel", "no", "**query any snapshot**"]
        ],
        n: "**Hidden partitioning** is the feature that most changes daily " +
          "life. In Hive you partition by a derived column and every query " +
          "**must filter on it** — `WHERE event_date = '2024-01-15'` prunes, " +
          "`WHERE event_ts > ...` does not, and a user who forgets scans the " +
          "whole table. Iceberg stores the partition **transform** in metadata, " +
          "so filtering on the real timestamp column prunes correctly without " +
          "the user knowing the layout. It also means you can **change the " +
          "partitioning** and old data stays valid, which was previously a " +
          "table rewrite. The costs are real: many small files degrade planning " +
          "(compaction is a required maintenance job), and old snapshots retain " +
          "data files until expired, so storage grows silently."
      },

      miss: [
        {
          w: "Iceberg is a storage format like Parquet.",
          r: "It is a **table format** — a metadata layer *over* file formats. " +
            "The data files are still Parquet, ORC or Avro. Iceberg describes " +
            "which files make up the table, their statistics, and the history " +
            "of changes."
        },
        {
          w: "Time travel means you can keep every version forever cheaply.",
          r: "Every retained snapshot pins its **data files**, so storage grows " +
            "with history. `expire_snapshots` deletes old metadata and its " +
            "orphaned files, and it must actually be scheduled. Teams routinely " +
            "discover their lake has doubled in size because nobody expired " +
            "anything."
        },
        {
          w: "Iceberg makes queries fast automatically.",
          r: "It enables good pruning through statistics, and a table with " +
            "millions of tiny files still plans slowly and reads inefficiently. " +
            "**Compaction** — rewriting small files into larger ones — is " +
            "ongoing maintenance, not something the format does for you."
        },
        {
          w: "You can switch between Iceberg and Delta Lake freely.",
          r: "They solve the same problem with incompatible metadata. Migration " +
            "is possible (and tools exist) and it is a real project. The " +
            "practical differentiator is often ecosystem: Delta is " +
            "Databricks-centric, Iceberg has broader multi-engine support."
        }
      ],

      trade: {
        buys: [
          "ACID transactions on object storage.",
          "Schema and partition evolution without rewriting data.",
          "Hidden partitioning — correct pruning without user knowledge.",
          "Time travel and rollback.",
          "Engine-agnostic: Spark, Trino, Flink, Snowflake, DuckDB."
        ],
        costs: [
          "Metadata is itself a thing to manage and maintain.",
          "Compaction and snapshot expiry are required ongoing jobs.",
          "More complex than plain files.",
          "Small-file problems degrade planning noticeably.",
          "Another concept for the team to learn."
        ],
        avoid: [
          "The dataset is small — plain Parquet or DuckDB is far simpler.",
          "Data is append-only and never updated or queried historically.",
          "You are committed to one warehouse that already handles this " +
            "internally.",
          "Nobody will run the maintenance jobs — an unmaintained Iceberg " +
            "table degrades."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "exactly-once-semantics",

      why: {
        before: "Message systems offered **at-most-once** (send and forget, may " +
          "lose) or **at-least-once** (retry until acknowledged, may " +
          "duplicate). Neither is what applications want.",
        problem: "Duplicates are unacceptable when the message is *charge this " +
          "card* or *decrement this inventory*. But you cannot distinguish a " +
          "lost message from a lost acknowledgement, so retrying is the only " +
          "option, and retrying means duplicates.",
        shift: "The insight is that **exactly-once *delivery* is impossible** — " +
          "this follows from the Two Generals problem — but **exactly-once " +
          "*processing*** is achievable. Deliver at least once, and make the " +
          "**effect** happen once, via idempotency or by committing the output " +
          "and the offset atomically."
      },

      num: {
        t: "How systems actually achieve it",
        h: ["Mechanism", "How", "Requires"],
        r: [
          ["Idempotent writes", "same key → same result", "a natural unique key"],
          ["**Transactional output**", "output + offset in one commit", "transactional sink"],
          ["Dedup by message ID", "store seen IDs", "state with retention"],
          ["Kafka transactions", "atomic multi-partition write", "Kafka sink"],
          ["Flink checkpointing", "snapshot state + offsets", "checkpointable sink"]
        ],
        n: "The critical caveat is that **exactly-once is end-to-end or it is " +
          "nothing**. Kafka's exactly-once guarantee applies to " +
          "**Kafka-to-Kafka**: read, process, write, commit offsets, all in one " +
          "transaction. The moment your sink is an external database, an HTTP " +
          "API or a file, the guarantee stops at the boundary unless that sink " +
          "participates in the transaction or is idempotent. Most production " +
          "incidents attributed to *exactly-once not working* are exactly this: " +
          "the framework held up its end and the sink did not. Note also " +
          "that it costs throughput — Kafka transactions add coordination " +
          "overhead, and Flink's checkpoint barriers add latency."
      },

      miss: [
        {
          w: "Exactly-once delivery is possible with the right protocol.",
          r: "It is **provably impossible** over an unreliable network — you " +
            "cannot distinguish a lost message from a lost acknowledgement, so " +
            "the sender must choose between risking loss and risking " +
            "duplication. What is achievable is exactly-once *effect*, which is " +
            "a different and weaker claim."
        },
        {
          w: "Enabling exactly-once in Kafka makes my pipeline exactly-once.",
          r: "It makes the **Kafka-to-Kafka** portion exactly-once. If you " +
            "write to Postgres, call an API, or produce files, that side needs " +
            "its own idempotency or a two-phase commit. The setting does not " +
            "extend past Kafka's boundary."
        },
        {
          w: "At-least-once plus deduplication is a workaround.",
          r: "It is one of the **two standard implementations**, and often the " +
            "better one. Deduplicating on a business key in the sink is simpler, " +
            "more portable and cheaper than distributed transactions. " +
            "Idempotency is the more robust engineering answer."
        },
        {
          w: "Exactly-once is free once configured.",
          r: "Kafka transactions add coordination round trips; Flink " +
            "checkpointing adds latency and state storage. Throughput " +
            "reductions of tens of percent are typical. It is a deliberate " +
            "trade, and for a metrics pipeline at-least-once is usually the " +
            "right choice."
        }
      ],

      trade: {
        buys: [
          "Correctness for financial and inventory workloads.",
          "Removes an entire class of reconciliation work.",
          "Framework support means less hand-written dedup logic.",
          "Makes retries safe by construction."
        ],
        costs: [
          "Meaningful throughput and latency cost.",
          "Only holds where every component participates.",
          "Deduplication state needs retention policy and storage.",
          "Complex failure modes — a stuck transaction blocks a partition."
        ],
        avoid: [
          "Duplicates are harmless — metrics, logs, clickstream.",
          "The operation is naturally idempotent already.",
          "The sink cannot participate, in which case build idempotency " +
            "instead.",
          "Throughput matters far more than perfect deduplication."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "windowing",

      why: {
        before: "Batch processing aggregated a **finite** dataset: read " +
          "yesterday's file, group, compute. The boundaries were obvious " +
          "because the data ended.",
        problem: "A stream never ends. *Average order value* over an infinite " +
          "stream is undefined — there is no point at which you have all the " +
          "data, so there is no point at which the aggregate is final.",
        shift: "Impose finite boundaries on the infinite. Group events into " +
          "**windows** — by time, by count, or by activity gaps — and aggregate " +
          "each. The hard part is not the grouping but deciding **when a window " +
          "is complete**, given that events arrive late and out of order."
      },

      num: {
        t: "Window types",
        h: ["Type", "Behaviour", "Suits"],
        r: [
          ["Tumbling", "fixed, non-overlapping", "hourly reports"],
          ["Sliding / hopping", "fixed, overlapping", "moving averages"],
          ["**Session**", "gap-defined, variable", "user activity bursts"],
          ["Global", "one unbounded window", "custom triggers"]
        ],
        n: "The genuinely difficult concept is **event time against processing " +
          "time**. An event that *happened* at 10:59 may *arrive* at 11:03 — " +
          "mobile app offline, network delay, a retry. Windowing on processing " +
          "time puts it in the wrong window and gives non-reproducible results; " +
          "windowing on event time is correct and requires deciding **how long " +
          "to wait**. That is what a **watermark** is: an assertion that no " +
          "events older than time T will arrive, allowing windows before T to " +
          "close. It is a **heuristic** — set it too tight and you drop real " +
          "late data, too loose and results are delayed and state grows. " +
          "Allowed lateness plus a side output for stragglers is the usual " +
          "compromise."
      },

      miss: [
        {
          w: "Windowing by time is straightforward.",
          r: "*Which* time is the entire question. **Event time** (when it " +
            "happened) gives correct, reproducible results and requires " +
            "watermarks and late-data handling. **Processing time** (when it " +
            "arrived) is trivial and gives results that change on every replay. " +
            "Choosing processing time without realising it is a very common " +
            "error."
        },
        {
          w: "A watermark guarantees all data has arrived.",
          r: "It is a **heuristic estimate**, not a guarantee. Data can and " +
            "does arrive after the watermark. Frameworks let you configure " +
            "allowed lateness and route stragglers to a side output — dropping " +
            "them silently is the default in some engines and is rarely what " +
            "you want."
        },
        {
          w: "Sliding windows are just tumbling windows computed more often.",
          r: "Each event belongs to **multiple overlapping windows " +
            "simultaneously** — with a 1-hour window sliding every minute, each " +
            "event is in 60 windows. State and computation multiply " +
            "accordingly, which surprises people when memory usage explodes."
        },
        {
          w: "Session windows are like tumbling windows with a variable size.",
          r: "They are **data-driven**: a session extends as long as events " +
            "keep arriving within the gap, and sessions can **merge " +
            "retroactively** when a late event bridges two existing ones. That " +
            "merging behaviour makes them the most complex window type to " +
            "implement and reason about."
        }
      ],

      trade: {
        buys: [
          "Makes aggregation over unbounded streams well-defined.",
          "Event-time windows give correct, replayable results.",
          "Session windows model real user behaviour naturally.",
          "Frameworks handle the mechanics."
        ],
        costs: [
          "Watermark tuning trades correctness against latency.",
          "Window state must be held in memory or checkpointed.",
          "Sliding windows multiply state and computation.",
          "Late data needs an explicit policy nobody enjoys designing."
        ],
        avoid: [
          "The data is genuinely batch — a scheduled query is far simpler.",
          "You need a running total with no boundaries — use plain " +
            "accumulating state.",
          "Latency requirements are loose enough that micro-batching " +
            "suffices.",
          "Ordering does not matter and neither does completeness."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-contract",

      why: {
        before: "Data pipelines read from upstream tables and databases " +
          "directly. The schema was whatever the producer happened to have, " +
          "discovered by looking.",
        problem: "The producer does not know who reads their table. An engineer " +
          "renames a column in a routine refactor and **six dashboards and " +
          "three ML models break overnight** — with no warning, because nothing " +
          "recorded that a dependency existed. The producer did nothing wrong " +
          "by their own lights.",
        shift: "Make the interface **explicit and enforced**. A data contract " +
          "declares schema, semantics, quality expectations and SLAs, is " +
          "version-controlled, and is **checked in CI** — so a breaking change " +
          "fails the producer's build rather than the consumer's dashboard."
      },

      num: {
        t: "What a contract actually specifies",
        h: ["Element", "Example"],
        r: [
          ["Schema", "field names, types, nullability"],
          ["**Semantics**", "`revenue` is net of refunds, in GBP"],
          ["Quality", "`< 0.1%` null, uniqueness on `order_id`"],
          ["SLA", "available by 06:00, max 2h lag"],
          ["**Versioning**", "breaking changes require a new version"],
          ["Ownership", "a named team and an escalation path"]
        ],
        n: "The **semantics** row is the one that is most often omitted and " +
          "causes the most damage. A schema check confirms `revenue` is a " +
          "decimal; it does not confirm whether it includes tax, whether " +
          "refunds are subtracted, or which currency it is in. Two teams " +
          "reporting different revenue figures from the same column is the " +
          "classic outcome, and it is a semantics failure, not a schema one. " +
          "The other thing that decides whether contracts work is **where they " +
          "are enforced**: a contract checked only in the consumer's pipeline " +
          "detects breakage after it ships. Enforced in the producer's CI, it " +
          "prevents it — which requires the producing team to accept the " +
          "obligation, making this substantially an organisational change."
      },

      miss: [
        {
          w: "A data contract is a schema definition.",
          r: "Schema is the easiest part. The contract also carries " +
            "**semantics**, quality thresholds, freshness SLAs and ownership. " +
            "A pipeline can satisfy the schema perfectly and be completely " +
            "wrong about what the numbers mean."
        },
        {
          w: "Schema validation in the pipeline is a data contract.",
          r: "Validating on read tells you the producer **already broke it**. " +
            "A contract's value is preventing the break — enforced in the " +
            "producer's CI, before deployment. Detection and prevention are " +
            "different products."
        },
        {
          w: "Contracts slow teams down.",
          r: "They slow **breaking changes** down deliberately, which is the " +
            "point. Additive changes stay fast. The comparison should be " +
            "against the current cost of unplanned breakage and the " +
            "firefighting it causes, which is usually larger and less visible."
        },
        {
          w: "You should put contracts on every table.",
          r: "Contracts are for **interfaces between teams**. A team's internal " +
            "staging tables should stay free to change. Contracting everything " +
            "creates enormous friction and trains people to route around the " +
            "process."
        }
      ],

      trade: {
        buys: [
          "Breaking changes fail at the producer, not in production.",
          "Semantics are documented where they can be relied on.",
          "Clear ownership and escalation.",
          "Consumers can build with confidence."
        ],
        costs: [
          "Requires producer teams to accept an obligation — organisational, " +
            "not technical.",
          "Versioning and deprecation processes to maintain.",
          "Tooling and CI integration to build.",
          "Genuine friction on legitimate breaking changes."
        ],
        avoid: [
          "The producer and consumer are the same team.",
          "The data is exploratory and nothing depends on it.",
          "The organisation will not enforce it — an unenforced contract is " +
            "documentation that goes stale.",
          "You are applying it to internal intermediate tables."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "slowly-changing-dimension",

      why: {
        before: "A dimension table held current attributes — customer name, " +
          "address, segment. Updates overwrote the old value, as in any " +
          "operational database.",
        problem: "That destroys history and makes reporting wrong. A customer " +
          "in London last year moved to Manchester; overwriting means **last " +
          "year's sales now appear under Manchester**, and a report run today " +
          "no longer matches the one run in January. Nobody can reconcile them.",
        shift: "Decide **explicitly** what should happen to history for each " +
          "attribute, and use a standard pattern. Kimball numbered them: Type 1 " +
          "overwrites, **Type 2 adds a new row with validity dates**, Type 3 " +
          "keeps a previous-value column. It is a business decision encoded in " +
          "table design."
      },

      num: {
        t: "The types",
        h: ["Type", "Behaviour", "History", "Use for"],
        r: [
          ["1", "overwrite", "**none**", "corrections, typos"],
          ["**2**", "new row + valid_from/to", "**full**", "the default choice"],
          ["3", "add a previous-value column", "one prior value", "rare"],
          ["4", "current table + history table", "full, separated", "high-churn attributes"],
          ["6", "1+2+3 combined", "full + current", "both views needed"]
        ],
        n: "**Type 2 is the workhorse** and the mechanics matter: each row gets " +
          "a `valid_from`, `valid_to`, an `is_current` flag, and a " +
          "**surrogate key** distinct from the business key — because the " +
          "customer now has several rows and facts must point at the version " +
          "that was current *when the fact occurred*. Getting that join wrong " +
          "is the classic bug: joining on `customer_id` instead of the " +
          "surrogate key silently multiplies your fact rows by the number of " +
          "versions. The trade is that Type 2 tables grow with change " +
          "frequency, so an attribute that changes daily is a poor candidate " +
          "— that is what Type 4 exists for."
      },

      miss: [
        {
          w: "Type 2 is the correct choice, so use it everywhere.",
          r: "It is right for attributes whose history matters for reporting. " +
            "For **corrections** — a misspelled name, a wrong postcode — Type 2 " +
            "preserves the error as though it were a real historical state, " +
            "which is worse than useless. Type 1 exists precisely for fixing " +
            "mistakes."
        },
        {
          w: "You can add SCD Type 2 later if you need history.",
          r: "You cannot recover history you never recorded. Retrofitting gives " +
            "you correct data only from the change forward, with a permanent " +
            "gap. This is one of the few genuinely irreversible modelling " +
            "decisions."
        },
        {
          w: "Facts should join to dimensions on the business key.",
          r: "With Type 2 they must join on the **surrogate key** captured at " +
            "the time of the fact. Joining on the business key matches every " +
            "historical version and multiplies your row counts — a bug that " +
            "silently inflates every aggregate."
        },
        {
          w: "SCDs are a legacy warehouse concept, irrelevant with modern " +
            "tooling.",
          r: "The problem is inherent to reporting on changing entities, " +
            "regardless of stack. Iceberg time travel, event sourcing and " +
            "`dbt snapshot` are all ways of solving it — `dbt snapshot` " +
            "implements Type 2 directly. The vocabulary persists because the " +
            "problem does."
        }
      ],

      trade: {
        buys: [
          "Historical reports stay reproducible.",
          "Point-in-time analysis becomes possible.",
          "Standard, well-understood patterns with tooling support.",
          "Explicit decisions about which history matters."
        ],
        costs: [
          "Type 2 tables grow with change frequency.",
          "Queries must filter for the right version.",
          "Surrogate key management adds complexity.",
          "Getting the fact-to-dimension join wrong corrupts aggregates " +
            "silently."
        ],
        avoid: [
          "History genuinely does not matter for the attribute.",
          "The attribute changes constantly — consider Type 4 or a separate " +
            "event stream.",
          "The system is fully event-sourced and history is already complete.",
          "It is a correction rather than a real change — that is Type 1."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "apache-flink",

      why: {
        before: "Stream processing largely meant **micro-batching** — Spark " +
          "Streaming collecting events for a second and running a small batch " +
          "job. Simple, and latency is bounded below by the batch interval.",
        problem: "Micro-batching cannot do sub-second latency, and it treats " +
          "streams as a special case of batch. That framing makes **event-time " +
          "processing and large stateful operations awkward**, because a batch " +
          "boundary is a processing-time artefact with no relationship to when " +
          "events happened.",
        shift: "Invert it: **batch is a special case of streaming** — a bounded " +
          "stream. Process events one at a time as they arrive, with " +
          "first-class event time, watermarks, and **managed state** that can " +
          "be terabytes and is checkpointed for exactly-once recovery."
      },

      num: {
        t: "Flink against Spark Structured Streaming",
        h: ["Property", "Flink", "Spark Streaming"],
        r: [
          ["Model", "**true streaming**", "micro-batch (+ continuous mode)"],
          ["Latency", "**milliseconds**", "~100ms–seconds"],
          ["State", "**large, managed, RocksDB**", "more limited"],
          ["Event time", "first class", "supported"],
          ["Batch reuse", "same engine", "same engine"],
          ["Ecosystem", "smaller", "**much larger**"]
        ],
        n: "The **state** row is Flink's real differentiator and the reason it " +
          "is chosen for fraud detection and complex event processing: state " +
          "can exceed memory, backed by embedded RocksDB, and is checkpointed " +
          "incrementally to durable storage. That enables things like *has this " +
          "card been used in two countries within an hour* across millions of " +
          "cards. **Checkpointing** is how exactly-once is achieved — a " +
          "distributed snapshot via barriers flowing through the dataflow " +
          "graph, so state and source offsets are consistent. The operational " +
          "cost is genuine: checkpoint tuning, state backend configuration, and " +
          "**savepoint-based upgrades** (you cannot simply redeploy a stateful " +
          "job) are real work, and the ecosystem is smaller than Spark's."
      },

      miss: [
        {
          w: "Flink is faster than Spark.",
          r: "It has **lower latency** for streaming. For batch throughput they " +
            "are comparable, and Spark's ecosystem and tuning knowledge are far " +
            "deeper. Choose Flink when you need millisecond latency or large " +
            "managed state, not for general speed."
        },
        {
          w: "Exactly-once in Flink means my whole pipeline is exactly-once.",
          r: "Flink guarantees exactly-once for **its own state**. End-to-end " +
            "requires the sink to participate — a transactional sink, or " +
            "idempotent writes. A Flink job writing to a plain REST API is " +
            "at-least-once at that boundary regardless of the setting."
        },
        {
          w: "You can deploy a new version of a stateful job like any service.",
          r: "You must take a **savepoint**, stop, and restart from it — and " +
            "the new version's state schema must be compatible. Changing " +
            "operator UIDs or state types breaks restoration. Stateful stream " +
            "processing has a genuinely different deployment model."
        },
        {
          w: "Checkpointing is free.",
          r: "It adds latency at barrier alignment and load on the state " +
            "backend and storage. Frequent checkpoints on large state cost " +
            "measurable throughput; infrequent ones mean more reprocessing " +
            "after failure. It is a tuning trade-off you own."
        }
      ],

      trade: {
        buys: [
          "Genuine millisecond-latency stream processing.",
          "Large managed state with exactly-once semantics.",
          "First-class event time, watermarks and late-data handling.",
          "One engine for streaming and batch.",
          "Sophisticated windowing including sessions."
        ],
        costs: [
          "Operationally demanding — checkpoints, state backends, savepoints.",
          "Smaller ecosystem and community than Spark.",
          "Stateful upgrades require savepoint discipline.",
          "Steeper learning curve.",
          "Cluster resources held continuously, unlike scheduled batch."
        ],
        avoid: [
          "Latency requirements are seconds or minutes — micro-batching is " +
            "simpler.",
          "The workload is pure batch.",
          "The team cannot operate a stateful streaming system.",
          "A managed service or a simpler tool (Kafka Streams, ksqlDB) " +
            "suffices.",
          "State is small and could live in an external store."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-mesh",

      why: {
        before: "A central data team owned the warehouse. Every domain's data " +
          "flowed to them, they modelled it, and every analytics request " +
          "queued behind them.",
        problem: "That team becomes a bottleneck and is structurally " +
          "disadvantaged: they own data whose **domain they do not understand**. " +
          "They cannot tell whether a field is meaningful, and the producing " +
          "team has no incentive to help because the data is no longer their " +
          "problem once it leaves.",
        shift: "**Move ownership to the domains.** The team that produces the " +
          "data owns it as a **product** — with quality guarantees, " +
          "documentation and an SLA — served through a self-serve platform, " +
          "governed by federated standards. It is primarily an " +
          "**organisational** change, which is why it succeeds and fails on " +
          "organisational grounds."
      },

      num: {
        t: "The four principles, and what each demands",
        h: ["Principle", "Requires"],
        r: [
          ["Domain ownership", "**domain teams with data skills**"],
          ["Data as a product", "SLAs, docs, versioning, a named owner"],
          ["Self-serve platform", "**a real platform team**"],
          ["Federated governance", "standards agreed across domains"]
        ],
        n: "The third row is where most implementations fail. Data mesh " +
          "**redistributes work rather than removing it** — if domain teams " +
          "must each build ingestion, storage, quality checks and serving from " +
          "scratch, you have replaced one bottleneck with N duplicated " +
          "efforts and inconsistent results. The self-serve platform is not " +
          "optional infrastructure; it is the thing that makes the rest " +
          "affordable. Zhamak Dehghani's own framing is explicit that this " +
          "targets **large organisations with many domains** — a company with " +
          "one product and thirty engineers has no mesh-shaped problem, and " +
          "adopting it there produces overhead with no benefit."
      },

      miss: [
        {
          w: "Data mesh is a technology or an architecture you can buy.",
          r: "It is an **operating model**. Vendors sell platforms *for* it, " +
            "and no purchase delivers it — the change is who owns data, who is " +
            "accountable for its quality, and how teams are staffed. Treating " +
            "it as a technology purchase is the most common failure."
        },
        {
          w: "It means getting rid of the central data team.",
          r: "The central team **changes role** from building every pipeline to " +
            "building the **platform** and setting governance standards. " +
            "Removing them entirely leaves domains to reinvent everything " +
            "independently, which is worse than the bottleneck."
        },
        {
          w: "Data mesh is the opposite of a data warehouse.",
          r: "Domains may well serve their products **as** warehouse tables or " +
            "lakehouse tables. The change is ownership and accountability, not " +
            "storage technology. A mesh can be built on Snowflake."
        },
        {
          w: "It scales down to smaller organisations.",
          r: "It is explicitly designed for organisations with **many domains " +
            "and a central bottleneck**. Below that scale, a central data team " +
            "is more efficient — the coordination overhead of federated " +
            "governance exceeds the bottleneck it removes."
        }
      ],

      trade: {
        buys: [
          "Removes the central bottleneck on analytics delivery.",
          "Domain experts own data they actually understand.",
          "Scales with the organisation rather than with one team.",
          "Clear accountability for quality.",
          "Data products become discoverable and reusable."
        ],
        costs: [
          "Requires data skills in every domain team — hiring and training.",
          "A real platform team is a prerequisite.",
          "Federated governance is slow and needs genuine agreement.",
          "Duplication and inconsistency without strong standards.",
          "Substantial organisational change, which often fails."
        ],
        avoid: [
          "The organisation is small or has few distinct domains.",
          "Domain teams cannot be staffed with data capability.",
          "There is no platform team and none is planned.",
          "The central team is not actually the bottleneck — measure first.",
          "Leadership treats it as a tooling decision."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
