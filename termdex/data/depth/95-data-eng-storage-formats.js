/* ==========================================================================
   Depth pass 95 — Data Engineering batch 3: Modern Lakehouse, Formats & Observability.
   Lakehouse, Parquet, Avro, Partitioning,
   Change Data Capture, Data Quality, Data Lineage.

   Open table transaction logs bring ACID guarantees to cloud object lakes;
   columnar metadata encodings prune irrelevant row groups prior to disk reads.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "lakehouse",

      why: {
        before: "Organizations maintained two separate, disconnected data architectures: a low-cost, open data lake (for machine learning and raw data) and an expensive, proprietary data warehouse (for fast BI and SQL), requiring complex ETL pipelines to copy data back and forth.",
        problem: "Dual architectures caused massive data duplication, high storage costs, data drift between the lake and warehouse, and stale BI dashboards, while data lakes lacked ACID transactions and row-level updates.",
        shift: "**Lakehouse: A unified modern data architecture that implements data warehouse capabilities (ACID transactions, schema enforcement, time travel, indexing) directly on low-cost, open cloud object storage.** Enabled by open table formats: Delta Lake, Apache Iceberg, and Apache Hudi."
      },

      num: {
        t: "Open Table Formats Powering the Modern Lakehouse Architecture",
        h: ["Table Format", "Transaction Mechanism", "Metadata Structure", "Partition Evolution?", "Ecosystem Alignment"],
        r: [
          ["Delta Lake (Databricks)", "JSON transaction log (`_delta_log/`) + Parquet checkpoints", "Monotonically increasing commit files", "Supported via column mapping", "Native Databricks, Spark, Trino, Flink"],
          ["Apache Iceberg (Netflix)", "Tree of Snapshot / Manifest list / Manifest files (Avro)", "Hierarchical multi-level metadata tree", "Full in-place partition evolution", "Snowflake, BigQuery, AWS Athena, Trino"],
          ["Apache Hudi (Uber)", "Timeline metadata + Write-ahead log", "Timeline events + Key-value indexing", "Limited partition evolution", "Optimized for fast streaming upserts & CDC"]
        ],
        n: "A Lakehouse eliminates the dual-system architecture by adding a **Transactional Metadata Layer** directly on top of open Parquet files stored in cloud object storage (S3, GCS, ADLS). In formats like **Apache Iceberg**, a table's state is modeled not as a physical directory of files, but as a pointer to a **Metadata File** ($M_t$). $M_t$ points to a **Manifest List** of snapshots, which points to **Manifest Files** containing exact file paths, partition specifications, and column-level summary statistics (min/max bounds). Writes achieve **ACID guarantees** via optimistic concurrency control (OCC): when a transaction commits, it atomically swaps the metadata pointer. This enables: (1) **ACID Transactions**: multi-table atomic commits, (2) **Time Travel**: querying historical snapshots `AS OF TIMESTAMP`, and (3) **Hidden Partitioning**: updating partition schemes without rewriting existing data files."
      },

      miss: [
        {
          w: "A Lakehouse is just a data lake with a marketing name.",
          r: "A traditional data lake has no transaction log, no ACID guarantees, and no row-level updates (modifying one row requires rewriting entire directories). A Lakehouse implements true ACID transactions, concurrent writes, point-in-time time travel, and metadata pruning directly on object storage."
        },
        {
          w: "Lakehouses are slow for BI queries and can never match data warehouses.",
          r: "Modern Lakehouse engines (Databricks Photon, Trino, Snowflake Iceberg tables) execute vectorized C++ query engines against Parquet files, matching or exceeding traditional proprietary data warehouse speeds on TPC-DS benchmarks."
        },
        {
          w: "Using Delta Lake or Iceberg locks you into a proprietary vendor ecosystem.",
          r: "Delta Lake and Apache Iceberg are 100% open-source, vendor-neutral Linux Foundation and Apache Software Foundation projects. An Iceberg table written by Spark in AWS can be queried simultaneously by Snowflake, Trino, and BigQuery without moving a single byte."
        },
        {
          w: "A lakehouse does not need compaction or vacuuming maintenance.",
          r: "Frequent upserts and streaming writes generate thousands of small Parquet files and orphaned historical snapshots. Production lakehouses require automated maintenance jobs to compact small files and run `VACUUM` to delete expired snapshots."
        }
      ],

      trade: {
        buys: [
          "Single source of truth: eliminates copying data back and forth between a separate lake and warehouse.",
          "Open standard storage: data is stored in open Parquet/ORC formats on cheap cloud object storage, eliminating vendor lock-in.",
          "Full ACID transactional guarantees: supports concurrent readers and writers, updates, deletes, and time travel.",
          "Direct AI/ML support: data scientists and LLM pipelines read the exact same governed tables used by SQL business analysts."
        ],
        costs: [
          "Table maintenance overhead: requires scheduled compaction, metadata indexing, and vacuuming to prevent performance degradation.",
          "Governance complexity: managing fine-grained row- and column-level security across disparate query engines requires a unified catalog (e.g., Unity Catalog, Polaris).",
          "Format divergence: subtle operational differences between Iceberg, Delta Lake, and Hudi can create interoperability friction.",
          "High concurrency point-lookups are still slower than dedicated, specialized operational memory caches (Redis)."
        ],
        avoid: [
          "Never perform continuous streaming writes into a lakehouse without automated small-file compaction (Auto-Compaction/Bin-Packing).",
          "Do not forget to schedule regular `VACUUM` commands to remove unreferenced historical data files and control storage costs.",
          "Avoid running conflicting concurrent DDL schema changes without verifying catalog transaction isolation levels."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "parquet",

      why: {
        before: "Big data systems stored tabular datasets in human-readable text formats (CSV, TSV, JSON), requiring query engines to parse every character, split strings, and scan every single column from disk, saturating storage bandwidth.",
        problem: "Analytical queries typically ask for only 3 to 5 columns out of a 100-column table; row-based text files force the storage subsystem to read 100% of the data across all 100 columns, wasting 95% of I/O throughput.",
        shift: "**Apache Parquet: An open-source, columnar storage file format optimized for deep analytical query performance, efficient data compression, and complex nested data structures.** Created jointly by Twitter and Cloudera in 2013 (inspired by Google's Dremel paper), Parquet became the universal storage standard for modern data engineering."
      },

      num: {
        t: "Storage Format Comparison: CSV vs JSON vs Avro vs Parquet on 100M Tabular Records",
        h: ["Format", "Storage Orientation", "File Size on Disk", "Scan Time (3 of 50 cols)", "Schema Enforcement"],
        r: [
          ["CSV (Uncompressed)", "Row-oriented text", "18.5 GB", "38.2 seconds", "None (brittle string parsing)"],
          ["JSON (Uncompressed)", "Row-oriented semi-structured", "24.2 GB", "52.4 seconds", "Implicit / Dynamic"],
          ["Apache Avro (Snappy)", "Row-oriented binary", "4.1 GB", "14.5 seconds", "Strict JSON schema required"],
          ["Apache Parquet (Snappy/ZSTD)", "Columnar binary chunked", "1.2 GB (15x smaller)", "0.8 seconds (47x faster)", "Self-describing binary metadata footer"]
        ],
        n: "Parquet achieves extreme efficiency through a hierarchical physical layout: **File $\\rightarrow$ Row Groups $\\rightarrow$ Column Chunks $\\rightarrow$ Data Pages**. Within each Page, values are stored strictly by column. This layout provides three performance breakthroughs: (1) **Projection Pushdown (Column Pruning)**: The query engine reads only the byte offsets corresponding to the requested columns, skipping un-queried columns entirely. (2) **Predicate Pushdown (Row Group Skipping)**: Parquet's **File Footer** stores min/max statistics for every column in every Row Group. A query with `WHERE age > 65` skips entire row groups where $\\max(\\text{age}) \\le 65$ without reading a single data page. (3) **Dremel Record Shredding**: Encodes deeply nested JSON hierarchies into flat columns using **Definition Levels** and **Repetition Levels** without flattening or losing structural fidelity."
      },

      miss: [
        {
          w: "Parquet is an optimal format for high-speed transactional row inserts (OLTP).",
          r: "Parquet is strictly an **immutable, columnar analytical format**. Appending or modifying a single row requires constructing row groups, compressing columnar pages, and writing a new file footer, making it terrible for row-by-row transactional workloads."
        },
        {
          w: "Parquet requires an external database or catalog to read its schema.",
          r: "Parquet is entirely **self-describing**. The schema, column data types, row group byte offsets, and column statistics are stored directly inside the binary **File Footer** at the end of the file."
        },
        {
          w: "All Parquet files should be as large as possible (e.g., 50 GB per file).",
          r: "Massive 50 GB Parquet files destroy distributed parallel reading, while millions of tiny 2 MB files trigger extreme metadata overhead. The optimal sweet spot for Parquet files is **128 MB to 512 MB**."
        },
        {
          w: "Parquet files are human-readable with standard shell tools like `cat` or `head`.",
          r: "Parquet is a binary format with dictionary and bit-packing encodings; viewing contents requires specialized CLI tools (`parquet-tools`, `duckdb`, or Python `pyarrow`)."
        }
      ],

      trade: {
        buys: [
          "Massive disk space savings: columnar compression (Snappy, ZSTD, dictionary encoding) reduces raw data volume by 70% to 90%.",
          "Ultra-fast query execution: projection pushdown and row-group predicate pruning reduce I/O by orders of magnitude.",
          "Self-describing schema: encodes exact column types, documentation, and min/max statistics within the file footer.",
          "Universal ecosystem support: natively read and written by Spark, DuckDB, Trino, Snowflake, BigQuery, and Pandas."
        ],
        costs: [
          "Immutable and write-expensive: cannot perform in-place row updates without rewriting the entire file.",
          "Binary opacity: cannot be inspected using standard UNIX text tools (`grep`, `awk`, `cat`) without specialized utilities.",
          "Write latency: compressing and encoding columnar row groups requires significant CPU and memory overhead during ingestion.",
          "Sensitive to file sizing: performance degrades if files are too small (<10MB) or excessively massive (>2GB)."
        ],
        avoid: [
          "Never write uncompressed Parquet; always enable standard Snappy or ZSTD compression.",
          "Do not write thousands of tiny Parquet files from streaming jobs without automated compaction.",
          "Avoid using Parquet for transactional message queues or logging sinks; use Avro or Kafka."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "avro",

      why: {
        before: "Transmitting streaming events and RPC payloads across distributed systems relied on XML or JSON, which bloated network bandwidth with repeated schema keys and lacked strict schema enforcement.",
        problem: "In high-throughput event-driven architectures (Kafka), writing full schema strings on every individual message wastes massive network bandwidth, while schema changes break downstream consumers.",
        shift: "**Apache Avro: A compact, fast, binary row-oriented data serialization framework featuring rich schema evolution defined in JSON.** Designed by Doug Cutting in 2009 for the Hadoop ecosystem, Avro became the undisputed standard for event streaming message serialization."
      },

      num: {
        t: "Serialization Format Profiles: Serialization Latency, Payload Size & Schema Evolution",
        h: ["Format", "Data Model", "Payload Overhead (1k JSON event)", "Schema Evolution Support", "Primary Ecosystem"],
        r: [
          ["JSON (Text)", "Row-oriented key-value text", "~1,024 bytes (100% baseline)", "Implicit / brittle (breaks on types)", "Web REST APIs, browser frontends"],
          ["Protocol Buffers (Protobuf)", "Binary positional fields", "~180 bytes", "Tag-based numbered backward/forward", "gRPC microservice communication"],
          ["Apache Avro", "Binary row with Confluent Schema ID", "~140 bytes (plus 5-byte schema header)", "Rigid schema evolution with Confluent Registry", "Apache Kafka, event streaming, CDC"],
          ["Apache Parquet", "Columnar chunked binary", "~160 bytes (inefficient on single rows)", "Row-group metadata evolution", "Analytical data lakes, batch warehouses"]
        ],
        n: "Apache Avro relies on a strict separation between schema definition and binary payload. An Avro schema is defined as a declarative JSON document specifying namespaces, record names, and typed fields. During serialization, Avro does not include field names or data types inside the message payload; it writes raw, compact binary data in exact schema order. In **Apache Kafka**, Avro is paired with the **Confluent Schema Registry**: the producer registers the schema once with the registry, receiving a 4-byte integer `Schema_ID`. The producer prepends a 5-byte header (`0x00` magic byte + `Schema_ID`) to the binary payload. Consumers read the 5-byte header, fetch the schema from the registry cache, and deserialize the payload, eliminating schema bloat while guaranteeing mathematical backward/forward compatibility."
      },

      miss: [
        {
          w: "Avro and Parquet are direct competitors designed for the same use case.",
          r: "Avro is **row-oriented** and optimized for streaming, row-by-row serialization, and transactional message passing (Kafka). Parquet is **columnar** and optimized for large-scale analytical batch scans and aggregate queries in data lakes. They complement each other in modern data stacks."
        },
        {
          w: "Avro files require an external schema registry to be read.",
          r: "Standard standalone Avro container files (`.avro`) embed the complete JSON schema directly inside the file's binary header, making individual files 100% self-describing without any external network dependency."
        },
        {
          w: "Any field can be deleted from an Avro schema without breaking consumers.",
          r: "Deleting a field or altering a type without a default value breaks backward/forward schema compatibility. Schema evolution rules require adding fields with `default` values to preserve compatibility across producer/consumer versions."
        },
        {
          w: "Avro serialization is human-readable.",
          r: "Avro is a pure binary format; attempting to view raw Avro files in a text editor outputs unreadable binary bytes. Parsing requires schema-aware tools (`avro-tools` or language SDKs)."
        }
      ],

      trade: {
        buys: [
          "Ultra-compact binary serialization: strips redundant field names, reducing streaming message payload sizes by up to 80%.",
          "Robust schema evolution: formal rules (FULL, BACKWARD, FORWARD) prevent producers from breaking downstream consumers.",
          "High serialization velocity: row-oriented binary encoding is extremely fast to serialize and deserialize on CPU.",
          "Self-contained container files: standalone Avro files embed schema in the header, ensuring long-term archival readability."
        ],
        costs: [
          "Inefficient for analytical scans: being row-oriented, querying 2 columns requires scanning all columns across all records.",
          "Requires external infrastructure: production Kafka deployments require running and monitoring a Confluent Schema Registry.",
          "Binary opacity: requires dedicated tooling to inspect or debug messages compared to plain JSON.",
          "Steep learning curve: developers must learn formal Avro JSON schema syntax and compatibility enforcement modes."
        ],
        avoid: [
          "Never use Avro for multi-terabyte analytical warehouse scans where Parquet is orders of magnitude faster.",
          "Do not introduce schema changes to Kafka topics without verifying compatibility in your CI/CD pipeline.",
          "Avoid using JSON serialization in high-throughput Kafka production topics when Avro cuts network bandwidth by 70%."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "partitioning",

      why: {
        before: "Query engines evaluating queries like `SELECT * FROM sales WHERE date = '2024-05-01'` had to perform exhaustive full-table scans across terabytes of data on disk, reading years of irrelevant historical data to find a single day's records.",
        problem: "As datasets scale to billions of rows, scanning entire tables for daily reports exhausts disk I/O, spikes cloud compute costs, and degrades query latency from seconds to hours.",
        shift: "**Partitioning: The physical division of a massive database or data lake table into smaller, distinct storage segments based on the values of one or more coarse-grained partition keys (e.g., date, region).** Enables **Partition Pruning**, allowing query engines to skip reading un-queried directories entirely."
      },

      num: {
        t: "Partitioning Strategies Across Modern Data Systems: Mechanics & Pruning",
        h: ["Strategy", "Key Granularity", "Storage Organization", "Pruning Mechanism", "Primary Risk"],
        r: [
          ["Date/Time (Directory-Based)", "Year / Month / Day", "Nested directories: `/year=2024/month=05/`", "Engine skips directory paths via file listing", "Over-partitioning (millions of small files)"],
          ["Hash Partitioning", "Hash modulus $h(k) \\pmod N$", "Even distribution across $N$ physical shards", "Direct shard key routing", "Uneven data skew if keys cluster"],
          ["List / Category", "Discrete regions (e.g., Country, Tenant)", "Isolated storage buckets per tenant", "Selective file paths", "Data imbalance (e.g., US has 100x rows of NZ)"],
          ["Hidden Partitioning (Iceberg)", "Temporal transform `day(timestamp)`", "Logical metadata manifest pruning", "Evaluates manifest file bounds without directory paths", "Requires Iceberg/Delta engine support"],
          ["Micro-Clustering (Snowflake)", "Automatic 16MB columnar chunks", "Internally managed continuous metadata ranges", "Clustering depth pruning", "Re-clustering compute maintenance cost"]
        ],
        n: "Partitioning translates a logical table $T$ into physical sub-directories on disk: $\\text{Path} = \\text{Base} / k_1 = v_1 / k_2 = v_2 / \\dots / \\text{data.parquet}$. When an analytical SQL query specifies a filter predicate on the partition key ($P(k_1) = \\text{true}$), the query planner executes **Partition Pruning**: it evaluates directory paths or metadata manifests and completely omits non-matching storage paths from the physical execution scan plan. For example, in a 10-year dataset, querying a single date partition prunes $\\approx 99.97\\%$ of data volume, reducing query runtime and cloud scan bills proportionally. However, choosing a partition key with excessively high cardinality (e.g., `user_id` or `timestamp` down to the second) leads to **Over-Partitioning**, creating millions of microscopic files that paralyze query planners with directory listing latency."
      },

      miss: [
        {
          w: "Partitioning on every available dimension (date, country, department, user) maximizes query performance.",
          r: "Multi-level over-partitioning is one of the most common data engineering failures. It fragments data into millions of tiny files (<1MB), destroying columnar compression and overwhelming metadata catalogs and object storage API rate limits."
        },
        {
          w: "Partitioning and Clustering are the exact same concept.",
          r: "Partitioning physically splits data into separate storage directories/files based on coarse keys (e.g., date). **Clustering** sorts rows *within* those physical files based on fine-grained keys (e.g., `customer_id`), enabling row-group min/max skipping inside files."
        },
        {
          w: "Updating a partition key column in an existing row is a cheap metadata operation.",
          r: "Because directory paths physically correspond to partition key values, updating a row's partition key requires physically deleting the row from one file/directory, re-writing it into another directory, and updating metadata logs."
        },
        {
          w: "Querying a partitioned table is always faster than an unpartitioned table.",
          r: "If a query does not include the partition key in its `WHERE` clause, the engine must inspect every single partition directory. Having thousands of partition directories makes an unpruned query *slower* than scanning a single consolidated table."
        }
      ],

      trade: {
        buys: [
          "Massive query acceleration: partition pruning eliminates reading 90% to 99%+ of disk data for filtered queries.",
          "Drastic cloud cost reduction: reduces scanned bytes on query-based pricing engines (BigQuery, Athena, Snowflake).",
          "Simplified data lifecycle management: expiring or deleting historical data (e.g., dropping data older than 7 years) is an instant directory drop.",
          "Enables fine-grained parallel processing: distributed engines assign individual partitions to independent worker tasks."
        ],
        costs: [
          "Over-partitioning hazard: choosing high-cardinality keys creates millions of tiny files that crash query planners.",
          "Data skew risk: partitioning on skewed keys (e.g., country) results in massive 'hotspot' partitions while others sit empty.",
          "Partition evolution friction: in traditional Hive-style lakes, altering partition schemes requires rewriting the entire historical dataset.",
          "Unpruned query penalty: queries omitting the partition key incur extra metadata listing latency across all directories."
        ],
        avoid: [
          "Never partition on high-cardinality columns like `user_id`, `order_id`, or fine-grained timestamps.",
          "Do not create partitions that contain less than 100MB of data on average.",
          "Avoid multi-level partitioning (e.g., year/month/day/hour) unless data volume exceeds multiple terabytes per day."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "change-data-capture",

      why: {
        before: "Synchronizing data from operational databases (PostgreSQL, MySQL) to data warehouses relied on periodic batch queries (`SELECT * WHERE updated_at > last_sync`), which placed heavy read locks on production databases and failed to detect deleted rows.",
        problem: "Polling batch syncs introduce hours of data latency, miss hard deletes (`DELETE FROM table`), and place massive CPU spikes on production transactional databases during peak business hours.",
        shift: "**Change Data Capture (CDC): The process of observing, identifying, and streaming row-level insert, update, and delete events directly from a database's low-level transaction log (write-ahead log/binlog).** Powered by Debezium, Kafka Connect, and AWS DMS, enabling sub-second, zero-impact real-time database replication."
      },

      num: {
        t: "CDC Methodologies: Latency, Production Overhead & Delete Detection",
        h: ["CDC Methodology", "Mechanism", "Impact on Source DB", "Captures Hard Deletes?", "Replication Latency"],
        r: [
          ["Query Polling (`updated_at`)", "Periodic `SELECT` scans on indexed timestamp", "High (frequent table scan queries)", "No (deleted rows disappear)", "Minutes to hours"],
          ["Database Triggers", "Triggers write changes to shadow audit table", "High (adds overhead to every write transaction)", "Yes (captures `BEFORE DELETE`)", "Near real-time"],
          ["Log-Based CDC (Debezium / Binlog)", "Tails the physical WAL / Binlog stream directly", "Negligible (reads append-only disk log)", "Yes (reads raw `DELETE` log events)", "Sub-second (< 500 ms)"],
          ["Database Native Replication", "Postgres Logical Replication / MySQL GTID", "Very Low (native storage engine protocol)", "Yes", "Sub-second (< 200 ms)"]
        ],
        n: "Modern Change Data Capture operates at the storage engine layer via **Log-Based CDC**. Every relational database writes all mutations to an append-only transaction log—the **Write-Ahead Log (WAL)** in PostgreSQL, or the **Binlog** in MySQL—before applying changes to data pages on disk. CDC engines (such as **Debezium**) act as logical replication consumers: they tail the binary log sequentially without executing SQL queries against table data pages. When a transaction commits, the CDC engine decodes the binary log event into a structured JSON/Avro payload containing: (1) `op`: operation type (`c`=create, `u`=update, `d`=delete), (2) `before`: full row state prior to mutation, (3) `after`: full row state following mutation, and (4) `source`: commit timestamp, transaction ID, and LSN (Log Sequence Number)."
      },

      miss: [
        {
          w: "CDC polling with `updated_at` timestamps is just as good as log-based CDC.",
          r: "Timestamp polling cannot capture hard deletes (a deleted row is physically gone and cannot be queried), misses intermediate updates between poll intervals, and requires adding indexes and write locks to operational production tables."
        },
        {
          w: "Tailing the database transaction log impacts the performance of production web apps.",
          r: "Log-based CDC reads sequentially from the append-only WAL on disk (or memory buffer) using native replication protocols. It executes zero SQL queries against the database engine, resulting in negligible (<1%) overhead on production OLTP operations."
        },
        {
          w: "CDC events can be applied directly to a data warehouse without deduplication.",
          r: "In distributed networks, CDC events are delivered with **at-least-once** guarantees. Applying CDC streams directly to an analytical warehouse requires deduplication and `MERGE INTO` logic using the primary key and LSN sequence order."
        },
        {
          w: "CDC automatically captures historical data from before CDC was enabled.",
          r: "The WAL contains only recent un-purged transaction logs. Bootstrapping CDC requires an **initial snapshot phase**—performing a consistent read of the entire existing database state before transitioning seamlessly into continuous WAL streaming."
        }
      ],

      trade: {
        buys: [
          "Sub-second data replication: streams operational database mutations into analytics stores in real time.",
          "Near-zero impact on source database: reading the write-ahead log avoids expensive SQL scan queries and table locks.",
          "Full fidelity event capture: captures every intermediate update and hard delete with exact before/after state.",
          "Enables event-driven microservices, real-time cache invalidation, search index syncing (Elasticsearch), and audit logging."
        ],
        costs: [
          "High operational complexity: requires managing Kafka Connect clusters, schema registries, and replication slots.",
          "Replication slot danger: if the CDC consumer falls behind, the source database cannot truncate its WAL, risking disk exhaustion.",
          "Downstream merge complexity: merging high-frequency updates and deletes into an analytical warehouse requires expensive `MERGE` operations.",
          "Schema evolution coordination: alters in upstream database schemas must be synchronized with downstream consumers."
        ],
        avoid: [
          "Never deploy PostgreSQL CDC without monitoring `pg_replication_slots` disk size to prevent production DB disk full outages.",
          "Do not rely on `updated_at` polling if capturing record deletions is a strict business requirement.",
          "Avoid applying individual CDC row events to a data warehouse one-by-one; micro-batch CDC events into staging tables."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-quality",

      why: {
        before: "Organizations discovered corrupted data, duplicate records, and broken schemas only when C-suite executives noticed broken numbers on production BI dashboards, destroying trust in data analytics.",
        problem: "Data pipelines break silently; a silent upstream API change or unannounced database migration sends null values into revenue columns, propagating undetected through pipelines and poisoning business decisions.",
        shift: "**Data Quality: The systematic assessment, validation, and enforcement of data integrity across six foundational dimensions: Accuracy, Completeness, Consistency, Timeliness, Validity, and Uniqueness.** Automated via assertion frameworks (Great Expectations, dbt tests, Soda)."
      },

      num: {
        t: "The Six Foundational Dimensions of Data Quality & Implementation Patterns",
        h: ["Dimension", "Core Definition", "SQL / Assertion Test Pattern", "Typical Failure Scenario", "Circuit-Breaker Action"],
        r: [
          ["Completeness", "Absence of missing / null values in mandatory fields", "`assert count(id is null) == 0`", "Upstream form change sends blank email fields", "Halt downstream table load"],
          ["Uniqueness", "Absence of duplicate entities or records", "`assert count(id) == count(distinct id)`", "Network retry duplicates invoice records", "Route duplicates to dead-letter queue"],
          ["Validity", "Conformance to business syntax, types, and ranges", "`assert age between 0 and 125`", "Sensor transmits corrupted temperature reading -999", "Quarantine invalid rows"],
          ["Consistency", "Agreement of facts across disparate systems", "`assert sum(orders.total) == sum(payments.amount)`", "Race condition causes order without payment record", "Alert analytics on-call engineer"],
          ["Timeliness", "Freshness of data relative to business SLA", "`assert max(event_time) >= now() - interval '1 hour'`", "Airflow DAG hung silently overnight", "Trigger PagerDuty incident"],
          ["Accuracy", "Conformity to real-world ground truth", "Cross-system auditing / statistical anomaly detection", "Currency conversion miscalculates EUR to USD", "Block downstream financial reporting"]
        ],
        n: "Modern data quality transforms testing from passive post-hoc auditing into an active **Circuit Breaker** integrated directly into CI/CD and production orchestration. In frameworks like **Great Expectations** or **dbt tests**, tests are formulated as programmatic assertions evaluated against datasets during pipeline execution: $\\text{Validation}(D) = \\bigwedge_{i=1}^M \\text{Assertion}_i(D) \\in \\{\\text{Pass}, \\text{Fail}\\}$. In modern **Write-Audit-Publish (WAP)** design patterns: (1) Ingestion writes data to an isolated staging partition (Write). (2) Automated data quality assertions evaluate completeness, distribution drift, and referential integrity (Audit). (3) Only if all tests pass is the partition atomically published to production tables (Publish); otherwise, the pipeline halts and alerts on-call engineers."
      },

      miss: [
        {
          w: "Data quality testing is solely the responsibility of the data analytics team.",
          r: "Data quality is an end-to-end enterprise responsibility. The root causes of 80% of data quality issues originate upstream in application code, product database migrations, and changing front-end forms. Modern teams establish **Data Contracts** with software engineering teams."
        },
        {
          w: "Data quality testing once a week on the production database is sufficient.",
          r: "Weekly testing means corrupted data circulates through production dashboards and ML models for up to 7 days before detection. Assertions must be executed continuously at the moment of ingestion before publishing."
        },
        {
          w: "Writing 100% test coverage for every column in every table is best practice.",
          r: "Over-testing leads to test alert fatigue and bloated pipeline runtimes. Focus strict blocking assertions on critical primary keys, financial metrics, and foreign key relationships, using statistical anomaly detection for non-critical columns."
        },
        {
          w: "If a data quality test fails, the pipeline must immediately drop the entire batch.",
          r: "Dropping entire batches can halt mission-critical operational reporting. Best practice employs **Quarantine / Dead-Letter Queues**: isolating only the corrupted records for review while allowing the 99.9% clean records to proceed downstream."
        }
      ],

      trade: {
        buys: [
          "Guarantees trust and credibility: prevents corrupted or misleading numbers from ever reaching executive dashboards.",
          "Circuit breaker protection: stops upstream schema breakages from poisoning historical production tables.",
          "Rapid root-cause diagnosis: precise assertion failures pinpoint the exact corrupted column and row IDs in minutes.",
          "Enforces formal Data Contracts between upstream application software engineers and downstream data consumers."
        ],
        costs: [
          "Pipeline execution latency: executing hundreds of complex assertion queries adds minutes to pipeline runtimes.",
          "Alert fatigue risk: poorly calibrated tests (e.g., rigid row count checks) trigger false alarms and desensitize teams.",
          "Engineering maintenance: tests must be continually updated as business rules and schema definitions evolve.",
          "Storage overhead for maintaining quarantine tables, dead-letter queues, and audit log histories."
        ],
        avoid: [
          "Never publish data directly into production gold tables without automated uniqueness and null checks.",
          "Do not hardcode fragile static thresholds (e.g., `row_count > 10000`) for metrics with natural holiday seasonality.",
          "Avoid ignoring data quality alerts; establish strict on-call SLAs to triage and remediate test failures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-lineage",

      why: {
        before: "When a metric on an executive dashboard appeared incorrect or a source database table was renamed, data engineers spent days manually searching through hundreds of SQL scripts, Airflow DAGs, and stored procedures to figure out where the data came from and what would break.",
        problem: "Enterprise data stacks contain thousands of interconnected tables, transformations, and dashboards; changing an upstream column without knowing downstream dependencies causes widespread silent dashboard breakages.",
        shift: "**Data Lineage: The complete, auditable lifecycle tracking of data origins, transformations, movements, and downstream consumption across an enterprise data estate.** Standardized via OpenLineage and metadata engines (dbt docs, Marquez, Monte Carlo, Atlan)."
      },

      num: {
        t: "Data Lineage Granularity Levels: Technical Implementation & Capabilities",
        h: ["Granularity Level", "Tracking Mechanism", "Technical Complexity", "Engineering Utility", "Regulatory / Audit Value"],
        r: [
          ["System / Job Level", "Orchestrator task tracking (Airflow / Dagster)", "Low (monitors job inputs/outputs)", "Pipeline failure impact & retry planning", "Basic operational tracking"],
          ["Dataset / Table Level", "SQL AST parsing (`FROM` and `JOIN` clauses)", "Moderate (parses table references)", "Visualizing macro table dependency DAGs", "GDPR compliance / dataset deprecation"],
          ["Column Level Lineage (CLL)", "Deep AST syntax parsing + alias tracing", "High (traces column derivations and math)", "Root-cause debugging & upstream impact analysis", "Mandatory for BCBS 239 banking audits"],
          ["Runtime / Data Observability", "OpenLineage API events emitted during execution", "Very High (real-time telemetry metadata)", "Pinpoints exact job runs causing silent data corruption", "Complete end-to-end provenance audit"]
        ],
        n: "Data Lineage is mathematically represented as a directed bipartite graph: $G = (V_{\\text{datasets}} \\cup V_{\\text{jobs}}, E)$, where directed edges represent data flow: a job consumes input datasets ($D_{\\text{in}} \\rightarrow J$) and produces output datasets ($J \\rightarrow D_{\\text{out}}$). In modern **Column-Level Lineage (CLL)**, lineage engines parse the Abstract Syntax Tree (AST) of SQL queries using parsers like `sqlglot`. The engine traces every derived column back to its original source root: if `revenue = quantity * unit_price`, the lineage graph records: $\\{\\text{orders.quantity}, \\text{orders.unit_price}\\} \\rightarrow \\text{marts.revenue}$. Standardized protocols like **OpenLineage** define a universal JSON specification for runtime lineage events (`START`, `RUNNING`, `COMPLETE`, `FAIL`), emitted by Spark listeners, Airflow plugins, and dbt artifacts into a centralized metadata lake."
      },

      miss: [
        {
          w: "Data lineage can be reliably maintained by hand using documentation wikis or Excel sheets.",
          r: "Manual lineage documentation is obsolete the day it is written. Modern enterprise pipelines change daily; lineage must be generated **automatically** by parsing SQL queries, code repositories, and runtime execution logs."
        },
        {
          w: "Table-level lineage is sufficient for operational data engineering.",
          r: "Table-level lineage only tells you that Table B reads from Table A. If Table A has 200 columns and you want to deprecate column `tax_rate`, table lineage cannot tell you if `tax_rate` is actually used. **Column-Level Lineage (CLL)** is essential."
        },
        {
          w: "Data lineage is only useful for compliance auditors and regulators.",
          r: "Lineage is a primary productivity tool for data engineers: it enables **Impact Analysis** (seeing what breaks before modifying a column) and **Root-Cause Analysis** (tracing a broken dashboard number back to the exact failing upstream task)."
        },
        {
          w: "Data lineage can trace data flow across external non-SQL black boxes automatically.",
          r: "If data passes through an arbitrary Python script using un-typed HTTP requests or opaque C++ binaries, automated AST parsers cannot infer column lineage unless developers explicitly emit OpenLineage telemetry events."
        }
      ],

      trade: {
        buys: [
          "Instantaneous impact analysis: verify exactly which dashboards and downstream models will break before altering a schema.",
          "Rapid root-cause triage: trace a corrupted dashboard metric back through 15 transformation layers to the source table in seconds.",
          "Regulatory compliance: essential for GDPR 'Right to be Forgotten' (tracking all locations where a user's PII resides) and BCBS 239.",
          "Accelerates legacy migrations: enables safe deprecation of unused tables and redundant legacy pipeline transformations."
        ],
        costs: [
          "High parsing complexity: extracting accurate column-level lineage from dynamic SQL, window functions, and UDFs is difficult.",
          "Integration maintenance: requires maintaining instrumentation plugins across orchestrators, warehouses, and BI tools.",
          "Metadata storage overhead: storing detailed runtime lineage graphs for millions of daily job runs requires a metadata store.",
          "Limited visibility into opaque code: cannot automatically trace lineage through un-instrumented custom Python/Java scripts."
        ],
        avoid: [
          "Never modify or drop a production warehouse column without first checking downstream column-level lineage.",
          "Do not attempt to maintain data lineage manually in spreadsheets; use automated SQL AST parsers and OpenLineage.",
          "Avoid deploying third-party BI tools that do not expose programmatic metadata APIs for automated lineage extraction."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
