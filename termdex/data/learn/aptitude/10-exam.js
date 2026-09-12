/* Aptitude — exam craft. */
TD.addLessons("aptitude", [

  {
    t: "Question Selection and the Negative-Marking Maths",
    m: "exam",
    lvl: "core",
    s: "Where your guessing break-even actually lies, the three-pass method, and why choosing what to attempt is worth more marks than solving anything faster.",
    goal: [
      "Compute your personal break-even for guessing under any marking scheme",
      "Run a three-pass sweep instead of working straight down the paper",
      "Decide within ten seconds whether a question is yours to attempt"
    ],
    b: [
      { p: "Two candidates know the same syllabus equally well. One scores in the 60th percentile, the other in the 95th. Almost always the difference is not knowledge and not speed — it is that one of them attempted the right thirty questions and the other attempted the first thirty." },

      { h: "The negative-marking arithmetic" },

      {
        code: {
          lang: "text", t: "Work out your break-even once, and remember it",
          lines: [
            { c: "Scheme: +1 for correct, -1/4 for wrong, 4 options.", w: "" },
            { c: "", w: "" },
            { c: "Pure random guess:", w: "" },
            { c: "  E = 1/4 x (+1) + 3/4 x (-1/4) = 0.25 - 0.1875 = +0.0625", w: "**Marginally positive. Random guessing is not punished here.**", hi: true },
            { c: "", w: "" },
            { c: "After eliminating ONE option (3 remain):", w: "" },
            { c: "  E = 1/3 x 1 + 2/3 x (-1/4) = 0.333 - 0.167 = +0.167", w: "Clearly worth it." },
            { c: "", w: "" },
            { c: "After eliminating TWO options (2 remain):", w: "" },
            { c: "  E = 1/2 x 1 + 1/2 x (-1/4) = 0.5 - 0.125 = +0.375", w: "Strongly worth it.", hi: true },
            { c: "", w: "" },
            { c: "General break-even with p options remaining and penalty q:", w: "" },
            { c: "  guess when  1/p > q/(1+q)", w: "" },
            { c: "  at q = 1/4 that is p < 5, so any elimination at all helps.", w: "" },
            { c: "  at q = 1/3 that is p < 4, so you need one elimination.", w: "" },
            { c: "  at q = 1   that is p < 2, so never guess blind.", w: "**Check the scheme in the instructions. It changes the strategy.**", hi: true }
          ]
        }
      },

      { n: "Two practical consequences. First, in the common Indian scheme of +1/−0.25 with four options, blind guessing is very slightly positive, so leaving a question blank is never better than guessing — but the gain is so small that guessing time is better spent elsewhere. Second, an *educated* guess after one elimination is clearly profitable, which makes elimination skill directly worth marks.", nt: "What the numbers actually mean for you" },

      { trap: "**Read the marking scheme in the instructions, every time.** Some campus tests have no negative marking at all — in which case you must answer every single question, including ones you never read. Some have −1 for wrong answers, in which case blind guessing is actively harmful. Candidates apply last year's strategy to this year's scheme and lose marks purely to that." },

      { h: "The three-pass method" },

      {
        code: {
          lang: "text", t: "Never work straight down the paper",
          lines: [
            { c: "PASS 1 - the sweep.  Roughly 40% of the time.", w: "" },
            { c: "  Go through every question. Solve only those you can", w: "" },
            { c: "  finish in under 45 seconds. Mark the rest.", w: "**Bank the certain marks first. All questions are worth the same.**", hi: true },
            { c: "", w: "" },
            { c: "PASS 2 - the workable ones.  Roughly 45% of the time.", w: "" },
            { c: "  Return to the marked questions you know how to do but", w: "" },
            { c: "  that take longer. Work them properly.", w: "" },
            { c: "", w: "" },
            { c: "PASS 3 - elimination and guessing.  The last 15%.", w: "" },
            { c: "  For everything still unanswered, eliminate what you can", w: "" },
            { c: "  and guess according to the scheme.", w: "Leave enough time for this. It is worth real marks.", hi: true },
            { c: "", w: "" },
            { c: "The reason this works: a hard question early in the paper", w: "" },
            { c: "consumes the time that three easy questions later needed,", w: "" },
            { c: "and they are all worth one mark each.", w: "That sentence is the entire argument for the method." }
          ]
        }
      },

      { h: "The ten-second triage" },

      {
        tbl: {
          t: "Deciding whether a question is yours",
          h: ["Signal", "Read it as"],
          rows: [
            ["You recognise the type and know the method", "**Attempt now.** Pass 1"],
            ["You recognise the type but it will take three minutes", "**Mark it.** Pass 2"],
            ["Heavy calculation, options far apart", "Attempt — approximation will carry it"],
            ["Heavy calculation, options within 2%", "Pass 2 at best; exact arithmetic required"],
            ["You do not recognise the type at all", "**Mark and leave.** Pass 3, as a guess"],
            ["A puzzle or DI set with high setup cost", "Judge by reuse: does one setup answer several questions?"],
            ["Wordy question, simple maths", "Usually a good attempt — the length is camouflage"],
            ["Short question, unfamiliar notation", "Usually a bad attempt — the brevity is camouflage"]
          ]
        }
      },

      { n: "The last two rows are worth internalising because they run against instinct. A long word problem is often a two-line calculation wrapped in a story, while a short question in unfamiliar notation can be a genuine wall. Length is not difficulty, and candidates who skip on length alone are skipping their easiest marks.", nt: "Length is not difficulty" },

      { h: "Where the marks actually come from" },

      {
        code: {
          lang: "text", t: "A worked comparison, same knowledge, different strategy",
          lines: [
            { c: "A 30-question quant section, 35 minutes, +1 / -0.25.", w: "" },
            { c: "", w: "" },
            { c: "CANDIDATE A - works straight down the paper.", w: "" },
            { c: "  Attempts 22, gets 15 right, 7 wrong.", w: "" },
            { c: "  Score = 15 - 1.75 = 13.25", w: "" },
            { c: "  Ran out of time at question 22 - questions 23-30", w: "" },
            { c: "  included four she could have solved in a minute each.", w: "**The cost is invisible on the answer sheet.**", hi: true },
            { c: "", w: "" },
            { c: "CANDIDATE B - three passes, same ability.", w: "" },
            { c: "  Pass 1: 14 attempted, 13 right", w: "" },
            { c: "  Pass 2: 8 attempted, 6 right", w: "" },
            { c: "  Pass 3: 5 guessed after elimination, 2 right", w: "" },
            { c: "  Total 21 right, 6 wrong  ->  21 - 1.5 = 19.5", w: "Six marks better, on identical knowledge.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Compute your own numbers",
          task: "Find the marking scheme for the exam you are actually preparing for. Then compute: (1) the expected value of a blind guess, (2) the expected value after eliminating one option, and (3) the minimum number of options you must eliminate for a guess to be worth taking. Write all three on the front of your formula notebook.",
          hint: "E = (1/p) × mark − ((p−1)/p) × penalty, where p is the number of options still standing.",
          sol: { lang: "text", code: "Three common schemes, worked:\n\n  +1 / -0.25, four options\n    blind      +0.0625   guess anything\n    one gone   +0.167    clearly guess\n    threshold  eliminate 0\n\n  +3 / -1, four options\n    blind      3/4 - 3/4 = 0    exactly break-even\n    one gone   1 - 2/3 = +0.33  guess\n    threshold  eliminate 1\n\n  +1 / 0, no penalty\n    blind      +0.25\n    threshold  none - ANSWER EVERY QUESTION" },
          w: "Writing these on your formula sheet matters because you will not compute expected values at minute thirty of a real exam. The decision must already be made before you walk in."
        }
      }
    ],
    k: [
      "Read the marking scheme in the instructions before the first question.",
      "With +1/−0.25 over four options, a blind guess is marginally positive.",
      "Guess when 1/p > q/(1+q), with p options left and penalty q.",
      "With no negative marking, answer every question without exception.",
      "Three passes: certain marks, then workable ones, then eliminate and guess.",
      "All questions carry the same mark; a hard one costs you three easy ones.",
      "Length is not difficulty — long word problems are often the easiest marks."
    ],
    r: ["Expected Value", "Probability"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "guess when 1/p > q/(1+q)", w: "p options left, penalty q" },
        { c: "three passes: certain, workable, guess", w: "never work straight down the paper" },
        { c: "every question is worth the same mark", w: "the argument for skipping" }
      ]
    }
  },

  {
    t: "Sectional Strategy and Timing",
    m: "exam",
    lvl: "intermediate",
    s: "Per-section time budgets, the order to attempt sections in, the abandonment rules that must be set beforehand, and what each major exam actually rewards.",
    goal: [
      "Build a per-section time budget and hold to it",
      "Set abandonment rules before the exam rather than during it",
      "Adjust strategy for the specific exam you are sitting"
    ],
    b: [
      { p: "A time budget is not a nice-to-have. A section without one always ends the same way: the first half consumes two-thirds of the clock, and the last ten questions are answered in a panic that produces careless errors on questions you could otherwise do. The budget exists to prevent exactly that." },

      { h: "Building the budget" },

      {
        code: {
          lang: "text", t: "Work backwards from the clock",
          lines: [
            { c: "Section: 30 questions, 35 minutes.", w: "" },
            { c: "", w: "" },
            { c: "Reserve 4 minutes for pass 3 (elimination and guessing).", w: "" },
            { c: "Reserve 1 minute for checking the answer sheet.", w: "**Reserve these FIRST, not from whatever is left over.**", hi: true },
            { c: "", w: "" },
            { c: "That leaves 30 minutes for passes 1 and 2.", w: "" },
            { c: "  pass 1: 12 minutes for a full sweep", w: "" },
            { c: "  pass 2: 18 minutes on the marked questions", w: "" },
            { c: "", w: "" },
            { c: "Set CHECKPOINTS, not a per-question limit:", w: "" },
            { c: "  at 12 minutes, the sweep must be finished", w: "" },
            { c: "  at 30 minutes, pass 2 stops regardless of progress", w: "**A checkpoint is enforceable. A per-question average is not.**", hi: true },
            { c: "", w: "" },
            { c: "Write the checkpoint clock times on your rough sheet in the", w: "" },
            { c: "first thirty seconds of the section.", w: "So you never do mental arithmetic on elapsed time mid-question." }
          ]
        }
      },

      { h: "Which section first" },

      {
        tbl: {
          t: "When the order is yours to choose",
          h: ["Situation", "Order", "Reason"],
          rows: [
            ["Sections are separately timed", "No choice — the order is fixed", "Budget each independently; time cannot be moved between them"],
            ["One combined clock", "**Your strongest section first**", "Banks marks and settles nerves before the hard section"],
            ["One section is very short", "Do it early", "It cannot absorb an overrun; protect it"],
            ["A section has heavy reading (RC, DI)", "Not last", "Reading quality collapses when you are rushed and tired"],
            ["You know one section is your weakness", "Give it a **fixed** slot, not the leftovers", "Otherwise it silently receives whatever remains, which is never enough"]
          ]
        }
      },

      { n: "The most common self-inflicted wound is leaving your weakest section for last on a combined clock. It receives the residue of the time and the residue of your attention, and the score reflects both. Give it a fixed, protected budget even if that means taking fewer marks from your strongest section — the marginal question in a weak section is usually easier than the marginal question in a strong one, because you have already taken the strong section's easy marks.", nt: "Never let a section get the leftovers" },

      { h: "Abandonment rules" },

      {
        code: {
          lang: "text", t: "Set them before, because you cannot set them during",
          lines: [
            { c: "Write these three numbers down before the exam:", w: "" },
            { c: "", w: "" },
            { c: "  1. Seconds before abandoning a question mid-solve.", w: "" },
            { c: "     A common starting value: 90 seconds.", w: "**If the method has not appeared by then, it is not appearing.**", hi: true },
            { c: "", w: "" },
            { c: "  2. Minutes before abandoning a DI or reasoning SET that", w: "" },
            { c: "     has produced no answers.  Try 2.5 minutes.", w: "" },
            { c: "", w: "" },
            { c: "  3. The clock time at which you stop new questions and", w: "" },
            { c: "     start pass 3 regardless of what is unfinished.", w: "The one you will most want to break, and the one that matters most.", hi: true },
            { c: "", w: "" },
            { c: "The reason to write them down: at minute 28 with adrenaline", w: "" },
            { c: "running, you will not make this judgement well. Nobody does.", w: "Pre-commitment beats in-the-moment discipline every time." }
          ]
        }
      },

      { h: "What each major exam rewards" },

      {
        tbl: {
          t: "Same syllabus, different emphasis",
          h: ["Exam", "Rewards", "Strategy note"],
          rows: [
            ["**Campus placement tests**", "Speed on standard types; heavy arithmetic and basic reasoning", "Accuracy over coverage — cut-offs are often lower than people fear"],
            ["**CAT and MBA entrances**", "Question selection above all; DI/LR is often the deciding section", "Sectional cut-offs mean you cannot ignore a weak section"],
            ["**Banking (IBPS, SBI)**", "Very high speed, moderate difficulty, heavy puzzles and DI", "Attempt volume matters; sectional timing is usually enforced"],
            ["**SSC and government**", "Broad syllabus, high accuracy demanded, tight negative marking", "Coverage matters more; general awareness often carries weight"],
            ["**GRE / GMAT**", "Adaptive difficulty; early questions weigh more on some formats", "Do not rush the opening questions"],
            ["**Consulting first rounds**", "Guesstimates, case maths, mental arithmetic under conversation", "Practise speaking your working aloud, not just writing it"]
          ]
        }
      },

      { trap: "**Sectional cut-offs change everything.** In an exam with them, a spectacular quant score cannot compensate for a verbal score below the threshold — you are simply out. If your target exam has sectional cut-offs, your first strategic objective is clearing every threshold, and only then maximising the total. Candidates who optimise for total score in a sectional-cut-off exam fail with high marks." },

      {
        tryit: {
          t: "Build your budget",
          task: "For your target exam, write a one-page strategy sheet: the section order, the minutes allocated to each, the checkpoint clock times within each section, your three abandonment numbers, and the marking scheme with your guessing break-even. Then use it unchanged for two full mocks before adjusting anything.",
          hint: "Use it unchanged for two mocks — one mock is not enough evidence to tell a bad plan from a bad day.",
          sol: { lang: "text", code: "A worked example, 3 sections, 120 minutes total:\n\n  VARC   40 min   checkpoints at 15 / 30\n  DILR   40 min   checkpoints at 12 / 32   (set triage first)\n  QUANT  40 min   checkpoints at 15 / 33\n\n  abandon a question at   90 s\n  abandon a set at        2 min 30 s with no answer\n  stop new questions at   the 33-minute mark in each section\n\n  scheme +3 / -1, four options\n    blind guess is break-even; guess only after eliminating\n    at least one option" },
          w: "The rule about not adjusting for two mocks is the part people skip. A single bad mock produces the urge to rewrite the whole strategy, when the real cause was usually one overrun set — and rewriting the plan every week means you never actually test one."
        }
      }
    ],
    k: [
      "Reserve time for the guessing pass first, then budget what remains.",
      "Use enforceable checkpoints rather than a per-question average.",
      "On a combined clock, take your strongest section first.",
      "Never let your weakest section receive whatever time is left over.",
      "Write down three abandonment numbers before the exam, not during it.",
      "In an exam with sectional cut-offs, clearing every threshold outranks the total.",
      "Test a strategy over two full mocks before changing it."
    ],
    r: ["Expected Value"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "reserve the guessing pass first, budget the rest", w: "not from whatever is left" },
        { c: "checkpoints, not a per-question average", w: "only checkpoints are enforceable" },
        { c: "sectional cut-offs outrank total score", w: "clear every threshold first" }
      ]
    }
  },

  {
    t: "Mock Analysis — turning a score into a fix list",
    m: "exam",
    lvl: "advanced",
    s: "The four-bucket error classification, why analysis takes longer than the mock itself, and the error log that makes practice compound instead of repeat.",
    goal: [
      "Classify every wrong answer into one of four buckets with different fixes",
      "Spend more time analysing a mock than taking it",
      "Maintain an error log that turns repeated mistakes into eliminated ones"
    ],
    b: [
      { p: "Most people take mocks and read the score. That produces a mood, not information. A mock is a diagnostic instrument, and the diagnosis lives entirely in the analysis — which should take longer than the mock did, and which almost nobody actually does." },

      { h: "The four buckets" },

      {
        tbl: {
          t: "Every wrong answer goes in exactly one, and each has a different fix",
          h: ["Bucket", "What happened", "The fix"],
          rows: [
            ["**Conceptual**", "You did not know the method", "Study that topic. The only bucket that revision hours fix"],
            ["**Application**", "You knew the method and applied it wrongly", "Practise that specific question type. More reading will not help"],
            ["**Careless**", "You knew it, did it right, and slipped", "A process fix: units, re-reading the question, checking the option order"],
            ["**Time**", "You could have done it and never reached it", "A strategy fix: selection and pacing, not knowledge at all"]
          ]
        }
      },

      { n: "The proportions tell you what to do next, and they are usually surprising. A candidate whose errors are 60% *time* and 20% *careless* does not need more syllabus revision — they need the previous two lessons. Most people diagnose every mock as a knowledge problem, because that is the comfortable answer, and then study more of what they already know.", nt: "The proportions are the diagnosis" },

      { h: "The analysis routine" },

      {
        code: {
          lang: "text", t: "Longer than the mock. Genuinely.",
          lines: [
            { c: "For every WRONG answer:", w: "" },
            { c: "  - which bucket?", w: "" },
            { c: "  - what was the correct method?", w: "" },
            { c: "  - what exactly made the wrong option attractive?", w: "**This last one is the most valuable question in the routine.**", hi: true },
            { c: "", w: "" },
            { c: "For every question you SKIPPED:", w: "" },
            { c: "  - could you have done it? in what time?", w: "" },
            { c: "  - was skipping it the right call, given what you knew", w: "" },
            { c: "    at the time?", w: "Judge the decision, not the outcome. A good skip can still cost a mark.", hi: true },
            { c: "", w: "" },
            { c: "For every question you got RIGHT but slowly:", w: "" },
            { c: "  - was there a faster route you missed?", w: "" },
            { c: "  - is that route a pattern you can name and reuse?", w: "**This bucket is where the top scores actually come from.**", hi: true },
            { c: "", w: "" },
            { c: "For every LUCKY guess: treat it as wrong.", w: "It will not repeat, and counting it hides a real gap." }
          ]
        }
      },

      { h: "The error log" },

      {
        code: {
          lang: "text", t: "One line per error, one page per week",
          lines: [
            { c: "Columns:  topic | question type | bucket | what I did", w: "" },
            { c: "          | what I should have done", w: "" },
            { c: "", w: "" },
            { c: "Example rows:", w: "" },
            { c: "  P&L | same SP +x/-x | conceptual | averaged the %", w: "" },
            { c: "      | loss = x^2/100, always", w: "", hi: true },
            { c: "  DI  | growth compare | application | compared differences", w: "" },
            { c: "      | compare ratios for percentage growth", w: "" },
            { c: "  TSD | average speed  | careless | used (a+b)/2", w: "" },
            { c: "      | equal distances need 2ab/(a+b)", w: "" },
            { c: "", w: "" },
            { c: "Re-read the log for ten minutes before every mock.", w: "**The log's value is entirely in the re-reading, not the writing.**", hi: true },
            { c: "", w: "" },
            { c: "A line that appears three times is not carelessness -", w: "" },
            { c: "it is a concept you believe you know and do not.", w: "Repetition reclassifies the bucket. Watch for it." }
          ]
        }
      },

      { h: "Reading the trend" },

      {
        tbl: {
          t: "What to track across mocks, and what each pattern means",
          h: ["Metric", "Watch for", "Reading"],
          rows: [
            ["**Accuracy** (right ÷ attempted)", "Below 75%", "You are attempting too many questions, not learning too few"],
            ["**Attempts**", "Rising while accuracy falls", "You are rushing; slow down and attempt fewer"],
            ["**Time per section**", "One section always overrunning", "A budget problem, not a knowledge problem"],
            ["**Bucket mix**", "Careless staying above 20%", "Build a checking process; this is pure lost marks"],
            ["**Topic hit rate**", "One topic consistently below the rest", "The only genuine signal to go back and study"],
            ["**Score variance**", "Wide swings between mocks", "Usually strategy inconsistency, not ability variation"]
          ]
        }
      },

      { trap: "**Accuracy below 75% almost always means over-attempting, not under-preparation.** The instinctive response to a low score is to attempt more questions next time, which lowers accuracy further and lowers the score again. The correct response is nearly always the opposite: attempt fewer, get more of them right, and let the negative marking work for you instead of against you." },

      { h: "How often, and when to stop" },

      { p: "Two mocks a week in the last month, one a week before that, is a workable rhythm — but only if each is followed by full analysis. A mock without analysis is worse than no mock, because it consumes three hours and reinforces whatever you already do. If you cannot analyse it properly, do not take it; do topic practice instead and take the mock when you have the time to learn from it." },

      {
        tryit: {
          t: "Analyse your last mock properly",
          task: "Take your most recent mock. Go through every wrong answer, every skipped question and every slow-but-correct answer, and assign a bucket to each. Then count the four buckets and write down the percentages. Decide your next two weeks of preparation from those percentages alone, not from what you feel weakest at.",
          hint: "If you do not have a recent mock, take one — but block out twice the mock's duration afterwards for the analysis before you start.",
          sol: { lang: "text", code: "A typical first honest analysis:\n\n  conceptual   15%   ->  two specific topics, not 'revise quant'\n  application  30%   ->  targeted practice on those question types\n  careless     25%   ->  a checking process, worth the most marks\n                          per hour of any fix on this list\n  time         30%   ->  the selection and pacing lessons\n\nThe usual surprise is that only 15% is a knowledge gap,\nwhile 55% is process and strategy - and that most people\nspend their next two weeks on the 15%." },
          w: "The careless bucket is worth naming separately because it is the cheapest to fix and the most often dismissed. Twenty-five per cent careless errors is five or six marks in a typical section, recoverable by a checking habit that costs seconds — a better return than any topic revision you could do in the same fortnight."
        }
      }
    ],
    k: [
      "Every wrong answer is conceptual, application, careless or time — and each has a different fix.",
      "The bucket proportions are the diagnosis; most people assume knowledge and are wrong.",
      "Analysis should take longer than the mock itself.",
      "Ask what made the wrong option attractive, not just what the right answer was.",
      "Treat lucky guesses as wrong answers.",
      "Keep a one-line error log and re-read it before every mock.",
      "The same error three times is a concept gap, not carelessness.",
      "Accuracy below 75% means over-attempting, not under-preparation."
    ],
    r: ["Statistics", "Expected Value"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "buckets: conceptual, application, careless, time", w: "four errors, four different fixes" },
        { c: "analysis takes longer than the mock", w: "the score is not the information" },
        { c: "accuracy under 75% means attempt fewer", w: "not study more" }
      ]
    }
  }

]);
