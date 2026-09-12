/* SQL — working across tables. */
TD.addLessons("sql", [

{
 t: "Keys and Why Data Lives in Several Tables",
 m: "join",
 lvl: "core",
 s: "The reason your data is split up, and the two kinds of key that hold it together.",
 goal: [
  "Explain why one big table is the wrong design",
  "Distinguish a primary key from a foreign key",
  "Read a schema and predict how its tables connect"
 ],
 b: [
  { p: "Before joining tables, it is worth understanding why they are apart. The answer is not tidiness — it is correctness." },

  { h: "The one-big-table problem" },
  { code: { lang: "text", t: "Everything in one place, which sounds convenient",
    lines: [
     { c: "  orders", w: "" },
     { c: "  +----+-----------+-------------------+---------+---------+--------+", w: "" },
     { c: "  | id | cust_name | cust_email        | city    | product | amount |", w: "" },
     { c: "  +----+-----------+-------------------+---------+---------+--------+", w: "" },
     { c: "  | 1  | Ada       | ada@example.com   | London  | Widget  | 29.97  |", w: "" },
     { c: "  | 2  | Ada       | ada@example.com   | London  | Gadget  | 24.50  |", w: "**Ada's details, repeated.**" },
     { c: "  | 3  | Ada       | ada@exmaple.com   | London  | Widget  | 29.97  |", w: "**And now mistyped on one row only.** Which is the real address? Nothing in the table can say.", hi: true },
     { c: "  | 4  | Priya     | priya@example.com | Mumbai  | Widget  | 29.97  |", w: "" },
     { c: "  +----+-----------+-------------------+---------+---------+--------+", w: "" }
    ] } },
  { ol: [
   "**Update problems.** Ada changes her email; you must find and update every one of her rows, and missing one leaves the data contradicting itself.",
   "**Insert problems.** You cannot record a new customer until they place an order — there is nowhere to put them.",
   "**Delete problems.** Delete Ada's only order and you lose her contact details entirely.",
   "**Space and inconsistency.** The same text stored a thousand times, with a thousand chances to differ."
  ] },
  { p: "These have formal names — update, insertion and deletion **anomalies** — and eliminating them is what **normalisation** means. The design module covers it properly; for now the consequence is what matters." },

  { h: "The fix: one fact, one place" },
  { code: { lang: "text",
    lines: [
     { c: "  customers                              orders", w: "" },
     { c: "  +----+-------+-------------------+     +----+-------------+---------+--------+", w: "" },
     { c: "  | id | name  | email             |     | id | customer_id | product | amount |", w: "" },
     { c: "  +----+-------+-------------------+     +----+-------------+---------+--------+", w: "" },
     { c: "  | 1  | Ada   | ada@example.com   |     | 1  | 1           | Widget  | 29.97  |", w: "" },
     { c: "  | 2  | Priya | priya@example.com |     | 2  | 1           | Gadget  | 24.50  |", w: "" },
     { c: "  +----+-------+-------------------+     | 3  | 1           | Widget  | 29.97  |", w: "" },
     { c: "     ^                                   | 4  | 2           | Widget  | 29.97  |", w: "" },
     { c: "     PRIMARY KEY                         +----+-------------+---------+--------+", w: "" },
     { c: "     uniquely identifies a customer                ^", w: "" },
     { c: "                                                   FOREIGN KEY", w: "**Points at `customers.id`.** Ada's email now exists in exactly one place, and changing it is one update.", hi: true }
    ] } },
  { tbl: { h: ["", "Primary key", "Foreign key"],
    rows: [
     ["Job", "**Uniquely identifies** a row in its own table", "**Points at** a primary key in another table"],
     ["Unique", "Must be", "Usually not — many orders per customer"],
     ["NULL allowed", "Never", "Sometimes — a NULL means *not linked to anything*"],
     ["How many per table", "One (possibly spanning several columns)", "Any number"],
     ["Enforced by", "A uniqueness constraint", "**A foreign key constraint** — the database refuses an order for a customer that does not exist"]
    ] } },
  { n: "That last row is worth dwelling on. With a foreign key constraint declared, the database itself refuses to create an orphaned order — no application code required, and no way for a buggy script or a manual fix to slip one in. The rule lives with the data, which is exactly the point of a database.",
    nt: "Constraints are enforced, not suggested" },

  { h: "The three relationship shapes" },
  { tbl: { h: ["Shape", "Example", "How it is stored"],
    rows: [
     ["**One-to-many**", "One customer, many orders", "**The foreign key goes on the *many* side** — `orders.customer_id`. By far the most common"],
     ["**One-to-one**", "One user, one profile", "A foreign key on either side, marked unique. Often it should just be one table"],
     ["**Many-to-many**", "Orders contain many products; products appear in many orders", "**A third table** holding both keys — `order_items(order_id, product_id, quantity)`"]
    ] } },
  { code: { lang: "sql", t: "A many-to-many junction table",
    lines: [
     { c: "CREATE TABLE order_items (", w: "**Sometimes called a junction, join or bridge table.**" },
     { c: "    order_id   INTEGER REFERENCES orders(id),", w: "" },
     { c: "    product_id INTEGER REFERENCES products(id),", w: "" },
     { c: "    quantity   INTEGER NOT NULL,", w: "**It usually carries its own data too** — the quantity belongs to the *combination*, not to the order or the product alone." },
     { c: "    unit_price NUMERIC NOT NULL,", w: "**Price at time of order.** Deliberately copied rather than looked up, because the product's price will change and the historical order must not." },
     { c: "    PRIMARY KEY (order_id, product_id)", w: "**A composite primary key** — the pair is unique, which prevents the same product being added to one order twice." },
     { c: ");", w: "" }
    ] } },

  { h: "Reading a schema" },
  { code: { lang: "sql",
    lines: [
     { c: ".schema orders", w: "**SQLite.** Prints the `CREATE TABLE` statement, foreign keys included." },
     { c: "\\d orders", w: "**Postgres**, in `psql`. `\\dt` lists tables." },
     { c: "DESCRIBE orders;", w: "**MySQL.** `SHOW CREATE TABLE orders;` shows the keys too." },
     { c: "", w: "" },
     { c: "SELECT * FROM information_schema.columns", w: "**The portable way** — every engine exposes its own structure as queryable tables." },
     { c: "WHERE table_name = 'orders';", w: "" }
    ] } },
  { l: [
   "**A column named `something_id`** is almost always a foreign key pointing at `somethings.id`.",
   "**A table named after two others** (`order_items`, `user_roles`) is almost always a junction table.",
   "**`REFERENCES` in the schema** tells you the link exactly, without guessing.",
   "**Ask for an ER diagram** if one exists. Most tools generate one from the schema in seconds."
  ] },

  { tryit: { t: "Map a real database",
    task: "Take any database with several tables — the Chinook or Northwind sample databases are ideal and freely downloadable. Sketch its tables, mark each primary key and draw an arrow for every foreign key. Then name one question that needs three tables to answer.",
    hint: "Follow the `_id` columns. A question spanning three tables usually goes fact → junction → dimension, like *which artists sell best in Germany*.",
    sol: { lang: "text", code: "Chinook, partial:\n\n  artists(artist_id PK, name)\n     ^\n     | albums.artist_id\n  albums(album_id PK, title, artist_id FK)\n     ^\n     | tracks.album_id\n  tracks(track_id PK, name, album_id FK, unit_price)\n     ^\n     | invoice_items.track_id\n  invoice_items(invoice_id FK, track_id FK, quantity)\n     |\n     v\n  invoices(invoice_id PK, customer_id FK, billing_country)\n\nThree-table question: \"Which artists earned the most in Germany?\"\n  invoices -> invoice_items -> tracks -> albums -> artists\n  (five, in fact — which is normal and is what joins are for)" },
    w: "Doing this by hand once, before writing any joins, is what makes the next lesson easy. A join is just following one of those arrows, and a five-table query is following five of them in sequence." } }
 ],
 k: [
  "One big table causes update, insert and delete anomalies — the same fact stored many times will eventually disagree with itself.",
  "A primary key uniquely identifies a row; a foreign key points at another table's primary key.",
  "One-to-many puts the foreign key on the many side; many-to-many needs a junction table.",
  "A junction table often carries its own data, including values deliberately copied so history does not change."
 ],
 r: ["Primary Key", "Foreign Key", "Normalisation", "Schema", "Relational Database", "Referential Integrity"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "SELECT * FROM information_schema.columns WHERE table_name = 'orders';", w: "inspect a table's structure portably" },
   { c: "PRIMARY KEY (order_id, product_id)", w: "make a pair of columns uniquely identify a row" },
   { c: "product_id INTEGER REFERENCES products(id)", w: "declare a link to another table's primary key" }
  ]
 }
},

{
 t: "JOIN — Combining Tables",
 m: "join",
 lvl: "intermediate",
 s: "INNER and LEFT, what they really do, and how to tell when a join has quietly duplicated your rows.",
 goal: [
  "Write an INNER and a LEFT join and predict which rows each returns",
  "Chain several joins to answer a question spanning many tables",
  "Detect a join that multiplied rows and produced a wrong total"
 ],
 b: [
  { p: "A join takes two tables and produces one, matching rows by a condition. It is the operation that makes the relational model useful, and the one where a wrong answer is most likely to look right." },

  { h: "INNER JOIN" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    o.id,", w: "**Qualify columns with the table alias.** Essential when both tables have an `id`, and good practice regardless — a reader can see where each column comes from." },
     { c: "    c.name,", w: "" },
     { c: "    o.amount", w: "" },
     { c: "FROM orders AS o", w: "**The left table**, and its alias." },
     { c: "INNER JOIN customers AS c", w: "**The right table.** `INNER` is the default, so plain `JOIN` means the same thing." },
     { c: "    ON o.customer_id = c.id;", w: "**The join condition.** Almost always foreign key equals primary key.", hi: true }
    ],
    out: "id  name   amount\n1   Ada    29.97\n2   Ada    24.50\n3   Ada    29.97\n4   Priya  29.97" } },
  { p: "**An inner join keeps only rows that matched on both sides.** An order with a `customer_id` that does not exist in `customers` disappears; a customer with no orders disappears too." },

  { h: "LEFT JOIN" },
  { code: { lang: "sql",
    lines: [
     { c: "SELECT c.name, o.id AS order_id, o.amount", w: "" },
     { c: "FROM customers AS c", w: "**The left table — every row of this survives.**" },
     { c: "LEFT JOIN orders AS o", w: "**`LEFT OUTER JOIN` in full; the `OUTER` is optional and rarely written.**" },
     { c: "    ON o.customer_id = c.id;", w: "" }
    ],
    out: "name   order_id  amount\nAda    1         29.97\nAda    2         24.50\nAda    3         29.97\nPriya  4         29.97\nKenji  NULL      NULL",
    after: "**Kenji has never ordered, and he is still in the result** — with NULLs where the order columns would be. That is the entire difference, and it is the reason `LEFT JOIN` is usually the right default." } },
  { dg: "joins" },
  { tbl: { t: "The join types",
    h: ["Type", "Keeps", "Use it when"],
    rows: [
     ["**`INNER JOIN`**", "Only rows matching on both sides", "You genuinely want complete pairs and accept that unmatched rows vanish silently"],
     ["**`LEFT JOIN`**", "**Every left row**, NULLs where no match", "**The safe default.** Enriching a table without losing any of it"],
     ["`RIGHT JOIN`", "Every right row", "Rarely — swap the tables and write `LEFT`; it reads better"],
     ["`FULL OUTER JOIN`", "Everything from both", "Reconciling two sources, seeing what is in each but not the other"],
     ["`CROSS JOIN`", "**Every combination** of every row", "Deliberately generating combinations — a date spine, a grid. Almost never otherwise"]
    ] } },
  { n: "`LEFT JOIN` is the right default for the same reason it was in pandas: it cannot silently shrink your data. Start with fifty thousand orders and you still have fifty thousand rows, and every NULL is a visible signal that something did not match. An inner join in the same position just returns fewer rows, and nothing tells you.",
    nt: "Why LEFT is the safe default" },

  { h: "Finding the rows that did not match" },
  { code: { lang: "sql", t: "The anti-join — a genuinely useful pattern",
    lines: [
     { c: "SELECT c.id, c.name", w: "" },
     { c: "FROM customers AS c", w: "" },
     { c: "LEFT JOIN orders AS o ON o.customer_id = c.id", w: "" },
     { c: "WHERE o.id IS NULL;", w: "**Customers who have never ordered.** The LEFT JOIN keeps everyone, then the NULL check keeps only those with no match.", hi: true },
     { c: "", w: "" },
     { c: "-- the same thing, often clearer:", w: "" },
     { c: "SELECT id, name FROM customers c", w: "" },
     { c: "WHERE NOT EXISTS (", w: "**`NOT EXISTS` says what you mean directly**, handles NULLs correctly where `NOT IN` does not, and is usually at least as fast." },
     { c: "    SELECT 1 FROM orders o WHERE o.customer_id = c.id", w: "" },
     { c: ");", w: "" }
    ] } },

  { h: "Joining several tables" },
  { code: { lang: "sql", t: "Following the arrows from the last lesson",
    lines: [
     { c: "SELECT", w: "" },
     { c: "    a.name          AS artist,", w: "" },
     { c: "    COUNT(*)        AS tracks_sold,", w: "" },
     { c: "    ROUND(SUM(ii.unit_price * ii.quantity), 2) AS revenue", w: "" },
     { c: "FROM invoices AS i", w: "**Start from the table your filter is on** — it keeps the query readable." },
     { c: "JOIN invoice_items AS ii ON ii.invoice_id = i.invoice_id", w: "**One join per arrow.** Five tables, four joins." },
     { c: "JOIN tracks        AS t  ON t.track_id    = ii.track_id", w: "" },
     { c: "JOIN albums        AS al ON al.album_id   = t.album_id", w: "" },
     { c: "JOIN artists       AS a  ON a.artist_id   = al.artist_id", w: "" },
     { c: "WHERE i.billing_country = 'Germany'", w: "" },
     { c: "GROUP BY a.name", w: "" },
     { c: "ORDER BY revenue DESC", w: "" },
     { c: "LIMIT 10;", w: "" }
    ],
    after: "Long, and not complicated. Each join follows one foreign key, and once you have sketched the schema the query almost writes itself." } },

  { h: "The join that silently multiplies rows" },
  { p: "This is the failure worth an entire section, because it produces no error — only a number that is too large, by an amount nobody can explain." },
  { code: { lang: "text", t: "How it happens",
    lines: [
     { c: "  orders                    customers", w: "" },
     { c: "  id  customer_id  amount   id  name   address", w: "" },
     { c: "  1   1            100      1   Ada    12 High St", w: "" },
     { c: "                            1   Ada    99 New Rd", w: "**Two rows for customer 1** — the export included one row per address.", hi: true },
     { c: "", w: "" },
     { c: "  SELECT SUM(o.amount) FROM orders o JOIN customers c ON o.customer_id = c.id", w: "" },
     { c: "", w: "" },
     { c: "  -> the single order matches BOTH customer rows", w: "" },
     { c: "  -> SUM = 200, not 100", w: "**Double the real revenue, with no warning at all.**" }
    ] } },
  { code: { lang: "sql", t: "Three habits that catch it",
    lines: [
     { c: "SELECT COUNT(*) FROM orders;", w: "**Count before.**" },
     { c: "SELECT COUNT(*) FROM orders o JOIN customers c ON o.customer_id = c.id;", w: "**Count after. If it grew, the join duplicated rows** — and every aggregate downstream is wrong.", hi: true },
     { c: "", w: "" },
     { c: "SELECT id, COUNT(*) FROM customers GROUP BY id HAVING COUNT(*) > 1;", w: "**Check the key you are joining on is unique.** Any rows returned mean it is not." },
     { c: "", w: "" },
     { c: "SELECT SUM(DISTINCT ...) -- no", w: "**Not the fix.** `DISTINCT` papering over a bad join hides the problem and gives a different wrong answer whenever two genuine rows share a value." }
    ] } },
  { trap: "A `DISTINCT` added to make a join *look right* is nearly always a sign the join is wrong. Find out why the key is not unique — a duplicate in the source, a missing condition, or a genuine one-to-many you should be aggregating first — rather than deduplicating the symptom." },

  { h: "Filtering in ON versus WHERE" },
  { p: "For an inner join these are equivalent. For a `LEFT JOIN` they are completely different, and the difference catches almost everyone." },
  { vs: { t: "*Every customer, with their 2026 orders*", lang: "sql",
    bad: { c: "SELECT c.name, o.amount\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.order_date >= '2026-01-01';", label: "Silently becomes an INNER join",
      w: "The `WHERE` runs **after** the join. A customer with no 2026 orders has NULL in `order_date`, the condition is unknown, and the row is discarded — so customers with no orders vanish entirely." },
    good: { c: "SELECT c.name, o.amount\nFROM customers c\nLEFT JOIN orders o\n    ON o.customer_id = c.id\n   AND o.order_date >= '2026-01-01';", label: "Stays a LEFT join",
      w: "The condition is part of the **matching rule**. Non-2026 orders simply fail to match, and the customer still appears with NULLs — which is what *every customer* asked for." } } },
  { n: "The rule: **conditions on the right-hand table of a LEFT JOIN belong in `ON`. Conditions on the left-hand table belong in `WHERE`.** Getting this backwards turns an outer join into an inner one without any error, and it is one of the most common quiet bugs in reporting SQL.",
    nt: "ON for the right table, WHERE for the left" },

  { h: "Self joins" },
  { code: { lang: "sql", t: "A table joined to itself",
    lines: [
     { c: "SELECT e.name AS employee, m.name AS manager", w: "" },
     { c: "FROM employees AS e", w: "" },
     { c: "LEFT JOIN employees AS m ON m.id = e.manager_id;", w: "**Two aliases for the same table.** `LEFT` so the chief executive, whose `manager_id` is NULL, still appears.", hi: true }
    ],
    after: "Any hierarchy stored in one table — employees and managers, categories and parent categories, comments and replies — is queried this way." } },

  { tryit: { t: "Answer a question spanning four tables",
    task: "Using a sample database, write a query that joins at least four tables, groups the result, and answer a real question. Then verify the join did not duplicate rows by comparing counts before and after.",
    hint: "Sketch the arrows first. Then write `FROM` and the joins with no `SELECT` list beyond `COUNT(*)`, check the count, and only then add the columns and grouping.",
    sol: { lang: "sql", code: "-- step 1: does the join preserve the row count?\nSELECT COUNT(*) FROM invoice_items;              -- 2240\n\nSELECT COUNT(*)\nFROM invoice_items ii\nJOIN tracks  t  ON t.track_id  = ii.track_id\nJOIN albums  al ON al.album_id = t.album_id\nJOIN artists a  ON a.artist_id = al.artist_id;   -- 2240, good\n\n-- step 2: now the real question\nSELECT\n    a.name                                        AS artist,\n    COUNT(*)                                      AS tracks_sold,\n    ROUND(SUM(ii.unit_price * ii.quantity), 2)    AS revenue\nFROM invoices i\nJOIN invoice_items ii ON ii.invoice_id = i.invoice_id\nJOIN tracks   t  ON t.track_id  = ii.track_id\nJOIN albums   al ON al.album_id = t.album_id\nJOIN artists  a  ON a.artist_id = al.artist_id\nWHERE i.billing_country = 'Germany'\nGROUP BY a.name\nORDER BY revenue DESC\nLIMIT 10;" },
    w: "Step 1 is the habit worth keeping. Checking the row count *before* adding aggregates takes ten seconds and is the only reliable way to catch a fan-out — because once the `SUM` is in place, the wrong number looks exactly like a right one." } }
 ],
 k: [
  "`INNER JOIN` keeps only matched rows; `LEFT JOIN` keeps every left row with NULLs where nothing matched.",
  "`LEFT JOIN ... WHERE right.col IS NULL` finds the rows with no match — the anti-join.",
  "A non-unique join key multiplies rows and inflates every aggregate with no error — compare counts before and after.",
  "On a LEFT JOIN, conditions on the right table go in `ON`; putting them in `WHERE` silently makes it an inner join."
 ],
 r: ["Join", "Primary Key", "Foreign Key", "SQL", "Referential Integrity"],
 drill: {
  lang: "sql",
  reps: 4,
  items: [
   { c: "FROM orders AS o JOIN customers AS c ON o.customer_id = c.id", w: "match each order to its customer, keeping only pairs" },
   { c: "FROM customers AS c LEFT JOIN orders AS o ON o.customer_id = c.id", w: "keep every customer, matched or not" },
   { c: "LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL", w: "find the customers who have never ordered" },
   { c: "LEFT JOIN orders o ON o.customer_id = c.id AND o.order_date >= '2026-01-01'", w: "restrict the matched rows without dropping unmatched ones", hint: "which clause?" },
   { c: "FROM employees AS e LEFT JOIN employees AS m ON m.id = e.manager_id", w: "join a table to itself to follow a hierarchy" }
  ]
 }
}

]);
