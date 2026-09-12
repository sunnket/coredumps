/* DSA for Interviews — trees, graphs, recursion and DP. */
TD.addLessons("dsa", [

{
 t: "Trees and Graphs — Traversals and When to Use Which",
 m: "trees",
 lvl: "core",
 s: "DFS, BFS, and modelling a problem as a graph when it does not look like one.",
 goal: [
  "Write DFS and BFS from memory in both trees and graphs",
  "Choose between them from what the question asks",
  "Recognise a graph problem that is not phrased as one"
 ],
 b: [
  { p: "Trees and graphs are the largest single block of interview material after arrays. The good news is that almost all of it is two templates and knowing which to reach for." },

  { h: "DFS or BFS" },
  { tbl: { t: "Choose from the question",
    h: ["The question asks", "Use", "Why"],
    rows: [
     ["**Shortest path, unweighted**", "**BFS**", "It reaches nodes in order of distance, so the first arrival is the shortest"],
     ["*level by level*, *by depth*", "**BFS**", "A level is exactly one queue drain"],
     ["*does a path exist*", "Either", "DFS is usually shorter to write"],
     ["*all paths*, *all combinations*", "**DFS / backtracking**", "You need the full path on the stack"],
     ["*tree depth, diameter, subtree sums*", "**DFS**", "Naturally recursive over subtrees"],
     ["*cycle detection*", "DFS", "Track nodes currently on the recursion stack"],
     ["*shortest path, weighted*", "**Dijkstra** — BFS with a heap", "BFS assumes every edge costs the same"]
    ] } },

  { h: "The tree templates" },
  { code: { lang: "python", t: "DFS, three orders",
    lines: [
     { c: "def dfs(node):", w: "" },
     { c: "    if not node:", w: "**The base case first, always.** Missing it is the most common tree bug.", hi: true },
     { c: "        return", w: "" },
     { c: "", w: "" },
     { c: "    # PREORDER: act here -- node before children", w: "**Copying a tree, serialising it.**" },
     { c: "    dfs(node.left)", w: "" },
     { c: "    # INORDER: act here", w: "**On a binary search tree this yields sorted order** — which is the trick behind several problems.", hi: true },
     { c: "    dfs(node.right)", w: "" },
     { c: "    # POSTORDER: act here -- children before node", w: "**When the answer depends on the subtrees**: heights, sums, deletions." }
    ] } },

  { code: { lang: "python", t: "The postorder shape, which solves most tree problems",
    lines: [
     { c: "def max_depth(node):", w: "" },
     { c: "    if not node:", w: "" },
     { c: "        return 0", w: "" },
     { c: "    return 1 + max(max_depth(node.left), max_depth(node.right))", w: "**Ask the children, combine, return.** Almost every tree problem is this shape with a different combine step.", hi: true },
     { c: "", w: "" },
     { c: "# diameter: the same traversal, with a side effect", w: "" },
     { c: "def diameter(root):", w: "" },
     { c: "    best = 0", w: "" },
     { c: "    def depth(node):", w: "" },
     { c: "        nonlocal best", w: "**A closure over the answer.** Cleaner than threading it through returns." },
     { c: "        if not node: return 0", w: "" },
     { c: "        l, r = depth(node.left), depth(node.right)", w: "" },
     { c: "        best = max(best, l + r)", w: "**The path through this node**, recorded on the way back up.", hi: true },
     { c: "        return 1 + max(l, r)", w: "**What the parent needs** — which is different from what you are measuring." },
     { c: "    depth(root)", w: "" },
     { c: "    return best", w: "" }
    ],
    after: "That split — *return one thing to the parent, record another in a closure* — is the key move for a whole family of tree problems: diameter, maximum path sum, longest univalue path. Recognising it saves a great deal of flailing." } },

  { code: { lang: "python", t: "BFS, level by level",
    lines: [
     { c: "from collections import deque", w: "" },
     { c: "", w: "" },
     { c: "def level_order(root):", w: "" },
     { c: "    if not root: return []", w: "" },
     { c: "    out, q = [], deque([root])", w: "" },
     { c: "", w: "" },
     { c: "    while q:", w: "" },
     { c: "        level = []", w: "" },
     { c: "        for _ in range(len(q)):", w: "**Snapshot the length first.** The queue grows inside the loop; without this, levels merge.", hi: true },
     { c: "            node = q.popleft()", w: "" },
     { c: "            level.append(node.val)", w: "" },
     { c: "            if node.left:  q.append(node.left)", w: "" },
     { c: "            if node.right: q.append(node.right)", w: "" },
     { c: "        out.append(level)", w: "" },
     { c: "    return out", w: "" }
    ] } },

  { h: "Graphs" },
  { code: { lang: "python", t: "Both templates, with the guards that matter",
    lines: [
     { c: "from collections import defaultdict, deque", w: "" },
     { c: "", w: "" },
     { c: "graph = defaultdict(list)", w: "**Adjacency list — the standard representation.**" },
     { c: "for a, b in edges:", w: "" },
     { c: "    graph[a].append(b)", w: "" },
     { c: "    graph[b].append(a)", w: "**Both directions if undirected.** Forgetting this is a silent, common bug.", hi: true },
     { c: "", w: "" },
     { c: "# BFS -- shortest path when every edge costs 1", w: "" },
     { c: "def bfs(start, goal):", w: "" },
     { c: "    q, seen = deque([(start, 0)]), {start}", w: "**Mark as seen when you ENQUEUE, not when you dequeue.** Otherwise a node is added many times before being processed.", hi: true },
     { c: "    while q:", w: "" },
     { c: "        node, d = q.popleft()", w: "" },
     { c: "        if node == goal: return d", w: "" },
     { c: "        for nxt in graph[node]:", w: "" },
     { c: "            if nxt not in seen:", w: "" },
     { c: "                seen.add(nxt); q.append((nxt, d + 1))", w: "" },
     { c: "    return -1", w: "" },
     { c: "", w: "" },
     { c: "# DFS -- reachability, components, cycles", w: "" },
     { c: "def dfs(node, seen):", w: "" },
     { c: "    if node in seen: return", w: "**The visited check is what stops infinite loops on a cyclic graph.**", hi: true },
     { c: "    seen.add(node)", w: "" },
     { c: "    for nxt in graph[node]:", w: "" },
     { c: "        dfs(nxt, seen)", w: "" }
    ] } },

  { trap: "Python's default recursion limit is 1,000. A DFS over a graph with 10⁵ nodes — or a degenerate linked-list-shaped tree — hits `RecursionError`. Either convert to an iterative DFS with an explicit stack, or say out loud that you would do so in production. Interviewers notice when a candidate mentions this unprompted." },

  { h: "Problems that are graphs in disguise" },
  { tbl: { t: "The disguises",
    h: ["Looks like", "Is", "Nodes and edges"],
    rows: [
     ["**A grid or maze**", "A graph", "Each cell is a node; edges to its four neighbours"],
     ["**Course prerequisites**", "A directed graph", "**Topological sort.** A cycle means it is impossible"],
     ["**Word ladder**", "A graph", "Words are nodes; edges join words one letter apart"],
     ["**Currency conversion**", "A weighted graph", "Currencies are nodes; rates are edge weights"],
     ["**Friend circles / islands**", "Connected components", "DFS or union-find from each unvisited node"],
     ["**Task scheduling with dependencies**", "A DAG", "Topological sort again"]
    ] } },

  { code: { lang: "python", t: "Grid BFS — the most common form",
    lines: [
     { c: "def shortest_grid(grid, start, goal):", w: "" },
     { c: "    R, C = len(grid), len(grid[0])", w: "" },
     { c: "    q, seen = deque([(start, 0)]), {start}", w: "" },
     { c: "", w: "" },
     { c: "    while q:", w: "" },
     { c: "        (r, c), d = q.popleft()", w: "" },
     { c: "        if (r, c) == goal: return d", w: "" },
     { c: "", w: "" },
     { c: "        for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):", w: "**The four directions as a tuple of tuples.** Add the diagonals if the problem allows them — read the statement carefully.", hi: true },
     { c: "            nr, nc = r + dr, c + dc", w: "" },
     { c: "            if (0 <= nr < R and 0 <= nc < C", w: "**Bounds first**, before indexing." },
     { c: "                    and grid[nr][nc] != '#'", w: "**Then walkability.**" },
     { c: "                    and (nr, nc) not in seen):", w: "**Then visited.** All three, in that order.", hi: true },
     { c: "                seen.add((nr, nc)); q.append(((nr, nc), d + 1))", w: "" },
     { c: "    return -1", w: "" }
    ] } },

  { tryit: { t: "Model four problems as graphs",
    task: "For each, state the nodes, the edges, and whether you would use BFS or DFS.\n\n1. Number of islands in a grid of land and water\n2. Can all courses be finished given prerequisites\n3. Fewest single-letter changes from one word to another\n4. Rotting oranges — how long until every orange rots",
    hint: "4 is a multi-source BFS, which is worth knowing: seed the queue with every starting point rather than one.",
    sol: { lang: "python", code: "# 1. nodes = land cells, edges = adjacency.\n#    DFS from each unvisited land cell; count how many times\n#    you start. Sinking visited land avoids a seen set.\n\n# 2. nodes = courses, edges = prerequisite -> course.\n#    Topological sort (Kahn's). If you cannot place every\n#    course, there is a cycle.\ndef can_finish(n, prereqs):\n    from collections import defaultdict, deque\n    g, indeg = defaultdict(list), [0] * n\n    for course, pre in prereqs:\n        g[pre].append(course); indeg[course] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)\n    done = 0\n    while q:\n        c = q.popleft(); done += 1\n        for nxt in g[c]:\n            indeg[nxt] -= 1\n            if indeg[nxt] == 0: q.append(nxt)\n    return done == n\n\n# 3. nodes = words, edges = one-letter differences.\n#    BFS, because it asks for the FEWEST changes.\n\n# 4. MULTI-SOURCE BFS -- seed the queue with EVERY rotten\n#    orange at time 0, then expand. The answer is the last\n#    depth reached.\ndef oranges_rotting(grid):\n    from collections import deque\n    R, C = len(grid), len(grid[0])\n    q = deque((r, c, 0) for r in range(R) for c in range(C)\n              if grid[r][c] == 2)\n    fresh = sum(row.count(1) for row in grid)\n    t = 0\n    while q:\n        r, c, t = q.popleft()\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n            nr, nc = r+dr, c+dc\n            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:\n                grid[nr][nc] = 2; fresh -= 1\n                q.append((nr, nc, t+1))\n    return t if fresh == 0 else -1" },
    w: "Multi-source BFS in problem 4 is the one worth remembering. Seeding the queue with every source at distance zero gives you *distance to the nearest source* for every cell in one pass — and it turns several problems that look hard into the standard template with a different starting condition." } },

  { vocab: ["Tree", "Graph", "Breadth-First Search", "Depth-First Search", "Topological Sort", "Binary Search Tree"] }
 ],
 k: [
  "BFS for shortest paths and levels; DFS for all-paths, subtree values and cycles.",
  "Most tree problems are: ask the children, combine, return — with the answer sometimes recorded in a closure.",
  "In BFS mark nodes seen when enqueuing, not when dequeuing.",
  "Grids, prerequisites, word ladders and friend circles are all graphs in disguise.",
  "Python's recursion limit is 1,000 — say so, and use an explicit stack for large graphs."
 ],
 r: ["Tree", "Graph", "Breadth-First Search", "Depth-First Search", "Binary Search Tree", "Queue"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "return 1 + max(depth(node.left), depth(node.right))", w: "ask the children, combine, return" },
   { c: "for _ in range(len(q)):", w: "snapshot the level before draining it" },
   { c: "seen.add(nxt); q.append((nxt, d + 1))", w: "mark seen on enqueue, not on dequeue" },
   { c: "for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):", w: "the four grid directions" },
   { c: "q = deque(sources); # all at distance 0", w: "multi-source BFS" }
  ]
 }
},

{
 t: "Recursion and Dynamic Programming",
 m: "dp",
 lvl: "intermediate",
 s: "Recursion you can trust, memoisation, and the small set of DP shapes that keep reappearing.",
 goal: [
  "Write recursion by trusting the recursive call rather than tracing it",
  "Convert a recursion into a memoised solution mechanically",
  "Recognise the four DP shapes that cover most interview questions"
 ],
 b: [
  { p: "DP is the topic people fear most and it is more mechanical than it looks. There is a reliable procedure: write the brute-force recursion, add memoisation, and convert to a table if asked. The creative part is only the first step." },

  { h: "Trust the recursion" },
  { p: "The mistake is trying to trace the calls in your head. You cannot, past depth three. The working method is to assume the recursive call is already correct and only get the current level right." },

  { code: { lang: "python", t: "Three questions, every time",
    lines: [
     { c: "def solve(state):", w: "" },
     { c: "    # 1. BASE CASE: which state is trivially answerable?", w: "" },
     { c: "    if is_base(state):", w: "" },
     { c: "        return trivial_answer", w: "**Write this first, always.**", hi: true },
     { c: "", w: "" },
     { c: "    # 2. RECURSE: assume this returns the right answer", w: "" },
     { c: "    sub = solve(smaller(state))", w: "**Do not trace it. Assume it works.**", hi: true },
     { c: "", w: "" },
     { c: "    # 3. COMBINE: given the sub-answer, what is mine?", w: "" },
     { c: "    return combine(state, sub)", w: "" }
    ],
    after: "If the base case is right and the combine step is right, the whole thing is right — that is what induction guarantees. Tracing is for debugging, never for writing." } },

  { h: "From recursion to DP in one line" },
  { code: { lang: "python", t: "The mechanical conversion",
    lines: [
     { c: "# 1. brute force -- exponential, correct", w: "" },
     { c: "def fib(n):", w: "" },
     { c: "    if n <= 1: return n", w: "" },
     { c: "    return fib(n-1) + fib(n-2)", w: "**O(2ⁿ).** fib(40) takes about a second; fib(50) takes minutes." },
     { c: "", w: "" },
     { c: "# 2. memoised -- one decorator", w: "" },
     { c: "from functools import cache", w: "" },
     { c: "", w: "" },
     { c: "@cache", w: "**That is the entire change.** Repeated states are computed once.", hi: true },
     { c: "def fib(n):", w: "" },
     { c: "    if n <= 1: return n", w: "" },
     { c: "    return fib(n-1) + fib(n-2)", w: "**Now O(n).** fib(500) is instant." },
     { c: "", w: "" },
     { c: "# 3. tabulated -- bottom up, O(1) space", w: "" },
     { c: "def fib(n):", w: "" },
     { c: "    a, b = 0, 1", w: "" },
     { c: "    for _ in range(n):", w: "" },
     { c: "        a, b = b, a + b", w: "**No recursion, no stack, constant space.**" },
     { c: "    return a", w: "" }
    ] } },

  { n: "In an interview, write the recursion, then add `@cache` and state the new complexity. That demonstrates you understand *why* it is faster rather than having memorised a table-filling loop. Convert to tabulation only if asked, or if recursion depth would be a problem.",
    nt: "The order to present it" },

  { h: "What makes a problem DP" },
  { l: [
   "**Overlapping subproblems.** The same sub-question is asked repeatedly. Without this, memoisation buys nothing and you have plain recursion.",
   "**Optimal substructure.** The best answer is built from best answers to smaller versions.",
   "**The phrasings**: *count the number of ways*, *minimum cost to*, *maximum value such that*, *can you reach*, *longest subsequence*.",
   "**Not DP**: *find all the actual paths* is backtracking — you need every path, not a count, so nothing can be reused."
  ] },

  { h: "The four shapes" },
  { tbl: { t: "Most DP questions are one of these",
    h: ["Shape", "State", "Examples"],
    rows: [
     ["**1-D over an index**", "`dp[i]` = best answer up to i", "Climbing stairs, house robber, longest increasing subsequence"],
     ["**2-D over two sequences**", "`dp[i][j]` = comparing two strings", "Edit distance, longest common subsequence"],
     ["**Knapsack**", "`dp[i][capacity]`", "Subset sum, coin change, partition equal subset"],
     ["**Interval**", "`dp[i][j]` over a range", "Burst balloons, matrix chain. **The hardest, and the rarest**"]
    ] } },

  { code: { lang: "python", t: "One of each, in the memoised style",
    lines: [
     { c: "# 1-D: house robber -- cannot rob adjacent houses", w: "" },
     { c: "@cache", w: "" },
     { c: "def rob(i):", w: "" },
     { c: "    if i >= len(nums): return 0", w: "" },
     { c: "    return max(nums[i] + rob(i+2), rob(i+1))", w: "**Take this one and skip the next, or skip this one.** The whole problem in one line.", hi: true },
     { c: "", w: "" },
     { c: "# 2-D: edit distance between two strings", w: "" },
     { c: "@cache", w: "" },
     { c: "def edit(i, j):", w: "" },
     { c: "    if i == len(a): return len(b) - j", w: "**Insert the rest.**" },
     { c: "    if j == len(b): return len(a) - i", w: "**Delete the rest.**" },
     { c: "    if a[i] == b[j]: return edit(i+1, j+1)", w: "**Free move.**" },
     { c: "    return 1 + min(edit(i+1, j),", w: "delete" },
     { c: "                   edit(i, j+1),", w: "insert" },
     { c: "                   edit(i+1, j+1))", w: "**replace.** Three choices, take the cheapest.", hi: true },
     { c: "", w: "" },
     { c: "# knapsack: coin change -- fewest coins to make amount", w: "" },
     { c: "@cache", w: "" },
     { c: "def fewest(amount):", w: "" },
     { c: "    if amount == 0: return 0", w: "" },
     { c: "    if amount < 0:  return float('inf')", w: "**An impossible branch.** Using infinity lets `min` discard it naturally.", hi: true },
     { c: "    return 1 + min(fewest(amount - c) for c in coins)", w: "" }
    ] } },

  { trap: "`@cache` requires hashable arguments, so you cannot pass a list. Pass indices into a list held in the enclosing scope, or convert to a tuple. Trying to memoise a function that takes a list raises `TypeError: unhashable type` — a confusing error to meet mid-interview if you have not hit it before." },

  { h: "Backtracking" },
  { p: "When you need *all* the solutions rather than a count or an optimum, DP does not apply — nothing is reusable. Backtracking explores and undoes." },

  { code: { lang: "python", t: "The template",
    lines: [
     { c: "def permutations(nums):", w: "" },
     { c: "    out, path, used = [], [], [False] * len(nums)", w: "" },
     { c: "", w: "" },
     { c: "    def backtrack():", w: "" },
     { c: "        if len(path) == len(nums):", w: "" },
     { c: "            out.append(path[:])", w: "**`path[:]` — a copy.** Appending `path` itself stores a reference that you then mutate, and every result ends up identical. This is the classic backtracking bug.", hi: true },
     { c: "            return", w: "" },
     { c: "", w: "" },
     { c: "        for i, x in enumerate(nums):", w: "" },
     { c: "            if used[i]: continue", w: "" },
     { c: "            used[i] = True; path.append(x)", w: "**Choose.**" },
     { c: "            backtrack()", w: "**Explore.**" },
     { c: "            path.pop(); used[i] = False", w: "**Un-choose.** The line that makes it backtracking.", hi: true },
     { c: "", w: "" },
     { c: "    backtrack()", w: "" },
     { c: "    return out", w: "" }
    ],
    after: "Choose, explore, un-choose. Subsets, permutations, combinations, N-queens, sudoku and word search are all this template with a different validity check." } },

  { h: "Reading the constraint" },
  { p: "The stated n tells you which of these applies, and it is the fastest way to orient yourself in an unfamiliar problem." },
  { l: [
   "**n ≤ 20** — exponential is expected. Backtracking or bitmask DP.",
   "**n ≤ 1,000** — O(n²) DP is fine. This is the classic 2-D DP range.",
   "**n ≤ 10⁵** — O(n) or O(n log n). If it is DP, it must be 1-D with O(1) transitions.",
   "**Two strings, both ≤ 1,000** — almost certainly a 2-D DP over both indices."
  ] },

  { tryit: { t: "Recursion first, then cache",
    task: "For each, write the brute-force recursion, state its complexity, add `@cache`, and state the new complexity.\n\n1. Climbing stairs — 1 or 2 steps at a time, count the ways\n2. Longest common subsequence of two strings\n3. Can an array be partitioned into two equal-sum halves",
    hint: "For 3, the state is (index, remaining target). Note that the target is bounded by half the total sum, which is what makes it tractable.",
    sol: { lang: "python", code: "from functools import cache\n\n# 1. O(2^n) -> O(n)\n@cache\ndef climb(n):\n    if n <= 2: return max(n, 1)\n    return climb(n-1) + climb(n-2)\n\n# 2. O(2^(m+n)) -> O(m*n)\ndef lcs(a, b):\n    @cache\n    def f(i, j):\n        if i == len(a) or j == len(b): return 0\n        if a[i] == b[j]: return 1 + f(i+1, j+1)\n        return max(f(i+1, j), f(i, j+1))\n    return f(0, 0)\n\n# 3. O(2^n) -> O(n * sum)\ndef can_partition(nums):\n    total = sum(nums)\n    if total % 2: return False          # odd total, impossible\n    @cache\n    def f(i, remaining):\n        if remaining == 0: return True\n        if i == len(nums) or remaining < 0: return False\n        return f(i+1, remaining - nums[i]) or f(i+1, remaining)\n    return f(0, total // 2)              # take it, or skip it" },
    w: "Notice that all three have the same shape: a base case, a branching choice, and a combine. The `@cache` line is identical in each. Once you see DP as *recursion with the repeated work removed* rather than as a distinct technique with its own table-filling ritual, the topic gets substantially smaller." } },

  { vocab: ["Recursion", "Dynamic Programming", "Memoisation", "Backtracking", "Time Complexity"] }
 ],
 k: [
  "Write recursion by trusting the recursive call: base case, recurse, combine.",
  "DP is recursion plus memoisation — `@cache` is often the entire optimisation.",
  "Overlapping subproblems plus optimal substructure means DP; *find all solutions* means backtracking.",
  "Four shapes cover most questions: 1-D over an index, 2-D over two sequences, knapsack, interval.",
  "In backtracking, append a copy of the path and always un-choose after exploring."
 ],
 r: ["Recursion", "Dynamic Programming", "Memoisation", "Backtracking", "Big-O Notation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "from functools import cache; @cache", w: "turn exponential recursion into polynomial DP" },
   { c: "return max(nums[i] + rob(i+2), rob(i+1))", w: "take it or skip it — the 1-D DP shape" },
   { c: "out.append(path[:])", w: "append a copy, or every result is the same list" },
   { c: "path.pop(); used[i] = False", w: "un-choose — the line that makes it backtracking" }
  ]
 }
},

{
 t: "Performing in the Room",
 m: "room",
 lvl: "core",
 s: "The forty-five minutes, minute by minute — and how to recover when you go blank.",
 goal: [
  "Run the six-step method that structures any interview problem",
  "Think aloud in a way that earns marks",
  "Recover from being stuck without losing the interview"
 ],
 b: [
  { p: "Two candidates with identical knowledge routinely get different outcomes, and the difference is almost entirely process. The interviewer cannot see your thinking; they can only hear it. Your job is to make it audible." },

  { h: "The six steps" },
  { tbl: { t: "How to spend forty-five minutes",
    h: ["Step", "Time", "What you say"],
    rows: [
     ["**1. Clarify**", "2–3 min", "*Can the input be empty? Are values unique? How large is n? Sorted?*"],
     ["**2. Example**", "2 min", "*Let me work through a small case by hand to make sure I have it.*"],
     ["**3. Brute force**", "3 min", "*The obvious approach is X, which is O(n²). Let me see if I can do better.*"],
     ["**4. Optimise**", "5–10 min", "*The repeated work is the inner scan. A hash map turns that into O(1)…*"],
     ["**5. Code**", "15 min", "**Narrate as you go.** Silence is the enemy"],
     ["**6. Test**", "5 min", "**Walk through your own code with the example**, plus edge cases"]
    ] } },

  { n: "Step 6 is where candidates most often leave marks behind. Finishing the code and saying *done* invites the interviewer to find your bug. Walking through it yourself, finding the bug yourself, and fixing it is a *better* outcome than code that happened to be right — it demonstrates the thing they are actually assessing.",
    nt: "Never say 'done'" },

  { h: "Clarifying questions that are worth asking" },
  { l: [
   "**What is the maximum size of the input?** Tells you the expected complexity, and shows you think about it.",
   "**Can the input be empty or null?** The most common edge case.",
   "**Are the values unique? Sorted? Can they be negative?** Each changes the approach.",
   "**What should I return if there is no answer?** Prevents an assumption that costs you at the end.",
   "**Can I modify the input?** Decides whether in-place is allowed, which changes the space complexity."
  ] },

  { p: "Two or three of these, not all five. The point is to demonstrate that you establish requirements before building, and to catch a misunderstanding before you have written thirty lines against it." },

  { h: "Thinking aloud, usefully" },
  { vs: { t: "Two ways to narrate the same thinking", lang: "text",
    bad: { c: "\"Hmm.\"\n\n(silence for 90 seconds)\n\n\"So... maybe a loop?\"\n\n(silence)\n\n\"Actually no.\"\n\n(typing)", label: "What nervous candidates do",
      w: "The interviewer has no idea whether you are close or lost, so they cannot give you a hint, and they have nothing to score. Long silence reads as being stuck even when you are thinking productively." },
    good: { c: "\"The brute force is comparing every\npair -- O(n^2). The repeated work\nis re-scanning for the complement.\n\nAnything where I ask 'have I seen\nthis' is a hash map. So one pass,\nstoring each value as I go, and\nchecking for target minus x.\n\nThat is O(n) time, O(n) space --\nI'm trading space for time. Shall\nI code that?\"", label: "What gets hired",
      w: "Every sentence is scoreable. The interviewer knows exactly where you are, can nudge you if you drift, and has heard complexity analysis and a trade-off articulated without being asked." } } },

  { h: "When you go blank" },
  { ol: [
   "**Say so, calmly.** *I'm not seeing the optimisation yet — let me think about what work is being repeated.* This is a normal engineering sentence, not an admission of failure.",
   "**Return to a concrete example.** Work a small case by hand. Patterns appear in specifics far more readily than in the abstract.",
   "**Go through your patterns aloud.** *Is it sorted? Then two pointers. Is it a contiguous range? Then a window.* The interviewer hears a method rather than a blank.",
   "**Ask for a hint.** *Am I on the right track thinking about a hash map here?* Taking a hint well is explicitly on most rubrics. Refusing one and running out of time is not.",
   "**Write the brute force.** A working O(n²) solution scores far more than an incomplete O(n) one. Get something correct on the board, then optimise if time allows."
  ] },

  { trap: "The worst outcome is not failing to optimise — it is producing nothing. An interviewer can pass a candidate who wrote a clean brute force, analysed it correctly, and explained the direction of the optimisation without finishing it. They cannot pass a blank screen, however good the thinking behind it was." },

  { h: "Coding well under observation" },
  { l: [
   "**Names that read**: `left`, `right`, `seen`, `count`. Not `i`, `j`, `k`, `tmp`, `x2`.",
   "**Helper functions** if it gets long. Structure is being assessed.",
   "**Handle the edge case first**: `if not nums: return []`. Say why as you write it.",
   "**Do not optimise prematurely.** Get it correct, then improve.",
   "**If you notice a bug, say it and fix it.** Do not quietly hope nobody saw."
  ] },

  { h: "Testing your own code" },
  { code: { lang: "text", t: "What to say in the last five minutes",
    lines: [
     { c: "\"Let me trace through with [2, 7, 11, 15], target 9.\"" },
     { c: "" },
     { c: "\"i=0, x=2. need = 7. seen is empty, so no match." },
     { c: " Store seen[2] = 0.\"" },
     { c: "" },
     { c: "\"i=1, x=7. need = 2. 2 IS in seen, at index 0." },
     { c: " Return [0, 1]. Correct.\"" },
     { c: "" },
     { c: "\"Now the edge cases:\"" },
     { c: "  empty array        -> the loop never runs, returns None", hi: true },
     { c: "  no valid pair      -> same, returns None" },
     { c: "  duplicate values   -> works, because I check before storing" },
     { c: "  negative numbers   -> fine, no assumption about sign" },
     { c: "" },
     { c: "\"One thing: the spec didn't say what to return when" },
     { c: " there's no answer. I'm returning None -- should that" },
     { c: " be an empty list instead?\"", hi: true }
    ],
    after: "That last question is worth real marks. It shows you noticed an underspecified requirement, made a decision, and flagged it rather than hiding it." } },

  { h: "Before and after" },
  { l: [
   "**The day before**: no new problems. Review your pattern log, sleep properly. Cramming a new technique the night before helps nobody.",
   "**Set up early**: test the video call, the editor, the camera. Technical trouble in the first five minutes costs you composure you will not get back.",
   "**Have water and paper.** Drawing a tree or a grid by hand is genuinely useful, and it is allowed.",
   "**Afterwards, write down every question you were asked**, while it is fresh. Questions repeat, within a company and across the market.",
   "**Ask about the team and the work** at the end. It is an interview in both directions, and interest is noticed."
  ] },

  { n: "You will fail some of these. Everyone does — strong engineers fail interviews at companies that later hire them. A rejection is a data point about one forty-five minute sample of your ability under artificial conditions, not a verdict. Note what went wrong, practise that specifically, and book the next one.",
    nt: "The thing worth remembering" },

  { tryit: { t: "Run the full method, out loud, recorded",
    task: "Pick a medium problem you have not seen. Record yourself solving it aloud in 45 minutes, running all six steps. Then watch it back and count: seconds of silence longer than 15, times you stated a complexity, and whether you tested your own code before declaring finished.",
    hint: "Watching yourself is uncomfortable and it is the fastest feedback available. Most people discover they narrate far less than they thought.",
    sol: { lang: "text", code: "What to look for on the recording:\n\n  [ ] Did you ask about input size in the first two minutes?\n  [ ] Did you work a concrete example BEFORE coding?\n  [ ] Did you state the brute force and its complexity,\n      even though you knew the better answer?\n  [ ] Any silence longer than 15 seconds?\n  [ ] Did you state time AND space complexity unprompted?\n  [ ] Did you test your own code, or say 'done'?\n  [ ] Did you notice any underspecified requirement?\n\nMost first recordings score 2 or 3 out of 7. That is normal,\nand every one of them is a rehearsable habit rather than a\nknowledge gap -- which is why this is the highest-return\nhour of interview preparation available." },
    w: "The gap between what you know and what the interviewer observes is almost entirely this. Three recorded run-throughs will move you further than another twenty problems solved silently, and it is the part of preparation that almost nobody does." } },

  { vocab: ["Algorithm", "Time Complexity"] }
 ],
 k: [
  "Six steps: clarify, example, brute force, optimise, code, test — and never say *done*.",
  "Ask about input size early; it tells you the expected complexity and shows you think about it.",
  "Narrate continuously. Silence is unscoreable and reads as being stuck.",
  "Taking a hint well is on the rubric; running out of time in silence is not.",
  "A clean, analysed brute force beats an unfinished optimal solution every time."
 ],
 r: ["Algorithm", "Time Complexity", "Big-O Notation"]
}

]);
