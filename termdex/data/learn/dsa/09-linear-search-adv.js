/* DSA for Interviews — heaps past top-k, the sorting knowledge that actually
   gets asked, and tries. */
TD.addLessons("dsa", [

{
 t: "Heaps Past Top-K — Two Heaps, Merging and Scheduling",
 m: "linear",
 lvl: "advanced",
 s: "The running median, merging k sorted lists, and the scheduling problems that are a heap in disguise.",
 goal: [
  "Maintain a running median with two balanced heaps",
  "Merge k sorted sequences in O(n log k)",
  "Recognise the scheduling problems that reduce to a heap"
 ],
 b: [
  { p: "Top-k is the heap question everyone prepares. **These three are the ones that separate candidates**, and each has a tell in the wording that makes it recognisable." },

  { h: "Two heaps: the running median" },
  { p: "**The trigger is *median* or *middle* of a stream.** One heap holds the smaller half, the other the larger, and the median sits at the boundary between them." },

  { code: { lang: "python", t: "Median from a data stream",
    lines: [
     { c: "import heapq", w: "" },
     { c: "", w: "" },
     { c: "class MedianFinder:", w: "" },
     { c: "    def __init__(self):", w: "" },
     { c: "        self.lo = []", w: "**MAX heap (negated) — the smaller half.**", hi: true },
     { c: "        self.hi = []", w: "**MIN heap — the larger half.**" },
     { c: "", w: "" },
     { c: "    def add(self, x):", w: "" },
     { c: "        heapq.heappush(self.lo, -x)", w: "**Always push to lo first.**" },
     { c: "        heapq.heappush(self.hi, -heapq.heappop(self.lo))", w: "**Move lo's largest across — this enforces the ordering.**", hi: true },
     { c: "        if len(self.hi) > len(self.lo):", w: "" },
     { c: "            heapq.heappush(self.lo, -heapq.heappop(self.hi))", w: "**Rebalance so lo is never smaller.**", hi: true },
     { c: "", w: "" },
     { c: "    def median(self):", w: "" },
     { c: "        if len(self.lo) > len(self.hi):", w: "" },
     { c: "            return -self.lo[0]", w: "**Odd count — lo holds the extra.**" },
     { c: "        return (-self.lo[0] + self.hi[0]) / 2", w: "**Even — average the two tops.**" }
    ],
    after: "The push-then-move-then-rebalance sequence is deliberate and hard to improve on. **Pushing straight into the correct heap requires a comparison and gets the edge cases wrong**; routing everything through `lo` first makes the invariant automatic. `add` is O(log n), `median` is O(1)." } },

  { h: "Merging k sorted things" },
  { code: { lang: "python", t: "One heap of size k, not n",
    lines: [
     { c: "def merge_k(lists):", w: "" },
     { c: "    pq = []", w: "" },
     { c: "    for i, lst in enumerate(lists):", w: "" },
     { c: "        if lst:", w: "" },
     { c: "            heapq.heappush(pq, (lst[0], i, 0))", w: "**(value, which list, which index).**", hi: true },
     { c: "", w: "" },
     { c: "    out = []", w: "" },
     { c: "    while pq:", w: "" },
     { c: "        val, i, j = heapq.heappop(pq)", w: "**The smallest across all k fronts.**" },
     { c: "        out.append(val)", w: "" },
     { c: "        if j + 1 < len(lists[i]):", w: "" },
     { c: "            heapq.heappush(pq, (lists[i][j + 1], i, j + 1))", w: "**Refill from the list we just took from.**", hi: true },
     { c: "    return out", w: "**O(n log k)** — the heap never exceeds k entries." }
    ],
    after: "The list index `i` in the tuple is not decoration. **It breaks ties so Python never tries to compare two list objects**, which would raise a TypeError. The same trick is needed whenever you heap-push tuples whose first elements can be equal." } },

  { trap: "Concatenating everything and sorting is O(n log n), which sounds close to O(n log k) but is not the point — **the heap version uses O(k) memory instead of O(n)** and works on streams of unknown length. Say that trade-off out loud." },

  { h: "Scheduling problems in disguise" },
  { tbl: { t: "The tells",
    h: ["The question", "The heap holds", "Why"],
    rows: [
     ["*task scheduler with cooldown*", "Remaining counts, max-heap", "Always run the most frequent task next"],
     ["*meeting rooms II*", "End times, min-heap", "The earliest-finishing room is the one to reuse"],
     ["*k closest points*", "Distances, max-heap of size k", "Evict the furthest as you go"],
     ["*reorganise string*", "Character counts, max-heap", "Take the two most frequent each round"],
     ["*minimum cost to connect ropes*", "Rope lengths, min-heap", "Always join the two shortest"]
    ] } },

  { code: { lang: "python", t: "Meeting rooms with a heap",
    lines: [
     { c: "def min_rooms(intervals):", w: "" },
     { c: "    intervals.sort()", w: "**By start time.**" },
     { c: "    rooms = []", w: "**A min-heap of END times.**", hi: true },
     { c: "    for start, end in intervals:", w: "" },
     { c: "        if rooms and rooms[0] <= start:", w: "**The earliest-freeing room is already free.**", hi: true },
     { c: "            heapq.heappop(rooms)", w: "**Reuse it.**" },
     { c: "        heapq.heappush(rooms, end)", w: "" },
     { c: "    return len(rooms)", w: "**The heap size is the room count.**" }
    ],
    after: "This solves the same problem as the sweep line from the intervals lesson. **Being able to offer both, and say the heap version generalises better when you must know which room each meeting used, is exactly the kind of answer that scores well.**" } },

  { tryit: { t: "Three heap problems",
    task: "1. Find the k closest points to the origin\n2. Given a task list and a cooldown n between identical tasks, find the minimum time to finish\n3. Given ropes of various lengths, find the minimum cost to connect them all, where joining two costs their sum",
    hint: "1 wants a max-heap of size k, not a full sort. 2 is greedy: always run the most frequent available task. 3 is always join the two shortest.",
    sol: { lang: "python", code: "import heapq\nfrom collections import Counter\n\n# 1. MAX heap of size k -- O(n log k), not O(n log n)\ndef k_closest(points, k):\n    h = []\n    for x, y in points:\n        heapq.heappush(h, (-(x*x + y*y), x, y))   # negate for a max-heap\n        if len(h) > k:\n            heapq.heappop(h)                       # evict the furthest\n    return [[x, y] for _, x, y in h]\n\n# 2. GREEDY with a max-heap -- run the most frequent available task\ndef least_interval(tasks, n):\n    counts = [-c for c in Counter(tasks).values()]\n    heapq.heapify(counts)\n    time = 0\n    while counts:\n        cooling, cycle = [], n + 1\n        while cycle and counts:\n            c = heapq.heappop(counts) + 1          # run one (negated, so +1)\n            if c:\n                cooling.append(c)\n            time += 1\n            cycle -= 1\n        for c in cooling:\n            heapq.heappush(counts, c)\n        if counts:\n            time += cycle                          # idle out the rest\n    return time\n\n# 3. MIN heap -- always join the two cheapest\ndef connect_ropes(ropes):\n    heapq.heapify(ropes)\n    total = 0\n    while len(ropes) > 1:\n        a = heapq.heappop(ropes)\n        b = heapq.heappop(ropes)\n        total += a + b\n        heapq.heappush(ropes, a + b)\n    return total" },
    w: "Problem 3 is Huffman coding under another name. **The greedy choice — always merge the two smallest — is provably optimal** because the two smallest end up deepest in the merge tree and are therefore counted most often. That is a genuinely nice result to be able to explain." } },

  { vocab: ["Heap", "Priority Queue", "Greedy Algorithm", "Sorting Algorithm"] }
 ],
 k: [
  "*Median* or *middle of a stream* means two heaps: a max-heap for the low half, a min-heap for the high half.",
  "Push to `lo`, move its top to `hi`, then rebalance — routing everything one way keeps the invariant automatic.",
  "Merging k sorted lists is O(n log k) with O(k) memory; include a tiebreaker index in the tuple.",
  "*Earliest finishing*, *most frequent next*, *two smallest* — all heap tells.",
  "For a max-heap in Python, negate on the way in and on the way out."
 ],
 r: ["Heap", "Priority Queue", "Greedy Algorithm"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "heappush(hi, -heappop(lo))", w: "two heaps — move across, then rebalance" },
   { c: "heappush(pq, (val, i, j))", w: "tiebreaker index avoids comparing objects" },
   { c: "if rooms and rooms[0] <= start: heappop(rooms)", w: "reuse the earliest-freeing room" },
   { c: "heappush(h, -dist); if len(h) > k: heappop(h)", w: "k closest — max-heap of size k" }
  ]
 }
},

{
 t: "Sorting — What To Know, and What Nobody Asks",
 m: "search",
 lvl: "intermediate",
 s: "Stability, custom keys, quickselect, and the three sorts worth being able to discuss.",
 goal: [
  "Use custom sort keys, including multi-level and descending combinations",
  "Explain stability and when it changes an answer",
  "Apply quickselect for the k-th element in O(n) average time"
 ],
 b: [
  { p: "You will almost never be asked to implement a sort. **You will constantly be asked to sort by something unusual**, and occasionally to explain why a library sort behaves as it does. Prepare accordingly." },

  { h: "Custom keys, which is what actually comes up" },
  { code: { lang: "python", t: "Multi-level sorting",
    lines: [
     { c: "people.sort(key=lambda p: p.age)", w: "**One key.**" },
     { c: "people.sort(key=lambda p: (p.last, p.first))", w: "**Tuple — last name, then first.**", hi: true },
     { c: "people.sort(key=lambda p: (-p.score, p.name))", w: "**Score DESCENDING, name ascending.**", hi: true },
     { c: "", w: "" },
     { c: "# when the field is not numeric, negation is unavailable:", w: "" },
     { c: "people.sort(key=lambda p: p.name)", w: "**Sort by the secondary key first...**" },
     { c: "people.sort(key=lambda p: p.score, reverse=True)", w: "**...then the primary. Stability preserves the first sort.**", hi: true },
     { c: "", w: "" },
     { c: "from functools import cmp_to_key", w: "" },
     { c: "nums.sort(key=cmp_to_key(lambda a, b: 1 if a + b < b + a else -1))", w: "**Largest Number — comparator, not key.**", hi: true }
    ],
    after: "That two-pass trick is worth knowing: **because Python's sort is stable, sorting by the secondary key and then the primary gives a correct multi-level result** even when one direction cannot be expressed as a negation." } },

  { h: "Stability, and when it matters" },
  { p: "**A stable sort keeps equal elements in their original relative order.** It sounds academic until a question depends on it." },

  { tbl: { t: "The three worth discussing",
    h: ["Sort", "Time", "Space", "Stable", "Where it is used"],
    rows: [
     ["**Merge sort**", "O(n log n) always", "**O(n)**", "**Yes**", "Linked lists, external sorting, Python's Timsort"],
     ["**Quicksort**", "O(n log n) avg, **O(n²) worst**", "O(log n)", "No", "C++ `std::sort` (introsort), in-place speed"],
     ["**Heapsort**", "O(n log n) always", "**O(1)**", "No", "When worst-case matters and memory is tight"]
    ] } },

  { n: "Python's `sorted` is **Timsort** — a merge sort and insertion sort hybrid that is stable, O(n log n) worst case, and near O(n) on partly-sorted input. C++'s `std::sort` is **introsort**: quicksort that switches to heapsort when recursion runs deep, guaranteeing O(n log n) but *not* stable. **Knowing which language you are in makes this a two-sentence answer instead of a guess.**",
    nt: "What your language actually runs" },

  { h: "Quickselect: the k-th element without sorting" },
  { code: { lang: "python", t: "O(n) average, and where it comes from",
    lines: [
     { c: "import random", w: "" },
     { c: "", w: "" },
     { c: "def quickselect(nums, k):", w: "**k-th SMALLEST, zero-indexed.**" },
     { c: "    lo, hi = 0, len(nums) - 1", w: "" },
     { c: "    while lo <= hi:", w: "**Iterative — no recursion needed.**" },
     { c: "        p = partition(nums, lo, hi)", w: "**p lands at its final sorted position.**", hi: true },
     { c: "        if p == k:   return nums[p]", w: "**Found it.**" },
     { c: "        elif p < k:  lo = p + 1", w: "**Recurse into ONE side only.**", hi: true },
     { c: "        else:        hi = p - 1", w: "" },
     { c: "", w: "" },
     { c: "def partition(nums, lo, hi):", w: "" },
     { c: "    i = random.randint(lo, hi)", w: "**Random pivot — this is what avoids O(n²) on sorted input.**", hi: true },
     { c: "    nums[i], nums[hi] = nums[hi], nums[i]", w: "" },
     { c: "    pivot, store = nums[hi], lo", w: "" },
     { c: "    for j in range(lo, hi):", w: "" },
     { c: "        if nums[j] < pivot:", w: "" },
     { c: "            nums[store], nums[j] = nums[j], nums[store]", w: "" },
     { c: "            store += 1", w: "" },
     { c: "    nums[store], nums[hi] = nums[hi], nums[store]", w: "" },
     { c: "    return store", w: "" }
    ],
    after: "**T(n) = T(n/2) + O(n) → O(n)**, because you recurse into one side rather than both. The geometric series n + n/2 + n/4 ... sums to 2n. Worst case is still O(n²), which the random pivot makes vanishingly unlikely." } },

  { tbl: { t: "k-th largest: three valid answers",
    h: ["Approach", "Time", "Space", "Say this when"],
    rows: [
     ["Sort and index", "O(n log n)", "O(1)", "The obvious baseline — always mention it first"],
     ["**Min-heap of size k**", "**O(n log k)**", "O(k)", "k is small, or the data is a stream"],
     ["**Quickselect**", "**O(n) avg**", "O(1)", "You may mutate the array and want the best average"]
    ] } },

  { tryit: { t: "Sorting decisions",
    task: "1. Sort a list of version strings like '1.10.2' correctly\n2. Given a list of numbers, arrange them to form the largest possible number\n3. Find the k-th largest element in an unsorted array\n4. Sort a nearly-sorted array where each element is at most k positions from its place",
    hint: "1 needs a tuple key of integers. 2 needs a comparator. 4 has a better answer than any general sort.",
    sol: { lang: "python", code: "import heapq, random\nfrom functools import cmp_to_key\n\n# 1. tuple of ints -- '1.10.2' must beat '1.9.0'\ndef sort_versions(versions):\n    return sorted(versions, key=lambda v: tuple(int(p) for p in v.split('.')))\n    # string sort would put '1.10.2' BEFORE '1.9.0', because '1' < '9'\n\n# 2. COMPARATOR -- a is before b if a+b makes a bigger string than b+a\ndef largest_number(nums):\n    strs = [str(x) for x in nums]\n    strs.sort(key=cmp_to_key(lambda a, b: (a + b < b + a) - (a + b > b + a)))\n    out = ''.join(strs)\n    return '0' if out[0] == '0' else out      # all zeros -> '0', not '000'\n\n# 3. three answers; give the baseline, then improve\ndef kth_largest_heap(nums, k):\n    return heapq.nlargest(k, nums)[-1]        # O(n log k)\n\ndef kth_largest_quickselect(nums, k):\n    target = len(nums) - k                    # k-th largest = (n-k)-th smallest\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        p = partition(nums, lo, hi)\n        if   p == target: return nums[p]\n        elif p < target:  lo = p + 1\n        else:             hi = p - 1\n\n# 4. a HEAP of size k+1 beats any general sort here: O(n log k)\ndef sort_nearly_sorted(nums, k):\n    h, out = nums[:k + 1], []\n    heapq.heapify(h)\n    for i in range(k + 1, len(nums)):\n        out.append(heapq.heappushpop(h, nums[i]))\n    while h:\n        out.append(heapq.heappop(h))\n    return out" },
    w: "Problem 4 is the one worth internalising. **A general sort ignores the structure you were given**; because each element is within k of its home, a heap of size k+1 always contains the true next-smallest. Recognising that a constraint enables a better algorithm is the difference between an adequate answer and a strong one." } },

  { vocab: ["Sorting Algorithm", "Merge Sort", "Quick Sort", "Heap", "Time Complexity"] }
 ],
 k: [
  "Interviews test custom sort keys, not sort implementations — tuples for multi-level, `-x` for descending numerics.",
  "Because Python's sort is stable, sorting by the secondary key then the primary gives a correct multi-level order.",
  "Timsort (Python) is stable and O(n log n) worst case; introsort (C++) is not stable.",
  "Quickselect finds the k-th element in O(n) average by recursing into one side; randomise the pivot.",
  "For k-th largest, give three answers: sort O(n log n), heap O(n log k), quickselect O(n) average."
 ],
 r: ["Sorting Algorithm", "Merge Sort", "Quick Sort", "Heap"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "key=lambda p: (-p.score, p.name)", w: "descending primary, ascending secondary" },
   { c: "key=cmp_to_key(lambda a, b: ...)", w: "when a comparator beats a key" },
   { c: "if p < k: lo = p + 1 else: hi = p - 1", w: "quickselect — one side only" },
   { c: "heapq.nlargest(k, nums)[-1]", w: "k-th largest in O(n log k)" }
  ]
 }
},

{
 t: "Tries and Bit Manipulation",
 m: "search",
 lvl: "advanced",
 s: "Prefix trees for autocomplete and word search, and the bit tricks that turn a set into an integer.",
 goal: [
  "Build a trie and know when it beats a hash set",
  "Use the standard bit tricks and read them when written by someone else",
  "Represent a small set as a bitmask for subset problems"
 ],
 b: [
  { p: "Two topics that appear once a company is filtering hard. **Neither is difficult; both are unfamiliar**, and that unfamiliarity is exactly what makes them discriminating." },

  { h: "Tries: when a hash set is not enough" },
  { p: "**A hash set answers *is this exact word present?*. A trie answers *is any word with this prefix present?*** — and that question is what autocomplete, spell-check and word-search grids all need." },

  { code: { lang: "python", t: "A trie in fifteen lines",
    lines: [
     { c: "class Trie:", w: "" },
     { c: "    def __init__(self):", w: "" },
     { c: "        self.root = {}", w: "**A plain dict of dicts is enough — no node class needed.**", hi: true },
     { c: "", w: "" },
     { c: "    def insert(self, word):", w: "" },
     { c: "        node = self.root", w: "" },
     { c: "        for ch in word:", w: "" },
     { c: "            node = node.setdefault(ch, {})", w: "**Walk down, creating as needed.**", hi: true },
     { c: "        node['$'] = True", w: "**A sentinel marking a complete word.** Without it, 'app' is not distinguishable from a prefix of 'apple'.", hi: true },
     { c: "", w: "" },
     { c: "    def _walk(self, prefix):", w: "" },
     { c: "        node = self.root", w: "" },
     { c: "        for ch in prefix:", w: "" },
     { c: "            if ch not in node: return None", w: "" },
     { c: "            node = node[ch]", w: "" },
     { c: "        return node", w: "" },
     { c: "", w: "" },
     { c: "    def search(self, word):", w: "" },
     { c: "        node = self._walk(word)", w: "" },
     { c: "        return node is not None and '$' in node", w: "**Exact word — the sentinel must be there.**", hi: true },
     { c: "", w: "" },
     { c: "    def starts_with(self, prefix):", w: "" },
     { c: "        return self._walk(prefix) is not None", w: "**Prefix only — this is what a hash set cannot do.**", hi: true }
    ],
    after: "Costs: insert and search are **O(length of the word)**, independent of how many words are stored. Space is the total number of distinct prefixes, which is where a trie loses to a hash set when there is little prefix sharing." } },

  { tbl: { t: "Trie or hash set?",
    h: ["You need", "Use"],
    rows: [
     ["*Is this exact word in the dictionary?*", "**Hash set** — O(1), simpler, less memory"],
     ["**\"words starting with...\", autocomplete**", "**Trie**"],
     ["*Word search II* — many words in one grid", "**Trie** — search all words in one DFS"],
     ["*Longest common prefix* of many strings", "**Trie** — walk while there is one child"],
     ["*Replace words with their root form*", "**Trie** — stop at the first sentinel"],
     ["Wildcard matching, `.` matching any letter", "**Trie** + DFS over every child"]
    ] } },

  { n: "*Word Search II* is the question tries exist for. Searching 10,000 words one at a time over a grid is hopeless; **building one trie and running a single DFS that follows the trie and the grid together** turns it into one traversal. If a grid question gives you a word list, the answer is a trie.",
    nt: "The problem that makes tries worth learning" },

  { h: "Bit manipulation: the tricks worth memorising" },
  { code: { lang: "python", t: "Eight operations you should recognise instantly",
    lines: [
     { c: "x & 1", w: "**Odd?** Cheaper and clearer than `x % 2` in a bit context." },
     { c: "x >> 1", w: "**Halve it** (floor division by 2)." },
     { c: "x & (1 << i)", w: "**Is bit i set?**" },
     { c: "x | (1 << i)", w: "**Set bit i.**" },
     { c: "x & ~(1 << i)", w: "**Clear bit i.**" },
     { c: "x ^ (1 << i)", w: "**Flip bit i.**" },
     { c: "x & (x - 1)", w: "**Clear the LOWEST set bit.** Count set bits by looping until zero.", hi: true },
     { c: "x & -x", w: "**Isolate the lowest set bit.** The basis of Fenwick trees.", hi: true },
     { c: "", w: "" },
     { c: "x & (x - 1) == 0", w: "**Power of two** (for x > 0) — exactly one bit set.", hi: true },
     { c: "bin(x).count('1')", w: "**Python's readable popcount.** `int.bit_count()` from 3.10." }
    ] } },

  { h: "XOR, and the problems it solves outright" },
  { code: { lang: "python", t: "Three properties, and what they buy",
    lines: [
     { c: "x ^ x == 0", w: "**A value cancels itself.**", hi: true },
     { c: "x ^ 0 == x", w: "**Zero is the identity.**" },
     { c: "# XOR is commutative and associative -- order is irrelevant", w: "", hi: true },
     { c: "", w: "" },
     { c: "# single number: everything paired except one", w: "" },
     { c: "from functools import reduce", w: "" },
     { c: "import operator", w: "" },
     { c: "reduce(operator.xor, nums)", w: "**Pairs annihilate; the loner survives. O(n) time, O(1) space.**", hi: true },
     { c: "", w: "" },
     { c: "# missing number in 0..n", w: "" },
     { c: "reduce(operator.xor, nums + list(range(len(nums) + 1)))", w: "**No overflow risk, unlike the sum formula.**", hi: true },
     { c: "", w: "" },
     { c: "# swap without a temporary (a party trick, not production code)", w: "" },
     { c: "a ^= b; b ^= a; a ^= b", w: "**Fails when a and b are the same variable.**" }
    ] } },

  { h: "Bitmasks: a set as an integer" },
  { p: "**When n is at most about 20, a subset can be an integer** — bit i set means element i is included. That is what makes bitmask DP possible." },

  { code: { lang: "python", t: "Iterating every subset",
    lines: [
     { c: "for mask in range(1 << n):", w: "**All 2^n subsets, as integers.**", hi: true },
     { c: "    subset = [items[i] for i in range(n) if mask & (1 << i)]", w: "**Decode the mask.**" },
     { c: "", w: "" },
     { c: "# add or remove an element", w: "" },
     { c: "mask | (1 << i)", w: "**With element i.**" },
     { c: "mask & ~(1 << i)", w: "**Without it.**" },
     { c: "", w: "" },
     { c: "# every SUBSET of a mask -- the idiom worth knowing", w: "" },
     { c: "sub = mask", w: "" },
     { c: "while sub:", w: "" },
     { c: "    process(sub)", w: "" },
     { c: "    sub = (sub - 1) & mask", w: "**Enumerates submasks in descending order. O(3^n) over all masks.**", hi: true }
    ],
    after: "The `(sub - 1) & mask` idiom is genuinely clever and worth recognising even if you never write it: subtracting one borrows through the low zero bits, and the `& mask` clears anything not in the original set." } },

  { trap: "Python integers are arbitrary precision, so `~x` gives a negative number and `x << 40` just keeps growing. **In C++ or Java the same code overflows a 32-bit int.** If you write bit tricks in an interview, say which language's semantics you are assuming — `x & 0xFFFFFFFF` masks to 32 bits when it matters." },

  { tryit: { t: "Tries and bits",
    task: "1. Implement autocomplete: given a prefix, return every word beneath it\n2. Given an array where every number appears twice except one, find it in O(1) space\n3. Count the set bits in every number from 0 to n\n4. Given n ≤ 20 items, find the subset with the maximum value under a constraint",
    hint: "2 is XOR. 3 has a one-line DP using `i >> 1`. 4 is a bitmask loop.",
    sol: { lang: "python", code: "from functools import reduce\nimport operator\n\n# 1. TRIE -- walk to the prefix, then collect everything below\ndef autocomplete(trie_root, prefix):\n    node = trie_root\n    for ch in prefix:\n        if ch not in node:\n            return []\n        node = node[ch]\n    out = []\n    def collect(node, path):\n        if '$' in node:\n            out.append(prefix + path)\n        for ch, child in node.items():\n            if ch != '$':\n                collect(child, path + ch)\n    collect(node, '')\n    return out\n\n# 2. XOR -- pairs cancel, the loner survives\ndef single_number(nums):\n    return reduce(operator.xor, nums)\n\n# 3. counting bits -- DP on the halved value\ndef count_bits(n):\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1):\n        dp[i] = dp[i >> 1] + (i & 1)   # bits of i/2, plus i's own last bit\n    return dp\n\n# 4. BITMASK -- every subset as an integer\ndef best_subset(items, limit):\n    n = len(items)\n    best = 0\n    for mask in range(1 << n):\n        weight = value = 0\n        for i in range(n):\n            if mask & (1 << i):\n                weight += items[i].weight\n                value  += items[i].value\n        if weight <= limit:\n            best = max(best, value)\n    return best                         # O(2^n * n) -- fine for n <= 20" },
    w: "Problem 3's recurrence is the elegant one: **the bits of i are the bits of i/2 plus i's own final bit**, because shifting right drops exactly one bit. One line, O(n), and it looks like magic until you say that sentence." } },

  { vocab: ["Trie", "Bit Manipulation", "Hash Table", "Depth-First Search", "Space Complexity"] }
 ],
 k: [
  "A trie answers prefix questions; a hash set only answers exact-match ones. Use a sentinel to mark whole words.",
  "*Word Search II* and autocomplete are the problems tries exist for — one DFS over trie and grid together.",
  "`x & (x-1)` clears the lowest set bit; `x & -x` isolates it; `x & (x-1) == 0` tests for a power of two.",
  "XOR cancels pairs, so it finds the unpaired element in O(n) time and O(1) space with no overflow risk.",
  "For n ≤ 20, a subset is an integer: `for mask in range(1 << n)` enumerates all of them."
 ],
 r: ["Trie", "Bit Manipulation", "Hash Table", "Space Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "node = node.setdefault(ch, {})", w: "trie insert — walk and create" },
   { c: "x & (x - 1)", w: "clear the lowest set bit" },
   { c: "reduce(operator.xor, nums)", w: "the unpaired element, O(1) space" },
   { c: "for mask in range(1 << n):", w: "every subset as an integer" }
  ]
 }
}

]);
