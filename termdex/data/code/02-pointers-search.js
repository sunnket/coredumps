/* Code Dojo — Two pointers, sliding window, stacks and binary search.

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
      id: "valid-palindrome",
      title: "Valid Palindrome",
      diff: "Easy",
      pattern: "Two Pointers",
      companies: ["Meta", "Amazon", "Microsoft", "Zoho"],
      freq: 5,
      statement: "Given a string `s`, return `True` if it is a palindrome after converting all uppercase letters to lowercase and removing every non-alphanumeric character.",
      examples: [
        ["s = \"A man, a plan, a canal: Panama\"", "True", "It reads \"amanaplanacanalpanama\"."],
        ["s = \"race a car\"", "False", "It reads \"raceacar\"."]
      ],
      constraints: ["1 <= len(s) <= 2 * 10^5", "s contains printable ASCII"],
      hints: [
        "Building a cleaned copy of the string works but costs O(n) space.",
        "Two pointers can skip junk characters on the fly.",
        "Guard the inner skip loops with left < right or they can run past each other."
      ],
      approach: "Two pointers from both ends. Before comparing, each pointer skips forward past anything that is not alphanumeric. Compare the lowercase characters; a mismatch means it is not a palindrome. The inner while loops need their own `left < right` guard so an all-punctuation string cannot walk a pointer out of bounds.",
      time: "O(n)",
      space: "O(1)",
      solution: "def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True",
      tests: [
        "is_palindrome(\"A man, a plan, a canal: Panama\") is True",
        "is_palindrome(\"race a car\") is False",
        "is_palindrome(\" \") is True"
      ]
    },
    {
      id: "two-sum-ii",
      title: "Two Sum II - Input Array Is Sorted",
      diff: "Medium",
      pattern: "Two Pointers",
      companies: ["Amazon", "Meta", "Adobe"],
      freq: 4,
      statement: "Given a **1-indexed** array `numbers` sorted in non-decreasing order, find two numbers that add up to `target` and return their 1-based indices. Use only O(1) extra space.",
      examples: [
        ["numbers = [2, 7, 11, 15], target = 9", "[1, 2]", ""],
        ["numbers = [2, 3, 4], target = 6", "[1, 3]", ""]
      ],
      constraints: [
        "2 <= len(numbers) <= 3 * 10^4",
        "The array is sorted ascending",
        "Exactly one solution exists"
      ],
      hints: [
        "The hash map from Two Sum works, but it wastes the sorted property and O(n) space.",
        "Start with the smallest and the largest value.",
        "If the sum is too small, only moving the left pointer can increase it."
      ],
      approach: "Converging two pointers. The sum of the outermost pair is your probe: too small means you need a bigger left value, so `left += 1`; too big means you need a smaller right value, so `right -= 1`. Sortedness guarantees each move discards exactly the pairs that cannot work, so one linear sweep is enough. Remember to add 1 to each index for the 1-based answer.",
      time: "O(n)",
      space: "O(1)",
      solution: "def two_sum_sorted(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        total = numbers[left] + numbers[right]\n        if total == target:\n            return [left + 1, right + 1]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []",
      tests: [
        "two_sum_sorted([2, 7, 11, 15], 9) == [1, 2]",
        "two_sum_sorted([2, 3, 4], 6) == [1, 3]",
        "two_sum_sorted([-1, 0], -1) == [1, 2]"
      ]
    },
    {
      id: "three-sum",
      title: "3Sum",
      diff: "Medium",
      pattern: "Two Pointers",
      companies: ["Meta", "Amazon", "Microsoft", "Adobe", "Goldman Sachs"],
      freq: 5,
      statement: "Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` with distinct indices that sum to zero. The solution set must not contain duplicate triplets.",
      examples: [
        [
          "nums = [-1, 0, 1, 2, -1, -4]",
          "[[-1, -1, 2], [-1, 0, 1]]",
          "Note both triplets use a different pair of -1s."
        ],
        ["nums = [0, 1, 1]", "[]", "No triplet sums to zero."]
      ],
      constraints: [
        "3 <= len(nums) <= 3000",
        "-10^5 <= nums[i] <= 10^5",
        "No duplicate triplets in the output"
      ],
      hints: [
        "Sort first - it makes duplicate handling and two-pointer scanning possible.",
        "Fix one number, then the rest is Two Sum II on the remaining suffix.",
        "Skip a fixed number equal to the previous one, and skip repeated left values after recording a hit."
      ],
      approach: "Sort, then fix each index `i` and run converging two pointers over the suffix looking for `-nums[i]`. Deduplication happens in two places: skip `i` when it repeats the previous fixed value, and after recording a triplet advance `left` past any copies of the value just used. Once `nums[i] > 0` the whole rest is positive, so you can break early.",
      time: "O(n^2)",
      space: "O(n)",
      solution: "def three_sum(nums):\n    nums.sort()\n    result = []\n\n    for i in range(len(nums) - 2):\n        if nums[i] > 0:\n            break\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total < 0:\n                left += 1\n            elif total > 0:\n                right -= 1\n            else:\n                result.append([nums[i], nums[left], nums[right]])\n                left += 1\n                while left < right and nums[left] == nums[left - 1]:\n                    left += 1\n\n    return result",
      tests: [
        "three_sum([-1, 0, 1, 2, -1, -4]) == [[-1, -1, 2], [-1, 0, 1]]",
        "three_sum([0, 1, 1]) == []",
        "three_sum([0, 0, 0, 0]) == [[0, 0, 0]]"
      ]
    },
    {
      id: "container-with-most-water",
      title: "Container With Most Water",
      diff: "Medium",
      pattern: "Two Pointers",
      companies: ["Amazon", "Meta", "Google", "Bloomberg"],
      freq: 4,
      statement: "You are given an array `height` of n non-negative integers, where each value is the height of a vertical line at that index. Pick two lines that, together with the x-axis, hold the most water. Return that maximum area.",
      examples: [
        ["height = [1,8,6,2,5,4,8,3,7]", "49", "Lines at index 1 and 8: min(8, 7) * 7 = 49."],
        ["height = [1, 1]", "1", ""]
      ],
      constraints: ["2 <= len(height) <= 10^5", "0 <= height[i] <= 10^4"],
      hints: [
        "Area = min(left height, right height) * distance between them.",
        "Start as wide as possible - the width can only shrink from there.",
        "Moving the taller line can never help; only moving the shorter one can raise the limiting height."
      ],
      approach: "Greedy two pointers from both ends. Width starts at its maximum, so any improvement must come from a taller limiting wall. Since the area is capped by the *shorter* line, moving the taller pointer inward can only make things worse - always move the shorter one. Each step discards one candidate, giving a single linear pass.",
      time: "O(n)",
      space: "O(1)",
      solution: "def max_area(height):\n    left, right = 0, len(height) - 1\n    best = 0\n    while left < right:\n        area = min(height[left], height[right]) * (right - left)\n        best = max(best, area)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return best",
      tests: [
        "max_area([1,8,6,2,5,4,8,3,7]) == 49",
        "max_area([1, 1]) == 1",
        "max_area([4, 3, 2, 1, 4]) == 16"
      ]
    },
    {
      id: "trapping-rain-water",
      title: "Trapping Rain Water",
      diff: "Hard",
      pattern: "Two Pointers",
      companies: ["Amazon", "Google", "Meta", "Goldman Sachs", "Apple"],
      freq: 5,
      statement: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much rain water can be trapped after it rains.",
      examples: [
        ["height = [0,1,0,2,1,0,1,3,2,1,2,1]", "6", ""],
        ["height = [4,2,0,3,2,5]", "9", ""]
      ],
      constraints: ["1 <= len(height) <= 2 * 10^4", "0 <= height[i] <= 10^5"],
      hints: [
        "Water above a bar = min(tallest bar to its left, tallest bar to its right) - its own height.",
        "Precomputing both max arrays gives O(n) time and O(n) space. Can you drop the arrays?",
        "If left_max < right_max, the left side is definitely the binding constraint - you can settle that column now."
      ],
      approach: "Two pointers carrying running maxima. Whichever side has the smaller running max is the limiting wall, so the water above that column is fully determined and can be added immediately - the other side is guaranteed to be at least as tall. Move that pointer inward, update its max, accumulate, repeat. One pass, O(1) space.",
      time: "O(n)",
      space: "O(1)",
      solution: "def trap(height):\n    if not height:\n        return 0\n\n    left, right = 0, len(height) - 1\n    left_max, right_max = height[left], height[right]\n    water = 0\n\n    while left < right:\n        if left_max < right_max:\n            left += 1\n            left_max = max(left_max, height[left])\n            water += left_max - height[left]\n        else:\n            right -= 1\n            right_max = max(right_max, height[right])\n            water += right_max - height[right]\n\n    return water",
      tests: ["trap([0,1,0,2,1,0,1,3,2,1,2,1]) == 6", "trap([4,2,0,3,2,5]) == 9", "trap([]) == 0"]
    },
    {
      id: "sort-colors",
      title: "Sort Colors (Dutch National Flag)",
      diff: "Medium",
      pattern: "Two Pointers",
      companies: ["Microsoft", "Amazon", "Meta", "Nvidia"],
      freq: 4,
      statement: "Given an array `nums` containing only 0s, 1s and 2s, sort it in place so that all 0s come first, then 1s, then 2s. You must solve it in one pass without using a library sort.",
      examples: [
        ["nums = [2, 0, 2, 1, 1, 0]", "[0, 0, 1, 1, 2, 2]", ""],
        ["nums = [2, 0, 1]", "[0, 1, 2]", ""]
      ],
      constraints: ["1 <= len(nums) <= 300", "nums[i] is 0, 1 or 2", "One pass, O(1) space"],
      hints: [
        "Counting sort works but needs two passes. The interviewer wants one.",
        "Maintain three regions: known 0s, known 1s, unexplored, known 2s.",
        "After swapping a 2 to the back, do NOT advance mid - the value you swapped in is unexamined."
      ],
      approach: "Dutch National Flag partition. `low` is the end of the 0 block, `high` the start of the 2 block, and `mid` scans the unknown middle. A 0 is swapped down to `low` (both pointers advance), a 1 is already in place (`mid` advances), and a 2 is swapped up to `high` with `high` shrinking - crucially `mid` stays put, because the value swapped in from the back has not been inspected yet.",
      time: "O(n)",
      space: "O(1)",
      solution: "def sort_colors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n\n    return nums",
      tests: [
        "sort_colors([2, 0, 2, 1, 1, 0]) == [0, 0, 1, 1, 2, 2]",
        "sort_colors([2, 0, 1]) == [0, 1, 2]",
        "sort_colors([0]) == [0]"
      ]
    },
    {
      id: "remove-duplicates-sorted",
      title: "Remove Duplicates from Sorted Array",
      diff: "Easy",
      pattern: "Two Pointers",
      companies: ["Microsoft", "Amazon", "Meta", "Cognizant"],
      freq: 4,
      statement: "Given a sorted array `nums`, remove the duplicates in place so each unique element appears once, keeping their order. Return `k`, the number of unique elements; the first k slots of `nums` must hold them.",
      examples: [
        ["nums = [1, 1, 2]", "2, nums = [1, 2, _]", ""],
        ["nums = [0,0,1,1,1,2,2,3,3,4]", "5, nums = [0,1,2,3,4,...]", ""]
      ],
      constraints: ["1 <= len(nums) <= 3 * 10^4", "nums is sorted ascending", "Must be done in place"],
      hints: [
        "Because it is sorted, duplicates are always adjacent.",
        "Keep a write pointer for the next unique slot and a read pointer that scans everything.",
        "Compare the current value against the last value you wrote, not against its neighbour."
      ],
      approach: "Slow/fast pointers. `insert` is the write position for the next unique value and starts at 1, since the first element is always unique. The scan compares `nums[i]` with the last written value `nums[insert - 1]`; when they differ, a new unique value is written and the boundary grows. `insert` ends up being the count k.",
      time: "O(n)",
      space: "O(1)",
      solution: "def remove_duplicates(nums):\n    if not nums:\n        return 0\n\n    insert = 1\n    for i in range(1, len(nums)):\n        if nums[i] != nums[insert - 1]:\n            nums[insert] = nums[i]\n            insert += 1\n\n    return insert",
      tests: [
        "remove_duplicates([1, 1, 2]) == 2",
        "remove_duplicates([0,0,1,1,1,2,2,3,3,4]) == 5",
        "remove_duplicates([7]) == 1"
      ]
    },
    {
      id: "longest-substring-no-repeat",
      title: "Longest Substring Without Repeating Characters",
      diff: "Medium",
      pattern: "Sliding Window",
      companies: ["Amazon", "Bloomberg", "Meta", "Adobe", "Google"],
      freq: 5,
      statement: "Given a string `s`, return the length of the longest substring that contains no repeated characters.",
      examples: [
        ["s = \"abcabcbb\"", "3", "The answer is \"abc\"."],
        ["s = \"pwwkew\"", "3", "\"wke\" - note \"pwke\" is a subsequence, not a substring."]
      ],
      constraints: ["0 <= len(s) <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
      hints: [
        "Slide a window and keep it free of duplicates at all times.",
        "Store the last index at which each character was seen.",
        "When a repeat appears, jump the window start past the previous occurrence - but never move it backwards."
      ],
      approach: "Sliding window with a last-seen map. `start` is the left edge of the current duplicate-free window. When the current character was seen at an index inside the window, the window start jumps to just past that occurrence. The `>= start` check is essential - without it a stale occurrence from before the window would drag `start` backwards and break the invariant.",
      time: "O(n)",
      space: "O(min(n, alphabet))",
      solution: "def length_of_longest_substring(s):\n    last_seen = {}\n    start = 0\n    longest = 0\n\n    for i, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= start:\n            start = last_seen[ch] + 1\n        last_seen[ch] = i\n        longest = max(longest, i - start + 1)\n\n    return longest",
      tests: [
        "length_of_longest_substring(\"abcabcbb\") == 3",
        "length_of_longest_substring(\"bbbbb\") == 1",
        "length_of_longest_substring(\"pwwkew\") == 3",
        "length_of_longest_substring(\"\") == 0"
      ]
    },
    {
      id: "longest-repeating-char-replacement",
      title: "Longest Repeating Character Replacement",
      diff: "Medium",
      pattern: "Sliding Window",
      companies: ["Google", "Amazon", "Meta"],
      freq: 4,
      statement: "You are given a string `s` and an integer `k`. You may change at most `k` characters to any other uppercase English letter. Return the length of the longest substring containing a single repeated letter you can produce.",
      examples: [
        ["s = \"ABAB\", k = 2", "4", "Change both A's to B (or both B's to A)."],
        ["s = \"AABABBA\", k = 1", "4", "Change the middle A to get \"AABBBBA\" -> \"BBBB\"."]
      ],
      constraints: ["1 <= len(s) <= 10^5", "0 <= k <= len(s)", "s consists of uppercase English letters"],
      hints: [
        "A window is valid when (window length - count of its most frequent letter) <= k.",
        "That difference is exactly the number of characters you would have to replace.",
        "Keep counts in a dict and shrink from the left whenever the window becomes invalid."
      ],
      approach: "Sliding window over character counts. Expand `right` one character at a time, tracking the frequency of the most common letter in the window. The replacements needed are `window_length - max_count`; while that exceeds k, shrink from the left. The answer is the largest valid window seen. Note `max_count` is never decreased - a stale-but-too-high value only prevents the window from growing, so the final answer stays correct.",
      time: "O(n)",
      space: "O(1)",
      solution: "def character_replacement(s, k):\n    counts = {}\n    left = 0\n    max_count = 0\n    longest = 0\n\n    for right in range(len(s)):\n        counts[s[right]] = counts.get(s[right], 0) + 1\n        max_count = max(max_count, counts[s[right]])\n\n        while (right - left + 1) - max_count > k:\n            counts[s[left]] -= 1\n            left += 1\n\n        longest = max(longest, right - left + 1)\n\n    return longest",
      tests: [
        "character_replacement(\"ABAB\", 2) == 4",
        "character_replacement(\"AABABBA\", 1) == 4",
        "character_replacement(\"AAAA\", 0) == 4"
      ]
    },
    {
      id: "permutation-in-string",
      title: "Permutation in String",
      diff: "Medium",
      pattern: "Sliding Window",
      companies: ["Microsoft", "Amazon", "Meta", "Yandex"],
      freq: 4,
      statement: "Given two strings `s1` and `s2`, return `True` if `s2` contains a permutation of `s1` - that is, if any substring of `s2` is an anagram of `s1`.",
      examples: [
        ["s1 = \"ab\", s2 = \"eidbaooo\"", "True", "s2 contains \"ba\"."],
        ["s1 = \"ab\", s2 = \"eidboaoo\"", "False", ""]
      ],
      constraints: ["1 <= len(s1), len(s2) <= 10^4", "Lowercase English letters only"],
      hints: [
        "Any permutation of s1 has exactly the same letter counts as s1.",
        "Slide a fixed-size window of length len(s1) across s2.",
        "Update the counts in O(1) per step: add the entering character, remove the leaving one."
      ],
      approach: "Fixed-size sliding window with two 26-slot frequency arrays. Build the target counts from `s1` and the counts for the first window of `s2`, then slide one character at a time - incrementing the entering letter and decrementing the one that fell out. Comparing two 26-element lists is constant work, so the whole scan is linear.",
      time: "O(n)",
      space: "O(1)",
      solution: "def check_inclusion(s1, s2):\n    if len(s1) > len(s2):\n        return False\n\n    need = [0] * 26\n    window = [0] * 26\n    for i in range(len(s1)):\n        need[ord(s1[i]) - ord('a')] += 1\n        window[ord(s2[i]) - ord('a')] += 1\n\n    if need == window:\n        return True\n\n    for i in range(len(s1), len(s2)):\n        window[ord(s2[i]) - ord('a')] += 1\n        window[ord(s2[i - len(s1)]) - ord('a')] -= 1\n        if need == window:\n            return True\n\n    return False",
      tests: [
        "check_inclusion(\"ab\", \"eidbaooo\") is True",
        "check_inclusion(\"ab\", \"eidboaoo\") is False",
        "check_inclusion(\"adc\", \"dcda\") is True"
      ]
    },
    {
      id: "minimum-window-substring",
      title: "Minimum Window Substring",
      diff: "Hard",
      pattern: "Sliding Window",
      companies: ["Meta", "Amazon", "Google", "LinkedIn", "Uber"],
      freq: 5,
      statement: "Given strings `s` and `t`, return the shortest substring of `s` that contains every character of `t` including duplicates. If no such window exists, return the empty string.",
      examples: [
        ["s = \"ADOBECODEBANC\", t = \"ABC\"", "\"BANC\"", ""],
        ["s = \"a\", t = \"aa\"", "\"\"", "s only has one a, so no window can hold two."]
      ],
      constraints: ["1 <= len(s), len(t) <= 10^5", "s and t consist of English letters"],
      hints: [
        "Count what t needs. Grow the window right until every requirement is met.",
        "Then shrink from the left as far as possible while still valid, recording the best window.",
        "Track how many distinct characters are still short, so validity is an O(1) check."
      ],
      approach: "Expand-then-contract sliding window. `need` holds the required counts and `missing` is how many distinct characters are not yet satisfied. Growing right decrements `missing` exactly when a character's count reaches its requirement. While `missing == 0` the window is valid, so record it if it is the shortest so far and shrink from the left until it breaks. Every index enters and leaves the window once, so it is linear.",
      time: "O(n + m)",
      space: "O(n + m)",
      solution: "def min_window(s, t):\n    if not s or not t:\n        return \"\"\n\n    need = {}\n    for ch in t:\n        need[ch] = need.get(ch, 0) + 1\n\n    missing = len(need)\n    window = {}\n    best_len = float('inf')\n    best_start = 0\n    left = 0\n\n    for right, ch in enumerate(s):\n        window[ch] = window.get(ch, 0) + 1\n        if ch in need and window[ch] == need[ch]:\n            missing -= 1\n\n        while missing == 0:\n            if right - left + 1 < best_len:\n                best_len = right - left + 1\n                best_start = left\n            window[s[left]] -= 1\n            if s[left] in need and window[s[left]] < need[s[left]]:\n                missing += 1\n            left += 1\n\n    if best_len == float('inf'):\n        return \"\"\n    return s[best_start:best_start + best_len]",
      tests: [
        "min_window(\"ADOBECODEBANC\", \"ABC\") == \"BANC\"",
        "min_window(\"a\", \"aa\") == \"\"",
        "min_window(\"a\", \"a\") == \"a\""
      ]
    },
    {
      id: "sliding-window-maximum",
      title: "Sliding Window Maximum",
      diff: "Hard",
      pattern: "Sliding Window",
      companies: ["Amazon", "Google", "Meta", "Citadel"],
      freq: 4,
      statement: "Given an array `nums` and a window size `k`, the window slides one position at a time from left to right. Return an array of the maximum value in each window.",
      examples: [
        ["nums = [1,3,-1,-3,5,3,6,7], k = 3", "[3, 3, 5, 5, 6, 7]", ""],
        ["nums = [1], k = 1", "[1]", ""]
      ],
      constraints: ["1 <= len(nums) <= 10^5", "1 <= k <= len(nums)", "Aim for O(n)"],
      hints: [
        "Recomputing the max per window is O(n * k) - too slow.",
        "A value is useless forever once a bigger value appears to its right inside the window.",
        "Keep a deque of indices whose values are strictly decreasing; the front is always the max."
      ],
      approach: "Monotonic deque of indices. Before pushing index `i`, pop every index from the back whose value is <= nums[i] - those can never be a maximum again. Pop from the front when it slides out of the window. The front therefore always holds the index of the current window's maximum. Each index is pushed and popped at most once, so the total cost is O(n).",
      time: "O(n)",
      space: "O(k)",
      solution: "from collections import deque\n\n\ndef max_sliding_window(nums, k):\n    dq = deque()\n    result = []\n\n    for i, num in enumerate(nums):\n        while dq and nums[dq[-1]] <= num:\n            dq.pop()\n        dq.append(i)\n\n        if dq[0] <= i - k:\n            dq.popleft()\n\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n\n    return result",
      tests: [
        "max_sliding_window([1,3,-1,-3,5,3,6,7], 3) == [3, 3, 5, 5, 6, 7]",
        "max_sliding_window([1], 1) == [1]",
        "max_sliding_window([9, 8, 7, 6], 2) == [9, 8, 7]"
      ]
    },
    {
      id: "valid-parentheses",
      title: "Valid Parentheses",
      diff: "Easy",
      pattern: "Stack",
      companies: ["Amazon", "Meta", "Google", "Microsoft", "Zoho"],
      freq: 5,
      statement: "Given a string `s` containing only the characters `()[]{}`, determine if the brackets are validly nested - every opener is closed by the matching type, and in the correct order.",
      examples: [
        ["s = \"()[]{}\"", "True", ""],
        ["s = \"(]\"", "False", "Wrong closing type."]
      ],
      constraints: ["1 <= len(s) <= 10^4", "s consists only of bracket characters"],
      hints: [
        "The most recently opened bracket must be the first one closed - that is a stack.",
        "Push openers; on a closer, the top of the stack must be its partner.",
        "Do not forget the leftovers: a non-empty stack at the end means unclosed brackets."
      ],
      approach: "Stack of pending openers. A closing bracket must match whatever is on top, so pop and compare via a `closer -> opener` map. Two failure modes need explicit handling: a closer arriving with an empty stack, and a non-empty stack once the string ends. `return not stack` covers the second case.",
      time: "O(n)",
      space: "O(n)",
      solution: "def is_valid(s):\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack = []\n\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n\n    return not stack",
      tests: [
        "is_valid(\"()[]{}\") is True",
        "is_valid(\"(]\") is False",
        "is_valid(\"([)]\") is False",
        "is_valid(\"{[]}\") is True"
      ]
    },
    {
      id: "min-stack",
      title: "Min Stack",
      diff: "Medium",
      pattern: "Stack",
      companies: ["Amazon", "Google", "Bloomberg", "Uber"],
      freq: 4,
      statement: "Design a stack supporting `push`, `pop`, `top` and `get_min`, where **every operation runs in O(1)**.",
      examples: [
        [
          "push(-2), push(0), push(-3), get_min(), pop(), top(), get_min()",
          "-3, then 0, then -2",
          ""
        ]
      ],
      constraints: [
        "-2^31 <= val <= 2^31 - 1",
        "pop, top and get_min are only called on a non-empty stack",
        "All four operations must be O(1)"
      ],
      hints: [
        "Scanning for the minimum on demand is O(n) - you need to precompute it.",
        "Keep a second stack holding the minimum as of each push.",
        "Use <= when pushing onto the min stack so duplicate minimums are tracked correctly."
      ],
      approach: "Two parallel stacks. `mins` records the running minimum: push onto it whenever the new value is <= the current minimum, and pop from it whenever the popped value equals the current minimum. Using `<=` rather than `<` matters - with duplicate minimums, a strict `<` would remove the minimum too early and report a wrong value afterwards.",
      time: "O(1) per operation",
      space: "O(n)",
      solution: "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.mins = []\n\n    def push(self, val):\n        self.stack.append(val)\n        if not self.mins or val <= self.mins[-1]:\n            self.mins.append(val)\n\n    def pop(self):\n        val = self.stack.pop()\n        if val == self.mins[-1]:\n            self.mins.pop()\n        return val\n\n    def top(self):\n        return self.stack[-1]\n\n    def get_min(self):\n        return self.mins[-1]",
      tests: ["_run() == [-3, 0, -2]", "_dupes() == 2"],
      harness: "def _run():\n    st = MinStack()\n    st.push(-2)\n    st.push(0)\n    st.push(-3)\n    out = [st.get_min()]\n    st.pop()\n    out.append(st.top())\n    out.append(st.get_min())\n    return out\n\n\ndef _dupes():\n    st = MinStack()\n    for v in [2, 2, 1, 1]:\n        st.push(v)\n    st.pop()\n    st.pop()\n    return st.get_min()"
    },
    {
      id: "daily-temperatures",
      title: "Daily Temperatures",
      diff: "Medium",
      pattern: "Stack",
      companies: ["Amazon", "Meta", "Google", "Cisco"],
      freq: 4,
      statement: "Given an array `temperatures`, return an array `answer` where `answer[i]` is the number of days you must wait after day `i` for a warmer temperature. If no warmer day exists, put 0.",
      examples: [
        ["temperatures = [73,74,75,71,69,72,76,73]", "[1,1,4,2,1,1,0,0]", ""],
        ["temperatures = [30, 40, 50, 60]", "[1, 1, 1, 0]", ""]
      ],
      constraints: ["1 <= len(temperatures) <= 10^5", "30 <= temperatures[i] <= 100"],
      hints: [
        "This is 'next greater element' in disguise.",
        "Keep a stack of days that are still waiting for a warmer day.",
        "Store indices, not temperatures - you need the index to compute the gap."
      ],
      approach: "Monotonic decreasing stack of indices. Each new temperature resolves every stacked day that is colder: pop them and record `current_index - popped_index` as the wait. Days left on the stack at the end never got a warmer day, and the array was pre-filled with 0 for exactly that case. Each index is pushed and popped once, so it is linear.",
      time: "O(n)",
      space: "O(n)",
      solution: "def daily_temperatures(temperatures):\n    result = [0] * len(temperatures)\n    stack = []\n\n    for i, temp in enumerate(temperatures):\n        while stack and temperatures[stack[-1]] < temp:\n            prev = stack.pop()\n            result[prev] = i - prev\n        stack.append(i)\n\n    return result",
      tests: [
        "daily_temperatures([73,74,75,71,69,72,76,73]) == [1,1,4,2,1,1,0,0]",
        "daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]",
        "daily_temperatures([30, 30, 30]) == [0, 0, 0]"
      ]
    },
    {
      id: "evaluate-rpn",
      title: "Evaluate Reverse Polish Notation",
      diff: "Medium",
      pattern: "Stack",
      companies: ["Amazon", "LinkedIn", "Meta", "Bloomberg"],
      freq: 4,
      statement: "Evaluate an arithmetic expression given in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, `/`, and division between two integers should truncate toward zero.",
      examples: [
        ["tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]", "9", "((2 + 1) * 3)"],
        ["tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]", "6", "(4 + (13 / 5))"]
      ],
      constraints: [
        "1 <= len(tokens) <= 10^4",
        "The expression is always valid",
        "Division truncates toward zero"
      ],
      hints: [
        "Push numbers; on an operator, pop the two most recent operands.",
        "Order matters for - and /: the first value popped is the right-hand operand.",
        "Python's // floors toward negative infinity; int(a / b) truncates toward zero."
      ],
      approach: "Evaluate with a stack. Numbers get pushed; an operator pops two operands, applies itself, and pushes the result. Watch the operand order - the top of the stack is the *right* side of the expression, so it must be `a - b` and `a / b` with `a` popped second. Use `int(a / b)` because Python's `//` floors, which gives the wrong sign behaviour for negatives.",
      time: "O(n)",
      space: "O(n)",
      solution: "def eval_rpn(tokens):\n    stack = []\n    operators = {\"+\", \"-\", \"*\", \"/\"}\n\n    for token in tokens:\n        if token in operators:\n            b = stack.pop()\n            a = stack.pop()\n            if token == \"+\":\n                stack.append(a + b)\n            elif token == \"-\":\n                stack.append(a - b)\n            elif token == \"*\":\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))\n        else:\n            stack.append(int(token))\n\n    return stack[0]",
      tests: [
        "eval_rpn([\"2\",\"1\",\"+\",\"3\",\"*\"]) == 9",
        "eval_rpn([\"4\",\"13\",\"5\",\"/\",\"+\"]) == 6",
        "eval_rpn([\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]) == 22"
      ]
    },
    {
      id: "decode-string",
      title: "Decode String",
      diff: "Medium",
      pattern: "Stack",
      companies: ["Google", "Amazon", "Meta", "Bloomberg"],
      freq: 4,
      statement: "Given an encoded string of the form `k[encoded_string]`, meaning the bracketed part repeats k times, return the decoded string. Encodings can be nested and k is always a positive integer.",
      examples: [
        ["s = \"3[a]2[bc]\"", "\"aaabcbc\"", ""],
        ["s = \"3[a2[c]]\"", "\"accaccacc\"", "Nested repetition."]
      ],
      constraints: [
        "1 <= len(s) <= 30",
        "s contains lowercase letters, digits and square brackets",
        "Input is always valid"
      ],
      hints: [
        "Multi-digit counts exist, so build the number as you read digits: count = count * 10 + digit.",
        "On '[' save the work-in-progress string and the count, then start fresh.",
        "On ']' pop them and splice: previous + current * count."
      ],
      approach: "One stack holding `(string so far, repeat count)` pairs. Digits accumulate into `count`. An opening bracket pushes the current context and resets both accumulators for the inner segment. A closing bracket pops the parent context and folds the finished inner string in, multiplied by its count. Nesting works for free because each level restores exactly its own context.",
      time: "O(n * k)",
      space: "O(n)",
      solution: "def decode_string(s):\n    stack = []\n    current = \"\"\n    count = 0\n\n    for ch in s:\n        if ch.isdigit():\n            count = count * 10 + int(ch)\n        elif ch == \"[\":\n            stack.append((current, count))\n            current = \"\"\n            count = 0\n        elif ch == \"]\":\n            prev, repeat = stack.pop()\n            current = prev + current * repeat\n        else:\n            current += ch\n\n    return current",
      tests: [
        "decode_string(\"3[a]2[bc]\") == \"aaabcbc\"",
        "decode_string(\"3[a2[c]]\") == \"accaccacc\"",
        "decode_string(\"2[abc]3[cd]ef\") == \"abcabccdcdcdef\""
      ]
    },
    {
      id: "largest-rectangle-histogram",
      title: "Largest Rectangle in Histogram",
      diff: "Hard",
      pattern: "Stack",
      companies: ["Amazon", "Google", "Microsoft", "Flipkart"],
      freq: 4,
      statement: "Given an array `heights` of bar heights in a histogram where each bar has width 1, return the area of the largest rectangle that fits inside the histogram.",
      examples: [
        ["heights = [2, 1, 5, 6, 2, 3]", "10", "Bars of height 5 and 6 give 5 * 2 = 10."],
        ["heights = [2, 4]", "4", ""]
      ],
      constraints: ["1 <= len(heights) <= 10^5", "0 <= heights[i] <= 10^4"],
      hints: [
        "For each bar, how far left and right can it extend while staying at least that tall?",
        "A monotonic increasing stack finds those boundaries in one pass.",
        "When a shorter bar arrives, every taller bar on the stack has found its right edge."
      ],
      approach: "Monotonic increasing stack of `(start_index, height)`. When a bar shorter than the stack top arrives, every taller entry is finalised - its rectangle ends here, so its area is `height * (i - start)`. The popped entry's start index is inherited by the incoming bar, because the new bar can extend back over everything it just knocked down. Appending a sentinel 0 flushes the stack at the end.",
      time: "O(n)",
      space: "O(n)",
      solution: "def largest_rectangle_area(heights):\n    stack = []\n    best = 0\n\n    for i, h in enumerate(heights + [0]):\n        start = i\n        while stack and stack[-1][1] > h:\n            index, height = stack.pop()\n            best = max(best, height * (i - index))\n            start = index\n        stack.append((start, h))\n\n    return best",
      tests: [
        "largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10",
        "largest_rectangle_area([2, 4]) == 4",
        "largest_rectangle_area([1]) == 1"
      ]
    },
    {
      id: "binary-search",
      title: "Binary Search",
      diff: "Easy",
      pattern: "Binary Search",
      companies: ["Amazon", "Microsoft", "Google", "Infosys"],
      freq: 5,
      statement: "Given a sorted array of distinct integers `nums` and a `target`, return the index of the target or -1 if it is absent. Your algorithm must run in O(log n) time.",
      examples: [
        ["nums = [-1,0,3,5,9,12], target = 9", "4", ""],
        ["nums = [-1,0,3,5,9,12], target = 2", "-1", ""]
      ],
      constraints: ["1 <= len(nums) <= 10^4", "All values are unique and sorted ascending"],
      hints: [
        "Keep two bounds and repeatedly halve the search space.",
        "Use `left + (right - left) // 2` to avoid overflow in languages with fixed-width ints.",
        "With an inclusive right bound, the loop condition must be `left <= right`."
      ],
      approach: "Textbook binary search with inclusive bounds. Compare the midpoint against the target and discard the half that cannot contain it. The two details interviewers watch for: `left <= right` (not `<`), so a one-element range is still examined, and moving to `mid + 1` / `mid - 1` so the range always shrinks and the loop cannot spin forever.",
      time: "O(log n)",
      space: "O(1)",
      solution: "def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return -1",
      tests: [
        "binary_search([-1,0,3,5,9,12], 9) == 4",
        "binary_search([-1,0,3,5,9,12], 2) == -1",
        "binary_search([5], 5) == 0"
      ]
    },
    {
      id: "search-rotated-sorted",
      title: "Search in Rotated Sorted Array",
      diff: "Medium",
      pattern: "Binary Search",
      companies: ["Amazon", "Meta", "Microsoft", "Google", "Bloomberg"],
      freq: 5,
      statement: "A sorted array of distinct integers was rotated at an unknown pivot. Given the rotated array `nums` and a `target`, return its index or -1. You must run in O(log n) time.",
      examples: [
        ["nums = [4,5,6,7,0,1,2], target = 0", "4", ""],
        ["nums = [4,5,6,7,0,1,2], target = 3", "-1", ""]
      ],
      constraints: ["1 <= len(nums) <= 5000", "All values are unique", "O(log n) required"],
      hints: [
        "Split at the midpoint: at least one half is guaranteed to be normally sorted.",
        "Compare nums[left] with nums[mid] to find out which half that is.",
        "If the target lies inside the sorted half's range, search there; otherwise search the other half."
      ],
      approach: "Binary search with an extra decision. Any midpoint splits a rotated array into one properly sorted half and one containing the pivot. `nums[left] <= nums[mid]` identifies the sorted left half. Inside a sorted half you can test membership by range comparison, so you either commit to that half or discard it entirely - keeping the search logarithmic.",
      time: "O(log n)",
      space: "O(1)",
      solution: "def search_rotated(nums, target):\n    left, right = 0, len(nums) - 1\n\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n\n    return -1",
      tests: [
        "search_rotated([4,5,6,7,0,1,2], 0) == 4",
        "search_rotated([4,5,6,7,0,1,2], 3) == -1",
        "search_rotated([1], 0) == -1",
        "search_rotated([3, 1], 1) == 1"
      ]
    },
    {
      id: "find-min-rotated",
      title: "Find Minimum in Rotated Sorted Array",
      diff: "Medium",
      pattern: "Binary Search",
      companies: ["Amazon", "Microsoft", "Meta", "Goldman Sachs"],
      freq: 4,
      statement: "A sorted array of unique integers was rotated some number of times. Return its minimum element in O(log n) time.",
      examples: [
        ["nums = [3, 4, 5, 1, 2]", "1", ""],
        ["nums = [11, 13, 15, 17]", "11", "Not rotated at all."]
      ],
      constraints: ["1 <= len(nums) <= 5000", "All values are unique"],
      hints: [
        "The minimum is the single point where the ordering breaks.",
        "Compare the midpoint with the RIGHT edge, not the left - it is unambiguous.",
        "If nums[mid] > nums[right], the pivot is strictly to the right of mid."
      ],
      approach: "Binary search on the rotation point using an exclusive right bound. Comparing against `nums[right]` is the key choice: `nums[mid] > nums[right]` proves the minimum lies after mid, otherwise mid could itself be the minimum so keep it with `right = mid`. The loop condition `left < right` converges to exactly one surviving index - the answer.",
      time: "O(log n)",
      space: "O(1)",
      solution: "def find_min(nums):\n    left, right = 0, len(nums) - 1\n\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        else:\n            right = mid\n\n    return nums[left]",
      tests: [
        "find_min([3, 4, 5, 1, 2]) == 1",
        "find_min([4,5,6,7,0,1,2]) == 0",
        "find_min([11, 13, 15, 17]) == 11"
      ]
    },
    {
      id: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      diff: "Medium",
      pattern: "Binary Search",
      companies: ["Meta", "Amazon", "Google", "Uber"],
      freq: 4,
      statement: "Koko has `piles` of bananas and `h` hours before the guards return. Each hour she picks one pile and eats up to `k` bananas from it; if the pile is smaller she eats it and stops for that hour. Return the minimum integer `k` that lets her finish all piles within `h` hours.",
      examples: [
        ["piles = [3, 6, 7, 11], h = 8", "4", ""],
        ["piles = [30, 11, 23, 4, 20], h = 6", "23", ""]
      ],
      constraints: ["1 <= len(piles) <= 10^4", "len(piles) <= h <= 10^9", "1 <= piles[i] <= 10^9"],
      hints: [
        "You are not searching the array - you are searching the answer space of possible speeds.",
        "The valid speeds are 1 through max(piles), and feasibility is monotonic: if k works, k + 1 works.",
        "Hours for one pile at speed k is ceil(pile / k), which is (pile + k - 1) // k."
      ],
      approach: "Binary search on the answer. Speed feasibility is monotonic, so the valid speeds form a suffix of [1, max(piles)] and you can binary search for its first element. For each candidate speed, sum `ceil(pile / k)` across the piles; if it fits in `h` hours, try slower, otherwise go faster. Total cost is O(n log(max pile)).",
      time: "O(n log m)",
      space: "O(1)",
      solution: "def min_eating_speed(piles, h):\n    left, right = 1, max(piles)\n\n    while left < right:\n        mid = (left + right) // 2\n        hours = 0\n        for pile in piles:\n            hours += (pile + mid - 1) // mid\n        if hours <= h:\n            right = mid\n        else:\n            left = mid + 1\n\n    return left",
      tests: [
        "min_eating_speed([3, 6, 7, 11], 8) == 4",
        "min_eating_speed([30, 11, 23, 4, 20], 5) == 30",
        "min_eating_speed([30, 11, 23, 4, 20], 6) == 23"
      ]
    },
    {
      id: "search-2d-matrix",
      title: "Search a 2D Matrix",
      diff: "Medium",
      pattern: "Binary Search",
      companies: ["Amazon", "Microsoft", "Meta", "Adobe"],
      freq: 4,
      statement: "You are given an m x n matrix where each row is sorted ascending and the first value of each row is greater than the last value of the previous row. Return `True` if `target` is present, in O(log(m * n)) time.",
      examples: [
        [
          "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
          "True",
          ""
        ],
        [
          "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
          "False",
          ""
        ]
      ],
      constraints: ["1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
      hints: [
        "Given the ordering rule, the matrix behaves exactly like one long sorted array.",
        "Index i of that virtual array is matrix[i // cols][i % cols].",
        "Now it is plain binary search over 0 .. m * n - 1."
      ],
      approach: "Treat the matrix as a flattened sorted array of length `m * n`. The guarantee that each row starts above the previous row's end is what makes that valid. Convert a flat index with `divmod`: row is `mid // cols`, column is `mid % cols`. Everything else is ordinary binary search, giving O(log(m*n)).",
      time: "O(log(m * n))",
      space: "O(1)",
      solution: "def search_matrix(matrix, target):\n    rows, cols = len(matrix), len(matrix[0])\n    left, right = 0, rows * cols - 1\n\n    while left <= right:\n        mid = (left + right) // 2\n        value = matrix[mid // cols][mid % cols]\n        if value == target:\n            return True\n        if value < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return False",
      tests: [
        "search_matrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3) is True",
        "search_matrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13) is False",
        "search_matrix([[1]], 1) is True"
      ]
    },
    {
      id: "median-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      diff: "Hard",
      pattern: "Binary Search",
      companies: ["Google", "Amazon", "Meta", "Apple", "Microsoft"],
      freq: 4,
      statement: "Given two sorted arrays `nums1` and `nums2`, return the median of the combined sorted array. The overall run time must be O(log(m + n)).",
      examples: [
        ["nums1 = [1, 3], nums2 = [2]", "2.0", "Merged = [1, 2, 3]."],
        ["nums1 = [1, 2], nums2 = [3, 4]", "2.5", "Merged = [1, 2, 3, 4], median = (2 + 3) / 2."]
      ],
      constraints: ["0 <= m, n <= 1000", "1 <= m + n <= 2000", "O(log(m + n)) required"],
      hints: [
        "Do not merge - binary search the *partition point* instead.",
        "Cut both arrays so the left side holds exactly half the elements.",
        "The cut is correct when max(left side) <= min(right side) across both arrays."
      ],
      approach: "Binary search the partition of the smaller array. Choosing `i` elements from nums1 forces `j = half - i` from nums2, so only one variable is searched. The partition is correct when `left1 <= right2` and `left2 <= right1`. Infinities stand in for out-of-range edges so no special-casing is needed. Searching the shorter array keeps it at O(log(min(m, n))).",
      time: "O(log(min(m, n)))",
      space: "O(1)",
      solution: "def find_median_sorted_arrays(nums1, nums2):\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n\n    m, n = len(nums1), len(nums2)\n    half = (m + n + 1) // 2\n    left, right = 0, m\n\n    while left <= right:\n        i = (left + right) // 2\n        j = half - i\n\n        left1 = nums1[i - 1] if i > 0 else float('-inf')\n        right1 = nums1[i] if i < m else float('inf')\n        left2 = nums2[j - 1] if j > 0 else float('-inf')\n        right2 = nums2[j] if j < n else float('inf')\n\n        if left1 <= right2 and left2 <= right1:\n            if (m + n) % 2 == 1:\n                return float(max(left1, left2))\n            return (max(left1, left2) + min(right1, right2)) / 2\n\n        if left1 > right2:\n            right = i - 1\n        else:\n            left = i + 1\n\n    return 0.0",
      tests: [
        "find_median_sorted_arrays([1, 3], [2]) == 2.0",
        "find_median_sorted_arrays([1, 2], [3, 4]) == 2.5",
        "find_median_sorted_arrays([], [1]) == 1.0"
      ]
    }
  ]);
})(window.TD);
