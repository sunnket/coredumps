/* Python — the absolute basics. */
TD.addLessons("python", [

{
 t: "Variables and Names",
 m: "basics",
 lvl: "core",
 s: "The first line of code you will ever write, taken apart character by character.",
 goal: [
  "Explain what `=` actually does, and why it is not equality",
  "Name things the way Python programmers do, and say why the convention matters",
  "Predict what a variable holds after several reassignments"
 ],
 b: [
  { p: "Here is the first real line of Python. It is three characters of meaning and everyone glosses over all three." },

  { syn: { t: "Every part of an assignment",
    parts: [
     { p: "name", w: "**The name you are choosing.** It does not exist until this line runs — this statement is what creates it. You picked this word; Python has no opinion about it beyond the naming rules below. Choose it for the human who reads this in six months, which is usually you." },
     { p: " " },
     { p: "=", w: "**The assignment operator.** Read it as *gets* or *is now*, never as *equals*. It takes whatever is on the right, works it out completely, and attaches the left-hand name to the result. It is an instruction, not a statement of fact — which is why `x = x + 1` is perfectly sensible here and nonsense in mathematics." },
     { p: " " },
     { p: "\"Aryan\"", w: "**The value.** The quotes are doing real work: they mark this as *text*, a piece of data. Without them Python would read `Aryan` as another variable name, go looking for it, fail to find it, and raise a `NameError`." }
    ],
    after: "Read the whole line as an instruction: **work out the right-hand side, then make the left-hand name refer to it.** That order — right first, then left — is the key to everything on this page." } },

  { ana: "A variable is a **label**, not a box. `name = \"Aryan\"` writes `name` on a sticky note and puts it on a piece of text sitting in memory. Assigning again peels the note off and sticks it somewhere else — the original text is untouched, it just has nothing pointing at it any more. Beginners are usually taught the box picture, and it quietly breaks the moment two names refer to the same list.",
    at: "A label, not a box" },

  { h: "Reassignment" },
  { code: { lang: "python", t: "Trace it line by line and say what `x` is at each point",
    lines: [
     { c: "x = 10", w: "`x` is created and refers to 10." },
     { c: "x = 20", w: "The label moves. 10 is gone — no warning, no error, no record. Python assumes you meant it." },
     { c: "x = x + 5", w: "**Right side first, always.** Look up `x` (which is 20), add 5 to get 25, then attach `x` to that. This line is why `=` cannot mean *equals*: there is no number that equals itself plus five." },
     { c: "x += 5", w: "Exactly the same thing, written shorter. `+=` is the *augmented assignment* operator, and there is a version for every arithmetic operator: `-=`, `*=`, `/=`." },
     { c: "print(x)", w: "Confirm." }
    ],
    out: "30" } },

  { h: "What you are allowed to call things" },
  { tbl: { t: "The rules Python enforces",
    h: ["Rule", "Legal", "Illegal"],
    rows: [
     ["Letters, digits and underscores only", "`user_name`, `score2`", "`user-name`, `user name`, `user!`"],
     ["Cannot start with a digit", "`v2`, `_2nd`", "`2nd`"],
     ["Case matters", "`name` and `Name` are two different variables", "—"],
     ["Cannot be a keyword", "`class_`, `list_of`", "`class`, `for`, `if`, `return`, `lambda`"]
    ] } },
  { p: "The last rule causes a specific, confusing failure. Python has about thirty-five reserved words, and using one as a name is a `SyntaxError` — often reported on the *next* line, exactly as the error-reading lesson warned. Your editor colours keywords differently, so the fastest check is visual: if the name you typed went the same colour as `if` and `for`, pick another." },

  { h: "What you *should* call things" },
  { p: "These are conventions, not rules. Python will not stop you breaking them and every Python programmer will notice." },
  { vs: { t: "The same variable, named two ways", lang: "python",
    bad: { c: "n = 47.5\nx1 = \"Aryan\"\nTheUserAge = 30\nl = [1, 2, 3]", label: "What beginners write",
      w: "`n` of what? `x1` versus `x2`? `TheUserAge` is the wrong casing for Python. And `l` is genuinely dangerous — in most fonts a lowercase L is indistinguishable from the digit 1." },
    good: { c: "average_score = 47.5\nuser_name = \"Aryan\"\nuser_age = 30\nscores = [1, 2, 3]", label: "What Python programmers write",
      w: "Lowercase with underscores — **snake_case** — is the Python convention, laid out in the style guide called PEP 8. Every library you will ever import follows it, so following it makes your code look like it belongs." } } },
  { l: [
   "**snake_case** for variables and functions: `user_name`, `calculate_total`",
   "**SCREAMING_SNAKE_CASE** for constants — values you promise not to change: `MAX_RETRIES = 3`",
   "**PascalCase** for classes, which arrive later: `UserAccount`",
   "**A leading underscore** (`_internal`) means *this is private, do not rely on it*. A polite convention, not enforced",
   "**A bare `_`** means *I have to name this and I do not care about it*"
  ] },
  { n: "Good names are the cheapest documentation there is, and the only kind that cannot go stale. A comment saying *this is the average score* can drift out of date; a variable called `average_score` cannot. When you find yourself about to write a comment explaining what a variable holds, try renaming the variable instead.",
    nt: "Why this is worth caring about" },

  { h: "Several at once" },
  { code: { lang: "python",
    lines: [
     { c: "x, y = 10, 20", w: "**Unpacking.** Python pairs them up positionally: `x` gets 10, `y` gets 20. Very common when a function hands back two values." },
     { c: "x, y = y, x", w: "Swapping two variables in one line, with no temporary. The right side is evaluated *completely first* — producing the pair (20, 10) — and only then assigned. In most languages this needs three lines." },
     { c: "a = b = 0", w: "Both names, one value. Fine for numbers; be careful with lists, for reasons the data structures module explains." }
    ],
    out: "" } },

  { trap: "`=` assigns, `==` compares. One equals sign changes a value; two ask a question and produce `True` or `False`. Writing `if x = 5:` is a `SyntaxError` in Python — which is a genuine kindness, because in C it silently assigns and has caused real, expensive bugs. Python made that mistake impossible on purpose." },

  { tryit: { t: "Predict before you run",
    task: "Write down what this prints, then run it and see if you were right: `a = 5`, `b = a`, `a = 10`, `print(a, b)`.",
    hint: "Line two attaches `b` to the *value* `a` currently refers to, not to `a` itself. Nothing links them afterwards.",
    sol: { lang: "python", code: "a = 5\nb = a      # b now refers to 5\na = 10     # a moves to 10; b is unaffected\nprint(a, b)\n# 10 5" },
    w: "This is the whole label-not-box idea in four lines. It will matter enormously when the values are lists instead of numbers." } }
 ],
 k: [
  "`=` means *work out the right side, then attach the left-hand name to it* — never *equals*.",
  "A variable is a label on a value, not a box holding one.",
  "snake_case for variables, and never use `l`, `O` or `I` as a name.",
  "`=` assigns and `==` compares; Python makes confusing them a syntax error on purpose."
 ],
 r: ["Variable", "Assignment Operator", "Constant", "Data Type", "Scope"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "name = \"Aryan\"", w: "store the text Aryan under the name `name`", hint: "quotes make it text" },
   { c: "age = 30", w: "store the whole number 30 under the name `age`", hint: "no quotes — it is a number" },
   { c: "x = x + 5", w: "read x, add five, and store the result back in x" },
   { c: "x += 5", w: "the short form of adding five to x in place" },
   { c: "x, y = y, x", w: "swap the values of x and y in a single line" },
   { c: "MAX_RETRIES = 3", w: "define a constant you promise never to change", hint: "casing is the whole point" }
  ]
 }
},

{
 t: "Numbers and Arithmetic",
 m: "basics",
 lvl: "core",
 s: "Two kinds of number, seven operators, and the one that surprises everybody.",
 goal: [
  "Say the difference between an `int` and a `float`, and when each appears",
  "Use `//`, `%` and `**` correctly and explain what each is for",
  "Explain why `0.1 + 0.2` is not `0.3`, without alarm"
 ],
 b: [
  { p: "Python has two numeric types you will use constantly, and the difference between them causes real bugs, so it is worth ten minutes." },

  { code: { lang: "python", t: "The two types",
    lines: [
     { c: "count = 42", w: "An **int** — an integer. Whole numbers, positive or negative, no decimal point. Python integers have no size limit; `2 ** 1000` is a perfectly ordinary value here, which is unusual among languages." },
     { c: "price = 19.99", w: "A **float** — short for *floating-point*. Anything with a decimal point. The name refers to how the decimal point can move to represent very large and very small numbers with the same number of digits." },
     { c: "print(type(count), type(price))", w: "`type()` from the REPL lesson, confirming what Python decided." }
    ],
    out: "<class 'int'> <class 'float'>",
    after: "You never declare which one you want. Write a decimal point and you have a float; leave it out and you have an int. Even `5.0` is a float, and that trailing `.0` is not decorative — it changes the type." } },

  { h: "The seven operators" },
  { tbl: { h: ["Operator", "Name", "Example", "Result", "Note"],
    rows: [
     ["`+`", "Add", "`7 + 2`", "`9`", ""],
     ["`-`", "Subtract", "`7 - 2`", "`5`", ""],
     ["`*`", "Multiply", "`7 * 2`", "`14`", ""],
     ["`/`", "Divide", "`7 / 2`", "`3.5`", "**Always gives a float**, even when it divides evenly"],
     ["`//`", "Floor divide", "`7 // 2`", "`3`", "Divides and throws away the remainder"],
     ["`%`", "Modulo", "`7 % 2`", "`1`", "Gives *only* the remainder"],
     ["`**`", "Power", "`7 ** 2`", "`49`", "Not `^` — that means something else entirely in Python"]
    ] } },

  { code: { lang: "python", t: "The three that need explaining",
    lines: [
     { c: "print(7 / 2)", w: "`/` is **true division**. It gives the mathematically correct answer, which means a float. `6 / 3` is `2.0`, not `2` — a real source of surprise when a result is used as a list index later." },
     { c: "print(7 // 2)", w: "`//` is **floor division**: divide, then round *down* to the nearest whole number. Use it when a fraction is meaningless — *how many complete boxes of 12*." },
     { c: "print(7 % 2)", w: "`%` is **modulo**: the remainder left over. `7 % 2` is 1 because 2 goes into 7 three times with 1 spare." },
     { c: "print(2 ** 10)", w: "`**` raises to a power. Two to the tenth." }
    ],
    out: "3.5\n3\n1\n1024" } },

  { p: "**Modulo earns its keep** far more than it looks like it should. `n % 2 == 0` asks *is n even*. `i % 3 == 0` fires every third iteration of a loop. `total % 60` converts seconds into the leftover seconds after whole minutes. Any time something needs to wrap around or repeat on a cycle, `%` is the tool." },

  { h: "Order of operations" },
  { code: { lang: "python",
    lines: [
     { c: "print(2 + 3 * 4)", w: "Multiplication binds tighter than addition, exactly as in school arithmetic: `3 * 4` first, then add 2." },
     { c: "print((2 + 3) * 4)", w: "Brackets override it, exactly as in school arithmetic." },
     { c: "print(-2 ** 2)", w: "**The one that catches people.** `**` binds tighter than the minus sign, so this is `-(2 ** 2)`, not `(-2) ** 2`. Write the brackets when you mean the second one." }
    ],
    out: "14\n20\n-4",
    after: "The precedence rules are the ordinary mathematical ones, and the professional habit is to add brackets whenever a reader might have to stop and think. Brackets are free." } },

  { h: "Why 0.1 + 0.2 is not 0.3" },
  { code: { lang: "python", t: "Run this in the REPL right now",
    lines: [
     { c: ">>> 0.1 + 0.2", w: "It is not a Python bug, and every language that uses standard floats does this — JavaScript, Java, C, all of them." },
     { c: "0.30000000000000004" }
    ] } },
  { p: "The cause is base 2. A float is stored in binary, and one tenth cannot be written exactly in binary for the same reason one third cannot be written exactly in decimal — 0.333... never terminates. The computer stores an extremely close approximation, and when you add two approximations the tiny errors become visible." },

  { vs: { t: "So never compare floats with ==", lang: "python",
    bad: { c: "if 0.1 + 0.2 == 0.3:\n    print(\"equal\")", label: "Silently never runs",
      w: "The condition is `False`. No error, no warning — the branch simply never fires, and you spend an afternoon wondering why." },
    good: { c: "if abs((0.1 + 0.2) - 0.3) < 1e-9:\n    print(\"close enough\")", label: "Compare within a tolerance",
      w: "Subtract, take the absolute value, and ask whether the gap is smaller than something negligible. This is how float comparison is done everywhere, in every language." } } },

  { n: "For money, do not use floats at all. Use `decimal.Decimal`, which stores digits in base 10 and gets `0.1 + 0.2` exactly right, or store whole numbers of the smallest unit — count paise, not rupees. Financial systems have lost real money to accumulated float error, which is why this rule is absolute rather than advisory.",
    nt: "Money is the exception with teeth" },

  { h: "Converting between them" },
  { code: { lang: "python",
    lines: [
     { c: "int(3.9)", w: "**Truncates towards zero — it does not round.** `int(3.9)` is 3 and `int(-3.9)` is -3. This surprises people who expect 4." },
     { c: "round(3.9)", w: "*This* rounds, to the nearest whole number." },
     { c: "round(3.14159, 2)", w: "A second argument sets the decimal places." },
     { c: "float(3)", w: "The other direction, giving `3.0`." }
    ],
    out: "3\n4\n3.14\n3.0" } },
  { p: "One genuine oddity: `round(2.5)` gives 2, not 3. Python uses *banker's rounding*, which rounds a exact half to the nearest **even** number. It exists because always rounding halves up introduces a small upward bias across a large dataset. It is correct and it will still surprise you once." }
 ],
 k: [
  "`/` always produces a float; `//` divides and floors; `%` gives the remainder.",
  "`**` is power, and it binds tighter than a leading minus sign.",
  "Floats are binary approximations — never compare them with `==`, compare within a tolerance.",
  "`int()` truncates towards zero; `round()` rounds, and rounds exact halves to even."
 ],
 r: ["Integer", "Floating-Point Number", "Operator", "Precision"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "print(7 // 2)", w: "divide seven by two and throw away the remainder" },
   { c: "print(7 % 2)", w: "get only the remainder of seven divided by two" },
   { c: "print(2 ** 10)", w: "raise two to the power of ten" },
   { c: "if n % 2 == 0:", w: "start a condition testing whether n is even", hint: "modulo, then compare to zero" },
   { c: "round(3.14159, 2)", w: "round a number to two decimal places" },
   { c: "abs((0.1 + 0.2) - 0.3) < 1e-9", w: "compare two floats safely, within a tiny tolerance" }
  ]
 }
},

{
 t: "Text: Working With Strings",
 m: "basics",
 lvl: "core",
 s: "Quotes, escapes, f-strings, slicing and the twenty methods you will actually use.",
 goal: [
  "Choose the right kind of quotes, and escape a character when you need to",
  "Build text out of values using an f-string rather than clumsy concatenation",
  "Pull any piece out of a string by index or slice"
 ],
 b: [
  { p: "A **string** is a piece of text. The name is old and literal: a string of characters, threaded in order. You will handle more text than numbers in most real programs, so this lesson is longer than it looks like it should be." },

  { h: "Making one" },
  { code: { lang: "python",
    lines: [
     { c: "a = 'single quotes'", w: "Perfectly valid." },
     { c: "b = \"double quotes\"", w: "Identical in every way. Python does not distinguish. Pick one and be consistent — most formatters, including the one you turned on, standardise to double." },
     { c: "c = \"it's a quote inside\"", w: "**Why both exist.** An apostrophe inside double quotes needs no special handling." },
     { c: "d = 'she said \"hello\"'", w: "And the reverse. Choose whichever quote is *not* inside your text and the problem disappears." },
     { c: "e = \"\"\"A string that runs\nacross several lines.\"\"\"", w: "**Triple quotes** hold real line breaks. Used for long text blocks and, importantly, for documentation strings inside functions." }
    ] } },

  { h: "Escapes" },
  { p: "Sometimes you need a character the syntax has already claimed. The backslash is the escape hatch: it tells Python *the next character is data, not syntax*." },
  { tbl: { h: ["Escape", "Produces"],
    rows: [
     ["`\\n`", "A new line — the one you will use most"],
     ["`\\t`", "A tab"],
     ["`\\\"`", "A literal double quote inside double quotes"],
     ["`\\\\`", "A single literal backslash"]
    ] } },
  { trap: "Windows paths are full of backslashes, and `\"C:\\Users\\new\"` does not mean what it looks like — `\\U` and `\\n` are escapes, so this is broken text and possibly a syntax error. Fix it with a **raw string**: `r\"C:\\Users\\new\"`. The `r` prefix means *treat every backslash literally*. Alternatively use forward slashes, which Python accepts on Windows too." },

  { h: "Joining text and values" },
  { p: "You will constantly need to build a sentence out of a fixed part and a variable part. There are three ways, and only one is worth using." },
  { code: { lang: "python", t: "The same output, three generations of syntax",
    lines: [
     { c: "name, age = \"Aryan\", 30", w: "Two values to work with." },
     { c: "", w: "" },
     { c: "print(\"Hi \" + name + \", age \" + str(age))", w: "**Concatenation.** Works, but note `str(age)` — `+` between text and a number is a `TypeError`, so every number needs converting by hand. Fiddly and easy to get wrong." },
     { c: "print(\"Hi {}, age {}\".format(name, age))", w: "**`.format()`**, the older middle generation. Better, but the values are far from the placeholders, so long lines become hard to read." },
     { c: "print(f\"Hi {name}, age {age}\")", w: "**An f-string.** The `f` before the quote lets you write any expression inside `{ }` and Python substitutes its value. Shorter, faster, and the value sits where it will appear.", hi: true }
    ],
    out: "Hi Aryan, age 30\nHi Aryan, age 30\nHi Aryan, age 30",
    after: "Use f-strings. They arrived in Python 3.6 and there is essentially no reason to reach for the others in new code." } },

  { syn: { t: "An f-string with formatting",
    parts: [
     { p: "f", w: "The prefix that turns an ordinary string into an f-string. Forget it and you get the literal text `{price}` printed out — the single most common f-string mistake." },
     { p: "\"Total: " },
     { p: "{", w: "Opens a substitution. Everything until the closing brace is **real Python**, evaluated right there." },
     { p: "price * 1.18", w: "Any expression at all — arithmetic, a function call, a lookup. Keep it short; complex logic belongs on its own line above." },
     { p: ":", w: "Separates the expression from a **format specification**. Optional." },
     { p: ".2f", w: "The format: `f` for fixed-point, `.2` for two decimal places. Also useful: `,` for thousands separators, `>10` to pad to width 10, `.1%` for a percentage." },
     { p: "}", w: "Closes the substitution." },
     { p: "\"" }
    ],
    after: "`f\"Total: {price * 1.18:.2f}\"` with `price = 100` gives `Total: 118.00`. Combine them: `{value:>12,.2f}` right-aligns in twelve characters with thousands separators and two decimals — which is how you print a readable table." } },

  { h: "Reaching inside" },
  { p: "A string is a sequence, so you can pull characters out by position. Positions start at **zero** — the first character is at index 0. That convention is universal across almost every language, and it exists because an index is really an *offset from the start*." },
  { code: { lang: "python",
    lines: [
     { c: "word = \"Python\"", w: "Six characters, at positions 0 to 5." },
     { c: "print(word[0])", w: "Square brackets index. Position 0 is the **first** character." },
     { c: "print(word[-1])", w: "**Negative indices count from the end.** -1 is the last character, -2 the second to last. This saves you writing `word[len(word) - 1]` constantly." },
     { c: "print(word[0:3])", w: "A **slice**: from index 0 up to *but not including* 3. So characters 0, 1 and 2." },
     { c: "print(word[:3])", w: "Leave out the start and it means *from the beginning*." },
     { c: "print(word[3:])", w: "Leave out the end and it means *to the very end*." },
     { c: "print(word[::-1])", w: "A third number is the **step**. Minus one walks backwards, which reverses the string — a famous Python one-liner." }
    ],
    out: "P\nn\nPyt\nPyt\nhon\nnohtyP" } },
  { n: "The end of a slice is *exclusive* — `word[0:3]` gives three characters, not four. That looks arbitrary and is deliberate: it means `word[:n]` and `word[n:]` split cleanly with nothing lost or duplicated, and the length of `a[i:j]` is exactly `j - i`. Both conveniences fall out of the same choice.",
    nt: "Why the end is excluded" },

  { h: "The methods worth knowing" },
  { code: { lang: "python", t: "A method is a function that belongs to a value — call it with a dot",
    lines: [
     { c: "s = \"  Hello World  \"", w: "Deliberately messy, the way real input arrives." },
     { c: "print(s.strip())", w: "Removes whitespace from both ends. **Use this on every piece of input you ever receive** — trailing spaces from a form or a file cause an astonishing amount of confusion." },
     { c: "print(s.lower())", w: "All lowercase. The standard move before comparing two strings, so `\"Yes\"` and `\"yes\"` match." },
     { c: "print(s.replace(\"World\", \"Aryan\"))", w: "Every occurrence of the first replaced by the second." },
     { c: "print(\"a,b,c\".split(\",\"))", w: "**`split` cuts a string into a list** at each separator. This is how you read a line of CSV." },
     { c: "print(\"-\".join([\"a\", \"b\", \"c\"]))", w: "**`join` is the exact opposite** — glue a list back together with this string between each pair. The backwards-looking order (`separator.join(list)`) catches everyone once." },
     { c: "print(\"hello\".startswith(\"he\"))", w: "A yes-or-no question, giving `True` or `False`. `endswith` and `in` work the same way." }
    ],
    out: "Hello World\n  hello world  \n  Hello Aryan  \n['a', 'b', 'c']\na-b-c\nTrue" } },

  { trap: "**Strings are immutable.** No method changes the string it was called on — every one returns a *new* string and leaves the original alone. So `s.strip()` on its own does nothing useful; you must write `s = s.strip()` to keep the result. This is the most common string mistake there is, and it applies to `.lower()`, `.replace()` and every other method on this list." },

  { tryit: { t: "Clean up a real line",
    task: "You have the line `\"  aryan , 30 , mumbai \\n\"`. Turn it into a list of three clean pieces with no spaces around them, all lowercase.",
    hint: "Strip the whole line first, then split on the comma, then strip each piece. A list comprehension does the last step in one line, but a loop is perfectly fine for now.",
    sol: { lang: "python", code: "line = \"  aryan , 30 , mumbai \\n\"\nparts = [p.strip().lower() for p in line.strip().split(\",\")]\nprint(parts)\n# ['aryan', '30', 'mumbai']" },
    w: "That is genuinely what reading a CSV by hand looks like, and it is roughly the first thing you will do with a real data file." } }
 ],
 k: [
  "Single and double quotes are identical — pick the one that is not inside your text.",
  "f-strings are the way to build text from values; `{value:.2f}` formats as you go.",
  "Indexing starts at 0, negative counts from the end, and the end of a slice is excluded.",
  "Strings are immutable: every method returns a new string, so you must assign the result."
 ],
 r: ["String", "Immutability", "Zero-Based Indexing", "Escape Character"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "print(f\"Hi {name}, age {age}\")", w: "print a greeting with two values dropped into the text", hint: "the prefix before the quote matters" },
   { c: "f\"Total: {price:.2f}\"", w: "format a price to exactly two decimal places inside a string" },
   { c: "s = s.strip()", w: "remove whitespace from both ends and keep the result", hint: "strings are immutable" },
   { c: "print(word[::-1])", w: "reverse a string using a slice with a negative step" },
   { c: "parts = line.split(\",\")", w: "cut a line into a list at every comma" },
   { c: "\"-\".join(parts)", w: "glue a list of strings back together with dashes between them", hint: "the separator comes first" }
  ]
 }
},

{
 t: "True, False, None and Truthiness",
 m: "basics",
 lvl: "core",
 s: "The two-value type that every decision in every program rests on.",
 goal: [
  "Use the comparison and logical operators correctly",
  "Explain what `None` is and why it is not zero or empty",
  "Predict whether any value counts as true in a condition"
 ],
 b: [
  { p: "Every `if`, every `while`, every filter you will ever write ultimately comes down to one value that is either `True` or `False`. This lesson is that value." },

  { code: { lang: "python", t: "The type with exactly two members",
    lines: [
     { c: "is_active = True", w: "Capital T. `true` in lowercase is a `NameError` — Python is not JavaScript." },
     { c: "is_deleted = False", w: "Capital F, likewise. This is a **bool**, named after George Boole." },
     { c: "print(type(is_active))" }
    ],
    out: "<class 'bool'>" } },

  { h: "Comparisons produce booleans" },
  { tbl: { h: ["Operator", "Asks", "Example", "Result"],
    rows: [
     ["`==`", "Are these equal?", "`5 == 5`", "`True`"],
     ["`!=`", "Are these different?", "`5 != 3`", "`True`"],
     ["`>` `<`", "Greater / less than", "`5 > 3`", "`True`"],
     ["`>=` `<=`", "Greater / less than or equal", "`5 >= 5`", "`True`"],
     ["`in`", "Is this inside that?", "`\"a\" in \"cat\"`", "`True`"],
     ["`is`", "Are these the *same object*?", "`x is None`", "depends"]
    ] } },
  { p: "Python allows something most languages do not: **chained comparisons**. `if 0 < age < 120:` is legal, means exactly what it reads as, and is genuinely nicer than `if age > 0 and age < 120:`." },

  { h: "Combining conditions" },
  { code: { lang: "python", t: "Python spells these as words, on purpose",
    lines: [
     { c: "age, has_ticket = 25, True", w: "Two facts to reason about." },
     { c: "", w: "" },
     { c: "print(age >= 18 and has_ticket)", w: "**`and`** — true only when *both* sides are true. Other languages write `&&`; Python chose the readable word." },
     { c: "print(age >= 65 or has_ticket)", w: "**`or`** — true when *at least one* side is true." },
     { c: "print(not has_ticket)", w: "**`not`** flips a boolean." },
     { c: "print(age >= 18 and (has_ticket or age >= 65))", w: "Brackets group them, exactly as in arithmetic. `not` binds tightest, then `and`, then `or` — but use brackets rather than relying on that." }
    ],
    out: "True\nTrue\nFalse\nTrue" } },

  { n: "`and` and `or` **short-circuit**: they stop as soon as the answer is certain. In `a and b`, if `a` is false, `b` is never evaluated at all. This is not a performance detail — it is a technique. `if user is not None and user.name == \"Aryan\":` is safe precisely because the second half never runs when `user` is `None`, which would otherwise crash.",
    nt: "Short-circuiting is a tool, not a trick" },

  { h: "None" },
  { p: "`None` is Python's way of saying *there is no value here*. It is not zero, not an empty string, and not `False` — it is a distinct thing meaning **nothing**, and the distinction genuinely matters." },
  { code: { lang: "python",
    lines: [
     { c: "score = 0", w: "A real score, which happens to be zero. The test was taken and the result was nought." },
     { c: "score = None", w: "**No score at all.** The test was not taken. Same variable, completely different meaning — and this difference is why `None` exists." },
     { c: "", w: "" },
     { c: "if score is None:", w: "**Always use `is` with `None`, never `==`.** `is` asks *are these literally the same object in memory*, and there is exactly one `None` in a running Python program, so the check is exact and fast." },
     { c: "    print(\"not taken\")" }
    ],
    out: "not taken" } },
  { p: "You meet `None` constantly without asking for it. A function with no `return` statement gives back `None`. A dictionary lookup that misses can give `None`. A database column with no value arrives as `None`. Getting `AttributeError: 'NoneType' object has no attribute ...` means you got `None` where you expected something real — and it is one of the most frequent errors in Python." },

  { h: "Truthiness" },
  { p: "Python lets you put *any* value where a condition is expected, and it works out whether that value counts as true. The rule is simple and worth memorising exactly." },
  { tbl: { t: "Everything falsy in Python. Everything else is truthy.",
    h: ["Falsy", "Why"],
    rows: [
     ["`False`", "The boolean itself"],
     ["`None`", "Nothing there"],
     ["`0`, `0.0`", "Zero of any numeric type"],
     ["`\"\"`", "The empty string"],
     ["`[]`, `{}`, `()`, `set()`", "Any empty collection"]
    ] } },
  { p: "That is the complete list. **Every other value is truthy**, including `\"False\"` as text, `\"0\"` as text, `-1`, and `[0]` — a list containing one zero is not empty, so it is true." },

  { vs: { t: "Checking whether a list has anything in it", lang: "python",
    bad: { c: "if len(items) > 0:\n    process(items)", label: "Correct, but noisy",
      w: "Nothing wrong with it. It is simply not how Python is written." },
    good: { c: "if items:\n    process(items)", label: "Idiomatic",
      w: "Reads as *if there are items*. An empty list is falsy, so this is exactly equivalent — and it also works for strings, dictionaries and sets without changing." } } },

  { trap: "Truthiness and `None` are not the same test, and confusing them is a real bug. `if count:` is false when `count` is `None` **and also** when `count` is `0` — so a genuine zero gets treated as missing data. When you specifically mean *was a value supplied*, write `if count is not None:`. This exact mistake silently drops zeros out of datasets." },

  { tryit: { t: "Predict all six",
    task: "Say what each of these prints before running: `bool(0)`, `bool(\"\")`, `bool(\"0\")`, `bool([])`, `bool([0])`, `bool(None)`.",
    hint: "Two of them are the surprising ones. Look at the falsy list and ask whether the value is *literally* on it.",
    sol: { lang: "python", code: "print(bool(0))       # False\nprint(bool(\"\"))      # False\nprint(bool(\"0\"))     # True  — a non-empty string\nprint(bool([]))      # False\nprint(bool([0]))     # True  — a list with one item in it\nprint(bool(None))    # False" },
    w: "`\"0\"` and `[0]` are the two that catch people. Both are non-empty containers; what they contain is irrelevant." } }
 ],
 k: [
  "`True` and `False` are capitalised, and comparisons produce them.",
  "`and`, `or`, `not` are words in Python, and `and`/`or` short-circuit — which you can rely on deliberately.",
  "`None` means *no value*, is distinct from 0 and `\"\"`, and is always tested with `is`.",
  "Falsy: `False`, `None`, zero, empty string, empty collection. Everything else is truthy."
 ],
 r: ["Boolean", "NULL", "Operator", "Truthy and Falsy", "Conditional"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "if score is None:", w: "test whether a variable holds no value at all", hint: "not ==" },
   { c: "if 0 < age < 120:", w: "check a number falls between two bounds, in one chained comparison" },
   { c: "if age >= 18 and has_ticket:", w: "require two conditions to both be true" },
   { c: "if items:", w: "the idiomatic way to ask whether a list has anything in it" },
   { c: "if count is not None:", w: "check a value was supplied, without treating zero as missing" }
  ]
 }
},

{
 t: "Input, Output and Converting Types",
 m: "basics",
 lvl: "core",
 s: "Talking to the person running your program — and the conversion everyone forgets.",
 goal: [
  "Control exactly how `print` formats what it shows",
  "Read input from a user and convert it to the type you need",
  "Explain why `input()` always gives you text, even when they typed a number"
 ],
 b: [
  { p: "The first module said every program is input, processing and output. You have been doing processing. These are the other two." },

  { h: "print, properly" },
  { code: { lang: "python", t: "It does more than you think",
    lines: [
     { c: "print(\"a\", \"b\", \"c\")", w: "Several values at once. **Python inserts a space between them automatically** — that is `print`'s default separator, not something in your data." },
     { c: "print(\"a\", \"b\", sep=\"\")", w: "`sep` changes it. An empty string joins them with nothing." },
     { c: "print(\"a\", \"b\", sep=\" | \")", w: "Or anything you like. Useful for quick tabular output." },
     { c: "print(\"loading\", end=\"\")", w: "`end` is what goes *after* everything — a newline by default. Setting it to nothing keeps the cursor on the same line, so the next `print` continues it. This is how progress indicators work." },
     { c: "print(\"...done\")", w: "Which lands on the same line as the one above." }
    ],
    out: "a b c\nab\na | b\nloading...done" } },
  { p: "`sep` and `end` are **keyword arguments** — named settings with sensible defaults that you override only when you need to. You will meet the idea properly in the functions module; the pattern is everywhere in Python." },

  { h: "input" },
  { code: { lang: "python",
    lines: [
     { c: "name = input(\"What is your name? \")", w: "Prints the prompt, then **stops the entire program** and waits until the user types something and presses Enter. Whatever they typed comes back as the result." },
     { c: "print(f\"Hello, {name}\")", w: "Nothing after `input` runs until they answer." }
    ],
    out: "What is your name? Aryan\nHello, Aryan",
    after: "Put a trailing space at the end of your prompt. Without it the user's typing butts straight against your question and it looks broken." } },

  { h: "The mistake everybody makes, once" },
  { code: { lang: "python", t: "Run this and watch it fail",
    lines: [
     { c: "age = input(\"Your age? \")", w: "The user types `30`." },
     { c: "print(age + 1)", w: "And this raises `TypeError: can only concatenate str (not \"int\") to str`.", hi: true }
    ],
    out: "TypeError: can only concatenate str (not \"int\") to str" } },
  { p: "**`input()` always returns a string. Always.** It cannot do otherwise — it has no way to know whether `30` is a quantity, a house number or a code. So it hands back the characters `\"30\"` and leaves the interpretation to you. Adding 1 to a piece of text is meaningless, and Python says so." },

  { vs: { t: "The fix", lang: "python",
    bad: { c: "age = input(\"Your age? \")\nprint(age + 1)", label: "TypeError",
      w: "`age` holds the text `\"30\"`, not the number 30." },
    good: { c: "age = int(input(\"Your age? \"))\nprint(age + 1)", label: "Converted at the door",
      w: "`int()` turns the text into a whole number. Reading it inside-out: `input` runs first, produces text, `int` converts it, and the result is stored. Convert at the moment data enters your program, never later." } } },

  { h: "The conversion functions" },
  { tbl: { h: ["Call", "Turns", "Into", "Fails when"],
    rows: [
     ["`int(x)`", "`\"30\"`, `30.9`", "`30`", "The text is not a whole number — `int(\"3.5\")` raises `ValueError`"],
     ["`float(x)`", "`\"3.14\"`, `3`", "`3.14`, `3.0`", "The text is not numeric at all"],
     ["`str(x)`", "`30`, `3.14`, `True`", "`\"30\"`, `\"3.14\"`, `\"True\"`", "Essentially never"],
     ["`bool(x)`", "anything", "`True` / `False`", "Never — uses the truthiness rules"]
    ] } },
  { trap: "`int(\"3.5\")` raises `ValueError`, which surprises people who expect it to round or truncate. `int` parses *whole numbers written as text* and `\"3.5\"` is not one. If the text might have a decimal point, go through float first: `int(float(\"3.5\"))` gives 3." },

  { h: "Handling input that is not what you asked for" },
  { p: "A user will eventually type `thirty`, and `int(\"thirty\")` raises `ValueError` and stops your program dead. The errors module covers this properly; here is the shape so you recognise it." },
  { code: { lang: "python",
    lines: [
     { c: "raw = input(\"Your age? \")", w: "Take it as text first, without assuming." },
     { c: "if raw.isdigit():", w: "`isdigit()` asks whether every character is a digit — a check *before* converting, rather than an error after." },
     { c: "    age = int(raw)", w: "Safe now." },
     { c: "    print(f\"Next year you are {age + 1}\")" },
     { c: "else:", w: "" },
     { c: "    print(\"That is not a number.\")", w: "Handle it deliberately instead of crashing." }
    ],
    out: "Your age? thirty\nThat is not a number." } },

  { n: "`input()` is how you learn interactive programs and it is not how real ones get their data. Real input arrives from a file, an HTTP request, a database or a command-line argument. But the lesson transfers exactly: **data arriving from outside your program is always text until you convert it, and never trustworthy until you have checked it.** That single sentence prevents an entire category of bug, and a fair number of security holes.",
    nt: "Where input really comes from" },

  { tryit: { t: "A tiny calculator",
    task: "Ask the user for two numbers and print their sum, difference, product and quotient, each on its own line, with the division shown to two decimal places.",
    hint: "Two `float(input(...))` calls, then four f-strings. `{value:.2f}` handles the formatting.",
    sol: { lang: "python", code: "a = float(input(\"First number: \"))\nb = float(input(\"Second number: \"))\n\nprint(f\"{a} + {b} = {a + b}\")\nprint(f\"{a} - {b} = {a - b}\")\nprint(f\"{a} * {b} = {a * b}\")\nprint(f\"{a} / {b} = {a / b:.2f}\")" },
    w: "That is a complete program with input, processing and output — the three things from the very first lesson, in seven lines." } }
 ],
 k: [
  "`print` takes `sep` and `end` to control what goes between values and after them.",
  "`input()` always returns a string, no matter what the user typed.",
  "Convert at the point data enters your program: `int(input(...))`, not later.",
  "`int(\"3.5\")` is a `ValueError` — go via `float` when a decimal point is possible."
 ],
 r: ["Standard Input and Output", "Type Inference", "String", "Exception"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "name = input(\"What is your name? \")", w: "ask the user a question and store their reply" },
   { c: "age = int(input(\"Your age? \"))", w: "ask for a number and convert it to an integer immediately" },
   { c: "print(\"loading\", end=\"\")", w: "print without moving to the next line" },
   { c: "print(\"a\", \"b\", sep=\" | \")", w: "print two values separated by a pipe instead of a space" },
   { c: "if raw.isdigit():", w: "check text is all digits before trying to convert it" }
  ]
 }
},

{
 t: "Comments and Writing for the Next Reader",
 m: "basics",
 lvl: "core",
 s: "The part of the file the computer ignores, and why it decides whether your code survives.",
 goal: [
  "Write a comment that earns its place",
  "Recognise the comments that make code worse",
  "Use a docstring to describe what a function is for"
 ],
 b: [
  { p: "A **comment** is text Python ignores completely. It exists purely for humans. That makes it the only part of a file where you can say something the code cannot, and the only part that can be *wrong* without anything catching it." },

  { code: { lang: "python", t: "The syntax, which is all of it",
    lines: [
     { c: "# This whole line is ignored.", w: "A `#` and everything after it on that line is invisible to Python." },
     { c: "total = price * 1.18  # tax included", w: "It can also follow code. Two spaces before the `#` is the convention." },
     { c: "# print(\"debugging\")", w: "**Commenting out** — disabling a line without deleting it. `Ctrl + /` in VS Code toggles this on whatever you have selected, and you will use it constantly." }
    ] } },
  { p: "Python has no dedicated multi-line comment syntax. People use a triple-quoted string, which technically creates a string that is immediately discarded, but it works and everyone does it." },

  { h: "The rule: comment why, not what" },
  { p: "This is the whole lesson. The code already says *what* it does — it is right there. What the code cannot say is why you did it that way, what you tried first, or what will break if someone tidies it." },

  { vs: { t: "The same line, two comments", lang: "python",
    bad: { c: "# add 1 to the counter\ncounter = counter + 1\n\n# loop through the users\nfor user in users:", label: "Noise",
      w: "Both restate the code in English. They add nothing, they take up space, and worse — when someone changes the code and forgets the comment, the comment becomes an active lie." },
    good: { c: "# The API is 1-indexed, ours is 0-indexed\ncounter = counter + 1\n\n# Sorted by signup date: the migration\n# below depends on this order\nfor user in users:", label: "Worth its space",
      w: "Neither could be worked out from the code. The first explains a constraint imposed from outside; the second warns the next person that reordering will break something twenty lines down." } } },

  { l: [
   "**Comment the surprising.** If a reasonable reader would ask *why on earth is it done this way*, answer them.",
   "**Comment the external.** A magic number from a specification, a workaround for a library bug, an API's quirk. Link the source.",
   "**Comment the dangerous.** *Do not reorder these two lines* has saved more production systems than any test.",
   "**Do not comment the obvious.** If the code is unclear, the fix is usually a better name, not an explanation."
  ] },

  { n: "A comment that contradicts the code is worse than no comment, because a reader will believe it. Code cannot lie — it does whatever it does — but a comment can be wrong for years. This asymmetry is why experienced engineers write fewer comments than beginners expect, and put much more effort into naming.",
    nt: "Why comments rot" },

  { h: "Docstrings" },
  { p: "A **docstring** is different. It is a triple-quoted string placed as the very first thing inside a function, class or file, and Python keeps it — it is what `help()` reads out in the REPL." },
  { code: { lang: "python", file: "geometry.py",
    lines: [
     { c: "def area(width, height):", w: "The function definition." },
     { c: "    \"\"\"Return the area of a rectangle.", w: "**First thing in the body**, in triple quotes. Line one is a single-sentence summary written as a command — *Return the area*, not *This function returns*. That is the documented convention." },
     { c: "", w: "" },
     { c: "    Both dimensions must be positive; negative", w: "A blank line, then any detail worth having. Constraints, edge cases, what it does with bad input." },
     { c: "    values raise a ValueError.", w: "" },
     { c: "    \"\"\"", w: "Closing triple quotes." },
     { c: "    return width * height" }
    ],
    after: "Now `help(area)` in the REPL prints that text, and hovering over a call to `area` in VS Code shows it in a tooltip. A comment cannot do either — this is the practical difference between the two." } },

  { h: "Two conventions you will meet in real code" },
  { code: { lang: "python",
    lines: [
     { c: "# TODO: handle the empty case", w: "Something known to be missing. Editors highlight `TODO` and can list every one in a project." },
     { c: "# FIXME: breaks when the list is empty", w: "Something known to be broken. Stronger than TODO." },
     { c: "# HACK: the API returns 200 on failure,", w: "An acknowledged compromise. Being honest about these is a mark of a good engineer, not a bad one." },
     { c: "#       so we check the body instead" }
    ] } },

  { tryit: { t: "Improve some comments",
    task: "Take this and rewrite it so the comments earn their place — or remove them and rename things instead.\n\n`# set x to 100`\n`x = 100`\n`# loop`\n`for i in d:`\n`    # add to t`\n`    t = t + d[i]`",
    hint: "Almost every comment here should become a better variable name. Only one piece of genuine information is missing from the code, and it is about *why* 100.",
    sol: { lang: "python", code: "# The API rejects batches larger than 100\nBATCH_LIMIT = 100\n\ntotal = 0\nfor item_id in daily_counts:\n    total = total + daily_counts[item_id]" },
    w: "Five comments became one, and it is the only one carrying information that is not in the code. Everything else was solved by naming." } }
 ],
 k: [
  "`#` comments out the rest of the line; `Ctrl + /` toggles it in VS Code.",
  "Comment *why*, never *what* — the code already says what.",
  "A comment that contradicts the code is worse than none, because readers believe it.",
  "A docstring is the first triple-quoted string in a function, and it is what `help()` shows."
 ],
 r: ["Comment", "Docstring", "Technical Debt", "Code Review"],
 drill: {
  lang: "python",
  reps: 2,
  items: [
   { c: "total = price * 1.18  # tax included", w: "a line of code with a trailing comment", hint: "two spaces before the hash" },
   { c: "\"\"\"Return the area of a rectangle.\"\"\"", w: "a one-line docstring written as a command", hint: "triple quotes" },
   { c: "# TODO: handle the empty case", w: "flag something known to be missing" }
  ]
 }
}

]);
