/* ==========================================================================
   Depth pass 42 — the vocabulary of dynamic programming, plus the remaining
   array and concurrency patterns.

   Optimal substructure and overlapping subproblems are not trivia. They are
   the two-question test that decides whether DP applies at all, and the
   reason greedy works on some problems and silently fails on others. Most
   wrong DP solutions are a failure to check one of them.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "optimal-substructure",

      why: {
        before: "Optimisation problems were attacked by searching the space of " +
          "possible solutions. Exhaustive search is correct and exponential.",
        problem: "The search is often unnecessary, but only for a specific " +
          "structural reason that needs naming. Why can shortest paths be " +
          "built from shorter shortest paths, while **longest simple paths** " +
          "cannot?",
        shift: "**Optimal substructure**: the optimal solution to a problem " +
          "contains optimal solutions to its subproblems. When it holds, you " +
          "can solve small pieces optimally and combine — which is what " +
          "licenses both dynamic programming and greedy algorithms. When it " +
          "fails, no amount of caching helps, because the sub-answers you " +
          "cached are the wrong ones to build on."
      },

      num: {
        t: "Where it holds and where it fails",
        h: ["Problem", "Optimal substructure?", "Why"],
        r: [
          ["**Shortest path**", "**yes**", "**subpaths of shortest paths are shortest**"],
          ["**Longest simple path**", "**no**", "**subpaths may revisit nodes**"],
          ["Matrix chain multiplication", "yes", "splits are independent"],
          ["0/1 knapsack", "yes", "by remaining capacity"],
          ["**Sorting**", "n/a", "not an optimisation problem"]
        ],
        n: "The **shortest / longest** contrast is the sharpest illustration " +
          "in the subject. If the shortest route from A to C passes through B, " +
          "then the A-to-B portion must itself be a shortest path — otherwise " +
          "you could substitute a better one and improve the whole. That " +
          "**cut-and-paste argument** is the standard way to prove optimal " +
          "substructure. It **fails** for longest simple paths: combining the " +
          "longest A-to-B path with the longest B-to-C path can revisit a " +
          "vertex, producing a non-simple path — the pieces are not " +
          "independent. This is not a minor technicality: longest simple path " +
          "is **NP-hard** while shortest path is polynomial, and the entire " +
          "difference is this property."
      },

      miss: [
        {
          w: "Optimal substructure is the same as overlapping subproblems.",
          r: "They are **independent** conditions and DP needs both. " +
            "Divide-and-conquer problems such as merge sort have optimal " +
            "substructure **without** overlap. Optimal substructure makes " +
            "combining valid; overlap makes caching worthwhile."
        },
        {
          w: "If subproblems exist, the property holds.",
          r: "Every problem decomposes somehow. The property requires that the " +
            "**optimal** whole is built from **optimal** parts. Longest simple " +
            "path decomposes fine and combining optimal parts gives an invalid " +
            "answer — which is why it is NP-hard."
        },
        {
          w: "It only matters for dynamic programming.",
          r: "**Greedy** algorithms need it too, plus the stronger " +
            "greedy-choice property. Divide-and-conquer relies on it. It is a " +
            "prerequisite for any technique that builds an answer from " +
            "sub-answers rather than searching everything."
        },
        {
          w: "You can check it by testing examples.",
          r: "Testing shows failures, never correctness. The standard proof is " +
            "the **cut-and-paste argument**: assume a subsolution is not " +
            "optimal, substitute a better one, and show the whole solution " +
            "improves — contradicting its optimality."
        }
      ],

      trade: {
        buys: [
          "Licenses DP, greedy and divide-and-conquer.",
          "Turns exponential search into polynomial time.",
          "Gives a rigorous test for whether an approach can work.",
          "The cut-and-paste argument is a reusable proof technique."
        ],
        costs: [
          "Requires proof, not intuition.",
          "Subtle to verify — the longest-path case looks fine superficially.",
          "Its absence often signals NP-hardness.",
          "Can depend on how the state is defined."
        ],
        avoid: [
          "Subproblem solutions interact or constrain each other.",
          "Global constraints such as *visit no vertex twice* span " +
            "subproblems.",
          "The problem is not an optimisation at all.",
          "A closed-form solution exists."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "overlapping-subproblems",

      why: {
        before: "Recursive decomposition is the natural way to express many " +
          "problems, and naive recursion on some of them is catastrophically " +
          "slow for reasons the code does not make visible.",
        problem: "Drawing the recursion tree for `fib(5)` reveals it: `fib(3)` " +
          "is computed **twice**, `fib(2)` **three times**, `fib(1)` **five " +
          "times**. The tree has exponentially many nodes and only `n` " +
          "**distinct** values among them. The waste is entirely repetition.",
        shift: "**Overlapping subproblems** names this: the same subproblem is " +
          "solved repeatedly by different branches of the recursion. It is the " +
          "condition that makes caching pay — and its absence is exactly why " +
          "memoising merge sort achieves nothing. Together with optimal " +
          "substructure it is the two-question test for dynamic programming."
      },

      num: {
        t: "The cost of overlap, unmemoised",
        h: ["Problem", "Distinct subproblems", "Naive recursive calls"],
        r: [
          ["**fib(40)**", "**41**", "**~331,000,000**"],
          ["Grid paths 20×20", "441", "~137 billion"],
          ["**Merge sort n=1024**", "**2,047**", "**2,047 — no overlap**"],
          ["Edit distance 20×20", "441", "~3^20"],
          ["Binary search n=1024", "**10 — no overlap**", "10"]
        ],
        n: "The **merge sort** and **binary search** rows are the control " +
          "group: their distinct subproblem count equals their call count, so " +
          "there is nothing to reuse and memoising them only adds overhead. " +
          "That is the practical test — **compare the number of distinct " +
          "subproblems against the number of recursive calls**; a large gap " +
          "means DP will help enormously, and no gap means it will not help at " +
          "all. The two conditions are genuinely independent: merge sort has " +
          "optimal substructure without overlap, and it is possible to " +
          "construct problems with overlap but no optimal substructure, where " +
          "caching speeds up an exhaustive search without permitting a " +
          "DP recurrence."
      },

      miss: [
        {
          w: "Any recursive algorithm benefits from memoisation.",
          r: "Only those with **overlap**. Merge sort, quicksort and binary " +
            "search never revisit a subproblem, so a cache adds lookup and " +
            "memory cost for zero saving. Memoise only after confirming " +
            "subproblems actually recur."
        },
        {
          w: "Overlap alone means dynamic programming applies.",
          r: "You also need **optimal substructure** — that combining optimal " +
            "sub-answers yields an optimal whole. Overlap makes caching " +
            "worthwhile; optimal substructure makes the recurrence correct. " +
            "Both are required."
        },
        {
          w: "The number of distinct subproblems is obvious from the code.",
          r: "It equals the size of the **state space**, which depends on how " +
            "you define the state. The same problem can have `O(n)` states " +
            "under one formulation and `O(n²)` under another — that choice is " +
            "the main lever on DP performance."
        },
        {
          w: "More overlap always means a bigger speedup.",
          r: "The gain is bounded by the **state space size**. If there are " +
            "`2^n` distinct states — bitmask DP over subsets — memoisation " +
            "removes repetition and the algorithm is still exponential. " +
            "Caching cannot make the state space smaller."
        }
      ],

      trade: {
        buys: [
          "Identifies exactly when caching converts exponential to polynomial.",
          "A concrete test: distinct subproblems against total calls.",
          "Explains why some recursions are fast and others are not.",
          "Guides state design — smaller state space, better DP."
        ],
        costs: [
          "Requires drawing or reasoning about the recursion tree.",
          "The distinct-subproblem count depends on state definition.",
          "Not sufficient alone — optimal substructure is also needed.",
          "An exponential state space caps the benefit."
        ],
        avoid: [
          "Subproblems are all distinct — that is divide-and-conquer.",
          "The state space is too large to store.",
          "A greedy rule is provably optimal — no caching needed.",
          "The recursion is shallow enough that repetition costs nothing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tabulation",

      why: {
        before: "Memoised recursion solves DP problems well: write the natural " +
          "recursion, add a cache, done. It is the fastest route from problem " +
          "to correct solution.",
        problem: "Recursion carries costs that matter at scale. Deep " +
          "recursion **overflows the stack** — Python defaults to about 1,000 " +
          "frames, so a DP over a 10,000-element array crashes. Call overhead " +
          "is real. And memoisation gives no obvious way to reduce memory " +
          "below the full state space.",
        shift: "**Fill the table bottom-up with loops.** Start from base cases " +
          "and iterate in an order guaranteeing each state's dependencies are " +
          "already computed. No stack, no call overhead, and — the real prize " +
          "— once you can see the fill order, you can often keep **only the " +
          "rows still needed**, collapsing `O(n·m)` memory to `O(m)`."
      },

      num: {
        t: "Tabulation against memoisation",
        h: ["", "Memoisation (top-down)", "Tabulation (bottom-up)"],
        r: [
          ["Order of computation", "**implicit — recursion decides**", "**explicit — you decide**"],
          ["States computed", "**only those reached**", "**all of them**"],
          ["Stack usage", "**O(depth) — can overflow**", "**none**"],
          ["Space optimisation", "hard", "**rolling array → O(1)**"],
          ["Ease of writing", "**easier**", "needs the fill order"],
          ["Constant factor", "call overhead", "**tight loops**"]
        ],
        n: "The **states computed** row cuts both ways and is the real " +
          "decision. Tabulation fills the entire table even if the answer " +
          "depends on a small fraction of it, so for a **sparse** state space " +
          "memoisation is faster despite its overhead. Where tabulation wins " +
          "decisively is **space**: many 2D DPs reference only the previous " +
          "row, so keeping two rows — or iterating a single row backwards, as " +
          "0/1 knapsack does — reduces memory dramatically. A 10,000 × 10,000 " +
          "table is **800 MB** as doubles; one row is **80 KB**. The practical " +
          "workflow is unchanged by any of this: **write the recursion, " +
          "memoise it, and convert to a table only if you need the space or " +
          "the stack depth**. Deriving the fill order before understanding the " +
          "recurrence is how people get stuck."
      },

      miss: [
        {
          w: "Tabulation is always faster than memoisation.",
          r: "It has better constants and computes **every** state. When only " +
            "a small fraction of states are reachable, memoisation does far " +
            "less total work and wins outright. Density of the state space " +
            "decides it."
        },
        {
          w: "You should write the table directly.",
          r: "Deriving the fill order requires already understanding the " +
            "recurrence. The reliable path is **recursion → memoisation → " +
            "table**, converting only if needed. Starting at the table is how " +
            "most people get the state definition wrong."
        },
        {
          w: "The fill order is always left to right.",
          r: "It must follow the **dependency order**, which varies. Interval " +
            "DP fills by increasing interval length; some problems fill " +
            "right-to-left; 0/1 knapsack's space-optimised form iterates " +
            "**backwards** precisely to avoid reusing an item within the same " +
            "pass."
        },
        {
          w: "Space optimisation is a minor refinement.",
          r: "It is often the difference between running and failing. Reducing " +
            "`O(n·m)` to `O(m)` turns 800 MB into 80 KB. The cost is that you " +
            "**lose the ability to reconstruct the solution path** — you have " +
            "the optimal value but not the choices that produced it."
        }
      ],

      trade: {
        buys: [
          "No recursion — no stack overflow.",
          "Tight loops, better constant factors.",
          "Enables rolling-array space reduction.",
          "Predictable, easy-to-profile memory access.",
          "Cache-friendly sequential iteration."
        ],
        costs: [
          "Computes every state, even unreachable ones.",
          "Requires deriving a valid fill order.",
          "Less readable than the recursive formulation.",
          "Space optimisation loses solution reconstruction."
        ],
        avoid: [
          "The state space is sparse — memoisation does less work.",
          "The fill order is hard to derive.",
          "Recursion depth is not a concern and clarity matters.",
          "You need to reconstruct the actual solution and cannot keep the " +
            "full table."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sliding-window-maximum",

      why: {
        before: "A sliding window with a **sum** updates in `O(1)` — subtract " +
          "what leaves, add what enters. The technique looks like it " +
          "generalises to any aggregate.",
        problem: "It does not. **Maximum has no inverse.** When the maximum " +
          "element leaves the window, you cannot subtract it — you have no " +
          "idea what the new maximum is, so you rescan the window at " +
          "`O(k)` per step, giving `O(n·k)` overall. A heap improves this to " +
          "`O(n log k)` and still carries stale entries.",
        shift: "**Keep a deque of indices whose values are decreasing.** " +
          "Before adding a new element, discard everything smaller from the " +
          "back — those can never be the maximum while the newer, larger " +
          "element is in the window. Drop indices that have fallen out of the " +
          "window from the front. **The front is always the answer**, and each " +
          "index enters and leaves once, so the total is **`O(n)`**."
      },

      num: {
        t: "Approaches compared, n = 1,000,000, k = 10,000",
        h: ["Approach", "Complexity", "Operations"],
        r: [
          ["Rescan each window", "O(n·k)", "**~10,000,000,000**"],
          ["Max-heap with stale entries", "O(n log k)", "~13,000,000"],
          ["**Monotonic deque**", "**O(n)**", "**~2,000,000**"],
          ["Extra space", "**O(k)**", "deque holds ≤ k indices"]
        ],
        n: "The deque is a **monotonic stack that can be popped from both " +
          "ends**, and the two ends do different jobs: the **back** discards " +
          "elements dominated by a newer larger one, the **front** discards " +
          "elements that have expired out of the window. Two implementation " +
          "points decide correctness. Store **indices, not values** — you " +
          "cannot tell whether a value has left the window without knowing its " +
          "position. And be deliberate about **equal values**: popping them " +
          "keeps the deque strictly decreasing and is fine for maximum, but if " +
          "you need to count occurrences or handle duplicates specially, " +
          "keeping them matters. The same structure with the comparison " +
          "reversed gives sliding window **minimum**, and both together solve " +
          "*longest subarray where max − min ≤ limit*."
      },

      miss: [
        {
          w: "A heap solves this well enough.",
          r: "A heap gives `O(n log k)` and cannot remove an arbitrary expired " +
            "element, so you carry **stale entries** and lazily discard them on " +
            "pop. The deque is `O(n)` and never holds anything invalid."
        },
        {
          w: "Store values in the deque.",
          r: "Store **indices**. Without a position you cannot tell whether the " +
            "front element has expired out of the window. Values are recovered " +
            "from the index; the position cannot be recovered from the value."
        },
        {
          w: "It is a variant of the ordinary sliding window.",
          r: "Ordinary sliding windows rely on the aggregate being " +
            "**invertible** — sum, count, XOR. Maximum is not, which is " +
            "precisely why it needs the deque. The two share the window " +
            "concept, not the mechanism."
        },
        {
          w: "The deque can grow to the input size.",
          r: "It holds at most `k` indices, since anything older than the " +
            "window is discarded from the front. Space is **`O(k)`**, and in " +
            "practice usually far less because dominated elements are removed " +
            "from the back."
        }
      ],

      trade: {
        buys: [
          "`O(n)` where the obvious approach is `O(n·k)`.",
          "`O(k)` space, typically much less in practice.",
          "One pass — works on streams.",
          "Same structure handles minimum, and both together.",
          "No stale entries to manage."
        ],
        costs: [
          "Requires a deque, not a plain stack or queue.",
          "Index-versus-value confusion is a common bug.",
          "Equal-value handling needs a deliberate decision.",
          "Harder to read than a rescan."
        ],
        avoid: [
          "The aggregate is invertible — a plain sliding window is simpler.",
          "The window size is tiny and rescanning is cheap.",
          "You need the full sorted window, not just the extreme.",
          "The window is not contiguous."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cyclic-sort",

      why: {
        before: "Finding a missing or duplicated number in an array holding " +
          "values `1..n` was done with a hash set or by sorting — `O(n)` extra " +
          "space, or `O(n log n)` time.",
        problem: "Both ignore a strong piece of structure: the values " +
          "themselves **are** valid indices. An array of `1..n` has exactly " +
          "one natural resting place per value, and neither sorting nor " +
          "hashing exploits that.",
        shift: "**Put each value at its own index.** Walk the array; if the " +
          "value at position `i` does not belong there, swap it to where it " +
          "does. Each swap places at least one value permanently, so despite " +
          "the inner loop the total is **`O(n)` with `O(1)` space**. " +
          "Afterwards, any position holding the wrong value points directly at " +
          "the missing, duplicated or misplaced number."
      },

      num: {
        t: "What one pass then answers, in O(1) space",
        h: ["Question", "After sorting, look for"],
        r: [
          ["**Missing number**", "**first index i where a[i] ≠ i+1**"],
          ["Duplicate number", "value that could not be placed"],
          ["**All missing numbers**", "**every index with a[i] ≠ i+1**"],
          ["First missing positive", "**same scan, ignoring out-of-range**"],
          ["Set mismatch", "the index that is wrong"]
        ],
        n: "The **`O(n)` claim needs its argument**, because the code has a " +
          "`while` inside a `for` and looks quadratic: every swap moves at " +
          "least one element to its **final** position, and there are only `n` " +
          "positions, so there can be at most `n` swaps in total across the " +
          "entire run. Same amortised reasoning as sliding window and " +
          "monotonic stack. The precondition is narrow and must be checked: " +
          "**values must form a known contiguous range mapping onto indices**, " +
          "typically `1..n` or `0..n−1`. The `first missing positive` row is " +
          "the version that appears most in real interviews because it adds " +
          "out-of-range values you simply skip. Note the technique " +
          "**mutates the input** — if the caller needs the original order, " +
          "this is the wrong tool."
      },

      miss: [
        {
          w: "The nested loop makes it `O(n²)`.",
          r: "Each swap places a value at its **final** index, and there are " +
            "only `n` indices, so at most `n` swaps occur across the whole " +
            "run. The inner loop can run several times at one position only " +
            "because it will then run zero times at others."
        },
        {
          w: "It works on any array.",
          r: "It requires values forming a **known contiguous range that maps " +
            "onto indices** — `1..n` or `0..n−1`. Arbitrary values have no " +
            "natural home index, and the technique does not apply at all."
        },
        {
          w: "It is a general sorting algorithm.",
          r: "It is a **placement** technique for a very specific input shape. " +
            "It cannot sort arbitrary comparable data, and it is not competing " +
            "with quicksort — it competes with using a hash set to find " +
            "missing values."
        },
        {
          w: "It preserves the input.",
          r: "It **mutates the array in place** — that is how it achieves " +
            "`O(1)` space. If the caller needs the original ordering you must " +
            "copy first, which reintroduces the `O(n)` space you were avoiding."
        }
      ],

      trade: {
        buys: [
          "`O(n)` time, `O(1)` extra space.",
          "One pass then answers missing, duplicate and mismatch questions.",
          "No hashing, no sorting.",
          "Simple once the index mapping is clear."
        ],
        costs: [
          "Requires values in a known contiguous range.",
          "Mutates the input.",
          "Looks quadratic, so it needs explaining to readers.",
          "Off-by-one errors between 0-based and 1-based ranges."
        ],
        avoid: [
          "Values are not a contiguous index-mapped range.",
          "The input must not be modified.",
          "You need a general sort.",
          "Clarity matters more than the `O(n)` space saving."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "adjacency-list",

      why: {
        before: "The obvious way to store a graph is an **adjacency matrix**: " +
          "an `n × n` grid where `m[i][j]` says whether an edge exists. Edge " +
          "lookup is `O(1)` and the structure is trivial to reason about.",
        problem: "It costs `V²` memory **regardless of how many edges exist**. " +
          "A social graph with a million users and an average of 200 friends " +
          "each has 200 million edges and would need a **10¹²-entry matrix** — " +
          "a terabyte to store almost entirely zeroes. Worse, iterating one " +
          "vertex's neighbours means scanning all `V` columns.",
        shift: "**Store, for each vertex, only the neighbours it actually " +
          "has.** Memory becomes `O(V + E)` — proportional to the real graph " +
          "rather than to the square of its vertex count — and iterating a " +
          "vertex's neighbours costs `O(degree)` instead of `O(V)`. Since " +
          "almost all real-world graphs are **sparse**, this is the default " +
          "representation."
      },

      num: {
        t: "Adjacency list against matrix",
        h: ["", "Adjacency list", "Adjacency matrix"],
        r: [
          ["Space", "**O(V + E)**", "**O(V²)**"],
          ["**Is there an edge u→v?**", "**O(degree)**", "**O(1)**"],
          ["Iterate neighbours of u", "**O(degree)**", "**O(V)**"],
          ["Add an edge", "O(1)", "O(1)"],
          ["Remove an edge", "O(degree)", "**O(1)**"],
          ["Best for", "**sparse — most real graphs**", "**dense, or frequent edge tests**"]
        ],
        n: "Concretely, at one million vertices and 200 million edges, the " +
          "list needs roughly **1.6 GB** and the matrix roughly **1 TB** — the " +
          "difference between fitting on a machine and not. The threshold is " +
          "density: matrices become competitive once `E` approaches `V²`, " +
          "which in practice means small graphs or genuinely dense ones like " +
          "all-pairs distance tables. The **hybrid** worth knowing is an " +
          "adjacency list whose neighbour collections are **hash sets** rather " +
          "than arrays: `O(1)` edge existence tests *and* `O(V + E)` space, at " +
          "the cost of worse cache locality and per-entry overhead. For " +
          "maximum performance on static graphs, **compressed sparse row** — " +
          "one flat neighbour array plus an offset array per vertex — gives " +
          "the best cache behaviour of all, which is why graph processing " +
          "libraries use it."
      },

      miss: [
        {
          w: "Adjacency lists are always better.",
          r: "For **dense** graphs where `E` approaches `V²`, a matrix uses " +
            "comparable memory and gives `O(1)` edge tests with far better " +
            "cache behaviour. Algorithms like Floyd–Warshall are written " +
            "against matrices for exactly this reason."
        },
        {
          w: "Checking whether an edge exists is fast.",
          r: "It is **`O(degree)`** — a scan of that vertex's neighbours. On a " +
            "hub vertex with a million neighbours that is slow. Use hash sets " +
            "as the neighbour collections if edge tests are frequent."
        },
        {
          w: "It must be a list of linked lists.",
          r: "The name is historical. Modern implementations use **dynamic " +
            "arrays** for cache locality, **hash sets** for fast edge tests, or " +
            "**compressed sparse row** for static graphs. The concept is " +
            "*per-vertex neighbour storage*, not a particular container."
        },
        {
          w: "Undirected edges are stored once.",
          r: "They appear in **both** vertices' lists, so the storage is `2E` " +
            "entries. Forgetting to add the reverse direction is one of the " +
            "most common graph bugs, and it produces a graph that looks " +
            "correct until a traversal mysteriously fails to reach part of it."
        }
      ],

      trade: {
        buys: [
          "`O(V + E)` space — proportional to the actual graph.",
          "Neighbour iteration in `O(degree)`.",
          "Handles the sparse graphs that dominate real applications.",
          "Extends naturally to weights and edge attributes.",
          "Cheap to add vertices and edges."
        ],
        costs: [
          "Edge existence tests are `O(degree)`.",
          "Edge removal requires a scan.",
          "Pointer or array overhead per vertex.",
          "Worse cache locality than a matrix on dense graphs.",
          "Undirected edges stored twice."
        ],
        avoid: [
          "The graph is dense — a matrix is comparable and simpler.",
          "Edge existence tests dominate — use a matrix or hash sets.",
          "The algorithm is matrix-formulated, such as Floyd–Warshall.",
          "The graph is tiny and the representation is irrelevant."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "state-machine",

      why: {
        before: "Behaviour that depends on history was implemented with " +
          "scattered boolean flags: `isLoading`, `hasError`, `isSubmitted`, " +
          "`isValidated`. Each new requirement added another flag.",
        problem: "`n` booleans define **2ⁿ** combinations, and most are " +
          "**impossible** — loading and submitted simultaneously, error set " +
          "with no error message. Nothing prevents them being reached. Bugs " +
          "arrive as *how did it get into this state?*, and the answer is that " +
          "the state space was never defined, only implied.",
        shift: "**Enumerate the states explicitly and define which " +
          "transitions are legal.** A finite state machine has a fixed set of " +
          "states, an initial state, and transitions triggered by events. " +
          "Impossible combinations become **unrepresentable** rather than " +
          "merely undesirable, and the machine is a specification you can " +
          "test, diagram and reason about exhaustively."
      },

      num: {
        t: "Booleans against explicit states",
        h: ["", "4 boolean flags", "Explicit state machine"],
        r: [
          ["Representable states", "**16**", "**4**"],
          ["Valid states", "4", "**4 — all of them**"],
          ["**Invalid states reachable**", "**12**", "**0**"],
          ["Illegal transitions", "unprevented", "**rejected by construction**"],
          ["Testing", "**16 combinations**", "**states × events**"],
          ["Documentation", "read the code", "**the diagram is the spec**"]
        ],
        n: "The **12 invalid states** are where the bugs live, and the shift " +
          "eliminates them by construction rather than by discipline. A " +
          "further gain comes from pairing states with their data — a " +
          "**tagged union** where the `error` state carries a message and the " +
          "`success` state carries a payload makes *error with no message* a " +
          "type error rather than a runtime surprise. The distinction worth " +
          "carrying: a **finite** state machine has no memory beyond its " +
          "current state, which is what makes it analysable and also what " +
          "limits it — an FSM cannot match balanced brackets, because that " +
          "requires unbounded counting. **Statecharts** (Harel) extend the " +
          "model with nested and parallel states, which is what libraries like " +
          "XState implement for UI work where flat machines would explode " +
          "combinatorially."
      },

      miss: [
        {
          w: "State machines are for parsers and embedded systems.",
          r: "They fit any history-dependent behaviour: UI flows, order " +
            "lifecycles, connection handling, payment processing, workflow " +
            "engines, TCP itself. Anywhere *what happens next depends on what " +
            "happened before*, an implicit state machine already exists — the " +
            "choice is whether it is written down."
        },
        {
          w: "Enumerating states is more code than a few booleans.",
          r: "It is often less, and it **removes** the invalid states rather " +
            "than requiring guards against them. The alternative is a growing " +
            "collection of `if (isLoading && !hasError && ...)` conditions " +
            "that must each be kept consistent by hand."
        },
        {
          w: "A finite state machine can express any logic.",
          r: "It cannot count without bound. Matching balanced brackets " +
            "requires a **pushdown automaton** (a stack); arbitrary " +
            "computation requires a Turing machine. That limit is exactly why " +
            "**regular expressions cannot parse HTML**."
        },
        {
          w: "The states are always obvious.",
          r: "Identifying them is the design work. Too few and you smuggle " +
            "state back in as flags; too many and the machine becomes " +
            "unreadable. **Statecharts** with nested and parallel states exist " +
            "because flat machines explode combinatorially on real UI flows."
        }
      ],

      trade: {
        buys: [
          "Invalid states become unrepresentable.",
          "Illegal transitions are rejected by construction.",
          "The diagram doubles as documentation and specification.",
          "Exhaustively testable — states × events is finite.",
          "Pairs naturally with tagged unions for state-specific data."
        ],
        costs: [
          "Requires designing the state space up front.",
          "Adding a state may touch every transition.",
          "Flat machines explode on complex flows.",
          "Cannot express unbounded counting.",
          "More ceremony than a boolean for genuinely simple cases."
        ],
        avoid: [
          "The behaviour has no history dependence.",
          "There are genuinely only two states and one transition.",
          "The logic needs unbounded memory — use a parser.",
          "States change so frequently that the machine is rewritten each " +
            "sprint."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "atomic-operation",

      why: {
        before: "`counter = counter + 1` looks indivisible in source code. " +
          "Two threads incrementing a shared counter ought to produce two " +
          "increments.",
        problem: "It compiles to **three** machine operations — load, add, " +
          "store — and a thread can be interrupted between any two. Both " +
          "threads load 5, both add 1, both store 6. **One increment is lost**, " +
          "and nothing in the source hints at it. The bug appears under load, " +
          "irregularly, and vanishes under a debugger.",
        shift: "**Atomic operations complete indivisibly** — no other thread " +
          "can observe a partial result. Hardware provides them directly: " +
          "`LOCK XADD` for fetch-and-add, `CMPXCHG` for compare-and-swap. They " +
          "are the primitive from which mutexes, semaphores and every " +
          "lock-free structure are built."
      },

      num: {
        t: "Cost of a shared counter increment",
        h: ["Approach", "Uncontended", "Contended", "Correct?"],
        r: [
          ["Plain `++`", "**~1 ns**", "~1 ns", "**no — lost updates**"],
          ["**Atomic increment**", "**~5–20 ns**", "**~100+ ns**", "**yes**"],
          ["Mutex", "~20 ns", "**~1,000+ ns (syscall)**", "yes"],
          ["**Per-thread counters, summed**", "**~1 ns**", "**~1 ns**", "**yes**"]
        ],
        n: "The **contended** column carries the real lesson: an atomic " +
          "operation forces the cache line into exclusive state on one core, " +
          "so under contention every increment **bounces the line between " +
          "cores** and costs far more than the uncontended number suggests. " +
          "This is why the last row — **sharding the counter per thread and " +
          "summing on read** — outperforms atomics for high-frequency counters, " +
          "and it is exactly what Java's `LongAdder` does. Two further points. " +
          "**Atomicity is not visibility**: a value can be updated atomically " +
          "and still not be seen by another thread promptly, which is what " +
          "memory-ordering guarantees address, and why languages distinguish " +
          "relaxed from sequentially-consistent atomics. And **compare-and-swap " +
          "is the universal primitive** — every lock-free algorithm is built " +
          "on a CAS retry loop — with the caveat of the **ABA problem**: a " +
          "value can change from A to B and back to A, so a CAS succeeds even " +
          "though the world moved underneath it. Version-tagged pointers or " +
          "hazard pointers exist to handle that."
      },

      miss: [
        {
          w: "A single line of code is atomic.",
          r: "`i++` compiles to load, add and store — three operations, " +
            "interruptible between any two. Atomicity is a property of the " +
            "**machine instructions and memory model**, never of source-line " +
            "granularity."
        },
        {
          w: "Atomic means thread-safe.",
          r: "Each **individual** operation is indivisible. A sequence of " +
            "atomic operations is **not** atomic as a whole — check-then-act " +
            "on two atomics still races. Compound invariants need a lock or a " +
            "single CAS covering the whole change."
        },
        {
          w: "Atomics are always faster than locks.",
          r: "Uncontended, yes. Under **heavy contention**, cache-line " +
            "bouncing can make an atomic counter slower than a well-implemented " +
            "lock, and slower still than per-thread sharding. Measure rather " +
            "than assume."
        },
        {
          w: "Atomicity guarantees other threads see the value.",
          r: "That is **visibility**, a separate guarantee governed by the " +
            "**memory model**. Relaxed atomics are indivisible but carry no " +
            "ordering constraints, so another thread may not observe the update " +
            "for some time. Sequential consistency costs more and provides it."
        }
      ],

      trade: {
        buys: [
          "Correctness without a lock for single-variable updates.",
          "No blocking, no deadlock, no context switch.",
          "The foundation of every lock-free data structure.",
          "Hardware-supported and fast when uncontended.",
          "Compare-and-swap is universal — anything can be built on it."
        ],
        costs: [
          "Only atomic individually, not in sequence.",
          "Cache-line bouncing under contention.",
          "Memory ordering is subtle and easy to get wrong.",
          "CAS retry loops can livelock.",
          "The ABA problem in pointer-based structures."
        ],
        avoid: [
          "Multiple variables must change together — use a **lock**.",
          "Contention is extreme — shard per thread and combine.",
          "The code is single-threaded — atomics only cost.",
          "You would need a lock-free algorithm you cannot prove correct."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
