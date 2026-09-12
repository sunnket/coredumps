/* ==========================================================================
   Depth pass 55 — databases batch 3: schema, queries, NULL, NoSQL.

   NULL is not a value — it is the absence of a value. This single fact
   explains most SQL surprises: NULL = NULL is not TRUE, COUNT(*) counts
   NULLs but COUNT(column) does not, and GROUP BY puts all NULLs together.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "schema",

      why: {
        before: "Data was stored in whatever format the program decided. " +
          "Change the program, change the format — nothing enforced " +
          "consistency.",
        problem: "Multiple applications writing to the same storage with " +
          "different assumptions produce corrupt data. Without a formal " +
          "definition of what the data looks like, validation is impossible.",
        shift: "**Define the structure before storing data.** A schema " +
          "declares tables, columns, types, constraints, and relationships. " +
          "It is a contract between the database and every application that " +
          "uses it — enforced by the database itself."
      },

      num: {
        t: "Schema elements and their roles",
        h: ["Element", "What it defines", "Enforcement"],
        r: [
          ["**Table**", "**rows and columns**", "**only declared columns accepted**"],
          ["**Column type**", "**INTEGER, VARCHAR, TIMESTAMP...**", "**type mismatch rejected**"],
          ["**NOT NULL**", "**column must have a value**", "**NULL insert rejected**"],
          ["**UNIQUE**", "**no duplicate values**", "**duplicate insert rejected**"],
          ["**CHECK**", "**custom constraint (age > 0)**", "**violating insert/update rejected**"],
          ["**DEFAULT**", "**value when not provided**", "**auto-fills on INSERT**"],
          ["Foreign Key", "reference to another table", "orphan rejected"]
        ],
        n: "The schema is the database's **immune system** — it rejects " +
          "invalid data before it enters the system. This is why database " +
          "constraints are superior to application-level validation alone: " +
          "an application bug can bypass validation, but the database " +
          "constraint cannot be bypassed. **Schema-on-write** (relational) " +
          "validates data when it is written. **Schema-on-read** (data " +
          "lakes, some NoSQL) stores anything and validates when queried. " +
          "The trade-off is clear: schema-on-write prevents bad data; " +
          "schema-on-read accepts everything and lets the reader decide " +
          "what is valid. **Schema migrations** are how schemas evolve: " +
          "numbered migration files (001_create_users.sql, " +
          "002_add_email.sql) applied in order, version-controlled, and " +
          "reproducible across environments."
      },

      miss: [
        {
          w: "Schema-less databases have no schema.",
          r: "They have no **enforced** schema. The data still has " +
            "structure — it is just the application's responsibility to " +
            "maintain it. The schema is implicit, not absent."
        },
        {
          w: "Application validation is enough.",
          r: "Application bugs bypass validation. Database constraints are " +
            "the last line of defence and cannot be bypassed by code errors."
        },
        {
          w: "Schema changes are dangerous and should be minimised.",
          r: "Schema changes are **necessary** as applications evolve. The " +
            "goal is to make them safe (via migration tools), not to avoid " +
            "them."
        },
        {
          w: "Constraints slow down writes.",
          r: "The overhead is an index lookup per constraint. For most " +
            "workloads, this is negligible. The cost of **not** having " +
            "constraints is corrupt data."
        }
      ],

      trade: {
        buys: [
          "Data validation enforced at the database level.",
          "Self-documenting structure — the schema IS the documentation.",
          "Constraints prevent entire classes of data corruption.",
          "Migrations make schema changes reproducible and auditable.",
          "Tools can generate code and documentation from the schema."
        ],
        costs: [
          "Schema must be defined before writing data.",
          "Schema changes require migrations and deployment coordination.",
          "Rigid schema makes exploratory data loading harder.",
          "Different databases have different type systems.",
          "Schema drift between environments is a common operational problem."
        ],
        avoid: [
          "When data structure is genuinely unknown upfront (early exploration).",
          "Data lake ingestion — validate on read, not on write.",
          "When schema flexibility is more important than data integrity (rare)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "database-migration",

      why: {
        before: "Schema changes were applied manually — a DBA ran ALTER " +
          "TABLE in production, with no record of what was changed or how " +
          "to replicate it in staging.",
        problem: "Manual schema changes are unrepeatable, unauditable, and " +
          "un-reversible. Staging and production drift out of sync. Nobody " +
          "knows what the schema looked like last month.",
        shift: "**Version-control schema changes as numbered migration " +
          "files.** Each migration is a script (SQL or code) that modifies " +
          "the schema. A migration tool applies them in order and tracks " +
          "which have been applied. The schema history is in version " +
          "control, and any environment can be brought to any version."
      },

      num: {
        t: "Migration tools by ecosystem",
        h: ["Tool", "Language", "Approach"],
        r: [
          ["**Flyway**", "**Java / any**", "**SQL files, version-numbered**"],
          ["**Alembic**", "**Python (SQLAlchemy)**", "**Python scripts, auto-generated from models**"],
          ["**Prisma Migrate**", "**TypeScript/JS**", "**declarative schema, auto-generated SQL**"],
          ["Knex", "JavaScript", "code-based migrations"],
          ["**Rails Migrations**", "**Ruby**", "**Ruby DSL, reversible**"],
          ["Liquibase", "Java / any", "XML/YAML/SQL, database-agnostic"],
          ["**Django Migrations**", "**Python**", "**auto-generated from model changes**"]
        ],
        n: "The **expand-and-contract** pattern is the safe way to make " +
          "breaking schema changes in a running system: (1) add the new " +
          "column, (2) deploy code that writes to both old and new, (3) " +
          "backfill existing data, (4) deploy code that reads from new, " +
          "(5) drop the old column. This multi-migration process avoids " +
          "downtime but requires careful sequencing. **Irreversible " +
          "migrations** (DROP COLUMN, DROP TABLE) should be flagged " +
          "clearly — a down migration cannot restore dropped data without " +
          "a backup. The migration table (usually `schema_migrations` or " +
          "`flyway_schema_history`) tracks which migrations have been " +
          "applied. Running out of order or skipping a migration corrupts " +
          "the schema."
      },

      miss: [
        {
          w: "Migrations can be applied in any order.",
          r: "Migrations must be applied **sequentially**. Each depends on " +
            "the schema state left by the previous one."
        },
        {
          w: "Down migrations can undo anything.",
          r: "DROP COLUMN deletes data. No down migration can restore it " +
            "without a backup. Irreversible changes should be clearly " +
            "documented."
        },
        {
          w: "Auto-generated migrations are always correct.",
          r: "Tools detect column adds/removes but may not generate correct " +
            "data migrations. Always review generated migrations."
        },
        {
          w: "Migrations are a development concern only.",
          r: "Migrations run in production. A slow migration on a large " +
            "table can lock it for minutes. Test migrations against " +
            "production-sized data."
        }
      ],

      trade: {
        buys: [
          "Schema changes are version-controlled and auditable.",
          "Any environment can be brought to any schema version.",
          "Team coordination — everyone applies the same changes.",
          "Reversibility (for non-destructive changes).",
          "CI/CD can run migrations automatically on deploy."
        ],
        costs: [
          "Migration files accumulate over time.",
          "Irreversible migrations require careful planning.",
          "Large table migrations can be slow and lock tables.",
          "Merge conflicts in migration numbering.",
          "Different tools have different conventions and limitations."
        ],
        avoid: [
          "Manual DDL in production — always use migration tooling.",
          "Modifying existing migration files after they have been applied.",
          "Running migrations without testing on production-sized data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "constraint",

      why: {
        before: "Data validity was enforced only in application code. Every " +
          "application that wrote to the database had to independently " +
          "validate every rule.",
        problem: "Application bugs bypass validation. A direct SQL insert " +
          "bypasses the application entirely. Without database-level " +
          "enforcement, invalid data is inevitable.",
        shift: "**Enforce data rules at the database level.** Constraints — " +
          "NOT NULL, UNIQUE, CHECK, FOREIGN KEY, PRIMARY KEY — are rules " +
          "the database checks on every write. They cannot be bypassed by " +
          "application bugs, direct SQL, or import scripts."
      },

      num: {
        t: "Constraint types and what each prevents",
        h: ["Constraint", "Rule", "Prevents"],
        r: [
          ["**NOT NULL**", "**column must have a value**", "**missing required data**"],
          ["**UNIQUE**", "**no duplicate values**", "**duplicate emails, usernames**"],
          ["**PRIMARY KEY**", "**NOT NULL + UNIQUE**", "**duplicate rows, missing identifier**"],
          ["**FOREIGN KEY**", "**value must exist in parent table**", "**orphaned references**"],
          ["**CHECK**", "**custom expression must be true**", "**negative ages, invalid status values**"],
          ["EXCLUDE", "no overlapping ranges (Postgres)", "double-booking time slots"]
        ],
        n: "Constraints are **the most underused database feature**. Many " +
          "teams rely entirely on application validation, which means a " +
          "single bug or a direct SQL statement can insert invalid data " +
          "that corrupts downstream processes. The cost of constraints is " +
          "minimal — an index lookup per write for UNIQUE and FK — and " +
          "the benefit is absolute: the database **guarantees** the rule. " +
          "**CHECK constraints** are especially underused: `CHECK (status " +
          "IN ('active', 'suspended', 'deleted'))` prevents invalid status " +
          "values at the database level, making the column effectively an " +
          "enum. PostgreSQL's **EXCLUDE constraint** is unique to Postgres " +
          "and prevents overlapping ranges — perfect for booking systems " +
          "where two events cannot overlap in time."
      },

      miss: [
        {
          w: "Application validation makes constraints redundant.",
          r: "Application bugs bypass validation. Constraints are the " +
            "**last line of defence** — they complement application " +
            "validation, not replace it."
        },
        {
          w: "Constraints are only for production.",
          r: "Use them in development and testing too. Catching constraint " +
            "violations early is cheaper than fixing corrupt production data."
        },
        {
          w: "Too many constraints slow writes.",
          r: "Individual constraint checks are fast (index lookups). The " +
            "aggregate cost is measurable only at very high write rates."
        },
        {
          w: "Constraints are hard to change.",
          r: "Adding or dropping constraints is standard DDL. Migration " +
            "tools handle it routinely."
        }
      ],

      trade: {
        buys: [
          "Data integrity enforced at the database level.",
          "Cannot be bypassed by application bugs or direct SQL.",
          "Self-documenting — the schema declares the rules.",
          "CHECK constraints act as column-level enums.",
          "EXCLUDE constraints prevent overlapping ranges (Postgres)."
        ],
        costs: [
          "Write overhead for constraint checking.",
          "Constraint violations require error handling in the application.",
          "Schema changes to constraints require migration.",
          "Complex CHECK expressions can be hard to debug.",
          "Deferred constraints add transaction complexity."
        ],
        avoid: [
          "Do not avoid constraints — they are the cheapest data integrity " +
            "guarantee available. Supplement with application validation, " +
            "do not replace."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "aggregate-function",

      why: {
        before: "Summarising data meant reading every row into the " +
          "application and computing totals, averages, and counts in code.",
        problem: "Pulling millions of rows to the application to compute " +
          "an average is wasteful. The database has the data — let it do " +
          "the maths.",
        shift: "**Compute summaries inside the database.** Aggregate " +
          "functions — COUNT, SUM, AVG, MIN, MAX — collapse multiple rows " +
          "into a single result. Combined with GROUP BY, they produce " +
          "summaries by category in a single query."
      },

      num: {
        t: "Common aggregate functions and their NULL behaviour",
        h: ["Function", "Returns", "NULL handling"],
        r: [
          ["**COUNT(*)**", "**number of rows**", "**counts all rows including NULL**"],
          ["**COUNT(col)**", "**non-NULL values in col**", "**ignores NULL**"],
          ["**SUM(col)**", "**sum of values**", "**ignores NULL; returns NULL if all NULL**"],
          ["**AVG(col)**", "**average of values**", "**ignores NULL rows**"],
          ["MIN(col)", "smallest value", "ignores NULL"],
          ["MAX(col)", "largest value", "ignores NULL"],
          ["STRING_AGG / GROUP_CONCAT", "concatenate values", "ignores NULL"]
        ],
        n: "The **COUNT(*) vs COUNT(column)** distinction is the most " +
          "common aggregate mistake. `COUNT(*)` counts rows — it does not " +
          "look at column values. `COUNT(email)` counts rows where `email` " +
          "is not NULL. On a table with nullable emails, these give " +
          "different results. **GROUP BY** partitions rows into groups, " +
          "and the aggregate function runs once per group. Without " +
          "GROUP BY, the aggregate runs over the entire result set. " +
          "**HAVING** filters groups after aggregation (WHERE filters rows " +
          "before). The distinction is: WHERE operates on individual rows, " +
          "HAVING operates on groups. A classic interview question: 'find " +
          "customers with more than 5 orders' requires `GROUP BY " +
          "customer_id HAVING COUNT(*) > 5` — WHERE cannot reference " +
          "aggregates."
      },

      miss: [
        {
          w: "COUNT(*) and COUNT(column) are the same.",
          r: "COUNT(*) counts rows. COUNT(column) counts non-NULL values in " +
            "that column. They differ when the column has NULLs."
        },
        {
          w: "AVG counts NULL values as zero.",
          r: "AVG **ignores** NULL values entirely. `AVG(10, NULL, 30)` is " +
            "20 (average of 10 and 30), not 13.3 (average of 10, 0, 30)."
        },
        {
          w: "You can use aggregates in WHERE.",
          r: "WHERE runs before GROUP BY, so aggregates are not available. " +
            "Use HAVING to filter on aggregate results."
        },
        {
          w: "GROUP BY requires listing all non-aggregated columns.",
          r: "This is correct and intentional. Every column in SELECT that " +
            "is not inside an aggregate must be in GROUP BY — otherwise " +
            "the database cannot know which value to show for the group."
        }
      ],

      trade: {
        buys: [
          "Summary computation happens where the data lives — no row transfer.",
          "GROUP BY produces category-level summaries in one query.",
          "HAVING filters groups after aggregation.",
          "Composable with JOINs, CTEs, and window functions.",
          "Database optimiser can use indexes for MIN/MAX."
        ],
        costs: [
          "NULL handling is unintuitive and must be learned.",
          "GROUP BY requires listing all non-aggregated columns.",
          "Complex aggregations can be hard to express in SQL.",
          "Large GROUP BY queries may require temporary tables.",
          "Aggregates hide individual row details."
        ],
        avoid: [
          "When you need individual row details — use window functions instead.",
          "When NULL behaviour would produce misleading results — use COALESCE."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "group-by",

      why: {
        before: "Aggregate functions (SUM, COUNT, AVG) ran over the entire " +
          "result set, producing a single number for the whole table.",
        problem: "You rarely want the total across everything. You want " +
          "totals **per category**: sales per region, orders per customer, " +
          "count per status.",
        shift: "**Partition rows into groups and aggregate within each.** " +
          "GROUP BY groups rows by one or more columns, then aggregate " +
          "functions compute a result for each group separately."
      },

      num: {
        t: "GROUP BY execution flow",
        h: ["Step", "What happens", "Example"],
        r: [
          ["1. FROM", "read rows", "all orders"],
          ["2. WHERE", "filter rows", "WHERE year = 2024"],
          ["**3. GROUP BY**", "**partition into groups**", "**GROUP BY region**"],
          ["**4. Aggregate**", "**compute per group**", "**SUM(amount) per region**"],
          ["5. HAVING", "filter groups", "HAVING SUM(amount) > 1000"],
          ["6. SELECT", "output columns", "region, SUM(amount)"],
          ["7. ORDER BY", "sort results", "ORDER BY SUM(amount) DESC"]
        ],
        n: "The critical rule: **every column in SELECT that is not inside " +
          "an aggregate must appear in GROUP BY**. This is not arbitrary — " +
          "if you GROUP BY region and SELECT city, the database does not " +
          "know which city to show because each region has many cities. " +
          "MySQL historically allowed this (returning an arbitrary city), " +
          "which was a major source of bugs. PostgreSQL and most other " +
          "databases reject it. **ROLLUP** and **CUBE** extend GROUP BY " +
          "for multi-level aggregation: `GROUP BY ROLLUP(year, quarter)` " +
          "produces subtotals per quarter, per year, and a grand total — " +
          "the kind of summary that would otherwise require multiple " +
          "queries or UNION ALL. **GROUPING SETS** is the most flexible: " +
          "it lets you specify exactly which grouping combinations to " +
          "compute."
      },

      miss: [
        {
          w: "You can SELECT any column with GROUP BY.",
          r: "Non-aggregated columns not in GROUP BY produce ambiguous " +
            "results. Most databases reject this; MySQL permits it by " +
            "default (a major footgun)."
        },
        {
          w: "WHERE and HAVING are interchangeable.",
          r: "WHERE filters rows before grouping. HAVING filters groups " +
            "after aggregation. Use WHERE for row conditions and HAVING " +
            "for aggregate conditions."
        },
        {
          w: "GROUP BY is only useful with aggregates.",
          r: "GROUP BY with DISTINCT effectively deduplicates. But more " +
            "importantly, GROUP BY + HAVING is the only way to filter on " +
            "aggregate results."
        },
        {
          w: "You cannot group by expressions.",
          r: "GROUP BY can use expressions, functions, and even CASE " +
            "statements. `GROUP BY DATE_TRUNC('month', created_at)` " +
            "groups by month."
        }
      ],

      trade: {
        buys: [
          "Per-category aggregation in a single query.",
          "ROLLUP and CUBE produce multi-level summaries.",
          "HAVING filters on aggregate results.",
          "Composable with JOINs and subqueries.",
          "Indexed GROUP BY is fast (sorted index skip)."
        ],
        costs: [
          "Non-aggregated columns must be in GROUP BY.",
          "Large GROUP BY operations require memory/temp space.",
          "Complex grouping combinations are verbose without GROUPING SETS.",
          "Performance depends on whether an index supports the grouping.",
          "MySQL's lenient mode hides grouping bugs."
        ],
        avoid: [
          "When you need individual row details alongside aggregates — use " +
            "window functions.",
          "When the grouping expression is not indexed and the table is large."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "null",

      why: {
        before: "Missing data was represented by special values — 0 for " +
          "missing numbers, empty string for missing text, a sentinel date " +
          "for missing dates.",
        problem: "Special values are ambiguous. Is the salary 0 because " +
          "it is unknown, or because the person is an unpaid intern? Is " +
          "the empty string a missing name or a valid empty input?",
        shift: "**NULL means the value is absent — it is not zero, not " +
          "empty, not false.** NULL is a marker that says 'this value is " +
          "unknown.' It has special semantics: NULL = NULL is not TRUE " +
          "(it is UNKNOWN), NULL in arithmetic produces NULL, and " +
          "aggregate functions skip NULL."
      },

      num: {
        t: "NULL surprises",
        h: ["Expression", "Result", "Why"],
        r: [
          ["**NULL = NULL**", "**UNKNOWN (not TRUE)**", "**two unknown values are not equal**"],
          ["**NULL <> 1**", "**UNKNOWN (not TRUE)**", "**cannot compare unknown**"],
          ["NULL + 5", "NULL", "any arithmetic with NULL produces NULL"],
          ["**COUNT(*) vs COUNT(col)**", "**different when col has NULLs**", "**COUNT(col) skips NULL**"],
          ["**WHERE col = NULL**", "**returns zero rows (wrong)**", "**use IS NULL, not = NULL**"],
          ["GROUP BY", "groups NULLs together", "NULL = NULL is unknown, but grouping treats them as same"],
          ["**COALESCE(a, b)**", "**first non-NULL value**", "**the fix for most NULL problems**"]
        ],
        n: "NULL follows **three-valued logic** (TRUE, FALSE, UNKNOWN) " +
          "instead of the two-valued logic (TRUE, FALSE) that " +
          "programmers expect. Any comparison with NULL produces UNKNOWN, " +
          "and UNKNOWN in a WHERE clause is treated as FALSE — which is " +
          "why `WHERE col = NULL` returns no rows even when NULL values " +
          "exist. Use `IS NULL` and `IS NOT NULL`. **COALESCE** is the " +
          "workhorse function for handling NULLs: `COALESCE(col, 0)` " +
          "returns the column value if non-NULL, or 0 otherwise. The " +
          "deeper question is whether to use NULL at all. Many experienced " +
          "database designers prefer NOT NULL constraints with explicit " +
          "default values: instead of a NULL `deleted_at`, use a boolean " +
          "`is_deleted`. This avoids the three-valued logic entirely. " +
          "But for truly optional data (middle name, phone number), NULL " +
          "is the correct representation."
      },

      miss: [
        {
          w: "NULL = NULL is TRUE.",
          r: "It is **UNKNOWN**. Two unknowns are not equal — they are " +
            "unknown. Use `IS NULL` for NULL checks, never `= NULL`."
        },
        {
          w: "NULL and empty string are the same.",
          r: "In most databases, they are distinct. Oracle is the exception " +
            "— it treats empty string as NULL, which has caused decades of " +
            "bugs."
        },
        {
          w: "Aggregates treat NULL as 0.",
          r: "SUM, AVG, MIN, MAX **skip** NULL values entirely. SUM of " +
            "(10, NULL, 30) is 40, not 40. AVG is 20 (average of 10 and " +
            "30), not 13.3."
        },
        {
          w: "NOT IN handles NULL correctly.",
          r: "`WHERE x NOT IN (1, 2, NULL)` returns **zero rows** because " +
            "x <> NULL is UNKNOWN, and UNKNOWN in a NOT IN makes the whole " +
            "condition UNKNOWN. Use NOT EXISTS instead."
        }
      ],

      trade: {
        buys: [
          "Explicitly represents missing/unknown data.",
          "Distinguishes 'no value' from 'zero' or 'empty'.",
          "Aggregate functions handle it consistently (skip).",
          "COALESCE provides clean fallback handling.",
          "IS NULL / IS NOT NULL are clear and indexable."
        ],
        costs: [
          "Three-valued logic surprises most programmers.",
          "NULL propagation in arithmetic and comparison.",
          "NOT IN with NULL produces unexpected empty results.",
          "Nullable columns complicate application code.",
          "Indexing NULL values varies by database."
        ],
        avoid: [
          "When a meaningful default exists — use NOT NULL with DEFAULT.",
          "For boolean columns — use FALSE instead of NULL.",
          "When NULL semantics would confuse the team — prefer explicit " +
            "status values."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "nosql",

      why: {
        before: "Relational databases handled everything — web apps, " +
          "analytics, caching, session storage, logging. The same ACID " +
          "model for every use case.",
        problem: "At web scale, ACID across a single relational database " +
          "hits limits: writes cannot be distributed without complex " +
          "sharding, schema changes require migrations on billion-row " +
          "tables, and joins across shards are expensive.",
        shift: "**Use the right database for the access pattern.** NoSQL " +
          "is not one thing — it is a family of database architectures " +
          "(document, key-value, wide-column, graph, time-series) that " +
          "trade relational flexibility for performance at a specific " +
          "access pattern."
      },

      num: {
        t: "NoSQL families and their strengths",
        h: ["Family", "Model", "Best for"],
        r: [
          ["**Document**", "**JSON/BSON objects (MongoDB)**", "**flexible schema, nested data**"],
          ["**Key-Value**", "**key → blob (Redis, DynamoDB)**", "**caching, sessions, config**"],
          ["**Wide-Column**", "**rows with dynamic columns (Cassandra)**", "**time-series, IoT, high write throughput**"],
          ["**Graph**", "**nodes + edges (Neo4j)**", "**relationships, social graphs, fraud detection**"],
          ["**Time-Series**", "**timestamp + value (InfluxDB)**", "**metrics, monitoring, IoT**"],
          ["**Vector**", "**embeddings (Pinecone, Milvus)**", "**similarity search, RAG**"]
        ],
        n: "The CAP theorem constrains distributed databases: you can have " +
          "**Consistency, Availability, and Partition tolerance** — pick " +
          "two. Relational databases (PostgreSQL, MySQL) choose CP — " +
          "consistent but a network partition can make them unavailable. " +
          "Many NoSQL databases (Cassandra, DynamoDB) choose AP — available " +
          "under partition but eventually consistent. This trade-off is " +
          "the fundamental reason NoSQL exists: when **availability and " +
          "write scalability** matter more than strong consistency, a " +
          "relational database is the wrong tool. But the **majority of " +
          "applications** do not need web-scale write throughput and " +
          "benefit enormously from SQL's ad-hoc query capability, " +
          "transactions, and joins. The irony is that most NoSQL databases " +
          "have added SQL-like query languages, and most relational " +
          "databases have added JSON/document support."
      },

      miss: [
        {
          w: "NoSQL is faster than SQL.",
          r: "NoSQL is faster **at specific access patterns** it was " +
            "designed for. For ad-hoc queries, joins, and complex " +
            "aggregations, SQL databases are faster because they have " +
            "query optimisers."
        },
        {
          w: "NoSQL means no schema.",
          r: "It means no **enforced** schema. The data still has structure " +
            "— it is just the application's responsibility. This is " +
            "schema-on-read, not schema-less."
        },
        {
          w: "NoSQL scales automatically.",
          r: "Horizontal scaling still requires choosing partition keys, " +
            "handling hot partitions, and managing replication. It is " +
            "easier than sharding a relational database, but not automatic."
        },
        {
          w: "NoSQL replaces relational databases.",
          r: "Most production systems use both — PostgreSQL for " +
            "transactional data, Redis for caching, Elasticsearch for " +
            "search. The question is which database for which access " +
            "pattern."
        }
      ],

      trade: {
        buys: [
          "Horizontal write scaling without complex sharding.",
          "Flexible schema — evolve without migrations.",
          "Optimised for specific access patterns (key-value, graph, time-series).",
          "High availability under network partitions (AP systems).",
          "Natural fit for denormalised, nested data."
        ],
        costs: [
          "No ad-hoc queries — access patterns must be designed upfront.",
          "No joins — denormalisation and application-level joins.",
          "Eventual consistency introduces read-after-write issues.",
          "No transactions (or limited to single-partition).",
          "Vendor-specific query languages (though converging to SQL)."
        ],
        avoid: [
          "When the access pattern requires ad-hoc queries and joins.",
          "When strong transactional consistency is required.",
          "When the dataset fits on a single server (most applications).",
          "When the team is experienced with SQL and the workload fits."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "document-database",

      why: {
        before: "All data was stored in normalised tables. A user's profile, " +
          "preferences, and addresses were split across multiple tables " +
          "and reassembled with joins.",
        problem: "Some data is naturally hierarchical — a user with nested " +
          "addresses, preferences, and orders. Normalising it creates many " +
          "tables and many joins for a single logical entity.",
        shift: "**Store the whole entity as a single document.** A document " +
          "database (MongoDB, Couchbase, Firestore) stores JSON-like " +
          "objects. The entire user — with nested addresses, preferences, " +
          "and recent orders — is one document, fetched in one read."
      },

      num: {
        t: "Document database characteristics",
        h: ["Aspect", "Document DB", "Relational"],
        r: [
          ["**Storage unit**", "**JSON document**", "**row in a table**"],
          ["**Schema**", "**flexible, per-document**", "**fixed, per-table**"],
          ["Nesting", "natural — nested objects/arrays", "requires joins"],
          ["**Query**", "**by field, nested path, or index**", "**SQL with joins**"],
          ["**Joins**", "**not native (embed or application-level)**", "**native and optimised**"],
          ["Scaling", "horizontal sharding by document ID", "vertical or complex sharding"]
        ],
        n: "The core design decision in a document database is **embed vs " +
          "reference**. Embed the related data if it is always fetched " +
          "together (user's addresses inside the user document). Reference " +
          "it (store an ID) if it is accessed independently or shared " +
          "across documents. Embedding eliminates joins but creates " +
          "**data duplication** — if a product name changes, every order " +
          "document that embedded it must be updated. MongoDB's " +
          "**aggregation pipeline** provides the equivalent of SQL " +
          "GROUP BY, JOIN ($lookup), and window functions, but the syntax " +
          "is more complex and the optimiser is less mature than SQL " +
          "engines. Document databases shine for **content management " +
          "systems, user profiles, catalogs**, and any domain where the " +
          "data is naturally document-shaped. They struggle with " +
          "**cross-document transactions** and **ad-hoc analytical " +
          "queries** across many documents."
      },

      miss: [
        {
          w: "Document databases have no schema.",
          r: "Documents have structure — the schema is just not enforced by " +
            "default. MongoDB supports **JSON Schema validation** to " +
            "enforce document structure."
        },
        {
          w: "Embedding everything in one document is best.",
          r: "Documents have size limits (16 MB in MongoDB). Deeply nested " +
            "arrays grow without bound. Reference data that grows " +
            "independently."
        },
        {
          w: "Document databases cannot do joins.",
          r: "MongoDB's $lookup performs left outer joins. But they are " +
            "**expensive** compared to relational joins because they lack " +
            "a mature join optimiser."
        },
        {
          w: "Document databases are always the right choice for JSON data.",
          r: "PostgreSQL has JSONB with indexes and operators that rival " +
            "MongoDB's query capabilities — you can store JSON in a " +
            "relational database."
        }
      ],

      trade: {
        buys: [
          "Naturally maps to hierarchical data — no ORM impedance mismatch.",
          "Flexible schema — different documents can have different fields.",
          "Single-document reads are fast — no joins needed.",
          "Horizontal scaling by document ID.",
          "Schema evolution is simpler than relational migrations."
        ],
        costs: [
          "No native joins — denormalisation leads to data duplication.",
          "Cross-document transactions are limited or expensive.",
          "No referential integrity enforcement.",
          "Embedded data duplication requires application-level consistency.",
          "Ad-hoc queries across documents are less flexible than SQL."
        ],
        avoid: [
          "When data is naturally relational with many-to-many relationships.",
          "When strong transactional consistency across documents is required.",
          "When ad-hoc analytical queries are a primary use case.",
          "When PostgreSQL's JSONB provides sufficient document support."
        ]
      }
    }

  ]);
})(window.TD);
