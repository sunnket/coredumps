/* Project Lab — Data Engineering & Streaming */
(function (TD) {
  TD.addProjects("data", [
    {
      id: "data-quality-monitoring-suite",
      title: "Automated Data Quality & Schema Drift Suite",
      domain: "data",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "1–2 weeks",
      tagline: "Build a Great Expectations style automated validation suite with schema drift detection and HTML quality reports.",
      problem: "Silent data corruption (missing null values, unexpected schema changes, negative prices, duplicate IDs) breaks production machine learning models and executive BI dashboards before anyone notices.",
      outcome: "A Python CLI and automated pipeline guard that evaluates data tables against declarative quality rules, detects schema drift, and generates shareable HTML quality scorecards.",
      stack: ["Python", "Pandas / Polars", "Pydantic", "Jinja2 (HTML Reports)", "SQLite / PostgreSQL"],
      diagram:
"Data Pipeline Ingests Raw Data (CSV / Parquet / SQL)\n                      │\n                      ▼\n┌────────────────────────────────────────┐\n│ Declarative Expectation Rules (JSON)   │\n│ • expect_column_values_to_not_be_null  │\n│ • expect_column_values_to_be_between   │\n│ • expect_column_unique (User_ID)       │\n└─────────────────────┬──────────────────┘\n                      ▼\n┌────────────────────────────────────────┐\n│ Data Profiling & Validation Engine     │\n│ Checks schema drift vs Historical Baseline\n└─────────────────────┬──────────────────┘\n                      ▼\n┌────────────────────────────────────────┐\n│ Quality Scorecard & Alerting Gateway   │ ──► HTML Quality Report + Slack Alert on Failure\n└────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Rule Engine & Assertion Matrix", desc: "Build assertion primitives for null checks, range bounds, regex patterns, categorical sets, and uniqueness constraints." },
        { title: "Phase 2: Schema Drift Detection", desc: "Compare incoming schema column types against a historical baseline registry, detecting missing columns, type changes (e.g. string to int), and unexpected new fields." },
        { title: "Phase 3: Automated HTML Report Generation", desc: "Use Jinja2 templates to compile interactive HTML reports displaying validation pass/fail badges, distribution histograms, and failing row samples." },
        { title: "Phase 4: CI/CD Pipeline Integration", desc: "Package the validator as a pre-commit hook or GitHub Action that blocks broken datasets from merging into production data warehouses." }
      ],
      resources: [
        { title: "Great Expectations Data Quality Framework", url: "https://greatexpectations.io/" },
        { title: "Polars: Blazingly Fast DataFrames in Rust and Python", url: "https://pola.rs/" },
        { title: "Data Contracts: Building Reliable Data Architectures", url: "https://datacontracts.com/" }
      ],
      pitfalls: [
        "Avoid running full $O(N)$ row-by-row Python loops over multi-million row datasets; use vectorized Polars/Pandas methods or SQL aggregation pushdowns.",
        "Ensure data profiling catches semantic bugs (e.g. `age: 999` or `price: -10`) that pass basic type checks."
      ],
      interview: [
        "What is Schema Drift and how does it propagate failures through downstream data pipelines?",
        "How do Data Contracts formalize interface boundaries between software engineering and data teams?"
      ]
    },
    {
      id: "etl-pipeline-observability",
      title: "Data Pipeline Lineage Tracker & Contract Validator",
      domain: "data",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "2 weeks",
      tagline: "Track data lineage from source to dashboard with OpenLineage metadata and schema contract gates.",
      problem: "When a database column name is changed or a table is deleted, data engineers have no automated way to trace which downstream reports, dashboard metrics, and ML models will break.",
      outcome: "A lightweight lineage tracker that records table-level and column-level transformations, generating an interactive directed dependency graph with automated impact analysis.",
      stack: ["Python", "OpenLineage / Marquez", "SQLGlot (SQL AST Lineage)", "NetworkX", "D3.js / Cytoscape"],
      diagram:
"Raw PostgreSQL Tables ──► [ SQL Transformation Query ] ──► Aggregated Data Warehouse Mart\n                                    │\n                                    ▼\n┌────────────────────────────────────────────────────────┐\n│ SQLGlot SQL AST Parser: Extracts Inputs & Outputs      │\n│ Input Tables: [users, orders] ──► Output: [user_ltv]   │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ Lineage Graph Engine (NetworkX / OpenLineage)          │\n│ Traces downstream blast radius of column renames       │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\nInteractive D3.js Lineage DAG UI with Impact Analysis Tool",
      steps: [
        { title: "Phase 1: SQL Query AST Lineage Extraction", desc: "Use SQLGlot to parse complex SQL queries, extracting table names, aliases, joins, and column-level derivation trees." },
        { title: "Phase 2: OpenLineage Event Producer", desc: "Emit standardized OpenLineage JSON run events (`START`, `COMPLETE`, `FAIL`) with dataset inputs, outputs, and row counts." },
        { title: "Phase 3: Blast Radius Impact Analyzer", desc: "Implement graph traversal algorithms in NetworkX to compute the upstream and downstream blast radius when a table schema is modified." },
        { title: "Phase 4: Lineage Visualization Dashboard", desc: "Build an interactive Cytoscape.js web viewer displaying data pipelines, dataset nodes, execution durations, and data freshness health badges." }
      ],
      resources: [
        { title: "OpenLineage Standard for Data Lineage Metadata", url: "https://openlineage.io/" },
        { title: "SQLGlot: Python SQL Parser and Transpiler", url: "https://github.com/tobymao/sqlglot" },
        { title: "Cytoscape.js Graph Visualization Library", url: "https://js.cytoscape.org/" }
      ],
      pitfalls: [
        "Do not rely on naive regex parsing for SQL queries; nested subqueries, CTEs, and dynamic aliases require a formal Abstract Syntax Tree parser.",
        "Ensure lineage graph tracking is decoupled from data execution so logging failures never abort the primary data pipeline."
      ],
      interview: [
        "Explain the difference between Table-Level Lineage and Column-Level Lineage.",
        "How does OpenLineage standardize metadata exchange across Airflow, Spark, dbt, and Flink?"
      ]
    },
    {
      id: "realtime-clickstream-pipeline",
      title: "Real-Time Clickstream Streaming Pipeline with Kafka & Flink",
      domain: "data",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Process 50,000 events/sec with Apache Kafka, tumbling/sliding window aggregations, and ClickHouse OLAP.",
      problem: "E-commerce and SaaS platforms need instant visibility into user session drops, cart abandonment, and conversion funnels in real-time, rather than waiting for nightly batch ETL runs.",
      outcome: "A production streaming data pipeline that ingests raw JSON clickstream events into Kafka, computes 5-minute sliding window aggregations in Apache Flink, and sinks metrics into ClickHouse for sub-second dashboard queries.",
      stack: ["Java / Python", "Apache Kafka", "Apache Flink / PyFlink", "ClickHouse OLAP", "Grafana"],
      diagram:
"Web / Mobile Client Clickstream Events [User_ID, Page, Action, Timestamp]\n                                │ (50,000 Events / Second)\n                                ▼\n┌────────────────────────────────────────────────────────┐\n│ Apache Kafka Event Broker (Topic: raw-clickstream)     │\n└──────────────────────────────┬─────────────────────────┘\n                               ▼\n┌────────────────────────────────────────────────────────┐\n│ Apache Flink Stream Processing Cluster                 │\n│ • Watermark Event-Time Handling (Late Event Drop)      │\n│ • 5-Minute Tumbling & Sliding Window Aggregations      │\n│ • Keyed State: (User_ID, Session_ID, Page_Count)       │\n└──────────────────────────────┬─────────────────────────┘\n                               ▼\n┌────────────────────────────────────────────────────────┐\n│ ClickHouse Columnar OLAP Database (ReplacingMergeTree) │\n└──────────────────────────────┬─────────────────────────┘\n                               ▼\nLive Grafana Dashboard: Active Users, Funnel Conversion, Live Error Spikes",
      steps: [
        { title: "Phase 1: Kafka Event Producer & Schema Registry", desc: "Build a high-throughput event producer sending JSON / Avro clickstream events with Schema Registry validation to a multi-partition Kafka cluster." },
        { title: "Phase 2: Flink Watermarks & Event-Time Windows", desc: "Implement Flink streaming jobs with bounded-out-of-orderness watermarks to handle network lag and calculate 5-minute tumbling/sliding session metrics." },
        { title: "Phase 3: ClickHouse Sink & Columnar Schemas", desc: "Design ClickHouse tables using `ReplacingMergeTree` engines for idempotent upserts and fast columnar rollups." },
        { title: "Phase 4: Real-time Grafana Funnel Visualizations", desc: "Build real-time dashboards executing vectorized SQL queries on ClickHouse, tracking conversion funnels and geographic activity with sub-100ms latency." }
      ],
      resources: [
        { title: "Apache Flink Event Time and Watermarks Guide", url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time-and-watermarks/" },
        { title: "ClickHouse Architecture: Why ClickHouse is So Fast", url: "https://clickhouse.com/docs/en/development/architecture" },
        { title: "Designing Data-Intensive Applications (Martin Kleppmann)", url: "https://dataintensive.net/" }
      ],
      pitfalls: [
        "Never use Processing Time for windowing; out-of-order events from mobile clients will land in the wrong time bucket. Always use Event Time with bounded watermarks.",
        "Avoid single-row inserts into ClickHouse; buffer events and write in micro-batches (e.g. 5,000 rows at once) to avoid creating millions of tiny disk parts."
      ],
      interview: [
        "Explain the difference between Tumbling Windows, Sliding Windows, and Session Windows in stream processing.",
        "How do Watermarks allow streaming engines like Flink to handle out-of-order and delayed network events?"
      ]
    },
    {
      id: "cdc-stream-processor",
      title: "Real-Time Change Data Capture (CDC) with PostgreSQL WAL & Elasticsearch",
      domain: "data",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Stream database mutations from PostgreSQL Write-Ahead Logs (WAL) to Elasticsearch with sub-second lag.",
      problem: "Syncing transactional database updates to secondary search engines (Elasticsearch, Redis) using application-level dual-writes results in race conditions, dropped updates on server crashes, and desynchronized search indexes.",
      outcome: "A reliable CDC streaming service using Debezium and PostgreSQL Logical Replication that streams row-level `INSERT`, `UPDATE`, and `DELETE` mutations into Kafka and Elasticsearch with zero application code changes.",
      stack: ["PostgreSQL (Logical Replication / WAL)", "Debezium", "Apache Kafka", "Elasticsearch / OpenSearch", "Python / Go"],
      diagram:
"Application Writes to PostgreSQL (Primary OLTP)\n                     │ (ACID Transaction)\n                     ▼\n┌────────────────────────────────────────┐\n│ PostgreSQL Write-Ahead Log (WAL)       │ (Logical Decoding Plugin: pgoutput)\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ Debezium CDC Connector                 │ ──► Reads WAL stream directly from disk\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ Kafka Topic (cdc.inventory.products)   │ (Contains Before & After Row JSON payloads)\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ Kafka Sink Consumer (Python / Go)      │ ──► Updates Elasticsearch Full-Text Index\n└────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: PostgreSQL Logical Decoding Setup", desc: "Configure PostgreSQL `wal_level=logical` and create a logical replication slot using the `pgoutput` plugin to capture row-level deltas." },
        { title: "Phase 2: Debezium & Kafka Ingestion", desc: "Deploy Debezium connector to read PostgreSQL transaction logs, publishing structured Change Data Capture events with `before` and `after` states." },
        { title: "Phase 3: Idempotent Elasticsearch Indexing", desc: "Build consumer workers that process Kafka change events, applying document upserts and handling `DELETE` operations using document versioning." },
        { title: "Phase 4: Replication Lag Monitoring", desc: "Measure end-to-end CDC replication lag (from database commit timestamp to Elasticsearch availability) and export Prometheus metrics." }
      ],
      resources: [
        { title: "Debezium Architecture Guide for PostgreSQL CDC", url: "https://debezium.io/documentation/reference/stable/connectors/postgresql.html" },
        { title: "PostgreSQL Logical Replication Documentation", url: "https://www.postgresql.org/docs/current/logical-replication.html" },
        { title: "Dual Writes vs Change Data Capture (Confluent)", url: "https://www.confluent.io/blog/no-more-dual-writes-how-to-use-database-change-data-capture/" }
      ],
      pitfalls: [
        "Unconsumed replication slots in PostgreSQL will retain WAL files on disk indefinitely, eventually filling the entire server hard drive. Always monitor replication slot lag.",
        "Ensure consumers handle out-of-order Kafka partition delivery by checking monotonic transaction sequence numbers (LSN)."
      ],
      interview: [
        "Why is Change Data Capture (CDC) via database WAL preferred over dual-writing in application microservices?",
        "What is a Log Sequence Number (LSN) in PostgreSQL, and how does it guarantee idempotent replay?"
      ]
    },
    {
      id: "geospatial-h3-indexing-pipeline",
      title: "Geospatial Big Data Analytics & Uber H3 Hexagonal Grid Engine",
      domain: "data",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Process millions of GPS coordinates into Uber H3 discrete hexagonal spatial indices for sub-millisecond ride matching.",
      problem: "Traditional latitude/longitude bounding-box queries (`ST_DWithin` on PostGIS) slow down significantly when aggregating millions of real-time GPS locations (ride-sharing surge pricing, delivery route tracking).",
      outcome: "A high-performance geospatial data pipeline that transforms billions of GPS telemetry points into 64-bit Uber H3 hexagonal cell indices, computing dynamic surge pricing heatmaps in sub-10ms.",
      stack: ["Python / Go", "Uber H3 Spatial Index", "PostGIS / DuckDB", "Kepler.gl / Mapbox", "FastAPI"],
      diagram:
"Raw GPS Coordinates [Lat: 37.7749, Lng: -122.4194, Timestamp]\n                            │\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ Uber H3 Spatial Encoder: geo_to_h3(lat, lng, res=9)    │\n│ Converts coordinates to 64-Bit Integer Index: 0x8928308280fffff\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ Hexagonal Spatial Aggregation Engine (DuckDB / Polars) │\n│ • Group by H3 Index ──► Count Active Drivers & Riders  │\n│ • Compute Supply/Demand Ratio ──► Surge Pricing Multiplier\n└───────────────────────────┬────────────────────────────┘\n                            ▼\nInteractive 3D Hexagonal Heatmap Rendered on Kepler.gl / Mapbox (60 FPS)",
      steps: [
        { title: "Phase 1: GPS Ingestion & H3 Hexagonal Indexing", desc: "Batch process OpenStreetMap / NYC Taxi GPS datasets, converting coordinates to multi-resolution H3 hexagonal cell IDs (Resolution 7–9)." },
        { title: "Phase 2: Fast Spatial Neighbor Traversal (k-Ring)", desc: "Use H3's discrete mathematical properties (`kRing(cell, 2)`) to find surrounding neighborhoods in constant time without trigonometry calculations." },
        { title: "Phase 3: Vectorized Columnar Analytics with DuckDB", desc: "Query billions of H3 records in DuckDB, computing hourly pickup densities, speed trends, and supply/demand ratios." },
        { title: "Phase 4: Kepler.gl Interactive Visualization", desc: "Export H3 GeoJSON layers and build an interactive 3D map dashboard showing real-time urban mobility patterns." }
      ],
      resources: [
        { title: "Uber H3: Discrete Global Grid System Overview", url: "https://h3geo.org/" },
        { title: "Kepler.gl Geospatial Data Visualization Tool", url: "https://kepler.gl/" },
        { title: "DuckDB Spatial Extension Documentation", url: "https://duckdb.org/docs/extensions/spatial" }
      ],
      pitfalls: [
        "Do not use square grids for spatial aggregation; squares have unequal neighbor distances (diagonals are $\\sqrt{2}$ further). Hexagons have identical distances to all 6 adjacent neighbors.",
        "Choose the correct H3 resolution level (Res 8 = ~460m, Res 9 = ~170m) to balance memory footprint and spatial precision."
      ],
      interview: [
        "Why did Uber engineer the H3 hexagonal hierarchical spatial index instead of using standard geohashes or square grids?",
        "How do discrete hexagonal grid systems turn complex polygon intersection queries into fast integer hash lookups?"
      ]
    },
    {
      id: "dag-workflow-orchestrator",
      title: "Distributed DAG Workflow Orchestrator (Mini-Airflow)",
      domain: "data",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a full data workflow orchestrator from scratch with topological DAG sorting, worker task queues, and web UI.",
      problem: "Complex data engineering workflows consist of interdependent tasks (extract -> transform -> train model -> send report). If upstream tasks fail or take too long, the orchestrator must manage dependency resolution, retries, concurrency limits, and execution history.",
      outcome: "A functional workflow management platform that parses Python DAG files, computes topological execution order, schedules tasks across workers, and renders a live interactive DAG status graph.",
      stack: ["Python", "NetworkX (Topological Sorting)", "PostgreSQL / SQLite", "Redis / Celery", "FastAPI / React"],
      diagram:
"DAG Definition: Task A ──► Task B ──► Task D\n                Task A ──► Task C ──► Task D\n                         │\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Scheduler Engine: Topological Graph Sort (Kahn's Algo) │\n│ Evaluates Upstream Dependencies:                       │\n│ • Task A completed? ──► Trigger Task B & Task C in parallel\n│ • Task B & C completed? ──► Trigger Task D             │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Distributed Worker Queue (Redis)                       │\n│ Dispatches tasks with timeout tracking & auto-retries  │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\nLive Web UI: Renders Graph Nodes (Green = Success, Red = Failed, Blue = Running)",
      steps: [
        { title: "Phase 1: DAG Data Structure & Cycle Detection", desc: "Build the `DAG` and `Task` classes in Python using NetworkX. Implement Kahn's topological sorting algorithm and detect circular dependency cycles." },
        { title: "Phase 2: Scheduler Daemon & State Machine", desc: "Build the continuous scheduler loop that evaluates task states (`UPSTREAM_FAILED`, `QUEUED`, `RUNNING`, `SUCCESS`, `RETRY`)." },
        { title: "Phase 3: Distributed Worker Pool & Retries", desc: "Dispatch executable tasks to a Redis queue. Handle process crashes, capture stdout/stderr logs, and enforce exponential backoff retries." },
        { title: "Phase 4: Interactive Web Graph UI", desc: "Build a React + React Flow dashboard that renders DAG topologies, displays live execution logs, and allows manual task re-triggering." }
      ],
      resources: [
        { title: "Apache Airflow Architecture Documentation", url: "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html" },
        { title: "Kahn's Algorithm for Topological Sorting (GeeksforGeeks)", url: "https://en.wikipedia.org/wiki/Topological_sorting" },
        { title: "React Flow: Interactive Node-Based Graph UI Library", url: "https://reactflow.dev/" }
      ],
      pitfalls: [
        "Avoid blocking the scheduler loop during task execution; the scheduler should only inspect state and dispatch work to background workers.",
        "Ensure cycle detection runs before execution to prevent the scheduler from deadlocking on cyclic graph loops."
      ],
      interview: [
        "How does Kahn's algorithm detect circular dependencies in a Directed Acyclic Graph?",
        "How do modern workflow orchestrators like Airflow and Prefect handle backfilling historical date partitions?"
      ]
    },
    {
      id: "columnar-parquet-query-engine",
      title: "Columnar Storage & Vectorized Query Execution Engine in Rust",
      domain: "data",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a DuckDB-style columnar query engine with dictionary encoding, bit-packing, and SIMD vector execution.",
      problem: "Row-oriented databases (PostgreSQL, MySQL) read entire rows into RAM, wasting immense I/O bandwidth during analytical aggregation queries (`SELECT AVG(salary) FROM employees`). Columnar formats (Parquet, Arrow) read only requested columns and execute SIMD vector instructions.",
      outcome: "A fast columnar query engine in Rust capable of reading compressed Parquet files, applying filter pushdown (predicate pushdown), and executing vectorized aggregations 20× faster than row engines.",
      stack: ["Rust", "Apache Arrow Format", "Parquet Encoding (Dictionary, Bit-Packing, RLE)", "SIMD Instructions"],
      diagram:
"Row-Oriented Layout (Wasteful for Analytics):   Columnar Layout (Vectorized & Fast):\n[ID:1, Name:\"Alex\", Age:28, Salary:90k]        Age Array:    [28, 34, 22, 45, 29] (Packed into SIMD)\n[ID:2, Name:\"Beth\", Age:34, Salary:120k]       Salary Array: [90k, 120k, 65k, 150k, 95k]\n[ID:3, Name:\"Carl\", Age:22, Salary:65k]        \n                                                Query: SELECT AVG(Salary) WHERE Age > 30\n                                                1. Predicate Pushdown: Evaluates only Age column\n                                                2. SIMD Vector Instruction: Processes 8 floats per CPU cycle!\n                                                3. Zero reads on ID and Name columns!",
      steps: [
        { title: "Phase 1: Columnar Chunk Data Structures", desc: "Design columnar contiguous memory arrays in Rust using Apache Arrow data types (Int32Array, Float64Array, Utf8Array) with null validity bitmasks." },
        { title: "Phase 2: Encoding & Compression Schemes", desc: "Implement Dictionary Encoding for low-cardinality strings, Run-Length Encoding (RLE) for repeated values, and Bit-Packing for small integers." },
        { title: "Phase 3: Predicate Pushdown & Column Pruning", desc: "Build metadata statistics (Min/Max per row group) to skip reading entire chunks of data from disk when filters (`WHERE age > 60`) are outside block bounds." },
        { title: "Phase 4: SIMD Vectorized Execution Engine", desc: "Implement chunked vectorized expression evaluation (processing batches of 1,024 elements per step) with SIMD vector instructions." }
      ],
      resources: [
        { title: "Apache Arrow Columnar Memory Format", url: "https://arrow.apache.org/overview/" },
        { title: "The Parquet Format: Columnar Storage for Big Data", url: "https://parquet.apache.org/docs/" },
        { title: "DuckDB Internal Architecture (VLDB 2019 Paper)", url: "https://duckdb.org/pdf/vldb2019.pdf" }
      ],
      pitfalls: [
        "Do not evaluate expressions element-by-element with dynamic trait dispatch in tight loops; compiler loop vectorization fails unless data is stored in contiguous flat arrays.",
        "Always maintain separate null bitmasks so null value checks do not require branching logic during mathematical aggregation."
      ],
      interview: [
        "Why are columnar storage formats significantly faster for analytical OLAP queries compared to row-oriented OLTP databases?",
        "Explain how Predicate Pushdown (Min/Max statistics) minimizes disk I/O in Parquet storage engines."
      ]
    },
    {
      id: "distributed-mapreduce-engine",
      title: "Distributed MapReduce Engine & Fault-Tolerant Worker Pool",
      domain: "data",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a Google MapReduce / Hadoop style distributed compute cluster from scratch in Go.",
      problem: "Processing terabytes of data on a single machine causes out-of-memory crashes. The MapReduce framework distributes computation across hundreds of cheap commodity servers, handling network failures and straggler workers gracefully.",
      outcome: "A complete distributed MapReduce framework in Go consisting of a Master coordinator and multiple Worker nodes that partitions large text datasets, runs parallel Map and Reduce tasks over RPC, and survives worker crashes.",
      stack: ["Go (Goroutines & Channels)", "gRPC / Net RPC", "File Partitioning & Hashing", "Linux Process Management"],
      diagram:
"Input Files (split.1, split.2, split.3)\n                 │\n                 ▼\n┌────────────────────────────────────────┐\n│ Master / Coordinator Node              │ ──► Assigns Map Tasks to idle workers\n└────────────────┬───────────────────────┘\n                 ├────────────────────────────────────────┐\n                 ▼                                        ▼\n┌─────────────────────────────────┐      ┌─────────────────────────────────┐\n│ Worker 1: Map(split.1)          │      │ Worker 2: Map(split.2)          │\n│ Emits Intermediate: (key, val)  │      │ Emits Intermediate: (key, val)  │\n│ Partitions into R buckets via   │      │ Partitions into R buckets via   │\n│ ihash(key) % R                  │      │ ihash(key) % R                  │\n└────────────────┬────────────────┘      └────────────────┬────────────────┘\n                 └───────────────────┬────────────────────┘\n                                     │ Shuffle & Sort Phase\n                                     ▼\n┌──────────────────────────────────────────────────────────────────┐\n│ Worker 3: Reduce(Bucket 0) ──► Aggregates & Emits Final Output   │\n└──────────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: RPC Protocol & Master State Machine", desc: "Build the Master coordinator in Go managing task assignments (`IDLE`, `IN_PROGRESS`, `COMPLETED`) and tracking worker heartbeats." },
        { title: "Phase 2: Map Task Execution & Hash Partitioning", desc: "Workers read assigned file chunks, apply the user-defined `Map()` function, and partition intermediate key-value pairs into $R$ intermediate disk files using `ihash(key) % R`." },
        { title: "Phase 3: Shuffle & Reduce Phase", desc: "Once all Map tasks complete, the master dispatches Reduce tasks. Workers pull intermediate files across the network, sort by key, and run the `Reduce()` function." },
        { title: "Phase 4: Fault Tolerance & Straggler Handling", desc: "Simulate worker crashes: if a worker stops sending heartbeats for 10s, the master re-assigns its tasks to other workers. Implement backup speculative execution for slow workers." }
      ],
      resources: [
        { title: "Dean & Ghemawat — MapReduce: Simplified Data Processing on Large Clusters (Google 2004)", url: "https://research.google/pubs/pub62/" },
        { title: "MIT 6.824: Distributed Systems MapReduce Lab in Go", url: "https://pdos.csail.mit.edu/6.824/labs/lab-mr.html" }
      ],
      pitfalls: [
        "Do not allow Reduce tasks to start before ALL Map tasks have completed; the shuffle phase requires complete intermediate partitions across the entire dataset.",
        "Ensure Map intermediate file writes are atomic (write to a temporary file and rename on completion) to prevent partial output corruption if a worker crashes midway."
      ],
      interview: [
        "How does MapReduce handle worker node failures during the Map phase versus the Reduce phase?",
        "What is the 'Straggler Problem' in distributed compute clusters, and how does speculative execution solve it?"
      ]
    },
    {
      id: "lakehouse-iceberg-metadata-engine",
      title: "ACID Lakehouse Table Format & Metadata Engine",
      domain: "data",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "4–6 weeks",
      tagline: "Build an Apache Iceberg / Delta Lake style metadata engine with ACID snapshot isolation and time-travel queries.",
      problem: "Traditional data lakes (folders of Parquet files on S3) lack ACID transactions: concurrent writes produce corrupt data, renaming directories on S3 is slow $O(N)$, and there is no way to roll back to historical snapshots.",
      outcome: "A functional lakehouse metadata engine that organizes Parquet files using hierarchical snapshot trees, supporting atomic concurrent writes with Optimistic Concurrency Control (OCC) and SQL time-travel queries (`SELECT * FROM table AS OF TIMESTAMP`).",
      stack: ["Python / Rust", "Apache Iceberg Architecture", "Parquet / DuckDB", "Optimistic Concurrency Control (OCC)"],
      diagram:
"Table Metadata JSON: table_metadata.json (Points to Current Snapshot S3)\n                          │\n                          ▼\nSnapshot S3 (ID: 104) ──► Manifest List: snap-104.avro\n                               │\n                 ┌─────────────┴─────────────┐\n                 ▼                           ▼\n        Manifest File A             Manifest File B\n        • file_1.parquet (Min:1,Max:50) • file_3.parquet (Min:100,Max:150)\n        • file_2.parquet (Min:51,Max:99)• file_4.parquet (Min:151,Max:200)\n\nAtomic Commit via OCC: To write new data:\n1. Write file_5.parquet to storage\n2. Create Snapshot S4 referencing Manifest List\n3. Swap table_metadata.json pointer atomically using compare-and-swap (CAS)",
      steps: [
        { title: "Phase 1: Hierarchical Metadata Tree Design", desc: "Design the 3-tier metadata architecture: `TableMetadata` -> `ManifestList` -> `ManifestFiles` -> Data Parquet Files with column-level min/max statistics." },
        { title: "Phase 2: Optimistic Concurrency Control (OCC) Commits", desc: "Implement atomic commit protocols: concurrent writers create new snapshot trees and attempt atomic compare-and-swap (CAS) on the metadata pointer." },
        { title: "Phase 3: File Pruning & Vectorized Query Routing", desc: "Use manifest metadata statistics to prune irrelevant data files during query planning before touching actual Parquet files." },
        { title: "Phase 4: Time-Travel & Snapshot Rollback CLI", desc: "Implement time-travel query syntax allowing users to read the table state as it existed at any historical snapshot timestamp." }
      ],
      resources: [
        { title: "Apache Iceberg Table Specification", url: "https://iceberg.apache.org/spec/" },
        { title: "Delta Lake: High-Performance ACID Table Storage over Data Lakes", url: "https://delta.io/" },
        { title: "Armbrust et al. — Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics (CIDR 2021)", url: "https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf" }
      ],
      pitfalls: [
        "Never perform in-place mutations on existing data files; lakehouse table formats are strictly append-only with immutable snapshot pointers.",
        "Ensure conflict resolution logic detects if two concurrent commits modified the exact same partition or data rows before retrying."
      ],
      interview: [
        "How do modern lakehouse formats (Iceberg, Delta Lake) provide ACID transactions over object storage like AWS S3?",
        "Explain how Manifest Pruning allows Iceberg to plan queries over petabyte datasets without listing S3 object directories."
      ]
    },
    {
      id: "distributed-timeseries-aggregator",
      title: "Time-Series In-Memory Aggregator with Gorilla Compression",
      domain: "data",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "6–8 weeks",
      tagline: "Build a Prometheus/InfluxDB style time-series database with Facebook Gorilla delta-of-delta and XOR float compression.",
      problem: "Storing billions of timestamped floating-point telemetry metrics (CPU, memory, sensor data) requires massive RAM. Uncompressed storage wastes 16 bytes per data point (8 bytes timestamp + 8 bytes float).",
      outcome: "A high-performance time-series database in Rust/C++ that compresses metric points from 16 bytes down to 1.37 bytes using Gorilla compression, supporting sub-millisecond range queries and rollups.",
      stack: ["Rust / C++", "Facebook Gorilla Compression Algorithm", "PromQL Query Lexer / Evaluator", "Memory-Mapped Files"],
      diagram:
"Incoming Metric Stream: (t=1600000000, val=42.500), (t=1600000010, val=42.505), (t=1600000020, val=42.505)\n                                            │\n                                            ▼\n┌────────────────────────────────────────────────────────────────────────┐\n│ Facebook Gorilla Compression Engine                                    │\n│ • Timestamp: Delta-of-Delta Encoding                                   │\n│   Δ1 = 10s, Δ2 = 10s ──► Delta-of-Delta D = 0 ──► Stored as 1 BIT ('0')!\n│ • Float Value: XOR Floating-Point Encoding                             │\n│   val1 XOR val2 ──► Identical bits produce zero ──► Stored in ~2 BITS! │\n└───────────────────────────────────┬────────────────────────────────────┘\n                                    ▼\nMemory Reduction: 16 Bytes per Point ──► 1.37 Bytes (12× RAM Compression!)\n                                    │\n                                    ▼\nPromQL Style Range Query Evaluator: rate(cpu_usage[5m]) ──► Sub-1ms Execution",
      steps: [
        { title: "Phase 1: Gorilla Timestamp Delta-of-Delta Compression", desc: "Implement variable-length bit-level delta-of-delta timestamp encoding ($D = (t_i - t_{i-1}) - (t_{i-1} - t_{i-2})$) to compress predictable sensor intervals to 1 single bit." },
        { title: "Phase 2: Floating-Point XOR Compression", desc: "Implement floating-point XOR encoding: if subsequent float values are identical or have leading/trailing zeroes, store only meaningful variable bits." },
        { title: "Phase 3: Chunked Ring Buffer & Inverted Index", desc: "Organize data into 2-hour compressed chunks. Build an inverted index mapping metric labels (`{app=\"api\", host=\"server-1\"}`) to series IDs." },
        { title: "Phase 4: PromQL Query Engine & Downsampling", desc: "Build a query evaluator supporting `rate()`, `avg_over_time()`, and automated multi-tier downsampling (5m, 1h rollups) for long-term retention." }
      ],
      resources: [
        { title: "Pelkonen et al. — Gorilla: A Fast, Scalable, In-Memory Time Series Database (Facebook 2015)", url: "https://www.vldb.org/pvldb/vol8/p1816-teller.pdf" },
        { title: "Prometheus 2.0 TSDB Architecture Guide", url: "https://fabxc.org/tsdb/" },
        { title: "VictoriaMetrics Architecture Overview", url: "https://docs.victoriametrics.com/Single-server-VictoriaMetrics.html" }
      ],
      pitfalls: [
        "Gorilla compression operates at the raw bit level; writing individual bytes is insufficient. You must implement a custom bit-stream writer and reader.",
        "Ensure out-of-order metric points are buffered in a temporary append window before finalizing compressed immutable blocks."
      ],
      interview: [
        "Explain the mathematical mechanics of Delta-of-Delta timestamp compression in Facebook Gorilla.",
        "How does floating-point XOR encoding achieve over 10x compression on real-world time-series metrics?"
      ]
    }
  ]);
})(window.TD = window.TD || {});
