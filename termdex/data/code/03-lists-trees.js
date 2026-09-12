/* Code Dojo — Linked lists and binary trees.

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
      id: "reverse-linked-list",
      title: "Reverse Linked List",
      diff: "Easy",
      pattern: "Linked List",
      companies: ["Amazon", "Microsoft", "Meta", "Apple", "Adobe"],
      freq: 5,
      statement: "Given the head of a singly linked list, reverse the list and return the new head.",
      examples: [
        ["head = [1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]", ""],
        ["head = []", "[]", ""]
      ],
      constraints: [
        "0 <= number of nodes <= 5000",
        "-5000 <= Node.val <= 5000",
        "Try both iterative and recursive"
      ],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "You need three pointers: previous, current, and the saved next.",
        "Save current.next BEFORE you overwrite it, or you lose the rest of the list.",
        "The new head is the last non-null node, which is exactly `prev` when the loop ends."
      ],
      approach: "Walk the list flipping each `next` pointer to point backwards. `prev` starts as None (the old head becomes the new tail). The one thing that will break you is overwriting `current.next` before saving it - stash it in `nxt` first. When `current` falls off the end, `prev` is sitting on the final node, which is the new head.",
      time: "O(n)",
      space: "O(1)",
      solution: "def reverse_list(head):\n    prev = None\n    current = head\n\n    while current:\n        nxt = current.next\n        current.next = prev\n        prev = current\n        current = nxt\n\n    return prev",
      tests: [
        "_to_list(reverse_list(_build_list([1, 2, 3, 4, 5]))) == [5, 4, 3, 2, 1]",
        "_to_list(reverse_list(_build_list([]))) == []",
        "_to_list(reverse_list(_build_list([1]))) == [1]"
      ]
    },
    {
      id: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      diff: "Easy",
      pattern: "Linked List",
      companies: ["Amazon", "Microsoft", "Apple", "Meta"],
      freq: 5,
      statement: "You are given the heads of two sorted linked lists. Splice them together into one sorted list and return its head. The result should reuse the existing nodes.",
      examples: [
        ["list1 = [1, 2, 4], list2 = [1, 3, 4]", "[1, 1, 2, 3, 4, 4]", ""],
        ["list1 = [], list2 = [0]", "[0]", ""]
      ],
      constraints: ["0 <= nodes in each list <= 50", "Both lists are sorted ascending"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "A dummy head node removes every 'is this the first node?' special case.",
        "Always attach the smaller of the two current nodes and advance that list.",
        "When one list runs out, attach the entire remainder of the other in one step."
      ],
      approach: "Dummy head plus a tail pointer. Compare the two front nodes, splice the smaller one onto the tail, and advance that list. Because the inputs are sorted, whichever list still has nodes when the loop exits is already sorted and larger than everything placed, so `tail.next = list1 or list2` finishes the job. Return `dummy.next` - never `dummy`.",
      time: "O(n + m)",
      space: "O(1)",
      solution: "def merge_two_lists(list1, list2):\n    dummy = ListNode()\n    tail = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            tail.next = list1\n            list1 = list1.next\n        else:\n            tail.next = list2\n            list2 = list2.next\n        tail = tail.next\n\n    tail.next = list1 or list2\n    return dummy.next",
      tests: [
        "_to_list(merge_two_lists(_build_list([1, 2, 4]), _build_list([1, 3, 4]))) == [1, 1, 2, 3, 4, 4]",
        "_to_list(merge_two_lists(_build_list([]), _build_list([0]))) == [0]",
        "_to_list(merge_two_lists(_build_list([]), _build_list([]))) == []"
      ]
    },
    {
      id: "linked-list-cycle",
      title: "Linked List Cycle",
      diff: "Easy",
      pattern: "Linked List",
      companies: ["Amazon", "Microsoft", "Bloomberg", "Meta"],
      freq: 5,
      statement: "Given the head of a linked list, determine whether it contains a cycle. Solve it using O(1) memory.",
      examples: [
        ["head = [3, 2, 0, -4], tail connects to index 1", "True", ""],
        ["head = [1, 2], no cycle", "False", ""]
      ],
      constraints: ["0 <= nodes <= 10^4", "O(1) extra space"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "A visited set works but costs O(n) memory.",
        "Two runners on a circular track will eventually meet - that is Floyd's algorithm.",
        "Check `fast and fast.next` before stepping twice, or you will hit an AttributeError."
      ],
      approach: "Floyd's tortoise and hare. The slow pointer takes one step, the fast pointer two. If there is a cycle, the gap between them closes by exactly one node per iteration, so they must eventually collide. If there is no cycle, `fast` walks off the end - which is why the loop condition must test both `fast` and `fast.next` before dereferencing.",
      time: "O(n)",
      space: "O(1)",
      solution: "def has_cycle(head):\n    slow = head\n    fast = head\n\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n\n    return False",
      tests: [
        "has_cycle(_cyclic([3, 2, 0, -4], 1)) is True",
        "has_cycle(_cyclic([1, 2], -1)) is False",
        "has_cycle(_cyclic([1], 0)) is True"
      ],
      harness: "def _cyclic(values, pos):\n    head = _build_list(values)\n    if head is None:\n        return None\n    nodes = []\n    node = head\n    while node:\n        nodes.append(node)\n        node = node.next\n    if pos >= 0:\n        nodes[-1].next = nodes[pos]\n    return head"
    },
    {
      id: "middle-of-linked-list",
      title: "Middle of the Linked List",
      diff: "Easy",
      pattern: "Linked List",
      companies: ["Amazon", "Microsoft", "Adobe"],
      freq: 4,
      statement: "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second one.",
      examples: [
        ["head = [1, 2, 3, 4, 5]", "[3, 4, 5]", "The node with value 3."],
        ["head = [1, 2, 3, 4, 5, 6]", "[4, 5, 6]", "Two middles - return the second."]
      ],
      constraints: ["1 <= nodes <= 100", "Solve it in one pass"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "Counting the length first works, but that is two passes.",
        "If one pointer moves twice as fast, where is the slow one when the fast one finishes?",
        "Starting both at head returns the second middle for even lengths, which is what is asked."
      ],
      approach: "Fast and slow pointers. The fast pointer covers two nodes per iteration, so when it reaches the end the slow pointer has covered exactly half - the middle. Starting both at `head` naturally lands on the *second* middle for even lengths. This split trick is the first step of several harder problems, including reordering a list and palindrome checks.",
      time: "O(n)",
      space: "O(1)",
      solution: "def middle_node(head):\n    slow = head\n    fast = head\n\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n\n    return slow",
      tests: [
        "_to_list(middle_node(_build_list([1, 2, 3, 4, 5]))) == [3, 4, 5]",
        "_to_list(middle_node(_build_list([1, 2, 3, 4, 5, 6]))) == [4, 5, 6]",
        "_to_list(middle_node(_build_list([1]))) == [1]"
      ]
    },
    {
      id: "remove-nth-from-end",
      title: "Remove Nth Node From End of List",
      diff: "Medium",
      pattern: "Linked List",
      companies: ["Amazon", "Meta", "Microsoft", "Bloomberg"],
      freq: 5,
      statement: "Given the head of a linked list, remove the nth node counting from the end and return the head. Do it in one pass.",
      examples: [
        ["head = [1,2,3,4,5], n = 2", "[1, 2, 3, 5]", "The 4 is removed."],
        ["head = [1], n = 1", "[]", ""]
      ],
      constraints: ["1 <= nodes <= 30", "1 <= n <= number of nodes", "One pass preferred"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "Removing a node requires a pointer to the node BEFORE it.",
        "Give one pointer an n-node head start, then move both together.",
        "A dummy node in front of the head makes deleting the head itself a non-special case."
      ],
      approach: "Two pointers separated by a fixed gap of n. Advance `fast` n steps first, then move both until `fast.next` is None - at that moment `slow` sits exactly one node before the target. The dummy node is what makes removing the head work: without it, `slow` would have nowhere to stand when the target is the first node.",
      time: "O(n)",
      space: "O(1)",
      solution: "def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    slow = dummy\n    fast = dummy\n\n    for _ in range(n):\n        fast = fast.next\n\n    while fast.next:\n        slow = slow.next\n        fast = fast.next\n\n    slow.next = slow.next.next\n    return dummy.next",
      tests: [
        "_to_list(remove_nth_from_end(_build_list([1, 2, 3, 4, 5]), 2)) == [1, 2, 3, 5]",
        "_to_list(remove_nth_from_end(_build_list([1]), 1)) == []",
        "_to_list(remove_nth_from_end(_build_list([1, 2]), 2)) == [2]"
      ]
    },
    {
      id: "reorder-list",
      title: "Reorder List",
      diff: "Medium",
      pattern: "Linked List",
      companies: ["Meta", "Amazon", "Microsoft", "Google"],
      freq: 4,
      statement: "Given a list `L0 -> L1 -> ... -> Ln`, reorder it to `L0 -> Ln -> L1 -> Ln-1 -> ...`. You may not modify the node values, only the links.",
      examples: [
        ["head = [1, 2, 3, 4]", "[1, 4, 2, 3]", ""],
        ["head = [1, 2, 3, 4, 5]", "[1, 5, 2, 4, 3]", ""]
      ],
      constraints: ["1 <= nodes <= 5 * 10^4", "Rearrange links only, do not swap values"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "You need the nodes from the back, but a singly linked list only goes forward.",
        "Three known sub-problems stacked: find the middle, reverse the second half, merge alternately.",
        "Cut the first half loose with slow.next = None or you will build a cycle."
      ],
      approach: "Three classic steps in sequence. Find the middle with fast/slow pointers, reverse the second half in place, then weave the two halves together one node at a time. Setting `slow.next = None` to sever the halves is essential - skip it and the merge creates a cycle. Starting `fast` at `head.next` makes the split favour the first half, which is what the alternating merge expects.",
      time: "O(n)",
      space: "O(1)",
      solution: "def reorder_list(head):\n    if not head or not head.next:\n        return head\n\n    slow, fast = head, head.next\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n\n    second = slow.next\n    slow.next = None\n\n    prev = None\n    while second:\n        nxt = second.next\n        second.next = prev\n        prev = second\n        second = nxt\n\n    first, second = head, prev\n    while second:\n        n1, n2 = first.next, second.next\n        first.next = second\n        second.next = n1\n        first, second = n1, n2\n\n    return head",
      tests: [
        "_to_list(reorder_list(_build_list([1, 2, 3, 4]))) == [1, 4, 2, 3]",
        "_to_list(reorder_list(_build_list([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]",
        "_to_list(reorder_list(_build_list([1, 2]))) == [1, 2]"
      ]
    },
    {
      id: "palindrome-linked-list",
      title: "Palindrome Linked List",
      diff: "Easy",
      pattern: "Linked List",
      companies: ["Amazon", "Meta", "Microsoft", "Adobe"],
      freq: 4,
      statement: "Given the head of a singly linked list, return `True` if the sequence of values reads the same forwards and backwards. Aim for O(n) time and O(1) space.",
      examples: [
        ["head = [1, 2, 2, 1]", "True", ""],
        ["head = [1, 2]", "False", ""]
      ],
      constraints: ["1 <= nodes <= 10^5", "O(1) space for full credit"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "Copying the values into a list and comparing to its reverse is O(n) space - the easy answer.",
        "For O(1): find the middle, reverse the second half, then walk both halves in step.",
        "Stop the comparison when the reversed half runs out - it may be one node shorter."
      ],
      approach: "Find the midpoint with fast/slow pointers, reverse from the midpoint onward, then compare the front half against the reversed back half. The loop is driven by the reversed half, which is never longer than the front, so an odd middle node is skipped harmlessly. In production you would restore the list afterwards - mention that, interviewers like hearing it.",
      time: "O(n)",
      space: "O(1)",
      solution: "def is_palindrome_list(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n\n    prev = None\n    while slow:\n        nxt = slow.next\n        slow.next = prev\n        prev = slow\n        slow = nxt\n\n    left, right = head, prev\n    while right:\n        if left.val != right.val:\n            return False\n        left = left.next\n        right = right.next\n\n    return True",
      tests: [
        "is_palindrome_list(_build_list([1, 2, 2, 1])) is True",
        "is_palindrome_list(_build_list([1, 2])) is False",
        "is_palindrome_list(_build_list([1, 2, 3, 2, 1])) is True"
      ]
    },
    {
      id: "add-two-numbers",
      title: "Add Two Numbers",
      diff: "Medium",
      pattern: "Linked List",
      companies: ["Amazon", "Microsoft", "Meta", "Bloomberg", "Adobe"],
      freq: 5,
      statement: "You are given two non-empty linked lists representing two non-negative integers, with the digits stored in **reverse order**. Add the numbers and return the sum as a linked list in the same format.",
      examples: [
        ["l1 = [2,4,3], l2 = [5,6,4]", "[7, 0, 8]", "342 + 465 = 807."],
        ["l1 = [9,9,9], l2 = [1]", "[0, 0, 0, 1]", "999 + 1 = 1000."]
      ],
      constraints: [
        "1 <= nodes in each list <= 100",
        "0 <= Node.val <= 9",
        "No leading zeros except the number 0"
      ],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "Reverse order is a gift - you meet the ones digit first, exactly like hand addition.",
        "One loop condition covers everything: `while l1 or l2 or carry`.",
        "divmod(total, 10) gives you the carry and the digit in one step."
      ],
      approach: "Simulate long addition with a carry. The loop continues while either list has digits *or* a carry is pending - that final `carry` clause is what produces the extra leading 1 in cases like 999 + 1. A dummy head keeps the append logic uniform, and `divmod` splits the running total into the new carry and the digit to store.",
      time: "O(max(n, m))",
      space: "O(max(n, m))",
      solution: "def add_two_numbers(l1, l2):\n    dummy = ListNode()\n    current = dummy\n    carry = 0\n\n    while l1 or l2 or carry:\n        total = carry\n        if l1:\n            total += l1.val\n            l1 = l1.next\n        if l2:\n            total += l2.val\n            l2 = l2.next\n\n        carry, digit = divmod(total, 10)\n        current.next = ListNode(digit)\n        current = current.next\n\n    return dummy.next",
      tests: [
        "_to_list(add_two_numbers(_build_list([2, 4, 3]), _build_list([5, 6, 4]))) == [7, 0, 8]",
        "_to_list(add_two_numbers(_build_list([9, 9, 9]), _build_list([1]))) == [0, 0, 0, 1]",
        "_to_list(add_two_numbers(_build_list([0]), _build_list([0]))) == [0]"
      ]
    },
    {
      id: "copy-list-random-pointer",
      title: "Copy List with Random Pointer",
      diff: "Medium",
      pattern: "Linked List",
      companies: ["Amazon", "Meta", "Microsoft", "Bloomberg"],
      freq: 4,
      statement: "A linked list where each node has a `next` pointer and a `random` pointer (which may point anywhere in the list or be None). Return a **deep copy** of the list - entirely new nodes with the same structure.",
      examples: [
        [
          "head = [[7,None],[13,0],[11,0]]",
          "[[7,None],[13,0],[11,0]]",
          "Each pair is [value, index the random points to]."
        ],
        ["head = []", "[]", ""]
      ],
      constraints: ["0 <= nodes <= 1000", "random may be None or any node in the list"],
      context: "class Node:\n    def __init__(self, val, next=None, random=None):\n        self.val = val\n        self.next = next\n        self.random = random",
      hints: [
        "The problem is that a random pointer may target a node you have not created yet.",
        "Create all the clones first, then wire the pointers in a second pass.",
        "A dict mapping original node -> clone node makes the second pass trivial."
      ],
      approach: "Two passes with an old-to-new map. The first pass creates a bare clone for every original node, so by the second pass every possible target already exists. The second pass wires `next` and `random` by looking the originals up in the map. Using `.get()` handles None cleanly, since `clones.get(None)` returns None. The O(1)-space variant interleaves clones into the original list.",
      time: "O(n)",
      space: "O(n)",
      solution: "def copy_random_list(head):\n    if not head:\n        return None\n\n    clones = {}\n    node = head\n    while node:\n        clones[node] = Node(node.val)\n        node = node.next\n\n    node = head\n    while node:\n        clones[node].next = clones.get(node.next)\n        clones[node].random = clones.get(node.random)\n        node = node.next\n\n    return clones[head]",
      tests: [
        "_check_random() == ([(7, None), (13, 7), (11, 7)], True)",
        "copy_random_list(None) is None"
      ],
      harness: "def _check_random():\n    a, b, c = Node(7), Node(13), Node(11)\n    a.next, b.next = b, c\n    b.random, c.random = a, a\n    copy = copy_random_list(a)\n\n    shape = []\n    node = copy\n    while node:\n        shape.append((node.val, node.random.val if node.random else None))\n        node = node.next\n\n    deep = copy is not a and copy.next is not b\n    return shape, deep"
    },
    {
      id: "merge-k-sorted-lists",
      title: "Merge k Sorted Lists",
      diff: "Hard",
      pattern: "Linked List",
      companies: ["Amazon", "Google", "Meta", "Uber", "LinkedIn"],
      freq: 5,
      statement: "You are given an array of `k` sorted linked lists. Merge them all into one sorted linked list and return its head.",
      examples: [
        ["lists = [[1,4,5],[1,3,4],[2,6]]", "[1,1,2,3,4,4,5,6]", ""],
        ["lists = []", "[]", ""]
      ],
      constraints: ["0 <= k <= 10^4", "Total nodes <= 10^4", "Each list is sorted ascending"],
      context: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      hints: [
        "Merging one at a time costs O(k * n) - the k-th merge re-walks everything already merged.",
        "You only ever need the smallest head among the k lists: that is a min-heap.",
        "ListNode objects are not comparable, so push a tuple with a tie-breaker index."
      ],
      approach: "Min-heap of the k current heads. Pop the smallest, append it to the result, and push its successor - the heap never holds more than k entries, so each of the n nodes costs O(log k). The tie-breaker index in the tuple matters: when two values are equal Python would otherwise try to compare ListNode objects and raise a TypeError. Divide-and-conquer pairwise merging is the equally valid alternative.",
      time: "O(n log k)",
      space: "O(k)",
      solution: "import heapq\n\n\ndef merge_k_lists(lists):\n    heap = []\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(heap, (node.val, i, node))\n\n    dummy = ListNode()\n    tail = dummy\n\n    while heap:\n        _, i, node = heapq.heappop(heap)\n        tail.next = node\n        tail = node\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n\n    tail.next = None\n    return dummy.next",
      tests: [
        "_to_list(merge_k_lists([_build_list([1,4,5]), _build_list([1,3,4]), _build_list([2,6])])) == [1,1,2,3,4,4,5,6]",
        "_to_list(merge_k_lists([])) == []",
        "_to_list(merge_k_lists([_build_list([])])) == []"
      ]
    },
    {
      id: "lru-cache",
      title: "LRU Cache",
      diff: "Medium",
      pattern: "Design",
      companies: ["Amazon", "Meta", "Google", "Microsoft", "Uber", "Salesforce"],
      freq: 5,
      statement: "Design a Least Recently Used cache with a fixed capacity. `get(key)` returns the value or -1, `put(key, value)` inserts or updates. Both operations must run in O(1) average time, and inserting past capacity evicts the least recently used key.",
      examples: [
        [
          "capacity 2; put(1,1), put(2,2), get(1), put(3,3), get(2)",
          "1, then -1",
          "Adding key 3 evicts key 2, which was least recently used."
        ]
      ],
      constraints: [
        "1 <= capacity <= 3000",
        "get and put must be O(1) average",
        "Both get and put count as a use"
      ],
      hints: [
        "You need O(1) lookup (hash map) AND O(1) reordering (doubly linked list).",
        "Python's OrderedDict is exactly that pairing, already implemented.",
        "Every get is also a use - it must move the key to the most-recent end."
      ],
      approach: "A hash map for O(1) lookup plus a recency-ordered list for O(1) eviction. `OrderedDict` bundles both: `move_to_end` marks a key as freshly used and `popitem(last=False)` drops the oldest. The subtle part is that `get` counts as a use too. If the interviewer bans OrderedDict, build it yourself with a dict of nodes and a doubly linked list with head/tail sentinels - same logic, more typing.",
      time: "O(1) per operation",
      space: "O(capacity)",
      solution: "from collections import OrderedDict\n\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)",
      tests: ["_run_lru() == [1, -1, -1, 3, 4]"],
      harness: "def _run_lru():\n    cache = LRUCache(2)\n    out = []\n    cache.put(1, 1)\n    cache.put(2, 2)\n    out.append(cache.get(1))\n    cache.put(3, 3)\n    out.append(cache.get(2))\n    cache.put(4, 4)\n    out.append(cache.get(1))\n    out.append(cache.get(3))\n    out.append(cache.get(4))\n    return out"
    },
    {
      id: "invert-binary-tree",
      title: "Invert Binary Tree",
      diff: "Easy",
      pattern: "Trees",
      companies: ["Google", "Amazon", "Microsoft", "Apple"],
      freq: 5,
      statement: "Given the root of a binary tree, invert it - swap the left and right child of every node - and return the root.",
      examples: [
        ["root = [4,2,7,1,3,6,9]", "[4,7,2,9,6,3,1]", ""],
        ["root = []", "[]", ""]
      ],
      constraints: ["0 <= nodes <= 100", "-100 <= Node.val <= 100"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Swap the two children of the current node, then recurse into both.",
        "The base case is an empty node - just return None.",
        "Python's tuple assignment lets you swap and recurse on one line."
      ],
      approach: "Recursion in three lines. Swap the children of the current node, then apply the same operation to each subtree. Python evaluates the entire right-hand side of `a, b = x, y` before assigning, so recursing on both sides inside the swap is safe. A BFS with a queue is the iterative equivalent if the tree could be deep enough to blow the stack.",
      time: "O(n)",
      space: "O(h)",
      solution: "def invert_tree(root):\n    if not root:\n        return None\n\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root",
      tests: [
        "_tree_to_list(invert_tree(_build_tree([4,2,7,1,3,6,9]))) == [4,7,2,9,6,3,1]",
        "_tree_to_list(invert_tree(_build_tree([]))) == []",
        "_tree_to_list(invert_tree(_build_tree([1, 2]))) == [1, None, 2]"
      ]
    },
    {
      id: "max-depth-binary-tree",
      title: "Maximum Depth of Binary Tree",
      diff: "Easy",
      pattern: "Trees",
      companies: ["Amazon", "Microsoft", "LinkedIn", "Google"],
      freq: 4,
      statement: "Given the root of a binary tree, return its maximum depth - the number of nodes along the longest path from the root down to a leaf.",
      examples: [
        ["root = [3,9,20,None,None,15,7]", "3", ""],
        ["root = []", "0", ""]
      ],
      constraints: ["0 <= nodes <= 10^4", "-100 <= Node.val <= 100"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "The depth of a tree is 1 + the depth of its deeper subtree.",
        "An empty tree has depth 0 - that is your base case."
      ],
      approach: "Textbook recursion. Each node's depth is one plus the maximum of its two subtree depths, and the empty tree contributes 0. This is the skeleton behind many tree problems - balanced tree checks and diameter are both this function with one extra line of bookkeeping.",
      time: "O(n)",
      space: "O(h)",
      solution: "def max_depth(root):\n    if not root:\n        return 0\n\n    return 1 + max(max_depth(root.left), max_depth(root.right))",
      tests: [
        "max_depth(_build_tree([3,9,20,None,None,15,7])) == 3",
        "max_depth(_build_tree([])) == 0",
        "max_depth(_build_tree([1, None, 2])) == 2"
      ]
    },
    {
      id: "same-tree",
      title: "Same Tree",
      diff: "Easy",
      pattern: "Trees",
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      freq: 4,
      statement: "Given the roots of two binary trees `p` and `q`, return `True` if they are structurally identical and every corresponding node holds the same value.",
      examples: [
        ["p = [1,2,3], q = [1,2,3]", "True", ""],
        ["p = [1,2], q = [1,None,2]", "False", "Same values, different structure."]
      ],
      constraints: ["0 <= nodes in each tree <= 100", "-10^4 <= Node.val <= 10^4"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Two empty trees are identical.",
        "One empty and one not means False - handle that before touching .val.",
        "Otherwise compare values and recurse on both pairs of children."
      ],
      approach: "Parallel recursion down both trees. Order the base cases carefully: both-None is True, then exactly-one-None or differing values is False, and only after those guards is it safe to compare `.val`. Then recurse left-with-left and right-with-right. This function is the building block for Subtree of Another Tree.",
      time: "O(n)",
      space: "O(h)",
      solution: "def is_same_tree(p, q):\n    if not p and not q:\n        return True\n    if not p or not q or p.val != q.val:\n        return False\n\n    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)",
      tests: [
        "is_same_tree(_build_tree([1,2,3]), _build_tree([1,2,3])) is True",
        "is_same_tree(_build_tree([1,2]), _build_tree([1,None,2])) is False",
        "is_same_tree(_build_tree([]), _build_tree([])) is True"
      ]
    },
    {
      id: "subtree-of-another-tree",
      title: "Subtree of Another Tree",
      diff: "Easy",
      pattern: "Trees",
      companies: ["Amazon", "Meta", "Microsoft", "eBay"],
      freq: 4,
      statement: "Given the roots of two binary trees `root` and `sub_root`, return `True` if there is a node in `root` whose subtree is structurally identical to `sub_root`.",
      examples: [
        ["root = [3,4,5,1,2], sub_root = [4,1,2]", "True", ""],
        [
          "root = [3,4,5,1,2,None,None,None,None,0], sub_root = [4,1,2]",
          "False",
          "The extra 0 breaks the match."
        ]
      ],
      constraints: ["1 <= nodes in root <= 2000", "1 <= nodes in sub_root <= 1000"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Reuse Same Tree as a helper - you already know how to compare two trees.",
        "At every node of root, ask: is the tree rooted here identical to sub_root?",
        "A match must be an exact subtree, not just a matching prefix of nodes."
      ],
      approach: "Two nested recursions. The outer walk visits every node of `root`; at each one, `is_same_tree` checks for an exact match against `sub_root`. Because a match must extend all the way down to the leaves, the helper's strict None handling is what rejects near-misses like an extra child. O(n * m) in the worst case; serialising both trees and doing substring search gets it to O(n + m).",
      time: "O(n * m)",
      space: "O(h)",
      solution: "def is_same_tree(p, q):\n    if not p and not q:\n        return True\n    if not p or not q or p.val != q.val:\n        return False\n    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)\n\n\ndef is_subtree(root, sub_root):\n    if not sub_root:\n        return True\n    if not root:\n        return False\n    if is_same_tree(root, sub_root):\n        return True\n\n    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)",
      tests: [
        "is_subtree(_build_tree([3,4,5,1,2]), _build_tree([4,1,2])) is True",
        "is_subtree(_build_tree([3,4,5,1,2,None,None,None,None,0]), _build_tree([4,1,2])) is False",
        "is_subtree(_build_tree([1]), _build_tree([1])) is True"
      ]
    },
    {
      id: "balanced-binary-tree",
      title: "Balanced Binary Tree",
      diff: "Easy",
      pattern: "Trees",
      companies: ["Amazon", "Google", "Meta", "Adobe"],
      freq: 4,
      statement: "Given a binary tree, determine if it is height-balanced - meaning for every node, the depths of its two subtrees differ by at most 1.",
      examples: [
        ["root = [3,9,20,None,None,15,7]", "True", ""],
        ["root = [1,2,2,3,3,None,None,4,4]", "False", ""]
      ],
      constraints: ["0 <= nodes <= 5000", "-10^4 <= Node.val <= 10^4"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Calling a depth function at every node re-walks the tree: O(n^2).",
        "Compute the height and the balanced-ness in the same pass.",
        "Use a sentinel like -1 to mean 'already unbalanced' and propagate it up."
      ],
      approach: "Bottom-up height computation with an early-exit sentinel. `height` returns the real height of a subtree, or -1 the moment it detects an imbalance anywhere below. Each caller checks for that -1 before doing any more work, so the failure short-circuits all the way to the root and the whole check stays a single O(n) traversal.",
      time: "O(n)",
      space: "O(h)",
      solution: "def is_balanced(root):\n    def height(node):\n        if not node:\n            return 0\n\n        left = height(node.left)\n        if left == -1:\n            return -1\n\n        right = height(node.right)\n        if right == -1:\n            return -1\n\n        if abs(left - right) > 1:\n            return -1\n\n        return 1 + max(left, right)\n\n    return height(root) != -1",
      tests: [
        "is_balanced(_build_tree([3,9,20,None,None,15,7])) is True",
        "is_balanced(_build_tree([1,2,2,3,3,None,None,4,4])) is False",
        "is_balanced(_build_tree([])) is True"
      ]
    },
    {
      id: "diameter-of-binary-tree",
      title: "Diameter of Binary Tree",
      diff: "Easy",
      pattern: "Trees",
      companies: ["Meta", "Amazon", "Google", "Bloomberg"],
      freq: 5,
      statement: "Given the root of a binary tree, return the length of its diameter - the number of **edges** on the longest path between any two nodes. The path does not need to pass through the root.",
      examples: [
        ["root = [1,2,3,4,5]", "3", "The path 4 -> 2 -> 1 -> 3 has 3 edges."],
        ["root = [1, 2]", "1", ""]
      ],
      constraints: ["1 <= nodes <= 10^4", "-100 <= Node.val <= 100"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "For any single node, the longest path THROUGH it is left depth + right depth.",
        "The answer is the maximum of that quantity over all nodes.",
        "You still return depth to the parent - keep the best answer in an outer variable."
      ],
      approach: "One DFS doing two jobs. The recursion returns a node's depth to its parent, but along the way it also records `left + right` - the longest path passing through that node - into a `nonlocal` best. Every possible path has a unique highest node, so checking every node covers all paths. Counting edges rather than nodes is why no `+ 1` appears in the `best` update.",
      time: "O(n)",
      space: "O(h)",
      solution: "def diameter_of_binary_tree(root):\n    best = 0\n\n    def depth(node):\n        nonlocal best\n        if not node:\n            return 0\n\n        left = depth(node.left)\n        right = depth(node.right)\n        best = max(best, left + right)\n\n        return 1 + max(left, right)\n\n    depth(root)\n    return best",
      tests: [
        "diameter_of_binary_tree(_build_tree([1,2,3,4,5])) == 3",
        "diameter_of_binary_tree(_build_tree([1, 2])) == 1",
        "diameter_of_binary_tree(_build_tree([1])) == 0"
      ]
    },
    {
      id: "level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      diff: "Medium",
      pattern: "Trees",
      companies: ["Amazon", "Microsoft", "Meta", "LinkedIn", "Bloomberg"],
      freq: 5,
      statement: "Given the root of a binary tree, return its node values grouped level by level, from left to right, top to bottom.",
      examples: [
        ["root = [3,9,20,None,None,15,7]", "[[3], [9, 20], [15, 7]]", ""],
        ["root = []", "[]", ""]
      ],
      constraints: ["0 <= nodes <= 2000", "-1000 <= Node.val <= 1000"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Breadth-first search with a queue visits nodes in exactly this order.",
        "To group by level, snapshot len(queue) before draining that level.",
        "Use collections.deque - popping from the front of a list is O(n)."
      ],
      approach: "BFS with an explicit level boundary. Capturing `len(queue)` at the start of each iteration freezes the size of the current level, so the inner loop drains exactly that many nodes while the children queued behind them form the next level. This level-snapshot pattern is the base for right side view, zigzag traversal, and level averages.",
      time: "O(n)",
      space: "O(n)",
      solution: "from collections import deque\n\n\ndef level_order(root):\n    if not root:\n        return []\n\n    result = []\n    queue = deque([root])\n\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level)\n\n    return result",
      tests: [
        "level_order(_build_tree([3,9,20,None,None,15,7])) == [[3], [9, 20], [15, 7]]",
        "level_order(_build_tree([])) == []",
        "level_order(_build_tree([1])) == [[1]]"
      ]
    },
    {
      id: "right-side-view",
      title: "Binary Tree Right Side View",
      diff: "Medium",
      pattern: "Trees",
      companies: ["Meta", "Amazon", "Microsoft", "Bloomberg"],
      freq: 4,
      statement: "Given the root of a binary tree, imagine standing on its right side. Return the values of the nodes you can see, ordered top to bottom.",
      examples: [
        ["root = [1,2,3,None,5,None,4]", "[1, 3, 4]", ""],
        ["root = [1,None,3]", "[1, 3]", ""]
      ],
      constraints: ["0 <= nodes <= 100", "-100 <= Node.val <= 100"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "What you see from the right is the LAST node of each level.",
        "Level-order traversal already groups nodes by level.",
        "Inside the level loop, append when the index equals size - 1."
      ],
      approach: "Level-order BFS, keeping only the final node of each level. The level-size snapshot makes 'last in this level' an easy index test (`i == size - 1`). Note this is not the same as always following right children - if the right subtree is shorter, a node from the left subtree becomes visible at the deeper levels.",
      time: "O(n)",
      space: "O(n)",
      solution: "from collections import deque\n\n\ndef right_side_view(root):\n    if not root:\n        return []\n\n    result = []\n    queue = deque([root])\n\n    while queue:\n        size = len(queue)\n        for i in range(size):\n            node = queue.popleft()\n            if i == size - 1:\n                result.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n\n    return result",
      tests: [
        "right_side_view(_build_tree([1,2,3,None,5,None,4])) == [1, 3, 4]",
        "right_side_view(_build_tree([1,None,3])) == [1, 3]",
        "right_side_view(_build_tree([1,2,3,4])) == [1, 3, 4]"
      ]
    },
    {
      id: "validate-bst",
      title: "Validate Binary Search Tree",
      diff: "Medium",
      pattern: "Trees",
      companies: ["Amazon", "Meta", "Microsoft", "Google", "Bloomberg"],
      freq: 5,
      statement: "Given the root of a binary tree, determine whether it is a valid binary search tree: every node in the left subtree is strictly less than the node, every node in the right subtree is strictly greater, and both subtrees are themselves valid BSTs.",
      examples: [
        ["root = [2, 1, 3]", "True", ""],
        [
          "root = [5,1,4,None,None,3,6]",
          "False",
          "4's left child 3 is smaller than the root 5 but sits in its right subtree."
        ]
      ],
      constraints: ["1 <= nodes <= 10^4", "-2^31 <= Node.val <= 2^31 - 1"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Only comparing a node against its direct children is the classic wrong answer.",
        "Every node must respect bounds inherited from all its ancestors.",
        "Pass a (low, high) range down and tighten it on each recursive call."
      ],
      approach: "Recurse with an allowed value range. The root may be anything, so it starts with (-inf, inf). Going left tightens the upper bound to the current node's value; going right tightens the lower bound. That is what catches the classic trap where a deep node satisfies its parent but violates a grandparent. An in-order traversal checking for a strictly increasing sequence is the equivalent alternative.",
      time: "O(n)",
      space: "O(h)",
      solution: "def is_valid_bst(root):\n    def valid(node, low, high):\n        if not node:\n            return True\n        if not low < node.val < high:\n            return False\n\n        return valid(node.left, low, node.val) and valid(node.right, node.val, high)\n\n    return valid(root, float('-inf'), float('inf'))",
      tests: [
        "is_valid_bst(_build_tree([2, 1, 3])) is True",
        "is_valid_bst(_build_tree([5,1,4,None,None,3,6])) is False",
        "is_valid_bst(_build_tree([5,4,6,None,None,3,7])) is False"
      ]
    },
    {
      id: "kth-smallest-bst",
      title: "Kth Smallest Element in a BST",
      diff: "Medium",
      pattern: "Trees",
      companies: ["Amazon", "Google", "Meta", "Uber"],
      freq: 4,
      statement: "Given the root of a binary search tree and an integer `k`, return the k-th smallest value (1-indexed) in the tree.",
      examples: [
        ["root = [3,1,4,None,2], k = 1", "1", ""],
        ["root = [5,3,6,2,4,None,None,1], k = 3", "3", ""]
      ],
      constraints: ["1 <= k <= number of nodes <= 10^4", "0 <= Node.val <= 10^4"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "In-order traversal of a BST visits values in sorted order.",
        "You do not need the whole traversal - stop at the k-th value.",
        "An explicit stack lets you stop early; a recursive traversal is harder to break out of."
      ],
      approach: "Iterative in-order traversal with an explicit stack. Push all the way down the left spine, then pop - each pop yields the next smallest value. Decrement `k` on every pop and return as soon as it hits zero, so the work is O(h + k) rather than a full O(n) traversal. After popping, move to the right child and repeat.",
      time: "O(h + k)",
      space: "O(h)",
      solution: "def kth_smallest(root, k):\n    stack = []\n    node = root\n\n    while stack or node:\n        while node:\n            stack.append(node)\n            node = node.left\n\n        node = stack.pop()\n        k -= 1\n        if k == 0:\n            return node.val\n\n        node = node.right\n\n    return -1",
      tests: [
        "kth_smallest(_build_tree([3,1,4,None,2]), 1) == 1",
        "kth_smallest(_build_tree([5,3,6,2,4,None,None,1]), 3) == 3",
        "kth_smallest(_build_tree([2,1,3]), 3) == 3"
      ]
    },
    {
      id: "lca-bst",
      title: "Lowest Common Ancestor of a BST",
      diff: "Medium",
      pattern: "Trees",
      companies: ["Amazon", "Meta", "Microsoft", "LinkedIn"],
      freq: 4,
      statement: "Given a binary search tree and two nodes `p` and `q` in it, find their lowest common ancestor - the deepest node that has both as descendants (a node may be a descendant of itself).",
      examples: [
        ["root = [6,2,8,0,4,7,9], p = 2, q = 8", "6", ""],
        ["root = [6,2,8,0,4,7,9], p = 2, q = 4", "2", "A node can be its own ancestor."]
      ],
      constraints: ["2 <= nodes <= 10^5", "All values are unique", "p and q both exist in the tree"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "The BST ordering tells you which way to walk - you never need to search both sides.",
        "If both targets are smaller than the current node, the answer is to the left.",
        "The first node that sits between them (or equals one of them) is the answer."
      ],
      approach: "Walk down from the root using the BST property. If both values are below the current node, the split point must be further left; if both are above, further right. The moment the values straddle the current node - or one of them equals it - you are at the deepest node that has both underneath, which is the LCA. No recursion or extra space needed.",
      time: "O(h)",
      space: "O(1)",
      solution: "def lowest_common_ancestor(root, p, q):\n    node = root\n\n    while node:\n        if p.val < node.val and q.val < node.val:\n            node = node.left\n        elif p.val > node.val and q.val > node.val:\n            node = node.right\n        else:\n            return node\n\n    return None",
      tests: [
        "_lca([6,2,8,0,4,7,9], 2, 8) == 6",
        "_lca([6,2,8,0,4,7,9], 2, 4) == 2",
        "_lca([2, 1], 2, 1) == 2"
      ],
      harness: "def _lca(values, a, b):\n    root = _build_tree(values)\n    return lowest_common_ancestor(root, _find(root, a), _find(root, b)).val"
    },
    {
      id: "construct-tree-preorder-inorder",
      title: "Construct Binary Tree from Preorder and Inorder",
      diff: "Medium",
      pattern: "Trees",
      companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
      freq: 4,
      statement: "Given `preorder` and `inorder` traversals of a binary tree with unique values, reconstruct and return the tree.",
      examples: [
        ["preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", "[3,9,20,None,None,15,7]", ""],
        ["preorder = [-1], inorder = [-1]", "[-1]", ""]
      ],
      constraints: [
        "1 <= len(preorder) <= 3000",
        "All values are unique",
        "Both arrays describe the same tree"
      ],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "The first element of preorder is always the current subtree's root.",
        "Find that value in inorder: everything to its left is the left subtree, everything right is the right subtree.",
        "Searching inorder each time is O(n^2) - precompute a value -> index map."
      ],
      approach: "Recursive divide and conquer. Preorder hands you roots in exactly the order you need them, so a single moving pointer `pre` consumes them left to right. For each root, its index in inorder splits the remaining range into left and right subtrees. Building `value -> inorder index` up front turns the split lookup into O(1), making the whole construction linear.",
      time: "O(n)",
      space: "O(n)",
      solution: "def build_tree(preorder, inorder):\n    index = {val: i for i, val in enumerate(inorder)}\n    pre = 0\n\n    def helper(left, right):\n        nonlocal pre\n        if left > right:\n            return None\n\n        root = TreeNode(preorder[pre])\n        pre += 1\n        mid = index[root.val]\n        root.left = helper(left, mid - 1)\n        root.right = helper(mid + 1, right)\n        return root\n\n    return helper(0, len(inorder) - 1)",
      tests: [
        "_tree_to_list(build_tree([3,9,20,15,7], [9,3,15,20,7])) == [3,9,20,None,None,15,7]",
        "_tree_to_list(build_tree([-1], [-1])) == [-1]",
        "_tree_to_list(build_tree([1, 2], [2, 1])) == [1, 2]"
      ]
    },
    {
      id: "binary-tree-max-path-sum",
      title: "Binary Tree Maximum Path Sum",
      diff: "Hard",
      pattern: "Trees",
      companies: ["Meta", "Amazon", "Google", "Microsoft", "DoorDash"],
      freq: 4,
      statement: "A path is any sequence of nodes connected by edges, appearing at most once each, and it need not pass through the root. Return the maximum sum of the values along any path in the tree.",
      examples: [
        ["root = [1, 2, 3]", "6", "The path 2 -> 1 -> 3."],
        [
          "root = [-10,9,20,None,None,15,7]",
          "42",
          "The path 15 -> 20 -> 7 skips the root entirely."
        ]
      ],
      constraints: ["1 <= nodes <= 3 * 10^4", "-1000 <= Node.val <= 1000"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "Distinguish two quantities: the best path THROUGH a node vs the best path you can hand UP to a parent.",
        "A parent can only use one side, so return node.val + max(left, right).",
        "A negative subtree contributes nothing - clamp it to 0 with max(gain, 0)."
      ],
      approach: "One DFS returning a 'gain' while recording a global best. The gain a node offers its parent can only descend one side, so it is `node.val + max(left, right)`. But the best path *through* the node may fork both ways, hence `node.val + left + right` feeds the answer. Clamping negative gains to 0 is what lets the algorithm simply drop unhelpful subtrees.",
      time: "O(n)",
      space: "O(h)",
      solution: "def max_path_sum(root):\n    best = float('-inf')\n\n    def gain(node):\n        nonlocal best\n        if not node:\n            return 0\n\n        left = max(gain(node.left), 0)\n        right = max(gain(node.right), 0)\n        best = max(best, node.val + left + right)\n\n        return node.val + max(left, right)\n\n    gain(root)\n    return best",
      tests: [
        "max_path_sum(_build_tree([1, 2, 3])) == 6",
        "max_path_sum(_build_tree([-10,9,20,None,None,15,7])) == 42",
        "max_path_sum(_build_tree([-3])) == -3"
      ]
    },
    {
      id: "serialize-deserialize-tree",
      title: "Serialize and Deserialize Binary Tree",
      diff: "Hard",
      pattern: "Trees",
      companies: ["Meta", "Amazon", "Google", "Microsoft", "LinkedIn"],
      freq: 4,
      statement: "Design an algorithm to serialise a binary tree to a string and deserialise that string back into the identical tree. There is no restriction on your format.",
      examples: [
        [
          "root = [1,2,3,None,None,4,5]",
          "\"1,2,#,#,3,4,#,#,5,#,#\"",
          "Round-trips back to the same tree."
        ],
        ["root = []", "\"#\"", ""]
      ],
      constraints: ["0 <= nodes <= 10^4", "-1000 <= Node.val <= 1000"],
      context: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      hints: [
        "A preorder traversal alone is ambiguous - you cannot tell where a subtree ends.",
        "Write an explicit marker for every null child and the ambiguity disappears.",
        "Deserialise with the same preorder order, consuming tokens from an iterator."
      ],
      approach: "Preorder with explicit null markers. Recording a `#` for every missing child makes the string uniquely decodable, because the reader always knows whether to descend or stop. Deserialisation mirrors the traversal exactly: pull the next token, and if it is not `#`, build a node and recursively fill its left then right. An iterator keeps the read position without any index bookkeeping.",
      time: "O(n) both ways",
      space: "O(n)",
      solution: "class Codec:\n    def serialize(self, root):\n        parts = []\n\n        def dfs(node):\n            if not node:\n                parts.append(\"#\")\n                return\n            parts.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n\n        dfs(root)\n        return \",\".join(parts)\n\n    def deserialize(self, data):\n        values = iter(data.split(\",\"))\n\n        def build():\n            value = next(values)\n            if value == \"#\":\n                return None\n            node = TreeNode(int(value))\n            node.left = build()\n            node.right = build()\n            return node\n\n        return build()",
      tests: [
        "_round_trip([1,2,3,None,None,4,5]) == [1,2,3,None,None,4,5]",
        "_round_trip([]) == []",
        "Codec().serialize(_build_tree([1, 2])) == '1,2,#,#,#'"
      ],
      harness: "def _round_trip(values):\n    codec = Codec()\n    return _tree_to_list(codec.deserialize(codec.serialize(_build_tree(values))))"
    }
  ]);
})(window.TD);
