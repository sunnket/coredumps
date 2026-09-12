/* Professional English — speaking sessions.

   Everything else in this track can be read. These cannot: they only work
   with your voice, out loud, and with the microphone listening.

   Each session is a set of activities of four kinds, and the engine scores
   each kind differently:

     read     a script is given; marked word for word
     repeat   a short drill line; marked strictly on accuracy
     shadow   the browser speaks the model first, then you repeat it
     prompt   an open question; marked on the points covered, on pace,
              on filler density and on length against the brief

   Two authoring rules make the scoring honest. `expect` items are
   pipe-separated alternatives — "trade-off|tradeoff|compromise" — because
   there is never one right word, and marking a synonym wrong is how a
   scorer loses a learner's trust in a single take. `avoid` items are the
   junior phrasings the activity is specifically training you out of; they
   cost marks only when the brief has told you they will.
*/
TD.addSpeakSessions([

  /* ---------------- meetings, disagreement, pushback ---------------- */

  {
    id: "disagree-safely",
    t: "Disagreeing without damage",
    m: "speak",
    lvl: "core",
    icon: "chat",
    s: "The highest-stakes twenty seconds in professional life, drilled until the construction arrives before the adrenaline does.",
    why: "Disagreement is where careers are made and lost, and there is a small set of English constructions that make it safe. Most people know none of them, and improvise under pressure — which is exactly when improvising fails.",
    goal: [
      "Open a disagreement by conceding something true, out loud, without hesitating",
      "State one specific concern rather than a general objection",
      "End on a question that moves the room to solving rather than defending"
    ],
    coach: [
      "The shape is always the same: **concede, then name one concern, then ask.** Learn it as a fixed sequence, because under pressure you will not invent it.",
      "Concede something genuinely true. A fake concession is heard instantly and costs more than saying nothing.",
      "One concern. Two concerns sound like opposition; three sound like you have decided already.",
      "Keep your pitch falling at the end of each sentence. A disagreement delivered on a rising tone reads as asking permission to disagree."
    ],
    acts: [
      {
        kind: "repeat",
        t: "The concession",
        brief: "The first move, said cleanly. This is the sentence that buys you the right to object.",
        text: "That is a fair point on cost, and I had not weighted it as heavily as you have.",
        tip: "Say it at normal conversational speed. Rushing the concession makes it sound like a formality you are getting out of the way — which is exactly what it must not sound like."
      },
      {
        kind: "repeat",
        t: "The specific concern",
        brief: "Name one thing. Notice how much stronger a dated, concrete worry sounds than a general one.",
        text: "My concern is the migration window. If the security review slips even a week, we lose the whole weekend slot.",
        tip: "Stress *migration window* and *a week*. The specifics are what make this a contribution rather than an objection."
      },
      {
        kind: "repeat",
        t: "The handover question",
        brief: "End by giving the problem back to the room.",
        text: "Could we look at what happens if the review does slip, before we commit to the date?",
        tip: "Let your pitch fall on *date*. Rising here turns a proposal into a plea."
      },
      {
        kind: "prompt",
        t: "Put it together, cold",
        brief: "Your manager has just proposed shipping on the 12th. You think the security review makes that impossible. Disagree, out loud, in one go — concede, state your concern, end on a question.",
        secs: 45,
        expect: [
          "fair point|good point|agree|understand|take the point",
          "concern|worry|risk|issue",
          "security review|review",
          "could we|can we|what if|would it be worth|shall we"
        ],
        avoid: ["with respect|with all due respect", "you are wrong|that is wrong|that will not work"],
        tip: "Say the whole thing without stopping, even if a sentence comes out clumsy. Stopping to restart is the habit this activity exists to break."
      },
      {
        kind: "prompt",
        t: "The harder version — disagreeing upwards",
        brief: "The same objection, but the proposal came from someone two levels above you, in front of their peers. Same structure, more care.",
        secs: 45,
        expect: [
          "fair point|good point|understand|appreciate|see the logic",
          "concern|worry|risk",
          "could we|can we|what if|would it be worth|might be worth"
        ],
        avoid: ["with respect|with all due respect", "obviously", "just"],
        tip: "The structure does not change. What changes is that you slow down and let the concession land properly before moving on."
      }
    ]
  },

  {
    id: "standup-ninety",
    t: "The ninety-second standup",
    m: "speak",
    lvl: "core",
    icon: "clock",
    s: "Blocker first, then state, then plan — and stop. The most-repeated speaking task in an engineer's week, and the one nobody rehearses.",
    why: "You will give roughly two hundred standups a year. A rambling one costs the whole team a minute each time and quietly builds an impression of you that is very hard to correct later.",
    goal: [
      "Lead with the blocker rather than burying it at the end",
      "Give a status that includes a number and a date",
      "Finish inside ninety seconds without trailing off"
    ],
    coach: [
      "The conventional order — yesterday, today, blockers — puts the only urgent item last, by which point half the room has stopped listening. Invert it.",
      "A blocker needs three things: what is blocked, who owns the unblock, and since when.",
      "End on a full stop, not on a trailing *…so, yeah*. The ending is what people remember about how confident you sounded."
    ],
    acts: [
      {
        kind: "read",
        t: "A model standup",
        brief: "Read it aloud once, at the pace you would actually use in a meeting.",
        text: "Blocked on staging database access since Tuesday. It is with the infra queue and I have chased it twice. The migration script is written and tested locally, about sixty per cent of the work. If access lands today, Friday still holds. If not, it moves to Monday and I will flag it.",
        tip: "Aim for roughly 130 words a minute. Faster than that and the numbers stop landing."
      },
      {
        kind: "repeat",
        t: "The blocker line alone",
        brief: "The single most important sentence. Drill it until it is automatic.",
        text: "Blocked on staging database access since Tuesday. It is with the infra queue and I have chased it twice.",
        tip: "Notice there is no apology and no preamble. *Sorry, I am still a bit stuck on…* wastes the sentence that matters most."
      },
      {
        kind: "prompt",
        t: "Your own standup",
        brief: "Give a standup about anything you are genuinely working on — real or invented. Blocker first, then where the work stands with a number, then the date. Ninety seconds maximum.",
        secs: 60,
        expect: ["blocked|blocker|waiting on|held up|no blocker|nothing blocking", "today|tomorrow|friday|monday|this week|next week"],
        avoid: ["sorry", "just", "kind of|sort of"],
        tip: "If you genuinely have no blocker, say so in three words and move on. *No blockers* is a complete sentence."
      },
      {
        kind: "prompt",
        t: "The bad-news standup",
        brief: "Something has slipped and you have to say so. Give the update: what slipped, why, the new date, and what you are doing about it. No apologising more than once.",
        secs: 60,
        expect: ["slipped|delayed|late|behind|missed", "because|due to|caused by|the reason", "new date|now|by|next"],
        avoid: ["sorry|apologies|apologise", "hopefully", "try my best|do my best"],
        tip: "Bad news delivered early and plainly damages your credibility far less than good news that turns out to be wrong. Say the date you actually believe."
      }
    ]
  },

  {
    id: "pushback-deadline",
    t: "Pushing back on a deadline",
    m: "speak",
    lvl: "intermediate",
    icon: "target",
    s: "Never argue about the date. Trade scope, time or people — out loud, in one breath, without sounding difficult.",
    why: "*I will try my best* is heard as yes, and you will be held to it. The alternative is not refusal; it is a trade, and it takes one well-formed sentence you have to be able to produce under pressure.",
    goal: [
      "Refuse a combination of scope and date without refusing the person",
      "Offer two genuine options with named costs",
      "Hand the decision back rather than making it yourself"
    ],
    coach: [
      "Never say *that is not possible*. Say what **is** possible, and what it would cost to get more.",
      "Two options, not one and not three. One reads as a refusal dressed up; three reads as avoidance.",
      "End by handing the choice over: *which would you prefer?* That sentence is what keeps the relationship intact."
    ],
    acts: [
      {
        kind: "repeat",
        t: "The trade sentence",
        brief: "The core construction. Everything else in this session is a variation on it.",
        text: "I can have it done by the twelfth if we drop the reporting screen. If both are needed, I would need another engineer from Monday.",
        tip: "No hedging, no apology. This is a factual statement about capacity, and it should sound like one."
      },
      {
        kind: "repeat",
        t: "Handing back the decision",
        brief: "The closing move that turns a pushback into a collaboration.",
        text: "Which of those would you prefer?",
        tip: "Five words, falling tone, then stop talking. The silence after this question is the point of it — do not fill it."
      },
      {
        kind: "prompt",
        t: "The full pushback",
        brief: "You have been asked to deliver two features by Friday. You can do one. Push back: state what you can do, give a second option with its cost, and hand the choice back.",
        secs: 45,
        expect: ["i can|i could|able to", "if|either|or|alternatively", "would you prefer|which|your call|up to you|let me know which"],
        avoid: ["try my best|do my best", "impossible|not possible", "sorry"],
        tip: "Resist the urge to explain how busy you are. Your workload is not the argument; the trade is."
      },
      {
        kind: "prompt",
        t: "When they push back on your pushback",
        brief: "They reply: *I hear you, but the client has already been told Friday.* Respond — hold the trade, acknowledge the constraint, do not cave and do not escalate.",
        secs: 45,
        expect: ["understand|i see|appreciate|that is difficult", "still|however|even so|in that case", "what i can|the options|realistic"],
        avoid: ["fine|okay then|i will manage|i will figure it out"],
        tip: "The second round is where most people fold. Repeating your trade calmly, once, is usually all that is needed."
      }
    ]
  },

  /* ---------------- presenting ---------------- */

  {
    id: "filler-free",
    t: "Killing your fillers",
    m: "present",
    lvl: "core",
    icon: "wave",
    s: "You cannot fix what you have never counted. This session counts them, names them, and makes you sit in the silence instead.",
    why: "Filler words are the single most audible difference between someone who sounds senior and someone who does not. They are also invisible to the speaker — almost nobody believes their own rate until a machine reports it back.",
    goal: [
      "Find out your actual filler rate per hundred words",
      "Replace a filler with a silent pause and survive the discomfort",
      "Hold a forty-five-second answer under two fillers"
    ],
    coach: [
      "Fillers exist to hold the floor while you think. Silence does the same job and reads as composure rather than searching.",
      "Speaking faster makes it worse, not better: less thinking time means more *um*.",
      "The silence feels enormous to you and is barely noticed by anyone listening. That mismatch is the whole difficulty, and the only cure is repetition.",
      "Watch for the quiet fillers too — *basically*, *actually*, *literally*, *you know*, *sort of*. They cost more than *um* because they sound like content."
    ],
    acts: [
      {
        kind: "prompt",
        t: "The baseline — do not try to be good",
        brief: "Talk for sixty seconds about what you did at work yesterday. Speak completely naturally. The point is an honest measurement, so do not tidy your speech up.",
        secs: 60,
        expect: [],
        tip: "Genuinely do not try. A cleaned-up baseline gives you a number you cannot improve on and tells you nothing."
      },
      {
        kind: "read",
        t: "A clean model, for calibration",
        brief: "Read this aloud. It contains no fillers at all — notice how the pauses at the full stops do the work instead.",
        text: "We looked at three options. The first was the cheapest and it would not have scaled past next year. The second scaled well and needed a team we do not have. We chose the third, which is slower to build and which we can actually run.",
        tip: "Take a real breath at each full stop. Those four pauses are doing exactly the job your fillers currently do."
      },
      {
        kind: "prompt",
        t: "The same topic, silence instead",
        brief: "Describe yesterday's work again, for sixty seconds. Every time you feel an *um* arriving, close your mouth and pause instead. Aim for under two fillers.",
        secs: 60,
        expect: [],
        avoid: ["basically", "you know", "sort of|kind of"],
        tip: "You will feel the pauses are far too long. They are not. Compare the two scores rather than trusting the feeling."
      },
      {
        kind: "prompt",
        t: "Under pressure",
        brief: "Explain something technical you know well to a non-technical listener, for sixty seconds. Fillers multiply when the content gets harder — that is what this activity is measuring.",
        secs: 60,
        expect: [],
        avoid: ["basically", "you know", "literally", "obviously"],
        tip: "Decide your three beats before you press record. Most fillers are a structure problem wearing a vocabulary costume."
      }
    ]
  },

  {
    id: "open-strong",
    t: "The first fifteen seconds",
    m: "present",
    lvl: "intermediate",
    icon: "spark",
    s: "Openings decide how much attention you get for the rest of the talk. Most people spend theirs on a table of contents.",
    why: "*Today I am going to talk about…* spends your single best moment describing the talk instead of giving it. The alternative is one sentence with a number, a tension or a question in it.",
    goal: [
      "Open on the stake rather than the agenda",
      "Deliver a first line without hedging or throat-clearing",
      "Hold a falling tone through the opening sentence"
    ],
    coach: [
      "Give the number, the tension or the question first. The agenda can wait, or go unsaid.",
      "Cut every word before your first real sentence. *So*, *right*, *okay*, *hi everyone* — all of it is throat-clearing.",
      "The first sentence should be short. Long opening sentences almost always start hedging halfway through."
    ],
    acts: [
      {
        kind: "shadow",
        t: "A strong opening, modelled",
        brief: "Hear it first, then say it back with the same rhythm and the same falling ending.",
        text: "We spend forty thousand pounds a month on capacity we never use. Here is how we stop.",
        tip: "Note the pause after *use*. It is short, deliberate, and it is what makes the second sentence land."
      },
      {
        kind: "repeat",
        t: "The question opening",
        brief: "A different shape, same principle — no preamble.",
        text: "How long does it take us to ship a one-line change? Nobody in this room agrees, and that is the problem.",
        tip: "Let the question hang for a beat before answering it. Rushing past your own question wastes it."
      },
      {
        kind: "prompt",
        t: "Open a talk about your own work",
        brief: "Give the first fifteen to twenty seconds of a talk about something you have actually worked on. No agenda, no introduction of yourself — open on the stake.",
        secs: 20,
        expect: [],
        avoid: ["today i am going to talk about|today i will talk about", "a bit about myself|about myself first", "so", "um"],
        tip: "Twenty seconds is deliberately short. If you are still setting up when the time runs out, the opening was an agenda."
      },
      {
        kind: "prompt",
        t: "The same opening for a hostile room",
        brief: "Same talk, but the audience has heard three proposals like yours and rejected them all. Open in a way that acknowledges that without apologising for being there.",
        secs: 30,
        expect: [],
        avoid: ["sorry", "i know you have heard|i know this is", "hopefully", "just"],
        tip: "Acknowledging is not apologising. *This is the fourth version of this proposal. Here is what is different* does both jobs in two sentences."
      }
    ]
  },

  {
    id: "sound-certain",
    t: "Sounding certain — the falling terminal",
    m: "present",
    lvl: "intermediate",
    icon: "wave",
    s: "A statement whose pitch rises at the end is heard as a question. The content can be exactly right and still land as unsure.",
    why: "This is the fastest audible change most non-native speakers can make to how senior they sound, and it has nothing to do with vocabulary, grammar or accent. It is one habit, in the last two words of each sentence.",
    goal: [
      "Hear the difference between a rising and a falling terminal in your own voice",
      "Hold a falling tone across a whole paragraph",
      "Keep the fall under pressure, when nerves push the pitch up"
    ],
    coach: [
      "English uses a rising pitch for questions and for uncertainty. Using it on a statement tells the listener you are seeking approval, whatever your words say.",
      "The fix is mechanical: consciously drop your pitch on the **last two words** of every statement.",
      "It will feel abrupt and slightly rude to you. It does not sound that way from outside — it sounds finished."
    ],
    acts: [
      {
        kind: "repeat",
        t: "One sentence, falling",
        brief: "Say it with the pitch dropping clearly on the final two words.",
        text: "The migration is finished and the old service is switched off.",
        tip: "Exaggerate the drop on *switched off*. You are calibrating a habit, and calibration needs to overshoot before it settles."
      },
      {
        kind: "repeat",
        t: "A claim, not a request for approval",
        brief: "This sentence is often said with a rise, which turns it into a plea. Say it as a statement.",
        text: "This is the option I would recommend.",
        tip: "*Recommend* must fall. If it rises, the sentence becomes *is this the option I would recommend?* — and that is what the room hears."
      },
      {
        kind: "read",
        t: "A whole paragraph, holding the fall",
        brief: "Four sentences. Every one of them must end lower than it started.",
        text: "We tested all three options against last quarter's traffic. The queue-based design handled the peak with room to spare. It costs about fifteen per cent more to run. I think that is the right trade, and I would like to go ahead with it.",
        tip: "The last sentence is the hardest, because it contains an opinion and an ask. Those are exactly the sentences that rise when you are nervous."
      },
      {
        kind: "prompt",
        t: "Recommend something, out loud",
        brief: "Recommend a decision — a tool, a design, a process, anything real. Forty-five seconds. Every sentence must end on a falling tone.",
        secs: 45,
        expect: ["i recommend|i would recommend|we should|i think we should|my recommendation"],
        avoid: ["maybe", "hopefully", "i guess", "sort of|kind of"],
        tip: "If you catch a sentence rising, finish it and carry on. Restarting to fix intonation trains hesitation instead."
      }
    ]
  },

  /* ---------------- interview ---------------- */

  {
    id: "self-intro-90",
    t: "The ninety-second self-introduction",
    m: "interview",
    lvl: "core",
    icon: "mic",
    s: "*Tell me about yourself* is an opening argument, not a biography. Ninety seconds, three beats, rehearsed until it survives nerves.",
    why: "It is the first question in most interviews and the one candidates most often ruin — usually by telling their story in chronological order, which takes four minutes and loses the room in the first one.",
    goal: [
      "Deliver a ninety-second introduction with three clear beats",
      "Choose past detail that points at this job rather than covering your whole history",
      "Finish deliberately instead of trailing off into silence"
    ],
    coach: [
      "The three beats: **where you are now**, **one or two moves that got you here**, **why this role is next**.",
      "Choose the past selectively. Everything you mention should make the last beat more convincing.",
      "Ninety seconds. Time it — almost everyone runs long, and the overrun is always in beat two.",
      "End on a definite sentence. Trailing off tells the interviewer you have run out rather than finished."
    ],
    acts: [
      {
        kind: "read",
        t: "A model introduction",
        brief: "Read it aloud and notice the proportions: the past gets less room than you would expect.",
        text: "I am a backend engineer at a payments company, where I own the reconciliation service. I moved into payments three years ago from general platform work, because I wanted problems where correctness actually matters and where being roughly right is not good enough. Since then I have rebuilt our settlement pipeline and cut the daily close from four hours to twenty minutes. What interests me about this role is that it is the same class of problem at a much larger volume, and that is the part I want to learn next.",
        tip: "Four sentences. Now, past, evidence, why here. That is the whole structure."
      },
      {
        kind: "prompt",
        t: "Your own, first attempt",
        brief: "Introduce yourself for an interview. Now, how you got here, why this role. Ninety seconds.",
        secs: 75,
        expect: [],
        avoid: ["um", "basically", "as i said|like i said"],
        tip: "Do not write it out first. This activity is about producing it out loud — a memorised script collapses the moment the interviewer interrupts."
      },
      {
        kind: "prompt",
        t: "Again, tighter",
        brief: "Same introduction, sixty seconds this time. Cut whatever did not point at the last beat.",
        secs: 60,
        expect: [],
        avoid: ["um", "basically", "sort of|kind of", "just"],
        tip: "Cutting is the exercise. Ninety seconds of content compressed to sixty is what makes the ninety-second version good."
      },
      {
        kind: "prompt",
        t: "The follow-up nobody prepares for",
        brief: "The interviewer says: *You mentioned reconciliation — why does that interest you?* Answer in forty-five seconds, specifically, without repeating your introduction.",
        secs: 45,
        expect: [],
        avoid: ["as i mentioned|as i said|like i said", "um"],
        tip: "This is where a memorised introduction fails and a structured one survives. If you can only say it in the order you rehearsed, you have learned a script rather than an argument."
      }
    ]
  },

  {
    id: "star-under-pressure",
    t: "A STAR answer under pressure",
    m: "interview",
    lvl: "intermediate",
    icon: "target",
    s: "Situation, task, action, result — with the proportions most candidates get exactly backwards.",
    why: "Most people narrate the situation at length and finish with *and then it worked*. The result is the only part that proves the action mattered, and it is the part that gets cut when time runs out.",
    goal: [
      "Keep the situation under twenty seconds",
      "Spend half the answer on your own actions, in the first person",
      "Land a result with a number in it"
    ],
    coach: [
      "Rough proportions for a two-minute answer: situation 20s, task 15s, **action 60s**, result 25s.",
      "Decide your result sentence first, then work backwards to the minimum situation that makes it land.",
      "Police the word **I**. *We migrated the database* tells an interviewer nothing about you.",
      "A result without a number is an opinion. Find one, even an approximate one."
    ],
    acts: [
      {
        kind: "repeat",
        t: "A result sentence with a number in it",
        brief: "This is the sentence to build the rest of the answer around.",
        text: "We took the daily close from four hours down to twenty minutes, and the finance team stopped working Saturdays.",
        tip: "Two results: the metric and the human consequence. The second is what makes the first memorable."
      },
      {
        kind: "prompt",
        t: "Situation and task only — twenty seconds",
        brief: "Pick a real project. Set up the situation and your task in twenty seconds and no more. This is a compression drill.",
        secs: 20,
        expect: [],
        tip: "Twenty seconds is roughly forty-five words. If you cannot set the scene in that, the scene is too complicated for an interview answer — pick a different project."
      },
      {
        kind: "prompt",
        t: "The action, in the first person",
        brief: "Same project. Sixty seconds on what **you** did — the decisions you made, not what the team did around you.",
        secs: 60,
        expect: ["i decided|i chose|i built|i wrote|i led|i proposed|i designed"],
        avoid: ["we just|the team did|it was decided|got done"],
        tip: "If you find yourself saying *we* repeatedly, stop and name your specific contribution. Interviewers are listening for exactly this."
      },
      {
        kind: "prompt",
        t: "The whole answer, two minutes",
        brief: "Now run all four parts together for the same project, in proportion. Situation short, action long, result with a number.",
        secs: 105,
        expect: ["i decided|i chose|i built|i led|i proposed", "result|which meant|so that|the effect|impact|reduced|improved|cut"],
        avoid: ["um", "basically", "you know"],
        tip: "Watch the clock on the situation. Overrunning at the start is what pushes the result off the end of the answer."
      }
    ]
  },

  {
    id: "weakness-and-failure",
    t: "The weakness and failure questions",
    m: "interview",
    lvl: "advanced",
    icon: "bulb",
    s: "Two questions that test self-awareness, and that almost everybody answers with a rehearsed evasion the interviewer has heard fifty times.",
    why: "*I am a perfectionist* costs you the question. So does a failure that was really someone else's fault. Both are heard as evasions immediately, and the evasion is more damaging than any honest answer would have been.",
    goal: [
      "Name a real, bounded weakness and the corrective action you actually took",
      "Own a failure that was genuinely your decision",
      "Finish both answers on evidence of change rather than on the problem"
    ],
    coach: [
      "A good weakness answer has three parts: the real thing, what you changed, and evidence it is working.",
      "Pick something bounded. A genuine deal-breaker is the wrong answer; so is a disguised strength.",
      "For failure: pick something that was **your decision**. A failure you did not cause has no lesson in it.",
      "Say what it cost. Skipping the cost makes the whole answer sound managed."
    ],
    acts: [
      {
        kind: "read",
        t: "A weakness answer that works",
        brief: "Read it aloud. Note that it spends more time on the fix than on the flaw.",
        text: "I used to take on too much rather than delegate, because handing something over felt slower than doing it. It caught up with me on a release last year when I was the bottleneck on three things at once. Since then I have run a weekly triage with my team, and I now hand off about a third of what I would once have kept. It is still the thing I have to watch.",
        tip: "The last sentence matters. Claiming a weakness is fully solved is its own kind of evasion."
      },
      {
        kind: "prompt",
        t: "Your weakness, out loud",
        brief: "Answer *what is your greatest weakness* in sixty seconds. Real weakness, the change you made, evidence it is working.",
        secs: 60,
        expect: ["used to|i tend to|i have|my weakness", "since then|now i|i started|i changed|i began"],
        avoid: ["perfectionist", "i work too hard|i care too much", "i do not really have|nothing really"],
        tip: "If your answer would sound good on a poster, it is a disguised strength and the interviewer will hear it as one."
      },
      {
        kind: "prompt",
        t: "Your failure, out loud",
        brief: "Answer *tell me about a time you failed* in ninety seconds. Your decision, what it cost, what you do differently now — with one example of doing it.",
        secs: 75,
        expect: ["i decided|i chose|my decision|i thought", "cost|lost|missed|delayed|had to|it meant", "now i|since then|i learned|these days"],
        avoid: ["the team|someone else|was not my|out of my control|not really my fault"],
        tip: "Watch for the drift into blame. It is almost never deliberate and it is always audible."
      },
      {
        kind: "prompt",
        t: "The probe",
        brief: "The interviewer says: *That sounds like it worked out fine in the end — was it really a failure?* Answer honestly in forty-five seconds without retreating from your own story.",
        secs: 45,
        expect: [],
        avoid: ["i suppose|i guess", "maybe not|not really"],
        tip: "The probe is testing whether you believe your own answer. Holding your ground calmly here is worth more than the original answer was."
      }
    ]
  },

  /* ---------------- fluency and pronunciation ---------------- */

  {
    id: "minimal-pairs",
    t: "The sounds that change the word",
    m: "fluency",
    lvl: "core",
    icon: "speaker",
    s: "Accent is not the target. These are the specific contrasts that produce a different English word, and therefore a genuine misunderstanding.",
    why: "Most pronunciation advice is a waste of effort because it chases a neutral accent. Only a handful of contrasts actually change meaning — and those are worth real practice, because they are the ones that cost you in a meeting.",
    goal: [
      "Produce the /v/ and /w/ contrast reliably",
      "Keep final consonants audible, since swallowed endings are the commonest cause of misheard words",
      "Hear which contrast the recogniser is missing in your own speech"
    ],
    coach: [
      "**/v/** touches the top teeth to the bottom lip. **/w/** rounds the lips with no teeth involved. Say *vest* and *west* with a finger against your lip and you will feel which is which.",
      "Final consonants carry an enormous amount of English meaning: *walk/walked*, *use/used*, *fine/find*. Swallowing them removes tense, plurality and sometimes the whole word.",
      "If a drill scores badly, say the word alone five times before running the line again. Fixing the word inside a sentence rarely works."
    ],
    acts: [
      {
        kind: "repeat",
        t: "/v/ and /w/",
        brief: "Six words, three real minimal pairs. Say them slowly and distinctly.",
        text: "vest west vine wine verse worse",
        tip: "Top teeth on the bottom lip for the /v/ words. If both members of a pair are heard as the same word, that is your contrast to drill."
      },
      {
        kind: "repeat",
        t: "/v/ and /w/ in a sentence",
        brief: "The same contrast at conversational speed, which is where it usually collapses.",
        text: "We reviewed the version we were given last week, and the vendor will verify it.",
        tip: "Seven /v/ and /w/ sounds in one sentence. Slow it right down the first time."
      },
      {
        kind: "repeat",
        t: "Final consonants",
        brief: "Past tense lives entirely in the ending. Make every one audible.",
        text: "I asked, I checked, I fixed, I shipped, I closed the ticket and I moved on.",
        tip: "Six endings. Swallowing them turns your whole sentence into the present tense, which is one of the most common sources of confusion in technical conversation."
      },
      {
        kind: "repeat",
        t: "The /θ/ family",
        brief: "The *th* sounds. Rarely cause a genuine misunderstanding, but they are audible, so they are worth ten minutes.",
        text: "Three thousand things were thoroughly tested, and then the third one failed.",
        tip: "Tongue tip lightly between the teeth. If it comes out as *tree tousand*, slow down and exaggerate — this one responds quickly to practice."
      },
      {
        kind: "repeat",
        t: "Consonant clusters",
        brief: "English stacks consonants in ways many languages do not. These are the clusters that appear most in technical speech.",
        text: "The scripts stopped, the strengths of the twelfth build were explored, and the texts were split.",
        tip: "Deliberately hard. Score it, drill the single worst word on its own, then run the line again and compare."
      }
    ]
  },

  {
    id: "stress-that-means",
    t: "Stress that carries the meaning",
    m: "fluency",
    lvl: "intermediate",
    icon: "wave",
    s: "English hides meaning in which syllable and which word you hit. Flat, evenly-stressed English is grammatically perfect and genuinely hard to follow.",
    why: "Misplaced word stress causes more misunderstanding than any individual consonant. And sentence stress carries the argument itself — the same six words can mean six different things depending on which one you hit.",
    goal: [
      "Place word stress correctly on the words that shift with part of speech",
      "Use sentence stress deliberately to point at the contrast you mean",
      "Stop stressing every word equally"
    ],
    coach: [
      "Some English words change part of speech with stress alone: **RE**cord (noun) and re**CORD** (verb) are different words to a listener.",
      "In a sentence, English stresses **content** words — nouns, main verbs, adjectives — and swallows the function words between them.",
      "Stressing everything is the same as stressing nothing. A listener uses your stress to find your point."
    ],
    acts: [
      {
        kind: "repeat",
        t: "Noun or verb, decided by stress",
        brief: "Each pair is the same spelling, two words. Hit the first syllable for the noun, the second for the verb.",
        text: "I keep a record of it. Please record the meeting. That is a present for you. Let me present the results.",
        tip: "RE-cord, re-CORD. PRE-sent, pre-SENT. Exaggerate — the contrast has to be clearly audible to do its job."
      },
      {
        kind: "repeat",
        t: "Word stress in technical vocabulary",
        brief: "Words used constantly at work and stressed wrongly almost as often.",
        text: "We will develop the architecture, analyse the parameters and prioritise the necessary categories.",
        tip: "de-VEL-op, AR-chi-tec-ture, AN-a-lyse, pa-RAM-e-ters, pri-OR-i-tise, NEC-es-sary, CAT-e-gor-ies."
      },
      {
        kind: "shadow",
        t: "Sentence stress — hear it first",
        brief: "Listen to the model, then say it back hitting the same words.",
        text: "I did not say she took the file. I said it went missing.",
        tip: "The stress sits on *say* and on *missing*. Move the stress to *she* and the sentence accuses somebody — the words do not change at all."
      },
      {
        kind: "prompt",
        t: "Contrast, deliberately",
        brief: "Explain a decision where two options were close and you chose one. Stress the words carrying the contrast — *this* rather than *that*, *because* of one thing rather than another.",
        secs: 45,
        expect: ["rather than|instead of|not|whereas|but"],
        tip: "If a listener could not tell which two things you were contrasting, the stress did not do its job — however clear the words were."
      }
    ]
  },

  {
    id: "connected-speech",
    t: "Following fast native speech",
    m: "fluency",
    lvl: "advanced",
    icon: "speaker",
    s: "Native speakers link words and swallow vowels. You do not have to produce it — but you have to hear it, and that is trainable.",
    why: "Most listening difficulty for advanced learners is not vocabulary. It is that *what do you* arrives as *whaddaya* and the brain, expecting three words, hears one it does not know.",
    goal: [
      "Recognise the commonest reductions when they arrive at speed",
      "Produce linked speech well enough to hear it in others",
      "Stop translating mentally, which is what puts you behind"
    ],
    coach: [
      "Reduction is not lazy or incorrect — it is how fluent English works in every native variety.",
      "The commonest ones: *going to* → *gonna*, *want to* → *wanna*, *what do you* → *whaddaya*, *did you* → *didja*, *a lot of* → *alotta*, *kind of* → *kinda*.",
      "Consonant-to-vowel linking is everywhere: *an apple* becomes *anapple*, *pick it up* becomes *pickitup*.",
      "You will always be behind if you translate. Tolerating partial understanding and catching up is the actual skill."
    ],
    acts: [
      {
        kind: "shadow",
        t: "Linked speech, modelled",
        brief: "Hear it, then say it back linked rather than word by word.",
        text: "What are you going to do about it? I want to pick it up in an hour or so.",
        tip: "Aim for *whaddaya gonna do aboudit* and *I wanna pickitup inanour or so*. Saying it this way is what trains you to hear it."
      },
      {
        kind: "repeat",
        t: "Linking consonant to vowel",
        brief: "Every word here runs into the next. Say it as one stream, not as separate words.",
        text: "Take it out of the box and put it on a shelf in another room.",
        tip: "*Takeitoutuvthebox*. It feels wrong to say and it is exactly what you are hearing when someone speaks quickly."
      },
      {
        kind: "repeat",
        t: "The weak forms",
        brief: "Function words reduce almost to nothing in fluent speech. Say this at speed and let them.",
        text: "I can send you a copy of the report and a summary of the changes for the meeting.",
        tip: "*Can*, *of*, *a*, *the*, *for* should all be barely audible. Giving them full weight is what makes careful English sound unnatural."
      },
      {
        kind: "prompt",
        t: "Speak at pace, deliberately",
        brief: "Describe your morning routine for forty-five seconds, at a genuinely conversational speed — faster than your careful English. Let the small words reduce.",
        secs: 45,
        expect: [],
        tip: "Accuracy will drop and that is expected. The point is to feel the difference between careful and connected speech; the score on this one matters less than the others."
      }
    ]
  },

  /* ---------------- clarity and escalation ---------------- */

  {
    id: "clarity-on-a-call",
    t: "Numbers, names and spelling on a call",
    m: "fluency",
    lvl: "core",
    icon: "speaker",
    s: "The highest-consequence speaking most people never practise: saying a reference number, a date or an email address so that it is written down correctly the first time.",
    why: "A misheard digit in an account number or a misheard date in a deadline causes real damage, and phone audio removes most of the cues that would normally rescue you.",
    goal: [
      "Say digits in the grouping conventions listeners expect",
      "Spell a name using a clear alphabet rather than letter names alone",
      "Give a date unambiguously across regional conventions"
    ],
    coach: [
      "Digits are said individually, not as numbers: *four seven one two*, never *forty-seven twelve*.",
      "The confusable letters on a phone line: **B/P/V/D/T/E/G**, and **M/N**. Use a word for each — *B for Bravo*.",
      "Dates: *the third of April* or *April the third* is unambiguous. **03/04** is not — it is two different dates in the US and the UK.",
      "Say the whole thing, then offer to repeat. Do not pause after each chunk waiting for confirmation; it doubles the length of the call."
    ],
    acts: [
      {
        kind: "repeat",
        t: "A reference number",
        brief: "Digits individually, grouped in threes and fours, with a small pause between groups.",
        text: "The reference is four seven one, two two nine, eight zero six five.",
        tip: "*Zero*, not *oh* — *oh* is easily heard as a letter. Some speakers say *nine-er* for nine, which is aviation practice and perfectly reasonable on a bad line."
      },
      {
        kind: "repeat",
        t: "Spelling a name",
        brief: "Letter, then a word for it. This is faster than repeating a misheard name three times.",
        text: "That is Bhatt. B for Bravo, H for Hotel, A for Alpha, double T for Tango.",
        tip: "*Double T* is standard and much clearer than saying T twice. Same for double letters in email addresses."
      },
      {
        kind: "repeat",
        t: "A date and a time, unambiguously",
        brief: "No slashes, no numeric months, and a named day for confirmation.",
        text: "That is Thursday the third of April, at half past two in the afternoon, UK time.",
        tip: "The weekday is a free error check: if the third is not a Thursday, one of you has the wrong week."
      },
      {
        kind: "prompt",
        t: "Confirm the details back",
        brief: "You have just been given a booking: reference 8842-QX, on the fourteenth of May, at nine in the morning. Read it back to confirm, clearly enough to be written down.",
        secs: 30,
        expect: ["eight eight four two|eight eight double four|double eight four two", "may", "nine"],
        tip: "Reading details back is standard practice on any call that matters. It takes ten seconds and catches almost every error."
      }
    ]
  },

  {
    id: "escalate-out-loud",
    t: "Escalating without blaming",
    m: "speak",
    lvl: "advanced",
    icon: "target",
    s: "Say the blocker, the impact and the ask — out loud, to someone senior, without any sentence that a colleague would object to if they heard it.",
    why: "Escalation is the moment professional English is hardest, because the pressure pushes you towards blaming a person when the only safe subject is the blocker. Written escalations can be edited; spoken ones cannot.",
    goal: [
      "Describe a blocker factually, with dates and attempts",
      "State the business impact rather than your frustration",
      "Make one specific ask and then stop talking"
    ],
    coach: [
      "The test that keeps an escalation safe: **would the person you are escalating about agree with your description?** If not, rewrite it.",
      "Facts, what you already tried, the impact, one ask. In that order, in about thirty seconds.",
      "Never say *they are ignoring me* or *nobody cares*. Say what happened and when.",
      "Finish with a specific request. *Could you help unblock it?* is a request. *I just wanted you to be aware* is not, and nothing will happen."
    ],
    acts: [
      {
        kind: "read",
        t: "A model escalation",
        brief: "Read it aloud. Every sentence is checkable, and no sentence names a culprit.",
        text: "I have been blocked on staging access since Tuesday. I raised it with the infra queue on Tuesday morning and chased it again on Thursday. It puts the Friday migration date at risk, which would push the finance close into the following week. Could you help get it prioritised today?",
        tip: "Four sentences: fact, what you tried, impact, ask. Nothing else is needed and anything else weakens it."
      },
      {
        kind: "repeat",
        t: "The impact sentence",
        brief: "The sentence that makes a senior person act. It talks about the business, not about you.",
        text: "It puts the Friday migration date at risk, which would push the finance close into the following week.",
        tip: "*Which would push the finance close* is doing the work. A blocker with no named consequence gets acknowledged and not acted on."
      },
      {
        kind: "prompt",
        t: "Escalate something real",
        brief: "Escalate a genuine or invented blocker to a senior person. Facts with dates, what you tried, the business impact, one specific ask. Forty-five seconds.",
        secs: 45,
        expect: ["blocked|waiting|held up|stuck", "raised|chased|asked|followed up|flagged", "risk|delay|impact|push|miss", "could you|would you|can you|help"],
        avoid: ["ignoring|nobody|no one cares|useless|they never", "frustrating|annoying|ridiculous"],
        tip: "If you feel the urge to describe how unreasonable the other team is being, that is the exact impulse this activity trains away."
      },
      {
        kind: "prompt",
        t: "When you are asked whose fault it is",
        brief: "The senior person asks directly: *So who is holding this up?* Answer honestly without turning it into a complaint about a colleague.",
        secs: 30,
        expect: ["queue|team|process|ticket|capacity|priority"],
        avoid: ["fault|blame|useless|never responds|does not care"],
        tip: "Naming the queue or the process rather than a person is honest and safe at the same time. *It is sitting in the infra queue and I do not know who has picked it up* answers the question completely."
      }
    ]
  }

]);
