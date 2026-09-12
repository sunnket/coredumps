/* DSA for Interviews — arrays, hashing, and the linear structures. */
TD.addLessons("dsa", [

{
 t: "The Hash Map Reflex, Two Pointers and Sliding Window",
 m: "arrays",
 lvl: "core",
 s: "Three patterns that cover more interview questions than everything else combined.",
 goal: [
  "Recognise when a hash map turns O(n²) into O(n)",
  "Apply two pointers and know the precondition it needs",
  "Write a sliding window without off-by-one errors"
 ],
 b: [
  { p: "If you learn three patterns, learn these. Between them they cover something like a third of all interview questions, and they are the ones most likely to appear in a first-round screen." },

  { h: "The hash map reflex" },
  { p: "**Whenever you find yourself scanning to check *have I seen this*, that is a hash map.** This one substitution turns more quadratic solutions linear than any other idea." },

  { vs: { t: "Two Sum — the canonical example", lang: "python",
    bad: { c: "def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n\n# O(n^2)", label: "Brute force",
      w: "Correct, and it will not pass. Say it out loud anyway — stating the brute force and its complexity before optimising is worth marks, and skipping straight to the answer sometimes reads as memorisation." },
    good: { c: "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            return [seen[need], i]\n        seen[x] = i\n\n# O(n) time, O(n) space", label: "Hash map",
      w: "One pass. For each element, ask whether its complement has already been seen — an O(1) lookup instead of a scan. **You traded space for time**, and saying that sentence is the point of the exercise." } } },

  { code: { lang: "python", t: "The shapes a hash map takes",
    lines: [
     { c: "from collections import Counter, defaultdict", w: "" },
     { c: "", w: "" },
     { c: "seen = set()", w: "**Membership only.** *Have I encountered this?*" },
     { c: "seen = {}", w: "**Value to index.** *Where did I see it?*" },
     { c: "Counter(arr)", w: "**Frequency.** Anagrams, majority element, top-k.", hi: true },
     { c: "groups = defaultdict(list)", w: "**Group by a key.** No `if key not in d` needed." },
     { c: "", w: "" },
     { c: "# group anagrams -- the key is the insight", w: "" },
     { c: "for w in words:", w: "" },
     { c: "    groups[tuple(sorted(w))].append(w)", w: "**Sorted letters as the key.** Choosing the right key is usually the whole problem.", hi: true }
    ] } },

  { h: "Two pointers" },
  { p: "Two indices moving through the array, usually towards each other. **The precondition is that the array is sorted**, or has some order you can exploit." },

  { code: { lang: "python", t: "Two Sum again, on a sorted array",
    lines: [
     { c: "def two_sum_sorted(nums, target):", w: "" },
     { c: "    lo, hi = 0, len(nums) - 1", w: "**Both ends.**" },
     { c: "", w: "" },
     { c: "    while lo < hi:", w: "**`<`, not `<=`** — an element cannot pair with itself." },
     { c: "        s = nums[lo] + nums[hi]", w: "" },
     { c: "        if s == target:", w: "" },
     { c: "            return [lo, hi]", w: "" },
     { c: "        elif s < target:", w: "" },
     { c: "            lo += 1", w: "**Too small, so move the small end up.** Sortedness is what makes this decision valid.", hi: true },
     { c: "        else:", w: "" },
     { c: "            hi -= 1", w: "**Too big, so move the big end down.**" },
     { c: "", w: "" },
     { c: "# O(n) time, O(1) SPACE -- better than the hash map", w: "**This is the trade to articulate**: unsorted needs O(n) space, sorted needs none.", hi: true }
    ] } },

  { tbl: { t: "Two-pointer variants",
    h: ["Shape", "Used for", "Example"],
    rows: [
     ["**Opposite ends**", "Sorted arrays, palindromes, container problems", "Two Sum II, Valid Palindrome, Container With Most Water"],
     ["**Fast and slow**", "Cycle detection, finding a midpoint", "Linked List Cycle, Middle of Linked List"],
     ["**Same direction**", "Removing duplicates, partitioning in place", "Remove Duplicates, Move Zeroes"],
     ["**Two arrays**", "Merging, intersecting", "Merge Sorted Array"]
    ] } },

  { h: "Sliding window" },
  { p: "A contiguous range that grows and shrinks. **The trigger is *longest* or *shortest* or *count of* something about a contiguous subarray or substring.**" },

  { code: { lang: "python", t: "The template, which almost all of them fit",
    lines: [
     { c: "def longest_unique(s):", w: "**Longest substring with no repeated character.**" },
     { c: "    seen = {}", w: "**What is currently in the window.**" },
     { c: "    left = best = 0", w: "" },
     { c: "", w: "" },
     { c: "    for right, ch in enumerate(s):", w: "**`right` always advances — one pass.**", hi: true },
     { c: "        if ch in seen and seen[ch] >= left:", w: "**`>= left` matters.** A stale entry from before the window must not count." },
     { c: "            left = seen[ch] + 1", w: "**Shrink from the left, past the duplicate.**", hi: true },
     { c: "", w: "" },
     { c: "        seen[ch] = right", w: "" },
     { c: "        best = max(best, right - left + 1)", w: "**`+1` because both ends are inclusive.** This is where the off-by-one lives." },
     { c: "", w: "" },
     { c: "    return best", w: "" },
     { c: "", w: "" },
     { c: "# O(n) -- each index enters and leaves the window once", w: "**The complexity argument to state**: the pointers only move forward, so it is linear despite the nested feel.", hi: true }
    ] } },

  { code: { lang: "python", t: "The shrinking-window variant",
    lines: [
     { c: "def min_subarray_sum(nums, target):", w: "**Shortest subarray summing to at least target.**" },
     { c: "    left = total = 0", w: "" },
     { c: "    best = float('inf')", w: "" },
     { c: "", w: "" },
     { c: "    for right, x in enumerate(nums):", w: "" },
     { c: "        total += x", w: "**Grow.**" },
     { c: "", w: "" },
     { c: "        while total >= target:", w: "**`while`, not `if`.** Shrink as far as the condition allows.", hi: true },
     { c: "            best = min(best, right - left + 1)", w: "" },
     { c: "            total -= nums[left]", w: "" },
     { c: "            left += 1", w: "" },
     { c: "", w: "" },
     { c: "    return best if best < float('inf') else 0", w: "**Handle the no-answer case explicitly.**" }
    ],
    after: "*Longest* usually shrinks with an `if` when a constraint breaks. *Shortest* shrinks with a `while` as long as the condition still holds. Getting that distinction right is most of what makes sliding window problems feel hard." } },

  { h: "Prefix sums" },
  { code: { lang: "python", t: "Range queries in O(1), and the subarray trick",
    lines: [
     { c: "prefix = [0]", w: "**Start with 0.** It makes the arithmetic below work without a special case." },
     { c: "for x in nums:", w: "" },
     { c: "    prefix.append(prefix[-1] + x)", w: "" },
     { c: "", w: "" },
     { c: "# sum of nums[i:j] is prefix[j] - prefix[i]", w: "**O(1) per query after O(n) setup.**", hi: true },
     { c: "", w: "" },
     { c: "# count subarrays summing to k -- prefix + hash map", w: "" },
     { c: "def subarray_sum(nums, k):", w: "" },
     { c: "    counts = {0: 1}", w: "**The 0 handles subarrays starting at index 0.** Omitting it is the classic bug here.", hi: true },
     { c: "    total = result = 0", w: "" },
     { c: "    for x in nums:", w: "" },
     { c: "        total += x", w: "" },
     { c: "        result += counts.get(total - k, 0)", w: "**Have I seen a prefix that makes this range equal k?** Two patterns composed.", hi: true },
     { c: "        counts[total] = counts.get(total, 0) + 1", w: "" },
     { c: "    return result", w: "" }
    ] } },

  { h: "Stacks, queues and heaps, briefly" },
  { tbl: { t: "The trigger for each",
    h: ["Structure", "Trigger phrase", "Cost"],
    rows: [
     ["**Stack**", "*matching brackets*, *next greater element*, *undo*", "push/pop O(1)"],
     ["**Monotonic stack**", "**\"next greater\" or \"previous smaller\"**", "**O(n) total** — each element pushed and popped once"],
     ["**Queue** (`deque`)", "*level by level*, *first in first out*, BFS", "O(1) both ends"],
     ["**Heap** (`heapq`)", "**\"top k\", \"k largest\", \"median\", \"merge k sorted\"**", "push/pop O(log n)"]
    ] } },

  { code: { lang: "python", t: "The two you will actually write",
    lines: [
     { c: "import heapq", w: "" },
     { c: "", w: "" },
     { c: "# top k largest -- a MIN heap of size k", w: "" },
     { c: "def top_k(nums, k):", w: "" },
     { c: "    h = []", w: "" },
     { c: "    for x in nums:", w: "" },
     { c: "        heapq.heappush(h, x)", w: "" },
     { c: "        if len(h) > k:", w: "" },
     { c: "            heapq.heappop(h)", w: "**Evict the smallest.** The heap holds the k largest, and its root is the k-th largest.", hi: true },
     { c: "    return h", w: "**O(n log k)**, better than sorting when k is small." },
     { c: "", w: "" },
     { c: "# monotonic stack -- next greater element", w: "" },
     { c: "def next_greater(nums):", w: "" },
     { c: "    res, stack = [-1] * len(nums), []", w: "**Indices, not values.**" },
     { c: "    for i, x in enumerate(nums):", w: "" },
     { c: "        while stack and nums[stack[-1]] < x:", w: "**Everything smaller has just found its answer.**", hi: true },
     { c: "            res[stack.pop()] = x", w: "" },
     { c: "        stack.append(i)", w: "" },
     { c: "    return res", w: "**O(n)** — each index is pushed once and popped once." }
    ] } },

  { n: "`heapq` is a **min** heap only. For a max heap, push negated values and negate on the way out — `heapq.heappush(h, -x)`. Every Python interviewer has seen this and it is expected; forgetting it is a common stumble.",
    nt: "The Python detail to remember" },

  { tryit: { t: "One of each, from the trigger",
    task: "Solve four problems and, before coding each, write down which pattern it is and why.\n\n1. Longest substring without repeating characters\n2. Container with most water\n3. Group anagrams\n4. Top k frequent elements",
    hint: "1 is a window. 2 is opposite-end pointers. 3 is a hash map with a chosen key. 4 is Counter plus a heap.",
    sol: { lang: "python", code: "from collections import Counter\nimport heapq\n\n# 1. sliding window -- 'longest ... contiguous'\ndef longest_unique(s):\n    seen, left, best = {}, 0, 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        best = max(best, right - left + 1)\n    return best\n\n# 2. two pointers -- maximise over a range, both ends\ndef max_area(h):\n    lo, hi, best = 0, len(h) - 1, 0\n    while lo < hi:\n        best = max(best, min(h[lo], h[hi]) * (hi - lo))\n        if h[lo] < h[hi]: lo += 1      # move the limiting side\n        else:             hi -= 1\n    return best\n\n# 3. hash map -- the insight is the KEY\ndef group_anagrams(words):\n    g = {}\n    for w in words:\n        g.setdefault(''.join(sorted(w)), []).append(w)\n    return list(g.values())\n\n# 4. Counter + heap -- 'top k'\ndef top_k_frequent(nums, k):\n    return [x for x, _ in Counter(nums).most_common(k)]\n    # or, to show the heap explicitly:\n    # return heapq.nlargest(k, Counter(nums), key=Counter(nums).get)" },
    w: "Notice that in all four, naming the pattern came first and the code followed almost mechanically. That is the whole aim of the pattern log — you are not recalling a solution, you are recognising a shape and then writing the template you already know." } },

  { vocab: ["Hash Table", "Two Pointers", "Sliding Window", "Stack", "Queue", "Heap"] }
 ],
 k: [
  "*Have I seen this before?* is always a hash map — the single most reusable substitution there is.",
  "Two pointers need sortedness or some order, and buy O(1) space over a hash map's O(n).",
  "Sliding window: `right` always advances; *longest* shrinks with `if`, *shortest* with `while`.",
  "Prefix sums plus a hash map count subarrays with a given sum — remember `{0: 1}`.",
  "Heaps are for *top k*; `heapq` is min-only, so negate for a max heap."
 ],
 r: ["Hash Table", "Array", "Stack", "Queue", "Heap", "Time Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "if need in seen: return [seen[need], i]", w: "the hash map reflex, in one line" },
   { c: "while lo < hi: ... lo += 1 / hi -= 1", w: "two pointers from opposite ends" },
   { c: "best = max(best, right - left + 1)", w: "window length, inclusive both ends" },
   { c: "heapq.heappush(h, x); if len(h) > k: heapq.heappop(h)", w: "keep the k largest in O(n log k)" },
   { c: "while stack and nums[stack[-1]] < x: res[stack.pop()] = x", w: "monotonic stack — next greater element" }
  ]
 }
}

]);
