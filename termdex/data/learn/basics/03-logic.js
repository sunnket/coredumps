/* Programming Basics — operators, booleans and decisions. */
TD.addLessons("basics", [

{
 t: "Operators and the Order They Run In",
 m: "logic",
 lvl: "core",
 s: "Arithmetic, the two divisions, the modulo nobody explains properly, and precedence.",
 goal: [
  "Use integer division and modulo for the jobs they are actually for",
  "Predict the result of an expression with mixed operators",
  "Know when to add brackets and stop thinking about it"
 ],
 b: [
  { p: "An **operator** is a symbol that takes values and produces a new one. You know most of them from a calculator. Three of them behave in ways a calculator does not, and one of those three is genuinely useful in ways that are never explained." },

  { h: "The arithmetic set" },

  { tbl: { t: "Seven operators, in every language you will meet",
    h: ["", "Does", "Example", "Result"],
    rows: [
     ["`+`", "Add — and, for text, join", "`3 + 4` · `\"ab\" + \"cd\"`", "`7` · `\"abcd\"`"],
     ["`-`", "Subtract", "`10 - 3`", "`7`"],
     ["`*`", "Multiply — and, in some languages, repeat text", "`3 * 4` · `\"ab\" * 3`", "`12` · `\"ababab\"`"],
     ["`/`", "Divide", "`7 / 2`", "`3.5` — usually"],
     ["`//`", "Integer division: divide and throw away the remainder", "`7 // 2`", "`3`"],
     ["`%`", "Modulo: keep **only** the remainder", "`7 % 2`", "`1`"],
     ["`**`", "Power (`^` in some languages, `Math.pow` in others)", "`2 ** 10`", "`1024`"]
    ] } },

  { trap: "`/` is the operator languages disagree about most. In Python 3, `7 / 2` is `3.5`. In Python 2, Java, C, C++, Go and Rust, `7 / 2` between two integers is `3` — the fractional part is discarded silently, no warning, no error. If an average comes out suspiciously round in a static language, this is why. Force one side to a decimal: `7 / 2.0`." },

  { h: "Modulo: the most useful operator nobody explains" },
  { p: "`%` gives you the remainder after division. Stated that way it sounds like a curiosity from primary school. It is in fact one of the most-used operators in real code, because it answers four questions that come up constantly." },

  { code: { lang: "python", t: "What modulo is actually for",
    lines: [
     { c: "if n % 2 == 0:", w: "**Is it even?** Divide by two; a remainder of zero means it divided cleanly. `n % 2 == 1` is odd. This is the standard idiom in every language." },
     { c: "    print(\"even\")", w: "" },
     { c: "", w: "" },
     { c: "if i % 100 == 0:", w: "**Every Nth time.** Inside a loop over a million rows, this prints progress a hundred times instead of a million. Cheap, and it makes long jobs bearable." },
     { c: "    print(f\"processed {i}\")", w: "" },
     { c: "", w: "" },
     { c: "hour = (start + hours_later) % 24", w: "**Wrap around a cycle.** 23:00 plus 4 hours is 3:00, not 27:00. The same trick handles days of the week (`% 7`), minutes (`% 60`) and angles (`% 360`)." },
     { c: "", w: "" },
     { c: "bucket = user_id % num_servers", w: "**Spread things evenly.** Take any number, mod it by how many buckets you have, and you get a bucket index that is always in range and roughly balanced. This is the heart of hashing, sharding and load distribution." }
    ],
    after: "Those four patterns — even/odd, every Nth, wrap around, spread evenly — cover almost every use of `%` you will ever see. Recognising them saves you from re-deriving the idea each time." } },

  { dg: "precedence" },

  { h: "Precedence: the order that is not left to right" },
  { p: "`2 + 3 * 4` is 14, not 20, because multiplication binds tighter than addition. That much you know from school. What is easy to miss is that the same rule extends across *every* operator — comparison, logic, everything — and the full order is longer than most people can hold in their head." },

  { tbl: { t: "Precedence, high to low (the practical version)",
    h: ["Level", "Operators", "Example that surprises people"],
    rows: [
     ["1 — tightest", "`()` brackets", "Always wins. That is the point of them."],
     ["2", "`**` power", "`-2 ** 2` is `-4`, because the power runs before the minus sign"],
     ["3", "`*` `/` `//` `%`", "`10 - 2 * 3` is `4`"],
     ["4", "`+` `-`", ""],
     ["5", "`<` `>` `<=` `>=` `==` `!=`", "All arithmetic finishes before any comparison starts"],
     ["6", "`not`", "`not a == b` means `not (a == b)`"],
     ["7", "`and`", "`a or b and c` means `a or (b and c)`"],
     ["8 — loosest", "`or`", ""]
    ] } },

  { p: "The two rows that catch experienced people are the last two. `and` binds tighter than `or`, which means this:" },

  { code: { lang: "python", t: "The classic precedence bug",
    lines: [
     { c: "if is_admin or is_owner and is_active:", w: "Reads like *(admin or owner) and active*. It is not." },
     { c: "", w: "" },
     { c: "# what the machine sees:", w: "" },
     { c: "if is_admin or (is_owner and is_active):", w: "An inactive admin still gets in, because the `or` short-circuits on the left before the activity check is ever reached." },
     { c: "", w: "" },
     { c: "# what you almost certainly meant:", w: "" },
     { c: "if (is_admin or is_owner) and is_active:", w: "Now inactive means out, regardless of role. Two brackets, and a security bug that never happens." }
    ] } },

  { n: "The professional habit is not *memorise the table*. It is **bracket anything with more than two operators in it**. Brackets cost nothing, never change behaviour when they match your intent, and remove a whole category of code review argument. Nobody has ever been criticised for over-bracketing a security check.",
    nt: "The rule that actually works" },

  { h: "The other operator families" },
  { p: "Two more sets you will meet everywhere, listed here so they are not mysterious when they appear." },
  { l: [
   "**Compound assignment.** `+=`, `-=`, `*=`, `/=`, `%=`. `x += 3` is `x = x + 3`. Purely a shorthand, and it reads as *change this in place*.",
   "**Increment and decrement.** `i++` and `i--` in C, Java, JavaScript, Go. Add or subtract one. Python deliberately has neither — `i += 1` only. In C-family languages `i++` and `++i` differ in what the *expression* evaluates to, which is a famous interview question and a good thing to avoid writing inside a larger expression.",
   "**Bitwise.** `&`, `|`, `^`, `~`, `<<`, `>>`. These work on the individual binary digits of a number. You will not need them for a long time, and when you do — flags, permissions, low-level protocols, hashing — you will know it. Note that `&` and `&&` are different operators in C-family languages, and mixing them up is a real bug."
  ] },

  { h: "One expression, evaluated properly" },

  { code: { lang: "text", t: "Peel it from the inside",
    lines: [
     { c: "result = 10 + 6 // 4 * 2 ** 2", w: "" },
     { c: "result = 10 + 6 // 4 * 4", w: "`2 ** 2` — power is level 2, so it goes first." },
     { c: "result = 10 + 1 * 4", w: "`6 // 4` — level 3, and left to right within a level, so integer division comes before the multiply. 6 divided by 4 is 1 remainder 2; integer division keeps the 1." },
     { c: "result = 10 + 4", w: "`1 * 4` — still level 3." },
     { c: "result = 14", w: "Addition last." }
    ],
    after: "If you had to work at that, good — so would everybody. Which is precisely why nobody sensible writes that line. Split it across two named variables and the question disappears." } },

  { tryit: { t: "Evaluate by hand",
    task: "No running it. Work out each result and check afterwards.",
    hint: "Power, then multiply/divide/modulo left-to-right, then add/subtract, then comparisons, then not/and/or.",
    sol: { lang: "python", code: "3 + 4 * 2          -> 11\n(3 + 4) * 2        -> 14\n17 % 5             -> 2\n17 // 5            -> 3\n2 ** 3 ** 2        -> 512   (** goes right-to-left: 2 ** 9)\n10 - 3 - 2         -> 5     (- goes left-to-right)\n5 > 3 == True      -> True  (comparisons after arithmetic)\nTrue or False and False -> True  (and binds tighter)" },
    w: "The one worth remembering is `2 ** 3 ** 2`. Power associates right-to-left, unlike everything else. It matches the maths convention and it catches everybody once." } },

  { vocab: ["Operator", "Modulo"] }
 ],
 k: [
  "`//` divides and discards the remainder; `%` keeps only the remainder. Both are far more useful than they look.",
  "`%` has four everyday jobs: even/odd, every Nth iteration, wrapping a cycle, and spreading values across buckets.",
  "Precedence covers all operators, not just arithmetic — and `and` binds tighter than `or`, which is a real security bug waiting to happen.",
  "Do not memorise the table. Bracket anything non-obvious and split long expressions into named steps."
 ],
 r: ["Operator", "Modulo"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "if n % 2 == 0:", w: "test whether a number is even", hint: "remainder after dividing by two" },
   { c: "if i % 100 == 0:", w: "do something on every hundredth pass of a loop" },
   { c: "hour = (h + delta) % 24", w: "wrap a value around a 24-hour cycle" },
   { c: "pages = (total + size - 1) // size", w: "round a division upwards using integer division" },
   { c: "if (is_admin or is_owner) and is_active:", w: "bracket the or so it is not swallowed by the and" }
  ]
 }
},

{
 t: "Booleans, Comparison and Short-Circuiting",
 m: "logic",
 lvl: "core",
 s: "Two values, three operators, and the whole of decision-making built from them.",
 goal: [
  "Build a compound condition and read it back correctly",
  "Explain short-circuit evaluation and use it to guard against errors",
  "Apply De Morgan's law to simplify a tangled negation"
 ],
 b: [
  { p: "Every decision a program makes — every `if`, every `while`, every filter, every access check — comes down to a single value that is either true or false. The whole apparatus is two values and three operators, which is why it is worth an hour of proper attention: it is the smallest possible system, and everything is built on it." },

  { h: "Where booleans come from" },
  { p: "You rarely type `true` yourself. Booleans are produced by **comparison operators**, which take two values and hand back one boolean." },

  { tbl: { t: "The six comparisons",
    h: ["", "Asks", "Note"],
    rows: [
     ["`==`", "Are these equal?", "Two equals signs. One is assignment. This is the most common typo in programming."],
     ["`!=`", "Are these different?", "`<>` in a few old languages and in SQL."],
     ["`<` `>`", "Less than, greater than", "Works on text too, alphabetically — which is occasionally what you want and often a bug."],
     ["`<=` `>=`", "Less-or-equal, greater-or-equal", "The `=` goes second. `=<` is a syntax error."],
     ["`in`", "Is this inside that collection?", "Python and JS (`includes`). Enormously readable: `if user in admins:`"],
     ["`is`", "Are these literally the same object?", "Not the same as `==`. There is a lesson on this next."]
    ] } },

  { h: "Combining them: and, or, not" },
  { dg: "bool-logic" },

  { p: "Written `and` / `or` / `not` in Python, SQL and Ruby, and `&&` / `||` / `!` in C, Java, JavaScript, Go and Rust. Identical meaning, different spelling." },

  { code: { lang: "python", t: "Building a real condition",
    lines: [
     { c: "can_vote = age >= 18 and is_citizen", w: "`and` — both must be true. Read it exactly as English." },
     { c: "needs_review = amount > 10000 or is_flagged", w: "`or` — either is enough. Note this is *inclusive* or: if both are true, the result is still true." },
     { c: "is_guest = not is_logged_in", w: "`not` — flips it. Prefer this to `== False`, which is noisier and no clearer." },
     { c: "", w: "" },
     { c: "if can_vote and not has_voted:", w: "Naming the pieces first turned an unreadable four-clause condition into a line you can read aloud. This is the single best habit in this lesson." },
     { c: "    issue_ballot()", w: "" }
    ] } },

  { h: "Short-circuiting, and why it is a feature" },
  { p: "When the machine evaluates `A and B`, it starts with `A`. If `A` is false, the whole expression is false no matter what `B` says — so **it does not evaluate `B` at all.** Likewise `A or B` stops at a true `A`." },
  { p: "This is not merely an optimisation. It is a guarantee you can build on, and it produces one of the most common idioms in all of programming:" },

  { code: { lang: "python", t: "The guard that saves you from a crash",
    lines: [
     { c: "if user is not None and user.is_admin:", w: "If `user` is missing, the left side is false, the right side **never runs**, and you avoid an `AttributeError` on `None`. Reverse the two and it crashes." },
     { c: "    show_admin_panel()", w: "" },
     { c: "", w: "" },
     { c: "if len(items) > 0 and items[0] == \"start\":", w: "Same shape. The index is only reached once you know there is something to index." },
     { c: "", w: "" },
     { c: "if cache_hit or expensive_lookup():", w: "The `or` version: on a cache hit, the expensive function is never called at all. Ordering your conditions cheapest-first is free performance." }
    ],
    after: "The order of your conditions is part of their meaning, not just their style. `A and B` and `B and A` produce the same answer when both are safe — and only one of them is safe when A is a guard." } },

  { trap: "Not every language short-circuits every operator. In C, Java and Go, `&&` and `||` short-circuit but the bitwise `&` and `|` do **not** — both sides always run. Writing `if (user != null & user.isAdmin())` with one ampersand compiles and then crashes. This is exactly why one-character typos matter." },

  { h: "Chained comparisons and the trap in them" },
  { p: "You will want to write *is x between 1 and 10*. Whether you can depends on the language, and the failure is silent." },

  { vs: { t: "Between, two ways",
    bad: { lang: "javascript", label: "JavaScript / C / Java — legal and wrong", c: "if (1 < x < 10) { ... }",
      w: "Evaluated left to right: `1 < x` produces `true` or `false`, then that boolean is compared to 10 — with `true` counting as 1. The result is `true` for essentially every value of x. It compiles, it runs, it is nonsense." },
    good: { lang: "javascript", label: "Say it properly", c: "if (x > 1 && x < 10) { ... }",
      w: "Two comparisons joined explicitly. Slightly longer, entirely correct, and works in every language." }
  } },

  { n: "Python is the exception: `if 1 < x < 10:` does exactly what it looks like, because Python special-cases chained comparisons into `1 < x and x < 10`. It is a genuinely nice feature — and it will teach you a habit that silently breaks the day you write JavaScript.",
    nt: "Python is the odd one out here" },

  { h: "De Morgan's law: untangling negations" },
  { p: "Sooner or later you will write a condition with `not` wrapped around a compound expression and lose track of what it means. There is a mechanical rule for flipping it, from 1850, and it always works." },

  { code: { lang: "text", t: "The two rules, and they are all you need",
    lines: [
     { c: "not (A and B)   ==   (not A) or (not B)", w: "*Not both* is the same as *at least one is missing*." },
     { c: "not (A or B)    ==   (not A) and (not B)", w: "*Neither* is the same as *not this AND not that*." },
     { c: "", w: "" },
     { c: "# in practice:", w: "" },
     { c: "if not (is_admin or is_owner):", w: "Hard to hold in your head, especially at the end of a long function." },
     { c: "if not is_admin and not is_owner:", w: "Identical meaning, and now it reads as *neither an admin nor an owner*, which is what you were thinking." }
    ],
    after: "The mechanical version: push the `not` inwards, and every `and` becomes `or` and every `or` becomes `and`. Do it on paper the first few times and it will become automatic." } },

  { h: "Writing conditions people can read" },

  { vs: { lang: "python", t: "The same access check",
    bad: { label: "Correct and unreadable", c: "if (u.role == \"admin\" or u.role == \"owner\") \\\n   and u.active and not u.locked \\\n   and (u.mfa or not REQUIRE_MFA):\n    allow()",
      w: "Nobody can review this. To find a bug you would have to hold five clauses and two levels of brackets in your head at once — and access-control bugs are the ones that actually cost money." },
    good: { label: "Correct and reviewable", c: "is_privileged = u.role in (\"admin\", \"owner\")\nis_usable    = u.active and not u.locked\nmfa_ok       = u.mfa or not REQUIRE_MFA\n\nif is_privileged and is_usable and mfa_ok:\n    allow()",
      w: "Identical logic. Now each line is one idea, each has a name that says what it checks, and the final line reads as a sentence. You can also print any of the three when debugging, which you cannot do with a single tangled expression." }
  } },

  { tryit: { t: "Fill in the truth table",
    task: "For `a = True`, `b = False`, `c = True` — evaluate each. Watch the precedence.",
    hint: "`not` first, then `and`, then `or`.",
    sol: { lang: "python", code: "a and b            -> False\na or b             -> True\nnot b              -> True\na and b or c       -> True   ((a and b) or c)\na and (b or c)     -> True\nnot a and b        -> False  ((not a) and b)\nnot (a and b)      -> True   (De Morgan: not a or not b)\nb and undefined()  -> False  (short-circuits, never calls it)" },
    w: "The last one is the important one. `b` is false, so the right-hand side is never evaluated — which is why the call to a function that does not exist does not raise an error." } },

  { vocab: ["Boolean", "Comparison Operators"] }
 ],
 k: [
  "Comparisons produce booleans; `and`, `or` and `not` combine them. That is the whole system.",
  "Short-circuiting means the right side may never run — which makes `if x is not None and x.field` safe, in that order only.",
  "`1 < x < 10` works in Python and is silently wrong nearly everywhere else. Write it as two comparisons.",
  "Name your sub-conditions. A four-clause `if` is unreviewable, and access checks are exactly where you cannot afford that."
 ],
 r: ["Boolean", "Conditional"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "if user is not None and user.is_admin:", w: "guard first, then use — the short-circuit prevents the crash", hint: "order matters here" },
   { c: "if not is_admin and not is_owner:", w: "De Morgan: *neither* said plainly" },
   { c: "is_valid = 0 < qty <= MAX_QTY", w: "a chained range check (Python only)" },
   { c: "if x > 1 and x < 10:", w: "a range check that is correct in every language" },
   { c: "has_access = is_privileged and is_usable", w: "name the sub-conditions so the final line reads as English" }
  ]
 }
},

{
 t: "if, else and Choosing a Path",
 m: "logic",
 lvl: "core",
 s: "The construct that turns a list of instructions into something that can respond.",
 goal: [
  "Write an if/else-if/else chain and know exactly one branch runs",
  "Choose between a chain, a switch and a lookup table",
  "Use guard clauses to flatten deeply nested code"
 ],
 b: [
  { p: "Up to now every program you can imagine runs top to bottom, doing the same thing every time. `if` is the moment that stops being true. It is the first construct that makes a program **respond** rather than merely execute, and everything else — validation, error handling, menus, games, business rules — is built from it." },

  { dg: "branch-flow" },

  { h: "The shape" },

  { code: { lang: "python", t: "The full form, with every part named",
    lines: [
     { c: "if score >= 90:", w: "The **condition**: any expression that evaluates to true or false. Checked first." },
     { c: "    grade = \"A\"", w: "The **body**. Runs only if the condition was true." },
     { c: "elif score >= 80:", w: "`elif` (`else if` in most languages) is only ever reached when everything above it was false. So this implicitly means *between 80 and 89* — you do not need to write the upper bound." },
     { c: "    grade = \"B\"", w: "" },
     { c: "elif score >= 70:", w: "You can have as many of these as you like." },
     { c: "    grade = \"C\"", w: "" },
     { c: "else:", w: "The catch-all. No condition, because it means *none of the above matched*. Optional — but leaving it out means a value can fall through all the branches untouched." },
     { c: "    grade = \"F\"", w: "" }
    ],
    after: "Exactly one branch runs. Not zero (given an `else`), not two. Once a condition matches, everything below it is skipped entirely — the machine does not even look at it." } },

  { trap: "Order is meaning in an if-chain. Write the `score >= 70` test first and *every* passing score gets a C, because it matches before the 90 test is ever reached. When your chain tests overlapping ranges, always go from most specific to least — highest threshold first, or narrowest condition first." },

  { h: "Chain versus separate ifs" },
  { p: "A common confusion: is `elif` different from just writing another `if`? Yes, and the difference matters." },

  { vs: { lang: "python", t: "One of these has a bug",
    bad: { label: "Separate ifs — all four are checked", c: "if n > 0:\n    sign = \"positive\"\nif n < 0:\n    sign = \"negative\"\nif n == 0:\n    sign = \"zero\"",
      w: "Every condition is evaluated, every time, even after one has already matched. Wasteful here and genuinely wrong the moment the bodies interact — if an earlier branch modifies `n`, a later `if` sees the new value and can also fire." },
    good: { label: "A chain — checking stops at the first match", c: "if n > 0:\n    sign = \"positive\"\nelif n < 0:\n    sign = \"negative\"\nelse:\n    sign = \"zero\"",
      w: "One decision, three outcomes, expressed as one decision. Also faster, also impossible to accidentally match twice, and the `else` makes it obvious that every case is covered." }
  } },

  { p: "Use separate `if`s when the conditions are genuinely independent questions (*is it too long?* *does it contain a digit?* *is it on the blocklist?* — all three should be checked). Use a chain when you are picking one outcome out of several." },

  { h: "Guard clauses: the fix for the arrow" },
  { p: "Nested `if`s grow rightwards and become unreadable fast. There is a standard cure and it is one of the highest-value refactoring habits you can pick up early." },

  { vs: { lang: "python", t: "The arrow, and its cure",
    bad: { label: "The arrow of doom", c: "def process(order):\n    if order is not None:\n        if order.is_paid:\n            if order.items:\n                if not order.shipped:\n                    ship(order)\n                    return \"sent\"\n                else:\n                    return \"already sent\"\n            else:\n                return \"empty\"\n        else:\n            return \"unpaid\"\n    else:\n        return \"no order\"",
      w: "The actual work — `ship(order)` — is buried five levels deep, and every `else` is miles from the `if` it belongs to. To check the unpaid case you have to scan fourteen lines." },
    good: { label: "Guard clauses", c: "def process(order):\n    if order is None:\n        return \"no order\"\n    if not order.is_paid:\n        return \"unpaid\"\n    if not order.items:\n        return \"empty\"\n    if order.shipped:\n        return \"already sent\"\n\n    ship(order)\n    return \"sent\"",
      w: "Handle every failure first and leave immediately. By the time you reach the bottom, everything that could be wrong has been ruled out — so the real work sits at indentation level one, unmissable. Each rule is now one readable line." }
  } },

  { p: "The rule of thumb: **deal with the exceptional cases early and get out.** If you find yourself three levels deep in `if`s, invert the outermost condition and return. It almost always works and the result is almost always shorter." },

  { h: "When a chain is the wrong tool" },
  { p: "Once an if-chain gets past about four branches, and especially when every branch is *this value maps to that value*, there is usually a better construct." },

  { tbl: { t: "Four ways to pick one of many",
    h: ["Tool", "Best when", "Available in"],
    rows: [
     ["**if / else if chain**", "Conditions are ranges or unrelated tests", "Everything"],
     ["**switch / match**", "One value compared against many fixed options", "C, Java, JS, Go, Rust, Python 3.10+ (`match`)"],
     ["**Lookup table**", "It is pure data: a key maps to a value", "Everything — it is just a dictionary"],
     ["**Ternary**", "Two outcomes, one short expression", "Everything, spelled differently"]
    ] } },

  { code: { lang: "python", t: "The lookup table — often the answer nobody thought of",
    lines: [
     { c: "# eight branches of pure data", w: "" },
     { c: "if country == \"IN\": rate = 0.18", w: "This is a table pretending to be logic. It will grow, someone will paste a branch and forget to change the value, and it will be reviewed line by line forever." },
     { c: "elif country == \"US\": rate = 0.07", w: "" },
     { c: "elif country == \"DE\": rate = 0.19", w: "" },
     { c: "# ...and so on", w: "" },
     { c: "", w: "" },
     { c: "# the same thing as data", w: "" },
     { c: "VAT = {\"IN\": 0.18, \"US\": 0.07, \"DE\": 0.19}", w: "Now it is a table, which is what it always was. Adding a country is one entry. It can be loaded from a file, tested as data, and read by someone non-technical." },
     { c: "rate = VAT.get(country, 0.0)", w: "One line replaces the whole chain. `.get` supplies the default when the key is missing — the `else` branch, done properly." }
    ],
    after: "The general principle: **when the branches differ only in a value, it is data, not logic.** Recognising that is a real step up in how you write code." } },

  { h: "The ternary: a decision inside an expression" },
  { p: "Sometimes you want to choose between two values, not two blocks. Every language has a compact form for it." },

  { code: { lang: "text", t: "The same choice, four ways",
    lines: [
     { c: "status = \"adult\" if age >= 18 else \"minor\"", w: "Python. Reads unusually — value, condition, other value — but reads well aloud." },
     { c: "status = age >= 18 ? \"adult\" : \"minor\";", w: "JavaScript, Java, C, C#, Go(ish). The `? :` form. Condition first." },
     { c: "", w: "" },
     { c: "# use it for a value; do not use it for an action", w: "" },
     { c: "label = \"on\" if enabled else \"off\"", w: "Good: one small choice between two values." },
     { c: "x = a if p else (b if q else (c if r else d))", w: "Bad. Nested ternaries are write-only code. Use an if-chain the moment there is a third case." }
    ] } },

  { tryit: { t: "Flatten this",
    task: "Rewrite with guard clauses so the happy path is not indented.",
    hint: "Invert each condition and return early.",
    sol: { lang: "python", code: "# before\ndef login(user, password):\n    if user is not None:\n        if user.active:\n            if check(password, user.hash):\n                return \"ok\"\n            else:\n                return \"bad password\"\n        else:\n            return \"suspended\"\n    else:\n        return \"no such user\"\n\n# after\ndef login(user, password):\n    if user is None:\n        return \"no such user\"\n    if not user.active:\n        return \"suspended\"\n    if not check(password, user.hash):\n        return \"bad password\"\n    return \"ok\"" },
    w: "Same behaviour, four fewer lines, and the success case is now the last line rather than the most deeply buried one. This refactor works on almost any nested function you will ever meet." } },

  { vocab: ["Conditional", "Guard Clause", "Ternary Operator", "Branch"] }
 ],
 k: [
  "In an if/else-if chain exactly one branch runs, and checking stops at the first match — so the order of the tests is part of their meaning.",
  "Separate `if`s ask independent questions; a chain picks one outcome. Mixing them up is a real bug, not a style choice.",
  "Guard clauses — handle the failures first and return — flatten nested code better than any other single habit.",
  "When branches differ only in a value, it is a lookup table, not logic."
 ],
 r: ["Conditional", "Branch", "Ternary Operator"]
},

{
 t: "Equality, Identity and Truthiness",
 m: "logic",
 lvl: "intermediate",
 s: "Three ways two things can be *the same*, and the values that count as true without being true.",
 goal: [
  "Distinguish `==` from `is` (and `==` from `===`)",
  "List which values are falsy and why that matters",
  "Avoid the empty-versus-missing bug"
 ],
 b: [
  { p: "This lesson is short on syntax and long on consequences. Nearly every language has a subtle answer to *are these two things equal?*, and nearly every beginner assumes there is only one question being asked." },

  { h: "Three different questions" },

  { tbl: { t: "\"Are these the same?\" — three meanings",
    h: ["Question", "Written", "What it compares"],
    rows: [
     ["Do they hold the same value?", "`==` (`equals()` in Java)", "The contents. Two separate lists with identical items are `==`."],
     ["Are they literally one object?", "`is` (Python), `===` for objects in JS, `==` on references in Java", "The memory location. Two identical lists are **not** the same object."],
     ["Same value *and* same type?", "`===` (JavaScript), `==` (most other languages)", "Both at once — no conversion permitted."]
    ] } },

  { code: { lang: "python", t: "Equal contents, different objects",
    lines: [
     { c: "a = [1, 2, 3]", w: "One list." },
     { c: "b = [1, 2, 3]", w: "A **second, separate** list that happens to contain the same numbers." },
     { c: "c = a", w: "A second name for the first list. No new object." },
     { c: "", w: "" },
     { c: "a == b", w: "True — same contents." },
     { c: "a is b", w: "False — two different objects in two different places." },
     { c: "a is c", w: "True — genuinely the same object." },
     { c: "", w: "" },
     { c: "b.append(4)", w: "" },
     { c: "a == b", w: "Now False. `==` looks at the contents *right now*, not at some past moment." }
    ] } },

  { p: "Ninety-five per cent of the time you want `==`. The one case where identity is the right question is checking against `None`/`null`, because there is only ever one of those objects in the whole program:" },

  { code: { lang: "python", t: "The idiom to memorise",
    lines: [
     { c: "if user is None:", w: "Correct. There is exactly one `None`, so identity is exactly the right test — and it cannot be fooled by a class that defines its own `==`." },
     { c: "if user == None:", w: "Works, usually. But an object is allowed to define `__eq__` however it likes, including returning True when compared to None. Linters flag this line for that reason." },
     { c: "", w: "" },
     { c: "if x is 1000:", w: "**Never do this.** Whether it is True depends on whether the language happens to have cached that particular integer object. Small ints often are, large ones are not, and the behaviour varies between versions. Use `==` for values." }
    ] } },

  { h: "JavaScript's two equalities" },
  { p: "JavaScript deserves its own paragraph because it has a `==` that converts types before comparing, and the results are famously strange." },

  { code: { lang: "javascript", t: "Why everyone says \"always use ===\"",
    lines: [
     { c: "0 == \"\"          // true", w: "`==` converts the empty string to a number (0) and then compares. Two clearly different values, declared equal." },
     { c: "0 == \"0\"         // true", w: "Same conversion." },
     { c: "\"\" == \"0\"        // false", w: "But these two are both strings, so no conversion happens — and equality turns out not to be transitive. This is not a joke." },
     { c: "null == undefined // true", w: "Two different kinds of nothing, declared equal." },
     { c: "NaN == NaN        // false", w: "Not-a-Number is not equal to itself. This one is in every language, by IEEE 754 rule, and it is why you test with `isNaN()`." },
     { c: "", w: "" },
     { c: "0 === \"\"         // false", w: "`===` compares value **and** type with no conversion. Every one of the above behaves sensibly with it." }
    ],
    after: "The rule in JavaScript is simply: use `===` and `!==` always, and `==` never, with the single conventional exception of `x == null` to catch both null and undefined at once. Every linter enforces this." } },

  { h: "Truthiness: values that act true without being true" },
  { p: "Most languages let you put a non-boolean inside an `if`, and decide for themselves whether it counts. Values that count as false are **falsy**; everything else is **truthy**." },

  { tbl: { t: "What counts as false",
    h: ["Value", "Python", "JavaScript", "Java / Go"],
    rows: [
     ["`false`", "falsy", "falsy", "false"],
     ["`0`, `0.0`", "falsy", "falsy", "**Not allowed** — must be a boolean"],
     ["`\"\"` empty string", "falsy", "falsy", "Not allowed"],
     ["`[]` empty list", "**falsy**", "**truthy!**", "Not allowed"],
     ["`{}` empty dict/object", "**falsy**", "**truthy!**", "Not allowed"],
     ["`None` / `null` / `undefined`", "falsy", "falsy", "Not allowed"],
     ["`\"0\"`, `\"false\"`", "truthy", "truthy", "Not allowed"]
    ] } },

  { p: "Two things to take from that table. First, an empty array is falsy in Python and truthy in JavaScript — the same code, the same intent, opposite behaviour. Second, Java and Go simply refuse the whole question: `if (x)` where `x` is a number will not compile, and you must write `if (x != 0)`. That is deliberate, and it prevents everything on this page." },

  { code: { lang: "python", t: "Truthiness used well and used badly",
    lines: [
     { c: "if items:", w: "**Good.** Idiomatic Python for *if there is anything in this list*. Clear, short, conventional." },
     { c: "    process(items)", w: "" },
     { c: "", w: "" },
     { c: "if not name:", w: "**Careful.** True for `None` *and* for `\"\"`. If those two mean different things in your program — never asked versus deliberately blank — this line has just merged them." },
     { c: "", w: "" },
     { c: "if name is None:", w: "**Precise.** Says exactly which state you mean, and cannot be surprised." },
     { c: "", w: "" },
     { c: "if count:", w: "**Bug waiting.** A count of 0 is falsy, so this treats *zero results* the same as *no result at all*. Write `if count > 0:` and it is unambiguous forever." }
    ] } },

  { trap: "The empty-versus-missing bug in the wild: a settings form where `if not user.timezone: use_default()`. A user who deliberately clears the field gets the default forced back on them, because empty text is falsy. It is a two-line fix once you see it and a genuinely hard bug to find from a support ticket that says *my setting keeps resetting*." },

  { n: "There is one more equality trap that has nothing to do with any of this: floating-point comparison. `0.1 + 0.2 == 0.3` is false in every mainstream language. Compare with a tolerance — `abs(a - b) < 1e-9` — or use a decimal type. It belongs on this page because it is the third way `==` will lie to you.",
    nt: "And then there are floats" },

  { tryit: { t: "Predict the results",
    task: "In Python, what does each of these evaluate to?",
    hint: "Ask separately: same value? same object? falsy?",
    sol: { lang: "python", code: "[] == []          -> True   (same contents)\n[] is []          -> False  (two distinct empty lists)\nbool([])          -> False  (empty collections are falsy)\nbool([0])         -> True   (one item — the item's falsiness is irrelevant)\n\"\" == None        -> False  (different values entirely)\nbool(\"\") == bool(None)  -> True  (both falsy — which is exactly the trap)\n0 == False        -> True   (Python's bool is a subclass of int)\n0.1 + 0.2 == 0.3  -> False  (floating point)" },
    w: "The pair to stare at is lines 5 and 6: `\"\"` and `None` are not equal, and yet they are indistinguishable inside an `if`. That gap is where the empty-versus-missing bug lives." } },

  { vocab: ["Truthy and Falsy", "Truthy and Falsy", "Null"] }
 ],
 k: [
  "`==` compares contents; `is` / `===` asks whether it is literally the same object. Use `==` for values, `is None` for nothing.",
  "In JavaScript use `===` always. `==` converts types first and produces results that are not even transitive.",
  "Falsy values differ between languages — an empty list is falsy in Python and truthy in JavaScript.",
  "`if not x` merges *empty* with *missing*. When those mean different things, test for the one you actually mean."
 ],
 r: ["Truthy and Falsy", "Truthy and Falsy", "Null", "Floating Point"]
}

]);
