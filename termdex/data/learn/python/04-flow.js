/* Python — control flow. */
TD.addLessons("python", [

{
 t: "Making Decisions: if, elif, else",
 m: "flow",
 lvl: "core",
 s: "The first line that makes your program do different things on different days.",
 goal: [
  "Write a branching decision with several outcomes",
  "Explain why the order of your conditions changes the answer",
  "Indent correctly and know exactly what the indentation is deciding"
 ],
 b: [
  { p: "Everything so far has run in a straight line: line 1, line 2, line 3, done. Every run identical. This lesson is where that stops, and it is the first genuinely powerful thing in the language." },

  { syn: { t: "The anatomy of a condition",
    parts: [
     { p: "if", w: "**The keyword.** It tells Python that a question follows and that the indented block below should run only when the answer is yes." },
     { p: " " },
     { p: "temperature > 30", w: "**The condition** — any expression that produces `True` or `False`, or any value at all, judged by the truthiness rules. Note there are no brackets around it; Python does not require them and adding them is unusual." },
     { p: ":", w: "**The colon.** It ends the header and opens a block. Every construct that owns an indented block — `if`, `for`, `while`, `def`, `class` — ends its header with one. Forgetting it is the most common syntax error there is, and Python's message says exactly that: `expected ':'`." }
    ],
    after: "Then the body goes on the next line, indented. Four spaces is the convention; your editor inserts them when you press Tab after a colon." } },

  { code: { lang: "python", t: "One decision, three outcomes",
    lines: [
     { c: "temperature = 35", w: "Something to decide about." },
     { c: "", w: "" },
     { c: "if temperature > 30:", w: "The first question. If this is true, run the indented block and **skip everything else in the chain**." },
     { c: "    print(\"Hot\")", w: "Four spaces of indentation. That indentation is the only thing that makes this line belong to the `if` — there is no closing keyword and no brace." },
     { c: "elif temperature > 20:", w: "**`elif` is short for *else if*.** It is only tested when every condition above it was false. Any number of these may follow." },
     { c: "    print(\"Warm\")" },
     { c: "else:", w: "**The catch-all.** No condition, because it runs precisely when nothing above matched. At most one, and always last." },
     { c: "    print(\"Cool\")" },
     { c: "", w: "" },
     { c: "print(\"Done\")", w: "**Not indented**, so it is outside the chain entirely and runs every single time. This is where the indentation stops being decoration." }
    ],
    out: "Hot\nDone" } },

  { h: "Only one branch ever runs" },
  { p: "This is the part beginners get wrong. In an `if / elif / elif / else` chain, Python tests conditions **top to bottom and stops at the first true one**. The rest are never even evaluated." },

  { vs: { t: "Order changes the answer", lang: "python",
    bad: { c: "score = 95\n\nif score > 50:\n    print(\"Pass\")\nelif score > 90:\n    print(\"Distinction\")", label: "Prints Pass",
      w: "95 is greater than 50, so the first branch wins and the chain stops. The distinction branch is unreachable for *every possible input* — no score above 90 can ever get there, because it also cleared 50." },
    good: { c: "score = 95\n\nif score > 90:\n    print(\"Distinction\")\nelif score > 50:\n    print(\"Pass\")", label: "Prints Distinction",
      w: "**Most specific condition first.** With overlapping ranges, order the tests from narrowest to widest, or the wide one swallows everything." } } },
  { p: "The rule generalises: whenever two conditions can both be true at once, the one you write first is the one that wins. A branch that can never be reached is not a syntax error and nothing will warn you — it just silently never happens." },

  { h: "Separate ifs are a different thing" },
  { code: { lang: "python", t: "These two shapes are not interchangeable",
    lines: [
     { c: "age = 70", w: "" },
     { c: "", w: "" },
     { c: "if age >= 18:", w: "A chain: one branch, then out." },
     { c: "    print(\"adult\")" },
     { c: "elif age >= 65:", w: "Never reached — 70 already passed the first test." },
     { c: "    print(\"senior\")" },
     { c: "", w: "" },
     { c: "if age >= 18:", w: "Two **independent** questions. Each is tested on its own." },
     { c: "    print(\"adult\")" },
     { c: "if age >= 65:", w: "Tested regardless of the outcome above, so both can fire." },
     { c: "    print(\"senior\")" }
    ],
    out: "adult\nadult\nsenior",
    after: "Use `elif` when the cases are alternatives — exactly one should happen. Use separate `if`s when they are independent facts that can both be true." } },

  { h: "Nesting" },
  { code: { lang: "python",
    lines: [
     { c: "if logged_in:", w: "One level of indentation for this block." },
     { c: "    if is_admin:", w: "An `if` inside an `if`, so its block is indented **twice**. Each nesting level adds four more spaces." },
     { c: "        print(\"Admin panel\")" },
     { c: "    else:", w: "This `else` is indented to line up with the *inner* `if`, so it belongs to that one. Line it up with the outer `if` and it means something completely different." },
     { c: "        print(\"User panel\")" },
     { c: "else:", w: "No indentation, so it pairs with the outer `if`." },
     { c: "    print(\"Please log in\")" }
    ],
    after: "In a braced language the pairing is explicit and the indentation can lie about it. In Python they cannot disagree, because the indentation *is* the pairing." } },

  { trap: "`IndentationError: unexpected indent` and `expected an indented block` are the two errors you will meet most in your first week. The usual cause is **mixing tabs and spaces** — they look identical on screen and are different characters to Python. Set your editor to insert spaces when you press Tab (VS Code does by default), and never fix indentation by pasting from a web page." },

  { h: "Guard clauses" },
  { p: "Deep nesting is hard to read. The standard fix is to handle the exceptional cases first and leave the main path unindented." },
  { vs: { t: "The same logic, two shapes", lang: "python",
    bad: { c: "def process(user):\n    if user is not None:\n        if user.active:\n            if user.balance > 0:\n                return charge(user)\n            else:\n                return \"no funds\"\n        else:\n            return \"inactive\"\n    else:\n        return \"no user\"", label: "The arrow of doom",
      w: "The real work sits four levels deep, and the `else` matching each `if` is a long way from it. Adding a fifth condition makes it worse." },
    good: { c: "def process(user):\n    if user is None:\n        return \"no user\"\n    if not user.active:\n        return \"inactive\"\n    if user.balance <= 0:\n        return \"no funds\"\n\n    return charge(user)", label: "Guard clauses",
      w: "Each condition rejects and leaves immediately. The important line is at the bottom, unindented, impossible to miss — and adding a new rule is one more two-line guard." } } },

  { n: "Python has a conditional expression for the simplest case: `status = \"adult\" if age >= 18 else \"minor\"`. It reads oddly at first — value, condition, other value — and it is genuinely useful for a one-line either/or. Do not chain them; two nested ones are already harder to read than the `if` block they replaced.",
    nt: "The one-line form" },

  { tryit: { t: "A grading function",
    task: "Write code that takes a `score` and prints A for 90 and above, B for 80–89, C for 70–79, D for 60–69 and F below that. Test it with 95, 85, 60 and 12.",
    hint: "Order matters enormously here. Start with the highest and work down, so each `elif` only has to check its own lower bound.",
    sol: { lang: "python", code: "score = 85\n\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelif score >= 60:\n    print(\"D\")\nelse:\n    print(\"F\")" },
    w: "Notice each `elif` only needs one comparison, not two. Because Python already stopped at the first match, *not 90 or above* is implied — you never have to write `score >= 80 and score < 90`." } }
 ],
 k: [
  "Every block header ends in a colon, and the indentation *is* the block.",
  "Python tests an `if / elif` chain top to bottom and stops at the first true condition.",
  "Overlapping conditions must go most-specific first, or the wide one swallows the rest.",
  "Guard clauses — reject early, return immediately — beat deep nesting every time."
 ],
 r: ["Conditional", "Boolean", "Indentation", "Guard Clause", "Early Return"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "if temperature > 30:", w: "begin a condition testing whether temperature is above thirty", hint: "no brackets, but do not forget the colon" },
   { c: "elif temperature > 20:", w: "add an alternative branch, checked only if the first failed" },
   { c: "else:", w: "the catch-all branch that runs when nothing above matched" },
   { c: "if user is None:\n    return \"no user\"", w: "a guard clause that rejects a missing user immediately", hint: "two lines, four spaces of indentation" },
   { c: "status = \"adult\" if age >= 18 else \"minor\"", w: "pick between two values in a single line" }
  ]
 }
},

{
 t: "Repeating With while",
 m: "flow",
 lvl: "core",
 s: "Keep going until something changes — and the mistake that hangs your program.",
 goal: [
  "Write a loop that runs an unknown number of times",
  "Guarantee your loop ends, every time",
  "Recognise an infinite loop and get out of one"
 ],
 b: [
  { p: "There are two loops in Python and they answer different questions. `while` answers **keep going until something becomes true**. `for` — the next lesson — answers **do this once for each item**. Reaching for the wrong one is the most common structural mistake beginners make." },

  { code: { lang: "python", t: "The shape",
    lines: [
     { c: "count = 1", w: "**Set up.** The variable the condition depends on must exist before the loop, or the very first test fails with a `NameError`." },
     { c: "while count <= 5:", w: "**The condition**, checked *before every pass* including the first. If it is false at the start, the body never runs at all." },
     { c: "    print(count)", w: "The body, indented as always." },
     { c: "    count += 1", w: "**The update. This is the line everyone forgets.** Something inside the body must eventually make the condition false, or this loop never ends." },
     { c: "", w: "" },
     { c: "print(\"Done\")", w: "Outside the loop, so it runs once when the condition finally fails." }
    ],
    out: "1\n2\n3\n4\n5\nDone" } },

  { p: "Three parts, every time: **set up** a variable, **test** it, **change** it. Miss the third and you have written an infinite loop." },

  { trap: "Delete `count += 1` from the code above and `count` stays 1 forever, the condition stays true forever, and Python prints `1` several million times a second until you stop it. **`Ctrl + C` in the terminal** is how you escape — the same key from Ground Zero. This will happen to you, it is not damaging, and it is not a sign of anything except a forgotten line." },

  { h: "When while is the right choice" },
  { p: "Use `while` when you genuinely do not know how many times you need to go round — because the answer depends on something that happens *inside* the loop." },
  { code: { lang: "python", t: "A menu: it runs until the user decides otherwise",
    lines: [
     { c: "choice = \"\"", w: "Start with something that fails to match, so the loop runs at least once." },
     { c: "", w: "" },
     { c: "while choice != \"q\":", w: "*Keep going until they type q.* There is no way to know in advance how many passes that is — which is exactly the signal that `while` is right." },
     { c: "    choice = input(\"Enter a command (q to quit): \")", w: "The update comes from the user, not from arithmetic. Still an update." },
     { c: "    print(f\"You chose: {choice}\")" },
     { c: "", w: "" },
     { c: "print(\"Goodbye\")" }
    ] } },

  { h: "The while True pattern" },
  { p: "When the exit condition is easier to express in the middle of the body than at the top, the idiom is an explicitly infinite loop with a deliberate exit." },
  { code: { lang: "python",
    lines: [
     { c: "while True:", w: "**Deliberately infinite.** `True` is always true, so the condition never stops it. This is fine, and it is clearer than inventing a flag variable." },
     { c: "    line = input(\"> \")", w: "Get input first, *then* decide — which is why the test could not live at the top." },
     { c: "    if line == \"quit\":", w: "The real exit condition, where it naturally belongs." },
     { c: "        break", w: "**`break` leaves the loop immediately**, skipping the rest of the body and going straight to whatever follows the loop." },
     { c: "    print(f\"Echo: {line}\")", w: "Only reached when the line was not `quit`." },
     { c: "", w: "" },
     { c: "print(\"Session ended\")" }
    ],
    after: "`while True` with a `break` is idiomatic Python, not a hack. It says *loop until I say stop*, and it is honest about where the stopping decision is made." } },

  { h: "Always leave yourself a way out" },
  { p: "A loop that talks to the outside world — a network, a file, a device — can wait forever on something that never arrives. The professional habit is a second, independent limit." },
  { code: { lang: "python", t: "A retry loop with a hard ceiling",
    lines: [
     { c: "attempts = 0", w: "A counter that is not the thing being tested." },
     { c: "max_attempts = 5", w: "The ceiling, named rather than typed as a bare number in the condition." },
     { c: "", w: "" },
     { c: "while not connected and attempts < max_attempts:", w: "**Two exits.** Either it connects, or it runs out of tries. Both conditions must hold to continue, so either one ending stops the loop." },
     { c: "    connected = try_connect()" },
     { c: "    attempts += 1", w: "The counter advances no matter what happens, which is what makes the second exit guaranteed." },
     { c: "", w: "" },
     { c: "if not connected:", w: "And handle the failure case deliberately rather than assuming success." },
     { c: "    print(\"Gave up after 5 attempts\")" }
    ] } },
  { n: "Ask one question of every `while` you write: **what makes this stop?** If you cannot point at the exact line, you have a bug. If the answer depends on something outside your program behaving, add a counter as well. This one habit prevents an entire category of production incident.",
    nt: "The question to ask every time" },

  { tryit: { t: "A number-guessing game",
    task: "Pick a secret number. Loop, asking the user to guess, telling them *higher* or *lower* each time, until they get it right. Then print how many guesses it took.",
    hint: "You do not know how many guesses they need, so `while` is correct. You need a counter as well as the guess.",
    sol: { lang: "python", code: "secret = 42\nguess = None\ntries = 0\n\nwhile guess != secret:\n    guess = int(input(\"Guess: \"))\n    tries += 1\n\n    if guess < secret:\n        print(\"Higher\")\n    elif guess > secret:\n        print(\"Lower\")\n\nprint(f\"Got it in {tries} guesses\")" },
    w: "Note `guess = None` at the start — it has to exist before the condition can test it, and `None` is guaranteed not to equal the secret." } }
 ],
 k: [
  "A `while` loop needs three parts: set up a variable, test it, and change it inside the body.",
  "Forgetting the update gives an infinite loop; `Ctrl + C` gets you out and nothing is damaged.",
  "`while True:` with a `break` is idiomatic when the exit decision belongs mid-body.",
  "Ask of every loop: what makes this stop? If it depends on the outside world, add a counter too."
 ],
 r: ["Loop", "Iteration", "Boolean", "Conditional"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "while count <= 5:", w: "loop for as long as count is five or less" },
   { c: "count += 1", w: "the update line that stops a while loop running forever" },
   { c: "while True:", w: "start a deliberately infinite loop you will break out of" },
   { c: "break", w: "leave the loop immediately" },
   { c: "while not connected and attempts < max_attempts:", w: "loop until connected, but give up after a fixed number of attempts" }
  ]
 }
},

{
 t: "Repeating With for",
 m: "flow",
 lvl: "core",
 s: "The loop you will write ninety per cent of the time, and why it cannot hang.",
 goal: [
  "Loop over a collection without touching an index",
  "Use `range` correctly, including its exclusive end",
  "Explain why a `for` loop can never run forever"
 ],
 b: [
  { p: "A `for` loop does something once for each item in a collection. That is a narrower job than `while`, and the narrowness is exactly why it is better: there is no counter to forget, no condition to get wrong, and **it cannot run forever**, because the collection is finite before the loop starts." },

  { syn: { t: "Reading a for loop",
    parts: [
     { p: "for", w: "**The keyword.** Python's `for` is not the C-style *initialise, test, increment* loop — it is a *for each*, and there is no index arithmetic anywhere in it." },
     { p: " " },
     { p: "score", w: "**The loop variable.** Python creates it, and on each pass it refers to the next item. You choose the name; make it the singular of the collection — `score` from `scores`, `user` from `users`." },
     { p: " in ", w: "**The keyword joining them.** Read the whole header aloud as *for each score in scores* and it is ordinary English." },
     { p: "scores", w: "**The thing to walk through.** Any *iterable*: a list, a string, a dictionary, a file, a range. This is where Python's consistency pays off — one loop shape works on everything." },
     { p: ":", w: "The colon, as always." }
    ] } },

  { code: { lang: "python", t: "Over a list, and over a string",
    lines: [
     { c: "scores = [72, 91, 65]", w: "" },
     { c: "for score in scores:", w: "Three items, so three passes. Python handles the position tracking entirely." },
     { c: "    print(score)" },
     { c: "", w: "" },
     { c: "for letter in \"cat\":", w: "A string is a sequence of characters, so it iterates too. Same syntax, no special case." },
     { c: "    print(letter)" }
    ],
    out: "72\n91\n65\nc\na\nt" } },

  { vs: { t: "Why Python's for is better than the loop you may have seen", lang: "python",
    bad: { c: "i = 0\nwhile i < len(scores):\n    print(scores[i])\n    i += 1", label: "Manual index — three ways to get it wrong",
      w: "Off by one on the `<`, forget the `i += 1`, or mistype the index — and this is what a `for` loop looks like in older languages." },
    good: { c: "for score in scores:\n    print(score)", label: "What Python actually wants",
      w: "No counter, no bound, no possible off-by-one. If you find yourself writing `while i < len(...)` in Python, there is nearly always a better loop." } } },

  { h: "range, when you want numbers" },
  { p: "Sometimes you want to repeat a fixed number of times rather than walk a collection. `range` produces the numbers for you." },
  { code: { lang: "python", t: "Three forms, one rule",
    lines: [
     { c: "for i in range(5):", w: "**One argument: stop.** Counts from 0 up to but *not including* 5 — so 0, 1, 2, 3, 4. Five numbers, which is why the count is what you asked for even though 5 never appears." },
     { c: "    print(i)" },
     { c: "", w: "" },
     { c: "for i in range(1, 6):", w: "**Two arguments: start and stop.** 1 to 5. This is the form you want when counting for a human." },
     { c: "    print(i)" },
     { c: "", w: "" },
     { c: "for i in range(0, 10, 2):", w: "**Three: start, stop and step.** 0, 2, 4, 6, 8. A negative step counts down — `range(10, 0, -1)`." },
     { c: "    print(i)" }
    ],
    after: "The end is always excluded, exactly like a slice. It looks off by one and it means `range(len(items))` produces precisely the valid indices of `items` — which is the payoff for the convention." } },

  { trap: "`range` does not build a list. It produces numbers one at a time as the loop asks for them, which is why `range(10_000_000)` uses a few dozen bytes rather than gigabytes. If you actually need the numbers as a list, wrap it: `list(range(5))`. Print a range directly and you get `range(0, 5)` rather than the numbers, which confuses everyone once." },

  { h: "When you need the position as well" },
  { code: { lang: "python",
    lines: [
     { c: "names = [\"Aryan\", \"Sam\", \"Riya\"]", w: "" },
     { c: "", w: "" },
     { c: "for i, name in enumerate(names):", w: "**`enumerate` hands back both** the position and the item, and Python unpacks the pair into two variables — the same unpacking as `x, y = 10, 20`." },
     { c: "    print(f\"{i}: {name}\")" },
     { c: "", w: "" },
     { c: "for i, name in enumerate(names, start=1):", w: "`start` shifts the counting, for when the number is shown to a person rather than used as an index." },
     { c: "    print(f\"{i}. {name}\")" }
    ],
    out: "0: Aryan\n1: Sam\n2: Riya\n1. Aryan\n2. Sam\n3. Riya",
    after: "If you catch yourself writing `for i in range(len(names)):` and then immediately `names[i]`, `enumerate` is the tool you wanted." } },

  { h: "Two collections at once" },
  { code: { lang: "python",
    lines: [
     { c: "names = [\"Aryan\", \"Sam\"]", w: "" },
     { c: "scores = [91, 78]", w: "" },
     { c: "", w: "" },
     { c: "for name, score in zip(names, scores):", w: "**`zip` walks several collections in step**, pairing up the items. It stops at the shortest one, silently — which is occasionally exactly what you want and occasionally a bug." },
     { c: "    print(f\"{name}: {score}\")" }
    ],
    out: "Aryan: 91\nSam: 78" } },

  { h: "Nested loops" },
  { code: { lang: "python", t: "A loop inside a loop runs the inner one completely, every pass",
    lines: [
     { c: "for row in range(1, 4):", w: "Three passes of the outer loop." },
     { c: "    for col in range(1, 4):", w: "And a full three passes of the inner loop for **each** of those — nine iterations altogether." },
     { c: "        print(f\"{row}x{col}={row*col}\", end=\"  \")", w: "`end` keeps them on one line, as the output lesson showed." },
     { c: "    print()", w: "Indented once, so it belongs to the *outer* loop: a line break after each row. Indentation deciding meaning again." }
    ],
    out: "1x1=1  1x2=2  1x3=3\n2x1=2  2x2=4  2x3=6\n3x1=3  3x2=6  3x3=9" } },
  { n: "Nesting multiplies the work: two nested loops over a thousand items each is a million passes. That is where Big O notation comes from, and it is the single most common reason a program that was instant on test data takes twenty minutes on real data. Keep it in mind now; the NumPy module later is largely about escaping it.",
    nt: "Nested loops are where slowness comes from" },

  { tryit: { t: "Summarise some scores",
    task: "Given `scores = [72, 91, 65, 88, 79]`, print each score with its position starting at 1, then print the highest, the lowest and the average, with the average to one decimal place.",
    hint: "`enumerate` with `start=1` for the numbering. `max`, `min`, `sum` and `len` are all built in — you do not need a loop for the statistics.",
    sol: { lang: "python", code: "scores = [72, 91, 65, 88, 79]\n\nfor i, score in enumerate(scores, start=1):\n    print(f\"{i}. {score}\")\n\nprint(f\"High:    {max(scores)}\")\nprint(f\"Low:     {min(scores)}\")\nprint(f\"Average: {sum(scores) / len(scores):.1f}\")" },
    w: "The instinct is to loop and track a running maximum by hand. Python already has `max`. Reaching for the built-in is nearly always right — and it is faster, because it is written in C." } }
 ],
 k: [
  "`for item in collection:` needs no counter and cannot run forever.",
  "`range(n)` gives 0 to n-1; the end is excluded so `range(len(x))` is exactly the valid indices.",
  "Use `enumerate` when you need the position, and `zip` to walk two collections in step.",
  "Nested loops multiply the work — that is where unexpected slowness comes from."
 ],
 r: ["Loop", "Iteration", "Iterator", "Big O Notation", "Zero-Based Indexing"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "for score in scores:", w: "do something once for each score in a list" },
   { c: "for i in range(5):", w: "repeat five times, counting from zero" },
   { c: "for i in range(1, 6):", w: "count from one to five inclusive" },
   { c: "for i, name in enumerate(names, start=1):", w: "loop with both a position starting at one and the item" },
   { c: "for name, score in zip(names, scores):", w: "walk two lists in step, pairing their items" }
  ]
 }
},

{
 t: "break, continue and the else Nobody Explains",
 m: "flow",
 lvl: "intermediate",
 s: "Leaving early, skipping ahead, and the one Python feature almost nobody knows.",
 goal: [
  "Leave a loop the moment you have your answer",
  "Skip one pass without leaving the loop",
  "Use `for...else` to handle *searched everything and found nothing*"
 ],
 b: [
  { p: "By default a loop runs to completion. Two keywords change that, and there is a third piece of syntax that solves a problem you will otherwise solve badly with a flag variable." },

  { h: "break — stop entirely" },
  { code: { lang: "python", t: "Searching: leave the moment you find it",
    lines: [
     { c: "names = [\"Aryan\", \"Sam\", \"Riya\", \"Dev\"]", w: "" },
     { c: "", w: "" },
     { c: "for name in names:", w: "" },
     { c: "    if name == \"Riya\":", w: "" },
     { c: "        print(\"Found her\")" },
     { c: "        break", w: "**Leaves the loop immediately.** `Dev` is never examined. In a four-item list that saves nothing; over a million rows it is the difference between instant and slow." },
     { c: "    print(f\"checking {name}\")", w: "Skipped for Riya, because `break` jumped out before reaching it." }
    ],
    out: "checking Aryan\nchecking Sam\nFound her" } },
  { p: "`break` only ever leaves **one** loop — the innermost one containing it. Inside nested loops it exits the inner loop and the outer one carries on, which surprises people. Python has no `break 2`; if you need to escape both, put them in a function and `return`." },

  { h: "continue — skip this one" },
  { code: { lang: "python", t: "Filtering: ignore the ones you do not want",
    lines: [
     { c: "for n in range(1, 11):", w: "1 through 10." },
     { c: "    if n % 2 != 0:", w: "Odd — the modulo from the numbers lesson." },
     { c: "        continue", w: "**Abandons this pass and jumps straight to the next item.** The rest of the body is skipped; the loop itself keeps going." },
     { c: "    print(n)", w: "Only reached by the even numbers." }
    ],
    out: "2\n4\n6\n8\n10" } },
  { vs: { t: "continue versus just using if", lang: "python",
    bad: { c: "for n in numbers:\n    if n > 0:\n        if n % 2 == 0:\n            if n < 100:\n                process(n)", label: "Nested to three levels",
      w: "The actual work is buried, and every new rule adds another level." },
    good: { c: "for n in numbers:\n    if n <= 0:\n        continue\n    if n % 2 != 0:\n        continue\n    if n >= 100:\n        continue\n\n    process(n)", label: "Skip early, work flat",
      w: "The same guard-clause idea from the `if` lesson, applied to loops. Each rule is one independent two-line skip, and the real work stays at one level of indentation." } } },

  { h: "for...else" },
  { p: "This is genuinely obscure and genuinely useful. A loop may have an `else` block, and it runs **only if the loop finished without ever hitting a `break`**." },
  { p: "Read `else` here as *no break* — the keyword is admittedly badly chosen, and even Guido van Rossum has said so." },

  { vs: { t: "Did we search everything and find nothing?", lang: "python",
    bad: { c: "found = False\nfor user in users:\n    if user.id == target:\n        found = True\n        break\n\nif not found:\n    print(\"No such user\")", label: "With a flag variable",
      w: "Works perfectly. It also needs an extra variable that exists only to carry one fact from inside the loop to outside it, and forgetting to set it is a classic bug." },
    good: { c: "for user in users:\n    if user.id == target:\n        print(\"Found\")\n        break\nelse:\n    print(\"No such user\")", label: "With for...else",
      w: "The `else` is attached to the `for`, not the `if` — look at the indentation. It runs only when the loop ran out of items without breaking, which is exactly *searched everything, found nothing*." } } },
  { n: "The rule in one line: **`else` runs when the loop was not broken out of.** It works on `while` too. Once it clicks you will spot the pattern everywhere — validation loops, search loops, retry loops — and you will stop writing flag variables.",
    nt: "Remember it as `no-break`" },

  { h: "The three together" },
  { code: { lang: "python", file: "find_prime.py", t: "A complete, real use of all three",
    lines: [
     { c: "numbers = [15, 21, 25, 29, 33]", w: "" },
     { c: "", w: "" },
     { c: "for n in numbers:", w: "The outer loop: try each candidate." },
     { c: "    if n < 2:", w: "" },
     { c: "        continue", w: "Not worth testing — skip to the next candidate without leaving the loop." },
     { c: "", w: "" },
     { c: "    for divisor in range(2, int(n ** 0.5) + 1):", w: "The inner loop: check for factors up to the square root, which is all you need." },
     { c: "        if n % divisor == 0:", w: "A factor, so `n` is not prime." },
     { c: "            break", w: "Leave the **inner** loop only. No point testing more divisors." },
     { c: "    else:", w: "Lined up with the inner `for`, so it belongs to it. Reached only when no divisor was found — meaning `n` is prime.", hi: true },
     { c: "        print(f\"{n} is prime\")" },
     { c: "        break", w: "Leave the **outer** loop: we wanted the first prime and we have it." }
    ],
    out: "29 is prime",
    after: "Two loops, a `continue`, two `break`s and a `for...else`, and every one is doing a distinct job. Read it once more with the indentation in mind — that is what pairs each keyword to its loop." } },

  { tryit: { t: "Validate a password",
    task: "Given a list of passwords, print the first one that is at least eight characters long **and** contains a digit. If none qualify, print *no valid password found* — and do it without a flag variable.",
    hint: "`any(ch.isdigit() for ch in pw)` asks whether any character is a digit. The `for...else` handles the nothing-found case.",
    sol: { lang: "python", code: "passwords = [\"abc\", \"password\", \"hunter2x\", \"letmein\"]\n\nfor pw in passwords:\n    if len(pw) < 8:\n        continue\n    if not any(ch.isdigit() for ch in pw):\n        continue\n\n    print(f\"Valid: {pw}\")\n    break\nelse:\n    print(\"No valid password found\")" },
    w: "Two `continue` guards, one `break` on success, and an `else` for the empty case. No flags anywhere, and each rule is independently editable." } }
 ],
 k: [
  "`break` leaves the innermost loop entirely; `continue` abandons only the current pass.",
  "`continue` guards flatten nested filtering the same way guard clauses flatten nested `if`s.",
  "A loop's `else` runs only when the loop was never broken out of — read it as *no-break*.",
  "`break` cannot escape two loops at once; put them in a function and `return` instead."
 ],
 r: ["Loop", "Iteration", "Guard Clause", "Early Return"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "break", w: "leave the innermost loop immediately" },
   { c: "continue", w: "skip the rest of this pass and move to the next item" },
   { c: "if n % 2 != 0:\n    continue", w: "a guard that skips every odd number", hint: "two lines" },
   { c: "else:\n    print(\"No such user\")", w: "the loop-else branch that runs only when nothing was found", hint: "attached to the for, not an if" },
   { c: "if not any(ch.isdigit() for ch in pw):", w: "test that a password contains no digit at all" }
  ]
 }
}

]);
