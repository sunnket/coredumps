/* ==========================================================================
   Depth pass 94 — Data Engineering batch 2: Compute, Orchestration & Analytical Stores.
   Hadoop, MapReduce, Apache Airflow, Directed Acyclic Graph,
   dbt, Data Warehouse, Data Lake.

   Lineage-driven directed graphs orchestrate declarative relational models;
   shared-nothing distributed file systems evolve into decoupled cloud data lakes.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "hadoop",

      why: {
        before: "Storing and processing multi-terabyte datasets in the early 2000s required multi-million-dollar proprietary enterprise servers (Sun Microsystems, EMC SAN storage) that could not scale cost-effectively as web traffic exploded.",
        problem: "Commodity off-the-shelf PC hardware was prone to frequent hard drive crashes, network drops, and power failures, making large-scale distributed computing impossible without an OS layer designed specifically for un-reliable hardware.",
        shift: "**Apache Hadoop: An open-source framework for distributed storage (HDFS) and distributed processing (MapReduce / YARN) across clusters of commodity hardware.** Created by Doug Cutting and Mike Cafarella in 2006 (inspired by Google's GFS and MapReduce papers), Hadoop birthed the modern 'Big Data' industry."
      },

      num: {
        t: "Hadoop Core Ecosystem Components: Architectures, Roles & Modern Successors",
        h: ["Component", "Original Architectural Role", "Primary Design Principle", "Modern Cloud Successor"],
        r: [
          ["HDFS (Hadoop Distributed File System)", "Distributed append-only file storage", "Hardware failure is the norm; triple replication (3x)", "Cloud Object Storage (Amazon S3, GCS, Azure Blob)"],
          ["MapReduce", "Distributed batch computing framework", "Move computation to data (data locality)", "Apache Spark, Trino, Cloud Warehouses"],
          ["YARN (Yet Another Resource Negotiator)", "Cluster resource manager and scheduler", "Decouples resource management from processing", "Kubernetes (K8s)"],
          ["Apache Hive", "SQL abstraction layer over MapReduce", "Schema-on-Read over tabular text/HDFS files", "dbt, Snowflake, Databricks SQL"],
          ["Apache HBase", "Distributed NoSQL wide-column store over HDFS", "Bigtable clone with LSM-trees and ZooKeeper", "Google Cloud Bigtable, Cassandra, DynamoDB"]
        ],
        n: "Hadoop's architectural foundation rests on two core pillars: **HDFS** and **MapReduce/YARN**. HDFS splits files into large blocks (default 128MB) and distributes them across a cluster of **DataNodes**, managed by a centralized **NameNode** that maintains file metadata and block mapping in RAM. To survive frequent commodity hardware failures, every block is replicated three times ($3\\times$ replication: two on the same rack, one on a remote rack). Hadoop's revolutionary computational breakthrough was **Data Locality**: instead of transferring gigabytes of data across the network to a central compute server, Hadoop schedules computation tasks directly onto the physical DataNode holding the local disk block, eliminating network saturation bottlenecks."
      },

      miss: [
        {
          w: "Hadoop is an active, modern default for building new data engineering platforms in the cloud.",
          r: "Managing bare-metal Hadoop clusters (HDFS NameNodes, YARN configs) is an obsolete legacy anti-pattern. Modern cloud architectures decouple storage and compute, using cloud object storage (S3) and ephemeral compute (Spark on Kubernetes, serverless SQL engines)."
        },
        {
          w: "HDFS is an optimal storage engine for millions of small files (e.g., 10 KB images).",
          r: "The 'Small Files Problem' crippled Hadoop: the NameNode holds all file and block metadata in RAM (~150 bytes per block). Storing millions of tiny files exhausts NameNode memory while utilizing a fraction of HDFS disk capacity."
        },
        {
          w: "Hadoop requires specialized high-performance enterprise server hardware.",
          r: "Hadoop was explicitly architected to run on cheap, unreliable, commodity PC hardware. Its software layer was engineered to assume that hard drives and nodes would crash daily, automatically re-replicating lost blocks without human intervention."
        },
        {
          w: "Hadoop is purely a batch system and cannot execute SQL.",
          r: "Apache Hive and Apache Impala brought SQL query engines to Hadoop over a decade ago. Hive compiles declarative SQL queries into low-level MapReduce or Tez jobs."
        }
      ],

      trade: {
        buys: [
          "Historically democratized big data: allowed companies to store and process petabytes using cheap commodity hardware.",
          "Extreme fault tolerance: survives drive and node crashes automatically via triple-redundant distributed block replication.",
          "Data locality optimization: minimizes network traffic by scheduling compute tasks on the physical machine hosting the data.",
          "Laid the foundational design patterns (distributed storage, partitioning, sharding) that underpin all modern cloud data engines."
        ],
        costs: [
          "Massive operational overhead: managing ZooKeeper, active/standby NameNodes, and YARN resource queues requires dedicated infrastructure teams.",
          "Coupled storage and compute: scaling disk capacity required buying more compute nodes, leading to severe resource imbalances.",
          "Slow disk-bound execution: original MapReduce wrote all intermediate stage outputs to physical disks.",
          "Catastrophic failure on small files: NameNode RAM exhaustion limits cluster file count to tens of millions of files."
        ],
        avoid: [
          "Never deploy a new bare-metal Hadoop/HDFS cluster in modern cloud environments; use S3/GCS with serverless compute.",
          "Do not ingest millions of un-compacted small files into HDFS without compaction into SequenceFiles, Avro, or Parquet.",
          "Avoid using raw MapReduce Java APIs for analytics when Apache Spark or SQL engines execute $100\\times$ faster."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mapreduce",

      why: {
        before: "Writing distributed parallel programs required software engineers to manually manage socket connections, message-passing protocols (MPI), thread race conditions, machine failovers, and work synchronization locks from scratch.",
        problem: "Distributing computations across thousands of cluster machines is error-prone; developers spent 90% of their effort debugging network crashes and node failovers rather than writing business logic.",
        shift: "**MapReduce: A programming model and execution framework for processing massive datasets in parallel using two functional primitives: Map and Reduce.** Introduced by Jeffrey Dean and Sanjay Ghemawat at Google in 2004, MapReduce automated distributed partitioning, fault tolerance, and network shuffling."
      },

      num: {
        t: "MapReduce Phase Breakdown: Input/Output Data Shapes & Operations",
        h: ["Phase", "Input Type / Shape", "Output Type / Shape", "Operation Mechanism", "Failure Recovery"],
        r: [
          ["Input Splitting", "Raw disk files (HDFS/GFS blocks)", "List of byte splits ($128$ MB)", "Determines worker task allocation based on data locality", "Rescheduled on replica node"],
          ["Map Phase", "Key-Value pairs $(k_1, v_1)$", "Intermediate pairs $[(k_2, v_2)]$", "User-defined transformation $f(k, v)$ executed locally on worker", "Task re-run from local raw split"],
          ["Shuffle & Sort Phase", "Intermediate pairs across all mappers", "Partitioned, key-sorted lists $(k_2, [v_2])$", "Hash partitioning $h(k_2) \\pmod R$ + network transfer + external merge sort", "Re-fetched from surviving mapper disks"],
          ["Reduce Phase", "Key with list of values $(k_2, [v_2])$", "Final output pairs $[(k_3, v_3)]$", "User-defined aggregation $g(k_2, [v_2])$ executed per unique key", "Task re-run with buffered sorted inputs"],
          ["Output Commit", "Final aggregated records", "Immutable files written to HDFS/S3", "Two-phase atomic rename commit into output directories", "Atomic file overwrite / cleanup"]
        ],
        n: "MapReduce models computation through functional programming concepts. The user implements two functions: (1) $\\text{Map}: (k_1, v_1) \\rightarrow \\text{list}(k_2, v_2)$, which processes local input records and emits intermediate key-value pairs. (2) $\\text{Reduce}: (k_2, \\text{list}(v_2)) \\rightarrow \\text{list}(k_3, v_3)$, which aggregates all values associated with the same intermediate key $k_2$. The core engineering masterpiece of MapReduce is the **Shuffle**: between Map and Reduce, the framework automatically hashes, partitions, transmits across the network, and externally sorts billions of intermediate key-value pairs so that all values for a given key arrive at the same reducer. If any worker node crashes during execution, the master node detects heartbeat loss and automatically re-schedules the failed tasks on another machine."
      },

      miss: [
        {
          w: "MapReduce and Apache Spark are identical distributed computing systems.",
          r: "MapReduce is a strict two-stage framework that writes all intermediate shuffle data to physical disks. Spark uses a generalized Directed Acyclic Graph (DAG) model that holds intermediate partitions in RAM, running iterative computations up to $100\\times$ faster."
        },
        {
          w: "The Map step and Reduce step must always run in equal numbers (1:1 ratio).",
          r: "The number of mappers $M$ is governed by input file block count (e.g., 1,000 splits). The number of reducers $R$ is an independent user-configured hyperparameter (e.g., 50 reducers) based on aggregate output sizing and target file partition sizes."
        },
        {
          w: "MapReduce is efficient for multi-pass machine learning algorithms.",
          r: "MapReduce is fundamentally ill-suited for iterative machine learning (k-means, gradient descent). Each iteration requires launching a separate MapReduce job, reading data from disk, shuffling, and writing back to disk, creating massive I/O bottlenecks."
        },
        {
          w: "The Map step handles data aggregation across the entire dataset.",
          r: "The Map step is purely local and isolated; a mapper has zero visibility into data processed by other mappers. Global grouping and multi-record aggregation can ONLY occur during or after the network Shuffle in the Reduce phase."
        }
      ],

      trade: {
        buys: [
          "Extreme scalability: proven to process exabytes of data across tens of thousands of machines seamlessly.",
          "Total abstraction of distributed complexity: developer writes simple single-threaded map/reduce logic; framework handles distribution.",
          "Bulletproof fault tolerance: worker crashes, disk failures, and slow stragglers are transparently handled and re-executed.",
          "Foundation of modern data engineering: established the core distributed primitives (partitions, shuffles, keys) still used today."
        ],
        costs: [
          "Severe disk I/O bottleneck: mandatory disk persistence after the Map phase creates high write latency.",
          "Rigid two-stage abstraction: complex workflows require chaining multiple MapReduce jobs, re-reading disks repeatedly.",
          "High batch startup latency: JVM task launch and split allocation take tens of seconds before data processing begins.",
          "Verbose boilerplate code: writing raw Java MapReduce jobs requires hundreds of lines of code for simple operations."
        ],
        avoid: [
          "Never use MapReduce for interactive, ad-hoc, or iterative machine learning queries; use Apache Spark or Trino.",
          "Do not forget to implement a Combiner function (local mini-reducer) to minimize network shuffle volume.",
          "Avoid using MapReduce when data fits in a single modern server's RAM and CPU cores."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "apache-airflow",

      why: {
        before: "Organizations scheduled data workflows using Linux crontab files, custom Python loops, and Jenkins jobs, which lacked dependency management, retry logic, historical backfill tracking, and execution observability.",
        problem: "When a multi-step data pipeline fails at step 4 of 10 at 3:00 AM, cron scripts continue blindly executing downstream steps on corrupted data, leaving engineers with no UI to inspect logs, pause pipelines, or restart failed tasks.",
        shift: "**Apache Airflow: A platform to programmatically author, schedule, and monitor complex data workflows as Directed Acyclic Graphs (DAGs) of tasks written in Python.** Created by Maxime Beauchemin at Airbnb in 2014, Airflow became the global standard for batch workflow orchestration."
      },

      num: {
        t: "Apache Airflow Architecture: Components, Roles & Executor Types",
        h: ["Component / Executor", "Architectural Role", "Scalability Mechanism", "Production Suitability", "Failure Mode if Overloaded"],
        r: [
          ["Airflow Scheduler", "Monitors DAGs and triggers task instances", "Multi-process parsing loop + SQL queue", "Core engine", "Scheduling lag / heartbeat timeout"],
          ["Airflow Webserver", "UI for inspection, graph viewing & triggering", "Gunicorn/Flask reading metadata DB", "Core UI", "UI unresponsiveness (isolated from tasks)"],
          ["Metadata Database", "Stores state of all DAGs, runs, and variables", "PostgreSQL / MySQL with connection pooling", "Mandatory backbone", "DB connection exhaustion / locks"],
          ["Celery Executor", "Distributes task execution to worker nodes", "RabbitMQ / Redis broker + Celery workers", "High (horizontal scale-out)", "Broker queue backlog"],
          ["Kubernetes Executor", "Spins up an ephemeral pod per task instance", "K8s API dynamic pod orchestration", "Very High (dynamic elasticity)", "K8s API rate-limiting / slow pod start"]
        ],
        n: "Airflow orchestrates workflows by defining **DAGs (Directed Acyclic Graphs)** in pure Python code. Tasks are instantiated using **Operators** (e.g., `BashOperator`, `PythonOperator`, `SnowflakeOperator`) and linked via dependency bitshift operators: `extract >> transform >> load`. The **Airflow Scheduler** periodically scans the `dags/` folder, evaluates temporal schedules (`cron` or data intervals), and writes runnable **TaskInstances** into the metadata database. Workers (managed via Celery or Kubernetes) poll the queue, execute the tasks, and update state (`success`, `failed`, `up_for_retry`). Airflow is strictly an **orchestrator**, not a data processing engine: best practice dictates using Airflow as a 'conductor' that triggers external compute engines (dbt, Spark, Snowflake, BigQuery) rather than crunching data inside Airflow worker memory."
      },

      miss: [
        {
          w: "Airflow is a data processing engine designed to transform gigabytes of data in memory.",
          r: "Airflow is purely a **workflow orchestrator**. Processing heavy data inside PythonOperator workers exhausts worker RAM, triggers Linux Out-Of-Memory (OOM) kills, and crashes the scheduler. Airflow should delegate data processing to external engines (Spark, Snowflake, dbt)."
        },
        {
          w: "Airflow DAG files are executed only once when the scheduler boots up.",
          r: "The Airflow Scheduler executes and parses top-level Python code in every DAG file every few seconds (governed by `min_file_process_interval`). Writing heavy DB queries or API calls in top-level DAG code overwhelms external servers and paralyzes the scheduler."
        },
        {
          w: "`execution_date` in Airflow represents the exact wall-clock time the task started running.",
          r: "In Airflow (prior to 2.2 `data_interval_start`), `execution_date` represents the **beginning of the historical data interval**, not the execution time. A daily DAG for '2024-01-01' actually starts running at the *end* of the period ('2024-01-02 00:00:00')."
        },
        {
          w: "Airflow XComs should be used to pass large dataframes between tasks.",
          r: "XComs (Cross-Communications) store serialized data directly in the central Airflow metadata relational database. Passing large datasets (> 1 MB) into XComs severely degrades database performance; write data to S3 and pass S3 URI paths via XCom."
        }
      ],

      trade: {
        buys: [
          "Workflows as Code: authoring DAGs in pure Python enables full Git version control, unit testing, and dynamic generation.",
          "Comprehensive observability: rich web UI displays real-time execution graphs, historical runs, Gantt charts, and task logs.",
          "Robust failure handling: built-in configurable retries, exponential backoffs, alerting callbacks (Slack, PagerDuty), and SLA tracking.",
          "Massive integration ecosystem: hundreds of community-maintained provider packages for every major cloud, DB, and SaaS API."
        ],
        costs: [
          "High infrastructure footprint: running a reliable production deployment requires a Webserver, Scheduler, Metadata DB, and Celery/K8s.",
          "Top-level Python parsing overhead: complex DAG folders cause high CPU usage and scheduler loop latency.",
          "Steep learning curve: understanding execution dates, data intervals, templating (Jinja), and idempotency requires deep training.",
          "Batch-only orientation: ill-suited for sub-second, event-driven, or streaming microservice orchestration."
        ],
        avoid: [
          "Never perform heavy data crunching (e.g., Pandas over millions of rows) inside Airflow worker containers.",
          "Do not put expensive database calls, dynamic network requests, or heavy imports in top-level DAG Python code.",
          "Avoid passing large datasets through XCom; use cloud object storage and pass metadata references."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "directed-acyclic-graph",

      why: {
        before: "Workflow systems executed tasks as flat, linear lists of sequential steps, forcing independent tasks to wait needlessly and failing to model parallel branches or converging dependencies.",
        problem: "Complex data architectures contain interdependent tasks where Step C requires outputs from both Step A and Step B, but Step A and B are completely independent and should execute concurrently without circular deadlocks.",
        shift: "**Directed Acyclic Graph (DAG): A mathematical graph structure consisting of directed edges with no closed loops (cycles).** The universal mathematical abstraction powering data pipeline orchestrators (Airflow, Dagster, Prefect) and distributed query execution plans (Spark, dbt)."
      },

      num: {
        t: "DAG Properties Across Data Orchestration & Query Compilation Systems",
        h: ["Dimension", "Mathematical Graph Definition", "Orchestration Implementation (Airflow)", "Query Engine (Spark/dbt)"],
        r: [
          ["Vertices / Nodes ($V$)", "Discrete entities / states", "Tasks / Operators (e.g. `ExtractSales`)", "Data models / RDD transformations"],
          ["Directed Edges ($E$)", "Ordered pairs $(u, v) \\in E$", "Upstream/downstream dependencies (`A >> B`)", "Data flow lineage / stage shuffle dependency"],
          ["Acyclic Constraint", "$\\forall v \\in V$, no path $v \\rightarrow \\dots \\rightarrow v$", "Prevents infinite deadlock dependency loops", "Guarantees finite topological sort termination"],
          ["Execution Order", "Topological Sort (Kahn's Algorithm)", "Resolves execution order in $O(|V| + |E|)$", "Determines physical stage execution schedule"],
          ["Parallelism Potential", "Width of graph (anti-chains)", "Tasks with zero unmet upstream dependencies run in parallel", "Stages with independent inputs execute concurrently"]
        ],
        n: "A Directed Acyclic Graph $G = (V, E)$ consists of a set of vertices $V$ (tasks) and directed edges $E \\subseteq V \\times V$ representing execution dependencies. The fundamental mathematical property of a DAG is the absence of directed cycles: it contains no sequence of edges such that $v_0 \\rightarrow v_1 \\rightarrow \\dots \\rightarrow v_k = v_0$. This acyclic property guarantees the existence of at least one **Topological Ordering**—a linear ordering of vertices such that for every directed edge $(u, v)$, task $u$ comes before $v$. Schedulers compute this using **Kahn's Algorithm** or depth-first search (DFS) in $O(|V| + |E|)$ time: tasks with in-degree 0 (no unresolved upstream dependencies) are immediately dispatched to parallel workers."
      },

      miss: [
        {
          w: "A DAG can include a retry loop that feeds a task's output back into itself until it succeeds.",
          r: "A DAG is mathematically **acyclic**. Adding a backward edge from a task to itself or an upstream task creates a cycle, destroying topological sorting and causing the scheduler to throw a Cycle Error immediately."
        },
        {
          w: "All tasks in a DAG run sequentially one after the other.",
          r: "A DAG explicitly models **parallelism**. Any tasks that share no mutual dependencies and have their upstream prerequisites satisfied execute concurrently across different worker nodes."
        },
        {
          w: "A DAG must have a single root node and a single leaf node.",
          r: "A DAG can have multiple independent root nodes (multiple sources) and multiple independent leaf nodes (multiple downstream data marts) within the same execution graph."
        },
        {
          w: "Dynamic workflows cannot be represented by DAGs.",
          r: "Modern orchestrators generate dynamic DAGs programmatically at parse time or support dynamic task mapping (Airflow 2.3+), expanding tasks at runtime based on upstream data volumes while preserving graph acyclicity."
        }
      ],

      trade: {
        buys: [
          "Guarantees deterministic execution order: topological sorting prevents tasks from executing before prerequisites are ready.",
          "Maximizes parallel throughput: automatically discovers and runs independent tasks concurrently across workers.",
          "Clear visual mental model: provides intuitive UI graph representations of enterprise data dependencies and bottlenecks.",
          "Enables automated impact analysis and data lineage: tracing downstream edges reveals all models affected by an upstream change."
        ],
        costs: [
          "Cannot model native iterative feedback loops (e.g., reinforcement learning or active learning) without breaking acyclicity.",
          "Graph parsing overhead: evaluating large DAGs with thousands of nodes and edges introduces scheduler latency.",
          "Rigid structure: altering dependencies at runtime requires restarting or dynamic task expansion mechanisms.",
          "A single failure in an early upstream bottleneck task blocks all downstream branches across the entire DAG."
        ],
        avoid: [
          "Never attempt to create circular dependencies (e.g., Task A depends on B, and B depends on A) in a data workflow.",
          "Do not create monolithic DAGs with thousands of tasks; split them into modular, decoupled DAGs connected via datasets.",
          "Avoid running heavy computational loops inside dynamic DAG generation scripts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dbt",

      why: {
        before: "Data warehouse transformations were trapped in proprietary GUI ETL tools, sprawling unversioned stored procedures, or fragile custom Python scripts with zero unit tests, no automated documentation, and no lineage tracking.",
        problem: "Software engineering best practices (version control, CI/CD, modularity, automated testing, documentation) were completely missing from data analytics, leading to untrustworthy data and broken dashboards.",
        shift: "**dbt (data build tool): An open-source framework that enables data analysts and engineers to transform data in their warehouse by writing modular, declarative `SELECT` statements.** Founded by Tristan Handy (dbt Labs) in 2016, dbt popularized 'Analytics Engineering' and established software engineering discipline in data modeling."
      },

      num: {
        t: "dbt Materialization Strategies, Trade-offs & Cloud Warehouse Performance",
        h: ["Materialization Type", "Underlying SQL Execution", "Rebuild Strategy", "Query Cost / Latency", "Best Use Case"],
        r: [
          ["View", "`CREATE VIEW AS SELECT...`", "No data moved; virtual query compiled", "Low write cost; higher BI read latency", "Lightweight transformations, staging layer, low-volume models"],
          ["Table", "`CREATE TABLE AS SELECT...`", "Full drop and rebuild on every run", "High compute write cost; ultra-fast BI reads", "Gold marts, heavily queried BI dashboards, complex joins"],
          ["Incremental", "`MERGE INTO / INSERT...`", "Appends/updates only new rows since last run", "Balanced compute; requires unique key logic", "Large event streams, web clicks, multi-billion row tables"],
          ["Ephemeral", "Subquery / CTE injection", "Never saved in DB; interpolated into downstream SQL", "Zero storage; zero DDL overhead", "Reusable modular logic used only in immediate downstream models"]
        ],
        n: "dbt operates on a simple yet revolutionary premise: you write pure, declarative SQL `SELECT` statements; dbt handles the boilerplate Data Definition Language (DDL) and Data Manipulation Language (DML) to materialize them as tables or views in the target warehouse. Models are connected via the **`{{ ref('model_name') }}`** Jinja macro. When executed (`dbt run`), dbt parses all `ref()` functions across the project, compiles an in-memory **DAG** of model dependencies, determines the optimal topological execution order, and runs parallel SQL queries inside the cloud warehouse. dbt integrates software engineering rigor into analytics: (1) **Testing**: Automated schema tests (`unique`, `not_null`, `relationships`, `accepted_values`). (2) **Documentation**: Generates searchable web documentation with interactive lineage graphs. (3) **CI/CD**: Pull requests trigger automated slim runs on modified models only."
      },

      miss: [
        {
          w: "dbt extracts data from production databases and loads it into the warehouse.",
          r: "dbt does NOT extract or load data (it does not perform the 'E' or 'L' in ELT). dbt is purely the **'T' (Transform)** in ELT: it expects raw data to already reside in the warehouse/lakehouse and orchestrates transformations strictly within that target store."
        },
        {
          w: "dbt executes SQL transformations on the local computer or CI/CD server running dbt.",
          r: "dbt is a compiler and orchestrator, not a query engine. The dbt CLI compiles Jinja-SQL into pure SQL dialect strings and sends them via JDBC/API to the target warehouse (Snowflake, BigQuery, Databricks), which performs 100% of the physical compute."
        },
        {
          w: "Incremental models in dbt automatically detect and update historical late-arriving data.",
          r: "Standard incremental models filter on `where event_time > (select max(event_time) from {{ this }})`, completely missing late-arriving data older than the latest timestamp. Handling late-arriving data requires configuring lookback windows or CDC merge keys."
        },
        {
          w: "dbt replaces Apache Airflow.",
          r: "dbt transforms tables inside a warehouse; it does not orchestrate reverse ETL, trigger machine learning training, call external SaaS APIs, or manage cross-system infrastructure. In enterprise architectures, Airflow triggers and monitors dbt as a task within a broader DAG."
        }
      ],

      trade: {
        buys: [
          "Brings software engineering discipline (Git, CI/CD, modularity, automated testing) to data analytics.",
          "Automated lineage and documentation generated directly from SQL code without manual updates.",
          "Empowers SQL-savvy analysts to build production-grade data models without writing low-level Python/Spark.",
          "Declarative code: write pure `SELECT` queries while dbt manages complex `MERGE`, `CREATE`, and `REPLACE` boilerplate."
        ],
        costs: [
          "Compute cost risk: unoptimized incremental models or frequent full-table rebuilds can drive massive cloud warehouse bills.",
          "Warehouse lock-in: writing database-specific SQL functions within dbt models limits portability across warehouses.",
          "Testing overhead: comprehensive test suites on multi-billion row tables increase pipeline execution duration.",
          "Lack of general orchestration: cannot manage non-SQL tasks without external orchestrators (Airflow, Dagster)."
        ],
        avoid: [
          "Never hardcode physical table names in models; always use `{{ ref('model') }}` and `{{ source('src', 'tbl') }}`.",
          "Do not deploy dbt models to production without automated `unique` and `not_null` primary key tests.",
          "Avoid using full-table materializations on multi-million row tables; configure incremental models."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-warehouse",

      why: {
        before: "Running complex analytical reports and business intelligence aggregations on operational OLTP databases locked tables, starved user-facing transactional queries, and crashed production application databases.",
        problem: "Operational databases are row-oriented and normalized (3NF) to optimize fast single-row writes and updates; scanning millions of rows across dozens of tables to calculate quarterly revenue is cripplingly slow.",
        shift: "**Data Warehouse: A centralized, subject-oriented, integrated, time-variant, and non-volatile database optimized for high-performance analytical querying and business reporting.** Advanced from on-premises appliances (Teradata, Netezza) to cloud-native Massively Parallel Processing (MPP) columnar engines (Snowflake, BigQuery, Amazon Redshift)."
      },

      num: {
        t: "Data Warehouse Evolution: Generations, Storage-Compute Coupling & Query Engines",
        h: ["Generation / System", "Storage Architecture", "Compute Paradigm", "Scaling Mechanism", "Typical Query Latency"],
        r: [
          ["1st Gen: On-Premises RDBMS", "Row-oriented local RAID disk arrays", "SMP (Single Machine / Dual Socket)", "Vertical scaling (bigger servers)", "Minutes to hours"],
          ["2nd Gen: On-Prem Appliance (Teradata/Netezza)", "Proprietary shared-nothing disk racks", "Dedicated MPP blades with FPGA accelerators", "Rigid physical rack expansion", "Seconds to minutes"],
          ["3rd Gen: Early Cloud (Redshift 2012)", "Locally attached SSD storage in EC2", "Shared-nothing cloud MPP cluster", "Coupled scale (re-sharding cluster nodes)", "Sub-second to seconds"],
          ["4th Gen: Modern Cloud (Snowflake / BigQuery)", "Decoupled Cloud Object Storage (S3/GCS)", "Serverless elastic MPP compute virtual warehouses", "Instant independent multi-cluster scaling", "Sub-second to seconds (vectorized)"]
        ],
        n: "A modern cloud data warehouse achieves analytical velocity through three foundational architectural principles: (1) **Columnar Storage**: Data is stored physically on disk by column rather than by row. A query calculating `AVG(revenue)` reads only the contiguous bytes belonging to the `revenue` column, reducing disk I/O by $90\\%+$. (2) **Columnar Compression**: Values within a column share the identical data type and low entropy, enabling high-ratio compression (Run-Length Encoding, Dictionary Encoding, Bit-Packing). (3) **Separation of Storage and Compute**: Storage persists permanently in cheap cloud object storage, while independent compute clusters (virtual warehouses) spin up on demand, query the shared storage concurrently without resource contention, and scale down to zero when idle."
      },

      miss: [
        {
          w: "A data warehouse can easily replace a production transactional database (PostgreSQL/MySQL).",
          r: "Data warehouses are heavily optimized for large-scale scans and analytical aggregations, not high-frequency, low-latency row-level transactions. Performing single-row `INSERT` or `UPDATE` statements at high frequency will severely degrade warehouse performance."
        },
        {
          w: "Data warehouses store unstructured data like images, audio, and videos efficiently.",
          r: "Data warehouses are engineered for structured and semi-structured (JSON, Parquet) tabular data. Storing and processing massive unstructured media files is the domain of **Data Lakes** and Object Storage."
        },
        {
          w: "Modern cloud data warehouses do not require any schema design or modeling.",
          r: "While cloud warehouses can query raw JSON, failing to model data into dimensional schemas (Kimball star schemas) or failing to configure proper partition/clustering keys results in slow queries and astronomical cloud compute bills."
        },
        {
          w: "All data in a warehouse must be strictly normalized to Third Normal Form (3NF).",
          r: "Normalized 3NF schemas require complex multi-table joins that degrade analytical performance. Data warehouses prioritize **denormalized dimensional modeling** (star and snowflake schemas) with pre-joined fact and dimension tables."
        }
      ],

      trade: {
        buys: [
          "Extreme analytical query speed: columnar storage and MPP engines scan billions of rows in seconds.",
          "Complete historical business record: time-variant, non-volatile storage provides a trusted single source of truth.",
          "Decoupled storage and compute: scale analytical compute elastically without provisioning physical storage hardware.",
          "High concurrency: independent compute clusters allow data scientists, BI dashboards, and finance teams to query simultaneously without contention."
        ],
        costs: [
          "High cloud compute costs if queries are un-optimized or clustering keys are missing.",
          "Inefficient and slow for high-frequency point writes, single-row updates, and low-latency transactional lookups.",
          "Requires strict governance, modeling, and access controls to prevent warehouse clutter and data duplication.",
          "Vendor lock-in: proprietary SQL extensions and storage formats make migration between cloud warehouses challenging."
        ],
        avoid: [
          "Never execute high-frequency single-row transactional `INSERT` loops in a data warehouse; batch writes into micro-batches.",
          "Do not run full-table scan queries on petabyte-scale tables without partition pruning and clustering filters.",
          "Avoid using a data warehouse as an operational application backend for user logins or e-commerce checkouts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-lake",

      why: {
        before: "Data warehouses demanded rigid schema-on-write modeling, forcing organizations to discard non-relational, semi-structured, and unstructured data (clickstreams, server logs, mobile telemetry, images) because it was too expensive to fit into structured relational tables.",
        problem: "Enterprises needed a centralized, low-cost repository to store all corporate data in its raw, native format at petabyte scale without forcing immediate schema normalization.",
        shift: "**Data Lake: A centralized storage repository that holds vast quantities of raw, native-format data (structured, semi-structured, and unstructured) until it is needed for analytics or machine learning.** Pioneered by Apache Hadoop (HDFS) and perfected by Cloud Object Storage (Amazon S3, Google Cloud Storage, Azure ADLS Gen2)."
      },

      num: {
        t: "Data Lake vs Data Warehouse: Architecture, Schema & Workload Fit",
        h: ["Dimension", "Data Lake", "Data Warehouse", "Architectural Trade-Off"],
        r: [
          ["Data Formats", "Any format (Parquet, JSON, CSV, MP4, raw bytes)", "Strict relational tables & semi-structured JSON", "Data lake accepts raw sensor/media files natively"],
          ["Schema Paradigm", "Schema-on-Read (applied when querying)", "Schema-on-Write (enforced upon ingestion)", "Data lake allows immediate landing without schema validation"],
          ["Storage Cost", "Ultra-low ($0.02 / GB / month on cloud S3)", "Moderate to high (dedicated managed warehouse tiers)", "Data lake enables petabyte/exabyte long-term retention"],
          ["Primary Workloads", "Big data analytics, ML model training, exploratory science", "Business Intelligence, executive reporting, SQL dashboards", "Data lakes feed downstream warehouses and ML models"],
          ["Governance & Quality", "Variable (risk of turning into a 'Data Swamp')", "Strict, curated, audited, and highly governed", "Data lakes require metadata cataloging (Glue, Unity Catalog)"]
        ],
        n: "A Data Lake operates on the **Schema-on-Read** paradigm: data is ingested in its raw, unmodified state (JSON logs, Parquet files, CSV dumps) and stored in scalable, durable object storage hierarchies. Structure and semantic meaning are applied only when a processing engine (Spark, Presto, Trino, Athena) reads the data for a specific analytical task. Storage is decoupled from compute: data is organized by partitioning directory paths (e.g., `s3://bucket/events/year=2024/month=05/day=12/data.parquet`). To make data discoverable and queryable, metadata catalogs (such as AWS Glue Data Catalog or Apache Hive Metastore) crawl storage paths and register table schemas, enabling SQL engines to execute distributed queries directly against object storage files."
      },

      miss: [
        {
          w: "A data lake is just a dumping ground for messy files without structure.",
          r: "An ungoverned data lake rapidly deteriorates into a useless **Data Swamp**. Production data lakes enforce structured directory partitioning, open columnar formats (Parquet), metadata catalogs, schema evolution rules, and data retention policies."
        },
        {
          w: "Data lakes completely replace the need for data warehouses.",
          r: "Querying raw data lakes directly often suffers from higher latency and lacks ACID transactional consistency. Production enterprise architectures route data through a lake into curated data warehouses or lakehouses for fast BI dashboard performance."
        },
        {
          w: "CSV and JSON are great formats for storing large datasets in a data lake.",
          r: "CSV and JSON are row-based, uncompressed, and non-splittable text formats that require reading every byte from disk. Production data lakes mandate **Apache Parquet** or **Apache ORC**, which offer columnar compression, min/max statistics, and dictionary encoding."
        },
        {
          w: "Data lakes natively support ACID transactions and row-level updates.",
          r: "Standard cloud object storage files (S3 objects) are immutable; you cannot update a single row without rewriting the entire file. True ACID transactions and row-level updates require open table formats like **Delta Lake, Apache Iceberg, or Apache Hudi**."
        }
      ],

      trade: {
        buys: [
          "Ultra-low storage cost: cloud object storage enables cost-effective long-term retention of exabytes of enterprise data.",
          "Universal data acceptance: stores structured, semi-structured, and unstructured data (images, audio, logs) natively.",
          "Maximum agility: data can be ingested instantly without waiting for upstream schema design or data modeling.",
          "Decoupled compute flexibility: query the same underlying data using multiple engines (Spark for ML, Trino for SQL, PyTorch for AI)."
        ],
        costs: [
          "Risk of becoming an un-governed 'Data Swamp' lacking clear documentation, ownership, and metadata.",
          "Higher query latency for interactive BI dashboards compared to managed columnar data warehouses.",
          "Lacks native ACID transactions, point-in-time time travel, and row updates unless paired with modern table formats (Iceberg/Delta).",
          "Requires external metadata catalogs (Hive Metastore, Glue) to maintain table schemas and partition locations."
        ],
        avoid: [
          "Never store massive analytical datasets in uncompressed CSV or JSON in a data lake; convert to Parquet.",
          "Do not ingest data into a lake without registering table metadata in a centralized data catalog.",
          "Avoid creating millions of tiny (< 10 MB) files in an object store; implement compaction jobs to maintain 128MB–512MB files."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
