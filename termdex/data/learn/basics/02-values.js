/* Programming Basics — values, variables and types. */
TD.addLessons("basics", [

{
 t: "Variables: Names for Values",
 m: "values",
 lvl: "core",
 s: "What a variable really is, why `x = x + 1` is not a contradiction, and how to name things well.",
 goal: [
  "Explain assignment as *evaluate, then bind* rather than *put in a box*",
  "Read `x = x + 1` without flinching",
  "Choose names a stranger could follow"
 ],
 b: [
  { p: "A **variable** is a name you attach to a value so that you can refer to it later without writing the value out again. That is the entire concept, and it is genuinely simple — but the standard beginner explanation of it is subtly wrong in a way that causes real bugs three lessons from now, so let us get it right the first time." },

  { h: "It is a label, not a box" },
  { p: "You will be told a variable is *a box that holds a value*. It is a comfortable picture and it breaks the moment you have two names for the same list. The accurate picture is this: **a variable is a name tied to a value that lives somewhere in memory.** The name is a label on a piece of string; the value is at the other end." },

  { dg: "var-binding" },

  { p: "Why does the distinction matter? Because if a variable were a box, then giving a second name to the same thing would copy it — you would have two boxes. It does not. It ties a second label to the same value. That is the source of one of the most confusing bugs beginners hit, and there is a whole lesson on it at the end of this module." },

  { h: "Assignment reads right-to-left" },
  { p: "The `=` sign is not the `=` from mathematics. In maths it asserts that two things are equal. In code it is an instruction, and it always happens in this order:" },
  { ol: [
   "Evaluate everything on the **right** of the `=` down to a single value.",
   "Bind the name on the **left** to that value.",
   "Forget the expression. It is gone; only the answer remains."
  ] },
  { p: "Once you read it in that order, the line that stops every beginner for a moment becomes trivial." },

  { code: { lang: "text", t: "The line that looks impossible",
    lines: [
     { c: "score = 10", w: "Right side is `10`, which evaluates to 10. Bind `score` to 10." },
     { c: "score = score + 1", w: "Right side first: look up `score` (it is 10), add 1, get 11. **Now** bind `score` to 11. At no point did anything claim that a number equals itself plus one." },
     { c: "score += 1", w: "The short form of exactly the same thing. Almost every language has it, along with `-=`, `*=` and `/=`. It is not faster; it is shorter and it says *modify in place* more clearly." }
    ],
    out: "score is now 12",
    ot: "After both increments" } },

  { ana: "Think of `=` as an arrow pointing left: `score <- score + 1`. Some languages (R, and old-school pseudocode) literally write it that way, and it removes the confusion instantly. Read every `=` in your head as *becomes*, never as *equals*. *total becomes price times quantity.*",
    at: "Read it as *becomes*" },

  { h: "Declaring versus assigning" },
  { p: "Some languages want you to announce a name before using it. Others let you create it by assigning to it. This is one of the first visible differences between languages and it is worth recognising on sight." },

  { tbl: { t: "Four languages introducing the same variable",
    h: ["Language", "How you write it", "What is going on"],
    rows: [
     ["Python", "`score = 10`", "Assignment creates the name. No declaration keyword exists."],
     ["JavaScript", "`let score = 10;`", "`let` declares it. `const` declares one that cannot be re-bound. (`var` is the old form — avoid it.)"],
     ["Java", "`int score = 10;`", "You declare the **type** as well. The name can only ever hold whole numbers."],
     ["Go", "`score := 10`", "`:=` declares and assigns at once, working the type out from the value. Or `var score int = 10` spelled out."]
    ] } },

  { n: "`const` (or `final`, or `val`) means *this name cannot be pointed at something else*. It does **not** always mean the value itself cannot change — a `const` list in JavaScript can still have items added to it, because the name is still pointing at the same list. That distinction catches people out constantly, and it is the alias idea again wearing a different hat.",
    nt: "const is about the name, not the value" },

  { h: "Naming: the skill nobody teaches" },
  { p: "You will spend more of your career reading code than writing it, and names are most of what you read. A good name removes the need for a comment, a paragraph of explanation and, quite often, a bug." },

  { vs: { lang: "python", t: "The same function, twice",
    bad: { label: "Technically correct", c: "def calc(x, y, z):\n    a = x * y\n    b = a * z\n    return a + b",
      w: "Every single one of these names is a placeholder. To understand three lines you have to hold five meaningless letters in your head at once, and you can never check your understanding against anything." },
    good: { label: "Actually readable", c: "def order_total(price, quantity, tax_rate):\n    subtotal = price * quantity\n    tax = subtotal * tax_rate\n    return subtotal + tax",
      w: "Identical logic, zero mental overhead. You can also now *spot a bug by reading*: if the last line said `return subtotal`, you would notice the missing tax immediately. In the left-hand version you would not." }
  } },

  { l: [
   "**Say what it holds, not what type it is.** `user_count` beats `int_var`. The type is usually obvious anyway.",
   "**Length should match scope.** A loop index used across three lines can be `i`. A value used across three hundred lines had better be `active_subscription_count`.",
   "**Booleans should read as questions.** `is_valid`, `has_permission`, `should_retry`. Then `if is_valid:` reads as English.",
   "**Collections are plural.** `users` holds many; `user` holds one. Then `for user in users:` is self-documenting.",
   "**Avoid the almost-name.** `data`, `info`, `value`, `temp`, `stuff`, `manager`, `handler`, `obj` — all of these mean *I did not decide what this is*.",
   "**Do not abbreviate to save typing.** You type it once and read it fifty times, and your editor autocompletes it anyway."
  ] },

  { p: "Every language has a house style for the shape of names, and using the wrong one marks you out instantly. Python and Ruby use `snake_case`; JavaScript, Java, C# and Go use `camelCase` for variables; classes are `PascalCase` almost everywhere; constants are `SCREAMING_SNAKE_CASE` almost everywhere. Match whatever the file you are in already does — consistency beats personal preference, always." },

  { trap: "Naming something `list`, `str`, `dict`, `type`, `sum`, `id`, `max` or `input` will not error — it will *shadow* the language's own built-in of that name, and something two hundred lines later that expected the real one will fail bizarrely. If your editor colours a name differently from your other variables, that is why. Add a suffix: `user_list`, `input_text`." },

  { h: "Constants: the names that must not move" },
  { p: "Some values are decisions, not data — a tax rate, a maximum retry count, a file path. Naming them once at the top of a file has three effects: the number stops appearing mysteriously in the middle of an expression, changing it is a one-line edit, and typos become impossible because a misspelled name errors while a mistyped number does not." },

  { code: { lang: "python", t: "The magic number and its cure",
    lines: [
     { c: "# before — what is 86400? What is 3?", w: "" },
     { c: "if age > 86400 * 3:", w: "A reader has to stop, work out that 86400 is a day in seconds, then multiply. Every reader. Every time." },
     { c: "    purge(record)", w: "" },
     { c: "", w: "" },
     { c: "# after", w: "" },
     { c: "SECONDS_PER_DAY = 86400", w: "Named once. Now unambiguous, searchable and impossible to typo silently." },
     { c: "RETENTION_DAYS = 3", w: "And this is now obviously a **policy decision**, sitting where policy decisions should sit — at the top, visible, easy to change." },
     { c: "", w: "" },
     { c: "if age > SECONDS_PER_DAY * RETENTION_DAYS:", w: "This line now reads as a sentence, and you could hand it to someone non-technical for review." },
     { c: "    purge(record)", w: "" }
    ] } },

  { tryit: { t: "Trace the values",
    task: "What are `a` and `b` at the end? Work through it one line at a time, right side first.",
    hint: "Line 3 evaluates the right-hand side using the values as they are *at that moment*.",
    sol: { lang: "python", code: "a = 5\nb = a\na = a + 3\nb = b * 2\n\n# a = 8   (5 + 3)\n# b = 10  (b was bound to 5 on line 2 and never re-read a)" },
    w: "The key move is line 2: `b = a` bound `b` to the **value** 5, not to the variable `a`. Changing `a` afterwards has no effect on `b` — for numbers. Hold that thought; it is not true for lists, and that is the last lesson of this module." } },

  { vocab: ["Variable", "Constant", "Assignment Operator", "Magic Number"] }
 ],
 k: [
  "A variable is a name tied to a value, not a box the value sits in. That distinction becomes critical with lists.",
  "Assignment evaluates the right-hand side completely, then binds the name. Read `=` as *becomes*.",
  "Good names are the cheapest documentation there is, and they let you spot bugs by reading.",
  "Name your constants. A magic number in the middle of an expression is a puzzle you are setting for a stranger."
 ],
 r: ["Variable", "Constant", "Assignment Operator", "Naming Conventions"],
 drill: {
  lang: "text",
  reps: 3,
  items: [
   { c: "total = price * quantity", w: "evaluate the product, then bind `total` to it" },
   { c: "count += 1", w: "read count, add one, store it back under the same name" },
   { c: "a, b = b, a", w: "swap two names in one statement — the right side is evaluated first" },
   { c: "MAX_RETRIES = 3", w: "a constant: a decision named once, at the top" },
   { c: "is_active = user.status == \"live\"", w: "a boolean named as a question so `if is_active:` reads as English" }
  ]
 }
},

{
 t: "The Six Types Every Language Has",
 m: "values",
 lvl: "core",
 s: "Numbers, text, truth, nothing and collections — the vocabulary that transfers everywhere.",
 goal: [
  "Name the six universal type families and give an example of each",
  "Explain why `\"5\" + 5` is a different question in different languages",
  "Convert between types deliberately instead of hoping"
 ],
 b: [
  { p: "A **type** is the answer to the question *what kind of thing is this value, and therefore what can I do to it?* You can add numbers. You can capitalise text. Adding text to a number is a question with no obvious answer, and how a language responds to that question tells you a great deal about it." },
  { p: "Languages have wildly different type systems, but underneath they nearly all offer the same six families. Learn them once here and every new language's chapter two is a skim." },

  { dg: "type-families" },

  { h: "1 · Whole numbers" },
  { p: "Called `int`, `integer`, `long`, `i32`, `bigint`. Counting things, indexes, IDs, ages, quantities. No decimal point — not *a zero after the point*, but genuinely no fractional part at all." },
  { p: "Most languages give an integer a fixed size, and if you exceed it the value silently wraps around to a large negative number. This is called **overflow** and it has crashed real rockets. Python is unusual: its integers grow to whatever size they need, so `2 ** 1000` is an ordinary value there and impossible almost everywhere else." },

  { h: "2 · Decimals" },
  { p: "Called `float`, `double`, `real`, `f64`. Anything measured rather than counted: prices, weights, averages, probabilities." },
  { p: "These are stored in binary, and some perfectly ordinary decimal numbers have no exact binary form — the same way one third has no exact decimal form. Which produces the result that every programmer meets exactly once and never forgets:" },

  { out: ">>> 0.1 + 0.2\n0.30000000000000004\n\n>>> 0.1 + 0.2 == 0.3\nFalse", ot: "In Python, JavaScript, Java, C, Go, Rust — all of them" },

  { p: "This is not a bug in the language. It is the IEEE 754 standard behaving exactly as specified, in every language that uses hardware floating point, which is all of them. The consequences are practical:" },
  { l: [
   "**Never compare floats with `==`.** Ask whether the difference is smaller than a tiny tolerance instead.",
   "**Never store money as a float.** Use integer pence/cents, or a decimal type (`Decimal` in Python, `BigDecimal` in Java). Fractions of a penny accumulate, and auditors notice.",
   "For averages, physics, graphics and machine learning, floats are exactly right and the imprecision is irrelevant."
  ] },

  { h: "3 · Text" },
  { p: "Called `string`, `str`, `text`, `char`. Anything made of characters — names, addresses, whole documents, JSON, HTML. Written between quotes, and the quotes are how the parser tells `42` (a number) from `\"42\"` (two characters that happen to be digits)." },
  { p: "A number in quotes is text. You cannot do arithmetic with it, and the fact that it looks like a number to you is not visible to the machine at all. Every value coming from a file, a form, a command line or a network request arrives as text, and converting it is your job." },

  { h: "4 · Booleans" },
  { p: "Called `bool`, `boolean`. Exactly two values: `true` and `false` (`True`/`False` in Python). Named after George Boole, who worked out the algebra of them in 1847, decades before anything existed to run it on." },
  { p: "Booleans look trivial and they are the hinge of every program — every `if`, every `while`, every filter reduces to one. There is a full lesson on them in the next module." },

  { h: "5 · Nothing" },
  { p: "Called `null`, `None`, `nil`, `undefined`, `NULL`. A value meaning *there is deliberately no value here*. Not zero, not an empty string — those are values. This is the absence of one." },
  { p: "The distinction is real and important. A user with `age = 0` is a newborn. A user with `age = null` is one whose age you never asked. Collapsing those two states is how systems end up emailing *Dear valued customer, you are 0 years old*." },

  { n: "Tony Hoare invented the null reference in 1965 and called it his \"billion-dollar mistake\" — because a name that might point at nothing means every use of it might explode, and no early type system checked for it. Modern languages fight back: Rust has `Option`, Kotlin and TypeScript have non-nullable types, Go returns explicit errors. When you meet those features, this is the problem they are solving.",
    nt: "The billion-dollar mistake" },

  { h: "6 · Collections" },
  { p: "Called `list`, `array`, `dict`, `map`, `object`, `set`, `tuple`. Values that hold other values. This is the family that makes programs interesting — the other five hold one thing each, and this one holds any number of them, including other collections." },
  { p: "There is a whole module on collections later. For now, the important fact is that they behave differently from the first five in one specific way, and the last lesson of this module is about that difference." },

  { h: "Conversion: the part you must do on purpose" },
  { p: "Values arrive as the wrong type constantly, and converting them is called **casting** or **coercion**." },

  { code: { lang: "python", t: "Explicit conversion — you ask, it happens",
    lines: [
     { c: "age_text = input(\"Your age: \")", w: "Everything typed at a keyboard is text. Even \"30\". Especially \"30\"." },
     { c: "age = int(age_text)", w: "Convert to a whole number, deliberately. If the user typed \"thirty\", this raises a `ValueError` right here — which is exactly what you want, at the boundary, where you can still give a sensible message." },
     { c: "", w: "" },
     { c: "next_year = age + 1", w: "Now safe. Without line 2 this would be `\"30\" + 1`, which in Python is a `TypeError`." },
     { c: "print(\"Next year: \" + str(next_year))", w: "Back the other way — a number cannot be glued to text without being made into text first." }
    ] } },

  { p: "And the reason languages disagree so loudly about all this:" },

  { tbl: { t: "`\"5\" + 5` — four answers to one question",
    h: ["Language", "Result", "What it decided"],
    rows: [
     ["Python", "`TypeError`", "Refuses. Text and numbers do not mix; say what you meant."],
     ["JavaScript", "`\"55\"`", "Converts the number to text and joins them. Quiet, convenient, and the source of endless bugs."],
     ["Java", "`\"55\"`", "Same, but only because `+` on a String is defined as concatenation. `5 + \"5\"` is also `\"55\"`."],
     ["Go", "Compile error", "Refuses before the program even builds. Nothing ships."]
    ] } },

  { p: "A language that refuses is called **strongly typed**; one that guesses is **weakly typed**. Neither is stupid. JavaScript's coercion makes throwaway scripts shorter; Go's refusal makes a hundred-thousand-line system safer. Know which kind you are standing in, because it decides how much you have to check things yourself." },

  { trap: "The most common real-world instance: reading numbers from a CSV, a form or an API and sorting them without converting. Text sorts alphabetically, so `\"100\"` comes before `\"9\"`, and `\"2\" > \"10\"` is `true`. Your report is wrong, nothing errored, and you will not spot it until someone asks why the top seller has sales of 9." },

  { tryit: { t: "Predict the type",
    task: "What type is each of these values, and which pairs are the same value?",
    hint: "Quotes make text. Square brackets make a collection. No quotes and no point makes a whole number.",
    sol: { lang: "python", code: "42        -> int\n42.0      -> float      (same number, different type)\n\"42\"      -> str        (NOT the same value)\nTrue      -> bool\nNone      -> NoneType   (the absence of a value)\n[42]      -> list       (a collection holding one int)\n\"\"        -> str        (empty text — a value)\n0         -> int        (a value, and not the same as None)" },
    w: "The pairs worth staring at are `42` / `\"42\"` and `0` / `None` / `\"\"`. Those three at the bottom are all *falsy* in most languages and mean completely different things — which is the subject of a later lesson." } },

  { vocab: ["Data Type", "Integer", "Floating Point", "String", "Boolean", "Null"] }
 ],
 k: [
  "Six families: whole numbers, decimals, text, booleans, nothing, and collections. Every language spells them differently and means the same.",
  "Floats are approximate. Never compare them with `==` and never store money in one.",
  "`null` means *no value at all* and is not the same as zero or empty text. Conflating them is a classic source of nonsense output.",
  "Anything from a keyboard, file, form or network arrives as text. Converting it is your job, and doing it at the boundary is what keeps the rest of the program simple."
 ],
 r: ["Data Type", "Integer", "Floating Point", "String", "Boolean", "Null"]
},

{
 t: "Static and Dynamic Typing",
 m: "values",
 lvl: "intermediate",
 s: "The single biggest difference between languages, and why it is really an argument about when you find out.",
 goal: [
  "Say what static and dynamic typing actually mean",
  "Predict which kind of language will catch which kind of bug",
  "Explain why large codebases drift towards static typing"
 ],
 b: [
  { p: "Pick up any two languages and the loudest difference between them will be this one. It sounds like an argument about how much you have to type. It is not. It is an argument about **when you find out you were wrong**." },

  { dg: "static-dynamic" },

  { h: "Dynamic typing: the value carries the type" },
  { p: "In Python, JavaScript, Ruby and PHP, a variable is just a name. It has no type of its own — it can point at a number now and a list in three lines' time, and the language will not object. The *value* knows what it is; the *name* does not care." },

  { code: { lang: "python", t: "Perfectly legal Python",
    lines: [
     { c: "x = 42", w: "`x` points at an integer." },
     { c: "x = \"forty two\"", w: "Now it points at a string. No complaint. This is not a hack, it is the design." },
     { c: "x = [1, 2, 3]", w: "And now a list. The name is a label; labels can be moved." },
     { c: "", w: "" },
     { c: "def add(a, b):", w: "No types anywhere. This function will accept absolutely anything." },
     { c: "    return a + b", w: "" },
     { c: "", w: "" },
     { c: "add(2, 3)", w: "5" },
     { c: "add(\"ab\", \"cd\")", w: "\"abcd\" — and this is a feature. One function, many types, as long as `+` means something for them." },
     { c: "add(2, \"cd\")", w: "**TypeError, at this moment, at runtime.** The file was perfectly valid until the instant this line executed." }
    ] } },

  { p: "That last line is the whole story. The mistake existed the moment it was typed. Nobody found out until it ran — and if that line only runs when a customer uploads a file with a missing column, nobody finds out until a customer uploads a file with a missing column." },

  { h: "Static typing: the name carries the type" },
  { p: "In Java, C, C++, Go, Rust, C# and TypeScript, every name is declared with a type, and a **type checker** reads the whole program before it runs, verifying that every use is consistent. If it is not, it refuses to build. Nothing runs, nothing ships, nothing reaches a customer." },

  { code: { lang: "go", t: "The same mistake, in Go",
    lines: [
     { c: "func add(a int, b int) int {", w: "Both parameters are declared as `int`, and the function is declared to return an `int`. This is a contract the compiler will enforce for everybody." },
     { c: "    return a + b", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "add(2, \"cd\")", w: "**Does not compile.** `cannot use \"cd\" (untyped string) as int value`. You found out three seconds after typing it, before the tests ran, before the commit, before anybody else saw it." }
    ] } },

  { h: "The honest trade-off" },

  { tbl: { t: "What each one buys you",
    h: ["", "Dynamic", "Static"],
    rows: [
     ["When type errors are found", "The moment that line runs — possibly never in testing", "Before it runs at all"],
     ["Amount you write", "Less. Often much less.", "More, though modern inference has closed most of the gap"],
     ["Speed of a small script", "Faster to write. Idea to result in minutes.", "Slower. Ceremony first."],
     ["Editor help", "Guesswork. Autocomplete is best-effort.", "Excellent. The editor knows exactly what everything is."],
     ["Refactoring safely", "Hard. Rename something and hope you found every use.", "Easy. Break something and the compiler lists every site."],
     ["A team of fifty", "Painful without heavy discipline and tests", "This is what it is for"],
     ["Runtime speed", "Slower — types are checked as it goes", "Faster — types are known and optimised away"]
    ] } },

  { p: "Neither column is *correct*. They are answers to different questions. A forty-line script that reshapes a spreadsheet once wants Python. A payments system with two hundred contributors that must not lose money wants Go, Java or Rust. Most of the difficulty in this debate comes from people arguing about a project size they are not both imagining." },

  { h: "Where every language ended up" },
  { p: "Something interesting happened over the last fifteen years: the two camps walked towards each other, and both arrived at the same compromise — *gradual typing*." },
  { l: [
   "**JavaScript grew TypeScript.** Optional types, checked before the code ships, erased before it runs. It is now the default for any serious front-end project.",
   "**Python grew type hints.** `def add(a: int, b: int) -> int:` — ignored at runtime, but read by `mypy`, `pyright` and your editor, which will tell you off immediately.",
   "**Static languages grew inference.** Go's `x := 42` and Rust's `let x = 42` work out the type themselves, so you get the checking without writing the type twice."
  ] },

  { code: { lang: "python", t: "Python with hints — the best of both, and it is optional",
    lines: [
     { c: "def apply_discount(price: float, percent: int) -> float:", w: "The hints say: two arguments of these types, one float back. Python itself will ignore all of it and run happily either way." },
     { c: "    return price * (1 - percent / 100)", w: "" },
     { c: "", w: "" },
     { c: "apply_discount(100.0, \"ten\")", w: "This still runs, and still crashes at runtime — Python does not enforce hints. But your **editor underlines it in red as you type**, and `mypy` fails it in CI before it merges. You get the warning without the ceremony." }
    ],
    after: "This is why type hints have taken over serious Python. They cost one line, they are optional, and they turn a class of 3am runtime errors into a squiggly red line." } },

  { trap: "Do not conclude that static typing removes the need for tests. A type checker verifies *shape*, not *correctness*. `def add(a: int, b: int) -> int: return a - b` type-checks perfectly and is wrong. Types catch a category of mistake — a large and annoying category — and nothing else." },

  { n: "**Strong vs weak** is a different axis from **static vs dynamic**, and the four words get mixed up constantly. Static/dynamic is *when* types are checked. Strong/weak is *how much implicit conversion* the language does. Python is dynamic **and** strong: it checks late, but it refuses to guess what `\"5\" + 5` means. JavaScript is dynamic and weak: it checks late and guesses freely. Go is static and strong.",
    nt: "Four words, two axes" },

  { tryit: { t: "Which language finds it, and when?",
    task: "A function expects a number and is called with a string, on a line that only executes when a payment fails. Say when the bug surfaces in Python, in Python with mypy in CI, and in Go.",
    hint: "Ask what has to happen for that line to execute in each case.",
    sol: { lang: "text", code: "Python, no hints:\n  when a payment actually fails in production, at 3am,\n  possibly months after the code was written.\n\nPython + mypy in CI:\n  in the editor, as you type, and again when the pull\n  request runs. Never reaches production.\n\nGo:\n  the build fails. There is no binary to deploy.\n  The bug cannot physically leave your machine." },
    w: "Same bug, three very different costs. That gap — not keystrokes — is what the whole argument is actually about." } },

  { vocab: ["Static Typing", "Dynamic Typing", "Type Inference"] }
 ],
 k: [
  "Static and dynamic typing differ in *when* the type is checked: before it runs, or at the moment that line executes.",
  "Dynamic is faster to write and finds bugs late. Static is slower to write and finds them before anything ships.",
  "Strong vs weak is a separate axis — that is about how eagerly a language converts things behind your back.",
  "Every ecosystem has converged on gradual typing: TypeScript, Python hints, Go's inference. Learn to use them; the cost is tiny and the payoff is immediate."
 ],
 r: ["Static Typing", "Dynamic Typing", "Type Inference", "Runtime"]
},

{
 t: "Mutability, References and the Copy That Was Not",
 m: "values",
 lvl: "intermediate",
 s: "Why changing one list changed another one you never touched — the bug that ends more debugging sessions in tears than any other.",
 goal: [
  "Explain what mutable and immutable mean",
  "Predict whether `b = a` copies or shares",
  "Copy a collection on purpose, and know when shallow is not enough"
 ],
 b: [
  { p: "This lesson exists because of one bug. It has caught every programmer alive, usually more than once, and it is entirely invisible until you know the mechanism — at which point it becomes obvious forever. Everything in this lesson follows from the very first thing you were told: **a variable is a label, not a box.**" },

  { h: "Mutable and immutable" },
  { p: "A value is **immutable** if it cannot be changed after it is created. Ask for a change and you get a *new* value; the original is untouched. A value is **mutable** if it can be modified in place — same value, same location in memory, different contents." },

  { tbl: { t: "Which is which, in most languages",
    h: ["Family", "Usually", "What that means in practice"],
    rows: [
     ["Numbers, booleans", "**Immutable**", "There is no way to \"change the 5\". You can only point a name at a different number."],
     ["Text / strings", "**Immutable** (Python, Java, JS, Go, C#)", "`name.upper()` returns a *new* string. The original is unchanged unless you reassign it."],
     ["Lists / arrays", "**Mutable**", "`list.append(x)` changes the list itself. Every name pointing at it sees the change."],
     ["Dictionaries / maps", "**Mutable**", "Same. Adding a key changes the one shared object."],
     ["Tuples / records", "**Immutable**", "Fixed at creation. This is often exactly why you would pick one."],
     ["Objects / class instances", "**Mutable** by default", "Setting a field changes the object everyone is holding."]
    ] } },

  { trap: "The single most common string bug in every language: calling `text.upper()` or `text.strip()` and expecting the variable to change. It does not. Strings are immutable — the method **returned** a new string and you threw it away. You needed `text = text.strip()`. This produces no error at all and simply does nothing." },

  { h: "The bug" },
  { p: "Here it is, with nothing hidden." },

  { code: { lang: "python", t: "Read it carefully. It does not do what it looks like.",
    lines: [
     { c: "original = [1, 2, 3]", w: "One list exists in memory. `original` is a label on it." },
     { c: "backup = original", w: "The right side evaluates to *that same list*. Now there are two labels and still exactly one list. **Nothing was copied.**" },
     { c: "", w: "" },
     { c: "original.append(4)", w: "This modifies the list in place. It does not create a new one." },
     { c: "", w: "" },
     { c: "print(original)", w: "" },
     { c: "print(backup)", w: "The \"backup\" is the same object. It was never a backup of anything." }
    ],
    out: "[1, 2, 3, 4]\n[1, 2, 3, 4]",
    ot: "Both lines, every time" } },

  { dg: "alias-copy" },

  { p: "Compare with the version using numbers, which behaves the way everyone expects — and now you can say exactly why." },

  { code: { lang: "python", t: "The same shape, with an immutable value",
    lines: [
     { c: "a = 5", w: "`a` labels the value 5." },
     { c: "b = a", w: "`b` labels the value 5 as well. Two labels, one value — identical situation to the list!" },
     { c: "a = a + 1", w: "Here is the difference. You **cannot** modify 5. So this creates a *new* value, 6, and re-points `a` at it. `b` is still on the old one." },
     { c: "print(a, b)", w: "" }
    ],
    out: "6 5",
    ot: "Which is what you expected" } },

  { p: "The two cases are not really different rules. Both did `b = a` and shared. The only difference is that the second one had no way to *mutate*, so the change had to make something new. **The behaviour you think of as normal is a side effect of immutability**, and lists simply do not have it." },

  { h: "Copying on purpose" },
  { p: "When you genuinely want a separate list, you must ask for one." },

  { code: { lang: "python", t: "Three ways to say \"give me my own\"",
    lines: [
     { c: "backup = original.copy()", w: "The clearest, in modern Python. JavaScript: `[...arr]`. Java: `new ArrayList<>(list)`." },
     { c: "backup = original[:]", w: "A full slice. Older idiom, works everywhere, slightly cryptic." },
     { c: "backup = list(original)", w: "Build a new list from the old one's contents. Also works for converting other things into lists." },
     { c: "", w: "" },
     { c: "original.append(4)", w: "" },
     { c: "print(original, backup)", w: "Two genuinely separate lists now." }
    ],
    out: "[1, 2, 3, 4] [1, 2, 3]" } },

  { h: "Shallow and deep: the second half of the trap" },
  { p: "All three of those are **shallow** copies. They make a new outer list — and fill it with *the same inner objects*. If your list contains other lists, you have solved the outer problem and kept the inner one." },

  { code: { lang: "python", t: "Where the shallow copy stops helping",
    lines: [
     { c: "teams = [[\"ana\"], [\"raj\"]]", w: "A list of lists. Three objects in memory: the outer list, and two inner ones." },
     { c: "backup = teams.copy()", w: "New outer list. But its two slots point at **the very same two inner lists**." },
     { c: "", w: "" },
     { c: "teams.append([\"sam\"])", w: "Only the outer list changed — `backup` still has two entries. So far so good." },
     { c: "teams[0].append(\"kai\")", w: "This reaches *inside* to an inner list, which is shared. Both see it." },
     { c: "", w: "" },
     { c: "print(backup)", w: "" }
    ],
    out: "[['ana', 'kai'], ['raj']]",
    ot: "The \"backup\" changed anyway" } },

  { code: { lang: "python", t: "The fix, when you actually need it",
    lines: [
     { c: "import copy", w: "" },
     { c: "backup = copy.deepcopy(teams)", w: "Walks the whole structure and duplicates every level. Now genuinely independent." },
     { c: "", w: "" },
     { c: "# JavaScript:  structuredClone(obj)", w: "The modern built-in. The old trick `JSON.parse(JSON.stringify(obj))` also works but silently destroys dates, functions and undefined." }
    ],
    after: "Deep copies cost time and memory proportional to the whole structure. Reach for one when you need it and not by reflex — most of the time a shallow copy, or simply not mutating, is the better answer." } },

  { h: "The professional habit: stop mutating" },
  { p: "Experienced engineers avoid this entire family of bug by changing the default. Instead of modifying a collection that someone else might be holding, they build a new one and return it." },

  { vs: { lang: "python", t: "Two ways to write the same function",
    bad: { label: "Mutates the caller's list", c: "def add_tax(prices):\n    for i in range(len(prices)):\n        prices[i] *= 1.2\n    return prices",
      w: "The caller's list is now changed, whether they wanted that or not. Somewhere else in the program, code holding the same list quietly starts seeing tax-inclusive prices. Nothing errors. Good luck finding it." },
    good: { label: "Returns a new list", c: "def add_tax(prices):\n    return [p * 1.2 for p in prices]",
      w: "The input is untouched. The output is new. This function can be called from anywhere, in any order, twice, and it cannot surprise anyone. It is also shorter." }
  } },

  { n: "This is the core insight behind functional programming: if nothing is ever modified in place, then aliasing cannot hurt you, order of execution stops mattering, and code becomes far easier to run in parallel. You do not have to adopt the whole philosophy to take the benefit — just default to returning new things, and mutate only when you have a reason.",
    nt: "Why functional programmers care so much" },

  { tryit: { t: "Predict the output",
    task: "What does this print, and why? There are two separate traps in it.",
    hint: "One line mutates. One line rebinds. They do not do the same thing.",
    sol: { lang: "python", code: "a = [1, 2]\nb = a\nc = a.copy()\n\na.append(3)      # mutates the shared list\nb = b + [4]      # builds a NEW list and rebinds b\n\nprint(a)  # [1, 2, 3]\nprint(b)  # [1, 2, 3, 4]  -- b was rebound to a new list\nprint(c)  # [1, 2]        -- copied before any of it" },
    w: "`append` mutates in place, so `a` and `b` both saw it. Then `b = b + [4]` **created a new list** and moved the label `b` onto it — leaving `a` where it was. `+` and `append` look interchangeable and are not." } },

  { vocab: ["Pass by Value vs Reference", "Side Effect"] }
 ],
 k: [
  "`b = a` never copies. It gives the same value a second name — always, for every type.",
  "You only notice with mutable values, because immutable ones cannot be changed in place and so must produce something new.",
  "`.copy()` is shallow: it duplicates the outer container and shares everything inside it. Use a deep copy only when nesting is involved.",
  "The habit that removes the whole problem: return new collections instead of modifying the ones you were handed."
 ],
 r: ["Pass by Value vs Reference", "Pointer", "Side Effect", "Garbage Collection"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "backup = original.copy()", w: "make a genuinely separate outer list", hint: "plain assignment would only add a label" },
   { c: "text = text.strip()", w: "strings are immutable — you must reassign the result", hint: "the method returns, it does not modify" },
   { c: "new_list = [p * 1.2 for p in prices]", w: "build a new list instead of mutating the caller's" },
   { c: "copy.deepcopy(nested)", w: "duplicate every level of a nested structure" },
   { c: "b = b + [4]", w: "create a new list and rebind — unlike append, which mutates" }
  ]
 }
}

]);
