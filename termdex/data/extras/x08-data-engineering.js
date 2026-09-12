/* Real-world examples and step-by-step flows — Data Engineering. */
TD.attach("data-engineering", {

"Data Pipeline": {
 ex: { h: "The plumbing behind the Monday morning dashboard",
       b: "Someone opens a report at nine and sees yesterday's revenue. Behind that number: eleven source systems, a scheduled extract, a deduplication step, three joins and a test suite — all of which ran at 3am and none of which anyone thinks about until the number is missing." },
 fl: { t: "What every pipeline has to handle",
       s: ["Data is produced somewhere you do not control",
           { s: "Extract it on a schedule or as a stream", n: "The source will change its schema without telling you." },
           { s: "Validate before transforming", n: "Bad data caught at the door is cheap; caught in a dashboard it is expensive." },
           { q: "Did a step fail halfway through?",
             y: "The run must be safe to repeat — idempotent writes, not appends",
             n: "Load, then publish freshness metadata" },
           "Alert on data that did not arrive, not just on jobs that errored"] }
},

"ETL": {
 ex: { h: "Clean it on the way in",
       b: "When warehouse compute was expensive and rented by the hour, you transformed on your own servers and loaded only the finished result. That constraint is mostly gone, but ETL still wins where you must not land raw data at all — personal data that has to be masked before it crosses a boundary." },
 fl: { t: "The classic order",
       s: ["Extract from the source system",
           { s: "Transform on separate compute", n: "Joins, cleaning, aggregation — before the warehouse sees anything." },
           { q: "Does the raw data need to stay outside the warehouse?",
             y: "ETL — mask or drop sensitive fields before loading",
             n: "ELT is usually simpler and cheaper today" },
           { s: "Load the finished tables", n: "Small, clean and immediately queryable." },
           "Debugging is harder — the intermediate data is gone unless you deliberately kept it"] }
},

"ELT": {
 ex: { h: "Land it raw, sort it out in SQL",
       b: "Cloud warehouses made compute elastic, so the cheapest place to transform became the place the data already is. The real win is not speed but recovery: when a transform is found to be wrong, the raw data is still sitting there and you can rebuild without re-extracting anything." },
 fl: { t: "The modern default",
       s: ["Extract and load raw data as-is",
           { s: "Keep it in a bronze layer, immutable and append-only", n: "Your permanent record of what the source actually sent." },
           { s: "Transform inside the warehouse with SQL", n: "Version-controlled and tested — this is what dbt is for." },
           { q: "A transform turns out to be wrong?",
             y: "Fix the SQL and rebuild from raw — no re-extraction needed",
             n: "Publish the modelled tables" },
           "Storage is cheap; the raw layer is your insurance policy — do not prune it eagerly"] }
},

"Batch Processing": {
 ex: { h: "Everything that can wait until tonight",
       b: "Payroll, billing runs, daily reporting, model retraining. Batch is unfashionable and it is what most of the world's data still runs on, because one job over a bounded dataset is dramatically easier to reason about, test and re-run than a stream that never ends." },
 fl: { t: "A well-behaved batch job",
       s: ["A schedule fires for a specific time window",
           { s: "Read only that window's data", n: "Partitioned by date so the read is cheap." },
           { q: "Has this window been processed before?",
             y: "Overwrite the partition — the run must be idempotent",
             n: "Write it and record the watermark" },
           { s: "Late-arriving data breaks the window assumption", n: "Either reprocess recent windows or accept the gap explicitly." },
           "Make every job safe to re-run — you will re-run it, often at 4am"] }
},

"Stream Processing": {
 ex: { h: "Fraud has to be caught before the payment clears",
       b: "A daily batch tells you about the fraud tomorrow, which is worth very little. Streaming keeps a running state per card and scores each transaction as it arrives — and buys that latency with genuine difficulty: out-of-order events, late data, and state that must survive a crash." },
 fl: { t: "Handling an unbounded stream",
       s: ["Events arrive continuously and out of order",
           { s: "Use event time, not arrival time", n: "A phone that was offline sends yesterday's events today." },
           { s: "Group them into windows to aggregate", n: "Tumbling, sliding or session windows." },
           { q: "An event arrives after its window closed?",
             y: "A watermark plus allowed lateness decides — update the result or send it to a side output",
             n: "Emit the window result" },
           "Checkpoint state regularly, or a restart loses every counter you were keeping"] }
},

"Apache Kafka": {
 ex: { h: "One log, many readers, no coupling",
       b: "Before Kafka, adding a fraud system meant persuading the payments team to also call your endpoint. After it, payments writes to a topic and anyone reads it at their own pace, including a consumer that did not exist when the event was written. Retention is what makes that possible — the log keeps events after they are read." },
 fl: { t: "How a message reaches consumers",
       s: ["A producer appends a record to a topic",
           { s: "Its key decides the partition", n: "Same key, same partition — which is the only ordering guarantee you get." },
           { s: "The record is replicated across brokers and persisted", n: "Consumers do not delete it; retention does, on a timer." },
           { q: "Multiple consumers of the same topic?",
             y: "One consumer group per application — each gets every message independently",
             n: "Within a group, partitions are split across members" },
           "Consumers track their own offset — replay is just moving it backwards"] }
},

"Apache Spark": {
 ex: { h: "The same code on a laptop and on two hundred machines",
       b: "It succeeded because it kept intermediate data in memory instead of writing to disk between every stage, which made iterative work — machine learning, repeated joins — an order of magnitude faster than MapReduce. The DataFrame API then made it accessible to people who were never going to write Scala." },
 fl: { t: "Why your job is slow",
       s: ["You write a DataFrame transformation",
           { s: "Nothing runs — transformations are lazy", n: "The plan is built until an action forces execution." },
           { s: "Catalyst optimises the plan and splits it into stages", n: "Stage boundaries are shuffles." },
           { q: "Does a stage shuffle a lot of data?",
             y: "That is your cost — broadcast small tables, repartition, or fix skew",
             n: "Check partition count: too few wastes the cluster, too many wastes overhead" },
           "Read the Spark UI's stage timeline before tuning anything — guessing is expensive here"] }
},

"Hadoop": {
 ex: { h: "The system that made *big data* an industry",
       b: "Its idea was to stop moving data to the computation and move computation to the data, across cheap machines that were expected to fail. Almost nobody starts a Hadoop cluster today — object storage plus elastic compute won — but the separation of storage from compute it forced is the foundation of everything that replaced it." },
 fl: { t: "What it did and what replaced each part",
       s: ["HDFS stored huge files across commodity disks",
           { s: "Replaced by S3 and equivalent object storage", n: "Cheaper, managed, and infinitely elastic." },
           { s: "MapReduce ran computation next to the data", n: "Replaced by Spark, then by warehouse SQL engines." },
           { q: "Do you still need locality of compute and storage?",
             y: "Rarely — network bandwidth grew faster than the assumption held",
             n: "Separate them: it is the reason cloud data platforms scale independently" },
           "The concepts survive; the operational burden of running it does not"] }
},

"MapReduce": {
 ex: { h: "Count the words in every book in the library",
       b: "Hand each of a hundred people a shelf and ask for counts (map), then have ten people each merge the counts for a slice of the alphabet (reduce). The pattern is why distributed computation became routine — and why *everything must be expressed as map and reduce* eventually became too restrictive to keep." },
 fl: { t: "The three phases",
       s: ["Map: each worker processes its own chunk independently",
           { s: "Emitting key-value pairs", n: "No coordination between workers — that is what makes it parallel." },
           { s: "Shuffle: pairs are sorted and grouped by key across the network", n: "The expensive phase, and where jobs actually die." },
           { q: "Is one key far more common than the rest?",
             y: "That reducer gets all of it — classic skew, and the job stalls on one task",
             n: "Reduce: aggregate each key's values" },
           "A combiner running reduce logic locally after map cuts shuffle volume dramatically"] }
},

"HDFS": {
 ex: { h: "A filesystem that assumes disks die",
       b: "Split a 10 TB file into 128 MB blocks, put three copies of each block on different machines, and a failed disk becomes a background re-replication rather than an incident. It is optimised for one specific pattern — write once, read whole file, many times — and is genuinely bad at small files and random writes." },
 fl: { t: "Reading a file",
       s: ["The client asks the NameNode where the blocks are",
           { s: "The NameNode holds all metadata in memory", n: "Which is why millions of small files kill it — each one costs metadata." },
           { s: "The client reads blocks directly from DataNodes", n: "Metadata and data travel separate paths." },
           { q: "A DataNode is unreachable?",
             y: "Read the replica elsewhere; the NameNode re-replicates in the background",
             n: "Stream the blocks in order" },
           "Files are append-only — modifying in place is not part of the model"] }
},

"Apache Airflow": {
 ex: { h: "Cron with memory and a map",
       b: "Twelve jobs where the seventh depends on the third and fifth is beyond cron the moment one fails. Airflow makes dependencies explicit, retries individual tasks, and shows you exactly which node in the graph broke — and its most-abused feature is that Python DAG files run on every scheduler parse, so heavy imports there slow the whole system." },
 fl: { t: "A DAG run, step by step",
       s: ["The scheduler notices an interval is due",
           { s: "It creates a DAG run for that logical date", n: "Tasks receive the interval, not `now()` — which is what makes backfills correct." },
           { q: "Are a task's upstream dependencies successful?",
             y: "Queue it — an executor picks it up",
             n: "Wait, or skip according to the trigger rule" },
           { s: "Failed tasks retry on their own schedule", n: "Only the failed branch reruns, not the whole DAG." },
           "Keep the DAG file cheap to import — it is parsed constantly, not just at run time"] }
},

"Directed Acyclic Graph": {
 ex: { h: "Dependencies you can actually resolve",
       b: "Build systems, task schedulers, Spark plans and git history are all DAGs. The *acyclic* part is what does the work: with no cycles there is always a valid order to run things in, and *what depends on this* has a finite answer. Add one cycle and the whole model collapses." },
 fl: { t: "Scheduling from a dependency graph",
       s: ["Model each unit of work as a node, each dependency as an edge",
           { q: "Is there a cycle?",
             y: "Nothing can start — detect it and fail loudly at definition time",
             n: "A topological sort gives a valid execution order" },
           { s: "Nodes with no unfinished dependencies can run in parallel", n: "The graph tells you exactly how much parallelism exists." },
           { s: "A failure blocks only its descendants", n: "Independent branches carry on." },
           "The critical path through the graph is the floor on total run time"] }
},

"dbt": {
 ex: { h: "Software engineering, applied to SQL",
       b: "Warehouse logic used to live in scheduled queries nobody could find, review or test. dbt makes each model a file in git, infers the dependency graph from `ref()` calls, and runs assertions after every build — bringing version control, code review and tests to the analytics layer that never had them." },
 fl: { t: "What `dbt run` does",
       s: ["Each model is a SELECT statement in a file",
           { s: "`ref('other_model')` declares a dependency", n: "dbt builds the DAG from these references — no manual ordering." },
           { s: "Models are compiled to SQL and executed in order", n: "As tables or views, according to their materialisation." },
           { q: "Is the table large and mostly unchanged?",
             y: "Materialise incrementally — process only new rows",
             n: "Full rebuild: simpler and safe to prefer until it hurts" },
           "Tests run after the build — unique, not-null and relationship assertions catch most breakage"] }
},

"Apache Flink": {
 ex: { h: "Streaming that takes state seriously",
       b: "Spark Streaming was micro-batching wearing a stream's clothes. Flink was built stream-first, with proper event-time handling and distributed snapshots — so a job holding per-user state across days can be restarted, rescaled or upgraded without losing count. That is what exactly-once actually requires." },
 fl: { t: "How exactly-once survives a crash",
       s: ["Operators keep local state as events flow through",
           { s: "Periodic barriers flow through the stream", n: "When a barrier passes, that operator's state is snapshotted." },
           { s: "A consistent global checkpoint is written to durable storage", n: "All operators aligned to the same point in the stream." },
           { q: "A machine dies?",
             y: "Restore every operator from the last checkpoint and rewind the source offsets",
             n: "Continue processing" },
           "Exactly-once holds end to end only if your sink is transactional or idempotent"] }
},

"Data Warehouse": {
 ex: { h: "One place where the revenue number is settled",
       b: "Finance, sales and product each computed *active customers* from their own system and got three answers, which is how most warehouse projects begin. The value is less the technology than the agreement: one modelled definition, one place, one number that survives a meeting." },
 fl: { t: "How data becomes a trusted table",
       s: ["Land raw data from every source system",
           { s: "Conform keys and definitions across sources", n: "The genuinely hard part, and it is organisational as much as technical." },
           { s: "Model into facts and dimensions", n: "So business questions become straightforward joins." },
           { q: "Do two teams define the metric differently?",
             y: "Resolve it once, in the warehouse — do not ship both",
             n: "Publish it with an owner and documentation" },
           "Columnar storage means adding columns is cheap and `SELECT *` is expensive"] }
},

"Data Lake": {
 ex: { h: "Keep everything now, decide later",
       b: "Clickstream, logs, sensor readings and PDFs, stored raw because storage is cheap and today's useless field is next year's feature. The failure mode has a name — the data swamp — and it arrives the moment nobody can tell what is in a bucket, who owns it, or whether it is still correct." },
 fl: { t: "Keeping a lake usable",
       s: ["Write raw data in an organised, partitioned layout",
           { s: "Partition by ingestion date at minimum", n: "Unpartitioned lakes force full scans forever." },
           { q: "Can someone find and understand this dataset without asking a person?",
             y: "It is catalogued — owner, schema and freshness are recorded",
             n: "You are building a swamp, whatever the storage costs" },
           { s: "Add table formats for transactions and schema enforcement", n: "Iceberg or Delta — this is the lakehouse step." },
           "Set retention and access policies at creation, not after an audit"] }
},

"Lakehouse": {
 ex: { h: "Warehouse guarantees on lake economics",
       b: "The old choice was a warehouse you could trust but not afford for raw data, or a lake you could afford but not trust. A table format over object storage gives transactions, schema enforcement and time travel on the cheap files — one copy of the data, several engines reading it." },
 fl: { t: "What the table format adds",
       s: ["Data files sit in object storage — Parquet, unchanged",
           { s: "A metadata layer tracks which files make up the table now", n: "The table is a pointer to a file list, not a directory scan." },
           { q: "Two writers commit at once?",
             y: "Atomic metadata swap — one wins, the other retries; readers never see half a write",
             n: "A new snapshot is published" },
           { s: "Old snapshots stay readable", n: "Time travel, and rollback of a bad load, come free from this." },
           "Expire old snapshots on a schedule, or metadata and storage grow without bound"] }
},

"Apache Iceberg": {
 ex: { h: "The table format that is nobody's product",
       b: "Its neutrality is the feature: Spark, Trino, Flink and Snowflake can all read and write the same tables, so the storage layer stops being a vendor decision. Hidden partitioning is the practical win — you query `WHERE event_time > …` and Iceberg prunes partitions without you naming the partition column." },
 fl: { t: "How a query prunes files",
       s: ["The engine reads the current table metadata",
           { s: "A manifest lists every data file with column statistics", n: "Min and max values per column, per file." },
           { q: "Can the filter exclude a file from its statistics alone?",
             y: "Skip it entirely — no bytes read",
             n: "Read it and filter rows" },
           { s: "Partition evolution changes layout without rewriting history", n: "Old files keep their old scheme; new ones use the new." },
           "Schema changes are tracked by column id, so renaming a column does not lose data"] }
},

"Delta Lake": {
 ex: { h: "A transaction log next to your Parquet",
       b: "The `_delta_log` directory records every commit as an ordered set of JSON actions, and the table's current state is that log replayed. That is what buys ACID on object storage, and it is also why `MERGE INTO` — impossible on plain files — became routine for change-data-capture upserts." },
 fl: { t: "Reading and writing a Delta table",
       s: ["A writer produces new Parquet files",
           { s: "It commits a JSON entry naming files added and removed", n: "Atomically — the commit is the source of truth, not the directory." },
           { s: "Readers replay the log to learn the current file set", n: "Checkpoints every ten commits keep replay fast." },
           { q: "Need the table as it was last Tuesday?",
             y: "Read the log up to that version — time travel",
             n: "Read the latest snapshot" },
           "`VACUUM` deletes files older than the retention window — and destroys time travel past it"] }
},

"Parquet": {
 ex: { h: "Three columns out of two hundred",
       b: "A CSV forces you to read every byte of every row to get one field. Parquet stores column by column, so the query reads three columns and skips the rest — often ten to a hundred times less I/O, plus far better compression because similar values sit together." },
 fl: { t: "Why a Parquet query is fast",
       s: ["The file is divided into row groups",
           { s: "Within each, data is stored column by column", n: "Homogeneous values compress dramatically better than mixed rows." },
           { s: "Each column chunk carries min/max statistics", n: "Read from the footer before any data." },
           { q: "Does the filter fall outside a chunk's range?",
             y: "Skip the chunk without decompressing it",
             n: "Decompress and scan only the requested columns" },
           "Many tiny Parquet files defeat all of this — compact them into files of at least a hundred megabytes"] }
},

"Avro": {
 ex: { h: "Row-shaped, schema attached",
       b: "Analytics reads columns; a Kafka consumer reads whole records one at a time, and for that Parquet's layout is wasted. Avro carries its schema with the data and evolves cleanly — which is exactly why it is the default for event streams and the wrong choice for a warehouse table." },
 fl: { t: "Evolving a schema safely",
       s: ["Producers and consumers agree on a schema, held in a registry",
           { q: "Adding a field?",
             y: "Give it a default — old readers ignore it, new readers get the default on old data",
             n: "Removing a field needs a default too, for readers still expecting it" },
           { s: "Renaming a field is not a safe change", n: "Use an alias, or it reads as a delete plus an add." },
           { s: "The registry rejects incompatible changes at publish time", n: "Which is the entire reason to run one." },
           "Compatibility mode — backward, forward or full — must be a deliberate decision per topic"] }
},

"ORC": {
 ex: { h: "Parquet's Hive-shaped twin",
       b: "Same columnar idea, born in the Hive ecosystem rather than the Impala one. It has slightly better built-in indexing and predicate pushdown in some engines; Parquet has wider support everywhere else. In practice the right answer is whichever your engines and table format prefer — do not agonise." },
 fl: { t: "Choosing between them",
       s: ["You need a columnar format",
           { q: "Is your stack Hive, or heavily Spark-on-Hive?",
             y: "ORC — its indexes and ACID support integrate more tightly there",
             n: "Parquet — broader support across engines, clouds and languages" },
           { s: "Both compress well and both skip columns", n: "The performance difference is usually smaller than file sizing and partitioning." },
           "Do not mix formats in one table unless your table format explicitly supports it"] }
},

"Partitioning": {
 ex: { h: "Filing by month so you never open the wrong drawer",
       b: "A query for January reads January's folder, and the other eleven twelfths of the table are never touched. The mistake is partitioning by something high-cardinality — user id — which creates millions of tiny files and makes everything slower than not partitioning at all." },
 fl: { t: "Choosing how to split a huge table",
       s: [{ s: "A table too large to scan is split into chunks, physically stored apart", n: "A query that only needs one chunk then skips the rest entirely — often a hundred times less work." },
           { s: "You choose one column to split on, and that choice decides everything", n: "Get it right and most queries touch one chunk. Get it wrong and they all touch everything." },
           { s: "Pick the column that nearly every query already filters on", n: "Usually a date, because most questions are about a period: last week, last month, this year." },
           { q: "How many different values does that column have?",
             y: "A manageable number — 365 days a year gives you sensible daily chunks",
             n: "One value per customer would shatter the table into millions of tiny files, and the overhead of tracking them costs more than the scan you saved" },
           { s: "Aim for chunks somewhere around a few hundred megabytes each", n: "Much smaller and you are paying more to open files than to read them." }] }
},

"Bucketing": {
 ex: { h: "Pre-sorting both sides so the join stops shuffling",
       b: "Joining two large tables normally means moving both across the network so matching keys meet. Bucket both by the join key into the same number of buckets and matching rows are already co-located — the shuffle disappears, and on big joins that is the difference between minutes and hours." },
 fl: { t: "When bucketing pays",
       s: ["Two large tables are joined repeatedly on the same key",
           { s: "Bucket both by that key, into the same bucket count", n: "The counts must match, or the optimisation does not apply." },
           { q: "Does the engine know both tables are bucketed identically?",
             y: "It performs a bucketed join — no shuffle",
             n: "You paid the write cost for nothing — verify with the query plan" },
           { s: "Buckets are fixed at write time", n: "Changing the count means rewriting the table." },
           "Only worth it for repeated joins on a stable key — one-off queries do not repay the cost"] }
},

"Change Data Capture": {
 ex: { h: "Reading the database's diary instead of asking it questions",
       b: "Polling `WHERE updated_at > x` misses hard deletes, misses rows updated twice, and loads the production database on a schedule. CDC reads the transaction log the database writes anyway — every insert, update and delete, in order, with almost no query load on the source." },
 fl: { t: "From source change to warehouse row",
       s: ["The database writes every change to its transaction log",
           { s: "A connector tails that log and emits events", n: "Debezium, or the cloud provider's managed equivalent." },
           { s: "Events land in a topic, keyed by primary key", n: "Ordering per key is preserved — which is essential." },
           { q: "Applying to an analytical table?",
             y: "MERGE on the key — upsert, and honour delete events",
             n: "Keep the full change history as a slowly changing dimension" },
           "Schema changes flow through as events too — handle them or the pipeline stops at 3am"] }
},

"Data Quality": {
 ex: { h: "The report was wrong for six weeks",
       b: "Nothing errored. An upstream team changed a currency field from pounds to pence and every number silently multiplied by a hundred. Data quality is the discipline of catching that at ingestion — because the alternative is catching it in a board meeting." },
 fl: { t: "Testing data like code",
       s: ["Write assertions about what must be true",
           { s: "Not null, unique, in a set, within a range, referentially valid", n: "Most breakages fail one of these five." },
           { s: "Run them at every pipeline stage, not just the end", n: "So you learn which stage broke it." },
           { q: "An assertion fails?",
             y: "Stop the pipeline — publishing bad data is worse than publishing nothing",
             n: "Record the result and continue" },
           "Add distribution checks — a valid value that has doubled in frequency is still a bug"] }
},

"Data Lineage": {
 ex: { h: "Answering *what breaks if I drop this column?*",
       b: "A column looks unused, someone removes it, and four dashboards and a machine-learning feature stop working the next morning. Lineage is the map that makes that question answerable in seconds — and it is equally the map auditors ask for when a regulated number needs tracing to its source." },
 fl: { t: "Knowing where a number came from",
       s: [{ s: "A dashboard shows a wrong figure. Which of two hundred tables produced it, through how many steps?", n: "Without an answer, finding out is a day of reading queries." },
           { s: "Lineage is a map of what feeds what, built automatically by reading the transformation code", n: "Every query names the tables it reads and the table it writes, so the map can be derived rather than maintained." },
           { s: "Never draw this map by hand", n: "A hand-drawn diagram is out of date within a fortnight and then actively misleading." },
           { q: "About to change or delete a table?",
             y: "Follow the map forwards. Everything that depends on it appears in a list before you break anything",
             n: "Chasing a wrong number instead? Follow the map backwards until you find the step where it first went wrong" },
           { s: "It also answers the question auditors ask", n: "\"Where exactly did this figure come from?\" is a lineage question, and a shrug is not an acceptable answer." }] }
},

"Data Governance": {
 ex: { h: "Who is allowed to see the salary column?",
       b: "Governance sounds like bureaucracy until the alternative is described: every engineer with production access can read every customer's medical history, and nobody can prove otherwise to a regulator. It is the difference between a data platform and a liability." },
 fl: { t: "Governing a new dataset",
       s: ["Classify it at creation",
           { s: "Public, internal, confidential, or personal data", n: "The classification drives everything else." },
           { q: "Does it contain personal data?",
             y: "Access by role, retention period, and a deletion path for subject requests",
             n: "Standard internal access controls" },
           { s: "Assign a named owner", n: "Unowned data is the root cause of most governance failures." },
           { s: "Log access to sensitive tables", n: "The audit trail is the point, not the paperwork." },
           "Automate the policy in the platform — governance that relies on people remembering does not hold"] }
},

"Data Catalog": {
 ex: { h: "The search engine for your own data",
       b: "A new analyst asks *where is the customer table* and gets four Slack answers, three of them stale. A catalog answers it with schema, owner, freshness, lineage and the last person who queried it — which is the difference between a two-day onboarding and a two-week one." },
 fl: { t: "Making a catalog that stays true",
       s: ["Harvest technical metadata automatically",
           { s: "Schemas, row counts, freshness, query frequency", n: "Anything hand-maintained will rot." },
           { s: "Attach human context: description, owner, caveats", n: "This part cannot be automated and is where the value is." },
           { q: "Is a table stale or deprecated?",
             y: "Mark it clearly — an out-of-date catalog is worse than none",
             n: "Surface popularity, so people find the table others trust" },
           "Integrate it into the query tool — a catalog nobody opens is shelfware"] }
},

"Data Contract": {
 ex: { h: "Turning an implicit dependency into an explicit promise",
       b: "The analytics pipeline breaks because a backend team renamed a field in a service they consider entirely their own. A contract makes that dependency visible and testable: the producer's CI fails on a breaking change, rather than the consumer's dashboard failing silently a day later." },
 fl: { t: "How a contract prevents breakage",
       s: ["Producer and consumers agree a schema and its semantics",
           { s: "Field types, nullability, allowed values, freshness, ownership", n: "Semantics matter as much as types — what does `status = 3` mean?" },
           { s: "The contract lives in the producer's repository", n: "So it is reviewed alongside the code that would break it." },
           { q: "Does a change violate the contract?",
             y: "CI fails before merge — the conversation happens at the right time",
             n: "Ship it; consumers are safe" },
           "Contracts are an organisational tool with a technical implementation — the agreement is the hard part"] }
},

"Schema Evolution": {
 ex: { h: "Adding a column without a migration weekend",
       b: "Adding an optional field with a default is safe: old readers ignore it, new readers see it. Renaming, retyping or removing a field is not, and the reason schema registries exist is to refuse the unsafe change at publish time rather than at 3am in a consumer you had forgotten about." },
 fl: { t: "Classifying a change",
       s: ["You need to change a dataset's structure",
           { q: "Can existing readers still read new data?",
             y: "Backward compatible — adding an optional field with a default",
             n: "Breaking — renames, type changes and required fields" },
           { s: "For a breaking change, publish a new version alongside", n: "Migrate consumers, then retire the old one on an announced date." },
           { s: "Table formats track columns by id, not name", n: "Which makes renames survivable there." },
           "Enforce compatibility in CI — a registry that only warns will be ignored"] }
},

"Star Schema": {
 ex: { h: "The shape that makes a dashboard fast",
       b: "One fact table of orders, surrounded by customer, product, date and store dimensions. Every business question — revenue by region by month — becomes one join per filter, which is why BI tools generate good SQL against it and terrible SQL against a normalised operational schema." },
 fl: { t: "Modelling a business process",
       s: ["Pick the process and its grain",
           { s: "*One row per order line* — decide this first and write it down", n: "Every later mistake traces back to a fuzzy grain." },
           { s: "Facts are the numbers: quantity, amount, cost", n: "Additive measures belong here." },
           { s: "Dimensions are the adjectives: who, what, where, when", n: "Deliberately denormalised — width is fine, joins are not." },
           { q: "Tempted to normalise a dimension?",
             y: "That is a snowflake — only do it when the dimension is genuinely enormous",
             n: "Keep it flat and fast" }] }
},

"Snowflake Schema": {
 ex: { h: "A star, normalised until it hurts",
       b: "Product splits into product, subcategory, category and department tables. It saves storage that nobody is short of and adds joins to every query, which is why it is a minority choice — with one honest exception: a dimension so large or so volatile that duplicating its attributes is genuinely painful." },
 fl: { t: "Star or snowflake?",
       s: ["You are designing a dimension",
           { q: "Is it huge, or does one attribute change constantly?",
             y: "Normalise that part out — snowflake it, for maintenance rather than storage",
             n: "Keep it flat — fewer joins, and BI tools generate better SQL" },
           { s: "Every extra level is another join in every query", n: "Which compounds across a dashboard with twelve tiles." },
           "Storage is cheap and analyst time is not — the default should be flat"] }
},

"Fact Table": {
 ex: { h: "The long, thin table everything points at",
       b: "Billions of rows, mostly foreign keys and a few numbers. Its discipline is the grain: one row per order line, or per shipment, or per day per store — never a mixture, because mixed grain is how a total silently double-counts and nobody can see why." },
 fl: { t: "Designing one",
       s: ["State the grain in one sentence",
           { s: "*One row per order line item*", n: "If you cannot say it plainly, the design is not finished." },
           { s: "Add foreign keys to every relevant dimension", n: "Narrow keys, not repeated descriptive text." },
           { q: "Is a measure additive across all dimensions?",
             y: "Store it directly — sums and rollups just work",
             n: "Ratios and balances need care: store numerator and denominator, not the ratio" },
           "Never mix grains in one table — split into separate fact tables instead"] }
},

"Dimension Table": {
 ex: { h: "The words on the axis of the chart",
       b: "Wide, comparatively small, and deliberately denormalised — every attribute anyone might group or filter by, in one table. `product_name`, `category`, `brand`, `is_seasonal` all live together so a query needs one join, not four." },
 fl: { t: "Building a good dimension",
       s: ["Collect every descriptive attribute of the entity",
           { s: "Include useful derived flags", n: "`is_weekend`, `fiscal_quarter` — computed once, used constantly." },
           { s: "Use a surrogate key, not the source system's id", n: "Source ids get reused, change format, or collide across systems." },
           { q: "Does an attribute change over time and matter historically?",
             y: "This is a slowly changing dimension — pick a type before loading",
             n: "Overwrite in place" },
           "Add an *unknown* row so facts with a missing key still join"] }
},

"Slowly Changing Dimension": {
 ex: { h: "A customer moves house",
       b: "Overwrite the address and every historical order looks as though it shipped to the new city — the revenue-by-region report silently rewrites its own past. SCD Type 2 keeps both rows with validity dates, so history stays true and the table grows. The choice is per attribute, not per table." },
 fl: { t: "Choosing a type",
       s: ["An attribute in a dimension changes",
           { q: "Does history need to reflect the old value?",
             y: "Type 2 — close the old row with an end date, insert a new current row",
             n: "Type 1 — overwrite; correcting a typo is exactly this case" },
           { s: "Type 2 requires facts to join on the surrogate key valid at the time", n: "Not the natural key — that is the detail people get wrong." },
           { s: "Type 3 keeps a single `previous_value` column", n: "For when only one step back matters." },
           "Decide per attribute: correct a misspelling with Type 1, track a region change with Type 2"] }
},

"Medallion Architecture": {
 ex: { h: "Bronze, silver, gold — and why the layers earn their keep",
       b: "Bronze is exactly what the source sent, never modified. Silver is cleaned, deduplicated and typed. Gold is modelled for consumption. The payoff arrives the day a transform is found to be wrong: you fix the silver logic and rebuild, because bronze never lost anything." },
 fl: { t: "Promoting data through the layers",
       s: ["Bronze: land raw, append-only, schema-on-read",
           { s: "Never edit bronze", n: "It is the audit record of what actually arrived." },
           { s: "Silver: deduplicate, cast types, apply quality rules", n: "One clean, conformed row per entity." },
           { q: "Is the data business-ready?",
             y: "Gold: aggregate and model into facts and dimensions",
             n: "Fix it in silver — never patch gold directly" },
           "Each layer is rebuildable from the one before, which is the whole point"] }
},

"Data Mesh": {
 ex: { h: "The central data team became the bottleneck",
       b: "Every request queues behind one team that understands the platform but not the domain. Mesh pushes ownership to the domain teams who know what the data means, with the platform team providing self-serve infrastructure — and it fails whenever it is adopted as a reorganisation without that platform actually existing." },
 fl: { t: "Whether it applies to you",
       s: ["Assess where the bottleneck actually is",
           { q: "Is a central team blocking many domains?",
             y: "Mesh may help — domain ownership plus a self-serve platform",
             n: "You probably need a better warehouse, not a reorganisation" },
           { s: "Domains publish data products with contracts and SLAs", n: "Owned like a service, not dumped like a file." },
           { s: "Federated governance sets global rules", n: "Interoperability and privacy stay central; modelling does not." },
           "Without a genuine self-serve platform, mesh is just distributed chaos with better vocabulary"] }
},

"Backfill": {
 ex: { h: "Two years of history, recomputed",
       b: "A bug is found in a revenue calculation that has been wrong since launch. The fix is one line; the backfill is the project — reprocessing every historical partition without knocking over the cluster, and without producing a report that changes underneath a reader mid-run." },
 fl: { t: "Running a safe backfill",
       s: ["Confirm the job is idempotent for a given window",
           { q: "Would re-running a day duplicate rows?",
             y: "Fix that first — overwrite the partition rather than appending",
             n: "It is safe to reprocess" },
           { s: "Run in chunks, oldest first, with limited parallelism", n: "A full-history backfill at once will starve production jobs." },
           { s: "Write to a parallel table and swap at the end", n: "So consumers never see a half-rebuilt table." },
           "Communicate before you start — historical numbers are about to change, and someone reports on them"] }
},

"Data Skew": {
 ex: { h: "199 tasks finished, one has been running for an hour",
       b: "A join on `customer_id` where one enterprise account holds 40% of all rows sends 40% of the data to a single worker. The cluster is idle and the job is stuck — and no amount of extra machines helps, because the problem is one key, not total capacity." },
 fl: { t: "Diagnosing and fixing it",
       s: ["Look at task durations, not the job total",
           { s: "One straggler among hundreds is the signature", n: "The Spark UI shows this immediately." },
           { s: "Count rows per key to find the culprit", n: "Nulls are a frequent and overlooked offender." },
           { q: "Is one side of the join small?",
             y: "Broadcast it — no shuffle, so no skew",
             n: "Salt the hot key: split it across n partitions, then aggregate the results" },
           "Filter nulls out of join keys explicitly — they all hash to one place"] }
},

"Windowing": {
 ex: { h: "*Per minute* over a stream that never ends",
       b: "You cannot average an infinite sequence, so you cut it into windows. The subtlety is which clock: group by arrival time and a phone that was offline all afternoon lands in the wrong bucket. Event time is almost always what the business means." },
 fl: { t: "Choosing a window",
       s: ["Decide what the aggregate is over",
           { q: "Non-overlapping fixed periods?",
             y: "Tumbling — every event in exactly one window, the simplest to reason about",
             n: "Sliding for overlapping trends; session windows for bursts of user activity" },
           { s: "Use event time and set a watermark", n: "The watermark declares how late you will still accept data." },
           { s: "Data later than the watermark is dropped or side-outputted", n: "Never silently — decide and log it." },
           "Longer windows mean more state to hold; that memory is a real operational limit"] }
},

"Exactly-Once Semantics": {
 ex: { h: "Charged once, despite three retries",
       b: "The network is unreliable, so messages get redelivered — that is at-least-once, and it is the honest default. Exactly-once is not magic: it is at-least-once delivery plus either transactional writes or an idempotent sink, so a duplicate arrives and changes nothing." },
 fl: { t: "Achieving it end to end",
       s: ["Accept that delivery will be at-least-once",
           { s: "The source must support replay from a recorded offset", n: "Kafka offsets, or a database log position." },
           { s: "Processing state must be checkpointed with those offsets", n: "State and position must advance atomically together." },
           { q: "Can the sink absorb a duplicate write harmlessly?",
             y: "Transactional commit, or upsert on a deterministic key — done",
             n: "Then you have at-least-once, whatever the framework advertises" },
           "*Exactly-once processing* and *exactly-once side effects* are different claims — read the docs carefully"] }
},

"Data Observability": {
 ex: { h: "The pipeline was green and the data was wrong",
       b: "Job monitoring tells you the code ran. Data observability tells you the table has 40% fewer rows than yesterday, a column has gone 90% null, and the average order value has tripled — none of which raises an exception anywhere." },
 fl: { t: "The signals worth tracking",
       s: ["Freshness: when did this table last update?",
           { s: "The single most valuable alert", n: "Stale data causes more bad decisions than wrong data." },
           { s: "Volume: is the row count within its usual range?", n: "A sudden halving is almost always upstream breakage." },
           { s: "Schema: has a column appeared, vanished or changed type?", n: "Detect it before the consumer does." },
           { q: "Has a column's distribution shifted?",
             y: "Alert — nulls, ranges and category mixes move before anything errors",
             n: "Record the profile as the new baseline" },
           "Alert the table's owner, not a shared channel nobody reads"] }
},

"Reverse ETL": {
 ex: { h: "The warehouse knows, but the sales rep does not",
       b: "A churn score computed nightly in the warehouse is useless to the person on the phone unless it appears in their CRM. Reverse ETL syncs modelled data back into operational tools — which quietly makes the warehouse a source of truth for systems that will act on it, with all the correctness pressure that implies." },
 fl: { t: "Syncing a model to an operational tool",
       s: ["Model the audience or attribute in the warehouse",
           { s: "One row per entity, with a stable identifier the target system knows", n: "Email or an external id — mapping is the fiddly part." },
           { s: "Detect what changed since the last sync", n: "Full syncs will exhaust the target's API rate limits." },
           { q: "Does the target already have a value from another source?",
             y: "Agree which system owns the field — silent overwrites cause real incidents",
             n: "Write, and handle partial failures with retries" },
           "A warehouse bug now shows up in customer-facing tools — treat these models as production code"] }
},

"Object Storage": {
 ex: { h: "Infinite disk with a very different shape",
       b: "S3 and its equivalents are why the modern data stack looks as it does: durable, cheap, effectively unlimited, and reachable from any compute. The catch is that it is not a filesystem — there is no rename, listing is slow at scale, and *directories* are only a prefix convention." },
 fl: { t: "Working with its actual model",
       s: ["Objects are immutable and addressed by key",
           { s: "*Renaming* is copy plus delete", n: "Which is why write-then-rename commit patterns are slow and unsafe here." },
           { q: "Are you listing millions of keys to find files?",
             y: "That is the bottleneck — use a manifest, which is what Iceberg and Delta provide",
             n: "Read by exact key — that path is fast" },
           { s: "Prefix design affects throughput and cost", n: "Partitioned prefixes let you list narrowly." },
           "Set lifecycle rules early — cold tiers and expiry are where the savings actually are"] }
},

"Data Versioning": {
 ex: { h: "*Which data produced this model?*",
       b: "Six months later a model behaves oddly and the training set has been overwritten twice. Versioned data makes the question answerable — and in regulated settings it is not optional, because *the model said so* requires showing exactly what the model learned from." },
 fl: { t: "Making a run reproducible",
       s: ["Pin the dataset version, not just its path",
           { q: "Does your table format support snapshots?",
             y: "Record the snapshot id — reading it back is exact and free",
             n: "Write immutable dated partitions and never overwrite them" },
           { s: "Store the version alongside code commit and parameters", n: "All three are needed; any one alone is insufficient." },
           { s: "Large files version by content hash, not by copy", n: "Which is what DVC and lakeFS do." },
           "Test the restore path — an untested reproducibility claim is a hope, not a guarantee"] }
}

});
