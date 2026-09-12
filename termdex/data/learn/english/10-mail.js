/* Professional English — mail and application writing.

   The everyday-email lesson lives in the `write` module. This module is the
   documents that pass through somebody else's process: a letter to an
   institution, an application to an authority, a cover letter that a
   stranger will spend eight seconds on. They are separated because they
   fail differently — an email that is badly formatted is read anyway, and
   an application that is badly formatted is often not. */
TD.addLessons("english", [

  {
    t: "The Formal Letter — the format that is still marked",
    m: "mail",
    lvl: "core",
    s: "Full block layout part by part, the four salutation and sign-off pairs that are actually wrong when mismatched, and how a letter changes when it travels as an email.",
    goal: [
      "Lay out a formal letter that no institution can reject on form",
      "Pair a salutation and a sign-off correctly, every time",
      "Convert any letter into an email without losing what made it formal"
    ],
    b: [
      { p: "Almost every email lesson tells you formal letters are dead. They are not — they have moved. The layout survives inside PDF attachments, inside university and visa and bank and government correspondence, inside anything that will be filed rather than read, and inside the cover letter that sits beside every serious job application." },

      { p: "The reason the format still matters is unglamorous: **on the other side there is a process, and the process is looking for parts.** A reference number, a date, a subject, a signature. A letter missing them is not judged as informal; it is often simply harder to file, and hard-to-file correspondence gets dealt with last." },

      { h: "The layout" },

      { dg: "letter-block" },

      { p: "That is **full block**: everything flush against the left margin, no indented paragraphs, one blank line between parts. It is the modern default, it is the easiest to get right, and no institution anywhere objects to it. The older indented styles are not wrong; they are simply more ways to make a mistake." },

      {
        syn: {
          t: "A complete application, labelled",
          parts: [
            { p: "Aryan Sharma\n41 Nehru Road, Pune 411004\naryan.sharma@example.com | +91 98765 43210", w: "**Your block.** Name, address, and the two ways to reach you. Skip the postal address only if the letter will never leave email." },
            { p: "\n\n" },
            { p: "14 September 2026", w: "**The date, written out.** *14/09/26* is 9 April in the United States. Spell the month and the ambiguity disappears." },
            { p: "\n\n" },
            { p: "Dr Meera Iyer\nHead of Department, Computer Science\nSavitribai Phule Pune University", w: "**Their block.** A name if you can find one, a title if you cannot. Finding the name is usually two minutes of searching and it changes how the letter is received." },
            { p: "\n\n" },
            { p: "Subject: Application for bonafide certificate — Roll no. 2021CS4417", w: "**The subject line, and the reference number.** The most-skipped line in student and institutional correspondence, and the one that decides how fast it is processed." },
            { p: "\n\n" },
            { p: "Dear Dr Iyer,", w: "**The salutation.** Title and surname. Comma after it in British usage; a colon is the American convention in business letters." },
            { p: "\n\n" },
            { p: "I am writing to request a bonafide certificate confirming my enrolment in the BE Computer Science programme.", w: "**Paragraph one: the ask, in the first sentence.** Never build up to it. Whoever is reading this has forty more letters behind yours." },
            { p: "\n\n" },
            { p: "I need it for a visa application, which requires proof of current enrolment. My roll number is 2021CS4417 and I am in the seventh semester.", w: "**Paragraph two: the grounds.** Only the facts the reader needs in order to act. Not the story of the visa." },
            { p: "\n\n" },
            { p: "I would be grateful if it could be issued by 28 September, as my appointment is on 2 October. I am happy to collect it in person.", w: "**Paragraph three: the date and the next step.** A deadline with a reason attached, and a way to make it easy for them." },
            { p: "\n\n" },
            { p: "Yours sincerely,\n\nAryan Sharma\nRoll no. 2021CS4417", w: "**Sign-off, space for a signature, name, and the identifier they file by.** The roll number appears twice on purpose — once where it is searched for, once where it is filed." }
          ],
          after: "Around a hundred words of body. Every paragraph does one job, and the reader could act on it having read only the first line of each."
        }
      },

      { h: "The four pairs" },

      { p: "Salutation and sign-off are a matched pair. Mismatching them is the single most common formal-writing error, and in British usage it is genuinely wrong rather than merely unusual." },

      {
        tbl: {
          t: "Match these",
          h: ["You know the name", "Salutation", "Sign-off"],
          rows: [
            ["**Yes, formal**", "*Dear Dr Iyer,*", "***Yours sincerely,*** — the rule is: named person, sincerely"],
            ["**No**", "*Dear Sir or Madam,*", "***Yours faithfully,*** — unnamed, faithfully. British usage"],
            ["**Either, American usage**", "*Dear Dr Iyer:*", "***Sincerely,*** — a colon after the name, and no *yours*"],
            ["**Semi-formal, known contact**", "*Dear Meera,*", "***Kind regards,*** or ***Best regards,***"]
          ]
        }
      },

      { trap: "*To whom it may concern* is not a neutral choice, it is a last resort — it announces that you did not find out who you were writing to. Use it only when the recipient genuinely cannot be identified, such as a reference letter that will be read by an unknown future employer. For everything else, *Dear Sir or Madam* is better, and an actual name is better than both." },

      { h: "Twelve mistakes that get letters rejected on form" },

      {
        l: [
          "**No subject line.** In institutional post this is the difference between being routed and being stacked.",
          "**No reference number** — roll number, employee id, application number, invoice number. If they file by it, put it in.",
          "**A numeric date.** *05/06/2026* is two different days in two different countries.",
          "**Dear Sir/Madam paired with Yours sincerely.** The pair is wrong.",
          "**The full name in the salutation.** *Dear Aryan Sharma* is not used by anybody in any register.",
          "**Respected Sir** — very common in South Asian institutional writing and read as dated or obsequious elsewhere. *Dear Sir or Madam* travels further.",
          "**The ask buried in paragraph three.** It goes in sentence one.",
          "**Contractions in a formal letter.** *I am* rather than *I'm*. Email is different; a letter is not.",
          "**An informal or joke email address.** Get a firstname.lastname one. It costs nothing and it is on every single thing you send.",
          "**No signature block**, or a name with no identifying number attached.",
          "**Attachments referred to but not named.** *Please find attached my transcript and identity proof* — name them, so the recipient can check they arrived.",
          "**Sending it and then chasing after two days.** Institutional processes are slow by design. Give a stated deadline and follow up once, after it passes."
        ]
      },

      { h: "The same letter as an email" },

      {
        vs: {
          t: "Letter and email, same request",
          bad: { label: "The letter, pasted into an email", c: "Aryan Sharma\n41 Nehru Road, Pune 411004\n\n14 September 2026\n\nDr Meera Iyer\nHead of Department, Computer Science\n\nSubject: Application for bonafide certificate\n\nDear Dr Iyer,\n\nI am writing to request...", w: "The email header already carries the sender, the date and the recipient. Repeating all three pushes the actual request below the fold, which is exactly where it should not be." },
          good: { label: "The email version", c: "Subject: Bonafide certificate request — Aryan Sharma,\n         Roll no. 2021CS4417\n\nDear Dr Iyer,\n\nI am writing to request a bonafide certificate\nconfirming my enrolment in the BE Computer Science\nprogramme...\n\n[same three paragraphs]\n\nYours sincerely,\nAryan Sharma\nRoll no. 2021CS4417 | BE CSE, 7th semester\n+91 98765 43210", w: "Blocks and date removed because the email supplies them; the reference number moved up into the subject where it is searchable; and the signature block now carries the identifying details the address block used to." }
        }
      },

      {
        l: [
          "**Keep** the subject line, the salutation, the paragraph structure, the sign-off and the identifying number.",
          "**Drop** the two address blocks and the date line.",
          "**Move** the reference number into the subject, because that is what makes the thread findable six months later.",
          "**Attach the formal version as a PDF** when the process expects a letter — a scholarship application, a visa document, a bank instruction. Then the email is a covering note and the PDF is the letter."
        ]
      },

      {
        tryit: {
          t: "Write it cold",
          task: "You need a duplicate mark sheet for the fifth semester. Yours was damaged. You need it by 20 October for a job application. Write the whole letter in full block, under 120 words in the body.",
          hint: "Ask in sentence one, grounds in paragraph two, date and next step in paragraph three.",
          sol: { lang: "text", code: "Subject: Request for duplicate mark sheet, Semester 5 -\n         Roll no. 2021CS4417\n\nDear Sir or Madam,\n\nI am writing to request a duplicate mark sheet for the fifth\nsemester of the BE Computer Science programme.\n\nMy original was damaged by water and is no longer legible. My\nroll number is 2021CS4417 and I completed the semester in\nDecember 2024. I have attached a scan of the damaged copy and\na copy of my identity card.\n\nI would be grateful if it could be issued by 20 October, as I\nhave to submit it with a job application on 24 October. I am\nhappy to collect it in person and to pay any duplicate fee.\n\nYours faithfully,\n\nAryan Sharma\nRoll no. 2021CS4417 | BE CSE" },
          w: "Ninety-eight words. Note the pair: no name, so *Dear Sir or Madam* with *Yours faithfully*. Note also the attachments are named, the deadline has a reason, and the offer to pay removes a question the office would otherwise have to come back and ask."
        }
      }
    ],
    k: [
      "Full block: everything flush left, one blank line between parts. No institution objects to it.",
      "Named person means *Yours sincerely*; *Dear Sir or Madam* means *Yours faithfully*. The pair is a rule, not a preference.",
      "Subject line and reference number are what get a letter routed rather than stacked.",
      "Write the date out. A numeric date is a different day in a different country.",
      "As an email: drop the address blocks and the date, move the reference number into the subject, keep everything else."
    ],
    r: ["Documentation"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Subject: Application for bonafide certificate — Roll no. 2021CS4417", w: "the subject line carrying both the purpose and the reference number" },
        { c: "I am writing to request a duplicate mark sheet for the fifth semester.", w: "the ask, as the first sentence of a formal letter" },
        { c: "Yours faithfully,", w: "the sign-off that pairs with Dear Sir or Madam" }
      ]
    }
  },

  {
    t: "The Job Application — cover letter, cold email and the follow-up",
    m: "mail",
    lvl: "intermediate",
    s: "What a cover letter is actually for, the four-paragraph structure that works, the referral ask, and the follow-up cadence that is persistent rather than annoying.",
    goal: [
      "Write a cover letter that is specific to one company and takes twenty minutes",
      "Send a cold email that gets a reply from somebody who owes you nothing",
      "Follow up on an application without damaging your chances"
    ],
    b: [
      { p: "Most cover letters are a paraphrase of the resume in paragraph form, and everybody involved knows it. That version is genuinely worthless, which is why so many people conclude cover letters do not matter." },

      { p: "The version that matters answers a question the resume structurally cannot: **why this company, and why you specifically for this role.** A resume is the same document for every application. The cover letter is the part that is not, and if yours could be sent to four companies with the name changed, it is doing nothing." },

      { h: "The four paragraphs" },

      {
        ol: [
          "**The hook.** Why this company, concretely. Something you have actually read, used, or noticed — their engineering blog, their product, a talk somebody gave. One or two sentences, and it must be specific enough that it could not be said about their competitor.",
          "**The proof.** One thing you have built or done that maps directly onto what the role needs, with a number in it. Not a list. One thing, told properly.",
          "**The fit.** Why the combination works — what they said they need, and the part of your experience that meets it. This is where the job description gets used, but in your own words rather than quoted back.",
          "**The close.** A plain statement of interest and availability. No begging, no *I would be honoured*, no long thank-you paragraph."
        ]
      },

      {
        vs: {
          t: "The same candidate, twice",
          bad: { label: "The one nobody finishes", c: "Dear Hiring Manager,\n\nI am writing to apply for the position of Backend\nEngineer at your esteemed organisation. I am a\nhardworking and passionate software engineer with 3\nyears of experience in Java, Python, Spring Boot,\nDocker, Kubernetes and AWS. I am a quick learner and\na good team player with excellent communication\nskills.\n\nI believe my skills make me a perfect fit for this\nrole and I would be honoured to contribute to your\norganisation. Please find my resume attached.\n\nThanking you,\nAryan", w: "Nothing here is about *this* company. The adjectives are unverifiable, the technology list is already on the resume, and *esteemed organisation* signals a template. It could be sent anywhere, which is exactly what a reader assumes it was." },
          good: { label: "The one that gets read", c: "Dear Ms Rao,\n\nI read your post on cutting cold-start latency in the\npayments service — the bit about pre-warming\nconnection pools was the fix we eventually landed on\ntoo, after two weeks of blaming the JVM.\n\nAt Meridian I own the payments backend. Last year I\nmoved us from a single synchronous flow to an\nevent-driven one, which cut checkout p99 from 1.4s to\n380ms and took the failed-payment rate from 2.1% to\n0.4%.\n\nYour posting asks for someone who can take payments\nownership end to end rather than build to a spec.\nThat is the part of the job I have actually been\ndoing, including the on-call and the awkward\nconversations with the payment provider.\n\nI would like to be considered. I am available for a\ncall any afternoon this week or next.\n\nYours sincerely,\nAryan Sharma", w: "Specific to them in sentence one, one achievement with four numbers in it, an explicit match to what they asked for, and a close that makes the next step easy. Under two hundred words and it could not be sent to anybody else." }
        }
      },

      { n: "It takes about twenty minutes to write the good version, most of it spent finding the hook. Six applications with a real letter each beat sixty with a template, and the arithmetic is not close — the templated version is filtered out at a rate that makes the volume meaningless.", nt: "The trade you are actually making" },

      { h: "The subject line of an application email" },

      {
        tbl: {
          t: "Patterns that survive a full inbox",
          h: ["Pattern", "Use when"],
          rows: [
            ["**Application: Backend Engineer — Aryan Sharma**", "The default. Role first, because that is what they are sorting by"],
            ["**Backend Engineer (Req 4417) — Aryan Sharma**", "Whenever a requisition or job id exists. It routes automatically"],
            ["**Referred by Priya Nair — Backend Engineer — Aryan Sharma**", "A referral. Put the referrer first; it is the single most valuable word in the subject"],
            ["**Following up: Backend Engineer application, 12 Sept**", "The follow-up. Never reply-all to an automated acknowledgement"]
          ]
        }
      },

      { h: "The cold email" },

      { p: "A cold email to an engineer or a hiring manager is not a cover letter. It is shorter, it asks for something much smaller, and it is written on the assumption that the reader owes you nothing at all." },

      {
        code: {
          lang: "text",
          t: "A cold email that gets answered",
          lines: [
            { c: "Subject: Question about the payments team at Meridian", w: "**A question, not a request.** *Opportunity*, *seeking a role* and *my resume* in a subject line are all filtered by habit." },
            { c: "", w: "" },
            { c: "Hi Sam,", w: "First name. You are writing to a person, not to a department." },
            { c: "", w: "" },
            { c: "I read your write-up on the ledger rewrite — the decision to", w: "**Something specific about them, first.** This is the entire cost of entry, and it is why cold emails mostly fail: the reader can tell in one line whether this was sent to them or to two hundred people.", hi: true },
            { c: "keep double-entry rather than event-sourcing it was not what", w: "" },
            { c: "I expected, and the reasoning made sense.", w: "" },
            { c: "", w: "" },
            { c: "I work on payments at Meridian - event-driven checkout, about", w: "**Who you are, in one line.** Enough to establish that you are worth replying to, and no more." },
            { c: "40k transactions a day. I am starting to look around.", w: "" },
            { c: "", w: "" },
            { c: "Would you be open to fifteen minutes to tell me what the team", w: "**A small, specific ask.** Fifteen minutes for information is answerable. *Can you refer me* from a stranger is not.", hi: true },
            { c: "is actually working on? Happy to work around your calendar.", w: "" },
            { c: "", w: "" },
            { c: "Aryan", w: "Sign off short. A formal block on a cold email reads as a mass mailing." }
          ],
          after: "About eighty words. The reply rate on this shape is far higher than on anything containing the phrase *I am reaching out regarding opportunities*."
        }
      },

      { h: "Asking for a referral" },

      {
        l: [
          "**Make it easy to say no.** *No problem at all if you would rather not* is not weakness — it is what makes a yes real, and it is why people answer.",
          "**Do the work for them.** Send the exact role link, your resume, and two or three lines they can paste into the referral form. A referral that requires half an hour of somebody's effort often does not happen.",
          "**Ask people who have seen you work.** A referral from a stranger carries almost nothing; a referral from somebody who can answer *what are they like* carries a great deal.",
          "**Say what you are actually after.** *I am aiming for backend roles with real ownership, ideally payments or infra* gives them something to match against. *Any openings* does not.",
          "**Report back afterwards.** Whether it worked or not. This is the part almost nobody does and it is why people refer the same person twice."
        ]
      },

      { h: "The follow-up" },

      {
        tbl: {
          t: "Cadence that stays on the right side of the line",
          h: ["When", "What", "Note"],
          rows: [
            ["**After applying**", "Nothing for a week", "Automated systems have not shown it to anybody yet"],
            ["**One week**", "One short follow-up on the same thread", "Two sentences: still interested, happy to send anything else"],
            ["**Two weeks after that**", "One more, then stop", "Two follow-ups is persistence. Four is a reputation"],
            ["**After an interview**", "A short thank-you within 24 hours", "Three or four sentences, and one specific thing from the conversation"],
            ["**After the stated decision date passes**", "One note asking about timelines", "Perfectly reasonable, and asking about *timelines* rather than *the decision* keeps it easy to answer"],
            ["**After a rejection**", "One short, warm reply", "The single highest-return email in a job search — people are re-contacted months later remarkably often"]
          ]
        }
      },

      { trap: "The post-interview thank-you is not a formality and it is not a summary of the interview. Its job is one specific thing: **name something from the conversation and add the answer you wished you had given.** *You asked how I would handle the dual-write consistency — I thought about it afterwards and I would put a reconciliation job on it rather than relying on the retry.* That is the version that changes minds; the generic version changes nothing." },

      {
        tryit: {
          t: "Find one hook",
          task: "Pick one company you would actually want to work for. Spend ten minutes finding one specific thing — a blog post, a talk, a design decision, a product detail — that you could open a letter with. Write the two-sentence hook.",
          hint: "If it could be said about their nearest competitor, it is not a hook.",
          sol: { lang: "text", code: "Where hooks are actually found, in order of how well\nthey work:\n\n1  The engineering blog                 specific, dated, technical\n2  A conference talk by somebody there  even better, because\n                                        you can name the person\n3  A product decision you noticed as a user\n4  An open-source repository they maintain\n5  A public postmortem or incident writeup  the best of all,\n                                        because almost nobody reads them\n\nWhat does not work: the About page, the funding\nannouncement, the mission statement, and anything on the\nfront page of their website. Everybody who sends a template\nquotes those." },
          w: "The test is competitor-substitution. If swapping the company name still leaves a true sentence, it is not doing the job the paragraph exists for."
        }
      }
    ],
    k: [
      "A cover letter answers what a resume cannot: why this company and why you for this role.",
      "Hook, proof with a number, fit, close. Under two hundred words, specific enough that it could not be sent elsewhere.",
      "Six real letters beat sixty templates. Templates are filtered at a rate that makes volume meaningless.",
      "A cold email asks for fifteen minutes of information, not for a job, and opens with something specific about them.",
      "Two follow-ups is persistence, four is a reputation. Reply warmly even to a rejection."
    ],
    r: ["Documentation"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Subject: Referred by Priya Nair — Backend Engineer — Aryan Sharma", w: "the application subject line when you have a referral, referrer first" },
        { c: "Would you be open to fifteen minutes to tell me what the team is actually working on?", w: "the small ask that makes a cold email answerable" },
        { c: "No problem at all if you would rather not.", w: "the line that makes a referral request easy to decline, and therefore easy to accept" }
      ]
    }
  },

  {
    t: "Applications to Authority — leave, permission, complaint and resignation",
    m: "mail",
    lvl: "intermediate",
    s: "The five applications everyone eventually writes, each with the one element that decides whether it is granted, plus the file names and attachments that quietly decide the rest.",
    goal: [
      "Write a leave, permission, correction, complaint or resignation letter that does its job first time",
      "Escalate to a higher authority without burning the lower one",
      "Package an application so that nothing is bounced back on process"
    ],
    b: [
      { p: "These five cover almost everything an engineer or a student ever has to send to an institution. They share a structure and differ in one element each — and that element is the whole letter." },

      {
        tbl: {
          t: "Five applications, five decisive elements",
          h: ["Application", "The element that decides it"],
          rows: [
            ["**Leave**", "**The cover.** Who is handling your work while you are away, named"],
            ["**Permission**", "**The precedent or the rule.** Why granting it is allowed, not just why you want it"],
            ["**Correction**", "**The evidence.** Two documents: what is wrong, and what is right"],
            ["**Complaint**", "**The remedy.** What you are asking them to do, stated plainly"],
            ["**Resignation**", "**The date.** Everything else is courtesy; the date is the operative content"]
          ]
        }
      },

      { h: "Leave" },

      {
        code: {
          lang: "text",
          t: "A leave application that gets approved without a follow-up question",
          lines: [
            { c: "Subject: Leave request: 14-18 October (5 working days)", w: "**Dates and the count in the subject.** The approver is scanning for exactly this." },
            { c: "", w: "" },
            { c: "Dear Sam,", w: "" },
            { c: "", w: "" },
            { c: "I would like to take leave from Monday 14 October to Friday", w: "**The ask with exact dates.** Both ends stated; never *for a week*." },
            { c: "18 October, five working days, returning Monday 21 October.", w: "And the return date, which is the thing a rota is actually built around." },
            { c: "", w: "" },
            { c: "Cover: Priya has agreed to take the payments on-call and I", w: "**The cover, named, and already agreed.** This single line is the difference between an approval and a conversation.", hi: true },
            { c: "will have the migration at a safe stopping point before I go.", w: "" },
            { c: "", w: "" },
            { c: "This is 5 of my 18 remaining days. Let me know if the timing", w: "**Your own balance**, so they do not have to look it up, and an opening to move it." },
            { c: "is difficult and I can move it.", w: "" },
            { c: "", w: "" },
            { c: "Thanks,\nAryan", w: "" }
          ],
          after: "Under a hundred words, and there is nothing left for the approver to ask."
        }
      },

      { n: "For a **student** leave application the equivalent decisive element is the same idea in a different form: what you will do about the work you miss. *I have arranged to collect notes from a classmate and will submit the assignment due on 16 October before I leave* answers the question the letter would otherwise generate.", nt: "The student version" },

      { h: "Permission" },

      { p: "A permission request fails when it argues only from your side. The approver is not deciding whether you want it — that is obvious — they are deciding whether they are allowed to give it and what it costs them. So the letter has to answer **their** question." },

      {
        l: [
          "**Name the rule or the precedent** if one exists. *The handbook allows conference attendance under professional development* or *two people in the team attended last year*.",
          "**State the cost precisely**, including money if there is any. Vagueness about cost is what generates the *let me think about it* that never resolves.",
          "**State the benefit in their terms**, not yours. Not *I would learn a lot* but *I would come back able to run the migration in-house rather than paying the vendor*.",
          "**Offer a smaller version.** *If the full three days is too much, one day and no travel would still be worth it.* An approver who can say yes to something smaller usually does."
        ]
      },

      { h: "Correction" },

      { p: "Records get things wrong: a name spelled incorrectly on a degree, a wrong date of birth on a payroll record, a mark entered against the wrong subject. These are pure process letters and they are decided almost entirely by whether the evidence is attached." },

      {
        ol: [
          "**State what is wrong and what it should be**, in that order, in one sentence.",
          "**Attach the document that shows the error** and the document that shows the correct value. Two attachments, named in the letter.",
          "**Give every identifier you have** — roll number, employee id, application number, date of issue, certificate serial.",
          "**Ask for the specific corrected artefact.** A reissued certificate, an updated record, a written confirmation. Say which."
        ]
      },

      { h: "Complaint" },

      {
        vs: {
          t: "Two complaints about the same thing",
          bad: { label: "The one that gets a form reply", c: "I am writing to complain about the extremely poor\nservice I have received. This is the third time this\nhas happened and it is completely unacceptable. Nobody\never responds and the whole process is a joke. I am\nvery disappointed and expect this to be taken\nseriously.", w: "Entirely emotion and no facts. There is no date, no reference, no description of what happened and — critically — no statement of what would resolve it. There is nothing here anybody could action even if they wanted to." },
          good: { label: "The one that gets resolved", c: "Subject: Unresolved refund — Order 88214, raised 3\n         September\n\nI am writing about a refund of Rs 4,200 for order\n88214, cancelled on 3 September. Three chase emails\n(9, 16 and 24 September) have not had a reply.\n\nWhat I am asking for: the refund processed, and\nconfirmation of the date it will reach my account.\n\nI have attached the cancellation confirmation and the\nthree emails. If this is not the right department, I\nwould be grateful if you could tell me which is.", w: "Facts with dates, a reference number, evidence attached, and — the decisive element — an explicit remedy. It is now a task somebody can complete rather than a feeling somebody must absorb." }
        }
      },

      { trap: "Anger is the least effective register in a complaint, and it is counter-intuitive. Complaints handlers deal with anger all day and have procedures for absorbing it. What they have no defence against is a **calm, dated, evidenced request with a specific remedy**, because it cannot be deflected — there is nothing to de-escalate and something concrete to do. Write the angry draft, then send the calm one." },

      { h: "Escalation" },

      {
        l: [
          "**Escalate on time, not on temper.** Say in the first letter what happens next: *if I do not hear by 30 September, I will raise it with the ombudsman*. Then do it, on that date, without drama.",
          "**Go one level up, not four.** Writing to the chief executive about a refund gets forwarded back down with a note, which is slower than the correct route.",
          "**Attach the history and keep the tone identical.** The escalation should read exactly like the original letter, plus a paragraph of chronology.",
          "**Never disparage the person you dealt with.** Describe what happened and let the reader draw the conclusion. It is more damning and it costs you nothing."
        ]
      },

      { h: "Resignation" },

      { p: "A resignation letter has exactly one job: **create an unambiguous record of your last working day.** It is a legal and administrative document, it goes in a file, and it is not the place for grievance, for feedback, or for the reasons." },

      {
        code: {
          lang: "text",
          t: "Six lines is a complete resignation",
          lines: [
            { c: "Dear Sam,", w: "" },
            { c: "", w: "" },
            { c: "I am writing to resign from my position as Backend Engineer at", w: "**The statement of resignation**, with the role named." },
            { c: "Meridian. In line with my three-month notice period, my last", w: "" },
            { c: "working day will be Friday 12 December 2026.", w: "**The date.** The operative content of the whole letter. Compute it from the notice period and state it explicitly.", hi: true },
            { c: "", w: "" },
            { c: "I am grateful for the last three years, particularly the chance", w: "**One line of thanks.** Genuine, brief, and no more than this." },
            { c: "to take the payments platform end to end.", w: "" },
            { c: "", w: "" },
            { c: "I will make sure the migration is documented and handed over", w: "**The handover offer.** What people actually remember about a departure." },
            { c: "before I go. Happy to help however is most useful.", w: "" },
            { c: "", w: "" },
            { c: "Yours sincerely,\nAryan Sharma", w: "" }
          ],
          after: "Everything else — the reasons, the frustrations, the offer, the counter-offer — belongs in the conversation you have with your manager before this letter is sent, and never in the letter."
        }
      },

      { n: "Tell your manager in person or on a call **before** the letter arrives. The letter is the record of a conversation that has already happened. A manager who learns of a resignation from an email is embarrassed in front of their own manager, and that is the version people remember for a long time in an industry where you will meet them again.", nt: "The order that matters most" },

      { h: "The packaging nobody teaches" },

      {
        tbl: {
          t: "The details that decide whether it is processed or bounced",
          h: ["Detail", "Do this"],
          rows: [
            ["**File names**", "`Aryan-Sharma-Resume.pdf`, not `resume_final_v3(2).pdf`. It is read by a human and sorted by a machine"],
            ["**Format**", "PDF, always, unless they explicitly ask for something else. Formatting survives and it cannot be edited in transit"],
            ["**Size**", "Under 5 MB in total. Scanned documents are the usual culprit; compress them"],
            ["**Attachments named in the body**", "*I have attached my transcript and my identity card* — so the recipient can tell if something is missing"],
            ["**One thread per matter**", "Reply on the same thread when you follow up. A new thread loses the history and starts the clock again"],
            ["**Your email address**", "firstname.lastname. Not a nickname, not a birth year, not a college address that expires in June"],
            ["**Send during working hours**", "It is a small signal, it costs nothing to schedule, and 3 a.m. timestamps are noticed"]
          ]
        }
      },

      {
        tryit: {
          t: "The decisive element",
          task: "For each of these, name the one element that decides it: a request to attend a conference; a letter about a misspelled name on a certificate; a note to your manager that you are leaving in two months.",
          hint: "Each of the five has one. Two of these are the same category.",
          sol: { lang: "text", code: "Conference     Permission, so the rule or the precedent, plus\n               the cost stated precisely and a smaller\n               version offered.\n\nMisspelled     Correction, so the evidence: the document\nname           showing the error and the document showing the\n               correct spelling, both attached and both named.\n\nLeaving        Resignation, so the date. Computed from the\n               notice period, stated explicitly, and said out\n               loud to your manager before the letter is sent." },
          w: "Knowing which of the five you are writing tells you what the letter is actually for. Most failed applications are the right words attached to the wrong decisive element."
        }
      }
    ],
    k: [
      "Leave is decided by the cover, permission by the rule, correction by the evidence, complaint by the remedy, resignation by the date.",
      "A complaint that states a specific remedy cannot be deflected. Anger can.",
      "Escalate on a date you announced, one level up, with the tone unchanged.",
      "A resignation letter records the last working day. The reasons belong in the conversation that precedes it.",
      "PDF, named properly, under 5 MB, attachments named in the body, same thread for follow-ups."
    ],
    r: ["Documentation"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Cover: Priya has agreed to take the payments on-call while I am away.", w: "the line that turns a leave request into an approval" },
        { c: "What I am asking for: the refund processed, and confirmation of the date.", w: "the explicit remedy that makes a complaint actionable" },
        { c: "In line with my three-month notice period, my last working day will be Friday 12 December.", w: "the operative sentence of a resignation letter" }
      ]
    }
  }

]);
