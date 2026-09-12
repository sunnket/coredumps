/* Programming Basics — the advanced ideas to hold before a hard language. */
TD.addLessons("basics", [

{
 t: "Memory: The Stack, the Heap and the Collector",
 m: "craft",
 lvl: "advanced",
 s: "Where your values physically live, and why C and Rust make you think about it while Python does not.",
 goal: [
  "Say what goes on the stack and what goes on the heap",
  "Explain what a garbage collector does and what it costs",
  "Understand why some languages have pointers and others hide them"
 ],
 b: [
  { p: "Everything so far has treated memory as infinite and invisible. In Python, JavaScript, Java, Go and C# it mostly is. The moment you go near C, C++, Rust, embedded work, game engines or a performance problem, it stops being invisible — and the concepts underneath are the same ones you already met in the call stack lesson, made explicit." },

  { dg: "stack-heap" },

  { h: "Two regions, two disciplines" },

  { tbl: { t: "The stack and the heap",
    h: ["", "The stack", "The heap"],
    rows: [
     ["What lives there", "Function frames: parameters, local variables, the return address", "Everything whose size or lifetime is not known in advance — lists, objects, strings, buffers"],
     ["Organised as", "A strict pile. Push on call, pop on return.", "A large open area, allocated in pieces"],
     ["Speed", "Extremely fast — moving one pointer", "Slower — the allocator must find a suitable free space"],
     ["Size", "Small. A few megabytes. A few thousand frames.", "Large. Essentially all your RAM."],
     ["Cleaned up", "Automatically, the instant the function returns", "This is the hard question, and languages answer it differently"],
     ["Fails with", "**Stack overflow** — too many nested calls", "**Out of memory** — you allocated more than exists"]
    ] } },

  { p: "This is why local variables vanish when a function returns: their frame was popped off the stack, and *popping* is nothing more than moving a marker back down. It costs one instruction. It is also why recursion is limited — each level is another frame on a small pile." },

  { p: "The heap holds the things a frame cannot: a list whose length is decided at runtime, an object that must outlive the function that created it. And a variable on the stack usually holds not the object but its **address** on the heap — which is precisely the *label, not a box* picture from the values module, made physical. `b = a` copies an address. Now the diagram is not a metaphor." },

  { h: "Three answers to \"who frees the heap?\"" },

  { code: { lang: "c", t: "1 · Manual — C and C++",
    lines: [
     { c: "int *data = malloc(1000 * sizeof(int));", w: "Ask the operating system for space. You now own it, and nothing will reclaim it for you." },
     { c: "// ... use it ...", w: "" },
     { c: "free(data);", w: "Hand it back. **Forget this line and the memory is lost for the life of the process** — a memory leak. A server that leaks a little per request dies in a week." },
     { c: "data = NULL;", w: "Because `free` does not change your pointer. Use it after freeing — a *use-after-free* — and you are reading memory that now belongs to something else. This is not merely a crash; it is one of the most exploited security vulnerabilities in existence." }
    ],
    after: "Total control, total responsibility. The overwhelming majority of serious security vulnerabilities in the last thirty years — buffer overflows, use-after-free, double-free — come from this model. It is also why C is still used where every byte and cycle counts." } },

  { p: "**2 · Garbage collection — Java, Python, JavaScript, Go, C#.** A background process tracks which heap objects are still reachable from your variables, and frees the rest. You never call `free`. This eliminates an entire class of bug and a large fraction of all security vulnerabilities." },

  { dg: "memory-leak" },

  { p: "It is not free, though. The collector must run, and while it does your program may pause — historically for tens of milliseconds, which is invisible in a web request and fatal in a game frame or a trading system. Modern collectors are extraordinarily good and mostly concurrent, but *mostly* is the operative word, and tuning them is a real specialism." },

  { trap: "Garbage collection does not prevent memory leaks; it prevents *forgetting to free*. If you keep a reference to something, the collector must assume you want it. A global list that grows forever, an event listener never removed, a cache with no eviction — all leak in Python and Java exactly as they would in C. The rule becomes: **leaks are now caused by remembering, not by forgetting.**" },

  { p: "**3 · Ownership — Rust.** The newest answer and the most interesting. The compiler tracks, at compile time, exactly which variable *owns* each piece of memory and when that owner goes out of scope. It then inserts the `free` itself. No collector, no pauses, no manual `free`, and use-after-free is a compile error rather than a vulnerability." },

  { code: { lang: "rust", t: "Ownership, in four lines",
    lines: [
     { c: "let a = String::from(\"hello\");", w: "`a` owns this string on the heap." },
     { c: "let b = a;", w: "Ownership **moves** to `b`. There is exactly one owner at any time." },
     { c: "println!(\"{}\", a);", w: "**Compile error:** *borrow of moved value: `a`*. The aliasing bug from the values module is not a runtime surprise here — it is impossible to write." },
     { c: "// when b goes out of scope, the memory is freed", w: "Automatically, deterministically, with no collector and no pause." }
    ],
    after: "This is why Rust has a reputation for a hard learning curve and for producing software that does not fall over. The compiler is enforcing rules that other languages leave to your discipline or defer to a garbage collector." } },

  { h: "What this means for you" },
  { l: [
   "In a garbage-collected language you can ignore almost all of it — but knowing it explains stack overflows, recursion limits, why huge lists are slow, and why an object you thought was gone is still using RAM.",
   "**Value versus reference is the practical half.** Numbers and booleans are small and copied. Lists and objects are heap-allocated and shared by address. Everything in the aliasing lesson is this fact.",
   "If you go near C, C++, Rust, embedded systems or game engines, this stops being background and becomes the daily material.",
   "When something is mysteriously slow or eating memory, this is the layer the answer lives in."
  ] },

  { tryit: { t: "Stack or heap?",
    task: "For a typical language, where does each of these live?",
    hint: "Fixed size and short-lived goes on the stack; variable size or long-lived goes on the heap.",
    sol: { lang: "text", code: "int count = 5 inside a function\n  -> stack. Fixed size, dies with the frame.\n\nA list of 10,000 items\n  -> heap (the data). The variable holding it is on the stack\n     and contains the address.\n\nA function's parameters\n  -> stack. Part of the frame.\n\nAn object returned from a function\n  -> heap. It has to outlive the frame that made it -- which\n     is exactly why it could not have been on the stack.\n\nA recursive function 5,000 levels deep\n  -> 5,000 stack frames. This is where you overflow." },
    w: "The third and fourth answers together are the whole reason the heap exists: a stack frame cannot hold anything that must survive its own function returning." } },

  { vocab: ["Stack", "Heap", "Garbage Collection", "Memory Leak", "Pointer", "Pass by Value vs Reference"] }
 ],
 k: [
  "The stack holds function frames and is cleaned automatically on return; the heap holds anything variable-sized or long-lived.",
  "Three answers to freeing the heap: manual (C, and the source of most security bugs), garbage collection (most languages), ownership (Rust, checked at compile time).",
  "Garbage collection stops you forgetting to free — it cannot stop you from remembering forever. Growing globals and caches still leak.",
  "*Value versus reference* is this distinction in everyday clothes, and it is why `b = a` shares a list but copies a number."
 ],
 r: ["Stack", "Heap", "Garbage Collection", "Memory Leak", "Pointer", "Buffer Overflow"]
},

{
 t: "Big-O: Why Code Gets Slow",
 m: "craft",
 lvl: "advanced",
 s: "A way of talking about cost that ignores the machine and predicts the disaster.",
 goal: [
  "Read O(n), O(n log n) and O(n²) and say what each means",
  "Work out the complexity of a loop by looking at it",
  "Recognise the three or four cases that matter in real work"
 ],
 b: [
  { p: "Big-O notation is the most interview-fetishised topic in programming and one of the genuinely useful ones, provided you take the practical version rather than the mathematical one. The practical version is a single question: **when the input gets ten times bigger, what happens to the time?**" },

  { dg: "bigo" },

  { h: "The notation" },
  { p: "`O(n)` means *the work grows in proportion to the size of the input*. `n` is the input size. Constants and smaller terms are deliberately ignored — `O(2n + 7)` is written `O(n)` — because on a large enough input the shape dominates everything else, and the shape is what you can actually change." },

  { tbl: { t: "The six you need, with real numbers",
    h: ["Notation", "Name", "n = 1,000", "n = 1,000,000", "Typical example"],
    rows: [
     ["**O(1)**", "Constant", "1", "1", "Dictionary lookup, array index, appending"],
     ["**O(log n)**", "Logarithmic", "10", "20", "Binary search, balanced tree, database index"],
     ["**O(n)**", "Linear", "1,000", "1,000,000", "One loop over the data. Summing, filtering, `in` on a list"],
     ["**O(n log n)**", "Linearithmic", "10,000", "20,000,000", "Any good sort. This is as fast as general sorting gets"],
     ["**O(n²)**", "Quadratic", "1,000,000", "10¹²", "Nested loops over the same data. **The danger zone**"],
     ["**O(2ⁿ)**", "Exponential", "unimaginable", "unimaginable", "Naive recursion over all subsets. Unusable past n≈40"]
    ] } },

  { p: "Read across that table once and the point lands: between `O(n)` and `O(n²)` at a million items there is a factor of a million. No faster machine, no better language and no compiler flag will close that gap. Algorithm choice is the only lever with that much travel — which is why it is worth an hour of your attention and why interviewers keep asking." },

  { h: "Reading it off the code" },
  { p: "You do not need to derive anything. Three rules cover nearly every case you will meet." },

  { code: { lang: "python", t: "Rule 1 — count the nesting",
    lines: [
     { c: "for x in items:", w: "One loop over n items → **O(n)**." },
     { c: "    print(x)", w: "" },
     { c: "", w: "" },
     { c: "for x in items:", w: "" },
     { c: "    for y in items:", w: "A loop inside a loop over the same data → n × n → **O(n²)**." },
     { c: "        compare(x, y)", w: "" },
     { c: "", w: "" },
     { c: "for x in items:", w: "" },
     { c: "    print(x)", w: "" },
     { c: "for y in items:", w: "Two loops **in sequence**, not nested → n + n → still **O(n)**. Sequential work adds; nested work multiplies. Only multiplication is dangerous." },
     { c: "    print(y)", w: "" }
    ] } },

  { code: { lang: "python", t: "Rule 2 — the hidden loops are the ones that get you",
    lines: [
     { c: "for order in orders:", w: "O(n)…" },
     { c: "    if order.id in id_list:", w: "…but `in` on a **list** is itself O(m). Total: **O(n × m)**. This line does not look like a loop and is one." },
     { c: "", w: "" },
     { c: "for order in orders:", w: "" },
     { c: "    if order.id in id_set:", w: "`in` on a **set** is O(1). Total: **O(n)**. One character of type difference, one whole order of growth." },
     { c: "", w: "" },
     { c: "for row in rows:", w: "" },
     { c: "    db.query(row.id)", w: "The **N+1 query problem**: a database round trip per row. Technically O(n), practically catastrophic — n network round trips at a millisecond each. Fetch them all in one query instead." },
     { c: "", w: "" },
     { c: "output = \"\"", w: "" },
     { c: "for line in lines:", w: "" },
     { c: "    output += line", w: "In most languages strings are immutable, so each `+=` copies the whole accumulated string → **O(n²)**. Use `\"\".join(lines)`, a `StringBuilder`, or a list you join at the end." }
    ] } },

  { p: "**Rule 3 — halving is a logarithm.** Any time an algorithm repeatedly discards half of what remains, that is `O(log n)`. Binary search, balanced trees, database B-tree indexes, `git bisect`. The reason logarithms feel like magic in the table above is that doubling the data adds *one* step." },

  { h: "What actually matters in practice" },
  { p: "Three honest observations that the interview version of this topic tends to omit." },
  { l: [
   "**Almost all real performance problems are one of three things**: an accidental O(n²) from a nested or hidden loop; a query or network call inside a loop; or repeatedly searching a list that should have been a set or dictionary. Learn to spot those three and you have most of the practical value.",
   "**Constants matter at small n.** An O(n²) algorithm on 50 items is instant. Do not restructure code that will never see a large input — that is where *premature optimisation* earns its reputation.",
   "**Measure before optimising.** Your intuition about which line is slow is usually wrong. Use a profiler; it will point at something you did not suspect."
  ] },

  { n: "There is a space axis too. `O(n)` **space** means memory grows with the input — building a dictionary of every row is O(n) space. Sometimes you deliberately trade one for the other: indexing a list into a dictionary costs memory and buys you O(1) lookups. That is the *space–time trade-off*, and caching is the same idea at every scale from a CPU to a CDN.",
    nt: "The other axis" },

  { q: "Premature optimisation is the root of all evil. Yet we should not pass up our opportunities in that critical three per cent.", by: "Donald Knuth" },

  { p: "The second sentence is usually cut, and it is the important half. Do not micro-optimise everything — but do not shrug at an O(n²) in the hot path either. The distinction is whether the code is on the path that runs on the big data." },

  { tryit: { t: "Name the complexity",
    task: "What is the time complexity of each, in terms of n = len(items)?",
    hint: "Nested multiplies. Sequential adds. Halving is a log. Watch the hidden loops.",
    sol: { lang: "python", code: "1. for x in items: print(x)                -> O(n)\n\n2. for x in items:\n       for y in items: pass                -> O(n^2)\n\n3. items.sort()                            -> O(n log n)\n\n4. seen = set()\n   for x in items:\n       if x not in seen: seen.add(x)       -> O(n)\n\n5. seen = []\n   for x in items:\n       if x not in seen: seen.append(x)    -> O(n^2)  !!\n\n6. return items[len(items) // 2]            -> O(1)\n\n7. while n > 1: n = n // 2                  -> O(log n)" },
    w: "4 and 5 are the same six lines of code with one container swapped, and they are a whole order of growth apart. That pair is the single most valuable thing to take from this lesson — it is a real pattern people write, and the fix is two characters." } },

  { vocab: ["Big O Notation", "Time Complexity", "Space Complexity", "Binary Search", "Profiling"] }
 ],
 k: [
  "Big-O answers one question: when the input grows ten times, what happens to the time?",
  "Nested loops multiply and become O(n²). Sequential loops add and stay O(n). Only multiplication is dangerous.",
  "The hidden loops cause most real problems: `in` on a list, string `+=` in a loop, and a database query per row.",
  "Measure before optimising, and do not restructure code that will never see large input."
 ],
 r: ["Big O Notation", "Time Complexity", "Space Complexity", "Binary Search", "Hash Table", "Profiling"]
},

{
 t: "Paradigms: Four Ways to Say the Same Thing",
 m: "craft",
 lvl: "intermediate",
 s: "Imperative, object-oriented, functional and declarative — what the words mean and why nobody is pure.",
 goal: [
  "Recognise which paradigm a piece of code is written in",
  "Say what each is genuinely good at",
  "Stop treating them as tribes"
 ],
 b: [
  { p: "A **paradigm** is a style of organising a program — a default answer to *what is the main thing my code is made of?* Steps? Objects? Transformations? Descriptions? You will meet all four, usually in the same file, and knowing the names makes documentation, job adverts and arguments legible." },

  { dg: "paradigms" },

  { h: "Imperative: a sequence of steps" },
  { p: "The oldest and most direct style. You state *how*, step by step, changing state as you go. Every loop you have written in this track is imperative." },

  { code: { lang: "python", t: "Total the paid orders",
    lines: [
     { c: "total = 0", w: "Create some state." },
     { c: "for order in orders:", w: "Walk through, step by step." },
     { c: "    if order.paid:", w: "" },
     { c: "        total += order.amount", w: "Modify the state as you go. The *how* is entirely visible, which is both its strength and its cost." },
     { c: "print(total)", w: "" }
    ] } },

  { l: [
   "**Good at:** anything where the sequence genuinely matters, low-level work, and being obvious. It maps directly onto what the machine does.",
   "**Weak at:** length. Business rules buried in twelve pages of steps are hard to find and harder to change.",
   "**Languages:** C, and the default mode of nearly everything else."
  ] },

  { h: "Object-oriented: state and behaviour bundled" },
  { p: "Organise the program around *things* that own their data and the operations on it. Covered in the last module; the summary is that it shines when you have many variants that must behave differently to the same request." },

  { l: [
   "**Good at:** modelling domains with clear entities, large systems with many teams, anything with variants (payment methods, file formats, report types).",
   "**Weak at:** simple transformations, where the ceremony costs more than it buys. And deep inheritance trees, which is why the guidance is *composition over inheritance*.",
   "**Languages:** Java, C#, Smalltalk, Ruby; supported by Python, JavaScript, PHP, Kotlin, Swift."
  ] },

  { h: "Functional: transform, do not mutate" },
  { p: "Build programs out of pure functions that take data and return new data, and compose them. Nothing is modified in place. You met the core idea in the pure-functions lesson." },

  { code: { lang: "python", t: "The same total, functionally",
    lines: [
     { c: "paid = filter(lambda o: o.paid, orders)", w: "A new sequence containing only the paid ones. `orders` is untouched." },
     { c: "amounts = map(lambda o: o.amount, paid)", w: "A new sequence of numbers. Nothing modified." },
     { c: "total = sum(amounts)", w: "Reduce to a single value." },
     { c: "", w: "" },
     { c: "total = sum(o.amount for o in orders if o.paid)", w: "The Pythonic spelling of exactly the same thing — filter, map and reduce in one readable line, with no state to get wrong." }
    ],
    after: "**Filter, map, reduce** are the three verbs of functional data work: keep some, change each, combine into one. They appear under those names or close variants in every modern language, and once you see them you will see them everywhere — including in SQL and in Spark." } },

  { l: [
   "**Good at:** data pipelines, concurrency (nothing shared means nothing to corrupt), testing, and reasoning — a pure function cannot surprise you.",
   "**Weak at:** anything genuinely stateful, like a game world or a UI, where forcing purity gets contorted. Also, deeply chained functional code can become as unreadable as deeply nested loops.",
   "**Languages:** Haskell, Elixir, Clojure, F#, Erlang; heavily borrowed by JavaScript, Python, Java, Kotlin, Rust and Scala."
  ] },

  { h: "Declarative: state the goal, not the route" },
  { p: "Describe the result you want and let something else decide how. You have already been writing declarative code without calling it that." },

  { code: { lang: "sql", t: "The same question again",
    lines: [
     { c: "SELECT SUM(amount) FROM orders WHERE paid = true;", w: "No loop, no accumulator, no order of operations. You said *what*. The query planner decides whether to scan, use an index, parallelise across cores, or reorder the work entirely — and it will often beat a hand-written loop." }
    ],
    after: "HTML declares structure. CSS declares appearance. SQL declares a result set. Terraform declares infrastructure. Regular expressions declare a pattern. Every one of them hides an engine that works out the *how*." } },

  { l: [
   "**Good at:** when the engine genuinely knows better than you — query optimisation, layout, rendering. And it is shorter, so there is less to get wrong.",
   "**Weak at:** debugging, when the engine's choice is wrong and opaque. Anyone who has fought a slow query or a CSS layout knows the feeling.",
   "**Languages:** SQL, HTML, CSS, regex, Prolog, Terraform, Kubernetes manifests."
  ] },

  { h: "Nobody is pure" },
  { p: "This is the part that matters. Real code mixes all four, often within one function, and that is correct rather than sloppy." },

  { code: { lang: "python", t: "Four paradigms, eleven lines",
    lines: [
     { c: "class ReportBuilder:", w: "**Object-oriented** — state with rules attached." },
     { c: "    def __init__(self, db):", w: "" },
     { c: "        self.db = db", w: "" },
     { c: "", w: "" },
     { c: "    def monthly(self, month):", w: "" },
     { c: "        rows = self.db.query(", w: "**Declarative** — SQL describing the result." },
     { c: "            \"SELECT * FROM orders WHERE month = ?\", month)", w: "" },
     { c: "", w: "" },
     { c: "        totals = {r.customer: r.amount for r in rows}", w: "**Functional** — a comprehension transforming data into new data." },
     { c: "", w: "" },
     { c: "        for name, amount in sorted(totals.items()):", w: "**Imperative** — a loop with output, because printing in order is a sequence of steps." },
     { c: "            print(f\"{name}: {amount}\")", w: "" }
    ] } },

  { n: "The trend over the last fifteen years is convergence. Java got lambdas and streams; C# got LINQ; JavaScript got `map`/`filter`/`reduce` and arrow functions; Python has always had comprehensions; Rust and Kotlin were designed multi-paradigm from the start. The tribal arguments of the 2000s are largely over, and the settled position is: use objects for the parts with state and identity, functions for the transformations, and declarative tools wherever an engine can outthink you.",
    nt: "The argument is basically over" },

  { tryit: { t: "Name the paradigm",
    task: "Identify each snippet's dominant style.",
    hint: "Look for: mutation and sequence, objects and methods, transformation without mutation, or a description with no *how*.",
    sol: { lang: "text", code: "1. result = [x*2 for x in nums if x > 0]\n   -> FUNCTIONAL. Transformation, no mutation.\n\n2. cart.add(item); cart.checkout()\n   -> OBJECT-ORIENTED. Objects with methods.\n\n3. i = 0\n   while i < len(a):\n       a[i] *= 2; i += 1\n   -> IMPERATIVE. Explicit steps, mutation in place.\n\n4. <ul><li>One</li></ul>\n   -> DECLARATIVE. Describes structure; the browser decides how.\n\n5. df.groupby(\"city\").sum()\n   -> FUNCTIONAL / DECLARATIVE. You state the operation;\n      pandas decides how to execute it." },
    w: "Number 5 is worth noticing: pandas, SQL and Spark all sit deliberately on that boundary. It is why data work feels so different from application code — you spend most of your time declaring transformations rather than writing loops." } },

  { vocab: ["Imperative Programming", "Functional Programming", "Declarative Programming", "Object-Oriented Programming"] }
 ],
 k: [
  "Four paradigms: imperative (steps), object-oriented (things), functional (transformations), declarative (describe the goal).",
  "Filter, map and reduce are the three verbs of functional data work and appear in every modern language.",
  "You are already writing declarative code — SQL, HTML and CSS all describe *what* and hide the *how*.",
  "Real programs mix all four. Objects for state, functions for transformation, declarations where an engine knows better."
 ],
 r: ["Functional Programming", "Declarative Programming", "Object-Oriented Programming", "MapReduce"]
},

{
 t: "Libraries, Packages and APIs",
 m: "craft",
 lvl: "intermediate",
 s: "Why you will write far less code than you expect, and what you are taking on when you install something.",
 goal: [
  "Explain the difference between a library, a package and a framework",
  "Read a dependency file and know what it guarantees",
  "Judge whether a package is worth adding"
 ],
 b: [
  { p: "Here is a fact nobody tells beginners clearly: **most of the code in your program will not be yours.** A typical web application is a few thousand lines you wrote sitting on top of a few hundred thousand you installed. Learning to use, choose and manage other people's code is not a side skill; it is most of the job." },

  { h: "The vocabulary" },

  { tbl: { t: "Four words people use interchangeably and should not",
    h: ["Word", "Means", "Example"],
    rows: [
     ["**Library**", "Code you call. You are in charge.", "`requests`, `lodash`, `NumPy`"],
     ["**Framework**", "Code that calls *you*. It owns the structure; you fill in the gaps.", "Django, React, Spring, Rails"],
     ["**Package**", "The distributable unit — one library and its metadata, downloadable by name.", "What `pip install` fetches"],
     ["**API**", "The set of calls something exposes. Every library has one; so does every web service.", "`requests.get(url)` · `GET /api/users`"]
    ] } },

  { p: "The library/framework distinction is worth internalising because it predicts how much freedom you have. With a library you decide the shape of your program. With a framework the shape is decided and you are filling in specific slots — which is a genuine trade of flexibility for speed and convention, sometimes a very good one." },

  { h: "The standard library" },
  { p: "Every language ships with a large set of ready-made code. Before installing anything, check whether it is already there — the standard library is tested by millions of people, has no supply-chain risk, and adds nothing to your install size." },

  { code: { lang: "python", t: "What is already on your machine",
    lines: [
     { c: "import json", w: "Read and write JSON." },
     { c: "import csv", w: "Parse CSV properly — including quoted commas, which your hand-rolled `split(\",\")` will get wrong." },
     { c: "import datetime", w: "Dates and times, correctly. Never do date arithmetic by hand." },
     { c: "import re", w: "Regular expressions." },
     { c: "import pathlib", w: "File paths that work on Windows and Unix without string surgery." },
     { c: "import collections", w: "`Counter`, `defaultdict`, `deque` — the containers from the data module, ready-made." },
     { c: "import itertools", w: "Combinations, permutations, grouping, chunking." },
     { c: "import unittest", w: "A test framework, included." }
    ],
    after: "Python's standard library is famously large — the phrase is *batteries included*. Go's is excellent. Java's is enormous. JavaScript's is famously thin, which is a large part of why the npm ecosystem became what it is." } },

  { h: "Installing, and what it drags in" },

  { code: { lang: "bash", t: "The same idea in five ecosystems",
    lines: [
     { c: "pip install requests", w: "**Python.** Downloads from PyPI into your virtual environment." },
     { c: "npm install axios", w: "**JavaScript.** Downloads from the npm registry into `node_modules`." },
     { c: "go get github.com/lib/pq", w: "**Go.** Fetches by URL and records it in `go.mod`." },
     { c: "cargo add serde", w: "**Rust.** From crates.io." },
     { c: "mvn / gradle dependencies", w: "**Java.** From Maven Central." }
    ] } },

  { dg: "dep-tree" },

  { p: "You install one package; you get its dependencies, and theirs, and theirs. A modest JavaScript project routinely has more than a thousand packages in `node_modules`. This is normal, it is enormously productive, and it is also the reason the following matters." },

  { h: "The lock file, and why it exists" },

  { code: { lang: "text", t: "Two files that do different jobs",
    lines: [
     { c: "# requirements.txt / package.json — what you asked for", w: "" },
     { c: "requests>=2.28", w: "*Any version from 2.28 upwards.* Flexible, and therefore not reproducible: installing today and installing in June can give different code." },
     { c: "", w: "" },
     { c: "# requirements.lock / package-lock.json — what you got", w: "" },
     { c: "requests==2.31.0", w: "The **exact** version, plus every transitive dependency, plus a checksum of each." },
     { c: "urllib3==2.0.7", w: "You never wrote this line. It was pulled in by `requests`, and pinning it is what makes the build reproducible." }
    ],
    after: "**Commit the lock file.** It is the difference between *works on my machine* and *works identically on every machine and in production, today and next year*. This is one of the highest-value habits in this whole lesson." } },

  { p: "**Semantic versioning** is the convention that makes those ranges meaningful. `2.31.4` is MAJOR.MINOR.PATCH: a patch bump fixes bugs, a minor bump adds features compatibly, and a major bump is allowed to break your code. It is a promise made by a human, so it is kept imperfectly — but it is why `>=2.28,<3.0` is a reasonable thing to write." },

  { h: "Should you add this package?" },
  { p: "Every dependency is code you did not write, cannot fully review, and are now responsible for. That is usually a good trade. Sometimes it is not." },

  { l: [
   "**How much does it save?** A date/time library or an HTTP client saves you months and a great deal of correctness. A package that left-pads a string saves you one line.",
   "**Is it maintained?** Look at the date of the last commit and whether issues get answered. An abandoned dependency becomes your problem the moment it breaks on a new language version.",
   "**How heavy is it?** How many dependencies does it drag in? In a browser, how many kilobytes does the user download?",
   "**What is the licence?** MIT, Apache and BSD are permissive. GPL and AGPL carry obligations that may matter commercially. Check before, not after.",
   "**What is the blast radius if it is compromised?** Installing a package generally means running its code. Supply-chain attacks — a maintainer account taken over, a malicious release published — are a real and growing category. Pin your versions, use the lock file, and prefer well-known packages for anything that runs in a build pipeline."
  ] },

  { trap: "Two opposite failures, both common. **Not-invented-here**: writing your own date parsing, your own CSV reader, your own crypto. You will get it wrong — especially the crypto, where getting it wrong is invisible. **And the reverse**: a dependency for every four-line function, until a project has 1,400 packages and no one can audit any of it. The judgement is *how much correctness am I buying*, and the answer is high for dates, encoding, HTTP and crypto, and low for string helpers." },

  { h: "Reading documentation" },
  { p: "The genuine skill of using libraries is reading their docs quickly. There is a reliable order." },
  { ol: [
   "**The README or quickstart.** Get one working example running before understanding anything. Momentum first.",
   "**The API reference for the one function you need.** Read its parameters, its return value, and what it raises — in that order.",
   "**The examples section.** Nearly always closer to your problem than the reference is.",
   "**The changelog**, if something behaves unexpectedly. You may be reading documentation for a different version to the one you installed. This is the single most common cause of *the docs are wrong*."
  ] },

  { tryit: { t: "Library or standard library?",
    task: "For each task, would you install something, or is it already there?",
    hint: "Dates, JSON, CSV, paths and random numbers are almost always built in.",
    sol: { lang: "text", code: "Parse a JSON response       -> built in (json)\nRead a CSV with quoted commas -> built in (csv). Do NOT split(\",\")\nMake an HTTP request        -> built in but unpleasant;\n                               `requests` is worth it\nWork with dates/timezones   -> built in (datetime, zoneinfo)\nDataFrames and analysis     -> install pandas. Do not reinvent\nHash a password             -> install bcrypt/argon2.\n                               NEVER write your own\nPad a string to 5 chars     -> built in. This needs no package" },
    w: "The password row is the one that matters. Crypto and security primitives are the clearest case in programming where using a well-known library is not laziness — it is the only responsible option." } },

  { vocab: ["Library", "Framework", "API", "Package Manager", "Semantic Versioning", "Dependency"] }
 ],
 k: [
  "A library is code you call; a framework is code that calls you. That distinction predicts how much freedom you have.",
  "Installing one package installs its whole dependency tree. Commit the lock file so every machine gets identical code.",
  "Check the standard library first — dates, JSON, CSV, paths and containers are usually already there.",
  "Never write your own crypto or date handling. Do not add a package for four lines."
 ],
 r: ["Library", "Framework", "API", "Package Manager", "Semantic Versioning", "Supply Chain Attack"]
},

{
 t: "Concurrency, Blocking and async",
 m: "craft",
 lvl: "advanced",
 s: "Doing more than one thing at a time — the concept, the vocabulary, and the one bug that defines it.",
 goal: [
  "Distinguish concurrency from parallelism",
  "Say when async helps and when it does nothing at all",
  "Explain a race condition and why shared mutable state causes it"
 ],
 b: [
  { p: "Everything you have written so far does one thing at a time, in order. Real systems do not: a web server handles a thousand requests at once, an app stays responsive while downloading, a data job uses all eight cores. You do not need to write concurrent code yet. You do need the concepts, because they explain a great deal of what you will read." },

  { h: "Two different words" },
  { p: "**Concurrency** is *dealing with* many things at once — structuring a program so several tasks are in progress and it switches between them. **Parallelism** is *doing* many things at once — genuinely simultaneous, on multiple cores." },
  { p: "One chef juggling four dishes is concurrent. Four chefs each cooking one dish is parallel. Concurrency is about structure; parallelism is about hardware. You can have either without the other." },

  { h: "The reason it matters: waiting is not working" },

  { dg: "sync-async" },

  { p: "Most programs are not limited by how fast they compute. They are limited by waiting — for a network response, a disk read, a database query, a user. During that wait the CPU does nothing at all. Async is the technique for using the gaps." },

  { code: { lang: "python", t: "Blocking versus concurrent",
    lines: [
     { c: "# blocking -- 3 seconds", w: "" },
     { c: "a = fetch(url1)", w: "Send the request, then sit still for a second. The processor is idle." },
     { c: "b = fetch(url2)", w: "Another second of nothing." },
     { c: "c = fetch(url3)", w: "And another." },
     { c: "", w: "" },
     { c: "# concurrent -- about 1 second", w: "" },
     { c: "a, b, c = await asyncio.gather(", w: "Start all three, then wait for whichever finishes first. The waits overlap instead of queueing." },
     { c: "    fetch(url1), fetch(url2), fetch(url3))", w: "" }
    ],
    after: "Nothing got faster. The same three requests took the same time each. What changed is that the *waiting* happened at once — which is the entire idea, and it is why the second version does nothing for arithmetic." } },

  { h: "The two kinds of work, and which technique fits" },

  { tbl: { t: "Match the tool to the bottleneck",
    h: ["Your program spends its time…", "Called", "Use", "Because"],
    rows: [
     ["Waiting for network, disk or database", "**I/O-bound**", "async / await, or threads", "The CPU is idle during the wait — fill the gap"],
     ["Doing arithmetic, image or data processing", "**CPU-bound**", "Multiple processes / true parallelism", "There is no idle time to reclaim; you need more cores"]
    ] } },

  { p: "Getting this backwards is the most common concurrency mistake. Adding `async` to a CPU-bound loop makes it slightly slower and no more parallel — there was never a gap to fill." },

  { h: "The vocabulary you will meet" },
  { l: [
   "**Process** — an independent running program with its own memory. Isolated: a crash in one cannot corrupt another. Expensive to create, and they cannot share data directly.",
   "**Thread** — a separate line of execution *inside* one process, sharing that process's memory. Cheap, and the sharing is exactly where the danger is.",
   "**async / await** — concurrency without threads. A single thread switches between tasks at explicit `await` points. Simpler to reason about, because switches happen only where you can see them.",
   "**Event loop** — the machinery underneath async: a queue of ready tasks, run one at a time until each pauses. This is how JavaScript has always worked, and it is why one slow synchronous function freezes a whole web page."
  ] },

  { dg: "event-loop" },

  { n: "Python's **GIL** (Global Interpreter Lock) means threads in CPython cannot run Python bytecode simultaneously — so threads help with I/O and not with computation. That is why the data world uses `multiprocessing`, or pushes the heavy arithmetic into NumPy and pandas, whose inner loops are C code that releases the lock. It is the single most misunderstood fact about Python performance.",
    nt: "Why Python threads disappoint people" },

  { h: "The bug that defines the whole field" },
  { p: "Two things running at once and sharing data produce a class of bug that is genuinely different from anything else in this track: it is intermittent, it does not reproduce, and it vanishes when you add a print statement." },

  { dg: "concurrency" },

  { code: { lang: "text", t: "A race condition, one line long",
    lines: [
     { c: "counter += 1", w: "This looks atomic. It is three machine operations: **read** the value, **add** one, **write** it back." },
     { c: "", w: "" },
     { c: "Thread A reads counter    -> 5", w: "" },
     { c: "Thread B reads counter    -> 5", w: "B read before A had written. Both are now holding 5." },
     { c: "Thread A writes 6", w: "" },
     { c: "Thread B writes 6", w: "Two increments happened. The counter went up by one. **One update vanished** with no error anywhere." }
    ],
    after: "This is a **race condition** — the result depends on the order two things happen to interleave, which changes run to run. It appears once in ten thousand iterations, on a loaded server, and never on your laptop." } },

  { p: "The defences, in increasing order of preference:" },
  { ol: [
   "**A lock (mutex).** Only one thread may hold it at a time, so the read-add-write becomes indivisible. Correct, and slow if overused — and two locks taken in different orders by two threads is a **deadlock**, where both wait forever.",
   "**Atomic operations.** Hardware-level increments that cannot be interrupted. Fast, and limited to simple cases.",
   "**Do not share mutable state.** Give each task its own data and combine the results at the end. This is by far the best answer, and it is why functional programming and message-passing designs (Go's channels, Erlang's actors) get so much attention in concurrency — if nothing is shared, there is no race to have."
  ] },

  { trap: "Concurrency bugs do not obey the debugging method from the last module, because step one — reproduce it — may be impossible. They are timing-dependent, and adding a print changes the timing enough to hide them. This is why the advice is overwhelmingly to *avoid shared mutable state by design* rather than to debug it afterwards. It is one of the few areas of programming where prevention is genuinely the only reliable strategy." },

  { h: "What you actually need right now" },
  { l: [
   "Recognise the words when you read them: async, await, thread, process, lock, race condition, event loop, blocking.",
   "Know that async helps with waiting and not with computing.",
   "Know that shared mutable state between concurrent tasks is where the hard bugs live.",
   "**Do not reach for concurrency to make slow code faster.** Nine times out of ten the real problem is an O(n²) or a query in a loop, and concurrency will add difficulty without fixing it."
  ] },

  { tryit: { t: "Which technique?",
    task: "For each, would async help, would parallelism help, or neither?",
    hint: "Ask what the program is doing while it takes time — waiting, or working?",
    sol: { lang: "text", code: "1. Download 500 web pages\n   -> ASYNC. Almost entirely waiting.\n\n2. Resize 500 photographs\n   -> PARALLELISM (processes). Pure CPU work.\n\n3. One database query that takes 30 seconds\n   -> NEITHER. Fix the query -- add an index.\n\n4. A web server handling 1,000 users\n   -> ASYNC. Each request is mostly waiting on the database.\n\n5. Train a neural network\n   -> PARALLELISM, on a GPU. Thousands of cores doing arithmetic.\n\n6. A loop that scans a list inside another loop\n   -> NEITHER. It is O(n^2). Use a set." },
    w: "Numbers 3 and 6 are the important ones. Both are slow, and neither is a concurrency problem — reaching for threads there adds a whole category of bug and leaves the actual cause untouched." } },

  { vocab: ["Concurrency", "Parallelism", "Thread", "Race Condition", "Deadlock", "Event Loop"] }
 ],
 k: [
  "Concurrency is structure (dealing with many things); parallelism is hardware (doing many things).",
  "Async fills the gaps while you wait for I/O. It does nothing for CPU-bound work, where you need more cores.",
  "A race condition happens when two tasks share mutable state and the result depends on interleaving. It is intermittent and often unreproducible.",
  "The reliable defence is not to share mutable state at all. Do not use concurrency to paper over an algorithmic problem."
 ],
 r: ["Concurrency", "Parallelism", "Thread", "Process", "Race Condition", "Deadlock", "Event Loop"]
}

]);
