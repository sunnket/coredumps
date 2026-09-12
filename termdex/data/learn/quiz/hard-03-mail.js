/* Mail and application writing — the hardcore set.

   These are the errors that get an application processed slowly, filed
   wrongly, or bounced back on form — which is a different and more
   expensive failure than merely writing badly, because nobody tells you it
   happened. */

TD.addMCQ("english", "mail", [

  {
    tag: "Salutations", lvl: "hardcore",
    q: "A letter opens *Dear Sir or Madam,*. In British usage it must close:",
    o: ["Yours faithfully,", "Yours sincerely,", "Yours truly,", "Sincerely yours,"],
    a: 0,
    x: "The pair is fixed: an **unnamed** recipient takes *Yours faithfully*, a **named** one takes *Yours sincerely*. Mismatching them is a genuine error rather than a stylistic choice.",
    steps: [
      "*Dear Sir or Madam* means you do not know the recipient's name.",
      "British convention pairs that with **Yours faithfully**.",
      "*Yours sincerely* would be correct only after *Dear Ms Sharma*."
    ],
    note: "American usage collapses the distinction and uses *Sincerely* for both, usually after a colon rather than a comma. Pick one convention and stay inside it; the error is mixing them."
  },

  {
    tag: "Salutations", lvl: "hardcore",
    q: "You know the recipient is called Priya Sharma and holds a doctorate. Which salutation is correct?",
    o: ["Dear Dr Sharma,", "Dear Priya Sharma,", "Dear Dr Priya Sharma,", "Respected Dr Sharma,"],
    a: 0,
    x: "A formal salutation takes **title plus surname**. The full name is not used in any register, and *Respected* is a South Asian institutional convention that reads as dated elsewhere.",
    steps: [
      "Title and surname: *Dear Dr Sharma*.",
      "First name alone is correct once the relationship is informal: *Dear Priya*.",
      "*Dear Priya Sharma* belongs to neither register and reads as a mail merge."
    ],
    note: "If you cannot tell gender or preferred title from a name — which is common across languages — use the full name without a title (*Dear Priya Sharma*) rather than guessing *Mr* or *Ms*. That is the one situation where the full name is the right call."
  },

  {
    tag: "Dates", lvl: "hardcore",
    q: "You are writing to an organisation in another country. Which date format is safest?",
    o: ["4 September 2026", "04/09/2026", "09/04/2026", "04-09-26"],
    a: 0,
    x: "Spelling the month out removes the ambiguity entirely. *04/09/2026* is 4 September in most of the world and 9 April in the United States, and nothing in the string tells the reader which.",
    steps: [
      "Day-month-year is the dominant international order; month-day-year is standard in the US.",
      "Any all-numeric date is therefore ambiguous across that boundary.",
      "Writing the month as a word makes the date unreadable in only one way."
    ],
    note: "The ISO format 2026-09-04 is equally unambiguous and is the right choice in file names, logs and databases. In prose, the spelled-out month reads better and is understood by every reader."
  },

  {
    tag: "Subject lines", lvl: "hardcore",
    q: "You are applying for a role you were referred to by a current employee. The strongest subject line is:",
    o: [
      "Referred by Priya Nair — Backend Engineer — Aryan Sharma",
      "Job application",
      "Application for the Backend Engineer position at your esteemed organisation",
      "Backend Engineer — Aryan Sharma — 4 years experience — immediate joiner"
    ],
    a: 0,
    x: "The referrer's name is the single most valuable piece of information in the line, so it goes first. Then the role, so it can be routed, then you.",
    steps: [
      "A referral changes how the email is triaged more than anything else about it.",
      "Front-loading it means the value survives a truncated subject line on a phone.",
      "*Job application* is unroutable, and the long version buries the role behind sales language."
    ],
    note: "Subject lines are truncated at roughly 40 to 60 characters in most inbox views. Whatever matters most has to be inside that window, which is an argument against every subject line that opens with *Application for the position of*."
  },

  {
    tag: "Cover letters", lvl: "hardcore",
    q: "What is the clearest sign that a cover letter is not doing its job?",
    o: [
      "It would still be true if you changed the company name",
      "It is shorter than one page",
      "It repeats one achievement that is also on the resume",
      "It names the specific team you want to join"
    ],
    a: 0,
    x: "The cover letter exists to answer what the resume structurally cannot: **why this company**. If swapping the name leaves a true letter, that question has not been answered.",
    steps: [
      "A resume is identical across every application; a cover letter is the part that is not.",
      "The competitor-substitution test is the fastest check available.",
      "Being short, or expanding on a resume achievement, are both fine — good letters usually do both."
    ],
    note: "This is why six tailored applications beat sixty templated ones. The templated version is filtered at a rate that makes the volume worthless, and the filtering is often done by a person in about eight seconds."
  },

  {
    tag: "Cold email", lvl: "hardcore",
    q: "You are cold-emailing an engineer at a company you would like to join. Which ask is most likely to get a reply?",
    o: [
      "Would you be open to fifteen minutes to tell me what the team is working on?",
      "Could you refer me for the Backend Engineer role?",
      "Please find my resume attached and let me know if there is a fit.",
      "I am reaching out regarding opportunities at your organisation."
    ],
    a: 0,
    x: "A stranger can grant fifteen minutes of information at almost no cost to themselves. A referral puts their own credibility behind somebody they have never seen work, which is a much larger ask to open with.",
    steps: [
      "Cold outreach succeeds when the ask is proportionate to the relationship, which is currently nothing.",
      "Information costs the sender little and is easy to say yes to.",
      "A referral is often the *outcome* of the conversation, and asking for it first usually prevents the conversation."
    ],
    note: "The second half of the technique is the opening line: something specific about their work, not about your search. If the first sentence could have been sent to two hundred people, the ask barely matters."
  },

  {
    tag: "Follow-up", lvl: "hardcore",
    q: "You applied ten days ago and have heard nothing. The best next step is:",
    o: [
      "One short follow-up on the original thread",
      "A new email to the same recruiter, plus a LinkedIn message",
      "Reply-all to the automated acknowledgement",
      "Wait another month before doing anything"
    ],
    a: 0,
    x: "One short note, on the **same thread** so the history travels with it, is persistence. Multi-channel contact on the same day reads as pressure, and an automated acknowledgement usually goes to an unmonitored address.",
    steps: [
      "A week to ten days is a reasonable interval for a first follow-up.",
      "Same thread keeps your application attached to the message.",
      "Two follow-ups total is the normal ceiling; beyond that you are building a reputation rather than a case."
    ],
    note: "The single exception is a deadline you were given. If they said *we will come back to you by the 15th* and the 15th has passed, a note asking about **timelines** rather than about the decision is entirely reasonable and easy for them to answer."
  },

  {
    tag: "Interview follow-up", lvl: "hardcore",
    q: "Which post-interview thank-you note is most likely to change the outcome?",
    o: [
      "One that names a specific question and adds the answer you wished you had given",
      "One that thanks the panel warmly for their time and reiterates your enthusiasm",
      "One that summarises your whole background again",
      "One that asks when you can expect to hear back"
    ],
    a: 0,
    x: "It gives the panel new information at the moment they are deciding. The others are polite and carry nothing they did not already have.",
    steps: [
      "A generic thank-you is expected, and therefore changes nothing when it arrives.",
      "Returning to a question you handled poorly shows both self-awareness and the answer.",
      "It also gives whoever advocates for you internally something concrete to quote."
    ],
    note: "Keep it to three or four sentences and send it within a day. The value is entirely in the one substantive paragraph; the gratitude is the wrapper, not the content."
  },

  {
    tag: "Leave", lvl: "hardcore",
    q: "Which element does most to get a leave request approved without a follow-up question?",
    o: [
      "Naming who is covering your work, having already agreed it with them",
      "Explaining in detail why you need the leave",
      "Apologising for the inconvenience",
      "Offering to remain reachable throughout"
    ],
    a: 0,
    x: "The approver's actual question is *what breaks while you are gone*. Answering it before it is asked converts a conversation into an approval.",
    steps: [
      "The reason for leave is generally not the approver's business and rarely affects the decision.",
      "Offering to stay reachable undermines the leave and sets an expectation for next time.",
      "The cover — named, and already agreed — is the only element that resolves the approver's real concern."
    ],
    note: "The student equivalent is the same idea: say what you will do about the work you miss. *I will submit the assignment before I go and have arranged notes for the lectures* answers the question the letter would otherwise generate."
  },

  {
    tag: "Complaints", lvl: "hardcore",
    q: "Which element most improves the chance that a written complaint is actually resolved?",
    o: [
      "Stating the specific remedy you want",
      "Describing how the failure made you feel",
      "Making clear that this is your final warning",
      "Copying several senior people at the outset"
    ],
    a: 0,
    x: "A complaint without a stated remedy is a feeling, and a feeling can only be acknowledged. A named remedy is a task somebody can complete and close.",
    steps: [
      "Complaints teams handle emotion routinely and have procedures for absorbing it.",
      "They have no procedure for a calm, dated, evidenced request with one specific ask.",
      "Copying seniors at the start removes your escalation route before you have used the normal one."
    ],
    note: "Write the angry version if it helps, then send the calm one. Facts with dates, evidence attached, and one sentence beginning *what I am asking for is* — that shape is very hard to deflect."
  },

  {
    tag: "Escalation", lvl: "hardcore",
    q: "Your third email about an unresolved refund has gone unanswered. The most effective escalation is:",
    o: [
      "One level up, with the full chronology attached and the tone unchanged",
      "To the chief executive, marked urgent",
      "A public post tagging the company",
      "The same email again, in capitals"
    ],
    a: 0,
    x: "Going one level up keeps the matter inside the process that can actually resolve it. Jumping to the top gets forwarded back down with a delay attached; changing tone gives them something to react to other than the facts.",
    steps: [
      "Escalation works by reaching somebody with more authority who is still close enough to act.",
      "The chief executive's office routes it back to the same team, several days later.",
      "Keeping the tone identical makes the chronology the loudest thing in the email, which is what you want."
    ],
    note: "Say in the first letter what will happen next and when — *if I do not hear by 30 September I will raise it with the ombudsman* — and then do exactly that on that date. An escalation you announced in advance is a process; one that arrives out of temper is a complaint about a complaint."
  },

  {
    tag: "Resignation", lvl: "hardcore",
    q: "What is the essential content of a resignation letter?",
    o: [
      "An unambiguous statement of your last working day",
      "A clear account of why you are leaving",
      "Feedback on what the company could improve",
      "Confirmation that you will not join a competitor"
    ],
    a: 0,
    x: "The letter is an administrative record and it exists to fix one fact: **the date**. Everything else belongs in the conversation, the exit interview, or nowhere.",
    steps: [
      "The date drives notice period, handover, payroll and the replacement search.",
      "Reasons and feedback are far better delivered in person, where tone and context survive.",
      "Anything written into the letter goes into a permanent file that people you have not met will read."
    ],
    note: "Order matters as much as content: tell your manager in person or on a call **before** the letter arrives. A manager who learns of a resignation from an email is embarrassed in front of their own manager, and that is what gets remembered."
  },

  {
    tag: "Corrections", lvl: "hardcore",
    q: "You are writing to have your name corrected on a certificate. Which element decides whether the request succeeds first time?",
    o: [
      "Both documents attached: one showing the error, one showing the correct spelling",
      "A polite and apologetic tone",
      "An explanation of how the error inconvenienced you",
      "A request to speak to somebody on the phone"
    ],
    a: 0,
    x: "A correction is a pure evidence transaction. The clerk cannot change a record on your assertion; they need a document that establishes the correct value.",
    steps: [
      "Attach the incorrect certificate, so they can identify the record.",
      "Attach an authoritative document with the correct spelling — a passport, an identity card, an earlier certificate.",
      "Name both attachments in the body, so a missing one is detectable."
    ],
    note: "Include every identifier you have — roll number, certificate serial, date of issue, application number. The bottleneck in institutional correspondence is almost always locating the record, not deciding on it."
  },

  {
    tag: "Packaging", lvl: "hardcore",
    q: "Which of these most often causes an application to be delayed or bounced back on process rather than on merit?",
    o: [
      "Attachments referred to in the body but not actually attached, or unnamed",
      "A cover letter slightly over one page",
      "Sending the email in the evening",
      "Using a serif font in the resume"
    ],
    a: 0,
    x: "A missing or unidentifiable attachment stops the process dead, and the reply comes days later if it comes at all. Naming each attachment in the body lets both sides detect the problem immediately.",
    steps: [
      "*Please find attached my transcript and identity card* lets the reader check that two files arrived.",
      "*Please find attached the required documents* does not.",
      "File names matter for the same reason: `Aryan-Sharma-Transcript.pdf` survives being saved into a folder of two hundred applications."
    ],
    note: "PDF unless told otherwise, under about 5 MB in total, and named with your own name. These are unglamorous and they are the difference between an application that is processed and one that generates an exchange."
  },

  {
    tag: "Fields", lvl: "hardcore",
    q: "You are chasing an overdue deliverable from a colleague and decide to copy their manager. What have you actually done?",
    o: [
      "Escalated — whether or not you intended to",
      "Kept the manager informed, which is neutral",
      "Made the request more likely to be met without any social cost",
      "Nothing, since cc is not the same as to"
    ],
    a: 0,
    x: "Adding a manager to a chase is read as escalation by essentially everybody, regardless of intent. It is sometimes the right move; it is never a neutral one.",
    steps: [
      "The cc field carries meaning beyond information: it says who is now watching.",
      "On a chase, that reads as *I am creating a record and involving your manager*.",
      "Intent is invisible; only the field is visible."
    ],
    note: "If a manager genuinely needs the context, say so in the body — *copying Sam so he has the timeline* — which converts an implied escalation into a stated reason. And if you do intend to escalate, telling the person first costs you nothing and keeps the relationship."
  }

]);
