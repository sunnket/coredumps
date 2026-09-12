(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
{
      slug: "insertion-sort",
      why: {
        before: "Early sorting implementations relied on naive bubble exchanges or required complex recursive divide-and-conquer machinery (Merge Sort, Quick Sort) that introduced non-trivial recursion stack overhead and cache misses on small arrays.",
        problem: "Recursive divide-and-conquer algorithms exhibit significant constant-factor overhead for small sub-arrays ($N \\le 32$ to $64$), where function calls, pointer chasing, and auxiliary memory allocation dwarf comparison costs.",
        shift: "Insertion Sort builds a sorted prefix incrementally by inserting each incoming element into its proper position via reverse shifting, running in optimal O(N) time on nearly-sorted data with strictly O(1) memory, serving as the critical base-case engine of modern hybrid sorts like Timsort and Introsort."
      },
      num: {
        t: "Sorting Algorithms Performance in Small & Adaptive Contexts",
        h: ["Algorithm", "Best Case (Sorted)", "Average Case", "Worst Case", "Auxiliary Space"],
        r: [
          ["Insertion Sort", "O(N) linear", "O(N^2)", "O(N^2) inversions", "O(1) strict"],
          ["Bubble Sort", "O(N) with flag", "O(N^2)", "O(N^2)", "O(1) strict"],
          ["Selection Sort", "O(N^2)", "O(N^2)", "O(N^2)", "O(1) strict"],
          ["Quick Sort", "O(N log N)", "O(N log N)", "O(N^2)", "O(log N) stack"],
          ["Timsort (Hybrid Insertion)", "O(N) linear", "O(N log N)", "O(N log N)", "O(N) buffer"]
        ],
        n: "Insertion sort performs $O(N + I)$ operations, where $I$ is the number of inversions in the array. When an array is nearly sorted ($I = O(N)$), runtime is strictly linear $O(N)$. Modern runtimes switch from Quicksort/Mergesort to Insertion Sort when partition size $N \\le 16-32$."
      },
      miss: [
        {
          w: "Insertion sort is completely obsolete and should never be used in modern production software.",
          r: "Production sorting runtimes (V8 `Array.prototype.sort`, Python `list.sort`, Java `Arrays.sort`) switch to Insertion Sort or Binary Insertion Sort for partitions under 32 elements due to superior CPU cache locality and zero call overhead."
        },
        {
          w: "Using binary search to find insertion points reduces total runtime to O(N log N).",
          r: "While Binary Insertion Sort reduces element comparisons to $O(N \\log N)$, shifting array elements to make space still requires $O(N^2)$ data movements."
        },
        {
          w: "Insertion sort is an unstable sorting algorithm.",
          r: "Insertion sort is naturally stable: it shifts elements strictly greater than the key (`array[j] > key`), preserving the original relative order of equal elements."
        },
        {
          w: "Selection sort and insertion sort have identical performance on sorted inputs.",
          r: "Selection sort always scans the entire remaining array regardless of order, taking $\\Theta(N^2)$ comparisons; insertion sort immediately halts inner loops, achieving $O(N)$ best-case."
        }
      ],
      trade: {
        buys: [
          "Strict linear $O(N)$ runtime on pre-sorted or nearly-sorted datasets with few inversions.",
          "Optimal performance on small datasets ($N < 32$) with near-zero branch mispredictions and L1 cache friendliness.",
          "Truly online sorting: seamlessly processes data elements one by one as they arrive.",
          "In-place operation with strictly $O(1)$ auxiliary memory overhead and stable ordering."
        ],
        costs: [
          "Quadratic $O(N^2)$ runtime and comparison scaling on reverse-sorted or random large collections.",
          "High number of memory writes/shifts compared to Selection Sort's $O(N)$ writes.",
          "Inefficient on linked list nodes without direct pointer manipulation optimizations.",
          "Completely impractical as a standalone general-purpose sort for $N > 1000$ elements."
        ],
        avoid: [
          "Avoid using insertion sort as a general-purpose standalone sorter for large unstructured datasets.",
          "Avoid swapping elements pairwise in the inner loop; use single key caching with multi-shift assignment.",
          "Avoid reimplementing insertion sort when standard library hybrid algorithms (Timsort, Introsort) already incorporate it.",
          "Avoid using unstable sorting variants when preserving relative order of multi-field records is necessary."
        ]
      }
    },
    {
      slug: "grid-dp",
      why: {
        before: "Finding optimal paths or counting routes on 2D grids required exhaustive recursive backtracking or depth-first searches, leading to exponential $O(2^{M+N})$ branches that revisited identical spatial subproblems repeatedly.",
        problem: "In robot path planning, game AI grid navigation, and financial matrix cost optimization, exponential path exploration causes immediate stack overflow or seconds of latency on modest $100 \\times 100$ grids.",
        shift: "Grid Dynamic Programming (Grid DP) models the 2D grid as a Directed Acyclic Graph (DAG) with topological flow (e.g., right and down), memoizing optimal subproblem solutions in a table where cell $(i, j)$ depends strictly on $(i-1, j)$ and $(i, j-1)$, computing optimal outcomes in linear $O(M \\times N)$ time with $O(N)$ space."
      },
      num: {
        t: "2D Grid Optimization Approaches Breakdown",
        h: ["Strategy", "Time Complexity", "Auxiliary Space (Naive)", "Auxiliary Space (Optimized)", "Cycle Handling"],
        r: [
          ["Recursive DFS (No Memo)", "O(2^(M+N))", "O(M + N) stack", "O(M + N) stack", "Infinite loop risk without visited"],
          ["Memoized Top-Down DP", "O(M * N)", "O(M * N) cache + stack", "O(M * N)", "Requires DAG structure"],
          ["Bottom-Up 2D Table DP", "O(M * N)", "O(M * N) matrix", "O(M * N)", "Strictly DAG order"],
          ["Row-Compressed 1D DP", "O(M * N)", "O(N) single row buffer", "O(min(M, N))", "Strictly DAG order"],
          ["Dijkstra / A* Search", "O(M*N log(M*N))", "O(M * N) priority queue", "O(M * N)", "Handles cycles & arbitrary weights"]
        ],
        n: "For unique paths with obstacles, $DP[i][j] = DP[i-1][j] + DP[i][j-1]$ (or $0$ if obstacle). Since computing row $i$ only requires values from row $i-1$ and the current row, space compresses to a single 1D array: $DP[j] = DP[j] + DP[j-1]$, dropping memory from $O(M \\times N)$ to $O(N)$."
      },
      miss: [
        {
          w: "Grid DP can find shortest paths on grids that permit movement in all 4 directions (up, down, left, right).",
          r: "Grid DP requires a Directed Acyclic Graph (DAG) topological ordering; allowing movement in all 4 directions introduces cyclic dependencies, requiring BFS (for unweighted) or Dijkstra / A* (for weighted)."
        },
        {
          w: "Grid DP always requires allocating a full 2D array of size M x N.",
          r: "Because cell $(i, j)$ only references the current row and the immediately preceding row, rolling array or single 1D buffer techniques reduce memory to $O(\\min(M, N))$."
        },
        {
          w: "Top-down memoization and bottom-up iterative DP consume identical memory.",
          r: "Top-down memoization incurs significant call-stack overhead and hash map lookup costs, whereas bottom-up DP uses flat contiguous array buffers with optimal cache line prefetching."
        },
        {
          w: "Boundary conditions (row 0, column 0) should be checked inside the main loop with if-statements.",
          r: "Checking boundaries inside the core loop causes branch mispredictions; pre-initializing row 0 and column 0 or using 1-indexed DP tables with dummy padding eliminates inner branching."
        }
      ],
      trade: {
        buys: [
          "Reduces exponential $O(2^{M+N})$ path enumeration down to deterministic polynomial $O(M \\times N)$ runtime.",
          "Spatial compression allows running across massive grids ($10^5$ cells) in mere kilobytes of RAM ($O(N)$).",
          "Cache-friendly sequential memory traversal across contiguous row strides.",
          "Easily tracks path reconstruction by storing backtracking directional pointers."
        ],
        costs: [
          "Limited strictly to acyclic directional transitions (e.g., down, right, diagonal forward).",
          "Cannot handle negative edge cycles or arbitrary multi-directional graphs.",
          "Space optimization to $O(N)$ prevents direct path reconstruction without checkpointing or divide-and-conquer (Hirschberg).",
          "Integer overflow when counting combinations on large grids requires 64-bit integers or modulo arithmetic."
        ],
        avoid: [
          "Avoid allocating full $M \\times N$ matrices when only the final scalar result (min cost / path count) is needed.",
          "Avoid using Grid DP when edges have backward loops; use Dijkstra or A* search instead.",
          "Avoid checking row and column boundaries inside the innermost loop; pad the DP table with boundary sentinels.",
          "Avoid naive recursion without memoization on grids larger than $15 \\times 15$."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
