/* DSA for Interviews — the game, and complexity. */
TD.addLessons("dsa", [

{
 t: "The Game, and How to Play It Deliberately",
 m: "game",
 lvl: "core",
 s: "What is actually being scored, how many problems is enough, and a study method with an end date.",
 goal: [
  "Say what the interviewer is really assessing",
  "Set a finite plan with a realistic problem count",
  "Practise in a way that builds recognition rather than memory"
 ],
 b: [
  { p: "This is a hiring format, not a job skill, and the single most expensive mistake is treating it as either a measure of your worth or an infinite obligation. It is a specific game with learnable rules. Learn them, play for a fixed period, and stop." },

  { h: "What is actually being scored" },
  { tbl: { t: "The rubric, roughly",
    h: ["What they assess", "Weight", "How you show it"],
    rows: [
     ["**Problem solving out loud**", "**High**", "Clarify, state an approach, discuss trade-offs before coding"],
     ["**Correctness**", "High", "Working code, and you test it yourself"],
     ["**Complexity analysis**", "High", "State time and space unprompted, for every approach"],
     ["**Code quality**", "Medium", "Readable names, small functions, no dead code"],
     ["**Communication**", "**High**", "Thinking aloud, taking hints, saying when you are stuck"],
     ["**Speed**", "Low", "Finishing is good; rushing to a wrong answer is not"]
    ] } },

  { n: "A candidate who states a brute-force approach, analyses it, proposes an optimisation, discusses the trade-off, and codes it *almost* correctly frequently outscores one who silently produces a perfect answer. Most of the signal is in the conversation, and most candidates treat it as a typing exam.",
    nt: "The thing nobody tells you" },

  { h: "How many problems" },
  { p: "The honest number is around **150**, chosen to cover the patterns rather than accumulated at random. Not 500, and not 40." },

  { code: { lang: "text", t: "A distribution that covers the format",
    lines: [
     { c: "  arrays, strings, hashing        30   <- highest yield", hi: true },
     { c: "  two pointers, sliding window    15" },
     { c: "  binary search                   12" },
     { c: "  stacks, queues, heaps           15" },
     { c: "  linked lists                    10" },
     { c: "  trees                           20" },
     { c: "  graphs (BFS / DFS)              20" },
     { c: "  recursion, backtracking         12" },
     { c: "  dynamic programming             16" },
     { c: "  ---------------------------------" },
     { c: "  total                          150" },
     { c: "" },
     { c: "  roughly 60% medium, 25% easy, 15% hard" },
     { c: "  Most interviews are MEDIUM. Do not over-invest", hi: true },
     { c: "  in hard problems -- they are rare and demoralising." }
    ] } },

  { h: "The method that builds recognition" },
  { p: "The mistake is solving a problem, feeling satisfied, and moving on. Recognition is built by deliberate repetition of *patterns*, not by volume of problems." },

  { ol: [
   "**Try for 25 minutes, genuinely.** Struggle is where the learning happens.",
   "**If stuck, read the solution properly** — not just the code, the *idea*. Ask: what property of the problem made this work?",
   "**Close it and write it yourself from scratch.** Not copying. This step is where most people cheat themselves.",
   "**Write one line naming the pattern** and the trigger: *sorted array, find a pair → two pointers*.",
   "**Redo it after three days, then after two weeks.** Spaced repetition, exactly as with vocabulary.",
   "**Group by pattern, not by list order.** Doing eight sliding-window problems in a row builds recognition; doing eight random problems builds fatigue."
  ] },

  { code: { lang: "text", t: "A pattern log — the highest-value artefact of your prep",
    lines: [
     { c: "TRIGGER -> PATTERN" },
     { c: "" },
     { c: "'find pair summing to k', array is SORTED   -> two pointers" },
     { c: "'find pair summing to k', UNSORTED         -> hash map", hi: true },
     { c: "'longest/shortest substring with X'        -> sliding window" },
     { c: "'top k' / 'k largest'                      -> heap of size k" },
     { c: "'next greater element'                     -> monotonic stack" },
     { c: "'sorted array, find something'             -> binary search" },
     { c: "'minimum steps in a grid/graph'            -> BFS" },
     { c: "'all paths' / 'all combinations'           -> backtracking" },
     { c: "'count ways' / 'min cost to reach'         -> DP" },
     { c: "'detect a cycle in a linked list'          -> fast/slow pointers" },
     { c: "'merge overlapping ranges'                 -> sort, then sweep" },
     { c: "" },
     { c: "Two lines per problem. After 150 problems this page", hi: true },
     { c: "is what you actually revise the night before." }
    ] } },

  { h: "A finite plan" },
  { tbl: { t: "Twelve weeks, part time",
    h: ["Weeks", "Focus", "Problems"],
    rows: [
     ["1–2", "Complexity, arrays, strings, hashing", "30"],
     ["3–4", "Two pointers, sliding window, binary search", "27"],
     ["5–6", "Stacks, queues, heaps, linked lists", "25"],
     ["7–8", "Trees, then graphs", "40"],
     ["9–10", "Recursion, backtracking, DP", "28"],
     ["11–12", "**Mixed review and mock interviews**", "revisit"]
    ] } },

  { p: "Roughly 90 minutes a day, five days a week. Weeks 11 and 12 matter more than they look — solving problems in a random order under time pressure is a different skill from solving them in a themed set, and it is the skill the interview tests." },

  { trap: "Grinding this endlessly at the expense of building projects is the single most common way strong candidates fail AI engineering interviews. The coding round is one round; the AI technical round and the project deep-dive are usually two, and they are where a strong portfolio wins. Cap this at twelve weeks alongside your project work — do not let it become the whole plan." },

  { h: "Language and tools" },
  { l: [
   "**Use Python** unless you have a reason not to. Least syntax between you and the idea, and universally accepted.",
   "**Know your standard library**: `collections.defaultdict`, `Counter`, `deque`, `heapq`, `bisect`, `itertools`. Reaching for the right one is itself a signal.",
   "**Practise in a plain editor** sometimes — no autocomplete, no running. Many interviews are in a shared document.",
   "**Type your code out.** Reading solutions builds a false sense of competence that collapses under observation."
  ] },

  { h: "Mock interviews" },
  { p: "Do at least five with a real person before your first real one. Solving alone and solving while someone watches and you narrate are genuinely different activities, and the gap surprises people badly." },
  { l: [
   "**Pramp and interviewing.io** pair you with strangers, which is closer to the real thing than a friend.",
   "**Record yourself** solving one aloud and watch it. Uncomfortable, and the fastest feedback available.",
   "**Practise the first two minutes especially** — clarifying and restating. That is where most candidates go wrong and it is entirely rehearsable."
  ] },

  { tryit: { t: "Set the plan, then start the log",
    task: "Write your twelve-week plan with a specific end date. Pick a problem list. Solve three problems today and write the pattern log entry for each — trigger on the left, pattern on the right.",
    hint: "Put the end date in your calendar. A prep period with no end becomes an indefinite one, and indefinite prep is how people spend a year not applying.",
    sol: { lang: "text", code: "Example week 1, day 1 log:\n\n  1. Two Sum\n     trigger: 'find a pair summing to target', unsorted\n     pattern: hash map -- store seen values, look up\n              (target - x) as you go\n     O(n) time, O(n) space. The sorted variant is two\n     pointers at O(1) space.\n\n  2. Valid Anagram\n     trigger: 'are these the same characters'\n     pattern: Counter comparison, or sort both\n     Counter is O(n); sorting is O(n log n). Say both.\n\n  3. Best Time to Buy and Sell Stock\n     trigger: 'max difference where the smaller comes first'\n     pattern: single pass tracking min-so-far\n     O(n) time, O(1) space. Also the base case for the\n     harder stock DP problems later.\n\nRedo all three on day 4 and again in week 3." },
    w: "By week twelve this document will be forty lines long and it is what you revise the night before an interview — not the 150 solutions, which you will not remember and do not need to. Recognition is the goal, and the log is what trains it." } },

  { vocab: ["Algorithm", "Data Structure", "Time Complexity"] }
 ],
 k: [
  "Most of the score is in the conversation: clarifying, stating approaches, analysing complexity aloud.",
  "About 150 problems chosen to cover the patterns, weighted towards arrays, hashing, trees and graphs.",
  "Struggle 25 minutes, read the idea, then rewrite from scratch — and redo after 3 days and 2 weeks.",
  "Keep a trigger→pattern log. It is what you revise, not the solutions.",
  "Give the plan an end date, and do not let it displace building projects."
 ],
 r: ["Algorithm", "Data Structure", "Time Complexity", "Big-O Notation"]
},

{
 t: "Big-O Without the Mathematics",
 m: "complexity",
 lvl: "core",
 s: "Counting operations, the growth rates that matter, and stating complexity in one sentence.",
 goal: [
  "Determine time and space complexity by counting loops and calls",
  "Recognise the six growth rates that appear in interviews",
  "State a complexity out loud before being asked"
 ],
 b: [
  { p: "Big-O answers one question: as the input grows, how does the work grow? Not how many seconds — how the seconds *scale*. That distinction is the whole subject." },

  { h: "The six growth rates" },
  { tbl: { t: "What happens at n = 1,000,000",
    h: ["Complexity", "Name", "Operations", "Where"],
    rows: [
     ["**O(1)**", "Constant", "1", "Hash lookup, array index, arithmetic"],
     ["**O(log n)**", "Logarithmic", "**20**", "Binary search, balanced tree operations"],
     ["**O(n)**", "Linear", "1,000,000", "One pass over the data"],
     ["**O(n log n)**", "Linearithmic", "20,000,000", "**Sorting.** The practical floor for comparison sorts"],
     ["**O(n²)**", "Quadratic", "**10¹²**", "Nested loops. Too slow past about 10,000"],
     ["**O(2ⁿ)**", "Exponential", "**Unimaginable**", "Naive recursion over subsets. Infeasible past n≈30"]
    ] } },

  { n: "The gap between O(n log n) and O(n²) is where interviews live. At a million items that is 20 million operations against a trillion — under a second against roughly eleven days. Almost every *optimise this* question is asking you to cross that line.",
    nt: "The gap that matters" },

  { h: "Counting it" },
  { code: { lang: "python", t: "Read the loops",
    lines: [
     { c: "def f(arr):", w: "" },
     { c: "    total = 0", w: "**O(1)** — one operation regardless of size." },
     { c: "", w: "" },
     { c: "    for x in arr:", w: "**O(n)** — once per element." },
     { c: "        total += x", w: "" },
     { c: "", w: "" },
     { c: "    for i in range(len(arr)):", w: "" },
     { c: "        for j in range(len(arr)):", w: "**O(n²)** — nested, each over the full array.", hi: true },
     { c: "            if arr[i] == arr[j]: ...", w: "" },
     { c: "", w: "" },
     { c: "    arr.sort()", w: "**O(n log n)**." },
     { c: "", w: "" },
     { c: "    return total", w: "" }
    ],
    after: "Total is O(1) + O(n) + O(n²) + O(n log n) = **O(n²)**. Sequential steps add, and the largest term dominates — so you drop everything else." } },

  { l: [
   "**Sequential loops add** and you keep the largest: O(n) + O(n²) = O(n²).",
   "**Nested loops multiply**: a loop of n inside a loop of n is O(n²).",
   "**Drop constants**: O(3n) is O(n). Two passes and one pass scale identically.",
   "**Drop lower terms**: O(n² + n) is O(n²).",
   "**Different inputs get different letters.** Two arrays of different sizes is O(n·m), not O(n²) — and getting this right is a small, noticed detail."
  ] },

  { code: { lang: "python", t: "The one that catches people",
    lines: [
     { c: "def g(arr):", w: "" },
     { c: "    n = len(arr)", w: "" },
     { c: "    for i in range(n):", w: "" },
     { c: "        for j in range(i + 1, n):", w: "**The inner loop shrinks.** n-1, then n-2, then n-3…", hi: true },
     { c: "            print(arr[i], arr[j])", w: "" },
     { c: "", w: "" },
     { c: "# total = n(n-1)/2 = n²/2 - n/2", w: "" },
     { c: "# drop constants and lower terms -> O(n²)", w: "**Still quadratic.** Half of a quadratic is a quadratic — a very common misjudgement.", hi: true }
    ] } },

  { h: "The costs of Python operations" },
  { tbl: { t: "What you should know without looking up",
    h: ["Operation", "Cost", "Note"],
    rows: [
     ["`d[k]`, `k in d`, `s.add(x)`", "**O(1)**", "**The reason hash maps win so often**"],
     ["`x in list`", "**O(n)**", "**Scans.** `x in set` is O(1) — the single most common accidental quadratic"],
     ["`list.append(x)`", "O(1) amortised", "Occasionally resizes; averages to constant"],
     ["`list.insert(0, x)`, `list.pop(0)`", "**O(n)**", "**Shifts everything.** Use `collections.deque` for a queue"],
     ["`list.sort()`", "O(n log n)", "Timsort — very fast on partly-sorted data"],
     ["`s[a:b]`", "O(b-a)", "**Slicing copies.** Slicing inside a loop is a hidden quadratic"],
     ["`heapq.heappush/heappop`", "O(log n)", "" ],
     ["String `+` in a loop", "**O(n²)**", "**Strings are immutable** — each concatenation copies. Use `''.join(parts)`"]
    ] } },

  { trap: "`if x in some_list` inside a loop is the most common accidental O(n²) in interview code, and it is one character from being correct. Converting the list to a set first makes the whole thing O(n). Interviewers notice this immediately, and noticing it yourself unprompted is a strong signal." },

  { h: "Space complexity" },
  { code: { lang: "python", t: "Count what you allocate",
    lines: [
     { c: "def a(arr):", w: "" },
     { c: "    return sum(arr)", w: "**O(1) space.** A few variables, regardless of input size." },
     { c: "", w: "" },
     { c: "def b(arr):", w: "" },
     { c: "    return sorted(arr)", w: "**O(n) space** — a new list." },
     { c: "", w: "" },
     { c: "def c(arr):", w: "" },
     { c: "    arr.sort()", w: "**O(1) extra** — in place. This is the trade an interviewer will ask about." },
     { c: "", w: "" },
     { c: "def d(n):", w: "" },
     { c: "    if n <= 1: return n", w: "" },
     { c: "    return d(n-1) + d(n-2)", w: "**O(n) space from the call stack**, even though nothing is allocated. Recursion depth is space, and it is the answer people forget.", hi: true }
    ] } },

  { h: "Reading the constraints" },
  { p: "Interview problems state a maximum n, and it tells you which complexity is expected. This is the most underused hint in the whole format." },

  { tbl: { t: "n implies the answer",
    h: ["Maximum n", "Expected", "Meaning"],
    rows: [
     ["n ≤ 20", "O(2ⁿ) or O(n!)", "**Exhaustive search is fine.** Backtracking"],
     ["n ≤ 500", "O(n³)", "Triple nesting acceptable"],
     ["n ≤ 5,000", "O(n²)", "Nested loops fine"],
     ["**n ≤ 10⁵**", "**O(n log n) or O(n)**", "**The most common case.** Sort, or one pass with a hash map"],
     ["n ≤ 10⁹", "O(log n) or O(1)", "Binary search or a formula. You cannot even iterate"]
    ] } },

  { n: "Say this out loud in the interview: *n is up to 10⁵, so an O(n²) solution is about 10¹⁰ operations and too slow — I need O(n log n) or better.* That single sentence demonstrates complexity reasoning, justifies your approach, and takes ten seconds.",
    nt: "A line worth rehearsing" },

  { tryit: { t: "Analyse six functions",
    task: "State time and space complexity for each, then check.\n\n1. Two nested loops, inner runs `n` times\n2. A loop that halves `n` each iteration\n3. Sort, then a single pass\n4. Recursion branching twice, depth n\n5. A loop over `n` doing `x in some_list` where the list has n items\n6. Building a result string with `+=` in a loop over n",
    hint: "For 5 and 6, ask what the operation inside the loop costs — not just how many times the loop runs.",
    sol: { lang: "python", code: "# 1. O(n^2) time, O(1) space\n\n# 2. O(log n) time, O(1) space\n#    halving reaches 1 in log2(n) steps\n\n# 3. O(n log n) time -- the sort dominates the pass\n#    O(n) space if sorted(), O(1) if .sort()\n\n# 4. O(2^n) time, O(n) space\n#    2^n calls; the stack is only ever n deep\n\n# 5. O(n^2) time -- the loop is n, but `in list` is O(n)\n#    THE CLASSIC. Convert to a set first -> O(n)\n\n# 6. O(n^2) time -- strings are immutable, so each +=\n#    copies the whole string built so far.\n#    ''.join(parts) is O(n)." },
    w: "Cases 5 and 6 are the ones that separate people. Both look linear — one loop over n — and both are quadratic because of what happens inside. Learning to price the operation inside the loop, not just count the loop, is most of what complexity analysis actually is in practice." } },

  { vocab: ["Big-O Notation", "Time Complexity", "Space Complexity", "Hash Table", "Algorithm"] }
 ],
 k: [
  "Sequential loops add and you keep the largest; nested loops multiply; drop constants and lower terms.",
  "`x in list` is O(n) and `x in set` is O(1) — the commonest accidental quadratic in interview code.",
  "String `+=` in a loop is O(n²) because strings are immutable; use `''.join`.",
  "Recursion depth counts as space even when nothing is allocated.",
  "The stated constraint on n tells you the expected complexity — say that reasoning out loud."
 ],
 r: ["Big-O Notation", "Time Complexity", "Space Complexity", "Hash Table", "Binary Search"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "seen = set(arr)", w: "convert once, so membership is O(1) not O(n)" },
   { c: "''.join(parts)", w: "build a string in O(n), not O(n²)" },
   { c: "from collections import deque", w: "O(1) pops from the front, unlike a list" },
   { c: "arr.sort()  # O(n log n), O(1) extra space", w: "sort in place when space matters" }
  ]
 }
}

]);
