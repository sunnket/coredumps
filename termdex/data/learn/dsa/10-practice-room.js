/* DSA for Interviews — how to practise so it sticks, and the two rounds that
   are not the standard whiteboard question. */
TD.addLessons("dsa", [

{
 t: "Practising So It Sticks — Spacing, Retrieval and the Plateau",
 m: "game",
 lvl: "core",
 s: "Why solving three hundred problems can teach you less than eighty, and the study method that fixes it.",
 goal: [
  "Practise by retrieval rather than by re-reading solutions",
  "Space your revision so patterns survive to interview day",
  "Diagnose a plateau and change what you are doing about it"
 ],
 b: [
  { p: "Most people prepare by solving a problem, getting stuck, reading the solution, feeling that it makes sense, and moving on. **That feeling is not learning** — it is the fluency illusion, and it is why someone with three hundred solved problems can still freeze on a fresh one." },

  { h: "The rule that changes everything" },
  { p: "**Reading a solution teaches you almost nothing. Retrieving one teaches you a great deal.** The effort of pulling an answer out of your own memory is what forms the trace — recognition feels identical and does not." },

  { tbl: { t: "Two ways to spend the same hour",
    h: ["What most people do", "What actually works"],
    rows: [
     ["Get stuck, read the solution, understand it, move on", "**Get stuck, wait out the full 25 minutes, then read**"],
     ["Never revisit a solved problem", "**Re-solve it from blank three days later**"],
     ["Solve by topic — a day of DP, a day of graphs", "**Mix topics, so you must first identify which it is**"],
     ["Measure progress by problem count", "**Measure by problems solved unaided, second time round**"],
     ["Read the editorial immediately when stuck", "**Read only the first hint, then continue alone**"]
    ] } },

  { n: "Practising one topic at a time is called blocked practice and it feels far more productive than it is. **When every problem in the session is DP, you never have to work out that it is DP** — which is exactly the skill the interview tests. Interleaving feels worse and performs better; this is one of the most replicated findings in the learning literature.",
    nt: "Why a day of DP is a trap" },

  { h: "The 25-minute rule" },
  { code: { lang: "text", t: "A protocol for one problem",
    lines: [
     { c: "0-5 min    Read. Restate it. Write two examples by hand.", w: "**Including one edge case. Do not code yet.**" },
     { c: "5-10 min   Identify the pattern. Write the brute force.", w: "**State its complexity out loud, even alone.**" },
     { c: "10-25 min  Work towards the better solution.", w: "**Genuinely stuck? Keep going. The struggle IS the mechanism.**", hi: true },
     { c: "25 min     Still stuck -> read ONE hint. Not the solution.", w: "**A nudge, not the answer.**", hi: true },
     { c: "35 min     Still stuck -> read the solution properly.", w: "" },
     { c: "           Then CLOSE it and write it from memory.", w: "**Non-negotiable. This step is where the learning happens.**", hi: true },
     { c: "+3 days    Re-solve from blank. No notes.", w: "**If you cannot, you never learned it the first time.**", hi: true }
    ],
    after: "The step people skip is closing the tab and rewriting it. **Reading code and producing code are different skills**, and only one of them is what you will be asked to do." } },

  { h: "The pattern log, revisited" },
  { p: "The first lesson introduced the pattern log. Here is what makes one useful rather than decorative: **write the trigger, not the solution.**" },

  { code: { lang: "text", t: "One entry, correctly written",
    lines: [
     { c: "PROBLEM   Longest substring without repeating characters", w: "" },
     { c: "TRIGGER   'longest' + 'contiguous' + 'no repeats'", w: "**The words that should fire the pattern.**", hi: true },
     { c: "PATTERN   Sliding window with a last-seen map", w: "" },
     { c: "KEY IDEA  right always advances; left jumps past the duplicate", w: "**One sentence. If it needs three, you have not understood it.**", hi: true },
     { c: "MISTAKE   forgot seen[ch] >= left, so stale entries counted", w: "**Your OWN error, not a general warning.**", hi: true },
     { c: "SIMILAR   min window substring, longest with k distinct", w: "" }
    ],
    after: "Notice there is no code in that entry. **The log is an index from wording to pattern**, and copying the solution into it defeats the purpose — you would only be re-reading again." } },

  { h: "Diagnosing a plateau" },
  { tbl: { t: "What the symptom means",
    h: ["What is happening", "The actual problem", "What to change"],
    rows: [
     ["Can solve after a hint, never without", "**Recognition, not retrieval**", "Full 25 minutes. Re-solve from blank at 3 days"],
     ["Solve mediums, freeze on anything new", "**Memorising problems, not patterns**", "Write the trigger in your log, not the code"],
     ["Get the idea, cannot finish the code", "**Implementation fluency**", "Drill templates until they are automatic"],
     ["Fine alone, fall apart when watched", "**Performance, not knowledge**", "Mock interviews. Speak aloud, always"],
     ["Solve it but too slowly", "**No decision procedure**", "Practise choosing the pattern in 60 seconds, without coding"]
    ] } },

  { n: "The last row is worth a separate drill: take twenty problems you have already solved, and **for each spend one minute naming the pattern and the complexity, writing no code at all.** Twenty minutes of that is worth more than one more solved problem, and almost nobody does it.",
    nt: "The drill nobody does" },

  { trap: "Do not judge a session by whether it felt smooth. **Sessions that feel difficult are the ones that are working**; sessions where everything flowed usually mean you practised what you already knew." },

  { tryit: { t: "Restructure your own week",
    task: "Take whatever you did last week and rewrite it under these rules:\n\n1. Every session mixes at least three topics\n2. Every problem gets the full 25 minutes before any hint\n3. Every solved problem is re-solved from blank three days later\n4. One session per week is pattern identification only — no coding\n\nThen write down how many problems that leaves room for.",
    hint: "It will be far fewer than you are used to. That is the point — the number is not the goal.",
    sol: { lang: "text", code: "A realistic week, roughly 8 hours:\n\nMON  3 new problems, mixed topics          (~90 min)\nTUE  3 new problems, mixed topics          (~90 min)\nWED  Re-solve Monday's from blank          (~30 min)\n     + 2 new                               (~60 min)\nTHU  Re-solve Tuesday's                    (~30 min)\n     + 2 new                               (~60 min)\nFRI  Pattern identification only: 20 problems,\n     name the pattern + complexity, NO code (~25 min)\nSAT  One full mock, spoken aloud, timed    (~60 min)\n     + review the recording                (~30 min)\nSUN  rest\n\nAbout 10 new problems a week. Twelve weeks is ~120 problems,\nwith every one of them re-solved at least once and roughly\n12 mocks behind you.\n\nCompare: 25 problems a week, read-the-solution style, is 300\nproblems and a much weaker position -- because almost none of\nthem were ever retrieved from memory unaided." },
    w: "Ten a week feels alarmingly slow when forums talk about hundreds. **The comparison that matters is not problems attempted, it is problems you could solve cold today** — and on that measure this schedule wins comfortably." } },

  { vocab: ["Algorithm", "Time Complexity", "Dynamic Programming", "Recursion"] }
 ],
 k: [
  "Reading a solution teaches recognition; retrieving one teaches recall. Only the second survives to interview day.",
  "Sit with a problem the full 25 minutes — the struggle is the mechanism, not an obstacle to it.",
  "After reading any solution, close it and rewrite from memory. Then re-solve from blank three days later.",
  "Interleave topics. A day of DP removes the hardest step — working out that it is DP.",
  "Log the trigger wording and your own mistake, never the code. The log is an index, not a solutions file."
 ],
 r: ["Algorithm", "Time Complexity", "Recursion"],
 drill: {
  lang: "text",
  reps: 2,
  items: [
   { c: "25 minutes before any hint", w: "the struggle is what forms the memory" },
   { c: "close the tab, rewrite from memory", w: "the step everyone skips" },
   { c: "re-solve from blank at +3 days", w: "spacing turns recognition into recall" },
   { c: "log the TRIGGER, not the code", w: "an index from wording to pattern" }
  ]
 }
},

{
 t: "The Rounds That Are Not a Whiteboard Question",
 m: "room",
 lvl: "intermediate",
 s: "Online assessments, take-homes, pair-programming rounds and debugging tasks — each scored differently.",
 goal: [
  "Adapt your approach to the format actually in front of you",
  "Handle an online assessment's hidden test cases deliberately",
  "Know what a pairing round is really measuring"
 ],
 b: [
  { p: "The live whiteboard round gets all the preparation, and it is often not the round that eliminates you. **Each format scores something different**, and playing all of them the same way is a quiet, common mistake." },

  { h: "The online assessment" },
  { p: "No interviewer, hidden tests, a hard timer. **Nobody is watching you reason, so partial credit for a good explanation does not exist — only passing tests count.**" },

  { tbl: { t: "How it differs from a live round",
    h: ["Live round", "Online assessment"],
    rows: [
     ["Explain your thinking", "**Nobody reads it. Do not narrate — write code**"],
     ["Brute force first is good practice", "**Write the real solution; a timeout scores zero**"],
     ["Interviewer supplies edge cases", "**You must invent them — hidden tests will not**"],
     ["Clarify ambiguity by asking", "**Re-read the constraints. They contain the answer**"],
     ["Partial progress earns credit", "**Usually all-or-nothing per test case**"]
    ] } },

  { code: { lang: "text", t: "A checklist before you submit",
    lines: [
     { c: "1. Empty input, and a single element", w: "**The most common hidden test.**", hi: true },
     { c: "2. All identical values", w: "" },
     { c: "3. Already sorted, and reverse sorted", w: "**Catches quicksort-style worst cases.**" },
     { c: "4. The maximum n in the constraints", w: "**Does it finish in time?**", hi: true },
     { c: "5. Negative numbers, and zero", w: "**If the constraints permit them.**" },
     { c: "6. Integer overflow, in C++ or Java", w: "**Python is safe here; those two are not.**" },
     { c: "7. Re-read the return format", w: "**Indices or values? Sorted? 0- or 1-indexed?**", hi: true }
    ],
    after: "Item 7 fails more submissions than any algorithmic error. **Returning values where indices were asked for scores zero on every test**, and it is entirely avoidable by re-reading the signature before you submit." } },

  { h: "The take-home" },
  { p: "**A take-home is not scored on cleverness. It is scored on whether you write like a professional**, and the algorithmic part is usually the easy part." },

  { tbl: { t: "What is actually being marked",
    h: ["They look at", "What earns the mark"],
    rows: [
     ["**A README**", "How to run it, what you assumed, what you would do with more time"],
     ["**Tests**", "That they exist at all. A few meaningful ones beat none"],
     ["Structure", "Sensible files and names — not one 400-line script"],
     ["Error handling", "Bad input handled deliberately, not crashing"],
     ["**Commit history**", "Several small commits, not one called \"done\""],
     ["Scope discipline", "Finishing what was asked beats a half-built extra feature"]
    ] } },

  { n: "The single highest-value paragraph in a take-home is *what I would do with more time*. **It shows judgement, converts every omission into a deliberate decision, and pre-empts the obvious criticism.** Three honest bullet points are enough.",
    nt: "The paragraph that changes the read" },

  { h: "Pair programming and debugging rounds" },
  { p: "Increasingly common, and they measure something the whiteboard cannot: **whether working with you is pleasant and productive.**" },

  { tbl: { t: "What each round rewards",
    h: ["Round", "Really measuring", "So"],
    rows: [
     ["**Pairing on a feature**", "Collaboration, taking input", "Think aloud, accept suggestions gracefully, ask what they would prefer"],
     ["**Debugging a broken repo**", "Method under pressure", "Reproduce first, then bisect. Do not guess-and-edit"],
     ["**Code review of a PR**", "Judgement and tone", "Lead with what is correct, be specific, separate must-fix from taste"],
     ["**Extend existing code**", "Reading unfamiliar code", "Read before writing. Match the style already there"]
    ] } },

  { code: { lang: "text", t: "The debugging round, as a procedure",
    lines: [
     { c: "1. Reproduce it. Do not skip this.", w: "**A bug you cannot reproduce is one you cannot verify fixed.**", hi: true },
     { c: "2. Read the actual error. Out loud.", w: "**The stack trace usually names the file and line.**" },
     { c: "3. Form ONE hypothesis. State it.", w: "*\"I think the index is off by one because...\"*", hi: true },
     { c: "4. Test that hypothesis specifically.", w: "**A print, a breakpoint, a unit test.**" },
     { c: "5. Wrong? Say so, and form the next one.", w: "**Being wrong out loud is fine. Silent flailing is not.**", hi: true },
     { c: "6. Fix it, then re-run everything.", w: "**Check you did not break something else.**" },
     { c: "7. Say what the root cause was.", w: "**Not 'it works now' — why it was broken.**", hi: true }
    ],
    after: "**Changing things at random to see what happens is the failure mode here**, and it is extremely visible to whoever is watching. One stated hypothesis at a time is the entire skill being assessed." } },

  { trap: "In a pairing round, silently rejecting a suggestion is scored badly even when you are right. **Say why**: *\"That would work — I am avoiding it because it makes the lookup O(n). Would you rather have the simpler version?\"* You have disagreed and stayed collaborative, and that is the thing being measured." },

  { h: "A format that catches people out: the system-flavoured coding round" },
  { p: "Some companies ask you to build a small working system — an LRU cache, a rate limiter, a parking-lot model — rather than solve a puzzle. **These reward clean interfaces over clever algorithms.**" },

  { code: { lang: "python", t: "LRU cache — the canonical example",
    lines: [
     { c: "from collections import OrderedDict", w: "" },
     { c: "", w: "" },
     { c: "class LRUCache:", w: "" },
     { c: "    def __init__(self, capacity):", w: "" },
     { c: "        self.cap = capacity", w: "" },
     { c: "        self.d = OrderedDict()", w: "**A dict plus a doubly linked list, already written.**", hi: true },
     { c: "", w: "" },
     { c: "    def get(self, key):", w: "" },
     { c: "        if key not in self.d: return -1", w: "" },
     { c: "        self.d.move_to_end(key)", w: "**A read counts as a use.** Forgetting this is the usual bug.", hi: true },
     { c: "        return self.d[key]", w: "" },
     { c: "", w: "" },
     { c: "    def put(self, key, value):", w: "" },
     { c: "        if key in self.d: self.d.move_to_end(key)", w: "" },
     { c: "        self.d[key] = value", w: "" },
     { c: "        if len(self.d) > self.cap:", w: "" },
     { c: "            self.d.popitem(last=False)", w: "**Evict the least recently used.**", hi: true }
    ],
    after: "Offer this first, then say: *\"If you want me to show the underlying structure, it is a hash map to nodes in a doubly linked list — I can write that instead.\"* **You have demonstrated you know both the practical answer and the mechanism**, which is the ideal response." } },

  { tryit: { t: "Prepare for the format, not just the questions",
    task: "1. Take a problem you have solved and write the seven-item pre-submit checklist against it. How many would you have failed?\n2. Write the 'what I would do with more time' section for a take-home you have done, or imagine one.\n3. Take a piece of your own code with a known past bug and narrate the debugging procedure aloud, out loud, as though someone were watching.",
    hint: "For 3, actually say it out loud. Narrating a hypothesis is a physical skill and it is noticeably awkward the first few times.",
    sol: { lang: "text", code: "There is no single correct answer here -- these are rehearsals.\nWhat to look for in your own attempt:\n\n1. Most people fail items 1 and 7 -- the empty input, and the\n   return format. Both are pure carelessness, and both score zero.\n\n2. A good 'more time' section is specific and honest:\n     - No pagination on the list endpoint; fine at this size,\n       would break past a few thousand rows.\n     - Tests cover the happy path and two edge cases; I would\n       add property-based tests for the parser.\n     - Config is hard-coded. Would move to environment variables.\n   Not: 'I would add more tests and improve performance.'\n\n3. Listen for whether you stated a hypothesis BEFORE changing\n   anything. Most people, recorded honestly, discover they edit\n   first and theorise afterwards -- which is exactly the habit\n   the round is built to expose." },
    w: "All three of these are about the format rather than the algorithm, and **the format is where well-prepared candidates most often lose points they did not need to lose.** An hour spent here is worth more than another twenty problems." } },

  { vocab: ["Technical Debt", "Code Review", "Unit Test", "Debugging", "Edge Case"] }
 ],
 k: [
  "In an online assessment nobody reads your reasoning — write the real solution and invent your own edge cases.",
  "Re-read the return format before submitting; wrong shape scores zero on every test.",
  "Take-homes mark professionalism: a README, some tests, small commits, and an honest *with more time* section.",
  "Debugging rounds measure method — reproduce, one stated hypothesis, test it, and name the root cause.",
  "In pairing rounds, disagree out loud with a reason. Silent rejection scores badly even when you are right."
 ],
 r: ["Edge Case", "Code Review", "Unit Test"],
 drill: {
  lang: "text",
  reps: 2,
  items: [
   { c: "empty input, single element, max n", w: "the hidden tests that catch everyone" },
   { c: "re-read the return format before submitting", w: "wrong shape scores zero" },
   { c: "reproduce, hypothesise, test, name the cause", w: "the debugging round, as a procedure" },
   { c: "\"that works — I'm avoiding it because...\"", w: "disagreeing while staying collaborative" }
  ]
 }
}

]);
