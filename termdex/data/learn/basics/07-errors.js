/* Programming Basics — errors, exceptions and debugging. */
TD.addLessons("basics", [

{
 t: "The Three Kinds of Error",
 m: "errors",
 lvl: "core",
 s: "Syntax, runtime and logic — three different failures, three different costs, three different cures.",
 goal: [
  "Classify any failure into one of three kinds",
  "Say which kind the machine can find for you and which it cannot",
  "Stop reading errors as criticism"
 ],
 b: [
  { p: "Your code will be wrong. Not occasionally — constantly, all day, for your entire career. Professional programming is not the absence of mistakes; it is a fast, unemotional loop of making them and finding them. The people who look effortless are simply running that loop in seconds rather than hours." },
  { p: "The first step is knowing which of three kinds of wrong you are looking at, because they fail at different moments and need completely different responses." },

  { dg: "error-kinds" },

  { h: "1 · Syntax errors — you broke the grammar" },
  { p: "Caught before a single line runs, because the parser could not read the file at all. Missing bracket, missing quote, missing colon, stray character." },

  { out: "  File \"shop.py\", line 12\n    print(\"total: \" + total\n                          ^\nSyntaxError: '(' was never closed", ot: "A syntax error" },

  { l: [
   "**Cost: minutes at most.** It tells you the file and roughly the line.",
   "**Your response:** look at the reported line, then the line above it. Check brackets and quotes for balance.",
   "**They stop happening.** Within a few weeks these are rare, and your editor catches nearly all of them as you type."
  ] },

  { h: "2 · Runtime errors — a legal line that cannot be done" },
  { p: "The grammar was fine, so the program started. Then it reached an instruction that was impossible with the values it actually had, and it stopped." },

  { out: "Traceback (most recent call last):\n  File \"shop.py\", line 12, in total\n    return sum(prices) / len(prices)\nZeroDivisionError: division by zero", ot: "A runtime error" },

  { tbl: { t: "The runtime errors you will meet in your first month",
    h: ["Error", "Means", "Usual cause"],
    rows: [
     ["`NameError` / `ReferenceError`", "That name does not exist here", "Typo, or a variable defined in a different scope"],
     ["`TypeError`", "Wrong kind of thing for this operation", "Text where a number was expected — often from user input or JSON"],
     ["`ValueError`", "Right type, impossible value", "`int(\"abc\")`"],
     ["`IndexError`", "No such position", "Off-by-one, or an empty list you assumed had items"],
     ["`KeyError`", "No such key", "A typo in the key, or optional data that was absent this time"],
     ["`AttributeError` / `undefined is not a function`", "That thing has no such member", "Usually the value is `None`/`null` when you thought it was an object"],
     ["`ZeroDivisionError`", "Divided by zero", "An empty collection reaching an average"],
     ["`FileNotFoundError`", "No file there", "A relative path and the wrong working directory — nine times out of ten"]
    ] } },

  { l: [
   "**Cost: minutes to hours.** It tells you where it stopped, which is not always where the mistake was made.",
   "**Your response:** read the last line for *what*, the frame above it for *where*, then work backwards to find how the bad value got there.",
   "**The important question is rarely *why did this line fail*.** It is *why was this value `None` by the time it arrived here*."
  ] },

  { h: "3 · Logic errors — it ran perfectly and it is wrong" },
  { p: "No error. No warning. No red text at all. The program completed, produced a plausible answer, and the answer is wrong." },

  { code: { lang: "python", t: "Four lines with nothing to report",
    lines: [
     { c: "def average(numbers):", w: "" },
     { c: "    total = 0", w: "" },
     { c: "    for n in numbers:", w: "" },
     { c: "        total += n", w: "" },
     { c: "    return total / (len(numbers) + 1)", w: "The `+ 1` is wrong. Every average this function ever returns is slightly too low, forever, and it will run for years without complaint. For 100 items the error is one per cent — small enough to look like rounding." }
    ] } },

  { l: [
   "**Cost: hours, days, or the entire life of the system.** Nothing tells you it is happening.",
   "**Your response:** tests. This is the reason automated tests exist, and it is the only reliable defence.",
   "**They are found by people, not machines** — usually a user, usually after a long time, usually by noticing that a number looks slightly odd."
  ] },

  { ana: "A syntax error is a sentence with no verb — instantly obvious. A runtime error is *divide by zero* — a grammatical sentence describing something impossible. A logic error is a perfectly clear, perfectly executable instruction to walk off a cliff. Only the third one requires someone to know where they were meant to be going.",
    at: "Three ways to be wrong" },

  { h: "How to actually read an error message" },
  { p: "Beginners see a wall of red and scroll past it, or paste it into a search engine before reading it. The message almost always contains the answer, and it has a fixed structure." },

  { code: { lang: "text", t: "Every error message has four parts",
    lines: [
     { c: "TypeError: unsupported operand type(s) for +: 'int' and 'str'", w: "" },
     { c: "^^^^^^^^^", w: "**The kind.** Tells you the category: a type mismatch, not a missing name or a bad value." },
     { c: "           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^", w: "**The description.** Something was added that could not be added." },
     { c: "                                       ^^^^^^^^^^^^^^^^", w: "**The specifics.** A number and a string. That is your bug: something you believed was a number arrived as text." },
     { c: "", w: "" },
     { c: "  File \"shop.py\", line 12, in total", w: "**The location**, in the frames above the message. File, line, and which function." }
    ],
    after: "Kind, description, specifics, location. Read all four before doing anything else. In this case you would not even need the line number to know what to look for: something is not being converted from text." } },

  { trap: "The single most misread error: `AttributeError: 'NoneType' object has no attribute 'name'` (or, in JavaScript, `Cannot read property 'name' of undefined`). People stare at `.name` and check it exists. **The bug is not `.name` at all** — the bug is that the thing before the dot is `None`, and the real question is which earlier line returned nothing. Almost always: a lookup that found no match, or a function that forgot to `return`." },

  { h: "Errors are information, not judgement" },
  { p: "This sounds soft and it is worth saying plainly, because the emotional reaction to red text is the thing that most slows beginners down. An error is a very fast, very literal reader telling you precisely which instruction it could not carry out and why. It is the most helpful thing in the entire system." },
  { p: "The alternative — a language that silently guesses what you meant and carries on — is strictly worse, and you can watch that play out in the languages that do it. **A loud failure is a gift.** The failure you should fear is the one that stays quiet." },

  { tryit: { t: "Classify each failure",
    task: "Syntax, runtime, or logic?",
    hint: "Ask: did it fail before running, during, or not at all?",
    sol: { lang: "text", code: "1. Missing closing bracket             -> SYNTAX  (nothing ran)\n2. Averaging an empty list            -> RUNTIME (division by zero)\n3. Using > where you meant >=         -> LOGIC   (silently off by one)\n4. Misspelled variable name           -> RUNTIME (NameError, when reached)\n5. Tax at 0.15 when it should be 0.18 -> LOGIC   (perfectly valid, wrong)\n6. Reading a file that is not there   -> RUNTIME\n7. Summing instead of averaging       -> LOGIC" },
    w: "Number 4 is worth a second look. A misspelled name is a *runtime* error in Python and JavaScript — found only when that line executes, possibly never during testing. In a compiled language it is caught before the program runs at all. That is the static/dynamic trade-off, made concrete." } },

  { vocab: ["Syntax Error", "Runtime Error", "Exception", "Debugging"] }
 ],
 k: [
  "Three kinds of wrong: syntax (nothing runs), runtime (stops partway), logic (finishes and lies).",
  "Only the first two announce themselves. Logic errors are found by tests and by people, which is what tests are for.",
  "Every error message has four parts — kind, description, specifics, location. Read all four before searching.",
  "`NoneType has no attribute X` is never about X. It is about which earlier line returned nothing."
 ],
 r: ["Syntax Error", "Runtime Error", "Exception", "Debugging", "Stack Trace"]
},

{
 t: "Exceptions: Handling What Goes Wrong",
 m: "errors",
 lvl: "core",
 s: "try, catch, finally — and the far harder question of what to do once you have caught something.",
 goal: [
  "Write a try/except that catches only what it should",
  "Say why catching everything is worse than crashing",
  "Choose between handling, retrying, defaulting and re-raising"
 ],
 b: [
  { p: "Some failures are not bugs. The network *will* time out. The file *will* be missing. The user *will* type `abc` into the age box. These are not mistakes in your code — they are ordinary conditions of a program that touches the real world, and a program that crashes on each of them is not finished." },
  { p: "**Exceptions** are the mechanism for dealing with them. The vocabulary is nearly universal: something *throws* or *raises* an exception, and code up the stack *catches* it." },

  { h: "The shape" },

  { code: { lang: "python", t: "try / except / else / finally",
    lines: [
     { c: "try:", w: "*Attempt this. If it throws, jump to a matching handler instead of crashing.*" },
     { c: "    with open(path) as f:", w: "" },
     { c: "        config = json.load(f)", w: "Either of these lines can throw, for different reasons." },
     { c: "except FileNotFoundError:", w: "Catch **one specific kind**. Anything else still propagates — which is exactly right, because you only planned for this one." },
     { c: "    config = DEFAULTS", w: "A sensible recovery: no config file means use the defaults." },
     { c: "except json.JSONDecodeError as e:", w: "A different failure needing a different response. `as e` binds the exception object so you can inspect or log it." },
     { c: "    raise ConfigError(f\"{path} is not valid JSON\") from e", w: "Here recovery is not possible — a corrupt config file is not something to paper over. Re-raise with a better message and keep the original cause attached." },
     { c: "else:", w: "Runs only if **nothing** threw. Optional, and useful for keeping the risky line and the follow-up work separate." },
     { c: "    log.info(\"config loaded\")", w: "" },
     { c: "finally:", w: "Runs **no matter what** — success, handled failure, unhandled failure on its way out. This is where cleanup goes." },
     { c: "    log.info(\"config step done\")", w: "" }
    ],
    after: "Java, C#, JavaScript and C++ use `try / catch / finally` with the same semantics. Go took a different route entirely — errors are ordinary return values you must check — and Rust uses a `Result` type you cannot ignore. Same problem, three philosophies." } },

  { h: "The rule: catch narrow, catch late" },

  { vs: { lang: "python", t: "The most damaging pattern in programming",
    bad: { label: "Never do this", c: "try:\n    result = process(data)\nexcept:\n    pass",
      w: "This catches **everything** — typos, missing keys, division by zero, a bug you introduced this morning, and interrupts. Then it discards all of it silently. The program carries on with `result` undefined, fails somewhere else entirely, and you now have a bug with no trace and no message. This construct has cost the industry more debugging hours than any other four lines." },
    good: { label: "Say what you expected", c: "try:\n    result = process(data)\nexcept ValueError as e:\n    log.warning(\"bad row skipped: %s\", e)\n    result = None",
      w: "One anticipated failure, handled deliberately, recorded so someone can see how often it happens. Every other failure still crashes loudly — which is what you want, because every other failure is a bug you have not found yet." }
  } },

  { p: "The principle stated once: **only catch an exception if you can do something useful about it.** If you cannot, let it travel up. A crash with a full stack trace is far more valuable than a program that limps on producing wrong output." },

  { l: [
   "**Handle** — a real recovery exists. Missing file, use the defaults.",
   "**Retry** — it might work next time. Network calls, with a delay and a maximum number of attempts.",
   "**Default** — a sensible fallback value, when absence is genuinely normal.",
   "**Enrich and re-raise** — add context (*which* row, *which* file) and let it continue upward.",
   "**Let it go** — most of the time. Nothing to add? Do not touch it."
  ] },

  { h: "Cleanup and the `with` block" },
  { p: "`finally` exists because something must always happen: closing a file, releasing a lock, closing a connection. Forget it and you leak resources — a program that eventually cannot open any more files." },

  { code: { lang: "python", t: "The verbose way and the good way",
    lines: [
     { c: "f = open(\"data.txt\")", w: "" },
     { c: "try:", w: "" },
     { c: "    process(f.read())", w: "" },
     { c: "finally:", w: "" },
     { c: "    f.close()", w: "Correct — closes on success and on failure. But it is four lines of ceremony and easy to forget." },
     { c: "", w: "" },
     { c: "with open(\"data.txt\") as f:", w: "The **context manager**. Closing is guaranteed when the block ends, however it ends. Java has try-with-resources, C# has `using`, Go has `defer`, Rust drops automatically." },
     { c: "    process(f.read())", w: "Always use this form for files, connections and locks. It is not sugar; it is the version you cannot get wrong." }
    ] } },

  { h: "Raising your own" },
  { p: "Raising deliberately is how a function refuses to continue with input that makes no sense. Failing loudly at the moment of the bad input is enormously better than continuing and failing later somewhere unrelated." },

  { code: { lang: "python", t: "Fail early, fail specifically",
    lines: [
     { c: "def withdraw(account, amount):", w: "" },
     { c: "    if amount <= 0:", w: "" },
     { c: "        raise ValueError(\"amount must be positive\")", w: "The caller is wrong and there is nothing sensible to do. Say so immediately, at the boundary, where the stack trace still points at the caller's mistake." },
     { c: "    if amount > account.balance:", w: "" },
     { c: "        raise InsufficientFunds(account.id, amount)", w: "A **custom exception**. Callers can catch this one specifically without also catching every `ValueError` in the program — and the name documents the failure better than any message string." },
     { c: "    account.balance -= amount", w: "By this line, everything that could be wrong has been ruled out. Same shape as guard clauses." }
    ] } },

  { trap: "Do not use exceptions for ordinary control flow. Raising `NotFound` and catching it as a way of writing an `if` is slow, surprising to read, and hides real errors among the fake ones. Exceptions are for the *exceptional*. If it happens on a normal path, it is a return value — `None`, an empty list, a boolean." },

  { n: "Go's designers rejected exceptions on exactly this reasoning: an exception is an invisible second exit from every function, and you cannot tell by looking at a call site whether it might jump somewhere else. So Go returns errors as ordinary values and forces you to write `if err != nil`. It is famously verbose, and the trade is that error handling is impossible to overlook. Rust's `Result` makes the same trade with better ergonomics.",
    nt: "The languages that said no" },

  { tryit: { t: "Fix the handler",
    task: "This is production code from a real system, lightly disguised. Name three things wrong with it.",
    hint: "What does it catch? What does it record? What does the caller learn?",
    sol: { lang: "python", code: "# before\ntry:\n    user = db.get_user(user_id)\n    send_email(user.email, template)\nexcept:\n    pass\n\n# 1. bare except catches EVERYTHING, including typos and\n#    KeyboardInterrupt\n# 2. `pass` records nothing -- silent failures forever,\n#    no way to know it is even happening\n# 3. two unrelated operations in one try -- you cannot tell\n#    whether the lookup or the send failed\n\n# after\ntry:\n    user = db.get_user(user_id)\nexcept UserNotFound:\n    log.warning(\"skipping email: no user %s\", user_id)\n    return\n\ntry:\n    send_email(user.email, template)\nexcept SMTPError as e:\n    log.error(\"email failed for %s: %s\", user_id, e)\n    queue_retry(user_id, template)" },
    w: "The rewrite is longer and it is the difference between a system you can operate and one that fails invisibly. Note that a genuine bug — say `user.emial` — now crashes loudly in both versions of the second block, which is what you want." } },

  { vocab: ["Exception", "Error Handling", "Try-Catch"] }
 ],
 k: [
  "Exceptions are for conditions of the real world — missing files, failed networks, bad input — not for your own bugs.",
  "Catch specific exception types. A bare `except: pass` swallows your own bugs and is the most damaging pattern in programming.",
  "Only catch what you can act on: handle, retry, default, or enrich and re-raise. Otherwise let it crash loudly.",
  "Use `with` / `using` / `defer` for cleanup rather than hand-written `finally` blocks."
 ],
 r: ["Exception", "Error Handling", "Graceful Degradation", "Logging"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "except FileNotFoundError:", w: "catch one specific anticipated failure", hint: "never a bare except" },
   { c: "raise ValueError(\"amount must be positive\")", w: "refuse bad input at the boundary" },
   { c: "with open(path) as f:", w: "guaranteed cleanup, however the block ends" },
   { c: "except SMTPError as e:", w: "bind the exception so you can log the detail" },
   { c: "raise ConfigError(msg) from e", w: "re-raise with better context, keeping the original cause" }
  ]
 }
},

{
 t: "How to Debug Anything",
 m: "errors",
 lvl: "core",
 s: "A repeatable method that works on code you have never seen, in a language you barely know.",
 goal: [
  "Follow a five-step loop instead of staring at the screen",
  "Bisect a problem instead of guessing at it",
  "Know when to use a print, when a debugger, and when to walk away"
 ],
 b: [
  { p: "Debugging is the skill that separates people who make progress from people who get stuck, and it is almost never taught — the assumption is that you will absorb it. You will, eventually, over years. Here it is directly, so that it takes weeks." },
  { p: "The central idea: **debugging is not thinking hard about code. It is narrowing down where reality diverges from your belief.** You have a mental model of what the program does. The program is doing something else. The bug is at the exact point where those two stories part company, and your job is to find that point by halving the search space, not by inspiration." },

  { dg: "debug-loop" },

  { h: "1 · Reproduce it" },
  { p: "Before anything else, make it fail on demand. A bug you cannot trigger reliably is a bug you cannot verify you have fixed — you will *believe* you fixed it, and it will come back." },
  { l: [
   "What exact input causes it? Save that input in a file.",
   "Does it happen every time, or one time in ten? Intermittent means timing, ordering, randomness, network, or shared state.",
   "Does it happen on someone else's machine? If not, the difference *is* the bug: a version, an environment variable, a file that exists locally.",
   "Reduce it. Cut the input down until it is as small as possible and still fails. This alone often reveals the cause."
  ] },

  { h: "2 · Locate it by halving" },
  { p: "Do not read the code from the top hoping to spot it. **Bisect.** You know it is right at the start and wrong at the end. Check the middle, and you have eliminated half the program with one measurement." },

  { code: { lang: "python", t: "Bisecting with prints",
    lines: [
     { c: "rows = load(path)", w: "" },
     { c: "print(\"A:\", len(rows), rows[:2])", w: "**Halfway.** Is the data right *here*? If yes, the bug is below. If no, above. One print eliminates half the program." },
     { c: "cleaned = clean(rows)", w: "" },
     { c: "print(\"B:\", len(cleaned))", w: "Suppose A was right and B lost 400 rows. The bug is now inside `clean`, and you have gone from 300 lines to 20 in two prints." },
     { c: "totals = summarise(cleaned)", w: "" },
     { c: "print(\"C:\", totals)", w: "" },
     { c: "write(totals, out)", w: "" }
    ],
    after: "Then repeat *inside* `clean`. Each round halves the space, so even a ten-thousand-line program is about fourteen measurements away. This is why bisection beats reading: reading is linear, bisection is logarithmic." } },

  { n: "The same principle applies to your project's history. `git bisect` will binary-search your commits to find the exact one that introduced a bug, in a handful of steps even across a thousand commits. Same idea, different axis — and it is why small, frequent commits pay for themselves.",
    nt: "Bisecting time as well as code" },

  { h: "3 · Form one testable guess" },
  { p: "Now — and only now — think. State a hypothesis as a single sentence with a checkable claim." },
  { l: [
   "Weak: *something is wrong with the dates.*",
   "Strong: *rows where the date field is empty are being dropped by the filter on line 40.*",
   "The strong one tells you exactly what to print next. The weak one tells you nothing."
  ] },

  { h: "4 · Check the guess" },
  { p: "Print it, run it, look. Two tools do this job." },

  { tbl: { t: "Print or debugger?",
    h: ["", "print / console.log", "Debugger"],
    rows: [
     ["Setup", "None", "A little, once per project"],
     ["Best for", "Loops, many values over time, remote or production systems", "One complex moment you need to inspect deeply"],
     ["What you see", "Only what you thought to print", "**Every** variable in scope, and the whole call stack"],
     ["Stepping", "No — re-run to change anything", "Yes — line by line, in and out of functions"],
     ["Honest verdict", "What most professionals actually use, most of the time", "Underused. Worth an hour to learn properly."]
    ] } },

  { p: "Nobody should be embarrassed about print debugging; it is used at every level of the industry. But a debugger genuinely is better for one class of problem — *the state at this moment is complicated and I do not know what to ask* — because it shows you everything at once rather than only what you predicted you would need." },

  { code: { lang: "python", t: "Prints that are actually useful",
    lines: [
     { c: "print(total)", w: "Almost useless in a loop. Twenty numbers scroll past with no context." },
     { c: "print(f\"[clean] row={i} id={row['id']} total={total!r}\")", w: "**Label it** so you know which print fired, **include the identifying values** so you can find the row, and use `!r` (or `JSON.stringify`) so `\"5\"` and `5` and `None` look different on screen." },
     { c: "", w: "" },
     { c: "print(f\"type={type(x)} value={x!r}\")", w: "For a `TypeError`, printing the *type* is usually the entire diagnosis." },
     { c: "", w: "" },
     { c: "breakpoint()", w: "Python's built-in: execution stops here and drops you into an interactive prompt with every local variable available. `debugger;` in JavaScript. This one word is often faster than five prints." }
    ] } },

  { h: "5 · Change one thing" },
  { p: "Make a single change and re-test. If you change three things and it works, you do not know which one mattered, and two of them may have introduced new bugs you will meet next week." },
  { p: "If the guess was wrong, that is not a failure — you have eliminated a possibility. Go back to step three with one fewer suspect." },

  { h: "When you are properly stuck" },
  { p: "Everyone gets stuck. These work, in roughly this order:" },
  { ol: [
   "**Explain it out loud, in full sentences, to something.** A colleague, a rubber duck, a text file. This is not a joke — articulating forces you to state assumptions, and you will frequently catch yourself mid-sentence saying something that is obviously not true.",
   "**Question the assumption you have not questioned.** Is the file the one you think? Is the code running at all — put a print on line one. Is it the version you just saved? Is there a cached build?",
   "**Read the error message again, slowly, all of it.** You almost certainly skimmed it.",
   "**Make it smaller.** Delete half the program. Reproduce in ten lines. If it stops failing, the bug is in what you removed.",
   "**Walk away.** Twenty minutes doing anything else. The number of bugs solved on the way to the kitchen is not a joke either — you are stuck in a loop of the same wrong assumption and interrupting it is a real technique.",
   "**Then search — properly.** Paste the *error type and message*, not your whole code. Strip out your own names and paths. Add the language and library name."
  ] },

  { trap: "The most expensive debugging habit is changing things at random to see what happens. It occasionally works, teaches you nothing, and usually leaves behind two new bugs plus a pile of changes you cannot explain. If you catch yourself doing it, stop and go back to step one — it is a sign you skipped reproducing the problem properly." },

  { q: "Everyone knows that debugging is twice as hard as writing a program in the first place. So if you are as clever as you can be when you write it, how will you ever debug it?", by: "Brian Kernighan" },

  { tryit: { t: "Plan the investigation",
    task: "A report shows 8,410 orders. The database has 8,500. No errors anywhere. Write out your first four steps.",
    hint: "Do not think about the code yet. Think about where you would measure.",
    sol: { lang: "text", code: "1. REPRODUCE: run the report twice. Same 8,410 both times?\n   If it varies, the cause is ordering, timing or a limit.\n\n2. BISECT: print the row count after every stage --\n   after the query, after cleaning, after grouping,\n   before writing. Find the stage that loses 90.\n\n3. HYPOTHESIS (say it is the cleaning stage):\n   \"rows with a null customer_id are being dropped\"\n   -- check by counting nulls in the source: is it 90?\n\n4. VERIFY, ONE CHANGE: keep them and confirm the total\n   becomes 8,500. Then decide what SHOULD happen to\n   those rows -- which is a product question, not a\n   code question." },
    w: "Notice that no step involved reading the code closely, and step 4 ends by questioning what the correct behaviour even is. A surprising share of *bugs* turn out to be undecided requirements." } },

  { vocab: ["Debugging", "Rubber Duck Debugging", "Stack Trace"] }
 ],
 k: [
  "Debugging is narrowing down where the program stops matching your belief — not staring at code hoping for insight.",
  "Reproduce first. A bug you cannot trigger on demand is a bug you cannot confirm you fixed.",
  "Bisect: check the middle, eliminate half. Fourteen measurements will locate a bug in ten thousand lines.",
  "One change at a time, and label your prints. Changing things at random teaches you nothing and adds new bugs."
 ],
 r: ["Debugging", "Stack Trace", "Logging"]
},

{
 t: "Testing: Catching the Errors Nobody Reports",
 m: "errors",
 lvl: "intermediate",
 s: "The only defence against logic errors, and why it makes you faster rather than slower.",
 goal: [
  "Write a test with the arrange–act–assert shape",
  "Choose which cases are worth testing",
  "Say what a test suite buys you beyond correctness"
 ],
 b: [
  { p: "Syntax errors announce themselves. Runtime errors announce themselves. Logic errors — the expensive kind — announce nothing, and the only thing that finds them systematically is a **test**: code that runs your code and checks the answer." },
  { p: "The usual objection is that writing tests takes time you do not have. It is worth being precise about why that is backwards." },

  { h: "What a test actually is" },
  { p: "There is no magic. A test is a small function that calls your code with a known input and compares the result to what you expect. You could write one with an `if` and a `print`; frameworks just make it tidy and let you run five hundred of them at once." },

  { code: { lang: "python", t: "Arrange, act, assert",
    lines: [
     { c: "def test_order_total_adds_tax():", w: "The name is a sentence describing the behaviour. When it fails, the name alone should tell you what broke — this is the most-read documentation in any codebase." },
     { c: "    price, qty = 10.0, 3", w: "**Arrange** — set up the known inputs." },
     { c: "    result = order_total(price, qty, rate=0.2)", w: "**Act** — call exactly one thing." },
     { c: "    assert result == 36.0", w: "**Assert** — state the expected answer. If this is false, the test fails and tells you the actual value." },
     { c: "", w: "" },
     { c: "def test_order_total_rejects_negative_quantity():", w: "" },
     { c: "    with pytest.raises(ValueError):", w: "Errors are behaviour too. *This input must be refused* is a promise worth locking down." },
     { c: "        order_total(10.0, -1)", w: "" }
    ],
    after: "Arrange, act, assert. Every test in every language and framework has this shape — pytest, JUnit, Jest, Go's testing package. Keep them in that order and tests stay readable by people who did not write them." } },

  { h: "Which cases are worth writing" },
  { p: "You cannot test everything and should not try. Test where bugs actually live, which is a small and predictable set of places." },

  { tbl: { t: "The cases that earn their keep",
    h: ["Case", "Example", "Why"],
    rows: [
     ["**The normal one**", "3 items at £10", "Proves it works at all. Write it first."],
     ["**Empty**", "an empty list", "Averages divide by zero; loops never run; `[0]` explodes. The most productive single test."],
     ["**One**", "a single item", "Off-by-ones and *first/last* logic show up here and nowhere else."],
     ["**The boundary**", "exactly at the limit, one either side", "`>` versus `>=` lives here, and nowhere else."],
     ["**Wrong type / bad input**", "text where a number goes", "Proves your validation exists."],
     ["**The bug you just fixed**", "the exact input that broke", "A **regression test**. It is now impossible for that bug to come back unnoticed."]
    ] } },

  { p: "That last row is the highest-value habit in this lesson. Every time you fix a bug, write a test that would have caught it *before* you fix it — watch it fail, then fix the code, then watch it pass. You have now made that specific mistake permanently impossible, and you got confirmation that your test actually tests something." },

  { h: "Why it makes you faster" },
  { p: "The time argument is real but the accounting is usually wrong." },
  { l: [
   "**You are already testing manually.** Running the script, typing input, squinting at output — that is a test, run by hand, discarded, and repeated tomorrow. Writing it down costs a few extra minutes once and it runs in milliseconds thereafter.",
   "**Tests let you change things.** Without them, every change is a gamble and codebases calcify — people stop refactoring because they cannot tell what they broke. With them, you can restructure aggressively and know in seconds.",
   "**A failing test locates the bug for you.** A red test names the function and the case. A bug report says *the report looks wrong*.",
   "**They are executable documentation.** A test shows exactly how a function is meant to be called and what it returns, and unlike a comment it cannot go stale — if it goes out of date it fails."
  ] },

  { h: "The layers" },
  { dg: "test-pyramid" },
  { l: [
   "**Unit tests** — one function, no database, no network. Milliseconds. Write hundreds.",
   "**Integration tests** — several pieces together, with a real database or a test API. Seconds. Write dozens.",
   "**End-to-end tests** — the whole system as a user experiences it. Minutes, and fragile. Write a handful, for the paths that must never break: signup, checkout, login."
  ] },
  { p: "The shape is a pyramid because the cheap fast ones should be the majority. An inverted pyramid — mostly end-to-end tests — is slow, flaky, and tells you *something is broken* without telling you what." },

  { trap: "A test that never fails is not protecting anything. If you write a test and it passes first time, deliberately break the code and confirm it goes red. Tests with no assertion, tests that assert something trivially true, and tests that mock away the thing under examination are all worse than no test, because they produce confidence without protection." },

  { n: "**Test-driven development** takes this further: write the failing test first, then the code that makes it pass. It is genuinely useful for anything with clear rules — parsers, calculations, business logic — because it forces you to decide what *correct* means before you start. It is a poor fit for exploratory work where you do not yet know what you are building. Try it on a small function; do not adopt it as a religion.",
    nt: "TDD, briefly" },

  { tryit: { t: "Write the cases",
    task: "For a function `split_bill(total, people)` that returns the amount each person pays — list the tests you would write.",
    hint: "Normal, empty, one, boundary, bad input, and money.",
    sol: { lang: "python", code: "def test_splits_evenly():          split_bill(100, 4) == 25\ndef test_single_person():          split_bill(100, 1) == 100\ndef test_zero_people_raises():     raises(ValueError)\ndef test_negative_people_raises(): raises(ValueError)\ndef test_zero_total():             split_bill(0, 4) == 0\ndef test_uneven_split():           split_bill(100, 3) == ?\n\n# That last one is not a test yet -- it is a QUESTION.\n# 33.33 x 3 = 99.99. Who pays the extra penny?\n# The test cannot be written until someone decides,\n# and nobody had decided." },
    w: "That is the second thing tests give you, and often the more valuable one: writing them forces the ambiguous cases into the open *before* they ship. This one is a real problem with a real answer in every payments system on earth." } },

  { vocab: ["Unit Test", "Test-Driven Development", "Assertion", "Code Coverage"] }
 ],
 k: [
  "A test is just code that runs your code with a known input and checks the answer. Arrange, act, assert.",
  "Test the normal case, empty, one, the boundary, bad input — and always the bug you just fixed.",
  "Tests are what let you change code confidently. Without them a codebase slowly freezes.",
  "A test that has never been seen to fail is not protecting anything. Break the code once and check it goes red."
 ],
 r: ["Unit Test", "Test-Driven Development", "Code Coverage", "Continuous Integration"]
}

]);
