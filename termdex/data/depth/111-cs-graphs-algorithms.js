/* ==========================================================================
   Depth pass 111 — Computer Science Fundamentals batch 3: Graphs & Fundamental Algorithms.
   Graph, Binary Search, Sorting Algorithm, Memoisation,
   Breadth-First Search, Depth-First Search, Dijkstra's Algorithm.

   Topological invariants, logarithmic interval bisection, divide-and-conquer partitions,
   and greedy relaxation frontiers power classical algorithmic computation.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "graph",

      why: {
        before: "Linear and hierarchical data structures (arrays, trees) could only model sequential lists or strict parent-child relationships, failing completely when entities had arbitrary, cyclic, or many-to-many interconnections.",
        problem: "Software needs a universal mathematical structure to model complex arbitrary networks—such as social graphs, internet routing topologies, road networks, dependency graphs, and neural wiring.",
        shift: "**Graph: A non-linear data structure consisting of a finite set of vertices (or nodes) $V$ and a set of edges $E$ connecting pairs of vertices ($G = (V, E)$).** Supporting directed, undirected, weighted, cyclic, and bipartite topologies, graphs constitute the most expressive structural representation in computer science."
      },

      num: {
        t: "Graph Representations: Adjacency Matrix vs Adjacency List vs CSR",
        h: ["Representation Format", "Space Complexity", "Edge Query: `hasEdge(u, v)`", "Iterate Neighbors of $u$", "Insert Vertex / Edge", "Primary Systems Application"],
        r: [
          ["Adjacency Matrix ($V \\times V$)", "$\\mathcal{O}(V^2)$ dense", "$\\mathcal{O}(1)$ direct lookup", "$\\mathcal{O}(V)$ linear scan", "$\\mathcal{O}(V^2)$ vertex / $\\mathcal{O}(1)$ edge", "Dense graphs ($E \\approx V^2$), Floyd-Warshall, GPU matrix math"],
          ["Adjacency List (Vector of Lists)", "$\\mathcal{O}(V + E)$ sparse", "$\\mathcal{O}(\\text{deg}(u))$", "$\\mathcal{O}(\\text{deg}(u))$ optimal", "$\\mathcal{O}(1)$ vertex / $\\mathcal{O}(1)$ edge", "Sparse graphs ($E \\ll V^2$), standard BFS/DFS traversals"],
          ["Compressed Sparse Row (CSR)", "$\\mathcal{O}(V + E)$ packed arrays", "$\\mathcal{O}(\\log(\\text{deg}(u)))$ binary search", "$\\mathcal{O}(\\text{deg}(u))$ contiguous cache line", "$\\mathcal{O}(V + E)$ rebuild", "Graph neural networks (PyG), high-performance analytics"],
          ["Adjacency Hash Set", "$\\mathcal{O}(V + E)$", "$\\mathcal{O}(1)$ average", "$\\mathcal{O}(\\text{deg}(u))$", "$\\mathcal{O}(1)$ vertex / $\\mathcal{O}(1)$ edge", "Dynamic sparse graphs with frequent edge deletions"],
          ["Incidence Matrix ($V \\times E$)", "$\\mathcal{O}(V \\cdot E)$", "$\\mathcal{O}(E)$ scan", "$\\mathcal{O}(E)$ scan", "$\\mathcal{O}(V \\cdot E)$", "Electrical network modeling, topological graph theory"]
        ],
        n: "A graph $G = (V, E)$ is classified along three orthogonal axes: **Directionality** (Undirected vs Directed / Digraph), **Weighting** (Unweighted vs Weighted with edge weights $w: E \\to \\mathbb{R}$), and **Cyclicity** (Cyclic vs Directed Acyclic Graph / DAG). For a graph with $V$ vertices, maximum edges in a simple undirected graph is $\\frac{V(V-1)}{2} = \\mathcal{O}(V^2)$. When $|E| \\ll |V|^2$, the graph is **sparse**, making the **Adjacency List** representation mathematically optimal: an array of $V$ dynamic lists where list $u$ stores all adjacent neighbors $v$. In high-performance computing, **Compressed Sparse Row (CSR)** packs the graph into two flat contiguous arrays: `offsets` of length $V+1$ and `edges` of length $E$, eliminating pointer chasing and allowing SIMD vectorization across neighbor lists."
      },

      miss: [
        {
          w: "An Adjacency Matrix is always better than an Adjacency List because checking edge existence is $\\mathcal{O}(1)$.",
          r: "Real-world graphs (the Web, Twitter, road networks) are overwhelmingly **sparse** (average degree $\\ll 100$). An Adjacency Matrix for Twitter's 400 million users would require $160$ petabytes of RAM ($400M \\times 400M$ bytes), $99.999\\%$ of which would be zeroes. Adjacency lists store only existing edges in $\\mathcal{O}(V + E)$ space, making them viable for massive networks."
        },
        {
          w: "A tree and a graph are fundamentally different data structures.",
          r: "A **tree** is simply a constrained mathematical subset of a graph: specifically, a connected, undirected graph with zero cycles and exactly $|V| - 1$ edges. Any algorithm that operates on general graphs (BFS, DFS) works seamlessly on trees."
        },
        {
          w: "Graphs can only be traversed using recursion.",
          r: "Recursive graph traversal on large graphs quickly causes call-stack overflows. BFS is inherently **iterative** using a queue, and DFS can be implemented iteratively using an explicit heap-allocated stack with a `visited` hash set or bitset."
        },
        {
          w: "Directed Acyclic Graphs (DAGs) cannot be topologically sorted if they have multiple disconnected components.",
          r: "Topological sorting works across disconnected DAG components (forming a **topological forest**). Kahn's algorithm or DFS with back-edge detection easily finds a valid linear ordering across all components in $\\mathcal{O}(V + E)$ time."
        }
      ],

      trade: {
        buys: [
          "Universal relational expressiveness: models arbitrary complex dependencies, networks, routing flows, and relationships.",
          "Mathematical algorithm ecosystem: unlocks shortest paths (Dijkstra), minimum spanning trees (Kruskal), and flows (Ford-Fulkerson).",
          "Topological sorting: resolves execution order for build systems (Makefile, Bazel) and data pipelines (Airflow, dbt).",
          "Compact sparse representation: Adjacency Lists and CSR pack billion-node graphs into memory proportionally to actual connections."
        ],
        costs: [
          "Non-contiguous memory access: traversing graph edges involves irregular memory dereferencing, thrashing CPU L1/L2 caches.",
          "Quadratic matrix memory: dense adjacency matrices scale as $\\mathcal{O}(V^2)$, exhausting RAM on large node counts.",
          "Cycle detection overhead: algorithms must maintain explicit `visited` sets or state colorings to prevent infinite loops.",
          "Distributed partitioning complexity: sharding graphs across distributed clusters (Pregel, GraphX) requires costly network communication."
        ],
        avoid: [
          "Never allocate an $N \\times N$ Adjacency Matrix when $N > 10{,}000$; use Adjacency Lists or Compressed Sparse Row (CSR).",
          "Do not traverse a cyclic graph without maintaining a `visited` set to avoid infinite loops.",
          "Avoid using recursive DFS on large graphs in production without setting stack limits; use an explicit iterative stack.",
          "Never evaluate dependency order in build pipelines without checking for cycles (which indicate deadlocks or impossible dependencies)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "binary-search",

      why: {
        before: "Finding an item in an ordered collection required scanning from the beginning element-by-element (Linear Search), taking $\\mathcal{O}(N)$ time—requiring up to 1,000,000 checks on a million-item list.",
        problem: "Software needs to locate records in sorted datasets in near-instantaneous time, scaling sub-linearly so that doubling the dataset size barely impacts latency.",
        shift: "**Binary Search: A divide-and-conquer search algorithm that finds the position of a target value within a sorted array by repeatedly comparing the target to the middle element and eliminating half of the search space at each step.** Achieving logarithmic time complexity $\\mathcal{O}(\\log_2 N)$, it locates any item in a billion-element array in at most 30 comparisons."
      },

      num: {
        t: "Binary Search Variations: Boundary Conditions & Operational Bounds",
        h: ["Variation / Primitive", "Interval Invariant", "Middle Formula", "Loop Condition", "Use Case / Return Value"],
        r: [
          ["Classic Exact Match", "$[L, R]$ closed interval", "$L + (R - L) / 2$", "`while (L <= R)`", "Returns exact index of target or -1"],
          ["Lower Bound (`bisect_left`)", "$[L, R)$ half-open interval", "$L + (R - L) / 2$", "`while (L < R)`", "First index where $\\text{arr}[i] \\ge \\text{target}$"],
          ["Upper Bound (`bisect_right`)", "$[L, R)$ half-open interval", "$L + (R - L) / 2$", "`while (L < R)`", "First index where $\\text{arr}[i] > \\text{target}$"],
          ["Binary Search on Answer", "$[\\text{low}, \\text{high}]$ monotonic domain", "$\\text{low} + (\\text{high} - \\text{low}) / 2$", "`while (low <= high)`", "Optimization: minimizes max allocation, capacity"],
          ["Exponential Search", "$[2^{k-1}, 2^k]$ unbounded", "Binary search on bounded window", "`while (arr[i] < target)`", "Searching unbounded infinite streaming buffers"]
        ],
        n: "Binary search exploits monotonicity. Given a sorted array $A$ and target $T$, the algorithm evaluates the midpoint $M$. If $A[M] == T$, the search terminates. If $A[M] < T$, all elements in $[L, M]$ are strictly less than $T$ and can be eliminated, setting $L = M + 1$. Conversely, if $A[M] > T$, $R = M - 1$. The recurrence relation is $T(N) = T(N/2) + \\mathcal{O}(1)$, which solves via the Master Theorem to strictly **$\\mathcal{O}(\\log_2 N)$ time** and $\\mathcal{O}(1)$ space. However, subtle boundary bugs are legendary: Joshua Bloch famously revealed in 2006 that the classic textbook midpoint formula `mid = (low + high) / 2` contained an arithmetic overflow bug in Java's standard library that lay hidden for over 20 years: if `low + high` exceeds $2^{31} - 1$, it overflows to a negative number. The mathematically safe formula is `mid = low + (high - low) / 2`."
      },

      miss: [
        {
          w: "Binary search can only be used to find items in pre-existing sorted arrays.",
          r: "Binary search applies to ANY **monotonic predicate function** $f(x) \\in \\{\\text{False}, \\dots, \\text{False}, \\text{True}, \\dots, \\text{True}\\}$. This powerful technique, **Binary Search on Answer**, solves complex optimization problems (e.g., finding the minimum capacity needed to ship packages in $D$ days, or allocating memory buffers) in $\\mathcal{O}(\\log(\\text{Range}) \\times \\text{CheckTime})$."
        },
        {
          w: "Writing `(low + high) / 2` to find the midpoint is perfectly fine in all languages.",
          r: "In fixed-width integer languages (C, C++, Java, Rust, Go), if `low + high` exceeds the maximum integer value ($2^{31}-1$ for 32-bit signed ints), it causes integer overflow, resulting in a negative number and an out-of-bounds array crash. Always use `low + (high - low) / 2` or `(low + high) >>> 1`."
        },
        {
          w: "Binary search is always faster than linear search for any array size.",
          r: "For tiny arrays ($N \\le 16\\text{--}32$), **Linear Search** is often faster in practice. Linear search reads contiguous memory sequentially, maximizing CPU L1 data cache hits and allowing SIMD vector comparison instructions, whereas binary search incurs branch mispredictions and non-contiguous memory jumps."
        },
        {
          w: "Binary search on a sorted linked list runs in $\\mathcal{O}(\\log N)$ time.",
          r: "Binary search requires $\\mathcal{O}(1)$ random indexing to inspect the middle element. A linked list lacks random access; finding the middle requires an $\\mathcal{O}(N)$ sequential pointer scan, forcing the overall search time to degrade to $\\mathcal{O}(N)$."
        }
      ],

      trade: {
        buys: [
          "Logarithmic search speed: locates any item in a billion-element array in at most 30 comparisons ($\mathcal{O}(\\log N)$).",
          "Zero auxiliary memory: executes entirely in-place with $\\mathcal{O}(1)$ auxiliary space.",
          "Solves monotonic optimization: optimizes complex capacity/resource allocation via Binary Search on Answer.",
          "Precise boundary detection: `bisect_left` and `bisect_right` extract duplicate counts and insertion ranks instantly."
        ],
        costs: [
          "Requires strict sorting: data must be fully sorted upfront, which costs $\\mathcal{O}(N \\log N)$ if not already ordered.",
          "Requires random access: unusable on linked lists or streaming data without sequential indexing structures.",
          "Subtle boundary conditions: off-by-one errors in `<` vs `<=`, `mid` vs `mid + 1`, and interval closure are notoriously bug-prone.",
          "Dynamic update penalty: maintaining a sorted array under frequent insertions requires costly $\\mathcal{O}(N)$ element shifts."
        ],
        avoid: [
          "Never calculate the midpoint as `(low + high) / 2` in fixed-width integer languages; use `low + (high - low) / 2`.",
          "Do not sort an unsorted array just to perform a single search; linear search is $\\mathcal{O}(N)$, while sorting + searching is $\\mathcal{O}(N \\log N)$.",
          "Avoid using binary search on linked lists; use an array, Skip List, or Balanced BST instead.",
          "Never mix up lower bound (first element $\\ge T$) and upper bound (first element $> T$) when searching for range spans of duplicates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sorting-algorithm",

      why: {
        before: "Unsorted data prevented logarithmic binary search, duplicate detection, and efficient aggregation, requiring brute-force linear scans across databases and records.",
        problem: "Computer systems require an optimal, mathematically bounded mechanism to rearrange an arbitrary sequence of elements into a specified order (numerical, alphabetical) with minimal CPU cycles and memory footprint.",
        shift: "**Sorting Algorithm: An algorithm that puts elements of a list into an ordered sequence (ascending or descending).** Classified by time complexity, space overhead, stability, and adaptability, sorting algorithms establish the fundamental benchmarks of computational complexity theory."
      },

      num: {
        t: "Sorting Algorithm Taxonomy: Complexities, Stability & Memory Behaviors",
        h: ["Algorithm", "Best Time", "Average Time", "Worst Time", "Space Complexity", "Stable?", "Primary Practical Deployment"],
        r: [
          ["QuickSort (Dual-Pivot)", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N^2)$ (mitigated)", "$\\mathcal{O}(\\log N)$ stack", "No", "Default primitive sorter (Java, C `qsort`)"],
          ["MergeSort", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N \\log N)$ strict", "$\\mathcal{O}(N)$ buffer", "Yes", "External sorting, linked lists, predictable bounds"],
          ["TimSort", "$\\mathcal{O}(N)$ (pre-sorted)", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N)$ buffer", "Yes", "Python `list.sort()`, Java `Arrays.sort(Object[])`, V8"],
          ["HeapSort", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(1)$ strict in-place", "No", "IntroSort fallback, embedded real-time systems"],
          ["InsertionSort", "$\\mathcal{O}(N)$ (pre-sorted)", "$\\mathcal{O}(N^2)$", "$\\mathcal{O}(N^2)$", "$\\mathcal{O}(1)$ in-place", "Yes", "Small arrays ($N \\le 32$) inside hybrid sorters"],
          ["Counting Sort (Non-comparison)", "$\\mathcal{O}(N + K)$", "$\\mathcal{O}(N + K)$", "$\\mathcal{O}(N + K)$", "$\\mathcal{O}(K)$ bucket array", "Yes", "Small integer domains, RadixSort subroutine"]
        ],
        n: "In theoretical computer science, the **Information-Theoretic Lower Bound** proves that any comparison-based sorting algorithm must execute at least $\\Omega(N \\log N)$ comparisons in the worst case: a sequence of $N$ items has $N!$ possible permutations; because each comparison yields at most 1 bit of information (binary decision tree), the minimum tree height is $\\log_2(N!) \\ge N \\log_2 N - N \\log_2 e = \\Omega(N \\log N)$. Non-comparison algorithms (**Counting Sort, Radix Sort**) circumvent this bound by indexing directly into memory buckets in $\\mathcal{O}(N)$ time. Modern production engines almost universally use **hybrid algorithms**: **TimSort** (Peters, 2002) decomposes arrays into natural sorted 'runs' and merges them via MergeSort, falling back to InsertionSort for small chunks; **IntroSort** (Musser, 1997) begins with QuickSort, switches to HeapSort if recursion depth exceeds $2\\log_2 N$ to eliminate $\\mathcal{O}(N^2)$ worst-cases, and finishes with InsertionSort on small partitions."
      },

      miss: [
        {
          w: "QuickSort is always faster than MergeSort because it has a better Big-O complexity.",
          r: "Both have average time complexity of $\\mathcal{O}(N \\log N)$. QuickSort is faster in practice on arrays because its inner loop has smaller constant factors and excellent CPU cache locality. However, MergeSort is strictly $\\mathcal{O}(N \\log N)$ in the worst case (QuickSort can degrade to $\\mathcal{O}(N^2)$ without randomized pivots) and is **stable**, preserving the order of equal keys."
        },
        {
          w: "A stable sorting algorithm is one that doesn't crash or run out of memory.",
          r: "In computer science, **stability** has a precise mathematical meaning: a sorting algorithm is **stable** if and only if two records with equal keys appear in the output in the **exact same relative order** as they appeared in the input. Stability is critical when sorting records by multiple criteria (e.g., sorting by Date, then sorting by City)."
        },
        {
          w: "No sorting algorithm can ever run faster than $\\mathcal{O}(N \\log N)$.",
          r: "The $\\Omega(N \\log N)$ barrier applies strictly to **comparison-based** sorting. Non-comparison sorting algorithms like **Counting Sort**, **Radix Sort**, and **Bucket Sort** sort integers or strings by byte values in strictly **$\\mathcal{O}(N)$ linear time**."
        },
        {
          w: "BubbleSort is a fine sorting algorithm for small production tasks.",
          r: "BubbleSort has zero redeeming engineering qualities. Even for small datasets, **InsertionSort** executes in the exact same $\\mathcal{O}(N^2)$ worst-case and $\\mathcal{O}(N)$ best-case, but performs a fraction of the memory writes and constant-factor instructions."
        }
      ],

      trade: {
        buys: [
          "Enables logarithmic searching: orders data to permit $\\mathcal{O}(\\log N)$ binary search, interval queries, and deduplication.",
          "Accelerates relational joins: sorts datasets to power high-throughput Merge Joins in database query engines.",
          "Preserves secondary sort order: stable algorithms (TimSort, MergeSort) allow multi-column cascading sorts.",
          "Adaptive performance: modern hybrid algorithms run in $\\mathcal{O}(N)$ linear time on partially pre-sorted real-world data."
        ],
        costs: [
          "Memory overhead: MergeSort and TimSort require auxiliary buffer arrays scaling up to $\\mathcal{O}(N)$ extra space.",
          "Worst-case vulnerability: naive QuickSort degrades to quadratic $\\mathcal{O}(N^2)$ on already-sorted data without randomized pivots.",
          "Unstable key reordering: fast in-place algorithms (QuickSort, HeapSort) reorder equal keys, corrupting multi-stage sorts.",
          "Non-comparison range limits: $\\mathcal{O}(N)$ counting sorts consume catastrophic memory if key range $K$ is massive."
        ],
        avoid: [
          "Never write a custom sorting algorithm in production; standard library functions (`std::sort`, `Arrays.sort`) use highly tuned hybrid sorters.",
          "Do not use unstable sorting algorithms when sorting data with secondary keys where original order must be preserved.",
          "Avoid using QuickSort without median-of-three or randomized pivot selection to prevent $\\mathcal{O}(N^2)$ worst-case degradation.",
          "Never use Counting Sort on wide 64-bit floating-point or unbounded integer ranges where bucket array size $K$ blows out RAM."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "memoisation",

      why: {
        before: "Recursive algorithms solving problems with overlapping subproblems (e.g., Fibonacci, Edit Distance, Knapsack) recomputed the exact same recursive branches millions of times, causing exponential runtime explosion ($\\mathcal{O}(2^N)$).",
        problem: "Software needs an optimization technique that stores the results of expensive function calls and returns the cached result when the exact same inputs occur again, collapsing exponential recursion into linear time.",
        shift: "**Memoisation: A top-down optimization technique used primarily to speed up computer programs by storing the results of expensive function calls in a lookup table (cache) and returning the cached result when the same inputs occur again.** Derived from Donald Michie's concept of 'memo notebook' in 1968, memoisation constitutes the top-down formulation of Dynamic Programming."
      },

      num: {
        t: "Memoisation vs Tabulation: Top-Down vs Bottom-Up Dynamic Programming",
        h: ["Dimension", "Top-Down (Memoisation)", "Bottom-Up (Tabulation)", "Operational Consequence", "Practical Recommendation"],
        r: [
          ["Direction of Computation", "Solves from top root state $N$ down to base cases", "Solves from base cases $0, 1$ iteratively up to $N$", "Memoisation only evaluates subproblems that are actually needed", "Use memoisation when subproblem state space is sparse"],
          ["Call Stack Consumption", "$\\mathcal{O}(\\text{depth})$ execution frames", "$\\mathcal{O}(1)$ flat loop (no recursion)", "Memoisation risks call-stack overflow on deep inputs", "Use tabulation in low-memory or stack-constrained engines"],
          ["Memory Optimization", "Requires caching all visited states", "Often permits space reduction to $\\mathcal{O}(1)$ rolling variables", "Tabulation can drop older table rows (e.g., Fibonacci in $O(1)$)", "Use tabulation when memory footprint must be minimized"],
          ["Implementation Simplicity", "Natural recursive mapping + decorator/hash map", "Requires explicit topological order of evaluation", "Memoisation is faster to write and reason about", "Memoisation is ideal for complex tree/DAG states"],
          ["Cache Lookup Overhead", "Hash map lookup or array dereference per call", "Direct contiguous array indexing in loop", "Tabulation has superior CPU cache locality and throughput", "Tabulation is faster for dense numerical matrices"]
        ],
        n: "Memoisation eliminates the redundant execution trees of recursive algorithms. In the naive recursive computation of Fibonacci numbers $F(n) = F(n-1) + F(n-2)$, the call tree branches into $2^n$ operations: computing $F(5)$ computes $F(3)$ twice and $F(2)$ three times. By attaching a cache table $M$ (e.g., a hash table or flat array initialized to sentinel values), the function checks: if $n \\in M$, return $M[n]$; otherwise, compute $M[n] = F(n-1) + F(n-2)$ and return. This transforms the call graph from an exponential tree of $\\mathcal{O}(2^N)$ nodes into a Directed Acyclic Graph (DAG) of exactly $N$ distinct nodes, collapsing execution time to strictly **$\\mathcal{O}(N)$ linear time** and $\\mathcal{O}(N)$ space."
      },

      miss: [
        {
          w: "Memoisation and caching are two completely interchangeable, identical terms.",
          r: "All memoisation is caching, but not all caching is memoisation. **Memoisation** specifically refers to caching the return values of **pure, deterministic functions** based strictly on their input arguments. General **caching** encompasses HTTP reverse proxies, database query caches, and CPU hardware cachelines, which often deal with time-to-live (TTL) expiration, eviction, and mutating state."
        },
        {
          w: "Any function can be memoised to make it faster.",
          r: "Only **pure functions** can be safely memoised! If a function has side effects (writes to a database, prints to console) or depends on external state (current timestamp, random numbers, global variables), memoising it will return stale, incorrect results and suppress required side effects."
        },
        {
          w: "Memoisation always improves performance.",
          r: "Memoisation introduces hash lookup, argument serialization, and memory allocation overhead. If a function is computationally trivial (e.g., `add(a, b) = a + b`) or if input arguments are rarely repeated, memoisation will make the program **slower** and consume massive excess memory."
        },
        {
          w: "Python's `@lru_cache` handles unhashable arguments like lists and dicts automatically.",
          r: "Standard memoisation decorators require function arguments to be **hashable**. Passing mutable structures like lists or dictionaries will trigger a fatal `TypeError: unhashable type: 'list'`. Arguments must be converted to immutable tuples or custom frozen structures."
        }
      ],

      trade: {
        buys: [
          "Collapses exponential complexity: transforms intractable $\\mathcal{O}(2^N)$ recursive algorithms into polynomial $\\mathcal{O}(N^k)$ runtime.",
          "Intuitive top-down code: preserves the natural, elegant mathematical formulation of recursive problems.",
          "Evaluates only necessary states: unlike tabulation which computes the entire state matrix, memoisation only computes reachable states.",
          "Universal decorator tooling: languages provide native decorators (Python `@functools.lru_cache`, React `useMemo`) for instant integration."
        ],
        costs: [
          "Call stack consumption: deep recursion risks triggering fatal stack overflows unless call depth is bounded.",
          "Memory accumulation: unbounded memoisation caches consume RAM indefinitely, causing memory leaks without LRU eviction.",
          "Argument hashing overhead: computing hash keys for complex composite objects can exceed the computation time of the function itself.",
          "Requires strict function purity: introducing hidden side effects or mutable inputs breaks program correctness silently."
        ],
        avoid: [
          "Never memoise impure functions that depend on system time, random generators, or mutable global state.",
          "Do not use unbounded memoisation caches in long-running servers; always specify a maximum cache size (e.g., `@lru_cache(maxsize=1024)`).",
          "Avoid memoisation for cheap arithmetic operations where cache lookup overhead exceeds raw computation.",
          "Never pass mutable objects (lists, dictionaries) into standard memoised functions without converting them to immutable tuples."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "breadth-first-search",

      why: {
        before: "Graph and tree traversal algorithms dove blindly down individual paths (DFS), getting trapped in infinite loops on cyclic graphs or wandering down infinite branches without finding the closest target.",
        problem: "Applications need an exploration strategy that guarantees finding the shortest path (minimum number of hops) between two nodes in an unweighted graph while visiting vertices in order of increasing distance.",
        shift: "**Breadth-First Search (BFS): An algorithm for traversing or searching tree or graph data structures that starts at the root (or an arbitrary node) and explores all neighboring nodes at the present depth level before moving on to nodes at the next depth level.** Powered by a FIFO queue, BFS guarantees shortest-path optimality in unweighted graphs."
      },

      num: {
        t: "BFS vs DFS: Algorithmic Properties & Structural Dynamics",
        h: ["Feature / Metric", "Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Operational Consequence", "Engineering Decision"],
        r: [
          ["Underlying Data Structure", "FIFO Queue", "LIFO Stack (or Call Stack)", "BFS explores radially; DFS explores linearly", "Use BFS for shortest path; DFS for backtracking"],
          ["Time Complexity", "$\\mathcal{O}(V + E)$", "$\\mathcal{O}(V + E)$", "Both visit all reachable nodes and edges", "Identical theoretical asymptotic runtime"],
          ["Space Complexity", "$\\mathcal{O}(W)$ (where $W$ is maximum width)", "$\\mathcal{O}(H)$ (where $H$ is maximum depth)", "BFS consumes massive RAM on high-branching graphs", "Use DFS when memory is constrained on wide trees"],
          ["Shortest Path Guarantee", "Guaranteed shortest path on unweighted graphs", "No shortest path guarantee", "BFS finds target with minimum number of edge hops", "BFS is mandatory for unweighted shortest paths"],
          ["Cycle Handling", "`visited` boolean array / HashSet", "`visited` array / recursion state colors", "Both require tracking visited nodes to avoid cycles", "Vital on cyclic graphs"],
          ["Path Finding Topology", "Expands concentric spherical wavefronts", "Probes single branches to terminal leaves", "BFS visits many shallow non-target nodes first", "Use Bidirectional BFS to shrink search frontier"]
        ],
        n: "Breadth-First Search systematically traverses a graph $G = (V, E)$ level by level. Initializing with source vertex $s$, BFS sets $\\text{dist}[s] = 0$, marks $s$ as visited, and enqueues it. In each iteration, it dequeues vertex $u$, inspects all adjacent edges $(u, v) \\in E$, and for each unvisited neighbor $v$, records $\\text{dist}[v] = \\text{dist}[u] + 1$, sets $\\text{parent}[v] = u$, marks $v$ as visited, and enqueues $v$. This runs in strict **$\\mathcal{O}(V + E)$ time**. Because edge traversal corresponds to a monotonically non-decreasing queue of distances, BFS provably computes the shortest path in unweighted graphs. However, memory consumption is proportional to the **maximum graph width** (frontier size): for a tree with branching factor $b$ and depth $d$, the queue must hold up to $b^d$ nodes at the deepest layer, making space complexity $\\mathcal{O}(b^d) = \\mathcal{O}(V)$."
      },

      miss: [
        {
          w: "BFS always finds the shortest path on any graph.",
          r: "BFS only guarantees the shortest path on **unweighted graphs** (or graphs where all edge weights are identical). On weighted graphs where edge costs vary, BFS finds the path with the fewest *hops*, which can have a much higher total weight than a longer path. For non-negative weighted graphs, **Dijkstra's Algorithm** is required."
        },
        {
          w: "BFS can be implemented recursively just like DFS.",
          r: "BFS cannot be implemented via standard recursive function calls because the CPU call stack is inherently LIFO (Stack). BFS requires an explicit **FIFO Queue** to maintain the level-order frontier across breadth levels."
        },
        {
          w: "You should mark a node as visited when you dequeue it from the queue.",
          r: "Nodes must be marked as visited **immediately when they are enqueued**, not when dequeued! Marking upon dequeue allows the same neighbor to be enqueued multiple times by different adjacent vertices, causing the queue size to explode exponentially and degrading time complexity to $\\mathcal{O}(V \\cdot E)$."
        },
        {
          w: "BFS uses less memory than DFS.",
          r: "BFS typically uses **far more memory** than DFS. In a balanced binary tree of $1{,}000{,}000$ nodes, DFS stack space is $\\mathcal{O}(\\log N) \\approx 20$ frames. In contrast, BFS queue space must store the entire bottom leaf level: $N/2 = 500{,}000$ simultaneous nodes in RAM."
        }
      ],

      trade: {
        buys: [
          "Shortest-path guarantee: provably finds the path with the minimum number of transitions in unweighted graphs.",
          "Level-order processing: visits vertices in exact order of increasing distance from the starting node.",
          "Finds closest targets first: optimal when searching for target nodes known to be near the root in deep trees.",
          "Safe on infinite-depth trees: will find shallow solutions where DFS would get lost down an infinite branch."
        ],
        costs: [
          "Massive memory footprint: queue stores the entire frontier, consuming up to $\\mathcal{O}(V)$ memory on wide graphs.",
          "Unweighted limitation: fails to find shortest paths when edges have varying weights or latency costs.",
          "Cannot be expressed via clean recursion: requires explicit allocation and management of a FIFO queue data structure.",
          "Slower for deep target searches: if the target is located deep in a tree, BFS must exhaustively visit all shallow nodes first."
        ],
        avoid: [
          "Never mark nodes as visited upon dequeue; always mark them as visited the instant they are pushed into the queue.",
          "Do not use BFS for shortest path on weighted graphs; use Dijkstra's algorithm or A* search.",
          "Avoid standard BFS on massive graphs with huge branching factors; use Bidirectional BFS or Iterative Deepening (IDDFS).",
          "Never forget to maintain a `visited` set on cyclic graphs to avoid infinite loops and memory exhaustion."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "depth-first-search",

      why: {
        before: "Exploring all combinations in puzzle solving, topological sorting, and game theory required maintaining massive breadth-level queues, overwhelming computer memory on deep state spaces.",
        problem: "Algorithms need a memory-efficient traversal strategy that plunges as deep as possible along each branch before backtracking, enabling cycle detection, connected component labeling, and maze generation.",
        shift: "**Depth-First Search (DFS): An algorithm for traversing or searching tree or graph data structures that starts at the root (or an arbitrary node) and explores as far as possible along each branch before backtracking.** Utilizing LIFO stack mechanics, DFS operates in $\\mathcal{O}(V + E)$ time with minimal $\\mathcal{O}(\\text{height})$ memory overhead."
      },

      num: {
        t: "DFS Classification & Applications: Recursive vs Iterative Topologies",
        h: ["DFS Application / Variant", "Edge Classification", "Auxiliary Space", "Key Mechanism", "Core Systems Application"],
        r: [
          ["Topological Sorting", "Detects forward/cross edges", "$\\mathcal{O}(V)$ stack + list", "Prepends node to output upon post-visit return", "Package dependency resolution (npm, cargo, pip)"],
          ["Cycle Detection", "Detects Back Edges (ancestor links)", "$\\mathcal{O}(V)$ 3-color states", "White (unvisited), Gray (active), Black (done)", "Deadlock detection in database lock graphs"],
          ["Strongly Connected Components", "Forward and cross tree edges", "$\\mathcal{O}(V)$ stack", "Tarjan's / Kosaraju's low-link values", "Compiler optimization, social network community analysis"],
          ["Backtracking (Combinatorial)", "State space search tree edges", "$\\mathcal{O}(\\text{depth})$ path", "Modifies state, recurses, undos state (backtracks)", "N-Queens, Sudoku solvers, constraint satisfaction"],
          ["Iterative DFS with Stack", "Matches recursive traversal", "$\\mathcal{O}(V)$ heap stack", "Explicit stack pushes neighbors in reverse", "Deep graph traversal without OS stack overflow risk"]
        ],
        n: "Depth-First Search explores a graph $G = (V, E)$ by visiting a vertex $u$ and recursively traversing the first unvisited neighbor $v$, proceeding deeper until a dead end (no unvisited neighbors) is reached, at which point it backtracks to resume unvisited branches. In directed graphs, DFS classifies every edge $(u, v)$ into four categories via vertex timestamps or **Three-Coloring** (White = unvisited, Gray = currently on recursion stack, Black = completely processed): (1) **Tree Edges** (leading to a white node), (2) **Back Edges** (leading to a gray ancestor node—which mathematically proves the existence of a **directed cycle**), (3) **Forward Edges** (leading to a black descendant), and (4) **Cross Edges** (leading to a black non-ancestor). Time complexity is strictly **$\\mathcal{O}(V + E)$**. Space complexity is bounded by the maximum recursion depth $\\mathcal{O}(h)$, which for a balanced tree is merely $\\mathcal{O}(\\log V)$, making DFS exponentially more memory-efficient than BFS."
      },

      miss: [
        {
          w: "DFS always finds the shortest path if you just let it finish searching.",
          r: "DFS visits paths greedily and will return the **first path it happens to find**, which is frequently a long, convoluted, non-optimal route. DFS provides zero guarantees of shortest path length in either weighted or unweighted graphs."
        },
        {
          w: "Checking if a node is visited is enough to detect cycles in a directed graph.",
          r: "In a directed graph, encountering an already-visited node does NOT necessarily mean there is a cycle (it could be a Cross Edge from a parallel branch). Cycle detection in directed graphs requires verifying that the target node is currently **active on the recursion stack** (a Back Edge), using three colors (White, Gray, Black)."
        },
        {
          w: "Recursive DFS can be safely run on any production graph.",
          r: "If a graph or tree is deeply skewed or has a long path (e.g., $100{,}000$ sequential nodes), recursive DFS will allocate $100{,}000$ stack frames and crash with a fatal `StackOverflowError`. Deep graphs must be traversed using **Iterative DFS** with an explicit heap-allocated stack."
        },
        {
          w: "DFS and backtracking are the exact same thing.",
          r: "DFS is a specific graph traversal algorithm that visits all nodes in a graph. **Backtracking** is a general algorithmic paradigm that uses DFS on an implicit state-space tree to search for solutions, pruning non-viable branches early."
        }
      ],

      trade: {
        buys: [
          "Minimal memory consumption: requires only $\\mathcal{O}(h)$ memory proportional to tree height, vastly smaller than BFS queue width.",
          "Enables topological sorting: naturally computes dependency ordering by recording nodes in reverse post-visit order.",
          "Rigorous cycle detection: classifies edge types (back edges) to identify cycles in dependency and transaction graphs.",
          "Foundation for backtracking: powers constraint satisfaction, state exploration, maze generation, and game search trees."
        ],
        costs: [
          "No shortest path guarantees: explores branches deeply without regard to hop count or edge weight optimality.",
          "Stack overflow hazard: deep graphs crash call stacks in recursive implementations unless converted to iterative loops.",
          "Vulnerable to infinite branches: can wander down infinite paths on infinite graphs or deep search spaces without finding shallow solutions.",
          "Unbalanced search trees: performance degrades to linear $\\mathcal{O}(V)$ memory if the tree degenerates into a single chain."
        ],
        avoid: [
          "Never use recursive DFS on unbounded user-supplied graphs without converting to an iterative stack to prevent stack overflows.",
          "Do not use DFS to find the shortest path between two nodes in unweighted graphs; use BFS.",
          "Avoid using simple 2-state boolean `visited` flags for cycle detection in directed graphs; use 3-color state tracking.",
          "Never execute exhaustive DFS backtracking without pruning branches early (bounding functions) to avoid exponential combinatorial explosion."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
