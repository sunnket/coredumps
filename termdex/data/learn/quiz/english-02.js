/* Professional English — question bank, chapters 4-9.

   Long-form writing, meetings, presenting, interviews, fluency and the
   unwritten register rules. These chapters are less about right-and-wrong
   than the grammar bank is, so every question is built the same way: four
   plausible options, one that a senior colleague would actually choose, and
   an explanation of what the other three quietly signal. */

TD.addMCQ("english", "docs", [

  {
    tag: "Exec summary", lvl: "intermediate",
    q: "An executive summary should be written so that a reader who stops after it…",
    o: [
      "knows the document exists and roughly what it covers",
      "has the recommendation, the reason and the cost — enough to decide",
      "is intrigued enough to read the rest",
      "understands the background to the problem"
    ],
    a: 1,
    x: "An executive summary is not an introduction. It assumes the reader will read nothing else, and gives them everything needed to act.",
    note: "Write it last, and write it as though the rest of the document were lost in the post. If it only makes sense with the body attached, it is an abstract, not a summary."
  },
  {
    tag: "Design docs", lvl: "advanced",
    q: "Which section is most often missing from a weak design document?",
    o: [
      "The proposed solution",
      "The alternatives considered and why they were rejected",
      "A diagram",
      "The list of components"
    ],
    a: 1,
    x: "Without rejected alternatives a reviewer cannot tell whether you chose well or chose first. It is the section that converts a proposal into an argument.",
    steps: [
      "State the problem and the constraints that bound it.",
      "Give the option you are recommending.",
      "Give the two or three you rejected, **with the reason each was rejected**.",
      "A reviewer's first instinct is to suggest an alternative. Answering that before it is asked is what makes a document land."
    ]
  },
  {
    tag: "Minutes", lvl: "core",
    q: "Which is the most useful line in a set of meeting minutes?",
    o: [
      "We discussed the rollout timeline at length.",
      "Everyone agreed the timeline is tight.",
      "Decision: rollout moves to 12 March. Owner: Sam. Reason: security review needs two more weeks.",
      "Rollout timeline was raised by Sam and debated by the group."
    ],
    a: 2,
    x: "Minutes exist to record **decisions, owners and reasons**. A record of what was discussed helps nobody who was not there.",
    note: "The three headings that make minutes worth writing: **Decisions**, **Actions (with a name and a date)**, **Open questions**. Discussion goes in none of them."
  },
  {
    tag: "Self-appraisal", lvl: "advanced",
    q: "Which self-appraisal line is strongest?",
    o: [
      "Worked on improving the checkout service throughout the year.",
      "Was responsible for various improvements to the checkout service.",
      "Cut checkout p99 latency from 1.9s to 640ms, which lifted completed orders by 4% in the following quarter.",
      "Made significant contributions to the performance of the checkout service."
    ],
    a: 2,
    x: "A number, a baseline and a business consequence. Everything else is a claim the reader has to take on trust.",
    steps: [
      "Name the metric you moved, not the work you did.",
      "Give the before and after — an improvement with no baseline is unreadable.",
      "Connect it to something the business already cares about.",
      "*Significant*, *various* and *throughout the year* are all words that fill space without making a claim."
    ]
  },
  {
    tag: "Resume", lvl: "intermediate",
    q: "Roughly how long does a recruiter spend on a first pass of a resume?",
    o: ["About eight seconds", "About one minute", "About three minutes", "About thirty seconds"],
    a: 0,
    x: "Widely-cited eye-tracking work puts the first screening pass at around six to eight seconds — long enough for the top third of page one and nothing else.",
    note: "The consequence is structural, not stylistic: the top third of page one must contain your strongest evidence. A chronological list that buries the best work in 2021 is optimised for the wrong reader."
  },
  {
    tag: "Reports", lvl: "intermediate",
    q: "Which order suits a report written for a decision-maker?",
    o: [
      "Background → method → findings → recommendation",
      "Recommendation → why → evidence → detail",
      "Method → background → recommendation → findings",
      "Findings → background → method → recommendation"
    ],
    a: 1,
    x: "Decision-makers read top-down and stop when they have enough. Academic order (background first) is built for a reader obliged to finish.",
    note: "This is sometimes called the inverted pyramid, and it is the single biggest difference between writing that was graded at university and writing that gets acted on at work."
  },
  {
    tag: "Passive voice", lvl: "advanced",
    q: "When is the passive voice the **better** choice?",
    o: [
      "Never — the active voice is always clearer",
      "When the actor is unknown, irrelevant, or naming them would be a needless accusation",
      "Whenever you want to sound more formal",
      "In any technical document"
    ],
    a: 1,
    x: "*The config was changed at 14:02* is the right sentence in a blameless post-mortem. The passive has a job; the error is using it by default.",
    note: "Test each passive individually: if you can say who did it and it helps, go active. If naming them adds heat and no information, the passive is doing real work."
  },
  {
    tag: "LinkedIn", lvl: "core",
    q: "Which LinkedIn headline is most effective?",
    o: [
      "Passionate | Driven | Tech Enthusiast | Lifelong Learner",
      "Software Engineer at Acme",
      "Backend engineer — payments and reliability at scale (Go, Postgres, Kubernetes)",
      "Seeking new opportunities in software"
    ],
    a: 2,
    x: "It says what you do, in what domain, with what tools. That is what a recruiter's search actually matches on and what a human can act on.",
    note: "Adjective stacks like *passionate, driven, enthusiast* are unfalsifiable — everyone claims them, so they carry no information at all."
  },
  {
    tag: "Structure", lvl: "intermediate",
    q: "A proposal is going to three audiences: your team, finance, and the CTO. What is the right structure?",
    o: [
      "Three separate documents, one per audience",
      "One document written at the technical level of your team",
      "One document, layered: summary for all, cost section for finance, design detail in an appendix",
      "One document written at the least technical level"
    ],
    a: 2,
    x: "Layering lets each reader stop at the depth that serves them. Three documents drift out of sync within a week; one flat document fails two of the three audiences.",
    note: "The layering that works: **one-page summary → the argument → detail and appendices**. Each layer must be complete on its own terms."
  },
  {
    tag: "Editing", lvl: "advanced",
    q: "You have a draft that is 40% too long. What should you cut first?",
    o: [
      "Examples, because they take the most space",
      "Adverbs and intensifiers, then whole sentences that restate the previous one",
      "The conclusion, since the summary covers it",
      "Technical detail, since most readers skip it"
    ],
    a: 1,
    x: "Restated sentences and intensifiers are pure length with no information. Examples and detail are usually the parts carrying the argument.",
    steps: [
      "Delete *very, really, quite, actually, basically, in order to, the fact that*.",
      "Find pairs of sentences saying one thing and keep the better one.",
      "Only then look at whole sections.",
      "Cutting examples first is the classic mistake: it shortens the document and weakens it at the same time."
    ]
  }

]);


TD.addMCQ("english", "speak", [

  {
    tag: "Disagreeing", lvl: "intermediate",
    q: "You disagree with something your manager just proposed, in front of the team. Which opening is safest and most effective?",
    o: [
      "I disagree — that will not work.",
      "I am not sure that is right.",
      "That is a fair point on cost. My worry is the migration window — can we look at what happens if the review slips?",
      "With respect, I think you have misunderstood the constraint."
    ],
    a: 2,
    x: "Acknowledge what is true, name the specific concern, and turn it into a shared question. Disagreement lands when it is about the problem, not the person.",
    steps: [
      "Concede the valid part first. This is not politeness — it proves you were listening.",
      "Name **one** concern, specifically. Two concerns sound like opposition.",
      "End on a question, so the room moves to solving rather than defending.",
      "*With respect* is heard as the opposite of respect in British and American English alike."
    ]
  },
  {
    tag: "Interrupting", lvl: "core",
    q: "You need to interrupt a long monologue in a meeting. Which works best?",
    o: [
      "Sorry to interrupt —",
      "Can I stop you there?",
      "Can I jump in on that point? — then say your point immediately",
      "Excuse me, excuse me —"
    ],
    a: 2,
    x: "A short signal followed immediately by the substance. Interruptions that stall after the signal get talked over.",
    note: "The mechanics matter more than the words: raise your volume slightly on the first two syllables, then drop to normal. Starting quietly and hoping to be noticed is why polite people never get the floor."
  },
  {
    tag: "Buying time", lvl: "intermediate",
    q: "You are asked a question you have not thought about. Which response buys you the most time without looking unprepared?",
    o: [
      "Um… let me think…",
      "That is a good question.",
      "Two things come to mind — the first is the cost side. (Then think while you talk about cost.)",
      "I do not know."
    ],
    a: 2,
    x: "Announcing a structure buys thinking time *and* sounds organised. You commit to a shape, then fill it while you speak.",
    note: "*That is a good question* is so overused it now signals stalling. If you genuinely do not know, say so and say when you will follow up — that is stronger than any filler."
  },
  {
    tag: "Clarifying", lvl: "core",
    q: "You did not understand what someone said in a fast meeting. Which is best?",
    o: [
      "Sorry, my English is not so good — can you repeat?",
      "What?",
      "Sorry, could you say that again — did you mean the staging environment or production?",
      "Yes, yes, understood."
    ],
    a: 2,
    x: "Ask again *and* offer the specific ambiguity. It converts a repeat into a clarification and makes the speaker do the precise work.",
    note: "Never apologise for your English. It invites the listener to hear every subsequent sentence as a second-language sentence rather than as your point."
  },
  {
    tag: "Pushback", lvl: "advanced",
    q: "Someone pushes an unrealistic deadline onto you in a meeting. Which reply protects both the timeline and the relationship?",
    o: [
      "That is not possible.",
      "I will try my best.",
      "I can do it by the 12th if we drop the reporting screen. If both are needed, I would need another engineer — which would you prefer?",
      "That is very tight but I will make it work somehow."
    ],
    a: 2,
    x: "Trade scope, time or people — never argue about the date alone. Presenting two real options hands the choice back without saying no.",
    steps: [
      "Never refuse a deadline flatly; refuse the **combination** of deadline and scope.",
      "Give one concrete option you can genuinely deliver.",
      "Give a second with a named cost.",
      "*I will try my best* is heard as *yes*, and you will be held to it."
    ]
  },
  {
    tag: "Feedback", lvl: "advanced",
    q: "Which is the most useful way to give a junior colleague hard feedback?",
    o: [
      "You are not communicating well in standups.",
      "In yesterday's standup the update ran four minutes and did not mention the blocker. Next time, lead with what is in the way — it is what the room needs first.",
      "Some people have mentioned your standups are a bit long.",
      "Your standups are great, but maybe shorten them a bit, otherwise really good."
    ],
    a: 1,
    x: "One observed behaviour, one occasion, one specific change. Feedback becomes actionable exactly when it stops being about the person.",
    note: "*Great, but maybe shorten them a bit* is the compliment sandwich, and it fails reliably: the recipient hears the bread and not the filling. *Some people have mentioned* hides behind unnamed third parties, which damages trust in you rather than helping them."
  },
  {
    tag: "Signposting", lvl: "intermediate",
    q: "What does signposting do in a meeting?",
    o: [
      "Makes you sound more formal",
      "Tells listeners where you are in your argument so they can follow without effort",
      "Fills silence while you think",
      "Signals that you are about to disagree"
    ],
    a: 1,
    x: "*There are three things here; the first is…* lets a listener allocate attention. Following an unsignposted argument in a second language is exhausting.",
    note: "The workhorses: *Let me take a step back*, *To build on that*, *Coming back to the original question*, *So to summarise where we are*. Each one buys you the room's attention for the next thirty seconds."
  },
  {
    tag: "Negotiating", lvl: "advanced",
    q: "In a negotiation, which question opens the most room?",
    o: [
      "Can you do better on that?",
      "Is that your final offer?",
      "Help me understand how you arrived at that number.",
      "That is too low."
    ],
    a: 2,
    x: "It asks for reasoning rather than movement. Reasoning is where flexibility actually lives, and it keeps the conversation collaborative.",
    note: "*Is that your final offer?* invites a yes and ends the conversation. Asking about method invites an explanation, and explanations contain the assumptions you can negotiate against."
  },
  {
    tag: "Meetings", lvl: "core",
    q: "You are chairing and the discussion has drifted. What is the most effective intervention?",
    o: [
      "Let us get back on track.",
      "We have drifted a bit.",
      "That is worth its own conversation — I will take it as an action. Coming back to the release date: Priya, where did we land?",
      "Please stay on topic, everyone."
    ],
    a: 2,
    x: "Park it, name the owner, restate the question, and hand it to a specific person. A general appeal to stay on topic leaves the same vacuum that caused the drift.",
    note: "Naming a person is what restarts a stalled meeting. *What does everyone think?* produces silence; *Priya, where did we land?* produces an answer."
  },
  {
    tag: "Standups", lvl: "core",
    q: "What should come **first** in a standup update?",
    o: [
      "What you did yesterday",
      "Anything blocking you",
      "What you plan to do today",
      "How you are feeling about the sprint"
    ],
    a: 1,
    x: "The blocker is the only part of a standup that needs the whole team present. Everything else could have been written down.",
    note: "The classic order (yesterday, today, blockers) buries the useful part at the end, by which point half the room has stopped listening. Invert it."
  },
  {
    tag: "Softeners", lvl: "intermediate",
    q: "Which sentence is the *most* softened?",
    o: [
      "Send me the file.",
      "Could you send me the file?",
      "I was wondering whether you might be able to send me the file when you get a moment.",
      "Please send me the file."
    ],
    a: 2,
    x: "It stacks four softeners — past continuous, *whether*, *might be able to*, and a time escape. That is the politeness ceiling in English.",
    note: "More softening is not automatically better. The four-softener version, addressed to a peer about a routine file, reads as oddly deferential; *Could you send me the file?* is the correct register for almost all workplace requests."
  },
  {
    tag: "Repair", lvl: "advanced",
    q: "You said something in a meeting that came out sharper than you meant. What is the best repair?",
    o: [
      "Say nothing and hope it passes",
      "Apologise at length afterwards by email",
      "Immediately: *That came out blunter than I meant — what I am trying to say is…*",
      "Explain that English is not your first language"
    ],
    a: 2,
    x: "Repair in the moment, in one sentence, then restate. Delay makes a small thing into an incident; a long written apology makes it larger still.",
    note: "This is one of the highest-value phrases in professional English precisely because so few people use it. Owning a misfire immediately reads as confidence, not weakness."
  }

]);


TD.addMCQ("english", "present", [

  {
    tag: "Structure", lvl: "core",
    q: "You have ten minutes and forty slides of material. What should you do?",
    o: [
      "Speak faster and cover everything",
      "Cut to one message with three supports, and put the rest in an appendix",
      "Show every slide but skip quickly through the detail",
      "Ask for more time"
    ],
    a: 1,
    x: "An audience retains one idea from a short talk. Forty slides delivered fast leaves them with none of them.",
    note: "The shape that survives every time limit: **one message, three supports, one ask**. Everything else is an appendix that exists to answer questions."
  },
  {
    tag: "Openings", lvl: "intermediate",
    q: "Which opening line is strongest?",
    o: [
      "Hi everyone, so today I am going to talk about our Q3 infrastructure work.",
      "Sorry, can everyone see my screen? Okay. So. Um.",
      "We spend £40,000 a month on capacity we never use. Here is how we stop.",
      "Thanks for having me. A bit about myself first."
    ],
    a: 2,
    x: "It opens on the stake, not on the agenda. The first fifteen seconds decide how much attention you get for the remaining ten minutes.",
    note: "*Today I am going to talk about* spends your best moment on a table of contents. Give the number, the tension or the question first; the agenda can wait, or go unsaid entirely."
  },
  {
    tag: "Voice", lvl: "intermediate",
    q: "Your voice rises at the end of statements. What does this signal to an audience?",
    o: [
      "Enthusiasm", "Uncertainty — it makes statements sound like questions", "Friendliness", "Nothing much"
    ],
    a: 1,
    x: "A rising terminal on a declarative sentence is heard as seeking approval. The content can be exactly right and still land as unsure.",
    note: "The fix is mechanical: consciously drop the pitch on the last two words of each statement. It is called a falling terminal, and it is one of the fastest audible changes you can make to how senior you sound."
  },
  {
    tag: "Fillers", lvl: "core",
    q: "The most effective way to remove *um* and *uh* from your speech is to…",
    o: [
      "speak faster so there is no room for them",
      "replace them with a silent pause",
      "memorise the talk word for word",
      "consciously avoid them while presenting"
    ],
    a: 1,
    x: "Fillers exist to hold the floor during thinking. Silence does the same job and reads as composure instead of searching.",
    steps: [
      "Record two minutes of yourself and count them. Nobody believes their own filler rate until they hear it.",
      "Practise stopping dead at each one — the silence feels enormous to you and is barely noticed by the audience.",
      "Speaking faster makes it worse: less thinking time means more fillers.",
      "Memorising creates a different failure — one lost line and the whole talk stalls."
    ]
  },
  {
    tag: "Slides", lvl: "intermediate",
    q: "What is the strongest argument against putting your full script on the slides?",
    o: [
      "It looks unprofessional",
      "The audience reads faster than you speak, so they finish the slide and stop listening to you",
      "Slides should always have images",
      "It takes too long to prepare"
    ],
    a: 1,
    x: "Reading and listening compete for the same channel. A dense slide makes the audience choose, and they always choose reading.",
    note: "One idea per slide, and let the slide carry what is hard to say aloud — a number, a shape, a comparison. Your voice carries the argument."
  },
  {
    tag: "Questions", lvl: "advanced",
    q: "You are asked a question you cannot answer. What is the best response?",
    o: [
      "Guess plausibly and move on",
      "I do not know — I will find out and come back to you by Thursday.",
      "That is outside the scope of this presentation.",
      "Deflect to a colleague in the room"
    ],
    a: 1,
    x: "Admitting the gap and committing to a date costs nothing and buys credibility. A guess that is later found wrong costs both.",
    note: "The only thing that makes this fail is not following up. The sentence is a promise; treat it as one."
  },
  {
    tag: "Pacing", lvl: "core",
    q: "Roughly what speaking rate is comfortable for a mixed, partly non-native audience?",
    o: ["90-110 wpm", "130-150 wpm", "170-190 wpm", "200+ wpm"],
    a: 1,
    x: "Around 130-150 words a minute is followable without being slow. Nerves typically push people well past 170 without their noticing.",
    note: "You cannot judge your own rate live — it always feels slower than it is. Record yourself once and calibrate against the number, not the feeling."
  },
  {
    tag: "Demos", lvl: "intermediate",
    q: "What is the most important preparation for a live demo?",
    o: [
      "Rehearsing the click path until it is automatic",
      "Having a recorded fallback and saying out loud what the audience should be watching for",
      "Making the UI look polished",
      "Testing on the presentation machine"
    ],
    a: 1,
    x: "Demos fail; that is a fact of the format. A fallback removes the risk, and narrating what to watch is what makes a demo land when it works.",
    note: "Testing on the machine and rehearsing the path both matter — but they reduce the chance of failure rather than surviving it, and the network is not yours to control."
  },
  {
    tag: "Storytelling", lvl: "advanced",
    q: "Which structure makes a technical result memorable to a non-technical audience?",
    o: [
      "Method → results → conclusion",
      "The problem someone had → what we tried → what changed for them",
      "Background → architecture → implementation → metrics",
      "Metrics → architecture → next steps"
    ],
    a: 1,
    x: "A named person with a problem is retained; an architecture diagram is not. The story is the delivery mechanism for the number.",
    note: "This is not dumbing down. The number still appears — it just arrives attached to a consequence someone in the room can picture."
  },
  {
    tag: "Nerves", lvl: "core",
    q: "Which is the most reliable physical technique for steadying your voice before speaking?",
    o: [
      "Speaking the first line quickly to get it over with",
      "A slow exhale that is longer than the inhale, before you start",
      "Drinking cold water immediately before",
      "Clenching your hands to release tension"
    ],
    a: 1,
    x: "A long exhale slows the heart rate through the vagal response, and a steady breath is what a steady voice sits on top of.",
    note: "The audible symptoms of nerves — a fast, high, thin voice — are all breath symptoms. Fix the breath and the voice follows; fixing the voice directly does not work."
  }

]);


TD.addMCQ("english", "interview", [

  {
    tag: "Self-intro", lvl: "core",
    q: "*Tell me about yourself.* What is the interviewer actually asking for?",
    o: [
      "Your life story, in order",
      "A ninety-second arc: where you are now, one or two things that got you here, and why this role is the next step",
      "Your hobbies and personality",
      "A summary of your resume, top to bottom"
    ],
    a: 1,
    x: "It is an opening argument, not a biography. Present, relevant past, and why you are in this room.",
    steps: [
      "Now: your current role and its scope, in one sentence.",
      "How you got here: one or two moves, chosen because they point at this job.",
      "Why here: what specifically about this role is the next step.",
      "Ninety seconds. Chronological retellings usually run four minutes and lose the room in the first one."
    ]
  },
  {
    tag: "STAR", lvl: "core",
    q: "In a STAR answer, which part do candidates most often shortchange?",
    o: ["Situation", "Task", "Action", "Result"],
    a: 3,
    x: "Most people narrate the situation at length and stop at *and then it worked*. The result is the only part that proves the action mattered.",
    note: "A useful discipline: decide your **result sentence first**, then work backwards to the minimum situation needed to make it land. It inverts the usual failure mode."
  },
  {
    tag: "STAR", lvl: "intermediate",
    q: "Roughly how should a two-minute STAR answer be divided?",
    o: [
      "Situation 60s, Task 30s, Action 20s, Result 10s",
      "Situation 20s, Task 15s, Action 60s, Result 25s",
      "Equal quarters",
      "Situation 15s, Task 15s, Action 30s, Result 60s"
    ],
    a: 1,
    x: "Action is where your judgement shows, so it takes roughly half. Situation is only scene-setting and needs far less than instinct suggests.",
    note: "The word to police is **I**. *We migrated the database* tells an interviewer nothing about you; *I chose the cut-over strategy and wrote the rollback* does."
  },
  {
    tag: "Weakness", lvl: "intermediate",
    q: "*What is your greatest weakness?* Which answer works best?",
    o: [
      "I am a perfectionist.",
      "I work too hard.",
      "I used to take on too much rather than delegate — last year I started running a weekly triage with my team, and I now hand off about a third of what I would once have kept.",
      "I do not really have one that affects my work."
    ],
    a: 2,
    x: "A real weakness, a concrete corrective action, and evidence it is working. The question tests self-awareness, not the weakness itself.",
    note: "*Perfectionist* and *I work too hard* are recognised as evasions and cost you the question. Genuine deal-breakers are also the wrong answer — pick something real, bounded, and demonstrably improving."
  },
  {
    tag: "Failure", lvl: "advanced",
    q: "*Tell me about a time you failed.* What is the most common mistake?",
    o: [
      "Choosing a failure that is too serious",
      "Choosing a failure that was really someone else's fault, so nothing is learned",
      "Being too emotional about it",
      "Not giving enough technical detail"
    ],
    a: 1,
    x: "A failure you did not cause has no lesson in it, and the interviewer hears the deflection immediately. Own the decision that was yours.",
    steps: [
      "Pick something genuinely yours, and genuinely a failure.",
      "Say what you decided and why it seemed right at the time.",
      "Say what it cost.",
      "Say what you now do differently — and give one example of doing it."
    ]
  },
  {
    tag: "Salary", lvl: "advanced",
    q: "*What are your salary expectations?* — asked early, before you know the role well. Which is strongest?",
    o: [
      "I am flexible.",
      "I am looking for £X.",
      "I would rather understand the scope first. Do you have a band for the role? I am confident we can align if it is the right fit.",
      "What is the budget?"
    ],
    a: 2,
    x: "Deflect once, ask for their band, and keep it warm. Whoever names a number first has anchored the negotiation — usually against themselves.",
    note: "*I am flexible* reads as *I will take less*. If pressed twice, give a researched range with the top of your target near the bottom of the range you state."
  },
  {
    tag: "Group discussion", lvl: "intermediate",
    q: "In a group discussion round, what is the single most effective contribution?",
    o: [
      "Speaking first and most often",
      "Bringing in someone quiet and then building on what they said",
      "Disagreeing sharply to show conviction",
      "Summarising at the end"
    ],
    a: 1,
    x: "GD rounds score collaboration, not airtime. Bringing someone in demonstrates listening, control of the room and confidence at once.",
    note: "Summarising at the end is also strong — but only if you have earned the right to it by contributing earlier. Speaking most is the most common misread of the format."
  },
  {
    tag: "Questions to ask", lvl: "intermediate",
    q: "*Do you have any questions for us?* Which is the best question?",
    o: [
      "What is the salary and holiday allowance?",
      "What does success look like for this role in the first six months?",
      "No, I think you have covered everything.",
      "What does the company do?"
    ],
    a: 1,
    x: "It is specific, forward-looking, and its answer genuinely helps you decide. It also signals that you are thinking about doing the job rather than getting it.",
    note: "*No questions* is the weakest available answer — it reads as low interest even when you are simply satisfied. Prepare three, and ask the two that were not already covered."
  },
  {
    tag: "Project story", lvl: "advanced",
    q: "When describing a project you worked on, which detail matters most to a senior interviewer?",
    o: [
      "The technologies you used",
      "The trade-off you made and why you made it",
      "How long it took",
      "How many people were on the team"
    ],
    a: 1,
    x: "Technology choices are checkable on a resume. A reasoned trade-off is the only evidence of judgement, which is what senior interviews are actually testing.",
    note: "Have one sentence ready for *what would you do differently now?* on every project you list. It is asked constantly and it separates reflection from recitation."
  },
  {
    tag: "Gaps", lvl: "intermediate",
    q: "You have a nine-month employment gap. How should you handle it?",
    o: [
      "Hope it is not noticed",
      "State it briefly and factually, then say what you did with the time and move on",
      "Explain it in detail so they understand the circumstances",
      "Adjust the dates to close the gap"
    ],
    a: 1,
    x: "Brief and factual makes it a non-event. Length of explanation is read as discomfort, and discomfort invites more questions.",
    note: "One or two sentences, no apology, and pivot forward: *I took nine months out for family reasons. I used part of it to finish the AWS certification, and I have been looking since March.*"
  }

]);


TD.addMCQ("english", "fluency", [

  {
    tag: "Word stress", lvl: "intermediate",
    q: "In which of these words does the stress fall on the **second** syllable?",
    o: ["calendar", "develop", "photograph", "management"],
    a: 1,
    x: "de-**VEL**-op. The other three are all stressed on the first syllable: **CAL**-en-dar, **PHO**-to-graph, **MAN**-age-ment.",
    note: "The pairs worth drilling because both forms exist: **RE**cord (noun) / re**CORD** (verb); **PRE**sent (noun) / pre**SENT** (verb); **CON**tract / con**TRACT**. Stress alone changes the part of speech."
  },
  {
    tag: "Sentence stress", lvl: "advanced",
    q: "*I did not say she took the file.* Stressing a different word changes the meaning how many times?",
    o: ["Twice", "Not at all — the words are the same", "Once per word, so seven different meanings", "Only on the verb"],
    a: 2,
    x: "Each stressed word implies a different contrast: *I* didn't (someone else did), didn't *say* (I implied it), *she* (someone else took it), and so on.",
    note: "This is why flat, evenly-stressed English is hard to follow even when every word is correct. Stress carries the argument; without it a listener has to reconstruct your meaning from context alone."
  },
  {
    tag: "Connected speech", lvl: "intermediate",
    q: "A native speaker says *whaddaya think?* This is an example of…",
    o: [
      "bad or lazy English",
      "connected speech — normal linking and reduction in fluent speech",
      "a regional dialect only",
      "slang"
    ],
    a: 1,
    x: "Fluent English links words and reduces unstressed vowels. *What do you* becomes *whaddaya* in every native variety at normal speed.",
    note: "You do not need to produce this to be fluent — but you must be able to *hear* it. Most listening difficulty for advanced learners is connected speech, not vocabulary."
  },
  {
    tag: "Sounds", lvl: "intermediate",
    q: "Which sound substitution is most likely to cause an actual misunderstanding at work?",
    o: [
      "/θ/ (think) pronounced as /t/ or /s/",
      "/v/ and /w/ swapped (vest / west)",
      "A rolled r",
      "A flat intonation pattern"
    ],
    a: 1,
    x: "*v* and *w* distinguish real word pairs — *vest/west*, *vine/wine*, *verse/worse* — so the swap changes meaning. */θ/* rarely produces a genuine ambiguity.",
    note: "Accent is not the target; intelligibility is. Spend effort only on the contrasts that produce different words, and ignore the ones that merely sound foreign."
  },
  {
    tag: "Listening", lvl: "advanced",
    q: "You lose the thread in a fast native-speaker meeting. What is the most effective habit?",
    o: [
      "Translate mentally into your first language as you listen",
      "Listen for stressed words only and reconstruct the frame around them",
      "Ask for a repeat every time you miss a word",
      "Write down everything you hear"
    ],
    a: 1,
    x: "English stresses content words and swallows function words. The stressed words carry nearly all the meaning, which is exactly what fast speech preserves.",
    note: "Mental translation guarantees you fall behind — it costs more time than the speaker gives you. The transition to thinking in English is mostly the decision to stop translating and tolerate partial understanding."
  },
  {
    tag: "Fluency", lvl: "core",
    q: "Which practice most improves spoken fluency?",
    o: [
      "Learning more vocabulary",
      "Speaking daily, even alone, on a timer",
      "Reading more English",
      "Watching films with subtitles"
    ],
    a: 1,
    x: "Fluency is retrieval speed under pressure, and only production practice trains it. Input builds knowledge; it does not build access to it.",
    note: "Two minutes a day, out loud, on any prompt, beats an hour of passive input for this specific skill. The discomfort of hearing yourself is the exercise, not a side effect of it."
  },
  {
    tag: "Pauses", lvl: "intermediate",
    q: "Where should a pause go in spoken English?",
    o: [
      "Wherever you need to breathe",
      "At clause and sentence boundaries — grouping words into meaningful chunks",
      "Every five or six words, evenly",
      "Only at full stops"
    ],
    a: 1,
    x: "Pauses mark structure. Placed at boundaries they make you easier to follow; placed randomly they break your sentences into pieces the listener has to reassemble.",
    note: "Mid-phrase pausing — *I think we should… migrate the database… next week* — is the clearest audible symptom of searching for words, and it is fixed by pausing deliberately at boundaries instead."
  },
  {
    tag: "Thinking in English", lvl: "advanced",
    q: "What is the clearest sign that you have started thinking in English rather than translating?",
    o: [
      "Your vocabulary is larger",
      "Your grammar is more accurate",
      "You reach for a whole phrase at once, and you hesitate less even when you make more errors",
      "You have an English accent"
    ],
    a: 2,
    x: "Direct production retrieves chunks, not words. It typically produces *more* small errors and far less hesitation — which is the trade worth making.",
    note: "Accuracy that depends on translating is fragile: it disappears the moment you are interrupted, tired or nervous. Fluency built on chunks survives all three."
  }

]);


TD.addMCQ("english", "culture", [

  {
    tag: "Indirectness", lvl: "advanced",
    q: "A British manager says: *That is an interesting idea. Have you thought about the cost side at all?* What is most likely meant?",
    o: [
      "They find the idea interesting and are curious about cost",
      "They think the idea is too expensive and are telling you so politely",
      "They want a cost estimate before deciding",
      "They are testing whether you did the analysis"
    ],
    a: 1,
    x: "*Interesting* followed by a question about a weakness is standard British indirect criticism. The question is the objection, wearing a polite hat.",
    note: "The decoder that covers most cases: *quite good* = disappointing; *with the greatest respect* = you are wrong; *I might suggest* = do this; *that is one way of looking at it* = I disagree."
  },
  {
    tag: "Feedback", lvl: "intermediate",
    q: "An American colleague says your proposal is *great, really solid work* and then asks three detailed questions. How should you read it?",
    o: [
      "The praise is empty and the questions are the real message",
      "Both are genuine: warm framing is the norm, and the questions are the substance",
      "They are being sarcastic",
      "They have approved it"
    ],
    a: 1,
    x: "American workplace English front-loads warmth genuinely. The praise is real; so are the questions, and the questions are what you must answer.",
    note: "The mirror-image error costs both ways. A Dutch or German colleague's flat *this section is wrong* carries no hostility, and a British *I wonder if we might revisit this* carries far more objection than it sounds."
  },
  {
    tag: "Hierarchy", lvl: "advanced",
    q: "You are in a meeting with a very senior person and you spot an error in their numbers. What is usually the best move?",
    o: [
      "Say nothing and raise it privately later",
      "Correct it immediately and publicly so the meeting is not misled",
      "Ask a question that lets them find it: *Could you help me square that with the Q2 figure?*",
      "Send a message to your own manager during the meeting"
    ],
    a: 2,
    x: "A question surfaces the error without a public correction. Everyone gets the right number and nobody has to be wrong in front of the room.",
    note: "This works across the hierarchy spectrum, which is why it is worth learning as a fixed move. In flat cultures it is merely polite; in steep ones it is the only version that does not cost you."
  },
  {
    tag: "Jargon", lvl: "core",
    q: "*Let us take this offline.* What does it mean in a meeting?",
    o: [
      "Turn off the video call",
      "Discuss it separately, outside this meeting",
      "Put it in writing",
      "Postpone it indefinitely"
    ],
    a: 1,
    x: "It means *not now, not with this group*. Sometimes genuine, sometimes a polite way to end a discussion that is not going anywhere.",
    note: "Ask *who is taking that away?* — a real offline discussion has an owner. Without one, it usually means the topic has been dropped."
  },
  {
    tag: "Jargon", lvl: "intermediate",
    q: "*Can you socialise this with the team before Thursday?* means…",
    o: [
      "Arrange a social event",
      "Share it informally in advance so people are not surprised in the meeting",
      "Post it publicly",
      "Get formal sign-off"
    ],
    a: 1,
    x: "*Socialise* means pre-share to build familiarity and catch objections early. It is genuinely useful practice hiding behind an unpleasant word.",
    note: "The general advice on jargon is to use less of it than the people around you — but you must be able to decode all of it, because instructions arrive in it."
  },
  {
    tag: "Small talk", lvl: "core",
    q: "What is the actual function of small talk before a meeting?",
    o: [
      "Wasting time politely",
      "Establishing enough rapport that disagreement later is safe",
      "Showing you are friendly",
      "Filling silence until everyone joins"
    ],
    a: 1,
    x: "Two minutes of rapport is what makes it possible to disagree in minute twenty without it being read as hostility. It is groundwork, not filler.",
    note: "Skipping it is a common and expensive mistake for engineers, especially with US and UK colleagues. Two lines is enough — it is the acknowledgement that counts, not the content."
  },
  {
    tag: "Directness", lvl: "advanced",
    q: "Which is generally the **safest** default register for a distributed team spanning the UK, the US, India and Germany?",
    o: [
      "Maximally indirect, so nobody is offended",
      "Maximally direct, so nothing is ambiguous",
      "Clear and direct on facts and decisions; warm and softened on requests and disagreement",
      "Match whichever culture is most senior in the room"
    ],
    a: 2,
    x: "Splitting the two removes the real risk. Ambiguity about a decision costs a week; bluntness in a request costs a relationship. Neither needs to be traded for the other.",
    note: "Indirect facts are the worse failure. *We might want to consider possibly delaying* leaves four people with four different beliefs about what was decided."
  },
  {
    tag: "Written tone", lvl: "intermediate",
    q: "Why do short messages read as colder in writing than the same words spoken?",
    o: [
      "Written English is inherently more formal",
      "Tone is carried by face and voice, and in text word choice must do all of it alone",
      "People read too quickly",
      "Emoji are needed to convey tone"
    ],
    a: 1,
    x: "Speech carries politeness in prosody and expression. Text has neither, so a neutral sentence lands neutral-or-worse by default.",
    note: "This is why *Fine.* and *OK.* read badly, and why a large share of friction between competent colleagues is nothing but this. One extra clause — *Fine by me, thanks for sorting it* — costs three seconds and removes the ambiguity entirely."
  }

]);
