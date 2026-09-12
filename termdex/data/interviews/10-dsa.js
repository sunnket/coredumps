/* Interview bank — DSA & algorithms.

   Every question here is one that is genuinely asked, phrased the way an
   interviewer phrases it. `simple` is the explanation you would give a friend
   at a whiteboard before the formal one; `answer` is what you would actually
   say in the room; `trap` is the wrong answer that sounds right. */
(function (TD) {
  "use strict";

  TD.addQuestions([
    {
      id: "dsa-two-sum-variants",
      q: "Given an array of integers and a target, return the indices of the two numbers that add to the target. Then: what changes if the array is sorted? What if you need all unique pairs?",
      topic: "DSA",
      level: "easy",
      companies: ["google", "microsoft", "amazon", "adobe", "flipkart", "tcs", "salesforce"],
      tags: ["hash-map", "two-pointer", "arrays"],
      simple: "You are looking for a partner for each number. Rather than checking every possible pair, write down each number you have already seen in a notebook. For each new number, you know exactly which partner you need — so just look it up. Checking the notebook is instant, and that is the entire trick.",
      answer: "## The one-pass hash map\n\nFor each element `x` at index `i`, the partner you need is `target - x`. Keep a map from value to index of everything seen so far, and check it before inserting.\n\n```python\ndef two_sum(nums, target):\n    seen = {}                     # value -> index\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            return [seen[need], i]\n        seen[x] = i               # insert AFTER the check\n    return []\n```\n\nTime $O(n)$, space $O(n)$. Inserting after the check is what stops an element pairing with itself when `target == 2 * x`.\n\n## If the array is sorted\n\nSorting gives you a better space bound. Put one pointer at each end and walk them toward each other:\n\n```python\ndef two_sum_sorted(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        s = nums[lo] + nums[hi]\n        if s == target:\n            return [lo, hi]\n        if s < target:\n            lo += 1               # need a bigger sum\n        else:\n            hi -= 1               # need a smaller sum\n    return []\n```\n\nTime $O(n)$, space $O(1)$. The reason this is correct: if `nums[lo] + nums[hi]` is too small, then `nums[lo]` paired with *anything* at or below `hi` is also too small, so `lo` can never be part of the answer with the current `hi` — advancing it discards no valid pair.\n\n## All unique pairs\n\nNow duplicates matter. Sort, use two pointers, and skip equal neighbours after each hit:\n\n```python\ndef all_pairs(nums, target):\n    nums.sort()\n    out, lo, hi = [], 0, len(nums) - 1\n    while lo < hi:\n        s = nums[lo] + nums[hi]\n        if s < target:\n            lo += 1\n        elif s > target:\n            hi -= 1\n        else:\n            out.append((nums[lo], nums[hi]))\n            lo += 1\n            hi -= 1\n            while lo < hi and nums[lo] == nums[lo - 1]:\n                lo += 1\n            while lo < hi and nums[hi] == nums[hi + 1]:\n                hi -= 1\n    return out\n```\n\n$O(n \\log n)$ for the sort, then $O(n)$.",
      takeaways: [
        "Insert into the map after the lookup, or an element pairs with itself.",
        "Two pointers need sorted input but drop space to $O(1)$.",
        "Uniqueness is handled by skipping equal neighbours, not by a set of results."
      ],
      followUps: [
        "Three-sum — fix one element, two-pointer the rest, $O(n^2)$.",
        "What if the array is too large for memory? (External sort, or a Bloom filter pre-pass.)",
        "What if you need the pair closest to the target rather than exactly equal?"
      ],
      trap: "Sorting first when the question asks for original indices. Once you sort, the indices are gone unless you sort (value, index) tuples — and at that point the hash map was simpler anyway."
    },
    {
      id: "dsa-lru-cache",
      q: "Design an LRU cache with $O(1)$ get and put.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "microsoft", "amazon", "meta-ai", "openai", "bytedance", "uber", "netflix", "adobe", "flipkart", "snowflake"],
      tags: ["hash-map", "linked-list", "design"],
      simple: "Think of a stack of papers on a desk. Every time you touch a paper you move it to the top. When the desk is full, you throw away whatever is at the bottom — that is the one you have not touched in longest. The only problem is finding a specific paper quickly, so you also keep an index that says exactly where in the stack each paper sits.",
      answer: "## Why one data structure is not enough\n\nYou need two things at once:\n\n- **Find a key in $O(1)$** — that is a hash map.\n- **Move an item to \"most recent\" and evict the least recent in $O(1)$** — that is a doubly linked list, where you hold a direct pointer to the node so unlinking is constant time.\n\nA singly linked list will not do: to unlink a node you need its predecessor, and finding that is $O(n)$.\n\n## The structure\n\nMap key → node. The list runs most-recent at the head, least-recent at the tail. Use sentinel head and tail nodes so no operation needs a null check.\n\n```python\nclass Node:\n    __slots__ = (\"key\", \"val\", \"prev\", \"next\")\n    def __init__(self, key=None, val=None):\n        self.key, self.val = key, val\n        self.prev = self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.map = {}\n        self.head = Node()          # sentinels: never removed\n        self.tail = Node()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def _unlink(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def _push_front(self, node):\n        node.next = self.head.next\n        node.prev = self.head\n        self.head.next.prev = node\n        self.head.next = node\n\n    def get(self, key):\n        node = self.map.get(key)\n        if node is None:\n            return -1\n        self._unlink(node)\n        self._push_front(node)      # touching it makes it most recent\n        return node.val\n\n    def put(self, key, val):\n        node = self.map.get(key)\n        if node:\n            node.val = val\n            self._unlink(node)\n            self._push_front(node)\n            return\n        if len(self.map) == self.cap:\n            lru = self.tail.prev\n            self._unlink(lru)\n            del self.map[lru.key]   # this is why the node stores its key\n        node = Node(key, val)\n        self.map[key] = node\n        self._push_front(node)\n```\n\n## The detail interviewers listen for\n\nThe node stores its **key**, not just its value. On eviction you have a pointer to the node and need to delete the corresponding map entry — without the key on the node you would have to scan the map, and the whole thing collapses to $O(n)$.\n\n## Making it thread-safe\n\nA single mutex around both operations is correct and usually fine. If contention is the problem, shard: run $k$ independent LRU caches keyed by `hash(key) % k`, each with its own lock. You lose exact global LRU ordering, which is almost always an acceptable trade.",
      takeaways: [
        "Hash map for lookup, doubly linked list for ordering — neither alone is enough.",
        "Store the key on the node so eviction can clean up the map in $O(1)$.",
        "Sentinel head and tail nodes remove every null check from the link operations."
      ],
      followUps: [
        "Implement LFU — needs a frequency-to-list map plus a min-frequency counter.",
        "Add a TTL. (Lazy expiry on read, plus a background sweep.)",
        "Make it thread-safe without a global lock. (Sharding, or a lock-free approximation like CLOCK.)"
      ],
      trap: "Using an ordered dictionary and calling it done. It is a fine answer in Python, but if you cannot explain what `OrderedDict.move_to_end` does underneath, the interviewer has learned nothing. Offer it as the production answer and then implement the real thing."
    },
    {
      id: "dsa-merge-intervals",
      q: "Given a list of intervals, merge all overlapping ones.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "microsoft", "amazon", "adobe", "uber", "salesforce", "flipkart"],
      tags: ["sorting", "intervals", "greedy"],
      simple: "Sort the meetings by when they start. Then walk through them holding one 'current' merged block. If the next meeting starts before your current block ends, they overlap — stretch the block's end. If it starts after, the block is finished; save it and start a new one.",
      answer: "## The algorithm\n\nSort by start. Then a single pass suffices, because once sorted, an interval can only overlap with the block you are currently building — never with an earlier, already-closed one.\n\n```python\ndef merge(intervals):\n    if not intervals:\n        return []\n    intervals.sort(key=lambda iv: iv[0])\n    out = [list(intervals[0])]\n    for start, end in intervals[1:]:\n        if start <= out[-1][1]:        # overlap (touching counts)\n            out[-1][1] = max(out[-1][1], end)\n        else:\n            out.append([start, end])\n    return out\n```\n\n$O(n \\log n)$ time, dominated by the sort; $O(n)$ output space, $O(1)$ auxiliary if you merge in place.\n\n## Why `max` on the end matters\n\nConsider `[[1, 10], [2, 3], [4, 12]]`. After merging the first two you have `[1, 10]`. The third starts at 4 which is inside, so it merges — but its end, 12, is *beyond* the current end. Writing `out[-1][1] = end` instead of `max(...)` would shrink the block to `[1, 12]`... and for `[[1,10],[2,3]]` it would produce `[1,3]`, silently losing coverage. This is the single most common bug in the problem.\n\n## The boundary question\n\nDo `[1, 5]` and `[5, 8]` overlap? With `start <= out[-1][1]` they merge into `[1, 8]`; with `start < out[-1][1]` they stay separate. Neither is wrong — ask which the problem wants. For calendars, a meeting ending at 5 and one starting at 5 do not conflict, so you would use strict `<`. For number ranges they usually do merge.",
      takeaways: [
        "Sorting by start is what makes a single pass sufficient.",
        "Always `max` the end — a nested interval will otherwise truncate the block.",
        "Ask whether touching endpoints count as overlapping; it is a real ambiguity, not a trick."
      ],
      followUps: [
        "Insert one interval into an already-merged list. ($O(n)$, no sort needed.)",
        "Find the minimum number of meeting rooms. (Sweep line with a min-heap of end times.)",
        "Interval intersection of two lists. (Two pointers, $O(n + m)$.)"
      ],
      trap: "Assigning the end instead of taking the maximum. It passes the obvious test cases and fails on a fully nested interval — which is exactly the case the interviewer will hand you."
    },
    {
      id: "dsa-course-schedule-toposort",
      q: "Given course prerequisites, determine whether all courses can be finished. Then produce a valid order.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "microsoft", "amazon", "meta-ai", "uber", "bytedance", "databricks", "palantir"],
      tags: ["graph", "topological-sort", "cycle-detection"],
      simple: "You can only take a course once its prerequisites are done. Repeatedly grab every course with no remaining prerequisites, take them, and cross them off other courses' lists. If you ever get stuck with courses left over, there is a circular dependency and it is impossible.",
      answer: "## Kahn's algorithm (BFS)\n\nModel it as a directed graph: an edge `a -> b` means `a` must come before `b`. Count in-degrees, start from every node with in-degree zero, and peel.\n\n```python\nfrom collections import deque\n\ndef find_order(num_courses, prerequisites):\n    graph = [[] for _ in range(num_courses)]\n    indeg = [0] * num_courses\n    for course, prereq in prerequisites:      # prereq -> course\n        graph[prereq].append(course)\n        indeg[course] += 1\n\n    q = deque(c for c in range(num_courses) if indeg[c] == 0)\n    order = []\n    while q:\n        c = q.popleft()\n        order.append(c)\n        for nxt in graph[c]:\n            indeg[nxt] -= 1\n            if indeg[nxt] == 0:\n                q.append(nxt)\n\n    return order if len(order) == num_courses else []   # short = cycle\n```\n\n$O(V + E)$ time and space.\n\n**The cycle test is free.** If a cycle exists, every node in it keeps a positive in-degree forever, so it never enters the queue and `order` comes up short. You do not need a separate cycle detector.\n\n## DFS alternative\n\nThree-colour DFS also works and is worth knowing because it detects the cycle *while* you are inside it, which makes reporting the offending cycle easy:\n\n```python\nWHITE, GREY, BLACK = 0, 1, 2\n\ndef can_finish(n, prereqs):\n    graph = [[] for _ in range(n)]\n    for c, p in prereqs:\n        graph[p].append(c)\n    colour = [WHITE] * n\n\n    def dfs(u):\n        colour[u] = GREY                # on the current path\n        for v in graph[u]:\n            if colour[v] == GREY:       # back edge -> cycle\n                return False\n            if colour[v] == WHITE and not dfs(v):\n                return False\n        colour[u] = BLACK               # fully explored\n        return True\n\n    return all(colour[u] != WHITE or dfs(u) for u in range(n))\n```\n\nThe topological order is the reverse of the order nodes turn black.\n\n## Which to use\n\nKahn's is easier to get right under pressure and gives you the order directly. DFS avoids the in-degree bookkeeping and recurses naturally, but on a deep graph it can blow the stack — mention that if the input could have 10⁵ nodes.",
      takeaways: [
        "Topological sort exists if and only if the graph is a DAG.",
        "In Kahn's algorithm, a short output *is* the cycle detection — no extra pass.",
        "Grey nodes in DFS are the current path; an edge into grey is a back edge and a cycle."
      ],
      followUps: [
        "Return the lexicographically smallest valid order. (Swap the queue for a min-heap.)",
        "There may be several valid orders — how would you count them? (#P-hard in general.)",
        "Handle 10 million edges that do not fit in memory. (External-memory or distributed peeling.)"
      ],
      trap: "Building the edge in the wrong direction. The input pair `[course, prereq]` means `prereq -> course`; reversing it produces a plausible-looking order that is exactly backwards, and it still passes symmetric test cases."
    },
    {
      id: "dsa-top-k-frequent",
      q: "Return the k most frequent elements in an array. Can you beat $O(n \\log n)$?",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "bytedance", "netflix", "uber", "databricks", "adobe"],
      tags: ["heap", "bucket-sort", "quickselect", "hash-map"],
      simple: "First count how many times each thing appears. Then you need the top k counts. Sorting everything is wasteful because you do not care about the order of the ones you are throwing away — you only need to separate the top k from the rest.",
      answer: "## Step one is always the same\n\nCount with a hash map: $O(n)$.\n\n## Option A — min-heap of size k\n\nKeep a heap of the k best so far; anything smaller than the heap's root cannot make the cut.\n\n```python\nimport heapq\nfrom collections import Counter\n\ndef top_k(nums, k):\n    counts = Counter(nums)\n    return heapq.nlargest(k, counts.keys(), key=counts.get)\n```\n\n$O(n + m \\log k)$ where $m$ is the number of distinct values. When $k$ is small this is excellent, and it is the right answer for a **streaming** version where you cannot hold all counts.\n\n## Option B — bucket sort, $O(n)$\n\nA frequency cannot exceed $n$. So make $n + 1$ buckets indexed by frequency, drop each value into its bucket, and read from the high end.\n\n```python\ndef top_k_buckets(nums, k):\n    counts = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for val, freq in counts.items():\n        buckets[freq].append(val)\n\n    out = []\n    for freq in range(len(buckets) - 1, 0, -1):\n        for val in buckets[freq]:\n            out.append(val)\n            if len(out) == k:\n                return out\n    return out\n```\n\n$O(n)$ time and $O(n)$ space. This is the answer to \"can you beat $O(n \\log n)$\" — yes, because frequencies are bounded integers, which is exactly the condition that makes counting sort applicable.\n\n## Option C — quickselect\n\nPartition the (value, count) pairs around a pivot count until the k-th boundary lands in place. $O(m)$ average, $O(m^2)$ worst case. Fastest in practice for large $k$, but the worst case makes it a poor default unless you use median-of-medians.\n\n## Choosing\n\n| Situation | Use |\n| --- | --- |\n| k small, m large | Min-heap |\n| Need guaranteed linear | Bucket sort |\n| Streaming, bounded memory | Count-Min Sketch + heap |\n| k close to m | Quickselect or just sort |",
      takeaways: [
        "Bucket sort is linear here only because frequency is bounded by $n$.",
        "A size-k min-heap is the streaming-friendly answer; buckets need all counts in memory.",
        "Say the complexity in terms of distinct values $m$, not just $n$ — it is often much smaller."
      ],
      followUps: [
        "The array does not fit in memory. (Count-Min Sketch for approximate counts, then a heap.)",
        "Return the top k across a sliding window. (Much harder — a monotonic structure or a rebuild-on-eviction scheme.)",
        "Break ties deterministically."
      ],
      trap: "Claiming the heap solution is $O(n \\log k)$ without noting that the counting pass is over $n$ but the heap pass is over $m$ distinct values. Interviewers at Google and Meta will push on exactly that distinction."
    },
    {
      id: "dsa-word-ladder-bfs",
      q: "Given a start word, an end word, and a dictionary, find the length of the shortest transformation sequence changing one letter at a time.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "bytedance", "microsoft"],
      tags: ["bfs", "graph", "bidirectional-search"],
      simple: "Every word is a room, and two rooms are connected if the words differ by one letter. You want the shortest walk from one room to another, so you explore in rings: everything one step away, then everything two steps away. The first time you see the target, that ring number is the answer.",
      answer: "## Why BFS and not DFS\n\nThe graph is unweighted, so breadth-first search finds the shortest path by construction: the first time a node is reached, it is reached by a minimal number of edges. DFS would find *a* path, not the shortest.\n\n## Building neighbours without building the graph\n\nEnumerating all pairs is $O(N^2 L)$ and dies on a large dictionary. Instead, generate candidate neighbours from the word itself: for each of $L$ positions try 25 substitutions, and keep the ones present in the dictionary set.\n\n```python\nfrom collections import deque\n\ndef ladder_length(begin, end, word_list):\n    words = set(word_list)\n    if end not in words:\n        return 0\n\n    q = deque([(begin, 1)])\n    seen = {begin}\n    while q:\n        word, depth = q.popleft()\n        if word == end:\n            return depth\n        for i in range(len(word)):\n            for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                nxt = word[:i] + ch + word[i + 1:]\n                if nxt in words and nxt not in seen:\n                    seen.add(nxt)\n                    q.append((nxt, depth + 1))\n    return 0\n```\n\nCost: $O(N \\cdot L \\cdot 26)$ — linear in dictionary size, not quadratic.\n\n## Bidirectional BFS — the real answer at a senior level\n\nSearch from both ends and stop when the frontiers meet. If the branching factor is $b$ and the answer depth is $d$, one-directional BFS explores $O(b^d)$ nodes but bidirectional explores $O(2 b^{d/2})$ — for $b = 20, d = 6$ that is 64 million versus 16 thousand.\n\n```python\ndef ladder_bidirectional(begin, end, word_list):\n    words = set(word_list)\n    if end not in words:\n        return 0\n    front, back = {begin}, {end}\n    seen = {begin, end}\n    depth = 1\n    while front and back:\n        if len(front) > len(back):      # always expand the smaller frontier\n            front, back = back, front\n        nxt_level = set()\n        for word in front:\n            for i in range(len(word)):\n                for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                    cand = word[:i] + ch + word[i + 1:]\n                    if cand in back:\n                        return depth + 1\n                    if cand in words and cand not in seen:\n                        seen.add(cand)\n                        nxt_level.add(cand)\n        front = nxt_level\n        depth += 1\n    return 0\n```\n\nAlways expanding the smaller frontier is what keeps the saving real.",
      takeaways: [
        "BFS gives shortest paths on unweighted graphs; DFS does not.",
        "Generate neighbours by mutation against a set — never build the full pairwise graph.",
        "Bidirectional BFS turns $b^d$ into $2b^{d/2}$, and it is the differentiator in this question."
      ],
      followUps: [
        "Return every shortest sequence, not just the length. (BFS to build a parent DAG, then DFS backwards.)",
        "Words of varying length. (Add insert and delete edges — this becomes edit distance 1.)",
        "A dictionary of ten million words. (Precompute wildcard buckets like `h*t`.)"
      ],
      trap: "Marking a node as visited when you dequeue it instead of when you enqueue it. The same word then gets pushed many times from one level, and the queue explodes on a dense dictionary."
    },
    {
      id: "dsa-median-two-sorted",
      q: "Find the median of two sorted arrays in $O(\\log(m+n))$.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "bytedance", "microsoft", "snowflake"],
      tags: ["binary-search", "partition", "arrays"],
      simple: "Forget merging. You are trying to draw one vertical cut through each array so that everything to the left of both cuts is exactly half of all the elements, and every left-hand value is no bigger than every right-hand value. Once the cut is correct, the median is right at the boundary. Binary search on where to cut the smaller array.",
      answer: "## The partition idea\n\nLet the arrays be `A` (length `m`) and `B` (length `n`), with `m <= n` — swap if not, so the binary search runs on the shorter array.\n\nChoose `i` elements from `A` and `j` from `B` for the left half, with\n\n$$i + j = \\frac{m + n + 1}{2}$$\n\nusing integer division. The `+1` makes the left half take the extra element when the total is odd, which means the median is simply the largest left-hand value.\n\nThe partition is correct when both cross-conditions hold:\n\n$$A[i-1] \\le B[j] \\quad \\text{and} \\quad B[j-1] \\le A[i]$$\n\n```python\ndef find_median(a, b):\n    if len(a) > len(b):\n        a, b = b, a\n    m, n = len(a), len(b)\n    half = (m + n + 1) // 2\n    lo, hi = 0, m\n\n    while lo <= hi:\n        i = (lo + hi) // 2          # take i from a\n        j = half - i                # and j from b\n\n        a_left  = a[i - 1] if i > 0 else float(\"-inf\")\n        a_right = a[i]     if i < m else float(\"inf\")\n        b_left  = b[j - 1] if j > 0 else float(\"-inf\")\n        b_right = b[j]     if j < n else float(\"inf\")\n\n        if a_left <= b_right and b_left <= a_right:\n            if (m + n) % 2:\n                return max(a_left, b_left)\n            return (max(a_left, b_left) + min(a_right, b_right)) / 2\n        if a_left > b_right:\n            hi = i - 1              # took too many from a\n        else:\n            lo = i + 1              # took too few from a\n    raise ValueError(\"inputs were not sorted\")\n```\n\n## Why the infinities\n\nWhen `i == 0` there is no `A[i-1]`, and the condition `A[i-1] <= B[j]` should be vacuously true — negative infinity gives exactly that. Same on the right with positive infinity. This removes about a dozen boundary branches, and it is the difference between an implementation you can write correctly under pressure and one you cannot.\n\n## Complexity\n\n$O(\\log \\min(m, n))$ time, $O(1)$ space. Binary searching the shorter array is what makes it $\\log \\min$ rather than $\\log \\max$.",
      takeaways: [
        "Search over the *partition point*, not over the values.",
        "Binary search the shorter array so the bound is $\\log \\min(m,n)$.",
        "Sentinel infinities collapse every boundary case into the general one."
      ],
      followUps: [
        "Generalise to the k-th smallest element of two sorted arrays.",
        "Extend to $k$ sorted arrays. (Heap-based merge, or repeated pairwise partitioning.)",
        "What if the arrays are on different machines? (Now the round trips dominate — a distributed quantile sketch is better.)"
      ],
      trap: "Merging the two arrays and indexing the middle. It is correct and $O(m+n)$ — say so, then say why it does not meet the bound. Candidates who pretend not to know the merge answer look worse, not better."
    },
    {
      id: "dsa-lis",
      q: "Find the length of the longest strictly increasing subsequence. Then get it under $O(n^2)$.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "bytedance", "microsoft", "adobe"],
      tags: ["dynamic-programming", "binary-search", "patience-sorting"],
      simple: "Deal the numbers into piles like a card game: each card goes on the leftmost pile whose top card is greater than or equal to it, or starts a new pile on the right. The number of piles you end up with is the answer. It works because pile tops always stay sorted, so you can binary search for the right pile.",
      answer: "## The $O(n^2)$ dynamic program\n\n`dp[i]` = length of the longest increasing subsequence ending at index `i`.\n\n```python\ndef lis_quadratic(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)\n```\n\nAlways state this first. It shows you understand the structure before you optimise it.\n\n## The $O(n \\log n)$ version\n\nKeep an array `tails`, where `tails[k]` is the **smallest possible tail value** of any increasing subsequence of length `k+1`. That array is always sorted, which is what admits binary search.\n\n```python\nfrom bisect import bisect_left\n\ndef lis(nums):\n    tails = []\n    for x in nums:\n        pos = bisect_left(tails, x)     # first tail >= x\n        if pos == len(tails):\n            tails.append(x)             # x extends the longest run\n        else:\n            tails[pos] = x              # x makes length pos+1 cheaper\n    return len(tails)\n```\n\n**`tails` is not the subsequence.** It is a set of best-possible tails, and its contents at the end may not be a valid subsequence of the input at all. Only its *length* is meaningful. Saying this unprompted is a strong signal.\n\n## Recovering the actual subsequence\n\nRecord, for each element, the length it achieved and a back-pointer to the previous element at that length:\n\n```python\ndef lis_sequence(nums):\n    tails, tail_idx, parent = [], [], [-1] * len(nums)\n    for i, x in enumerate(nums):\n        pos = bisect_left(tails, x)\n        if pos > 0:\n            parent[i] = tail_idx[pos - 1]\n        if pos == len(tails):\n            tails.append(x)\n            tail_idx.append(i)\n        else:\n            tails[pos] = x\n            tail_idx[pos] = i\n\n    out, k = [], tail_idx[-1] if tail_idx else -1\n    while k != -1:\n        out.append(nums[k])\n        k = parent[k]\n    return out[::-1]\n```\n\n## Strict versus non-strict\n\n`bisect_left` gives **strictly** increasing. For non-decreasing, use `bisect_right`. One character, completely different answer — confirm which the problem wants.",
      takeaways: [
        "`tails[k]` is the smallest tail of any length-(k+1) subsequence, and stays sorted.",
        "The final `tails` array is not itself a valid subsequence — only its length is meaningful.",
        "`bisect_left` is strict, `bisect_right` is non-strict."
      ],
      followUps: [
        "Count the number of longest increasing subsequences. (Needs a second dp array.)",
        "Longest increasing path in a matrix. (DFS with memoisation on a DAG.)",
        "Russian doll envelopes — sort by width ascending, height descending, then LIS on height. The descending secondary sort is what prevents equal widths chaining."
      ],
      trap: "Returning `tails` as the answer subsequence. It has the right length and the wrong contents, and it passes any test that only checks the length."
    },
    {
      id: "dsa-serialize-tree",
      q: "Serialise and deserialise a binary tree.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "microsoft", "bytedance", "uber"],
      tags: ["tree", "dfs", "design"],
      simple: "Write the tree out by walking it in a fixed order and recording a marker wherever a child is missing. Those markers are the whole trick — without them you cannot tell a left-only child from a right-only one when reading back.",
      answer: "## Pre-order with null markers\n\nPre-order visits the root first, which is exactly what you need when rebuilding: you always know the current node before its children.\n\n```python\ndef serialize(root):\n    out = []\n    def walk(node):\n        if node is None:\n            out.append(\"#\")          # the null marker\n            return\n        out.append(str(node.val))\n        walk(node.left)\n        walk(node.right)\n    walk(root)\n    return \",\".join(out)\n\ndef deserialize(data):\n    vals = iter(data.split(\",\"))\n    def build():\n        tok = next(vals)\n        if tok == \"#\":\n            return None\n        node = TreeNode(int(tok))\n        node.left = build()\n        node.right = build()\n        return node\n    return build()\n```\n\n$O(n)$ both ways. The iterator is doing real work here: each recursive call consumes exactly the tokens belonging to its own subtree, so the two recursions stay in lockstep with no index bookkeeping.\n\n## Why null markers are mandatory\n\nWithout them, `1 -> 2` (left child) and `1 -> 2` (right child) serialise identically. This is the same reason a pre-order traversal alone cannot reconstruct a general binary tree, while pre-order **plus in-order** can — the in-order sequence supplies the missing structural information.\n\nA binary *search* tree is the exception: pre-order alone is enough, because the BST property tells you where the left subtree ends.\n\n## Making it compact\n\nFor an interview, comma-separated text is fine. In production:\n\n- Level-order with a bitmap of present children is far denser for near-complete trees.\n- **Succinct encodings** reach $2n + o(n)$ bits, close to the information-theoretic minimum of $2n - \\Theta(\\log n)$ bits.\n- Watch the recursion depth: a degenerate tree of 10⁵ nodes will overflow the stack, so an explicit stack is the safe version.",
      takeaways: [
        "Null markers are what make the encoding unambiguous.",
        "Pre-order works because the root is known before its children on the way back in.",
        "A BST needs no markers; a general binary tree does."
      ],
      followUps: [
        "Serialise an N-ary tree. (Store the child count with each node.)",
        "Serialise a BST as compactly as possible. (Pre-order only — no markers needed.)",
        "Handle a 10⁵-deep degenerate tree. (Explicit stack instead of recursion.)"
      ],
      trap: "Using in-order traversal. It is the one traversal that cannot reconstruct the tree even with null markers, because the root's position is not determined."
    },
    {
      id: "dsa-trie-autocomplete",
      q: "Design an autocomplete system that returns the top 3 historical queries for a prefix, ranked by frequency then lexicographically.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "bytedance", "adobe", "uber"],
      tags: ["trie", "heap", "design", "strings"],
      simple: "Store every past query in a tree where each level is one more letter. Walking down the tree spells the prefix, and everything underneath that point is a completion. To make it fast, precompute the best few completions at each node so answering is just reading them off.",
      answer: "## The structure\n\nA trie where each node caches its own top-k completions. That turns the query from \"walk the prefix, then search the whole subtree\" into \"walk the prefix, then read a list\".\n\n```python\nimport heapq\n\nclass Node:\n    def __init__(self):\n        self.children = {}\n        self.top = []          # cached [(-count, sentence)], best first\n\nclass Autocomplete:\n    def __init__(self, sentences, counts, k=3):\n        self.root = Node()\n        self.k = k\n        self.counts = {}\n        for s, c in zip(sentences, counts):\n            self.counts[s] = c\n            self._index(s)\n        self.cur = self.root\n        self.buf = []\n\n    def _index(self, sentence):\n        node = self.root\n        for ch in sentence:\n            node = node.children.setdefault(ch, Node())\n            self._refresh(node, sentence)\n\n    def _refresh(self, node, sentence):\n        entry = (-self.counts[sentence], sentence)\n        node.top = [e for e in node.top if e[1] != sentence]\n        node.top.append(entry)\n        node.top.sort()                 # count desc, then lexicographic asc\n        del node.top[self.k:]\n\n    def input(self, ch):\n        if ch == \"#\":                   # end of a query: record it\n            s = \"\".join(self.buf)\n            self.counts[s] = self.counts.get(s, 0) + 1\n            self._index(s)\n            self.cur, self.buf = self.root, []\n            return []\n        self.buf.append(ch)\n        if self.cur is not None:\n            self.cur = self.cur.children.get(ch)\n        return [s for _, s in self.cur.top] if self.cur else []\n```\n\n## The ranking detail\n\nStoring `(-count, sentence)` makes a plain ascending sort produce \"highest count first, then alphabetically\" in one step. Negating the count is the standard trick for getting descending order out of an ascending sort or a min-heap.\n\n## Cost\n\n- Query: $O(p + k \\log k)$ for prefix length $p$ — effectively instant.\n- Insert: $O(L \\cdot k \\log k)$ for a length-$L$ sentence, since every node on the path refreshes its cache.\n- Space: $O(\\sum L)$ for the trie plus $O(k)$ per node.\n\nThat is a deliberate trade: reads are far more frequent than writes in autocomplete, so paying on insert is correct.\n\n## What changes at real scale\n\n- **Memory.** A plain trie over a billion queries is enormous. Compress it to a radix tree (merge single-child chains), or use a **DAWG** which also shares common suffixes.\n- **Distribution.** Shard by prefix. The first two characters give a natural, well-balanced partition key.\n- **Freshness.** Trending queries need time decay: store counts in a decaying window rather than a lifetime total, or you will still be suggesting last year's news."
      ,
      takeaways: [
        "Caching top-k at every node moves the cost from query time to insert time — the right direction for autocomplete.",
        "`(-count, string)` sorts by count descending then alphabetically in one pass.",
        "Radix trees and DAWGs are the memory answer; prefix sharding is the scale answer."
      ],
      followUps: [
        "Support fuzzy matching for typos. (Levenshtein automaton over the trie.)",
        "Personalise results per user. (Blend a global trie with a small per-user one.)",
        "Handle trending terms. (Time-decayed counts or a sliding window.)"
      ],
      trap: "Walking the entire subtree on every keystroke to collect candidates. It is correct and it is far too slow — a popular one-character prefix can cover millions of sentences."
    },
    {
      id: "dsa-sliding-window-max",
      q: "Return the maximum of every sliding window of size k.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "bytedance", "meta-ai", "uber", "databricks"],
      tags: ["deque", "monotonic", "sliding-window"],
      simple: "Keep a queue of candidates that could still become the maximum. When a new number arrives, any smaller number already waiting is now useless — it is both older and smaller, so it can never win again. Throw those away. The front of the queue is always the answer.",
      answer: "## The monotonic deque\n\nHold indices in a deque whose corresponding values are strictly decreasing. Two invariants:\n\n1. The front index is always the maximum of the current window.\n2. Any index whose value is smaller than a newer arrival is discarded, because it is dominated — older *and* smaller.\n\n```python\nfrom collections import deque\n\ndef max_sliding_window(nums, k):\n    dq = deque()          # indices, values strictly decreasing\n    out = []\n    for i, x in enumerate(nums):\n        while dq and dq[0] <= i - k:        # front fell out of the window\n            dq.popleft()\n        while dq and nums[dq[-1]] <= x:     # x dominates these\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            out.append(nums[dq[0]])\n    return out\n```\n\n## Why it is $O(n)$ despite the inner loops\n\nAmortised analysis: every index is appended exactly once and popped at most once. Total work across all iterations is $O(n)$, even though a single iteration can pop many elements. This is the argument the interviewer wants to hear — do not just assert linearity.\n\n## Store indices, not values\n\nThe expiry check `dq[0] <= i - k` needs to know *where* the front element came from. With values alone you cannot tell whether the front has left the window.\n\n## Alternatives\n\n| Approach | Time | Note |\n| --- | --- | --- |\n| Recompute each window | $O(nk)$ | Fine for tiny k |\n| Max-heap with lazy deletion | $O(n \\log n)$ | Simpler to reason about; heap can grow to n |\n| Monotonic deque | $O(n)$ | Optimal, $O(k)$ space |\n\nThe heap version is worth mentioning: push `(-value, index)` and pop from the top while the top index is out of window. It is a good fallback if you blank on the deque invariant.",
      takeaways: [
        "The deque holds indices whose values strictly decrease; the front is the window max.",
        "Amortised $O(n)$: each index enters and leaves exactly once.",
        "Indices, not values — expiry checking needs position."
      ],
      followUps: [
        "Sliding window minimum. (Flip the comparison.)",
        "Sliding window median. (Two heaps, or an order-statistic tree.)",
        "The same over a distributed stream. (Per-shard deques plus a merge step.)"
      ],
      trap: "Using `<` instead of `<=` when popping. With duplicates you keep stale equal values in the deque; the answers are still correct but the deque grows unnecessarily, and an interviewer probing memory use will catch it."
    },
    {
      id: "dsa-union-find",
      q: "Explain union-find with path compression and union by rank. What is the real complexity?",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "uber", "databricks", "palantir", "bytedance"],
      tags: ["union-find", "graph", "amortised"],
      simple: "Every group has one representative. To ask whether two items are in the same group, follow each one's chain of parents to the top and compare. Two tricks make it fast: always attach the shorter tree under the taller one, and flatten the chain as you walk it so next time is instant.",
      answer: "## The structure\n\n```python\nclass UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n        self.components = n\n\n    def find(self, x):\n        while self.parent[x] != x:\n            self.parent[x] = self.parent[self.parent[x]]   # path halving\n            x = self.parent[x]\n        return x\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False                    # already together\n        if self.rank[ra] < self.rank[rb]:   # attach shorter under taller\n            ra, rb = rb, ra\n        self.parent[rb] = ra\n        if self.rank[ra] == self.rank[rb]:\n            self.rank[ra] += 1\n        self.components -= 1\n        return True\n```\n\n## The two optimisations\n\n**Union by rank** keeps trees shallow. Rank is an upper bound on height; attaching the shallower tree under the deeper one means the height only grows when both are equal. Alone, this gives $O(\\log n)$ per operation.\n\n**Path compression** flattens the path on every `find`. Alone, this gives $O(\\log n)$ amortised.\n\nTogether the amortised cost per operation is\n\n$$O(\\alpha(n))$$\n\nwhere $\\alpha$ is the inverse Ackermann function. For any $n$ that fits in the observable universe, $\\alpha(n) \\le 4$. So it is effectively constant — but say \"inverse Ackermann\", not \"constant\", because the distinction is the point of the question.\n\nThe version above uses **path halving** (point each node at its grandparent) rather than full two-pass compression. It gives the same asymptotic bound, is iterative so it cannot blow the stack, and is faster in practice.\n\n## Where it is used\n\n- Kruskal's minimum spanning tree — the cycle check *is* union-find.\n- Connected components in an undirected graph, especially incrementally.\n- Detecting redundant edges.\n- Percolation and dynamic connectivity.\n\n## What it cannot do\n\nUnion-find does not support **deletion**. Removing an edge may split a component, and there is no cheap way to undo a union. If you need that, you want a link-cut tree or an offline algorithm that processes deletions in reverse.",
      takeaways: [
        "Path compression and union by rank together give $O(\\alpha(n))$ amortised — inverse Ackermann, not constant.",
        "Path halving is iterative, stack-safe, and asymptotically equivalent to full compression.",
        "There is no efficient deletion; that limitation is often the follow-up question."
      ],
      followUps: [
        "Implement Kruskal's MST on top of it.",
        "Support rollback for an offline algorithm. (Union by rank without path compression, plus an undo stack.)",
        "Weighted union-find for relations like 'a is 3× b'."
      ],
      trap: "Recursive `find` with full path compression on a 10⁶-node input. It is the textbook version and it overflows the stack on a long chain built before the first find."
    },
    {
      id: "dsa-quickselect",
      q: "Find the k-th largest element in an unsorted array without fully sorting it.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "microsoft", "bytedance", "snowflake", "databricks"],
      tags: ["quickselect", "heap", "partition"],
      simple: "Quicksort picks a pivot and splits the array into smaller and larger halves. But you only care about one position — so after each split, you only need to recurse into the half that contains it. Throwing away half the work each time is what makes it linear on average instead of n log n.",
      answer: "## Quickselect\n\n```python\nimport random\n\ndef kth_largest(nums, k):\n    target = len(nums) - k          # k-th largest == this index when sorted\n    lo, hi = 0, len(nums) - 1\n    while True:\n        p = partition(nums, lo, hi)\n        if p == target:\n            return nums[p]\n        if p < target:\n            lo = p + 1              # recurse right only\n        else:\n            hi = p - 1              # recurse left only\n\ndef partition(nums, lo, hi):\n    r = random.randint(lo, hi)      # randomisation is not optional\n    nums[r], nums[hi] = nums[hi], nums[r]\n    pivot, store = nums[hi], lo\n    for i in range(lo, hi):\n        if nums[i] < pivot:\n            nums[store], nums[i] = nums[i], nums[store]\n            store += 1\n    nums[store], nums[hi] = nums[hi], nums[store]\n    return store\n```\n\n**Average $O(n)$**, because the recurrence is $T(n) = T(n/2) + O(n)$, and $n + n/2 + n/4 + \\dots = 2n$. Worst case is $O(n^2)$ when every pivot is extreme — which is exactly why the random pivot matters. Without it, a sorted input is the worst case, and sorted input is extremely common in practice.\n\n## The heap alternative\n\n```python\nimport heapq\n\ndef kth_largest_heap(nums, k):\n    heap = nums[:k]\n    heapq.heapify(heap)             # min-heap of the k best so far\n    for x in nums[k:]:\n        if x > heap[0]:\n            heapq.heapreplace(heap, x)\n    return heap[0]\n```\n\n$O(n \\log k)$ time, $O(k)$ space. Slower asymptotically for large k, but it has two decisive advantages: it never mutates the input, and it works on a **stream** where you cannot hold all n elements.\n\n## Choosing\n\n| Need | Pick |\n| --- | --- |\n| Fastest average, in-memory, mutation fine | Quickselect |\n| Streaming or k small | Min-heap |\n| Guaranteed worst case | Median of medians, $O(n)$ but slow constants |\n| Distributed | Per-shard quantiles, then merge |\n\nMention median-of-medians as the theoretical answer, but be honest that its constant factor makes it rarely worth it in practice.",
      takeaways: [
        "Quickselect recurses into one side only, giving average $O(n)$.",
        "The random pivot is what avoids the $O(n^2)$ case on sorted input.",
        "A min-heap of size k is the streaming answer and does not mutate the input."
      ],
      followUps: [
        "Guarantee $O(n)$ worst case. (Median of medians.)",
        "k-th largest across many machines. (Approximate quantiles: t-digest or GK sketch.)",
        "k-th largest in a stream with additions and removals. (Two heaps or a balanced BST.)"
      ],
      trap: "Forgetting the random pivot. The code looks correct, passes every test, and then degrades to $O(n^2)$ on the sorted input the interviewer hands you as a follow-up."
    },
    {
      id: "dsa-string-reverse-words",
      q: "Reverse the words in a string, collapsing extra whitespace. Do it in place if the language allows.",
      topic: "DSA",
      level: "easy",
      companies: ["microsoft", "amazon", "adobe", "tcs", "salesforce", "flipkart", "oracle"],
      tags: ["strings", "two-pointer", "in-place"],
      simple: "Reverse the whole string, then reverse each word back. The first reversal puts the words in the right order but spells each one backwards; the second fixes the spelling. Two simple passes beat one clever one.",
      answer: "## The idiomatic answer\n\n```python\ndef reverse_words(s):\n    return \" \".join(reversed(s.split()))\n```\n\n`split()` with no argument collapses runs of whitespace and drops leading and trailing whitespace, which is exactly the required behaviour. Say this first — pretending not to know it wastes everyone's time.\n\n## The in-place answer\n\nThis is what the question is really about. On a mutable character array:\n\n```python\ndef reverse_words_inplace(chars):\n    n = clean_spaces(chars)          # collapse to single spaces, no edges\n    reverse(chars, 0, n - 1)         # whole string backwards\n    start = 0\n    for i in range(n + 1):\n        if i == n or chars[i] == \" \":\n            reverse(chars, start, i - 1)   # each word forwards again\n            start = i + 1\n    return n\n\ndef reverse(chars, i, j):\n    while i < j:\n        chars[i], chars[j] = chars[j], chars[i]\n        i, j = i + 1, j - 1\n\ndef clean_spaces(chars):\n    write = read = 0\n    n = len(chars)\n    while read < n:\n        while read < n and chars[read] == \" \":\n            read += 1                              # skip leading run\n        while read < n and chars[read] != \" \":\n            chars[write] = chars[read]             # copy the word\n            write += 1\n            read += 1\n        while read < n and chars[read] == \" \":\n            read += 1\n        if read < n:\n            chars[write] = \" \"                     # exactly one separator\n            write += 1\n    return write\n```\n\n$O(n)$ time, $O(1)$ extra space.\n\n## Why reverse twice\n\nReversing the whole string gets word *order* right and character order wrong within each word. Reversing each word individually fixes the second without disturbing the first. Two reversals compose to the identity on characters within a word, but not on the arrangement of words — which is precisely the effect you want.\n\n## In languages with immutable strings\n\nPython, Java and C# strings are immutable, so \"in place\" means \"on a character array or `StringBuilder`\". Say so; it shows you know the difference between an algorithm and its host language.",
      takeaways: [
        "Reverse everything, then reverse each word — the composition gives exactly the desired result.",
        "The read/write two-pointer pass collapses whitespace with no extra allocation.",
        "In-place is impossible on an immutable string; work on a character array."
      ],
      followUps: [
        "Reverse only the characters, leaving word order alone.",
        "Rotate an array left by k. (Same three-reversal trick.)",
        "Handle Unicode combining characters. (Reversing code units breaks graphemes.)"
      ],
      trap: "Reversing bytes rather than characters. On UTF-8 input that corrupts every multi-byte character, and it is an easy mistake to make in C or Go."
    },
    {
      id: "dsa-cycle-linked-list",
      q: "Detect a cycle in a linked list and return the node where the cycle begins.",
      topic: "DSA",
      level: "medium",
      companies: ["microsoft", "amazon", "google", "adobe", "oracle", "tcs", "flipkart"],
      tags: ["linked-list", "two-pointer", "floyd"],
      simple: "Two runners on a circular track, one twice as fast. If there is a loop, the fast one eventually laps the slow one and they meet. To find where the loop starts, move one runner back to the start and walk both at the same speed — they meet exactly at the entrance.",
      answer: "## Detection — Floyd's tortoise and hare\n\n```python\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n```\n\n$O(n)$ time, $O(1)$ space.\n\n## Finding the entrance — and why it works\n\nLet $\\mu$ be the distance from the head to the cycle entrance, and $\\lambda$ the cycle length. Say they meet after the slow pointer has taken $k$ steps; the fast pointer has taken $2k$.\n\nBoth are inside the cycle at the meeting point, and the fast pointer has gone exactly some whole number of extra laps:\n\n$$2k - k = k = n\\lambda \\quad \\text{for some integer } n$$\n\nSo $k$ is a multiple of the cycle length. The slow pointer is $k - \\mu$ steps into the cycle. Now move one pointer to the head and advance both one step at a time. After $\\mu$ more steps:\n\n- The head pointer has walked exactly $\\mu$ and sits at the entrance.\n- The other has walked $k - \\mu + \\mu = k$ total inside the cycle, a whole number of laps, so it is also at the entrance.\n\nThey meet there.\n\n```python\ndef cycle_start(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow is fast:\n            finder = head\n            while finder is not slow:\n                finder, slow = finder.next, slow.next\n            return finder\n    return None\n```\n\n## Cycle length\n\nOnce they meet, keep one pointer still and walk the other until it returns — the number of steps is $\\lambda$.\n\n## The hash-set alternative\n\nStoring visited nodes in a set is $O(n)$ time and $O(n)$ space, and is genuinely fine when memory is not the constraint. Offer it, then give Floyd's as the constant-space version.",
      takeaways: [
        "Fast and slow pointers detect a cycle in $O(1)$ space.",
        "Resetting one pointer to the head finds the entrance because the meeting point is a whole number of laps from the start.",
        "You should be able to sketch the $\\mu$ / $\\lambda$ argument, not just recite the steps."
      ],
      followUps: [
        "Find the length of the cycle.",
        "Remove the cycle without breaking the list.",
        "Find the duplicate number in an array of n+1 integers — the same algorithm, with the array read as a function graph."
      ],
      trap: "Checking `fast` but not `fast.next` before `fast.next.next`. On an even-length acyclic list that dereferences null on the last step."
    },
    {
      id: "dsa-matrix-spiral-rotate",
      q: "Rotate an n×n matrix by 90 degrees clockwise, in place.",
      topic: "DSA",
      level: "easy",
      companies: ["microsoft", "amazon", "adobe", "apple", "tcs", "flipkart", "oracle"],
      tags: ["matrix", "in-place", "geometry"],
      simple: "Flip the matrix along its main diagonal, then mirror it left-to-right. The diagonal flip turns rows into columns; the mirror puts them in the right order. Two easy passes instead of one confusing four-way swap.",
      answer: "## Transpose, then reverse each row\n\n```python\ndef rotate(matrix):\n    n = len(matrix)\n    for i in range(n):                       # transpose: reflect over the diagonal\n        for j in range(i + 1, n):            # j starts at i+1, not 0\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for row in matrix:                       # then mirror horizontally\n        row.reverse()\n```\n\n$O(n^2)$ time, $O(1)$ space.\n\n**`j` must start at `i + 1`.** Starting at 0 swaps every pair twice, which returns the matrix to its original state — a silent no-op bug that is easy to miss because the code looks symmetric and correct.\n\n## Why the composition works\n\nTransposing maps $(i, j) \\mapsto (j, i)$. Reversing each row maps $(i, j) \\mapsto (i, n-1-j)$. Composing them gives $(i, j) \\mapsto (j, n-1-i)$, which is exactly a clockwise quarter turn: the top row becomes the rightmost column.\n\n## Anticlockwise\n\nTranspose, then reverse each **column** — or equivalently reverse the row order first, then transpose.\n\n## The four-way cycle version\n\nIf the interviewer asks for a single pass, rotate four elements at a time in concentric rings:\n\n```python\ndef rotate_rings(matrix):\n    n = len(matrix)\n    for layer in range(n // 2):\n        first, last = layer, n - 1 - layer\n        for i in range(first, last):\n            offset = i - first\n            top = matrix[first][i]\n            matrix[first][i] = matrix[last - offset][first]\n            matrix[last - offset][first] = matrix[last][last - offset]\n            matrix[last][last - offset] = matrix[i][last]\n            matrix[i][last] = top\n```\n\nIt is one pass and materially harder to get right. The transpose-and-reverse version is what you should reach for; know this one exists so you can say why you did not use it.",
      takeaways: [
        "Transpose then reverse rows = clockwise; transpose then reverse columns = anticlockwise.",
        "The inner loop must start at `i + 1` or every swap is undone.",
        "The four-way ring rotation is one pass and much easier to get wrong."
      ],
      followUps: [
        "Rotate a rectangular m×n matrix. (Cannot be done in place — the shape changes.)",
        "Print the matrix in spiral order.",
        "Rotate by 180 degrees. (Reverse row order, then reverse each row.)"
      ],
      trap: "Allocating a new matrix and calling it in place. If the interviewer said in place, they mean $O(1)$ extra space, and a fresh n×n array is $O(n^2)$."
    },
    {
      id: "dsa-subarray-sum-k",
      q: "Count the number of contiguous subarrays summing to k. The array may contain negative numbers.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "bytedance", "microsoft", "databricks"],
      tags: ["prefix-sum", "hash-map", "arrays"],
      simple: "Keep a running total as you walk the array. The sum of any stretch equals the running total now minus the running total just before that stretch started. So for each position, ask: how many earlier positions had a running total exactly k less than mine? Every one of them marks a valid subarray.",
      answer: "## Prefix sums plus a hash map\n\nLet $P_i$ be the sum of the first $i$ elements. The sum of `nums[j..i]` is $P_{i+1} - P_j$. You want that to equal $k$, so\n\n$$P_j = P_{i+1} - k$$\n\nCount how many earlier prefix sums had that value.\n\n```python\nfrom collections import defaultdict\n\ndef subarray_sum(nums, k):\n    seen = defaultdict(int)\n    seen[0] = 1                     # the empty prefix\n    total = count = 0\n    for x in nums:\n        total += x\n        count += seen[total - k]    # look up BEFORE recording\n        seen[total] += 1\n    return count\n```\n\n$O(n)$ time, $O(n)$ space.\n\n## The two details that matter\n\n**`seen[0] = 1`** seeds the empty prefix. Without it you miss every subarray that starts at index 0, because no earlier prefix sum of 0 was ever recorded.\n\n**Look up before you record.** Otherwise, when `k == 0`, the current prefix matches itself and you count a zero-length subarray.\n\n## Why the sliding window does not work here\n\nThe sliding-window technique needs monotonicity: growing the window must move the sum in a predictable direction. With negative numbers it does not — extending a window can *decrease* the sum, so shrinking on \"too big\" is unsound. If the problem said all elements are positive, a two-pointer window would be $O(n)$ time and $O(1)$ space, and would be the better answer.\n\nBeing able to say precisely *why* the window fails is the point of including negatives in the problem.",
      takeaways: [
        "Sum of a range = difference of two prefix sums; the hash map counts matching earlier prefixes.",
        "Seed the map with `{0: 1}` for subarrays starting at index 0.",
        "Sliding windows require non-negative values; with negatives you need prefix sums."
      ],
      followUps: [
        "Longest subarray summing to k. (Store the first index of each prefix, not the count.)",
        "Subarray sums divisible by k. (Key on `total % k`, minding negative modulo.)",
        "The same over a stream with a bounded window."
      ],
      trap: "Reaching for a sliding window because the phrase 'contiguous subarray' appears. With negative values it produces wrong answers on inputs that look innocuous, such as `[1, -1, 0]` with `k = 0`."
    },
    {
      id: "dsa-design-rate-limiter-ds",
      q: "Implement a rate limiter allowing N requests per user per rolling minute. Compare the data structures.",
      topic: "DSA",
      level: "hard",
      companies: ["amazon", "uber", "netflix", "flipkart", "bytedance", "salesforce", "microsoft"],
      tags: ["design", "queue", "sliding-window", "concurrency"],
      simple: "The simple version keeps a timestamp for every request and throws away ones older than a minute. That is exact but stores a lot. The clever version keeps just two counters — this minute and last minute — and blends them by how far into the current minute you are. Almost as accurate, a fraction of the memory.",
      answer: "## Sliding window log — exact\n\n```python\nfrom collections import deque\nimport time\n\nclass SlidingLog:\n    def __init__(self, limit, window=60.0):\n        self.limit, self.window = limit, window\n        self.hits = {}                      # user -> deque of timestamps\n\n    def allow(self, user, now=None):\n        now = now if now is not None else time.time()\n        dq = self.hits.setdefault(user, deque())\n        cutoff = now - self.window\n        while dq and dq[0] <= cutoff:       # evict expired\n            dq.popleft()\n        if len(dq) < self.limit:\n            dq.append(now)\n            return True\n        return False\n```\n\nExact, but memory is $O(\\text{limit})$ per active user. At a limit of 10,000 across a million users that is real money.\n\n## Fixed window counter — cheap and wrong at the seam\n\nOne integer per user per minute. The flaw: a user can send N requests at 11:59:59 and N more at 12:00:00, so **2N requests pass inside one second**. That burst is exactly what a rate limiter exists to stop.\n\n## Sliding window counter — the production answer\n\nKeep the current and previous window counts and interpolate by how far into the current window you are:\n\n$$\\text{estimate} = C_{cur} + C_{prev} \\times \\left(1 - \\frac{t_{elapsed}}{W}\\right)$$\n\n```python\nimport math\n\nclass SlidingCounter:\n    def __init__(self, limit, window=60.0):\n        self.limit, self.window = limit, window\n        self.state = {}                     # user -> (window_index, cur, prev)\n\n    def allow(self, user, now):\n        idx = math.floor(now / self.window)\n        w_idx, cur, prev = self.state.get(user, (idx, 0, 0))\n        if idx == w_idx + 1:\n            w_idx, cur, prev = idx, 0, cur          # slid one window\n        elif idx > w_idx + 1:\n            w_idx, cur, prev = idx, 0, 0            # idle long enough to reset\n        elapsed = (now % self.window) / self.window\n        estimate = cur + prev * (1 - elapsed)\n        if estimate < self.limit:\n            self.state[user] = (w_idx, cur + 1, prev)\n            return True\n        self.state[user] = (w_idx, cur, prev)\n        return False\n```\n\nTwo integers per user, and Cloudflare measured the error at well under 1% in production. This is the right default.\n\n## Token bucket — when you want to allow bursts\n\nTokens refill at a fixed rate up to a cap; each request spends one. It permits a burst up to the bucket size and then settles to the refill rate, which is often what an API actually wants.\n\n## Comparison\n\n| Algorithm | Memory / user | Exact | Allows bursts | Seam problem |\n| --- | --- | --- | --- | --- |\n| Sliding log | O(limit) | Yes | No | No |\n| Fixed window | O(1) | No | Accidentally | **Yes, 2× at the boundary** |\n| Sliding counter | O(1) | ~99% | No | No |\n| Token bucket | O(1) | Yes | Deliberately | No |\n\n## Making it distributed\n\nAcross several gateway nodes, the counter must be shared and updated atomically. In Redis, a Lua script does the read-modify-write in one round trip; separate `GET` and `SET` calls race, and under load users will exceed their quota.",
      takeaways: [
        "The fixed window counter allows 2N requests across the boundary — that is its disqualifying flaw.",
        "The sliding window counter uses two integers and lands within about 1% of exact.",
        "Distributed limiters need one atomic operation (a Redis Lua script), not a read followed by a write."
      ],
      followUps: [
        "Different limits per plan tier.",
        "Return `Retry-After` correctly. (Time until the oldest entry expires, or until enough tokens refill.)",
        "Fail open or fail closed when Redis is down? (Usually open for availability — but say so deliberately.)"
      ],
      trap: "Proposing a fixed window counter without naming the boundary burst. If you name it and then justify the choice, that is a fine answer; if you do not, the interviewer assumes you did not see it."
    },
    {
      id: "dsa-binary-search-rotated",
      q: "Search for a target in a rotated sorted array with no duplicates, in $O(\\log n)$.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "microsoft", "meta-ai", "adobe", "bytedance", "oracle"],
      tags: ["binary-search", "arrays"],
      simple: "The array is sorted but someone cut it and swapped the two halves. At any midpoint, at least one side is still properly sorted — you can tell which by comparing the midpoint to the ends. Check whether the target lies inside that sorted side; if it does, go there, and if not, go the other way.",
      answer: "## The invariant\n\nAfter a rotation, for any `mid`, **at least one of `[lo..mid]` and `[mid..hi]` is fully sorted**. Identify which, then decide.\n\n```python\ndef search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n\n        if nums[lo] <= nums[mid]:              # left half is sorted\n            if nums[lo] <= target < nums[mid]:\n                hi = mid - 1                   # target is in it\n            else:\n                lo = mid + 1\n        else:                                  # right half is sorted\n            if nums[mid] < target <= nums[hi]:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n    return -1\n```\n\n$O(\\log n)$ time, $O(1)$ space.\n\n## Why `<=` in the sortedness test\n\nWhen `lo == mid` (a two-element window), `nums[lo] == nums[mid]` and the left half is trivially sorted. Using strict `<` sends you down the wrong branch and the search silently fails on a two-element input.\n\n## Getting the boundary comparisons right\n\nThe range checks are asymmetric on purpose: `nums[lo] <= target < nums[mid]` on the left, `nums[mid] < target <= nums[hi]` on the right. `mid` is already known not to equal the target, so it is excluded on both sides, while `lo` and `hi` are still live candidates and must be included.\n\n## With duplicates\n\nThe guarantee breaks. Given `[3, 3, 3, 1, 3]`, `nums[lo] == nums[mid] == nums[hi]` and you cannot tell which side is sorted. The standard fix shrinks the window by one:\n\n```python\nif nums[lo] == nums[mid] == nums[hi]:\n    lo += 1\n    hi -= 1\n    continue\n```\n\nThat degrades the worst case to $O(n)$, and it is provably unavoidable: an array of all-equal values with one different element gives the search no information to bisect on.",
      takeaways: [
        "At least one half is always sorted; find it, then test containment.",
        "Use `<=` in the sortedness check or two-element windows break.",
        "Duplicates force $O(n)$ worst case — this is a proven limit, not an implementation weakness."
      ],
      followUps: [
        "Find the rotation point (the minimum element).",
        "Search a rotated array with duplicates.",
        "Find the peak element in a bitonic array."
      ],
      trap: "Finding the pivot first with one binary search, then doing a second one. It works and it is $O(\\log n)$ — but the pivot search has its own tricky boundary conditions, so you have doubled the number of places to make an off-by-one error."
    },
    {
      id: "dsa-consistent-hashing-impl",
      q: "Implement consistent hashing. Why virtual nodes, and how many?",
      topic: "DSA",
      level: "hard",
      companies: ["amazon", "google", "uber", "netflix", "databricks", "bytedance", "snowflake"],
      tags: ["hashing", "distributed", "design", "binary-search"],
      simple: "Imagine a clock face. Every server sits at some position on the rim, and every key hashes to a position too. A key belongs to the first server clockwise from it. Add or remove a server and only the keys in that one arc move — everything else stays put. Virtual nodes just mean each server gets many positions instead of one, so the arcs come out evenly sized.",
      answer: "## Why not modulo\n\nWith `server = hash(key) % N`, changing `N` from 4 to 5 remaps roughly **80% of all keys**. Every cache miss at once is a thundering herd against your database. Consistent hashing moves only $K/N$ keys on average when one node joins or leaves.\n\n## The ring\n\n```python\nimport bisect, hashlib\n\nclass ConsistentHash:\n    def __init__(self, nodes=(), vnodes=150):\n        self.vnodes = vnodes\n        self.ring = {}          # hash position -> physical node\n        self.sorted_keys = []   # sorted positions, for binary search\n        for n in nodes:\n            self.add(n)\n\n    def _hash(self, key):\n        return int(hashlib.md5(key.encode()).hexdigest(), 16)\n\n    def add(self, node):\n        for i in range(self.vnodes):\n            h = self._hash(node + \"#\" + str(i))\n            self.ring[h] = node\n            bisect.insort(self.sorted_keys, h)\n\n    def remove(self, node):\n        for i in range(self.vnodes):\n            h = self._hash(node + \"#\" + str(i))\n            del self.ring[h]\n            idx = bisect.bisect_left(self.sorted_keys, h)\n            self.sorted_keys.pop(idx)\n\n    def get(self, key):\n        if not self.ring:\n            return None\n        h = self._hash(key)\n        idx = bisect.bisect(self.sorted_keys, h)\n        if idx == len(self.sorted_keys):\n            idx = 0                       # wrap around the ring\n        return self.ring[self.sorted_keys[idx]]\n```\n\nLookup is $O(\\log(N \\cdot V))$ from the binary search.\n\n## Why virtual nodes\n\nWith one position per server, the arc sizes are random and the variance is brutal — with 10 servers, one can easily own three times its fair share. Each server placing $V$ positions averages $V$ independent samples, and the standard deviation of the load falls as $1/\\sqrt{V}$.\n\n| Virtual nodes | Approximate load spread |\n| --- | --- |\n| 1 | ±100% or worse |\n| 10 | ±30% |\n| 100 | ±10% |\n| 150 | ±8% |\n| 1000 | ±3% |\n\n**150 is the common default** (Dynamo, Cassandra, Ketama). Beyond that you are paying memory and ring-rebuild time for diminishing returns.\n\nVirtual nodes have a second benefit that matters more in an outage: when a server dies, its load is redistributed across *many* remaining servers rather than dumped entirely on its single clockwise neighbour.\n\n## Heterogeneous hardware\n\nA machine with twice the capacity gets twice the virtual nodes. Weighting falls out of the design for free.\n\n## The modern alternative\n\n**Rendezvous hashing** (highest random weight) computes `hash(key, node)` for every node and picks the maximum. It is $O(N)$ per lookup rather than $O(\\log N)$, but needs no ring state, gives perfectly even distribution without virtual nodes, and is much simpler to reason about. For small $N$ it is often the better choice — worth naming as the alternative you considered.",
      takeaways: [
        "Modulo hashing remaps almost everything on a resize; consistent hashing moves $K/N$.",
        "Virtual nodes cut load variance as $1/\\sqrt{V}$; 150 is the standard default.",
        "Virtual nodes also spread a failed node's load across many survivors, not one neighbour."
      ],
      followUps: [
        "Add replication — take the next R distinct physical nodes clockwise.",
        "Handle a hot key that one node cannot serve alone. (Key splitting, or a small replicated cache.)",
        "Compare with rendezvous hashing and with jump consistent hash."
      ],
      trap: "Placing the replicas at the next R *ring positions* rather than the next R distinct *physical* nodes. With virtual nodes, consecutive positions often belong to the same machine, so all your replicas land on one box and the replication is worthless."
    },
    {
      id: "dsa-string-anagram-group",
      q: "Group a list of strings into anagrams.",
      topic: "DSA",
      level: "easy",
      companies: ["amazon", "microsoft", "adobe", "flipkart", "tcs", "salesforce", "uber"],
      tags: ["hash-map", "strings", "sorting"],
      simple: "Two words are anagrams if they contain the same letters. So give every word a fingerprint that ignores order — sorting the letters is the easy way. Words with the same fingerprint go in the same bucket.",
      answer: "## Sorted-letters key\n\n```python\nfrom collections import defaultdict\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[\"\".join(sorted(w))].append(w)\n    return list(groups.values())\n```\n\n$O(n \\cdot L \\log L)$ for $n$ words of length $L$.\n\n## Character-count key — better for long strings\n\nSorting is the bottleneck. If the alphabet is small and fixed, a count vector is a linear-time fingerprint:\n\n```python\ndef group_anagrams_counts(words):\n    groups = defaultdict(list)\n    for w in words:\n        counts = [0] * 26\n        for ch in w:\n            counts[ord(ch) - ord(\"a\")] += 1\n        groups[tuple(counts)].append(w)      # tuple, so it can be a dict key\n    return list(groups.values())\n```\n\n$O(n \\cdot L)$. Better when $L$ is large; slightly worse when $L$ is tiny, because building a 26-element tuple costs more than sorting three characters. Say which regime you are optimising for.\n\n## The prime-product idea, and why not to use it\n\nMap each letter to a prime and multiply. By unique factorisation the product is a perfect anagram fingerprint — and it overflows a 64-bit integer at around 15 characters. In Python big integers save you, but the multiplication is then not $O(1)$. It is a nice observation and a bad implementation; mention it only to dismiss it.\n\n## Unicode\n\nThe 26-slot array assumes lowercase ASCII. For real text use a `Counter` and normalise first — `NFC` normalisation, and a decision about whether `é` and `e` + combining accent should count as the same letter.",
      takeaways: [
        "Any order-independent fingerprint works; sorted letters and count vectors are the two practical ones.",
        "Count vectors are $O(L)$ versus $O(L \\log L)$ — better for long strings.",
        "Prime products are elegant and overflow; know why they fail."
      ],
      followUps: [
        "Find all anagrams of a pattern inside a longer string. (Sliding window over counts.)",
        "Handle a 100 GB word list. (Shard by fingerprint hash and map-reduce.)",
        "Case-insensitive and Unicode-aware grouping."
      ],
      trap: "Using a list as a dictionary key. Lists are unhashable in Python; you must convert to a tuple or a string first."
    },
    {
      id: "dsa-heap-merge-k-lists",
      q: "Merge k sorted linked lists into one sorted list.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "microsoft", "bytedance", "databricks", "snowflake"],
      tags: ["heap", "linked-list", "divide-and-conquer"],
      simple: "Look at the first element of every list and take the smallest. Then look again — the list you took from has a new front. A min-heap does exactly this bookkeeping for you: it always knows which of the k candidates is smallest.",
      answer: "## Min-heap of heads\n\n```python\nimport heapq\n\ndef merge_k_lists(lists):\n    heap = []\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(heap, (node.val, i, node))   # i breaks val ties\n    dummy = tail = ListNode()\n    while heap:\n        _, i, node = heapq.heappop(heap)\n        tail.next = node\n        tail = node\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next\n```\n\n$O(N \\log k)$ time for $N$ total nodes, $O(k)$ space.\n\n**The index `i` is not decoration.** When two nodes have equal values, Python's tuple comparison falls through to the next element — and `ListNode` objects do not define `<`, so it raises `TypeError`. The index guarantees a total order and is never reached beyond that. This is the single most common bug in this problem.\n\n## Divide and conquer — same bound, no heap\n\nMerge lists pairwise, halving the count each round:\n\n```python\ndef merge_k_divide(lists):\n    if not lists:\n        return None\n    while len(lists) > 1:\n        merged = []\n        for i in range(0, len(lists), 2):\n            a = lists[i]\n            b = lists[i + 1] if i + 1 < len(lists) else None\n            merged.append(merge_two(a, b))\n        lists = merged\n    return lists[0]\n```\n\nAlso $O(N \\log k)$: $\\log k$ rounds, each touching all $N$ nodes. It uses $O(1)$ extra space for the linked-list version, and it parallelises trivially — each pairwise merge is independent. That makes it the better answer if the follow-up is about distributing the work.\n\n## What not to do\n\nMerging one list at a time into an accumulator is $O(Nk)$: the accumulated list is re-traversed on every merge. With k = 10,000 that is the difference between seconds and hours.",
      takeaways: [
        "Push a tiebreaker index into the heap tuple, or equal values crash on comparing nodes.",
        "Heap and divide-and-conquer are both $O(N \\log k)$; divide-and-conquer parallelises.",
        "Sequential accumulation is $O(Nk)$ — the trap answer."
      ],
      followUps: [
        "Merge k sorted arrays instead. (Same heap; or a k-way external merge if they do not fit in memory.)",
        "Do it across machines. (Divide and conquer maps directly onto a reduce tree.)",
        "Merge k sorted streams of unknown length."
      ],
      trap: "Omitting the tiebreaker in the heap tuple. It works on every test case with distinct values and throws `TypeError: '<' not supported between instances of 'ListNode'` the moment two values match."
    }
  ]);
})(window.TD = window.TD || {});
