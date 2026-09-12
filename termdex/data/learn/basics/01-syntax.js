/* Programming Basics — what syntax actually is. */
TD.addLessons("basics", [

{
 t: "What Syntax Actually Is",
 m: "syntax",
 lvl: "core",
 s: "Why the computer rejects a missing bracket, and what it is really reading when it reads your file.",
 goal: [
  "Say what a token is and name the five kinds",
  "Explain why a syntax error stops the whole file, not just the broken line",
  "Stop taking punctuation errors personally"
 ],
 b: [
  { p: "You have been told that programming languages are *fussy*. That is true, and it is the single most demoralising thing about the first month, because the fussiness looks arbitrary. A missing bracket produces a wall of red text. A capital letter in the wrong place produces nothing at all. It feels like the machine is looking for reasons to refuse you." },
  { p: "It is not. There is a precise, small, learnable reason, and once you have it the red text stops feeling like judgement and starts feeling like a spell-checker." },

  { h: "The machine reads in two passes, not one" },
  { p: "Before your program runs, something reads the text you wrote and tries to understand its structure. That reader does two jobs in order, and both of them happen before a single instruction executes." },
  { ol: [
   "**Tokenising.** Chop the raw text into the smallest meaningful pieces — the words, symbols and numbers. Whitespace mostly disappears here; it was only ever there to separate things.",
   "**Parsing.** Take that stream of pieces and check it forms a legal sentence in the language's grammar. Does an `if` have a condition? Does every opening bracket get closed? Does this thing that looks like a function call actually have a function in front of it?"
  ] },
  { p: "**Syntax** is the grammar checked in step two. It is not about meaning, it is about shape. `let total = ;` is perfectly meaningless *and* syntactically illegal. `let total = 0;` is legal, and whether it is *sensible* is a question nobody has asked yet." },

  { dg: "code-anatomy" },

  { h: "The five kinds of token" },
  { p: "Every language on earth builds lines out of the same five categories. Learn them once and you can look at unfamiliar code and at least know which part is which." },

  { tbl: { t: "What each piece of a line is",
    h: ["Kind", "What it is", "Examples", "Can you rename it?"],
    rows: [
     ["**Keyword**", "A word the language has reserved for itself. It always means the same thing.", "`if`, `else`, `while`, `return`, `function`, `class`", "No. Ever."],
     ["**Identifier**", "A name *you* invented for something — a variable, a function, a type.", "`total`, `userName`, `calculateTax`", "Yes. That is the whole point of it."],
     ["**Literal**", "A value written out directly in the source, exactly as it is.", "`42`, `3.14`, `\"hello\"`, `true`", "It is not a name; it is the value itself."],
     ["**Operator**", "A symbol that does something to values.", "`+`, `-`, `*`, `=`, `==`, `&&`, `<`", "No."],
     ["**Punctuation**", "Structure, not meaning. Marks where things start, end and separate.", "`( )`, `{ }`, `[ ]`, `,`, `;`, `:`", "No."]
    ] } },

  { p: "Read that table again with a line of code in front of you and something clicks: the only part of a program you get to choose the spelling of is the identifiers. Everything else is fixed vocabulary. Which means the language is far smaller than it looks — most languages have between thirty and fifty keywords, total, and you will use about fifteen of them daily." },

  { ana: "Syntax is spelling and grammar; **semantics** is meaning. *The green idea sleeps furiously* is grammatically perfect English and complete nonsense. A compiler will happily accept the programming equivalent — code that parses beautifully and computes the wrong number — because checking grammar is easy and checking meaning is impossible. That gap is where every interesting bug lives.",
    at: "Grammar versus sense" },

  { h: "Why one missing bracket breaks everything" },
  { p: "This is the part that seems unfair, so here is the mechanism." },
  { p: "When you open a bracket, the parser makes a note: *something is open, keep reading until it closes*. If you never close it, the parser keeps reading — through the rest of your function, through the next function, all the way to the end of the file — still waiting. It then reports a failure at the last line, because that is where it finally ran out of file, even though the actual mistake was two hundred lines earlier." },

  { vs: { t: "The same mistake, and where it gets reported",
    bad: { label: "What you wrote (line 4)",
      c: "total = sum(prices\nprint(total)\n\n# ...300 more lines...",
      w: "The bracket after `prices` is never closed. The parser assumes `print(total)` and everything after it is still part of that argument list." },
    good: { label: "What the error says",
      c: "SyntaxError: unexpected EOF\n  at line 304",
      w: "`EOF` means *end of file*. It got to the bottom still waiting. **The reported line is where it gave up, not where you went wrong.**" }
  } },

  { trap: "When a syntax error points at a line that looks completely fine, the mistake is almost always on the line **above** it, or at an unclosed bracket or quote further up. Look up, not at. Most editors will grey out or highlight the unmatched bracket for you — that is what that feature is for, and it is worth learning where it lives in yours." },

  { h: "Different punctuation, identical ideas" },
  { p: "Here is the same trivial program in three languages. Look at how much of the difference is decoration." },

  { code: { lang: "text", t: "One idea, three costumes",
    lines: [
     { c: "# Python", w: "No braces, no semicolons. Indentation marks the block and a colon opens it." },
     { c: "if score > 90:", w: "" },
     { c: "    print(\"top marks\")", w: "" },
     { c: "" },
     { c: "// JavaScript", w: "Braces mark the block. Brackets are required around the condition." },
     { c: "if (score > 90) {", w: "" },
     { c: "  console.log(\"top marks\");", w: "" },
     { c: "}", w: "" },
     { c: "" },
     { c: "// Java", w: "Same as JavaScript, plus a class and a method wrapped around it that we have cropped." },
     { c: "if (score > 90) {", w: "" },
     { c: "    System.out.println(\"top marks\");", w: "" },
     { c: "}", w: "" }
    ],
    after: "Three languages, three punctuations, one idea: *check a condition, and if it holds, print something*. The idea is the thing you are learning in this track. The punctuation is a fortnight's habit in whichever language you pick." } },

  { n: "You will hear people argue passionately about braces versus indentation, or semicolons versus none. It is a real argument with real ergonomics behind it, and it matters roughly ten per cent as much as the volume suggests. Nobody has ever failed to ship software because of the brace style. Pick a language for what it is good at, not for its punctuation.",
    nt: "The syntax wars" },

  { h: "The practical upshot" },
  { l: [
   "A syntax error means **nothing ran**. Not one line. The file never made it past the grammar check, so there is no half-finished state to worry about.",
   "That is genuinely good news: syntax errors are the safest kind. They are caught before anything can go wrong, and they always tell you a line number that is at worst slightly late.",
   "You will stop making them. Within a month of daily writing, syntax becomes muscle memory and you will type the closing bracket at the same moment as the opening one, without thinking about it.",
   "Your editor will catch most of them before you even run the file. Set that up early — it is the highest-value ten minutes in the Ground Zero track."
  ] },

  { tryit: { t: "Spot the syntax error",
    task: "Three of these four lines will not parse. Find the problem in each — and say which *kind* of token is wrong.",
    hint: "Count the brackets. Count the quotes. Both have to be even.",
    sol: { lang: "text", code: "1.  print(\"hello)          -> quote never closed (literal)\n2.  if x > 5 print(x)      -> missing colon/braces (punctuation)\n3.  total = = 5            -> two operators in a row (operator)\n4.  my_total = 5           -> perfectly fine" },
    w: "Line 4 was the legal one. Notice that none of these errors is about *meaning* — the parser has no idea what any of it is for, and does not need to." } },

  { vocab: ["Syntax", "Syntax Error", "Parser", "Compiler", "Interpreter"] }
 ],
 k: [
  "Syntax is grammar, not meaning. Legal code can still be completely wrong.",
  "Every line is tokens of five kinds: keywords, identifiers, literals, operators, punctuation. Only identifiers are yours to name.",
  "A syntax error means nothing at all ran — which makes it the safest and most honest kind of error.",
  "When the reported line looks fine, the real mistake is above it: an unclosed bracket or quote."
 ],
 r: ["Syntax", "Syntax Error", "Parser", "Compiler", "Interpreter", "Abstract Syntax Tree"]
},

{
 t: "Statements and Expressions",
 m: "syntax",
 lvl: "core",
 s: "The two things every line of code can be, and why telling them apart makes code readable.",
 goal: [
  "Say whether a piece of code is an expression or a statement",
  "Explain what it means for an expression to *evaluate*",
  "Read a nested expression from the inside out, the way the machine does"
 ],
 b: [
  { p: "Everything you will ever write is one of two things, or made of them. Getting this distinction early saves a surprising amount of confusion later, because most of the times a beginner writes something that *looks* right and does nothing, it is this." },

  { h: "An expression becomes a value" },
  { p: "An **expression** is any piece of code that has an answer. You do not run an expression for its effect; you run it to find out what it equals. When it finishes, it has collapsed into exactly one value, and that value can be used anywhere a value is allowed." },
  { l: [
   "`7` is an expression. Its value is 7. (A literal is the simplest possible expression.)",
   "`3 + 4` is an expression. Its value is 7.",
   "`price * quantity` is an expression. Its value depends on those two names.",
   "`age >= 18` is an expression. Its value is `true` or `false` — still a value.",
   "`getUserName()` is an expression. Its value is whatever that function hands back."
  ] },
  { p: "The word for *working out what an expression equals* is **evaluate**. When you read `total = (2 + 3) * price`, the machine evaluates the right-hand side down to a single number before it does anything else at all." },

  { dg: "stmt-expr" },

  { h: "A statement makes something happen" },
  { p: "A **statement** is an instruction. It is a complete unit of *doing*: store this, print that, go round again, stop. Statements do not have values — asking *what does `total = 5` equal?* is not a meaningful question in most languages. It equals nothing. It **does** something." },
  { l: [
   "`total = 5` — an assignment statement. Effect: a name now points at a value.",
   "`print(total)` — a call used as a statement. Effect: something appears on the screen.",
   "`if score > 90: ...` — a conditional statement. Effect: some code runs and some does not.",
   "`return result` — a return statement. Effect: this function ends and hands a value back.",
   "`while queue: ...` — a loop statement. Effect: a block runs repeatedly."
  ] },

  { p: "Notice that statements almost always **contain** expressions. `if score > 90:` is a statement, and `score > 90` inside it is an expression that must be evaluated first to decide what the statement does. That nesting is the normal shape of code: statements on the outside, expressions filling their holes." },

  { syn: { t: "One line, both things at once",
    parts: [
     { p: "total", w: "An **identifier** — the name being assigned to. This is the target of the statement." },
     { p: " " },
     { p: "=", w: "The assignment **operator**. Everything to the left is a destination; everything to the right is an expression to evaluate. This is what makes the line a statement." },
     { p: " " },
     { p: "(price + tax)", w: "An **expression**, in brackets so it goes first. It evaluates down to one number." },
     { p: " * " },
     { p: "quantity", w: "Another expression — a name, which evaluates to whatever value it currently holds." }
    ],
    after: "The whole right-hand side is one expression made of smaller ones. The whole line is a statement. Both are true at the same time and neither contradicts the other." } },

  { h: "Reading nested expressions from the inside out" },
  { p: "Deeply nested code looks intimidating until you know it is read like arithmetic homework: innermost brackets first, working outwards. Nothing else is going on." },

  { code: { lang: "text", t: "Peeling it, one layer at a time",
    lines: [
     { c: "average = round(sum(scores) / len(scores), 2)", w: "The finished line. Four operations hiding inside one statement." },
     { c: "", w: "" },
     { c: "# step 1 — innermost first", w: "" },
     { c: "average = round(240 / len(scores), 2)", w: "`sum(scores)` was an expression. It evaluated to 240 and vanished, leaving the number behind." },
     { c: "average = round(240 / 4, 2)", w: "`len(scores)` evaluated to 4. Same move." },
     { c: "average = round(60.0, 2)", w: "The division is now an ordinary expression between two numbers. It becomes 60.0." },
     { c: "average = 60.0", w: "`round` evaluated last, because it needed its arguments finished before it could start." },
     { c: "", w: "" },
     { c: "# and only NOW does the statement act", w: "The assignment happens once, at the end, with a single finished value." }
    ],
    after: "This is the whole trick. When a line confuses you, rewrite it downwards like this on paper. It works every time and it never stops working — senior engineers do exactly this with a line they have not seen before." } },

  { trap: "The classic beginner line: writing `total + 5` on its own and wondering why `total` did not change. It is an expression. It evaluated to a number, the number was not stored anywhere, and it was thrown away. You needed the *statement* `total = total + 5`. An expression on a line by itself is legal in most languages and does absolutely nothing — no error, no warning, no effect." },

  { h: "The blurry edge, and why it is worth knowing about" },
  { p: "Some languages let things be both. In Python, `x = 5` is strictly a statement, but in C and JavaScript assignment is an *expression* that also evaluates to the assigned value — which is why `a = b = 0` sets both, and why this bug exists:" },

  { vs: { lang: "javascript", t: "The most famous typo in C-family languages",
    bad: { label: "The bug", c: "if (status = \"active\") {\n  // always runs\n}",
      w: "One `=`. This **assigns** `\"active\"` to `status`, the assignment expression evaluates to `\"active\"`, which counts as true, so the branch always runs — and it has silently overwritten your variable on the way through." },
    good: { label: "The intent", c: "if (status === \"active\") {\n  // runs when it matches\n}",
      w: "Three `=` in JavaScript, two in most other languages. **Comparison**, not assignment. It evaluates to `true` or `false` and changes nothing." }
  } },

  { n: "Python deliberately made assignment a statement precisely so that this bug is impossible — `if status = \"active\":` is a syntax error, caught before it runs. That is a language design decision with a specific bug in mind, and now you know which one. Languages are full of these; noticing them is how you develop taste.",
    nt: "Why Python drew that line" },

  { tryit: { t: "Expression or statement?",
    task: "For each: is it an expression (has a value) or a statement (has an effect)? A few are both.",
    hint: "Ask yourself: could I put this inside brackets and pass it to a function? If yes, it is an expression.",
    sol: { lang: "text", code: "len(name)          expression  -> a number\nname = \"Aryan\"     statement   -> an effect\nname               expression  -> the value it holds\nprint(name)        both: an expression whose value is usually empty,\n                   used for its effect of printing\nx > 3 and y < 9    expression  -> true or false\nreturn x * 2       statement, containing the expression x * 2" },
    w: "The reliable test is the one in the hint: anything you can legally pass as an argument is an expression." } },

  { vocab: ["Expression", "Statement", "Operator"] }
 ],
 k: [
  "An expression has a value. A statement has an effect. Statements are built out of expressions.",
  "*Evaluate* means collapse an expression down to the single value it equals.",
  "Nested expressions are read innermost-first, exactly like arithmetic. Rewrite them downwards when stuck.",
  "An expression alone on a line does nothing at all — that is why `total + 5` never changed anything."
 ],
 r: ["Expression", "Statement", "Operator", "Variable"],
 drill: {
  lang: "text",
  reps: 3,
  items: [
   { c: "3 + 4 * 2", w: "an expression that evaluates to 11, not 14", hint: "multiplication binds tighter" },
   { c: "total = 3 + 4", w: "a statement: evaluate the right side, then bind the name" },
   { c: "print(total)", w: "a call run for its effect on the screen" },
   { c: "return price * qty", w: "a statement carrying an expression back to the caller" },
   { c: "age >= 18", w: "an expression whose value is true or false" }
  ]
 }
},

{
 t: "Blocks: How Code Gets Grouped",
 m: "syntax",
 lvl: "core",
 s: "Braces, indentation and the invisible structure that decides which lines belong to what.",
 goal: [
  "Explain what a block is and why every language needs one",
  "Read braces and indentation as the same idea in different clothes",
  "Recognise the two grouping bugs that catch everybody"
 ],
 b: [
  { p: "A program is not a flat list. Some lines belong *inside* an `if`. Some belong *inside* a loop, or a function. The language needs an unambiguous way for you to say where the inside starts and stops, and that grouping unit is called a **block**." },
  { p: "There are exactly two conventions in wide use, and everything you will meet uses one of them." },

  { tbl: { t: "The two ways to mark a block",
    h: ["", "Braces", "Indentation"],
    rows: [
     ["How the block is marked", "`{` opens it, `}` closes it", "Consistent leading whitespace"],
     ["Is indentation required?", "No — it is style only, and ignored by the machine", "Yes — it *is* the syntax"],
     ["Can you write it all on one line?", "Yes, and people sometimes do", "No, and that is deliberate"],
     ["Failure mode", "Ugly, inconsistent formatting that still runs", "Code that runs but does the wrong thing"],
     ["Languages", "C, C++, C#, Java, JavaScript, Go, Rust, PHP", "Python, YAML, F#, Haskell (mostly)"]
    ] } },

  { p: "Both are solving one problem: *where does the inside end?* Braces answer it with a visible character. Indentation answers it with the shape you were going to write anyway." },

  { h: "Braces: structure you can see" },
  { code: { lang: "javascript", t: "The block is everything between the braces",
    lines: [
     { c: "function checkout(cart) {", w: "This `{` opens the function's block. Everything until its matching `}` is the function body." },
     { c: "  if (cart.isEmpty()) {", w: "A second `{`, nested inside the first. Two blocks are now open at once." },
     { c: "    return 0;", w: "Indented by convention so a human can see the nesting. The machine does not care and would run this identically with no indentation at all." },
     { c: "  }", w: "Closes the `if` block. One still open." },
     { c: "  return cart.total();", w: "Back in the function's block, not the `if`'s. This line runs whenever the `if` did not return." },
     { c: "}", w: "Closes the function. Zero open. The file is balanced." }
    ],
    after: "Count the braces as you read: every `{` adds one to a mental depth counter and every `}` removes one. If you finish the file at anything other than zero, you have a syntax error waiting." } },

  { h: "Indentation: structure you cannot fake" },
  { code: { lang: "python", t: "The same program, with whitespace doing the work",
    lines: [
     { c: "def checkout(cart):", w: "The colon says *a block starts on the next line*. Every Python construct that opens a block ends its header with a colon: `if`, `for`, `while`, `def`, `class`, `try`." },
     { c: "    if cart.is_empty():", w: "Indented four spaces, so it belongs to the function. The colon opens another block." },
     { c: "        return 0", w: "Eight spaces — inside the `if`, which is inside the function." },
     { c: "    return cart.total()", w: "Back to four spaces. That single change of indentation is the entire mechanism by which Python knows the `if` block ended." },
     { c: "", w: "" },
     { c: "# no closing anything. Dedenting IS the close.", w: "" }
    ] } },

  { ana: "Braces are quotation marks around a paragraph; indentation is the paragraph break itself. Both tell you where a thought ends. One of them is a mark you can forget to close; the other is a shape you cannot accidentally get half-right without seeing it.",
    at: "Two ways to end a paragraph" },

  { h: "The two bugs everybody hits" },
  { p: "Each convention has one characteristic failure, and they are worth meeting on paper before you meet them at midnight." },

  { vs: { lang: "python", t: "Indentation bug: the line that escaped the loop",
    bad: { label: "One space too few", c: "for name in names:\n    greet(name)\nprint(\"done\")",
      w: "`print` is outside the loop, so it runs **once**, at the end. That may well be what you wanted — but if you wanted it per name, nothing will tell you. It runs, it produces output, and it is wrong." },
    good: { label: "Inside the loop", c: "for name in names:\n    greet(name)\n    print(\"done\")",
      w: "Four spaces further in, so it runs once per name. The difference between these two programs is four characters of whitespace and no error message whatsoever." }
  } },

  { vs: { lang: "javascript", t: "Brace bug: the block that was never there",
    bad: { label: "No braces, two statements", c: "if (isAdmin)\n  grantAccess();\n  logAdminEntry();",
      w: "Most brace languages let you omit the braces for a **single** statement. Only `grantAccess()` is conditional. `logAdminEntry()` is indented to look conditional and runs every single time, for everybody." },
    good: { label: "Always brace it", c: "if (isAdmin) {\n  grantAccess();\n  logAdminEntry();\n}",
      w: "Two extra characters, and the indentation and the behaviour now agree. This exact bug shipped in Apple's SSL code in 2014 and broke certificate validation across iOS and macOS — it is known as *goto fail*." }
  } },

  { n: "Both failures share a root: **the indentation lied about the structure.** In Python that cannot happen, because the indentation *is* the structure. In brace languages it can, which is why every serious team runs an automatic formatter (Prettier, gofmt, clang-format, Black) that reformats the file to match the real braces. Let a tool do it; you have better things to spend attention on.",
    nt: "Why auto-formatters exist" },

  { trap: "Never mix tabs and spaces for indentation. They look identical on screen and are completely different characters to the parser. Python will refuse outright with a `TabError`; other languages will produce code that reads as one shape and behaves as another. Set your editor to insert spaces when you press Tab — it is a one-time setting and it removes the problem permanently." },

  { tryit: { t: "How many times does it print?",
    task: "Given a list of three names, how many lines does each of these produce?",
    hint: "Track how far in each line sits, and ask which block it lives in.",
    sol: { lang: "python", code: "# A\nfor n in names:\n    print(n)\n    print(\"---\")\n# -> 6 lines: both are in the loop\n\n# B\nfor n in names:\n    print(n)\nprint(\"---\")\n# -> 4 lines: three names, then one separator" },
    w: "Same six lines of text, one character of difference, and a different program. This is why the whitespace is worth caring about." } },

  { vocab: ["Scope", "Indentation"] }
 ],
 k: [
  "A block groups the lines that belong to an `if`, a loop or a function. Every language needs one and there are only two conventions.",
  "Braces make the structure visible; indentation makes it unfakeable. Neither is better, and the argument is not worth your time.",
  "In brace languages, indentation can lie about the structure — always use braces even for one line.",
  "Never mix tabs and spaces. Configure the editor once and forget about it."
 ],
 r: ["Scope", "Syntax", "Linter", "Static Analysis"]
},

{
 t: "Comments and Writing for Humans",
 m: "syntax",
 lvl: "core",
 s: "The part of the file the machine ignores, and the only part your future self will thank you for.",
 goal: [
  "Write a comment that adds information rather than repeating the code",
  "Know when *not* to comment",
  "Use comments to think, not just to document"
 ],
 b: [
  { p: "A **comment** is text in your source file that the tokeniser throws away. It never runs, it never affects anything, and it costs nothing at runtime. It exists purely for people — including the person you will be in six weeks, who will remember none of this." },

  { code: { lang: "text", t: "Every language, the same idea",
    lines: [
     { c: "# Python, Ruby, shell, YAML", w: "A hash. Everything after it on the line is ignored." },
     { c: "// JavaScript, Java, C, C++, C#, Go, Rust", w: "Two slashes. Same rule." },
     { c: "/* the C-family block comment", w: "Opens a comment that can run over many lines…" },
     { c: "   spans as many lines as you like */", w: "…until it is closed. Handy for temporarily disabling a chunk of code." },
     { c: "-- SQL", w: "Two dashes." },
     { c: "<!-- HTML and XML -->", w: "The wordiest of them, and it ships to the browser — anyone can read it in *view source*." }
    ],
    after: "The syntax differs, the concept does not. Your editor almost certainly toggles comments on the selected lines with Ctrl+/ (Cmd+/ on a Mac). Learn that shortcut today; you will use it thousands of times." } },

  { h: "The rule: comment the why, never the what" },
  { p: "This is the whole of comment craft, and it is stated in five words. The code already says *what* it does — that is what code is. What the code physically cannot say is *why* it does it that way, what you tried first, and what will break if someone tidies it." },

  { vs: { lang: "python", t: "The same line, commented badly and well",
    bad: { label: "A comment that earns nothing", c: "# add one to the counter\ncounter = counter + 1",
      w: "It restates the line in English. It cannot ever be more accurate than the code, it makes the file longer, and worst of all it will not be updated when the code changes — so eventually it will be a *lie* sitting next to the truth." },
    good: { label: "A comment worth its space", c: "# Vendor's API is 1-indexed even though the docs say 0.\n# Confirmed with support, ticket #4412. Do not \"fix\".\ncounter = counter + 1",
      w: "Now it carries something the code cannot: a reason, evidence, and a warning to the next person — who would otherwise remove this line, ship it, and break production." }
  } },

  { p: "Test any comment you are about to write with one question: **could a competent reader work this out from the code in ten seconds?** If yes, delete the comment and go home. If no, the comment is doing real work." },

  { l: [
   "**Why this and not the obvious thing.** `# looping manually because the built-in sort is not stable here`",
   "**A decision and its cost.** `# reading the whole file into memory: it is capped at 5 MB by the uploader`",
   "**A warning.** `# order matters — auth must be registered before routing`",
   "**A link.** `# algorithm from https://... section 3.2`",
   "**Deliberate strangeness.** `# yes, this catches and ignores. The library throws on empty input and we do not care.`"
  ] },

  { h: "Comments as a thinking tool" },
  { p: "There is a second use for comments that nobody mentions to beginners, and it may be more valuable than the documentation use. You can write the comments *first*, before any code exists, as a plan." },

  { code: { lang: "python", t: "Write the plan, then fill it in",
    lines: [
     { c: "def monthly_report(orders):", w: "" },
     { c: "    # 1. keep only orders from this month", w: "You have not written a single line of real code and you have already solved the problem. Each comment is one step in English." },
     { c: "    # 2. group them by customer", w: "" },
     { c: "    # 3. sum the spend in each group", w: "If a step is hard to write in English, that is the step that is going to be hard in code — and you have found it before wasting an hour." },
     { c: "    # 4. sort by spend, highest first", w: "" },
     { c: "    # 5. return the top three", w: "" },
     { c: "    pass", w: "A placeholder so the empty function is still legal. Now go back and replace each comment with the line that does it." }
    ],
    after: "This is decomposition, and it is the single highest-leverage habit in this whole track. There is a full lesson on it later; for now, notice that comments are where it lives." } },

  { dg: "pseudocode" },

  { h: "Commenting out code" },
  { p: "The other everyday use: temporarily disabling lines to see whether they were the problem. This is a legitimate debugging move and you will do it constantly." },
  { trap: "Commenting out code is for the next ten minutes, not the next ten months. Dead code left commented in a file is pure noise — the next reader has no idea whether it is a plan, a bug, or something important that was disabled by accident. Delete it. Version control remembers everything you have ever deleted, which is one of the main reasons to use it." },

  { h: "Docstrings and doc comments" },
  { p: "Most languages have a *structured* comment convention for describing a function to its callers, which tooling can read and turn into documentation, editor tooltips and autocomplete hints." },

  { code: { lang: "python", t: "A docstring: a comment with a job",
    lines: [
     { c: "def tax(amount, rate=0.2):", w: "" },
     { c: "    \"\"\"Return the tax owed on an amount.", w: "In Python a string as the first thing in a function is a **docstring**. It is not thrown away — it is stored on the function, and `help(tax)` prints it." },
     { c: "", w: "" },
     { c: "    rate is a fraction, so 20% is 0.2, not 20.", w: "This is the sentence that prevents the bug. Someone *will* pass 20." },
     { c: "    \"\"\"", w: "" },
     { c: "    return amount * rate", w: "" }
    ],
    after: "JavaScript has JSDoc (`/** ... */`), Java has Javadoc, Go has plain comments above the declaration, Rust has `///`. Same idea everywhere: describe what a caller needs to know, especially the units and the surprises." } },

  { q: "Code never lies. Comments sometimes do.", by: "Ron Jeffries" },

  { tryit: { t: "Rewrite the comment",
    task: "This comment is useless. The line multiplies by 1.08. Write a comment that would actually help someone six months from now.",
    hint: "Where did 1.08 come from? Is it forever? What happens when it changes?",
    sol: { lang: "python", code: "# BAD\n# multiply by 1.08\ntotal = subtotal * 1.08\n\n# BETTER\n# 8% state sales tax, correct for CA as of Jan 2024.\n# Move to the tax table if we ever ship outside CA.\nTAX_RATE = 1.08\ntotal = subtotal * TAX_RATE" },
    w: "Notice the best fix was partly *not a comment*: naming the number `TAX_RATE` removed half the need for one. A well-named thing needs less explaining, and that is the general rule — reach for a better name before reaching for a comment." } },

  { vocab: ["Comment", "Docstring", "Technical Debt"] }
 ],
 k: [
  "Comments are stripped before the code runs. They cost nothing and exist purely for humans.",
  "Comment the *why*, never the *what*. A comment that restates the code will eventually become a lie.",
  "Writing the comments first, as English steps, is the cheapest way to plan a function.",
  "Prefer a better name over a comment. Delete commented-out code — version control already remembers it."
 ],
 r: ["Comment", "Documentation", "Version Control"]
}

]);
