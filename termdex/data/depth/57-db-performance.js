/* ==========================================================================
   Depth pass 57 — databases batch 5: database performance, concurrency,
   ORM architecture, connection pooling, and disaster recovery.

   A database is only as reliable as its concurrency control, only as fast
   as its query execution path, and only as durable as its recovery drills.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "deadlock",

      why: {
        before: "Transactions acquired locks on table rows and pages ad-hoc " +
          "as execution progressed, with no standardized lock hierarchy.",
        problem: "When Transaction A holds Lock 1 and requests Lock 2, while " +
          "Transaction B holds Lock 2 and requests Lock 1, both threads wait " +
          "for each other indefinitely. Neither can proceed, consuming " +
          "connections and freezing application workers.",
        shift: "**Formal deadlock management via wait-for graph cycle " +
          "detection and automated victim sacrifice.** The database engine " +
          "continuously inspects lock dependencies, detects directed cycles, " +
          "and automatically aborts one transaction with an explicit error " +
          "code so the other can complete."
      },

      num: {
        t: "Deadlock resolution strategies & concurrency controls",
        h: ["Strategy", "Mechanism", "Trade-off"],
        r: [
          ["**Wait-For Graph (Cycle Detection)**", "**Engine traces directed dependency graph; background thread scans for cycles**", "**Fast detection (ms), but requires aborting & rolling back a victim**"],
          ["**Lock Timeout**", "**Transactions abort if lock acquisition takes longer than threshold (e.g. 5s)**", "**Simple to implement, but aborts legitimate slow queries under load**"],
          ["**Strict Lock Ordering**", "**Application sorts all resources (e.g. row IDs) before acquiring locks**", "**Eliminates deadlocks mathematically, but requires discipline across codebases**"],
          ["**Wait-Die / Wound-Wait**", "**Timestamp-based non-preemptive / preemptive prioritization (DDA)**", "**Prevents starvation, but incurs premature restarts of older/younger transactions**"],
          ["**Optimistic Locking (OCC)**", "**Validate version at commit time; zero database row locks held during execution**", "**No engine deadlocks, but retry storms occur under high write contention**"]
        ],
        n: "Deadlocks satisfy the four classical **Coffman conditions**: " +
          "mutual exclusion, hold-and-wait, no preemption, and circular " +
          "wait. In relational engines like PostgreSQL and MySQL InnoDB, " +
          "the storage engine maintains a dynamic **wait-for graph** " +
          "where nodes represent active transactions and directed edges " +
          "represent blocked lock requests. A background thread runs at " +
          "configurable intervals (e.g. `deadlock_timeout` in PostgreSQL, " +
          "default 1s; `innodb_deadlock_detect=ON` in MySQL) searching " +
          "for cycles using Tarjan's or Kosaraju's algorithms. When a cycle " +
          "is found, the engine selects a **victim transaction**—typically " +
          "the transaction that has inserted or modified the fewest undo log " +
          "records to minimize rollback cost—and aborts it with an error " +
          "(e.g. SQLSTATE `40P01` in Postgres, error `1213` in MySQL). The " +
          "victim's locks are released, allowing the surviving transaction " +
          "to finalize. Well-architected applications must treat deadlock " +
          "errors not as catastrophic system crashes, but as standard " +
          "transient serialization failures requiring **exponential backoff " +
          "and jittered retry loops**."
      },

      miss: [
        {
          w: "Deadlocks are database bugs or hardware failures.",
          r: "Deadlocks are a mathematically expected outcome of concurrent " +
            "transactions accessing shared resources in non-deterministic orders. " +
            "The database engine is functioning correctly when it detects and " +
            "breaks them."
        },
        {
          w: "Increasing lock timeouts will fix deadlocks.",
          r: "Lock timeouts do not resolve circular dependencies; they merely " +
            "force applications to hang for longer before failing, exhausting " +
            "connection pools and cascading latency to end users."
        },
        {
          w: "A deadlock causes partial data corruption.",
          r: "Relational engines execute complete atomic rollbacks for the " +
            "chosen victim transaction. All modified rows revert to their " +
            "pre-transaction state in the undo log/WAL."
        },
        {
          w: "Deadlocks only happen on multi-row UPDATE queries.",
          r: "Deadlocks frequently occur between single-row operations when " +
            "foreign key constraint checks, unique secondary index lookups, " +
            "or gap locks (InnoDB Next-Key locks) interleave in conflicting orders."
        }
      ],

      trade: {
        buys: [
          "Guarantees the database never permanently freezes due to circular locks.",
          "Maintains ACID isolation without requiring global single-threaded serialization.",
          "Automates victim rollback, protecting system-wide transaction throughput.",
          "Surfaces clear diagnostic logs identifying conflicting queries and locks."
        ],
        costs: [
          "Victim transactions waste CPU, I/O, and network bandwidth on aborted work.",
          "Applications must implement robust retry logic with backoff.",
          "Deadlock detection graph traversal incurs overhead under thousands of blocked threads.",
          "Client-facing latency spikes when retries multiply under heavy write contention."
        ],
        avoid: [
          "Executing interactive user think-time operations inside open transactions.",
          "Updating rows in arbitrary order across multiple application services.",
          "Running long-running analytical batch updates concurrently with OLTP writes."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "full-table-scan",

      why: {
        before: "Data files were treated as flat sequential logs where finding " +
          "a record meant inspecting every block from the first to the last.",
        problem: "As tables expand to millions of rows, scanning every physical " +
          "data page saturates storage I/O bandwidth, consumes immense CPU " +
          "cycles, and pollutes the database buffer cache, taking minutes " +
          "or hours for simple lookups.",
        shift: "**Pruned navigation via secondary indexes, partition filters, " +
          "and zone maps.** The query optimizer selectively fetches only " +
          "the exact data pages containing candidate rows, replacing linear " +
          "O(N) physical scans with logarithmic O(log N) tree navigations."
      },

      num: {
        t: "Database table scan modes & execution characteristics",
        h: ["Access Method", "I/O Pattern", "Cost Scaling", "Optimal Scenario"],
        r: [
          ["**Full Table Scan (Seq Scan)**", "**Sequential block reads (high throughput)**", "**O(N) rows**", "**Small tables (<1000 rows) or queries fetching >20% of the entire table**"],
          ["**Index Scan**", "**Random page lookups via B-Tree pointers**", "**O(K log N) for K rows**", "**High selectivity queries returning a tiny fraction (<5%) of total rows**"],
          ["**Index-Only Scan**", "**Reads strictly from index leaf pages (zero heap fetches)**", "**O(K log N) (fastest)**", "**Covering indexes where all requested columns reside in the index**"],
          ["**Bitmap Heap Scan**", "**Index scan creates memory bitmap; fetches heap pages sequentially**", "**O(log N + K)**", "**Medium selectivity queries or combining multiple indexed predicates**"],
          ["**Partition Pruning Scan**", "**Eliminates whole physical partition files prior to scan**", "**O(N / P) where P is partitions**", "**Time-series or tenant-sharded queries with partition key filters**"]
        ],
        n: "In database internals, a Full Table Scan (called a `Seq Scan` " +
          "in PostgreSQL or `ALL` in MySQL `EXPLAIN`) reads every allocation " +
          "block of a table heap from disk or operating system page cache. " +
          "While often stigmatized as an anti-pattern, sequential scans are " +
          "actually heavily optimized by hardware: modern NVMe drives and " +
          "kernel readahead algorithms read contiguous blocks at multiple " +
          "gigabytes per second. Conversely, an index scan requires **random " +
          "I/O**—navigating down a B-Tree and then jumping across disparate " +
          "heap pages. Therefore, the cost-based query optimizer (CBO) will " +
          "deliberately choose a full table scan whenever a query matches more " +
          "than roughly 10% to 25% of table rows (the 'selectivity tipping " +
          "point'). The true operational danger of unintended full scans in " +
          "OLTP systems is **buffer pool eviction**: a rogue query scanning " +
          "a 200 GB table forces active, frequently accessed working sets " +
          "out of RAM, degrading latency across all unrelated concurrent queries."
      },

      miss: [
        {
          w: "A full table scan is always bad and indicates a query bug.",
          r: "For tiny reference tables (e.g. status codes, countries) or large " +
            "batch exports where every row is processed, a sequential scan is " +
            "significantly faster than navigating millions of index pointers."
        },
        {
          w: "Adding an index on every column prevents full table scans.",
          r: "Query optimizers only use indexes when predicates are selective. " +
            "If an index has low cardinality (e.g. a boolean flag where 50% " +
            "are TRUE), the optimizer rightly discards the index and performs a full scan."
        },
        {
          w: "Full table scans only affect the user who ran the query.",
          r: "Full scans trigger massive disk I/O and flush hot cached pages " +
            "out of the shared buffer pool, causing cache misses and latency spikes " +
            "for every other user on the database."
        },
        {
          w: "Primary keys ensure queries never perform full scans.",
          r: "A primary key index only optimizes queries filtering on the primary " +
            "key column itself. Filtering on unindexed non-key columns still " +
            "forces a full table scan."
        }
      ],

      trade: {
        buys: [
          "Maximizes contiguous sequential hardware throughput via OS readahead.",
          "Requires zero index storage overhead and zero index write amplification.",
          "Guarantees finding all matching rows even in unindexed or ad-hoc queries.",
          "Avoids the random I/O penalty of index pointer traversals for bulk queries."
        ],
        costs: [
          "Execution time degrades linearly O(N) as the table grows in size.",
          "High disk bandwidth consumption saturates storage channels.",
          "Can evict hot transactional pages from the database buffer cache.",
          "Holds shared table locks or locks multiple pages, blocking concurrent schema updates."
        ],
        avoid: [
          "Interactive OLTP web requests querying multi-million row tables.",
          "Frequent foreign-key lookups during high-volume relational joins.",
          "Pagination APIs where offsets skip large numbers of unindexed rows."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "n-plus-1-query-problem",

      why: {
        before: "Developers wrote explicit, hand-crafted SQL JOINs that " +
          "retrieved parent and child records together in a single roundtrip.",
        problem: "Object-Relational Mapping (ORM) tools introduced lazy loading " +
          "by default. Fetching 100 blog posts issues 1 query, but accessing " +
          "`post.author` in a loop issues 100 subsequent queries—turning 1 " +
          "operation into 101 separate network database roundtrips.",
        shift: "**Eager loading and batched hydration via JOINs, `IN` clauses, " +
          "or DataLoader patterns.** Rather than fetching associations " +
          "on-demand inside iterative loops, the application requests all " +
          "dependent records upfront in 1 or 2 consolidated queries."
      },

      num: {
        t: "Data loading patterns & network impact comparison",
        h: ["Loading Strategy", "Queries Issued (N items)", "Network Overhead", "Primary Mechanism"],
        r: [
          ["**Lazy Loading (N+1)**", "**1 + N queries (e.g. 101 queries)**", "**Severe (multiplies ping latency by N)**", "**Transparent proxy triggers query on property access**"],
          ["**Eager Join (`LEFT JOIN`)**", "**1 single query**", "**Low roundtrips, higher payload duplication**", "**Relational JOIN combines parent and child into single tabular result**"],
          ["**Batch Loading (`WHERE IN`)**", "**2 queries (1 for parents, 1 for children)**", "**Minimal (constant 2 roundtrips)**", "**ORM extracts parent IDs and queries children via `WHERE parent_id IN (...)`**"],
          ["**DataLoader Pattern**", "**Batched within event loop tick**", "**Minimal (batches across asynchronous resolvers)**", "**Queues IDs across promises and executes single batch load**"],
          ["**Denormalized Read Cache**", "**1 cache lookup (Redis / Document)**", "**Near zero**", "**Pre-aggregated JSON document containing embedded associations**"]
        ],
        n: "The N+1 query problem is the single most common performance " +
          "pathology in web development. The fundamental issue is not the " +
          "computation on the database server, but the **network roundtrip " +
          "time (RTT)**. If the latency between application server and " +
          "database instance is 2 milliseconds, executing 500 individual " +
          "queries inside a loop introduces a mandatory 1,000 ms (1 second) " +
          "idle wait time purely for TCP socket handoffs, completely " +
          "independent of database hardware speed. Furthermore, each query " +
          "requires SQL parsing, plan validation, and connection pool check-out/check-in. " +
          "In GraphQL architectures, the problem is compounded because " +
          "nested field resolvers execute independently across the schema " +
          "tree without intrinsic awareness of sibling calls. Solutions " +
          "depend on context: in traditional ORMs (ActiveRecord, Hibernate, " +
          "Entity Framework, Prisma), developers declare eager loading via " +
          "`includes`, `select_related`, or `include: { ... }`. In GraphQL, " +
          "the **DataLoader** pattern uses memoization and event-loop tick " +
          "batching to coalesce individual foreign key lookups into a single " +
          "`WHERE id IN (...)` statement."
      },

      miss: [
        {
          w: "Modern ORMs automatically prevent N+1 queries without developer intervention.",
          r: "Most ORMs default to lazy loading because eager loading everything " +
            "would cause severe memory bloat and Cartesian explosion. Eliminating " +
            "N+1 requires explicit query configuration or batching tools."
        },
        {
          w: "The N+1 problem is only noticeable at massive database scale.",
          r: "Even with 20 records and a 3ms network ping, 21 queries take 60ms " +
            "of dead waiting time. On concurrent web endpoints, this rapidly " +
            "saturates the connection pool and spikes server latency."
        },
        {
          w: "The best solution is always an eager SQL JOIN.",
          r: "Joining multiple one-to-many relationships in a single SQL query " +
            "causes a Cartesian product that duplicates parent row columns " +
            "thousands of times, consuming massive network bandwidth and RAM. " +
            "Two separate queries using `WHERE id IN (...)` is often much faster."
        },
        {
          w: "GraphQL inherently solves N+1 queries by letting clients pick fields.",
          r: "GraphQL exacerbates N+1 queries because nested field resolvers " +
            "run independently for each parent node unless explicitly batched " +
            "with DataLoader."
        }
      ],

      trade: {
        buys: [
          "Collapses hundreds of sequential network roundtrips into 1 or 2 fast operations.",
          "Prevents application worker thread exhaustion and connection pool starvation.",
          "Dramatically reduces database query parsing, logging, and lock acquisition overhead.",
          "Restores predictable sub-50ms web response times."
        ],
        costs: [
          "Requires explicit query tuning and vigilance during code reviews.",
          "Over-eager loading can fetch unused relations into application memory.",
          "Complex multi-level joins can generate convoluted SQL queries.",
          "Cartesian product explosion if multiple collection associations are joined simultaneously."
        ],
        avoid: [
          "Looping over collections and accessing relational navigation properties inside view templates.",
          "Writing GraphQL microservices without request-scoped DataLoader batching.",
          "Blindly chaining multiple one-to-many eager joins in a single SQL statement."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "orm",

      why: {
        before: "Applications constructed database operations via raw SQL strings " +
          "concatenated in business code, manually extracting columnar rows " +
          "from database driver result sets.",
        problem: "The Object-Relational Impedance Mismatch: relational databases " +
          "represent data as flat mathematical relations and tuples, whereas " +
          "object-oriented applications represent data as interconnected object " +
          "graphs with inheritance, encapsulation, and identity. Raw string queries " +
          "led to severe SQL injection vulnerabilities and brittle schema coupling.",
        shift: "**Programmatic mapping between domain models and relational tables.** " +
          "Object-Relational Mapping (ORM) frameworks bridge paradigms by " +
          "automatically generating parameterized SQL, hydrating relational rows " +
          "into language objects, and managing schema migrations."
      },

      num: {
        t: "ORM architectural patterns & data mapping models",
        h: ["Pattern / Paradigm", "Key Principle", "Prominent Implementations", "Core Trade-off"],
        r: [
          ["**Active Record**", "**An object represents a row; business logic and database access coupled in entity**", "**Ruby on Rails ActiveRecord, Django ORM, Laravel Eloquent**", "**Extremely fast prototyping; breaks Clean Architecture at scale**"],
          ["**Data Mapper**", "**Entity is a pure domain object; separate mapper/repository handles persistence**", "**Hibernate (Java), SQLAlchemy (Python), TypeORM/MikroORM (TypeScript)**", "**Decoupled and domain-driven; higher configuration boilerplate**"],
          ["**Type-Safe Query Builder**", "**Generates SQL with compile-time schema types; no entity hydration**", "**Prisma, Kysely, jOOQ, Knex**", "**Full SQL control and type safety; requires writing explicit query logic**"],
          ["**Micro-ORM**", "**Thin wrapper over raw SQL; automates result-set hydration only**", "**Dapper (.NET), Sqlx (Rust), HugSQL (Clojure)**", "**Near zero runtime overhead; requires manual SQL query maintenance**"],
          ["**Document/Object Store (ODM)**", "**Maps directly to hierarchical BSON/JSON structures without tables**", "**Mongoose (MongoDB), MongoEngine**", "**Natural fit for nested objects; lacks relational consistency guarantees**"]
        ],
        n: "The central challenge of ORMs is managing the **Unit of Work** " +
          "and the **Identity Map**. A sophisticated ORM tracks changes " +
          "made to in-memory entities during a business transaction (dirty " +
          "checking). When the transaction commits, the Unit of Work calculates " +
          "the minimal set of INSERT, UPDATE, and DELETE statements required, " +
          "sorting them topologically to satisfy foreign key dependencies. " +
          "Meanwhile, the Identity Map ensures that querying the same database " +
          "row twice returns the exact same object reference in memory, " +
          "preventing conflicting concurrent state within a single thread. " +
          "However, ORMs introduce an **abstraction leak**: developers who do " +
          "not understand underlying database semantics easily generate " +
          "inefficient queries, unwanted Cartesian products, and locking " +
          "anomalies. As systems mature, high-scale architectures often adopt " +
          "a **CQRS (Command Query Responsibility Segregation)** pattern, " +
          "using the ORM strictly for transactional writes (commands) while " +
          "executing high-performance raw SQL or query builders for reads."
      },

      miss: [
        {
          w: "Using an ORM eliminates the need for engineers to learn SQL.",
          r: "Engineers must understand SQL and query execution plans even more " +
            "deeply to identify when an ORM's abstraction layer generates " +
            "catastrophic queries like N+1 loops or unindexed full scans."
        },
        {
          w: "ORMs make applications completely database-agnostic.",
          r: "Real-world production systems rely on database-specific types " +
            "(JSONB, UUIDs, arrays), specific locking semantics (`FOR UPDATE SKIP LOCKED`), " +
            "and vendor-specific functions that break when switching engines."
        },
        {
          w: "ORMs are always too slow for high-performance production systems.",
          r: "The CPU overhead of modern ORMs is typically in microseconds, whereas " +
            "database I/O and network latency are in milliseconds. When tuned " +
            "with eager loading and index alignment, ORMs perform excellently."
        },
        {
          w: "Automated ORM migrations eliminate the need for DBA oversight.",
          r: "Auto-generated migrations can run blocking table rewrites " +
            "(`ALTER TABLE ... ADD COLUMN DEFAULT ...` on older engines) that acquire " +
            "exclusive access-exclusive locks and cause production outages."
        }
      ],

      trade: {
        buys: [
          "Dramatically accelerates application development and CRUD feature velocity.",
          "Provides automatic defense against SQL injection via parameterized statements.",
          "Automates transactional change tracking (Unit of Work) and entity identity.",
          "Provides structured schema migration tooling integrated into version control."
        ],
        costs: [
          "Leaky abstraction that can generate inefficient or surprising SQL statements.",
          "Memory overhead from entity hydration, metadata reflection, and change tracking.",
          "Steep learning curve for advanced lifecycle hooks, cascades, and relationships.",
          "Impedance mismatch when mapping complex inheritance or polymorphic models."
        ],
        avoid: [
          "High-throughput analytical reporting requiring massive aggregate grouping.",
          "Bulk batch operations inserting or updating millions of records simultaneously.",
          "Low-latency algorithmic trading systems where sub-millisecond execution is mandatory."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "connection-pool",

      why: {
        before: "Applications created a new operating system TCP connection " +
          "and authenticated with the database for every single incoming web request.",
        problem: "Establishing a database connection is computationally heavy: " +
          "it requires a TCP 3-way handshake, TLS certificate negotiation, " +
          "database authentication handshakes, and allocating a dedicated backend " +
          "process or thread on the database server. Doing this under high " +
          "request rates crashes database servers within seconds.",
        shift: "**Maintain a persistent pool of pre-warmed database connections.** " +
          "Worker threads borrow an active connection from an in-memory pool, " +
          "execute their SQL commands, and immediately return the connection " +
          "to the pool for reuse by subsequent requests."
      },

      num: {
        t: "Key connection pool tuning parameters & behaviors",
        h: ["Parameter", "Purpose", "Default / Typical Value", "Failure Mode if Misconfigured"],
        r: [
          ["**Max Pool Size**", "**Maximum concurrent physical connections allowed**", "**10–30 per application node**", "**Too high crashes DB via CPU context switching; too low causes queue timeouts**"],
          ["**Connection Timeout**", "**Max time an app thread waits to borrow a connection**", "**1,000–5,000 ms**", "**Fast-fails request when pool is exhausted, preventing cascading server lockup**"],
          ["**Idle Timeout**", "**Max time an unused connection remains open in the pool**", "**10–30 minutes**", "**Keeps pool lean during low-traffic periods without thrashing connections**"],
          ["**Max Lifetime**", "**Absolute maximum lifespan of a physical connection**", "**30–60 minutes**", "**Prevents memory leaks in DB drivers and cleans up stale TCP half-open states**"],
          ["**Connection Validation**", "**Test query (`SELECT 1`) or ping before assigning to thread**", "**Socket ping / `testOnBorrow`**", "**Catches dead or dropped connections before application queries fail**"]
        ],
        n: "Connection pools exist at two primary architectural tiers: " +
          "**client-side in-process pools** (such as HikariCP in Java, " +
          "pg-pool in Node.js, and SQLAlchemy pool in Python) and **server-side " +
          "connection proxies** (such as PgBouncer for PostgreSQL and ProxySQL " +
          "for MySQL). The most counter-intuitive principle of pool sizing " +
          "is that **smaller pools yield higher throughput**. The PostgreSQL " +
          "and HikariCP project formula states: `connections = (cpu_cores * 2) + " +
          "effective_spindle_count`. A database server with 16 CPU cores " +
          "can only execute 16 instructions concurrently at any nanosecond. " +
          "When a pool provides 500 active connections, the operating system " +
          "kernel spends massive CPU cycles on thread context switching, " +
          "L1/L2 cache invalidation, and disk head thrashing rather than executing " +
          "SQL. In modern serverless architectures (AWS Lambda, Google Cloud Run), " +
          "stateless micro-containers cannot share client-side pools, quickly " +
          "spawning thousands of ephemeral connections that exhaust database " +
          "`max_connections`. Serverless systems must place a connection " +
          "multiplexer (e.g. AWS RDS Proxy, PgBouncer) in front of the database."
      },

      miss: [
        {
          w: "Setting the connection pool size to 500 will make the app handle more traffic.",
          r: "Oversized pools overwhelm the database CPU with context switching " +
            "and memory consumption. Smaller, tightly tuned pools maximize overall " +
            "throughput and minimize query latency."
        },
        {
          w: "Returning a connection to the pool closes the database socket.",
          r: "The physical TCP socket remains open and established. The pool manager " +
            "simply resets connection state (rolling back uncommitted transactions) " +
            "and marks it available for the next thread."
        },
        {
          w: "Serverless functions can use standard client-side connection pools.",
          r: "Every serverless instance creates its own isolated pool. When traffic " +
            "spikes to 1,000 concurrent functions, 1,000 separate pools instantly " +
            "exceed database server connection limits."
        },
        {
          w: "Connection leaks are automatically cleaned up by garbage collection.",
          r: "If an application thread borrows a connection and encounters an unhandled " +
            "exception without a `finally` block or context manager, the connection " +
            "remains permanently reserved until the application restarts."
        }
      ],

      trade: {
        buys: [
          "Eliminates the multi-millisecond overhead of TCP/TLS/auth handshakes per query.",
          "Acts as a protective bulkhead, preventing traffic surges from crashing the database.",
          "Enables instant query execution on pre-warmed, authenticated sockets.",
          "Monitors connection health and automatically heals broken database links."
        ],
        costs: [
          "Consumes constant server memory for holding idle connection threads open.",
          "Risk of application connection starvation if slow queries hold connections too long.",
          "Requires strict application hygiene to avoid connection leaks.",
          "Added architectural complexity when configuring serverless connection proxies."
        ],
        avoid: [
          "Holding borrowed connections open across long-running external HTTP API calls.",
          "Setting max pool size higher than the database server's hardware capacity.",
          "Omitting acquire timeouts, causing worker threads to hang indefinitely."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "optimistic-locking",

      why: {
        before: "Databases used pessimistic row locking (`SELECT FOR UPDATE`), " +
          "blocking all other readers and writers while waiting for application " +
          "logic or user input to complete.",
        problem: "Holding exclusive database row locks across human interactions " +
          "or distributed multi-step web flows causes massive lock contention, " +
          "blocks unrelated operations, and triggers systemic deadlocks.",
        shift: "**Optimistic Concurrency Control (OCC) with version checking.** " +
          "Assume conflicts are rare: allow concurrent reading and processing " +
          "without holding locks, and atomically verify at commit time that the " +
          "record was not modified by another process since it was read."
      },

      num: {
        t: "Concurrency control mechanisms comparison",
        h: ["Paradigm", "Locking Mechanism", "Contention Tolerance", "Typical Use Case"],
        r: [
          ["**Optimistic Locking (OCC)**", "**Zero database locks held; compares version column on UPDATE**", "**Excellent under low/moderate write contention**", "**Web forms, user profile updates, shopping cart checkout**"],
          ["**Pessimistic Locking**", "**Exclusive row locks held (`SELECT FOR UPDATE`)**", "**Excellent under heavy contention; prevents repeated aborts**", "**High-contention inventory decrement, bank account transfers**"],
          ["**Two-Phase Locking (2PL)**", "**Strict database-level growing/shrinking lock phases**", "**Ensures strict serializability, but vulnerable to deadlocks**", "**Relational database internal transaction engine (Repeatable Read/Serializable)**"],
          ["**Snapshot Isolation (MVCC)**", "**Readers see consistent historical snapshot; writers modify private copies**", "**Readers never block writers; writers only conflict on same-row writes**", "**PostgreSQL, MySQL InnoDB, Oracle default transactional model**"],
          ["**Distributed Lock (Redis/Zookeeper)**", "**Shared lease or token with TTL across microservices**", "**Moderate throughput; vulnerable to process pauses (GC/network)**", "**Orchestrating cron jobs, distributed workflow task assignment**"]
        ],
        n: "The technical mechanics of optimistic locking rely on an atomic " +
          "SQL condition. Every row contains a dedicated `version` integer " +
          "or timestamp column. When an application reads the record, it notes " +
          "its version (e.g. `version = 4`). When writing updates, the application " +
          "executes an atomic compare-and-swap update: `UPDATE accounts SET balance " +
          "= 150, version = version + 1 WHERE id = 101 AND version = 4`. If another " +
          "concurrent transaction updated the account in the interim, its version " +
          "became 5. The UPDATE query matches zero rows. The database driver " +
          "inspects the affected row count: if `affected_rows == 0`, the ORM or " +
          "application raises an `OptimisticLockException`. The application can " +
          "then reload the fresh record, notify the user of the conflicting " +
          "edit, or automatically retry the business logic. Because zero database " +
          "locks are held during user think time or network calls, optimistic " +
          "locking provides extraordinary horizontal scalability for read-heavy " +
          "and collaborative web applications."
      },

      miss: [
        {
          w: "Optimistic locking uses database locks under the hood.",
          r: "Optimistic locking holds zero database locks during the read and processing " +
            "phases. It relies solely on the atomicity of the single SQL UPDATE statement."
        },
        {
          w: "Optimistic locking is always superior to pessimistic locking.",
          r: "Under extreme write contention on a single row (e.g. concert ticket " +
            "booking for a viral show), optimistic locking triggers severe retry storms " +
            "and wasted computation. Pessimistic queuing is far more efficient here."
        },
        {
          w: "ACID database transactions make optimistic locking unnecessary.",
          r: "Database transactions cannot and should not be held open across multiple " +
            "HTTP requests while a human edits a web form. Optimistic locking spans " +
            "across disconnected web requests."
        },
        {
          w: "Timestamps are better version markers than integers.",
          r: "Clock drift, NTP adjustments, and sub-millisecond concurrent commits " +
            "can produce identical timestamps. A strictly incrementing integer counter " +
            "is mathematically immune to clock anomalies."
        }
      ],

      trade: {
        buys: [
          "Eliminates lock contention, thread blocking, and database deadlocks.",
          "Scales seamlessly across stateless, distributed web server fleets.",
          "Allows human think time across multi-step forms without exhausting connections.",
          "Protects against the classic 'lost update' concurrency anomaly."
        ],
        costs: [
          "Requires application logic to handle collision exceptions and coordinate retries.",
          "Wastes CPU and bandwidth on aborted updates when collisions do occur.",
          "Requires schema alterations to maintain version or timestamp columns.",
          "Degrades under high write contention into persistent retry failures."
        ],
        avoid: [
          "High-contention hot-spot rows (e.g. a single global counter or flash-sale inventory).",
          "Workloads where retrying an operation is impossible or financially dangerous.",
          "Batch processing systems performing bulk updates across millions of records."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "backup",

      why: {
        before: "Databases relied on physical disk redundancy (RAID) or " +
          "infrequent manual file copies saved to local disks.",
        problem: "Hardware crashes, storage corruption, ransomware attacks, " +
          "datacenter fires, and accidental human errors (`DROP TABLE` in " +
          "production) permanently destroy primary data. Without point-in-time " +
          "recovery, companies suffer catastrophic unrecoverable data loss.",
        shift: "**Continuous Write-Ahead Log (WAL) archiving paired with regular " +
          "physical base backups for Point-In-Time Recovery (PITR).** Combine " +
          "immutable offsite storage with automated, continuous delta replication, " +
          "enabling restoration to any exact microsecond before an incident occurred."
      },

      num: {
        t: "Database backup paradigms & recovery metrics",
        h: ["Backup Type", "Mechanism", "Recovery Time (RTO)", "Recovery Point (RPO)"],
        r: [
          ["**Logical Backup (`pg_dump`, `mysqldump`)**", "**Exports SQL DDL & DML statements; engine reconstructs schema from scratch**", "**Slow (hours/days for multi-TB datasets)**", "**Discrete snapshot time (loss since last dump)**"],
          ["**Physical Base Backup**", "**Direct copy of raw database data files and page blocks**", "**Fast (block transfer speed)**", "**Snapshot creation time**"],
          ["**Continuous WAL / Binlog Archiving**", "**Streams transaction log files immediately to object storage (S3/GCS)**", "**Enables Point-In-Time Recovery (PITR)**", "**Sub-second (only unstreamed log records lost)**"],
          ["**Storage Volume Snapshot (EBS/SAN)**", "**Copy-on-write block-level snapshot of underlying storage volume**", "**Fastest recovery (mount volume directly)**", "**Snapshot capture interval (e.g. hourly)**"],
          ["**Read Replica / Standby**", "**Streaming replication to live secondary server**", "**Near-zero RTO (instant failover)**", "**NOT a backup: replicates accidental `DROP TABLE` in milliseconds**"]
        ],
        n: "In enterprise disaster recovery, backup strategies are defined " +
          "by two non-negotiable metrics: **RPO (Recovery Point Objective)**, " +
          "the maximum acceptable age of data that can be permanently lost, " +
          "and **RTO (Recovery Time Objective)**, the maximum acceptable " +
          "downtime required to restore service. The gold standard for database " +
          "backup is **Point-In-Time Recovery (PITR)**. PITR works by taking " +
          "a weekly or daily physical base backup, and continuously streaming " +
          "every Write-Ahead Log (WAL in Postgres) or binary log (Binlog in " +
          "MySQL) to an isolated, immutable object storage bucket (e.g. AWS " +
          "S3 with Object Lock). If an engineer accidentally drops a customer " +
          "table at 14:23:05, the recovery system restores the latest base " +
          "backup and replays the WAL segments sequentially, stopping at " +
          "exactly 14:23:04.999999. The single most critical operational " +
          "doctrine in systems engineering is: **an untested backup does " +
          "not exist**. Real disaster recovery requires automated, weekly " +
          "restore verification drills that spin up isolated staging databases " +
          "from backup archives and execute validation test suites."
      },

      miss: [
        {
          w: "Database replication (primary-replica) replaces the need for backups.",
          r: "Replication copies all operations immediately. If an engineer or " +
            "compromised service account executes `DROP DATABASE`, the command " +
            "replicates to all standbys within milliseconds. Backups preserve history."
        },
        {
          w: "RAID disk arrays provide database disaster recovery.",
          r: "RAID protects against single disk hardware failures, not software " +
            "bugs, data corruption, ransomware, accidental deletions, or datacenter destruction."
        },
        {
          w: "Logical SQL dumps are appropriate for enterprise-scale databases.",
          r: "Restoring a 5 Terabyte SQL text dump via `INSERT` statements requires " +
            "rebuilding every B-Tree index from scratch, taking days of downtime. " +
            "Physical block backups are mandatory for large datasets."
        },
        {
          w: "If the backup script reports exit code 0, the backup is secure.",
          r: "Backups frequently fail silently due to corrupt archive headers, " +
            "unreadable encryption keys, or missing dependent WAL logs. Only " +
            "regular automated restore tests prove backup integrity."
        }
      ],

      trade: {
        buys: [
          "Guarantees business survival against catastrophic hardware, human, or security disasters.",
          "Point-In-Time Recovery enables rolling back to the exact second before data loss.",
          "Satisfies legal, contractual, and regulatory compliance standards (SOC2, HIPAA, ISO).",
          "Enables staging environment generation with realistic production schemas."
        ],
        costs: [
          "Storage costs for retaining full snapshots and continuous WAL transaction streams.",
          "Network egress bandwidth when replicating backups to offsite geographic regions.",
          "CPU and disk I/O overhead on the primary database during snapshot generation.",
          "Operational maintenance required to manage encryption keys and automated restore drills."
        ],
        avoid: [
          "Storing backup archives on the same physical server or cloud account as primary data.",
          "Relying on unencrypted backup files stored in public or poorly restricted buckets.",
          "Going months without executing an end-to-end disaster recovery restore drill."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
