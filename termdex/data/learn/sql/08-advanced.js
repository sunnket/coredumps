/* SQL — the professional tier. */
TD.addLessons("sql", [

{
 t: "Subqueries and CTEs",
 m: "advanced",
 lvl: "advanced",
 s: "Breaking a hard question into steps you can read, instead of one query nobody can.",
 goal: [
  "Use a subquery in the three positions it can appear",
  "Rewrite a nested query as a readable chain of CTEs",
  "Choose between a subquery, a CTE and a join"
 ],
 b: [
  { p: "Every question so far has been answerable in one pass. Real questions frequently are not — *which customers spend more than average*, *what is each region's best month* — and this lesson is how you express those without producing something unreadable." },

  { h: "A subquery is a query inside a query" },
  { code: { lang: "sql", t: "Three positions it can appear in",
    lines: [
     { c: "-- 1. In WHERE, producing a value to compare against", w: "" },
     { c: "SELECT name, amount FROM orders", w: "" },
     { c: "WHERE amount > (SELECT AVG(amount) FROM orders);", w: "**A scalar subquery — one row, one column.** Runs once, and its result is used as a plain value.", hi: true },
     { c: "", w: "" },
     { c: "-- 2. In WHERE, producing a list", w: "" },
     { c: "SELECT * FROM orders", w: "" },
     { c: "WHERE customer_id IN (SELECT id FROM customers WHERE city = 'London');", w: "**One column, many rows**, used with `IN`." },
     { c: "", w: "" },
     { c: "-- 3. In FROM, producing a table", w: "" },
     { c: "SELECT region, AVG(order_count) AS avg_orders", w: "" },
     { c: "FROM (", w: "**A derived table.** The inner query's result is treated as a table by the outer one." },
     { c: "    SELECT region, customer_id, COUNT(*) AS order_count", w: "" },
     { c: "    FROM orders GROUP BY region, customer_id", w: "" },
     { c: ") AS per_customer", w: "**A derived table must be aliased** on most engines." },
     { c: "GROUP BY region;", w: "**Aggregating an aggregate** — the average number of orders per customer, by region. Impossible in one pass." }
    ] } },

  { h: "Correlated subqueries" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT c.name,", w: "" },
     { c: "    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders", w: "**Correlated: the inner query references `c` from the outer one**, so it runs once per outer row. Readable, and potentially slow.", hi: true },
     { c: "FROM customers AS c;", w: "" },
     { c: "", w: "" },
     { c: "-- usually better as a join:", w: "" },
     { c: "SELECT c.name, COUNT(o.id) AS orders", w: "" },
     { c: "FROM customers AS c", w: "" },
     { c: "LEFT JOIN orders AS o ON o.customer_id = c.id", w: "**One pass over both tables instead of one query per customer.** Query planners often rewrite the first form into this one, but not always." },
     { c: "GROUP BY c.name;", w: "" }
    ] } },
  { code: { lang: "sql", t: "EXISTS — the one correlated form to keep",
    lines: [
     { c: "SELECT name FROM customers AS c", w: "" },
     { c: "WHERE EXISTS (", w: "**Stops at the first match** rather than counting everything. For *does any such row exist*, this is the efficient form." },
     { c: "    SELECT 1 FROM orders o", w: "**`SELECT 1` because the value is never used** — only whether a row came back." },
     { c: "    WHERE o.customer_id = c.id AND o.amount > 1000", w: "" },
     { c: ");", w: "" },
     { c: "", w: "" },
     { c: "WHERE NOT EXISTS (...)", w: "**The safe negation.** Unlike `NOT IN`, it behaves correctly when the inner query can return NULL." }
    ] } },

  { h: "CTEs — the readable alternative" },
  { p: "A **Common Table Expression** is a named subquery declared before the query that uses it. It is the same power, arranged so a human can follow it." },
  { vs: { t: "*Regions whose average order exceeds the company average*", lang: "sql",
    bad: { c: "SELECT region, avg_amt FROM (\n  SELECT region, AVG(amount) AS avg_amt\n  FROM orders GROUP BY region\n) r\nWHERE avg_amt > (\n  SELECT AVG(amount) FROM orders\n);", label: "Nested — read inside out",
      w: "Only three levels and already you must read from the middle outwards to follow it. At five levels this becomes genuinely unmaintainable." },
    good: { c: "WITH region_avg AS (\n    SELECT region, AVG(amount) AS avg_amt\n    FROM orders GROUP BY region\n),\noverall AS (\n    SELECT AVG(amount) AS avg_amt FROM orders\n)\nSELECT r.region, r.avg_amt\nFROM region_avg r, overall o\nWHERE r.avg_amt > o.avg_amt;", label: "CTEs — read top to bottom",
      w: "Each step is named, and each can be run on its own while you build it. **Identical performance on modern engines**, and far easier to review." } } },
  { code: { lang: "sql", t: "Chaining CTEs — a real analysis",
    lines: [
     { c: "WITH monthly AS (", w: "**`WITH` declares the first CTE.**" },
     { c: "    SELECT", w: "" },
     { c: "        DATE_TRUNC('month', order_date) AS month,", w: "**Postgres.** SQLite: `strftime('%Y-%m', order_date)`. MySQL: `DATE_FORMAT(...)`." },
     { c: "        region,", w: "" },
     { c: "        SUM(amount) AS revenue", w: "" },
     { c: "    FROM orders", w: "" },
     { c: "    WHERE status = 'completed'", w: "" },
     { c: "    GROUP BY 1, 2", w: "" },
     { c: "),", w: "**A comma between CTEs, and no `WITH` on the later ones.**" },
     { c: "ranked AS (", w: "" },
     { c: "    SELECT *,", w: "" },
     { c: "        RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS rk", w: "**A CTE can build on the previous one.** Window functions are the next lesson.", hi: true },
     { c: "    FROM monthly", w: "" },
     { c: ")", w: "" },
     { c: "SELECT region, month, revenue", w: "**The final query, which is now trivially simple.**" },
     { c: "FROM ranked", w: "" },
     { c: "WHERE rk = 1", w: "**Each region's best month.**" },
     { c: "ORDER BY revenue DESC;", w: "" }
    ] } },
  { n: "The practical value of CTEs is that you can develop them incrementally. Write the first one, run it on its own, check the numbers. Add the second, run it. By the time the final `SELECT` is written you have verified every step — instead of debugging a five-level nested query all at once.",
    nt: "Build them one at a time" },

  { h: "Recursive CTEs" },
  { code: { lang: "sql", t: "Walking a hierarchy of unknown depth",
    lines: [
     { c: "WITH RECURSIVE chain AS (", w: "**`RECURSIVE` is required** on Postgres and SQLite; MySQL and SQL Server infer it." },
     { c: "    SELECT id, name, manager_id, 1 AS level", w: "**The anchor: where to start.**" },
     { c: "    FROM employees WHERE manager_id IS NULL", w: "The person at the top." },
     { c: "", w: "" },
     { c: "    UNION ALL", w: "**Joins the anchor to the recursive part.**" },
     { c: "", w: "" },
     { c: "    SELECT e.id, e.name, e.manager_id, c.level + 1", w: "**The recursive step: refers to the CTE from inside itself.**", hi: true },
     { c: "    FROM employees e", w: "" },
     { c: "    JOIN chain c ON e.manager_id = c.id", w: "**Everyone reporting to someone already found.** Repeats until no new rows appear." },
     { c: ")", w: "" },
     { c: "SELECT REPEAT('  ', level - 1) || name AS org_chart, level", w: "" },
     { c: "FROM chain ORDER BY level, name;", w: "" }
    ],
    after: "Org charts, category trees, threaded comments, bill-of-materials, graph paths — anything of unknown depth. Add a depth limit in production; a cycle in the data will otherwise loop forever." } },

  { tryit: { t: "Rewrite something unreadable",
    task: "Find or write a query with at least two levels of nesting and rewrite it as CTEs. Run each CTE independently to verify it. Then answer a two-stage question of your own — for example, customers whose average order exceeds their region's average.",
    hint: "One CTE per sentence of the question. If you can say the steps out loud, you have the CTE list.",
    sol: { lang: "sql", code: "WITH per_customer AS (\n    SELECT customer_id, region, AVG(amount) AS cust_avg\n    FROM orders\n    GROUP BY customer_id, region\n),\nper_region AS (\n    SELECT region, AVG(amount) AS region_avg\n    FROM orders\n    GROUP BY region\n)\nSELECT\n    c.customer_id,\n    c.region,\n    ROUND(c.cust_avg, 2)   AS customer_average,\n    ROUND(r.region_avg, 2) AS region_average\nFROM per_customer c\nJOIN per_region r ON r.region = c.region\nWHERE c.cust_avg > r.region_avg\nORDER BY c.cust_avg DESC;" },
    w: "Notice the two CTEs are each a complete, runnable query. Select from `per_customer` alone and check the numbers look sane; then `per_region`; only then join them. That incremental verification is what makes long SQL trustworthy rather than merely long." } }
 ],
 k: [
  "A subquery can appear in `WHERE` as a value or a list, or in `FROM` as a derived table.",
  "`EXISTS` stops at the first match and handles NULLs correctly, where `NOT IN` does not.",
  "CTEs are named subqueries read top to bottom, with the same performance and far better readability.",
  "Build a chain of CTEs one at a time, running each on its own to verify it before adding the next."
 ],
 r: ["Subquery", "Common Table Expression", "SQL", "DQL", "Recursion"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "WHERE amount > (SELECT AVG(amount) FROM orders);", w: "compare each row against a value computed from the whole table" },
   { c: "WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);", w: "keep rows that have at least one match elsewhere" },
   { c: "WITH region_avg AS (SELECT region, AVG(amount) AS avg_amt FROM orders GROUP BY region)", w: "name an intermediate result so the main query stays readable" },
   { c: "WITH RECURSIVE chain AS (...)", w: "walk a hierarchy of unknown depth" }
  ]
 }
},

{
 t: "Window Functions",
 m: "advanced",
 lvl: "advanced",
 s: "Running totals, rankings and period-over-period — the feature that separates competent SQL from good SQL.",
 goal: [
  "Explain how a window function differs from an aggregate",
  "Rank rows within groups and pick the top n per group",
  "Compute running totals and compare a row to its neighbours"
 ],
 b: [
  { p: "If one thing in this track marks the line between *can write SQL* and *is good at SQL*, it is this. Window functions answer questions that otherwise need a self-join, a temporary table, or exporting to Python." },

  { h: "The difference from GROUP BY" },
  { p: "`GROUP BY` **collapses** rows: ten orders become one row. A window function **keeps every row** and adds a value computed across a related set of rows." },
  { code: { lang: "sql", t: "The same data, both ways",
    lines: [
     { c: "-- GROUP BY: four rows out", w: "" },
     { c: "SELECT region, SUM(amount) FROM orders GROUP BY region;", w: "**You lose the individual orders.**" },
     { c: "", w: "" },
     { c: "-- window: every row out, plus its region's total", w: "" },
     { c: "SELECT", w: "" },
     { c: "    id, region, amount,", w: "**Every order still here.**" },
     { c: "    SUM(amount) OVER (PARTITION BY region) AS region_total,", w: "**`OVER` makes it a window function.** `PARTITION BY` is *like* `GROUP BY`, but nothing collapses.", hi: true },
     { c: "    ROUND(100.0 * amount / SUM(amount) OVER (PARTITION BY region), 1) AS pct_of_region", w: "**Each order's share of its own region** — the classic thing that is awkward any other way." },
     { c: "FROM orders;", w: "" }
    ],
    out: "id  region  amount  region_total  pct_of_region\n1   East    100     450           22.2\n2   East    350     450           77.8\n3   West    200     500           40.0\n4   West    300     500           60.0" } },
  { ana: "`GROUP BY` puts the subtotal at the bottom of each section of a report. A window function writes that section's subtotal into every row of the section, so each line can be compared against it without you looking anything up. It is exactly the `agg` versus `transform` distinction from the pandas module.",
    at: "Subtotal at the bottom, or on every row" },

  { h: "The anatomy of OVER" },
  { syn: { t: "Every window function has this shape",
    parts: [
     { p: "RANK()", w: "**The function.** Either a ranking function or an ordinary aggregate." },
     { p: " OVER (" },
     { p: "PARTITION BY region", w: "**Optional. Which rows form each window** — like `GROUP BY`, but non-collapsing. Omit it and the window is the whole result set." },
     { p: " " },
     { p: "ORDER BY revenue DESC", w: "**Optional. The order within each window.** Required for ranking; for aggregates it turns them into *running* aggregates." },
     { p: " " },
     { p: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", w: "**Optional. The frame** — which rows around the current one are included. This default appears automatically once you write `ORDER BY`." },
     { p: ")" }
    ] } },

  { h: "Ranking" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT name, region, revenue,", w: "" },
     { c: "    ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS rn,", w: "**1, 2, 3, 4 — always distinct, ties broken arbitrarily.** Use it when you need exactly one row per group." },
     { c: "    RANK()       OVER (PARTITION BY region ORDER BY revenue DESC) AS rk,", w: "**1, 2, 2, 4 — ties share a rank and leave a gap.** The sporting sense of the word." },
     { c: "    DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS drk", w: "**1, 2, 2, 3 — ties share, no gap.**" },
     { c: "FROM sales_by_rep;", w: "" }
    ],
    out: "name   region  revenue  rn  rk  drk\nAda    East    5000     1   1   1\nPriya  East    3000     2   2   2\nKenji  East    3000     3   2   2\nLena   East    1000     4   4   3" } },
  { code: { lang: "sql", t: "Top n per group — the pattern to memorise",
    lines: [
     { c: "WITH ranked AS (", w: "**A window function cannot be used in `WHERE`** — it is computed at step 5, after `WHERE` has run. So it must be wrapped in a CTE or subquery.", hi: true },
     { c: "    SELECT name, region, revenue,", w: "" },
     { c: "        ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS rn", w: "" },
     { c: "    FROM sales_by_rep", w: "" },
     { c: ")", w: "" },
     { c: "SELECT name, region, revenue", w: "" },
     { c: "FROM ranked", w: "" },
     { c: "WHERE rn <= 3", w: "**The top three per region.** This exact pattern appears in essentially every analytical codebase." },
     { c: "ORDER BY region, rn;", w: "" }
    ] } },

  { h: "Running totals and moving averages" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    order_date, amount,", w: "" },
     { c: "    SUM(amount) OVER (ORDER BY order_date) AS running_total,", w: "**`ORDER BY` inside `OVER` turns `SUM` into a running total.** Everything from the start up to this row.", hi: true },
     { c: "    AVG(amount) OVER (", w: "" },
     { c: "        ORDER BY order_date", w: "" },
     { c: "        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW", w: "**An explicit frame: this row and the six before it** — a seven-day moving average." },
     { c: "    ) AS avg_7d,", w: "" },
     { c: "    COUNT(*) OVER (PARTITION BY DATE_TRUNC('month', order_date)) AS orders_that_month", w: "**Partition without ordering: the whole month's count on every row of it.**" },
     { c: "FROM orders", w: "" },
     { c: "ORDER BY order_date;", w: "" }
    ] } },
  { trap: "`ROWS` counts physical rows; `RANGE` counts by value. With `ORDER BY order_date` and several orders on the same day, `ROWS BETWEEN 6 PRECEDING` takes six *rows* — which may all be the same day — while `RANGE` groups the ties together. When your ordering column has duplicates, the two give different answers, and `ROWS` is usually the one you meant." },

  { h: "Looking at neighbouring rows" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    month, revenue,", w: "" },
     { c: "    LAG(revenue) OVER (ORDER BY month) AS prev_month,", w: "**The previous row's value, on this row.** `LAG(revenue, 12)` for the same month last year." },
     { c: "    LEAD(revenue) OVER (ORDER BY month) AS next_month,", w: "The following row's." },
     { c: "", w: "" },
     { c: "    revenue - LAG(revenue) OVER (ORDER BY month) AS change,", w: "**Month-over-month change**, with no self-join.", hi: true },
     { c: "    ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))", w: "" },
     { c: "          / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS pct_change,", w: "**`NULLIF` guards the divide-by-zero** — the trick from the NULL lesson." },
     { c: "", w: "" },
     { c: "    FIRST_VALUE(revenue) OVER (ORDER BY month) AS first_month,", w: "" },
     { c: "    revenue - FIRST_VALUE(revenue) OVER (ORDER BY month) AS vs_start", w: "Growth since the beginning of the series." },
     { c: "FROM monthly_revenue;", w: "" }
    ],
    out: "month     revenue  prev_month  change  pct_change  vs_start\n2026-01   10000    NULL        NULL    NULL        0\n2026-02   12000    10000       2000    20.0        2000\n2026-03   11000    12000      -1000    -8.3        1000" } },
  { n: "The `NULL` in the first row is correct and worth leaving alone. There is no previous month, so the change is genuinely unknown — filling it with zero would draw a flat line that never happened. This is the same argument as the rolling-average NULLs in the pandas module.",
    nt: "The first row's NULL is right" },

  { h: "Naming a window" },
  { code: { lang: "sql", t: "When the same OVER clause repeats",
    lines: [
     { c: "SELECT month, revenue,", w: "" },
     { c: "    LAG(revenue)  OVER w AS prev,", w: "" },
     { c: "    LEAD(revenue) OVER w AS next,", w: "" },
     { c: "    SUM(revenue)  OVER w AS running", w: "" },
     { c: "FROM monthly_revenue", w: "" },
     { c: "WINDOW w AS (ORDER BY month);", w: "**Declared once, used three times.** Removes the repetition that makes window-heavy queries hard to read — and to change." }
    ] } },

  { h: "Where this track has brought you" },
  { p: "From `SELECT * FROM customers` to ranking within partitions and walking recursive hierarchies. The through-line has been the same idea the first lesson opened with: **describe the answer, and let the database work out how.**" },
  { l: [
   "**If you came from the Python track**, the pieces now fit — `groupby` is `GROUP BY`, `merge` is `JOIN`, `transform` is a window function, and DuckDB lets you use either against the same data.",
   "**Next: the query-plan lesson** below, which is how you find out why something is slow.",
   "**Then build something.** Load a real dataset, ask it five genuine questions, and write the queries. Nothing else consolidates this."
  ] },

  { tryit: { t: "A report that needs windows",
    task: "Produce a monthly revenue report with: revenue, running total for the year, three-month moving average, change from the previous month as a percentage, and each month's rank within its year. One query.",
    hint: "One CTE to aggregate monthly, then a second doing all the window work over it.",
    sol: { lang: "sql", code: "WITH monthly AS (\n    SELECT\n        DATE_TRUNC('month', order_date) AS month,\n        SUM(amount) AS revenue\n    FROM orders\n    WHERE status = 'completed'\n    GROUP BY 1\n)\nSELECT\n    month,\n    ROUND(revenue, 2) AS revenue,\n    ROUND(SUM(revenue) OVER (\n        PARTITION BY DATE_TRUNC('year', month) ORDER BY month), 2) AS ytd,\n    ROUND(AVG(revenue) OVER (\n        ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3m,\n    ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))\n          / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS pct_change,\n    RANK() OVER (\n        PARTITION BY DATE_TRUNC('year', month) ORDER BY revenue DESC) AS rank_in_year\nFROM monthly\nORDER BY month;" },
    w: "Note the running total partitions by year, so it resets each January, while the moving average does not — two different windows in one `SELECT`, each shaped to its own question. That independence is what makes window functions so much more expressive than a chain of joins." } }
 ],
 k: [
  "A window function keeps every row and adds a value computed over related rows; `GROUP BY` collapses them.",
  "`OVER (PARTITION BY ... ORDER BY ... frame)` — partition is the grouping, order enables ranking and running totals.",
  "`ROW_NUMBER` breaks ties arbitrarily, `RANK` leaves gaps, `DENSE_RANK` does not. Wrap in a CTE to filter on them.",
  "`LAG` and `LEAD` reach the neighbouring rows, which is how period-over-period comparison is done without a self-join."
 ],
 r: ["Window Function", "SQL", "Aggregate Function", "Common Table Expression", "OLAP", "Reranking"],
 drill: {
  lang: "sql",
  reps: 4,
  items: [
   { c: "SUM(amount) OVER (PARTITION BY region) AS region_total", w: "put each group's total on every row without collapsing" },
   { c: "ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS rn", w: "number the rows within each group, highest first" },
   { c: "WHERE rn <= 3", w: "keep the top three per group", hint: "needs a CTE around the ranking" },
   { c: "SUM(amount) OVER (ORDER BY order_date) AS running_total", w: "accumulate a total as the rows go by" },
   { c: "AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)", w: "average this row and the six before it" },
   { c: "LAG(revenue) OVER (ORDER BY month) AS prev_month", w: "bring the previous row's value onto this row" }
  ]
 }
},

{
 t: "Indexes and Reading a Query Plan",
 m: "advanced",
 lvl: "advanced",
 s: "Why a query is slow, and the three things that fix ninety per cent of them.",
 goal: [
  "Explain what an index is and what it costs",
  "Read an execution plan and find the expensive step",
  "Diagnose and fix the common causes of a slow query"
 ],
 b: [
  { p: "Everything so far has been about getting the right answer. This lesson is about getting it in under a second on a table with fifty million rows." },

  { h: "What an index is" },
  { p: "An index is a separate, sorted structure — usually a **B-tree** — mapping a column's values to the rows holding them. Without one, finding a row means reading every row." },
  { ana: "A textbook's index at the back. To find every mention of *photosynthesis*, you either read all nine hundred pages, or you look up one word in a sorted list and go straight to the four pages named. The index takes up extra pages and must be reprinted whenever the book changes — which is exactly the trade a database index makes.",
    at: "The index at the back of the book" },
  { dg: "btree" },
  { code: { lang: "text", t: "The difference, on fifty million rows",
    lines: [
     { c: "SELECT * FROM orders WHERE customer_id = 4821;", w: "" },
     { c: "", w: "" },
     { c: "  without an index:  read all 50,000,000 rows        ~8 seconds", w: "**A sequential scan.** Every row examined and discarded." },
     { c: "  with an index:     3 or 4 tree hops, then fetch     ~0.2 ms", w: "**Roughly forty thousand times faster**, and the gap widens as the table grows.", hi: true }
    ] } },
  { dg: "index-scan" },

  { h: "Creating them" },
  { code: { lang: "sql",
    lines: [
     { c: "CREATE INDEX idx_orders_customer ON orders(customer_id);", w: "**Foreign keys are the first place to look.** Postgres does *not* index them automatically, and unindexed foreign keys are a very common cause of slow joins." },
     { c: "", w: "" },
     { c: "CREATE INDEX idx_orders_date ON orders(order_date);", w: "Anything you filter or sort by regularly." },
     { c: "", w: "" },
     { c: "CREATE INDEX idx_orders_cust_date ON orders(customer_id, order_date);", w: "**A composite index. Column order matters enormously.**", hi: true },
     { c: "-- serves: WHERE customer_id = 5", w: "**The leftmost prefix can be used on its own.**" },
     { c: "-- serves: WHERE customer_id = 5 AND order_date > '2026-01-01'", w: "**Both columns — the ideal case.**" },
     { c: "-- does NOT serve: WHERE order_date > '2026-01-01'", w: "**Skipping the first column makes the index useless**, exactly like looking up a phone book by first name." },
     { c: "", w: "" },
     { c: "CREATE UNIQUE INDEX idx_customers_email ON customers(email);", w: "**Enforces uniqueness and speeds up lookups.** A `UNIQUE` constraint creates one of these behind the scenes." },
     { c: "", w: "" },
     { c: "CREATE INDEX idx_orders_pending ON orders(order_date)", w: "" },
     { c: "    WHERE status = 'pending';", w: "**A partial index** — only the rows matching that condition. Tiny, and perfect when you constantly query a small subset of a huge table." },
     { c: "", w: "" },
     { c: "DROP INDEX idx_orders_date;", w: "" }
    ] } },

  { h: "What indexes cost" },
  { l: [
   "**Disk space.** Often 10–30 per cent of the table's size, per index.",
   "**Slower writes.** Every `INSERT`, `UPDATE` and `DELETE` must update every affected index. A table with twelve indexes is slow to write to.",
   "**Nothing at all if unused.** An index nobody queries is pure cost — and every real database has some."
  ] },
  { n: "The rule of thumb: index primary keys (automatic), foreign keys (**not** automatic), and the columns you filter, join or sort by in your actual slow queries. Do not index every column speculatively; add them in response to measured slowness, and periodically drop the ones the engine's statistics show are never used.",
    nt: "Which columns to index" },

  { h: "Reading a plan" },
  { code: { lang: "sql",
    lines: [
     { c: "EXPLAIN SELECT * FROM orders WHERE customer_id = 4821;", w: "**The plan the database *would* use.** Fast, and does not run the query." },
     { c: "", w: "" },
     { c: "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 4821;", w: "**Actually runs it and reports real timings and row counts.** This is the one to use — estimates lie, measurements do not.", hi: true },
     { c: "", w: "" },
     { c: "-- MySQL: EXPLAIN ANALYZE (8.0+)   SQLite: EXPLAIN QUERY PLAN", w: "" }
    ] } },
  { code: { lang: "text", t: "A plan with a problem in it",
    lines: [
     { c: "Seq Scan on orders  (cost=0.00..981.00 rows=1 width=64)", w: "**`Seq Scan` — every row read.** On a large table this is the thing to look for first.", hi: true },
     { c: "                    (actual time=0.03..248.7 rows=1 loops=1)", w: "**`actual time` is what matters.** 248ms to find one row." },
     { c: "  Filter: (customer_id = 4821)", w: "" },
     { c: "  Rows Removed by Filter: 4999999", w: "**Five million rows read and thrown away.** This line alone diagnoses the query." },
     { c: "", w: "" },
     { c: "-- after CREATE INDEX idx_orders_customer ON orders(customer_id);", w: "" },
     { c: "", w: "" },
     { c: "Index Scan using idx_orders_customer on orders", w: "**`Index Scan` — the index was used.**" },
     { c: "                    (actual time=0.02..0.04 rows=1 loops=1)", w: "**248ms to 0.04ms.** Same query, same data, one index." },
     { c: "  Index Cond: (customer_id = 4821)", w: "" }
    ] } },
  { tbl: { t: "What the node names mean",
    h: ["Node", "Meaning", "Concern?"],
    rows: [
     ["`Seq Scan`", "Read the whole table", "**On a large table with a selective filter, yes**. On a small table it is correct and cheaper than an index"],
     ["`Index Scan`", "Used the index, then fetched rows", "Good"],
     ["`Index Only Scan`", "Answered entirely from the index", "**Best.** The table was never touched"],
     ["`Bitmap Heap Scan`", "Index found many rows, fetched them in disk order", "Fine — normal for medium selectivity"],
     ["`Nested Loop`", "For each left row, look up the right", "Good for few rows, **terrible for many**"],
     ["`Hash Join`", "Built a hash table of one side", "Good for large joins"],
     ["`Sort`", "Sorting", "Check `external merge` — that means it spilled to disk"]
    ] } },
  { l: [
   "**Read the plan innermost-first** — that is execution order.",
   "**Find the node with the largest `actual time`.** That is your problem; nothing else matters until it is fixed.",
   "**Compare `rows` estimated against `rows` actual.** A large gap means the planner's statistics are stale — run `ANALYZE`.",
   "**`loops=N`** means that node ran N times. Multiply the time by the loops for its true cost."
  ] },

  { h: "The usual causes, and their fixes" },
  { tbl: { h: ["Symptom", "Cause", "Fix"],
    rows: [
     ["`Seq Scan` on a big table", "No index on the filtered column", "`CREATE INDEX`"],
     ["Index exists but is ignored", "**Column wrapped in a function** — `YEAR(date) = 2026`", "Compare the bare column to a range"],
     ["Index exists but is ignored", "Type mismatch — comparing text to a number", "Fix the types, or cast the literal"],
     ["`LIKE '%x%'` is slow", "A leading wildcard cannot use a B-tree", "Full-text index, or a trigram index"],
     ["A join is slow", "**Unindexed foreign key**", "Index the FK column"],
     ["Everything got slow suddenly", "Stale statistics after a bulk load", "`ANALYZE table_name;`"],
     ["`SELECT *` is slow", "Fetching columns you do not use", "Name the columns; may enable an index-only scan"],
     ["Fine alone, slow in production", "N+1 — a query per row of another query", "One join instead of a loop of queries"]
    ] } },
  { trap: "The **N+1 problem** is the most common performance bug in application code and it never shows up when testing a single query. An ORM lazily loading each order's customer runs one query for the orders and then one per order — 1,001 round trips for a page of a thousand rows, each fast, together disastrous. The fix is to fetch it in one join; every ORM has a way to say so." },

  { h: "A method for a slow query" },
  { ol: [
   "**Measure.** `EXPLAIN ANALYZE`. Do not guess, and do not optimise before you have a number.",
   "**Find the dominant node** — the one with the largest actual time.",
   "**Reduce rows as early as possible.** Filter before joining and before grouping.",
   "**Check the filter can use an index.** No functions on the column, no type mismatch.",
   "**Add the index**, re-run `EXPLAIN ANALYZE`, and confirm it was actually used.",
   "**Only then** consider restructuring the query, denormalising, or caching."
  ] },
  { q: "The fastest query is the one you never send. The second fastest reads the fewest rows.", by: "The whole of query optimisation, compressed" },

  { tryit: { t: "Make something slow, then fix it",
    task: "Create a table with a million rows and no indexes. Time a filtered query and record the plan. Add an index, re-run, and compare. Then deliberately break it with `WHERE YEAR(created_at) = 2026` and confirm the plan falls back to a sequential scan.",
    hint: "`generate_series` in Postgres, or a recursive CTE in SQLite, builds a million rows quickly.",
    sol: { lang: "sql", code: "-- a million rows\nCREATE TABLE big AS\nSELECT\n    g AS id,\n    (random() * 10000)::int AS customer_id,\n    DATE '2020-01-01' + (random() * 2000)::int AS created_at\nFROM generate_series(1, 1000000) g;\n\nEXPLAIN ANALYZE SELECT * FROM big WHERE customer_id = 4821;\n-- Seq Scan ... actual time=... 95 ms\n\nCREATE INDEX idx_big_customer ON big(customer_id);\nANALYZE big;\n\nEXPLAIN ANALYZE SELECT * FROM big WHERE customer_id = 4821;\n-- Index Scan ... actual time=... 0.3 ms\n\n-- now break it\nCREATE INDEX idx_big_created ON big(created_at);\nEXPLAIN ANALYZE SELECT * FROM big WHERE EXTRACT(YEAR FROM created_at) = 2023;\n-- Seq Scan again: the function hides the column from the index\n\nEXPLAIN ANALYZE SELECT * FROM big\nWHERE created_at >= '2023-01-01' AND created_at < '2024-01-01';\n-- Index Scan: same answer, same data, one rewrite" },
    w: "The last pair is the lesson. Two queries returning identical rows, one using the index and one not, differing only in how the condition is written. Being able to spot that in someone else's SQL — including your own from last month — is most of what practical query tuning is." } }
 ],
 k: [
  "An index is a sorted structure that turns a full scan into a few hops; it costs disk space and slows every write.",
  "Index foreign keys explicitly — Postgres does not do it for you, and unindexed FKs make joins slow.",
  "In a composite index the column order matters: only a leftmost prefix can be used.",
  "`EXPLAIN ANALYZE`, find the node with the largest actual time, and check whether a function on a column is hiding an index."
 ],
 r: ["Index", "Query Plan", "B-Tree", "Full Table Scan", "Query Optimiser", "N+1 Query Problem"],
 drill: {
  lang: "sql",
  reps: 4,
  items: [
   { c: "CREATE INDEX idx_orders_customer ON orders(customer_id);", w: "speed up lookups and joins on a foreign key" },
   { c: "CREATE INDEX idx_orders_cust_date ON orders(customer_id, order_date);", w: "index two columns together for a combined filter" },
   { c: "CREATE UNIQUE INDEX idx_customers_email ON customers(email);", w: "enforce uniqueness and speed up lookups at once" },
   { c: "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 4821;", w: "run a query and report what it actually did" },
   { c: "ANALYZE orders;", w: "refresh the statistics the planner relies on" }
  ]
 }
}

]);
