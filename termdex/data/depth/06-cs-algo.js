/* ==========================================================================
   Depth pass 6 — algorithms and data structures.

   These are the terms an interview reaches for, and the ones most often
   learned as a recipe rather than as an idea. The aim here is the idea: what
   invariant each structure maintains, why that invariant makes the bound
   possible, and where the recipe stops working.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "amortised-analysis",

      why: {
        before: "An operation was described by its worst case. A dynamic " +
          "array's `append` was `O(n)`, because sometimes it has to resize and " +
          "copy everything.",
        problem: "That description is technically true and practically " +
          "worthless. It implies appending n items costs `O(n²)`, which anyone " +
          "who has used a list knows is wrong. The worst case for a *single* " +
          "operation says nothing useful about a *sequence* of them.",
        shift: "Analyse the sequence. If the expensive case can only happen " +
          "after enough cheap ones have paid for it, then the average cost per " +
          "operation over any sequence is what matters. Amortised `O(1)` is a " +
          "guarantee about total work, not a probabilistic claim."
      },

      num: {
        t: "Appending n items to a doubling array",
        h: ["Growth factor", "Total copies", "Wasted space"],
        r: [
          ["2× (Java, Go)", "~n", "up to 50%"],
          ["1.5× (C++ typical)", "~2n", "up to 33%"],
          ["1.125× (huge lists)", "~8n", "~11%"]
        ],
        n: "With doubling, the copies form the series `1 + 2 + 4 + … + n`, " +
          "which sums to **less than 2n** — so n appends cost `O(n)` total and " +
          "each is `O(1)` amortised. The growth factor is a real design " +
          "trade-off: 2× copies least but wastes most, and a factor **under " +
          "the golden ratio (~1.618)** has the property that freed blocks can " +
          "be reused for later allocations, which is why several allocators " +
          "choose 1.5×."
      },

      miss: [
        {
          w: "Amortised O(1) means it is usually O(1) and occasionally slow.",
          r: "It is a stronger claim than *usually*: it guarantees that **any** " +
            "sequence of n operations costs `O(n)` total. It is not " +
            "probabilistic and has no bad-luck case. Contrast with *average " +
            "case*, which is about a distribution of inputs and can be defeated " +
            "by an adversary."
        },
        {
          w: "Amortised and average-case are the same thing.",
          r: "Hash table lookup is `O(1)` **average case** — an adversary " +
            "choosing colliding keys makes it `O(n)`. Dynamic array append is " +
            "`O(1)` **amortised** — no adversary can make n appends cost more " +
            "than `O(n)`. One is about luck; the other is about accounting."
        },
        {
          w: "Amortised bounds are safe for real-time systems.",
          r: "They are not. The guarantee is about *total* cost; an individual " +
            "operation can still take `O(n)`. If you have a 5ms frame budget, " +
            "an amortised-`O(1)` append that occasionally copies a million " +
            "elements will miss it. Real-time systems want worst-case bounds, " +
            "which is why they preallocate."
        },
        {
          w: "You prove it by dividing total cost by the number of operations.",
          r: "That is the *aggregate* method and it is the weakest of the " +
            "three. The **accounting** method charges each cheap operation a " +
            "little extra to pay for future expensive ones, and the " +
            "**potential** method defines a function over the data structure's " +
            "state. The latter two handle cases where operations interleave and " +
            "aggregate cannot."
        }
      ],

      trade: {
        buys: [
          "An honest bound for structures whose costs are unevenly distributed.",
          "Justifies designs that look wasteful per-operation and are optimal " +
            "overall.",
          "Stronger than average-case: no adversarial input defeats it."
        ],
        costs: [
          "Says nothing about the latency of any single operation.",
          "Harder to prove than a straightforward worst-case bound.",
          "Can hide latency spikes that matter enormously in practice."
        ],
        avoid: [
          "The system has a hard per-operation deadline — real-time control, a " +
            "game frame, an audio callback.",
          "Tail latency is what you are being measured on; p99 does not care " +
            "about your average.",
          "The structure is used once, where amortisation never gets the " +
            "chance to pay off."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "union-find",

      why: {
        before: "Answering *are these two elements in the same group* meant a " +
          "graph traversal from one to the other, or maintaining explicit sets " +
          "and merging them by copying.",
        problem: "Both are far too slow when the question is asked constantly " +
          "and groups keep merging — which is exactly what happens in Kruskal's " +
          "algorithm, in connected-component tracking, and in any incremental " +
          "connectivity problem.",
        shift: "Do not store the group; store a **pointer to a parent**, so " +
          "each set is a tree and the root is the set's identity. Two " +
          "optimisations then collapse the cost almost to nothing: **union by " +
          "rank** keeps trees shallow by always hanging the smaller under the " +
          "larger, and **path compression** flattens the tree every time you " +
          "walk it."
      },

      num: {
        t: "Cost per operation, by optimisation",
        h: ["Optimisations", "Amortised cost", "At n = 10⁹"],
        r: [
          ["neither", "O(n)", "billions"],
          ["union by rank only", "O(log n)", "~30"],
          ["path compression only", "O(log n)", "~30"],
          ["both", "O(α(n))", "**< 5**"]
        ],
        n: "**α** is the inverse Ackermann function, and it grows so " +
          "absurdly slowly that it is below 5 for any n that could physically " +
          "exist — fewer than the number of atoms in the universe. So " +
          "union-find is *effectively* constant time, though provably not " +
          "quite. Both optimisations are needed: either alone gives `O(log n)`, " +
          "and only together do you get α. The proof of that bound (Tarjan, " +
          "1975) is one of the harder results in basic data structures."
      },

      miss: [
        {
          w: "Union-find can tell you whether two nodes were ever disconnected.",
          r: "It only ever merges. There is no efficient `split` or `undo` in " +
            "the standard structure, because path compression destroys the " +
            "history of how the tree was built. Problems requiring deletion " +
            "need a different approach — often processing the queries offline " +
            "in reverse, so deletions become insertions."
        },
        {
          w: "The tree structure reflects how the sets were merged.",
          r: "Path compression deliberately destroys that. After a `find`, " +
            "every node on the path points straight at the root, so the tree " +
            "shape reflects *query history*, not merge history. The only " +
            "meaningful fact is which root you reach."
        },
        {
          w: "Union by rank means union by set size.",
          r: "Rank is an **upper bound on tree height**, not a count of " +
            "elements — and with path compression it stops being exact, which " +
            "is why it is called rank rather than height. *Union by size* is a " +
            "separate, equally valid variant; both give the same asymptotic " +
            "bound."
        },
        {
          w: "You need it for any grouping problem.",
          r: "If the groups are static and known upfront, a single DFS labels " +
            "every component in `O(V + E)` and answering queries is an array " +
            "lookup. Union-find earns its place specifically when merges arrive " +
            "**incrementally, interleaved with queries**."
        }
      ],

      trade: {
        buys: [
          "Effectively constant-time merge and connectivity queries.",
          "About fifteen lines of code with no allocation after setup.",
          "The engine behind Kruskal's MST, cycle detection and incremental " +
            "connectivity."
        ],
        costs: [
          "Merge-only: no efficient deletion or splitting.",
          "Cannot enumerate a set's members without a separate structure.",
          "Loses all information about *how* elements became connected.",
          "The α bound is amortised, so an individual `find` can be longer."
        ],
        avoid: [
          "The graph is static — one DFS or BFS labels everything more simply.",
          "You need to remove edges or split sets; consider offline reversal or " +
            "a link-cut tree.",
          "You need the actual path between two nodes, not just whether one " +
            "exists.",
          "You need to list a group's members frequently, which needs extra " +
            "bookkeeping."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dijkstra-s-algorithm",

      why: {
        before: "Breadth-first search finds shortest paths perfectly well — " +
          "when every edge costs the same. It expands outward in layers, and " +
          "the first time it reaches a node is via the fewest edges.",
        problem: "Add weights and the layer argument collapses. A path of two " +
          "expensive edges can be worse than one of five cheap ones, so " +
          "*fewest edges* is no longer *shortest distance*, and BFS's ordering " +
          "is meaningless.",
        shift: "Replace the queue with a **priority queue**. Always expand the " +
          "unvisited node with the smallest known distance. The greedy claim " +
          "that makes it correct: when you pop a node, its distance is final, " +
          "because any other route to it would have to pass through a node " +
          "already known to be further away."
      },

      num: {
        t: "Complexity by priority queue implementation",
        h: ["Queue", "Complexity", "Best for"],
        r: [
          ["Array scan", "O(V²)", "dense graphs"],
          ["Binary heap", "O((V+E) log V)", "the usual choice"],
          ["Fibonacci heap", "O(E + V log V)", "theoretically optimal"]
        ],
        n: "The Fibonacci heap is asymptotically best and almost never used — " +
          "its constants are large enough that a binary heap wins on real " +
          "inputs. A practical detail worth knowing: most implementations use " +
          "**lazy deletion**, pushing a duplicate entry rather than decreasing " +
          "a key, and skipping stale entries when popped. That is simpler than " +
          "`decrease-key` and performs better. For a road network, **A\\*** " +
          "with a straight-line-distance heuristic explores a small fraction of " +
          "what Dijkstra does — Dijkstra is exactly A\\* with a zero heuristic."
      },

      miss: [
        {
          w: "Dijkstra fails on negative edges because it might loop forever.",
          r: "It terminates, it just returns wrong answers. The greedy " +
            "invariant — a popped node's distance is final — assumes distances " +
            "only grow as you extend a path. A negative edge can improve a node " +
            "*after* it has been finalised, and Dijkstra never revisits it. Use " +
            "**Bellman-Ford**, which is `O(VE)` but tolerates negatives and " +
            "detects negative cycles."
        },
        {
          w: "Dijkstra finds the shortest path between two nodes.",
          r: "It computes shortest paths from one source to **all** nodes. You " +
            "can stop early when the target is popped, but the algorithm is " +
            "inherently single-source-to-all. For all pairs on a dense graph " +
            "use **Floyd-Warshall**."
        },
        {
          w: "Zero-weight edges are a problem too.",
          r: "Zero is fine — the invariant only requires distances to be " +
            "**non-decreasing**, and adding zero satisfies that. Only strictly " +
            "negative weights break it. In fact the special case where all " +
            "weights are 0 or 1 has its own faster algorithm, **0-1 BFS**, " +
            "using a deque instead of a heap."
        },
        {
          w: "Marking nodes visited is an optimisation.",
          r: "It is required for correctness with a lazy-deletion queue: a node " +
            "can appear several times in the heap with different distances, and " +
            "without the visited check you would process a stale, larger " +
            "distance and potentially propagate it."
        }
      ],

      trade: {
        buys: [
          "Optimal shortest paths from one source with non-negative weights.",
          "Near-linear on sparse graphs with a binary heap.",
          "Generalises directly to A\\* by adding an admissible heuristic.",
          "Works unchanged on directed and undirected graphs."
        ],
        costs: [
          "Silently wrong on negative edges — no error, just bad answers.",
          "Computes all destinations even when you want one.",
          "Explores in all directions; without a heuristic it is uninformed.",
          "Needs the whole graph resident, which bounds the problem size."
        ],
        avoid: [
          "Any edge is negative — use **Bellman-Ford** or Johnson's algorithm.",
          "All edges have equal weight — plain **BFS** is simpler and faster.",
          "Edges are only 0 or 1 — **0-1 BFS** with a deque beats the heap.",
          "You need all-pairs distances on a small dense graph — " +
            "**Floyd-Warshall** in ten lines.",
          "A good distance heuristic exists — **A\\*** will explore far less."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "trie",

      why: {
        before: "Storing a set of strings meant a hash set. Membership was " +
          "`O(1)` on average and that seemed like the end of the discussion.",
        problem: "A hash destroys structure. Hashing `\"car\"` and `\"cart\"` " +
          "gives two unrelated values, so *find every word starting with car* " +
          "requires scanning the entire set. Prefix questions — autocomplete, " +
          "routing tables, dictionary lookup — are exactly what a hash cannot " +
          "answer.",
        shift: "Make the **path** the key. Each edge is a character, so a word " +
          "is a walk from the root, and every string sharing a prefix shares " +
          "that part of the path. Prefix search becomes *walk to the node, then " +
          "collect everything below it*."
      },

      num: {
        t: "Trie against hash set, m = key length",
        h: ["Operation", "Trie", "Hash set"],
        r: [
          ["Lookup", "O(m)", "O(m) to hash, O(1) after"],
          ["Prefix search", "O(m + k)", "O(n) — full scan"],
          ["Sorted iteration", "free", "O(n log n)"],
          ["Memory per node", "high", "low"]
        ],
        n: "Memory is the trie's real problem. A naive node with a 26-entry " +
          "child array costs **~208 bytes** on a 64-bit machine, most of it " +
          "null pointers — a dictionary of 100k words can reach hundreds of " +
          "megabytes. The fixes matter: a **hash map per node** for sparse " +
          "alphabets, a **radix tree** (compressed trie) that collapses chains " +
          "of single-child nodes into one edge, or a **DAWG** that also merges " +
          "identical suffixes. Radix trees are what routing tables and " +
          "filesystem indexes actually use."
      },

      miss: [
        {
          w: "A trie is faster than a hash table for lookups.",
          r: "Usually **slower** in practice. Both are `O(m)` in key length — " +
            "the hash must read every character too — but the trie does m " +
            "pointer dereferences to scattered memory, each a likely cache " +
            "miss, while the hash does one contiguous pass and one probe. The " +
            "trie's advantage is prefix queries, not raw lookup speed."
        },
        {
          w: "Tries only work for strings.",
          r: "They work for any sequence over a small alphabet. IP routing " +
            "tables are tries over bits; a **binary trie** over the bits of an " +
            "integer answers maximum-XOR queries in `O(32)`, which is a " +
            "standard competitive-programming technique with no strings " +
            "involved."
        },
        {
          w: "Storing a boolean 'is a word' flag at each node is enough.",
          r: "It is enough for membership, and not for deletion or counting. " +
            "Removing `\"car\"` when `\"cart\"` exists must not delete the " +
            "shared path. Most real implementations store a **count** of words " +
            "passing through each node so deletion can decrement and prune only " +
            "when it reaches zero."
        },
        {
          w: "Tries are memory-efficient because they share prefixes.",
          r: "Sharing saves on the character data, and the **node overhead** " +
            "usually dwarfs that saving. A trie is typically several times " +
            "larger than the strings it stores. Only compressed variants — " +
            "radix trees, DAWGs — actually deliver on the memory promise."
        }
      ],

      trade: {
        buys: [
          "Prefix queries in time proportional to the prefix, not the corpus.",
          "Sorted iteration for free, in lexicographic order.",
          "No hash collisions and no worst-case degradation.",
          "Longest-prefix matching, which is exactly what IP routing needs."
        ],
        costs: [
          "Heavy memory overhead per node, often far exceeding the data.",
          "Poor cache locality — every character is a pointer chase.",
          "More code than a hash set, especially deletion.",
          "Slower than a hash for plain membership testing."
        ],
        avoid: [
          "You only need membership or lookup — a hash set is smaller and " +
            "faster.",
          "The alphabet is large, such as full Unicode, making nodes enormous.",
          "Keys are long and share few prefixes; you pay the overhead and gain " +
            "nothing.",
          "Memory is tight — reach for a radix tree or a DAWG instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "consistent-hashing",

      why: {
        before: "Sharding across N servers used `hash(key) % N`. Simple, " +
          "uniform, and fine while N never changed.",
        problem: "N always changes. Add one server to a pool of ten and the " +
          "modulus changes for every key — roughly **90%** of keys map " +
          "somewhere new. Every cache misses at once, every shard needs " +
          "rebalancing, and the origin takes the full load simultaneously.",
        shift: "Stop mapping keys to *server indices* and map both keys and " +
          "servers onto the same **ring** of hash values. A key belongs to the " +
          "first server clockwise from it. Adding a server now only steals keys " +
          "from its immediate neighbour, so only about `1/N` of keys move."
      },

      num: {
        t: "Keys remapped when adding one server",
        h: ["Servers", "hash % N", "Consistent hashing"],
        r: [
          ["4 → 5", "~80%", "~20%"],
          ["10 → 11", "~90%", "~9%"],
          ["100 → 101", "~99%", "~1%"]
        ],
        n: "**Virtual nodes** are the detail that makes it work in practice. " +
          "With one point per server, random placement leaves servers with " +
          "wildly uneven arcs — load can vary by a factor of five. Placing " +
          "**100–200 virtual nodes** per physical server averages this out to " +
          "within a few percent, and has the bonus that when a server dies its " +
          "load spreads across *all* the others rather than dumping onto one " +
          "neighbour. It also lets you weight servers by giving bigger machines " +
          "more virtual nodes."
      },

      miss: [
        {
          w: "Consistent hashing distributes keys perfectly evenly.",
          r: "Without virtual nodes it distributes them **badly** — random " +
            "points on a ring leave arcs of very different sizes. Even with " +
            "virtual nodes it is approximate. If you need strict balance, " +
            "**rendezvous hashing** or bounded-load variants give stronger " +
            "guarantees."
        },
        {
          w: "It prevents hot spots.",
          r: "It balances **keys**, not **traffic**. One viral key still lands " +
            "on one server and melts it, no matter how evenly the keyspace is " +
            "spread. Hot keys need replication or a separate hot-key cache; " +
            "consistent hashing does not address them at all."
        },
        {
          w: "It is only useful for caches.",
          r: "It underpins sharded databases (Cassandra, DynamoDB, Riak), " +
            "CDN edge selection, and sticky load balancing. Anywhere a key must " +
            "map to a node and nodes come and go, the remapping cost is the " +
            "same problem."
        },
        {
          w: "Adding a server rebalances the whole cluster.",
          r: "That is the entire point of *not* doing so. Only the keys in the " +
            "new server's arcs move, and they move from specific neighbours. " +
            "The other servers are untouched — which is also why load may stay " +
            "somewhat uneven after the change."
        }
      ],

      trade: {
        buys: [
          "Only ~1/N of keys move when the cluster changes size.",
          "Scaling and failure become routine rather than an incident.",
          "Weighted distribution via virtual node counts.",
          "Fully decentralised — every client can compute the mapping."
        ],
        costs: [
          "More complex than a modulus, and easy to implement subtly wrong.",
          "Needs virtual nodes to be even, which costs memory in the ring.",
          "Does nothing about hot keys.",
          "All clients must agree on the ring, so membership needs " +
            "coordination."
        ],
        avoid: [
          "The node set is genuinely fixed and will never change.",
          "Load is dominated by a few hot keys — solve that first.",
          "You need strict balance guarantees; consider rendezvous hashing or " +
            "bounded-load consistent hashing.",
          "A managed system already handles sharding for you."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "segment-tree",

      why: {
        before: "Answering *what is the sum of elements 3 through 7* meant " +
          "looping over that range: `O(n)` per query. A **prefix sum** array " +
          "made it `O(1)` — but only if the array never changes.",
        problem: "Updates destroy prefix sums. Changing one element invalidates " +
          "every prefix after it, costing `O(n)` to rebuild. So you could have " +
          "fast queries or fast updates, and mixing them forced one of the two " +
          "to be linear.",
        shift: "Build a binary tree where each node stores the answer for a " +
          "**range**, its children splitting that range in half. A query " +
          "decomposes into `O(log n)` precomputed nodes; an update touches only " +
          "the `O(log n)` nodes containing that index. Both operations become " +
          "logarithmic."
      },

      num: {
        t: "Range query with point update",
        h: ["Structure", "Query", "Update", "Memory"],
        r: [
          ["Plain array", "O(n)", "O(1)", "n"],
          ["Prefix sums", "O(1)", "O(n)", "n"],
          ["Fenwick tree", "O(log n)", "O(log n)", "n"],
          ["Segment tree", "O(log n)", "O(log n)", "~4n"],
          ["Sqrt decomposition", "O(√n)", "O(1)", "n"]
        ],
        n: "Allocate **4n**, not 2n. The tree is not perfectly balanced unless " +
          "n is a power of two, and the recursive indexing can reach beyond 2n " +
          "— this off-by-one is one of the most common bugs in the structure. " +
          "The **Fenwick tree** is smaller, faster and about ten lines, but " +
          "only handles invertible operations like sum. A segment tree handles " +
          "**min**, **max**, **gcd** and arbitrary associative merges, and with " +
          "**lazy propagation** supports range updates as well — which Fenwick " +
          "cannot do naturally."
      },

      miss: [
        {
          w: "Segment trees are for sums.",
          r: "They work for any **associative** operation: min, max, gcd, " +
            "matrix product, or a custom merge. The only requirement is that " +
            "combining two children's answers gives the parent's. If your merge " +
            "is associative, the structure works unchanged."
        },
        {
          w: "A Fenwick tree is a worse segment tree.",
          r: "It is smaller, faster by a constant factor, and dramatically " +
            "shorter to write. It is *less general* — it needs an invertible " +
            "operation, so sums yes, minimum no. For range-sum problems the " +
            "Fenwick tree is usually the correct choice and the segment tree is " +
            "over-engineering."
        },
        {
          w: "Lazy propagation is an optimisation you can add later.",
          r: "It changes the structure's contract. Without it, a range update " +
            "is `O(n log n)`; with it, `O(log n)`. But the merge logic must " +
            "then be written to compose *pending* updates correctly, which is " +
            "substantially harder than the base case and cannot be bolted on " +
            "mechanically."
        },
        {
          w: "It is the right tool whenever you have range queries.",
          r: "If the array never changes, a **prefix sum** or a **sparse " +
            "table** answers in `O(1)` and is far simpler. Segment trees earn " +
            "their complexity only when updates and queries are interleaved."
        }
      ],

      trade: {
        buys: [
          "Logarithmic range query and point update simultaneously.",
          "Works for any associative merge, not just sums.",
          "Range updates too, via lazy propagation.",
          "Extends to 2D, to persistence, and to merge-sort trees."
        ],
        costs: [
          "About 4n memory, four times a Fenwick tree.",
          "Substantially more code, and easy to get the indexing wrong.",
          "Lazy propagation is genuinely difficult to write correctly.",
          "Constant factors worse than simpler structures."
        ],
        avoid: [
          "The array is static — use prefix sums or a sparse table for `O(1)`.",
          "You only need range sums with point updates — the **Fenwick tree** " +
            "is smaller and shorter.",
          "n is small; a linear scan beats it and cannot be wrong.",
          "You need `O(√n)` and much simpler code — sqrt decomposition is often " +
            "enough."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "p-vs-np",

      why: {
        before: "Some problems had fast algorithms and others did not, and " +
          "nobody could say whether the slow ones were *inherently* slow or " +
          "just awaiting a cleverer idea.",
        problem: "That distinction has enormous practical weight. If the " +
          "travelling salesman problem has a fast algorithm nobody has found, " +
          "effort spent on approximations is wasted. If it provably does not, " +
          "approximation is the only honest path.",
        shift: "Formalise it. **P** is problems solvable in polynomial time; " +
          "**NP** is problems whose solutions can be *verified* in polynomial " +
          "time. Cook and Levin then showed something remarkable: certain " +
          "problems in NP are **complete** — solve any one quickly and you " +
          "solve all of them quickly. The question collapsed from thousands of " +
          "separate puzzles into one."
      },

      num: {
        t: "Why exponential is not 'slow', it is impossible",
        h: ["n", "n²", "2ⁿ operations", "2ⁿ at 10⁹ ops/sec"],
        r: [
          ["20", "400", "1 million", "0.001s"],
          ["50", "2,500", "10¹⁵", "13 days"],
          ["100", "10,000", "10³⁰", "10¹³ years"],
          ["300", "90,000", "10⁹⁰", "more than atoms in the universe"]
        ],
        n: "At n = 300 the number of operations exceeds the estimated atom " +
          "count of the observable universe (~10⁸⁰). No hardware improvement " +
          "touches this — a computer a **trillion** times faster moves n = 100 " +
          "to n = 140. That is the practical content of the P vs NP question, " +
          "and why *NP-complete* means *stop looking for an exact fast " +
          "algorithm*. The Clay Institute offers **$1 million**; most " +
          "researchers surveyed expect **P ≠ NP**, and it has been open since " +
          "1971."
      },

      miss: [
        {
          w: "NP stands for 'non-polynomial'.",
          r: "It stands for **nondeterministic polynomial** — solvable in " +
            "polynomial time by a nondeterministic machine, equivalently " +
            "*verifiable* in polynomial time. This matters because **P is a " +
            "subset of NP**: every problem you can solve quickly you can also " +
            "verify quickly. *Non-polynomial* would make that containment " +
            "nonsense."
        },
        {
          w: "NP-complete problems are impossible to solve.",
          r: "They are solved constantly. Modern SAT solvers handle instances " +
            "with millions of variables; industrial TSP instances with tens of " +
            "thousands of cities are solved optimally. The bound is about " +
            "**worst case**, and real instances usually have structure that " +
            "solvers exploit."
        },
        {
          w: "If P = NP, all encryption breaks.",
          r: "Much of it would be threatened, but the implication is not " +
            "automatic. A polynomial algorithm with an `n¹⁰⁰` running time " +
            "breaks nothing practical. Conversely, factoring — which RSA rests " +
            "on — is **not known to be NP-complete**, and Shor's algorithm " +
            "already breaks it on a quantum computer without settling P vs NP " +
            "at all."
        },
        {
          w: "Quantum computers will solve NP-complete problems efficiently.",
          r: "There is no evidence for this. **BQP** is not believed to contain " +
            "NP-complete problems. Quantum computers give a proven exponential " +
            "speed-up on specific structured problems like factoring, and " +
            "Grover's algorithm gives only a **quadratic** speed-up on " +
            "unstructured search — turning 2ⁿ into 2^(n/2), which is still " +
            "exponential."
        }
      ],

      trade: {
        buys: [
          "Tells you when to stop searching for an exact efficient algorithm.",
          "Reduction proofs let one hardness result cover thousands of " +
            "problems.",
          "Redirects effort to approximation, heuristics and special cases.",
          "Underpins the assumption that modern cryptography rests on."
        ],
        costs: [
          "Worst-case framing; says little about the instances you actually " +
            "face.",
          "Asymptotic, so it ignores constants that dominate at real sizes.",
          "Encourages giving up on problems that solvers handle routinely.",
          "The central question is still open, so all of it is conditional."
        ],
        avoid: [
          "Your instances are small or highly structured — try a solver before " +
            "assuming defeat.",
          "An approximation within a few percent is acceptable; many " +
            "NP-complete problems have excellent approximation schemes.",
          "You are reasoning about average-case difficulty, which is a " +
            "different theory entirely.",
          "The bottleneck is I/O or memory rather than computation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "thundering-herd",

      why: {
        before: "A cache entry expired, the next request recomputed it, and " +
          "everything worked — under light traffic.",
        problem: "Under real traffic, *the next request* is a thousand " +
          "requests arriving in the same millisecond. All of them find the " +
          "cache empty, all of them hit the database, and all of them compute " +
          "the identical answer. The database, sized for the cached load, " +
          "falls over — and now the cache never repopulates.",
        shift: "Recognise that expiry is a **synchronisation event**. Anything " +
          "that makes many clients act simultaneously — a shared TTL, a service " +
          "restart, a deploy, an upstream recovery — creates a herd. The fixes " +
          "all work by breaking that synchronisation or by ensuring only one " +
          "actor does the work."
      },

      num: {
        t: "Mitigations",
        h: ["Technique", "Mechanism", "Cost"],
        r: [
          ["Jittered TTL", "randomise expiry ±10%", "trivial"],
          ["Lock / single-flight", "one recomputes, rest wait", "a lock"],
          ["Stale-while-revalidate", "serve old, refresh behind", "brief staleness"],
          ["Probabilistic early expiry", "refresh early, at random", "a little extra work"],
          ["Request coalescing", "merge identical in-flight calls", "bookkeeping"]
        ],
        n: "**Jitter is the cheapest and most effective first move**: a fixed " +
          "3600s TTL set during a deploy means every key expires within the " +
          "same second an hour later, so the deploy itself schedules the " +
          "outage. Randomising to 3600 ± 360 spreads that over twelve minutes. " +
          "For the hottest keys, **single-flight** — Go's `singleflight`, " +
          "Python's lock-per-key — collapses a thousand concurrent misses into " +
          "one origin call. The two are complementary, not alternatives."
      },

      miss: [
        {
          w: "A thundering herd only happens when a cache expires.",
          r: "Any synchronised wake-up does it. Every client reconnecting after " +
            "a network blip, every cron job firing at `00:00`, every pod " +
            "starting after a deploy, every retry timer set to the same " +
            "interval. The original meaning is even narrower — many OS threads " +
            "woken for one event — and the pattern generalises everywhere."
        },
        {
          w: "Adding a lock fixes it.",
          r: "It fixes the origin load and introduces a new question: what do " +
            "the other 999 requests do while they wait? If they block, you have " +
            "traded a database spike for a thread-pool exhaustion. If they " +
            "time out, you have traded it for errors. **Stale-while-revalidate** " +
            "avoids the dilemma by giving them the old value immediately."
        },
        {
          w: "Longer TTLs reduce the risk.",
          r: "They reduce the *frequency* and increase the *severity*: more " +
            "requests accumulate behind a longer TTL, so the herd is larger " +
            "when it arrives. They also make the data staler. Jitter addresses " +
            "the problem; TTL length does not."
        },
        {
          w: "It is a caching problem, so the cache team should fix it.",
          r: "It is a **coordination** problem. Retry storms with fixed " +
            "backoff, synchronised health checks, and clients that all reconnect " +
            "at once are the same failure with no cache involved. The general " +
            "remedy is the same: add jitter and deduplicate work."
        }
      ],

      trade: {
        buys: [
          "Naming it makes an entire class of outage predictable and " +
            "preventable.",
          "Jitter is almost free to add and removes most of the risk.",
          "Single-flight bounds origin load regardless of client concurrency."
        ],
        costs: [
          "Locks add latency and a new failure mode if the holder dies.",
          "Stale-while-revalidate means deliberately serving old data.",
          "Coalescing needs shared state, which is harder across many " +
            "processes.",
          "More moving parts in what was a simple cache read."
        ],
        avoid: [
          "Traffic is low enough that simultaneous misses cannot overwhelm the " +
            "origin.",
          "The origin is cheap and idempotent — a few duplicate computations " +
            "cost nothing.",
          "Data must be perfectly fresh, ruling out stale-while-revalidate.",
          "Keys are naturally spread out in time already, so there is nothing " +
            "to desynchronise."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
