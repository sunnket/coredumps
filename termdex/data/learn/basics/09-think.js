/* Programming Basics — thinking like a programmer, and what to do next. */
TD.addLessons("basics", [

{
 t: "Decomposition: Solving It Before You Type It",
 m: "think",
 lvl: "core",
 s: "The habit that separates people who can build things from people who only know syntax.",
 goal: [
  "Break a vague problem into steps small enough to code",
  "Write pseudocode that maps one line to one line",
  "Recognise the moment you should stop typing and start writing English"
 ],
 b: [
  { p: "You now know enough syntax to build real things. The thing that will stop you is not syntax — it is sitting in front of an empty file with a task like *build a tool that finds duplicate invoices* and having no idea what the first line is." },
  { p: "That feeling is not a gap in your knowledge of the language. It is the absence of a method, and the method is one idea: **a problem you cannot solve is a set of smaller problems you can.**" },

  { dg: "pseudocode" },

  { h: "The method" },
  { ol: [
   "**State the goal in one sentence**, with the inputs and the output named. If you cannot, you do not yet know what you are building — and that is the real finding.",
   "**Write the steps in English.** Numbered, each one an action. Do not think about code.",
   "**Any step you cannot picture doing gets broken down further**, recursively, until every step is obvious.",
   "**Translate each step into one or a few lines.** By now this is transcription, which is the easy part.",
   "**Test each step as you go**, rather than writing forty lines and running them once."
  ] },

  { h: "A worked example" },
  { p: "Task: *find duplicate invoices in a CSV file.* Vague, intimidating, and completely tractable." },

  { code: { lang: "text", t: "Step 1 — pin down what it means",
    lines: [
     { c: "Input:  a CSV of invoices", w: "" },
     { c: "Output: a list of the ones that look duplicated", w: "" },
     { c: "", w: "" },
     { c: "But what IS a duplicate?", w: "**This is the real work.** Same invoice number? Same supplier and amount on the same day? Same amount within a week? Nobody said. Ask — and if there is nobody to ask, decide, write the decision down, and make it easy to change." },
     { c: "", w: "" },
     { c: "Decision: same supplier + same amount + within 7 days", w: "Now the problem is specified. Half the difficulty of most tasks is here, before any code, and skipping it is why people write the wrong program correctly." }
    ] } },

  { code: { lang: "text", t: "Step 2 — the steps, in English",
    lines: [
     { c: "1. read the CSV into rows", w: "Obvious. One or two lines with the `csv` module." },
     { c: "2. for each row, build a key of supplier + amount", w: "Obvious. This is the count/group pattern." },
     { c: "3. group rows by that key", w: "Obvious. A dictionary of lists." },
     { c: "4. for each group with more than one row:", w: "" },
     { c: "5.     check whether any two are within 7 days", w: "**Not obvious.** Break it down further." },
     { c: "6. report those pairs", w: "Obvious." }
    ] } },

  { code: { lang: "text", t: "Step 3 — break down the one that is not obvious",
    lines: [
     { c: "5. within-7-days check, for one group:", w: "" },
     { c: "   5a. sort the group by date", w: "Now the candidates are adjacent, which is the whole trick." },
     { c: "   5b. compare each row with the next one", w: "One pass instead of every pair — and it turns an O(n squared) comparison into O(n log n)." },
     { c: "   5c. if the gap is 7 days or less, it is a match", w: "" }
    ],
    after: "Every step is now something you could write immediately. The problem that had no first line has eight, and none of them is hard." } },

  { code: { lang: "python", t: "Step 4 — the translation is mechanical now",
    lines: [
     { c: "rows = list(csv.DictReader(open(path)))", w: "step 1" },
     { c: "", w: "" },
     { c: "groups = {}", w: "step 3" },
     { c: "for r in rows:", w: "" },
     { c: "    key = (r[\"supplier\"], r[\"amount\"])", w: "step 2 — a tuple as a compound key, from the containers lesson" },
     { c: "    groups.setdefault(key, []).append(r)", w: "" },
     { c: "", w: "" },
     { c: "for key, group in groups.items():", w: "step 4" },
     { c: "    if len(group) < 2:", w: "" },
     { c: "        continue", w: "a guard clause, from the loops lesson" },
     { c: "    group.sort(key=lambda r: r[\"date\"])", w: "step 5a" },
     { c: "    for a, b in zip(group, group[1:]):", w: "step 5b — pairs of neighbours" },
     { c: "        if days_between(a, b) <= 7:", w: "step 5c" },
     { c: "            print(\"possible duplicate:\", a[\"id\"], b[\"id\"])", w: "step 6" }
    ],
    after: "Thirteen lines, and every one of them came from a numbered English step. Notice how much of this track showed up: dictionaries, tuples as keys, grouping, sorting, guard clauses, and a deliberate choice to avoid comparing every pair." } },

  { h: "Signals that you should stop typing" },
  { l: [
   "**You have been staring at the same line for five minutes.** You do not have a syntax problem; you have not decided what the line should do.",
   "**You are writing code to see what happens.** Exploration is fine in a REPL and expensive in a file.",
   "**You cannot say what a function returns before writing it.** Decide first — the signature is the design.",
   "**The function is past forty lines and you are lost inside it.** It contains several steps that want names.",
   "**You have three nested loops.** Almost always this is two operations that should be separate, or a data structure choice made too early."
  ] },

  { n: "Write the English steps **as comments in the file**, then fill in the code beneath each one. When you finish, delete the ones that merely restate the code and keep any that carry a reason. You get planning, a progress tracker and the beginnings of documentation from one activity — and it costs nothing.",
    nt: "Where to write the steps" },

  { h: "Working an example by hand first" },
  { p: "When a step still resists after breaking it down, do it manually with a tiny input — five rows on paper — and watch what your own brain does. You are executing an algorithm; write down what it was." },
  { p: "It sounds childish and it is how most algorithms were actually discovered. If you cannot do it by hand for five rows, you cannot instruct a machine to do it for five million, and no amount of syntax knowledge will bridge that." },

  { tryit: { t: "Decompose it",
    task: "*Given a folder of text files, find the ten most common words across all of them, ignoring case and common words like `the`.* Write the English steps. Do not write code.",
    hint: "Reading, cleaning, counting, filtering, ranking. Which one is not obvious?",
    sol: { lang: "text", code: "1. list every .txt file in the folder\n2. for each file:\n   2a. read the text\n   2b. lowercase it\n   2c. split into words\n   2d. strip punctuation from each word\n3. count every word across all files\n   -> dictionary: word as key, count as value\n4. remove the stop words (the, and, of, ...)\n   -> where does that list come from? Decision needed.\n5. sort the counts, highest first\n6. take the first ten\n7. print them\n\n# Steps 2c and 2d are the only interesting ones:\n# is \"don't\" one word or two? Is \"e-mail\"?\n# That is a decision, not a coding problem -- and\n# finding it now rather than halfway through is\n# the entire value of doing this first." },
    w: "Seven steps, each a line or two of code, and two genuine decisions surfaced before a single line was written. That is what decomposition buys you." } },

  { vocab: ["Pseudocode", "Algorithm", "Abstraction"] }
 ],
 k: [
  "A problem you cannot solve is a set of smaller problems you can. Break down any step you cannot picture doing.",
  "Specify what the task actually means before coding — most difficulty is undecided requirements, not syntax.",
  "Write the steps as comments and fill in the code beneath them. Roughly one English line becomes one code line.",
  "If you cannot do it by hand for five rows, you cannot instruct a machine to do it for five million."
 ],
 r: ["Algorithm", "Pseudocode", "Abstraction"]
},

{
 t: "Reading Code and Documentation",
 m: "think",
 lvl: "intermediate",
 s: "The skill you will use more than writing, and nobody ever teaches it.",
 goal: [
  "Get oriented in an unfamiliar codebase without reading all of it",
  "Read a function signature and know how to call it",
  "Extract what you need from documentation quickly"
 ],
 b: [
  { p: "You will spend far more time reading code than writing it — your own from three months ago, your colleagues', and the libraries you depend on. It is a distinct skill from writing, it is rarely taught, and it can be learned in an afternoon." },

  { h: "Reading an unfamiliar codebase" },
  { p: "The instinct is to open the first file and read from the top. This does not work and is demoralising. Do this instead." },

  { ol: [
   "**Run it first.** Get it working before understanding anything. What it *does* is the frame everything else hangs on, and a project you cannot run is a project you cannot explore.",
   "**Read the README, then the folder names.** Structure is the map: `models/`, `routes/`, `utils/`, `tests/` tell you the architecture in ten seconds.",
   "**Find the entry point.** `main.py`, `index.js`, `App.java`, the route definitions. Everything is reachable from there.",
   "**Follow one feature end to end.** Pick the smallest real thing the program does and trace it: request arrives → this function → this one → the database → the response. One complete path teaches more than ten files skimmed.",
   "**Read the tests.** Often the fastest documentation in the repository: each test shows exactly how a piece is meant to be called and what it should return, and it is guaranteed current because it runs.",
   "**Use *go to definition*.** Ctrl-click (or F12) on any name jumps to where it is defined; there is a *back* to return. This is how people actually navigate code, and it takes one minute to learn."
  ] },

  { trap: "Do not try to understand everything before changing anything. It is the most common way to lose a week. Understand enough to make one small change, make it, run the tests, and see what happens. Understanding built from contact with the code is faster and sticks better than understanding built from reading." },

  { h: "Reading a function you did not write" },
  { p: "There is an order that works, and it is not top to bottom." },

  { code: { lang: "python", t: "Read it in this order",
    lines: [
     { c: "def reconcile(ledger, statements, tolerance=0.01):", w: "**1. The signature.** What goes in, what is optional. Already you know it compares two things with some slack." },
     { c: "    \"\"\"Match ledger entries to bank statement lines.\"\"\"", w: "**2. The docstring**, if there is one." },
     { c: "    matched, unmatched = [], []", w: "**5. The middle, last.** Read the details only once you know the shape." },
     { c: "    for entry in ledger:", w: "" },
     { c: "        # ... 30 lines of matching logic ...", w: "" },
     { c: "    return matched, unmatched", w: "**3. The return.** Two lists. Now you know its whole contract without reading any logic." },
     { c: "", w: "" },
     { c: "results = reconcile(led, stmts)", w: "**4. A call site.** Find one real use — the tests are the best place. Seeing it used tells you more than any prose." }
    ],
    after: "Signature, docstring, return, a call site, then the body. Nine times out of ten you can stop after four and carry on with what you were doing." } },

  { h: "Reading documentation efficiently" },
  { p: "Documentation is a reference, not a book. Nobody reads it front to back and you should not feel you ought to." },

  { tbl: { t: "Which part to read, for which question",
    h: ["You want to…", "Read", "Not"],
    rows: [
     ["Get anything working at all", "Quickstart / Getting started", "The API reference"],
     ["Call a specific function", "That function's reference entry", "The tutorial"],
     ["Do a common task", "Examples / How-to / Cookbook", "The reference — it will not say *why*"],
     ["Understand *why* it works this way", "Concepts / Architecture / Design", "Anything else"],
     ["Work out why it behaves oddly", "**Changelog / release notes**", "Re-reading the same page"]
    ] } },

  { p: "That last row deserves emphasis. An enormous share of *the documentation is wrong* turns out to be documentation for a different version than the one installed. Check the version selector on the page and check what you installed. It is the first thing to verify, not the last." },

  { h: "Reading a signature in any language" },
  { p: "Signatures look different across languages and carry the same four facts. Once you can decode one, you can decode all of them." },

  { code: { lang: "text", t: "The same information, four spellings",
    lines: [
     { c: "def get(url, params=None, timeout=None) -> Response", w: "**Python.** One required argument, two optional with `None` defaults, returns a `Response`." },
     { c: "", w: "" },
     { c: "public List<User> findAll(String role, int limit)", w: "**Java.** Returns a list of users; both arguments required. `public` means anyone may call it." },
     { c: "", w: "" },
     { c: "func Get(url string) (*Response, error)", w: "**Go.** Returns **two** values — the result and an error. This is Go's whole error philosophy in one line, and you must handle both." },
     { c: "", w: "" },
     { c: "fn read_to_string(path: &Path) -> Result<String, Error>", w: "**Rust.** `Result` means it may fail, and the compiler will not let you ignore that. `&Path` means it borrows the path rather than taking ownership." }
    ],
    after: "Four facts every time: the name, what goes in (and what is optional), what comes back, and how it fails. Find those four and you can call anything." } },

  { h: "Searching well" },
  { l: [
   "**Search the error, not your code.** Paste the exception type and message; strip out your own file paths and variable names, which no one else has.",
   "**Add the language and library.** `python pandas SettingWithCopyWarning` beats `why is my dataframe warning`.",
   "**Prefer official docs and the library's own issue tracker** over aggregator sites. A GitHub issue often has the actual answer from the maintainer.",
   "**Check the date and the version** on anything you find. A confident answer from 2014 may be describing a library that no longer works that way — this is the most common way to be led astray.",
   "**When using an AI assistant, ask it to explain rather than to produce.** Pasted code you do not understand becomes a bug you cannot fix. *Why does this raise a KeyError* teaches you something; *write me the function* does not."
  ] },

  { n: "The most useful habit for reading your own code later: **write it for the version of you that has forgotten everything**, because that person shows up in about three weeks. Good names, small functions, and a comment on anything surprising. You are not doing this for a hypothetical colleague; you are doing it for yourself.",
    nt: "Reading your own code" },

  { tryit: { t: "Decode the signature",
    task: "Without any documentation, what can you say about how to call this and what you get back? `def to_csv(self, path=None, sep=',', index=True, columns=None) -> str | None`",
    hint: "Which arguments are required? What does the return type imply?",
    sol: { lang: "text", code: "- It is a METHOD (self), so you call it on an object:\n  df.to_csv(...)\n- EVERY argument is optional. df.to_csv() is valid.\n- sep defaults to a comma -> pass sep=\"\\t\" for TSV.\n- index=True means the row index is written by default;\n  index=False is almost certainly what you want.\n- columns=None probably means \"all of them\";\n  pass a list to select.\n- Returns `str | None`: a string OR nothing. That strongly\n  implies it returns the CSV text when path is None, and\n  writes to the file (returning nothing) when a path is given.\n\nAll of that from one line, with no docs open." },
    w: "That last inference — a return type of *string or nothing* implying two modes — is exactly the kind of reading that makes libraries feel easy. The signature is a summary of the documentation, and it cannot go out of date." } },

  { vocab: ["Documentation", "Code Review", "Refactoring"] }
 ],
 k: [
  "Run the code before reading it, then trace one feature end to end rather than reading files at random.",
  "Read a function as signature, docstring, return, a call site — and only then the body.",
  "The tests are usually the most accurate documentation in a repository, because they must stay current or they fail.",
  "When docs seem wrong, check the version first. It is the most common cause by a wide margin."
 ],
 r: ["Documentation", "Code Review", "Refactoring", "Technical Debt"]
},

{
 t: "Choosing Your First Language",
 m: "think",
 lvl: "core",
 s: "An honest comparison, and what to do in the first month so that it sticks.",
 goal: [
  "Pick a first language from what you want to build",
  "Know what the first month should actually look like",
  "Stop worrying about picking wrong"
 ],
 b: [
  { p: "You now hold every concept in this track. The next step is to spend them on a real language, and the choice matters less than the internet suggests — but it is not arbitrary, and there is a sensible way to decide." },

  { h: "Choose by what you want to build" },
  { p: "Not by salary surveys, not by which is *best*, and not by which was fastest in a benchmark. The only question that predicts whether you will still be doing this in three months is whether you can build something you actually want." },

  { tbl: { t: "What you want to make → what to learn",
    h: ["You want to build…", "Learn", "Why"],
    rows: [
     ["Data analysis, ML, AI, scientific work", "**Python**", "There is no real competition. The whole ecosystem is here."],
     ["Anything in a browser", "**JavaScript**", "It is the only language browsers run. HTML and CSS come with it."],
     ["Automating your own tedious work", "**Python**", "Shortest path from idea to working script."],
     ["Large backend systems, enterprise work", "**Java**, **C#** or **Go**", "Static types and mature tooling for big teams."],
     ["Games", "**C#** (Unity) or **C++** (Unreal)", "The engines decide this for you."],
     ["iPhone apps", "**Swift**", "Same reason."],
     ["Android apps", "**Kotlin**", "Same reason."],
     ["Systems, embedded, performance-critical", "**Rust** or **C**", "Direct memory control. Not a first language."],
     ["Working with data in any job at all", "**SQL**", "Learn it alongside whatever else. It outlives every framework."]
    ] } },

  { p: "If none of those is a clear yes: **learn Python.** It has the gentlest syntax, the least ceremony between an idea and a running program, the largest supply of good teaching material, and it is genuinely used for serious work. Add **SQL** immediately after, because it is small, it is everywhere, and it never goes out of date." },

  { h: "What the second language teaches you" },
  { p: "The first language is expensive because you are learning the concepts and the syntax at once. You have just removed half of that cost — which means your first language will be faster than it would otherwise have been, and your second will be surprisingly quick." },
  { p: "It is also worth choosing a second language that is *different*, not similar. Python then JavaScript teaches you relatively little; Python then Go or Rust teaches you what static types, compilation and explicit memory actually buy, and it makes you better at Python." },

  { h: "The first month, honestly" },

  { ol: [
   "**Week 1 — set it up and run things.** Install it, get an editor working, run scripts from a terminal, make errors happen deliberately and read them. This is the Ground Zero track, applied.",
   "**Weeks 2–3 — put the concepts into the syntax.** Everything in this track, now with real punctuation: variables, conditions, loops, functions, lists, dictionaries, files, errors. Type every example rather than reading it. The gap between reading code and writing it is much wider than it feels.",
   "**Week 4 — build one small thing that is yours.** Not a tutorial project. Something you personally want, however trivial: rename a folder of photos by date, total a bank export, scrape one number off a website daily. The point is that finishing it matters to you."
  ] },

  { trap: "**Tutorial hell** is the failure mode, and nearly everyone passes through it. You complete course after course, each one feels comprehensive, and you still cannot start an empty file. The cause is that following along exercises recognition, not recall — and building requires recall. The cure is uncomfortable and reliable: after each tutorial section, close it and rebuild the thing from memory. You will fail, look things up, and *that* is the part where the learning happens." },

  { h: "Habits that compound" },
  { l: [
   "**Type it out.** Every example. Copy-paste teaches nothing, and the typos you make are where the understanding comes from.",
   "**Break things deliberately.** Delete a colon, misspell a name, divide by zero. Reading errors on purpose, when you already know the cause, makes them readable when you do not.",
   "**Use version control from day one.** `git init` on your very first project. It is a Ground Zero-level skill and it makes experimentation free.",
   "**Read code you did not write.** A small library, a colleague's script, a GitHub project. Fluency in reading arrives before fluency in writing, and it pulls the writing along.",
   "**Build in public, or at least in a folder.** Finished small things beat one unfinished large thing, every time.",
   "**Take breaks properly.** Almost every long-stuck bug is solved after a walk. This is not a metaphor about work-life balance — it is a debugging technique."
  ] },

  { h: "Things not to worry about" },
  { l: [
   "**Picking the wrong language.** The concepts transfer, which is the entire premise of this track. Nobody has wasted a month by learning Python and later moving to Go.",
   "**Not being a maths person.** Most programming is logic, naming and structure. Maths matters for machine learning, graphics and cryptography, and not much elsewhere.",
   "**Being too late.** The field reinvents itself every few years, which means everyone is a beginner at something all the time.",
   "**Memorising syntax.** Professionals look things up constantly. What you must hold in your head is the *concepts* — which is precisely what you now have.",
   "**Whether AI makes this pointless.** It does not: it raises the value of being able to read code, judge whether it is right, and debug it — because those are the skills you need to supervise anything it produces. Being unable to evaluate generated code is a genuinely bad position to be in."
  ] },

  { q: "The only way to learn a new programming language is by writing programs in it.", by: "Kernighan & Ritchie, The C Programming Language, 1978" },

  { h: "Where to go from here in this course" },
  { p: "The tracks in this section were built to be taken in this order, though nothing stops you jumping." },
  { l: [
   "**Ground Zero** — if the terminal, editors or paths are still shaky, do this one first. Everything else assumes it.",
   "**Python** — the full road, from your first line through pandas to data that no longer fits in memory. The natural next step from here.",
   "**SQL** — small, permanent, and useful in almost any job. Can be learned alongside anything else.",
   "**Git** — version control. Start it in your first week of real coding, not your first year.",
   "**HTML and CSS** — if the browser is where you want to build."
  ] },

  { tryit: { t: "Commit to something specific",
    task: "Write down three things, honestly: what you want to build, which language that implies, and the one small project you will finish in your first month.",
    hint: "The project should be genuinely small — finishable in a few evenings — and genuinely yours.",
    sol: { lang: "text", code: "Example answers that work:\n\n\"I want to analyse my own spending.\"\n  -> Python. Project: read the bank CSV, total by category,\n     print the top five. One evening. Then chart it.\n\n\"I want a website for my band.\"\n  -> HTML + CSS, then JavaScript.\n     Project: one page, hosted, real.\n\n\"My job has me copying between spreadsheets.\"\n  -> Python. Project: automate exactly that one task.\n     This is the best category -- you will finish it,\n     because not finishing it costs you time every week.\n\n\"I want to work in AI.\"\n  -> Python, then the maths. Project: train a model on a\n     Kaggle dataset and be able to explain what it did." },
    w: "The third example is the strongest and the most underrated. A project that removes a real annoyance from your own week gets finished, gets used, gets improved — and is worth more than any number of half-completed tutorials." } },

  { vocab: ["Python", "JavaScript", "SQL", "Version Control"] }
 ],
 k: [
  "Choose a first language by what you want to build. If nothing is obvious, Python — and SQL alongside it.",
  "Your first language is faster now, because you already hold the concepts. The syntax is the small part.",
  "Escape tutorial hell by closing the tutorial and rebuilding from memory. Recognition is not recall.",
  "Nothing here is wasted if you switch languages later. That is the entire point of learning the concepts first."
 ],
 r: ["Python", "JavaScript", "SQL", "Version Control", "Compiler", "Interpreter"]
}

]);
