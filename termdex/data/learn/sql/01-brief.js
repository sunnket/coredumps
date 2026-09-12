/* SQL — what a database actually is. */
TD.addLessons("sql", [

{
 t: "Tables, Rows and Why Declarative Wins",
 m: "brief",
 lvl: "core",
 s: "The shape of the data, and the idea that made SQL outlive everything around it.",
 goal: [
  "Describe a table in the vocabulary the rest of the track uses",
  "Explain what declarative means and why it matters here",
  "Say what a database gives you that a pile of files does not"
 ],
 b: [
  { p: "SQL is fifty years old, was declared obsolete at least four times, and is still the most requested skill in data work. This lesson is why — and it is not nostalgia. It is one genuinely good idea that nothing has improved on." },

  { h: "The shape of everything" },
  { p: "A **relational database** holds **tables**. A table has named **columns**, each with a type, and any number of **rows**." },
  { code: { lang: "text", t: "One table, with the vocabulary labelled",
    lines: [
     { c: "  customers", w: "**The table.** Plural noun, by near-universal convention." },
     { c: "  +--------+------------+---------------------+---------+", w: "" },
     { c: "  | id     | name       | email               | city    |", w: "**Columns** — also called fields or attributes. Each has a fixed type." },
     { c: "  +--------+------------+---------------------+---------+", w: "" },
     { c: "  | 1      | Ada        | ada@example.com     | London  |", w: "**A row** — also a record or a tuple. One customer." },
     { c: "  | 2      | Priya      | priya@example.com   | Mumbai  |", w: "" },
     { c: "  | 3      | Kenji      | kenji@example.com   | NULL    |", w: "**`NULL` means *no value recorded*.** Not zero, not empty text — genuinely absent. It has its own rules and its own lesson." },
     { c: "  +--------+------------+---------------------+---------+", w: "" },
     { c: "    ^", w: "" },
     { c: "    the primary key: a column whose value uniquely identifies a row", w: "**Every table should have one.** It is how other tables refer to this one.", hi: true }
    ] } },
  { tbl: { t: "The same concepts, in the words different people use",
    h: ["Database", "Spreadsheet", "pandas", "Programming"],
    rows: [
     ["Table", "Sheet", "DataFrame", "Class / collection"],
     ["Row", "Row", "Row", "Object / record"],
     ["Column", "Column", "Series", "Field / attribute"],
     ["Primary key", "*(a column you keep unique by hand)*", "Index", "Object identity"],
     ["Schema", "The header row and the formatting", "dtypes", "Type definition"]
    ] } },

  { h: "The idea: describe the answer, not the steps" },
  { p: "This is the whole reason SQL survived, and it is worth seeing directly." },
  { vs: { t: "Total sales per region, both ways",
    bad: { c: "totals = {}\nfor sale in all_sales:\n    if sale.amount > 100:\n        r = sale.region\n        totals[r] = totals.get(r, 0) + sale.amount\n\nfor region in sorted(totals,\n        key=totals.get, reverse=True):\n    print(region, totals[region])", lang: "python", label: "Imperative — you write the strategy",
      w: "**You decided everything**: to loop once, in this order, filtering as you go, accumulating in a dictionary. If the data grows to a billion rows, this code still does exactly that, on one core, in that order." },
    good: { c: "SELECT region, SUM(amount) AS total\nFROM sales\nWHERE amount > 100\nGROUP BY region\nORDER BY total DESC;", lang: "sql", label: "Declarative — you describe the result",
      w: "**You specified nothing about how.** The database decides: which index to use, whether to filter before or after grouping, whether to sort in memory or spill to disk, whether to use eight cores or one." } } },
  { p: "That inversion is the entire point. Because you never wrote the strategy, the database is free to change it — and it does, every time, based on how big the table currently is and what indexes exist." },
  { ana: "Imperative code is giving someone driving directions turn by turn. Declarative is giving them the address. The second survives roadworks, and it gets better every time the map is updated — without you rewriting anything.",
    at: "Directions versus an address" },
  { n: "This is why the same query keeps working when a table grows from a thousand rows to a billion. It is also why *why is my query slow* is answered by looking at what the database chose to do — the query plan — rather than by reading your own code. The last module of this track is about reading that.",
    nt: "Why the query survives the data growing" },

  { h: "Where it came from" },
  { p: "Before 1970, retrieving data meant writing code that followed physical pointers between records on disk. Change how the data was stored and every program that read it broke." },
  { p: "**Edgar Codd**, at IBM, proposed separating the logical question entirely from the physical storage: describe data as relations, query them mathematically, and let the system work out the access path. Chamberlin and Boyce built a usable language on top of it, originally called SEQUEL — which is why many people still pronounce it *sequel* rather than spelling out the letters. Both are correct and nobody will mind." },
  { p: "The relational model has since outlasted object databases, XML databases, the NoSQL movement and the big-data era. In each case the challenger eventually grew a SQL interface, because it turned out people wanted to ask questions more than they wanted new syntax." },

  { h: "What a database gives you that files do not" },
  { l: [
   "**Concurrency.** A thousand people reading and writing at once, without corrupting anything. Two processes writing the same CSV destroys it.",
   "**Transactions.** Several changes that either all happen or none do — the property that stops money vanishing between two accounts. This is **ACID**, and it has its own lesson.",
   "**Constraints.** The database refuses to store an order for a customer that does not exist, or two users with the same email. The rules live with the data rather than in every application that touches it.",
   "**Indexes.** Finding one row in fifty million without reading fifty million rows.",
   "**A single source of truth.** Six applications, one copy of the data, one definition of what a customer is."
  ] },
  { dg: "acid" },

  { h: "The dialects" },
  { p: "The core of SQL is standardised and portable. Once you leave the core, engines differ — and knowing which is which saves confusion." },
  { tbl: { h: ["Engine", "Where you meet it", "Worth knowing"],
    rows: [
     ["**SQLite**", "Phones, browsers, one-file databases, this track's exercises", "Zero setup — a database is a file. Astonishingly widely deployed"],
     ["**PostgreSQL**", "The default choice for new applications", "Strict, feature-rich, excellent. **Learn this one if you learn one**"],
     ["**MySQL / MariaDB**", "Enormous amounts of existing web software", "Ubiquitous, historically more permissive about bad data"],
     ["**SQL Server / Oracle**", "Large enterprises", "Powerful, licensed, dialects that diverge more than most"],
     ["**BigQuery / Snowflake / Redshift**", "Analytics at warehouse scale", "Distributed columnar engines whose entire interface is SQL"],
     ["**DuckDB**", "Analytics on your own laptop", "In-process, queries Parquet directly. The Python track's last module"]
    ] } },
  { n: "Everything in this track is standard SQL and works essentially unchanged on all of them. Where a dialect genuinely differs — string concatenation, date functions, `LIMIT` versus `TOP` — the lesson says so.",
    nt: "What is portable" },

  { h: "Getting a database to practise on" },
  { code: { lang: "bash",
    lines: [
     { c: "sqlite3 practice.db", w: "**The lowest-friction option by far.** SQLite ships with macOS and most Linux distributions; on Windows, download one file. The database *is* the file." },
     { c: "", w: "" },
     { c: "# inside sqlite3:", w: "" },
     { c: ".mode box", w: "**Print results as a proper table** rather than pipe-separated text. Makes everything below readable." },
     { c: ".headers on", w: "Show column names." },
     { c: ".tables", w: "List the tables. `.schema customers` shows one table's definition." },
     { c: ".quit", w: "" }
    ],
    after: "Alternatives with no install at all: **sqliteonline.com**, **db-fiddle.com**, or DuckDB in a Python notebook. Any of them is enough for this entire track." } },

  { tryit: { t: "Get a database in front of you",
    task: "Install SQLite or open a browser SQL sandbox. Create a `customers` table with the four columns from this lesson, insert three rows, and select all of them back. Do not worry about understanding the syntax yet — the point is to have somewhere to run things.",
    hint: "The next lesson explains every word of this. Right now, just get output on the screen.",
    sol: { lang: "sql", code: "CREATE TABLE customers (\n    id      INTEGER PRIMARY KEY,\n    name    TEXT NOT NULL,\n    email   TEXT UNIQUE,\n    city    TEXT\n);\n\nINSERT INTO customers (name, email, city) VALUES\n    ('Ada',   'ada@example.com',   'London'),\n    ('Priya', 'priya@example.com', 'Mumbai'),\n    ('Kenji', 'kenji@example.com', NULL);\n\nSELECT * FROM customers;" },
    w: "Note that `id` was never supplied and the rows still have one. `INTEGER PRIMARY KEY` in SQLite auto-assigns; Postgres spells it `SERIAL` or `GENERATED AS IDENTITY`. Letting the database assign identifiers is almost always right — it guarantees uniqueness under concurrency in a way your application cannot." } }
 ],
 k: [
  "A table has typed columns and rows; a primary key uniquely identifies a row and is how other tables refer to it.",
  "SQL is **declarative** — you describe the result and the database chooses the strategy, which is why queries survive the data growing.",
  "A database adds concurrency, transactions, constraints and indexes over what files can do.",
  "The core is portable across every engine; dialects differ mainly in dates, string functions and row limiting."
 ],
 r: ["SQL", "Relational Database", "Primary Key", "ACID", "Schema", "NULL"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "SELECT * FROM customers;", w: "get every column of every row in a table" },
   { c: "SELECT region, SUM(amount) AS total FROM sales GROUP BY region;", w: "total a column for each value of another" }
  ]
 }
},

{
 t: "The Order a Database Really Reads Your Query",
 m: "brief",
 lvl: "core",
 s: "Six clauses, written in one order and executed in another — and every confusing error explained by that gap.",
 goal: [
  "Name the six main clauses and their written order",
  "State the logical execution order and why it differs",
  "Predict which errors come from the mismatch"
 ],
 b: [
  { p: "Learn this now, before writing queries, and a whole class of error stops being mysterious. It takes five minutes and it is the highest-leverage thing in the first half of this track." },

  { h: "The order you write" },
  { code: { lang: "sql", t: "Every clause has a fixed position",
    lines: [
     { c: "SELECT   region, SUM(amount) AS total", w: "**Which columns you want back.**" },
     { c: "FROM     sales", w: "**Which table.**" },
     { c: "WHERE    order_date >= '2026-01-01'", w: "**Which rows to keep** — filtering *before* grouping." },
     { c: "GROUP BY region", w: "**Collapse rows into one per group.**" },
     { c: "HAVING   SUM(amount) > 10000", w: "**Which groups to keep** — filtering *after* grouping." },
     { c: "ORDER BY total DESC", w: "**Sort the result.**" },
     { c: "LIMIT    10;", w: "**Return at most this many rows.**" }
    ],
    after: "Written out of this order, it is a syntax error. `WHERE` never comes before `FROM`, and `ORDER BY` is always near the end." } },

  { h: "The order it runs" },
  { p: "The database evaluates them in a completely different sequence, and this is where the surprises come from." },
  { code: { lang: "text", t: "Logical execution order",
    lines: [
     { c: "1. FROM      get the rows from the table", w: "" },
     { c: "2. WHERE     throw away rows that fail the condition", w: "**Row by row, before anything is grouped.**" },
     { c: "3. GROUP BY  collapse the survivors into groups", w: "" },
     { c: "4. HAVING    throw away whole groups that fail the condition", w: "**Groups, not rows.**" },
     { c: "5. SELECT    work out the output columns, apply aliases", w: "**Nearly last.** This one explains most of the confusion.", hi: true },
     { c: "6. ORDER BY  sort", w: "" },
     { c: "7. LIMIT     cut to n rows", w: "" }
    ] } },
  { ana: "A kitchen, not a menu. You fetch the ingredients (FROM), discard the bad ones (WHERE), sort them into bowls (GROUP BY), discard whole bowls that are wrong (HAVING), and only then plate the dish and write the label (SELECT). The label is written near the end — which is why nothing earlier can refer to it.",
    at: "The label goes on last" },

  { h: "The three errors this explains" },
  { code: { lang: "sql", t: "1 — an alias is not visible in WHERE",
    lines: [
     { c: "SELECT price * quantity AS total", w: "**`total` is created at step 5.**" },
     { c: "FROM order_items", w: "" },
     { c: "WHERE total > 100;", w: "**Fails.** `WHERE` runs at step 2, when `total` does not exist yet.", hi: true },
     { c: "", w: "" },
     { c: "-- repeat the expression instead:", w: "" },
     { c: "WHERE price * quantity > 100;", w: "**Works.** Slightly repetitive, and correct." },
     { c: "", w: "" },
     { c: "-- but ORDER BY *can* use it:", w: "" },
     { c: "ORDER BY total DESC;", w: "**Works**, because `ORDER BY` runs at step 6, after `SELECT`. That asymmetry is not arbitrary — it falls directly out of the order." }
    ] } },
  { code: { lang: "sql", t: "2 — WHERE and HAVING are not interchangeable",
    lines: [
     { c: "SELECT region, SUM(amount) AS total", w: "" },
     { c: "FROM sales", w: "" },
     { c: "WHERE SUM(amount) > 10000", w: "**Fails.** At step 2 there are no groups, so no sums exist. The error is usually *aggregate functions are not allowed in WHERE*.", hi: true },
     { c: "GROUP BY region;", w: "" },
     { c: "", w: "" },
     { c: "-- HAVING is the one that filters groups:", w: "" },
     { c: "GROUP BY region", w: "" },
     { c: "HAVING SUM(amount) > 10000;", w: "**Works**, because step 4 runs after step 3." }
    ] } },
  { code: { lang: "sql", t: "3 — a bare column with GROUP BY",
    lines: [
     { c: "SELECT region, customer_name, SUM(amount)", w: "" },
     { c: "FROM sales", w: "" },
     { c: "GROUP BY region;", w: "**Fails on any strict engine.** Each region-group contains many customers, so there is no single `customer_name` to print. The database refuses to pick one arbitrarily.", hi: true },
     { c: "", w: "" },
     { c: "-- either group by it too:", w: "" },
     { c: "GROUP BY region, customer_name;", w: "A different question — per region *and* customer." },
     { c: "-- or aggregate it:", w: "" },
     { c: "SELECT region, COUNT(DISTINCT customer_name), SUM(amount)", w: "**One value per group**, which is what the shape requires." }
    ] } },
  { trap: "MySQL and SQLite historically allow that third query and silently return an arbitrary customer name — a wrong answer with no error. Postgres rejects it. This is the clearest example of why a query that *works* on one engine is not necessarily *correct*, and why testing against the engine you deploy on matters." },

  { h: "The rule of thumb" },
  { l: [
   "**Filter rows → `WHERE`.** Runs before grouping, and can use indexes, so it is also faster.",
   "**Filter groups → `HAVING`.** Runs after grouping and can see aggregates.",
   "**When both would work, use `WHERE`** — filtering earlier means less data to group.",
   "**Aliases work in `ORDER BY`**, and in `GROUP BY` on most engines, but never in `WHERE`."
  ] },

  { h: "Writing readable SQL" },
  { code: { lang: "sql", t: "Conventions worth adopting on day one",
    lines: [
     { c: "SELECT c.name,", w: "**Keywords in capitals**, identifiers in lowercase. Not required by any engine; near-universal in practice, and it makes structure visible at a glance." },
     { c: "       COUNT(o.id) AS order_count", w: "**One column per line** once there are more than two or three." },
     { c: "FROM customers AS c", w: "**Short, meaningful aliases.** `c` and `o` beat `customers` repeated eleven times." },
     { c: "JOIN orders AS o ON o.customer_id = c.id", w: "" },
     { c: "WHERE c.city = 'London'", w: "**Each clause starts a new line.** A five-line query is readable; the same query on one line is not." },
     { c: "GROUP BY c.name", w: "" },
     { c: "HAVING COUNT(o.id) > 3", w: "" },
     { c: "ORDER BY order_count DESC", w: "" },
     { c: "LIMIT 10;", w: "**The semicolon ends the statement.** Required when sending several at once; most tools accept a single query without it." },
     { c: "", w: "" },
     { c: "-- two dashes start a comment", w: "**Comment the *why*, never the *what*.** `-- excludes refunds, see ticket 412` is worth writing." }
    ] } },

  { tryit: { t: "Predict before you run",
    task: "Without running them, decide whether each of these works and why: (a) `SELECT name AS n FROM customers WHERE n = 'Ada';` (b) `SELECT city, COUNT(*) AS c FROM customers GROUP BY city ORDER BY c DESC;` (c) `SELECT city, COUNT(*) FROM customers WHERE COUNT(*) > 2 GROUP BY city;` Then run them and check.",
    hint: "For each, ask at which numbered step the thing being referred to comes into existence.",
    sol: { lang: "sql", code: "-- (a) FAILS. The alias n is created at step 5 (SELECT);\n--     WHERE runs at step 2. Use: WHERE name = 'Ada'\n\n-- (b) WORKS. ORDER BY runs at step 6, after SELECT,\n--     so the alias c is available to it.\n\n-- (c) FAILS. COUNT(*) needs groups, which appear at step 3;\n--     WHERE runs at step 2. Use HAVING COUNT(*) > 2 instead:\nSELECT city, COUNT(*)\nFROM customers\nGROUP BY city\nHAVING COUNT(*) > 2;" },
    w: "Getting into the habit of asking *at which step does this exist* turns almost every SQL error message from a puzzle into a lookup. It is the same habit that makes the query-plan lesson at the end of this track easy." } }
 ],
 k: [
  "Written order is SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT — and it is fixed.",
  "Execution order is FROM, WHERE, GROUP BY, HAVING, **SELECT**, ORDER BY, LIMIT.",
  "Aliases are created in SELECT, so `WHERE` cannot see them but `ORDER BY` can.",
  "`WHERE` filters rows before grouping; `HAVING` filters groups after. Prefer `WHERE` when both would work."
 ],
 r: ["SQL", "DQL", "Aggregate Function", "Group By", "Query Plan"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "SELECT region, SUM(amount) AS total FROM sales WHERE amount > 100 GROUP BY region HAVING SUM(amount) > 10000 ORDER BY total DESC LIMIT 10;", w: "the full six-clause shape, in written order" },
   { c: "WHERE price * quantity > 100", w: "filter on a computed value without using its alias", hint: "the alias does not exist yet" },
   { c: "HAVING COUNT(*) > 2", w: "keep only the groups with more than two rows" }
  ]
 }
}

]);
