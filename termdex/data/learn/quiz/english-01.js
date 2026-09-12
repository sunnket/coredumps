/* Professional English — question bank, chapters 1-3.

   Grammar, vocabulary and everyday written English. Every question is one a
   fluent-but-not-native speaker actually gets wrong at work, which is a
   narrower and more useful set than "English grammar". Nothing here tests a
   rule that never costs anybody credibility.

   The explanation always says *why*, never just *which* — a bank that
   returns a letter is a scoreboard, not a teacher. */

TD.addMCQ("english", "grammar", [

  {
    tag: "Tenses", lvl: "core",
    q: "You have finished the fix and you want your manager to know the system is working **now**. Which sentence does that?",
    o: [
      "I fixed the bug on Monday.",
      "I have fixed the bug.",
      "I had fixed the bug.",
      "I am fixing the bug."
    ],
    a: 1,
    x: "Present perfect connects a finished action to the present moment — the bug is fixed *and the consequence is live*.",
    steps: [
      "**Past simple** (`I fixed it on Monday`) puts the event in a closed box. Correct English, but it reads as history, not status.",
      "**Present perfect** (`I have fixed it`) leaves the box open: done, and it matters now. This is what a status update wants.",
      "**Past perfect** (`I had fixed it`) needs a second past event to sit before. On its own it sounds unfinished.",
      "**Present continuous** says the work is still in progress — the opposite of what you meant."
    ]
  },
  {
    tag: "Tenses", lvl: "core",
    q: "Which sentence is **wrong in every variety of English**?",
    o: [
      "I already sent it.",
      "I have already sent it.",
      "I have sent it yesterday.",
      "I sent it yesterday."
    ],
    a: 2,
    x: "Present perfect can never pair with a finished time expression. *Yesterday* closes the box; *have sent* insists it is open.",
    note: "*I already sent it* is loose but standard American English, so it is not an error — the reverse pairing is."
  },
  {
    tag: "Tenses", lvl: "intermediate",
    q: "Your manager asks when you can deliver. You want to commit to **a fixed arrangement already in the plan**, not make a promise on the spot. Which do you say?",
    o: [
      "I will deliver it on Friday.",
      "I am delivering it on Friday.",
      "It should be with you by Friday.",
      "I would deliver it on Friday."
    ],
    a: 1,
    x: "Present continuous states a diarised arrangement — the plan existed before the question was asked.",
    steps: [
      "**will** = a decision made *now*, in the moment. It is a personal promise, and it is heard as one.",
      "**present continuous** = it is already in the calendar. That is what 'a fixed arrangement' means.",
      "**should** commits to almost nothing — useful when you mean it, evasive when you do not.",
      "**would** is conditional and needs an *if* that is not there."
    ]
  },
  {
    tag: "Tenses", lvl: "intermediate",
    q: "An incident report. Which sentence correctly places the deploy **before** the outage?",
    o: [
      "At 14:02 the service returned errors. We deployed a config change forty minutes earlier.",
      "At 14:02 the service returned errors. We had deployed a config change forty minutes earlier.",
      "At 14:02 the service has returned errors. We deployed a config change forty minutes earlier.",
      "At 14:02 the service returned errors. We have deployed a config change forty minutes earlier."
    ],
    a: 1,
    x: "Past perfect (`had deployed`) is exactly the tense for something already done before another past point. That is its only job.",
    note: "*We deployed a config change forty minutes earlier* is understandable and most people would accept it. But past perfect is what makes the ordering explicit rather than implied — and in an incident report, ordering is the whole document."
  },
  {
    tag: "Tenses", lvl: "core",
    q: "Which softens the request most, without changing the information?",
    o: [
      "What do you want?",
      "What were you looking for?",
      "Tell me what you want.",
      "What is it you want?"
    ],
    a: 1,
    x: "The past continuous makes the question tentative and helpful rather than blunt. It is the most useful softener in English.",
    note: "*I was wondering if…* works the same way: a past continuous describing a present wish, which makes no logical sense and is nonetheless the standard polite request. Learn it as a fixed phrase."
  },
  {
    tag: "Articles", lvl: "core",
    q: "Which sentence uses *a* and *an* correctly?",
    o: [
      "She is an university lecturer with a MBA.",
      "She is a university lecturer with an MBA.",
      "She is a university lecturer with a MBA.",
      "She is an university lecturer with an MBA."
    ],
    a: 1,
    x: "*a/an* follows the **sound**, not the letter. *University* starts with a `yoo` sound, so *a*. *MBA* starts with the sound `em`, so *an*.",
    steps: [
      "Say the word out loud and listen to the first sound.",
      "Consonant sound → **a**: a university, a European, a one-off, a user.",
      "Vowel sound → **an**: an MBA, an hour, an SQL query, an FAQ.",
      "The spelling is a decoy every single time."
    ]
  },
  {
    tag: "Articles", lvl: "intermediate",
    q: "Which sentence uses articles correctly?",
    o: [
      "I sent you a feedback on the design.",
      "I sent you feedback on the design.",
      "I sent you the feedback on a design.",
      "I sent you an feedback on the design."
    ],
    a: 1,
    x: "*Feedback* is uncountable in English, so it takes no article and never pluralises. *A feedback* and *feedbacks* are both wrong.",
    note: "The uncountables that catch people at work: **feedback, information, advice, research, equipment, software, staff, progress, work, training**. Say *a piece of feedback* if you need to count one."
  },
  {
    tag: "Prepositions", lvl: "core",
    q: "Complete: *The rollout depends ___ the security review, and I am responsible ___ the migration.*",
    o: ["on / for", "of / of", "from / to", "on / of"],
    a: 0,
    x: "*Depend* takes **on**; *responsible* takes **for**. Neither is deducible — they are fixed pairings you memorise with the verb.",
    note: "The ones most often wrong at work: *depend **on***, *responsible **for***, *consist **of***, *discuss* (no preposition — never *discuss about*), *married **to***, *good **at***, *interested **in***, *reason **for***."
  },
  {
    tag: "Prepositions", lvl: "intermediate",
    q: "Which sentence uses *discuss* correctly?",
    o: [
      "Let us discuss about the timeline in the meeting.",
      "Let us discuss the timeline in the meeting.",
      "Let us discuss on the timeline in the meeting.",
      "Let us discuss for the timeline in the meeting."
    ],
    a: 1,
    x: "*Discuss* is transitive — it takes its object directly. *Discuss about* is the single most common preposition error in Indian and South-East Asian professional English.",
    note: "The noun does take one: *a discussion **about** the timeline*. Only the verb refuses it."
  },
  {
    tag: "Agreement", lvl: "intermediate",
    q: "Which verb agrees with its subject?",
    o: [
      "The list of open issues are getting longer.",
      "The list of open issues is getting longer.",
      "The list of open issues were getting longer.",
      "The lists of open issue is getting longer."
    ],
    a: 1,
    x: "The subject is **list** (singular), not *issues*. The prepositional phrase `of open issues` sits between them and is not part of the subject.",
    steps: [
      "Find the head noun of the subject: *the **list*** …",
      "Delete everything between it and the verb: *the list … is getting longer.*",
      "The noun nearest the verb is a decoy — English agrees with the head, not with the closest word."
    ]
  },
  {
    tag: "Agreement", lvl: "advanced",
    q: "Which sentence handles *neither … nor* correctly?",
    o: [
      "Neither the manager nor the engineers has signed off.",
      "Neither the manager nor the engineers have signed off.",
      "Neither the manager nor the engineers signs off.",
      "Neither the manager or the engineers have signed off."
    ],
    a: 1,
    x: "With *neither … nor*, the verb agrees with the **nearer** subject. *Engineers* is plural and sits closest, so *have*.",
    note: "Reverse the order and the verb flips: *Neither the engineers nor the manager **has** signed off.* *Neither the manager or the engineers* also fails — *neither* pairs with *nor*, never with *or*."
  },
  {
    tag: "Modals", lvl: "intermediate",
    q: "You are telling a colleague about a rule imposed by the security team, not by you. Which fits best?",
    o: [
      "You must rotate the key every ninety days.",
      "You have to rotate the key every ninety days.",
      "You should rotate the key every ninety days.",
      "You may rotate the key every ninety days."
    ],
    a: 1,
    x: "*Have to* reports an obligation that comes from **outside** the speaker. *Must* sounds like you are personally imposing it.",
    steps: [
      "**must** — the authority is me, or it is a law of nature. Strong, and easily heard as bossy from a peer.",
      "**have to** — the authority is somewhere else. This is the safe default at work.",
      "**should** — advice, not obligation. Says the rule is optional, which here is wrong.",
      "**may** — permission. Says the opposite of what you meant."
    ]
  },
  {
    tag: "Conditionals", lvl: "intermediate",
    q: "The migration did not happen and the outage did. Which sentence describes that correctly?",
    o: [
      "If we migrate earlier, we avoid the outage.",
      "If we migrated earlier, we would avoid the outage.",
      "If we had migrated earlier, we would have avoided the outage.",
      "If we would have migrated earlier, we had avoided the outage."
    ],
    a: 2,
    x: "The third conditional — `if + had + past participle, would have + past participle` — is the one for a past that did not happen.",
    steps: [
      "**First** (`if we migrate, we avoid`) — a real future possibility.",
      "**Second** (`if we migrated, we would avoid`) — unreal present or future.",
      "**Third** (`if we had migrated, we would have avoided`) — unreal past. Regret, blame, post-mortems.",
      "*If we would have migrated* is the classic error: *would have* never goes in the `if` clause."
    ]
  },
  {
    tag: "Punctuation", lvl: "core",
    q: "Which sentence is punctuated correctly?",
    o: [
      "The build passed, we can deploy.",
      "The build passed we can deploy.",
      "The build passed; we can deploy.",
      "The build passed: we can deploy,"
    ],
    a: 2,
    x: "Two complete sentences cannot be joined by a comma — that is a **comma splice**. A semicolon, a full stop, or a comma plus *and/so* all fix it.",
    note: "The comma splice is the most common punctuation error in professional writing, and unlike most errors it is invisible to the writer and obvious to the reader."
  },
  {
    tag: "Punctuation", lvl: "core",
    q: "Which sentence gets *its* and *it's* right?",
    o: [
      "The service lost it's connection because of its' timeout.",
      "The service lost its connection because of its timeout.",
      "The service lost its' connection because of it's timeout.",
      "The service lost it's connection because of its timeout."
    ],
    a: 1,
    x: "**its** = belonging to it. **it's** = it is / it has. *its'* is not a word in English at all.",
    note: "The test that never fails: read *it's* aloud as *it is*. If the sentence still works, the apostrophe is right. If it does not, drop it."
  },
  {
    tag: "Structure", lvl: "advanced",
    q: "Which sentence has a **dangling modifier**?",
    o: [
      "After reviewing the logs, we found the root cause.",
      "After reviewing the logs, the root cause became obvious.",
      "After we reviewed the logs, the root cause became obvious.",
      "We found the root cause after reviewing the logs."
    ],
    a: 1,
    x: "The opening phrase must attach to the subject that follows it. In B the subject is *the root cause* — which did not review any logs.",
    steps: [
      "Read the opening phrase, then ask: *who did that?*",
      "The answer must be the subject of the main clause, immediately after the comma.",
      "In B the subject is *the root cause*, so the sentence literally claims the root cause reviewed the logs.",
      "Fix it either by changing the subject (A, D) or by giving the phrase its own subject (C)."
    ]
  }

]);


TD.addMCQ("english", "vocab", [

  {
    tag: "Confusables", lvl: "core",
    q: "Which sentence gets *affect/effect* and *advise/advice* right?",
    o: [
      "The outage will effect all users, so please advice them.",
      "The outage will affect all users, so please advise them.",
      "The outage will affect all users, so please advice them.",
      "The outage will effect all users, so please advise them."
    ],
    a: 1,
    x: "**Affect** is the verb, **effect** the noun. **Advise** is the verb, **advice** the noun. Both pairs follow the same shape.",
    note: "The memory hook: **A**ffect = **A**ction (verb); **E**ffect = **E**nd result (noun). *Effect* is a verb only in the narrow sense *to bring about*: `to effect a change`."
  },
  {
    tag: "Confusables", lvl: "intermediate",
    q: "Choose the correct pair: *We need to ___ the number of retries, which will have a positive ___ on latency.*",
    o: ["reduce / affect", "reduce / effect", "deduce / effect", "reduce / effects"],
    a: 1,
    x: "*Effect* here follows the article *a* and the adjective *positive*, so it must be a noun. Nouns take *effect*.",
    note: "A reliable shortcut: if you can put *the*, *a* or an adjective in front of it, you need **effect**."
  },
  {
    tag: "Confusables", lvl: "intermediate",
    q: "Which sentence uses *than* correctly?",
    o: [
      "The new process is more efficient then the old one.",
      "The new process is more efficient than the old one.",
      "The new process is more efficient, then the old one.",
      "The new process is more efficient than the old one was better."
    ],
    a: 1,
    x: "**Than** compares. **Then** is time or consequence. They are not interchangeable in any context.",
    note: "*Then* answers *when*; *than* answers *compared with what*. The vowel is the whole difference and it is worth slowing down for."
  },
  {
    tag: "Confusables", lvl: "advanced",
    q: "Which sentence uses *comprise* correctly?",
    o: [
      "The system is comprised of four services.",
      "The system comprises four services.",
      "The system comprises of four services.",
      "Four services are comprised in the system."
    ],
    a: 1,
    x: "The whole **comprises** the parts. No *of*, and no passive — *is comprised of* is the error, however common it has become.",
    note: "If you want the *of*, use a different verb: *the system **consists of** four services*, or *four services **make up** the system*. Both are unimpeachable."
  },
  {
    tag: "Register", lvl: "intermediate",
    q: "Which version sounds most senior in a design document?",
    o: [
      "I think maybe we should probably use a queue here.",
      "We should use a queue here.",
      "A queue is the right fit here, because the producer and consumer scale independently.",
      "It might possibly be a good idea to consider using a queue."
    ],
    a: 2,
    x: "Seniority in writing is a claim plus its reason. Hedges without reasons read as uncertainty; a reason makes the same sentence a position.",
    steps: [
      "Options A and D stack hedges — *think + maybe + should + probably*. Each one alone is fine; together they say *do not hold me to this*.",
      "*We should use a queue here* is direct but bare. A reader can only agree or disagree, not evaluate.",
      "Naming the criterion — *because the producer and consumer scale independently* — states the position **and** the reasoning, which is what invites a useful reply.",
      "Hedge the claim if you must, never the reasoning."
    ]
  },
  {
    tag: "Register", lvl: "intermediate",
    q: "Rank these three by register, lowest first: (i) *We need to get this sorted.* (ii) *This requires resolution before release.* (iii) *We should resolve this before we ship.*",
    o: ["i, iii, ii", "ii, iii, i", "iii, i, ii", "i, ii, iii"],
    a: 0,
    x: "*Get this sorted* is informal spoken English; *we should resolve this* is neutral professional; *requires resolution* is formal, and in most workplaces slightly stiff.",
    note: "Neutral is the correct default for almost all workplace writing. Formal register is not more professional — used in a Slack channel it reads as distance, or as a complaint."
  },
  {
    tag: "Collocations", lvl: "intermediate",
    q: "Which collocation is standard English?",
    o: ["do a decision", "make a decision", "take a decision quickly is wrong", "perform a decision"],
    a: 1,
    x: "English says **make** a decision. *Take a decision* exists in British and Indian English and is accepted; *do* and *perform* are not.",
    note: "The workhorses: **make** a decision, a mistake, progress, an effort, an exception. **Do** business, research, a favour, damage, your best. There is no rule — they are learned as pairs."
  },
  {
    tag: "Collocations", lvl: "core",
    q: "Complete: *I would like to ___ your attention to the third row of the table.*",
    o: ["bring", "draw", "take", "put"],
    a: 1,
    x: "**Draw** attention to is the fixed collocation. *Bring to your attention* also exists, but with a different shape: `bring X to your attention`.",
    note: "Both are correct in their own frame — *draw your attention **to** X*, *bring X **to** your attention*. Mixing the two frames is what sounds wrong."
  },
  {
    tag: "Phrasal verbs", lvl: "intermediate",
    q: "*The meeting was called off.* Which single verb replaces it in formal writing?",
    o: ["postponed", "cancelled", "shortened", "rescheduled"],
    a: 1,
    x: "*Call off* means cancel outright. *Postpone* and *reschedule* both imply it will happen later, which *call off* does not say.",
    note: "The register trade: phrasal verbs are natural in speech and slightly informal in writing. Formal documents prefer the Latin-root single word — *cancel*, *postpone*, *investigate* over *call off*, *put off*, *look into*."
  },
  {
    tag: "Phrasal verbs", lvl: "advanced",
    q: "Which sentence uses the phrasal verb correctly?",
    o: [
      "We need to look into it the issue.",
      "We need to look the issue into.",
      "We need to look into the issue.",
      "We need to look it into."
    ],
    a: 2,
    x: "*Look into* is **inseparable** — the object always follows the whole phrase, and a pronoun cannot split it.",
    steps: [
      "**Separable**: `turn the meeting down` / `turn it down`. A pronoun *must* go in the middle.",
      "**Inseparable**: `look into the issue` / `look into it`. A pronoun *must* go after.",
      "There is no way to tell which is which from the words — this is memorised per verb.",
      "The safe test: try it with *it*. If `look it into` sounds wrong, the verb is inseparable."
    ]
  },
  {
    tag: "Roots", lvl: "intermediate",
    q: "*Ambiguous*, *ambidextrous* and *ambivalent* share the root **ambi-**. What does it mean?",
    o: ["against", "both / around", "beyond", "not"],
    a: 1,
    x: "**ambi-** = both. Ambiguous = readable both ways; ambidextrous = both hands; ambivalent = feeling both ways at once.",
    note: "Roots are the highest-leverage vocabulary work there is: **ambi-** (both), **circum-** (around), **inter-** (between), **intra-** (within), **anti-** (against), **ante-** (before). One root unlocks a dozen words you have never seen."
  },
  {
    tag: "Roots", lvl: "advanced",
    q: "Given **inter-** = between and **intra-** = within, which is the correct term for traffic that never leaves one data centre?",
    o: ["inter-datacentre traffic", "intra-datacentre traffic", "internal-datacentre traffic", "intro-datacentre traffic"],
    a: 1,
    x: "*Intra-* means within a single thing. *Inter-* means between separate things, which would be traffic crossing from one data centre to another.",
    note: "Same pair everywhere in engineering: *intranet* (within a company) vs *internet* (between networks); *intra-process* vs *inter-process*. Mixing them inverts your meaning completely, and the reader will not always catch it."
  },
  {
    tag: "Precision", lvl: "advanced",
    q: "In a performance review, which verb claims the most **ownership** of the work?",
    o: ["Helped with the migration", "Was involved in the migration", "Led the migration", "Participated in the migration"],
    a: 2,
    x: "*Led* names you as the person accountable. The other three are all true of someone who attended the meetings.",
    note: "Review season is compressed into a paragraph someone else skims. Weak verbs — *helped*, *supported*, *was involved in*, *worked on* — describe presence. Strong verbs — *led*, *designed*, *shipped*, *cut*, *owned* — describe contribution, and they carry a salary."
  },
  {
    tag: "Precision", lvl: "intermediate",
    q: "Which sentence is the tightest?",
    o: [
      "Due to the fact that the queue was full, we were unable to process the request at this point in time.",
      "Because the queue was full, we could not process the request.",
      "On account of the queue being in a full state, request processing was not able to occur.",
      "The queue being full, processing of the request was unable to be performed by us."
    ],
    a: 1,
    x: "*Due to the fact that* is always *because*. *At this point in time* is always *now*, or nothing. *Were unable to* is *could not*.",
    steps: [
      "Delete the padding phrases first — they carry no information at all.",
      "Turn passive back into active: *processing was not able to occur* → *we could not process*.",
      "Prefer the short Anglo-Saxon word to the long Latin one when both say the same thing.",
      "The result is roughly half the length and reads as more confident, not less formal."
    ]
  }

]);


TD.addMCQ("english", "write", [

  {
    tag: "Email", lvl: "core",
    q: "Which subject line is most likely to get a same-day reply?",
    o: [
      "Quick question",
      "Following up",
      "Approval needed by Thu: staging DB access for the migration",
      "Important — please read"
    ],
    a: 2,
    x: "It names the action, the deadline and the subject. The reader can triage it without opening it, which is the only job a subject line has.",
    note: "*Quick question* is the most-ignored subject line in professional English, because it tells a busy person nothing about whether to open it now or at five."
  },
  {
    tag: "Email", lvl: "intermediate",
    q: "Where should the **ask** go in a work email?",
    o: [
      "At the end, after the full context, so the reader understands it",
      "In the first line or two, before the context",
      "In the subject line only",
      "Split across the middle paragraphs"
    ],
    a: 1,
    x: "Busy readers scan the top and stop. Context that arrives before the ask is context nobody has a reason to read yet.",
    steps: [
      "Line 1: what you need and by when.",
      "Lines 2-4: the minimum context that makes it answerable.",
      "Anything else: below, or in a link.",
      "This inverts how most people were taught to write, and it is the single highest-return change in workplace email."
    ]
  },
  {
    tag: "Saying no", lvl: "intermediate",
    q: "You cannot take on a request. Which reply is most professional?",
    o: [
      "Sorry, I am really busy right now, maybe later?",
      "I cannot take this on this week. I could start it on Monday, or Priya has context if it cannot wait.",
      "Unfortunately due to my current workload I am unable to accommodate this request at this time.",
      "No, I have too much on."
    ],
    a: 1,
    x: "A good refusal is short, gives a real boundary, and offers a path forward. It does not apologise, and it does not explain itself at length.",
    steps: [
      "Say no clearly — *I cannot* beats *I am not sure I can*.",
      "Give the constraint, not the excuse: *this week*, not *I am really busy*.",
      "Offer one alternative. This is what turns a refusal into help.",
      "Stop. Every extra sentence of justification invites negotiation."
    ]
  },
  {
    tag: "Chasing", lvl: "intermediate",
    q: "Second follow-up on an unanswered request. Which opening is best?",
    o: [
      "Just checking in again on this…",
      "Sorry to bother you again, but…",
      "Following up on the access request below — I need it by Thursday to keep the migration on schedule.",
      "Did you see my last email?"
    ],
    a: 2,
    x: "It restates the ask, adds the deadline and gives the consequence. The other three add a message to the inbox without adding information.",
    note: "*Did you see my last email?* reads as an accusation even when it is not meant as one — in writing there is no tone of voice to rescue it."
  },
  {
    tag: "Status", lvl: "core",
    q: "Which status update is most useful to a manager?",
    o: [
      "Still working on the migration.",
      "Migration is 60% done. Blocked on staging DB access — raised with IT Tuesday. On track for Friday if unblocked today.",
      "Making good progress on the migration, should be done soon.",
      "The migration is going well, lots of progress this week, will update again shortly."
    ],
    a: 1,
    x: "State, blocker, owner of the blocker, and the date. A status update exists to let someone decide whether to intervene.",
    note: "The shape that always works: **where it is · what is in the way · who is on it · when it lands**. Anything that does not answer one of those four is decoration."
  },
  {
    tag: "Apologising", lvl: "intermediate",
    q: "You missed a deadline. Which is the strongest reply?",
    o: [
      "I am so sorry, things have been really hectic, I feel terrible about this.",
      "Apologies for the delay. The report is with you now, and I will flag any slippage two days ahead in future.",
      "Sorry! Attached.",
      "Apologies — this was delayed because the data team was late giving me the extract."
    ],
    a: 1,
    x: "Apologise once, deliver, and state the change. Length of apology is not a measure of sincerity; the fix is.",
    steps: [
      "One apology, not three. Repeating it makes the reader manage your feelings.",
      "Lead with the resolution — *the report is with you now*.",
      "Name what will be different next time. This is the part that rebuilds trust.",
      "Blaming the data team in writing, in a thread that will be forwarded, is the one move to avoid entirely — whatever the truth of it."
    ]
  },
  {
    tag: "Escalation", lvl: "advanced",
    q: "You are escalating a blocker to your manager's manager. Which framing is right?",
    o: [
      "The infra team has been ignoring my requests for a week.",
      "I have been blocked on staging access since Tuesday. I have raised it twice with the infra queue. It puts the Friday date at risk — could you help unblock it?",
      "Nothing is moving and I am not sure anyone cares about this deadline.",
      "Can you please tell the infra team to prioritise my ticket?"
    ],
    a: 1,
    x: "Escalation is about the **blocker and the risk**, never about the people. Facts, what you already tried, the business impact, one specific ask.",
    note: "The rule that keeps escalations safe: describe the situation so accurately that the person you are escalating about would agree with your description."
  },
  {
    tag: "Tone", lvl: "intermediate",
    q: "Which Slack message is most likely to be read as hostile, even though none is intended to be?",
    o: [
      "Can you take a look at this when you get a chance?",
      "As per my previous message, the config is in the repo.",
      "I might be missing something — where does the config live?",
      "Thanks for picking this up."
    ],
    a: 1,
    x: "*As per my previous message* has no neutral reading in asynchronous English. It exists to point out that someone did not read something.",
    note: "Async writing carries tone entirely through word choice — there is no face and no voice to soften anything. The phrases to retire: *as per my previous message*, *as I already said*, *per my last email*, *just following up again*, *any update?* on its own."
  },
  {
    tag: "Requests", lvl: "core",
    q: "Which is the most polite way to ask a busy senior colleague for fifteen minutes?",
    o: [
      "I need 15 minutes with you.",
      "Could you give me 15 minutes?",
      "I was hoping to get fifteen minutes with you this week to agree the rollout order — would Thursday morning work?",
      "Are you free at any point? It would be great to chat."
    ],
    a: 2,
    x: "It softens with *was hoping*, states the purpose so they can judge the value, and proposes a slot so the reply is one word.",
    steps: [
      "Soften the ask: *I was hoping to* rather than *I need*.",
      "Name the purpose. Nobody can prioritise *a chat*.",
      "Propose a time. Every question you leave open is work you have handed to a busier person.",
      "*Are you free at any point? It would be great to chat* fails on all three, which is why it usually gets no reply at all."
    ]
  },
  {
    tag: "Clarity", lvl: "intermediate",
    q: "Which sentence is clearest in a bug report?",
    o: [
      "The thing is not working properly sometimes.",
      "Login fails intermittently.",
      "Login returns a 500 for roughly 1 in 20 attempts on Safari 17, since the Tuesday deploy.",
      "There seems to be an issue with the login functionality that may be occurring."
    ],
    a: 2,
    x: "It gives the symptom, the rate, the environment and the onset. A bug report is only as useful as it is reproducible.",
    note: "*Intermittently* is honest but not actionable. *One in twenty on Safari 17 since Tuesday* tells an engineer where to look before they have opened anything."
  },
  {
    tag: "Openers", lvl: "core",
    q: "Which email opener is best when you have **never met** the recipient?",
    o: [
      "Hey!",
      "Dear Sir/Madam,",
      "Hi Anjali — I am on the platform team and we are picking up the auth migration you scoped last quarter.",
      "To whom it may concern,"
    ],
    a: 2,
    x: "Name, your context, and why you are writing to *them specifically*. That is what makes a cold email answerable.",
    note: "*Dear Sir/Madam* and *To whom it may concern* both signal that you did not find out who you are writing to — which is now trivially easy and therefore reads as carelessness."
  },
  {
    tag: "Closing", lvl: "intermediate",
    q: "Which closing line most reliably produces a reply?",
    o: [
      "Let me know your thoughts.",
      "Thanks in advance.",
      "Could you confirm by Thursday whether staging access is possible? If it is not, I will plan around it.",
      "Looking forward to hearing from you."
    ],
    a: 2,
    x: "One question, one deadline, and a stated consequence if the answer is no. The other three ask for nothing specific and are easy to defer.",
    note: "*Thanks in advance* quietly presumes agreement and irritates some readers; *let me know your thoughts* invites an essay nobody has time to write."
  }

]);
