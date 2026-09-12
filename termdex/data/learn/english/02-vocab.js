/* Professional English — building vocabulary that stays. */
TD.addLessons("english", [

  {
    t: "Roots, Prefixes and Suffixes — decoding words you have never seen",
    m: "vocab",
    lvl: "core",
    s: "Most long English words are Latin or Greek machinery bolted together. Learn the parts and you stop needing the whole.",
    goal: [
      "Break an unfamiliar word into prefix, root and suffix and guess its meaning",
      "Learn the highest-yield roots that appear across business, technical and exam English",
      "Use suffixes to convert one word into its noun, verb, adjective and adverb forms on demand"
    ],
    b: [
      { p: "English has the largest vocabulary of any major language because it stole from everywhere: Germanic for the everyday words, French for the formal ones, Latin and Greek for the technical ones. That history is the reason **the long word and the short word usually mean the same thing** — *begin* and *commence*, *end* and *terminate*, *ask* and *enquire* — and it is also the reason a few hundred roots unlock tens of thousands of words." },

      { ana: "A long English word is a compound noun in a programming language: `un` + `precedent` + `ed` is a prefix modifying a root modified by a suffix, exactly like `is_not_seen_before`. Once you can read the parts you never have to memorise the whole identifier.", at: "Words are compound identifiers" },

      { h: "The prefixes that carry the most weight" },

      {
        tbl: {
          t: "High-yield prefixes",
          h: ["Prefix", "Meaning", "Words"],
          rows: [
            ["**a-, an-**", "without", "atypical, amoral, anonymous, anomaly"],
            ["**ante-, pre-**", "before", "antecedent, precedent, premise, preliminary"],
            ["**anti-, contra-, counter-**", "against", "antithesis, contradict, counterproductive, contravene"],
            ["**bene-, eu-**", "good, well", "benefit, benevolent, euphemism, eulogy"],
            ["**circum-, peri-**", "around", "circumvent, circumspect, peripheral, perimeter"],
            ["**con-, com-, syn-, sym-**", "with, together", "consensus, collaborate, synergy, symbiosis"],
            ["**de-**", "down, away, reverse", "decline, deprecate, delegate, devalue"],
            ["**dis-, dys-**", "apart, bad", "dissent, disparate, dysfunction"],
            ["**ex-, e-**", "out of", "extract, explicit, elicit, exclude"],
            ["**inter-, intra-**", "between / within", "intermediary, interim, intranet, intramural"],
            ["**mal-, mis-**", "bad, wrong", "malpractice, malfeasance, misconstrue"],
            ["**ob-, op-**", "against, toward", "obstruct, obstinate, opposition"],
            ["**per-**", "through, thoroughly", "pervasive, persistent, perennial"],
            ["**pro-**", "forward, in favour", "proponent, proactive, protracted"],
            ["**sub-, sup-**", "under", "subordinate, subsidiary, suppress, subtle"],
            ["**super-, sur-, hyper-**", "above, excessive", "supersede, surplus, hyperbole"],
            ["**trans-**", "across", "transcend, transparent, transitory"],
            ["**ver-**", "truth", "verify, veracity, verdict, aver"]
          ]
        }
      },

      { h: "Roots worth knowing before an exam or an interview" },

      {
        tbl: {
          t: "High-yield Latin and Greek roots",
          h: ["Root", "Meaning", "Family"],
          rows: [
            ["**dict**", "say", "dictate, verdict, edict, indict, contradict"],
            ["**duc, duct**", "lead", "conduct, induce, deduce, tractable"],
            ["**fid**", "faith", "confide, fidelity, bona fide, perfidy"],
            ["**greg**", "flock, group", "gregarious, aggregate, segregate, egregious"],
            ["**loqu, locut**", "speak", "eloquent, colloquial, loquacious, circumlocution"],
            ["**mit, miss**", "send", "transmit, remit, remiss, emissary"],
            ["**pend, pens**", "hang, weigh, pay", "pending, suspend, compensate, propensity"],
            ["**pon, pos**", "put, place", "component, proponent, juxtapose, deposition"],
            ["**scrib, script**", "write", "prescribe, proscribe, conscription, nondescript"],
            ["**spec, spic**", "look", "inspect, circumspect, perspicacious, conspicuous"],
            ["**tang, tact, ting**", "touch", "tangible, contingent, tactile, contiguous"],
            ["**ten, tain**", "hold", "tenable, tenacious, retain, abstain"],
            ["**vert, vers**", "turn", "avert, averse, inadvertent, versatile"],
            ["**voc, vok**", "call, voice", "vocation, evoke, revoke, equivocate"]
          ]
        }
      },

      { trap: "**prescribe** and **proscribe** differ by one prefix and mean opposite things: *pre-* = recommend it, *pro-* (here *forward, publicly*) = forbid it. The same trap runs through *ingenuous* (naive) / *ingenious* (clever) and *deprecate* (disapprove) / *depreciate* (fall in value). Roots get you 90% of the way; the last 10% has to be checked." },

      { h: "Suffixes: converting a word into whichever part of speech you need" },

      { p: "This is the practical half. Interviewers and exams both reward being able to say the same idea as a noun, a verb, an adjective and an adverb, because it is what lets you rewrite a sentence rather than repeat it." },

      {
        tbl: {
          t: "Word families you should be able to generate on demand",
          h: ["Verb", "Noun (thing)", "Noun (person)", "Adjective", "Adverb"],
          rows: [
            ["analyse", "analysis", "analyst", "analytical", "analytically"],
            ["decide", "decision", "decision-maker", "decisive", "decisively"],
            ["compete", "competition", "competitor", "competitive", "competitively"],
            ["persuade", "persuasion", "—", "persuasive", "persuasively"],
            ["negotiate", "negotiation", "negotiator", "negotiable", "—"],
            ["collaborate", "collaboration", "collaborator", "collaborative", "collaboratively"],
            ["implement", "implementation", "implementer", "—", "—"],
            ["prioritise", "priority / prioritisation", "—", "prioritised", "—"],
            ["rely", "reliance / reliability", "—", "reliable / reliant", "reliably"],
            ["succeed", "success / succession", "successor", "successful", "successfully"]
          ]
        }
      },

      { n: "*Succeed → success → successful* and *succeed → succession → successive* come from the same root and mean different things. When a word family splits like that, learn both branches together or you will confuse them under pressure.", nt: "Branching families" },

      { h: "The method that actually retains vocabulary" },

      {
        ol: [
          "**Never learn a word alone.** Learn it inside a sentence you would actually say. *Mitigate* is forgettable; *we mitigated the risk by adding a retry* is not.",
          "**Learn the collocation, not the word.** Native speakers do not choose *heavy* and *rain* separately; *heavy rain* is one unit in their head. Store *raise a concern*, *meet a deadline*, *reach a consensus* as single items.",
          "**Learn in opposing pairs.** *Explicit / implicit*, *converge / diverge*, *aggregate / disaggregate*. Opposites anchor each other in memory far better than isolated words.",
          "**Ten words a week, used, beats a hundred read.** A word you have written in a real email three times is yours. A word you highlighted in a list is not.",
          "**Keep a capture file, not a course.** One line per word: the word, the sentence you met it in, and one sentence of your own. Review it on the way to work."
        ]
      },

      {
        tryit: {
          t: "Decode without a dictionary",
          task: "Work out the likely meaning of each from its parts: *circumlocution*, *intractable*, *perspicacious*, *egregious*, *countervailing*.",
          hint: "circum = around, loqu = speak. in- = not, tract = pull/lead. per- = thoroughly, spic = look. e- = out of, greg = flock. counter- = against, vail = strength.",
          sol: { lang: "text", code: "circumlocution  — speaking around the point; evasive, roundabout language\nintractable     — cannot be led or handled; a problem that resists solution\nperspicacious   — seeing through thoroughly; unusually shrewd\negregious       — standing out from the flock; conspicuously bad\ncountervailing  — a force acting with equal strength against another" },
          w: "*Egregious* is the interesting one: it originally meant *outstandingly good* — standing out from the herd — and drifted to mean outstandingly bad. Roots give you the shape of a word reliably and its emotional charge only sometimes."
        }
      }
    ],
    k: [
      "A few hundred Latin and Greek roots unlock tens of thousands of English words; prefixes carry direction and negation, suffixes carry part of speech.",
      "Long words and short words usually mean the same thing — the long one is Latin, the short one is Germanic, and the register differs.",
      "Be able to generate the noun, verb, adjective and adverb form of any word you use often.",
      "Learn words in sentences, in collocations and in opposing pairs — never on a list on their own.",
      "Roots give the shape reliably and the connotation only sometimes: check *proscribe*, *ingenuous*, *deprecate*."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "We mitigated the risk by adding a retry with backoff.", w: "learn the word inside a usable sentence" },
        { c: "The requirements were explicit; the assumptions were implicit.", w: "opposing pair learned together" },
        { c: "I want to raise a concern before we commit to the date.", w: "collocation: raise a concern" }
      ]
    }
  },

  {
    t: "Synonym Ladders — the same idea at three levels of seniority",
    m: "vocab",
    lvl: "intermediate",
    s: "Register is the difference between sounding junior and sounding senior. It is almost entirely word choice, and it is learnable in an afternoon.",
    goal: [
      "Hear the register of a word before you use it",
      "Upgrade a sentence from casual to professional without making it pompous",
      "Build synonym ladders for the twenty ideas you express most often at work"
    ],
    b: [
      { p: "Every idea in English has a ladder of words attached to it. The bottom rung is casual, the middle rung is neutral professional, and the top rung is formal or written. Sounding junior is almost never a matter of being wrong — it is standing on the wrong rung." },

      { p: "The counter-intuitive part: **the top rung is not the goal.** Reaching for the most formal synonym in every sentence produces the writing style that consultants are mocked for. The skill is choosing the rung that matches the room." },

      {
        tbl: {
          t: "Core ladders for work",
          h: ["Idea", "Casual", "Neutral professional", "Formal / written"],
          rows: [
            ["begin", "start, kick off", "begin, initiate", "commence"],
            ["end", "stop, wrap up", "conclude, finalise", "terminate, cease"],
            ["tell", "tell, let you know", "inform, notify", "advise, apprise"],
            ["ask", "ask, check", "enquire, request", "solicit"],
            ["get", "get, grab", "obtain, receive", "acquire, procure"],
            ["do", "do, sort out", "carry out, perform", "execute, undertake"],
            ["show", "show", "demonstrate, indicate", "illustrate, evidence"],
            ["fix", "fix, sort", "resolve, address", "remediate, rectify"],
            ["help", "help", "support, assist", "facilitate"],
            ["a lot of", "loads of, tons of", "considerable, substantial", "a significant volume of"],
            ["think", "reckon, feel", "believe, consider", "assess, judge"],
            ["want", "want", "would like, aim to", "seek to, intend to"],
            ["big problem", "big problem", "significant issue, blocker", "material concern"],
            ["make sure", "make sure", "ensure, confirm", "verify, ascertain"],
            ["about", "about, around", "approximately, roughly", "in the region of"],
            ["use", "use", "use, apply", "utilise, leverage *(be careful)*"],
            ["talk about", "talk about", "discuss, cover", "address, examine"],
            ["find out", "find out", "determine, establish", "ascertain"],
            ["change", "change, tweak", "amend, revise, adjust", "modify, effect a change"],
            ["put off", "put off", "postpone, defer", "reschedule"]
          ]
        }
      },

      { trap: "**utilise** is not a fancier *use*, and **leverage** is not a fancier *use* either. *Utilise* properly means *put to a practical or unintended use*; *leverage* means *use one thing to amplify another*. Using them as synonyms for *use* is the single most reliable marker of writing that is trying to sound senior rather than being senior. Nine times out of ten, **use** is the correct word." },

      { h: "Reading the room: three registers, one message" },

      {
        code: {
          lang: "text", t: "The same update, delivered to three audiences",
          lines: [
            { c: "SLACK, to your team:", w: "" },
            { c: "migration is done, we are back to normal latency. one gotcha - the old", w: "" },
            { c: "endpoint 404s now, i will update the docs today.", w: "Lowercase, contractions, *gotcha*. Correct here. Formal English in a team channel reads as cold or as bad news." },
            { c: "", w: "" },
            { c: "EMAIL, to a peer team:", w: "" },
            { c: "The migration completed successfully and latency is back to baseline.", w: "" },
            { c: "One breaking change: the old endpoint now returns 404. I will update", w: "" },
            { c: "the docs today - shout if that is a problem for you.", w: "Full sentences, no slang, one friendly closer. This is the workhorse register.", hi: true },
            { c: "", w: "" },
            { c: "EMAIL, to a client or an executive:", w: "" },
            { c: "The migration is complete and performance has returned to expected", w: "" },
            { c: "levels. Please note one change: the legacy endpoint has been retired.", w: "" },
            { c: "Documentation will be updated today. Do let me know if this affects", w: "" },
            { c: "any of your integrations.", w: "No contractions, *please note*, *do let me know*. Formal but not stiff.", hi: true }
          ]
        }
      },

      { n: "The middle register is where you should live. It is safe upward, safe outward and never wrong. The other two are specialised tools: casual for people who already trust you, formal for people who do not yet.", nt: "Default to the middle" },

      { h: "Weak verb, strong verb" },

      { p: "The fastest single upgrade to professional writing is replacing a weak verb plus a noun with the strong verb hiding inside it. It shortens the sentence and sharpens it at the same time." },

      {
        tbl: {
          t: "Unpacking the buried verb",
          h: ["Weak — verb + noun", "Strong — one verb"],
          rows: [
            ["make a decision", "**decide**"],
            ["carry out an investigation", "**investigate**"],
            ["provide assistance to", "**help** / **support**"],
            ["give consideration to", "**consider**"],
            ["reach an agreement", "**agree**"],
            ["conduct a review of", "**review**"],
            ["take into account", "**account for** / **consider**"],
            ["put in place", "**implement** / **set up**"],
            ["have a discussion about", "**discuss**"],
            ["is indicative of", "**indicates**"],
            ["in the event that", "**if**"],
            ["at this point in time", "**now**"],
            ["due to the fact that", "**because**"],
            ["in order to", "**to**"],
            ["a large number of", "**many**"]
          ]
        }
      },

      { h: "The senior-sounding words worth owning" },

      { p: "A short list of words that do genuine work in professional English — precise, not decorative. These are the ones worth adding to active vocabulary." },

      {
        tbl: {
          t: "Precise words that earn their place",
          h: ["Word", "Means", "Use it when"],
          rows: [
            ["**scope**", "the agreed boundary of work", "*That is out of scope for this sprint.*"],
            ["**trade-off**", "a gain paid for by a loss", "*The trade-off is latency against cost.*"],
            ["**mitigate**", "reduce the severity of a risk", "*We mitigated it with a fallback.*"],
            ["**contingent on**", "dependent on a condition", "*The date is contingent on sign-off.*"],
            ["**material**", "large enough to matter", "*No material impact on revenue.*"],
            ["**nuance**", "an important fine distinction", "*There is a nuance here worth flagging.*"],
            ["**pragmatic**", "practical rather than ideal", "*The pragmatic option is to ship and iterate.*"],
            ["**bandwidth**", "available capacity of a person or team", "*I do not have the bandwidth this week.*"],
            ["**align**", "reach shared understanding", "*Let us align before the client call.*"],
            ["**surface**", "bring something into view", "*Worth surfacing this to the steering group.*"],
            ["**de-risk**", "remove uncertainty from a plan", "*A spike would de-risk the estimate.*"],
            ["**cadence**", "the rhythm of a recurring thing", "*We moved to a fortnightly cadence.*"],
            ["**caveat**", "a warning that limits a statement", "*One caveat: this assumes clean data.*"],
            ["**precedent**", "an earlier case that sets a pattern", "*I would rather not set that precedent.*"],
            ["**pushback**", "reasoned resistance", "*We got pushback on the pricing.*"]
          ]
        }
      },

      { trap: "There is an opposite failure mode to sounding junior, and it is worse: **sounding evasive**. Words like *synergy*, *paradigm*, *holistic*, *value-add*, *ideate*, *operationalise* and *going forward* are near-empty. Used once they are harmless. Used three times in a paragraph they signal that the writer has nothing specific to say, and experienced readers discount the whole message." },

      {
        tryit: {
          t: "Ladder your own sentence",
          task: "Take this line and write it at all three registers: *hey, can you take a look at the numbers before tomorrow? something looks off.*",
          hint: "Casual keeps the contractions. Neutral becomes a full request with a reason. Formal names the specific concern and drops contractions.",
          sol: { lang: "text", code: "Casual (team channel)\nhey - can you eyeball the Q3 numbers before tomorrow? something looks off\nin the regional split.\n\nNeutral (email to a peer)\nCould you review the Q3 numbers before tomorrow's call? The regional\nsplit does not look right to me and I would rather check before we\npresent it.\n\nFormal (email to a client or exec)\nAhead of tomorrow's review, could I ask you to verify the Q3 figures?\nThere appears to be an inconsistency in the regional breakdown, and I\nwould prefer to confirm the numbers before they are presented." },
          w: "Notice what does *not* change: the request, the deadline and the reason. Register changes the packaging. If the packaging changes the content, something has gone wrong."
        }
      }
    ],
    k: [
      "Every idea has a casual, neutral and formal synonym. Sounding junior is usually standing on the wrong rung, not being wrong.",
      "The neutral professional register is the default; the other two are specialised tools.",
      "*Utilise* and *leverage* are not fancier ways to say *use*, and using them that way is a tell.",
      "Replace verb+noun with the buried verb: *make a decision* → *decide*.",
      "Empty jargon — synergy, holistic, ideate, going forward — reads as evasion and gets the whole message discounted."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "The trade-off is latency against cost, and I would take the latency.", w: "precise senior vocabulary in a real sentence" },
        { c: "That is out of scope for this sprint - can we park it?", w: "scope and park, used correctly" },
        { c: "One caveat: this assumes the upstream data is clean.", w: "caveat introducing a limiting condition" },
        { c: "We need to decide today.", w: "strong verb instead of make a decision" }
      ]
    }
  },

  {
    t: "Confusables, Collocations and Idioms — the details that mark a careful writer",
    m: "vocab",
    lvl: "intermediate",
    s: "Word pairs that get swapped, the fixed combinations English insists on, and the idioms you will hear in every meeting.",
    goal: [
      "Stop confusing the pairs that spellcheck cannot catch",
      "Use the collocations English requires rather than the ones your first language suggests",
      "Understand and use the phrasal verbs and idioms that dominate spoken business English"
    ],
    b: [
      { h: "Confusable pairs your spellchecker will not flag" },

      { p: "Every word below is spelled correctly. That is exactly the problem — nothing will warn you, and a reader who knows the difference will notice every time." },

      {
        tbl: {
          t: "The pairs that actually appear at work",
          h: ["Pair", "Difference", "Memory hook"],
          rows: [
            ["**affect / effect**", "affect = verb, to influence. effect = noun, the result *(also a rare verb: to bring about)*", "**A**ffect is the **A**ction; **E**ffect is the **E**nd result"],
            ["**principal / principle**", "principal = main, or a person in charge. principle = a rule or belief", "Your princi**pal** is your **pal**; a princi**ple** is a ru**le**"],
            ["**complement / compliment**", "complement = completes. compliment = praise", "Compl**e**ment compl**e**tes"],
            ["**ensure / insure / assure**", "ensure = make certain. insure = buy insurance. assure = reassure a person", "You **assure** a person, **ensure** an outcome"],
            ["**imply / infer**", "the speaker implies; the listener infers", "The sender **im**plies, the receiver **in**fers"],
            ["**comprise / compose**", "the whole comprises the parts; the parts compose the whole", "Never *comprised of*"],
            ["**fewer / less**", "fewer for countable, less for uncountable", "fewer bugs, less latency"],
            ["**e.g. / i.e.**", "e.g. = for example. i.e. = that is, in other words", "**e**.g. = **e**xample; **i**.e. = **i**n other words"],
            ["**its / it's**", "its = possessive. it's = it is", "Apostrophes never make possessives out of pronouns"],
            ["**then / than**", "then = time. than = comparison", "th**a**n for comp**a**rison"],
            ["**loose / lose**", "loose = not tight. lose = to misplace", "—"],
            ["**advice / advise**", "advice = noun. advise = verb", "The **c** is the noun, the **s** is the verb — same as *practice/practise*"],
            ["**stationary / stationery**", "stationary = not moving. stationery = paper", "station**e**ry = **e**nvelopes"],
            ["**discreet / discrete**", "discreet = tactful. discrete = separate", "discre**te** = separa**te**"],
            ["**historic / historical**", "historic = important in history. historical = relating to history", "—"],
            ["**economic / economical**", "economic = about the economy. economical = cheap", "—"],
            ["**continuous / continual**", "continuous = unbroken. continual = repeated with gaps", "—"],
            ["**biannual / biennial**", "biannual = twice a year. biennial = every two years", "Genuinely ambiguous; write it out instead"],
            ["**verbal / oral**", "verbal = in words (spoken *or* written). oral = spoken", "*Verbal agreement* is technically ambiguous"],
            ["**farther / further**", "farther = physical distance. further = degree or extent", "*further discussion*, not *farther*"]
          ]
        }
      },

      { trap: "**Please revert** does not mean *please reply* in international English. *Revert* means *return to a previous state*. It is very widely used to mean *reply* in Indian business English and is understood there, but a reader elsewhere will find it odd. **Please get back to me** or **please let me know** are universal." },

      { h: "Collocations — the combinations English insists on" },

      { p: "A collocation is a pair of words that habitually go together for no logical reason. You *make* a decision but *take* a decision in British English; you *do* business but *make* an offer. Getting these wrong never breaks meaning — it just sounds subtly translated." },

      {
        tbl: {
          t: "Business collocations by verb",
          h: ["Verb", "Goes with"],
          rows: [
            ["**make**", "a decision, an offer, progress, an exception, an assumption, a mistake, an effort, arrangements, a suggestion, a profit"],
            ["**take**", "responsibility, action, a decision *(BrE)*, the lead, a look, minutes, priority, ownership, into account"],
            ["**do**", "business, research, a favour, the paperwork, damage, your best, an analysis"],
            ["**give**", "feedback, a presentation, notice, priority, an update, the go-ahead, consideration"],
            ["**meet**", "a deadline, a target, expectations, requirements, a standard, demand"],
            ["**raise**", "a concern, an issue, a ticket, an objection, awareness, capital, a question"],
            ["**reach**", "a decision, an agreement, consensus, a conclusion, a milestone, a compromise"],
            ["**run**", "a meeting, a business, a test, a risk, a pilot, the numbers"],
            ["**draw**", "a conclusion, a distinction, attention to, a comparison, up a contract"],
            ["**hold**", "a meeting, a position, responsibility, a stake, the line"],
            ["**set**", "a deadline, a precedent, expectations, a target, the agenda, the tone"],
            ["**break**", "a deadlock, the news, even, a habit, ground"]
          ]
        }
      },

      {
        tbl: {
          t: "Adjective + noun collocations that come up constantly",
          h: ["Collocation", "Meaning"],
          rows: [
            ["**hard deadline** / **soft deadline**", "immovable / negotiable"],
            ["**tight deadline**", "very little time"],
            ["**key stakeholder**", "the person whose opinion decides"],
            ["**significant impact**", "the neutral way to say something big happened"],
            ["**considerable effort**", "it cost a lot; the polite way to say so"],
            ["**valid concern**", "acknowledging an objection before answering it"],
            ["**fair point**", "conceding one step without conceding the argument"],
            ["**reasonable assumption**", "the standard hedge before a number"],
            ["**vested interest**", "a personal stake that biases someone"],
            ["**mutually exclusive**", "cannot both be true or both be chosen"],
            ["**due diligence**", "the checking you are expected to have done"],
            ["**best practice**", "the conventionally recommended way *(note: no article)*"]
          ]
        }
      },

      { h: "Phrasal verbs: the spoken half of business English" },

      { p: "Formal writing prefers the Latin verb; speech overwhelmingly prefers the phrasal verb. If you only know the formal one you will write well and struggle to follow a meeting." },

      {
        tbl: {
          t: "Phrasal verb ↔ formal equivalent",
          h: ["Phrasal (spoken)", "Formal (written)", "Example"],
          rows: [
            ["**kick off**", "commence", "Let us kick off with the numbers."],
            ["**follow up (on)**", "pursue, revisit", "I will follow up on that after the call."],
            ["**circle back**", "return to", "Let us circle back to this on Thursday."],
            ["**touch base**", "make contact", "Touching base on the proposal."],
            ["**run by / past**", "seek approval from", "Can I run this past you first?"],
            ["**push back (on)**", "object to", "Legal pushed back on the wording."],
            ["**roll out**", "deploy, launch", "We roll out to EU next month."],
            ["**scale back / down**", "reduce", "We scaled back the scope."],
            ["**take on**", "accept responsibility for", "She took on the migration."],
            ["**bring up**", "raise", "Someone brought that up last week."],
            ["**sort out**", "resolve", "We sorted out the auth issue."],
            ["**hold off (on)**", "postpone", "Let us hold off on the announcement."],
            ["**flag up / flag**", "draw attention to", "Flagging a risk on the timeline."],
            ["**loop in**", "include in a conversation", "Looping in Priya for the security view."],
            ["**back out (of)**", "withdraw", "The vendor backed out."],
            ["**iron out**", "resolve small problems", "A few details still to iron out."],
            ["**stand in for**", "substitute for", "I am standing in for Sam this week."],
            ["**wind down / wrap up**", "conclude", "Let us wrap up — we are at time."],
            ["**cut over**", "switch to a new system", "We cut over on Saturday night."],
            ["**bottom out**", "reach the lowest point", "Churn seems to have bottomed out."]
          ]
        }
      },

      { h: "Idioms you will hear in meetings" },

      {
        tbl: {
          t: "Meeting idioms, decoded",
          h: ["Idiom", "Means", "Register note"],
          rows: [
            ["**on the same page**", "in agreement", "Extremely common; safe"],
            ["**move the needle**", "produce a measurable effect", "Common in product and sales"],
            ["**low-hanging fruit**", "easy wins available now", "Overused but universally understood"],
            ["**boil the ocean**", "attempt something impossibly broad", "Usually a warning: *let us not boil the ocean*"],
            ["**bandwidth**", "capacity to take on work", "Standard, not slang"],
            ["**a hard stop**", "an immovable end time", "*I have a hard stop at 3.* Very useful"],
            ["**park it / take it offline**", "defer this out of the meeting", "The polite way to end a tangent"],
            ["**ballpark**", "a rough estimate", "*Ballpark, two weeks.*"],
            ["**due diligence**", "required verification", "Formal, from finance and law"],
            ["**the elephant in the room**", "the obvious thing nobody will name", "Powerful; use once"],
            ["**kick the can down the road**", "defer a decision that will only get worse", "Mildly critical"],
            ["**a stopgap**", "a temporary fix", "Neutral and precise"],
            ["**scope creep**", "requirements quietly expanding", "Standard project vocabulary"],
            ["**a blocker**", "something preventing progress", "Standard in agile teams"],
            ["**cut corners**", "skip necessary steps", "Always negative"],
            ["**get buy-in**", "secure agreement and support", "*I need buy-in from finance.*"],
            ["**play devil's advocate**", "argue a side you may not hold, to test it", "Signals that disagreement is not personal"],
            ["**touch wood / knock on wood**", "hoping not to jinx it", "BrE / AmE variants"],
            ["**back to the drawing board**", "start the design again", "—"],
            ["**a long shot**", "unlikely but worth trying", "—"]
          ]
        }
      },

      { n: "Idioms are a receptive skill first. You need to **understand** all of these; you only need to **use** the five or six that feel natural. A non-native speaker deploying idioms densely sounds like they are performing fluency, which is a worse impression than plain clear English.", nt: "Understand many, use few" },

      {
        tryit: {
          t: "Translate the meeting",
          task: "Rewrite this in plain professional English: *Look, I do not want to boil the ocean here — let us grab the low-hanging fruit this quarter, park the platform rewrite, and circle back once we have buy-in from finance. I have a hard stop at four.*",
          hint: "Five idioms and one phrasal verb. Replace each with its literal meaning.",
          sol: { lang: "text", code: "I do not want us to take on an impossibly broad piece of work. Let us do\nthe easy, high-value items this quarter and defer the platform rewrite.\nWe can revisit it once finance has agreed to fund it. I need to leave at\nfour." },
          w: "Both versions are professional. The idiomatic one is faster to say and signals membership; the plain one is unambiguous and travels across cultures. Know which room you are in."
        }
      }
    ],
    k: [
      "Spellcheck cannot catch confusable pairs — affect/effect, ensure/insure, imply/infer, fewer/less, e.g./i.e. are the ones that appear most.",
      "Collocations are arbitrary and must be learned as units: *raise a concern*, *meet a deadline*, *reach a consensus*.",
      "Speech runs on phrasal verbs; formal writing runs on their Latin equivalents. You need both directions.",
      "Understand every common idiom; use only a handful. Dense idiom use from a non-native speaker reads as performance.",
      "*Please revert* meaning *please reply* is regional. *Please get back to me* is universal."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "I want to raise a concern about the timeline.", w: "raise a concern - fixed collocation" },
        { c: "Can I run this past you before I send it?", w: "run past = seek informal approval" },
        { c: "Let us park that and take it offline after the call.", w: "the polite way to end a tangent" },
        { c: "Fewer defects and less latency after the rewrite.", w: "fewer countable, less uncountable" }
      ]
    }
  }

]);
