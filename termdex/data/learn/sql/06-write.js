/* SQL — changing data. */
TD.addLessons("sql", [

{
 t: "INSERT, UPDATE, DELETE and the WHERE That Saves Your Job",
 m: "write",
 lvl: "core",
 s: "Writing data, and the one habit that prevents the worst afternoon of your career.",
 goal: [
  "Insert single and multiple rows",
  "Update and delete exactly the rows you intend",
  "Adopt the safety habits professionals use without thinking"
 ],
 b: [
  { p: "Everything so far has only read. These three statements change data, and they deserve more care than the rest of SQL put together — because a mistyped `SELECT` returns the wrong rows, and a mistyped `UPDATE` destroys the right ones." },

  { h: "INSERT" },
  { code: { lang: "sql",
    lines: [
     { c: "INSERT INTO customers (name, email, city)", w: "**Always name the columns.** Without them the values must match the table's column order exactly, and that order changes when someone adds a column — silently putting your email into the wrong field.", hi: true },
     { c: "VALUES ('Ada', 'ada@example.com', 'London');", w: "**Single quotes for text.** Note `id` was not supplied — the database assigns it." },
     { c: "", w: "" },
     { c: "INSERT INTO customers (name, email, city) VALUES", w: "" },
     { c: "    ('Priya', 'priya@example.com', 'Mumbai'),", w: "**Several rows in one statement.** Far faster than separate inserts — one round trip and one transaction instead of hundreds." },
     { c: "    ('Kenji', 'kenji@example.com', NULL),", w: "**`NULL` unquoted** — quoting it stores the four-letter string." },
     { c: "    ('Lena',  'lena@example.com',  'Berlin');", w: "" },
     { c: "", w: "" },
     { c: "INSERT INTO archive_orders (id, amount, order_date)", w: "" },
     { c: "SELECT id, amount, order_date FROM orders", w: "**Insert the result of a query.** How you copy, archive or migrate data between tables." },
     { c: "WHERE order_date < '2024-01-01';", w: "" }
    ] } },
  { code: { lang: "sql", t: "Getting back what was inserted",
    lines: [
     { c: "INSERT INTO customers (name, email) VALUES ('Ada', 'ada@example.com')", w: "" },
     { c: "RETURNING id;", w: "**Postgres and SQLite: returns the generated id.** Essential when you must immediately insert a related row." },
     { c: "", w: "" },
     { c: "SELECT LAST_INSERT_ID();", w: "**MySQL's equivalent**, as a separate statement." }
    ] } },

  { h: "UPDATE" },
  { code: { lang: "sql",
    lines: [
     { c: "UPDATE customers", w: "" },
     { c: "SET city = 'Manchester'", w: "**Which columns change.**" },
     { c: "WHERE id = 1;", w: "**Which rows.** Read the next section before you ever run one of these.", hi: true },
     { c: "", w: "" },
     { c: "UPDATE customers", w: "" },
     { c: "SET city = 'Manchester',", w: "**Several columns, comma separated.**" },
     { c: "    updated_at = CURRENT_TIMESTAMP", w: "" },
     { c: "WHERE id = 1;", w: "" },
     { c: "", w: "" },
     { c: "UPDATE products", w: "" },
     { c: "SET price = price * 1.10", w: "**The new value can be computed from the old one.** A ten per cent increase across a whole category, in one statement." },
     { c: "WHERE category = 'accessories';", w: "" }
    ] } },

  { h: "The habit that prevents the disaster" },
  { p: "This is the most important paragraph in the module. Every experienced person has either done this or watched someone do it." },
  { code: { lang: "sql", t: "What goes wrong",
    lines: [
     { c: "UPDATE customers SET city = 'Manchester';", w: "**The `WHERE` was forgotten. Every customer in the table now lives in Manchester.** No confirmation, no warning, and if you are not in a transaction, no way back except a restore from backup.", hi: true },
     { c: "", w: "" },
     { c: "DELETE FROM orders;", w: "**Every order, gone.** `DELETE` with no `WHERE` empties the table." }
    ] } },
  { code: { lang: "sql", t: "The routine that makes it safe",
    lines: [
     { c: "-- 1. Write it as a SELECT first", w: "" },
     { c: "SELECT * FROM customers WHERE id = 1;", w: "**Look at exactly the rows you are about to change.** If this returns 4,000 rows and you expected one, you have just avoided the incident.", hi: true },
     { c: "", w: "" },
     { c: "-- 2. Wrap it in a transaction", w: "" },
     { c: "BEGIN;", w: "" },
     { c: "UPDATE customers SET city = 'Manchester' WHERE id = 1;", w: "" },
     { c: "SELECT * FROM customers WHERE id = 1;", w: "**Check the result *inside* the transaction**, before anyone else can see it." },
     { c: "-- looks right:", w: "" },
     { c: "COMMIT;", w: "**Make it permanent.**" },
     { c: "-- looks wrong:", w: "" },
     { c: "ROLLBACK;", w: "**Undo everything since BEGIN, as though it never happened.** This is the escape hatch, and it only exists if you opened the transaction first." }
    ] } },
  { l: [
   "**Write the `WHERE` clause before the `SET` clause.** Physically type it first. It sounds superstitious and it works.",
   "**Run it as a `SELECT` first.** Every time. On production, without exception.",
   "**Use a transaction** for anything you are not completely certain about.",
   "**Some clients offer a safe-update mode** that refuses an `UPDATE` or `DELETE` with no `WHERE` — MySQL Workbench does this by default. Leave it on."
  ] },

  { h: "DELETE" },
  { code: { lang: "sql",
    lines: [
     { c: "DELETE FROM orders WHERE id = 42;", w: "One row." },
     { c: "DELETE FROM orders WHERE order_date < '2020-01-01';", w: "Many. **`SELECT COUNT(*)` with the same `WHERE` first**, so you know how many." },
     { c: "", w: "" },
     { c: "DELETE FROM orders;", w: "**Every row, one at a time, logged and reversible within a transaction.**" },
     { c: "TRUNCATE TABLE orders;", w: "**Far faster and usually *not* transactional.** It deallocates the storage rather than deleting rows. No `WHERE` clause is possible, and on most engines there is no undo." }
    ] } },
  { p: "Deleting a row that other rows reference raises a foreign key error — the database protecting referential integrity. The schema decides what happens instead." },
  { tbl: { h: ["`ON DELETE`", "Effect"],
    rows: [
     ["`RESTRICT` / `NO ACTION`", "**Refuse the delete** while children exist. The safe default"],
     ["`CASCADE`", "**Delete the children too.** Convenient and genuinely dangerous — one delete can quietly remove thousands of rows"],
     ["`SET NULL`", "Keep the children, blank their foreign key"]
    ] } },
  { n: "Many teams never hard-delete anything. Instead a `deleted_at` timestamp is set and every query filters on `WHERE deleted_at IS NULL` — a **soft delete**. It makes recovery trivial, preserves history for auditing, and costs one condition on every query. For anything a user can delete by accident, it is nearly always the right choice.",
    nt: "Soft deletes" },

  { h: "UPSERT — insert or update" },
  { code: { lang: "sql",
    lines: [
     { c: "INSERT INTO stock (product_id, quantity)", w: "" },
     { c: "VALUES (42, 100)", w: "" },
     { c: "ON CONFLICT (product_id) DO UPDATE", w: "**Postgres and SQLite.** If a row with that key exists, update it instead of failing.", hi: true },
     { c: "    SET quantity = stock.quantity + EXCLUDED.quantity;", w: "**`EXCLUDED` refers to the row you tried to insert.** So this adds to the existing quantity rather than replacing it." },
     { c: "", w: "" },
     { c: "INSERT INTO stock (product_id, quantity) VALUES (42, 100)", w: "" },
     { c: "ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);", w: "**MySQL's spelling** of the same idea." },
     { c: "", w: "" },
     { c: "INSERT INTO stock (product_id, quantity) VALUES (42, 100)", w: "" },
     { c: "ON CONFLICT (product_id) DO NOTHING;", w: "**Silently skip duplicates.** Useful for idempotent imports you may run twice." }
    ],
    after: "The alternative — `SELECT`, then decide, then `INSERT` or `UPDATE` — has a race condition: two processes can both find nothing and both insert. An upsert is a single atomic statement and cannot." } },

  { h: "Transactions" },
  { p: "A **transaction** groups several statements so they either all take effect or none do. It is the property that stops money vanishing between two accounts." },
  { code: { lang: "sql",
    lines: [
     { c: "BEGIN;", w: "**Start.** `START TRANSACTION` on MySQL." },
     { c: "", w: "" },
     { c: "UPDATE accounts SET balance = balance - 100 WHERE id = 1;", w: "" },
     { c: "UPDATE accounts SET balance = balance + 100 WHERE id = 2;", w: "**If the connection dies between these two, without a transaction the money has simply ceased to exist.**", hi: true },
     { c: "", w: "" },
     { c: "COMMIT;", w: "**Both, or neither.** That is atomicity — the A in ACID." }
    ] } },
  { dg: "acid" },
  { l: [
   "**Atomicity** — all statements or none.",
   "**Consistency** — constraints hold before and after; a transaction cannot leave the database in an invalid state.",
   "**Isolation** — concurrent transactions do not see each other's half-finished work.",
   "**Durability** — once committed, it survives a power cut."
  ] },
  { trap: "An open transaction holds locks. Type `BEGIN`, run an `UPDATE`, then go to lunch, and every other query touching those rows waits for you — which on a live system looks exactly like an outage. Keep transactions short, and never leave one open in an interactive session." },

  { tryit: { t: "Practise the safety routine",
    task: "On a scratch table: run an `UPDATE` inside a transaction, check the result, and `ROLLBACK`. Confirm the data is unchanged. Then do it again and `COMMIT`. Finally, deliberately run an `UPDATE` with no `WHERE` inside a transaction, see how many rows it reports, and roll it back.",
    hint: "The row count the engine reports after an `UPDATE` is the check — if it says 4,000 and you expected 1, roll back.",
    sol: { lang: "sql", code: "-- see what you are about to change\nSELECT * FROM customers WHERE id = 1;\n\nBEGIN;\nUPDATE customers SET city = 'Manchester' WHERE id = 1;\nSELECT * FROM customers WHERE id = 1;   -- changed\nROLLBACK;\nSELECT * FROM customers WHERE id = 1;   -- back as it was\n\n-- and the disaster, safely contained\nBEGIN;\nUPDATE customers SET city = 'Manchester';\n-- \"UPDATE 8127\"  <- that number is the warning\nROLLBACK;" },
    w: "The reported row count is the signal to watch for. Getting into the habit of reading it — and treating any unexpected number as a reason to roll back rather than shrug — is what turns the safety routine from a rule you follow into an instinct." } }
 ],
 k: [
  "Always name columns in `INSERT`; positional values break silently when the schema changes.",
  "Write the `WHERE` first, run it as a `SELECT` first, and wrap anything uncertain in a transaction.",
  "`BEGIN` / `COMMIT` / `ROLLBACK` makes several statements atomic — all or nothing — and gives you an undo.",
  "`ON CONFLICT ... DO UPDATE` is an atomic upsert; select-then-insert has a race condition."
 ],
 r: ["ACID", "Transaction", "SQL", "Referential Integrity", "Idempotency", "Rollback"],
 drill: {
  lang: "sql",
  reps: 4,
  items: [
   { c: "INSERT INTO customers (name, email, city) VALUES ('Ada', 'ada@example.com', 'London');", w: "add one row, naming the columns" },
   { c: "UPDATE customers SET city = 'Manchester' WHERE id = 1;", w: "change one row's value", hint: "type the WHERE first" },
   { c: "UPDATE products SET price = price * 1.10 WHERE category = 'accessories';", w: "raise a whole category's prices by a tenth" },
   { c: "DELETE FROM orders WHERE order_date < '2020-01-01';", w: "remove rows older than a date" },
   { c: "BEGIN;", w: "start a group of statements that succeed or fail together" },
   { c: "ROLLBACK;", w: "undo everything since the transaction began" },
   { c: "ON CONFLICT (product_id) DO UPDATE SET quantity = stock.quantity + EXCLUDED.quantity;", w: "insert, or add to the existing row if the key is taken" }
  ]
 }
}

]);
