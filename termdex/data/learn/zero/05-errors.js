/* Ground Zero — reading errors and finding answers. */
TD.addLessons("zero", [

{
 t: "How to Read an Error Message",
 m: "errors",
 lvl: "core",
 s: "The skill that separates people who progress from people who quit. Read from the bottom.",
 goal: [
  "Read a stack trace bottom-up and find the line that actually failed",
  "Name the three kinds of error and say when each one appears",
  "Turn any error into a specific question instead of a feeling"
 ],
 b: [
  { p: "Red text is going to appear on your screen more often than working output, for months. How you respond to it decides how fast you learn — and the instinctive response, which is to scan it, feel bad and start changing things at random, is the slow one." },
  { p: "So here is the reframe, and it is genuinely true. **An error message is the most helpful thing your computer ever produces.** It contains the exact file, the exact line, what it was doing, and what it could not do. Compare that to a program that silently produces the wrong number and tells you nothing. An error is a *good* outcome." },

  { h: "The three kinds, and when each appears" },
  { tbl: { h: ["Kind", "When it happens", "What it means", "Example"],
    rows: [
     ["**Syntax error**", "Before anything runs at all", "What you wrote is not valid Python. It could not even be read", "Missing `)`, missing `:`, unclosed quote"],
     ["**Runtime error**", "Part-way through, at the exact moment it fails", "Valid code that hit an impossible situation", "Dividing by zero, opening a missing file, using a name that does not exist"],
     ["**Logic error**", "Never. Nothing is reported", "It ran perfectly and gave the wrong answer", "You wrote `+` where you meant `-`"]
    ] } },
  { p: "The first two announce themselves. The third — the dangerous one — does not, and no tool can find it for you. That asymmetry is worth internalising: **an error you can see is the cheap kind.**" },

  { h: "Anatomy of a stack trace" },
  { p: "When a runtime error happens, Python prints a **traceback**. It looks like a wall. It is not — it is four parts in a fixed order, and once you know the shape you read it in five seconds." },

  { code: { lang: "python", file: "a real traceback",
    lines: [
     { c: "Traceback (most recent call last):", w: "**Part 1 — the header.** Note what it says: *most recent call last*. That is Python telling you outright that the important line is at the **bottom**, not the top. Almost everyone reads top-down and wastes their time." },
     { c: "  File \"analysis.py\", line 12, in <module>", w: "**Part 2 — the call chain**, oldest first. This frame says: in `analysis.py`, line 12, at the top level of the file. This is where the journey started." },
     { c: "    total = average(scores)", w: "The actual line of your code at that point. Line 12 called `average`." },
     { c: "  File \"analysis.py\", line 7, in average", w: "The next frame in. Inside the `average` function now, at line 7." },
     { c: "    return sum(values) / len(values)", w: "And this is the line that blew up. **This is the line you care about** — the last one shown before the error itself.", hi: true },
     { c: "ZeroDivisionError: division by zero", w: "**Part 3 and 4 — the error type and the message.** The type before the colon (`ZeroDivisionError`) is the *category*; the text after it is the specific detail. Together they say: something was divided by zero." }
    ],
    after: "Read bottom-up: *division by zero* → *on the line `sum(values) / len(values)`* → so `len(values)` was zero → so `values` was empty → so `scores` was empty at line 12. The traceback did not just report the crash; it handed you the entire chain of causation." } },

  { n: "Read a traceback **from the bottom up**. The last line tells you *what* went wrong. The lines immediately above tell you *where*. Everything higher up is how you got there, and you usually do not need it. If you take one thing from this whole track, take this.",
    nt: "Bottom to top. Always." },

  { h: "Your code, or someone else's" },
  { p: "A traceback often includes frames from inside libraries you did not write — long paths with `site-packages` in them. Those are usually not where your bug is. Scan upward for the **last frame whose file is yours** and start there: that is the point where your code handed something bad to somebody else's." },

  { h: "The five you will actually meet" },
  { tbl: { h: ["Error", "What it really means", "First thing to check"],
    rows: [
     ["`SyntaxError`", "Python could not parse the file", "**The line above the one it reports.** An unclosed bracket is only noticed on the following line"],
     ["`NameError`", "You used a name that does not exist", "Spelling, capitalisation, and whether you defined it before using it"],
     ["`TypeError`", "An operation on the wrong kind of thing", "Usually text where a number was expected — `\"5\" + 1`"],
     ["`IndexError` / `KeyError`", "Asked a collection for something it does not have", "Off-by-one on the index, or a typo in the key"],
     ["`ModuleNotFoundError`", "An import failed", "Is it installed, and is it installed in the environment you are actually running?"]
    ] } },

  { trap: "`SyntaxError` reports the line where Python *noticed* the problem, which is frequently the line **after** the mistake. Forget a closing bracket on line 20 and Python keeps reading, hoping, and gives up on line 21 — pointing at code that is perfectly fine. When a syntax error makes no sense, look at the line above. Nine times out of ten there is an unclosed `(`, `[`, `\"` or a missing `:`." },

  { h: "The method" },
  { ol: [
   "**Read the last line.** The error type and message. Out loud if it helps.",
   "**Find the last frame that is your file.** That is where to look.",
   "**Go to that exact line** and read it slowly. What is each name on it, right now?",
   "**Print the suspects.** Add `print(values)` on the line before. Guessing what a value holds is what turns a two-minute fix into an hour.",
   "**Change one thing.** Re-run. If it did not help, change it back before trying the next thing."
  ] },
  { p: "Step five is what separates debugging from thrashing. Changing three things at once means that when it works, you do not know why — and you have learned nothing." },

  { tryit: { t: "Break it deliberately",
    task: "Write a file with `print(nam)` when your variable is called `name`. Run it and read the error. Then write `print(\"hello\"` with no closing bracket and run that. Then `print(1/0)`. Three errors, three categories — say which is which before you look.",
    hint: "One of them is caught before anything runs at all. That is the syntax error.",
    sol: { lang: "python", code: "# NameError — runs, then fails at that line\nname = \"Aryan\"\nprint(nam)\n\n# SyntaxError — never runs at all\nprint(\"hello\"\n\n# ZeroDivisionError — a runtime error\nprint(1 / 0)" },
    w: "Deliberately causing errors is a real technique. Seeing what a mistake looks like *before* you make it by accident means you recognise it instantly when you do." } }
 ],
 k: [
  "Read tracebacks bottom-up: the last line is what failed, the frames above are where.",
  "Syntax errors happen before anything runs; runtime errors happen at the failing line; logic errors are never reported at all.",
  "A `SyntaxError` often points at the line *after* the real mistake — check for an unclosed bracket above it.",
  "Print your suspects instead of guessing, and change exactly one thing at a time."
 ],
 r: ["Stack Trace", "Syntax Error", "Runtime Error", "Debugging", "Exception"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "print(values)", w: "print a suspect value to see what it actually holds before the failing line" },
   { c: "Traceback (most recent call last):", w: "the header line that tells you the important frame is at the bottom", lang: "text" },
   { c: "ZeroDivisionError: division by zero", w: "the error type and message you get from dividing by zero", lang: "text" }
  ]
 }
},

{
 t: "Searching for an Answer Like an Engineer",
 m: "errors",
 lvl: "core",
 s: "Everyone looks things up. There is a right way, and it is a genuine skill.",
 goal: [
  "Turn an error into a search query that finds the answer",
  "Judge whether a Stack Overflow answer applies to you",
  "Use an AI assistant without losing the ability to work without one"
 ],
 b: [
  { p: "There is a fantasy that professional engineers hold everything in their heads. They do not. They look things up constantly — the difference is that they look things up *well*, and that is a learnable skill with concrete rules." },

  { h: "Rule 1 — search the error, not the feeling" },
  { vs: { t: "The same problem, searched two ways",
    bad: { c: "python not working csv file problem", label: "Describes your mood",
      w: "Matches ten thousand unrelated pages. Nothing here identifies your actual failure." },
    good: { c: "python FileNotFoundError: [Errno 2] No such file or directory csv", label: "Describes the failure",
      w: "The error type is a near-unique string. Whoever solved this wrote the same words." } } },
  { p: "Paste the **error type and message**. That is the part other people also saw, so it is the part that matches." },

  { h: "Rule 2 — strip out what is only yours" },
  { p: "File paths, variable names and line numbers are specific to you and will never match anyone. `/Users/aryan/projects/analysis.py` guarantees zero results. Delete your own details and keep the generic shape." },
  { code: { lang: "text", t: "Cutting a message down to its searchable core",
    lines: [
     { c: "TypeError: unsupported operand type(s) for +: 'int' and 'str'", w: "Keep all of this. Every word is generic and it is exactly what someone else searched." },
     { c: "  File \"/Users/aryan/projects/wk3/analysis.py\", line 47", w: "Drop it entirely. Nobody else has this path or this line number." }
    ] } },

  { h: "Rule 3 — say what you want, in their words" },
  { p: "When you are not fixing an error but trying to *do* something, the trick is to phrase it as a result." },
  { l: [
   "Not *how to make python read excel* but **`python pandas read excel file into dataframe`**",
   "Not *sql get most recent* but **`sql select most recent row per group`**",
   "Not *css put things in the middle* but **`css center div horizontally and vertically flexbox`**"
  ] },
  { p: "Include the language, the library, and the outcome. As you learn the vocabulary — and the dictionary in this product is exactly that vocabulary — your searches get sharper, and this is the main practical reason to learn the words." },

  { h: "Rule 4 — read the answer critically" },
  { p: "Stack Overflow is enormous and much of it is old. Before you paste anything in, check four things." },
  { ol: [
   "**How old is it?** A 2011 answer about Python may be about Python 2, which is a different language in places.",
   "**Read the comments under the answer.** *This is deprecated* or *this breaks in version 3* is very often sitting right there under a highly-upvoted answer.",
   "**Look past the accepted answer.** Accepted means it helped the person asking, in their situation, years ago. The answer below with more votes is frequently better.",
   "**Check it is your problem.** Same error type is not the same cause. `KeyError` from a dictionary and `KeyError` from a DataFrame have different fixes."
  ] },

  { trap: "Never paste a command you do not understand, and be especially wary of anything with `sudo` in it. The genuine risk is not malice — it is a well-meaning answer that fixes the symptom by breaking something else, like reinstalling a system Python. If you cannot say what a command does, either work it out first or do not run it." },

  { h: "Using an AI assistant well" },
  { p: "You have access to tools that will write the code for you. Used one way they accelerate you enormously; used another way they quietly prevent you from ever learning. The difference is entirely in how you ask." },
  { tbl: { h: ["Ask for", "Instead of", "Why"],
    rows: [
     ["*Explain what this error means*", "*Fix my code*", "You keep the understanding, which is the thing you are actually here for"],
     ["*Why does this line do X?*", "*Write the program*", "Understanding a line you wrote beats owning a line you did not"],
     ["*What is a better way to write this?*", "*Do it for me*", "You have a version already, so you can compare and see the improvement"],
     ["*Give me three practice exercises on loops*", "*Give me the answers*", "This is the use where AI is unambiguously excellent"]
    ] } },
  { n: "The honest test: could you write it again tomorrow, from an empty file, without help? If yes, the assistant made you faster. If no, it did the work and you watched. Both are legitimate at different times — but during the months you are learning, the second one is a trade you are making against yourself. The drills at the end of each lesson in this course exist precisely to keep that from happening.",
    nt: "The test that actually matters" },

  { h: "Rule 5 — go to the source" },
  { p: "The official documentation is better than its reputation, and it is the only thing guaranteed to describe the version you are running." },
  { l: [
   "`docs.python.org` — the Python standard library reference, and the tutorial is genuinely good",
   "`pandas.pydata.org/docs` — every function, with runnable examples",
   "`developer.mozilla.org` (MDN) — the definitive reference for HTML, CSS and JavaScript. Not a close contest",
   "`git-scm.com/docs` — the Git reference"
  ] },
  { p: "A useful habit: append `site:docs.python.org` to a search to restrict it to the official docs. It cuts through the tutorial farms instantly." }
 ],
 k: [
  "Search the error type and message, with your own paths and line numbers stripped out.",
  "Phrase a *how do I* search as language, library, outcome — the vocabulary is what makes searches land.",
  "Check the age, the comments and the alternative answers before trusting anything.",
  "Ask an assistant to explain rather than to fix, and test yourself by rewriting it from empty tomorrow."
 ],
 r: ["Documentation", "Stack Trace", "Debugging", "Technical Debt"],
 drill: {
  lang: "text",
  reps: 2,
  items: [
   { c: "python pandas read excel file into dataframe", w: "a search phrased as language, library and outcome" },
   { c: "TypeError: unsupported operand type(s) for +: 'int' and 'str'", w: "the generic part of an error message — the part worth searching" },
   { c: "site:docs.python.org", w: "the search operator that restricts results to the official Python docs" }
  ]
 }
}

]);
