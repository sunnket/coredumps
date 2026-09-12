/* Professional English — long-form and high-stakes writing. */
TD.addLessons("english", [

  {
    t: "The Pyramid Principle — structuring anything longer than an email",
    m: "docs",
    lvl: "intermediate",
    s: "Answer first, then group the support, then the detail. The structure behind every consulting deck and every good report.",
    goal: [
      "Structure a report, proposal or document so the conclusion arrives first",
      "Group supporting points so that they are mutually exclusive and collectively exhaustive",
      "Write an executive summary that could be the only thing read"
    ],
    b: [
      { p: "There are two ways to organise a document. **Chronologically** — here is what we did, then what we found, then what we conclude. And **conclusion-first** — here is what you should do, and here is why, in decreasing order of importance." },

      { p: "The first is how the work happened. The second is how the reader wants it. Almost everyone writes the first by default, because it is the order it exists in their own head, and almost every senior reader wants the second." },

      { ana: "A newspaper story is written so it can be cut from the bottom at any point and still make sense. Paragraph one is the whole story. Paragraph two is the whole story with detail. Business writing works identically, because your reader stops at an unpredictable point and you do not get to choose where.", at: "The inverted pyramid" },

      { h: "The structure" },

      {
        code: {
          lang: "text", t: "One governing answer, three supporting groups, detail underneath",
          lines: [
            { c: "ANSWER      We should renew with Vendor B for two years.", w: "The single governing statement. If the reader reads one line, this is it.", hi: true },
            { c: "", w: "" },
            { c: "  WHY 1     It is the only option that meets the 99.9% SLA we sold.", w: "" },
            { c: "  WHY 2     The two-year commitment saves 18% against annual renewal.", w: "" },
            { c: "  WHY 3     Migration cost of switching is ~6 weeks of one engineer.", w: "Three to five supports. Fewer than three looks thin; more than five is unreadable.", hi: true },
            { c: "", w: "" },
            { c: "    detail  SLA comparison table, incident history, references", w: "" },
            { c: "    detail  Pricing model, break clauses, indexation", w: "" },
            { c: "    detail  Migration plan, dependency list, rollback", w: "Evidence lives at this level, where only the reader who challenges a support has to go." }
          ]
        }
      },

      { h: "MECE: the test for whether your grouping is sound" },

      { p: "**Mutually Exclusive, Collectively Exhaustive.** Your supporting points should not overlap, and together they should cover the ground. It is a test you can run on any structure in about thirty seconds." },

      {
        vs: {
          t: "The same three reasons, badly and well grouped",
          bad: { label: "Overlapping and incomplete", c: "1. It is cheaper\n2. It has better pricing\n3. The team likes it", w: "1 and 2 are the same point twice, which makes the case look padded. Nothing addresses risk, capability or migration cost, so a sceptical reader immediately asks a question the document does not answer." },
          good: { label: "MECE", c: "1. Capability - meets the SLA and the compliance requirement\n2. Cost - 18% lower over two years including migration\n3. Risk - shorter break clause and a proven migration path", w: "No overlap. Together they cover the three axes any procurement decision turns on. A reader can disagree with one without the others collapsing." }
        }
      },

      { n: "Common MECE frames worth stealing: **cost / risk / capability**; **people / process / technology**; **now / next / later**; **what we know / what we assume / what we need to find out**; **impact × effort**. Reaching for a known frame is faster than inventing a structure and produces a more complete one.", nt: "Frames that are already MECE" },

      { h: "The executive summary" },

      { p: "Assume it is the only part read, because for the most senior recipient it usually is. It is not an introduction and it is not a teaser — it is the whole document compressed." },

      {
        tbl: {
          t: "What belongs in an executive summary",
          h: ["Element", "One sentence each", "Common failure"],
          rows: [
            ["**Recommendation**", "What you want them to decide or approve", "Opening with background instead"],
            ["**Context**", "Why this is on their desk now", "Three paragraphs of history"],
            ["**Options considered**", "The alternatives, with one line of why not", "Presenting one option, which reads as unconsidered"],
            ["**Impact**", "Cost, time, risk — with numbers", "Adjectives instead of numbers"],
            ["**Ask**", "Exactly what you need from the reader, by when", "Ending with *happy to discuss*"]
          ]
        }
      },

      { trap: "An executive summary written *before* the document is a plan; written *after* it is a summary. Write it last, always. If you cannot compress your own document into five sentences, the document does not yet have a conclusion — and no amount of editing the prose will fix that." },

      { h: "The report structure that works for almost everything" },

      {
        ol: [
          "**Executive summary** — one page, standalone, written last.",
          "**Background** — the minimum needed to understand the decision. Not the history of the project.",
          "**Analysis** — grouped MECE, each section opening with its own conclusion in the first sentence.",
          "**Options and recommendation** — each option with cost, risk and a reason it was or was not chosen.",
          "**Next steps** — actions with an owner and a date beside each one.",
          "**Appendices** — everything you were tempted to put in the body."
        ]
      },

      { n: "Every section should open with its conclusion. A section called *Performance analysis* that begins *We ran load tests across three configurations* has wasted its most valuable sentence. Begin *Performance is not the constraint; the database connection pool is.* Then explain how you know.", nt: "Conclusion-first, recursively" },

      { h: "Language for reports" },

      {
        tbl: {
          t: "Report phrasing by function",
          h: ["Function", "Phrases"],
          rows: [
            ["**Stating findings**", "The analysis indicates… / The data shows… / We found that… / Three things stand out:"],
            ["**Qualifying a finding**", "Subject to… / On the assumption that… / This holds provided that… / The sample is small, so…"],
            ["**Recommending**", "We recommend… / The strongest option is… / On balance, we would… / Our advice is to…"],
            ["**Presenting a trade-off**", "The trade-off is X against Y / This buys us X at the cost of Y / We can have two of the three"],
            ["**Flagging risk**", "The principal risk is… / This is contingent on… / The main uncertainty is… / We would want to validate…"],
            ["**Concluding**", "In summary… / The net position is… / Taken together, this suggests…"],
            ["**Handing over an action**", "We propose that [team] [verb] by [date] / Owner: X, by: date"]
          ]
        }
      },

      {
        tryit: {
          t: "Invert a document",
          task: "A colleague's report opens: *This document reviews the incidents recorded between January and June, describes the methodology used to classify them, presents the results by category, and concludes with observations.* Rewrite the opening so it is conclusion-first.",
          hint: "What did they actually find? That sentence goes first.",
          sol: { lang: "text", code: "Two thirds of our incidents in the first half of the year came from a\nsingle cause: configuration changes deployed without a canary stage.\n\nAdding a canary to the deployment pipeline would, on this evidence, have\nprevented 41 of the 63 incidents recorded. This document sets out how we\nclassified them and what the remaining third looked like." },
          w: "The original opening is a table of contents in prose form. It tells the reader what the sections are called and nothing about what the work found. The rewrite gives away the answer immediately, which is the entire point."
        }
      }
    ],
    k: [
      "Conclusion first, then three to five MECE supports, then the evidence underneath.",
      "Mutually exclusive, collectively exhaustive — no overlap, no gaps. Steal a known frame rather than inventing one.",
      "The executive summary is the document compressed, written last, and assumed to be all that is read.",
      "Every section, not just the document, should open with its own conclusion.",
      "If you cannot compress the document into five sentences, it does not yet have a conclusion."
    ],
    r: ["Documentation"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "We recommend renewing with Vendor B for two years.", w: "governing answer stated first" },
        { c: "The trade-off is latency against cost, and we would take the latency.", w: "presenting a trade-off explicitly" },
        { c: "The principal risk is that the migration window slips past the freeze.", w: "flagging risk in report language" }
      ]
    }
  },

  {
    t: "Design Docs, Proposals and Minutes — the formats work runs on",
    m: "docs",
    lvl: "intermediate",
    s: "The three long-form documents most professionals actually have to write, with the section headings and the sentences that go under them.",
    goal: [
      "Write a design document or RFC that gets reviewed rather than ignored",
      "Write a proposal that a client can say yes to",
      "Take minutes that are useful six months later"
    ],
    b: [
      { h: "The design document / RFC" },

      { p: "A design doc exists to get disagreement to happen *before* the code is written rather than after. That single purpose determines everything about its structure: it must make the decisions visible and the alternatives explicit, because those are the only things anyone can usefully disagree with." },

      {
        tbl: {
          t: "Design document sections and what each is really for",
          h: ["Section", "Contains", "The sentence that opens it"],
          rows: [
            ["**Context**", "Why this is being written now", "*Today, X happens. This is a problem because Y.*"],
            ["**Goals**", "What success looks like, testably", "*After this change, [measurable thing] will be true.*"],
            ["**Non-goals**", "What this deliberately does not do", "*This does not attempt to…* — the most useful section, because it prevents scope arguments"],
            ["**Proposal**", "The design, in enough detail to critique", "*We propose to…*"],
            ["**Alternatives considered**", "Options and why not", "*We considered X. We rejected it because…* — a doc with no alternatives reads as a decision already made"],
            ["**Trade-offs**", "What this costs", "*This buys us X at the cost of Y.*"],
            ["**Risks and open questions**", "What could go wrong; what you do not know", "*The main uncertainty is…*"],
            ["**Rollout and rollback**", "How it ships and how it un-ships", "*We will roll out behind a flag, starting with…*"]
          ]
        }
      },

      { n: "**Non-goals** and **Alternatives considered** are the two sections inexperienced writers omit and experienced reviewers read first. Non-goals stop the review turning into a wishlist. Alternatives prove you thought, and pre-empt the *why did you not just…* comment that otherwise arrives from four people independently.", nt: "The two sections that save the review" },

      { h: "Writing so that people actually review it" },

      {
        tbl: {
          t: "Review-friendly conventions",
          h: ["Convention", "Why"],
          rows: [
            ["Mark open questions inline as **OPEN:**", "Reviewers can find where their input is wanted in one search"],
            ["State the decision you want: *seeking approval to proceed*", "Ambiguity about what a document wants produces no responses"],
            ["Put a reading time and a deadline at the top", "*8 minutes. Comments by Thursday.* Doubles the response rate"],
            ["Number the sections", "So a comment can say *3.2 assumes X* instead of *the bit about caching*"],
            ["Write the summary for someone two teams away", "The person whose objection matters most is often the one with the least context"]
          ]
        }
      },

      { h: "The proposal" },

      { p: "A commercial proposal differs from an internal document in one respect: the reader is deciding whether to spend money with you, and their real question is *what is the risk of choosing you and being wrong?* Every section should reduce that risk." },

      {
        code: {
          lang: "text", t: "Proposal skeleton, with the intent of each section",
          lines: [
            { c: "1. Understanding of your situation", w: "Their words, not yours. Proves you listened. This section wins or loses more proposals than the price does.", hi: true },
            { c: "2. What success looks like", w: "Their outcomes, stated measurably, agreed before any solution is described." },
            { c: "3. Proposed approach", w: "Phased, with a decision point at the end of each phase." },
            { c: "4. Team", w: "Named people with the relevant piece of experience beside each name." },
            { c: "5. Timeline", w: "With dependencies on *them* stated explicitly - this protects you later.", hi: true },
            { c: "6. Commercials", w: "Price, what is included, what is not, and what would change it." },
            { c: "7. Why us", w: "Two or three specifics with evidence. Never a list of adjectives." },
            { c: "8. Next step", w: "One concrete action with a date. Never *we look forward to hearing from you*.", hi: true }
          ]
        }
      },

      {
        tbl: {
          t: "Proposal language",
          h: ["Instead of", "Write"],
          rows: [
            ["We are a leading provider of innovative solutions.", "**We have delivered eleven migrations of this size, four of them in regulated environments.**"],
            ["We will work closely with your team.", "**Your team would need roughly two days a week from a data owner during phase 2.**"],
            ["Timelines are indicative.", "**Phase 1 completes six weeks from kick-off, assuming environment access within the first week.**"],
            ["Please do not hesitate to contact us.", "**Shall we hold 30 minutes on Thursday to walk through phase 1?**"],
            ["Our pricing is competitive.", "**£X for phases 1 and 2 fixed; phase 3 estimated at £Y and re-quoted after the phase 2 review.**"]
          ]
        }
      },

      { trap: "The most expensive omission in a proposal is the list of things you need *from the client*. When a project slips because their data access took five weeks, the conversation about whose fault that is goes very differently depending on whether the requirement was written down in section 5." },

      { h: "Minutes and meeting notes" },

      { p: "Minutes are not a transcript. Their job is to be findable and actionable six months later, when nobody remembers the meeting and somebody needs to know why a decision was made." },

      {
        code: {
          lang: "text", t: "Minutes that are worth writing",
          lines: [
            { c: "Atlas steering - 2026-09-12 - Priya, Sam, Alex, Rahul", w: "ISO date and attendees. Searchable." },
            { c: "", w: "" },
            { c: "DECISIONS", w: "Decisions first, always. This is the section people come back for.", hi: true },
            { c: "- Go-live moves to 29 Sep. Reason: load testing incomplete after the", w: "" },
            { c: "  schema change. Decided by: Priya.", w: "**A decision with no recorded reason and no named decider is worthless later.**", hi: true },
            { c: "- Manual import approved as fallback if the vendor sandbox is not up", w: "" },
            { c: "  by 22 Sep.", w: "" },
            { c: "", w: "" },
            { c: "ACTIONS", w: "" },
            { c: "- Rahul: rerun load tests on the new schema - by 19 Sep", w: "Owner, verb, date. Every action. No exceptions.", hi: true },
            { c: "- Alex: notify the client of the new date - by 13 Sep", w: "" },
            { c: "", w: "" },
            { c: "DISCUSSED, NOT DECIDED", w: "" },
            { c: "- Whether to retire the legacy endpoint at go-live or later. Sam to", w: "" },
            { c: "  bring options to the next session.", w: "Recording the open questions stops them being rediscovered from scratch in three weeks.", hi: true },
            { c: "", w: "" },
            { c: "Next: 19 Sep 10:00 UTC", w: "" }
          ]
        }
      },

      { n: "Three headings — **Decisions**, **Actions**, **Discussed but not decided** — cover almost every meeting. Whoever writes the minutes has more influence over what the meeting meant than anyone who spoke in it, which is a good reason to volunteer.", nt: "Volunteer to take the notes" },

      {
        tryit: {
          t: "Write the non-goals",
          task: "You are writing a design doc for adding a caching layer to an internal API. Write four non-goals — things this work deliberately will not do.",
          hint: "Think about what a reviewer might otherwise assume is included and then argue about.",
          sol: { lang: "text", code: "Non-goals\n- This does not change the public API contract. Response shapes are\n  unchanged.\n- This does not attempt to reduce database load for write paths; it\n  targets read-heavy endpoints only.\n- This is not a general-purpose caching platform for other teams. If\n  that is wanted, it is a separate proposal.\n- This does not address the p99 outliers caused by the report job. That\n  is tracked separately in ATL-441." },
          w: "Each one closes a conversation that would otherwise happen in the comments. The fourth is doing extra work: it acknowledges a known problem so no reviewer has to raise it, and points at where it is being handled."
        }
      }
    ],
    k: [
      "A design doc exists to move disagreement earlier. Non-goals and alternatives-considered are what make that possible.",
      "State what decision the document wants, give it a reading time and a comment deadline.",
      "Proposals must name what you need from the client, or the slip becomes your fault.",
      "Replace adjectives with evidence: *eleven migrations, four regulated* beats *leading provider*.",
      "Minutes need three headings: decisions with reasons and deciders, actions with owners and dates, and open questions."
    ],
    r: ["Documentation", "Architecture Decision Record"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "This does not attempt to change the public API contract.", w: "a non-goal, stated to prevent scope argument" },
        { c: "We considered X and rejected it because Y.", w: "alternatives-considered in one sentence" },
        { c: "Rahul: rerun load tests on the new schema - by 19 Sep", w: "an action with owner, verb and date" }
      ]
    }
  },

  {
    t: "Writing About Yourself — resumes, self-appraisals and LinkedIn",
    m: "docs",
    lvl: "intermediate",
    s: "The hardest register in professional English: describing your own work without either undercutting it or inflating it.",
    goal: [
      "Write bullets that carry action, scale and result rather than responsibility",
      "Write a self-appraisal that helps your manager argue for you",
      "Write a profile summary that reads like a person rather than a job description"
    ],
    b: [
      { p: "Writing about your own work is uncomfortable in most cultures and actively discouraged in some. That discomfort produces two failure modes: writing so modestly that a reader cannot tell what you did, or over-claiming in a way that collapses under one follow-up question. The way out is not confidence — it is specificity. Specific facts do the boasting for you." },

      { h: "The bullet formula" },

      {
        syn: {
          t: "Action verb + what + scale + result",
          parts: [
            { p: "Rebuilt ", w: "**Strong past-tense verb.** Not *responsible for*, not *worked on*, not *helped with*." },
            { p: "the nightly ETL pipeline ", w: "**What.** Concrete and nameable." },
            { p: "processing 40M rows ", w: "**Scale.** The number that tells a stranger whether this was hard." },
            { p: "to run in 25 minutes instead of 4 hours, ", w: "**Result.** A measured change, with a before and an after." },
            { p: "removing the need for a second warehouse cluster.", w: "**Consequence.** What it meant to the business. This is the part almost everyone omits." }
          ],
          after: "One bullet, five components. It is longer than most advice recommends, and it is far more effective, because every component answers a question the reader would otherwise ask."
        }
      },

      {
        tbl: {
          t: "The same work, three ways",
          h: ["Version", "Text", "Reader's reaction"],
          rows: [
            ["**Responsibility**", "Responsible for the data pipeline.", "So was your whole team. What did *you* do?"],
            ["**Activity**", "Worked on improving the performance of the data pipeline.", "Did it improve? By how much?"],
            ["**Achievement**", "Cut nightly ETL runtime from 4 hours to 25 minutes on a 40M-row pipeline, removing the need for a second cluster.", "This person ships. Ask them about it."]
          ]
        }
      },

      { h: "Verbs worth using" },

      {
        tbl: {
          t: "Action verbs by what they signal",
          h: ["Signal", "Verbs"],
          rows: [
            ["**Built something new**", "built, designed, architected, launched, established, introduced, prototyped"],
            ["**Improved something existing**", "cut, reduced, accelerated, streamlined, refactored, consolidated, automated, doubled"],
            ["**Led people or work**", "led, drove, coordinated, mentored, ran, chaired, owned"],
            ["**Fixed or rescued**", "diagnosed, resolved, stabilised, recovered, unblocked, remediated"],
            ["**Influenced without authority**", "persuaded, aligned, negotiated, secured buy-in for, brought together"],
            ["**Analysed**", "analysed, modelled, quantified, benchmarked, evaluated, forecast"]
          ]
        }
      },

      { trap: "Avoid **assisted**, **helped with**, **participated in**, **was involved in**, **responsible for** and **worked on**. Every one of them describes proximity to work rather than the work. If your contribution genuinely was support, name the specific thing you did: not *assisted with the migration* but *wrote and tested the rollback procedure used during the migration*." },

      { h: "Finding the number when you think you do not have one" },

      { p: "Most people believe their work is unquantifiable. Almost none of it is. Some questions that usually produce a number:" },

      {
        l: [
          "**How much?** Rows, users, requests per second, revenue, budget, tickets, documents, GB.",
          "**How much faster or cheaper?** Before and after, even approximately. *Roughly halved* is a number.",
          "**How many people?** Team size, stakeholders, teams affected, users of the thing you built.",
          "**How often?** Daily, per release, per quarter — frequency turns a small saving into a large one.",
          "**What did it prevent?** Outages avoided, manual hours removed, a hire deferred, a penalty avoided.",
          "**Compared to what?** *First in the company to…*, *reduced from the previous 12 steps to 3.*"
        ]
      },

      { n: "If a number is estimated, say so and keep it conservative: *cut roughly 10 hours a month of manual reconciliation*. An estimate you can defend is far stronger than a precise-looking figure you cannot. Interviewers do probe these, and *I do not actually know where that number came from* is a bad thirty seconds.", nt: "Estimated is fine; unexplainable is not" },

      { h: "The self-appraisal" },

      { p: "A self-appraisal is not a request for praise. It is **ammunition for the person who has to argue for your rating in a room you are not in.** Write it for that room. Your manager needs facts they can repeat, mapped to whatever criteria the company actually uses." },

      {
        code: {
          lang: "text", t: "A self-appraisal entry that survives a calibration meeting",
          lines: [
            { c: "Impact - delivery", w: "Use the company's own competency names as your headings.", hi: true },
            { c: "Led the Atlas migration to completion three weeks ahead of the", w: "" },
            { c: "revised plan. 40M records, zero data loss, one hour of planned", w: "" },
            { c: "downtime against a four-hour budget.", w: "Facts a manager can repeat verbatim without checking anything.", hi: true },
            { c: "", w: "" },
            { c: "Impact - beyond my team", w: "" },
            { c: "The rollback procedure I wrote has since been adopted by the Payments", w: "" },
            { c: "and Identity teams as the template for their cutovers.", w: "Evidence of scope beyond your own remit is what most promotion criteria actually turn on.", hi: true },
            { c: "", w: "" },
            { c: "Where I want to grow", w: "" },
            { c: "I under-communicated the schema risk in weeks 2-3; Priya found out", w: "" },
            { c: "about it in a status meeting rather than from me. I have moved to a", w: "" },
            { c: "written weekly risk note as a result.", w: "One honest, specific, already-addressed weakness. This builds far more credibility than it costs.", hi: true }
          ]
        }
      },

      { trap: "Two self-appraisal failure modes. **Listing tasks** — *attended standups, maintained the pipeline* — reads as a job description and gives your manager nothing to argue with. **Claiming team results as personal** — *we grew revenue 30%* — invites the question *and what did you do?* Write *my* contribution inside *our* result: *I built the attribution model that identified the segment behind most of the 30% growth.*" },

      { h: "LinkedIn and profile summaries" },

      {
        vs: {
          t: "A summary that is a job description vs one that is a person",
          bad: { label: "Generic", c: "Results-driven software engineer with a passion for building scalable\nsolutions and a proven track record of delivering high-quality software\nin fast-paced environments. Team player with excellent communication\nskills.", w: "Every clause is unfalsifiable and could describe anyone. *Passionate*, *results-driven*, *proven track record*, *fast-paced* and *team player* are the five most common phrases in the genre, which is exactly why they carry no information." },
          good: { label: "Specific", c: "I build data platforms for regulated industries - mostly the unglamorous\npart where the data has to be right and auditable, not just fast.\n\nMost recently I led the migration of a 40M-record customer store to\nPostgres with an hour of downtime. Before that I spent four years in\npayments, which is where I learned to care about idempotency.\n\nInterested in: data platform roles in fintech or health. Happy to talk\nabout ETL horror stories with anyone.", w: "Names a niche, gives one verifiable achievement, explains where an opinion came from, and states what they want. A recruiter can act on this; they cannot act on the first version." }
        }
      },

      {
        tryit: {
          t: "Upgrade three bullets",
          task: "Rewrite these using the verb + what + scale + result + consequence formula, inventing plausible numbers:\n1. Responsible for testing the new release.\n2. Helped with the customer dashboard.\n3. Worked on improving documentation.",
          hint: "For each, ask: how much, how much better, and what did it prevent?",
          sol: { lang: "text", code: "1. Built the automated regression suite for the release pipeline, taking\n   pre-release testing from two days of manual checks to a 40-minute\n   run - which is what made weekly releases possible.\n\n2. Designed and shipped the customer usage dashboard now used daily by\n   ~200 account managers, replacing a weekly spreadsheet that took an\n   analyst a day to produce.\n\n3. Rewrote onboarding documentation for the platform, cutting the time\n   for a new engineer's first merged change from about three weeks to\n   five days across the last four hires." },
          w: "Notice that none of these claim more than the originals. They claim exactly the same work, described in a way that lets a stranger judge its size."
        }
      }
    ],
    k: [
      "Bullet formula: strong verb + what + scale + measured result + business consequence.",
      "Never *responsible for*, *helped with*, or *worked on* — they describe proximity to work, not work.",
      "Almost everything is quantifiable: how much, how much faster, how many people, how often, what it prevented.",
      "A self-appraisal is ammunition for your manager's argument in a room you are not in. Use the company's own competency headings.",
      "One specific, already-addressed weakness buys more credibility than it costs.",
      "*Passionate*, *results-driven*, *proven track record* and *team player* carry zero information. Replace each with one fact."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Cut nightly ETL runtime from 4 hours to 25 minutes on a 40M-row pipeline.", w: "verb, scale, measured result" },
        { c: "The rollback procedure I wrote was adopted by two other teams.", w: "evidence of impact beyond your own remit" },
        { c: "I built the attribution model behind most of that 30% growth.", w: "your contribution inside the team result" }
      ]
    }
  }

]);
