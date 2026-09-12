/* Aptitude — verbal ability and critical reasoning. */
TD.addLessons("aptitude", [

  {
    t: "Reading Comprehension Under a Clock",
    m: "verbal",
    lvl: "core",
    s: "How to read a test passage differently from ordinary reading, the five question types and how each is answered, and why the tempting option is usually wrong.",
    goal: [
      "Read a passage for structure rather than for content",
      "Classify every question into one of five types and answer it accordingly",
      "Eliminate options using the four standard wrong-answer patterns"
    ],
    b: [
      { p: "Reading comprehension is the highest-weight verbal topic in almost every exam, and it is scored badly by people who read English perfectly well. The reason is that they read the passage the way they read anything else — for content — when the test rewards reading for **structure**." },

      { h: "Reading for structure" },

      {
        code: {
          lang: "text", t: "What to extract on the first pass",
          lines: [
            { c: "Do NOT try to remember the details. They are on the page and", w: "" },
            { c: "you can return to them.", w: "**The passage does not go anywhere. Your reading time does.**", hi: true },
            { c: "", w: "" },
            { c: "Extract four things instead:", w: "" },
            { c: "", w: "" },
            { c: "  1. The MAIN POINT - what is the author arguing?", w: "One sentence, in your own words, before any question." },
            { c: "  2. The STRUCTURE - how does each paragraph serve that point?", w: "Setup / evidence / counterargument / conclusion.", hi: true },
            { c: "  3. The TONE - approving, critical, neutral, sceptical?", w: "Tone questions are free marks if you noted it while reading." },
            { c: "  4. The TURNS - where does 'however', 'but', 'although' appear?", w: "**Contrast words mark where the argument moves. Questions cluster there.**", hi: true },
            { c: "", w: "" },
            { c: "Mark each paragraph with two or three words in the margin.", w: "A map you can navigate beats a passage you half-remember." }
          ]
        }
      },

      { n: "The single most useful habit is circling the contrast words — *however, but, although, nevertheless, yet, on the other hand, in contrast*. A test writer builds questions where the argument turns, because that is where a careless reader will attribute the wrong view to the author. Marking those turns while reading costs nothing and locates half the answers.", nt: "Circle the turns" },

      { h: "The five question types" },

      {
        tbl: {
          t: "Classify, then answer accordingly",
          h: ["Type", "Asks", "Method"],
          rows: [
            ["**Main idea**", "What is the passage mainly about?", "Answer from your one-sentence summary. Reject options that are true but cover only one paragraph"],
            ["**Detail**", "What does the passage say about X?", "**Go back and find the line.** Never answer from memory"],
            ["**Inference**", "What can be concluded?", "Must follow from the text alone. If it needs one extra fact, it is wrong"],
            ["**Tone / attitude**", "How does the author feel?", "Look at adjectives and verbs, not at the subject matter"],
            ["**Structure / function**", "Why is paragraph 3 there?", "Answer from your margin map, not from the paragraph's content"]
          ]
        }
      },

      { trap: "**Detail questions must be answered by returning to the text, every time.** The passage was read once, under pressure, in a second language for many candidates — memory of it is unreliable in exactly the way the wrong options are designed to exploit. Locating the line takes fifteen seconds and converts a coin flip into a certainty." },

      { h: "The four wrong-answer patterns" },

      {
        code: {
          lang: "text", t: "Recognise these and elimination becomes mechanical",
          lines: [
            { c: "1. TOO EXTREME", w: "" },
            { c: "   Contains 'always', 'never', 'all', 'impossible', 'must'.", w: "**Passages hedge; wrong options do not. This alone kills many options.**", hi: true },
            { c: "", w: "" },
            { c: "2. TRUE BUT NOT ASKED", w: "" },
            { c: "   Accurately restates the passage, but answers a different", w: "" },
            { c: "   question from the one posed.", w: "The most tempting wrong answer, and the most common one chosen.", hi: true },
            { c: "", w: "" },
            { c: "3. OUTSIDE THE PASSAGE", w: "" },
            { c: "   Plausible, factually correct in the world, not in the text.", w: "Your general knowledge is a liability here." },
            { c: "", w: "" },
            { c: "4. HALF RIGHT", w: "" },
            { c: "   The first clause is accurate and the second is not.", w: "**Read every option to its final word before accepting it.**", hi: true },
            { c: "", w: "" },
            { c: "The correct answer is usually the most CAUTIOUS one that", w: "" },
            { c: "still fully answers the question.", w: "Hedged language in the option is a signal to look closer, not to reject." }
          ]
        }
      },

      { h: "Timing" },

      {
        code: {
          lang: "text", t: "A budget that works",
          lines: [
            { c: "For a 400-500 word passage with 4-5 questions:", w: "" },
            { c: "", w: "" },
            { c: "  read for structure          2:00 - 2:30", w: "" },
            { c: "  main idea / tone questions  0:30 each", w: "Answered from the reading itself." },
            { c: "  detail questions            0:45 each, including the lookup", w: "" },
            { c: "  inference questions         1:00 each", w: "The slowest type, and worth the time.", hi: true },
            { c: "", w: "" },
            { c: "  total ~ 6-7 minutes per passage", w: "" },
            { c: "", w: "" },
            { c: "Choose passages by TOPIC FAMILIARITY, not by length.", w: "" },
            { c: "A short abstract-philosophy passage is slower than a long", w: "" },
            { c: "concrete one on a subject you know.", w: "**The number of words is a poor predictor of the time cost.**", hi: true }
          ]
        }
      },

      { h: "Non-native reading speed" },

      { p: "If English is your second or third language, the gap in reading comprehension scores is usually a speed gap and not a comprehension gap — and speed responds to practice within weeks. The routine that works is unglamorous: read one long-form article a day from a source with a serious editorial standard, and afterwards write a one-sentence summary of its argument. The summary is the part that matters; it is the same skill the main-idea question tests." },

      {
        tryit: {
          t: "Practise the summary habit",
          task: "Take any 800–1,200 word opinion piece or feature article. Read it once at normal speed. Then, without looking back, write down: (1) the author's main claim in one sentence, (2) the function of each paragraph in three words, and (3) the author's attitude in one word. Then re-read and check how much you got right.",
          hint: "If you cannot state the main claim in one sentence, you read for content rather than structure — which is exactly the habit this exercise is designed to change.",
          sol: { lang: "text", code: "What to expect over four weeks of daily practice:\n\n  week 1  main claim often wrong or too broad;\n          paragraph functions vague\n  week 2  main claim usually right; structure map improving\n  week 3  attitude reliably correct; reading speed up ~20%\n  week 4  the map forms while reading rather than after it\n\nThe measurable result in a mock is a drop in time per\npassage before any rise in accuracy. The accuracy follows." },
          w: "The reason to write the summary rather than think it is that a vague half-thought feels like understanding and a written sentence does not. Forcing it onto paper exposes exactly where the reading was shallow."
        }
      }
    ],
    k: [
      "Read for structure — main point, paragraph functions, tone, turns — not for detail.",
      "Circle every contrast word; questions cluster where the argument turns.",
      "Answer detail questions by returning to the text, never from memory.",
      "Reject options containing always, never, all, must — passages hedge.",
      "The most tempting wrong answer is true but answers a different question.",
      "Read each option to its final word; half-right options are common.",
      "Choose passages by topic familiarity, not by length."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "read for structure, not for detail", w: "the core RC habit" },
        { c: "circle however, but, although, yet", w: "questions cluster at the turns" },
        { c: "extreme words in an option: usually wrong", w: "always, never, all, must" }
      ]
    }
  },

  {
    t: "Para Jumbles, Para Summary and Odd Sentence Out",
    m: "verbal",
    lvl: "intermediate",
    s: "The link-based method for reordering sentences, how to pick a summary that is neither too narrow nor too broad, and the odd-one-out test.",
    goal: [
      "Order a jumbled paragraph by finding mandatory pairs rather than reading all permutations",
      "Identify the opening sentence and the concluding sentence by their linguistic markers",
      "Choose a summary by testing scope, not by matching vocabulary"
    ],
    b: [
      { p: "These three question types share one method: they are about the **connections between sentences**, not the content of any sentence. Once you look for connectors rather than meaning, all three become fast." },

      { h: "Para jumbles: find the mandatory pairs" },

      {
        code: {
          lang: "text", t: "Never try to order all the sentences at once",
          lines: [
            { c: "With 5 sentences there are 120 orderings. You cannot search", w: "" },
            { c: "them. Find LOCAL links instead and let the order assemble.", w: "**Two sentences that must be adjacent constrain everything else.**", hi: true },
            { c: "", w: "" },
            { c: "Signals of a mandatory pair:", w: "" },
            { c: "", w: "" },
            { c: "  PRONOUNS - 'it', 'they', 'this', 'these' must follow the", w: "" },
            { c: "  noun they refer to.", w: "The strongest single signal in the topic.", hi: true },
            { c: "  ARTICLES - 'a scheme' introduces; 'the scheme' refers back.", w: "Indefinite comes before definite. Always.", hi: true },
            { c: "  CONNECTORS - 'however', 'therefore', 'moreover', 'for", w: "" },
            { c: "  instance' cannot start a paragraph.", w: "" },
            { c: "  TIME ORDER - dates, 'later', 'subsequently', 'finally'.", w: "" },
            { c: "  CAUSE AND EFFECT - the cause sentence precedes the effect.", w: "" },
            { c: "  ACRONYMS - the full form appears before the abbreviation.", w: "An easy, decisive check most candidates never run.", hi: true }
          ]
        }
      },

      {
        tbl: {
          t: "Identifying the first and last sentences",
          h: ["Position", "Markers", "Ruled out by"],
          rows: [
            ["**Opening**", "Introduces a subject by full name; general statement; sets context", "Any pronoun with no antecedent; *however*, *therefore*, *also*, *this*"],
            ["**Closing**", "Conclusion, consequence, summary; *thus*, *hence*, *in short*", "Introducing a brand-new idea that nothing follows up"],
            ["**Middle**", "Everything that carries both a backward and a forward link", "—"]
          ]
        }
      },

      { n: "In a multiple-choice jumble, work from the **options** rather than from scratch. If three of four options start with sentence C, the opener is almost certainly C and the real work is only in ordering the rest. If you find one confident mandatory pair, discard every option that separates them — that alone often leaves a single choice.", nt: "Use the options as constraints" },

      {
        code: {
          lang: "text", t: "A worked jumble",
          lines: [
            { c: "A. However, its adoption has been uneven across regions.", w: "" },
            { c: "B. The technology was first demonstrated in 1998.", w: "" },
            { c: "C. This unevenness reflects differences in infrastructure.", w: "" },
            { c: "D. It promised to cut transmission losses by half.", w: "" },
            { c: "", w: "" },
            { c: "B opens: full noun 'The technology', a date, no back-reference.", w: "", hi: true },
            { c: "D follows B: 'It' needs the technology as antecedent.", w: "" },
            { c: "A follows D: 'However' contrasts the promise with reality.", w: "" },
            { c: "C follows A: 'This unevenness' points straight at A.", w: "**Each link is forced by one word. No global reordering needed.**", hi: true },
            { c: "", w: "" },
            { c: "Order: B D A C", w: "" }
          ]
        }
      },

      { h: "Para summary" },

      {
        code: {
          lang: "text", t: "Scope is the whole test",
          lines: [
            { c: "A summary option fails in one of four ways:", w: "" },
            { c: "", w: "" },
            { c: "  TOO NARROW  - captures one paragraph or one example only", w: "" },
            { c: "  TOO BROAD   - true of the topic but not specific to this text", w: "" },
            { c: "  DISTORTED   - reverses or overstates the author's position", w: "**Check the direction of the claim, not just its subject.**", hi: true },
            { c: "  EXTRA       - adds a recommendation or cause the text never made", w: "" },
            { c: "", w: "" },
            { c: "The right answer covers the WHOLE passage and NOTHING more.", w: "" },
            { c: "", w: "" },
            { c: "A useful check: does the option include the passage's main", w: "" },
            { c: "CONTRAST? Most short passages turn on one 'but'. A summary", w: "" },
            { c: "that omits the turn is summarising only the first half.", w: "This test alone resolves most para-summary questions.", hi: true }
          ]
        }
      },

      { trap: "**Vocabulary matching is a trap, not a technique.** The option that reuses the passage's distinctive words is often the narrow one — it echoes a single sentence. The correct summary frequently paraphrases entirely, using none of the passage's characteristic vocabulary, precisely because it is summarising rather than quoting." },

      { h: "Odd sentence out" },

      {
        code: {
          lang: "text", t: "Four belong together; one does not",
          lines: [
            { c: "Method: find the coherent paragraph FIRST, then see which", w: "" },
            { c: "sentence has no home in it.", w: "**Do not hunt for the odd one directly. Build the paragraph.**", hi: true },
            { c: "", w: "" },
            { c: "The odd sentence typically:", w: "" },
            { c: "  - discusses the same TOPIC but makes a different POINT", w: "That similarity is exactly why it is hard.", hi: true },
            { c: "  - is more general or more specific than the other four", w: "" },
            { c: "  - has no pronoun or connector linking it to any other", w: "" },
            { c: "  - would work as an opening sentence for a DIFFERENT paragraph", w: "" },
            { c: "", w: "" },
            { c: "If two sentences both seem odd, the coherent four are wrong -", w: "" },
            { c: "rebuild the paragraph before choosing.", w: "" }
          ]
        }
      },

      {
        tryit: {
          t: "One jumble, one summary judgement",
          task: "(a) Order these: (1) These fees now exceed the cost of the goods themselves in some categories. (2) Online marketplaces charge sellers a listing fee. (3) Regulators in three countries have opened inquiries. (4) They also take a commission on each sale. (b) A passage argues that remote work raises individual productivity but weakens the informal knowledge transfer that trains junior staff. Which is the better summary: (i) *Remote work improves productivity* or (ii) *Remote work trades measurable individual output against the informal learning juniors depend on*?",
          hint: "(a) look for the indefinite-to-definite article shift and the pronoun. (b) apply the contrast test.",
          sol: { lang: "text", code: "(a) 2 opens: 'a listing fee' introduces the subject.\n    4 follows: 'They also take' - pronoun plus 'also'.\n    1 follows: 'These fees' refers back to both charges.\n    3 closes: the consequence.\n    Order: 2 4 1 3\n\n(b) (ii).\n    (i) is TOO NARROW and DISTORTED: it captures only the\n    first half and drops the passage's central 'but'.\n    (ii) contains the contrast, which is the whole point." },
          w: "In (a), notice that sentence 3 could not open — it begins with a consequence that nothing has yet caused — and sentence 1 could not open either, because *These fees* has no antecedent. Two options eliminated before any reading for meaning."
        }
      }
    ],
    k: [
      "Find mandatory pairs; never try to order all sentences at once.",
      "Pronouns follow their nouns; *a* precedes *the*; full forms precede acronyms.",
      "Connectors like *however* and *therefore* can never open a paragraph.",
      "Use the answer options as constraints — discard any that split a confident pair.",
      "A summary must cover the whole passage and nothing more.",
      "A summary that omits the passage's main contrast is summarising half of it.",
      "Vocabulary matching signals a narrow option, not a correct one.",
      "For odd-one-out, build the coherent paragraph first."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "pronouns follow their nouns; 'a' comes before 'the'", w: "the strongest jumble signals" },
        { c: "however and therefore never open a paragraph", w: "eliminates openers instantly" },
        { c: "a summary missing the main contrast is half a summary", w: "the scope test" }
      ]
    }
  },

  {
    t: "Sentence Correction and Vocabulary in Context",
    m: "verbal",
    lvl: "core",
    s: "The dozen error types that account for nearly all sentence-correction questions, and how to handle vocabulary questions when you do not know the word.",
    goal: [
      "Scan a sentence for the twelve high-frequency error types in order",
      "Choose between options by grammar, not by what sounds natural",
      "Attack an unknown word through roots, affixes and sentence charge"
    ],
    b: [
      { p: "Sentence correction looks like a grammar test and behaves like a checklist. A small number of error types appear repeatedly, and once you scan for those specifically — rather than reading the sentence and waiting for something to feel wrong — the topic becomes fast and highly accurate." },

      { h: "The error checklist" },

      {
        tbl: {
          t: "Scan for these, in roughly this order",
          h: ["Error", "What to check", "Example of the error"],
          rows: [
            ["**Subject–verb agreement**", "Find the real subject; ignore phrases in between", "*The list of items **are** long* → **is**"],
            ["**Tense consistency**", "Do the tenses match the timeline?", "*He said he **will** come* → **would**"],
            ["**Parallelism**", "Items in a list must share a form", "*likes reading, writing and **to swim*** → **swimming**"],
            ["**Modifier placement**", "Does the opening phrase describe the subject?", "*Running late, the bus was missed* — the bus was not running late"],
            ["**Pronoun reference**", "Is it clear and does it agree in number?", "*Each student must bring **their** book* — formally **his or her**"],
            ["**Comparison**", "Are the two things comparable?", "*His salary is higher than **Ravi*** → **than Ravi's**"],
            ["**Articles**", "a / an / the, and zero article", "*He is **engineer*** → **an engineer**"],
            ["**Prepositions**", "Fixed collocations", "*discuss **about*** → **discuss**; *married **with*** → **to**"],
            ["**Conditionals**", "The if-clause and result-clause pairing", "*If I **would have** known* → *If I **had** known*"],
            ["**Countable / uncountable**", "much/many, less/fewer, amount/number", "***Less** people* → **fewer people**"],
            ["**Double negative / redundancy**", "Repeated meaning", "*return **back***, *repeat **again***, *free **gift***"],
            ["**Word order**", "Especially in questions and reported speech", "*He asked me **where was I going*** → **where I was going**"]
          ]
        }
      },

      { n: "Only a handful of these appear in any one paper, but they appear again and again across papers. Working through the checklist in order takes about fifteen seconds per sentence and finds the error far more reliably than reading the sentence and waiting for something to sound wrong — especially for a non-native speaker, where the wrong form may sound entirely normal.", nt: "Scan, do not listen" },

      { h: "The subject-verb rules that get tested" },

      {
        code: {
          lang: "text", t: "Where the real subject hides",
          lines: [
            { c: "Ignore everything between the subject and the verb.", w: "" },
            { c: "  The BOX of chocolates IS on the table.", w: "**'of chocolates' is not the subject. Cross it out mentally.**", hi: true },
            { c: "", w: "" },
            { c: "'Each', 'every', 'either', 'neither', 'one of' -> SINGULAR", w: "" },
            { c: "  Each of the students HAS submitted.", w: "" },
            { c: "", w: "" },
            { c: "'Neither A nor B' -> the verb agrees with the NEARER subject", w: "" },
            { c: "  Neither the manager nor the staff WERE informed.", w: "Reversing the order changes the verb. That is the test.", hi: true },
            { c: "", w: "" },
            { c: "'A number of' -> plural.  'The number of' -> singular.", w: "A pair that is asked directly, and often." },
            { c: "", w: "" },
            { c: "Collective nouns (team, committee, government) take a", w: "" },
            { c: "singular verb when acting as one unit.", w: "" }
          ]
        }
      },

      { h: "Vocabulary you do not know" },

      {
        code: {
          lang: "text", t: "Three attacks, in order",
          lines: [
            { c: "1. SENTENCE CHARGE - is the missing word positive or negative?", w: "" },
            { c: "   The context usually reveals the sign even when the word", w: "" },
            { c: "   is unknown, and that eliminates half the options.", w: "**Charge before meaning. It is the cheapest filter.**", hi: true },
            { c: "", w: "" },
            { c: "2. ROOTS AND AFFIXES", w: "" },
            { c: "   bene- good      mal- bad        mis- wrong", w: "" },
            { c: "   pre- before     post- after     anti- against", w: "" },
            { c: "   -ous full of    -less without   -phile loving", w: "" },
            { c: "   circum- around  intra- within   inter- between", w: "The vocabulary module of the English track builds this systematically.", hi: true },
            { c: "", w: "" },
            { c: "3. SUBSTITUTE A GUESS AND READ THE SENTENCE BACK", w: "" },
            { c: "   If the sentence still makes sense with your guess in", w: "" },
            { c: "   place, the option is at least plausible.", w: "Do this for the two surviving options, not for all four." }
          ]
        }
      },

      { trap: "**Do not choose by what sounds natural**, particularly if you learned English mainly by ear. Several perfectly idiomatic Indian-English constructions — *discuss about*, *revert back*, *cope up with*, *good in maths*, *prepone* — are marked wrong in these tests. Sounding right and being right diverge in exactly the places these papers test, which is why the checklist beats intuition." },

      { h: "Confusable pairs that recur" },

      {
        tbl: {
          t: "The ones that appear most",
          h: ["Pair", "Distinction"],
          rows: [
            ["**affect / effect**", "Affect is usually the verb; effect is usually the noun"],
            ["**principal / principle**", "Principal = head or main; principle = a rule"],
            ["**complement / compliment**", "Complement completes; compliment praises"],
            ["**stationary / stationery**", "Stationary = not moving; stationery = paper goods"],
            ["**its / it's**", "It's is *it is*. The possessive has no apostrophe"],
            ["**lie / lay**", "Lie takes no object; lay takes one"],
            ["**fewer / less**", "Fewer for countable, less for uncountable"],
            ["**between / among**", "Between two, among more than two"],
            ["**imply / infer**", "The speaker implies; the listener infers"],
            ["**adverse / averse**", "Adverse = unfavourable; averse = opposed to"]
          ]
        }
      },

      {
        tryit: {
          t: "Find the error",
          task: "Identify and fix the error in each: (a) One of the reasons for his failure are his poor time management. (b) The manager along with his team have completed the project. (c) He is not only intelligent but also he works hard. (d) Having finished the report, the printer broke down.",
          hint: "(a) and (b) are subject–verb. (c) is parallelism. (d) is a dangling modifier.",
          sol: { lang: "text", code: "(a) 'One of the reasons ... IS his poor time management'\n    the subject is 'One', not 'reasons'\n\n(b) 'The manager ... HAS completed'\n    'along with his team' does not change the subject\n\n(c) 'He is not only intelligent but also hardworking'\n    the two halves of not only/but also must match in form\n\n(d) 'Having finished the report, HE found that the printer\n    had broken down'\n    the opening phrase must describe the sentence's subject,\n    and a printer cannot finish a report" },
          w: "Sentences (a) and (b) are the same error wearing different clothes: material between the subject and the verb, designed to pull agreement toward the nearer noun. Crossing out everything between them is a single habit that catches both."
        }
      }
    ],
    k: [
      "Scan the twelve error types in order rather than waiting for something to sound wrong.",
      "Cross out phrases between the subject and the verb before checking agreement.",
      "*Neither A nor B* agrees with the nearer subject.",
      "*A number of* is plural; *the number of* is singular.",
      "Items joined by and, or, not only/but also must be parallel in form.",
      "An opening participial phrase must describe the sentence's subject.",
      "Use sentence charge — positive or negative — before trying to recall a word's meaning.",
      "Sounding natural and being correct diverge exactly where these tests probe."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "cross out everything between the subject and the verb", w: "catches most agreement errors" },
        { c: "neither A nor B agrees with the NEARER subject", w: "the rule that gets tested" },
        { c: "an opening phrase must describe the subject", w: "the dangling modifier test" }
      ]
    }
  },

  {
    t: "Critical Reasoning — assumption, inference, strengthen, weaken",
    m: "verbal",
    lvl: "advanced",
    s: "Separating a conclusion from its evidence, the negation test for assumptions, and the discipline that stops general knowledge from contaminating an answer.",
    goal: [
      "Split any short argument into evidence, assumption and conclusion",
      "Use the negation test to identify a necessary assumption",
      "Distinguish strengthen, weaken, inference and flaw questions and answer each on its own terms"
    ],
    b: [
      { p: "Critical reasoning is the highest-difficulty verbal type and the most learnable, because it is entirely mechanical. Every question presents a short argument, and every argument has the same three parts. Find them and the question type tells you exactly what to do next." },

      { h: "Anatomy of an argument" },

      {
        code: {
          lang: "text", t: "Three parts, always",
          lines: [
            { c: "EVIDENCE      what we are told is true", w: "The premises. Accept them; they are not up for challenge." },
            { c: "ASSUMPTION    the unstated link the argument depends on", w: "**Never written down. This is where nearly every question lives.**", hi: true },
            { c: "CONCLUSION    what the author claims follows", w: "Often signalled by 'therefore', 'thus', 'so', 'hence', 'clearly'." },
            { c: "", w: "" },
            { c: "Example:", w: "" },
            { c: "  Sales fell after we raised prices.  [evidence]", w: "" },
            { c: "  Therefore the price rise caused the fall.  [conclusion]", w: "" },
            { c: "  Assumption: nothing ELSE changed at the same time.", w: "The gap between the two, which the author never defends.", hi: true },
            { c: "", w: "" },
            { c: "To find the conclusion, ask: which sentence do the others", w: "" },
            { c: "support?  Not: which comes last?", w: "The conclusion is frequently the first sentence." }
          ]
        }
      },

      { h: "The negation test" },

      {
        code: {
          lang: "text", t: "The one technique worth drilling",
          lines: [
            { c: "To test whether a statement is a NECESSARY assumption:", w: "" },
            { c: "", w: "" },
            { c: "  1. Negate it.", w: "" },
            { c: "  2. Ask whether the argument still stands.", w: "" },
            { c: "  3. If the argument COLLAPSES, it was a necessary assumption.", w: "**If the argument survives the negation, it was not required.**", hi: true },
            { c: "", w: "" },
            { c: "Argument: this drug lowered blood pressure in trials,", w: "" },
            { c: "          so it will lower it in the general population.", w: "" },
            { c: "", w: "" },
            { c: "Candidate: 'The trial participants were representative", w: "" },
            { c: "           of the general population.'", w: "" },
            { c: "Negated:   they were NOT representative.", w: "" },
            { c: "Result:    the argument collapses entirely.", w: "So it is a necessary assumption. The test is decisive.", hi: true },
            { c: "", w: "" },
            { c: "Candidate: 'The drug has no side effects.'", w: "" },
            { c: "Negated:   it HAS side effects.", w: "" },
            { c: "Result:    the argument about blood pressure still stands.", w: "Relevant to using the drug, not assumed by this argument." }
          ]
        }
      },

      { h: "The question types" },

      {
        tbl: {
          t: "What each one is actually asking for",
          h: ["Type", "Find the option that…", "Watch for"],
          rows: [
            ["**Assumption**", "The argument requires to be true", "Use the negation test. Necessary, not merely helpful"],
            ["**Inference / must be true**", "Follows from the evidence with certainty", "**Do not use the conclusion.** Only what the premises force"],
            ["**Strengthen**", "Makes the conclusion more likely", "Usually confirms the assumption or rules out an alternative cause"],
            ["**Weaken**", "Makes the conclusion less likely", "Usually offers an alternative explanation for the same evidence"],
            ["**Flaw**", "Names the reasoning error", "Describes the error's *type*, not the topic"],
            ["**Paradox / resolve**", "Explains how both facts can be true", "Must account for BOTH, not just one"],
            ["**Boldface / role**", "Describes the function of a marked sentence", "Is it evidence, conclusion, or a view the author opposes?"]
          ]
        }
      },

      { h: "The named flaws worth recognising" },

      {
        tbl: {
          t: "Recurring reasoning errors",
          h: ["Flaw", "Shape"],
          rows: [
            ["**Correlation as causation**", "X and Y move together, so X caused Y"],
            ["**Alternative cause ignored**", "Concluding A caused B without ruling out C"],
            ["**Unrepresentative sample**", "Generalising from a group unlike the population"],
            ["**Survivorship bias**", "Studying only the successes and inferring what causes success"],
            ["**Ad hominem**", "Attacking the speaker instead of the argument"],
            ["**False dilemma**", "Presenting two options when others exist"],
            ["**Circular reasoning**", "The conclusion restated as a premise"],
            ["**Equivocation**", "One word used in two different senses"],
            ["**Percentage vs absolute**", "A rising percentage of a shrinking total may be a falling number"]
          ]
        }
      },

      { n: "The percentage-versus-absolute flaw is worth extra attention because it connects directly to the DI and arithmetic modules. *Our market share rose from 15% to 18%* says nothing about unit sales if the market shrank by a third. Arguments built on that gap appear in both the verbal and the DI sections of the same paper.", nt: "The flaw that spans two sections" },

      { trap: "**Your own knowledge of the world is a liability here.** An option can be perfectly true and still be the wrong answer, because it does not follow from *this* argument. Conversely, an option can describe something you believe is false and still be the correct inference from the passage. The only question is what the given premises support." },

      {
        tryit: {
          t: "Four short arguments",
          task: "For each, name the type and give the answer. (a) *Cities with more police have more crime. Therefore police presence causes crime.* — what is the flaw? (b) *This company's employees who took the training programme were promoted faster. Therefore the training causes faster promotion.* — what would most weaken this? (c) *All the successful founders we interviewed dropped out of college. Therefore dropping out helps founders succeed.* — name the flaw. (d) *Sales of our premium model rose 40% while total sales fell. Therefore customers are trading up.* — what assumption is required?",
          hint: "(b) look for an alternative cause or a selection effect. (c) who was not interviewed?",
          sol: { lang: "text", code: "(a) Correlation treated as causation, with reversed direction:\n    high crime is far likelier to cause more police hiring.\n\n(b) Weakened most by: the training was offered only to\n    employees already identified as high performers.\n    That is a selection effect - the promotion and the\n    training share a cause rather than one causing the other.\n\n(c) Survivorship bias. The dropouts who failed were never\n    interviewed, so the sample cannot support the claim.\n\n(d) That the premium model's rise reflects existing customers\n    moving up, rather than the cheaper models simply losing\n    buyers to competitors - the percentage-versus-absolute\n    gap. A 40% rise on a small base can be very few units." },
          w: "Every one of these four is a causal argument, and three of the four are answered by asking the same question: *what else could explain this evidence?* That question is the workhorse of weaken and flaw questions, and it is worth reaching for first."
        }
      }
    ],
    k: [
      "Every argument is evidence, an unstated assumption, and a conclusion.",
      "The conclusion is what the other sentences support — not necessarily the last sentence.",
      "Negate a candidate assumption: if the argument collapses, it was necessary.",
      "Inference questions use only the premises, never the conclusion.",
      "Weaken usually means supplying an alternative cause; strengthen means ruling one out.",
      "A paradox answer must explain both facts, not one.",
      "A rising percentage of a shrinking total can be a falling absolute number.",
      "Never let outside knowledge decide the answer."
    ],
    r: ["Correlation vs Causation", "Confounding Variable"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "negate the assumption: if the argument dies, it was necessary", w: "the one technique to drill" },
        { c: "weaken = supply an alternative cause", w: "the most common correct shape" },
        { c: "a rising % of a shrinking total can be a falling number", w: "the flaw that spans DI and verbal" }
      ]
    }
  }

]);
