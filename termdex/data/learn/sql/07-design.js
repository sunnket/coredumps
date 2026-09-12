/* SQL — designing a schema. */
TD.addLessons("sql", [

{
 t: "Types, Constraints and Designing a Table",
 m: "design",
 lvl: "intermediate",
 s: "Choosing what each column can hold, and letting the database enforce the rules instead of your code.",
 goal: [
  "Choose an appropriate type for each column",
  "Use constraints so invalid data cannot be stored at all",
  "Write a CREATE TABLE you would be happy to inherit"
 ],
 b: [
  { p: "A schema is a set of promises about what the data will look like. Made well, they are enforced by the database and cannot be broken by any application, script or person. Made badly, every one of them becomes a bug waiting in someone's code." },

  { h: "Choosing types" },
  { tbl: { t: "The types that cover almost everything",
    h: ["Type", "For", "Notes"],
    rows: [
     ["`INTEGER` / `BIGINT`", "Whole numbers, ids, counts", "`INTEGER` tops out near 2.1 billion — **`BIGINT` for anything that could grow**"],
     ["`NUMERIC(10,2)` / `DECIMAL`", "**Money, always**", "Exact decimal arithmetic. 10 digits total, 2 after the point"],
     ["`REAL` / `DOUBLE PRECISION`", "Measurements, scientific values", "**Never money** — see the trap below"],
     ["`TEXT` / `VARCHAR(n)`", "Any string", "In Postgres they perform identically; use `TEXT` unless a length limit is a real rule"],
     ["`BOOLEAN`", "True/false", "MySQL stores it as `TINYINT(1)`; SQLite as 0/1"],
     ["`DATE` / `TIME` / `TIMESTAMP`", "Points in time", "**Store timestamps in UTC.** See below"],
     ["`TIMESTAMPTZ`", "Timestamp with time zone", "**Postgres: prefer this.** It stores an unambiguous instant"],
     ["`UUID`", "Distributed identifiers", "When ids must be generated without a central counter"],
     ["`JSONB`", "Genuinely variable structure", "Postgres. Powerful, and **not an excuse to avoid designing a schema**"]
    ] } },
  { trap: "**Never store money in a floating-point type.** `0.1 + 0.2` is `0.30000000000000004` in binary floating point — a tiny error that compounds over millions of transactions and eventually shows up as accounts that do not balance. Use `NUMERIC(12,2)`, or store integer pence and divide when displaying. This is not theoretical; it is a recurring class of production incident." },
  { n: "Store every timestamp in **UTC** and convert only when displaying. The moment you store local times you have a database where some hours happen twice a year, some never happen, and no two rows can be reliably ordered. Postgres `TIMESTAMPTZ` handles this properly; elsewhere, be disciplined about it yourself.",
    nt: "Everything in UTC" },

  { h: "Constraints" },
  { p: "A constraint is a rule the database enforces. The value of putting it here rather than in application code is that it holds for **every** writer — your app, someone else's script, a manual fix at 2am, a data import." },
  { code: { lang: "sql", file: "schema.sql",
    lines: [
     { c: "CREATE TABLE customers (", w: "" },
     { c: "    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,", w: "**Unique, not null, auto-assigned.** SQLite: `INTEGER PRIMARY KEY`. MySQL: `AUTO_INCREMENT`." },
     { c: "    email       TEXT NOT NULL UNIQUE,", w: "**`NOT NULL`** — a customer without an email is not a customer. **`UNIQUE`** — no two accounts share one.", hi: true },
     { c: "    name        TEXT NOT NULL,", w: "" },
     { c: "    country     CHAR(2) NOT NULL DEFAULT 'GB',", w: "**`DEFAULT`** fills a value when the insert does not supply one." },
     { c: "    age         INTEGER CHECK (age >= 0 AND age < 130),", w: "**`CHECK`** rejects impossible values outright. The database will not store an age of 999." },
     { c: "    status      TEXT NOT NULL DEFAULT 'active'", w: "" },
     { c: "                CHECK (status IN ('active', 'suspended', 'closed')),", w: "**A CHECK as an enumeration** — the set of valid statuses, enforced. Far better than a comment nobody reads." },
     { c: "    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP", w: "**Every table should have this.** You will want it eventually and cannot add it retroactively with real values." },
     { c: ");", w: "" }
    ] } },
  { code: { lang: "sql", file: "schema.sql", t: "And the table that references it",
    lines: [
     { c: "CREATE TABLE orders (", w: "" },
     { c: "    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,", w: "" },
     { c: "    customer_id INTEGER NOT NULL", w: "**`NOT NULL`: an order must belong to somebody.**" },
     { c: "                REFERENCES customers(id) ON DELETE RESTRICT,", w: "**The foreign key.** `RESTRICT` refuses to delete a customer who has orders — the safe choice.", hi: true },
     { c: "    amount      NUMERIC(10,2) NOT NULL CHECK (amount >= 0),", w: "**Exact money, and never negative.**" },
     { c: "    status      TEXT NOT NULL DEFAULT 'pending',", w: "" },
     { c: "    order_date  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,", w: "" },
     { c: "    shipped_at  TIMESTAMPTZ,", w: "**Nullable on purpose** — an unshipped order genuinely has no ship date. This is what NULL is *for*." },
     { c: "", w: "" },
     { c: "    CHECK (shipped_at IS NULL OR shipped_at >= order_date)", w: "**A table-level CHECK across two columns.** Nothing can ship before it was ordered." },
     { c: ");", w: "" }
    ] } },
  { tbl: { h: ["Constraint", "Guarantees"],
    rows: [
     ["`PRIMARY KEY`", "Unique **and** not null. One per table"],
     ["`NOT NULL`", "A value must be supplied"],
     ["`UNIQUE`", "No two rows share this value. May be several columns together"],
     ["`CHECK (...)`", "An arbitrary condition each row must satisfy"],
     ["`DEFAULT`", "What to use when nothing is supplied"],
     ["`REFERENCES`", "**The value must exist in another table** — referential integrity"]
    ] } },
  { n: "The argument against constraints is usually *we validate that in the application*. The counter is that there is never only one application. There is the app, the admin tool, the migration script, the data import, the console session at midnight. A constraint holds for all of them; a validation function holds for the one codebase that calls it.",
    nt: "Why not just validate in code" },

  { h: "Normalisation, briefly and practically" },
  { p: "**Normalisation** is organising tables so each fact is stored exactly once. Three rules cover nearly all real design." },
  { ol: [
   "**First normal form** — one value per cell. A `tags` column holding `'red,large,sale'` is a violation; it needs its own table.",
   "**Second normal form** — every non-key column depends on the *whole* key. On a table keyed by `(order_id, product_id)`, a `customer_name` column depends only on the order, so it belongs on `orders`.",
   "**Third normal form** — no column depends on another non-key column. `city` and `country` on the same table is fine; `postcode` and the `city` it implies is not, because changing one leaves the other wrong."
  ] },
  { p: "In practice: **if you find yourself storing the same text in many rows, it probably wants its own table.** That single heuristic gets you to third normal form most of the time." },
  { dg: "normalization" },

  { h: "When to denormalise" },
  { p: "Normalisation optimises for *correctness on write*. Sometimes you deliberately trade it for *speed on read*." },
  { l: [
   "**Historical values that must not change.** `order_items.unit_price` duplicates the product's price on purpose — the product's price will change, and last year's invoice must not.",
   "**Counters that would be expensive to recompute.** A `comment_count` on a post, kept up to date by a trigger or the application, avoids counting a million rows on every page view.",
   "**Analytical warehouses.** Star schemas are deliberately denormalised because those systems only read, and joins at that scale are expensive."
  ] },
  { trap: "Every denormalised value is a copy that can drift out of step with its source. If you keep one, you own the job of keeping it correct — and you should be able to say exactly what updates it. *We'll keep it in sync in the application* is where most data-inconsistency bugs come from. Normalise by default, denormalise deliberately, and write down why." },
  { dg: "star-schema" },

  { h: "Changing a schema later" },
  { code: { lang: "sql",
    lines: [
     { c: "ALTER TABLE customers ADD COLUMN phone TEXT;", w: "**Adding a nullable column is cheap and safe** on every modern engine." },
     { c: "ALTER TABLE customers ADD COLUMN tier TEXT NOT NULL DEFAULT 'standard';", w: "**Adding `NOT NULL` requires a default**, or the existing rows have nothing to hold." },
     { c: "", w: "" },
     { c: "ALTER TABLE customers RENAME COLUMN phone TO mobile;", w: "**Instant, and it breaks every query that used the old name.** Deploy in stages on a live system." },
     { c: "ALTER TABLE customers DROP COLUMN mobile;", w: "**Destroys the data.** No undo outside a transaction." },
     { c: "", w: "" },
     { c: "ALTER TABLE orders ADD CONSTRAINT positive_amount CHECK (amount >= 0);", w: "**Fails if existing rows violate it** — which is the constraint doing its job, and how you discover the bad data you already have." }
    ] } },
  { n: "In real projects schema changes go through **migrations** — numbered, version-controlled scripts, applied in order, each with a way back. Alembic for Python, Flyway or Liquibase for the JVM, and every web framework has its own. Never change a production schema by typing `ALTER TABLE` into a console; the next environment will not match and nobody will know why.",
    nt: "Migrations, not console commands" },

  { h: "A checklist for a new table" },
  { l: [
   "**A primary key**, always. If no natural one exists, use a generated id.",
   "**`NOT NULL` on everything that is genuinely required.** Nullable should be a decision, not a default.",
   "**Foreign keys declared**, with a deliberate `ON DELETE` behaviour.",
   "**`CHECK` constraints for the rules you would otherwise write in a comment.**",
   "**`created_at`, and `updated_at` if rows change.** You will want them.",
   "**Money as `NUMERIC`, timestamps in UTC.**",
   "**Singular or plural table names — pick one and never mix.** Plural is the more common convention.",
   "**`snake_case` throughout**, avoiding reserved words like `order`, `user` and `group`."
  ] },

  { tryit: { t: "Design a schema from a description",
    task: "Design the tables for a small library: books, authors (a book may have several), members, and loans. Write the `CREATE TABLE` statements with keys, constraints and sensible types. Then name one rule your constraints enforce that application code would otherwise have to.",
    hint: "Books-to-authors is many-to-many, so it needs a junction table. A loan needs to express *not yet returned*.",
    sol: { lang: "sql", code: "CREATE TABLE authors (\n    id   INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n    name TEXT NOT NULL\n);\n\nCREATE TABLE books (\n    id      INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n    isbn    CHAR(13) NOT NULL UNIQUE,\n    title   TEXT NOT NULL,\n    copies  INTEGER NOT NULL DEFAULT 1 CHECK (copies >= 0)\n);\n\nCREATE TABLE book_authors (\n    book_id   INTEGER NOT NULL REFERENCES books(id)   ON DELETE CASCADE,\n    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,\n    PRIMARY KEY (book_id, author_id)\n);\n\nCREATE TABLE members (\n    id         INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n    email      TEXT NOT NULL UNIQUE,\n    name       TEXT NOT NULL,\n    joined_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE loans (\n    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n    book_id     INTEGER NOT NULL REFERENCES books(id)   ON DELETE RESTRICT,\n    member_id   INTEGER NOT NULL REFERENCES members(id) ON DELETE RESTRICT,\n    loaned_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    due_at      TIMESTAMPTZ NOT NULL,\n    returned_at TIMESTAMPTZ,\n    CHECK (due_at > loaned_at),\n    CHECK (returned_at IS NULL OR returned_at >= loaned_at)\n);" },
    w: "The two `CHECK`s on `loans` are the answer to the last part: no loan can be due before it was taken out, and none can be returned before it was borrowed. Without them, every piece of code that writes a loan has to remember those rules — and one of them eventually will not." } }
 ],
 k: [
  "Money is `NUMERIC`, never floating point; timestamps are stored in UTC.",
  "Constraints hold for every writer — the app, the script, the console — where application validation holds only for one codebase.",
  "Normalise so each fact is stored once; the heuristic is *repeated text probably wants its own table*.",
  "Denormalise deliberately, for frozen historical values or expensive counters, and own the job of keeping the copy correct."
 ],
 r: ["Schema", "Normalisation", "Denormalisation", "Primary Key", "Foreign Key", "Referential Integrity", "Data Type"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "email TEXT NOT NULL UNIQUE,", w: "require a value and forbid two rows sharing it" },
   { c: "amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),", w: "store money exactly and reject negatives" },
   { c: "customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,", w: "require a valid parent row and refuse to orphan it" },
   { c: "created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP", w: "record when each row was created, automatically" },
   { c: "ALTER TABLE customers ADD COLUMN phone TEXT;", w: "add a new optional column to an existing table" }
  ]
 }
}

]);
