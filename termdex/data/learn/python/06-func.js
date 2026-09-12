/* Python — functions. */
TD.addLessons("python", [

{
 t: "Functions — Naming a Piece of Work",
 m: "func",
 lvl: "core",
 s: "The single most important idea in programming, and the one that makes large programs possible.",
 goal: [
  "Define a function, call it, and get a value back",
  "Explain the difference between a parameter and an argument",
  "Say why a function that prints is worse than one that returns"
 ],
 b: [
  { p: "Everything so far has been one long script. That works up to about fifty lines and then collapses, because a program is not a list of instructions to a human reader — it is a set of ideas, and ideas need names." },
  { p: "A **function** is a named piece of work. You define it once and run it whenever you want, with different inputs. It is the mechanism by which a program stops being a script and becomes software." },

  { syn: { t: "Defining one",
    parts: [
     { p: "def", w: "**The keyword** — short for *define*. It tells Python that what follows is a function to be created and remembered, not run now. Recall from the execution lesson: the body does **not** run at this point." },
     { p: " " },
     { p: "greet", w: "**The name.** snake_case, like a variable, and it should be a verb or verb phrase — the function *does* something. `calculate_total`, not `total_calculator`." },
     { p: "(", w: "**Parentheses, always** — even when the function takes nothing. They are what make it a function definition rather than a variable assignment." },
     { p: "name, greeting", w: "**The parameters.** Names that will exist inside the function, holding whatever the caller supplies. They do not exist anywhere else in your program." },
     { p: ")" },
     { p: ":", w: "The colon opening the block, as with `if` and `for`." }
    ],
    after: "Then the body is indented underneath. Everything indented belongs to the function; the first unindented line afterwards is outside it again." } },

  { code: { lang: "python", file: "greet.py", t: "Define it, then call it",
    lines: [
     { c: "def greet(name):", w: "One parameter, called `name`." },
     { c: "    return f\"Hello, {name}!\"", w: "**`return` hands a value back to whoever called this**, and ends the function immediately. Nothing after a `return` in the same block ever runs." },
     { c: "", w: "" },
     { c: "message = greet(\"Aryan\")", w: "**The call.** The parentheses are what run it. `\"Aryan\"` is the **argument** — the actual value — which becomes the parameter `name` inside. The returned value comes back out and is stored in `message`." },
     { c: "print(message)" },
     { c: "", w: "" },
     { c: "print(greet(\"Sam\"))", w: "Same function, different argument, different result. That reuse is the entire point." }
    ],
    out: "Hello, Aryan!\nHello, Sam!" } },

  { n: "**Parameter** is the name in the definition. **Argument** is the value at the call site. People use the words interchangeably in conversation and precisely in documentation, so it is worth knowing which is which: `name` is a parameter, `\"Aryan\"` is an argument.",
    nt: "Parameter versus argument" },

  { h: "return versus print" },
  { p: "This trips up nearly every beginner, and getting it right early saves a great deal of pain." },
  { vs: { t: "The same function, one of them useless", lang: "python",
    bad: { c: "def add(a, b):\n    print(a + b)\n\nresult = add(2, 3)\nprint(result * 2)", label: "Prints 5, then crashes",
      w: "`print` sends text to the screen and produces **no value**, so the function returns `None`. `result` is `None`, and `None * 2` is a `TypeError`. The answer was displayed and then thrown away." },
    good: { c: "def add(a, b):\n    return a + b\n\nresult = add(2, 3)\nprint(result * 2)", label: "Prints 10",
      w: "`return` hands the number back, so `result` is genuinely 5 and can be used in more arithmetic. **A function that computes should return; only the outermost code should print.**" } } },
  { p: "The rule generalises: a function that prints can only ever be used for showing something to a human. A function that returns can be used by other functions, tested automatically, saved to a file or sent over a network. Returning keeps your options open; printing closes them." },
  { p: "A function with no `return` statement returns `None`. That is not an error — plenty of functions exist purely to *do* something rather than compute something — but if you meant to get a value back and got `None`, a missing `return` is the first thing to check." },

  { h: "Several parameters" },
  { code: { lang: "python",
    lines: [
     { c: "def describe(name, age, city):", w: "Three parameters, in a fixed order." },
     { c: "    return f\"{name}, {age}, from {city}\"" },
     { c: "", w: "" },
     { c: "print(describe(\"Aryan\", 30, \"Mumbai\"))", w: "**Positional arguments** — matched by order. Get the order wrong and you get a wrong answer with no error at all, which is why long positional argument lists are dangerous." },
     { c: "", w: "" },
     { c: "print(describe(city=\"Mumbai\", name=\"Aryan\", age=30))", w: "**Keyword arguments** — matched by name, so order stops mattering. Clearer at the call site, and the right choice as soon as there are more than two or three." }
    ],
    out: "Aryan, 30, from Mumbai\nAryan, 30, from Mumbai" } },

  { h: "Defaults" },
  { code: { lang: "python",
    lines: [
     { c: "def greet(name, greeting=\"Hello\"):", w: "**A default value** makes that parameter optional. Parameters with defaults must come **after** all the ones without — Python cannot work out the positions otherwise." },
     { c: "    return f\"{greeting}, {name}!\"" },
     { c: "", w: "" },
     { c: "print(greet(\"Aryan\"))", w: "The default is used." },
     { c: "print(greet(\"Aryan\", \"Welcome\"))", w: "Overridden positionally." },
     { c: "print(greet(\"Aryan\", greeting=\"Welcome\"))", w: "Overridden by name — clearer, and what you should prefer." }
    ],
    out: "Hello, Aryan!\nWelcome, Aryan!\nWelcome, Aryan!",
    after: "You have already used this: `print(x, end=\"\")` and `sorted(x, reverse=True)` are exactly this pattern in built-in functions." } },
  { trap: "Never use a list, dictionary or set as a default value. `def f(items=[])` creates **one** list when the `def` line runs and shares it across every call — the bug from the mutability lesson. Use `None` and build the real default inside the body." },

  { h: "Returning several things" },
  { code: { lang: "python",
    lines: [
     { c: "def stats(numbers):", w: "" },
     { c: "    return min(numbers), max(numbers), sum(numbers) / len(numbers)", w: "**This returns one tuple** containing three values — the commas build it, as the tuples lesson showed." },
     { c: "", w: "" },
     { c: "low, high, avg = stats([3, 9, 6])", w: "And the caller unpacks it into three names. The idiomatic Python way to hand back more than one result." },
     { c: "print(f\"{low} {high} {avg:.1f}\")" }
    ],
    out: "3 9 6.0" } },

  { h: "What makes a good function" },
  { ol: [
   "**One job.** If you cannot describe what it does in a single sentence without the word *and*, it is two functions.",
   "**A name that says what it does.** `calculate_tax` not `do_stuff`. If naming it is hard, that is a signal it does too much.",
   "**Short.** No hard rule, but a function that does not fit on a screen is difficult to hold in your head.",
   "**Return rather than print.** Keep it usable by other code.",
   "**Predictable.** Same inputs, same output, no surprises elsewhere. That property is called *purity* and it makes a function trivially testable."
  ] },

  { tryit: { t: "Refactor a script into functions",
    task: "Take this and split it into two functions — one that converts a temperature and one that describes it — plus a couple of lines that use them.\n\n`c = 30`\n`f = c * 9/5 + 32`\n`if f > 85: print(\"hot\")`\n`else: print(\"fine\")`",
    hint: "Both should `return`, not print. Only the last two lines should print anything.",
    sol: { lang: "python", code: "def to_fahrenheit(celsius):\n    return celsius * 9 / 5 + 32\n\ndef describe(fahrenheit):\n    return \"hot\" if fahrenheit > 85 else \"fine\"\n\ntemp_f = to_fahrenheit(30)\nprint(f\"{temp_f:.0f}F is {describe(temp_f)}\")" },
    w: "Each function now has one job, a name that explains it, and returns a value. You could test either one without running the other — which is exactly what makes code maintainable." } }
 ],
 k: [
  "`def name(parameters):` defines; `name(arguments)` calls. The parentheses are what run it.",
  "`return` hands a value back and ends the function; a function with no `return` gives `None`.",
  "Functions that compute should return, not print — printing throws the answer away.",
  "Keyword arguments and defaults make calls readable; never default to a mutable value."
 ],
 r: ["Function", "Parameter", "Return Value", "Pure Function", "Docstring"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "def greet(name):", w: "begin defining a function taking one parameter called name" },
   { c: "    return f\"Hello, {name}!\"", w: "hand back a greeting built from the parameter", hint: "indented four spaces" },
   { c: "message = greet(\"Aryan\")", w: "call the function and keep what it returns" },
   { c: "def greet(name, greeting=\"Hello\"):", w: "define a function whose second parameter is optional" },
   { c: "low, high, avg = stats(numbers)", w: "unpack three returned values into three names" }
  ]
 }
},

{
 t: "Scope — Where a Name Lives",
 m: "func",
 lvl: "intermediate",
 s: "Why a variable inside a function is invisible outside it, and why that is a feature.",
 goal: [
  "Predict whether a name is visible at a given point in a file",
  "Explain why assigning inside a function does not affect the outside",
  "Say why `global` is almost never the right answer"
 ],
 b: [
  { p: "A function is not just a named block — it is a **sealed room**. Names created inside it exist only inside it, and vanish when it finishes. That containment is what makes functions safe to write without reading the rest of the program." },

  { code: { lang: "python", t: "Local names do not escape",
    lines: [
     { c: "def calculate():", w: "" },
     { c: "    result = 42", w: "`result` is **local** to this function. It is created when the function runs and destroyed when it returns." },
     { c: "    return result" },
     { c: "", w: "" },
     { c: "calculate()", w: "The function runs. `result` exists briefly, then does not." },
     { c: "print(result)", w: "**`NameError: name 'result' is not defined`.** The name never existed out here.", hi: true }
    ],
    out: "NameError: name 'result' is not defined" } },
  { p: "This is the point, not a limitation. It means you can call a function called `process` in a file with a thousand lines and be certain that whatever it does to its own variables cannot touch yours. Without scope, every variable name in a large program would be a potential collision." },

  { h: "Reading out is allowed; writing is not" },
  { code: { lang: "python",
    lines: [
     { c: "rate = 0.18", w: "A **global** — defined at the top level of the file." },
     { c: "", w: "" },
     { c: "def with_tax(amount):", w: "" },
     { c: "    return amount * (1 + rate)", w: "**Reading a global from inside works.** Python looks in the local scope first, does not find `rate`, and looks outward." },
     { c: "", w: "" },
     { c: "print(with_tax(100))" }
    ],
    out: "118.0" } },
  { code: { lang: "python", t: "But assigning is a different matter",
    lines: [
     { c: "count = 0", w: "" },
     { c: "", w: "" },
     { c: "def increment():", w: "" },
     { c: "    count = count + 1", w: "**`UnboundLocalError`.** The moment Python sees `count` being *assigned* anywhere in this function, it decides `count` is local — for the whole function, including this line. So the right-hand side reads a local that has no value yet.", hi: true },
     { c: "", w: "" },
     { c: "increment()" }
    ],
    out: "UnboundLocalError: cannot access local variable 'count' where it is not associated with a value" } },
  { n: "The rule is exact: **Python decides a name is local if it is assigned anywhere in the function**, and it decides this before running a single line. That is why the error appears on a line that *reads* the variable. It is one of Python's more confusing messages, and now it is not.",
    nt: "Why the error is on that line" },

  { h: "The LEGB order" },
  { p: "When Python meets a name, it searches four scopes in a fixed order and stops at the first match." },
  { tbl: { h: ["", "Scope", "Means"],
    rows: [
     ["**L**", "Local", "Inside the current function"],
     ["**E**", "Enclosing", "Inside a function that contains this one"],
     ["**G**", "Global", "At the top level of this file"],
     ["**B**", "Built-in", "Python's own names — `print`, `len`, `list`, `sum`"]
    ] } },
  { trap: "The B at the end is why naming a variable `list` or `sum` is a genuine problem. `sum = 0` at the top of your file shadows the built-in `sum` for the whole file, and a `sum(scores)` two hundred lines later fails with `TypeError: 'int' object is not callable`. Your editor colours built-ins differently — if your new variable name changed colour, pick another one." },

  { h: "global, and why to avoid it" },
  { code: { lang: "python",
    lines: [
     { c: "count = 0", w: "" },
     { c: "", w: "" },
     { c: "def increment():", w: "" },
     { c: "    global count", w: "**Declares that `count` refers to the module-level one.** Now assignment reaches outside, and the error goes away." },
     { c: "    count = count + 1" }
    ] } },
  { vs: { t: "It works, and it is still the wrong answer", lang: "python",
    bad: { c: "count = 0\n\ndef increment():\n    global count\n    count += 1\n\nincrement()", label: "Reaches outside",
      w: "Now this function cannot be understood on its own — you must know what else touches `count`. It cannot be tested in isolation, it cannot be called safely from two places at once, and every bug involving `count` means auditing the whole file." },
    good: { c: "def increment(count):\n    return count + 1\n\ncount = increment(count)", label: "Take it in, hand it back",
      w: "Everything the function needs arrives as an argument and everything it produces leaves as a return value. It can be read, tested and reused without knowing anything about the rest of the program." } } },
  { p: "The honest rule: `global` is legal, it is occasionally right for a genuine module-level constant or a cache, and in code written by beginners it is almost always a sign that a value should have been passed in and returned instead." },

  { h: "Mutable arguments do reach outside" },
  { code: { lang: "python", t: "The exception, and it follows from the mutability lesson",
    lines: [
     { c: "def add_one(items):", w: "" },
     { c: "    items.append(1)", w: "**This modifies the caller's list.** The parameter is a second label on the same object — nothing was copied on the way in." },
     { c: "", w: "" },
     { c: "def rebind(items):", w: "" },
     { c: "    items = [99]", w: "**This does not.** Assignment moves the *local* label to a new list; the caller's label is untouched." },
     { c: "", w: "" },
     { c: "data = []", w: "" },
     { c: "add_one(data); print(data)", w: "Changed." },
     { c: "rebind(data); print(data)", w: "Unchanged." }
    ],
    out: "[1]\n[1]",
    after: "Scope controls **names**, not objects. A function cannot rebind the caller's name, but it can absolutely modify an object the caller can still see. Both lines above are consistent with that one sentence." } },
  { p: "A function that quietly modifies what it was given is a **side effect**, and side effects are where hard bugs live. Either return a new list, or name the function so its effect is obvious — `sort_in_place`, not `sorted_items`." },

  { tryit: { t: "Predict four outputs",
    task: "For each: does it print, or raise?\n1. `x=1` then `def f(): print(x)` then `f()`\n2. `x=1` then `def f(): x=2` then `f(); print(x)`\n3. `x=1` then `def f(): x=x+1` then `f()`\n4. `x=[1]` then `def f(): x.append(2)` then `f(); print(x)`",
    hint: "Three of them turn on whether the function *assigns* to the name. The fourth does not assign at all.",
    sol: { lang: "python", code: "# 1. prints 1     — reading a global is fine\n# 2. prints 1     — the assignment made a separate local; the global is untouched\n# 3. UnboundLocalError — assigned somewhere, so local everywhere, read before set\n# 4. prints [1, 2]    — no assignment, so it mutates the object the global names" },
    w: "Every one of these follows from the single rule: assignment anywhere in a function makes the name local for the whole function." } }
 ],
 k: [
  "Names created inside a function exist only there — that containment is the point of functions.",
  "Reading a global from inside works; assigning to one makes the name local for the entire function.",
  "Python resolves names Local, Enclosing, Global, Built-in — so never name a variable `list` or `sum`.",
  "Scope controls names, not objects: a function can still mutate a list you handed it."
 ],
 r: ["Scope", "Closure", "Pure Function", "Side Effect"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "def increment(count):\n    return count + 1", w: "a function that takes a value in and hands the new one back", hint: "two lines, no global" },
   { c: "global count", w: "declare that a name inside a function refers to the module-level one" },
   { c: "count = increment(count)", w: "call a function and reassign the result to the same name" }
  ]
 }
},

{
 t: "Flexible Arguments: *args and **kwargs",
 m: "func",
 lvl: "intermediate",
 s: "The two asterisks you have seen in every library's source, finally explained.",
 goal: [
  "Write a function that accepts any number of arguments",
  "Explain what `*` and `**` do in a definition and in a call",
  "Read a function signature from a real library without flinching"
 ],
 b: [
  { p: "You have seen `*args` and `**kwargs` in documentation and been told to ignore them. They are not advanced — they are one idea applied twice, and knowing them is what lets you read real library code." },

  { h: "*args — any number of positional arguments" },
  { code: { lang: "python",
    lines: [
     { c: "def total(*numbers):", w: "**The `*` means *collect every remaining positional argument into a tuple*.** The name `numbers` is yours to choose; `args` is only a convention." },
     { c: "    return sum(numbers)", w: "Inside, `numbers` is an ordinary tuple. Nothing special about it." },
     { c: "", w: "" },
     { c: "print(total(1, 2))", w: "`numbers` is `(1, 2)`." },
     { c: "print(total(1, 2, 3, 4, 5))", w: "`numbers` is `(1, 2, 3, 4, 5)`. One definition, any number of arguments." },
     { c: "print(total())", w: "And zero is fine — an empty tuple, and `sum(())` is 0." }
    ],
    out: "3\n15\n0" } },
  { p: "You have used this without noticing: `print(\"a\", \"b\", \"c\")` accepts any number of values because `print` is defined with `*args`." },

  { h: "**kwargs — any number of named arguments" },
  { code: { lang: "python",
    lines: [
     { c: "def configure(**settings):", w: "**Two asterisks means *collect every remaining keyword argument into a dictionary*.** The keys are the names used at the call site." },
     { c: "    for key, value in settings.items():", w: "Inside, `settings` is an ordinary dictionary." },
     { c: "        print(f\"{key} = {value}\")" },
     { c: "", w: "" },
     { c: "configure(debug=True, retries=3)", w: "`settings` is `{\"debug\": True, \"retries\": 3}`." }
    ],
    out: "debug = True\nretries = 3" } },

  { h: "Together, in order" },
  { code: { lang: "python", t: "The order in a definition is fixed and worth memorising",
    lines: [
     { c: "def process(required, optional=10, *args, **kwargs):", w: "**Required first, then defaults, then `*args`, then `**kwargs`.** Python cannot resolve any other order, and getting it wrong is a `SyntaxError`." },
     { c: "    print(required, optional, args, kwargs)" },
     { c: "", w: "" },
     { c: "process(1)", w: "Only the required one." },
     { c: "process(1, 2, 3, 4, mode=\"fast\")", w: "1 is required, 2 fills optional, 3 and 4 overflow into `args`, and `mode` goes to `kwargs`." }
    ],
    out: "1 10 () {}\n1 2 (3, 4) {'mode': 'fast'}" } },

  { h: "The same asterisks at a call site do the opposite" },
  { p: "This is the part that makes it click. In a *definition* the asterisks **collect**. In a *call* they **spread**." },
  { code: { lang: "python",
    lines: [
     { c: "def add(a, b, c):", w: "An ordinary function wanting exactly three arguments." },
     { c: "    return a + b + c" },
     { c: "", w: "" },
     { c: "numbers = [1, 2, 3]", w: "" },
     { c: "print(add(numbers))", w: "**`TypeError`** — that is one argument (a list), and the function wants three." },
     { c: "print(add(*numbers))", w: "**The `*` unpacks the list into separate arguments**, exactly as if you had typed `add(1, 2, 3)`.", hi: true },
     { c: "", w: "" },
     { c: "values = {\"a\": 1, \"b\": 2, \"c\": 3}", w: "" },
     { c: "print(add(**values))", w: "**`**` unpacks a dictionary into keyword arguments** — as if you had typed `add(a=1, b=2, c=3)`. The keys must match the parameter names exactly." }
    ],
    out: "6\n6" } },
  { n: "Definition collects, call spreads. `*` handles positional values and tuples; `**` handles named values and dictionaries. Four combinations, one idea — and once you see it that way, every signature in every library becomes readable.",
    nt: "The whole thing in one line" },

  { h: "Where you will actually meet it" },
  { code: { lang: "python", t: "Passing arguments through — the most common real use",
    lines: [
     { c: "def log_and_call(func, *args, **kwargs):", w: "A **wrapper**: it does not know or care what `func` expects." },
     { c: "    print(f\"Calling {func.__name__}\")", w: "Do something extra. Functions are values in Python, so one can be passed to another." },
     { c: "    return func(*args, **kwargs)", w: "**Collected on the way in, spread on the way out** — everything the caller gave is forwarded untouched." },
     { c: "", w: "" },
     { c: "log_and_call(add, 1, 2, 3)" }
    ],
    out: "Calling add\n6",
    after: "This is precisely how decorators work, and how most logging, timing, caching and retry libraries are built. That is why the pattern is everywhere once you start reading real code." } },

  { h: "Keyword-only parameters" },
  { code: { lang: "python",
    lines: [
     { c: "def connect(host, *, timeout=30, retries=3):", w: "**A bare `*` means everything after it must be passed by name.** It collects nothing; it is purely a marker." },
     { c: "    pass" },
     { c: "", w: "" },
     { c: "connect(\"db.local\", 60)", w: "`TypeError` — 60 cannot fill `timeout` positionally." },
     { c: "connect(\"db.local\", timeout=60)", w: "Fine, and unambiguous at the call site." }
    ],
    after: "Use this whenever a parameter is a setting rather than a subject. `connect(\"db.local\", 60, 5)` tells a reader nothing; `connect(\"db.local\", timeout=60, retries=5)` tells them everything." } },

  { tryit: { t: "Write a flexible formatter",
    task: "Write `report(title, *rows, **options)` that prints the title, then each row, and respects an `upper=True` option that uppercases everything.",
    hint: "`options.get(\"upper\", False)` reads the setting with a default. Build the transformation once, then apply it.",
    sol: { lang: "python", code: "def report(title, *rows, **options):\n    upper = options.get(\"upper\", False)\n\n    def fmt(text):\n        return text.upper() if upper else text\n\n    print(fmt(title))\n    print(\"-\" * len(title))\n    for row in rows:\n        print(fmt(row))\n\nreport(\"Sales\", \"North: 100\", \"South: 80\", upper=True)" },
    w: "One definition that takes a title, any number of rows and any number of options. That flexibility is exactly what library authors are buying with these asterisks." } }
 ],
 k: [
  "In a definition, `*args` collects extra positional arguments into a tuple and `**kwargs` collects named ones into a dictionary.",
  "In a call, `*` spreads a list into separate arguments and `**` spreads a dictionary into keyword arguments.",
  "Definition order is fixed: required, defaults, `*args`, `**kwargs`.",
  "A bare `*` forces everything after it to be passed by name — use it for settings."
 ],
 r: ["Parameter", "Function", "Dictionary", "Higher-Order Function"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "def total(*numbers):", w: "define a function taking any number of positional arguments" },
   { c: "def configure(**settings):", w: "define a function taking any number of named arguments" },
   { c: "print(add(*numbers))", w: "spread a list into separate arguments at a call" },
   { c: "print(add(**values))", w: "spread a dictionary into keyword arguments at a call" },
   { c: "return func(*args, **kwargs)", w: "forward every argument on to another function untouched" },
   { c: "def connect(host, *, timeout=30):", w: "force timeout to be passed by name only", hint: "a bare asterisk" }
  ]
 }
},

{
 t: "Lambdas and Functions as Values",
 m: "func",
 lvl: "intermediate",
 s: "Passing a function to another function — the idea behind sort keys, map, and most of pandas.",
 goal: [
  "Explain what it means that a function is a value",
  "Write a lambda and say when it is better than a `def`",
  "Use a function as a sort key or a filter"
 ],
 b: [
  { p: "In Python a function is an ordinary value. You can store it in a variable, put it in a list, hand it to another function or return it from one. That sounds abstract; it is the mechanism behind `sort(key=...)`, behind `pandas.apply`, and behind every callback you will ever write." },

  { code: { lang: "python", t: "The name and the call are different things",
    lines: [
     { c: "def shout(text):", w: "" },
     { c: "    return text.upper()" },
     { c: "", w: "" },
     { c: "print(shout(\"hi\"))", w: "**With parentheses: call it.** The result is the string." },
     { c: "print(shout)", w: "**Without parentheses: the function itself**, as a value. This is the distinction the whole lesson rests on." },
     { c: "", w: "" },
     { c: "loud = shout", w: "A second name for the same function — the label idea again, applied to a function." },
     { c: "print(loud(\"hi\"))", w: "Works identically." }
    ],
    out: "HI\n<function shout at 0x104a2b920>\nHI" } },
  { trap: "Writing `sorted(names, key=len())` instead of `key=len` is the classic version of this. `len()` **calls** it — with no argument, so it errors immediately. `len` **is** it, which is what `sorted` wants so it can call it once per item. Pass the name; do not call it." },

  { h: "lambda — a function with no name" },
  { syn: { t: "The syntax, which is deliberately minimal",
    parts: [
     { p: "lambda", w: "**The keyword.** It creates a function right here, as an expression, without a `def` and without a name. The word comes from lambda calculus, and knowing that helps with nothing." },
     { p: " " },
     { p: "x", w: "**The parameters**, comma separated, with no parentheses around them." },
     { p: ": ", w: "**The colon** separating parameters from the body." },
     { p: "x * 2", w: "**The body — a single expression, and its value is returned automatically.** There is no `return` keyword and there cannot be more than one expression. That restriction is deliberate: it stops lambdas growing." }
    ],
    after: "`lambda x: x * 2` is exactly equivalent to `def double(x): return x * 2`, except that it has no name. Use `def` when the thing deserves a name — which is most of the time." } },

  { h: "Where lambdas earn their place" },
  { code: { lang: "python", t: "Sorting by something other than the natural order",
    lines: [
     { c: "people = [(\"Aryan\", 30), (\"Sam\", 25), (\"Riya\", 35)]", w: "A list of tuples." },
     { c: "", w: "" },
     { c: "print(sorted(people))", w: "The default sorts by the first item of each tuple — alphabetically by name." },
     { c: "", w: "" },
     { c: "print(sorted(people, key=lambda person: person[1]))", w: "**`key` takes a function that is called once per item** and returns the value to sort on. This one pulls out the age. Defining a whole named function for this would be noise.", hi: true },
     { c: "", w: "" },
     { c: "print(sorted(people, key=lambda p: p[1], reverse=True))", w: "Oldest first." },
     { c: "", w: "" },
     { c: "print(max(people, key=lambda p: p[1]))", w: "The same `key` idea works on `max`, `min`, and `sorted` alike — one convention across all of them." }
    ],
    out: "[('Aryan', 30), ('Riya', 35), ('Sam', 25)]\n[('Sam', 25), ('Aryan', 30), ('Riya', 35)]\n[('Riya', 35), ('Aryan', 30), ('Sam', 25)]\n('Riya', 35)" } },

  { h: "map and filter, and why comprehensions won" },
  { code: { lang: "python",
    lines: [
     { c: "numbers = [1, 2, 3, 4, 5]", w: "" },
     { c: "", w: "" },
     { c: "doubled = list(map(lambda n: n * 2, numbers))", w: "**`map` applies a function to every item.** Needs wrapping in `list()` because it produces values lazily." },
     { c: "evens = list(filter(lambda n: n % 2 == 0, numbers))", w: "**`filter` keeps the items for which the function is true.**" },
     { c: "", w: "" },
     { c: "doubled = [n * 2 for n in numbers]", w: "**The comprehension does the same job**, shorter and without the `lambda` or the `list()`." },
     { c: "evens = [n for n in numbers if n % 2 == 0]", w: "Likewise." }
    ],
    after: "In Python, the comprehension is the idiomatic choice and `map`/`filter` are rarely written by hand. They are worth recognising because you will read them, especially in code written by people who came from another language." } },

  { h: "When not to use a lambda" },
  { vs: { t: "Naming it is usually better", lang: "python",
    bad: { c: "process = lambda x: x.strip().lower().replace(\" \", \"_\")\n\nresult = process(text)", label: "A named lambda",
      w: "If you are giving it a name anyway, you wanted a `def`. This version has a worse traceback — errors report `<lambda>` instead of `process` — and it cannot carry a docstring. Style checkers flag it." },
    good: { c: "def to_slug(text):\n    \"\"\"Normalise text into a URL-safe slug.\"\"\"\n    return text.strip().lower().replace(\" \", \"_\")\n\nresult = to_slug(text)", label: "Just write the function",
      w: "A name, a docstring, a useful traceback, and room to grow when the rule inevitably gets more complicated." } } },
  { n: "The honest rule: use a lambda when it is **short, used once, and passed straight to something else** — a `key`, a callback, a `pandas` `.apply`. Anywhere else, `def` is better. A lambda that needs a comment has already outgrown itself.",
    nt: "When a lambda is right" },

  { h: "Where this leads" },
  { p: "Functions being values is the foundation of a lot of Python you have not met yet: decorators wrap one function in another, callbacks hand a function to a library to run later, and `pandas` is built almost entirely on passing small functions into `apply`, `map` and `agg`. This lesson is why all of that will make sense when you reach it." },

  { tryit: { t: "Sort some dictionaries",
    task: "Given a list of dictionaries with `name` and `score` keys, print them sorted by score highest first, then print the single highest scorer's name.",
    hint: "`key=lambda u: u[\"score\"]` for both `sorted` and `max`.",
    sol: { lang: "python", code: "users = [\n    {\"name\": \"Aryan\", \"score\": 91},\n    {\"name\": \"Sam\", \"score\": 78},\n    {\"name\": \"Riya\", \"score\": 85},\n]\n\nfor u in sorted(users, key=lambda u: u[\"score\"], reverse=True):\n    print(f\"{u['name']}: {u['score']}\")\n\nbest = max(users, key=lambda u: u[\"score\"])\nprint(f\"Top: {best['name']}\")" },
    w: "Note the single quotes inside the f-string's braces — the outer string already used double quotes, and you cannot reuse the same quote character inside. That is the one f-string mechanical detail worth knowing." } }
 ],
 k: [
  "A function without parentheses is a value; with parentheses it is a call. Pass `len`, never `len()`.",
  "`lambda x: expr` is a nameless one-expression function, and its value is returned automatically.",
  "`key=` on `sorted`, `max` and `min` takes a function called once per item to decide what to compare.",
  "Use a lambda only when it is short, single-use and passed straight to something else."
 ],
 r: ["Lambda Function", "Higher-Order Function", "Function", "Closure", "List Comprehension"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "sorted(people, key=lambda person: person[1])", w: "sort a list of tuples by their second item" },
   { c: "max(users, key=lambda u: u[\"score\"])", w: "find the dictionary with the highest score" },
   { c: "names.sort(key=str.lower)", w: "sort names case-insensitively by passing a function, not calling it" },
   { c: "doubled = list(map(lambda n: n * 2, numbers))", w: "apply a doubling function to every number using map" }
  ]
 }
}

]);
