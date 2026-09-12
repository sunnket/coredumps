/* Logic Vault — complexity, cost and the structures you choose between.

   Nothing here is a derivation. Every card is a fact you should be able to
   produce in the middle of a sentence, because in a design discussion there
   is no time to work it out. */

TD.addLogicDeck("complexity", {
  id: "bigo-core",
  name: "Big-O, said properly",
  lvl: "core",
  why: "Every performance conversation uses this vocabulary. Using it loosely marks you out faster than not using it at all.",
  cards: [

    { t: "What Big-O actually measures",
      recall: "How the cost grows as the input grows — not how fast the code is.",
      why: "It deliberately throws away constants and lower-order terms, because those depend on the machine, the language and the compiler, while the growth rate is a property of the algorithm itself. An O(n) algorithm can lose to an O(n log n) one on small inputs; Big-O tells you who wins as n keeps rising, which is the question that matters when the input is a user-supplied dataset.",
      use: ["Comparing two approaches before writing either",
            "Explaining why something that worked in testing died in production",
            "Any interview sentence beginning 'this is'"],
      trap: "O(n) is an upper bound, not a promise. Quicksort is O(n squared) in the worst case and people still call it n log n, because that is the average. Say which one you mean when it matters.",
      r: ["Big O Notation", "Time Complexity"] },

    { t: "The growth table",
      recall: "O(1) < O(log n) < O(n) < O(n log n) < O(n squared) < O(2^n) < O(n!)",
      why: "Order matters more than the individual terms. Log is the one people underestimate: log base 2 of a million is about 20, so a binary search over a million items is twenty comparisons. That is why halving the search space is the single most powerful trick in algorithms.",
      num: [["log2(1,000)", "~10"], ["log2(1,000,000)", "~20"], ["log2(1,000,000,000)", "~30"]],
      use: ["Sizing whether an approach is viable before coding it"],
      trap: "n log n is much closer to n than to n squared. People avoid sorting as if it were expensive; sorting a million items is roughly 20 million operations, which is nothing. Sorting to enable a linear pass afterwards is very often the right move.",
      r: ["Big O Notation", "Logarithm"] },

    { t: "What n is allowed to be",
      recall: "Rough budget: 10^8 simple operations per second in a compiled language, 10^6 to 10^7 in Python.",
      why: "This converts complexity into a yes/no answer. If n is a million and your algorithm is O(n squared), that is 10^12 operations — hours. If it is O(n log n), that is 2 x 10^7 — under a second. You can do this arithmetic in your head during a conversation and it will save you writing the wrong thing.",
      num: [["n = 1,000", "n squared is fine"], ["n = 100,000", "need n log n"], ["n = 10,000,000", "need O(n) or better"]],
      use: ["Deciding whether the brute force is acceptable",
            "Competitive programming time limits",
            "Estimating a batch job before running it"],
      trap: "Python is roughly 50-100x slower per operation than C. An algorithm that is 'fast enough' in a tutorial written in C++ may not be in your notebook — which is exactly why vectorising with NumPy matters.",
      r: ["Time Complexity"] },

    { t: "Amortised cost",
      recall: "Expensive occasionally, cheap on average — and the average is the honest number.",
      why: "Appending to a dynamic array is usually O(1), but when it runs out of room it allocates a bigger block and copies everything, which is O(n). Because it doubles the capacity, that copy happens rarely enough that the average cost per append is still constant. The same logic covers hash table resizing.",
      use: ["Explaining why list.append is O(1) despite the occasional copy",
            "Justifying a structure that has an occasional slow operation"],
      trap: "Amortised does not mean predictable. If you need a latency guarantee on every single call — a real-time system, a tight p99 — an amortised O(1) with an occasional O(n) spike may be unacceptable even though the average is excellent.",
      r: ["Array", "Hash Table"] },

    { t: "Space complexity counts too",
      recall: "Memory has a growth rate as well, and it is the one that gets you killed by the OS.",
      why: "An algorithm that is fast but O(n) in space fails on inputs that a slower O(1)-space version would handle. Recursion is the quiet case: each call keeps a stack frame, so a recursive walk over a million-node list is O(n) space and overflows the stack long before it is slow.",
      use: ["Choosing between recursion and iteration",
            "Deciding whether to stream or materialise",
            "Explaining an out-of-memory crash"],
      trap: "In Python the default recursion limit is 1000. A recursive solution that is elegant on a balanced tree of depth 20 will hit that ceiling on a degenerate tree of depth 10,000 — which is exactly what a sorted list inserted into an unbalanced BST produces.",
      r: ["Recursion", "Stack"] }
  ]
});

TD.addLogicDeck("complexity", {
  id: "latency",
  name: "The latency numbers",
  lvl: "core",
  why: "These decide architectures. Knowing the ratios stops you optimising the wrong layer by three orders of magnitude.",
  cards: [

    { t: "Latency, ordered",
      recall: "Memory is nanoseconds, SSD is microseconds, network is milliseconds. Each step is roughly 1000x.",
      why: "The exact figures drift with hardware but the ratios have held for decades, and the ratios are what you reason with. A cache hit in RAM against a cross-region network call is a factor of about a million — which is why caching is the first lever anyone reaches for.",
      num: [["L1 cache", "~1 ns"], ["Main memory", "~100 ns"], ["SSD read", "~100 us"],
            ["Same-datacentre round trip", "~0.5 ms"], ["Disk seek (HDD)", "~10 ms"],
            ["India to US round trip", "~150 ms"]],
      use: ["Deciding what to cache", "Explaining why a chatty API is slow",
            "Sizing whether a call belongs in a request path at all"],
      trap: "The cost that matters is usually the number of round trips, not the size of the payload. Ten sequential 5 ms calls is 50 ms; one call returning ten times the data is still 5 ms. This is the N+1 query problem, and it is the most common performance bug in application code.",
      r: ["Latency", "Caching", "N+1 Query Problem"] },

    { t: "Throughput is not latency",
      recall: "Latency is how long one thing takes. Throughput is how many things per second.",
      why: "They trade against each other. Batching improves throughput and worsens latency for the individual item — you wait to accumulate a batch. Every GPU inference server sits on this trade-off, and choosing a batch size *is* choosing a point on it.",
      use: ["Tuning a model serving endpoint",
            "Explaining why adding workers did not make a single request faster"],
      trap: "Averages hide the problem. Quote p95 or p99, not the mean: if one request in a hundred takes ten seconds, the mean barely moves and one per cent of your users are furious.",
      r: ["Throughput", "Latency", "Batch Processing"] },

    { t: "Little's Law",
      recall: "Items in the system = arrival rate x time each item spends in it. L = λW.",
      why: "It is the one queueing result worth memorising, because it needs no assumptions about the distribution. If 100 requests arrive per second and each takes 0.2 s, there are 20 in flight at any moment — so you need at least 20 concurrent workers, and a pool of 10 will build a queue forever.",
      num: [["λ = 100/s, W = 0.2s", "L = 20 concurrent"]],
      use: ["Sizing a worker pool or connection pool",
            "Explaining why a queue grows without bound",
            "Capacity planning in a system design round"],
      trap: "If arrival rate exceeds service rate, the queue does not settle at a large size — it grows without limit until something breaks. Backpressure exists precisely to make this failure visible rather than fatal.",
      r: ["Queue", "Throughput"] }
  ]
});

TD.addLogicDeck("structures", {
  id: "structure-choice",
  name: "Which structure, and why",
  lvl: "core",
  why: "Most performance problems are a structure chosen by habit rather than by cost. These are the costs.",
  cards: [

    { t: "Array / list",
      recall: "Index is O(1). Search is O(n). Insert or delete in the middle is O(n).",
      why: "Elements sit contiguously in memory, so the address of item i is a single arithmetic step from the address of item 0. That contiguity is also why inserting in the middle costs — everything after it shifts. The same contiguity makes arrays dramatically cache-friendly, which is why a linear scan of an array often beats a theoretically better structure on real hardware.",
      use: ["Ordered data you mostly read by position", "Anything you will iterate over end to end"],
      trap: "`x in my_list` is O(n) and looks identical to `x in my_set`, which is O(1). A membership check inside a loop over a list is the most common accidental O(n squared) in Python.",
      code: { lang: "python", c: "if x in big_list:   # O(n) -- scans\nif x in big_set:    # O(1) -- hashes" },
      r: ["Array", "Cache Locality"] },

    { t: "Hash map / dict / set",
      recall: "Insert, lookup and delete are O(1) average, O(n) worst case. No order guarantee by key.",
      why: "A hash function turns the key into a bucket index, so finding it is arithmetic rather than searching. The worst case happens when many keys collide into one bucket, degrading to a linear scan — rare with a good hash, but the reason hash-collision attacks exist.",
      use: ["Counting and grouping", "De-duplication", "Any 'have I seen this before' question",
            "Turning a nested loop into a single pass"],
      trap: "Keys must be hashable, which in Python means immutable — a list cannot be a key, a tuple can. And since Python 3.7 dicts keep insertion order, which is a language guarantee people now rely on, but it is still not sorted order.",
      code: { lang: "python", c: "seen = {}\nfor i, n in enumerate(nums):\n    if target - n in seen:      # O(1) -- the whole trick\n        return (seen[target - n], i)\n    seen[n] = i" },
      r: ["Hash Table"] },

    { t: "Balanced binary search tree",
      recall: "Insert, lookup and delete are O(log n) — and it keeps things sorted.",
      why: "A hash map is faster for pure lookup, but it cannot answer 'what is the next largest key' or 'everything between these two values'. A tree can, because order is built into its structure. That is the entire reason to accept log n over constant.",
      use: ["Range queries", "Ordered iteration", "Finding the nearest value",
            "Database indexes (as a B-tree, the disk-friendly variant)"],
      trap: "Unbalanced is the failure mode. Inserting already-sorted data into a naive BST produces a linked list — O(n) per operation. Real implementations self-balance (red-black, AVL); a hand-rolled one in an interview usually does not, and saying so unprompted earns credit.",
      r: ["Binary Tree", "B-Tree", "Database Index"] },

    { t: "Heap / priority queue",
      recall: "Smallest (or largest) item in O(1); push and pop in O(log n).",
      why: "It maintains only enough order to know the extreme element — much cheaper than full sorting. That partial order is exactly what scheduling, merging and top-k problems need.",
      use: ["Top-k without sorting everything", "Task scheduling by priority",
            "Merging k sorted streams", "Dijkstra's algorithm"],
      trap: "Python's `heapq` is a min-heap only. For a max-heap, push negated values — and remember to negate them back. For top-k, `heapq.nlargest(k, xs)` is O(n log k), which beats sorting when k is small.",
      code: { lang: "python", c: "import heapq\nheapq.nlargest(10, scores)   # O(n log k), not O(n log n)" },
      r: ["Heap", "Priority Queue"] },

    { t: "Deque",
      recall: "O(1) push and pop at *both* ends. A list is O(n) at the front.",
      why: "`list.pop(0)` shifts every remaining element down one slot. Over a million-item queue that is a million shifts per pop — the classic accidental quadratic in queue code. A deque is a linked structure of blocks, so both ends are cheap.",
      use: ["Queues, BFS frontiers", "Sliding windows where both ends move",
            "Keeping the last n items (`deque(maxlen=n)`)"],
      trap: "Indexing into the middle of a deque is O(n), unlike a list. Use it for the ends; if you need random access, you want a list.",
      code: { lang: "python", c: "from collections import deque\nq = deque([1, 2, 3])\nq.popleft()          # O(1)\n# list.pop(0) would be O(n)" },
      r: ["Queue", "Breadth-First Search"] },

    { t: "Graph",
      recall: "Adjacency list for sparse graphs, adjacency matrix for dense ones.",
      why: "A list of neighbours per node costs O(V + E) space and makes 'who is adjacent to this node' fast — the question traversal actually asks. A matrix costs O(V squared) always, but answers 'is there an edge between exactly these two' in O(1). Most real graphs are sparse, so the list wins by default.",
      use: ["Anything with relationships: social, dependencies, routes, references"],
      trap: "Almost every real problem is a graph problem in disguise — course prerequisites, build order, spreadsheet cells, tool call dependencies. Noticing that is worth more than knowing the algorithms.",
      r: ["Graph", "Adjacency List"] },

    { t: "Trie",
      recall: "A tree keyed by character. Prefix lookup in O(length of the prefix), independent of how many words are stored.",
      why: "Each node is one character and each path from the root is a prefix, so finding every word starting with 'pre' means walking three nodes and then collecting the subtree. A hash map cannot do prefix queries at all.",
      use: ["Autocomplete", "Spell check", "IP routing tables", "Word games"],
      trap: "Memory-hungry — one node per character per unique prefix. For a small dictionary a sorted list plus binary search is simpler and usually enough. Reach for a trie when prefix queries are the main operation, not an occasional one.",
      r: ["Trie", "Prefix"] }
  ]
});
