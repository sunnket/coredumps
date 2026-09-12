/* Aptitude — numbers and calculation speed. */
TD.addLessons("aptitude", [

  {
    t: "Calculation Speed — the foundation everything else stands on",
    m: "numbers",
    lvl: "core",
    s: "Before any topic: tables, squares, fraction-percentage equivalents and approximation. This is where the marks actually come from.",
    goal: [
      "Memorise the number facts that remove most written working",
      "Convert between fractions, decimals and percentages instantly",
      "Approximate safely, and know when approximation is unsafe"
    ],
    b: [
      { p: "Two candidates know identical theory. One scores in the 60th percentile and one in the 95th. The difference is almost never a formula. It is that one of them computes 17 × 23 in two seconds and the other writes it out." },

      { p: "At roughly 60 to 90 seconds per question, arithmetic done on paper eats the time you need for thinking. This lesson is unglamorous and it is the highest-return hour in the whole track." },

      { h: "What to memorise" },

      {
        tbl: {
          t: "The memorisation list, in priority order",
          h: ["Item", "Range", "Why"],
          rows: [
            ["**Multiplication tables**", "up to 20 × 20", "Appears in literally every question"],
            ["**Squares**", "1–30", "Quadratics, geometry, and spotting perfect squares"],
            ["**Cubes**", "1–15", "Number system and volume questions"],
            ["**Powers of 2**", "up to 2¹⁵ = 32768", "Number system, DI, computer-flavoured questions"],
            ["**Fraction ↔ percentage**", "1/2 down to 1/20", "The single highest-value table in aptitude"],
            ["**Primes**", "up to 100 (25 of them)", "Factorisation and divisibility"],
            ["**Square roots**", "√2 ≈ 1.414, √3 ≈ 1.732, √5 ≈ 2.236", "Geometry"]
          ]
        }
      },

      { h: "The fraction-percentage table" },

      { p: "Memorise this and percentage, profit-and-loss, interest and data interpretation all get faster at once. It is the most reused table in aptitude." },

      {
        tbl: {
          t: "Fractions as percentages",
          h: ["Fraction", "%", "Fraction", "%", "Fraction", "%"],
          rows: [
            ["1/2", "50", "1/8", "12.5", "1/14", "7.14"],
            ["1/3", "33.33", "1/9", "11.11", "1/15", "6.67"],
            ["1/4", "25", "1/10", "10", "1/16", "6.25"],
            ["1/5", "20", "1/11", "9.09", "1/18", "5.55"],
            ["1/6", "16.67", "1/12", "8.33", "1/20", "5"],
            ["1/7", "14.28", "1/13", "7.69", "1/25", "4"]
          ]
        }
      },

      { n: "Multiples come free. 3/8 = 3 × 12.5 = 37.5%. 5/6 = 5 × 16.67 = 83.33%. 4/7 = 4 × 14.28 = 57.14%. One table of twelve entries covers several hundred conversions.", nt: "Multiples come free" },

      { h: "Multiplication shortcuts worth knowing" },

      {
        code: {
          lang: "text", t: "Five patterns that cover most exam arithmetic",
          lines: [
            { c: "1. Squares ending in 5:   65^2", w: "" },
            { c: "   6 x (6+1) = 42, then append 25  ->  4225", w: "Works for every number ending in 5. 85² = 8×9=72 → 7225.", hi: true },
            { c: "", w: "" },
            { c: "2. Numbers near 100:      97 x 94", w: "" },
            { c: "   deficits 3 and 6.  97-6 = 91 (or 94-3),  3x6 = 18  ->  9118", w: "Base method. 108 × 106: 108+6 = 114, 8×6 = 48 → 11448.", hi: true },
            { c: "", w: "" },
            { c: "3. Difference of squares: 43 x 37", w: "" },
            { c: "   = (40+3)(40-3) = 1600 - 9 = 1591", w: "Use whenever the two numbers are equidistant from a round number.", hi: true },
            { c: "", w: "" },
            { c: "4. Multiply by 11:        43 x 11", w: "" },
            { c: "   4 _ 3 with 4+3=7 in the middle  ->  473", w: "Carry if the middle sum exceeds 9: 78 × 11 → 7|15|8 → 858." },
            { c: "", w: "" },
            { c: "5. Multiply by 5, 25, 50: 84 x 25", w: "" },
            { c: "   = 84 x 100 / 4 = 2100", w: "x5 = x10/2, x25 = x100/4, x50 = x100/2, x125 = x1000/8.", hi: true }
          ]
        }
      },

      { h: "Percentage arithmetic without writing anything" },

      {
        code: {
          lang: "text", t: "Three habits",
          lines: [
            { c: "A) Break the percentage into easy pieces", w: "" },
            { c: "   36% of 250  =  25% of 250  +  10%  +  1%", w: "" },
            { c: "               =  62.5 + 25 + 2.5  =  90", w: "10% and 1% are free; 25% is a quarter; 50% is half. Build any percentage from those.", hi: true },
            { c: "", w: "" },
            { c: "B) Swap the numbers - a% of b = b% of a", w: "" },
            { c: "   18% of 50  =  50% of 18  =  9", w: "This one saves genuine seconds and almost nobody uses it.", hi: true },
            { c: "", w: "" },
            { c: "C) Successive percentage change", w: "" },
            { c: "   up 20% then down 20%:  net = 20 - 20 - (20x20)/100 = -4%", w: "Formula: a + b + ab/100, with decreases negative. A rise then an equal fall always loses.", hi: true }
          ]
        }
      },

      { h: "Approximation: when it is safe" },

      { p: "Most data-interpretation questions and many quant questions can be answered by approximation alone. The skill is knowing how much error you can afford, which depends entirely on how far apart the options are." },

      {
        tbl: {
          t: "Approximation decision",
          h: ["Options are…", "Approximate to", "Example"],
          rows: [
            ["Far apart (>10% gaps)", "1 significant figure", "Options 120 / 340 / 780 — round everything hard"],
            ["Moderately apart (3–10%)", "2 significant figures", "Options 448 / 462 / 471 — keep two digits"],
            ["Close (<2%)", "**Do not approximate. Compute exactly, or skip.**", "Options 4.42 / 4.44 / 4.46 — this is a trap set for approximators"],
            ["One option is a round number", "Suspect it", "Exam writers place the *obvious* wrong answer where an error lands"]
          ]
        }
      },

      { trap: "**Approximation errors compound in the same direction.** If you round three numbers up and then divide by a number you rounded down, the error can easily exceed 5%. Round alternately — one up, one down — or track the direction of your error. In a DI set where two options are within 2%, exact computation is faster than approximating and then having to redo it." },

      { h: "Comparing fractions without computing them" },

      {
        code: {
          lang: "text", t: "Which is larger, 17/23 or 22/29?",
          lines: [
            { c: "Cross-multiply:  17 x 29 = 493      22 x 23 = 506", w: "Compare the cross-products. The larger product sits over the larger fraction." },
            { c: "506 > 493, so 22/29 is larger.", w: "Two multiplications instead of two divisions.", hi: true },
            { c: "", w: "" },
            { c: "Percentage-change shortcut for a/b vs (a+x)/(b+y):", w: "" },
            { c: "  if x/y > a/b, the fraction increases; otherwise it decreases", w: "Adding a fraction larger than the original pulls the whole thing up. This one line answers a great many DI questions.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Sixty seconds, no paper",
          task: "Compute mentally: (a) 95², (b) 106 × 104, (c) 37.5% of 320, (d) a price rises 25% then falls 20% — net change?",
          hint: "(a) squares ending in 5. (b) base 100. (c) 3/8. (d) a+b+ab/100.",
          sol: { lang: "text", code: "(a) 95^2   -> 9 x 10 = 90, append 25       = 9025\n(b) 106x104 -> 106+4 = 110, 6x4 = 24        = 11024\n(c) 37.5%  -> 3/8 of 320 = 120\n(d) 25 - 20 - (25x20)/100 = 25 - 20 - 5     = 0%  (no net change)" },
          w: "(d) is the useful one. A 25% rise followed by a 20% fall returns exactly to the start, because 1.25 × 0.80 = 1. That pair — and 20% up / 16.67% down, and 50% up / 33.33% down — appears constantly."
        }
      }
    ],
    k: [
      "Tables to 20, squares to 30, cubes to 15, powers of 2, and the fraction-percentage table are non-negotiable.",
      "a% of b = b% of a. Build any percentage from 50%, 25%, 10% and 1%.",
      "Successive percentage change: a + b + ab/100. An equal rise and fall always loses.",
      "Approximate according to how far apart the options are; when they are within 2%, approximation is the trap.",
      "Compare fractions by cross-multiplying rather than dividing."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "a% of b = b% of a", w: "the percentage swap" },
        { c: "net change = a + b + ab/100", w: "successive percentage change" },
        { c: "65^2 = 6x7 then append 25 = 4225", w: "squares ending in five" },
        { c: "97 x 94 = (97-6) | (3x6) = 9118", w: "base-100 multiplication" }
      ]
    }
  },

  {
    t: "Number System — divisibility, factors and the classification questions",
    m: "numbers",
    lvl: "core",
    s: "Divisibility rules, prime factorisation, counting factors, and the properties tested most often.",
    goal: [
      "Test divisibility by any number under 20 without dividing",
      "Use prime factorisation to count factors, sums of factors and trailing zeros",
      "Recognise the standard number-system question types on sight"
    ],
    b: [
      { h: "Classification" },

      {
        tbl: {
          t: "The vocabulary questions assume",
          h: ["Type", "Definition", "Watch for"],
          rows: [
            ["**Natural**", "1, 2, 3, …", "Excludes 0 in most Indian syllabi"],
            ["**Whole**", "0, 1, 2, 3, …", "Includes 0"],
            ["**Integers**", "…−2, −1, 0, 1, 2…", "Negatives count when a question says *integer*"],
            ["**Rational**", "expressible as p/q, q ≠ 0", "Terminating or recurring decimals"],
            ["**Irrational**", "√2, π, e", "Non-terminating, non-recurring"],
            ["**Prime**", "exactly two factors", "**1 is not prime. 2 is the only even prime.** Both are tested constantly"],
            ["**Composite**", "more than two factors", "1 is neither prime nor composite"],
            ["**Co-prime**", "HCF = 1", "They need not be prime themselves: 8 and 9 are co-prime"]
          ]
        }
      },

      { h: "Divisibility rules" },

      {
        tbl: {
          t: "Test without dividing",
          h: ["By", "Rule", "Example"],
          rows: [
            ["**2**", "Last digit even", "—"],
            ["**3**", "Digit sum divisible by 3", "12345 → 15 → yes"],
            ["**4**", "Last two digits divisible by 4", "1316 → 16 → yes"],
            ["**5**", "Ends in 0 or 5", "—"],
            ["**6**", "Divisible by 2 **and** 3", "—"],
            ["**7**", "Double the last digit, subtract from the rest; repeat", "343 → 34 − 6 = 28 → yes"],
            ["**8**", "Last three digits divisible by 8", "51232 → 232 → yes"],
            ["**9**", "Digit sum divisible by 9", "—"],
            ["**10**", "Ends in 0", "—"],
            ["**11**", "Alternating digit sum divisible by 11", "918082 → (9+8+8) − (1+0+2) = 22 → yes"],
            ["**12**", "Divisible by 3 **and** 4", "—"],
            ["**13**", "4 × last digit + rest; repeat", "637 → 63 + 28 = 91 → yes"],
            ["**25**", "Last two digits are 00, 25, 50, 75", "—"]
          ]
        }
      },

      { trap: "For composite divisors, check **co-prime** factors, not any factors. Divisible by 12 means divisible by 3 and by 4 — not by 2 and by 6, because 2 and 6 share a factor and the test would pass numbers that fail. Same reason 24 is tested as 3 and 8, not 4 and 6." },

      { h: "Prime factorisation: what it unlocks" },

      {
        syn: {
          t: "Everything below comes from one factorisation",
          parts: [
            { p: "N = " },
            { p: "2^a", w: "The exponent of each prime is what every formula below uses." },
            { p: " × " },
            { p: "3^b", w: "" },
            { p: " × " },
            { p: "5^c", w: "" },
            { p: " …" }
          ],
          after: "Take **720 = 2⁴ × 3² × 5¹** as the running example."
        }
      },

      {
        code: {
          lang: "text", t: "The four standard results",
          lines: [
            { c: "720 = 2^4 x 3^2 x 5^1", w: "" },
            { c: "", w: "" },
            { c: "Number of factors        = (4+1)(2+1)(1+1) = 30", w: "Add one to each exponent and multiply.", hi: true },
            { c: "Sum of factors           = (2^5-1)/(2-1) x (3^3-1)/(3-1) x (5^2-1)/(5-1)", w: "" },
            { c: "                         = 31 x 13 x 6 = 2418", w: "Product of geometric series, one per prime.", hi: true },
            { c: "Product of factors       = N^(30/2) = 720^15", w: "N to the power (number of factors / 2)." },
            { c: "Number of ways as a x b  = 30/2 = 15", w: "Half the factor count. If N is a perfect square, use (f+1)/2 for unordered pairs.", hi: true },
            { c: "", w: "" },
            { c: "Odd factors only: ignore the 2^4  -> (2+1)(1+1) = 6", w: "Drop the power of 2 entirely." },
            { c: "Even factors only: 30 - 6 = 24", w: "Total minus odd." }
          ]
        }
      },

      { h: "Trailing zeros in a factorial" },

      {
        code: {
          lang: "text", t: "How many zeros at the end of 100! ?",
          lines: [
            { c: "A trailing zero needs one 2 and one 5. Fives are scarcer, so count fives.", w: "This reasoning is the whole method.", hi: true },
            { c: "", w: "" },
            { c: "floor(100/5)   = 20", w: "" },
            { c: "floor(100/25)  = 4", w: "25 contributes a second five." },
            { c: "floor(100/125) = 0", w: "" },
            { c: "                ---", w: "" },
            { c: "                 24 trailing zeros", w: "**Keep dividing by increasing powers of 5 until the quotient is zero.**", hi: true }
          ]
        }
      },

      { h: "Highest power of a prime in n!" },

      { p: "The same method generalises. The highest power of prime *p* dividing *n*! is ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …" },

      { n: "For a **composite** divisor, factorise it first and take the binding constraint. The highest power of 12 in 50!: 12 = 2² × 3. Power of 2 in 50! is 47, so 2² gives 23. Power of 3 is 22. The answer is the smaller — **22**.", nt: "Composite divisors: take the minimum" },

      { h: "Question types you will see" },

      {
        tbl: {
          t: "Recognise these on sight",
          h: ["Type", "Approach"],
          rows: [
            ["How many factors does N have?", "Factorise, add one to each exponent, multiply"],
            ["How many zeros at the end of n!?", "Count fives"],
            ["Find the smallest N with exactly k factors", "Work backwards from k = product of (exponents + 1); put the largest exponents on the smallest primes"],
            ["Is N a perfect square?", "**Every exponent in the factorisation is even.** A perfect square always has an odd number of factors"],
            ["Sum of first n natural numbers", "n(n+1)/2"],
            ["Sum of first n squares", "n(n+1)(2n+1)/6"],
            ["Sum of first n cubes", "[n(n+1)/2]² — the square of the sum"],
            ["Number of digits in a^b", "⌊b · log₁₀a⌋ + 1"],
            ["Last digit of a^b", "Cyclicity of the unit digit — see the next lesson"]
          ]
        }
      },

      {
        tryit: {
          t: "One factorisation, four answers",
          task: "For N = 2520: how many factors, how many odd factors, how many ways can it be written as a product of two factors, and is it a perfect square?",
          hint: "2520 = 2³ × 3² × 5 × 7.",
          sol: { lang: "text", code: "2520 = 2^3 x 3^2 x 5^1 x 7^1\n\nFactors        = 4 x 3 x 2 x 2 = 48\nOdd factors    = drop 2^3 -> 3 x 2 x 2 = 12\nAs a x b       = 48 / 2 = 24 ways\nPerfect square = no; the exponents 3, 1 and 1 are odd\n                 (equivalently, 48 factors is even, and only perfect\n                  squares have an odd factor count)" },
          w: "Every one of those four answers came from a single factorisation. That is the pattern for the whole topic: factorise once, then read off whatever is asked."
        }
      }
    ],
    k: [
      "1 is not prime; 2 is the only even prime. Both are tested.",
      "For composite divisors, test co-prime factors: 12 as 3 and 4, never 2 and 6.",
      "Number of factors = product of (each exponent + 1). Odd factors = drop the power of 2.",
      "Trailing zeros in n! = count the fives: ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …",
      "A perfect square has all even exponents and an odd number of factors."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "factors of N = product of (exponent + 1)", w: "factor count from prime factorisation" },
        { c: "zeros in n! = n/5 + n/25 + n/125 ...", w: "trailing zeros by counting fives" },
        { c: "divisible by 11: alternating digit sum is a multiple of 11", w: "the divisibility rule people forget" }
      ]
    }
  },

  {
    t: "Remainders, Cyclicity and Unit Digits",
    m: "numbers",
    lvl: "intermediate",
    s: "The topic that looks hardest and is the most mechanical once you know four tools.",
    goal: [
      "Find the unit digit of any power using cyclicity",
      "Apply remainder theorems to reduce huge powers",
      "Handle the standard *find the remainder* and *find the smallest number* question types"
    ],
    b: [
      { h: "Unit digits: cyclicity" },

      { p: "Unit digits of powers repeat in a cycle of at most 4. That single fact answers every *what is the last digit of* question." },

      {
        tbl: {
          t: "Cycle of the unit digit",
          h: ["Ends in", "Cycle", "Length"],
          rows: [
            ["0, 1, 5, 6", "always itself", "1"],
            ["4", "4, 6", "2"],
            ["9", "9, 1", "2"],
            ["2", "2, 4, 8, 6", "4"],
            ["3", "3, 9, 7, 1", "4"],
            ["7", "7, 9, 3, 1", "4"],
            ["8", "8, 4, 2, 6", "4"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "Unit digit of 7^103",
          lines: [
            { c: "7 has cycle length 4:  7, 9, 3, 1", w: "" },
            { c: "103 mod 4 = 3", w: "**Divide the exponent by the cycle length and take the remainder.**", hi: true },
            { c: "3rd element of the cycle = 3", w: "" },
            { c: "Unit digit = 3", w: "" },
            { c: "", w: "" },
            { c: "Careful: if the remainder is 0, take the LAST element of the cycle.", w: "7^100: 100 mod 4 = 0 → take the 4th element → 1. This is the single most common slip in the topic.", hi: true }
          ]
        }
      },

      { h: "The remainder toolkit" },

      {
        tbl: {
          t: "Four tools, in the order you should try them",
          h: ["Tool", "Statement", "Use when"],
          rows: [
            ["**Split the base**", "Remainder of a product = product of remainders (then reduce again)", "Almost always the first move"],
            ["**Negative remainders**", "Remainder 6 mod 7 = remainder −1 mod 7", "Turns awkward numbers into ±1, which powers cleanly"],
            ["**Fermat's little theorem**", "If p is prime and a is not a multiple of p, then a^(p−1) ≡ 1 (mod p)", "Prime divisor"],
            ["**Euler's theorem**", "a^φ(n) ≡ 1 (mod n) when a and n are co-prime", "Composite divisor, co-prime base"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "Worked: remainder when 2^100 is divided by 7",
          lines: [
            { c: "Method 1 - find a small power that gives remainder 1", w: "" },
            { c: "  2^3 = 8, and 8 mod 7 = 1", w: "**The key step: find the power that collapses to 1.**", hi: true },
            { c: "  2^100 = 2^99 x 2 = (2^3)^33 x 2", w: "" },
            { c: "  = 1^33 x 2 = 2", w: "Remainder is 2." },
            { c: "", w: "" },
            { c: "Method 2 - Fermat, since 7 is prime", w: "" },
            { c: "  2^6 = 1 (mod 7)   [p-1 = 6]", w: "" },
            { c: "  100 mod 6 = 4", w: "" },
            { c: "  2^4 = 16 = 2 (mod 7)", w: "Same answer, and Fermat is faster when the small-power trick is not obvious.", hi: true }
          ]
        }
      },

      {
        code: {
          lang: "text", t: "Negative remainders: 25^30 divided by 26",
          lines: [
            { c: "25 = -1 (mod 26)", w: "**Rewriting 25 as −1 makes the whole thing trivial.**", hi: true },
            { c: "25^30 = (-1)^30 = 1 (mod 26)", w: "Even power → +1. Odd power → −1, which is 25." },
            { c: "Remainder = 1", w: "" },
            { c: "", w: "" },
            { c: "Same idea: 15^23 divided by 16", w: "" },
            { c: "  15 = -1 (mod 16), 23 is odd, so (-1)^23 = -1 = 15", w: "Remainder 15.", hi: true }
          ]
        }
      },

      { n: "Whenever the divisor is one more than the base — 25 and 26, 15 and 16, 99 and 100 — reach for negative remainders immediately. Exam writers construct these deliberately, so recognising the shape is worth more than the technique.", nt: "Spot the base = divisor − 1 pattern" },

      { h: "Euler's totient, when you need it" },

      {
        code: {
          lang: "text", t: "phi(n) and a worked example",
          lines: [
            { c: "phi(n) = n x (1 - 1/p1) x (1 - 1/p2) x ...   over distinct primes", w: "" },
            { c: "", w: "" },
            { c: "phi(100): 100 = 2^2 x 5^2", w: "" },
            { c: "  = 100 x (1/2) x (4/5) = 40", w: "**40 numbers below 100 are co-prime to 100.**", hi: true },
            { c: "", w: "" },
            { c: "Remainder of 3^1000 divided by 100:", w: "" },
            { c: "  3 and 100 are co-prime, so 3^40 = 1 (mod 100)", w: "" },
            { c: "  1000 mod 40 = 0", w: "" },
            { c: "  so 3^1000 = (3^40)^25 = 1 (mod 100)", w: "Remainder 1 — and this also gives the **last two digits** as 01.", hi: true }
          ]
        }
      },

      { h: "Standard question shapes" },

      {
        tbl: {
          t: "Recognise and route",
          h: ["Question", "Method"],
          rows: [
            ["Smallest number leaving remainder r on division by a, b, c", "LCM(a,b,c) × k + r"],
            ["Smallest number leaving remainders a−x, b−x, c−x", "LCM(a,b,c) − x — the *common negative remainder* case"],
            ["Largest number dividing a, b, c leaving the same remainder", "HCF of the pairwise differences"],
            ["Largest number dividing a, b, c leaving remainders p, q, r", "HCF of (a−p), (b−q), (c−r)"],
            ["Remainder of a huge power", "Split the base, then negative remainders, then Fermat or Euler"],
            ["Last two digits", "Work mod 100"],
            ["Remainder of a factorial by a prime p, where n ≥ p", "0 — p is a factor of n!"],
            ["Wilson's theorem", "(p−1)! ≡ −1 (mod p) for prime p"]
          ]
        }
      },

      { trap: "The *common negative remainder* case catches almost everyone. *Find the smallest number that leaves remainder 3 when divided by 5, remainder 5 when divided by 7, and remainder 9 when divided by 11.* Notice 5−3 = 2, 7−5 = 2, 11−9 = 2. The gap is constant, so the answer is **LCM(5,7,11) − 2 = 385 − 2 = 383**. Always check for a constant gap before starting a long congruence calculation." },

      {
        tryit: {
          t: "Three remainders",
          task: "(a) Unit digit of 13^57. (b) Remainder when 3^200 is divided by 11. (c) Smallest number leaving remainders 2, 3 and 4 when divided by 5, 6 and 7.",
          hint: "(a) cycle of 3. (b) Fermat with p = 11. (c) look for a constant gap.",
          sol: { lang: "text", code: "(a) 13 ends in 3; cycle 3,9,7,1 (length 4)\n    57 mod 4 = 1  ->  first element  ->  3\n\n(b) 11 is prime, so 3^10 = 1 (mod 11)\n    200 mod 10 = 0  ->  3^200 = 1 (mod 11)\n    Remainder = 1\n\n(c) 5-2 = 3, 6-3 = 3, 7-4 = 3  ->  constant gap of 3\n    LCM(5,6,7) = 210, so answer = 210 - 3 = 207\n    Check: 207/5 -> r2, 207/6 -> r3, 207/7 -> r4  correct" },
          w: "Part (c) would take several minutes by the Chinese Remainder Theorem and takes ten seconds once you spot the constant gap. Almost every hard-looking remainder question in an aptitude paper has a shortcut like this built into it deliberately."
        }
      }
    ],
    k: [
      "Unit digits cycle with length at most 4. Divide the exponent by the cycle length; a remainder of 0 means the last element.",
      "Try tools in order: split the base, negative remainders, Fermat, Euler.",
      "When the base is one less than the divisor, use −1 immediately.",
      "Smallest number with remainder r for several divisors = LCM × k + r; with a constant gap, LCM − gap.",
      "Largest number dividing several numbers with the same remainder = HCF of the differences."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "exponent mod cycle length; remainder 0 means the last element", w: "unit digit rule" },
        { c: "a^(p-1) = 1 (mod p) for prime p", w: "Fermat's little theorem" },
        { c: "constant gap -> answer is LCM minus the gap", w: "the common negative remainder case" }
      ]
    }
  },

  {
    t: "HCF, LCM, Surds and Indices",
    m: "numbers",
    lvl: "core",
    s: "The two workhorses of arithmetic word problems, plus the index and surd manipulation that algebra assumes.",
    goal: [
      "Compute HCF and LCM and know which one a word problem is asking for",
      "Apply the HCF/LCM standard question types",
      "Manipulate powers, roots and surds confidently"
    ],
    b: [
      { h: "HCF and LCM" },

      {
        tbl: {
          t: "Which one does the question want?",
          h: ["Signal in the question", "Answer", "Why"],
          rows: [
            ["*largest*, *maximum size*, *greatest number of*", "**HCF**", "You are splitting things into equal groups as large as possible"],
            ["*smallest*, *least*, *again together*, *simultaneously*", "**LCM**", "You are waiting for cycles to coincide"],
            ["Bells ring together / lights blink together", "LCM", "—"],
            ["Cutting rods or tiles into equal maximum pieces", "HCF", "—"],
            ["Smallest number divisible by all of a, b, c", "LCM", "—"],
            ["Largest number dividing all of a, b, c", "HCF", "—"],
            ["Two people running a circular track, meet at the start", "LCM of their lap times", "—"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "Computing both from a factorisation",
          lines: [
            { c: "72  = 2^3 x 3^2", w: "" },
            { c: "120 = 2^3 x 3^1 x 5^1", w: "" },
            { c: "", w: "" },
            { c: "HCF: lowest power of each COMMON prime", w: "" },
            { c: "     = 2^3 x 3^1 = 24", w: "Common primes only; 5 is excluded because 72 has none.", hi: true },
            { c: "", w: "" },
            { c: "LCM: highest power of EVERY prime that appears", w: "" },
            { c: "     = 2^3 x 3^2 x 5^1 = 360", w: "" },
            { c: "", w: "" },
            { c: "Check: HCF x LCM = 24 x 360 = 8640 = 72 x 120", w: "**HCF × LCM = product of the two numbers.** Only true for two numbers, never for three.", hi: true }
          ]
        }
      },

      { trap: "**HCF × LCM = a × b holds only for two numbers.** For three or more it is false, and it is a standard trap. If a question gives you the HCF and LCM of three numbers and asks for their product, the relationship does not exist." },

      {
        tbl: {
          t: "Fractions and the standard applications",
          h: ["Case", "Rule"],
          rows: [
            ["**HCF of fractions**", "HCF of numerators / LCM of denominators"],
            ["**LCM of fractions**", "LCM of numerators / HCF of denominators"],
            ["Smallest number divisible by a, b, c", "LCM"],
            ["Smallest number leaving remainder r with each", "LCM + r"],
            ["Smallest number leaving remainder 0 with each and lying in a range", "multiples of the LCM inside the range"],
            ["Two numbers with known HCF h", "Write them as h·x and h·y with x, y co-prime — this is the key move in most HCF word problems"]
          ]
        }
      },

      { n: "That last row is the technique worth remembering. *The HCF of two numbers is 12 and their sum is 84.* Write them as 12x and 12y with x and y co-prime: 12(x+y) = 84, so x+y = 7. Co-prime pairs summing to 7: (1,6), (2,5), (3,4). So the numbers are (12,72), (24,60) or (36,48).", nt: "Write them as h·x and h·y" },

      { h: "Indices" },

      {
        tbl: {
          t: "The laws, and the ones people get wrong",
          h: ["Law", "Statement", "Note"],
          rows: [
            ["Product", "aᵐ × aⁿ = a^(m+n)", "Same base only"],
            ["Quotient", "aᵐ ÷ aⁿ = a^(m−n)", "—"],
            ["Power of a power", "(aᵐ)ⁿ = a^(mn)", "—"],
            ["Power of a product", "(ab)ⁿ = aⁿbⁿ", "—"],
            ["Zero", "a⁰ = 1 for a ≠ 0", "0⁰ is undefined"],
            ["Negative", "a^(−n) = 1/aⁿ", "—"],
            ["Fractional", "a^(m/n) = ⁿ√(aᵐ)", "—"],
            ["**Tower**", "a^(mⁿ) means a^(m^n), evaluated **top down**", "2^(3²) = 2⁹ = 512, **not** (2³)² = 64. Tested regularly"]
          ]
        }
      },

      { h: "Comparing large powers" },

      {
        code: {
          lang: "text", t: "Which is larger, 2^40 or 3^30 ?",
          lines: [
            { c: "Make the exponents equal by taking a common factor: 10", w: "" },
            { c: "2^40 = (2^4)^10 = 16^10", w: "" },
            { c: "3^30 = (3^3)^10 = 27^10", w: "**Now compare the bases directly.**", hi: true },
            { c: "27 > 16, so 3^30 is larger.", w: "" },
            { c: "", w: "" },
            { c: "When exponents share no factor, take logs or compare n-th roots.", w: "" }
          ]
        }
      },

      { h: "Surds" },

      {
        tbl: {
          t: "Surd manipulation",
          h: ["Operation", "Method", "Example"],
          rows: [
            ["Simplify", "Pull out perfect squares", "√72 = √(36×2) = 6√2"],
            ["Add or subtract", "Only like surds combine", "3√5 + 2√5 = 5√5; √2 + √3 does not simplify"],
            ["Rationalise a single surd", "Multiply top and bottom by the surd", "1/√3 = √3/3"],
            ["Rationalise a binomial", "Multiply by the conjugate", "1/(2+√3) = (2−√3)/(4−3) = 2−√3"],
            ["Compare surds", "Raise both to the LCM of the root orders", "∛3 vs √2 → 3² = 9 vs 2³ = 8 → ∛3 is larger"],
            ["Nested surds", "Try to write as (√a ± √b)²", "√(7+4√3) = √(4+3+2·2·√3) = 2+√3"]
          ]
        }
      },

      { n: "Useful approximations to have memorised: √2 ≈ 1.414, √3 ≈ 1.732, √5 ≈ 2.236, √6 ≈ 2.449, √7 ≈ 2.646, √10 ≈ 3.162. They turn surd answers into decimals fast enough to match against options.", nt: "Six square roots worth knowing" },

      {
        tryit: {
          t: "Mixed practice",
          task: "(a) HCF of two numbers is 15 and their LCM is 300. If one is 60, find the other. (b) Simplify √(11 + 6√2). (c) Which is larger: 5⁴⁰ or 4⁵⁰?",
          hint: "(a) HCF × LCM = product. (b) look for (√a + √b)². (c) common exponent factor of 10.",
          sol: { lang: "text", code: "(a) 15 x 300 = 60 x other  ->  other = 4500/60 = 75\n\n(b) 11 + 6root2 = 9 + 2 + 2 x 3 x root2 = (3 + root2)^2\n    so root(11 + 6root2) = 3 + root2\n\n(c) 5^40 = (5^4)^10 = 625^10\n    4^50 = (4^5)^10 = 1024^10\n    1024 > 625, so 4^50 is larger" },
          w: "In (b), the method is always the same: write the number as a² + b² + 2ab. Here 6√2 = 2 × 3 × √2, so a = 3 and b = √2, and a² + b² = 9 + 2 = 11 confirms it."
        }
      }
    ],
    k: [
      "*Largest, maximum* means HCF. *Smallest, together again* means LCM.",
      "HCF takes the lowest power of common primes; LCM takes the highest power of all primes.",
      "HCF × LCM = product of the numbers — for two numbers only.",
      "In HCF word problems, write the numbers as h·x and h·y with x and y co-prime.",
      "Powers stack top down: 2^(3²) = 2⁹, not 64.",
      "Compare large powers by forcing a common exponent."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "HCF x LCM = product of the two numbers", w: "true for two numbers only" },
        { c: "HCF of fractions = HCF of numerators / LCM of denominators", w: "the fraction rule people invert" },
        { c: "write the two numbers as hx and hy with x, y co-prime", w: "the key move in HCF word problems" }
      ]
    }
  }

]);
