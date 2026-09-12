/* ==========================================================================
   Depth pass 54 — databases batch 2: keys, joins, and query mechanics.

   Foreign keys enforce relationships. Joins reassemble normalised data.
   Together they are the mechanism that makes the relational model work —
   and the source of most SQL performance problems.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "foreign-key",

      why: {
        before: "Tables referenced each other by convention — an `order` row " +
          "had a `user_id` column, but nothing prevented that value from " +
          "pointing to a non-existent user.",
        problem: "Without enforcement, references break: you delete a user " +
          "and orphan all their orders. The data is structurally corrupt " +
          "but the database does not complain.",
        shift: "**Let the database enforce relationships.** A foreign key " +
          "constraint says this column must match an existing primary key " +
          "in another table. INSERT a non-existent reference → rejected. " +
          "DELETE the referenced row → rejected (or cascaded)."
      },

      num: {
        t: "Foreign key actions on delete/update",
        h: ["Action", "What happens", "When to use"],
        r: [
          ["**RESTRICT / NO ACTION**", "**block the delete/update**", "**default — safest**"],
          ["**CASCADE**", "**delete/update all referencing rows**", "**parent owns the children (orders → order_items)**"],
          ["SET NULL", "set FK column to NULL", "optional relationship"],
          ["SET DEFAULT", "set FK to default value", "rare"],
          ["**No FK (application-enforced)**", "**nothing — application checks**", "**high write throughput, eventual cleanup**"]
        ],
        n: "Foreign keys are both a **correctness mechanism** and a " +
          "**performance factor**. Every INSERT or UPDATE to a child table " +
          "requires the database to verify the parent row exists — this is " +
          "an index lookup on the parent's primary key. On high-write " +
          "tables, this check adds latency. Every DELETE from the parent " +
          "must check if children exist. This is why some high-throughput " +
          "systems **drop foreign keys** and enforce referential integrity " +
          "in the application layer — but this trades database-level " +
          "guarantees for speed and risks orphaned data. The recommended " +
          "approach is: **use foreign keys by default** and remove them " +
          "only for measured, specific performance bottlenecks. CASCADE " +
          "DELETE is powerful but dangerous: deleting a user cascades to " +
          "orders, which cascade to order items, which cascade to shipments " +
          "— one DELETE can remove thousands of rows across tables."
      },

      miss: [
        {
          w: "Foreign keys are optional best practices.",
          r: "Without them, orphaned references accumulate silently. They " +
            "are not optional — they are the enforcement mechanism for the " +
            "relational model."
        },
        {
          w: "CASCADE DELETE is always safe.",
          r: "It can trigger a **cascade of cascades**, deleting far more " +
            "rows than intended. Always trace the full cascade path before " +
            "using it."
        },
        {
          w: "Foreign keys slow everything down.",
          r: "They add an index lookup per write to the child table. For " +
            "most workloads, this overhead is negligible. The cost is " +
            "measurable only at very high write rates."
        },
        {
          w: "Application-level enforcement is equivalent.",
          r: "It is not atomic with the database operation. A crash between " +
            "the check and the write can still create orphans. Foreign keys " +
            "are checked within the same transaction."
        }
      ],

      trade: {
        buys: [
          "Database-enforced referential integrity — no orphaned references.",
          "CASCADE simplifies multi-table cleanup.",
          "Self-documenting schema — relationships are in the DDL.",
          "Enables JOIN without ambiguity.",
          "Prevents data corruption from application bugs."
        ],
        costs: [
          "Write overhead — parent existence check on every child write.",
          "CASCADE can delete more than intended.",
          "Schema changes require foreign key updates.",
          "Cross-database foreign keys are not possible.",
          "Circular references require careful handling."
        ],
        avoid: [
          "Cross-database or cross-service references — enforce in the application.",
          "When measured write throughput requires removing the FK check.",
          "Temporary staging tables where data integrity is checked later."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "composite-key",

      why: {
        before: "Every table had a single-column primary key — usually an " +
          "auto-incrementing integer.",
        problem: "Some entities are naturally identified by a **combination** " +
          "of values. A student's enrollment in a course is identified by " +
          "`(student_id, course_id)` — adding a surrogate ID is redundant.",
        shift: "**Use multiple columns together as the key.** A composite " +
          "key is a primary (or unique) key spanning two or more columns. " +
          "The combination must be unique; individual columns need not be."
      },

      num: {
        t: "Composite key considerations",
        h: ["Aspect", "Composite key", "Surrogate key"],
        r: [
          ["**Uniqueness**", "**natural combination is unique**", "**generated value is unique**"],
          ["Size", "sum of column sizes", "one integer or UUID"],
          ["**Foreign key**", "**multi-column FK in child tables**", "**single-column FK**"],
          ["Meaning", "carries business semantics", "meaningless"],
          ["**Mutability**", "**risky if business values change**", "**immutable by design**"],
          ["Index size", "wider", "narrower"]
        ],
        n: "Composite keys are appropriate for **junction tables** (many-" +
          "to-many relationships) and entities whose identity is " +
          "inherently multi-valued. The classic example is `enrollment" +
          "(student_id, course_id)` — the combination is the identity. " +
          "Adding an auto-increment `id` column adds a redundant " +
          "identifier. The downsides appear in child tables that must " +
          "reference the composite key: their foreign keys become multi-" +
          "column, which is more verbose and harder to join. Many ORMs " +
          "handle composite keys poorly — ActiveRecord notoriously " +
          "assumes single-column integer PKs. If you are using an ORM, " +
          "check its composite key support before choosing this strategy."
      },

      miss: [
        {
          w: "Every table needs a single-column ID.",
          r: "Junction tables and naturally multi-valued entities are " +
            "better served by composite keys. Adding a surrogate when " +
            "the composite is sufficient adds complexity."
        },
        {
          w: "Composite keys prevent the use of foreign keys.",
          r: "Foreign keys can reference composite keys — the FK must " +
            "include all columns of the composite PK."
        },
        {
          w: "Composite keys are slower than single-column keys.",
          r: "Index width is larger, but composite keys often **are** the " +
            "covering index for common queries, avoiding a separate index."
        },
        {
          w: "ORMs always support composite keys.",
          r: "Many ORMs (Rails ActiveRecord, some older versions of " +
            "Hibernate) handle composite keys poorly. Check support before " +
            "committing."
        }
      ],

      trade: {
        buys: [
          "No redundant surrogate column.",
          "Natural identity matches the domain model.",
          "Composite PK serves as covering index for common queries.",
          "Prevents duplicate entries by construction.",
          "Foreign keys enforce multi-dimensional relationships."
        ],
        costs: [
          "Multi-column foreign keys in child tables.",
          "ORM support may be limited.",
          "Wider indexes consume more space.",
          "If any component changes, all references must update.",
          "Joins require matching multiple columns."
        ],
        avoid: [
          "When the ORM does not support composite keys well.",
          "When the composite is very wide (4+ columns).",
          "When any component column might change."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "join",

      why: {
        before: "Normalised data lives in separate tables. To see a " +
          "customer's orders with product names, you need data from three " +
          "tables — customers, orders, and products.",
        problem: "Without a mechanism to combine tables, you either " +
          "denormalise (duplicating data) or make multiple queries and " +
          "assemble in the application.",
        shift: "**Combine rows from two or more tables based on a related " +
          "column.** JOINs are the core mechanism for reassembling " +
          "normalised data, and understanding which join type to use — " +
          "and how the database executes it — is the core SQL performance " +
          "skill."
      },

      num: {
        t: "Join types and what each returns",
        h: ["Type", "Returns", "Use case"],
        r: [
          ["**INNER JOIN**", "**only matching rows from both tables**", "**most common — get related data**"],
          ["**LEFT JOIN**", "**all left rows + matching right (or NULL)**", "**include items with no match**"],
          ["RIGHT JOIN", "all right rows + matching left", "rarely used — rewrite as LEFT"],
          ["**FULL OUTER JOIN**", "**all rows from both, NULLs where no match**", "**find missing relationships**"],
          ["**CROSS JOIN**", "**every combination (Cartesian product)**", "**generate all pairs — careful with size**"],
          ["SELF JOIN", "join a table to itself", "hierarchies, predecessor/successor"]
        ],
        n: "The optimiser chooses one of three **physical join algorithms** " +
          "based on table sizes, indexes, and statistics: **Nested Loop** " +
          "(for each row in A, scan B — fast with an index on B, " +
          "catastrophic without), **Hash Join** (build a hash table from " +
          "the smaller table, probe with the larger — no index needed, " +
          "needs memory), and **Sort-Merge Join** (sort both tables and " +
          "merge — efficient when both are already sorted, e.g. by index). " +
          "The most common join performance problem is a **nested loop " +
          "without an index**: this is O(n × m) and grinds to a halt on " +
          "large tables. The fix is almost always an **index on the join " +
          "column** of the inner table. Use EXPLAIN to see which algorithm " +
          "the optimiser chose and whether it is using an index."
      },

      miss: [
        {
          w: "JOINs are slow.",
          r: "JOINs are slow **without indexes**. With proper indexes, a " +
            "JOIN is an index lookup per row — fast. The issue is not JOINs " +
            "but missing indexes."
        },
        {
          w: "LEFT JOIN and INNER JOIN give the same results if all rows match.",
          r: "They give the same **data** but the optimiser treats them " +
            "differently. LEFT JOIN prevents certain optimisations. Use " +
            "INNER JOIN when you do not need unmatched rows."
        },
        {
          w: "More JOINs always mean slower queries.",
          r: "Each JOIN adds work, but the optimiser can reorder joins for " +
            "efficiency. Five JOINs with indexes can be faster than one " +
            "JOIN without."
        },
        {
          w: "You should avoid JOINs and denormalise instead.",
          r: "Denormalisation trades write consistency for read speed. " +
            "JOINs are the correct default; denormalise only for measured " +
            "bottlenecks."
        }
      ],

      trade: {
        buys: [
          "Reassemble normalised data without redundancy.",
          "Optimiser chooses the best join algorithm automatically.",
          "Index-backed joins are fast — O(n log m) or O(n).",
          "Self-joins handle hierarchies and temporal queries.",
          "Composable with WHERE, GROUP BY, and window functions."
        ],
        costs: [
          "Without indexes, performance degrades to O(n × m).",
          "Complex multi-join queries are hard to debug.",
          "CROSS JOIN can produce astronomically large result sets.",
          "Join order matters for performance (optimiser usually handles it).",
          "Implicit joins (comma syntax) are harder to read than explicit JOIN."
        ],
        avoid: [
          "CROSS JOIN on large tables without a WHERE — produces n × m rows.",
          "Joining on non-indexed columns in large tables.",
          "When the query pattern is always a single-key lookup — a JOIN is unnecessary."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "subquery",

      why: {
        before: "Complex data retrieval required multiple separate queries " +
          "and assembling results in the application.",
        problem: "Some questions are inherently nested: 'find all users " +
          "whose order total exceeds the average order total.' The average " +
          "must be computed before the filter can apply.",
        shift: "**Nest a query inside another query.** A subquery is a " +
          "SELECT inside another SQL statement — in WHERE, FROM, SELECT, " +
          "or HAVING. It allows expressing multi-step logic in a single " +
          "SQL statement."
      },

      num: {
        t: "Subquery types and execution behaviour",
        h: ["Type", "Syntax location", "Execution"],
        r: [
          ["**Scalar**", "**WHERE x = (SELECT ...)**", "**returns one value, runs once**"],
          ["**IN / EXISTS**", "**WHERE x IN (SELECT ...)**", "**returns a set, may optimise to join**"],
          ["**Correlated**", "**references outer query**", "**runs once per outer row — expensive**"],
          ["**Derived table**", "**FROM (SELECT ...) AS t**", "**inline view, materialised or merged**"],
          ["**CTE (WITH)**", "**WITH t AS (SELECT ...)**", "**named, reusable, readable**"],
          ["Lateral", "FROM ... LATERAL (SELECT ...)", "correlated derived table"]
        ],
        n: "**Correlated subqueries** are the performance trap: a correlated " +
          "subquery references a column from the outer query, so the " +
          "database must execute it **once per outer row**. For 100,000 " +
          "outer rows, that is 100,000 subquery executions. The fix is " +
          "usually to rewrite as a **JOIN** or a **window function**. " +
          "Modern optimisers (PostgreSQL, SQL Server) often " +
          "**decorrelate** subqueries automatically — transforming them " +
          "into joins — but not always. **CTEs (Common Table Expressions)** " +
          "are the modern alternative to derived tables: `WITH orders AS " +
          "(SELECT ...)` is easier to read than a subquery in FROM, and in " +
          "PostgreSQL, recursive CTEs enable hierarchical queries (org " +
          "charts, trees) that are impossible with plain subqueries."
      },

      miss: [
        {
          w: "Subqueries and JOINs are equivalent.",
          r: "Logically, many subqueries can be rewritten as JOINs. But " +
            "JOINs can duplicate rows (one-to-many), while EXISTS does not. " +
            "They are semantically different."
        },
        {
          w: "CTEs are always materialised.",
          r: "In PostgreSQL before 12, CTEs were always materialised. Since " +
            "12, they can be inlined. In MySQL, CTEs are inlined by default. " +
            "Check your database version."
        },
        {
          w: "Correlated subqueries should always be avoided.",
          r: "Modern optimisers can decorrelate them. If EXPLAIN shows the " +
            "optimiser transformed it into a join, it is fine. If it shows " +
            "per-row execution, rewrite."
        },
        {
          w: "IN and EXISTS are the same.",
          r: "IN returns true if the value is in the set. EXISTS returns " +
            "true if the subquery returns any rows. For NULL values and " +
            "large sets, they can behave differently."
        }
      ],

      trade: {
        buys: [
          "Express multi-step logic in a single statement.",
          "CTEs improve readability of complex queries.",
          "Recursive CTEs handle hierarchical data.",
          "EXISTS efficiently tests for relationship existence.",
          "Derived tables create reusable inline views."
        ],
        costs: [
          "Correlated subqueries execute per outer row.",
          "Deep nesting makes queries hard to read.",
          "Optimiser may not always decorrelate.",
          "CTE materialisation can be a surprise performance hit.",
          "Debugging nested logic is harder than debugging joins."
        ],
        avoid: [
          "Correlated subqueries on large tables — rewrite as JOIN.",
          "Deep nesting (3+ levels) — use CTEs for clarity.",
          "When a simple JOIN expresses the same logic more clearly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "view",

      why: {
        before: "Complex queries were copied into every application, " +
          "report, and script that needed them. Changing the logic meant " +
          "updating every copy.",
        problem: "Duplicated query logic drifts out of sync. The dashboard " +
          "calculates revenue one way; the API calculates it another. " +
          "Nobody knows which is correct.",
        shift: "**Save a query as a named object.** A view is a stored " +
          "SELECT that behaves like a table. Query it with SELECT, join " +
          "it with other tables. Change the underlying query in one place " +
          "and all consumers see the updated logic."
      },

      num: {
        t: "View types and their characteristics",
        h: ["Type", "What it does", "Trade-off"],
        r: [
          ["**Regular view**", "**stored query, expanded on access**", "**no storage cost, re-executes every time**"],
          ["**Materialised view**", "**stored query + cached result**", "**fast reads, stale until refreshed**"],
          ["Updatable view", "INSERT/UPDATE through the view", "limited — simple views only"],
          ["**Recursive view**", "**references itself (via recursive CTE)**", "**hierarchies, trees**"],
          ["Security view", "exposes subset of columns/rows", "access control without column-level GRANT"]
        ],
        n: "Regular views are **zero cost to create** — they are just " +
          "saved queries. The optimiser expands them inline and optimises " +
          "the combined query. This means a view over a complex query is " +
          "not inherently slower than writing the query directly. " +
          "**Materialised views** pre-compute and store the result, making " +
          "reads fast but requiring explicit `REFRESH`. The staleness " +
          "window between data changes and refresh is the fundamental " +
          "trade-off. PostgreSQL supports `REFRESH MATERIALIZED VIEW " +
          "CONCURRENTLY`, which does not lock reads during refresh. " +
          "Views are also a **security mechanism**: create a view that " +
          "filters sensitive columns (PII, salaries) and grant access to " +
          "the view instead of the base table. This provides column-level " +
          "security without column-level GRANT."
      },

      miss: [
        {
          w: "Views improve query performance.",
          r: "Regular views do not — they are expanded and re-executed. " +
            "**Materialised views** improve read performance by caching " +
            "results, but regular views are about abstraction, not speed."
        },
        {
          w: "Views store data.",
          r: "Regular views store only the **query definition**. No data is " +
            "duplicated. Materialised views store the result set."
        },
        {
          w: "You can always INSERT into a view.",
          r: "Only simple views (one table, no aggregation, no DISTINCT) " +
            "are updatable. Complex views are read-only."
        },
        {
          w: "Materialised views are always up to date.",
          r: "They are snapshots. Data changes in the base table are not " +
            "reflected until REFRESH. Some databases support incremental " +
            "refresh; most require full recomputation."
        }
      ],

      trade: {
        buys: [
          "Single source of truth for complex query logic.",
          "Abstraction layer — hide complex joins from consumers.",
          "Security — expose only the columns/rows users should see.",
          "Materialised views accelerate expensive aggregations.",
          "Simplify application code — query the view like a table."
        ],
        costs: [
          "Regular views re-execute every time — no performance gain.",
          "Materialised views require refresh management.",
          "Deeply nested views are hard to debug and optimise.",
          "Schema changes to base tables can break views.",
          "Updatable views are limited to simple cases."
        ],
        avoid: [
          "Using views as a substitute for proper query optimisation.",
          "Nesting views more than 2 levels deep — it obscures logic.",
          "Materialised views when data freshness is critical and refresh " +
            "latency is unacceptable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "transaction",

      why: {
        before: "Each SQL statement executed independently. There was no " +
          "guarantee that a group of related changes would all succeed or " +
          "all fail.",
        problem: "A bank transfer debits account A and credits account B. " +
          "If a crash occurs between the two, money vanishes. Without " +
          "atomicity, multi-step operations corrupt data.",
        shift: "**Group statements into an all-or-nothing unit.** A " +
          "transaction wraps multiple operations so that either all succeed " +
          "(COMMIT) or all are undone (ROLLBACK). This is the A in ACID " +
          "and the foundation of data integrity."
      },

      num: {
        t: "ACID properties in detail",
        h: ["Property", "What it guarantees", "Mechanism"],
        r: [
          ["**Atomicity**", "**all or nothing**", "**write-ahead log (WAL) + rollback**"],
          ["**Consistency**", "**constraints always hold**", "**constraint checks at commit**"],
          ["**Isolation**", "**concurrent transactions don't interfere**", "**MVCC or locking**"],
          ["**Durability**", "**committed data survives crashes**", "**WAL flushed to disk before COMMIT returns**"]
        ],
        n: "The **write-ahead log (WAL)** is how databases implement " +
          "atomicity and durability: before modifying any data page, the " +
          "change is written to the WAL. If the system crashes, the WAL " +
          "is replayed on restart — committed transactions are reapplied, " +
          "uncommitted transactions are rolled back. **MVCC (Multi-Version " +
          "Concurrency Control)** is how PostgreSQL, MySQL/InnoDB, and " +
          "Oracle implement isolation: each transaction sees a snapshot of " +
          "the data as of its start time, so readers never block writers " +
          "and writers never block readers. The trade-off is dead tuples " +
          "that VACUUM must clean up. **Isolation levels** control how " +
          "much concurrent transactions can see each other's work — from " +
          "READ UNCOMMITTED (see everything, even uncommitted) to " +
          "SERIALIZABLE (behave as if no other transaction exists)."
      },

      miss: [
        {
          w: "ACID means perfect safety.",
          r: "ACID guarantees correctness at the database level. " +
            "Application-level consistency (business rules that span " +
            "multiple services) requires additional patterns — sagas, " +
            "event sourcing, or distributed transactions."
        },
        {
          w: "Every statement is automatically in a transaction.",
          r: "In autocommit mode (the default), each statement is its own " +
            "transaction. Multi-statement operations need explicit BEGIN/" +
            "COMMIT."
        },
        {
          w: "Transactions have no cost.",
          r: "Each transaction holds locks, writes to the WAL, and maintains " +
            "MVCC versions. Long transactions hold resources and degrade " +
            "concurrency."
        },
        {
          w: "SERIALIZABLE is always the safest choice.",
          r: "It is the **most correct** isolation level but causes more " +
            "serialisation failures (the application must retry). READ " +
            "COMMITTED is the default in PostgreSQL and sufficient for most " +
            "workloads."
        }
      ],

      trade: {
        buys: [
          "Atomicity — multi-step operations are all-or-nothing.",
          "Crash recovery via WAL — no corruption.",
          "MVCC — readers and writers do not block each other.",
          "Isolation levels let you choose consistency vs concurrency.",
          "SAVEPOINT enables partial rollback within a transaction."
        ],
        costs: [
          "WAL writes add latency to every commit.",
          "Long transactions hold locks and degrade performance.",
          "MVCC creates dead tuples that need garbage collection.",
          "Higher isolation levels cause more serialisation failures.",
          "Distributed transactions across databases are very expensive."
        ],
        avoid: [
          "Long-running transactions that hold locks for seconds or minutes.",
          "Interactive transactions (wait for user input while a transaction " +
            "is open).",
          "Distributed transactions when eventual consistency is acceptable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "normalisation",

      why: {
        before: "Data was stored in flat files or wide tables with repeated " +
          "information — every order row included the customer's name, " +
          "address, and phone number.",
        problem: "When a customer moves, you update dozens of rows — miss " +
          "one and the data is inconsistent. Same fact stored in multiple " +
          "places means multiple chances to be wrong.",
        shift: "**Store each fact in exactly one place.** Normalisation " +
          "decomposes wide tables into related narrow tables so that data " +
          "is never duplicated. Updates to a fact require changing one row, " +
          "and JOINs reassemble the data when needed."
      },

      num: {
        t: "Normal forms and what each eliminates",
        h: ["Form", "Requirement", "Eliminates"],
        r: [
          ["**1NF**", "**atomic values, no repeating groups**", "**multi-valued fields (comma-separated lists)**"],
          ["**2NF**", "**no partial dependencies**", "**columns that depend on part of a composite key**"],
          ["**3NF**", "**no transitive dependencies**", "**columns that depend on non-key columns**"],
          ["BCNF", "every determinant is a candidate key", "certain 3NF anomalies"],
          ["4NF", "no multi-valued dependencies", "independent multi-valued facts"],
          ["**Practical target**", "**3NF or BCNF for most systems**", "**beyond BCNF is rarely needed**"]
        ],
        n: "The practical rule is **normalise to 3NF by default, " +
          "denormalise for measured performance bottlenecks**. The classic " +
          "test for 3NF: every non-key column must depend on 'the key, " +
          "the whole key, and nothing but the key' (so help me Codd). " +
          "If a column depends on part of the key (partial dependency) or " +
          "on another non-key column (transitive dependency), the table " +
          "should be decomposed. **Denormalisation** is the deliberate " +
          "reversal: duplicating data to avoid joins. It improves read " +
          "performance at the cost of write complexity (every update must " +
          "touch every copy). Data warehouses commonly denormalise into " +
          "**star schemas** because analytical queries aggregate millions " +
          "of rows and joins are expensive at that scale. OLTP systems " +
          "should stay normalised because their primary concern is " +
          "transactional consistency, not aggregation speed."
      },

      miss: [
        {
          w: "More normalisation is always better.",
          r: "Over-normalisation creates excessive joins. A one-to-one " +
            "relationship that is always fetched together is better stored " +
            "in one table."
        },
        {
          w: "Denormalisation is bad practice.",
          r: "It is a **deliberate trade-off**: faster reads in exchange " +
            "for more complex writes. Data warehouses denormalise by " +
            "design. The issue is **unintentional** duplication."
        },
        {
          w: "Normal forms beyond 3NF matter for most applications.",
          r: "4NF and 5NF address rare edge cases. Virtually all real-world " +
            "databases are designed to 3NF or BCNF."
        },
        {
          w: "Normalisation is a one-time design decision.",
          r: "Schema evolves. New features may require decomposing tables " +
            "(normalising) or combining them (denormalising). It is an " +
            "ongoing process."
        }
      ],

      trade: {
        buys: [
          "Each fact stored once — no inconsistency from duplicate data.",
          "Updates are simple — change one row.",
          "Smaller tables use less storage.",
          "Schema is flexible — new queries do not require restructuring.",
          "Constraints enforce relationships between tables."
        ],
        costs: [
          "JOINs are required to reassemble data — more query complexity.",
          "Read performance may suffer on heavily joined queries.",
          "More tables to manage.",
          "ORM mapping becomes more complex.",
          "Analytical queries over many joins are slow at scale."
        ],
        avoid: [
          "Data warehouses — use star schemas (denormalised by design).",
          "Read-heavy workloads with stable data — denormalisation may help.",
          "When the join overhead is a measured, specific bottleneck."
        ]
      }
    }

  ]);
})(window.TD);
