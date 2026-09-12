/* Professional English — everyday written English at work. */
TD.addLessons("english", [

  {
    t: "The Anatomy of a Professional Email",
    m: "write",
    lvl: "core",
    s: "Subject line, opening, structure, closing and sign-off — the six parts, what each one is for, and the phrase bank for each.",
    goal: [
      "Write a subject line that gets the email opened and found again later",
      "Structure a message so the ask survives an eight-second skim",
      "Open and close correctly for any recipient, internal or external"
    ],
    b: [
      { p: "The average office worker receives well over a hundred emails a day. Yours is not being read; it is being triaged. Every convention below exists to survive triage." },

      { h: "The six parts" },

      {
        syn: {
          t: "A complete professional email, labelled",
          parts: [
            { p: "Subject: Action needed: approve Q3 budget by Fri 12 Sep", w: "**Subject line.** Says what it is and what is required. Searchable in six months." },
            { p: "\n\n" },
            { p: "Hi Priya,", w: "**Greeting.** Name, comma. *Hi* is the international default." },
            { p: "\n\n" },
            { p: "Could you approve the attached Q3 budget by Friday 12 September?", w: "**The ask, first.** One sentence, with a date. Everything else is optional reading." },
            { p: "\n\n" },
            { p: "It is unchanged from the draft you saw except for the contractor line, which is down by 8k. Finance needs sign-off before they close the quarter.", w: "**Context.** Two sentences maximum. Only what is needed to act." },
            { p: "\n\n" },
            { p: "Happy to walk through it if that is easier — I have time Thursday afternoon.", w: "**The offer.** Lowers the cost of saying yes and pre-empts the reply asking for a call." },
            { p: "\n\n" },
            { p: "Best regards,\nAlex", w: "**Sign-off.** Match the formality of the greeting." }
          ],
          after: "Roughly seventy words. The recipient knows what to do after the first line and can stop there if they trust you."
        }
      },

      { h: "Subject lines" },

      {
        tbl: {
          t: "Subject line patterns that work",
          h: ["Pattern", "Example", "Use when"],
          rows: [
            ["**Action needed: [what] by [date]**", "Action needed: approve invoice by Fri", "You need something done"],
            ["**FYI: [what]**", "FYI: pipeline moved to the new cluster", "No action required — say so in the subject"],
            ["**Question: [topic]**", "Question: retention policy for audit logs", "One specific question"],
            ["**Decision needed: [options]**", "Decision needed: Postgres vs DynamoDB for the events store", "You want a choice made"],
            ["**[Project] — [status] — [date]**", "Atlas migration — on track — week 4", "Recurring status updates; makes a searchable series"],
            ["**Following up: [original subject]**", "Following up: Q3 budget approval", "A chase, on a new thread"],
            ["**Intro: [name] <> [name]**", "Intro: Priya <> Sam", "Introducing two people"]
          ]
        }
      },

      { trap: "Never send an email with the subject **Quick question**, **Hi**, **Update**, or worst of all a blank subject. They are invisible in a search six months later, and *quick question* is read by experienced recipients as *this will take forty minutes*." },

      { h: "Openings and closings, by relationship" },

      {
        tbl: {
          t: "Greeting register",
          h: ["Situation", "Greeting", "Notes"],
          rows: [
            ["Colleague, anyone internal", "**Hi Priya,**", "The global default. Safe everywhere."],
            ["Slightly warmer", "**Hi Priya, hope you are well.**", "One line of warmth is plenty; three is filler."],
            ["Group", "**Hi both,** / **Hi all,** / **Hi team,**", "*Dear all* is fine but reads formal"],
            ["Formal, name known", "**Dear Ms Sharma,**", "Use the surname, never *Dear Priya Sharma*"],
            ["Formal, name unknown", "**Dear Sir or Madam,** / **To whom it may concern,**", "Last resort — find the name if you can"],
            ["Cold outreach", "**Hi Priya,** then a first line about *them*", "Never open a cold email with *I*"],
            ["Reply in a fast thread", "*(no greeting at all)*", "After two or three exchanges, greetings are dropped"]
          ]
        }
      },

      {
        tbl: {
          t: "Sign-off register",
          h: ["Sign-off", "Formality", "Notes"],
          rows: [
            ["**Best,** / **Best regards,**", "Neutral", "The safest default in international business"],
            ["**Kind regards,**", "Neutral-formal", "Very common in the UK and Europe"],
            ["**Regards,**", "Neutral, slightly cool", "Some readers hear it as curt"],
            ["**Many thanks,** / **Thanks,**", "Warm-neutral", "Only when you are actually thanking them"],
            ["**Yours sincerely,**", "Formal", "BrE, when you named the recipient"],
            ["**Yours faithfully,**", "Formal", "BrE, when you wrote *Dear Sir or Madam*"],
            ["**Cheers,**", "Casual", "UK, Australia, Ireland. Reads oddly to some US and Asian readers"],
            ["**Warm regards,**", "Warm-formal", "Client relationships you want to keep"]
          ]
        }
      },

      { h: "The middle: three structures for three kinds of email" },

      {
        ol: [
          "**The request.** Ask → why → deadline → offer of help. Never more than five sentences.",
          "**The update.** Headline → what changed → what is next → what you need from them (or *nothing needed*). Bold the headline; nobody reads paragraph three.",
          "**The decision.** Question → options with one line each → your recommendation → what happens if nobody replies. That last part is the professional's trick: *unless I hear otherwise by Thursday, I will proceed with option B.*"
        ]
      },

      { n: "**Unless I hear otherwise, I will proceed with X by [date]** is one of the most useful sentences in workplace English. It converts a decision that could stall for weeks into a default with a deadline, and it puts the burden of action on the person who disagrees rather than on you.", nt: "The disagree-and-commit default" },

      { h: "Formatting for the skim" },

      {
        vs: {
          t: "Same content, one gets acted on",
          bad: { label: "A wall", c: "Hi, hope you are well. Following our conversation last week I have\nlooked into the three vendors and spoken to references for two of them,\nvendor A is cheapest but their SLA is only 99.5% and they could not\nprovide a reference in our sector, vendor B is 20% more expensive but\nhas a 99.95% SLA and two references in fintech, vendor C did not\nrespond in time, on balance I think we should go with B but it does\nmean going back to finance for the extra budget, let me know your\nthoughts.", w: "The recommendation is in sentence six. The action needed — going back to finance — is in sentence seven. Nobody reaches either at full attention." },
          good: { label: "Structured", c: "Hi Sam,\n\nRecommendation: go with Vendor B. It needs ~20% more budget, so we\nwould have to go back to finance.\n\nWhy:\n- B: 99.95% SLA, two fintech references\n- A: cheaper, but 99.5% SLA and no sector reference\n- C: did not respond in time\n\nCan you approve the budget conversation, or would you rather I bring\nboth options to the steering group on Thursday?\n\nBest,\nAlex", w: "Recommendation first, evidence scannable, and it closes with a specific either/or rather than *let me know your thoughts* — which is the sentence that guarantees no reply." }
        }
      },

      { trap: "**Let me know your thoughts** is the single most common way to guarantee an email is never answered. It gives the reader no defined action and no deadline. Replace it with a closed question — *Are you happy for me to proceed?* — or a default — *I will proceed on Thursday unless you would rather I did not.*" },

      { h: "The rules about cc, bcc and reply-all" },

      {
        tbl: {
          t: "Field etiquette",
          h: ["Field", "Convention", "Failure mode"],
          rows: [
            ["**To**", "People who must act", "Putting five people in To means nobody owns it"],
            ["**Cc**", "People who need to know but need not act", "Cc-ing someone's manager on a chase reads as an escalation, whether you meant it or not"],
            ["**Bcc**", "Only for large announcements, or to quietly drop someone from a thread", "Bcc-ing a third party into a live conversation is treated as a serious breach of trust in most companies"],
            ["**Reply all**", "Only when everyone genuinely needs the reply", "The default cause of company-wide email storms"],
            ["**Moving someone to bcc**", "Say so: *moving Sam to bcc to spare his inbox*", "Silently dropping people makes threads hard to reconstruct"]
          ]
        }
      },

      {
        tryit: {
          t: "Compress an email",
          task: "You need your manager to approve two extra days for testing before a release. Write the whole email in under sixty words, with a subject line, and a default action if they do not reply.",
          hint: "Ask, reason, consequence, default. No *hope you are well*.",
          sol: { lang: "text", code: "Subject: Approval needed: 2 extra days for release testing (by Wed)\n\nHi Sam,\n\nCould you approve pushing the release from Thursday to Monday? Two\nextra days would let us finish load testing, which we have not been\nable to run since the schema change.\n\nRisk if we do not: we ship untested under peak load.\n\nUnless you tell me otherwise by Wednesday, I will move the date and\nnotify the client.\n\nBest,\nAlex" },
          w: "Fifty-eight words in the body. The ask is first, the risk is explicit, and the default means the release date does not depend on your manager finding time to reply."
        }
      }
    ],
    k: [
      "Subject lines should state the topic and the action, and remain searchable months later. Never *quick question*.",
      "Put the ask in the first sentence. Context goes underneath, for the reader who wants it.",
      "*Hi [name]* and *Best regards* are the safe international defaults.",
      "*Let me know your thoughts* produces no reply. Close with a closed question or a stated default.",
      "*Unless I hear otherwise by [date], I will proceed with X* turns a stalled decision into a moving one."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Subject: Action needed: approve Q3 budget by Fri 12 Sep", w: "subject line stating topic and required action" },
        { c: "Unless I hear otherwise by Thursday, I will proceed with option B.", w: "the disagree-and-commit default" },
        { c: "Are you happy for me to go ahead, or would you rather review it first?", w: "closed question instead of let me know your thoughts" }
      ]
    }
  },

  {
    t: "The Difficult Messages — saying no, chasing, apologising, escalating",
    m: "write",
    lvl: "intermediate",
    s: "Ready-to-adapt templates for the fifteen workplace messages that people put off writing because they are uncomfortable.",
    goal: [
      "Decline a request without damaging the relationship",
      "Chase someone three times without escalating tone until you mean to",
      "Apologise, escalate and deliver bad news in language that holds up in a thread later"
    ],
    b: [
      { p: "Almost all workplace writing is easy. A small number of messages are not, and people delay them — sometimes for days — because they do not have the language ready. Having the template removes the delay, and the delay is usually the part that actually causes damage." },

      { h: "1. Saying no" },

      { p: "The structure that works every time: **appreciate → decline clearly → give one reason → offer an alternative.** The clear decline in position two is what people skip, and skipping it produces a message the recipient reads as a *maybe*." },

      {
        code: {
          lang: "text", t: "Declining extra work",
          lines: [
            { c: "Thanks for thinking of me for this - it is genuinely interesting work.", w: "Appreciate. One line only." },
            { c: "", w: "" },
            { c: "I am not going to be able to take it on this quarter.", w: "**The decline, unmistakable and early.** Not *I am not sure I can*, not *it might be difficult*.", hi: true },
            { c: "I am committed to the Atlas migration through to the end of March.", w: "One reason. Never a list — a list invites negotiation on each item." },
            { c: "", w: "" },
            { c: "Two things that might help: Rahul has done this kind of integration", w: "" },
            { c: "before, and I am happy to spend an hour reviewing whatever design", w: "" },
            { c: "you land on.", w: "The alternative. This is what converts a no into a helpful no.", hi: true }
          ]
        }
      },

      {
        tbl: {
          t: "Ways to decline, by force",
          h: ["Phrase", "Force", "Note"],
          rows: [
            ["I am afraid I will not be able to.", "Firm, polite", "The standard"],
            ["That is not something I can take on right now.", "Firm", "Blames capacity, not willingness"],
            ["I would rather not, and here is why:", "Firm, honest", "Strong when you have a real reason"],
            ["I do not think that is the right call, because…", "Disagreement, not refusal", "Use for decisions, not requests"],
            ["I can do X, but not Y.", "Partial", "The most useful of all — negotiate scope rather than refusing"],
            ["Not this quarter, but ask me again in April.", "Deferred", "Genuine only if you mean it"],
            ["Let me check what that would displace and come back to you.", "Buying time", "Also reframes the ask as a trade-off, which is usually what it is"]
          ]
        }
      },

      { n: "The most powerful decline in professional English is not a no at all: **What should I drop to make room for this?** It moves the decision to the person who owns your priorities, is impossible to read as unhelpful, and very often ends with them withdrawing the request themselves.", nt: "The prioritisation question" },

      { h: "2. Chasing — three escalating levels" },

      {
        code: {
          lang: "text", t: "The same chase at three temperatures",
          lines: [
            { c: "FIRST CHASE (day 3) - assume it was missed", w: "" },
            { c: "Hi Sam, just floating this back to the top of your inbox. No rush if", w: "" },
            { c: "you are mid-something - is Thursday still realistic?", w: "Zero blame. *Floating this back up* assumes an inbox problem, not a person problem.", hi: true },
            { c: "", w: "" },
            { c: "SECOND CHASE (day 7) - name the consequence", w: "" },
            { c: "Hi Sam, following up on the approval below. We need it by Friday to", w: "" },
            { c: "hold the release date - after that we slip to the 22nd. Could you let", w: "" },
            { c: "me know either way?", w: "Still no blame, but there is now a cost and a date attached.", hi: true },
            { c: "", w: "" },
            { c: "THIRD CHASE (day 10) - state what you will do", w: "" },
            { c: "Hi Sam, I have not been able to get sign-off on this, so I am going to", w: "" },
            { c: "flag the slip to Priya this afternoon and move the date to the 22nd.", w: "" },
            { c: "Let me know before 2pm if you would rather handle it differently.", w: "Not a threat. A statement of what happens next, with a window to change it.", hi: true }
          ]
        }
      },

      { trap: "The mistake is jumping from level one to level three, usually after a week of silent frustration, in a message that cc's their manager. Escalate the *content* — consequence, then action — and keep the *tone* flat throughout. A chase that gets colder each time reads as a grievance; a chase that gets more specific each time reads as professional." },

      { h: "3. Apologising" },

      {
        vs: {
          t: "The apology that closes the issue vs the one that extends it",
          bad: { label: "Over-apologising", c: "I am so sorry, this is completely my fault, I really should have caught\nthis and I feel terrible about it, I do not know how I missed it,\nsincere apologies again, it will not happen again I promise.", w: "Six apologies, no facts, no fix. It forces the recipient to manage your feelings instead of the problem, and repeated apology inflates the incident in everyone's memory." },
          good: { label: "Accountable", c: "That was my mistake - I used the staging credentials in the export\nscript, which is why the report was empty.\n\nFixed as of 11:20, and the corrected report is attached. I have added\na check to the script so it fails loudly rather than returning nothing.\n\nApologies for the delay this caused you.", w: "One apology, at the end, after the facts and the fix. Names what happened, what is now true, and what stops it recurring. This is what senior people write." }
        }
      },

      {
        tbl: {
          t: "Apology phrasing",
          h: ["Situation", "Say"],
          rows: [
            ["Your mistake, small", "**That was my mistake** — [what happened]. [Fixed by X]."],
            ["Your mistake, significant", "**I got this wrong, and I want to be clear about how.** [Facts, impact, fix, prevention.]"],
            ["Team's mistake, you are representing", "**We did not get this right.** [Facts, impact, fix.]"],
            ["Delay", "**Apologies for the slow reply** — [one-line reason, or none at all]."],
            ["Not your fault but you are the contact", "**I am sorry this has been frustrating.** Here is where it stands: […]"],
            ["Never say", "*Sorry if you felt…* / *Sorry but…* / *Mistakes were made* — the first two undo the apology, and the third is the passive voice used to avoid naming an agent, which everyone recognises"]
          ]
        }
      },

      { h: "4. Escalating" },

      { p: "Escalation is not a complaint. It is a formal handover of a decision to someone with more authority, and it should read that way — factual, dated, and free of adjectives about people." },

      {
        code: {
          lang: "text", t: "An escalation that will hold up in a thread six months later",
          lines: [
            { c: "Subject: Escalation: vendor API outage blocking Atlas cutover", w: "The word *escalation* in the subject is a signal, not an accusation." },
            { c: "", w: "" },
            { c: "Hi Priya,", w: "" },
            { c: "", w: "" },
            { c: "Raising this to you because it now needs a decision above my level.", w: "States why they are being written to. Removes the *why me?* reaction.", hi: true },
            { c: "", w: "" },
            { c: "Situation: the vendor sandbox has been down since Monday 09:00.", w: "" },
            { c: "We cannot complete integration testing without it.", w: "Facts with dates. No adjectives, no attribution of motive." },
            { c: "", w: "" },
            { c: "What I have tried: raised P1 with their support on Monday, chased", w: "" },
            { c: "Tuesday and Wednesday, escalated to our account manager Thursday.", w: "Shows you exhausted your own options first. This is the part that determines whether the escalation lands well.", hi: true },
            { c: "", w: "" },
            { c: "Impact: cutover slips from the 15th if this is not resolved by Monday.", w: "" },
            { c: "", w: "" },
            { c: "What I need from you: a call with their VP, or approval to fall back", w: "" },
            { c: "to the manual import for go-live.", w: "A specific ask with options, not *please help*.", hi: true }
          ]
        }
      },

      { h: "5. Delivering bad news" },

      {
        ol: [
          "**Lead with it.** Burying bad news makes the reader distrust everything above it once they find it.",
          "**Facts before feelings.** What happened, when, what the impact is.",
          "**Own your part precisely** — no more and no less than is yours.",
          "**Say what you are doing about it**, with an owner and a date.",
          "**Say when they will next hear from you.** This is the part that stops the follow-up storm."
        ]
      },

      {
        tbl: {
          t: "Softening structures for bad news",
          h: ["Instead of", "Write"],
          rows: [
            ["The project is late.", "**We are not going to hit the 15th.** The new date is the 29th."],
            ["We cannot do that.", "**That is not something we can support in this release** — here is what we can do instead."],
            ["You gave us the wrong data.", "**The file we received had the older schema**, which is where the mismatch came from."],
            ["Your team missed the deadline.", "**The dependency did not land on the 8th as planned**, so we have re-baselined."],
            ["This will cost more.", "**The revised estimate is £X**, up from £Y. The difference is driven by […]."]
          ]
        }
      },

      { n: "Note the pattern in that table: the bad news is stated just as plainly, but the *subject of the sentence changes from a person to an event*. That is the whole technique. It is not evasion — the facts are identical — it just stops the reader defending themselves instead of solving the problem.", nt: "Change the subject of the sentence, not the facts" },

      { h: "6. Asking for help without sounding lost" },

      {
        vs: {
          t: "Two ways to ask the same question",
          bad: { label: "Reads as helpless", c: "Hi, I am stuck on the auth thing, it is not working and I do not really\nknow what to try next. Do you have time to look?", w: "No detail, no attempt shown, open-ended time commitment. The reader has to do the diagnostic work of finding out what you already know." },
          good: { label: "Reads as competent and blocked", c: "Hi - I am blocked on the auth flow and would value ten minutes.\n\nWhat I see: token refresh returns 401 only for users created before\nthe migration.\nWhat I have ruled out: clock skew, and the client secret (rotated and\nretested).\nWhat I think is happening: the old records have a null issuer field.\nWhat I want from you: a sanity check on whether that is plausible\nbefore I write a backfill.", w: "Bounded time, evidence, hypothesis, and a specific ask. This format is close to a professional standard in engineering, and it makes people want to help you." }
        }
      },

      {
        tryit: {
          t: "Write the three hard ones",
          task: "Draft (a) a decline of a request to join a third weekly meeting, (b) a second chase for an overdue review, and (c) a two-line apology for sending a report with wrong figures.",
          hint: "Decline: appreciate, decline, one reason, alternative. Chase: no blame, consequence, date. Apology: fact, fix, one apology.",
          sol: { lang: "text", code: "(a) Decline\nThanks for including me. I am going to step out of this one - I am\nalready in two standing meetings on Wednesdays and I would rather\nprotect the delivery time. Happy to read the notes and comment async,\nand pull me in for any session where the data model is on the agenda.\n\n(b) Second chase\nFollowing up on the design review below. We need comments by Friday to\nkeep the build slot on the 22nd; after that the next slot is the 6th.\nCould you let me know either way, even if the answer is that you cannot\nget to it?\n\n(c) Apology\nThe figures in yesterday's report were wrong - I pulled the pre-adjustment\nnumbers. Corrected version attached; the totals move by about 4%.\nApologies for the confusion." },
          w: "All three are short. The length of a difficult message is not what makes it kind — the clarity is. Long difficult messages are usually long because the writer is uncomfortable, and the reader can feel it."
        }
      }
    ],
    k: [
      "Decline in four beats: appreciate, decline clearly, one reason, offer an alternative. The clear decline is the part people skip.",
      "*What should I drop to make room for this?* is the strongest decline there is.",
      "Chase by escalating specificity — missed → consequence → what you will now do — while keeping the tone flat.",
      "Apologise once, after the facts and the fix. Never *sorry if* or *sorry but*.",
      "Escalate with dates, what you already tried, the impact, and a specific ask.",
      "For bad news, change the subject of the sentence from a person to an event; keep the facts identical."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "I am not going to be able to take that on this quarter.", w: "an unmistakable decline" },
        { c: "What should I drop to make room for this?", w: "the prioritisation question" },
        { c: "That was my mistake - here is what happened and what I have fixed.", w: "an accountable apology" },
        { c: "Raising this to you because it now needs a decision above my level.", w: "opening an escalation without blame" }
      ]
    }
  },

  {
    t: "Slack, Chat and Async Writing — where tone is carried by nothing but words",
    m: "write",
    lvl: "intermediate",
    s: "The medium most workplace friction now happens in, and the small conventions that prevent almost all of it.",
    goal: [
      "Write chat messages that do not read as colder than you meant",
      "Use threads, formatting and status conventions the way experienced teams do",
      "Write a standup update and a handover that someone can act on without asking you anything"
    ],
    b: [
      { p: "Chat has the informality of speech and none of its signals. No face, no tone, no pause, no ability to correct course when you see someone's expression change. Almost every unnecessary conflict in a distributed team comes from that gap, and almost all of it is preventable with about six conventions." },

      { h: "The conventions that prevent misreadings" },

      {
        tbl: {
          t: "Six chat habits worth adopting permanently",
          h: ["Habit", "Why"],
          rows: [
            ["**Never send a bare `?` or a one-word `Why?`**", "In text these read as interrogation. Write *What is driving that choice?* — three extra words, entirely different message."],
            ["**Do not send `hi` and then wait**", "It holds the other person hostage while you type. Send the question in the first message. There is a whole website devoted to asking people to stop doing this."],
            ["**Put the ask in the first line, not the fifth**", "Long chat messages are read top-down and abandoned halfway."],
            ["**Use threads for anything with more than two replies**", "A channel where three conversations interleave is unreadable the next morning."],
            ["**One emoji or one exclamation mark warms a message enormously**", "*Thanks* reads flat; *Thanks!* or *Thanks 🙏* reads human. Non-native writers under-use this and are read as cold when they were being careful."],
            ["**Say when you will get back to someone**", "*Cannot look at this until after 3* costs four seconds and prevents an hour of someone wondering."]
          ]
        }
      },

      {
        vs: {
          t: "The same message, read two ways",
          bad: { label: "As written", c: "did you deploy this\n\nwhy", w: "The writer was curious. The reader sees an accusation, arriving in two separate notifications, with no punctuation to soften it. This exchange has genuinely ended working relationships." },
          good: { label: "Same intent, no ambiguity", c: "Hey - did the payments change go out today? Trying to work out whether\nthe latency bump at 14:00 is related. No drama either way 🙂", w: "States the question, states the *reason for asking*, and explicitly removes the threat. That middle part — saying why you are asking — is the single highest-value habit in async writing." }
        }
      },

      { n: "**Always say why you are asking.** People fill silence with the worst plausible explanation. *Why did you do it that way?* becomes *I am being audited*. *Asking because I want to copy the pattern in my service* becomes a compliment. The information cost is one clause.", nt: "The most useful async habit there is" },

      { h: "Formatting chat so it can be read" },

      {
        code: {
          lang: "text", t: "A well-formed channel message",
          lines: [
            { c: "*Heads up: deploying the auth service at 15:30* :rocket:", w: "Bold or italic first line acts as a headline. Scanners stop here." },
            { c: "", w: "" },
            { c: "What changes: token TTL drops from 24h to 1h.", w: "" },
            { c: "Who is affected: anyone using long-lived sessions in staging.", w: "Labelled lines, not paragraphs. Each answers a question someone would ask." },
            { c: "Rollback: one command, ~2 minutes.", w: "" },
            { c: "", w: "" },
            { c: "Shout in thread if this is a bad window for you.", w: "Names the reply channel, which keeps the main channel clean.", hi: true }
          ]
        }
      },

      { h: "The standup update" },

      { p: "Three lines. Yesterday, today, blockers. The single most common failure is describing activity rather than progress." },

      {
        vs: {
          t: "Activity vs progress",
          bad: { label: "Activity", c: "Yesterday: worked on the importer.\nToday: continuing on the importer.\nBlockers: none.", w: "Says nothing. Repeated for four days it actively hides the fact that you are stuck, which is the exact thing standup exists to surface." },
          good: { label: "Progress", c: "Yesterday: importer handles CSV and TSV; found that ~3% of rows have a\nmalformed date.\nToday: deciding whether to reject those rows or coerce them - leaning\nreject, will confirm with Sam.\nBlockers: none, but if the date call goes the other way it is another\nday.", w: "Names what is now true, what the open question is, and where the risk sits. Someone can help you from this. Nobody can help you from the first version." }
        }
      },

      { h: "Handover and out-of-office writing" },

      {
        code: {
          lang: "text", t: "A handover note that does not generate questions",
          lines: [
            { c: "Out from Mon 14th, back Mon 21st.", w: "Dates first, both of them." },
            { c: "", w: "" },
            { c: "Cover: Rahul (@rahul) for Atlas, Priya (@priya) for anything client-facing.", w: "Named owners, not *the team*. An unowned handover is not a handover." },
            { c: "", w: "" },
            { c: "In flight:", w: "" },
            { c: "- Atlas cutover rehearsal booked Wed 16th 10:00 - runbook in /docs/atlas.", w: "" },
            { c: "- Vendor contract with legal, expect comments Thu; Priya can approve", w: "" },
            { c: "  anything under 10k without me.", w: "Pre-authorises decisions. This is the part that prevents things stalling for a week.", hi: true },
            { c: "", w: "" },
            { c: "Reachable for genuine emergencies on my mobile; otherwise I will not", w: "" },
            { c: "be reading Slack.", w: "Says explicitly what *is* and *is not* being monitored. Ambiguity here means everyone assumes the worst option for them." }
          ]
        }
      },

      { h: "Writing across time zones" },

      {
        tbl: {
          t: "Async-first habits for distributed teams",
          h: ["Habit", "Detail"],
          rows: [
            ["**Always write times with a zone**", "*15:00 UTC* or *15:00 CET*. Never *3pm*. Add the local time for the reader if you know it."],
            ["**Never use** *tomorrow* **or** *EOD*", "*EOD* is a different moment in three cities. Write the date and time."],
            ["**Write for a reader who is asleep**", "Assume no follow-up question is possible for twelve hours. Include the context they would have asked for."],
            ["**Give a decision deadline, not a meeting**", "*Comments by 09:00 UTC Thursday, then I proceed* respects everyone's clock."],
            ["**Use the ISO date format for anything ambiguous**", "*2026-09-12*. `09/12` means September 12 in the US and 9 December almost everywhere else — this genuinely causes missed deadlines."]
          ]
        }
      },

      {
        tryit: {
          t: "Rewrite a cold message",
          task: "A teammate posts in a channel: *this query is really slow, who wrote it*. Rewrite it so it gets the same information without anyone becoming defensive.",
          hint: "Say why you are asking. Ask about the code, not the person.",
          sol: { lang: "text", code: "Looking at the nightly report job - the customer_summary query is taking\n~40s and I think it is what is pushing us past the window.\n\nAnyone got context on why it does the self-join? Trying to work out\nwhether it is safe to rewrite or whether it is doing something I am not\nseeing. Happy to pair on it." },
          w: "Same question, three changes: the subject is the query rather than a person, the reason for asking is stated, and it ends with an offer. Nobody has to defend anything to answer it."
        }
      }
    ],
    k: [
      "Say why you are asking. People fill silence with the worst plausible explanation.",
      "Never send a bare *?* or a lone *hi* — send the question in the first message.",
      "One emoji or exclamation mark reads as warmth; careful non-native writers under-use them and get read as cold.",
      "Standups should report progress and open questions, not activity.",
      "Handovers need named owners and pre-authorised decisions, or work stalls for the whole week.",
      "Always write times with a time zone and dates in an unambiguous format."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Asking because I want to reuse the pattern - no drama either way.", w: "state why you are asking" },
        { c: "Comments by 09:00 UTC Thursday, then I will proceed.", w: "async decision deadline with a time zone" },
        { c: "Cover while I am out: Rahul for Atlas, Priya for anything client-facing.", w: "handover with named owners" }
      ]
    }
  }

]);
