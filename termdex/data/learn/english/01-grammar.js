/* Professional English — the grammar that is actually judged. */
TD.addLessons("english", [

  {
    t: "Tenses at Work — the six that carry ninety per cent of office English",
    m: "grammar",
    lvl: "core",
    s: "English has twelve tenses. Work uses six of them almost exclusively, and gets one of them wrong constantly.",
    goal: [
      "Choose between past simple and present perfect without guessing",
      "Use the continuous forms to signal that work is in progress rather than finished",
      "Talk about the future in the four ways professionals actually distinguish"
    ],
    b: [
      { p: "Nobody at work will correct your grammar out loud. They will simply form a quieter impression, and you will never learn what it was. That is the whole reason this module exists: the errors that matter are not the ones that stop you being understood, they are the ones that make a fluent reader pause for half a second." },

      { p: "Of the twelve tenses in an English textbook, six do nearly all the work in an office. Learn these properly and the other six will look after themselves." },

      {
        tbl: {
          t: "The six tenses of working English",
          h: ["Tense", "Form", "What it signals at work", "Example"],
          rows: [
            ["**Present simple**", "`I review`", "Habit, process, permanent truth, schedules", "The pipeline **runs** every night at 02:00."],
            ["**Present continuous**", "`I am reviewing`", "In progress *right now* or *around now*; a temporary arrangement", "I **am reviewing** the spec this week."],
            ["**Past simple**", "`I reviewed`", "A finished event at a finished time", "I **reviewed** it on Tuesday."],
            ["**Present perfect**", "`I have reviewed`", "A finished action whose *result matters now*; unfinished time", "I **have reviewed** it — you can merge."],
            ["**Present perfect continuous**", "`I have been reviewing`", "Duration up to now, often to explain effort or delay", "I **have been reviewing** this since Monday."],
            ["**Past perfect**", "`I had reviewed`", "Something already done *before* another past point", "By the time it broke, I **had reviewed** it twice."]
          ]
        }
      },

      { h: "The one that everybody gets wrong: past simple vs present perfect" },

      { p: "This is the single most common tense error in professional English, and it is not a small one, because the two tenses genuinely mean different things. Past simple puts an event in a closed box. Present perfect leaves the box open and connects it to now." },

      {
        vs: {
          t: "The same event, two very different messages",
          bad: { label: "Past simple — the box is closed", c: "I fixed the bug on Monday.", w: "Correct English, and it says: that happened, it is history, we have moved on. Fine in a retrospective. Wrong if you are trying to tell someone the system is now working." },
          good: { label: "Present perfect — the result is live", c: "I have fixed the bug.", w: "Says: it is done, and *the consequence is present*. The system works now. This is what a status update almost always wants." }
        }
      },

      { p: "The rule that survives every edge case: **if the time is finished, use past simple; if the time is unfinished or unstated, use present perfect.**" },

      {
        tbl: {
          t: "Finished time vs unfinished time",
          h: ["Time expression", "Finished?", "Tense", "Example"],
          rows: [
            ["yesterday, last week, in 2023, on Tuesday", "Finished", "Past simple", "We **shipped** it last quarter."],
            ["today, this week, this year, so far", "Still running", "Present perfect", "We **have shipped** three features this quarter."],
            ["ever, never, already, yet, just, recently", "Unstated", "Present perfect", "I **have** already **raised** the ticket."],
            ["ago", "Finished", "Past simple", "She **left** the team two months ago."],
            ["since / for + now", "Up to now", "Present perfect (cont.)", "I **have been** on this team **for** two years."]
          ]
        }
      },

      { trap: "American English is looser here and will accept *I already sent it* where British English wants *I have already sent it*. Both are heard in international offices, so neither will be marked wrong — but the reverse error is real and damaging: writing **I have sent it yesterday** is wrong in every variety of English. Never pair present perfect with a finished time." },

      { h: "Continuous forms: the polite tense" },

      { p: "The continuous does something in professional English that grammar books rarely mention. It makes a statement feel temporary, in progress and therefore less final — which is why it softens." },

      {
        tbl: {
          t: "Simple sounds fixed; continuous sounds open",
          h: ["Simple — sounds final", "Continuous — sounds open", "Why it lands differently"],
          rows: [
            ["I **hope** you will reconsider.", "I **was hoping** you might reconsider.", "The past continuous makes a request tentative. It is the single most useful softener in English."],
            ["What **do** you **want**?", "What **were** you **looking** for?", "Direct question versus a helpful one. Same information, entirely different room temperature."],
            ["I **think** we should stop.", "I **am thinking** we should stop.", "Continuous frames it as a thought still forming, so it invites disagreement rather than defending a position."],
            ["We **look** at Q3 numbers.", "We **are looking** at Q3 numbers.", "Simple = that is our permanent process. Continuous = that is what is happening at the moment."]
          ]
        }
      },

      { n: "*I was wondering if…* is grammatically a past continuous describing a present wish, which makes no logical sense at all and is nonetheless the most standard polite request in the language. Do not try to reason it out. Learn it as a fixed phrase.", nt: "The illogical one you must learn anyway" },

      { h: "Four futures, four different promises" },

      { p: "English has no future tense. It has four ways of talking about the future, and choosing the wrong one makes a promise you did not intend." },

      {
        tbl: {
          t: "What each future actually commits you to",
          h: ["Form", "Meaning", "Use it when", "Example"],
          rows: [
            ["**will**", "Decision made now; prediction; promise", "You are volunteering in the moment", "I **will** take a look after standup."],
            ["**going to**", "Prior intention; evidence-based prediction", "The plan already existed before you spoke", "We **are going to** migrate in March."],
            ["**present continuous**", "A fixed arrangement, usually diarised", "It is in a calendar", "I **am meeting** the vendor on Thursday."],
            ["**present simple**", "A timetable outside your control", "Schedules, flights, published dates", "The release **goes out** at 09:00."]
          ]
        }
      },

      { trap: "Answering *When can you deliver this?* with **I will do it by Friday** is a personal commitment made on the spot. **I am delivering it on Friday** states a fixed arrangement, and **It should be with you by Friday** commits to almost nothing. Managers hear the difference even when they could not name it. Pick the one you actually mean." },

      { h: "Past perfect: the tense that orders two past events" },

      { p: "Only ever needed when two things happened in the past and the sequence matters. Overusing it is a common tell of someone who has recently studied grammar; not using it when sequence matters is a tell of someone who has not." },

      {
        code: {
          lang: "text", t: "An incident report, told in the right order",
          lines: [
            { c: "At 14:02 the service returned 500s.", w: "Past simple — the main event on the timeline." },
            { c: "We had deployed a config change forty minutes earlier.", w: "Past perfect — *before* the main event. This is what past perfect is for.", hi: true },
            { c: "We rolled back and the errors stopped.", w: "Back to past simple: the timeline continues forward." },
            { c: "We have since added a canary stage to the pipeline.", w: "Present perfect — done, and the consequence is live today.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Fix the tense",
          task: "A colleague sends this status line: *I have completed the audit last Friday and I am send you the report yesterday.* Rewrite it correctly, keeping the same two facts.",
          hint: "Both events have finished times attached. What does a finished time force?",
          sol: { lang: "text", code: "I completed the audit last Friday and sent you the report yesterday.\n\n(Or, if you want the result to feel live and you drop the times:)\nI have completed the audit and sent you the report." },
          w: "Finished time expressions — *last Friday*, *yesterday* — force past simple. Remove the time expressions and present perfect becomes not only allowed but better, because it emphasises that the work is done and available now."
        }
      }
    ],
    k: [
      "Six tenses cover almost all office English; the rest are edge cases.",
      "Finished time takes past simple. Unfinished or unstated time takes present perfect. Never mix present perfect with *yesterday*, *last week* or *ago*.",
      "Continuous forms soften. *I was hoping* and *I was wondering* are the two most useful polite constructions in the language.",
      "*Will*, *going to*, present continuous and present simple make four different sizes of future promise. Choose deliberately.",
      "Past perfect exists only to say *this happened before that other past thing*."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "I have fixed the bug — it is safe to deploy.", w: "present perfect: done, and the result matters now" },
        { c: "We deployed the change on Tuesday.", w: "past simple: finished action at a finished time" },
        { c: "I was hoping we could revisit the deadline.", w: "the standard polite request softener" },
        { c: "I am meeting the vendor on Thursday.", w: "present continuous for a fixed, diarised arrangement" },
        { c: "We had already rolled back before the alert fired.", w: "past perfect: ordering two past events" }
      ]
    }
  },

  {
    t: "Articles, Prepositions and Countability — the three tells of a non-native writer",
    m: "grammar",
    lvl: "core",
    s: "The errors that never block understanding and always get noticed. A working system for a, an, the and zero article.",
    goal: [
      "Apply a decision procedure for articles instead of relying on feel",
      "Fix the prepositions that professional English gets wrong most often",
      "Stop pluralising the uncountable nouns that appear constantly at work"
    ],
    b: [
      { p: "Many languages — Hindi, Russian, Mandarin, Japanese, Polish and dozens more — have no articles at all. Speakers of those languages can be genuinely excellent in English and still drop or add *the* in a way a native reader notices in the first sentence. It never causes confusion. It is purely a status signal, which is exactly why it is worth fixing." },

      { h: "The article decision procedure" },

      { p: "Ask three questions in order and stop at the first *yes*." },

      {
        ol: [
          "**Is it specific and can the reader identify exactly which one I mean?** → use `the`. Because it was mentioned before, because context makes it unique, or because there is only one. *Send me **the** report* (the one we discussed).",
          "**Is it one, singular, countable, and new to the reader?** → use `a` / `an`. *I raised **a** ticket* (you do not know which one yet).",
          "**Is it plural-general, or uncountable, or abstract?** → use **no article**. *We need **feedback***. ***Engineers** prefer clear specs*."
        ]
      },

      {
        code: {
          lang: "text", t: "The same noun through all three states",
          lines: [
            { c: "We should hire a data engineer.", w: "`a` — one, countable, new. Any data engineer will do.", hi: true },
            { c: "The data engineer we hired starts Monday.", w: "`the` — now identifiable, because the relative clause pins it down.", hi: true },
            { c: "Data engineers are hard to find right now.", w: "no article — a general statement about the whole plural category.", hi: true },
            { c: "We need more data engineering capacity.", w: "no article — *capacity* is uncountable and abstract." }
          ]
        }
      },

      { ana: "Think of `a` as *let me introduce you to one of these* and `the` as *you already know which one*. Every article decision is really a question about what is already in the reader's head.", at: "Introduce, then point" },

      { h: "The fixed cases worth memorising" },

      {
        tbl: {
          t: "Where the article is not a choice",
          h: ["Rule", "Correct", "Common error"],
          rows: [
            ["Job titles after *as*", "She joined **as** product manager.", "as *the* product manager"],
            ["Unique roles after *be*", "He is **the** CTO.", "He is *a* CTO *(only if there are several)*"],
            ["Institutions in the abstract", "She is at **university** *(BrE)* / **in college** *(AmE)*", "at *the* university *(only if you mean the building)*"],
            ["Meals, transport, time expressions", "over **lunch**, by **email**, at **noon**", "over *the* lunch, by *the* email"],
            ["Superlatives and ordinals", "**the** best option, **the** first release", "best option, first release"],
            ["Company and product names", "**Google**, **Slack**, **AWS**", "*the* Google"],
            ["Plural country and group names", "**the** Netherlands, **the** UK, **the** US", "Netherlands, UK"],
            ["Named departments", "**the** finance team, **the** board", "finance team *(as a subject)*"],
            ["Same noun, both ways", "**a** part of the problem / **the** whole of it", "—"]
          ]
        }
      },

      { trap: "The most-repeated real error in workplace English: **discuss about**. *Discuss* already contains *about*. It is `discuss the roadmap`, never *discuss about the roadmap*. The same applies to **explain**, **request**, **emphasise**, **inform** and **contact**: `explain the delay`, `request an extension`, `contact her` — no preposition after the verb." },

      { h: "The prepositions that go wrong most often at work" },

      {
        tbl: {
          t: "Preposition corrections you can make today",
          h: ["Wrong", "Right", "Note"],
          rows: [
            ["revert back to you", "**get back to** you / **reply to** you", "*Revert* means *return to a previous state*. Using it for *reply* is regionally common and reads oddly to most international readers."],
            ["discuss about / explain about", "**discuss** the plan / **explain** the plan", "Transitive verbs; no preposition."],
            ["I will call you on Monday **at** evening", "on Monday **in the** evening", "**at** night, but **in the** morning / afternoon / evening."],
            ["depends of", "**depends on**", "Fixed collocation."],
            ["comprises of", "**comprises** / **is composed of**", "*Comprise* takes no *of*."],
            ["good in Python", "good **at** Python", "*Good at* a skill, *good with* people or tools, *good for* a purpose."],
            ["responsible of", "responsible **for**", "—"],
            ["married with", "married **to**", "—"],
            ["in the last quarter we grow", "**over** the last quarter we grew", "*Over* for a span, *in* for a container of time."],
            ["reach to me", "**reach out to** me / **reach** me", "*Reach me* = contact me. *Reach out to* is the phrasal verb."],
            ["on the meeting", "**in** the meeting", "*In* a meeting, *on* a call, *at* a conference."],
            ["cc me in the mail", "cc me **on** the email", "—"]
          ]
        }
      },

      { h: "Uncountable nouns: the ones that trip up work email" },

      { p: "These nouns take no plural `-s` and no `a`. They are extremely common at work, which is why the error is extremely visible." },

      {
        tbl: {
          t: "Never pluralise these",
          h: ["Uncountable noun", "Wrong", "Right"],
          rows: [
            ["**information**", "informations", "information / **a piece of** information"],
            ["**feedback**", "feedbacks", "feedback / **some** feedback"],
            ["**advice**", "advices / an advice", "advice / **a piece of** advice"],
            ["**equipment**", "equipments", "equipment / **items of** equipment"],
            ["**software**", "softwares", "software / **software packages**"],
            ["**staff**", "staffs", "staff / **members of** staff"],
            ["**research**", "researches", "research / **studies**"],
            ["**progress**", "progresses", "progress / **steps forward**"],
            ["**knowledge, evidence, luggage, furniture, training**", "— *(plural forms)*", "always singular"],
            ["**data**", "*(disputed)*", "**data is** in industry writing; **data are** in academic writing. Pick one and be consistent."]
          ]
        }
      },

      { n: "*Staff*, *team* and *board* are collective. British English often treats them as plural — *the team **are** meeting* — while American English treats them as singular — *the team **is** meeting*. Both are correct in their own variety. Choose the one your company writes in and stop switching mid-document.", nt: "The collective-noun split" },

      {
        tryit: {
          t: "Repair the paragraph",
          task: "Fix every article, preposition and countability error: *I want to discuss about the feedbacks we received. Please share informations by tomorrow so we can revert back to client on the meeting.*",
          hint: "Three verbs need no preposition, two nouns are uncountable, and one noun needs an article.",
          sol: { lang: "text", code: "I would like to discuss the feedback we received. Please share the information by tomorrow so that we can get back to the client in the meeting." },
          w: "*Discuss* drops *about*; *feedback* and *information* are uncountable; *revert back* becomes *get back*; *client* is specific so it takes *the*; and a meeting is something you are *in*."
        }
      }
    ],
    k: [
      "Articles: identifiable → *the*; one-new-countable → *a/an*; plural-general or uncountable → nothing.",
      "*Discuss*, *explain*, *request*, *contact* and *inform* take no preposition. *Discuss about* is the most common workplace error in English.",
      "*Information*, *feedback*, *advice*, *equipment*, *software*, *staff* and *research* are uncountable and never take *-s*.",
      "Preposition errors do not block meaning, which is precisely why they are noticed — the reader has spare attention to notice them."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "I would like to discuss the roadmap with you.", w: "discuss takes no about" },
        { c: "Thanks for the feedback — it was useful.", w: "feedback is uncountable, never feedbacks" },
        { c: "I will get back to you by Thursday.", w: "get back to, not revert back to" },
        { c: "We are good at Python and comfortable with Go.", w: "good at a skill, comfortable with a tool" }
      ]
    }
  },

  {
    t: "Modals and Conditionals — the machinery of politeness and commitment",
    m: "grammar",
    lvl: "intermediate",
    s: "Can, could, may, might, should, must, would. The small words that decide whether you sound like a peer, a subordinate or a problem.",
    goal: [
      "Grade a request from blunt to deferential using modals alone",
      "Use the four conditionals to talk about risk, dependency and hypotheticals",
      "Avoid the two modal errors that make requests sound like orders"
    ],
    b: [
      { p: "Modals are the volume knob of English. The same request can be issued at eight different levels of force without changing a single content word, and the level you pick tells everyone in the thread what you believe your standing to be. Non-native speakers are often taught only the loudest and the quietest settings, which is why they oscillate between sounding abrupt and sounding apologetic." },

      { h: "The politeness ladder for requests" },

      {
        tbl: {
          t: "One request, eight settings",
          h: ["Level", "Form", "Reads as"],
          rows: [
            ["1 — command", "**Send** me the file.", "An instruction. Fine downward with an established relationship; risky in every other direction."],
            ["2 — direct", "**Please send** me the file.", "Neutral instruction. Standard in tickets and process documents."],
            ["3 — ability question", "**Can you** send me the file?", "Everyday neutral. The default in most workplaces."],
            ["4 — softened", "**Could you** send me the file?", "One notch politer at no cost. Safe with anyone."],
            ["5 — mind-framing", "**Would you mind sending** me the file?", "Polite; note the `-ing`, which is the part people get wrong."],
            ["6 — hedged", "**Would it be possible to** get the file?", "Formal, distancing. Good for external or senior recipients."],
            ["7 — apologetic", "**I was wondering if you could possibly** send me the file.", "Deferential. Reserve it for genuine impositions, not routine asks."],
            ["8 — indirect statement", "**It would be helpful to have** the file before Thursday.", "No named agent at all. Used to raise something without pointing at anybody."]
          ]
        }
      },

      { trap: "Levels 7 and 8 sound *more* professional to many learners, so they use them for everything. The effect is the opposite: over-hedging every routine request reads as either insecure or faintly sarcastic. Level 4 — **Could you…** — is the correct default for ninety per cent of workplace requests. Save the deferential forms for when you are genuinely asking for a favour." },

      { h: "Modals of obligation: the difference between must, have to and should" },

      {
        tbl: {
          t: "Obligation, graded",
          h: ["Modal", "Force", "Source of the obligation", "Example"],
          rows: [
            ["**must**", "Strongest", "The speaker's own authority, or a rule", "All changes **must** be reviewed."],
            ["**have to**", "Strong", "An external circumstance, not the speaker", "We **have to** ship before the freeze."],
            ["**need to**", "Strong but neutral", "Practical necessity; the friendliest of the three", "We **need to** agree an owner today."],
            ["**should**", "Recommendation", "Advice you can decline", "You **should** add a test for that case."],
            ["**ought to**", "Recommendation, slightly formal", "Moral or conventional weight", "We **ought to** tell them before Friday."],
            ["**must not**", "Prohibition", "Forbidden", "You **must not** commit credentials."],
            ["**do not have to**", "Absence of obligation", "Optional — *the opposite of must not*", "You **do not have to** attend."]
          ]
        }
      },

      { trap: "**must not** and **do not have to** look like a pair and mean opposite things. *You must not send it* forbids sending. *You do not have to send it* says sending is optional. Getting these the wrong way round in a compliance email is a genuinely serious error, not a stylistic one." },

      { n: "Using **must** at somebody senior to you — *you must review this today* — reads as issuing an order upward. Use **need** and a reason instead: *I need this reviewed today to hit the release window.* The obligation now comes from the deadline rather than from you.", nt: "The upward-must problem" },

      { h: "Hedging modals: how to be uncertain on purpose" },

      { p: "Professional writing is full of claims that might be wrong. English has a precise vocabulary for saying how confident you are, and using it correctly is a sign of seniority rather than weakness — because an engineer who states everything at one hundred per cent confidence cannot be trusted at any confidence." },

      {
        tbl: {
          t: "Confidence, expressed",
          h: ["Confidence", "Language", "Example"],
          rows: [
            ["~95%", "**will**, **is**, **clearly**", "This **will** fix it."],
            ["~80%", "**should**, **most likely**, **I expect**", "This **should** fix it."],
            ["~50%", "**may**, **might**, **could**, **possibly**", "This **might** be a caching issue."],
            ["~20%", "**could conceivably**, **it is not impossible that**", "It **could conceivably** be DNS."],
            ["Deduction from evidence", "**must be**, **cannot be**", "The token **must be** expiring early."],
            ["Past speculation", "**must have**, **might have**, **cannot have**", "The job **must have** failed silently."]
          ]
        }
      },

      { h: "The four conditionals" },

      {
        code: {
          lang: "text", t: "Each conditional, and the situation that calls for it",
          lines: [
            { c: "Zero:  If you push to main, the pipeline runs.", w: "Always true. A rule or a system behaviour. `if + present, present`.", hi: true },
            { c: "First: If we ship on Friday, we will miss the freeze.", w: "A real future possibility. `if + present, will`. This is the one you use in planning.", hi: true },
            { c: "Second: If we had more headcount, we would parallelise it.", w: "Hypothetical or counter-to-fact now. `if + past, would`. Used constantly to propose politely.", hi: true },
            { c: "Third: If we had tested it, we would not have shipped the bug.", w: "Impossible — the past is fixed. `if + past perfect, would have`. This is retrospective language.", hi: true },
            { c: "Mixed: If we had documented it, we would not be debugging now.", w: "Past cause, present consequence. Extremely common in incident reviews." }
          ]
        }
      },

      { trap: "The classic error is **If I will have time, I will call you.** English never puts *will* in the *if* clause of a first conditional. It is *If I **have** time, I will call you.* The same applies to *when*, *as soon as*, *until* and *before*: *I will tell you when I **hear** back*, never *when I will hear back*." },

      { h: "The second conditional as a diplomacy tool" },

      { p: "This is the underrated one. Shifting a proposal into the second conditional turns an assertion into a hypothetical, which lets the other person reject it without rejecting you." },

      {
        vs: {
          t: "The same proposal, two levels of exposure",
          bad: { label: "Assertive — creates a position to defend", c: "We should drop the Redis layer. It is adding complexity for no measurable gain.", w: "You have now planted a flag. Any disagreement is a disagreement with you personally, and the conversation becomes about who is right." },
          good: { label: "Second conditional — creates a shared thought experiment", c: "If we dropped the Redis layer, would we actually lose anything measurable? My instinct is that we would not, but I would want to check the p99 first.", w: "Identical content. Now it is a question the room can answer together, and you can be talked out of it at zero cost to your standing." }
        }
      },

      {
        tryit: {
          t: "Grade the same message three ways",
          task: "You need a senior colleague to review your document before a client meeting tomorrow. Write the request (a) neutrally, (b) politely, and (c) as an urgent escalation that is still professional.",
          hint: "Neutral is level 3–4 on the ladder. Polite is level 5–6. Urgency comes from a stated consequence, not from stronger modals.",
          sol: { lang: "text", code: "(a) Neutral\nCould you review the attached before tomorrow's client call?\n\n(b) Polite\nWould you have twenty minutes to look over the attached before tomorrow's call? Happy to work around your calendar.\n\n(c) Urgent but professional\nI need a reviewer on the attached before 10:00 tomorrow — it goes to the client straight after. If you are not able to, could you point me to someone who can?" },
          w: "Notice that (c) does not use a stronger modal. Urgency in professional English is carried by a deadline, a consequence and an alternative path — never by escalating the modal, which just reads as aggression."
        }
      }
    ],
    k: [
      "*Could you…* is the correct default request. Over-hedging routine asks reads as insecure, not polite.",
      "*Must not* forbids; *do not have to* makes optional. They are not a pair.",
      "Push obligation onto a deadline or a rule rather than onto yourself when writing upward: *I need this by X because Y*.",
      "Hedging modals communicate calibrated confidence, which reads as senior rather than weak.",
      "Never put *will* in an *if*, *when* or *as soon as* clause about the future.",
      "The second conditional turns a proposal into a shared question, which is the cheapest diplomacy in the language."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Could you take a look at this before Thursday?", w: "the default polite request" },
        { c: "Would it be possible to move the call to 15:00?", w: "formal hedged request for external or senior recipients" },
        { c: "If we dropped that dependency, would anything break?", w: "second conditional as a diplomacy tool" },
        { c: "This should fix it, but I would want to confirm on staging.", w: "calibrated confidence rather than an absolute claim" }
      ]
    }
  },

  {
    t: "Sentence Structure and Punctuation — writing that survives a skim",
    m: "grammar",
    lvl: "intermediate",
    s: "Clause structure, the comma rules that change meaning, and the specific punctuation marks that make writing look considered.",
    goal: [
      "Break long sentences at the right joint instead of adding commas",
      "Use the semicolon, colon and dash correctly and deliberately",
      "Fix the comma splice, the dangling modifier and the misplaced *only*"
    ],
    b: [
      { p: "Workplace readers do not read. They skim, decide whether the message concerns them, and act. Punctuation is what makes a skim survivable — it tells the eye where the units of meaning start and stop before the brain has parsed a single word." },

      { h: "Sentence length is a decision, not an accident" },

      { p: "There is a well-known observation in readability research that comprehension falls off sharply past roughly 25 words per sentence. You do not need to count. You need one habit: **when a sentence contains two independent ideas, split it.**" },

      {
        vs: {
          t: "One idea per sentence",
          bad: { label: "One sentence, four ideas", c: "Following on from our discussion yesterday regarding the delay in the\ndata migration which was caused by the schema mismatch we identified\nlast week, I wanted to check whether you would be able to confirm the\nrevised timeline so that we can update the client accordingly.", w: "51 words, four ideas, one full stop. A reader has to hold all of it in working memory before anything resolves. The actual request is the last nine words and almost nobody reaches them at full attention." },
          good: { label: "Four sentences, request first", c: "Could you confirm the revised migration timeline by Wednesday? We need\nit to update the client.\n\nContext: the delay came from the schema mismatch we found last week.\nEverything else in the plan is unchanged.", w: "Same information. The request is now the first thing read, and the context is available to whoever wants it without blocking whoever does not." }
        }
      },

      { n: "This is the **BLUF** convention — *Bottom Line Up Front* — borrowed from military writing and now standard in consulting, product and engineering. Ask first, explain second. It is the single highest-return change most people can make to their work writing, and it appears again in the long-form module.", nt: "Bottom Line Up Front" },

      { h: "The comma rules that carry meaning" },

      {
        tbl: {
          t: "Commas that are not optional",
          h: ["Rule", "Example", "What goes wrong without it"],
          rows: [
            ["Before a coordinating conjunction joining two independent clauses", "We shipped the fix**,** and the errors stopped.", "Reads as a list until the eye reaches the second verb."],
            ["After an introductory phrase", "After the migration**,** latency dropped.", "*After the migration latency dropped* momentarily reads as one noun phrase."],
            ["Around a non-defining clause", "The API**,** which we rewrote last year**,** is stable.", "Removing the commas changes the meaning — see below."],
            ["Between items in a list", "logs**,** metrics and traces", "Ambiguity in longer lists."],
            ["Around direct address", "Thanks**,** Priya**,** for catching that.", "*Thanks Priya for catching that* is a different, blunter sentence."]
          ]
        }
      },

      { h: "The comma pair that changes the facts" },

      {
        code: {
          lang: "text", t: "Defining vs non-defining — a real difference in meaning",
          lines: [
            { c: "The engineers who joined in March are still onboarding.", w: "**Defining.** No commas, `who`. Only *some* engineers joined in March, and only those are onboarding.", hi: true },
            { c: "The engineers, who joined in March, are still onboarding.", w: "**Non-defining.** Commas. *All* the engineers joined in March, and all are onboarding.", hi: true },
            { c: "", w: "" },
            { c: "Delete the servers that are unused.", w: "Delete only the unused ones." },
            { c: "Delete the servers, which are unused.", w: "**Delete all the servers.** The clause is an aside explaining that they happen to be unused." }
          ]
        }
      },

      { trap: "That second pair is not a grammar-pedant example. A comma in an instruction like that can cause the wrong thing to be deleted. Where an instruction is genuinely ambiguous, rewrite it rather than trusting the reader to parse punctuation: *Delete every server in the list below.*" },

      { h: "Semicolon, colon, dash — what each one is actually for" },

      {
        tbl: {
          t: "Three marks people avoid and should not",
          h: ["Mark", "Job", "Example", "Test"],
          rows: [
            ["**Semicolon** `;`", "Joins two complete sentences that are closely related", "The tests passed**;** the deploy still failed.", "Both sides must stand alone as sentences. If one cannot, you need a comma or a dash."],
            ["**Colon** `:`", "Announces what follows — a list, an explanation, or a punchline", "There is one blocker**:** the certificate has expired.", "The left side must be a complete sentence. The right side need not be."],
            ["**Em dash** `—`", "Interrupts for emphasis or an aside; can replace brackets or a colon", "We shipped it — three weeks late — and it held.", "Use sparingly. Two per page reads as considered; six reads as breathless."],
            ["**Brackets** `( )`", "A genuine aside the reader may skip", "Latency improved (see appendix B).", "If the sentence breaks when you delete the brackets and their contents, it should not have been in brackets."]
          ]
        }
      },

      { trap: "The **comma splice** — joining two complete sentences with only a comma — is the most common punctuation error in professional email. *The build passed, we can deploy* is wrong. Fix it four ways: a full stop, a semicolon, a dash, or a conjunction (*so we can deploy*). Any of the four is correct; the bare comma is not." },

      { h: "Three structural errors that change what you said" },

      {
        tbl: {
          t: "Errors of position, not of grammar",
          h: ["Error", "Written", "Meant", "Fix"],
          rows: [
            ["**Dangling modifier**", "Having reviewed the code, the bug was obvious.", "The bug did not review the code.", "**Having reviewed the code, I found the bug obvious.** The subject after the comma must be the thing doing the modifying action."],
            ["**Misplaced** *only*", "I **only** tested the login flow.", "Did you test it and nothing else, or merely test rather than fix it?", "Put *only* immediately before what it limits: **I tested only the login flow.**"],
            ["**Ambiguous pronoun**", "The service calls the queue and **it** failed.", "Which one failed?", "Name it: **the queue failed.** In writing, never let *it*, *this* or *they* point at more than one candidate."]
          ]
        }
      },

      { n: "*This* with no noun after it is the most frequent ambiguous pronoun at work. *This is a problem* — what is? Attach a noun every time: *This delay is a problem*, *This approach is a problem*. It costs one word and removes an entire class of misunderstanding.", nt: "The naked *this*" },

      { h: "Parallel structure in lists" },

      {
        vs: {
          t: "Lists must be grammatically parallel",
          bad: { label: "Mixed forms", c: "The role involves:\n- writing pipelines\n- code review\n- to mentor juniors\n- deployment", w: "Four different grammatical shapes — gerund, noun, infinitive, noun. It reads as careless even to someone who cannot say why." },
          good: { label: "One form throughout", c: "The role involves:\n- writing pipelines\n- reviewing code\n- mentoring juniors\n- managing deployments", w: "All gerunds. Any single form works — all nouns, all imperatives, all gerunds — provided you do not switch mid-list." }
        }
      },

      {
        tryit: {
          t: "Rewrite for the skim",
          task: "Rewrite this so the reader knows what is being asked within the first line, with no sentence over 20 words and no comma splices:\n\n*Hi, hope you are well, I am writing regarding the invoice from last month which we have not yet received payment for and which is now 15 days overdue, please can you look into this and let me know when payment will be made as our finance team is asking.*",
          hint: "What is the ask? Put it first. Then facts. Then the deadline.",
          sol: { lang: "text", code: "Hi Sam,\n\nCould you confirm a payment date for invoice #4471? It is now 15 days overdue.\n\nOur finance team is closing the month on Friday, so a date before then would help. Happy to resend the invoice if it has gone astray.\n\nThanks,\nAlex" },
          w: "The request moved to the first line, the comma splices became full stops, the vague *let me know when payment will be made* became a specific date request, and the pressure is attributed to a deadline rather than to the sender."
        }
      }
    ],
    k: [
      "Split any sentence carrying two independent ideas. One idea, one sentence.",
      "Put the request first — bottom line up front — and the context underneath it.",
      "A comma before *which* makes the clause an aside about everything; no comma makes it a filter. This changes the facts.",
      "A comma splice is always wrong; four correct fixes exist.",
      "Never leave *this*, *it* or *they* pointing at two possible nouns.",
      "Lists must keep one grammatical shape all the way down."
    ],
    r: ["Documentation"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "There is one blocker: the certificate has expired.", w: "colon announcing what follows" },
        { c: "The tests passed; the deploy still failed.", w: "semicolon joining two related complete sentences" },
        { c: "Delete only the servers listed below.", w: "only placed immediately before what it limits" },
        { c: "This delay is the problem, not the scope.", w: "never leave this without a noun attached" }
      ]
    }
  }

]);
