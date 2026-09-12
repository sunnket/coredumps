/* Aptitude — data interpretation. */
TD.addLessons("aptitude", [

  {
    t: "Reading Data Fast — tables, bars, lines and pies",
    m: "di",
    lvl: "core",
    s: "The thirty-second scan that precedes any calculation, what each chart type hides, and the approximation habits that make DI a scoring section instead of a time sink.",
    goal: [
      "Read a data set's structure before attempting a single question",
      "Choose the right approximation for the option spread you are given",
      "Avoid the four traps built into chart labelling"
    ],
    b: [
      { p: "Data interpretation is not a maths topic. It is a reading topic with arithmetic attached, and the candidates who score well are the ones who spend the first thirty seconds not calculating. The arithmetic in a DI set is deliberately easy; the difficulty lives in the caption, the units and the footnote." },

      { h: "The thirty-second scan" },

      {
        code: {
          lang: "text", t: "Before any question, answer these five",
          lines: [
            { c: "1. What is the UNIT?  Rupees, lakhs, crores, thousands, tonnes, %", w: "**A table in lakhs with a question in crores is a whole wrong answer.**", hi: true },
            { c: "", w: "" },
            { c: "2. Is this ABSOLUTE data or PERCENTAGES?", w: "Percentages of different totals cannot be added or compared directly.", hi: true },
            { c: "", w: "" },
            { c: "3. What do the ROWS and COLUMNS mean, exactly?", w: "Years across, products down? Or the reverse? Misreading the axis costs the whole set." },
            { c: "", w: "" },
            { c: "4. Is there a FOOTNOTE or a second scale?", w: "A note saying 'excluding exports' or a right-hand axis changes everything." },
            { c: "", w: "" },
            { c: "5. Is a TOTAL given, or must it be computed?", w: "If a total appears, use it - it is usually the key to three of the questions.", hi: true }
          ]
        }
      },

      { n: "Thirty seconds spent here is not lost time. A DI set is usually four to five questions on one data block, so any misreading costs you the entire set, not one question. The scan is the highest-return half-minute in the whole paper.", nt: "Why the scan pays for itself" },

      { h: "What each chart type is good and bad at" },

      {
        tbl: {
          t: "Read the format, then read the data",
          h: ["Format", "Good at showing", "What it hides / the trap"],
          rows: [
            ["**Table**", "Exact values, many variables", "No visual shape — trends must be computed. The most calculation-heavy format"],
            ["**Bar chart**", "Comparing categories", "A truncated y-axis exaggerates differences. Check where the axis starts"],
            ["**Stacked bar**", "Composition within a total", "Middle segments are hard to read; you must subtract boundaries"],
            ["**Line chart**", "Trends over time", "Steepness depends on the scale. Two lines on different axes are not comparable"],
            ["**Pie chart**", "Shares of one whole", "**Two pies with different totals cannot be compared segment to segment**"],
            ["**Caselet** (prose)", "Nothing — it is deliberately awkward", "The data must be extracted into your own table first"],
            ["**Mixed set**", "Combining two sources", "One source usually supplies a total the other needs. Find that link first"]
          ]
        }
      },

      { trap: "**Two pie charts are the classic DI trap.** Company A's pie shows 30% for salaries and Company B's shows 25%. That does not mean A spends more on salaries. If B's total expenditure is three times A's, B spends far more. A percentage share is only comparable across pies when the totals are equal or given — and the question will be worded to sound as though they are." },

      { h: "Approximation, and when to stop" },

      {
        code: {
          lang: "text", t: "Match the precision to the option spread",
          lines: [
            { c: "Look at the OPTIONS first, then decide how hard to round.", w: "**This ordering is the single biggest time saver in DI.**", hi: true },
            { c: "", w: "" },
            { c: "options 10% apart  ->  round to 1 significant figure", w: "" },
            { c: "options 3-10% apart ->  round to 2 significant figures", w: "" },
            { c: "options under 2% apart -> compute exactly, or skip the question", w: "That spread is bait for approximators.", hi: true },
            { c: "", w: "" },
            { c: "Round alternately - one up, one down - so errors cancel", w: "" },
            { c: "instead of compounding in the same direction.", w: "Three roundings all upward can easily exceed a 5% error.", hi: true },
            { c: "", w: "" },
            { c: "For a ratio, round numerator and denominator the SAME way", w: "" },
            { c: "to keep the quotient roughly honest.", w: "Both up, or both down. Not one of each." }
          ]
        }
      },

      { h: "The percentage-change shortcuts DI runs on" },

      {
        code: {
          lang: "text", t: "Three habits that halve the arithmetic",
          lines: [
            { c: "A) Convert a ratio to a percentage by anchoring.", w: "" },
            { c: "   437 / 1240:  10% of 1240 is 124, so 437 is between", w: "" },
            { c: "   30% (372) and 40% (496). Closer to 35% (434).  ~35.2%", w: "**Bracket first, refine second. Never long-divide.**", hi: true },
            { c: "", w: "" },
            { c: "B) For growth, use the fraction table.", w: "" },
            { c: "   from 240 to 300 is +60, and 60/240 = 1/4  ->  +25%", w: "Recognising 1/4 beats dividing 60 by 240." },
            { c: "", w: "" },
            { c: "C) For 'which year had the highest growth', compare", w: "" },
            { c: "   RATIOS, not differences.", w: "" },
            { c: "   40->50 is +25%; 100->120 is +20%. The smaller rise wins.", w: "Percentage growth questions are answered by ratio, always.", hi: true }
          ]
        }
      },

      { h: "The four wording traps" },

      {
        tbl: {
          t: "Read the question stem twice; these are why",
          h: ["Wording", "What it demands"],
          rows: [
            ["*Increase* versus *increase by a percentage*", "An absolute rise versus a relative one — different answers, both in the options"],
            ["*Percentage points* versus *percent*", "20% to 25% is 5 percentage points and a 25% rise"],
            ["*Average* over years", "Divide by the number of years, including any with zero"],
            ["*Approximately*", "Permission to round hard — take it, and pick the nearest option"],
            ["*What is the ratio of A to B*", "Order matters: A:B, not B:A. Both appear in the options"],
            ["*Which is closest to*", "Estimation is intended. Do not compute exactly"]
          ]
        }
      },

      {
        tryit: {
          t: "A short table set",
          task: "A company's revenue (₹ lakh) across four years: 2020: 240, 2021: 300, 2022: 345, 2023: 414. (a) Which year had the highest percentage growth? (b) What is the average annual revenue over the four years? (c) By what percentage did 2023 exceed 2020?",
          hint: "(a) compare ratios, not differences. (c) the base is 2020.",
          sol: { lang: "text", code: "(a) 2021: 60/240  = 25%\n    2022: 45/300  = 15%\n    2023: 69/345  = 20%\n    highest growth in 2021, even though 2023 rose by more rupees\n\n(b) (240 + 300 + 345 + 414)/4 = 1299/4 = 324.75 lakh\n\n(c) (414 - 240)/240 = 174/240 = 72.5%" },
          w: "Part (a) is the whole lesson in one question: 2023 has the largest absolute rise and the smallest-but-one percentage rise. Whichever the question asks for, the other one is sitting in the options waiting."
        }
      }
    ],
    k: [
      "Spend thirty seconds on units, axes, totals and footnotes before any calculation.",
      "Percentages of different totals cannot be compared or added.",
      "Two pie charts with different totals are not comparable segment to segment.",
      "Read the options first, then choose how hard to round.",
      "Round alternately so errors cancel instead of compounding.",
      "Growth questions compare ratios, not differences.",
      "*Approximately* and *closest to* are explicit permission to estimate."
    ],
    r: ["Data Visualisation", "Percentile"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "check units, axes, totals and footnotes first", w: "the thirty-second scan" },
        { c: "options under 2% apart: compute exactly or skip", w: "approximation is not always safe" },
        { c: "growth compares ratios, never differences", w: "the most common DI trap" }
      ]
    }
  },

  {
    t: "Caselets, Mixed Sets and the Calculation Toolkit",
    m: "di",
    lvl: "intermediate",
    s: "Extracting a table from a paragraph, linking two data sources, and the mental-arithmetic techniques that make heavy DI sets survivable.",
    goal: [
      "Turn a caselet into your own table before answering anything",
      "Find the linking quantity that joins two sources in a mixed set",
      "Use ratio comparison and percentage anchoring instead of long division"
    ],
    b: [
      { p: "Caselets and mixed sets are the two formats that separate scores. Neither is harder mathematically — both are harder to *organise*, and the candidates who do well are the ones who spend a minute building structure before answering, rather than re-reading the paragraph for every question." },

      { h: "Caselets: build the table first" },

      {
        code: {
          lang: "text", t: "The extraction discipline",
          lines: [
            { c: "A caselet gives the data as prose, on purpose, to slow you down.", w: "" },
            { c: "", w: "" },
            { c: "1. Read once for STRUCTURE, not numbers.", w: "What are the entities? What attributes does each have? That is your table's shape.", hi: true },
            { c: "", w: "" },
            { c: "2. Draw the empty grid on your rough sheet.", w: "Rows = entities, columns = attributes." },
            { c: "", w: "" },
            { c: "3. Read again and fill in every number that is stated.", w: "" },
            { c: "", w: "" },
            { c: "4. Fill derived cells: totals, differences, anything implied.", w: "**Most caselets are solvable once one derived cell unlocks a row.**", hi: true },
            { c: "", w: "" },
            { c: "5. Only now read the questions.", w: "Answering from a filled table is fast. Answering from prose is not.", hi: true },
            { c: "", w: "" },
            { c: "The minute this takes is recovered on question two.", w: "" }
          ]
        }
      },

      { n: "If after step 4 the grid still has too many blanks to answer anything, that is a genuine signal to leave the set. A caselet you cannot fill is a caselet that will consume five minutes and return nothing — and the exam-craft module treats that decision as a skill in its own right.", nt: "An unfillable grid is a skip signal" },

      { h: "Mixed sets: find the link" },

      {
        code: {
          lang: "text", t: "Two sources are always joined by one quantity",
          lines: [
            { c: "A typical mixed set: a PIE chart of how a company splits its", w: "" },
            { c: "budget, plus a TABLE of headcount by department.", w: "" },
            { c: "", w: "" },
            { c: "The pie gives percentages. The table gives absolute numbers.", w: "" },
            { c: "Neither is usable alone.", w: "" },
            { c: "", w: "" },
            { c: "The LINK is the total budget, stated somewhere - often in", w: "" },
            { c: "one line of text above or below the charts.", w: "**Find that number first. Everything else is derived from it.**", hi: true },
            { c: "", w: "" },
            { c: "Once found: pie % x total = absolute rupees per department,", w: "" },
            { c: "and rupees / headcount = spend per person, which is what", w: "" },
            { c: "the questions will actually ask for.", w: "Compute the linking column once and reuse it for every question.", hi: true }
          ]
        }
      },

      { h: "The calculation toolkit" },

      {
        code: {
          lang: "text", t: "Five techniques that replace long division",
          lines: [
            { c: "1. PERCENTAGE ANCHORING", w: "" },
            { c: "   To find 683 as a % of 2450: 10% = 245, so 20% = 490,", w: "" },
            { c: "   25% = 612.5, 28% = 686.  Answer ~ 27.9%", w: "**Build from 10%, 5% and 1%. Never divide.**", hi: true },
            { c: "", w: "" },
            { c: "2. RATIO COMPARISON WITHOUT COMPUTING", w: "" },
            { c: "   Is 47/213 bigger than 52/238?", w: "" },
            { c: "   cross-multiply: 47x238 = 11186 vs 52x213 = 11076", w: "" },
            { c: "   the first is larger.", w: "Two multiplications beat two divisions, every time.", hi: true },
            { c: "", w: "" },
            { c: "3. THE PERCENTAGE-CHANGE COMPARISON", w: "" },
            { c: "   a/b vs c/d: if a > c and b < d, then a/b > c/d outright.", w: "Bigger numerator and smaller denominator needs no arithmetic at all." },
            { c: "", w: "" },
            { c: "4. FACTOR OUT THE COMMON PART", w: "" },
            { c: "   (3200 + 4800 + 2400)/400 = 400(8 + 12 + 6)/400 = 26", w: "Look for a shared factor before summing." },
            { c: "", w: "" },
            { c: "5. WORK IN THE UNIT GIVEN", w: "" },
            { c: "   If everything is in lakhs, stay in lakhs to the last line.", w: "Converting mid-calculation is how zeros get lost.", hi: true }
          ]
        }
      },

      { h: "Growth over multiple periods" },

      {
        code: {
          lang: "text", t: "CAGR and cumulative growth in DI",
          lines: [
            { c: "Revenue grows 20%, then 25%, then 10% over three years.", w: "" },
            { c: "Total growth?", w: "" },
            { c: "", w: "" },
            { c: "1.20 x 1.25 x 1.10 = 1.65  ->  65% total", w: "**Multiply, exactly as in the percentages lesson.**", hi: true },
            { c: "", w: "" },
            { c: "The AVERAGE annual growth is not 65/3 = 21.67%.", w: "" },
            { c: "The compound average (CAGR) is the cube root of 1.65,", w: "" },
            { c: "which is about 1.182, so ~18.2% a year.", w: "Aptitude papers rarely need the exact root — but they do test that the two differ.", hi: true },
            { c: "", w: "" },
            { c: "For an estimate: CAGR is always BELOW the arithmetic mean", w: "" },
            { c: "of the growth rates, and the gap widens with volatility.", w: "That inequality alone eliminates two options in most such questions." }
          ]
        }
      },

      { h: "Common DI question shapes" },

      {
        tbl: {
          t: "Recognise and route",
          h: ["Question", "Move"],
          rows: [
            ["What percentage of X is Y?", "Anchor from 10% of X"],
            ["By what percentage did X grow?", "Difference over the OLD value"],
            ["Which category grew fastest?", "Compare ratios, not differences"],
            ["What is the ratio of A to B?", "Cancel a common factor first; check the order asked"],
            ["What is the average across n periods?", "Sum and divide — but check whether a period is missing"],
            ["If the trend continues, what is next year's figure?", "Apply the most recent growth rate, unless a pattern is explicit"],
            ["Combined average of two groups", "Weighted average, or alligation — never the plain mean"]
          ]
        }
      },

      { trap: "**The combined average of two groups is not the average of the two averages** unless the groups are the same size. A class of 40 averaging 60 and a class of 10 averaging 80 combine to (40×60 + 10×80)/50 = 64, not 70. This is alligation from the arithmetic module, and DI sets use it constantly because the wrong answer looks so reasonable." },

      {
        tryit: {
          t: "A mixed set in miniature",
          task: "A company's ₹800 lakh budget splits: R&D 25%, marketing 30%, operations 35%, admin 10%. Headcount: R&D 40, marketing 60, operations 140, admin 20. (a) Which department has the highest spend per employee? (b) What is the ratio of marketing spend to admin spend? (c) If R&D's budget rises 20% next year and the total stays fixed, what percentage of the budget will R&D take?",
          hint: "(a) compute the spend column once, then divide. (c) 20% more of the same total.",
          sol: { lang: "text", code: "spend: R&D 200, marketing 240, operations 280, admin 80 (lakh)\n\n(a) per head: 200/40 = 5.0, 240/60 = 4.0,\n               280/140 = 2.0, 80/20 = 4.0\n    R&D, at 5 lakh per employee\n\n(b) 240 : 80 = 3 : 1\n\n(c) R&D becomes 200 x 1.2 = 240\n    240/800 = 30% of the budget" },
          w: "Computing the spend column once, before looking at any question, is the whole technique. Three questions then take about fifteen seconds each instead of a minute each."
        }
      }
    ],
    k: [
      "Build your own table from a caselet before reading the questions.",
      "A grid you cannot fill after one pass is a set to skip.",
      "In a mixed set, find the linking total first; everything derives from it.",
      "Anchor percentages from 10%, 5% and 1% instead of dividing.",
      "Compare two ratios by cross-multiplying, not by computing both.",
      "Stay in the unit given until the final line.",
      "The combined average of two groups is weighted, not the plain mean."
    ],
    r: ["Data Visualisation", "Mean, Median and Mode"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "build the table before reading the questions", w: "the caselet discipline" },
        { c: "compare a/b and c/d by cross-multiplying", w: "two multiplications beat two divisions" },
        { c: "combined average is weighted, not the plain mean", w: "alligation, hiding inside DI" }
      ]
    }
  },

  {
    t: "Set Selection — the DI skill that actually scores",
    m: "di",
    lvl: "advanced",
    s: "Choosing which sets to attempt and which to abandon, the sunk-cost problem, and how to leave a set without losing the time already spent.",
    goal: [
      "Rank the sets in a section within the first two minutes",
      "Recognise the four signatures of a set designed to burn time",
      "Abandon a set mid-way without the sunk-cost reflex"
    ],
    b: [
      { p: "In a DI section with four sets and twenty minutes, the difference between a good score and a poor one is usually not arithmetic speed. It is that one candidate attempted the two easiest sets completely and the other spent fourteen minutes on the hardest and got two questions." },

      { h: "The two-minute triage" },

      {
        code: {
          lang: "text", t: "Rank before you solve",
          lines: [
            { c: "Spend the first 90-120 seconds reading ALL the sets and", w: "" },
            { c: "ranking them. Solve nothing yet.", w: "**This feels like wasted time and is the opposite.**", hi: true },
            { c: "", w: "" },
            { c: "Score each set on three things:", w: "" },
            { c: "", w: "" },
            { c: "  DATA DENSITY - how many numbers must be read per question?", w: "" },
            { c: "  CALCULATION WEIGHT - divisions and multi-step chains?", w: "" },
            { c: "  DEPENDENCE - do the questions share working, or is each fresh?", w: "**A set with shared working is worth far more than its length suggests.**", hi: true },
            { c: "", w: "" },
            { c: "Attempt in order: shared-working sets first, then low-", w: "" },
            { c: "calculation sets, and leave dense independent sets last.", w: "" }
          ]
        }
      },

      { h: "The four signatures of a time-sink set" },

      {
        tbl: {
          t: "Recognise these and price them accordingly",
          h: ["Signature", "Why it costs", "Verdict"],
          rows: [
            ["**Every question needs a fresh full-table computation**", "No reuse; five questions cost five times one", "Attempt last, or not at all"],
            ["**Options within 2% of each other**", "Approximation is unsafe, so every answer needs exact arithmetic", "Skip unless the set is short"],
            ["**Three or more linked charts**", "Reading cost is high before any maths starts", "Only if the link is obvious in the first read"],
            ["**Missing values you must derive first**", "A puzzle wearing DI clothing; the first answer may take four minutes", "High risk, high reward — attempt only with time in hand"],
            ["**A footnote changing the rule for one row**", "Every question must be checked against the exception", "Slow but usually fair; attempt if otherwise easy"]
          ]
        }
      },

      { n: "The reverse is also worth naming: a set where one computed column answers three of the five questions is a **gift**, and it is common. If your first question forces you to compute a column of per-unit figures or totals, glance at the remaining questions — you may already have most of what they need.", nt: "Spot the gift sets too" },

      { h: "Abandoning a set" },

      {
        code: {
          lang: "text", t: "The sunk-cost problem, stated plainly",
          lines: [
            { c: "You are three minutes into a set and have answered nothing.", w: "" },
            { c: "", w: "" },
            { c: "The wrong reasoning:", w: "" },
            { c: "  'I have already spent three minutes, so I should finish.'", w: "**Those three minutes are gone whatever you do next.**", hi: true },
            { c: "", w: "" },
            { c: "The right question:", w: "" },
            { c: "  'From here, is the next four minutes better spent on this", w: "" },
            { c: "   set or on the one I ranked second?'", w: "Only the FUTURE cost and the future return matter.", hi: true },
            { c: "", w: "" },
            { c: "A practical rule: if you have not answered one question in", w: "" },
            { c: "the first two and a half minutes, leave. Mark it, move on,", w: "" },
            { c: "and return only if the section ends with time left.", w: "Set this rule before the exam; you will not set it fairly during one." }
          ]
        }
      },

      { h: "Sequencing within a set" },

      {
        code: {
          lang: "text", t: "The questions are not in difficulty order",
          lines: [
            { c: "Read all the questions in a set before answering any.", w: "" },
            { c: "", w: "" },
            { c: "Typically one is a direct read-off, two need one computation,", w: "" },
            { c: "one needs the whole table, and one is a trap.", w: "**Take them in that order, not in printed order.**", hi: true },
            { c: "", w: "" },
            { c: "The direct read-off is often question 4 or 5, placed there", w: "" },
            { c: "precisely so that candidates working top-down never reach it.", w: "This is deliberate paper design, not an accident.", hi: true },
            { c: "", w: "" },
            { c: "The trap question usually asks for something the data does", w: "" },
            { c: "not support - 'cannot be determined' is a real option in", w: "" },
            { c: "many papers and it is correct more often than people expect.", w: "" }
          ]
        }
      },

      { h: "A worked triage" },

      {
        tbl: {
          t: "Four sets, twenty minutes — what to do",
          h: ["Set", "What you see in the scan", "Decision"],
          rows: [
            ["**A** — table of 5 products × 4 years, questions on growth", "One computed growth column answers 3 of 5", "**First.** High reuse"],
            ["**B** — two pies, different totals, both totals given", "Standard, moderate calculation, no trap", "**Second.** Reliable marks"],
            ["**C** — caselet with three missing values", "Puzzle-like; the first answer may take four minutes", "**Fourth, or skip.** Only with time left"],
            ["**D** — line chart, options within 1%", "Exact arithmetic required throughout", "**Third**, and only the cheapest two questions"]
          ]
        }
      },

      { p: "That ordering will typically yield around ten to twelve correct answers out of twenty in the time available. Working straight down the page — A, B, C, D — will typically yield six or seven, because set C consumes the time that sets B and D needed. Nothing about the arithmetic changed. Only the order did." },

      {
        tryit: {
          t: "Write your own rules",
          task: "Before your next mock, write down three personal rules on paper: (1) the number of seconds after which you abandon a question mid-way, (2) the number of minutes after which you abandon a set that has produced no answers, and (3) the maximum number of sets you will attempt in the section. Then follow them exactly, even when it hurts, and compare the score with your previous mock.",
          hint: "Reasonable starting values: 75 seconds per question, 2.5 minutes per unproductive set, and three sets out of four.",
          sol: { lang: "text", code: "Typical outcome across two mocks:\n\n  without rules:  attempted 4 sets, completed 2, score 9/20\n  with rules:     attempted 3 sets, completed 3, score 13/20\n\nThe accuracy per attempted question also rises, because\nrushed questions at the end of an overrun set are where\nmost careless errors happen." },
          w: "The point of writing the rules down beforehand is that you will not make this decision fairly at minute twelve of a section with adrenaline running. Pre-commitment is the technique; the specific numbers matter less than having them."
        }
      }
    ],
    k: [
      "Spend the first two minutes ranking all sets. Solve nothing during the scan.",
      "Sets where one computation answers several questions are worth the most.",
      "Options within 2% of each other mean no approximation is safe — price the set accordingly.",
      "Sunk time is gone. Only the future cost and future return should decide whether you continue.",
      "Read every question in a set before answering; the easiest is often printed last.",
      "*Cannot be determined* is right more often than candidates expect.",
      "Pre-commit to abandonment rules before the exam, not during it."
    ],
    r: ["Data Visualisation"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "rank all sets before solving any of them", w: "the two-minute triage" },
        { c: "no answer in 2.5 minutes: leave the set", w: "a pre-committed abandonment rule" },
        { c: "sunk time never justifies more time", w: "the sunk-cost reflex, named" }
      ]
    }
  }

]);
