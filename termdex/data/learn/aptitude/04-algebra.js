/* Aptitude — algebra. */
TD.addLessons("aptitude", [

  {
    t: "Equations, Inequalities and the Word-Problem Setup",
    m: "algebra",
    lvl: "core",
    s: "Linear systems, the ages and coins classics, inequalities and modulus, and the setup discipline that decides whether a word problem takes one minute or five.",
    goal: [
      "Turn a paragraph into equations without losing a condition",
      "Solve two- and three-variable systems by elimination in the fewest steps",
      "Handle inequalities and modulus, including the sign flip everyone forgets"
    ],
    b: [
      { p: "Nobody fails an aptitude algebra question because they cannot solve 3x + 5 = 20. They fail because they translated the paragraph wrongly, or because they solved for x when the question asked for x + y. The algebra is easy. The setup and the final read are where the marks go." },

      { h: "The setup discipline" },

      {
        code: {
          lang: "text", t: "Four habits, in order",
          lines: [
            { c: "1. Name the variable as the thing the question asks for.", w: "**If it asks for the son's age, let x be the son's age.** Half the wasted time in this topic is solving for the wrong letter.", hi: true },
            { c: "", w: "" },
            { c: "2. Write one equation per sentence of the problem.", w: "A sentence that produces no equation is either context or a condition you have missed." },
            { c: "", w: "" },
            { c: "3. Count: n unknowns need n independent equations.", w: "If you have fewer, re-read — there is a constraint hiding in a word like *consecutive* or *two-digit*.", hi: true },
            { c: "", w: "" },
            { c: "4. Before computing, look at what is actually asked.", w: "Often it is x + y or xy, and the system gives that directly without solving for either." }
          ]
        }
      },

      { n: "Habit 4 is worth real marks. Given x + y = 10 and xy = 21, a question asking for x² + y² needs no solving at all: x² + y² = (x+y)² − 2xy = 100 − 42 = 58. Candidates who factorise to find x = 3 and y = 7 get the same answer three times slower.", nt: "Answer the question, not the system" },

      { h: "The identities that do the work" },

      {
        tbl: {
          t: "Worth knowing by reflex",
          h: ["Identity", "Most common use"],
          rows: [
            ["(a + b)² = a² + 2ab + b²", "Recovering a² + b² from a sum and a product"],
            ["(a − b)² = a² − 2ab + b²", "The pair above give (a+b)² − (a−b)² = 4ab"],
            ["a² − b² = (a + b)(a − b)", "Fast mental multiplication and factorising"],
            ["a³ + b³ = (a + b)(a² − ab + b²)", "Cubes questions and simplifications"],
            ["a³ − b³ = (a − b)(a² + ab + b²)", "Same"],
            ["a³ + b³ + c³ − 3abc = (a+b+c)(a²+b²+c² −ab−bc−ca)", "**If a + b + c = 0 then a³ + b³ + c³ = 3abc** — a whole question type"],
            ["x + 1/x = k ⇒ x² + 1/x² = k² − 2", "The reciprocal ladder; x³ + 1/x³ = k³ − 3k"]
          ]
        }
      },

      { h: "Two equations, two unknowns" },

      {
        code: {
          lang: "text", t: "Elimination, and reading the coefficients before you start",
          lines: [
            { c: "3x + 4y = 25", w: "" },
            { c: "5x - 2y = 19", w: "" },
            { c: "", w: "" },
            { c: "Look for the cheapest elimination: doubling the second makes", w: "" },
            { c: "the y terms cancel outright.", w: "**Scan for the smallest multiplier before doing any arithmetic.**", hi: true },
            { c: "", w: "" },
            { c: "  3x + 4y = 25", w: "" },
            { c: " 10x - 4y = 38", w: "" },
            { c: " -----------------", w: "" },
            { c: " 13x      = 63   ->  x = 63/13", w: "Non-integer: a signal to re-check the question, since exam answers usually come out clean.", hi: true },
            { c: "", w: "" },
            { c: "When both coefficients are awkward, substitution from whichever", w: "" },
            { c: "equation has a coefficient of 1 is usually faster.", w: "Choose the method from the numbers, not from habit." }
          ]
        }
      },

      {
        tbl: {
          t: "When a two-variable system has no unique answer",
          h: ["Condition on a₁x + b₁y = c₁ and a₂x + b₂y = c₂", "Meaning"],
          rows: [
            ["a₁/a₂ ≠ b₁/b₂", "**Unique solution** — the lines cross"],
            ["a₁/a₂ = b₁/b₂ ≠ c₁/c₂", "**No solution** — parallel lines"],
            ["a₁/a₂ = b₁/b₂ = c₁/c₂", "**Infinitely many** — the same line twice"]
          ]
        }
      },

      { h: "Word-problem archetypes" },

      {
        tbl: {
          t: "The setups that repeat",
          h: ["Type", "The setup that works"],
          rows: [
            ["**Ages**", "Write present ages as x and y. *Five years ago* is x−5 and y−5 — subtract from **both**"],
            ["**Two-digit number**", "10a + b. Reversing gives 10b + a; the difference is always 9(a−b)"],
            ["**Coins**", "Two equations: one counting coins, one counting value"],
            ["**Consecutive integers**", "n, n+1, n+2 — or n−1, n, n+1 to make the sums symmetric and cancel"],
            ["**Fractions**", "x/y; *numerator increased by 2* is (x+2)/y, not (x+2)/(y+2)"],
            ["**Boats, work, mixtures**", "These have their own lessons — recognise them and use those tools instead"]
          ]
        }
      },

      { n: "For consecutive-integer sums, centring the run on n makes terms cancel: three consecutive integers are n−1, n, n+1 with sum 3n; five are n−2 … n+2 with sum 5n. Any question of the form *the sum of five consecutive integers is 200* is then instantly n = 40.", nt: "Centre the run" },

      { h: "Inequalities" },

      {
        code: {
          lang: "text", t: "The rules, and the one that costs marks",
          lines: [
            { c: "Add or subtract anything:        direction unchanged", w: "" },
            { c: "Multiply or divide by a POSITIVE: direction unchanged", w: "" },
            { c: "Multiply or divide by a NEGATIVE: DIRECTION FLIPS", w: "**-2x > 6 gives x < -3, not x > -3.**", hi: true },
            { c: "", w: "" },
            { c: "Never multiply both sides by a variable of unknown sign.", w: "You do not know whether to flip, so the step is invalid. Split into cases instead.", hi: true },
            { c: "", w: "" },
            { c: "Reciprocals flip too, for same-signed quantities:", w: "" },
            { c: "  if 0 < a < b  then  1/a > 1/b", w: "" },
            { c: "", w: "" },
            { c: "Squaring is only safe when both sides are known non-negative.", w: "" }
          ]
        }
      },

      { h: "Modulus" },

      {
        code: {
          lang: "text", t: "Read |x| as distance from zero",
          lines: [
            { c: "|x| = a       ->  x = a  or  x = -a", w: "Two answers, and questions are built on candidates giving one." },
            { c: "|x| < a       ->  -a < x < a", w: "A band around zero.", hi: true },
            { c: "|x| > a       ->  x < -a  or  x > a", w: "Everything outside the band. Note it is 'or', not 'and'." },
            { c: "", w: "" },
            { c: "|x - 3| < 5   ->  -5 < x - 3 < 5  ->  -2 < x < 8", w: "**Read as: x is within 5 of 3.** That sentence solves most of them.", hi: true },
            { c: "", w: "" },
            { c: "|x - a| + |x - b| has its minimum for every x BETWEEN a and b,", w: "" },
            { c: "and that minimum is |a - b|.", w: "A standard question dressed up as a hard one." }
          ]
        }
      },

      {
        tryit: {
          t: "Setup, then solve",
          task: "(a) A father is three times as old as his son. Five years ago he was four times as old. Find their present ages. (b) The sum of the digits of a two-digit number is 12, and reversing the digits increases it by 18. Find the number. (c) Solve |2x − 5| ≥ 3.",
          hint: "(a) subtract 5 from both ages. (b) 10a + b, and the increase means the reversed number is larger. (c) two cases.",
          sol: { lang: "text", code: "(a) f = 3s\n    f - 5 = 4(s - 5)  ->  3s - 5 = 4s - 20  ->  s = 15, f = 45\n\n(b) a + b = 12\n    (10b + a) - (10a + b) = 18  ->  9(b - a) = 18  ->  b - a = 2\n    so b = 7, a = 5  ->  the number is 57\n\n(c) 2x - 5 >= 3   ->  x >= 4\n    2x - 5 <= -3  ->  x <= 1\n    answer: x <= 1  or  x >= 4" },
          w: "In (b), notice the difference of a two-digit number and its reverse is always a multiple of 9 — a fact worth carrying, because it eliminates options instantly whenever a reversal question gives you a difference."
        }
      }
    ],
    k: [
      "Name the variable as the quantity the question asks for.",
      "n unknowns need n independent equations. Fewer means you missed a condition.",
      "Check what is asked before solving — often (x+y) or xy comes out of the system directly.",
      "If a + b + c = 0 then a³ + b³ + c³ = 3abc.",
      "Multiplying an inequality by a negative flips the sign. Never multiply by an unknown-sign variable.",
      "|x − a| < b means x is within b of a.",
      "A two-digit number minus its reverse is always a multiple of 9."
    ],
    r: ["Algorithm"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "x^2 + y^2 = (x+y)^2 - 2xy", w: "answers without solving the system" },
        { c: "a+b+c = 0  ->  a^3+b^3+c^3 = 3abc", w: "a whole question type in one line" },
        { c: "multiply an inequality by a negative: flip the sign", w: "the most-lost mark in the topic" }
      ]
    }
  },

  {
    t: "Quadratics, Functions and Graphs",
    m: "algebra",
    lvl: "core",
    s: "Roots without solving, the discriminant, maximum and minimum values, function composition and the graph transformations that get asked.",
    goal: [
      "Read the sum and product of roots straight off the coefficients",
      "Use the discriminant to answer *nature of roots* questions in one step",
      "Find a maximum or minimum without calculus"
    ],
    b: [
      { p: "Most quadratic questions in aptitude tests never want the roots. They want their sum, their product, their signs, or the value of the expression at its turning point — all of which are readable from the coefficients without factorising anything." },

      { h: "Roots without solving" },

      {
        code: {
          lang: "text", t: "For ax^2 + bx + c = 0",
          lines: [
            { c: "sum of roots      =  -b/a", w: "**These two lines answer most quadratic questions in exams.**", hi: true },
            { c: "product of roots  =   c/a", w: "" },
            { c: "", w: "" },
            { c: "So a quadratic with roots p and q is:", w: "" },
            { c: "  x^2 - (p+q)x + pq = 0", w: "Build an equation from its roots in one line.", hi: true },
            { c: "", w: "" },
            { c: "x = (-b +/- sqrt(b^2 - 4ac)) / 2a", w: "Only when you genuinely need the values themselves." },
            { c: "", w: "" },
            { c: "difference of roots  =  sqrt(b^2 - 4ac) / |a|", w: "Useful when a question gives the difference." }
          ]
        }
      },

      {
        tbl: {
          t: "The discriminant D = b² − 4ac",
          h: ["D", "Roots", "Graph"],
          rows: [
            ["**D > 0**", "Two distinct real roots", "Crosses the x-axis twice"],
            ["**D = 0**", "Two equal real roots", "Touches the x-axis once"],
            ["**D < 0**", "No real roots (complex pair)", "Never touches the x-axis"],
            ["**D a perfect square** (with integer coefficients)", "Rational roots — it factorises", "A quick factorisability test"]
          ]
        }
      },

      { n: "Sign reading without solving: if the product c/a is **negative**, the roots have opposite signs. If it is positive, they share a sign — and the sum −b/a then tells you which. That is three questions answered off two coefficients.", nt: "The signs of the roots, free" },

      { h: "Maximum and minimum without calculus" },

      {
        code: {
          lang: "text", t: "Complete the square, or use the vertex",
          lines: [
            { c: "f(x) = ax^2 + bx + c has its turning point at x = -b/2a", w: "**The axis of symmetry, halfway between the roots.**", hi: true },
            { c: "", w: "" },
            { c: "a > 0  ->  opens upward  ->  that point is a MINIMUM", w: "" },
            { c: "a < 0  ->  opens downward ->  that point is a MAXIMUM", w: "The sign of a is the first thing to look at." },
            { c: "", w: "" },
            { c: "the extreme value itself = c - b^2/(4a),  i.e. -D/(4a)", w: "" },
            { c: "", w: "" },
            { c: "Example: f(x) = 2x^2 - 8x + 3", w: "" },
            { c: "  vertex at x = 8/4 = 2", w: "" },
            { c: "  f(2) = 8 - 16 + 3 = -5   -> minimum value -5", w: "Two lines, no calculus, no completing the square." }
          ]
        }
      },

      { n: "The related non-quadratic result is worth as much: for two positive numbers with a **fixed sum**, the product is largest when they are equal; with a **fixed product**, the sum is smallest when they are equal. That answers every *maximum area of a rectangle with a given perimeter* question instantly — a square, always.", nt: "Equal is extremal" },

      { h: "Functions" },

      {
        tbl: {
          t: "The function vocabulary that gets tested",
          h: ["Idea", "Meaning", "Test question"],
          rows: [
            ["**Domain**", "Inputs that are legal", "Denominators ≠ 0; even roots need a non-negative inside; logs need a positive"],
            ["**Range**", "Outputs that occur", "For a quadratic, everything above (or below) the vertex value"],
            ["**Composite** f(g(x))", "Apply g first, then f", "Order matters: f(g(x)) ≠ g(f(x)) in general"],
            ["**Inverse** f⁻¹", "Swap x and y, solve for y", "Only exists if f is one-to-one"],
            ["**Even function**", "f(−x) = f(x)", "Symmetric about the y-axis, e.g. x²"],
            ["**Odd function**", "f(−x) = −f(x)", "Symmetric about the origin, e.g. x³"],
            ["**Greatest integer** ⌊x⌋", "Largest integer not exceeding x", "⌊−2.3⌋ = −3, **not** −2 — the standard trap"]
          ]
        }
      },

      { trap: "The greatest-integer function rounds **down**, which for negative numbers means away from zero. ⌊2.7⌋ = 2 but ⌊−2.7⌋ = −3. Every question involving ⌊x⌋ on negative inputs is built on candidates truncating instead of flooring." },

      { h: "Graph transformations" },

      {
        code: {
          lang: "text", t: "Read a transformed graph off the base one",
          lines: [
            { c: "f(x) + k     ->  shift UP by k", w: "" },
            { c: "f(x) - k     ->  shift DOWN by k", w: "" },
            { c: "f(x + k)     ->  shift LEFT by k", w: "**Inside the bracket moves the opposite way to the sign.**", hi: true },
            { c: "f(x - k)     ->  shift RIGHT by k", w: "" },
            { c: "-f(x)        ->  reflect in the x-axis", w: "" },
            { c: "f(-x)        ->  reflect in the y-axis", w: "" },
            { c: "a*f(x)       ->  stretch vertically by a", w: "" },
            { c: "f(ax)        ->  squash horizontally by a", w: "Again the inside behaves inversely." },
            { c: "|f(x)|       ->  flip everything below the axis upward", w: "" },
            { c: "f(|x|)       ->  mirror the right-hand half onto the left", w: "These last two are different graphs; questions pair them deliberately.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Four without solving anything the long way",
          task: "(a) If the roots of x² − 7x + k = 0 differ by 3, find k. (b) For what values of m does mx² + 4x + 1 = 0 have equal roots? (c) Find the maximum value of −x² + 6x + 5. (d) If f(x) = 2x + 3 and g(x) = x², find f(g(2)) and g(f(2)).",
          hint: "(a) sum is 7 and difference is 3. (b) D = 0. (c) vertex.",
          sol: { lang: "text", code: "(a) sum = 7, difference = 3  ->  roots are 5 and 2\n    k = product = 10\n\n(b) D = 16 - 4m = 0  ->  m = 4\n\n(c) a = -1, so it opens downward; vertex at x = -6/(2 x -1) = 3\n    f(3) = -9 + 18 + 5 = 14  ->  maximum 14\n\n(d) f(g(2)) = f(4) = 11\n    g(f(2)) = g(7) = 49      (order matters)" },
          w: "Part (a) shows the pattern for the whole lesson: given the sum and the difference, the roots fall out by inspection, and the product answers the question — no quadratic formula anywhere."
        }
      }
    ],
    k: [
      "Sum of roots = −b/a; product = c/a. Most questions need only these.",
      "D > 0 distinct real, D = 0 equal, D < 0 no real roots.",
      "A negative product means the roots have opposite signs.",
      "The turning point is at x = −b/2a; a > 0 gives a minimum, a < 0 a maximum.",
      "Fixed sum ⇒ product maximal when the numbers are equal, and vice versa.",
      "⌊x⌋ floors, so ⌊−2.3⌋ = −3.",
      "Inside the bracket, transformations act in the opposite direction."
    ],
    r: ["Algorithm", "Derivative"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "sum = -b/a, product = c/a", w: "roots without solving" },
        { c: "D = b^2 - 4ac decides the nature of the roots", w: "one step, one answer" },
        { c: "vertex at x = -b/2a", w: "max or min without calculus" }
      ]
    }
  },

  {
    t: "Progressions, Logarithms and Series",
    m: "algebra",
    lvl: "intermediate",
    s: "AP, GP and HP, the sums worth memorising, infinite geometric series, and logarithm rules with the exam applications that use them.",
    goal: [
      "Identify AP, GP or HP from the wording and apply the right formula",
      "Sum a finite or infinite geometric series without deriving anything",
      "Use logarithms for digit-counting and comparison questions"
    ],
    b: [
      { p: "Progressions are the most formula-dense corner of aptitude, and also the most mechanical. Once you can classify the sequence in five seconds, the rest is substitution. Logarithms sit next to them because the two combine in the questions that ask how many digits a huge power has." },

      { h: "The three progressions" },

      {
        tbl: {
          t: "Classify first, then substitute",
          h: ["Type", "Recognise by", "nth term", "Sum of n terms"],
          rows: [
            ["**AP** — arithmetic", "Constant **difference**", "a + (n−1)d", "n/2 · [2a + (n−1)d] or n/2 · (first + last)"],
            ["**GP** — geometric", "Constant **ratio**", "arⁿ⁻¹", "a(rⁿ − 1)/(r − 1), for r ≠ 1"],
            ["**HP** — harmonic", "Reciprocals form an AP", "Take reciprocals, use the AP formula, invert back", "No neat closed form — always convert to AP"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "The results that answer questions on their own",
          lines: [
            { c: "AP: the average of the terms = the MIDDLE term", w: "**For an odd count. For an even count it is the mean of the middle two.**", hi: true },
            { c: "    so sum = n x (average) = n x (first + last)/2", w: "" },
            { c: "", w: "" },
            { c: "AP: any three consecutive terms  ->  write them a-d, a, a+d", w: "" },
            { c: "    four terms  ->  a-3d, a-d, a+d, a+3d", w: "Symmetric naming makes the sum collapse to 3a or 4a.", hi: true },
            { c: "", w: "" },
            { c: "GP: three terms  ->  a/r, a, ar   (product = a^3)", w: "The product question becomes trivial." },
            { c: "", w: "" },
            { c: "Infinite GP with |r| < 1:   S = a/(1 - r)", w: "**Only converges when |r| < 1. Check before using.**", hi: true },
            { c: "", w: "" },
            { c: "AM >= GM >= HM  for positive numbers, equal only when all equal.", w: "Answers many maximum and minimum questions directly." }
          ]
        }
      },

      { h: "The standard sums" },

      {
        tbl: {
          t: "Worth memorising outright",
          h: ["Series", "Sum"],
          rows: [
            ["1 + 2 + 3 + … + n", "n(n+1)/2"],
            ["1² + 2² + … + n²", "n(n+1)(2n+1)/6"],
            ["1³ + 2³ + … + n³", "[n(n+1)/2]² — the **square** of the first sum"],
            ["First n odd numbers: 1 + 3 + 5 + …", "n²"],
            ["First n even numbers: 2 + 4 + 6 + …", "n(n+1)"],
            ["Sum of an AP", "n/2 × (first + last)"]
          ]
        }
      },

      { n: "The first-n-odd-numbers result is a gift in disguise: any question that says *the sum of the first n odd numbers is 400* is answered by n = 20 immediately. Similarly the cubes result means 1³+2³+…+10³ = 55² = 3025 with no expansion at all.", nt: "Two that answer instantly" },

      { h: "Logarithms" },

      {
        code: {
          lang: "text", t: "The rules, and the two that actually get used",
          lines: [
            { c: "log(mn)    = log m + log n", w: "" },
            { c: "log(m/n)   = log m - log n", w: "" },
            { c: "log(m^k)   = k log m", w: "**The one that turns powers into multiplication — most-used by far.**", hi: true },
            { c: "log_b b    = 1        log_b 1 = 0", w: "" },
            { c: "", w: "" },
            { c: "change of base:  log_b a = log a / log b", w: "Any base, any calculator, any table." },
            { c: "  useful corollary:  log_b a x log_a b = 1", w: "" },
            { c: "", w: "" },
            { c: "Values worth carrying:  log10(2) = 0.3010, log10(3) = 0.4771", w: "" },
            { c: "  and so log10(5) = 1 - 0.3010 = 0.6990", w: "5 = 10/2, so its log is 1 minus log 2. Never memorised separately.", hi: true }
          ]
        }
      },

      { h: "Counting digits — the standard log application" },

      {
        code: {
          lang: "text", t: "How many digits are in 2^100 ?",
          lines: [
            { c: "number of digits in N = floor(log10 N) + 1", w: "**The only formula this application needs.**", hi: true },
            { c: "", w: "" },
            { c: "log10(2^100) = 100 x 0.3010 = 30.10", w: "" },
            { c: "digits = floor(30.10) + 1 = 31", w: "" },
            { c: "", w: "" },
            { c: "The fractional part also tells you the leading digits:", w: "" },
            { c: "  0.10 -> 10^0.10 = 1.26, so 2^100 starts with 126...", w: "Occasionally asked, and nobody expects you to know it." },
            { c: "", w: "" },
            { c: "Same method for trailing zeros of a big product, or for", w: "" },
            { c: "comparing 3^50 against 5^30 without computing either.", w: "Take logs of both and compare 50log3 with 30log5." }
          ]
        }
      },

      { trap: "Logs are only defined for **positive** arguments, and log 1 = 0 for every base, which means dividing by log x is unsafe when x might be 1. In equations like log(x−2) + log(x−3) = log(12), you must reject any root that makes an argument zero or negative — here x = 6 is valid and x = −1 is not, and questions are set precisely so that the invalid root is one of the options." },

      {
        tryit: {
          t: "One of each",
          task: "(a) The 7th term of an AP is 34 and the 13th is 64. Find the 20th term. (b) Sum the infinite series 8 + 4 + 2 + 1 + … (c) How many digits are in 3⁴⁰? (given log₁₀3 = 0.4771) (d) The sum of three numbers in GP is 38 and their product is 1728. Find them.",
          hint: "(a) two equations from the nth-term formula. (d) write them as a/r, a, ar.",
          sol: { lang: "text", code: "(a) a + 6d = 34,  a + 12d = 64\n    6d = 30  ->  d = 5, a = 4\n    20th term = 4 + 19 x 5 = 99\n\n(b) a = 8, r = 1/2  ->  S = 8/(1 - 1/2) = 16\n\n(c) 40 x 0.4771 = 19.084\n    digits = 19 + 1 = 20\n\n(d) a/r x a x ar = a^3 = 1728  ->  a = 12\n    12/r + 12 + 12r = 38  ->  12/r + 12r = 26\n    6r^2 - 13r + 6 = 0  ->  r = 3/2 or 2/3\n    the numbers are 8, 12, 18" },
          w: "Part (d) is the reason to name a GP as a/r, a, ar: the product collapses to a³ and hands you one variable for free. Naming a GP as a, ar, ar² makes the same question twice the work."
        }
      }
    ],
    k: [
      "AP nth term a + (n−1)d; sum n/2 × (first + last).",
      "In an AP, the average equals the middle term.",
      "Name three GP terms a/r, a, ar so the product becomes a³.",
      "Infinite GP sums to a/(1−r), and only when |r| < 1.",
      "Sum of the first n odd numbers is n²; sum of cubes is the square of the sum.",
      "log(mᵏ) = k log m is the rule that does most of the work.",
      "Digits in N = ⌊log₁₀N⌋ + 1.",
      "Reject log roots that make any argument non-positive."
    ],
    r: ["Big O Notation", "Algorithm"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "sum of AP = n/2 x (first + last)", w: "the form you will actually use" },
        { c: "infinite GP: S = a/(1-r), only if |r| < 1", w: "check convergence first" },
        { c: "digits in N = floor(log10 N) + 1", w: "every big-power question" }
      ]
    }
  }

]);
