/* DSA for Interviews — the graph material the single traversals lesson does
   not have room for: grids as graphs, topological order, weighted shortest
   paths, and union-find. */
TD.addLessons("dsa", [

{
 t: "Grids Are Graphs — Flood Fill, Islands and Multi-Source BFS",
 m: "trees",
 lvl: "intermediate",
 s: "The most common graph question does not look like a graph at all. It looks like a matrix.",
 goal: [
  "Traverse a grid without writing index bugs",
  "Choose DFS or BFS for a grid problem from what is being asked",
  "Apply multi-source BFS to spread-from-many-origins questions"
 ],
 b: [
  { p: "A large share of graph questions are phrased as grids: islands, rotting oranges, maze shortest paths, surrounded regions. **Every cell is a node and its neighbours are the edges** — once you see that, the templates you already know apply unchanged." },

  { h: "The traversal skeleton" },
  { code: { lang: "python", t: "The four-direction pattern, written once",
    lines: [
     { c: "DIRS = ((1, 0), (-1, 0), (0, 1), (0, -1))", w: "**Write this once at the top.** Four separate if-statements is where index bugs live.", hi: true },
     { c: "", w: "" },
     { c: "def neighbours(r, c, grid):", w: "" },
     { c: "    for dr, dc in DIRS:", w: "" },
     { c: "        nr, nc = r + dr, c + dc", w: "" },
     { c: "        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):", w: "**Bounds first, always** — before touching `grid[nr][nc]`.", hi: true },
     { c: "            yield nr, nc", w: "" },
     { c: "", w: "" },
     { c: "# eight directions, when diagonals count:", w: "" },
     { c: "DIRS8 = [(a, b) for a in (-1,0,1) for b in (-1,0,1) if (a, b) != (0, 0)]", w: "**Ask which one the problem means.** It changes the answer." }
    ],
    after: "Two habits that remove most grid bugs: check bounds **before** indexing, and use `len(grid)` for rows and `len(grid[0])` for columns rather than a single `n`. **Non-square grids are a favourite way to catch people out.**" } },

  { h: "Counting islands" },
  { code: { lang: "python", t: "Count connected components",
    lines: [
     { c: "def num_islands(grid):", w: "" },
     { c: "    if not grid: return 0", w: "" },
     { c: "    rows, cols = len(grid), len(grid[0])", w: "" },
     { c: "    count = 0", w: "" },
     { c: "", w: "" },
     { c: "    def sink(r, c):", w: "**DFS that erases as it goes.**" },
     { c: "        if not (0 <= r < rows and 0 <= c < cols): return", w: "" },
     { c: "        if grid[r][c] != '1': return", w: "**Water, or already visited.**" },
     { c: "        grid[r][c] = '0'", w: "**Mark ON ENTRY, not on exit.** This is the whole visited-set.", hi: true },
     { c: "        for dr, dc in DIRS:", w: "" },
     { c: "            sink(r + dr, c + dc)", w: "" },
     { c: "", w: "" },
     { c: "    for r in range(rows):", w: "" },
     { c: "        for c in range(cols):", w: "" },
     { c: "            if grid[r][c] == '1':", w: "" },
     { c: "                count += 1", w: "**A cell not yet reached starts a new island.**", hi: true },
     { c: "                sink(r, c)", w: "**Then erase the whole island so it is counted once.**" },
     { c: "    return count", w: "**O(rows x cols)** — every cell is visited once." }
    ],
    after: "Overwriting the grid uses O(1) extra space instead of an O(rc) visited set. **Say that you are mutating the input and offer to use a separate set if that is unacceptable** — it is a real trade-off and interviewers like hearing it named." } },

  { trap: "Marking a cell visited *after* recursing into it, rather than on entry, causes infinite recursion — two adjacent land cells each keep re-entering the other. **Mark on entry, before the loop over neighbours.**" },

  { h: "Multi-source BFS" },
  { p: "**When something spreads from several starting points at once, put every source in the queue before the loop begins.** This is the pattern people most often miss, and it converts an apparently O(n·m) problem into a single traversal." },

  { code: { lang: "python", t: "Rotting oranges — minutes until all rot",
    lines: [
     { c: "from collections import deque", w: "" },
     { c: "", w: "" },
     { c: "def oranges_rotting(grid):", w: "" },
     { c: "    q, fresh = deque(), 0", w: "" },
     { c: "    for r in range(len(grid)):", w: "" },
     { c: "        for c in range(len(grid[0])):", w: "" },
     { c: "            if grid[r][c] == 2: q.append((r, c))", w: "**EVERY rotten orange goes in first.**", hi: true },
     { c: "            elif grid[r][c] == 1: fresh += 1", w: "**Count what must be reached.**" },
     { c: "", w: "" },
     { c: "    minutes = 0", w: "" },
     { c: "    while q and fresh:", w: "**Stop early once nothing fresh remains.**" },
     { c: "        for _ in range(len(q)):", w: "**Snapshot the size — process exactly one level.**", hi: true },
     { c: "            r, c = q.popleft()", w: "" },
     { c: "            for nr, nc in neighbours(r, c, grid):", w: "" },
     { c: "                if grid[nr][nc] == 1:", w: "" },
     { c: "                    grid[nr][nc] = 2", w: "**Mark immediately on enqueue.**", hi: true },
     { c: "                    fresh -= 1", w: "" },
     { c: "                    q.append((nr, nc))", w: "" },
     { c: "        minutes += 1", w: "**One minute per level.**" },
     { c: "", w: "" },
     { c: "    return -1 if fresh else minutes", w: "**Unreachable fresh oranges mean impossible.**", hi: true }
    ],
    after: "`for _ in range(len(q))` is the level-by-level idiom and it appears everywhere — level-order tree traversal, word ladder, shortest path in an unweighted graph. **Capturing the length before the loop is essential**, because the queue grows while you iterate." } },

  { tbl: { t: "DFS or BFS, for a grid",
    h: ["The question asks", "Use", "Because"],
    rows: [
     ["*how many islands*, *area of*, *is it connected*", "**DFS**", "You only need to reach everything, not in any order"],
     ["**\"fewest steps\", \"shortest path\", \"minimum minutes\"**", "**BFS**", "**BFS finds the shortest path in an unweighted graph. DFS does not.**"],
     ["*spreads from all sources at once*", "**Multi-source BFS**", "Seed the queue with every source before starting"],
     ["*every path*, *all combinations*", "**DFS with backtracking**", "You must undo the mark to explore other routes"]
    ] } },

  { n: "**DFS gives you a path, never the shortest one.** If the words *shortest*, *fewest* or *minimum* appear and the edges are unweighted, BFS is not one option among several — it is the answer. Reaching for DFS there is a common and costly mistake.",
    nt: "The rule that decides most grid questions" },

  { tryit: { t: "Four grid problems",
    task: "Say DFS, BFS or multi-source BFS before writing each.\n\n1. Find the largest island's area\n2. Fewest moves for a knight to reach a target square\n3. Given a grid of land and water, find each land cell's distance to the nearest water\n4. Capture all regions of 'O' fully surrounded by 'X'",
    hint: "3 is multi-source from every water cell. 4 is easier inverted — mark what is reachable from the border and flip the rest.",
    sol: { lang: "python", code: "from collections import deque\nDIRS = ((1,0), (-1,0), (0,1), (0,-1))\n\n# 1. DFS -- area is just a count returned up the recursion\ndef max_area(grid):\n    rows, cols = len(grid), len(grid[0])\n    def dfs(r, c):\n        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:\n            return 0\n        grid[r][c] = 0\n        return 1 + sum(dfs(r + dr, c + dc) for dr, dc in DIRS)\n    return max((dfs(r, c) for r in range(rows) for c in range(cols)), default=0)\n\n# 2. BFS -- 'fewest moves' is always BFS\nKNIGHT = ((2,1),(2,-1),(-2,1),(-2,-1),(1,2),(1,-2),(-1,2),(-1,-2))\ndef knight_moves(n, start, target):\n    q, seen, steps = deque([start]), {start}, 0\n    while q:\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            if (r, c) == target:\n                return steps\n            for dr, dc in KNIGHT:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen:\n                    seen.add((nr, nc)); q.append((nr, nc))\n        steps += 1\n    return -1\n\n# 3. MULTI-SOURCE BFS -- every water cell is a source, distance 0\ndef nearest_water(grid):\n    rows, cols = len(grid), len(grid[0])\n    dist = [[-1] * cols for _ in range(rows)]\n    q = deque()\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 0:            # water\n                dist[r][c] = 0\n                q.append((r, c))\n    while q:\n        r, c = q.popleft()\n        for dr, dc in DIRS:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] == -1:\n                dist[nr][nc] = dist[r][c] + 1\n                q.append((nr, nc))\n    return dist\n\n# 4. INVERT IT -- anything touching the border is safe\ndef solve(board):\n    if not board: return\n    rows, cols = len(board), len(board[0])\n    def mark(r, c):\n        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != 'O':\n            return\n        board[r][c] = '#'                  # reachable from the border\n        for dr, dc in DIRS:\n            mark(r + dr, c + dc)\n    for r in range(rows):\n        mark(r, 0); mark(r, cols - 1)\n    for c in range(cols):\n        mark(0, c); mark(rows - 1, c)\n    for r in range(rows):\n        for c in range(cols):\n            board[r][c] = 'O' if board[r][c] == '#' else 'X'" },
    w: "Problem 4 is the one worth remembering. Asking *which regions are surrounded* is hard; asking *which regions touch the border* is easy, and the answer is everything else. **When a condition is awkward to test directly, try testing its opposite** — that inversion is a reusable move, not a one-off trick." } },

  { vocab: ["Graph", "Breadth-First Search", "Depth-First Search", "Queue", "Matrix"] }
 ],
 k: [
  "A grid is a graph: cells are nodes, adjacency is edges. Define `DIRS` once and check bounds before indexing.",
  "Mark a cell visited on entry, never after recursing — marking late causes infinite recursion.",
  "*Shortest*, *fewest* or *minimum* on unweighted edges means BFS. DFS finds a path, not the shortest one.",
  "Multi-source BFS: enqueue every source before the loop, and the level count is the answer.",
  "`for _ in range(len(q))` processes exactly one BFS level — snapshot the length before iterating."
 ],
 r: ["Graph", "Breadth-First Search", "Depth-First Search", "Graph Traversal"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "DIRS = ((1,0), (-1,0), (0,1), (0,-1))", w: "four neighbours, written once" },
   { c: "if 0 <= nr < rows and 0 <= nc < cols:", w: "bounds before indexing" },
   { c: "for _ in range(len(q)):", w: "one BFS level at a time" },
   { c: "grid[r][c] = '0'", w: "mark on entry — the visited set, for free" }
  ]
 }
},

{
 t: "Topological Sort and Cycle Detection",
 m: "trees",
 lvl: "intermediate",
 s: "Course schedules, build orders and dependency resolution — one algorithm, and the cycle check comes free.",
 goal: [
  "Recognise a dependency problem from its wording",
  "Implement Kahn's algorithm and read a cycle from its output",
  "Detect a cycle in a directed graph with three-colour DFS"
 ],
 b: [
  { p: "**Whenever the question involves prerequisites, dependencies, build order or *must come before*, it is a topological sort.** The wording is unusually reliable, and the algorithm is short." },

  { h: "Kahn's algorithm: repeatedly take what has no dependencies" },
  { code: { lang: "python", t: "Course schedule, in full",
    lines: [
     { c: "from collections import deque, defaultdict", w: "" },
     { c: "", w: "" },
     { c: "def course_order(n, prereqs):", w: "**prereqs: [course, needs_first]**" },
     { c: "    graph = defaultdict(list)", w: "" },
     { c: "    indeg = [0] * n", w: "**How many prerequisites each course still has.**", hi: true },
     { c: "    for course, needs in prereqs:", w: "" },
     { c: "        graph[needs].append(course)", w: "**Edge points FORWARD: finishing `needs` unlocks `course`.**", hi: true },
     { c: "        indeg[course] += 1", w: "" },
     { c: "", w: "" },
     { c: "    q = deque(i for i in range(n) if indeg[i] == 0)", w: "**Everything with no prerequisites can start now.**", hi: true },
     { c: "    order = []", w: "" },
     { c: "", w: "" },
     { c: "    while q:", w: "" },
     { c: "        node = q.popleft()", w: "" },
     { c: "        order.append(node)", w: "" },
     { c: "        for nxt in graph[node]:", w: "" },
     { c: "            indeg[nxt] -= 1", w: "**One prerequisite satisfied.**" },
     { c: "            if indeg[nxt] == 0:", w: "**Its last one — it is now available.**", hi: true },
     { c: "                q.append(nxt)", w: "" },
     { c: "", w: "" },
     { c: "    return order if len(order) == n else []", w: "**Short output means a cycle. The check is free.**", hi: true }
    ],
    after: "**`len(order) == n` is the entire cycle detection.** If some courses never reach in-degree zero they are stuck in a mutual dependency, so *Course Schedule* (can it be done?) and *Course Schedule II* (in what order?) are the same code with a different return." } },

  { n: "Getting the edge direction backwards is the most common bug here, and it produces a plausible-looking wrong order. Fix it by saying the meaning aloud: **an edge from A to B means A must happen first**, so B's in-degree counts the things blocking it.",
    nt: "The bug to guard against" },

  { h: "Cycle detection in a directed graph" },
  { p: "Kahn's gives you cycle detection for free, but the DFS version is worth knowing because it also identifies the cycle. **The key point: a directed graph needs three states, not two.**" },

  { code: { lang: "python", t: "Three-colour DFS",
    lines: [
     { c: "WHITE, GREY, BLACK = 0, 1, 2", w: "**Unvisited / on the current path / fully explored.**", hi: true },
     { c: "", w: "" },
     { c: "def has_cycle(n, graph):", w: "" },
     { c: "    colour = [WHITE] * n", w: "" },
     { c: "", w: "" },
     { c: "    def dfs(u):", w: "" },
     { c: "        colour[u] = GREY", w: "**Now on the current path.**" },
     { c: "        for v in graph[u]:", w: "" },
     { c: "            if colour[v] == GREY:", w: "**A back edge to something still on the stack — a cycle.**", hi: true },
     { c: "                return True", w: "" },
     { c: "            if colour[v] == WHITE and dfs(v):", w: "**BLACK is finished and safe: do not revisit.**", hi: true },
     { c: "                return True", w: "" },
     { c: "        colour[u] = BLACK", w: "**Off the path, fully explored.**", hi: true },
     { c: "        return False", w: "" },
     { c: "", w: "" },
     { c: "    return any(dfs(i) for i in range(n) if colour[i] == WHITE)", w: "**Every component — the graph may be disconnected.**" }
    ],
    after: "Two colours are not enough. Reaching an already-visited node is only a cycle if that node is **on the current path**; reaching a finished node just means two routes converge, which is perfectly legal in a DAG." } },

  { trap: "For an **undirected** graph the rule is different: track the parent and ignore the edge you arrived by, otherwise every single edge looks like a two-node cycle. **Directed graphs use three colours; undirected graphs use a parent check or union-find.**" },

  { tbl: { t: "Recognising it from the wording",
    h: ["The question says", "It is"],
    rows: [
     ["*prerequisites*, *must be taken before*", "**Topological sort**"],
     ["*build order*, *compile order*, *task dependencies*", "**Topological sort**"],
     ["*is it possible to finish*, *can all be completed*", "**Cycle detection** — Kahn's length check"],
     ["*alien dictionary*, *derive the ordering*", "**Topological sort** on inferred edges"],
     ["*deadlock*, *circular dependency*", "**Cycle detection** in a directed graph"]
    ] } },

  { tryit: { t: "Order and cycles",
    task: "1. Given n courses and prerequisite pairs, return any valid order or [] if impossible.\n2. Given an alien alphabet's sorted word list, derive the letter order.\n3. Detect whether an undirected graph contains a cycle.",
    hint: "For 2, compare each adjacent pair of words and take the FIRST differing character — that single comparison is one edge. For 3, remember the parent rule.",
    sol: { lang: "python", code: "from collections import deque, defaultdict\n\n# 1. Kahn's -- see the lesson; the length check is the cycle test\n\n# 2. ALIEN DICTIONARY -- build edges from adjacent word pairs\ndef alien_order(words):\n    graph = defaultdict(set)\n    indeg = {c: 0 for w in words for c in w}\n    for a, b in zip(words, words[1:]):\n        for x, y in zip(a, b):\n            if x != y:\n                if y not in graph[x]:\n                    graph[x].add(y)\n                    indeg[y] += 1\n                break                      # ONLY the first difference\n        else:\n            if len(a) > len(b):\n                return ''                  # 'abc' before 'ab' is invalid\n    q = deque([c for c in indeg if indeg[c] == 0])\n    out = []\n    while q:\n        c = q.popleft()\n        out.append(c)\n        for nxt in graph[c]:\n            indeg[nxt] -= 1\n            if indeg[nxt] == 0:\n                q.append(nxt)\n    return ''.join(out) if len(out) == len(indeg) else ''\n\n# 3. UNDIRECTED -- ignore the edge you came in on\ndef undirected_cycle(n, adj):\n    seen = [False] * n\n    def dfs(u, parent):\n        seen[u] = True\n        for v in adj[u]:\n            if not seen[v]:\n                if dfs(v, u): return True\n            elif v != parent:              # visited, and NOT where we came from\n                return True\n        return False\n    return any(dfs(i, -1) for i in range(n) if not seen[i])" },
    w: "The `break` in problem 2 and the `else` on the for-loop are both essential. **Only the first differing character carries information** — from \"wrf\" before \"wre\" you learn f comes before e and nothing more. The for-else catches the invalid case where a word is a prefix of an earlier one." } },

  { vocab: ["Topological Sort", "Directed Acyclic Graph", "Graph", "Depth-First Search", "Queue"] }
 ],
 k: [
  "*Prerequisites*, *build order*, *must come before* — that wording is a topological sort, almost without exception.",
  "Kahn's: count in-degrees, queue the zeros, decrement as you go. `len(order) == n` is the cycle check.",
  "An edge A→B means A comes first, so B's in-degree counts what blocks it. Reversing this is the usual bug.",
  "Directed cycle detection needs three colours — grey means on the current path, black means finished and safe.",
  "Undirected cycle detection is different: track the parent, or use union-find."
 ],
 r: ["Topological Sort", "Directed Acyclic Graph", "Graph", "Depth-First Search"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "graph[needs].append(course); indeg[course] += 1", w: "edges point forward; in-degree counts blockers" },
   { c: "q = deque(i for i in range(n) if indeg[i] == 0)", w: "start from everything unblocked" },
   { c: "return order if len(order) == n else []", w: "short output means a cycle" },
   { c: "if colour[v] == GREY: return True", w: "back edge to the current path — a cycle" }
  ]
 }
},

{
 t: "Weighted Shortest Paths and Union-Find",
 m: "trees",
 lvl: "advanced",
 s: "Dijkstra when edges have costs, and the structure that answers 'are these connected?' in almost constant time.",
 goal: [
  "Implement Dijkstra with a heap and know when it is invalid",
  "Choose between BFS, Dijkstra and Bellman-Ford from the edge weights",
  "Use union-find for connectivity, cycle detection and grouping"
 ],
 b: [
  { p: "Two tools that separate a candidate who has covered graphs from one who has only done grids. Neither is long to write, and both have a clear trigger." },

  { h: "Dijkstra: BFS with a priority queue" },
  { p: "**BFS finds the shortest path only when every edge costs the same.** Once edges have different weights, the fewest-edges route and the cheapest route stop being the same thing, and you need a heap." },

  { code: { lang: "python", t: "Dijkstra, the version worth memorising",
    lines: [
     { c: "import heapq", w: "" },
     { c: "", w: "" },
     { c: "def dijkstra(n, graph, src):", w: "**graph[u] = [(v, weight), ...]**" },
     { c: "    dist = [float('inf')] * n", w: "" },
     { c: "    dist[src] = 0", w: "" },
     { c: "    pq = [(0, src)]", w: "**(distance, node) — distance FIRST so the heap sorts by it.**", hi: true },
     { c: "", w: "" },
     { c: "    while pq:", w: "" },
     { c: "        d, u = heapq.heappop(pq)", w: "**The closest unfinalised node.**" },
     { c: "        if d > dist[u]:", w: "**A stale entry — we already found something better.**", hi: true },
     { c: "            continue", w: "**This check replaces a decrease-key operation.**" },
     { c: "        for v, w in graph[u]:", w: "" },
     { c: "            nd = d + w", w: "" },
     { c: "            if nd < dist[v]:", w: "**Relaxation: a cheaper route to v.**", hi: true },
     { c: "                dist[v] = nd", w: "" },
     { c: "                heapq.heappush(pq, (nd, v))", w: "**Push the improvement; leave the old entry to be skipped.**" },
     { c: "    return dist", w: "**O((V + E) log V).**" }
    ],
    after: "The `if d > dist[u]: continue` line is what makes this correct with a plain binary heap. Python has no decrease-key, so you push duplicates and ignore the outdated ones — **omitting that check is the most common Dijkstra bug**, and it silently produces wrong answers rather than crashing." } },

  { trap: "**Dijkstra is invalid with negative edge weights.** It finalises a node the moment it is popped, and a negative edge could later have made that route cheaper. If negatives are possible, use Bellman-Ford — O(V·E), and it also detects negative cycles." },

  { tbl: { t: "Choosing a shortest-path algorithm",
    h: ["Edges", "Use", "Cost"],
    rows: [
     ["**All the same weight**", "**BFS**", "O(V + E) — do not reach for Dijkstra here"],
     ["Weights of 0 and 1 only", "**0-1 BFS** with a deque", "O(V + E) — appendleft for 0, append for 1"],
     ["**Positive weights**", "**Dijkstra** + heap", "O((V+E) log V)"],
     ["**Any negative weight**", "**Bellman-Ford**", "O(V·E), and finds negative cycles"],
     ["All pairs, small n (≤ ~500)", "**Floyd-Warshall**", "O(V³), ten lines of code"]
    ] } },

  { h: "Union-Find: connectivity, answered instantly" },
  { p: "**When the question is *are these two in the same group?* or *how many groups are there?*, and especially when edges arrive one at a time, union-find beats re-running a traversal.**" },

  { code: { lang: "python", t: "Union-find with both optimisations",
    lines: [
     { c: "class DSU:", w: "" },
     { c: "    def __init__(self, n):", w: "" },
     { c: "        self.parent = list(range(n))", w: "**Everyone starts as their own root.**" },
     { c: "        self.rank = [0] * n", w: "**Approximate tree height.**" },
     { c: "        self.count = n", w: "**Number of components — often the answer.**", hi: true },
     { c: "", w: "" },
     { c: "    def find(self, x):", w: "" },
     { c: "        while self.parent[x] != x:", w: "" },
     { c: "            self.parent[x] = self.parent[self.parent[x]]", w: "**Path compression — halve the chain on the way up.**", hi: true },
     { c: "            x = self.parent[x]", w: "" },
     { c: "        return x", w: "" },
     { c: "", w: "" },
     { c: "    def union(self, a, b):", w: "" },
     { c: "        ra, rb = self.find(a), self.find(b)", w: "" },
     { c: "        if ra == rb:", w: "" },
     { c: "            return False", w: "**Already together — in an undirected graph this edge closes a cycle.**", hi: true },
     { c: "        if self.rank[ra] < self.rank[rb]:", w: "" },
     { c: "            ra, rb = rb, ra", w: "**Union by rank — hang the shorter tree off the taller.**", hi: true },
     { c: "        self.parent[rb] = ra", w: "" },
     { c: "        if self.rank[ra] == self.rank[rb]:", w: "" },
     { c: "            self.rank[ra] += 1", w: "" },
     { c: "        self.count -= 1", w: "**One fewer component.**" },
     { c: "        return True", w: "" }
    ],
    after: "With both optimisations, operations are **effectively O(1)** — the true bound is the inverse Ackermann function, which is below 5 for any input that fits in the universe. Saying \"amortised near-constant, inverse Ackermann\" is a good line to have ready." } },

  { n: "`union` returning `False` is doing double duty. In an undirected graph, **an edge whose endpoints are already connected must close a cycle**, so cycle detection, counting components and building a minimum spanning tree all fall out of the same return value.",
    nt: "Why the boolean return matters" },

  { tbl: { t: "Union-find or DFS?",
    h: ["Situation", "Use"],
    rows: [
     ["Edges arrive over time, queried as they go", "**Union-find** — DFS would rerun per query"],
     ["*Number of connected components* in a static graph", "Either; DFS is fine"],
     ["*Redundant connection*, cycle in an undirected graph", "**Union-find** — the first union returning False"],
     ["Minimum spanning tree (Kruskal's)", "**Union-find** — sort edges, union what does not cycle"],
     ["*Accounts merge*, *equations divide*, grouping by equivalence", "**Union-find**"],
     ["You need the actual path", "**DFS or BFS** — union-find does not keep paths"]
    ] } },

  { tryit: { t: "Pick the tool",
    task: "1. Cheapest flight from A to B with at most k stops\n2. Given edges added one at a time, find the first that creates a cycle\n3. Network delay: time for a signal from node k to reach every node\n4. Connect all cities at minimum total cost",
    hint: "1 is a constrained shortest path — plain Dijkstra is not quite right. 2 and 4 are union-find. 3 is textbook Dijkstra.",
    sol: { lang: "python", code: "import heapq\nfrom collections import defaultdict\n\n# 1. Dijkstra with an extra state dimension: (cost, node, stops_used)\n#    A node may be worth revisiting with FEWER stops, so the visited rule\n#    tracks stops, not just nodes.\ndef cheapest_flight(n, flights, src, dst, k):\n    graph = defaultdict(list)\n    for u, v, w in flights:\n        graph[u].append((v, w))\n    best_stops = {}\n    pq = [(0, src, 0)]\n    while pq:\n        cost, u, stops = heapq.heappop(pq)\n        if u == dst:\n            return cost\n        if stops > k or best_stops.get(u, 10**9) <= stops:\n            continue\n        best_stops[u] = stops\n        for v, w in graph[u]:\n            heapq.heappush(pq, (cost + w, v, stops + 1))\n    return -1\n\n# 2. UNION-FIND -- the first union that returns False\ndef redundant_connection(edges):\n    dsu = DSU(len(edges) + 1)\n    for a, b in edges:\n        if not dsu.union(a, b):\n            return [a, b]\n\n# 3. DIJKSTRA -- the answer is the maximum finalised distance\ndef network_delay(times, n, k):\n    graph = defaultdict(list)\n    for u, v, w in times:\n        graph[u].append((v, w))\n    dist = dijkstra_from(graph, k, n)\n    worst = max(dist[1:])\n    return -1 if worst == float('inf') else worst\n\n# 4. KRUSKAL -- sort edges, union whatever does not close a cycle\ndef min_cost_connect(n, edges):\n    dsu = DSU(n)\n    total = 0\n    for w, u, v in sorted(edges):\n        if dsu.union(u, v):\n            total += w\n    return total if dsu.count == 1 else -1   # -1 if not all connected" },
    w: "Problem 1 is the instructive one. **Plain Dijkstra fails because a route can be more expensive yet use fewer stops, and therefore still be worth keeping.** Adding the stop count to the state is the fix, and noticing that a constraint changes what \"visited\" means is a genuinely advanced observation." } },

  { vocab: ["Dijkstra's Algorithm", "Union-Find", "Graph", "Heap", "Priority Queue"] }
 ],
 k: [
  "Equal edge weights → BFS. Positive weights → Dijkstra. Any negative weight → Bellman-Ford.",
  "In Dijkstra, push `(distance, node)` and skip stale pops with `if d > dist[u]: continue` — that replaces decrease-key.",
  "Dijkstra is wrong with negative edges because it finalises a node the moment it is popped.",
  "Union-find with path compression and union by rank is effectively O(1) per operation.",
  "`union` returning False means the edge closes a cycle — that single fact gives cycle detection, components and Kruskal's."
 ],
 r: ["Dijkstra's Algorithm", "Union-Find", "Graph", "Heap"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "d, u = heapq.heappop(pq); if d > dist[u]: continue", w: "skip stale heap entries" },
   { c: "if nd < dist[v]: dist[v] = nd; heappush(pq, (nd, v))", w: "relaxation" },
   { c: "self.parent[x] = self.parent[self.parent[x]]", w: "path compression, iteratively" },
   { c: "if ra == rb: return False", w: "already connected — this edge is a cycle" }
  ]
 }
}

]);
