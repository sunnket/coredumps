/* Real-world examples and step-by-step flows — Databases & SQL. */
TD.attach("databases", {

"SQL": {
 ex: { h: "Ordering by describing the dish, not the cooking",
       b: "You say *the ten highest-spending customers this quarter* and the database works out how to get them — which indexes to use, which order to join in. It has outlived every language that was going to replace it precisely because you describe the result rather than the route." },
 fl: { t: "The order the database actually reads it in",
       s: ["You write SELECT first",
           { s: "The engine starts with FROM and the joins", n: "Which is why an alias defined in SELECT is not usable in WHERE." },
           { s: "Then WHERE, then GROUP BY, then HAVING", n: "WHERE filters rows; HAVING filters groups." },
           { s: "Then SELECT, then ORDER BY, then LIMIT", n: "Which is why ORDER BY *can* use a SELECT alias." },
           "Knowing this order explains most *why is this column not recognised* errors"] }
},

"DDL": {
 ex: { h: "The architect's drawings, not the furniture",
       b: "CREATE, ALTER and DROP define the shape of the building. In most databases these commit immediately and cannot be rolled back — which is exactly why a mistaken `DROP TABLE` in production is a very different kind of afternoon from a mistaken DELETE." },
 fl: { t: "Changing structure safely",
       s: ["You need to alter a table",
           { q: "Does your database wrap DDL in a transaction?",
             y: "PostgreSQL does — you can roll back a botched migration",
             n: "MySQL commits implicitly; there is no undo" },
           { s: "Some ALTERs lock the table while they run", n: "On a large table that means downtime." },
           "Always take a backup first, and rehearse on a copy of production"] }
},

"DML": {
 ex: { h: "Moving the furniture, not the walls",
       b: "INSERT, UPDATE and DELETE change what is in the tables. These are transactional — you can roll them back — which is why the safety habit is to write the WHERE clause before the verb, and to run it as a SELECT first." },
 fl: { t: "Not deleting everything",
       s: ["You are about to write an UPDATE or DELETE",
           { s: "Write it as a SELECT with the same WHERE first", n: "Look at what comes back." },
           { q: "Is that the right set of rows?",
             y: "Wrap it in a transaction and run it",
             n: "Fix the WHERE — a missing one affects every row in the table" },
           { s: "Check the affected row count before committing", n: "Unexpected number, roll back." },
           "Some clients have a safe-update mode that refuses an unqualified DELETE"] }
},

"DQL": {
 ex: { h: "Asking, not changing",
       b: "SELECT is the read-only half of SQL, and it is where most engineers spend most of their time. It never modifies anything, which is why it is safe to experiment with — and why a read-only credential is the right one for analysts." },
 fl: { t: "Building up a query",
       s: ["Start with FROM — which table holds the rows",
           { s: "Add WHERE to reduce the row set early", n: "The earlier you filter, the less work everything downstream does." },
           { s: "Join what you need, then group and aggregate", n: "Check row counts after each join." },
           { q: "Did a join multiply your rows?",
             y: "A one-to-many join inflates aggregates — the classic silent wrong answer",
             n: "Add ORDER BY and LIMIT last" }] }
},

"DCL": {
 ex: { h: "Deciding who has keys to which rooms",
       b: "GRANT and REVOKE. Two statements, and the difference between an application that can only read the orders table and one that can drop the database when a bug in an ORM goes wrong." },
 fl: { t: "Applying least privilege",
       s: ["An application needs database access",
           { q: "What does it genuinely need to do?",
             y: "Grant exactly that — SELECT and INSERT on named tables",
             n: "Never grant superuser to an application account" },
           { s: "Separate roles for migrations and for runtime", n: "The runtime account should not be able to DROP anything." },
           "Analysts get a read-only role against a replica, never production write access"] }
},

"TCL": {
 ex: { h: "The word *commit* meaning exactly what it says",
       b: "BEGIN, COMMIT, ROLLBACK and SAVEPOINT are the controls around a unit of work. Until you commit, nobody else sees your changes and you can still change your mind — which is the entire safety net under every multi-step operation." },
 fl: { t: "A multi-step operation, safely",
       s: ["BEGIN the transaction",
           { s: "Run every statement that must succeed together", n: "Debit one account, credit another." },
           { q: "Did anything fail?",
             y: "ROLLBACK — the database returns to exactly where it started",
             n: "COMMIT — now everyone sees all of it, atomically" },
           { s: "SAVEPOINT lets you roll back part of the way", n: "Useful in long procedures." },
           "A transaction left open holds locks — always close it, including on error"] }
},

"Relational Database": {
 ex: { h: "A well-organised filing system with cross-references",
       b: "Customers in one drawer, orders in another, and a reference number linking them so a customer's address is stored exactly once. That single-source-of-truth property is why relational databases have survived every declaration of their obsolescence." },
 fl: { t: "Why the data is split across tables",
       s: ["Customer details would repeat on every order",
           { s: "Store them once in a customers table", n: "Orders hold a foreign key instead." },
           { q: "The customer moves house?",
             y: "One row changes and every order reflects it immediately",
             n: "Denormalised, you would update thousands of rows and miss some" },
           { s: "Joins reassemble the picture at query time", n: "Which is the cost you pay for the consistency." },
           "Constraints let the database enforce the rules rather than trusting every application"] }
},

"Primary Key": {
 ex: { h: "A National Insurance number",
       b: "One per person, never reused, never null, and it does not change when they move or marry. That last property is why a natural key like an email address is usually a poor choice — people change their email, and every foreign key referencing it then has to change too." },
 fl: { t: "Choosing one",
       s: ["Every table needs a unique row identifier",
           { q: "Is there a natural candidate that never changes?",
             y: "Rare — email, phone and username all change in practice",
             n: "Use a surrogate key: an auto-increment integer or a UUID" },
           { s: "Sequential integers are compact and index beautifully", n: "But they leak how many records you have." },
           { s: "UUIDs do not leak and can be generated anywhere", n: "v7 is time-ordered, which keeps indexes healthy." },
           "It is automatically indexed and enforces uniqueness for you"] }
},

"Foreign Key": {
 ex: { h: "A reference number that must point at something real",
       b: "An order referencing customer 4,732 is meaningless if no such customer exists. The constraint makes the database refuse to create that situation at all, which is a far stronger guarantee than every application remembering to check." },
 fl: { t: "What the constraint enforces",
       s: ["An orders table references customers",
           { q: "Insert an order with a non-existent customer id?",
             y: "Rejected — referential integrity is enforced at the database level",
             n: "Delete a customer who has orders?" },
           { q: "What should happen to the orders?",
             y: "CASCADE deletes them too — powerful and easy to regret",
             n: "RESTRICT refuses; SET NULL orphans them deliberately" },
           "Index the foreign key column — it is not automatic, and joins depend on it"] }
},

"Composite Key": {
 ex: { h: "Seat 14B on flight BA117 on the 3rd",
       b: "No single one of those identifies anything; together they identify exactly one booking. Join tables use this constantly — a student_id plus a course_id uniquely identifies an enrolment and needs no invented id of its own." },
 fl: { t: "When several columns together are the key",
       s: ["No single column is unique",
           { s: "Declare the combination as the primary key", n: "`PRIMARY KEY (student_id, course_id)`" },
           { q: "Does column order matter?",
             y: "Yes — the index is only usable for queries filtering on the leading column",
             n: "Put the most selective or most-filtered column first" },
           "Other tables referencing it must carry every column — which is why surrogates are common"] }
},

"Index": {
 ex: { h: "The index at the back of a book",
       b: "Without it, finding every mention of *photosynthesis* means reading all six hundred pages. With it, you look up one entry and jump. And like a book index, it takes up space and has to be updated every time the text changes — which is why indexing every column slows writes." },
 fl: { t: "Deciding what to add an index on",
       s: [{ s: "Without an index, finding matching rows means reading every row in the table and checking each one", n: "Fine for a thousand rows. Ruinous for ten million." },
           { s: "An index is a separate sorted lookup, like the index at the back of a book", n: "Rather than reading the whole book to find a word, you look it up and jump straight to the page." },
           { s: "When a query is slow, first ask the database to explain how it is answering it", n: "Every database has a command for this. If it says it is reading the whole table, you have found the problem." },
           { q: "Which column is the query filtering or matching on?",
             y: "Add an index on that column — an improvement of a hundred times over is routine",
             n: "If it filters on several at once, index them together — and the order you list them in matters" },
           { s: "The cost: every index has to be updated whenever you add, change or delete a row", n: "So indexes make reading faster and writing slower, and they take up disk space." },
           { s: "Most databases can tell you which indexes are never used", n: "Those are pure cost. Remove them." }] }
},

"B-Tree": {
 ex: { h: "A filing system with drawers inside drawers",
       b: "Each level narrows the search dramatically, so a million rows are reached in three or four hops. It stays balanced as data is added, and it keeps keys in order — which is why it serves both `=` lookups and range queries, unlike a hash index." },
 fl: { t: "Why this shape suits a disk",
       s: [{ s: "A disk cannot fetch one value at a time — it fetches a whole block at once", n: "Fetching one number and fetching a few hundred next to it cost the same." },
           { s: "So this structure puts hundreds of values in each node, sized to match one block", n: "One fetch brings back a large chunk of the search, rather than a single comparison." },
           { s: "Each node also holds pointers to its children, so you can narrow down quickly", n: "Look at the values, decide which gap your target falls into, follow that pointer down." },
           { q: "How many fetches to find one row among a million?",
             y: "Three or four, because each level narrows the search hundreds of times over",
             n: "A structure that split the search only in two each time would need about twenty — five times the disk work" },
           { s: "The bottom row of nodes is chained together in order", n: "Which is why asking for everything between two dates, or sorted results, is cheap." }] }
},

"Join": {
 ex: { h: "Matching two lists by a shared reference",
       b: "Guest list and dietary requirements, matched on name. The interesting question is what happens to a guest with no dietary entry — INNER drops them, LEFT keeps them with blanks — and choosing wrongly is how a report quietly loses a third of its rows." },
 fl: { t: "Choosing the join type",
       s: ["You need columns from two tables",
           { q: "Do you want rows that exist in both only?",
             y: "INNER JOIN — unmatched rows on either side disappear",
             n: "LEFT JOIN keeps every row from the left, with NULLs where nothing matched" },
           { q: "Is the relationship one-to-many?",
             y: "The left row is duplicated per match — aggregates will be inflated",
             n: "Watch for a missing join condition — that is a cross join" },
           "Filtering a LEFT JOIN's right table in WHERE silently turns it into an INNER JOIN"] }
},

"Subquery": {
 ex: { h: "A question inside a question",
       b: "*Show me customers who spent more than the average* needs the average worked out first. Sometimes it is the clearest way to express intent; sometimes it runs once per outer row and turns a fast query into a very slow one." },
 fl: { t: "Correlated or not?",
       s: ["A subquery appears inside the outer query",
           { q: "Does it reference a column from the outer query?",
             y: "Correlated — it may run once per outer row. Often rewritable as a join",
             n: "Independent — it runs once and the result is reused" },
           { s: "Check the query plan rather than guessing", n: "Modern optimisers rewrite many subqueries into joins automatically." },
           "A CTE is usually more readable than a nested subquery three levels deep"] }
},

"Common Table Expression": {
 ex: { h: "Naming an intermediate result so the query reads like prose",
       b: "`WITH recent_orders AS (...)` lets you build a complex query in named steps instead of nesting subqueries four deep. Readability is the main prize; recursion — walking an org chart or a category tree — is the capability you cannot easily get otherwise." },
 fl: { t: "Structuring a complex query",
       s: ["Break the logic into named steps with WITH",
           { s: "Each CTE can reference the ones above it", n: "Which reads top to bottom, like a script." },
           { q: "Is it recursive?",
             y: "`WITH RECURSIVE` walks hierarchies — org charts, threads, category trees",
             n: "Check whether your database materialises CTEs or inlines them" },
           "PostgreSQL used to always materialise them, which could hurt — modern versions inline by default"] }
},

"View": {
 ex: { h: "A saved search everyone can use",
       b: "A named query that behaves like a table. It simplifies complicated joins for analysts and hides columns they should not see — and it runs its underlying query every time, so a view over a slow query is still a slow query." },
 fl: { t: "What a view does and does not do",
       s: ["Define a view over a complex query",
           { q: "Does it store any data?",
             y: "No — it is expanded and executed every time it is queried",
             n: "For stored results you want a materialised view" },
           { s: "It is a good permission boundary", n: "Grant access to the view, not the underlying tables." },
           "Views over views over views become impossible to reason about — keep it shallow"] }
},

"Materialised View": {
 ex: { h: "A printed report rather than a live query",
       b: "The results are computed once and stored, so reading is instant. The catch is the same as any cache: it is out of date the moment the underlying data changes, and something has to decide when to refresh it." },
 fl: { t: "Trading freshness for speed",
       s: ["An expensive aggregate is queried constantly",
           { s: "Materialise it — the result is stored on disk", n: "Reads become a simple table scan." },
           { q: "How stale can it be?",
             y: "Minutes or hours — refresh on a schedule",
             n: "It must be live — you need a view, or triggers, or a rollup table" },
           { s: "`REFRESH CONCURRENTLY` avoids locking readers", n: "It needs a unique index to work." },
           "Refresh cost grows with the data — measure it before relying on a tight schedule"] }
},

"Stored Procedure": {
 ex: { h: "A routine kept in the filing room rather than the office",
       b: "Logic that runs inside the database, close to the data, in one round trip. It can be dramatically faster for set-heavy work — and it lives outside your repository, your tests and your code review unless you make a deliberate effort." },
 fl: { t: "Should this logic live in the database?",
       s: ["You have logic that touches a lot of data",
           { q: "Would it otherwise mean many round trips?",
             y: "A procedure can be far faster — the data never leaves the server",
             n: "Application code is easier to test, version and review" },
           { s: "Keep procedures in version control", n: "Otherwise nobody knows what changed or when." },
           "Business logic split between application and database is hard to reason about — pick a home"] }
},

"Trigger": {
 ex: { h: "A tripwire in the filing room",
       b: "Something happens automatically whenever a row changes, whether or not the person making the change knows about it. Excellent for audit logs and genuinely dangerous for business logic, because the effect is invisible from the calling code." },
 fl: { t: "When a trigger is appropriate",
       s: ["Something must happen on every write",
           { q: "Is it invariant infrastructure — an audit trail, an updated_at stamp?",
             y: "A trigger guarantees it regardless of which application wrote the row",
             n: "Business logic in a trigger is action at a distance — very hard to debug" },
           { s: "Triggers can cascade into other triggers", n: "Which is how one insert becomes a ten-second operation." },
           "They are invisible in application code — document them prominently"] }
},

"Transaction": {
 ex: { h: "Moving money between two accounts",
       b: "The debit and the credit must both happen or neither must. There is no acceptable universe where the money leaves one account and does not arrive in the other — and a transaction is the mechanism that makes that guarantee rather than a hope." },
 fl: { t: "All or nothing",
       s: [{ s: "You tell the database a group of changes is beginning", n: "Everything from here until you finish is treated as one unit." },
           { s: "Take money out of the first account", n: "This has happened inside your group, but nobody else can see it yet." },
           { s: "Put the same money into the second account", n: "Also invisible from outside. Halfway through, the money exists in neither place — which is exactly why nobody may look." },
           { q: "Did anything go wrong — a broken rule, a crash, a clash with someone else?",
             y: "Undo the whole group. The database returns to exactly the state it was in before you began, as though you never started",
             n: "Commit, and both changes become visible to everyone at the same instant" },
           { s: "Keep these groups short", n: "While yours is open it holds rows reserved, and anyone else wanting them has to wait." }] }
},

"ACID": {
 ex: { h: "The four promises a bank makes about a transfer",
       b: "It happens completely or not at all; it leaves the books valid; concurrent transfers do not see each other half-done; and once confirmed it survives a power cut. Every one of those is something you would otherwise have to build yourself, badly." },
 fl: { t: "What each of the four letters promises",
       s: [{ s: "A is for all-or-nothing: every change in the group happens, or none of them does", n: "Money leaves one account and arrives in the other, or neither happens. Never just the first half." },
           { s: "C is for consistent: the rules you set are still true afterwards", n: "If a column must never be negative, no group of changes can leave it negative." },
           { s: "I is for isolated: while your group is half-finished, nobody else can see the mess", n: "Another person reading at that moment sees either the before picture or the after picture, never the middle." },
           { s: "D is for durable: once it says saved, it survives the power being pulled", n: "The database writes down what it is about to do before doing it, so it can finish after a crash." },
           { q: "Which of these gets given up first when a system spreads across many machines?",
             y: "Isolation and consistency — you accept that different machines are briefly out of step with each other",
             n: "That is a deliberate trade for speed and reliability, not something you get for free" }] }
},

"BASE": {
 ex: { h: "A noticeboard rather than a ledger",
       b: "Everyone will see the same thing eventually, and for a moment two people may see different versions. For a like count that is fine; for a bank balance it is not. BASE is a deliberate trade of consistency for availability and scale." },
 fl: { t: "Choosing between ACID and BASE",
       s: ["Data is replicated across nodes",
           { q: "Must every reader see the same value at the same instant?",
             y: "You need strong consistency — accept lower availability during a partition",
             n: "Eventual consistency lets every node stay writable" },
           { s: "*Eventually* is usually milliseconds", n: "But it is not zero, and your UI must tolerate it." },
           "Most systems are mixed — ACID for money, BASE for feeds and counters"] }
},

"Isolation Level": {
 ex: { h: "How much of other people's work in progress you can see",
       b: "Turn isolation up and you get correctness at the cost of concurrency; turn it down and queries get faster and stranger. The defaults differ between databases, which is why the same code behaves differently on MySQL and PostgreSQL." },
 fl: { t: "How much other people's half-finished work you can see",
       s: [{ s: "Many people use a database at once, and their changes overlap in time", n: "This setting decides how much of someone else's unfinished work your query is allowed to see." },
           { s: "Loosest: you can see changes other people have not finished making", n: "If they then undo them, you acted on something that never really happened. Almost nobody uses this." },
           { s: "Next: you only see finished changes — but two identical queries in a row can give different answers", n: "Because someone else finished a change in between. This is PostgreSQL's normal setting." },
           { s: "Next: the same query gives the same answer all the way through your group of changes", n: "As if you took a photograph at the start and read from that. MySQL's normal setting." },
           { s: "Strictest: the database behaves as though everyone took turns, one at a time", n: "Safest, and slowest, because it has to hold things back to achieve it." },
           { q: "Are you reading a value, working something out from it, then writing it back?",
             y: "Then the middle settings are not enough — two people can read the same starting value and one person's change gets silently lost",
             n: "Either lock the row as you read it, or use the strictest setting for that piece of work" }] }
},

"Deadlock": {
 ex: { h: "Two transactions each holding what the other needs",
       b: "One locked the customer row and wants the order row; the other did the reverse. Neither can proceed. The database detects the cycle and kills one — so your application must be ready to catch that error and retry." },
 fl: { t: "When two pieces of work block each other forever",
       s: [{ s: "While changing a row, a database reserves it so nobody else can change it at the same time", n: "Everyone else waits their turn. Normally that wait is over in a moment." },
           { s: "Now: your work reserves row A and wants row B. Someone else reserved row B and wants row A", n: "Neither will let go until it gets the other. Both wait forever." },
           { q: "Can you make everyone reserve rows in the same order?",
             y: "Yes — if everybody always takes the lower-numbered row first, this situation cannot arise at all",
             n: "If not, the database spots the circle and kills one of the two so the other can finish" },
           { s: "So catch that error and simply try again", n: "Under heavy use this is expected behaviour, not a bug in your code." },
           { s: "Keeping each group of changes short makes it far rarer", n: "Fewer rows held, for less time, means fewer chances to form a circle." }] }
},

"Normalisation": {
 ex: { h: "Storing each fact exactly once",
       b: "A customer's address lives in the customers table, not repeated on every order. Change it once and everything is correct — because there was never a second copy to forget about. That is the entire argument, and it is a strong one." },
 fl: { t: "Tidying data so nothing is stored twice",
       s: [{ s: "The problem: if a customer's address is copied onto every one of their orders, changing it means finding every copy", n: "Miss one and your data now disagrees with itself. Normalising is the cure." },
           { s: "First rule: one value per box. No cramming a list into a single cell", n: "Not `phone: 0712, 0899`. Two phone numbers means two rows." },
           { s: "Second rule: everything in a row must depend on the whole of what identifies that row", n: "If a row is identified by order plus product, the product's name belongs with the product, not repeated here." },
           { s: "Third rule: nothing in a row should depend on another ordinary column instead of the identifier", n: "The customer's city depends on the customer, so it lives on the customer — not copied onto every order." },
           { q: "Is that far enough?",
             y: "For almost every ordinary system, yes — those three rules remove nearly all the duplication that causes trouble",
             n: "Going further is mostly academic. Going the other way — deliberately duplicating to make reading faster — is a real and common choice" }] }
},

"Denormalisation": {
 ex: { h: "Writing the customer's name on the invoice",
       b: "Deliberately duplicating data so a read needs no join. It is right for reporting and for a historical record — an invoice should show the name at the time it was issued, not the current one — and it is a bug when it happens by accident." },
 fl: { t: "Denormalising on purpose",
       s: ["A read-heavy query is dominated by joins",
           { q: "Is the duplicated value a historical snapshot?",
             y: "Storing it is correct, not a compromise — invoices need the name as it was",
             n: "It is a cache: something must keep the copies in step" },
           { s: "Decide how updates propagate", n: "Triggers, application logic, or a scheduled rebuild." },
           "Normalise first, denormalise with evidence — a measured slow query"] }
},

"Schema": {
 ex: { h: "The blueprint for the filing system",
       b: "Which tables exist, which columns they have, what types, and which combinations are forbidden. The stricter it is, the more nonsense the database refuses on your behalf rather than leaving it for the application to catch — or not catch." },
 fl: { t: "Letting the database enforce the rules",
       s: ["You are designing a table",
           { q: "Can this column ever be empty?",
             y: "Leave it nullable, and handle NULL everywhere it is read",
             n: "NOT NULL — the database refuses bad rows regardless of which app wrote them" },
           { s: "Add CHECK constraints for value rules", n: "`CHECK (quantity > 0)` is enforced forever." },
           "Every constraint is a class of bug that can no longer reach your data"] }
},

"Database Migration": {
 ex: { h: "A numbered set of building alterations",
       b: "Each change is a file in version control, applied in order, so any environment can be rebuilt to the same schema. The alternative — someone running ALTER by hand on staging — is how environments drift apart and deploys start failing mysteriously." },
 fl: { t: "A safe schema change",
       s: ["Write the migration as a versioned file",
           { q: "Is it backward compatible with the running code?",
             y: "Deploy the migration first, then the code",
             n: "Split it: add the new column, backfill, switch reads, drop the old later" },
           { s: "Check whether the operation locks the table", n: "Adding a NOT NULL column with a default used to rewrite the whole table." },
           { s: "Never edit an applied migration", n: "Write a new one." },
           "Test it against a copy of production data, not an empty database"] }
},

"Referential Integrity": {
 ex: { h: "No invoices for customers who do not exist",
       b: "The database refuses to create an orphan, which means your reports never have to cope with one. It is enforcement rather than convention — and enforcement survives the new developer who did not read the wiki." },
 fl: { t: "Where orphans come from",
       s: ["Two tables are related by a foreign key",
           { q: "Is the constraint actually declared?",
             y: "Orphans are impossible — the database rejects them",
             n: "The application is trusted to check, and one code path will forget" },
           { s: "Deleting a parent needs a decision", n: "CASCADE, RESTRICT, or SET NULL — choose deliberately." },
           "Some ORMs default to application-level checks only — verify what is really in the schema"] }
},

"Constraint": {
 ex: { h: "A form that will not accept a negative age",
       b: "Validation in the application catches most of it; a constraint catches all of it, including the migration script, the admin tool and the analyst running an UPDATE by hand. It is the last line, and it never gets tired." },
 fl: { t: "The constraints worth using",
       s: [{ s: "NOT NULL", n: "The single most valuable one." },
           { s: "UNIQUE", n: "Prevents duplicate emails at the database level, not just in a check-then-insert race." },
           { s: "CHECK", n: "Value rules: quantity > 0, status in a known set." },
           { s: "FOREIGN KEY", n: "Referential integrity." },
           { q: "Adding one to an existing table?",
             y: "It will fail if existing rows violate it — clean the data first",
             n: "Constraints turn silent corruption into a loud error" }] }
},

"Aggregate Function": {
 ex: { h: "Summarising a column into one number",
       b: "COUNT, SUM, AVG, MIN, MAX. The trap that catches everyone is NULL: COUNT(*) counts rows, COUNT(column) skips NULLs, and AVG ignores them entirely rather than treating them as zero — which quietly changes the answer." },
 fl: { t: "The NULL trap",
       s: ["You aggregate a column that contains NULLs",
           { q: "Which count do you want?",
             y: "`COUNT(*)` counts every row, NULLs included",
             n: "`COUNT(col)` counts only non-NULL values — often a different number" },
           { s: "SUM and AVG ignore NULLs entirely", n: "AVG of (10, NULL, 20) is 15, not 10." },
           "Use COALESCE if NULL should be treated as zero — decide, do not inherit the default"] }
},

"Window Function": {
 ex: { h: "A running total on a bank statement",
       b: "Each line shows the balance so far, without collapsing the statement into one row. That is the difference from GROUP BY: window functions compute across a set of rows and still return every row — which is how you get rankings, running totals and *compared to last month*." },
 fl: { t: "What OVER does",
       s: ["Write an aggregate with an OVER clause",
           { s: "`SUM(amount) OVER (ORDER BY date)`", n: "A running total, with every row still present." },
           { q: "Need it restarted per group?",
             y: "`PARTITION BY customer_id` — a separate window per customer",
             n: "The window covers the whole result set" },
           { s: "ROW_NUMBER, RANK and LAG are the workhorses", n: "*Top 3 per category* and *change since last row* become one query." },
           "This replaces enormous amounts of application-side looping"] }
},

"Group By": {
 ex: { h: "Sorting receipts into piles, then totalling each",
       b: "One row out per pile. Which is why every column in the SELECT must either be grouped on or aggregated — asking for a customer's name alongside a total per country is asking which of thirty names should represent the pile." },
 fl: { t: "The error everyone hits",
       s: ["You GROUP BY country and SELECT customer_name",
           { q: "Which name should the row show?",
             y: "There are many — the database cannot choose, so it errors",
             n: "Either group by it too, or aggregate it: MAX(name), or STRING_AGG" },
           { s: "WHERE filters rows before grouping", n: "HAVING filters the groups afterwards." },
           "MySQL historically allowed this and picked arbitrarily — a source of silent wrong answers"] }
},

"NULL": {
 ex: { h: "A blank on a form, not a zero",
       b: "It means unknown, and unknown does not equal unknown — which is why `WHERE col = NULL` matches nothing at all, ever, and you must write `IS NULL`. Three-valued logic is the single most common source of surprising SQL results." },
 fl: { t: "Three-valued logic",
       s: ["A column contains NULL",
           { q: "Testing with `= NULL`?",
             y: "The result is UNKNOWN, not TRUE — no rows come back",
             n: "Use `IS NULL` or `IS NOT NULL`" },
           { s: "`NOT IN` with a NULL in the list returns nothing", n: "The classic silent empty result." },
           { s: "Aggregates skip NULLs; COUNT(*) does not", n: "Two different answers from the same data." },
           "COALESCE supplies a default; NOT NULL avoids the whole problem"] }
},

"NoSQL": {
 ex: { h: "A toolbox, not a single tool",
       b: "The name only says what these databases are not. A document store, a key-value cache, a graph database and a wide-column store have almost nothing in common with each other — the shared thread is relaxing relational guarantees to gain something else." },
 fl: { t: "Choosing a family",
       s: ["Relational is not fitting the access pattern",
           { q: "What shape is the data and the query?",
             y: "Nested documents fetched whole — document store",
             n: "Simple key lookups at huge speed — key-value" },
           { q: "Relationships are the query?",
             y: "Graph database — traversals rather than repeated joins",
             n: "Enormous write volume, known access patterns — wide-column" },
           "Most applications are still best served by PostgreSQL, which now does JSON well"] }
},

"Document Database": {
 ex: { h: "A folder per customer, not a row in fifteen tables",
       b: "Everything about one entity in one nested document, fetched in a single read. Excellent when you always want the whole thing — and awkward when you need to ask a question across all documents that the schema was not shaped for." },
 fl: { t: "Modelling for the query",
       s: ["Design the document around how it will be read",
           { q: "Is the related data always fetched together?",
             y: "Embed it — one read, no joins",
             n: "Reference it by id and accept a second query" },
           { s: "Embedding duplicates data", n: "Updating an embedded copy in a million documents is expensive." },
           { s: "Documents have a size limit", n: "An unbounded embedded array will eventually hit it." },
           "Schema flexibility means the application owns validation — use a schema layer"] }
},

"Key-Value Store": {
 ex: { h: "A cloakroom with numbered pegs",
       b: "Hand over a ticket, get the coat. No searching, no querying by colour, no joins — and because it does nothing else, it does that one thing at extraordinary speed. It is why Redis sits in front of so many databases." },
 fl: { t: "What it is good for",
       s: ["You need something by a known key",
           { q: "Do you ever need to query by value?",
             y: "Wrong store — it can only look up by key",
             n: "Sessions, caches, rate-limit counters, feature flags" },
           { s: "In-memory means microsecond latency", n: "And means you must plan for what happens when it restarts." },
           "Set a TTL on cache entries — unbounded growth eventually evicts what you needed"] }
},

"Wide-Column Store": {
 ex: { h: "A ledger designed around one specific question",
       b: "Cassandra makes you decide the query before you design the table, because the partition key determines everything about performance. That inversion feels wrong to a relational engineer and is precisely what lets it handle enormous write volume across many nodes." },
 fl: { t: "Designing around the query",
       s: ["Write down the queries you must serve",
           { s: "Choose the partition key from them", n: "It decides which node holds the data." },
           { q: "Is one partition much larger than the others?",
             y: "A hot partition — that node becomes the bottleneck",
             n: "Clustering columns give you ordering within a partition" },
           { s: "You cannot query on a non-key column efficiently", n: "You duplicate the data into another table shaped for that query." },
           "Denormalisation is the design, not a compromise"] }
},

"Graph Database": {
 ex: { h: "Asking who knows someone who knows someone",
       b: "In SQL that is a self-join per hop, and six hops is unmanageable. A graph database stores the relationships as first-class things, so traversal cost depends on the neighbourhood rather than the size of the whole dataset." },
 fl: { t: "When relationships are the query",
       s: ["Your queries follow chains of relationships",
           { q: "How many hops?",
             y: "Variable or deep — a graph database traverses in near-constant time per hop",
             n: "One or two — a relational join is fine and simpler to operate" },
           { s: "Fraud rings, recommendations and access hierarchies are the classic cases", n: "" },
           "For a mostly-relational application with one graph query, a recursive CTE may be enough"] }
},

"Vector Database": {
 ex: { h: "A library organised by meaning rather than title",
       b: "You hand it a paragraph and it returns the passages that mean something similar, even with no words in common. That is what makes retrieval-augmented generation work — and the caveat is that vectors from different embedding models occupy different spaces entirely." },
 fl: { t: "One similarity search",
       s: ["Documents are chunked and embedded at ingest time",
           { s: "Vectors are stored with an ANN index", n: "HNSW or IVF — approximate, because exact is too slow." },
           { s: "The query is embedded with the same model", n: "Different model, meaningless results." },
           { q: "Need filtering as well as similarity?",
             y: "Metadata filters — check your store does them pre-search, not post",
             n: "Return the nearest k and rerank before sending to the model" },
           "Changing embedding model means re-embedding everything — a real migration"] }
},

"Time-Series Database": {
 ex: { h: "A recorder that only ever appends",
       b: "Metrics arrive constantly, are almost never updated, and are queried by time range and then aggregated. A store built around that pattern compresses far better and answers *average CPU over the last hour* far faster than a general-purpose database can." },
 fl: { t: "Why a specialised store wins here",
       s: ["Data is timestamped and append-only",
           { s: "Storage is columnar and heavily compressed", n: "Similar adjacent values compress extremely well." },
           { q: "How is it queried?",
             y: "Always by time range, then downsampled — the index is built for exactly that",
             n: "Rarely by individual point, almost never updated" },
           { s: "Retention policies downsample or drop old data automatically", n: "Second-level data for a week, hourly for a year." },
           "TimescaleDB gives you this inside PostgreSQL if you would rather not add a system"] }
},

"CAP Theorem": {
 ex: { h: "A phone line between two offices going down",
       b: "Both offices can keep working and disagree, or one can refuse to act until the line is back. Those are the only options — you do not get to choose partition tolerance, because networks fail. The real choice is what to do when they do." },
 fl: { t: "The choice you actually make",
       s: ["The network partitions — some nodes cannot reach others",
           { q: "What should the isolated side do?",
             y: "Keep serving, possibly returning stale data — AP",
             n: "Refuse to serve rather than risk inconsistency — CP" },
           { s: "You cannot pick CA", n: "Partitions happen whether you planned for them or not." },
           { s: "PACELC extends it", n: "Even without a partition, you trade latency against consistency." },
           "Most systems are per-operation, not per-database — strong for payments, eventual for feeds"] }
},

"Eventual Consistency": {
 ex: { h: "A rumour reaching everyone eventually",
       b: "You update your profile picture and a friend still sees the old one for a few seconds. Perfectly acceptable there, and catastrophic for an account balance. The engineering skill is knowing which of your data is which." },
 fl: { t: "Building a screen that copes with the delay",
       s: [{ s: "A change is saved on one machine and then spread to the others", n: "Usually within a few thousandths of a second, but not instantly and not always." },
           { s: "So for a brief moment, different machines genuinely disagree about the truth", n: "Ask two of them and you can get two different answers. Eventually they agree — hence the name." },
           { q: "What happens when someone saves and immediately reloads?",
             y: "Either read from the main machine for that person, or just show them what they typed and trust it saved",
             n: "Otherwise their change appears to disappear, which is the single most confusing thing a screen can do" },
           { s: "Make repeat requests harmless", n: "If a user taps save twice, the second attempt must not create a second copy." },
           { s: "Be honest on screen about what is saved and what is still syncing", n: "A small pending indicator beats pretending everything is instant and being caught out." }] }
},

"Sharding": {
 ex: { h: "Splitting the phone book across ten offices by surname",
       b: "Each office holds a manageable slice. It is the only way past what one machine can hold — and it means any question spanning several offices now needs coordination, and a badly chosen split leaves one office swamped." },
 fl: { t: "Splitting one database across many machines",
       s: [{ s: "You have outgrown a single machine — the data no longer fits, or the writes no longer keep up", n: "This is a big step. Take it only after cheaper options are genuinely exhausted." },
           { s: "The idea: split the rows across several machines, each holding a slice", n: "Customers A to M here, N to Z there. Each machine holds part of the whole." },
           { s: "You pick one column to decide which machine a row lives on", n: "This single choice is the most important decision in the whole design, and it is very hard to change later." },
           { q: "Does that choice spread the load evenly *and* match how you query?",
             y: "Then most queries touch exactly one machine, which is fast and simple",
             n: "Then every query has to ask all the machines and combine the answers, which is slow, fragile, and gets worse as you add machines" },
           { s: "Watch for one machine getting all the traffic", n: "Splitting by date puts every single one of today's writes on one machine while the others sit idle." },
           { s: "Anything that spans two machines becomes your problem, not the database's", n: "Joining across the split, and all-or-nothing changes across it, stop being automatic." }] }
},

"Replication": {
 ex: { h: "Carbon copies of the ledger in three offices",
       b: "Reads can be served anywhere and a fire in one office does not lose the books. The copies lag slightly behind the original, which is why a user who just saved something can reload and see the old version if their read went to a replica." },
 fl: { t: "Copies, and the delay between them",
       s: [{ s: "One machine takes all the writes. Copies of it take the reads", n: "This spreads the reading load, and gives you a spare if the main one dies." },
           { s: "Every change is sent to the copies as it happens", n: "Usually they are a few thousandths of a second behind. Under heavy load it can stretch to seconds." },
           { q: "What if someone saves a change and immediately reloads the page?",
             y: "Send that person's reads to the main machine for a moment, so they always see their own work",
             n: "Otherwise their change appears to vanish and then come back, which looks exactly like a bug" },
           { s: "Track how far behind the copies are, and treat it as a number that matters", n: "A copy hours behind is not a spare — promoting it after a failure means losing hours of data." },
           { s: "You can make writes wait until the copies confirm", n: "That removes the delay entirely and makes every single write slower. Sometimes worth it." }] }
},

"Query Plan": {
 ex: { h: "The route the satnav chose, before you set off",
       b: "EXPLAIN shows which indexes it will use, which order it will join in, and how many rows it expects. Reading it is the single highest-return database skill, because it turns *this is slow* into *it is scanning two million rows here*." },
 fl: { t: "Reading one",
       s: ["Run EXPLAIN ANALYZE on the slow query",
           { q: "Do you see a sequential scan on a large table?",
             y: "A missing index, or a WHERE clause the index cannot be used for",
             n: "Compare estimated rows against actual" },
           { q: "Are the estimates far off?",
             y: "Statistics are stale — run ANALYZE",
             n: "Look at the deepest, most expensive node first" },
           "A function applied to an indexed column disables the index — index the expression instead"] }
},

"Query Optimiser": {
 ex: { h: "A dispatcher who knows the traffic",
       b: "You describe the destination; it picks the route based on table statistics — how many rows, how distinct the values, what indexes exist. When it picks badly, the usual reason is that the statistics no longer reflect the data." },
 fl: { t: "Why a fast query suddenly turns slow",
       s: [{ s: "You describe what you want; the database works out how to get it", n: "It considers several routes and picks the one it thinks is cheapest." },
           { s: "To choose, it relies on rough notes about your data — roughly how many rows, roughly how varied each column is", n: "Those notes are gathered periodically, not continuously." },
           { q: "Has the data changed shape a lot since those notes were taken?",
             y: "Then it is choosing based on a picture that is out of date. Ask the database to refresh its notes, then check again",
             n: "Otherwise look for something in your query that quietly stops it using an index" },
           { s: "Wrapping a column in a function is the usual culprit", n: "Searching on the year part of a date cannot use an index built on the whole date." },
           { s: "You can override its choice, but treat that as a last resort", n: "It made sense when you wrote it and will be wrong once the data has grown." }] }
},

"Full Table Scan": {
 ex: { h: "Reading every page to find one paragraph",
       b: "Sometimes correct — on a small table, or when you genuinely want most of the rows, it beats index lookups. On a ten-million-row table filtered to three rows, it is the single most common cause of a slow query." },
 fl: { t: "Deciding whether it is a problem",
       s: ["EXPLAIN shows a sequential scan",
           { q: "How many rows does the query return?",
             y: "A tiny fraction — you want an index on the filtered column",
             n: "Most of the table — a scan is genuinely the fastest option" },
           { s: "Check why an existing index was not used", n: "A function on the column, a type mismatch, or stale statistics." },
           "Small tables are scanned deliberately — an index lookup would cost more"] }
},

"N+1 Query Problem": {
 ex: { h: "Phoning each supplier separately instead of sending one list",
       b: "You fetch fifty orders in one query, then loop and fetch each order's customer — fifty-one queries where two would do. It is almost always an ORM doing lazy loading inside a loop, and it is the most common performance bug in application code." },
 fl: { t: "Spotting and fixing it",
       s: ["A page is slow and the database is busy",
           { q: "Does the query log show the same query repeated with different ids?",
             y: "Classic N+1 — one per item in a loop",
             n: "Look for lazy-loaded relations accessed inside iteration" },
           { s: "Fix by eager loading", n: "`includes` in Rails, `selectinload` in SQLAlchemy, DataLoader in GraphQL." },
           { s: "Two queries instead of fifty-one", n: "Or one, with a join." },
           "Add a query counter to your tests so a regression fails the build"] }
},

"ORM": {
 ex: { h: "An interpreter between two languages that see the world differently",
       b: "Objects have references and inheritance; tables have rows and joins. An ORM bridges that and saves enormous boilerplate — and it hides the SQL, which is exactly how N+1 problems and accidental full table scans get shipped." },
 fl: { t: "Using one without losing control",
       s: ["The ORM generates SQL from your object calls",
           { q: "Do you know what SQL it produced?",
             y: "Log it in development — that habit prevents most ORM performance bugs",
             n: "You will ship an N+1 or a query loading a hundred columns you do not need" },
           { s: "Eager load relations you will access", n: "Explicitly, not by accident." },
           "Drop to raw SQL for complex reporting — that is not a failure, it is the right tool"] }
},

"Connection Pool": {
 ex: { h: "A taxi rank, not calling a new cab each time",
       b: "Opening a database connection costs milliseconds and the server can only hold so many. A pool keeps a set open and hands them out — and pool exhaustion, where every connection is held by a slow query, is why a request queue suddenly stops moving." },
 fl: { t: "Sizing it, and diagnosing exhaustion",
       s: ["The application borrows a connection per request",
           { q: "Are requests timing out waiting for one?",
             y: "The pool is exhausted — usually long queries or leaked connections",
             n: "Return connections in a `finally` — always" },
           { s: "Bigger is not better", n: "Pool size × instances must stay under the server's limit." },
           { s: "Serverless breaks this model", n: "Thousands of functions each want a pool — use a proxy like PgBouncer." },
           "Set a statement timeout so one bad query cannot hold a connection forever"] }
},

"OLTP": {
 ex: { h: "The tills in a supermarket",
       b: "Thousands of small, fast, individual transactions — read a row, write a row, commit. Optimised for concurrency and correctness on single records, which is exactly the opposite of what a *sales by region for the last three years* query wants." },
 fl: { t: "Recognising the workload",
       s: ["Requests are small and numerous",
           { s: "Read or write a handful of rows by key", n: "Latency measured in milliseconds." },
           { q: "Is the storage row-oriented?",
             y: "Right for OLTP — a whole row is fetched in one read",
             n: "Columnar storage would be wrong here" },
           "Never run heavy analytics against your OLTP primary — use a replica or a warehouse"] }
},

"OLAP": {
 ex: { h: "The quarterly report, not the till",
       b: "One query touching two hundred million rows and returning twelve numbers. It wants columnar storage, aggressive compression and parallelism — and it would bring a transactional database to its knees, which is why the two workloads get separate systems." },
 fl: { t: "Why it needs a different system",
       s: ["A query scans a very large fraction of a table",
           { s: "It reads few columns from very many rows", n: "Columnar storage reads only those columns." },
           { q: "Running it against the production database?",
             y: "It competes with the tills for resources — separate it",
             n: "Load into a warehouse via ETL or CDC" },
           "Pre-aggregation and materialised views are the usual accelerators here"] }
},

"Columnar Storage": {
 ex: { h: "Filing by column instead of by row",
       b: "To average one column across a hundred million rows you read only that column — not a hundred million whole rows. Adjacent values are similar, so compression is excellent. It is the single reason analytical databases are so much faster at analytical queries." },
 fl: { t: "Why it is faster for analytics",
       s: ["A query aggregates one column across many rows",
           { q: "Row-oriented storage?",
             y: "Every row is read from disk in full, including columns you never asked for",
             n: "Columnar reads only the requested column" },
           { s: "Similar adjacent values compress heavily", n: "Ten to one is ordinary." },
           "Terrible for OLTP — reassembling one whole row means touching every column file"] }
},

"PostgreSQL": {
 ex: { h: "The sensible default",
       b: "Fully relational, standards-compliant, and it has quietly absorbed most of the reasons people left for NoSQL — JSONB with indexing, full-text search, geospatial, and vector search through pgvector. For most projects, *use Postgres* is the correct answer." },
 fl: { t: "Why it keeps winning",
       s: ["You need a database for a new project",
           { q: "Do you have a specific, measured reason not to?",
             y: "Use that system for that need — and probably Postgres for everything else",
             n: "Postgres: ACID, JSONB, full-text, geospatial, vectors, MVCC" },
           { s: "MVCC gives readers a consistent snapshot", n: "Readers never block writers." },
           "Watch autovacuum on write-heavy tables — bloat is the classic operational surprise"] }
},

"MySQL": {
 ex: { h: "The database that ran the early web",
       b: "Fast, familiar, and everywhere — the M in LAMP. Historically more permissive than Postgres about invalid data, which is why strict mode matters, and its default REPEATABLE READ isolation makes it behave differently in ways that surprise people moving between the two." },
 fl: { t: "Differences worth knowing",
       s: ["You are working with MySQL",
           { s: "InnoDB is the engine — transactional and row-locking", n: "MyISAM is legacy; do not use it." },
           { q: "Is strict mode on?",
             y: "Invalid values are rejected rather than silently truncated",
             n: "Historic defaults would quietly store a wrong value" },
           { s: "Default isolation is REPEATABLE READ", n: "Postgres defaults to READ COMMITTED — behaviour differs." },
           "Use utf8mb4, never utf8 — the latter cannot store emoji"] }
},

"SQLite": {
 ex: { h: "A database that is just a file",
       b: "No server, no configuration, no port. It is in every phone, every browser and most desktop applications, and it is astonishingly reliable. The limit is concurrent writers — one at a time — which rules it out for a busy multi-user web application, and rules it in for almost everything else." },
 fl: { t: "Is it enough?",
       s: ["You need to store structured data",
           { q: "How many concurrent writers?",
             y: "One at a time — a single app, a CLI tool, a mobile client",
             n: "Many — you need a server-based database" },
           { s: "Enable WAL mode", n: "Readers no longer block on the writer." },
           "Read-heavy web applications on one machine can genuinely run on it"] }
},

"MongoDB": {
 ex: { h: "Storing the whole customer folder as one document",
       b: "Flexible schema and a natural fit when your data is genuinely document-shaped. The reputational damage came from early defaults that were unsafe, all long since fixed — and from teams using it as a schema-less dumping ground, which is a design choice rather than a database flaw." },
 fl: { t: "Using it well",
       s: ["Model the document around the read pattern",
           { q: "Is the related data always fetched together?",
             y: "Embed it — one round trip",
             n: "Reference by id; `$lookup` exists but is not a cheap join" },
           { s: "Use schema validation", n: "Flexible does not mean unvalidated." },
           { s: "Transactions across documents exist now", n: "But single-document atomicity is the natural unit." },
           "Index deliberately — a collection scan at scale is as bad as anywhere else"] }
},

"Redis": {
 ex: { h: "The scratchpad next to the filing cabinet",
       b: "Everything in memory, so operations take microseconds. It is a cache, a session store, a rate limiter, a queue and a pub/sub bus — and because it is in memory, you must decide explicitly what happens to the contents when it restarts." },
 fl: { t: "Choosing the right structure",
       s: ["You need fast shared state",
           { q: "What shape?",
             y: "Counter — `INCR`, atomic and ideal for rate limiting",
             n: "Ordered set for leaderboards, list for a simple queue, hash for an object" },
           { s: "Set a TTL on cache keys", n: "Otherwise memory fills and eviction removes the wrong things." },
           { s: "Decide on persistence", n: "RDB snapshots, AOF, or accept that a restart loses everything." },
           "Single-threaded for commands — one slow `KEYS *` blocks every client"] }
},

"Cassandra": {
 ex: { h: "Designed so no single node is special",
       b: "Every node is equal, writes go anywhere, and it keeps running when several nodes are lost. That availability comes from giving up joins, giving up ad-hoc queries, and designing every table around one specific question you already know you will ask." },
 fl: { t: "Designing a table",
       s: ["Write down the query first",
           { s: "Choose the partition key from it", n: "It decides which node stores the row." },
           { q: "Is the data evenly distributed?",
             y: "Writes and reads spread across the cluster",
             n: "A hot partition makes one node the bottleneck for everyone" },
           { s: "Need a second query shape? Make a second table", n: "Duplication is the intended design." },
           "Tunable consistency per query — quorum reads and writes give strong consistency when needed"] }
},

"DynamoDB": {
 ex: { h: "A managed key-value store that never falls over",
       b: "AWS operates it and it scales without you thinking about nodes. The trade is the same as Cassandra's: you design around access patterns rather than around the data, and a query the table was not designed for is either impossible or expensive." },
 fl: { t: "Single-table design",
       s: ["List every access pattern before designing anything",
           { s: "Partition key plus sort key define what is efficient", n: "Everything else needs a secondary index or a scan." },
           { q: "Need a different access pattern later?",
             y: "Add a global secondary index — extra cost and eventual consistency",
             n: "A scan reads the whole table and will surprise you on the bill" },
           { s: "Watch hot partitions", n: "Throughput is per partition, not just per table." },
           "Cost is per read and write unit — model it before you commit"] }
},

"Neo4j": {
 ex: { h: "A database where the relationships are the point",
       b: "Cypher lets you write the shape of the pattern you are looking for — a path from this person, through any number of friendships, to someone with this property — and the engine follows the pointers rather than joining tables repeatedly." },
 fl: { t: "Why traversal is cheap",
       s: ["Nodes store direct pointers to their relationships",
           { q: "What does one hop cost?",
             y: "Following a pointer — independent of total dataset size",
             n: "A SQL self-join re-searches an index for every hop" },
           { s: "Cypher expresses the pattern visually", n: "`(a)-[:KNOWS*1..3]->(b)` — up to three hops." },
           "For one occasional hierarchy query, a recursive CTE may save you a whole system"] }
},

"Elasticsearch": {
 ex: { h: "A search engine you run yourself",
       b: "Built around the inverted index, so it finds documents by their words at enormous speed, with relevance ranking, fuzzy matching, facets and highlighting. It is a search system, not a database of record — the source of truth belongs somewhere else." },
 fl: { t: "How a document becomes searchable",
       s: ["A document is indexed",
           { s: "Analysers tokenise, lowercase and stem the text", n: "*running* and *ran* both become *run*." },
           { s: "Terms are written into the inverted index", n: "Word to list of documents." },
           { q: "A query arrives?",
             y: "The same analysis is applied, the postings lists are intersected, and results are scored",
             n: "Mismatched analysers at index and query time is the classic *why no results*" },
           "Never make it the system of record — reindex from your primary database"] }
},

"ClickHouse": {
 ex: { h: "Built for one enormous aggregate at a time",
       b: "Columnar, vectorised, and startlingly fast at scanning billions of rows to produce a handful of numbers. It is not a transactional database — updates and deletes are awkward by design — and for analytics at scale it is very hard to beat." },
 fl: { t: "Where it fits",
       s: ["You need analytics over billions of rows",
           { q: "Is the workload append-mostly and read-heavy?",
             y: "ClickHouse — columnar storage, heavy compression, vectorised execution",
             n: "Frequent updates and deletes fight the design" },
           { s: "The primary key defines sort order, not uniqueness", n: "Which surprises people arriving from Postgres." },
           "Materialised views pre-aggregate on insert — that is where much of the speed comes from"] }
},

"Snowflake": {
 ex: { h: "Renting compute by the hour, separately from storage",
       b: "The data sits in cloud storage; you spin up a warehouse to query it and turn it off afterwards. Two teams can run heavy queries at the same time without competing, because they are on separate compute — which is the architectural idea that made it." },
 fl: { t: "Separating storage from compute",
       s: ["Data lives once in cloud object storage",
           { s: "A virtual warehouse is compute you start and stop", n: "Sized independently of the data." },
           { q: "Two teams both running heavy queries?",
             y: "Give each its own warehouse — no contention at all",
             n: "You pay per second of compute, so idle costs nothing" },
           { s: "Auto-suspend is the main cost control", n: "A warehouse left running overnight is a memorable invoice." },
           "Time travel lets you query the table as it was — excellent for recovering a bad update"] }
},

"BigQuery": {
 ex: { h: "Handing a query to a data centre",
       b: "You do not provision anything. A query is dispatched across thousands of machines and returns in seconds over terabytes. The cost model is per byte scanned — which means `SELECT *` on a large table is a genuinely expensive keystroke." },
 fl: { t: "Controlling the bill",
       s: ["A query is submitted",
           { q: "How many bytes will it scan?",
             y: "The console tells you before you run it — read that number",
             n: "You are billed for it whether or not you needed the columns" },
           { s: "Select only the columns you need", n: "`SELECT *` scans everything, always." },
           { s: "Partition by date and cluster by common filters", n: "Partition pruning is the biggest single saving." },
           "Set a maximum bytes billed on every query to cap accidents"] }
},

"Full-Text Search": {
 ex: { h: "Finding documents by what they say, not by exact string",
       b: "`LIKE '%running%'` cannot use an index and misses *ran*. Full-text search tokenises, stems and ranks — so a search for *run* finds all of them and puts the most relevant first, which is what users actually expect." },
 fl: { t: "Why LIKE is not search",
       s: ["Users need to search text",
           { q: "Using `LIKE '%term%'`?",
             y: "It scans every row and matches only exact substrings",
             n: "Full-text index: tokenised, stemmed, and ranked by relevance" },
           { s: "Postgres has `tsvector` built in", n: "Often enough without adding Elasticsearch." },
           "The analyser must match at index time and query time, or you get no results"] }
},

"Inverted Index": {
 ex: { h: "The index at the back of a book, turned inside out",
       b: "Instead of *page 47 contains these words*, it stores *this word appears on pages 47, 92 and 310*. Every search engine is built on it, because answering a query becomes intersecting a few short lists rather than reading everything." },
 fl: { t: "Answering a two-word query",
       s: ["Each term maps to a sorted list of document ids",
           { s: "Look up the list for each term", n: "Two lookups, not a scan." },
           { s: "Intersect the lists", n: "Documents containing both." },
           { q: "How are results ordered?",
             y: "By a relevance score — term frequency against document frequency, plus length",
             n: "Positions are also stored, which is what enables phrase search" }] }
},

"Backup": {
 ex: { h: "A spare key you have never tested",
       b: "The only thing that matters is whether you can restore, and the only way to know is to have done it recently. Untested backups fail at exactly the moment you need them, and *the backup job reported success* is not the same as *the data is recoverable*." },
 fl: { t: "A backup strategy that works",
       s: ["Take regular full backups plus continuous log archiving",
           { s: "3-2-1: three copies, two media, one off-site", n: "And one immutable, against ransomware." },
           { q: "When did you last restore one?",
             y: "Then you know your recovery time and that it works",
             n: "You have a backup job, not a backup" },
           { s: "Know your RPO and RTO", n: "How much data you can lose, and how long recovery may take." },
           "Replication is not a backup — it faithfully replicates the DROP TABLE too"] }
},

"Optimistic Locking": {
 ex: { h: "Assuming nobody else edited the document",
       b: "Rather than locking the row for the whole time a user has the form open, you check on save whether the version number still matches. Usually it does, and you avoided holding a lock for five minutes. When it does not, you tell the user rather than silently overwriting." },
 fl: { t: "Preventing a lost update",
       s: ["A row is read, including its version number",
           { s: "The user edits it — no lock is held", n: "Which is the whole point." },
           { s: "On save: `UPDATE ... WHERE id = ? AND version = ?`", n: "And increment the version." },
           { q: "Did it update zero rows?",
             y: "Somebody else changed it — show the conflict rather than overwriting",
             n: "The write succeeded and the version moved on" },
           "Pessimistic locking is the alternative — correct, and it holds a lock the whole time"] }
}

});
