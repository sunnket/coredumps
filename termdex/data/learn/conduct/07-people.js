/* Professional Presence — people, boundaries and politics. */
TD.addLessons("conduct", [

  {
    t: "Credit, Feedback and the Politics You Cannot Opt Out Of",
    m: "people",
    lvl: "advanced",
    s: "How credit actually moves, how to take and give feedback without either of you losing face, and why refusing to engage in office politics is itself a political position with costs.",
    goal: [
      "Claim credit for your own work without it reading as self-promotion",
      "Receive critical feedback in a way that makes people willing to give you more",
      "Handle gossip, escalation and the situations where the fair move and the safe move differ"
    ],
    b: [
      { p: "Most engineers have a version of the belief that good work speaks for itself. It does not, and the reason is not conspiracy: **nobody has the information you have about what you did.** Your manager sees outputs and a calendar. Your skip-level sees a summary. The people deciding on your promotion see whatever was written down by somebody else, months ago." },

      { p: "This lesson is about the layer that fills that gap. It is not about being political in the derogatory sense. Refusing to engage with it at all is also a choice, and its cost is paid quietly by people who deserved better." },

      { h: "Credit" },

      {
        tbl: {
          t: "How to be visible without being insufferable",
          h: ["Do", "Because"],
          rows: [
            ["**Report outcomes, not activity**", "*Cut checkout latency 40%* is a fact about the business. *Refactored the payment service* is a fact about your week"],
            ["**Say *we* for the team and *I* for your specific part**", "*We shipped the migration; I did the dual-write and the cutover.* Both true, both necessary"],
            ["**Keep a running note of what you did, weekly**", "Because at review time you will remember six weeks and forget forty-six. This one habit is worth more than any phrasing"],
            ["**Name other people specifically and often**", "Credit given generously comes back. Vague thanks to *the team* does not, and is noticed for what it is"],
            ["**Answer *what have you been working on* with a headline**", "Not a list. One sentence about the outcome, then detail if they want it"]
          ]
        }
      },

      { h: "When somebody takes credit for your work" },

      { p: "Usually it is not malice — it is somebody summarising a project they were part of and rounding themselves up. The response depends entirely on frequency." },

      {
        ol: [
          "**Once, in a meeting: add rather than contest.** *Yes — and the dual-write part was the tricky bit, happy to go into it.* You have put your name on the record without creating a scene, and everybody in the room has now heard it.",
          "**Repeatedly: raise it directly with the person, once, privately.** *When you presented the migration, it came across as your work. I would like the split to be clearer next time.* Specific, unemotional, and about the future rather than the grievance.",
          "**Still repeatedly, after that: raise it with your manager**, with examples and dates, framed as a visibility problem rather than a character accusation. That framing is what makes it actionable rather than awkward.",
          "**Meanwhile, write things down where they are visible.** A design doc with your name on it, a demo you ran, a postmortem you wrote. Documented work is much harder to absorb."
        ]
      },

      { h: "Taking feedback" },

      { p: "The reaction to critical feedback in the first ten seconds determines whether that person ever gives you any again. Most people defend — reflexively, reasonably, and fatally — and then wonder why nobody tells them anything." },

      {
        vs: {
          t: "The first ten seconds",
          bad: { label: "The reflex", c: "\"Right, but the reason it was structured that way\nwas that the original ticket said to keep the old\ninterface, and I did raise it at the time, and\nanyway Priya reviewed it and did not flag it.\"", w: "Every fact here may be true and it does not matter. What the other person hears is that giving you feedback costs them an argument, so they will not do it again." },
          good: { label: "The version that gets you more", c: "\"That is useful — let me make sure I have it.\nYou are saying the interface should have changed\nwith the migration rather than being kept for\ncompatibility. Is that the main thing, or is\nthere something under it?\"", w: "Acknowledge, restate to check, then ask for the thing beneath the thing. You have conceded nothing and you now have the real feedback rather than the polite version of it." }
        }
      },

      {
        l: [
          "**Thank them, and mean the thanks.** Critical feedback is effortful and slightly unpleasant to give. Most people avoid it.",
          "**Restate it before responding.** Half of all feedback disputes are two people arguing about different things.",
          "**Ask for the thing underneath.** The first piece of feedback is usually the safest one they had.",
          "**Take a day before disagreeing.** You can always come back. You cannot un-defend.",
          "**Close the loop later.** *I changed the interface — thanks for pushing on that.* This is what makes somebody give you feedback a second time."
        ]
      },

      { h: "Giving it" },

      { p: "Ask first — *is now a good time for a piece of feedback?* — then be specific about the behaviour, its effect, and what you would like instead. Praise can be public; criticism is private, always, and one-to-one. Criticising somebody in a channel is a thing people remember for years, and it is almost never worth whatever it was about." },

      { h: "Gossip, and the line" },

      {
        tbl: {
          t: "Where the line actually is",
          h: ["This is fine", "This is not"],
          rows: [
            ["Discussing a decision you disagree with", "Discussing the competence of the person who made it"],
            ["Warning a friend that a team is under pressure", "Repeating what somebody said in confidence"],
            ["Asking a colleague how to handle a manager", "Asking a colleague to take your side against one"],
            ["Saying you found something frustrating", "Saying it to six people rather than to the one person who could fix it"]
          ]
        }
      },

      { trap: "The single most reliable rule here: **assume everything you write is screenshotted and everything you say is repeated.** Not because your colleagues are untrustworthy, but because messages get forwarded for innocent reasons, channels get archived, people change teams, and a joke about a manager lands in front of that manager two years later with none of the context that made it a joke. This is not paranoia; it is simply how information behaves." },

      { h: "Managing up" },

      {
        l: [
          "**Find out how your manager wants to receive information** — written or verbal, detail or headline, weekly or on demand — and then deliver it that way. This costs one conversation and pays out for years.",
          "**Bring problems with an attempt attached.** Not a solution necessarily, but a *here is what I think we could do* rather than an open problem handed over whole.",
          "**Never let them be surprised in public.** A manager finding out about your slipped date in a meeting with their own boss is the one unforgivable version of the reliability lesson.",
          "**Ask what they are measured on.** Not manipulatively — you are trying to make their job easier, and knowing what pressure they are under explains most of what they ask you for."
        ]
      }
    ],
    k: [
      "Good work does not speak for itself, because nobody else has the information you have about it.",
      "Outcomes rather than activity. *We* for the team, *I* for your specific part.",
      "Credit taken once: add to it in the room. Repeatedly: raise it privately, then with your manager, with dates.",
      "Defending in the first ten seconds is why people stop giving you feedback. Acknowledge, restate, ask for what is underneath.",
      "Assume everything written is screenshotted and everything said is repeated. It is how information behaves, not paranoia."
    ],
    r: ["Code Review", "Retrospective"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "That is useful — let me make sure I have it. You are saying the interface should have changed with the migration?", w: "receiving critical feedback: acknowledge, then restate to check" },
        { c: "Yes — and the dual-write part was the tricky bit, happy to go into it.", w: "adding your name to the record without contesting it in the room" },
        { c: "We shipped the migration; I did the dual-write and the cutover.", w: "we for the team, I for your specific part" }
      ]
    }
  },

  {
    t: "Boundaries, Burnout and Presence When Nobody Can See You",
    m: "people",
    lvl: "intermediate",
    s: "Saying no upwards, the boundaries that actually hold, and how to be visible and trusted on a team that has never met you in person.",
    goal: [
      "Decline or renegotiate work without damaging the relationship",
      "Set boundaries that survive contact with a busy week",
      "Be as present on a remote team as somebody sitting in the office"
    ],
    b: [
      { p: "The two things in this lesson are connected. Boundaries fail most often for people who are not physically visible, because the compensating instinct is to be always available — and always available is not a boundary, it is the absence of one." },

      { h: "Saying no, upwards" },

      { p: "A flat no is rarely available and rarely necessary. What works is making the **trade-off visible** and handing the decision back to the person who owns the priorities, which is usually not you." },

      {
        tbl: {
          t: "The four shapes",
          h: ["Shape", "Sounds like"],
          rows: [
            ["**The trade**", "*I can do that this week if the reporting work moves to next. Which would you rather have?*"],
            ["**The date**", "*I can take it, but the earliest I could start is Monday. Does that work, or does it need somebody else?*"],
            ["**The scope**", "*I cannot do the whole thing by Friday. I could get the API done and leave the UI for next week.*"],
            ["**The honest no**", "*I do not think I am the right person for this — I have never worked on that system. Sam would be much faster.*"]
          ]
        }
      },

      { n: "Notice that all four end with a question or an alternative. That is what stops a no from being a wall: you have not refused, you have handed back a decision that was always theirs, with the information they needed to make it. Managers overwhelmingly prefer this to a yes that quietly fails in ten days.", nt: "Why these work" },

      { h: "Boundaries that hold" },

      {
        l: [
          "**A boundary is a behaviour, not an announcement.** Saying you do not check email after seven and then answering at nine has taught everybody the real rule, and it is the one they will use.",
          "**Make the exception explicit when you make it.** *I am picking this up tonight because it is an incident; normally I would look at it in the morning.* This preserves the boundary while breaking it.",
          "**Schedule-send anything you write outside hours.** Writing at midnight is your business; a message arriving at midnight sets an expectation for everybody who receives it, especially anybody junior to you.",
          "**Say the boundary once, plainly, and early in a relationship.** *I do not work weekends unless it is an incident.* Said in week one, it is a fact. Said in month eight, in the middle of a weekend request, it is a conflict.",
          "**Take the leave.** Unused holiday is not loyalty and nobody is impressed by it. Teams that cannot survive one person taking two weeks have a problem that your not taking them is concealing."
        ]
      },

      { trap: "The warning signs of burnout are not dramatic and that is the problem. They are: dreading specific meetings, cynicism about work you used to care about, small tasks taking far longer than they should, and irritability that spills outside work. It does not arrive as a collapse; it arrives as a slow narrowing. **If two of those have been true for a month, it is not a bad patch.** Talk to somebody — a manager, a doctor, anybody — rather than deciding to try harder, which is the response that made it worse in the first place." },

      { h: "Presence at a distance" },

      { p: "On a remote team, everything the earlier lessons relied on is gone: no corridor, no lunch, no reading the room, no being seen working. Presence has to be produced deliberately, and the mechanism is different — it is almost entirely **written and predictable**." },

      {
        tbl: {
          t: "What replaces what",
          h: ["In an office", "Remote equivalent"],
          rows: [
            ["Being seen at your desk", "A brief, regular written update. Predictability is what reads as reliability at a distance"],
            ["Overhearing a problem", "Working in public channels rather than direct messages, so context is visible to people who need it"],
            ["A quick desk-side question", "A short call offered explicitly: *this is faster to talk through, two minutes?*"],
            ["Corridor relationships", "Deliberate non-work contact. A fifteen-minute call with no agenda, occasionally, with people you only ever see in meetings"],
            ["Reading the room", "Asking directly, because you cannot. *How did that land?* is a question you now have to say out loud"],
            ["Going home", "An explicit end: a message, a status, a closed laptop. Without it the day has no edge and neither do you"]
          ]
        }
      },

      { n: "The single highest-return remote habit is **writing things down where other people can find them**. A decision in a document, a design in a page, a summary in a channel. In an office, undocumented context still circulates by proximity; remotely, it simply does not exist for anybody who was not in the call. Written work is also the only form of work that is visible without you being present, which is why remote careers reward writing so heavily.", nt: "If you do one thing" },

      {
        tryit: {
          t: "Say the no four ways",
          task: "Your manager asks you to take on a code review backlog this week. You are mid-migration and it will cost you two days. Write the request declined as a trade, as a date, as a scope, and as an honest no.",
          hint: "Every one ends with a question or an alternative.",
          sol: { lang: "text", code: "Trade   I can clear the review backlog this week if the\n        migration cutover moves to next Wednesday. Which\n        matters more to you?\n\nDate    I can take the backlog, but not before Thursday --\n        the cutover is Tuesday. Does Thursday work?\n\nScope   I can do the six oldest reviews this week rather\n        than all nineteen. Would that unblock people?\n\nNo      I do not think I should take this one -- I am the\n        only person on the cutover and it is Tuesday. Could\n        Priya take the backlog this week?" },
          w: "All four are cooperative, none is a yes, and each hands back a decision that belongs to the person with the priorities. That is the entire technique."
        }
      }
    ],
    k: [
      "Do not refuse — make the trade-off visible and hand the decision back. Trade, date, scope, or an honest no.",
      "A boundary is a behaviour. Announcing one and breaking it teaches people the real rule.",
      "Schedule-send out-of-hours messages. Your working pattern should not become somebody else's expectation.",
      "Burnout arrives as dread, cynicism, slowness and irritability. Two of them for a month is not a bad patch.",
      "Remote presence is written and predictable. If you do one thing, write things down where people can find them."
    ],
    r: ["Documentation", "Code Review"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "I can do that this week if the reporting work moves to next. Which would you rather have?", w: "declining by trade, handing the priority decision back" },
        { c: "I am picking this up tonight because it is an incident; normally I would look in the morning.", w: "breaking a boundary while explicitly preserving it" },
        { c: "This is faster to talk through — two minutes?", w: "the remote replacement for a desk-side question" }
      ]
    }
  }

]);
