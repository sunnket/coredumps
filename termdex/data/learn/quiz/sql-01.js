/* SQL — 50+ Hardcore Question Bank (IIT/FAANG Level). */

/* ===================================================================
   Module: advanced — (10 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "advanced", [
  {
    "tag": "Snapshot Isolation Write Skew",
    "lvl": "advanced",
    "q": "Two doctors on call simultaneously check `SELECT COUNT(*) WHERE on_call=true` (returns 2), and both set `on_call=false` and commit under Repeatable Read. What anomaly occurred?",
    "o": [
      "Dirty Read",
      "Non-Repeatable Read",
      "Write Skew (both commit, leaving 0 doctors on call)",
      "Deadlock"
    ],
    "a": 2,
    "x": "Write Skew occurs under Snapshot Isolation when concurrent transactions read overlapping data but modify disjoint rows, bypassing write-write conflict detection."
  },
  {
    "tag": "InnoDB Next-Key Locks",
    "lvl": "advanced",
    "q": "Why does `SELECT * FROM orders WHERE id BETWEEN 10 AND 20 FOR UPDATE` block concurrent `INSERT INTO orders (id) VALUES (15)` in MySQL InnoDB under Repeatable Read?",
    "o": [
      "Table lock",
      "InnoDB sets Next-Key Locks (Record lock on existing keys + Gap locks on open index intervals between 10 and 20) to eliminate Phantom Reads",
      "Row 15 is locked in RAM",
      "Autocommit is disabled"
    ],
    "a": 1,
    "x": "Gap locks lock the interval between index records, preventing concurrent inserts into gaps."
  },
  {
    "tag": "Postgres MVCC xmin/xmax",
    "lvl": "advanced",
    "q": "What happens on disk when an `UPDATE users SET status='ACTIVE' WHERE id=1` query runs in PostgreSQL?",
    "o": [
      "In-place disk overwrite",
      "Old tuple's `xmax` header is set to current transaction ID (logical delete), and a new tuple with `xmin = current_tx` is appended to the page on disk",
      "Moved to temp table",
      "Table is locked"
    ],
    "a": 1,
    "x": "PostgreSQL MVCC never overwrites in place; it marks old tuples dead via `xmax` and appends new row versions."
  },
  {
    "tag": "Transaction ID Wraparound",
    "lvl": "advanced",
    "q": "What catastrophic event occurs if Postgres `VACUUM FREEZE` fails to freeze transaction IDs before 2 billion transactions elapse?",
    "o": [
      "Database converts to JSON",
      "Postgres enters emergency read-only mode to prevent ancient data from appearing in the future and becoming invisible (wraparound)",
      "Indexes deleted",
      "Server reboots"
    ],
    "a": 1,
    "x": "Modulo-2^32 transaction comparison makes unfrozen tuples older than 2 billion transactions appear in the future and become invisible. Postgres shuts down to prevent data loss."
  },
  {
    "tag": "Two-Phase Locking (2PL)",
    "lvl": "advanced",
    "q": "What is the difference between Strict 2PL and Rigorous 2PL?",
    "o": [
      "Strict 2PL releases Shared (S) locks after reading, while Rigorous 2PL holds ALL Shared and Exclusive locks until the transaction commits or aborts",
      "Strict 2PL allows dirty reads",
      "Rigorous 2PL is non-deterministic",
      "Strict 2PL requires 3 database primaries"
    ],
    "a": 0,
    "x": "Strict 2PL holds exclusive locks until commit. Rigorous 2PL holds both shared and exclusive locks until transaction completion, guaranteeing strict serializability."
  },
  {
    "tag": "Lost Update Anomaly",
    "lvl": "advanced",
    "q": "Transaction A and Transaction B simultaneously read user balance ($100). A adds $50 (writes $150). B deducts $20 (writes $80) and commits. What anomaly occurred?",
    "o": [
      "Write Skew",
      "Lost Update Anomaly (Transaction A's deposit of $50 is completely overwritten and lost)",
      "Phantom Read",
      "Dirty Read"
    ],
    "a": 1,
    "x": "Lost Update occurs when concurrent transactions overwrite each other's updates without concurrency control. Prevented via `SELECT ... FOR UPDATE` or optimistic version locks."
  },
  {
    "tag": "Dirty Read G1 Definition",
    "lvl": "advanced",
    "q": "What constitutes a **Dirty Read (ANSI SQL Isolation Level Read Uncommitted)**?",
    "o": [
      "Reading rows that match a wild card",
      "Transaction 2 reads row mutations made by uncommitted Transaction 1, which subsequently rolls back",
      "Reading rows from a deleted table",
      "Reading index metadata"
    ],
    "a": 1,
    "x": "A dirty read occurs when a transaction reads uncommitted in-flight changes from another transaction that is later rolled back."
  },
  {
    "tag": "Deadlock Detection Wait-For Graph",
    "lvl": "advanced",
    "q": "How do relational databases detect deadlocks between concurrent transactions?",
    "o": [
      "Restarting the server every 10 seconds",
      "Building a dynamic **Wait-For Graph (WFG)** of transaction lock dependencies and periodically running cycle detection algorithms (DFS/Tarjan) to detect closed dependency loops, rolling back the lowest-cost transaction",
      "Converting all locks to shared locks",
      "Using binary search"
    ],
    "a": 1,
    "x": "Databases maintain a directed graph where nodes are transactions and edges represent lock wait dependencies. A cycle in the WFG signals a deadlock, prompting the engine to abort a victim transaction."
  },
  {
    "tag": "Non-Transactional Sequences",
    "lvl": "advanced",
    "q": "Why do PostgreSQL `SERIAL` and `SEQUENCE` objects produce gaps (e.g. IDs jumping 1, 2, 5, 6) when transactions roll back?",
    "o": [
      "Sequences are corrupted on disk",
      "`nextval()` increments the sequence state immediately and **outside the transaction boundary** without rolling back on transaction abort, preventing sequential ID allocation from creating a single global concurrency bottleneck",
      "Sequences use random numbers",
      "Gaps indicate hardware faults"
    ],
    "a": 1,
    "x": "Sequences are non-transactional: if `nextval()` rolled back on transaction abort, all concurrent transactions would block on a single lock, destroying write throughput."
  },
  {
    "tag": "FOR NO KEY UPDATE in PostgreSQL",
    "lvl": "advanced",
    "q": "Why is `SELECT ... FOR NO KEY UPDATE` preferred over `SELECT ... FOR UPDATE` when locking a parent row for non-primary-key updates?",
    "o": [
      "It runs in memory only",
      "`FOR NO KEY UPDATE` acquires a weaker lock that does not block concurrent foreign key checks (`SELECT ... FOR KEY SHARE`) from inserting child rows, dramatically increasing concurrency",
      "It bypasses transaction log",
      "It is for MySQL only"
    ],
    "a": 1,
    "x": "In Postgres, `FOR NO KEY UPDATE` locks the row against concurrent modifications while permitting foreign key reference checks on unchanged primary keys to proceed concurrently."
  }
]);

/* ===================================================================
   Module: functions — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "functions", [
  {
    "tag": "Window Frame Default RANGE Trap",
    "lvl": "advanced",
    "q": "What is the difference between `SUM(val) OVER (ORDER BY date)` and `SUM(val) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` on duplicate dates?",
    "o": [
      "Zero difference",
      "Default `RANGE` aggregates all duplicate dates together as peer groups; `ROWS` aggregates strictly row-by-row",
      "`ROWS` triggers full table scan",
      "Negative numbers ignored"
    ],
    "a": 1,
    "x": "Default `RANGE` aggregates all tying rows in the frame together, producing jumpy sums instead of true running totals."
  },
  {
    "tag": "Hash Join vs Merge Join vs Nested Loop",
    "lvl": "advanced",
    "q": "When joining two large unindexed tables $R$ (10M rows) and $S$ (10M rows) on equality `R.id = S.id`, which join algorithm will the query optimizer select?",
    "o": [
      "Nested Loop Join ($O(|R| \\cdot |S|)$)",
      "Hash Join: Builds an in-memory hash table on relation $R$ in $O(|R|)$ then probes row-by-row using $S$ in $O(|S|)$ (total $O(|R|+|S|)$)",
      "Cartesian Cross Join",
      "Bitmap Index Scan"
    ],
    "a": 1,
    "x": "Hash Join operates in two phases: Build phase (hash table on smaller relation) and Probe phase (streaming scan of probe relation) in $O(|R|+|S|)$."
  },
  {
    "tag": "Index Condition Pushdown (ICP)",
    "lvl": "advanced",
    "q": "How does Index Condition Pushdown (ICP) optimize `SELECT * FROM people WHERE zip='94105' AND last_name LIKE '%son' AND address LIKE '%Main%'` using an index on `(zip, last_name)`?",
    "o": [
      "Evaluates address in MySQL parser",
      "The storage engine evaluates `last_name LIKE '%son'` directly inside the index buffer page before reading table records from disk, minimizing disk I/O",
      "Converts B-Tree to Full-Text index",
      "Sorts table in RAM"
    ],
    "a": 1,
    "x": "ICP evaluates index-qualified conditions directly inside the storage engine index layer before fetching clustered table pages from disk."
  },
  {
    "tag": "Recursive CTE Cycle Trap",
    "lvl": "advanced",
    "q": "In a recursive CTE traversing an organizational hierarchy, what happens if cyclic relationships exist in data?",
    "o": [
      "Postgres breaks cycle with Dijkstra",
      "The recursive CTE enters an infinite loop until hitting recursion limits or memory exhaustion; prevent by tracking an array of visited IDs",
      "Returns `NULL`",
      "Rolls back table"
    ],
    "a": 1,
    "x": "Recursive CTEs continue executing until the working table returns 0 rows. Cycles cause working tables to never empty without explicit visited path tracking."
  },
  {
    "tag": "DENSE_RANK vs RANK Gap",
    "lvl": "advanced",
    "q": "Given scores `[100, 100, 90]`, what are the outputs of `RANK()` vs `DENSE_RANK()` for score `90`?",
    "o": [
      "`RANK` outputs 3; `DENSE_RANK` outputs 2",
      "`RANK` outputs 2; `DENSE_RANK` outputs 3",
      "Both output 2",
      "Both output 3"
    ],
    "a": 0,
    "x": "`RANK()` skips ranks after ties (1, 1, 3). `DENSE_RANK()` leaves no gaps (1, 1, 2)."
  },
  {
    "tag": "NTILE Skew Distribution",
    "lvl": "advanced",
    "q": "When dividing 10 rows into `NTILE(4)`, what is the distribution of rows across buckets 1, 2, 3, and 4?",
    "o": [
      "2, 2, 2, 4",
      "3, 3, 2, 2 (extra rows distributed to lowest bucket numbers first)",
      "2, 3, 3, 2",
      "4, 2, 2, 2"
    ],
    "a": 1,
    "x": "`NTILE(K)` distributes extra remainder rows ($10 \\bmod 4 = 2$) one by one starting from bucket 1. Buckets 1 and 2 receive 3 rows; buckets 3 and 4 receive 2 rows."
  },
  {
    "tag": "Filter Clause in Aggregation",
    "lvl": "advanced",
    "q": "What is the standard SQL syntax to compute conditional counts without `CASE WHEN` statements in PostgreSQL?",
    "o": [
      "`COUNT(*) WHERE status = 'ACTIVE'`",
      "`COUNT(*) FILTER (WHERE status = 'ACTIVE')`",
      "`COUNT_IF(status = 'ACTIVE')`",
      "`SUM(status == 'ACTIVE')`"
    ],
    "a": 1,
    "x": "The SQL standard `FILTER (WHERE condition)` clause allows applying inline predicates directly to individual aggregate functions."
  }
]);

/* ===================================================================
   Module: design — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "design", [
  {
    "tag": "B+Tree vs LSM-Tree Storage",
    "lvl": "advanced",
    "q": "Why do write-heavy databases (Cassandra, RocksDB) use LSM-Trees while read-heavy OLTP databases (PostgreSQL, MySQL) use B+Trees?",
    "o": [
      "B+Trees cannot store strings",
      "B+Trees perform random I/O page overwrites on disk; LSM-Trees append all writes sequentially to in-memory MemTables and flush immutable SSTables sequentially to disk, maximizing write throughput",
      "LSM-Trees eliminate WAL",
      "B+Trees cannot do range queries"
    ],
    "a": 1,
    "x": "B+Trees incur random disk I/O and page fragmentation on updates. LSM-Trees convert random writes into sequential disk appends."
  },
  {
    "tag": "Covering Index Index-Only Scans",
    "lvl": "advanced",
    "q": "What makes a query eligible for an **Index-Only Scan**?",
    "o": [
      "The table has fewer than 1,000 rows",
      "All columns requested in `SELECT`, `WHERE`, `ORDER BY`, and `GROUP BY` are present within the index leaf pages, eliminating the need to visit the heap table pages",
      "The index is clustered",
      "Query uses `COUNT(*)` only"
    ],
    "a": 1,
    "x": "When an index contains all required columns (Covering Index), the database retrieves all data directly from index leaf pages without table heap I/O."
  },
  {
    "tag": "B-Tree Fill Factor and Page Splits",
    "lvl": "advanced",
    "q": "What happens when an insert occurs in a full B-Tree leaf page (fill factor 100%)?",
    "o": [
      "The database returns `DiskFull` error",
      "A **Page Split** occurs: a new disk page is allocated, 50% of keys are moved to the new page, and a new pivot key is inserted into the parent node (causing write amplification)",
      "The page is compressed with gzip",
      "The key is discarded"
    ],
    "a": 1,
    "x": "Inserting into a saturated B-Tree leaf forces a 50/50 page split, allocating a new page and modifying parent nodes."
  },
  {
    "tag": "Clustered vs Secondary Index Lookups",
    "lvl": "advanced",
    "q": "In MySQL InnoDB, why does querying via a Secondary Index on a non-covering column require a **Secondary Lookup (Bookmark Lookup)**?",
    "o": [
      "Secondary indexes store pointers to SSD registers",
      "Secondary index leaf nodes store the table's Primary Key rather than row pointers; the engine must perform a second traversal down the Clustered Index B-Tree to fetch the full row",
      "Secondary indexes are uncompressed",
      "InnoDB disables cache for secondary indexes"
    ],
    "a": 1,
    "x": "InnoDB secondary indexes store the Primary Key as their bookmark. Non-covering queries must traverse the clustered index B-Tree to retrieve full row columns."
  },
  {
    "tag": "BRIN Index for Massive Append-Only Tables",
    "lvl": "advanced",
    "q": "Why are Block Range Indexes (BRIN) in PostgreSQL ideal for multi-terabyte timestamped event logs compared to standard B-Trees?",
    "o": [
      "BRIN indexes encrypt data",
      "BRIN indexes store only the minimum and maximum values for physical ranges of table disk pages (e.g. every 128 pages), occupying less than 1% of the storage space and RAM of a B-Tree for naturally ordered data",
      "BRIN indexes eliminate NULLs",
      "BRIN indexes run on GPUs"
    ],
    "a": 1,
    "x": "BRIN summarizes min/max values for block ranges on disk. For naturally ordered time-series data, a BRIN index takes only a few kilobytes compared to gigabytes for a B-Tree."
  },
  {
    "tag": "GIN vs GiST Indexes",
    "lvl": "advanced",
    "q": "In PostgreSQL, when should a Generalized Inverted Index (GIN) be chosen over a Generalized Search Tree (GiST)?",
    "o": [
      "For geometric spatial points",
      "For composite multi-value attributes (e.g. JSONB documents, full-text search tsvectors, arrays) where querying for specific elements requires looking up matching row pointers in an inverted index",
      "For single integer columns",
      "For foreign keys only"
    ],
    "a": 1,
    "x": "GIN is an inverted index mapping each sub-element (e.g. word or JSON key) to a list of matching row IDs. GiST is a balanced tree for hierarchical/spatial domains."
  },
  {
    "tag": "Deterministic Collation Indexes",
    "lvl": "advanced",
    "q": "What is the indexing impact of using a non-deterministic (case-insensitive) collation (`COLLATE \"und-x-icu\"`) on a PostgreSQL text column?",
    "o": [
      "Disables all indexes",
      "B-Tree index lookup requires full canonical normalization, which prevents prefix pattern matching optimization (`LIKE 'prefix%'`) without specialized collation index expressions",
      "Forces table to memory",
      "Converts strings to ASCII"
    ],
    "a": 1,
    "x": "Non-deterministic collations equate characters that have different byte sequences (e.g. case and accents), which prevents fast byte-level prefix matching in standard index scans."
  }
]);

/* ===================================================================
   Module: filter — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "filter", [
  {
    "tag": "Sargability and Function Wrapping",
    "lvl": "advanced",
    "q": "Why is `WHERE YEAR(created_at) = 2025` non-sargable (Search Argument Able), and how should it be rewritten to utilize an index on `created_at`?",
    "o": [
      "`YEAR()` is deprecated",
      "Wrapping an indexed column inside a function prevents B-Tree range traversal and forces a full table scan; rewrite to `WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'`",
      "Rewrite to `WHERE created_at LIKE '2025%'`",
      "Functions only work on integers"
    ],
    "a": 1,
    "x": "Functions on indexed columns prevent index range scans because the database cannot invert arbitrary functions. Keeping the column bare allows standard B-Tree boundary navigation."
  },
  {
    "tag": "NULL Three-Valued Logic (3VL)",
    "lvl": "advanced",
    "q": "What does `SELECT * FROM users WHERE status != 'DELETED'` return for a row where `status` is `NULL`?",
    "o": [
      "The row is returned",
      "The row is NOT returned because `NULL != 'DELETED'` evaluates to `UNKNOWN` (falsy in SQL boolean filtering)",
      "Raises a syntax error",
      "The row is deleted"
    ],
    "a": 1,
    "x": "In SQL 3-Valued Logic, any comparison with `NULL` yields `UNKNOWN`. SQL `WHERE` clauses retain rows only where conditions evaluate to `TRUE`."
  },
  {
    "tag": "NOT IN vs NOT EXISTS with NULLs",
    "lvl": "advanced",
    "q": "Why does `SELECT * FROM tableA WHERE id NOT IN (SELECT foreign_id FROM tableB)` return ZERO rows if `tableB.foreign_id` contains a single `NULL` value?",
    "o": [
      "`NOT IN` is disabled on subqueries",
      "In SQL logic, `id NOT IN (1, 2, NULL)` expands to `id != 1 AND id != 2 AND id != NULL`. Since `id != NULL` is `UNKNOWN`, the entire AND expression evaluates to `UNKNOWN`, returning 0 rows",
      "`NOT IN` converts to `DELETE`",
      "`foreign_id` must be primary key"
    ],
    "a": 1,
    "x": "If any value in the subquery is `NULL`, `NOT IN` evaluates to `UNKNOWN` for all rows. Use `NOT EXISTS` instead, which is immune to `NULL` values."
  },
  {
    "tag": "Bitmap Index Scan in Postgres",
    "lvl": "advanced",
    "q": "How does PostgreSQL combine two independent indexes on `status` and `created_at` in a single query `WHERE status='ACTIVE' AND created_at > '2025-01-01'`?",
    "o": [
      "Runs nested loop across both indexes",
      "Performs a **Bitmap Index Scan** on each index to produce in-memory bitmap bitmasks of page row pointers, then performs a bitwise AND on the bitmaps before fetching heap table pages",
      "Deletes one index",
      "Converts query to full table scan"
    ],
    "a": 1,
    "x": "PostgreSQL creates bitmaps where 1-bits mark qualifying row physical disk locations. Combining multiple bitmaps via bitwise AND/OR allows multiple indexes to filter data concurrently."
  }
]);

/* ===================================================================
   Module: select — (3 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "select", [
  {
    "tag": "SELECT DISTINCT vs GROUP BY",
    "lvl": "advanced",
    "q": "Under what scenario does `SELECT DISTINCT col FROM table` execute differently from `SELECT col FROM table GROUP BY col`?",
    "o": [
      "They are always physically identical",
      "In standard SQL query optimizers, both typically map to the exact same hash/sort aggregate plan; however, `GROUP BY` allows aggregate functions (`COUNT`, `SUM`) while `DISTINCT` applies deduplication across all projected columns",
      "DISTINCT uses more RAM",
      "GROUP BY deletes duplicates permanently"
    ],
    "a": 1,
    "x": "Modern query planners generate identical execution plans for basic distinct queries, but `GROUP BY` enables grouping calculations while `DISTINCT` filters entire projection tuples."
  },
  {
    "tag": "COUNT(*) vs COUNT(column)",
    "lvl": "advanced",
    "q": "What is the exact semantic difference between `COUNT(*)` and `COUNT(col_name)` in SQL?",
    "o": [
      "`COUNT(*)` is slower",
      "`COUNT(*)` counts all rows in the result set regardless of NULLs; `COUNT(col_name)` counts strictly non-NULL values of `col_name`",
      "`COUNT(*)` ignores duplicate rows",
      "`COUNT(col)` ignores zeros"
    ],
    "a": 1,
    "x": "`COUNT(*)` computes the cardinality of the relation. `COUNT(col)` filters out rows where `col IS NULL`."
  },
  {
    "tag": "Explain Analyze Shared Hit Buffers",
    "lvl": "advanced",
    "q": "In PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)`, what does `Buffers: shared hit=150 read=2` indicate?",
    "o": [
      "150 rows were deleted",
      "150 disk pages were served directly from PostgreSQL's in-memory shared buffer cache in RAM, while 2 pages required actual physical I/O read from OS/disk",
      "Query executed in 150 milliseconds",
      "Index was split 2 times"
    ],
    "a": 1,
    "x": "`shared hit` counts pages found directly in RAM. `shared read` indicates cache misses that required reading data blocks from disk."
  }
]);

/* ===================================================================
   Module: join — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "join", [
  {
    "tag": "Cross Join Cardinality",
    "lvl": "advanced",
    "q": "If table A has $M$ rows and table B has $N$ rows, what is the exact number of rows produced by `SELECT * FROM A CROSS JOIN B`?",
    "o": [
      "$M + N$",
      "$M \\times N$",
      "$\\max(M, N)$",
      "$M / N$"
    ],
    "a": 1,
    "x": "A Cartesian Cross Join pairs every row of relation A with every row of relation B, producing exactly $M \\times N$ rows."
  },
  {
    "tag": "Semi-Join vs Inner Join",
    "lvl": "advanced",
    "q": "How does a SQL **Semi-Join** (`EXISTS (SELECT 1 FROM ...)` optimize execution compared to a standard `INNER JOIN`?",
    "o": [
      "Semi-joins run in parallel only",
      "A Semi-Join returns each matching row from the outer table at most once and stops scanning the inner table on the first match, avoiding row duplication without requiring `DISTINCT`",
      "Semi-joins sort data",
      "Inner join is faster"
    ],
    "a": 1,
    "x": "Semi-joins evaluate set existence: as soon as a match is found in the subquery, inner table probing halts for that outer row."
  },
  {
    "tag": "Anti-Join Mechanics",
    "lvl": "advanced",
    "q": "What is an **Anti-Join** in relational algebra?",
    "o": [
      "A join that deletes matching rows",
      "An operation that returns rows from the left relation that have **zero matches** in the right relation (e.g. `LEFT JOIN ... WHERE right.id IS NULL` or `NOT EXISTS`)",
      "A join between two databases",
      "A cross product"
    ],
    "a": 1,
    "x": "An Anti-Join filters the left relation to keep only tuples that have no corresponding match in the right relation."
  },
  {
    "tag": "Lateral Joins Execution Mechanics",
    "lvl": "advanced",
    "q": "What unique capability does a `CROSS JOIN LATERAL` (or SQL Server `CROSS APPLY`) provide in SQL?",
    "o": [
      "Joins across different database engines",
      "Allows the right subquery to reference columns provided by the current row of the left relation, behaving like a parameterized for-each loop over rows",
      "Eliminates join conditions",
      "Enforces foreign keys"
    ],
    "a": 1,
    "x": "`LATERAL` subqueries can reference columns from preceding `FROM` items, enabling correlated top-$N$ per category queries in a single query."
  }
]);

/* ===================================================================
   Module: agg — (3 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "agg", [
  {
    "tag": "HAVING vs WHERE Filter Execution Order",
    "lvl": "advanced",
    "q": "Why can aggregate functions (e.g. `SUM(amount) > 1000`) be used in `HAVING` clauses but NOT in `WHERE` clauses?",
    "o": [
      "`WHERE` is for text only",
      "In SQL logical query processing order, `WHERE` executes *before* row grouping (`GROUP BY`); `HAVING` executes *after* groups and aggregate values have been materialized",
      "`HAVING` uses B-Tree indexes",
      "`WHERE` is evaluated by client"
    ],
    "a": 1,
    "x": "SQL execution order: `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY`. Aggregates are computed during grouping, so they are only available to `HAVING`."
  },
  {
    "tag": "GROUPING SETS & ROLLUP",
    "lvl": "advanced",
    "q": "What aggregations are produced by `GROUP BY ROLLUP(year, quarter, region)`?",
    "o": [
      "Only `(year, quarter, region)`",
      "Hierarchical aggregations for `(year, quarter, region)`, `(year, quarter)`, `(year)`, and the grand total `()`",
      "All $2^3 = 8$ subset combinations",
      "Only pairwise combinations"
    ],
    "a": 1,
    "x": "`ROLLUP(A, B, C)` generates progressive subtotal aggregations along a hierarchy: $(A, B, C)$, $(A, B)$, $(A)$, and $()$ (grand total)."
  },
  {
    "tag": "CUBE Aggregation Dimensions",
    "lvl": "advanced",
    "q": "For 3 grouping columns `GROUP BY CUBE(a, b, c)`, how many distinct grouping level subtotals are computed?",
    "o": [
      "3",
      "$2^3 = 8$ grouping sets (all possible power set combinations of ${a, b, c}$)",
      "6",
      "9"
    ],
    "a": 1,
    "x": "`CUBE` computes aggregations for all $2^N$ combinations of the $N$ specified columns."
  }
]);

/* ===================================================================
   Module: write — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "write", [
  {
    "tag": "UPSERT ON CONFLICT DO UPDATE",
    "lvl": "advanced",
    "q": "In PostgreSQL `INSERT INTO table (id, val) VALUES (1, 'x') ON CONFLICT (id) DO UPDATE SET val = EXCLUDED.val;`, what does `EXCLUDED` represent?",
    "o": [
      "The existing row on disk",
      "A special pseudo-relation containing the row proposed for insertion that triggered the uniqueness conflict",
      "Rows that failed validation",
      "The previous transaction ID"
    ],
    "a": 1,
    "x": "`EXCLUDED` refers to the new incoming tuple that conflicted with the unique constraint, allowing dynamic updates."
  },
  {
    "tag": "DELETE vs TRUNCATE Mechanics",
    "lvl": "advanced",
    "q": "Why is `TRUNCATE TABLE` orders of magnitude faster than `DELETE FROM table` on a 100M-row table?",
    "o": [
      "`TRUNCATE` deletes indexes only",
      "`DELETE` scans and marks dead tuples row-by-row writing individual WAL records; `TRUNCATE` deallocates table storage pages directly and creates a single metadata/checkpoint WAL record",
      "`TRUNCATE` runs in memory",
      "`DELETE` converts to updates"
    ],
    "a": 1,
    "x": "`DELETE` logs individual row deletions in the WAL and triggers MVCC dead tuple allocation. `TRUNCATE` deallocates data pages directly."
  },
  {
    "tag": "Foreign Key Cascade Deadlocks",
    "lvl": "advanced",
    "q": "Why can deleting rows from a parent table with `ON DELETE CASCADE` cause deadlocks in high-concurrency systems?",
    "o": [
      "Cascade deletes corrupt memory",
      "Postgres acquires row locks on matching child rows in non-deterministic order; concurrent deletes across different parent rows can acquire child locks in reverse order, creating a deadlock",
      "Cascade deletes bypass indexes",
      "Cascade is single-threaded"
    ],
    "a": 1,
    "x": "Cascading deletions lock referenced child rows. If two transactions delete different parent rows that touch intersecting child tables in different orders, lock cycles form."
  },
  {
    "tag": "Merge Statement ANSI UPSERT",
    "lvl": "advanced",
    "q": "What is the ANSI SQL standard statement for performing atomic multi-table inserts, updates, and deletes in a single atomic pass?",
    "o": [
      "`UPSERT`",
      "`MERGE INTO target USING source ON (condition) WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...`",
      "`INSERT OR REPLACE`",
      "`JOIN UPDATE`"
    ],
    "a": 1,
    "x": "The SQL:2003 standard `MERGE` statement combines conditional inserts, updates, and deletes based on join condition matches."
  }
]);

/* ===================================================================
   Module: views — (3 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "views", [
  {
    "tag": "Materialized View Fast Refresh",
    "lvl": "advanced",
    "q": "What is the key performance trade-off of a Materialized View with `REFRESH MATERIALIZED VIEW CONCURRENTLY` in Postgres?",
    "o": [
      "Requires table locking",
      "Allows read queries to continue uninterrupted during refresh, but requires a unique index on the materialized view and incurs temporary disk space overhead",
      "Deletes all indexes",
      "Cannot use SQL joins"
    ],
    "a": 1,
    "x": "Concurrent refresh creates a temporary copy of the view and applies diffs using a unique index, preventing exclusive read locks."
  },
  {
    "tag": "Updatable Views Criteria",
    "lvl": "advanced",
    "q": "According to SQL standards, under what condition is a standard VIEW automatically updatable (`INSERT`/`UPDATE`)?",
    "o": [
      "All views are updatable",
      "The view is defined over a single base table without `DISTINCT`, `GROUP BY`, `HAVING`, `UNION`, or aggregate window functions",
      "The view uses `CROSS JOIN`",
      "The view has fewer than 10 columns"
    ],
    "a": 1,
    "x": "A view is directly updatable if there is a direct 1-to-1 mapping between view rows and base table rows without aggregation or set operations."
  },
  {
    "tag": "Partition Pruning in Postgres",
    "lvl": "advanced",
    "q": "How does declarative partition pruning optimize `SELECT * FROM sales WHERE sale_date >= '2025-01-01'` on a table partitioned by month?",
    "o": [
      "Scans all partitions in parallel",
      "The query planner evaluates the constraint boundary and completely excludes non-matching partition sub-tables from the execution scan tree",
      "Merges partitions into one file",
      "Converts table to in-memory hash"
    ],
    "a": 1,
    "x": "Partition pruning analyzes `WHERE` conditions against partition boundary constraints, omitting unneeded child table scans."
  }
]);

/* ===================================================================
   Module: brief — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("sql", "brief", [
  {
    "tag": "Relational Closure Property",
    "lvl": "advanced",
    "q": "What is the fundamental **Closure Property** of Relational Algebra that forms the foundation of SQL composability?",
    "o": [
      "All queries return numbers",
      "Every relational operator takes one or more relations (tables) as input and produces a relation (table) as output, allowing infinite query nesting and subqueries",
      "Transactions must close connections",
      "Schemas are immutable"
    ],
    "a": 1,
    "x": "Because the output of every relational operation is another relation, queries, joins, and filters can be nested and composed arbitrarily."
  },
  {
    "tag": "First Normal Form (1NF) Violation",
    "lvl": "advanced",
    "q": "Which of the following database column definitions directly violates First Normal Form (1NF)?",
    "o": [
      "`user_id INT PRIMARY KEY`",
      "`emails VARCHAR(255)` storing comma-separated values `'a@x.com, b@x.com'` (non-atomic domain)",
      "`created_at TIMESTAMP`",
      "`amount DECIMAL(10,2)`"
    ],
    "a": 1,
    "x": "1NF requires that all attribute domains contain atomic (indivisible) values. Storing comma-separated lists violates 1NF."
  },
  {
    "tag": "Second Normal Form (2NF) Partial Dependency",
    "lvl": "advanced",
    "q": "In a table with composite primary key `(student_id, course_id)`, which attribute represents a partial dependency violating 2NF?",
    "o": [
      "`grade` (depends on both `student_id` and `course_id`)",
      "`student_name` (depends solely on `student_id`, a proper subset of the composite key)",
      "`enrollment_date`",
      "`attendance_score`"
    ],
    "a": 1,
    "x": "2NF requires that no non-prime attribute is functionally dependent on a proper subset of any candidate key. `student_name` depends only on `student_id`."
  },
  {
    "tag": "Third Normal Form (3NF) Transitive Dependency",
    "lvl": "advanced",
    "q": "In a table `(emp_id, dept_id, dept_head)`, what constitutes a transitive dependency violating 3NF?",
    "o": [
      "`emp_id -> dept_id` and `dept_id -> dept_head` (non-key attribute `dept_head` depends on non-key attribute `dept_id`)",
      "`emp_id -> emp_name`",
      "`emp_id` is unique",
      "`dept_id` is indexed"
    ],
    "a": 0,
    "x": "3NF requires that no non-key attribute depends transitively on the primary key through another non-key attribute."
  },
  {
    "tag": "BCNF vs 3NF Strictness",
    "lvl": "advanced",
    "q": "What is the condition that Boyce-Codd Normal Form (BCNF) enforces that makes it strictly stronger than 3NF?",
    "o": [
      "BCNF requires no foreign keys",
      "For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must be a **Superkey** (eliminates anomalies where a prime attribute depends on a non-superkey)",
      "BCNF allows duplicate rows",
      "BCNF requires 4NF"
    ],
    "a": 1,
    "x": "3NF permits $X \\rightarrow Y$ if $Y$ is a prime attribute. BCNF eliminates this exception: the determinant $X$ must always be a superkey."
  }
]);

