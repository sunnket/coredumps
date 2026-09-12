/* Aptitude — question bank, chapters 3-4.

   Time, speed, distance and work; then algebra. Two chapters that look
   unrelated and are in fact the same skill: turning a sentence into an
   equation quickly enough that solving it is the easy part.

   The recurring idea in the first is **relative speed** — almost every
   train, boat and race question is one subtraction or one addition away
   from a division. The recurring idea in the second is **substitute a
   convenient number**, which turns most algebra questions in a placement
   test into arithmetic. */

TD.addMCQ("aptitude", "tsd", [

  {
    tag: "Units", lvl: "core",
    q: "Convert 72 km/h into metres per second.",
    o: ["20 m/s", "25 m/s", "18 m/s", "24 m/s"],
    a: 0,
    x: "Multiply by 5/18: 72 × 5/18 = **20 m/s**.",
    steps: [
      "1 km/h = 1000 m / 3600 s = 5/18 m/s.",
      "72 × 5/18 = 360/18 = **20**.",
      "Going the other way (m/s → km/h) multiply by 18/5.",
      "Every train question needs this conversion first. Doing it automatically is worth about ten seconds a question."
    ]
  },
  {
    tag: "Trains", lvl: "core",
    q: "How long does a 150 m train travelling at 54 km/h take to pass a signal pole?",
    o: ["10 seconds", "12 seconds", "15 seconds", "9 seconds"],
    a: 0,
    x: "54 km/h = 15 m/s. A pole has no length, so the train covers only its own 150 m: 150 ÷ 15 = **10 s**.",
    steps: [
      "54 × 5/18 = **15 m/s**.",
      "Passing a pole means covering the length of the train alone.",
      "150 / 15 = **10 seconds**.",
      "The rule to hold on to: distance = train length + object length, and a pole's length is zero."
    ]
  },
  {
    tag: "Trains", lvl: "intermediate",
    q: "A 200 m train at 36 km/h crosses a platform 100 m long. How long does it take?",
    o: ["30 seconds", "20 seconds", "25 seconds", "35 seconds"],
    a: 0,
    x: "36 km/h = 10 m/s. Distance = 200 + 100 = 300 m, so 300 ÷ 10 = **30 s**.",
    note: "Crossing a platform, a bridge or another train means covering both lengths. Crossing a pole, a man or a signal means covering only the train's own length."
  },
  {
    tag: "Relative speed", lvl: "intermediate",
    q: "Two trains, 150 m and 100 m long, run towards each other at 60 km/h and 40 km/h. How long do they take to cross completely?",
    o: ["9 seconds", "12 seconds", "45 seconds", "18 seconds"],
    a: 0,
    x: "Opposite directions add: relative speed = 100 km/h = 250/9 m/s. Distance = 250 m. Time = 250 ÷ (250/9) = **9 s**.",
    steps: [
      "Opposite directions → **add** the speeds: 60 + 40 = 100 km/h.",
      "100 × 5/18 = 250/9 m/s.",
      "Total distance = 150 + 100 = 250 m.",
      "250 ÷ (250/9) = **9 seconds**."
    ]
  },
  {
    tag: "Relative speed", lvl: "intermediate",
    q: "The same two trains (150 m and 100 m, at 60 km/h and 40 km/h) now run in the **same** direction. How long does the faster take to overtake the slower completely?",
    o: ["45 seconds", "9 seconds", "30 seconds", "60 seconds"],
    a: 0,
    x: "Same direction subtracts: relative speed = 20 km/h = 50/9 m/s. 250 ÷ (50/9) = **45 s**.",
    note: "Same question, one sign changed, five times the answer. Reading whether the motion is 'towards each other' or 'in the same direction' is worth more marks in this chapter than any formula."
  },
  {
    tag: "Boats", lvl: "core",
    q: "A boat moves at 10 km/h in still water and the stream flows at 2 km/h. What are its downstream and upstream speeds?",
    o: ["12 and 8", "8 and 12", "10 and 2", "20 and 5"],
    a: 0,
    x: "Downstream = boat + stream = 12 km/h. Upstream = boat − stream = **8 km/h**."
  },
  {
    tag: "Boats", lvl: "intermediate",
    q: "A boat covers 24 km downstream in 2 hours and returns in 3 hours. Find the speed of the stream.",
    o: ["2 km/h", "1 km/h", "3 km/h", "4 km/h"],
    a: 0,
    x: "Downstream 12 km/h, upstream 8 km/h. Stream = (12 − 8)/2 = **2 km/h**.",
    steps: [
      "Downstream speed = 24/2 = 12 km/h.",
      "Upstream speed = 24/3 = 8 km/h.",
      "Boat speed = (12 + 8)/2 = 10 km/h.",
      "Stream speed = (12 − 8)/2 = **2 km/h**. Half the sum and half the difference — memorise the pair."
    ]
  },
  {
    tag: "Average speed", lvl: "intermediate",
    q: "A cyclist rides out at 30 km/h and returns along the same road at 60 km/h. What is the average speed for the round trip?",
    o: ["40 km/h", "45 km/h", "42 km/h", "50 km/h"],
    a: 0,
    x: "Equal distances → harmonic mean: 2 × 30 × 60 / (30 + 60) = 3600/90 = **40 km/h**.",
    steps: [
      "Take the one-way distance as 60 km.",
      "Out: 2 hours. Back: 1 hour. Total 120 km in 3 hours.",
      "120/3 = **40 km/h**.",
      "The arithmetic mean of 45 is always wrong here, because more time is spent at the slower speed."
    ]
  },
  {
    tag: "Speed", lvl: "core",
    q: "A car covers a distance in 3 hours at 40 km/h. At what speed must it travel to cover the same distance in 2 hours?",
    o: ["60 km/h", "50 km/h", "65 km/h", "80 km/h"],
    a: 0,
    x: "Distance = 120 km, so 120 ÷ 2 = **60 km/h**.",
    note: "For a fixed distance, speed and time are inversely proportional: cutting the time to two-thirds multiplies the speed by three-halves."
  },
  {
    tag: "Speed", lvl: "advanced",
    q: "Walking at 5 km/h a man misses his train by 7 minutes. Walking at 6 km/h he arrives 5 minutes early. How far is the station?",
    o: ["6 km", "5 km", "8 km", "4 km"],
    a: 0,
    x: "The time difference between the two walks is 12 minutes = 1/5 hour. d/5 − d/6 = 1/5 → d/30 = 1/5 → d = **6 km**.",
    steps: [
      "The two arrival times differ by 7 + 5 = **12 minutes** = 1/5 hour.",
      "Time at 5 km/h minus time at 6 km/h = d/5 − d/6 = d/30.",
      "d/30 = 1/5 → d = **6 km**.",
      "Check: 6/5 = 72 min, 6/6 = 60 min, difference 12 ✓"
    ]
  },
  {
    tag: "Meeting", lvl: "core",
    q: "Two people start walking towards each other from points 100 km apart, at 30 km/h and 20 km/h. When do they meet?",
    o: ["After 2 hours", "After 2.5 hours", "After 3 hours", "After 1.5 hours"],
    a: 0,
    x: "The gap closes at 30 + 20 = 50 km/h, so 100 ÷ 50 = **2 hours**."
  },
  {
    tag: "Races", lvl: "intermediate",
    q: "In a 100 m race A beats B by 20 m. How far has B run when A finishes?",
    o: ["80 m", "20 m", "75 m", "90 m"],
    a: 0,
    x: "'Beats by 20 m' means B is 20 m short of the line when A crosses it, so B has run **80 m**.",
    note: "'Beats by 20 m' and 'beats by 5 seconds' are different statements. The first gives you a distance ratio (100 : 80); the second gives you a time difference. Read carefully — the two are mixed constantly in the same paper."
  },
  {
    tag: "Races", lvl: "advanced",
    q: "In a 100 m race A beats B by 20 m, and B beats C by 25 m in the same race distance. By how much does A beat C?",
    o: ["40 m", "45 m", "35 m", "50 m"],
    a: 0,
    x: "When A runs 100, B runs 80. When B runs 100, C runs 75, so when B runs 80, C runs 60. A beats C by **40 m**.",
    steps: [
      "A : B = 100 : 80 = 5 : 4.",
      "B : C = 100 : 75 = 4 : 3.",
      "Chain them: A : B : C = 5 : 4 : 3 → when A runs 100, C runs 60.",
      "A beats C by 100 − 60 = **40 m**. Adding 20 + 25 = 45 is the trap; ratios compose, they do not add."
    ]
  },
  {
    tag: "Circular track", lvl: "advanced",
    q: "Two runners start together on a 400 m circular track at 8 m/s and 6 m/s, running in the same direction. After how long do they next meet?",
    o: ["200 seconds", "100 seconds", "50 seconds", "400 seconds"],
    a: 0,
    x: "Same direction → relative speed 2 m/s. To meet again the faster must gain a full lap: 400 ÷ 2 = **200 s**.",
    note: "Opposite directions instead? The relative speed becomes 14 m/s and they meet after 400/14 ≈ 28.6 s. Same track, same runners, entirely different answer."
  },
  {
    tag: "Time and work", lvl: "core",
    q: "A can finish a job in 10 days and B in 15 days. Working together, how long do they take?",
    o: ["6 days", "5 days", "12.5 days", "8 days"],
    a: 0,
    x: "Rates add: 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6, so **6 days**.",
    steps: [
      "Convert days into rate-per-day: A = 1/10, B = 1/15.",
      "Together = 1/10 + 1/15 = **1/6** of the job per day.",
      "Time = reciprocal = **6 days**.",
      "Faster still: take the LCM of 10 and 15 as the total work (30 units). A does 3 units/day, B does 2, together 5 → 30/5 = 6 days."
    ]
  },
  {
    tag: "Time and work", lvl: "intermediate",
    q: "A and B together finish a job in 8 days. A alone would take 12 days. How long would B alone take?",
    o: ["24 days", "20 days", "16 days", "18 days"],
    a: 0,
    x: "B's rate = 1/8 − 1/12 = 3/24 − 2/24 = 1/24, so B alone takes **24 days**.",
    steps: [
      "Take total work as 24 units (the LCM of 8 and 12).",
      "Together they do 24/8 = 3 units a day; A alone does 24/12 = 2.",
      "So B does 3 − 2 = **1 unit a day**.",
      "24 units ÷ 1 = **24 days**."
    ]
  },
  {
    tag: "Time and work", lvl: "core",
    q: "10 men complete a job in 12 days. How long would 15 men take, working at the same rate?",
    o: ["8 days", "10 days", "18 days", "6 days"],
    a: 0,
    x: "Men and days are inversely proportional: 10 × 12 = 15 × d, so d = **8 days**.",
    note: "The invariant is total man-days (120 here). Every 'more men, fewer days' question is one multiplication and one division around that constant."
  },
  {
    tag: "Time and work", lvl: "advanced",
    q: "A is twice as efficient as B, and together they finish a job in 12 days. How long would A alone take?",
    o: ["18 days", "24 days", "36 days", "16 days"],
    a: 0,
    x: "A : B efficiency = 2 : 1, so A does 2/3 of the combined rate. A alone = 12 × 3/2 = **18 days**.",
    steps: [
      "Let B do 1 unit a day; then A does 2, and together they do 3.",
      "In 12 days they complete 36 units, so the job is 36 units.",
      "A alone: 36 ÷ 2 = **18 days**.",
      "B alone would take 36 days — twice as long, exactly as the efficiency ratio says."
    ]
  },
  {
    tag: "Pipes", lvl: "core",
    q: "Pipe A fills a tank in 6 hours and pipe B in 8 hours. Opened together, how long do they take?",
    o: ["24/7 hours", "7 hours", "14 hours", "3 hours"],
    a: 0,
    x: "1/6 + 1/8 = 4/24 + 3/24 = 7/24, so the tank fills in **24/7 hours** (about 3 hours 26 minutes).",
    note: "Pipes are time-and-work with different nouns. The only new idea is that an outlet pipe has a negative rate."
  },
  {
    tag: "Pipes", lvl: "intermediate",
    q: "A pipe fills a tank in 4 hours; a leak at the bottom empties it in 6 hours. With both operating, how long does the tank take to fill?",
    o: ["12 hours", "10 hours", "24 hours", "2.4 hours"],
    a: 0,
    x: "Net rate = 1/4 − 1/6 = 3/12 − 2/12 = 1/12, so **12 hours**.",
    steps: [
      "Inlet rate = +1/4 per hour; leak rate = −1/6 per hour.",
      "Net = 1/4 − 1/6 = **1/12** per hour.",
      "Time = **12 hours**.",
      "If the leak were faster than the inlet the net would be negative — meaning the tank never fills, which is a valid answer some papers do use."
    ]
  },
  {
    tag: "Time and work", lvl: "advanced",
    q: "A can do a job in 15 days. He works for 5 days and then leaves; B finishes the remaining work in 8 days. How long would B alone take for the whole job?",
    o: ["12 days", "15 days", "10 days", "18 days"],
    a: 0,
    x: "A completes 5/15 = 1/3, leaving 2/3 for B. B does 2/3 in 8 days, so the whole job takes 8 × 3/2 = **12 days**.",
    steps: [
      "A's 5 days at 1/15 per day = **1/3** of the job.",
      "Remaining = 2/3, done by B in 8 days.",
      "B's rate = (2/3) ÷ 8 = 1/12 per day.",
      "B alone = **12 days**."
    ]
  },
  {
    tag: "Trains", lvl: "advanced",
    q: "A train passes a man standing on a platform in 8 seconds and passes the 264 m platform itself in 20 seconds. How long is the train?",
    o: ["176 m", "220 m", "264 m", "150 m"],
    a: 0,
    x: "Let the length be L and the speed v. L = 8v and L + 264 = 20v, so 12v = 264 → v = 22 m/s and L = **176 m**.",
    steps: [
      "Passing a man covers the train's own length: L = 8v.",
      "Passing the platform covers L + 264 = 20v.",
      "Subtract: 264 = 12v → v = **22 m/s**.",
      "L = 8 × 22 = **176 m**."
    ]
  },
  {
    tag: "Speed", lvl: "intermediate",
    q: "A journey of 300 km is covered partly at 60 km/h and partly at 40 km/h, taking 6 hours in total. How far was covered at 60 km/h?",
    o: ["180 km", "120 km", "150 km", "200 km"],
    a: 0,
    x: "If x km is at 60, then x/60 + (300 − x)/40 = 6. Solving gives x = **180 km**.",
    steps: [
      "x/60 + (300 − x)/40 = 6.",
      "Multiply through by 120: 2x + 3(300 − x) = 720.",
      "2x + 900 − 3x = 720 → −x = −180 → x = **180**.",
      "Check: 180/60 = 3 h and 120/40 = 3 h, total 6 ✓"
    ]
  },
  {
    tag: "Time and work", lvl: "intermediate",
    q: "A, B and C can do a job in 20, 30 and 60 days respectively. Working together, how long do they take?",
    o: ["10 days", "12 days", "15 days", "8 days"],
    a: 0,
    x: "Take the job as 60 units: rates are 3, 2 and 1 units a day, totalling 6. 60 ÷ 6 = **10 days**.",
    note: "Using the LCM of the times as the total work turns every fraction into a whole number. It is the single biggest speed gain available in this chapter."
  },
  {
    tag: "Wages", lvl: "advanced",
    q: "A and B complete a job together and are paid ₹3000. A alone would take 12 days, B alone 24 days. What is A's share?",
    o: ["₹2000", "₹1500", "₹1800", "₹2400"],
    a: 0,
    x: "Pay follows work done, which follows rate: A : B = 1/12 : 1/24 = 2 : 1. A's share = 2/3 × 3000 = **₹2000**.",
    steps: [
      "Rates: A = 1/12, B = 1/24.",
      "Ratio of rates = 2 : 1 — invert the days, do not use them directly.",
      "A gets 2/3 of 3000 = **2000**; B gets 1000.",
      "Splitting 12 : 24 instead of 2 : 1 is the standard error and reverses the answer."
    ]
  },
  {
    tag: "Boats", lvl: "advanced",
    q: "A man can row 6 km/h in still water. It takes him twice as long to row upstream as downstream. What is the speed of the stream?",
    o: ["2 km/h", "3 km/h", "1.5 km/h", "4 km/h"],
    a: 0,
    x: "Twice the time means half the speed: upstream = ½ × downstream. With 6 − s = ½(6 + s), we get 12 − 2s = 6 + s → s = **2 km/h**.",
    steps: [
      "Same distance, so time ∝ 1/speed. Twice the time = half the speed.",
      "6 − s = (6 + s)/2.",
      "12 − 2s = 6 + s → 6 = 3s → s = **2 km/h**.",
      "Check: downstream 8, upstream 4 — exactly double the time ✓"
    ]
  },
  {
    tag: "Units", lvl: "core",
    q: "A man walks 600 m in 5 minutes. What is his speed in km/h?",
    o: ["7.2 km/h", "6 km/h", "12 km/h", "5 km/h"],
    a: 0,
    x: "600 m in 300 s = 2 m/s, and 2 × 18/5 = **7.2 km/h**."
  },
  {
    tag: "Trains", lvl: "intermediate",
    q: "Two trains start at the same time from stations 200 km apart and travel towards each other at 50 km/h and 30 km/h. How far from the faster train's start do they meet?",
    o: ["125 km", "100 km", "150 km", "80 km"],
    a: 0,
    x: "They meet after 200 ÷ 80 = 2.5 hours. The faster train has covered 50 × 2.5 = **125 km**.",
    steps: [
      "Combined closing speed = 50 + 30 = 80 km/h.",
      "Time to meet = 200/80 = **2.5 hours**.",
      "Faster train covers 50 × 2.5 = **125 km**.",
      "Check: slower covers 75 km, and 125 + 75 = 200 ✓"
    ]
  },
  {
    tag: "Time and work", lvl: "advanced",
    q: "12 men or 18 women can complete a job in 14 days. How long would 8 men and 16 women take?",
    o: ["9 days", "12 days", "10 days", "8 days"],
    a: 0,
    x: "12 men = 18 women, so 1 man = 1.5 women. 8 men + 16 women = 12 + 16 = 28 women. 18 women take 14 days, so 28 take 18 × 14 / 28 = **9 days**.",
    steps: [
      "Convert everything to one unit. 12 men ≡ 18 women, so 1 man ≡ 1.5 women.",
      "8 men ≡ 12 women. Adding the 16 women gives **28 women**.",
      "Woman-days for the job = 18 × 14 = 252.",
      "252 ÷ 28 = **9 days**."
    ]
  },
  {
    tag: "Speed", lvl: "advanced",
    q: "Running at 45 km/h a train arrives 12 minutes late. Running at 60 km/h it would arrive exactly on time. How long is the journey?",
    o: ["36 km", "45 km", "30 km", "48 km"],
    a: 0,
    x: "d/45 − d/60 = 12 minutes = 1/5 hour. Since 1/45 − 1/60 = 1/180, we get d/180 = 1/5 → d = **36 km**.",
    steps: [
      "The lateness is the *difference* between the two journey times: 12 min = 1/5 hour.",
      "d/45 − d/60 = 1/5.",
      "1/45 − 1/60 = (4 − 3)/180 = 1/180, so d/180 = 1/5.",
      "d = **36 km**. Check: 36/45 = 48 min and 36/60 = 36 min — a difference of 12 ✓"
    ]
  },
  {
    tag: "Pipes", lvl: "advanced",
    q: "Two pipes fill a tank in 20 and 30 minutes respectively. Both are opened together, but the first is closed after 5 minutes. How much longer does the tank take to fill?",
    o: ["17.5 minutes", "20 minutes", "15 minutes", "22.5 minutes"],
    a: 0,
    x: "In 5 minutes together they fill 5 × (1/20 + 1/30) = 5/12. The remaining 7/12, at the second pipe's rate of 1/30 per minute, takes (7/12) × 30 = **17.5 minutes**.",
    steps: [
      "Combined rate = 1/20 + 1/30 = 3/60 + 2/60 = **1/12** per minute.",
      "In 5 minutes: 5 × 1/12 = **5/12** of the tank.",
      "Remaining = 7/12, now filled by the second pipe alone at 1/30 per minute.",
      "(7/12) ÷ (1/30) = (7/12) × 30 = **17.5 minutes**."
    ],
    note: "Note what the question asks: *how much longer*, not the total time. The total is 5 + 17.5 = 22.5 minutes, which is offered as a choice — misreading the question, not the arithmetic, is what loses this mark."
  },
  {
    tag: "Average speed", lvl: "advanced",
    q: "A man covers one-third of a journey at 20 km/h and the rest at 40 km/h. What is his average speed?",
    o: ["30 km/h", "32 km/h", "26.67 km/h", "35 km/h"],
    a: 0,
    x: "Take the journey as 120 km: 40 km at 20 km/h takes 2 h, and 80 km at 40 km/h takes 2 h. 120 km in 4 h = **30 km/h**.",
    steps: [
      "Pick a distance divisible by everything: 120 km.",
      "First third = 40 km at 20 km/h → 2 hours.",
      "Rest = 80 km at 40 km/h → 2 hours.",
      "Average = 120/4 = **30 km/h**. Never average the speeds themselves — always total distance over total time."
    ]
  }

]);


TD.addMCQ("aptitude", "algebra", [

  {
    tag: "Identities", lvl: "intermediate",
    q: "If x + 1/x = 3, what is x² + 1/x²?",
    o: ["7", "9", "11", "6"],
    a: 0,
    x: "Square both sides: (x + 1/x)² = x² + 2 + 1/x² = 9, so x² + 1/x² = **7**.",
    steps: [
      "(x + 1/x)² = x² + 2·x·(1/x) + 1/x² = x² + 2 + 1/x².",
      "So 3² = x² + 1/x² + 2.",
      "x² + 1/x² = 9 − 2 = **7**.",
      "The middle term is always exactly 2, which is what makes this family of questions instant."
    ]
  },
  {
    tag: "Identities", lvl: "advanced",
    q: "If x + 1/x = 3, what is x³ + 1/x³?",
    o: ["18", "27", "21", "24"],
    a: 0,
    x: "(x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x), so 27 = X + 9, giving X = **18**.",
    steps: [
      "Cube the given: (x + 1/x)³ = x³ + 3x + 3/x + 1/x³.",
      "Group: = x³ + 1/x³ + 3(x + 1/x).",
      "27 = X + 3(3) = X + 9.",
      "X = **18**."
    ]
  },
  {
    tag: "Identities", lvl: "core",
    q: "If a + b = 10 and ab = 21, what is a² + b²?",
    o: ["58", "62", "79", "46"],
    a: 0,
    x: "a² + b² = (a + b)² − 2ab = 100 − 42 = **58**."
  },
  {
    tag: "Identities", lvl: "core",
    q: "(a + b)² − (a − b)² equals:",
    o: ["4ab", "2ab", "2a² + 2b²", "a² − b²"],
    a: 0,
    x: "(a² + 2ab + b²) − (a² − 2ab + b²) = **4ab**.",
    note: "The three identities that cover most of this chapter: (a±b)² = a² ± 2ab + b²; a² − b² = (a+b)(a−b); a³ ± b³ = (a ± b)(a² ∓ ab + b²)."
  },
  {
    tag: "Quadratics", lvl: "core",
    q: "What are the roots of x² − 5x + 6 = 0?",
    o: ["2 and 3", "−2 and −3", "1 and 6", "−1 and −6"],
    a: 0,
    x: "Two numbers that add to 5 and multiply to 6: **2 and 3**.",
    steps: [
      "For x² + bx + c, look for two numbers summing to −b and multiplying to c.",
      "Sum 5, product 6 → 2 and 3.",
      "x² − 5x + 6 = (x − 2)(x − 3).",
      "Roots are **2 and 3**."
    ]
  },
  {
    tag: "Quadratics", lvl: "core",
    q: "For 2x² − 7x + 3 = 0, what is the sum of the roots?",
    o: ["7/2", "3/2", "−7/2", "7"],
    a: 0,
    x: "Sum of roots = −b/a = 7/2 = **3.5**.",
    note: "Sum = −b/a and product = c/a. These two identities answer most quadratic questions without ever finding a root."
  },
  {
    tag: "Quadratics", lvl: "core",
    q: "For 2x² − 7x + 3 = 0, what is the product of the roots?",
    o: ["3/2", "7/2", "3", "2/3"],
    a: 0,
    x: "Product of roots = c/a = **3/2**."
  },
  {
    tag: "Quadratics", lvl: "intermediate",
    q: "How many real roots does x² + 4x + 5 = 0 have?",
    o: ["None", "One", "Two", "Infinitely many"],
    a: 0,
    x: "Discriminant = b² − 4ac = 16 − 20 = −4. A negative discriminant means **no real roots**.",
    steps: [
      "D = b² − 4ac = 4² − 4(1)(5) = 16 − 20 = **−4**.",
      "D > 0 → two distinct real roots.",
      "D = 0 → one repeated real root.",
      "D < 0 → **no real roots** (the two roots are complex)."
    ]
  },
  {
    tag: "Quadratics", lvl: "intermediate",
    q: "If x = 2 is a root of x² − 5x + k = 0, what is k?",
    o: ["6", "4", "10", "−6"],
    a: 0,
    x: "Substitute: 4 − 10 + k = 0, so k = **6**.",
    note: "'Is a root of' always means 'substitute and the equation holds'. It converts a hard-looking question into one substitution."
  },
  {
    tag: "Quadratics", lvl: "intermediate",
    q: "Which quadratic equation has roots 3 and −2?",
    o: ["x² − x − 6 = 0", "x² + x − 6 = 0", "x² − x + 6 = 0", "x² − 5x + 6 = 0"],
    a: 0,
    x: "Sum = 1, product = −6. The equation is x² − (sum)x + product = **x² − x − 6 = 0**."
  },
  {
    tag: "Linear equations", lvl: "core",
    q: "Solve: 2x + 3y = 12 and x − y = 1.",
    o: ["x = 3, y = 2", "x = 2, y = 3", "x = 4, y = 3", "x = 5, y = 4"],
    a: 0,
    x: "From the second, x = y + 1. Substituting: 2(y+1) + 3y = 12 → 5y = 10 → y = 2, x = **3**.",
    steps: [
      "x = y + 1 from the simpler equation.",
      "2(y + 1) + 3y = 12 → 2y + 2 + 3y = 12.",
      "5y = 10 → y = 2 → x = **3**.",
      "Check both: 2(3) + 3(2) = 12 ✓ and 3 − 2 = 1 ✓. Always substitute back — it costs five seconds and catches sign errors."
    ]
  },
  {
    tag: "Inequalities", lvl: "core",
    q: "Solve 3x − 5 < 7.",
    o: ["x < 4", "x > 4", "x < 12", "x ≤ 4"],
    a: 0,
    x: "3x < 12, so **x < 4**.",
    note: "The one rule that catches people: multiplying or dividing an inequality by a negative number reverses the sign. −2x < 6 gives x > −3, not x < −3."
  },
  {
    tag: "Inequalities", lvl: "intermediate",
    q: "Solve |x − 3| < 2.",
    o: ["1 < x < 5", "x < 5", "x > 1", "−1 < x < 5"],
    a: 0,
    x: "|x − 3| < 2 means −2 < x − 3 < 2, so **1 < x < 5**.",
    steps: [
      "|A| < k unwraps to −k < A < k.",
      "−2 < x − 3 < 2.",
      "Add 3 throughout: **1 < x < 5**.",
      "The mirror case: |A| > k splits into A < −k **or** A > k — two intervals, not one."
    ]
  },
  {
    tag: "Progressions", lvl: "core",
    q: "What is the 20th term of the arithmetic progression 3, 7, 11, …?",
    o: ["79", "83", "76", "80"],
    a: 0,
    x: "a = 3, d = 4. The nth term is a + (n−1)d = 3 + 19 × 4 = **79**.",
    note: "The commonest slip is using n rather than n−1. The first term takes no steps, so the twentieth takes nineteen."
  },
  {
    tag: "Progressions", lvl: "intermediate",
    q: "What is the sum of the first 20 terms of the AP 3, 7, 11, …?",
    o: ["820", "800", "790", "840"],
    a: 0,
    x: "S = n/2 [2a + (n−1)d] = 10 [6 + 76] = **820**.",
    steps: [
      "S = n/2 × (first + last).",
      "The 20th term is 79, so S = 10 × (3 + 79) = 10 × 82.",
      "= **820**.",
      "Sum = (number of terms) × (average of first and last) is the version worth remembering — it works for every evenly spaced list."
    ]
  },
  {
    tag: "Progressions", lvl: "intermediate",
    q: "How many terms are there in the AP 5, 9, 13, …, 101?",
    o: ["25", "24", "26", "20"],
    a: 0,
    x: "n = (last − first)/d + 1 = (101 − 5)/4 + 1 = 24 + 1 = **25**.",
    note: "The `+ 1` is the fencepost: counting the gaps gives 24, and there is always one more post than gap."
  },
  {
    tag: "Progressions", lvl: "intermediate",
    q: "What is the 6th term of the geometric progression 2, 6, 18, …?",
    o: ["486", "162", "1458", "216"],
    a: 0,
    x: "a = 2, r = 3. The nth term is ar^(n−1) = 2 × 3⁵ = 2 × 243 = **486**."
  },
  {
    tag: "Progressions", lvl: "advanced",
    q: "What is the sum of the infinite geometric series 1 + ½ + ¼ + ⅛ + …?",
    o: ["2", "1.5", "Infinite", "2.5"],
    a: 0,
    x: "For |r| < 1 the sum is a/(1 − r) = 1/(1 − ½) = **2**.",
    note: "The condition matters: with |r| ≥ 1 the series has no finite sum. A question offering 'infinite' as a choice is usually testing exactly that."
  },
  {
    tag: "Progressions", lvl: "core",
    q: "What is the arithmetic mean of 8 and 20?",
    o: ["14", "12", "16", "10"],
    a: 0,
    x: "(8 + 20)/2 = **14**."
  },
  {
    tag: "Logarithms", lvl: "core",
    q: "What is log₂ 32?",
    o: ["5", "4", "6", "16"],
    a: 0,
    x: "2⁵ = 32, so log₂ 32 = **5**.",
    note: "A logarithm answers one question only: *what power?* Reading log₂ 32 as 'two to the what makes 32' removes almost all the difficulty from this topic."
  },
  {
    tag: "Logarithms", lvl: "core",
    q: "If log₃ x = 4, what is x?",
    o: ["81", "12", "64", "27"],
    a: 0,
    x: "x = 3⁴ = **81**."
  },
  {
    tag: "Logarithms", lvl: "intermediate",
    q: "log(ab) is equal to:",
    o: ["log a + log b", "log a × log b", "log a − log b", "(log a)(log b)"],
    a: 0,
    x: "Logarithms turn multiplication into addition: log(ab) = **log a + log b**.",
    note: "The full set: log(ab) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n log a. There is no rule for log(a + b) — that is a favourite trap."
  },
  {
    tag: "Logarithms", lvl: "intermediate",
    q: "What is log₁₀ 100 + log₁₀ 1000?",
    o: ["5", "6", "100000", "23"],
    a: 0,
    x: "2 + 3 = **5**. (Equivalently, log₁₀(100 × 1000) = log₁₀ 10⁵ = 5.)"
  },
  {
    tag: "Indices", lvl: "core",
    q: "If 2ˣ = 32, what is x?",
    o: ["5", "6", "4", "16"],
    a: 0,
    x: "32 = 2⁵, so x = **5**."
  },
  {
    tag: "Simplification", lvl: "core",
    q: "Simplify (x² − 9)/(x − 3), for x ≠ 3.",
    o: ["x + 3", "x − 3", "x² − 3", "3"],
    a: 0,
    x: "x² − 9 = (x + 3)(x − 3), and the (x − 3) cancels, leaving **x + 3**.",
    note: "Spotting a difference of two squares is worth more in a timed test than any other factorisation. Look for it whenever you see a subtraction of two terms."
  },
  {
    tag: "Equations", lvl: "core",
    q: "Solve √(x + 7) = 4.",
    o: ["9", "16", "3", "23"],
    a: 0,
    x: "Square both sides: x + 7 = 16, so x = **9**.",
    note: "Always substitute back into the original when you have squared: squaring can introduce roots that do not satisfy the equation you started with."
  },
  {
    tag: "Functions", lvl: "core",
    q: "If f(x) = 2x + 3, what is f(4)?",
    o: ["11", "14", "8", "10"],
    a: 0,
    x: "2(4) + 3 = **11**."
  },
  {
    tag: "Functions", lvl: "intermediate",
    q: "If f(x) = 2x + 1 and g(x) = x², what is f(g(3))?",
    o: ["19", "49", "37", "13"],
    a: 0,
    x: "g(3) = 9, then f(9) = 2(9) + 1 = **19**.",
    steps: [
      "Work from the inside out: g(3) = 3² = **9**.",
      "Then f(9) = 2 × 9 + 1 = **19**.",
      "The other order, g(f(3)) = g(7) = 49, is a different number — composition is not commutative.",
      "Both values are offered here, which is exactly what a real paper does."
    ]
  },
  {
    tag: "Ratio algebra", lvl: "intermediate",
    q: "If a : b = 3 : 4 and b : c = 2 : 5, what is a : c?",
    o: ["3 : 10", "3 : 5", "6 : 5", "5 : 6"],
    a: 0,
    x: "a/c = (a/b)(b/c) = (3/4)(2/5) = 6/20 = **3 : 10**.",
    steps: [
      "Multiply the chained ratios as fractions.",
      "(3/4) × (2/5) = 6/20.",
      "Reduce: **3 : 10**.",
      "Alternatively make b common: a : b = 3 : 4 and b : c = 2 : 5 → scale to b = 4, giving b : c = 4 : 10, so a : c = 3 : 10 ✓"
    ]
  },
  {
    tag: "Word problems", lvl: "intermediate",
    q: "The sum of two numbers is 25 and their difference is 7. What is the larger number?",
    o: ["16", "18", "15", "17"],
    a: 0,
    x: "Larger = (sum + difference)/2 = (25 + 7)/2 = **16**.",
    note: "Half the sum plus half the difference gives the larger; half the sum minus half the difference gives the smaller. It is faster than setting up two equations and never goes wrong."
  },
  {
    tag: "Word problems", lvl: "advanced",
    q: "A father is three times as old as his son. In 12 years he will be twice as old. How old is the son now?",
    o: ["12", "10", "14", "15"],
    a: 0,
    x: "3s + 12 = 2(s + 12) → 3s + 12 = 2s + 24 → s = **12**.",
    steps: [
      "Let the son be s, so the father is 3s.",
      "In 12 years: father = 3s + 12, son = s + 12.",
      "3s + 12 = 2(s + 12) → 3s + 12 = 2s + 24.",
      "s = **12**. Check: father is 36 now; in 12 years 48 and 24 — exactly double ✓"
    ]
  },
  {
    tag: "Substitution", lvl: "advanced",
    q: "What is the fastest reliable way to attack an algebra multiple-choice question full of variables and no numbers?",
    o: [
      "Substitute a small convenient number for each variable and test the options",
      "Solve it symbolically from first principles",
      "Eliminate options that look complicated",
      "Work backwards from the middle option"
    ],
    a: 0,
    x: "Substituting turns symbol manipulation into arithmetic, and only one option will survive a well-chosen value.",
    steps: [
      "Pick values that are small, distinct and avoid 0 and 1 (both hide errors).",
      "Compute the stem's value.",
      "Test every option with the same values and keep those that match.",
      "If two survive, run a second set of values. This almost never needs a third."
    ]
  }

]);
