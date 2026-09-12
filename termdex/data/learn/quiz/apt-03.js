/* Aptitude — question bank, chapters 5-6.

   Geometry and mensuration, then counting, probability and sets.

   Geometry in an aptitude test is not the geometry of a maths course: there
   are no proofs, and roughly fifteen formulas plus Pythagoras answer almost
   everything. Counting is the opposite — very little to memorise and one
   decision to get right, which is whether order matters. */

TD.addMCQ("aptitude", "geometry", [

  {
    tag: "Triangles", lvl: "core",
    q: "Two angles of a triangle are 65° and 47°. What is the third?",
    o: ["68°", "72°", "66°", "78°"],
    a: 0,
    x: "The angles of a triangle sum to 180°: 180 − 65 − 47 = **68°**."
  },
  {
    tag: "Pythagoras", lvl: "core",
    q: "A right-angled triangle has legs of 9 cm and 12 cm. What is the hypotenuse?",
    o: ["15 cm", "18 cm", "21 cm", "13 cm"],
    a: 0,
    x: "√(81 + 144) = √225 = **15 cm**. It is the 3-4-5 triangle scaled by 3.",
    note: "The triples worth recognising on sight: 3-4-5, 5-12-13, 8-15-17, 7-24-25, and every multiple of each. Spotting one saves the square root entirely."
  },
  {
    tag: "Area", lvl: "core",
    q: "What is the area of a triangle with base 10 cm and height 6 cm?",
    o: ["30 cm²", "60 cm²", "16 cm²", "20 cm²"],
    a: 0,
    x: "½ × base × height = ½ × 10 × 6 = **30 cm²**."
  },
  {
    tag: "Area", lvl: "intermediate",
    q: "What is the area of an equilateral triangle of side 6 cm?",
    o: ["9√3 cm²", "18 cm²", "36√3 cm²", "12√3 cm²"],
    a: 0,
    x: "(√3/4) × side² = (√3/4) × 36 = **9√3 cm²** ≈ 15.6 cm².",
    steps: [
      "The formula is (√3/4)a².",
      "a² = 36.",
      "(√3/4) × 36 = **9√3**.",
      "Its height, if needed separately, is (√3/2)a = 3√3."
    ]
  },
  {
    tag: "Circles", lvl: "core",
    q: "What is the area of a circle of radius 7 cm? (Take π = 22/7.)",
    o: ["154 cm²", "44 cm²", "49 cm²", "308 cm²"],
    a: 0,
    x: "πr² = (22/7) × 49 = **154 cm²**.",
    note: "Radius 7 (and 14, 21) is chosen by examiners precisely so 22/7 cancels. Seeing a 7 in a circle question is a hint to use 22/7 rather than 3.14."
  },
  {
    tag: "Circles", lvl: "core",
    q: "What is the circumference of a circle of radius 7 cm? (Take π = 22/7.)",
    o: ["44 cm", "22 cm", "154 cm", "88 cm"],
    a: 0,
    x: "2πr = 2 × (22/7) × 7 = **44 cm**."
  },
  {
    tag: "Circles", lvl: "intermediate",
    q: "A circle has a circumference of 44 cm. What is its area? (Take π = 22/7.)",
    o: ["154 cm²", "144 cm²", "121 cm²", "196 cm²"],
    a: 0,
    x: "2πr = 44 gives r = 7, so the area is πr² = **154 cm²**.",
    steps: [
      "2 × (22/7) × r = 44 → (44/7)r = 44 → r = **7**.",
      "Area = (22/7) × 49 = **154 cm²**.",
      "Always find the radius first. Every other circle quantity follows from it.",
      "Note area and circumference are numerically equal only when r = 2 — a coincidence some questions exploit."
    ]
  },
  {
    tag: "Rectangles", lvl: "core",
    q: "A rectangle has a perimeter of 36 cm and a length of 12 cm. What is its area?",
    o: ["72 cm²", "144 cm²", "60 cm²", "96 cm²"],
    a: 0,
    x: "2(l + b) = 36 → l + b = 18 → b = 6. Area = 12 × 6 = **72 cm²**."
  },
  {
    tag: "Squares", lvl: "intermediate",
    q: "A square has a diagonal of 10 cm. What is its area?",
    o: ["50 cm²", "100 cm²", "25 cm²", "70.7 cm²"],
    a: 0,
    x: "For a square, area = d²/2 = 100/2 = **50 cm²**.",
    steps: [
      "If the side is a, the diagonal is a√2, so a√2 = 10 → a = 10/√2.",
      "Area = a² = 100/2 = **50 cm²**.",
      "The shortcut d²/2 is worth memorising — squares are described by their diagonal surprisingly often.",
      "The same relation in reverse: a square of area 50 has a diagonal of 10."
    ]
  },
  {
    tag: "Solids", lvl: "core",
    q: "A cube has a volume of 27 cm³. What is its total surface area?",
    o: ["54 cm²", "27 cm²", "36 cm²", "81 cm²"],
    a: 0,
    x: "Side = ∛27 = 3 cm. Surface area = 6a² = 6 × 9 = **54 cm²**."
  },
  {
    tag: "Solids", lvl: "intermediate",
    q: "What is the total surface area of a cuboid measuring 5 × 4 × 3 cm?",
    o: ["94 cm²", "60 cm²", "47 cm²", "120 cm²"],
    a: 0,
    x: "2(lb + bh + hl) = 2(20 + 12 + 15) = 2 × 47 = **94 cm²**.",
    note: "Its volume is 60 cm³, offered here as a distractor. Volume and surface area questions look identical until the last word — read which one is asked."
  },
  {
    tag: "Solids", lvl: "intermediate",
    q: "What is the volume of a cylinder with radius 7 cm and height 10 cm? (Take π = 22/7.)",
    o: ["1540 cm³", "440 cm³", "770 cm³", "2200 cm³"],
    a: 0,
    x: "πr²h = (22/7) × 49 × 10 = **1540 cm³**."
  },
  {
    tag: "Solids", lvl: "intermediate",
    q: "What is the volume of a sphere of radius 3 cm?",
    o: ["36π cm³", "12π cm³", "27π cm³", "9π cm³"],
    a: 0,
    x: "(4/3)πr³ = (4/3)π × 27 = **36π cm³**.",
    note: "The sphere set worth knowing: volume (4/3)πr³, surface area 4πr². A cone of the same radius and height 4r/3 has one quarter the volume."
  },
  {
    tag: "Solids", lvl: "intermediate",
    q: "What is the volume of a cone with radius 3 cm and height 4 cm?",
    o: ["12π cm³", "36π cm³", "16π cm³", "24π cm³"],
    a: 0,
    x: "(1/3)πr²h = (1/3)π × 9 × 4 = **12π cm³**.",
    note: "A cone is exactly one third of the cylinder that contains it. That single fact removes the need to memorise the cone formula separately."
  },
  {
    tag: "Similarity", lvl: "intermediate",
    q: "Two similar triangles have sides in the ratio 2 : 3. What is the ratio of their areas?",
    o: ["4 : 9", "2 : 3", "8 : 27", "√2 : √3"],
    a: 0,
    x: "Areas scale with the square of the linear ratio: 2² : 3² = **4 : 9**.",
    steps: [
      "Length ratio: 2 : 3.",
      "Area ratio: squared → **4 : 9**.",
      "Volume ratio (for similar solids): cubed → 8 : 27.",
      "This single rule answers most 'if all dimensions are doubled' questions in one step."
    ]
  },
  {
    tag: "Polygons", lvl: "core",
    q: "What is the measure of each interior angle of a regular hexagon?",
    o: ["120°", "108°", "135°", "90°"],
    a: 0,
    x: "Interior angle = 180 − (360/n) = 180 − 60 = **120°**.",
    note: "Working from the exterior angle is faster: exterior = 360/n, and interior = 180 − exterior. For a pentagon that is 180 − 72 = 108°."
  },
  {
    tag: "Polygons", lvl: "core",
    q: "What is the sum of the interior angles of a pentagon?",
    o: ["540°", "360°", "720°", "450°"],
    a: 0,
    x: "(n − 2) × 180 = 3 × 180 = **540°**."
  },
  {
    tag: "Polygons", lvl: "intermediate",
    q: "How many diagonals does an octagon have?",
    o: ["20", "16", "24", "28"],
    a: 0,
    x: "n(n − 3)/2 = 8 × 5 / 2 = **20**.",
    steps: [
      "Each vertex connects to n − 3 others (not itself, not its two neighbours).",
      "That gives 8 × 5 = 40 endpoints.",
      "Every diagonal is counted twice, so divide by 2 → **20**.",
      "The formula is just ⁿC₂ minus the n sides, which is the same number."
    ]
  },
  {
    tag: "Coordinates", lvl: "core",
    q: "What is the distance between the points (0, 0) and (3, 4)?",
    o: ["5", "7", "25", "3.5"],
    a: 0,
    x: "√(3² + 4²) = √25 = **5**."
  },
  {
    tag: "Coordinates", lvl: "core",
    q: "What is the midpoint of the segment joining (2, 3) and (6, 7)?",
    o: ["(4, 5)", "(8, 10)", "(4, 4)", "(3, 5)"],
    a: 0,
    x: "Average the coordinates: ((2+6)/2, (3+7)/2) = **(4, 5)**."
  },
  {
    tag: "Coordinates", lvl: "intermediate",
    q: "What is the slope of the line through (1, 2) and (3, 6)?",
    o: ["2", "½", "4", "−2"],
    a: 0,
    x: "(y₂ − y₁)/(x₂ − x₁) = (6 − 2)/(3 − 1) = 4/2 = **2**."
  },
  {
    tag: "Coordinates", lvl: "intermediate",
    q: "What is the equation of the line with slope 2 passing through (0, 3)?",
    o: ["y = 2x + 3", "y = 3x + 2", "y = 2x − 3", "y = x + 3"],
    a: 0,
    x: "In y = mx + c, m = 2 and the y-intercept c = 3, giving **y = 2x + 3**."
  },
  {
    tag: "Trigonometry", lvl: "core",
    q: "What is sin 30°?",
    o: ["½", "√3/2", "1/√2", "1"],
    a: 0,
    x: "sin 30° = **½**.",
    note: "The table that covers nearly every trig question in an aptitude test: sin 0/30/45/60/90 = 0, ½, 1/√2, √3/2, 1. Cosine is the same list read backwards."
  },
  {
    tag: "Trigonometry", lvl: "core",
    q: "What is tan 45°?",
    o: ["1", "0", "√3", "1/√3"],
    a: 0,
    x: "tan 45° = sin 45° / cos 45° = **1**."
  },
  {
    tag: "Trigonometry", lvl: "core",
    q: "sin²θ + cos²θ equals:",
    o: ["1", "0", "2", "tan²θ"],
    a: 0,
    x: "The fundamental identity: sin²θ + cos²θ = **1** for every θ."
  },
  {
    tag: "Heights", lvl: "intermediate",
    q: "The angle of elevation of the top of a tower from a point 50 m away is 45°. How tall is the tower?",
    o: ["50 m", "25 m", "50√2 m", "100 m"],
    a: 0,
    x: "tan 45° = height/50 = 1, so the height is **50 m**.",
    note: "A 45° elevation always means height equals horizontal distance. Recognising it turns the question into a one-line answer."
  },
  {
    tag: "Heights", lvl: "advanced",
    q: "From a point 100√3 m from the foot of a tower, the angle of elevation of its top is 30°. How tall is the tower?",
    o: ["100 m", "300 m", "50√3 m", "173 m"],
    a: 0,
    x: "tan 30° = 1/√3 = h / (100√3), so h = 100√3 / √3 = **100 m**.",
    steps: [
      "tan 30° = height / base.",
      "1/√3 = h / (100√3).",
      "h = 100√3 × (1/√3) = **100 m**.",
      "The √3 in the distance is there to cancel — that is how you know 30° or 60° is intended."
    ]
  },
  {
    tag: "Circles", lvl: "intermediate",
    q: "What is the angle subtended by a diameter at any point on the circumference?",
    o: ["90°", "60°", "180°", "It varies"],
    a: 0,
    x: "The angle in a semicircle is always a right angle — **90°** — wherever on the arc the point sits.",
    note: "Thales' theorem. It is the reason so many circle questions turn out to be Pythagoras questions once you spot the diameter."
  },
  {
    tag: "Quadrilaterals", lvl: "core",
    q: "What is the area of a trapezium with parallel sides 8 cm and 12 cm, and height 5 cm?",
    o: ["50 cm²", "60 cm²", "40 cm²", "100 cm²"],
    a: 0,
    x: "½ × (sum of parallel sides) × height = ½ × 20 × 5 = **50 cm²**."
  },
  {
    tag: "Quadrilaterals", lvl: "intermediate",
    q: "A parallelogram has a base of 12 cm and a height of 7 cm. What is its area?",
    o: ["84 cm²", "42 cm²", "38 cm²", "168 cm²"],
    a: 0,
    x: "base × height = 12 × 7 = **84 cm²**.",
    note: "The height is the *perpendicular* distance between the parallel sides, never the slanted side. Using the slant side is the standard error here."
  },
  {
    tag: "Triangles", lvl: "advanced",
    q: "Can a triangle have sides of 3 cm, 4 cm and 8 cm?",
    o: [
      "No — the two shorter sides do not exceed the longest",
      "Yes",
      "Only if it is right-angled",
      "Only if it is obtuse"
    ],
    a: 0,
    x: "The triangle inequality requires any two sides to sum to more than the third. 3 + 4 = 7, which is less than 8, so **no such triangle exists**."
  },
  {
    tag: "Mensuration", lvl: "advanced",
    q: "If the radius of a sphere is doubled, its volume becomes:",
    o: ["8 times", "2 times", "4 times", "6 times"],
    a: 0,
    x: "Volume scales with r³, so doubling the radius multiplies the volume by 2³ = **8**.",
    note: "The same doubling multiplies the surface area by 4, because area scales with r². Questions mix the two deliberately."
  }

]);


TD.addMCQ("aptitude", "counting", [

  {
    tag: "Factorials", lvl: "core",
    q: "What is 5!?",
    o: ["120", "25", "60", "720"],
    a: 0,
    x: "5 × 4 × 3 × 2 × 1 = **120**.",
    note: "Worth knowing to 7: 1, 2, 6, 24, 120, 720, 5040. They appear constantly and recomputing them costs time you do not have."
  },
  {
    tag: "Permutations", lvl: "core",
    q: "In how many ways can 5 different books be arranged on a shelf?",
    o: ["120", "25", "20", "60"],
    a: 0,
    x: "5 distinct items in a row: 5! = **120**."
  },
  {
    tag: "Combinations", lvl: "core",
    q: "What is ¹⁰C₂?",
    o: ["45", "90", "20", "100"],
    a: 0,
    x: "(10 × 9)/(2 × 1) = **45**.",
    steps: [
      "ⁿCᵣ = n! / (r!(n−r)!), but never expand the factorials.",
      "Take r terms counting down from n on top: 10 × 9.",
      "Divide by r!: 2 × 1.",
      "90/2 = **45**."
    ]
  },
  {
    tag: "Permutations", lvl: "core",
    q: "What is ¹⁰P₂?",
    o: ["90", "45", "20", "100"],
    a: 0,
    x: "10 × 9 = **90** — the same as ¹⁰C₂ but without dividing by 2!, because order matters."
  },
  {
    tag: "Choosing", lvl: "intermediate",
    q: "Which is the right question to ask first when deciding between a permutation and a combination?",
    o: [
      "Does the order of the chosen items matter?",
      "Are the items distinct?",
      "Is repetition allowed?",
      "Is n larger than r?"
    ],
    a: 0,
    x: "Order is the whole distinction. A committee of three is a combination; first, second and third place is a permutation.",
    note: "The test that never fails: swap two of the chosen items. If you now have a different outcome, it is a permutation. If it is the same outcome, it is a combination."
  },
  {
    tag: "Repeated letters", lvl: "intermediate",
    q: "How many distinct arrangements are there of the letters of the word APPLE?",
    o: ["60", "120", "24", "30"],
    a: 0,
    x: "5 letters with P repeated twice: 5!/2! = 120/2 = **60**."
  },
  {
    tag: "Repeated letters", lvl: "advanced",
    q: "How many distinct arrangements are there of the letters of the word SUCCESS?",
    o: ["420", "5040", "840", "210"],
    a: 0,
    x: "7 letters with S three times and C twice: 7!/(3! × 2!) = 5040/12 = **420**.",
    steps: [
      "Count the letters: S, U, C, C, E, S, S — seven in total.",
      "Repeats: S appears 3 times, C appears 2 times.",
      "7! / (3! × 2!) = 5040 / (6 × 2).",
      "= 5040/12 = **420**."
    ]
  },
  {
    tag: "Combinations", lvl: "core",
    q: "In how many ways can a committee of 3 be chosen from 8 people?",
    o: ["56", "336", "24", "112"],
    a: 0,
    x: "⁸C₃ = (8 × 7 × 6)/(3 × 2 × 1) = 336/6 = **56**."
  },
  {
    tag: "Combinations", lvl: "core",
    q: "If 10 people each shake hands once with everybody else, how many handshakes occur?",
    o: ["45", "90", "100", "55"],
    a: 0,
    x: "Each handshake is a pair: ¹⁰C₂ = **45**.",
    note: "The handshake count for n people is always n(n−1)/2. Recognising a question as 'count the pairs' is most of the work."
  },
  {
    tag: "Combinations", lvl: "intermediate",
    q: "In how many ways can 2 boys be chosen from 5 boys and 3 girls from 4 girls?",
    o: ["40", "20", "14", "60"],
    a: 0,
    x: "⁵C₂ × ⁴C₃ = 10 × 4 = **40**.",
    steps: [
      "The two choices are independent, so multiply.",
      "⁵C₂ = 10.",
      "⁴C₃ = 4 (choosing 3 of 4 is the same as leaving out 1 of 4).",
      "10 × 4 = **40**. 'And' means multiply; 'or' means add."
    ]
  },
  {
    tag: "Circular", lvl: "intermediate",
    q: "In how many ways can 5 people be seated around a circular table?",
    o: ["24", "120", "60", "20"],
    a: 0,
    x: "Circular arrangements fix one person to remove rotations: (5 − 1)! = **24**.",
    note: "Round a table there is no first seat — every arrangement can be rotated into four others that are really the same. Hence (n−1)! rather than n!."
  },
  {
    tag: "Grouping", lvl: "advanced",
    q: "In how many ways can the letters of the word LOGIC be arranged so that the two vowels are always together?",
    o: ["48", "120", "24", "60"],
    a: 0,
    x: "Treat O and I as one block: 4 items arrange in 4! = 24 ways, and the block internally in 2! = 2. Total 24 × 2 = **48**.",
    steps: [
      "Glue the vowels together into a single unit: [OI], L, G, C — **4 units**.",
      "Arrange the 4 units: 4! = 24.",
      "Arrange within the glued unit: 2! = 2.",
      "24 × 2 = **48**. The 'always together' technique is always glue, arrange, then arrange inside."
    ]
  },
  {
    tag: "Subsets", lvl: "intermediate",
    q: "How many subsets does a set of 5 elements have?",
    o: ["32", "25", "120", "31"],
    a: 0,
    x: "Each element is either in or out: 2⁵ = **32**, including the empty set and the set itself.",
    note: "If a question asks for *proper* subsets or *non-empty* subsets, subtract one — 31 is offered here for exactly that reason."
  },
  {
    tag: "Probability", lvl: "core",
    q: "A fair coin is tossed. What is the probability of a head?",
    o: ["1/2", "1", "1/4", "0"],
    a: 0,
    x: "One favourable outcome of two equally likely ones: **1/2**."
  },
  {
    tag: "Probability", lvl: "intermediate",
    q: "Two fair dice are rolled. What is the probability that the sum is 7?",
    o: ["1/6", "1/12", "7/36", "1/9"],
    a: 0,
    x: "Six of the 36 outcomes sum to 7 — (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) — so 6/36 = **1/6**.",
    note: "7 is the most likely total with two dice, which is why it appears in questions so often. The counts run 1,2,3,4,5,6,5,4,3,2,1 for totals 2 to 12."
  },
  {
    tag: "Probability", lvl: "intermediate",
    q: "Two fair dice are rolled. What is the probability that the sum is greater than 9?",
    o: ["1/6", "1/9", "1/4", "5/36"],
    a: 0,
    x: "Totals of 10, 11 and 12 occur in 3 + 2 + 1 = 6 ways out of 36, so **1/6**.",
    steps: [
      "'Greater than 9' means 10, 11 or 12 — not 9 itself.",
      "10: (4,6)(5,5)(6,4) = 3 ways. 11: (5,6)(6,5) = 2. 12: (6,6) = 1.",
      "Total 6 favourable outcomes out of 36.",
      "6/36 = **1/6**. Reading 'greater than' as 'at least' would add 4 more ways and give the wrong answer."
    ]
  },
  {
    tag: "Probability", lvl: "core",
    q: "One card is drawn from a standard 52-card pack. What is the probability that it is a king?",
    o: ["1/13", "1/4", "1/52", "4/13"],
    a: 0,
    x: "Four kings in 52 cards: 4/52 = **1/13**.",
    note: "The pack facts worth holding: 52 cards, 4 suits of 13, 26 red and 26 black, 12 face cards, 4 of each rank."
  },
  {
    tag: "Probability", lvl: "intermediate",
    q: "A bag holds 3 red and 5 blue balls. One is drawn at random. What is the probability that it is red?",
    o: ["3/8", "3/5", "5/8", "1/3"],
    a: 0,
    x: "3 favourable out of 8 total: **3/8**."
  },
  {
    tag: "Probability", lvl: "advanced",
    q: "From a bag of 3 red and 5 blue balls, two are drawn without replacement. What is the probability that both are red?",
    o: ["3/28", "9/64", "1/8", "3/14"],
    a: 0,
    x: "(3/8) × (2/7) = 6/56 = **3/28**.",
    steps: [
      "First draw: 3 red out of 8 → 3/8.",
      "Without replacement, the bag now holds 2 red out of 7 → 2/7.",
      "Multiply: (3/8)(2/7) = 6/56 = **3/28**.",
      "*With* replacement it would be (3/8)² = 9/64, offered here as the distractor."
    ]
  },
  {
    tag: "Probability", lvl: "intermediate",
    q: "A fair coin is tossed three times. What is the probability of getting at least one head?",
    o: ["7/8", "1/2", "3/8", "1/8"],
    a: 0,
    x: "P(at least one head) = 1 − P(no heads) = 1 − 1/8 = **7/8**.",
    steps: [
      "'At least one' is almost always easier through the complement.",
      "P(no heads) = P(three tails) = (1/2)³ = 1/8.",
      "1 − 1/8 = **7/8**.",
      "Counting the cases directly means seven separate outcomes; the complement is one."
    ]
  },
  {
    tag: "Probability", lvl: "intermediate",
    q: "For any two events, P(A or B) equals:",
    o: [
      "P(A) + P(B) − P(A and B)",
      "P(A) + P(B)",
      "P(A) × P(B)",
      "P(A) − P(B)"
    ],
    a: 0,
    x: "Adding the two probabilities counts the overlap twice, so it must be subtracted once: **P(A) + P(B) − P(A ∩ B)**.",
    note: "Simple addition is right only for mutually exclusive events, where the overlap is zero. A question that does not say 'mutually exclusive' usually means it is not."
  },
  {
    tag: "Probability", lvl: "advanced",
    q: "Two cards are drawn without replacement from a standard pack. What is the probability that both are aces?",
    o: ["1/221", "1/169", "1/13", "4/663"],
    a: 0,
    x: "(4/52) × (3/51) = 12/2652 = **1/221**."
  },
  {
    tag: "Sets", lvl: "core",
    q: "n(A ∪ B) equals:",
    o: [
      "n(A) + n(B) − n(A ∩ B)",
      "n(A) + n(B)",
      "n(A) × n(B)",
      "n(A) − n(B)"
    ],
    a: 0,
    x: "The inclusion-exclusion principle: add the two sets, then remove the overlap you counted twice.",
    note: "For three sets it extends: add the three, subtract the three pairwise overlaps, add back the triple overlap."
  },
  {
    tag: "Venn", lvl: "intermediate",
    q: "Of 100 people, 60 drink tea, 50 drink coffee and 30 drink both. How many drink neither?",
    o: ["20", "10", "30", "40"],
    a: 0,
    x: "Tea or coffee = 60 + 50 − 30 = 80, so 100 − 80 = **20** drink neither.",
    steps: [
      "n(T ∪ C) = 60 + 50 − 30 = **80**.",
      "Neither = total − union = 100 − 80 = **20**.",
      "Adding 60 + 50 = 110 exceeds the group of 100, which is the signal that an overlap must be subtracted.",
      "Tea only = 30 and coffee only = 20, if the question asks for those instead."
    ]
  },
  {
    tag: "Venn", lvl: "advanced",
    q: "In a class of 60, 30 play cricket, 25 play football, 15 play both, and everyone plays at least one. Is the data consistent?",
    o: [
      "No — the union is only 40, so 20 students play neither",
      "Yes, it is consistent",
      "No — the overlap cannot exceed 15",
      "Yes, but only if some play a third sport"
    ],
    a: 0,
    x: "n(C ∪ F) = 30 + 25 − 15 = 40, which contradicts the claim that all 60 play at least one.",
    note: "Checking that the union does not exceed the total — and, where 'everyone plays at least one' is claimed, that it *equals* the total — catches inconsistent data before you waste time on it."
  },
  {
    tag: "Counting", lvl: "intermediate",
    q: "How many three-digit numbers can be formed from the digits 1-5 if no digit repeats?",
    o: ["60", "125", "120", "10"],
    a: 0,
    x: "5 × 4 × 3 = **60**.",
    steps: [
      "Hundreds place: 5 choices.",
      "Tens place: 4 remain.",
      "Units place: 3 remain.",
      "5 × 4 × 3 = **60**. With repetition allowed it would be 5³ = 125, which is offered as a distractor."
    ]
  },
  {
    tag: "Counting", lvl: "advanced",
    q: "How many three-digit numbers can be formed from the digits 0-4 without repetition?",
    o: ["48", "60", "125", "40"],
    a: 0,
    x: "The hundreds digit cannot be 0, so 4 × 4 × 3 = **48**.",
    steps: [
      "Hundreds place: 4 choices (1, 2, 3, 4 — not 0).",
      "Tens place: 4 remain, and 0 is now allowed.",
      "Units place: 3 remain.",
      "4 × 4 × 3 = **48**. Handling the leading-zero restriction first is what makes this work."
    ]
  },
  {
    tag: "Probability", lvl: "advanced",
    q: "The probability that it rains tomorrow is 0.3. What is the probability that it does not?",
    o: ["0.7", "0.3", "0.5", "1.3"],
    a: 0,
    x: "P(not A) = 1 − P(A) = 1 − 0.3 = **0.7**."
  },
  {
    tag: "Permutations", lvl: "advanced",
    q: "How many distinct arrangements are there of the letters of MISSISSIPPI?",
    o: ["34650", "39916800", "11550", "6930"],
    a: 0,
    x: "11 letters with I×4, S×4, P×2: 11!/(4! 4! 2!) = 39,916,800 / 1152 = **34,650**.",
    steps: [
      "Count: M×1, I×4, S×4, P×2 — eleven letters.",
      "11! = 39,916,800.",
      "Divide by 4! × 4! × 2! = 24 × 24 × 2 = 1152.",
      "39,916,800 / 1152 = **34,650**."
    ]
  },
  {
    tag: "Combinations", lvl: "advanced",
    q: "A team of 4 must be chosen from 6 men and 4 women, and must include at least one woman. How many ways are there?",
    o: ["195", "210", "180", "120"],
    a: 0,
    x: "Total teams ¹⁰C₄ = 210, minus the all-men teams ⁶C₄ = 15, giving **195**.",
    steps: [
      "'At least one' is easiest as total minus none.",
      "All possible teams: ¹⁰C₄ = 210.",
      "Teams with no women (all 4 from the 6 men): ⁶C₄ = 15.",
      "210 − 15 = **195**. Counting one-woman, two-woman, three-woman and four-woman cases separately gives the same answer and takes four times as long."
    ]
  }

]);
