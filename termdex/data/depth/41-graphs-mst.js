/* ==========================================================================
   Depth pass 41 — minimum spanning trees, and the two greedy algorithms that
   build them.

   MSTs are the cleanest case in the whole subject of greedy being *provably*
   optimal. Kruskal and Prim make completely different local choices and
   arrive at the same weight every time, because both are justified by the
   same underlying theorem — the cut property. Understanding that theorem is
   worth more than memorising either algorithm.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "minimum-spanning-tree",

      why: {
        before: "Connecting a set of points — towns to a power grid, offices " +
          "to a network, terminals to a hub — was solved by inspection or by " +
          "connecting each point to its nearest neighbour.",
        problem: "Nearest-neighbour connection creates redundant links and " +
          "leaves some points unreachable. And the true question is not local: " +
          "**what is the cheapest set of links that connects everything?** " +
          "Checking every subset of edges is exponential.",
        shift: "Formalise it as a **minimum spanning tree**: a subset of edges " +
          "connecting all vertices with no cycles and minimum total weight. " +
          "The structural facts fall out immediately — any spanning tree of " +
          "`V` vertices has exactly **`V − 1` edges**, and adding one more " +
          "must create a cycle. And unlike most optimisation problems, this " +
          "one has a **provably optimal greedy solution**."
      },

      num: {
        t: "Facts that follow from the definition",
        h: ["Fact", "Why"],
        r: [
          ["**Exactly V − 1 edges**", "**fewer disconnects, more makes a cycle**"],
          ["**Cut property**", "**the lightest edge across any cut is in some MST**"],
          ["Cycle property", "the heaviest edge in a cycle is in no MST"],
          ["**Unique if all weights differ**", "**ties allow several MSTs**"],
          ["Total weight is unique", "**even when the tree is not**"],
          ["**Not a shortest-path tree**", "**minimises total, not each path**"]
        ],
        n: "The **cut property** is the theorem that makes greedy work, and " +
          "both algorithms are the same theorem applied differently. Split the " +
          "vertices into any two groups; the lightest edge crossing that split " +
          "is safe to take. **Prim** always cuts between *visited* and " +
          "*unvisited*; **Kruskal** implicitly cuts around the two components " +
          "an edge would join. That shared justification is why two different " +
          "greedy rules never disagree on the total. The **last row** is the " +
          "confusion worth pre-empting: an MST minimises the **sum of all " +
          "edges**, not the distance between any particular pair. The path " +
          "from A to B in an MST is often longer than the true shortest path — " +
          "for that you want **Dijkstra**, which solves a different problem."
      },

      miss: [
        {
          w: "The MST gives the shortest path between any two nodes.",
          r: "It minimises the **total weight of the tree**, not individual " +
            "paths. The A-to-B route through an MST can be far longer than the " +
            "true shortest path. Shortest paths are **Dijkstra's** problem; " +
            "the two trees are usually different."
        },
        {
          w: "There is one minimum spanning tree per graph.",
          r: "Only if all edge weights are **distinct**. With ties, several " +
            "distinct MSTs can exist — though they all have the **same total " +
            "weight**. Tests asserting a specific edge set are fragile; assert " +
            "the weight."
        },
        {
          w: "MSTs need positive weights, like Dijkstra.",
          r: "**Negative weights are fine.** Dijkstra's problem with negatives " +
            "is that a later negative edge can improve an already-finalised " +
            "path. MST algorithms only ever compare weights against each " +
            "other, so the sign is irrelevant."
        },
        {
          w: "Every graph has an MST.",
          r: "Only **connected** graphs do. A disconnected graph has a " +
            "**minimum spanning forest** — one tree per component. Kruskal " +
            "produces this naturally; Prim from a single start only reaches one " +
            "component, which is a real source of silently incomplete output."
        }
      ],

      trade: {
        buys: [
          "Cheapest possible connection of every vertex.",
          "Greedy is **provably optimal** — rare and valuable.",
          "`O(E log V)` — fast on large graphs.",
          "Underpins clustering, network design and approximation algorithms."
        ],
        costs: [
          "Does not minimise individual path lengths.",
          "Requires a connected graph for a single tree.",
          "Undirected only — directed needs arborescence algorithms.",
          "Not unique when weights tie, complicating testing."
        ],
        avoid: [
          "You need shortest paths — use **Dijkstra**.",
          "The graph is directed — that is Chu–Liu/Edmonds.",
          "Redundant paths are needed for fault tolerance — a tree has none.",
          "There are constraints such as degree limits, which make it NP-hard."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kruskal-s-algorithm",

      why: {
        before: "Given the cut property, an MST can be built greedily. The " +
          "open question is **which greedy rule** to apply.",
        problem: "The simplest rule — *always take the globally cheapest edge " +
          "not yet used* — is obviously appealing and immediately runs into a " +
          "difficulty: how do you know an edge would create a cycle without " +
          "traversing the partial tree each time? Naive checking makes the " +
          "algorithm quadratic.",
        shift: "**Sort all edges, then add each one unless it joins two " +
          "vertices already connected.** The cycle check becomes a " +
          "**union-find** query — nearly `O(1)` with path compression and " +
          "union by rank. The tree grows as a **forest** of disconnected " +
          "fragments that gradually merge, which is what makes Kruskal " +
          "naturally correct on disconnected graphs."
      },

      num: {
        t: "Where the time goes",
        h: ["Step", "Cost", "Note"],
        r: [
          ["**Sorting edges**", "**O(E log E)**", "**dominates the total**"],
          ["Union-find operations", "O(E · α(V))", "**α < 5 in practice**"],
          ["Total", "**O(E log E) = O(E log V)**", "since E < V²"],
          ["Space", "O(V + E)", "needs all edges in memory"]
        ],
        n: "**Sorting is the whole cost**, which has a useful consequence: if " +
          "the edges arrive already sorted, or the weights are small integers " +
          "sortable in linear time, Kruskal drops to near-linear. The " +
          "union-find term involves the **inverse Ackermann function** `α`, " +
          "which is below 5 for any input that will ever exist — effectively " +
          "constant, though not formally so. The structural comparison against " +
          "Prim is the practical decision: Kruskal considers edges **globally**, " +
          "so it wants an edge list and suits **sparse** graphs; Prim grows one " +
          "connected region, so it wants an adjacency structure and, with a " +
          "Fibonacci heap, wins on **dense** graphs at `O(E + V log V)`."
      },

      miss: [
        {
          w: "Kruskal needs the graph to be connected.",
          r: "It does not. On a disconnected graph it produces a **minimum " +
            "spanning forest** — the correct answer for each component — " +
            "without any special handling. Prim started from one vertex " +
            "silently covers only that component."
        },
        {
          w: "The cycle check requires traversing the tree.",
          r: "That would make it quadratic. **Union-find** answers *are these " +
            "two vertices already connected?* in near-constant time by tracking " +
            "component representatives. Kruskal's practicality depends " +
            "entirely on this structure."
        },
        {
          w: "Sorting must happen before any edge is added.",
          r: "A **priority queue** works equally well and can be better when " +
            "you may stop early — once `V − 1` edges are accepted the MST is " +
            "complete, so you need not have sorted the remaining edges at all."
        },
        {
          w: "Kruskal and Prim can give different total weights.",
          r: "**Never.** Both are justified by the cut property, so both " +
            "produce a minimum spanning tree. They may select **different " +
            "edges** when weights tie, but the **total weight is always " +
            "identical**."
        }
      ],

      trade: {
        buys: [
          "Simple to state and implement.",
          "Handles disconnected graphs, producing a spanning forest.",
          "Efficient on sparse graphs.",
          "Near-linear when the edges are already sorted.",
          "Union-find is reusable for connectivity generally."
        ],
        costs: [
          "Needs the full edge list in memory.",
          "Sorting dominates the runtime.",
          "Requires a union-find implementation.",
          "Weaker than Prim on dense graphs."
        ],
        avoid: [
          "The graph is dense — **Prim** with a heap is better.",
          "Edges cannot all be held in memory.",
          "The graph is given as an adjacency matrix — Prim suits it.",
          "You need shortest paths rather than an MST."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prim-s-algorithm",

      why: {
        before: "Kruskal builds an MST by scanning edges globally, which " +
          "requires sorting every edge in the graph before adding the first " +
          "one.",
        problem: "On a **dense** graph, `E` approaches `V²`, so sorting all " +
          "edges is expensive — and most of them will never be used. Many are " +
          "also irrelevant: an edge between two vertices you have not reached " +
          "cannot be your next choice.",
        shift: "**Grow one tree outward from a start vertex.** At each step " +
          "take the cheapest edge crossing from the tree to a vertex outside " +
          "it. That is the cut property applied to a single moving cut, so " +
          "correctness follows immediately — and the candidate edges live in a " +
          "**priority queue** rather than a global sort. Structurally it is " +
          "Dijkstra with a different key: **edge weight** instead of " +
          "**accumulated distance**."
      },

      num: {
        t: "Complexity by priority-queue implementation",
        h: ["Queue", "Complexity", "Best for"],
        r: [
          ["**Array scan**", "**O(V²)**", "**dense graphs, adjacency matrix**"],
          ["**Binary heap**", "**O(E log V)**", "**sparse graphs — the usual choice**"],
          ["Fibonacci heap", "**O(E + V log V)**", "**dense, theoretically optimal**"],
          ["No queue (naive)", "O(V·E)", "never"]
        ],
        n: "The table is the reason Prim and Kruskal coexist. On a dense graph " +
          "where `E ≈ V²`, the plain array scan at `O(V²)` **beats** the binary " +
          "heap's `O(E log V) = O(V² log V)` — the fancier structure loses. " +
          "Fibonacci heaps are asymptotically best and have constants large " +
          "enough that binary heaps usually win in practice. The " +
          "implementation detail that matters: rather than deleting stale " +
          "entries when a vertex's cheapest connecting edge improves, most " +
          "implementations **push a new entry and skip already-visited " +
          "vertices on pop** — a *lazy* queue, which is simpler and faster than " +
          "supporting decrease-key. And the trap: **Prim from a single start " +
          "vertex only spans that vertex's component**, so on a disconnected " +
          "graph it silently returns a partial answer."
      },

      miss: [
        {
          w: "The starting vertex affects the result.",
          r: "It can change **which** MST you get when weights tie, and never " +
            "the **total weight**. Any start yields a minimum spanning tree — " +
            "the cut property holds regardless of where the cut begins."
        },
        {
          w: "Prim is just Dijkstra.",
          r: "The structure is nearly identical; the **key differs**. Dijkstra " +
            "prioritises by **total distance from the source**, Prim by the " +
            "**single edge weight** connecting to the tree. That one change " +
            "makes one produce shortest paths and the other a minimum spanning " +
            "tree."
        },
        {
          w: "A binary heap is always the right structure.",
          r: "On a **dense** graph a simple `O(V²)` array scan is faster — " +
            "there are so many edges that heap operations cost more than " +
            "scanning. Match the structure to the density, which is the whole " +
            "point of the table above."
        },
        {
          w: "Prim works on any graph.",
          r: "From one start vertex it only reaches that vertex's " +
            "**component**. On a disconnected graph it returns a tree for that " +
            "component and silently ignores the rest. **Kruskal** handles " +
            "disconnection naturally."
        }
      ],

      trade: {
        buys: [
          "Efficient on dense graphs, especially with a matrix.",
          "No global sort — a priority queue suffices.",
          "Works incrementally; the partial tree is always valid.",
          "Familiar if you know Dijkstra.",
          "Needs only the edges adjacent to the growing tree."
        ],
        costs: [
          "Only spans the start vertex's component.",
          "Needs adjacency structure, not just an edge list.",
          "Priority queue and lazy-deletion handling add complexity.",
          "Weaker than Kruskal on very sparse graphs."
        ],
        avoid: [
          "The graph is disconnected and you need a spanning forest — " +
            "**Kruskal**.",
          "The graph is very sparse.",
          "You only have an unsorted edge list.",
          "You want shortest paths — that is **Dijkstra**."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "multi-source-bfs",

      why: {
        before: "Breadth-first search answers *how far is everything from " +
          "**this** node?* — one source, expanding outward in layers.",
        problem: "Real questions often have many sources. *How far is each " +
          "cell from the **nearest** fire?* *Which warehouse is closest to each " +
          "address?* *How many days until every orange rots, given several " +
          "rotten ones?* Running BFS from each source separately costs " +
          "`O(sources × (V + E))` and then requires taking minimums.",
        shift: "**Seed the queue with every source at distance zero.** The BFS " +
          "then expands all sources simultaneously, and because BFS visits in " +
          "non-decreasing distance order, **the first source to reach a node " +
          "is necessarily the nearest one**. One traversal, `O(V + E)`, " +
          "regardless of how many sources there are."
      },

      num: {
        t: "The cost of the naive approach",
        h: ["Sources", "Repeated BFS", "Multi-source BFS"],
        r: [
          ["1", "O(V + E)", "O(V + E)"],
          ["10", "10 × O(V + E)", "**O(V + E)**"],
          ["**1,000**", "**1,000 × O(V + E)**", "**O(V + E)**"],
          ["V (all nodes)", "O(V·(V + E))", "**O(V + E)**"]
        ],
        n: "The saving is a **factor equal to the number of sources**, and it " +
          "costs one line of code — pushing every source before the loop " +
          "instead of one. The correctness argument is worth stating precisely, " +
          "because it is what generalises: BFS dequeues nodes in " +
          "non-decreasing distance order, so when a node is first reached, no " +
          "shorter route from any source can still be pending. This is exactly " +
          "the invariant behind **Dijkstra with a virtual super-source** — " +
          "conceptually, multi-source BFS adds an imaginary node with " +
          "zero-weight edges to every source. The same trick extends to " +
          "weighted graphs with a priority queue, and to **0-1 BFS** with a " +
          "deque. The constraint that carries over: BFS gives shortest paths " +
          "only on **unweighted** graphs (or uniform weights)."
      },

      miss: [
        {
          w: "You must run BFS once per source and take minimums.",
          r: "That is the naive approach and costs a factor of `sources` more. " +
            "**Seeding the queue with all sources at once** gives the same " +
            "answer in a single traversal, because BFS's layer order " +
            "guarantees the first arrival is the nearest source."
        },
        {
          w: "It tells you which source reached each node.",
          r: "Not unless you track it. The default records only **distance**. " +
            "Storing the originating source alongside — propagated as you " +
            "expand — turns it into a **Voronoi partition** of the graph, " +
            "which is often the more useful output."
        },
        {
          w: "It works on weighted graphs.",
          r: "Plain BFS gives shortest paths only when **all edges have equal " +
            "weight**. With varying weights you need **Dijkstra seeded with " +
            "multiple sources**, which is the same idea using a priority queue " +
            "instead of a FIFO."
        },
        {
          w: "It is a specialised competitive-programming trick.",
          r: "It is the standard solution to nearest-facility problems: " +
            "distance to the nearest hospital, flood fill from multiple seeds, " +
            "infection spread modelling, and image processing distance " +
            "transforms. The pattern is common once recognised."
        }
      ],

      trade: {
        buys: [
          "`O(V + E)` regardless of the number of sources.",
          "One line of change from ordinary BFS.",
          "Directly yields nearest-source distances.",
          "Extends to Voronoi partitioning by tracking origins.",
          "Generalises to Dijkstra for weighted graphs."
        ],
        costs: [
          "Unweighted or uniform-weight graphs only.",
          "Does not record the source unless you add it.",
          "The queue starts large with many sources.",
          "Gives distance to the nearest source, not to each."
        ],
        avoid: [
          "Edges have differing weights — **multi-source Dijkstra**.",
          "You need the distance to **every** source, not the nearest.",
          "The graph is weighted with negative edges — Bellman-Ford.",
          "There is only one source, where plain BFS is the same thing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "monotonic-stack",

      why: {
        before: "*What is the next taller building to the right of each " +
          "building?* answered by scanning forward from every position — " +
          "`O(n²)`, and quadratic on the sorted-ish inputs where it matters.",
        problem: "That scan repeats work in a specific, exploitable way. If " +
          "building B is shorter than building A and stands to its right, then " +
          "**B can never be the answer for anything left of A** — A blocks it. " +
          "The naive scan rediscovers this at every position.",
        shift: "**Keep a stack that is deliberately kept sorted.** Before " +
          "pushing a new element, pop everything it dominates — and each pop " +
          "*is* an answer being resolved. Every element is pushed once and " +
          "popped once, so despite the nested loop the total is **`O(n)`**. " +
          "The stack holds exactly the elements still waiting for an answer."
      },

      num: {
        t: "Which direction the stack should be sorted",
        h: ["Question", "Stack order", "Pop when"],
        r: [
          ["**Next greater element**", "**decreasing**", "**new > top**"],
          ["Next smaller element", "increasing", "new < top"],
          ["**Largest rectangle in histogram**", "**increasing**", "**new < top**"],
          ["Daily temperatures", "decreasing", "new > top"],
          ["Trapping rain water", "decreasing", "new > top"]
        ],
        n: "The rule that makes the table memorable: **the stack holds " +
          "elements still waiting for an answer, so it is sorted in the " +
          "direction where no element on it can answer another.** Looking for " +
          "the next *greater* element means anything smaller further left is " +
          "still waiting — hence a **decreasing** stack. The amortised " +
          "argument is the same one behind sliding window: each element enters " +
          "and leaves once, so `2n` operations total even though a single " +
          "iteration may pop many items. The **histogram** row is the classic " +
          "hard application, and it turns an `O(n²)` problem into `O(n)` " +
          "because popping a bar tells you exactly where its rectangle ends. " +
          "A **sentinel** value at each end removes the fiddly leftover-stack " +
          "handling and is worth adding."
      },

      miss: [
        {
          w: "A nested loop with pops is still `O(n²)`.",
          r: "The **amortised** argument settles it: each element is pushed " +
            "once and popped once, so total operations are bounded by `2n` no " +
            "matter how the pops distribute. Counting the nested loop " +
            "structurally rather than by total work gives the wrong answer."
        },
        {
          w: "The stack stores values.",
          r: "It usually stores **indices**, because the answer generally needs " +
            "a position or a distance — *how many days until a warmer one* " +
            "requires the index gap, not the temperature. Values can be looked " +
            "up from the index; the reverse is not true."
        },
        {
          w: "Leftover stack entries are a bug.",
          r: "They are meaningful: elements that **never found an answer**. In " +
            "*next greater element* they are the ones with nothing greater to " +
            "their right. Handle them explicitly, or push a **sentinel** that " +
            "flushes the stack."
        },
        {
          w: "It only applies to next-greater problems.",
          r: "It solves largest rectangle in a histogram, trapping rain water, " +
            "maximal rectangles in a binary matrix, stock spans, and — as a " +
            "**monotonic deque** — sliding window maximum. The unifying idea is " +
            "*discard candidates that can never win*."
        }
      ],

      trade: {
        buys: [
          "`O(n²)` to `O(n)` on next-greater and span problems.",
          "`O(n)` space worst case, often much less.",
          "One pass — usable on streams.",
          "Extends to a deque for sliding-window extremes."
        ],
        costs: [
          "Only applies where dominated candidates can be discarded.",
          "The stack direction must be reasoned about, not guessed.",
          "Leftover entries need explicit handling.",
          "Less obvious to read than a nested loop."
        ],
        avoid: [
          "You need all pairs, not the nearest qualifying one.",
          "No dominance relation exists between elements.",
          "The input is tiny and clarity matters more.",
          "You need window extremes — use a monotonic **deque**."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sweep-line",

      why: {
        before: "Interval problems — overlapping meetings, colliding " +
          "rectangles, maximum concurrent connections — were solved by " +
          "comparing **every pair** of intervals. `O(n²)`.",
        problem: "Pairwise comparison ignores that intervals live on a line " +
          "with an inherent order. Two intervals separated in time cannot " +
          "overlap, and the pairwise loop keeps checking them anyway.",
        shift: "**Turn each interval into two events — a start and an end — " +
          "sort all events by position, and process them in order** while " +
          "maintaining a running count or an active set. An imaginary line " +
          "sweeps across, and the state changes only at events. `O(n log n)`, " +
          "dominated by the sort, and the running count at each moment is " +
          "exactly the answer to *how many are active right now?*"
      },

      num: {
        t: "The classic applications",
        h: ["Problem", "State tracked", "Cost"],
        r: [
          ["**Maximum concurrent intervals**", "**a counter**", "**O(n log n)**"],
          ["Merge overlapping intervals", "current merged span", "O(n log n)"],
          ["Meeting rooms needed", "**counter — its peak**", "O(n log n)"],
          ["Rectangle union area", "**active y-intervals (segment tree)**", "O(n log n)"],
          ["Closest pair of points", "active set in a window", "O(n log n)"]
        ],
        n: "The detail that decides correctness is **tie handling at equal " +
          "positions**: if one meeting ends at 10:00 and another starts at " +
          "10:00, do they overlap? For rooms they do not, so **ends must be " +
          "processed before starts** — otherwise you allocate a room too many. " +
          "For *maximum simultaneous connections* where an endpoint counts as " +
          "present, the opposite order applies. Get this wrong and the answer " +
          "is off by one on exactly the inputs people test with. The " +
          "**rectangle union** row shows the pattern's ceiling: the sweep " +
          "reduces a 2D problem to a sequence of 1D problems, but maintaining " +
          "the active y-intervals efficiently needs a **segment tree** — the " +
          "sweep provides the structure, not the whole solution."
      },

      miss: [
        {
          w: "Sweep line is only for computational geometry.",
          r: "It originated there and applies to **any interval problem**: " +
            "meeting room allocation, peak concurrent users from log " +
            "timestamps, calendar conflicts, resource scheduling. Anything with " +
            "a start and an end on an ordered axis."
        },
        {
          w: "Tie handling at equal coordinates is a detail.",
          r: "It **is** the correctness condition. Whether an end event is " +
            "processed before a start at the same coordinate decides whether " +
            "touching intervals count as overlapping — an off-by-one in the " +
            "final answer, and the most common bug in sweep implementations."
        },
        {
          w: "You must store all events before sorting.",
          r: "If events **arrive in order** — log entries by timestamp, for " +
            "instance — you can sweep as a **stream** in `O(n)` with `O(1)` " +
            "state. Sorting is only needed when the input is unordered."
        },
        {
          w: "The active set is always just a counter.",
          r: "For counting problems, yes. Rectangle union needs a **segment " +
            "tree** of active y-intervals; closest-pair needs a balanced set " +
            "ordered by the other coordinate. The sweep provides ordering; the " +
            "structure maintaining active state is a separate design decision."
        }
      ],

      trade: {
        buys: [
          "`O(n²)` to `O(n log n)` on interval and geometry problems.",
          "Sorted input reduces it to `O(n)` streaming.",
          "State is only examined at events, not continuously.",
          "One framework covering many superficially different problems."
        ],
        costs: [
          "Requires sorting unless events already arrive ordered.",
          "Tie handling is subtle and easy to get wrong.",
          "Complex applications need an auxiliary structure.",
          "Needs all events up front for unsorted input."
        ],
        avoid: [
          "There is no natural ordering axis.",
          "Intervals are multi-dimensional without a sweepable axis — use an " +
            "R-tree.",
          "The data is tiny and a nested loop is clearer.",
          "Intervals change during processing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "difference-array",

      why: {
        before: "**Prefix sums** answer *what is the sum of range [i, j]?* in " +
          "`O(1)` after `O(n)` preprocessing — a well-known trick. Its " +
          "limitation is that any update invalidates the whole prefix array.",
        problem: "Many workloads are the mirror image: **many range updates, " +
          "then read**. *Add 5 to every seat between rows 10 and 200*, " +
          "repeated a hundred thousand times, then report the final state. " +
          "Applying each update element by element is `O(range)` each, so a " +
          "hundred thousand wide updates is quadratic.",
        shift: "**Record only where the change starts and stops.** Add the " +
          "delta at index `i` and subtract it at `j + 1`. Each update is " +
          "**`O(1)` regardless of range width**, and one prefix-sum pass at " +
          "the end reconstructs the array in `O(n)`. It is exactly the inverse " +
          "of a prefix sum, and the two are used together."
      },

      num: {
        t: "Difference array against prefix sum",
        h: ["", "Prefix sum", "Difference array"],
        r: [
          ["Optimises", "**range queries**", "**range updates**"],
          ["Query cost", "**O(1)**", "O(n) to materialise"],
          ["Update cost", "**O(n) rebuild**", "**O(1)**"],
          ["Workload", "**build once, query often**", "**update often, read once**"],
          ["Both frequent", "—", "**use a Fenwick or segment tree**"]
        ],
        n: "The **last row** is the honest boundary: difference arrays win " +
          "decisively when all updates precede all reads, and collapse when " +
          "the two interleave, because every read costs a full `O(n)` " +
          "reconstruction. Mixed workloads want a **Fenwick tree** or " +
          "**segment tree with lazy propagation** at `O(log n)` for both. " +
          "Concretely: 100,000 updates each spanning 1,000 elements is " +
          "**100 million** operations naively and **100,000 plus one pass** " +
          "with a difference array. The technique extends to two dimensions " +
          "— a rectangle update becomes **four** point updates (`+d` at the " +
          "top-left, `−d` at the two edges past it, `+d` at the corner " +
          "beyond), reconstructed with a 2D prefix sum. That is the " +
          "inclusion–exclusion pattern, and the sign errors are the usual bug."
      },

      miss: [
        {
          w: "It is a general-purpose range update structure.",
          r: "It assumes **all updates happen before any read**. If reads " +
            "interleave with updates, every read costs `O(n)` to materialise. " +
            "Mixed workloads need a **Fenwick** or **segment tree**."
        },
        {
          w: "It only handles addition.",
          r: "It works for any **invertible** operation — addition, XOR, " +
            "multiplication over non-zero values. It fails for `min` or `max`, " +
            "which have no inverse, so you cannot cancel the effect at the end " +
            "of the range."
        },
        {
          w: "The `j + 1` index is an off-by-one to be careful about.",
          r: "It is the **mechanism**. The subtraction at `j + 1` is what stops " +
            "the delta propagating past the range during the prefix-sum pass. " +
            "You must also size the array `n + 1` so that a range ending at " +
            "the last element has somewhere to write."
        },
        {
          w: "It is an obscure competitive-programming device.",
          r: "It is the standard approach to bulk range updates: seat booking " +
            "systems, flight bookings across date ranges, applying many " +
            "overlapping schedule changes, and — in 2D — image processing " +
            "operations over rectangular regions."
        }
      ],

      trade: {
        buys: [
          "`O(1)` per range update regardless of width.",
          "`O(n)` single reconstruction pass.",
          "`O(n)` space — no auxiliary tree.",
          "Trivial to implement correctly once the indexing is understood.",
          "Extends to 2D with four point updates per rectangle."
        ],
        costs: [
          "Reads require a full `O(n)` reconstruction.",
          "Useless when reads interleave with updates.",
          "Requires an invertible operation.",
          "2D sign handling is error-prone."
        ],
        avoid: [
          "Reads and updates interleave — **Fenwick** or **segment tree**.",
          "The operation is `min` or `max` — not invertible.",
          "You need single-point updates and range queries — that is a prefix " +
            "sum's job.",
          "The array is too large to materialise."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lru-cache",

      why: {
        before: "A fixed-size cache must evict something when full. The " +
          "simplest policies — evict at random, or evict the oldest inserted " +
          "(FIFO) — are cheap and ignore how the data is actually used.",
        problem: "FIFO evicts an entry that has been read a thousand times " +
          "simply because it arrived first. Real access patterns exhibit " +
          "**temporal locality**: something used recently is likely to be used " +
          "again soon. A policy ignoring that discards exactly the entries " +
          "worth keeping.",
        shift: "**Evict whatever was used longest ago.** The implementation " +
          "problem is doing it in `O(1)` — a list gives ordering but `O(n)` " +
          "lookup, a hash map gives lookup but no ordering. The answer is " +
          "**both**: a hash map from key to node, plus a **doubly linked " +
          "list** ordering nodes by recency. Get, put and evict are all `O(1)`."
      },

      num: {
        t: "Eviction policies compared",
        h: ["Policy", "Evicts", "Weakness"],
        r: [
          ["FIFO", "oldest inserted", "ignores usage"],
          ["**LRU**", "**least recently used**", "**one big scan flushes it**"],
          ["LFU", "least frequently used", "**stale items with old high counts**"],
          ["**LRU-K / SLRU**", "**by K-th most recent use**", "more state"],
          ["**ARC / W-TinyLFU**", "**adapts between recency and frequency**", "**complex**"],
          ["Random", "anything", "surprisingly decent, trivial"]
        ],
        n: "The weakness that bites in production is **scan resistance**: a " +
          "single sequential pass over a large table — a backup job, an " +
          "analytics query — touches every key once, evicting the entire " +
          "genuinely-hot working set for data that will never be read again. " +
          "This is why databases do not ship plain LRU: **PostgreSQL** uses " +
          "clock-sweep, **MySQL InnoDB** splits its buffer pool into young and " +
          "old sublists so a scanned page must be touched twice to be " +
          "promoted, and **Caffeine** (the standard Java cache) uses " +
          "W-TinyLFU. Two implementation notes: **`get` is a mutation** — it " +
          "moves a node to the front — so an LRU cache needs a write lock even " +
          "for reads, which is a real contention point under concurrency; and " +
          "the **doubly** linked list is required because eviction must unlink " +
          "a node in `O(1)`, which a singly linked list cannot do."
      },

      miss: [
        {
          w: "LRU is the best general-purpose caching policy.",
          r: "It is the best **simple** one and is **not scan-resistant**. One " +
            "sequential pass over a large dataset evicts the entire hot working " +
            "set. Production databases and caches use segmented LRU, " +
            "clock-sweep, ARC or W-TinyLFU precisely because of this."
        },
        {
          w: "A singly linked list would do.",
          r: "Eviction and reordering must **unlink a node in `O(1)`**, which " +
            "requires knowing its predecessor. A singly linked list makes that " +
            "`O(n)`. The doubly linked list is what preserves the constant-time " +
            "guarantee."
        },
        {
          w: "Reads do not modify the cache.",
          r: "In LRU, **`get` mutates** — it promotes the entry to most " +
            "recently used. That means reads need write access, so a shared " +
            "LRU cache is a lock contention point. Concurrent caches batch " +
            "these promotions or use probabilistic ordering instead."
        },
        {
          w: "LRU and LFU are roughly equivalent.",
          r: "They fail differently. LRU discards a frequently-used item after " +
            "one scan; LFU **keeps** an item that was popular last week and is " +
            "now irrelevant, because its count is high and never decays. " +
            "Modern policies such as **W-TinyLFU** combine both with aging."
        }
      ],

      trade: {
        buys: [
          "`O(1)` get, put and evict.",
          "Exploits temporal locality, which most workloads have.",
          "Simple to reason about and implement.",
          "Bounded memory by construction.",
          "Available in most standard libraries."
        ],
        costs: [
          "Not scan-resistant — one sweep flushes the working set.",
          "Reads mutate, so concurrent access needs write locks.",
          "Two structures to keep in sync.",
          "Pointer overhead per entry.",
          "Ignores frequency entirely."
        ],
        avoid: [
          "The workload includes large scans — use **SLRU** or " +
            "**W-TinyLFU**.",
          "Access is uniformly random — recency carries no signal.",
          "Frequency matters more than recency.",
          "Entries must expire by time — that is a TTL cache."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
