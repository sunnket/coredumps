/* Aptitude — the hardcore set.

   Every question here is built around its wrong answer. The distractors are
   not filler: each one is the number you get by making a specific, extremely
   common error, and the explanation names that error rather than only
   restating the method. A reader who picks the trap learns which mistake
   they make; a reader who avoids it learns why it was there.

   Nothing in this file is harder arithmetic than the chapters it sits
   beside. It is the same arithmetic with the intuition pointing the wrong
   way, which is exactly what a timed exam is testing. */

TD.addMCQ("aptitude", "arith", [

  {
    tag: "Percentages", lvl: "hardcore",
    q: "A shopkeeper raises the price of rice by 20% and then, in a sale, reduces the new price by 20%. Compared with the original price, the final price is:",
    o: ["4% lower", "Unchanged", "4% higher", "2% lower"],
    a: 0,
    x: "The two 20% figures are taken on **different bases**, so they do not cancel. 100 → 120 → 96, a net fall of **4%**.",
    steps: [
      "Start at 100. A 20% rise gives 120.",
      "The 20% reduction is now taken on 120, not on 100: 20% of 120 = 24.",
      "120 − 24 = 96, so the net change is a fall of **4%**."
    ],
    note: "General result: a rise of x% followed by a fall of x% always leaves you at a loss of x²/100 per cent, whichever order you do them in."
  },

  {
    tag: "Percentages", lvl: "hardcore",
    q: "Anil's salary is 25% more than Bhavna's. Bhavna's salary is therefore what percentage less than Anil's?",
    o: ["20%", "25%", "33.33%", "16.67%"],
    a: 0,
    x: "The comparison base changes direction with the sentence. Taking Bhavna = 100, Anil = 125, so the gap of 25 is measured against **125**, giving 20%.",
    steps: [
      "Let Bhavna = 100. Then Anil = 125.",
      "Going the other way, the difference is still 25, but now it is a fraction of Anil's 125.",
      "25/125 × 100 = **20%**."
    ],
    note: "If A is r% more than B, then B is r/(100+r) × 100 per cent less than A. The two percentages are never equal, and assuming they are is the single most common percentage error there is."
  },

  {
    tag: "Profit and loss", lvl: "hardcore",
    q: "A trader sells two shirts for Rs 990 each. On the first he makes a 10% profit and on the second a 10% loss. On the pair of transactions he:",
    o: ["Loses Rs 20", "Breaks even", "Gains Rs 20", "Loses Rs 10"],
    a: 0,
    x: "Equal percentages on **unequal cost prices** do not cancel. The cost prices are 900 and 1100, totalling 2000, against revenue of 1980 — a loss of **Rs 20**.",
    steps: [
      "First shirt: SP 990 at 10% profit, so CP = 990/1.1 = 900.",
      "Second shirt: SP 990 at 10% loss, so CP = 990/0.9 = 1100.",
      "Total cost 900 + 1100 = 2000; total revenue 1980.",
      "Loss = **Rs 20**."
    ],
    note: "Whenever two items sell for the same price at the same percentage profit and loss, the result is always a loss of x²/100 per cent — here 1% of 2000 = Rs 20."
  },

  {
    tag: "Profit and loss", lvl: "hardcore",
    q: "An article is sold at a profit of 25% on its cost price. That profit, expressed as a percentage of the selling price, is:",
    o: ["20%", "25%", "33.33%", "16.67%"],
    a: 0,
    x: "Cost 100 gives selling price 125 and profit 25. Against the **selling price** the profit is 25/125 = **20%**.",
    steps: [
      "Take CP = 100. A 25% profit makes SP = 125.",
      "The profit is 25 in both cases; only the denominator changes.",
      "25/125 × 100 = **20%**."
    ],
    note: "Retail and finance often quote margin on selling price while manufacturing quotes it on cost. The same trade can be a 25% markup and a 20% margin, and the two numbers describe an identical transaction."
  },

  {
    tag: "Discounts", lvl: "hardcore",
    q: "Which is the better deal for a buyer: two successive discounts of 20% and 30%, or a single discount of 45%?",
    o: [
      "The single 45% discount, by 1% of the list price",
      "The successive discounts, by 5% of the list price",
      "They are identical",
      "The successive discounts, by 1% of the list price"
    ],
    a: 0,
    x: "Successive discounts multiply rather than add: 0.80 × 0.70 = 0.56, so the buyer pays 56%. A single 45% discount leaves 55%. The single discount is better by **1%**.",
    steps: [
      "Successive: the second discount applies to the already-reduced price, so the buyer pays 0.8 × 0.7 = 0.56 of list.",
      "Single 45%: the buyer pays 0.55 of list.",
      "0.55 < 0.56, so the single discount is cheaper by **1% of the list price**."
    ],
    note: "Two successive discounts of a% and b% are equivalent to a single discount of (a + b − ab/100) per cent. Here that is 20 + 30 − 6 = 44%, not 50%."
  },

  {
    tag: "Interest", lvl: "hardcore",
    q: "A sum of money doubles itself in 8 years under **simple** interest. In how many years will the same sum triple at the same rate?",
    o: ["16 years", "24 years", "12 years", "18 years"],
    a: 0,
    x: "Under simple interest the interest earned each year is constant. Earning an amount equal to the principal takes 8 years, so earning twice the principal takes **16 years**.",
    steps: [
      "Doubling means the interest earned equals the principal, and that took 8 years.",
      "Tripling means the interest earned must equal twice the principal.",
      "Since simple interest accrues at a constant amount per year, that takes 2 × 8 = **16 years**."
    ],
    note: "The instinct to answer 24 comes from treating *double → triple* as another whole doubling. It is not: the second step adds one more principal, not two. Under compound interest the answer would be different again, and much less tidy."
  },

  {
    tag: "Interest", lvl: "hardcore",
    q: "A sum doubles in 5 years under compound interest, compounded annually. In how many years will it become eight times itself, at the same rate?",
    o: ["15 years", "20 years", "40 years", "10 years"],
    a: 0,
    x: "Compound growth multiplies. Eight is 2³, so it takes **three doubling periods**: 3 × 5 = **15 years**.",
    steps: [
      "After 5 years the sum is 2P; after 10 years, 4P; after 15 years, 8P.",
      "Each doubling period is the same length under a constant rate.",
      "8 = 2³, so three periods: **15 years**."
    ],
    note: "The tempting 20 comes from scaling linearly — 2 in 5 years, so 8 in 20. That reasoning is correct for simple interest and wrong for compound, and telling the two apart is most of what these questions test."
  },

  {
    tag: "Interest", lvl: "hardcore",
    q: "The difference between compound interest compounded annually and simple interest on a certain sum for 2 years at 10% per annum is Rs 250. The sum is:",
    o: ["Rs 25,000", "Rs 2,500", "Rs 12,500", "Rs 5,000"],
    a: 0,
    x: "For 2 years the difference is P(r/100)² = P × 0.01. Setting P × 0.01 = 250 gives P = **Rs 25,000**.",
    steps: [
      "Simple interest for 2 years = 2Pr/100 = 0.2P.",
      "Compound interest for 2 years = P[(1.1)² − 1] = 0.21P.",
      "The difference is 0.01P, which is P(r/100)² for r = 10.",
      "0.01P = 250, so P = **25,000**."
    ],
    note: "The 2-year difference formula P(r/100)² is worth memorising: it is the single most-asked compound interest relationship, and it comes from the fact that the only extra amount compounding earns is interest on the first year's interest."
  }

]);

TD.addMCQ("aptitude", "numbers", [

  {
    tag: "Averages", lvl: "hardcore",
    q: "The average of 10 numbers was worked out as 25. It later emerged that one entry, 36, had been read as 26. The correct average is:",
    o: ["26", "25.1", "35", "24"],
    a: 0,
    x: "The recorded total was 10 short of the true total. Adding 10 back and dividing by 10 raises the average by exactly 1, to **26**.",
    steps: [
      "Recorded total = 10 × 25 = 250.",
      "The entry was understated by 36 − 26 = 10, so the true total is 260.",
      "True average = 260/10 = **26**."
    ],
    note: "An error of E in one entry moves the average of n numbers by E/n — not by E. Here that happens to be a whole 1 because n = 10, which is exactly why the trap answer 35 looks plausible to somebody moving fast."
  },

  {
    tag: "Averages", lvl: "hardcore",
    q: "The average weight of 8 people in a lift increases by 2.5 kg when one person weighing 65 kg steps out and a new person steps in. The new person weighs:",
    o: ["85 kg", "67.5 kg", "82.5 kg", "90 kg"],
    a: 0,
    x: "The average of 8 rising by 2.5 means the total rose by 8 × 2.5 = 20 kg, so the newcomer weighs 65 + 20 = **85 kg**.",
    steps: [
      "The group size is unchanged at 8, so only the total moved.",
      "Total increase = 8 × 2.5 = 20 kg.",
      "That entire increase is the difference between the two people: 65 + 20 = **85 kg**."
    ],
    note: "The trap is adding 2.5 to 65. The average moved by 2.5, but one person absorbed the whole change, so the individual difference is n times the change in the average."
  },

  {
    tag: "Number properties", lvl: "hardcore",
    q: "What is the units digit of 7⁹⁵?",
    o: ["3", "7", "9", "1"],
    a: 0,
    x: "Powers of 7 end in 7, 9, 3, 1 and then repeat with period 4. Since 95 leaves remainder 3 on division by 4, the units digit is the **third** in the cycle, which is **3**.",
    steps: [
      "7¹ = 7, 7² = 49, 7³ = 343, 7⁴ = 2401. The units digits cycle 7, 9, 3, 1.",
      "95 ÷ 4 leaves remainder 3.",
      "The third term of the cycle is **3**."
    ],
    note: "The classic slip is a remainder of 0. When the remainder is 0 you take the *fourth* term, not the first — a cycle position of 0 means the end of the cycle, not the start of it."
  },

  {
    tag: "Number properties", lvl: "hardcore",
    q: "What is the remainder when 2⁵¹ is divided by 7?",
    o: ["1", "2", "4", "6"],
    a: 0,
    x: "2³ = 8 leaves remainder 1 on division by 7, and 51 is a multiple of 3, so 2⁵¹ = (2³)¹⁷ leaves remainder **1**.",
    steps: [
      "2¹ ≡ 2, 2² ≡ 4, 2³ = 8 ≡ 1 (mod 7). The cycle length is 3.",
      "51 = 3 × 17, so 2⁵¹ = (2³)¹⁷ ≡ 1¹⁷ (mod 7).",
      "The remainder is **1**."
    ],
    note: "Finding the smallest power that leaves remainder 1 is the whole technique. Once you have it, every exponent question collapses to a division of the exponent by the cycle length."
  },

  {
    tag: "Ratios", lvl: "hardcore",
    q: "If 20% of A equals 30% of B, then A : B is:",
    o: ["3 : 2", "2 : 3", "20 : 30", "5 : 6"],
    a: 0,
    x: "0.2A = 0.3B gives A/B = 0.3/0.2 = **3/2**. The smaller percentage belongs to the larger quantity.",
    steps: [
      "0.2A = 0.3B.",
      "Divide both sides by 0.2B: A/B = 0.3/0.2.",
      "A : B = **3 : 2**."
    ],
    note: "Reading the ratio straight off the percentages, in the order they appear, gives 2 : 3 and is wrong. The percentages are inversely related to the quantities, because a smaller slice of a bigger number can equal a bigger slice of a smaller one."
  },

  {
    tag: "Number series", lvl: "hardcore",
    q: "Find the next term: 2, 6, 12, 20, 30, ?",
    o: ["42", "40", "36", "44"],
    a: 0,
    x: "The terms are n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6. The next is 6×7 = **42**. The differences are 4, 6, 8, 10, so the next difference is 12.",
    steps: [
      "Differences: 6−2 = 4, 12−6 = 6, 20−12 = 8, 30−20 = 10.",
      "The differences increase by 2, so the next difference is 12.",
      "30 + 12 = **42**."
    ],
    note: "Answering 40 means adding 10 again — treating the differences as constant rather than as themselves a sequence. In any series question, take the differences of the differences before deciding you have found the pattern."
  }

]);

TD.addMCQ("aptitude", "tsd", [

  {
    tag: "Average speed", lvl: "hardcore",
    q: "A car travels from Pune to Mumbai at 40 km/h and returns along the same road at 60 km/h. Its average speed for the whole journey is:",
    o: ["48 km/h", "50 km/h", "52 km/h", "45 km/h"],
    a: 0,
    x: "Average speed is total distance over total time, not the average of the two speeds. The car spends **longer** at the slower speed, so the answer is pulled below 50 — the harmonic mean, **48 km/h**.",
    steps: [
      "Take the one-way distance as 120 km, a convenient multiple of both speeds.",
      "Time out = 120/40 = 3 hours. Time back = 120/60 = 2 hours.",
      "Total distance 240 km in 5 hours = **48 km/h**."
    ],
    note: "For equal distances the average speed is 2ab/(a+b), the harmonic mean, and it is always less than the arithmetic mean. Averaging the speeds would only be correct if equal *times* were spent at each — a different question entirely."
  },

  {
    tag: "Trains", lvl: "hardcore",
    q: "A 150 m long train running at 72 km/h crosses a platform in 20 seconds. The length of the platform is:",
    o: ["250 m", "400 m", "300 m", "150 m"],
    a: 0,
    x: "Crossing a platform means covering **its own length plus the platform's**. At 20 m/s for 20 s the train covers 400 m, so the platform is 400 − 150 = **250 m**.",
    steps: [
      "72 km/h = 72 × 5/18 = 20 m/s.",
      "Distance covered in 20 s = 400 m.",
      "That distance is train + platform, so the platform = 400 − 150 = **250 m**."
    ],
    note: "The 400 m answer is the total distance covered, which the question did not ask for. Crossing a pole covers only the train's length; crossing anything with a length of its own covers the sum."
  },

  {
    tag: "Boats and streams", lvl: "hardcore",
    q: "A boat whose speed in still water is 10 km/h travels 24 km upstream and returns, in a stream flowing at 2 km/h. Its average speed for the round trip is:",
    o: ["9.6 km/h", "10 km/h", "12 km/h", "8 km/h"],
    a: 0,
    x: "Upstream at 8 km/h takes 3 hours and downstream at 12 km/h takes 2 hours: 48 km in 5 hours, so **9.6 km/h**. The current does not cancel out.",
    steps: [
      "Upstream speed = 10 − 2 = 8 km/h; time = 24/8 = 3 hours.",
      "Downstream speed = 10 + 2 = 12 km/h; time = 24/12 = 2 hours.",
      "Total 48 km in 5 hours = **9.6 km/h**."
    ],
    note: "It is very tempting to say the stream helps as much going down as it hinders going up, so the average is 10. It does help by the same *speed* — but for less *time*, and time is what the average is weighted by. A current always costs you on a round trip."
  },

  {
    tag: "Work and time", lvl: "hardcore",
    q: "Anita can finish a job in 12 days and Bhaskar in 18. They start together, but Anita leaves 3 days before the job is completed. The job takes:",
    o: ["9 days", "7.2 days", "8.4 days", "10 days"],
    a: 0,
    x: "Bhaskar works the whole time T and Anita works T − 3. Solving (T−3)/12 + T/18 = 1 gives T = **9 days**.",
    steps: [
      "Let the job take T days in total. Bhaskar works all T days; Anita works T − 3.",
      "(T − 3)/12 + T/18 = 1.",
      "Multiply through by 36: 3(T − 3) + 2T = 36.",
      "3T − 9 + 2T = 36, so 5T = 45 and T = **9**."
    ],
    note: "The 7.2 answer is how long they would take working together throughout, which is what you get by ignoring the departure. Whenever somebody leaves or joins partway, name the unknown as the *total* time and write each person's contribution against it."
  },

  {
    tag: "Pipes and cisterns", lvl: "hardcore",
    q: "Pipe A fills a tank in 6 hours and pipe B in 8 hours. An outlet pipe C can empty the full tank in 12 hours. With all three open on an empty tank, it fills in:",
    o: ["4.8 hours", "5.2 hours", "3.4 hours", "6 hours"],
    a: 0,
    x: "Net rate = 1/6 + 1/8 − 1/12 = 5/24 of the tank per hour, so the tank fills in 24/5 = **4.8 hours**.",
    steps: [
      "Work in twenty-fourths: A fills 4/24 per hour, B fills 3/24, C empties 2/24.",
      "Net = 4 + 3 − 2 = 5 twenty-fourths per hour.",
      "Time = 24/5 = **4.8 hours**."
    ],
    note: "Rates add and subtract; times never do. Adding or averaging the hours directly is the error that makes every one of these questions go wrong."
  },

  {
    tag: "Clocks", lvl: "hardcore",
    q: "What is the angle between the hour and minute hands at 3:40?",
    o: ["130°", "140°", "120°", "150°"],
    a: 0,
    x: "The hour hand has moved past 3. Using |30H − 5.5M| = |90 − 220| = **130°**.",
    steps: [
      "The minute hand at 40 minutes is at 40 × 6 = 240° from twelve.",
      "The hour hand at 3:40 is at 3 × 30 + 40 × 0.5 = 90 + 20 = 110°.",
      "The angle between them is 240 − 110 = **130°**."
    ],
    note: "Answering 140 comes from leaving the hour hand at the 3, exactly on 90°. It is never exactly on the number except on the hour — it creeps half a degree every minute, and that creep is what these questions are actually about."
  },

  {
    tag: "Clocks", lvl: "hardcore",
    q: "How many times in a 24-hour day do the hour and minute hands of a correct clock overlap?",
    o: ["22", "24", "23", "12"],
    a: 0,
    x: "The hands overlap 11 times in 12 hours, not 12 — between 11 and 1 there is only one overlap, at 12 o'clock. So in 24 hours there are **22**.",
    steps: [
      "The minute hand gains 360° on the hour hand every 65 5/11 minutes, so overlaps are that far apart.",
      "In 12 hours there is room for 11 such gaps, not 12: the overlap that would fall at 11-something is the same event as the one at 12.",
      "11 × 2 = **22** in a full day."
    ],
    note: "The same structure gives the other clock counts: the hands are opposite 22 times a day and at right angles 44 times, each for the identical reason — one apparent occurrence per 12 hours is absorbed by the 12 o'clock coincidence."
  },

  {
    tag: "Calendars", lvl: "hardcore",
    q: "1 March 2024 was a Friday. What day was 1 March 2025?",
    o: ["Saturday", "Sunday", "Monday", "Friday"],
    a: 0,
    x: "2024 is a leap year, but its extra day, 29 February, falls **before** 1 March 2024. The span therefore contains 365 days, giving one odd day: **Saturday**.",
    steps: [
      "Count the days from 1 March 2024 to 1 March 2025.",
      "The only 29 February in question is 29 February 2024, which is already past on 1 March 2024.",
      "365 days = 52 weeks and 1 day, so the weekday advances by one: **Saturday**."
    ],
    note: "The leap-year trap is about position, not about the year label. Ask whether 29 February lies inside the interval you are counting, not whether either endpoint is in a leap year."
  }

]);

TD.addMCQ("aptitude", "counting", [

  {
    tag: "Probability", lvl: "hardcore",
    q: "Two fair dice are rolled. What is the probability that at least one shows a six?",
    o: ["11/36", "1/3", "12/36", "1/6"],
    a: 0,
    x: "Adding 1/6 and 1/6 double-counts the double six. Counting the complement: 25 of the 36 outcomes have no six, so the answer is 1 − 25/36 = **11/36**.",
    steps: [
      "P(no six on one die) = 5/6, so P(no six on either) = 25/36.",
      "P(at least one six) = 1 − 25/36 = **11/36**.",
      "The direct count agrees: 6 outcomes with a six on the first die, 6 with a six on the second, minus the (6,6) counted twice = 11."
    ],
    note: "*At least one* is almost always faster through the complement, and it is the phrasing that most often produces an over-count when attacked head on."
  },

  {
    tag: "Probability", lvl: "hardcore",
    q: "A family has two children. You are told that at least one of them is a boy. Assuming boys and girls are equally likely and the four birth orders are equally likely, what is the probability that both are boys?",
    o: ["1/3", "1/2", "1/4", "2/3"],
    a: 0,
    x: "The information rules out only girl-girl, leaving three equally likely cases — BB, BG, GB — of which one has two boys: **1/3**.",
    steps: [
      "The equally likely birth orders are BB, BG, GB, GG.",
      "*At least one boy* eliminates GG, leaving three cases, still equally likely.",
      "Only BB has two boys, so the probability is **1/3**."
    ],
    note: "The 1/2 answer would be right for a different question: *the elder child is a boy, what is the probability both are*. Naming a specific child eliminates two cases and leaves two; saying only that one exists eliminates one case and leaves three. Which sentence you were given is the entire problem."
  },

  {
    tag: "Permutations", lvl: "hardcore",
    q: "From a group of 8 people, in how many ways can a president, a secretary and a treasurer be chosen, if nobody holds two posts?",
    o: ["336", "56", "512", "24"],
    a: 0,
    x: "The three posts are distinct, so order matters: 8 × 7 × 6 = **336**. Treating it as a plain selection would give 56 and would lose every rearrangement of the same three people.",
    steps: [
      "8 choices for president, then 7 for secretary, then 6 for treasurer.",
      "8 × 7 × 6 = **336**.",
      "Equivalently ⁸P₃ = 8!/5! = 336."
    ],
    note: "The test is whether swapping two chosen people produces a different outcome. Here it does — president and secretary are not interchangeable — so it is a permutation. For a committee of three with no titles it would be ⁸C₃ = 56."
  },

  {
    tag: "Permutations", lvl: "hardcore",
    q: "In how many distinct ways can 6 people be seated around a circular table?",
    o: ["120", "720", "600", "60"],
    a: 0,
    x: "In a circle there is no fixed first seat, so every arrangement is counted 6 times over by rotation. The answer is (6 − 1)! = **120**.",
    steps: [
      "In a row the count would be 6! = 720.",
      "Rotating a circular seating produces the same arrangement, and there are 6 rotations of each.",
      "720/6 = **120**, which is (n − 1)! for n = 6."
    ],
    note: "Fix one person's seat and arrange the rest relative to them — that is what (n−1)! is really doing. If the table can also be flipped over, as with a necklace of beads, you divide by 2 again."
  },

  {
    tag: "Sets", lvl: "hardcore",
    q: "In a class of 100 students, 70 like tea and 80 like coffee. What is the **minimum** possible number who like both?",
    o: ["50", "70", "30", "20"],
    a: 0,
    x: "By inclusion–exclusion, |A∩B| = 70 + 80 − 100 = **50**. The two groups total 150 across only 100 students, so at least 50 students must be counted twice.",
    steps: [
      "|A ∪ B| = |A| + |B| − |A ∩ B| = 150 − |A ∩ B|.",
      "The union cannot exceed the class, so 150 − |A ∩ B| ≤ 100.",
      "That forces |A ∩ B| ≥ **50**, and 50 is achieved exactly when nobody likes neither."
    ],
    note: "70 is the *maximum* overlap, not the minimum — it is what you get if every tea drinker also drinks coffee. Questions in this family always specify minimum or maximum, and reading past that word is the whole trap."
  },

  {
    tag: "Mixtures", lvl: "hardcore",
    q: "A vessel holds 40 litres of pure milk. 8 litres are removed and replaced with water. From the mixture, 8 litres are again removed and replaced with water. How much milk remains?",
    o: ["25.6 litres", "24 litres", "26 litres", "28.8 litres"],
    a: 0,
    x: "The second removal takes out a mixture, not pure milk. Milk remaining = 40 × (1 − 8/40)² = 40 × 0.64 = **25.6 litres**.",
    steps: [
      "After the first replacement: 32 litres of milk in 40 litres of liquid.",
      "The second 8 litres removed is 20% of the vessel, so it carries away 20% of the milk: 6.4 litres.",
      "32 − 6.4 = **25.6 litres**, which is 40(1 − 8/40)²."
    ],
    note: "Answering 24 means subtracting 8 litres of milk twice, which would only be right if the second draw were pure milk. After the first replacement it never is again, and the general formula is P(1 − x/P)ⁿ."
  },

  {
    tag: "Mixtures", lvl: "hardcore",
    q: "In what ratio must rice costing Rs 30 per kg be mixed with rice costing Rs 40 per kg to produce a mixture worth Rs 34 per kg?",
    o: ["3 : 2", "2 : 3", "4 : 6", "1 : 1"],
    a: 0,
    x: "By alligation the ratio of the cheaper to the dearer is (40 − 34) : (34 − 30) = 6 : 4 = **3 : 2**. Each quantity is paired with the distance on the *far* side of the mean.",
    steps: [
      "Distance from the dearer price to the mean: 40 − 34 = 6.",
      "Distance from the mean to the cheaper price: 34 − 30 = 4.",
      "Cheaper : dearer = 6 : 4 = **3 : 2**.",
      "Check: (3 × 30 + 2 × 40)/5 = 170/5 = 34. ✓"
    ],
    note: "The reversal is the classic alligation error, and the check is always available: compute the weighted average of your answer and see whether it lands on the target. Since 34 is nearer 30, more of the cheaper rice must be in the mixture — which alone rules out 2 : 3."
  }

]);

TD.addMCQ("aptitude", "di", [

  {
    tag: "Percentage points", lvl: "hardcore",
    q: "A website's conversion rate improved from 20% to 25% after a redesign. Which statement is correct?",
    o: [
      "A rise of 5 percentage points, which is a 25% relative increase",
      "A rise of 5%, which is also a 5 percentage point increase",
      "A rise of 25 percentage points",
      "A rise of 5%, which is a 20% relative increase"
    ],
    a: 0,
    x: "The gap is 5 **percentage points**. As a proportion of the starting 20%, that is 5/20 = a **25% relative increase**. Both numbers describe the same change and they are not interchangeable.",
    steps: [
      "25 − 20 = 5, and the unit of that difference is percentage points.",
      "Relative change = 5/20 × 100 = **25%**.",
      "So: five percentage points, or twenty-five per cent, depending on which you mean."
    ],
    note: "This is the most consequential ambiguity in business reporting. *Margin rose 5%* and *margin rose 5 points* can differ by an order of magnitude, and a chart that says one while meaning the other is the commonest way a data slide misleads without lying."
  },

  {
    tag: "Growth rates", lvl: "hardcore",
    q: "A company's revenue rose 50% in 2023 and then fell 40% in 2024. Compared with the start of 2023, revenue at the end of 2024 is:",
    o: ["10% lower", "10% higher", "Unchanged", "20% lower"],
    a: 0,
    x: "Successive changes multiply: 1.50 × 0.60 = 0.90, so revenue is **10% lower** than where it started, despite the rise being the larger headline number.",
    steps: [
      "Start at 100. After a 50% rise: 150.",
      "The 40% fall is taken on 150, not on 100: 40% of 150 = 60.",
      "150 − 60 = 90, which is **10% below** the starting 100."
    ],
    note: "Adding the percentages gives +10% and is wrong for the same reason it is always wrong: the second percentage is measured against a base the first one moved. A bigger percentage rise followed by a smaller percentage fall can still leave you down."
  },

  {
    tag: "Reading a chart", lvl: "hardcore",
    q: "A bar chart shows Company A's profit growing 30% and Company B's growing 12% last year. Which conclusion is safe?",
    o: [
      "Neither company's profit in rupees can be compared without the base figures",
      "Company A made more profit than Company B",
      "Company A's profit grew by more rupees than Company B's",
      "Company A is the more profitable business"
    ],
    a: 0,
    x: "Growth rates are ratios, and a ratio says nothing about magnitude without its base. If A grew from 10 lakh and B from 100 crore, B's 12% is a vastly larger sum of money.",
    steps: [
      "30% and 12% are proportions of two unknown starting values.",
      "Nothing in the chart fixes those starting values.",
      "Therefore no statement about rupee amounts, or about which company is larger or more profitable, is supported."
    ],
    note: "Percentage-only charts are the most common way a presentation implies something it has not shown. The question to ask of any growth figure is always *of what*, and a chart that does not answer it cannot support a comparison."
  }

]);

TD.addMCQ("aptitude", "logical", [

  {
    tag: "Conditionals", lvl: "hardcore",
    q: "Given: *If the build is green, then all the tests passed.* Which statement must also be true?",
    o: [
      "If some test did not pass, the build is not green",
      "If all the tests passed, the build is green",
      "If the build is not green, some test did not pass",
      "The build is green only if it was run today"
    ],
    a: 0,
    x: "Only the **contrapositive** is logically equivalent to a conditional. *If P then Q* guarantees *if not Q then not P*, and nothing else.",
    steps: [
      "The statement is: green ⇒ all passed.",
      "Its contrapositive is: not all passed ⇒ not green. Always equivalent.",
      "Its converse (all passed ⇒ green) and its inverse (not green ⇒ not all passed) are both invalid — the tests could pass while the build fails for an unrelated reason such as a timeout."
    ],
    note: "The converse is the single most common reasoning error in exams and in engineering arguments alike. A green build is *sufficient* evidence that the tests passed; it is not *necessary*."
  },

  {
    tag: "Syllogism", lvl: "hardcore",
    q: "All the engineers who passed the certification received an interview. Ravi received an interview. What follows?",
    o: [
      "Nothing about whether Ravi passed the certification",
      "Ravi passed the certification",
      "Ravi did not pass the certification",
      "Ravi is an engineer who passed"
    ],
    a: 0,
    x: "The premise says passing leads to an interview, not that it is the only route to one. Ravi may have been interviewed for a different reason entirely, so **nothing follows**.",
    steps: [
      "Premise: passed ⇒ interview.",
      "Given: interview.",
      "Affirming the consequent does not license the conclusion — the set of interviewees may be larger than the set of certification-passers."
    ],
    note: "This is the same fallacy as the converse error in the previous question, wearing everyday clothes. The test to apply: could the observed fact have arisen any other way? If it could, no conclusion follows."
  },

  {
    tag: "Syllogism", lvl: "hardcore",
    q: "Premises: *Some doctors are singers. All singers are artists.* Which conclusion definitely follows?",
    o: [
      "Some doctors are artists",
      "All doctors are artists",
      "Some artists are not doctors",
      "Some singers are not doctors"
    ],
    a: 0,
    x: "The doctors who are singers must be artists, because every singer is. That gives **some doctors are artists**. The other three all assert something the premises leave open.",
    steps: [
      "There is at least one person who is both a doctor and a singer.",
      "Every singer is an artist, so that person is also an artist.",
      "Therefore at least one doctor is an artist: **some doctors are artists**.",
      "Nothing rules out every doctor being a singer, nor every artist being a doctor, so the remaining options are merely possible."
    ],
    note: "*Some* in logic means *at least one*, and it deliberately does not exclude *all*. Reading *some doctors are singers* as implying that some are not is the error that makes most of these questions go wrong."
  },

  {
    tag: "Direction sense", lvl: "hardcore",
    q: "Ravi walks 10 m north, turns right and walks 15 m, turns right and walks 10 m, then turns left and walks 5 m. How far is he from his starting point, and in which direction?",
    o: ["20 m east", "20 m north-east", "25 m east", "15 m east"],
    a: 0,
    x: "Tracking the coordinates: (0,10) → (15,10) → (15,0) → (20,0). He is back on the starting line and **20 m east** of it.",
    steps: [
      "Start at (0,0). North 10 m → (0,10).",
      "Facing north, a right turn faces east. 15 m → (15,10).",
      "Facing east, a right turn faces south. 10 m → (15,0).",
      "Facing south, a left turn faces east. 5 m → (20,0).",
      "The northward 10 m has been exactly cancelled, leaving **20 m due east**."
    ],
    note: "Turn direction depends on the way you are currently facing, which is why these must be tracked as coordinates rather than pictured. The distance is only a straight 20 m because the north and south legs happened to be equal — check that rather than assuming it."
  },

  {
    tag: "Blood relations", lvl: "hardcore",
    q: "Pointing at a photograph, a man says: *I have no brothers or sisters, but that man's father is my father's son.* Who is in the photograph?",
    o: ["His son", "Himself", "His father", "His nephew"],
    a: 0,
    x: "With no siblings, *my father's son* can only be the speaker himself. So the man in the photograph has the speaker as his father — the photograph is of his **son**.",
    steps: [
      "*My father's son* — the speaker has no brothers, so this is the speaker.",
      "Substituting: *that man's father is me*.",
      "If the speaker is that man's father, the man in the photograph is his **son**."
    ],
    note: "Answering *himself* is the standard trap, and it comes from stopping at the substitution instead of finishing it. Always resolve the innermost phrase first, then rewrite the sentence with it replaced before drawing the relationship."
  },

  {
    tag: "Ages and ratios", lvl: "hardcore",
    q: "The present ages of two brothers are in the ratio 4 : 3. In six years the ratio will be 6 : 5. How old is the younger brother now?",
    o: ["9 years", "3 years", "12 years", "15 years"],
    a: 0,
    x: "A ratio cannot have years added to it directly. Writing the ages as 4x and 3x and solving (4x+6)/(3x+6) = 6/5 gives x = 3, so the younger brother is 3x = **9**.",
    steps: [
      "Let the ages be 4x and 3x.",
      "(4x + 6)/(3x + 6) = 6/5, so 5(4x + 6) = 6(3x + 6).",
      "20x + 30 = 18x + 36, giving 2x = 6 and x = 3.",
      "Younger = 3x = **9**, elder = 4x = 12.",
      "Check: in six years they are 15 and 18, and 18 : 15 = 6 : 5. ✓"
    ],
    note: "The trap is adding 6 to each side of 4 : 3 to get 10 : 9 and treating that as the future ratio. A ratio is not a pair of quantities, so nothing can be added to it — you have to recover the actual ages through the multiplier x first."
  }

]);
