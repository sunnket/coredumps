/* SQL — filtering and sorting. */
TD.addLessons("sql", [

{
 t: "WHERE — Keeping Only the Rows You Want",
 m: "filter",
 lvl: "core",
 s: "Comparison, combination, and the operators that do more than you would write by hand.",
 goal: [
  "Filter on one condition and on several combined",
  "Use IN, BETWEEN and LIKE instead of long chains of OR",
  "Get the precedence right when AND and OR appear together"
 ],
 b: [
  { p: "`WHERE` runs at step 2 — before grouping, before `SELECT`. It looks at each row on its own and keeps it or discards it." },

  { code: { lang: "sql",
    lines: [
     { c: "SELECT name, city FROM customers", w: "" },
     { c: "WHERE city = 'London';", w: "**One equals sign for comparison.** SQL has no `==`; a single `=` is the comparison operator." }
    ] } },
  { tbl: { t: "The comparison operators",
    h: ["Operator", "Means", "Example"],
    rows: [
     ["`=`", "Equal", "`status = 'active'`"],
     ["`<>` or `!=`", "Not equal. **`<>` is the standard**; both work everywhere", "`status <> 'refunded'`"],
     ["`< > <= >=`", "Ordering — works on numbers, dates and text", "`amount >= 100`"],
     ["`BETWEEN a AND b`", "**Inclusive** of both ends", "`amount BETWEEN 10 AND 50`"],
     ["`IN (...)`", "Matches any value in a list", "`city IN ('London', 'Mumbai')`"],
     ["`LIKE`", "Text pattern matching", "`email LIKE '%@gmail.com'`"],
     ["`IS NULL`", "**The only way to test for missing**", "`shipped_at IS NULL`"]
    ] } },

  { h: "Combining conditions" },
  { code: { lang: "sql",
    lines: [
     { c: "WHERE city = 'London' AND amount > 100", w: "**Both must be true.**" },
     { c: "WHERE city = 'London' OR city = 'Mumbai'", w: "**Either.**" },
     { c: "WHERE NOT status = 'refunded'", w: "**Negation.** `status <> 'refunded'` reads better and is more common." },
     { c: "", w: "" },
     { c: "WHERE (city = 'London' OR city = 'Mumbai')", w: "" },
     { c: "  AND amount > 100;", w: "**Brackets around the OR.** Without them this means something quite different — see below.", hi: true }
    ] } },
  { trap: "**`AND` binds tighter than `OR`.** So `WHERE city = 'London' OR city = 'Mumbai' AND amount > 100` is read as `London OR (Mumbai AND amount > 100)` — which returns *every* London customer regardless of amount, plus the big Mumbai ones. It runs, returns plausible rows, and is wrong. **Bracket every mixed condition**, even when you are sure; it costs two characters and removes the whole class of bug." },

  { h: "IN — instead of a chain of ORs" },
  { code: { lang: "sql",
    lines: [
     { c: "WHERE city IN ('London', 'Mumbai', 'Tokyo', 'Lima');", w: "**Far clearer than four ORs**, and the database treats it the same way." },
     { c: "WHERE status NOT IN ('refunded', 'cancelled');", w: "The negation." },
     { c: "", w: "" },
     { c: "WHERE customer_id IN (", w: "**A subquery can supply the list.**" },
     { c: "    SELECT id FROM customers WHERE city = 'London'", w: "**Every customer in London**, and then the outer query filters to their orders. This is the gateway to the joins module." },
     { c: ");", w: "" }
    ] } },
  { trap: "**`NOT IN` with a list that contains `NULL` returns no rows at all.** `x NOT IN (1, 2, NULL)` asks *is x different from 1, and from 2, and from NULL* — and the comparison against NULL is unknown, so the whole thing is never true. This bites hardest with a subquery whose column allows NULLs. Use `NOT EXISTS` instead, or add `WHERE col IS NOT NULL` to the subquery." },

  { h: "BETWEEN" },
  { code: { lang: "sql",
    lines: [
     { c: "WHERE amount BETWEEN 10 AND 50;", w: "**Inclusive at both ends** — the same as `amount >= 10 AND amount <= 50`." },
     { c: "", w: "" },
     { c: "WHERE order_date BETWEEN '2026-01-01' AND '2026-01-31';", w: "**Careful with dates.** If `order_date` is a timestamp, this ends at midnight on the 31st and silently excludes everything that happened during that day.", hi: true },
     { c: "", w: "" },
     { c: "WHERE order_date >= '2026-01-01'", w: "**The reliable pattern for date ranges:** inclusive start..." },
     { c: "  AND order_date <  '2026-02-01';", w: "**...exclusive end.** Catches every moment in January regardless of whether the column stores a time, and it needs no adjustment for month lengths." }
    ] } },

  { h: "LIKE — pattern matching" },
  { code: { lang: "sql",
    lines: [
     { c: "WHERE email LIKE '%@gmail.com'", w: "**`%` matches any number of characters, including none.** Ends with gmail." },
     { c: "WHERE name LIKE 'A%'", w: "Starts with A." },
     { c: "WHERE name LIKE '%ada%'", w: "**Contains.** Note this cannot use an index — a leading `%` forces a full scan of the table." },
     { c: "WHERE code LIKE 'A_C'", w: "**`_` matches exactly one character.** `ABC` matches, `AC` and `ABBC` do not." },
     { c: "", w: "" },
     { c: "WHERE name ILIKE 'ada%'", w: "**Case-insensitive, on Postgres.** Elsewhere: `WHERE LOWER(name) LIKE 'ada%'` — which also defeats an index unless one was built on `LOWER(name)`." },
     { c: "", w: "" },
     { c: "WHERE path LIKE '100!%%' ESCAPE '!';", w: "**Matching a literal `%`** — declare an escape character and prefix it." }
    ] } },
  { n: "`LIKE '%text%'` on a large table is one of the most common causes of a slow query, because the database cannot use an index and must examine every row. For real text search, engines offer full-text indexes — Postgres `tsvector`, MySQL `FULLTEXT` — which are built for the job and orders of magnitude faster.",
    nt: "Why a leading % is expensive" },

  { h: "Filtering on a computed value" },
  { code: { lang: "sql",
    lines: [
     { c: "WHERE price * quantity > 100;", w: "**Fine** — expressions are allowed in `WHERE`. Just not aliases, for the reason from the ordering lesson." },
     { c: "", w: "" },
     { c: "WHERE YEAR(order_date) = 2026;", w: "**Works, but slow.** Wrapping the column in a function stops the database using an index on it — every row must be computed and tested. This is called a *non-sargable* predicate.", hi: true },
     { c: "", w: "" },
     { c: "WHERE order_date >= '2026-01-01'", w: "**The fast equivalent:** compare the bare column against a range." },
     { c: "  AND order_date <  '2027-01-01';", w: "**Identical results, and an index can be used.** Worth internalising — it is the single most common accidental performance mistake in SQL." }
    ] } },

  { h: "A realistic filter" },
  { code: { lang: "sql", t: "Everything so far, together",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    order_id,", w: "" },
     { c: "    customer_id,", w: "" },
     { c: "    amount,", w: "" },
     { c: "    order_date", w: "" },
     { c: "FROM orders", w: "" },
     { c: "WHERE order_date >= '2026-01-01'", w: "**Sargable date range**, so the index works." },
     { c: "  AND order_date <  '2026-04-01'", w: "" },
     { c: "  AND status NOT IN ('cancelled', 'refunded')", w: "" },
     { c: "  AND amount > 50", w: "" },
     { c: "  AND shipped_at IS NOT NULL", w: "**Not `<> NULL`** — that never matches anything. The next lesson explains why." },
     { c: "ORDER BY amount DESC", w: "" },
     { c: "LIMIT 20;", w: "" }
    ],
    after: "Read it top to bottom and it is a sentence: *the twenty largest non-cancelled, shipped orders over £50 from the first quarter*. That readability is the whole value of a declarative language." } },

  { tryit: { t: "Translate three questions",
    task: "Write the SQL for: (a) customers in London or Mumbai who have spent over 500; (b) orders from last month that have not yet shipped; (c) products whose name contains 'pro', case-insensitively.",
    hint: "(a) needs brackets. (b) needs `IS NULL` and a half-open date range. (c) needs `LOWER` or `ILIKE`.",
    sol: { lang: "sql", code: "-- (a)\nSELECT * FROM customers\nWHERE (city = 'London' OR city = 'Mumbai')\n  AND total_spent > 500;\n\n-- (b)\nSELECT * FROM orders\nWHERE order_date >= '2026-07-01'\n  AND order_date <  '2026-08-01'\n  AND shipped_at IS NULL;\n\n-- (c)\nSELECT * FROM products\nWHERE LOWER(name) LIKE '%pro%';" },
    w: "In (a), drop the brackets and re-run it against real data. You will get more rows and no error — which is exactly what makes this class of bug dangerous. A wrong number that looks reasonable is far worse than a crash." } }
 ],
 k: [
  "`AND` binds tighter than `OR` — bracket every mixed condition, always.",
  "`NOT IN` with a NULL anywhere in the list returns nothing; use `NOT EXISTS` or exclude NULLs first.",
  "For date ranges use `>= start AND < next_start`, not `BETWEEN` — it handles timestamps correctly.",
  "Wrapping a column in a function (`YEAR(date) = 2026`) defeats its index; compare the bare column to a range."
 ],
 r: ["SQL", "DQL", "Query Plan", "Index", "Full Table Scan"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "WHERE city = 'London' AND amount > 100", w: "keep rows matching two conditions" },
   { c: "WHERE (city = 'London' OR city = 'Mumbai') AND amount > 100", w: "combine an either-or with an and", hint: "brackets" },
   { c: "WHERE city IN ('London', 'Mumbai', 'Tokyo');", w: "match any value from a list" },
   { c: "WHERE order_date >= '2026-01-01' AND order_date < '2026-02-01'", w: "a date range that handles timestamps correctly" },
   { c: "WHERE email LIKE '%@gmail.com'", w: "match a text pattern at the end of a value" },
   { c: "WHERE shipped_at IS NULL", w: "find rows where a value was never recorded" }
  ]
 }
},

{
 t: "NULL, Sorting and Three-Valued Logic",
 m: "filter",
 lvl: "core",
 s: "The value that is not a value, and why it breaks the rules you expect.",
 goal: [
  "Explain why `= NULL` never matches",
  "Handle NULLs deliberately with COALESCE and IS NULL",
  "Sort results, including deciding where the NULLs go"
 ],
 b: [
  { p: "`NULL` causes more wrong answers than any other single feature of SQL. It is not a bug — it follows consistently from what NULL means — but the consequences are genuinely counterintuitive." },

  { h: "What NULL means" },
  { p: "**`NULL` is not zero. It is not an empty string. It means *no value was recorded*** — and crucially, that is different from *the value is nothing*." },
  { l: [
   "A customer with `phone = NULL` has no phone number **on file**. They may well have a phone.",
   "A product with `discount = 0` has a discount, and it is zero.",
   "A product with `discount = NULL` has no discount recorded, which might mean none applies or might mean nobody entered it."
  ] },
  { ana: "NULL is not an empty box. It is a box you have not been allowed to open. You cannot say whether its contents equal five, because you do not know what is in it — and *unknown* is a third answer, alongside true and false.",
    at: "The unopened box" },

  { h: "Three-valued logic" },
  { p: "Because NULL means unknown, any comparison with it produces **unknown**, not false." },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT NULL = NULL;", w: "**Not `true`.** Two unknowns might be different values — the database cannot say. Returns NULL." },
     { c: "SELECT NULL = 5;", w: "NULL." },
     { c: "SELECT NULL <> 5;", w: "**Also NULL.** Neither equal nor unequal; simply unknown." },
     { c: "SELECT NULL + 100;", w: "**NULL.** Arithmetic propagates it — one missing value poisons the calculation." },
     { c: "SELECT 'Ada' || NULL;", w: "**NULL**, which is how a concatenated name silently becomes blank.", hi: true },
     { c: "", w: "" },
     { c: "SELECT NULL IS NULL;", w: "**`true`.** `IS NULL` is a different operator, and it is the only one that can test for it." }
    ] } },
  { code: { lang: "text", t: "Why the WHERE clause discards them",
    lines: [
     { c: "WHERE keeps a row only when the condition is TRUE.", w: "" },
     { c: "UNKNOWN is not TRUE, so the row is discarded.", w: "**That is the whole mechanism**, and it explains the result below.", hi: true },
     { c: "", w: "" },
     { c: "status:  'active'  'cancelled'  NULL", w: "" },
     { c: "", w: "" },
     { c: "WHERE status = 'cancelled'    -> row 2 only", w: "" },
     { c: "WHERE status <> 'cancelled'   -> row 1 only", w: "**Not rows 1 and 3.** The NULL row is excluded by *both* filters, which is the surprise. Together they do not cover the table." },
     { c: "WHERE status IS NULL          -> row 3", w: "" }
    ] } },
  { trap: "This is a real source of wrong reports. *Orders that are not cancelled* written as `status <> 'cancelled'` silently drops every order whose status was never set. If NULL should count, say so: `WHERE status <> 'cancelled' OR status IS NULL`, or `WHERE COALESCE(status, '') <> 'cancelled'`." },

  { h: "Handling NULLs deliberately" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT COALESCE(phone, 'no phone on file') AS phone", w: "**`COALESCE` returns the first non-NULL argument.** The standard way to supply a fallback.", hi: true },
     { c: "FROM customers;", w: "" },
     { c: "", w: "" },
     { c: "SELECT COALESCE(mobile, landline, work_phone, 'none') AS contact", w: "**Any number of arguments** — the first one that has a value wins. Genuinely elegant." },
     { c: "FROM customers;", w: "" },
     { c: "", w: "" },
     { c: "SELECT COALESCE(discount, 0) * price AS saving", w: "**Fill before arithmetic**, or the whole calculation becomes NULL." },
     { c: "FROM products;", w: "" },
     { c: "", w: "" },
     { c: "SELECT NULLIF(total, 0) AS safe_total", w: "**The inverse: turns a given value into NULL.** `amount / NULLIF(total, 0)` avoids a divide-by-zero error by producing NULL instead — a neat trick worth knowing." },
     { c: "FROM reports;", w: "" }
    ] } },
  { n: "Filling NULLs is a decision about your data, exactly as it was in the pandas lesson. `COALESCE(discount, 0)` claims that no recorded discount means no discount — usually right. `COALESCE(rating, 0)` claims an unrated product is the worst possible, which is almost certainly wrong and will quietly drag every average down.",
    nt: "COALESCE is a claim, not a neutral act" },

  { h: "Aggregates and NULL" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT COUNT(*) FROM customers;", w: "**Every row**, NULLs included. `*` counts rows, not values." },
     { c: "SELECT COUNT(phone) FROM customers;", w: "**Only the rows where `phone` is not NULL.** The difference between these two is how you count missing values.", hi: true },
     { c: "SELECT COUNT(*) - COUNT(phone) AS missing FROM customers;", w: "How many are missing, in one line." },
     { c: "", w: "" },
     { c: "SELECT AVG(rating) FROM products;", w: "**Aggregates skip NULLs rather than propagating them.** The average is over the products that *have* a rating — which is usually what you want, and is worth knowing rather than assuming." }
    ] } },

  { h: "ORDER BY" },
  { code: { lang: "sql",
    lines: [
     { c: "ORDER BY amount;", w: "**Ascending is the default.** `ASC` is optional and rarely written." },
     { c: "ORDER BY amount DESC;", w: "**Descending** — what you want for a leaderboard, and you must ask for it." },
     { c: "", w: "" },
     { c: "ORDER BY city ASC, amount DESC;", w: "**Several keys, each with its own direction.** City alphabetically, then within each city the largest amounts first." },
     { c: "", w: "" },
     { c: "ORDER BY total DESC;", w: "**An alias works here**, because `ORDER BY` runs after `SELECT`." },
     { c: "ORDER BY 2 DESC;", w: "**By column position.** Concise, and fragile — inserting a column silently changes the sort. Avoid in anything you keep." },
     { c: "", w: "" },
     { c: "ORDER BY amount DESC NULLS LAST;", w: "**Where the NULLs go.** Postgres and Oracle support this directly; the defaults differ by engine, so saying it explicitly is the only portable way to be sure.", hi: true },
     { c: "ORDER BY (amount IS NULL), amount DESC;", w: "**The portable trick** — sort by the boolean first, which puts false (has a value) before true." }
    ] } },
  { code: { lang: "sql", t: "CASE — conditional logic in a query",
    lines: [
     { c: "SELECT name,", w: "" },
     { c: "    CASE", w: "**SQL's if/else.** Works in `SELECT`, `WHERE`, `ORDER BY` and `GROUP BY`." },
     { c: "        WHEN amount >= 1000 THEN 'large'", w: "**Evaluated top to bottom; the first match wins.**" },
     { c: "        WHEN amount >= 100  THEN 'medium'", w: "" },
     { c: "        WHEN amount IS NULL THEN 'unknown'", w: "**Handle NULL explicitly** — it will not match any comparison above." },
     { c: "        ELSE 'small'", w: "**Without `ELSE`, unmatched rows get NULL**, which is a common accidental source of them." },
     { c: "    END AS size_band", w: "**`END` closes it, then the alias.**" },
     { c: "FROM orders;", w: "" }
    ] } },

  { tryit: { t: "Find what the filters missed",
    task: "On a table with a nullable column, write three queries: rows where it equals a value, rows where it does not, and rows where it is missing. Confirm the three counts add up to the total — and that the first two alone do not.",
    hint: "`COUNT(*)` on each, and compare against `SELECT COUNT(*) FROM the_table`.",
    sol: { lang: "sql", code: "SELECT COUNT(*) AS total FROM orders;\n\nSELECT COUNT(*) FROM orders WHERE status = 'cancelled';\nSELECT COUNT(*) FROM orders WHERE status <> 'cancelled';\nSELECT COUNT(*) FROM orders WHERE status IS NULL;\n\n-- all three bands at once, which makes the gap obvious:\nSELECT\n    CASE\n        WHEN status IS NULL       THEN 'missing'\n        WHEN status = 'cancelled' THEN 'cancelled'\n        ELSE 'other'\n    END AS band,\n    COUNT(*)\nFROM orders\nGROUP BY band;" },
    w: "The `CASE` version is the one to keep as a habit. Banding a column and counting each band shows you the whole distribution — including the missing rows — in one query, instead of three that you then have to reconcile by hand." } }
 ],
 k: [
  "NULL means *unknown*, so every comparison with it yields unknown — and `WHERE` keeps only rows that are true.",
  "`status <> 'x'` silently excludes NULL rows; `= 'x'` and `<> 'x'` together do not cover the table.",
  "`COALESCE(col, fallback)` supplies a default; `NULLIF(a, b)` creates one — useful against divide-by-zero.",
  "`COUNT(*)` counts rows, `COUNT(col)` counts non-NULL values; the difference is your missing count."
 ],
 r: ["NULL", "SQL", "Boolean", "Data Quality", "Aggregate Function"],
 drill: {
  lang: "sql",
  reps: 4,
  items: [
   { c: "WHERE shipped_at IS NULL", w: "find rows with no value recorded", hint: "not = NULL" },
   { c: "SELECT COALESCE(phone, 'no phone on file') AS phone FROM customers;", w: "supply a fallback when a value is missing" },
   { c: "SELECT COUNT(*) - COUNT(phone) AS missing FROM customers;", w: "count how many rows are missing a value" },
   { c: "ORDER BY city ASC, amount DESC;", w: "sort by two keys in opposite directions" },
   { c: "ORDER BY amount DESC NULLS LAST;", w: "sort highest first and push the missing values to the end" },
   { c: "CASE WHEN amount >= 1000 THEN 'large' ELSE 'small' END AS size_band", w: "band a value into labelled categories" }
  ]
 }
}

]);
