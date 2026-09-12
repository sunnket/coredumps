/* ==========================================================================
   Depth pass 24 — the last of the advanced algorithms: graph decomposition,
   string matching, and the dynamic programming patterns.

   A note on the DP terms: people learn them as separate tricks, and they are
   one idea applied to different state shapes. The question in every case is
   "what is the smallest thing I need to remember to make the next decision",
   and the named patterns are just common answers — a subset, a range, a
   subtree, a mode.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "strongly-connected-component",

      why: {
        before: "Connectivity in an **undirected** graph is simple — run a DFS " +
          "and label each component. Every vertex you reach can reach you back.",
        problem: "Direction breaks that symmetry. In a directed graph, A " +
          "reaching B says nothing about B reaching A. *Which vertices are " +
          "mutually reachable* is a genuinely harder question, and a naive " +
          "answer — run a search from every vertex — costs `O(V·(V+E))`.",
        shift: "Find groups where **every vertex reaches every other**. " +
          "Contract each such group to a single node and the result is " +
          "provably a **DAG** — the *condensation* — which is the real payoff: " +
          "an arbitrary directed graph becomes acyclic, and every DAG " +
          "algorithm (topological sort, longest path, DP over the order) " +
          "becomes available."
      },

      num: {
        t: "The two linear algorithms",
        h: ["", "Tarjan", "Kosaraju"],
        r: [
          ["DFS passes", "**1**", "2"],
          ["Needs reversed graph", "no", "**yes**"],
          ["Complexity", "O(V+E)", "O(V+E)"],
          ["Constant factor", "**better**", "worse"],
          ["Easier to explain", "no", "**yes**"],
          ["Output order", "reverse topological", "topological"]
        ],
        n: "Both are linear; the choice is practical. **Tarjan** does one pass " +
          "using a low-link value and a stack, and is what you want in " +
          "production. **Kosaraju** does a DFS, reverses every edge, and does " +
          "another DFS in decreasing finish-time order — it needs the reversed " +
          "graph in memory but is far easier to reason about and to prove " +
          "correct, which is why it is taught first. The applications are " +
          "concrete: **2-SAT** is solved by building an implication graph and " +
          "checking that no variable shares an SCC with its negation; " +
          "**deadlock detection** finds cycles in a wait-for graph; and " +
          "dependency resolution uses the condensation to find mutually " +
          "recursive module groups."
      },

      miss: [
        {
          w: "An SCC is just a cycle.",
          r: "A cycle is one path returning to its start. An SCC is a **maximal " +
            "set of mutually reachable vertices**, which may contain many " +
            "overlapping cycles. Every vertex not on any cycle is also its own " +
            "SCC of size one."
        },
        {
          w: "You can find SCCs by finding all cycles.",
          r: "A graph can have exponentially many cycles, so enumerating them " +
            "is hopeless. SCC algorithms are linear precisely because they " +
            "**never enumerate cycles** — they track reachability relationships " +
            "during a single traversal."
        },
        {
          w: "The condensation is a useful graph in its own right.",
          r: "It is more than useful — it is often **the point**. Contracting " +
            "SCCs turns any directed graph into a DAG, which unlocks " +
            "topological sorting and DP over a partial order. Many problems " +
            "reduce to *find the SCCs, then solve on the DAG*."
        },
        {
          w: "Tarjan's low-link value is the smallest reachable vertex index.",
          r: "It is the smallest index reachable **using at most one back " +
            "edge**, and only via vertices still on the stack. Getting that " +
            "subtlety wrong — updating low-link from a vertex already assigned " +
            "to an SCC — is the classic implementation bug."
        }
      ],

      trade: {
        buys: [
          "Linear-time decomposition of any directed graph.",
          "The condensation is a DAG, unlocking DAG algorithms.",
          "Solves 2-SAT, deadlock detection and dependency cycles.",
          "Reveals mutually recursive structure in code and data."
        ],
        costs: [
          "Tarjan's low-link logic is subtle and error-prone.",
          "Kosaraju needs the reversed graph in memory.",
          "Recursive implementations can overflow the stack on deep graphs.",
          "Only meaningful for directed graphs."
        ],
        avoid: [
          "The graph is undirected — plain connected components via DFS or " +
            "union-find.",
          "You only need to know **whether** a cycle exists — a single DFS " +
            "with colouring is simpler.",
          "The graph is already known to be a DAG.",
          "You need the actual cycles rather than the components."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dp-on-trees",

      why: {
        before: "Dynamic programming on arrays and grids has an obvious " +
          "ordering: fill left to right, or row by row. Subproblems are " +
          "indexed by position.",
        problem: "A tree has no linear order. Which subproblem do you solve " +
          "first? And a node's answer may depend on both its **subtree** and " +
          "the rest of the tree **above** it, which are computed in opposite " +
          "directions.",
        shift: "Let the recursion define the order. Each **subtree** is a " +
          "subproblem, solved bottom-up by post-order DFS — a node combines " +
          "its children's answers after they are computed. Where the answer " +
          "also depends on what is above, a **second downward pass** " +
          "distributes that information: the *rerooting* technique."
      },

      num: {
        t: "The two shapes of tree DP",
        h: ["Pattern", "Passes", "Answers"],
        r: [
          ["Bottom-up only", "1 (post-order)", "*answer for the whole tree*"],
          ["**Rerooting**", "**2 (up, then down)**", "*answer for every node as root*"],
          ["With extra state", "1–2", "*including/excluding this node*"]
        ],
        n: "**Rerooting** is the technique worth learning properly, because it " +
          "turns an `O(n²)` problem into `O(n)`. If you need the answer *for " +
          "every node as root* — the classic example being *the sum of " +
          "distances from each node to all others* — the naive approach runs a " +
          "DFS from each node. Instead, compute the answer for one root " +
          "bottom-up, then push down: a child's answer is derivable from its " +
          "parent's by accounting for the edge between them. The typical DP " +
          "state carries a **second dimension** — for the maximum independent " +
          "set problem, `dp[node][0]` and `dp[node][1]` are the best answers " +
          "excluding and including that node, since a node and its child " +
          "cannot both be chosen."
      },

      miss: [
        {
          w: "Tree DP is just recursion with memoisation.",
          r: "Memoisation is not even needed — each subtree is visited " +
            "**exactly once** in a post-order traversal, so there is nothing to " +
            "cache. That is why it is naturally `O(n)`, unlike DP on general " +
            "graphs where overlapping subproblems require memoisation."
        },
        {
          w: "You can only compute answers for the whole tree.",
          r: "**Rerooting** gives the answer for every node as root in `O(n)` " +
            "total, using a second downward pass. Assuming you need `O(n²)` for " +
            "all-roots problems is the most common missed optimisation."
        },
        {
          w: "The recursion is fine because trees are shallow.",
          r: "A **degenerate** tree — essentially a linked list — is `n` deep " +
            "and will overflow the stack in most languages at a few tens of " +
            "thousands of nodes. Competitive problems construct exactly this. " +
            "An iterative post-order traversal or an explicit stack is the fix."
        },
        {
          w: "It only applies to actual tree data structures.",
          r: "It applies to any acyclic structure with a root — expression " +
            "trees in compilers, directory hierarchies, organisational charts, " +
            "and phylogenetic trees. It also extends to DAGs with memoisation, " +
            "where subproblems genuinely do overlap."
        }
      ],

      trade: {
        buys: [
          "Linear time on tree-structured problems.",
          "No memoisation needed — each subtree visited once.",
          "Rerooting gives all-roots answers in linear time.",
          "Maps naturally onto recursive tree traversal."
        ],
        costs: [
          "Recursion depth is a real hazard on degenerate trees.",
          "Rerooting is genuinely tricky to derive correctly.",
          "Extra state dimensions multiply memory.",
          "Requires the structure to actually be a tree."
        ],
        avoid: [
          "The graph has cycles — decompose into SCCs first, or use a " +
            "different method.",
          "The tree is small enough for a brute-force traversal.",
          "You need all-pairs information that does not decompose by subtree.",
          "Recursion depth would overflow and an iterative rewrite is not " +
            "worth it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bitmask-dp",

      why: {
        before: "Problems over **subsets** — visit every city once, assign " +
          "every task to a worker — were solved by generating permutations. " +
          "For n items that is `n!`, which is 3.6 million at n=10 and " +
          "hopeless at n=15.",
        problem: "The permutation search recomputes the same situations " +
          "repeatedly. Having visited cities {1,3,5} and now standing at city " +
          "3, the best completion is the same regardless of the *order* those " +
          "three were visited. The order is being tracked and does not matter.",
        shift: "Make the **set** the state, not the sequence. A subset of n " +
          "items is a bitmask — an integer whose bits say which are included — " +
          "so `dp[mask][i]` is *the best cost having visited exactly `mask`, " +
          "currently at `i`*. Complexity drops from `O(n!)` to `O(2ⁿ · n²)`."
      },

      num: {
        t: "Travelling salesman: brute force against bitmask DP",
        h: ["n", "n! permutations", "2ⁿ·n² states", "Feasible?"],
        r: [
          ["10", "3.6 million", "~102,000", "both"],
          ["15", "1.3 trillion", "~7.4 million", "**only DP**"],
          ["20", "2.4×10¹⁸", "~419 million", "DP, slowly"],
          ["25", "1.5×10²⁵", "~21 billion", "**neither**"]
        ],
        n: "The **n ≈ 20 ceiling** is the thing to internalise: `2ⁿ` grows fast " +
          "enough that bitmask DP is a technique for *small* n, and seeing a " +
          "constraint like `n ≤ 20` in a problem statement is a strong hint " +
          "that this is the intended solution. Memory is usually the binding " +
          "constraint before time — `2²⁰ × 20` integers is about 84MB. The " +
          "essential idioms: `mask & (1 << i)` tests membership, " +
          "`mask | (1 << i)` adds, and **iterating all submasks** of a mask " +
          "with `for (s = mask; s; s = (s-1) & mask)` — which sums to `O(3ⁿ)` " +
          "across all masks, not `O(4ⁿ)`, and is the standard trick for " +
          "set-partition problems."
      },

      miss: [
        {
          w: "Bitmask DP makes exponential problems tractable.",
          r: "It reduces `O(n!)` to `O(2ⁿ·n²)` — **still exponential**, just a " +
            "far smaller exponential. It moves the feasible boundary from about " +
            "n=11 to about n=20 and no further. For larger n you need " +
            "approximation or a specialised solver."
        },
        {
          w: "You should use it whenever the problem involves subsets.",
          r: "Only when **n is small** — roughly 20 or fewer. With n=30 you " +
            "need a billion states and it is hopeless. The constraint size in " +
            "the problem statement tells you whether it is intended."
        },
        {
          w: "Iterating over all submasks of every mask is O(4ⁿ).",
          r: "It is **`O(3ⁿ)`**. Each element is in the mask and the submask, " +
            "in the mask only, or in neither — three states per element. This " +
            "is a standard result and the difference matters: 3²⁰ is about 3.5 " +
            "billion against 4²⁰ at 1.1 trillion."
        },
        {
          w: "The bits must represent items directly.",
          r: "The mask can encode any small set of binary facts — which colours " +
            "have been used, which constraints are satisfied, which cells in a " +
            "narrow grid row are filled. **Broken profile DP** tiles grids using " +
            "a mask of one row's state, and the bits mean *this cell is " +
            "covered*, not *this item is chosen*."
        }
      ],

      trade: {
        buys: [
          "Turns factorial into exponential — a decisive difference at n≈15–20.",
          "The state is a single integer: fast, cache-friendly, easy to hash.",
          "Bit operations are single instructions.",
          "A general pattern for subset, assignment and TSP-shaped problems."
        ],
        costs: [
          "Hard ceiling around n=20.",
          "Memory grows as `2ⁿ` and usually binds before time does.",
          "Bit manipulation is easy to get subtly wrong.",
          "Harder to read than an explicit set."
        ],
        avoid: [
          "n exceeds ~20 — use approximation, branch-and-bound or a solver.",
          "The problem has structure permitting a polynomial solution — check " +
            "first.",
          "A greedy or flow formulation applies, which is far faster.",
          "The set does not fit in a machine word and you would need a " +
            "multi-word mask."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "z-algorithm",

      why: {
        before: "**KMP** solved linear-time string matching with a failure " +
          "function — correct, and the derivation is genuinely hard to " +
          "reconstruct from memory.",
        problem: "KMP's failure function answers *the longest proper prefix " +
          "that is also a suffix of what I have matched*, which is a " +
          "double-negative-shaped statement that people repeatedly implement " +
          "off by one.",
        shift: "Ask a more direct question. For each position `i`, **how long " +
          "is the longest substring starting at `i` that matches a prefix of " +
          "the whole string?** That is the Z-array. Matching becomes: " +
          "concatenate `pattern + separator + text`, compute Z, and every " +
          "position where `Z[i] = |pattern|` is a match."
      },

      num: {
        t: "Z-array of `aabxaabxcaabxaabxay`",
        h: ["i", "0", "1", "2", "3", "4", "5"],
        r: [
          ["char", "a", "a", "b", "x", "a", "a"],
          ["**Z[i]**", "–", "**1**", "0", "0", "**8**", "1"]
        ],
        n: "`Z[4] = 8` says the substring starting at position 4 matches the " +
          "first 8 characters of the string. The algorithm is linear because " +
          "of the **Z-box**: it maintains the interval `[l, r]` of the " +
          "rightmost match found so far, and for a new position inside that " +
          "interval it can **copy** the already-known Z value from the " +
          "corresponding prefix position rather than re-comparing. `r` only " +
          "ever moves forward, so total comparisons are `O(n)`. The practical " +
          "case for it over KMP is simply that **it is easier to derive " +
          "correctly under pressure** — one array, one clearly stated meaning, " +
          "and the same linear guarantee."
      },

      miss: [
        {
          w: "The Z-algorithm is a different algorithm from KMP.",
          r: "They are closely related and the arrays are **interconvertible** " +
            "in linear time. Both exploit the same insight — reuse previous " +
            "match information — with different bookkeeping. Choose on " +
            "clarity, not capability."
        },
        {
          w: "You need a separator when concatenating pattern and text.",
          r: "You **do**, and it must be a character appearing in neither. " +
            "Without it, a Z value can run past the boundary and match text as " +
            "though it were still pattern, producing false positives. This is " +
            "the most common bug in Z-based matching."
        },
        {
          w: "Z[0] should be the length of the string.",
          r: "It is conventionally left as **0 or undefined**, because the " +
            "whole string trivially matches its own prefix and including it " +
            "breaks the matching test. Implementations differ, which is worth " +
            "checking before copying one."
        },
        {
          w: "It only works for exact matching.",
          r: "The Z-array is a general tool. It finds the **shortest period** " +
            "of a string, all borders, and solves several string-periodicity " +
            "problems directly — the same breadth as KMP's failure function."
        }
      ],

      trade: {
        buys: [
          "Linear time with a guarantee, like KMP.",
          "A single array with one clearly-stated meaning.",
          "Easier to derive and verify than the failure function.",
          "Solves periodicity and border problems too."
        ],
        costs: [
          "Requires `O(n + m)` extra space for the concatenation.",
          "The separator requirement is a real correctness trap.",
          "Usually slower in practice than Boyer-Moore on ordinary text.",
          "Less widely recognised than KMP in interviews."
        ],
        avoid: [
          "The standard library's search is available — use it.",
          "You are searching many patterns — **Aho-Corasick**.",
          "Memory is tight and the concatenation is unaffordable.",
          "You need approximate matching."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "longest-increasing-subsequence",

      why: {
        before: "The obvious dynamic programme is `O(n²)`: for each element, " +
          "scan everything before it and take the best increasing predecessor.",
        problem: "That is fine to n≈10,000 and too slow beyond it. And the " +
          "quadratic scan is doing something wasteful — it re-examines every " +
          "earlier element when what actually matters is only the **smallest " +
          "possible tail** for each achievable length.",
        shift: "Track *the smallest tail value of an increasing subsequence of " +
          "each length*. That array is **necessarily sorted**, so a new element " +
          "can be placed by **binary search** in `O(log n)`. The whole problem " +
          "drops to `O(n log n)`, and the array's length is the answer."
      },

      num: {
        t: "Approaches",
        h: ["Method", "Time", "Recovers the actual sequence?"],
        r: [
          ["DP over all pairs", "O(n²)", "**yes, easily**"],
          ["**Patience sorting + binary search**", "**O(n log n)**", "yes, with parent pointers"],
          ["Segment tree over values", "O(n log n)", "yes"]
        ],
        n: "The critical subtlety: **the tails array is not the answer " +
          "sequence**. It has the right *length*, and its contents are usually " +
          "not a valid increasing subsequence of the input at all — it is a " +
          "working structure where each position holds the best-so-far tail for " +
          "that length. Reconstructing the actual subsequence requires storing " +
          "a **parent pointer** per element during the scan and walking back " +
          "from the final element. This trips up nearly everyone who implements " +
          "the fast version first. Note also the variant switch: use " +
          "`lower_bound` for **strictly** increasing and `upper_bound` for " +
          "**non-decreasing** — one character, entirely different answer."
      },

      miss: [
        {
          w: "The tails array is the longest increasing subsequence.",
          r: "Only its **length** is meaningful. The contents are a working " +
            "structure and frequently not a subsequence of the input in the " +
            "right order. Reconstructing the real sequence needs parent " +
            "pointers recorded during the scan."
        },
        {
          w: "LIS is a niche puzzle problem.",
          r: "It underlies **`diff`** algorithms — the longest common " +
            "subsequence between two files reduces to LIS when one side's " +
            "elements are unique — and appears in patience sorting, box " +
            "stacking, and scheduling. It is more general than it looks."
        },
        {
          w: "The `O(n log n)` version works for any variant.",
          r: "It handles longest **increasing** and **non-decreasing** by " +
            "swapping the binary search bound. Variants with weights, or with " +
            "constraints between elements, generally need a **segment tree over " +
            "values** rather than the tails trick."
        },
        {
          w: "You can find the longest decreasing subsequence by reversing the " +
            "array.",
          r: "Reversing gives you the longest *increasing* subsequence read " +
            "backwards, which is not the same as the longest decreasing " +
            "subsequence in the original. **Negating the values** is the " +
            "correct transformation."
        }
      ],

      trade: {
        buys: [
          "`O(n log n)` for a problem that looks inherently quadratic.",
          "Short to implement with a standard binary search.",
          "Underpins diff and several scheduling problems.",
          "The tails structure generalises to related problems."
        ],
        costs: [
          "The fast version does not directly give the sequence.",
          "Parent-pointer reconstruction is extra code and a common omission.",
          "Strict against non-strict is a one-character trap.",
          "Weighted variants need a different technique entirely."
        ],
        avoid: [
          "n is small — `O(n²)` is clearer and fast enough.",
          "You need the subsequence and reconstruction complexity is not " +
            "worth it.",
          "The problem has weights or extra constraints — use a segment tree.",
          "You actually need the longest **common** subsequence of two " +
            "sequences, which is a different problem."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "matrix-chain-multiplication",

      why: {
        before: "Matrix multiplication is **associative** — `(AB)C` equals " +
          "`A(BC)` — so the order was treated as irrelevant.",
        problem: "The *result* is identical and the **cost is not**. " +
          "Multiplying a `10×100` by a `100×5` by a `5×50` costs 7,500 scalar " +
          "multiplications one way and **75,000** the other — a **10×** " +
          "difference from parenthesisation alone. On larger chains the gap " +
          "grows enormously.",
        shift: "Search for the best parenthesisation with dynamic programming. " +
          "`dp[i][j]` is the minimum cost to multiply matrices `i` through " +
          "`j`, computed by trying every **split point** `k` between them. It " +
          "is the canonical **interval DP**: solve short ranges first, build " +
          "up to the whole chain."
      },

      num: {
        t: "Why brute force fails",
        h: ["Matrices", "Parenthesisations (Catalan)", "DP states"],
        r: [
          ["5", "14", "~10"],
          ["10", "4,862", "~45"],
          ["20", "**1.8 billion**", "~190"],
          ["Complexity", "**exponential**", "**O(n³)**"]
        ],
        n: "The number of parenthesisations is the **Catalan number**, which " +
          "grows exponentially — so trying them all is hopeless past a dozen " +
          "matrices. The DP is `O(n³)`: `O(n²)` intervals, each trying `O(n)` " +
          "split points. The template generalises far beyond matrices and is " +
          "why this problem is taught: **any problem where you combine adjacent " +
          "elements and the combination cost depends on what you have " +
          "combined** has this shape — optimal binary search trees, polygon " +
          "triangulation, the burst-balloons problem, and optimal file merging. " +
          "The loop structure is always the same: iterate by interval length, " +
          "then by start position, then by split point."
      },

      miss: [
        {
          w: "This is about making matrix multiplication faster.",
          r: "It is about choosing the **order** of a chain, not about the " +
            "multiplication algorithm. Strassen and its successors reduce the " +
            "cost of a *single* multiplication; this reduces the cost of a " +
            "*sequence*. They are orthogonal and compose."
        },
        {
          w: "A greedy rule — always multiply the cheapest pair first — works.",
          r: "It does not. A locally cheap multiplication can produce a matrix " +
            "shape that makes everything after it expensive. There is no known " +
            "greedy rule that is optimal, which is precisely why DP is needed."
        },
        {
          w: "It is a textbook exercise with no practical use.",
          r: "Deep learning frameworks and linear algebra compilers make " +
            "exactly this decision when optimising computation graphs, and it " +
            "generalises to **join ordering** in database query optimisers — " +
            "the same interval DP over which tables to join first."
        },
        {
          w: "The DP gives you the cost, so you have solved it.",
          r: "You need the **split points** to reconstruct the actual " +
            "parenthesisation. Store the chosen `k` for each interval alongside " +
            "the cost, then recurse over that table. Computing the minimum " +
            "without recording how you achieved it is the standard omission."
        }
      ],

      trade: {
        buys: [
          "Polynomial solution to an exponential search.",
          "Order-of-magnitude cost reductions on real chains.",
          "The interval DP template generalises widely.",
          "Directly applicable to query planning and graph compilers."
        ],
        costs: [
          "`O(n³)` time and `O(n²)` memory.",
          "Needs a second table to reconstruct the answer.",
          "The triple-nested loop with interval lengths is easy to index " +
            "wrongly.",
          "Only helps when the chain is long enough to matter."
        ],
        avoid: [
          "The chain is two or three matrices — try the options directly.",
          "The library already optimises the order, as most do.",
          "All matrices are the same size, where order does not change cost.",
          "The multiplication itself dominates and the ordering saving is " +
            "marginal."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "morris-traversal",

      why: {
        before: "In-order traversal of a binary tree needs to return to a " +
          "node's parent after finishing its left subtree — which requires " +
          "**remembering the way back**. Recursion uses the call stack; the " +
          "iterative version uses an explicit stack. Either way, `O(h)` space.",
        problem: "On a degenerate tree `h` equals `n`, so *auxiliary* space is " +
          "`O(n)` — as large as the tree. In a memory-constrained environment, " +
          "or when the interview asks for `O(1)` space, neither approach works.",
        shift: "Store the way back **in the tree itself**. A binary tree of `n` " +
          "nodes has `n+1` null pointers doing nothing. Temporarily point a " +
          "subtree's rightmost node — its in-order predecessor — at the current " +
          "node, walk down, and when you return via that thread, **restore the " +
          "null**. Constant auxiliary space, and the tree is unchanged at the " +
          "end."
      },

      num: {
        t: "In-order traversal, space and time",
        h: ["Method", "Auxiliary space", "Time", "Mutates tree?"],
        r: [
          ["Recursive", "**O(h)** — call stack", "O(n)", "no"],
          ["Iterative + stack", "**O(h)**", "O(n)", "no"],
          ["**Morris**", "**O(1)**", "O(n)", "**temporarily, yes**"]
        ],
        n: "The time bound deserves a note: it is still `O(n)` despite the " +
          "algorithm walking down to find each predecessor. The amortised " +
          "argument is that **each edge is traversed at most three times** — " +
          "once going down, once finding the predecessor, once following the " +
          "thread back — so total work stays linear. The costs are honest and " +
          "significant: the tree is **temporarily modified**, so it is not " +
          "thread-safe and cannot run on a shared or immutable structure, and " +
          "**abandoning the traversal partway leaves threads in place**, " +
          "permanently corrupting the tree. That last point is why it is rarely " +
          "used in production despite being elegant."
      },

      miss: [
        {
          w: "Morris traversal is faster than recursive traversal.",
          r: "It is **slower** in practice — more pointer chasing and worse " +
            "cache behaviour, with the same `O(n)` bound. It trades time " +
            "constants for space. If you have the stack space, recursion is " +
            "faster and clearer."
        },
        {
          w: "It leaves the tree unchanged.",
          r: "It leaves the tree unchanged **if it runs to completion**. During " +
            "traversal the tree is genuinely modified, so a concurrent reader " +
            "sees corruption, and an early exit — a `break`, an exception, a " +
            "generator that is never exhausted — leaves threads in place " +
            "permanently."
        },
        {
          w: "It works for any traversal order.",
          r: "In-order is natural, pre-order needs a small modification, and " +
            "**post-order is substantially more complex** — requiring reversing " +
            "and restoring a path of right pointers. Most implementations you " +
            "will see are in-order for exactly this reason."
        },
        {
          w: "It is a practical technique worth using.",
          r: "It is primarily an **interview and teaching** answer to *can you " +
            "do this in `O(1)` space?*. In production the mutation, thread " +
            "safety and early-exit hazards almost always outweigh the space " +
            "saving, and stack space is rarely the binding constraint."
        }
      ],

      trade: {
        buys: [
          "`O(1)` auxiliary space — the only traversal that achieves it.",
          "No recursion, so no stack overflow on degenerate trees.",
          "Still linear time.",
          "Demonstrates a genuinely clever use of unused null pointers."
        ],
        costs: [
          "Temporarily mutates the tree — not thread-safe.",
          "Early exit corrupts the structure permanently.",
          "Slower constant factor than the stack-based version.",
          "Harder to read and to verify.",
          "Post-order is significantly more complex."
        ],
        avoid: [
          "Stack space is available, which is nearly always.",
          "The tree is shared, concurrent or immutable.",
          "The traversal might terminate early.",
          "Readability matters — a stack-based iterative traversal is " +
            "obviously correct."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "floyd-warshall",

      why: {
        before: "**Dijkstra** finds shortest paths from **one** source. " +
          "Running it from every vertex gives all pairs at " +
          "`O(V·(V+E) log V)` — reasonable on a sparse graph.",
        problem: "On a **dense** graph where `E ≈ V²` that becomes " +
          "`O(V³ log V)`, and the heap operations carry a substantial " +
          "constant. And Dijkstra cannot handle negative edges at all, so " +
          "graphs with them need Bellman-Ford from every source — `O(V²E)`, " +
          "far worse.",
        shift: "Reframe the question. Instead of *shortest path from s*, ask " +
          "*shortest path from i to j using only vertices from {1..k} as " +
          "intermediates*. Increase `k` one vertex at a time: either the new " +
          "vertex helps or it does not. Three nested loops, `O(V³)`, and " +
          "negative edges are handled naturally."
      },

      num: {
        t: "All-pairs shortest paths",
        h: ["Method", "Complexity", "Negative edges", "Best for"],
        r: [
          ["Dijkstra × V", "O(V·E log V)", "**no**", "sparse graphs"],
          ["**Floyd-Warshall**", "**O(V³)**", "**yes**", "dense, small V"],
          ["Johnson's", "O(V·E + V²log V)", "yes", "sparse with negatives"],
          ["Bellman-Ford × V", "O(V²E)", "yes", "essentially never"]
        ],
        n: "The **loop order is not optional**: `k` must be the outermost " +
          "loop. Putting `i` or `j` outside gives wrong answers, and it is the " +
          "single most common implementation error — the code still runs and " +
          "silently produces incorrect distances. The reason is the DP " +
          "invariant: after iteration `k`, `dist[i][j]` must be correct using " +
          "intermediates from `{1..k}`, which requires all pairs to be updated " +
          "for each `k` before moving on. Two useful side effects: **a negative " +
          "`dist[i][i]` after completion proves a negative cycle**, and " +
          "replacing `min`/`+` with `or`/`and` computes **transitive closure** " +
          "(Warshall's original algorithm) in the same ten lines."
      },

      miss: [
        {
          w: "The loop order does not matter since they all run anyway.",
          r: "It matters absolutely. **`k` must be outermost.** With `i` or `j` " +
            "outside, the DP invariant breaks and you get wrong distances with " +
            "no error. This is the defining bug of the algorithm."
        },
        {
          w: "`O(V³)` means it is always too slow.",
          r: "For **V ≤ 500** it is roughly 125 million simple operations — " +
            "fast, cache-friendly, and it beats V runs of Dijkstra in practice " +
            "because the constant factor is tiny and there is no heap. It also " +
            "vectorises well."
        },
        {
          w: "It cannot detect negative cycles.",
          r: "It can, and cheaply: after completion, **any negative " +
            "`dist[i][i]`** means `i` lies on a negative cycle. No extra pass " +
            "is needed. Distances involving those vertices are meaningless " +
            "afterwards."
        },
        {
          w: "It only computes distances, not the paths themselves.",
          r: "Store a `next[i][j]` matrix recording the first hop on the " +
            "shortest path, updated whenever a distance improves. " +
            "Reconstructing a path is then a simple walk. It costs `O(V²)` " +
            "extra memory."
        }
      ],

      trade: {
        buys: [
          "All-pairs shortest paths in ten lines.",
          "Handles negative edges and detects negative cycles.",
          "Excellent constant factor — simple loops, no heap, cache-friendly.",
          "The same structure computes transitive closure."
        ],
        costs: [
          "`O(V³)` time and `O(V²)` memory — impractical past ~1,000 vertices.",
          "Computes everything, even if you need one pair.",
          "Loop order is a silent correctness trap.",
          "Wasteful on sparse graphs."
        ],
        avoid: [
          "You need paths from one source — **Dijkstra**.",
          "The graph is sparse with many vertices — Dijkstra from each source, " +
            "or **Johnson's** if negatives exist.",
          "V exceeds about 1,000 — `V²` memory alone becomes prohibitive.",
          "You need only one pair's distance."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
