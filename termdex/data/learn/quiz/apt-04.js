/* Aptitude — question bank, chapters 7-8.

   Data interpretation, then logical reasoning.

   DI is not a maths chapter. The arithmetic in a DI set is deliberately
   easy; what is being tested is whether you can read a table under a clock,
   approximate without fear, and recognise the one set in four that is a
   trap. Every caselet below carries its data inline, so it can be attempted
   exactly as it would be in a test — by reading, not by scrolling.

   Logical reasoning is the opposite: no arithmetic at all, and the entire
   difficulty is in translating a sentence into a constraint without adding
   an assumption nobody made. */

TD.addMCQ("aptitude", "di", [

  {
    tag: "Tables", lvl: "core",
    q: "A company's revenue in ₹ crore was: 2019 — 40, 2020 — 55, 2021 — 50, 2022 — 70, 2023 — 85. In which year was the percentage growth over the previous year highest?",
    o: ["2022", "2020", "2023", "2021"],
    a: 0,
    x: "2022 grew 20 on a base of 50 = **40%**, which beats 2020's 15 on 40 = 37.5%.",
    steps: [
      "2020: (55 − 40)/40 = **37.5%**.",
      "2021: (50 − 55)/55 = −9.1% — a fall.",
      "2022: (70 − 50)/50 = **40.0%**.",
      "2023: (85 − 70)/70 = **21.4%**. The highest is **2022**."
    ],
    note: "2020 has the eye-catching jump and 2023 the largest absolute rise, but percentage growth is measured against the base — and 2022's base is the smallest of the three. Always divide."
  },
  {
    tag: "Tables", lvl: "core",
    q: "Revenue in ₹ crore: 2019 — 40, 2020 — 55, 2021 — 50, 2022 — 70, 2023 — 85. What is the average annual revenue over the five years?",
    o: ["60", "62", "58", "65"],
    a: 0,
    x: "(40 + 55 + 50 + 70 + 85)/5 = 300/5 = **60**."
  },
  {
    tag: "Tables", lvl: "intermediate",
    q: "Revenue in ₹ crore: 2019 — 40, 2020 — 55, 2021 — 50, 2022 — 70, 2023 — 85. By what percentage did revenue grow across the whole period, from 2019 to 2023?",
    o: ["112.5%", "45%", "212.5%", "100%"],
    a: 0,
    x: "(85 − 40)/40 = 45/40 = 1.125 = **112.5%** growth.",
    note: "212.5% is what 85 is *of* 40. 'Growth of' and 'is what percent of' differ by exactly 100 percentage points, and both are always offered."
  },
  {
    tag: "Pie charts", lvl: "intermediate",
    q: "A monthly budget of ₹36,000 is split: rent 35%, food 20%, transport 10%, savings 25%, other 10%. How much goes to rent?",
    o: ["₹12,600", "₹12,000", "₹9,000", "₹7,200"],
    a: 0,
    x: "35% of 36,000 = **₹12,600**.",
    steps: [
      "10% of 36,000 = 3,600.",
      "30% = 10,800.",
      "5% = 1,800.",
      "35% = 10,800 + 1,800 = **12,600**."
    ]
  },
  {
    tag: "Pie charts", lvl: "intermediate",
    q: "Budget ₹36,000: rent 35%, food 20%, transport 10%, savings 25%, other 10%. How many degrees would the savings slice occupy on a pie chart?",
    o: ["90°", "25°", "72°", "120°"],
    a: 0,
    x: "25% of 360° = **90°**.",
    note: "The conversion is 1% = 3.6°. Questions asking for degrees rather than rupees are testing only whether you noticed the change of unit."
  },
  {
    tag: "Pie charts", lvl: "advanced",
    q: "Budget ₹36,000: rent 35%, food 20%, transport 10%, savings 25%, other 10%. Rent rises by 20% and everything else is unchanged. What is the new total spend?",
    o: ["₹38,520", "₹43,200", "₹37,800", "₹40,000"],
    a: 0,
    x: "Rent rises from 12,600 to 15,120, an increase of 2,520. New total = 36,000 + 2,520 = **₹38,520**.",
    steps: [
      "Rent = 35% of 36,000 = 12,600.",
      "A 20% rise adds 2,520.",
      "Nothing else changes, so the total rises by exactly that amount.",
      "36,000 + 2,520 = **38,520**. Raising the whole budget by 20% gives 43,200 — the trap, and it is offered."
    ]
  },
  {
    tag: "Bar charts", lvl: "core",
    q: "Units sold per quarter: Q1 — 1,200, Q2 — 1,500, Q3 — 900, Q4 — 1,800. What fraction of the year's sales fell in Q4?",
    o: ["1/3", "1/4", "2/5", "3/10"],
    a: 0,
    x: "Total = 1,200 + 1,500 + 900 + 1,800 = 5,400. Q4's share = 1,800/5,400 = **1/3**.",
    note: "Sum the column before you do anything else. Roughly a third of DI questions need the total, and computing it once serves the whole set."
  },
  {
    tag: "Bar charts", lvl: "intermediate",
    q: "Units per quarter: Q1 — 1,200, Q2 — 1,500, Q3 — 900, Q4 — 1,800. By what percentage did Q3 fall short of Q2?",
    o: ["40%", "60%", "66.7%", "35%"],
    a: 0,
    x: "(1500 − 900)/1500 = 600/1500 = **40%**.",
    steps: [
      "The base for 'fell short of Q2' is **Q2**, not Q3.",
      "Difference = 600.",
      "600/1500 = **40%**.",
      "Dividing by 900 instead gives 66.7% — a distractor that catches anyone who takes the base from the wrong bar."
    ]
  },
  {
    tag: "Bar charts", lvl: "intermediate",
    q: "Units per quarter: Q1 — 1,200, Q2 — 1,500, Q3 — 900, Q4 — 1,800. What is the ratio of the best quarter to the worst?",
    o: ["2 : 1", "3 : 2", "9 : 5", "4 : 3"],
    a: 0,
    x: "1,800 : 900 = **2 : 1**."
  },
  {
    tag: "Line graphs", lvl: "intermediate",
    q: "Monthly active users, in thousands: Jan 120, Feb 132, Mar 145, Apr 138, May 160, Jun 176. In how many months did users fall compared with the previous month?",
    o: ["1", "2", "0", "3"],
    a: 0,
    x: "Only April (145 → 138) is a fall. Every other month rose, so the answer is **1**."
  },
  {
    tag: "Line graphs", lvl: "advanced",
    q: "Monthly users in thousands: Jan 120, Feb 132, Mar 145, Apr 138, May 160, Jun 176. What was the approximate average month-on-month growth rate from Jan to Jun?",
    o: ["About 8%", "About 47%", "About 12%", "About 4%"],
    a: 0,
    x: "Users grew from 120 to 176 over 5 steps — a total factor of 1.467. The fifth root of 1.467 is about 1.08, so roughly **8% per month**.",
    steps: [
      "Total growth factor = 176/120 ≈ **1.467**.",
      "That is spread over 5 month-to-month steps, not 6.",
      "Compound growth: 1.08⁵ ≈ 1.469, which matches closely.",
      "So about **8% a month**. Dividing 47% by 5 gives 9.4% — close enough to mislead, and wrong in principle because growth compounds."
    ]
  },
  {
    tag: "Caselets", lvl: "intermediate",
    q: "A shop sold 480 items. 40% were books, and one quarter of the books were textbooks. How many textbooks were sold?",
    o: ["48", "120", "192", "60"],
    a: 0,
    x: "Books = 40% of 480 = 192. Textbooks = 192/4 = **48**.",
    steps: [
      "40% of 480 = **192** books.",
      "One quarter of those = 192/4 = **48**.",
      "192 (all books) and 120 (a quarter of 480) are both offered — each is one step short or one step wrong.",
      "Chained percentages: always resolve them one layer at a time."
    ]
  },
  {
    tag: "Caselets", lvl: "advanced",
    q: "Of 800 employees, 60% are engineers and 45% of the engineers are women. There are 300 women in total. How many non-engineer employees are women?",
    o: ["84", "216", "140", "180"],
    a: 0,
    x: "Engineers = 480; women engineers = 45% of 480 = 216. Non-engineer women = 300 − 216 = **84**.",
    steps: [
      "Engineers = 60% of 800 = **480**.",
      "Women engineers = 45% of 480 = **216**.",
      "Total women = 300.",
      "Non-engineer women = 300 − 216 = **84**."
    ]
  },
  {
    tag: "Mixed sets", lvl: "intermediate",
    q: "Production in tonnes across four plants: A 250, B 320, C 180, D 250. What percentage of total production came from plant B?",
    o: ["32%", "30%", "35%", "28%"],
    a: 0,
    x: "Total = 1,000, so B's share is 320/1000 = **32%**.",
    note: "A total of exactly 1,000 is a gift: every value is already its own percentage times ten. Adding the column first is always worth the five seconds."
  },
  {
    tag: "Approximation", lvl: "advanced",
    q: "Which is the safest way to compute 4,873 ÷ 19,847 as a percentage under time pressure?",
    o: [
      "Round to 4,900 / 19,850 ≈ 4,900/20,000 = 24.5%, then note the true answer is slightly higher",
      "Long-divide to three decimal places",
      "Round both to one significant figure: 5,000/20,000 = 25%",
      "Estimate it as one fifth without adjusting"
    ],
    a: 0,
    x: "Rounding the denominator *up* to 20,000 makes the estimate too low, so the true value is a little above 24.5% — which is enough to separate four options.",
    steps: [
      "4,873/19,847 ≈ 4,900/20,000 = **24.5%**.",
      "Knowing the *direction* of the rounding error is what makes approximation safe: the denominator was rounded up, so the real answer is higher.",
      "The exact value is 24.55%.",
      "DI options are usually 4-5 percentage points apart. Approximating to within 1% is almost always enough, and it is four times faster."
    ]
  },
  {
    tag: "Strategy", lvl: "advanced",
    q: "You have 15 minutes and four DI sets of 5 questions each. What is the best opening move?",
    o: [
      "Spend 60 seconds scanning all four sets and picking the two with the cleanest data",
      "Start at set 1 and work through in order",
      "Attempt the first question of every set, then decide",
      "Start with the set that has the largest table, since it has most information"
    ],
    a: 0,
    x: "One set in four is usually a trap — unit mismatches, a missing total, percentages of different bases. A minute spent choosing is worth more than a minute spent solving.",
    note: "The warning signs of a set to skip: values given in different units, a chart with no absolute totals (only percentages), or a question stem that refers to data the chart does not contain."
  },
  {
    tag: "Ratios in DI", lvl: "intermediate",
    q: "Exports and imports in ₹ crore: 2021 — exports 240, imports 300; 2022 — exports 320, imports 350. In which year was the export-to-import ratio higher?",
    o: ["2022", "2021", "They were equal", "Cannot be determined"],
    a: 0,
    x: "2021: 240/300 = 0.80. 2022: 320/350 ≈ 0.914. The ratio was higher in **2022**.",
    steps: [
      "2021: 240/300 = **0.80**.",
      "2022: 320/350 = **0.914**.",
      "Higher in **2022**.",
      "Cross-multiplication is faster than dividing: 240 × 350 = 84,000 versus 320 × 300 = 96,000, so the second fraction is larger."
    ]
  },
  {
    tag: "Ratios in DI", lvl: "advanced",
    q: "Exports 240 and imports 300 in 2021; exports 320 and imports 350 in 2022. By what percentage did the trade deficit shrink?",
    o: ["50%", "30%", "20%", "40%"],
    a: 0,
    x: "Deficit fell from 60 to 30, a fall of 30 on a base of 60 = **50%**.",
    steps: [
      "2021 deficit = 300 − 240 = **60**.",
      "2022 deficit = 350 − 320 = **30**.",
      "Change = 30, base = 60.",
      "30/60 = **50%**."
    ]
  },
  {
    tag: "Averages in DI", lvl: "intermediate",
    q: "Scores of five students: 62, 78, 55, 91, 64. How many scored above the group average?",
    o: ["2", "3", "1", "4"],
    a: 0,
    x: "Total = 350, average = 70. Only 78 and 91 exceed it, so **2**.",
    note: "Summing before comparing is the only reliable route. Eyeballing 'about average' fails whenever one value is far from the rest, which is exactly when it is tested."
  },
  {
    tag: "Caselets", lvl: "advanced",
    q: "A survey of 500 people found 320 use product X, 260 use product Y, and 140 use both. How many use neither?",
    o: ["60", "80", "120", "40"],
    a: 0,
    x: "Union = 320 + 260 − 140 = 440, so 500 − 440 = **60** use neither.",
    steps: [
      "n(X ∪ Y) = 320 + 260 − 140 = **440**.",
      "Neither = 500 − 440 = **60**.",
      "X only = 180, Y only = 120, both = 140, neither = 60 — and 180+120+140+60 = 500 ✓",
      "Always run that final check. It catches an arithmetic slip in about two seconds."
    ]
  },
  {
    tag: "Growth", lvl: "intermediate",
    q: "A metric rises from 250 to 400. What is the percentage increase?",
    o: ["60%", "37.5%", "160%", "150%"],
    a: 0,
    x: "(400 − 250)/250 = 150/250 = **60%**.",
    note: "37.5% is the fall from 400 to 250 — the same pair of numbers, the other direction, a different base. Both are always offered."
  },
  {
    tag: "Tables", lvl: "advanced",
    q: "Four salespeople sold: A 120 units at ₹500 each, B 90 at ₹800, C 150 at ₹400, D 60 at ₹1,100. Who generated the most revenue?",
    o: ["B — ₹72,000", "D — ₹66,000", "C — ₹60,000", "A — ₹60,000"],
    a: 0,
    x: "A = 60,000; B = 72,000; C = 60,000; D = 66,000. The highest is **B at ₹72,000**.",
    steps: [
      "A: 120 × 500 = 60,000.",
      "B: 90 × 800 = **72,000**.",
      "C: 150 × 400 = 60,000.",
      "D: 60 × 1,100 = 66,000. The person with the most *units* (C) earns the least alongside A — which is the whole point of the question."
    ]
  },
  {
    tag: "Percent of percent", lvl: "advanced",
    q: "In a town, 60% of residents own a vehicle. Of those, 25% own a car and the rest own two-wheelers. What percentage of all residents own two-wheelers?",
    o: ["45%", "75%", "15%", "40%"],
    a: 0,
    x: "Two-wheeler owners = 75% of 60% = 0.75 × 60 = **45%** of all residents.",
    steps: [
      "Take 100 residents. Vehicle owners = 60.",
      "Car owners = 25% of 60 = 15.",
      "Two-wheeler owners = 60 − 15 = **45**.",
      "So **45%** of everyone. Answering 75% takes the percentage of the wrong population."
    ]
  },
  {
    tag: "Data sufficiency", lvl: "advanced",
    q: "A chart shows each region's share of total sales as a percentage, but gives no absolute figures. Which question can you answer?",
    o: [
      "The ratio of the North region's sales to the South region's",
      "The rupee value of the North region's sales",
      "How much the North grew since last year",
      "Whether the North exceeded its target"
    ],
    a: 0,
    x: "Percentages of the same total preserve ratios but carry no absolute information. Without one real number, no rupee value can be recovered.",
    note: "This is the most common DI trap of all: a percentage chart followed by a question asking for an amount. Recognising it early is worth two minutes, because the set is unanswerable and must be skipped."
  },
  {
    tag: "Weighted average", lvl: "advanced",
    q: "A class of 40 averages 62 marks; another of 60 averages 72. What is the combined average?",
    o: ["68", "67", "70", "66"],
    a: 0,
    x: "Total = 40(62) + 60(72) = 2,480 + 4,320 = 6,800 over 100 students = **68**.",
    steps: [
      "Never average the averages — the groups are different sizes.",
      "Totals: 40 × 62 = 2,480 and 60 × 72 = 4,320.",
      "Combined total = 6,800 over 100 students.",
      "= **68**. The plain average of 62 and 72 is 67, and it is offered."
    ]
  }

]);


TD.addMCQ("aptitude", "logical", [

  {
    tag: "Number series", lvl: "core",
    q: "What comes next: 2, 6, 12, 20, 30, …?",
    o: ["42", "40", "36", "44"],
    a: 0,
    x: "The gaps are 4, 6, 8, 10, so the next gap is 12: 30 + 12 = **42**.",
    steps: [
      "Write the differences: 6−2=4, 12−6=6, 20−12=8, 30−20=10.",
      "The differences increase by 2 each time, so the next is 12.",
      "30 + 12 = **42**.",
      "Equivalently the terms are n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, **6×7 = 42**."
    ]
  },
  {
    tag: "Number series", lvl: "intermediate",
    q: "What comes next: 3, 6, 12, 24, 48, …?",
    o: ["96", "72", "60", "144"],
    a: 0,
    x: "Each term doubles: 48 × 2 = **96**."
  },
  {
    tag: "Number series", lvl: "intermediate",
    q: "What comes next: 1, 4, 9, 16, 25, …?",
    o: ["36", "30", "35", "49"],
    a: 0,
    x: "Perfect squares: 1², 2², 3², 4², 5², so the next is 6² = **36**."
  },
  {
    tag: "Number series", lvl: "advanced",
    q: "What comes next: 2, 3, 5, 7, 11, 13, …?",
    o: ["17", "15", "16", "19"],
    a: 0,
    x: "These are the prime numbers in order, so the next is **17**.",
    note: "When the differences make no pattern, check three things before anything else: primes, squares, and the Fibonacci rule (each term the sum of the previous two)."
  },
  {
    tag: "Number series", lvl: "advanced",
    q: "What comes next: 1, 1, 2, 3, 5, 8, 13, …?",
    o: ["21", "18", "20", "26"],
    a: 0,
    x: "Fibonacci — each term is the sum of the two before it: 8 + 13 = **21**."
  },
  {
    tag: "Odd one out", lvl: "intermediate",
    q: "Which does not belong: 8, 27, 64, 100, 125?",
    o: ["100", "8", "64", "125"],
    a: 0,
    x: "8, 27, 64 and 125 are 2³, 3³, 4³ and 5³. **100** is a perfect square, not a cube."
  },
  {
    tag: "Letter series", lvl: "intermediate",
    q: "What comes next: A, C, F, J, O, …?",
    o: ["U", "S", "T", "R"],
    a: 0,
    x: "The gaps grow by one each time: +2, +3, +4, +5, so next is +6. O(15) + 6 = **U**(21).",
    steps: [
      "Convert to positions: A=1, C=3, F=6, J=10, O=15.",
      "Differences: 2, 3, 4, 5 — increasing by one.",
      "Next difference is 6: 15 + 6 = **21**.",
      "Position 21 is **U**. Writing the alphabet with numbers before you start is worth ten seconds on any letter-series question."
    ]
  },
  {
    tag: "Coding", lvl: "core",
    q: "If CAT is coded as DBU, how is DOG coded?",
    o: ["EPH", "EOG", "CPF", "FQI"],
    a: 0,
    x: "Each letter moves forward one place: D→E, O→P, G→H, giving **EPH**."
  },
  {
    tag: "Coding", lvl: "intermediate",
    q: "If in a code MOUSE is written as PRXVH, how is TIGER written?",
    o: ["WLJHU", "WLJHT", "VLJHU", "WKJHU"],
    a: 0,
    x: "Each letter shifts forward by 3: T→W, I→L, G→J, E→H, R→U = **WLJHU**.",
    steps: [
      "M(13) → P(16): +3. Check another: O(15) → R(18): +3 ✓",
      "Apply +3 to every letter of TIGER.",
      "T→W, I→L, G→J, E→H, R→U.",
      "**WLJHU**. Always verify the shift on a second letter before applying it — some codes shift by a different amount per position."
    ]
  },
  {
    tag: "Coding", lvl: "advanced",
    q: "In a certain code, 'ROSE' is written as 'TQUG'. What is the pattern?",
    o: [
      "Each letter moves forward two places",
      "Each letter moves back two places",
      "The letters are reversed",
      "Vowels move forward, consonants back"
    ],
    a: 0,
    x: "R→T, O→Q, S→U, E→G — every letter advances by **two places**."
  },
  {
    tag: "Blood relations", lvl: "intermediate",
    q: "Pointing to a photograph, a man says: *She is the daughter of my grandfather's only son.* How is she related to him?",
    o: ["His sister", "His daughter", "His niece", "His cousin"],
    a: 0,
    x: "His grandfather's only son is his own father, so the woman is his father's daughter — his **sister**.",
    steps: [
      "Work from the inside out: *my grandfather's only son*.",
      "The speaker's father is a son of his grandfather; 'only son' means that is the one.",
      "So the phrase resolves to *my father*.",
      "*The daughter of my father* = his **sister**."
    ]
  },
  {
    tag: "Blood relations", lvl: "advanced",
    q: "A is B's sister. C is B's mother. D is C's father. How is A related to D?",
    o: ["Granddaughter", "Daughter", "Grandmother", "Niece"],
    a: 0,
    x: "C is A's mother too (since A and B are siblings), and D is C's father — so D is A's grandfather and A is his **granddaughter**.",
    note: "Draw it. Three vertical levels and a horizontal line for siblings solves almost every blood-relation question in under thirty seconds, and holding the chain in your head solves almost none."
  },
  {
    tag: "Directions", lvl: "core",
    q: "A man walks 3 km north, then 4 km east. How far is he from his starting point?",
    o: ["5 km", "7 km", "1 km", "12 km"],
    a: 0,
    x: "North and east are perpendicular, so the displacement is √(3² + 4²) = **5 km**."
  },
  {
    tag: "Directions", lvl: "intermediate",
    q: "Facing north, a man turns 90° clockwise, then 180° anticlockwise. Which way is he facing?",
    o: ["West", "East", "South", "North"],
    a: 0,
    x: "North → 90° clockwise → East → 180° anticlockwise → **West**.",
    steps: [
      "Start: north.",
      "90° clockwise: east.",
      "180° from east, in either direction, is west.",
      "Facing **west**. Sketching a compass cross takes three seconds and removes every sign error."
    ]
  },
  {
    tag: "Directions", lvl: "advanced",
    q: "A man walks 5 km south, 3 km west, 5 km north and 7 km east. How far is he from the start, and in which direction?",
    o: ["4 km east", "4 km west", "2 km east", "10 km east"],
    a: 0,
    x: "The 5 km south and 5 km north cancel. West 3 and east 7 net to **4 km east**.",
    steps: [
      "North-south: −5 then +5 = **0**.",
      "East-west: −3 then +7 = **+4**.",
      "So he is 4 km east of the start.",
      "Resolving into two axes first is always faster than tracing the path."
    ]
  },
  {
    tag: "Syllogisms", lvl: "intermediate",
    q: "All cats are animals. All animals need water. Which conclusion definitely follows?",
    o: [
      "All cats need water",
      "All animals are cats",
      "Some animals are not cats",
      "Only cats need water"
    ],
    a: 0,
    x: "The two universal statements chain: cats ⊆ animals ⊆ things needing water, so **all cats need water**.",
    steps: [
      "Draw the circles: cats inside animals, animals inside 'needs water'.",
      "Anything inside cats is therefore inside 'needs water'.",
      "The reverse containments are not given, so nothing about 'all animals are cats' follows.",
      "*Some animals are not cats* feels obviously true in the world, but the premises do not state it — and syllogisms are judged only on the premises."
    ]
  },
  {
    tag: "Syllogisms", lvl: "advanced",
    q: "Some doctors are writers. All writers are creative. What follows?",
    o: [
      "Some doctors are creative",
      "All doctors are creative",
      "Some writers are doctors, and all doctors are creative",
      "No conclusion follows"
    ],
    a: 0,
    x: "The doctors who are writers must be creative, so **some doctors are creative**. Nothing is claimed about the rest.",
    note: "The rule of thumb: a 'some' premise can only ever produce a 'some' conclusion. A universal conclusion needs two universal premises."
  },
  {
    tag: "Syllogisms", lvl: "advanced",
    q: "No birds are mammals. All parrots are birds. What follows?",
    o: [
      "No parrots are mammals",
      "Some parrots are mammals",
      "All mammals are parrots",
      "No conclusion follows"
    ],
    a: 0,
    x: "Parrots sit entirely inside birds, and birds are entirely outside mammals, so **no parrots are mammals**."
  },
  {
    tag: "Seating", lvl: "intermediate",
    q: "Five friends sit in a row. B is to the immediate right of A. C is at one end. D is between B and E. Who could be at the other end?",
    o: ["A or E", "B only", "D only", "C only"],
    a: 0,
    x: "With C fixed at one end, the AB pair and the D-between-B-and-E constraint force the arrangement C-A-B-D-E, so the other end is **E** — and reversing gives A at the far end in the mirrored case.",
    steps: [
      "AB must be adjacent in that order.",
      "D sits between B and E, so the block is B-D-E (or E-D-B).",
      "Combining: A-B-D-E is forced as a block of four.",
      "C takes an end, so the row is C-A-B-D-E or A-B-D-E-C — the far end is **E or A**."
    ]
  },
  {
    tag: "Seating", lvl: "advanced",
    q: "In a circular arrangement of 6 people facing the centre, what does 'to the immediate left of X' mean for an observer looking at the diagram?",
    o: [
      "The position that appears clockwise from X on the page",
      "The position that appears anticlockwise from X on the page",
      "The same as immediate right",
      "It cannot be determined"
    ],
    a: 0,
    x: "People facing the centre have their left where the page shows clockwise. Getting this backwards inverts an entire puzzle.",
    note: "The one thing to fix before drawing anything: whether they face the centre or face outwards. Facing outwards reverses left and right, and papers switch between the two deliberately."
  },
  {
    tag: "Clocks", lvl: "intermediate",
    q: "What is the angle between the hands of a clock at 3:30?",
    o: ["75°", "90°", "60°", "105°"],
    a: 0,
    x: "The minute hand is at 180°; the hour hand is at 3.5 × 30 = 105°. The gap is **75°**.",
    steps: [
      "Minute hand: 30 minutes × 6° per minute = **180°**.",
      "Hour hand: it has moved half an hour past 3, so 3.5 × 30° = **105°**.",
      "Difference = 180 − 105 = **75°**.",
      "Forgetting that the hour hand also moves is what produces the wrong answer of 90°."
    ]
  },
  {
    tag: "Clocks", lvl: "advanced",
    q: "How many times do the hands of a clock overlap in 24 hours?",
    o: ["22", "24", "12", "23"],
    a: 0,
    x: "The hands overlap 11 times in 12 hours, not 12 — so **22 times** in a day.",
    note: "Between 11 and 1 there is only one overlap (at roughly 12:00), which is why one is lost from each 12-hour cycle."
  },
  {
    tag: "Calendars", lvl: "intermediate",
    q: "If 1 January 2024 was a Monday, what day was 1 February 2024?",
    o: ["Thursday", "Wednesday", "Friday", "Tuesday"],
    a: 0,
    x: "January has 31 days; 31 mod 7 = 3, so add 3 days to Monday → **Thursday**.",
    steps: [
      "Count the days from 1 Jan to 1 Feb: exactly 31.",
      "31 ÷ 7 = 4 remainder **3** — the odd days.",
      "Monday + 3 = **Thursday**.",
      "Only the remainder matters; whole weeks return you to the same day."
    ]
  },
  {
    tag: "Calendars", lvl: "advanced",
    q: "Which of these is a leap year?",
    o: ["2000", "1900", "2100", "2200"],
    a: 0,
    x: "A century year is a leap year only if divisible by 400. **2000** qualifies; 1900, 2100 and 2200 do not.",
    note: "The full rule: divisible by 4 is a leap year, except centuries, except centuries divisible by 400. It exists because the year is 365.2422 days, not 365.25."
  },
  {
    tag: "Cubes", lvl: "intermediate",
    q: "A 3×3×3 cube is painted on all faces and then cut into 27 unit cubes. How many have exactly three painted faces?",
    o: ["8", "12", "6", "1"],
    a: 0,
    x: "Only the corner cubes meet three faces, and a cube has **8 corners**.",
    steps: [
      "3 painted faces = corners = **8**, always, for any n.",
      "2 painted faces = edges = 12(n − 2) = 12 here.",
      "1 painted face = face centres = 6(n − 2)² = 6.",
      "0 painted faces = the hidden core = (n − 2)³ = 1. Total 8 + 12 + 6 + 1 = 27 ✓"
    ]
  },
  {
    tag: "Cubes", lvl: "advanced",
    q: "A 4×4×4 cube is painted and cut into 64 unit cubes. How many have no painted face at all?",
    o: ["8", "24", "16", "0"],
    a: 0,
    x: "The unpainted cubes form the inner (4 − 2)³ = 2³ = **8** cube."
  },
  {
    tag: "Dice", lvl: "intermediate",
    q: "On a standard die, opposite faces sum to 7. If the top shows 2, what is on the bottom?",
    o: ["5", "4", "6", "3"],
    a: 0,
    x: "Opposite faces always total 7, so the bottom is 7 − 2 = **5**.",
    note: "The three pairs on a standard die are 1-6, 2-5 and 3-4. Any question giving you two adjacent faces is really asking you to rule out those pairings."
  },
  {
    tag: "Statement-assumption", lvl: "advanced",
    q: "*The company will introduce a four-day week to improve retention.* Which assumption is implicit?",
    o: [
      "Working hours affect whether employees stay",
      "All employees want a four-day week",
      "Retention is currently zero",
      "Competitors have a four-day week"
    ],
    a: 0,
    x: "The plan only makes sense if the working pattern influences retention. That link is assumed, not stated.",
    note: "An implicit assumption must be *necessary* for the statement to hold — not merely consistent with it. Test each candidate by negating it: if the plan collapses, it was an assumption."
  },
  {
    tag: "Cause and effect", lvl: "advanced",
    q: "Ice-cream sales and drowning deaths both rise in summer. What is the correct conclusion?",
    o: [
      "Both are driven by a third factor — hot weather",
      "Ice cream causes drowning",
      "Drowning causes ice-cream sales",
      "The correlation is a coincidence"
    ],
    a: 0,
    x: "A shared cause explains the correlation without either variable acting on the other. This is the textbook confounder.",
    note: "Three explanations for any correlation, and they must all be ruled out before causation is claimed: A causes B, B causes A, or C causes both. Reasoning questions test the third almost every time."
  },
  {
    tag: "Ranking", lvl: "intermediate",
    q: "In a row of 40 students, Ravi is 12th from the left. What is his position from the right?",
    o: ["29th", "28th", "27th", "30th"],
    a: 0,
    x: "Position from right = total − position from left + 1 = 40 − 12 + 1 = **29th**.",
    note: "The +1 is the fencepost again: 11 people stand to his left and 28 to his right, and 11 + 1 + 28 = 40 ✓ Omitting it gives 28, which is offered."
  },
  {
    tag: "Logical deduction", lvl: "advanced",
    q: "*If it rains, the match is cancelled.* The match was **not** cancelled. What follows?",
    o: [
      "It did not rain",
      "It rained",
      "It may or may not have rained",
      "Nothing follows"
    ],
    a: 0,
    x: "This is the contrapositive, and it is always valid: if P → Q, then not-Q → not-P. **It did not rain.**",
    steps: [
      "P → Q here is: rain → cancelled.",
      "We are told: not cancelled (not-Q).",
      "The contrapositive not-Q → not-P is logically equivalent to the original.",
      "So **it did not rain**. Note the invalid cousin: *the match was cancelled, therefore it rained* does not follow — something else could have cancelled it."
    ]
  },
  {
    tag: "Analogies", lvl: "core",
    q: "Doctor is to hospital as teacher is to:",
    o: ["School", "Student", "Book", "Lesson"],
    a: 0,
    x: "The relation is *professional : workplace*. A teacher's workplace is a **school**.",
    note: "Name the relation in words before looking at the options. *Doctor : patient* would give *teacher : student* — a different, equally valid relation, and the options always include both."
  },
  {
    tag: "Ranking", lvl: "advanced",
    q: "In a class, Anil ranks 7th from the top and 26th from the bottom. How many students are in the class?",
    o: ["32", "33", "31", "34"],
    a: 0,
    x: "Total = 7 + 26 − 1 = **32**, subtracting one because Anil is counted in both.",
    note: "Two positions of the same person: **add and subtract one**. Two positions of different people, or a position and a count: the arithmetic changes. Read which it is."
  }

]);
