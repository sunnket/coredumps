/* ==========================================================================
   Depth pass 110 — Computer Science Fundamentals batch 2: Linear & Hierarchical Structures.
   Queue, Set, Tree, Binary Tree,
   Binary Search Tree, Heap, Priority Queue.

   Ring-buffer circular topologies, self-balancing BST invariants (AVL/Red-Black),
   and implicit array-backed complete binary heaps power non-linear data processing.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "queue",

      why: {
        before: "Asynchronous task requests, print jobs, and network packets were handled with unstructured buffers or LIFO stacks, causing early requests to starve indefinitely while newer requests took unfair precedence.",
        problem: "Concurrent and distributed systems require a strictly fair, sequential buffer that processes incoming requests in the exact order they arrive without starvation.",
        shift: "**Queue: An abstract data structure that maintains an ordered collection of elements subject to First-In, First-Out (FIFO) semantics.** With two primary operations—`enqueue` (insert at rear) and `dequeue` (remove from front)—queues decouple asynchronous producers from consumers across operating system scheduling, messaging brokers, and breadth-first search."
      },

      num: {
        t: "Queue Implementations: Topologies, Concurrency & Operational Complexities",
        h: ["Implementation Topology", "Enqueue Complexity", "Dequeue Complexity", "Memory Footprint", "Cache Locality", "Primary Systems Use Case"],
        r: [
          ["Circular Array / Ring Buffer", "$\\mathcal{O}(1)$ strict", "$\\mathcal{O}(1)$ strict", "Pre-allocated fixed contiguous block", "Maximum (sequential cache lines)", "High-frequency trading, Linux kernel ring buffers"],
          ["Singly Linked List with Tail", "$\\mathcal{O}(1)$ strict", "$\\mathcal{O}(1)$ strict", "High ($8\\text{--}16$ bytes pointer per node)", "Poor (heap pointer chasing)", "Unbounded general-purpose dynamic queues"],
          ["Lock-Free SPSC Queue", "$\\mathcal{O}(1)$ wait-free", "$\\mathcal{O}(1)$ wait-free", "Fixed buffer with atomic head/tail indices", "Peak (cacheline padded to avoid false sharing)", "Disruptor pattern, audio processing threads"],
          ["Double-Ended Queue (Deque)", "$\\mathcal{O}(1)$ amortized both ends", "$\\mathcal{O}(1)$ amortized both ends", "Chunked arrays (e.g., `std::deque`)", "Good (contiguous block chunks)", "Work-stealing thread pools (Tokio, Go runtime)"],
          ["Blocking Queue", "$\\mathcal{O}(1)$ (blocks if full)", "$\\mathcal{O}(1)$ (blocks if empty)", "Thread synchronization primitives + buffer", "Moderate", "Thread-pool task submission (Java `LinkedBlockingQueue`)"]
        ],
        n: "A queue strictly enforces the **First-In, First-Out (FIFO)** property: the first element inserted is always the first element removed. Naive array implementations that dequeue by shifting all remaining elements left incur a fatal $\\mathcal{O}(N)$ performance penalty. Production systems universally implement queues using a **Circular Buffer (Ring Buffer)**: an array of fixed size $M$ with two pointers, `head` and `tail`. Enqueueing increments `tail = (tail + 1) % M`, and dequeueing increments `head = (head + 1) % M`, achieving true $\\mathcal{O}(1)$ worst-case execution without memory shifting. In concurrent systems, Martin Thompson's **LMAX Disruptor** avoids lock contention entirely by using circular ring buffers with single-writer lock-free memory barriers and cacheline padding (64 bytes) to prevent **false sharing** across CPU cores."
      },

      miss: [
        {
          w: "A Python `list` or JavaScript `Array` is an efficient queue when using `pop(0)` or `shift()`.",
          r: "Calling `list.pop(0)` in Python or `arr.shift()` in JavaScript on a flat dynamic array requires moving all remaining $N-1$ elements in memory one slot to the left, creating an $\\mathcal{O}(N)$ bottleneck that turns an $N$-element queue loop into a catastrophic $\\mathcal{O}(N^2)$ algorithm. Use Python's `collections.deque` instead."
        },
        {
          w: "Unbounded queues are always safer because they never reject incoming requests.",
          r: "Unbounded queues are one of the most common causes of catastrophic production outages. When consumer processing slows down or fails, an unbounded queue grows indefinitely in RAM until it triggers a fatal Out-Of-Memory (OOM) process crash. Production systems MUST use **bounded queues** with explicit backpressure or drop strategies (drop-tail, drop-head)."
        },
        {
          w: "A queue can only support insertion at the back and removal from the front.",
          r: "A **Double-Ended Queue (Deque)** allows $\\mathcal{O}(1)$ insertion and removal at *both* ends. Deques are the standard building block for work-stealing schedulers in concurrent runtimes (e.g., Go and Rust Tokio) where idle worker threads steal tasks from the opposite end of a busy thread's deque."
        },
        {
          w: "Circular ring buffers must always use the expensive modulo operator `%` on every operation.",
          r: "If the buffer capacity $M$ is restricted to an exact power of two ($M = 2^k$), the expensive modulo instruction can be replaced with a single-cycle bitwise AND operation: `index & (M - 1)`, providing a massive throughput boost in low-latency systems."
        }
      ],

      trade: {
        buys: [
          "Strict FIFO fairness: guarantees that tasks, transactions, and user requests are serviced in arrival order without starvation.",
          "Asynchronous decoupling: enables message-driven architectures by decoupling high-burst producers from steady-rate consumers.",
          "Deterministic bounded latency: circular ring buffers execute enqueue and dequeue in single-digit nanoseconds with zero memory allocation.",
          "Algorithmic foundation: powers level-order graph and tree traversals (Breadth-First Search) in $\\mathcal{O}(V+E)$ time."
        ],
        costs: [
          "No random access: inspecting or mutating items in the middle of a queue requires draining all preceding elements.",
          "Head-of-Line (HoL) blocking: a single slow or stuck task at the head of the queue delays all subsequent healthy tasks behind it.",
          "Backpressure management: bounded queues require complex policies (reject, drop, block) when incoming traffic outpaces consumers.",
          "Memory-latency trade-offs: dynamic linked-node queues suffer pointer memory bloat and CPU cache misses under heavy throughput."
        ],
        avoid: [
          "Never use `pop(0)` on a Python list or `shift()` on a JavaScript array inside high-throughput queue loops; use `collections.deque`.",
          "Do not deploy unbounded queues in production without backpressure monitoring and memory circuit breakers.",
          "Avoid sharing a queue across multiple threads without verifying whether it is thread-safe or lock-free.",
          "Never ignore Head-of-Line blocking in multi-tenant architectures; partition queues by tenant or priority."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "set",

      why: {
        before: "Checking whether an element already existed in a collection required scanning an array linearly ($\\mathcal{O}(N)$), causing deduplication and membership testing on large datasets to degrade quadratically ($\\mathcal{O}(N^2)$).",
        problem: "Software requires an abstract mathematical collection that guarantees unique elements and answers membership queries ('does $x$ exist?') in instantaneous constant time ($\\mathcal{O}(1)$).",
        shift: "**Set: An abstract data structure that stores a collection of unique, unordered elements modeled after mathematical set theory.** Typically backed by a Hash Table (HashSet) or Balanced Binary Search Tree (TreeSet), sets provide high-speed membership testing, deduplication, union, intersection, and difference operations."
      },

      num: {
        t: "Set Implementations: Hash Set vs Tree Set vs Bit Set",
        h: ["Implementation Type", "Underlying Structure", "Membership Test ($x \\in S$)", "Ordered Iteration", "Set Operations ($\\cap, \\cup$)", "Memory Overhead per Element"],
        r: [
          ["Hash Set (`HashSet`)", "Hash table (open addressing / chaining)", "$\\mathcal{O}(1)$ average; $\\mathcal{O}(N)$ worst collision", "No (unspecified hash order)", "$\\mathcal{O}(|A| + |B|)$ linear time", "Moderate (bucket array + hash values)"],
          ["Tree Set (`TreeSet`)", "Self-balancing BST (Red-Black / AVL)", "$\\mathcal{O}(\\log N)$ strict worst-case", "Yes (strictly sorted order)", "$\\mathcal{O}(|A| + |B|)$ sorted merge", "High ($16\\text{--}24$ bytes tree pointers per node)"],
          ["Bit Set / Bit Array", "Bitpacked integer array (`uint64_t[]`)", "$\\mathcal{O}(1)$ bitwise mask shift", "Yes (ordered by integer domain)", "Instant bitwise AND/OR ($\\|A\\|/64$ instructions)", "Extremely low ($1$ bit per domain integer)"],
          ["Bloom Filter (Probabilistic)", "Bit array with $k$ independent hash functions", "$\\mathcal{O}(k)$ (Zero False Negatives, False Positives possible)", "No", "Bitwise AND/OR across identical filters", "Minimal ($1\\text{--}2$ bytes per element for $<1\\%$ error)"],
          ["Trie Set (Prefix Set)", "Radix tree / prefix tree", "$\\mathcal{O}(L)$ (where $L$ is key string length)", "Yes (lexicographical prefix order)", "Subtree intersection", "High pointer overhead per character"]
        ],
        n: "A mathematical set is characterized by the axiom of extensionality: two sets are equal if and only if they have the exact same elements, and duplicate elements are strictly excluded ($|\\{A, A, B\\}| = 2$). In computer systems, the **HashSet** is implemented as a hash map where elements serve as keys and values are empty sentinel placeholders (`void` or `struct{}`). An element $x$ is hashed: bucket index $i = h(x) \\pmod M$. If the bucket is empty, $x \\notin S$; otherwise, the collision chain or open-addressed probe sequence is scanned using equality checks ($==$). For integer universes with known bounded range $[0, U]$, a **BitSet** maps element $k$ to the $k$-th bit of a compact array of 64-bit integers: `(words[k / 64] >> (k % 64)) & 1`. Set union and intersection reduce to single-cycle CPU SIMD instructions: `words_union[i] = A[i] | B[i]` and `words_intersection[i] = A[i] & B[i]`."
      },

      miss: [
        {
          w: "Sets preserve the insertion order of elements by default.",
          r: "Standard mathematical sets and primitive `HashSet`s have **no defined order**. Elements are placed in buckets dictated by their internal hash code, which can rearrange completely upon dynamic table resizing. In languages like JavaScript or Python ($3.7+$), dictionaries and `Set` maintain an internal doubly-linked insertion order list, but this is an extra language-specific feature, not an inherent set property."
        },
        {
          w: "You can store mutable objects in a HashSet safely.",
          r: "Storing mutable objects in a HashSet is a notorious bug vector. If an object is inserted into a HashSet and then mutated in-place such that its hash code changes, the HashSet can no longer locate the object in its original bucket. The object becomes an unreachable 'ghost' element that cannot be found via `contains()` or removed, causing silent data corruption and memory leaks."
        },
        {
          w: "Checking membership in a HashSet is guaranteed to be $\\mathcal{O}(1)$ in all conditions.",
          r: "It is $\\mathcal{O}(1)$ **on average**. In the worst case where an attacker crafts malicious keys that deliberately cause hash collisions (HashDoS attack), all elements hash to the same bucket, degrading membership checks to an $\\mathcal{O}(N)$ linear scan."
        },
        {
          w: "Set operations like Union and Intersection are always $\\mathcal{O}(1)$ constant time.",
          r: "Set union ($A \\cup B$) and intersection ($A \\cap B$) require inspecting elements, scaling as $\\mathcal{O}(|A| + |B|)$ in general HashSets. They only achieve sub-linear speed in specialized hardware-accelerated BitSets."
        }
      ],

      trade: {
        buys: [
          "Instantaneous membership queries: answers `x in S` in $\\mathcal{O}(1)$ average time, eliminating quadratic lookup bottlenecks.",
          "Automatic deduplication: enforces unique data constraints by construction without requiring manual scanning.",
          "Mathematical relational operations: provides expressive set algebra (union, intersection, symmetric difference, subset testing).",
          "Ultra-compact bitpacking: integer BitSets compress massive membership flags into 1 bit per element with SIMD speed."
        ],
        costs: [
          "Hash table memory overhead: requires excess bucket capacity (load factors typically $0.70$) to minimize collision clustering.",
          "Loss of sequential indexing: standard sets cannot be indexed by position (`set[0]` is invalid).",
          "Hash function dependency: requires well-distributed, non-cryptographic hash functions (`xxHash`, `Murmur3`) to avoid clustering.",
          "Mutable key corruption risk: mutating objects after set insertion breaks internal hash invariants irreparably."
        ],
        avoid: [
          "Never insert mutable objects into a set if their properties will be modified while stored inside the set.",
          "Do not perform repeated array linear scans (`arr.includes(x)`) inside loops; convert the array to a `Set` upfront.",
          "Avoid using standard HashSets for dense integer flags in high-performance engines; use BitSets (`std::bitset`, `BitArray`).",
          "Never assume elements in a standard HashSet will iterate in a predictable order across different program runs or runtimes."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tree",

      why: {
        before: "Linear data structures (arrays, linked lists) forced developers into a zero-sum trade-off: arrays offered $\\mathcal{O}(1)$ access but slow $\\mathcal{O}(N)$ insertion, while linked lists offered fast local insertion but slow $\\mathcal{O}(N)$ sequential access.",
        problem: "Applications dealing with hierarchical relationships (file systems, organizational charts, DOM trees, database indexes) need a non-linear structure that represents parent-child relationships while enabling logarithmic search and insertion.",
        shift: "**Tree: A non-linear, hierarchical data structure consisting of nodes connected by directed edges, with a single designated root node and no cycles.** As a connected acyclic graph with $N$ vertices and $N-1$ edges, trees provide the structural architecture for nested abstractions, syntax parsing, and balanced storage."
      },

      num: {
        t: "Tree Topologies: Branching Factors, Depth & Operational Uses",
        h: ["Tree Classification", "Branching Factor ($k$)", "Height Guarantee ($h$)", "Traversal Algorithms", "Production Systems Usage"],
        r: [
          ["General Tree (N-ary)", "Arbitrary $k$ children per node", "Unbounded (up to $N-1$)", "Pre-order, Post-order, Level-order", "DOM tree in web browsers, JSON/XML object models"],
          ["Binary Tree", "At most $2$ children per node", "Unbounded without balancing", "In-order, Pre-order, Post-order, Morris", "Expression evaluation trees, Huffman coding"],
          ["B-Tree / B+ Tree", "High branching factor ($k = 100\\text{--}1000$)", "Strictly balanced $\\mathcal{O}(\\log_B N)$", "Sequential leaf scans (B+ Tree)", "Database storage engines (PostgreSQL, MySQL InnoDB)"],
          ["Trie (Prefix Tree)", "Alphabet size $\\Sigma$ (e.g., 26 or 256)", "Bounded by key length $L$", "Depth-first prefix search", "Autocomplete search engines, IP routing (longest prefix)"],
          ["Spanning Tree", "Varies (undirected connected tree)", "Minimal edges ($V-1$)", "BFS / DFS traversal", "Network switching (Spanning Tree Protocol), cable routing"]
        ],
        n: "Mathematically, a tree is an undirected connected graph $G = (V, E)$ containing zero simple cycles, with exactly $|E| = |V| - 1$. In computer science, trees are usually **rooted directed trees** where edges flow from a unique root node $R$ to child nodes. Key formal properties include: (1) **Depth** of node $v$ is the number of edges from the root to $v$, (2) **Height** of node $v$ is the maximum number of edges on a path from $v$ to a leaf, (3) **Height of Tree** is the height of the root. The structural efficiency of all tree algorithms is bounded by tree height $h$: searching, inserting, and deleting operations scale as $\\mathcal{O}(h)$. In an ideally balanced tree with branching factor $k$, height is logarithmic: $h = \\lceil \\log_k N \\rceil$. In contrast, an unconstrained general tree can degenerate into a linear chain where $h = N - 1$, degrading all operations to linear time $\\mathcal{O}(N)$."
      },

      miss: [
        {
          w: "A tree can contain cyclic loops between nodes.",
          r: "By definition, a tree is an **acyclic** graph. If a graph contains even a single cycle or loop, it ceases to be a tree and becomes a general graph. If nodes have multiple parents, it is a Directed Acyclic Graph (DAG), not a tree."
        },
        {
          w: "All tree operations are guaranteed to be logarithmic ($\\mathcal{O}(\\log N)$).",
          r: "Tree operations scale with tree **height** $h$, not $\\log N$. In an unbalanced or degenerate tree where every node has only one child, height $h = N$, making searches, insertions, and deletions $\\mathcal{O}(N)$ linear operations. Only self-balancing trees guarantee $\\mathcal{O}(\\log N)$ operations."
        },
        {
          w: "Depth and height of a node are the same metric.",
          r: "**Depth** is measured **top-down**: the number of edges from the root down to the node (the root has depth 0). **Height** is measured **bottom-up**: the number of edges on the longest path from the node down to its deepest leaf (leaves have height 0)."
        },
        {
          w: "Recursive tree traversal never causes performance or stability issues.",
          r: "Recursive tree traversal allocates one execution stack frame per unit of height. On deeply skewed trees with height $h > 50{,}000$, standard recursive traversals trigger fatal `StackOverflowError` exceptions. Production tree algorithms use iterative traversals with explicit heap stacks or **Morris Traversal** (which uses threaded null pointers to achieve $\\mathcal{O}(1)$ space)."
        }
      ],

      trade: {
        buys: [
          "Natural hierarchical representation: intuitively models nested relationships (file directories, HTML DOM, AST syntax trees).",
          "Logarithmic scaling potential: balanced trees execute search, insertion, and deletion in $\\mathcal{O}(\\log N)$ steps.",
          "Dynamic size flexibility: allocates nodes dynamically on demand without requiring massive contiguous RAM blocks.",
          "Efficient prefix and range searching: enables ordered scans, successor finding, and prefix matching (Tries, B-Trees)."
        ],
        costs: [
          "Pointer memory overhead: stores multiple child pointers per node ($16\\text{--}32+$ bytes overhead per node).",
          "Poor cache locality: nodes allocated separately across heap memory trigger continuous CPU cache misses during traversal.",
          "Balancing complexity: maintaining balance invariants (AVL rotations, Red-Black color flips) requires complex, error-prone code.",
          "Call stack overflow risk: deep, unbalanced trees can easily blow out thread execution call stacks during recursive operations."
        ],
        avoid: [
          "Never write naive recursive tree traversals on untrusted user-generated trees without guarding against stack overflows.",
          "Do not use binary trees for disk-based storage engines; use B-Trees with high branching factors to minimize disk I/O seeks.",
          "Avoid maintaining trees in memory if a flat contiguous array with parent-child index arithmetic can represent the data (e.g., Heaps).",
          "Never assume an unbalanced tree will maintain $\\mathcal{O}(\\log N)$ performance in production under adversarial sorted insertions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "binary-tree",

      why: {
        before: "General trees allowed an unbounded number of children per node, requiring nodes to store dynamic arrays or linked lists of child pointers, adding heavy memory overhead and complicating traversal logic.",
        problem: "Algorithms need a standardized, minimal branching topology where every decision is binary (left vs right), enabling elegant divide-and-conquer processing, expression trees, and compact memory layouts.",
        shift: "**Binary Tree: A tree data structure in which each node has at most two children, referred to as the left child and the right child.** Serving as the universal foundation for search trees, heaps, and decision algorithms, binary trees restrict branching to a disciplined recursive duality."
      },

      num: {
        t: "Binary Tree Classifications: Structural Invariants & Properties",
        h: ["Binary Tree Type", "Structural Invariant", "Height ($h$) vs Nodes ($N$)", "Leaf Node Count ($L$)", "Array Representable without Gaps"],
        r: [
          ["Full (Proper / Strict)", "Every node has exactly $0$ or $2$ children (no 1-child nodes)", "$\\log_2(N+1) \\le h \\le (N-1)/2$", "$L = \\text{internal nodes} + 1$", "No (has structural gaps)"],
          ["Complete Binary Tree", "All levels filled completely except possibly the last (filled left-to-right)", "Strictly $h = \\lfloor \\log_2 N \\rfloor$", "$\\lceil N / 2 \\rceil$", "Yes (perfect flat array mapping: $2i+1, 2i+2$)"],
          ["Perfect Binary Tree", "All interior nodes have 2 children; all leaves at same depth", "Strictly $N = 2^{h+1} - 1$", "$L = 2^h = (N+1)/2$", "Yes (perfect dense array)"],
          ["Degenerate (Skewed)", "Every internal node has exactly one child (linear chain)", "$h = N - 1$ (worst-case)", "$L = 1$", "No (astronomical wasted array space)"],
          ["Balanced Binary Tree", "Height of left and right subtrees differs by at most 1 (AVL condition)", "$h = \\mathcal{O}(\\log_2 N)$", "Proportional to $N/2$", "No (pointer-linked)"]
        ],
        n: "A binary tree is formally defined as a finite set of nodes that is either empty or consists of a root node $r$ and two disjoint binary trees, $T_{\\text{left}}$ and $T_{\\text{right}}$. In a binary tree of height $h$, the maximum number of nodes at level $i$ is $2^i$, and the maximum total nodes is $\\sum_{i=0}^h 2^i = 2^{h+1} - 1$. Tree traversals visit every node in $\\mathcal{O}(N)$ time across four classic orders: (1) **Pre-order** (Root, Left, Right) for cloning and serializing trees, (2) **In-order** (Left, Root, Right) which traverses Binary Search Trees in non-decreasing sorted order, (3) **Post-order** (Left, Right, Root) for bottom-up deletion and expression evaluation, and (4) **Level-order** (Breadth-First Search using a queue). For complete binary trees, nodes can be stored without any pointers in a flat array where the children of node at index $i$ reside at $2i + 1$ and $2i + 2$, and its parent resides at $\\lfloor (i - 1)/2 \\rfloor$."
      },

      miss: [
        {
          w: "A Binary Tree and a Binary Search Tree (BST) are the exact same thing.",
          r: "A **Binary Tree** only enforces that each node has at most two children, with no rules governing the values inside the nodes. A **Binary Search Tree** enforces the strict ordering invariant: all values in the left subtree must be less than the node, and all values in the right subtree must be greater."
        },
        {
          w: "A complete binary tree and a full binary tree mean the same thing.",
          r: "A **Full** binary tree requires that every node has either 0 or 2 children. A **Complete** binary tree requires that all levels are completely full except the last, which must be filled strictly from left to right. A tree can be full without being complete, and complete without being full."
        },
        {
          w: "Binary trees can only be stored in memory using pointer-linked node objects.",
          r: "**Complete binary trees** (like Binary Heaps) are stored in flat, contiguous memory arrays without a single pointer. Children and parent addresses are calculated in a single CPU cycle via bit shifts and index arithmetic ($2i + 1, 2i + 2$)."
        },
        {
          w: "Traversing a binary tree always requires $\\mathcal{O}(N)$ auxiliary memory for the call stack.",
          r: "While standard recursive traversals use $\\mathcal{O}(h)$ call stack memory, **Morris In-order Traversal** achieves $\\mathcal{O}(N)$ time with strictly **$\\mathcal{O}(1)$ auxiliary space** by temporarily establishing and removing threaded pointers in empty right-child slots."
        }
      ],

      trade: {
        buys: [
          "Disciplined binary branching: simplifies decision algorithms, arithmetic parsing, and hierarchical data processing.",
          "Foundation for balanced search: forms the baseline architecture for AVL trees, Red-Black trees, and Splay trees.",
          "Pointerless array storage: complete binary trees map directly to contiguous memory without pointer overhead (Binary Heaps).",
          "Optimal prefix coding: powers Huffman encoding trees to achieve lossless compression bounds."
        ],
        costs: [
          "Degeneration vulnerability: unconstrained insertion can cause height to collapse to $h = N$, degrading lookups to linear scans.",
          "Pointer bloat: standard pointer-based binary nodes require two 8-byte pointers (16 bytes) per node on 64-bit systems.",
          "Cache thrashing: linked node representations disperse memory across the heap, triggering frequent CPU cache misses.",
          "Rebalancing complexity: maintaining logarithmic height guarantees requires complex rotational rebalancing algorithms."
        ],
        avoid: [
          "Never assume a generic binary tree is balanced; verify balance invariants before assuming $\\mathcal{O}(\\log N)$ operations.",
          "Do not use pointer-based binary trees when building Priority Queues; use array-backed complete binary heaps.",
          "Avoid using deep recursion to traverse binary trees in languages without tail-call optimization if height is untrusted.",
          "Never serialize binary trees without recording null pointer markers or utilizing both in-order and pre-order traversal arrays to reconstruct topology."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "binary-search-tree",

      why: {
        before: "Unsorted arrays required $\\mathcal{O}(N)$ time to search, while sorted arrays required costly $\\mathcal{O}(N)$ memory shifts to insert or delete elements, making dynamic sorted collections inefficient.",
        problem: "Applications need a dynamic data structure that maintains sorted order while performing search, insertion, and deletion in logarithmic time ($\\mathcal{O}(\\log N)$).",
        shift: "**Binary Search Tree (BST): A node-based binary tree data structure which has the key invariant that the key in each node must be greater than or equal to any key stored in its left sub-tree, and less than or equal to any key in its right sub-tree.** By pruning half of the search space at each step, BSTs combine the dynamic flexibility of linked lists with the rapid searching of sorted arrays."
      },

      num: {
        t: "BST Variants: Balancing Mechanisms, Rotations & Asymptotic Bounds",
        h: ["BST Architecture", "Balancing Mechanism", "Search / Insert (Avg)", "Search / Insert (Worst)", "Rotations on Insert", "Primary Real-World Use Case"],
        r: [
          ["Naive Unbalanced BST", "None (order dictated by insertion sequence)", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(N)$ (degraded chain)", "Zero", "Prototyping, small randomized keys"],
          ["AVL Tree", "Strict balance: $\\|h_L - h_R\\| \\le 1$ at every node", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\log N)$ strict", "At most 2 rotations", "Lookup-intensive read-heavy workloads"],
          ["Red-Black Tree", "Relaxed balance: node coloring rules, max height $2\\log_2(N+1)$", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\log N)$ strict", "At most 2 rotations", "C++ `std::map`, Java `TreeMap`, Linux CFS scheduler"],
          ["Splay Tree", "Self-adjusting: splays accessed node to root", "$\\mathcal{O}(\\log N)$ amortized", "$\\mathcal{O}(N)$ single op", "Multiple zig-zig / zig-zag", "LRU caches, network packet routing tables"],
          ["Treap (Cartesian Tree)", "Randomized priority assigned to each key (Heap invariant)", "$\\mathcal{O}(\\log N)$ expected", "$\\mathcal{O}(N)$ with probability $\\to 0$", "Rotations maintain heap order", "Rope data structures, randomized sets"]
        ],
        n: "The defining invariant of a Binary Search Tree states: for any node $x$, if $y$ is a node in the left subtree of $x$, then $y.\\text{key} \\le x.\\text{key}$; if $y$ is in the right subtree, then $y.\\text{key} \\ge x.\\text{key}$. An **In-order Traversal** of a BST visits nodes in strictly non-decreasing sorted order in $\\mathcal{O}(N)$ time. Searching compares key $k$ with root: if $k < \\text{root}$, recurse left; if $k > \\text{root}$, recurse right, pruning half the remaining tree at each step. However, if keys are inserted in pre-sorted order ($1, 2, 3, 4, 5$), a naive BST degrades into a linear linked list with height $h = N$, where searching takes $\\mathcal{O}(N)$ time. Self-balancing extensions (**AVL Trees**, **Red-Black Trees**) eliminate this flaw by executing **tree rotations** (left and right rotations) during insertion and deletion to enforce balance invariants, guaranteeing $h = \\mathcal{O}(\\log N)$ worst-case."
      },

      miss: [
        {
          w: "A standard Binary Search Tree always guarantees $\\mathcal{O}(\\log N)$ search time.",
          r: "Only **balanced** BSTs guarantee $\\mathcal{O}(\\log N)$. A naive BST's performance is entirely dependent on insertion order. Inserting already-sorted or reverse-sorted data causes the tree to degenerate into a linear chain of height $N$, degrading search, insertion, and deletion to $\\mathcal{O}(N)$."
        },
        {
          w: "Deleting a node with two children from a BST is simple and does not affect tree structure.",
          r: "Deleting a node with two children requires finding its **in-order successor** (the smallest key in its right subtree) or **in-order predecessor** (largest key in left subtree), swapping their keys, and then deleting the successor node (which is guaranteed to have at most one child)."
        },
        {
          w: "AVL trees are always better than Red-Black trees because they are more strictly balanced.",
          r: "AVL trees are more rigidly balanced (height $\\approx 1.44 \\log_2 N$), making lookups slightly faster. However, this rigidity requires more frequent and expensive rotations on insertions and deletions. **Red-Black trees** (height $\\le 2 \\log_2(N+1)$) allow slightly looser balance, resulting in faster insertions and deletions, which is why standard libraries (C++ `std::map`, Java `TreeMap`) use Red-Black trees."
        },
        {
          w: "Hash tables make Binary Search Trees completely obsolete.",
          r: "Hash tables provide unordered point lookups. They cannot find minimum/maximum keys, find the closest predecessor or successor, or perform range queries (`SELECT WHERE key BETWEEN 10 AND 50`) in $\\mathcal{O}(\\log N + K)$ time. Balanced BSTs excel at ordered dynamic data retrieval."
        }
      ],

      trade: {
        buys: [
          "Dynamic sorted maintenance: elements remain continuously sorted without requiring expensive full-array re-sorting.",
          "Logarithmic range queries: quickly extracts all keys within interval $[k_1, k_2]$ in $\\mathcal{O}(\\log N + K)$ time.",
          "Efficient predecessor / successor queries: finds the next smallest or largest item in guaranteed $\\mathcal{O}(\\log N)$ time.",
          "Worst-case predictability: balanced variants (Red-Black, AVL) provide guaranteed $\\mathcal{O}(\\log N)$ bounds immune to hash collisions."
        ],
        costs: [
          "Degeneration hazard: naive BSTs degrade to $\\mathcal{O}(N)$ if inputs arrive sorted, requiring complex balancing code.",
          "Pointer overhead: stores left, right, and often parent pointers ($16\\text{--}24$ bytes metadata per node).",
          "Poor cache locality: non-contiguous heap nodes cause CPU cache misses on every branch traversal.",
          "Rebalancing execution overhead: AVL/Red-Black tree rotations and color adjustments slow down raw insertion throughput."
        ],
        avoid: [
          "Never use a naive unbalanced BST in production when input data can be sorted or adversary-controlled; use Red-Black or AVL trees.",
          "Do not use a BST when only simple point lookups are needed without ordered queries; use a Hash Map.",
          "Avoid implementing custom tree rotation rebalancing logic from scratch in production; use standard library map/set containers.",
          "Never perform recursive BST lookups in environments with constrained call stacks without converting to an iterative `while` loop."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "heap",

      why: {
        before: "Finding and extracting the maximum or minimum element from a collection required either keeping an array sorted ($\\mathcal{O}(N)$ insertion time) or scanning an unsorted array ($\\mathcal{O}(N)$ search time).",
        problem: "Priority schedulers, graph algorithms (Dijkstra, Prim), and sorting engines require an optimized structure that retrieves the extremum (min or max) in instantaneous $\\mathcal{O}(1)$ time and inserts new items in logarithmic $\\mathcal{O}(\\log N)$ time.",
        shift: "**Heap: A specialized tree-based data structure that satisfies the heap property: in a max-heap, for any given node $C$, if $P$ is a parent node of $C$, then the key of $P$ is greater than or equal to the key of $C$; in a min-heap, the parent is less than or equal to the child.** Typically implemented as an array-backed complete binary tree, heaps eliminate pointer overhead entirely."
      },

      num: {
        t: "Heap Architectures: Operations, Complexities & Memory Layouts",
        h: ["Heap Architecture", "Peek Min/Max", "Insert Key", "Extract Min/Max", "Build Heap (`heapify`)", "Memory Backing Format"],
        r: [
          ["Binary Heap (Min/Max)", "$\\mathcal{O}(1)$", "$\\mathcal{O}(\\log N)$ (bubble up)", "$\\mathcal{O}(\\log N)$ (bubble down)", "$\\mathcal{O}(N)$ linear time", "Flat contiguous dynamic array"],
          ["d-ary Heap (e.g., 4-ary)", "$\\mathcal{O}(1)$", "$\\mathcal{O}(\\log_d N)$ (faster insert)", "$\\mathcal{O}(d \\log_d N)$", "$\\mathcal{O}(N)$ linear time", "Flat array (optimized for CPU cache lines)"],
          ["Binomial Heap", "$\\mathcal{O}(1)$ (with min pointer)", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(N)$", "Forest of binomial trees (pointer-based)"],
          ["Fibonacci Heap", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$ amortized", "$\\mathcal{O}(\\log N)$ amortized", "$\\mathcal{O}(1)$ meld", "Circular doubly-linked node trees"],
          ["Pairing Heap", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$", "$\\mathcal{O}(\\log N)$ amortized", "$\\mathcal{O}(1)$ meld", "Self-adjusting pointer tree"]
        ],
        n: "A **Binary Heap** is a complete binary tree that maintains the heap invariant. Because it is a complete binary tree, it is stored in a flat array $A$ without any pointers: the root is at $A[0]$, the left child of $A[i]$ is at $A[2i + 1]$, the right child is at $A[2i + 2]$, and the parent is at $A[\\lfloor (i - 1)/2 \\rfloor]$. **Insertion** appends the new element to the end of the array and executes `sift_up` (swapping with its parent while the heap invariant is violated), taking $\\mathcal{O}(\\log N)$ time. **Extraction** swaps the root with the last array element, pops the last element, and executes `sift_down` (swapping the root with its smaller/larger child until restored), taking $\\mathcal{O}(\\log N)$. Crucially, building a heap from an arbitrary array of $N$ unsorted elements using Floyd's bottom-up `build_heap` algorithm takes strictly **$\\mathcal{O}(N)$ linear time** (not $\\mathcal{O}(N \\log N)$), because the sum of heights across all nodes converges: $\\sum_{h=0}^{\\infty} \\frac{h}{2^h} = 2$."
      },

      miss: [
        {
          w: "Building a heap of $N$ elements takes $\\mathcal{O}(N \\log N)$ time.",
          r: "Inserting $N$ elements one by one takes $\\mathcal{O}(N \\log N)$. However, Floyd's bottom-up **`build_heap` (or `heapify`) algorithm** starts at the lowest non-leaf nodes and sifts downwards, running in strictly **$\\mathcal{O}(N)$ linear time** because the vast majority of nodes reside near the bottom of the tree where heights are tiny ($h=0, 1$)."
        },
        {
          w: "A heap can be used to search for an arbitrary element in $\\mathcal{O}(\\log N)$ time.",
          r: "A heap only guarantees the ordering relationship between parents and children; it enforces **zero ordering between left and right siblings**. Finding an arbitrary key in a binary heap requires an exhaustive $\\mathcal{O}(N)$ linear scan across the entire backing array."
        },
        {
          w: "Fibonacci heaps are always used in production because of their theoretical $\\mathcal{O}(1)$ insert and decrease-key.",
          r: "While Fibonacci heaps achieve superior theoretical asymptotic bounds, their complex pointer structures, high per-node memory overhead, and massive constant factors make them significantly slower in practice than standard 4-ary or binary heaps on modern cached CPU hardware."
        },
        {
          w: "A heap requires complex pointer manipulation and node object allocations.",
          r: "A standard binary heap uses **zero pointers and zero dynamic node objects**. It resides inside a simple flat contiguous dynamic array (`std::vector` or Python `list`), utilizing fast CPU index arithmetic."
        }
      ],

      trade: {
        buys: [
          "Instantaneous extremum access: retrieves the minimum or maximum element in strict $\\mathcal{O}(1)$ time.",
          "Efficient dynamic updates: inserts and extracts elements in guaranteed $\\mathcal{O}(\\log N)$ logarithmic time.",
          "Zero pointer memory overhead: flat array representation eliminates node pointers, saving $16\\text{--}24$ bytes per element.",
          "Linear build time: transforms any raw, unsorted $N$-element array into a valid heap in $\\mathcal{O}(N)$ linear time."
        ],
        costs: [
          "Linear arbitrary search: finding any element other than the root requires an exhaustive $\\mathcal{O}(N)$ scan.",
          "Slow decrease-key in flat arrays: updating a priority requires finding the item first ($\\mathcal{O}(N)$ unless augmented with an index hash map).",
          "Unstable sorting: HeapSort is inherently unstable, meaning elements with equal keys can swap relative positions.",
          "Cache degradation on deep sifts: traversing down a massive heap array jumps exponentially ($2i+1$), causing L1/L2 cache misses."
        ],
        avoid: [
          "Never build a heap by calling `heappush()` $N$ times in a loop; use `heapify()` to achieve $\\mathcal{O}(N)$ rather than $\\mathcal{O}(N \\log N)$.",
          "Do not use a heap if you need to perform frequent arbitrary lookups or range queries; use a Balanced BST or Hash Map.",
          "Avoid pointer-based heap variants (Fibonacci/Binomial) in production without profiling against flat array-backed binary or $d$-ary heaps.",
          "Never implement Dijkstra's algorithm with naive $\\mathcal{O}(N)$ array scans; use a min-heap to achieve $\\mathcal{O}((V + E) \\log V)$."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "priority-queue",

      why: {
        before: "Operating systems and network routers used simple FIFO queues, forcing emergency system interrupts and real-time audio/video packets to wait behind massive batch file transfers.",
        problem: "Computing systems need an abstract queue where each element possesses an explicit priority rating, ensuring that the highest-priority elements are dequeued first regardless of arrival time.",
        shift: "**Priority Queue: An abstract data type similar to a regular queue or stack, but where additionally each element has a 'priority' associated with it.** In a priority queue, an element with high priority is served before an element with low priority. Typically implemented via a Binary Heap, it drives task scheduling, event simulation, and greedy graph algorithms."
      },

      num: {
        t: "Priority Queue Implementations: Underlying Primitives & Complexities",
        h: ["Underlying Primitive", "Enqueue (Insert)", "Dequeue (Extract-Max)", "Peek Highest Priority", "Modify Priority (Decrease-Key)", "Practical Production Usage"],
        r: [
          ["Binary Min/Max Heap", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(1)$", "$\\mathcal{O}(N)$ (or $\\mathcal{O}(\\log N)$ with index map)", "Standard `PriorityQueue` (Java, C++, Python `heapq`)"],
          ["Unsorted Dynamic Array", "$\\mathcal{O}(1)$ append", "$\\mathcal{O}(N)$ linear scan", "$\\mathcal{O}(N)$ linear scan", "$\\mathcal{O}(1)$ at known index", "Small collections ($N < 20$)"],
          ["Sorted Array", "$\\mathcal{O}(N)$ insertion shift", "$\\mathcal{O}(1)$ pop end", "$\\mathcal{O}(1)$", "$\\mathcal{O}(N)$ shift", "Read-heavy priority queues with rare insertions"],
          ["Indexed Priority Queue", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\log N)$", "$\\mathcal{O}(1)$", "$\\mathcal{O}(\\log N)$ strict", "Dijkstra's shortest path, Prim's MST, A* search"],
          ["Calendar Queue / Multi-Bucket", "$\\mathcal{O}(1)$ average", "$\\mathcal{O}(1)$ average", "$\\mathcal{O}(1)$", "$\\mathcal{O}(1)$", "Discrete event simulation engines, Linux timer wheel"]
        ],
        n: "A Priority Queue (PQ) is an Abstract Data Type defining three core operations: (1) `insert(item, priority)`, (2) `peek()`, and (3) `extract_highest()`. While naive arrays offer either fast insertion ($\mathcal{O}(1)$) and slow extraction ($\\mathcal{O}(N)$) or vice-versa, backing the PQ with a **Binary Heap** balances both operations to $\\mathcal{O}(\\log N)$ while maintaining $\\mathcal{O}(1)$ peek. In network packet scheduling (Quality of Service - QoS), priority queues prevent packet buffer bloat by routing VoIP and control traffic immediately while queueing bulk TCP downloads. In graph algorithms like **Dijkstra's Shortest Path**, standard binary heaps lack an efficient `decrease_key` operation; augmenting the heap with an internal inverse index map (**Indexed Priority Queue**) maps vertex IDs to their current position in the heap array, enabling `decrease_key` in strict $\\mathcal{O}(\\log N)$ time."
      },

      miss: [
        {
          w: "A Priority Queue is a specific physical data structure.",
          r: "A Priority Queue is an **Abstract Data Type (ADT)** defining an interface and behavioral contract. A **Heap** is a concrete data structure commonly used to implement a Priority Queue. A Priority Queue can also be implemented using a balanced BST, a sorted linked list, or an array of bucket queues."
        },
        {
          w: "Elements with the same priority are guaranteed to be dequeued in FIFO order.",
          r: "Standard heap-based priority queues are **not stable**: if two elements have identical priorities, their relative extraction order is arbitrary. If strict FIFO tie-breaking is required, elements must be wrapped in a composite tuple with a monotonically increasing sequence counter: `(priority, sequence_id, payload)`."
        },
        {
          w: "Python's `queue.PriorityQueue` should always be used for priority queues in Python.",
          r: "`queue.PriorityQueue` is a thread-safe wrapper that acquires and releases threading locks on every single call, introducing heavy synchronization overhead. For standard single-threaded algorithmic workloads, Python's lightweight `heapq` module is orders of magnitude faster."
        },
        {
          w: "Dijkstra's algorithm can run efficiently with a standard non-indexed priority queue without duplicate entries.",
          r: "In standard binary heaps without `decrease_key`, when a shorter path to a vertex is discovered, the updated pair `(new_dist, v)` must be inserted as a **duplicate entry**. The algorithm must then track a `visited` set to lazily skip stale duplicate vertex entries when popped."
        }
      ],

      trade: {
        buys: [
          "Optimal priority scheduling: guarantees that urgent, high-value tasks execute immediately ahead of low-priority background work.",
          "Balanced operational complexity: executes both enqueue and dequeue in $\\mathcal{O}(\\log N)$ time with $\\mathcal{O}(1)$ inspection.",
          "Algorithmic engine: serves as the central data structure for Dijkstra's shortest path, A* pathfinding, Huffman coding, and Prim's MST.",
          "Time-slice management: powers operating system thread schedulers and real-time discrete-event simulators."
        ],
        costs: [
          "Unstable tie-breaking: does not preserve FIFO order for elements with equal priority without auxiliary sequence counters.",
          "Costly priority updates: altering an existing item's priority requires an $\\mathcal{O}(N)$ scan unless augmented with inverse index arrays.",
          "No random access or sorting: extracting all $N$ items in priority order takes $\\mathcal{O}(N \\log N)$ time (HeapSort).",
          "Thread synchronization contention: shared multi-threaded priority queues suffer lock contention under high-frequency push/pop bursts."
        ],
        avoid: [
          "Never rely on a heap-based priority queue to break ties in FIFO order without attaching an explicit incrementing sequence index.",
          "Do not use thread-synchronized priority queues (like Java `PriorityBlockingQueue` or Python `queue.PriorityQueue`) in single-threaded hot loops.",
          "Avoid repeatedly searching for and updating items inside a standard priority queue; use an Indexed Priority Queue with a position map.",
          "Never allow unbounded priority queues to accumulate low-priority tasks indefinitely without starvation prevention aging mechanisms."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
