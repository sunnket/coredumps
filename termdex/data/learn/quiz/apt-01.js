/* Aptitude — question bank, chapters 1-2.

   Numbers and calculation speed, then commercial arithmetic. These two
   chapters carry the rest of the track: percentages reappear in profit and
   loss, in interest, in data interpretation and in mixtures, and remainder
   cycles reappear everywhere a question says "the last digit of".

   Every worked solution shows the method a test rewards, not the method a
   textbook prefers. Where a sixty-second shortcut exists it is the solution,
   and the long way is mentioned only when the shortcut hides something. */

TD.addMCQ("aptitude", "numbers", [

  {
    tag: "Unit digits", lvl: "core",
    q: "What is the unit digit of 7^95?",
    o: ["1", "3", "7", "9"],
    a: 1,
    x: "Powers of 7 cycle 7, 9, 3, 1 with period 4. 95 leaves remainder 3 on division by 4, so the answer is the third term: **3**.",
    steps: [
      "Write the cycle: 7¹=7, 7²=49→9, 7³=343→3, 7⁴=2401→1. Period 4.",
      "95 ÷ 4 = 23 remainder **3**.",
      "Remainder 3 → third term of the cycle → **3**.",
      "A remainder of 0 means the *last* term of the cycle, not the first. That is the only trap here."
    ]
  },
  {
    tag: "Unit digits", lvl: "core",
    q: "What is the unit digit of 3^24?",
    o: ["1", "3", "7", "9"],
    a: 0,
    x: "Powers of 3 cycle 3, 9, 7, 1 with period 4. 24 is divisible by 4, so we take the last term of the cycle: **1**.",
    note: "Every digit's cycle length divides 4. Digits 0, 1, 5 and 6 never change; 4 and 9 have period 2; 2, 3, 7 and 8 have period 4."
  },
  {
    tag: "Trailing zeros", lvl: "intermediate",
    q: "How many zeros does 100! end in?",
    o: ["20", "24", "25", "10"],
    a: 1,
    x: "Trailing zeros come from factors of 10 = 2 × 5, and 5s are always scarcer, so count the 5s: ⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = **24**.",
    steps: [
      "⌊100/5⌋ = 20 — every fifth number contributes at least one 5.",
      "⌊100/25⌋ = 4 — the multiples of 25 contribute a second 5 each.",
      "⌊100/125⌋ = 0 — stop here.",
      "Total = 20 + 4 = **24**. Answering 20 is the standard mistake: it forgets that 25, 50, 75 and 100 each carry two 5s."
    ]
  },
  {
    tag: "Trailing zeros", lvl: "core",
    q: "How many zeros does 25! end in?",
    o: ["5", "6", "4", "7"],
    a: 1,
    x: "⌊25/5⌋ + ⌊25/25⌋ = 5 + 1 = **6**."
  },
  {
    tag: "HCF and LCM", lvl: "core",
    q: "What is the HCF of 72, 108 and 180?",
    o: ["12", "18", "36", "24"],
    a: 2,
    x: "72 = 2³·3², 108 = 2²·3³, 180 = 2²·3²·5. Take the **lowest** power of each shared prime: 2²·3² = **36**.",
    steps: [
      "Factorise all three: 72 = 2³·3²; 108 = 2²·3³; 180 = 2²·3²·5.",
      "The primes common to all three are 2 and 3.",
      "Lowest power of 2 present everywhere: 2². Lowest power of 3: 3².",
      "HCF = 4 × 9 = **36**."
    ]
  },
  {
    tag: "HCF and LCM", lvl: "core",
    q: "The HCF of two numbers is 13 and their LCM is 455. If one number is 65, the other is:",
    o: ["78", "91", "104", "117"],
    a: 1,
    x: "HCF × LCM = product of the two numbers. So the other = (13 × 455) ÷ 65 = 5915 ÷ 65 = **91**.",
    steps: [
      "The identity: **HCF × LCM = a × b**. It holds for exactly two numbers, never for three.",
      "13 × 455 = 5915.",
      "5915 ÷ 65 = **91**.",
      "Sanity check: HCF(65, 91) = 13 ✓ and LCM(65, 91) = 455 ✓."
    ]
  },
  {
    tag: "HCF and LCM", lvl: "intermediate",
    q: "What is the largest number that divides 1657 and 2037, leaving remainders 6 and 5 respectively?",
    o: ["127", "133", "115", "123"],
    a: 0,
    x: "Subtract the remainders first, then take the HCF: HCF(1657 − 6, 2037 − 5) = HCF(1651, 2032) = **127**.",
    steps: [
      "If *d* divides 1657 leaving 6, then *d* divides exactly into 1651.",
      "Likewise *d* divides exactly into 2037 − 5 = 2032.",
      "So *d* is the HCF of 1651 and 2032.",
      "2032 = 1×1651 + 381; 1651 = 4×381 + 127; 381 = 3×127 + 0 → HCF = **127**."
    ]
  },
  {
    tag: "HCF and LCM", lvl: "advanced",
    q: "Find the least number which, when divided by 5, 6, 7 and 8, leaves remainder 3 in each case, and is exactly divisible by 9.",
    o: ["1683", "1263", "1443", "2523"],
    a: 0,
    x: "The number is 840k + 3 (since LCM(5,6,7,8) = 840). Testing k = 2 gives 1683, and 1683 ÷ 9 = 187 exactly.",
    steps: [
      "LCM(5, 6, 7, 8) = 840, so the number has the form **840k + 3**.",
      "It must be divisible by 9. 840 leaves remainder 3 on division by 9 (digit sum 12 → 3).",
      "So 3k + 3 ≡ 0 (mod 9) → k + 1 ≡ 0 (mod 3) → the smallest k is **2**.",
      "840 × 2 + 3 = **1683**, and 1683 ÷ 9 = 187 ✓."
    ]
  },
  {
    tag: "LCM", lvl: "core",
    q: "What is the LCM of 12, 15 and 20?",
    o: ["30", "60", "120", "180"],
    a: 1,
    x: "12 = 2²·3, 15 = 3·5, 20 = 2²·5. Take the **highest** power of each prime: 2²·3·5 = **60**."
  },
  {
    tag: "Divisibility", lvl: "intermediate",
    q: "Which of these is divisible by 11?",
    o: ["34561", "45678", "91883", "72964"],
    a: 2,
    x: "For 91883 the alternating digit sum is 3 − 8 + 8 − 1 + 9 = 11, a multiple of 11. (91883 = 11 × 8353.)",
    steps: [
      "The rule for 11: alternately subtract and add digits from the right.",
      "34561 → 1 − 6 + 5 − 4 + 3 = −1. Not divisible.",
      "45678 → 8 − 7 + 6 − 5 + 4 = 6. Not divisible.",
      "91883 → 3 − 8 + 8 − 1 + 9 = **11** ✓ divisible."
    ]
  },
  {
    tag: "Divisibility", lvl: "core",
    q: "A number is divisible by 8 if…",
    o: [
      "its digit sum is divisible by 8",
      "its last three digits form a number divisible by 8",
      "its last two digits are divisible by 8",
      "it is even and divisible by 4"
    ],
    a: 1,
    x: "1000 is divisible by 8, so everything above the last three digits is already a multiple of 8. Only the last three digits can decide it.",
    note: "The same logic gives the whole family: 2 → last 1 digit, 4 → last 2, 8 → last 3, 16 → last 4. And 3 and 9 use digit sums, because 10 ≡ 1 modulo both."
  },
  {
    tag: "Factors", lvl: "core",
    q: "How many factors does 360 have?",
    o: ["18", "20", "24", "30"],
    a: 2,
    x: "360 = 2³ · 3² · 5¹. Add one to each exponent and multiply: (3+1)(2+1)(1+1) = 4 × 3 × 2 = **24**.",
    steps: [
      "Factorise: 360 = 8 × 45 = 2³ × 3² × 5.",
      "A factor picks 0-3 twos, 0-2 threes and 0-1 fives.",
      "That is 4 × 3 × 2 = **24** independent choices.",
      "Same method for the *sum* of factors, but with (1+2+4+8)(1+3+9)(1+5)."
    ]
  },
  {
    tag: "Factors", lvl: "intermediate",
    q: "What is the sum of all factors of 60?",
    o: ["144", "168", "180", "120"],
    a: 1,
    x: "60 = 2²·3·5. Sum = (1+2+4)(1+3)(1+5) = 7 × 4 × 6 = **168**.",
    note: "The formula is the expansion of the product: every term in the expansion is exactly one factor, so the sum of all terms is the sum of all factors."
  },
  {
    tag: "Remainders", lvl: "intermediate",
    q: "What is the remainder when 2^31 is divided by 5?",
    o: ["1", "2", "3", "4"],
    a: 2,
    x: "Powers of 2 modulo 5 cycle 2, 4, 3, 1 with period 4. 31 leaves remainder 3, so the answer is the third term: **3**.",
    steps: [
      "2¹≡2, 2²≡4, 2³≡3, 2⁴≡1 (mod 5). The cycle has length 4.",
      "31 ÷ 4 = 7 remainder **3**.",
      "Third term of the cycle = **3**.",
      "Check on a small case: 2⁷ = 128, and 128 ÷ 5 leaves 3 ✓ (7 also leaves remainder 3 on division by 4)."
    ]
  },
  {
    tag: "Remainders", lvl: "core",
    q: "What is the remainder when 17^23 is divided by 16?",
    o: ["0", "1", "15", "17"],
    a: 1,
    x: "17 ≡ 1 (mod 16), so 17²³ ≡ 1²³ = **1**.",
    note: "Reducing the base first is the whole technique. Any base of the form (multiple of n) + 1 raised to any power leaves remainder 1."
  },
  {
    tag: "Remainders", lvl: "advanced",
    q: "What is the remainder when 1! + 2! + 3! + … + 100! is divided by 5?",
    o: ["0", "2", "3", "4"],
    a: 2,
    x: "From 5! onwards every term contains a factor of 5 and contributes nothing. 1! + 2! + 3! + 4! = 1 + 2 + 6 + 24 = 33, and 33 leaves remainder **3**.",
    steps: [
      "5! = 120, which is divisible by 5 — and every larger factorial contains 5! as a factor.",
      "So only the first four terms matter.",
      "1 + 2 + 6 + 24 = 33.",
      "33 ÷ 5 = 6 remainder **3**."
    ]
  },
  {
    tag: "Primes", lvl: "core",
    q: "How many prime numbers are there below 50?",
    o: ["14", "15", "16", "17"],
    a: 1,
    x: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 — that is **15**.",
    note: "Worth memorising the count in bands: 15 below 50, 25 below 100. A question that asks 'how many primes between 50 and 100' is answered instantly as 25 − 15 = 10."
  },
  {
    tag: "Primes", lvl: "intermediate",
    q: "To test whether 221 is prime, what is the largest number you need to divide by?",
    o: ["110", "22", "14", "15"],
    a: 2,
    x: "You only need to test primes up to √221 ≈ 14.87, so up to **14**. (In fact 221 = 13 × 17, so it is not prime.)",
    note: "The reason: if n = a × b with both factors above √n, then a × b > n. So one factor must be at or below the square root."
  },
  {
    tag: "Surds", lvl: "core",
    q: "Simplify √50 + √18 − √8.",
    o: ["6√2", "4√2", "8√2", "60"],
    a: 0,
    x: "√50 = 5√2, √18 = 3√2, √8 = 2√2. So 5√2 + 3√2 − 2√2 = **6√2**.",
    steps: [
      "Pull the largest square factor out of each: 50 = 25×2, 18 = 9×2, 8 = 4×2.",
      "√50 = 5√2, √18 = 3√2, √8 = 2√2.",
      "All three now share √2 and can be added like terms.",
      "5 + 3 − 2 = 6, giving **6√2**."
    ]
  },
  {
    tag: "Surds", lvl: "intermediate",
    q: "Rationalise 1 / (√5 − √3).",
    o: ["(√5 + √3) / 2", "(√5 − √3) / 2", "(√5 + √3) / 8", "√5 + √3"],
    a: 0,
    x: "Multiply above and below by the conjugate √5 + √3. The denominator becomes 5 − 3 = 2.",
    steps: [
      "Multiply numerator and denominator by **√5 + √3**.",
      "Denominator: (√5 − √3)(√5 + √3) = 5 − 3 = **2**.",
      "Numerator: 1 × (√5 + √3) = √5 + √3.",
      "Result: **(√5 + √3) / 2**."
    ]
  },
  {
    tag: "Indices", lvl: "core",
    q: "Evaluate (2⁵)³ ÷ 2¹⁰.",
    o: ["2⁵", "2⁸", "2¹⁵", "2²⁵"],
    a: 0,
    x: "(2⁵)³ = 2¹⁵, and 2¹⁵ ÷ 2¹⁰ = 2⁵ = 32.",
    note: "The two rules doing the work: (aᵐ)ⁿ = aᵐⁿ, and aᵐ ÷ aⁿ = aᵐ⁻ⁿ. Confusing (2⁵)³ with 2⁵·³ is safe; confusing it with 2⁵+³ is the common slip."
  },
  {
    tag: "Indices", lvl: "core",
    q: "If 3ˣ = 81, what is x?",
    o: ["3", "4", "9", "27"],
    a: 1,
    x: "81 = 3⁴, so x = **4**."
  },
  {
    tag: "Roots", lvl: "core",
    q: "What is √0.0081?",
    o: ["0.9", "0.09", "0.009", "0.03"],
    a: 1,
    x: "0.0081 = 81 × 10⁻⁴, so the root is 9 × 10⁻² = **0.09**.",
    steps: [
      "Write it as a whole number times a power of ten: 0.0081 = 81 × 10⁻⁴.",
      "√81 = 9 and √(10⁻⁴) = 10⁻².",
      "9 × 10⁻² = **0.09**.",
      "Check by squaring: 0.09 × 0.09 = 0.0081 ✓. Always square back — decimal-place errors here are extremely common."
    ]
  },
  {
    tag: "Decimals", lvl: "intermediate",
    q: "Express the recurring decimal 0.363636… as a fraction in lowest terms.",
    o: ["36/100", "4/11", "36/99", "9/25"],
    a: 1,
    x: "A two-digit repeating block goes over 99: 36/99, which cancels by 9 to **4/11**.",
    steps: [
      "A repeating block of *n* digits sits over *n* nines. Here the block is 36, so 36/99.",
      "Divide top and bottom by 9: **4/11**.",
      "Check: 4 ÷ 11 = 0.3636… ✓",
      "36/99 is the same value but is not in lowest terms, which is what the question asked for."
    ]
  },
  {
    tag: "Decimals", lvl: "core",
    q: "Express 0.555… as a fraction.",
    o: ["5/9", "5/10", "1/2", "55/99"],
    a: 0,
    x: "A single repeating digit goes over 9: **5/9**."
  },
  {
    tag: "Comparing", lvl: "intermediate",
    q: "Which fraction is largest: 3/5, 5/8, 7/11, 2/3?",
    o: ["3/5", "5/8", "7/11", "2/3"],
    a: 3,
    x: "As decimals: 0.600, 0.625, 0.636, 0.667. The largest is **2/3**.",
    steps: [
      "Do not find a common denominator — under time pressure, divide.",
      "3/5 = 0.6; 5/8 = 0.625; 7/11 ≈ 0.636; 2/3 ≈ 0.667.",
      "**2/3** is largest.",
      "Faster still: all four are just above ½, and for such fractions the one with the largest (numerator − denominator/2) relative to its denominator wins. Decimals are safer under pressure."
    ]
  },
  {
    tag: "Mental maths", lvl: "core",
    q: "98 × 102 = ?",
    o: ["9996", "9998", "10004", "9986"],
    a: 0,
    x: "(100 − 2)(100 + 2) = 100² − 2² = 10000 − 4 = **9996**.",
    note: "The difference-of-squares trick applies whenever two numbers are equally spaced around a round number. It is worth actively looking for — it turns a long multiplication into a subtraction."
  },
  {
    tag: "Mental maths", lvl: "core",
    q: "47² = ?",
    o: ["2109", "2209", "2309", "2149"],
    a: 1,
    x: "(50 − 3)² = 2500 − 2(50)(3) + 9 = 2500 − 300 + 9 = **2209**.",
    steps: [
      "Move to the nearest round number: 47 = 50 − 3.",
      "Apply (a − b)² = a² − 2ab + b².",
      "2500 − 300 + 9 = **2209**.",
      "Squares to 30 should be memorised outright; beyond that, this expansion is faster than long multiplication every time."
    ]
  },
  {
    tag: "Mental maths", lvl: "core",
    q: "What is 3/8 as a percentage?",
    o: ["35%", "37.5%", "38%", "40%"],
    a: 1,
    x: "1/8 = 12.5%, so 3/8 = 3 × 12.5 = **37.5%**.",
    note: "The table that pays for itself in every exam: 1/2=50%, 1/3=33.33%, 1/4=25%, 1/5=20%, 1/6=16.67%, 1/7=14.29%, 1/8=12.5%, 1/9=11.11%, 1/11=9.09%, 1/12=8.33%."
  },
  {
    tag: "Mental maths", lvl: "intermediate",
    q: "1/7 expressed as a percentage is closest to:",
    o: ["12.5%", "14.29%", "16.67%", "11.11%"],
    a: 1,
    x: "1/7 = 0.142857… = **14.29%**.",
    note: "The digits 142857 repeat and simply rotate for 2/7, 3/7 and the rest — 2/7 = 0.285714…, 3/7 = 0.428571…. One memorised string covers all six sevenths."
  },
  {
    tag: "Series", lvl: "core",
    q: "What is the sum of the first 50 natural numbers?",
    o: ["1275", "1250", "2550", "1225"],
    a: 0,
    x: "n(n+1)/2 = 50 × 51 / 2 = **1275**."
  },
  {
    tag: "Series", lvl: "core",
    q: "What is 1² + 2² + 3² + … + 10²?",
    o: ["285", "385", "505", "355"],
    a: 1,
    x: "n(n+1)(2n+1)/6 = 10 × 11 × 21 / 6 = 2310 / 6 = **385**.",
    note: "The three worth knowing cold: Σn = n(n+1)/2, Σn² = n(n+1)(2n+1)/6, Σn³ = [n(n+1)/2]² — the last being the square of the first."
  },
  {
    tag: "Number system", lvl: "intermediate",
    q: "A number when divided by 5 leaves remainder 3, and when divided by 7 leaves remainder 4. What is the smallest such positive number?",
    o: ["18", "25", "32", "11"],
    a: 0,
    x: "Numbers leaving 3 on division by 5: 3, 8, 13, 18, 23… Of these, 18 leaves 18 − 14 = 4 on division by 7 ✓",
    steps: [
      "List the smaller condition first: 3, 8, 13, 18, 23, 28…",
      "Test each against the second condition. 3→3, 8→1, 13→6, **18→4** ✓",
      "So the smallest is **18**.",
      "The next such number is 18 + 35 = 53 — they repeat every LCM(5,7) = 35."
    ]
  },
  {
    tag: "Number system", lvl: "core",
    q: "The product of two consecutive even numbers is 168. What is the larger number?",
    o: ["12", "14", "16", "10"],
    a: 1,
    x: "12 × 14 = 168, so the larger is **14**.",
    note: "√168 ≈ 13, so the pair straddles 13. Taking the square root first turns a quadratic into a two-second scan — worth doing on every product-of-consecutives question."
  },
  {
    tag: "Number system", lvl: "intermediate",
    q: "If a number is divided by 899 the remainder is 63. What is the remainder when the same number is divided by 29?",
    o: ["5", "3", "8", "63"],
    a: 0,
    x: "899 = 29 × 31, so the number is 899k + 63. The first term is divisible by 29, so the remainder is 63 mod 29 = **5**.",
    steps: [
      "Write the number as 899k + 63.",
      "899 = 29 × 31, so 899k is a multiple of 29 and contributes no remainder.",
      "63 ÷ 29 = 2 remainder **5**.",
      "This works only because 29 divides 899. If it did not, the remainder would not be determined."
    ]
  },
  {
    tag: "Approximation", lvl: "intermediate",
    q: "Which is the fastest safe way to compare 17/23 and 22/29 under exam time pressure?",
    o: [
      "Find the LCM of 23 and 29 and convert both",
      "Cross-multiply: compare 17 × 29 against 22 × 23",
      "Convert both to decimals to four places",
      "Subtract one from the other"
    ],
    a: 1,
    x: "Cross-multiplication is two small products and one comparison: 17 × 29 = 493, 22 × 23 = 506. Since 493 < 506, **17/23 < 22/29**.",
    note: "It works because both denominators are positive, so multiplying both sides by 23 × 29 preserves the inequality. The LCM route gets the same answer and costs four times as long."
  }

]);


TD.addMCQ("aptitude", "arith", [

  {
    tag: "Percentages", lvl: "core",
    q: "What is 15% of 240?",
    o: ["32", "36", "38", "40"],
    a: 1,
    x: "10% = 24, 5% = 12, so 15% = **36**.",
    note: "Always build percentages from 10% and 1%. 15% = 10% + half of 10%; 35% = 3×10% + half. It is faster and far less error-prone than multiplying by 0.15."
  },
  {
    tag: "Percentages", lvl: "intermediate",
    q: "The price of rice rises by 25%. By what percentage must a family cut consumption to keep spending unchanged?",
    o: ["25%", "20%", "22.5%", "16.67%"],
    a: 1,
    x: "Required cut = 25/(100+25) × 100 = **20%**.",
    steps: [
      "Take 100 units of spending: 100 price × 1 quantity.",
      "New price is 125. To spend 100 again, quantity must be 100/125 = 0.8.",
      "That is a drop from 1 to 0.8, a fall of **20%**.",
      "The general formula: a rise of R% needs a cut of R/(100+R) × 100. It is not R% — that is the trap."
    ]
  },
  {
    tag: "Percentages", lvl: "core",
    q: "A number is increased by 20% and the result is then decreased by 20%. The net change is:",
    o: ["no change", "4% decrease", "4% increase", "2% decrease"],
    a: 1,
    x: "1.20 × 0.80 = 0.96, a **4% decrease**.",
    steps: [
      "Successive percentage changes multiply; they never add.",
      "1.2 × 0.8 = 0.96.",
      "0.96 means 96% of the original, so a **4% fall**.",
      "The quick formula for a rise then equal fall of x%: the net is always a fall of x²/100 per cent — here 400/100 = 4%."
    ]
  },
  {
    tag: "Percentages", lvl: "intermediate",
    q: "If A is 25% more than B, then B is what percentage less than A?",
    o: ["25%", "20%", "30%", "16.67%"],
    a: 1,
    x: "Let B = 100, so A = 125. B is 25 less than A, and 25/125 = **20%**.",
    note: "The base changes and that is the entire question. 'More than B' divides by B; 'less than A' divides by A. Almost every percentage trap in aptitude is this one wearing a different costume."
  },
  {
    tag: "Percentages", lvl: "intermediate",
    q: "In an exam, 65% of candidates passed and 420 failed. How many candidates sat the exam?",
    o: ["1000", "1200", "1400", "1500"],
    a: 1,
    x: "Failures were 35% of the total, so total = 420 ÷ 0.35 = **1200**.",
    steps: [
      "If 65% passed, 35% failed.",
      "35% of total = 420.",
      "Total = 420 × 100/35 = **1200**.",
      "Check: 65% of 1200 = 780 passed, 1200 − 780 = 420 ✓"
    ]
  },
  {
    tag: "Percentages", lvl: "intermediate",
    q: "In a two-candidate election the winner takes 60% of the votes and wins by 800 votes. How many votes were cast?",
    o: ["2000", "4000", "3200", "5000"],
    a: 1,
    x: "The margin is 60% − 40% = 20% of the total, and that equals 800. So total = 800 × 5 = **4000**.",
    steps: [
      "Winner 60%, loser 40%.",
      "The gap is 20 percentage points.",
      "20% of total = 800 → total = **4000**.",
      "Check: 2400 − 1600 = 800 ✓"
    ]
  },
  {
    tag: "Percentages", lvl: "core",
    q: "A salary is increased by 10% and then reduced by 10%. Compared with the original salary, the final figure is:",
    o: ["the same", "1% lower", "1% higher", "2% lower"],
    a: 1,
    x: "1.1 × 0.9 = 0.99 — **1% lower**. (Again x²/100 with x = 10.)"
  },
  {
    tag: "Percentages", lvl: "intermediate",
    q: "If the side of a square increases by 10%, its area increases by:",
    o: ["10%", "20%", "21%", "100%"],
    a: 2,
    x: "Area scales with the square of the side: 1.1² = 1.21, an increase of **21%**.",
    note: "Every 2-dimensional measure squares the factor and every 3-dimensional one cubes it. A 10% rise in radius raises volume by 1.1³ − 1 = 33.1%."
  },
  {
    tag: "Profit and loss", lvl: "core",
    q: "An article costing ₹400 is sold for ₹500. What is the profit percentage?",
    o: ["20%", "25%", "30%", "10%"],
    a: 1,
    x: "Profit = 100 on a cost of 400, and 100/400 = **25%**.",
    note: "Profit percentage is always on **cost price** unless the question explicitly says otherwise. Dividing by the selling price gives 20% — a distractor deliberately offered here."
  },
  {
    tag: "Profit and loss", lvl: "intermediate",
    q: "An article is sold for ₹680 at a loss of 15%. What was the cost price?",
    o: ["₹782", "₹800", "₹820", "₹765"],
    a: 1,
    x: "SP = 85% of CP, so CP = 680 ÷ 0.85 = **₹800**.",
    steps: [
      "A 15% loss means the selling price is 85% of cost.",
      "0.85 × CP = 680.",
      "CP = 680 × 100/85 = **800**.",
      "Check: 15% of 800 = 120, and 800 − 120 = 680 ✓"
    ]
  },
  {
    tag: "Profit and loss", lvl: "intermediate",
    q: "A profit of 20% on the cost price is what percentage of the selling price?",
    o: ["20%", "16.67%", "25%", "18%"],
    a: 1,
    x: "CP 100 → SP 120, profit 20. As a fraction of SP: 20/120 = **16.67%**.",
    note: "Margin (on selling price) and markup (on cost price) are different numbers for the same trade, and confusing them is a real commercial error, not just an exam one."
  },
  {
    tag: "Profit and loss", lvl: "advanced",
    q: "Two articles are sold at ₹600 each. One yields 20% profit and the other 20% loss. Overall the seller has:",
    o: ["no profit or loss", "a 4% loss", "a 4% profit", "a 2% loss"],
    a: 1,
    x: "Cost prices are 600/1.2 = 500 and 600/0.8 = 750, totalling 1250 against revenue of 1200 — a loss of 50 on 1250 = **4%**.",
    steps: [
      "Profitable article: CP = 600/1.2 = **500**.",
      "Loss-making article: CP = 600/0.8 = **750**.",
      "Total CP = 1250; total SP = 1200; loss = 50.",
      "50/1250 = **4% loss**. Whenever the same SP is used with equal profit and loss percentages, the result is always a loss of x²/100 per cent."
    ]
  },
  {
    tag: "Profit and loss", lvl: "advanced",
    q: "A trader buys 12 pens for ₹10 and sells 10 pens for ₹12. What is the profit percentage?",
    o: ["20%", "44%", "40%", "24%"],
    a: 1,
    x: "CP per pen = 10/12; SP per pen = 12/10. Profit ratio = (12/10) ÷ (10/12) = 144/100 = 1.44, so **44%**.",
    steps: [
      "Cost of one pen = 10/12 = 0.8333.",
      "Selling price of one pen = 12/10 = 1.2.",
      "Profit = 1.2 − 0.8333 = 0.3667 on a cost of 0.8333.",
      "0.3667 / 0.8333 = 0.44 → **44%**. Shortcut: (12×12)/(10×10) = 1.44 directly."
    ]
  },
  {
    tag: "Discount", lvl: "core",
    q: "An item marked at ₹1200 is offered at 20% off, then a further 10% off the reduced price. What is the final price?",
    o: ["₹840", "₹864", "₹880", "₹900"],
    a: 1,
    x: "1200 × 0.8 × 0.9 = **₹864**.",
    steps: [
      "First discount: 1200 × 0.8 = 960.",
      "Second discount applies to 960, not to 1200: 960 × 0.9 = **864**.",
      "Subtracting 30% in one step gives 840 — the classic wrong answer, and it is offered among the choices.",
      "Discounts, like all successive percentages, multiply."
    ]
  },
  {
    tag: "Discount", lvl: "intermediate",
    q: "Successive discounts of 20% and 10% are equivalent to a single discount of:",
    o: ["30%", "28%", "26%", "25%"],
    a: 1,
    x: "0.8 × 0.9 = 0.72, so 72% of the price is paid and **28%** is discounted.",
    note: "The two-discount formula: a + b − ab/100. Here 20 + 10 − 200/100 = 28. It generalises to any pair and saves a step."
  },
  {
    tag: "Simple interest", lvl: "core",
    q: "Find the simple interest on ₹5000 at 8% per annum for 3 years.",
    o: ["₹1200", "₹1300", "₹1400", "₹1500"],
    a: 0,
    x: "SI = PRT/100 = 5000 × 8 × 3 / 100 = **₹1200**."
  },
  {
    tag: "Simple interest", lvl: "intermediate",
    q: "At what rate of simple interest will a sum double itself in 8 years?",
    o: ["10%", "12.5%", "15%", "8%"],
    a: 1,
    x: "To double, the interest must equal the principal: 100 = 100 × R × 8 / 100, so R = **12.5%**.",
    steps: [
      "Take the principal as 100. Doubling means earning 100 in interest.",
      "100 = (100 × R × 8)/100 = 8R.",
      "R = **12.5%**.",
      "The general shortcut for simple interest: to become *n* times, R × T = (n − 1) × 100."
    ]
  },
  {
    tag: "Compound interest", lvl: "core",
    q: "Find the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually.",
    o: ["₹2000", "₹2100", "₹2200", "₹1900"],
    a: 1,
    x: "Amount = 10000 × 1.1² = 12100, so CI = **₹2100**.",
    steps: [
      "Year 1 interest: 1000. Balance 11,000.",
      "Year 2 interest: 10% of 11,000 = 1100. Balance 12,100.",
      "CI = 12,100 − 10,000 = **2100**.",
      "Simple interest would have been 2000 — the extra 100 is interest on the first year's interest."
    ]
  },
  {
    tag: "Compound interest", lvl: "intermediate",
    q: "The difference between compound and simple interest on a sum for 2 years at 10% per annum is ₹100. Find the sum.",
    o: ["₹8000", "₹10,000", "₹12,000", "₹15,000"],
    a: 1,
    x: "For 2 years the difference is P(R/100)². So 100 = P × 0.01, giving P = **₹10,000**.",
    steps: [
      "The two-year difference is exactly the interest on the first year's interest.",
      "Difference = P × (R/100)² = P × (10/100)² = P/100.",
      "P/100 = 100 → P = **10,000**.",
      "For three years the formula becomes P(R/100)²(300 + R)/100 — worth knowing, and rarely needed."
    ]
  },
  {
    tag: "Compound interest", lvl: "advanced",
    q: "A sum doubles in 5 years under compound interest. In how many years will it become 4 times?",
    o: ["10 years", "15 years", "20 years", "8 years"],
    a: 0,
    x: "Doubling twice gives 4×, and each doubling takes 5 years, so **10 years**.",
    note: "Under compound interest the multiples compose: 2× in 5 years means 4× in 10, 8× in 15. Under *simple* interest the same question gives 15 years, because simple interest adds rather than multiplies. Read which one the question means."
  },
  {
    tag: "Compound interest", lvl: "intermediate",
    q: "₹8000 is invested at 10% per annum compounded **half-yearly**. What is the amount after one year?",
    o: ["₹8800", "₹8820", "₹8840", "₹8600"],
    a: 1,
    x: "Half-yearly: rate becomes 5% and periods become 2. 8000 × 1.05² = 8000 × 1.1025 = **₹8820**.",
    steps: [
      "Halve the rate: 10% → 5% per half year.",
      "Double the periods: 1 year → 2 half years.",
      "8000 × 1.05 = 8400; 8400 × 1.05 = **8820**.",
      "Annual compounding would give only 8800 — more frequent compounding always yields more."
    ]
  },
  {
    tag: "Ratio", lvl: "core",
    q: "Two numbers are in the ratio 3 : 4 and their sum is 84. What is the larger number?",
    o: ["36", "42", "48", "52"],
    a: 2,
    x: "3 + 4 = 7 parts = 84, so one part = 12. The larger is 4 × 12 = **48**."
  },
  {
    tag: "Ratio", lvl: "intermediate",
    q: "If A : B = 2 : 3 and B : C = 4 : 5, then A : B : C is:",
    o: ["2 : 3 : 5", "8 : 12 : 15", "2 : 4 : 5", "6 : 9 : 10"],
    a: 1,
    x: "Make B common. Multiply the first ratio by 4 and the second by 3: A : B = 8 : 12 and B : C = 12 : 15, giving **8 : 12 : 15**.",
    steps: [
      "B appears as 3 in one ratio and 4 in the other. Their LCM is 12.",
      "A : B = 2 : 3 → ×4 → **8 : 12**.",
      "B : C = 4 : 5 → ×3 → **12 : 15**.",
      "Chain them: A : B : C = **8 : 12 : 15**."
    ]
  },
  {
    tag: "Ratio", lvl: "intermediate",
    q: "A starts a business with ₹5000 for 12 months; B joins with ₹6000 for 8 months. In what ratio should the profit be divided?",
    o: ["5 : 6", "5 : 4", "3 : 2", "2 : 1"],
    a: 1,
    x: "Profit follows money × time: A = 5000 × 12 = 60,000; B = 6000 × 8 = 48,000. Ratio 60 : 48 = **5 : 4**.",
    note: "The variable that matters is capital-months, never capital alone. A partner with more money for less time can still take the smaller share."
  },
  {
    tag: "Averages", lvl: "core",
    q: "The average of 5 numbers is 27. One number is removed and the average of the remaining 4 becomes 25. What was the number removed?",
    o: ["30", "33", "35", "37"],
    a: 2,
    x: "Total was 5 × 27 = 135; it is now 4 × 25 = 100. The removed number is 135 − 100 = **35**.",
    steps: [
      "Always convert averages to totals first. Averages cannot be added or subtracted; totals can.",
      "Original total = 5 × 27 = 135.",
      "New total = 4 × 25 = 100.",
      "Removed = **35**."
    ]
  },
  {
    tag: "Averages", lvl: "intermediate",
    q: "A car travels from A to B at 60 km/h and returns at 40 km/h. What is the average speed for the whole journey?",
    o: ["50 km/h", "48 km/h", "45 km/h", "52 km/h"],
    a: 1,
    x: "Equal distances → harmonic mean: 2 × 60 × 40 / (60 + 40) = 4800/100 = **48 km/h**.",
    steps: [
      "Take the one-way distance as 120 km (an LCM makes the arithmetic clean).",
      "Out: 120/60 = 2 hours. Back: 120/40 = 3 hours.",
      "Total 240 km in 5 hours = **48 km/h**.",
      "The plain average of 50 is wrong because more time is spent at the slower speed."
    ]
  },
  {
    tag: "Averages", lvl: "core",
    q: "What is the average of the first 10 even natural numbers?",
    o: ["10", "11", "12", "9"],
    a: 1,
    x: "2, 4, …, 20 is an evenly spaced list, so the average is (first + last)/2 = (2 + 20)/2 = **11**.",
    note: "For any evenly spaced sequence the average is the midpoint of the first and last terms. There is no need to sum anything."
  },
  {
    tag: "Averages", lvl: "intermediate",
    q: "The average age of 30 students is 14 years. Including the teacher, the average becomes 15. How old is the teacher?",
    o: ["44", "45", "46", "40"],
    a: 1,
    x: "Total before = 420; total after = 31 × 15 = 465. The teacher is 465 − 420 = **45**.",
    note: "The fast route: the teacher raises 30 existing students by 1 year each (30 years of 'lift') and must also cover their own place at the new average of 15. So 15 + 30 = 45."
  },
  {
    tag: "Mixtures", lvl: "intermediate",
    q: "40 litres of a mixture contains milk and water in the ratio 3 : 1. How much water must be added to make the ratio 1 : 1?",
    o: ["10 litres", "20 litres", "15 litres", "30 litres"],
    a: 1,
    x: "Milk = 30 L, water = 10 L. For 1 : 1 the water must equal the milk at 30 L, so add **20 litres**.",
    steps: [
      "3 : 1 over 40 litres → milk 30, water 10.",
      "Adding water does not change the milk, so milk stays at 30.",
      "For 1 : 1, water must reach 30.",
      "30 − 10 = **20 litres**."
    ]
  },
  {
    tag: "Alligation", lvl: "intermediate",
    q: "In what ratio must rice at ₹30/kg be mixed with rice at ₹40/kg to produce a mixture worth ₹34/kg?",
    o: ["2 : 3", "3 : 2", "1 : 1", "4 : 3"],
    a: 1,
    x: "By alligation the ratio is (40 − 34) : (34 − 30) = 6 : 4 = **3 : 2**.",
    steps: [
      "Write cheaper 30, dearer 40, mean 34.",
      "Cheaper share ∝ dearer − mean = 40 − 34 = 6.",
      "Dearer share ∝ mean − cheaper = 34 − 30 = 4.",
      "Ratio 6 : 4 = **3 : 2**. Note the cross: the *cheaper* quantity is proportional to the *dearer* difference."
    ]
  },
  {
    tag: "Mixtures", lvl: "advanced",
    q: "A vessel holds 20 litres of pure milk. 4 litres are removed and replaced with water. This is done twice in total. How much milk remains?",
    o: ["12.8 L", "12.0 L", "13.2 L", "16.0 L"],
    a: 0,
    x: "Each operation leaves a fraction (1 − 4/20) = 0.8 of the milk. After two operations: 20 × 0.8² = **12.8 L**.",
    steps: [
      "The replacement formula: remaining = P(1 − r/P)ⁿ, with P = 20, r = 4, n = 2.",
      "1 − 4/20 = 0.8.",
      "20 × 0.8 × 0.8 = **12.8 litres**.",
      "Check step by step: after the first swap 16 L milk; removing 4 L of that mixture removes 3.2 L of milk, leaving 12.8 ✓"
    ]
  },
  {
    tag: "Percentages", lvl: "advanced",
    q: "The population of a town rises by 10% in the first year and falls by 10% in the second. If it is now 99,000, what was it originally?",
    o: ["100,000", "99,000", "101,000", "98,010"],
    a: 0,
    x: "Net factor = 1.1 × 0.9 = 0.99. So original = 99,000 ÷ 0.99 = **100,000**.",
    note: "The answer being a round number is the confirmation, not the method. Working backwards through percentages always means dividing by the factor — never adding the percentage back."
  },
  {
    tag: "Profit and loss", lvl: "intermediate",
    q: "A shopkeeper marks goods 40% above cost and then gives a 25% discount. What is the profit percentage?",
    o: ["15%", "5%", "10%", "12.5%"],
    a: 1,
    x: "Take CP = 100. Marked = 140. After 25% off: 140 × 0.75 = 105. Profit = **5%**.",
    steps: [
      "CP = 100 → MP = 140.",
      "Discount is on the *marked* price: 140 × 0.75 = 105.",
      "SP = 105, so profit = 5 on 100 = **5%**.",
      "Subtracting 40 − 25 = 15% is the trap, and 15% is offered among the choices."
    ]
  },
  {
    tag: "Ratio", lvl: "advanced",
    q: "₹1200 is divided among A, B and C so that A gets half of what B and C get together, and B gets one-third of what A and C get together. How much does C get?",
    o: ["₹400", "₹500", "₹600", "₹700"],
    a: 1,
    x: "A = ⅓ of the total = 400; B = ¼ of the total = 300; so C = 1200 − 400 − 300 = **₹500**.",
    steps: [
      "A = ½(B + C) means A = ½(1200 − A), so 2A = 1200 − A → A = **400**.",
      "B = ⅓(A + C) means B = ⅓(1200 − B), so 3B = 1200 − B → B = **300**.",
      "C = 1200 − 400 − 300 = **500**.",
      "The shortcut: 'A gets half of the rest' always means A is 1/3 of the whole; 'one-third of the rest' means 1/4 of the whole."
    ]
  },
  {
    tag: "Percentages", lvl: "intermediate",
    q: "A student scores 30% and fails by 50 marks. Another scores 45% and gets 25 marks more than the pass mark. What are the total marks?",
    o: ["400", "500", "600", "450"],
    a: 1,
    x: "The 15-point gap in percentage equals 75 marks, so 1% = 5 marks and the total is **500**.",
    steps: [
      "Pass mark = 0.30T + 50 and also = 0.45T − 25.",
      "0.30T + 50 = 0.45T − 25.",
      "75 = 0.15T → T = **500**.",
      "Check: pass mark = 150 + 50 = 200; 45% of 500 = 225 = 200 + 25 ✓"
    ]
  },
  {
    tag: "Averages", lvl: "advanced",
    q: "The average of 11 numbers is 60. The average of the first 6 is 58 and of the last 6 is 63. What is the sixth number?",
    o: ["66", "65", "64", "68"],
    a: 0,
    x: "First 6 total 348, last 6 total 378, sum 726. The full 11 total 660, and the sixth number has been counted twice: 726 − 660 = **66**.",
    steps: [
      "Total of all 11 = 11 × 60 = 660.",
      "First six = 6 × 58 = 348. Last six = 6 × 63 = 378.",
      "348 + 378 = 726 counts the sixth number in both halves.",
      "Overlap = 726 − 660 = **66**."
    ]
  },
  {
    tag: "Simple interest", lvl: "intermediate",
    q: "A sum of ₹12,000 amounts to ₹15,600 in 3 years at simple interest. What is the rate?",
    o: ["8%", "10%", "12%", "9%"],
    a: 1,
    x: "Interest = 3600 over 3 years, so 1200 per year on 12,000 = **10%**.",
    steps: [
      "Interest earned = 15,600 − 12,000 = 3600.",
      "Per year = 3600/3 = 1200.",
      "Rate = 1200/12,000 = 0.10 = **10%**."
    ]
  },
  {
    tag: "Percentages", lvl: "core",
    q: "If 40% of a number is 96, what is 75% of the same number?",
    o: ["180", "160", "200", "150"],
    a: 0,
    x: "The number is 96 ÷ 0.4 = 240, and 75% of 240 = **180**.",
    note: "Faster without finding the number: 75/40 = 1.875, and 96 × 1.875 = 180. Scaling one percentage directly to another skips a step and a rounding risk."
  }

]);
