/* ==========================================================================
   Depth pass 1 — the entries people look up most.

   Each block here is merged onto an existing term by slug. Nothing is
   replaced: the definition, paragraphs, key points, example and flow all
   stay exactly as written. These add the four reasoning sections:

     why    the problem it was invented for, and what came before
     num    real figures, so "faster" stops being an adjective
     miss   the wrong mental models people actually hold
     trade  what it buys, what it costs, when not to reach for it

   Written to be read by someone who already knows the definition and wants
   to know whether they actually understand it. The test is: after reading,
   could you defend a design decision that uses this, and could you say why
   you would *not* use it.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "big-o-notation",

      why: {
        before: "People compared algorithms by timing them. That works until " +
          "you change machine, compiler, or input size — then the ranking flips " +
          "and nobody can say why.",
        problem: "A stopwatch measures *this run on this hardware*. It cannot " +
          "tell you what happens at ten times the input, which is the only " +
          "question that matters when you are choosing between two approaches.",
        shift: "Big O throws away hardware, constants and small inputs on " +
          "purpose, and keeps the one thing that survives all of them: the " +
          "*shape* of the growth curve. `2n² + 500n + 9000` is `O(n²)`, because " +
          "once n is large enough the `n²` is the only term that matters."
      },

      num: {
        t: "Operations as n grows",
        h: ["Complexity", "n = 10", "n = 1,000", "n = 1,000,000"],
        r: [
          ["`O(1)`", "1", "1", "1"],
          ["`O(log n)`", "3", "10", "20"],
          ["`O(n)`", "10", "1,000", "1,000,000"],
          ["`O(n log n)`", "33", "10,000", "20,000,000"],
          ["`O(n²)`", "100", "1,000,000", "10¹²"],
          ["`O(2ⁿ)`", "1,024", "10³⁰¹", "—"]
        ],
        n: "At a billion operations a second, the `O(n²)` row for a million " +
          "items takes about **16 minutes**; the `O(n log n)` row takes " +
          "**0.02 seconds**. That is the entire practical argument for caring " +
          "about complexity. The `O(2ⁿ)` row at n = 1,000 is a number with 301 " +
          "digits — there is no hardware answer to it, only a better algorithm."
      },

      miss: [
        {
          w: "Big O tells you how fast the code is.",
          r: "It tells you how the cost *grows*. An `O(n)` algorithm with a huge " +
            "constant can lose badly to an `O(n²)` one at every size you " +
            "actually run. This is why real sort implementations switch to " +
            "insertion sort below ~16 elements — `O(n²)` with a tiny constant " +
            "beats `O(n log n)` with a large one on small inputs."
        },
        {
          w: "`O(n²)` is always too slow.",
          r: "It is fine when n is small and stays small. Checking every pair " +
            "of 20 items is 400 operations, which is instant. The danger is not " +
            "the exponent — it is not knowing what n is, or assuming today's n " +
            "is tomorrow's."
        },
        {
          w: "Big O describes the average case.",
          r: "It describes an *upper bound*, which by default people quote for " +
            "the worst case. Quicksort is `O(n²)` worst case and `O(n log n)` " +
            "on average, and the average is why everyone uses it. Always ask " +
            "which case a number refers to."
        },
        {
          w: "Dropping the constants means constants do not matter.",
          r: "They matter enormously in practice — they are dropped because " +
            "they are not *portable*, not because they are small. A 3× constant " +
            "is a 3× cloud bill. Big O is the first question you ask about an " +
            "algorithm, not the last."
        }
      ],

      trade: {
        buys: [
          "A comparison that survives changing hardware, language and compiler.",
          "A way to reason about an algorithm before writing it.",
          "A shared vocabulary — `O(n log n)` means the same thing to everyone."
        ],
        costs: [
          "Hides constants, which is where real-world performance often lives.",
          "Says nothing about memory access patterns, and a cache miss is ~100× " +
            "a cache hit — an `O(n)` scan over an array routinely beats `O(log n)` " +
            "over a pointer structure.",
          "Says nothing at all about small inputs."
        ],
        avoid: [
          "You are optimising a hot path with a fixed, known input size — " +
            "**measure it**, do not reason about it.",
          "The two candidates have the same complexity. Big O cannot separate " +
            "them; only a profiler can.",
          "The bottleneck is I/O, network or a lock. Then the algorithm's " +
            "complexity is irrelevant to the wall clock."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "index",

      why: {
        before: "Finding a row meant reading every row — a full table scan. " +
          "Fine for a thousand rows, ruinous for a million.",
        problem: "The cost is not the comparison, it is the **disk seek**. A " +
          "spinning disk seek is ~10ms; even an SSD read is ~0.1ms against " +
          "roughly 100ns for RAM. Reading a million rows to return one is " +
          "millions of times more work than the answer is worth.",
        shift: "A B-tree keeps keys sorted and *wide* — hundreds of keys per " +
          "node — so the tree stays only three or four levels deep even at a " +
          "billion rows. Every design choice in it follows from one fact: a " +
          "seek costs vastly more than a comparison, so minimise seeks even if " +
          "it means more comparisons."
      },

      num: {
        t: "Finding one row in a 1,000,000-row table",
        h: ["Approach", "Pages read", "Time at 0.1ms/page"],
        r: [
          ["Full table scan", "~12,500", "1.25s"],
          ["B-tree index", "~4", "0.4ms"],
          ["Index + row fetch", "~5", "0.5ms"]
        ],
        n: "Roughly **3,000× fewer reads**. The tree's depth grows " +
          "*logarithmically*: going from a million rows to a billion takes it " +
          "from about 4 levels to about 6 — a thousand times the data for one " +
          "and a half times the work. That is the whole point of the structure. " +
          "The cost is on the other side: each index typically adds **10–15%** " +
          "to write time, because every `INSERT`, `UPDATE` and `DELETE` must " +
          "update every index too."
      },

      miss: [
        {
          w: "Indexes make the database faster.",
          r: "They make **reads** faster and **writes** slower. A table with " +
            "eight indexes does nine writes for every one you asked for. On a " +
            "write-heavy table that is a real and often decisive cost."
        },
        {
          w: "Put an index on every column in the `WHERE` clause.",
          r: "A composite index on `(a, b, c)` serves queries filtering on " +
            "`a`, on `a, b`, and on `a, b, c` — but **not** `b` alone or `c` " +
            "alone. It is a phone book sorted by surname then first name: " +
            "useless for finding everyone called *James*. Column order is the " +
            "whole design."
        },
        {
          w: "The database will use my index because it exists.",
          r: "The planner decides, and it will ignore an index it judges " +
            "unhelpful — usually when the query returns a large fraction of the " +
            "table (a scan is cheaper than many random fetches), or when the " +
            "column is low-cardinality. An index on a boolean `is_active` is " +
            "almost always dead weight."
        },
        {
          w: "An index on `email` helps `WHERE lower(email) = ?`.",
          r: "It does not. Wrapping the column in a function makes the index " +
            "unusable — the tree stores `email`, not `lower(email)`. You need " +
            "an expression index on `lower(email)` instead. The same trap " +
            "catches `WHERE date_col + interval '1 day' > now()`."
        }
      ],

      trade: {
        buys: [
          "`O(log n)` lookups instead of `O(n)` scans.",
          "Sorted output for free when `ORDER BY` matches the index order.",
          "**Covering** reads: if the index holds every column the query wants, " +
            "the table is never touched at all."
        ],
        costs: [
          "10–15% slower writes per index, paid on every insert and update.",
          "Storage, typically 2–5% of table size per index.",
          "More work for the query planner, and more ways for it to choose wrong."
        ],
        avoid: [
          "The table is small — under a few thousand rows a scan usually wins, " +
            "and the planner knows it.",
          "The column has very few distinct values, like a status flag with " +
            "three states.",
          "The workload is overwhelmingly writes, such as an append-only event " +
            "log you query rarely.",
          "The query returns most of the table anyway — a scan is the cheaper " +
            "plan and the planner will pick it regardless."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hash-table",

      why: {
        before: "Finding a value by name meant scanning a list, `O(n)`, or " +
          "keeping it sorted and binary-searching, `O(log n)` with the cost of " +
          "keeping order on every insert.",
        problem: "Both spend work *searching*. But an array already has `O(1)` " +
          "access — if you know the position. The problem is that keys are " +
          "words, not positions.",
        shift: "Compute the position from the key. A hash function turns any " +
          "key into a number, that number modulo the array size is a slot, and " +
          "lookup becomes arithmetic instead of search. You are trading memory " +
          "(the array is deliberately kept partly empty) for time."
      },

      num: {
        t: "Lookup in a structure of 1,000,000 items",
        h: ["Structure", "Comparisons", "Note"],
        r: [
          ["Unsorted array", "500,000 avg", "scan"],
          ["Sorted array", "20", "binary search"],
          ["Balanced tree", "20", "plus pointer chasing"],
          ["Hash table", "1–2", "at ~0.75 load factor"]
        ],
        n: "The catch is in *average*. All hash tables degrade to `O(n)` when " +
          "every key lands in one slot. Load factor is the dial: at **0.75** " +
          "(three quarters full) you average about 1.5 probes; push past **0.9** " +
          "and it climbs sharply, which is why implementations resize — " +
          "typically doubling and rehashing everything — before they get there. " +
          "That resize is a single `O(n)` pause, which is why hash tables are " +
          "**amortised** `O(1)`, not guaranteed `O(1)`."
      },

      miss: [
        {
          w: "Hash tables are `O(1)`, full stop.",
          r: "They are `O(1)` *amortised, on average, with a good hash " +
            "function*. Worst case is `O(n)` — every key colliding into one " +
            "bucket. This is a real attack: send requests whose keys all hash " +
            "to the same slot and a server's dictionary turns into a linked " +
            "list. It is why modern runtimes seed their hash functions randomly " +
            "at startup."
        },
        {
          w: "A good hash function is one that avoids collisions.",
          r: "Collisions are unavoidable — you are mapping infinite keys into " +
            "finite slots. By the birthday paradox, 23 random keys in 365 slots " +
            "already collide half the time. A good hash function *distributes " +
            "evenly*; the table's job is to handle the collisions that remain."
        },
        {
          w: "Hash tables preserve insertion order.",
          r: "Not inherently — order depends on hash values and table size, and " +
            "can change entirely on resize. Some languages guarantee order " +
            "anyway (JavaScript objects, Python 3.7+ dicts) by keeping a " +
            "separate list. Go deliberately *randomises* iteration order so you " +
            "cannot accidentally depend on it."
        },
        {
          w: "I can use any object as a key.",
          r: "Only if its hash and its equality agree, and neither changes " +
            "while it is in the table. Mutate a key after inserting it and the " +
            "entry becomes unreachable — it is sitting in the slot for its old " +
            "hash. This is why keys should be immutable."
        }
      ],

      trade: {
        buys: [
          "`O(1)` average insert, lookup and delete.",
          "Simple to reason about and available in every language.",
          "No ordering work on insert."
        ],
        costs: [
          "Memory: kept deliberately partly empty, typically 1.3–2× the data.",
          "No ordering at all — no *next largest key*, no range queries.",
          "Occasional `O(n)` resize pauses, bad for latency-sensitive paths.",
          "Poor cache locality compared to an array scan; the whole point is " +
            "that access is scattered."
        ],
        avoid: [
          "You need range queries or sorted iteration — use a **B-tree** or a " +
            "balanced tree.",
          "You need guaranteed worst-case latency, as in real-time systems; " +
            "the resize pause is unacceptable.",
          "The collection is tiny — a linear scan of 10 items beats hashing, " +
            "and touches one cache line.",
          "Keys are untrusted input and the runtime does not randomise its " +
            "hash seed."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "acid",

      why: {
        before: "Early data stores wrote records straight to disk. If the " +
          "machine died mid-write — power cut, crash, full disk — you were left " +
          "with half a change applied and no way to tell what had happened.",
        problem: "Money moving between accounts is two writes: debit one, " +
          "credit the other. A crash between them destroys money or invents it. " +
          "No amount of careful application code fixes this, because the " +
            "application is what is crashing.",
        shift: "Move the guarantee *below* the application, into the database. " +
          "ACID is four promises that together let a developer write the two " +
          "statements and stop thinking about the failure modes between them."
      },

      num: {
        t: "What each letter actually costs",
        h: ["Property", "Mechanism", "Typical cost"],
        r: [
          ["Atomicity", "write-ahead log / undo", "one extra sequential write"],
          ["Consistency", "constraint checks", "index lookups per constraint"],
          ["Isolation", "locks or MVCC snapshots", "contention, or version storage"],
          ["Durability", "`fsync` to disk on commit", "~0.5–2ms per commit"]
        ],
        n: "Durability is usually the expensive one. An `fsync` forces the " +
          "write past every cache to physical storage — around **1ms** on an " +
          "SSD, which caps a single-threaded writer at roughly **1,000 " +
          "commits/second**. This is why databases batch: **group commit** " +
          "collects many transactions into one `fsync`, taking throughput to " +
          "tens of thousands per second while each individual commit still " +
          "waits its ~1ms."
      },

      miss: [
        {
          w: "The C in ACID means the data is correct.",
          r: "It means the database moves from one state satisfying **your " +
            "declared constraints** to another — foreign keys, uniqueness, " +
            "`CHECK`s. It cannot know that transferring £100 should debit one " +
            "account and credit another by the same amount unless you tell it. " +
            "Most people's mental picture of *consistency* is really atomicity " +
            "plus isolation; the C is the odd letter out, and was arguably " +
            "included to make the acronym pronounceable."
        },
        {
          w: "ACID transactions are fully isolated.",
          r: "Only at `SERIALIZABLE`, which almost nobody runs. The default in " +
            "PostgreSQL and SQL Server is `READ COMMITTED`; in MySQL it is " +
            "`REPEATABLE READ`. Both permit real anomalies — non-repeatable " +
            "reads, phantoms, write skew. If you have never chosen an isolation " +
            "level, you are running with less isolation than you think."
        },
        {
          w: "NoSQL databases are not ACID.",
          r: "Many now are. MongoDB has had multi-document transactions since " +
            "4.0, and DynamoDB has them too. The old split was really about " +
            "*distribution*: ACID across many machines is expensive, so early " +
            "distributed stores dropped it. Single-node ACID was never the hard " +
            "part."
        },
        {
          w: "A committed transaction is safely on disk.",
          r: "Only if durability is actually configured. MySQL's " +
            "`innodb_flush_log_at_trx_commit=2` and Postgres's " +
            "`synchronous_commit=off` both trade the `fsync` for speed — you " +
            "get a large throughput win and a window, usually under a second, " +
            "where a power cut loses committed transactions. That is a " +
            "legitimate choice, but it must be a *choice*."
        }
      ],

      trade: {
        buys: [
          "The application stops handling partial failure — the hardest class " +
            "of bug to find and reason about.",
          "Concurrent correctness without hand-written locking.",
          "A crash leaves the data in a state you can describe."
        ],
        costs: [
          "`fsync` on commit bounds write throughput.",
          "Locks and version storage create contention under load.",
          "Across machines it needs two-phase commit, which blocks when the " +
            "coordinator fails and is why distributed transactions are rare."
        ],
        avoid: [
          "High-volume append-only data where losing the last second is fine — " +
            "metrics, logs, clickstream.",
          "The write must span several services; use a **saga** with " +
            "compensating actions rather than a distributed transaction.",
          "The work is naturally single-record, where an atomic write is " +
            "already enough."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "closure",

      why: {
        before: "A function could only see its parameters and globals. To keep " +
          "state between calls you used a global variable — visible to " +
          "everything, mutable by anything.",
        problem: "Globals do not compose. Two counters need two globals; a " +
          "hundred need a hundred, all colliding in one namespace, all " +
          "modifiable by any code that happens to know the name.",
        shift: "Let a function keep a private reference to the variables it was " +
          "*defined* next to, even after that scope has returned. State becomes " +
          "something you can make many independent copies of, and nothing " +
          "outside can reach it except through the functions you hand back."
      },

      num: {
        t: "What a closure actually holds",
        h: ["Thing", "Where it lives", "Freed when"],
        r: [
          ["The function", "heap", "no references remain"],
          ["Captured variables", "heap, not stack", "the closure is collected"],
          ["Uncaptured locals", "stack", "the call returns"]
        ],
        n: "This is why closures leak. A captured variable cannot be freed " +
          "while the closure lives, so a single event handler that captured a " +
          "large array keeps that whole array alive — even if the handler never " +
          "uses it again. In V8 a closure that captures *anything* from a scope " +
          "may keep the entire scope object alive, which is why removing " +
          "listeners on teardown matters more than it looks."
      },

      miss: [
        {
          w: "A closure copies the variable's value.",
          r: "It captures the **variable itself**, by reference. If it changes " +
            "later, the closure sees the new value. This is the classic loop " +
            "bug: three closures made with `var i` inside a `for` loop all " +
            "print `3`, because all three captured the *same* `i`, which ended " +
            "at 3. `let` fixes it by creating a fresh binding per iteration."
        },
        {
          w: "Closures are a JavaScript feature.",
          r: "They are in Python, Rust, Swift, Go, Java (lambdas), C# and most " +
            "modern languages. They are just unusually *visible* in JavaScript " +
            "because callbacks are everywhere. The name goes back to the 1960s " +
            "and Scheme."
        },
        {
          w: "A closure is just a function.",
          r: "It is a function **plus** the environment it captured. Two " +
            "closures created from the same source line are different objects " +
            "with different captured state — that is the entire point. " +
            "`makeCounter()` called twice gives you two independent counters."
        },
        {
          w: "Closures are slow.",
          r: "Calling one is essentially a normal call; modern JITs handle them " +
            "well. The real cost is *memory*, not speed — captured variables go " +
            "on the heap and stay alive as long as the closure does."
        }
      ],

      trade: {
        buys: [
          "Genuine private state with no class and no naming conventions.",
          "Each call to the factory produces independent state.",
          "The foundation of callbacks, decorators, partial application, " +
            "memoisation and module patterns."
        ],
        costs: [
          "Captured variables outlive their scope and are a common leak source.",
          "Capture is by reference, which surprises people in loops.",
          "State hidden in a closure is harder to inspect in a debugger than a " +
            "field on an object."
        ],
        avoid: [
          "The state is genuinely shared and long-lived — a class or a module " +
            "is easier to reason about and to inspect.",
          "You are in a hot loop creating millions of closures; allocation adds " +
            "up where a plain function plus an argument would not.",
          "The captured variable is large and the closure is long-lived, unless " +
            "you have thought about when it will be released."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cap-theorem",

      why: {
        before: "A database ran on one machine. It was consistent by " +
          "definition — there was only one copy of the data — and when it went " +
          "down, everything went down.",
        problem: "Replicating across machines survives a failure, but " +
          "introduces one that has no clean answer: the network splits, and two " +
          "replicas can no longer talk. Each has requests arriving. Neither " +
          "knows if the other is dead or merely unreachable.",
        shift: "Brewer's result, proved by Gilbert and Lynch in 2002, is that " +
          "in that moment you must choose. Serve the request and risk returning " +
          "stale or conflicting data (**AP**), or refuse to serve it until the " +
          "split heals (**CP**). There is no third option, and no amount of " +
          "engineering creates one."
      },

      num: {
        t: "The choice, made concrete",
        h: ["System", "Choice", "Behaviour during a partition"],
        r: [
          ["PostgreSQL (sync replica)", "CP", "writes block"],
          ["MongoDB", "CP", "minority side rejects writes"],
          ["Cassandra", "AP (tunable)", "both sides accept, reconcile later"],
          ["DynamoDB", "AP by default", "eventually consistent reads"],
          ["ZooKeeper / etcd", "CP", "minority refuses to serve"]
        ],
        n: "Partitions are rarer than people assume — but *slow* is " +
          "indistinguishable from *partitioned* to a machine holding a timeout, " +
          "and slowness is constant. That is why **PACELC** is the more useful " +
          "framing: if **P**artitioned choose **A** or **C**, **E**lse (normal " +
          "operation) choose **L**atency or **C**onsistency. The second half " +
          "describes the trade-off you are making *every single day*, not just " +
          "during an outage."
      },

      miss: [
        {
          w: "Pick two of three: consistency, availability, partition tolerance.",
          r: "The most-repeated and most-wrong version. Partition tolerance is " +
            "**not optional** — networks fail whether or not you chose to " +
            "tolerate it. The real statement is: *when* a partition happens, " +
            "choose C or A. The rest of the time you can have both."
        },
        {
          w: "NoSQL means AP and SQL means CP.",
          r: "It is a per-system, often per-*query* setting. Cassandra is AP by " +
            "default but a `QUORUM` read and write gives you strong consistency. " +
            "Spanner is a distributed SQL database that chooses CP. The " +
            "data model and the CAP choice are independent."
        },
        {
          w: "Eventually consistent means the data is wrong.",
          r: "It means reads may be stale for a window — usually milliseconds. " +
            "For a like count, a follower list or a product view counter that " +
            "is entirely fine. For a bank balance or an inventory decrement it " +
            "is not. The question is never *is staleness acceptable* but *how " +
            "much, and where*."
        },
        {
          w: "The C in CAP is the C in ACID.",
          r: "Different words. CAP's C is **linearizability** — every read sees " +
            "the most recent write, as if there were one copy. ACID's C is " +
            "*your declared constraints hold*. A system can satisfy one and not " +
            "the other."
        }
      ],

      trade: {
        buys: [
          "A precise vocabulary for a decision every distributed system makes.",
          "Kills the idea that a magic database avoids the trade-off.",
          "Forces the question early, when it is still cheap to answer."
        ],
        costs: [
          "So often mis-stated that quoting it can mislead a team.",
          "Binary framing hides the useful middle — quorums, tunable " +
            "consistency, CRDTs.",
          "Says nothing about the normal case, which is where nearly all your " +
            "latency actually comes from."
        ],
        avoid: [
          "You are on a single node. There is no partition to tolerate, and CAP " +
            "has nothing to say.",
          "You are choosing between two systems on the same side of the split — " +
            "compare latency, operations and cost instead.",
          "You want to describe the everyday trade-off, not the outage. " +
            "**PACELC** is the better tool."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
