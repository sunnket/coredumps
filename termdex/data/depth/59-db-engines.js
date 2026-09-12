/* ==========================================================================
   Depth pass 59 — databases batch 7: major database engines & platforms.
   PostgreSQL, MySQL, SQLite, MongoDB, Redis, DynamoDB, BigQuery.

   Every database engine is an engineering trade-off: in-memory speed vs
   durability, relational consistency vs horizontal partition scale,
   zero-config embedded simplicity vs petabyte-scale serverless analytics.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "postgresql",

      why: {
        before: "Relational database engines were closed, rigid systems with " +
          "fixed data types, inflexible storage formats, and proprietary codebases.",
        problem: "Modern web applications required diverse data representations " +
          "(JSON documents, geospatial coordinates, vector embeddings, network " +
          "CIDR blocks) that legacy SQL engines could not natively handle without " +
          "awkward workarounds or performance collapse.",
        shift: "**An extensible, open-source object-relational database management system.** " +
          "PostgreSQL was designed from inception around catalog-driven extensibility, " +
          "allowing developers to define custom types, index access methods, " +
          "operators, and procedural languages without modifying core engine source code."
      },

      num: {
        t: "PostgreSQL architectural components & extension ecosystem",
        h: ["Component / Extension", "Architecture / Role", "Primary Capability", "Performance Impact"],
        r: [
          ["**Process Model (Postmaster)**", "**Forked dedicated OS process per client connection**", "**Strict memory isolation between queries**", "**Heavy memory overhead; requires PgBouncer pooling**"],
          ["**MVCC & Autovacuum**", "**Tuple headers track `xmin`/`xmax` transaction IDs**", "**Readers never block writers; writers never block readers**", "**Requires regular autovacuuming to reclaim dead tuples**"],
          ["**JSONB & GIN Indexes**", "**Decomposed binary JSON storage with inverted indexing**", "**Query and index nested document structures inside SQL**", "**Matches NoSQL document speeds with ACID guarantees**"],
          ["**pgvector Extension**", "**Native vector similarity search (HNSW & IVFFlat indexes)**", "**Enables semantic AI search and RAG inside the primary database**", "**Eliminates need for separate dedicated vector database**"],
          ["**PostGIS Extension**", "**Spatial database extender with R-Tree (GiST) indexing**", "**Geographic location queries, distance calculations, GIS**", "**The gold standard for production geospatial computation**"],
          ["**Foreign Data Wrappers (FDW)**", "**SQL/MED standard interface querying external systems**", "**Query remote Postgres, MySQL, S3, or MongoDB via standard SQL**", "**Federates queries across disparate infrastructure**"]
        ],
        n: "PostgreSQL is universally regarded as the most advanced " +
          "open-source relational database in existence. Under the hood, " +
          "PostgreSQL operates a **multi-process architecture**: a central " +
          "`postmaster` process listens for incoming connections and forks " +
          "a dedicated operating system backend process for each client socket. " +
          "Because forked processes do not share thread memory (communicating " +
          "strictly through IPC and shared buffer pools), an unhandled memory " +
          "fault in one client query cannot crash the entire database. " +
          "However, this process model consumes 5 MB to 15 MB of RAM per " +
          "connection, making an external connection pooler like **PgBouncer** " +
          "mandatory in high-scale deployments. Postgres implements concurrency " +
          "via **Multi-Version Concurrency Control (MVCC)**: when a row is " +
          "updated, the engine does not overwrite the old row in place; " +
          "instead, it marks the old tuple with a death transaction ID (`xmax`) " +
          "and writes a brand new tuple with an insertion ID (`xmin`). The " +
          "background **autovacuum** daemon continuously scans data pages to " +
          "freeze aging transaction IDs (preventing catastrophic 32-bit " +
          "transaction wraparound) and reclaim disk space from dead tuples. " +
          "Through extensions like **pgvector**, **PostGIS**, and **TimescaleDB**, " +
          "PostgreSQL eliminates the operational sprawl of deploying specialized " +
          "databases for vectors, GIS, and time-series."
      },

      miss: [
        {
          w: "PostgreSQL uses lightweight threads for connections like MySQL.",
          r: "Postgres forks a full OS process per connection. 1,000 idle connections " +
            "consume gigabytes of RAM and trigger severe OS context switching. " +
            "A connection pooler (PgBouncer) is essential."
        },
        {
          w: "Autovacuum can be disabled to maximize write throughput.",
          r: "Disabling autovacuum causes devastating table bloat and eventually " +
            "triggers a database-wide emergency freeze to protect against transaction " +
            "ID (XID) wraparound data corruption."
        },
        {
          w: "Storing JSON in PostgreSQL is just an unindexed text gimmick.",
          r: "PostgreSQL's `JSONB` format parses JSON into a structured binary tree. " +
            "Paired with GIN (Generalized Inverted Index) indexes, JSONB lookups " +
            "frequently match or outperform specialized document databases."
        },
        {
          w: "PostgreSQL cannot scale horizontally.",
          r: "Streaming replication scales reads horizontally across standby replicas, " +
            "and extensions like Citus shard tables across distributed clusters for " +
            "horizontal scale-out OLTP and analytics."
        }
      ],

      trade: {
        buys: [
          "Peerless extensibility (pgvector, PostGIS, custom types, FDWs).",
          "Strict ANSI SQL standard compliance and sophisticated query optimizer.",
          "Rock-solid ACID reliability with battle-tested point-in-time recovery (WAL).",
          "Multimodal capability: relational, JSONB documents, vectors, and full-text in one engine."
        ],
        costs: [
          "Forked process architecture requires external connection pooling (PgBouncer) at scale.",
          "Table bloat and vacuum overhead from MVCC dead tuple accumulation.",
          "Absence of built-in multi-master replication in core distribution.",
          "Steep tuning curve for autovacuum, shared buffers, and work_mem parameters."
        ],
        avoid: [
          "Spawning thousands of short-lived direct client connections without a connection pooler.",
          "Massive write-heavy append-only logging without partition rotation or archiving.",
          "Multi-master active-active replication across multiple geographic regions without specialized extensions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mysql",

      why: {
        before: "Databases were heavy, expensive commercial products (Oracle, IBM DB2) " +
          "requiring proprietary UNIX servers and enterprise licensing.",
        problem: "The birth of the consumer web demanded a fast, lightweight, " +
          "open-source database that could run on inexpensive commodity PC hardware " +
          "and integrate frictionlessly with emerging web frameworks.",
        shift: "**A fast, multi-threaded open-source relational database.** " +
          "MySQL powered the LAMP stack revolution (Linux, Apache, MySQL, PHP), " +
          "introducing a pluggable storage engine architecture with rock-solid " +
          "primary key lookups and simple master-replica replication."
      },

      num: {
        t: "MySQL / InnoDB internal architecture & storage structures",
        h: ["Internal Component", "Mechanism", "Architectural Role", "Key Benefit"],
        r: [
          ["**InnoDB Clustered Index**", "**Primary key B+ Tree embeds complete row data in leaf nodes**", "**Physical on-disk data organization**", "**Ultra-fast primary key lookups (single B+ Tree traversal)**"],
          ["**Buffer Pool**", "**In-memory LRU cache for data pages and index pages**", "**Caches working set in RAM**", "**Minimizes disk I/O; dynamically handles dirty page flushing**"],
          ["**Doublewrite Buffer**", "**Writes dirty pages to contiguous disk area before writing to data files**", "**Crash protection against partial page writes**", "**Prevents page tearing during OS crashes**"],
          ["**Redo Log (WAL)**", "**Crash-recovery circular log of physical page changes**", "**Guarantees Durability (ACID)**", "**Enables fast sequential writes and crash recovery**"],
          ["**Undo Log**", "**Stores historical versions of modified rows**", "**Enables MVCC and transaction rollback**", "**Allows snapshot reads without row locks**"],
          ["**Binary Log (Binlog)**", "**Logical log of all schema modifications and row mutations**", "**Replication & Point-In-Time Recovery**", "**Powers asynchronous/semi-sync replication across web scale**"]
        ],
        n: "MySQL is the most widely deployed relational database powering " +
          "the global web, serving as the foundational persistence layer for " +
          "Meta, Uber, GitHub, Booking.com, and WordPress. Its core transactional " +
          "engine is **InnoDB**. Unlike PostgreSQL which separates the table " +
          "heap from secondary indexes, InnoDB organizes all tables around " +
          "a **Clustered Index**: the physical rows of the table are stored " +
          "directly inside the leaf pages of the Primary Key B+ Tree. A lookup " +
          "by primary key (`WHERE id = 50`) traverses the tree and immediately " +
          "finds all row columns in the leaf page with zero secondary fetches. " +
          "However, this means **secondary indexes** do not store physical disk " +
          "pointers; instead, they store the row's Primary Key value. A secondary " +
          "index lookup therefore performs two traversals: first down the " +
          "secondary B+ Tree to find the Primary Key, and then down the clustered " +
          "index tree to fetch the row columns (known as a **bookmark lookup**). " +
          "MySQL employs a **multi-threaded architecture**, allocating a lightweight " +
          "thread per connection rather than a full process, allowing it to " +
          "comfortably handle thousands of client connections with lower RAM " +
          "footprint than process-based engines."
      },

      miss: [
        {
          w: "MySQL does not support ACID transactions.",
          r: "This outdated myth stems from the legacy non-transactional MyISAM engine. " +
            "InnoDB has been MySQL's default engine since v5.5 and provides strict, " +
            "battle-tested ACID compliance."
        },
        {
          w: "Secondary index lookups in MySQL are just as fast as primary key lookups.",
          r: "Secondary indexes store the primary key rather than row pointers. " +
            "Queries on secondary indexes require a second B+ Tree lookup (bookmark lookup) " +
            "unless the query is satisfied entirely by a covering index."
        },
        {
          w: "Setting MySQL charset to `utf8` correctly stores all Unicode characters.",
          r: "MySQL's legacy `utf8` charset only supports 3-byte characters, breaking " +
            "on emojis and mathematical symbols. Production databases must always use `utf8mb4`."
        },
        {
          w: "MySQL and MariaDB remain identical and interchangeable drop-in replacements.",
          r: "While they share origins, their query optimizers, replication internals, " +
            "storage engine enhancements, and JSON functions have diverged significantly " +
            "over the last decade."
        }
      ],

      trade: {
        buys: [
          "Ubiquitous global ecosystem, managed hosting, and operational tooling (AWS RDS, PlanetScale).",
          "Exceptional point-lookup performance on clustered primary keys.",
          "Efficient multi-threaded connection handling with lower memory overhead than process models.",
          "Simple, battle-tested asynchronous and semi-synchronous replication."
        ],
        costs: [
          "Secondary index bookmark lookups introduce extra tree traversal latency.",
          "Weaker support for advanced analytical SQL, window functions, and complex extensions than Postgres.",
          "Historical quirks and configuration traps (e.g. `utf8` vs `utf8mb4`, sql_mode defaults).",
          "Online schema migrations (`ALTER TABLE`) historically required external tooling (pt-online-schema-change, gh-ost)."
        ],
        avoid: [
          "Complex spatial or high-dimensional vector search without dedicated external systems.",
          "Workloads with massive unindexed JSON document querying across nested hierarchies.",
          "Omitting an explicit Primary Key (InnoDB will generate a hidden 6-byte row ID with a global lock)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sqlite",

      why: {
        before: "Using SQL required installing, configuring, securing, and " +
          "maintaining a standalone client-server database daemon over network sockets.",
        problem: "Mobile applications, desktop software, embedded IoT devices, " +
          "test suites, and local developer tools could not afford the disk " +
          "footprint, memory overhead, network latency, or administrative burden " +
          "of a running database server.",
        shift: "**An in-process, serverless, self-contained SQL database engine.** " +
          "SQLite compiles directly into the application binary as a compact C library, " +
          "storing entire relational databases in a single, portable, cross-platform disk file."
      },

      num: {
        t: "SQLite architecture & operational benchmarks",
        h: ["Metric / Component", "Internal Implementation", "Impact / Advantage"],
        r: [
          ["**Binary Footprint**", "**< 1 Megabyte of compiled C code**", "**Embeddable into microcontrollers, iOS apps, browsers, appliances**"],
          ["**Execution Engine**", "**Virtual Database Engine (VDBE) register machine**", "**Executes compiled opcode bytecode directly in application memory**"],
          ["**Concurrency Mode**", "**WAL (Write-Ahead Log) mode**", "**Concurrent multi-process readers; single writer non-blocking to readers**"],
          ["**Storage Format**", "**Single self-contained B-tree file**", "**Cross-platform binary file; copy or email the entire database**"],
          ["**Query Latency**", "**Sub-millisecond (often 10–50 microseconds)**", "**Zero network stack, zero IPC, zero serialization overhead**"],
          ["**Global Deployment**", "**Estimated > 1 trillion active SQLite databases**", "**The most widely deployed software library in human history**"]
        ],
        n: "SQLite is an extraordinary feat of software engineering. It is " +
          "not a client-server program; it is an **embedded library** that " +
          "runs directly inside the host application's memory space. When an " +
          "app executes a query, SQLite parses the SQL, compiles it into " +
          "opcodes for its register-based **Virtual Database Engine (VDBE)**, " +
          "and executes the bytecode against internal B-Tree pages stored " +
          "in the single database file. Because there is no TCP socket, " +
          "no loopback network interface, and no inter-process communication " +
          "(IPC), single-row lookups execute in **microseconds**—often 10x to " +
          "50x faster than PostgreSQL or MySQL. In its default configuration, " +
          "SQLite locks the entire database file during writes. However, enabling " +
          "**WAL mode (`PRAGMA journal_mode=WAL;`)** fundamentally transforms " +
          "concurrency: writes append to a separate WAL file, allowing **unlimited " +
          "concurrent reader processes** to read historical snapshots without " +
          "blocking or being blocked by the single active writer. Modern distributed " +
          "systems (such as Litestream, LiteFS, and Turso / libSQL) replicate " +
          "SQLite WAL streams across edge regions, bringing sub-millisecond " +
          "relational databases directly to edge compute."
      },

      miss: [
        {
          w: "SQLite is just a toy database unsuitable for production web applications.",
          r: "SQLite comfortably powers production websites handling hundreds of " +
            "thousands of requests per day. In WAL mode on modern NVMe drives, SQLite " +
            "sustains tens of thousands of read queries per second."
        },
        {
          w: "SQLite does not provide real ACID guarantees.",
          r: "SQLite is fully ACID-compliant. It guarantees atomic commits, consistency " +
            "checks, transaction isolation, and durability through write-ahead logging."
        },
        {
          w: "Multiple processes cannot access an SQLite database simultaneously.",
          r: "In WAL mode, any number of independent processes can read the database " +
            "concurrently. Only writes are serialized through a single writer lock."
        },
        {
          w: "SQLite lacks support for advanced SQL features.",
          r: "SQLite supports Common Table Expressions (CTEs), window functions, " +
            "JSON querying, full-text search (FTS5), and generated columns."
        }
      ],

      trade: {
        buys: [
          "Zero deployment, configuration, or administrative overhead.",
          "Blistering microsecond query speed with zero network latency.",
          "Single-file database portability: trivially snapshot, backup, or clone.",
          "Extremely reliable: tested with 100% branch test coverage under fault injection."
        ],
        costs: [
          "Single-writer limitation: concurrent write-heavy workloads hit `SQLITE_BUSY` lock contention.",
          "No built-in network access: must be wrapped in application code or HTTP servers.",
          "Lacks fine-grained user authentication and role-based access control.",
          "Dynamic weak typing: columns accept any data type regardless of declared schema."
        ],
        avoid: [
          "High-volume concurrent write-heavy systems (e.g. hundreds of simultaneous write transactions).",
          "Multi-server distributed clusters without specialized replication tooling (LiteFS).",
          "Petabyte-scale analytical data warehousing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mongodb",

      why: {
        before: "Relational databases forced developers to decompose nested " +
          "object graphs into flat tables across dozens of foreign keys, requiring " +
          "complex multi-table joins to reconstruct JSON entities.",
        problem: "Rapidly iterating web applications with dynamic, polymorphic " +
          "data models were paralyzed by rigid schema migrations, and scaling " +
          "relational tables horizontally across server clusters was extraordinarily complex.",
        shift: "**A distributed, document-oriented NoSQL database.** MongoDB stores " +
          "data as rich, hierarchical BSON (Binary JSON) documents, providing " +
          "flexible schemas, native horizontal sharding, and automated replica set failover."
      },

      num: {
        t: "MongoDB core architecture & operational primitives",
        h: ["Component / Feature", "Underlying Technology", "Core Capability", "Trade-off"],
        r: [
          ["**WiredTiger Storage Engine**", "**LSM and B-Tree storage with document-level locking**", "**High concurrency, Snappy/zlib compression**", "**Consumes 50% of available RAM for internal cache**"],
          ["**BSON Document Model**", "**Typed binary encoding of JSON (supports Date, ObjectId, BinData)**", "**Stores nested documents and arrays up to 16 MB**", "**Field names repeated in every document; storage overhead**"],
          ["**Replica Sets**", "**Primary-secondary topology with Raft-like consensus elections**", "**Automated sub-second failover and read scaling**", "**Write concern (`w: 'majority'`) needed for true durability**"],
          ["**Horizontal Sharding**", "**`mongos` query routers, config servers, shard ranges**", "**Distributes collections across hundreds of machines**", "**Cross-shard queries require scatter-gather coordination**"],
          ["**Aggregation Pipeline**", "**Multi-stage pipeline (`$match`, `$group`, `$project`, `$lookup`)**", "**Complex data processing and analytics natively in DB**", "**Memory limits (100MB per stage without `allowDiskUse`)**"]
        ],
        n: "MongoDB pioneered the modern document database paradigm. Data is " +
          "grouped into **Collections** containing **BSON (Binary JSON)** documents. " +
          "Because BSON supports nested sub-documents and arrays, an entire " +
          "domain entity—such as an e-commerce order containing customer " +
          "details, shipping address, line items, and audit logs—can be persisted " +
          "and retrieved as a **single atomic document**. This completely " +
          "eliminates the performance penalty of multi-table relational " +
          "joins. Concurrency is managed by the **WiredTiger** storage engine, " +
          "which provides document-level lock concurrency and compression. " +
          "High availability is built-in through **Replica Sets**: an odd " +
          "number of nodes (typically 3) maintain synchronized copies of data " +
          "via an idempotent replication log (`oplog`). If the primary node " +
          "fails, the secondary nodes elect a new primary within seconds. " +
          "For massive horizontal scale, MongoDB employs **Sharding**: a " +
          "cluster consists of `mongos` query routers, config server replicas " +
          "storing cluster metadata, and shard instances storing partitioned " +
          "data chunks split by a user-defined **Shard Key**."
      },

      miss: [
        {
          w: "MongoDB is 'schemaless' so developers don't need to design schemas.",
          r: "Lack of rigid database DDL makes careful schema design and index " +
            "alignment even more critical. Poor document design leads to document bloat, " +
            "unindexed queries, and massive write amplification."
        },
        {
          w: "MongoDB does not support ACID transactions.",
          r: "MongoDB introduced multi-document ACID transactions across replica sets " +
            "in v4.0 and across sharded clusters in v4.2."
        },
        {
          w: "MongoDB cannot perform joins between collections.",
          r: "The `$lookup` stage in the MongoDB Aggregation Pipeline performs " +
            "left outer equi-joins between collections."
        },
        {
          w: "Embedding everything into one giant nested document is always best.",
          r: "Documents have a strict 16 MB size limit. Unbounded growing arrays " +
            "(e.g. appending comments forever) trigger document relocation, memory " +
            "fragmentation, and severe query degradation."
        }
      ],

      trade: {
        buys: [
          "Natural impedance match with JavaScript, JSON, and modern object-oriented code.",
          "Dynamic, flexible schema allows rapid feature iteration without table locks.",
          "Native horizontal sharding scales storage and throughput across large clusters.",
          "Powerful Aggregation Pipeline for in-database transformation and analytics."
        ],
        costs: [
          "Storage overhead: repetitive JSON field keys stored inside every document.",
          "Joins (`$lookup`) are significantly less efficient than relational B-tree joins.",
          "Large RAM footprint: WiredTiger cache aggressively consumes system memory.",
          "Lacks compile-time DDL type constraints without application-level validation (ODMs)."
        ],
        avoid: [
          "Highly normalized data models with deep multi-way relational joins.",
          "Systems requiring strict compile-time foreign key constraint enforcement.",
          "Append-heavy unbounded array nesting within single documents."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "redis",

      why: {
        before: "Web servers queried disk-backed relational databases for every " +
          "ephemeral user session, API rate limit counter, and temporary cache lookup.",
        problem: "Mechanical disks and even fast NVMe drives incur physical I/O " +
          "and lock serialization latency (5ms–50ms), causing database bottlenecks " +
          "under millions of simultaneous requests.",
        shift: "**Remote Dictionary Server (Redis): in-memory data structures.** " +
          "Keep entire active working sets in RAM, executed via a single-threaded, " +
          "lock-free event loop delivering sub-millisecond responses for hundreds " +
          "of thousands of operations per second."
      },

      num: {
        t: "Redis core data structures & internal memory encodings",
        h: ["Data Structure", "Internal C Encoding", "Primary Operations", "Real-World Architecture Role"],
        r: [
          ["**String**", "**SDS (Simple Dynamic String)**", "`GET`, `SET`, `INCR`, `SETNX`", "**Key-value caching, distributed locks, atomic counters**"],
          ["**Hash**", "**listpack / hashtable**", "`HGET`, `HSET`, `HINCRBY`", "**User session state, object representations**"],
          ["**List**", "**quicklist (linked list of ziplists)**", "`LPUSH`, `RPOP`, `BRPOP`", "**Message queues, event job queues, timeline feeds**"],
          ["**Set**", "**intset / hashtable**", "`SADD`, `SMEMBERS`, `SINTER`", "**Unique visitor tracking, tagging systems, mutual friends**"],
          ["**Sorted Set (ZSET)**", "**skiplist + hashtable**", "`ZADD`, `ZRANGEBYSCORE`, `ZRANK`", "**Real-time gaming leaderboards, sliding-window rate limiters**"],
          ["**Stream**", "**radix tree (rax) of listpacks**", "`XADD`, `XREADGROUP`, `XACK`", "**High-throughput Kafka-like message streaming & consumer groups**"]
        ],
        n: "Redis is celebrated for achieving extraordinary throughput " +
          "(100,000+ commands/sec on a single CPU core) with **sub-millisecond " +
          "latency**. The architectural secret is its **single-threaded event " +
          "loop**: by executing commands sequentially on a single thread using " +
          "I/O multiplexing (`epoll` on Linux, `kqueue` on macOS), Redis completely " +
          "eliminates thread synchronization, mutex locks, context switching, " +
          "and race conditions. Operations on complex data structures are " +
          "natively atomic. Redis is not a dumb string cache; it provides " +
          "sophisticated primitives: **Sorted Sets** allow instant retrieval " +
          "of top scores in O(log N) time using a probabilistic skip list, " +
          "and **Bitmaps** allow checking 1 billion flags in 128 MB of RAM. " +
          "Durability is handled via two orthogonal persistence mechanisms: " +
          "**RDB (Redis Database)**, which creates point-in-time binary snapshots " +
          "using copy-on-write `fork()`, and **AOF (Append-Only File)**, which " +
          "logs every write command and syncs to disk according to policy " +
          "(`fsync everysec` or `always`). For high availability, **Redis Sentinel** " +
          "manages automated failover, while **Redis Cluster** partitions data " +
          "across 16,384 logical hash slots."
      },

      miss: [
        {
          w: "Redis is just a volatile cache and cannot store persistent data.",
          r: "With AOF persistence set to `appendfsync everysec`, Redis provides " +
            "durable storage suitable as a primary database for sessions, rate limits, " +
            "and real-time analytics."
        },
        {
          w: "Redis cannot take advantage of modern multi-core servers.",
          r: "Redis 6.0 introduced multi-threaded I/O for socket read/writes while " +
            "keeping command execution lock-free. In production, engineers run multiple " +
            "Redis instances pinned to different CPU cores on the same machine."
        },
        {
          w: "Redis will swap data to disk when RAM runs out.",
          r: "Redis is strictly in-memory. When `maxmemory` is reached, it executes " +
            "configured eviction policies (e.g. `allkeys-lru`, `volatile-ttl`) or returns " +
            "OOM errors. It does not transparently page cold data to disk."
        },
        {
          w: "Redis transactions (MULTI/EXEC) support rollback on error.",
          r: "Redis commands within a transaction do not roll back if a syntax " +
            "or data-type error occurs during execution. Subsequent commands continue running."
        }
      ],

      trade: {
        buys: [
          "Sub-millisecond responses: 100k+ operations per second on a single thread.",
          "Rich built-in data structures (Sorted Sets, Hashes, Streams, Bitmaps, HyperLogLog).",
          "Atomic operations eliminate race conditions in distributed counters and locks.",
          "Versatile: serves as cache, session store, rate limiter, message broker, and queue."
        ],
        costs: [
          "Total dataset must fit entirely within physical server RAM (RAM is 5x–10x pricier than SSDs).",
          "AOF persistence can lose up to 1 second of writes during sudden hardware power loss.",
          "Single-threaded CPU bottleneck on expensive commands (e.g. running `KEYS *` blocks all traffic).",
          "Data loss risk if memory limits and eviction policies are misconfigured."
        ],
        avoid: [
          "Executing slow O(N) commands (`KEYS *`, massive `SMEMBERS`) on live production clusters.",
          "Storing massive cold historical datasets that do not benefit from microsecond RAM latency.",
          "Complex relational queries requiring joins and multi-table filtering."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dynamodb",

      why: {
        before: "Scaling databases to handle sudden viral traffic required manual " +
          "sharding, provisioning oversized server instances, managing replication lag, " +
          "and constant DBA intervention.",
        problem: "Traditional databases hit vertical scaling limits, requiring " +
          "complex sharding logic in application code, while unexpected holiday " +
          "traffic spikes brought down e-commerce checkout systems.",
        shift: "**A fully managed, serverless NoSQL database guaranteeing single-digit " +
          "millisecond latency at any scale.** Amazon DynamoDB abstracts all " +
          "hardware, instances, and partitions, scaling automatically from 10 " +
          "requests to 10 million requests per second with zero administrative maintenance."
      },

      num: {
        t: "Amazon DynamoDB architectural primitives & scaling mechanisms",
        h: ["Primitive / Feature", "Mechanism", "Operational Purpose", "Design Rule"],
        r: [
          ["**Partition Key (HASH)**", "**Internal MD5 hash determines physical storage partition**", "**Distributes items uniformly across storage nodes**", "**Must have high cardinality to avoid 'hot partitions'**"],
          ["**Sort Key (RANGE)**", "**B-Tree sorted range within the partition key**", "**Enables 1:N relations, range queries, and prefix lookups**", "**Used for hierarchical sorting (e.g. date, status)**"],
          ["**Global Secondary Index (GSI)**", "**Asynchronously replicated secondary partition & sort key**", "**Enables alternative access patterns across partitions**", "**Consumes independent read/write capacity units**"],
          ["**Single-Table Design**", "**Stores multiple entity types in 1 table using generic keys**", "**Satisfies multiple relational access patterns in 1 query**", "**Requires defining all query access patterns upfront**"],
          ["**DynamoDB Streams**", "**Time-ordered CDC (Change Data Capture) log**", "**Triggers AWS Lambda functions on every item mutation**", "**Powers event-driven architectures and read-model sync**"],
          ["**Capacity Modes**", "**On-Demand (pay per request) vs Provisioned (reserved RCU/WCU)**", "**Cost optimization based on traffic predictability**", "**On-Demand handles unpredictable spiky workloads**"]
        ],
        n: "DynamoDB is engineered around the principles of the landmark 2007 " +
          "Amazon Dynamo paper: horizontal scalability achieved through " +
          "**consistent hashing** and partition routing. A DynamoDB table is " +
          "split into multiple physical storage partitions (each holding up " +
          "to 10 GB of data and sustaining 1,000 WCU or 3,000 RCU). When an " +
          "app performs a `GetItem` or `PutItem`, the DynamoDB request router " +
          "hashes the **Partition Key** to determine the exact storage node, " +
          "fetching the item in **single-digit milliseconds** regardless of " +
          "whether the table contains 1,000 items or 10 billion items. " +
          "Because cross-partition joins are impossible, high-performance " +
          "architectures utilize **Single-Table Design**: multiple business " +
          "entities (e.g. Users, Orders, OrderItems) are stored in a single " +
          "table using overloaded generic keys (e.g. `PK = USER#101`, " +
          "`SK = ORDER#2026-05`). A single `Query` operation can fetch a user " +
          "and all their recent orders in a single sub-10ms network roundtrip. " +
          "Each partition automatically replicates across 3 Availability Zones " +
          "using **Paxos consensus**, guaranteeing high availability and durability."
      },

      miss: [
        {
          w: "DynamoDB supports ad-hoc queries with arbitrary filtering efficiently.",
          r: "DynamoDB queries must filter by Partition Key and optionally Sort Key. " +
            "Filtering by unindexed attributes triggers a full table `Scan`, which is " +
            "excruciatingly slow, consumes massive capacity units, and costs huge money."
        },
        {
          w: "DynamoDB tables should be modeled like relational tables (one table per entity).",
          r: "Multi-table relational modeling in DynamoDB forces multiple sequential " +
            "HTTP roundtrips to fetch related data. Single-Table Design is the industry " +
            "standard pattern for high-scale applications."
        },
        {
          w: "DynamoDB is strictly eventually consistent.",
          r: "DynamoDB defaults to eventually consistent reads (half the price), but " +
            "supports strongly consistent reads upon request, as well as ACID multi-item " +
            "transactions (`TransactWriteItems`)."
        },
        {
          w: "DynamoDB is inherently expensive compared to self-hosted databases.",
          r: "For properly indexed workloads, on-demand capacity eliminates the cost " +
            "of idle servers. Runaway bills almost always result from unindexed `Scan` operations."
        }
      ],

      trade: {
        buys: [
          "Guaranteed single-digit millisecond latency at any scale (10 to 10M req/sec).",
          "Zero operational maintenance: fully managed, zero server patching, automated backups.",
          "Seamless auto-scaling with On-Demand pricing: pay strictly for executed reads and writes.",
          "Built-in multi-region active-active replication via DynamoDB Global Tables."
        ],
        costs: [
          "Rigid access patterns: all queries must be known before designing the schema.",
          "Vendor lock-in: proprietary Amazon Web Services API and infrastructure.",
          "Steep learning curve for Single-Table Design and partition key distribution.",
          "Item size limit is strictly capped at 400 KB."
        ],
        avoid: [
          "Applications requiring flexible, ad-hoc analytical queries or business reporting.",
          "Frequent unindexed full-table scans across millions of items.",
          "Items exceeding 400 KB (store large payloads in S3 and reference pointer in DynamoDB)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bigquery",

      why: {
        before: "Analyzing terabyte or petabyte datasets required provisioning " +
          "and tuning dedicated Hadoop, Spark, or Teradata clusters, managing node " +
          "failures, and waiting hours for queries to complete.",
        problem: "Dedicated clusters sat idle during off-peak hours wasting money, " +
          "choked when ad-hoc analytical queries required 10x compute capacity, " +
          "and required entire teams of platform engineers just to keep hardware online.",
        shift: "**A serverless, petabyte-scale cloud data warehouse.** " +
          "Google BigQuery decouples storage and compute using Google's planetary-scale " +
          "infrastructure (Dremel, Colossus, Jupiter, Capacitor), allowing users to " +
          "query petabytes of data using standard SQL in seconds with zero provisioning."
      },

      num: {
        t: "Google BigQuery planetary-scale architecture stack",
        h: ["Technology Layer", "Google Internal System", "Core Responsibility", "Scale & Speed"],
        r: [
          ["**Query Execution Engine**", "**Dremel**", "**Multi-level execution trees dynamically dispatching query tasks**", "**Scales dynamically across tens of thousands of worker slots**"],
          ["**Distributed Storage**", "**Colossus (successor to GFS)**", "**Global distributed cluster filesystem with erasure coding**", "**Exabyte storage capacity, 99.999999999% durability**"],
          ["**Columnar Storage Format**", "**Capacitor**", "**Proprietary columnar format with nested fields & automated encoding**", "**Massive compression and projection pruning**"],
          ["**Interconnect Network**", "**Jupiter Network Fabric**", "**Bisection petabit datacenter network**", "**Slots read Colossus storage at terabits per second without data locality**"],
          ["**Slot Management**", "**Borg & Dynamic Slot Allocation**", "**Virtual CPU/RAM allocation unit**", "**Burst compute: queries acquire thousands of slots in milliseconds**"],
          ["**In-Database AI / ML**", "**BigQuery ML (BQML)**", "**Train and infer ML models (linear, XGBoost, Vertex AI LLMs) in SQL**", "**Zero data export needed to run machine learning**"]
        ],
        n: "Google BigQuery represents the absolute pinnacle of serverless " +
          "data warehousing. Its architectural foundation rests on Google's " +
          "internal infrastructure: **Dremel**, **Colossus**, and **Jupiter**. " +
          "Unlike traditional data warehouses that couple compute nodes to " +
          "local disks, BigQuery has **zero compute-storage locality**. All data " +
          "resides in **Colossus** in Google's proprietary **Capacitor** columnar " +
          "format. When a query is submitted, Dremel parses the ANSI SQL into " +
          "an execution tree and dynamically allocates thousands of worker " +
          "**slots** (units of CPU and RAM managed by Borg). These slots read " +
          "data from Colossus across the **Jupiter petabit network**, which " +
          "provides so much bisection bandwidth (over 1 Petabit/sec) that " +
          "reading data over the network is just as fast as reading from local " +
          "bus channels. In BigQuery's default **on-demand pricing model**, " +
          "users pay strictly for the number of bytes processed by columns " +
          "referenced in the query ($6.25 per TB). Therefore, **partitioning** " +
          "(e.g. by ingestion date) and **clustering** (sorting by frequently " +
          "filtered dimensions) are paramount: a query filtering on a clustered " +
          "column skips unneeded blocks, slashing scanned bytes and query cost " +
          "by 90% to 99%."
      },

      miss: [
        {
          w: "BigQuery requires indexing tables with B-trees to make queries fast.",
          r: "BigQuery does not have traditional indexes. Performance is achieved " +
            "through columnar Capacitor pruning, partitioning, clustering, and " +
            "massive parallel slot execution."
        },
        {
          w: "Running `SELECT *` in BigQuery has negligible cost impact.",
          r: "BigQuery charges by bytes scanned. Running `SELECT *` on a 100-column " +
            "table scans all columns and costs 50x to 100x more than selecting " +
            "the 2 columns you actually need."
        },
        {
          w: "BigQuery is suitable as a primary backend for interactive web apps.",
          r: "BigQuery has a query startup latency of 1 to 3 seconds. It is built " +
            "for analytical batch querying, not sub-10ms transactional OLTP user sessions."
        },
        {
          w: "You must export data to Python to run machine learning on BigQuery tables.",
          r: "BigQuery ML (BQML) trains logistic regression, k-means, random forests, " +
            "and calls Google Gemini LLMs directly within SQL statements."
        }
      ],

      trade: {
        buys: [
          "Zero infrastructure management: no cluster sizing, patching, or storage administration.",
          "Petabyte-scale queries complete in seconds using thousands of dynamically assigned slots.",
          "Pay-per-query on-demand pricing: pay zero dollars when queries are not running.",
          "Rich built-in capabilities: BigQuery ML, BigQuery Studio, GIS, and cross-cloud BigQuery Omni."
        ],
        costs: [
          "On-demand pricing risks runaway cloud bills if developers run unmonitored `SELECT *` queries.",
          "1 to 3 second query startup latency makes it inappropriate for high-frequency OLTP APIs.",
          "Streaming inserts incur small micro-ingestion costs and buffer delays.",
          "Vendor lock-in to Google Cloud Platform ecosystem."
        ],
        avoid: [
          "Interactive sub-100ms web application APIs or transactional banking operations.",
          "Executing `SELECT *` on unpartitioned terabyte-scale tables without cost controls.",
          "High-frequency single-row `INSERT` or `UPDATE` loops (always batch load via Google Cloud Storage)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
