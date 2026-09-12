/* Professional English — the hardcore set.

   These are the errors that survive competence. Every one of them is made
   daily by fluent, educated, native speakers, which is exactly why they are
   worth a chapter: the tempting option is not a beginner's guess, it is the
   form most people around you actually use. */

TD.addMCQ("english", "grammar", [

  {
    tag: "Agreement", lvl: "hardcore",
    q: "Which sentence handles the *neither… nor* agreement correctly?",
    o: [
      "Neither the manager nor the engineers have signed off.",
      "Neither the manager nor the engineers has signed off.",
      "Neither the manager nor the engineers has signed-off.",
      "Neither the manager or the engineers have signed off."
    ],
    a: 0,
    x: "With *neither… nor*, the verb agrees with the subject **nearer to it**. That is *engineers*, which is plural, so *have* is correct.",
    steps: [
      "The rule of proximity: in *either/or* and *neither/nor*, the verb matches the closest subject.",
      "The nearer subject here is *the engineers*, plural.",
      "So: *Neither the manager nor the engineers **have** signed off.*",
      "Reverse the order and the verb changes: *Neither the engineers nor the manager **has** signed off.*"
    ],
    note: "*Neither* pairs only with *nor*, never with *or* — and *sign off* is two words as a verb, one hyphenated word only as a noun (*we need a sign-off*)."
  },

  {
    tag: "Agreement", lvl: "hardcore",
    q: "Which sentence gets both *the number of* and *a number of* right?",
    o: [
      "The number of open tickets is falling, and a number of them are duplicates.",
      "The number of open tickets are falling, and a number of them is duplicates.",
      "The number of open tickets are falling, and a number of them are duplicates.",
      "The number of open tickets is falling, and a number of them is duplicates."
    ],
    a: 0,
    x: "*The number* is a single quantity and takes a singular verb. *A number of* means *several* and takes a plural one. The two phrases differ by one article and take opposite verbs.",
    steps: [
      "*The number of X* refers to the count itself — one thing. Singular: **is**.",
      "*A number of X* is an informal way of saying *some X* — many things. Plural: **are**.",
      "Hence: *The number **is** falling… a number of them **are** duplicates.*"
    ],
    note: "The same pattern governs *the majority of* and *a total of*. Ask what the sentence is really about: the count, or the things being counted."
  },

  {
    tag: "Agreement", lvl: "hardcore",
    q: "A plural noun sits between the subject and the verb. Which sentence still agrees correctly?",
    o: [
      "Each of the services has its own database.",
      "Each of the services have their own database.",
      "Each of the services have its own database.",
      "Each of the services has their own databases."
    ],
    a: 0,
    x: "*Each* is singular, and the intervening phrase *of the services* does not change that. Singular subject, singular verb, singular possessive: *each… has its*.",
    steps: [
      "Strip the prepositional phrase: *Each … has its own database.*",
      "*Each*, *every*, *either*, *neither* and *none* are singular subjects.",
      "The plural noun sitting between the subject and the verb is a distractor, not the subject."
    ],
    note: "Deleting everything between the subject and the verb is the single most reliable agreement test there is. It is what makes *the list of items is* correct even though it sounds wrong to almost everybody."
  },

  {
    tag: "Modifiers", lvl: "hardcore",
    q: "Which sentence is correctly constructed?",
    o: [
      "Having reviewed the logs, we found the cause within an hour.",
      "Having reviewed the logs, the cause was found within an hour.",
      "Having reviewed the logs, it was found that the cause was a timeout.",
      "After reviewing the logs, the cause became clear within an hour."
    ],
    a: 0,
    x: "An opening participial phrase attaches to the subject that follows it. Only in the correct sentence is that subject **we** — somebody capable of reviewing logs. In the others the logs are being reviewed by *the cause* or by *it*.",
    steps: [
      "*Having reviewed the logs* describes an action performed by somebody.",
      "Whatever noun follows the comma is taken to be that somebody.",
      "*the cause was found* makes the cause the reviewer — a dangling modifier.",
      "Only *we* can review logs, so only that version is properly constructed."
    ],
    note: "This is why passive voice and opening participles fight each other. If you want the passive, drop the participle: *The cause was found within an hour of reviewing the logs.*"
  },

  {
    tag: "Case", lvl: "hardcore",
    q: "Which sentence chooses correctly between *whoever* and *whomever*?",
    o: [
      "Send it to whoever is on call.",
      "Send it to whomever is on call.",
      "Send it to whom is on call.",
      "Send it to whomsoever is on call."
    ],
    a: 0,
    x: "*Whoever* is the **subject of its own clause** (*whoever is on call*), and that beats the preposition in front of it. The whole clause is what *to* takes as its object.",
    steps: [
      "Find the clause: *whoever is on call*.",
      "Inside that clause the word is doing the subject's job — it is the one who is on call.",
      "Subject position takes *whoever*, not *whomever*, regardless of the preceding *to*."
    ],
    note: "The reliable test: replace with *he/him*. *He is on call*, not *him is on call*, so it is the subject form. This is the case where *whomever* sounds more correct to most people and is simply wrong."
  },

  {
    tag: "Case", lvl: "hardcore",
    q: "Which sentence uses the right pronoun after a preposition?",
    o: [
      "Between you and me, the estimate was optimistic.",
      "Between you and I, the estimate was optimistic.",
      "Between you and myself, the estimate was optimistic.",
      "Between yourself and I, the estimate was optimistic."
    ],
    a: 0,
    x: "*Between* is a preposition and takes object pronouns, so it is *me*. *Between you and I* is a hypercorrection — an attempt to sound careful that produces an error.",
    steps: [
      "Remove the other person: *between … me*, never *between … I*.",
      "*Myself* is reflexive and needs an earlier *I* in the same clause to refer back to.",
      "So: **between you and me**."
    ],
    note: "*Myself* used as a polite substitute for *me* — *please send it to myself* — is the same instinct and the same error. Reflexives are for when you are both the doer and the target: *I sent it to myself.*"
  },

  {
    tag: "Mood", lvl: "hardcore",
    q: "Which sentence uses the correct verb form?",
    o: [
      "If I were the reviewer, I would have flagged it.",
      "If I was the reviewer, I would have flagged it.",
      "If I would be the reviewer, I would have flagged it.",
      "If I was the reviewer, I would of flagged it."
    ],
    a: 0,
    x: "This is a hypothetical contrary to fact, which takes the **subjunctive** *were* regardless of the subject.",
    steps: [
      "The speaker is not the reviewer; the clause imagines a situation that is not true.",
      "Contrary-to-fact conditions use *were* for every person: *if I were*, *if he were*.",
      "*If I was* is correct only for a real past possibility: *if I was rude yesterday, I apologise.*"
    ],
    note: "*Would of* is never correct in any sentence. It exists only because *would've* sounds like it, and it is one of the few errors that reliably costs a reader's confidence in the writer."
  },

  {
    tag: "Punctuation", lvl: "hardcore",
    q: "Two complete sentences are being joined. Which version punctuates the join correctly?",
    o: [
      "The deploy failed; the rollback worked.",
      "The deploy failed, the rollback worked.",
      "The deploy failed: the rollback worked.",
      "The deploy failed, however the rollback worked."
    ],
    a: 0,
    x: "Two independent clauses joined without a conjunction need a semicolon. A comma alone is a **comma splice**, and *however* is an adverb rather than a conjunction, so it cannot join them either.",
    steps: [
      "*The deploy failed* and *the rollback worked* are both complete sentences.",
      "Joining two complete sentences requires a semicolon, a full stop, or a comma plus a conjunction such as *but*.",
      "A colon would imply the second clause explains or completes the first, which here it does not."
    ],
    note: "*However* needs a semicolon before it and a comma after: *The deploy failed; however, the rollback worked.* Treating it as though it were *but* is the most common punctuation error in professional writing."
  },

  {
    tag: "Modifiers", lvl: "hardcore",
    q: "Which sentence means that the team's **only** action was reviewing the API — they did nothing else to it?",
    o: [
      "The team only reviewed the API.",
      "Only the team reviewed the API.",
      "The team reviewed only the API.",
      "The team reviewed the API only."
    ],
    a: 0,
    x: "*Only* modifies whatever directly follows it. Before the verb, it limits the **action**: they reviewed it and did nothing more. Before *the API*, it limits the object; before *the team*, the subject.",
    steps: [
      "*The team only reviewed the API* — reviewing was all they did.",
      "*Only the team reviewed the API* — nobody else reviewed it.",
      "*The team reviewed only the API* — they reviewed nothing else.",
      "Each placement produces a genuinely different claim."
    ],
    note: "*Only* is the most-misplaced word in English. In speech, stress carries the meaning; in writing there is no stress, so position is the only signal you have."
  },

  {
    tag: "Parallelism", lvl: "hardcore",
    q: "Which sentence is grammatically parallel?",
    o: [
      "The role involves writing code, reviewing designs and mentoring juniors.",
      "The role involves writing code, design reviews and to mentor juniors.",
      "The role involves writing code, reviewing designs and mentorship of juniors.",
      "The role involves to write code, reviewing designs and mentoring juniors."
    ],
    a: 0,
    x: "Items in a list must share a grammatical form. Three *-ing* verbs is parallel; mixing a gerund, a noun phrase and an infinitive is not.",
    steps: [
      "Read each item as though it followed *involves* on its own.",
      "*involves writing* ✓, *involves reviewing* ✓, *involves mentoring* ✓.",
      "*involves to mentor* ✗ and *involves design reviews* changes the form mid-list."
    ],
    note: "Broken parallelism rarely causes misunderstanding, which is why it survives. It does make writing feel amateurish, and it is the most common structural flaw in resume bullet points."
  }

]);

TD.addMCQ("english", "vocab", [

  {
    tag: "Confusables", lvl: "hardcore",
    q: "Which sentence uses *affect* and *effect* correctly?",
    o: [
      "The outage will affect throughput; the effect should be visible by noon.",
      "The outage will effect throughput; the affect should be visible by noon.",
      "The outage will affect throughput; the affect should be visible by noon.",
      "The outage will effect throughput; the effect should be visible by noon."
    ],
    a: 0,
    x: "*Affect* is usually the verb and *effect* usually the noun. Here the outage **affects** throughput, and the **effect** is what you observe.",
    steps: [
      "Verb slot, meaning *to influence*: **affect**.",
      "Noun slot, meaning *the result*: **effect**.",
      "*Effect* can also be a verb meaning *to bring about* — *effect a change* — which is the exception that makes this pair hard."
    ],
    note: "The rare senses are the real trap: *affect* as a noun means observable emotion, in psychology. If you are not writing a clinical note, the usual mapping holds."
  },

  {
    tag: "Confusables", lvl: "hardcore",
    q: "Which sentence uses *discrete* and *discreet* correctly?",
    o: [
      "The pipeline has four discrete stages, and she was discreet about the layoffs.",
      "The pipeline has four discreet stages, and she was discrete about the layoffs.",
      "The pipeline has four discrete stages, and she was discrete about the layoffs.",
      "The pipeline has four discreet stages, and she was discreet about the layoffs."
    ],
    a: 0,
    x: "*Discrete* means separate and countable — the sense engineers use daily. *Discreet* means careful about what you disclose. They are unrelated words that a spellchecker cannot tell apart.",
    steps: [
      "Separate, distinct, individually countable: **discrete**. Discrete stages, discrete values, discrete mathematics.",
      "Tactful, unobtrusive, keeping a confidence: **discreet**.",
      "Neither is a misspelling of the other, so nothing flags the swap."
    ],
    note: "The memory hook is in the spelling itself: *discrete* has its two e's separated by the t, which is what the word means. Both are real words in every dictionary, which is exactly why this pair survives every automated check."
  },

  {
    tag: "Confusables", lvl: "hardcore",
    q: "Which sentence uses *fewer* and *less* correctly?",
    o: [
      "We had fewer incidents this quarter, so there was less downtime.",
      "We had less incidents this quarter, so there was fewer downtime.",
      "We had less incidents this quarter, so there was less downtime.",
      "We had fewer incidents this quarter, so there was fewer downtime."
    ],
    a: 0,
    x: "*Fewer* counts discrete things — incidents. *Less* measures continuous quantities — downtime.",
    steps: [
      "Can you count them individually? Incidents, yes: **fewer**.",
      "Is it a mass or a measurement? Downtime, yes: **less**.",
      "Time, money and distance take *less* even when a number is attached: *less than five minutes*."
    ],
    note: "The measurement exception is what makes this genuinely hard rather than merely pedantic. *Fewer than five minutes* is technically consistent and sounds wrong to everybody, because minutes are being used as a measurement rather than as counted objects."
  },

  {
    tag: "Confusables", lvl: "hardcore",
    q: "Your manager says, *I am not saying the estimate is wrong.* You conclude they have doubts about it. In this exchange:",
    o: [
      "They implied it and you inferred it",
      "They inferred it and you implied it",
      "They implied it and you implied it",
      "They inferred it and you inferred it"
    ],
    a: 0,
    x: "The speaker **implies** — puts the meaning in without stating it. The listener **infers** — takes the meaning out. The two words describe opposite ends of the same act.",
    steps: [
      "*Imply* is what the sender does.",
      "*Infer* is what the receiver does.",
      "So the manager implied, and you inferred."
    ],
    note: "*Are you inferring that I was careless?* is the standard misuse, and it says the opposite of what the speaker means — it accuses the other person of drawing a conclusion rather than of hinting at one."
  },

  {
    tag: "Confusables", lvl: "hardcore",
    q: "In careful usage, *peruse a document* means to:",
    o: [
      "Read it carefully and in full",
      "Skim it quickly",
      "Read only the summary",
      "Read it a second time"
    ],
    a: 0,
    x: "*Peruse* means to read **thoroughly**. It is very widely used to mean the opposite — to glance over — which is why it is now a word that reliably obscures your meaning.",
    steps: [
      "The traditional and dictionary-primary sense is *to examine in detail*.",
      "A common modern usage inverts it to *to skim*.",
      "Because both readings are now live, the word cannot be relied on to communicate either."
    ],
    note: "The practical advice is not to defend the original meaning but to abandon the word. Write *read carefully* or *skim*, and your reader knows which you meant."
  },

  {
    tag: "Confusables", lvl: "hardcore",
    q: "*A biannual review* most reliably means a review that happens:",
    o: [
      "The word is ambiguous — say *twice a year* or *every two years* instead",
      "Twice a year",
      "Once every two years",
      "Twice every two years"
    ],
    a: 0,
    x: "*Biannual* is used for both senses by different writers, and *biennial* — which properly means every two years — is close enough to be misread. The word cannot be trusted in a schedule.",
    steps: [
      "*Biannual* is recorded as both *twice a year* and *every two years*.",
      "*Biennial* means every two years, and *semi-annual* means twice a year.",
      "Since a reader cannot tell which you meant, the safe form is the plain English one."
    ],
    note: "The same problem afflicts *bimonthly* and *biweekly*. In anything with a date attached — a contract, a review cycle, a payment schedule — write the interval out."
  },

  {
    tag: "Confusables", lvl: "hardcore",
    q: "Which sentence uses *flout* and *flaunt* correctly?",
    o: [
      "He flouted the review process and flaunted his access to production.",
      "He flaunted the review process and flouted his access to production.",
      "He flouted the review process and flouted his access to production.",
      "He flaunted the review process and flaunted his access to production."
    ],
    a: 0,
    x: "*Flout* means to defy openly — a rule. *Flaunt* means to display ostentatiously — a possession. You flout a process and flaunt a privilege.",
    steps: [
      "Rules and conventions are **flouted**.",
      "Wealth, status and access are **flaunted**.",
      "So: flouted the process, flaunted the access."
    ],
    note: "*Flaunting the rules* is the standard error and it is common enough to appear in newspapers. The mnemonic that survives: you can only flaunt something you have."
  },

  {
    tag: "Register", lvl: "hardcore",
    q: "A colleague in another country writes: *Please revert with the details.* In international English this most likely means:",
    o: [
      "Reply — a South Asian business usage that confuses many other readers",
      "Roll back the change",
      "Return the document to its sender",
      "Escalate the request"
    ],
    a: 0,
    x: "*Revert* meaning *reply* is standard in Indian and some Middle Eastern business English. In most other varieties *revert* means *return to a previous state*, so the sentence can read as *undo it*.",
    steps: [
      "The intended meaning here is *reply to me*.",
      "In British and American usage, *revert* means to go back to a former condition.",
      "In an engineering context that ambiguity is genuinely costly, since *revert* is also the word for undoing a commit."
    ],
    note: "This is not an error to correct in somebody else — it is a live regional variety. It is worth knowing in both directions: recognise it when you receive it, and use *reply* when writing to a mixed audience, because *revert* beside a deploy conversation can be read as an instruction."
  }

]);

TD.addMCQ("english", "write", [

  {
    tag: "Email", lvl: "hardcore",
    q: "You need a decision from a busy stakeholder by Thursday. Which closing line is most likely to produce one?",
    o: [
      "Unless I hear otherwise by Thursday, I will proceed with option B.",
      "Let me know your thoughts.",
      "Please advise at your earliest convenience.",
      "Kindly do the needful and revert."
    ],
    a: 0,
    x: "It converts a decision that can stall indefinitely into a **default with a deadline**, and moves the burden of action onto whoever disagrees. The other three all require the reader to initiate something.",
    steps: [
      "*Let me know your thoughts* names no action and no date, so it goes to the bottom of a busy inbox.",
      "*At your earliest convenience* is a deadline in disguise and reads as passive pressure without actually setting one.",
      "The stated default means silence produces a result, which is the only closing that survives a full inbox."
    ],
    note: "The technique has a limit worth respecting: use it for reversible decisions, not irreversible ones. *Unless I hear otherwise I will delete the old database* is a threat, not a default."
  },

  {
    tag: "Tone", lvl: "hardcore",
    q: "Which of these reads as most passive-aggressive to a typical reader, even though it is grammatically polite?",
    o: [
      "As per my previous email…",
      "Following up on my note from Tuesday — any update?",
      "Just checking whether this is still on your list.",
      "Sorry to chase, I know you are buried."
    ],
    a: 0,
    x: "*As per my previous email* is read almost universally as *you did not read what I sent*. It points at the reader's failure rather than at the request, which is why it lands as an accusation.",
    steps: [
      "All four are chasing the same thing.",
      "Three of them locate the problem in the situation — a busy week, a long list.",
      "*As per my previous email* locates it in the reader, and does so in a formal register that makes it sound like a record being built."
    ],
    note: "The rule underneath: in a chase, re-state the ask rather than referring back to the fact that you already made it. Repeating the request is helpful; pointing out that it is a repeat is not."
  },

  {
    tag: "Chat", lvl: "hardcore",
    q: "Which chat habit most reliably annoys colleagues in a busy channel?",
    o: [
      "Sending *hi* and waiting for a reply before saying what you need",
      "Writing a four-line message with the question at the top",
      "Using a thread for a follow-up discussion",
      "Editing a message to fix a typo"
    ],
    a: 0,
    x: "It costs the recipient a context switch that buys them nothing — they now have to wait to find out what is wanted, and cannot triage. Put the question in the first message.",
    steps: [
      "Chat is asynchronous, so a greeting alone forces two round trips before any information moves.",
      "The other three all either carry information or reduce noise.",
      "*Hi, quick question about the migration — is the dual-write still on?* costs the same keystrokes and needs one round trip."
    ],
    note: "The same logic covers *can I ask you something?* and *are you free?*. Ask the question and let the other person decide whether they are free — they cannot decide without knowing what it is."
  },

  {
    tag: "Status updates", lvl: "hardcore",
    q: "Which line belongs in a status update to a manager?",
    o: [
      "Backfill is slower than estimated; if it is still behind on Wednesday I will come back with a revised date.",
      "Spent most of the week on the backfill.",
      "Making good progress, should be fine.",
      "Working hard on it, will keep pushing."
    ],
    a: 0,
    x: "It names a **risk**, gives a **trigger**, and states **when you will report next**. The other three describe effort rather than progress, and effort is not information.",
    steps: [
      "A manager needs to know whether to act, and none of the vague options tells them.",
      "Volunteering a risk before it is discovered is what builds trust, because it proves you are watching.",
      "Naming the date you will next report removes the need for anybody to chase you."
    ],
    note: "*Making good progress* is the phrase most likely to precede a missed deadline, and experienced managers hear it that way. Anything you would not put a date next to is not a status."
  }

]);

TD.addMCQ("english", "culture", [

  {
    tag: "Indirect feedback", lvl: "hardcore",
    q: "A British colleague says: *That is an interesting approach. I wonder whether we might want to consider the alternative.* Most likely meaning:",
    o: [
      "They disagree and want you to change the approach",
      "They find the approach genuinely interesting and are thinking aloud",
      "They are undecided and want more information",
      "They approve, with a minor reservation"
    ],
    a: 0,
    x: "In British and much Northern European workplace English, *interesting* and *I wonder whether we might want to consider* are conventional **softeners for disagreement**. The literal reading is not the operative one.",
    steps: [
      "*Interesting* in this register frequently signals reservation rather than enthusiasm.",
      "*I wonder whether we might want to consider X* is a hedged instruction to do X.",
      "Taken together, it is a fairly firm disagreement expressed with maximum politeness."
    ],
    note: "The reverse mistake matters just as much. A direct Dutch or German colleague saying *no, that is wrong* is usually not being rude — that register treats directness as respect for your time. Neither style is the correct one; both are conventions."
  },

  {
    tag: "Hedging", lvl: "hardcore",
    q: "Which sentence is most likely to be **ignored** by a senior reader, despite being polite and correct?",
    o: [
      "I may be missing something, but I just wondered if it might possibly be worth perhaps re-checking the index.",
      "I think the index may be missing. Worth a check before we ship?",
      "The index looks wrong to me. Can we check it before we ship?",
      "Could we check the index before we ship? I think it may be missing."
    ],
    a: 0,
    x: "Stacking hedges — *may*, *just*, *wondered*, *might*, *possibly*, *perhaps* — cancels the message. One hedge softens; six of them tell the reader the writer does not believe it themselves.",
    steps: [
      "Hedging exists to soften an assertion without withdrawing it.",
      "Each additional hedge withdraws a little more of the claim.",
      "By the sixth, the reader can safely ignore the sentence, because the writer appears to be inviting exactly that."
    ],
    note: "*Just* is the highest-frequency offender in professional writing — *just checking*, *just wondering*, *just a quick one*. Deleting every instance of it almost always improves the sentence, and it costs nothing in politeness."
  },

  {
    tag: "Register", lvl: "hardcore",
    q: "You are writing to a client for the first time. Which sign-off is safest internationally?",
    o: ["Best regards,", "Cheers,", "Yours faithfully,", "Warmly,"],
    a: 0,
    x: "*Best regards* is neutral, professional and understood everywhere. *Cheers* is casual and regional, *Yours faithfully* belongs with an unnamed formal salutation, and *Warmly* presumes a relationship you do not yet have.",
    steps: [
      "The sign-off should match both the formality of the greeting and the stage of the relationship.",
      "A first client email is professional but not archaic, and warm but not familiar.",
      "*Best regards* is the only option that fits all of those at once."
    ],
    note: "*Cheers* is entirely normal among colleagues in the UK, Australia and Ireland, and reads as oddly informal to many US, European and Asian recipients. That is a difference in convention rather than in politeness, but the first client email is not where to test it."
  }

]);
