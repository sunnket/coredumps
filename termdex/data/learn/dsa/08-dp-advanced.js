/* DSA for Interviews — backtracking as its own skill, and the named DP
   problems that recur often enough to be worth knowing by shape. */
TD.addLessons("dsa", [

{
 t: "Backtracking — Generating Every Possibility, Prunably",
 m: "dp",
 lvl: "intermediate",
 s: "Subsets, permutations, combinations and n-queens: one template, four small variations.",
 goal: [
  "Write the choose / explore / un-choose template from memory",
  "Handle duplicates and reuse correctly, which is where marks are lost",
  "Prune a search so an exponential problem becomes tractable"
 ],
 b: [
  { p: "Backtracking is DFS over a tree of decisions. **It is not dynamic programming and the two get confused constantly** — DP reuses overlapping answers, while backtracking enumerates distinct outputs. If the question wants *all* the arrangements rather than a count or a best value, it is backtracking." },

  { h: "The template" },
  { code: { lang: "python", t: "Choose, explore, un-choose",
    lines: [
     { c: "def backtrack(path, choices):", w: "" },
     { c: "    if is_complete(path):", w: "" },
     { c: "        results.append(path[:])", w: "**`path[:]` — a COPY.** Appending `path` itself stores a reference that you then mutate.", hi: true },
     { c: "        return", w: "" },
     { c: "", w: "" },
     { c: "    for choice in choices:", w: "" },
     { c: "        if not valid(choice, path):", w: "**Pruning goes here — the earlier the better.**", hi: true },
     { c: "            continue", w: "" },
     { c: "        path.append(choice)", w: "**CHOOSE**" },
     { c: "        backtrack(path, next_choices(choices, choice))", w: "**EXPLORE**" },
     { c: "        path.pop()", w: "**UN-CHOOSE — the line that makes it backtracking.**", hi: true }
    ],
    after: "Two bugs account for most failures here: **forgetting `path[:]`**, which leaves every result pointing at the same list (usually empty at the end), and **forgetting `path.pop()`**, which lets choices leak between branches." } },

  { h: "Subsets and permutations" },
  { code: { lang: "python", t: "The two base cases",
    lines: [
     { c: "# SUBSETS -- every node is an answer, and order does not matter", w: "" },
     { c: "def subsets(nums):", w: "" },
     { c: "    out = []", w: "" },
     { c: "    def go(start, path):", w: "" },
     { c: "        out.append(path[:])", w: "**Record at EVERY node, not just the leaves.**", hi: true },
     { c: "        for i in range(start, len(nums)):", w: "**`start` prevents [1,2] and [2,1] both appearing.**", hi: true },
     { c: "            path.append(nums[i])", w: "" },
     { c: "            go(i + 1, path)", w: "**i+1: each element used at most once.**" },
     { c: "            path.pop()", w: "" },
     { c: "    go(0, [])", w: "**O(2^n) subsets.**" },
     { c: "    return out", w: "" },
     { c: "", w: "" },
     { c: "# PERMUTATIONS -- only leaves are answers, and order matters", w: "" },
     { c: "def permute(nums):", w: "" },
     { c: "    out = []", w: "" },
     { c: "    def go(path, used):", w: "" },
     { c: "        if len(path) == len(nums):", w: "**Only complete arrangements count.**", hi: true },
     { c: "            out.append(path[:]); return", w: "" },
     { c: "        for i in range(len(nums)):", w: "**From 0 every time — no `start`.**", hi: true },
     { c: "            if used[i]: continue", w: "**A used-set instead, because order matters.**" },
     { c: "            used[i] = True; path.append(nums[i])", w: "" },
     { c: "            go(path, used)", w: "" },
     { c: "            path.pop(); used[i] = False", w: "**Undo both.**" },
     { c: "    go([], [False] * len(nums))", w: "**O(n!).**" },
     { c: "    return out", w: "" }
    ],
    after: "**The `start` index versus the `used` array is the whole distinction.** `start` means combinations, where [1,2] and [2,1] are the same. `used` means permutations, where they differ. Every other problem in this family is one of those two with a different stopping condition." } },

  { h: "Duplicates: the detail that separates answers" },
  { code: { lang: "python", t: "Skipping duplicate siblings",
    lines: [
     { c: "def subsets_with_dups(nums):", w: "" },
     { c: "    nums.sort()", w: "**Sorting is required — duplicates must be adjacent.**", hi: true },
     { c: "    out = []", w: "" },
     { c: "    def go(start, path):", w: "" },
     { c: "        out.append(path[:])", w: "" },
     { c: "        for i in range(start, len(nums)):", w: "" },
     { c: "            if i > start and nums[i] == nums[i - 1]:", w: "**`i > start`, not `i > 0`.** This skips duplicate SIBLINGS, not the whole value.", hi: true },
     { c: "                continue", w: "" },
     { c: "            path.append(nums[i])", w: "" },
     { c: "            go(i + 1, path)", w: "" },
     { c: "            path.pop()", w: "" },
     { c: "    go(0, [])", w: "" },
     { c: "    return out", w: "" }
    ],
    after: "`i > start` is worth pausing on. At a given level, the *first* occurrence of a value is allowed and later identical siblings are skipped — but the value may still be reused deeper down, which is what keeps [2,2] in the output while removing the duplicate [2]. **Writing `i > 0` instead is a common and quiet error.**" } },

  { tbl: { t: "The four variants, side by side",
    h: ["Problem", "Loop starts at", "Recurse with", "Record"],
    rows: [
     ["**Subsets**", "`start`", "`i + 1`", "Every node"],
     ["**Combinations** (choose k)", "`start`", "`i + 1`", "When `len(path) == k`"],
     ["**Permutations**", "`0` + used[]", "same list", "When path is full"],
     ["**Combination sum** (reuse allowed)", "`start`", "**`i`**, not i+1", "When the remainder hits 0"]
    ] } },

  { h: "Pruning is what makes it feasible" },
  { code: { lang: "python", t: "N-Queens — O(n!) made practical",
    lines: [
     { c: "def solve_n_queens(n):", w: "" },
     { c: "    cols, diag, anti = set(), set(), set()", w: "**Three sets make the validity check O(1).**", hi: true },
     { c: "    out, board = [], []", w: "" },
     { c: "", w: "" },
     { c: "    def go(r):", w: "**One queen per row, so recurse by row.**" },
     { c: "        if r == n:", w: "" },
     { c: "            out.append(board[:]); return", w: "" },
     { c: "        for c in range(n):", w: "" },
     { c: "            if c in cols or (r - c) in diag or (r + c) in anti:", w: "**r-c is constant down a diagonal; r+c down an anti-diagonal.**", hi: true },
     { c: "                continue", w: "**Pruned before recursing — this is the entire optimisation.**", hi: true },
     { c: "            cols.add(c); diag.add(r - c); anti.add(r + c)", w: "" },
     { c: "            board.append(c)", w: "" },
     { c: "            go(r + 1)", w: "" },
     { c: "            board.pop()", w: "" },
     { c: "            cols.remove(c); diag.remove(r - c); anti.remove(r + c)", w: "**Undo all three.**" },
     { c: "    go(0)", w: "" },
     { c: "    return out", w: "" }
    ],
    after: "The `r - c` and `r + c` identities are the trick worth remembering: **every square on a diagonal shares one value, and every square on an anti-diagonal shares the other.** That turns an O(n) scan of the board into three set lookups." } },

  { n: "When you see `n <= 20` in the constraints, an exponential solution is expected and backtracking is very likely the intended answer. **A small n is a hint, not a courtesy** — it is telling you the examiner knows the solution is exponential.",
    nt: "Reading the constraint" },

  { tryit: { t: "Four from the template",
    task: "Write each from the template, naming the variant first.\n\n1. All combinations of k numbers from 1..n\n2. Combination sum, where each candidate may be reused\n3. All permutations of an array that contains duplicates\n4. Word search: does a word exist in a grid by adjacent letters?",
    hint: "2 recurses with `i`, not `i+1`. 3 needs both a used array and the duplicate-sibling skip. 4 is backtracking on a grid — mark the cell, recurse, unmark.",
    sol: { lang: "python", code: "# 1. COMBINATIONS -- start index, stop at length k\ndef combine(n, k):\n    out = []\n    def go(start, path):\n        if len(path) == k:\n            out.append(path[:]); return\n        # prune: not enough numbers left to ever reach k\n        for i in range(start, n - (k - len(path)) + 2):\n            path.append(i)\n            go(i + 1, path)\n            path.pop()\n    go(1, [])\n    return out\n\n# 2. COMBINATION SUM -- recurse with i, so a candidate may repeat\ndef combination_sum(candidates, target):\n    candidates.sort()\n    out = []\n    def go(start, path, remain):\n        if remain == 0:\n            out.append(path[:]); return\n        for i in range(start, len(candidates)):\n            if candidates[i] > remain:\n                break                       # sorted, so everything after is too big\n            path.append(candidates[i])\n            go(i, path, remain - candidates[i])   # i, NOT i + 1\n            path.pop()\n    go(0, [], target)\n    return out\n\n# 3. PERMUTATIONS WITH DUPLICATES -- used array AND sibling skip\ndef permute_unique(nums):\n    nums.sort()\n    out, used = [], [False] * len(nums)\n    def go(path):\n        if len(path) == len(nums):\n            out.append(path[:]); return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            # skip a duplicate unless its twin is already placed on this path\n            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:\n                continue\n            used[i] = True; path.append(nums[i])\n            go(path)\n            path.pop(); used[i] = False\n    go([])\n    return out\n\n# 4. WORD SEARCH -- backtracking on a grid\ndef exist(board, word):\n    rows, cols = len(board), len(board[0])\n    def go(r, c, i):\n        if i == len(word):\n            return True\n        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:\n            return False\n        board[r][c] = '#'                    # mark, so this path cannot reuse it\n        found = any(go(r + dr, c + dc, i + 1)\n                    for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)))\n        board[r][c] = word[i]                # UNMARK -- other paths may need it\n        return found\n    return any(go(r, c, 0) for r in range(rows) for c in range(cols))" },
    w: "Problem 3's condition `not used[i - 1]` is the subtlest line in this lesson. It permits a duplicate only when its identical twin is already on the current path, which keeps one copy of each distinct arrangement. **Getting this right without help is a strong signal**, and it is worth writing out a three-element example by hand until it clicks." } },

  { vocab: ["Backtracking", "Recursion", "Depth-First Search", "Time Complexity"] }
 ],
 k: [
  "Choose, explore, un-choose. Append `path[:]` — a copy — or every result aliases one list.",
  "`start` index means combinations; a `used` array means permutations. That choice defines the problem.",
  "For duplicates, sort first and skip with `i > start`, not `i > 0` — you are skipping siblings, not values.",
  "Combination sum reuses a candidate by recursing with `i` rather than `i + 1`.",
  "Prune before recursing, not after. N-queens uses `r-c` and `r+c` to test diagonals in O(1)."
 ],
 r: ["Backtracking", "Recursion", "Depth-First Search"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "out.append(path[:])", w: "record a copy, never the live list" },
   { c: "path.append(x); go(...); path.pop()", w: "choose, explore, un-choose" },
   { c: "if i > start and nums[i] == nums[i-1]: continue", w: "skip duplicate siblings" },
   { c: "if c in cols or (r-c) in diag or (r+c) in anti:", w: "n-queens — O(1) diagonal check" }
  ]
 }
},

{
 t: "The DP Problems Worth Knowing By Name",
 m: "dp",
 lvl: "advanced",
 s: "Knapsack, LIS, edit distance and the grid family — six shapes that most DP questions are a rewording of.",
 goal: [
  "Recognise a new problem as a disguised version of a known one",
  "Write the 0/1 knapsack and unbounded knapsack loops correctly",
  "Reduce a two-dimensional table to one row when asked about space"
 ],
 b: [
  { p: "The first DP lesson gives you the method: recursion, then memoise, then tabulate. **This one gives you the vocabulary** — a handful of named problems that interview questions are usually a costume change away from." },

  { h: "0/1 knapsack, and the loop direction that matters" },
  { code: { lang: "python", t: "Two nearly identical loops, two different problems",
    lines: [
     { c: "# 0/1 KNAPSACK -- each item may be taken at most ONCE", w: "" },
     { c: "def knapsack(weights, values, cap):", w: "" },
     { c: "    dp = [0] * (cap + 1)", w: "**dp[c] = best value in capacity c.**" },
     { c: "    for i in range(len(weights)):", w: "" },
     { c: "        for c in range(cap, weights[i] - 1, -1):", w: "**BACKWARDS.** Guarantees item i is used at most once.", hi: true },
     { c: "            dp[c] = max(dp[c], dp[c - weights[i]] + values[i])", w: "**Skip it, or take it.**" },
     { c: "    return dp[cap]", w: "" },
     { c: "", w: "" },
     { c: "# UNBOUNDED KNAPSACK -- unlimited copies (coin change)", w: "" },
     { c: "def coin_change(coins, amount):", w: "" },
     { c: "    dp = [0] + [float('inf')] * amount", w: "" },
     { c: "    for coin in coins:", w: "" },
     { c: "        for c in range(coin, amount + 1):", w: "**FORWARDS.** Allows reusing the same coin.", hi: true },
     { c: "            dp[c] = min(dp[c], dp[c - coin] + 1)", w: "" },
     { c: "    return dp[amount] if dp[amount] != float('inf') else -1", w: "" }
    ],
    after: "**The only difference is the direction of the inner loop.** Going backwards, `dp[c - w]` still refers to the previous item's row, so each item is used once. Going forwards, it may already include the current item, which is exactly what unlimited reuse means. This is the single highest-value detail in all of interview DP." } },

  { trap: "Swapping the two loops changes the answer in the combinations/permutations family too. **Coins on the outside counts combinations** (1+2 and 2+1 as one); **amount on the outside counts permutations** (as two). *Coin Change II* wants the first; *Combination Sum IV* wants the second." },

  { h: "Longest increasing subsequence" },
  { code: { lang: "python", t: "O(n²) to state, O(n log n) to impress",
    lines: [
     { c: "# the O(n^2) version -- write this first", w: "" },
     { c: "def lis(nums):", w: "" },
     { c: "    dp = [1] * len(nums)", w: "**dp[i] = longest subsequence ENDING at i.**", hi: true },
     { c: "    for i in range(len(nums)):", w: "" },
     { c: "        for j in range(i):", w: "" },
     { c: "            if nums[j] < nums[i]:", w: "" },
     { c: "                dp[i] = max(dp[i], dp[j] + 1)", w: "" },
     { c: "    return max(dp, default=0)", w: "" },
     { c: "", w: "" },
     { c: "# the O(n log n) version -- patience sorting", w: "" },
     { c: "import bisect", w: "" },
     { c: "def lis_fast(nums):", w: "" },
     { c: "    tails = []", w: "**tails[k] = smallest tail of a length-(k+1) subsequence.**", hi: true },
     { c: "    for x in nums:", w: "" },
     { c: "        i = bisect.bisect_left(tails, x)", w: "**Where would x go?**" },
     { c: "        if i == len(tails):", w: "" },
     { c: "            tails.append(x)", w: "**Bigger than everything — the sequence grows.**", hi: true },
     { c: "        else:", w: "" },
     { c: "            tails[i] = x", w: "**Replace, keeping tails as small as possible.**" },
     { c: "    return len(tails)", w: "**`tails` is NOT the subsequence — only its LENGTH is correct.**", hi: true }
    ],
    after: "That last caveat matters: `tails` gives the right length but is usually not a real subsequence of the input. **Say so if you present it** — claiming otherwise is a correctness error an interviewer will probe." } },

  { h: "The two-string family" },
  { code: { lang: "python", t: "Edit distance, and its relatives",
    lines: [
     { c: "def edit_distance(a, b):", w: "" },
     { c: "    m, n = len(a), len(b)", w: "" },
     { c: "    dp = [[0] * (n + 1) for _ in range(m + 1)]", w: "**(m+1) x (n+1) — the extra row and column are the empty prefixes.**", hi: true },
     { c: "", w: "" },
     { c: "    for i in range(m + 1): dp[i][0] = i", w: "**Turning a prefix into '' costs i deletions.**" },
     { c: "    for j in range(n + 1): dp[0][j] = j", w: "**And j insertions the other way.**" },
     { c: "", w: "" },
     { c: "    for i in range(1, m + 1):", w: "" },
     { c: "        for j in range(1, n + 1):", w: "" },
     { c: "            if a[i - 1] == b[j - 1]:", w: "**Careful: dp index i, string index i-1.**", hi: true },
     { c: "                dp[i][j] = dp[i - 1][j - 1]", w: "**Match — nothing to pay.**" },
     { c: "            else:", w: "" },
     { c: "                dp[i][j] = 1 + min(dp[i - 1][j],", w: "**delete**" },
     { c: "                                   dp[i][j - 1],", w: "**insert**" },
     { c: "                                   dp[i - 1][j - 1])", w: "**replace**", hi: true },
     { c: "    return dp[m][n]", w: "**O(m·n).**" }
    ],
    after: "Longest common subsequence, edit distance and *is one string a subsequence of another* are the same table with a different recurrence in the else branch. **Recognising the family is worth more than memorising any single one.**" } },

  { tbl: { t: "The six shapes, and their tells",
    h: ["Shape", "The question sounds like", "State"],
    rows: [
     ["**0/1 knapsack**", "*pick some items, capacity limit, maximise*", "dp[capacity] — inner loop **backwards**"],
     ["**Unbounded knapsack**", "*unlimited supply*, *fewest coins*", "dp[amount] — inner loop **forwards**"],
     ["**LIS**", "*longest increasing / chain / envelopes*", "dp[i] = best ending at i"],
     ["**Two strings**", "*edit distance*, *common subsequence*", "dp[i][j] over both prefixes"],
     ["**Grid paths**", "*count paths*, *minimum path sum*", "dp[r][c] from the top-left"],
     ["**Interval / partition**", "*burst balloons*, *matrix chain*", "dp[i][j] over a range, split at k"]
    ] } },

  { h: "Space reduction, when they ask" },
  { p: "**If dp[i][...] only reads dp[i-1][...], you need two rows, not m.** State this trade-off even if you do not implement it — it is a standard follow-up." },

  { code: { lang: "python", t: "Two rows instead of a full table",
    lines: [
     { c: "prev = [0] * (n + 1)", w: "" },
     { c: "for i in range(1, m + 1):", w: "" },
     { c: "    cur = [0] * (n + 1)", w: "" },
     { c: "    cur[0] = i", w: "" },
     { c: "    for j in range(1, n + 1):", w: "" },
     { c: "        cur[j] = prev[j - 1] if a[i-1] == b[j-1] else 1 + min(prev[j], cur[j-1], prev[j-1])", w: "" },
     { c: "    prev = cur", w: "**O(n) space instead of O(m·n).**", hi: true },
     { c: "", w: "" },
     { c: "# NOTE: you lose the ability to reconstruct the actual edit sequence", w: "**Mention this trade-off.**", hi: true }
    ] } },

  { tryit: { t: "Name the shape, then solve",
    task: "Identify which of the six shapes each is before writing code.\n\n1. Given coin denominations, count the number of ways to make an amount\n2. Given box dimensions, find the longest chain where each fits inside the next\n3. Partition an array into two subsets with equal sums\n4. Minimum path sum from the top-left to the bottom-right of a grid",
    hint: "1 and 3 are both knapsack — one unbounded, one 0/1. 2 is LIS after a sort. 4 is the grid shape.",
    sol: { lang: "python", code: "# 1. UNBOUNDED knapsack, counting -- coins OUTSIDE for combinations\ndef change(amount, coins):\n    dp = [1] + [0] * amount\n    for coin in coins:                    # outer loop = combinations\n        for c in range(coin, amount + 1):\n            dp[c] += dp[c - coin]\n    return dp[amount]\n\n# 2. LIS after sorting -- the classic 'Russian doll envelopes'\nimport bisect\ndef max_envelopes(envs):\n    # width ascending; for EQUAL widths, height DESCENDING so that\n    # two envelopes of the same width can never nest\n    envs.sort(key=lambda e: (e[0], -e[1]))\n    tails = []\n    for _, h in envs:\n        i = bisect.bisect_left(tails, h)\n        if i == len(tails): tails.append(h)\n        else:               tails[i] = h\n    return len(tails)\n\n# 3. 0/1 knapsack as a subset-sum feasibility question\ndef can_partition(nums):\n    total = sum(nums)\n    if total % 2:\n        return False                      # odd total can never split evenly\n    target = total // 2\n    dp = [True] + [False] * target\n    for x in nums:\n        for c in range(target, x - 1, -1): # BACKWARDS -- each item once\n            dp[c] = dp[c] or dp[c - x]\n    return dp[target]\n\n# 4. GRID -- accumulate in place\ndef min_path_sum(grid):\n    rows, cols = len(grid), len(grid[0])\n    for r in range(rows):\n        for c in range(cols):\n            if r == 0 and c == 0:   continue\n            elif r == 0:            grid[r][c] += grid[r][c-1]\n            elif c == 0:            grid[r][c] += grid[r-1][c]\n            else:                   grid[r][c] += min(grid[r-1][c], grid[r][c-1])\n    return grid[-1][-1]" },
    w: "Problem 2 is the one that rewards preparation. **The `-e[1]` in the sort key is the entire problem** — sorting height descending within equal widths makes it impossible for two same-width envelopes to form a chain, which reduces a two-dimensional problem to a one-dimensional LIS. Without it the answer is subtly too large." } },

  { vocab: ["Dynamic Programming", "Memoisation", "Recursion", "Greedy Algorithm", "Space Complexity"] }
 ],
 k: [
  "0/1 knapsack loops the capacity **backwards**; unbounded loops it **forwards**. That one line is the difference.",
  "Coins in the outer loop counts combinations; amount in the outer loop counts permutations.",
  "LIS is O(n²) with `dp[i] = best ending at i`, or O(n log n) with `bisect` — but `tails` is not a real subsequence.",
  "Edit distance, LCS and subsequence checks are one (m+1)×(n+1) table with different else branches.",
  "If row i only reads row i-1, two rows suffice — but you lose the ability to reconstruct the path."
 ],
 r: ["Dynamic Programming", "Memoisation", "Recursion", "Greedy Algorithm"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "for c in range(cap, w - 1, -1):", w: "0/1 knapsack — backwards, each item once" },
   { c: "for c in range(coin, amount + 1):", w: "unbounded — forwards, reuse allowed" },
   { c: "i = bisect.bisect_left(tails, x)", w: "LIS in O(n log n)" },
   { c: "dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])", w: "edit distance — delete, insert, replace" }
  ]
 }
}

]);
