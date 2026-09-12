/* Python — writing real Python. */
TD.addLessons("python", [

{
 t: "Modules, Packages and Imports",
 m: "pythonic",
 lvl: "intermediate",
 s: "Splitting one file into many — and why `import` sometimes cannot find your own code.",
 goal: [
  "Split a growing script into modules that import each other",
  "Choose between `import x` and `from x import y` on purpose",
  "Diagnose an import error instead of shuffling files around"
 ],
 b: [
  { p: "One file works up to a few hundred lines. Past that you want separate files by topic, and the moment you do, you meet Python's import system — which is well designed and completely opaque until someone explains the search order." },

  { h: "A module is a file" },
  { p: "That is the entire definition. Any `.py` file is a module, and its name is the filename without the extension. There is nothing to declare." },
  { code: { lang: "python", file: "geometry.py",
    lines: [
     { c: "PI = 3.14159", w: "A module-level constant." },
     { c: "", w: "" },
     { c: "def area(radius):", w: "" },
     { c: "    return PI * radius ** 2" }
    ] } },
  { code: { lang: "python", file: "main.py",
    lines: [
     { c: "import geometry", w: "**Finds `geometry.py`, runs it top to bottom, and binds the result to the name `geometry`.** Recall from the execution lesson: an import is a statement that runs a whole file." },
     { c: "", w: "" },
     { c: "print(geometry.area(3))", w: "Reach in with a dot. The module name stays visible at every use, which is the point of this form." },
     { c: "print(geometry.PI)" }
    ],
    out: "28.27431\n3.14159" } },

  { h: "The four forms, and when each is right" },
  { code: { lang: "python",
    lines: [
     { c: "import geometry", w: "**The safest.** Everything stays behind `geometry.`, so a reader always knows where a name came from and nothing of yours can be shadowed." },
     { c: "import geometry as geo", w: "**An alias**, for a long name. This is why you see `import numpy as np` and `import pandas as pd` — those two aliases are so standard that writing anything else looks wrong." },
     { c: "from geometry import area", w: "**Pull one name in directly.** Now you write `area(3)` with no prefix. Convenient, and you have lost the origin — three imports later, nobody knows which module `area` came from." },
     { c: "from geometry import *", w: "**Never do this.** It drags every public name into your file, silently overwriting anything with a clashing name, and makes it impossible to tell where anything came from. Every style guide bans it." }
    ] } },
  { n: "A reasonable rule: `import x` or `import x as y` by default; `from x import y` when the name is unambiguous and used constantly (`from pathlib import Path`, `from dataclasses import dataclass`); `from x import *` never. Standard library modules that read well qualified — `os.path`, `json.loads` — are clearer left qualified.",
    nt: "Which form to choose" },

  { h: "Where Python looks" },
  { p: "When you write `import geometry`, Python searches, in this exact order, and stops at the first hit." },
  { ol: [
   "**Built-in modules** compiled into the interpreter — `sys`, `math`.",
   "**The directory of the script you ran** — not the current working directory, and not where the importing file lives. The *entry point's* folder.",
   "**Anything on the `PYTHONPATH` environment variable.**",
   "**The installed packages** of the active environment — your `.venv`'s `site-packages`."
  ] },
  { trap: "Step two is why naming a file after a library breaks everything. Save a file as `random.py` and your own file now shadows the standard library's `random` for the whole project, producing errors like `module 'random' has no attribute 'randint'` that make no sense. The same applies to `json.py`, `csv.py`, `email.py` and `test.py`. If an import starts behaving impossibly, look for a file of that name in your project first." },

  { h: "A package is a folder" },
  { code: { lang: "text", t: "The layout that actually works",
    lines: [
     { c: "myproject/", w: "The project root — the folder you open in your editor." },
     { c: "├── main.py", w: "The entry point. **Run this**, and its folder becomes the import root." },
     { c: "├── requirements.txt" },
     { c: "└── tools/", w: "**A package**: a folder of modules." },
     { c: "    ├── __init__.py", w: "Marks the folder as a package. It can be completely empty, and usually is. Modern Python can import without it, but including it removes all ambiguity." },
     { c: "    ├── parsing.py" },
     { c: "    └── report.py" }
    ] } },
  { code: { lang: "python", file: "main.py",
    lines: [
     { c: "from tools.parsing import load_csv", w: "**A dot walks down the folder tree** — `tools/parsing.py`, and the `load_csv` inside it." },
     { c: "from tools import report", w: "Or import the module and keep the prefix." },
     { c: "", w: "" },
     { c: "rows = load_csv(\"data.csv\")", w: "" },
     { c: "report.write(rows)" }
    ] } },

  { h: "Relative imports, inside a package" },
  { code: { lang: "python", file: "tools/report.py",
    lines: [
     { c: "from .parsing import load_csv", w: "**A leading dot means *this package*.** Renaming `tools/` later does not break this line. Two dots means the parent package." },
     { c: "", w: "" },
     { c: "def write(rows):", w: "" },
     { c: "    ..." }
    ],
    after: "Relative imports only work inside a package that is being imported. Run `python tools/report.py` directly and you get `ImportError: attempted relative import with no known parent package` — because as an entry point, `report.py` is not part of a package at all. Run `python -m tools.report` instead, which imports it properly." } },

  { h: "Reading an import error" },
  { tbl: { h: ["Message", "Actually means", "Check"],
    rows: [
     ["`ModuleNotFoundError: No module named 'x'`", "Nothing named `x` on the search path", "Is your `.venv` active? Is it in `pip list`? Is the spelling right?"],
     ["`ImportError: cannot import name 'y' from 'x'`", "The module was found, `y` is not in it", "A typo, or a version where it moved or was renamed"],
     ["`ImportError: attempted relative import with no known parent package`", "You ran a package file directly", "Use `python -m package.module` from the project root"],
     ["`ImportError: cannot import name … (most likely due to a circular import)`", "Two modules import each other", "Move the shared piece into a third module"],
     ["`AttributeError: module 'x' has no attribute 'y'`", "Very often **your own file is shadowing a library**", "Look for `x.py` in your project"]
    ] } },

  { h: "Circular imports" },
  { vs: { t: "Two modules that need each other", lang: "python",
    bad: { c: "# users.py\nfrom orders import get_orders\n\n# orders.py\nfrom users import get_user", label: "A cycle",
      w: "Python starts running `users.py`, hits the import, starts `orders.py`, which imports `users` — still half-executed, so the name it wants does not exist yet. The error usually points at the innocent file." },
    good: { c: "# models.py\nclass User: ...\nclass Order: ...\n\n# users.py\nfrom models import User\n\n# orders.py\nfrom models import Order", label: "Extract the shared piece",
      w: "The cycle is a design signal, not a technical obstacle. Two modules that need each other usually contain one idea that belongs in a third." } } },

  { tryit: { t: "Split a script",
    task: "You have a 300-line `analyse.py` doing three things: reading a CSV, computing statistics, and printing a report. Sketch the file layout and the imports.",
    hint: "One module per responsibility, plus a thin entry point that only wires them together.",
    sol: { lang: "text", code: "project/\n├── main.py            # entry point, wires it together\n└── analysis/\n    ├── __init__.py\n    ├── loading.py     # load_rows(path) -> list[dict]\n    ├── stats.py       # summarise(rows) -> dict\n    └── report.py      # render(summary) -> str\n\n# main.py\nfrom analysis.loading import load_rows\nfrom analysis.stats import summarise\nfrom analysis.report import render\n\nif __name__ == \"__main__\":\n    print(render(summarise(load_rows(\"data.csv\"))))" },
    w: "Each module can now be tested on its own, and `main.py` is three lines whose job is obvious. That last property — an entry point you can read in one glance — is worth a lot." } }
 ],
 k: [
  "A module is a file, a package is a folder; a dot walks down the tree.",
  "`import x` keeps the origin visible; `from x import *` is banned everywhere for good reason.",
  "Python searches the entry point's folder before installed packages — so never name a file after a library.",
  "A circular import is a design signal: extract the shared piece into a third module."
 ],
 r: ["Module", "Package Manager", "Import", "Namespace", "Dependency"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import numpy as np", w: "import a library under its conventional short alias" },
   { c: "from pathlib import Path", w: "pull one name directly out of a standard library module" },
   { c: "from tools.parsing import load_csv", w: "import a function from a module inside a package" },
   { c: "from .parsing import load_csv", w: "import from a sibling module within the same package", hint: "leading dot" },
   { c: "if __name__ == \"__main__\":", w: "guard code that should only run when the file is executed directly" }
  ]
 }
},

{
 t: "Iterators and Generators",
 m: "pythonic",
 lvl: "intermediate",
 s: "Producing values one at a time — how Python handles a file bigger than your memory.",
 goal: [
  "Explain what a `for` loop is really doing under the hood",
  "Write a generator with `yield` and say how it differs from a function",
  "Choose lazy over eager when the data is large"
 ],
 b: [
  { p: "Every `for` loop you have written rests on one protocol, and once you can see it, a set of otherwise-magic behaviours becomes obvious — including how you process a hundred-gigabyte file on a laptop." },

  { h: "What a for loop actually does" },
  { code: { lang: "python", t: "Unrolled by hand",
    lines: [
     { c: "scores = [72, 91, 65]", w: "" },
     { c: "", w: "" },
     { c: "it = iter(scores)", w: "**Step 1: `for` calls `iter()` on the collection**, asking it for an *iterator* — a small object that remembers a position." },
     { c: "print(next(it))", w: "**Step 2: it calls `next()` repeatedly.** Each call hands back the following value and advances the position." },
     { c: "print(next(it))" },
     { c: "print(next(it))" },
     { c: "print(next(it))", w: "**Step 3: when there is nothing left, `next()` raises `StopIteration`** — and `for` catches that quietly and ends the loop. That exception is the whole mechanism." }
    ],
    out: "72\n91\n65\nStopIteration",
    after: "That is all a `for` loop is. Anything answering `iter()` and `next()` can be looped over — which is why one loop shape works on lists, strings, dictionaries, files, ranges and everything a library hands you." } },

  { h: "Eager versus lazy" },
  { p: "A list is **eager**: every item exists in memory at once. A generator is **lazy**: it produces each item only when asked, and forgets it afterwards. For small data the difference is invisible. For large data it is the difference between working and not." },
  { code: { lang: "python",
    lines: [
     { c: "nums = [n * n for n in range(10_000_000)]", w: "**A list comprehension: builds all ten million.** Several hundred megabytes, allocated before the next line runs." },
     { c: "nums = (n * n for n in range(10_000_000))", w: "**Round brackets: a generator expression.** Almost no memory — it has computed nothing yet and holds only the recipe." },
     { c: "", w: "" },
     { c: "print(sum(n * n for n in range(10_000_000)))", w: "**The right way to answer this question.** `sum` pulls values one at a time, adds each and discards it. Constant memory, whatever the size." }
    ] } },

  { h: "yield — writing your own" },
  { syn: { t: "The keyword that changes everything about a function",
    parts: [
     { p: "yield", w: "**Hands a value to whoever is looping, then pauses.** The function does not end — its local variables, its position, its whole state are frozen. The next `next()` resumes on the line after this one. A function containing `yield` anywhere is a **generator function**, and calling it runs none of the body: it just hands back a generator." },
     { p: " " },
     { p: "value", w: "What to produce this time round." }
    ] } },

  { vs: { t: "The same job, eager and lazy", lang: "python",
    bad: { c: "def read_lines(path):\n    result = []\n    with open(path) as f:\n        for line in f:\n            result.append(line.strip())\n    return result", label: "return — builds the whole list",
      w: "Nothing runs until the entire file is in memory. On a 10 GB log this fails, and even when it works the caller waits for all of it before seeing the first line." },
    good: { c: "def read_lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.strip()", label: "yield — one line at a time",
      w: "Constant memory regardless of file size, and the caller gets the first line immediately. Note there is no list at all — the `yield` replaced both the accumulator and the `return`." } } },

  { code: { lang: "python", t: "Watching it pause and resume",
    lines: [
     { c: "def countdown(n):", w: "" },
     { c: "    print(\"starting\")", w: "**This does not run when you call the function.**" },
     { c: "    while n > 0:", w: "" },
     { c: "        yield n", w: "Hand out `n`, then freeze here." },
     { c: "        n -= 1", w: "Runs when the *next* value is asked for." },
     { c: "    print(\"done\")", w: "" },
     { c: "", w: "" },
     { c: "gen = countdown(3)", w: "Nothing printed. The body has not started." },
     { c: "print(next(gen))", w: "*Now* `starting` prints and the first value comes out." },
     { c: "print(next(gen))", w: "Resumes at `n -= 1`, loops, yields again." },
     { c: "print(list(gen))", w: "`list()` drains the rest, so `done` prints as the function finally reaches its end." }
    ],
    out: "starting\n3\n2\n[1]\ndone" } },

  { trap: "**A generator is exhausted after one pass.** Loop over it twice and the second loop gets nothing — no error, just silence and an empty result. If you need the values more than once, keep them: `values = list(gen)`. This catches everybody, usually in the form of a total that comes out as zero." },

  { h: "Chaining them" },
  { code: { lang: "python", file: "pipeline.py", t: "Where laziness really pays",
    lines: [
     { c: "def read(path):", w: "" },
     { c: "    with open(path, encoding=\"utf-8\") as f:", w: "" },
     { c: "        for line in f:", w: "" },
     { c: "            yield line.rstrip()" },
     { c: "", w: "" },
     { c: "def parse(lines):", w: "**Takes an iterable, yields an iterable.** Each stage is a small, testable function." },
     { c: "    for line in lines:", w: "" },
     { c: "        yield line.split(\",\")" },
     { c: "", w: "" },
     { c: "def errors_only(rows):", w: "" },
     { c: "    for row in rows:", w: "" },
     { c: "        if row[2] == \"ERROR\":", w: "" },
     { c: "            yield row" },
     { c: "", w: "" },
     { c: "for row in errors_only(parse(read(\"huge.log\"))):", w: "**Three stages, and still only one line in memory at a time.** Each stage pulls one item from the stage before, exactly as a shell pipeline does — which is the same idea from the Ground Zero pipe lesson.", hi: true },
     { c: "    print(row)" }
    ],
    after: "The whole pipeline is assembled before a single byte is read, and nothing happens until the `for` starts pulling. That is why this pattern handles files far larger than memory." } },

  { h: "The tools that go with them" },
  { code: { lang: "python",
    lines: [
     { c: "from itertools import islice, chain, groupby", w: "The standard library's iterator toolkit — all lazy." },
     { c: "", w: "" },
     { c: "first_ten = list(islice(gen, 10))", w: "**Take the first ten** without computing the rest. `gen[:10]` does not work — generators have no indexing." },
     { c: "both = chain(gen_a, gen_b)", w: "Run through one, then the next, as if they were one sequence." },
     { c: "", w: "" },
     { c: "print(any(row[2] == \"ERROR\" for row in rows))", w: "**`any` short-circuits** — it stops the moment it finds one, so on a huge file this can answer in milliseconds." },
     { c: "print(all(row[0] for row in rows))", w: "`all` likewise stops at the first falsy value." }
    ] } },

  { tryit: { t: "Build a lazy pipeline",
    task: "Write a generator that reads a log file and yields only lines from a given date, then use it to count matching lines without ever building a list.",
    hint: "One generator function, then `sum(1 for _ in gen)` to count lazily.",
    sol: { lang: "python", code: "def on_date(path, date):\n    with open(path, encoding=\"utf-8\") as f:\n        for line in f:\n            if line.startswith(date):\n                yield line.rstrip()\n\nn = sum(1 for _ in on_date(\"app.log\", \"2026-08-25\"))\nprint(f\"{n} lines\")" },
    w: "`sum(1 for _ in gen)` counts without storing anything — the `_` is the *I must name this and do not care* convention from the variables lesson. On a 50 GB log this uses a few kilobytes." } }
 ],
 k: [
  "A `for` loop calls `iter()` then `next()` until `StopIteration` — that is the whole protocol.",
  "`yield` pauses a function and resumes it where it left off; calling it runs none of the body.",
  "Generators are lazy and use constant memory, which is how you process files larger than RAM.",
  "A generator is exhausted after one pass — call `list()` if you need the values twice."
 ],
 r: ["Iterator", "Iteration", "Lazy Loading", "Memory Management", "Pipeline"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "            yield line.strip()", w: "hand out one cleaned line and pause the function", hint: "deeply indented" },
   { c: "print(sum(n * n for n in range(10)))", w: "sum squares without building a list in memory" },
   { c: "first_ten = list(islice(gen, 10))", w: "take the first ten items of a generator" },
   { c: "n = sum(1 for _ in gen)", w: "count the items a generator produces without storing them" },
   { c: "print(any(row[2] == \"ERROR\" for row in rows))", w: "check whether any row is an error, stopping at the first" }
  ]
 }
},

{
 t: "Decorators",
 m: "pythonic",
 lvl: "advanced",
 s: "The `@` you have seen everywhere, built up from first principles until it is obvious.",
 goal: [
  "Explain what `@something` above a function actually does",
  "Write a decorator that wraps any function",
  "Read the decorators in Flask, pytest and pandas without guessing"
 ],
 b: [
  { p: "You have already met `@property` and `@dataclass` and taken them on faith. Decorators are not advanced — they are two ideas you already know, stacked. Here they are, from the bottom." },

  { h: "Idea one: functions are values" },
  { p: "From the lambdas lesson: a function without parentheses is a value. So a function can take another function as an argument." },
  { code: { lang: "python",
    lines: [
     { c: "def shout(text):", w: "" },
     { c: "    return text.upper()" },
     { c: "", w: "" },
     { c: "def apply_twice(func, value):", w: "**`func` is a parameter holding a function.** Nothing special is happening — a function is just another value." },
     { c: "    return func(func(value))", w: "Call it like anything else." },
     { c: "", w: "" },
     { c: "print(apply_twice(shout, \"hi\"))" }
    ],
    out: "HI" } },

  { h: "Idea two: a function can return a function" },
  { code: { lang: "python",
    lines: [
     { c: "def make_multiplier(n):", w: "" },
     { c: "    def multiply(x):", w: "**A function defined inside another.** It is created fresh each time `make_multiplier` runs." },
     { c: "        return x * n", w: "**`n` comes from the enclosing function** — the E in the LEGB order from the scope lesson. The inner function keeps hold of it even after the outer one has returned. That captured environment is called a **closure**." },
     { c: "    return multiply", w: "Hand back the function itself, uncalled." },
     { c: "", w: "" },
     { c: "double = make_multiplier(2)", w: "`double` is now a function that multiplies by 2." },
     { c: "print(double(5))" }
    ],
    out: "10" } },

  { h: "Put them together and you have a decorator" },
  { code: { lang: "python", file: "timing.py", t: "Built by hand first — no @ anywhere",
    lines: [
     { c: "import time", w: "" },
     { c: "", w: "" },
     { c: "def timed(func):", w: "**Takes a function** (idea one)..." },
     { c: "    def wrapper(*args, **kwargs):", w: "...and **defines a new one** (idea two). `*args, **kwargs` from the functions module means it accepts *any* signature, so this works on every function." },
     { c: "        start = time.perf_counter()", w: "Before." },
     { c: "        result = func(*args, **kwargs)", w: "**Call the original, forwarding everything untouched.**" },
     { c: "        print(f\"{func.__name__} took {time.perf_counter() - start:.4f}s\")", w: "After. `__name__` is the function's own name — every function carries one." },
     { c: "        return result", w: "**Hand the original's result back.** Forget this line and every decorated function silently returns `None`, which is the classic decorator bug." },
     { c: "    return wrapper", w: "Return the new function, uncalled." },
     { c: "", w: "" },
     { c: "def slow_add(a, b):", w: "" },
     { c: "    time.sleep(0.1)" },
     { c: "    return a + b" },
     { c: "", w: "" },
     { c: "slow_add = timed(slow_add)", w: "**Replace the name with the wrapped version.** This line is the entire trick.", hi: true },
     { c: "print(slow_add(2, 3))" }
    ],
    out: "slow_add took 0.1003s\n5" } },

  { h: "The @ is syntax for that one line" },
  { vs: { t: "Identical in every way", lang: "python",
    bad: { c: "def slow_add(a, b):\n    return a + b\n\nslow_add = timed(slow_add)", label: "By hand",
      w: "Works perfectly. The reassignment sits at the bottom, far from the definition, so a reader can miss it entirely." },
    good: { c: "@timed\ndef slow_add(a, b):\n    return a + b", label: "With @",
      w: "**`@timed` above a `def` means exactly `slow_add = timed(slow_add)`.** That is the complete definition of the syntax — sugar for one reassignment, placed where you cannot miss it." } } },
  { n: "Everything else about decorators follows from that one equivalence. When a decorator confuses you, mentally rewrite `@d` as `f = d(f)` and it resolves.",
    nt: "The whole of it, in one line" },

  { h: "functools.wraps — do not skip this" },
  { code: { lang: "python",
    lines: [
     { c: "print(slow_add.__name__)", w: "**`wrapper`** — not `slow_add`. The original was replaced, so its name, docstring and signature are gone, and every traceback now points at `wrapper`." },
     { c: "", w: "" },
     { c: "from functools import wraps", w: "" },
     { c: "", w: "" },
     { c: "def timed(func):", w: "" },
     { c: "    @wraps(func)", w: "**Copies the original's name, docstring and metadata onto the wrapper.** One line, and debugging stops being miserable. Always include it.", hi: true },
     { c: "    def wrapper(*args, **kwargs):", w: "" },
     { c: "        ..." },
     { c: "    return wrapper" }
    ] } },

  { h: "Decorators that take arguments" },
  { code: { lang: "python", t: "One more layer, for the same reason",
    lines: [
     { c: "def repeat(times):", w: "**The outer layer takes the decorator's own argument** and returns the actual decorator." },
     { c: "    def decorator(func):", w: "The middle layer is the decorator proper — takes a function." },
     { c: "        @wraps(func)" },
     { c: "        def wrapper(*args, **kwargs):", w: "The inner layer is the replacement function." },
     { c: "            for _ in range(times):", w: "`times` is captured from the outermost scope by the closure." },
     { c: "                result = func(*args, **kwargs)" },
     { c: "            return result" },
     { c: "        return wrapper" },
     { c: "    return decorator" },
     { c: "", w: "" },
     { c: "@repeat(times=3)", w: "**`@repeat(3)` calls `repeat` first**, and whatever it returns is used as the decorator. That is why there are three layers rather than two." },
     { c: "def greet():" },
     { c: "    print(\"hi\")" }
    ],
    after: "Three levels is as deep as it goes. The rule stays the same: `@d(x)` means `f = d(x)(f)`." } },

  { h: "The ones you will actually meet" },
  { tbl: { h: ["Decorator", "From", "Does"],
    rows: [
     ["`@property`", "built in", "Method accessed like an attribute"],
     ["`@staticmethod` / `@classmethod`", "built in", "A method that takes no `self`, or the class instead"],
     ["`@dataclass`", "`dataclasses`", "Generates `__init__`, `__repr__`, `__eq__`"],
     ["`@lru_cache`", "`functools`", "**Caches results by arguments** — one line can turn a slow recursive function fast"],
     ["`@pytest.fixture`", "pytest", "Supplies test data to any test that names it"],
     ["`@app.route(\"/\")`", "Flask", "Registers a function as a URL handler"]
    ] } },
  { code: { lang: "python", t: "The one that feels like cheating",
    lines: [
     { c: "from functools import lru_cache", w: "" },
     { c: "", w: "" },
     { c: "@lru_cache(maxsize=None)", w: "**Remembers every result by its arguments.** A repeat call with the same arguments returns instantly without running the body." },
     { c: "def fib(n):", w: "" },
     { c: "    return n if n < 2 else fib(n - 1) + fib(n - 2)", w: "Naively this is exponential — `fib(40)` takes about thirty seconds. With the cache it is instant, because each `n` is computed once." }
    ],
    after: "Only safe on a **pure** function — same inputs, same output, no side effects. Cache something that reads a file or a clock and you will serve stale results forever." } },

  { tryit: { t: "Write a retry decorator",
    task: "Write `@retry(times=3)` that re-runs a function when it raises, up to `times` attempts, and re-raises if all of them fail.",
    hint: "Three layers, a loop, and a `try`/`except` that only re-raises on the final attempt.",
    sol: { lang: "python", code: "from functools import wraps\n\ndef retry(times=3):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as err:\n                    if attempt == times:\n                        raise\n                    print(f\"attempt {attempt} failed ({err}), retrying\")\n        return wrapper\n    return decorator\n\n@retry(times=3)\ndef flaky():\n    ..." },
    w: "A bare `raise` inside an `except` re-raises the original exception **with its original traceback intact** — far better than `raise err`, which would point at this line instead of where it really failed." } }
 ],
 k: [
  "`@d` above a `def` means exactly `f = d(f)`. Everything else follows from that.",
  "A decorator takes a function and returns a replacement, usually `*args, **kwargs` so it fits anything.",
  "Always `@wraps(func)`, or names and tracebacks point at `wrapper` forever.",
  "`@d(x)` means `f = d(x)(f)` — which is why an argument-taking decorator needs three layers."
 ],
 r: ["Higher-Order Function", "Closure", "Caching", "Pure Function"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "from functools import wraps", w: "import the helper that preserves a wrapped function's identity" },
   { c: "def timed(func):", w: "begin a decorator that takes the function being decorated" },
   { c: "    def wrapper(*args, **kwargs):", w: "define the replacement function that accepts any signature" },
   { c: "        result = func(*args, **kwargs)", w: "call the original function, forwarding every argument" },
   { c: "    @wraps(func)", w: "copy the original's name and docstring onto the wrapper" },
   { c: "@lru_cache(maxsize=None)", w: "cache a pure function's results by its arguments" }
  ]
 }
},

{
 t: "Type Hints",
 m: "pythonic",
 lvl: "intermediate",
 s: "Saying what a function expects — documentation your editor can actually check.",
 goal: [
  "Annotate parameters, returns and variables",
  "Write hints for collections, optionals and unions",
  "Explain what Python does with a hint at runtime — which is nothing"
 ],
 b: [
  { p: "Python does not check types. That was the trade from the very first lesson: fast to write, and a mistake about what a variable holds is only found when that line runs. Type hints buy back much of the safety without giving up the flexibility." },

  { code: { lang: "python", t: "The syntax",
    lines: [
     { c: "def greet(name: str, times: int = 1) -> str:", w: "**`name: str` annotates a parameter. `-> str` annotates the return.** A default still goes after the annotation." },
     { c: "    return f\"Hello {name}! \" * times" },
     { c: "", w: "" },
     { c: "count: int = 0", w: "A variable can be annotated too. Rarely necessary — the value usually makes it obvious — but useful when it starts as `None` or empty." },
     { c: "names: list[str] = []", w: "**Here it earns its place.** `[]` alone tells a reader nothing; this says a list of strings is coming." }
    ] } },

  { n: "**Python ignores these completely at runtime.** `greet(42)` runs and produces nonsense — no error, no check. Hints are for humans and for tools: your editor uses them for autocomplete and squiggles, and a type checker like **mypy** or **Pyright** reads them and reports mismatches before you run anything. Nothing is enforced unless you run the checker.",
    nt: "They are checked by tools, never by Python" },

  { h: "Collections" },
  { code: { lang: "python", t: "Say what is inside, not just the container",
    lines: [
     { c: "scores: list[int]", w: "A list of integers. `list` alone would say nothing about the contents." },
     { c: "lookup: dict[str, int]", w: "**Keys then values.** A dictionary from names to counts." },
     { c: "point: tuple[float, float]", w: "**A fixed-length tuple** — exactly two floats, in order." },
     { c: "row: tuple[str, ...]", w: "**The `...` means any number**, all of the same type." },
     { c: "tags: set[str]", w: "" },
     { c: "", w: "" },
     { c: "def load(path: str) -> list[dict[str, str]]:", w: "**Nested, and this one is genuinely useful** — it tells a reader exactly what `csv.DictReader` gives back without them having to look it up." },
     { c: "    ..." }
    ],
    after: "Before Python 3.9 you had to write `List[int]` with an import from `typing`. You will still see that in older code; the lowercase built-in form is correct in anything modern." } },

  { h: "When a value might be missing" },
  { code: { lang: "python",
    lines: [
     { c: "def find(name: str) -> str | None:", w: "**`|` means *either of these*.** This says it returns a string **or** `None` — and it is the most valuable hint you can write, because it forces every caller to consider the missing case." },
     { c: "    ..." },
     { c: "", w: "" },
     { c: "def parse(value: str | int) -> float:", w: "A parameter that legitimately accepts two types." },
     { c: "    ..." },
     { c: "", w: "" },
     { c: "def find(name: str) -> Optional[str]:", w: "The older spelling, needing `from typing import Optional`. `Optional[str]` means exactly `str | None` — it does **not** mean *this argument is optional*, which is a genuinely misleading name." }
    ] } },
  { p: "A checker will now flag `find(\"x\").upper()` as an error, because the result might be `None` and `None` has no `.upper()`. That single class of bug — `AttributeError: 'NoneType' object has no attribute ...` — is one of the most common failures in Python, and this catches it before you run." },

  { h: "Where hints pay for themselves" },
  { vs: { t: "The same function, with and without", lang: "python",
    bad: { c: "def process(data, config, retries=3):\n    ...", label: "What is any of this?",
      w: "Is `data` a list, a DataFrame, a path? Is `config` a dict or an object? You must read the body — or the caller — to find out. Autocomplete can offer nothing." },
    good: { c: "def process(\n    data: list[dict[str, str]],\n    config: Config,\n    retries: int = 3,\n) -> pd.DataFrame:\n    ...", label: "Answered before you read a line",
      w: "The signature is now the documentation, and it cannot go stale the way a comment can — a checker verifies it. Type `config.` and your editor lists the real fields." } } },

  { h: "How much to use" },
  { l: [
   "**Always on public functions** — anything another file, or another person, will call.",
   "**Always when the answer is `None` sometimes.** `-> str | None` is the highest-value hint there is.",
   "**Skip inside short local functions** where the values are obvious from two lines away.",
   "**Do not fight the checker.** If a hint is becoming baroque, the design is usually the problem, not the type system.",
   "**Add them gradually.** Type checking is opt-in and file-by-file; a project can be half typed and perfectly fine."
  ] },

  { h: "Running the checker" },
  { term: { lines: [
   { c: "pip install mypy", w: "Or `pyright`. In VS Code the Pylance extension already does this live — set `python.analysis.typeCheckingMode` to `basic` and squiggles start appearing." },
   { c: "mypy analysis/", w: "Checks a folder without running any of it." },
   { out: "analysis/report.py:14: error: Argument 1 to \"render\" has incompatible type \"str\"; expected \"list[str]\"\nFound 1 error in 1 file (checked 6 source files)" }
  ] } },
  { trap: "Type hints do not validate data from outside your program. A JSON field annotated `int` arrives as whatever the sender put there, and no hint will stop a string. For untrusted input you still need real runtime validation — the library for that is **pydantic**, which reads the same annotations and actually enforces them." },

  { tryit: { t: "Annotate a real function",
    task: "Add complete hints to this: `def top_scorers(rows, n=3): return sorted(rows, key=lambda r: r[\"score\"], reverse=True)[:n]` — where `rows` is a list of dictionaries mapping strings to strings and ints.",
    hint: "The values are mixed, so the value type is a union. The return is the same shape as the input.",
    sol: { lang: "python", code: "def top_scorers(\n    rows: list[dict[str, str | int]],\n    n: int = 3,\n) -> list[dict[str, str | int]]:\n    return sorted(rows, key=lambda r: r[\"score\"], reverse=True)[:n]\n\n# clearer still, with a name for the shape\nRow = dict[str, str | int]\n\ndef top_scorers(rows: list[Row], n: int = 3) -> list[Row]:\n    ..." },
    w: "The second version is the point. A **type alias** gives the shape a name, so the signature reads as a sentence instead of a wall of brackets. When a hint gets long, name it." } }
 ],
 k: [
  "`def f(x: int) -> str:` annotates a parameter and a return; Python ignores both at runtime.",
  "Say what is inside the container: `list[int]`, `dict[str, int]`, `tuple[float, float]`.",
  "`str | None` is the highest-value hint you can write — it forces callers to handle the missing case.",
  "Hints are checked by mypy or Pyright, never by Python; use pydantic for untrusted input."
 ],
 r: ["Type Hint", "Static Typing", "Dynamic Typing", "Type Inference", "Linter"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "def greet(name: str, times: int = 1) -> str:", w: "annotate two parameters and the return type" },
   { c: "names: list[str] = []", w: "annotate an empty list so a reader knows what goes in it" },
   { c: "def find(name: str) -> str | None:", w: "say a function returns a string or nothing" },
   { c: "lookup: dict[str, int]", w: "annotate a dictionary from names to counts" },
   { c: "def load(path: str) -> list[dict[str, str]]:", w: "annotate a loader returning a list of string dictionaries" }
  ]
 }
},

{
 t: "Testing With pytest",
 m: "pythonic",
 lvl: "intermediate",
 s: "Proving your code works, automatically, so you can change it without fear.",
 goal: [
  "Write and run a test in under a minute",
  "Test many cases without repeating yourself",
  "Say what makes a test worth having"
 ],
 b: [
  { p: "Every beginner tests their code — by running it and looking at the output. That works, and it does not scale: you re-check by hand every time, and you stop bothering, and then a change in one place breaks something in another and nobody notices for a week." },
  { p: "An automated test is the same check, written once, run in a second, forever. The real payoff is not catching bugs today — it is that **you can change code without fear**, because the tests will tell you what you broke." },

  { term: { lines: [
   { c: "pip install pytest", w: "Into your virtual environment, as always." }
  ] } },

  { code: { lang: "python", file: "test_geometry.py", t: "A complete test file",
    lines: [
     { c: "from geometry import area", w: "Import the thing you are testing." },
     { c: "", w: "" },
     { c: "def test_area_of_unit_circle():", w: "**The name must start with `test_`** — that is how pytest finds it, in files named `test_*.py`. No class, no framework, no boilerplate." },
     { c: "    assert area(1) == 3.14159", w: "**`assert` is a plain Python statement**: if the expression is false it raises. pytest rewrites it so a failure shows both sides, which is why you never need a special assertion library." },
     { c: "", w: "" },
     { c: "def test_area_of_zero_is_zero():", w: "**One test, one behaviour.** A failing test should name the broken thing on its own." },
     { c: "    assert area(0) == 0" }
    ] } },
  { term: { lines: [
   { c: "pytest", w: "Run from the project root. It finds every `test_*.py` beneath, runs every `test_` function and reports." },
   { out: "collected 2 items\n\ntest_geometry.py ..                                   [100%]\n\n2 passed in 0.01s" },
   { c: "pytest -v", w: "Names every test rather than printing dots." },
   { c: "pytest -k circle", w: "Run only tests whose name contains `circle` — how you iterate on one failure." },
   { c: "pytest -x", w: "Stop at the first failure instead of running everything." }
  ] } },

  { h: "What a failure looks like" },
  { code: { lang: "text", t: "This is why pytest won",
    lines: [
     { c: "    def test_area_of_unit_circle():", w: "" },
     { c: ">       assert area(1) == 3.14159", w: "The failing line." },
     { c: "E       assert 6.28318 == 3.14159", w: "**Both sides, computed and printed.** You wrote one word — `assert` — and got a full diff. For lists and dicts it shows exactly which element differs.", hi: true },
     { c: "E        +  where 6.28318 = area(1)", w: "And where the left-hand value came from." }
    ] } },

  { h: "Testing that something raises" },
  { code: { lang: "python",
    lines: [
     { c: "import pytest", w: "" },
     { c: "", w: "" },
     { c: "def test_negative_radius_is_rejected():", w: "" },
     { c: "    with pytest.raises(ValueError):", w: "**Passes only if the block raises `ValueError`.** If nothing raises, the test fails — which is the point, because silently accepting bad input is the bug." },
     { c: "        area(-1)" },
     { c: "", w: "" },
     { c: "def test_error_message_is_useful():", w: "" },
     { c: "    with pytest.raises(ValueError, match=\"negative\"):", w: "`match` checks the message too, so a helpful error stays helpful." },
     { c: "        area(-1)" }
    ] } },

  { h: "Many cases, one test" },
  { vs: { t: "The same coverage, two ways", lang: "python",
    bad: { c: "def test_area():\n    assert area(0) == 0\n    assert area(1) == 3.14159\n    assert area(2) == 12.56636", label: "All in one",
      w: "The first failure stops the function, so you never learn whether the other two pass. One red test tells you almost nothing." },
    good: { c: "@pytest.mark.parametrize(\"radius, expected\", [\n    (0, 0),\n    (1, 3.14159),\n    (2, 12.56636),\n])\ndef test_area(radius, expected):\n    assert area(radius) == expected", label: "Parametrised",
      w: "**Three separate tests from one function.** Each runs independently, each is named in the output, and adding a case is one line. This is the decorator idea from two lessons ago doing real work." } } },

  { h: "Fixtures — shared setup" },
  { code: { lang: "python",
    lines: [
     { c: "@pytest.fixture", w: "**Marks a function as a supplier of test data.**" },
     { c: "def sample_rows():", w: "" },
     { c: "    return [{\"name\": \"Aryan\", \"score\": 91}, {\"name\": \"Sam\", \"score\": 78}]" },
     { c: "", w: "" },
     { c: "def test_top_scorer(sample_rows):", w: "**Name the fixture as a parameter and pytest supplies it.** Each test gets a fresh call, so one test cannot corrupt another's data." },
     { c: "    assert top_scorers(sample_rows, 1)[0][\"name\"] == \"Aryan\"" },
     { c: "", w: "" },
     { c: "def test_count(sample_rows, tmp_path):", w: "**`tmp_path` is built in** — a fresh temporary directory per test, cleaned up automatically. It is how you test file code without leaving mess behind." },
     { c: "    ..." }
    ] } },

  { h: "What is actually worth testing" },
  { l: [
   "**The edge cases.** Empty list, zero, negative, `None`, a single item, a huge one. This is where bugs live — the middle of the range almost always works.",
   "**The bug you just fixed.** Write a test that fails before the fix and passes after. It never comes back, and that is the single highest-value test you can write.",
   "**Anything with tricky logic.** Date arithmetic, tax rules, discounts, anything with a specification.",
   "**Not** getters, setters, or code that only calls a library. Testing that pandas works is not your job."
  ] },
  { n: "The design pressure is the hidden benefit. A function that is hard to test is nearly always badly designed — it does too much, reaches out to a network, or depends on hidden global state. When a test is painful to write, the useful response is to fix the code, not to write a more elaborate test.",
    nt: "Hard to test means badly designed" },

  { h: "The layout that works" },
  { code: { lang: "text",
    lines: [
     { c: "project/", w: "" },
     { c: "├── analysis/", w: "Your package." },
     { c: "│   ├── __init__.py" },
     { c: "│   └── stats.py" },
     { c: "├── tests/", w: "**Tests beside the code, not inside it.** They are not part of what you ship." },
     { c: "│   ├── test_stats.py", w: "One test file per module is a good default." },
     { c: "│   └── conftest.py", w: "**Fixtures shared across files go here** — pytest finds it automatically, with no import needed." },
     { c: "└── pyproject.toml" }
    ] } },

  { tryit: { t: "Test a function properly",
    task: "Write tests for `average(numbers)` that cover: a normal list, a single item, an empty list raising `ValueError`, and negative numbers. Use `parametrize` where it helps.",
    hint: "The empty case needs `pytest.raises` and cannot be parametrised with the others, since it has no expected value.",
    sol: { lang: "python", code: "import pytest\nfrom stats import average\n\n@pytest.mark.parametrize(\"numbers, expected\", [\n    ([1, 2, 3], 2.0),\n    ([5], 5.0),\n    ([-2, 2], 0.0),\n    ([0, 0, 0], 0.0),\n])\ndef test_average(numbers, expected):\n    assert average(numbers) == pytest.approx(expected)\n\ndef test_average_of_empty_raises():\n    with pytest.raises(ValueError, match=\"empty\"):\n        average([])" },
    w: "`pytest.approx` is the float-comparison rule from the numbers lesson, packaged. Comparing floats with `==` in a test is exactly the trap that lesson warned about, and this is the fix." } }
 ],
 k: [
  "A test is a function named `test_*` in a file named `test_*.py`, containing a plain `assert`.",
  "pytest rewrites `assert` so a failure shows both sides — no assertion library needed.",
  "`@pytest.mark.parametrize` turns one function into many independent named tests.",
  "Test the edge cases and every bug you fix; a function that is hard to test is badly designed."
 ],
 r: ["Unit Test", "Test-Driven Development", "Assertion", "Regression", "Code Coverage"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "def test_area_of_zero_is_zero():", w: "declare a test function pytest will discover", hint: "the name prefix matters" },
   { c: "    assert area(0) == 0", w: "assert a function returns the expected value" },
   { c: "    with pytest.raises(ValueError):", w: "assert that the block below raises a specific error" },
   { c: "@pytest.mark.parametrize(\"radius, expected\", [", w: "begin turning one test into many with a table of cases" },
   { c: "@pytest.fixture", w: "mark a function as a supplier of test data" },
   { c: "    assert average(numbers) == pytest.approx(expected)", w: "compare floats in a test without exact equality" }
  ]
 }
}

]);
