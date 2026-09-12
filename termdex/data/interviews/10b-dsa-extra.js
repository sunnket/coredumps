/* Interview bank — DSA & algorithms, second volume.

   The first volume (10-dsa.js) covers the classics a screening round opens
   with. This one covers the patterns that decide an onsite: monotonic stacks,
   the DP recurrences people memorise without understanding, backtracking with
   duplicates, graph shortest paths, and the design questions where the data
   structure *is* the answer.

   Same contract as volume one: `simple` is the whiteboard explanation you
   would give a friend, `answer` is what you would actually say in the room,
   `trap` is the wrong answer that sounds right. */
(function (TD) {
  "use strict";

  TD.addQuestions([
    {
      id: "dsa-longest-substring-no-repeat",
      q: "Find the length of the longest substring without repeating characters.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "microsoft", "amazon", "meta-ai", "adobe", "bytedance", "uber", "flipkart", "salesforce"],
      tags: ["sliding-window", "hash-map", "strings"],
      simple: "Drag a window along the string. Keep pushing the right edge forward. The moment the character you just added is already inside the window, pull the left edge forward until it is not. The window is always valid, so the biggest it ever got is your answer.",
      answer: "## The window that never goes backwards\n\nThe naive version moves `left` forward one step at a time until the duplicate is gone. That is correct, and it is still $O(n)$ amortised — but you can jump straight there by remembering **where** each character was last seen.\n\n```python\ndef length_of_longest(s):\n    last = {}                       # char -> last index seen\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        if ch in last and last[ch] >= left:\n            left = last[ch] + 1     # jump past the previous copy\n        last[ch] = right\n        best = max(best, right - left + 1)\n    return best\n```\n\nTime $O(n)$, space $O(\\min(n, \\Sigma))$ where $\\Sigma$ is the alphabet size.\n\n## The condition that trips people\n\n`last[ch] >= left` is load-bearing. The map holds every character ever seen, including ones that have already fallen out of the window on the left. Without that guard, `abba` drags `left` backwards on the final `a` and you report a window of length 3.\n\n## Walk `abba` out loud\n\n| right | ch | last[ch] | left after | window |\n|---|---|---|---|---|\n| 0 | a | — | 0 | `a` |\n| 1 | b | — | 0 | `ab` |\n| 2 | b | 1 | 2 | `b` |\n| 3 | a | 0 | 2 (**not** 1) | `ba` |\n\nAnswer 2. If you let `left` move back to 1 you get 3, which is wrong.\n\n## If the alphabet is fixed\n\nFor ASCII, swap the dict for a 128-entry array of last-seen indices initialised to $-1$. Same complexity, no hashing, and it is the version you would actually ship in C++.",
      takeaways: [
        "Store the last index, not a boolean — it lets `left` jump instead of crawl.",
        "Guard with `last[ch] >= left`, or a stale entry drags the window backwards.",
        "Space is bounded by the alphabet, not by the string length."
      ],
      followUps: [
        "At most `k` distinct characters. (Same window, but shrink on `len(counts) > k`.)",
        "Longest substring with at most two distinct characters — the same code with `k = 2`.",
        "Return the substring itself, not the length. (Remember the best `left` too.)"
      ],
      trap: "Removing characters from a set as `left` advances, but advancing `left` in one jump. The jump skips the removals, so the set keeps characters that are no longer in the window. Pick one style — crawl with a set, or jump with a last-seen map — and do not mix them."
    },
    {
      id: "dsa-min-window-substring",
      q: "Given strings `s` and `t`, find the smallest window in `s` containing every character of `t`, including duplicates.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "meta-ai", "amazon", "microsoft", "uber", "bytedance", "databricks", "adobe"],
      tags: ["sliding-window", "hash-map", "strings"],
      simple: "Grow the window to the right until it contains everything you need. Then shrink it from the left for as long as it still does — every step you shrink, you might have found a smaller valid window. When it stops being valid, go back to growing. Each character enters once and leaves once.",
      answer: "## Grow, then shrink\n\nThe trick that keeps this $O(n)$ rather than $O(n \\cdot \\Sigma)$ is a single integer, `have`, counting **how many distinct characters are currently satisfied** — so checking validity is one comparison, not a dictionary scan.\n\n```python\nfrom collections import Counter\n\ndef min_window(s, t):\n    if not t or not s:\n        return \"\"\n    need = Counter(t)\n    window = {}\n    required = len(need)          # distinct chars we must satisfy\n    have = 0                      # how many are satisfied right now\n    best = (float(\"inf\"), 0, 0)\n    left = 0\n\n    for right, ch in enumerate(s):\n        window[ch] = window.get(ch, 0) + 1\n        if ch in need and window[ch] == need[ch]:\n            have += 1             # exactly satisfied — count it once\n\n        while have == required:\n            if right - left + 1 < best[0]:\n                best = (right - left + 1, left, right)\n            out = s[left]\n            window[out] -= 1\n            if out in need and window[out] < need[out]:\n                have -= 1         # we just broke it; stop shrinking\n            left += 1\n\n    return \"\" if best[0] == float(\"inf\") else s[best[1]:best[2] + 1]\n```\n\nTime $O(|s| + |t|)$ — each index is added once and removed once. Space $O(|s| + |t|)$, or $O(\\Sigma)$ with arrays.\n\n## Why `==` and not `>=`\n\n`window[ch] == need[ch]` fires exactly once per character as it becomes satisfied. Using `>=` increments `have` on every extra copy, `have` runs past `required`, and the shrink loop never terminates correctly. The mirrored condition on the way out is `<`, for the same reason.\n\n## The amortised argument, said out loud\n\nInterviewers ask \"isn't the inner `while` making this quadratic?\" It is not: `left` only ever moves forward, across the whole run, so the total work of the inner loop is bounded by $n$. Say that explicitly — it is the point of the question.",
      takeaways: [
        "One `have` counter turns the validity check into a single comparison.",
        "Increment on exact equality, decrement on strict deficit — `>=` breaks the invariant.",
        "The nested loop is still linear because `left` never moves backwards."
      ],
      followUps: [
        "Return all minimum-length windows, not just one.",
        "Substring with the characters of `t` in order (not contiguous) — a different, easier problem.",
        "`t` has 10⁶ distinct characters — swap the dicts for arrays and discuss cache behaviour."
      ],
      trap: "Comparing the two counters with `window >= need` inside the loop. It is a clean-looking line and it makes the whole thing $O(n \\cdot \\Sigma)$ — which on a 26-letter alphabet passes every test and is still the wrong complexity to claim."
    },
    {
      id: "dsa-longest-palindromic-substring",
      q: "Find the longest palindromic substring. Then: how would you do it in linear time?",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "microsoft", "google", "adobe", "bytedance", "flipkart", "salesforce", "oracle"],
      tags: ["strings", "two-pointer", "dp"],
      simple: "A palindrome reads the same both ways, so it has a centre. Stand on each possible centre and walk outwards while the characters match. There are only about 2n centres — every letter, and every gap between two letters — so this is fast and needs no extra memory.",
      answer: "## Expand around every centre\n\n```python\ndef longest_palindrome(s):\n    if not s:\n        return \"\"\n    start, end = 0, 0\n\n    def expand(l, r):\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1\n            r += 1\n        return l + 1, r - 1          # last valid pair\n\n    for i in range(len(s)):\n        l1, r1 = expand(i, i)        # odd length, centre on a character\n        if r1 - l1 > end - start:\n            start, end = l1, r1\n        l2, r2 = expand(i, i + 1)    # even length, centre in a gap\n        if r2 - l2 > end - start:\n            start, end = l2, r2\n\n    return s[start:end + 1]\n```\n\nTime $O(n^2)$ worst case (`aaaa...`), space $O(1)$.\n\n## Why the two calls\n\n`aba` has its centre on `b`; `abba` has its centre between the two `b`s. Handling only odd centres silently misses every even-length palindrome — and `aa` is the test case that catches it.\n\n## The DP version, and why it is worse\n\n`dp[i][j] = s[i] == s[j] and dp[i+1][j-1]` is the answer people write first. It is the same $O(n^2)$ time but $O(n^2)$ space, and it must be filled in order of increasing length rather than by row. Mention it, then say you prefer expansion because it is constant space.\n\n## Linear time\n\nManacher's algorithm gets to $O(n)$ by reusing the palindrome radii already computed on the left of the current centre — a mirrored index gives you a lower bound on the radius for free, so most expansions start already partly done. Almost nobody is expected to write it from memory. Knowing that it exists, that it is $O(n)$, and that it works by mirroring radii inside the current rightmost palindrome is the answer the question is really testing.",
      takeaways: [
        "Two centre types — on a character and between two — or every even palindrome is missed.",
        "Expansion is $O(n^2)$ time but $O(1)$ space; the DP table is strictly worse.",
        "Manacher's is $O(n)$ by reusing mirrored radii. Know that it exists, and why it works."
      ],
      followUps: [
        "Count all palindromic substrings. (Same expansion; add the count per step.)",
        "Longest palindromic subsequence — a genuinely different DP, $O(n^2)$.",
        "Shortest palindrome by prepending characters. (KMP failure function on `s + '#' + reversed(s)`.)"
      ],
      trap: "Reversing the string and taking the longest common substring. It looks elegant and it is wrong: for `abacdfgdcaba` the longest common substring with the reverse is `abacd`... which is not a palindrome. You need the extra check that the indices actually correspond."
    },
    {
      id: "dsa-min-stack",
      q: "Design a stack supporting push, pop, top and getMin, all in $O(1)$.",
      topic: "DSA",
      level: "easy",
      companies: ["amazon", "google", "microsoft", "adobe", "flipkart", "tcs", "oracle", "salesforce", "uber"],
      tags: ["stack", "design"],
      simple: "You cannot scan the stack for the minimum, because that is linear. Instead, every time you push a value, also write down what the minimum was at that moment. Then the minimum for the current state is always sitting right on top, and popping restores the previous one automatically.",
      answer: "## Store the minimum alongside each entry\n\n```python\nclass MinStack:\n    def __init__(self):\n        self.stack = []              # (value, min at or below this point)\n\n    def push(self, x):\n        cur_min = x if not self.stack else min(x, self.stack[-1][1])\n        self.stack.append((x, cur_min))\n\n    def pop(self):\n        return self.stack.pop()[0]\n\n    def top(self):\n        return self.stack[-1][0]\n\n    def get_min(self):\n        return self.stack[-1][1]\n```\n\nEvery operation is $O(1)$. Space is $O(n)$ — two words per element rather than one.\n\n## The follow-up they are heading for\n\n\"Can you use less space?\" Yes: keep a **second stack of minima**, and only push onto it when the new value is less than *or equal to* the current minimum.\n\n```python\nclass MinStack:\n    def __init__(self):\n        self.stack, self.mins = [], []\n\n    def push(self, x):\n        self.stack.append(x)\n        if not self.mins or x <= self.mins[-1]:\n            self.mins.append(x)      # note: <=, not <\n\n    def pop(self):\n        x = self.stack.pop()\n        if x == self.mins[-1]:\n            self.mins.pop()\n        return x\n```\n\n`<=` is the whole question. With strict `<`, pushing `[2, 2]` records the minimum once; the first pop of a `2` removes it from `mins`, and `get_min` now reports a minimum that is no longer in the stack. Duplicates are the test case.\n\n## The clever version worth mentioning\n\nStoring `2 * x - min` encodings gets you to $O(1)$ extra space entirely. It is a real technique, it overflows on adversarial inputs, and no reviewer wants to read it. Offer it as a curiosity, not as your answer.",
      takeaways: [
        "Pairing each element with the minimum below it makes getMin a top-of-stack read.",
        "In the two-stack variant, push on `<=` — strict `<` breaks on duplicate minima.",
        "Constant-extra-space encodings exist, overflow, and are not worth shipping."
      ],
      followUps: [
        "getMax as well as getMin — same idea, one more field.",
        "A queue with $O(1)$ min. (Monotonic deque, or two stacks with amortised transfer.)",
        "Make it thread-safe without locking the whole structure."
      ],
      trap: "Keeping a single `min` variable and recomputing it by scanning after a pop. It gives $O(1)$ push and $O(n)$ pop, which fails the stated requirement — and it usually passes the interviewer's first three test cases."
    },
    {
      id: "dsa-daily-temperatures-monotonic",
      q: "For each day, how many days until a warmer temperature? Return 0 if there is none.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "meta-ai", "microsoft", "bytedance", "uber", "adobe", "salesforce"],
      tags: ["stack", "monotonic-stack", "arrays"],
      simple: "Walk through the days keeping a pile of days that are still waiting for something warmer. The pile is always coldest-on-top... no — warmest at the bottom, and getting colder as you go up. When today is warmer than the day on top of the pile, that day's wait is over: pop it, record the gap, and check the next one. Each day is pushed once and popped once.",
      answer: "## The monotonic stack\n\nKeep a stack of **indices** whose answers are still unknown. The temperatures at those indices are non-increasing from bottom to top — which is exactly why one warm day can resolve several of them at once.\n\n```python\ndef daily_temperatures(temps):\n    out = [0] * len(temps)\n    stack = []                          # indices, temps non-increasing\n    for i, t in enumerate(temps):\n        while stack and temps[stack[-1]] < t:\n            j = stack.pop()\n            out[j] = i - j              # distance, not the temperature\n        stack.append(i)\n    return out                          # anything left keeps its 0\n```\n\nTime $O(n)$ — each index is pushed exactly once and popped at most once, so the inner `while` is amortised constant. Space $O(n)$.\n\n## Indices, not values\n\nThe answer is a *distance*, so the stack must hold indices. Storing temperatures forces a second lookup structure and is where this goes wrong in an interview.\n\n## The pattern this belongs to\n\nThis is the \"next greater element\" template, and once you see it you see it everywhere:\n\n- **Next greater to the right** — iterate left to right, pop on `<`.\n- **Next smaller to the right** — same, pop on `>`.\n- **Previous greater** — iterate right to left, or read the stack top *before* pushing.\n- **Circular array** — iterate `2n` times with `i % n`, pushing only on the first pass.\n\nSaying \"this is next-greater-element with a distance instead of a value\" is worth more than the code.",
      takeaways: [
        "A monotonic stack answers next-greater/next-smaller in one pass.",
        "Push indices when the answer is a distance; values only when it is a value.",
        "Amortised $O(n)$: each index enters and leaves the stack at most once."
      ],
      followUps: [
        "Next greater element in a circular array. (Two passes with `i % n`.)",
        "Stock span — the mirrored problem, previous greater element.",
        "Sum of subarray minimums. (Previous-smaller and next-smaller give each element's span.)"
      ],
      trap: "Writing the inner loop as `if` instead of `while`. It resolves only the topmost waiting day, silently leaves the rest with 0, and passes any test where temperatures are already increasing."
    },
    {
      id: "dsa-largest-rectangle-histogram",
      q: "Find the largest rectangle that fits inside a histogram of bar heights.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "microsoft", "bytedance", "databricks", "uber", "oracle"],
      tags: ["stack", "monotonic-stack", "arrays"],
      simple: "Every rectangle is limited by its shortest bar. So for each bar, ask: if this bar is the short one, how far left and right can I stretch before hitting something shorter? Multiply that width by the height. A stack that only ever holds increasing heights answers both directions in one pass.",
      answer: "## Each bar as the limiting height\n\nFor bar `i` with height `h`, the widest rectangle of height `h` runs from just after the previous strictly-shorter bar to just before the next strictly-shorter bar. A monotonic increasing stack gives you both boundaries at the moment you pop.\n\n```python\ndef largest_rectangle(heights):\n    stack = []                    # indices, heights strictly increasing\n    best = 0\n    for i, h in enumerate(heights + [0]):     # sentinel flushes the stack\n        while stack and heights[stack[-1]] >= h:\n            height = heights[stack.pop()]\n            # left boundary is whatever is now on top, or -1\n            left = stack[-1] if stack else -1\n            width = i - left - 1\n            best = max(best, height * width)\n        stack.append(i)\n    return best\n```\n\nTime $O(n)$, space $O(n)$.\n\n## The width formula is the whole problem\n\nWhen you pop index `j`, `i` is the first bar to its right that is shorter, and the new stack top is the last bar to its left that is shorter. So the rectangle spans the open interval between them: `width = i - stack[-1] - 1`, and `i - 0 - 1 = i` when the stack empties. Writing `i - j` instead is the classic error — it silently ignores everything the popped bar could have extended over on its left.\n\n## The sentinel\n\nAppending a zero-height bar guarantees every real bar is eventually popped. Without it, a strictly increasing histogram like `[1,2,3,4]` leaves the whole stack unprocessed and returns 0.\n\n## Where this shows up again\n\nMaximal rectangle in a binary matrix is this function called once per row, with `heights[c]` accumulating consecutive 1s in column `c` and resetting to 0 on a `0`. That reduction — $O(rows \\times cols)$ overall — is usually the real question.",
      takeaways: [
        "Each bar is the height of exactly one candidate rectangle: the widest one it limits.",
        "`width = i - stack[-1] - 1`, using the new top after popping — not `i - j`.",
        "A trailing sentinel of height 0 removes the whole drain-the-stack epilogue."
      ],
      followUps: [
        "Maximal rectangle of 1s in a binary matrix — run this per row over accumulated heights.",
        "Largest square rather than rectangle. (A simpler $O(nm)$ DP.)",
        "Maximum area under a histogram with each bar's width given separately."
      ],
      trap: "Computing the width as `i - j` where `j` is the popped index. It is right only when the popped bar happens to be the first in the stack, so it passes on short inputs and understates the answer on anything with a valley."
    },
    {
      id: "dsa-trapping-rain-water",
      q: "Given an elevation map, compute how much rainwater it traps.",
      topic: "DSA",
      level: "hard",
      companies: ["amazon", "google", "meta-ai", "microsoft", "adobe", "bytedance", "uber", "flipkart", "apple"],
      tags: ["two-pointer", "arrays", "stack"],
      simple: "Water sitting above any single column is decided by the tallest wall to its left and the tallest wall to its right — whichever of those two is shorter, minus the column's own height. Do that for every column and add it up. The trick is getting both of those maxima without scanning the array twice for each column.",
      answer: "## The formula first\n\nFor index `i`:\n\n$$\\text{water}_i = \\max(0,\\; \\min(\\text{maxLeft}_i, \\text{maxRight}_i) - h_i)$$\n\nEverything else is just how you obtain those two maxima cheaply.\n\n## Two arrays — $O(n)$ time, $O(n)$ space\n\nPrefix maxima left to right, suffix maxima right to left, then one pass to sum. Write this first if you are unsure; it is obviously correct and easy to explain.\n\n## Two pointers — $O(n)$ time, $O(1)$ space\n\n```python\ndef trap(height):\n    if not height:\n        return 0\n    lo, hi = 0, len(height) - 1\n    left_max = right_max = 0\n    total = 0\n    while lo < hi:\n        if height[lo] < height[hi]:\n            # the right side is guaranteed taller, so left_max decides\n            left_max = max(left_max, height[lo])\n            total += left_max - height[lo]\n            lo += 1\n        else:\n            right_max = max(right_max, height[hi])\n            total += right_max - height[hi]\n            hi -= 1\n    return total\n```\n\n## Why moving the shorter side is safe\n\nThis is the part to say out loud. If `height[lo] < height[hi]`, then there exists *some* wall on the right at least as tall as `height[hi]`, which is taller than `height[lo]`. So `min(maxLeft, maxRight)` at index `lo` is `maxLeft` — you do not need to know the true right maximum, only that it cannot be the binding constraint. That is what makes the constant-space version correct rather than merely plausible.\n\n## The stack version\n\nA monotonic decreasing stack computes water in horizontal layers instead of vertical columns: when a bar taller than the stack top arrives, you pop and fill the trough between the new bar and the bar beneath it. Same $O(n)$, more code. It is worth knowing because it generalises to the 2D version, which uses a min-heap on the border instead.",
      takeaways: [
        "Water at `i` is `min(maxLeft, maxRight) - h[i]`, floored at zero. Everything else is bookkeeping.",
        "Moving the shorter pointer is safe because the other side is already known to be taller.",
        "Trapping in 2D is the same idea with a min-heap seeded from the border."
      ],
      followUps: [
        "Trapping rain water in a 2D grid. (Min-heap from the boundary inwards.)",
        "Container with most water — related, but the answer is a single pair, not a sum.",
        "The array arrives as a stream and you must answer after each element."
      ],
      trap: "Taking `max(maxLeft, maxRight)` instead of the minimum. Water is held in by the *shorter* of the two walls; the maximum version produces a larger, confidently wrong number that still looks like water."
    },
    {
      id: "dsa-basic-calculator",
      q: "Evaluate a string expression with `+`, `-`, `*`, `/`, and parentheses.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "meta-ai", "amazon", "microsoft", "bytedance", "uber", "databricks", "palantir"],
      tags: ["stack", "parsing", "strings"],
      simple: "Read left to right. Keep the number you are building and the sign or operator that came just before it. Additions and subtractions get pushed onto a stack to be summed at the end; multiplications and divisions are applied immediately to whatever is on top of the stack, because they bind tighter. A `(` means start a fresh sub-problem, and `)` means finish it and hand the total back.",
      answer: "## One stack, one deferred operator\n\nThe insight that removes all the complexity: push **signed terms** onto a stack and sum it at the very end. Precedence is handled by applying `*` and `/` immediately to the stack top, while `+` and `-` merely push.\n\n```python\ndef calculate(s):\n    def helper(it):\n        stack = []\n        num = 0\n        op = \"+\"                       # operator waiting to be applied\n        while True:\n            ch = next(it, \")\")         # a virtual close bracket ends the input\n            if ch == \" \":\n                continue\n            if ch.isdigit():\n                num = num * 10 + int(ch)\n                continue\n            if ch == \"(\":\n                num = helper(it)       # recurse; returns the bracket's value\n                continue\n\n            # ch is an operator or ')': flush the pending one\n            if op == \"+\":\n                stack.append(num)\n            elif op == \"-\":\n                stack.append(-num)\n            elif op == \"*\":\n                stack.append(stack.pop() * num)\n            elif op == \"/\":\n                stack.append(int(stack.pop() / num))   # truncate toward zero\n            num, op = 0, ch\n            if ch == \")\":\n                return sum(stack)\n    return helper(iter(s))\n```\n\nTime $O(n)$, space $O(n)$ for the stack plus $O(d)$ recursion for nesting depth `d`.\n\n## Two details that decide the outcome\n\n**Flush on the operator, not on the digit.** You apply the *previous* operator when you meet the *next* one, because only then is the right operand complete. Candidates who try to apply an operator as they read it end up with a half-parsed number.\n\n**Integer division truncates toward zero, not toward negative infinity.** Python's `//` floors: `-7 // 2 == -4`, while most languages and most interview specs want `-3`. `int(a / b)` gives the truncating behaviour. This is the single most common wrong answer here.\n\n## If you cannot use recursion\n\nPush the running total and the sign onto an explicit stack at each `(`, reset, and restore on `)`. It is the same algorithm; recursion just hides the bookkeeping.",
      takeaways: [
        "Push signed terms, sum at the end — precedence becomes two special cases, not a parser.",
        "Apply the pending operator when the next one arrives, not when you read it.",
        "`//` floors and `int(a/b)` truncates. Negative operands expose the difference."
      ],
      followUps: [
        "Add unary minus and `**`. (Precedence climbing, or the shunting-yard algorithm.)",
        "Add variables and assignment — now you need a symbol table and a real grammar.",
        "Return an AST instead of a value, so the expression can be re-evaluated cheaply."
      ],
      trap: "Building a full tokenizer and recursive-descent parser. It is not wrong, but it is twenty minutes of code for a problem the stack solves in fifteen lines — and you will run out of time before you handle division."
    },
    {
      id: "dsa-edit-distance",
      q: "Compute the minimum number of insertions, deletions and substitutions to turn one string into another.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "microsoft", "meta-ai", "adobe", "openai", "bytedance", "oracle"],
      tags: ["dp", "strings"],
      simple: "Line the two words up and compare the last letters. If they match, that pair is free — solve the shorter problem. If they do not, you have three moves available: change the letter, delete it, or insert one. Try all three, take the cheapest, and remember every sub-answer so you never solve the same pair twice.",
      answer: "## The recurrence\n\nLet `dp[i][j]` be the distance between the first `i` characters of `a` and the first `j` of `b`.\n\n| When | `dp[i][j]` is | Which edit that is |\n|---|---|---|\n| `i == 0` | `j` | insert all `j` characters of `b` |\n| `j == 0` | `i` | delete all `i` characters of `a` |\n| `a[i-1] == b[j-1]` | `dp[i-1][j-1]` | the pair matches, so it costs nothing |\n| otherwise | `1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])` | substitute, delete, insert |\n\nThe three terms are, in order: **substitute**, **delete from `a`**, **insert into `a`**. Naming which is which is what the interviewer is listening for.\n\n```python\ndef edit_distance(a, b):\n    m, n = len(a), len(b)\n    prev = list(range(n + 1))            # dp[0][j] = j\n    for i in range(1, m + 1):\n        cur = [i] + [0] * n              # dp[i][0] = i\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                cur[j] = prev[j - 1]\n            else:\n                cur[j] = 1 + min(prev[j - 1],   # substitute\n                                 prev[j],       # delete a[i-1]\n                                 cur[j - 1])    # insert b[j-1]\n        prev = cur\n    return prev[n]\n```\n\nTime $O(mn)$, space $O(\\min(m, n))$ with the rolling row.\n\n## The base cases carry real meaning\n\n`dp[i][0] = i` is \"delete every character of the prefix\", and `dp[0][j] = j` is \"insert every character\". Initialising them to zero is the most common bug in the problem and it produces answers that are too small by exactly the length difference.\n\n## Reconstructing the edits\n\nIf you need the actual operations rather than the count, you cannot use the rolling row — keep the full table and walk backwards from `dp[m][n]`, choosing at each step whichever predecessor produced the value. That is $O(mn)$ space, and it is worth stating the trade-off explicitly rather than silently keeping the whole table.\n\n## Variants that share the skeleton\n\nLongest common subsequence is the same table with `max` and no substitution. Levenshtein with different costs per operation just replaces the `1 +`. Damerau-Levenshtein adds a fourth case for transposition, reaching back to `dp[i-2][j-2]`.",
      takeaways: [
        "Three transitions: substitute, delete, insert — and you should be able to name each one.",
        "Base cases are prefix lengths, not zeros.",
        "Rolling one row gives $O(\\min(m,n))$ space, but forfeits edit reconstruction."
      ],
      followUps: [
        "Return the actual edit script. (Keep the full table, then backtrack.)",
        "One-edit-distance check in $O(n)$ time and $O(1)$ space — no DP needed.",
        "Weighted operations, where a substitution costs more than an insertion."
      ],
      trap: "Reusing a single 1D array without keeping the old diagonal value. `cur[j-1]` has already been overwritten for this row, so the substitution term silently reads the wrong cell. Either keep two rows, or stash `prev[j-1]` in a temporary before overwriting."
    },
    {
      id: "dsa-coin-change",
      q: "Given coin denominations and an amount, find the fewest coins that make it. Then: count the number of distinct ways instead.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "adobe", "flipkart", "uber", "salesforce", "bytedance"],
      tags: ["dp", "knapsack", "greedy"],
      simple: "To make 11, you must have used some coin last. If it was a 5, then you needed the best way to make 6 before it. So try every coin as the last one, take whichever leaves the cheapest remainder, and add one. Build that up from 0 to the target and each answer is ready when you need it.",
      answer: "## Fewest coins — unbounded knapsack\n\n```python\ndef coin_change(coins, amount):\n    INF = amount + 1\n    dp = [0] + [INF] * amount            # dp[x] = fewest coins for x\n    for x in range(1, amount + 1):\n        for c in coins:\n            if c <= x:\n                dp[x] = min(dp[x], dp[x - c] + 1)\n    return -1 if dp[amount] == INF else dp[amount]\n```\n\nTime $O(\\text{amount} \\times |coins|)$, space $O(\\text{amount})$. Note this is **pseudo-polynomial**: it is linear in the numeric value of the amount, not in its bit length. Say that — it is the difference between a candidate who has memorised the code and one who understands it.\n\n## Counting ways — and the loop order that decides it\n\n```python\ndef change(coins, amount):\n    dp = [1] + [0] * amount              # one way to make 0: take nothing\n    for c in coins:                      # coins OUTSIDE\n        for x in range(c, amount + 1):   # amount INSIDE\n            dp[x] += dp[x - c]\n    return dp[amount]\n```\n\nSwap those two loops and you count **permutations** instead of **combinations**: `[1,2]` and `[2,1]` become two different ways to make 3. Coins outside counts each multiset once, because a coin is only ever considered after all smaller-indexed coins are finished. This is the single most asked follow-up in the problem, and the loop order *is* the answer.\n\n## Why greedy fails\n\nTaking the largest coin that fits is correct for canonical systems like `[1, 5, 10, 25]`, and wrong in general. For `coins = [1, 3, 4]`, `amount = 6`: greedy takes 4 then 1 then 1 for three coins, while the optimum is 3 + 3, two coins. If asked whether greedy works, the correct answer is \"only for canonical systems, and verifying canonicity is itself non-trivial\".",
      takeaways: [
        "Fewest coins is unbounded knapsack: iterate the amount forwards and allow reuse.",
        "For counting, coin loop outside gives combinations; amount outside gives permutations.",
        "Greedy is wrong for general denominations — `[1,3,4]` making 6 is the counterexample."
      ],
      followUps: [
        "Each coin may be used at most once — 0/1 knapsack, so iterate the amount downwards.",
        "Return the actual coin multiset, not just the count.",
        "Amount is 10⁹ but there are only 3 coin types. (Number theory, not DP.)"
      ],
      trap: "Initialising `dp` with `float('inf')` and then writing `dp[x-c] + 1` without guarding. In languages with fixed-width integers that overflows to a negative number and the `min` happily accepts it. `amount + 1` as the sentinel is both safe and still recognisably \"impossible\"."
    },
    {
      id: "dsa-knapsack-01",
      q: "0/1 knapsack: maximise value under a weight capacity, each item usable once. Then reduce it to $O(W)$ space.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "flipkart", "adobe", "oracle", "tcs", "salesforce"],
      tags: ["dp", "knapsack"],
      simple: "For each item you have exactly one decision: take it or leave it. If you take it, you spend its weight and gain its value, then solve the smaller problem with the remaining capacity. If you leave it, capacity is untouched. Take the better of the two, for every item and every capacity.",
      answer: "## The 2D form\n\n`dp[i][w]` is the best value using the first `i` items within capacity `w`.\n\n```python\ndef knapsack(weights, values, W):\n    n = len(weights)\n    dp = [[0] * (W + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        wi, vi = weights[i - 1], values[i - 1]\n        for w in range(W + 1):\n            dp[i][w] = dp[i - 1][w]                       # skip item i\n            if wi <= w:\n                dp[i][w] = max(dp[i][w], dp[i - 1][w - wi] + vi)   # take it\n    return dp[n][W]\n```\n\n$O(nW)$ time, $O(nW)$ space.\n\n## The 1D form, and why the loop runs backwards\n\n```python\ndef knapsack(weights, values, W):\n    dp = [0] * (W + 1)\n    for wi, vi in zip(weights, values):\n        for w in range(W, wi - 1, -1):        # DESCENDING\n            dp[w] = max(dp[w], dp[w - wi] + vi)\n    return dp[W]\n```\n\nDescending order is the entire difference between 0/1 and unbounded knapsack. `dp[w - wi]` must still hold the value from the *previous* item's row — the state before this item existed. Iterating upwards overwrites it first, so `dp[w - wi]` already includes item `i`, and you silently allow the item to be taken repeatedly. Ascending order is the *correct* code for the unbounded version. One loop direction, two different problems.\n\n## Complexity, honestly stated\n\n$O(nW)$ is pseudo-polynomial: `W` is a numeric value, so the runtime is exponential in the input's bit length. 0/1 knapsack is NP-hard, and this table does not contradict that. If `W` is 10⁹ but values are small, flip the table: index by value and store the minimum weight that achieves it, giving $O(n \\sum v)$.",
      takeaways: [
        "One binary decision per item; the recurrence is `max(skip, take)`.",
        "1D descending = 0/1, 1D ascending = unbounded. The direction is the semantics.",
        "$O(nW)$ is pseudo-polynomial, so the problem stays NP-hard."
      ],
      followUps: [
        "Bounded knapsack — at most `k` copies of each item. (Binary splitting into powers of two.)",
        "Subset sum and equal-partition are the same table with boolean values.",
        "Capacity is huge but values are small — swap the roles of weight and value."
      ],
      trap: "Writing the 1D loop ascending because it reads more naturally. It compiles, it runs, it returns a plausible larger number — and it has quietly solved a different problem in which every item is infinitely available."
    },
    {
      id: "dsa-word-break",
      q: "Given a string and a dictionary, can the string be segmented into dictionary words? Then: return every possible segmentation.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "meta-ai", "microsoft", "bytedance", "uber", "adobe", "openai"],
      tags: ["dp", "strings", "trie", "memoisation"],
      simple: "Ask: can I break the string at position i? Yes, if there is some earlier position j where the prefix was already breakable and the chunk between j and i is a word in the dictionary. Start from the empty prefix, which is always breakable, and work forwards.",
      answer: "## The DP\n\n```python\ndef word_break(s, word_dict):\n    words = set(word_dict)\n    max_len = max(map(len, words), default=0)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True                              # the empty prefix is breakable\n    for i in range(1, n + 1):\n        # only look back as far as the longest word — the bound matters\n        for j in range(max(0, i - max_len), i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n    return dp[n]\n```\n\nWithout the `max_len` bound this is $O(n^2)$ substring checks, each costing $O(n)$ to hash — so $O(n^3)$. With it, $O(n \\cdot L)$ where `L` is the longest dictionary word, which for real dictionaries is a large constant.\n\n## Returning all segmentations\n\nThe answer count can be exponential (`\"aaaa...\"` with `{a, aa}`), so no polynomial algorithm exists — but memoised recursion keyed on the start index avoids re-deriving the same suffix repeatedly.\n\n```python\nfrom functools import lru_cache\n\ndef word_break_all(s, word_dict):\n    words = set(word_dict)\n\n    @lru_cache(None)\n    def solve(start):\n        if start == len(s):\n            return [[]]\n        out = []\n        for end in range(start + 1, len(s) + 1):\n            head = s[start:end]\n            if head in words:\n                for rest in solve(end):\n                    out.append([head] + rest)\n        return out\n\n    return [\" \".join(p) for p in solve(0)]\n```\n\n**Run the boolean DP first as a feasibility check.** On `\"aaaa…aab\"` with `{a, aa}` the enumeration explores an exponential tree and finds nothing; one $O(nL)$ pass rules it out immediately. That pruning is the answer to \"why is your solution timing out?\"\n\n## When the dictionary is large\n\nSwap the set for a **trie** and walk it forward from each position. You then extend one character at a time and stop the moment no word shares the prefix — no substring allocation, and the inner loop terminates early instead of running to `max_len`.",
      takeaways: [
        "`dp[0] = True` is the empty-prefix base case; without it nothing is ever reachable.",
        "Bound the look-back by the longest dictionary word, or you pay an extra factor of `n`.",
        "Enumerating all segmentations is exponential by nature — gate it with the boolean DP."
      ],
      followUps: [
        "Return the segmentation with the fewest words. (Same DP, storing counts.)",
        "The dictionary has 10⁶ entries — trie, or Aho–Corasick for all matches in one pass.",
        "Concatenated words: find every word in the list formed by other words in the list."
      ],
      trap: "Greedily taking the longest matching word at each step. For `s = \"aaab\"` with `{aa, aaa, b}` greedy takes `aaa` then fails on `b`, and reports impossible — even though `aa` + `a`... would also fail, but change the dictionary slightly and greedy misses genuine solutions. Segmentation requires backtracking or DP; it is not a greedy problem."
    },
    {
      id: "dsa-house-robber-variants",
      q: "You cannot rob two adjacent houses. Maximise the total. Then: what if the houses are in a circle? What if they form a tree?",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "adobe", "flipkart", "bytedance", "salesforce", "uber"],
      tags: ["dp", "trees", "arrays"],
      simple: "Standing at each house you have two choices: rob it, which means you must have skipped the one before, or skip it, which means you keep whatever you had. Carry those two running totals forward and the last one is the answer. You never need more than the previous two numbers.",
      answer: "## Linear street\n\n```python\ndef rob(nums):\n    take, skip = 0, 0            # best if we rob this house / if we do not\n    for x in nums:\n        take, skip = skip + x, max(skip, take)\n    return max(take, skip)\n```\n\n$O(n)$ time, $O(1)$ space. The simultaneous assignment matters: `take` must be computed from the *old* `skip`.\n\n## Circular street\n\nThe first and last houses are now adjacent, so they cannot both be robbed. That gives two independent linear problems:\n\n```python\ndef rob_circle(nums):\n    if len(nums) == 1:\n        return nums[0]\n    return max(rob(nums[:-1]),    # allow the first, exclude the last\n               rob(nums[1:]))     # exclude the first, allow the last\n```\n\nBoth ranges are considered, and every valid selection lives in at least one of them — including the case where you rob neither end. The single-house guard is necessary because both slices would otherwise be empty.\n\n## Binary tree\n\nSame decision, expressed as a post-order traversal returning a pair:\n\n```python\ndef rob_tree(root):\n    def solve(node):\n        if not node:\n            return (0, 0)                     # (rob this, skip this)\n        l_rob, l_skip = solve(node.left)\n        r_rob, r_skip = solve(node.right)\n        rob_here = node.val + l_skip + r_skip  # children must be skipped\n        skip_here = max(l_rob, l_skip) + max(r_rob, r_skip)\n        return (rob_here, skip_here)\n    return max(solve(root))\n```\n\n$O(n)$ time, $O(h)$ stack. Returning a tuple rather than a single number is the whole trick — a child cannot know whether its parent was robbed, so it reports both worlds and lets the parent choose.\n\n## The shape to recognise\n\nAll three are the same shape: a state machine with two states per node, transitions that forbid two adjacent \"take\"s. Delete-and-earn and maximum-independent-set on a path are the same problem in different clothes.",
      takeaways: [
        "Two rolling values, `take` and `skip`, are enough — no array is needed.",
        "The circle splits into two linear runs; do not try to patch the wrap-around in one pass.",
        "On a tree, each node returns both outcomes so the parent can pick."
      ],
      followUps: [
        "Delete-and-earn: choosing `k` deletes all `k-1` and `k+1`. (Bucket by value, then rob.)",
        "Maximum weight independent set on a general graph. (NP-hard — say so.)",
        "Houses in a grid where adjacency is 4-directional. (Also NP-hard; this is the tell.)"
      ],
      trap: "For the circular version, running the linear DP once and then subtracting the smaller of the two ends if both were chosen. It is not a valid repair: removing one end can make a completely different selection optimal, not just the same one minus a house."
    },
    {
      id: "dsa-subsets-permutations-dupes",
      q: "Generate all subsets of an array. Then all permutations. Then handle duplicate elements in both.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "meta-ai", "adobe", "flipkart", "uber", "bytedance"],
      tags: ["backtracking", "recursion", "arrays"],
      simple: "For subsets, walk the array and at each element decide to include it or not — that is a binary tree of depth n. For permutations, at each position pick any unused element. Duplicates are the only hard part: if you have two identical items, swapping them produces the same answer twice, so you sort first and refuse to start a second identical branch at the same depth.",
      answer: "## Subsets\n\n```python\ndef subsets(nums):\n    out, path = [], []\n    def backtrack(start):\n        out.append(path[:])                # every node is an answer\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1)               # i + 1: never reuse an index\n            path.pop()\n    backtrack(0)\n    return out\n```\n\n$O(n \\cdot 2^n)$ — there are $2^n$ subsets and copying each costs $O(n)$. That output size is the lower bound; you cannot beat it.\n\n## Permutations\n\n```python\ndef permutations(nums):\n    out = []\n    used = [False] * len(nums)\n    path = []\n    def backtrack():\n        if len(path) == len(nums):\n            out.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            backtrack()\n            path.pop()\n            used[i] = False\n    backtrack()\n    return out\n```\n\n$O(n \\cdot n!)$.\n\n## Duplicates — the one line that matters\n\nSort first, then at each level skip an element equal to its predecessor if that predecessor is not currently in the path.\n\n```python\n# subsets with duplicates: inside the loop\nif i > start and nums[i] == nums[i - 1]:\n    continue\n\n# permutations with duplicates: inside the loop\nif used[i] or (i > 0 and nums[i] == nums[i - 1] and not used[i - 1]):\n    continue\n```\n\nRead the permutation condition carefully: `not used[i-1]` means the identical earlier copy has already been *undone* at this level, so starting the same branch again would duplicate the whole subtree. Using `used[i-1]` instead still deduplicates the final list, but only by exploring both branches and discarding one — the pruning is what makes it correct *and* fast.\n\n## The bitmask alternative\n\nFor subsets with `n <= 20`, iterate `mask` from `0` to `2**n - 1` and include index `i` when `mask >> i & 1`. No recursion, trivially parallel, and easier to reason about — but it does not extend to duplicates or to pruning.",
      takeaways: [
        "Subsets recurse on `i + 1`; permutations recurse over all unused indices.",
        "Deduplication requires sorting first — the skip condition compares adjacent equals.",
        "Output size is exponential, so the complexity floor is the answer count itself."
      ],
      followUps: [
        "Combination sum with unlimited reuse — recurse on `i`, not `i + 1`.",
        "The k-th permutation in lexicographic order, without generating the rest. (Factorial number system.)",
        "Next permutation in place, $O(n)$. (Find the pivot, swap the successor, reverse the tail.)"
      ],
      trap: "Appending `path` instead of `path[:]`. Every entry in the output then aliases the same list, and when the recursion unwinds you get a result full of identical empty lists. It is invisible until you print the answer."
    },
    {
      id: "dsa-n-queens",
      q: "Place N queens on an N×N board so none attack each other. Return all solutions.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "microsoft", "adobe", "nvidia", "palantir", "oracle", "flipkart"],
      tags: ["backtracking", "recursion", "sets"],
      simple: "Place one queen per row, because two in a row would attack each other anyway. For each row try every column, check it is not already taken by a column or either diagonal, place it, and move to the next row. If no column works, back up and move the previous queen along.",
      answer: "## Row by row, with three sets\n\nThe only real design decision is how to test a diagonal in $O(1)$. Two identities do it:\n\n- Cells on the same **↘ diagonal** share `row - col`.\n- Cells on the same **↙ diagonal** share `row + col`.\n\n```python\ndef solve_n_queens(n):\n    out = []\n    cols, diag, anti = set(), set(), set()\n    placement = []\n\n    def backtrack(row):\n        if row == n:\n            out.append([\".\" * c + \"Q\" + \".\" * (n - c - 1) for c in placement])\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag or (row + col) in anti:\n                continue\n            cols.add(col); diag.add(row - col); anti.add(row + col)\n            placement.append(col)\n\n            backtrack(row + 1)\n\n            placement.pop()\n            cols.remove(col); diag.remove(row - col); anti.remove(row + col)\n\n    backtrack(0)\n    return out\n```\n\nThe naive check — scanning every placed queen — is $O(n)$ per candidate and turns an already expensive search into something noticeably slower. The sets make each test constant time.\n\n## Complexity\n\nThe worst case is $O(n!)$, but the real branching factor is far smaller because the constraints prune aggressively. There is no closed form for the number of solutions; it is computed, not derived. Being honest about that is better than inventing a bound.\n\n## Undo exactly what you did\n\nEvery `add` needs its matching `remove` on the way out. Forgetting one leaves the board permanently poisoned and the search returns too few solutions — often zero for larger `n`, which looks like a logic error somewhere else entirely.\n\n## If they only want the count\n\nSwitch the three sets for three bitmasks and iterate the free positions with `bits & -bits` to isolate the lowest set bit. It is roughly an order of magnitude faster and is the standard competitive formulation:\n\n```python\ndef total_n_queens(n):\n    full = (1 << n) - 1\n    def solve(cols, diag, anti):\n        if cols == full:\n            return 1\n        free = ~(cols | diag | anti) & full\n        count = 0\n        while free:\n            bit = free & -free          # lowest available column\n            free -= bit\n            count += solve(cols | bit, (diag | bit) << 1 & full,\n                           (anti | bit) >> 1)\n        return count\n    return solve(0, 0, 0)\n```",
      takeaways: [
        "One queen per row by construction — the row constraint costs nothing.",
        "`row - col` and `row + col` identify the two diagonals in $O(1)$.",
        "Every mutation on the way down needs its exact inverse on the way back up."
      ],
      followUps: [
        "Return only the count. (Bitmasks, and no board reconstruction.)",
        "Sudoku solver — the same skeleton with row/column/box constraint sets.",
        "N = 1000, any single solution will do. (Constructive patterns exist; search will not finish.)"
      ],
      trap: "Using `abs(row1 - row2) == abs(col1 - col2)` in a loop over placed queens. It is correct, and it is $O(n)$ per candidate rather than $O(1)$ — on a problem that is already exponential, that constant factor is the difference between finishing and not."
    },
    {
      id: "dsa-jump-game",
      q: "Each element is the maximum jump length from that position. Can you reach the last index? Then: what is the minimum number of jumps?",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "meta-ai", "adobe", "bytedance", "uber", "flipkart"],
      tags: ["greedy", "arrays", "dp"],
      simple: "For reachability, sweep left to right tracking the furthest index you could possibly have reached so far. If you ever stand on a position beyond that, you could never have got there and the answer is no. For the minimum jumps, think in levels: everything reachable in one jump is level one, everything reachable from those is level two, and you count how many levels it takes to cover the end.",
      answer: "## Part 1: reachability\n\n```python\ndef can_jump(nums):\n    furthest = 0\n    for i, n in enumerate(nums):\n        if i > furthest:\n            return False              # this index was never reachable\n        furthest = max(furthest, i + n)\n    return True\n```\n\n$O(n)$ time, $O(1)$ space. The greedy is correct because reachability is *downward closed*: if index `k` is reachable then so is every index below it, so a single frontier value captures the whole reachable set.\n\n## Part 2: minimum jumps\n\nThis is breadth-first search on an implicit graph, written without a queue.\n\n```python\ndef min_jumps(nums):\n    jumps = 0\n    cur_end = 0          # last index of the current BFS level\n    furthest = 0         # furthest reachable from the current level\n    for i in range(len(nums) - 1):        # note: stop BEFORE the last index\n        furthest = max(furthest, i + nums[i])\n        if i == cur_end:                  # exhausted this level\n            jumps += 1\n            cur_end = furthest\n    return jumps\n```\n\n$O(n)$ time, $O(1)$ space.\n\n**The loop bound is the bug everyone writes.** Iterating to `len(nums) - 1` inclusive means that if the last index happens to coincide with `cur_end`, you increment `jumps` one final time for a jump you never had to make. Stopping one short is not an off-by-one to be tidied away — it is the correctness condition.\n\n## Why greedy beats DP here\n\nThe $O(n^2)$ DP (`dp[i] = 1 + min(dp[j])` over all `j` that reach `i`) is the obvious answer and it is correct. The greedy is better because the reachable set from any level is a contiguous interval, so you only ever need its right endpoint. Being able to say *why* the interval structure licenses the greedy is the difference between the two answers.",
      takeaways: [
        "Reachability collapses to one frontier value because the reachable set is an interval.",
        "Minimum jumps is level-order BFS with two pointers instead of a queue.",
        "Iterate to `n - 2`, or you count a phantom final jump."
      ],
      followUps: [
        "Jump Game III — arbitrary ±nums[i] moves, so a real BFS with a visited set.",
        "Minimum jumps when jumping backwards is allowed. (Now genuinely a graph search.)",
        "Return the actual sequence of indices jumped through."
      ],
      trap: "Solving part 2 with a greedy that always jumps to whichever reachable index has the largest value. That is a different, incorrect heuristic — the best next hop is the one that maximises `i + nums[i]`, the reach, not `nums[i]` alone."
    },
    {
      id: "dsa-gas-station",
      q: "There are gas stations in a circle, each with some fuel and a cost to reach the next. Find the starting station from which you can complete the circuit.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "uber", "tesla", "adobe", "flipkart", "salesforce"],
      tags: ["greedy", "arrays"],
      simple: "First check whether the trip is possible at all: if the total fuel is less than the total cost, no start works. If it is possible, drive from station zero and keep a running tank. The moment the tank goes negative, none of the stations from your current start up to here can be the answer — so restart from the next one. One pass is enough.",
      answer: "## One pass, two accumulators\n\n```python\ndef can_complete_circuit(gas, cost):\n    if sum(gas) < sum(cost):\n        return -1                    # globally impossible\n    start, tank = 0, 0\n    for i in range(len(gas)):\n        tank += gas[i] - cost[i]\n        if tank < 0:\n            start = i + 1            # every start in [start, i] fails\n            tank = 0\n    return start\n```\n\n$O(n)$ time, $O(1)$ space.\n\n## The two claims this rests on\n\n**Claim 1 — if total gas ≥ total cost, a solution exists.** The circular sum of `gas[i] - cost[i]` is non-negative, so the prefix-sum walk around the circle has a global minimum; starting immediately after that minimum keeps every subsequent partial sum non-negative.\n\n**Claim 2 — if you run dry at `i` having started at `s`, then no station in `[s, i]` works either.** Starting at `s` you arrived at each intermediate station with a non-negative tank (otherwise you would have failed earlier). So starting from any `k` in `(s, i]` gives you *less than or equal* fuel on reaching `i` than starting from `s` did — and `s` already failed. Skipping the whole range is therefore safe, and it is what makes the single pass valid rather than merely lucky.\n\nSay both claims. The code is six lines; the proof is the interview.\n\n## The uniqueness detail\n\nWhen a solution exists it is unique for this problem's constraints, which is why returning `start` without re-verifying is legitimate. If the problem asked for *all* valid starts you would need a second pass.",
      takeaways: [
        "Total gas < total cost is a complete, cheap impossibility test.",
        "Failing at `i` eliminates every start up to `i`, not just the current one — that is what buys $O(n)$.",
        "Reset the tank to 0 on restart, not to the current deficit."
      ],
      followUps: [
        "Return every valid starting station rather than one.",
        "The tank has a finite capacity, so surplus fuel is lost. (Greedy breaks; needs care.)",
        "Stations are added and removed online — what structure supports queries now?"
      ],
      trap: "Trying every start with an inner loop, giving $O(n^2)$, and calling it acceptable because \"n is small\". The interviewer is asking this question specifically for the elimination argument; the brute force is the setup, not the answer."
    },
    {
      id: "dsa-validate-bst",
      q: "Determine whether a binary tree is a valid binary search tree.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "meta-ai", "adobe", "oracle", "flipkart", "salesforce", "uber"],
      tags: ["trees", "recursion", "bst"],
      simple: "It is not enough for each node to be bigger than its left child and smaller than its right one — a node deep in the left subtree can still be too large for the root. So carry a legal range down the tree: everything in the left subtree must be below the parent, everything in the right subtree above it, and the range narrows as you descend.",
      answer: "## Bounds, not local comparisons\n\n```python\ndef is_valid_bst(root):\n    def check(node, low, high):\n        if not node:\n            return True\n        if not (low < node.val < high):\n            return False\n        return (check(node.left, low, node.val) and\n                check(node.right, node.val, high))\n    return check(root, float(\"-inf\"), float(\"inf\"))\n```\n\n$O(n)$ time, $O(h)$ stack.\n\n## The counterexample to know by heart\n\n```\n      10\n     /  \\\n    5    15\n        /  \\\n       6    20\n```\n\nEvery node individually satisfies `left < node < right`. But 6 sits in the *right* subtree of 10 and is smaller than 10, so the tree is not a BST. The local check returns true; the bounds check correctly rejects it at node 6, whose legal range is `(10, 15)`.\n\n## The in-order alternative\n\nAn in-order traversal of a BST is strictly increasing, so you can walk it and compare to the previous value:\n\n```python\ndef is_valid_bst(root):\n    prev = None\n    stack, node = [], root\n    while stack or node:\n        while node:\n            stack.append(node)\n            node = node.left\n        node = stack.pop()\n        if prev is not None and node.val <= prev:\n            return False\n        prev = node.val\n        node = node.right\n    return True\n```\n\nThis is iterative, so it survives a 10⁵-deep degenerate tree that would blow the recursion stack. Mention that trade-off — deep-tree recursion limits are a real follow-up.\n\n## Duplicates\n\nAsk. `<` versus `<=` changes the answer, and the convention differs: some definitions put equal keys in the right subtree, some forbid them entirely. Choosing silently is the mistake; asking takes five seconds.",
      takeaways: [
        "Validity is a range constraint inherited from every ancestor, not a parent–child comparison.",
        "In-order traversal must be strictly increasing — an equivalent and iterative formulation.",
        "Ask how duplicates are defined before you pick `<` or `<=`."
      ],
      followUps: [
        "Recover a BST where exactly two nodes were swapped. (In-order, find the two inversions.)",
        "Find the largest BST subtree inside an arbitrary binary tree.",
        "The tree does not fit in memory — validate it from a serialised in-order stream."
      ],
      trap: "Using `INT_MIN` and `INT_MAX` as the initial bounds. A node whose value is exactly `INT_MIN` then fails its own bound check, and the tree is reported invalid. Use nullable bounds, or infinities in a language that has them."
    },
    {
      id: "dsa-lca-binary-tree",
      q: "Find the lowest common ancestor of two nodes in a binary tree. Then: what changes if it is a BST? What if nodes have parent pointers?",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "meta-ai", "microsoft", "apple", "adobe", "bytedance", "uber", "oracle"],
      tags: ["trees", "recursion"],
      simple: "Ask each subtree a single question: did you find either of the two nodes? If the left subtree found one and the right found the other, then you are standing on the meeting point. If only one side found anything, pass that answer up unchanged — the ancestor must be higher.",
      answer: "## The general tree\n\n```python\ndef lca(root, p, q):\n    if root is None or root is p or root is q:\n        return root\n    left = lca(root.left, p, q)\n    right = lca(root.right, p, q)\n    if left and right:\n        return root            # p and q split here — this is the LCA\n    return left or right       # both on one side, or neither\n```\n\n$O(n)$ time, $O(h)$ stack. Six lines, and the reasoning is the interview.\n\n## What the return value actually means\n\nIt is easy to say \"it returns the LCA\" and be unable to defend it. The function returns:\n\n- `None` if neither node is in this subtree,\n- the node itself if exactly one is found (and it is that one),\n- the LCA if both are found.\n\nThe third case only ever arises once — at the highest node where the two searches split — and once returned it propagates up unchanged, because from there upward exactly one side is non-null.\n\n## The unstated assumption\n\nThis code assumes **both nodes exist in the tree**. If `q` is absent, it returns `p`, which is wrong. When that guarantee is not given, either do a presence check first, or return a `(node, found_count)` pair and only accept the answer when the count is 2. Interviewers frequently add exactly this constraint as the follow-up.\n\n## Binary search tree\n\nThe values tell you which way to go, so no recursion into both sides is ever needed:\n\n```python\ndef lca_bst(root, p, q):\n    while root:\n        if p.val < root.val and q.val < root.val:\n            root = root.left\n        elif p.val > root.val and q.val > root.val:\n            root = root.right\n        else:\n            return root       # the split point, or one of the nodes\n    return None\n```\n\n$O(h)$ time, $O(1)$ space.\n\n## With parent pointers\n\nIt becomes the intersection of two linked lists: walk up from each node to build the two ancestor chains, then find the first shared node. Using a set of one chain's ancestors gives $O(h)$ time and $O(h)$ space; equalising the depths first and stepping in lockstep gives $O(h)$ time and $O(1)$ space.",
      takeaways: [
        "One post-order pass: split point means LCA, single hit propagates upwards.",
        "The classic solution assumes both nodes exist — say so, and handle it when they might not.",
        "BST version is a downward walk in $O(h)$; parent pointers make it list intersection."
      ],
      followUps: [
        "LCA of `k` nodes rather than two.",
        "Many repeated queries on a static tree. (Binary lifting: $O(n \\log n)$ build, $O(\\log n)$ query.)",
        "The tree is a DAG — is the LCA still well defined? (Not uniquely.)"
      ],
      trap: "Finding the root-to-node path for each target, then comparing the paths for the last common element. It works, it is $O(n)$, and it needs $O(h)$ extra space plus twenty lines of path bookkeeping — a strictly worse version of a six-line function."
    },
    {
      id: "dsa-binary-tree-max-path-sum",
      q: "Find the maximum path sum in a binary tree, where a path may start and end at any node.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "microsoft", "bytedance", "adobe", "uber", "databricks"],
      tags: ["trees", "recursion", "dp"],
      simple: "At every node, two different quantities matter. One is the best path that passes *through* this node and bends — down the left, up through the node, and down the right. That could be the overall answer, but it cannot be extended upwards. The other is the best straight path going *down* from this node, which is what the parent can actually use. Compute both, record the first, return the second.",
      answer: "## Two quantities, only one of which is returned\n\n```python\ndef max_path_sum(root):\n    best = float(\"-inf\")\n\n    def gain(node):\n        nonlocal best\n        if not node:\n            return 0\n        # a negative branch is worse than not taking the branch at all\n        left = max(gain(node.left), 0)\n        right = max(gain(node.right), 0)\n\n        best = max(best, node.val + left + right)   # path bending here\n        return node.val + max(left, right)          # path the parent can extend\n\n    gain(root)\n    return best\n```\n\n$O(n)$ time, $O(h)$ stack.\n\n## Why the return value cannot include both children\n\nA path is a simple path — it does not branch. If a parent were allowed to extend a child's result that already used both of the child's subtrees, the resulting shape would be a Y, not a path. So the bent version updates the global answer and is then thrown away; only the straight version travels upwards. Getting this distinction out loud is the whole question.\n\n## The `max(..., 0)` clamp\n\nA subtree with a negative total is never worth including — you can always stop at the current node instead. Clamping to zero encodes \"take this branch, or take nothing\". Without it, a tree of all-negative values returns a sum that includes branches it should have skipped.\n\n## Initialising `best`\n\nStart at negative infinity, not at zero. For the tree `[-3]` the answer is `-3`: a path must contain at least one node, so the empty path is not a legal answer. Initialising to zero returns 0 and is the most common failure on this problem.",
      takeaways: [
        "Update the global answer with the bent path; return only the straight one.",
        "Clamp negative subtree gains to zero — that is \"skip this branch\".",
        "`best` starts at −∞ because the empty path is not allowed."
      ],
      followUps: [
        "Return the actual node sequence, not just the sum.",
        "The same problem on a general graph. (Longest path is NP-hard — say so immediately.)",
        "Diameter of a binary tree, which is this shape with edge counts instead of values."
      ],
      trap: "Returning `node.val + left + right` from the recursive helper. It gives the right answer for a single node and the wrong answer everywhere else, because the parent then treats a branching Y-shape as if it were an extendable path."
    },
    {
      id: "dsa-number-of-islands",
      q: "Count the islands in a grid of land and water. Then: the grid is a stream of edits — count after each one.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "microsoft", "meta-ai", "bytedance", "uber", "adobe", "flipkart", "palantir"],
      tags: ["graph", "dfs", "bfs", "union-find"],
      simple: "Walk the grid. When you find a piece of land you have not visited, that is a new island — so add one to the count, then flood-fill outwards from it to mark every connected cell as seen. Anything you have already flooded is not a new island when you reach it again.",
      answer: "## Flood fill\n\n```python\ndef num_islands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n\n    def sink(r, c):\n        stack = [(r, c)]\n        while stack:                       # explicit stack, not recursion\n            i, j = stack.pop()\n            if 0 <= i < rows and 0 <= j < cols and grid[i][j] == \"1\":\n                grid[i][j] = \"0\"           # mark visited by sinking it\n                stack.extend([(i+1, j), (i-1, j), (i, j+1), (i, j-1)])\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == \"1\":\n                count += 1\n                sink(r, c)\n    return count\n```\n\n$O(rc)$ time — each cell is visited a constant number of times. Space $O(rc)$ worst case for the stack.\n\n**Use an explicit stack.** A 1000×1000 all-land grid recurses a million deep and overflows. This is a genuine production concern, not a technicality, and interviewers notice when you raise it unprompted.\n\n## If mutating the input is not allowed\n\nSay so and use a separate `visited` bitset. Sinking the grid is a legitimate optimisation, but silently destroying the caller's data is a code-review comment, not a feature.\n\n## The streaming follow-up\n\nWhen land is added one cell at a time and you must report the count after each addition, flood-filling from scratch is $O(k \\cdot rc)$. Union-find gives $O(k \\cdot \\alpha)$:\n\n```python\ndef num_islands_stream(rows, cols, positions):\n    parent, rank = {}, {}\n    count = 0\n    out = []\n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]      # path halving\n            x = parent[x]\n        return x\n\n    for r, c in positions:\n        if (r, c) in parent:\n            out.append(count)                  # duplicate add: no change\n            continue\n        parent[(r, c)] = (r, c)\n        rank[(r, c)] = 0\n        count += 1                             # optimistically a new island\n        for nb in ((r+1,c), (r-1,c), (r,c+1), (r,c-1)):\n            if nb in parent:\n                a, b = find((r, c)), find(nb)\n                if a != b:\n                    if rank[a] < rank[b]:\n                        a, b = b, a\n                    parent[b] = a\n                    if rank[a] == rank[b]:\n                        rank[a] += 1\n                    count -= 1                 # two islands became one\n        out.append(count)\n    return out\n```\n\n\"Add one, then subtract one per successful union\" is the accounting that makes this work.",
      takeaways: [
        "Flood fill with an explicit stack — recursion overflows on large dense grids.",
        "Sinking the grid is $O(1)$ extra space but mutates the caller's data. Say which you chose.",
        "Streaming edits call for union-find: +1 per new cell, −1 per successful union."
      ],
      followUps: [
        "Max island area, or the number of distinct island *shapes*. (Normalise each shape.)",
        "Diagonal connectivity counts as adjacent — an eight-neighbour variant.",
        "The grid is 10⁶ × 10⁶ and sparse. (Store only land cells and union over them.)"
      ],
      trap: "Marking a cell visited when you pop it rather than when you push it, in the BFS version. The same cell is then queued many times from different neighbours, and on a large open region the queue grows quadratically before anything is deduplicated."
    },
    {
      id: "dsa-clone-graph",
      q: "Deep-copy a connected undirected graph given a reference to one node.",
      topic: "DSA",
      level: "medium",
      companies: ["google", "meta-ai", "amazon", "microsoft", "uber", "adobe", "bytedance", "salesforce"],
      tags: ["graph", "dfs", "hash-map"],
      simple: "Copy nodes as you meet them, and keep a map from each original node to its copy. Before copying anything, check the map — if it is already there, the node has been visited and you just link to the existing copy. That map is what stops cycles from looping forever, and it is also what makes shared neighbours stay shared.",
      answer: "## The map is the visited set\n\n```python\ndef clone_graph(node):\n    if not node:\n        return None\n    clones = {}                                # original -> clone\n\n    def dfs(cur):\n        if cur in clones:\n            return clones[cur]                 # already cloned; reuse it\n        copy = Node(cur.val)\n        clones[cur] = copy                     # register BEFORE recursing\n        for nb in cur.neighbors:\n            copy.neighbors.append(dfs(nb))\n        return copy\n\n    return dfs(node)\n```\n\n$O(V + E)$ time and space.\n\n## Registering before recursing is the whole problem\n\nIf you create the copy, recurse into the neighbours, and only then insert into the map, a cycle re-enters the same node before it was registered — and the recursion never terminates. Even a two-node graph `A ↔ B` triggers it. That one line ordering is what the question is testing; everything else is traversal boilerplate.\n\n## Iterative version\n\nSame structure with a queue, which avoids deep recursion on a long chain:\n\n```python\nfrom collections import deque\n\ndef clone_graph(node):\n    if not node:\n        return None\n    clones = {node: Node(node.val)}\n    q = deque([node])\n    while q:\n        cur = q.popleft()\n        for nb in cur.neighbors:\n            if nb not in clones:\n                clones[nb] = Node(nb.val)\n                q.append(nb)\n            clones[cur].neighbors.append(clones[nb])\n    return clones[node]\n```\n\n## What makes it a *deep* copy\n\nNo edge in the result may point at an original node. The map guarantees this: every neighbour appended is looked up through `clones`, never taken directly. If the graph might be disconnected, one traversal is not enough — you need the full node list and a loop over unvisited nodes.",
      takeaways: [
        "The original→clone map doubles as the visited set; there is no second structure.",
        "Insert the clone into the map before recursing, or cycles never terminate.",
        "A disconnected graph needs the node list — one traversal reaches one component."
      ],
      followUps: [
        "Copy a linked list with a random pointer — the same map trick in one dimension.",
        "Clone with 10⁷ nodes: recursion is out, and the map's memory becomes the constraint.",
        "Serialise and deserialise the graph instead of cloning it in memory."
      ],
      trap: "Using a `visited` set alongside a separate list of copies. You then have to find the right copy for a given original, which is either a scan or a second map — at which point the visited set was redundant. One map does both jobs."
    },
    {
      id: "dsa-dijkstra-shortest-path",
      q: "Find the shortest path in a weighted graph. Why does Dijkstra fail with negative edges, and what would you use instead?",
      topic: "DSA",
      level: "medium",
      companies: ["google", "amazon", "uber", "microsoft", "meta-ai", "nvidia", "tesla", "databricks", "palantir"],
      tags: ["graph", "heap", "shortest-path"],
      simple: "Always expand whichever unvisited node is currently closest to the source. When you first settle a node, you have its final answer, because every other route to it would have to pass through something already further away. A min-heap keeps handing you the closest node.",
      answer: "## The implementation people actually ship\n\n```python\nimport heapq\n\ndef dijkstra(graph, src):\n    \"\"\"graph: {node: [(neighbour, weight), ...]}\"\"\"\n    dist = {src: 0}\n    pq = [(0, src)]                       # (distance, node)\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist.get(u, float(\"inf\")):\n            continue                      # stale entry — skip it\n        for v, w in graph.get(u, ()):\n            nd = d + w\n            if nd < dist.get(v, float(\"inf\")):\n                dist[v] = nd\n                heapq.heappush(pq, (nd, v))   # lazy deletion\n    return dist\n```\n\n$O((V + E) \\log V)$ with a binary heap.\n\n## Lazy deletion\n\nPython's `heapq` has no decrease-key, so instead of updating an entry you push a new one and let the old one become stale. The `if d > dist[u]: continue` guard discards those on pop. The heap can hold up to $O(E)$ entries rather than $O(V)$ — that is the price, and it is the right trade. Being able to explain why that guard exists separates people who have written this from people who have read it.\n\n## Why negative edges break it\n\nDijkstra's correctness rests on one invariant: **when a node is popped, its distance is final.** That holds only if every edge is non-negative, so extending any path can never make it shorter. With a negative edge, a longer-looking route can later become cheaper, and a node settled early is simply wrong. It is not a matter of tuning — the algorithm's proof no longer applies.\n\n## What to use instead\n\n| Situation | Algorithm | Cost |\n|---|---|---|\n| Non-negative weights | Dijkstra | $O(E \\log V)$ |\n| Negative edges, need cycle detection | Bellman–Ford | $O(VE)$ |\n| All-pairs, dense, negative allowed | Floyd–Warshall | $O(V^3)$ |\n| Negative edges, many queries | Johnson's (reweight, then Dijkstra) | $O(VE + VE \\log V)$ |\n| Unweighted | plain BFS | $O(V + E)$ |\n| Weights all 0 or 1 | 0-1 BFS with a deque | $O(V + E)$ |\n\nNegative **cycles** make shortest paths undefined, not merely hard — Bellman–Ford's extra relaxation round is what detects them.",
      takeaways: [
        "The invariant is that a popped node is final, which requires non-negative weights.",
        "Lazy deletion replaces decrease-key: push duplicates, skip stale pops.",
        "Know the fallback table — Bellman–Ford, Floyd–Warshall, 0-1 BFS, and when each applies."
      ],
      followUps: [
        "Reconstruct the path, not just the distance. (Store a predecessor per node.)",
        "A* — Dijkstra plus an admissible heuristic. What does admissibility guarantee?",
        "The graph has 10⁹ edges and does not fit in memory. (Δ-stepping, or a graph database.)"
      ],
      trap: "Claiming Dijkstra works with negative edges \"as long as there is no negative cycle\". Negative cycles make the problem undefined; negative *edges* alone already break Dijkstra's settled-node invariant. Bellman–Ford handles the second case, and detects the first."
    },
    {
      id: "dsa-median-data-stream",
      q: "Design a structure that accepts numbers from a stream and returns the running median.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "meta-ai", "microsoft", "uber", "databricks", "snowflake", "bytedance", "netflix"],
      tags: ["heap", "design", "streaming"],
      simple: "Split the numbers into two halves: the smaller half and the larger half. Keep the biggest of the small half and the smallest of the large half instantly available — that is what two heaps give you. The median is either the boundary value, or the average of the two boundary values when the count is even.",
      answer: "## Two heaps, facing each other\n\n```python\nimport heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.lo = []      # max-heap of the smaller half (negated values)\n        self.hi = []      # min-heap of the larger half\n\n    def add(self, num):\n        # always push to lo first, then hand its largest to hi\n        heapq.heappush(self.lo, -num)\n        heapq.heappush(self.hi, -heapq.heappop(self.lo))\n        # rebalance so lo is the same size or exactly one larger\n        if len(self.hi) > len(self.lo):\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\n\n    def median(self):\n        if len(self.lo) > len(self.hi):\n            return -self.lo[0]\n        return (-self.lo[0] + self.hi[0]) / 2.0\n```\n\n`add` is $O(\\log n)$, `median` is $O(1)$, space $O(n)$.\n\n## Why push-then-pop rather than comparing\n\nThe obvious version — \"if `num` is smaller than the top of `lo`, push it there, else push to `hi`\" — needs a separate empty-heap case and gets the boundary wrong when the new value belongs on the other side. Unconditionally routing every value through `lo` and immediately promoting its maximum to `hi` guarantees the ordering invariant with no branches. Then one size check restores balance. Two lines, no edge cases.\n\n## The invariants, stated\n\n1. Every element of `lo` ≤ every element of `hi`.\n2. `len(lo) == len(hi)` or `len(lo) == len(hi) + 1`.\n\nGiven those two, the median is fully determined. If you can state the invariants, the code writes itself; if you cannot, you will thrash on the rebalancing.\n\n## Follow-ups worth pre-empting\n\n**Sliding window of the last k.** Heaps do not support deletion by value, so use lazy deletion with a \"to remove\" counter map, or switch to an order-statistic tree / two multisets.\n\n**Numbers are bounded, say 0–100.** A 101-bucket counting array beats both heaps: $O(1)$ insert and $O(100)$ median, which is constant. Always ask about the value range — it can change the answer entirely.\n\n**Approximate median at 10⁶ events/sec.** t-digest or the P² algorithm, trading exactness for constant memory. That is the answer a streaming-systems interviewer is fishing for.",
      takeaways: [
        "Two heaps split the data at the median; both boundary values stay at $O(1)$ reach.",
        "Push through one heap and promote unconditionally — it removes every branch.",
        "A bounded value range makes counting buckets strictly better than heaps."
      ],
      followUps: [
        "Median over a sliding window of size k. (Lazy deletion, or two multisets.)",
        "Arbitrary percentiles, not just the 50th. (Order-statistic tree, or t-digest.)",
        "Distribute it across ten machines — what does merging partial state require?"
      ],
      trap: "Keeping a sorted list and inserting with `bisect`. The search is $O(\\log n)$ and everyone quotes that number, but the insertion itself shifts memory and is $O(n)$. On a real stream it is quadratic overall."
    },
    {
      id: "dsa-k-closest-points",
      q: "Return the k points closest to the origin. Which is better, a heap or quickselect?",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "meta-ai", "microsoft", "uber", "adobe", "bytedance", "salesforce"],
      tags: ["heap", "quickselect", "sorting"],
      simple: "You do not need the points sorted, only the closest k. So keep a pile of the k best seen so far, where the worst of them sits on top and gets thrown out whenever something better arrives. Or, if you have the whole array up front, partition it around the k-th closest point and stop — you never sort the parts you do not need.",
      answer: "## Heap of size k\n\n```python\nimport heapq\n\ndef k_closest(points, k):\n    heap = []                                # max-heap by negated distance\n    for x, y in points:\n        d = x * x + y * y                    # no sqrt — it is monotonic\n        if len(heap) < k:\n            heapq.heappush(heap, (-d, x, y))\n        elif -heap[0][0] > d:\n            heapq.heapreplace(heap, (-d, x, y))   # one op, not pop + push\n    return [[x, y] for _, x, y in heap]\n```\n\n$O(n \\log k)$ time, $O(k)$ space.\n\n**Skip the square root.** $\\sqrt{\\cdot}$ is monotonic, so comparing squared distances gives identical ordering without the floating-point cost or the precision loss. Interviewers look for this.\n\n## Quickselect\n\n```python\nimport random\n\ndef k_closest(points, k):\n    def dist(p):\n        return p[0] * p[0] + p[1] * p[1]\n\n    lo, hi = 0, len(points) - 1\n    while lo < hi:\n        p = random.randint(lo, hi)                    # randomised pivot\n        points[p], points[hi] = points[hi], points[p]\n        pivot, store = dist(points[hi]), lo\n        for i in range(lo, hi):\n            if dist(points[i]) < pivot:\n                points[i], points[store] = points[store], points[i]\n                store += 1\n        points[store], points[hi] = points[hi], points[store]\n\n        if store == k:\n            break\n        if store < k:\n            lo = store + 1\n        else:\n            hi = store - 1\n    return points[:k]\n```\n\n$O(n)$ expected, $O(n^2)$ worst case, $O(1)$ extra space.\n\n## Which to choose, and say why\n\n| | Heap | Quickselect |\n|---|---|---|\n| Time | $O(n \\log k)$ | $O(n)$ expected, $O(n^2)$ worst |\n| Space | $O(k)$ | $O(1)$, in place |\n| Streaming input | yes | no — needs the whole array |\n| Mutates input | no | yes |\n| Output ordered | no (heap order) | no |\n\n**Streaming is the deciding factor.** If points arrive one at a time or `n` does not fit in memory, quickselect is simply unavailable and the $O(n \\log k)$ heap with $O(k)$ memory is the only option. If you have the array in memory and `k` is a large fraction of `n`, quickselect wins. Naming the condition is the answer; naming an algorithm is not.\n\n## The randomised pivot\n\nWithout it, an adversarial or already-sorted input drives quickselect to $O(n^2)$. Median-of-medians gives a deterministic $O(n)$ but with a constant factor nobody wants in practice. Random pivots are what real implementations use.",
      takeaways: [
        "Compare squared distances — the square root changes nothing but the cost.",
        "Heap is $O(n \\log k)$ and streams; quickselect is $O(n)$ expected but needs the whole array.",
        "`heapreplace` is one sift instead of two — a real constant-factor win in a hot loop."
      ],
      followUps: [
        "Closest points to an arbitrary query point, with many queries. (k-d tree.)",
        "k closest in high dimensions. (Exact search degrades; use LSH or HNSW.)",
        "Return them sorted by distance — one extra $O(k \\log k)$ sort at the end."
      ],
      trap: "Sorting the whole array and slicing the first k. It is one line and $O(n \\log n)$, which is fine when `n` is small — but stating it as your answer without noting that it does strictly more work than the problem requires is what the question is designed to catch."
    },
    {
      id: "dsa-insert-delete-getrandom",
      q: "Design a set with insert, remove and getRandom, all in $O(1)$ average.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "google", "meta-ai", "microsoft", "uber", "adobe", "snowflake", "bytedance"],
      tags: ["design", "hash-map", "arrays"],
      simple: "Random selection needs an array, because that is the only structure where you can pick a uniform index instantly. Removal needs a hash map, so you can find where a value lives. Combine them: the array holds the values, the map says where each one is, and to delete something you move the last element into its slot instead of shifting everything down.",
      answer: "## Array plus index map, with swap-to-delete\n\n```python\nimport random\n\nclass RandomizedSet:\n    def __init__(self):\n        self.items = []          # dense array of values\n        self.index = {}          # value -> its position in items\n\n    def insert(self, val):\n        if val in self.index:\n            return False\n        self.index[val] = len(self.items)\n        self.items.append(val)\n        return True\n\n    def remove(self, val):\n        if val not in self.index:\n            return False\n        i = self.index[val]\n        last = self.items[-1]\n        self.items[i] = last          # overwrite the hole with the last item\n        self.index[last] = i          # and fix its recorded position\n        self.items.pop()\n        del self.index[val]           # delete AFTER the fix-up\n        return True\n\n    def get_random(self):\n        return random.choice(self.items)\n```\n\nAll three operations are $O(1)$ average, space $O(n)$.\n\n## Why the array must stay dense\n\n`getRandom` must be uniform, so it needs a contiguous range of valid indices. Tombstoning removed slots breaks uniformity — you would have to re-draw on a hole, and a set that is mostly holes never terminates in reasonable time. Swapping in the last element is what keeps the array gapless.\n\n## The ordering bug\n\nWhen the element being removed *is* the last element, `i == len(items) - 1`. The line `self.index[last] = i` then re-inserts the key you are about to delete. If you delete `val` from the map *before* the fix-up, this order is wrong and the map ends up holding a stale entry pointing past the end of the array. Deleting last — as above — is correct in both cases and needs no special-case branch.\n\n## The follow-up: duplicates allowed\n\nMake `index` a `value -> set of positions` map. Removal takes any one position from the set, and the swap must update the moved element's position set (remove the old index, add the new one). The subtlety is that when the moved element equals the removed one, those two operations interact — write the removal from the set *after* the insert, or use a list of positions with the same swap-to-end trick one level down.",
      takeaways: [
        "Array for uniform random access, hash map for $O(1)$ lookup — neither alone suffices.",
        "Delete by swapping in the last element; the array must never develop holes.",
        "Fix the moved element's index before removing the deleted key, or self-removal corrupts the map."
      ],
      followUps: [
        "Allow duplicates. (Map to a set of indices, and be careful with self-swaps.)",
        "Weighted getRandom. (Prefix sums plus binary search, or the alias method for $O(1)$.)",
        "getRandom over a stream of unknown length. (Reservoir sampling.)"
      ],
      trap: "Removing by `list.remove(val)` or by slicing out the index. Both are $O(n)$ because the tail shifts, and both look perfectly innocent — the whole point of the question is the swap-with-last trick that avoids them."
    },
    {
      id: "dsa-reverse-k-group",
      q: "Reverse the nodes of a linked list in groups of k. Nodes left over at the end stay as they are.",
      topic: "DSA",
      level: "hard",
      companies: ["amazon", "google", "microsoft", "meta-ai", "bytedance", "adobe", "uber", "flipkart"],
      tags: ["linked-list", "pointers"],
      simple: "First check that k nodes actually remain — if not, leave the tail alone. Then reverse exactly those k, which flips the direction of the arrows inside the group. The tricky part is stitching: the node before the group must now point at what was the group's last node, and the group's original first node becomes its last and must point at whatever comes next.",
      answer: "## Count first, then reverse, then stitch\n\nA dummy head removes the special case where the first group is reversed and the list head changes.\n\n```python\ndef reverse_k_group(head, k):\n    dummy = ListNode(0, head)\n    group_prev = dummy\n\n    while True:\n        # 1. is there a full group of k left?\n        node = group_prev\n        for _ in range(k):\n            node = node.next\n            if not node:\n                return dummy.next        # fewer than k remain: done\n        group_next = node.next           # first node after the group\n\n        # 2. reverse the k nodes, ending them at group_next\n        prev, cur = group_next, group_prev.next\n        for _ in range(k):\n            nxt = cur.next\n            cur.next = prev\n            prev, cur = cur, nxt\n\n        # 3. stitch: the old first node is now the group's tail\n        new_group_prev = group_prev.next   # capture BEFORE overwriting\n        group_prev.next = prev             # prev is the group's new head\n        group_prev = new_group_prev\n    \n```\n\n$O(n)$ time, $O(1)$ space. Each node is visited twice — once counting, once reversing.\n\n## The two details that decide it\n\n**Seed `prev` with `group_next`, not `None`.** Reversing with `prev = None` leaves the group's tail pointing at nothing, and you then have to walk back to reattach it. Seeding with the node after the group makes the reversal produce a correctly-terminated segment in one pass.\n\n**Capture `group_prev.next` before overwriting it.** After reversal the old first node is the group's last node — exactly where the next iteration must continue. Read it first; one line later it is gone.\n\n## Why count before reversing\n\nThe spec says a trailing partial group stays in original order. If you reverse first and discover afterwards that the group was short, you have to undo the work. The forward count is $O(k)$ and makes the rest unconditional.\n\n## The recursive version\n\nIt is genuinely shorter, and it is $O(n/k)$ stack depth — for `k = 1` on a million-node list, that is a million frames. Offer it, then say why the iterative one is what you would ship.",
      takeaways: [
        "Dummy head removes every \"is this the first group\" branch.",
        "Seed the reversal with `group_next` so the segment terminates correctly in one pass.",
        "Count the group before reversing it — a partial tail must be left untouched."
      ],
      followUps: [
        "Reverse alternate groups only, leaving the others in order.",
        "Swap nodes in pairs — this problem with `k = 2`, and it should fall straight out.",
        "Rotate the list right by k. (Close it into a ring, then cut at the right place.)"
      ],
      trap: "Reversing the values instead of relinking the nodes. It produces the right output on a test harness that prints values, and it is the wrong answer: the question is about pointer manipulation, and with immutable or heavyweight payloads the value swap is not even legal."
    },
    {
      id: "dsa-copy-list-random-pointer",
      q: "Deep-copy a linked list where each node also has a `random` pointer to any node in the list, or null.",
      topic: "DSA",
      level: "medium",
      companies: ["amazon", "microsoft", "google", "meta-ai", "adobe", "bytedance", "oracle", "flipkart"],
      tags: ["linked-list", "hash-map", "pointers"],
      simple: "The problem is that a random pointer may point at a node you have not copied yet. The easy fix is a map from each original node to its copy: build all the copies first, then go round again and set the pointers by looking them up. The clever fix avoids the map by weaving each copy in directly behind its original, so a copy's random pointer is always just one step past the original's.",
      answer: "## Two passes with a map\n\n```python\ndef copy_random_list(head):\n    if not head:\n        return None\n    clones = {}\n\n    cur = head                                # pass 1: bare copies\n    while cur:\n        clones[cur] = Node(cur.val)\n        cur = cur.next\n\n    cur = head                                # pass 2: wire the pointers\n    while cur:\n        clones[cur].next = clones.get(cur.next)\n        clones[cur].random = clones.get(cur.random)\n        cur = cur.next\n\n    return clones[head]\n```\n\n$O(n)$ time, $O(n)$ space. `.get` rather than `[]` handles the null pointers without a branch.\n\n## The interleaving trick — $O(1)$ extra space\n\nWeave each copy in directly after its original, so `original.next` *is* its clone. The random pointers then need no lookup structure at all.\n\n```python\ndef copy_random_list(head):\n    if not head:\n        return None\n\n    cur = head                    # 1. A -> A' -> B -> B' -> C -> C'\n    while cur:\n        cur.next = Node(cur.val, cur.next)\n        cur = cur.next.next\n\n    cur = head                    # 2. the copy's random is one past the original's\n    while cur:\n        if cur.random:\n            cur.next.random = cur.random.next\n        cur = cur.next.next\n\n    cur = head                    # 3. unweave, restoring the original list\n    copy_head = head.next\n    while cur:\n        clone = cur.next\n        cur.next = clone.next\n        clone.next = clone.next.next if clone.next else None\n        cur = cur.next\n    return copy_head\n```\n\n$O(n)$ time, $O(1)$ extra space beyond the output.\n\n## The line the whole trick rests on\n\n`cur.next.random = cur.random.next`. Read it as: *the clone of `cur`* (which is `cur.next`) should point at *the clone of `cur.random`* (which is `cur.random.next`). The weave makes \"the clone of X\" a constant-time expression with no map. That sentence is the answer to \"how does this work?\"\n\n## Restore the original\n\nStep 3 is not optional. The caller handed you a list; returning it interleaved with clones is a mutation they did not ask for and will not expect. In an interview, doing step 3 unprompted is a strong signal.",
      takeaways: [
        "A map from original to clone turns \"pointer to a node not yet copied\" into a lookup.",
        "Interleaving encodes the mapping in the list itself, reaching $O(1)$ extra space.",
        "Always unweave — leaving the caller's list mutated is a real bug, not a detail."
      ],
      followUps: [
        "The same problem on a general graph — this is `clone graph` with one map.",
        "The list has a cycle in `next`. Does either approach still work?",
        "Serialise the list to a byte stream and rebuild it elsewhere."
      ],
      trap: "Setting `clone.random` during the first pass. The target may not exist yet, so you write null and never come back — and it happens to be correct whenever `random` points backwards, which is most small test cases."
    },
    {
      id: "dsa-range-sum-mutable-fenwick",
      q: "Support range sum queries on an array with point updates, both faster than $O(n)$.",
      topic: "DSA",
      level: "hard",
      companies: ["google", "amazon", "microsoft", "bytedance", "databricks", "snowflake", "palantir", "nvidia"],
      tags: ["fenwick-tree", "segment-tree", "arrays"],
      simple: "A plain array gives instant updates but slow sums. A prefix-sum array gives instant sums but slow updates, because changing one value rewrites everything after it. The fix is to store partial sums over ranges of different sizes, so both operations touch only a logarithmic number of them.",
      answer: "## Frame the trade-off first\n\n| Structure | Query | Update |\n|---|---|---|\n| Raw array | $O(n)$ | $O(1)$ |\n| Prefix sums | $O(1)$ | $O(n)$ |\n| Fenwick tree (BIT) | $O(\\log n)$ | $O(\\log n)$ |\n| Segment tree | $O(\\log n)$ | $O(\\log n)$ |\n\nStating the two degenerate cases before writing anything shows you understand *why* the log-log structure is the answer rather than reciting it.\n\n## Fenwick tree\n\n```python\nclass BIT:\n    def __init__(self, n):\n        self.n = n\n        self.tree = [0] * (n + 1)      # 1-indexed; index 0 is unused\n\n    def add(self, i, delta):           # i is 0-based externally\n        i += 1\n        while i <= self.n:\n            self.tree[i] += delta\n            i += i & -i                # move to the next covering node\n\n    def prefix(self, i):               # sum of [0, i)\n        s = 0\n        while i > 0:\n            s += self.tree[i]\n            i -= i & -i                # strip the lowest set bit\n        return s\n\n    def range_sum(self, lo, hi):       # [lo, hi)\n        return self.prefix(hi) - self.prefix(lo)\n```\n\n`i & -i` isolates the lowest set bit, which is exactly the length of the range that node covers. Adding it walks to the parent that also covers this index; subtracting it walks to the previous disjoint block. That one expression is the whole data structure.\n\n**It takes a delta, not a value.** To *set* index `i` to `v`, call `add(i, v - current[i])` and maintain the raw array alongside. Passing a value where a delta is expected is the most common misuse.\n\n## When you need a segment tree instead\n\nA Fenwick tree handles invertible operations — sums, XOR — because range queries are computed by subtraction. It cannot do range minimum, because you cannot subtract a minimum. A segment tree stores the actual aggregate per node and merges children, so it works for min, max, gcd, or any associative operation, and with lazy propagation it also supports **range** updates. It costs about twice the memory and more code.\n\nSo: sums with point updates → Fenwick. Anything non-invertible, or range updates → segment tree. Static array, no updates at all → prefix sums, and do not build a tree.",
      takeaways: [
        "`i & -i` is the lowest set bit, and it *is* the block length each node covers.",
        "Fenwick needs an invertible operation; min and max require a segment tree.",
        "If there are no updates, prefix sums are $O(1)$ per query — do not over-engineer."
      ],
      followUps: [
        "Range update, point query. (A BIT over the difference array.)",
        "Range update and range query. (Two BITs, or a segment tree with lazy propagation.)",
        "2D range sums on a grid with point updates. (A BIT of BITs, $O(\\log^2 n)$.)"
      ],
      trap: "Using a Fenwick tree for range minimum queries. The prefix-difference trick has no meaning for `min`, so the structure silently returns wrong answers on any query that does not start at index 0 — and queries that do start at 0 look perfectly correct."
    }
  ]);
})(window.TD = window.TD || {});
