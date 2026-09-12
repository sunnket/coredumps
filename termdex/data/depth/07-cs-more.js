/* ==========================================================================
   Depth pass 7 — trees, strings, and the theory that bounds what is possible.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "balanced-binary-tree",

      why: {
        before: "A binary search tree gives `O(log n)` lookup by halving the " +
          "search space at every node — provided the tree is bushy.",
        problem: "Nothing forces it to be. Insert sorted data into a plain BST " +
          "and every node has one child: you have built a linked list with " +
          "extra pointers, and every operation is `O(n)`. Sorted input is not " +
          "an unusual case — it is one of the most common cases there is.",
        shift: "Make the tree repair itself. After each insertion or deletion, " +
          "check a **height invariant** and restore it by rotation. The " +
          "invariant guarantees height stays `O(log n)` no matter what order " +
          "the data arrives in."
      },

      num: {
        t: "Height guarantees, n = 1,000,000",
        h: ["Structure", "Max height", "Rotations per insert"],
        r: [
          ["Unbalanced BST (sorted input)", "1,000,000", "0"],
          ["Red-black tree", "~40", "≤ 2"],
          ["AVL tree", "~28", "≤ 2"],
          ["Perfect binary tree", "20", "—"]
        ],
        n: "AVL keeps heights of sibling subtrees within **1**, so it is " +
          "shorter and faster to search; red-black allows a factor of **2**, so " +
          "it rebalances less and is faster to modify. That difference decides " +
          "who uses which: **AVL for read-heavy** workloads, **red-black for " +
          "write-heavy**. C++ `std::map`, Java `TreeMap` and the Linux " +
          "scheduler all use red-black. Note that both are beaten by a **B-tree** " +
          "on disk, where the cost is seeks rather than comparisons and a " +
          "shallow, wide tree wins."
      },

      miss: [
        {
          w: "Balanced means both subtrees have the same number of nodes.",
          r: "It means their **heights** are within a bounded difference. A " +
            "perfectly height-balanced tree can have wildly uneven node counts. " +
            "Balancing by size is a different structure (weight-balanced trees) " +
            "with different properties."
        },
        {
          w: "Rebalancing makes inserts expensive.",
          r: "Both AVL and red-black need at most **two rotations** per " +
            "insertion, and a rotation is a few pointer swaps. The `O(log n)` " +
            "cost is the search for the position, not the repair. Deletion is " +
            "the harder case — it can need `O(log n)` rotations in AVL."
        },
        {
          w: "You should reach for a balanced tree over a hash table.",
          r: "Only if you need **order**. Hash tables win on plain lookup. " +
            "Balanced trees earn their place when you need sorted iteration, " +
            "range queries, or *the next key after this one* — things a hash " +
            "cannot answer at all."
        },
        {
          w: "Randomly inserted data does not need balancing.",
          r: "Random insertion does give expected `O(log n)` height, which is " +
            "why **treaps** and **skip lists** work by deliberately " +
            "randomising. But real data is rarely random — it arrives sorted, " +
            "clustered, or chosen by an adversary. Relying on randomness you do " +
            "not control is how the sorted-input disaster happens."
        }
      ],

      trade: {
        buys: [
          "Guaranteed `O(log n)` regardless of insertion order.",
          "Sorted iteration and range queries, which hashing cannot provide.",
          "Predecessor and successor queries in `O(log n)`.",
          "Worst-case bounds, unlike a hash table's average-case ones."
        ],
        costs: [
          "Slower than a hash table for plain lookup.",
          "Rebalancing logic is intricate, especially deletion.",
          "Pointer-chasing gives poor cache locality.",
          "Per-node overhead for colour or height metadata."
        ],
        avoid: [
          "You need only membership or key-value lookup — use a hash table.",
          "Data lives on disk, where a **B-tree**'s shallow fan-out matters " +
            "more than comparison count.",
          "The dataset is static — a sorted array with binary search is " +
            "faster and cache-friendly.",
          "You want simpler code with similar behaviour — a **skip list** is " +
            "far easier to implement correctly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kmp",

      why: {
        before: "Naive substring search compared the pattern at every position " +
          "and, on a mismatch, slid forward one character and started over " +
          "from the beginning of the pattern.",
        problem: "That throws away everything just learned. Having matched " +
          "`\"AAAAB\"` against `\"AAAAA\"` and failed on the last character, the " +
          "naive algorithm restarts one position along and re-compares the four " +
          "A's it already knows match. On adversarial input this is `O(nm)`.",
        shift: "Precompute, from the pattern alone, how much of a partial match " +
          "is still usable after a mismatch. The **failure function** answers " +
          "*the longest proper prefix of the pattern that is also a suffix of " +
          "what I just matched*. The text pointer then **never moves " +
          "backwards**, giving `O(n + m)`."
      },

      num: {
        t: "Substring search, n = text, m = pattern",
        h: ["Algorithm", "Worst case", "Typical", "Preprocessing"],
        r: [
          ["Naive", "O(nm)", "O(n)", "none"],
          ["KMP", "O(n + m)", "O(n)", "O(m)"],
          ["Boyer-Moore", "O(nm)", "**sublinear**", "O(m + σ)"],
          ["Rabin-Karp", "O(nm)", "O(n + m)", "O(m)"]
        ],
        n: "KMP's guarantee is that it **never re-reads a text character** — " +
          "at most 2n comparisons total. Yet in practice **Boyer-Moore is " +
          "usually faster** because it scans the pattern right-to-left and can " +
          "skip up to m characters at a time, examining a *fraction* of the " +
          "text. This is why `memmem`, Python's `str.find` and most standard " +
          "libraries use Boyer-Moore variants rather than KMP. KMP's real value " +
          "is its guarantee on adversarial input, and that its failure function " +
          "is itself a useful object — it finds all borders of a string, which " +
          "solves periodicity problems directly."
      },

      miss: [
        {
          w: "KMP is the fastest string search algorithm.",
          r: "It has the best worst-case bound and is usually **slower in " +
            "practice** than Boyer-Moore, which skips ahead rather than " +
            "examining every character. KMP examines all n characters by " +
            "construction; Boyer-Moore often examines n/m of them."
        },
        {
          w: "The failure function tells you where to restart in the text.",
          r: "It tells you where to restart in the **pattern**. The text " +
            "pointer never moves backwards at all — that invariant is what " +
            "gives the linear bound. Getting this backwards is the classic " +
            "implementation bug."
        },
        {
          w: "It only matters for very long texts.",
          r: "Its guarantee matters most on **adversarial** input, which can be " +
            "short. A pattern like `\"aaaaab\"` against a text of a thousand " +
            "`a`s makes the naive algorithm quadratic on a kilobyte. If the " +
            "pattern comes from user input, that is a denial-of-service vector."
        },
        {
          w: "The failure function is only useful inside KMP.",
          r: "It is a general tool. It gives the shortest period of a string, " +
            "all its borders, and solves several string problems on its own. " +
            "The **Z-algorithm** computes closely related information and is " +
            "often easier to reason about."
        }
      ],

      trade: {
        buys: [
          "Guaranteed linear time with no adversarial worst case.",
          "Never re-reads text, so it works on a **stream** with `O(m)` memory.",
          "The failure function solves periodicity and border problems too.",
          "No hashing, so no collision handling and no randomness."
        ],
        costs: [
          "Usually slower than Boyer-Moore on ordinary text.",
          "Preprocessing per pattern, wasteful for one-off searches.",
          "The failure function is subtle to derive and easy to get wrong.",
          "Handles one pattern; many patterns want **Aho-Corasick**."
        ],
        avoid: [
          "The standard library already has an optimised search — use it.",
          "You are searching for many patterns at once — **Aho-Corasick** " +
            "builds one automaton for all of them.",
          "You need approximate or fuzzy matching, which KMP cannot do.",
          "The pattern changes every call, so preprocessing never amortises."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "halting-problem",

      why: {
        before: "The reasonable expectation was that a sufficiently clever " +
          "analyser could look at any program and say whether it terminates. " +
          "Hard, surely, but a matter of effort.",
        problem: "Turing proved in 1936 that no such program can exist — not " +
          "*is hard to write*, but **cannot exist**, for any machine, at any " +
          "level of cleverness, forever.",
        shift: "The proof is a diagonalisation and fits in a paragraph. Suppose " +
          "`halts(p, i)` exists. Build `trouble(p)` that calls `halts(p, p)` " +
          "and loops forever if it says *halts*, halting if it says *loops*. " +
          "Now ask: does `trouble(trouble)` halt? Either answer contradicts " +
          "itself. Therefore `halts` cannot exist. The consequence is not " +
          "academic — via **Rice's theorem** it generalises to *every* " +
          "non-trivial semantic property of programs."
      },

      num: {
        t: "What becomes undecidable in general",
        h: ["Question", "Decidable?", "What tools do instead"],
        r: [
          ["Does this halt?", "no", "timeouts, watchdogs"],
          ["Is this code ever reached?", "no", "conservative approximation"],
          ["Do these two programs agree?", "no", "test on samples"],
          ["Is this variable ever null?", "no", "type systems, over-report"],
          ["Is this memory freed twice?", "no", "ownership rules (Rust)"]
        ],
        n: "The practical escape is always the same: **give up completeness or " +
          "give up soundness**. A type checker rejects some correct programs " +
          "(incomplete but sound); a linter misses some real bugs (unsound but " +
          "useful); a total language like Coq or Idris only lets you write " +
          "programs it can prove terminate (restricting the language). Every " +
          "static analyser you use has chosen one of these three, and knowing " +
          "which explains its false positives."
      },

      miss: [
        {
          w: "The halting problem means you cannot tell if any program halts.",
          r: "You can often tell for a **specific** program — `while(true){}` " +
            "obviously loops; a bounded `for` obviously terminates. What cannot " +
            "exist is a single procedure that decides it for **all** programs. " +
            "The impossibility is universal, not particular."
        },
        {
          w: "It is a limitation of current computers that quantum might fix.",
          r: "It applies to any model of computation equivalent to a Turing " +
            "machine, quantum computers included. It is a **logical** " +
            "impossibility like the liar paradox, not an engineering one. No " +
            "hardware changes it."
        },
        {
          w: "Real programs have finite memory, so it does not apply.",
          r: "Technically a finite-memory machine has finitely many states, so " +
            "halting *is* decidable — by simulating until a state repeats. But " +
            "a machine with 16GB has 2^(1.4×10¹¹) states; the *decidable* " +
            "procedure would outlast the universe. Undecidable and " +
            "astronomically-intractable are practically the same answer."
        },
        {
          w: "It means static analysis is pointless.",
          r: "It means static analysis cannot be **both** sound and complete. " +
            "Analysers are extremely useful by deliberately choosing to " +
            "over-approximate — which is exactly why you get false positives, " +
            "and why *the analyser is wrong here* is often true and still not a " +
            "bug in the analyser."
        }
      ],

      trade: {
        buys: [
          "Explains the shape of every static analysis tool you will use.",
          "Tells you when to stop trying to build a perfect checker.",
          "Rice's theorem generalises it to every non-trivial property.",
          "Justifies timeouts, watchdogs and resource limits as the real answer."
        ],
        costs: [
          "Often invoked to dismiss analysis that would have worked fine.",
          "The worst-case framing hides how much is decidable in practice.",
          "Says nothing about which approximation to choose."
        ],
        avoid: [
          "The programs are from a restricted language — total languages and " +
            "regular expressions are decidable by construction.",
          "You are analysing a specific program, not all programs.",
          "A conservative over-approximation is sufficient, which it usually is.",
          "You are arguing about whether a tool should exist. It should; it " +
            "just cannot be perfect."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "backtracking",

      why: {
        before: "Solving a constraint puzzle by brute force meant generating " +
          "every complete candidate and testing each one. For 9×9 Sudoku that " +
          "is roughly 9⁵¹ possibilities.",
        problem: "Almost all of those candidates are already invalid after the " +
          "first few choices. Generating a complete grid before noticing that " +
          "two 3s share a row wastes essentially all of the work.",
        shift: "Test **as you build**. Place one value, check the constraints " +
          "immediately, and if they fail abandon the entire subtree of " +
          "possibilities beneath that choice. This is **pruning**, and it turns " +
          "an impossible search into a fast one — the same total space, " +
          "explored in a way that discards most of it unexamined."
      },

      num: {
        t: "N-Queens: nodes explored",
        h: ["n", "Brute force (nⁿ)", "Backtracking nodes", "Solutions"],
        r: [
          ["8", "16,777,216", "~2,057", "92"],
          ["10", "10¹⁰", "~35,000", "724"],
          ["12", "8.9×10¹²", "~856,000", "14,200"]
        ],
        n: "At n = 8 pruning explores about **0.01%** of the naive space. The " +
          "gain comes entirely from cutting off subtrees early, so anything " +
          "that makes failures happen **sooner** compounds: ordering variables " +
          "by *most constrained first*, ordering values by *least constraining " +
          "first*, and constraint propagation. Note the exponential is still " +
          "there — backtracking does not change the complexity class, it " +
          "changes the constant enough to matter."
      },

      miss: [
        {
          w: "Backtracking is just recursion.",
          r: "It is recursion **plus pruning plus undo**. The undo is the part " +
            "people forget: after exploring a branch you must restore the state " +
            "exactly, or later branches see corrupted data. A recursive " +
            "enumeration with no pruning is brute force with extra stack frames."
        },
        {
          w: "It makes exponential problems tractable.",
          r: "It makes many *instances* tractable. The worst case is still " +
            "exponential — a problem with no early contradictions prunes " +
            "nothing. Backtracking exploits structure; where there is none, it " +
            "degenerates to brute force."
        },
        {
          w: "You should always copy the state before recursing.",
          r: "Copying is safe and often the dominant cost. The idiom is " +
            "**mutate, recurse, undo** — push the choice, explore, pop it. " +
            "Copying a board at every node turns an `O(1)` step into `O(n²)` " +
            "and can dominate the entire runtime."
        },
        {
          w: "Better pruning always means faster.",
          r: "Pruning has a cost per node. An expensive check that eliminates " +
            "few branches loses money. The trade is between nodes explored and " +
            "work per node — which is why constraint propagation is worth it in " +
            "Sudoku and full arc-consistency often is not."
        }
      ],

      trade: {
        buys: [
          "Explores a fraction of the search space by discarding subtrees whole.",
          "Uses `O(depth)` memory — the current path only.",
          "Naturally finds all solutions, or the first, or the best.",
          "Simple to express recursively for a wide range of problems."
        ],
        costs: [
          "Worst case remains exponential; structure is required to help.",
          "Correct undo logic is a common source of subtle bugs.",
          "Deep recursion can overflow the stack.",
          "Performance depends heavily on ordering heuristics you must design."
        ],
        avoid: [
          "Subproblems overlap and repeat — that is **dynamic programming**, " +
            "and backtracking will recompute them exponentially.",
          "A greedy choice is provably optimal, which is far cheaper.",
          "The problem is a well-known one with a dedicated solver — SAT, ILP " +
            "and CP solvers beat hand-written backtracking substantially.",
          "You need an answer within a deadline; the runtime is unpredictable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reservoir-sampling",

      why: {
        before: "Taking a random sample meant loading the collection, counting " +
          "it, and picking random indices. Straightforward when you know how " +
          "many items there are and they all fit in memory.",
        problem: "Streams break both assumptions. A log file being written, a " +
          "Kafka topic, a table too large for RAM — you cannot count it first " +
          "and you cannot hold it. Yet you still need a **uniform** sample, " +
          "where every item had an equal chance.",
        shift: "Decide as you go. Keep the first k items; for item i thereafter, " +
          "keep it with probability `k/i`, evicting a random current member. " +
          "The remarkable part is that this gives every item seen so far " +
          "exactly `k/n` probability — at *every* point in the stream, without " +
          "ever knowing n."
      },

      num: {
        t: "Why k/i is exactly right",
        h: ["Item", "P(selected initially)", "P(survives to end)", "Final"],
        r: [
          ["item 1 (k=1, n=5)", "1", "4/5 × ... = 1/5", "1/5"],
          ["item 3", "1/3", "3/4 × 4/5 = 3/5", "1/5"],
          ["item 5", "1/5", "1", "1/5"]
        ],
        n: "Every item ends at exactly **1/n** — the later an item arrives the " +
          "less likely it is to be chosen, but the fewer chances remain to " +
          "evict it, and the two effects cancel precisely. Memory is `O(k)` " +
          "regardless of stream length, and a single pass suffices. " +
          "**Algorithm L** improves the constant by computing how many items " +
          "to skip instead of rolling a die per item, taking the random-number " +
          "calls from `O(n)` down to `O(k log(n/k))`."
      },

      miss: [
        {
          w: "You need to know the stream length.",
          r: "That is the entire point of the algorithm — it never uses n. " +
            "You can stop at any moment and the reservoir is a uniform sample " +
            "of everything seen so far. If you knew n, you would not need this."
        },
        {
          w: "The reservoir is biased toward early items because they start in it.",
          r: "Early items are more likely to be *in* the reservoir at any given " +
            "moment, and also face far more eviction opportunities. The `k/i` " +
            "probability is chosen exactly so these cancel, giving uniform " +
            "`k/n` at the end. The proof is a short induction."
        },
        {
          w: "It gives a random sample, so items may repeat.",
          r: "It samples **without replacement** — each stream item can appear " +
            "at most once. Sampling with replacement from a stream needs a " +
            "different method, typically k independent reservoirs of size 1."
        },
        {
          w: "It only works for uniform sampling.",
          r: "**A-Res** and **A-ExpJ** extend it to weighted sampling, where " +
            "items carry different probabilities. The mechanism changes — keys " +
            "based on `random^(1/weight)` in a priority queue — but the " +
            "one-pass, bounded-memory property survives."
        }
      ],

      trade: {
        buys: [
          "Uniform sampling from a stream of unknown, unbounded length.",
          "`O(k)` memory regardless of how much data flows past.",
          "One pass, no seeking, no counting.",
          "Valid at every prefix — stop whenever you like."
        ],
        costs: [
          "One random number per item in the naive version.",
          "Cannot be reproduced without storing the random seed and order.",
          "Does not parallelise trivially — merging reservoirs needs care.",
          "No control over which items you get, by design."
        ],
        avoid: [
          "The data fits in memory and you know its size — shuffle and slice.",
          "You need a **stratified** or otherwise structured sample.",
          "The sample must be reproducible across runs without storing state.",
          "You want the most recent k items, not a random k — that is a ring " +
            "buffer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "isolation-level",

      why: {
        before: "Transactions ran one at a time, or with coarse table locks. " +
          "Correct, and hopeless for throughput — one slow report blocked every " +
          "writer on the table.",
        problem: "Running them concurrently is fast and introduces anomalies " +
          "that are genuinely hard to reason about: a transaction reads a row, " +
          "another changes it, the first reads again and sees something " +
          "different. Full serialisability prevents all of it and costs too " +
          "much for most workloads.",
        shift: "Offer a **dial** rather than a switch. Four standard levels, " +
          "each permitting a specific named set of anomalies in exchange for " +
          "concurrency. The application chooses how much correctness it needs " +
          "per transaction — which means it must know what each level actually " +
          "allows."
      },

      num: {
        t: "Levels and the anomalies they permit",
        h: ["Level", "Dirty read", "Non-repeatable", "Phantom"],
        r: [
          ["Read Uncommitted", "yes", "yes", "yes"],
          ["Read Committed", "no", "yes", "yes"],
          ["Repeatable Read", "no", "no", "yes*"],
          ["Serializable", "no", "no", "no"]
        ],
        n: "The defaults matter more than the table: **PostgreSQL and SQL " +
          "Server default to Read Committed**, **MySQL InnoDB to Repeatable " +
          "Read**, and **Oracle offers no Repeatable Read at all**. So the same " +
          "application code has different concurrency semantics on different " +
          "databases. The asterisk is real — InnoDB's next-key locking prevents " +
          "most phantoms at Repeatable Read, which the standard does not " +
          "require. And **write skew** is permitted at Repeatable Read on " +
          "PostgreSQL despite none of the three named anomalies occurring: two " +
          "transactions each read a consistent snapshot and each write " +
          "something that invalidates the other's premise."
      },

      miss: [
        {
          w: "The default isolation level is safe for anything.",
          r: "Read Committed permits **non-repeatable reads**: the same " +
            "`SELECT` twice in one transaction can return different values. " +
            "Code that reads a balance, checks it, then writes based on that " +
            "check is racy at the default level on Postgres and SQL Server. " +
            "Most applications have never chosen a level and quietly rely on " +
            "one."
        },
        {
          w: "Repeatable Read means my whole transaction sees consistent data.",
          r: "It means rows you have *read* will not change. It does **not** " +
            "prevent write skew — the doctor-on-call problem, where two " +
            "transactions each check *is at least one other doctor on shift*, " +
            "both see yes, and both take themselves off. Neither read a row the " +
            "other wrote, so no named anomaly occurred, and the invariant is " +
            "still broken."
        },
        {
          w: "Serializable means transactions run one after another.",
          r: "It means the **result** is equivalent to some serial order. They " +
            "still run concurrently. PostgreSQL uses **SSI**, which is " +
            "optimistic: it lets them proceed and aborts one with a " +
            "serialisation failure when a dangerous pattern is detected. So " +
            "code at Serializable **must have retry logic** — that is not " +
            "optional."
        },
        {
          w: "Higher isolation is always safer, so use Serializable everywhere.",
          r: "It is safer and it moves the failure. At Serializable you get " +
            "aborts and deadlocks under contention, and if the application does " +
            "not retry them the user sees errors instead of anomalies. It is " +
            "the right default for correctness-critical work and a poor default " +
            "for a read-heavy reporting workload."
        }
      ],

      trade: {
        buys: [
          "A per-transaction dial between correctness and concurrency.",
          "Precise vocabulary for anomalies that are otherwise hard to discuss.",
          "Lets an expensive report run at a weak level without blocking " +
            "writers."
        ],
        costs: [
          "The names are standardised and the behaviour is not — engines " +
            "differ.",
          "Weak levels permit anomalies most developers have never heard of.",
          "Serializable needs retry logic and adds abort rates under " +
            "contention.",
          "The cost is invisible in testing and appears under production load."
        ],
        avoid: [
          "The transaction is a single statement — it is atomic already and " +
            "the level barely matters.",
          "You are reading data that need not be consistent, such as an " +
            "approximate dashboard count.",
          "The workload is append-only with no read-modify-write cycles.",
          "You genuinely need cross-service consistency, which isolation levels " +
            "cannot provide at all — that is a **saga**."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "quickselect",

      why: {
        before: "Finding the k-th smallest element meant sorting the array and " +
          "indexing — `O(n log n)` for a single value.",
        problem: "Sorting arranges **every** element relative to every other. " +
          "For the median you need one element's position; the ordering of the " +
          "rest is work you throw away immediately.",
        shift: "Reuse quicksort's partition and recurse into **one side only**. " +
          "After partitioning, you know exactly which half contains the k-th " +
          "element, so the other half needs no attention. The recurrence " +
          "becomes `T(n) = T(n/2) + O(n)`, which sums to `O(n)` — not " +
          "`O(n log n)`."
      },

      num: {
        t: "Finding the median of n elements",
        h: ["Method", "Average", "Worst case"],
        r: [
          ["Sort then index", "O(n log n)", "O(n log n)"],
          ["Quickselect (random pivot)", "**O(n)**", "O(n²)"],
          ["Median of medians", "O(n)", "**O(n)**"],
          ["Two heaps (streaming)", "O(log n) per item", "O(log n)"]
        ],
        n: "The `O(n)` average comes from the geometric series " +
          "`n + n/2 + n/4 + … = 2n`. The `O(n²)` worst case is a consistently " +
          "terrible pivot — and it is reachable deliberately, which is why " +
          "**randomising the pivot** matters for untrusted input. " +
          "**Median-of-medians** guarantees linear worst case but its constant " +
          "is large enough that it is rarely used alone; C++'s `nth_element` " +
          "uses **introselect**, running quickselect and falling back to the " +
          "guaranteed algorithm only if recursion goes too deep."
      },

      miss: [
        {
          w: "Quickselect sorts the array partially, so it is a sorting " +
            "algorithm.",
          r: "It **mutates** the array into a partitioned state, but the result " +
            "is not sorted — only that everything before position k is smaller " +
            "and everything after is larger. If the caller expected their array " +
            "untouched, that is a bug waiting to happen; copy it first if the " +
            "order matters."
        },
        {
          w: "O(n) average means it is always fast.",
          r: "With a fixed pivot choice it is `O(n²)` on sorted or " +
            "adversarially-constructed input — the same trap as quicksort. " +
            "Random or median-of-three pivoting is not optional if the input is " +
            "not under your control."
        },
        {
          w: "It is better than sorting whenever you need one element.",
          r: "For a single query, yes. For **many** queries on the same array, " +
            "sorting once at `O(n log n)` and answering each in `O(1)` beats " +
            "repeated `O(n)` selections after only a handful of queries."
        },
        {
          w: "Median-of-medians is what you should use for guaranteed linear " +
            "time.",
          r: "Its constant factor is roughly 5–10× worse, so it is often slower " +
            "than plain quickselect on real inputs despite the better bound. " +
            "**Introselect** — start fast, switch on bad behaviour — is what " +
            "production libraries actually do."
        }
      ],

      trade: {
        buys: [
          "`O(n)` average for the k-th element, beating a full sort.",
          "In-place, `O(1)` extra space with an iterative implementation.",
          "Solves top-k and median directly.",
          "Reuses partition logic you likely already have."
        ],
        costs: [
          "`O(n²)` worst case without pivot randomisation.",
          "Destroys the input array's order.",
          "Not stable, and gives no information about other elements.",
          "Needs the whole array in memory, so it does not stream."
        ],
        avoid: [
          "You will query many different k values — sort once instead.",
          "The data is a stream — use **two heaps** for a running median.",
          "You need the top k *in order*, where a heap is more direct.",
          "The array must not be modified and copying it is too expensive."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bit-manipulation",

      why: {
        before: "Sets of flags were stored as arrays of booleans, one byte or " +
          "more each, and combined with loops.",
        problem: "That is wasteful in space and, more importantly, in " +
          "**operations**. Testing whether any of 64 flags is set means 64 " +
          "comparisons — when a CPU can compare all 64 bits of a register in a " +
          "single instruction.",
        shift: "Pack the flags into the bits of an integer. Set membership " +
          "becomes bitwise AND, union becomes OR, toggling becomes XOR, and " +
          "*is anything set* becomes a comparison to zero. One instruction " +
          "replaces a loop — and the whole set fits in a register."
      },

      num: {
        t: "The idioms worth memorising",
        h: ["Operation", "Expression", "Note"],
        r: [
          ["Test bit i", "`x & (1 << i)`", "non-zero if set"],
          ["Set bit i", "`x \\| (1 << i)`", "idempotent — safe to repeat"],
          ["Clear bit i", "`x & ~(1 << i)`", "mask inverts to all-ones but bit i"],
          ["Toggle bit i", "`x ^ (1 << i)`", "XOR twice restores the original"],
          ["Lowest set bit", "`x & -x`", "two's complement trick"],
          ["Clear lowest set bit", "`x & (x - 1)`", "Kernighan's"],
          ["Is power of two", "`x && !(x & (x-1))`", "one set bit; the `x &&` rejects zero"],
          ["Count set bits", "`popcount(x)`", "one CPU instruction"]
        ],
        n: "`x & (x - 1)` is worth understanding rather than memorising: " +
          "subtracting 1 flips the lowest set bit to 0 and all zeros below it " +
          "to 1, so the AND clears exactly that bit. Looping on it counts set " +
          "bits in **as many iterations as there are set bits**, not 32 — " +
          "Kernighan's algorithm. Modern CPUs have `POPCNT` as a single " +
          "instruction, so `__builtin_popcount` or `Integer.bitCount` beats any " +
          "hand-rolled loop. XOR's self-inverse property (`a ^ a = 0`) is the " +
          "other workhorse: it finds the unpaired element in a list in one pass " +
          "with no extra memory."
      },

      miss: [
        {
          w: "Bit tricks make code faster.",
          r: "Compilers already do most of this. Writing `x >> 1` instead of " +
            "`x / 2` gains nothing — the compiler emits the same instruction, " +
            "and for **signed** values the two differ in rounding for negatives, " +
            "so the manual version can be wrong. Optimise readability unless " +
            "profiling says otherwise."
        },
        {
          w: "Shifting is always equivalent to multiplying or dividing by a " +
            "power of two.",
          r: "For unsigned values, yes. For signed, `>>` is arithmetic shift " +
            "and rounds toward negative infinity while division rounds toward " +
            "zero: `-7 >> 1` is `-4`, `-7 / 2` is `-3`. Shifting by more than " +
            "the type's width is **undefined behaviour** in C, and in " +
            "JavaScript shifts coerce to 32 bits regardless of the number's " +
            "actual size."
        },
        {
          w: "`x & -x` is a hack that relies on undefined behaviour.",
          r: "It relies on **two's complement**, which is now mandated by C++20 " +
            "and by every mainstream platform. `-x` is `~x + 1`, which flips " +
            "everything above the lowest set bit and leaves it standing — the " +
            "AND then isolates it. It is well-defined and widely used, " +
            "including inside Fenwick trees."
        },
        {
          w: "Bitmasks are only for low-level code.",
          r: "**Bitmask DP** encodes a subset of up to ~20 items as an integer, " +
            "which is how the travelling salesman DP works. Permission systems, " +
            "chess engines (bitboards), and set operations in competitive " +
            "programming all rely on it. It is an algorithmic technique, not " +
            "only a systems one."
        }
      ],

      trade: {
        buys: [
          "Whole-set operations in one instruction.",
          "64 booleans in 8 bytes rather than 64.",
          "Makes bitmask DP and subset enumeration practical.",
          "Branch-free code that avoids pipeline stalls."
        ],
        costs: [
          "Considerably harder to read and to review.",
          "Signedness, width and shift-overflow rules differ between languages.",
          "Limited to the register width — 32 or 64 items.",
          "Easy to write subtly wrong code that passes casual testing."
        ],
        avoid: [
          "Clarity matters more than the cycles saved, which is most code.",
          "The compiler already optimises the readable form — check first.",
          "You need more than 64 flags; use a proper bitset type.",
          "The team is not comfortable maintaining it — clever code nobody can " +
            "review is a liability."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
