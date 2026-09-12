/* ==========================================================================
   Depth pass 56 — databases batch 4: remaining NoSQL families, performance,
   and specific database engines.

   Every database engine is a set of trade-offs baked into an architecture.
   PostgreSQL chose extensibility. Redis chose speed. Elasticsearch chose
   search. None is universally best — each is best at what it was designed for.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "key-value-store",

      why: {
        before: "Every data access went through a SQL query — even fetching " +
          "a single value by its exact key involved parsing SQL, planning, " +
          "and executing.",
        problem: "When the access pattern is 'get value by key' and nothing " +
          "else, the overhead of SQL parsing, query planning, and " +
          "transactional machinery is pure waste.",
        shift: "**Optimise for the simplest possible operation: get and " +
          "set by key.** Key-value stores (Redis, DynamoDB, Memcached) " +
          "strip away everything that is not needed for key-based access " +
          "and deliver sub-millisecond lookups."
      },

      num: {
        t: "Key-value store comparison",
        h: ["Engine", "Storage", "Key strength"],
        r: [
          ["**Redis**", "**in-memory + optional persistence**", "**sub-ms latency, data structures**"],
          ["**Memcached**", "**in-memory only**", "**pure caching, multi-threaded**"],
          ["**DynamoDB**", "**persistent, managed**", "**auto-scaling, single-digit ms**"],
          ["etcd", "persistent, distributed", "configuration, service discovery"],
          ["**RocksDB**", "**embedded, on-disk**", "**LSM-tree, high write throughput**"],
          ["Riak", "distributed, AP", "high availability, conflict resolution"]
        ],
        n: "Redis is the dominant key-value store because it is far more " +
          "than a key-value store: it supports **strings, lists, sets, " +
          "sorted sets, hashes, streams, bitmaps, HyperLogLog**, and " +
          "**Lua scripting**. This makes it suitable for caching, session " +
          "storage, rate limiting, leaderboards, queues, and pub/sub — " +
          "all in a single system. The trade-off is that Redis stores data " +
          "in memory: your dataset must fit in RAM. **Persistence** is " +
          "optional (RDB snapshots + AOF append-only file) and trades " +
          "durability for speed — a crash can lose the last few seconds " +
          "of writes. DynamoDB is the cloud-native alternative: fully " +
          "managed, auto-scaling, and persistent, but with a steeper " +
          "pricing model and less flexibility in data structures."
      },

      miss: [
        {
          w: "Key-value stores are just caches.",
          r: "DynamoDB, etcd, and RocksDB are persistent. Redis with AOF " +
            "provides durability. Key-value stores are used as primary " +
            "databases, not just caches."
        },
        {
          w: "Redis is single-threaded and therefore slow.",
          r: "Redis is single-threaded for **command execution**, which " +
            "avoids locking. I/O is multi-threaded since Redis 6. One " +
            "thread handling 100,000+ operations/second is fast enough."
        },
        {
          w: "Key-value stores can handle any query.",
          r: "They handle key-based lookup efficiently. Range queries, " +
            "joins, and arbitrary filtering require secondary indexes or " +
            "are not supported."
        },
        {
          w: "All key-value stores are in-memory.",
          r: "DynamoDB, RocksDB, etcd, and LMDB are disk-based. In-memory " +
            "is a choice, not a requirement of the model."
        }
      ],

      trade: {
        buys: [
          "Sub-millisecond lookups by key.",
          "Simple API — GET, SET, DELETE.",
          "Redis provides rich data structures beyond simple KV.",
          "Horizontally scalable via sharding.",
          "Ideal for caching, sessions, and configuration."
        ],
        costs: [
          "No ad-hoc queries — access by key only.",
          "In-memory stores are limited by RAM.",
          "No joins or relationships.",
          "Data modelling requires knowing access patterns upfront.",
          "Persistence is weaker than relational databases (for in-memory stores)."
        ],
        avoid: [
          "When the query pattern requires filtering by non-key columns.",
          "When relationships between entities matter.",
          "When ad-hoc analytical queries are needed.",
          "When the dataset exceeds available RAM (for in-memory stores)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "graph-database",

      why: {
        before: "Relationships were modelled with foreign keys and joins. " +
          "A query like 'find friends of friends of friends' required " +
          "self-joins nested three levels deep.",
        problem: "Relational databases can express relationships, but " +
          "**traversing deep relationships** requires recursive joins " +
          "that are both syntactically complex and computationally " +
          "expensive. The cost grows exponentially with depth.",
        shift: "**Make relationships first-class citizens.** Graph databases " +
          "(Neo4j, Amazon Neptune, TigerGraph) store nodes and edges " +
          "explicitly, making traversal a local operation — following a " +
          "pointer, not scanning a table."
      },

      num: {
        t: "Graph database concepts",
        h: ["Concept", "What it is", "Relational equivalent"],
        r: [
          ["**Node**", "**an entity (person, product)**", "**row in a table**"],
          ["**Edge**", "**a relationship (KNOWS, BOUGHT)**", "**foreign key + junction table**"],
          ["Property", "key-value on a node or edge", "column"],
          ["**Label**", "**node type (Person, Company)**", "**table name**"],
          ["**Traversal**", "**follow edges from a node**", "**JOIN (but O(1) per hop, not O(n))**"],
          ["Path", "sequence of nodes and edges", "multi-way JOIN result"]
        ],
        n: "The key performance difference is in **traversal depth**. In a " +
          "relational database, each level of relationship requires a JOIN " +
          "that potentially scans a table. In a graph database, following " +
          "an edge is a **pointer dereference** — constant time regardless " +
          "of database size. This is called **index-free adjacency**: each " +
          "node directly stores pointers to its neighbors. Three-hop " +
          "queries ('friends of friends of friends') that take seconds in " +
          "SQL take milliseconds in a graph database. The trade-offs: " +
          "graph databases are poor at **aggregation** (SUM, COUNT across " +
          "the whole database), **bulk updates**, and workloads that do " +
          "not involve traversal. **Cypher** (Neo4j's query language) is " +
          "the most common graph query language, and **GQL** is the " +
          "emerging ISO standard."
      },

      miss: [
        {
          w: "Everything should be modelled as a graph.",
          r: "Tabular data (orders, transactions, inventory) is better in " +
            "a relational database. Graphs shine when **relationships are " +
            "the query**, not the entities."
        },
        {
          w: "Relational databases cannot handle graph queries.",
          r: "Recursive CTEs handle graph traversal in SQL. They are slower " +
            "than native graph databases for deep traversal but work for " +
            "shallow queries."
        },
        {
          w: "Graph databases scale like document databases.",
          r: "Partitioning a graph is the **graph partitioning problem** — " +
            "NP-hard. Edges that cross partitions require network hops, " +
            "negating the traversal advantage."
        },
        {
          w: "Graph databases are only for social networks.",
          r: "They are used for fraud detection, recommendation engines, " +
            "knowledge graphs, network topology, supply chain, and drug " +
            "interaction analysis."
        }
      ],

      trade: {
        buys: [
          "Constant-time traversal per hop — fast deep relationship queries.",
          "Natural data model for networks, hierarchies, and knowledge graphs.",
          "Cypher/GQL queries express traversal patterns concisely.",
          "Schema-flexible — nodes and edges can have any properties.",
          "Pattern matching finds complex graph structures efficiently."
        ],
        costs: [
          "Poor at aggregation and bulk analytical queries.",
          "Graph partitioning is hard — horizontal scaling is limited.",
          "Smaller ecosystem than relational databases.",
          "Not designed for tabular data or simple CRUD.",
          "Fewer tooling options for backup, monitoring, and migration."
        ],
        avoid: [
          "Simple CRUD operations — relational is simpler and faster.",
          "Analytical aggregation across the entire dataset.",
          "When relationships are shallow (1–2 levels) — SQL joins suffice.",
          "When the team has no graph database experience."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "vector-database",

      why: {
        before: "Search meant keywords — matching text against an index of " +
          "words. Similarity between concepts was not computable.",
        problem: "Keywords miss semantic meaning. A search for 'car' does " +
          "not find documents about 'automobile.' Recommendation engines, " +
          "RAG systems, and image search need **semantic similarity**, " +
          "which operates on high-dimensional vectors (embeddings), not " +
          "text.",
        shift: "**Index and search high-dimensional vectors by similarity.** " +
          "Vector databases (Pinecone, Milvus, Weaviate, Qdrant, Chroma) " +
          "store embeddings and find the nearest neighbours efficiently " +
          "using algorithms like HNSW, IVF, and PQ."
      },

      num: {
        t: "Vector search strategies",
        h: ["Algorithm", "Approach", "Trade-off"],
        r: [
          ["**HNSW**", "**navigable small-world graph**", "**fast, high recall, memory-heavy**"],
          ["**IVF**", "**partition into clusters, search nearby clusters**", "**less memory, slightly lower recall**"],
          ["**PQ (Product Quantisation)**", "**compress vectors**", "**saves memory, loses precision**"],
          ["Flat / brute force", "compare against every vector", "perfect recall, O(n) — slow at scale"],
          ["**ScaNN**", "**learned quantisation (Google)**", "**high throughput, asymmetric distance**"],
          ["DiskANN", "SSD-based approximate search", "handles datasets larger than RAM"]
        ],
        n: "Vector search is **approximate** by design (ANN — approximate " +
          "nearest neighbour). Perfect search (comparing against every " +
          "vector) is O(n) and infeasible at millions of vectors. ANN " +
          "algorithms trade **recall** (fraction of true nearest " +
          "neighbours found) for **speed**. HNSW is the most popular: " +
          "it builds a multi-layer graph and navigates it like a skip " +
          "list. Recall is typically 95–99%, which is sufficient for " +
          "search and recommendation. **PostgreSQL with pgvector** is " +
          "increasingly popular because it lets you store vectors alongside " +
          "relational data, query with SQL, and use transactions — " +
          "avoiding the operational cost of a separate vector database. " +
          "The trade-off is that pgvector's performance at scale is lower " +
          "than purpose-built vector databases."
      },

      miss: [
        {
          w: "Vector databases are only for AI.",
          r: "They are used for recommendation engines, image search, " +
            "anomaly detection, and any application that requires " +
            "similarity search — not just LLM/RAG."
        },
        {
          w: "Vector search is always exact.",
          r: "ANN algorithms are **approximate** — they may miss some true " +
            "nearest neighbours. Tune the recall/speed trade-off for your " +
            "use case."
        },
        {
          w: "You need a separate vector database.",
          r: "PostgreSQL (pgvector), Elasticsearch (dense_vector), and " +
            "Redis support vector search. A separate database is justified " +
            "only at scale."
        },
        {
          w: "Embeddings are just another column.",
          r: "Embeddings are high-dimensional (768–4096 dimensions). " +
            "Standard B-tree indexes cannot handle them — specialised " +
            "indexes (HNSW, IVF) are required."
        }
      ],

      trade: {
        buys: [
          "Semantic similarity search — find conceptually related items.",
          "Sub-second search over millions of vectors.",
          "Foundation for RAG, recommendations, and image search.",
          "Composable with metadata filtering.",
          "Purpose-built indexes (HNSW, IVF) for high-dimensional data."
        ],
        costs: [
          "Approximate — may miss true nearest neighbours.",
          "Memory-intensive — HNSW indexes are large.",
          "Index build time can be significant.",
          "Additional infrastructure to manage.",
          "Embedding model choice affects search quality."
        ],
        avoid: [
          "When keyword search is sufficient.",
          "When the dataset is small enough for brute force.",
          "When pgvector or Elasticsearch provides sufficient performance.",
          "When the team cannot manage another database."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "time-series-database",

      why: {
        before: "Time-stamped data (metrics, sensor readings, stock prices) " +
          "was stored in relational tables with a timestamp column.",
        problem: "Relational databases are not optimised for the time-series " +
          "access pattern: high-volume writes, queries by time range, " +
          "downsampling, and retention policies. A Prometheus server " +
          "ingesting millions of metrics per second overwhelms a " +
          "PostgreSQL instance.",
        shift: "**Optimise for timestamped data.** Time-series databases " +
          "(InfluxDB, TimescaleDB, Prometheus, VictoriaMetrics) use " +
          "columnar storage, time-based partitioning, automatic " +
          "downsampling, and retention policies designed for the " +
          "append-mostly, query-by-range pattern."
      },

      num: {
        t: "Time-series database features",
        h: ["Feature", "What it does", "Why it matters"],
        r: [
          ["**Time-based partitioning**", "**partition data by time range**", "**old data dropped cheaply**"],
          ["**Downsampling**", "**aggregate old data (1s → 1m → 1h)**", "**control storage growth**"],
          ["**Retention policies**", "**auto-delete old data**", "**keep 30 days, delete the rest**"],
          ["Columnar storage", "store each metric column contiguously", "compression, fast aggregation"],
          ["**High write throughput**", "**millions of points/second**", "**append-mostly, sequential writes**"],
          ["Time-range queries", "efficient range scans", "GET metrics WHERE time BETWEEN ..."]
        ],
        n: "The defining characteristic of time-series data is that it is " +
          "**append-mostly**: you almost never update old data, you almost " +
          "always query by time range, and old data gradually loses value " +
          "(you need second-level granularity for today, minute-level for " +
          "last week, hour-level for last year). **TimescaleDB** takes a " +
          "unique approach: it is a PostgreSQL extension, so you get time-" +
          "series optimisations (hypertables, compression, continuous " +
          "aggregates) with full SQL and ACID transactions. " +
          "**Prometheus** is the standard for Kubernetes monitoring — it " +
          "scrapes metrics from targets and stores them locally. " +
          "**VictoriaMetrics** is a Prometheus-compatible alternative " +
          "with better compression and scaling."
      },

      miss: [
        {
          w: "You can use PostgreSQL for time-series data.",
          r: "You can, but at scale it struggles with high write throughput, " +
            "lacks automatic downsampling, and does not have retention " +
            "policies. TimescaleDB adds these to PostgreSQL."
        },
        {
          w: "Time-series databases are only for monitoring.",
          r: "They are used for IoT, financial tick data, sensor data, " +
            "energy grid monitoring, and any domain with high-volume " +
            "timestamped data."
        },
        {
          w: "Old data should always be deleted.",
          r: "Downsampled data (hourly averages) is valuable for trend " +
            "analysis. Delete raw data but keep aggregates."
        },
        {
          w: "All time-series databases use the same storage format.",
          r: "Prometheus uses a custom TSDB. InfluxDB uses a custom engine. " +
            "TimescaleDB uses PostgreSQL's storage. Storage format affects " +
            "compression, query speed, and scalability."
        }
      ],

      trade: {
        buys: [
          "High write throughput — millions of points per second.",
          "Time-range queries are fast — data is partitioned by time.",
          "Automatic downsampling controls storage growth.",
          "Retention policies clean up old data automatically.",
          "Columnar storage compresses time-series data effectively."
        ],
        costs: [
          "Not designed for non-time-series queries.",
          "Updates to old data are expensive or unsupported.",
          "Another database to manage.",
          "Query languages vary (PromQL, InfluxQL, SQL).",
          "Retention policy misconfiguration can delete needed data."
        ],
        avoid: [
          "When the data is not time-series (no timestamp as primary axis).",
          "When write volume is low enough for a relational database.",
          "When full ACID transactions are required on time-series data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "eventual-consistency",

      why: {
        before: "Every read returned the most recently written value — " +
          "strong consistency. The database was the single source of truth.",
        problem: "Strong consistency in a distributed system requires " +
          "coordination between nodes (consensus protocols). This adds " +
          "latency and reduces availability — if one node is down, the " +
          "system blocks.",
        shift: "**Allow reads to temporarily return stale data in exchange " +
          "for availability.** Eventually consistent systems guarantee " +
          "that if no new writes occur, all replicas will **eventually** " +
          "converge to the same value — but a read immediately after a " +
          "write to a different node may return the old value."
      },

      num: {
        t: "Consistency models spectrum",
        h: ["Model", "Guarantee", "Performance"],
        r: [
          ["**Strong (linearisable)**", "**read always returns latest write**", "**highest latency, lowest availability**"],
          ["**Sequential**", "**all nodes see same order**", "**lower latency than strong**"],
          ["Causal", "causally related writes are ordered", "good balance"],
          ["**Read-your-writes**", "**you see your own writes**", "**common practical requirement**"],
          ["**Eventual**", "**converges given time**", "**lowest latency, highest availability**"],
          ["**Last-write-wins**", "**most recent timestamp wins**", "**simple but loses concurrent writes**"]
        ],
        n: "Eventual consistency is the **default for most distributed " +
          "NoSQL databases** (Cassandra, DynamoDB in default mode, " +
          "CouchDB). The window of inconsistency is typically milliseconds " +
          "to low seconds — but during network partitions or high load, " +
          "it can be longer. The practical issues are: (1) **read-after-" +
          "write**: you write a value and immediately read it from a " +
          "different replica, getting the old value — the user thinks " +
          "their save failed; (2) **conflicting writes**: two clients " +
          "update the same item on different replicas — which one wins? " +
          "**Last-write-wins** (LWW) is simple but silently drops one " +
          "write. CRDTs (Conflict-free Replicated Data Types) merge " +
          "concurrent writes automatically for certain data structures. " +
          "DynamoDB offers **strong consistency** as an option (per read), " +
          "at the cost of higher latency."
      },

      miss: [
        {
          w: "Eventually consistent means data is always inconsistent.",
          r: "The inconsistency window is typically milliseconds. Under " +
            "normal operation, replicas converge almost immediately."
        },
        {
          w: "Eventual consistency is always acceptable for non-financial data.",
          r: "A social media like count can tolerate eventual consistency. " +
            "An inventory count cannot — overselling creates real problems."
        },
        {
          w: "Strong consistency is always better.",
          r: "Strong consistency requires coordination that adds latency " +
            "and reduces availability. For many workloads, the added " +
            "latency is worse than brief staleness."
        },
        {
          w: "CAP theorem means you must give up consistency entirely.",
          r: "CAP is about **network partition** scenarios. Most of the " +
            "time there is no partition, and the system can be consistent. " +
            "The choice is what happens during partitions."
        }
      ],

      trade: {
        buys: [
          "High availability — reads succeed even when nodes are down.",
          "Low latency — no coordination wait.",
          "Horizontal scaling — any replica can serve reads.",
          "Simplifies multi-region deployment.",
          "Sufficient for many workloads (caching, feeds, analytics)."
        ],
        costs: [
          "Read-after-write can return stale data.",
          "Conflicting writes must be resolved (LWW, CRDTs, or application logic).",
          "Application must be designed to tolerate staleness.",
          "Debugging consistency issues is hard.",
          "Cannot be used for inventory, financial transactions, or leader election."
        ],
        avoid: [
          "Financial transactions — correctness requires strong consistency.",
          "Inventory management — overselling is costly.",
          "When read-after-write correctness is a user-facing requirement.",
          "When the team does not understand the consistency implications."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "replication",

      why: {
        before: "A database ran on a single server. If that server died, " +
          "the data was gone until restored from backup — and the backup " +
          "was always behind.",
        problem: "A single database server is a single point of failure. " +
          "Hardware failures, data centre outages, and maintenance windows " +
          "cause downtime and potential data loss.",
        shift: "**Copy data to multiple servers.** Replication maintains " +
          "copies of the database on multiple machines. If one fails, " +
          "another serves requests. Read replicas distribute load. " +
          "Multi-region replicas reduce latency for global users."
      },

      num: {
        t: "Replication strategies",
        h: ["Strategy", "How it works", "Trade-off"],
        r: [
          ["**Synchronous**", "**write confirmed after ALL replicas acknowledge**", "**no data loss, higher latency**"],
          ["**Asynchronous**", "**write confirmed after primary, replicas catch up**", "**low latency, potential data loss on failover**"],
          ["Semi-synchronous", "wait for one replica, rest async", "balance of safety and speed"],
          ["**Logical**", "**replicate SQL statements or row changes**", "**flexible, can replicate selectively**"],
          ["**Physical**", "**replicate disk blocks / WAL**", "**fast, but replicas are exact copies**"],
          ["Multi-master", "writes to any node", "conflict resolution required"]
        ],
        n: "**Asynchronous replication** is the default because synchronous " +
          "replication adds latency to every write (must wait for replica " +
          "acknowledgment). The risk is that if the primary fails before " +
          "the replica catches up, the unacknowledged writes are lost. " +
          "This is the **RPO (Recovery Point Objective)** — the maximum " +
          "acceptable data loss. For most applications, losing the last " +
          "few seconds of writes during a rare hardware failure is " +
          "acceptable. For financial systems, it is not — they use " +
          "synchronous replication and accept the latency. **Read " +
          "replicas** serve read queries, reducing load on the primary. " +
          "But they introduce **replication lag** — a read immediately " +
          "after a write may go to a replica that has not received the " +
          "write yet. The application must route reads-after-writes to " +
          "the primary."
      },

      miss: [
        {
          w: "Replicas are always up to date.",
          r: "Asynchronous replicas have **replication lag** — they may be " +
            "seconds behind the primary. Reads from replicas may return " +
            "stale data."
        },
        {
          w: "Replication is the same as backup.",
          r: "Replication propagates **deletes and corruption** to replicas. " +
            "A backup is a point-in-time snapshot that survives logical " +
            "errors. You need both."
        },
        {
          w: "Failover is automatic and instant.",
          r: "Automatic failover detects primary failure and promotes a " +
            "replica, but takes seconds to minutes. The application must " +
            "handle brief unavailability."
        },
        {
          w: "More replicas always means better performance.",
          r: "Each replica receives every write from the primary, consuming " +
            "resources. Beyond a certain point, write bandwidth becomes " +
            "the bottleneck."
        }
      ],

      trade: {
        buys: [
          "High availability — failover to replica on primary failure.",
          "Read scaling — distribute read load across replicas.",
          "Geographic distribution — replicas near users reduce latency.",
          "Data protection — copy survives hardware failure.",
          "Zero-downtime maintenance — failover during upgrades."
        ],
        costs: [
          "Replication lag — replicas may serve stale reads.",
          "Write scalability is not improved (all replicas receive all writes).",
          "Failover complexity — promoting, redirecting, catching up.",
          "Storage cost — full copy of data per replica.",
          "Split-brain risk if primary detection fails."
        ],
        avoid: [
          "Using replication as a substitute for backups.",
          "Multi-master without understanding conflict resolution.",
          "Synchronous replication across high-latency links (WAN)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "query-plan",

      why: {
        before: "SQL is declarative — you say what you want, not how to " +
          "get it. But the database still has to decide how.",
        problem: "For any non-trivial query, there are hundreds of possible " +
          "execution strategies — different join orders, different index " +
          "choices, different scan methods. The wrong choice can make a " +
          "query 1000× slower.",
        shift: "**The query optimiser generates an execution plan.** " +
          "EXPLAIN shows you that plan: which indexes are used, which " +
          "join algorithms are chosen, and how many rows the optimiser " +
          "expects at each step."
      },

      num: {
        t: "EXPLAIN output elements",
        h: ["Element", "What it shows", "What to look for"],
        r: [
          ["**Scan type**", "**Seq Scan, Index Scan, Bitmap Scan**", "**Seq Scan on a large table → add an index**"],
          ["**Join type**", "**Nested Loop, Hash Join, Merge Join**", "**Nested Loop without index → slow**"],
          ["**Estimated rows**", "**how many rows the optimiser expects**", "**wildly wrong → stale statistics**"],
          ["**Actual rows (ANALYZE)**", "**how many rows actually processed**", "**compare with estimate**"],
          ["Cost", "arbitrary optimiser units", "relative comparison between plans"],
          ["**Filter / Rows removed**", "**post-index filtering**", "**many removed → index not selective enough**"]
        ],
        n: "**EXPLAIN ANALYZE** (PostgreSQL) runs the query and shows " +
          "**actual** execution statistics alongside estimates. This is the " +
          "**single most important tool** for SQL performance tuning. The " +
          "most common patterns to look for: (1) **Sequential scan on a " +
          "large table** when the WHERE clause should use an index — add " +
          "the missing index; (2) **Nested loop join without an index on " +
          "the inner table** — this is O(n × m), add an index; (3) " +
          "**Estimated rows wildly differ from actual rows** — run " +
          "ANALYZE to update table statistics; (4) **Sort node** with " +
          "large row count — add an index that provides the ORDER BY " +
          "sort order. **The optimiser's decisions are based on " +
          "statistics** — row counts, value distributions, null " +
          "frequencies. If statistics are stale, the optimiser makes bad " +
          "decisions. Run `ANALYZE tablename` to update them."
      },

      miss: [
        {
          w: "EXPLAIN is only for slow queries.",
          r: "Check EXPLAIN **before** deploying queries to production. A " +
            "query that is fast on 100 rows may sequential-scan on 10 " +
            "million."
        },
        {
          w: "The optimiser always chooses the best plan.",
          r: "The optimiser chooses the best plan **based on statistics**. " +
            "Stale statistics, parameter sniffing, and complex queries can " +
            "lead to suboptimal plans."
        },
        {
          w: "Adding more indexes always helps.",
          r: "Each index slows writes and consumes storage. Add indexes " +
            "for queries that EXPLAIN shows need them — not speculatively."
        },
        {
          w: "Query plans are stable.",
          r: "Plans can change when statistics are updated, indexes are " +
            "added/dropped, data distribution changes, or the database is " +
            "upgraded. Monitor critical queries' plans."
        }
      ],

      trade: {
        buys: [
          "Visibility into how the database executes queries.",
          "Identifies missing indexes, bad join strategies, and stale statistics.",
          "EXPLAIN ANALYZE shows actual vs estimated rows.",
          "Enables data-driven query optimisation.",
          "Prevents deploying slow queries to production."
        ],
        costs: [
          "Reading EXPLAIN output requires practice.",
          "EXPLAIN ANALYZE runs the query — slow queries take time.",
          "Plans differ between databases (PostgreSQL vs MySQL syntax).",
          "Plan stability is not guaranteed across database upgrades.",
          "Optimiser hints can override the plan but reduce portability."
        ],
        avoid: [
          "Never avoid EXPLAIN — it is the primary SQL debugging tool.",
          "Do not add indexes without checking whether EXPLAIN needs them.",
          "Do not trust cost numbers as absolute — they are for relative " +
            "comparison only."
        ]
      }
    }

  ]);
})(window.TD);
