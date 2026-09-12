/* ==========================================================================
   Depth pass 109 — Computer Science Fundamentals batch 1: Foundations & Core Complexity.
   Algorithm, Data Structure, Time Complexity, Space Complexity,
   Array, Linked List, Stack.

   Turing decidability, Landau asymptotic bounds, and contiguous memory topologies
   establish the foundational bedrock of algorithmic efficiency.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "algorithm",

      why: {
        before: "Problem-solving in early computing and human calculation relied on informal ad-hoc recipes, intuitive rules of thumb, or trial-and-error procedures with no guarantees of termination, determinism, or correctness.",
        problem: "Automated computing engines require an unambiguous, finite sequence of mathematically rigorous instructions that terminate in bounded steps and provably map any valid input to its correct output.",
        shift: "**Algorithm: An unambiguous, finite, well-defined sequence of computational instructions that takes a set of values as input, executes step-by-step logic, and produces an output.** Formalized by Alan Turing (Turing Machines) and Alonzo Church (Lambda Calculus), algorithms abstract computational logic away from underlying hardware architectures."
      },

      num: {
        t: "Algorithmic Design Paradigms: Mechanics, Asymptotics & Canonical Examples",
        h: ["Design Paradigm", "Core Mechanism", "Time Complexity Range", "Optimal Substructure", "Canonical Production Example"],
        r: [
          ["Divide and Conquer", "Break into independent subproblems, solve recursively, combine", "Typically $\\mathcal{O}(N \\log N)$ via Master Theorem", "Yes; subproblems are disjoint", "MergeSort, QuickSort, Fast Fourier Transform (FFT)"],
          ["Dynamic Programming", "Solve overlapping subproblems once, memoize in table", "Typically $\\mathcal{O}(N^2)$ to $\\mathcal{O}(N^3)$", "Yes; overlapping subproblems with optimal substructure", "Bellman-Ford, Viterbi algorithm, Diff / Levenshtein"],
          ["Greedy Strategy", "Locally optimal choice at each step without backtracking", "Typically $\\mathcal{O}(N)$ or $\\mathcal{O}(N \\log N)$", "Requires greedy choice property (matroids)", "Dijkstra's shortest path, Kruskal's MST, Huffman coding"],
          ["Backtracking / Branch & Bound", "Exhaustive recursive search with systematic pruning", "Exponential $\\mathcal{O}(2^N)$ or $\\mathcal{O}(N!)$", "Explores state-space search trees", "SAT solvers, constraint programming, TSP optimization"],
          ["Randomized / Approximation", "Uses pseudo-random bits to trade exactness for speed", "Expected polynomial $\\mathcal{O}(N)$ or $(1+\\epsilon)$-approx", "Relies on concentration inequalities", "HyperLogLog, Monte Carlo integration, QuickSelect"]
        ],
        n: "In theoretical computer science, the **Church-Turing Thesis** states that any function computable by an effective procedure can be computed by a universal Turing Machine. Formally, an algorithm is characterized by five imperative properties: (1) **Finiteness** (must terminate after a finite number of steps), (2) **Definiteness** (each step is unambiguously specified), (3) **Input** ($0$ or more quantities specified from a predefined set), (4) **Output** ($1$ or more quantities produced related to the input), and (5) **Effectiveness** (operations are basic enough to be performed in finite time with pencil and paper). Algorithmic correctness is proven mathematically through **loop invariants** via induction: establishing Initialization (true before loop), Maintenance (true before next iteration), and Termination (provides useful property upon termination to prove correctness)."
      },

      miss: [
        {
          w: "An algorithm and a computer program are the exact same thing.",
          r: "An **algorithm** is an abstract mathematical specification of a problem-solving process independent of any programming language or machine. A **program** is the concrete implementation of that algorithm written in a specific syntax (e.g., C, Python, Rust) compiled for execution on a physical CPU/GPU."
        },
        {
          w: "Computers can solve any problem if given a fast enough algorithm and sufficient hardware.",
          r: "Alan Turing proved in 1936 that certain computational problems are provably **undecidable** (e.g., the **Halting Problem**). No general algorithm can ever exist that decides whether an arbitrary program will halt or loop forever on an arbitrary input, regardless of computational power."
        },
        {
          w: "Heuristics and algorithms are interchangeable terms.",
          r: "An algorithm guarantees finding the mathematically correct, optimal solution in finite time. A **heuristic** is a practical shortcut or rule of thumb that finds a 'good enough' or approximate solution quickly, but provides no mathematical guarantees of optimality or termination."
        },
        {
          w: "Algorithmic efficiency only matters when dealing with billions of records.",
          r: "An $\\mathcal{O}(N^2)$ algorithm running in a browser main thread on merely 10,000 items executes $100{,}000{,}000$ operations, causing UI freezing and dropped frames. An $\\mathcal{O}(N \\log N)$ algorithm performs only $\\approx 130{,}000$ operations, running in under 2 milliseconds."
        }
      ],

      trade: {
        buys: [
          "Mathematical determinism: guarantees provable correctness, termination, and repeatable outputs for given inputs.",
          "Hardware independence: enables reasoning about asymptotic efficiency and scalability irrespective of CPU clock speed.",
          "Reusability: establishes universal templates (sorting, searching, graph traversal) applicable across all software domains.",
          "Scalability optimization: replacing an $\\mathcal{O}(N^2)$ algorithm with $\\mathcal{O}(N \\log N)$ achieves millions of times speedup on scale."
        ],
        costs: [
          "Implementation complexity: advanced optimal algorithms (e.g., Aho-Corasick, Suffix Automata) require high cognitive overhead to implement correctly.",
          "Constant factor overhead: theoretically optimal algorithms (e.g., Coppersmith-Winograd for matrix multiplication) have astronomical constant factors rendering them useless in practice.",
          "Edge-case fragility: algorithms with subtle mathematical invariants easily introduce off-by-one errors or overflow bugs under real-world input bounds.",
          "Memory footprint trade-offs: many speedup algorithms (memoization, caching, indexing) trade significant memory footprint to achieve lower time bounds."
        ],
        avoid: [
          "Never implement an $O(N^2)$ nested loop when an $O(N \\log N)$ sort-based or $O(N)$ hash-based algorithm is available for scalable workloads.",
          "Do not roll custom implementations of fundamental sorting or crypto algorithms in production; use standard library primitives.",
          "Avoid using theoretical asymptotic winners whose large hidden constant factors $c$ make them slower than simpler algorithms for practical input sizes $N < 1{,}000$.",
          "Never assume an algorithm is bug-free without formally verifying loop invariants and testing boundary conditions ($N=0, N=1$, max integer)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-structure",

      why: {
        before: "Early assembly code organized data as flat, unstructured memory words, requiring programmers to manually track raw byte offsets and write ad-hoc index arithmetic for every collection access.",
        problem: "Complex applications need systematic, reusable patterns for storing, organizing, and relating data in memory to optimize algorithmic operations (insertion, deletion, traversal, lookup) for specific access patterns.",
        shift: "**Data Structure: A specialized format for organizing, processing, retrieving, and storing data in computer memory or disk.** By pairing physical memory layouts (contiguous blocks vs pointer-linked nodes) with formal structural invariants, data structures determine the computational time and space bounds of all downstream algorithms."
      },

      num: {
        t: "Core Data Structure Taxonomy: Memory Topology, Invariants & Access Primitives",
        h: ["Data Structure", "Physical Memory Topology", "Structural Invariants", "Index Access", "Search / Lookup", "Insertion / Deletion"],
        r: [
          ["Contiguous Array", "Continuous contiguous RAM block", "Homogeneous typed elements, fixed size", "$\\mathcal{O}(1)$ via pointer arithmetic", "$\\mathcal{O}(N)$ (linear) / $\\mathcal{O}(\\log N)$ (sorted)", "$\\mathcal{O}(N)$ shifting overhead"],
          ["Singly Linked List", "Dispersed heap nodes linked by pointers", "Nodes store payload and next address pointer", "$\\mathcal{O}(N)$ sequential traversal", "$\\mathcal{O}(N)$ sequential scan", "$\\mathcal{O}(1)$ at known pointer node"],
          ["Hash Table", "Contiguous bucket array + collision resolution", "Key hashed via hash function: $h(k) \\pmod M$", "N/A (associative key access)", "$\\mathcal{O}(1)$ average; $\\mathcal{O}(N)$ worst collision", "$\\mathcal{O}(1)$ average insert / delete"],
          ["Binary Search Tree", "Dispersed tree nodes with left/right pointers", "Left child $<$ node $<$ right child", "$\\mathcal{O}(N)$ without indexing augmentation", "$\\mathcal{O}(\\log N)$ balanced; $\\mathcal{O}(N)$ degraded", "$\\mathcal{O}(\\log N)$ insert / delete"],
          ["Binary Heap", "Implicit complete binary tree in flat array", "Parent $\\le$ children (Min-Heap invariant)", "$\\mathcal{O}(1)$ peek root element", "$\\mathcal{O}(N)$ unstructured scan", "$\\mathcal{O}(\\log N)$ insert / extract-min"]
        ],
        n: "The relationship between data structures and algorithms is captured by Niklaus Wirth's classic dictum: *Algorithms + Data Structures = Programs*. Data structures are fundamentally categorized by physical layout: **Contiguous** (arrays, matrices) vs **Node-based / Linked** (linked lists, trees, graphs). Contiguous structures maximize **spatial locality of reference**, allowing CPU hardware prefetchers to load entire $64$-byte cache lines into L1/L2 data caches, executing operations orders of magnitude faster than pointer-chasing structures where each node dereference causes a DRAM cache miss ($100\\text{--}200$ CPU cycles latency). Abstract Data Types (ADTs)—such as Stacks, Queues, and Priority Queues—define the logical interface and mathematical behavior, whereas concrete data structures define the exact memory representation."
      },

      miss: [
        {
          w: "An Abstract Data Type (ADT) and a Data Structure are identical concepts.",
          r: "An **ADT** specifies *what* operations are supported and their mathematical contracts (e.g., a Queue supports `enqueue` and `dequeue` with FIFO semantics). A **Data Structure** is the physical *implementation* (e.g., implementing a Queue using a circular contiguous array vs a doubly linked list)."
        },
        {
          w: "Linked lists are always faster than arrays for frequent insertions and deletions.",
          r: "While inserting into a linked list is theoretically $\\mathcal{O}(1)$ *once you have the pointer*, finding the insertion position requires an $\\mathcal{O}(N)$ traversal. Furthermore, due to CPU cache misses and pointer overhead ($8$ bytes per pointer on 64-bit systems), modern benchmark profiling shows array-based dynamic buffers (`std::vector`, `ArrayList`) consistently outperform linked lists for virtually all small-to-medium collections."
        },
        {
          w: "Hash tables are always superior to search trees because they have $\\mathcal{O}(1)$ lookup.",
          r: "Hash tables provide unordered point lookups. They cannot perform range queries (`BETWEEN a AND b`), find predecessor/successor elements, or iterate in sorted order in $\\mathcal{O}(N)$ time. For ordered access and predictable worst-case guarantees without hash collision degradation, self-balancing BSTs or B-Trees are mandatory."
        },
        {
          w: "Dynamic arrays (like Python lists or JS arrays) resize by adding 1 element at a time.",
          r: "Resizing by $1$ element on every append would take $\\mathcal{O}(N^2)$ cumulative time. Dynamic arrays use **geometric over-allocation** (growth factors typically $1.5\\times$ or $2.0\\times$), yielding an amortized insertion complexity of $\\mathcal{O}(1)$."
        }
      ],

      trade: {
        buys: [
          "Computational optimization: matches access requirements (point lookup, range search, priority) to optimal asymptotic time bounds.",
          "Memory spatial efficiency: packed contiguous structures minimize pointer overhead and maximize hardware L1/L2 cache prefetching.",
          "Enforces system invariants: structures like Heaps and Balanced Trees guarantee deterministic operational constraints by construction.",
          "Component modularity: decouples client application code from internal memory storage mechanics via ADT interfaces."
        ],
        costs: [
          "Memory overhead: node-based structures allocate $8\\text{--}16$ bytes of pointer metadata per entry, inflating footprint on 64-bit systems.",
          "Cache penalties: non-contiguous structures trigger frequent CPU cache misses, degrading raw throughput despite good theoretical Big-O.",
          "Maintenance complexity: structural invariants (e.g., Red-Black tree rebalancing rotations) require complex, error-prone pointer manipulation.",
          "Concurrency contention: thread-safe data structures require fine-grained lock striping or lock-free atomics (CAS), increasing engineering complexity."
        ],
        avoid: [
          "Never choose a linked list by default without profiling against dynamic contiguous arrays (`std::vector` / `ArrayList`).",
          "Do not use standard Hash Maps when sorted iteration, min/max extraction, or range querying is required; use TreeMap / B-Tree.",
          "Avoid choosing deeply nested pointer structures in latency-critical code; prefer flat arrays and Data-Oriented Design (DOD).",
          "Never use unbounded growing collections in memory without setting eviction policies (LRU) or capacity limits to prevent Out-Of-Memory (OOM) crashes."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "time-complexity",

      why: {
        before: "Engineers measured software performance solely by elapsed wall-clock execution time (stopwatch benchmarks), which varied wildly depending on CPU clock speeds, operating system background processes, compiler optimizations, and dataset size.",
        problem: "Computer scientists needed an objective, machine-independent mathematical language to characterize how the computational runtime of an algorithm scales as the input size $N$ approaches infinity.",
        shift: "**Time Complexity: A mathematical formulation that quantifies the amount of computer processing time required to run an algorithm as a function of the length of the input string or collection size ($N$).** Expressed through asymptotic notations (Big-O, Big-Omega, Big-Theta), it classifies algorithms by their fundamental scaling behavior."
      },

      num: {
        t: "Asymptotic Complexity Hierarchy: Scaling Dynamics from Small to Infinite $N$",
        h: ["Asymptotic Class", "Formal Name", "Operations for $N = 10$", "Operations for $N = 10{,}000$", "Real-World Algorithm Example"],
        r: [
          ["$\\mathcal{O}(1)$", "Constant Time", "$1$", "$1$", "Hash table lookup, array index dereference"],
          ["$\\mathcal{O}(\\log N)$", "Logarithmic Time", "$\\approx 3.3$", "$\\approx 13.3$", "Binary search, balanced tree lookup"],
          ["$\\mathcal{O}(N)$", "Linear Time", "$10$", "$10{,}000$", "Linear scan, counting sort, single loop"],
          ["$\\mathcal{O}(N \\log N)$", "Linearithmic Time", "$\\approx 33$", "$\\approx 132{,}877$", "MergeSort, QuickSort, TimSort, FFT"],
          ["$\\mathcal{O}(N^2)$", "Quadratic Time", "$100$", "$100{,}000{,}000$ (100M)", "Nested loops, BubbleSort, naive pairwise distance"],
          ["$\\mathcal{O}(N^3)$", "Cubic Time", "$1{,}000$", "$1{,}000{,}000{,}000{,}000$ ($10^{12}$)", "Naive matrix multiplication, Floyd-Warshall"],
          ["$\\mathcal{O}(2^N)$", "Exponential Time", "$1{,}024$", "$1.99 \\times 10^{3010}$ (Heat death of universe)", "Recursive Fibonacci, exhaustive subset sum"],
          ["$\\mathcal{O}(N!)$", "Factorial Time", "$3{,}628{,}800$", "Astronomical ($> 10^{35000}$)", "Brute-force Traveling Salesperson Problem"]
        ],
        n: "Asymptotic time analysis ignores hardware-dependent multiplicative constants and low-order terms, focusing on the limiting behavior as $N \\to \\infty$. Formally, **Big-O** defines an asymptotic upper bound: $f(N) = \\mathcal{O}(g(N))$ if there exist positive constants $c$ and $n_0$ such that $0 \\le f(N) \\le c \\cdot g(N)$ for all $N \\ge n_0$. **Big-Omega ($\\Omega$)** defines the asymptotic lower bound ($f(N) \\ge c \\cdot g(N)$), while **Big-Theta ($\\Theta$)** provides a tight bound where $f(N)$ is sandwiched between $c_1 g(N)$ and $c_2 g(N)$. For recursive divide-and-conquer algorithms satisfying $T(N) = aT(N/b) + f(N)$, the **Master Theorem** analytically determines time complexity by comparing $f(N)$ against the critical exponent $N^{\\log_b a}$."
      },

      miss: [
        {
          w: "Big-O notation always represents the worst-case scenario of an algorithm.",
          r: "Big-O is a mathematical notation for an **upper bound** and can be applied to best-case, average-case, or worst-case scenarios. For example, QuickSort has a best-case time complexity of $\\mathcal{O}(N \\log N)$, an average-case of $\\mathcal{O}(N \\log N)$, and a worst-case of $\\mathcal{O}(N^2)$, all described using Big-O."
        },
        {
          w: "An $\\mathcal{O}(N)$ algorithm is always faster than an $\\mathcal{O}(N^2)$ algorithm for any dataset.",
          r: "Big-O describes asymptotic behavior as $N \\to \\infty$. For small inputs (e.g., $N < 50$), an $\\mathcal{O}(N^2)$ algorithm with a tiny constant factor (e.g., InsertionSort) is frequently faster in practice than an $\\mathcal{O}(N \\log N)$ algorithm with heavy allocation overhead (like MergeSort). Modern hybrid sorting engines (TimSort, IntroSort) exploit this by switching to InsertionSort for small arrays."
        },
        {
          w: "Time complexity measures the exact number of seconds a program will take to run.",
          r: "Time complexity measures the growth rate of **fundamental operations** (instruction cycles) relative to input size $N$, completely independent of physical time, CPU megahertz, or memory bus bandwidth."
        },
        {
          w: "If two algorithms have the same Big-O, they have identical real-world execution speed.",
          r: "Big-O suppresses constant multipliers and memory access patterns. An $\\mathcal{O}(N)$ traversal of a contiguous array will execute significantly faster than an $\\mathcal{O}(N)$ traversal of a linked list due to CPU L1/L2 cache prefetching and branch prediction."
        }
      ],

      trade: {
        buys: [
          "Hardware-agnostic scalability analysis: proves whether software will withstand $10\\times$ or $1000\\times$ user growth before deployment.",
          "Architectural bottleneck identification: isolates pathological $\\mathcal{O}(N^2)$ or $\\mathcal{O}(2^N)$ algorithmic loops before production release.",
          "Standardized technical communication: allows engineers to concisely convey computational cost and algorithmic trade-offs.",
          "Guides algorithmic selection: dictates whether to pick binary search, dynamic programming, or linear scans based on expected $N$."
        ],
        costs: [
          "Hides constant factors: suppresses coefficient $c$, potentially favoring algorithms that are slower for real-world input ranges.",
          "Ignores hardware memory hierarchy: fails to model CPU L1/L2/L3 cache misses, RAM bus latency, and SSD paging penalties.",
          "Average vs worst case mismatch: designing solely for average-case ($\mathcal{O}(1)$ hashing) leaves systems vulnerable to worst-case DOS attacks.",
          "Analysis overhead: deriving formal proofs for complex randomized or amortized algorithms requires high mathematical skill."
        ],
        avoid: [
          "Never write nested loops iterating over database queries or remote RPC calls, as this introduces lethal $\\mathcal{O}(N^2)$ network latencies.",
          "Do not optimize algorithmic Big-O on tiny datasets ($N < 100$) where code simplicity and cache locality matter far more.",
          "Avoid relying on average-case bounds in hard real-time or mission-critical systems; engineer for deterministic worst-case bounds.",
          "Never evaluate algorithm performance with synthetic benchmarks without verifying whether input data triggers worst-case pathological branches."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "space-complexity",

      why: {
        before: "Developers focused exclusively on optimizing runtime CPU cycles, frequently causing programs to crash with fatal Out-Of-Memory (OOM) errors because memory growth during execution went unmonitored and unmodeled.",
        problem: "Algorithms must operate within strict physical RAM constraints, requiring engineers to mathematically quantify auxiliary working memory and call-stack consumption as input size $N$ expands.",
        shift: "**Space Complexity: The total amount of memory space required by an algorithm to execute and complete as a function of the input size ($N$).** Comprising both input space and auxiliary (working) space, it determines whether an algorithm can run in-place or demands external memory scaling."
      },

      num: {
        t: "Space Complexity Profiles: Memory Allocations, Call Stacks & In-Place Behavior",
        h: ["Algorithm", "Input Space", "Auxiliary Space", "Call Stack Footprint", "In-Place Classification"],
        r: [
          ["Binary Search (Iterative)", "$\\mathcal{O}(N)$ (input array)", "$\\mathcal{O}(1)$ (two pointer indices)", "$\\mathcal{O}(1)$ (flat loop)", "Strictly in-place"],
          ["Binary Search (Recursive)", "$\\mathcal{O}(N)$ (input array)", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\log N)$ call frames", "Not in-place (stack overhead)"],
          ["MergeSort", "$\\mathcal{O}(N)$ (input array)", "$\\mathcal{O}(N)$ (temporary merge buffers)", "$\\mathcal{O}(\\log N)$ call frames", "Out-of-place (allocates extra array)"],
          ["QuickSort (Hoare / Lomuto)", "$\\mathcal{O}(N)$ (input array)", "$\\mathcal{O}(1)$ auxiliary memory", "$\\mathcal{O}(\\log N)$ avg; $\\mathcal{O}(N)$ worst stack", "In-place array rearrangement"],
          ["Breadth-First Search (BFS)", "$\\mathcal{O}(V + E)$ (graph)", "$\\mathcal{O}(V)$ (queue + visited set)", "$\\mathcal{O}(1)$ (iterative queue)", "Out-of-place"],
          ["Depth-First Search (DFS)", "$\\mathcal{O}(V + E)$ (graph)", "$\\mathcal{O}(V)$ (visited set)", "$\\mathcal{O}(V)$ call frames (worst tree depth)", "Out-of-place (stack overflow risk)"]
        ],
        n: "Space complexity separates total memory into **Input Space** (storage required for input data) and **Auxiliary Space** (extra temporary memory allocated during algorithm execution). Formally, an algorithm is classified as **in-place** if its auxiliary space is $\\mathcal{O}(1)$ (or $\\mathcal{O}(\\log N)$ for recursion stack pointers). Deep recursive algorithms must account for the call-stack: each recursive frame pushes parameters, local variables, and return instruction pointers to the thread execution stack ($1\\text{--}8$ MB default size). A naive recursive DFS on a linear degenerate tree of $100{,}000$ nodes allocates $100{,}000$ stack frames, triggering a fatal `StackOverflowError` regardless of available physical gigabytes of heap RAM."
      },

      miss: [
        {
          w: "Space complexity only measures the heap memory allocated with `malloc` or `new`.",
          r: "Space complexity encompasses **all** operational memory: heap allocations, static global memory, and critically, the **execution call stack** consumed by recursive function frames. Ignoring call stack depth frequently leads to fatal stack overflow crashes."
        },
        {
          w: "Auxiliary space and space complexity are identical terms.",
          r: "**Total space complexity** includes the memory needed to store the input data itself plus auxiliary space. **Auxiliary space** refers strictly to the *extra* temporary memory allocated by the algorithm to solve the problem beyond the input."
        },
        {
          w: "In-place algorithms never allocate any additional memory whatsoever.",
          r: "In-place algorithms can allocate a small, constant amount of auxiliary memory ($\mathcal{O}(1)$) for loop variables, pointers, and pivot values. In sorting literature, algorithms using $\\mathcal{O}(\\log N)$ stack space (like QuickSort) are still generally categorized as in-place."
        },
        {
          w: "Garbage collection in languages like Java/Go eliminates the need to worry about space complexity.",
          r: "Garbage collectors cannot reclaim memory that is still referenced. Holding large temporary data structures in scope, unbounded caching, or creating deep object graphs creates memory leaks and triggers severe garbage collector pause times (stop-the-world GC latency)."
        }
      ],

      trade: {
        buys: [
          "Guarantees memory predictability: prevents sudden Out-Of-Memory (OOM) fatal process terminations in containerized clouds (Kubernetes).",
          "Protects execution call stacks: avoids fatal stack overflows by enforcing tail-call optimization or iterative stacks.",
          "Enables embedded/edge computing: allows algorithms to run reliably on microcontrollers with constrained RAM (kilobytes).",
          "Cost containment: lower memory consumption directly reduces cloud VM instance sizing and infrastructure spend."
        ],
        costs: [
          "Time-space trade-off: in-place algorithms with $\\mathcal{O}(1)$ space often require more CPU cycles than algorithms using auxiliary tables.",
          "Increased code complexity: iterative implementations using explicit flat buffers are more complex to write than elegant recursive forms.",
          "Destructive in-place mutation: in-place algorithms often mutate input buffers, requiring defensive copying if callers need immutable data.",
          "Concurrency contention: mutating shared in-place arrays prevents lock-free read parallelism across multi-threaded workers."
        ],
        avoid: [
          "Never use deep recursion on unbounded user inputs without converting to an iterative loop or using trampolining/tail-call recursion.",
          "Do not allocate temporary collections inside hot loops; reuse pre-allocated working buffers to minimize GC pressure.",
          "Avoid using auxiliary hash sets or matrices for graph traversal if bitsets or bitmasks can represent the state in $1/64$th the memory.",
          "Never ignore call stack space when analyzing recursive algorithms; a balanced tree uses $\\mathcal{O}(\\log N)$ stack, but a degenerate tree uses $\\mathcal{O}(N)$."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "array",

      why: {
        before: "Variables were stored as isolated, individually named registers or dispersed memory addresses, making it impossible to iterate over collections or programmatically calculate element locations without writing separate instructions for every item.",
        problem: "Computer hardware requires an optimal mechanism to store a sequence of items in memory such that any arbitrary element can be read or modified in immediate constant time ($\\mathcal{O}(1)$).",
        shift: "**Array: A linear data structure that stores a collection of elements of identical type in contiguous memory locations.** By relying on pointer arithmetic where element address is computed as $\\text{Base} + i \\times \\text{Size}$, arrays provide instantaneous $\\mathcal{O}(1)$ random access and maximize CPU cache line prefetching."
      },

      num: {
        t: "Array Operations: Operational Complexities & Cache Behaviors",
        h: ["Array Operation", "Time Complexity", "Space Complexity", "Cache Line / Hardware Impact", "Primary Overhead Source"],
        r: [
          ["Random Index Access (`arr[i]`)", "$\\mathcal{O}(1)$ (instantaneous)", "$\\mathcal{O}(1)$", "Maximum L1 hit rate via spatial locality", "Single pointer addition and dereference"],
          ["Append (Dynamic Array)", "$\\mathcal{O}(1)$ amortized; $\\mathcal{O}(N)$ worst", "$\\mathcal{O}(1)$ auxiliary", "Sequential memory writes", "Reallocation and block memory copy when capacity exceeded"],
          ["Insert at Index $0$ (Prepend)", "$\\mathcal{O}(N)$ (linear time)", "$\\mathcal{O}(1)$ auxiliary", "Requires bulk shifting memory backwards", "`memmove` memory shifting of all $N$ elements"],
          ["Delete at Index $i$", "$\\mathcal{O}(N)$ (linear time)", "$\\mathcal{O}(1)$ auxiliary", "Shifts trailing elements left", "Bulk memory shift to close vacated index slot"],
          ["Linear Search (Unsorted)", "$\\mathcal{O}(N)$ (worst/avg)", "$\\mathcal{O}(1)$", "Prefetched sequentially via SIMD vectors", "Exhaustive equality checking across elements"],
          ["Binary Search (Sorted)", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(1)$", "Occasional L1/L2 cache misses on mid jumps", "Logarithmic comparison steps"]
        ],
        n: "The fundamental operational power of an array stems from **direct address arithmetic**: $\\text{Address}(A[i]) = \\text{BaseAddress} + (i \\times S)$, where $i$ is the zero-based index and $S$ is the element byte width (e.g., 4 bytes for 32-bit integers). This arithmetic allows the CPU to compute any location in a single clock cycle. Furthermore, because array elements are physically contiguous, loading $A[0]$ triggers the hardware cache controller to fetch the adjacent $64$ bytes into L1 data cache (spatial locality), making subsequent sequential reads take $\\approx 1$ ns rather than $\\approx 60\\text{--}100$ ns from main RAM. Dynamic arrays (e.g., `std::vector`, `ArrayList`, JS `Array`) maintain an internal capacity; when full, they allocate a new buffer of size $C_{\\text{new}} = \\gamma \\times C_{\\text{old}}$ (where $\\gamma \\in [1.5, 2.0]$) and copy elements across, mathematically bounding amortized append cost to $\\mathcal{O}(1)$."
      },

      miss: [
        {
          w: "JavaScript and Python arrays are stored as contiguous C-style memory blocks.",
          r: "In dynamic languages, 'arrays' are often dynamic arrays of **pointers/references** to boxed objects, or internal hash table representations. In Python, a `list` is an array of 8-byte pointer references to heap-allocated `PyObject`s, introducing pointer indirection and losing raw unboxed SIMD cache benefits (unless using `numpy.ndarray`)."
        },
        {
          w: "Arrays always have fixed capacity that can never change after creation.",
          r: "Fixed-size primitive arrays have static capacity, but modern standard libraries almost universally use **dynamic arrays** (resizing buffers) that automatically expand and shrink their backing storage dynamically while maintaining amortized constant-time append operations."
        },
        {
          w: "Deleting an element from an array is an $\\mathcal{O}(1)$ operation.",
          r: "Unless you are deleting from the very end of the array, deleting an element at index $i$ requires shifting all $N - i - 1$ subsequent elements one position to the left to maintain contiguous density, resulting in $\\mathcal{O}(N)$ time complexity."
        },
        {
          w: "Inserting at the end of a dynamic array is guaranteed to be $\\mathcal{O}(1)$ in the worst case.",
          r: "It is $\\mathcal{O}(1)$ **amortized**. In the worst case when the backing buffer is completely full, appending triggers a memory allocation and an $\\mathcal{O}(N)$ copy of all existing elements, causing a temporary latency spike."
        }
      ],

      trade: {
        buys: [
          "Instantaneous random access: $\\mathcal{O}(1)$ read and write at any index via direct pointer arithmetic.",
          "Hardware cache friendliness: contiguous memory layout maximizes CPU L1/L2 spatial locality and prefetching.",
          "Zero per-element memory overhead: stores pure data values without wasting bytes on node pointers or link metadata.",
          "SIMD vectorization: contiguous memory allows compilers to autovectorize loops using AVX-512/Neon instructions."
        ],
        costs: [
          "Linear insertion/deletion: inserting or removing elements in the middle requires shifting memory ($O(N)$).",
          "Dynamic resizing spikes: buffer resizing causes temporary $\\mathcal{O}(N)$ latency hiccups during memory copying.",
          "Contiguous allocation fragmentation: allocating massive arrays (e.g., 10 GB) requires large unbroken contiguous RAM blocks.",
          "Memory over-allocation: dynamic resizing leaves unused capacity buffer, consuming more memory than strictly needed."
        ],
        avoid: [
          "Never perform repeated `arr.unshift()` or insert at index 0 in a loop; this generates quadratic $\\mathcal{O}(N^2)$ memory shifts.",
          "Do not rely on naive dynamic resizing in high-frequency loops; pre-allocate capacity upfront with `vector.reserve(N)`.",
          "Avoid using generic object arrays for intensive numerical computation; use typed arrays (`Float64Array`, NumPy) to avoid pointer boxing.",
          "Never assume array lookups by value are fast without sorting; searching an unsorted array is always an exhaustive $\\mathcal{O}(N)$ scan."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "linked-list",

      why: {
        before: "Arrays required large, unbroken blocks of contiguous physical memory and suffered costly linear-time ($\\mathcal{O}(N)$) element shifting whenever items were inserted or deleted from the beginning or middle of a list.",
        problem: "Programs needed a dynamic sequential collection that could allocate individual nodes non-contiguously anywhere across heap memory and perform insertions and deletions in constant time ($\\mathcal{O}(1)$) without shifting surrounding elements.",
        shift: "**Linked List: A linear collection of data elements whose order is not given by their physical placement in memory, but by pointer links.** Each node contains a data payload and one or more reference pointers (`next`, `prev`) to adjacent nodes, trading random indexing access for constant-time local structural mutations."
      },

      num: {
        t: "Linked List Variations: Structural Topologies, Pointers & Complexities",
        h: ["Variation", "Pointers per Node", "Traversal Direction", "Head / Tail Insert", "Middle Insert (Known Node)", "Memory Overhead per Node"],
        r: [
          ["Singly Linked List", "1 (`next`)", "Unidirectional (Forward only)", "$\\mathcal{O}(1)$ (with tail pointer)", "$\\mathcal{O}(1)$ mutation", "$8$ bytes (on 64-bit architecture)"],
          ["Doubly Linked List", "2 (`next`, `prev`)", "Bidirectional (Forward and Backward)", "$\\mathcal{O}(1)$ both ends", "$\\mathcal{O}(1)$ arbitrary node deletion", "$16$ bytes (two 64-bit pointers)"],
          ["Circular Linked List", "1 or 2 (tail points to head)", "Continuous cyclic ring", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$", "$8\\text{--}16$ bytes (cyclic loop invariant)"],
          ["Skip List", "Variable ($1$ to $\\log N$ forward pointers)", "Multi-level probabilistic indexing", "$\\mathcal{O}(\\log N)$ average", "$\\mathcal{O}(\\log N)$ average", "$\\approx 1.33$ pointers avg (probabilistic)"],
          ["Unrolled Linked List", "1 pointer per node chunk", "Forward chunk traversal", "$\\mathcal{O}(1)$", "$\\mathcal{O}(B)$ (where $B$ is chunk size)", "Amortized across contiguous node array"]
        ],
        n: "In a singly linked list, each node is represented as `struct Node { T data; Node* next; }`. Inserting a node $X$ after node $A$ is an atomic pointer manipulation: `X->next = A->next; A->next = X;`, executing in strict $\\mathcal{O}(1)$ time without moving any memory. In a doubly linked list, deleting node $X$ requires updating adjacent pointers: `X->prev->next = X->next; X->next->prev = X->prev;`. However, because nodes are allocated independently on the heap via `malloc`, they are scattered arbitrarily across physical RAM addresses. Traversing a linked list requires dereferencing pointers sequentially, which repeatedly thrashes CPU data caches (L1/L2 misses) because hardware prefetchers cannot predict where the next node resides in RAM, rendering sequential traversals substantially slower than array scans."
      },

      miss: [
        {
          w: "Inserting an element into a linked list at index $k$ takes $\\mathcal{O}(1)$ time.",
          r: "The pointer rewiring itself is $\\mathcal{O}(1)$, but **reaching** index $k$ requires traversing $k$ pointer steps from the head node, making the overall insertion operation at index $k$ strictly $\\mathcal{O}(N)$."
        },
        {
          w: "Linked lists use less memory than dynamic arrays because they don't over-allocate capacity buffers.",
          r: "Linked lists have massive pointer metadata overhead. On a 64-bit operating system, a doubly linked list node storing a 4-byte integer requires two 8-byte pointers ($16$ bytes total pointer metadata) plus heap allocator padding ($8\\text{--}16$ bytes), using up to $32$ bytes to store just $4$ bytes of payload ($800\\%$ overhead)."
        },
        {
          w: "You can perform binary search on a sorted linked list in $\\mathcal{O}(\\log N)$ time.",
          r: "Binary search requires instant $\\mathcal{O}(1)$ access to the middle element. Because linked lists lack random index addressing, finding the middle element requires an $\\mathcal{O}(N)$ two-pointer traversal, forcing the total search complexity to $\\mathcal{O}(N)$."
        },
        {
          w: "Linked lists are always preferred over arrays when building Queues or Stacks.",
          r: "A circular dynamic array (ring buffer) or flat vector almost always outperforms a linked list for Queues and Stacks in real-world software due to superior CPU cache locality and zero heap allocation overhead per push/pop."
        }
      ],

      trade: {
        buys: [
          "Deterministic $\\mathcal{O}(1)$ insertion and deletion: rewires pointers instantly at known node locations without memory shifting.",
          "Non-contiguous memory allocation: dynamically utilizes fragmented heap memory without requiring large unbroken contiguous blocks.",
          "Stable memory references: node addresses remain permanent in memory; inserting or deleting adjacent items never invalidates existing pointers.",
          "Foundation for complex structures: serves as the internal structural wiring for LRU Caches, Adjacency Lists, and Hash Chaining."
        ],
        costs: [
          "Poor CPU cache locality: nodes dispersed across heap memory cause continuous L1/L2 cache misses during traversal.",
          "High memory overhead: allocates 8 to 16 bytes of pointer metadata per single data element on 64-bit systems.",
          "No random indexing: accessing element at index $i$ requires an $\\mathcal{O}(N)$ sequential pointer-chasing traversal.",
          "Heap allocator fragmentation: repeatedly allocating and freeing individual tiny node structs degrades OS heap memory managers."
        ],
        avoid: [
          "Never use a linked list simply because 'insertions are $\\mathcal{O}(1)$' without profiling against dynamic arrays like `std::vector`.",
          "Do not use standard linked lists in performance-sensitive game loops or numerical computing where cache misses cripple throughput.",
          "Avoid using linked lists if frequent random index access or binary search lookups are required.",
          "Never traverse a linked list without guarding against cyclic loops; use Floyd's Cycle-Finding Algorithm (Tortoise and Hare) if cyclic states are possible."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stack",

      why: {
        before: "Computing systems managed subroutine calls, expression parsing, and nested operations with ad-hoc memory labels and unstructured jumps (GOTO), leading to register corruption and impossible recursive branching.",
        problem: "Software architectures require a deterministic, restricted access structure that strictly enforces Last-In, First-Out (LIFO) semantics to manage nested contexts, call stacks, syntax evaluation, and backtracking.",
        shift: "**Stack: An abstract linear data structure that serves as a collection of elements, with two principal operations: `push` (which adds an element to the collection) and `pop` (which removes the most recently added element).** By formalizing the LIFO access discipline, stacks provide the mathematical execution model for programming language runtimes, call stacks, and parsing automata."
      },

      num: {
        t: "Stack Implementations: Array vs Linked List Backing Trade-offs",
        h: ["Implementation Mechanism", "Push Complexity", "Pop Complexity", "Peek / Top Complexity", "Memory Footprint", "Hardware Cache Behavior"],
        r: [
          ["Dynamic Array Backed", "$\\mathcal{O}(1)$ amortized", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$", "Low (contiguous buffer with capacity)", "Excellent (sequential cache lines)"],
          ["Static Fixed-Size Array", "$\\mathcal{O}(1)$ strict worst-case", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$", "Zero overhead (bounded stack)", "Peak performance (embedded systems)"],
          ["Singly Linked List Backed", "$\\mathcal{O}(1)$ strict worst-case", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$", "High ($8$ bytes pointer per node)", "Poor (heap cache misses per pop)"],
          ["Hardware Architecture Stack", "Single CPU cycle (`push` instruction)", "Single CPU cycle (`pop` instruction)", "$\\mathcal{O}(1)$ via RSP/ESP register", "Pre-allocated OS thread stack space", "Warm in CPU L1 data cache"],
          ["Monotonic Stack Pattern", "$\\mathcal{O}(N)$ across total sequence", "$\\mathcal{O}(1)$ amortized", "$\\mathcal{O}(1)$", "$\\mathcal{O}(N)$ bounded auxiliary space", "Cache friendly (vector backed)"]
        ],
        n: "A stack is formally defined by its **Last-In, First-Out (LIFO)** invariant: for any sequence of push operations, the next pop operation always retrieves the element added by the most recent un-popped push. At the hardware level, every operating system thread has an execution call stack managed by the CPU's **Stack Pointer Register** (e.g., `RSP` in x86-64). Calling a function executes a `CALL` instruction, which pushes the next instruction pointer (return address) onto the stack and decrements `RSP`. The function then pushes the base frame pointer (`RBP`) and allocates local stack variables. Returning executes `RET`, which pops the saved address back into the instruction pointer register (`RIP`). In software algorithms, stacks power **Shunting-Yard** expression parsing, balanced bracket verification, DFS graph traversals, and **Monotonic Stacks** for finding next greater elements in $\\mathcal{O}(N)$ time."
      },

      miss: [
        {
          w: "Stack overflow only happens when you have an infinite recursive loop.",
          r: "Stack overflow occurs whenever the execution stack exceeds its pre-allocated OS boundary (typically $1\\text{--}8$ MB). It can easily be triggered by **deep finite recursion** on large inputs (e.g., recursive traversal of an unbalanced $50{,}000$-node tree), or by allocating massive local stack arrays (`int buffer[10000000]`)."
        },
        {
          w: "A stack must be implemented as a linked list to avoid running out of memory.",
          r: "Implementing a stack with a dynamic array (`std::vector`, Python `list`) is virtually always faster and uses less total memory than a linked list. Resizing happens infrequently, and array-backed stacks avoid heap allocation overhead and pointer cache misses on every single push."
        },
        {
          w: "Stack memory and Heap memory in operating systems are completely separate physical hardware chips.",
          r: "Stack and Heap are merely two logical regions within the **same physical RAM virtual address space**. The OS stack grows downward from high memory addresses toward low memory, while the heap grows upward, both mapped to the exact same physical DRAM sticks."
        },
        {
          w: "You cannot inspect elements below the top of a stack.",
          r: "While the pure abstract mathematical ADT restricts access to `push`, `pop`, and `peek` at the top, concrete software implementations (like `std::stack` or custom buffers) frequently allow indexed inspection or debugging inspection of internal stack elements when necessary."
        }
      ],

      trade: {
        buys: [
          "Strict LIFO operational safety: enforces disciplined state entry and exit for function calls, transactions, and undo histories.",
          "Guaranteed $\\mathcal{O}(1)$ operations: push, pop, and peek execute in deterministic constant time at the top of the stack.",
          "Natural nested parsing: matches the recursive mathematical structure of context-free grammars, ASTs, and JSON/XML documents.",
          "Peak cache efficiency: stack memory is continuously referenced, ensuring stack frames remain warm in CPU L1 data cache."
        ],
        costs: [
          "No random access: accessing the $k$-th element requires popping and destroying all $k-1$ elements above it.",
          "Fixed memory boundaries: thread execution stacks have strict size limits, making them vulnerable to fatal stack overflow crashes.",
          "Restricted query capabilities: cannot search, sort, or range-query elements without draining the data structure.",
          "Reallocation latency spikes: array-backed stacks occasionally experience $\\mathcal{O}(N)$ latency hiccups when expanding buffer capacity."
        ],
        avoid: [
          "Never allocate massive multi-megabyte arrays on the thread stack; allocate large buffers on the heap instead.",
          "Do not write unbounded recursive algorithms on arbitrary user data; convert to an iterative loop using an explicit heap-allocated stack.",
          "Avoid using linked-list backed stacks in performance-critical code; use dynamic arrays or circular ring buffers.",
          "Never allow untrusted mathematical input strings into expression parsers without using a bounded stack to prevent memory exhaustion attacks."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
