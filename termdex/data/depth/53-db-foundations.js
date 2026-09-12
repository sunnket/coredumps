/* ==========================================================================
   Depth pass 53 — databases batch 1: SQL foundations.

   SQL is four sub-languages in a trench coat. Understanding which
   sub-language a statement belongs to tells you its blast radius: DDL
   changes structure, DML changes data, DQL reads data, DCL changes
   permissions, and TCL controls transactions.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "sql",

      why: {
        before: "Accessing data meant writing procedural code that navigated " +
          "the physical storage — open file, seek to offset, read bytes, " +
          "parse fields.",
        problem: "Procedural data access couples the program to the storage " +
          "format. Change the layout, rewrite every program that reads it.",
        shift: "**Describe what you want, not how to get it.** SQL is " +
          "declarative: `SELECT name FROM users WHERE active = true` says " +
          "nothing about indexes, scan order, or join algorithms. The " +
          "database's query optimiser decides the physical plan. This " +
          "separation of logical query from physical execution is why SQL " +
          "has survived for 50 years."
      },

      num: {
        t: "SQL's five sub-languages",
        h: ["Sub-language", "Purpose", "Key statements"],
        r: [
          ["**DDL**", "**define structure**", "**CREATE, ALTER, DROP**"],
          ["**DML**", "**modify data**", "**INSERT, UPDATE, DELETE**"],
          ["**DQL**", "**query data**", "**SELECT**"],
          ["**DCL**", "**control access**", "**GRANT, REVOKE**"],
          ["**TCL**", "**manage transactions**", "**COMMIT, ROLLBACK, SAVEPOINT**"]
        ],
        n: "SQL's durability comes from its **declarative nature**: you " +
          "describe the result set, and the engine decides the execution " +
          "plan. This means the same SQL can run on PostgreSQL, MySQL, " +
          "SQLite, and BigQuery with different physical strategies but the " +
          "same logical result. In practice, dialects diverge on window " +
          "functions, CTEs, JSON support, and procedural extensions — but " +
          "the core SELECT/FROM/WHERE/JOIN/GROUP BY is universal. **SQL is " +
          "the most widely used programming language in the world** when " +
          "measured by number of users, because it is used by analysts, " +
          "data scientists, and engineers alike. The critical skill is not " +
          "memorising syntax but understanding **what the optimiser does " +
          "with your query**: when it uses an index, when it chooses a " +
          "hash join vs a nested loop, and when it decides to scan the " +
          "whole table."
      },

      miss: [
        {
          w: "SQL is just for databases.",
          r: "SQL queries run on data lakes (Spark SQL, Presto, Trino), " +
            "stream processors (Flink SQL, ksqlDB), and even in-memory " +
            "data frames (DuckDB, DataFusion). SQL is a query interface, " +
            "not a database."
        },
        {
          w: "SQL is simple.",
          r: "Basic SELECT is simple. Window functions, recursive CTEs, " +
            "lateral joins, and query optimisation are genuinely complex " +
            "and require deep understanding."
        },
        {
          w: "NoSQL replaced SQL.",
          r: "Most NoSQL databases have added SQL-like query languages " +
            "(Cassandra CQL, MongoDB's aggregation pipeline, DynamoDB " +
            "PartiQL). SQL won — even its competitors adopted it."
        },
        {
          w: "The order of SQL clauses matches execution order.",
          r: "You write SELECT before FROM, but the engine executes FROM " +
            "first. The logical execution order is: FROM → WHERE → GROUP BY " +
            "→ HAVING → SELECT → ORDER BY → LIMIT."
        }
      ],

      trade: {
        buys: [
          "Declarative — describe what, not how.",
          "Optimiser chooses the best physical plan.",
          "Universal across relational databases.",
          "Readable by non-programmers.",
          "50 years of tooling, training, and investment."
        ],
        costs: [
          "Dialect differences between databases.",
          "Complex queries are hard to debug — no step-through.",
          "Impedance mismatch with object-oriented code.",
          "Limited expressiveness for graph or recursive problems.",
          "Procedural extensions (PL/pgSQL, T-SQL) vary wildly."
        ],
        avoid: [
          "When the data model is not tabular (graphs, documents).",
          "When the query pattern is purely key-value lookup.",
          "When sub-millisecond latency is required and the overhead of " +
            "SQL parsing matters."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ddl",

      why: {
        before: "Database structure was defined by whatever the DBA typed " +
          "into the console. No version control, no migration path, no " +
          "audit trail.",
        problem: "Changing a table's structure affects every query and " +
          "application that touches it. Without a formal language for " +
          "structure changes, coordination is impossible.",
        shift: "**Data Definition Language: the SQL sub-language for " +
          "structure.** CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE " +
          "INDEX — these statements define the schema. In modern practice, " +
          "DDL is written in migration files, version-controlled, and " +
          "applied through a migration tool."
      },

      num: {
        t: "DDL statements and their blast radius",
        h: ["Statement", "What it does", "Risk level"],
        r: [
          ["**CREATE TABLE**", "**defines a new table**", "**safe — additive**"],
          ["**ALTER TABLE ADD**", "**adds a column**", "**safe — existing queries unaffected**"],
          ["**ALTER TABLE DROP**", "**removes a column**", "**dangerous — breaks queries using it**"],
          ["ALTER TABLE MODIFY", "changes column type", "dangerous — may fail or truncate"],
          ["**DROP TABLE**", "**deletes the table entirely**", "**destructive — data gone**"],
          ["CREATE INDEX", "adds an index", "safe but can lock the table"],
          ["**DROP INDEX**", "**removes an index**", "**queries may slow down dramatically**"]
        ],
        n: "DDL changes are the highest-risk database operations because " +
          "they affect **structure**, not just data. Dropping a column that " +
          "an application reads causes a runtime crash, not a graceful " +
          "error. The safe pattern for schema changes is: **add the new " +
          "column → deploy code that writes to both old and new → migrate " +
          "data → deploy code that reads from new → drop the old column.** " +
          "This multi-step process is called **expand-and-contract " +
          "migration** and is the only safe way to make breaking schema " +
          "changes in a running system. Many DDL operations take **locks** " +
          "on the table — in PostgreSQL, `ALTER TABLE ADD COLUMN` with a " +
          "DEFAULT takes an ACCESS EXCLUSIVE lock, blocking all reads and " +
          "writes. Adding columns as nullable without a default avoids " +
          "this. Tools like **pg_repack** and **gh-ost** (GitHub's online " +
          "schema change) handle migrations without locking."
      },

      miss: [
        {
          w: "DDL changes are instant.",
          r: "Many DDL operations take **table locks** that block all " +
            "queries. On large tables, ALTER TABLE can take minutes or " +
            "hours, during which the table is unavailable."
        },
        {
          w: "Adding a column with a default is safe.",
          r: "In PostgreSQL before version 11, adding a column with a " +
            "DEFAULT rewrote the entire table. In MySQL, many ALTERs still " +
            "copy the table. Check your engine's documentation."
        },
        {
          w: "DROP TABLE can be undone.",
          r: "In most databases, DROP TABLE is **permanent**. There is no " +
            "recycle bin. The only recovery is from backups."
        },
        {
          w: "Schema changes should be applied manually.",
          r: "Manual DDL is unauditable and unrepeatable. Use migration " +
            "tools (Flyway, Alembic, Knex, Prisma) with version-controlled " +
            "migration files."
        }
      ],

      trade: {
        buys: [
          "Formalises schema changes in auditable, repeatable statements.",
          "Migration tools apply DDL in order across environments.",
          "Indexes created via DDL accelerate query performance.",
          "Constraints enforce data integrity at the database level.",
          "Schema evolution is trackable in version control."
        ],
        costs: [
          "Many DDL operations take exclusive locks.",
          "Breaking changes require multi-step expand-and-contract.",
          "Different engines handle the same DDL differently.",
          "Large table alterations can take hours.",
          "Rollback of DDL is often not transactional."
        ],
        avoid: [
          "Direct DDL in production without migration tooling.",
          "DROP operations without backups.",
          "Altering columns under load without checking lock behaviour."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dml",

      why: {
        before: "Modifying data meant opening a file, finding the right " +
          "bytes, and overwriting them. Error recovery was the " +
          "programmer's problem.",
        problem: "File-level data modification has no atomicity, no " +
          "concurrency control, and no constraint checking. Partial " +
          "writes corrupt data.",
        shift: "**Data Manipulation Language: modify data through the " +
          "database engine.** INSERT, UPDATE, DELETE operate within " +
          "transactions, respect constraints, update indexes, and write " +
          "to the write-ahead log before touching data pages — so crashes " +
          "cannot corrupt the database."
      },

      num: {
        t: "DML operations and their costs",
        h: ["Operation", "What it does", "Hidden cost"],
        r: [
          ["**INSERT**", "**adds rows**", "**index updates for every indexed column**"],
          ["**UPDATE**", "**modifies existing rows**", "**may move rows if size changes; triggers fire**"],
          ["**DELETE**", "**removes rows**", "**dead tuples need vacuuming (Postgres)**"],
          ["UPSERT", "insert or update", "engine-specific syntax (ON CONFLICT, MERGE)"],
          ["**BULK INSERT**", "**batch load**", "**faster but may skip triggers**"],
          ["TRUNCATE", "remove all rows fast", "DDL-like — no per-row logging"]
        ],
        n: "DML is where **write amplification** lives. A single INSERT " +
          "into a table with 5 indexes generates 6 writes: one to the " +
          "table and one to each index's B-tree. An UPDATE that changes " +
          "an indexed column requires removing the old index entry and " +
          "inserting a new one. This is why over-indexing hurts write " +
          "performance. DELETE in PostgreSQL does not physically remove " +
          "rows — it marks them as dead tuples, and VACUUM reclaims the " +
          "space later. **Batching** is the single most impactful " +
          "performance optimisation for DML: inserting 1,000 rows in one " +
          "statement is dramatically faster than 1,000 individual INSERT " +
          "statements because each statement has parsing, planning, and " +
          "logging overhead. **RETURNING** clauses (PostgreSQL, SQL Server " +
          "OUTPUT) let you get the affected rows back in the same " +
          "statement, avoiding a separate SELECT."
      },

      miss: [
        {
          w: "DELETE physically removes data immediately.",
          r: "In PostgreSQL, DELETE marks rows as dead. VACUUM reclaims " +
            "space. In InnoDB, the purge thread cleans up after the " +
            "undo log. Physical removal is asynchronous."
        },
        {
          w: "UPDATE in place is cheap.",
          r: "If the updated row no longer fits in its page, the database " +
            "moves it. If indexed columns change, indexes are updated. An " +
            "UPDATE can be as expensive as DELETE + INSERT."
        },
        {
          w: "TRUNCATE is the same as DELETE FROM table.",
          r: "TRUNCATE is DDL-like: it does not log individual rows, does " +
            "not fire row-level triggers, and is much faster. But it " +
            "cannot be filtered with WHERE and resets sequences in most " +
            "databases."
        },
        {
          w: "Inserting one row at a time is fine.",
          r: "Each INSERT has parsing, planning, and WAL overhead. Batching " +
            "1,000 rows into one INSERT is typically 10–50× faster."
        }
      ],

      trade: {
        buys: [
          "Transactional safety — all or nothing.",
          "Constraint enforcement on every write.",
          "Trigger and cascade support for data integrity.",
          "Logging enables point-in-time recovery.",
          "Concurrency control via MVCC or locks."
        ],
        costs: [
          "Write amplification from index maintenance.",
          "Per-row overhead makes single inserts slow.",
          "Dead tuples require background cleanup.",
          "Triggers add hidden execution paths.",
          "Lock contention under high write concurrency."
        ],
        avoid: [
          "Bulk loading with per-row DML — use COPY or bulk insert.",
          "DELETE without WHERE — use TRUNCATE if you want all rows gone.",
          "UPDATE of indexed columns in hot tables without analysing impact."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dql",

      why: {
        before: "Reading data meant traversing files sequentially, applying " +
          "filters in code, and aggregating results manually.",
        problem: "Procedural data reading is verbose, error-prone, and " +
          "reimplements optimisations that the database already knows.",
        shift: "**Data Query Language: declarative data retrieval.** SELECT " +
          "with FROM, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, and LIMIT " +
          "lets you express complex queries concisely. The optimiser " +
          "decides how to execute them efficiently."
      },

      num: {
        t: "SELECT execution order (logical)",
        h: ["Step", "Clause", "What happens"],
        r: [
          ["1", "**FROM / JOIN**", "**assemble the source tables**"],
          ["2", "**WHERE**", "**filter rows**"],
          ["3", "**GROUP BY**", "**partition into groups**"],
          ["4", "HAVING", "filter groups"],
          ["5", "**SELECT**", "**compute columns and expressions**"],
          ["6", "DISTINCT", "remove duplicates"],
          ["7", "**ORDER BY**", "**sort results**"],
          ["8", "**LIMIT / OFFSET**", "**truncate output**"]
        ],
        n: "The logical execution order is **not the written order**. You " +
          "write SELECT first but it executes fifth. This explains why you " +
          "cannot use a column alias from SELECT in the WHERE clause — " +
          "WHERE runs before SELECT. Understanding this order resolves " +
          "most SQL confusion. **Window functions** (`ROW_NUMBER`, `RANK`, " +
          "`SUM OVER`) execute after SELECT but before ORDER BY, which is " +
          "why they can refer to SELECT expressions. The most common " +
          "performance issue in DQL is the **full table scan**: when the " +
          "optimiser cannot use an index for the WHERE clause, it reads " +
          "every row. EXPLAIN (or EXPLAIN ANALYZE in PostgreSQL) shows the " +
          "execution plan and is the **single most important debugging " +
          "tool** for slow queries."
      },

      miss: [
        {
          w: "SELECT * is convenient and harmless.",
          r: "It fetches columns you do not need, prevents covering index " +
            "optimisations, and breaks when columns are added. Always list " +
            "the columns you need."
        },
        {
          w: "SQL executes in the order you write it.",
          r: "FROM executes first, SELECT executes fifth. This is why " +
            "aliases from SELECT are not available in WHERE."
        },
        {
          w: "Adding ORDER BY does not cost anything if the data is already sorted.",
          r: "The database does not know the data is already sorted unless " +
            "an index provides order. Without an index, ORDER BY sorts the " +
            "entire result set."
        },
        {
          w: "LIMIT 10 makes any query fast.",
          r: "LIMIT applies last. If the query scans a million rows, " +
            "aggregates them, sorts them, and then takes 10 — you paid " +
            "for the million rows."
        }
      ],

      trade: {
        buys: [
          "Declarative — the engine optimises physical execution.",
          "Composable — subqueries, CTEs, and joins combine cleanly.",
          "EXPLAIN reveals the execution plan for debugging.",
          "Window functions handle analytics without self-joins.",
          "Standardised across databases."
        ],
        costs: [
          "Complex queries are hard to debug — no step-through.",
          "Performance depends on indexes and statistics the user must maintain.",
          "Execution order differs from written order, confusing beginners.",
          "Correlated subqueries can cause N+1-like performance issues.",
          "Large result sets consume memory."
        ],
        avoid: [
          "Real-time streaming — SQL is batch-oriented by nature.",
          "When a simple key-value lookup is all you need.",
          "When the data model is deeply nested (prefer document queries)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dcl",

      why: {
        before: "Database access was all-or-nothing. If you could connect, " +
          "you could do anything — read any table, drop any schema.",
        problem: "Not everyone who needs to read data should be able to " +
          "delete it. Analysts need SELECT, not DROP. Applications need " +
          "INSERT, not ALTER.",
        shift: "**Data Control Language: fine-grained access control.** " +
          "GRANT and REVOKE assign permissions to users and roles at the " +
          "table, column, and even row level. The principle of least " +
          "privilege says every user should have exactly the permissions " +
          "they need and no more."
      },

      num: {
        t: "DCL permission levels",
        h: ["Permission", "Allows", "Typical recipient"],
        r: [
          ["**SELECT**", "**read rows**", "**analysts, read replicas, dashboards**"],
          ["**INSERT**", "**add rows**", "**application write path**"],
          ["**UPDATE**", "**modify rows**", "**application write path**"],
          ["**DELETE**", "**remove rows**", "**admin, carefully scoped application**"],
          ["CREATE", "create tables/indexes", "migration tool, DBA"],
          ["**DROP**", "**destroy objects**", "**DBA only, with caution**"],
          ["GRANT", "delegate permissions", "DBA / role admin"]
        ],
        n: "The practical pattern is **role-based access**: create roles " +
          "(`app_read`, `app_write`, `admin`) with specific permissions, " +
          "then assign users to roles. This avoids managing permissions " +
          "per user. **Row-Level Security** (RLS) in PostgreSQL goes " +
          "further: policies filter rows based on the current user, so " +
          "tenant A cannot see tenant B's data even if they query the " +
          "same table. This is critical for multi-tenant SaaS applications. " +
          "The most common security mistake is running the application " +
          "with a **superuser** connection that can DROP tables. In " +
          "practice, the application should use a role with only SELECT, " +
          "INSERT, UPDATE, and DELETE on the tables it needs — never " +
          "DDL privileges."
      },

      miss: [
        {
          w: "The application database user can be admin.",
          r: "An SQL injection in the application becomes a DROP TABLE if " +
            "the user has DDL privileges. The application user should have " +
            "**only DML permissions** on the specific tables it uses."
        },
        {
          w: "GRANT is a one-time setup.",
          r: "As schemas evolve, new tables and columns need permissions. " +
            "Default privileges and role-based grants automate this."
        },
        {
          w: "Permissions are just for security.",
          r: "They also prevent accidents. An analyst who cannot DROP TABLE " +
            "cannot accidentally destroy production data."
        },
        {
          w: "Application-level auth replaces database-level auth.",
          r: "Application-level auth controls who uses the application. " +
            "Database-level auth controls what the **application itself** " +
            "can do — defence in depth."
        }
      ],

      trade: {
        buys: [
          "Principle of least privilege — users get only what they need.",
          "Defence in depth — SQL injection with limited privileges does less damage.",
          "Role-based management scales to large teams.",
          "Row-Level Security enables multi-tenant isolation.",
          "Auditable — permissions are queryable metadata."
        ],
        costs: [
          "Initial setup overhead.",
          "Schema changes require updating permissions.",
          "Overly restrictive permissions break application features.",
          "Different databases have different permission models.",
          "Complex permission hierarchies are hard to audit."
        ],
        avoid: [
          "Do not avoid DCL. Every database should have proper access " +
            "control from day one. The cost of not setting it up is one " +
            "accident or breach away."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tcl",

      why: {
        before: "Every SQL statement executed immediately and permanently. " +
          "There was no way to group related changes and commit or " +
          "rollback them as a unit.",
        problem: "Transferring money from account A to account B requires " +
          "two UPDATEs. If the second fails, account A has lost money that " +
          "never arrived at account B. Partial execution corrupts data.",
        shift: "**Transaction Control Language: group statements into atomic " +
          "units.** BEGIN, COMMIT, ROLLBACK, and SAVEPOINT let you execute " +
          "a sequence of statements that either all succeed or all fail. " +
          "This is the A in ACID."
      },

      num: {
        t: "TCL statements and their roles",
        h: ["Statement", "What it does", "When to use"],
        r: [
          ["**BEGIN**", "**start a transaction**", "**before any grouped DML**"],
          ["**COMMIT**", "**make changes permanent**", "**when all statements succeeded**"],
          ["**ROLLBACK**", "**undo all changes since BEGIN**", "**when any statement failed**"],
          ["**SAVEPOINT**", "**create a named rollback point**", "**partial rollback within a transaction**"],
          ["RELEASE SAVEPOINT", "remove a savepoint", "free resources"],
          ["SET TRANSACTION", "set isolation level", "control visibility of concurrent changes"]
        ],
        n: "The key insight is that **transactions are not optional in any " +
          "real application**. Even a 'simple' web request that reads a " +
          "user and updates their last-login time should be in a " +
          "transaction — otherwise, a crash between the read and write " +
          "leaves inconsistent state. Most databases auto-commit each " +
          "statement by default (autocommit mode), which means every " +
          "statement is its own transaction. This is safe for single " +
          "statements but dangerous for multi-statement operations: if " +
          "you INSERT into two tables and the second fails, the first " +
          "INSERT is already committed. **Always use explicit transactions " +
          "for multi-statement operations.** SAVEPOINTs enable retrying " +
          "part of a transaction without rolling back everything — useful " +
          "when inserting a batch of rows where some may violate " +
          "constraints."
      },

      miss: [
        {
          w: "Autocommit is fine for applications.",
          r: "Autocommit makes each statement its own transaction. Multi-" +
            "statement operations need explicit BEGIN/COMMIT to ensure " +
            "atomicity."
        },
        {
          w: "Transactions are only for financial applications.",
          r: "Any operation that modifies multiple rows or tables needs " +
            "transaction protection. A user registration that creates a " +
            "user row and an email verification row must be atomic."
        },
        {
          w: "Long transactions are fine.",
          r: "Long transactions hold locks, prevent vacuum (in Postgres), " +
            "and increase the chance of conflicts. Keep transactions as " +
            "short as possible."
        },
        {
          w: "ROLLBACK recovers from any error.",
          r: "ROLLBACK undoes changes within the current transaction. It " +
            "does not undo committed transactions, repair corrupted files, " +
            "or restore dropped tables."
        }
      ],

      trade: {
        buys: [
          "Atomic multi-statement operations — all or nothing.",
          "SAVEPOINTs enable partial rollback.",
          "Isolation levels control visibility of concurrent changes.",
          "Crash recovery — uncommitted transactions are rolled back.",
          "Explicit commit points for auditing and debugging."
        ],
        costs: [
          "Long transactions hold locks and degrade concurrency.",
          "Transaction management adds code complexity.",
          "Forgotten BEGIN/COMMIT in autocommit mode is a silent bug.",
          "Nested transactions are not universally supported.",
          "Distributed transactions across databases are complex and slow."
        ],
        avoid: [
          "Read-only queries that do not need atomicity.",
          "Bulk data loads where autocommit per-batch is sufficient.",
          "When using an ORM that manages transactions automatically — " +
            "but verify the ORM does it correctly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "relational-database",

      why: {
        before: "Data was stored in hierarchical or network models — rigid " +
          "structures where navigating from one record to another required " +
          "following physical pointers.",
        problem: "Pointer-based navigation couples programs to the physical " +
          "storage layout. Adding a new query path meant restructuring " +
          "the data or writing complex traversal code.",
        shift: "**Store data in tables of rows and columns, related by " +
          "keys.** Codd's relational model separates the **logical " +
          "structure** (tables, foreign keys) from the **physical " +
          "storage**. Any query is expressible as a set operation on " +
          "tables, regardless of how the data is physically stored."
      },

      num: {
        t: "Relational model core concepts",
        h: ["Concept", "What it means", "Why it matters"],
        r: [
          ["**Table (relation)**", "**a set of rows with defined columns**", "**the fundamental unit of storage**"],
          ["**Row (tuple)**", "**one record**", "**each row has the same columns**"],
          ["Column (attribute)", "one field", "has a name and a type"],
          ["**Primary key**", "**unique identifier per row**", "**no two rows are the same**"],
          ["**Foreign key**", "**reference to another table's PK**", "**enforces relationships**"],
          ["**Normalisation**", "**eliminate data redundancy**", "**one fact in one place**"],
          ["Constraint", "a rule the DB enforces", "NOT NULL, UNIQUE, CHECK, FK"]
        ],
        n: "The relational model's power is **ad-hoc query capability**: " +
          "any column can be filtered, joined, aggregated, or grouped " +
          "without pre-defining the query path. This is in contrast to " +
          "NoSQL databases, where query patterns are typically designed " +
          "into the data model. The cost is that **joins** — the mechanism " +
          "for reassembling normalised data — can be expensive on large " +
          "tables. **ACID transactions** are the relational database's " +
          "other killer feature: atomicity, consistency, isolation, and " +
          "durability guarantee that data is correct even under concurrent " +
          "access and crashes. PostgreSQL, MySQL, SQL Server, Oracle, and " +
          "SQLite are all relational databases, each with different " +
          "strengths: PostgreSQL for extensibility and correctness, MySQL " +
          "for read-heavy web workloads, SQLite for embedded local " +
          "databases."
      },

      miss: [
        {
          w: "Relational databases cannot scale.",
          r: "PostgreSQL handles tables with billions of rows. Sharded " +
            "relational databases (Vitess, CockroachDB, Spanner) scale " +
            "horizontally. The scalability limit is often in the " +
            "application's query patterns, not the database."
        },
        {
          w: "NoSQL is better than relational.",
          r: "NoSQL databases trade **query flexibility for write " +
            "scalability**. If you need ad-hoc queries, joins, and " +
            "transactions, relational databases are the right tool."
        },
        {
          w: "You should denormalise from the start for performance.",
          r: "Start normalised. Denormalise **specific, measured " +
            "bottlenecks** — not speculatively. Premature denormalisation " +
            "trades data integrity for performance you may not need."
        },
        {
          w: "Relational databases cannot handle unstructured data.",
          r: "PostgreSQL has JSONB columns with indexes and query operators. " +
            "Most relational databases support JSON, XML, and full-text " +
            "search natively."
        }
      ],

      trade: {
        buys: [
          "Ad-hoc queries — any column can be queried without pre-planning.",
          "ACID transactions guarantee data correctness.",
          "Normalisation eliminates data redundancy.",
          "Foreign keys enforce referential integrity.",
          "50 years of tooling, expertise, and battle-testing."
        ],
        costs: [
          "Schema must be defined upfront (though migrations help).",
          "Joins on large tables can be expensive.",
          "Vertical scaling has limits — horizontal sharding is complex.",
          "Schema changes require migrations in running systems.",
          "Object-relational impedance mismatch with OOP code."
        ],
        avoid: [
          "When the data model is hierarchical/nested and never joined.",
          "When write throughput requires horizontal scaling beyond " +
            "what a single node can handle.",
          "When the query pattern is exclusively key-value lookup."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "primary-key",

      why: {
        before: "Tables had rows, but no guaranteed way to identify " +
          "a specific row uniquely. Two rows could be identical.",
        problem: "Without unique identification, UPDATE and DELETE cannot " +
          "target a specific row. Foreign keys cannot reference a specific " +
          "row. Joins produce ambiguous results.",
        shift: "**Every row must be uniquely identifiable.** A primary key " +
          "is a column (or combination of columns) that uniquely identifies " +
          "each row, is never null, and has a unique index by default. It " +
          "is the address of a row."
      },

      num: {
        t: "Primary key strategies",
        h: ["Strategy", "Example", "Trade-off"],
        r: [
          ["**Auto-increment integer**", "**1, 2, 3, ...**", "**simple, compact, but reveals row count**"],
          ["**UUID v4**", "**random 128-bit**", "**globally unique, but large (16 bytes) and unordered**"],
          ["**UUID v7 / ULID**", "**timestamp + random**", "**globally unique AND sortable by time**"],
          ["Natural key", "email, SSN", "meaningful but mutable and PII"],
          ["**Composite key**", "**(user_id, order_id)**", "**multi-column, no surrogate needed**"],
          ["Snowflake ID", "timestamp + worker + seq", "distributed, sortable"]
        ],
        n: "The primary key is also the **clustering key** in most " +
          "databases (InnoDB, SQL Server) — rows are physically stored in " +
          "primary key order. This means **random UUIDs fragment the table** " +
          "because new rows insert at random positions, causing page splits " +
          "and fragmentation. **UUID v7** (or ULID) solves this by " +
          "embedding a timestamp prefix, so new keys are approximately " +
          "sequential. The choice between auto-increment and UUID depends " +
          "on whether the system is **distributed** (UUIDs can be generated " +
          "anywhere without coordination) or **single-node** (auto-increment " +
          "is simpler and more compact). **Natural keys** (using a business " +
          "value like email) are tempting but fragile: if the email changes, " +
          "every foreign key reference must change. Prefer **surrogate " +
          "keys** (generated values with no business meaning) for primary " +
          "keys and unique constraints on natural keys."
      },

      miss: [
        {
          w: "UUID v4 is always the best choice.",
          r: "UUID v4 is **randomly ordered**, causing B-tree fragmentation " +
            "and poor cache locality. UUID v7 is sorted by time and avoids " +
            "this issue. Use v7 or ULID for new systems."
        },
        {
          w: "Auto-increment IDs expose sensitive information.",
          r: "They reveal **ordering and count**, not data. If this is a " +
            "concern (competitor scraping, enumeration attacks), use UUIDs " +
            "for external-facing identifiers and auto-increment internally."
        },
        {
          w: "Composite keys are bad practice.",
          r: "They are appropriate when the combination naturally " +
            "identifies the row (e.g., `student_id + course_id` for " +
            "enrollment). They avoid a meaningless surrogate column."
        },
        {
          w: "Primary keys can be changed.",
          r: "Technically yes, but changing a PK requires updating every " +
            "foreign key reference. In practice, primary keys should be " +
            "**immutable** — never change them."
        }
      ],

      trade: {
        buys: [
          "Unique identification of every row.",
          "Efficient lookups via the clustered index.",
          "Foreign key references are unambiguous.",
          "Default unique index — no separate index needed.",
          "Required for UPDATE and DELETE targeting specific rows."
        ],
        costs: [
          "Choice of strategy affects performance (UUID v4 fragmentation).",
          "Composite keys make foreign key references more complex.",
          "Natural keys are fragile — business data changes.",
          "Auto-increment requires coordination in distributed systems.",
          "Large keys (UUID) increase index size and join cost."
        ],
        avoid: [
          "Using mutable business data as a primary key.",
          "Random UUIDs as clustering keys in write-heavy tables.",
          "Changing primary keys after they are referenced by foreign keys."
        ]
      }
    }

  ]);
})(window.TD);
