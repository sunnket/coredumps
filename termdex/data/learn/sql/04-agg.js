/* SQL — grouping and summarising. */
TD.addLessons("sql", [

{
 t: "GROUP BY — Turning Rows Into Answers",
 m: "agg",
 lvl: "core",
 s: "The clause that answers almost every question a business ever asks.",
 goal: [
  "Aggregate a whole table to a single row",
  "Produce one row per category with GROUP BY",
  "Filter groups with HAVING and know when to use WHERE instead"
 ],
 b: [
  { p: "Nearly every real question has the shape *what is the something, per something else*. Revenue per region, orders per customer, average delay per airline. `GROUP BY` is that sentence." },

  { h: "Aggregating the whole table first" },
  { code: { lang: "sql", t: "With no GROUP BY, the whole table is one group",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    COUNT(*)        AS orders,", w: "**Rows.** `COUNT(*)` counts every row including those full of NULLs." },
     { c: "    COUNT(shipped_at) AS shipped,", w: "**Non-NULL values in that column.** The gap between this and `COUNT(*)` is your unshipped count." },
     { c: "    SUM(amount)     AS revenue,", w: "" },
     { c: "    AVG(amount)     AS average,", w: "**Skips NULLs** — the average is over rows that have a value." },
     { c: "    MIN(amount)     AS smallest,", w: "" },
     { c: "    MAX(amount)     AS largest,", w: "**Read min and max first on any new table** — that is where impossible values live." },
     { c: "    COUNT(DISTINCT customer_id) AS customers", w: "**How many different customers**, not how many orders." },
     { c: "FROM orders;", w: "" }
    ],
    out: "orders  shipped  revenue    average  smallest  largest  customers\n48213   47990    2841902.5  58.94    0.99      12400.0  8127",
    after: "One row out, whatever the input size. That collapse from many rows to one is what *aggregate* means." } },

  { h: "One row per group" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    region,", w: "**The grouping column must appear here** if you want to see which group each row is." },
     { c: "    COUNT(*)    AS orders,", w: "" },
     { c: "    SUM(amount) AS revenue", w: "" },
     { c: "FROM orders", w: "" },
     { c: "GROUP BY region;", w: "**Collapse all rows sharing a region into one.** The aggregates are computed within each group.", hi: true }
    ],
    out: "region  orders  revenue\nEast    12043   712450.0\nNorth   11208   688100.0\nSouth   14877   904220.0\nWest     9085   537132.5" } },
  { ana: "Picture sorting a deck of cards into piles by suit. `GROUP BY region` makes the piles. `COUNT(*)` counts each pile, `SUM(amount)` adds up each pile. You get one answer per pile, never per card — which is why a card-level column has no place in the output unless it too defines the pile.",
    at: "Sorting into piles" },

  { h: "The rule about what may appear in SELECT" },
  { p: "**Every column in `SELECT` must either be in the `GROUP BY` or be inside an aggregate function.** There is no third option, and the reason is arithmetic rather than pedantry: a group of four hundred orders has four hundred customer names, so *which one* would the database print?" },
  { vs: { t: "The most common GROUP BY error", lang: "sql",
    bad: { c: "SELECT region, customer_name, SUM(amount)\nFROM orders\nGROUP BY region;", label: "Rejected — or worse, silently wrong",
      w: "Postgres and SQL Server reject this. MySQL and SQLite may return an **arbitrary** customer name per region, with no warning — a wrong answer that looks like a right one." },
    good: { c: "SELECT region,\n       COUNT(DISTINCT customer_name) AS customers,\n       SUM(amount) AS revenue\nFROM orders\nGROUP BY region;", label: "One value per group",
      w: "The shape now matches the question. If you genuinely want per-customer detail, group by customer too — but that is a different question." } } },
  { code: { lang: "sql", t: "Grouping by several columns",
    lines: [
     { c: "SELECT region, status, COUNT(*) AS n, SUM(amount) AS revenue", w: "" },
     { c: "FROM orders", w: "" },
     { c: "GROUP BY region, status", w: "**One row per distinct *combination*.** Four regions and three statuses gives up to twelve rows — only the combinations that actually occur." },
     { c: "ORDER BY region, revenue DESC;", w: "" }
    ] } },

  { h: "HAVING" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS spent", w: "" },
     { c: "FROM orders", w: "" },
     { c: "WHERE status = 'completed'", w: "**Filters rows, before grouping.** Refunds never enter any group." },
     { c: "GROUP BY customer_id", w: "" },
     { c: "HAVING COUNT(*) >= 5", w: "**Filters groups, after grouping.** Only customers with five or more completed orders survive.", hi: true },
     { c: "   AND SUM(amount) > 1000", w: "**Several conditions, same as `WHERE`.**" },
     { c: "ORDER BY spent DESC", w: "" },
     { c: "LIMIT 20;", w: "" }
    ],
    after: "Read as a sentence: *of completed orders, the twenty highest-spending customers who have ordered at least five times.* Every clause is doing one job." } },
  { tbl: { h: ["", "`WHERE`", "`HAVING`"],
    rows: [
     ["Runs", "Step 2, before grouping", "Step 4, after grouping"],
     ["Filters", "**Individual rows**", "**Whole groups**"],
     ["Can see aggregates", "No", "**Yes**"],
     ["Can use an index", "**Yes**", "No — the groups are computed already"],
     ["When both work", "**Prefer it** — less data to group", "—"]
    ] } },
  { n: "*Filter rows with `WHERE`, filter groups with `HAVING`.* If your condition mentions `SUM`, `COUNT`, `AVG` or another aggregate, it must be `HAVING`. If it does not, it should almost always be `WHERE`.",
    nt: "The one-line rule" },

  { h: "Counting things that are not there" },
  { code: { lang: "sql", t: "Conditional aggregation — a technique worth knowing early",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    region,", w: "" },
     { c: "    COUNT(*) AS total,", w: "" },
     { c: "    COUNT(*) FILTER (WHERE status = 'refunded') AS refunds,", w: "**`FILTER` is the standard form**, supported by Postgres and SQLite." },
     { c: "    SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunds_portable,", w: "**The portable version** — works everywhere, and it is the idiom you will see most often in existing code.", hi: true },
     { c: "    SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END) AS refund_value", w: "**Not just counting — summing a subset.** This is how one query produces a whole cross-tab." },
     { c: "FROM orders", w: "" },
     { c: "GROUP BY region;", w: "" }
    ],
    out: "region  total  refunds  refunds_portable  refund_value\nEast    12043  431      431               24188.50\nNorth   11208  388      388               21004.75" } },
  { p: "This pattern — several `CASE`s inside aggregates over one `GROUP BY` — replaces running four separate queries and joining the results. It is the SQL equivalent of a pivot table, and it is one of the most useful things in this module." },

  { h: "Rounding and formatting" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT region,", w: "" },
     { c: "    ROUND(AVG(amount), 2) AS avg_order,", w: "**Round the aggregate, not the input.** Rounding first then averaging gives a subtly different and wrong number." },
     { c: "    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct", w: "**Each region's share of the total.** The `OVER ()` makes it a window function — the advanced module." },
     { c: "FROM orders", w: "" },
     { c: "GROUP BY region;", w: "" }
    ] } },
  { trap: "**Integer division truncates.** In Postgres, `COUNT(*) / SUM(...)` on two integers gives `0`, not `0.34`. Multiplying by `100.0` rather than `100` forces the calculation into floating point and fixes it. This silently produces columns of zeros, and it catches everyone at least once." },

  { tryit: { t: "Build a summary report",
    task: "From any transactional table, produce one row per category showing: number of rows, number of distinct customers, total value, average value, largest single value, and the count of a subset (refunds, cancellations, whatever exists). Keep only categories with more than twenty rows, sorted by total descending.",
    hint: "`COUNT`, `COUNT(DISTINCT ...)`, `SUM`, `ROUND(AVG(...), 2)`, `MAX`, and a `SUM(CASE ...)`. Then `HAVING COUNT(*) > 20`.",
    sol: { lang: "sql", code: "SELECT\n    category,\n    COUNT(*)                    AS orders,\n    COUNT(DISTINCT customer_id) AS customers,\n    ROUND(SUM(amount), 2)       AS revenue,\n    ROUND(AVG(amount), 2)       AS avg_order,\n    MAX(amount)                 AS largest,\n    SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunds\nFROM orders\nWHERE order_date >= '2026-01-01'\nGROUP BY category\nHAVING COUNT(*) > 20\nORDER BY revenue DESC;" },
    w: "Notice the division of labour: `WHERE` narrows to this year *before* grouping, `HAVING` drops the thin categories *after*. Swap them and you either get a syntax error or a much slower query — the clause ordering lesson, paying off." } }
 ],
 k: [
  "Aggregates collapse many rows into one; with `GROUP BY` they collapse into one row per group.",
  "Every `SELECT` column must be in the `GROUP BY` or inside an aggregate — MySQL and SQLite may not enforce this and return arbitrary values.",
  "`WHERE` filters rows before grouping, `HAVING` filters groups after; use `WHERE` whenever both would work.",
  "`SUM(CASE WHEN ... THEN 1 ELSE 0 END)` counts a subset per group — one query instead of four."
 ],
 r: ["Group By", "Aggregate Function", "SQL", "OLAP"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "SELECT COUNT(*), SUM(amount), AVG(amount) FROM orders;", w: "collapse a whole table to one summary row" },
   { c: "SELECT region, SUM(amount) AS revenue FROM orders GROUP BY region;", w: "one summary row per category" },
   { c: "SELECT COUNT(DISTINCT customer_id) FROM orders;", w: "count how many different customers appear" },
   { c: "HAVING COUNT(*) >= 5", w: "keep only the groups with at least five rows" },
   { c: "SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunds", w: "count a subset within each group" }
  ]
 }
}

]);
