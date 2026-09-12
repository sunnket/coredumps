/* ==========================================================================
   Depth pass 93 — Data Engineering batch 1: Foundations, ETL/ELT & Distributed Streaming.
   Data Pipeline, ETL, ELT, Batch Processing, Stream Processing, Apache Kafka, Apache Spark.

   Decoupled storage-compute architectures replace monolithic transforms;
   distributed log partitions guarantee deterministic replay and exactly-once semantics.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "data-pipeline",

      why: {
        before: "Organizations moved data through brittle, unmonitored cron scripts, manual database dumps, and one-off Python scripts that failed silently, corrupting downstream analytical dashboards.",
        problem: "Modern enterprises generate terabytes of heterogeneous data across transactional databases, SaaS APIs, clickstreams, and IoT sensors that require continuous ingestion, cleansing, transformation, and delivery with strict SLAs.",
        shift: "**Data Pipeline: An automated, resilient, and observable sequence of data processing steps that ingests raw data from disparate sources, transforms it, and loads it into destination stores.** Governed by software engineering principles: idempotent task execution, schema enforcement, automated testing, and comprehensive observability."
      },

      num: {
        t: "Data Pipeline Archetypes: Latency, Ingestion Pattern & Failure Recovery",
        h: ["Pipeline Archetype", "Data Ingestion Mode", "Target Latency SLA", "Fault-Tolerance Mechanism", "State Management"],
        r: [
          ["Micro-Batch (e.g. Spark Streaming)", "Chunked time windows (1–10s)", "Sub-minute (1s–60s)", "Lineage RDD recomputation / WAL", "Distributed checkpointing"],
          ["Event-Driven Streaming (Flink / Kafka)", "Continuous unbounded event log", "Sub-second (< 50 ms)", "Chandy-Lamport distributed snapshots", "RocksDB state backend"],
          ["Batch Scheduled (Airflow / dbt)", "Periodic time interval (hourly/daily)", "Hours (1h–24h)", "Deterministic task re-run / backfill", "Stateless ephemeral tasks"],
          ["Change Data Capture (Debezium)", "Database WAL / binlog streaming", "Low-second (100ms–2s)", "Offset commit tracking in Kafka", "Source connector offsets"],
          ["Reverse ETL (Census / Hightouch)", "Warehouse query delta sync", "Minutes to hours", "Merkle tree diffing / timestamp polling", "Sync run state logs"]
        ],
        n: "A production data pipeline is modeled as an idempotent directed graph of transformations: $T: D_{\\text{source}} \\rightarrow D_{\\text{dest}}$. To guarantee consistency in the face of inevitable network partitions, container crashes, and hardware failures, modern pipelines adhere to **Functional Data Engineering**: transformations are pure functions $f(X_t) = Y_t$ where $X_t$ is an immutable partition of input data. The pipeline is designed around the property of **idempotence**—executing a task $N$ times with identical inputs produces the identical state as running it once: $f(f(X)) = f(X)$. This eliminates duplicate records during crash recovery and enables deterministic historical backfilling."
      },

      miss: [
        {
          w: "A data pipeline is just a Python script with SQL queries running on a cron schedule.",
          r: "A production data pipeline requires idempotency, backfill capability, dependency management, schema validation, data quality circuit breakers, retry backoffs, distributed locking, and end-to-end data lineage tracking."
        },
        {
          w: "Streaming pipelines are always superior to batch pipelines and should replace them everywhere.",
          r: "Streaming pipelines incur significantly higher infrastructure complexity, operational maintenance, and compute costs. If business decisions are made on daily executive dashboards, sub-second streaming provides zero business value while complicating schema evolution and deduplication."
        },
        {
          w: "Data pipelines do not need version control or CI/CD pipelines.",
          r: "Modern data engineering treats data pipelines as software products (DataOps). Changes to SQL transformations or ingestion connectors require Git version control, automated unit tests on mock data, and staging integration tests before production deployment."
        },
        {
          w: "Adding more compute (RAM/CPU) will automatically fix pipeline failures.",
          r: "Most pipeline failures stem from data skew (uneven partition key distribution), schema mismatches, unhandled NULL values, or upstream API rate limits, which cannot be resolved by throwing compute hardware at the problem."
        }
      ],

      trade: {
        buys: [
          "Automates the reliable flow of raw transactional data into clean, business-critical analytics stores.",
          "Decouples data producers from consumers, shielding analytical workloads from operational database stress.",
          "Ensures reproducible and auditable transformations via deterministic, version-controlled workflows.",
          "Enables real-time fraud detection, automated alerting, and operational machine learning inference."
        ],
        costs: [
          "High architectural and operational complexity: requires managing orchestration, compute clusters, and storage tiers.",
          "Vulnerable to upstream schema drift: unannounced column changes can silently corrupt or halt pipelines.",
          "Continuous cloud compute costs for always-on streaming infrastructure and warehouse query processing.",
          "Requires dedicated site reliability engineering (SRE) and on-call rotations to manage pipeline breakages."
        ],
        avoid: [
          "Never design pipeline tasks without idempotency; tasks must safely support repeated retries after failures.",
          "Do not connect analytical dashboards directly to operational production OLTP databases; always route through a pipeline.",
          "Avoid deploying pipeline modifications without testing schema evolution on historical backfill data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "etl",

      why: {
        before: "Relational database storage and compute hardware in the 1990s was prohibitively expensive and strictly capacity-constrained, unable to store raw, un-transformed enterprise logs or execute heavy analytical transformations.",
        problem: "Enterprise databases crashed when subjected to heavy analytical aggregations; systems needed to clean, filter, aggregate, and normalize data in a dedicated external processing server before loading it into the data warehouse.",
        shift: "**ETL (Extract, Transform, Load): The traditional data integration paradigm where raw data is extracted from source systems, transformed on a dedicated middle-tier processing server, and only then loaded into the target data warehouse.** Epitomized by legacy enterprise tools (Informatica, Talend, IBM DataStage, SSIS)."
      },

      num: {
        t: "ETL vs ELT Paradigm Comparison: Compute Architecture, Storage & Flexibility",
        h: ["Dimension", "Traditional ETL", "Modern ELT", "Operational Impact of Shift"],
        r: [
          ["Transformation Location", "Dedicated secondary compute server (e.g. Informatica)", "Target cloud warehouse/lakehouse (BigQuery, Snowflake)", "Eliminates secondary proprietary server cluster"],
          ["Raw Data Preservation", "Discarded after transformation (only curated loaded)", "Preserved permanently in raw bronze stage / object store", "Enables retrospective re-computation and ML experimentation"],
          ["Compute Scalability", "Constrained by dedicated ETL server CPU/RAM", "Virtually unlimited elastic cloud compute scaling", "Separates compute costs from storage capacity"],
          ["Transformation Tooling", "Proprietary graphical GUI / custom Java/Perl", "Universal declarative SQL (dbt), PySpark, Python", "Democratizes data transformation to data analysts"],
          ["Privacy / Compliance", "PII masked on-the-fly BEFORE entering warehouse", "PII loaded raw; masked via views and RBAC", "ETL required when strict regulatory rules prohibit storing raw PII"]
        ],
        n: "In the classical ETL architecture, the processing flow is sequential and rigid: (1) **Extract**: Reading data from transactional OLTP databases or files using JDBC or batch exports. (2) **Transform**: Ingested data enters an intermediate processing server where validation, deduplication, type casting, key lookups, and aggregations are performed in-memory or on scratch disks. (3) **Load**: The final, pre-aggregated, and strictly typed records are written into Kimball-modeled star schemas in the target relational data warehouse. Because raw data was permanently discarded to save expensive warehouse storage, changing business logic required modifying the upstream ETL pipeline and permanently losing historical raw dimensions."
      },

      miss: [
        {
          w: "ETL is completely dead and has zero modern use cases.",
          r: "ETL remains critical in high-security, defense, and healthcare environments where privacy regulations (HIPAA, GDPR) strictly forbid loading un-masked Personally Identifiable Information (PII) or un-redacted clinical records into centralized cloud storage."
        },
        {
          w: "ETL transformations are performed by the database engine itself.",
          r: "In classical ETL, transformations occur entirely on an external, specialized compute cluster (e.g., Informatica PowerCenter) *before* touching the database. Database-driven transformation is ELT, not ETL."
        },
        {
          w: "ETL pipelines are naturally agile and support rapid changes in reporting requirements.",
          r: "Classical ETL is notoriously rigid: altering a metric requires rewriting external transformation jobs, updating staging schemas, and re-running pipelines from the original sources, often taking weeks of engineering effort."
        },
        {
          w: "Data quality validation can only happen during the Transform step of ETL.",
          r: "Modern architectures implement continuous data quality assertions (e.g., Great Expectations, dbt tests) at every stage—during raw ingestion, post-load, and final model compilation."
        }
      ],

      trade: {
        buys: [
          "Guarantees that raw sensitive PII or unvalidated data never enters the centralized data warehouse.",
          "Protects target data warehouses from compute-heavy transformation workloads.",
          "Ensures clean, highly structured, and strictly governed analytical tables ready for immediate BI querying.",
          "Efficient storage usage: target warehouse stores only compact, pre-aggregated analytical records."
        ],
        costs: [
          "Irreversible data loss: discarding raw inputs prevents future backfilling or retrospective re-analysis.",
          "High licensing and maintenance costs for dedicated enterprise ETL transformation server clusters.",
          "Slow engineering iteration: modifying reporting schemas requires redeploying complex external ETL jobs.",
          "Double network transfer hop: data moves from source to ETL engine, then from ETL engine to warehouse."
        ],
        avoid: [
          "Do not build greenfield cloud data stacks using legacy ETL unless hard regulatory compliance mandates pre-storage redaction.",
          "Never discard raw extracted files if object storage (S3/GCS) costs are negligible compared to engineering labor.",
          "Avoid using proprietary GUI-based ETL tools when version-controlled declarative code (dbt/SQL) can perform transformations."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "elt",

      why: {
        before: "Data engineers spent weeks building brittle external ETL servers to clean and aggregate data before loading it into expensive, capacity-constrained on-premises data warehouses.",
        problem: "Cloud data warehouses (Snowflake, BigQuery, Redshift) decoupled storage from compute, driving storage costs to near-zero while offering massively parallel elastic SQL engines, rendering external transformation servers a costly bottleneck.",
        shift: "**ELT (Extract, Load, Transform): The modern data integration paradigm where raw data is extracted from sources, loaded immediately into the target warehouse or data lake in its pristine state, and transformed in-place using declarative SQL (dbt).** Transformed analytics engineering by preserving complete historical data and democratizing transformations."
      },

      num: {
        t: "ELT Architecture Layers: Storage Medium, Data State & Governance",
        h: ["Layer (Medallion)", "Data State", "Primary Storage Mechanism", "Transformation Engine", "Access Governance"],
        r: [
          ["Raw / Bronze (Landing)", "Raw unstructured/JSON API payloads, unmodified", "Cloud Object Storage (S3) / Raw tables", "Lightweight ingestion (Airbyte, Fivetran)", "Strictly restricted (Data Engineers only)"],
          ["Cleaned / Silver (Intermediate)", "Deduplicated, typed, filtered, enriched tables", "Parquet / Delta Lake / Warehouse tables", "Declarative SQL via dbt / Spark SQL", "Internal data analysts & analytics engineers"],
          ["Curated / Gold (Marts)", "Business dimensional models, star schemas, KPIs", "High-performance analytical tables/views", "Scheduled dbt models / materialized views", "Broad business access (BI tools, dashboards)"]
        ],
        n: "ELT fundamentally shifts the computational paradigm by leveraging the **Massively Parallel Processing (MPP)** architecture of modern cloud data warehouses. In ELT, ingestion tools (such as Fivetran, Airbyte, or custom Kafka connectors) act as pure transport mechanisms: they extract data from sources and load it directly into 'Bronze' raw tables as JSON/VARIANT types without transformation. Once stored, transformations are executed entirely within the warehouse using declarative, version-controlled SQL managed by frameworks like **dbt (data build tool)**. Transformations compile down to `CREATE TABLE AS SELECT` (CTAS) statements: $\\text{Gold} = f_{\\text{SQL}}(\\text{Silver}) = f_{\\text{SQL}}(f_{\\text{SQL}}(\\text{Raw}))$. Because raw data is preserved indefinitely, changing business definitions requires simply re-running SQL models over historical raw partitions."
      },

      miss: [
        {
          w: "ELT means we don't need to do any data cleaning or modeling anymore.",
          r: "ELT postpones transformation; it does not eliminate it. Rigorous dimensional modeling (star schemas), deduplication, surrogate key generation, and business logic remain mandatory, now orchestrated in SQL rather than external scripts."
        },
        {
          w: "ELT is always cheaper than ETL.",
          r: "Running unoptimized, full-table scan SQL queries over petabytes of raw data inside a cloud warehouse can trigger catastrophic compute bills on Snowflake or BigQuery. Efficient partitioning, clustering, and incremental models are mandatory."
        },
        {
          w: "ELT cannot handle unstructured or semi-structured data like JSON.",
          r: "Modern cloud warehouses support native semi-structured types (VARIANT in Snowflake, JSON in BigQuery/Postgres) with sub-column pruning, allowing direct querying of nested JSON fields in SQL."
        },
        {
          w: "In ELT, anyone in the company can query the raw landed data.",
          r: "Raw bronze tables contain unmasked PII, internal passwords, and noisy duplicates. Strict Role-Based Access Control (RBAC) and column-level masking policies must quarantine the raw landing layer from general business users."
        }
      ],

      trade: {
        buys: [
          "Complete historical preservation: raw data is stored forever, enabling painless retrospective recalculations and machine learning.",
          "Decouples ingestion from business logic: ingestion pipelines don't break when business metrics or reporting definitions change.",
          "Empowers SQL analysts: transformations are written in standard, version-controlled SQL (dbt) rather than niche ETL languages.",
          "Leverages elastic cloud compute: eliminates managing and provisioning dedicated middle-tier transformation server clusters."
        ],
        costs: [
          "Potential for runaway cloud warehouse compute costs if analysts write inefficient, un-partitioned SQL queries.",
          "Storage of sensitive unmasked PII in the warehouse requires rigorous column-level encryption and RBAC policies.",
          "Warehouse clutter: can lead to hundreds of orphaned intermediate staging tables without disciplined dbt governance.",
          "Dependent on cloud warehouse uptime and API rate limits of third-party SaaS ingestion tools."
        ],
        avoid: [
          "Never run ELT transformations as full table refreshes on multi-billion row tables; always use dbt incremental models.",
          "Do not grant raw bronze landing layer read access to general BI dashboard users.",
          "Avoid loading un-partitioned raw JSON without establishing partition pruning strategies on ingestion timestamp."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "batch-processing",

      why: {
        before: "Early computers could only process data interactively one transaction at a time via teletypes, creating massive human bottlenecks when balancing ledgers or computing payroll across millions of accounts.",
        problem: "High-volume transactional operations produce billions of records where calculating global metrics (e.g., monthly billing, end-of-day bank reconciliations) is computationally impossible in real-time OLTP databases.",
        shift: "**Batch Processing: The non-interactive execution of a series of programmatic jobs on large, static collections of historical data over a defined time window.** Evolved from mainframe JCL punch-card batches to distributed MapReduce, Apache Spark, and cloud serverless batch engines."
      },

      num: {
        t: "Batch Processing Engines: Architecture, Throughput & Memory Management",
        h: ["Engine / Framework", "Execution Model", "Intermediate Disk I/O", "Relative Throughput", "Typical Latency Scope"],
        r: [
          ["Hadoop MapReduce (2004)", "Two-stage Map $\\rightarrow$ Sort $\\rightarrow$ Reduce", "Written to disk after every stage", "Baseline (high disk overhead)", "Hours to days"],
          ["Apache Spark (2014)", "In-memory Directed Acyclic Graph (DAG)", "Kept in RAM; spills to disk on memory pressure", "$10\\times$ to $100\\times$ faster than MapReduce", "Minutes to hours"],
          ["Cloud MPP (Snowflake / BigQuery)", "Serverless distributed columnar SQL", "Ephemeral SSD cache + Object Storage", "Extreme parallel vectorization", "Seconds to minutes"],
          ["Trino / Presto", "In-memory distributed interactive SQL", "Piped across network without disk staging", "High (ad-hoc queries)", "Sub-second to minutes"]
        ],
        n: "Batch processing operates on **bounded datasets**—collections of data whose size and temporal boundaries are fixed before processing begins. In distributed batch systems, processing follows the **Split-Apply-Combine** strategy: (1) An immutable dataset is split into $M$ partitions distributed across $N$ worker nodes. (2) Workers apply transformation functions $f(x)$ independently and locally, avoiding network overhead (**data locality**). (3) When operations require global regrouping (e.g., `GROUP BY`, `JOIN`), the framework executes a **Shuffle**—redistributing records across the network based on partition hash keys $h(k) \\pmod P$. The job's fault tolerance is guaranteed via lineage graphs: if a worker crashes, the scheduler re-executes only the lost partitions from upstream immutable storage."
      },

      miss: [
        {
          w: "Batch processing is an obsolete legacy approach replaced entirely by real-time streaming.",
          r: "Over 80% of enterprise workloads remain batch: financial ledger reconciliation, monthly payroll, machine learning model retraining, and historical trend analytics inherently operate on bounded historical intervals where real-time streaming provides zero mathematical benefit."
        },
        {
          w: "Batch jobs cannot handle petabyte-scale data.",
          r: "Batch processing is specifically engineered for petabyte and exabyte scale. Distributed batch engines (Spark, MapReduce) process trillions of records with automated fault tolerance, scaling out horizontally across thousands of nodes."
        },
        {
          w: "If a batch job fails halfway through, the entire job must restart from scratch.",
          r: "Modern engines (Spark, Airflow) implement checkpointing and task-level retries. If a single task or executor crashes, only that specific partition or DAG task is re-computed, preserving upstream progress."
        },
        {
          w: "Batch processing always requires specialized Hadoop clusters.",
          r: "Modern batch processing runs on serverless cloud data warehouses (BigQuery, Snowflake), containerized Kubernetes jobs (Spark on K8s), or serverless compute (AWS Glue, Cloud Run) without maintaining persistent VMs."
        }
      ],

      trade: {
        buys: [
          "Maximum computational efficiency and throughput: optimizes hardware utilization and disk/network I/O over massive datasets.",
          "Simple operational mental model: operates on bounded, static snapshots with straightforward consistency and reproducibility.",
          "Significantly lower cost than streaming: compute resources can be spun up on-demand and terminated immediately after completion.",
          "Natural fit for complex global operations: full-table sorting, complex multi-table joins, and global graph calculations."
        ],
        costs: [
          "High latency: insights are delayed by the batch interval (e.g., hourly, nightly), providing zero real-time alerting capability.",
          "Compute resource spikes: creates massive peak loads during nightly batch windows followed by idle daytime compute.",
          "Large blast radius: a failing batch job delays reporting across the entire organization until debugged and re-run.",
          "Shuffle bottleneck: heavy `GROUP BY` or `JOIN` operations across petabytes can trigger network saturation."
        ],
        avoid: [
          "Never use batch processing for time-critical workflows like credit card fraud detection or critical server health alerting.",
          "Do not execute batch jobs without partition pruning and pushdown predicates on large data tables.",
          "Avoid running monolithic 12-hour batch scripts without intermediate checkpointing and modular task orchestration."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stream-processing",

      why: {
        before: "Organizations relied on nightly batch processing jobs, discovering credit card fraud, factory machine failures, or cyberattacks 12 to 24 hours after they occurred.",
        problem: "Modern competitive advantages require acting on data immediately as events occur; waiting for batch windows delays critical interventions until the business opportunity or security threat has passed.",
        shift: "**Stream Processing: Continuous, low-latency ingestion, processing, and analysis of unbounded data streams in real time as events occur.** Championed by Apache Flink, Apache Storm, Spark Structured Streaming, and Kafka Streams, replacing periodic polling with event-driven architectures."
      },

      num: {
        t: "Stream Processing Frameworks: Processing Guarantees, State & Latency",
        h: ["Framework", "Processing Paradigm", "Latency", "State Management", "Fault-Tolerance Guarantee"],
        r: [
          ["Apache Storm (2011)", "Native record-at-a-time", "Sub-10 ms", "Stateless / external DB", "At-least-once (ACK tracking)"],
          ["Spark Structured Streaming", "Micro-batch (down to continuous)", "100 ms – 1s (micro-batch)", "HDFS / Object storage checkpoints", "Exactly-once (end-to-end via idempotent sinks)"],
          ["Apache Flink (2015)", "Native event-driven stream", "Sub-10 ms (true continuous)", "RocksDB incremental state backend", "Strict exactly-once (Chandy-Lamport distributed snapshots)"],
          ["Kafka Streams (2016)", "Client-library record-at-a-time", "Sub-20 ms", "Local RocksDB + changelog topic", "Exactly-once (transactional producer/consumer)"]
        ],
        n: "Stream processing models data as an **unbounded continuous stream** of events: $S = (e_1, e_2, \\dots, e_\\infty)$, ordered by event time $t$. Because streams never terminate, aggregations require defining temporal boundaries via **Windowing**: (1) **Tumbling Windows** (fixed, non-overlapping intervals, e.g., 5-minute buckets), (2) **Sliding Windows** (overlapping fixed intervals sliding every $M$ seconds), and (3) **Session Windows** (inactivity gap-based). A critical theoretical challenge is handling **Out-of-Order Events** caused by network delays. Frameworks resolve this using **Watermarks**: a watermark $W(t)$ is a monotonically increasing heuristic timestamp asserting that the engine expects no subsequent events with event-time $t' < t$, allowing the system to materialize window aggregations and discard late-arriving records."
      },

      miss: [
        {
          w: "Event Time and Processing Time are identical.",
          r: "Processing Time is the clock time of the server processing the event. Event Time is the exact timestamp when the event physically occurred on the user's client device. Network latency, offline mobile devices, and server queues cause Event Time to diverge significantly from Processing Time."
        },
        {
          w: "Stream processing completely eliminates the need for batch processing.",
          r: "Real-world architectures (Kappa and Lambda architectures) retain batch or micro-batch processing for heavy historical model training, complex iterative graph algorithms, regulatory auditing, and retrospective historical backfilling."
        },
        {
          w: "'Exactly-Once' processing means an event is physically processed only once by the network.",
          r: "In distributed networks, hardware failures guarantee that network packets and messages WILL be duplicated and retried. Exactly-once semantics (EOS) means the **end state** is mathematically identical to single execution via deduplication, transactional commits, and idempotent sinks."
        },
        {
          w: "Stream processing is simple to manage with standard SQL queries.",
          r: "Stateful stream processing requires managing persistent state backends (RocksDB), distributed checkpoint storage, watermark lag monitoring, consumer group rebalances, and complex backpressure management when downstream sinks slow down."
        }
      ],

      trade: {
        buys: [
          "Sub-second event detection: enables instant fraud blocking, live algorithmic trading, and real-time inventory management.",
          "Even computational load: processes data continuously, eliminating massive nightly batch compute spikes.",
          "Natural fit for event-driven microservice architectures and IoT telemetry monitoring.",
          "Rich temporal semantics: supports sophisticated event-time windowing, sessionization, and complex event processing (CEP)."
        ],
        costs: [
          "High operational and architectural complexity: requires managing state backends, checkpoints, and distributed brokers.",
          "Significantly higher infrastructure cost: stream processors and message brokers must run 24/7/365 without pausing.",
          "Challenging historical backfills: re-processing 3 years of historical stream data requires replaying billions of events.",
          "Susceptible to backpressure: if downstream sinks slow down, upstream buffers can exhaust cluster memory."
        ],
        avoid: [
          "Do not build a 24/7 stream processing cluster if downstream business users only look at data once a day.",
          "Never use Processing Time for financial or compliance metrics where out-of-order mobile events occur; use Event Time.",
          "Avoid stateful stream processing without configuring distributed incremental checkpointing (RocksDB)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "apache-kafka",

      why: {
        before: "Organizations connected enterprise systems using point-to-point queues and monolithic enterprise service buses (ActiveMQ, RabbitMQ, TIBCO) that collapsed when subjected to millions of real-time events per second, with messages disappearing once consumed.",
        problem: "Point-to-point connections create an unmaintainable $O(N^2)$ integration spaghetti where a single slow consumer blocks publishers, and multiple independent downstream systems cannot replay or independently consume identical event streams.",
        shift: "**Apache Kafka: A horizontally scalable, fault-tolerant, distributed event streaming platform built on an immutable, partitioned append-only commit log.** Created by LinkedIn in 2011, Kafka decoupled producers from consumers, becoming the universal nervous system of modern data architectures."
      },

      num: {
        t: "Apache Kafka Architecture & Performance Characteristics",
        h: ["Dimension", "Technical Specification / Mechanism", "Engineering Rationale", "Performance Benchmark"],
        r: [
          ["Storage Primitive", "Append-only commit log on disk", "Sequential disk I/O matches sequential memory speed", "Millions of events/sec per node"],
          ["Zero-Copy I/O", "Linux `sendfile()` kernel syscall", "Bypasses OS user-space context switches directly to NIC buffer", "Saturates 10Gbps/40Gbps network cards"],
          ["Partitioning & Parallelism", "Key-based hash partitioning: $h(k) \\pmod P$", "Partitions are the fundamental unit of consumer parallelism", "Linear horizontal scale-out"],
          ["Consensus & Metadata", "KRaft (Kafka Raft Consensus)", "Eliminated external ZooKeeper dependency", "Sub-second partition leader failover"],
          ["Consumer Group Model", "Coordinated pull-based consumers", "Consumers track their own offset pointers independently", "Zero impact of slow consumers on producers"]
        ],
        n: "Kafka models event streams as **Topics**, where each topic is subdivided into ordered, immutable **Partitions**. Inside a partition, every incoming message is appended sequentially and assigned a monotonically increasing integer identifier called an **Offset**. Producers publish records with an optional key: records with the same key are guaranteed to hash to the identical partition, preserving strict per-key ordering. Kafka achieves exceptional performance through three core engineering principles: (1) **Sequential Disk Access**: Writing sequentially to disk avoids expensive random head seeks, performing comparably to RAM. (2) **Zero-Copy Data Transfer**: Using the OS `sendfile` system call, data is copied directly from disk cache to the network socket without passing through JVM application memory. (3) **Page Cache Utilization**: Kafka relies heavily on the operating system page cache, avoiding Java garbage collection (GC) pauses."
      },

      miss: [
        {
          w: "Kafka is just a fast traditional message queue like RabbitMQ.",
          r: "RabbitMQ is a traditional message broker where messages are deleted immediately after consumer acknowledgment. Kafka is a **distributed immutable commit log** where messages persist on disk for days or months, allowing multiple independent consumer groups to replay, rewind, and re-read data at arbitrary historical offsets."
        },
        {
          w: "Kafka guarantees global ordering across an entire topic.",
          r: "Kafka guarantees strict ordering **only within a single partition**. If a topic has 10 partitions, messages across different partitions are consumed concurrently with no global ordering guarantees."
        },
        {
          w: "Kafka stores all messages in server RAM for speed.",
          r: "Kafka stores all messages persistently on physical hard drives or SSDs as append-only log segments. It achieves high throughput by exploiting sequential disk access and the Linux kernel's OS page cache."
        },
        {
          w: "A consumer group can have more active consumer instances than partitions in a topic.",
          r: "Each partition can be consumed by at most ONE consumer instance within a consumer group at any time. If a topic has 6 partitions and you spin up 10 consumer instances, 4 instances will sit completely idle."
        }
      ],

      trade: {
        buys: [
          "Massive throughput: capable of ingesting and persisting millions of events per second with sub-10ms latency.",
          "High decoupling: producers publish without knowledge of consumers; consumers read independently at their own pace.",
          "Historical replayability: consumer offsets can be rewound to reprocess days or weeks of historical events after code updates.",
          "Scalable consumer parallelism via partition sharding and dynamic consumer group auto-rebalancing."
        ],
        costs: [
          "High operational burden: requires monitoring partition skew, disk storage retention, leader rebalances, and network bandwidth.",
          "No native complex routing: lacks selective content-based routing (present in RabbitMQ); all filtering must be done by consumers.",
          "Message payload size constraints: poorly suited for transmitting large binary files ($> 10$ MB) over topics.",
          "Strict per-partition ordering means global event sequencing requires single-partition topics, destroying parallelism."
        ],
        avoid: [
          "Never transmit large payloads (> 10MB) directly through Kafka; store files in S3 and pass URI pointers in Kafka.",
          "Do not provision more consumer instances in a consumer group than available topic partitions.",
          "Avoid using Kafka as a permanent relational database with arbitrary SQL querying; pair it with an OLAP store."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "apache-spark",

      why: {
        before: "Hadoop MapReduce was the primary tool for large-scale distributed batch computing, but it wrote all intermediate results to physical hard drives between Map and Reduce phases, resulting in crippling I/O bottlenecks for iterative machine learning and interactive queries.",
        problem: "Iterative algorithms (gradient descent, PageRank, k-means) pass over data repeatedly; reading and writing gigabytes to disk on every iteration makes convergence sluggish and impractical.",
        shift: "**Apache Spark: A unified, multi-language distributed analytics engine for large-scale data processing that performs computations in-memory using resilient distributed datasets (RDDs) and optimized execution plans (Catalyst Optimizer).** Developed at UC Berkeley AMPLab in 2009, Spark became the industry gold standard for big data computing."
      },

      num: {
        t: "Apache Spark Core Components, API Layers & Optimization Engines",
        h: ["Component / API", "Primary Abstraction", "Execution Optimization", "Memory Management", "Use Case"],
        r: [
          ["Spark Core", "Resilient Distributed Dataset (RDD)", "Lineage DAG graph recomputation", "JVM Object Heap / Tungsten", "Low-level partition control, custom distributed data structures"],
          ["Spark SQL & DataFrames", "Dataset / DataFrame (Columnar)", "Catalyst Optimizer (Rule/Cost-Based)", "Tungsten off-heap binary memory", "Declarative relational transformations, BI queries, ETL"],
          ["Spark Streaming (SS)", "Micro-batch / Continuous DataStream", "Incrementalized Catalyst query plans", "Stateful RocksDB checkpointing", "Low-latency streaming ingestion and event processing"],
          ["MLlib", "DataFrame-based ML Pipelines", "Distributed vector linear algebra", "In-memory caching of iterative features", "Scalable distributed machine learning (Random Forests, PCA)"],
          ["GraphX", "Resilient Distributed Property Graph", "Pregel message-passing abstraction", "In-memory vertex/edge partitions", "Large-scale graph analytics (PageRank, connected components)"]
        ],
        n: "Apache Spark is built around the **Resilient Distributed Dataset (RDD)**—an immutable, fault-tolerant collection of records partitioned across cluster nodes. RDDs support two operations: **Transformations** (lazy operations creating new RDDs, e.g., `map`, `filter`, `join`) and **Actions** (eager operations returning values or writing to disk, e.g., `count`, `collect`, `save`). In modern Spark, the high-level **DataFrame** API is standard, backed by the **Catalyst Optimizer** and **Project Tungsten**. Catalyst optimizes SQL query plans through four phases: analysis, logical optimization (predicate pushdown, projection pruning), physical planning, and code generation. Tungsten eliminates Java garbage collection overhead by managing memory off-heap in compact, byte-aligned binary formats and compiling inner loops into vectorized bytecode using Whole-Stage Code Generation."
      },

      miss: [
        {
          w: "Spark stores all data in memory and crashes if data exceeds total cluster RAM.",
          r: "Spark is an in-memory *first* engine, not an in-memory *only* engine. If memory is exhausted, Spark gracefully spills excess partitions to local disk storage, continuing execution without crashing (though with reduced throughput)."
        },
        {
          w: "Calling `rdd.map()` or `df.filter()` immediately starts crunching data on the cluster.",
          r: "Transformations in Spark are **lazy**. Spark merely records the operation in an internal logical DAG plan. Computation is triggered ONLY when an **Action** (such as `.count()`, `.show()`, or `.write()`) is explicitly invoked."
        },
        {
          w: "Calling `.collect()` on a DataFrame is standard practice to view results.",
          r: "`.collect()` pulls the ENTIRE distributed dataset across all cluster nodes into the single master Driver program. Running `.collect()` on a billion-row table instantly triggers an `OutOfMemoryError` (OOM) on the Driver and crashes the job."
        },
        {
          w: "Low-level RDDs run faster than high-level Spark DataFrames.",
          r: "DataFrames run significantly faster than raw RDDs because DataFrames pass through the Catalyst Optimizer and Tungsten off-heap code generation. Hand-written RDD transformations bypass Catalyst, incur heavy JVM object serialization, and trigger severe garbage collection overhead."
        }
      ],

      trade: {
        buys: [
          "Unified distributed engine: executes batch processing, streaming, SQL queries, graph processing, and ML on one platform.",
          "High performance: in-memory computation and Catalyst optimization make it $10\\times$ to $100\\times$ faster than legacy MapReduce.",
          "Robust fault tolerance: automatically recovers lost partitions via deterministic DAG lineage recomputation.",
          "Massive ecosystem support: connects natively to S3, HDFS, Snowflake, BigQuery, Delta Lake, Kafka, and Cassandra."
        ],
        costs: [
          "High memory footprint: requires significant RAM per worker to prevent disk spilling bottlenecks.",
          "Complex performance tuning: configuring executor memory, cores, shuffle partitions, and garbage collection requires deep expertise.",
          "Driver bottleneck: improper use of broadcast variables or `.collect()` can crash the central coordinator.",
          "High startup overhead: unsuitable for sub-second ad-hoc queries compared to specialized MPP query engines (Trino)."
        ],
        avoid: [
          "Never execute `.collect()` on large distributed DataFrames in production; use `.take(n)` or write directly to storage.",
          "Do not write custom RDD transformations when standard DataFrame SQL functions accomplish the same task.",
          "Avoid data skew on join keys without enabling Spark's Adaptive Query Execution (AQE) skew join handling."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
