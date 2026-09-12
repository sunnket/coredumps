/* Code Dojo — Graphs, backtracking, heaps, intervals and tries.

   Every solution in this file has been executed and its assertions checked
   before it was written out; see dojo/tools/build.py. Do not hand-edit —
   regenerate with `python tools/emit_termdex.py` from the dojo folder.

   `solution` is the reference the blueprint traces. `context` is the code the
   reader is given rather than typing (a node class, say), and `harness` is the
   scaffolding the listed assertions call. */
(function (TD) {
  "use strict";

  TD.addKata([
    {
      id: "number-of-islands",
      title: "Number of Islands",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Amazon", "Meta", "Google", "Microsoft", "Bloomberg"],
      freq: 5,
      statement: "Given an m x n grid of '1' (land) and '0' (water), count the number of islands. An island is land connected horizontally or vertically, and the grid is surrounded by water on all sides.",
      examples: [
        ["grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", "2", ""],
        ["grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]", "1", ""]
      ],
      constraints: ["1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
      hints: [
        "Every time you find unvisited land, you have discovered a new island.",
        "Flood fill the whole island so you never count it twice.",
        "Overwriting visited land with '0' saves you a separate visited set."
      ],
      approach: "Scan for land; each cell you find that has not been consumed starts a new island. The DFS 'sinks' the island by rewriting every connected cell to '0', so later iterations of the scan walk straight past it. Doing all the bounds and value checks at the top of the recursive function keeps the four calls clean. Use BFS with a queue instead if the grid is large enough that recursion depth is a worry.",
      time: "O(m * n)",
      space: "O(m * n)",
      solution: "def num_islands(grid):\n    if not grid:\n        return 0\n\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n\n    def sink(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != \"1\":\n            return\n        grid[r][c] = \"0\"\n        sink(r + 1, c)\n        sink(r - 1, c)\n        sink(r, c + 1)\n        sink(r, c - 1)\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == \"1\":\n                count += 1\n                sink(r, c)\n\n    return count",
      tests: [
        "num_islands([[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]) == 2",
        "num_islands([[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]) == 1",
        "num_islands([[\"0\"]]) == 0"
      ]
    },
    {
      id: "max-area-of-island",
      title: "Max Area of Island",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Amazon", "Google", "Meta"],
      freq: 3,
      statement: "Given a binary matrix `grid`, return the area of the largest island (number of connected 1s, horizontally or vertically). Return 0 if there is no island.",
      examples: [
        ["grid = [[1,1,0],[1,0,0],[0,0,1]]", "3", ""],
        ["grid = [[0,0],[0,0]]", "0", ""]
      ],
      constraints: ["1 <= m, n <= 50", "grid[i][j] is 0 or 1"],
      hints: [
        "Same flood fill as Number of Islands, but count cells instead of islands.",
        "Let the DFS return the size of the region it consumed.",
        "1 + the four recursive calls gives the area rooted at this cell."
      ],
      approach: "Flood fill that returns a count. Each call contributes 1 for its own cell plus whatever its four neighbours return; out-of-bounds and water return 0, which terminates the recursion. Marking cells as 0 on the way in prevents double counting and infinite recursion. The outer scan keeps the largest area seen.",
      time: "O(m * n)",
      space: "O(m * n)",
      solution: "def max_area_of_island(grid):\n    rows, cols = len(grid), len(grid[0])\n\n    def area(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:\n            return 0\n        grid[r][c] = 0\n        return (1 + area(r + 1, c) + area(r - 1, c)\n                + area(r, c + 1) + area(r, c - 1))\n\n    best = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 1:\n                best = max(best, area(r, c))\n\n    return best",
      tests: [
        "max_area_of_island([[1,1,0],[1,0,0],[0,0,1]]) == 3",
        "max_area_of_island([[0,0],[0,0]]) == 0",
        "max_area_of_island([[1]]) == 1"
      ]
    },
    {
      id: "clone-graph",
      title: "Clone Graph",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Meta", "Amazon", "Google", "Microsoft"],
      freq: 4,
      statement: "Given a reference to a node in a connected undirected graph, return a **deep copy** of the entire graph. Each node holds a value and a list of neighbours.",
      examples: [
        [
          "adjList = [[2,4],[1,3],[2,4],[1,3]]",
          "[[2,4],[1,3],[2,4],[1,3]]",
          "A 4-node cycle, cloned."
        ],
        ["adjList = []", "[]", ""]
      ],
      constraints: [
        "0 <= nodes <= 100",
        "The graph is connected and undirected",
        "No repeated edges, no self-loops"
      ],
      context: "class Node:\n    def __init__(self, val=0, neighbors=None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []",
      hints: [
        "Cycles mean a naive DFS will recurse forever.",
        "Keep a map from original node to its clone.",
        "Register a clone in the map BEFORE recursing into its neighbours."
      ],
      approach: "DFS with a memo dictionary that doubles as the visited set. The critical ordering is: create the clone and store it in the map *before* walking the neighbours - that way, when a cycle leads back to this node, the recursion finds the existing clone and returns instead of looping. Every node is created once and every edge is walked once.",
      time: "O(V + E)",
      space: "O(V)",
      solution: "def clone_graph(node):\n    if not node:\n        return None\n\n    clones = {}\n\n    def dfs(current):\n        if current in clones:\n            return clones[current]\n\n        copy = Node(current.val)\n        clones[current] = copy\n        for neighbor in current.neighbors:\n            copy.neighbors.append(dfs(neighbor))\n        return copy\n\n    return dfs(node)",
      tests: [
        "_clone_check([[2,4],[1,3],[2,4],[1,3]]) == ([[2,4],[1,3],[2,4],[1,3]], True)",
        "_clone_check([[]]) == ([[]], True)",
        "clone_graph(None) is None"
      ],
      harness: "def _clone_check(adj):\n    nodes = [Node(i + 1) for i in range(len(adj))]\n    for i, neighbors in enumerate(adj):\n        nodes[i].neighbors = [nodes[j - 1] for j in neighbors]\n\n    copy = clone_graph(nodes[0])\n    seen = {}\n    stack = [copy]\n    while stack:\n        cur = stack.pop()\n        if cur.val in seen:\n            continue\n        seen[cur.val] = sorted(n.val for n in cur.neighbors)\n        stack.extend(cur.neighbors)\n\n    deep = copy is not nodes[0]\n    return [seen[k] for k in sorted(seen)], deep"
    },
    {
      id: "course-schedule",
      title: "Course Schedule",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Amazon", "Google", "Meta", "Microsoft", "Uber"],
      freq: 5,
      statement: "There are `num_courses` courses labelled 0 to n-1. `prerequisites[i] = [a, b]` means you must take course b before course a. Return `True` if you can finish every course.",
      examples: [
        ["num_courses = 2, prerequisites = [[1, 0]]", "True", "Take 0, then 1."],
        ["num_courses = 2, prerequisites = [[1,0],[0,1]]", "False", "A cycle - impossible."]
      ],
      constraints: [
        "1 <= num_courses <= 2000",
        "0 <= len(prerequisites) <= 5000",
        "All prerequisite pairs are distinct"
      ],
      hints: [
        "Restate it: does this directed graph contain a cycle?",
        "Kahn's algorithm - repeatedly remove nodes with no remaining prerequisites.",
        "If you cannot process every course this way, whatever is left forms a cycle."
      ],
      approach: "Topological sort by indegree (Kahn's algorithm). Build the adjacency list and count each course's unmet prerequisites. Start a queue with every zero-indegree course; taking a course decrements its dependents, and any that reach zero become takeable. If the number processed equals `num_courses` the order exists; anything left over is trapped in a cycle.",
      time: "O(V + E)",
      space: "O(V + E)",
      solution: "from collections import deque\n\n\ndef can_finish(num_courses, prerequisites):\n    graph = [[] for _ in range(num_courses)]\n    indegree = [0] * num_courses\n\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n        indegree[course] += 1\n\n    queue = deque(i for i in range(num_courses) if indegree[i] == 0)\n    finished = 0\n\n    while queue:\n        node = queue.popleft()\n        finished += 1\n        for neighbor in graph[node]:\n            indegree[neighbor] -= 1\n            if indegree[neighbor] == 0:\n                queue.append(neighbor)\n\n    return finished == num_courses",
      tests: [
        "can_finish(2, [[1, 0]]) is True",
        "can_finish(2, [[1, 0], [0, 1]]) is False",
        "can_finish(5, [[1,0],[2,1],[3,2],[4,3]]) is True"
      ]
    },
    {
      id: "rotting-oranges",
      title: "Rotting Oranges",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Amazon", "Google", "Microsoft", "Meta"],
      freq: 4,
      statement: "In a grid, 0 is empty, 1 is a fresh orange and 2 is rotten. Every minute, a fresh orange adjacent (4-directionally) to a rotten one becomes rotten. Return the minutes until no fresh orange remains, or -1 if that is impossible.",
      examples: [
        ["grid = [[2,1,1],[1,1,0],[0,1,1]]", "4", ""],
        ["grid = [[2,1,1],[0,1,1],[1,0,1]]", "-1", "The bottom-left orange is unreachable."]
      ],
      constraints: ["1 <= m, n <= 10", "grid[i][j] is 0, 1 or 2"],
      hints: [
        "Rot spreads one layer per minute - that is BFS, not DFS.",
        "Seed the queue with EVERY rotten orange, so all sources spread simultaneously.",
        "Count the fresh oranges up front; any left at the end means -1."
      ],
      approach: "Multi-source BFS. Every initially rotten cell goes into the queue at once, so the wavefront advances from all of them together. Draining one full queue level equals one minute. Tracking `fresh` gives both the stop condition and the impossibility check: leftover fresh oranges are unreachable, so return -1. The `while queue and fresh` guard also avoids counting an extra minute after the last orange rots.",
      time: "O(m * n)",
      space: "O(m * n)",
      solution: "from collections import deque\n\n\ndef oranges_rotting(grid):\n    rows, cols = len(grid), len(grid[0])\n    queue = deque()\n    fresh = 0\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 2:\n                queue.append((r, c))\n            elif grid[r][c] == 1:\n                fresh += 1\n\n    minutes = 0\n    while queue and fresh:\n        for _ in range(len(queue)):\n            r, c = queue.popleft()\n            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    fresh -= 1\n                    queue.append((nr, nc))\n        minutes += 1\n\n    return -1 if fresh else minutes",
      tests: [
        "oranges_rotting([[2,1,1],[1,1,0],[0,1,1]]) == 4",
        "oranges_rotting([[2,1,1],[0,1,1],[1,0,1]]) == -1",
        "oranges_rotting([[0, 2]]) == 0"
      ]
    },
    {
      id: "pacific-atlantic",
      title: "Pacific Atlantic Water Flow",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Amazon", "Google", "Meta", "Uber"],
      freq: 3,
      statement: "Given an m x n grid of heights, the Pacific touches the top and left edges and the Atlantic touches the bottom and right edges. Water flows from a cell to a neighbour of equal or lower height. Return every cell from which water can reach **both** oceans.",
      examples: [
        [
          "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
          "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
          ""
        ],
        ["heights = [[1]]", "[[0, 0]]", ""]
      ],
      constraints: ["1 <= m, n <= 200", "0 <= heights[i][j] <= 10^5"],
      hints: [
        "Running a search from every cell is O((m*n)^2) - too slow.",
        "Reverse the question: start at the ocean edges and walk UPHILL.",
        "Do that for each ocean, then intersect the two sets of reachable cells."
      ],
      approach: "Reverse the flow and search from the borders. Starting on each ocean's edge cells and only moving to neighbours that are equal or higher builds the set of cells that drain into that ocean, in one pass per ocean instead of one per cell. The answer is the set intersection. Passing the previous height as a parameter is what enforces the uphill rule.",
      time: "O(m * n)",
      space: "O(m * n)",
      solution: "def pacific_atlantic(heights):\n    if not heights:\n        return []\n\n    rows, cols = len(heights), len(heights[0])\n    pacific, atlantic = set(), set()\n\n    def dfs(r, c, visited, prev):\n        if (r < 0 or r >= rows or c < 0 or c >= cols\n                or (r, c) in visited or heights[r][c] < prev):\n            return\n        visited.add((r, c))\n        dfs(r + 1, c, visited, heights[r][c])\n        dfs(r - 1, c, visited, heights[r][c])\n        dfs(r, c + 1, visited, heights[r][c])\n        dfs(r, c - 1, visited, heights[r][c])\n\n    for c in range(cols):\n        dfs(0, c, pacific, heights[0][c])\n        dfs(rows - 1, c, atlantic, heights[rows - 1][c])\n\n    for r in range(rows):\n        dfs(r, 0, pacific, heights[r][0])\n        dfs(r, cols - 1, atlantic, heights[r][cols - 1])\n\n    return [[r, c] for r, c in pacific & atlantic]",
      tests: [
        "sorted(pacific_atlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]])) == [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        "pacific_atlantic([[1]]) == [[0, 0]]"
      ]
    },
    {
      id: "count-connected-components",
      title: "Number of Connected Components (Union-Find)",
      diff: "Medium",
      pattern: "Graphs",
      companies: ["Amazon", "Google", "Meta", "Salesforce"],
      freq: 3,
      statement: "You have `n` nodes labelled 0 to n-1 and a list of undirected edges. Return the number of connected components in the graph.",
      examples: [
        ["n = 5, edges = [[0,1],[1,2],[3,4]]", "2", ""],
        ["n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", "1", ""]
      ],
      constraints: ["1 <= n <= 2000", "0 <= len(edges) <= 5000", "No duplicate edges, no self-loops"],
      hints: [
        "Start by assuming n separate components.",
        "Each edge that joins two different components reduces the count by one.",
        "Union-Find (disjoint set) answers 'same component?' in near-constant time."
      ],
      approach: "Union-Find. Every node begins as its own component, so the count starts at n. For each edge, find both roots: if they differ, the edge merges two components, so link them and decrement. Edges inside an existing component change nothing. The `parent[x] = parent[parent[x]]` line is path halving - it flattens the tree during traversal and keeps `find` effectively O(1).",
      time: "O(E * alpha(n))",
      space: "O(n)",
      solution: "def count_components(n, edges):\n    parent = list(range(n))\n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n\n    count = n\n    for a, b in edges:\n        root_a, root_b = find(a), find(b)\n        if root_a != root_b:\n            parent[root_a] = root_b\n            count -= 1\n\n    return count",
      tests: [
        "count_components(5, [[0,1],[1,2],[3,4]]) == 2",
        "count_components(5, [[0,1],[1,2],[2,3],[3,4]]) == 1",
        "count_components(4, []) == 4"
      ]
    },
    {
      id: "word-ladder",
      title: "Word Ladder",
      diff: "Hard",
      pattern: "Graphs",
      companies: ["Amazon", "Google", "Meta", "LinkedIn"],
      freq: 4,
      statement: "Given `begin_word`, `end_word` and a dictionary `word_list`, return the number of words in the shortest transformation sequence from begin to end, changing exactly one letter at a time and keeping every intermediate word in the dictionary. Return 0 if no sequence exists.",
      examples: [
        [
          "begin = \"hit\", end = \"cog\", list = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
          "5",
          "hit -> hot -> dot -> dog -> cog."
        ],
        [
          "begin = \"hit\", end = \"cog\", list = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
          "0",
          "\"cog\" is not in the dictionary."
        ]
      ],
      constraints: ["1 <= len(word) <= 10", "1 <= len(word_list) <= 5000", "All words have the same length"],
      hints: [
        "Words are nodes; an edge exists between words differing by one letter. Shortest path = BFS.",
        "Do not compare every pair of words - generate the 26 * L neighbour candidates instead.",
        "Mark words as seen when you enqueue them, not when you dequeue, or the queue explodes."
      ],
      approach: "BFS over an implicit graph. Instead of building the edges (which costs O(N^2) comparisons), generate each word's neighbours by substituting every letter at every position and keeping the candidates that exist in the dictionary set. BFS guarantees the first time you reach `end_word` is via the shortest chain. Marking words seen at enqueue time prevents duplicates piling into the queue.",
      time: "O(N * L * 26)",
      space: "O(N * L)",
      solution: "from collections import deque\n\n\ndef ladder_length(begin_word, end_word, word_list):\n    words = set(word_list)\n    if end_word not in words:\n        return 0\n\n    queue = deque([(begin_word, 1)])\n    seen = {begin_word}\n\n    while queue:\n        word, steps = queue.popleft()\n        if word == end_word:\n            return steps\n\n        for i in range(len(word)):\n            for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                candidate = word[:i] + ch + word[i + 1:]\n                if candidate in words and candidate not in seen:\n                    seen.add(candidate)\n                    queue.append((candidate, steps + 1))\n\n    return 0",
      tests: [
        "ladder_length(\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]) == 5",
        "ladder_length(\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]) == 0",
        "ladder_length(\"a\", \"c\", [\"a\",\"b\",\"c\"]) == 2"
      ]
    },
    {
      id: "subsets",
      title: "Subsets",
      diff: "Medium",
      pattern: "Backtracking",
      companies: ["Amazon", "Meta", "Google", "Bloomberg"],
      freq: 5,
      statement: "Given an array of unique integers `nums`, return all possible subsets (the power set). The solution must not contain duplicate subsets.",
      examples: [
        [
          "nums = [1, 2, 3]",
          "[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
          "8 subsets for 3 elements."
        ],
        ["nums = [0]", "[[], [0]]", ""]
      ],
      constraints: ["1 <= len(nums) <= 10", "All elements are unique"],
      hints: [
        "Every node of the recursion tree is itself a valid subset - record on entry, not just at leaves.",
        "The `start` index prevents re-picking earlier elements, which is what kills duplicates.",
        "Append a COPY of the path; the live list keeps mutating underneath you."
      ],
      approach: "Backtracking over choices. Each call records the current path as a subset, then tries extending it with every element from `start` onward. Passing `i + 1` down means elements are only ever added in increasing index order, so each combination is generated exactly once. `path[:]` is essential - appending `path` itself would store a reference that ends up empty.",
      time: "O(n * 2^n)",
      space: "O(n)",
      solution: "def subsets(nums):\n    result = []\n    path = []\n\n    def backtrack(start):\n        result.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1)\n            path.pop()\n\n    backtrack(0)\n    return result",
      tests: [
        "subsets([1, 2, 3]) == [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
        "subsets([0]) == [[], [0]]",
        "len(subsets([1,2,3,4])) == 16"
      ]
    },
    {
      id: "combination-sum",
      title: "Combination Sum",
      diff: "Medium",
      pattern: "Backtracking",
      companies: ["Amazon", "Meta", "Uber", "Airbnb"],
      freq: 4,
      statement: "Given an array of distinct integers `candidates` and a `target`, return all unique combinations that sum to the target. The same number may be reused unlimited times.",
      examples: [
        ["candidates = [2,3,6,7], target = 7", "[[2,2,3],[7]]", ""],
        ["candidates = [2], target = 1", "[]", ""]
      ],
      constraints: [
        "1 <= len(candidates) <= 30",
        "1 <= candidates[i] <= 200",
        "Each combination must be unique"
      ],
      hints: [
        "Reuse allowed means recursing with `i`, not `i + 1`.",
        "Still pass a start index, or [2,3] and [3,2] both get generated.",
        "Two base cases: remaining == 0 records a hit, remaining < 0 prunes the branch."
      ],
      approach: "Backtracking with a shrinking target. Recursing on `i` rather than `i + 1` is what allows a candidate to repeat, while still forbidding going back to earlier candidates - so each multiset is produced once. Tracking `remaining` instead of a running sum makes both base cases trivial: zero is a solution, negative is a dead branch to prune.",
      time: "O(n^(target/min))",
      space: "O(target/min)",
      solution: "def combination_sum(candidates, target):\n    result = []\n    path = []\n\n    def backtrack(start, remaining):\n        if remaining == 0:\n            result.append(path[:])\n            return\n        if remaining < 0:\n            return\n\n        for i in range(start, len(candidates)):\n            path.append(candidates[i])\n            backtrack(i, remaining - candidates[i])\n            path.pop()\n\n    backtrack(0, target)\n    return result",
      tests: [
        "combination_sum([2,3,6,7], 7) == [[2,2,3],[7]]",
        "combination_sum([2], 1) == []",
        "combination_sum([2,3,5], 8) == [[2,2,2,2],[2,3,3],[3,5]]"
      ]
    },
    {
      id: "permutations",
      title: "Permutations",
      diff: "Medium",
      pattern: "Backtracking",
      companies: ["Amazon", "Meta", "Microsoft", "LinkedIn"],
      freq: 4,
      statement: "Given an array `nums` of distinct integers, return all possible permutations in any order.",
      examples: [
        [
          "nums = [1, 2, 3]",
          "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
          "3! = 6 permutations."
        ],
        ["nums = [1]", "[[1]]", ""]
      ],
      constraints: ["1 <= len(nums) <= 6", "All integers are unique"],
      hints: [
        "At position `start`, any of the remaining elements can go there.",
        "Swap the chosen element into `start`, recurse, then swap it back.",
        "When start reaches the end of the array, the array holds a complete permutation."
      ],
      approach: "In-place swapping backtracker. For index `start`, each candidate from `start` onward takes a turn in that slot; the recursion then arranges the rest. Undoing the swap on the way out restores the array so the next candidate starts from a clean state - the defining move of backtracking. No visited set or extra allocation is needed.",
      time: "O(n * n!)",
      space: "O(n)",
      solution: "def permute(nums):\n    result = []\n\n    def backtrack(start):\n        if start == len(nums):\n            result.append(nums[:])\n            return\n\n        for i in range(start, len(nums)):\n            nums[start], nums[i] = nums[i], nums[start]\n            backtrack(start + 1)\n            nums[start], nums[i] = nums[i], nums[start]\n\n    backtrack(0)\n    return result",
      tests: [
        "sorted(permute([1,2,3])) == [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
        "permute([1]) == [[1]]",
        "len(permute([1,2,3,4])) == 24"
      ]
    },
    {
      id: "generate-parentheses",
      title: "Generate Parentheses",
      diff: "Medium",
      pattern: "Backtracking",
      companies: ["Amazon", "Google", "Meta", "Uber"],
      freq: 4,
      statement: "Given `n` pairs of parentheses, generate all combinations of well-formed parentheses.",
      examples: [
        ["n = 3", "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]", ""],
        ["n = 1", "[\"()\"]", ""]
      ],
      constraints: ["1 <= n <= 8"],
      hints: [
        "Generating all 2^(2n) strings and filtering is wasteful - only build valid ones.",
        "You may add '(' whenever you have used fewer than n of them.",
        "You may add ')' only when it would close an already-open bracket."
      ],
      approach: "Backtracking with two counters that encode validity as you build. An opener is legal while `open_count < n`; a closer is legal only while `close_count < open_count`, which is exactly the condition preventing an unmatched `)`. Because invalid prefixes are never created, every leaf reached at length 2n is a valid answer - no filtering pass required.",
      time: "O(4^n / sqrt(n))",
      space: "O(n)",
      solution: "def generate_parenthesis(n):\n    result = []\n    path = []\n\n    def backtrack(open_count, close_count):\n        if len(path) == 2 * n:\n            result.append(\"\".join(path))\n            return\n\n        if open_count < n:\n            path.append(\"(\")\n            backtrack(open_count + 1, close_count)\n            path.pop()\n\n        if close_count < open_count:\n            path.append(\")\")\n            backtrack(open_count, close_count + 1)\n            path.pop()\n\n    backtrack(0, 0)\n    return result",
      tests: [
        "generate_parenthesis(3) == [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
        "generate_parenthesis(1) == [\"()\"]",
        "len(generate_parenthesis(4)) == 14"
      ]
    },
    {
      id: "letter-combinations",
      title: "Letter Combinations of a Phone Number",
      diff: "Medium",
      pattern: "Backtracking",
      companies: ["Amazon", "Meta", "Google", "Uber", "Dropbox"],
      freq: 4,
      statement: "Given a string of digits from 2-9, return every letter combination the number could spell, using the standard phone keypad mapping.",
      examples: [
        [
          "digits = \"23\"",
          "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
          ""
        ],
        ["digits = \"\"", "[]", "Empty input returns an empty list, not [\"\"]."]
      ],
      constraints: ["0 <= len(digits) <= 4", "digits[i] is in the range 2-9"],
      hints: [
        "Each digit multiplies the number of combinations by its letter count.",
        "Recurse one digit at a time, appending each of its letters in turn.",
        "Handle the empty input explicitly or you will return a list holding one empty string."
      ],
      approach: "Backtracking over digit positions. At depth `index` you loop through the letters of that digit, append one, recurse to the next digit, then pop it back off. When `index` reaches the end of the string a full combination has been built. The empty-input guard matters - without it, the base case fires immediately and returns `[\"\"]` instead of `[]`.",
      time: "O(4^n * n)",
      space: "O(n)",
      solution: "def letter_combinations(digits):\n    if not digits:\n        return []\n\n    letters = {\n        \"2\": \"abc\", \"3\": \"def\", \"4\": \"ghi\", \"5\": \"jkl\",\n        \"6\": \"mno\", \"7\": \"pqrs\", \"8\": \"tuv\", \"9\": \"wxyz\",\n    }\n    result = []\n    path = []\n\n    def backtrack(index):\n        if index == len(digits):\n            result.append(\"\".join(path))\n            return\n\n        for ch in letters[digits[index]]:\n            path.append(ch)\n            backtrack(index + 1)\n            path.pop()\n\n    backtrack(0)\n    return result",
      tests: [
        "letter_combinations(\"23\") == [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        "letter_combinations(\"\") == []",
        "letter_combinations(\"2\") == [\"a\",\"b\",\"c\"]"
      ]
    },
    {
      id: "word-search",
      title: "Word Search",
      diff: "Medium",
      pattern: "Backtracking",
      companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
      freq: 5,
      statement: "Given an m x n board of characters and a `word`, return `True` if the word can be built from sequentially adjacent cells (horizontally or vertically). The same cell may not be used twice in one word.",
      examples: [
        [
          "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
          "True",
          ""
        ],
        ["same board, word = \"ABCB\"", "False", "B cannot be reused."]
      ],
      constraints: ["1 <= m, n <= 6", "1 <= len(word) <= 15", "Each cell may be used at most once per word"],
      hints: [
        "Try starting a DFS from every cell.",
        "Mark the current cell as used before recursing, and restore it afterwards.",
        "Overwriting the letter with a sentinel like '#' is a neat way to mark it."
      ],
      approach: "DFS with in-place marking. From each starting cell, walk in all four directions matching one character at a time. Replacing the letter with '#' before recursing prevents reusing that cell within the same path, and restoring it after is what makes other paths still able to use it. `i == len(word)` fires before the bounds check so a fully matched word returns True immediately.",
      time: "O(m * n * 4^L)",
      space: "O(L)",
      solution: "def exist(board, word):\n    rows, cols = len(board), len(board[0])\n\n    def dfs(r, c, i):\n        if i == len(word):\n            return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:\n            return False\n\n        board[r][c] = \"#\"\n        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1)\n                 or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))\n        board[r][c] = word[i]\n        return found\n\n    for r in range(rows):\n        for c in range(cols):\n            if dfs(r, c, 0):\n                return True\n\n    return False",
      tests: [
        "exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCCED\") is True",
        "exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"SEE\") is True",
        "exist([[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCB\") is False"
      ]
    },
    {
      id: "n-queens",
      title: "N-Queens",
      diff: "Hard",
      pattern: "Backtracking",
      companies: ["Amazon", "Google", "Meta", "Goldman Sachs"],
      freq: 3,
      statement: "Place `n` queens on an n x n chessboard so that no two attack each other. Return all distinct solutions, each drawn as a list of strings using 'Q' and '.'.",
      examples: [
        [
          "n = 4",
          "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"], [\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
          "Two solutions."
        ],
        ["n = 1", "[[\"Q\"]]", ""]
      ],
      constraints: ["1 <= n <= 9"],
      hints: [
        "Place exactly one queen per row, so rows never conflict by construction.",
        "Two queens share a diagonal when row - col matches, and an anti-diagonal when row + col matches.",
        "Three sets give O(1) conflict checks instead of scanning the board."
      ],
      approach: "Row-by-row backtracking with three constraint sets. Placing one queen per row removes row conflicts automatically; columns and both diagonal directions are tracked as sets, keyed by `col`, `row - col` and `row + col`. Those two arithmetic identities are the whole trick - they turn an O(n) board scan into three O(1) lookups. Undo all three marks when backtracking.",
      time: "O(n!)",
      space: "O(n^2)",
      solution: "def solve_n_queens(n):\n    result = []\n    columns = set()\n    diagonals = set()\n    anti_diagonals = set()\n    board = [[\".\"] * n for _ in range(n)]\n\n    def backtrack(row):\n        if row == n:\n            result.append([\"\".join(r) for r in board])\n            return\n\n        for col in range(n):\n            if col in columns or (row - col) in diagonals or (row + col) in anti_diagonals:\n                continue\n\n            columns.add(col)\n            diagonals.add(row - col)\n            anti_diagonals.add(row + col)\n            board[row][col] = \"Q\"\n\n            backtrack(row + 1)\n\n            board[row][col] = \".\"\n            columns.remove(col)\n            diagonals.remove(row - col)\n            anti_diagonals.remove(row + col)\n\n    backtrack(0)\n    return result",
      tests: [
        "len(solve_n_queens(4)) == 2",
        "solve_n_queens(4)[0] == [\".Q..\",\"...Q\",\"Q...\",\"..Q.\"]",
        "solve_n_queens(1) == [[\"Q\"]]",
        "len(solve_n_queens(8)) == 92"
      ]
    },
    {
      id: "kth-largest-element",
      title: "Kth Largest Element in an Array",
      diff: "Medium",
      pattern: "Heap / Priority Queue",
      companies: ["Amazon", "Meta", "Microsoft", "Apple", "Goldman Sachs"],
      freq: 5,
      statement: "Given an integer array `nums` and an integer `k`, return the k-th largest element. Note this is the k-th largest in sorted order, not the k-th distinct value.",
      examples: [
        ["nums = [3,2,1,5,6,4], k = 2", "5", ""],
        ["nums = [3,2,3,1,2,4,5,5,6], k = 4", "4", ""]
      ],
      constraints: ["1 <= k <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      hints: [
        "Sorting is O(n log n). A heap of size k does better when k is small.",
        "Keep a MIN-heap of the k largest values seen so far.",
        "Its root is then the k-th largest - pop whenever the heap grows past k."
      ],
      approach: "Bounded min-heap. Push every value, and whenever the heap exceeds k elements, pop the smallest - so the heap always holds exactly the k largest values seen, with the k-th largest sitting at the root. Each push/pop is O(log k), giving O(n log k) overall. Quickselect gets O(n) average but degrades to O(n^2) in the worst case.",
      time: "O(n log k)",
      space: "O(k)",
      solution: "import heapq\n\n\ndef find_kth_largest(nums, k):\n    heap = []\n\n    for num in nums:\n        heapq.heappush(heap, num)\n        if len(heap) > k:\n            heapq.heappop(heap)\n\n    return heap[0]",
      tests: [
        "find_kth_largest([3,2,1,5,6,4], 2) == 5",
        "find_kth_largest([3,2,3,1,2,4,5,5,6], 4) == 4",
        "find_kth_largest([1], 1) == 1"
      ]
    },
    {
      id: "find-median-data-stream",
      title: "Find Median from Data Stream",
      diff: "Hard",
      pattern: "Heap / Priority Queue",
      companies: ["Amazon", "Google", "Meta", "Microsoft", "Uber"],
      freq: 4,
      statement: "Design a data structure that supports adding integers from a stream and returning the median of all values added so far. Both operations should be efficient.",
      examples: [
        ["add(1), add(2), find_median(), add(3), find_median()", "1.5, then 2.0", ""]
      ],
      constraints: [
        "-10^5 <= num <= 10^5",
        "find_median is only called after at least one add",
        "Up to 5 * 10^4 calls"
      ],
      hints: [
        "Keeping the list sorted costs O(n) per insert. Do you need full ordering?",
        "You only need the middle. Split the data into a smaller half and a larger half.",
        "Python only has min-heaps - negate values to fake a max-heap."
      ],
      approach: "Two heaps facing each other. `low` is a max-heap (values negated) holding the smaller half, `high` a min-heap holding the larger half. Every add pushes through `low` into `high` and then rebalances, which keeps both heaps' tops adjacent to the median and `low` never smaller than `high`. The median is then either `low`'s root or the average of the two roots. Add is O(log n); read is O(1).",
      time: "O(log n) add, O(1) median",
      space: "O(n)",
      solution: "import heapq\n\n\nclass MedianFinder:\n    def __init__(self):\n        self.low = []\n        self.high = []\n\n    def add_num(self, num):\n        heapq.heappush(self.low, -num)\n        heapq.heappush(self.high, -heapq.heappop(self.low))\n        if len(self.high) > len(self.low):\n            heapq.heappush(self.low, -heapq.heappop(self.high))\n\n    def find_median(self):\n        if len(self.low) > len(self.high):\n            return float(-self.low[0])\n        return (-self.low[0] + self.high[0]) / 2",
      tests: [
        "_run_median([1, 2, 3]) == [1.0, 1.5, 2.0]",
        "_run_median([5]) == [5.0]",
        "_run_median([6, 10, 2, 6]) == [6.0, 8.0, 6.0, 6.0]"
      ],
      harness: "def _run_median(values):\n    finder = MedianFinder()\n    out = []\n    for v in values:\n        finder.add_num(v)\n        out.append(finder.find_median())\n    return out"
    },
    {
      id: "merge-intervals",
      title: "Merge Intervals",
      diff: "Medium",
      pattern: "Intervals",
      companies: ["Amazon", "Meta", "Google", "Microsoft", "Bloomberg"],
      freq: 5,
      statement: "Given an array of intervals `[start, end]`, merge all overlapping intervals and return the non-overlapping intervals that cover all the input.",
      examples: [
        [
          "intervals = [[1,3],[2,6],[8,10],[15,18]]",
          "[[1,6],[8,10],[15,18]]",
          "[1,3] and [2,6] overlap."
        ],
        ["intervals = [[1,4],[4,5]]", "[[1,5]]", "Touching intervals count as overlapping."]
      ],
      constraints: ["1 <= len(intervals) <= 10^4", "0 <= start <= end <= 10^4"],
      hints: [
        "Sort by start time first - unsorted intervals make overlap detection painful.",
        "Once sorted, you only ever compare against the LAST merged interval.",
        "Overlap means current.start <= last.end. Extend with max of the two ends."
      ],
      approach: "Sort by start, then sweep once. After sorting, any interval that overlaps the current merged block must overlap its end, so a single comparison against `merged[-1][1]` suffices. Extend with `max` - a fully nested interval like [1,10] followed by [2,3] must not shrink the block. Non-overlapping intervals simply start a new block.",
      time: "O(n log n)",
      space: "O(n)",
      solution: "def merge_intervals(intervals):\n    intervals.sort(key=lambda interval: interval[0])\n    merged = []\n\n    for interval in intervals:\n        if merged and interval[0] <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n        else:\n            merged.append(list(interval))\n\n    return merged",
      tests: [
        "merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]",
        "merge_intervals([[1,4],[4,5]]) == [[1,5]]",
        "merge_intervals([[1,10],[2,3]]) == [[1,10]]"
      ]
    },
    {
      id: "insert-interval",
      title: "Insert Interval",
      diff: "Medium",
      pattern: "Intervals",
      companies: ["Google", "Amazon", "Meta", "LinkedIn"],
      freq: 4,
      statement: "Given a list of non-overlapping intervals sorted by start time, insert a new interval, merging where necessary. Return the resulting list.",
      examples: [
        ["intervals = [[1,3],[6,9]], new = [2,5]", "[[1,5],[6,9]]", ""],
        [
          "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], new = [4,8]",
          "[[1,2],[3,10],[12,16]]",
          ""
        ]
      ],
      constraints: ["0 <= len(intervals) <= 10^4", "intervals is sorted by start and non-overlapping"],
      hints: [
        "The input is already sorted - do not re-sort, that wastes the O(n) opportunity.",
        "Three phases: intervals entirely before, intervals that overlap, intervals entirely after.",
        "While overlapping, absorb into a running [start, end] using min and max."
      ],
      approach: "One linear pass in three phases. Copy every interval that ends before the new one starts. Then absorb every interval that starts at or before the running end, widening with `min`/`max` - this collapses a whole overlapping run into one interval. Finally copy the remainder. Because the input is pre-sorted, no sorting step is needed, so this is O(n).",
      time: "O(n)",
      space: "O(n)",
      solution: "def insert_interval(intervals, new_interval):\n    result = []\n    i = 0\n    n = len(intervals)\n\n    while i < n and intervals[i][1] < new_interval[0]:\n        result.append(intervals[i])\n        i += 1\n\n    start, end = new_interval\n    while i < n and intervals[i][0] <= end:\n        start = min(start, intervals[i][0])\n        end = max(end, intervals[i][1])\n        i += 1\n    result.append([start, end])\n\n    while i < n:\n        result.append(intervals[i])\n        i += 1\n\n    return result",
      tests: [
        "insert_interval([[1,3],[6,9]], [2,5]) == [[1,5],[6,9]]",
        "insert_interval([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) == [[1,2],[3,10],[12,16]]",
        "insert_interval([], [5,7]) == [[5,7]]"
      ]
    },
    {
      id: "non-overlapping-intervals",
      title: "Non-overlapping Intervals",
      diff: "Medium",
      pattern: "Intervals",
      companies: ["Amazon", "Google", "Meta", "Bloomberg"],
      freq: 4,
      statement: "Given an array of intervals, return the minimum number you must remove so that the rest do not overlap.",
      examples: [
        ["intervals = [[1,2],[2,3],[3,4],[1,3]]", "1", "Remove [1,3]."],
        ["intervals = [[1,2],[1,2],[1,2]]", "2", ""]
      ],
      constraints: ["1 <= len(intervals) <= 10^5", "Intervals sharing only an endpoint do not overlap"],
      hints: [
        "Removing the fewest is the same as keeping the most - the activity selection problem.",
        "Sort by END time, not start time.",
        "Greedily keep an interval whenever it starts at or after the last kept end."
      ],
      approach: "Greedy activity selection. Sorting by end time means the interval that finishes earliest always leaves the most room for the rest, so keeping it is provably optimal. Sweep once: if the current interval starts at or after the last kept end, keep it and advance the boundary; otherwise it conflicts and must be counted as removed. Sorting by start instead would let one long interval crowd out several short ones.",
      time: "O(n log n)",
      space: "O(1)",
      solution: "def erase_overlap_intervals(intervals):\n    intervals.sort(key=lambda interval: interval[1])\n    removed = 0\n    prev_end = float('-inf')\n\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            removed += 1\n\n    return removed",
      tests: [
        "erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]) == 1",
        "erase_overlap_intervals([[1,2],[1,2],[1,2]]) == 2",
        "erase_overlap_intervals([[1,2],[2,3]]) == 0"
      ]
    },
    {
      id: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      diff: "Medium",
      pattern: "Intervals",
      companies: ["Amazon", "Google", "Meta", "Microsoft", "Bloomberg"],
      freq: 5,
      statement: "Given an array of meeting time intervals, return the minimum number of conference rooms required to hold all of them.",
      examples: [
        ["intervals = [[0,30],[5,10],[15,20]]", "2", "[0,30] overlaps both others."],
        ["intervals = [[7,10],[2,4]]", "1", "They never overlap."]
      ],
      constraints: ["0 <= len(intervals) <= 10^4", "0 <= start < end <= 10^6"],
      hints: [
        "The answer is the maximum number of meetings running at the same instant.",
        "Process meetings in start order and track the end times of rooms in use.",
        "A min-heap of end times tells you instantly whether the earliest room has freed up."
      ],
      approach: "Sort by start time and keep a min-heap of end times for occupied rooms. For each meeting, if the earliest-ending room is already free (`heap[0] <= start`), reuse it with `heapreplace`; otherwise allocate a new room. The heap size never exceeds the peak concurrency, so its final length is the answer. The chronological-events sweep (sort starts and ends separately) is the equivalent O(n log n) alternative.",
      time: "O(n log n)",
      space: "O(n)",
      solution: "import heapq\n\n\ndef min_meeting_rooms(intervals):\n    if not intervals:\n        return 0\n\n    intervals.sort(key=lambda interval: interval[0])\n    heap = []\n\n    for start, end in intervals:\n        if heap and heap[0] <= start:\n            heapq.heapreplace(heap, end)\n        else:\n            heapq.heappush(heap, end)\n\n    return len(heap)",
      tests: [
        "min_meeting_rooms([[0,30],[5,10],[15,20]]) == 2",
        "min_meeting_rooms([[7,10],[2,4]]) == 1",
        "min_meeting_rooms([]) == 0"
      ]
    },
    {
      id: "task-scheduler",
      title: "Task Scheduler",
      diff: "Medium",
      pattern: "Greedy",
      companies: ["Meta", "Amazon", "Google", "Uber"],
      freq: 4,
      statement: "Given a list of CPU `tasks` (letters) and a cooldown `n`, identical tasks must be separated by at least n intervals. Each interval runs one task or idles. Return the minimum number of intervals needed.",
      examples: [
        ["tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2", "8", "A B idle A B idle A B."],
        ["tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 0", "6", "No cooldown, no idling."]
      ],
      constraints: ["1 <= len(tasks) <= 10^4", "0 <= n <= 100", "tasks[i] is an uppercase English letter"],
      hints: [
        "The most frequent task dictates the skeleton of the schedule.",
        "It creates (max_count - 1) gaps, each n + 1 intervals wide.",
        "If there are enough other tasks to fill every gap, no idling happens at all - answer is len(tasks)."
      ],
      approach: "Greedy formula, no simulation. The most frequent task forms `max_count - 1` blocks of width `n + 1`, plus a final row holding every task tied for that maximum: `(max_count - 1) * (n + 1) + max_tasks`. When there are enough other tasks to fill all the idle slots, that formula underestimates, and the true answer is simply `len(tasks)` - so take the max of the two.",
      time: "O(n)",
      space: "O(1)",
      solution: "def least_interval(tasks, n):\n    counts = {}\n    for task in tasks:\n        counts[task] = counts.get(task, 0) + 1\n\n    max_count = max(counts.values())\n    max_tasks = sum(1 for count in counts.values() if count == max_count)\n\n    slots = (max_count - 1) * (n + 1) + max_tasks\n    return max(len(tasks), slots)",
      tests: [
        "least_interval([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 2) == 8",
        "least_interval([\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 0) == 6",
        "least_interval([\"A\",\"A\",\"A\",\"A\",\"A\",\"A\",\"B\",\"C\",\"D\",\"E\",\"F\",\"G\"], 2) == 16"
      ]
    },
    {
      id: "implement-trie",
      title: "Implement Trie (Prefix Tree)",
      diff: "Medium",
      pattern: "Trie",
      companies: ["Amazon", "Google", "Meta", "Microsoft", "Twitter"],
      freq: 4,
      statement: "Implement a trie supporting `insert(word)`, `search(word)` (exact match) and `starts_with(prefix)`.",
      examples: [
        [
          "insert(\"apple\"), search(\"apple\"), search(\"app\"), starts_with(\"app\")",
          "True, False, True",
          ""
        ]
      ],
      constraints: ["1 <= len(word) <= 2000", "Lowercase English letters only", "Up to 3 * 10^4 calls"],
      hints: [
        "Each node holds a dict of children keyed by character.",
        "The difference between search and starts_with is a single end-of-word flag.",
        "Both operations walk the same path - factor that walk into one helper."
      ],
      approach: "A tree where each edge is one character, so a word is a root-to-node path. `insert` creates missing children as it descends and flags the final node as a complete word. Since `search` and `starts_with` differ only in whether that flag matters, a shared `_walk` helper returns the node the path ends at (or None). Every operation is O(len(word)), independent of how many words are stored.",
      time: "O(L) per operation",
      space: "O(total characters)",
      solution: "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\n\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_word = True\n\n    def search(self, word):\n        node = self._walk(word)\n        return node is not None and node.is_word\n\n    def starts_with(self, prefix):\n        return self._walk(prefix) is not None\n\n    def _walk(self, text):\n        node = self.root\n        for ch in text:\n            if ch not in node.children:\n                return None\n            node = node.children[ch]\n        return node",
      tests: ["_run_trie() == [True, False, True, True, False]"],
      harness: "def _run_trie():\n    trie = Trie()\n    trie.insert(\"apple\")\n    out = [trie.search(\"apple\"), trie.search(\"app\"), trie.starts_with(\"app\")]\n    trie.insert(\"app\")\n    out.append(trie.search(\"app\"))\n    out.append(trie.starts_with(\"banana\"))\n    return out"
    },
    {
      id: "design-add-search-words",
      title: "Design Add and Search Words Data Structure",
      diff: "Medium",
      pattern: "Trie",
      companies: ["Meta", "Amazon", "Google", "Microsoft"],
      freq: 4,
      statement: "Design a structure with `add_word(word)` and `search(word)`, where the search string may contain '.' as a wildcard matching any single letter.",
      examples: [
        [
          "add(\"bad\"), add(\"dad\"), search(\"pad\"), search(\".ad\"), search(\"b..\")",
          "False, True, True",
          ""
        ]
      ],
      constraints: ["1 <= len(word) <= 25", "search words may contain up to 3 dots", "Up to 10^4 calls"],
      hints: [
        "Build a trie, then make search recursive rather than iterative.",
        "A normal character follows exactly one child - the deterministic case.",
        "A dot must try every child, and succeeds if any branch matches."
      ],
      approach: "A trie whose search is a DFS. A concrete character descends one child; a '.' branches into all of them, returning True if any subtree matches the rest of the pattern. Here the trie is plain nested dicts with `\"$\"` marking a word end, so the wildcard loop must skip that sentinel key. Cost is O(L) for a dot-free query and up to O(26^d * L) when d wildcards force branching.",
      time: "O(L) typical, O(26^d * L) with d dots",
      space: "O(total characters)",
      solution: "class WordDictionary:\n    def __init__(self):\n        self.root = {}\n\n    def add_word(self, word):\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node[\"$\"] = True\n\n    def search(self, word):\n        def dfs(node, i):\n            if i == len(word):\n                return \"$\" in node\n\n            ch = word[i]\n            if ch == \".\":\n                for key, child in node.items():\n                    if key != \"$\" and dfs(child, i + 1):\n                        return True\n                return False\n\n            if ch not in node:\n                return False\n            return dfs(node[ch], i + 1)\n\n        return dfs(self.root, 0)",
      tests: ["_run_dict() == [False, True, True, True, False]"],
      harness: "def _run_dict():\n    wd = WordDictionary()\n    for w in [\"bad\", \"dad\", \"mad\"]:\n        wd.add_word(w)\n    return [wd.search(\"pad\"), wd.search(\"bad\"), wd.search(\".ad\"), wd.search(\"b..\"), wd.search(\"b\")]"
    }
  ]);
})(window.TD);
