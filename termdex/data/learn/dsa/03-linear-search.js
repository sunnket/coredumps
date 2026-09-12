/* DSA for Interviews — stacks, queues, heaps, and binary search. */
TD.addLessons("dsa", [

{
 t: "Problems That Announce Themselves by Needing a Stack",
 m: "linear",
 lvl: "core",
 s: "Stacks, deques and heaps — recognising them from the wording of the question.",
 goal: [
  "Recognise a stack problem from its phrasing",
  "Use a deque for queues and sliding-window extremes",
  "Apply a heap to top-k, merge and streaming-median problems"
 ],
 b: [
  { p: "These three structures are easy to implement and the difficulty is entirely recognition. Each has a small set of phrasings that reliably indicate it, and learning those phrasings is faster than learning the problems." },

  { h: "Stacks" },
  { tbl: { t: "The phrasings",
    h: ["Question says", "Because"],
    rows: [
     ["*matching / balanced brackets*", "The most recent opener must close first — that is a stack"],
     ["*valid parentheses*, *evaluate an expression*", "Nesting is stack-shaped by definition"],
     ["*undo*, *backtrack*, *previous state*", "Last in, first out"],
     ["**\"next greater\" / \"previous smaller\"**", "**Monotonic stack.** The signature phrasing"],
     ["*largest rectangle*, *trapping rain water*", "Monotonic stack, in disguise"],
     ["*simplify a path*, *decode a nested string*", "Nesting again"]
    ] } },

  { code: { lang: "python", t: "The two stack templates",
    lines: [
     { c: "# 1. matching -- push openers, pop and check on closers", w: "" },
     { c: "def valid(s):", w: "" },
     { c: "    pairs = {')': '(', ']': '[', '}': '{'}", w: "" },
     { c: "    stack = []", w: "" },
     { c: "    for ch in s:", w: "" },
     { c: "        if ch in '([{':", w: "" },
     { c: "            stack.append(ch)", w: "" },
     { c: "        elif not stack or stack.pop() != pairs[ch]:", w: "**Both failure cases in one condition** — nothing to pop, or the wrong opener.", hi: true },
     { c: "            return False", w: "" },
     { c: "    return not stack", w: "**Leftover openers means unbalanced.** Forgetting this final check is the common bug." },
     { c: "", w: "" },
     { c: "# 2. monotonic -- maintain a stack in sorted order", w: "" },
     { c: "def daily_temperatures(temps):", w: "**How many days until a warmer day?**" },
     { c: "    res, stack = [0] * len(temps), []", w: "**Stack holds indices whose answer is still unknown.**", hi: true },
     { c: "    for i, t in enumerate(temps):", w: "" },
     { c: "        while stack and temps[stack[-1]] < t:", w: "**This temperature answers everything colder still waiting.**", hi: true },
     { c: "            j = stack.pop()", w: "" },
     { c: "            res[j] = i - j", w: "" },
     { c: "        stack.append(i)", w: "" },
     { c: "    return res", w: "**O(n).** The `while` looks quadratic and is not — each index is pushed once and popped once." }
    ] } },

  { n: "The complexity argument for a monotonic stack is worth rehearsing, because the nested `while` looks quadratic and interviewers ask. *Each index is pushed exactly once and popped at most once, so the total work across the whole loop is O(n) regardless of how the inner loop behaves on any single iteration.*",
    nt: "The sentence to have ready" },

  { h: "Queues and deques" },
  { code: { lang: "python", t: "Never use a list as a queue",
    lines: [
     { c: "from collections import deque", w: "" },
     { c: "", w: "" },
     { c: "q = deque([1, 2, 3])", w: "" },
     { c: "q.append(4)", w: "**O(1)** at the right." },
     { c: "q.popleft()", w: "**O(1)** at the left." },
     { c: "q.appendleft(0)", w: "O(1)." },
     { c: "", w: "" },
     { c: "# a list is O(n) at the front:", w: "" },
     { c: "lst.pop(0)", w: "**Shifts every remaining element.** In a BFS over 10⁵ nodes this turns O(n) into O(n²) silently.", hi: true }
    ] } },

  { code: { lang: "python", t: "Monotonic deque — sliding window maximum",
    lines: [
     { c: "def max_sliding_window(nums, k):", w: "**Maximum of every window of size k, in O(n).**" },
     { c: "    dq, out = deque(), []", w: "**Holds indices, decreasing by value.**" },
     { c: "", w: "" },
     { c: "    for i, x in enumerate(nums):", w: "" },
     { c: "        while dq and dq[0] <= i - k:", w: "**Drop indices that have fallen out of the window.**", hi: true },
     { c: "            dq.popleft()", w: "" },
     { c: "", w: "" },
     { c: "        while dq and nums[dq[-1]] <= x:", w: "**Anything smaller than the new value can never be a future maximum.**", hi: true },
     { c: "            dq.pop()", w: "" },
     { c: "", w: "" },
     { c: "        dq.append(i)", w: "" },
     { c: "        if i >= k - 1:", w: "" },
     { c: "            out.append(nums[dq[0]])", w: "**The front is always the window maximum.**" },
     { c: "    return out", w: "" }
    ],
    after: "This is the hardest of the common templates and it appears often enough to be worth memorising. The insight is the second `while`: once a larger value arrives, every smaller value still in the deque is permanently irrelevant." } },

  { h: "Heaps" },
  { tbl: { t: "The heap phrasings",
    h: ["Question says", "Approach"],
    rows: [
     ["**\"k largest\" / \"k smallest\"**", "A heap of size k. O(n log k), better than sorting"],
     ["*\"k-th largest\"*", "Same heap; the answer is at the root"],
     ["*\"merge k sorted lists\"*", "**A heap of the k current heads**"],
     ["*\"median of a stream\"*", "**Two heaps** — a max-heap of the lower half, a min-heap of the upper"],
     ["*\"schedule by priority\"*", "A priority queue, which is what a heap is"],
     ["*\"closest k points\"*", "Heap keyed on distance"]
    ] } },

  { code: { lang: "python", t: "Merge k sorted lists",
    lines: [
     { c: "import heapq", w: "" },
     { c: "", w: "" },
     { c: "def merge_k(lists):", w: "" },
     { c: "    h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]", w: "**(value, list index, position).** The middle element breaks ties so Python never compares the lists themselves.", hi: true },
     { c: "    heapq.heapify(h)", w: "**O(n), cheaper than n pushes.**" },
     { c: "", w: "" },
     { c: "    out = []", w: "" },
     { c: "    while h:", w: "" },
     { c: "        val, li, pos = heapq.heappop(h)", w: "**The smallest head across all lists.**" },
     { c: "        out.append(val)", w: "" },
     { c: "        if pos + 1 < len(lists[li]):", w: "" },
     { c: "            heapq.heappush(h, (lists[li][pos+1], li, pos+1))", w: "**Refill from the list you just took from.**", hi: true },
     { c: "    return out", w: "**O(N log k)** where N is the total number of elements." }
    ] } },

  { trap: "When you push tuples onto a heap, Python compares element by element — so if two values tie it compares the *next* element. If that is an object without an ordering, it raises `TypeError: '<' not supported`. Always include a unique tiebreaker such as an index as the second element. This bug appears mid-interview and is confusing under pressure." },

  { tryit: { t: "Recognise before you code",
    task: "For each, name the structure and the reason in one line, then implement:\n\n1. Evaluate a Reverse Polish expression\n2. Find the k-th largest element in a stream\n3. Shortest path in an unweighted grid\n4. Largest rectangle in a histogram",
    hint: "1 is a stack. 2 is a size-k min-heap. 3 is a deque for BFS. 4 is a monotonic stack, and it is the hardest of the four.",
    sol: { lang: "python", code: "import heapq\nfrom collections import deque\n\n# 1. STACK -- operators apply to the two most recent operands\ndef eval_rpn(tokens):\n    st = []\n    for t in tokens:\n        if t in '+-*/':\n            b, a = st.pop(), st.pop()\n            st.append({'+': a+b, '-': a-b, '*': a*b,\n                       '/': int(a/b)}[t])\n        else:\n            st.append(int(t))\n    return st[0]\n\n# 2. HEAP of size k -- root is the k-th largest\nclass KthLargest:\n    def __init__(self, k, nums):\n        self.k, self.h = k, nums[:]\n        heapq.heapify(self.h)\n        while len(self.h) > k: heapq.heappop(self.h)\n    def add(self, x):\n        heapq.heappush(self.h, x)\n        if len(self.h) > self.k: heapq.heappop(self.h)\n        return self.h[0]\n\n# 3. DEQUE -- BFS gives shortest path when all edges cost 1\ndef shortest(grid, start, goal):\n    q, seen = deque([(start, 0)]), {start}\n    while q:\n        (r, c), d = q.popleft()\n        if (r, c) == goal: return d\n        for nr, nc in ((r+1,c),(r-1,c),(r,c+1),(r,c-1)):\n            if (0 <= nr < len(grid) and 0 <= nc < len(grid[0])\n                    and grid[nr][nc] == 0 and (nr,nc) not in seen):\n                seen.add((nr,nc)); q.append(((nr,nc), d+1))\n    return -1\n\n# 4. MONOTONIC STACK -- each bar's rectangle is bounded by\n#    the first smaller bar on each side\ndef largest_rectangle(heights):\n    st, best = [], 0\n    for i, h in enumerate(heights + [0]):     # sentinel flushes it\n        while st and heights[st[-1]] >= h:\n            height = heights[st.pop()]\n            width = i - st[-1] - 1 if st else i\n            best = max(best, height * width)\n        st.append(i)\n    return best" },
    w: "Problem 4 is worth returning to several times. The sentinel zero appended to the array is the trick that flushes the stack at the end without a separate loop, and the width calculation `i - st[-1] - 1` is the part everyone gets wrong first. It is a genuinely hard problem and it is asked often enough to justify the effort." } },

  { vocab: ["Stack", "Queue", "Heap", "Priority Queue"] }
 ],
 k: [
  "*Next greater* or *previous smaller* means a monotonic stack, and it is O(n) despite the inner while.",
  "Never use a list as a queue — `pop(0)` is O(n). Use `collections.deque`.",
  "A monotonic deque gives sliding-window maximum in O(n); the insight is discarding permanently-irrelevant smaller values.",
  "*Top k* means a size-k heap at O(n log k); *stream median* means two heaps.",
  "Always put a unique tiebreaker in heap tuples, or ties raise a TypeError."
 ],
 r: ["Stack", "Queue", "Heap", "Priority Queue", "Time Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "while stack and nums[stack[-1]] < x: res[stack.pop()] = ...", w: "monotonic stack template" },
   { c: "from collections import deque; q.popleft()", w: "O(1) queue, unlike a list" },
   { c: "while dq and nums[dq[-1]] <= x: dq.pop()", w: "discard values that can never be a future maximum" },
   { c: "heapq.heappush(h, (value, index, payload))", w: "heap tuple with a tiebreaker" },
   { c: "heapq.heapify(h)", w: "O(n) rather than n pushes" }
  ]
 }
},

{
 t: "Binary Search, Including on Answers",
 m: "search",
 lvl: "core",
 s: "The template that avoids off-by-one, and the pattern most candidates never spot.",
 goal: [
  "Write binary search without boundary errors",
  "Use `bisect` for the standard cases",
  "Recognise binary-search-on-the-answer, which is the interesting half"
 ],
 b: [
  { p: "Everyone knows binary search and most people write it wrong under pressure. The fix is one template used consistently. The genuinely valuable half of this topic is the second one — searching over an *answer space* rather than an array — which most candidates never recognise." },

  { h: "One template, used every time" },
  { code: { lang: "python", t: "The half-open version, which has fewer edge cases",
    lines: [
     { c: "def search(nums, target):", w: "" },
     { c: "    lo, hi = 0, len(nums)", w: "**`len(nums)`, not `len(nums)-1`.** Half-open `[lo, hi)`.", hi: true },
     { c: "", w: "" },
     { c: "    while lo < hi:", w: "**`<`, not `<=`**, because hi is exclusive." },
     { c: "        mid = (lo + hi) // 2", w: "**In Python there is no overflow**, so `lo + (hi-lo)//2` is unnecessary — mention it only if asked about C++ or Java." },
     { c: "", w: "" },
     { c: "        if nums[mid] == target:", w: "" },
     { c: "            return mid", w: "" },
     { c: "        elif nums[mid] < target:", w: "" },
     { c: "            lo = mid + 1", w: "**`mid + 1`** — mid is ruled out." },
     { c: "        else:", w: "" },
     { c: "            hi = mid", w: "**`mid`, not `mid - 1`**, because hi is exclusive. This asymmetry is the whole reason half-open has fewer bugs.", hi: true },
     { c: "", w: "" },
     { c: "    return -1", w: "" }
    ],
    after: "Pick one template and use it forever. The bugs come from mixing conventions between problems — inclusive in one, exclusive in another — not from the idea being hard." } },

  { code: { lang: "python", t: "bisect handles the standard cases for you",
    lines: [
     { c: "import bisect", w: "" },
     { c: "", w: "" },
     { c: "a = [1, 3, 3, 5, 7]", w: "" },
     { c: "bisect.bisect_left(a, 3)", w: "**1** — the first position where 3 could be inserted. **Leftmost occurrence.**", hi: true },
     { c: "bisect.bisect_right(a, 3)", w: "**3** — after the last 3. **One past the rightmost occurrence.**" },
     { c: "bisect.bisect_right(a,3) - bisect.bisect_left(a,3)", w: "**Count of 3s = 2.** A one-line answer to a common question." },
     { c: "", w: "" },
     { c: "bisect.insort(a, 4)", w: "Insert keeping order — O(n) because of the shift, not O(log n)." }
    ] } },

  { n: "Using `bisect` in an interview is fine and shows you know the standard library. Be ready to write the loop yourself if asked — some interviewers want to see it, and *I would use bisect, but here is the implementation* is the answer that satisfies both.",
    nt: "Library or by hand" },

  { h: "Binary search on the answer" },
  { p: "This is the pattern worth the effort. When a question asks for the **minimum feasible** or **maximum possible** value, and you can *check* whether a candidate value works, you can binary search over the candidates — even when there is no sorted array anywhere in sight." },

  { code: { lang: "python", t: "The template",
    lines: [
     { c: "def min_feasible(lo, hi, works):", w: "" },
     { c: "    while lo < hi:", w: "" },
     { c: "        mid = (lo + hi) // 2", w: "" },
     { c: "        if works(mid):", w: "**`works` is monotonic: if mid works, everything above it works.** That property is what makes the search valid, and stating it is the key insight to voice.", hi: true },
     { c: "            hi = mid", w: "**Try smaller.**" },
     { c: "        else:", w: "" },
     { c: "            lo = mid + 1", w: "**Need bigger.**" },
     { c: "    return lo", w: "" }
    ] } },

  { code: { lang: "python", t: "Two problems that look nothing like binary search",
    lines: [
     { c: "# Koko eating bananas: minimum speed to finish in h hours", w: "" },
     { c: "def min_speed(piles, h):", w: "" },
     { c: "    def works(speed):", w: "" },
     { c: "        return sum(math.ceil(p / speed) for p in piles) <= h", w: "**Monotonic: a higher speed always finishes at least as fast.**", hi: true },
     { c: "    return min_feasible(1, max(piles), works)", w: "**Search over SPEEDS**, not over the array. O(n log(max)).", hi: true },
     { c: "", w: "" },
     { c: "# Split array into k parts, minimising the largest part sum", w: "" },
     { c: "def split_array(nums, k):", w: "" },
     { c: "    def works(cap):", w: "" },
     { c: "        parts, cur = 1, 0", w: "" },
     { c: "        for x in nums:", w: "" },
     { c: "            if cur + x > cap:", w: "" },
     { c: "                parts, cur = parts + 1, x", w: "" },
     { c: "            else:", w: "" },
     { c: "                cur += x", w: "" },
     { c: "        return parts <= k", w: "**A greedy feasibility check inside a binary search.** Two patterns composed — and it is a common interview shape.", hi: true },
     { c: "    return min_feasible(max(nums), sum(nums), works)", w: "**Bounds matter**: the answer is at least the largest element and at most the total." }
    ] } },

  { tbl: { t: "The tells for binary search on the answer",
    h: ["The question says", "Search over"],
    rows: [
     ["*minimum speed / rate / capacity to…*", "Speeds or capacities"],
     ["*maximum X such that…*", "Values of X"],
     ["*smallest divisor / largest minimum*", "The quantity itself"],
     ["*minimise the maximum*, *maximise the minimum*", "**Almost always this pattern**"],
     ["*can it be done in k…?*", "The resource being budgeted"]
    ] } },

  { p: "The test is: can you write a `works(x)` function that is monotonic — true for all x above some threshold and false below, or vice versa? If yes, binary search applies regardless of what the data looks like." },

  { h: "Sorting, briefly" },
  { l: [
   "**`sort()` is O(n log n)** and in place; `sorted()` returns a new list and costs O(n) space.",
   "**`key=` is the useful part**: `sort(key=lambda x: (x[1], -x[0]))` sorts by one field ascending and another descending.",
   "**Python's sort is stable** — equal elements keep their relative order, which lets you sort by multiple keys in successive passes.",
   "**Sorting first is often the whole solution.** Merge intervals, meeting rooms, and most *overlap* problems become trivial once sorted by start time.",
   "**Counting sort is O(n)** when values are small integers in a known range. Worth mentioning when the constraints suggest it."
  ] },

  { tryit: { t: "Spot the hidden binary search",
    task: "For each, decide whether binary search applies and what you would search over.\n\n1. Find the peak element in a mountain array\n2. Minimum days to make m bouquets, given bloom days\n3. Median of two sorted arrays\n4. Find the first bad version in a build history",
    hint: "For 2, ask whether waiting longer can ever make fewer bouquets available.",
    sol: { lang: "python", code: "# 1. YES -- search the ARRAY. Compare nums[mid] with\n#    nums[mid+1]: rising means the peak is to the right.\n#    Monotonic in the derivative, not the values.\n\n# 2. YES -- search over DAYS, from min(bloom) to max(bloom).\n#    works(d) = can we make m bouquets by day d?\n#    Monotonic: more days never means fewer bouquets.\ndef min_days(bloom, m, k):\n    def works(d):\n        made = run = 0\n        for b in bloom:\n            run = run + 1 if b <= d else 0\n            if run == k:\n                made += 1; run = 0\n        return made >= m\n    if m * k > len(bloom): return -1\n    lo, hi = min(bloom), max(bloom)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if works(mid): hi = mid\n        else:          lo = mid + 1\n    return lo\n\n# 3. YES, and it is hard -- binary search on the PARTITION\n#    point of the smaller array. A genuinely difficult\n#    problem; know that it exists.\n\n# 4. YES -- the textbook case. Search over version numbers;\n#    isBadVersion is monotonic by definition." },
    w: "Problem 2 is the one that trains the reflex. Nothing about *minimum days to make m bouquets* looks like binary search — there is no sorted array to search. The move is to notice that the answer lives in a bounded range and that feasibility is monotonic in it. Once you have seen that once, you start seeing it everywhere." } },

  { vocab: ["Binary Search", "Sorting Algorithm", "Time Complexity", "Algorithm"] }
 ],
 k: [
  "Use one binary search template consistently — half-open `[lo, hi)` has the fewest edge cases.",
  "`bisect_left` and `bisect_right` handle the standard cases; their difference counts occurrences.",
  "*Minimise the maximum* or *minimum X such that* almost always means binary search on the answer.",
  "The requirement is a monotonic `works(x)`, not a sorted array.",
  "Sorting first is the whole solution to most interval and overlap problems."
 ],
 r: ["Binary Search", "Sorting Algorithm", "Big-O Notation", "Algorithm"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "lo, hi = 0, len(nums); while lo < hi: ... hi = mid", w: "half-open binary search, one template forever" },
   { c: "bisect.bisect_left(a, x)", w: "leftmost insertion point" },
   { c: "if works(mid): hi = mid else: lo = mid + 1", w: "binary search on the answer" },
   { c: "sort(key=lambda x: (x[1], -x[0]))", w: "sort by two keys, opposite directions" }
  ]
 }
}

]);
