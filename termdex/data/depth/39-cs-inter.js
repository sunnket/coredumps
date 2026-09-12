/* ==========================================================================
   Depth pass 39 — intermediate CS fundamentals: the algorithm design
   strategies and the patterns built on them.

   Dynamic programming, greedy and divide-and-conquer are usually taught as
   three techniques. They are better understood as three answers to one
   question: **how do the subproblems relate?** Independent → divide and
   conquer. Overlapping → dynamic programming. A provable local rule →
   greedy. Getting that classification right is most of the work.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "dynamic-programming",

      why: {
        before: "Recursive solutions expressed the structure of a problem " +
          "beautifully and ran catastrophically slowly. Naive recursive " +
          "Fibonacci takes **exponential** time.",
        problem: "The recursion recomputes the same subproblems over and over. " +
          "`fib(50)` makes about **2.5 billion** calls, and there are only " +
          "**51 distinct** values to compute. The structure is right; the " +
          "repetition is the bug.",
        shift: "**Remember what you have already computed.** If subproblems " +
          "overlap, store each answer the first time and reuse it. That single " +
          "change takes Fibonacci from exponential to linear. Bellman named it " +
          "*dynamic programming* partly because *programming* sounded " +
          "impressive to his funders — it has nothing to do with writing code."
      },

      num: {
        t: "The two implementations",
        h: ["", "Top-down (memoisation)", "Bottom-up (tabulation)"],
        r: [
          ["Written as", "**recursion + a cache**", "**loops filling a table**"],
          ["Computes", "**only what is needed**", "everything in the table"],
          ["Stack depth", "**can overflow**", "none"],
          ["Easier to write", "**yes — add a cache**", "needs the right order"],
          ["Space optimisation", "harder", "**roll the array — O(1) space**"]
        ],
        n: "**Two conditions must both hold** for DP to apply, and checking " +
          "them is the actual skill: **overlapping subproblems** (the same " +
          "subproblem recurs — otherwise it is divide-and-conquer) and " +
          "**optimal substructure** (the optimal answer is built from optimal " +
          "sub-answers). The practical route is almost always **write the " +
          "recursion first, add memoisation, then convert to a table if you " +
          "need the space optimisation** — going straight to a table means " +
          "deriving the fill order before you understand the recurrence. And " +
          "the space win is often large: many 2D DPs only reference the " +
          "previous row, so `O(n·m)` memory collapses to `O(m)`."
      },

      miss: [
        {
          w: "Dynamic programming means using a 2D table.",
          r: "The table is one **implementation**. Memoised recursion is " +
            "equally dynamic programming, and often clearer. The defining idea " +
            "is **not recomputing overlapping subproblems**, not the data " +
            "structure you store them in."
        },
        {
          w: "If a problem has subproblems, DP applies.",
          r: "They must **overlap**. Merge sort splits into subproblems that " +
            "never recur, so memoising it gains nothing — that is " +
            "divide-and-conquer. Without overlap there is nothing to reuse."
        },
        {
          w: "Bottom-up is always better than memoisation.",
          r: "Bottom-up avoids recursion overhead and enables space " +
            "optimisation; memoisation **computes only the states you " +
            "actually reach**, which can be far fewer. For a sparse state " +
            "space, top-down wins decisively."
        },
        {
          w: "The hard part is writing the code.",
          r: "The hard part is **defining the state** — what must you know to " +
            "make the next decision? Get that right and the recurrence usually " +
            "follows. Most failed DP attempts are a state definition missing a " +
            "dimension, which produces wrong answers rather than slow ones."
        }
      ],

      trade: {
        buys: [
          "Exponential to polynomial on overlapping-subproblem problems.",
          "The recursive formulation stays readable.",
          "Memoisation is often a one-line addition.",
          "Space frequently reduces to `O(1)` with rolling arrays."
        ],
        costs: [
          "Memory proportional to the state space.",
          "Requires identifying the right state, which needs insight.",
          "Top-down can overflow the stack.",
          "The state space itself can be exponential — bitmask DP's ceiling."
        ],
        avoid: [
          "Subproblems do not overlap — that is **divide and conquer**.",
          "A **greedy** rule is provably optimal, which is far cheaper.",
          "The state space is too large to store.",
          "A closed-form solution exists."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "greedy-algorithm",

      why: {
        before: "Finding an optimal solution meant exploring the space of " +
          "possibilities — dynamic programming, backtracking, or exhaustive " +
          "search. All of them are expensive.",
        problem: "For some problems that exploration is unnecessary. If the " +
          "locally best choice is always part of *some* optimal solution, " +
          "there is nothing to explore — you can decide at each step and never " +
          "reconsider.",
        shift: "**Commit to the local optimum and never look back.** When it " +
          "works it is dramatically faster and simpler than DP. The entire " +
          "difficulty is that **it is usually wrong, and wrong silently** — a " +
          "greedy algorithm always produces an answer, and you cannot tell " +
          "from the output whether it is optimal."
      },

      num: {
        t: "Where greedy is provably optimal — and where it is not",
        h: ["Problem", "Greedy optimal?", "Why"],
        r: [
          ["**Interval scheduling** (earliest finish)", "**yes**", "exchange argument"],
          ["Huffman coding", "**yes**", "provable"],
          ["Dijkstra, Kruskal, Prim", "**yes**", "matroid / cut property"],
          ["**Coin change (arbitrary coins)**", "**no**", "**needs DP**"],
          ["0/1 knapsack", "**no**", "needs DP"],
          ["Fractional knapsack", "**yes**", "items divisible"]
        ],
        n: "The **coin change** row is the classic trap and worth carrying: " +
          "with UK or US coins, greedily taking the largest coin is optimal — " +
          "which teaches the wrong lesson. With coins `{1, 3, 4}` and a target " +
          "of 6, greedy takes 4+1+1 (**three coins**) where the optimum is 3+3 " +
          "(**two**). The algorithm works on the currencies people test with " +
          "and fails on others, so the bug ships. The two rows either side of " +
          "knapsack are the sharpest illustration: **fractional** knapsack is " +
          "greedy-optimal because you can take part of an item, and **0/1** " +
          "knapsack is not, because you cannot. A tiny change in the problem " +
          "flips the answer, which is why *proving* the exchange argument " +
          "matters rather than testing a few cases."
      },

      miss: [
        {
          w: "If greedy gives the right answer on my test cases, it is correct.",
          r: "Greedy failures are **input-dependent and silent**. Coin change " +
            "with standard currency works and fails on `{1,3,4}`. Testing " +
            "cannot establish correctness here — you need an **exchange " +
            "argument** or a proof that the problem has the greedy-choice " +
            "property."
        },
        {
          w: "Greedy is a simpler version of dynamic programming.",
          r: "They solve **different classes**. Greedy requires that a local " +
            "choice is always part of some optimal solution; DP handles " +
            "problems where it is not. Greedy is not a shortcut through DP — " +
            "it applies where DP is unnecessary."
        },
        {
          w: "Greedy algorithms are always fast.",
          r: "Usually, and the cost depends on the choice rule. Greedy " +
            "algorithms often need **sorting first** — interval scheduling by " +
            "finish time, Kruskal by edge weight — so `O(n log n)` is common, " +
            "not `O(n)`."
        },
        {
          w: "If greedy is not optimal, it is useless.",
          r: "It is frequently an excellent **approximation**. Greedy set cover " +
            "achieves a proven `ln n` approximation ratio, which is the best " +
            "possible unless P = NP. For NP-hard problems a fast greedy answer " +
            "with a known bound is often exactly what you want."
        }
      ],

      trade: {
        buys: [
          "Very fast and simple where it applies.",
          "Low memory — no table, no recursion.",
          "Often provides a good approximation when not optimal.",
          "Frequently the natural formulation for scheduling and selection."
        ],
        costs: [
          "Usually not optimal, and fails silently when it is not.",
          "Correctness requires proof, not testing.",
          "The right greedy criterion is not obvious.",
          "Small changes to the problem can invalidate it."
        ],
        avoid: [
          "You cannot prove the greedy-choice property.",
          "Subproblems overlap and choices interact — use **DP**.",
          "Optimality is required and unproven.",
          "You are choosing it because DP looked hard, which is the usual " +
            "reason it is wrong."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sliding-window",

      why: {
        before: "Finding the best subarray of a given size meant computing the " +
          "aggregate for every starting position — `O(n·k)`, with almost all " +
          "of the work repeated.",
        problem: "Consecutive windows share all but two elements. Recomputing " +
          "the sum of a window of size 1,000 after moving one position " +
          "recomputes 998 additions that were already correct.",
        shift: "**Update incrementally.** Subtract the element leaving, add the " +
          "element entering — `O(1)` per step, `O(n)` overall. The variant " +
          "that matters more is the **variable-size** window: grow the right " +
          "edge while a condition holds, shrink from the left when it breaks, " +
          "and because each pointer only moves forward the whole scan is still " +
          "linear."
      },

      num: {
        t: "Fixed against variable windows",
        h: ["", "Fixed size", "Variable size"],
        r: [
          ["Window size", "given k", "**determined by a condition**"],
          ["Right pointer", "moves each step", "**always advances**"],
          ["Left pointer", "follows at distance k", "**advances when condition breaks**"],
          ["Total moves", "n", "**≤ 2n — still O(n)**"],
          ["Typical problems", "max sum of size k", "**longest substring with property**"]
        ],
        n: "The **≤ 2n** bound is the amortised argument that makes variable " +
          "windows linear despite the nested loop appearance: each pointer " +
          "moves forward at most n times in total, so even though the inner " +
          "`while` may run many times at one position, it cannot run many " +
          "times at *every* position. Seeing that is what separates people who " +
          "can apply the pattern from people who have memorised one instance " +
          "of it. The prerequisite that is easy to miss: the condition must be " +
          "**monotonic** — if a window violates it, extending further cannot " +
          "fix it. That holds for *sum ≤ target* on positive numbers and " +
          "**fails with negative numbers**, which is exactly when the pattern " +
          "silently produces wrong answers."
      },

      miss: [
        {
          w: "Sliding window is just a nested loop with an optimisation.",
          r: "The distinguishing property is that **both pointers only move " +
            "forward**, giving `O(n)` total. A nested loop where the inner " +
            "pointer resets is `O(n²)`. If your left pointer ever moves " +
            "backwards, it is not a sliding window."
        },
        {
          w: "It works on any subarray problem.",
          r: "It requires a **monotonic** condition: violating it cannot be " +
            "fixed by extending the window. *Sum ≤ target* with **negative " +
            "numbers** breaks this — adding a negative can bring the sum back " +
            "under, so shrinking from the left is wrong. That case needs " +
            "prefix sums with a hash map."
        },
        {
          w: "The window must be contiguous.",
          r: "It must be — that is the definition. Subsequence problems, where " +
            "elements need not be adjacent, are a different family requiring " +
            "**dynamic programming**. Confusing subarray with subsequence is a " +
            "common misreading of the problem statement."
        },
        {
          w: "You always know the window size in advance.",
          r: "The **variable-size** form is the more common and more useful one " +
            "— *longest substring without repeating characters* has no given " +
            "size. The size is an output, discovered as the window grows and " +
            "shrinks."
        }
      ],

      trade: {
        buys: [
          "`O(n)` for problems that look quadratic.",
          "`O(1)` extra space for simple aggregates.",
          "One pass — works on streams.",
          "A clear, reusable template once recognised."
        ],
        costs: [
          "Requires a monotonic condition.",
          "Contiguous ranges only.",
          "Some aggregates are hard to update incrementally — maximum needs a " +
            "deque.",
          "Off-by-one errors at the boundaries are easy."
        ],
        avoid: [
          "The condition is not monotonic — negative numbers with sum " +
            "constraints.",
          "You need subsequences rather than subarrays — that is DP.",
          "The aggregate cannot be updated incrementally.",
          "**Prefix sums** solve it more simply, which they often do for " +
            "range-sum queries."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "two-pointers",

      why: {
        before: "Finding a pair with a given property meant checking **every " +
          "pair** — two nested loops, `O(n²)`.",
        problem: "That ignores structure. In a **sorted** array, knowing that " +
          "`a[i] + a[j]` is too large tells you something definite: every " +
          "element to the right of `j` is larger, so all those pairs are also " +
          "too large. The nested loop rediscovers this at every position.",
        shift: "**Move two indices toward each other**, using the comparison " +
          "to decide which to move. Each step eliminates a whole row or column " +
          "of the pair space, so what was `O(n²)` becomes `O(n)` — provided " +
          "the input is sorted or otherwise structured."
      },

      num: {
        t: "The variants",
        h: ["Pattern", "Movement", "Typical use"],
        r: [
          ["**Opposite ends**", "**converge inward**", "two-sum on sorted, palindrome"],
          ["**Fast and slow**", "**different speeds**", "**cycle detection, middle of list**"],
          ["Same direction", "one leads", "remove duplicates in place"],
          ["Two sequences", "one per array", "merge, intersection"]
        ],
        n: "**Floyd's cycle detection** — the fast-and-slow variant — is worth " +
          "understanding rather than memorising: a fast pointer moving two " +
          "steps and a slow one moving one will meet inside any cycle, because " +
          "the gap closes by one each iteration. And the follow-up result is " +
          "genuinely elegant: **resetting one pointer to the head and " +
          "advancing both at the same speed makes them meet at the cycle's " +
          "start**, which falls out of the distance arithmetic. It detects " +
          "cycles in `O(1)` space where a hash set needs `O(n)`. The " +
          "prerequisite for the converging variant is **sorted input**, and " +
          "if you must sort first the total is `O(n log n)` — at which point a " +
          "hash map at `O(n)` may be the better answer."
      },

      miss: [
        {
          w: "Two pointers always requires sorted input.",
          r: "The **converging** variant does. **Fast-and-slow** works on " +
            "unsorted data and on linked lists, and same-direction pointers " +
            "work on any sequence. Sorting is a requirement of one variant, " +
            "not of the technique."
        },
        {
          w: "It is always better than using a hash map.",
          r: "For two-sum on **unsorted** data, a hash map is `O(n)` with one " +
            "pass; two pointers requires sorting first, making it " +
            "`O(n log n)`. Two pointers wins on **space** (`O(1)` against " +
            "`O(n)`) and when the input is already sorted."
        },
        {
          w: "Fast and slow pointers only detect cycles.",
          r: "They also find the **middle** of a linked list in one pass, the " +
            "**k-th from the end**, and the **start** of a cycle. The " +
            "underlying idea — two traversal speeds revealing structure — is " +
            "more general than cycle detection."
        },
        {
          w: "Deciding which pointer to move is arbitrary.",
          r: "It is the **correctness argument**. Moving the wrong one skips " +
            "valid answers. In sorted two-sum: sum too small means only a " +
            "larger left value can help, so move left. Being able to state that " +
            "reasoning is what makes the solution correct rather than lucky."
        }
      ],

      trade: {
        buys: [
          "`O(n²)` to `O(n)` on suitable problems.",
          "`O(1)` extra space.",
          "Works in place, no auxiliary structures.",
          "Fast-and-slow handles linked lists elegantly."
        ],
        costs: [
          "The converging variant needs sorted input.",
          "Only applies where structure permits elimination.",
          "Pointer movement logic requires a correctness argument.",
          "Boundary conditions are easy to get wrong."
        ],
        avoid: [
          "Data is unsorted and a **hash map** gives `O(n)` without sorting.",
          "You need all pairs, not one — the elimination does not apply.",
          "The structure does not let a comparison eliminate candidates.",
          "Memory is plentiful and a hash approach is clearer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "topological-sort",

      why: {
        before: "Dependencies were resolved by hand or by trial and error — " +
          "build this before that, install this package first — with the " +
          "ordering worked out by whoever wrote the script.",
        problem: "That does not scale and does not detect contradictions. A " +
          "build system with a thousand targets, a package manager, a " +
          "spreadsheet of formulas, a course prerequisite chain — all need an " +
          "order where every dependency comes before its dependent, and all " +
          "need to **detect when no such order exists**.",
        shift: "Formalise it as a graph problem. A **topological sort** of a " +
          "directed acyclic graph produces an ordering where every edge points " +
          "forward. Crucially, the algorithm also **detects cycles**: if no " +
          "valid ordering exists, the dependency graph has a loop, and that is " +
          "exactly the error a build system needs to report."
      },

      num: {
        t: "The two algorithms",
        h: ["", "Kahn's (BFS)", "DFS-based"],
        r: [
          ["Method", "**repeatedly remove in-degree 0**", "**reverse finish order**"],
          ["Cycle detection", "**leftover nodes**", "back edge found"],
          ["Complexity", "O(V+E)", "O(V+E)"],
          ["Output order", "natural forward", "**must reverse**"],
          ["Iterative", "**naturally**", "recursive by default"],
          ["Parallelism", "**shows what can run together**", "no"]
        ],
        n: "**Kahn's algorithm reveals parallelism for free**, which is its " +
          "practical advantage: all nodes with in-degree zero at any moment " +
          "have no unmet dependencies, so they can be processed " +
          "**simultaneously**. That is precisely how a parallel build system " +
          "decides what to compile at once. Its cycle detection is also more " +
          "informative — if nodes remain when no in-degree-zero node exists, " +
          "**those remaining nodes are the cycle**, which is what you want to " +
          "print in the error message. Note that the ordering is generally " +
          "**not unique**: any valid order is correct, so tests comparing " +
          "against one expected sequence are fragile unless the graph forces a " +
          "single answer."
      },

      miss: [
        {
          w: "There is one correct topological order.",
          r: "There are usually **many**. Independent nodes can appear in any " +
            "relative order. Tests that assert one specific sequence break when " +
            "an implementation detail changes — verify the **property** " +
            "(every edge points forward) rather than a specific ordering."
        },
        {
          w: "Topological sort works on any directed graph.",
          r: "It requires a **DAG**. If there is a cycle, no valid ordering " +
            "exists and the algorithm detects that rather than producing " +
            "output. That detection is often the more valuable result — it is " +
            "how circular dependencies get reported."
        },
        {
          w: "It is a sorting algorithm, so it compares elements.",
          r: "There is **no comparison function**. The order comes from the " +
            "graph's edges, not from any property of the nodes. It shares only " +
            "the word *sort* with comparison sorting."
        },
        {
          w: "You need to build the graph explicitly first.",
          r: "For **DFS-based** topological sort you can often generate edges " +
            "on demand, which matters when the graph is large or implicit. " +
            "Kahn's needs in-degree counts, so it generally does require " +
            "materialising the structure."
        }
      ],

      trade: {
        buys: [
          "Correct dependency ordering in linear time.",
          "Detects cycles — reports circular dependencies.",
          "Kahn's exposes what can be processed in parallel.",
          "Underpins build systems, package managers and schedulers."
        ],
        costs: [
          "Requires a DAG.",
          "The order is not unique, complicating testing.",
          "Needs the graph structure, which may be expensive to build.",
          "DFS recursion can overflow on deep graphs."
        ],
        avoid: [
          "The graph has cycles that are legitimate — you need SCC " +
            "decomposition first.",
          "There are no dependencies to order.",
          "You need shortest paths rather than an ordering.",
          "The dependencies are dynamic and change during processing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "semaphore",

      why: {
        before: "A **mutex** protects a resource by allowing exactly one " +
          "thread at a time. Simple, correct, and it models only one " +
          "situation.",
        problem: "Many resources permit **several** concurrent users but not " +
          "unlimited: a connection pool of twenty, an API allowing ten " +
          "concurrent calls, a buffer holding a hundred items. A mutex " +
          "serialises them entirely, wasting capacity you have.",
        shift: "**Count.** Dijkstra's semaphore holds an integer: `acquire` " +
          "decrements and blocks at zero, `release` increments. A semaphore " +
          "initialised to one behaves as a mutex; initialised to twenty it " +
          "permits twenty concurrent holders. It generalises the mutex to a " +
          "**capacity limit**."
      },

      num: {
        t: "Synchronisation primitives",
        h: ["Primitive", "Permits", "Ownership", "Typical use"],
        r: [
          ["**Mutex**", "1", "**owned — same thread must release**", "protect shared state"],
          ["**Semaphore**", "**N**", "**not owned — any thread may release**", "**limit concurrency**"],
          ["Binary semaphore", "1", "not owned", "signalling between threads"],
          ["Condition variable", "—", "with a mutex", "wait for a state change"]
        ],
        n: "**Ownership is the distinction people miss**, and it has real " +
          "consequences. A mutex is *owned* by the thread that locked it, so " +
          "only that thread may unlock — which lets the runtime detect misuse " +
          "and enables **priority inheritance** to prevent priority inversion. " +
          "A semaphore has no owner: **any** thread can release it, which is " +
          "exactly what makes it usable for signalling between threads (one " +
          "produces, another consumes) and exactly what makes it easier to " +
          "misuse. The classic failure is **leaking permits** — an exception " +
          "between `acquire` and `release` permanently reduces capacity, and " +
          "the pool silently shrinks until nothing can proceed. Always release " +
          "in a `finally` block or a scope guard."
      },

      miss: [
        {
          w: "A binary semaphore is the same as a mutex.",
          r: "Both permit one holder and **ownership differs**. A mutex must be " +
            "released by the locking thread; a binary semaphore can be " +
            "released by any thread. That makes semaphores suitable for " +
            "signalling and unsuitable for priority inheritance."
        },
        {
          w: "Semaphores prevent deadlock.",
          r: "They are a common **cause** of it. Two threads each holding one " +
            "permit and waiting for another deadlock exactly as with mutexes. " +
            "The usual prevention applies: consistent acquisition order, " +
            "timeouts, or acquiring everything at once."
        },
        {
          w: "You should release in the same function that acquires.",
          r: "You should release in a **`finally` block or scope guard**, " +
            "because an exception between acquire and release **permanently " +
            "leaks a permit**. Capacity silently drops, and the symptom appears " +
            "much later as unexplained blocking."
        },
        {
          w: "Semaphores are the right tool for limiting concurrency in modern " +
            "code.",
          r: "Often a **bounded thread pool**, a **rate limiter** or a " +
            "**bulkhead** expresses the intent more clearly and handles " +
            "queueing, timeouts and metrics. Semaphores are the primitive those " +
            "are built from, and raw semaphores in application code are usually " +
            "a lower level than needed."
        }
      ],

      trade: {
        buys: [
          "Limits concurrency to a chosen capacity.",
          "Any thread may release, enabling producer-consumer signalling.",
          "Simple, available in every threading library.",
          "Models real resource limits directly."
        ],
        costs: [
          "No ownership, so misuse is not detected.",
          "Leaked permits shrink capacity silently.",
          "Can deadlock like any lock.",
          "No priority inheritance — vulnerable to priority inversion.",
          "Lower level than most application code needs."
        ],
        avoid: [
          "You need mutual exclusion for shared state — use a **mutex**.",
          "A bounded thread pool or rate limiter expresses the intent better.",
          "You cannot guarantee release on every path.",
          "Real-time priority inversion is a concern."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "abstract-syntax-tree",

      why: {
        before: "Processing source code meant **text manipulation** — regular " +
          "expressions, string search, line-by-line rules.",
        problem: "Code is not text in any useful sense; it is **nested " +
          "structure** expressed as text. A regex cannot reliably match " +
          "balanced brackets, tell a comment from a string containing " +
          "comment-like text, or know that `x` in one scope is a different " +
          "variable from `x` in another. Every regex-based refactoring tool " +
          "eventually mangles something.",
        shift: "**Parse into a tree that represents structure, discarding " +
          "syntax.** An AST has a node for *if statement* with children for " +
          "condition and branches — no parentheses, no semicolons, no " +
          "whitespace. Analysis and transformation then operate on meaning " +
          "rather than characters."
      },

      num: {
        t: "Parse tree against AST",
        h: ["", "Concrete syntax tree", "Abstract syntax tree"],
        r: [
          ["Includes punctuation", "**yes**", "**no**"],
          ["Includes comments", "yes", "usually discarded"],
          ["Whitespace", "yes", "no"],
          ["Size", "**large**", "compact"],
          ["**Round-trips to source**", "**yes**", "**no — formatting is lost**"],
          ["Used by", "formatters, linters", "**compilers, transpilers**"]
        ],
        n: "The **round-trip** row explains a practical division: a code " +
          "formatter or a refactoring tool needs to **preserve comments and " +
          "formatting**, so it uses a concrete syntax tree or an AST augmented " +
          "with trivia. A compiler does not care — it is producing machine " +
          "code — so it uses a pure AST. This is why **Babel, ESLint, " +
          "TypeScript and Prettier** all parse JavaScript differently despite " +
          "handling the same language. ASTs are also the reason **Lisp macros " +
          "are so powerful**: in a homoiconic language the AST *is* the source " +
          "syntax, so manipulating code as data requires no parsing step at " +
          "all."
      },

      miss: [
        {
          w: "The AST is what the parser produces.",
          r: "A parser produces a **parse tree** (concrete syntax tree) " +
            "following the grammar exactly, including every token. The AST is " +
            "a **simplified** structure derived from it — many parsers build " +
            "it directly, but they are conceptually different artefacts."
        },
        {
          w: "You can regenerate the original source from an AST.",
          r: "You can generate **equivalent** source, and formatting, comments " +
            "and original spacing are gone. That is why tools needing to " +
            "preserve them use ASTs augmented with trivia, or concrete syntax " +
            "trees."
        },
        {
          w: "Working with ASTs means writing a parser.",
          r: "Nearly every language ships one — Python's `ast`, Java's " +
            "`JavaParser`, Babel and TypeScript for JavaScript, `tree-sitter` " +
            "for dozens of languages. Writing a parser is rarely necessary and " +
            "usually the wrong place to start."
        },
        {
          w: "AST manipulation is only relevant to compiler writers.",
          r: "Every linter, formatter, codemod, transpiler and IDE refactoring " +
            "operates on ASTs. Writing a custom ESLint rule or a codemod to " +
            "migrate an API across a large codebase is ordinary application " +
            "work built on AST manipulation."
        }
      ],

      trade: {
        buys: [
          "Structural understanding of code, not textual guessing.",
          "Reliable refactoring, linting and transformation.",
          "Language-agnostic tooling via common formats.",
          "The foundation of every compiler and IDE feature."
        ],
        costs: [
          "Formatting and comments are lost unless preserved deliberately.",
          "Node structures are verbose to construct and traverse.",
          "Parser-specific — Babel's AST differs from TypeScript's.",
          "A learning curve for the node types of each language."
        ],
        avoid: [
          "The change is genuinely textual — a global string rename.",
          "You need to preserve exact formatting and the parser discards it.",
          "An existing tool already does the transformation.",
          "The scale does not justify writing a codemod — sometimes editing " +
            "by hand is correct."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "composition-over-inheritance",

      why: {
        before: "Object-oriented design taught **inheritance** as the primary " +
          "reuse mechanism: a `Dog` extends `Animal`, inheriting and " +
          "specialising its behaviour. It models taxonomy elegantly.",
        problem: "Real requirements are not taxonomic. A `FlyingDuck`, a " +
          "`SwimmingDuck` and a `RobotDuck` do not form a clean hierarchy — " +
          "behaviours combine in ways a single-inheritance tree cannot " +
          "express. And inheritance is the **tightest possible coupling**: a " +
          "subclass depends on its parent's internals, so a change to the base " +
          "class breaks subclasses in ways nobody anticipated. This is the " +
          "**fragile base class problem**.",
        shift: "**Build behaviour by combining objects instead of extending " +
          "classes.** A duck *has a* fly behaviour and *has a* swim behaviour, " +
          "each replaceable independently and at run time. The relationship " +
          "becomes *has-a* rather than *is-a*, and coupling drops to the " +
          "interface."
      },

      num: {
        t: "The two mechanisms compared",
        h: ["", "Inheritance", "Composition"],
        r: [
          ["Relationship", "**is-a**", "**has-a**"],
          ["Coupling", "**tight — to internals**", "loose — to an interface"],
          ["Change behaviour at run time", "**no**", "**yes**"],
          ["Combine several behaviours", "**limited by single inheritance**", "**freely**"],
          ["Code reuse", "automatic", "explicit delegation"],
          ["Verbosity", "**low**", "**higher — forwarding methods**"]
        ],
        n: "The **run-time change** row is the practical advantage people " +
          "notice first: a composed behaviour can be swapped after " +
          "construction, which inheritance cannot do at all. The deeper " +
          "argument is the **Liskov Substitution Principle** — a subclass must " +
          "be usable anywhere its parent is, and violating it produces " +
          "genuinely broken code. The canonical example is `Square extends " +
          "Rectangle`: mathematically true, and code that sets width and height " +
          "independently breaks on a square. Inheritance is not wrong — it is " +
          "right for genuine **is-a** relationships with stable interfaces, and " +
          "**interface inheritance** (implementing a contract) is entirely " +
          "different from **implementation inheritance** (borrowing code), " +
          "which is what the advice targets."
      },

      miss: [
        {
          w: "Inheritance is bad and should be avoided.",
          r: "The advice is *prefer composition*, not *never inherit*. " +
            "Inheritance is correct for genuine **is-a** relationships with " +
            "stable base classes, and **interface inheritance** — implementing " +
            "a contract — is not what the guidance warns against at all."
        },
        {
          w: "Composition means having fields instead of a superclass.",
          r: "It means **delegating** to those fields through a defined " +
            "interface. Holding an object and reaching into its internals is " +
            "as coupled as inheritance. The benefit comes from depending on the " +
            "interface, not from the field."
        },
        {
          w: "Composition always produces cleaner code.",
          r: "It is **more verbose** — you write forwarding methods that " +
            "inheritance gives free. Languages mitigate this with delegation " +
            "keywords (Kotlin's `by`), traits or mixins. For a genuinely " +
            "hierarchical model, inheritance is less code and clearer."
        },
        {
          w: "The fragile base class problem is theoretical.",
          r: "It is why Java's collections framework has `AbstractList` with " +
            "carefully documented protected methods, and why Josh Bloch's " +
            "advice is *design for inheritance or prohibit it*. Changing a base " +
            "class method that subclasses override or depend on breaks them " +
            "silently — this happens routinely in real libraries."
        }
      ],

      trade: {
        buys: [
          "Behaviour combinable freely, not limited by a hierarchy.",
          "Swappable at run time.",
          "Loose coupling — depends on an interface, not internals.",
          "Easier to test — inject a mock behaviour.",
          "Avoids the fragile base class problem."
        ],
        costs: [
          "More verbose — forwarding methods to write.",
          "More objects and indirection.",
          "Less obvious structure than a hierarchy.",
          "Requires designing interfaces up front."
        ],
        avoid: [
          "The relationship is genuinely **is-a** and stable.",
          "You are implementing an interface — that is different guidance.",
          "The framework requires extending a base class.",
          "The hierarchy is shallow, stable and the extra indirection buys " +
            "nothing."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
