/* Aptitude — time, speed, distance and work. */
TD.addLessons("aptitude", [

  {
    t: "Time, Speed and Distance — relative motion, trains, boats",
    m: "tsd",
    lvl: "core",
    s: "Unit conversion, the proportionality that removes most algebra, relative speed in both directions, and the train and stream questions built on it.",
    goal: [
      "Convert units and switch between the three quantities without hesitation",
      "Use inverse proportion to answer *same distance* questions with no equations",
      "Set up any train, boat or two-body question by choosing the right relative speed"
    ],
    b: [
      { p: "One relation, three questions. Distance = speed × time is the whole topic, and every named variant — trains, boats, races, circular tracks — is that relation with one decision attached: **what is moving relative to what**." },

      {
        code: {
          lang: "text", t: "The base, and the conversion you will use most",
          lines: [
            { c: "d = s x t        s = d/t        t = d/s", w: "" },
            { c: "", w: "" },
            { c: "km/h -> m/s :  multiply by 5/18", w: "**72 km/h = 72 x 5/18 = 20 m/s.**", hi: true },
            { c: "m/s -> km/h :  multiply by 18/5", w: "10 m/s = 36 km/h." },
            { c: "", w: "" },
            { c: "Useful anchors:  18 km/h = 5 m/s,  36 = 10,  54 = 15,  72 = 20", w: "Memorise these four and most conversions become a glance.", hi: true },
            { c: "", w: "" },
            { c: "Mixed units are the top source of wrong answers here.", w: "" },
            { c: "Convert everything the moment you read the question.", w: "Before any working, not during it." }
          ]
        }
      },

      { h: "The proportionality that kills the algebra" },

      { p: "Most questions hold one of the three quantities fixed. When they do, the other two are in fixed proportion, and the answer is a ratio away." },

      {
        tbl: {
          t: "Which quantity is fixed decides the whole approach",
          h: ["Held constant", "Relationship", "Reading"],
          rows: [
            ["**Distance**", "speed ∝ 1/time", "Speeds in ratio 3:4 ⇒ times in ratio 4:3. The most-used line in the topic"],
            ["**Time**", "distance ∝ speed", "Twice as fast covers twice the ground"],
            ["**Speed**", "distance ∝ time", "Trivial, and rarely the question"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "The classic 'late by / early by' question, without algebra",
          lines: [
            { c: "Walking at 5 km/h a man reaches office 6 minutes late.", w: "" },
            { c: "At 6 km/h he is 2 minutes early. Find the distance.", w: "" },
            { c: "", w: "" },
            { c: "Same distance, so time is inversely proportional to speed.", w: "" },
            { c: "speeds 5 : 6   ->   times 6 : 5", w: "**One line of setup.**", hi: true },
            { c: "", w: "" },
            { c: "The difference of one part corresponds to 6 + 2 = 8 minutes.", w: "Late by 6 and early by 2 is an 8-minute gap between the two journeys.", hi: true },
            { c: "So the times are 48 and 40 minutes.", w: "6 parts and 5 parts, one part being 8 minutes." },
            { c: "", w: "" },
            { c: "distance = 5 km/h x 48/60 h = 4 km", w: "Check with the other: 6 x 40/60 = 4 km. Agrees." }
          ]
        }
      },

      { h: "Average speed — never the average of the speeds" },

      {
        code: {
          lang: "text", t: "The three cases, and the one that is asked",
          lines: [
            { c: "average speed = total distance / total time.   Always.", w: "**Everything below is a special case of this line.**", hi: true },
            { c: "", w: "" },
            { c: "Equal DISTANCES at speeds a and b:", w: "" },
            { c: "  average = 2ab / (a + b)          the harmonic mean", w: "60 and 40 give 2x60x40/100 = 48, not 50.", hi: true },
            { c: "", w: "" },
            { c: "Equal TIMES at speeds a and b:", w: "" },
            { c: "  average = (a + b) / 2            the ordinary mean", w: "This is the only case where averaging the speeds is right." },
            { c: "", w: "" },
            { c: "Three equal distances at a, b, c:", w: "" },
            { c: "  average = 3abc / (ab + bc + ca)", w: "Same harmonic idea extended." }
          ]
        }
      },

      { trap: "The default assumption in this topic is **equal distances**, because *goes there at 60 and returns at 40* is the standard wording — and the answer is the harmonic mean, always lower than the arithmetic one. If a question says *drives for 2 hours at 60 and 3 hours at 40*, that is equal times per hour and you must weight by time instead. Read for *distance* versus *hours* before choosing." },

      { h: "Relative speed: the one decision" },

      {
        tbl: {
          t: "Two bodies, two cases",
          h: ["Situation", "Relative speed", "Typical question"],
          rows: [
            ["**Opposite directions** (approaching or crossing)", "**a + b**", "Two trains crossing; two people walking toward each other"],
            ["**Same direction** (overtaking or chasing)", "**a − b**", "A train overtaking another; a thief and a policeman"],
            ["Boat **downstream**", "boat + stream", "The stream helps"],
            ["Boat **upstream**", "boat − stream", "The stream fights"],
            ["Escalator, walking with it", "walk + escalator", "Same structure as a stream"]
          ]
        }
      },

      { h: "Trains" },

      { p: "The only thing that makes a train question different from a point-object question is that a train has **length**, and that length is part of the distance covered." },

      {
        code: {
          lang: "text", t: "What distance does the train actually cover?",
          lines: [
            { c: "Crossing a POLE or a standing person:", w: "" },
            { c: "  distance = length of the train", w: "The pole has no length.", hi: true },
            { c: "", w: "" },
            { c: "Crossing a PLATFORM or a bridge or a tunnel:", w: "" },
            { c: "  distance = train length + platform length", w: "**The most-forgotten line in the topic.**", hi: true },
            { c: "", w: "" },
            { c: "Crossing another TRAIN:", w: "" },
            { c: "  distance = sum of both lengths", w: "" },
            { c: "  speed    = sum if opposite, difference if same direction", w: "Two decisions, both easy to reverse under time pressure." },
            { c: "", w: "" },
            { c: "Crossing a MOVING person or a cyclist:", w: "" },
            { c: "  distance = train length only", w: "" },
            { c: "  speed    = relative speed of train and person", w: "The person has length zero but non-zero speed." }
          ]
        }
      },

      {
        code: {
          lang: "text", t: "A worked train question",
          lines: [
            { c: "A 180 m train at 54 km/h crosses a platform in 20 s.", w: "" },
            { c: "Find the platform length.", w: "" },
            { c: "", w: "" },
            { c: "54 km/h = 54 x 5/18 = 15 m/s", w: "Convert immediately.", hi: true },
            { c: "distance covered = 15 x 20 = 300 m", w: "" },
            { c: "platform = 300 - 180 = 120 m", w: "The train's own length is subtracted out." }
          ]
        }
      },

      { h: "Boats and streams" },

      {
        code: {
          lang: "text", t: "Two speeds recovered from two timings",
          lines: [
            { c: "downstream speed  D = b + s", w: "" },
            { c: "upstream speed    U = b - s", w: "" },
            { c: "", w: "" },
            { c: "so  b = (D + U)/2      and      s = (D - U)/2", w: "**Add and halve for the boat, subtract and halve for the stream.**", hi: true },
            { c: "", w: "" },
            { c: "A boat goes 24 km downstream in 2 h and returns in 3 h.", w: "" },
            { c: "  D = 12,  U = 8", w: "" },
            { c: "  boat in still water = 10 km/h,  stream = 2 km/h", w: "" },
            { c: "", w: "" },
            { c: "If a boat takes k times as long upstream as downstream:", w: "" },
            { c: "  b : s = (k + 1) : (k - 1)", w: "Twice as long upstream gives b : s = 3 : 1.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Three shapes, three routes",
          task: "(a) A train 150 m long passes a man walking at 6 km/h in the same direction in 10 seconds. Find the train's speed. (b) A car covers a distance at 40 km/h and returns at 60 km/h. Find its average speed. (c) A boat's speed in still water is 15 km/h and the stream is 3 km/h. How long to go 36 km downstream and return?",
          hint: "(a) same direction means subtract, and only the train's length counts. (b) equal distances. (c) two different speeds, two different times.",
          sol: { lang: "text", code: "(a) relative speed = 150 m / 10 s = 15 m/s = 54 km/h\n    that is (train - 6), so the train runs at 60 km/h\n\n(b) equal distances -> harmonic mean\n    2 x 40 x 60 / (40 + 60) = 4800/100 = 48 km/h\n\n(c) downstream 18 km/h -> 36/18 = 2 h\n    upstream   12 km/h -> 36/12 = 3 h\n    total 5 hours  (average speed 72/5 = 14.4 km/h, not 15)" },
          w: "Notice (c) ends with the same lesson as (b): the round trip averages *below* the still-water speed, because more time is spent at the slower speed. Anyone who answers 15 km/h has averaged the speeds instead of the time."
        }
      }
    ],
    k: [
      "km/h to m/s is ×5/18. Convert before any working, never during.",
      "Same distance ⇒ speed and time are inversely proportional. Ratios beat algebra.",
      "Average speed is total distance over total time — never the average of the speeds.",
      "Equal distances give the harmonic mean 2ab/(a+b); equal times give (a+b)/2.",
      "Opposite directions add speeds; same direction subtracts them.",
      "Crossing a platform covers train length PLUS platform length.",
      "Boat = (D+U)/2, stream = (D−U)/2."
    ],
    r: ["Statistics"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "km/h to m/s: multiply by 5/18", w: "the conversion every question needs" },
        { c: "equal distances: average = 2ab/(a+b)", w: "the harmonic mean, not the arithmetic one" },
        { c: "boat = (D+U)/2, stream = (D-U)/2", w: "recovering both speeds from two timings" }
      ]
    }
  },

  {
    t: "Races, Circular Tracks and Two-Body Motion",
    m: "tsd",
    lvl: "intermediate",
    s: "Head starts, beats-by-a-distance, meeting points on a circular track, and the first-meeting-at-the-start-point formulas.",
    goal: [
      "Translate race wording — *gives a start of*, *beats by* — into equations",
      "Count meeting points on a circular track for both directions",
      "Handle clock-style repeated-meeting questions with the LCM method"
    ],
    b: [
      { p: "Races and circular tracks are where relative speed stops being a formula and becomes a picture. Almost every mistake here is a wording mistake, not an arithmetic one, so this lesson starts with the vocabulary." },

      { h: "Race wording, decoded" },

      {
        tbl: {
          t: "What each phrase actually means",
          h: ["Phrase", "Meaning", "Equation"],
          rows: [
            ["*A gives B a start of 20 m* (in a 100 m race)", "B starts 20 m ahead, so B runs 80 m while A runs 100", "Both finish together ⇒ A:B speeds = 100:80"],
            ["*A beats B by 20 m*", "When A finishes 100 m, B has done 80 m", "Same ratio, different framing"],
            ["*A beats B by 5 seconds*", "B takes 5 s longer over the same distance", "t_B − t_A = 5"],
            ["*A gives B a start of 5 seconds*", "B leaves 5 s earlier", "A's running time is 5 s less"],
            ["*The race ends in a dead heat*", "They finish together", "Times equal"],
            ["*A beats B by 20 m and C by 28 m; B beats C by …*", "Chain the ratios through A", "Compute over the same race distance"]
          ]
        }
      },

      { n: "*Beats by 20 m* and *gives a start of 20 m* produce the same speed ratio but different race setups. In a *start*, both cross the same finish line after covering different distances. In a *beat*, only the winner reaches the line. Read which one it is; if both appear in one question, they are testing exactly this.", nt: "Start versus beat" },

      {
        code: {
          lang: "text", t: "Chaining three runners",
          lines: [
            { c: "In a 100 m race A beats B by 10 m and B beats C by 10 m.", w: "" },
            { c: "By how much does A beat C?", w: "" },
            { c: "", w: "" },
            { c: "When A does 100, B does 90.   A : B = 100 : 90", w: "" },
            { c: "When B does 100, C does 90.   B : C = 100 : 90", w: "" },
            { c: "", w: "" },
            { c: "So when B does 90, C does 81.", w: "**Scale B's row down to match, do not add the two gaps.**", hi: true },
            { c: "A beats C by 100 - 81 = 19 m,  not 20 m.", w: "The intuitive answer of 20 is the trap the question is built around.", hi: true }
          ]
        }
      },

      { h: "Circular tracks: two bodies from the same point" },

      {
        tbl: {
          t: "The four results worth knowing",
          h: ["Question", "Opposite directions", "Same direction"],
          rows: [
            ["Time to **first meet** anywhere", "L/(a + b)", "L/(a − b)"],
            ["Time to **first meet at the starting point**", "LCM of L/a and L/b", "LCM of L/a and L/b"],
            ["Number of **distinct meeting points**", "a + b (after reducing a:b to lowest terms)", "a − b (same reduction)"],
            ["Meetings in one full lap of the slower runner", "Depends on speed ratio", "Depends on speed ratio"]
          ]
        }
      },

      { n: "The meeting-points count uses the **reduced** speed ratio. If a : b = 6 : 4, reduce to 3 : 2 first — then opposite directions give 3 + 2 = 5 distinct meeting points and the same direction gives 3 − 2 = 1. Forgetting to reduce is the standard error and it produces an answer that is always a multiple of the truth.", nt: "Reduce the ratio first" },

      {
        code: {
          lang: "text", t: "A full circular-track question",
          lines: [
            { c: "A 600 m circular track. P runs at 5 m/s, Q at 3 m/s,", w: "" },
            { c: "both starting together from the same point.", w: "" },
            { c: "", w: "" },
            { c: "Opposite directions, first meeting:  600/(5+3) = 75 s", w: "" },
            { c: "Same direction,     first meeting:  600/(5-3) = 300 s", w: "The gap must grow to a full lap before an overtake.", hi: true },
            { c: "", w: "" },
            { c: "First meeting AT THE START point:", w: "" },
            { c: "  P's lap time = 600/5 = 120 s", w: "" },
            { c: "  Q's lap time = 600/3 = 200 s", w: "" },
            { c: "  LCM(120, 200) = 600 s", w: "**Both must be at the start simultaneously, so LCM of lap times.**", hi: true },
            { c: "  Same answer whichever direction they run.", w: "Direction changes where they meet, never when they are both home." },
            { c: "", w: "" },
            { c: "Distinct meeting points, opposite:  5:3 is already reduced -> 8", w: "" },
            { c: "Distinct meeting points, same:      5 - 3 = 2", w: "" }
          ]
        }
      },

      { h: "Three bodies" },

      { p: "With three runners, the first meeting of all three is the LCM of the pairwise first-meeting times. Take the pairs, compute each pairwise meeting time, then LCM them. It is more arithmetic than insight, but it is the whole method, and a question that mentions three runners is signalling that you should use it." },

      { h: "The escalator variant" },

      {
        code: {
          lang: "text", t: "Escalators are streams with steps",
          lines: [
            { c: "A man takes 30 steps to walk down a moving down-escalator,", w: "" },
            { c: "and 60 steps to walk up the same escalator.", w: "" },
            { c: "His walking speed is the same both ways.", w: "" },
            { c: "", w: "" },
            { c: "Going down, the escalator HELPS: he takes fewer steps.", w: "" },
            { c: "Going up, it FIGHTS: he takes more.", w: "**Identical structure to downstream and upstream.**", hi: true },
            { c: "", w: "" },
            { c: "Work in steps rather than metres and the algebra is the", w: "" },
            { c: "same as boats: effective rate = man +/- escalator.", w: "Count in the unit the question counts in." }
          ]
        }
      },

      {
        tryit: {
          t: "Two races and a track",
          task: "(a) In a 200 m race A beats B by 20 m. If B is given a 20 m head start in the same race, who wins and by how much? (b) On a 400 m circular track, X and Y run at 8 m/s and 6 m/s in opposite directions. When do they first meet, and at how many distinct points do they ever meet?",
          hint: "(a) find the speed ratio, then re-run the race with the new distances. (b) reduce the speed ratio before counting points.",
          sol: { lang: "text", code: "(a) A : B speeds = 200 : 180 = 10 : 9\n    With a 20 m start, B must run 180 m while A runs 200 m.\n    Times: A takes 200/10 = 20 units, B takes 180/9 = 20 units.\n    They dead-heat exactly.\n\n(b) first meeting = 400/(8+6) = 400/14 = 28.57 s\n    ratio 8:6 reduces to 4:3, so 4 + 3 = 7 distinct meeting points" },
          w: "Part (a) is the neat consequence of the two wordings being the same ratio: a *beat* of 20 m converted into a *start* of 20 m always produces a dead heat over the same course. Knowing that turns a two-minute question into a ten-second one."
        }
      }
    ],
    k: [
      "*Gives a start of 20 m* and *beats by 20 m* give the same speed ratio, different setups.",
      "Chain three runners through ratios; never add the two winning margins.",
      "Circular first meeting: L/(a+b) opposite, L/(a−b) same direction.",
      "First meeting at the start point is the LCM of the two lap times, either direction.",
      "Distinct meeting points: a+b or a−b, using the REDUCED speed ratio.",
      "Escalators are streams: count in steps, add or subtract the escalator's rate."
    ],
    r: ["Statistics"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "first meeting: L/(a+b) opposite, L/(a-b) same way", w: "circular track basics" },
        { c: "meet at start again = LCM of the two lap times", w: "direction does not matter here" },
        { c: "distinct meeting points = a+b or a-b, ratio reduced first", w: "the step everyone skips" }
      ]
    }
  },

  {
    t: "Time and Work, Pipes and Cisterns",
    m: "tsd",
    lvl: "core",
    s: "The LCM method that removes fractions, efficiency ratios, alternate-day work, and pipes that empty as well as fill.",
    goal: [
      "Set total work as an LCM so every rate is a whole number",
      "Convert *A is twice as efficient as B* into rates without confusion",
      "Handle leaving-midway, alternate-day and negative-rate questions"
    ],
    b: [
      { p: "Time and work is the same relation as time and distance with the names changed: work = rate × time. What makes it feel harder is that the rates arrive as fractions — *A does 1/12 of the job a day* — and fractions under time pressure cause errors. The LCM method removes them entirely, and it should be your default from now on." },

      { h: "The LCM method" },

      {
        code: {
          lang: "text", t: "Set the job to a convenient size",
          lines: [
            { c: "A does a job in 12 days, B in 18 days. Together?", w: "" },
            { c: "", w: "" },
            { c: "Fraction way:  1/12 + 1/18 = 3/36 + 2/36 = 5/36", w: "" },
            { c: "               so 36/5 = 7.2 days", w: "Correct, and slower, and easier to slip on." },
            { c: "", w: "" },
            { c: "LCM way:  let the total work be LCM(12, 18) = 36 units.", w: "**Choose the total. It is arbitrary, so choose well.**", hi: true },
            { c: "  A's rate = 36/12 = 3 units a day", w: "" },
            { c: "  B's rate = 36/18 = 2 units a day", w: "" },
            { c: "  together = 5 units a day  ->  36/5 = 7.2 days", w: "Whole numbers throughout. This is the method to default to.", hi: true }
          ]
        }
      },

      { n: "The payoff grows with the question. Three workers, one who leaves midway, and a pipe that leaks — in fractions that is a page of denominators; in units it is arithmetic you can hold in your head. Set the LCM before you do anything else.", nt: "Why this scales" },

      { h: "Efficiency wording" },

      {
        tbl: {
          t: "Translating the standard phrases",
          h: ["Phrase", "Rates", "Times"],
          rows: [
            ["*A is twice as efficient as B*", "A : B = 2 : 1", "A : B = 1 : 2 — A takes **half** as long"],
            ["*A is 50% more efficient than B*", "3 : 2", "2 : 3"],
            ["*A takes 6 days less than B*", "—", "Set B = x, A = x − 6, and solve"],
            ["*A and B together take 4 days; A alone takes 6*", "B = together − A", "1/4 − 1/6, or in units, subtract the rates"],
            ["*3 men = 5 women*", "man : woman rate = 5 : 3", "Careful — the ratio inverts between count and rate"]
          ]
        }
      },

      { trap: "Efficiency and time are **inversely** related, and the wording flips freely between them. *A is twice as efficient* means A finishes in half the time. *A takes twice as long* means A is half as efficient. Write down which quantity the ratio you have is a ratio **of** before using it, because the two are reciprocals and both look plausible in the options." },

      { h: "Pipes and cisterns: the same topic with a minus sign" },

      {
        code: {
          lang: "text", t: "An outlet is just a negative rate",
          lines: [
            { c: "Pipe A fills a tank in 6 h, B in 8 h, outlet C empties it in 12 h.", w: "" },
            { c: "All three open together — how long to fill?", w: "" },
            { c: "", w: "" },
            { c: "LCM(6, 8, 12) = 24 units of capacity.", w: "" },
            { c: "  A = +4 units/h", w: "" },
            { c: "  B = +3 units/h", w: "" },
            { c: "  C = -2 units/h", w: "**The outlet enters as a negative rate. That is the only new idea.**", hi: true },
            { c: "", w: "" },
            { c: "net = 4 + 3 - 2 = 5 units/h  ->  24/5 = 4.8 hours", w: "" },
            { c: "", w: "" },
            { c: "If the net rate came out negative, the tank never fills —", w: "" },
            { c: "and that is a real answer some questions want.", w: "Check the sign before assuming a positive time." }
          ]
        }
      },

      { h: "Alternate days and work that stops midway" },

      {
        code: {
          lang: "text", t: "Two patterns that account for most hard questions",
          lines: [
            { c: "PATTERN 1 - alternate days.", w: "" },
            { c: "A alone takes 10 days, B alone 15. They work on alternate", w: "" },
            { c: "days starting with A. When is the job done?", w: "" },
            { c: "", w: "" },
            { c: "  total = 30 units.  A = 3/day, B = 2/day.", w: "" },
            { c: "  A 2-day cycle does 5 units.", w: "**Work in cycles, not days.**", hi: true },
            { c: "  6 cycles = 12 days = 30 units ... exactly done on day 12.", w: "" },
            { c: "  If the remainder had been 2 units, A's next day (3 units)", w: "" },
            { c: "  would finish it in 2/3 of a day.", w: "Always check the final partial day separately.", hi: true },
            { c: "", w: "" },
            { c: "PATTERN 2 - someone leaves.", w: "" },
            { c: "A and B start together; A leaves after 3 days; B finishes.", w: "" },
            { c: "", w: "" },
            { c: "  work done in the first 3 days = 3 x (rateA + rateB)", w: "" },
            { c: "  remaining = total - that", w: "" },
            { c: "  extra days = remaining / rateB", w: "Account for the work, then for the time. Never both at once." }
          ]
        }
      },

      { h: "The question types" },

      {
        tbl: {
          t: "Recognise and route",
          h: ["Question", "Move"],
          rows: [
            ["A, B, C in pairs — find each alone", "Add all three pair-rates, halve to get (A+B+C), then subtract each pair"],
            ["*M men in D days* — change the men", "M₁D₁/W₁ = M₂D₂/W₂, the work-equivalence relation"],
            ["Wages split between workers", "In the ratio of **work done**, which is the ratio of rates when the time is shared"],
            ["A leak empties a full tank in x hours after filling", "Net rate over the filling period gives the leak's rate"],
            ["A pipe left open by mistake", "Subtract its rate for exactly the hours it was open"],
            ["*Together they take t days*", "Sum the rates, then invert. Never average the days"]
          ]
        }
      },

      { trap: "**Never average the days.** If A takes 10 days and B takes 15, together they do not take 12.5 days — they take 6. Any answer larger than the fastest worker's solo time is wrong on its face, and that one sanity check catches most errors in this topic before you commit to an option." },

      {
        tryit: {
          t: "Three in the standard shapes",
          task: "(a) A and B together finish a job in 12 days, B and C in 15 days, A and C in 20 days. How long would each take alone? (b) A pipe fills a tank in 5 hours; a leak in the base empties the full tank in 20 hours. With both open, how long to fill? (c) A is 60% more efficient than B, and together they finish in 15 days. How long would A take alone?",
          hint: "(a) add all three pair-rates. (b) negative rate. (c) turn the efficiency into a rate ratio first.",
          sol: { lang: "text", code: "(a) LCM(12,15,20) = 60 units\n    A+B = 5, B+C = 4, A+C = 3   -> sum = 12 = 2(A+B+C)\n    A+B+C = 6\n    C = 6 - 5 = 1  ->  60 days\n    A = 6 - 4 = 2  ->  30 days\n    B = 6 - 3 = 3  ->  20 days\n\n(b) LCM(5,20) = 20 units.  pipe +4, leak -1, net +3\n    20/3 = 6 hours 40 minutes\n\n(c) rates A : B = 160 : 100 = 8 : 5, so together 13 parts\n    13 parts finish in 15 days -> total work = 195 part-days\n    A alone = 195/8 = 24.375 days" },
          w: "Part (a) is the standard three-pair question and the move is always the same: the three pair-rates sum to twice the combined rate, so halving gives A+B+C, and each individual falls out by subtraction. Memorise the shape, not the numbers."
        }
      }
    ],
    k: [
      "Set total work = LCM of the given days. Every rate becomes a whole number.",
      "Efficiency and time are reciprocals. Twice as efficient means half the time.",
      "An outlet pipe is a negative rate. Everything else is unchanged.",
      "For alternate days, work in cycles and handle the last partial day separately.",
      "Three pair-rates sum to twice the combined rate.",
      "Together-time is always less than the fastest worker's solo time. Sanity-check every answer against that."
    ],
    r: ["Statistics"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "total work = LCM of the days; rate = total / days", w: "the method that removes fractions" },
        { c: "an emptying pipe is a negative rate", w: "pipes and cisterns in one idea" },
        { c: "(A+B) + (B+C) + (A+C) = 2(A+B+C)", w: "the three-pair question" }
      ]
    }
  }

]);
