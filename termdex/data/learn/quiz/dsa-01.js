/* DSA — 50+ Hardcore Question Bank (IIT/FAANG Level). */

/* ===================================================================
   Module: complexity — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "complexity", [
  {
    "tag": "Extended Master Theorem",
    "lvl": "advanced",
    "q": "What is the tight asymptotic bound $\\Theta$ of the recurrence relation $T(n) = 2T(n/2) + n \\log n$?",
    "o": [
      "$\\Theta(n \\log n)$",
      "$\\Theta(n \\log^2 n)$",
      "$\\Theta(n^2)$",
      "$\\Theta(n \\sqrt{\\log n})$"
    ],
    "a": 1,
    "x": "By the Extended Master Theorem (Case 2 with $k=1$): $a=2, b=2 \\implies n^{\\log_2 2} = n^1$. Since $f(n) = n \\log^1 n$, $T(n) = \\Theta(n^{\\log_b a} \\log^{k+1} n) = \\Theta(n \\log^2 n)$.",
    "steps": [
      "$a = 2, b = 2, f(n) = n \\log n$.",
      "$n^{\\log_b a} = n^{\\log_2 2} = n$.",
      "$f(n) = \\Theta(n \\log^1 n) \\implies k = 1$.",
      "$T(n) = \\Theta(n \\log^{1+1} n) = \\Theta(n \\log^2 n)$."
    ]
  },
  {
    "tag": "Akra-Bazzi Unequal Splits",
    "lvl": "advanced",
    "q": "What is the asymptotic growth rate of $T(n) = T(n/3) + T(2n/3) + n$?",
    "o": [
      "$\\Theta(n)$",
      "$\\Theta(n \\log n)$",
      "$\\Theta(n^2)$",
      "$\\Theta(n^{\\log_3 2})$"
    ],
    "a": 1,
    "x": "Using Akra-Bazzi method, solve $(1/3)^p + (2/3)^p = 1 \\implies p=1$. Then $T(n) = \\Theta(n^1 (1 + \\int_1^n \\frac{u}{u^2} du)) = \\Theta(n \\ln n) = \\Theta(n \\log n)$."
  },
  {
    "tag": "Potential Method Amortization",
    "lvl": "advanced",
    "q": "A dynamic array starts at capacity 1 and doubles when full. Using the potential function $\\Phi = 2n - C$ (where $n$ is count, $C$ is capacity), what is the amortized cost per append?",
    "o": [
      "$O(\\log n)$",
      "$O(1)$ amortized (strictly 3 credits)",
      "$O(\\sqrt{n})$",
      "$O(n)$"
    ],
    "a": 1,
    "x": "When doubling, actual cost is $C+1$, and $\\Delta\\Phi = 0 - C = -C$. Amortized cost $\\hat{c} = (C+1) + (-C) = 1$. When not doubling, $\\Delta\\Phi = 2$, $\\hat{c} = 1 + 2 = 3 = O(1)$."
  },
  {
    "tag": "Recurrence Substitution",
    "lvl": "advanced",
    "q": "Solve the recurrence $T(n) = T(\\sqrt{n}) + 1$ with base case $T(2) = 1$.",
    "o": [
      "$\\Theta(\\log n)$",
      "$\\Theta(\\log \\log n)$",
      "$\\Theta(\\sqrt{n})$",
      "$\\Theta(1)$"
    ],
    "a": 1,
    "x": "Substitute $n = 2^{2^k} \\implies k = \\log_2 \\log_2 n$. In each step $k \\rightarrow k-1$. Total steps to reach $k=0$ is $k = \\Theta(\\log \\log n)$."
  },
  {
    "tag": "Bit Counting Brian Kernighan",
    "lvl": "advanced",
    "q": "Why does Brian Kernighan's algorithm `while(n) { n &= (n-1); count++; }` run in $O(k)$ time where $k$ is the number of set bits?",
    "o": [
      "It checks all 32 or 64 bits sequentially",
      "Subtracting 1 flips the lowest set bit and all trailing zeros; bitwise AND with $n$ clears exactly that lowest set bit in $O(1)$ per iteration",
      "It uses a hardware lookup table",
      "It divides by 2 on each step"
    ],
    "a": 1,
    "x": "Each execution of `n &= (n - 1)` clears the least significant set bit, so the loop executes exactly $k$ times where $k$ is the Hamming weight of $n$."
  },
  {
    "tag": "Matrix Exponentiation Recurrence",
    "lvl": "advanced",
    "q": "To compute the $N$-th Tribonacci number ($T_n = T_{n-1} + T_{n-2} + T_{n-3}$) in $O(\\log N)$ time, what is the size of the transition matrix?",
    "o": [
      "$2 \\times 2$",
      "$3 \\times 3$",
      "$4 \\times 4$",
      "$N \\times N$"
    ],
    "a": 1,
    "x": "A linear recurrence of order $k$ requires a $k \\times k$ state transition matrix. Since Tribonacci depends on 3 previous terms, it uses a $3 \\times 3$ matrix: $\\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{pmatrix}$."
  },
  {
    "tag": "Master Theorem Inapplicability",
    "lvl": "advanced",
    "q": "Why can the standard Master Theorem NOT be applied to $T(n) = 2T(n/2) + n!$?",
    "o": [
      "$a < 1$",
      "$b$ is not an integer",
      "$f(n) = n!$ grows faster than any polynomial $n^{\\log_b a + \\epsilon}$, so it violates polynomial boundedness",
      "$T(n)$ has negative terms"
    ],
    "a": 2,
    "x": "Master Theorem requires polynomial differences between $f(n)$ and $n^{\\log_b a}$. Factorial growth $n!$ is super-polynomial, so the recurrence must be solved using recursion trees ($T(n) = \\Theta(n!)$)."
  }
]);

/* ===================================================================
   Module: arrays — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "arrays", [
  {
    "tag": "Kadane's All-Negative Edge Case",
    "lvl": "advanced",
    "q": "Given an array containing only negative integers `[-7, -3, -9, -2, -8]`, what does Kadane's maximum subarray algorithm return?",
    "o": [
      "0",
      "`-2` (the single maximum negative element)",
      "`-29`",
      "`NaN`"
    ],
    "a": 1,
    "x": "Standard Kadane's algorithm initializes `curr_max = arr[0]` and `global_max = arr[0]`. At each step $i$, `curr_max = max(arr[i], curr_max + arr[i])`. For all negative numbers, it returns `max(arr)` = `-2`."
  },
  {
    "tag": "Trapping Rain Water 2-Pointer Proof",
    "lvl": "advanced",
    "q": "In the $O(N)$ time, $O(1)$ space Two-Pointer algorithm for Trapping Rain Water, why can we safely compute trapped water at `left` whenever `left_max < right_max`?",
    "o": [
      "Water level is determined solely by `left_max` because the existance of a taller boundary on the right guarantees water cannot spill over to the right",
      "Because `right_max` is zero",
      "Arrays are sorted",
      "Water only flows left"
    ],
    "a": 0,
    "x": "Water trapped at any index is $\\min(\\text{left\\_max}, \\text{right\\_max}) - \\text{height}[i]$. When $\\text{left\\_max} < \\text{right\\_max}$, the global bottleneck for `left` is definitively `left_max`."
  },
  {
    "tag": "Dutch National Flag Invariant",
    "lvl": "advanced",
    "q": "In Dijkstra's 3-Way Partitioning with pointers `low`, `mid`, `high`, when `arr[mid] == 2` (pivot high) and is swapped with `arr[high]`, why is `mid` NOT incremented?",
    "o": [
      "`mid` is decremented",
      "The element swapped in from `high` has not yet been examined and could be 0, 1, or 2, so `mid` must evaluate it on the next step",
      "`high` pointer was invalid",
      "Infinite loop prevention"
    ],
    "a": 1,
    "x": "The element at `high` is uninspected. Swapping `arr[mid]` and `arr[high]` brings an unknown element to `mid`. Incrementing `high` decrements `high`, but `mid` remains unchanged to classify the newly swapped element."
  },
  {
    "tag": "Prefix XOR Subarray Count",
    "lvl": "advanced",
    "q": "How many subarrays with XOR sum equal to $K$ can be found in $O(N)$ time?",
    "o": [
      "Nested loops $O(N^2)$",
      "Using a hash map storing running prefix XOR frequencies and accumulating `map[pref_xor ^ K]`",
      "Sorting array in $O(N \\log N)$",
      "Two pointers"
    ],
    "a": 1,
    "x": "Because $A \\oplus B = K \\iff A \\oplus K = B$. A subarray between indices $(i, j]$ has XOR sum $K$ if $\\text{pref}[j] \\oplus \\text{pref}[i] = K \\iff \\text{pref}[i] = \\text{pref}[j] \\oplus K$."
  },
  {
    "tag": "Sliding Window Monotonic Deque",
    "lvl": "advanced",
    "q": "To compute the Sliding Window Maximum of size $K$ in $O(N)$ time, what invariant must the double-ended queue maintain?",
    "o": [
      "Indices whose values are in strictly decreasing order from front to back",
      "Values in strictly increasing order",
      "Elements sorted by hash code",
      "FIFO queue"
    ],
    "a": 0,
    "x": "A decreasing monotonic deque ensures the maximum element of the current window is always at the front (`deque.peekFirst()`). Elements smaller than the incoming element are popped from the back."
  },
  {
    "tag": "Boyer-Moore 2-Pass Requirement",
    "lvl": "advanced",
    "q": "Why is a second verification pass mandatory in Boyer-Moore Majority Voting if the problem does not guarantee a majority element exists?",
    "o": [
      "To sort the array",
      "Boyer-Moore will output a survivor candidate even for arrays with no majority (e.g. `[1, 2, 3]`), so a second counting pass is needed to verify count $> \\lfloor N/2 \\rfloor$",
      "To free memory",
      "To find the second majority element"
    ],
    "a": 1,
    "x": "Boyer-Moore cancels out distinct pairs. If no element exceeds $N/2$, an arbitrary candidate survives. A second linear pass counts its actual frequency."
  }
]);

/* ===================================================================
   Module: search — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "search", [
  {
    "tag": "Binary Search Integer Overflow",
    "lvl": "advanced",
    "q": "Why does `int mid = (low + high) / 2;` fail in 32-bit signed integer systems when `low` and `high` are large positive numbers?",
    "o": [
      "Divides by zero",
      "`low + high` exceeds $2^{31}-1$, overflowing to a negative integer and causing out-of-bounds memory access; use `low + (high - low) / 2`",
      "Bit shifts are required",
      "Fails for odd numbers"
    ],
    "a": 1,
    "x": "When `low + high > 2,147,483,647`, 32-bit signed addition overflows to negative values. `low + (high - low) / 2` avoids large sums."
  },
  {
    "tag": "Median of Two Sorted Arrays Partition",
    "lvl": "advanced",
    "q": "In finding the median of two sorted arrays $A$ (size $M$) and $B$ (size $N$, $M \\le N$), what condition defines a valid binary search partition cut $(i, j)$?",
    "o": [
      "$A[i] == B[j]$",
      "$A[i-1] \\le B[j]$ and $B[j-1] \\le A[i]$ where $j = (M + N + 1)/2 - i$",
      "$A[i] + B[j] == 0$",
      "$i == j$"
    ],
    "a": 1,
    "x": "Valid partition divides both arrays into left and right halves of equal total size such that every element in the combined left half is $\\le$ every element in the combined right half: $A[i-1] \\le B[j]$ and $B[j-1] \\le A[i]$."
  },
  {
    "tag": "Rotated Sorted Array with Duplicates",
    "lvl": "advanced",
    "q": "Why does searching in a rotated sorted array degrade from $O(\\log N)$ to $O(N)$ worst-case when duplicate elements exist (e.g. `[1, 0, 1, 1, 1]`)?",
    "o": [
      "Duplicates cause recursion stack overflow",
      "When `arr[low] == arr[mid] == arr[high]`, it is impossible to determine whether the left or right half is sorted, forcing linear boundary shrinking (`low++`, `high--`)",
      "Binary search is undefined on duplicates",
      "Hardware branch prediction fails"
    ],
    "a": 1,
    "x": "When all three boundary values are equal, both halves appear identical. The algorithm cannot discard half the search space and must shrink boundaries by 1 linearly."
  },
  {
    "tag": "Quickselect Expected vs Worst Case",
    "lvl": "advanced",
    "q": "What is the worst-case and average-case time complexity of Quickselect (Hoare's Selection Algorithm)?",
    "o": [
      "Average $O(N \\log N)$, Worst $O(N^2)$",
      "Average $O(N)$, Worst $O(N^2)$",
      "Average $O(\\log N)$, Worst $O(N)$",
      "Average $O(N)$, Worst $O(N \\log N)$"
    ],
    "a": 1,
    "x": "Quickselect recurses only into the partition containing the $K$-th element ($N + N/2 + N/4 + \\dots = 2N = O(N)$). Worst case with bad pivot on sorted array is $O(N^2)$."
  },
  {
    "tag": "Ternary Search Unimodality",
    "lvl": "advanced",
    "q": "Under what strict mathematical condition can Ternary Search find the maximum of a function $f(x)$ on $[L, R]$ in $O(\\log_3 N)$ time?",
    "o": [
      "$f(x)$ must be linear",
      "$f(x)$ must be strictly unimodal (strictly increasing to a unique global maximum, then strictly decreasing)",
      "$f(x)$ must be a polynomial of degree $\\le 2$",
      "$f(x)$ must be periodic"
    ],
    "a": 1,
    "x": "Ternary search divides $[L, R]$ into three equal segments via $m_1, m_2$. If $f(m_1) < f(m_2)$, unimodality guarantees the maximum lies in $[m_1, R]$. Without unimodality, local extrema cause wrong partition pruning."
  }
]);

/* ===================================================================
   Module: trees — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "trees", [
  {
    "tag": "AVL Tree Balance Factor Imbalance",
    "lvl": "advanced",
    "q": "An AVL node has Balance Factor $+2$ (left-heavy), and its left child has Balance Factor $-1$ (right-heavy). What rotation restores balance?",
    "o": [
      "Single Right Rotation",
      "Left-Right (LR) Double Rotation: Left rotation on left child, followed by Right rotation on root",
      "Right-Left (RL) Double Rotation",
      "Single Left Rotation"
    ],
    "a": 1,
    "x": "An LR imbalance occurs when the grandchild in the right subtree of the left child caused the height increase. It requires a Left rotation on the left child to convert to LL, then a Right rotation on the root."
  },
  {
    "tag": "Red-Black Tree Black-Height Invariant",
    "lvl": "advanced",
    "q": "Which property is strictly maintained in all valid Red-Black Trees?",
    "o": [
      "Root must be Red",
      "No path contains more than 3 nodes",
      "Every path from any node to its descendant leaves must contain the exact same number of Black nodes (Black-Height invariant)",
      "Every path contains equal Red nodes"
    ],
    "a": 2,
    "x": "The Black-Height invariant ensures that no path is more than twice as long as any other path, bounding tree height strictly to $\\le 2 \\log_2(N + 1)$."
  },
  {
    "tag": "Segment Tree Lazy Propagation",
    "lvl": "advanced",
    "q": "Why is Lazy Propagation used in Segment Trees supporting range updates?",
    "o": [
      "To save memory from $O(4N)$ to $O(N)$",
      "Without lazy tags, updating a range $[L, R]$ modifies all leaves ($O(N)$); lazy tags store updates at higher nodes and propagate down only when children are explicitly visited ($O(\\log N)$)",
      "To balance the binary tree",
      "To support 64-bit integers"
    ],
    "a": 1,
    "x": "Lazy propagation defers updates to child nodes until a query or another update actually visits them, maintaining $O(\\log N)$ update complexity."
  },
  {
    "tag": "Radix Tree vs Trie Compression",
    "lvl": "advanced",
    "q": "How does a Radix Tree (Patricia Trie) optimize memory compared to a standard 26-ary prefix Trie?",
    "o": [
      "Replaces pointers with integers",
      "Compresses non-branching chains of single-child nodes into single edges containing multi-character strings",
      "Deletes leaf nodes",
      "Stores keys in a hash table"
    ],
    "a": 1,
    "x": "In a standard Trie, strings like `'testing'` create 7 separate nodes with 26 empty pointers each. A Radix Tree collapses single-child chains into a single edge `'testing'`."
  },
  {
    "tag": "Morris Traversal Space Invariant",
    "lvl": "advanced",
    "q": "How does Morris Inorder Traversal achieve $O(1)$ auxiliary space without recursion or stack?",
    "o": [
      "Uses GPU registers",
      "Temporarily creates threaded links from the inorder predecessor's right pointer to the current node, traversing and removing them upon return to restore the original tree structure",
      "Converts tree to array",
      "Uses global variable"
    ],
    "a": 1,
    "x": "Morris Traversal finds the rightmost node of the left subtree (inorder predecessor) and links its `right` pointer to `current`. When revisited, the link is dismantled, restoring original tree pointers in $O(N)$ time, $O(1)$ space."
  },
  {
    "tag": "Tarjan Cut Vertices Bridge Condition",
    "lvl": "advanced",
    "q": "In Tarjan's DFS algorithm on an undirected graph, edge $(u, v)$ is a **Bridge** if and only if:",
    "o": [
      "$\\text{low}[v] \\le \\text{disc}[u]$",
      "$\\text{low}[v] > \\text{disc}[u]$",
      "$\\text{disc}[v] == \\text{disc}[u] + 1$",
      "$\\text{low}[u] == 0$"
    ],
    "a": 1,
    "x": "If $\\text{low}[v] > \\text{disc}[u]$, there is no back-edge from $v$'s subtree to $u$ or any ancestor above $u$. Removing $(u, v)$ strictly disconnects $v$'s subtree from the rest of the graph."
  },
  {
    "tag": "Binary Lifting LCA Preprocessing",
    "lvl": "advanced",
    "q": "In Binary Lifting for LCA on a tree of $N$ nodes, what is the table definition and recurrence for `up[u][i]`?",
    "o": [
      "`up[u][i] = up[u][i-1] + i`",
      "`up[u][i] = up[up[u][i-1]][i-1]` (the $2^{i-1}$-th ancestor of the $2^{i-1}$-th ancestor of $u$ is the $2^i$-th ancestor of $u$)",
      "`up[u][i] = up[u-1][i]`",
      "`up[u][i] = u * 2^i`"
    ],
    "a": 1,
    "x": "Since $2^i = 2^{i-1} + 2^{i-1}$, the $2^i$-th ancestor of $u$ is reached by jumping $2^{i-1}$ steps to $v = \\text{up}[u][i-1]$, then jumping another $2^{i-1}$ steps from $v$: `up[up[u][i-1]][i-1]`."
  },
  {
    "tag": "Heavy-Light Decomposition (HLD)",
    "lvl": "advanced",
    "q": "In Heavy-Light Decomposition (HLD) on a tree with $N$ vertices, what is the maximum number of heavy paths traversed on any path between two arbitrary nodes $u$ and $v$?",
    "o": [
      "$O(N)$",
      "$O(\\log N)$",
      "$O(\\sqrt{N})$",
      "$O(1)$"
    ],
    "a": 1,
    "x": "A heavy child has subtree size $\\ge \\text{subtree}(u)/2$. Moving to a light child strictly halves the remaining tree size. Therefore, any path traverses at most $O(\\log N)$ light edges (heavy path hops), allowing path queries via Segment Tree in $O(\\log^2 N)$."
  },
  {
    "tag": "Centroid Decomposition",
    "lvl": "advanced",
    "q": "What is the maximum depth of a Centroid Decomposition tree for any arbitrary tree with $N$ vertices?",
    "o": [
      "$O(N)$",
      "$O(\\log_2 N)$",
      "$O(\\sqrt{N})$",
      "$O(N \\log N)$"
    ],
    "a": 1,
    "x": "Removing the centroid of a tree partitions it into connected components, each having size at most $\\lfloor N/2 \\rfloor$. Recursing creates a centroid tree of depth at most $O(\\log_2 N)$."
  }
]);

/* ===================================================================
   Module: dp — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "dp", [
  {
    "tag": "Digit DP tight Flag Role",
    "lvl": "advanced",
    "q": "In Digit DP, what does `tight = false` allow the memoization cache to do?",
    "o": [
      "Prune the entire branch",
      "Safely reuse the computed subproblem result across different prefixes because the remaining digit placements $0 \\dots 9$ are unconstrained by upper bound $N$",
      "Throw an exception",
      "Invert the bits"
    ],
    "a": 1,
    "x": "When `tight = false`, the prefix is strictly smaller than $N$, so any digit 0–9 can be placed freely. The result depends only on `(index, mask)` and is safely memoized."
  },
  {
    "tag": "Convex Hull Trick Optimization",
    "lvl": "advanced",
    "q": "What DP transition recurrence form is solvable in $O(N)$ or $O(N \\log N)$ using the Convex Hull Trick?",
    "o": [
      "$DP[i] = \\sum_{j < i} DP[j]$",
      "$DP[i] = \\min_{j < i} (DP[j] + b[j] \\cdot a[i])$ (envelope of linear functions $y = m_j x + c_j$)",
      "$DP[i] = DP[i-1] \\oplus DP[i-2]$",
      "$DP[i] = \\max(DP[i-1], DP[i-2])$"
    ],
    "a": 1,
    "x": "Each previous state $j$ defines a line $y = b[j] x + DP[j]$. The DP query at step $i$ is evaluating the lower envelope of these lines at $x = a[i]$."
  },
  {
    "tag": "TSP Held-Karp Bitmask DP Complexity",
    "lvl": "advanced",
    "q": "What is the exact time complexity of the Held-Karp algorithm for the Travelling Salesperson Problem on $N$ vertices?",
    "o": [
      "$O(N!)$",
      "$O(N^2 2^N)$",
      "$O(2^N)$",
      "$O(N^3)$"
    ],
    "a": 1,
    "x": "There are $2^N$ subsets of visited vertices and $N$ choices for the current ending vertex $\\implies N 2^N$ states. From each state, testing transitions to $N$ unvisited neighbors takes $O(N) \\implies O(N^2 2^N)$ total time."
  },
  {
    "tag": "SOS DP Submask Sums",
    "lvl": "advanced",
    "q": "To compute the sum over all submasks $F[\\text{mask}] = \\sum_{i \\subseteq \\text{mask}} A[i]$ for all $2^N$ masks, what is the time complexity of Sum Over Subsets (SOS DP)?",
    "o": [
      "$O(3^N)$",
      "$O(N 2^N)$",
      "$O(2^N)$",
      "$O(N!)$"
    ],
    "a": 1,
    "x": "Naive iteration over submasks takes $\\sum \\binom{N}{k} 2^k = 3^N$. SOS DP computes partial sums bit-by-bit in $O(N 2^N)$."
  },
  {
    "tag": "Matrix Chain Parenthesization",
    "lvl": "advanced",
    "q": "For matrix chain multiplication with dimension sequence $p = [10, 100, 5, 50]$, what is the minimum scalar multiplication count for $A_1(10 \\times 100) \\times A_2(100 \\times 5) \\times A_3(5 \\times 50)$?",
    "o": [
      "50,000",
      "7,500",
      "15,000",
      "100,000"
    ],
    "a": 1,
    "x": "$(A_1 A_2) A_3 = (10 \\times 100 \\times 5) + (10 \\times 5 \\times 50) = 5,000 + 2,500 = 7,500$ multiplications. $A_1(A_2 A_3) = 25,000 + 50,000 = 75,000$."
  },
  {
    "tag": "LIS Patience Sorting Tails Array",
    "lvl": "advanced",
    "q": "In the $O(N \\log N)$ Patience Sorting algorithm for Longest Increasing Subsequence, what invariant does `tails[k]` maintain?",
    "o": [
      "The exact elements of the LIS",
      "The smallest tail (end element) of all increasing subsequences of length $k+1$ found so far",
      "The sum of elements in the LIS",
      "The index of the largest element"
    ],
    "a": 1,
    "x": "`tails[k]` stores the smallest possible ending value of an increasing subsequence of length $k+1$. This array is strictly increasing, allowing binary search in $O(\\log N)$ per element."
  },
  {
    "tag": "Tree DP Rerooting Technique",
    "lvl": "advanced",
    "q": "In Tree DP Rerooting to compute sum of distances from all nodes to every other node in a tree of size $N$, how is $ans[v]$ computed in $O(1)$ when moving root from $u$ to child $v$?",
    "o": [
      "$ans[v] = ans[u] / 2$",
      "$ans[v] = ans[u] + (N - sz[v]) - sz[v] = ans[u] + N - 2 \\cdot sz[v]$",
      "$ans[v] = ans[u] + N$",
      "$ans[v] = \\sum sz[w]$"
    ],
    "a": 1,
    "x": "When moving the root from $u$ to $v$, $v$'s subtree nodes ($sz[v]$ nodes) become 1 step closer ($-sz[v]$), while all other $N - sz[v]$ nodes become 1 step further ($+ (N - sz[v])$)."
  }
]);

/* ===================================================================
   Module: linear — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "linear", [
  {
    "tag": "LRU Cache O(1) Operations",
    "lvl": "advanced",
    "q": "What data structure combination achieves strict $O(1)$ time for both `get(key)` and `put(key, value)` in an LRU Cache?",
    "o": [
      "Binary Heap + Array",
      "Hash Map + Doubly Linked List",
      "Balanced BST + Queue",
      "Singly Linked List + Stack"
    ],
    "a": 1,
    "x": "Hash map maps `key` to Doubly Linked List node in $O(1)$. Doubly Linked List allows $O(1)$ removal and moving nodes to the head (most recently used) without shifting elements."
  },
  {
    "tag": "LFU Cache O(1) Frequency Lists",
    "lvl": "advanced",
    "q": "How does an LFU (Least Frequently Used) Cache achieve $O(1)$ eviction and update time?",
    "o": [
      "Sorting by frequency in $O(N \\log N)$",
      "Hash Map of keys to nodes + Hash Map of frequencies to Doubly Linked Lists + `min_freq` integer tracker",
      "Priority Queue",
      "Circular Array"
    ],
    "a": 1,
    "x": "Maintaining a hash map `freq_map[f]` mapping each frequency $f$ to a doubly linked list of nodes, alongside `min_freq`, allows instant $O(1)$ lookup, node promotion ($f \\rightarrow f+1$), and eviction from `freq_map[min_freq]`."
  },
  {
    "tag": "Fast & Slow Pointer Cycle Detection Proof",
    "lvl": "advanced",
    "q": "In Floyd's Tortoise and Hare cycle detection algorithm on a linked list with $L_1$ non-cycle nodes and cycle length $C$, where do the two pointers meet?",
    "o": [
      "At the head of the list",
      "Inside the cycle at a point $C - (L_1 \\bmod C)$ steps from the cycle start",
      "At the last node",
      "They never meet"
    ],
    "a": 1,
    "x": "When the slow pointer enters the cycle after $L_1$ steps, fast pointer is at $(2L_1 \\bmod C)$. Fast gains 1 step per iteration, catching slow in $C - (L_1 \\bmod C)$ steps. Resetting one pointer to head and moving both at speed 1 meets at the exact cycle entrance."
  },
  {
    "tag": "Skip List Probabilistic Search",
    "lvl": "advanced",
    "q": "In a Skip List with node promotion probability $p = 1/2$, what is the expected search time and maximum level count for $N$ elements?",
    "o": [
      "Search $O(N)$, Max level $N$",
      "Search $O(\\log N)$, Max level $O(\\log_{1/p} N)$",
      "Search $O(1)$, Max level $10$",
      "Search $O(\\sqrt{N})$, Max level $\\sqrt{N}$"
    ],
    "a": 1,
    "x": "Skip lists build a hierarchy of express lanes. With $p=1/2$, each level has half the nodes of the level below. Expected height is $\\log_2 N$ and expected search time is $O(\\log N)$."
  },
  {
    "tag": "Disjoint Set Union (DSU) Inverse Ackermann",
    "lvl": "advanced",
    "q": "With Path Compression and Union by Rank/Size, what is the amortized time complexity of $M$ operations on $N$ elements in Disjoint Set Union (DSU)?",
    "o": [
      "$O(M \\log N)$",
      "$O(M \\alpha(N))$ where $\\alpha(N)$ is the Inverse Ackermann function ($le 4$ for all physical values of $N$)",
      "$O(M \\sqrt{N})$",
      "$O(M + N)$"
    ],
    "a": 1,
    "x": "Path compression flattens the tree during `find()`, and union by rank prevents tall trees. Together, they achieve $O(\\alpha(N))$ per operation, effectively constant time ($O(1)$ amortized)."
  },
  {
    "tag": "Fenwick Tree (BIT) Point Update / Prefix Query",
    "lvl": "advanced",
    "q": "In a Binary Indexed Tree (Fenwick Tree), how does `query(i)` move to accumulate prefix sum, and how does `update(i, delta)` move to update intervals?",
    "o": [
      "`query`: `i += i & (-i)`, `update`: `i -= i & (-i)`",
      "`query`: `i -= i & (-i)` (stripping lowest set bit), `update`: `i += i & (-i)` (adding lowest set bit)",
      "Both use `i >>= 1`",
      "Both use `i = (i-1)/2`"
    ],
    "a": 1,
    "x": "In a 1-indexed BIT: `query(i)` sums `tree[i]` and strips the lowest set bit (`i -= i & (-i)`) to visit predecessor ranges. `update(i, delta)` adds the lowest set bit (`i += i & (-i)`) to propagate changes up all containing intervals."
  }
]);

/* ===================================================================
   Module: game — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "game", [
  {
    "tag": "Minimax with Alpha-Beta Pruning",
    "lvl": "advanced",
    "q": "In Minimax game tree search with Alpha-Beta pruning, what condition triggers an immediate beta cutoff (pruning remaining branches)?",
    "o": [
      "$\\alpha > \\beta$",
      "$\\alpha \\ge \\beta$ (current child value $\\ge \\beta$ in maximizing node or $\\le \\alpha$ in minimizing node)",
      "$\\alpha == 0$",
      "Depth reaches 100"
    ],
    "a": 1,
    "x": "Alpha is the minimum score the maximizing player is assured of; Beta is the maximum score the minimizing player is assured of. If $\\alpha \\ge \\beta$, the opponent would never allow this branch to be reached, so remaining subtrees are safely pruned."
  },
  {
    "tag": "Sprague-Grundy Theorem (Nim Sum)",
    "lvl": "advanced",
    "q": "According to the Sprague-Grundy theorem for impartial games under normal play convention, a game state with pile sizes $x_1, x_2, \\dots, x_k$ is a **winning state (first player can force a win)** if and only if:",
    "o": [
      "$\\sum x_i$ is odd",
      "The XOR sum (Nim-sum) $x_1 \\oplus x_2 \\oplus \\dots \\oplus x_k \\ne 0$",
      "$\\max(x_i) > 10$",
      "$\\prod x_i \\ne 0$"
    ],
    "a": 1,
    "x": "The Sprague-Grundy theorem proves that every impartial game is equivalent to a single Nim pile whose size is the Grundy value. A state is a winning $N$-position if and only if the XOR sum $\\bigoplus G(x_i) \\ne 0$."
  },
  {
    "tag": "2-SAT Strongly Connected Components",
    "lvl": "advanced",
    "q": "A 2-SAT boolean formula is satisfiable if and only if for every variable $x$:",
    "o": [
      "$x$ and $\\neg x$ have equal frequency",
      "$x$ and $\\neg x$ do NOT belong to the same Strongly Connected Component (SCC) in the implication graph",
      "$x$ implies `true`",
      "The graph is a DAG"
    ],
    "a": 1,
    "x": "If $x$ and $\\neg x$ are in the same SCC, $x \\implies \\neg x$ and $\\neg x \\implies x$, which is a logical contradiction. 2-SAT is solved in linear time $O(V + E)$ using Tarjan's or Kosaraju's SCC algorithm."
  },
  {
    "tag": "Dinic's Maximum Flow Unit Networks",
    "lvl": "advanced",
    "q": "What is the time complexity of Dinic's Algorithm for Maximum Flow on unit networks (networks where all edge capacities are 1)?",
    "o": [
      "$O(V^2 E)$",
      "$O(E \\sqrt{V})$",
      "$O(V E^2)$",
      "$O(V^3)$"
    ],
    "a": 1,
    "x": "In unit networks, each phase builds a level graph and augmenting paths in $O(E)$. The number of phases is bounded by $O(\\sqrt{V})$, yielding an overall time complexity of $O(E \\sqrt{V})$."
  },
  {
    "tag": "Hopcroft-Karp Bipartite Matching",
    "lvl": "advanced",
    "q": "What is the worst-case time complexity of the Hopcroft-Karp algorithm for Maximum Bipartite Matching?",
    "o": [
      "$O(V E)$",
      "$O(E \\sqrt{V})$",
      "$O(V^3)$",
      "$O(E \\log V)$"
    ],
    "a": 1,
    "x": "Hopcroft-Karp uses BFS to find multiple vertex-disjoint shortest augmenting paths simultaneously in each phase, terminating in $O(\\sqrt{V})$ phases $\\implies O(E \\sqrt{V})$ total time."
  }
]);

/* ===================================================================
   Module: room — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dsa", "room", [
  {
    "tag": "KMP String Matching Pi Array",
    "lvl": "advanced",
    "q": "In the Knuth-Morris-Pratt (KMP) string matching algorithm, what does the prefix function $\\pi[i]$ (LPS array) store for pattern $P[0 \\dots i]$?",
    "o": [
      "The frequency of character $P[i]$",
      "The length of the longest proper prefix of $P[0 \\dots i]$ that is also a suffix of $P[0 \\dots i]$",
      "The hash code of substring",
      "The index of the next vowel"
    ],
    "a": 1,
    "x": "$\\pi[i]$ is the length of the longest proper prefix matching a proper suffix of $P[0 \\dots i]$. When a mismatch occurs at $P[j]$, KMP shifts the pattern to $j = \\pi[j-1]$, achieving $O(N + M)$ total matching time without backtracking text pointers."
  },
  {
    "tag": "Z-Algorithm Match Invariant",
    "lvl": "advanced",
    "q": "What does the Z-array value $Z[i]$ represent for string $S$ of length $N$?",
    "o": [
      "The number of palindromes ending at $i$",
      "The length of the longest substring starting at $S[i]$ that is a prefix of $S$",
      "The edit distance to empty string",
      "The count of unique characters"
    ],
    "a": 1,
    "x": "$Z[i]$ is the length of the longest common prefix between $S$ and the suffix of $S$ starting at $i$. Computed in $O(N)$ time using a sliding match window $[L, R]$."
  },
  {
    "tag": "Aho-Corasick Multi-Pattern Automaton",
    "lvl": "advanced",
    "q": "How does the Aho-Corasick automaton achieve $O(N + \\text{matches})$ time when searching for $K$ distinct dictionary patterns in text of length $N$?",
    "o": [
      "Runs KMP $K$ times sequentially",
      "Constructs a Trie of all patterns augmented with **Failure links** (analogous to KMP $\\pi$ array on tree) and **Output/Dictionary suffix links**, traversing text in a single DFA pass",
      "Uses regex backtracking",
      "Hashes all 3-character n-grams"
    ],
    "a": 1,
    "x": "Aho-Corasick builds a Trie with failure transitions computed via BFS. If a character mismatch occurs, the automaton follows failure links to the longest matching suffix node, matching all $K$ patterns simultaneously in a single linear text sweep."
  },
  {
    "tag": "Manacher's Algorithm Palindromes",
    "lvl": "advanced",
    "q": "How does Manacher's Algorithm find the longest palindromic substring in strictly $O(N)$ time?",
    "o": [
      "Expands around all $N^2$ centers",
      "Transforms the string with delimiter `#` to handle even lengths and uses palindrome symmetry around current center $C$ and right boundary $R$ to initialize radius $P[i] = \\min(R - i, P[2C - i])$ in $O(1)$",
      "Uses suffix trees",
      "Dynamic programming table $O(N^2)$"
    ],
    "a": 1,
    "x": "Manacher's algorithm leverages the mirror property $i' = 2C - i$. If $i < R$, the palindrome radius at $i$ is at least $\\min(R - i, P[i'])$, avoiding redundant character comparisons and achieving strict $O(N)$ time."
  },
  {
    "tag": "Suffix Automaton (SAM) State Minimality",
    "lvl": "advanced",
    "q": "For a string $S$ of length $N$, what is the maximum number of states (vertices) and transitions (edges) in its minimal deterministic Suffix Automaton (SAM)?",
    "o": [
      "$N^2$ states, $N^2$ transitions",
      "At most $2N - 1$ states and $3N - 4$ transitions",
      "$N!$ states",
      "$2^N$ states"
    ],
    "a": 1,
    "x": "A Suffix Automaton (SAM) represents all $O(N^2)$ substrings of $S$ in a minimal directed acyclic word graph (DAWG) with at most $2N - 1$ states and $3N - 4$ edges, constructible in online $O(N)$ time."
  }
]);

