/* ==========================================================================
   Depth pass 14 — the competitive-programming toolkit, and why each tool
   exists.

   Most of these are learned as recipes and forgotten. The through-line worth
   holding: nearly every one is a **precomputation trade** — spend time or
   memory up front to make a repeated query cheap. Which one you reach for
   depends entirely on whether the data changes, and that is the question to
   ask first.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "bellman-ford",

      why: {
        before: "Dijkstra solved shortest paths efficiently by greedily " +
          "finalising the closest unvisited node.",
        problem: "That greedy step assumes distances only grow as a path " +
          "extends. A **negative edge** breaks it — a node finalised early can " +
          "later be reached more cheaply through a negative edge, and Dijkstra " +
          "never revisits it. It returns a wrong answer with no indication " +
          "anything went wrong.",
        shift: "Abandon greed. **Relax every edge, V−1 times.** After k rounds " +
          "every shortest path using at most k edges is correct, and since no " +
          "simple path uses more than V−1 edges, V−1 rounds settles " +
          "everything. Slower, and it tolerates negative weights — and a Vth " +
          "round that still improves something **proves a negative cycle " +
          "exists**."
      },

      num: {
        t: "Shortest path algorithms",
        h: ["Algorithm", "Complexity", "Negative edges", "Detects neg. cycle"],
        r: [
          ["Dijkstra", "O((V+E) log V)", "**no**", "no"],
          ["Bellman-Ford", "O(V·E)", "**yes**", "**yes**"],
          ["SPFA", "O(V·E) worst, fast typical", "yes", "yes"],
          ["Floyd-Warshall", "O(V³)", "yes", "yes (all pairs)"]
        ],
        n: "On a graph with 1,000 nodes and 10,000 edges, Dijkstra does roughly " +
          "**10⁵** operations and Bellman-Ford **10⁷** — a hundredfold " +
          "difference, which is why you only pay it when you must. The " +
          "negative-cycle detection is the underrated part: it is the basis of " +
          "**currency arbitrage detection**, where you take `-log(rate)` as " +
          "edge weights and a negative cycle is a sequence of trades that " +
          "returns more than you started with. A standard optimisation: if a " +
          "full round relaxes nothing, stop early — often long before V−1."
      },

      miss: [
        {
          w: "Bellman-Ford is just a slower Dijkstra.",
          r: "It answers a question Dijkstra **cannot** answer at all. Negative " +
            "edges are not an edge case — they appear in arbitrage, in " +
            "profit-and-cost modelling, and in difference constraint systems. " +
            "Dijkstra does not run slowly on them; it runs fast and returns " +
            "nonsense."
        },
        {
          w: "You should run it V times to be safe.",
          r: "V−1 is provably sufficient, because a shortest simple path has at " +
            "most V−1 edges. The **Vth** round is run deliberately as the " +
            "negative-cycle test: if anything still improves, a negative cycle " +
            "is reachable and no shortest path exists."
        },
        {
          w: "Negative cycles just mean the answer is negative.",
          r: "They mean **no shortest path exists** — you can loop the cycle " +
            "forever and drive the cost to negative infinity. The correct " +
            "output is *undefined*, not a very negative number, and reporting a " +
            "number instead is a real bug."
        },
        {
          w: "SPFA is strictly better since it is usually faster.",
          r: "It has the same `O(V·E)` worst case and is reliably attacked in " +
            "competitive programming with graphs constructed to trigger it. " +
            "Faster on typical graphs, identical in the worst case, and not " +
            "safe against adversarial input."
        }
      ],

      trade: {
        buys: [
          "Correct shortest paths with negative edge weights.",
          "Detects negative cycles, which no other single-source method does " +
            "as simply.",
          "Very short to implement — a triple loop.",
          "Distributes naturally; it is the basis of distance-vector routing."
        ],
        costs: [
          "`O(V·E)` — orders of magnitude slower than Dijkstra.",
          "Relaxes every edge every round, including settled ones.",
          "Impractical on large graphs.",
          "Cannot exploit a heuristic the way A\\* can."
        ],
        avoid: [
          "All weights are non-negative — **Dijkstra** is far faster.",
          "The graph is large and you need speed; consider Johnson's algorithm " +
            "for all-pairs with negatives.",
          "All weights are equal — plain BFS.",
          "You need all-pairs on a small dense graph — **Floyd-Warshall** is " +
            "simpler."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "fenwick-tree",

      why: {
        before: "Prefix sums gave `O(1)` range queries and `O(n)` updates; a " +
          "plain array gave `O(1)` updates and `O(n)` queries. Both are " +
          "unusable when queries and updates interleave.",
        problem: "A **segment tree** solves it in `O(log n)` for both — and " +
          "costs 4n memory and a hundred lines of fiddly recursive code with " +
          "an indexing scheme that is easy to get wrong.",
        shift: "Exploit binary representation. Store at index `i` the sum of " +
          "the last `i & -i` elements — a range whose length is the lowest set " +
          "bit of `i`. Any prefix decomposes into `O(log n)` such ranges, " +
          "reachable by repeatedly stripping the lowest set bit. The whole " +
          "structure is **n integers and about ten lines**."
      },

      num: {
        t: "Range-sum structures",
        h: ["Structure", "Query", "Update", "Memory", "Lines of code"],
        r: [
          ["Prefix sums", "O(1)", "O(n)", "n", "~3"],
          ["**Fenwick**", "O(log n)", "O(log n)", "**n**", "**~10**"],
          ["Segment tree", "O(log n)", "O(log n)", "4n", "~60"]
        ],
        n: "The two loops are the whole implementation: **query** walks down " +
          "with `i -= i & -i`, **update** walks up with `i += i & -i`. Both " +
          "visit `O(log n)` indices. It is also several times faster than a " +
          "segment tree in practice — a quarter of the memory means far better " +
          "cache behaviour. The limitation is the price: it needs an " +
          "**invertible** operation, so sums and XOR yes, **minimum no** — " +
          "you cannot subtract a minimum out. Range minimum needs a segment " +
          "tree or a sparse table."
      },

      miss: [
        {
          w: "A Fenwick tree is a worse segment tree.",
          r: "It is smaller, faster and dramatically shorter for the problems " +
            "it covers. It is **less general**, not worse. For range sums with " +
            "point updates — a very common case — reaching for a segment tree " +
            "is over-engineering."
        },
        {
          w: "It can do range minimum queries.",
          r: "Not in general. The structure works by adding and **subtracting** " +
            "partial results, and minimum has no inverse — you cannot remove a " +
            "value from a minimum. Restricted variants exist for prefix minima " +
            "with only decreasing updates; the general case needs a different " +
            "structure."
        },
        {
          w: "It supports range updates.",
          r: "Not directly. It does point update plus range query. **Range " +
            "update with point query** works by storing a difference array in " +
            "the Fenwick tree, and range-update-range-query needs **two** " +
            "Fenwick trees with a known algebraic trick — doable, and no longer " +
            "the simple structure."
        },
        {
          w: "It should be 0-indexed like everything else.",
          r: "It must be **1-indexed**. The `i & -i` operation depends on it: " +
            "at index 0 the lowest set bit is 0, so `i += i & -i` never " +
            "advances and the update loop hangs. Almost every Fenwick bug is " +
            "someone 0-indexing it."
        }
      ],

      trade: {
        buys: [
          "Logarithmic query and update in about ten lines.",
          "Exactly n memory — a quarter of a segment tree.",
          "Excellent constants and cache behaviour.",
          "Extends naturally to 2D for grid prefix sums."
        ],
        costs: [
          "Requires an invertible operation — no min or max.",
          "Range updates need extra machinery.",
          "1-indexing is mandatory and a common bug source.",
          "The index arithmetic is opaque to read."
        ],
        avoid: [
          "You need min, max, or gcd — use a **segment tree**.",
          "The array is static — prefix sums are `O(1)` and simpler.",
          "You need range updates *and* range queries — segment tree with " +
            "lazy propagation.",
          "You need to query arbitrary associative merges."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sparse-table",

      why: {
        before: "Range minimum queries on a fixed array meant a segment tree — " +
          "`O(log n)` per query — or scanning the range at `O(n)`.",
        problem: "If the array **never changes**, paying `O(log n)` per query " +
          "is leaving something on the table. A structure that cannot be " +
          "updated should be able to answer faster than one that can.",
        shift: "Precompute the answer for every range whose length is a **power " +
          "of two**. Any range can then be covered by exactly **two** " +
          "overlapping such ranges, and since minimum is **idempotent** — " +
          "`min(x, x) = x` — overlapping is harmless. Two lookups, `O(1)` per " +
          "query."
      },

      num: {
        t: "Static range queries",
        h: ["Structure", "Build", "Query", "Memory", "Updates?"],
        r: [
          ["**Sparse table**", "O(n log n)", "**O(1)**", "n log n", "**no**"],
          ["Segment tree", "O(n)", "O(log n)", "4n", "yes"],
          ["Sqrt decomposition", "O(n)", "O(√n)", "n", "yes"]
        ],
        n: "The `O(1)` query depends entirely on **idempotence**, which is why " +
          "sparse tables work for `min`, `max` and `gcd` but **not for sum** — " +
          "overlapping two ranges would double-count the intersection. For sums " +
          "on a static array you want prefix sums, which are `O(1)` anyway. " +
          "Memory is the cost: `n log n` at 20 levels for a million elements is " +
          "**20 million integers**, roughly 80MB, against 4MB for a segment " +
          "tree. Precompute `log2` in a table — calling a floating-point log " +
          "per query destroys the constant factor."
      },

      miss: [
        {
          w: "Sparse tables work for any range query.",
          r: "Only **idempotent** operations. The two covering ranges overlap, " +
            "so an operation that counts each element once — like sum — " +
            "produces a wrong answer. `min`, `max`, `gcd`, `and`, `or` are " +
            "fine; `sum`, `product`, `xor` are not."
        },
        {
          w: "You can update a value and rebuild just that column.",
          r: "One element appears in `O(log n)` precomputed ranges at every " +
            "level, and changing it invalidates all of them — effectively a " +
            "rebuild. It is a **static** structure by nature. Any updates at " +
            "all mean a segment tree."
        },
        {
          w: "It uses too much memory to be practical.",
          r: "`n log n` is large and usually acceptable — for typical " +
            "competitive constraints (n ≤ 10⁵) it is about 1.7 million " +
            "integers. It becomes a genuine problem at n in the millions, where " +
            "the `O(1)` query rarely justifies the footprint."
        },
        {
          w: "The `O(1)` query means it is always fastest.",
          r: "Its constant factor includes a log lookup and two array accesses " +
            "with poor locality. For small ranges or few queries a segment tree " +
            "or even a linear scan can win. It pays off when queries vastly " +
            "outnumber elements."
        }
      ],

      trade: {
        buys: [
          "Genuine `O(1)` queries after preprocessing.",
          "Simple to implement — two nested loops to build.",
          "No recursion, no pointers, cache-friendly build.",
          "Ideal when queries hugely outnumber the data."
        ],
        costs: [
          "`n log n` memory.",
          "Completely static — no updates.",
          "Only idempotent operations.",
          "Build is `O(n log n)`, worse than a segment tree's `O(n)`."
        ],
        avoid: [
          "The array changes at all — use a **segment tree**.",
          "You need sums — prefix sums are `O(1)` and use `n` memory.",
          "Memory is constrained.",
          "There are few queries; the build cost dominates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rolling-hash",

      why: {
        before: "Comparing a pattern against every window of a text meant " +
          "comparing character by character — `O(m)` per position, `O(nm)` " +
          "total.",
        problem: "Each window shares all but two characters with the previous " +
          "one, and the naive comparison rereads all of them. The information " +
          "from the last comparison is discarded entirely.",
        shift: "Treat the window as a **number in base b**. Sliding one " +
          "position is then arithmetic: subtract the departing character's " +
          "contribution, multiply by the base, add the arriving one. `O(1)` per " +
          "shift. Comparing hashes is `O(1)` instead of `O(m)` — at the price " +
          "of collisions, which you verify away."
      },

      num: {
        t: "Collision probability with a random prime modulus",
        h: ["Modulus", "Comparisons", "Collision chance"],
        r: [
          ["10⁹ (single)", "10⁶", "~0.1%"],
          ["10⁹ (single)", "10⁸", "~99% — **certain**"],
          ["Double hash (~10¹⁸)", "10⁸", "~10⁻²"],
          ["Double hash", "10⁶", "negligible"]
        ],
        n: "By the birthday paradox, a single 10⁹ modulus fails with near " +
          "certainty at 10⁸ comparisons — which sounds like a lot until you " +
          "note that comparing all pairs of substrings reaches it easily. Hence " +
          "**double hashing**: two independent moduli, giving an effective " +
          "space near 10¹⁸. The second rule is to choose the base and modulus " +
          "**randomly at runtime**, because fixed well-known values (base 31, " +
          "mod 10⁹+7) have published anti-hash tests that construct collisions " +
          "deliberately. This is the same **hash flooding** attack that " +
          "language runtimes randomise their seeds to prevent."
      },

      miss: [
        {
          w: "A rolling hash match means the strings are equal.",
          r: "It means they are **probably** equal. Rabin-Karp verifies " +
            "character by character on a hash match, which keeps it correct — " +
            "and is why its worst case is `O(nm)` if an adversary forces " +
            "constant collisions. Skipping verification makes it a Monte Carlo " +
            "algorithm: fast and occasionally wrong."
        },
        {
          w: "Using a large prime modulus makes collisions impossible.",
          r: "It makes them unlikely **per comparison**. Do enough comparisons " +
            "and they become likely — the birthday bound is the relevant " +
            "maths, not the per-pair probability. Count your comparisons before " +
            "choosing a modulus."
        },
        {
          w: "Any base works as long as it is prime.",
          r: "The base should exceed the alphabet size, or distinct strings map " +
            "to identical values trivially. It should also be chosen randomly " +
            "if input might be adversarial. The **modulus** must be prime; the " +
            "base benefits from being coprime to it."
        },
        {
          w: "Rolling hashes are only for string matching.",
          r: "The technique generalises. **rsync** and content-defined chunking " +
            "use rolling hashes to find shared blocks between files; Rabin " +
            "fingerprinting underpins deduplication in backup systems. Any " +
            "sliding-window comparison over a sequence can use one."
        }
      ],

      trade: {
        buys: [
          "`O(1)` window updates and `O(1)` substring comparison after " +
            "precomputation.",
          "Compares arbitrary substrings, not only a fixed pattern.",
          "Simple to implement and generalises beyond strings.",
          "Enables binary search on substring length in `O(n log n)`."
        ],
        costs: [
          "Probabilistic — collisions must be handled or accepted.",
          "Vulnerable to adversarial input without randomisation.",
          "Modular arithmetic invites overflow bugs.",
          "Double hashing doubles the work."
        ],
        avoid: [
          "You need a guaranteed worst case — **KMP** or **Z-algorithm** are " +
            "deterministic and linear.",
          "The input is adversarial and you cannot randomise.",
          "You are searching for one fixed pattern in ordinary text — " +
            "Boyer-Moore is usually faster.",
          "You need approximate matching, which hashing cannot do."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "binary-lifting",

      why: {
        before: "Finding a node's k-th ancestor meant walking up one parent at " +
          "a time — `O(k)`, and `O(n)` on a degenerate tree. Lowest common " +
          "ancestor queries were the same walk from both sides.",
        problem: "With many queries on a large tree that is far too slow, and " +
          "the walk repeats work: every query from the same node retraces the " +
          "same path.",
        shift: "Precompute **each node's 2^k-th ancestor** for every power of " +
          "two. Any k decomposes into powers of two — its binary " +
          "representation — so any ancestor query becomes at most `log n` jumps " +
          "using precomputed pointers. It is the tree analogue of a skip list."
      },

      num: {
        t: "Ancestor and LCA queries",
        h: ["Method", "Preprocess", "Query", "Memory"],
        r: [
          ["Naive walk", "O(1)", "O(n)", "n"],
          ["**Binary lifting**", "O(n log n)", "**O(log n)**", "n log n"],
          ["Euler tour + sparse table", "O(n log n)", "**O(1)**", "n log n"],
          ["Tarjan offline", "O(n α(n))", "amortised", "n"]
        ],
        n: "The build is one line of recurrence: `up[k][v] = " +
          "up[k-1][ up[k-1][v] ]` — the 2^k-th ancestor is the 2^(k−1)-th " +
          "ancestor of the 2^(k−1)-th ancestor. For **LCA**, lift both nodes to " +
          "the same depth, then jump both upward by decreasing powers of two " +
          "whenever their ancestors *differ*; they end one step below the LCA. " +
          "Euler tour with a sparse table is asymptotically better at `O(1)` " +
          "per query, and binary lifting is preferred in practice because it is " +
          "shorter, handles **weighted** path queries (max edge on a path) " +
          "naturally, and extends to dynamic trees more easily."
      },

      miss: [
        {
          w: "Binary lifting only computes LCA.",
          r: "LCA is one application. The same table answers *k-th ancestor*, " +
            "*maximum edge weight on a path*, *sum along a path*, and any other " +
            "associative aggregate — store the aggregate alongside the ancestor " +
            "pointer at each level."
        },
        {
          w: "You need to precompute log₂(n) levels exactly.",
          r: "You need **at least** `ceil(log2(n))`. Using too few silently " +
            "gives wrong answers for deep trees, which is a nasty bug because " +
            "shallow test cases pass. Rounding up — 20 levels for n ≤ 10⁶ — " +
            "costs a little memory and removes the failure mode."
        },
        {
          w: "It works on any graph.",
          r: "It requires a **rooted tree** — every node has exactly one parent. " +
            "On a general graph *ancestor* is undefined. For a DAG you need " +
            "different machinery, and for undirected graphs you must root the " +
            "tree first."
        },
        {
          w: "The tree can change between queries.",
          r: "The table is precomputed from a fixed structure; any edge change " +
            "invalidates it. Dynamic trees need **link-cut trees** or Euler " +
            "tour trees, which are substantially harder."
        }
      ],

      trade: {
        buys: [
          "`O(log n)` ancestor and LCA queries after one preprocessing pass.",
          "Extends to path aggregates — max, min, sum along a path.",
          "Conceptually simple: a two-line recurrence.",
          "No heavy machinery, unlike link-cut trees."
        ],
        costs: [
          "`n log n` memory.",
          "Requires a static rooted tree.",
          "Preprocessing is `O(n log n)`.",
          "Off-by-one on the level count fails silently on deep trees."
        ],
        avoid: [
          "The tree changes — you need link-cut or Euler tour trees.",
          "You need `O(1)` LCA and have the memory — Euler tour plus sparse " +
            "table.",
          "All queries are known in advance — **Tarjan's offline LCA** is " +
            "near-linear.",
          "The tree is small enough that walking up is fine."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "two-heaps",

      why: {
        before: "Finding the median of a stream meant keeping everything, " +
          "sorting, and taking the middle — `O(n log n)` for every query.",
        problem: "The median only requires knowing the **boundary** between the " +
          "lower and upper halves. Maintaining a full sort computes far more " +
          "than the question needs, and re-sorting on every insertion is " +
          "wasteful.",
        shift: "Keep two heaps: a **max-heap of the smaller half** and a " +
          "**min-heap of the larger half**. The median sits at their tops. " +
          "Insertion is `O(log n)` and reading the median is `O(1)` — you " +
          "maintain exactly the boundary and nothing else."
      },

      num: {
        t: "Running median",
        h: ["Approach", "Insert", "Query median", "Memory"],
        r: [
          ["Sort each time", "O(1)", "O(n log n)", "n"],
          ["Sorted list + binary search", "**O(n)** to shift", "O(1)", "n"],
          ["**Two heaps**", "**O(log n)**", "**O(1)**", "n"],
          ["Order-statistic tree", "O(log n)", "O(log n)", "n"]
        ],
        n: "The invariant is the whole implementation: **sizes differ by at " +
          "most one**, and every element in the max-heap is ≤ every element in " +
          "the min-heap. Insert into one, then rebalance by moving the top " +
          "across if needed. With an odd count the larger heap's top *is* the " +
          "median; with an even count it is the average of both tops. The " +
          "pattern generalises well beyond medians — any problem needing the " +
          "k-th element of a stream, or a partition maintained under insertion, " +
          "uses the same two-heap idea."
      },

      miss: [
        {
          w: "The two heaps must always be the same size.",
          r: "They must differ by **at most one**. Forcing exact equality is " +
            "impossible with an odd count. The convention — which heap holds " +
            "the extra element — determines how you read the median, and " +
            "picking one and being consistent is what matters."
        },
        {
          w: "You can delete arbitrary elements from the heaps.",
          r: "A binary heap supports removing the **top**, not an arbitrary " +
            "element. Sliding-window median therefore needs **lazy deletion** " +
            "— mark elements dead and skip them when they surface — plus size " +
            "bookkeeping that excludes them. This is the fiddly part of the " +
            "windowed variant."
        },
        {
          w: "It gives you percentiles too.",
          r: "It gives the **median** specifically, because the boundary you " +
            "maintain is the middle. An arbitrary percentile needs the heaps " +
            "kept at a different ratio, which is possible and less clean. For " +
            "general quantiles on a stream, **t-digest** or **KLL sketches** " +
            "are the right tools."
        },
        {
          w: "It requires a custom max-heap implementation.",
          r: "Most languages provide only a min-heap. Negate the values on the " +
            "way in and out and a min-heap becomes a max-heap. Writing a second " +
            "heap class is unnecessary."
        }
      ],

      trade: {
        buys: [
          "`O(log n)` insert with `O(1)` median lookup.",
          "Streams naturally — no need to store or re-sort.",
          "Uses standard library heaps with a negation trick.",
          "Generalises to maintaining any partition under insertion."
        ],
        costs: [
          "Rebalancing logic is easy to get subtly wrong.",
          "Arbitrary deletion needs lazy removal and careful counting.",
          "Only the median comes free; other quantiles do not.",
          "Two structures to keep in sync."
        ],
        avoid: [
          "The data is static — sort once and index the middle.",
          "You need arbitrary percentiles — use a quantile sketch.",
          "You need order statistics generally — an order-statistic tree is " +
            "more flexible.",
          "The window is small enough to re-sort cheaply each time."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hash-flooding",

      why: {
        before: "Hash tables were analysed as `O(1)` average case, and that " +
          "average was assumed to describe production behaviour.",
        problem: "*Average* assumes **random** keys. An attacker choosing keys " +
          "is not random. If the hash function is deterministic and public — as " +
          "every language's was — an attacker can compute thousands of strings " +
          "that hash to the same bucket, and the table degrades to a linked " +
          "list. Every insertion becomes `O(n)`, and n insertions become " +
          "`O(n²)`.",
        shift: "Make the hash function **unpredictable per process**. Seed it " +
          "randomly at startup so the attacker cannot precompute collisions " +
          "against your specific instance. The 2011 disclosure affected PHP, " +
          "Java, Python, Ruby, ASP.NET and V8 simultaneously — every one had " +
          "the same flaw."
      },

      num: {
        t: "The 2011 attack, in practice",
        h: ["Metric", "Normal", "Under attack"],
        r: [
          ["Insert n colliding keys", "O(n)", "**O(n²)**"],
          ["Keys needed", "—", "a few thousand"],
          ["Request size", "—", "**~1 MB of POST data**"],
          ["CPU consumed", "milliseconds", "**minutes**"]
        ],
        n: "The devastating part is the **asymmetry**: about a megabyte of form " +
          "data — trivial for an attacker to send — consumed minutes of server " +
          "CPU. A handful of requests could exhaust a server, and it looked like " +
          "ordinary traffic. The general defences are now standard: **SipHash** " +
          "as a keyed, fast, cryptographically-motivated hash (default in Rust " +
          "and Python); random per-process seeding; and limiting the number of " +
          "parameters per request. Go took a different route and **randomises " +
          "map iteration order** so programs cannot depend on it, which also " +
          "discourages assumptions attackers could exploit."
      },

      miss: [
        {
          w: "This is a theoretical attack that does not happen.",
          r: "It was demonstrated live against every major web platform at 28C3 " +
            "in 2011, and prompted coordinated emergency patches across PHP, " +
            "Python, Ruby, Java and Node. It remains a live concern for any new " +
            "system that hashes untrusted input with a fixed function."
        },
        {
          w: "Using a cryptographic hash like SHA-256 fixes it.",
          r: "It does, and at enormous cost — SHA-256 is far too slow for " +
            "hash-table lookups on every operation. **SipHash** exists exactly " +
            "for this niche: keyed and collision-resistant enough for the " +
            "purpose, and fast enough for a hash table."
        },
        {
          w: "It only affects web servers parsing form data.",
          r: "It affects any hash table keyed by untrusted input: HTTP headers, " +
            "JSON keys, query parameters, cache keys, log fields. Anywhere an " +
            "attacker chooses the keys, they choose the buckets."
        },
        {
          w: "Randomising the seed makes it impossible.",
          r: "It makes precomputation impossible, which raises the bar " +
            "enormously. A determined attacker can still attempt to *learn* the " +
            "seed through timing side-channels if the application leaks timing " +
            "information. Randomisation plus a bound on input size is the " +
            "robust answer."
        }
      ],

      trade: {
        buys: [
          "Understanding it turns an abstract `O(n)` worst case into a concrete " +
            "threat model.",
          "The defence — random seeding — is essentially free.",
          "Explains why runtimes randomise hashes and iteration order.",
          "Generalises to a lesson: average-case bounds do not hold against " +
            "adversaries."
        ],
        costs: [
          "Keyed hashes are marginally slower than simple ones.",
          "Randomised iteration order breaks code that depended on it.",
          "Non-reproducible ordering complicates debugging.",
          "Input limits can reject legitimate large requests."
        ],
        avoid: [
          "Keys are entirely internal and never attacker-controlled — a fast " +
            "unkeyed hash is fine.",
          "You need reproducible hashing across processes, as in a distributed " +
            "shard mapping — then use a fixed hash and control the key space.",
          "The runtime already randomises for you, which most now do — do not " +
            "reimplement it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lfu-cache",

      why: {
        before: "**LRU** evicted whatever was used least recently, which is a " +
          "good proxy for what will be used next and is simple to implement.",
        problem: "LRU has a specific blind spot: **a scan wipes it out**. Read " +
          "a million rows once and every one of them is more recent than the " +
          "hot working set you have been serving for hours, so all of it is " +
          "evicted. Recency treats a one-off sweep as evidence of importance.",
        shift: "Track **frequency** instead. An item accessed a thousand times " +
          "is not evicted by an item accessed once, regardless of when. Scans " +
          "cannot pollute the cache, because the scanned items never accumulate " +
          "enough hits to displace anything."
      },

      num: {
        t: "Eviction policies against workload",
        h: ["Policy", "Scan-resistant", "Adapts to change", "Complexity"],
        r: [
          ["LRU", "**no**", "yes, quickly", "O(1), simple"],
          ["LFU", "**yes**", "**no** — stale items stick", "O(1) with care"],
          ["LFU with ageing", "yes", "yes", "more complex"],
          ["ARC / W-TinyLFU", "yes", "yes", "complex"]
        ],
        n: "LFU's own blind spot is the mirror of LRU's: **cache pollution by " +
          "history**. An item that was extremely popular last month keeps a " +
          "high count and cannot be evicted, even though nobody has requested " +
          "it since. The fix is **ageing** — periodically halve all counts, so " +
          "old popularity decays. Modern caches mostly use hybrids: " +
          "**W-TinyLFU** (Caffeine, and now many systems) uses a frequency " +
          "sketch to decide *admission* and LRU for eviction, getting scan " +
          "resistance without LFU's staleness. The `O(1)` LFU implementation — " +
          "buckets of equal-frequency items in a doubly linked list — is a " +
          "well-known interview question precisely because it is non-obvious."
      },

      miss: [
        {
          w: "LFU is better than LRU because frequency is more informative.",
          r: "It is better on **stable** access patterns and worse when " +
            "patterns shift, because old winners never leave. Neither dominates; " +
            "they fail in opposite directions, which is exactly why hybrids " +
            "exist."
        },
        {
          w: "LFU is O(log n) because you need a priority queue.",
          r: "The standard `O(1)` implementation uses a hash map to nodes plus " +
            "a doubly linked list of **frequency buckets**, each holding a list " +
            "of items with that count. Incrementing moves an item one bucket " +
            "along; eviction takes from the lowest bucket. All `O(1)`."
        },
        {
          w: "You should track exact frequencies.",
          r: "Exact counts cost memory per item and are rarely necessary. " +
            "**Count-Min Sketch** approximates frequencies in a fixed small " +
            "space, which is precisely what TinyLFU uses — it can track " +
            "frequency for far more items than the cache actually holds, " +
            "including ones it has already evicted."
        },
        {
          w: "A new item should start with a frequency of one.",
          r: "That makes new items immediately evictable and creates the " +
            "**new-item problem** — a genuinely popular new item may never " +
            "survive long enough to build a count. Admission policies, ageing, " +
            "or a small LRU window for new entries all address this; ignoring " +
            "it makes the cache blind to anything recent."
        }
      ],

      trade: {
        buys: [
          "Scan-resistant — a sequential sweep cannot evict the working set.",
          "Keeps genuinely hot items regardless of timing.",
          "`O(1)` with the bucket-list implementation.",
          "Better hit rates than LRU on stable workloads."
        ],
        costs: [
          "Stale popular items persist without ageing.",
          "New items struggle to establish themselves.",
          "More memory per entry for counts.",
          "More complex than LRU to implement correctly."
        ],
        avoid: [
          "Access patterns shift frequently — LRU adapts faster.",
          "You want simplicity; LRU is far easier and usually good enough.",
          "The workload is genuinely recency-driven, like a session cache.",
          "A modern hybrid is available — **W-TinyLFU** beats both in most " +
            "benchmarks."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
