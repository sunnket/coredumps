/* Code Dojo — Arrays, hashing and matrix work.

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
      id: "reverse-array",
      title: "Reverse an Array",
      diff: "Easy",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Microsoft", "Adobe", "TCS"],
      freq: 5,
      statement: "Given an array of integers, reverse it **in place** and return it. You may not allocate a second array - swap elements using two pointers walking toward each other.",
      examples: [
        ["nums = [1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]", "Odd length: the middle element stays put."],
        ["nums = [7, 8]", "[8, 7]", "Two pointers meet after one swap."]
      ],
      constraints: [
        "1 <= len(nums) <= 10^5",
        "Must use O(1) extra space",
        "Do not use nums[::-1] or nums.reverse()"
      ],
      hints: [
        "Put one pointer at index 0 and one at index len(nums) - 1.",
        "Swap the two values, then step left forward and right backward.",
        "Stop the moment left >= right, otherwise you undo your own swaps."
      ],
      approach: "Classic two-pointer swap. `left` starts at the front, `right` at the back. Swap what they point at, then move both inward. When they cross, every pair has been exchanged exactly once. Python's tuple assignment `a, b = b, a` does the swap without a temp variable.",
      time: "O(n)",
      space: "O(1)",
      solution: "def reverse_array(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        nums[left], nums[right] = nums[right], nums[left]\n        left += 1\n        right -= 1\n    return nums",
      tests: [
        "reverse_array([1, 2, 3, 4, 5]) == [5, 4, 3, 2, 1]",
        "reverse_array([7, 8]) == [8, 7]",
        "reverse_array([42]) == [42]"
      ]
    },
    {
      id: "reverse-string",
      title: "Reverse String",
      diff: "Easy",
      pattern: "Two Pointers",
      companies: ["Apple", "Microsoft", "Infosys"],
      freq: 4,
      statement: "Write a function that reverses a string, given as a list of characters `s`. Modify the input in place with O(1) extra memory.",
      examples: [
        ["s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", "[\"o\",\"l\",\"l\",\"e\",\"h\"]", ""],
        ["s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]", ""]
      ],
      constraints: ["1 <= len(s) <= 10^5", "s[i] is a printable ASCII character"],
      hints: [
        "Strings are immutable in Python, which is why the input arrives as a list.",
        "Same two-pointer swap you used to reverse an array."
      ],
      approach: "Identical to reversing an array - the only difference is that the elements are characters. Two pointers close in from both ends, swapping as they go.",
      time: "O(n)",
      space: "O(1)",
      solution: "def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1\n    return s",
      tests: [
        "reverse_string([\"h\",\"e\",\"l\",\"l\",\"o\"]) == [\"o\",\"l\",\"l\",\"e\",\"h\"]",
        "reverse_string([\"a\"]) == [\"a\"]"
      ]
    },
    {
      id: "two-sum",
      title: "Two Sum",
      diff: "Easy",
      pattern: "Arrays & Hashing",
      companies: ["Google", "Amazon", "Meta", "Microsoft", "Bloomberg"],
      freq: 5,
      statement: "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`. Exactly one valid answer exists, and you may not use the same element twice.",
      examples: [
        ["nums = [2, 7, 11, 15], target = 9", "[0, 1]", "nums[0] + nums[1] == 9"],
        ["nums = [3, 2, 4], target = 6", "[1, 2]", "You cannot use 3 twice."]
      ],
      constraints: [
        "2 <= len(nums) <= 10^4",
        "-10^9 <= nums[i], target <= 10^9",
        "Exactly one solution exists"
      ],
      hints: [
        "The brute force pair of nested loops is O(n^2). What are you actually searching for inside the inner loop?",
        "For each number x you need `target - x`. A hash map answers 'have I seen that value?' in O(1).",
        "Store value -> index as you go, and check for the complement *before* inserting the current number."
      ],
      approach: "One pass with a hash map. For each number, compute the complement `target - num`. If that complement is already in the map you have your pair, so return the stored index and the current index. Otherwise record `num -> index` and continue. Checking before inserting is what prevents an element from pairing with itself.",
      time: "O(n)",
      space: "O(n)",
      solution: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        need = target - num\n        if need in seen:\n            return [seen[need], i]\n        seen[num] = i\n    return []",
      tests: [
        "two_sum([2, 7, 11, 15], 9) == [0, 1]",
        "two_sum([3, 2, 4], 6) == [1, 2]",
        "two_sum([3, 3], 6) == [0, 1]"
      ]
    },
    {
      id: "contains-duplicate",
      title: "Contains Duplicate",
      diff: "Easy",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Apple", "Yahoo"],
      freq: 4,
      statement: "Given an integer array `nums`, return `True` if any value appears **at least twice**, and `False` if every element is distinct.",
      examples: [
        ["nums = [1, 2, 3, 1]", "True", "1 shows up twice."],
        ["nums = [1, 2, 3, 4]", "False", "All distinct."]
      ],
      constraints: ["1 <= len(nums) <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      hints: [
        "A set gives O(1) membership tests.",
        "Bail out the moment you see a repeat - no need to finish the scan."
      ],
      approach: "Walk the array holding a set of everything seen so far. If the current value is already in the set, you found a duplicate. Early return keeps the best case fast. The one-liner `len(set(nums)) != len(nums)` also works, but interviewers usually want the explicit loop so you can talk about early exit.",
      time: "O(n)",
      space: "O(n)",
      solution: "def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False",
      tests: [
        "contains_duplicate([1, 2, 3, 1]) is True",
        "contains_duplicate([1, 2, 3, 4]) is False",
        "contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) is True"
      ]
    },
    {
      id: "valid-anagram",
      title: "Valid Anagram",
      diff: "Easy",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Uber", "Bloomberg", "Wipro"],
      freq: 4,
      statement: "Given two strings `s` and `t`, return `True` if `t` is an anagram of `s` - that is, it uses exactly the same characters with the same frequencies, in any order.",
      examples: [
        ["s = \"anagram\", t = \"nagaram\"", "True", ""],
        ["s = \"rat\", t = \"car\"", "False", ""]
      ],
      constraints: ["1 <= len(s), len(t) <= 5 * 10^4", "s and t consist of lowercase English letters"],
      hints: [
        "Different lengths means instant False.",
        "Count characters of s, then decrement while scanning t.",
        "If a count would go below zero, t has a character s does not have enough of."
      ],
      approach: "Frequency counting. Build a dict of character counts for `s`, then walk `t` decrementing. A missing or already-exhausted character proves the strings differ. Sorting both strings also works at O(n log n), but counting is linear.",
      time: "O(n)",
      space: "O(1)",
      solution: "def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n\n    counts = {}\n    for ch in s:\n        counts[ch] = counts.get(ch, 0) + 1\n\n    for ch in t:\n        if counts.get(ch, 0) == 0:\n            return False\n        counts[ch] -= 1\n\n    return True",
      tests: [
        "is_anagram(\"anagram\", \"nagaram\") is True",
        "is_anagram(\"rat\", \"car\") is False",
        "is_anagram(\"a\", \"ab\") is False"
      ]
    },
    {
      id: "maximum-subarray",
      title: "Maximum Subarray (Kadane's Algorithm)",
      diff: "Medium",
      pattern: "Dynamic Programming",
      companies: ["Amazon", "Microsoft", "LinkedIn", "Goldman Sachs"],
      freq: 5,
      statement: "Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one element.",
      examples: [
        ["nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", "6", "The subarray [4, -1, 2, 1] sums to 6."],
        ["nums = [-3, -1, -2]", "-1", "All negative - take the single largest element."]
      ],
      constraints: ["1 <= len(nums) <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      hints: [
        "At every index ask one question: is the running sum helping me, or dragging me down?",
        "If the running sum ever goes negative, throw it away and start fresh at the current element.",
        "Track the best sum seen separately from the running sum."
      ],
      approach: "Kadane's algorithm. `current` is the best sum of a subarray *ending at* the current index - either the element alone or the element joined to the previous run. `best` remembers the maximum of those values over the whole array. Initialising both to `nums[0]` handles the all-negative case correctly.",
      time: "O(n)",
      space: "O(1)",
      solution: "def max_sub_array(nums):\n    best = nums[0]\n    current = nums[0]\n    for num in nums[1:]:\n        current = max(num, current + num)\n        best = max(best, current)\n    return best",
      tests: [
        "max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6",
        "max_sub_array([-3, -1, -2]) == -1",
        "max_sub_array([5, 4, -1, 7, 8]) == 23"
      ]
    },
    {
      id: "best-time-buy-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      diff: "Easy",
      pattern: "Sliding Window",
      companies: ["Amazon", "Meta", "Bloomberg", "Morgan Stanley"],
      freq: 5,
      statement: "You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. Choose one day to buy and a **later** day to sell to maximise profit. Return the maximum profit, or 0 if no profitable trade exists.",
      examples: [
        ["prices = [7, 1, 5, 3, 6, 4]", "5", "Buy at 1 (day 2), sell at 6 (day 5)."],
        ["prices = [7, 6, 4, 3, 1]", "0", "Prices only fall - never trade."]
      ],
      constraints: ["1 <= len(prices) <= 10^5", "0 <= prices[i] <= 10^4"],
      hints: [
        "You only need the cheapest price seen so far to the left of today.",
        "Today's best possible profit is today's price minus that minimum.",
        "One pass, two variables - no nested loop needed."
      ],
      approach: "Track the minimum price seen so far while scanning left to right. At each day, the best profit if you sold today is `price - cheapest`. Keep the maximum of those. Because `cheapest` only ever looks at earlier days, the buy-before-sell rule is enforced automatically.",
      time: "O(n)",
      space: "O(1)",
      solution: "def max_profit(prices):\n    cheapest = float('inf')\n    profit = 0\n    for price in prices:\n        if price < cheapest:\n            cheapest = price\n        elif price - cheapest > profit:\n            profit = price - cheapest\n    return profit",
      tests: [
        "max_profit([7, 1, 5, 3, 6, 4]) == 5",
        "max_profit([7, 6, 4, 3, 1]) == 0",
        "max_profit([2, 4, 1]) == 2"
      ]
    },
    {
      id: "move-zeroes",
      title: "Move Zeroes",
      diff: "Easy",
      pattern: "Two Pointers",
      companies: ["Meta", "Amazon", "Bloomberg"],
      freq: 4,
      statement: "Given an integer array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements. Do it **in place** without making a copy of the array.",
      examples: [
        ["nums = [0, 1, 0, 3, 12]", "[1, 3, 12, 0, 0]", ""],
        ["nums = [0]", "[0]", ""]
      ],
      constraints: ["1 <= len(nums) <= 10^4", "Must be done in place"],
      hints: [
        "Keep a slow pointer marking where the next non-zero value belongs.",
        "Scan with a fast pointer; when it finds a non-zero, swap it into the slow slot.",
        "Swapping (instead of overwriting) means the zeroes get pushed right for free."
      ],
      approach: "Two pointers moving in the same direction. `insert` marks the boundary of the already-compacted non-zero prefix. The scan pointer `i` sweeps the array; every time it lands on a non-zero it swaps that value down to `insert` and advances the boundary. Zeroes naturally end up in the tail.",
      time: "O(n)",
      space: "O(1)",
      solution: "def move_zeroes(nums):\n    insert = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            nums[insert], nums[i] = nums[i], nums[insert]\n            insert += 1\n    return nums",
      tests: [
        "move_zeroes([0, 1, 0, 3, 12]) == [1, 3, 12, 0, 0]",
        "move_zeroes([0]) == [0]",
        "move_zeroes([1, 2, 3]) == [1, 2, 3]"
      ]
    },
    {
      id: "majority-element",
      title: "Majority Element (Boyer-Moore Voting)",
      diff: "Easy",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Adobe", "Zenefits"],
      freq: 3,
      statement: "Given an array `nums` of size n, return the element that appears **more than n/2 times**. You may assume the majority element always exists. Try to solve it in O(1) space.",
      examples: [
        ["nums = [3, 2, 3]", "3", ""],
        ["nums = [2, 2, 1, 1, 1, 2, 2]", "2", ""]
      ],
      constraints: ["1 <= len(nums) <= 5 * 10^4", "A majority element always exists"],
      hints: [
        "A hash map solves it in O(n) space. The interviewer will then ask for O(1).",
        "Imagine each majority element cancelling out one non-majority element.",
        "Keep a candidate and a counter; reset the candidate whenever the counter hits zero."
      ],
      approach: "Boyer-Moore voting. Hold a candidate and a counter. Matching elements increment the counter, differing ones decrement it. When the counter hits 0 the current element becomes the new candidate. Since the majority element occurs more than n/2 times, it survives every cancellation and is whatever remains at the end.",
      time: "O(n)",
      space: "O(1)",
      solution: "def majority_element(nums):\n    count = 0\n    candidate = None\n    for num in nums:\n        if count == 0:\n            candidate = num\n        count += 1 if num == candidate else -1\n    return candidate",
      tests: [
        "majority_element([3, 2, 3]) == 3",
        "majority_element([2, 2, 1, 1, 1, 2, 2]) == 2",
        "majority_element([1]) == 1"
      ]
    },
    {
      id: "plus-one",
      title: "Plus One",
      diff: "Easy",
      pattern: "Arrays & Hashing",
      companies: ["Google", "Amazon", "Meta"],
      freq: 3,
      statement: "You are given a large integer represented as an array of digits, most significant digit first. Increment the integer by one and return the resulting digit array.",
      examples: [
        ["digits = [1, 2, 3]", "[1, 2, 4]", ""],
        ["digits = [9, 9]", "[1, 0, 0]", "Every digit carries, so the array grows by one."]
      ],
      constraints: ["1 <= len(digits) <= 100", "0 <= digits[i] <= 9", "No leading zeros"],
      hints: [
        "Walk from the last digit backwards.",
        "A digit below 9 can absorb the +1 and you are done immediately.",
        "Only the all-nines case needs a longer array."
      ],
      approach: "Scan right to left. Any digit less than 9 can simply be incremented and returned - no further carry. A 9 becomes 0 and the carry continues left. If the loop finishes, every digit was a 9, so the answer is `1` followed by all the zeros.",
      time: "O(n)",
      space: "O(1)",
      solution: "def plus_one(digits):\n    for i in range(len(digits) - 1, -1, -1):\n        if digits[i] < 9:\n            digits[i] += 1\n            return digits\n        digits[i] = 0\n    return [1] + digits",
      tests: [
        "plus_one([1, 2, 3]) == [1, 2, 4]",
        "plus_one([9, 9]) == [1, 0, 0]",
        "plus_one([4, 3, 2, 1]) == [4, 3, 2, 2]"
      ]
    },
    {
      id: "merge-sorted-array",
      title: "Merge Sorted Array",
      diff: "Easy",
      pattern: "Two Pointers",
      companies: ["Meta", "Microsoft", "Amazon", "Accenture"],
      freq: 4,
      statement: "You are given two sorted arrays `nums1` (length m + n, where the last n slots are zeros) and `nums2` (length n). Merge `nums2` into `nums1` so `nums1` ends up sorted. Do it in place.",
      examples: [
        ["nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", "[1, 2, 2, 3, 5, 6]", ""],
        ["nums1 = [1], m = 1, nums2 = [], n = 0", "[1]", ""]
      ],
      constraints: ["nums1.length == m + n", "0 <= m, n <= 200", "Both inputs are sorted ascending"],
      hints: [
        "Merging from the front forces you to shift elements. What about the back?",
        "The largest remaining value goes into the last empty slot.",
        "Stop when nums2 is exhausted - anything left in nums1 is already in place."
      ],
      approach: "Fill from the back. Pointer `i` walks nums1's real values, `j` walks nums2, and `k` is the write position at the very end of nums1. Take the larger of the two candidates and drop it at `k`. Writing backwards means you never overwrite a value you still need. Once `j` runs out you are finished, because remaining nums1 values already sit in sorted position.",
      time: "O(m + n)",
      space: "O(1)",
      solution: "def merge(nums1, m, nums2, n):\n    i, j, k = m - 1, n - 1, m + n - 1\n    while j >= 0:\n        if i >= 0 and nums1[i] > nums2[j]:\n            nums1[k] = nums1[i]\n            i -= 1\n        else:\n            nums1[k] = nums2[j]\n            j -= 1\n        k -= 1\n    return nums1",
      tests: [
        "merge([1,2,3,0,0,0], 3, [2,5,6], 3) == [1,2,2,3,5,6]",
        "merge([1], 1, [], 0) == [1]",
        "merge([0], 0, [1], 1) == [1]"
      ]
    },
    {
      id: "rotate-array",
      title: "Rotate Array",
      diff: "Medium",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Microsoft", "Infosys"],
      freq: 4,
      statement: "Given an array `nums`, rotate it to the right by `k` steps, where k is non-negative. Solve it in place with O(1) extra space.",
      examples: [
        ["nums = [1,2,3,4,5,6,7], k = 3", "[5, 6, 7, 1, 2, 3, 4]", ""],
        ["nums = [-1,-100,3,99], k = 2", "[3, 99, -1, -100]", ""]
      ],
      constraints: ["1 <= len(nums) <= 10^5", "0 <= k <= 10^5", "k may exceed the array length"],
      hints: [
        "k can be larger than n - reduce it with k %= n first.",
        "Reverse the whole array. Now the right block is at the front, but backwards.",
        "Reverse the first k and the last n - k separately to fix them."
      ],
      approach: "The triple-reverse trick. Reversing the entire array puts the last k elements at the front (in reverse order) and the rest behind them (also reversed). Reversing each of those two segments individually restores their internal order, leaving a perfect rotation - all in O(1) space.",
      time: "O(n)",
      space: "O(1)",
      solution: "def rotate(nums, k):\n    n = len(nums)\n    k %= n\n\n    def reverse(lo, hi):\n        while lo < hi:\n            nums[lo], nums[hi] = nums[hi], nums[lo]\n            lo += 1\n            hi -= 1\n\n    reverse(0, n - 1)\n    reverse(0, k - 1)\n    reverse(k, n - 1)\n    return nums",
      tests: [
        "rotate([1,2,3,4,5,6,7], 3) == [5,6,7,1,2,3,4]",
        "rotate([-1,-100,3,99], 2) == [3,99,-1,-100]",
        "rotate([1,2], 3) == [2,1]"
      ]
    },
    {
      id: "product-except-self",
      title: "Product of Array Except Self",
      diff: "Medium",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Meta", "Microsoft", "Apple"],
      freq: 5,
      statement: "Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element **except** `nums[i]`. Solve it without using division and in O(n) time.",
      examples: [
        ["nums = [1, 2, 3, 4]", "[24, 12, 8, 6]", ""],
        [
          "nums = [-1, 1, 0, -3, 3]",
          "[0, 0, 9, 0, 0]",
          "Zeros make division impossible - this is why it is banned."
        ]
      ],
      constraints: ["2 <= len(nums) <= 10^5", "The product of any prefix or suffix fits in 32 bits"],
      hints: [
        "answer[i] = (product of everything left of i) * (product of everything right of i).",
        "One left-to-right pass can fill in all the prefix products.",
        "A second right-to-left pass can multiply in the suffixes using a single variable."
      ],
      approach: "Two sweeps sharing the output array. The forward pass writes the running prefix product into `result[i]` *before* folding `nums[i]` in, so each slot holds the product of everything strictly to its left. The backward pass multiplies each slot by a running suffix product. Output does not count as extra space, so this is O(1) auxiliary.",
      time: "O(n)",
      space: "O(1)",
      solution: "def product_except_self(nums):\n    n = len(nums)\n    result = [1] * n\n\n    prefix = 1\n    for i in range(n):\n        result[i] = prefix\n        prefix *= nums[i]\n\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n\n    return result",
      tests: [
        "product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]",
        "product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]",
        "product_except_self([2, 3]) == [3, 2]"
      ]
    },
    {
      id: "group-anagrams",
      title: "Group Anagrams",
      diff: "Medium",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Meta", "Uber", "Bloomberg"],
      freq: 5,
      statement: "Given an array of strings `strs`, group the anagrams together. Return the groups in any order.",
      examples: [
        [
          "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
          "[[\"eat\",\"tea\",\"ate\"], [\"tan\",\"nat\"], [\"bat\"]]",
          ""
        ],
        ["strs = [\"\"]", "[[\"\"]]", ""]
      ],
      constraints: ["1 <= len(strs) <= 10^4", "0 <= len(strs[i]) <= 100", "Lowercase English letters only"],
      hints: [
        "Anagrams need a shared fingerprint that ignores order.",
        "Sorting the letters produces the same string for every anagram - use it as a dict key.",
        "Keys must be hashable, so use a tuple or a joined string, not a list."
      ],
      approach: "Bucket by canonical form. Sorting a word's characters gives a signature identical for all its anagrams, so `tuple(sorted(word))` becomes the dictionary key and the value is the list of words sharing it. `setdefault` creates the bucket on first sight. A 26-length count tuple is the O(n * k) alternative when k is large.",
      time: "O(n * k log k)",
      space: "O(n * k)",
      solution: "def group_anagrams(strs):\n    groups = {}\n    for word in strs:\n        key = tuple(sorted(word))\n        groups.setdefault(key, []).append(word)\n    return list(groups.values())",
      tests: [
        "sorted(sorted(g) for g in group_anagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"])) == [[\"ate\",\"eat\",\"tea\"], [\"bat\"], [\"nat\",\"tan\"]]",
        "group_anagrams([\"\"]) == [[\"\"]]"
      ]
    },
    {
      id: "top-k-frequent",
      title: "Top K Frequent Elements",
      diff: "Medium",
      pattern: "Heap / Priority Queue",
      companies: ["Amazon", "Meta", "Uber", "Yelp"],
      freq: 5,
      statement: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. The answer may be returned in any order. Aim for better than O(n log n).",
      examples: [
        ["nums = [1,1,1,2,2,3], k = 2", "[1, 2]", ""],
        ["nums = [1], k = 1", "[1]", ""]
      ],
      constraints: ["1 <= len(nums) <= 10^5", "k is in the range [1, number of distinct elements]"],
      hints: [
        "First build a frequency map - that part is unavoidable.",
        "A heap gives O(n log k). Can you do strictly O(n)?",
        "A frequency can never exceed len(nums), so you can index buckets by count."
      ],
      approach: "Bucket sort by frequency. Build the counts, then create `len(nums) + 1` buckets where bucket `f` holds every value that occurred exactly `f` times. Walking the buckets from the highest index down yields elements in descending frequency order, so you can stop as soon as you have collected k of them - linear time, no sorting.",
      time: "O(n)",
      space: "O(n)",
      solution: "def top_k_frequent(nums, k):\n    counts = {}\n    for num in nums:\n        counts[num] = counts.get(num, 0) + 1\n\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for num, freq in counts.items():\n        buckets[freq].append(num)\n\n    result = []\n    for freq in range(len(buckets) - 1, 0, -1):\n        for num in buckets[freq]:\n            result.append(num)\n            if len(result) == k:\n                return result\n    return result",
      tests: [
        "sorted(top_k_frequent([1,1,1,2,2,3], 2)) == [1, 2]",
        "top_k_frequent([1], 1) == [1]",
        "sorted(top_k_frequent([4,4,4,5,5,6], 2)) == [4, 5]"
      ]
    },
    {
      id: "longest-consecutive-sequence",
      title: "Longest Consecutive Sequence",
      diff: "Medium",
      pattern: "Arrays & Hashing",
      companies: ["Google", "Amazon", "Meta", "Microsoft"],
      freq: 4,
      statement: "Given an unsorted array of integers `nums`, return the length of the longest sequence of consecutive integers it contains. Your algorithm must run in O(n) time.",
      examples: [
        ["nums = [100, 4, 200, 1, 3, 2]", "4", "The run 1, 2, 3, 4 has length 4."],
        ["nums = [0,3,7,2,5,8,4,6,0,1]", "9", ""]
      ],
      constraints: [
        "0 <= len(nums) <= 10^5",
        "-10^9 <= nums[i] <= 10^9",
        "O(n) time required, so no sorting"
      ],
      hints: [
        "Put everything in a set so membership tests are O(1).",
        "Only start counting from a number that begins a run.",
        "A number x begins a run exactly when x - 1 is absent from the set."
      ],
      approach: "Dump the values into a set, then only expand from sequence *starts*. A value is a start when `num - 1` is not in the set, which guarantees each run is walked exactly once. Total work stays linear even though there is a nested while loop, because every element is visited at most twice overall.",
      time: "O(n)",
      space: "O(n)",
      solution: "def longest_consecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            length = 1\n            while num + length in num_set:\n                length += 1\n            longest = max(longest, length)\n    return longest",
      tests: [
        "longest_consecutive([100, 4, 200, 1, 3, 2]) == 4",
        "longest_consecutive([0,3,7,2,5,8,4,6,0,1]) == 9",
        "longest_consecutive([]) == 0"
      ]
    },
    {
      id: "find-all-duplicates",
      title: "Find All Duplicates in an Array",
      diff: "Medium",
      pattern: "Arrays & Hashing",
      companies: ["Amazon", "Microsoft", "Salesforce"],
      freq: 3,
      statement: "Given an integer array `nums` of length n where every value is in the range [1, n], each value appears once or twice. Return all values that appear twice - in O(n) time and O(1) extra space.",
      examples: [
        ["nums = [4,3,2,7,8,2,3,1]", "[2, 3]", ""],
        ["nums = [1, 1, 2]", "[1]", ""]
      ],
      constraints: [
        "n == len(nums)",
        "1 <= nums[i] <= n",
        "Each element appears once or twice",
        "O(1) extra space"
      ],
      hints: [
        "Values are in [1, n], so every value maps to a valid index: index = value - 1.",
        "You can store a visited flag inside the array itself.",
        "Negating nums[index] marks that slot without losing its magnitude - use abs() when reading."
      ],
      approach: "Use the sign bit as a free visited marker. For each value, jump to index `abs(num) - 1`. If that slot is already negative, this value has been seen before, so it is a duplicate. Otherwise negate it to record the visit. Magnitudes stay intact, so `abs()` recovers the original numbers - O(1) extra space, no hash set.",
      time: "O(n)",
      space: "O(1)",
      solution: "def find_duplicates(nums):\n    result = []\n    for num in nums:\n        index = abs(num) - 1\n        if nums[index] < 0:\n            result.append(abs(num))\n        else:\n            nums[index] = -nums[index]\n    return result",
      tests: [
        "find_duplicates([4,3,2,7,8,2,3,1]) == [2, 3]",
        "find_duplicates([1, 1, 2]) == [1]",
        "find_duplicates([1]) == []"
      ]
    },
    {
      id: "set-matrix-zeroes",
      title: "Set Matrix Zeroes",
      diff: "Medium",
      pattern: "Matrix",
      companies: ["Amazon", "Microsoft", "Meta", "Oracle"],
      freq: 4,
      statement: "Given an m x n matrix, if an element is 0 set its entire row and column to 0. Do it **in place**, ideally with O(1) extra space.",
      examples: [
        ["matrix = [[1,1,1],[1,0,1],[1,1,1]]", "[[1,0,1],[0,0,0],[1,0,1]]", ""],
        ["matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]", ""]
      ],
      constraints: ["1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"],
      hints: [
        "Zeroing as you scan corrupts the data - you cannot tell original zeroes from written ones.",
        "The naive fix is two marker arrays of size m and n. Can you store those markers inside the matrix?",
        "Use row 0 and column 0 as the marker strips, but record their own state first."
      ],
      approach: "Use the first row and first column as bookkeeping strips. Record separately whether they originally contained a zero, then scan the inner submatrix marking `matrix[r][0]` and `matrix[0][c]`. A second pass zeroes the inner cells based on those markers. Finally handle the two strips themselves using the flags saved at the start.",
      time: "O(m * n)",
      space: "O(1)",
      solution: "def set_zeroes(matrix):\n    rows, cols = len(matrix), len(matrix[0])\n    first_row_zero = any(matrix[0][c] == 0 for c in range(cols))\n    first_col_zero = any(matrix[r][0] == 0 for r in range(rows))\n\n    for r in range(1, rows):\n        for c in range(1, cols):\n            if matrix[r][c] == 0:\n                matrix[r][0] = 0\n                matrix[0][c] = 0\n\n    for r in range(1, rows):\n        for c in range(1, cols):\n            if matrix[r][0] == 0 or matrix[0][c] == 0:\n                matrix[r][c] = 0\n\n    if first_row_zero:\n        for c in range(cols):\n            matrix[0][c] = 0\n\n    if first_col_zero:\n        for r in range(rows):\n            matrix[r][0] = 0\n\n    return matrix",
      tests: [
        "set_zeroes([[1,1,1],[1,0,1],[1,1,1]]) == [[1,0,1],[0,0,0],[1,0,1]]",
        "set_zeroes([[0,1,2,0],[3,4,5,2],[1,3,1,5]]) == [[0,0,0,0],[0,4,5,0],[0,3,1,0]]"
      ]
    },
    {
      id: "spiral-matrix",
      title: "Spiral Matrix",
      diff: "Medium",
      pattern: "Matrix",
      companies: ["Microsoft", "Amazon", "Google", "Uber"],
      freq: 4,
      statement: "Given an m x n matrix, return all its elements in spiral order - left to right across the top, down the right side, right to left along the bottom, and up the left side, tightening inward.",
      examples: [
        ["matrix = [[1,2,3],[4,5,6],[7,8,9]]", "[1,2,3,6,9,8,7,4,5]", ""],
        ["matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", "[1,2,3,4,8,12,11,10,9,5,6,7]", ""]
      ],
      constraints: ["1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
      hints: [
        "Track four boundaries: top, bottom, left, right.",
        "After walking an edge, shrink the corresponding boundary.",
        "Re-check the boundaries before the bottom and left passes or a single leftover row/column gets emitted twice."
      ],
      approach: "Peel the matrix layer by layer using four moving walls. Each iteration walks the top row, the right column, then (if rows remain) the bottom row and (if columns remain) the left column, shrinking the relevant wall after each pass. Those two guard checks are what stop a lone middle row or column from being traversed a second time.",
      time: "O(m * n)",
      space: "O(1)",
      solution: "def spiral_order(matrix):\n    result = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1):\n            result.append(matrix[top][c])\n        top += 1\n\n        for r in range(top, bottom + 1):\n            result.append(matrix[r][right])\n        right -= 1\n\n        if top <= bottom:\n            for c in range(right, left - 1, -1):\n                result.append(matrix[bottom][c])\n            bottom -= 1\n\n        if left <= right:\n            for r in range(bottom, top - 1, -1):\n                result.append(matrix[r][left])\n            left += 1\n\n    return result",
      tests: [
        "spiral_order([[1,2,3],[4,5,6],[7,8,9]]) == [1,2,3,6,9,8,7,4,5]",
        "spiral_order([[1,2,3,4],[5,6,7,8],[9,10,11,12]]) == [1,2,3,4,8,12,11,10,9,5,6,7]",
        "spiral_order([[7]]) == [7]"
      ]
    },
    {
      id: "rotate-image",
      title: "Rotate Image",
      diff: "Medium",
      pattern: "Matrix",
      companies: ["Amazon", "Apple", "Microsoft", "Cisco"],
      freq: 4,
      statement: "You are given an n x n matrix representing an image. Rotate it by 90 degrees clockwise, **in place**.",
      examples: [
        ["matrix = [[1,2,3],[4,5,6],[7,8,9]]", "[[7,4,1],[8,5,2],[9,6,3]]", ""],
        ["matrix = [[1,2],[3,4]]", "[[3,1],[4,2]]", ""]
      ],
      constraints: ["n == len(matrix) == len(matrix[i])", "1 <= n <= 20", "Rotation must happen in place"],
      hints: [
        "Try it on paper: what does transposing do to the picture?",
        "Transpose swaps rows with columns - a mirror across the main diagonal.",
        "After transposing, reversing each row finishes the clockwise turn."
      ],
      approach: "Transpose, then reverse each row. The transpose swaps `matrix[r][c]` with `matrix[c][r]` for `c > r` only - iterating the full square would swap every pair twice and undo the work. Reversing each row afterwards flips the mirrored image into a true 90-degree clockwise rotation. For counter-clockwise, reverse the columns instead.",
      time: "O(n^2)",
      space: "O(1)",
      solution: "def rotate_image(matrix):\n    n = len(matrix)\n\n    for r in range(n):\n        for c in range(r + 1, n):\n            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]\n\n    for row in matrix:\n        row.reverse()\n\n    return matrix",
      tests: [
        "rotate_image([[1,2,3],[4,5,6],[7,8,9]]) == [[7,4,1],[8,5,2],[9,6,3]]",
        "rotate_image([[1,2],[3,4]]) == [[3,1],[4,2]]",
        "rotate_image([[1]]) == [[1]]"
      ]
    }
  ]);
})(window.TD);
