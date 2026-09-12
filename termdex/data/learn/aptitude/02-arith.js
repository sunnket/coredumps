/* Aptitude — commercial arithmetic. */
TD.addLessons("aptitude", [

  {
    t: "Percentages — the layer four other topics are built on",
    m: "arith",
    lvl: "core",
    s: "Percentage change, successive change, product constancy and the multiplier habit — the base that profit-and-loss, interest, DI and mixtures all sit on.",
    goal: [
      "Compute any percentage change without writing a formula down",
      "Chain successive changes in one step using multipliers",
      "Recognise product constancy, which is half of all percentage word problems"
    ],
    b: [
      { p: "Percentage is not a topic. It is the notation the rest of commercial arithmetic is written in. Profit and loss is a percentage on cost price. Discount is a percentage on marked price. Compound interest is the same percentage applied repeatedly. Data interpretation is percentages of a total. Learn this properly and four topics get easier at once — which is why it comes first." },

      { h: "The three conversions, and the one that matters" },

      {
        code: {
          lang: "text", t: "Everything reduces to these",
          lines: [
            { c: "x% of N           =  N * x / 100", w: "" },
            { c: "x is what % of N  =  x / N * 100", w: "**The denominator is whatever comes after the word `of`.**", hi: true },
            { c: "% change          =  (new - old) / old * 100", w: "Old value on the bottom. Always. This is the most common error in the topic.", hi: true },
            { c: "", w: "" },
            { c: "A is x% more than B   ->  A = B * (100 + x)/100", w: "" },
            { c: "A is x% less than B   ->  A = B * (100 - x)/100", w: "Note which of the two is the base — it is B in both lines." }
          ]
        }
      },

      { trap: "*By what percentage is A more than B* and *by what percentage is B less than A* are **different questions with different answers**. If A = 125 and B = 100, then A is 25% more than B, but B is 20% less than A. The base changed, so the answer changed. Exam writers ask both versions of the same numbers in the same paper on purpose." },

      { h: "The increase–decrease pairs worth memorising" },

      { p: "If a value goes up by x% and you need the percentage that brings it back down, the answer is *not* x. It is 100x/(100 + x). These pairs come straight from the fraction table in the previous lesson, and they appear constantly." },

      {
        tbl: {
          t: "Up by this, back down by that",
          h: ["Fraction", "Increase", "Reversing decrease", "Where it shows up"],
          rows: [
            ["1/2", "50%", "33.33%", "Price hikes, population"],
            ["1/3", "33.33%", "25%", "Discount chains"],
            ["1/4", "25%", "20%", "The most tested pair of all"],
            ["1/5", "20%", "16.67%", "Salary and expenditure sums"],
            ["1/6", "16.67%", "14.28%", "Mixture and consumption"],
            ["1/8", "12.5%", "11.11%", "Interest and DI"],
            ["1/10", "10%", "9.09%", "Approximation work"]
          ]
        }
      },

      { n: "Read the table as: **an increase of 1/n is a reversing decrease of 1/(n+1)**. Up by 1/4 comes back down by 1/5. Up by 1/7 comes back down by 1/8. That one sentence replaces the whole table once you trust it.", nt: "The pattern behind the table" },

      { h: "Successive changes: use multipliers, not the formula" },

      {
        code: {
          lang: "text", t: "Two ways, and why one is better",
          lines: [
            { c: "A price rises 20%, then falls 25%, then rises 10%.", w: "" },
            { c: "", w: "" },
            { c: "Formula way:  a + b + ab/100, applied twice", w: "" },
            { c: "  20 - 25 - 500/100 = -10%,  then -10 + 10 - 100/100 = -1%", w: "Correct, but two rounds of arithmetic and easy to sign-slip." },
            { c: "", w: "" },
            { c: "Multiplier way:  1.20 x 0.75 x 1.10", w: "" },
            { c: "  = 0.90 x 1.10 = 0.99   ->  a net fall of 1%", w: "**One line, no signs to lose, extends to any number of changes.**", hi: true },
            { c: "", w: "" },
            { c: "As fractions it is faster still:  6/5 x 3/4 x 11/10 = 198/200", w: "20% up is x6/5, 25% down is x3/4. The fraction table pays off again.", hi: true }
          ]
        }
      },

      { n: "Two consequences worth carrying. A rise then an equal fall **always** loses — a% up then a% down is a net a²/100 loss. And the order of successive changes never matters, because multiplication commutes. If a question implies the order changes the answer, re-read it: something other than a percentage change is going on.", nt: "Two facts that answer questions on their own" },

      { h: "Product constancy — half of all percentage word problems" },

      { p: "Whenever two quantities multiply to a fixed third — price × consumption = expenditure, speed × time = distance, length × breadth = area, men × days = work — raising one by x% forces the other down by 100x/(100 + x)%. That is the same reversing-decrease table above, and recognising the shape is the entire skill." },

      {
        code: {
          lang: "text", t: "The shape, and three questions that are the same question",
          lines: [
            { c: "price x consumption = expenditure   (held fixed)", w: "" },
            { c: "", w: "" },
            { c: "Q: Sugar price rises 25%. By how much must a family cut", w: "" },
            { c: "   consumption to keep the sugar bill unchanged?", w: "25% up is x5/4, so consumption is x4/5 — **down 20%**.", hi: true },
            { c: "", w: "" },
            { c: "Q: A car's speed drops 20%. By what % does the journey", w: "" },
            { c: "   time increase?", w: "x4/5 on speed is x5/4 on time — **up 25%**." },
            { c: "", w: "" },
            { c: "Q: A rectangle's length is cut 10%. By what % must the", w: "" },
            { c: "   breadth rise to keep the area the same?", w: "x9/10 becomes x10/9 — **up 11.11%**." },
            { c: "", w: "" },
            { c: "Three topics, one move: invert the fraction.", w: "This is why the fraction-percentage table earns its keep.", hi: true }
          ]
        }
      },

      { h: "Percentage and percentage point" },

      { trap: "An interest rate moving from 5% to 7% has risen by **2 percentage points**, which is a **40% increase**. Both statements are true and they are not interchangeable. DI sets exploit the confusion deliberately: a chart showing market share going from 20% to 25% has grown by 5 percentage points and by 25%. Read which one is being asked before you compute." },

      { h: "The question types" },

      {
        tbl: {
          t: "Recognise and route",
          h: ["Question shape", "Move"],
          rows: [
            ["A is x% of B, B is y% of C — relate A and C", "Multiply the multipliers"],
            ["Value changes several times — find the net", "Multiply, do not add"],
            ["*By how much must the other fall to compensate?*", "Product constancy: invert the fraction"],
            ["Marks or votes: *failed by x, needed y%*", "Set the total as 100 parts and read the gap"],
            ["Population grows r% per year for n years", "P(1 + r/100)ⁿ — compound interest wearing a hat"],
            ["Income split across rent, food, savings", "Work in parts of 100, never in rupees, until the last line"],
            ["Two candidates, x% of votes, margin of m votes", "The margin equals the difference in percentages, of the total"]
          ]
        }
      },

      {
        tryit: {
          t: "Three that look different and are not",
          task: "(a) A shopkeeper raises a price 30% then offers 30% off. What is the net change? (b) A worker's salary is cut 20%. By what percentage must it now rise to restore the original? (c) Petrol rises 15% and a driver wants their monthly fuel bill to rise by only 5%. By what percentage must consumption fall?",
          hint: "(a) multipliers. (b) reversing decrease. (c) the product is no longer constant — set the target multiplier first.",
          sol: { lang: "text", code: "(a) 1.30 x 0.70 = 0.91  ->  a 9% fall\n    (or a x a/100 = 30x30/100 = 9% loss, as always)\n\n(b) x 4/5, so restore with x 5/4  ->  a rise of 25%\n\n(c) price x consumption = bill\n    1.15 x c = 1.05\n    c = 1.05 / 1.15 = 21/23 = 0.9130\n    consumption must fall by about 8.7%" },
          w: "Part (c) is the general form of product constancy: the product is not held fixed but pushed to a chosen multiplier. Set up **target multiplier ÷ known multiplier** and you never need a separate formula for it."
        }
      }
    ],
    k: [
      "Percentage change always divides by the OLD value.",
      "A is 25% more than B ⇒ B is 20% less than A. Different bases, different answers.",
      "Chain changes by multiplying multipliers, never by adding percentages.",
      "a% up then a% down is always a net loss of a²/100 percent.",
      "Product constancy: up by 1/n on one side is down by 1/(n+1) on the other.",
      "Percentage points and percentages are different quantities. Read which is asked."
    ],
    r: ["Percentile", "Statistics"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "% change = (new - old) / old x 100", w: "the old value is always the base" },
        { c: "net of two changes = a + b + ab/100", w: "decreases enter negative" },
        { c: "up by 1/n means down by 1/(n+1) to reverse it", w: "product constancy in one line" }
      ]
    }
  },

  {
    t: "Profit, Loss and Discount",
    m: "arith",
    lvl: "core",
    s: "Cost price, selling price, marked price, discount chains, false weights, and the wordings designed to make you use the wrong base.",
    goal: [
      "Move between CP, SP and MP without re-deriving anything",
      "Handle successive discounts and markup-plus-discount in one multiplier",
      "Spot the four wordings engineered to blur which quantity is the base"
    ],
    b: [
      { p: "Every question in this topic is a percentage question with three named quantities attached. The only genuine difficulty is keeping track of which quantity is the base, because the wording is engineered to blur it." },

      { h: "The three prices" },

      {
        tbl: {
          t: "What each one means, and what it is the base of",
          h: ["Term", "Meaning", "Base for"],
          rows: [
            ["**CP** — cost price", "What the seller paid", "**Profit % and loss %** — always"],
            ["**SP** — selling price", "What the buyer paid", "Nothing, unless the question explicitly says *profit on selling price*"],
            ["**MP** — marked or list price", "The sticker, before discount", "**Discount %** — always"],
            ["Overheads", "Repairs, transport, labour", "Add to CP before computing any profit"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "The relations, as multipliers",
          lines: [
            { c: "SP = CP x (100 + p)/100      p = profit %  (negative for a loss)", w: "" },
            { c: "SP = MP x (100 - d)/100      d = discount %", w: "" },
            { c: "", w: "" },
            { c: "So:  CP x (100 + p) = MP x (100 - d)", w: "**The bridge equation. Almost every mixed question is this line.**", hi: true },
            { c: "", w: "" },
            { c: "profit %   = (SP - CP)/CP x 100", w: "" },
            { c: "discount % = (MP - SP)/MP x 100", w: "Different denominators. That is the whole topic." },
            { c: "", w: "" },
            { c: "Marked x% above cost, then y% discount:", w: "" },
            { c: "  net profit % = x - y - xy/100", w: "The successive-change formula again, with the discount negative.", hi: true }
          ]
        }
      },

      { h: "Successive discounts" },

      { p: "Two discounts of 20% and 10% are not 30%. They are 1 − (0.80 × 0.90) = 28%. The multiplier habit does all the work here, and it is the fastest way to compare two offers." },

      {
        code: {
          lang: "text", t: "Which offer is better?",
          lines: [
            { c: "Offer A: successive discounts of 20% and 15%", w: "" },
            { c: "Offer B: a single discount of 32%", w: "" },
            { c: "", w: "" },
            { c: "A -> 0.80 x 0.85 = 0.68   ->  32% off", w: "" },
            { c: "B -> 0.68                 ->  32% off", w: "**Identical.** 20 + 15 - 300/100 = 32.", hi: true },
            { c: "", w: "" },
            { c: "Offer C: 20%, 15% and 10%", w: "" },
            { c: "  0.80 x 0.85 x 0.90 = 0.612  ->  38.8% off", w: "Not 45%. Successive discounts always undershoot the sum." }
          ]
        }
      },

      { h: "The results worth memorising" },

      {
        tbl: {
          t: "Standard results, and what each is really testing",
          h: ["Situation", "Result", "Why it works"],
          rows: [
            ["Two articles at the **same SP**, one at +x% and one at −x%", "**Always a loss of x²/100 %**", "The loss-making article had the higher CP, so the loss outweighs the gain"],
            ["False weight, selling *at cost price*", "gain % = error/(true − error) × 100", "800 g sold as 1 kg gives 200/800 = **25% gain**"],
            ["Marks up x%, discounts y%", "net = x − y − xy/100", "Successive percentage change"],
            ["Sold at a loss of x%; ₹d more would have given +y%", "CP = 100d/(x + y)", "The ₹d spans the whole gap from −x% to +y%"],
            ["Profit stated **on selling price**", "s% on SP ⇒ 100s/(100 − s)% on CP", "A 20% margin on SP is a 25% markup on cost"],
            ["*Buy 3 get 1 free*", "Discount = 1/4 = **25%**", "Pay for 3, receive 4"],
            ["CP of n articles = SP of m articles", "profit % = (n − m)/m × 100", "Equate and read it off"]
          ]
        }
      },

      { trap: "**A 20% margin and a 20% markup are not the same number.** Margin is on selling price, markup is on cost. A 20% margin means CP is 80% of SP, so the markup on cost is 20/80 = 25%. Aptitude papers usually mean markup on cost unless they say otherwise — but when they do say *on selling price*, that is exactly what they are testing." },

      { h: "The dishonest dealer, in full" },

      {
        code: {
          lang: "text", t: "Cheating on weight and on price at once",
          lines: [
            { c: "A dealer marks goods up 20%, gives a 10% discount, and uses", w: "" },
            { c: "a 900 g weight for a kilogram. Find the true profit %.", w: "" },
            { c: "", w: "" },
            { c: "Take CP of 1000 g = 1000, so cost per gram = 1.", w: "**Set the honest cost at 1 per unit — it removes every fraction.**", hi: true },
            { c: "", w: "" },
            { c: "MP of 1000 g              = 1200", w: "marked up 20%" },
            { c: "SP after 10% discount     = 1080", w: "" },
            { c: "But the buyer receives 900 g, which cost the dealer 900.", w: "The weight cheat enters as a smaller cost, not a bigger price.", hi: true },
            { c: "", w: "" },
            { c: "profit = 1080 - 900 = 180  on a cost of 900", w: "" },
            { c: "profit % = 180/900 x 100 = 20%", w: "As multipliers: 1.2 x 0.9 x (1000/900) = 1.20. Same answer, one line." }
          ]
        }
      },

      { n: "That multiplier check is the fast route generally: every cheat is a multiplier on the ratio SP/CP. Markup ×1.2, discount ×0.9, short weight ×(1000/900). Multiply them, subtract 1, and you have the profit fraction. It scales to any number of cheats without a new formula.", nt: "Everything is a multiplier" },

      {
        tryit: {
          t: "Four in the standard wordings",
          task: "(a) A man sells two watches at ₹1,200 each, gaining 20% on one and losing 20% on the other. Net result? (b) A trader marks goods 40% above cost and allows a 25% discount. Profit %? (c) An article sold for ₹720 gives a 10% loss. What price gives a 15% profit? (d) If the cost of 12 pens equals the selling price of 9 pens, find the profit percentage.",
          hint: "(a) do not average the percentages. (c) find CP first. (d) use (n − m)/m.",
          sol: { lang: "text", code: "(a) x^2/100 = 400/100 = 4% loss\n    (check: CP = 1200/1.2 = 1000 and 1200/0.8 = 1500,\n     total CP 2500, total SP 2400, loss 100 on 2500 = 4%)\n\n(b) 1.40 x 0.75 = 1.05   ->  5% profit\n\n(c) CP = 720 / 0.9 = 800\n    SP for a 15% profit = 800 x 1.15 = 920\n\n(d) (12 - 9)/9 x 100 = 33.33% profit" },
          w: "Part (a) is the most-asked single result in the topic, and the answer is always a loss, never zero. If you ever get zero there, you averaged the percentages instead of the money."
        }
      }
    ],
    k: [
      "Profit and loss are percentages of CP. Discount is a percentage of MP. Never mix the bases.",
      "The bridge equation: CP(100 + p) = MP(100 − d).",
      "Successive discounts multiply: 20% and 10% is 28%, not 30%.",
      "Same SP with +x% and −x% is always a loss of x²/100 percent.",
      "False weight while selling at cost: gain% = error/(true − error) × 100.",
      "A margin of s% on SP equals a markup of 100s/(100 − s)% on CP."
    ],
    r: ["Percentile"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "CP x (100 + p) = MP x (100 - d)", w: "the bridge between profit and discount" },
        { c: "same SP, +x% and -x%  ->  loss of x^2/100 %", w: "the most-asked standard result" },
        { c: "false weight gain % = error/(true - error) x 100", w: "the dishonest dealer" }
      ]
    }
  },

  {
    t: "Ratio, Proportion, Averages and Alligation",
    m: "arith",
    lvl: "core",
    s: "Chaining ratios, partnership shares, the deviation method for averages, the alligation cross, and the repeated-replacement formula.",
    goal: [
      "Combine two or three ratios into one without algebra",
      "Use alligation to answer mixture and average questions in seconds",
      "Apply the replacement formula to any *removed and replaced n times* question"
    ],
    b: [
      { p: "Ratio questions rarely fail on the concept. They fail because the candidate wrote *let the numbers be 3x and 5x*, generated three equations, and ran out of clock. Almost all of them are faster with parts, and the mixture ones are faster with alligation." },

      { h: "Chaining ratios" },

      {
        code: {
          lang: "text", t: "Three ratios into one, by matching the shared term",
          lines: [
            { c: "A : B = 2 : 3", w: "" },
            { c: "B : C = 4 : 5", w: "" },
            { c: "", w: "" },
            { c: "B is 3 in the first and 4 in the second. LCM is 12.", w: "**Scale each ratio so the shared term matches.**", hi: true },
            { c: "A : B = 8 : 12       (x4)", w: "" },
            { c: "B : C =     12 : 15  (x3)", w: "" },
            { c: "A : B : C = 8 : 12 : 15", w: "" },
            { c: "", w: "" },
            { c: "Shortcut for exactly two:  A:B:C = 2x4 : 3x4 : 3x5", w: "Cross-multiply through the shared term.", hi: true }
          ]
        }
      },

      {
        tbl: {
          t: "The ratio vocabulary that appears in question stems",
          h: ["Term", "Meaning"],
          rows: [
            ["**Duplicate ratio**", "a² : b²"],
            ["**Sub-duplicate ratio**", "√a : √b"],
            ["**Triplicate / sub-triplicate**", "a³ : b³ and ∛a : ∛b"],
            ["**Compound ratio**", "Multiply term by term: (a:b) with (c:d) gives ac : bd"],
            ["**Inverse ratio**", "b : a"],
            ["**Componendo–dividendo**", "If a/b = c/d then (a+b)/(a−b) = (c+d)/(c−d)"],
            ["**Mean proportional** between a and b", "√(ab)"],
            ["**Third proportional** to a and b", "b²/a"]
          ]
        }
      },

      { n: "Componendo–dividendo is worth recognising on sight. A question of the form *(3x + 2y)/(3x − 2y) = 7/3, find x : y* is one line: 3x/2y = (7+3)/(7−3) = 10/4, so x : y = 20/12 = 5 : 3. Candidates who cross-multiply and solve take four times as long.", nt: "The one identity that earns its memorisation" },

      { h: "Partnership" },

      { p: "Profit is shared in the ratio of **capital × time invested**. That single sentence answers every partnership question, including the ones that look complicated because a partner joined late or withdrew half their money midway." },

      {
        code: {
          lang: "text", t: "A partner who changes their stake",
          lines: [
            { c: "A invests 6000 for 12 months.", w: "" },
            { c: "B invests 4000, then adds 2000 more after 6 months.", w: "" },
            { c: "", w: "" },
            { c: "A: 6000 x 12               = 72000", w: "" },
            { c: "B: 4000 x 6 + 6000 x 6     = 24000 + 36000 = 60000", w: "**Split B's timeline at the change and add the pieces.**", hi: true },
            { c: "", w: "" },
            { c: "ratio = 72000 : 60000 = 6 : 5", w: "A profit of 22000 splits as 12000 and 10000." },
            { c: "", w: "" },
            { c: "A sleeping partner still counts — only capital x time matters,", w: "" },
            { c: "unless the question names a separate salary or commission.", w: "Deduct any salary from the profit first, then split the remainder." }
          ]
        }
      },

      { h: "Averages, and why the shortcut beats the formula" },

      { p: "The average of a set is its total divided by its count — but almost no exam question wants a raw average. They want the effect of a change, and that is faster measured as a **deviation from the old mean**." },

      {
        code: {
          lang: "text", t: "The deviation method",
          lines: [
            { c: "The average of 11 numbers is 50. One number, 65, is replaced by 20.", w: "" },
            { c: "", w: "" },
            { c: "Slow: total 550, new total 550 - 65 + 20 = 505, /11 = 45.91", w: "" },
            { c: "Fast: the total fell by 45, spread over 11 numbers -> -45/11", w: "" },
            { c: "      new average = 50 - 4.09 = 45.91", w: "**Track the change, not the totals.**", hi: true },
            { c: "", w: "" },
            { c: "Same idea: a batsman averaging 40 in 15 innings scores 88.", w: "" },
            { c: "The 88 is 48 above the old average, spread over 16 innings:", w: "" },
            { c: "  new average = 40 + 48/16 = 43", w: "The classic cricket-average question, in one line." }
          ]
        }
      },

      { h: "Alligation — the fastest tool in commercial arithmetic" },

      { p: "Alligation answers every question where two things at different values are mixed to reach a value in between: two grades of rice, two interest rates, two batches of students, a solution and pure water. The rule is one line and it earns more marks per minute than anything else on this page." },

      {
        code: {
          lang: "text", t: "The rule, and the cross that remembers it",
          lines: [
            { c: "     cheaper (c)              dearer (d)", w: "" },
            { c: "               \\            /", w: "" },
            { c: "                 mean (m)", w: "" },
            { c: "               /            \\", w: "" },
            { c: "      (d - m)                  (m - c)", w: "" },
            { c: "", w: "" },
            { c: "qty of cheaper : qty of dearer = (d - m) : (m - c)", w: "**Each side takes the distance to the OPPOSITE end.**", hi: true },
            { c: "", w: "" },
            { c: "Rice at 30/kg mixed with rice at 45/kg to sell at 35/kg:", w: "" },
            { c: "  (45 - 35) : (35 - 30) = 10 : 5 = 2 : 1", w: "Twice as much cheap rice. Six seconds, no algebra." }
          ]
        }
      },

      { trap: "Alligation gives a **ratio of quantities, not the quantities**. If a question asks *how many litres of the cheaper*, you still need the total. And the mean must genuinely lie between the two values — if it does not, you have confused the mean with an ingredient, and the ratio comes out negative. That negative is the error signal to watch for." },

      { h: "Removal and replacement" },

      {
        code: {
          lang: "text", t: "The formula for 'remove r litres and top up, n times'",
          lines: [
            { c: "final pure quantity = initial x (1 - r/V)^n", w: "**V is the total volume; r is what is drawn off each round.**", hi: true },
            { c: "", w: "" },
            { c: "A 40 L vessel of pure milk. 8 L is removed and replaced by", w: "" },
            { c: "water, three times. How much milk is left?", w: "" },
            { c: "", w: "" },
            { c: "40 x (1 - 8/40)^3 = 40 x (4/5)^3 = 40 x 64/125 = 20.48 L", w: "" },
            { c: "so milk : water = 20.48 : 19.52", w: "" },
            { c: "", w: "" },
            { c: "It works because each round keeps the same FRACTION of", w: "" },
            { c: "whatever milk is present, whatever water is already there.", w: "Keep the reasoning; the formula follows from it." }
          ]
        }
      },

      {
        tryit: {
          t: "One of each",
          task: "(a) In what ratio must water be mixed with milk costing ₹60 a litre so the seller makes a 20% profit selling the mixture at ₹60 a litre? (b) The average age of 30 students is 14. When the teacher joins, the average rises by 1. Find the teacher's age. (c) A:B = 3:4 and B:C = 6:5. Find A:B:C.",
          hint: "(a) water is free — treat its cost as 0 and find the required mean cost first. (b) deviation method.",
          sol: { lang: "text", code: "(a) selling at 60 with 20% profit  ->  mixture must cost 50/litre\n    alligation between water (0) and milk (60), mean 50:\n      water : milk = (60 - 50) : (50 - 0) = 10 : 50 = 1 : 5\n\n(b) the average rose by 1 across all 31 people, so the teacher\n    is 14 + 31 = 45 years old\n\n(c) B is 4 and 6; LCM is 12\n    A:B = 9:12 and B:C = 12:10\n    A:B:C = 9 : 12 : 10" },
          w: "In (b) the standard error is answering 14 + 30. The new average applies to all 31 people, so the teacher must supply their own 14, plus one extra year for each of the 31."
        }
      }
    ],
    k: [
      "Chain ratios by scaling the shared term to the LCM of its two values.",
      "Partnership profit splits in the ratio of capital × time.",
      "For averages, track the deviation from the old mean, not the totals.",
      "Alligation: each ingredient's share is its distance to the OPPOSITE value.",
      "Alligation returns a ratio, not a quantity.",
      "Repeated replacement: final = initial × (1 − r/V)ⁿ."
    ],
    r: ["Mean, Median and Mode", "Statistics"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "cheaper : dearer = (d - m) : (m - c)", w: "the alligation rule" },
        { c: "final = initial x (1 - r/V)^n", w: "removal and replacement" },
        { c: "profit share ratio = capital x time", w: "every partnership question" }
      ]
    }
  },

  {
    t: "Simple and Compound Interest",
    m: "arith",
    lvl: "intermediate",
    s: "SI, CI, the two-year and three-year differences, compounding frequency, instalments and the doubling shortcuts.",
    goal: [
      "Treat compound interest as successive percentage change rather than a formula",
      "Use the CI − SI differences to skip most of the arithmetic",
      "Handle half-yearly compounding, instalments and depreciation without new formulas"
    ],
    b: [
      { p: "Compound interest is the percentage lesson applied *n* times. If you already multiply multipliers you already know it — and thinking of it that way is what makes the two-year questions solvable in your head." },

      {
        code: {
          lang: "text", t: "The two formulas, and the relation that matters",
          lines: [
            { c: "SI = P x R x T / 100", w: "Interest on the original principal only, every year." },
            { c: "A  = P x (1 + R/100)^n        and  CI = A - P", w: "", hi: true },
            { c: "", w: "" },
            { c: "CI - SI over 2 years  =  P (R/100)^2", w: "**Memorise this. It appears in every exam, every year.**", hi: true },
            { c: "CI - SI over 3 years  =  P R^2 (300 + R) / 100^3", w: "Equivalently P(R/100)^2 x (3 + R/100)." },
            { c: "", w: "" },
            { c: "SI for 2 years = 2 x (one year's interest)", w: "" },
            { c: "CI for 2 years = 2 x (one year's interest) + interest on that interest", w: "That last term IS the difference above.", hi: true }
          ]
        }
      },

      { h: "Compound interest as a percentage chain" },

      {
        tbl: {
          t: "The multipliers worth knowing cold",
          h: ["Rate", "2 years", "3 years", "Read as"],
          rows: [
            ["5%", "10.25%", "15.7625%", "1.05² and 1.05³"],
            ["10%", "**21%**", "**33.1%**", "The two most-tested numbers in the topic"],
            ["12%", "25.44%", "40.49%", "1.12²"],
            ["15%", "32.25%", "52.0875%", "1.15²"],
            ["20%", "44%", "72.8%", "1.2²"],
            ["25%", "56.25%", "95.3125%", "1.25²"]
          ]
        }
      },

      { n: "The two-year figure is only the successive-change formula: r + r + r²/100. At 10% that is 10 + 10 + 1 = 21. At 20%: 20 + 20 + 4 = 44. You never need the table if you have the formula, and you never need the formula if you multiply multipliers.", nt: "You already knew this table" },

      { h: "Compounding more often than yearly" },

      {
        code: {
          lang: "text", t: "One adjustment, applied everywhere",
          lines: [
            { c: "Halve the rate, double the periods.  Quarterly: /4 and x4.", w: "**Rate per period = R/k, periods = n x k.**", hi: true },
            { c: "", w: "" },
            { c: "10000 at 20% for 1 year, compounded half-yearly:", w: "" },
            { c: "  10000 x (1.10)^2 = 12100      not 12000", w: "10% twice always beats 20% once." },
            { c: "", w: "" },
            { c: "Compounded quarterly:", w: "" },
            { c: "  10000 x (1.05)^4 = 12155.06", w: "More frequent compounding always yields more." },
            { c: "", w: "" },
            { c: "Rule of 72: years to double at R% ~ 72/R", w: "" },
            { c: "  at 8%, about 9 years; at 12%, about 6 years", w: "An estimate — close enough to eliminate three options.", hi: true },
            { c: "Under simple interest, doubling takes exactly 100/R years.", w: "Exact there, not an approximation." }
          ]
        }
      },

      { h: "The question types" },

      {
        tbl: {
          t: "Recognise and route",
          h: ["Question", "Move"],
          rows: [
            ["CI − SI for 2 years is given; find P or R", "P(R/100)² — one equation, one unknown"],
            ["A sum doubles in n years at **CI**; when is it 4×?", "Doubling is a multiplier of 2, so 4× is **2n years**"],
            ["A sum doubles in n years at **SI**; when is it 3×?", "SI is linear: doubling adds P, tripling adds 2P, so **2n years**"],
            ["Equal annual instalments clearing a loan", "Discount each instalment back to today and sum to the principal"],
            ["Depreciation at R% a year", "P(1 − R/100)ⁿ — compound interest with a minus sign"],
            ["Population grows at different rates each year", "Multiply the multipliers, exactly as in percentages"],
            ["Amount after n years is A₁, after n+1 is A₂", "R = (A₂ − A₁)/A₁ × 100 — the gap is one year's interest on A₁"]
          ]
        }
      },

      { trap: "**Doubling under compound interest does not scale linearly.** If a sum doubles in 5 years, it is 4× in 10 years and 8× in 15 — not 3× in 15. Under *simple* interest the opposite holds: doubling in 5 years means tripling in 10, because the interest earned per year never changes. Read which regime the question is in before applying either." },

      { h: "Instalments, without a new formula" },

      {
        code: {
          lang: "text", t: "Two equal instalments clearing a loan",
          lines: [
            { c: "6550 is borrowed at 10% CI and repaid in two equal annual", w: "" },
            { c: "instalments. Find each instalment.", w: "" },
            { c: "", w: "" },
            { c: "Each instalment x, paid at the end of years 1 and 2.", w: "" },
            { c: "Discount each back to today and set the sum equal to the loan:", w: "**An instalment due in n years is worth x/(1.1)^n now.**", hi: true },
            { c: "", w: "" },
            { c: "  x/1.1 + x/1.21 = 6550", w: "" },
            { c: "  x (10/11 + 100/121) = 6550", w: "" },
            { c: "  x (110 + 100)/121 = 6550", w: "" },
            { c: "  x x 210/121 = 6550   ->   x = 6550 x 121/210 = 3774.05", w: "" },
            { c: "", w: "" },
            { c: "Under SI the structure is identical; each instalment simply", w: "" },
            { c: "carries plain interest for the years it was outstanding.", w: "Same setup, easier arithmetic." }
          ]
        }
      },

      {
        tryit: {
          t: "Four standard shapes",
          task: "(a) The difference between CI and SI on a sum for 2 years at 10% is ₹150. Find the sum. (b) ₹8,000 at 15% for 2 years, compounded annually — find the CI. (c) A machine worth ₹50,000 depreciates 20% a year. Its value after 3 years? (d) A sum triples in 12 years at simple interest. Find the rate.",
          hint: "(a) P(R/100)². (b) use the 32.25% multiplier. (d) tripling means the interest earned equals 2P.",
          sol: { lang: "text", code: "(a) P x (10/100)^2 = 150  ->  P/100 = 150  ->  P = 15000\n\n(b) 8000 x 0.3225 = 2580\n    (check: 8000 x 1.15^2 = 8000 x 1.3225 = 10580)\n\n(c) 50000 x (0.8)^3 = 50000 x 0.512 = 25600\n\n(d) interest earned = 2P over 12 years\n    2P = P x R x 12 / 100  ->  R = 200/12 = 16.67% per annum" },
          w: "Part (a) is the single most common CI question in placement papers, and it is one line every time. Recognising it buys back ninety seconds you can spend on a DI set."
        }
      }
    ],
    k: [
      "CI is repeated percentage change: A = P(1 + R/100)ⁿ.",
      "CI − SI over 2 years = P(R/100)². This exact question appears constantly.",
      "Two years at 10% is 21%; two years at 20% is 44%. Know the common multipliers.",
      "Half-yearly: halve the rate, double the periods. More frequent always yields more.",
      "CI doubling compounds (2× in n ⇒ 4× in 2n). SI doubling is linear (2× in n ⇒ 3× in 2n).",
      "Depreciation is CI with a minus sign: P(1 − R/100)ⁿ."
    ],
    r: ["Expected Value"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "A = P (1 + R/100)^n", w: "the compound amount" },
        { c: "CI - SI for 2 years = P (R/100)^2", w: "the most-asked CI question" },
        { c: "half-yearly: rate/2, periods x2", w: "any compounding frequency" }
      ]
    }
  }

]);
