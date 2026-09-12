/* DSA for Interviews — the array and string patterns past the first three.

   The arrays module already teaches the hash map reflex, two pointers and
   sliding window. These are the patterns that show up once a company is
   filtering harder: intervals, cyclic sort, prefix/difference arrays, and the
   in-place tricks that turn an O(n) space answer into O(1). */
TD.addLessons("dsa", [

{
 t: "Intervals — Sorting by the Right Endpoint",
 m: "arrays",
 lvl: "intermediate",
 s: "Merging, inserting, and the greedy scheduling result that half of interval questions reduce to.",
 goal: [
  "Merge and insert intervals without missing an edge case",
  "Know whether to sort by start or by end, and why it decides the problem",
  "Apply the sweep-line counter to room and resource questions"
 ],
 b: [
  { p: "Intervals are a small, self-contained family. **Nearly every one is solved by sorting first**, and the only real decision is which endpoint you sort by — that single choice separates the merging problems from the scheduling ones." },

  { h: "Sort by start: merging" },
  { code: { lang: "python", t: "Merge overlapping intervals",
    lines: [
     { c: "def merge(intervals):", w: "" },
     { c: "    intervals.sort(key=lambda x: x[0])", w: "**By START. Now any overlap is with the previous one only.**", hi: true },
     { c: "    out = []", w: "" },
     { c: "    for start, end in intervals:", w: "" },
     { c: "        if out and start <= out[-1][1]:", w: "**Overlap: this one begins before the last one ended.**", hi: true },
     { c: "            out[-1][1] = max(out[-1][1], end)", w: "**`max` matters** — the current interval may sit entirely inside the previous.", hi: true },
     { c: "        else:", w: "" },
     { c: "            out.append([start, end])", w: "**A genuine gap — start a new run.**" },
     { c: "    return out", w: "**O(n log n)** for the sort; the pass itself is O(n)." }
    ],
    after: "Sorting by start is what reduces the problem from *does this overlap anything?* to *does this overlap the previous one?* — an O(n²) question becomes O(n)." } },

  { trap: "`out[-1][1] = end` without the `max` is the classic wrong answer. Given `[1,10]` then `[2,3]`, it shrinks the merged interval to `[1,3]` and silently loses everything from 3 to 10. **Always take the max of the two ends.**" },

  { h: "Sort by end: greedy scheduling" },
  { p: "**When the question asks how many non-overlapping things fit, sort by end time.** This is one of the few greedy choices with a clean proof, and it is worth being able to state." },

  { code: { lang: "python", t: "Maximum non-overlapping intervals",
    lines: [
     { c: "def max_meetings(intervals):", w: "**How many meetings fit in one room?**" },
     { c: "    intervals.sort(key=lambda x: x[1])", w: "**By END. Finishing early leaves the most room for the rest.**", hi: true },
     { c: "    count, last_end = 0, float('-inf')", w: "" },
     { c: "    for start, end in intervals:", w: "" },
     { c: "        if start >= last_end:", w: "**It fits after everything taken so far.**" },
     { c: "            count += 1", w: "" },
     { c: "            last_end = end", w: "**Take it. Never reconsider.**", hi: true },
     { c: "    return count", w: "" },
     { c: "", w: "" },
     { c: "# 'minimum removals to make them disjoint' = len(intervals) - count", w: "**The same problem, phrased inversely.**", hi: true }
    ],
    after: "The proof, in one line: **the greedy choice always leaves at least as much room as any alternative**, so an optimal solution can be rewritten to start with it without getting worse. That is an exchange argument, and saying it demonstrates you are not just pattern-matching." } },

  { h: "Neither: the sweep line" },
  { p: "When the question is *how many are active at once* — meeting rooms, concurrent calls, peak load — do not think in intervals at all. **Think in events.**" },

  { code: { lang: "python", t: "Minimum meeting rooms",
    lines: [
     { c: "def min_rooms(intervals):", w: "" },
     { c: "    events = []", w: "" },
     { c: "    for s, e in intervals:", w: "" },
     { c: "        events.append((s, +1))", w: "**A start needs a room.**" },
     { c: "        events.append((e, -1))", w: "**An end frees one.**" },
     { c: "", w: "" },
     { c: "    events.sort()", w: "**At equal times, -1 sorts before +1** — a room freed at 10 is reusable at 10.", hi: true },
     { c: "", w: "" },
     { c: "    cur = best = 0", w: "" },
     { c: "    for _, delta in events:", w: "" },
     { c: "        cur += delta", w: "" },
     { c: "        best = max(best, cur)", w: "**The peak is the answer.**", hi: true },
     { c: "    return best", w: "**O(n log n).**" }
    ],
    after: "That tie-breaking detail is deliberate. Because `-1 < +1`, Python's tuple sort puts the end first, so touching intervals do not falsely need two rooms. **If the problem says a room cannot be reused at the same instant, flip the signs.** Ask which convention they want — it is a good clarifying question." } },

  { tbl: { t: "Which sort key, from the wording",
    h: ["Question asks", "Sort by", "Then"],
    rows: [
     ["*merge*, *combine*, *insert into*", "**Start**", "Compare each with the previous kept interval"],
     ["*maximum number that fit*, *minimum removals*", "**End**", "Greedy: take it if it starts after the last end"],
     ["*how many at the same time*, *minimum rooms*", "**Neither — events**", "±1 sweep, track the running peak"],
     ["*does any pair overlap*", "**Start**", "Any adjacent pair overlapping is enough"]
    ] } },

  { tryit: { t: "Four interval problems, one decision each",
    task: "For each, say which sort key you would use before writing anything.\n\n1. Insert a new interval into a sorted, non-overlapping list and merge\n2. Given flight take-off and landing times, find the maximum planes in the air\n3. Given n intervals, find the minimum to remove so none overlap\n4. Given your schedule and a colleague's, find every free slot you share",
    hint: "2 is a sweep. 3 is greedy by end time. 4 is two pointers across two already-sorted lists.",
    sol: { lang: "python", code: "# 1. sort by START -- or exploit the input already being sorted\ndef insert(intervals, new):\n    out, i, n = [], 0, len(intervals)\n    while i < n and intervals[i][1] < new[0]:      # strictly before\n        out.append(intervals[i]); i += 1\n    while i < n and intervals[i][0] <= new[1]:     # overlapping\n        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]\n        i += 1\n    out.append(new)\n    out.extend(intervals[i:])                      # strictly after\n    return out                                     # O(n), no sort needed\n\n# 2. SWEEP -- peak concurrency\ndef max_in_air(flights):\n    ev = []\n    for s, e in flights:\n        ev.append((s, 1)); ev.append((e, -1))\n    ev.sort()\n    cur = best = 0\n    for _, d in ev:\n        cur += d\n        best = max(best, cur)\n    return best\n\n# 3. greedy by END -- keep the most, remove the rest\ndef min_removals(intervals):\n    intervals.sort(key=lambda x: x[1])\n    kept, last = 0, float('-inf')\n    for s, e in intervals:\n        if s >= last:\n            kept += 1; last = e\n    return len(intervals) - kept\n\n# 4. TWO POINTERS across two sorted lists -- intersect, then advance\ndef free_slots(a, b):\n    i = j = 0\n    out = []\n    while i < len(a) and j < len(b):\n        lo = max(a[i][0], b[j][0])\n        hi = min(a[i][1], b[j][1])\n        if lo < hi:\n            out.append([lo, hi])\n        if a[i][1] < b[j][1]: i += 1     # advance whichever ends first\n        else:                 j += 1\n    return out" },
    w: "Problem 1 is worth noticing: **the input is already sorted, so sorting again would be the wrong instinct** and turns an O(n) answer into O(n log n). Always check what order the input already has before reaching for `.sort()`." } },

  { vocab: ["Sorting Algorithm", "Greedy Algorithm", "Two Pointers", "Array", "Time Complexity"] }
 ],
 k: [
  "Sort by **start** to merge; sort by **end** to fit the most in; use an **event sweep** for peak concurrency.",
  "`out[-1][1] = max(out[-1][1], end)` — forgetting the max silently swallows a nested interval.",
  "Greedy by end time is provable by an exchange argument: finishing earliest leaves the most room.",
  "In a sweep, sorting `(time, delta)` puts -1 before +1, so touching intervals share a room.",
  "If the input is already sorted, do not sort it again — that is an O(n) solution thrown away."
 ],
 r: ["Sorting Algorithm", "Greedy Algorithm", "Array", "Two Pointers"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "intervals.sort(key=lambda x: x[0])", w: "merging — sort by start" },
   { c: "intervals.sort(key=lambda x: x[1])", w: "max non-overlapping — sort by end" },
   { c: "if start <= out[-1][1]: out[-1][1] = max(out[-1][1], end)", w: "merge, keeping the furthest end" },
   { c: "ev.append((s, 1)); ev.append((e, -1))", w: "sweep line — peak concurrency" }
  ]
 }
},

{
 t: "Prefix Sums, Difference Arrays and Cyclic Sort",
 m: "arrays",
 lvl: "intermediate",
 s: "Three tricks that answer range queries in O(1), apply a thousand updates in O(n), and find a missing number with no extra memory.",
 goal: [
  "Answer repeated range-sum queries in constant time",
  "Apply many range updates in one pass with a difference array",
  "Use cyclic sort for the 1..n family of missing and duplicate problems"
 ],
 b: [
  { p: "These three share a shape: **do a little preparation so that the operation you repeat becomes trivial.** They also cover a whole family of otherwise-fiddly questions." },

  { h: "Prefix sums: many queries, one pass" },
  { code: { lang: "python", t: "Range sum in O(1)",
    lines: [
     { c: "def build(nums):", w: "" },
     { c: "    p = [0] * (len(nums) + 1)", w: "**Length n+1, with a leading zero.**", hi: true },
     { c: "    for i, x in enumerate(nums):", w: "" },
     { c: "        p[i + 1] = p[i] + x", w: "**p[i] = sum of the first i elements.**" },
     { c: "    return p", w: "" },
     { c: "", w: "" },
     { c: "# sum of nums[l..r] inclusive:", w: "" },
     { c: "total = p[r + 1] - p[l]", w: "**No off-by-one, because of the leading zero.**", hi: true }
    ],
    after: "**The leading zero is the whole trick.** With it, the empty prefix has a value and the formula never needs a special case for `l == 0`. Writing `p` the same length as `nums` is where the off-by-one bugs come from." } },

  { h: "Prefix sums plus a hash map: counting subarrays" },
  { p: "The most-asked version is not a range query at all. **\"How many subarrays sum to k\"** combines prefix sums with the hash map reflex." },

  { code: { lang: "python", t: "Subarray sum equals k",
    lines: [
     { c: "from collections import defaultdict", w: "" },
     { c: "", w: "" },
     { c: "def subarray_sum(nums, k):", w: "" },
     { c: "    seen = defaultdict(int)", w: "" },
     { c: "    seen[0] = 1", w: "**The empty prefix. Forgetting this loses every subarray that starts at index 0.**", hi: true },
     { c: "    running = count = 0", w: "" },
     { c: "    for x in nums:", w: "" },
     { c: "        running += x", w: "" },
     { c: "        count += seen[running - k]", w: "**If a past prefix was `running - k`, the slice since then sums to k.**", hi: true },
     { c: "        seen[running] += 1", w: "**Record after counting** — otherwise a k of 0 counts itself.", hi: true },
     { c: "    return count", w: "**O(n) time and space.**" }
    ],
    after: "Note this handles negative numbers, which is why a sliding window will not work here. **A window needs the sum to grow monotonically as it widens; negatives break that**, and recognising the distinction is exactly what the question is testing." } },

  { trap: "`seen[0] = 1` and the ordering of the two lines inside the loop are both load-bearing. Count first, then record. If you record first, then with `k = 0` every element matches itself and the answer is inflated by n." },

  { h: "Difference arrays: many updates, one pass" },
  { p: "The mirror image of prefix sums. **When you must add a value across many ranges and only read the array at the end**, do not touch every element of every range." },

  { code: { lang: "python", t: "Range updates in O(1) each",
    lines: [
     { c: "def apply(n, updates):", w: "**updates: (l, r, val), all inclusive.**" },
     { c: "    diff = [0] * (n + 1)", w: "**One spare slot so `r+1` is always writable.**", hi: true },
     { c: "    for l, r, val in updates:", w: "" },
     { c: "        diff[l] += val", w: "**Turn the change on at l.**", hi: true },
     { c: "        diff[r + 1] -= val", w: "**Turn it off after r.**", hi: true },
     { c: "", w: "" },
     { c: "    out, running = [], 0", w: "" },
     { c: "    for i in range(n):", w: "" },
     { c: "        running += diff[i]", w: "**A prefix sum reconstructs the array.**" },
     { c: "        out.append(running)", w: "" },
     { c: "    return out", w: "**O(n + u) instead of O(n·u).**" }
    ],
    after: "With a thousand updates over a million elements this is 10⁶ + 10³ operations instead of 10⁹. **The flight-booking and car-pooling questions are exactly this**, and they are near-impossible to pass without it." } },

  { h: "Cyclic sort: the 1..n family" },
  { p: "**When the array holds n numbers drawn from the range 1..n, the value tells you where it belongs.** That turns a whole set of missing/duplicate problems into an O(n) time, O(1) space scan." },

  { code: { lang: "python", t: "Put every value at its own index",
    lines: [
     { c: "def cyclic_sort(nums):", w: "" },
     { c: "    i = 0", w: "" },
     { c: "    while i < len(nums):", w: "**A while loop, not a for** — `i` only advances on a match.", hi: true },
     { c: "        home = nums[i] - 1", w: "**Value v belongs at index v-1.**" },
     { c: "        if nums[i] != nums[home]:", w: "**Compare by VALUE, not by index** — this is what makes duplicates terminate.", hi: true },
     { c: "            nums[i], nums[home] = nums[home], nums[i]", w: "**Swap it home and re-check the new arrival.**" },
     { c: "        else:", w: "" },
     { c: "            i += 1", w: "**Already correct, or a duplicate. Move on.**" },
     { c: "    return nums", w: "**O(n)** — each swap places one element permanently." },
     { c: "", w: "" },
     { c: "# then a single scan answers the question:", w: "" },
     { c: "for i, x in enumerate(nums):", w: "" },
     { c: "    if x != i + 1: return i + 1", w: "**The first wrong slot is the missing number.**", hi: true }
    ],
    after: "The `nums[i] != nums[home]` comparison is subtle and worth understanding. Comparing indices instead would loop forever on a duplicated value, because the swap would keep making no progress." } },

  { tbl: { t: "What cyclic sort solves, all in O(n) time and O(1) space",
    h: ["Problem", "After sorting, look for"],
    rows: [
     ["Missing number (1..n)", "The first index where `nums[i] != i+1`"],
     ["Find all missing numbers", "Every such index"],
     ["Find the duplicate", "The value already sitting at its home slot"],
     ["Find all duplicates", "Every value found at an occupied home"],
     ["First missing **positive**", "The same scan, ignoring values outside 1..n"]
    ] } },

  { n: "*First Missing Positive* is a well-known hard question and it is cyclic sort with one guard: skip any value that is `<= 0` or `> n`, since it cannot have a home. **The answer is always in 1..n+1**, which is why the bounded range works.",
    nt: "The hard problem this quietly solves" },

  { tryit: { t: "Pick the technique, then write it",
    task: "Name the technique before coding.\n\n1. Given an array, answer 10,000 queries of the form \"sum from i to j\"\n2. Given n=10⁶ seats and 10⁴ bookings each adding passengers over a seat range, find the final counts\n3. Given an array of n distinct numbers from 1..n+1, find the missing one\n4. Count subarrays whose sum equals k, where the array contains negatives",
    hint: "1 is prefix sums. 2 is a difference array. 3 is cyclic sort — or XOR, or the sum formula. 4 is prefix sums plus a hash map.",
    sol: { lang: "python", code: "from collections import defaultdict\n\n# 1. PREFIX SUMS -- O(n) build, O(1) per query\ndef build(nums):\n    p = [0] * (len(nums) + 1)\n    for i, x in enumerate(nums):\n        p[i + 1] = p[i] + x\n    return p\n# query(l, r) inclusive -> p[r + 1] - p[l]\n\n# 2. DIFFERENCE ARRAY -- O(n + u), not O(n * u)\ndef final_counts(n, bookings):\n    diff = [0] * (n + 1)\n    for l, r, seats in bookings:\n        diff[l] += seats\n        diff[r + 1] -= seats\n    out, run = [], 0\n    for i in range(n):\n        run += diff[i]\n        out.append(run)\n    return out\n\n# 3. CYCLIC SORT -- O(n) time, O(1) space\ndef missing(nums):\n    i = 0\n    while i < len(nums):\n        home = nums[i] - 1\n        if home < len(nums) and nums[i] != nums[home]:\n            nums[i], nums[home] = nums[home], nums[i]\n        else:\n            i += 1\n    for i, x in enumerate(nums):\n        if x != i + 1:\n            return i + 1\n    return len(nums) + 1\n#    Also valid, and worth offering as an alternative:\n#      sum(range(1, n + 2)) - sum(nums)      -- O(1) space, risks overflow in C++\n#      functools.reduce(xor, nums + list(range(1, n + 2)))  -- no overflow\n\n# 4. PREFIX SUM + HASH MAP -- a window fails on negatives\ndef subarray_sum(nums, k):\n    seen = defaultdict(int)\n    seen[0] = 1\n    run = count = 0\n    for x in nums:\n        run += x\n        count += seen[run - k]\n        seen[run] += 1\n    return count" },
    w: "For 3, offering the XOR solution alongside cyclic sort is worth real credit — **it uses O(1) space with no overflow risk**, and mentioning the overflow trade-off against the sum formula shows you think about the machine and not only the maths." } },

  { vocab: ["Array", "Hash Table", "Sliding Window", "Bit Manipulation", "Space Complexity"] }
 ],
 k: [
  "Build prefix sums with a leading zero and length n+1 — then `p[r+1] - p[l]` never needs a special case.",
  "Subarray-sum-equals-k is prefix sums plus a hash map, seeded with `{0: 1}`; count before you record.",
  "A sliding window needs non-negative values; with negatives, reach for prefix sums instead.",
  "A difference array turns u range updates from O(n·u) into O(n+u): `+val` at l, `-val` at r+1, then prefix sum.",
  "For values in 1..n, cyclic sort places each at index v-1 in O(n) time and O(1) space — compare by value, not index."
 ],
 r: ["Array", "Hash Table", "Sliding Window", "Space Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "p[i + 1] = p[i] + x", w: "prefix sums with the leading zero" },
   { c: "seen[0] = 1; count += seen[running - k]", w: "count subarrays summing to k" },
   { c: "diff[l] += val; diff[r + 1] -= val", w: "difference array — range update in O(1)" },
   { c: "while i < n: home = nums[i] - 1", w: "cyclic sort — while, not for" }
  ]
 }
}

]);
