/* SQL — asking your first questions. */
TD.addLessons("sql", [

{
 t: "SELECT — Your First Query",
 m: "select",
 lvl: "core",
 s: "Two words that answer most questions, and the expressions you can build into them.",
 goal: [
  "Select specific columns and rename them",
  "Compute new columns from existing ones",
  "Remove duplicates and control how many rows come back"
 ],
 b: [
  { p: "Every query starts here. `SELECT` says what you want; `FROM` says where it lives." },

  { syn: { t: "The smallest useful query",
    parts: [
     { p: "SELECT", w: "**The keyword that starts almost every query.** It means *give me back these columns*." },
     { p: " " },
     { p: "name, email", w: "**A comma-separated list of columns.** They come back in the order you name them, not the order they sit in the table." },
     { p: " " },
     { p: "FROM", w: "**Where to get them from.**" },
     { p: " " },
     { p: "customers", w: "**The table name.**" },
     { p: ";", w: "**Ends the statement.** Required when sending several at once; most tools tolerate its absence for a single query." }
    ],
    after: "Two clauses. Every query in this track is this shape with more bolted on." } },

  { code: { lang: "sql",
    lines: [
     { c: "SELECT * FROM customers;", w: "**`*` means every column.** Fine while exploring; **avoid it in code you keep** — it breaks when someone adds a column, drags data you do not need across the network, and hides what the query actually depends on.", hi: true },
     { c: "", w: "" },
     { c: "SELECT name, city FROM customers;", w: "**Name what you want.** Faster, clearer, and stable when the table changes." },
     { c: "", w: "" },
     { c: "SELECT city, name FROM customers;", w: "Order is yours to choose." },
     { c: "", w: "" },
     { c: "SELECT 2 + 2;", w: "**`FROM` is optional on most engines.** Handy for testing an expression or a function without involving a table." }
    ] } },

  { h: "Aliases" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT name AS customer_name, city AS location", w: "**`AS` renames a column in the output.** The stored column is untouched — this only affects what comes back." },
     { c: "FROM customers;", w: "" },
     { c: "", w: "" },
     { c: "SELECT name customer_name FROM customers;", w: "**`AS` is optional.** It is also much clearer, so write it. Omitting it makes a missing comma look like an alias, which is a genuinely confusing bug." },
     { c: "", w: "" },
     { c: "SELECT name AS \"Customer Name\" FROM customers;", w: "**Double quotes allow spaces and capitals.** Note that in standard SQL, double quotes are for *identifiers* and single quotes for *text values* — mixing them up is a very common first-week error." }
    ] } },
  { trap: "`'Ada'` is the string Ada. `\"Ada\"` is a column *named* Ada, and if no such column exists you get an error. MySQL is lenient about this and lets double quotes work as strings, which teaches a habit that then breaks on Postgres. **Single quotes for values, always.**" },

  { h: "Computed columns" },
  { p: "A `SELECT` list is not limited to stored columns. Anything you can compute per row belongs here." },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    product,", w: "" },
     { c: "    price,", w: "" },
     { c: "    quantity,", w: "" },
     { c: "    price * quantity AS line_total,", w: "**Arithmetic.** `+ - * /` all work, with the usual precedence." },
     { c: "    ROUND(price * 0.2, 2) AS vat,", w: "**Functions.** `ROUND(value, decimals)`." },
     { c: "    UPPER(product) AS shouty,", w: "`UPPER`, `LOWER`, `TRIM`, `LENGTH` — the everyday string functions." },
     { c: "    price * quantity * 1.2 AS with_vat", w: "**Every expression needs its own alias**, or you get a column named after the expression, which differs by engine and is unpleasant to reference." },
     { c: "FROM order_items;", w: "" }
    ],
    out: "product   price  quantity  line_total  vat    shouty    with_vat\nWidget    9.99   3         29.97       2.00   WIDGET    35.96\nGadget    24.50  1         24.50       4.90   GADGET    29.40" } },

  { h: "Concatenating text" },
  { code: { lang: "sql", t: "The one thing every dialect spells differently",
    lines: [
     { c: "SELECT first_name || ' ' || last_name AS full_name", w: "**`||` is the SQL standard** — Postgres, SQLite, Oracle." },
     { c: "FROM customers;", w: "" },
     { c: "", w: "" },
     { c: "SELECT CONCAT(first_name, ' ', last_name) AS full_name", w: "**`CONCAT` works on MySQL, SQL Server and Postgres** — the most portable choice in practice." },
     { c: "FROM customers;", w: "" },
     { c: "", w: "" },
     { c: "SELECT CONCAT_WS(' ', first_name, middle_name, last_name)", w: "**Concatenate with a separator, skipping NULLs.** The one you actually want for names, because a missing middle name should not produce a double space — or, with `||`, wipe out the entire result." }
    ] } },
  { trap: "**`NULL` propagates through concatenation.** `'Ada' || NULL || 'Lovelace'` is `NULL`, not `'AdaLovelace'` — one missing field silently blanks the whole column. `CONCAT` treats NULL as empty on most engines, and `CONCAT_WS` skips it entirely. This surprises people the first time a report has empty names in it." },

  { h: "DISTINCT" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT DISTINCT city FROM customers;", w: "**Each distinct value once.** The quickest way to see what is actually in a column — and to discover that `London`, `london` and `London ` are three different cities as far as the database is concerned.", hi: true },
     { c: "", w: "" },
     { c: "SELECT DISTINCT city, country FROM customers;", w: "**Distinct *combinations*, not each column separately.** A common misreading." },
     { c: "", w: "" },
     { c: "SELECT COUNT(DISTINCT city) FROM customers;", w: "How many distinct values there are." }
    ] } },
  { n: "`DISTINCT` is not free — the database must sort or hash every row to find duplicates. On a large table it is one of the more expensive things you can ask for. Frequently, `DISTINCT` in a query is a symptom of a join that duplicated rows, and the right fix is the join rather than papering over it. That is the joins module.",
    nt: "DISTINCT is often a symptom" },

  { h: "LIMIT" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT * FROM orders LIMIT 10;", w: "**Ten rows.** Postgres, MySQL, SQLite. **Always do this while exploring an unfamiliar table** — otherwise you fetch ten million rows to look at the first few." },
     { c: "", w: "" },
     { c: "SELECT * FROM orders ORDER BY amount DESC LIMIT 10;", w: "**The top ten by value.** `LIMIT` without `ORDER BY` returns an arbitrary ten — not the first ten, not a random ten, just whatever the engine produced first. That arbitrariness can change between runs." },
     { c: "", w: "" },
     { c: "SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 20;", w: "**Skip 20, take 10** — page three. Note that deep offsets are slow, because the database still has to produce and discard all the skipped rows." },
     { c: "", w: "" },
     { c: "SELECT TOP 10 * FROM orders;", w: "**SQL Server's spelling.** Oracle uses `FETCH FIRST 10 ROWS ONLY`, which is also the ANSI standard and works on modern Postgres." }
    ] } },

  { h: "Comments" },
  { code: { lang: "sql",
    lines: [
     { c: "-- Excludes refunds; see ticket 412 for why", w: "**A line comment.** Explain the *why* — a reader can see the what." },
     { c: "SELECT product, SUM(amount) AS revenue", w: "" },
     { c: "FROM sales", w: "" },
     { c: "/* a block comment,", w: "" },
     { c: "   spanning lines */", w: "Useful for temporarily disabling part of a query while debugging." },
     { c: "WHERE status <> 'refunded';", w: "" }
    ] } },

  { tryit: { t: "Explore a table you have never seen",
    task: "On any table: list its distinct values for one text column, produce a computed column combining two others, and return the ten rows with the largest value of some numeric column — with every output column sensibly named.",
    hint: "`SELECT *  ... LIMIT 5` first to see what columns exist. Then `DISTINCT`, then the computed column, then `ORDER BY ... DESC LIMIT 10`.",
    sol: { lang: "sql", code: "-- what am I looking at?\nSELECT * FROM order_items LIMIT 5;\n\n-- what values does this column take?\nSELECT DISTINCT status FROM order_items;\n\n-- the ten biggest lines, with a computed total\nSELECT\n    product,\n    quantity,\n    price,\n    ROUND(price * quantity, 2) AS line_total\nFROM order_items\nORDER BY line_total DESC\nLIMIT 10;" },
    w: "`SELECT * ... LIMIT 5` is the SQL equivalent of `df.head()`, and it should be the first thing you run against any unfamiliar table. `SELECT DISTINCT` on each text column is the equivalent of `value_counts()` — between them they tell you most of what you need before writing a real query." } }
 ],
 k: [
  "Name your columns rather than using `SELECT *` in anything you keep — it survives schema changes and says what you depend on.",
  "Single quotes are for text values, double quotes for identifiers. Mixing them is a first-week classic.",
  "`||` is standard concatenation but `CONCAT`/`CONCAT_WS` handle NULLs sanely — one NULL blanks a `||` chain entirely.",
  "`LIMIT` without `ORDER BY` gives an arbitrary set of rows, not the first ones."
 ],
 r: ["SQL", "DQL", "Relational Database", "NULL"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "SELECT name, city FROM customers;", w: "get two named columns from a table" },
   { c: "SELECT price * quantity AS line_total FROM order_items;", w: "compute a new column and name it" },
   { c: "SELECT DISTINCT city FROM customers;", w: "list each value of a column once" },
   { c: "SELECT * FROM orders ORDER BY amount DESC LIMIT 10;", w: "the ten highest-value rows", hint: "limit alone is not enough" },
   { c: "SELECT CONCAT_WS(' ', first_name, last_name) AS full_name FROM customers;", w: "join text columns with a separator, skipping missing ones" }
  ]
 }
}

]);
