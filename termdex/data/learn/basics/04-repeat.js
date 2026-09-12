/* Programming Basics — loops and repetition. */
TD.addLessons("basics", [

{
 t: "Loops: The Anatomy of Repetition",
 m: "repeat",
 lvl: "core",
 s: "while, for, and the four moving parts that every loop in every language is made of.",
 goal: [
  "Name the four parts of a loop and say what happens if one is missing",
  "Choose between `while` and `for` without hesitating",
  "Write a loop that is guaranteed to end"
 ],
 b: [
  { p: "Computers are not fast because each instruction is clever. They are fast because they will do the same dull thing four hundred million times without complaining. A **loop** is how you ask for that, and it is the construct that turns a program from something that processes one item into something that processes a dataset." },

  { h: "The four parts" },
  { p: "Every loop, in every language, has the same four moving pieces. Different syntaxes make different pieces visible, but all four are always present." },

  { dg: "loop-anatomy" },

  { ol: [
   "**Setup** — the starting state. A counter at zero, a position at the first item, an empty accumulator.",
   "**The check** — a boolean expression tested *before* each pass. True means go round; false means stop and carry on below.",
   "**The body** — the work. The lines that actually do something, run once per pass.",
   "**The step** — the change that moves you towards the check eventually being false. Increment the counter, advance to the next item, shrink the queue."
  ] },
  { p: "Lose the step and the check never changes, which is an **infinite loop**. That is not a mysterious failure — it is a specific, diagnosable mistake with exactly one cause: nothing in the body changes what the check looks at." },

  { h: "while: repeat until a condition stops holding" },

  { code: { lang: "python", t: "All four parts, visible and separate",
    lines: [
     { c: "count = 0", w: "**Setup.** Outside the loop, before it begins." },
     { c: "while count < 5:", w: "**The check.** Evaluated before every single pass, including the first. If `count` started at 5, the body would never run at all — and that is correct behaviour, not a bug." },
     { c: "    print(count)", w: "**The body.**" },
     { c: "    count = count + 1", w: "**The step.** Delete this line and the program prints `0` forever. That is the entire mechanism of an infinite loop." }
    ],
    out: "0\n1\n2\n3\n4",
    after: "Note it stops at 4, not 5. The check runs when `count` is 5, sees `5 < 5` is false, and exits without running the body. This is the single most common source of off-by-one confusion and there is a whole lesson on it next." } },

  { p: "`while` is the right choice when you do not know in advance how many times you will go round — you only know the condition that should stop you." },
  { l: [
   "Reading lines from a file until it runs out",
   "Retrying a network request until it succeeds or you have tried five times",
   "A game loop: keep going until the player quits",
   "Processing a queue until it is empty — and the body is what adds to the queue"
  ] },

  { h: "for: repeat once per item" },
  { p: "The overwhelmingly common case is *do this once for each thing in a collection*. Every language has a dedicated form for it, and it bundles the setup, check and step into one line so you cannot forget any of them." },

  { code: { lang: "python", t: "The same job, four ways",
    lines: [
     { c: "for name in names:", w: "**Python.** The cleanest form there is. No index, no counter, no chance of an off-by-one — you asked for each item and you got each item." },
     { c: "    print(name)", w: "" },
     { c: "", w: "" },
     { c: "for (const name of names) { }", w: "**JavaScript.** Same idea. (`for...in` is different and gives you the *keys* — a classic mix-up.)" },
     { c: "for (String name : names) { }", w: "**Java.** The enhanced for loop, added in Java 5 for exactly this reason." },
     { c: "for _, name := range names { }", w: "**Go.** `range` hands back index and value; `_` discards the index you did not want." },
     { c: "", w: "" },
     { c: "for (int i = 0; i < names.length; i++) { }", w: "**The classic C-style for.** All three parts on one line: setup; check; step. Every C-family language still supports it, and you need it when you genuinely want the index — but reach for it second, not first." }
    ] } },

  { trap: "When you find yourself writing `for i in range(len(items)):` and then only ever using `items[i]`, you have written the hard version of `for item in items:`. The index-based form exists for when you need the position — comparing neighbours, writing back into the list, stepping two at a time. If you are not doing one of those, drop the index and remove a whole class of bug." },

  { h: "When you do need the index as well" },

  { code: { lang: "python", t: "Both, without the manual counter",
    lines: [
     { c: "for i, name in enumerate(names):", w: "`enumerate` hands back the position and the item together. JavaScript: `names.forEach((name, i) => ...)`. Go: `for i, name := range names`." },
     { c: "    print(f\"{i + 1}. {name}\")", w: "`i + 1` because indexes start at zero and human lists start at one — a conversion you will do constantly." },
     { c: "", w: "" },
     { c: "for a, b in zip(list1, list2):", w: "Walking two collections in step. Stops at the shorter one, which is usually what you want and occasionally hides a bug when the lengths should have matched." }
    ] } },

  { h: "Choosing between them" },

  { tbl: { t: "while or for?",
    h: ["Situation", "Use", "Why"],
    rows: [
     ["Once per item in a list, map or file", "**for**", "The count is fixed by the collection. Nothing to get wrong."],
     ["A known number of times", "**for** over a range", "`for i in range(10)` says *ten times* out loud."],
     ["Until a condition changes", "**while**", "You genuinely do not know the count in advance."],
     ["Until the user or the network says stop", "**while**", "The end condition is external."],
     ["At least once, then check", "**do-while**", "Exists in C, Java, JS, Go. Not in Python — use `while True` with a `break` at the bottom."]
    ] } },

  { h: "The loop that never ends — on purpose" },
  { p: "An infinite loop is usually a bug. Occasionally it is exactly right: a server that should run forever, a menu that repeats until the user chooses quit. In those cases you write it deliberately and put the exit inside the body." },

  { code: { lang: "python", t: "Deliberate, with a real exit",
    lines: [
     { c: "while True:", w: "The condition is a constant, so it can never become false. This is fine **because** the body contains an exit." },
     { c: "    command = input(\"> \")", w: "" },
     { c: "    if command == \"quit\":", w: "" },
     { c: "        break", w: "`break` leaves the loop immediately. Without this line the program is unkillable except with Ctrl+C." },
     { c: "    handle(command)", w: "" }
    ],
    after: "The test for whether an infinite loop is a bug: can you point at the line that ends it? If yes, it is a design. If no, it is a bug." } },

  { n: "If you ever run a program and it just sits there doing nothing, an infinite loop is the first suspect. Press **Ctrl+C** in the terminal to stop it — that sends an interrupt signal and the process dies. Nothing is damaged. Then look at your loop and ask which line was supposed to change the condition.",
    nt: "How to escape one" },

  { tryit: { t: "How many times?",
    task: "For each loop, how many times does the body run?",
    hint: "The check happens *before* each pass, including the very first.",
    sol: { lang: "python", code: "for i in range(5):        -> 5   (0,1,2,3,4)\nfor i in range(1, 5):     -> 4   (1,2,3,4 — the end is excluded)\nfor i in range(0, 10, 2): -> 5   (0,2,4,6,8)\n\nx = 10\nwhile x < 5:              -> 0   (the check fails immediately)\n    x += 1\n\nx = 5\nwhile x > 0:              -> 5   (5,4,3,2,1)\n    x -= 1" },
    w: "The fourth one running zero times is the important case. A `while` whose condition is false at the start runs its body **not once** — it is not *do this then check*, it is *check then maybe do this*." } },

  { vocab: ["Loop", "Iteration", "Iterator"] }
 ],
 k: [
  "Every loop has four parts: setup, check, body, step. A missing step is an infinite loop, and that is the only cause.",
  "The check runs *before* each pass — so a `while` whose condition starts false runs zero times.",
  "Use `for` when the number of passes is decided by a collection or a range; use `while` when only a condition decides.",
  "`for item in items` is almost always better than looping over indexes. Only use the index when you actually need the position."
 ],
 r: ["Loop", "Iteration", "Iterator"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "for name in names:", w: "do something once for each item, with no counter to get wrong" },
   { c: "for i, name in enumerate(names):", w: "get the position and the item together" },
   { c: "while queue:", w: "keep going while there is anything left in the queue", hint: "an empty collection is falsy" },
   { c: "for i in range(0, 10, 2):", w: "count 0 to 8 in steps of two" },
   { c: "while True:", w: "loop deliberately forever — with a break inside", hint: "only valid if the body can exit" }
  ]
 }
},

{
 t: "break, continue and the Off-By-One",
 m: "repeat",
 lvl: "core",
 s: "Leaving a loop early, skipping a pass, and the single most famous class of bug in programming.",
 goal: [
  "Use `break` and `continue` to flatten loop logic",
  "Explain why indexes start at zero and where that bites",
  "Get a range boundary right the first time"
 ],
 b: [
  { p: "Two keywords change how a loop flows, and one arithmetic quirk causes more bugs than both of them combined. All three belong on the same page." },

  { h: "break: stop the loop entirely" },

  { code: { lang: "python", t: "Searching, and leaving as soon as you find it",
    lines: [
     { c: "found = None", w: "" },
     { c: "for user in users:", w: "" },
     { c: "    if user.email == target:", w: "" },
     { c: "        found = user", w: "" },
     { c: "        break", w: "Leave the loop right now. The remaining users are never examined. On a million-row list where the match is at position three, this is the difference between instant and slow." },
     { c: "", w: "" },
     { c: "if found is None:", w: "" },
     { c: "    print(\"no match\")", w: "" }
    ],
    after: "`break` only exits the loop it is directly inside. In nested loops it leaves the inner one and the outer one carries on — which surprises people constantly." } },

  { h: "continue: skip the rest of this pass" },

  { vs: { lang: "python", t: "The same filter, twice",
    bad: { label: "Nested", c: "for row in rows:\n    if row.is_valid:\n        if not row.is_deleted:\n            if row.amount > 0:\n                process(row)",
      w: "The real work is four levels deep, and adding a fifth condition pushes it further right. This is the arrow of doom again, in loop form." },
    good: { label: "Guard with continue", c: "for row in rows:\n    if not row.is_valid:\n        continue\n    if row.is_deleted:\n        continue\n    if row.amount <= 0:\n        continue\n\n    process(row)",
      w: "Each rejection is one flat line that reads as a rule. `process(row)` sits at one level of indentation, obvious, and adding a new rule is one more two-line block instead of another level of nesting." }
  } },

  { p: "`continue` is the guard clause of loops. The pattern is identical: reject early, keep the real work unindented." },

  { h: "Why counting starts at zero" },
  { p: "The first item of a list is at index `0`, not `1`. This feels arbitrary and is not. It comes from what an index physically meant: **the distance from the start**." },

  { code: { lang: "text", t: "The original meaning of an index",
    lines: [
     { c: "letters = ['a', 'b', 'c', 'd']", w: "" },
     { c: "", w: "" },
     { c: "index:      0    1    2    3", w: "The index is an *offset*. Item 0 is zero steps from the beginning; item 2 is two steps along." },
     { c: "value:     'a'  'b'  'c'  'd'", w: "" },
     { c: "", w: "" },
     { c: "len(letters) == 4", w: "Four items…" },
     { c: "last index  == 3", w: "…and the last index is 3. **The length is always one more than the last valid index.** This one sentence prevents most index errors." }
    ],
    after: "Everything follows from that: `letters[0]` is the first, `letters[len - 1]` is the last, and `letters[len]` is one past the end and always an error." } },

  { p: "Python and a few others add negative indexing, which is genuinely convenient: `letters[-1]` is the last item, `letters[-2]` the second-to-last. Most languages do not have it, so `list[list.length - 1]` is the general form." },

  { h: "The off-by-one error" },
  { p: "An **off-by-one** is a loop or index that runs one time too many or one too few. It is famous because it survives casual testing: your three-item test list works, and the bug only shows on the boundary." },

  { code: { lang: "python", t: "Four versions of the same loop. Two are wrong.",
    lines: [
     { c: "items = ['a', 'b', 'c']", w: "Three items. Valid indexes: 0, 1, 2." },
     { c: "", w: "" },
     { c: "for i in range(len(items)):", w: "**Correct.** `range(3)` gives 0, 1, 2. The end of a range is always excluded, which is precisely so that `range(len(x))` works." },
     { c: "    print(items[i])", w: "" },
     { c: "", w: "" },
     { c: "for i in range(len(items) + 1):", w: "**IndexError.** Tries index 3, which does not exist. The `+ 1` came from thinking *I have three items so I want 1, 2, 3*." },
     { c: "", w: "" },
     { c: "for i in range(1, len(items)):", w: "**Silently wrong.** Runs for 1 and 2 and skips `items[0]` entirely. No error, no warning — your report is just missing its first row." },
     { c: "", w: "" },
     { c: "for item in items:", w: "**Correct, and immune.** No arithmetic, so no off-by-one is possible. This is why it is the preferred form." }
    ] } },

  { p: "Half-open ranges — *include the start, exclude the end* — look like a trap and are actually the cure. They are the convention nearly everywhere: Python's `range` and slices, JavaScript's `slice`, Java's `subList`, Go's slices, C++ iterators." },

  { tbl: { t: "Why excluding the end is the right choice",
    h: ["Property", "Result"],
    rows: [
     ["Length", "`end - start` gives the count directly. `range(2, 7)` has 5 items. No `+ 1` anywhere."],
     ["Splitting", "`[0:n]` and `[n:]` cover the whole thing with no gap and no overlap. `n` appears once in each, meaning *up to* and *from*."],
     ["Empty case", "`range(5, 5)` is empty, which is sensible. A closed range would be one item, which is not."],
     ["Chaining", "The end of one chunk is the start of the next. Perfect for paging and batching."]
    ] } },

  { trap: "The boundary questions to ask every single time you write a comparison in a loop or a range: **should the last item be included?** and **should the first?** Then test with a collection of size zero and size one. Almost every off-by-one shows up at length 0 or 1 and hides at length 3." },

  { h: "Modifying a list while looping over it" },
  { p: "One more loop bug, and it is nastier than an off-by-one because it produces wrong output rather than an error." },

  { vs: { lang: "python", t: "Removing items while iterating",
    bad: { label: "Skips items", c: "for item in items:\n    if item.expired:\n        items.remove(item)",
      w: "The loop is walking by position. Remove index 2 and everything shifts down — so what was index 3 is now index 2, and the loop moves to index 3, stepping straight over it. Two adjacent expired items and the second one survives. No error at all." },
    good: { label: "Build a new list", c: "items = [i for i in items if not i.expired]",
      w: "Build the list you want rather than surgically editing the one you are walking. It is shorter, it is obviously correct, and it is the same *return new things instead of mutating* habit from the values module." }
  } },

  { n: "The general rule: **never add to or remove from a collection while iterating over it.** Either build a new collection (best), collect the items to remove and delete them afterwards, or iterate backwards so that shifting indexes cannot affect positions you have not reached yet. Some languages detect this and throw — Java's `ConcurrentModificationException` exists precisely for this — and Python simply gives you wrong answers.",
    nt: "The rule, stated once" },

  { tryit: { t: "Find the off-by-one",
    task: "This is meant to print every item. What actually happens for a list of five items?",
    hint: "Write out the indexes it visits, then write out the valid indexes.",
    sol: { lang: "python", code: "# the bug\nitems = ['a','b','c','d','e']\nfor i in range(1, len(items)):\n    print(items[i])\n# prints b c d e -- 'a' is silently missing\n\n# and its evil twin\nfor i in range(len(items) + 1):\n    print(items[i])\n# prints a b c d e then IndexError on index 5\n\n# the fix, in both cases\nfor item in items:\n    print(item)" },
    w: "The first bug is worse than the second. The second one crashes and tells you. The first one produces a plausible-looking report that is quietly missing a row — and might do so for months." } },

  { vocab: ["Off-By-One Error", "Zero-Based Indexing"] }
 ],
 k: [
  "`break` leaves the loop; `continue` skips to the next pass. `continue` is the guard clause of loops and flattens filtering beautifully.",
  "An index is a distance from the start, which is why it begins at zero and why the last index is always `length - 1`.",
  "Ranges exclude their end on purpose: `end - start` is the count, and adjacent ranges tile perfectly with no overlap.",
  "Never add to or remove from a collection while looping over it. Build a new one instead."
 ],
 r: ["Off-By-One Error", "Zero-Based Indexing", "Array", "Iterator"]
},

{
 t: "Nested Loops and the First Time Speed Matters",
 m: "repeat",
 lvl: "intermediate",
 s: "A loop inside a loop, why it is sometimes right, and why it is the line that kills you at scale.",
 goal: [
  "Read a nested loop and count how many times the inner body runs",
  "Recognise the accidental quadratic",
  "Replace a nested search with a lookup"
 ],
 b: [
  { p: "Put a loop inside a loop and the inner body runs *outer count × inner count* times. That multiplication is the entire lesson, and it is where most beginners meet performance for the first time — usually by accident, usually in production." },

  { h: "The legitimate use: grids and pairs" },

  { code: { lang: "python", t: "When nesting is exactly right",
    lines: [
     { c: "for row in range(3):", w: "Runs 3 times." },
     { c: "    for col in range(4):", w: "Runs 4 times **for every one** of those. The inner body therefore runs 12 times." },
     { c: "        print(grid[row][col], end=\" \")", w: "" },
     { c: "    print()", w: "This one is in the *outer* loop — one newline per row. Its indentation is the only thing saying so." }
    ],
    after: "Anything two-dimensional wants this: a grid, a table, a matrix, an image, a chessboard, every pair of items in a list. The nesting mirrors the shape of the data and there is nothing to fix." } },

  { h: "The accidental one: searching inside a loop" },
  { p: "The dangerous version does not look nested. The inner loop is hidden inside a helpful-looking function call." },

  { code: { lang: "python", t: "The loop you did not know you wrote",
    lines: [
     { c: "for order in orders:", w: "Say 10,000 orders." },
     { c: "    if order.customer_id in vip_list:", w: "This looks like one operation. **It is a loop.** `in` on a *list* walks the whole list until it finds a match. If `vip_list` has 1,000 entries, this line does up to 1,000 comparisons." },
     { c: "        apply_discount(order)", w: "" }
    ],
    out: "10,000 x 1,000 = up to 10 million comparisons",
    ot: "For a job that looks like three lines" } },

  { p: "On the 20 test rows on your machine, this returns instantly. On the real data it takes minutes. Nothing errored, nothing warned you, and the code looks completely reasonable — which is exactly why this is worth learning before you meet it." },

  { dg: "complexity-growth" },

  { h: "The fix: turn the search into a lookup" },

  { vs: { lang: "python", t: "One character of difference, a thousand times faster",
    bad: { label: "Searching a list", c: "vip_list = [1001, 1002, 1003, ...]\n\nfor order in orders:\n    if order.customer_id in vip_list:\n        apply_discount(order)",
      w: "`in` on a list is a linear scan: it checks each element in turn. Average cost per lookup grows with the size of the list." },
    good: { label: "Checking a set", c: "vips = set(vip_list)\n\nfor order in orders:\n    if order.customer_id in vips:\n        apply_discount(order)",
      w: "`in` on a **set** or a dictionary is a hash lookup: it jumps more or less straight to the answer regardless of size. One extra line converting the list, and 10 million comparisons become 10,000." }
  } },

  { p: "This is the most valuable performance move a beginner can learn, because it requires no cleverness at all — just noticing that a membership test is happening inside a loop, and converting the thing being searched into a set or dictionary first. There is a full lesson on why sets are fast in the data module." },

  { h: "Counting the cost, informally" },
  { p: "You do not need formal Big-O yet (there is a lesson on it later). You need one habit: **when you see a loop, ask what is inside it, and whether that thing is also a loop.**" },

  { tbl: { t: "What the shape costs you",
    h: ["Shape", "Work for n = 10,000", "Feels like"],
    rows: [
     ["One loop, simple body", "10 thousand", "Instant"],
     ["One loop containing a list search", "up to 100 million", "Minutes. Possibly hours."],
     ["Two nested loops over the same data", "100 million", "The same. This is the classic quadratic."],
     ["Three nested loops", "1,000,000,000,000", "It will not finish today."],
     ["One loop, set/dict lookup inside", "10 thousand", "Instant again"]
    ] } },

  { trap: "The hidden loops to watch for inside another loop: `in` on a list, `.index()`, `.count()`, `.remove()`, string concatenation in a loop (`s += x` copies the whole string each time in most languages), any database query, and any network call. The last two are the worst — a query inside a loop is the *N+1 query* problem, and it is the most common performance bug in web applications by a wide margin." },

  { h: "Breaking out of nested loops" },
  { p: "A practical annoyance: `break` only escapes the loop it is directly inside. Getting out of both needs one of these." },

  { code: { lang: "python", t: "Three ways out",
    lines: [
     { c: "# 1. a flag — works everywhere, reads poorly", w: "" },
     { c: "found = False", w: "" },
     { c: "for row in grid:", w: "" },
     { c: "    for cell in row:", w: "" },
     { c: "        if cell == target:", w: "" },
     { c: "            found = True", w: "" },
     { c: "            break", w: "Leaves the inner loop only." },
     { c: "    if found:", w: "The outer loop has to check the flag itself." },
     { c: "        break", w: "" },
     { c: "", w: "" },
     { c: "# 2. put it in a function and return -- usually best", w: "" },
     { c: "def find(grid, target):", w: "" },
     { c: "    for row in grid:", w: "" },
     { c: "        for cell in row:", w: "" },
     { c: "            if cell == target:", w: "" },
     { c: "                return cell", w: "`return` leaves the *function*, and therefore every loop inside it, at once. Cleanest solution in any language, and it usually improves the code for other reasons too." },
     { c: "", w: "" },
     { c: "# 3. a labelled break -- Java, Go, JS, Rust; not Python", w: "" },
     { c: "outer:", w: "" },
     { c: "for ... { for ... { break outer; } }", w: "Explicit and clear where the language supports it." }
    ] } },

  { tryit: { t: "Count the operations",
    task: "For a list of 1,000 names, roughly how many comparisons does each version do?",
    hint: "Ask what `in` is doing to each container.",
    sol: { lang: "python", code: "# A -- checking a list\nseen = []\nfor name in names:          # 1,000 passes\n    if name not in seen:    # scans up to 1,000 each time\n        seen.append(name)\n# roughly 500,000 comparisons (average half the list)\n\n# B -- checking a set\nseen = set()\nfor name in names:          # 1,000 passes\n    if name not in seen:    # one hash lookup\n        seen.add(name)\n# roughly 1,000 operations -- 500x fewer\n\n# C -- and the one-liner that does the same job\nseen = set(names)" },
    w: "Version A is a real pattern people write constantly, and it is invisible until the list gets big. Two characters — `[]` to `set()` — change the cost by a factor of five hundred." } },

  { vocab: ["Time Complexity", "Big O Notation", "Hash Table", "N+1 Query Problem"] }
 ],
 k: [
  "The body of a nested loop runs outer × inner times. That multiplication is where performance problems start.",
  "The dangerous nesting is invisible: `in` on a list, `.index()`, a database query or a network call inside a loop is a hidden inner loop.",
  "Convert the thing you search repeatedly into a set or dictionary. It is usually a one-line change and often a hundredfold speedup.",
  "`break` escapes only its own loop. Putting the loops in a function and using `return` is the cleanest way out of both."
 ],
 r: ["Time Complexity", "Big O Notation", "Hash Table", "Set"]
}

]);
