/* Python — getting oriented. */
TD.addLessons("python", [

{
 t: "What You Are About to Learn",
 m: "brief",
 lvl: "core",
 s: "The shape of the language, before any of the details — so the details have somewhere to land.",
 goal: [
  "Describe what makes Python different from most other languages",
  "Explain why indentation is part of the grammar rather than a style choice",
  "Set a realistic expectation of what the next few weeks feel like"
 ],
 b: [
  { p: "You have read the briefing on the track page — what Python is, why it was invented, what it is good and bad at. This lesson is the next layer down: not what Python is *for*, but what it is actually *like*, so that when the details arrive you have somewhere to put them." },

  { h: "Three decisions that shaped everything" },
  { p: "Almost every feature of Python traces back to three early decisions. Knowing them turns a hundred arbitrary rules into three consequences." },

  { p: "**One — readability is the priority.** Guido van Rossum's stated aim was that code is read far more often than it is written, so the language should optimise for the reader. This is why Python says `and` instead of `&&`, `not` instead of `!`, `elif` instead of `else if`. It is why there is usually one obvious way to do something rather than five clever ones. When you wonder why Python does something the long way round, this is nearly always the answer." },

  { p: "**Two — indentation is the grammar.** In most languages, curly braces `{ }` mark where a block begins and ends, and indentation is decoration that a careless programmer can get wrong. Python removed the braces and promoted the indentation. The block *is* the indented region." },

  { vs: { t: "The same logic, two languages",
    bad: { c: "if (x > 5) {\n    print(\"big\");\n}", label: "JavaScript — braces decide, indentation is cosmetic", lang: "javascript",
      w: "The braces define the block. You could write this on one line with no indentation and it would run identically — which is exactly how badly formatted code happens." },
    good: { c: "if x > 5:\n    print(\"big\")", label: "Python — indentation decides", lang: "python",
      w: "The colon opens a block and the indentation *is* the block. There is no way to write badly indented Python that still runs, because the indentation is the meaning." } } },
  { p: "People find this alarming for about a week and then never think about it again. The trade is real: you can no longer misformat code, and in exchange you must be exact about whitespace. Modern editors handle this for you, and it is why format-on-save was in the setup lesson." },

  { p: "**Three — you do not declare types.** In many languages you must announce that a variable holds a whole number before you use it. In Python you simply put a value in a name, and the *value* knows what it is." },
  { code: { lang: "python", t: "The same variable, three different kinds of value",
    lines: [
     { c: "x = 5", w: "`x` now refers to a whole number. Nothing was declared — Python worked it out from what you wrote." },
     { c: "x = \"five\"", w: "And now the same name refers to a piece of text. This is completely legal, and in a language like Java it would be a compile error." },
     { c: "x = [5, \"five\", 5.0]", w: "And now a list holding three different kinds of thing at once. Python is not checking; it is trusting you." }
    ],
    after: "This is called **dynamic typing**, and it is a genuine trade. It makes small programs fast to write and it makes large programs easier to break, because a mistake about what a variable holds is not caught until that line runs. The Pythonic module later covers *type hints*, which buy back much of the safety without giving up the flexibility." } },

  { h: "What a piece of Python actually looks like" },
  { p: "Before pulling anything apart, look at a complete, working, slightly-real program. You are not expected to follow every line — the point is to see the shape." },

  { code: { lang: "python", file: "report.py", t: "A real, if small, program. Read it like a page of prose.",
    lines: [
     { c: "scores = [72, 91, 65, 88, 79]", w: "A **list** — several values under one name, in order, written between square brackets." },
     { c: "", w: "" },
     { c: "def grade(score):", w: "`def` starts a **function** definition: a named piece of work you can run later. `score` is a placeholder for whatever gets handed in. The colon opens the block." },
     { c: "    if score >= 85:", w: "Indented, so it is inside the function. A **condition** — and another colon, opening another block." },
     { c: "        return \"A\"", w: "Indented twice: inside the function, inside the `if`. `return` hands a value back to whoever called this." },
     { c: "    elif score >= 70:", w: "`elif` is *else if* — only checked when the first condition was false. Back out one level of indentation, so it belongs to the `if`, not to the `return`." },
     { c: "        return \"B\"" },
     { c: "    else:", w: "The catch-all when nothing above matched." },
     { c: "        return \"C\"" },
     { c: "", w: "" },
     { c: "for score in scores:", w: "A **loop**: do the following once for every item in `scores`, calling it `score` each time round." },
     { c: "    print(score, grade(score))", w: "Inside the loop. `grade(score)` **calls** the function defined above and hands it this item; `print` displays both values." },
     { c: "", w: "" },
     { c: "average = sum(scores) / len(scores)", w: "`sum` and `len` are built in — they add everything up and count the items. Division with `/`." },
     { c: "print(f\"Average: {average:.1f}\")", w: "An **f-string**: the `f` before the quote lets you drop values straight into text inside `{ }`. The `:.1f` means *one decimal place*." }
    ],
    out: "72 B\n91 A\n65 C\n88 A\n79 B\nAverage: 79.0",
    after: "Fifteen lines, and it contains lists, functions, conditions, loops, built-in helpers and formatted output — which is close to everything in the first half of this track. Come back and read it again after the functions module; it will read like English." } },

  { h: "What the next few weeks feel like" },
  { p: "An honest expectation, because a wrong one is why people quit." },
  { l: [
   "**Week one is mechanical.** Variables, printing, arithmetic. It feels too easy and slightly pointless. That is correct — you are learning the alphabet, and nobody finds the alphabet interesting.",
   "**Week two is the wall.** Loops and functions arrive and it stops being obvious. This is where most people conclude they are not cut out for it. They are wrong; this is simply where the actual thinking starts, and everybody finds it hard.",
   "**Week three is the click.** You write something ten lines long that solves a problem you actually had, and the whole thing reframes. Everyone who codes remembers this moment.",
   "**After that it is vocabulary.** The concepts stop being new and you spend your time learning what already exists — which is what the dictionary in this product is for."
  ] },
  { n: "The single strongest predictor of whether someone learns to program is not aptitude — it is whether they type the code out instead of reading it. Reading code creates a convincing feeling of understanding that vanishes the moment you face an empty file. That gap is exactly what the practice panel at the end of every lesson exists to close. Do the drills. They are the lesson.",
    nt: "The thing that actually decides it" }
 ],
 k: [
  "Python optimises for the reader, which explains most of its syntax choices.",
  "Indentation is not style — it *is* the block structure, and there is no way to misindent working Python.",
  "Types belong to values, not to names; a variable can hold anything and Python will not stop you.",
  "The difficulty curve is easy, then hard at loops and functions, then it clicks. That order is normal."
 ],
 r: ["Python", "Dynamic Typing", "Indentation", "Syntax", "Function"]
},

{
 t: "How Python Runs Your File",
 m: "brief",
 lvl: "core",
 s: "Top to bottom, one line at a time — and the three ways that assumption bites you.",
 goal: [
  "Predict the order in which lines of a Python file execute",
  "Explain why a function can be defined anywhere but only called after it is defined",
  "Say what `__pycache__` is and why you should ignore it"
 ],
 b: [
  { p: "Python's execution model is almost insultingly simple, and getting it exactly right prevents a specific set of confusions that beginners hit repeatedly." },
  { p: "**The rule: Python reads your file from the top, one line at a time, and does what each line says.** When it reaches the bottom, the program ends. That is it. There is no main function it hunts for, no setup phase, no second pass." },

  { h: "Defining is not running" },
  { p: "The one subtlety is what happens at a `def`. When Python reaches a function definition, it does **not** run the body. It reads the whole indented block, packages it up, attaches the name to it, and moves on. The body only runs later, when something calls it." },

  { code: { lang: "python", t: "Trace the order the lines actually execute in",
    lines: [
     { c: "print(\"one\")", w: "Runs immediately. **Executes 1st.**" },
     { c: "", w: "" },
     { c: "def shout():", w: "Python reads this and creates a function object named `shout`. It does **not** run the body. **Executes 2nd** — but nothing is printed." },
     { c: "    print(\"two\")", w: "Skipped entirely for now. It is part of the package, not something happening yet." },
     { c: "", w: "" },
     { c: "print(\"three\")", w: "**Executes 3rd.**" },
     { c: "shout()", w: "*Now* the body runs. The parentheses are what make it happen — `shout` on its own would just be a reference to the function. **Executes 4th**, printing `two`." }
    ],
    out: "one\nthree\ntwo",
    after: "`two` appears last, even though it is written second. That is the whole lesson: the position of a `def` in a file has nothing to do with when its body runs." } },

  { trap: "Because definitions run top-down, you cannot call a function on a line **above** where it is defined at the top level of a file — Python has not reached the `def` yet, so the name does not exist and you get a `NameError`. This is why almost every Python file has all its functions at the top and the code that actually does something at the bottom." },

  { h: "Where imports fit" },
  { p: "An `import` is not a compiler instruction; it is an ordinary line that runs when Python reaches it. It goes and finds another file, **runs that entire file top to bottom**, and binds the result to a name." },
  { code: { lang: "python",
    lines: [
     { c: "import math", w: "Finds Python's `math` module, runs it, and makes it available as `math`. Because this is a real statement, its cost is paid where it sits." },
     { c: "print(math.sqrt(16))", w: "The dot means *look inside `math` for something called `sqrt`*. This is the same dot you will see everywhere in Python." }
    ],
    out: "4.0",
    after: "Imports go at the very top of a file by convention — not because Python requires it, but because a reader should be able to see every dependency without scrolling." } },

  { h: "The __pycache__ folder" },
  { p: "The first time you import a file, Python compiles it to **bytecode** — the intermediate form from the Ground Zero compiling lesson — and caches it in a folder called `__pycache__`, so the next import skips the translation." },
  { l: [
   "You never edit it, never commit it, and never think about it.",
   "It appears automatically and regenerates automatically. Deleting it is always safe.",
   "It goes in your `.gitignore`, which the Git track covers.",
   "It is not created for the file you run directly — only for files you import."
  ] },

  { h: "The if __name__ block" },
  { p: "You will see this at the bottom of nearly every serious Python file, and it looks like nonsense until you know the rule above." },
  { syn: { t: "The line, taken apart",
    parts: [
     { p: "if ", w: "An ordinary condition. Nothing special is happening here." },
     { p: "__name__", w: "A variable Python sets automatically in every file. It holds the string `\"__main__\"` when this file is **the one being run directly**, and the file's own name when it is being **imported by something else**." },
     { p: " == ", w: "Comparison. Two equals signs, because one would mean assignment." },
     { p: "\"__main__\"", w: "The literal string Python uses to mean *this is the file the user launched*." },
     { p: ":", w: "Opens the block, as every colon does." }
    ],
    after: "Read the whole line as: **only do the following if this file is being run directly, not when it is imported.** That lets one file be both a usable program and a reusable library." } },
  { code: { lang: "python", file: "tools.py",
    lines: [
     { c: "def add(a, b):", w: "A function worth reusing from other files." },
     { c: "    return a + b" },
     { c: "", w: "" },
     { c: "if __name__ == \"__main__\":", w: "Everything below is for when *this* file is run directly." },
     { c: "    print(add(2, 3))", w: "So `python tools.py` prints 5 — but `import tools` from another file quietly gets `add` and prints nothing." }
    ],
    out: "5",
    after: "Without the guard, importing `tools` would print 5 as a side effect, because an import runs the whole file. That is the problem this line solves, and now you know why it is everywhere." } },

  { n: "You do not need to write this yet. It is here because you will see it in every example you read from today onward, and an unexplained incantation is worse than a slightly early explanation.",
    nt: "You will meet it before you need it" }
 ],
 k: [
  "Python executes top to bottom, one line at a time. There is no entry point it searches for.",
  "A `def` creates the function and does not run its body — only a call with `()` does that.",
  "You cannot call a top-level function before the line that defines it.",
  "`if __name__ == \"__main__\":` means *only when run directly, not when imported*."
 ],
 r: ["Interpreter", "Bytecode", "Module", "Import", "Function"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import math", w: "bring in Python's built-in maths module" },
   { c: "print(math.sqrt(16))", w: "call the square-root function from inside the math module" },
   { c: "def shout():", w: "begin defining a function called shout that takes no arguments", hint: "keyword, name, parentheses, colon" },
   { c: "if __name__ == \"__main__\":", w: "guard the code that should only run when this file is executed directly", hint: "two underscores each side, and two equals signs" }
  ]
 }
}

]);
