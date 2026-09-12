# -*- coding: utf-8 -*-
"""Batch C - Linked Lists & Trees."""


def P(**kw):
    return kw


LIST_CTX = '''class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next'''

TREE_CTX = '''class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right'''

LIST_HARNESS = ""

PROBLEMS = [
P(
    id="reverse-linked-list",
    title="Reverse Linked List",
    diff="Easy",
    pattern="Linked List",
    companies=["Amazon", "Microsoft", "Meta", "Apple", "Adobe"],
    freq=5,
    statement="Given the head of a singly linked list, reverse the list and return the new head.",
    examples=[
        ("head = [1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]", ""),
        ("head = []", "[]", ""),
    ],
    constraints=["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000", "Try both iterative and recursive"],
    context=LIST_CTX,
    hints=[
        "You need three pointers: previous, current, and the saved next.",
        "Save current.next BEFORE you overwrite it, or you lose the rest of the list.",
        "The new head is the last non-null node, which is exactly `prev` when the loop ends.",
    ],
    approach="Walk the list flipping each `next` pointer to point backwards. `prev` starts as None (the old head becomes the new tail). The one thing that will break you is overwriting `current.next` before saving it - stash it in `nxt` first. When `current` falls off the end, `prev` is sitting on the final node, which is the new head.",
    time="O(n)",
    space="O(1)",
    solution='''def reverse_list(head):
    prev = None
    current = head

    while current:
        nxt = current.next
        current.next = prev
        prev = current
        current = nxt

    return prev''',
    tests=[
        "_to_list(reverse_list(_build_list([1, 2, 3, 4, 5]))) == [5, 4, 3, 2, 1]",
        "_to_list(reverse_list(_build_list([]))) == []",
        "_to_list(reverse_list(_build_list([1]))) == [1]",
    ],
),
P(
    id="merge-two-sorted-lists",
    title="Merge Two Sorted Lists",
    diff="Easy",
    pattern="Linked List",
    companies=["Amazon", "Microsoft", "Apple", "Meta"],
    freq=5,
    statement="You are given the heads of two sorted linked lists. Splice them together into one sorted list and return its head. The result should reuse the existing nodes.",
    examples=[
        ("list1 = [1, 2, 4], list2 = [1, 3, 4]", "[1, 1, 2, 3, 4, 4]", ""),
        ("list1 = [], list2 = [0]", "[0]", ""),
    ],
    constraints=["0 <= nodes in each list <= 50", "Both lists are sorted ascending"],
    hints=[
        "A dummy head node removes every 'is this the first node?' special case.",
        "Always attach the smaller of the two current nodes and advance that list.",
        "When one list runs out, attach the entire remainder of the other in one step.",
    ],
    approach="Dummy head plus a tail pointer. Compare the two front nodes, splice the smaller one onto the tail, and advance that list. Because the inputs are sorted, whichever list still has nodes when the loop exits is already sorted and larger than everything placed, so `tail.next = list1 or list2` finishes the job. Return `dummy.next` - never `dummy`.",
    time="O(n + m)",
    space="O(1)",
    solution='''def merge_two_lists(list1, list2):
    dummy = ListNode()
    tail = dummy

    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next

    tail.next = list1 or list2
    return dummy.next''',
    context=LIST_CTX,
    tests=[
        "_to_list(merge_two_lists(_build_list([1, 2, 4]), _build_list([1, 3, 4]))) == [1, 1, 2, 3, 4, 4]",
        "_to_list(merge_two_lists(_build_list([]), _build_list([0]))) == [0]",
        "_to_list(merge_two_lists(_build_list([]), _build_list([]))) == []",
    ],
),
P(
    id="linked-list-cycle",
    title="Linked List Cycle",
    diff="Easy",
    pattern="Linked List",
    companies=["Amazon", "Microsoft", "Bloomberg", "Meta"],
    freq=5,
    statement="Given the head of a linked list, determine whether it contains a cycle. Solve it using O(1) memory.",
    examples=[
        ("head = [3, 2, 0, -4], tail connects to index 1", "True", ""),
        ("head = [1, 2], no cycle", "False", ""),
    ],
    constraints=["0 <= nodes <= 10^4", "O(1) extra space"],
    context=LIST_CTX,
    hints=[
        "A visited set works but costs O(n) memory.",
        "Two runners on a circular track will eventually meet - that is Floyd's algorithm.",
        "Check `fast and fast.next` before stepping twice, or you will hit an AttributeError.",
    ],
    approach="Floyd's tortoise and hare. The slow pointer takes one step, the fast pointer two. If there is a cycle, the gap between them closes by exactly one node per iteration, so they must eventually collide. If there is no cycle, `fast` walks off the end - which is why the loop condition must test both `fast` and `fast.next` before dereferencing.",
    time="O(n)",
    space="O(1)",
    solution='''def has_cycle(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True

    return False''',
    harness='''def _cyclic(values, pos):
    head = _build_list(values)
    if head is None:
        return None
    nodes = []
    node = head
    while node:
        nodes.append(node)
        node = node.next
    if pos >= 0:
        nodes[-1].next = nodes[pos]
    return head''',
    tests=[
        "has_cycle(_cyclic([3, 2, 0, -4], 1)) is True",
        "has_cycle(_cyclic([1, 2], -1)) is False",
        "has_cycle(_cyclic([1], 0)) is True",
    ],
),
P(
    id="middle-of-linked-list",
    title="Middle of the Linked List",
    diff="Easy",
    pattern="Linked List",
    companies=["Amazon", "Microsoft", "Adobe"],
    freq=4,
    statement="Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second one.",
    examples=[
        ("head = [1, 2, 3, 4, 5]", "[3, 4, 5]", "The node with value 3."),
        ("head = [1, 2, 3, 4, 5, 6]", "[4, 5, 6]", "Two middles - return the second."),
    ],
    constraints=["1 <= nodes <= 100", "Solve it in one pass"],
    context=LIST_CTX,
    hints=[
        "Counting the length first works, but that is two passes.",
        "If one pointer moves twice as fast, where is the slow one when the fast one finishes?",
        "Starting both at head returns the second middle for even lengths, which is what is asked.",
    ],
    approach="Fast and slow pointers. The fast pointer covers two nodes per iteration, so when it reaches the end the slow pointer has covered exactly half - the middle. Starting both at `head` naturally lands on the *second* middle for even lengths. This split trick is the first step of several harder problems, including reordering a list and palindrome checks.",
    time="O(n)",
    space="O(1)",
    solution='''def middle_node(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    return slow''',
    tests=[
        "_to_list(middle_node(_build_list([1, 2, 3, 4, 5]))) == [3, 4, 5]",
        "_to_list(middle_node(_build_list([1, 2, 3, 4, 5, 6]))) == [4, 5, 6]",
        "_to_list(middle_node(_build_list([1]))) == [1]",
    ],
),
P(
    id="remove-nth-from-end",
    title="Remove Nth Node From End of List",
    diff="Medium",
    pattern="Linked List",
    companies=["Amazon", "Meta", "Microsoft", "Bloomberg"],
    freq=5,
    statement="Given the head of a linked list, remove the nth node counting from the end and return the head. Do it in one pass.",
    examples=[
        ("head = [1,2,3,4,5], n = 2", "[1, 2, 3, 5]", "The 4 is removed."),
        ("head = [1], n = 1", "[]", ""),
    ],
    constraints=["1 <= nodes <= 30", "1 <= n <= number of nodes", "One pass preferred"],
    context=LIST_CTX,
    hints=[
        "Removing a node requires a pointer to the node BEFORE it.",
        "Give one pointer an n-node head start, then move both together.",
        "A dummy node in front of the head makes deleting the head itself a non-special case.",
    ],
    approach="Two pointers separated by a fixed gap of n. Advance `fast` n steps first, then move both until `fast.next` is None - at that moment `slow` sits exactly one node before the target. The dummy node is what makes removing the head work: without it, `slow` would have nowhere to stand when the target is the first node.",
    time="O(n)",
    space="O(1)",
    solution='''def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = dummy
    fast = dummy

    for _ in range(n):
        fast = fast.next

    while fast.next:
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next
    return dummy.next''',
    tests=[
        "_to_list(remove_nth_from_end(_build_list([1, 2, 3, 4, 5]), 2)) == [1, 2, 3, 5]",
        "_to_list(remove_nth_from_end(_build_list([1]), 1)) == []",
        "_to_list(remove_nth_from_end(_build_list([1, 2]), 2)) == [2]",
    ],
),
P(
    id="reorder-list",
    title="Reorder List",
    diff="Medium",
    pattern="Linked List",
    companies=["Meta", "Amazon", "Microsoft", "Google"],
    freq=4,
    statement="Given a list `L0 -> L1 -> ... -> Ln`, reorder it to `L0 -> Ln -> L1 -> Ln-1 -> ...`. You may not modify the node values, only the links.",
    examples=[
        ("head = [1, 2, 3, 4]", "[1, 4, 2, 3]", ""),
        ("head = [1, 2, 3, 4, 5]", "[1, 5, 2, 4, 3]", ""),
    ],
    constraints=["1 <= nodes <= 5 * 10^4", "Rearrange links only, do not swap values"],
    context=LIST_CTX,
    hints=[
        "You need the nodes from the back, but a singly linked list only goes forward.",
        "Three known sub-problems stacked: find the middle, reverse the second half, merge alternately.",
        "Cut the first half loose with slow.next = None or you will build a cycle.",
    ],
    approach="Three classic steps in sequence. Find the middle with fast/slow pointers, reverse the second half in place, then weave the two halves together one node at a time. Setting `slow.next = None` to sever the halves is essential - skip it and the merge creates a cycle. Starting `fast` at `head.next` makes the split favour the first half, which is what the alternating merge expects.",
    time="O(n)",
    space="O(1)",
    solution='''def reorder_list(head):
    if not head or not head.next:
        return head

    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    second = slow.next
    slow.next = None

    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev = second
        second = nxt

    first, second = head, prev
    while second:
        n1, n2 = first.next, second.next
        first.next = second
        second.next = n1
        first, second = n1, n2

    return head''',
    tests=[
        "_to_list(reorder_list(_build_list([1, 2, 3, 4]))) == [1, 4, 2, 3]",
        "_to_list(reorder_list(_build_list([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]",
        "_to_list(reorder_list(_build_list([1, 2]))) == [1, 2]",
    ],
),
P(
    id="palindrome-linked-list",
    title="Palindrome Linked List",
    diff="Easy",
    pattern="Linked List",
    companies=["Amazon", "Meta", "Microsoft", "Adobe"],
    freq=4,
    statement="Given the head of a singly linked list, return `True` if the sequence of values reads the same forwards and backwards. Aim for O(n) time and O(1) space.",
    examples=[
        ("head = [1, 2, 2, 1]", "True", ""),
        ("head = [1, 2]", "False", ""),
    ],
    constraints=["1 <= nodes <= 10^5", "O(1) space for full credit"],
    context=LIST_CTX,
    hints=[
        "Copying the values into a list and comparing to its reverse is O(n) space - the easy answer.",
        "For O(1): find the middle, reverse the second half, then walk both halves in step.",
        "Stop the comparison when the reversed half runs out - it may be one node shorter.",
    ],
    approach="Find the midpoint with fast/slow pointers, reverse from the midpoint onward, then compare the front half against the reversed back half. The loop is driven by the reversed half, which is never longer than the front, so an odd middle node is skipped harmlessly. In production you would restore the list afterwards - mention that, interviewers like hearing it.",
    time="O(n)",
    space="O(1)",
    solution='''def is_palindrome_list(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    prev = None
    while slow:
        nxt = slow.next
        slow.next = prev
        prev = slow
        slow = nxt

    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next

    return True''',
    tests=[
        "is_palindrome_list(_build_list([1, 2, 2, 1])) is True",
        "is_palindrome_list(_build_list([1, 2])) is False",
        "is_palindrome_list(_build_list([1, 2, 3, 2, 1])) is True",
    ],
),
P(
    id="add-two-numbers",
    title="Add Two Numbers",
    diff="Medium",
    pattern="Linked List",
    companies=["Amazon", "Microsoft", "Meta", "Bloomberg", "Adobe"],
    freq=5,
    statement="You are given two non-empty linked lists representing two non-negative integers, with the digits stored in **reverse order**. Add the numbers and return the sum as a linked list in the same format.",
    examples=[
        ("l1 = [2,4,3], l2 = [5,6,4]", "[7, 0, 8]", "342 + 465 = 807."),
        ("l1 = [9,9,9], l2 = [1]", "[0, 0, 0, 1]", "999 + 1 = 1000."),
    ],
    constraints=["1 <= nodes in each list <= 100", "0 <= Node.val <= 9", "No leading zeros except the number 0"],
    context=LIST_CTX,
    hints=[
        "Reverse order is a gift - you meet the ones digit first, exactly like hand addition.",
        "One loop condition covers everything: `while l1 or l2 or carry`.",
        "divmod(total, 10) gives you the carry and the digit in one step.",
    ],
    approach="Simulate long addition with a carry. The loop continues while either list has digits *or* a carry is pending - that final `carry` clause is what produces the extra leading 1 in cases like 999 + 1. A dummy head keeps the append logic uniform, and `divmod` splits the running total into the new carry and the digit to store.",
    time="O(max(n, m))",
    space="O(max(n, m))",
    solution='''def add_two_numbers(l1, l2):
    dummy = ListNode()
    current = dummy
    carry = 0

    while l1 or l2 or carry:
        total = carry
        if l1:
            total += l1.val
            l1 = l1.next
        if l2:
            total += l2.val
            l2 = l2.next

        carry, digit = divmod(total, 10)
        current.next = ListNode(digit)
        current = current.next

    return dummy.next''',
    tests=[
        "_to_list(add_two_numbers(_build_list([2, 4, 3]), _build_list([5, 6, 4]))) == [7, 0, 8]",
        "_to_list(add_two_numbers(_build_list([9, 9, 9]), _build_list([1]))) == [0, 0, 0, 1]",
        "_to_list(add_two_numbers(_build_list([0]), _build_list([0]))) == [0]",
    ],
),
P(
    id="copy-list-random-pointer",
    title="Copy List with Random Pointer",
    diff="Medium",
    pattern="Linked List",
    companies=["Amazon", "Meta", "Microsoft", "Bloomberg"],
    freq=4,
    statement="A linked list where each node has a `next` pointer and a `random` pointer (which may point anywhere in the list or be None). Return a **deep copy** of the list - entirely new nodes with the same structure.",
    examples=[
        ("head = [[7,None],[13,0],[11,0]]", "[[7,None],[13,0],[11,0]]", "Each pair is [value, index the random points to]."),
        ("head = []", "[]", ""),
    ],
    constraints=["0 <= nodes <= 1000", "random may be None or any node in the list"],
    context='''class Node:
    def __init__(self, val, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random''',
    hints=[
        "The problem is that a random pointer may target a node you have not created yet.",
        "Create all the clones first, then wire the pointers in a second pass.",
        "A dict mapping original node -> clone node makes the second pass trivial.",
    ],
    approach="Two passes with an old-to-new map. The first pass creates a bare clone for every original node, so by the second pass every possible target already exists. The second pass wires `next` and `random` by looking the originals up in the map. Using `.get()` handles None cleanly, since `clones.get(None)` returns None. The O(1)-space variant interleaves clones into the original list.",
    time="O(n)",
    space="O(n)",
    solution='''def copy_random_list(head):
    if not head:
        return None

    clones = {}
    node = head
    while node:
        clones[node] = Node(node.val)
        node = node.next

    node = head
    while node:
        clones[node].next = clones.get(node.next)
        clones[node].random = clones.get(node.random)
        node = node.next

    return clones[head]''',
    harness='''def _check_random():
    a, b, c = Node(7), Node(13), Node(11)
    a.next, b.next = b, c
    b.random, c.random = a, a
    copy = copy_random_list(a)

    shape = []
    node = copy
    while node:
        shape.append((node.val, node.random.val if node.random else None))
        node = node.next

    deep = copy is not a and copy.next is not b
    return shape, deep''',
    tests=[
        "_check_random() == ([(7, None), (13, 7), (11, 7)], True)",
        "copy_random_list(None) is None",
    ],
),
P(
    id="merge-k-sorted-lists",
    title="Merge k Sorted Lists",
    diff="Hard",
    pattern="Linked List",
    companies=["Amazon", "Google", "Meta", "Uber", "LinkedIn"],
    freq=5,
    statement="You are given an array of `k` sorted linked lists. Merge them all into one sorted linked list and return its head.",
    examples=[
        ("lists = [[1,4,5],[1,3,4],[2,6]]", "[1,1,2,3,4,4,5,6]", ""),
        ("lists = []", "[]", ""),
    ],
    constraints=["0 <= k <= 10^4", "Total nodes <= 10^4", "Each list is sorted ascending"],
    context=LIST_CTX,
    hints=[
        "Merging one at a time costs O(k * n) - the k-th merge re-walks everything already merged.",
        "You only ever need the smallest head among the k lists: that is a min-heap.",
        "ListNode objects are not comparable, so push a tuple with a tie-breaker index.",
    ],
    approach="Min-heap of the k current heads. Pop the smallest, append it to the result, and push its successor - the heap never holds more than k entries, so each of the n nodes costs O(log k). The tie-breaker index in the tuple matters: when two values are equal Python would otherwise try to compare ListNode objects and raise a TypeError. Divide-and-conquer pairwise merging is the equally valid alternative.",
    time="O(n log k)",
    space="O(k)",
    solution='''import heapq


def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode()
    tail = dummy

    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    tail.next = None
    return dummy.next''',
    tests=[
        "_to_list(merge_k_lists([_build_list([1,4,5]), _build_list([1,3,4]), _build_list([2,6])])) == [1,1,2,3,4,4,5,6]",
        "_to_list(merge_k_lists([])) == []",
        "_to_list(merge_k_lists([_build_list([])])) == []",
    ],
),
P(
    id="lru-cache",
    title="LRU Cache",
    diff="Medium",
    pattern="Design",
    companies=["Amazon", "Meta", "Google", "Microsoft", "Uber", "Salesforce"],
    freq=5,
    statement="Design a Least Recently Used cache with a fixed capacity. `get(key)` returns the value or -1, `put(key, value)` inserts or updates. Both operations must run in O(1) average time, and inserting past capacity evicts the least recently used key.",
    examples=[
        ("capacity 2; put(1,1), put(2,2), get(1), put(3,3), get(2)", "1, then -1", "Adding key 3 evicts key 2, which was least recently used."),
    ],
    constraints=["1 <= capacity <= 3000", "get and put must be O(1) average", "Both get and put count as a use"],
    hints=[
        "You need O(1) lookup (hash map) AND O(1) reordering (doubly linked list).",
        "Python's OrderedDict is exactly that pairing, already implemented.",
        "Every get is also a use - it must move the key to the most-recent end.",
    ],
    approach="A hash map for O(1) lookup plus a recency-ordered list for O(1) eviction. `OrderedDict` bundles both: `move_to_end` marks a key as freshly used and `popitem(last=False)` drops the oldest. The subtle part is that `get` counts as a use too. If the interviewer bans OrderedDict, build it yourself with a dict of nodes and a doubly linked list with head/tail sentinels - same logic, more typing.",
    time="O(1) per operation",
    space="O(capacity)",
    solution='''from collections import OrderedDict


class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)''',
    harness='''def _run_lru():
    cache = LRUCache(2)
    out = []
    cache.put(1, 1)
    cache.put(2, 2)
    out.append(cache.get(1))
    cache.put(3, 3)
    out.append(cache.get(2))
    cache.put(4, 4)
    out.append(cache.get(1))
    out.append(cache.get(3))
    out.append(cache.get(4))
    return out''',
    tests=[
        "_run_lru() == [1, -1, -1, 3, 4]",
    ],
),
P(
    id="invert-binary-tree",
    title="Invert Binary Tree",
    diff="Easy",
    pattern="Trees",
    companies=["Google", "Amazon", "Microsoft", "Apple"],
    freq=5,
    statement="Given the root of a binary tree, invert it - swap the left and right child of every node - and return the root.",
    examples=[
        ("root = [4,2,7,1,3,6,9]", "[4,7,2,9,6,3,1]", ""),
        ("root = []", "[]", ""),
    ],
    constraints=["0 <= nodes <= 100", "-100 <= Node.val <= 100"],
    context=TREE_CTX,
    hints=[
        "Swap the two children of the current node, then recurse into both.",
        "The base case is an empty node - just return None.",
        "Python's tuple assignment lets you swap and recurse on one line.",
    ],
    approach="Recursion in three lines. Swap the children of the current node, then apply the same operation to each subtree. Python evaluates the entire right-hand side of `a, b = x, y` before assigning, so recursing on both sides inside the swap is safe. A BFS with a queue is the iterative equivalent if the tree could be deep enough to blow the stack.",
    time="O(n)",
    space="O(h)",
    solution='''def invert_tree(root):
    if not root:
        return None

    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root''',
    tests=[
        "_tree_to_list(invert_tree(_build_tree([4,2,7,1,3,6,9]))) == [4,7,2,9,6,3,1]",
        "_tree_to_list(invert_tree(_build_tree([]))) == []",
        "_tree_to_list(invert_tree(_build_tree([1, 2]))) == [1, None, 2]",
    ],
),
P(
    id="max-depth-binary-tree",
    title="Maximum Depth of Binary Tree",
    diff="Easy",
    pattern="Trees",
    companies=["Amazon", "Microsoft", "LinkedIn", "Google"],
    freq=4,
    statement="Given the root of a binary tree, return its maximum depth - the number of nodes along the longest path from the root down to a leaf.",
    examples=[
        ("root = [3,9,20,None,None,15,7]", "3", ""),
        ("root = []", "0", ""),
    ],
    constraints=["0 <= nodes <= 10^4", "-100 <= Node.val <= 100"],
    context=TREE_CTX,
    hints=[
        "The depth of a tree is 1 + the depth of its deeper subtree.",
        "An empty tree has depth 0 - that is your base case.",
    ],
    approach="Textbook recursion. Each node's depth is one plus the maximum of its two subtree depths, and the empty tree contributes 0. This is the skeleton behind many tree problems - balanced tree checks and diameter are both this function with one extra line of bookkeeping.",
    time="O(n)",
    space="O(h)",
    solution='''def max_depth(root):
    if not root:
        return 0

    return 1 + max(max_depth(root.left), max_depth(root.right))''',
    tests=[
        "max_depth(_build_tree([3,9,20,None,None,15,7])) == 3",
        "max_depth(_build_tree([])) == 0",
        "max_depth(_build_tree([1, None, 2])) == 2",
    ],
),
P(
    id="same-tree",
    title="Same Tree",
    diff="Easy",
    pattern="Trees",
    companies=["Amazon", "Google", "Meta", "Microsoft"],
    freq=4,
    statement="Given the roots of two binary trees `p` and `q`, return `True` if they are structurally identical and every corresponding node holds the same value.",
    examples=[
        ("p = [1,2,3], q = [1,2,3]", "True", ""),
        ("p = [1,2], q = [1,None,2]", "False", "Same values, different structure."),
    ],
    constraints=["0 <= nodes in each tree <= 100", "-10^4 <= Node.val <= 10^4"],
    context=TREE_CTX,
    hints=[
        "Two empty trees are identical.",
        "One empty and one not means False - handle that before touching .val.",
        "Otherwise compare values and recurse on both pairs of children.",
    ],
    approach="Parallel recursion down both trees. Order the base cases carefully: both-None is True, then exactly-one-None or differing values is False, and only after those guards is it safe to compare `.val`. Then recurse left-with-left and right-with-right. This function is the building block for Subtree of Another Tree.",
    time="O(n)",
    space="O(h)",
    solution='''def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False

    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)''',
    tests=[
        "is_same_tree(_build_tree([1,2,3]), _build_tree([1,2,3])) is True",
        "is_same_tree(_build_tree([1,2]), _build_tree([1,None,2])) is False",
        "is_same_tree(_build_tree([]), _build_tree([])) is True",
    ],
),
P(
    id="subtree-of-another-tree",
    title="Subtree of Another Tree",
    diff="Easy",
    pattern="Trees",
    companies=["Amazon", "Meta", "Microsoft", "eBay"],
    freq=4,
    statement="Given the roots of two binary trees `root` and `sub_root`, return `True` if there is a node in `root` whose subtree is structurally identical to `sub_root`.",
    examples=[
        ("root = [3,4,5,1,2], sub_root = [4,1,2]", "True", ""),
        ("root = [3,4,5,1,2,None,None,None,None,0], sub_root = [4,1,2]", "False", "The extra 0 breaks the match."),
    ],
    constraints=["1 <= nodes in root <= 2000", "1 <= nodes in sub_root <= 1000"],
    context=TREE_CTX,
    hints=[
        "Reuse Same Tree as a helper - you already know how to compare two trees.",
        "At every node of root, ask: is the tree rooted here identical to sub_root?",
        "A match must be an exact subtree, not just a matching prefix of nodes.",
    ],
    approach="Two nested recursions. The outer walk visits every node of `root`; at each one, `is_same_tree` checks for an exact match against `sub_root`. Because a match must extend all the way down to the leaves, the helper's strict None handling is what rejects near-misses like an extra child. O(n * m) in the worst case; serialising both trees and doing substring search gets it to O(n + m).",
    time="O(n * m)",
    space="O(h)",
    solution='''def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)


def is_subtree(root, sub_root):
    if not sub_root:
        return True
    if not root:
        return False
    if is_same_tree(root, sub_root):
        return True

    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)''',
    tests=[
        "is_subtree(_build_tree([3,4,5,1,2]), _build_tree([4,1,2])) is True",
        "is_subtree(_build_tree([3,4,5,1,2,None,None,None,None,0]), _build_tree([4,1,2])) is False",
        "is_subtree(_build_tree([1]), _build_tree([1])) is True",
    ],
),
P(
    id="balanced-binary-tree",
    title="Balanced Binary Tree",
    diff="Easy",
    pattern="Trees",
    companies=["Amazon", "Google", "Meta", "Adobe"],
    freq=4,
    statement="Given a binary tree, determine if it is height-balanced - meaning for every node, the depths of its two subtrees differ by at most 1.",
    examples=[
        ("root = [3,9,20,None,None,15,7]", "True", ""),
        ("root = [1,2,2,3,3,None,None,4,4]", "False", ""),
    ],
    constraints=["0 <= nodes <= 5000", "-10^4 <= Node.val <= 10^4"],
    context=TREE_CTX,
    hints=[
        "Calling a depth function at every node re-walks the tree: O(n^2).",
        "Compute the height and the balanced-ness in the same pass.",
        "Use a sentinel like -1 to mean 'already unbalanced' and propagate it up.",
    ],
    approach="Bottom-up height computation with an early-exit sentinel. `height` returns the real height of a subtree, or -1 the moment it detects an imbalance anywhere below. Each caller checks for that -1 before doing any more work, so the failure short-circuits all the way to the root and the whole check stays a single O(n) traversal.",
    time="O(n)",
    space="O(h)",
    solution='''def is_balanced(root):
    def height(node):
        if not node:
            return 0

        left = height(node.left)
        if left == -1:
            return -1

        right = height(node.right)
        if right == -1:
            return -1

        if abs(left - right) > 1:
            return -1

        return 1 + max(left, right)

    return height(root) != -1''',
    tests=[
        "is_balanced(_build_tree([3,9,20,None,None,15,7])) is True",
        "is_balanced(_build_tree([1,2,2,3,3,None,None,4,4])) is False",
        "is_balanced(_build_tree([])) is True",
    ],
),
P(
    id="diameter-of-binary-tree",
    title="Diameter of Binary Tree",
    diff="Easy",
    pattern="Trees",
    companies=["Meta", "Amazon", "Google", "Bloomberg"],
    freq=5,
    statement="Given the root of a binary tree, return the length of its diameter - the number of **edges** on the longest path between any two nodes. The path does not need to pass through the root.",
    examples=[
        ("root = [1,2,3,4,5]", "3", "The path 4 -> 2 -> 1 -> 3 has 3 edges."),
        ("root = [1, 2]", "1", ""),
    ],
    constraints=["1 <= nodes <= 10^4", "-100 <= Node.val <= 100"],
    context=TREE_CTX,
    hints=[
        "For any single node, the longest path THROUGH it is left depth + right depth.",
        "The answer is the maximum of that quantity over all nodes.",
        "You still return depth to the parent - keep the best answer in an outer variable.",
    ],
    approach="One DFS doing two jobs. The recursion returns a node's depth to its parent, but along the way it also records `left + right` - the longest path passing through that node - into a `nonlocal` best. Every possible path has a unique highest node, so checking every node covers all paths. Counting edges rather than nodes is why no `+ 1` appears in the `best` update.",
    time="O(n)",
    space="O(h)",
    solution='''def diameter_of_binary_tree(root):
    best = 0

    def depth(node):
        nonlocal best
        if not node:
            return 0

        left = depth(node.left)
        right = depth(node.right)
        best = max(best, left + right)

        return 1 + max(left, right)

    depth(root)
    return best''',
    tests=[
        "diameter_of_binary_tree(_build_tree([1,2,3,4,5])) == 3",
        "diameter_of_binary_tree(_build_tree([1, 2])) == 1",
        "diameter_of_binary_tree(_build_tree([1])) == 0",
    ],
),
P(
    id="level-order-traversal",
    title="Binary Tree Level Order Traversal",
    diff="Medium",
    pattern="Trees",
    companies=["Amazon", "Microsoft", "Meta", "LinkedIn", "Bloomberg"],
    freq=5,
    statement="Given the root of a binary tree, return its node values grouped level by level, from left to right, top to bottom.",
    examples=[
        ("root = [3,9,20,None,None,15,7]", "[[3], [9, 20], [15, 7]]", ""),
        ("root = []", "[]", ""),
    ],
    constraints=["0 <= nodes <= 2000", "-1000 <= Node.val <= 1000"],
    context=TREE_CTX,
    hints=[
        "Breadth-first search with a queue visits nodes in exactly this order.",
        "To group by level, snapshot len(queue) before draining that level.",
        "Use collections.deque - popping from the front of a list is O(n).",
    ],
    approach="BFS with an explicit level boundary. Capturing `len(queue)` at the start of each iteration freezes the size of the current level, so the inner loop drains exactly that many nodes while the children queued behind them form the next level. This level-snapshot pattern is the base for right side view, zigzag traversal, and level averages.",
    time="O(n)",
    space="O(n)",
    solution='''from collections import deque


def level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)

    return result''',
    tests=[
        "level_order(_build_tree([3,9,20,None,None,15,7])) == [[3], [9, 20], [15, 7]]",
        "level_order(_build_tree([])) == []",
        "level_order(_build_tree([1])) == [[1]]",
    ],
),
P(
    id="right-side-view",
    title="Binary Tree Right Side View",
    diff="Medium",
    pattern="Trees",
    companies=["Meta", "Amazon", "Microsoft", "Bloomberg"],
    freq=4,
    statement="Given the root of a binary tree, imagine standing on its right side. Return the values of the nodes you can see, ordered top to bottom.",
    examples=[
        ("root = [1,2,3,None,5,None,4]", "[1, 3, 4]", ""),
        ("root = [1,None,3]", "[1, 3]", ""),
    ],
    constraints=["0 <= nodes <= 100", "-100 <= Node.val <= 100"],
    context=TREE_CTX,
    hints=[
        "What you see from the right is the LAST node of each level.",
        "Level-order traversal already groups nodes by level.",
        "Inside the level loop, append when the index equals size - 1.",
    ],
    approach="Level-order BFS, keeping only the final node of each level. The level-size snapshot makes 'last in this level' an easy index test (`i == size - 1`). Note this is not the same as always following right children - if the right subtree is shorter, a node from the left subtree becomes visible at the deeper levels.",
    time="O(n)",
    space="O(n)",
    solution='''from collections import deque


def right_side_view(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        size = len(queue)
        for i in range(size):
            node = queue.popleft()
            if i == size - 1:
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

    return result''',
    tests=[
        "right_side_view(_build_tree([1,2,3,None,5,None,4])) == [1, 3, 4]",
        "right_side_view(_build_tree([1,None,3])) == [1, 3]",
        "right_side_view(_build_tree([1,2,3,4])) == [1, 3, 4]",
    ],
),
P(
    id="validate-bst",
    title="Validate Binary Search Tree",
    diff="Medium",
    pattern="Trees",
    companies=["Amazon", "Meta", "Microsoft", "Google", "Bloomberg"],
    freq=5,
    statement="Given the root of a binary tree, determine whether it is a valid binary search tree: every node in the left subtree is strictly less than the node, every node in the right subtree is strictly greater, and both subtrees are themselves valid BSTs.",
    examples=[
        ("root = [2, 1, 3]", "True", ""),
        ("root = [5,1,4,None,None,3,6]", "False", "4's left child 3 is smaller than the root 5 but sits in its right subtree."),
    ],
    constraints=["1 <= nodes <= 10^4", "-2^31 <= Node.val <= 2^31 - 1"],
    context=TREE_CTX,
    hints=[
        "Only comparing a node against its direct children is the classic wrong answer.",
        "Every node must respect bounds inherited from all its ancestors.",
        "Pass a (low, high) range down and tighten it on each recursive call.",
    ],
    approach="Recurse with an allowed value range. The root may be anything, so it starts with (-inf, inf). Going left tightens the upper bound to the current node's value; going right tightens the lower bound. That is what catches the classic trap where a deep node satisfies its parent but violates a grandparent. An in-order traversal checking for a strictly increasing sequence is the equivalent alternative.",
    time="O(n)",
    space="O(h)",
    solution='''def is_valid_bst(root):
    def valid(node, low, high):
        if not node:
            return True
        if not low < node.val < high:
            return False

        return valid(node.left, low, node.val) and valid(node.right, node.val, high)

    return valid(root, float('-inf'), float('inf'))''',
    tests=[
        "is_valid_bst(_build_tree([2, 1, 3])) is True",
        "is_valid_bst(_build_tree([5,1,4,None,None,3,6])) is False",
        "is_valid_bst(_build_tree([5,4,6,None,None,3,7])) is False",
    ],
),
P(
    id="kth-smallest-bst",
    title="Kth Smallest Element in a BST",
    diff="Medium",
    pattern="Trees",
    companies=["Amazon", "Google", "Meta", "Uber"],
    freq=4,
    statement="Given the root of a binary search tree and an integer `k`, return the k-th smallest value (1-indexed) in the tree.",
    examples=[
        ("root = [3,1,4,None,2], k = 1", "1", ""),
        ("root = [5,3,6,2,4,None,None,1], k = 3", "3", ""),
    ],
    constraints=["1 <= k <= number of nodes <= 10^4", "0 <= Node.val <= 10^4"],
    context=TREE_CTX,
    hints=[
        "In-order traversal of a BST visits values in sorted order.",
        "You do not need the whole traversal - stop at the k-th value.",
        "An explicit stack lets you stop early; a recursive traversal is harder to break out of.",
    ],
    approach="Iterative in-order traversal with an explicit stack. Push all the way down the left spine, then pop - each pop yields the next smallest value. Decrement `k` on every pop and return as soon as it hits zero, so the work is O(h + k) rather than a full O(n) traversal. After popping, move to the right child and repeat.",
    time="O(h + k)",
    space="O(h)",
    solution='''def kth_smallest(root, k):
    stack = []
    node = root

    while stack or node:
        while node:
            stack.append(node)
            node = node.left

        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val

        node = node.right

    return -1''',
    tests=[
        "kth_smallest(_build_tree([3,1,4,None,2]), 1) == 1",
        "kth_smallest(_build_tree([5,3,6,2,4,None,None,1]), 3) == 3",
        "kth_smallest(_build_tree([2,1,3]), 3) == 3",
    ],
),
P(
    id="lca-bst",
    title="Lowest Common Ancestor of a BST",
    diff="Medium",
    pattern="Trees",
    companies=["Amazon", "Meta", "Microsoft", "LinkedIn"],
    freq=4,
    statement="Given a binary search tree and two nodes `p` and `q` in it, find their lowest common ancestor - the deepest node that has both as descendants (a node may be a descendant of itself).",
    examples=[
        ("root = [6,2,8,0,4,7,9], p = 2, q = 8", "6", ""),
        ("root = [6,2,8,0,4,7,9], p = 2, q = 4", "2", "A node can be its own ancestor."),
    ],
    constraints=["2 <= nodes <= 10^5", "All values are unique", "p and q both exist in the tree"],
    context=TREE_CTX,
    hints=[
        "The BST ordering tells you which way to walk - you never need to search both sides.",
        "If both targets are smaller than the current node, the answer is to the left.",
        "The first node that sits between them (or equals one of them) is the answer.",
    ],
    approach="Walk down from the root using the BST property. If both values are below the current node, the split point must be further left; if both are above, further right. The moment the values straddle the current node - or one of them equals it - you are at the deepest node that has both underneath, which is the LCA. No recursion or extra space needed.",
    time="O(h)",
    space="O(1)",
    solution='''def lowest_common_ancestor(root, p, q):
    node = root

    while node:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node

    return None''',
    harness='''def _lca(values, a, b):
    root = _build_tree(values)
    return lowest_common_ancestor(root, _find(root, a), _find(root, b)).val''',
    tests=[
        "_lca([6,2,8,0,4,7,9], 2, 8) == 6",
        "_lca([6,2,8,0,4,7,9], 2, 4) == 2",
        "_lca([2, 1], 2, 1) == 2",
    ],
),
P(
    id="construct-tree-preorder-inorder",
    title="Construct Binary Tree from Preorder and Inorder",
    diff="Medium",
    pattern="Trees",
    companies=["Amazon", "Microsoft", "Meta", "Bloomberg"],
    freq=4,
    statement="Given `preorder` and `inorder` traversals of a binary tree with unique values, reconstruct and return the tree.",
    examples=[
        ("preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", "[3,9,20,None,None,15,7]", ""),
        ("preorder = [-1], inorder = [-1]", "[-1]", ""),
    ],
    constraints=["1 <= len(preorder) <= 3000", "All values are unique", "Both arrays describe the same tree"],
    context=TREE_CTX,
    hints=[
        "The first element of preorder is always the current subtree's root.",
        "Find that value in inorder: everything to its left is the left subtree, everything right is the right subtree.",
        "Searching inorder each time is O(n^2) - precompute a value -> index map.",
    ],
    approach="Recursive divide and conquer. Preorder hands you roots in exactly the order you need them, so a single moving pointer `pre` consumes them left to right. For each root, its index in inorder splits the remaining range into left and right subtrees. Building `value -> inorder index` up front turns the split lookup into O(1), making the whole construction linear.",
    time="O(n)",
    space="O(n)",
    solution='''def build_tree(preorder, inorder):
    index = {val: i for i, val in enumerate(inorder)}
    pre = 0

    def helper(left, right):
        nonlocal pre
        if left > right:
            return None

        root = TreeNode(preorder[pre])
        pre += 1
        mid = index[root.val]
        root.left = helper(left, mid - 1)
        root.right = helper(mid + 1, right)
        return root

    return helper(0, len(inorder) - 1)''',
    tests=[
        "_tree_to_list(build_tree([3,9,20,15,7], [9,3,15,20,7])) == [3,9,20,None,None,15,7]",
        "_tree_to_list(build_tree([-1], [-1])) == [-1]",
        "_tree_to_list(build_tree([1, 2], [2, 1])) == [1, 2]",
    ],
),
P(
    id="binary-tree-max-path-sum",
    title="Binary Tree Maximum Path Sum",
    diff="Hard",
    pattern="Trees",
    companies=["Meta", "Amazon", "Google", "Microsoft", "DoorDash"],
    freq=4,
    statement="A path is any sequence of nodes connected by edges, appearing at most once each, and it need not pass through the root. Return the maximum sum of the values along any path in the tree.",
    examples=[
        ("root = [1, 2, 3]", "6", "The path 2 -> 1 -> 3."),
        ("root = [-10,9,20,None,None,15,7]", "42", "The path 15 -> 20 -> 7 skips the root entirely."),
    ],
    constraints=["1 <= nodes <= 3 * 10^4", "-1000 <= Node.val <= 1000"],
    context=TREE_CTX,
    hints=[
        "Distinguish two quantities: the best path THROUGH a node vs the best path you can hand UP to a parent.",
        "A parent can only use one side, so return node.val + max(left, right).",
        "A negative subtree contributes nothing - clamp it to 0 with max(gain, 0).",
    ],
    approach="One DFS returning a 'gain' while recording a global best. The gain a node offers its parent can only descend one side, so it is `node.val + max(left, right)`. But the best path *through* the node may fork both ways, hence `node.val + left + right` feeds the answer. Clamping negative gains to 0 is what lets the algorithm simply drop unhelpful subtrees.",
    time="O(n)",
    space="O(h)",
    solution='''def max_path_sum(root):
    best = float('-inf')

    def gain(node):
        nonlocal best
        if not node:
            return 0

        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)
        best = max(best, node.val + left + right)

        return node.val + max(left, right)

    gain(root)
    return best''',
    tests=[
        "max_path_sum(_build_tree([1, 2, 3])) == 6",
        "max_path_sum(_build_tree([-10,9,20,None,None,15,7])) == 42",
        "max_path_sum(_build_tree([-3])) == -3",
    ],
),
P(
    id="serialize-deserialize-tree",
    title="Serialize and Deserialize Binary Tree",
    diff="Hard",
    pattern="Trees",
    companies=["Meta", "Amazon", "Google", "Microsoft", "LinkedIn"],
    freq=4,
    statement="Design an algorithm to serialise a binary tree to a string and deserialise that string back into the identical tree. There is no restriction on your format.",
    examples=[
        ("root = [1,2,3,None,None,4,5]", '"1,2,#,#,3,4,#,#,5,#,#"', "Round-trips back to the same tree."),
        ("root = []", '"#"', ""),
    ],
    constraints=["0 <= nodes <= 10^4", "-1000 <= Node.val <= 1000"],
    context=TREE_CTX,
    hints=[
        "A preorder traversal alone is ambiguous - you cannot tell where a subtree ends.",
        "Write an explicit marker for every null child and the ambiguity disappears.",
        "Deserialise with the same preorder order, consuming tokens from an iterator.",
    ],
    approach="Preorder with explicit null markers. Recording a `#` for every missing child makes the string uniquely decodable, because the reader always knows whether to descend or stop. Deserialisation mirrors the traversal exactly: pull the next token, and if it is not `#`, build a node and recursively fill its left then right. An iterator keeps the read position without any index bookkeeping.",
    time="O(n) both ways",
    space="O(n)",
    solution='''class Codec:
    def serialize(self, root):
        parts = []

        def dfs(node):
            if not node:
                parts.append("#")
                return
            parts.append(str(node.val))
            dfs(node.left)
            dfs(node.right)

        dfs(root)
        return ",".join(parts)

    def deserialize(self, data):
        values = iter(data.split(","))

        def build():
            value = next(values)
            if value == "#":
                return None
            node = TreeNode(int(value))
            node.left = build()
            node.right = build()
            return node

        return build()''',
    harness='''def _round_trip(values):
    codec = Codec()
    return _tree_to_list(codec.deserialize(codec.serialize(_build_tree(values))))''',
    tests=[
        "_round_trip([1,2,3,None,None,4,5]) == [1,2,3,None,None,4,5]",
        "_round_trip([]) == []",
        "Codec().serialize(_build_tree([1, 2])) == '1,2,#,#,#'",
    ],
),
]
