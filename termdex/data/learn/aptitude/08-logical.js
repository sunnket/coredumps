/* Aptitude — logical reasoning. */
TD.addLessons("aptitude", [

  {
    t: "Arrangements and Puzzles — the grid method",
    m: "logical",
    lvl: "core",
    s: "Linear and circular seating, floor and box puzzles, and the fixed procedure that turns a five-minute puzzle into a two-minute one.",
    goal: [
      "Set up any arrangement puzzle with the right diagram before reading clue two",
      "Order the clues by how much they constrain, not by how they are printed",
      "Use elimination grids for matching puzzles instead of holding facts in your head"
    ],
    b: [
      { p: "Arrangement puzzles are the highest-value questions in a reasoning section, because one correct setup answers four or five questions at once. They are also where the most time is lost, and almost always for the same reason: the candidate started with clue one instead of the most restrictive clue." },

      { h: "The procedure" },

      {
        code: {
          lang: "text", t: "Six steps, in this order, every time",
          lines: [
            { c: "1. Identify the STRUCTURE before reading any clue closely.", w: "Row of 8? Circle of 6 facing centre? Five floors? Draw the empty frame first.", hi: true },
            { c: "", w: "" },
            { c: "2. Note the number of entities and the number of attributes.", w: "Six people with a name, a city and a colour is a 6 x 3 grid, not a line." },
            { c: "", w: "" },
            { c: "3. Sort the clues by CONSTRAINT STRENGTH, not by order.", w: "**Definite placements first, then relative ones, then negatives.**", hi: true },
            { c: "", w: "" },
            { c: "4. Place the definite clues. These are your anchors.", w: "'C sits at the extreme left' fixes a cell outright." },
            { c: "", w: "" },
            { c: "5. Apply relative clues as BLOCKS, and try both orientations.", w: "'A is two places left of B' is a block that slides; test each valid position.", hi: true },
            { c: "", w: "" },
            { c: "6. Use negative clues last, to eliminate surviving cases.", w: "'D is not at either end' rarely places anyone but often kills a whole branch." }
          ]
        }
      },

      { n: "Clue strength, ranked: an absolute position ('third from the left') beats an adjacency ('next to'), which beats an ordering ('somewhere to the left of'), which beats a negation ('not adjacent to'). Read all the clues, number them by that ranking, and work in your order rather than the paper's.", nt: "The clue-strength ladder" },

      { h: "Linear arrangements" },

      {
        code: {
          lang: "text", t: "The directions problem, solved once",
          lines: [
            { c: "Draw the row and label the positions 1..n from the LEFT.", w: "" },
            { c: "Write 'left' and 'right' at the ends of your sketch.", w: "**Do it physically. Direction slips are the top error here.**", hi: true },
            { c: "", w: "" },
            { c: "If everyone faces NORTH: their left is your left.", w: "" },
            { c: "If everyone faces SOUTH: their left is your right - the whole", w: "" },
            { c: "row reverses.", w: "A single word in the setup can invert every clue in the puzzle.", hi: true },
            { c: "", w: "" },
            { c: "In two-row puzzles (one row facing the other), work out which", w: "" },
            { c: "position faces which BEFORE placing anyone.", w: "Position 1 of a north-facing row usually faces position n of the south-facing one." },
            { c: "", w: "" },
            { c: "'Immediately' means adjacent. 'Somewhere' does not.", w: "Two words that change the entire solution space." }
          ]
        }
      },

      { h: "Circular arrangements" },

      {
        tbl: {
          t: "The extra rules a circle adds",
          h: ["Situation", "Rule"],
          rows: [
            ["All facing the **centre**", "Their left is your **anticlockwise**; positions run clockwise as you read outward"],
            ["All facing **outward**", "Everything reverses — their left is your clockwise"],
            ["**Mixed** facing (some in, some out)", "The hardest variant. Mark each person's facing on the diagram itself"],
            ["*Third to the left of X*", "Count in **X's** left, which depends on X's facing, not yours"],
            ["*Between A and B*", "In a circle there are two arcs — check whether the clue means the shorter one"],
            ["Rotational equivalence", "Fix one person's seat arbitrarily; only relative positions matter"]
          ]
        }
      },

      { trap: "In a circle, *immediate left of X* is a different seat from *immediately to the left of X as you look at the diagram*, and papers exploit this in almost every circular set. Write a small arrow beside each person showing which way they face, then read every directional clue from that person's viewpoint, not yours." },

      { h: "Matching puzzles: use a grid" },

      {
        code: {
          lang: "text", t: "Four people, three attributes each",
          lines: [
            { c: "Do not try to hold this in your head. Draw the grid:", w: "" },
            { c: "", w: "" },
            { c: "          City     Colour   Sport", w: "" },
            { c: "  Amit      ?        ?        ?", w: "" },
            { c: "  Bina      ?        ?        ?", w: "" },
            { c: "  Chetan    ?        ?        ?", w: "" },
            { c: "  Deepa     ?        ?        ?", w: "" },
            { c: "", w: "" },
            { c: "Mark confirmed cells with the value; mark ruled-out", w: "" },
            { c: "combinations with a small x in the margin.", w: "**A negative clue is information. Record it, do not just remember it.**", hi: true },
            { c: "", w: "" },
            { c: "When a column has three x marks in four rows, the fourth", w: "" },
            { c: "is forced. That cascade is how these puzzles resolve.", w: "Scan for near-full rows and columns after every new clue.", hi: true }
          ]
        }
      },

      { h: "When multiple cases survive" },

      {
        code: {
          lang: "text", t: "Branch deliberately, and label the branches",
          lines: [
            { c: "Often two arrangements both satisfy the first several clues.", w: "" },
            { c: "", w: "" },
            { c: "Draw BOTH, labelled Case 1 and Case 2, side by side.", w: "**Do not try to keep the alternative in your head.**", hi: true },
            { c: "", w: "" },
            { c: "Apply the remaining clues to each in turn. Usually one case", w: "" },
            { c: "dies within two clues.", w: "" },
            { c: "", w: "" },
            { c: "If both survive to the end, that is not a failure - some", w: "" },
            { c: "questions are answerable in both cases, and the answer to", w: "" },
            { c: "the rest is genuinely 'cannot be determined'.", w: "Papers include that option precisely for this situation.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "A short linear puzzle",
          task: "Six people — P, Q, R, S, T, U — sit in a row facing north. R is third from the left. P sits immediately to the right of R. Q sits at one of the ends. S sits immediately to the left of U. T is not adjacent to R. Find the full arrangement.",
          hint: "Place R and P first — they are the only definite clues. Then test Q at each end as two labelled cases.",
          sol: { lang: "text", code: "positions 1..6, left to right\n\nDefinite clues first:\n  R is at 3.  P is immediately right of R, so P is at 4.\n  Seats 1, 2, 5, 6 remain for Q, S, T, U.\n\nCase A: Q at 1.\n  Seats 2, 5, 6 remain for S, T, U.\n  S must sit immediately left of U - within {2,5,6} the only\n  adjacent pair is (5,6), so S=5 and U=6.\n  That forces T=2, which is adjacent to R at 3.  Case A dies.\n\nCase B: Q at 6.\n  Seats 1, 2, 5 remain for S, T, U.\n  The only adjacent pair available is (1,2), so S=1 and U=2.\n  That forces T=5, whose neighbours are P(4) and Q(6).\n  T is not adjacent to R.  Case B holds.\n\nArrangement:  S  U  R  P  T  Q\n              1  2  3  4  5  6" },
          w: "Notice how little searching this took. Two definite clues fixed a third of the row, the adjacency clue had exactly one home in each case, and the negative clue was used last — purely to kill a branch. That is the clue-strength ladder doing its job: had you started with *T is not adjacent to R*, you would have had nothing to attach it to."
        }
      }
    ],
    k: [
      "Draw the structure before reading the clues closely.",
      "Order clues by constraint strength: absolute, then adjacent, then relative, then negative.",
      "Write the direction labels on your sketch; facing direction reverses left and right.",
      "In circles, read every directional clue from that person's viewpoint.",
      "Use an elimination grid for matching puzzles and record negatives explicitly.",
      "Branch into labelled cases rather than holding alternatives in your head.",
      "If two cases survive every clue, *cannot be determined* is a real answer."
    ],
    r: ["Backtracking"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "structure first, then the strongest clue", w: "never start with clue one" },
        { c: "facing outward reverses left and right", w: "the top circular-puzzle error" },
        { c: "branch into labelled cases, side by side", w: "instead of holding both in your head" }
      ]
    }
  },

  {
    t: "Blood Relations, Directions, Coding and Series",
    m: "logical",
    lvl: "core",
    s: "Four fast topics with fixed methods: family trees, direction tracing, the four coding patterns, and the checklist for cracking any number or letter series.",
    goal: [
      "Draw a family tree with consistent notation and answer relation questions from it",
      "Trace directions on paper and use Pythagoras for final displacement",
      "Run the series checklist in order instead of staring at the numbers"
    ],
    b: [
      { p: "These four topics share a property that makes them worth grouping: each has a fixed procedure that works every time, and each takes under a minute once the procedure is automatic. They are the cheapest marks in a reasoning section." },

      { h: "Blood relations" },

      {
        code: {
          lang: "text", t: "One notation, used consistently",
          lines: [
            { c: "Use a fixed set of symbols and never improvise:", w: "" },
            { c: "", w: "" },
            { c: "  +  male        -  female        ?  gender unknown", w: "**Mark unknown gender explicitly. Assuming it is the classic error.**", hi: true },
            { c: "  --- horizontal line: spouses or siblings", w: "" },
            { c: "  |   vertical line: parent above, child below", w: "" },
            { c: "", w: "" },
            { c: "Work from the END of the statement backwards.", w: "" },
            { c: "  'the son of the sister of my father's only brother'", w: "" },
            { c: "  start at 'my father's only brother' = my uncle", w: "" },
            { c: "  the sister of my uncle = my aunt (father's sister)", w: "" },
            { c: "  the son of my aunt = my cousin", w: "**Reading backwards turns a nested phrase into a chain.**", hi: true },
            { c: "", w: "" },
            { c: "'Only son of my mother' = me, if I am male.", w: "Self-referential clues are common and easy to miss." }
          ]
        }
      },

      { n: "In coded-relation questions — *A × B means A is the father of B* — write the code key in a small box before touching the question, and translate the whole expression left to right into your tree. Trying to decode and reason at the same time is where these go wrong.", nt: "Decode first, reason second" },

      { h: "Directions" },

      {
        code: {
          lang: "text", t: "Trace it; never visualise it",
          lines: [
            { c: "Always draw with NORTH at the top of your rough sheet.", w: "" },
            { c: "", w: "" },
            { c: "Turning right and turning left are relative to the CURRENT", w: "" },
            { c: "facing, not to the page.", w: "**Facing south, a right turn takes you west.**", hi: true },
            { c: "", w: "" },
            { c: "Standard rotations from facing north:", w: "" },
            { c: "  right 90 -> east    left 90 -> west", w: "" },
            { c: "  about turn / 180 -> south", w: "" },
            { c: "", w: "" },
            { c: "Final displacement: net north-south and net east-west", w: "" },
            { c: "distances form a right triangle.", w: "" },
            { c: "  distance = sqrt(NS^2 + EW^2)", w: "The Pythagorean triples from geometry appear constantly here.", hi: true },
            { c: "", w: "" },
            { c: "Shadow questions: at sunrise the shadow falls WEST,", w: "" },
            { c: "at sunset it falls EAST.", w: "The sun rises in the east, so the shadow points away from it." }
          ]
        }
      },

      { h: "Coding and decoding" },

      {
        tbl: {
          t: "Four patterns, tested in order",
          h: ["Pattern", "How to spot it", "Example"],
          rows: [
            ["**Letter shift**", "Each letter moves a constant number of places", "CAT → DBU is +1; CAT → FDW is +3"],
            ["**Reversal**", "The word is written backwards, possibly then shifted", "CAT → TAC"],
            ["**Position value**", "Letters replaced by their alphabet number", "CAT → 3-1-20"],
            ["**Substitution / word coding**", "Whole words map to other words across several sentences", "Compare sentences for a shared word and a shared code"],
            ["**Mixed**", "A shift applied to a reversal, or alternate letters shifted differently", "Check odd and even positions separately"]
          ]
        }
      },

      { n: "Two aids make letter coding much faster: know the alphabet positions of A(1), E(5), J(10), O(15), T(20), Y(25) as anchors, and know that the *opposite* letter — A↔Z, B↔Y, C↔X — always sums to 27. The EJOTY anchors let you find any letter's number in two seconds.", nt: "EJOTY and the 27 rule" },

      { h: "Number and letter series" },

      {
        code: {
          lang: "text", t: "The checklist, run in this order",
          lines: [
            { c: "1. First differences. Constant?  -> arithmetic", w: "3, 7, 11, 15 -> +4 each" },
            { c: "2. Second differences. Constant? -> quadratic", w: "1, 4, 9, 16 -> differences 3, 5, 7", hi: true },
            { c: "3. Ratios. Constant?             -> geometric", w: "2, 6, 18, 54 -> x3" },
            { c: "4. Squares, cubes, or one off them?", w: "5, 10, 17, 26 -> n^2 + 1", hi: true },
            { c: "5. Primes, or a prime-indexed pattern?", w: "2, 3, 5, 7, 11 hiding inside another rule" },
            { c: "6. Alternate terms - two series interleaved?", w: "**Check this whenever nothing else works. It is the most common hard case.**", hi: true },
            { c: "7. Sum or product of the previous two terms?", w: "Fibonacci-like: 1, 1, 2, 3, 5, 8" },
            { c: "8. Operation changing each step: +2, x2, +4, x4 ...", w: "Look at what is done, not just at the result." },
            { c: "", w: "" },
            { c: "If none fits in 45 seconds, leave it. Series questions", w: "" },
            { c: "are all-or-nothing and there is no partial credit.", w: "A skipped series costs one mark; a stared-at series costs three." }
          ]
        }
      },

      { trap: "In a *wrong term* series, exactly one term breaks the pattern — so establish the rule from the terms that agree, then test each term against it. Candidates who assume the first term is correct and build forward will often 'fix' the wrong element, because a broken second term makes every subsequent difference look consistent." },

      {
        tryit: {
          t: "One of each",
          task: "(a) Pointing to a photograph, a man says *she is the daughter of the only son of my grandmother*. How is she related to him? (b) A man walks 5 km north, 3 km east, 2 km south, then 6 km west. How far is he from the start? (c) If LONDON is coded as MPOEPO, how is PARIS coded? (d) Find the next term: 4, 9, 19, 39, 79, ?",
          hint: "(a) read backwards. (b) net displacement. (d) look at what is done, not just the differences.",
          sol: { lang: "text", code: "(a) my grandmother's only son = my father\n    his daughter = my sister\n\n(b) net north-south: 5 - 2 = 3 km north\n    net east-west:   3 - 6 = 3 km west\n    distance = sqrt(9 + 9) = 3root2 = 4.24 km\n\n(c) each letter shifts +1: PARIS -> QBSJT\n\n(d) each term is (previous x 2) + 1\n    4, 9, 19, 39, 79, 159" },
          w: "Part (d) is the reason step 8 of the checklist exists. The differences are 5, 10, 20, 40 — themselves doubling — which is a valid route to the same answer, but spotting *×2 + 1* is faster and generalises better."
        }
      }
    ],
    k: [
      "Use fixed family-tree notation and mark unknown gender explicitly.",
      "Read nested relation phrases from the end backwards.",
      "Draw direction problems with north at the top; turns are relative to current facing.",
      "Final displacement is √(net NS² + net EW²).",
      "EJOTY anchors alphabet positions; opposite letters sum to 27.",
      "Run the series checklist in order; check interleaved series when nothing else fits.",
      "In wrong-term series, derive the rule from the agreeing terms first.",
      "Abandon a series after 45 seconds — there is no partial credit."
    ],
    r: ["Recursion", "Algorithm"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "read relation phrases from the end backwards", w: "nested becomes a chain" },
        { c: "displacement = sqrt(net NS^2 + net EW^2)", w: "every direction question ends here" },
        { c: "EJOTY: A1 E5 J10 O15 T20 Y25", w: "alphabet positions in two seconds" }
      ]
    }
  },

  {
    t: "Syllogisms and Logical Deduction",
    m: "logical",
    lvl: "intermediate",
    s: "The four statement types, the Venn method that never fails, the possibility questions that catch everyone, and statement-and-conclusion reasoning.",
    goal: [
      "Convert any syllogism statement into a Venn diagram",
      "Test a conclusion by asking whether it holds in EVERY valid diagram",
      "Handle *possibility* and *either-or* conclusions correctly"
    ],
    b: [
      { p: "Syllogisms are the most mechanical questions in a reasoning section and the most commonly failed, for one reason: candidates decide whether a conclusion *sounds* right instead of testing whether it is *forced*. The Venn method removes judgement entirely, which is exactly what you want under time pressure." },

      { h: "The four statement types" },

      {
        tbl: {
          t: "Every syllogism statement is one of these",
          h: ["Form", "Meaning", "Diagram"],
          rows: [
            ["**All A are B**", "The A circle sits entirely inside B", "A inside B"],
            ["**No A is B**", "The circles do not touch at all", "Two separate circles"],
            ["**Some A are B**", "The circles overlap; at least one thing is in both", "Overlapping circles"],
            ["**Some A are not B**", "At least one A lies outside B", "Overlap, with part of A outside"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "The conversions that are valid, and the ones that are not",
          lines: [
            { c: "All A are B      ->  Some B are A          VALID", w: "" },
            { c: "All A are B      ->  All B are A           INVALID", w: "**All cats are animals does not make all animals cats.**", hi: true },
            { c: "", w: "" },
            { c: "No A is B        ->  No B is A             VALID", w: "Non-overlap is symmetric." },
            { c: "", w: "" },
            { c: "Some A are B     ->  Some B are A          VALID", w: "Overlap is symmetric." },
            { c: "", w: "" },
            { c: "Some A are not B ->  Some B are not A      INVALID", w: "The asymmetric one, and the most-tested conversion of the four.", hi: true }
          ]
        }
      },

      { h: "The method" },

      {
        code: {
          lang: "text", t: "Test against every possible diagram, not one",
          lines: [
            { c: "1. Draw a diagram satisfying ALL the statements.", w: "" },
            { c: "", w: "" },
            { c: "2. Check whether the conclusion holds in it.", w: "" },
            { c: "   If it does NOT, the conclusion is false. Done.", w: "One counter-diagram kills a conclusion outright.", hi: true },
            { c: "", w: "" },
            { c: "3. If it does hold, try to draw a DIFFERENT valid diagram", w: "" },
            { c: "   in which it fails.", w: "**This step is the whole skill. Most candidates stop at step 2.**", hi: true },
            { c: "", w: "" },
            { c: "4. A conclusion FOLLOWS only if it holds in every valid", w: "" },
            { c: "   diagram you can construct.", w: "" },
            { c: "", w: "" },
            { c: "Where 'some' is involved, always test both the minimal", w: "" },
            { c: "overlap and the maximal (one circle inside the other).", w: "Those two extremes catch nearly every trick conclusion.", hi: true }
          ]
        }
      },

      { h: "Possibility conclusions" },

      {
        code: {
          lang: "text", t: "The type that reverses the whole test",
          lines: [
            { c: "A conclusion phrased 'All A being B is a possibility'", w: "" },
            { c: "is TRUE if you can draw even ONE valid diagram where it holds.", w: "**The opposite of the normal test. One example proves it.**", hi: true },
            { c: "", w: "" },
            { c: "Statements: Some A are B.  All B are C.", w: "" },
            { c: "Conclusion: All A being C is a possibility.", w: "" },
            { c: "", w: "" },
            { c: "Can we draw A entirely inside C while keeping both", w: "" },
            { c: "statements true? Yes - put all of A inside C, with the", w: "" },
            { c: "A-B overlap inside C too.  So the possibility HOLDS.", w: "Nothing in the statements forbids it, which is all that is required.", hi: true },
            { c: "", w: "" },
            { c: "Rule of thumb: a possibility conclusion fails only when the", w: "" },
            { c: "statements make it outright IMPOSSIBLE.", w: "'No A is B' makes 'some A are B is a possibility' false." }
          ]
        }
      },

      { h: "Either-or conclusions" },

      {
        code: {
          lang: "text", t: "When two conclusions are individually false but jointly certain",
          lines: [
            { c: "Two conditions must BOTH hold for an either-or pair:", w: "" },
            { c: "", w: "" },
            { c: "  1. Neither conclusion follows on its own.", w: "" },
            { c: "  2. The two together exhaust all the possibilities -", w: "" },
            { c: "     no valid diagram makes both false.", w: "**They must be complementary, not merely both uncertain.**", hi: true },
            { c: "", w: "" },
            { c: "Typical pair:  I. Some A are B.   II. No A is B.", w: "" },
            { c: "Neither is forced, but one of them MUST be true, since", w: "" },
            { c: "they cover every case between them.", w: "Answer: either I or II follows.", hi: true },
            { c: "", w: "" },
            { c: "Watch the complementary shapes:", w: "" },
            { c: "  'Some A are B' pairs with 'No A is B'", w: "" },
            { c: "  'All A are B'  pairs with 'Some A are not B'", w: "Learn these two pairings; they are the only ones that occur." }
          ]
        }
      },

      { h: "Statement and conclusion, statement and assumption" },

      {
        tbl: {
          t: "The related question types, and what each demands",
          h: ["Type", "Test"],
          rows: [
            ["**Conclusion**", "Must follow *from the statement alone*, with no outside knowledge added"],
            ["**Assumption**", "Something the statement takes for granted. Negate it — if the statement collapses, it was an assumption"],
            ["**Inference**", "Something that must be true given the statement, though not stated"],
            ["**Course of action**", "Must be practical, address the stated problem, and be within the actor's power"],
            ["**Strengthen / weaken**", "Which option most affects the link between the evidence and the claim"]
          ]
        }
      },

      { trap: "The single largest source of error across all of these is **importing outside knowledge**. If a passage says a company's sales fell after a price rise, a conclusion that *price rises always reduce sales* does not follow — however true it may be in general. Answer only from what is on the page. This is the same discipline the critical-reasoning lesson in the verbal module applies to argument questions." },

      {
        tryit: {
          t: "Three sets of statements",
          task: "For each, say which conclusions follow. (a) All pens are books. All books are papers. Conclusions: I. All pens are papers. II. Some papers are pens. (b) Some cats are dogs. No dog is a rat. Conclusions: I. Some cats are not rats. II. No cat is a rat. (c) All doctors are rich. Some rich are famous. Conclusions: I. Some doctors are famous. II. All doctors being famous is a possibility.",
          hint: "(b) careful — think about whether cats outside the dog overlap could be rats. (c) one is a possibility conclusion.",
          sol: { lang: "text", code: "(a) Both follow.\n    Pens inside books inside papers, so all pens are papers.\n    And that overlap makes 'some papers are pens' true.\n\n(b) Only I follows.\n    The cats that are dogs cannot be rats, so at least some\n    cats are not rats - that is forced.\n    II fails: cats outside the dog overlap could be rats.\n\n(c) Only II follows.\n    I is not forced - the famous part of 'rich' might not\n    include any doctors.\n    II is a possibility: nothing prevents all doctors from\n    sitting inside the famous region, so it can be drawn." },
          w: "Set (b) is the standard trap. Conclusion I feels weaker than II, so candidates who pick by strength choose II. The Venn test picks I, because it is the one that survives every diagram."
        }
      }
    ],
    k: [
      "Four statement forms, four diagrams. Draw, do not reason verbally.",
      "*All A are B* does not give *all B are A*; *some A are not B* does not reverse.",
      "A conclusion follows only if it holds in EVERY valid diagram.",
      "A possibility conclusion needs only ONE valid diagram — the test reverses.",
      "Either-or requires that neither follows alone and that together they exhaust the cases.",
      "Negate a candidate assumption: if the statement collapses, it was assumed.",
      "Never import outside knowledge. Answer from the page only."
    ],
    r: ["Set"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "a conclusion follows only if it holds in EVERY valid diagram", w: "the core syllogism test" },
        { c: "a possibility needs only ONE valid diagram", w: "the reversed test" },
        { c: "some A are not B does not give some B are not A", w: "the invalid conversion" }
      ]
    }
  },

  {
    t: "Clocks, Calendars, Cubes and Dice",
    m: "logical",
    lvl: "intermediate",
    s: "Four small topics with exact formulas: clock angles and coincidences, the odd-days method for any date, cube painting counts and dice face deduction.",
    goal: [
      "Compute a clock angle and the times of coincidence or opposition",
      "Find the day of the week for any date using odd days",
      "Count painted faces on a cut cube and deduce opposite faces on a die"
    ],
    b: [
      { p: "These four appear in almost every reasoning paper and each is worth one to two questions. All four are formula-driven, which makes them the most reliable marks in the section — and the reason to learn them properly is that they take about twenty seconds each once the method is automatic." },

      { h: "Clocks" },

      {
        code: {
          lang: "text", t: "Two speeds, one formula",
          lines: [
            { c: "The minute hand moves 6 degrees per minute.", w: "360 degrees in 60 minutes." },
            { c: "The hour hand moves 0.5 degrees per minute.", w: "360 degrees in 12 hours = 720 minutes.", hi: true },
            { c: "Relative speed = 5.5 degrees per minute.", w: "The minute hand gains this much on the hour hand." },
            { c: "", w: "" },
            { c: "Angle at H hours M minutes:", w: "" },
            { c: "  angle = |30H - 5.5M|", w: "**The one formula the topic needs. Take the smaller of it and 360 minus it.**", hi: true },
            { c: "", w: "" },
            { c: "  at 3:40  ->  |90 - 220| = 130 degrees", w: "" },
            { c: "", w: "" },
            { c: "Hands COINCIDE 11 times in 12 hours, every 65 5/11 minutes.", w: "Not 12 times - the 12 o'clock coincidence is shared." },
            { c: "Hands are OPPOSITE 11 times in 12 hours.", w: "" },
            { c: "Hands are at RIGHT ANGLES 22 times in 12 hours.", w: "Twice per coincidence cycle.", hi: true },
            { c: "", w: "" },
            { c: "A clock gaining or losing time: compare its 24-hour drift", w: "" },
            { c: "against a true day and scale proportionally.", w: "" }
          ]
        }
      },

      { h: "Calendars: the odd-days method" },

      {
        code: {
          lang: "text", t: "Counting days modulo 7",
          lines: [
            { c: "An 'odd day' is the remainder when a period is divided by 7.", w: "" },
            { c: "", w: "" },
            { c: "  ordinary year = 365 days = 52 weeks + 1  ->  1 odd day", w: "" },
            { c: "  leap year     = 366 days              ->  2 odd days", w: "**A leap year shifts the weekday by two, not one.**", hi: true },
            { c: "", w: "" },
            { c: "  100 years  ->  5 odd days", w: "" },
            { c: "  200 years  ->  3 odd days", w: "" },
            { c: "  300 years  ->  1 odd day", w: "" },
            { c: "  400 years  ->  0 odd days", w: "The cycle repeats every 400 years exactly.", hi: true },
            { c: "", w: "" },
            { c: "Leap year rule: divisible by 4, EXCEPT century years,", w: "" },
            { c: "which must be divisible by 400.", w: "1900 was not a leap year. 2000 was. This is asked directly.", hi: true },
            { c: "", w: "" },
            { c: "Month odd days: Jan 3, Feb 0 (1 in a leap year), Mar 3,", w: "" },
            { c: "Apr 2, May 3, Jun 2, Jul 3, Aug 3, Sep 2, Oct 3, Nov 2, Dec 3", w: "31-day months give 3, 30-day months give 2." },
            { c: "", w: "" },
            { c: "0=Sunday, 1=Monday, ... 6=Saturday", w: "" },
            { c: "", w: "" },
            { c: "Shortcut: the same date next year is +1 weekday, or +2 if", w: "" },
            { c: "a 29 February falls between the two dates.", w: "Answers most 'what day was it a year ago' questions instantly." }
          ]
        }
      },

      { h: "Cubes" },

      {
        code: {
          lang: "text", t: "A painted cube cut into n^3 small cubes",
          lines: [
            { c: "3 painted faces (corners)      = 8, always", w: "**A cube has 8 corners regardless of n.**", hi: true },
            { c: "2 painted faces (edges)        = 12(n - 2)", w: "12 edges, each with n-2 non-corner cubes." },
            { c: "1 painted face (face centres)  = 6(n - 2)^2", w: "6 faces, each an (n-2) x (n-2) inner square." },
            { c: "0 painted faces (interior)     = (n - 2)^3", w: "The hidden inner cube.", hi: true },
            { c: "", w: "" },
            { c: "Check: 8 + 12(n-2) + 6(n-2)^2 + (n-2)^3 = n^3", w: "Always verify with this. It catches every slip." },
            { c: "", w: "" },
            { c: "For n = 4:  8 + 24 + 24 + 8 = 64.  Correct.", w: "" },
            { c: "", w: "" },
            { c: "If only some faces are painted, or two colours are used,", w: "" },
            { c: "count each face's contribution separately and watch the", w: "" },
            { c: "shared edges, which get counted twice if you are careless.", w: "The harder variant, and the shared edges are the whole difficulty." }
          ]
        }
      },

      { h: "Dice" },

      {
        code: {
          lang: "text", t: "Deducing the opposite faces",
          lines: [
            { c: "A standard die: opposite faces sum to 7.", w: "1-6, 2-5, 3-4. Assume this only if the question says 'standard'." },
            { c: "", w: "" },
            { c: "For a non-standard die shown in two or more positions:", w: "" },
            { c: "", w: "" },
            { c: "  Rule 1: if a face is COMMON to two views, rotate mentally", w: "" },
            { c: "          about it - the other faces cycle in order.", w: "", hi: true },
            { c: "  Rule 2: two faces seen TOGETHER in any single view can", w: "" },
            { c: "          never be opposite each other.", w: "**This eliminates faster than anything else. Use it first.**", hi: true },
            { c: "  Rule 3: with two views sharing two common faces, the", w: "" },
            { c: "          remaining two are opposite each other.", w: "" },
            { c: "", w: "" },
            { c: "Method: list all six faces, then for each view strike out", w: "" },
            { c: "the pairs that appeared together. What survives is opposite.", w: "Pure elimination — no spatial visualisation needed.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "One from each topic",
          task: "(a) What is the angle between the hands at 4:20? (b) If 15 August 2020 was a Saturday, what day was 15 August 2021? (c) A 5×5×5 cube painted on all faces is cut into unit cubes. How many have exactly two painted faces? (d) A die shows 1, 2, 3 in one view and 1, 3, 5 in another. Which face is opposite 1?",
          hint: "(a) |30H − 5.5M|. (b) 2021 is not a leap year, and no 29 February falls between. (d) rule 2.",
          sol: { lang: "text", code: "(a) |30 x 4 - 5.5 x 20| = |120 - 110| = 10 degrees\n\n(b) one ordinary year = 1 odd day\n    Saturday + 1 = Sunday\n\n(c) 12(n - 2) = 12 x 3 = 36 cubes\n\n(d) 1 appears with 2, 3 and 5, so none of those is opposite 1.\n    The remaining faces are 4 and 6.\n    3 appears with 1, 2 and 5, so 3 is opposite 4 or 6.\n    From the two views, 1 must be opposite 4 or 6 -\n    and since 3 is seen with both 2 and 5, the consistent\n    assignment gives 1 opposite 6." },
          w: "Part (a) is worth noting: 10° is a small angle, and candidates who compute 4:20 as *the hour hand at exactly 4* get 20°. The hour hand has moved a third of the way to 5, and that movement is what the −5.5M term captures."
        }
      }
    ],
    k: [
      "Clock angle = |30H − 5.5M|; take the smaller of that and 360 − it.",
      "Hands coincide 11 times in 12 hours, every 65 5/11 minutes.",
      "Ordinary year: 1 odd day. Leap year: 2. 400 years: 0.",
      "Century years are leap years only if divisible by 400.",
      "Painted cube: 8 corners, 12(n−2) edges, 6(n−2)² faces, (n−2)³ hidden.",
      "Two die faces seen together in one view can never be opposite.",
      "Verify cube counts by checking they sum to n³."
    ],
    r: ["Algorithm"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "clock angle = |30H - 5.5M|", w: "the only clock formula needed" },
        { c: "ordinary year 1 odd day, leap year 2", w: "the calendar method" },
        { c: "cube: 8 corners, 12(n-2) edges, 6(n-2)^2 faces", w: "painted-cube counts" }
      ]
    }
  }

]);
