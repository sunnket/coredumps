/* DSA for Interviews — the complexity material beyond counting loops.

   The first complexity lesson teaches reading loops and naming a growth rate.
   These two go where interviews actually push: recurrences, amortised cost,
   and the difference between the worst case and the case you will be asked
   about. */
TD.addLessons("dsa", [

{
 t: "Recurrences — Costing a Function That Calls Itself",
 m: "complexity",
 lvl: "intermediate",
 s: "Why merge sort is n log n, why naive Fibonacci is exponential, and how to price any recursion in about ten seconds.",
 goal: [
  "Turn a recursive function into a recurrence relation",
  "Apply the Master Theorem's three cases without memorising the algebra",
  "Recognise the recursion-tree shapes that produce the common growth rates"
 ],
 b: [
  { p: "Counting loops stops working the moment a function calls itself. **The question \"what does this recursion cost?\" has a mechanical answer**, and it comes up whenever you write a divide-and-conquer solution or analyse your own DP." },

  { h: "Write the recurrence first" },
  { p: "A recurrence says the cost of size *n* in terms of the cost of something smaller. Read it straight off the code: **how many recursive calls, on what fraction of the input, plus what work outside the calls.**" },

  { code: { lang: "python", t: "Reading a recurrence off the code",
    lines: [
     { c: "def merge_sort(a):", w: "" },
     { c: "    if len(a) <= 1: return a", w: "**Base case — O(1).**" },
     { c: "    mid = len(a) // 2", w: "" },
     { c: "    left  = merge_sort(a[:mid])", w: "**One call on n/2.**" },
     { c: "    right = merge_sort(a[mid:])", w: "**A second call on n/2. So far: 2T(n/2).**", hi: true },
     { c: "    return merge(left, right)", w: "**Merging touches every element once — O(n).**", hi: true },
     { c: "", w: "" },
     { c: "# T(n) = 2T(n/2) + O(n)  ->  O(n log n)", w: "**That line is the whole analysis.** Say it out loud in an interview.", hi: true }
    ],
    after: "Three things to extract, in order: the **number** of calls (2), the **size** each gets (n/2), and the **work outside** them (O(n)). Everything else is bookkeeping." } },

  { h: "The Master Theorem, as a decision" },
  { p: "For `T(n) = a·T(n/b) + f(n)` the answer depends on a race between **the leaves of the recursion tree** — there are n^(log_b a) of them — and **the work at the root**, f(n). Whichever grows faster wins." },

  { tbl: { t: "Three cases, and how to tell them apart",
    h: ["Which side wins", "Result", "Classic example"],
    rows: [
     ["**Leaves win** — f(n) grows slower than n^(log_b a)", "**Θ(n^(log_b a))**", "Binary tree recursion: T(n)=2T(n/2)+O(1) → **Θ(n)**"],
     ["**A tie** — f(n) ≈ n^(log_b a)", "**Θ(n^(log_b a) · log n)**", "Merge sort: T(n)=2T(n/2)+O(n) → **Θ(n log n)**"],
     ["**Root wins** — f(n) grows faster", "**Θ(f(n))**", "T(n)=2T(n/2)+O(n²) → **Θ(n²)**"]
    ] } },

  { n: "The comparison is against **n^(log_b a)**, not against n. For `T(n)=T(n/2)+O(1)` — binary search — a=1 and log₂1 = 0, so the leaf count is n⁰ = 1, a constant. The root work O(1) ties with it, giving **Θ(log n)**. That single example explains binary search's cost properly.",
    nt: "The part people get backwards" },

  { code: { lang: "python", t: "Four recurrences you should recognise instantly",
    lines: [
     { c: "T(n) = T(n/2)  + O(1)   ->  O(log n)", w: "**Halve, do nothing.** Binary search.", hi: true },
     { c: "T(n) = T(n/2)  + O(n)   ->  O(n)", w: "**Halve, but scan.** Quickselect average case. The n dominates: n + n/2 + n/4 ... = 2n." },
     { c: "T(n) = 2T(n/2) + O(1)   ->  O(n)", w: "**Two calls, no merge.** Tree traversal — the cost is just the node count." },
     { c: "T(n) = 2T(n/2) + O(n)   ->  O(n log n)", w: "**Two calls plus a linear merge.** Merge sort, quicksort's good case.", hi: true },
     { c: "T(n) = 2T(n-1) + O(1)   ->  O(2^n)", w: "**Subtracting, not dividing.** Subsets, naive Fibonacci. The killer.", hi: true },
     { c: "T(n) = n * T(n-1)       ->  O(n!)", w: "**Permutations.** Travelling salesman by brute force." }
    ],
    after: "Notice the difference between `T(n/2)` and `T(n-1)`. **Dividing the input gives you a logarithm; subtracting from it gives you an exponential.** That one distinction explains most of the gap between a fast solution and a hopeless one." } },

  { h: "When the split is uneven" },
  { p: "The Master Theorem needs equal parts. Real recursions often split unevenly, and the useful instinct is that **an uneven split still gives a logarithm as long as both sides shrink by a constant fraction.**" },

  { code: { lang: "python", t: "T(n) = T(n/3) + T(2n/3) + O(n)",
    lines: [
     { c: "# depth: the SHALLOWEST path divides by 3 each time", w: "" },
     { c: "#        the DEEPEST path divides by 3/2 each time", w: "" },
     { c: "# both are logarithmic -- log_3(n) and log_1.5(n)", w: "**Different bases, and base is a constant factor.**", hi: true },
     { c: "", w: "" },
     { c: "# each LEVEL still does O(n) total work", w: "**n/3 + 2n/3 = n.**" },
     { c: "# levels x work per level = O(n log n)", w: "**Uneven, and still n log n.**", hi: true }
    ],
    after: "This is why quicksort survives a mediocre pivot. Even a permanent 1-to-99 split is O(n log n) — just with a large constant. **Quicksort only degrades to O(n²) when the split is constant-sized**, such as one element against the rest, which is exactly what an already-sorted array does to a first-element pivot." } },

  { trap: "Do not let `T(n) = T(n-1) + O(n)` fool you into saying O(n log n). Subtracting one gives **n levels**, each costing O(n), so it is **O(n²)**. That is selection sort, and it is also what a badly-pivoted quicksort collapses into." },

  { tryit: { t: "Price five recursions",
    task: "For each, write the recurrence, then the growth rate.\n\n1. Binary search on a sorted array\n2. Computing the height of a binary tree\n3. Naive recursive Fibonacci\n4. Generating every subset of n items\n5. Quickselect (find the k-th smallest) in the average case",
    hint: "For 2, every node is visited exactly once. For 4, count the outputs — you cannot generate 2^n things in less than O(2^n).",
    sol: { lang: "python", code: "# 1. binary search -- one call on half, constant work outside\n#    T(n) = T(n/2) + O(1)  ->  O(log n)\n\n# 2. tree height -- two calls, constant combine\n#    T(n) = 2T(n/2) + O(1)  ->  O(n)\n#    Simpler argument: every node is visited once, so O(n) nodes = O(n).\n#    True for ANY traversal, balanced or not.\n\n# 3. naive fib -- two calls on n-1 and n-2, subtracting\n#    T(n) = T(n-1) + T(n-2) + O(1)  ->  O(phi^n) ~ O(1.618^n)\n#    Often quoted as O(2^n); the tighter bound is the golden ratio.\n\n# 4. all subsets -- two branches per element (take / skip)\n#    T(n) = 2T(n-1) + O(1)  ->  O(2^n)\n#    You cannot beat this: there ARE 2^n subsets to emit.\n\n# 5. quickselect average -- ONE call on half, linear partition\n#    T(n) = T(n/2) + O(n)  ->  O(n)\n#    The key contrast with quicksort: recursing into one side, not both.\n#    n + n/2 + n/4 + ... = 2n, a geometric series." },
    w: "Compare 4 and 5. Both look like divide and conquer, and one is linear while the other is exponential. **The difference is whether the input is divided or decremented, and whether you recurse into one branch or both** — those two questions price almost any recursion you will meet." } },

  { vocab: ["Recursion", "Time Complexity", "Big O Notation", "Merge Sort", "Quick Sort", "Divide and Conquer"] }
 ],
 k: [
  "Read a recurrence off the code: how many calls, on what size, plus the work outside them.",
  "Master Theorem is a race between the leaf count n^(log_b a) and the root work f(n) — the faster-growing side wins.",
  "`T(n/2)` gives a logarithm; `T(n-1)` gives an exponential. That distinction is most of the difference between fast and hopeless.",
  "An uneven split is still O(n log n) provided both sides shrink by a constant fraction.",
  "Recursing into one half is O(n); recursing into both is O(n log n). Quickselect versus quicksort."
 ],
 r: ["Recursion", "Time Complexity", "Merge Sort", "Big O Notation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "T(n) = 2T(n/2) + O(n)  ->  O(n log n)", w: "merge sort — the tie case" },
   { c: "T(n) = T(n/2) + O(1)   ->  O(log n)", w: "binary search — halve and stop" },
   { c: "T(n) = 2T(n-1) + O(1)  ->  O(2^n)", w: "subsets — subtracting, not dividing" },
   { c: "T(n) = T(n/2) + O(n)   ->  O(n)", w: "quickselect — one side only, geometric series" }
  ]
 }
},

{
 t: "Amortised Cost, and the Case You Are Actually Asked About",
 m: "complexity",
 lvl: "intermediate",
 s: "Why appending to a list is O(1) when it sometimes copies everything, and when the worst case is the wrong number to quote.",
 goal: [
  "Explain amortised O(1) for a dynamic array convincingly",
  "Distinguish worst, average and amortised cost and use the right one",
  "Avoid the hidden-cost mistakes that make a correct solution too slow"
 ],
 b: [
  { p: "Three different numbers get called \"the complexity\", and interviewers listen for which one you quote. Getting this right is a cheap way to sound like you have done the reading." },

  { h: "The three numbers" },
  { tbl: { t: "Which one to say",
    h: ["Kind", "Means", "Quote it when"],
    rows: [
     ["**Worst case**", "The most expensive single input", "Almost always — it is the default, and what *O(...)* means unqualified"],
     ["**Average case**", "Expected cost over random inputs", "Hash tables, quicksort — where the worst case is real but rare"],
     ["**Amortised**", "Average per operation across a *sequence*, guaranteed", "Dynamic arrays, hash resizing — where an occasional operation is expensive but pays for many cheap ones"]
    ] } },

  { n: "**Amortised is not the same as average.** Average is probabilistic and can be unlucky forever; amortised is a guarantee about any sequence, with no randomness involved. Saying \"amortised O(1)\" for `list.append` is precise. Saying \"average O(1)\" is sloppy and a sharp interviewer will notice.",
    nt: "The distinction worth being crisp about" },

  { h: "Why append is O(1)" },
  { code: { lang: "python", t: "Doubling, and the geometric series that saves you",
    lines: [
     { c: "# a dynamic array holds: capacity, and a count of used slots", w: "" },
     { c: "def append(self, x):", w: "" },
     { c: "    if self.n == self.cap:", w: "**Full — this is the expensive branch.**" },
     { c: "        self.cap *= 2", w: "**DOUBLE it. Not +1, not +10.**", hi: true },
     { c: "        self.data = copy_into_new_block(self.cap)", w: "**O(n) — every element moves.**" },
     { c: "    self.data[self.n] = x", w: "**The common case: O(1).**" },
     { c: "    self.n += 1", w: "" },
     { c: "", w: "" },
     { c: "# copies to reach n: 1 + 2 + 4 + ... + n/2 + n  <  2n", w: "**Total copying is linear, over n appends.**", hi: true },
     { c: "# 2n copies / n appends = O(1) amortised", w: "**That sentence is the answer they want.**", hi: true }
    ],
    after: "The doubling is what makes it work. **Growing by a fixed amount instead — `cap += 10` — gives O(n²) total**, because you copy every 10 appends forever and the copies grow. This is a genuine interview question, not a curiosity." } },

  { h: "Hidden costs that ruin correct solutions" },
  { p: "Most \"my solution timed out\" moments are not the algorithm. They are an O(n) operation sitting inside a loop, disguised as something cheap." },

  { tbl: { t: "Operations that cost more than they look",
    h: ["Looks like O(1)", "Actually", "Do this instead"],
    rows: [
     ["`arr.pop(0)` / `arr.insert(0, x)`", "**O(n)** — everything shifts", "`collections.deque` — O(1) at both ends"],
     ["`s += ch` in a loop", "**O(n²)** — strings are immutable, each += copies", "Collect into a list, then `''.join(parts)`"],
     ["`x in my_list`", "**O(n)** — a linear scan", "`x in my_set` — O(1)"],
     ["`arr[1:]` inside recursion", "**O(n)** copy per call", "Pass an index, not a slice"],
     ["`list(...)` / `sorted(...)` in a loop", "**O(n log n)** each time", "Hoist it out, or maintain a heap"],
     ["`min(arr)` inside a loop over arr", "**O(n²)** total", "One pass, or a heap"]
    ] } },

  { trap: "`arr.pop(0)` in a BFS loop is the single most common way a correct graph solution times out. It turns an O(V+E) traversal into O(V²+VE). **Use `deque` and `popleft` — always, without thinking about it.**" },

  { h: "The n that tells you the answer" },
  { p: "Interview constraints are a hint, not decoration. Roughly 10⁸ simple operations per second is the working assumption." },

  { tbl: { t: "Reading the constraint",
    h: ["n up to", "Affordable", "So the intended solution is"],
    rows: [
     ["**10-12**", "O(n!) or O(2ⁿ · n)", "Permutations, brute-force TSP"],
     ["**20-25**", "O(2ⁿ)", "Subsets, bitmask DP"],
     ["**~500**", "O(n³)", "Floyd-Warshall, interval DP"],
     ["**~5,000**", "O(n²)", "Two-dimensional DP, all pairs"],
     ["**10⁵-10⁶**", "O(n log n)", "Sort, heap, binary search — **the most common band**"],
     ["**10⁷+**", "O(n) or O(log n)", "One pass, two pointers, or maths"]
    ] } },

  { n: "Say this out loud in the room: *\"n is up to 10⁵, so an O(n²) solution is about 10¹⁰ operations and will not run — I need n log n or better.\"* **You have just shown you can price a solution before writing it**, which is a large part of what the round is scoring.",
    nt: "A sentence worth rehearsing" },

  { tryit: { t: "Find the hidden cost in four snippets",
    task: "Each of these is correct and too slow. Name the real complexity and the fix.\n\n1. `while queue: node = queue.pop(0)` in a BFS\n2. `out = ''` then `out += str(x)` inside a loop over n items\n3. `for x in a: if x in b:` where a and b are both lists of length n\n4. `for i in range(n): smallest = min(arr[i:])`",
    hint: "Three of the four are secretly quadratic. Ask what the inner operation costs, not just how many times the loop runs.",
    sol: { lang: "python", code: "from collections import deque\n\n# 1. pop(0) shifts every element: O(n) per pop, O(V^2) overall\n#    FIX -- deque.popleft() is O(1)\nqueue = deque([start])\nwhile queue:\n    node = queue.popleft()\n\n# 2. strings are immutable, so += copies the whole string: O(n^2)\n#    FIX -- build a list, join once: O(n)\nparts = []\nfor x in items:\n    parts.append(str(x))\nout = ''.join(parts)\n\n# 3. 'in' on a LIST is a linear scan: O(n) x O(n) = O(n^2)\n#    FIX -- hash the one you probe: O(n)\nbset = set(b)\nfound = [x for x in a if x in bset]\n\n# 4. min() over a slice, n times: O(n^2), and arr[i:] also COPIES\n#    FIX -- depends on intent; a single pass or a heap\n#    if you want a running minimum from the right:\nn = len(arr)\nsuffix_min = [0] * n\nrunning = float('inf')\nfor i in range(n - 1, -1, -1):\n    running = min(running, arr[i])\n    suffix_min[i] = running          # O(n) total" },
    w: "None of these are algorithmic mistakes — every one is the right approach with a costly primitive inside the loop. **This is the most common reason a submission that passes the samples fails the full tests**, and spotting it is a learnable habit: for every line inside a loop, ask what that line alone costs." } },

  { vocab: ["Time Complexity", "Space Complexity", "Array", "Hash Table", "Queue", "Big O Notation"] }
 ],
 k: [
  "Amortised is a guarantee over a sequence; average is probabilistic. `list.append` is amortised O(1).",
  "Doubling the capacity makes total copying linear — growing by a constant makes it quadratic.",
  "`pop(0)`, `s += ch`, and `x in list` are the three hidden O(n) operations that quietly make solutions quadratic.",
  "Use `deque` for anything FIFO; use `''.join()` to build strings; hash anything you probe repeatedly.",
  "Read n from the constraints and name the affordable complexity before you write a line."
 ],
 r: ["Time Complexity", "Space Complexity", "Array", "Hash Table"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "queue = deque(); queue.popleft()", w: "O(1) FIFO — never pop(0)" },
   { c: "''.join(parts)", w: "linear string building, not += in a loop" },
   { c: "bset = set(b); x in bset", w: "O(1) membership instead of an O(n) scan" },
   { c: "self.cap *= 2", w: "doubling is what makes append amortised O(1)" }
  ]
 }
}

]);
