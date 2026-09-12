/* Programming Basics — functions, scope and the call stack. */
TD.addLessons("basics", [

{
 t: "Functions: Naming a Piece of Behaviour",
 m: "funcs",
 lvl: "core",
 s: "The first real abstraction — and the difference between defining something and running it.",
 goal: [
  "Explain why defining a function runs none of it",
  "Write a function that does exactly one thing",
  "Recognise when a block of code wants to become a function"
 ],
 b: [
  { p: "Everything so far — variables, conditions, loops — lets you write a longer and longer list of instructions. A **function** is the first thing that lets you write a *shorter* one. It is the point at which programming stops being transcription and starts being design." },

  { p: "A function is a named, reusable block of behaviour. You write it once, give it a name, and from then on you can invoke that behaviour by name from anywhere, as many times as you like, with different inputs each time." },

  { dg: "func-machine" },

  { h: "Defining and calling are different acts" },
  { p: "This confuses almost everyone at first, in the same way that writing and running confused everyone in Ground Zero." },

  { code: { lang: "python", t: "Nothing happens until the last line",
    lines: [
     { c: "def greet(name):", w: "**Defining.** This creates a function object and binds the name `greet` to it. The body is stored, not executed. If the body contained a division by zero, nothing would happen here." },
     { c: "    print(\"Hello, \" + name)", w: "This line has not run. It is a recipe card being filed away." },
     { c: "", w: "" },
     { c: "print(\"about to greet\")", w: "This is the first thing that actually prints." },
     { c: "", w: "" },
     { c: "greet(\"Aryan\")", w: "**Calling.** The brackets are what invoke it. *Now* the body runs, with `name` bound to `\"Aryan\"` for the duration of this one call." }
    ],
    out: "about to greet\nHello, Aryan" } },

  { trap: "Writing `greet` without the brackets does not call it. In Python and JavaScript it evaluates to the function *itself* — a perfectly valid value — and then throws it away. No error, no output, no clue. If a function seems not to be running, check for the missing `()` before checking anything else." },

  { h: "Why bother" },
  { p: "Four reasons, and the fourth one is the one nobody mentions to beginners." },

  { ol: [
   "**Do not repeat yourself.** Written once, called everywhere. Fixing a bug means fixing one place, and there is no possibility of fixing three of the four copies.",
   "**Naming is explaining.** `calculate_shipping(order)` tells a reader what fifteen lines do without them reading any of it. The name is documentation that cannot go stale.",
   "**Testing.** You can test a function in isolation. You cannot test line 340 of a three-hundred-line script.",
   "**Managing your own attention.** While writing a function you think about one problem. While reading a caller you think about *what*, not *how*. A function is a lid you can put on a box so you can stop thinking about what is inside it — and human working memory is small enough that this is not a convenience, it is the entire technique."
  ] },

  { vs: { lang: "python", t: "The same program with and without",
    bad: { label: "Repeated by hand", c: "sub = a_price * a_qty\ntax = sub * 0.2\na_total = sub + tax\n\nsub = b_price * b_qty\ntax = sub * 0.2\nb_total = sub + tax\n\nsub = c_price * c_qty\ntax = sub * 0.15   # <-- typo\nc_total = sub + tax",
      w: "Three copies. One of them has the wrong tax rate, and you had to read all nine lines to find it. When the rate changes you must edit three places and hope." },
    good: { label: "Named once", c: "def order_total(price, qty, rate=0.2):\n    subtotal = price * qty\n    return subtotal + subtotal * rate\n\na_total = order_total(a_price, a_qty)\nb_total = order_total(b_price, b_qty)\nc_total = order_total(c_price, c_qty)",
      w: "The typo is now impossible — there is only one tax rate in the program. The three call sites are each one line and read as sentences. Changing the rate is a one-word edit." }
  } },

  { h: "One function, one job" },
  { p: "The single most useful rule for writing functions: **a function should do one thing, and its name should say what that thing is.** If the honest name needs an *and* in it, you have two functions." },

  { vs: { lang: "python", t: "The and-test",
    bad: { label: "Three jobs in a trenchcoat", c: "def process_user(data):\n    # validates, saves, AND emails\n    if \"@\" not in data[\"email\"]:\n        return False\n    db.save(data)\n    send_welcome(data[\"email\"])\n    return True",
      w: "You cannot validate without saving. You cannot test the validation without a database. You cannot re-send a welcome email without re-saving. And the return value `False` is ambiguous — which of the three failed?" },
    good: { label: "Three functions", c: "def is_valid_email(email):\n    return \"@\" in email\n\ndef save_user(data):\n    return db.save(data)\n\ndef welcome(email):\n    send_welcome(email)",
      w: "Each is testable alone, reusable alone, and named for exactly what it does. The caller composes them in whatever order it needs — and can skip one." }
  } },

  { p: "The practical smell test, in order of usefulness: does the name need *and*? Is it longer than fits on a screen? Does it have more than about three levels of indentation? Would you struggle to write a one-sentence description of it? Any *yes* is a hint, not a law — but four *yes*es is a function that needs splitting." },

  { h: "When to extract one" },
  { p: "You do not need to plan every function in advance. Most appear during the writing, and there are three reliable moments to reach for one." },
  { l: [
   "**The third repetition.** Twice is a coincidence; three times is a pattern. (Some people say the second. Nobody sensible says the first — premature abstraction is its own problem.)",
   "**When you write a comment explaining a block.** `# work out the shipping band` above eight lines is your own brain telling you those eight lines are a unit. Make it `shipping_band(weight, country)` and delete the comment.",
   "**When you need a scratch variable that is only used for three lines.** Local clutter is a sign of a hidden sub-task."
  ] },

  { n: "The opposite mistake is real too. A function called from exactly one place, that needs six arguments, and that you have to jump to in order to understand the caller, has probably made things worse. Abstraction has a cost: indirection. Extract when it buys you a name, reuse, or testability — not because a rule said functions should be short.",
    nt: "You can also over-do it" },

  { h: "Functions are values" },
  { p: "In most modern languages a function is an ordinary value — you can store it in a variable, put it in a list, pass it to another function and return it from one. This unlocks a large amount of what you will meet later, so it is worth seeing once now." },

  { code: { lang: "python", t: "Passing behaviour as an argument",
    lines: [
     { c: "def shout(s): return s.upper()", w: "An ordinary function." },
     { c: "", w: "" },
     { c: "action = shout", w: "No brackets — this stores the *function*, not its result. `action` and `shout` now name the same thing." },
     { c: "action(\"hello\")", w: "\"HELLO\". Calling through the other name works identically." },
     { c: "", w: "" },
     { c: "names.sort(key=len)", w: "You just passed the function `len` to `sort`, which will call it once per item to decide the ordering. **Passing behaviour instead of data** is the idea behind sorting keys, callbacks, event handlers, `map`/`filter` and most of modern JavaScript." },
     { c: "", w: "" },
     { c: "sorted(users, key=lambda u: u.age)", w: "A `lambda` is a function with no name, written inline because it is only needed here. Nearly every language has them: `=>` in JavaScript, C# and Java, `func` literals in Go." }
    ] } },

  { tryit: { t: "Extract a function",
    task: "This snippet appears three times in a program with different variables. Turn it into a function and rewrite one call site.",
    hint: "What goes in? What comes out? Anything that differs between the copies is an argument.",
    sol: { lang: "python", code: "# before, repeated three times\nclean = raw_name.strip().lower()\nclean = clean.replace(\" \", \"-\")\nif len(clean) > 50:\n    clean = clean[:50]\n\n# after\ndef to_slug(text, max_len=50):\n    \"\"\"Lowercase, hyphenate and truncate text for use in a URL.\"\"\"\n    slug = text.strip().lower().replace(\" \", \"-\")\n    return slug[:max_len]\n\n# call site\nslug = to_slug(raw_name)" },
    w: "Notice the by-products: the behaviour now has a name a reader understands instantly, the maximum length became a visible option instead of a magic number, and there is now exactly one place to fix when someone reports that slugs break on accented characters." } },

  { vocab: ["Function", "Abstraction", "DRY", "Lambda Function", "Higher-Order Function"] }
 ],
 k: [
  "Defining a function runs none of it. The brackets are what call it — a missing `()` fails silently.",
  "Functions buy you four things: no repetition, a name that explains, testability, and a lid on complexity so you can stop thinking about it.",
  "One function, one job. If the honest name needs an *and*, split it.",
  "In most languages functions are ordinary values you can pass around — that is the mechanism behind sort keys, callbacks and `map`/`filter`."
 ],
 r: ["Function", "Abstraction", "DRY", "Lambda Function", "Higher-Order Function", "Refactoring"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "def order_total(price, qty):", w: "define a function taking two inputs", hint: "defining runs nothing" },
   { c: "return subtotal + tax", w: "hand a value back to whoever called" },
   { c: "total = order_total(9.99, 3)", w: "call it and keep the answer" },
   { c: "names.sort(key=len)", w: "pass a function as an argument to decide the ordering" },
   { c: "sorted(users, key=lambda u: u.age)", w: "an inline unnamed function, used once" }
  ]
 }
},

{
 t: "Parameters, Arguments and Return Values",
 m: "funcs",
 lvl: "core",
 s: "How a value gets in, how one gets out, and what happens when you mutate what you were handed.",
 goal: [
  "Use the words parameter and argument correctly",
  "Use default and named arguments to make calls readable",
  "Predict whether a function can change its caller's data"
 ],
 b: [
  { p: "A function with no inputs and no outputs can only do one fixed thing. Inputs and outputs are what make it general — and each of them has a couple of details worth getting right early." },

  { h: "Parameter or argument?" },
  { p: "Two words, constantly swapped, and the distinction is genuinely useful once you have it." },

  { syn: { t: "Both words, in one place",
    parts: [
     { p: "def area(" },
     { p: "width, height", w: "**Parameters.** The names in the definition. They are placeholders that exist only inside the function, and they are bound to real values each time it is called." },
     { p: "):" }
    ],
    after: "And at the call site, `area(3, 4)` — the `3` and `4` are the **arguments**: the actual values handed over. Parameters are the slots; arguments are what you put in them. Nobody will correct you if you mix them up, but reading documentation gets easier when you do not." } },

  { h: "Positional and named arguments" },

  { code: { lang: "python", t: "Two ways to hand values over",
    lines: [
     { c: "def send(to, subject, body, urgent=False, retries=3):", w: "Five parameters. The last two have **defaults**, which makes them optional." },
     { c: "    ...", w: "" },
     { c: "", w: "" },
     { c: "send(\"a@b.com\", \"Hi\", \"Text\")", w: "**Positional.** Matched by order. `urgent` and `retries` take their defaults." },
     { c: "", w: "" },
     { c: "send(\"a@b.com\", \"Hi\", \"Text\", True, 5)", w: "Legal and awful. What is `True`? What is `5`? A reader has to open the definition to find out — every time." },
     { c: "", w: "" },
     { c: "send(\"a@b.com\", \"Hi\", \"Text\", urgent=True, retries=5)", w: "**Named.** Now the call site documents itself, the order stops mattering, and inserting a new parameter later cannot silently shift everything along." }
    ],
    after: "Rule of thumb: positional for the one or two obvious arguments, named for anything optional and for every boolean. A bare `True` in a call is almost always worth naming." } },

  { h: "Defaults, and the one that will bite you" },
  { p: "A default value makes a parameter optional. It is evaluated **when the function is defined**, not on each call, and in Python that produces a famous trap." },

  { vs: { lang: "python", t: "The mutable default argument",
    bad: { label: "Looks reasonable. Is not.", c: "def add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\nadd_item(\"apple\")   # ['apple']\nadd_item(\"pear\")    # ['apple', 'pear'] !",
      w: "The empty list was created **once**, when the `def` line ran. Every call that relies on the default shares that same list, and it accumulates forever. It is the aliasing lesson again, in its most surprising costume." },
    good: { label: "The standard fix", c: "def add_item(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket",
      w: "`None` is immutable and safe as a default. A fresh list is built on each call that needs one. Any linter will flag the left-hand version; now you know what it is complaining about." }
  } },

  { h: "Returning: getting a value out" },

  { code: { lang: "python", t: "return ends the function immediately",
    lines: [
     { c: "def classify(n):", w: "" },
     { c: "    if n < 0:", w: "" },
     { c: "        return \"negative\"", w: "Hands the value back **and stops**. Nothing below runs. This is what makes guard clauses work." },
     { c: "    if n == 0:", w: "" },
     { c: "        return \"zero\"", w: "" },
     { c: "    return \"positive\"", w: "" },
     { c: "    print(\"unreachable\")", w: "Dead code. It can never run, and most editors will grey it out for you." }
    ] } },

  { trap: "A function with no `return` still returns something: `None` in Python, `undefined` in JavaScript, nothing usable in Java's `void`. So `result = my_function()` where the function only printed gives you `None` — and the error appears later, in whatever you tried to do with `result`. **Printing is not returning.** Printing sends text to a human; returning sends a value to the rest of your program." },

  { vs: { lang: "python", t: "The distinction that matters most",
    bad: { label: "Prints", c: "def add(a, b):\n    print(a + b)\n\nx = add(2, 3)\nprint(x * 2)",
      w: "The screen shows `5`, then it crashes: `x` is `None` and you cannot multiply `None`. The function's answer went to the terminal, where no other code can reach it." },
    good: { label: "Returns", c: "def add(a, b):\n    return a + b\n\nx = add(2, 3)\nprint(x * 2)",
      w: "The value comes back into the program. Now it can be stored, multiplied, passed on, tested. As a default: **functions return, callers print.** Mixing output into your logic makes it untestable." }
  } },

  { h: "Returning more than one thing" },

  { code: { lang: "python", t: "Several values at once",
    lines: [
     { c: "def stats(numbers):", w: "" },
     { c: "    return min(numbers), max(numbers), sum(numbers) / len(numbers)", w: "Python bundles these into a tuple. Go returns multiple values natively; JavaScript returns an object; Java returns a small record or class." },
     { c: "", w: "" },
     { c: "low, high, avg = stats(scores)", w: "**Unpacking** — spread the returned bundle across three names in one line." },
     { c: "", w: "" },
     { c: "return {\"low\": low, \"high\": high, \"avg\": avg}", w: "For more than three, return a dictionary or an object instead. Callers then say `result[\"avg\"]`, which cannot be got in the wrong order — unlike positional unpacking, where swapping two names is a silent bug." }
    ] } },

  { h: "Can a function change your data?" },
  { p: "This is the question people get wrong, and every language answers it the same way even though the terminology suggests otherwise." },

  { dg: "pass-by-value" },

  { p: "The argument is passed **by value** — but for a list or an object, the value being passed is the reference. So the function gets its own label pointing at your data. It cannot re-point *your* label, but it can absolutely modify the thing you are both pointing at." },

  { code: { lang: "python", t: "The two halves of the answer",
    lines: [
     { c: "def modify(lst, num):", w: "" },
     { c: "    lst.append(99)", w: "**Mutates** the shared list. The caller sees this." },
     { c: "    num = num + 1", w: "**Rebinds** the local name `num`. The caller's variable is untouched — you moved your own label, not theirs." },
     { c: "    lst = [0]", w: "Also just a local rebind. The caller's list is *not* replaced." },
     { c: "", w: "" },
     { c: "my_list = [1, 2]", w: "" },
     { c: "my_num = 5", w: "" },
     { c: "modify(my_list, my_num)", w: "" },
     { c: "print(my_list, my_num)", w: "" }
    ],
    out: "[1, 2, 99] 5",
    ot: "The list changed. The number did not.",
    after: "Same rule in Java, JavaScript, Go, C# — everywhere. Reassigning a parameter is local; mutating what it points at is visible to the caller. The clean habit is not to mutate arguments at all: take input, return output, and leave the caller's data alone." } },

  { h: "Variable numbers of arguments" },
  { p: "You will see these in documentation constantly, so here is what the punctuation means." },

  { code: { lang: "python", t: "The star notation",
    lines: [
     { c: "def total(*numbers):", w: "`*numbers` collects any number of positional arguments into a tuple. `total(1, 2, 3)` and `total(1)` both work." },
     { c: "    return sum(numbers)", w: "" },
     { c: "", w: "" },
     { c: "def config(**options):", w: "`**options` collects any number of *named* arguments into a dictionary. `config(debug=True, port=80)`." },
     { c: "    print(options[\"port\"])", w: "" },
     { c: "", w: "" },
     { c: "# JavaScript: function total(...numbers) { }", w: "The rest parameter. Same idea, one syntax." }
    ],
    after: "Use these sparingly. A function taking anything at all is a function whose signature documents nothing, and your editor can no longer help the caller." } },

  { tryit: { t: "Predict the output",
    task: "What does this print, and which line explains each part?",
    hint: "Separate *mutating the thing* from *moving the label*.",
    sol: { lang: "python", code: "def f(items, count, name=[]):\n    items.append(1)      # mutates -- caller sees it\n    count += 1           # local rebind -- caller does not\n    name.append(\"x\")     # mutates the SHARED default!\n    return count\n\na = []\nb = 10\nprint(f(a, b), a, b)   # 11 [1] 10\nprint(f(a, b), a, b)   # 11 [1, 1] 10\n# and the hidden default list is now ['x', 'x']" },
    w: "Three separate ideas in four lines: mutation is visible to the caller, rebinding is not, and a mutable default is shared across calls forever." } },

  { vocab: ["Parameter", "Argument", "Return Value"] }
 ],
 k: [
  "Parameters are the slots in the definition; arguments are the values at the call site.",
  "Name your optional arguments and every boolean at the call site — a bare `True` explains nothing.",
  "Printing is not returning. A function with no `return` hands back `None`, and the error surfaces somewhere else.",
  "A function cannot re-point your variable, but it *can* modify a list or object you passed it. Prefer not to."
 ],
 r: ["Parameter", "Argument", "Return Value", "Pass by Value vs Reference", "Side Effect"]
},

{
 t: "Scope, Shadowing and the Call Stack",
 m: "funcs",
 lvl: "intermediate",
 s: "Where names live, why the inside can see out but the outside cannot see in, and what a stack trace really is.",
 goal: [
  "Predict whether a name is visible at a given point",
  "Explain what shadowing is and spot it",
  "Read a stack trace as a picture of the call stack"
 ],
 b: [
  { p: "**Scope** is the region of your program in which a name means something. It sounds bureaucratic; it is in fact one of the ideas that makes large programs possible at all — without it, every variable in a hundred-thousand-line codebase would have to have a globally unique name." },

  { dg: "scope-chain" },

  { h: "The rule: inside can see out, outside cannot see in" },

  { code: { lang: "python", t: "Names created inside a function stay there",
    lines: [
     { c: "TAX_RATE = 0.2", w: "**Global** — declared at the top level of the file, visible everywhere below." },
     { c: "", w: "" },
     { c: "def checkout(price):", w: "" },
     { c: "    subtotal = price * 1.0", w: "**Local.** This name comes into existence when the call starts and is destroyed when it ends." },
     { c: "    return subtotal * (1 + TAX_RATE)", w: "`TAX_RATE` is not local, so the machine looks outwards and finds it in the global scope. This is the *only* direction lookup travels." },
     { c: "", w: "" },
     { c: "checkout(100)", w: "" },
     { c: "print(subtotal)", w: "**NameError: name 'subtotal' is not defined.** The name did not survive the call. It was never *in* your program's outer scope at all." }
    ] } },

  { p: "That error is not the language being awkward. It is the guarantee that makes functions safe: a function cannot leak names into your program, and you cannot accidentally depend on its internals. Every function is a sealed room with a window facing outwards." },

  { h: "Shadowing: same name, different scope" },
  { p: "If a local name matches an outer one, the local one wins inside that scope. The outer one is not overwritten — it is temporarily hidden." },

  { code: { lang: "python", t: "Two `total`s that never meet",
    lines: [
     { c: "total = 100", w: "The global `total`." },
     { c: "", w: "" },
     { c: "def spend():", w: "" },
     { c: "    total = 5", w: "A **new, local** `total`. It shadows the global for the rest of this function. The global is untouched." },
     { c: "    print(total)", w: "5 — the local one." },
     { c: "", w: "" },
     { c: "spend()", w: "" },
     { c: "print(total)", w: "100 — the global was never modified." }
    ],
    after: "Shadowing is usually harmless and occasionally a genuine trap: you *meant* to update the outer value and quietly created a new one instead. If a variable stubbornly refuses to change, check whether you have two of them." } },

  { p: "Modifying a global from inside a function requires you to say so explicitly — `global total` in Python, and in most other languages you simply assign to it directly (which is why they are more dangerous). Either way:" },

  { trap: "Do not use global variables to pass data between functions. It works for twenty lines and becomes untraceable at two hundred: any function can change the value, so when it is wrong you have to read the *whole program* to find out who did it. Pass values in as arguments and hand results back as returns. That way the data flow is visible in the code rather than implied by it." },

  { h: "The call stack" },
  { p: "When a function calls another function, the first one is not finished — it is paused, waiting. The machine needs to remember where to come back to, and what all the paused function's local variables were. It does that with a **stack**." },

  { dg: "call-stack" },

  { ol: [
   "Calling a function **pushes a frame** onto the stack: its arguments, its local variables, and the line to return to.",
   "That frame sits on top. Its locals are the ones currently in scope.",
   "When the function returns, its frame is **popped** and thrown away — which is exactly why local variables vanish.",
   "Execution resumes in the frame beneath, at the remembered line."
  ] },

  { code: { lang: "python", t: "Four frames deep",
    lines: [
     { c: "def price(item):", w: "" },
     { c: "    return item[\"cost\"] * 1.2", w: "The deepest frame. When this returns, its frame disappears." },
     { c: "", w: "" },
     { c: "def total(items):", w: "" },
     { c: "    return sum(price(i) for i in items)", w: "`total`'s frame stays on the stack the whole time `price` is running — paused, holding its own locals, waiting." },
     { c: "", w: "" },
     { c: "def checkout(cart):", w: "" },
     { c: "    return total(cart[\"items\"])", w: "" },
     { c: "", w: "" },
     { c: "checkout(my_cart)", w: "At the deepest moment there are four frames stacked: `checkout`, `total`, `price`, and the top-level module. Every one of them is mid-line." }
    ] } },

  { h: "Which is why a stack trace is readable" },
  { p: "When something fails, the machine prints the stack as it was at that instant. It is not noise — it is the exact path of calls that led to the failure, in order." },

  { out: "Traceback (most recent call last):\n  File \"shop.py\", line 20, in <module>\n    checkout(my_cart)\n  File \"shop.py\", line 15, in checkout\n    return total(cart[\"items\"])\n  File \"shop.py\", line 11, in total\n    return sum(price(i) for i in items)\n  File \"shop.py\", line 7, in price\n    return item[\"cost\"] * 1.2\nTypeError: unsupported operand type(s) for *: 'NoneType' and 'float'",
    ot: "A stack trace, top to bottom" },

  { l: [
   "**Read the last line first.** That is the actual error and it names the actual problem: something was `None` when a number was expected.",
   "**Then read upwards from the bottom.** The frame just above the error is where it broke: line 7, in `price`.",
   "**The frames above that are the route.** They tell you how you arrived, which is how you work out *why* `item[\"cost\"]` was `None`.",
   "**Your own files matter most.** In a real trace half the frames are inside libraries. Scan for filenames you wrote — that is almost always where the fix goes."
  ] },

  { n: "The phrase *stack overflow* — and the website — comes from this. The stack has a fixed size, a few thousand frames. A function that calls itself with no way to stop pushes frames until the space runs out, and the program dies with `StackOverflowError` or `RecursionError`. It is the recursive equivalent of an infinite loop.",
    nt: "Where the name comes from" },

  { h: "Closures: the scope that outlived its frame" },
  { p: "One consequence worth meeting once, because it appears constantly in JavaScript and increasingly everywhere. A function defined inside another function keeps access to the outer function's variables — even after that outer function has returned and its frame is long gone." },

  { code: { lang: "python", t: "A closure",
    lines: [
     { c: "def make_counter():", w: "" },
     { c: "    count = 0", w: "A local variable of `make_counter`." },
     { c: "    def increment():", w: "An inner function that refers to `count`." },
     { c: "        nonlocal count", w: "*I mean the enclosing one, not a new local.* (JavaScript needs no such keyword.)" },
     { c: "        count += 1", w: "" },
     { c: "        return count", w: "" },
     { c: "    return increment", w: "Return the inner function itself. `make_counter` now finishes — and its frame would normally vanish." },
     { c: "", w: "" },
     { c: "c = make_counter()", w: "" },
     { c: "c()", w: "1" },
     { c: "c()", w: "2 — `count` is still alive, still private, reachable only through this function. Nothing else in the program can touch it." }
    ],
    after: "This is a **closure**: a function plus the environment it was defined in, kept alive together. It is how JavaScript did private state for two decades, and it is the machinery behind callbacks, decorators and most event handling. You do not need to write one yet — you need to recognise the shape when you read one." } },

  { tryit: { t: "What does it print?",
    task: "Three scopes, one name. Work out each print.",
    hint: "Assignment inside a function creates a local unless told otherwise.",
    sol: { lang: "python", code: "x = \"global\"\n\ndef outer():\n    x = \"outer\"\n    def inner():\n        x = \"inner\"\n        print(x)      # inner\n    inner()\n    print(x)          # outer -- inner's x was separate\n\nouter()\nprint(x)              # global -- never touched by anything" },
    w: "Three distinct variables that happen to share a name. Each assignment created a new local in its own scope rather than modifying the one outside — which is the default in every language and the thing to check when a value refuses to update." } },

  { vocab: ["Scope", "Closure"] }
 ],
 k: [
  "Inner scopes can see outward; outer scopes can never see in. Local names are destroyed when the call ends.",
  "Assigning to a name inside a function creates a *new local* by default — that is shadowing, and it is why your variable did not update.",
  "Each call pushes a frame with its own locals; returning pops it. That is literally what a stack trace prints.",
  "Read a stack trace last line first (the error), then the frame above it (where), then upwards (how you got there)."
 ],
 r: ["Scope", "Closure", "Recursion"]
},

{
 t: "Pure Functions, Side Effects and Recursion",
 m: "funcs",
 lvl: "intermediate",
 s: "The property that makes a function trustworthy, and the technique of a function calling itself.",
 goal: [
  "Say whether a function is pure and why that matters",
  "Isolate side effects at the edges of a program",
  "Write a recursive function with a base case that actually terminates"
 ],
 b: [
  { p: "Two ideas that look unrelated and are deeply connected: what makes a function easy to reason about, and how a function can call itself without the universe collapsing." },

  { h: "Pure functions" },
  { p: "A function is **pure** when it satisfies two conditions:" },
  { ol: [
   "**Same input, same output. Always.** It depends on nothing but its arguments — no clock, no random number, no global, no database, no file.",
   "**It changes nothing outside itself.** No printing, no writing, no mutating its arguments, no touching globals."
  ] },

  { vs: { lang: "python", t: "The same calculation, pure and impure",
    bad: { label: "Impure", c: "discount = 0\n\ndef apply(price):\n    global discount\n    discount = price * 0.1\n    print(f\"Discount: {discount}\")\n    return price - discount",
      w: "Reads a global, writes a global, prints. Call it twice and the second call sees a world the first one changed. To test it you must set up a global, capture stdout, and reset between tests." },
    good: { label: "Pure", c: "def apply(price, rate=0.1):\n    return price - price * rate",
      w: "Depends only on its arguments. Changes nothing. `apply(100)` is `90` today, tomorrow, in a test, on another machine, called from ten threads at once." }
  } },

  { p: "Why care? Because a pure function is one you can stop thinking about." },
  { l: [
   "**Testable with no setup.** Call it, compare the result. No database, no mocks, no fixtures.",
   "**Debuggable in isolation.** If the output is wrong, the bug is inside those lines. It cannot be somewhere else.",
   "**Safe to reorder, cache or parallelise.** Nothing depends on when it ran or what else was running.",
   "**Readable.** The signature tells you everything it can possibly do. There is no *and also*."
  ] },

  { h: "But side effects are the point of programs" },
  { p: "A program of only pure functions computes something and tells nobody. Every useful program must print, save, send and read — those are **side effects**, and you cannot and should not avoid them." },
  { p: "The goal is not purity. It is **keeping the effects at the edges** so the core logic stays pure and testable." },

  { code: { lang: "python", t: "The shape professionals aim for",
    lines: [
     { c: "def load_orders(path):", w: "**Edge — impure.** Reads a file. Thin, dumb, does no thinking." },
     { c: "    return json.load(open(path))", w: "" },
     { c: "", w: "" },
     { c: "def top_customers(orders, n=3):", w: "**Core — pure.** All the actual logic lives here: filtering, grouping, ranking. Takes data, returns data." },
     { c: "    totals = {}", w: "" },
     { c: "    for o in orders:", w: "" },
     { c: "        totals[o[\"cust\"]] = totals.get(o[\"cust\"], 0) + o[\"amount\"]", w: "" },
     { c: "    return sorted(totals.items(), key=lambda kv: -kv[1])[:n]", w: "Every business rule is in this function, and it can be tested with a hand-written list in three lines." },
     { c: "", w: "" },
     { c: "def report(rows):", w: "**Edge — impure.** Prints. Also thin and dumb." },
     { c: "    for name, amount in rows:", w: "" },
     { c: "        print(f\"{name}: {amount}\")", w: "" },
     { c: "", w: "" },
     { c: "report(top_customers(load_orders(\"orders.json\")))", w: "Impure in, pure in the middle, impure out. This shape has a dozen names — *functional core, imperative shell* is the clearest — and it is what separates code you can test from code you cannot." }
    ] } },

  { h: "Recursion" },
  { p: "A **recursive** function is one that calls itself. It sounds like a paradox and is simply another way of saying *the answer to a big problem is the answer to a smaller one, plus a little work*." },

  { dg: "recursion" },

  { p: "Every recursive function needs exactly two things, and missing either one is fatal:" },
  { ol: [
   "**A base case** — an input small enough to answer directly, with no further call. This is the floor.",
   "**A recursive case** that moves *towards* the base case. Not sideways. Not away."
  ] },

  { code: { lang: "python", t: "Factorial, the traditional example",
    lines: [
     { c: "def factorial(n):", w: "" },
     { c: "    if n <= 1:", w: "**The base case.** Without it, this runs until the stack overflows. It is the first line you should write and the first thing to check when recursion misbehaves." },
     { c: "        return 1", w: "" },
     { c: "    return n * factorial(n - 1)", w: "**The recursive case.** `n - 1` is strictly closer to the base case, which is what guarantees termination." }
    ],
    out: "factorial(4)\n= 4 * factorial(3)\n= 4 * 3 * factorial(2)\n= 4 * 3 * 2 * factorial(1)\n= 4 * 3 * 2 * 1\n= 24",
    ot: "Four frames on the stack, then they unwind",
    after: "Notice that the multiplications only happen on the way *back down*. Each frame is paused, holding its own `n`, waiting for the frame above it to finish." } },

  { h: "When recursion is actually the right tool" },
  { p: "For counting down to one, a loop is simpler and faster — the factorial example is a teaching device, not advice. Recursion earns its place when the *data itself* is nested, because then the code's shape matches the data's shape." },

  { code: { lang: "python", t: "Where a loop would be painful",
    lines: [
     { c: "def total_size(folder):", w: "A folder contains files and folders. Those folders contain files and folders. There is no fixed depth — so there is no fixed number of loops you could write." },
     { c: "    total = 0", w: "" },
     { c: "    for item in folder.contents:", w: "" },
     { c: "        if item.is_file:", w: "**Base case:** a file has a size and no children. Stop." },
     { c: "            total += item.size", w: "" },
     { c: "        else:", w: "" },
     { c: "            total += total_size(item)", w: "**Recursive case:** a folder is the same problem, smaller. Six lines handle any depth of nesting." },
     { c: "    return total", w: "" }
    ],
    after: "The same shape solves: walking a file tree, parsing JSON, traversing the HTML DOM, searching a tree, evaluating nested expressions, and every algorithm on a graph. When the data branches, recursion is not clever — it is the obvious reading." } },

  { trap: "Recursion costs stack space — one frame per level, and the stack holds only a few thousand. Python's default limit is about 1,000 and it raises `RecursionError`; other languages crash with a stack overflow. So: use recursion for *nested* data, where depth is small (a folder tree is rarely 50 deep). Use a loop for *sequential* data, where the count is large. Recursing over a million-item list will not work." },

  { n: "You will hear about *tail-call optimisation* — a compiler trick that turns certain recursive calls back into loops so they use no extra stack. Scheme, Haskell, Scala and (in some cases) JavaScript engines do it. Python and Java deliberately do not, because it makes stack traces unreadable. Worth knowing the term; not worth relying on.",
    nt: "Tail calls" },

  { tryit: { t: "Write a recursive function",
    task: "Count how many items are in a nested list, at any depth. `[1, [2, [3, 4]], 5]` should give 5.",
    hint: "Base case: the item is not a list, so it counts as one. Recursive case: it is a list, so ask the same question about it.",
    sol: { lang: "python", code: "def deep_count(x):\n    if not isinstance(x, list):\n        return 1                       # base case\n    return sum(deep_count(i) for i in x)  # recursive case\n\ndeep_count([1, [2, [3, 4]], 5])   # 5\ndeep_count([])                    # 0 -- sum of nothing\ndeep_count([[[[1]]]])             # 1 -- four levels, one item" },
    w: "Six words of logic handle unlimited nesting. Try writing that with loops and you will need a stack of your own — which is exactly what recursion was quietly giving you for free." } },

  { vocab: ["Pure Function", "Side Effect", "Recursion"] }
 ],
 k: [
  "A pure function depends only on its arguments and changes nothing else. It can be tested, cached, reordered and parallelised without thought.",
  "You cannot avoid side effects — push them to the edges and keep the logic in the middle pure.",
  "Every recursive function needs a base case and a recursive case that moves towards it. Missing the base case is a stack overflow.",
  "Use recursion for nested data of small depth, loops for long sequences. The stack is only a few thousand frames deep."
 ],
 r: ["Pure Function", "Side Effect", "Recursion", "Functional Programming"]
}

]);
