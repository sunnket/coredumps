/* Aptitude — counting, probability and sets. */
TD.addLessons("aptitude", [

  {
    t: "Permutations and Combinations — deciding whether order matters",
    m: "counting",
    lvl: "core",
    s: "The two counting principles, when to use P and when to use C, and the handful of arrangement patterns that cover most questions.",
    goal: [
      "Decide in five seconds whether a question is a permutation or a combination",
      "Apply the addition and multiplication principles without double-counting",
      "Recognise the standard arrangement patterns: together, never together, circular, repeated letters"
    ],
    b: [
      { p: "Counting is the topic where candidates most often get a clean-looking wrong answer. The arithmetic is easy; the classification is not. Almost every error is one of three: order was treated as mattering when it did not, cases overlapped and got double-counted, or a constraint was applied after arranging rather than before." },

      { h: "The two principles" },

      {
        code: {
          lang: "text", t: "Everything is built from these",
          lines: [
            { c: "MULTIPLICATION (and):  stages that all happen", w: "" },
            { c: "  3 shirts AND 4 trousers  ->  3 x 4 = 12 outfits", w: "**Sequential choices multiply.**", hi: true },
            { c: "", w: "" },
            { c: "ADDITION (or):  mutually exclusive alternatives", w: "" },
            { c: "  travel by 3 trains OR 4 buses  ->  3 + 4 = 7 ways", w: "Alternatives add — but only when they cannot overlap.", hi: true },
            { c: "", w: "" },
            { c: "If the alternatives CAN overlap, subtract the overlap:", w: "" },
            { c: "  |A or B| = |A| + |B| - |A and B|", w: "This is inclusion-exclusion, and it is the fix for double-counting." }
          ]
        }
      },

      { h: "Permutation or combination" },

      {
        tbl: {
          t: "The classification test",
          h: ["Ask", "If yes", "Formula"],
          rows: [
            ["Would swapping two chosen items give a **different** outcome?", "**Permutation** — order matters", "ⁿPᵣ = n!/(n−r)!"],
            ["Is the selection just a group, with no order?", "**Combination** — order does not matter", "ⁿCᵣ = n!/(r!(n−r)!)"],
            ["Arranging in a row, ranking, assigning distinct roles", "Permutation", "Positions are distinguishable"],
            ["Forming a committee, choosing a team, picking cards", "Combination", "Members are interchangeable"],
            ["Choosing a president and a secretary", "Permutation", "The two roles differ"],
            ["Choosing two members of equal standing", "Combination", "The two roles do not differ"]
          ]
        }
      },

      { n: "The relation between them is worth internalising: ⁿPᵣ = ⁿCᵣ × r!. Choose the group, then arrange it. Many questions are cleanest as *select, then arrange* in two explicit steps rather than as one permutation, especially when a constraint applies to the selection but not the arrangement.", nt: "Select, then arrange" },

      {
        code: {
          lang: "text", t: "The combination facts that save time",
          lines: [
            { c: "nCr = nC(n-r)", w: "**10C8 = 10C2 = 45. Always convert to the smaller r.**", hi: true },
            { c: "nC0 = nCn = 1", w: "" },
            { c: "nC1 = n", w: "" },
            { c: "nCr + nC(r-1) = (n+1)Cr", w: "Pascal's rule; occasionally the fastest route." },
            { c: "sum of all nCr for r = 0..n  =  2^n", w: "**The number of subsets of an n-element set — a question in itself.**", hi: true },
            { c: "", w: "" },
            { c: "Compute by cancelling, never by expanding factorials:", w: "" },
            { c: "  10C3 = (10 x 9 x 8)/(3 x 2 x 1) = 120", w: "r factors on top, r factors on the bottom. Never write out 10!." }
          ]
        }
      },

      { h: "The arrangement patterns" },

      {
        tbl: {
          t: "The patterns that cover most questions",
          h: ["Pattern", "Method", "Example"],
          rows: [
            ["**All n distinct in a row**", "n!", "5 books on a shelf: 120"],
            ["**With repeats**", "n! ÷ (product of the repeat factorials)", "LEVEL: 5!/(2!2!) = 30"],
            ["**Two must sit together**", "Glue them into one unit: (n−1)! × 2!", "The ×2! is their internal order"],
            ["**Two must never sit together**", "Total − together", "Almost always faster than direct counting"],
            ["**No two of a group adjacent**", "Arrange the others, then place the group in the **gaps**", "The gap method — the key trick in the topic"],
            ["**Circular arrangement**", "(n−1)!", "One seat is fixed to kill rotations"],
            ["**Circular, necklace or garland**", "(n−1)!/2", "Flipping it over gives the same arrangement"],
            ["**Boys and girls alternate**", "Arrange one group, then fill the gaps", "Count the gaps carefully — ends matter"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "The gap method, which is worth its own worked example",
          lines: [
            { c: "In how many ways can 4 boys and 3 girls sit in a row so that", w: "" },
            { c: "no two girls are adjacent?", w: "" },
            { c: "", w: "" },
            { c: "Step 1: arrange the boys.  4! = 24", w: "**Arrange the unconstrained group first. Always.**", hi: true },
            { c: "", w: "" },
            { c: "Step 2: that creates 5 gaps:  _ B _ B _ B _ B _", w: "Including the two ends. Forgetting the ends is the standard error.", hi: true },
            { c: "", w: "" },
            { c: "Step 3: choose 3 of those 5 gaps and arrange the girls:", w: "" },
            { c: "        5P3 = 60", w: "" },
            { c: "", w: "" },
            { c: "Total = 24 x 60 = 1440", w: "" },
            { c: "", w: "" },
            { c: "Compare: 'all girls together' would be 5! x 3! = 720.", w: "Together glues; never-together uses gaps. Two different tools." }
          ]
        }
      },

      { trap: "**Apply constraints before you count, not after.** A question asking for four-digit numbers with no repeated digits has a constraint on the first digit — it cannot be zero — and handling that at the end means recounting from scratch. Start with the most restricted position: 9 choices for the leading digit, then 9, 8, 7 for the rest, giving 4536." },

      { h: "Selection with conditions" },

      {
        code: {
          lang: "text", t: "'At least' is usually a complement question",
          lines: [
            { c: "From 5 men and 4 women, form a committee of 4 with at least", w: "" },
            { c: "one woman.", w: "" },
            { c: "", w: "" },
            { c: "Direct: exactly 1 + exactly 2 + exactly 3 + exactly 4 women", w: "" },
            { c: "  = 4C1x5C3 + 4C2x5C2 + 4C3x5C1 + 4C4x5C0", w: "" },
            { c: "  = 40 + 60 + 20 + 1 = 121", w: "Correct, four terms, four chances to slip." },
            { c: "", w: "" },
            { c: "Complement: all committees minus the all-male ones", w: "" },
            { c: "  = 9C4 - 5C4 = 126 - 5 = 121", w: "**'At least one' almost always means: total minus none.**", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Four classifications",
          task: "(a) How many arrangements of the letters of ARRANGE are there? (b) In how many ways can 6 people sit around a round table? (c) A team of 3 is chosen from 8 people. How many teams include a specific person? (d) How many 3-digit numbers have all distinct digits?",
          hint: "(a) count the repeats. (c) fix that person and choose the rest.",
          sol: { lang: "text", code: "(a) ARRANGE has 7 letters: A twice, R twice\n    7!/(2! x 2!) = 5040/4 = 1260\n\n(b) (6 - 1)! = 120\n\n(c) fix the person, choose 2 from the remaining 7: 7C2 = 21\n\n(d) hundreds digit: 9 choices (not 0)\n    tens: 9 remaining (0 is now allowed)\n    units: 8\n    9 x 9 x 8 = 648" },
          w: "Part (d) shows the discipline: start at the most constrained position. Doing the tens digit first leaves you unable to say how many choices the hundreds digit has, and that ambiguity is where wrong answers come from."
        }
      }
    ],
    k: [
      "Order matters ⇒ permutation. Order does not ⇒ combination.",
      "ⁿPᵣ = ⁿCᵣ × r!: select, then arrange.",
      "ⁿCᵣ = ⁿC(n−r) — always convert to the smaller r before computing.",
      "Repeated letters: divide by the factorial of each repeat count.",
      "Together ⇒ glue and multiply by the internal arrangements. Never together ⇒ use gaps.",
      "Circular arrangements are (n−1)!; necklaces are (n−1)!/2.",
      "*At least one* is nearly always total minus none.",
      "Apply the tightest constraint first, before counting anything else."
    ],
    r: ["Probability", "Set"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "nPr = nCr x r!", w: "select, then arrange" },
        { c: "no two adjacent: arrange the rest, fill the gaps", w: "the gap method" },
        { c: "at least one = total - none", w: "the complement shortcut" }
      ]
    }
  },

  {
    t: "Probability",
    m: "counting",
    lvl: "core",
    s: "Sample spaces, the addition and multiplication rules, independence versus mutual exclusivity, conditional probability and expected value.",
    goal: [
      "Build a correct sample space before computing anything",
      "Distinguish mutually exclusive from independent, which are not the same idea",
      "Use conditional probability and expected value on the questions that need them"
    ],
    b: [
      { p: "Probability in aptitude tests is counting with a denominator. If you can count the favourable outcomes and the total outcomes, you are done — which means every skill from the previous lesson transfers directly, and the only new ideas are the rules for combining events." },

      {
        code: {
          lang: "text", t: "The definition, and what it demands",
          lines: [
            { c: "P(E) = favourable outcomes / total outcomes", w: "" },
            { c: "", w: "" },
            { c: "This requires all outcomes to be EQUALLY LIKELY.", w: "**The assumption that quietly breaks half of all wrong answers.**", hi: true },
            { c: "", w: "" },
            { c: "Two dice: the sample space is 36 ORDERED pairs, not 21", w: "" },
            { c: "unordered ones - because (2,3) and (3,2) are both equally", w: "" },
            { c: "likely and must be counted separately.", w: "Getting this wrong makes every two-dice answer wrong.", hi: true },
            { c: "", w: "" },
            { c: "0 <= P(E) <= 1,  and  P(not E) = 1 - P(E)", w: "An answer outside [0,1] is an arithmetic error, checked instantly." }
          ]
        }
      },

      { h: "The combination rules" },

      {
        tbl: {
          t: "Two rules, and the conditions attached to each",
          h: ["Rule", "Formula", "Condition"],
          rows: [
            ["Addition (**or**)", "P(A∪B) = P(A) + P(B) − P(A∩B)", "Always true"],
            ["Addition, simplified", "P(A∪B) = P(A) + P(B)", "Only if **mutually exclusive** (they cannot both happen)"],
            ["Multiplication (**and**)", "P(A∩B) = P(A) × P(B|A)", "Always true"],
            ["Multiplication, simplified", "P(A∩B) = P(A) × P(B)", "Only if **independent** (one does not affect the other)"],
            ["Conditional", "P(B|A) = P(A∩B)/P(A)", "Requires P(A) > 0"],
            ["Complement", "P(at least one) = 1 − P(none)", "The single most useful line in the topic"]
          ]
        }
      },

      { trap: "**Mutually exclusive and independent are opposites, not synonyms.** Mutually exclusive events cannot both happen, so knowing one occurred tells you the other did not — which makes them maximally *dependent*. Independent events can happily both happen; one just carries no information about the other. Any question that says *mutually exclusive and independent* is describing events with probability zero." },

      { h: "With replacement, or without" },

      {
        code: {
          lang: "text", t: "The one detail that changes every answer",
          lines: [
            { c: "A bag has 5 red and 3 blue balls. Two are drawn.", w: "" },
            { c: "P(both red)?", w: "" },
            { c: "", w: "" },
            { c: "WITH replacement (independent):", w: "" },
            { c: "  5/8 x 5/8 = 25/64", w: "The bag is restored, so the second draw is unchanged." },
            { c: "", w: "" },
            { c: "WITHOUT replacement (dependent):", w: "" },
            { c: "  5/8 x 4/7 = 20/56 = 5/14", w: "**Both the numerator and the denominator drop by one.**", hi: true },
            { c: "", w: "" },
            { c: "Equivalently, by counting:  5C2 / 8C2 = 10/28 = 5/14", w: "Same answer. Use whichever setup you find harder to mis-set-up.", hi: true },
            { c: "", w: "" },
            { c: "If the question does not say, 'drawn together' means", w: "" },
            { c: "without replacement.", w: "As does 'drawn one after another without replacement', obviously." }
          ]
        }
      },

      { h: "The standard sample spaces" },

      {
        tbl: {
          t: "Know these totals before you start",
          h: ["Setup", "Total outcomes", "Worth knowing"],
          rows: [
            ["One coin, n tosses", "2ⁿ", "Exactly k heads: ⁿCₖ/2ⁿ"],
            ["Two dice", "36", "Sum 7 is the most likely, with 6 ways"],
            ["Three dice", "216", "—"],
            ["A standard deck", "52", "26 red, 26 black, 13 per suit, 12 face cards, 4 aces"],
            ["Drawing r from n", "ⁿCᵣ", "Use counting, not sequential fractions, when r is large"]
          ]
        }
      },

      { n: "For two dice, the number of ways to make each sum runs 1, 2, 3, 4, 5, **6**, 5, 4, 3, 2, 1 for sums 2 through 12. Memorising that row answers every two-dice question by inspection — P(sum ≥ 10) is (3+2+1)/36 = 1/6 with no enumeration at all.", nt: "The two-dice row" },

      { h: "Conditional probability" },

      {
        code: {
          lang: "text", t: "Restricting the sample space",
          lines: [
            { c: "P(B | A) = P(A and B) / P(A)", w: "" },
            { c: "", w: "" },
            { c: "The intuition: A becoming known SHRINKS the sample space", w: "" },
            { c: "to just the A outcomes, and you re-measure B inside it.", w: "**That sentence is more useful than the formula.**", hi: true },
            { c: "", w: "" },
            { c: "Two children, at least one is a boy. P(both boys)?", w: "" },
            { c: "  space: BB, BG, GB, GG.  'At least one boy' rules out GG.", w: "" },
            { c: "  three outcomes remain, one is BB  ->  1/3, not 1/2", w: "The famous one, and the reasoning generalises.", hi: true },
            { c: "", w: "" },
            { c: "Bayes, when a test result is given and you want the cause:", w: "" },
            { c: "  P(A|B) = P(B|A) P(A) / P(B)", w: "Rare in placement papers, common in CAT-style and interview questions." }
          ]
        }
      },

      { h: "Expected value" },

      {
        code: {
          lang: "text", t: "The weighted average of the outcomes",
          lines: [
            { c: "E = sum of (each outcome x its probability)", w: "" },
            { c: "", w: "" },
            { c: "A die roll:  (1+2+3+4+5+6)/6 = 3.5", w: "The expected value need not be a possible outcome." },
            { c: "", w: "" },
            { c: "A game: win 100 with probability 0.2, lose 30 otherwise.", w: "" },
            { c: "  E = 0.2 x 100 + 0.8 x (-30) = 20 - 24 = -4", w: "**Negative, so the game is not worth playing.**", hi: true },
            { c: "", w: "" },
            { c: "This is exactly the calculation behind negative marking,", w: "" },
            { c: "which the exam-craft module works through in full.", w: "Same formula, applied to your own guessing." }
          ]
        }
      },

      {
        tryit: {
          t: "Four, using four different tools",
          task: "(a) Two dice are thrown. Find P(sum is 9 or more). (b) A bag has 4 white and 6 black balls; three are drawn without replacement. Find P(all black). (c) Three coins are tossed. Find P(at least one head). (d) A card is drawn from a deck. Find P(it is a king or a heart).",
          hint: "(a) the two-dice row. (c) complement. (d) inclusion–exclusion — the king of hearts is in both.",
          sol: { lang: "text", code: "(a) sums 9,10,11,12 have 4+3+2+1 = 10 ways\n    10/36 = 5/18\n\n(b) 6C3 / 10C3 = 20/120 = 1/6\n    (or 6/10 x 5/9 x 4/8 = 120/720 = 1/6)\n\n(c) 1 - P(no heads) = 1 - 1/8 = 7/8\n\n(d) 4/52 + 13/52 - 1/52 = 16/52 = 4/13" },
          w: "Part (d) is the reason the full addition rule exists. Answering 4/52 + 13/52 = 17/52 counts the king of hearts twice, and that option will be sitting right there among the choices."
        }
      }
    ],
    k: [
      "Probability needs equally likely outcomes — two dice give 36 ordered pairs, not 21.",
      "P(A∪B) = P(A) + P(B) − P(A∩B). Drop the last term only when mutually exclusive.",
      "P(A∩B) = P(A)P(B) only when independent.",
      "Mutually exclusive and independent are opposite ideas, not the same one.",
      "*At least one* = 1 − P(none). Reach for it first.",
      "Without replacement, both numerator and denominator drop each draw.",
      "Two-dice ways by sum: 1,2,3,4,5,6,5,4,3,2,1.",
      "Expected value is the probability-weighted average of the outcomes."
    ],
    r: ["Probability", "Conditional Probability", "Expected Value", "Bayes Theorem"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "P(A or B) = P(A) + P(B) - P(A and B)", w: "the full addition rule" },
        { c: "P(at least one) = 1 - P(none)", w: "the complement shortcut" },
        { c: "two dice ways: 1 2 3 4 5 6 5 4 3 2 1", w: "answers most dice questions by inspection" }
      ]
    }
  },

  {
    t: "Sets and Venn Diagrams",
    m: "counting",
    lvl: "intermediate",
    s: "Two-set and three-set formulas, the maximum-minimum overlap questions, and the discipline of filling a Venn diagram from the inside out.",
    goal: [
      "Apply inclusion–exclusion for two and three sets without error",
      "Fill a three-circle Venn diagram in the correct order",
      "Answer *maximum* and *minimum* overlap questions, which have no formula"
    ],
    b: [
      { p: "Set questions are almost always survey questions: how many people like tea, coffee, both, neither. They are easy in principle and go wrong in practice for one reason — candidates fill the Venn diagram from the outside in, and every region then contains a number that includes other regions." },

      { h: "The formulas" },

      {
        code: {
          lang: "text", t: "Inclusion-exclusion for two and three sets",
          lines: [
            { c: "TWO SETS", w: "" },
            { c: "  n(A u B) = n(A) + n(B) - n(A n B)", w: "" },
            { c: "  neither  = total - n(A u B)", w: "**Neither is the region outside both circles, and it is often the answer.**", hi: true },
            { c: "", w: "" },
            { c: "THREE SETS", w: "" },
            { c: "  n(A u B u C) = n(A) + n(B) + n(C)", w: "" },
            { c: "               - n(AnB) - n(BnC) - n(AnC)", w: "" },
            { c: "               + n(AnBnC)", w: "**Subtract the pairs, add the triple back. The signs alternate.**", hi: true },
            { c: "", w: "" },
            { c: "Two useful reformulations:", w: "" },
            { c: "  exactly two   = (sum of pairwise) - 3 x (triple)", w: "" },
            { c: "  exactly one   = total in union - exactly two - triple", w: "Questions ask for these far more often than for the union itself.", hi: true }
          ]
        }
      },

      { h: "Filling the diagram" },

      {
        code: {
          lang: "text", t: "Inside out, always",
          lines: [
            { c: "In a survey of 100 people: 60 like tea, 50 like coffee,", w: "" },
            { c: "35 like both. How many like exactly one? How many neither?", w: "" },
            { c: "", w: "" },
            { c: "Step 1: put the INTERSECTION in first.        both = 35", w: "**Start at the centre. This is the whole discipline.**", hi: true },
            { c: "Step 2: subtract it out of each circle.", w: "" },
            { c: "        tea only    = 60 - 35 = 25", w: "" },
            { c: "        coffee only = 50 - 35 = 15", w: "" },
            { c: "Step 3: union = 25 + 35 + 15 = 75", w: "" },
            { c: "Step 4: neither = 100 - 75 = 25", w: "" },
            { c: "", w: "" },
            { c: "exactly one = 25 + 15 = 40", w: "Every region now holds a count that belongs to it alone.", hi: true }
          ]
        }
      },

      { trap: "*60 like tea* means **60 in the whole tea circle**, including those who also like coffee. It does not mean 60 like tea only. Every set question depends on reading which of the two is meant, and a question that intends *only* will normally say so — but check, because when it does not say so, the inclusive reading is correct and the other one is a wrong-answer option." },

      { h: "Three sets, worked" },

      {
        code: {
          lang: "text", t: "The same discipline, one layer deeper",
          lines: [
            { c: "100 students. 40 play cricket, 35 hockey, 30 football.", w: "" },
            { c: "15 play cricket and hockey, 12 hockey and football,", w: "" },
            { c: "10 cricket and football, 5 play all three.", w: "" },
            { c: "", w: "" },
            { c: "Centre first:  all three = 5", w: "", hi: true },
            { c: "Then the pairwise-only regions:", w: "" },
            { c: "  cricket & hockey only  = 15 - 5 = 10", w: "**The given 15 INCLUDES the 5. Subtract the centre out.**", hi: true },
            { c: "  hockey & football only = 12 - 5 = 7", w: "" },
            { c: "  cricket & football only= 10 - 5 = 5", w: "" },
            { c: "Then the single-sport regions:", w: "" },
            { c: "  cricket only  = 40 - 10 - 5 - 5 = 20", w: "Subtract all three overlapping regions, not just the pairs." },
            { c: "  hockey only   = 35 - 10 - 7 - 5 = 13", w: "" },
            { c: "  football only = 30 - 7 - 5 - 5 = 13", w: "" },
            { c: "", w: "" },
            { c: "union = 20+13+13 + 10+7+5 + 5 = 73", w: "" },
            { c: "none of the three = 100 - 73 = 27", w: "Check against the formula: 105 - 37 + 5 = 73. Agrees." }
          ]
        }
      },

      { h: "Maximum and minimum overlap" },

      { p: "A distinct question type with no formula, common in CAT-style papers: given the sizes of two or three groups and a total, find the largest or smallest possible overlap. It is answered by reasoning about extremes, not by substituting." },

      {
        code: {
          lang: "text", t: "The reasoning, not a formula",
          lines: [
            { c: "In a class of 100, 70 like tea and 80 like coffee.", w: "" },
            { c: "", w: "" },
            { c: "MAXIMUM overlap: push the smaller group entirely inside", w: "" },
            { c: "the larger one.  max = min(70, 80) = 70", w: "**Everyone who likes tea could also like coffee.**", hi: true },
            { c: "", w: "" },
            { c: "MINIMUM overlap: spread them as far apart as the room allows.", w: "" },
            { c: "  70 + 80 = 150 people-slots for only 100 people", w: "" },
            { c: "  min = 150 - 100 = 50", w: "The excess over the total must be shared.", hi: true },
            { c: "", w: "" },
            { c: "General:  min overlap = max(0, n(A) + n(B) - total)", w: "" },
            { c: "          max overlap = min(n(A), n(B))", w: "" },
            { c: "", w: "" },
            { c: "If some people like neither, the minimum falls further -", w: "" },
            { c: "reread whether 'neither' is allowed before answering.", w: "That clause is the whole difficulty in the harder versions." }
          ]
        }
      },

      {
        tryit: {
          t: "Three set questions",
          task: "(a) In a group of 60, 27 like tea, 42 like coffee, and each likes at least one. How many like both? (b) In a class of 50: 30 passed maths, 25 passed physics, 8 failed both. How many passed both? (c) Of 200 people, 120 read paper A and 100 read paper B. What is the least and the greatest number who could read both?",
          hint: "(a) *at least one* means nobody is outside. (b) find the union from the failures first.",
          sol: { lang: "text", code: "(a) union = 60\n    27 + 42 - both = 60  ->  both = 9\n\n(b) union = 50 - 8 = 42\n    30 + 25 - both = 42  ->  both = 13\n\n(c) greatest = min(120, 100) = 100\n    least    = 120 + 100 - 200 = 20" },
          w: "Notice (b) works backwards: the *failed both* figure gives you the union, and the union gives you the intersection. Whenever a set question hands you the 'neither' count, that is the intended first step."
        }
      }
    ],
    k: [
      "n(A∪B) = n(A) + n(B) − n(A∩B); *neither* is the total minus the union.",
      "For three sets, subtract the pairs and add the triple back.",
      "Fill a Venn diagram from the centre outward, never from the outside in.",
      "A given pairwise count includes the triple region — subtract it out first.",
      "*40 like tea* means the whole circle, not tea-only.",
      "Max overlap = min of the two sizes; min overlap = max(0, sum − total)."
    ],
    r: ["Set", "Probability"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "n(AuB) = n(A) + n(B) - n(AnB)", w: "two-set inclusion-exclusion" },
        { c: "three sets: add singles, subtract pairs, add the triple", w: "the alternating signs" },
        { c: "min overlap = max(0, a + b - total)", w: "the maximum-minimum question type" }
      ]
    }
  }

]);
