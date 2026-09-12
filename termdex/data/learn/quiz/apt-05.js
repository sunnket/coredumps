/* Aptitude — question bank, chapters 9-10.

   Verbal ability, then exam craft.

   The verbal chapter overlaps the Professional English track on purpose,
   but the questions are shaped differently: an exam tests recognition under
   a clock, not production, so every item here is answerable in under sixty
   seconds by elimination.

   Exam craft is the chapter with no syllabus and the highest marginal
   value. Nothing in it is about solving a question faster; all of it is
   about which questions to solve at all. */

TD.addMCQ("aptitude", "verbal", [

  {
    tag: "Sentence correction", lvl: "core",
    q: "Choose the grammatically correct sentence.",
    o: [
      "Each of the candidates has submitted their form.",
      "Each of the candidates have submitted their form.",
      "Each of the candidates are submitting his form.",
      "Each of the candidate have submitted their form."
    ],
    a: 0,
    x: "*Each* is singular, so it takes **has**. Singular *their* is now accepted by every major style guide and is the safest choice for an unspecified person.",
    steps: [
      "Find the subject: **each**, not *candidates*.",
      "*Each*, *every*, *either*, *neither*, *none* and *everyone* are all singular.",
      "So the verb is **has submitted**.",
      "The plural noun sitting between subject and verb is the distractor — the same trap as *the list of items is*."
    ]
  },
  {
    tag: "Sentence correction", lvl: "intermediate",
    q: "Which sentence agrees correctly after *neither*?",
    o: [
      "Neither of the two proposals was accepted.",
      "Neither of the two proposals were accepted.",
      "Neither of the two proposal were accepted.",
      "Neither of the two proposals are accepted."
    ],
    a: 0,
    x: "*Neither* is singular when it stands alone as the subject, so it takes **was**."
  },
  {
    tag: "Sentence correction", lvl: "intermediate",
    q: "Which sentence has no error?",
    o: [
      "He is one of the best engineers who have worked here.",
      "He is one of the best engineers who has worked here.",
      "He is one of the best engineer who have worked here.",
      "He is the one of best engineers who has worked here."
    ],
    a: 0,
    x: "*Who* refers back to **engineers** (plural), so the verb is *have*. The phrase is *one of the [group who have…]*.",
    note: "Test it by rearranging: *of the best engineers who have worked here, he is one*. The relative clause describes the group, not him."
  },
  {
    tag: "Sentence correction", lvl: "advanced",
    q: "Which sentence is free of a modifier error?",
    o: [
      "Having reviewed the data, we revised the forecast.",
      "Having reviewed the data, the forecast was revised.",
      "Having reviewed the data, the revision was made to the forecast.",
      "Having reviewed the data, a revision of the forecast occurred."
    ],
    a: 0,
    x: "The opening phrase must attach to the subject that follows. Only **we** could have reviewed anything; a forecast cannot.",
    steps: [
      "Read the opening participle phrase, then ask *who did that?*",
      "The answer must be the subject immediately after the comma.",
      "*The forecast*, *the revision* and *a revision* are all incapable of reviewing data.",
      "Only **we** works, which makes the first option the sole correct one."
    ]
  },
  {
    tag: "Sentence correction", lvl: "intermediate",
    q: "Which sentence uses parallel structure correctly?",
    o: [
      "The role involves writing code, reviewing designs and mentoring juniors.",
      "The role involves writing code, design reviews and to mentor juniors.",
      "The role involves to write code, reviewing designs and mentorship.",
      "The role involves code writing, to review designs and mentoring."
    ],
    a: 0,
    x: "All three items take the same *-ing* form. A list must use one grammatical shape throughout.",
    note: "Parallelism is invisible when correct and jarring when not. Read any list aloud — the item that trips you is the one out of shape."
  },
  {
    tag: "Para jumbles", lvl: "intermediate",
    q: "What is the most reliable first move on a para-jumble question?",
    o: [
      "Find the opening sentence — the one with no pronoun or connector referring backwards",
      "Read all sentences and pick the order that sounds best",
      "Look for the longest sentence, which is usually first",
      "Start from the last sentence and work backwards"
    ],
    a: 0,
    x: "An opening sentence introduces its subject by full name and contains no *this*, *however*, *such*, *these* or *therefore* pointing at something earlier.",
    steps: [
      "Scan for sentences that could stand alone with no prior context. Usually only one or two qualify.",
      "Then look for **mandatory pairs** — a sentence naming *the company* right after one naming it in full.",
      "Chain the pairs before attempting the whole order.",
      "Answering from the options backwards is often faster still: eliminate any option whose first sentence carries a backward reference."
    ]
  },
  {
    tag: "Para jumbles", lvl: "advanced",
    q: "In a jumbled paragraph, sentence P says *Tesla launched the Model 3 in 2017* and sentence Q says *The car became its best seller within two years.* What does this tell you?",
    o: [
      "P must come before Q, because *the car* and *its* refer back to P",
      "Q must come before P, to create suspense",
      "They could go in either order",
      "They cannot be adjacent"
    ],
    a: 0,
    x: "A pronoun or a definite reference (*the car*, *its*) needs an antecedent already on the page. **P then Q** is forced.",
    note: "This is a mandatory pair, and finding one usually eliminates two or three of the four options immediately — often without reading the rest of the paragraph at all."
  },
  {
    tag: "Reading comprehension", lvl: "intermediate",
    q: "Under time pressure, what is the most effective way to attack a reading-comprehension passage?",
    o: [
      "Skim for structure, then read each question and return to the relevant paragraph",
      "Read the passage twice carefully, then answer from memory",
      "Read the questions first, then read the passage once looking for each answer",
      "Read only the first and last paragraphs"
    ],
    a: 0,
    x: "Knowing where things are beats remembering what they said. RC questions are almost all locatable, and locating is far faster than recalling.",
    note: "Reading every question first sounds efficient and is not: you cannot hold five questions in mind while reading, and you end up reading the passage looking for nothing in particular."
  },
  {
    tag: "Reading comprehension", lvl: "advanced",
    q: "An RC option is factually true in the real world but never stated in the passage. What should you do?",
    o: [
      "Reject it — RC answers must be supported by the passage alone",
      "Choose it, since it is true",
      "Choose it only if no other option is true",
      "Choose it if the passage does not contradict it"
    ],
    a: 0,
    x: "Comprehension tests what the passage says, not what is true. Outside knowledge is the most reliable way to get an RC question wrong.",
    note: "The commonest wrong answer in RC is a statement that is true, relevant and absent. Examiners build it deliberately, because it is what a well-informed reader reaches for."
  },
  {
    tag: "Critical reasoning", lvl: "advanced",
    q: "*Sales rose 20% after we redesigned the website, so the redesign caused the rise.* Which would most weaken this?",
    o: [
      "A major competitor went out of business in the same month",
      "The redesign cost more than expected",
      "Some customers disliked the new design",
      "Sales rose only 18% in a neighbouring region"
    ],
    a: 0,
    x: "An alternative cause operating over the same period undercuts the causal claim directly. The others question value or detail, not causation.",
    steps: [
      "Identify the conclusion: the redesign caused the rise.",
      "To weaken a causal claim, supply another cause, or show the effect happened without the cause.",
      "A competitor's exit explains the same 20% without the redesign.",
      "Cost, opinion and a regional figure are all irrelevant to *whether it caused*."
    ]
  },
  {
    tag: "Critical reasoning", lvl: "advanced",
    q: "*All our best engineers use Vim, so switching everyone to Vim will improve the team.* What is the flaw?",
    o: [
      "It mistakes a correlation for a cause, and may have the direction backwards",
      "It uses too small a sample",
      "It appeals to authority",
      "It contains a false dichotomy"
    ],
    a: 0,
    x: "Strong engineers may adopt Vim *because* they are experienced. Reversing the arrow is the specific error, not merely 'correlation is not causation'.",
    note: "Naming the flaw precisely is what these questions reward. 'Reverse causation' and 'confounding variable' are different answers, and papers offer both."
  },
  {
    tag: "Critical reasoning", lvl: "intermediate",
    q: "*Every swan I have seen is white, therefore all swans are white.* What kind of reasoning is this?",
    o: [
      "Inductive — the conclusion goes beyond the evidence and could be false",
      "Deductive and valid",
      "Circular",
      "A false dilemma"
    ],
    a: 0,
    x: "Induction generalises from observations, so it is always defeasible. Black swans exist, which is precisely how the example became famous.",
    note: "Deduction guarantees its conclusion if the premises hold; induction only makes it likely. Aptitude papers test the difference constantly, usually by asking what would 'definitely' follow."
  },
  {
    tag: "Para summary", lvl: "advanced",
    q: "Which is usually the wrong choice in a para-summary question?",
    o: [
      "The option that captures only one striking detail from the passage",
      "The option that restates the main argument in different words",
      "The shortest option",
      "The option that uses none of the passage's own vocabulary"
    ],
    a: 0,
    x: "A summary must carry the **main claim**. An option built on one vivid example is the classic trap, because the example is what a reader remembers.",
    note: "Two more traps worth naming: an option that is true but broader than the passage, and one that reverses a qualification (turning *often* into *always*)."
  },
  {
    tag: "Vocabulary", lvl: "core",
    q: "Choose the word closest in meaning to **mitigate**.",
    o: ["Lessen", "Worsen", "Postpone", "Justify"],
    a: 0,
    x: "To mitigate is to make less severe — to **lessen**."
  },
  {
    tag: "Vocabulary", lvl: "intermediate",
    q: "Choose the word most nearly opposite in meaning to **candid**.",
    o: ["Evasive", "Honest", "Cheerful", "Brief"],
    a: 0,
    x: "*Candid* means frank and open, so its opposite is **evasive**. *Honest* is a synonym, offered to catch a fast reader."
  },
  {
    tag: "Vocabulary", lvl: "intermediate",
    q: "Choose the word closest in meaning to **ubiquitous**.",
    o: ["Found everywhere", "Extremely rare", "Ancient", "Unnecessary"],
    a: 0,
    x: "*Ubi* is Latin for *where*: ubiquitous means present everywhere at once.",
    note: "The root pays off across the language: *ubiquity*, and by contrast *nowhere* words like *utopia* (literally 'no place')."
  },
  {
    tag: "Vocabulary", lvl: "advanced",
    q: "Choose the word closest in meaning to **pragmatic**.",
    o: ["Practical", "Idealistic", "Pessimistic", "Rigid"],
    a: 0,
    x: "*Pragmatic* means concerned with what works in practice rather than with theory — **practical**."
  },
  {
    tag: "Idioms", lvl: "intermediate",
    q: "*To take something with a pinch of salt* means:",
    o: [
      "To treat it with scepticism",
      "To accept it gratefully",
      "To find it distasteful",
      "To deal with it quickly"
    ],
    a: 0,
    x: "It means to doubt it, or not to take it entirely at face value."
  },
  {
    tag: "Idioms", lvl: "intermediate",
    q: "*To move the goalposts* means:",
    o: [
      "To change the requirements after work has begun",
      "To make a target easier",
      "To delegate a task",
      "To abandon a plan"
    ],
    a: 0,
    x: "It describes altering the criteria mid-way, usually unfairly — and it is the standard phrase for it in professional English."
  },
  {
    tag: "Fill in the blanks", lvl: "intermediate",
    q: "Complete: *The report was so ___ that even the specialists struggled to follow it.*",
    o: ["abstruse", "lucid", "concise", "candid"],
    a: 0,
    x: "*Abstruse* means difficult to understand, which is what the clause *even the specialists struggled* requires.",
    steps: [
      "Find the logical signal: *so … that even the specialists struggled* demands a word meaning 'hard'.",
      "*Lucid* and *concise* both mean clear or short — the opposite direction.",
      "*Candid* means frank, which is unrelated to difficulty.",
      "**Abstruse** is the only word that fits the logic."
    ]
  },
  {
    tag: "Fill in the blanks", lvl: "advanced",
    q: "Complete: *Although the proposal was ___, the committee rejected it on procedural grounds.*",
    o: ["sound", "flawed", "delayed", "expensive"],
    a: 0,
    x: "*Although* signals a contrast: the reason for rejection must clash with the description. A **sound** proposal rejected on a technicality is the contrast.",
    note: "Connectors do most of the work in fill-in-the-blank questions. *Although*, *however*, *despite* demand a contrast; *because*, *since*, *therefore* demand agreement. Read the connector before the blank."
  },
  {
    tag: "Confusables", lvl: "core",
    q: "Which sentence uses *their*, *there* and *they're* correctly?",
    o: [
      "Their team is meeting there to discuss what they're planning.",
      "There team is meeting their to discuss what their planning.",
      "They're team is meeting there to discuss what their planning.",
      "Their team is meeting they're to discuss what there planning."
    ],
    a: 0,
    x: "**Their** = possessive, **there** = place, **they're** = they are. Only the first sentence uses all three correctly."
  },
  {
    tag: "Confusables", lvl: "intermediate",
    q: "Which sentence is correct?",
    o: [
      "The effect of the delay was that fewer orders were completed.",
      "The affect of the delay was that less orders were completed.",
      "The effect of the delay was that less orders were completed.",
      "The affect of the delay was that fewer orders were completed."
    ],
    a: 0,
    x: "**Effect** is the noun here, and **fewer** is used for countable things (orders). *Less* is for uncountable quantities.",
    note: "The pair to hold: *fewer people, less water*; *fewer orders, less revenue*. If you can count it, use *fewer*."
  },
  {
    tag: "Strategy", lvl: "intermediate",
    q: "In a verbal section with four options and negative marking, when is elimination worth more than solving?",
    o: [
      "Almost always — removing two options makes a guess profitable",
      "Only on reading comprehension",
      "Never; guessing is always a loss",
      "Only when you have extra time"
    ],
    a: 0,
    x: "With four options, blind guessing is 25% accurate. Removing two makes it 50%, which is comfortably above the break-even for any common marking scheme.",
    note: "Verbal is the section where elimination pays best, because wrong options are wrong for *nameable* reasons — too extreme, out of scope, a reversed qualifier — that you can spot without solving the question."
  },
  {
    tag: "Tone", lvl: "advanced",
    q: "A passage describes a policy's failures at length, then notes one modest success. What is its likely tone?",
    o: [
      "Critical but balanced",
      "Wholly negative",
      "Neutral and descriptive",
      "Enthusiastic"
    ],
    a: 0,
    x: "The weight of the passage is critical, but the acknowledged success rules out *wholly* negative. Extreme tone options are usually wrong.",
    note: "The heuristic that works: on tone questions, distrust absolutes. *Wholly*, *entirely*, *unreservedly* and *completely* are correct far less often than their share of the option list."
  },
  {
    tag: "Inference", lvl: "advanced",
    q: "What distinguishes an *inference* question from a *stated fact* question?",
    o: [
      "An inference must follow necessarily from the passage without being written in it",
      "An inference can be any reasonable guess",
      "An inference is always about the author's opinion",
      "There is no real difference"
    ],
    a: 0,
    x: "An inference is what the passage forces to be true. If it merely *could* be true, it is not the answer.",
    steps: [
      "Ask: could the passage be entirely true and this option false?",
      "If yes, it is not an inference — however plausible it sounds.",
      "The correct inference is usually the *weakest*, most cautious option.",
      "Strong, interesting-sounding options are the trap; safe, almost boring ones are usually right."
    ]
  }

]);


TD.addMCQ("aptitude", "exam", [

  {
    tag: "Negative marking", lvl: "core",
    q: "A test awards +4 for a correct answer and −1 for a wrong one, with four options per question. Above what accuracy is guessing profitable?",
    o: ["20%", "25%", "50%", "33%"],
    a: 0,
    x: "Break-even is where 4p = 1 − p, so 5p = 1 and p = **20%**. Blind guessing is 25% accurate, which is already above it.",
    steps: [
      "Expected marks from a guess = 4p − 1(1 − p), where p is your chance of being right.",
      "Set it to zero: 4p − 1 + p = 0 → 5p = 1.",
      "p = **0.20**, or 20%.",
      "Since a blind four-option guess is 25%, this scheme makes *pure guessing* marginally +EV — which is why CAT-style papers use +3/−1 instead."
    ]
  },
  {
    tag: "Negative marking", lvl: "intermediate",
    q: "A test awards +3 for a correct answer and −1 for a wrong one, with four options. Is blind guessing profitable?",
    o: [
      "No — the expected value is exactly zero",
      "Yes, slightly",
      "No, it is clearly negative",
      "It depends on the section"
    ],
    a: 0,
    x: "EV = 0.25(3) + 0.75(−1) = 0.75 − 0.75 = **0**. Blind guessing is exactly break-even, which is why the scheme is chosen.",
    note: "The practical consequence: under +3/−1, guessing only pays once you can eliminate at least one option. Eliminating one takes you to 1/3, and the EV becomes +0.33 per question."
  },
  {
    tag: "Question selection", lvl: "advanced",
    q: "You have 60 minutes for 30 questions. After 40 minutes you have attempted 14. What is the best move?",
    o: [
      "Scan the remaining 16 for the easiest 6-8 and attempt only those",
      "Speed up and try to attempt all 16",
      "Continue at the same pace and accept an incomplete paper",
      "Go back and re-check the 14 you have done"
    ],
    a: 0,
    x: "Papers are not ordered by difficulty. There are almost always easy questions late in the set, and finding them is worth more than rushing the hard ones you are already on.",
    steps: [
      "Accept that all 30 will not be attempted. That decision alone removes the panic that causes errors.",
      "Spend 60-90 seconds scanning the unattempted questions and marking the easy ones.",
      "Attempt those first, at full care.",
      "Rushing produces wrong answers, and under negative marking a wrong answer is worse than a blank."
    ]
  },
  {
    tag: "Question selection", lvl: "intermediate",
    q: "What is the single most valuable skill in a sectional aptitude test with negative marking?",
    o: [
      "Deciding which questions to skip",
      "Solving hard questions quickly",
      "Knowing more formulas",
      "Writing neatly in the rough sheet"
    ],
    a: 0,
    x: "Choosing which twelve of twenty to attempt is worth more marks than solving any single one of them faster. It is also the skill nobody practises.",
    note: "The reason is arithmetic: an attempted question you get wrong costs marks twice — the mark itself, plus the two minutes that would have earned a mark elsewhere."
  },
  {
    tag: "Timing", lvl: "intermediate",
    q: "You are two minutes into a question and have made no progress. What should you do?",
    o: [
      "Mark it for review and move on immediately",
      "Give it one more minute, since you have already invested two",
      "Guess and move on",
      "Restart the question from the beginning"
    ],
    a: 0,
    x: "The two minutes are gone whatever you do next. The only question is whether the next minute is better spent here or elsewhere — and it almost never is.",
    note: "This is the sunk-cost fallacy, and a timed exam is where it does the most damage. The feeling of *I have nearly got it* is not evidence, and it is strongest exactly when you have not."
  },
  {
    tag: "Timing", lvl: "advanced",
    q: "Across a 60-minute section, which time allocation usually produces the highest score?",
    o: [
      "Three passes: easy questions, then medium, then whatever remains",
      "One careful pass in the printed order",
      "Hardest questions first while you are fresh",
      "Equal time per question, strictly enforced"
    ],
    a: 0,
    x: "A three-pass approach banks the certain marks first. It also means that when time runs out, what is unattempted is the hardest material rather than an arbitrary tail.",
    steps: [
      "Pass 1: attempt everything you can solve in under a minute. This is usually 40-50% of the paper.",
      "Pass 2: the questions you know how to do but that take longer.",
      "Pass 3: the rest, with whatever time is left, plus any eliminate-and-guess.",
      "Working in printed order guarantees that some easy questions in the last third are never seen."
    ]
  },
  {
    tag: "Mock analysis", lvl: "advanced",
    q: "You scored 62 in a mock. What is the most useful thing to do next?",
    o: [
      "Categorise every wrong answer as concept, calculation, misreading or timing",
      "Take another mock immediately",
      "Revise the topics you scored lowest in",
      "Redo the whole paper untimed"
    ],
    a: 0,
    x: "The four categories need four completely different fixes. Without the split, 'I need to revise more' is the only conclusion available — and it is usually the wrong one.",
    steps: [
      "**Concept**: you did not know the method. Fix by studying the topic.",
      "**Calculation**: you knew the method and slipped. Fix by drilling arithmetic, not theory.",
      "**Misreading**: you solved a question the paper did not ask. Fix by underlining what is asked.",
      "**Timing**: you knew it and ran out of time. Fix by question selection. Most people assume every error is the first kind, and most errors are not."
    ]
  },
  {
    tag: "Mock analysis", lvl: "intermediate",
    q: "How much time should you spend analysing a mock, relative to taking it?",
    o: [
      "At least as long as the test itself",
      "About a quarter of the test length",
      "Ten minutes is enough",
      "None — the score is the feedback"
    ],
    a: 0,
    x: "Taking a mock measures; analysing it improves. A 2-hour mock deserves at least 2 hours of review, including the questions you got right by guessing.",
    note: "Reviewing correct answers matters more than it sounds: a question you guessed right is a gap the score is hiding from you, and it will not be hidden in the real exam."
  },
  {
    tag: "Accuracy", lvl: "intermediate",
    q: "Two candidates each attempt a +4/−1 paper. A attempts 20 with 90% accuracy; B attempts 30 with 65% accuracy. Who scores higher?",
    o: [
      "A, with 70 against B's 67",
      "B, because more attempts always help",
      "They tie exactly",
      "Cannot be determined"
    ],
    a: 0,
    x: "A: 18 right, 2 wrong = 72 − 2 = **70**. B: 19.5 right, 10.5 wrong ≈ 78 − 10.5 = **67.5**. Accuracy beats volume.",
    steps: [
      "A: 20 × 0.90 = 18 correct → 18 × 4 = 72; 2 wrong → −2. Total **70**.",
      "B: 30 × 0.65 = 19.5 correct → 78; 10.5 wrong → −10.5. Total **67.5**.",
      "So A wins despite attempting ten fewer questions.",
      "Under negative marking, every 1% of accuracy is worth roughly as much as an extra attempt — and accuracy is easier to raise."
    ]
  },
  {
    tag: "Sectional strategy", lvl: "advanced",
    q: "A test has three timed sections with no movement between them. How should you handle your weakest section?",
    o: [
      "Aim to clear its cut-off with high accuracy, not to maximise its score",
      "Spend extra preparation time until it becomes your strongest",
      "Attempt it as fast as possible to leave time for the others",
      "Guess most of it and rely on your strong sections"
    ],
    a: 0,
    x: "Sectional cut-offs are pass-fail gates. Marks above the cut-off in a weak section are worth far less than the risk of falling below it.",
    note: "Where the sections are separately timed, time cannot be moved between them — so 'making it up elsewhere' is not available, and clearing every gate becomes the whole strategy."
  },
  {
    tag: "Exam day", lvl: "core",
    q: "What is the most common avoidable mistake in the first five minutes of an aptitude test?",
    o: [
      "Not reading the marking scheme and instructions",
      "Starting with question one",
      "Not using the rough sheet",
      "Being nervous"
    ],
    a: 0,
    x: "The marking scheme decides your entire guessing strategy, and it varies between tests. Five minutes of assumption can cost the paper.",
    note: "Check three things before starting: marks per question, the penalty for a wrong answer, and whether sections are separately timed. All three change what the optimal paper looks like."
  },
  {
    tag: "Approximation", lvl: "intermediate",
    q: "When are you safe to approximate rather than compute exactly?",
    o: [
      "When the options are far enough apart that your error cannot cross between them",
      "Whenever you are short of time",
      "Only in data interpretation",
      "Never — approximation is guessing"
    ],
    a: 0,
    x: "Approximation is a decision about **option spacing**, not about time. Glance at the options first; if they differ by 20%, a 5% estimate is completely safe.",
    note: "The corollary is the useful half: when two options are within 1% of each other, that is a deliberate signal that exact computation is required. The option list is telling you how to solve the question."
  },
  {
    tag: "Preparation", lvl: "intermediate",
    q: "Which practice pattern builds aptitude speed fastest?",
    o: [
      "Short daily timed sets on mixed topics",
      "Long weekly sessions on one topic at a time",
      "Reading solved examples without attempting them",
      "Attempting only the hardest questions"
    ],
    a: 0,
    x: "Speed is recognition, and recognition needs frequent retrieval under a clock. Mixing topics forces you to identify the type first — which is the actual exam skill.",
    note: "Practising one topic at a time hides the hardest step: in a real paper nobody tells you it is a mixture problem. Blocked practice feels more productive and transfers less."
  },
  {
    tag: "Exam day", lvl: "advanced",
    q: "You realise ten minutes from the end that you misread a question you solved twenty minutes ago. What should you do?",
    o: [
      "Fix it only if it takes under a minute; otherwise leave it and keep attempting new questions",
      "Go back and redo it carefully",
      "Ignore it entirely",
      "Recheck all your earlier answers for the same mistake"
    ],
    a: 0,
    x: "One correction is worth exactly one question, and so is a new attempt. Rechecking everything is worth far less than either, and costs the most.",
    note: "The instinct to audit the whole paper after finding one error is strong and almost always wrong: it converts remaining time into anxiety rather than marks."
  },
  {
    tag: "Guessing", lvl: "advanced",
    q: "In a +4/−1 four-option test, you can eliminate one option on a question. What is the expected value of guessing?",
    o: [
      "+0.67 marks — clearly worth it",
      "0 — exactly break-even",
      "−0.25 marks — not worth it",
      "+2 marks"
    ],
    a: 0,
    x: "With three options left, p = 1/3: EV = (1/3)(4) + (2/3)(−1) = 1.33 − 0.67 = **+0.67**.",
    steps: [
      "After eliminating one option, three remain, so p = 1/3.",
      "EV = 4 × (1/3) − 1 × (2/3).",
      "= 1.333 − 0.667 = **+0.67 marks**.",
      "Positive, so guess. Every eliminated option raises the EV sharply — which is why elimination is a scoring technique, not just a fallback."
    ]
  },
  {
    tag: "Sectional strategy", lvl: "intermediate",
    q: "Within a section you may attempt questions in any order. Where should you start?",
    o: [
      "With your strongest topic, to bank marks and settle your nerves",
      "With question one, for simplicity",
      "With the longest questions, while fresh",
      "With your weakest topic, while you have most time"
    ],
    a: 0,
    x: "Early marks are worth the same as late ones, but early confidence changes how you perform on everything after. Opening on a strength is both a scoring and a psychological decision.",
    note: "Opening on a weakness is a common and expensive plan: a hard start burns time and composure at once, and the composure is harder to get back than the time."
  },
  {
    tag: "Exam craft", lvl: "advanced",
    q: "What does it usually mean when your calculated answer is not among the options?",
    o: [
      "Re-read the question once — it is most often a misreading, not an arithmetic error",
      "Pick the closest option",
      "Skip immediately without re-reading",
      "Recompute from the beginning"
    ],
    a: 0,
    x: "Wrong readings — the total rather than the increase, the wrong base for a percentage, minutes rather than hours — account for most of these, and one re-read catches them.",
    steps: [
      "Re-read the question, focusing on exactly what quantity is asked for.",
      "Check your units and your base.",
      "If it still does not appear, skip. Do not recompute the whole thing.",
      "Never pick the nearest option: the near-miss values are usually placed there deliberately, as the results of specific mistakes."
    ]
  },
  {
    tag: "Preparation", lvl: "core",
    q: "What is the most useful revision artefact for aptitude?",
    o: [
      "A formula sheet you wrote yourself",
      "A printed formula book",
      "A collection of solved papers",
      "Video lectures"
    ],
    a: 0,
    x: "Writing it is the revision. A sheet you compiled contains exactly what you kept forgetting, which is never what a printed book emphasises.",
    note: "The test of a good personal sheet: every line on it is something you once got wrong. If it contains formulas you have never fumbled, it is a textbook, not a revision tool."
  },
  {
    tag: "Timing", lvl: "core",
    q: "Roughly how long should an average aptitude question take?",
    o: ["60-90 seconds", "3-4 minutes", "About 30 seconds", "2-3 minutes"],
    a: 0,
    x: "Most placement and competitive papers budget around **60-90 seconds** per question. Every shortcut in the track exists because of that clock.",
    note: "The implication is worth stating plainly: a method that is correct but takes three minutes is a wrong method for this exam. Correctness is necessary and not sufficient."
  },
  {
    tag: "Mock analysis", lvl: "advanced",
    q: "Your mock scores have plateaued for a month despite steady practice. What is the most likely cause?",
    o: [
      "You are practising what you can already do rather than what you get wrong",
      "You need harder questions",
      "You are not practising enough hours",
      "The mocks are getting harder"
    ],
    a: 0,
    x: "Practice drifts towards the comfortable. A plateau almost always means the error log stopped driving what gets practised.",
    note: "The fix is mechanical: keep a list of every question you got wrong, tagged by type, and let the next week's practice be drawn from the two most frequent tags. Nothing else."
  }

]);
