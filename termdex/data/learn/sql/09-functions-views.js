/* SQL — functions, views and practical tools. */
TD.addLessons("sql", [

    {
        t: "String, Date and Conversion Functions",
        m: "functions",
        lvl: "intermediate",
        s: "The built-in toolkit that cleans, reshapes and converts data inside the query itself.",
        goal: [
            "Clean messy text with TRIM, UPPER, LOWER, REPLACE and SUBSTRING",
            "Do date arithmetic and extract parts of a date",
            "Cast between types without losing data"
        ],
        b: [
            { p: "Most data arrives dirty. Names are padded with spaces, dates are in three different formats, numbers are stored as text, and someone typed `new york`, `New York` and `NEW YORK` in the same column. You could clean all of that in Python — pull the data out, fix it, push it back — but the database can do it in the query, and doing it there means the clean version never leaves the server." },

            { h: "String functions" },
            {
                code: {
                    lang: "sql", t: "The ones you will use every week",
                    lines: [
                        { c: "SELECT", w: "" },
                        { c: "  UPPER(city)                    AS city_upper,", w: "**Uppercases every character.** For case-insensitive comparison: `WHERE UPPER(city) = 'MUMBAI'`." },
                        { c: "  LOWER(email)                   AS email_lower,", w: "Lowercase — the normalisation you should apply to every email column." },
                        { c: "  TRIM(name)                     AS name_clean,", w: "**Strips leading and trailing whitespace.** The invisible spaces that make joins silently fail." },
                        { c: "  REPLACE(phone, '-', '')        AS phone_digits,", w: "Replaces every occurrence of the second argument with the third." },
                        { c: "  LENGTH(description)            AS desc_len,", w: "Character count. Some databases call it `LEN` (SQL Server) or `CHAR_LENGTH`." },
                        { c: "  SUBSTRING(postcode, 1, 3)      AS area_code,", w: "**Extract a portion.** `SUBSTRING(col, start, length)` — positions are 1-based, not 0-based like Python." },
                        { c: "  CONCAT(first_name, ' ', last_name) AS full_name", w: "Joins strings. PostgreSQL also supports `||`: `first_name || ' ' || last_name`." },
                        { c: "FROM customers;" }
                    ]
                }
            },

            { trap: "`TRIM` only strips spaces by default. To strip other characters — tabs, newlines, zero-width spaces — most dialects support `TRIM(BOTH '\\t' FROM col)` or you chain `REPLACE`. Invisible characters in data are the cause of more debugging hours than most bugs." },

            {
                code: {
                    lang: "sql", t: "Pattern matching beyond LIKE",
                    lines: [
                        { c: "-- LIKE is limited: % matches any characters, _ matches exactly one", w: "" },
                        { c: "SELECT * FROM products WHERE name LIKE 'Widget%';", w: "" },
                        { c: "", w: "" },
                        { c: "-- PostgreSQL regex: ~ for case-sensitive, ~* for case-insensitive", w: "" },
                        { c: "SELECT * FROM logs WHERE message ~* 'error|fail|timeout';", w: "**Regex match** — more powerful than LIKE, but dialect-specific." },
                        { c: "", w: "" },
                        { c: "-- Standard SQL: SIMILAR TO (mix of LIKE and regex)", w: "" },
                        { c: "SELECT * FROM users WHERE email SIMILAR TO '%@(gmail|yahoo)\\.com';", w: "" }
                    ]
                }
            },

            { h: "Date and time functions" },
            { p: "Every database has date functions, but the syntax varies more than anything else in SQL. These examples use PostgreSQL/standard SQL; the concepts transfer everywhere." },
            {
                code: {
                    lang: "sql", t: "Getting the current date and time",
                    lines: [
                        { c: "SELECT", w: "" },
                        { c: "  CURRENT_DATE           AS today,", w: "**Just the date.** Standard SQL — works everywhere." },
                        { c: "  CURRENT_TIMESTAMP      AS right_now,", w: "Date and time, with timezone." },
                        { c: "  CURRENT_DATE - 7       AS one_week_ago;", w: "**Date arithmetic.** Subtract an integer to go back N days (PostgreSQL). MySQL uses `DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)`." }
                    ]
                }
            },

            {
                code: {
                    lang: "sql", t: "Extracting parts of a date",
                    lines: [
                        { c: "SELECT", w: "" },
                        { c: "  order_date,", w: "" },
                        { c: "  EXTRACT(YEAR  FROM order_date) AS yr,", w: "**The standard function.** Pulls a single component out of a date." },
                        { c: "  EXTRACT(MONTH FROM order_date) AS mo,", w: "" },
                        { c: "  EXTRACT(DOW   FROM order_date) AS weekday,", w: "Day of week — 0 = Sunday in PostgreSQL." },
                        { c: "FROM orders;", w: "" },
                        { c: "", w: "" },
                        { c: "-- Truncate a timestamp to a date, month, or year", w: "" },
                        { c: "SELECT DATE_TRUNC('month', order_date) AS month_start", w: "**Rounds down** to the start of the month. Invaluable for grouping by month." },
                        { c: "FROM orders;" }
                    ]
                }
            },

            {
                code: {
                    lang: "sql", t: "The pattern for monthly aggregation",
                    lines: [
                        { c: "SELECT", w: "" },
                        { c: "  DATE_TRUNC('month', order_date) AS month,", w: "Every order in January collapses to `2026-01-01`." },
                        { c: "  COUNT(*)                        AS orders,", w: "" },
                        { c: "  SUM(amount)                     AS revenue", w: "" },
                        { c: "FROM orders", w: "" },
                        { c: "WHERE order_date >= '2026-01-01'", w: "" },
                        { c: "GROUP BY DATE_TRUNC('month', order_date)", w: "" },
                        { c: "ORDER BY month;", w: "" }
                    ]
                }
            },

            {
                tbl: {
                    t: "Date functions across dialects",
                    h: ["Task", "PostgreSQL", "MySQL", "SQLite"],
                    rows: [
                        ["Current date", "`CURRENT_DATE`", "`CURDATE()`", "`DATE('now')`"],
                        ["Extract year", "`EXTRACT(YEAR FROM d)`", "`YEAR(d)`", "`strftime('%Y', d)`"],
                        ["Add 7 days", "`d + INTERVAL '7 days'`", "`DATE_ADD(d, INTERVAL 7 DAY)`", "`DATE(d, '+7 days')`"],
                        ["Difference in days", "`d1 - d2`", "`DATEDIFF(d1, d2)`", "`JULIANDAY(d1) - JULIANDAY(d2)`"],
                        ["Truncate to month", "`DATE_TRUNC('month', d)`", "`DATE_FORMAT(d, '%Y-%m-01')`", "`strftime('%Y-%m-01', d)`"]
                    ]
                }
            },
            {
                n: "If you write queries for one database and then move to another, date functions are the first thing that breaks. Bookmark your database's date function reference page. Memorise the concept — extract, truncate, add interval — and look up the spelling.",
                nt: "The dialect wall"
            },

            { h: "Type conversion — CAST and COALESCE" },
            {
                code: {
                    lang: "sql",
                    lines: [
                        { c: "SELECT", w: "" },
                        { c: "  CAST(price_text AS DECIMAL(10,2)) AS price,", w: "**Convert a string to a number.** Fails loudly if the text is not a valid number — which is what you want, because silent corruption is worse." },
                        { c: "  CAST(created_at AS DATE)           AS created_date,", w: "Strip the time from a timestamp." },
                        { c: "  CAST(quantity AS VARCHAR)           AS qty_text,", w: "Number to string — for concatenation." },
                        { c: "FROM orders;", w: "" },
                        { c: "", w: "" },
                        { c: "-- COALESCE: the first non-null value", w: "" },
                        { c: "SELECT COALESCE(nickname, first_name, 'Anonymous') AS display_name", w: "**Tries each argument in order** and returns the first one that is not NULL. The safety net for optional columns." },
                        { c: "FROM users;" }
                    ]
                }
            },

            { h: "Conditional expressions" },
            {
                code: {
                    lang: "sql", t: "CASE — the if/elif/else of SQL",
                    lines: [
                        { c: "SELECT", w: "" },
                        { c: "  amount,", w: "" },
                        { c: "  CASE", w: "" },
                        { c: "    WHEN amount >= 1000 THEN 'high'", w: "" },
                        { c: "    WHEN amount >= 100  THEN 'medium'", w: "" },
                        { c: "    ELSE 'low'", w: "" },
                        { c: "  END AS tier", w: "**Evaluated top to bottom, stops at the first match** — exactly like Python's `if/elif/else`." },
                        { c: "FROM orders;" }
                    ]
                }
            },
            { p: "`CASE` works everywhere other expressions work — in `SELECT`, in `WHERE`, in `ORDER BY`, and inside aggregate functions. `SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END)` counts shipped orders and is a pattern you will write constantly." },

            {
                tryit: {
                    t: "Clean a messy table",
                    task: "You have a `contacts` table with `name` (has trailing spaces), `email` (mixed case), `phone` (has dashes), and `joined_at` (a timestamp). Write a query that returns: trimmed name, lowercased email, phone with dashes removed, the year they joined, and how many days ago they joined.",
                    hint: "`TRIM`, `LOWER`, `REPLACE`, `EXTRACT(YEAR FROM ...)`, and `CURRENT_DATE - CAST(joined_at AS DATE)` for days ago.",
                    sol: { lang: "sql", code: "SELECT\n  TRIM(name)                           AS name,\n  LOWER(email)                         AS email,\n  REPLACE(phone, '-', '')              AS phone,\n  EXTRACT(YEAR FROM joined_at)         AS join_year,\n  CURRENT_DATE - CAST(joined_at AS DATE) AS days_ago\nFROM contacts\nORDER BY days_ago DESC;" },
                    w: "Every one of these functions runs inside the database — no data leaves the server to be cleaned, and the result is ready to display or feed into a report. This is why SQL functions matter: they keep the work where the data is."
                }
            }
        ],
        k: [
            "`TRIM`, `UPPER`, `LOWER`, `REPLACE`, `SUBSTRING` and `CONCAT` handle most text cleaning in-query.",
            "`EXTRACT` pulls parts from a date; `DATE_TRUNC` rounds down to a period — the key to monthly/yearly grouping.",
            "Date function syntax varies wildly between databases — learn the concept, look up the spelling.",
            "`CAST` converts types; `COALESCE` picks the first non-null value; `CASE` adds conditional logic anywhere in a query."
        ],
        r: ["SQL"],
        drill: {
            lang: "sql",
            reps: 3,
            items: [
                { c: "TRIM(name)", w: "strip whitespace from both ends of a string" },
                { c: "LOWER(email)", w: "lowercase an entire column for case-insensitive comparison" },
                { c: "REPLACE(phone, '-', '')", w: "remove all dashes from a phone number" },
                { c: "EXTRACT(YEAR FROM order_date)", w: "pull the year out of a date" },
                { c: "DATE_TRUNC('month', order_date)", w: "round a date down to the start of its month" },
                { c: "CAST(price_text AS DECIMAL(10,2))", w: "convert a text column to a numeric type" }
            ]
        }
    },

    {
        t: "Views — Saving a Query as a Table",
        m: "views",
        lvl: "intermediate",
        s: "Name a query once and use it everywhere — like a function for your database.",
        goal: [
            "Create a view and query it like a table",
            "Explain why views simplify complex queries and control access",
            "Know the difference between a view and a materialised view"
        ],
        b: [
            { p: "You have a query that joins three tables, filters by date, and calculates running totals. It works. Then you need the same data in four different reports. Copy-paste the query four times, and now there are four places to forget to update when the schema changes. A **view** is the fix: name the query once, and every report queries the name." },

            { h: "Creating a view" },
            {
                code: {
                    lang: "sql",
                    lines: [
                        { c: "CREATE VIEW monthly_revenue AS", w: "**`CREATE VIEW name AS`** — the query that follows becomes a reusable table-shaped object." },
                        { c: "SELECT", w: "" },
                        { c: "  DATE_TRUNC('month', order_date) AS month,", w: "" },
                        { c: "  region,", w: "" },
                        { c: "  COUNT(*)      AS orders,", w: "" },
                        { c: "  SUM(amount)   AS revenue", w: "" },
                        { c: "FROM orders", w: "" },
                        { c: "GROUP BY DATE_TRUNC('month', order_date), region;", w: "" }
                    ]
                }
            },

            {
                code: {
                    lang: "sql", t: "Using it — exactly like a table",
                    lines: [
                        { c: "SELECT * FROM monthly_revenue", w: "**A view is queried exactly like a table.** The database runs the underlying query transparently." },
                        { c: "WHERE month >= '2026-01-01'", w: "You can filter, join, aggregate — anything you would do with a table." },
                        { c: "ORDER BY revenue DESC;", w: "" }
                    ]
                }
            },

            { h: "Why views exist" },
            {
                l: [
                    "**Simplification.** A complex join becomes a simple `SELECT *`. Analysts who do not know the schema can query named views.",
                    "**Single source of truth.** The logic lives in one place. Change the view definition, and every query using it gets the update.",
                    "**Security.** A view can expose only certain columns or rows. An analyst can query `employee_directory` (name, department, office) without access to `employees` (which has salary and SSN).",
                    "**Abstraction.** If the underlying tables change — a column is renamed, a table is split — update the view. Downstream queries never notice."
                ]
            },

            { h: "Replacing and dropping" },
            {
                code: {
                    lang: "sql",
                    lines: [
                        { c: "CREATE OR REPLACE VIEW monthly_revenue AS", w: "**Update the definition** without dropping and recreating. Existing permissions are preserved." },
                        { c: "SELECT", w: "" },
                        { c: "  DATE_TRUNC('month', order_date) AS month,", w: "" },
                        { c: "  region,", w: "" },
                        { c: "  COUNT(*)      AS orders,", w: "" },
                        { c: "  SUM(amount)   AS revenue,", w: "" },
                        { c: "  AVG(amount)   AS avg_order", w: "Added a column — queries using `SELECT *` now see it; queries naming columns are unaffected." },
                        { c: "FROM orders", w: "" },
                        { c: "GROUP BY 1, 2;", w: "`GROUP BY 1, 2` refers to the first and second columns in the SELECT — a shortcut." },
                        { c: "", w: "" },
                        { c: "DROP VIEW IF EXISTS monthly_revenue;", w: "**Remove it.** `IF EXISTS` prevents an error if it has already been dropped." }
                    ]
                }
            },

            { h: "Regular views versus materialised views" },
            {
                tbl: {
                    h: ["", "View", "Materialised View"],
                    rows: [
                        ["Stores data?", "**No** — re-runs the query every time", "**Yes** — stores the result on disk"],
                        ["Always current?", "Yes — reflects the live data", "No — shows the snapshot from the last refresh"],
                        ["Fast?", "As fast as the underlying query", "As fast as reading a table (pre-computed)"],
                        ["Refresh needed?", "No", "Yes — `REFRESH MATERIALIZED VIEW name`"],
                        ["Use when", "The query is fast and data freshness matters", "The query is slow and slight staleness is acceptable"]
                    ]
                }
            },

            {
                code: {
                    lang: "sql", t: "A materialised view",
                    lines: [
                        { c: "CREATE MATERIALIZED VIEW dashboard_stats AS", w: "**Runs the query and stores the result** as a physical table." },
                        { c: "SELECT region, COUNT(*), SUM(amount)", w: "" },
                        { c: "FROM orders", w: "" },
                        { c: "GROUP BY region;", w: "" },
                        { c: "", w: "" },
                        { c: "-- Later, when you want fresh data:", w: "" },
                        { c: "REFRESH MATERIALIZED VIEW dashboard_stats;", w: "**Re-runs the query and replaces the stored data.** Schedule this as a cron job — every hour, every night, whatever the business needs." }
                    ]
                }
            },
            {
                n: "Materialised views are PostgreSQL, Oracle and SQL Server territory. MySQL does not have them natively — you simulate them with a table and a scheduled refresh query. SQLite does not have either kind of view that materialises. Know your database.",
                nt: "Dialect note"
            },

            { h: "Views for access control" },
            {
                code: {
                    lang: "sql", t: "Hiding sensitive columns",
                    lines: [
                        { c: "CREATE VIEW employee_directory AS", w: "" },
                        { c: "SELECT", w: "" },
                        { c: "  employee_id,", w: "" },
                        { c: "  full_name,", w: "" },
                        { c: "  department,", w: "" },
                        { c: "  office_location", w: "**Salary, SSN and personal email are deliberately excluded.**" },
                        { c: "FROM employees;", w: "" },
                        { c: "", w: "" },
                        { c: "-- Then grant access to the view, not the table", w: "" },
                        { c: "GRANT SELECT ON employee_directory TO analyst_role;", w: "The analyst can query the directory but cannot see the underlying table." }
                    ]
                }
            },

            {
                tryit: {
                    t: "Create a reporting view",
                    task: "Create a view called `customer_summary` that shows each customer's name, total number of orders, total spending, average order value, and the date of their most recent order. Then query the view to find the top 10 customers by total spending.",
                    hint: "Join `customers` and `orders`, GROUP BY the customer, and aggregate. The view is one `CREATE VIEW ... AS SELECT ...` statement.",
                    sol: { lang: "sql", code: "CREATE VIEW customer_summary AS\nSELECT\n  c.customer_id,\n  c.name,\n  COUNT(o.order_id)    AS total_orders,\n  SUM(o.amount)        AS total_spent,\n  AVG(o.amount)        AS avg_order,\n  MAX(o.order_date)    AS last_order\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name;\n\n-- Use it\nSELECT * FROM customer_summary\nORDER BY total_spent DESC\nLIMIT 10;" },
                    w: "`LEFT JOIN` ensures customers with zero orders still appear (with NULLs for the aggregates). The view hides the join complexity — anyone can now write `SELECT * FROM customer_summary` without knowing the schema."
                }
            }
        ],
        k: [
            "A view is a named query — it is queried like a table but stores no data (the query runs each time).",
            "Use views for simplification, a single source of truth, and access control over sensitive columns.",
            "A materialised view stores the result on disk for speed, but requires explicit refreshing.",
            "`CREATE OR REPLACE VIEW` updates the definition without dropping permissions."
        ],
        r: ["View", "Abstraction", "Role-Based Access Control"],
        drill: {
            lang: "sql",
            reps: 3,
            items: [
                { c: "CREATE VIEW monthly_revenue AS SELECT ...;", w: "save a query as a reusable view" },
                { c: "SELECT * FROM monthly_revenue WHERE month >= '2026-01-01';", w: "query a view exactly like a table" },
                { c: "CREATE OR REPLACE VIEW monthly_revenue AS SELECT ...;", w: "update a view's definition without dropping it" },
                { c: "DROP VIEW IF EXISTS monthly_revenue;", w: "remove a view safely" },
                { c: "CREATE MATERIALIZED VIEW stats AS SELECT ...;", w: "create a pre-computed view stored on disk" },
                { c: "REFRESH MATERIALIZED VIEW stats;", w: "update a materialised view with fresh data" }
            ]
        }
    }

]);
