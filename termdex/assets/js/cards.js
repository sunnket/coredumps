/* Two quick-reference cards: the pattern cue card and the AI formula card.

   These exist because there is a specific moment they serve — you are sixty
   seconds into a problem and need to map wording to a pattern, or you are
   mid-answer and need the KV-cache formula. Everything else in the app teaches;
   these two only remind, so they are deliberately dense and scannable rather
   than explanatory.

   Every row links into the dictionary, so the card is an index as well as a
   reminder: recognise the trigger here, then read the full term.

   The pattern card grew past the point where scanning a single flat table was
   fast, so it is now filtered rather than merely long. Each cue carries a
   family tag and a searchable haystack, and TD.wireCards narrows the whole
   page — every table, not only the cue table — from one input. Dense stays
   useful as long as you can cut it down to the ten rows you actually want. */
(function (TD) {
  "use strict";

  /* --- families -------------------------------------------------------
     The tag on each row, and the segmented filter across the top. Ordered
     by how often the family carries an interview round, because the filter
     is scanned under the same pressure as the table. */
  var FAMILIES = [
    { id: "all", label: "All" },
    { id: "array", label: "Arrays" },
    { id: "string", label: "Strings" },
    { id: "tree", label: "Trees" },
    { id: "graph", label: "Graphs" },
    { id: "dp", label: "DP" },
    { id: "search", label: "Search" },
    { id: "struct", label: "Structures" },
    { id: "math", label: "Maths & bits" }
  ];

  /* --- the DSA cue card: trigger wording -> pattern -> complexity --------
     Ordered by family, and within a family roughly by how often the shape
     appears, because the point is fast scanning under pressure.

       see  the wording in the problem that should fire
       use  what to actually reach for, if it differs from the term name
       cx   the sanity check — the complexity you should be able to state
       t    the dictionary term the row links to
       f    family, for the filter
       tell the discriminator: the detail that confirms or kills the guess.
            This is the column that stops the card being a lookup table and
            makes it a decision aid — the trigger wording is ambiguous far
            more often than a cue card usually admits. */
  var CUES = [
    /* ---- arrays and windows ---- */
    { see: "contiguous subarray or substring", use: "Sliding Window", cx: "O(n)", t: "Sliding Window", f: "array",
      tell: "only if the window can shrink — all-positive numbers, or a counted constraint. Negatives break it" },
    { see: "sorted array, and a pair or triplet", use: "Two Pointers", cx: "O(n) after sorting", t: "Two Pointers", f: "array",
      tell: "sorted, or you may sort. If order must be preserved, use a hash map instead" },
    { see: "repeated range-sum queries, no updates", use: "Prefix Sum", cx: "O(1) per query", t: "Prefix Sum", f: "array",
      tell: "build with a leading zero and length n+1, or the first range is a special case" },
    { see: "many range updates, read once at the end", use: "Difference Array", cx: "O(n + u)", t: "Difference Array", f: "array",
      tell: "only when every update lands before any read. Interleave them and you need a Fenwick tree" },
    { see: "subarrays summing to exactly k, with negatives", use: "Prefix sum + hash map", cx: "O(n)", t: "Prefix Sum", f: "array",
      tell: "seed the map with `{0: 1}` — the empty prefix is a real answer" },
    { see: "intervals, meetings, bookings", use: "Sort by start, then merge", cx: "O(n log n)", t: "Merge Intervals", f: "array",
      tell: "sort by start to merge, by end to schedule the most non-overlapping" },
    { see: "“how many at the same time”, max overlap", use: "Sweep Line", cx: "O(n log n)", t: "Sweep Line", f: "array",
      tell: "process ends before starts at equal coordinates, or touching intervals count as overlapping" },
    { see: "maximum of every window of size k", use: "Monotonic deque", cx: "O(n)", t: "Sliding Window Maximum", f: "array",
      tell: "store indices, not values, so you can evict the ones that left the window" },
    { see: "“next greater” or “previous smaller”", use: "Monotonic Stack", cx: "O(n) amortised", t: "Monotonic Stack", f: "array",
      tell: "decreasing stack for next-greater, increasing for next-smaller. Get this backwards once and you always check" },
    { see: "largest rectangle, trapped water, spans", use: "Monotonic Stack", cx: "O(n)", t: "Monotonic Stack", f: "array",
      tell: "sentinel values at both ends flush the stack and remove the tail-handling branch" },
    { see: "numbers in 1..n, find the missing or duplicate", use: "Cyclic Sort or XOR", cx: "O(n), O(1) space", t: "Cyclic Sort", f: "array",
      tell: "the values-are-indices trick. If the range is not 1..n it does not apply" },
    { see: "cycle or midpoint, O(1) space, linked list", use: "Fast and Slow Pointers", cx: "O(n), O(1) space", t: "Fast and Slow Pointers", f: "array",
      tell: "to find the cycle start, reset one pointer to the head and step both by one" },
    { see: "rotate, reverse a section, in place", use: "Reverse three times", cx: "O(n), O(1) space", t: "Array", f: "array",
      tell: "reverse all, then reverse each part. Normalise k with `k %= n` first" },
    { see: "move all zeroes or evens to one end", use: "Two pointers, write index", cx: "O(n), O(1) space", t: "Two Pointers", f: "array",
      tell: "stable partition needs a second pass or a temp array — say which you are giving up" },
    { see: "sample from a stream of unknown length", use: "Reservoir Sampling", cx: "O(k) memory", t: "Reservoir Sampling", f: "array",
      tell: "keep item i with probability k/i. The proof is the follow-up question" },

    /* ---- strings ---- */
    { see: "anagram, permutation of a string", use: "Frequency count", cx: "O(n) with a 26-slot array", t: "Hash Table", f: "string",
      tell: "say the alphabet out loud — 26 letters, ASCII, or full Unicode changes the answer" },
    { see: "substring search, or repeated substrings", use: "Rolling Hash / Rabin-Karp", cx: "O(n+m) average", t: "Rolling Hash", f: "string",
      tell: "average, not worst case — mention collisions and the double-hash fix before being asked" },
    { see: "exact pattern match, worst-case guarantee", use: "KMP", cx: "O(n+m) worst case", t: "KMP", f: "string",
      tell: "reach for it when the interviewer rejects the hashing answer on adversarial input" },
    { see: "longest palindromic substring", use: "Expand around centre", cx: "O(n²), O(1) space", t: "Manacher's Algorithm", f: "string",
      tell: "2n−1 centres, because even-length palindromes sit between characters" },
    { see: "all palindromes, or O(n) is demanded", use: "Manacher's Algorithm", cx: "O(n)", t: "Manacher's Algorithm", f: "string",
      tell: "rarely required. Offer expand-around-centre first and name this as the upgrade" },
    { see: "all occurrences, prefix equals suffix", use: "Z-Algorithm", cx: "O(n+m)", t: "Z-Algorithm", f: "string",
      tell: "concatenate `pattern + sep + text` with a separator outside both alphabets" },
    { see: "prefix, autocomplete, dictionary of words", use: "Trie", cx: "O(L) per operation", t: "Trie", f: "string",
      tell: "cost is O(L) in the word length and independent of how many words are stored" },
    { see: "search a grid for many words at once", use: "Trie + DFS backtracking", cx: "O(cells · 4^L)", t: "Trie", f: "string",
      tell: "prune dead prefixes at the trie node — without that it times out" },
    { see: "edit distance, spell correction", use: "Edit Distance DP", cx: "O(n·m)", t: "Edit Distance", f: "string",
      tell: "define the three operations before writing the table, or the transitions come out wrong" },
    { see: "longest common substring vs subsequence", use: "Grid DP", cx: "O(n·m)", t: "Longest Common Subsequence", f: "string",
      tell: "substring must be contiguous and resets to 0 on mismatch; subsequence carries the max forward" },

    /* ---- trees ---- */
    { see: "level order, depth, “by layer”", use: "BFS with a level loop", cx: "O(n)", t: "Breadth-First Search", f: "tree",
      tell: "capture `len(queue)` before the inner loop, or levels bleed into each other" },
    { see: "path sums, subtree properties", use: "DFS returning a value up", cx: "O(n)", t: "Depth-First Search", f: "tree",
      tell: "separate what you return to the parent from what you record globally — the classic max-path-sum trap" },
    { see: "validate a BST, k-th smallest", use: "In-order traversal", cx: "O(n), O(h) space", t: "Binary Search Tree", f: "tree",
      tell: "in-order on a BST is sorted; bound-checking beats comparing with the parent only" },
    { see: "lowest common ancestor, one query", use: "Recursive DFS", cx: "O(n)", t: "Binary Tree", f: "tree",
      tell: "on a BST it is O(h): walk down while both targets sit on the same side" },
    { see: "many ancestor or LCA queries", use: "Binary Lifting", cx: "O(n log n) build, O(log n) query", t: "Binary Lifting", f: "tree",
      tell: "the jump table is 2^k ancestors. Worth it above roughly a thousand queries" },
    { see: "traverse with O(1) space", use: "Morris Traversal", cx: "O(n), O(1) space", t: "Morris Traversal", f: "tree",
      tell: "threads the tree and unthreads it. Only offer it once the O(h) answer is on the table" },
    { see: "best path anywhere in a tree", use: "DP on Trees", cx: "O(n)", t: "DP on Trees", f: "tree",
      tell: "each node returns the best downward path; the answer combines two children at the node" },
    { see: "serialise or rebuild a tree", use: "Pre-order with null markers", cx: "O(n)", t: "Binary Tree", f: "tree",
      tell: "pre-order plus explicit nulls is unambiguous; in-order alone is not" },
    { see: "guaranteed O(log n) with insertions", use: "Balanced tree — AVL or Red-Black", cx: "O(log n)", t: "Balanced Binary Tree", f: "tree",
      tell: "an unbalanced BST degrades to a linked list on sorted input. Name that before being told" },

    /* ---- graphs ---- */
    { see: "2D grid, islands, flood fill", use: "DFS or BFS on the grid", cx: "O(m×n)", t: "Graph Traversal", f: "graph",
      tell: "mark visited when you enqueue, not when you dequeue, or the same cell is queued many times" },
    { see: "shortest path, unweighted edges", use: "BFS", cx: "O(V+E)", t: "Breadth-First Search", f: "graph",
      tell: "BFS is shortest only when every edge costs the same. Weighted edges need Dijkstra" },
    { see: "spreads from several sources at once", use: "Multi-Source BFS", cx: "O(V+E)", t: "Multi-Source BFS", f: "graph",
      tell: "push every source before the loop starts. It is one BFS, not one per source" },
    { see: "edge weights are only 0 or 1", use: "0-1 BFS with a deque", cx: "O(V+E)", t: "0-1 BFS", f: "graph",
      tell: "`appendleft` for a zero edge, `append` for a one. A heap here is a log factor wasted" },
    { see: "shortest path, positive weights", use: "Dijkstra", cx: "O(E log V)", t: "Dijkstra's Algorithm", f: "graph",
      tell: "skip a popped node whose distance is stale — the lazy-deletion line people forget" },
    { see: "any negative edge weight", use: "Bellman-Ford", cx: "O(V·E)", t: "Bellman-Ford", f: "graph",
      tell: "Dijkstra is simply wrong here, not slow. A V-th relaxation that still improves means a negative cycle" },
    { see: "all pairs, and V is small", use: "Floyd-Warshall", cx: "O(V³)", t: "Floyd-Warshall", f: "graph",
      tell: "k must be the outermost loop. V ≤ ~400 keeps it inside the budget" },
    { see: "prerequisites, dependencies, build order", use: "Topological Sort", cx: "O(V+E), detects cycles", t: "Topological Sort", f: "graph",
      tell: "Kahn's queue empties early exactly when a cycle exists — that is your cycle detector too" },
    { see: "groups, components, “are these connected”", use: "Union-Find", cx: "~O(α(n))", t: "Union-Find", f: "graph",
      tell: "you need both path compression and union by rank. One without the other is O(log n)" },
    { see: "connect all nodes at minimum cost", use: "MST — Kruskal or Prim", cx: "O(E log E)", t: "Minimum Spanning Tree", f: "graph",
      tell: "Kruskal for sparse graphs with edges listed, Prim for dense ones with an adjacency matrix" },
    { see: "mutually reachable groups in a digraph", use: "Tarjan or Kosaraju", cx: "O(V+E)", t: "Strongly Connected Component", f: "graph",
      tell: "condensing each component gives a DAG, which is usually the real point of the question" },
    { see: "a bridge or an articulation point", use: "Tarjan's Algorithm", cx: "O(V+E)", t: "Tarjan's Algorithm", f: "graph",
      tell: "low-link values. The single-pass DFS is what makes it worth learning" },
    { see: "graph is a DAG and you want longest path", use: "Topological order + DP", cx: "O(V+E)", t: "Directed Acyclic Graph", f: "graph",
      tell: "longest path is NP-hard in general but linear on a DAG. Say why" },
    { see: "clone, deep copy, cycles in the input", use: "DFS with a visited map", cx: "O(V+E)", t: "Graph", f: "graph",
      tell: "the map is old-node → new-node, and it is what stops the cycle looping forever" },

    /* ---- dynamic programming ---- */
    { see: "“count the ways”, “min or max cost”", use: "Dynamic Programming", cx: "define the state first", t: "Dynamic Programming", f: "dp",
      tell: "if a greedy choice can be broken by a counterexample, it is DP. Try to break it out loud" },
    { see: "recursion recomputes the same arguments", use: "Memoisation", cx: "states × transitions", t: "Memoisation", f: "dp",
      tell: "memoise first, convert to a table only if recursion depth is the actual problem" },
    { see: "pick or skip, with a capacity", use: "Knapsack", cx: "O(n·W)", t: "Knapsack", f: "dp",
      tell: "0/1 iterates the capacity downwards, unbounded upwards. That single direction is the whole difference" },
    { see: "partition into two equal halves", use: "Subset-sum knapsack", cx: "O(n·sum/2)", t: "Knapsack", f: "dp",
      tell: "an odd total is instantly false. Say that before writing any code" },
    { see: "longest increasing subsequence", use: "Patience sorting + binary search", cx: "O(n log n)", t: "Longest Increasing Subsequence", f: "dp",
      tell: "the tails array is not the subsequence. Reconstructing needs parent pointers" },
    { see: "two sequences compared", use: "Grid DP", cx: "O(n·m)", t: "Longest Common Subsequence", f: "dp",
      tell: "almost every two-string DP is this table with different transitions" },
    { see: "burst, merge, or split a range", use: "Interval DP", cx: "O(n³)", t: "Interval DP", f: "dp",
      tell: "loop by interval length, not by index. The last operation is the split point" },
    { see: "chain of matrices, optimal grouping", use: "Matrix Chain Multiplication", cx: "O(n³)", t: "Matrix Chain Multiplication", f: "dp",
      tell: "the canonical interval DP. If you can write this one you can write the family" },
    { see: "paths on a grid with obstacles", use: "Grid DP", cx: "O(m·n)", t: "Grid DP", f: "dp",
      tell: "collapsible to one row of memory. Offer the O(n) space version as the improvement" },
    { see: "buy and sell, cooldowns, at most k", use: "State Machine DP", cx: "O(n·k)", t: "State Machine DP", f: "dp",
      tell: "draw the states and the legal transitions first. The code then writes itself" },
    { see: "n ≤ 20 in the constraints", use: "Bitmask DP", cx: "O(2ⁿ · n)", t: "Bitmask DP", f: "dp",
      tell: "the bound is the hint. n ≤ 20 almost never means anything else" },
    { see: "count numbers in a range with a property", use: "Digit DP", cx: "O(digits · states)", t: "Digit DP", f: "dp",
      tell: "carry a tight flag for the prefix that still hugs the bound" },
    { see: "best answer over a subtree", use: "DP on Trees", cx: "O(n)", t: "DP on Trees", f: "dp",
      tell: "post-order: children are finished before the parent decides" },

    /* ---- searching and ordering ---- */
    { see: "“minimum maximum”, “smallest X such that”", use: "Binary Search on the Answer", cx: "O(n log range)", t: "Binary Search on the Answer", f: "search",
      tell: "you need a monotone feasibility check. State the predicate before writing the loop" },
    { see: "n up to 10⁹ with a tiny array", use: "Binary search or maths", cx: "O(log n)", t: "Binary Search", f: "search",
      tell: "at 10⁹ even one pass is too slow, so the answer is logarithmic or closed-form" },
    { see: "rotated sorted array, find or pivot", use: "Modified Binary Search", cx: "O(log n)", t: "Binary Search", f: "search",
      tell: "one half is always sorted. Decide which, then test whether the target is inside it" },
    { see: "first or last occurrence, insert position", use: "Boundary binary search", cx: "O(log n)", t: "Binary Search", f: "search",
      tell: "settle on one convention — `lo < hi` with `hi = mid` — and use it every time" },
    { see: "“k largest”, “k most frequent”, “k closest”", use: "Heap of size k", cx: "O(n log k)", t: "Top-K Pattern", f: "search",
      tell: "a min-heap for the k largest. Getting this inverted is the most common slip on the card" },
    { see: "k-th element, “beat the heap”", use: "Quickselect", cx: "O(n) average", t: "Quickselect", f: "search",
      tell: "average only — worst case is O(n²) unless you randomise the pivot. Say so" },
    { see: "median of a stream", use: "Two Heaps", cx: "O(log n) insert", t: "Two Heaps", f: "search",
      tell: "a max-heap for the low half, a min-heap for the high half, sizes differing by at most one" },
    { see: "merge k sorted lists or streams", use: "Heap of k heads", cx: "O(n log k)", t: "Priority Queue", f: "search",
      tell: "push the source index with the value, or you cannot advance the right list" },
    { see: "values are small integers in a fixed range", use: "Counting Sort", cx: "O(n + k)", t: "Counting Sort", f: "search",
      tell: "linear, and it beats the comparison lower bound because it never compares" },
    { see: "stability matters when sorting", use: "Timsort or merge sort", cx: "O(n log n)", t: "Sorting Stability", f: "search",
      tell: "Python's sort is stable, quicksort is not. It matters whenever you sort twice by different keys" },
    { see: "all permutations, combinations or subsets", use: "Backtracking", cx: "O(2ⁿ) or O(n!)", t: "Backtracking", f: "search",
      tell: "prune early and skip duplicates on the sorted input — that is the whole difference in the follow-up" },
    { see: "the search space halves each recursion", use: "Divide and Conquer", cx: "T(n) = 2T(n/2) + f(n)", t: "Divide and Conquer", f: "search",
      tell: "state the recurrence out loud; it is how you show the complexity rather than assert it" },

    /* ---- structures ---- */
    { see: "“most recently used”", use: "Hash map + doubly linked list", cx: "O(1) get and put", t: "LRU Cache", f: "struct",
      tell: "dummy head and tail nodes remove every null check from the unlink code" },
    { see: "evict by frequency, not recency", use: "LFU Cache", cx: "O(1) with buckets", t: "LFU Cache", f: "struct",
      tell: "frequency buckets of linked lists, plus a min-frequency pointer. Strictly harder than LRU" },
    { see: "range query with point updates", use: "Fenwick Tree", cx: "O(log n) both", t: "Fenwick Tree", f: "struct",
      tell: "prefix sums only, but far shorter to write than a segment tree" },
    { see: "range query with range updates", use: "Segment Tree with lazy", cx: "O(log n)", t: "Segment Tree", f: "struct",
      tell: "lazy propagation is what makes range updates work. Without it you are back to O(n)" },
    { see: "immutable array, min or max over a range", use: "Sparse Table", cx: "O(1) query", t: "Sparse Table", f: "struct",
      tell: "no updates allowed, and only for idempotent operations. Min works, sum does not" },
    { see: "queries offline, an O(n log n) is unclear", use: "Sqrt Decomposition", cx: "O(√n) per query", t: "Sqrt Decomposition", f: "struct",
      tell: "the pragmatic fallback. Easier to write correctly under time pressure than a segment tree" },
    { see: "push, pop and get-min all in O(1)", use: "Stack of pairs", cx: "O(1)", t: "Stack", f: "struct",
      tell: "store the running minimum alongside each value. No auxiliary structure needed" },
    { see: "a queue built from two stacks", use: "In-stack and out-stack", cx: "O(1) amortised", t: "Amortised Analysis", f: "struct",
      tell: "amortised, because each element moves between stacks at most once" },
    { see: "distribute keys across changing servers", use: "Consistent Hashing", cx: "O(log n) lookup", t: "Consistent Hashing", f: "struct",
      tell: "the systems-design crossover. Virtual nodes are what fix the uneven distribution" },

    /* ---- maths and bits ---- */
    { see: "“appears once”, XOR, subsets via a mask", use: "Bit Manipulation", cx: "O(n) or O(1)", t: "Bit Manipulation", f: "math",
      tell: "XOR cancels pairs and is its own inverse. That single fact carries most of these problems" },
    { see: "count set bits, iterate submasks", use: "Bit tricks", cx: "O(popcount)", t: "Bit Manipulation", f: "math",
      tell: "`n & (n-1)` clears the lowest set bit and loops once per set bit rather than per bit" },
    { see: "large products, sums near the limit", use: "Watch for overflow", cx: "—", t: "Integer Overflow", f: "math",
      tell: "Python integers are unbounded, Java and C++ ints are not. Say which language you are assuming" },
    { see: "compare or accumulate decimals", use: "Avoid float equality", cx: "—", t: "Floating Point", f: "math",
      tell: "compare within an epsilon, or scale to integers. Money should never be a float" },
    { see: "the problem looks exponential and stays that way", use: "Argue NP-hardness", cx: "—", t: "NP-Complete", f: "math",
      tell: "recognising it is the answer. Then give the best heuristic or exact-for-small-n solution" }
  ];

  /* --- the second question, once the pattern is chosen -----------------
     Choosing the pattern is half the work; the half people lose points on is
     designing the state. Each row is a problem shape mapped to the state that
     makes it tractable, because "what is dp[i]?" is the question that stalls
     an otherwise-correct candidate. */
  var STATES = [
    ["One sequence, decide at each index", "dp[i] = best answer ending at i", "House robber, LIS, max subarray", "Longest Increasing Subsequence"],
    ["One sequence, a budget to spend", "dp[i][c] = best using first i within c", "0/1 knapsack, coin change", "Knapsack"],
    ["Two sequences compared", "dp[i][j] = answer for prefixes i and j", "LCS, edit distance, wildcard match", "Longest Common Subsequence"],
    ["A range that collapses", "dp[i][j] = best over the interval i..j", "Burst balloons, matrix chain", "Interval DP"],
    ["A grid walked once", "dp[r][c] = best route reaching (r, c)", "Unique paths, minimum path sum", "Grid DP"],
    ["Modes with legal transitions", "dp[i][state] = best at i in that mode", "Stock trading with cooldown", "State Machine DP"],
    ["A set that is small", "dp[mask] = best over the visited subset", "TSP, assignment, n ≤ 20", "Bitmask DP"],
    ["A tree with a choice per node", "dp[node][taken] from children upward", "Tree robber, tree diameter", "DP on Trees"],
    ["Digits of a number under a bound", "dp[pos][tight][carry]", "Count numbers with a property", "Digit DP"]
  ];

  /* --- the pairs people actually confuse ------------------------------
     A cue card that only maps wording to a pattern is a lookup table. What
     turns it into judgement is knowing which two candidates are in play and
     what single question separates them. */
  var CONFUSIONS = [
    ["Sliding Window", "Prefix Sum", "Can values be negative? Negatives break the shrink step, so the window fails and prefix sums do not.", "Sliding Window"],
    ["Breadth-First Search", "Dijkstra's Algorithm", "Are all edge weights equal? If yes BFS is already optimal and the heap is wasted work.", "Breadth-First Search"],
    ["Dijkstra's Algorithm", "Bellman-Ford", "Is any edge negative? Dijkstra is not slow there, it is wrong.", "Bellman-Ford"],
    ["Greedy Algorithm", "Dynamic Programming", "Can you break the greedy choice with a counterexample? If you can, it is DP.", "Greedy Algorithm"],
    ["Backtracking", "Dynamic Programming", "Do branches share subproblems? Sharing means memoise; genuinely distinct means enumerate.", "Backtracking"],
    ["Quickselect", "Top-K Pattern", "Do you need the k items or only the k-th? A heap streams, quickselect needs the whole array in memory.", "Quickselect"],
    ["Segment Tree", "Fenwick Tree", "Is it prefix sums only? Then Fenwick — a third of the code for the same complexity.", "Fenwick Tree"],
    ["Sparse Table", "Segment Tree", "Does the array change? Any update at all rules out a sparse table.", "Sparse Table"],
    ["Union-Find", "Depth-First Search", "Do edges arrive over time? Incremental connectivity is union-find; a fixed graph is a traversal.", "Union-Find"],
    ["Topological Sort", "Depth-First Search", "Do you need an order, or just reachability? Order means indegrees and a queue.", "Topological Sort"],
    ["Memoisation", "Tabulation", "Is recursion depth a risk? Deep recursion in Python means write the table.", "Tabulation"],
    ["Hash Table", "Binary Search Tree", "Do you need sorted order or a range scan? A hash map cannot give you either.", "Binary Search Tree"],
    ["Two Pointers", "Sliding Window", "Is the window a contiguous run, or two ends closing in? Different invariant, similar code.", "Two Pointers"],
    ["Merge Intervals", "Sweep Line", "Do you want the merged intervals, or the count at a point? The output decides.", "Sweep Line"]
  ];

  /* --- operation cost of the structures ---------------------------------
     "Which structure?" is answered by the operation you do most, not by the
     one the problem names first. */
  var OPS = [
    ["Array", "O(1)", "O(n)", "O(n)", "random access by index"],
    ["Linked List", "O(n)", "O(1) at a known node", "O(1) at a known node", "splicing without moving data"],
    ["Hash Table", "O(1) average", "O(1) average", "O(1) average", "membership and counting"],
    ["Balanced Binary Tree", "O(log n)", "O(log n)", "O(log n)", "sorted order and range scans"],
    ["Heap", "O(1) for the top only", "O(log n)", "O(log n)", "repeatedly taking the extreme"],
    ["Trie", "O(L)", "O(L)", "O(L)", "prefixes over a word list"],
    ["Union-Find", "~O(α(n))", "~O(α(n)) union", "not supported", "connectivity as edges arrive"],
    ["Fenwick Tree", "O(log n) prefix", "O(log n) point", "not supported", "running sums with updates"],
    ["Segment Tree", "O(log n) range", "O(log n)", "not supported", "any associative range query"],
    ["Deque", "O(1) at both ends", "O(1) at both ends", "O(1) at both ends", "windows and BFS queues"]
  ];

  /* The constraint-to-complexity mapping. Assumes ~10^8 simple operations
     per second, which is the safe working figure. */
  var CONSTRAINTS = [
    ["n ≤ 12", "O(n!)", "permutations, brute-force TSP"],
    ["n ≤ 20", "O(2ⁿ · n)", "bitmask DP over subsets"],
    ["n ≤ 25", "O(2ⁿ)", "subsets, meet in the middle at 40"],
    ["n ≤ 100", "O(n³)", "Floyd-Warshall, interval DP"],
    ["n ≤ 500", "O(n³) if the constant is small", "matrix chain, small all-pairs"],
    ["n ≤ 1,000", "O(n²)", "two-dimensional DP, all pairs"],
    ["n ≤ 10⁵", "O(n log n)", "sort, heap, binary search — the common band"],
    ["n ≤ 10⁶", "O(n)", "one pass, two pointers, counting"],
    ["n ≤ 10⁸", "O(n) with a tiny constant", "counting only; avoid allocation per element"],
    ["n ≤ 10⁹", "O(log n) or maths", "binary search on the answer, closed form"]
  ];

  /* --- the edge cases that actually fail, by family ---------------------
     Testing your own code is a scored part of the round, and a generic
     "empty input?" earns less than the case that genuinely breaks the shape
     you just wrote. */
  var EDGES = [
    ["Arrays and windows", "empty array; a single element; all identical; all negative; k larger than n"],
    ["Strings", "empty string; one character; case sensitivity; non-ASCII; the whole string is the answer"],
    ["Linked lists", "empty list; one node; two nodes; the head is removed; a cycle back to the head"],
    ["Trees", "empty tree; one node; a single left spine; duplicate values; the LCA is one of the targets"],
    ["Graphs", "no edges; one node; disconnected components; a self-loop; parallel edges; a cycle"],
    ["Binary search", "target below the range; above it; absent; duplicates; a two-element array"],
    ["Dynamic programming", "n = 0; n = 1; the base row and column; unreachable states; overflow in the sum"],
    ["Intervals", "one interval; touching ends like [1,2] and [2,3]; nested; identical; already sorted"],
    ["Heaps and top-k", "k = 0; k = 1; k equals n; k greater than n; ties at the boundary"]
  ];

  /* --- the ladder to climb when nothing fires ---------------------------
     The card's answer to the worst moment in the round: you have read the
     problem, nothing matched, and the clock is running. */
  var LADDER = [
    ["What is the brute force, and what does it cost?", "It is your fallback and it buys goodwill. Never start from nothing."],
    ["What in that brute force is repeated?", "Repeated work is the whole of memoisation, prefix sums and caching."],
    ["What does the constraint on n permit?", "The bound names the intended complexity. Work backwards from it."],
    ["Is the input sorted, or may I sort it?", "Sorting unlocks two pointers, binary search and greedy for O(n log n)."],
    ["Would seeing an element again help?", "That is a hash map — the cheapest upgrade from O(n²) to O(n)."],
    ["Do I only ever need the largest or smallest?", "That is a heap, and it is O(n log k) instead of a full sort."],
    ["Is there an ordering forced on the work?", "Prerequisites mean a topological sort; a grid or graph means a traversal."],
    ["Can I check an answer faster than I can find it?", "Then binary search the answer space instead of searching the input."],
    ["Is the state small enough to enumerate?", "n ≤ 20 means a bitmask. Small state plus reuse means DP."],
    ["Can I state the invariant of my loop?", "If you cannot say what stays true, the code will not be right by accident."]
  ];

  /* --- the AI formula card ---------------------------------------------- */
  var FORMULAS = [
    { n: "Attention", f: "softmax(QKᵀ / √dₖ) · V", w: "√d stops softmax saturating", t: "Scaled Dot-Product Attention" },
    { n: "Cosine similarity", f: "(a·b) / (‖a‖ ‖b‖)", w: "−1 to 1; equals the dot product on unit vectors", t: "Cosine Similarity" },
    { n: "Softmax with temperature", f: "e^(zᵢ/T) / Σ e^(zⱼ/T)", w: "T→0 deterministic, T>1 flattens", t: "Temperature" },
    { n: "Cross-entropy", f: "−Σ yᵢ log(pᵢ)", w: "punishes confident wrong answers hardest", t: "Cross-Entropy" },
    { n: "Perplexity", f: "exp(cross-entropy)", w: "10 ≈ as unsure as picking among 10 options", t: "Perplexity" },
    { n: "Model weights VRAM", f: "~2 GB per billion params at FP16", w: "~1 at INT8, ~0.5 at INT4", t: "VRAM" },
    { n: "KV cache", f: "2 × layers × kv_heads × head_dim × bytes × seq_len × batch", w: "the 2 is K and V; every optimisation attacks one term", t: "KV Cache" },
    { n: "Full fine-tune memory", f: "~8× params in GB (BF16)", w: "weights + grads + two Adam states + activations", t: "QLoRA" },
    { n: "Token rule of thumb", f: "1 token ≈ 4 characters ≈ 0.75 English words", w: "code and non-English tokenise worse", t: "Tokenisation" },
    { n: "Reciprocal rank fusion", f: "score(d) = Σ 1/(k + rankᵢ(d)),  k ≈ 60", w: "no score calibration needed between systems", t: "Reciprocal Rank Fusion" },
    { n: "Retrieve then rerank", f: "top ~50 → cross-encoder → top ~5", w: "usually the biggest single RAG quality jump", t: "Cross-Encoder" },
    { n: "F1", f: "2PR / (P + R)", w: "harmonic mean, so it punishes lopsided models", t: "F1 Score" },
    { n: "Precision", f: "TP / (TP + FP)", w: "optimise when false positives are expensive", t: "Precision" },
    { n: "Recall", f: "TP / (TP + FN)", w: "optimise when false negatives are expensive", t: "Recall" }
  ];

  /* VRAM worked examples — the arithmetic people are asked to do out loud. */
  var VRAM = [
    ["8B, BF16, one user", "8 × 2 = 16 GB + cache + 20%", "~20 GB"],
    ["8B, INT4, a laptop", "8 × 0.5 = 4 GB + overhead", "~6 GB"],
    ["8B serving 50 users @ 4k", "16 GB weights + ~25 GB KV cache", "~41 GB — use an 80 GB card"],
    ["70B, FP16", "70 × 2 = 140 GB + cache", "2 × 80 GB GPUs"],
    ["70B, INT4", "70 × 0.5 = 35 GB + cache", "one 48–80 GB GPU"],
    ["7B full fine-tune, BF16", "7 × 8 = 56 GB + activations", "~80 GB"],
    ["7B QLoRA", "4-bit base 3.5 GB + adapters", "~12–16 GB"]
  ];

  /* A term chip that only renders if the term actually exists, so the card
     degrades gracefully rather than producing dead links. */
  function chip(name) {
    var t = TD.resolve(name);
    if (!t) return TD.esc(name);
    return '<a class="cue-link" href="#/t/' + t.slug + '">' + TD.esc(name) + "</a>";
  }

  /* Every filterable row carries its own searchable text and family, so the
     filter never has to read the rendered DOM back out. */
  function rowAttrs(family, haystack) {
    return ' data-f="' + TD.esc(family) + '" data-q="' +
      TD.esc(String(haystack).toLowerCase()) + '"';
  }

  function cueRows(rows) {
    return rows.map(function (c) {
      var hay = c.see + " " + c.use + " " + c.t + " " + c.cx + " " + (c.tell || "");
      return "<tr" + rowAttrs(c.f, hay) + "><td>" + TD.rich(c.see) + "</td>" +
        "<td><b>" + chip(c.t) + "</b>" +
        (c.use !== c.t ? '<span class="cue-alt">' + TD.esc(c.use) + "</span>" : "") + "</td>" +
        '<td class="cue-cx">' + TD.esc(c.cx) + "</td>" +
        '<td class="cue-tell">' + (c.tell ? TD.rich(c.tell) : "") + "</td></tr>";
    }).join("");
  }

  /* The filter bar. It is rendered as part of the view string like everything
     else, and wired by TD.wireCards after the render. */
  function filterBar(total) {
    return '<div class="cue-tools">' +
      '<input class="filter-input cue-filter" id="cueFilter" type="text" ' +
      'placeholder="Filter every table — “negative”, “heap”, “O(log n)”…" ' +
      'aria-label="Filter the cue card" autocomplete="off">' +
      '<div class="seg cue-seg" id="cueSeg" role="group" aria-label="Filter by family">' +
      FAMILIES.map(function (f, i) {
        return '<button type="button" data-f="' + f.id + '"' +
          (i === 0 ? ' class="is-on"' : "") + ">" + TD.esc(f.label) + "</button>";
      }).join("") +
      "</div>" +
      '<span class="result-count cue-count" id="cueCount">' + total + " cues</span>" +
      "</div>";
  }

  function section(icon, title, note, body) {
    return '<section class="card-sec"><h2 class="art-h2"><span class="h2-ico">' + TD.icon(icon) +
      "</span>" + title + "</h2>" +
      (note ? '<p class="card-note">' + note + "</p>" : "") + body + "</section>";
  }

  function table(head, body, cls) {
    return '<div class="cue-wrap"><table class="cue-table' + (cls ? " " + cls : "") + '">' +
      "<thead><tr>" + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }

  TD.viewCueCard = function () {
    var h = '<div class="card-page card-page-wide">';

    h += '<header class="card-head">' +
      '<p class="card-kicker">Quick reference</p>' +
      "<h1>The pattern cue card</h1>" +
      '<p class="card-deck">Read the problem, find the wording, take the pattern. The whole game is doing ' +
      "this in sixty seconds — which leaves you twenty-five minutes to write careful code. " +
      "Every pattern links to its full entry, and the <b>tell</b> column is the detail that " +
      "confirms the guess or kills it, because the trigger wording is ambiguous more often " +
      "than a cue card usually admits.</p>" +
      '<div class="card-actions">' +
      '<a class="btn btn-ghost btn-sm" href="#/cards/formulas">' + TD.icon("bulb") + "AI formula card</a>" +
      '<button class="btn btn-ghost btn-sm" data-act="print">' + TD.icon("book") + "Print</button>" +
      "</div></header>";

    h += filterBar(CUES.length);

    /* 1. the main cue table */
    h += section("path", "When you see… reach for…",
      "The first column is what the problem says, the last is what tells you whether you " +
      "guessed right. Filter by family, or type a word — the filter narrows every table on " +
      "this page at once.",
      table(["When the problem says", "Reach for", "Sanity check", "The tell"],
        cueRows(CUES), "cue-main"));

    /* 2. the ladder, for when nothing fires */
    h += section("compass", "Nothing fired — the ladder",
      "The worst moment in the round is reading a problem and recognising nothing. " +
      "Work down these in order and out loud. Each one is a question the interviewer " +
      "would eventually ask you anyway, so asking it yourself reads as method rather " +
      "than as being stuck.",
      '<ol class="card-steps cue-ladder">' + LADDER.map(function (r) {
        return "<li" + rowAttrs("all", r[0] + " " + r[1]) + "><b>" + TD.rich(r[0]) +
          '</b><span class="ladder-why">' + TD.rich(r[1]) + "</span></li>";
      }).join("") + "</ol>");

    /* 3. state design — the step after choosing the pattern */
    h += section("layers", "The state, once you have said “DP”",
      "Naming the pattern is half the answer. The half that loses points is the state, " +
      "because an interviewer who hears <b>“dp[i] is the best answer ending at i”</b> stops " +
      "worrying about you. Every row here is a problem shape, not a problem.",
      table(["The shape", "The state", "Which problems", "Read more"],
        STATES.map(function (r) {
          return "<tr" + rowAttrs("dp", r.join(" ")) + "><td>" + TD.rich(r[0]) + "</td>" +
            '<td><code class="formula">' + TD.esc(r[1]) + "</code></td>" +
            '<td class="cue-cx">' + TD.rich(r[2]) + "</td>" +
            "<td><b>" + chip(r[3]) + "</b></td></tr>";
        }).join("")));

    /* 4. the confusions — the part that is judgement rather than lookup */
    h += section("trap", "Two candidates — the question that separates them",
      "Most wrong answers are not ignorance, they are picking the near-neighbour. " +
      "For each pair there is one question that decides it, and asking it out loud is " +
      "worth more than arriving at the right pattern silently.",
      table(["This", "or this", "Ask yourself"],
        CONFUSIONS.map(function (r) {
          return "<tr" + rowAttrs("all", r.join(" ")) + "><td><b>" + chip(r[0]) + "</b></td>" +
            "<td><b>" + chip(r[1]) + "</b></td>" +
            "<td>" + TD.rich(r[2]) + "</td></tr>";
        }).join(""), "cue-confuse"));

    /* 5. constraints */
    h += section("gauge", "The constraint tells you the answer",
      "The bound on n is a hint about the intended complexity, not decoration. " +
      "Assume roughly 10⁸ simple operations per second. Reading this before you start saves " +
      "five minutes per problem, and reading it <b>aloud</b> shows the interviewer you did.",
      table(["Constraint", "Intended", "Which usually means"],
        CONSTRAINTS.map(function (r) {
          return "<tr" + rowAttrs("all", r.join(" ")) + "><td><code>" + TD.esc(r[0]) +
            "</code></td><td><b>" + TD.esc(r[1]) + '</b></td><td class="cue-cx">' +
            TD.esc(r[2]) + "</td></tr>";
        }).join("")));

    /* 6. operation costs — "which structure?" answered by the hot operation */
    h += section("layers", "Which structure — by the operation you do most",
      "Pick the structure from the operation in your inner loop, not from the noun in " +
      "the problem statement. The last column is the one thing this structure is for.",
      table(["Structure", "Lookup", "Insert", "Delete", "Reach for it when"],
        OPS.map(function (r) {
          return "<tr" + rowAttrs("struct", r.join(" ")) + "><td><b>" + chip(r[0]) + "</b></td>" +
            '<td class="cue-cx">' + TD.esc(r[1]) + "</td>" +
            '<td class="cue-cx">' + TD.esc(r[2]) + "</td>" +
            '<td class="cue-cx">' + TD.esc(r[3]) + "</td>" +
            "<td>" + TD.rich(r[4]) + "</td></tr>";
        }).join("")));

    /* 7. edge cases, by family */
    h += section("shield", "The cases that actually break it",
      "Testing your own code is scored. A generic “what about an empty array” earns less " +
      "than the case that genuinely breaks the shape you just wrote, so pick the row for " +
      "what you built.",
      table(["If you wrote", "Try these before they do"],
        EDGES.map(function (r) {
          return "<tr" + rowAttrs("all", r.join(" ")) + "><td><b>" + TD.esc(r[0]) +
            "</b></td><td>" + TD.rich(r[1]) + "</td></tr>";
        }).join(""), "cue-edges"));

    /* 8. the six steps */
    h += section("bulb", "The six steps, out loud, every time", "",
      '<ol class="card-steps">' +
      "<li><b>Clarify</b> — empty input? duplicates? negatives? how big is n? return the value or the index?</li>" +
      "<li><b>Work an example by hand</b> — half the time you find the pattern while doing this.</li>" +
      "<li><b>State the brute force</b> and its complexity. It buys goodwill and gives you a fallback.</li>" +
      "<li><b>Name the bottleneck</b>, then the tool that removes it. Get agreement before coding.</li>" +
      "<li><b>Code</b> — clean names, small helpers, no cleverness. Talk, but do not narrate every character.</li>" +
      "<li><b>Test</b> your own code: empty, single element, all identical, negatives, duplicates. " +
      "Finish with <b>both</b> time and space complexity.</li>" +
      "</ol>");

    h += '<p class="cue-empty" id="cueEmpty" hidden>Nothing matches that. Clear the filter, ' +
      "or try the pattern name rather than the problem name.</p>";

    return h + "</div>";
  };

  TD.viewFormulaCard = function () {
    var h = '<div class="card-page">';

    h += '<header class="card-head">' +
      '<p class="card-kicker">Quick reference</p>' +
      "<h1>The AI formula card</h1>" +
      '<p class="card-deck">The handful of formulas and numbers worth being able to recall cold, ' +
      "because they come up in the middle of an answer and hesitating there is expensive.</p>" +
      '<div class="card-actions">' +
      '<a class="btn btn-ghost btn-sm" href="#/cards/patterns">' + TD.icon("path") + "Pattern cue card</a>" +
      '<button class="btn btn-ghost btn-sm" data-act="print">' + TD.icon("book") + "Print</button>" +
      "</div></header>";

    h += '<section class="card-sec"><h2 class="art-h2"><span class="h2-ico">' + TD.icon("graph") +
      "</span>Formulas</h2>";
    h += '<div class="cue-wrap"><table class="cue-table formula-table">' +
      "<thead><tr><th>Name</th><th>Formula</th><th>Why it matters</th></tr></thead><tbody>" +
      FORMULAS.map(function (f) {
        return "<tr><td><b>" + chip(f.t) + "</b>" +
          (f.n !== f.t ? '<span class="cue-alt">' + TD.esc(f.n) + "</span>" : "") + "</td>" +
          '<td><code class="formula">' + TD.esc(f.f) + "</code></td>" +
          '<td class="cue-cx">' + TD.rich(f.w) + "</td></tr>";
      }).join("") + "</tbody></table></div></section>";

    h += '<section class="card-sec"><h2 class="art-h2"><span class="h2-ico">' + TD.icon("cpu") +
      "</span>VRAM, worked through</h2>" +
      '<p class="card-note">“What hardware do you need to serve this?” is a real question. ' +
      "Showing the levers — quantise, switch to GQA, cap the context, shard across two GPUs — " +
      "matters more than getting the arithmetic exactly right.</p>";
    h += '<div class="cue-wrap"><table class="cue-table"><thead><tr>' +
      "<th>Scenario</th><th>Calculation</th><th>Total</th></tr></thead><tbody>" +
      VRAM.map(function (r) {
        return "<tr><td>" + TD.esc(r[0]) + '</td><td><code class="formula">' + TD.esc(r[1]) +
          "</code></td><td><b>" + TD.esc(r[2]) + "</b></td></tr>";
      }).join("") + "</tbody></table></div></section>";

    h += '<section class="card-sec"><h2 class="art-h2"><span class="h2-ico">' + TD.icon("shield") +
      "</span>Three rules of thumb</h2>" +
      '<ol class="card-steps">' +
      "<li><b>Weights</b> — parameters × bytes per parameter. ~2 GB per billion at FP16, " +
      "~1 at INT8, ~0.5 at INT4.</li>" +
      "<li><b>KV cache</b> — 2 × layers × kv_heads × head_dim × bytes × " +
      "sequence length × concurrent requests. On long contexts this dwarfs the weights.</li>" +
      "<li><b>Overhead</b> — multiply the total by about 1.2× for activations, framework " +
      "overhead and fragmentation.</li>" +
      "</ol></section>";

    return h + "</div>";
  };

  /* --- wiring -----------------------------------------------------------
     One input and one segmented control narrow every marked row on the page.
     Rows carry their own data-q haystack and data-f family, so filtering is a
     single pass over elements that already exist — no re-render, and nothing
     to keep in sync with the data above.

     Everything is looked up inside #view on each call rather than bound once,
     because #view survives re-renders: binding to a longer-lived node would
     stack a fresh listener on every visit to the card. */
  TD.wireCards = function () {
    var view = document.getElementById("view");
    if (!view) return;
    var input = view.querySelector("#cueFilter");
    var seg = view.querySelector("#cueSeg");
    var count = view.querySelector("#cueCount");
    var empty = view.querySelector("#cueEmpty");
    if (!input || !seg) return;

    var rows = Array.prototype.slice.call(view.querySelectorAll("[data-q]"));
    var fam = "all";

    function apply() {
      var q = input.value.toLowerCase().trim();
      var shown = 0, cues = 0;

      rows.forEach(function (row) {
        var rowFam = row.getAttribute("data-f");
        /* A row tagged "all" belongs to no single family, so a family filter
           hides it rather than pretending it matches — otherwise the generic
           rows would swamp the family the reader asked for. */
        var okFam = fam === "all" || rowFam === fam;
        var okQ = !q || row.getAttribute("data-q").indexOf(q) !== -1;
        var on = okFam && okQ;
        row.hidden = !on;
        if (on) {
          shown++;
          if (row.closest(".cue-main")) cues++;
        }
      });

      /* A section whose rows have all gone is hidden too, so the page does not
         become a column of empty headings with their explanatory notes. */
      Array.prototype.slice.call(view.querySelectorAll(".card-sec")).forEach(function (sec) {
        var owned = sec.querySelectorAll("[data-q]").length;
        if (!owned) return;
        sec.hidden = sec.querySelectorAll("[data-q]:not([hidden])").length === 0;
      });

      if (count) {
        count.textContent = (q || fam !== "all")
          ? cues + (cues === 1 ? " cue" : " cues") + " of " + CUES.length
          : CUES.length + " cues";
      }
      if (empty) empty.hidden = shown > 0;
    }

    var deb;
    input.addEventListener("input", function () {
      clearTimeout(deb);
      deb = setTimeout(apply, 120);
    });

    /* Escape clears rather than closing anything, because the filter is the
       only stateful thing on the page and a stuck filter looks like a bug. */
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && input.value) {
        input.value = "";
        apply();
      }
    });

    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      Array.prototype.slice.call(seg.querySelectorAll("button")).forEach(function (x) {
        x.classList.remove("is-on");
      });
      b.classList.add("is-on");
      fam = b.getAttribute("data-f");
      apply();
    });
  };

  /* Exposed for the tests, which assert the card covers the families and
     confusions it claims to rather than only that it renders. */
  TD.cueData = { cues: CUES, families: FAMILIES, confusions: CONFUSIONS,
    states: STATES, ops: OPS, constraints: CONSTRAINTS, edges: EDGES, ladder: LADDER };

})(window.TD);
