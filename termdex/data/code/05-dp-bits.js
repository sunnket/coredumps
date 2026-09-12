/* Code Dojo — Dynamic programming, bit manipulation, maths and greedy.

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
      id: "climbing-stairs",
      title: "Climbing Stairs",
      diff: "Easy",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Adobe", "Apple", "Google"],
      freq: 5,
      statement: "You are climbing a staircase with `n` steps. Each move you may climb 1 or 2 steps. In how many distinct ways can you reach the top?",
      examples: [
        ["n = 2", "2", "1+1 or 2."],
        ["n = 3", "3", "1+1+1, 1+2, 2+1."]
      ],
      constraints: ["1 <= n <= 45"],
      hints: [
        "To arrive at step n you came from step n-1 or step n-2.",
        "So ways(n) = ways(n-1) + ways(n-2) - the Fibonacci recurrence.",
        "You only need the previous two values, not the whole table."
      ],
      approach: "Fibonacci in disguise. Every path to step n arrives from either n-1 or n-2, so the counts add. A full DP array works, but since each value depends only on the two before it, two rolling variables are enough - O(1) space. Naive recursion without memoisation is exponential and is the answer interviewers are hoping you avoid.",
      time: "O(n)",
      space: "O(1)",
      solution: "def climb_stairs(n):\n    prev, current = 1, 1\n\n    for _ in range(n - 1):\n        prev, current = current, prev + current\n\n    return current",
      tests: [
        "climb_stairs(2) == 2",
        "climb_stairs(3) == 3",
        "climb_stairs(1) == 1",
        "climb_stairs(10) == 89"
      ]
    },
    {
      id: "house-robber",
      title: "House Robber",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Meta", "LinkedIn"],
      freq: 5,
      statement: "You are given an array `nums` of money in each house along a street. You cannot rob two adjacent houses. Return the maximum you can steal.",
      examples: [
        ["nums = [1, 2, 3, 1]", "4", "Rob house 0 and house 2."],
        ["nums = [2, 7, 9, 3, 1]", "12", "Rob houses 0, 2 and 4."]
      ],
      constraints: ["1 <= len(nums) <= 100", "0 <= nums[i] <= 400"],
      hints: [
        "At each house the choice is binary: rob it, or skip it.",
        "Robbing it means you must add the best total from two houses back.",
        "best(i) = max(best(i-1), best(i-2) + nums[i])."
      ],
      approach: "Linear DP with two rolling variables. `current` is the best haul through the previous house and `prev` the best through the one before that. For each house you either skip it (keep `current`) or rob it (`prev + num`); the tuple assignment shifts the window forward in one step. Greedy 'take every other house' fails on inputs like [2, 1, 1, 2].",
      time: "O(n)",
      space: "O(1)",
      solution: "def rob(nums):\n    prev, current = 0, 0\n\n    for num in nums:\n        prev, current = current, max(current, prev + num)\n\n    return current",
      tests: ["rob([1, 2, 3, 1]) == 4", "rob([2, 7, 9, 3, 1]) == 12", "rob([2, 1, 1, 2]) == 4"]
    },
    {
      id: "house-robber-ii",
      title: "House Robber II",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Microsoft"],
      freq: 4,
      statement: "Same as House Robber, except the houses are arranged in a **circle** - the first and last are adjacent, so you cannot rob both.",
      examples: [
        ["nums = [2, 3, 2]", "3", "You cannot take houses 0 and 2, so just take 3."],
        ["nums = [1, 2, 3, 1]", "4", ""]
      ],
      constraints: ["1 <= len(nums) <= 100", "0 <= nums[i] <= 1000"],
      hints: [
        "The circle only adds one rule: house 0 and the last house cannot both be robbed.",
        "So any valid plan skips at least one of them.",
        "Run the linear solution twice - once excluding the last house, once excluding the first."
      ],
      approach: "Reduce the circle to two straight lines. Every valid plan either leaves out the first house or the last, so the answer is the better of `rob(nums[:-1])` and `rob(nums[1:])`. The single-house case needs a guard, since one of those slices would be empty. Everything else is the linear House Robber recurrence unchanged.",
      time: "O(n)",
      space: "O(1)",
      solution: "def rob_circular(nums):\n    if len(nums) == 1:\n        return nums[0]\n\n    def rob_line(houses):\n        prev, current = 0, 0\n        for num in houses:\n            prev, current = current, max(current, prev + num)\n        return current\n\n    return max(rob_line(nums[:-1]), rob_line(nums[1:]))",
      tests: [
        "rob_circular([2, 3, 2]) == 3",
        "rob_circular([1, 2, 3, 1]) == 4",
        "rob_circular([5]) == 5"
      ]
    },
    {
      id: "coin-change",
      title: "Coin Change",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Meta", "Uber", "Goldman Sachs"],
      freq: 5,
      statement: "Given coin denominations `coins` and a target `amount`, return the fewest coins needed to make that amount. Return -1 if it cannot be made. You have unlimited coins of each type.",
      examples: [
        ["coins = [1, 2, 5], amount = 11", "3", "5 + 5 + 1."],
        ["coins = [2], amount = 3", "-1", "Impossible."]
      ],
      constraints: ["1 <= len(coins) <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      hints: [
        "Greedy (always take the biggest coin) fails - try coins [1, 3, 4] and amount 6.",
        "Build up every amount from 0 to the target.",
        "dp[value] = 1 + min(dp[value - coin]) over all coins that fit."
      ],
      approach: "Bottom-up DP over every amount. `dp[v]` is the fewest coins summing to v, seeded with an impossible sentinel (`amount + 1`) so unreachable values stay detectable. For each amount, try every coin and take the best sub-result plus one. A leftover sentinel at the end means the amount cannot be formed. Greedy is the classic wrong answer here - denominations like [1, 3, 4] break it.",
      time: "O(amount * coins)",
      space: "O(amount)",
      solution: "def coin_change(coins, amount):\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n\n    for value in range(1, amount + 1):\n        for coin in coins:\n            if coin <= value:\n                dp[value] = min(dp[value], dp[value - coin] + 1)\n\n    return dp[amount] if dp[amount] <= amount else -1",
      tests: [
        "coin_change([1, 2, 5], 11) == 3",
        "coin_change([2], 3) == -1",
        "coin_change([1, 3, 4], 6) == 2",
        "coin_change([1], 0) == 0"
      ]
    },
    {
      id: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Microsoft", "Meta"],
      freq: 4,
      statement: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence. Elements need not be contiguous.",
      examples: [
        ["nums = [10, 9, 2, 5, 3, 7, 101, 18]", "4", "[2, 3, 7, 101]."],
        ["nums = [7, 7, 7, 7]", "1", "Strictly increasing, so only one element counts."]
      ],
      constraints: [
        "1 <= len(nums) <= 2500",
        "-10^4 <= nums[i] <= 10^4",
        "Follow-up: can you do O(n log n)?"
      ],
      hints: [
        "The O(n^2) DP is dp[i] = 1 + max(dp[j]) for j < i with nums[j] < nums[i].",
        "For O(n log n): keep `tails[k]` = smallest possible tail of an increasing run of length k+1.",
        "That array is always sorted, so binary search finds the slot to overwrite."
      ],
      approach: "Patience sorting. `tails` holds the smallest possible ending value for an increasing subsequence of each length, which keeps it sorted. `bisect_left` finds where the current number belongs: past the end means it extends the longest run, otherwise it replaces a larger tail, keeping future options open. `tails` is not itself a valid subsequence - only its length is the answer.",
      time: "O(n log n)",
      space: "O(n)",
      solution: "import bisect\n\n\ndef length_of_lis(nums):\n    tails = []\n\n    for num in nums:\n        index = bisect.bisect_left(tails, num)\n        if index == len(tails):\n            tails.append(num)\n        else:\n            tails[index] = num\n\n    return len(tails)",
      tests: [
        "length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) == 4",
        "length_of_lis([7, 7, 7, 7]) == 1",
        "length_of_lis([0, 1, 0, 3, 2, 3]) == 4"
      ]
    },
    {
      id: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Microsoft", "Adobe"],
      freq: 4,
      statement: "Given two strings `text1` and `text2`, return the length of their longest common subsequence - characters appearing in both in the same relative order, not necessarily contiguous. Return 0 if there is none.",
      examples: [
        ["text1 = \"abcde\", text2 = \"ace\"", "3", "\"ace\"."],
        ["text1 = \"abc\", text2 = \"def\"", "0", ""]
      ],
      constraints: ["1 <= len(text1), len(text2) <= 1000", "Lowercase English characters"],
      hints: [
        "Compare the two strings one character at a time from the front.",
        "Matching characters both advance and add 1 to the answer.",
        "Otherwise take the better of skipping one character from either string."
      ],
      approach: "Classic 2D grid DP. `dp[i][j]` is the LCS length for the first i characters of text1 and first j of text2. Equal characters extend the diagonal result by 1; otherwise drop a character from one side and keep the better outcome. The extra row and column of zeros represent an empty string, which removes all the boundary special cases.",
      time: "O(m * n)",
      space: "O(m * n)",
      solution: "def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i - 1] == text2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n\n    return dp[m][n]",
      tests: [
        "longest_common_subsequence(\"abcde\", \"ace\") == 3",
        "longest_common_subsequence(\"abc\", \"def\") == 0",
        "longest_common_subsequence(\"abc\", \"abc\") == 3"
      ]
    },
    {
      id: "word-break",
      title: "Word Break",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Meta", "Uber", "Bloomberg"],
      freq: 5,
      statement: "Given a string `s` and a dictionary `word_dict`, return `True` if `s` can be segmented into a sequence of one or more dictionary words. Words may be reused.",
      examples: [
        ["s = \"leetcode\", word_dict = [\"leet\",\"code\"]", "True", ""],
        [
          "s = \"catsandog\", word_dict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
          "False",
          ""
        ]
      ],
      constraints: ["1 <= len(s) <= 300", "1 <= len(word_dict) <= 1000", "All strings are lowercase"],
      hints: [
        "dp[i] answers: can the first i characters be segmented?",
        "dp[0] is True - the empty string is trivially segmentable.",
        "dp[i] is True if some j < i has dp[j] True and s[j:i] in the dictionary."
      ],
      approach: "Prefix DP. `dp[i]` records whether `s[:i]` splits cleanly. For each end position, scan every earlier split point: if the prefix up to `j` was valid and `s[j:i]` is a dictionary word, position i is reachable too. Converting the list to a set makes each lookup O(1); greedily taking the longest match instead fails on inputs like \"catsandog\".",
      time: "O(n^2 * L)",
      space: "O(n)",
      solution: "def word_break(s, word_dict):\n    words = set(word_dict)\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n\n    return dp[len(s)]",
      tests: [
        "word_break(\"leetcode\", [\"leet\", \"code\"]) is True",
        "word_break(\"catsandog\", [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]) is False",
        "word_break(\"applepenapple\", [\"apple\", \"pen\"]) is True"
      ]
    },
    {
      id: "unique-paths",
      title: "Unique Paths",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Google", "Meta", "Bloomberg"],
      freq: 4,
      statement: "A robot starts at the top-left of an m x n grid and can only move right or down. How many distinct paths take it to the bottom-right corner?",
      examples: [
        ["m = 3, n = 7", "28", ""],
        ["m = 3, n = 2", "3", ""]
      ],
      constraints: ["1 <= m, n <= 100", "The answer fits in a 32-bit integer"],
      hints: [
        "Paths to a cell = paths from above + paths from the left.",
        "The whole top row and left column have exactly one path each.",
        "You only ever need the previous row, so one array is enough."
      ],
      approach: "Grid DP compressed to a single row. Each cell's count is the sum of the cell above and the cell to the left; iterating row by row, `row[c]` already holds the value from above, so `row[c] += row[c - 1]` folds in the left neighbour. Initialising to all 1s encodes the first row. Combinatorially the answer is C(m+n-2, m-1) if you prefer the O(1) formula.",
      time: "O(m * n)",
      space: "O(n)",
      solution: "def unique_paths(m, n):\n    row = [1] * n\n\n    for _ in range(m - 1):\n        for c in range(1, n):\n            row[c] += row[c - 1]\n\n    return row[n - 1]",
      tests: ["unique_paths(3, 7) == 28", "unique_paths(3, 2) == 3", "unique_paths(1, 1) == 1"]
    },
    {
      id: "jump-game",
      title: "Jump Game",
      diff: "Medium",
      pattern: "Greedy",
      companies: ["Amazon", "Meta", "Microsoft", "Adobe"],
      freq: 4,
      statement: "You are given an array `nums` where each element is the maximum jump length from that position. Starting at index 0, return `True` if you can reach the last index.",
      examples: [
        ["nums = [2, 3, 1, 1, 4]", "True", "Jump 1 to index 1, then 3 to the end."],
        ["nums = [3, 2, 1, 0, 4]", "False", "You always land on index 3, which cannot move."]
      ],
      constraints: ["1 <= len(nums) <= 10^4", "0 <= nums[i] <= 10^5"],
      hints: [
        "You do not need the exact path - just how far you can possibly get.",
        "Track the furthest reachable index while scanning left to right.",
        "If your current index ever exceeds that reach, you are stuck."
      ],
      approach: "Greedy reachability. Maintain the furthest index reachable so far; at each position, first check that it is actually reachable (`i > reach` means a gap you can never cross), then extend the reach with `i + nums[i]`. Surviving the whole scan proves the end is reachable. This is O(n) and beats the O(n^2) DP that asks 'is index i reachable' for every pair.",
      time: "O(n)",
      space: "O(1)",
      solution: "def can_jump(nums):\n    reach = 0\n\n    for i, num in enumerate(nums):\n        if i > reach:\n            return False\n        reach = max(reach, i + num)\n\n    return True",
      tests: [
        "can_jump([2, 3, 1, 1, 4]) is True",
        "can_jump([3, 2, 1, 0, 4]) is False",
        "can_jump([0]) is True"
      ]
    },
    {
      id: "maximum-product-subarray",
      title: "Maximum Product Subarray",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "LinkedIn", "Google", "Microsoft"],
      freq: 4,
      statement: "Given an integer array `nums`, find the contiguous subarray with the largest **product** and return that product.",
      examples: [
        ["nums = [2, 3, -2, 4]", "6", "[2, 3] gives 6."],
        ["nums = [-2, 0, -1]", "0", ""]
      ],
      constraints: ["1 <= len(nums) <= 2 * 10^4", "The answer fits in a 32-bit integer"],
      hints: [
        "Kadane's does not transfer directly - a negative number flips everything.",
        "The smallest (most negative) product can become the largest after one more negative.",
        "Track the running maximum AND minimum at each index."
      ],
      approach: "Kadane's with two running values. Because multiplying by a negative swaps the roles of maximum and minimum, you must carry both. At each step the three candidates are the number alone, `max * num`, and `min * num`; take the max and min of those. Computing both from the *old* values in a single step is what keeps this correct - update them simultaneously, not sequentially.",
      time: "O(n)",
      space: "O(1)",
      solution: "def max_product(nums):\n    best = nums[0]\n    current_max = nums[0]\n    current_min = nums[0]\n\n    for num in nums[1:]:\n        candidates = (num, current_max * num, current_min * num)\n        current_max = max(candidates)\n        current_min = min(candidates)\n        best = max(best, current_max)\n\n    return best",
      tests: [
        "max_product([2, 3, -2, 4]) == 6",
        "max_product([-2, 0, -1]) == 0",
        "max_product([-2, 3, -4]) == 24"
      ]
    },
    {
      id: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Meta", "Google", "eBay"],
      freq: 3,
      statement: "Given an integer array `nums`, return `True` if it can be split into two subsets with equal sums.",
      examples: [
        ["nums = [1, 5, 11, 5]", "True", "[1, 5, 5] and [11]."],
        ["nums = [1, 2, 3, 5]", "False", ""]
      ],
      constraints: ["1 <= len(nums) <= 200", "1 <= nums[i] <= 100"],
      hints: [
        "An odd total can never split evenly - reject it immediately.",
        "Otherwise the question becomes: can any subset sum to total // 2?",
        "That is the 0/1 knapsack problem; a set of reachable sums solves it neatly."
      ],
      approach: "Subset-sum via a set of reachable totals. Start with {0}; each number adds itself to every sum already reachable. Capping at `target` keeps the set small, and finding `target` allows an early exit. A boolean DP array iterated backwards is the equivalent formulation - the set version is just shorter to write under pressure.",
      time: "O(n * target)",
      space: "O(target)",
      solution: "def can_partition(nums):\n    total = sum(nums)\n    if total % 2:\n        return False\n\n    target = total // 2\n    possible = {0}\n\n    for num in nums:\n        possible |= {value + num for value in possible if value + num <= target}\n        if target in possible:\n            return True\n\n    return target in possible",
      tests: [
        "can_partition([1, 5, 11, 5]) is True",
        "can_partition([1, 2, 3, 5]) is False",
        "can_partition([2, 2]) is True"
      ]
    },
    {
      id: "edit-distance",
      title: "Edit Distance",
      diff: "Hard",
      pattern: "Dynamic Programming",
      companies: ["Google", "Amazon", "Meta", "Microsoft", "Uber"],
      freq: 4,
      statement: "Given two strings `word1` and `word2`, return the minimum number of single-character insertions, deletions or replacements needed to turn word1 into word2.",
      examples: [
        ["word1 = \"horse\", word2 = \"ros\"", "3", "horse -> rorse -> rose -> ros."],
        ["word1 = \"intention\", word2 = \"execution\"", "5", ""]
      ],
      constraints: ["0 <= len(word1), len(word2) <= 500", "Lowercase English letters"],
      hints: [
        "dp[i][j] is the cost to convert the first i characters into the first j.",
        "Matching characters cost nothing - inherit the diagonal.",
        "Otherwise pay 1 plus the cheapest of delete (up), insert (left) or replace (diagonal)."
      ],
      approach: "The Levenshtein distance grid. Seed the first row and column with 0..n, the cost of building a string from nothing. Then for each pair: equal characters inherit the diagonal for free, and otherwise all three edits cost 1 plus their respective neighbour - up is a delete, left an insert, diagonal a replace. The answer sits at `dp[m][n]`.",
      time: "O(m * n)",
      space: "O(m * n)",
      solution: "def min_distance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n\n    return dp[m][n]",
      tests: [
        "min_distance(\"horse\", \"ros\") == 3",
        "min_distance(\"intention\", \"execution\") == 5",
        "min_distance(\"\", \"abc\") == 3"
      ]
    },
    {
      id: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Microsoft", "Meta", "Google", "Wayfair"],
      freq: 5,
      statement: "Given a string `s`, return the longest substring of `s` that is a palindrome.",
      examples: [
        ["s = \"babad\"", "\"bab\"", "\"aba\" is equally valid."],
        ["s = \"cbbd\"", "\"bb\"", ""]
      ],
      constraints: ["1 <= len(s) <= 1000", "s consists of digits and English letters"],
      hints: [
        "Checking every substring is O(n^3) - too slow.",
        "Every palindrome has a centre. Grow outward from each possible centre.",
        "There are 2n - 1 centres: n single characters and n - 1 gaps between them."
      ],
      approach: "Expand around centres. Each palindrome is determined by its middle, so try all 2n-1 centres and stretch outward while the characters match. The two calls per index handle odd-length palindromes (centred on a character) and even-length ones (centred between two). Tracking only the best start/end indices avoids building substrings you throw away.",
      time: "O(n^2)",
      space: "O(1)",
      solution: "def longest_palindrome(s):\n    if not s:\n        return \"\"\n\n    start, end = 0, 0\n\n    def expand(left, right):\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            left -= 1\n            right += 1\n        return left + 1, right - 1\n\n    for i in range(len(s)):\n        l1, r1 = expand(i, i)\n        if r1 - l1 > end - start:\n            start, end = l1, r1\n\n        l2, r2 = expand(i, i + 1)\n        if r2 - l2 > end - start:\n            start, end = l2, r2\n\n    return s[start:end + 1]",
      tests: [
        "longest_palindrome(\"babad\") in (\"bab\", \"aba\")",
        "longest_palindrome(\"cbbd\") == \"bb\"",
        "longest_palindrome(\"a\") == \"a\""
      ]
    },
    {
      id: "single-number",
      title: "Single Number",
      diff: "Easy",
      pattern: "Bit Manipulation",
      companies: ["Amazon", "Google", "Meta", "Airbnb"],
      freq: 4,
      statement: "Given a non-empty array where every element appears twice except for one, find that single element. Your solution must be linear time and use constant extra space.",
      examples: [
        ["nums = [2, 2, 1]", "1", ""],
        ["nums = [4, 1, 2, 1, 2]", "4", ""]
      ],
      constraints: [
        "1 <= len(nums) <= 3 * 10^4",
        "Every element appears twice except one",
        "O(1) extra space"
      ],
      hints: [
        "A hash map solves it, but that is O(n) space.",
        "XOR has two useful properties: x ^ x == 0 and x ^ 0 == x.",
        "XOR is also commutative, so the order of the array does not matter."
      ],
      approach: "XOR everything together. Each pair cancels to 0 regardless of position, and 0 XOR the lone value leaves that value. It runs in one pass with a single accumulator - no dictionary, no sorting. `functools.reduce(operator.xor, nums)` is the one-line version if you would rather show it that way.",
      time: "O(n)",
      space: "O(1)",
      solution: "def single_number(nums):\n    result = 0\n\n    for num in nums:\n        result ^= num\n\n    return result",
      tests: [
        "single_number([2, 2, 1]) == 1",
        "single_number([4, 1, 2, 1, 2]) == 4",
        "single_number([1]) == 1"
      ]
    },
    {
      id: "number-of-1-bits",
      title: "Number of 1 Bits",
      diff: "Easy",
      pattern: "Bit Manipulation",
      companies: ["Amazon", "Apple", "Microsoft", "Adobe"],
      freq: 3,
      statement: "Write a function that takes an unsigned integer and returns the number of 1 bits in its binary representation (its Hamming weight).",
      examples: [
        ["n = 11 (0b1011)", "3", ""],
        ["n = 128 (0b10000000)", "1", ""]
      ],
      constraints: ["The input is a 32-bit unsigned integer"],
      hints: [
        "Shifting right and testing the low bit always takes 32 iterations.",
        "n & (n - 1) clears the lowest set bit - try it on 0b1100.",
        "Then the loop runs only as many times as there are 1 bits."
      ],
      approach: "Brian Kernighan's trick. Subtracting 1 flips the lowest set bit to 0 and everything below it to 1, so ANDing with the original erases exactly that one bit. Counting iterations until n reaches 0 gives the number of set bits - proportional to the number of 1s, not the width of the integer.",
      time: "O(number of set bits)",
      space: "O(1)",
      solution: "def hamming_weight(n):\n    count = 0\n\n    while n:\n        n &= n - 1\n        count += 1\n\n    return count",
      tests: ["hamming_weight(11) == 3", "hamming_weight(128) == 1", "hamming_weight(0) == 0"]
    },
    {
      id: "counting-bits",
      title: "Counting Bits",
      diff: "Easy",
      pattern: "Bit Manipulation",
      companies: ["Amazon", "Meta", "Apple"],
      freq: 3,
      statement: "Given an integer `n`, return an array of length n + 1 where `answer[i]` is the number of 1 bits in the binary representation of `i`.",
      examples: [
        ["n = 5", "[0, 1, 1, 2, 1, 2]", ""],
        ["n = 2", "[0, 1, 1]", ""]
      ],
      constraints: ["0 <= n <= 10^5", "Follow-up: solve it in a single pass, O(n) time"],
      hints: [
        "Counting each number separately is O(n log n). Reuse earlier answers instead.",
        "i >> 1 is i with its last bit removed - a number you already solved.",
        "So bits(i) = bits(i >> 1) + (last bit of i)."
      ],
      approach: "DP on the bit representation. Dropping the least significant bit (`i >> 1`) always yields a smaller number whose answer is already computed, so the count is that answer plus the dropped bit `i & 1`. One pass, one array, no per-number bit loop - and it is a neat demonstration of finding DP structure in a bit problem.",
      time: "O(n)",
      space: "O(n)",
      solution: "def count_bits(n):\n    dp = [0] * (n + 1)\n\n    for i in range(1, n + 1):\n        dp[i] = dp[i >> 1] + (i & 1)\n\n    return dp",
      tests: [
        "count_bits(5) == [0, 1, 1, 2, 1, 2]",
        "count_bits(2) == [0, 1, 1]",
        "count_bits(0) == [0]"
      ]
    },
    {
      id: "reverse-bits",
      title: "Reverse Bits",
      diff: "Easy",
      pattern: "Bit Manipulation",
      companies: ["Amazon", "Apple", "Qualcomm"],
      freq: 3,
      statement: "Reverse the bits of a given 32-bit unsigned integer and return the result.",
      examples: [
        ["n = 43261596", "964176192", "0b00000010100101000001111010011100 reversed."],
        ["n = 1", "2147483648", "The lowest bit becomes the highest."]
      ],
      constraints: ["The input is a 32-bit unsigned integer", "Exactly 32 iterations regardless of value"],
      hints: [
        "Build the answer bit by bit while consuming the input from the other end.",
        "Shift the result left to make room, then OR in the input's lowest bit.",
        "Always loop 32 times - leading zeros are significant here."
      ],
      approach: "Shift-and-append. Each iteration makes room in the result with `result << 1`, ORs in the input's lowest bit, then discards that bit from the input with `n >>= 1`. Running exactly 32 times matters: stopping early when n hits 0 would silently drop the leading zeros that must become trailing bits of the answer.",
      time: "O(1) - always 32 steps",
      space: "O(1)",
      solution: "def reverse_bits(n):\n    result = 0\n\n    for _ in range(32):\n        result = (result << 1) | (n & 1)\n        n >>= 1\n\n    return result",
      tests: [
        "reverse_bits(43261596) == 964176192",
        "reverse_bits(1) == 2147483648",
        "reverse_bits(0) == 0"
      ]
    },
    {
      id: "missing-number",
      title: "Missing Number",
      diff: "Easy",
      pattern: "Bit Manipulation",
      companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
      freq: 4,
      statement: "Given an array `nums` containing n distinct numbers taken from the range [0, n], return the one number that is missing.",
      examples: [
        ["nums = [3, 0, 1]", "2", ""],
        ["nums = [9,6,4,2,3,5,7,0,1]", "8", ""]
      ],
      constraints: ["n == len(nums)", "All numbers are unique and within [0, n]", "O(1) space preferred"],
      hints: [
        "Sum of 0..n minus the actual sum gives the answer - but can overflow in other languages.",
        "XOR avoids overflow entirely.",
        "XOR every index together with every value; everything pairs off except the missing number."
      ],
      approach: "XOR indices against values. Starting the accumulator at `len(nums)` supplies the one index the loop cannot produce, and then every number present cancels with its matching index. Only the missing value has no partner, so it survives. Unlike the Gauss sum formula this never overflows, which is the answer interviewers prefer in C++ or Java.",
      time: "O(n)",
      space: "O(1)",
      solution: "def missing_number(nums):\n    result = len(nums)\n\n    for i, num in enumerate(nums):\n        result ^= i ^ num\n\n    return result",
      tests: [
        "missing_number([3, 0, 1]) == 2",
        "missing_number([9,6,4,2,3,5,7,0,1]) == 8",
        "missing_number([0]) == 1"
      ]
    },
    {
      id: "roman-to-integer",
      title: "Roman to Integer",
      diff: "Easy",
      pattern: "Math & Strings",
      companies: ["Amazon", "Microsoft", "Meta", "Infosys"],
      freq: 4,
      statement: "Given a Roman numeral string, convert it to an integer. Values are normally written largest to smallest, but six subtractive pairs (IV, IX, XL, XC, CD, CM) place a smaller value before a larger one.",
      examples: [
        ["s = \"MCMXCIV\"", "1994", "M=1000, CM=900, XC=90, IV=4."],
        ["s = \"LVIII\"", "58", "L=50, V=5, III=3."]
      ],
      constraints: ["1 <= len(s) <= 15", "s is a valid Roman numeral in the range [1, 3999]"],
      hints: [
        "Hardcoding the six subtractive pairs works but is fiddly.",
        "Notice the rule they all share: a smaller value before a larger one is subtracted.",
        "So compare each symbol with the one that follows it."
      ],
      approach: "One pass with a lookahead. If a symbol's value is smaller than the next symbol's, it is part of a subtractive pair and gets subtracted; otherwise it is added. That single comparison covers all six special cases with no lookup table of pairs. The final character has no successor, so the bounds check sends it down the addition branch.",
      time: "O(n)",
      space: "O(1)",
      solution: "def roman_to_int(s):\n    values = {\"I\": 1, \"V\": 5, \"X\": 10, \"L\": 50, \"C\": 100, \"D\": 500, \"M\": 1000}\n    total = 0\n\n    for i, ch in enumerate(s):\n        if i + 1 < len(s) and values[ch] < values[s[i + 1]]:\n            total -= values[ch]\n        else:\n            total += values[ch]\n\n    return total",
      tests: [
        "roman_to_int(\"MCMXCIV\") == 1994",
        "roman_to_int(\"LVIII\") == 58",
        "roman_to_int(\"III\") == 3"
      ]
    },
    {
      id: "longest-common-prefix",
      title: "Longest Common Prefix",
      diff: "Easy",
      pattern: "Math & Strings",
      companies: ["Amazon", "Meta", "Google", "Capgemini"],
      freq: 4,
      statement: "Write a function to find the longest common prefix among an array of strings. Return the empty string if there is no common prefix.",
      examples: [
        ["strs = [\"flower\",\"flow\",\"flight\"]", "\"fl\"", ""],
        ["strs = [\"dog\",\"racecar\",\"car\"]", "\"\"", "No shared prefix."]
      ],
      constraints: ["1 <= len(strs) <= 200", "0 <= len(strs[i]) <= 200", "Lowercase English letters"],
      hints: [
        "The answer can never be longer than the first string.",
        "Start with that as a candidate and shrink it until every word starts with it.",
        "An empty candidate means there is no common prefix at all."
      ],
      approach: "Horizontal scanning. Assume the first word is the prefix, then for each remaining word trim the candidate from the right until that word starts with it. The candidate only ever shrinks, so the total work is bounded by the shortest word times the number of words. Bailing out the moment the prefix empties avoids pointless comparisons.",
      time: "O(total characters)",
      space: "O(1)",
      solution: "def longest_common_prefix(strs):\n    if not strs:\n        return \"\"\n\n    prefix = strs[0]\n    for word in strs[1:]:\n        while not word.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return \"\"\n\n    return prefix",
      tests: [
        "longest_common_prefix([\"flower\",\"flow\",\"flight\"]) == \"fl\"",
        "longest_common_prefix([\"dog\",\"racecar\",\"car\"]) == \"\"",
        "longest_common_prefix([\"single\"]) == \"single\""
      ]
    },
    {
      id: "valid-sudoku",
      title: "Valid Sudoku",
      diff: "Medium",
      pattern: "Matrix",
      companies: ["Amazon", "Apple", "Microsoft", "Uber"],
      freq: 4,
      statement: "Determine if a partially filled 9 x 9 Sudoku board is valid. Only the filled cells need checking: each row, each column and each 3 x 3 sub-box must contain the digits 1-9 without repetition. Empty cells are '.'.",
      examples: [
        [
          "A board where row 0 is ['5','3','.','.','7','.','.','.','.']",
          "True",
          "No conflicts among the filled cells."
        ],
        [
          "The same board with the top-left 5 changed to 8",
          "False",
          "Two 8s in the top-left box."
        ]
      ],
      constraints: [
        "board is exactly 9 x 9",
        "Each cell is a digit 1-9 or '.'",
        "The board need not be solvable"
      ],
      hints: [
        "Three separate passes work, but one pass can do all three checks.",
        "Every filled cell belongs to exactly one row, one column and one box.",
        "The box index is (row // 3, col // 3)."
      ],
      approach: "One pass with a single set of tagged keys. Each filled digit produces three distinct keys - one tagged with its row, one with its column, one with its box - and inserting any key that already exists proves a duplicate. Tagging the keys is what lets a single set serve all 27 constraint groups without collisions. `row // 3, col // 3` identifies the sub-box.",
      time: "O(1) - the board is fixed at 81 cells",
      space: "O(1)",
      solution: "def is_valid_sudoku(board):\n    seen = set()\n\n    for r in range(9):\n        for c in range(9):\n            value = board[r][c]\n            if value == \".\":\n                continue\n\n            keys = (\n                (value, \"row\", r),\n                (value, \"col\", c),\n                (value, \"box\", r // 3, c // 3),\n            )\n            for key in keys:\n                if key in seen:\n                    return False\n                seen.add(key)\n\n    return True",
      tests: ["is_valid_sudoku(_BOARD) is True", "is_valid_sudoku(_bad_board()) is False"],
      harness: "_BOARD = [\n    [\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],\n    [\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],\n    [\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],\n    [\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],\n    [\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],\n    [\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],\n    [\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],\n    [\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],\n    [\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"],\n]\n\n\ndef _bad_board():\n    board = [row[:] for row in _BOARD]\n    board[0][0] = \"8\"\n    return board"
    },
    {
      id: "happy-number",
      title: "Happy Number",
      diff: "Easy",
      pattern: "Math & Strings",
      companies: ["Google", "Amazon", "Uber", "Airbnb"],
      freq: 3,
      statement: "A happy number is one where repeatedly replacing it with the sum of the squares of its digits eventually reaches 1. Numbers that never reach 1 loop forever. Return `True` if `n` is happy.",
      examples: [
        ["n = 19", "True", "1+81=82, 64+4=68, 36+64=100, 1+0+0=1."],
        ["n = 2", "False", "It falls into a cycle."]
      ],
      constraints: ["1 <= n <= 2^31 - 1"],
      hints: [
        "Unhappy numbers get stuck in a cycle - detect it.",
        "A set of already-seen values is the simplest cycle detector.",
        "divmod(n, 10) peels off one digit at a time."
      ],
      approach: "Cycle detection on the digit-square sequence. Keep every value produced in a set; reaching 1 means happy, revisiting a value means an endless loop. The inner `divmod` loop peels digits off the right. Floyd's slow/fast pointer is the O(1) space alternative if the interviewer pushes on memory.",
      time: "O(log n) per step",
      space: "O(log n)",
      solution: "def is_happy(n):\n    seen = set()\n\n    while n != 1 and n not in seen:\n        seen.add(n)\n        total = 0\n        while n:\n            n, digit = divmod(n, 10)\n            total += digit * digit\n        n = total\n\n    return n == 1",
      tests: ["is_happy(19) is True", "is_happy(2) is False", "is_happy(1) is True"]
    },
    {
      id: "gas-station",
      title: "Gas Station",
      diff: "Medium",
      pattern: "Greedy",
      companies: ["Amazon", "Google", "Meta", "Bloomberg"],
      freq: 4,
      statement: "There are n gas stations in a circle. `gas[i]` is the fuel available at station i and `cost[i]` is the fuel needed to travel from station i to i+1. Starting with an empty tank, return the index you must start from to complete the circuit, or -1 if it is impossible. The answer is unique.",
      examples: [
        ["gas = [1,2,3,4,5], cost = [3,4,5,1,2]", "3", "Start at index 3."],
        ["gas = [2,3,4], cost = [3,4,3]", "-1", ""]
      ],
      constraints: ["1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4", "The answer is guaranteed unique"],
      hints: [
        "If total gas < total cost, no start can work - answer -1 immediately.",
        "Otherwise a valid start always exists.",
        "If the tank goes negative partway, no station in that stretch can be the answer."
      ],
      approach: "Single greedy pass. Total gas below total cost makes the trip impossible outright. Otherwise, track the running tank: when it dips below zero at station i, no station from the current start through i can reach past i, so jump the start to i + 1 and reset. One pass finds the unique answer without ever re-simulating from an earlier station.",
      time: "O(n)",
      space: "O(1)",
      solution: "def can_complete_circuit(gas, cost):\n    if sum(gas) < sum(cost):\n        return -1\n\n    start = 0\n    tank = 0\n\n    for i in range(len(gas)):\n        tank += gas[i] - cost[i]\n        if tank < 0:\n            start = i + 1\n            tank = 0\n\n    return start",
      tests: [
        "can_complete_circuit([1,2,3,4,5], [3,4,5,1,2]) == 3",
        "can_complete_circuit([2,3,4], [3,4,3]) == -1",
        "can_complete_circuit([5,1,2,3,4], [4,4,1,5,1]) == 4"
      ]
    },
    {
      id: "first-missing-positive",
      title: "First Missing Positive",
      diff: "Hard",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Google", "Meta", "Stripe", "Databricks"],
      freq: 3,
      statement: "Given an unsorted integer array `nums`, return the smallest positive integer that is **not** present. You must run in O(n) time and use O(1) auxiliary space.",
      examples: [
        ["nums = [1, 2, 0]", "3", ""],
        ["nums = [3, 4, -1, 1]", "2", ""]
      ],
      constraints: [
        "1 <= len(nums) <= 10^5",
        "-2^31 <= nums[i] <= 2^31 - 1",
        "O(1) auxiliary space required"
      ],
      hints: [
        "The answer must lie in [1, n + 1] - anything outside that range is irrelevant.",
        "That means the array itself can be your hash table: value v belongs at index v - 1.",
        "Swap values into their home positions, then scan for the first index that is wrong."
      ],
      approach: "Cyclic sort using the array as its own hash table. With n slots, the answer is at most n + 1, so only values in [1, n] matter - each is swapped to index `value - 1`. The `nums[target] != nums[i]` guard stops infinite swapping on duplicates. A final scan returns the first index whose value is not `i + 1`; if all are correct, the answer is n + 1.",
      time: "O(n)",
      space: "O(1)",
      solution: "def first_missing_positive(nums):\n    n = len(nums)\n\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            target = nums[i] - 1\n            nums[i], nums[target] = nums[target], nums[i]\n\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n\n    return n + 1",
      tests: [
        "first_missing_positive([1, 2, 0]) == 3",
        "first_missing_positive([3, 4, -1, 1]) == 2",
        "first_missing_positive([7, 8, 9, 11, 12]) == 1"
      ]
    }
  ]);
})(window.TD);
