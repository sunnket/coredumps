/* Python — Loops in depth.

   The `flow` module already taught while, for, break, continue and for...else.
   This module is the layer above that: the protocol underneath every loop, the
   patterns that have names, the ones that do not but should, and the iteration
   logic that AI-engineering work assumes you already have.

   House rule for this file: every loop shown is one you would actually write at
   work. No `for i in range(10): print(i)` unless it is illustrating the
   mechanism itself. */

TD.addLessons("python", [

/* ==================================================================== */
{
 t: "What a for Loop Really Does",
 m: "loops",
 lvl: "core",
 s: "The iterator protocol — four rules that explain every loop, generator and streaming pipeline you will ever write.",
 goal: [
  "Explain `for` in terms of `iter()`, `next()` and `StopIteration`",
  "Say why a `for` loop can read a 400 GB file on a 16 GB laptop",
  "Spot the bug where an iterator has already been used up"
 ],
 b: [
  { p: "Almost everyone learns `for` as a magic word meaning *do this once per item*. That gets you a long way and then it stops — the day a loop silently produces nothing, or a generator gives the right answer once and empty results forever after, the magic-word model has no explanation to offer. The real mechanism is small enough to hold in your head, and once you have it those bugs become obvious rather than mysterious." },

  { h: "The four rules" },
  { p: "There is no loop machinery inside Python's `for` statement. There is a **protocol** — an agreement about which methods an object provides — and `for` is a thin piece of syntax that drives it." },
  { ol: [
   "`iter(obj)` asks an object for an **iterator**. An object that can answer is called **iterable**.",
   "`next(it)` asks the iterator for the next value. Iterators only go forward, and only one step at a time.",
   "When there is nothing left, `next` raises **`StopIteration`**.",
   "`for` catches that exception and exits the loop normally. That is the whole thing."
  ] },

  { dg: "loop-anatomy" },

  { code: { lang: "python", t: "The same loop, written by hand",
    lines: [
     { c: "names = [\"Aryan\", \"Sam\", \"Riya\"]", w: "A list. Lists are **iterable** — they know how to hand out an iterator — but a list is not itself an iterator." },
     { c: "", w: "" },
     { c: "for name in names:", w: "What you write." },
     { c: "    print(name)", w: "" },
     { c: "", w: "" },
     { c: "it = iter(names)", w: "What Python does. Step 1: ask the list for a fresh iterator — a small cursor object that remembers a position.", hi: true },
     { c: "while True:", w: "" },
     { c: "    try:", w: "" },
     { c: "        name = next(it)", w: "Step 2: ask for the next value, and advance the cursor by one." },
     { c: "    except StopIteration:", w: "Step 3: the iterator signals exhaustion by **raising**, not by returning a special value. There is no `None` sentinel that could collide with real data." },
     { c: "        break", w: "Step 4: `for` swallows that exception and leaves the loop. This is why a loop finishing normally does not look like an error." },
     { c: "    print(name)", w: "The body you wrote." }
    ],
    out: "Aryan\nSam\nRiya\nAryan\nSam\nRiya",
    after: "Both halves print the same thing because they *are* the same thing. Every `for` loop in every Python program you have run is the second version with the boilerplate hidden." } },

  { ana: "An iterable is a book on a shelf; an iterator is a bookmark in it. You can ask the book for as many bookmarks as you like and each moves independently. But a bookmark only moves forward, and once it reaches the last page it is finished — it does not rewind, and asking for more pages just tells you there are none.",
    at: "Books and bookmarks" },

  { h: "Why this matters more than it sounds" },
  { p: "Because `next` is called one value at a time, **the whole sequence never has to exist**. That single fact is the difference between a script that handles the data you have and one that handles the data you will have." },

  { vs: { t: "Reading a 400 GB log file on a 16 GB laptop", lang: "python",
    bad: { c: "lines = open(\"events.log\").readlines()\nfor line in lines:\n    process(line)", label: "Materialise everything",
      w: "`readlines()` builds one list holding every line. 400 GB of text needs rather more than 400 GB of RAM once each line is a `str` object. The process is killed by the OS before the first line is processed." },
    good: { c: "with open(\"events.log\") as f:\n    for line in f:\n        process(line)", label: "Pull one at a time",
      w: "A file object **is** its own iterator. Each `next` reads forward to the next newline and yields one line. Peak memory is one line, whatever the file size. This is not a clever trick — it is the protocol doing what it was designed for." } } },

  { p: "Every streaming tool you will meet is this idea wearing a different hat: a generator, a PyTorch `DataLoader` handing out one batch at a time, a paginated API client, tokens arriving from a language model as they are produced. All of them are *something that answers `next` until it has nothing left*." },

  { h: "The trap: iterators are consumed" },
  { p: "An iterable can be looped over as many times as you like, because each loop asks for a fresh iterator. An **iterator** can be looped over exactly once — after that the cursor is already at the end." },

  { code: { lang: "python", t: "The bug that produces a mysteriously empty result",
    lines: [
     { c: "nums = [1, 2, 3]", w: "" },
     { c: "print(sum(nums), sum(nums))", w: "`6 6`. A list is re-iterable: each `sum` gets its own cursor, starting from the beginning." },
     { c: "", w: "" },
     { c: "squares = (n * n for n in nums)", w: "A **generator expression** — round brackets, not square. This is an iterator, not a list.", hi: true },
     { c: "print(sum(squares))", w: "`14`. Correct. The cursor is now parked at the end." },
     { c: "print(sum(squares))", w: "`0`. Not an error, not a warning — the iterator is exhausted, so `sum` receives no values and returns its identity element. **This is the most common iterator bug there is.**", hi: true },
     { c: "print(max(squares, default=None))", w: "`None`. Same cause. Every later consumer sees an empty stream." }
    ],
    out: "6 6\n14\n0\nNone" } },

  { trap: "If you need to walk the same stream twice you must either keep a list (`items = list(gen)` — costs the memory you were saving) or build the generator twice (costs the work again). There is no third option and no way to rewind. Choosing between those two is a real engineering decision: memory or recomputation. Deciding it deliberately marks someone who understands the protocol; being surprised by an empty second pass marks someone who does not." },

  { h: "Making your own object work with for" },
  { p: "Because it is a protocol rather than a built-in privilege, anything implementing it becomes loopable — including your own classes. This is exactly how a dataset class in a training pipeline works." },

  { code: { lang: "python", file: "countdown.py", t: "A class a for loop can drive",
    lines: [
     { c: "class Countdown:", w: "" },
     { c: "    def __init__(self, start):", w: "" },
     { c: "        self.start = start", w: "" },
     { c: "", w: "" },
     { c: "    def __iter__(self):", w: "Makes the object **iterable**. `iter(obj)` calls this, and it must return an iterator.", hi: true },
     { c: "        n = self.start", w: "Fresh state on every call — which is what makes this object re-iterable rather than one-shot." },
     { c: "        while n > 0:", w: "" },
     { c: "            yield n", w: "`yield` makes this a generator function, so it returns an iterator for free. Without it you would write a second class with a `__next__` method and raise `StopIteration` by hand." },
     { c: "            n -= 1", w: "" },
     { c: "", w: "" },
     { c: "for n in Countdown(3):", w: "Python calls `__iter__`, then `next` repeatedly. Your class is now indistinguishable from a built-in as far as `for` is concerned." },
     { c: "    print(n)", w: "" },
     { c: "", w: "" },
     { c: "print(list(Countdown(3)))", w: "Everything that consumes iterables now works: `list`, `sum`, `max`, `in`, unpacking, comprehensions, `zip`. One method, and you inherited the whole ecosystem." }
    ],
    out: "3\n2\n1\n[3, 2, 1]" } },

  { n: "This is why `for x in thing` is worth understanding properly rather than memorising. `__iter__` is a single method, and implementing it plugs your object into every iteration tool in the language at once.",
    nt: "One method, whole ecosystem" },

  { tryit: { t: "Explain the output",
    task: "Predict what this prints, then say precisely why the second line differs from the first: `data = (x for x in [1, 2, 3])`, then `print(list(data))` twice.",
    hint: "Round brackets make a generator, and a generator is an iterator — not an iterable that can restart.",
    sol: { lang: "python", code: "data = (x for x in [1, 2, 3])\nprint(list(data))   # [1, 2, 3]\nprint(list(data))   # []\n\n# The first list() drove the generator to StopIteration.\n# The cursor sits at the end and cannot rewind, so the\n# second list() receives zero values immediately.\n\n# Need it twice? Pick one cost deliberately:\nkept = [x for x in [1, 2, 3]]           # memory: keep it\nprint(list(kept), list(kept))           # [1, 2, 3] [1, 2, 3]\n\ndef make():                             # recompute: rebuild it\n    return (x for x in [1, 2, 3])\nprint(list(make()), list(make()))       # [1, 2, 3] [1, 2, 3]" },
    w: "No exception is raised, which is what makes this bug expensive — it surfaces as an empty report or a zeroed metric, usually far from the generator that caused it." } }
 ],
 k: [
  "`for` is `iter()`, then `next()` until `StopIteration` — there is no other machinery.",
  "Iterable = can produce a fresh cursor. Iterator = **is** a cursor, and is one-shot.",
  "Because values arrive one at a time, the full sequence never needs to exist in memory.",
  "An exhausted iterator yields nothing **silently** — no error, just an empty result.",
  "Implement `__iter__` and your class works with every iteration tool in Python."
 ],
 r: ["Iterator", "Loop", "Iteration", "List Comprehension"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "it = iter(names)", w: "ask an iterable for a fresh cursor" },
   { c: "next(it)", w: "pull the next value and advance the cursor" },
   { c: "except StopIteration:", w: "the signal that an iterator is exhausted" },
   { c: "def __iter__(self):", w: "the one method that makes your class loopable" },
   { c: "with open(path) as f:\n    for line in f:", w: "stream a file of any size, one line at a time", hint: "two lines" }
  ]
 }
},

/* ==================================================================== */
{
 t: "The Named Loop Patterns",
 m: "loops",
 lvl: "core",
 s: "Accumulate, search, filter, transform, group, pairwise — the six shapes that nearly every loop you write is an instance of.",
 goal: [
  "Recognise which of the six shapes a problem is asking for",
  "Write each one from muscle memory, with the right built-in where one exists",
  "Stop writing a manual loop where a single built-in already does the job"
 ],
 b: [
  { p: "Experienced engineers do not think *I need a loop here*. They think *this is an accumulation* or *this is a grouping*, and the code follows immediately. The shapes below have names because they come up so often that not naming them wastes effort. Learn to see the shape and most loops stop being decisions at all." },

  { tbl: { t: "The six shapes",
    h: ["Shape", "The question it answers", "Ends with"],
    rows: [
     ["**Accumulate**", "What is the total / count / best of these?", "One value"],
     ["**Search**", "Is there one that matches, and which?", "One item, or nothing"],
     ["**Filter**", "Which of these qualify?", "A shorter collection"],
     ["**Transform**", "What does each look like after a change?", "A same-length collection"],
     ["**Group**", "How do these fall into buckets?", "A dict of lists or counts"],
     ["**Pairwise**", "How does each item relate to its neighbour?", "Differences, runs, comparisons"]
    ] } },

  { h: "1. Accumulate — fold many values into one" },
  { p: "The oldest pattern there is. Start with an **identity value**, walk the items, update the accumulator. Choosing the right identity is the entire skill: `0` for a sum, `1` for a product, `[]` for a collection, `-inf` for a maximum." },

  { code: { lang: "python", t: "The shape, then the shortcut",
    lines: [
     { c: "total = 0", w: "**The identity.** Adding nothing to zero leaves zero, which is what makes it correct for an empty list — you get `0`, not a crash." },
     { c: "for order in orders:", w: "" },
     { c: "    total += order.amount", w: "**The update.** Each pass folds one more value in." },
     { c: "", w: "" },
     { c: "total = sum(o.amount for o in orders)", w: "The same fold, expressed as one line. `sum` *is* the accumulate pattern with `0` baked in, and the generator means the amounts are never listed in memory.", hi: true },
     { c: "", w: "" },
     { c: "worst = min(losses, default=0.0)", w: "`min` and `max` are accumulators too. `default=` supplies the answer for an empty sequence — without it, an empty list raises `ValueError`, which is a real crash in a training loop on the epoch where a filter happened to remove everything." }
    ] } },

  { trap: "The empty-collection case is where accumulators break, and it is almost never in your test data. `sum([])` is `0` and `len([])` is `0` — so a mean written as `sum(xs) / len(xs)` raises `ZeroDivisionError` on an empty batch. In a nightly evaluation job that is a 3 a.m. page. Write it as `sum(xs) / len(xs) if xs else 0.0` and it is a non-event." },

  { h: "2. Search — stop the moment you know" },
  { p: "A search loop is defined by its exit, not its body. The one rule: **leave as soon as the answer is known**. Continuing to loop after you have found what you want is wasted work, and on a large collection it is the difference between milliseconds and minutes." },

  { code: { lang: "python", t: "Find the first failure in a batch",
    lines: [
     { c: "def first_invalid(records):", w: "" },
     { c: "    for r in records:", w: "" },
     { c: "        if not r.get(\"id\"):", w: "" },
     { c: "            return r", w: "**Return, not break.** Inside a function `return` is the cleanest early exit there is — it leaves the loop and hands back the answer in one move, and it escapes nested loops that `break` cannot.", hi: true },
     { c: "    return None", w: "Reached only when the loop ran out. `None` means *searched everything, found nothing* — the same job `for...else` does when you are not in a function." },
     { c: "", w: "" },
     { c: "bad = next((r for r in records if not r.get(\"id\")), None)", w: "The one-line form. `next()` on a generator pulls exactly one value and stops — the generator never evaluates the rest of the records. The second argument is the not-found default, and omitting it means `StopIteration` instead.", hi: true }
    ] } },

  { n: "`any()` and `all()` are search loops that answer yes/no, and they **short-circuit** — `any` stops at the first `True`, `all` at the first `False`. `any(r.failed for r in runs)` scans until it finds one failure and then stops. Writing that as `len([r for r in runs if r.failed]) > 0` builds an entire list first and checks every record even after the answer is settled.",
    nt: "any and all stop early" },

  { h: "3 and 4. Filter and transform" },
  { p: "These two are so common that Python has dedicated syntax for them, and the syntax is worth using because it states the shape in the first three words rather than making the reader infer it from a loop body." },

  { vs: { t: "Keep the ones that qualify, change each one", lang: "python",
    bad: { c: "clean = []\nfor row in rows:\n    if row.score is not None:\n        clean.append(row.score * 100)", label: "The loop",
      w: "Correct, and four lines whose shape you only learn by reading the body. The `append` is pure ceremony — it exists to build the list, not to express the idea." },
    good: { c: "clean = [row.score * 100\n         for row in rows\n         if row.score is not None]", label: "The comprehension",
      w: "Read it in the order it executes: **for** each row, **if** it qualifies, produce this. The transform sits at the front because it is the answer; the filter at the back because it is a condition. Same work, and the shape is visible before you read the details." } } },

  { p: "The rule for choosing: a comprehension is right when the body is one expression. The moment you need a `try`, several statements, or a nested condition that needs a name, write the loop out. A comprehension is not a badge of skill — an unreadable one is worse than the four-line loop it replaced." },

  { code: { lang: "python", t: "The four bracket forms, which people mix up constantly",
    lines: [
     { c: "[x * 2 for x in xs]", w: "**List** comprehension. Builds the whole list in memory. Use when you need it more than once, or need indexing." },
     { c: "{x * 2 for x in xs}", w: "**Set** comprehension. Same, minus duplicates. Curly brackets, single value." },
     { c: "{k: v for k, v in pairs}", w: "**Dict** comprehension. Curly brackets, but with a colon — that colon is the only thing distinguishing it from a set." },
     { c: "(x * 2 for x in xs)", w: "**Generator expression.** Round brackets. Builds nothing — computes on demand, one value at a time. This is the one that scales, and the one that can only be consumed once.", hi: true }
    ],
    after: "When passing straight to a consumer, the brackets are optional: `sum(x * 2 for x in xs)` is a generator expression with no wasted intermediate list." } },

  { h: "5. Group — bucket items by a key" },
  { p: "Turning a flat list into a dict of buckets is the most common real data task there is, and the hand-written version has a well-known wart: checking whether the key exists before appending to it." },

  { vs: { t: "Group log lines by level", lang: "python",
    bad: { c: "buckets = {}\nfor line in lines:\n    lvl = line.level\n    if lvl not in buckets:\n        buckets[lvl] = []\n    buckets[lvl].append(line)", label: "Check-then-insert",
      w: "The two lines in the middle exist only to handle the first time a key is seen. Forgetting them is a `KeyError` on the very first line of input." },
    good: { c: "from collections import defaultdict\n\nbuckets = defaultdict(list)\nfor line in lines:\n    buckets[line.level].append(line)", label: "defaultdict",
      w: "`defaultdict(list)` creates an empty list automatically the first time any key is touched. The loop body is now the one line that does the actual work, and the first-time case cannot be forgotten because it no longer exists." } } },

  { code: { lang: "python", t: "Counting is grouping with a number instead of a list",
    lines: [
     { c: "from collections import Counter", w: "" },
     { c: "", w: "" },
     { c: "counts = Counter(line.level for line in lines)", w: "A whole accumulate-into-a-dict loop, replaced. `Counter` takes any iterable and tallies it." },
     { c: "print(counts[\"ERROR\"])", w: "A missing key returns `0` rather than raising — exactly right for counts." },
     { c: "print(counts.most_common(3))", w: "The three most frequent, already sorted. Writing this by hand is a sort with a key function; here it is a method call.", hi: true }
    ],
    out: "128\n[('INFO', 8402), ('WARN', 311), ('ERROR', 128)]",
    after: "`Counter` shows up constantly in AI work: class balance in a training set, token frequency in a corpus, which error code dominates an eval run." } },

  { h: "6. Pairwise — compare each item with its neighbour" },
  { p: "The underrated one. Any question about *change*, *runs*, *gaps* or *ordering* is a pairwise loop, and the naive index version is where off-by-one errors live." },

  { code: { lang: "python", t: "Detecting gaps in a sequence of timestamps",
    lines: [
     { c: "from itertools import pairwise", w: "Python 3.10+. Before that: `zip(xs, xs[1:])`, which does the same thing and copies the tail." },
     { c: "", w: "" },
     { c: "for earlier, later in pairwise(timestamps):", w: "Yields `(t0,t1)`, `(t1,t2)`, `(t2,t3)`… Each item appears twice — once as the right half of a pair, once as the left half of the next. **n items give n-1 pairs**, which is the off-by-one you no longer have to get right by hand.", hi: true },
     { c: "    gap = later - earlier", w: "" },
     { c: "    if gap > timedelta(minutes=5):", w: "" },
     { c: "        print(f\"gap of {gap} after {earlier}\")", w: "" }
    ],
    after: "Written with indices this is `for i in range(len(ts) - 1):` and then `ts[i]` and `ts[i+1]` — and the `- 1` is the part everyone forgets, producing an `IndexError` on the final pass." } },

  { tryit: { t: "Name the shape, then write it",
    task: "For a list of eval results, each a dict with `model`, `score` and `passed`: produce the average score per model, but only counting the runs that passed. Say which shapes you are combining before you write a line.",
    hint: "It is a filter, then a group, then an accumulate per bucket. `defaultdict(list)` collects the scores; a dict comprehension does the averaging.",
    sol: { lang: "python", code: "from collections import defaultdict\n\nscores = defaultdict(list)\n\nfor r in results:              # group...\n    if not r[\"passed\"]:        # ...after filtering\n        continue\n    scores[r[\"model\"]].append(r[\"score\"])\n\n# accumulate each bucket into one number\naverages = {\n    model: sum(vals) / len(vals)\n    for model, vals in scores.items()\n    if vals\n}" },
    w: "Three shapes, each visible: a `continue` guard for the filter, a `defaultdict` for the group, a dict comprehension for the per-bucket accumulate. The `if vals` guard means a model whose runs all failed is left out rather than dividing by zero." } }
 ],
 k: [
  "Almost every loop is accumulate, search, filter, transform, group or pairwise.",
  "Accumulators need a correct identity value — and an answer for the empty case.",
  "Search loops must exit the instant the answer is known; `any`/`all`/`next` do it for you.",
  "`defaultdict` and `Counter` delete the first-time-seen bookkeeping from grouping loops.",
  "`pairwise` handles the n-1 off-by-one that hand-written neighbour loops get wrong."
 ],
 r: ["Loop", "Iteration", "Hash Table", "Time Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "total = sum(o.amount for o in orders)", w: "accumulate without building a list" },
   { c: "next((r for r in rows if r.bad), None)", w: "find the first match, or None" },
   { c: "buckets = defaultdict(list)", w: "a dict that creates empty lists on demand" },
   { c: "counts = Counter(x.level for x in lines)", w: "tally an iterable in one call" },
   { c: "for a, b in pairwise(values):", w: "walk each item beside its neighbour" }
  ]
 }
}
,

/* ==================================================================== */
{
 t: "Two Pointers and the Sliding Window",
 m: "loops",
 lvl: "intermediate",
 s: "The loop shapes that turn an O(n squared) brute force into O(n) — and the reason interviewers keep asking about them.",
 goal: [
  "Recognise the nested loop that a two-pointer walk can replace",
  "Write a fixed and a variable sliding window without off-by-one errors",
  "Say out loud why the window version is linear even though it looks nested"
 ],
 b: [
  { p: "These are not exotic algorithms — they are two loop *layouts*, and both exist for the same reason: a nested loop re-reads data it has already read. If you can arrange for each item to be visited a constant number of times instead of once per other item, quadratic work collapses to linear. That is the whole idea, and it is worth real money on large inputs." },

  { dg: "complexity-growth" },

  { h: "Why nested loops hurt" },
  { p: "A loop inside a loop over the same collection touches roughly n squared pairs. At n = 1,000 that is a million operations and nobody notices. At n = 1,000,000 it is a trillion, and the job does not finish today. The jump is not gradual — it is the difference between *works* and *does not work*." },

  { h: "Two pointers — walk inward from both ends" },
  { p: "Applies when the data is **sorted** or when the ends are meaningfully related. Two indices start at opposite ends and move towards each other; each step rules out a whole set of possibilities without checking them." },

  { vs: { t: "Do two numbers in this sorted list add to the target?", lang: "python",
    bad: { c: "for i in range(len(nums)):\n    for j in range(i + 1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return (nums[i], nums[j])\nreturn None", label: "Brute force, O(n squared)",
      w: "Checks every pair. Correct and honest, and on a million-element list it performs roughly 500 billion additions." },
    good: { c: "lo, hi = 0, len(nums) - 1\n\nwhile lo < hi:\n    s = nums[lo] + nums[hi]\n    if s == target:\n        return (nums[lo], nums[hi])\n    if s < target:\n        lo += 1\n    else:\n        hi -= 1\nreturn None", label: "Two pointers, O(n)",
      w: "Each pass moves one pointer, so the two indices between them cover the list once. A million elements is a million steps." } } },

  { code: { lang: "python", t: "The reasoning that makes it correct",
    lines: [
     { c: "lo, hi = 0, len(nums) - 1", w: "**Setup.** Smallest value on the left, largest on the right. This only works because the list is sorted — that is the precondition the whole method rests on." },
     { c: "while lo < hi:", w: "**The check.** Strictly less than: when they meet there is no pair left to form, and `lo == hi` would be pairing an element with itself." },
     { c: "    s = nums[lo] + nums[hi]", w: "" },
     { c: "    if s < target:", w: "The sum is too small. `nums[lo]` is the smallest value available — paired with the largest it still falls short, so **it cannot work with any remaining partner**." },
     { c: "        lo += 1", w: "So discard it. This single step eliminates every pair involving `nums[lo]` — that is the work being skipped, and why the method is linear.", hi: true },
     { c: "    else:", w: "The sum is too large, so `nums[hi]` is too big for every remaining partner." },
     { c: "        hi -= 1", w: "Discard it from the other end. Every step provably removes one element from consideration and never removes a valid answer." }
    ],
    after: "Being able to say that last sentence out loud is the point of the exercise. An interviewer is checking whether you know *why* the pointer moves, not whether you memorised the shape." } },

  { h: "Sliding window — a range that grows and shrinks" },
  { p: "The window is a contiguous run, held by two indices. The right edge moves forward to take in new data; the left edge moves forward to give up data you no longer want. Each index only ever moves right, so both together do at most 2n moves." },

  { code: { lang: "python", file: "window.py", t: "Fixed window: the moving average of a metric",
    lines: [
     { c: "def moving_average(values, k):", w: "" },
     { c: "    if len(values) < k:", w: "The guard that stops the whole thing being wrong on short input." },
     { c: "        return []", w: "" },
     { c: "", w: "" },
     { c: "    window = sum(values[:k])", w: "**Prime the window** with the first k values — one sum, done once." },
     { c: "    out = [window / k]", w: "" },
     { c: "", w: "" },
     { c: "    for i in range(k, len(values)):", w: "Start at k, because the first window is already computed." },
     { c: "        window += values[i] - values[i - k]", w: "**The whole trick.** Add the value entering on the right, subtract the one leaving on the left. Two operations per step regardless of how wide the window is — a 10,000-wide window costs the same per step as a 3-wide one.", hi: true },
     { c: "        out.append(window / k)", w: "" },
     { c: "    return out", w: "" }
    ],
    out: "[2.0, 3.0, 4.0, 5.0]",
    after: "The naive version recomputes `sum(values[i:i+k])` on every step, which is O(n * k). This is O(n). For a dashboard smoothing a metric over a 60-point window, that is 60x less work." } },

  { p: "The **variable** window is the harder and more useful one: the right edge always advances, and the left edge advances only while some condition is violated. That inner `while` is what makes people call it quadratic, and they are wrong." },

  { code: { lang: "python", t: "Longest run with no repeated item",
    lines: [
     { c: "def longest_unique(items):", w: "" },
     { c: "    seen = {}", w: "Item to its most recent position. A dict makes the membership check O(1) — using a list here would reintroduce the quadratic cost you are trying to avoid." },
     { c: "    left = 0", w: "The left edge of the window." },
     { c: "    best = 0", w: "The accumulator." },
     { c: "", w: "" },
     { c: "    for right, item in enumerate(items):", w: "The right edge advances exactly once per item, always." },
     { c: "        if item in seen and seen[item] >= left:", w: "A duplicate, **and it is inside the current window**. The second half matters: an older occurrence that the left edge already passed is not a conflict.", hi: true },
     { c: "            left = seen[item] + 1", w: "Jump the left edge past the previous occurrence. The window shrinks from the left by exactly enough to become valid again." },
     { c: "        seen[item] = right", w: "Record where this item now lives." },
     { c: "        best = max(best, right - left + 1)", w: "Current width is `right - left + 1` — the `+ 1` because both edges are inclusive. This is the off-by-one to burn into memory." },
     { c: "    return best", w: "" }
    ],
    out: "3" } },

  { n: "It looks nested but it is linear. `left` never decreases and never exceeds `right`, so across the entire run it advances at most n times in total — not n times per outer step. The correct way to count a loop's cost is *how many times does each index move over the whole run*, not *how many loops are written*. Saying that clearly in an interview is worth more than the code itself.",
    nt: "Why the inner while is free" },

  { trap: "Sliding windows are only valid on **contiguous** runs. If the question says *subsequence* rather than *substring* or *subarray*, items can be skipped, the window model does not apply, and the answer is usually dynamic programming. Reading that one word correctly decides whether your approach can work at all." },

  { h: "Where these actually appear at work" },
  { l: [
   "**Rate limiting** — how many requests from this key in the last 60 seconds is a sliding window over timestamps, with the left edge dropping anything too old.",
   "**Token budgets** — trimming a chat history to fit a context limit is a window that shrinks from the left until the total fits.",
   "**Chunking documents for RAG** — overlapping text chunks are a fixed window with a stride smaller than the width, so adjacent chunks share context.",
   "**Streaming metrics** — p95 latency over the last five minutes, computed without re-reading the whole stream.",
   "**Deduplication in a stream** — has this id been seen recently keeps a window rather than an unbounded set."
  ] },

  { tryit: { t: "Trim a chat history to a token budget",
    task: "Given `messages`, each with a `tokens` count, keep the **most recent** run of messages whose total stays within `budget`. Return them oldest-first. This is a real function in every chat application.",
    hint: "Walk backwards from the newest, accumulating until adding the next message would exceed the budget — then reverse. Or slide a window from the left, dropping from the front while the total is too large.",
    sol: { lang: "python", code: "def fit_budget(messages, budget):\n    total = 0\n    left = 0\n\n    for right, m in enumerate(messages):\n        total += m[\"tokens\"]\n\n        # shrink from the left until we are back inside budget\n        while total > budget and left <= right:\n            total -= messages[left][\"tokens\"]\n            left += 1\n\n    return messages[left:]\n\n# The window ends anchored to the newest message, and left has\n# advanced past everything that no longer fits. Both indices only\n# ever move right, so this is O(n) over the history." },
    w: "Note the `left <= right` guard: a single message larger than the entire budget would otherwise walk `left` past the end. Real inputs contain that case — a user pastes a large document — and it is exactly the sort of edge that gets found in production rather than in tests." } }
 ],
 k: [
  "Nested loops over one collection are quadratic; two pointers and windows make them linear.",
  "Two pointers need sorted or otherwise ordered data — that precondition is not optional.",
  "A window's cost is how far each index travels in total, not how many loops are written.",
  "Window width with inclusive edges is `right - left + 1`. That `+ 1` is the classic error.",
  "Windows only work on contiguous runs — *subsequence* means the model does not apply."
 ],
 r: ["Time Complexity", "Big O Notation", "Array", "Hash Table"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "lo, hi = 0, len(nums) - 1", w: "set up two pointers at both ends" },
   { c: "while lo < hi:", w: "walk them inward until they meet" },
   { c: "window += values[i] - values[i - k]", w: "slide a fixed window in constant time" },
   { c: "while total > budget and left <= right:", w: "shrink a variable window until it is valid" },
   { c: "best = max(best, right - left + 1)", w: "record the widest window seen so far" }
  ]
 }
}
,

/* ==================================================================== */
{
 t: "The Underrated Loops",
 m: "loops",
 lvl: "intermediate",
 s: "itertools, the walrus, zip(strict=True) and the chunking loop — the ones that are not obscure, just under-taught.",
 goal: [
  "Replace a hand-written loop with the itertools function that already does it",
  "Write the read-until-sentinel loop with the walrus operator",
  "Know why `zip` silently truncating is a data bug waiting to happen"
 ],
 b: [
  { p: "Everything here is standard library, none of it is clever, and most Python developers reach the third year of their career without meeting half of it. The reason to learn it is not elegance — it is that each of these replaces a loop that people reliably write with a bug in it." },

  { h: "zip — walk several sequences in step" },
  { p: "Pairs up items by position and stops at the shortest input. That stopping behaviour is the useful default and the dangerous one." },

  { code: { lang: "python", t: "The silent truncation",
    lines: [
     { c: "names  = [\"a\", \"b\", \"c\"]", w: "" },
     { c: "scores = [1, 2]", w: "One short — perhaps a row was dropped upstream." },
     { c: "", w: "" },
     { c: "print(list(zip(names, scores)))", w: "`[('a', 1), ('b', 2)]`. `c` vanishes. **No error, no warning.** Your report is quietly missing a row and everything downstream looks fine." },
     { c: "", w: "" },
     { c: "print(list(zip(names, scores, strict=True)))", w: "Python 3.10+. Raises `ValueError` because the lengths differ. When the sequences *should* be the same length, this converts a silent data-loss bug into a loud failure at the exact line responsible.", hi: true },
     { c: "", w: "" },
     { c: "from itertools import zip_longest", w: "" },
     { c: "print(list(zip_longest(names, scores, fillvalue=0)))", w: "`[('a',1), ('b',2), ('c',0)]`. When the lengths legitimately differ and you want to pad instead." }
    ] } },

  { n: "Use `strict=True` whenever the inputs are supposed to correspond — predictions against labels, features against column names, ids against embeddings. A model evaluated on misaligned predictions and labels produces a plausible-looking accuracy number that is completely meaningless, and nothing in the run will tell you.",
    nt: "Alignment bugs do not announce themselves" },

  { h: "enumerate with a start" },
  { code: { lang: "python", t: "Two arguments, and the second is forgotten",
    lines: [
     { c: "for i, line in enumerate(lines, start=1):", w: "`start=1` means line numbers read the way humans count. Error messages that say *line 1* for the first line rather than *line 0* stop being a small daily annoyance.", hi: true },
     { c: "    if not line.strip():", w: "" },
     { c: "        print(f\"blank line at {i}\")", w: "" }
    ] } },

  { h: "The walrus operator — assign inside the condition" },
  { p: "`:=` assigns a value **and** evaluates to it, which is exactly what the read-until-exhausted loop needs. Before it existed, that loop had to be written with a duplicated read or a `while True` with a `break` in the middle." },

  { vs: { t: "Read fixed-size chunks until the file ends", lang: "python",
    bad: { c: "chunk = f.read(8192)\nwhile chunk:\n    process(chunk)\n    chunk = f.read(8192)", label: "The duplicated read",
      w: "The read appears twice, once before the loop and once at the bottom. Change the size in one place and forget the other and you have a bug that only shows on large files." },
    good: { c: "while chunk := f.read(8192):\n    process(chunk)", label: "With the walrus",
      w: "Read, assign to `chunk`, and test it — in one expression. There is exactly one read, so there is nothing to keep in sync. When the file ends, `read` returns an empty string, which is falsy, and the loop stops." } } },

  { p: "The same shape covers every *keep going until it gives you nothing* case: `while (row := cursor.fetchone()) is not None`, `while (job := queue.pop()) is not None`, reading a socket, draining a paginated API." },

  { trap: "Do not use `while chunk := f.read(n)` when a legitimate value can be falsy. `while (n := queue.get()) :` stops on a genuine `0`. Test against the sentinel explicitly — `is not None` — whenever `0`, `\"\"` or `[]` is real data. This is the same truthiness trap as `if not x` versus `if x is None`, and it is quieter here because the loop simply ends early rather than crashing." },

  { h: "itertools — the loops already written for you" },
  { p: "A standard-library module of iterator building blocks. All of them are lazy, so they compose into pipelines that stream rather than materialise." },

  { tbl: { t: "The ones worth knowing by name",
    h: ["Function", "What it does", "The loop it replaces"],
    rows: [
     ["`chain(a, b)`", "Treat several iterables as one continuous stream", "Two loops with duplicated bodies, or `a + b` which copies both"],
     ["`islice(it, n)`", "Take the first n from anything, lazily", "A manual counter with a `break`"],
     ["`groupby(it, key)`", "Group **consecutive** items sharing a key", "A previous-value variable and a run-boundary check"],
     ["`accumulate(it)`", "Running totals — every partial sum", "A loop appending `total` on each pass"],
     ["`product(a, b)`", "Every combination of several iterables", "Nested for loops, one per dimension"],
     ["`combinations(it, r)`", "Every unordered subset of size r", "Nested loops with fiddly index bounds"],
     ["`cycle(it)`", "Repeat forever", "An index with `% len(items)`"],
     ["`repeat(x, n)`", "The same value n times", "A range loop that ignores its variable"]
    ] } },

  { code: { lang: "python", t: "A hyperparameter sweep, without four nested loops",
    lines: [
     { c: "from itertools import product", w: "" },
     { c: "", w: "" },
     { c: "grid = product([1e-3, 1e-4], [16, 32, 64], [\"adam\", \"sgd\"])", w: "Every combination: 2 x 3 x 2 = 12 configurations. Lazy — nothing is built until you loop." },
     { c: "", w: "" },
     { c: "for lr, batch, opt in grid:", w: "One flat loop instead of three nested ones. Adding a fourth hyperparameter is one more argument, not one more level of indentation.", hi: true },
     { c: "    run(lr=lr, batch_size=batch, optimizer=opt)", w: "" }
    ],
    after: "This is a grid search, exactly. Recognising that a grid search *is* a Cartesian product is the kind of naming that makes the code write itself." } },

  { code: { lang: "python", t: "accumulate and islice in a pipeline",
    lines: [
     { c: "from itertools import accumulate, islice, chain", w: "" },
     { c: "", w: "" },
     { c: "running = accumulate(daily_costs)", w: "Cumulative spend, one value per day. Lazy — no list yet." },
     { c: "over = (i for i, tot in enumerate(running) if tot > 1000)", w: "The index of the first day the budget is blown. Still lazy." },
     { c: "print(next(over, None))", w: "Pull exactly one value. Only as much of `daily_costs` is consumed as needed to answer — if it blows on day 3, days 4 onwards are never touched.", hi: true },
     { c: "", w: "" },
     { c: "sample = list(islice(chain(train, val, test), 5))", w: "First five rows across three datasets treated as one stream, without concatenating them in memory. `chain` joins, `islice` takes, `list` is the only step that allocates." }
    ] } },

  { h: "Chunking — the loop everyone rewrites badly" },
  { p: "Processing a long stream in batches is universal: API calls with a request limit, database inserts, GPU batches, embedding requests. The hand-rolled version is where the last-partial-batch bug lives." },

  { code: { lang: "python", file: "chunk.py", t: "Three ways, in order of preference",
    lines: [
     { c: "from itertools import batched", w: "Python 3.12+. If you have it, this is the answer." },
     { c: "for group in batched(records, 100):", w: "Yields tuples of up to 100. The final one is short, and that is handled for you.", hi: true },
     { c: "    api.send(list(group))", w: "" },
     { c: "", w: "" },
     { c: "for i in range(0, len(records), 100):", w: "The list-only version, for any Python. The third argument to `range` is the **step**." },
     { c: "    api.send(records[i:i + 100])", w: "Slicing past the end is not an error in Python — the last slice is simply short. This is why the version below fails and this one does not." },
     { c: "", w: "" },
     { c: "def chunks(it, n):", w: "The general version: works on a generator, where `len()` and slicing are unavailable — a database cursor, a streamed file." },
     { c: "    it = iter(it)", w: "Get one cursor and keep pulling from it. Without this line the `islice` below would restart from the beginning every time and loop forever." },
     { c: "    while batch := list(islice(it, n)):", w: "Pull n, or fewer if the stream is ending. An empty list is falsy, which is the exit condition.", hi: true },
     { c: "        yield batch", w: "" }
    ] } },

  { trap: "The bug in every hand-written chunker is the final partial batch. Written as `while i + n <= len(items)`, the last few items are silently dropped — 1,003 records become 1,000 embedded and 3 lost, and the only symptom is a slightly incomplete index that nobody notices for a month. Always test a chunker with a length that is *not* a multiple of the batch size." },

  { tryit: { t: "Group consecutive runs",
    task: "Given a list of per-minute service statuses like `[\"up\",\"up\",\"down\",\"down\",\"down\",\"up\"]`, produce the outage runs: each status with how many minutes it lasted, in order. This is what an uptime timeline is built from.",
    hint: "`itertools.groupby` groups **consecutive** equal items, which is exactly what a run is. It yields `(key, group)` and the group is a one-shot iterator.",
    sol: { lang: "python", code: "from itertools import groupby\n\nstatuses = [\"up\", \"up\", \"down\", \"down\", \"down\", \"up\"]\n\nruns = [(status, len(list(group)))\n        for status, group in groupby(statuses)]\n\nprint(runs)\n# [('up', 2), ('down', 3), ('up', 1)]\n\n# len(list(group)) rather than len(group): the group is a lazy\n# iterator, and it is invalidated as soon as you advance to the\n# next one -- so consume it before moving on." },
    w: "The consecutive-only behaviour is the part people get wrong: `groupby` does **not** collect all `down` entries scattered through the list, only adjacent ones. For that you would sort first — or reach for `defaultdict`. Here, consecutive is precisely what a run means, so it is the right tool." } }
 ],
 k: [
  "`zip` truncates to the shortest input silently — use `strict=True` when lengths must match.",
  "`while x := read()` writes the read-until-empty loop once instead of twice.",
  "Guard the walrus with `is not None` whenever `0` or `\"\"` is legitimate data.",
  "`product` is a grid search; `groupby` is consecutive runs; `accumulate` is a running total.",
  "Every chunker must be tested on a length that is not a multiple of the batch size."
 ],
 r: ["Iterator", "Batch Processing", "Iteration", "Memory Management"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "for a, b in zip(xs, ys, strict=True):", w: "walk two sequences that must be the same length" },
   { c: "while chunk := f.read(8192):", w: "read until the source is empty, with one read" },
   { c: "for lr, bs in product(rates, sizes):", w: "flatten a grid search into one loop" },
   { c: "for group in batched(records, 100):", w: "process a stream in batches of a hundred" },
   { c: "[(k, len(list(g))) for k, g in groupby(xs)]", w: "collapse consecutive equal items into runs" }
  ]
 }
}
,

/* ==================================================================== */
{
 t: "How Loops Actually Break",
 m: "loops",
 lvl: "intermediate",
 s: "Mutating while iterating, the late-binding closure, aliasing, and the infinite loop that only happens in production.",
 goal: [
  "Never modify a collection you are currently looping over",
  "Explain why a loop that builds functions captures the wrong value",
  "Write a retry loop that is guaranteed to terminate"
 ],
 b: [
  { p: "The loop bugs that cost real time are not syntax errors. They are loops that run, finish, and produce a wrong answer confidently. Each one below has a specific mechanism, and once you know the mechanism you spot it in review rather than in production." },

  { h: "1. Mutating a collection while iterating it" },
  { p: "The iterator holds a position. Removing an item shifts everything after it down by one, and the position does not shift with it — so the loop skips an element without ever knowing." },

  { code: { lang: "python", t: "The skip, step by step",
    lines: [
     { c: "nums = [1, 2, 2, 3]", w: "" },
     { c: "for n in nums:", w: "" },
     { c: "    if n == 2:", w: "" },
     { c: "        nums.remove(n)", w: "Removing from the list you are walking." },
     { c: "print(nums)", w: "`[1, 2, 3]`. One `2` survives. **No error was raised.**", hi: true }
    ],
    out: "[1, 2, 3]",
    after: "Trace it: at index 1 the cursor sees the first 2 and removes it, so the list becomes [1,2,3] and the second 2 slides down into index 1. The cursor then advances to index 2, which now holds 3. The second 2 was never visited." } },

  { p: "With a dict or a set, Python catches this and raises `RuntimeError: dictionary changed size during iteration` — which is a kindness. Lists give no such warning, so the list version is the one that reaches production." },

  { vs: { t: "Removing items safely", lang: "python",
    bad: { c: "for item in items:\n    if item.expired:\n        items.remove(item)", label: "Mutating in place",
      w: "Skips items, and `remove` scans the list to find the value, which makes the whole thing quadratic on top of being wrong." },
    good: { c: "items = [i for i in items if not i.expired]", label: "Build a new one",
      w: "Builds a fresh list and rebinds the name. Nothing is mutated mid-walk, so nothing is skipped, and it is one linear pass. If other references to the original list must see the change, use `items[:] = [...]` to replace the contents in place instead of rebinding." } } },

  { n: "The rule is one line: **never change the size of a collection you are iterating over.** Either build a new one, or iterate over a copy with `for item in list(items):`. Changing a *value* inside an item is fine — it is adding and removing that moves the goalposts.",
    nt: "The rule" },

  { h: "2. The late-binding closure" },
  { p: "This one confuses everybody once, and the confusion is worth having early because it appears whenever you build callbacks, handlers or deferred tasks in a loop." },

  { code: { lang: "python", t: "Three functions that all do the same thing",
    lines: [
     { c: "fns = []", w: "" },
     { c: "for i in range(3):", w: "" },
     { c: "    fns.append(lambda: i)", w: "Each lambda captures the **variable** `i`, not its value at the time. There is one `i`, shared by all three.", hi: true },
     { c: "", w: "" },
     { c: "print([f() for f in fns])", w: "`[2, 2, 2]`. Not `[0, 1, 2]`. The functions run *after* the loop, when `i` has finished at 2, and all three read that same final value." },
     { c: "", w: "" },
     { c: "fns = [lambda i=i: i for i in range(3)]", w: "**The fix.** A default argument is evaluated once, when the function is defined, so each lambda gets its own copy of the current value.", hi: true },
     { c: "print([f() for f in fns])", w: "`[0, 1, 2]`. Correct." }
    ],
    out: "[2, 2, 2]\n[0, 1, 2]" } },

  { p: "The same bug in real form: registering event handlers in a loop and finding every button does what the last one should, or scheduling async tasks that all read the final config. `functools.partial(fn, value)` is the other standard fix and reads better than the default-argument trick when the function is not a lambda." },

  { h: "3. Aliasing — the same object in every slot" },
  { code: { lang: "python", t: "The multiplication trap",
    lines: [
     { c: "grid = [[0] * 3] * 3", w: "Looks like a 3x3 grid of zeros. It is **one** inner list, referenced three times.", hi: true },
     { c: "grid[0][0] = 9", w: "" },
     { c: "print(grid)", w: "`[[9,0,0],[9,0,0],[9,0,0]]`. All three rows changed, because all three names point at the same list." },
     { c: "", w: "" },
     { c: "grid = [[0] * 3 for _ in range(3)]", w: "**The fix.** The comprehension runs the inner expression once per row, producing three genuinely separate lists.", hi: true },
     { c: "grid[0][0] = 9", w: "" },
     { c: "print(grid)", w: "`[[9,0,0],[0,0,0],[0,0,0]]`. What you meant." }
    ],
    out: "[[9, 0, 0], [9, 0, 0], [9, 0, 0]]\n[[9, 0, 0], [0, 0, 0], [0, 0, 0]]" } },

  { p: "`[0] * 3` is safe because integers are immutable — you can never mutate one in place, only rebind. The outer `* 3` is the problem, and only when the element is mutable. The same trap sits in `dict.fromkeys(keys, [])`, where every key shares one list." },

  { h: "4. Loops that never end" },
  { p: "An infinite loop has exactly one cause: **nothing in the body changes what the condition tests**. In a `while` this is usually a forgotten increment. In production code it is more often a retry loop whose exit condition depends on something external that never becomes true." },

  { vs: { t: "Retrying a flaky API call", lang: "python",
    bad: { c: "while True:\n    try:\n        return call_api()\n    except TimeoutError:\n        time.sleep(1)", label: "Retry forever",
      w: "If the service is down rather than flaky, this loop runs until someone kills the process — holding a connection, a worker slot and a log file that grows all night. The condition never changes because nothing in the loop can change it." },
    good: { c: "delay = 1\nfor attempt in range(5):\n    try:\n        return call_api()\n    except TimeoutError:\n        if attempt == 4:\n            raise\n        time.sleep(delay)\n        delay *= 2", label: "Bounded, with backoff",
      w: "A `for` over a fixed range **cannot** run forever — the bound is structural, not something you must remember to maintain. The final attempt re-raises so the failure is visible rather than swallowed, and doubling the delay stops a struggling service being hammered by its own clients." } } },

  { n: "Prefer `for attempt in range(n)` over `while True` with a counter. The `for` version makes termination a property of the code's shape rather than of your discipline. Add jitter (`delay * random.uniform(0.5, 1.5)`) when many clients retry at once, or they all wake up together and the retry storm becomes the outage.",
    nt: "Make termination structural" },

  { h: "5. Off-by-one, precisely" },
  { tbl: { t: "The boundaries worth memorising",
    h: ["Expression", "Produces", "Note"],
    rows: [
     ["`range(5)`", "0 1 2 3 4", "Five values, never reaching 5"],
     ["`range(1, 5)`", "1 2 3 4", "Start inclusive, stop exclusive — always"],
     ["`range(len(xs) - 1)`", "every index except the last", "For loops that read `xs[i + 1]`"],
     ["`xs[a:b]`", "b − a items", "Same half-open rule as `range`"],
     ["`right - left + 1`", "inclusive window width", "The `+ 1` is the one people drop"],
     ["`n // 2`", "the lower middle", "Even n has no exact middle — decide which side you want"]
    ] } },
  { p: "The single rule underneath all of it: Python ranges and slices are **half-open** — the start is included, the stop is not. That is why `xs[:i] + xs[i:]` reconstructs the list with no gap and no duplicate, and it is why `range(len(xs))` is exactly the valid indices." },

  { tryit: { t: "Find all four bugs",
    task: "This function is meant to remove failed runs, then build one summary function per remaining model. It has four separate bugs from this lesson. Find each and say what it produces instead.",
    hint: "Look for: mutation during iteration, a shared mutable default, late binding, and an unbounded loop.",
    sol: { lang: "python", code: "# BEFORE -- four bugs\ndef summarise(runs):\n    for r in runs:\n        if r[\"failed\"]:\n            runs.remove(r)          # 1. mutating while iterating\n\n    table = dict.fromkeys(MODELS, [])  # 2. every key shares ONE list\n    for r in runs:\n        table[r[\"model\"]].append(r)\n\n    fns = []\n    for m in MODELS:\n        fns.append(lambda: table[m])   # 3. late binding -- all read the last m\n\n    while not done:                    # 4. nothing in the body sets done\n        poll()\n    return fns\n\n\n# AFTER\ndef summarise(runs):\n    runs = [r for r in runs if not r[\"failed\"]]      # 1. new list\n\n    table = {m: [] for m in MODELS}                  # 2. one list per key\n    for r in runs:\n        table[r[\"model\"]].append(r)\n\n    fns = [lambda m=m: table[m] for m in MODELS]     # 3. bind per iteration\n\n    for _ in range(30):                              # 4. bounded\n        if done():\n            break\n        poll()\n    else:\n        raise TimeoutError(\"never finished\")\n    return fns" },
    w: "Each fix is small, and each bug is silent — the original runs to completion and returns a plausible-looking result. That is what makes this class of bug expensive: there is no stack trace pointing at the line." } }
 ],
 k: [
  "Never add to or remove from a collection you are iterating — build a new one.",
  "Closures capture the variable, not its value; bind per iteration with a default argument.",
  "`[[0] * 3] * 3` shares one inner list. Use a comprehension for independent rows.",
  "A `for` over a fixed range cannot hang; a `while True` retry loop can and eventually will.",
  "Python ranges and slices are half-open: start included, stop excluded, every time."
 ],
 r: ["Closure", "Pass by Value vs Reference", "Idempotency"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "items = [i for i in items if not i.expired]", w: "remove items without mutating during iteration" },
   { c: "fns = [lambda i=i: i for i in range(3)]", w: "capture the value, not the variable" },
   { c: "grid = [[0] * 3 for _ in range(3)]", w: "build rows that are genuinely independent" },
   { c: "for attempt in range(5):", w: "a retry loop that cannot run forever" },
   { c: "delay *= 2", w: "exponential backoff between attempts" }
  ]
 }
}
,

/* ==================================================================== */
{
 t: "The Loops an AI Engineer Is Expected to Know",
 m: "loops",
 lvl: "advanced",
 s: "The training loop, the batching loop, the retry loop and the agent loop — plus the one loop you must never write in NumPy.",
 goal: [
  "Write a training loop from memory and say what each line is for",
  "Explain why a Python loop over an array is 100x slower than the vectorised form",
  "Recognise the agent loop as an ordinary while loop with a termination problem"
 ],
 b: [
  { p: "Four loops carry most of the work in applied AI. None is conceptually harder than what came earlier — they are the same six shapes wearing domain clothing. What makes them worth a lesson is that each has a specific failure mode interviewers probe for, and each is a place where a beginner's version silently costs money." },

  { h: "1. The training loop" },
  { p: "Two nested loops: epochs on the outside, batches on the inside. Being able to write this from memory, and say what every line does, is a standard screening question for any ML or AI engineering role." },

  { code: { lang: "python", file: "train.py", t: "The canonical PyTorch loop",
    lines: [
     { c: "for epoch in range(num_epochs):", w: "**Outer loop: one pass over the whole dataset per epoch.** More epochs means more chances to learn and more chance of memorising the training set instead." },
     { c: "    model.train()", w: "Switches layers like dropout and batch-norm into training behaviour. Forgetting it means dropout stays off and your training silently loses its regularisation." },
     { c: "", w: "" },
     { c: "    for batch in train_loader:", w: "**Inner loop: one step per batch.** `DataLoader` is an iterable that yields batches — the iterator protocol from lesson one, which is why data can stream from disk rather than sitting in RAM.", hi: true },
     { c: "        optimizer.zero_grad()", w: "Clear the gradients from the previous step. PyTorch **accumulates** gradients by default, so omitting this sums every batch's gradients together and the model updates on nonsense. This is the single most common training-loop bug." },
     { c: "        out = model(batch.x)", w: "**Forward pass.** Compute predictions." },
     { c: "        loss = criterion(out, batch.y)", w: "How wrong those predictions are — one number." },
     { c: "        loss.backward()", w: "**Backward pass.** Walks the computation graph and computes the gradient of the loss with respect to every parameter." },
     { c: "        optimizer.step()", w: "Nudge every parameter down its gradient. This line, and only this line, changes the model." },
     { c: "", w: "" },
     { c: "    model.eval()", w: "Switch to inference behaviour for validation." },
     { c: "    with torch.no_grad():", w: "Stop recording operations for gradients. Validation does not learn, so the graph is pure waste — this saves memory and time, and its absence is why validation sometimes runs out of GPU memory.", hi: true },
     { c: "        val_loss = evaluate(model, val_loader)", w: "" },
     { c: "", w: "" },
     { c: "    if val_loss > best:", w: "**Early stopping**, an accumulate-and-compare over epochs." },
     { c: "        patience -= 1", w: "" },
     { c: "        if patience == 0:", w: "" },
     { c: "            break", w: "Leave the outer loop. Validation loss rising while training loss falls is the definition of overfitting, and stopping is how you respond to it." }
    ],
    after: "Five lines do the learning — zero_grad, forward, loss, backward, step — and they must appear in that order. Everything else is bookkeeping around them." } },

  { trap: "`optimizer.zero_grad()` and `torch.no_grad()` sound alike and do unrelated things. The first clears accumulated gradients before a step. The second stops gradients being tracked at all, for code that will never call `backward()`. Mixing them up gives you either a model that trains on garbage or a validation pass that exhausts your GPU memory." },

  { h: "2. The loop you must not write" },
  { p: "Python's loop overhead is real: each pass allocates objects, checks types and dispatches methods. Over a million elements that overhead dwarfs the arithmetic itself. NumPy pushes the loop down into compiled C, where it costs almost nothing." },

  { vs: { t: "Normalising a million values", lang: "python",
    bad: { c: "out = []\nfor x in data:\n    out.append((x - mean) / std)", label: "Python loop -- about 400 ms",
      w: "A million interpreter iterations. Each one boxes a float, dispatches `__sub__` and `__truediv__`, and appends with a possible reallocation. The arithmetic is a rounding error next to the overhead." },
    good: { c: "out = (data - mean) / std", label: "Vectorised -- about 4 ms",
      w: "The same loop, executed inside NumPy's compiled code over a contiguous block of memory, using SIMD instructions that handle several values per CPU cycle. Roughly 100x faster, and it is also the shorter, clearer line." } } },

  { n: "The rule for array code: **if you are writing a `for` loop over a NumPy array or a pandas column, stop and look for the vectorised form.** `df.apply()` is a loop in disguise and is nearly as slow. Reach instead for arithmetic on whole columns, boolean masks, `np.where`, and `groupby().agg()`. The exception is genuinely sequential work where each step depends on the last — but check first, because most things that look sequential are not.",
    nt: "The one rule for array code" },

  { h: "3. The batching loop" },
  { p: "Every external service has a request limit, and every GPU has a memory limit. Batching is the chunking loop from the previous lesson with retries and cost attached — and getting it wrong means either a rate-limit ban or a bill you did not expect." },

  { code: { lang: "python", file: "embed.py", t: "Embedding a corpus, done properly",
    lines: [
     { c: "def embed_all(texts, size=64):", w: "" },
     { c: "    out = []", w: "The accumulator." },
     { c: "", w: "" },
     { c: "    for i in range(0, len(texts), size):", w: "The chunking loop. The last batch is short and slicing handles that without a special case." },
     { c: "        batch = texts[i:i + size]", w: "" },
     { c: "", w: "" },
     { c: "        for attempt in range(5):", w: "**A bounded retry around each batch**, not around the whole job. One transient failure at batch 900 should not discard 899 successful batches.", hi: true },
     { c: "            try:", w: "" },
     { c: "                out.extend(client.embed(batch))", w: "`extend`, not `append` — you want the vectors flattened into one list, not a list of lists. Getting this wrong gives a nested structure that breaks downstream with a confusing shape error." },
     { c: "                break", w: "Success: leave the retry loop and move to the next batch." },
     { c: "            except RateLimitError:", w: "" },
     { c: "                time.sleep(2 ** attempt)", w: "Exponential backoff: 1, 2, 4, 8 seconds. Retrying immediately makes a rate limit worse." },
     { c: "        else:", w: "`for...else` — reached only when all five attempts were used without a `break`.", hi: true },
     { c: "            raise RuntimeError(f\"batch at {i} failed\")", w: "Fail loudly, naming the position so the job can be resumed rather than restarted." },
     { c: "    return out", w: "" }
    ],
    after: "Chunking, bounded retry, backoff and for...else, in twelve lines. Every construct here appeared earlier in this module — this is just where they all show up at once." } },

  { p: "Two additions once this is running for real: **checkpointing** (write results to disk every N batches so a crash at batch 900 does not repay 900 batches of API cost), and **idempotency** (skip inputs already embedded, so a resumed job does not pay twice for the same text)." },

  { h: "4. The agent loop" },
  { p: "The loop at the centre of every tool-using AI system. Strip the vocabulary away and it is a `while` loop whose termination condition is decided by a model — which is exactly what makes it dangerous." },

  { dg: "agent-loop" },

  { code: { lang: "python", file: "agent.py", t: "The whole pattern",
    lines: [
     { c: "messages = [{\"role\": \"user\", \"content\": task}]", w: "The accumulator — and here it is the conversation itself, growing every pass." },
     { c: "", w: "" },
     { c: "for step in range(MAX_STEPS):", w: "**Bounded, deliberately.** A `while not done` here hands the stopping decision entirely to the model. A confused model that never says it is finished will loop until the budget is gone, and this is a real, common, expensive failure.", hi: true },
     { c: "    reply = model.chat(messages, tools=TOOLS)", w: "Ask the model what to do next, given everything so far." },
     { c: "    messages.append(reply)", w: "Record it — the model's memory is only what is in this list." },
     { c: "", w: "" },
     { c: "    if not reply.tool_calls:", w: "**The exit condition.** No tool requested means the model believes it is done." },
     { c: "        return reply.content", w: "" },
     { c: "", w: "" },
     { c: "    for call in reply.tool_calls:", w: "An inner loop: several tools may be requested in one turn." },
     { c: "        result = TOOLS[call.name](**call.args)", w: "Run the tool. Everything the model can affect in the world happens on this line, which is why it is the line that needs validation and permissions." },
     { c: "        messages.append(tool_msg(call.id, result))", w: "Feed the result back. The next pass sees it and decides again." },
     { c: "", w: "" },
     { c: "raise RuntimeError(\"agent did not finish in time\")", w: "Reached when the range is exhausted. Without this the loop would end silently and the caller would receive `None`.", hi: true }
    ],
    after: "Observe, decide, act, repeat — with a hard bound on the repeats. That is the entire architecture, and it is the accumulate pattern where the accumulator is a conversation." } },

  { tbl: { t: "Where agent loops fail, and the loop-level fix",
    h: ["Failure", "What you see", "The fix in the loop"],
    rows: [
     ["**No termination**", "Runs until the budget is spent", "`for step in range(MAX_STEPS)`, never `while True`"],
     ["**Repetition**", "The same tool called with the same arguments forever", "Hash each call; break or intervene on a repeat"],
     ["**Context growth**", "Cost per step climbs, then a hard limit error", "Trim or summarise `messages` — a sliding window over history"],
     ["**Silent tool failure**", "The model reasons on an error string as if it were data", "Feed failures back explicitly labelled as failures"],
     ["**No visibility**", "The run is a black box when it goes wrong", "Log every step, tool call and token count"]
    ] } },

  { n: "The context-trimming fix is the sliding window from earlier in this module, applied to a conversation: keep the newest messages that fit the budget, drop or summarise from the left. Same loop, different data — which is the point of learning the shapes rather than the situations.",
    nt: "You have already written this loop" },

  { tryit: { t: "Add a repetition guard",
    task: "Extend the agent loop so it stops if the model requests the identical tool call twice in a row — a common stuck state. Do not break the normal case where a tool is legitimately called several times with different arguments.",
    hint: "Keep the previous call's name and arguments, compare, and act only on an exact repeat. A `set` of every past call would wrongly block valid repeats later in the run.",
    sol: { lang: "python", code: "last = None\n\nfor step in range(MAX_STEPS):\n    reply = model.chat(messages, tools=TOOLS)\n    messages.append(reply)\n\n    if not reply.tool_calls:\n        return reply.content\n\n    # a stable, comparable fingerprint of this turn's calls\n    sig = tuple((c.name, json.dumps(c.args, sort_keys=True))\n                for c in reply.tool_calls)\n\n    if sig == last:\n        messages.append(system_msg(\n            \"That call was identical to the last one and returned \"\n            \"the same result. Try a different approach or finish.\"))\n        last = None          # give it one clean chance to recover\n        continue\n\n    last = sig\n\n    for call in reply.tool_calls:\n        result = TOOLS[call.name](**call.args)\n        messages.append(tool_msg(call.id, result))\n\nraise RuntimeError(\"agent did not finish in time\")" },
    w: "`sort_keys=True` matters: two dicts with the same content in a different order must produce the same fingerprint, or the guard never fires. Nudging the model and continuing beats hard-failing — most stuck states recover once the model is told it is repeating itself." } },

  { h: "Putting it together" },
  { l: [
   "**Training loop** — nested accumulate. Order matters; `zero_grad` is the line people forget.",
   "**Vectorisation** — the loop you delete. Check for it before writing any loop over an array.",
   "**Batching loop** — chunk, bounded retry, backoff, checkpoint. Costs money when wrong.",
   "**Agent loop** — bounded `while` with a model-decided exit. Always cap the steps.",
   "**All four** are the six shapes from earlier, with domain names attached."
  ] }
 ],
 k: [
  "Training loop order: zero_grad, forward, loss, backward, step — every time.",
  "`torch.no_grad()` for validation; `zero_grad()` before each training step. Different jobs.",
  "A Python loop over a NumPy array is roughly 100x slower than the vectorised expression.",
  "Retry per batch, not per job, and always with a bound and exponential backoff.",
  "Never let a model decide when an agent loop ends — cap the steps in the `for` itself."
 ],
 r: ["Gradient Descent", "Backpropagation", "Batch Processing", "AI Agent"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "optimizer.zero_grad()", w: "clear last step's gradients before the forward pass" },
   { c: "loss.backward()", w: "compute gradients for every parameter" },
   { c: "with torch.no_grad():", w: "run inference without building a gradient graph" },
   { c: "out = (data - mean) / std", w: "normalise a million values without a Python loop" },
   { c: "for step in range(MAX_STEPS):", w: "an agent loop that cannot run forever" }
  ]
 }
}

]);
