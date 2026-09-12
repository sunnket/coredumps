/* ==========================================================================
   Depth pass 58 — databases batch 6: OLTP vs OLAP architecture,
   columnar storage mechanics, full-text search, inverted indexes,
   Elasticsearch distributed internals, and Snowflake cloud architecture.

   Transactional systems protect individual row integrity; analytical
   systems compress columns across millions of rows; search engines invert
   text into instant dictionary lookups.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "oltp",

      why: {
        before: "Business transactions and batch analytical reporting shared " +
          "the same database instances, competing for identical row locks.",
        problem: "When a finance query ran an aggregation over 10 million rows, " +
          "it acquired shared table locks and monopolized CPU/disk bandwidth, " +
          "causing customer checkout transactions to time out and crash.",
        shift: "**Architectural separation of Online Transaction Processing (OLTP).** " +
          "Design dedicated transactional engines optimized for high-concurrency, " +
          "sub-10ms latency, strict ACID isolation, and localized row-level CRUD."
      },

      num: {
        t: "OLTP architectural properties & hardware profile",
        h: ["Dimension", "OLTP Characteristics", "Analytical (OLAP) Contrast"],
        r: [
          ["**Workload Pattern**", "**High-frequency reads and writes of individual rows**", "**Infrequent, massive batch read scans of millions of rows**"],
          ["**Latency Expectation**", "**Sub-10 milliseconds (often sub-millisecond)**", "**Seconds to minutes (acceptable for reports)**"],
          ["**Concurrency**", "**Thousands of concurrent transactions per second**", "**Dozens of concurrent complex analytical queries**"],
          ["**Storage Layout**", "**Row-oriented (B-Tree indexed pages)**", "**Columnar storage with vectorized compression**"],
          ["**Schema Design**", "**Normalized (3NF) to eliminate update anomalies**", "**Denormalized (Star / Snowflake schema) for fast joins**"],
          ["**Hardware Bottleneck**", "**Random I/O latency, memory speed, lock contention**", "**Sequential disk I/O throughput, CPU vector bandwidth**"]
        ],
        n: "OLTP systems (powered by engines like PostgreSQL, MySQL InnoDB, " +
          "and Oracle) are built around the foundational requirements of " +
          "**ACID guarantees** and **high write concurrency**. The primary " +
          "physical storage abstraction in OLTP is the **slotted page** " +
          "(typically 8 KB in Postgres or 16 KB in MySQL), where entire rows " +
          "are stored contiguously. This row-oriented layout is ideal for " +
          "transactional queries like `SELECT * FROM users WHERE id = 42` " +
          "or `UPDATE accounts SET balance = balance - 50 WHERE id = 101`, " +
          "because reading or writing the single row requires fetching exactly " +
          "one disk block into the buffer pool. Relational integrity is enforced " +
          "via strict foreign keys, unique constraints, and write-ahead " +
          "logging (WAL). However, row storage means that calculating the " +
          "average user balance across 50 million records forces the engine " +
          "to load every single column of all 50 million rows from disk into " +
          "RAM, destroying buffer cache efficiency. Modern high-scale architectures " +
          "treat OLTP databases strictly as the transactional system of record, " +
          "continuously streaming mutations via **Change Data Capture (CDC)** " +
          "into dedicated OLAP data warehouses."
      },

      miss: [
        {
          w: "OLTP databases can easily double as analytical reporting engines.",
          r: "Running heavy multi-table aggregations on primary OLTP instances " +
            "evicts transactional pages from the buffer cache, saturates CPU cores, " +
            "and causes severe latency spikes on user-facing transactions."
        },
        {
          w: "NoSQL databases are universally faster for OLTP than relational databases.",
          r: "Properly indexed relational databases with connection pooling execute " +
            "tens of thousands of ACID transactions per second with sub-millisecond " +
            "latencies. NoSQL trades relational consistency for horizontal partition scale."
        },
        {
          w: "Denormalizing OLTP tables improves write performance.",
          r: "Denormalization forces applications to update identical duplicated values " +
            "across multiple rows and tables, causing write amplification, lock thrashing, " +
            "and data inconsistencies."
        },
        {
          w: "OLTP databases should store historical data indefinitely.",
          r: "Accumulating hundreds of gigabytes of historical data balloons B-tree " +
            "index sizes beyond available RAM, degrading transactional query speed. " +
            "Old records should be archived to cold storage."
        }
      ],

      trade: {
        buys: [
          "Sub-10ms predictable response times for interactive user operations.",
          "Strict ACID isolation preventing financial and state corruption.",
          "High concurrency handling thousands of simultaneous user sessions.",
          "Normalized data design preventing insertion, update, and deletion anomalies."
        ],
        costs: [
          "Extremely inefficient for aggregate analytical queries across large datasets.",
          "Vertical scaling hardware costs (high-frequency single-thread CPUs, expensive RAM).",
          "Operational complexity of index maintenance, vacuuming, and connection management.",
          "Locking overhead under high concurrent write contention on shared rows."
        ],
        avoid: [
          "Unbounded `COUNT(*)` or `SUM()` queries over millions of rows on live web requests.",
          "Storing petabyte-scale append-only telemetry or clickstream event logs.",
          "Ad-hoc data science exploration on primary production instances."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "olap",

      why: {
        before: "Analytics teams ran SQL aggregations directly on transactional " +
          "relational databases or nightly replica dumps.",
        problem: "Row-oriented relational engines read every single column " +
          "off disk just to aggregate two fields, resulting in queries taking " +
          "hours, running out of memory, and exhausting cluster I/O bandwidth.",
        shift: "**Dedicated Online Analytical Processing (OLAP) architectures.** " +
          "Employ columnar storage, massive parallel processing (MPP), and " +
          "vectorized CPU execution to aggregate billions of records in sub-second times."
      },

      num: {
        t: "OLAP database categories & execution models",
        h: ["Engine Family", "Core Technology", "Prominent Examples", "Primary Use Case"],
        r: [
          ["**Cloud Data Warehouses**", "**Decoupled compute/storage, columnar micro-partitions**", "**Snowflake, Google BigQuery, Amazon Redshift**", "**Enterprise business intelligence, centralized corporate analytics**"],
          ["**Real-Time OLAP**", "**Distributed columnar segments with inverted indexing**", "**ClickHouse, Apache Pinot, Apache Druid**", "**User-facing analytics dashboards, high-throughput telemetry analytics**"],
          ["**Embedded OLAP**", "**Single-process in-memory vectorized execution engine**", "**DuckDB**", "**Local data science, serverless analytics, CLI data manipulation**"],
          ["**Lakehouse Engines**", "**Decoupled query engines reading open formats (Parquet/Iceberg)**", "**Databricks (Spark), Trino, StarRocks**", "**Petabyte-scale querying directly on cloud data lakes**"],
          ["**Relational Columnar Extensions**", "**Columnar storage extensions inside relational engines**", "**Hydra (Postgres), Citus Columnar**", "**Hybrid transactional/analytical workloads (HTAP) within existing Postgres**"]
        ],
        n: "The defining paradigm of OLAP is **read-heavy aggregate analytics** " +
          "over millions or billions of records (`GROUP BY`, `SUM`, `AVG`, " +
          "`COUNT DISTINCT`). Unlike OLTP systems where write operations update " +
          "individual rows in place, OLAP systems operate predominantly on " +
          "**append-only columnar batches**. Data is organized by column rather " +
          "than row: all values of column A are stored contiguously, followed " +
          "by column B. This physical structure enables three transformative " +
          "optimizations: First, **I/O projection pruning**—if a query asks " +
          "for `SUM(price) WHERE date > '2026-01-01'`, the engine only reads " +
          "the `price` and `date` files off storage, ignoring 50 other unused " +
          "columns. Second, **extreme compression**—storing identical data types " +
          "together enables dictionary, run-length, and delta compression, " +
          "reducing disk footprint by 70%–90%. Third, **SIMD vectorized execution**—modern " +
          "CPU vector registers (AVX-512) can process arrays of contiguous integers " +
          "simultaneously in a single instruction cycle, processing hundreds " +
          "of millions of rows per second per CPU core."
      },

      miss: [
        {
          w: "OLAP databases can handle web application user login authentication.",
          r: "OLAP engines have significant query compilation and planning overhead " +
            "(50–200ms) and poor row-level concurrency. They collapse under thousands " +
            "of simultaneous single-row lookups."
        },
        {
          w: "OLAP systems support efficient single-row ACID updates.",
          r: "Updating a single row in columnar storage requires rewriting an entire " +
            "columnar block or maintaining complex merge-on-read delta logs. Single-row " +
            "mutations are an anti-pattern in OLAP."
        },
        {
          w: "Big data analytics always requires a massive distributed cluster.",
          r: "Single-node vectorized engines like DuckDB can query 100 million rows " +
            "in seconds on a standard laptop by fully saturating local CPU memory channels, " +
            "eliminating network cluster overhead."
        },
        {
          w: "Data is streamed into OLAP systems row-by-row in real time.",
          r: "Streaming individual rows into columnar storage causes disastrous " +
            "file fragmentation. High-throughput ingestion requires micro-batching " +
            "or dedicated write-optimized row buffers (e.g. ClickHouse Memory engine)."
        }
      ],

      trade: {
        buys: [
          "Sub-second aggregations and analytical calculations over billions of rows.",
          "5x to 10x storage compression compared to raw row-oriented data.",
          "Minimizes disk and network I/O by reading only query-relevant columns.",
          "Massive parallel processing (MPP) scales seamlessly across large compute clusters."
        ],
        costs: [
          "Extremely poor performance on point lookups and single-row transactional writes.",
          "High memory consumption during massive joins and distinct group aggregations.",
          "Data latency due to batch ETL/ELT pipelines and micro-batching buffers.",
          "Complex operational overhead managing schemas, partition keys, and file compaction."
        ],
        avoid: [
          "Serving as the primary transactional database for customer-facing web apps.",
          "Workloads requiring frequent single-record updates, deletes, or fine-grained row locks.",
          "Low-latency REST API lookups requiring sub-5ms responses."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "columnar-storage",

      why: {
        before: "Databases stored records in row-major layout: each row's " +
          "fields were packed consecutively into contiguous disk pages.",
        problem: "An analytical query calculating `AVG(salary)` over 100 million " +
          "employees had to read all employee names, home addresses, phone " +
          "numbers, and bios from disk, wasting 98% of hardware I/O bandwidth.",
        shift: "**Column-major storage organization.** Store all values of a " +
          "single column contiguously on disk and in memory, allowing queries " +
          "to read exclusively the bytes of columns referenced in the SQL statement."
      },

      num: {
        t: "Columnar storage formats & compression algorithms",
        h: ["Format / Algorithm", "Mechanism", "Compression Ratio", "Primary Advantage"],
        r: [
          ["**Apache Parquet**", "**Open binary columnar file format with nested data structures**", "**4x–8x vs CSV/JSON**", "**Universal lakehouse standard (Spark, DuckDB, Trino, Snowflake)**"],
          ["**Apache ORC**", "**Optimized Row Columnar format with lightweight indexes**", "**5x–10x**", "**Highly optimized for Hadoop/Hive and high-throughput MapReduce**"],
          ["**Dictionary Encoding**", "**Replaces repetitive strings with compact integer IDs**", "**5x–15x on low-cardinality**", "**Allows direct query evaluation on integer IDs without string decoding**"],
          ["**Run-Length Encoding (RLE)**", "**Stores value and repeat count (e.g. `['US', 5000]`)**", "**10x–50x on sorted data**", "**Virtually eliminates storage for contiguous repeated values**"],
          ["**Bit-Packing & Frame-of-Ref (FoR)**", "**Stores only the minimum bits needed for range of integers**", "**3x–5x on numeric IDs**", "**Enables direct CPU vector SIMD mathematical operations**"]
        ],
        n: "Columnar storage revolutionizes analytics through two primary " +
          "physics: **I/O projection efficiency** and **homogeneous data " +
          "compression**. In a table with 100 columns, a query calculating " +
          "`SUM(revenue)` accesses only 1% of the table's total physical bytes. " +
          "Furthermore, because every value in a column block shares the exact " +
          "same data type (e.g. all 64-bit IEEE floating-point numbers or all " +
          "ISO date strings), compression algorithms achieve astonishing " +
          "ratios. In **Apache Parquet**, data is partitioned horizontally " +
          "into **Row Groups** (typically 512 MB to 1 GB), and within each " +
          "row group, data is split into **Column Chunks** containing pages " +
          "compressed via algorithms like Snappy, ZSTD, or Gzip. Crucially, " +
          "each column page includes header metadata: min/max statistics, " +
          "null counts, and definition levels. If a query filters `WHERE " +
          "transaction_date > '2026-06-01'`, the query engine reads the page " +
          "header metadata and completely skips reading the physical column " +
          "pages whose maximum date is prior to June 2026. This is known as " +
          "**zone-map pruning** or **predicate pushdown**."
      },

      miss: [
        {
          w: "Columnar storage is always faster than row storage for all database queries.",
          r: "For a query like `SELECT * FROM users WHERE id = 101`, row storage " +
            "fetches 1 single disk block. Columnar storage must open 50 separate column " +
            "files, read 50 disparate offsets, and reconstruct the row, running 10x slower."
        },
        {
          w: "Columnar storage is strictly an in-memory optimization.",
          r: "Formats like Parquet, ORC, and ClickHouse MergeTree are persistent " +
            "on-disk file formats designed specifically to minimize disk I/O and network transfer."
        },
        {
          w: "Columnar files easily support `UPDATE table SET column = value WHERE id = X`.",
          r: "Columnar files are immutable. Updating a single cell requires rewriting " +
            "the entire file or maintaining a separate delete vector and delta file, " +
            "leading to severe write amplification."
        },
        {
          w: "Columnar databases do not need indexes.",
          r: "While zone maps and sorting keys eliminate full scans, sparse secondary " +
            "indexes and Bloom filters are still essential to accelerate selective queries."
        }
      ],

      trade: {
        buys: [
          "Massive 80%–95% reduction in disk and network I/O for analytical aggregate queries.",
          "Exceptional compression ratios (5x to 10x), drastically reducing storage bills.",
          "Hardware-accelerated SIMD vector processing directly on columnar memory arrays.",
          "Predicate pushdown skips entire row groups without reading raw data."
        ],
        costs: [
          "Severe write amplification and overhead for single-row updates and deletes.",
          "High CPU penalty for row reconstruction when executing wide `SELECT *` queries.",
          "Requires periodic background compaction (vacuuming/merging) of small files.",
          "High memory requirement when writing columnar files to buffer full row groups."
        ],
        avoid: [
          "OLTP transactional workloads with high-frequency concurrent writes.",
          "Interactive web APIs returning complete single-row entities by primary key.",
          "Streaming small single-record writes without micro-batching buffers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "full-text-search",

      why: {
        before: "Applications searched text fields using SQL `LIKE '%keyword%'` " +
          "wildcards or regular expressions.",
        problem: "Leading wildcards make B-tree indexes completely unusable, " +
          "forcing full table scans that take seconds to minutes. Furthermore, " +
          "SQL LIKE provides zero relevance ranking, no typo tolerance, no " +
          "synonyms, and no linguistic understanding of plurals or conjugations.",
        shift: "**Lexical analysis and inverted index lookup.** Text is tokenized, " +
          "stemmed, and indexed into an inverted dictionary mapping terms to " +
          "document IDs, scored via probabilistic relevance algorithms (BM25)."
      },

      num: {
        t: "Text analysis pipeline stages & scoring models",
        h: ["Pipeline Stage", "Action Performed", "Example Input", "Example Output"],
        r: [
          ["**Character Filter**", "**Strips HTML, normalizes symbols, maps emojis**", "`<p>Running &amp; jumping!</p>`", "`Running and jumping!`"],
          ["**Tokenizer**", "**Splits continuous text stream into discrete tokens**", "`Running and jumping!`", "`['Running', 'and', 'jumping']`"],
          ["**Lowercase Filter**", "**Normalizes case for case-insensitive matching**", "`['Running', 'and', 'jumping']`", "`['running', 'and', 'jumping']`"],
          ["**Stop-word Filter**", "**Removes high-frequency words with zero semantic signal**", "`['running', 'and', 'jumping']`", "`['running', 'jumping']`"],
          ["**Stemmer (Porter/Snowball)**", "**Reduces words to their grammatical root form**", "`['running', 'jumping']`", "`['run', 'jump']`"],
          ["**Relevance Scoring (BM25)**", "**Weights TF (term frequency) vs IDF (inverse doc freq)**", "**Query: 'fast runner'**", "**Ranks documents by probabilistic relevance score**"]
        ],
        n: "Full-Text Search (FTS) bridges the gap between structured SQL " +
          "queries and natural human language. The mathematical foundation " +
          "of modern search engines (Elasticsearch, OpenSearch, Apache Lucene, " +
          "Postgres `tsvector`, and SQLite FTS5) is the **BM25 (Best Matching 25)** " +
          "ranking function. BM25 scores the relevance of a document to a query " +
          "based on three critical factors: **Term Frequency (TF)**—how often " +
          "the search term appears in the document (with diminishing returns " +
          "as frequency increases to prevent keyword stuffing); **Inverse Document " +
          "Frequency (IDF)**—how rare the term is across the entire corpus " +
          "(a match on 'quantum' is weighted far higher than a match on 'computer'); " +
          "and **Document Length Normalization**—penalizing very long documents " +
          "so a 50-page book doesn't outrank a concise 2-sentence match. " +
          "For typo tolerance and fuzzy search, FTS engines compute the " +
          "**Levenshtein edit distance** using Levenshtein Automata or N-gram " +
          "tokenizers, allowing users to find 'database' even if they typed " +
          "'databse' in the search bar."
      },

      miss: [
        {
          w: "SQL `LIKE '%term%'` can be made fast by adding a standard B-tree index.",
          r: "B-trees sort data lexicographically from the beginning of strings. " +
            "A query with a leading wildcard (`%term%`) cannot use the tree hierarchy " +
            "and always triggers an expensive full table scan."
        },
        {
          w: "Full-text search is replaced by AI semantic vector search.",
          r: "Vector search excels at conceptual meaning, but fails at exact alphanumeric " +
            "codes, part numbers, product SKUs, and specific names. State-of-the-art systems " +
            "use Hybrid Search combining BM25 lexical search with vector search."
        },
        {
          w: "Full-text search engines should store the primary source of transactional data.",
          r: "FTS engines (like Elasticsearch) lack cross-document ACID transactions " +
            "and are optimized for search indexing, not primary transactional persistence."
        },
        {
          w: "FTS searches through raw text files in real time on every query.",
          r: "FTS never touches raw text files during search; it queries pre-computed " +
            "inverted indexes and term dictionaries residing in memory and disk cache."
        }
      ],

      trade: {
        buys: [
          "Sub-10ms search across millions of unstructured text documents.",
          "Intelligent relevance scoring (BM25) ranking best matches at the top.",
          "Linguistic processing: stemming, pluralization, stop-word elimination, and synonyms.",
          "Typo tolerance and fuzzy matching via edit-distance algorithms."
        ],
        costs: [
          "Significant disk and RAM overhead to maintain inverted indexes (50%–100% of raw text).",
          "Eventual consistency when syncing text mutations from primary databases.",
          "Complex index mapping and analyzer configuration requirements.",
          "Higher write latency due to real-time tokenization and segment creation."
        ],
        avoid: [
          "Exact primary-key point lookups or numeric range-only filtering.",
          "Workloads requiring immediate strict ACID consistency across documents.",
          "Primary transactional accounting or ledger storage."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inverted-index",

      why: {
        before: "Databases maintained forward indexes mapping each document " +
          "to the list of words it contained (`Document1 -> ['cat', 'sat', 'mat']`).",
        problem: "Finding all documents mentioning the word 'cat' required scanning " +
          "every single document in the database sequentially—an O(D * W) full scan " +
          "that becomes completely unusable at internet scale.",
        shift: "**Invert the relationship: map terms to documents.** An Inverted " +
          "Index maps each unique word in the vocabulary to a sorted list of " +
          "document IDs containing it (`'cat' -> [Doc1, Doc42, Doc999]`), turning " +
          "search into an instantaneous O(1) dictionary lookup."
      },

      num: {
        t: "Inverted index internal structures (Apache Lucene architecture)",
        h: ["Component", "Internal File / Structure", "Function", "Encoding / Compression"],
        r: [
          ["**Term Dictionary**", "`.tim` file (Block Tree)", "**Alphabetical list of all unique terms across all documents**", "**Prefix-compressed blocks for minimal memory usage**"],
          ["**Term Index**", "`.tip` file (FST)", "**Memory-resident index pointing to disk blocks in term dictionary**", "**Finite State Transducer (FST) for O(len) memory lookups**"],
          ["**Postings List**", "`.doc` file", "**Sorted array of Document IDs containing the specific term**", "**Frame of Reference (FoR) / Bit-packing / Roaring Bitmaps**"],
          ["**Positions & Offsets**", "`.pos` and `.pay` files", "**Exact word positions for phrase queries (`'quick brown'`)**", "**Variable-byte delta encoding**"],
          ["**Term Frequencies**", "`.doc` file payloads", "**How many times term appears per document (for BM25)**", "**Packed integer deltas**"]
        ],
        n: "The Inverted Index is the core data structure powering all modern " +
          "search engines (Elasticsearch, Lucene, Solr, Postgres GIN). At its " +
          "heart is the **Postings List**: a sorted integer array of document " +
          "IDs. When a user searches for multiple terms like `'database' AND " +
          "`'concurrency'`, the search engine looks up the postings list for " +
          "`'database'` (e.g. `[2, 5, 9, 14, 28]`) and the list for `'concurrency'` " +
          "(e.g. `[5, 14, 30]`). To satisfy the `AND` condition, the engine " +
          "performs a **linear list intersection**. Because both lists are " +
          "strictly sorted, it advances two pointers simultaneously in O(N + M) " +
          "time. To accelerate this even further, modern engines embed **Skip Lists** " +
          "or **Roaring Bitmaps**, allowing the pointer to skip hundreds of " +
          "unmatched document IDs in a single CPU jump. Crucially, postings lists " +
          "are immutable once written to disk. In Apache Lucene, when documents " +
          "are inserted or updated, they are written to a brand new **segment**. " +
          "Old documents are marked in a deletion bitmap, and background threads " +
          "periodically execute **segment merges** to reclaim space and maintain " +
          "query performance."
      },

      miss: [
        {
          w: "An inverted index is just a standard in-memory hash table.",
          r: "At real-world scale, term vocabularies exceed RAM. Inverted indexes " +
            "are sophisticated disk-backed data structures using Finite State Transducers " +
            "and compressed block trees designed to maximize OS page cache hits."
        },
        {
          w: "Inverted indexes support cheap in-place updates when text changes.",
          r: "Postings lists are tightly compressed immutable integer arrays. " +
            "Modifying a document requires deleting the old document ID and writing " +
            "the updated terms into a brand new segment."
        },
        {
          w: "Inverted indexes are only used in dedicated search engines like Elasticsearch.",
          r: "Relational databases use inverted indexes extensively: PostgreSQL " +
            "GIN (Generalized Inverted Index) indexes accelerate JSONB, array " +
            "containment queries, and full-text search directly inside SQL."
        },
        {
          w: "Inverted indexes only store document IDs.",
          r: "Production inverted indexes store document IDs, term frequencies " +
            "(for BM25 ranking), exact character positions (for phrase matching), " +
            "and term payloads (for custom scoring)."
        }
      ],

      trade: {
        buys: [
          "Instantaneous sub-millisecond retrieval of matching documents across millions of records.",
          "Extremely fast boolean set operations (`INTERSECT`, `UNION`, `DIFFERENCE`).",
          "Exceptional compression via delta-encoding and Roaring Bitmaps.",
          "Enables complex phrase matching and proximity searches via stored term positions."
        ],
        costs: [
          "Large storage footprint (index often equals 40% to 100% of raw text corpus).",
          "High CPU overhead during document indexing and text tokenization.",
          "Immutable segment architecture requires expensive background merge routines.",
          "Eventual consistency: new documents are invisible until the index refreshes."
        ],
        avoid: [
          "Tables with extreme write/update frequency of short-lived records.",
          "Workloads requiring strict transactional read-your-own-writes consistency.",
          "Pure numeric key-value caching where exact hash lookups suffice."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "elasticsearch",

      why: {
        before: "Developers used Apache Lucene directly as an embedded Java library, " +
          "building custom network servers, manual shard splitters, and custom " +
          "replication engines to scale search across multiple machines.",
        problem: "Embedded Lucene was confined to a single process and single " +
          "server. Building a distributed, fault-tolerant search cluster required " +
          "thousands of lines of complex networking, consensus, and failover code.",
        shift: "**A distributed, JSON-native, RESTful search and analytics platform.** " +
          "Elasticsearch encapsulates Lucene into self-healing, horizontally scalable " +
          "clusters with automated data sharding, replication, and query routing."
      },

      num: {
        t: "Elasticsearch cluster architecture & node topologies",
        h: ["Node Role", "Responsibility", "Resource Profile", "Scaling Best Practice"],
        r: [
          ["**Master-Eligible Node**", "**Manages cluster state, index creation, shard allocation**", "**Low CPU, moderate RAM, zero data storage**", "**Dedicated 3-node quorum to prevent split-brain**"],
          ["**Data Node**", "**Executes indexing, search, aggregations; holds Lucene shards**", "**High CPU, high RAM (50% JVM / 50% OS Cache), fast NVMe**", "**Scale horizontally; keep shard sizes between 20GB–50GB**"],
          ["**Ingest Node**", "**Executes pre-indexing transformation pipelines (Grok, dissect)**", "**High CPU, low storage**", "**Isolates heavy parsing load from search and data nodes**"],
          ["**Coordinating Node**", "**Routes incoming REST requests; aggregates shard scatter-gather results**", "**High network, moderate CPU/RAM**", "**Acts as smart load balancer for heavy client query traffic**"],
          ["**Warm / Cold Node**", "**Stores historical, infrequently queried time-series indices**", "**Dense, cost-effective HDD/S3 object storage**", "**Used with Index Lifecycle Management (ILM) for log tiering**"]
        ],
        n: "Elasticsearch scales by partitioning an index into multiple physical " +
          "**shards**, where each shard is a completely autonomous, fully functioning " +
          "**Apache Lucene index**. Shards are split into **primary shards** " +
          "(which receive writes) and **replica shards** (which provide high " +
          "availability and handle read queries). When a search query arrives " +
          "at a coordinating node, it executes a **scatter-gather operation**: " +
          "it broadcasts the query to one copy of every shard in the index, " +
          "each shard executes the query locally using its inverted indexes, " +
          "returns the top matching document IDs and BM25 scores, and the " +
          "coordinating node merges and sorts the final result set. The single " +
          "most critical engineering parameter in Elasticsearch is **memory " +
          "allocation**: the JVM heap should never exceed 31 GB (to ensure " +
          "the JVM utilizes **Compressed Ordinary Object Pointers (Compressed OOPs)**, " +
          "which doubles pointer density), and the remaining 50% of system " +
          "RAM must be left free for the operating system page cache, which " +
          "Lucene relies on to keep inverted index segments memory-mapped."
      },

      miss: [
        {
          w: "Elasticsearch is an enterprise-grade primary transactional database.",
          r: "Elasticsearch lacks cross-document ACID transactions, does not support " +
            "relational joins, and can lose data during severe network partitions. " +
            "It is designed as a secondary search engine, not a source of truth."
        },
        {
          w: "Allocating 64 GB of JVM heap will double Elasticsearch speed.",
          r: "Exceeding 32 GB of heap disables Compressed OOPs, causing 64-bit pointers " +
            "to consume double the memory and triggering devastating multi-minute " +
            "Garbage Collection pauses. 31 GB is the hard upper ceiling."
        },
        {
          w: "Creating 50 shards per index maximizes parallelism.",
          r: "Over-sharding is the #1 cause of cluster failure. Each shard consumes " +
            "file handles, memory, and CPU overhead. Shards should be sized between " +
            "20 GB and 50 GB."
        },
        {
          w: "Elasticsearch updates records in-place like a relational database.",
          r: "Lucene segments are immutable. An update is internally an atomic " +
            "delete of the old document and insert of the new document, generating " +
            "deleted-document bloat that requires segment merging."
        }
      ],

      trade: {
        buys: [
          "Massive horizontal scalability across hundreds of servers and petabytes of data.",
          "Rich search ecosystem combining BM25, complex aggregations, geospatial, and vector search.",
          "Built-in high availability and automated shard failover without downtime.",
          "Standardized JSON REST API with comprehensive client libraries in every language."
        ],
        costs: [
          "Heavy memory footprint requiring disciplined JVM heap and OS cache management.",
          "Operational complexity managing shard sizing, cluster quorums, and segment merges.",
          "Eventual consistency model: document updates are not immediately searchable (1s refresh).",
          "Risk of cluster instability under heavy unthrottled aggregate queries."
        ],
        avoid: [
          "Primary transactional records (financial ledgers, customer billing accounts).",
          "Schemas requiring frequent multi-table relational joins.",
          "Workloads requiring immediate synchronous read-your-own-writes consistency."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "snowflake",

      why: {
        before: "Traditional on-premise data warehouses (Teradata, Oracle Exadata) " +
          "and first-generation cloud warehouses (Amazon Redshift classic) coupled " +
          "compute and storage onto the same physical virtual machines.",
        problem: "Scaling storage required purchasing expensive compute nodes " +
          "even if CPUs sat idle. Furthermore, long-running analytical queries by " +
          "data scientists starved daily executive dashboards on the shared cluster.",
        shift: "**Total decoupling of compute and storage in a cloud-native architecture.** " +
          "Snowflake stores all data centrally in scalable cloud object storage, " +
          "allowing independent, ephemeral compute clusters (Virtual Warehouses) to " +
          "spin up, scale, and shut down on-demand with zero workload contention."
      },

      num: {
        t: "Snowflake three-tier cloud-native architecture",
        h: ["Architectural Layer", "Components & Technologies", "Scaling Dimension", "Core Responsibility"],
        r: [
          ["**Cloud Services Tier**", "**Authentication, access control, query optimizer, transaction manager**", "**Stateless, highly available across AZs**", "**Coordinates all cluster operations and stores metadata**"],
          ["**Virtual Warehouse Tier**", "**Independent MPP compute clusters (T-shirt sizes XS to 6X-Large)**", "**Scale Up (size) & Scale Out (multi-cluster)**", "**Executes SQL queries and transforms data without contention**"],
          ["**Centralized Storage Tier**", "**Cloud object storage (AWS S3, Google GCS, Azure Blob)**", "**Infinitely scalable, pay-per-byte**", "**Stores proprietary columnar micro-partitions immutably**"],
          ["**Micro-Partitions**", "**50 MB–500 MB compressed columnar files**", "**Automatic horizontal partitioning**", "**Pruned via metadata min/max zone maps without manual indexes**"],
          ["**Zero-Copy Cloning**", "**Metadata pointer duplication**", "**Instantaneous (0 additional storage cost)**", "**Clones entire databases/schemas instantly for testing**"]
        ],
        n: "Snowflake's architectural breakthrough rests on the **three-tier " +
          "separation**: Cloud Services, Virtual Warehouses, and Database " +
          "Storage. All data is persisted in the Storage Tier as **micro-partitions**—internally " +
          "structured, compressed, columnar files holding between 50 MB and " +
          "500 MB of uncompressed data. The Cloud Services tier automatically " +
          "extracts and stores metadata for every micro-partition: column " +
          "ranges, min/max values, distinct counts, and null counts. When a " +
          "query executes, the query optimizer performs **micro-partition " +
          "pruning** using this metadata, eliminating 99% of storage files " +
          "before compute clusters read a single byte. The **Virtual Warehouses** " +
          "are stateless compute clusters: an engineering team can run an " +
          "X-Large warehouse for heavy ETL transformations, while the finance " +
          "team runs a Medium warehouse for Tableau reporting simultaneously " +
          "against the exact same underlying storage tier with **zero performance " +
          "interference**. Additional flagship capabilities include **Time Travel** " +
          "(querying table states at historical timestamps or query IDs up " +
          "to 90 days in the past) and **Zero-Copy Cloning** (which duplicates " +
          "metadata pointers to create isolated dev/staging databases instantly " +
          "without copying physical data blocks)."
      },

      miss: [
        {
          w: "Snowflake requires DBAs to tune indexes, vacuum tables, and partition keys.",
          r: "Snowflake is completely index-free and vacuum-free. Automatic micro-partitioning, " +
            "metadata zone maps, and background clustering manage physical optimization automatically."
        },
        {
          w: "Different Virtual Warehouses compete for compute power.",
          r: "Virtual Warehouses are completely isolated compute instances. Queries " +
            "running in Warehouse A have zero physical impact on queries running in Warehouse B."
        },
        {
          w: "Snowflake is suitable for serving high-concurrency web application APIs.",
          r: "Query startup and metadata coordination takes 50ms–200ms. Snowflake is " +
            "built for analytics and batch transformation, not sub-10ms transactional OLTP."
        },
        {
          w: "Snowflake costs are predictable without governance controls.",
          r: "Auto-scaling virtual warehouses and continuous ingestion tasks can run " +
            "continuously if misconfigured, generating massive unexpected cloud credit bills. " +
            "Resource monitors and auto-suspend timeouts are mandatory."
        }
      ],

      trade: {
        buys: [
          "Complete isolation of workloads: data science queries never slow down business dashboards.",
          "Near-infinite independent elasticity: scale compute up or down in seconds.",
          "Near-zero administrative maintenance: no indexes to build, no vacuuming, no hardware patching.",
          "Instantaneous Zero-Copy Cloning and historical Point-in-Time Time Travel."
        ],
        costs: [
          "Consumption-based credit pricing can lead to unexpected runaway costs without strict budget limits.",
          "High query startup latency makes it inappropriate for high-frequency interactive OLTP APIs.",
          "Proprietary storage format creates vendor lock-in compared to open lakehouse formats (Iceberg/Parquet).",
          "Continuous background auto-clustering consumes background compute credits."
        ],
        avoid: [
          "Real-time transactional web applications requiring sub-10ms point updates.",
          "Single-row `INSERT` statements in tight loops (always batch load via COPY or Snowpipe).",
          "Leaving Virtual Warehouses running without aggressive auto-suspend timers."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
