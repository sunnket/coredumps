/* Professional Presence — time, reliability and reputation. */
TD.addLessons("conduct", [

  {
    t: "Punctuality and the Reliability Ledger",
    m: "time",
    lvl: "core",
    s: "Why lateness costs more than it looks like it does, how commitments are actually tracked, and the four sentences that keep a reputation intact when a date is going to slip.",
    goal: [
      "Arrive on time reliably, by fixing the planning error rather than trying harder",
      "Make commitments you can keep, and renegotiate the ones you cannot",
      "Give a status update that keeps trust rather than spending it"
    ],
    b: [
      { p: "Reliability is the cheapest reputation available and the one most engineers underrate, because it does not feel like a skill. It is also the one thing on which people form an opinion of you within a fortnight and revise very slowly afterwards." },

      { h: "Lateness is arithmetic, not character" },

      { p: "Ten minutes late to a meeting of six people does not cost ten minutes. It costs sixty — plus the restart cost, plus whatever was being discussed having to be repeated. People feel this even when they cannot name it, which is why habitual lateness has an effect on standing so far out of proportion to the minutes involved." },

      { p: "The useful part is that chronic lateness is almost never a discipline problem. It is a **planning error**, and it is always one of three:" },

      {
        ol: [
          "**Planning for the median rather than the tail.** The journey takes twenty-five minutes *usually*. You are budgeting for the good day and meeting the bad one twice a month.",
          "**Forgetting the edges.** The walk from the car park, the lift, reception, finding the room. Ten to fifteen minutes that exist on every trip and appear in nobody's estimate.",
          "**Back-to-back scheduling.** A meeting ending at 3:00 and one starting at 3:00 means you are late to the second one by construction, and this is a calendar problem rather than a you problem."
        ]
      },

      {
        vs: {
          t: "Two ways to plan the same trip",
          bad: { label: "How it usually goes", c: "Meeting at 10:00.\nJourney is about 25 minutes.\nLeave at 9:35.\nArrive 10:04 roughly half the time.", w: "Budgets the median journey and nothing else. There is no slack, so every variance becomes lateness — and the variance is not rare, it is most days." },
          good: { label: "The version that works", c: "Meeting at 10:00.\nJourney is 25 median, 40 on a bad day.\nBuilding entry and finding the room: 10.\nLeave at 9:05. Arrive 9:50.\nRead something for ten minutes.", w: "Budgets the tail and the edges, and gives the spare time a job so it does not feel wasted. The ten minutes of reading is what makes this sustainable rather than annoying." }
        }
      },

      { n: "Set every recurring meeting to 25 or 50 minutes rather than 30 or 60. It gives everybody the transition time that back-to-back scheduling silently deletes, and it is the single highest-leverage calendar change a team can make.", nt: "The five-minute fix" },

      { h: "The ledger" },

      { p: "Everybody you work with keeps an informal record of whether you do what you said you would. Nobody writes it down and everybody consults it — when work is being handed out, when somebody is deciding whom to ask for help, and when your name comes up in a promotion conversation you are not in." },

      { p: "The entries are small: a file you said you would send, a review you said you would do by Thursday, a bug you said you would look at. What builds a strong ledger is not heroics; it is **not making commitments you cannot keep**, and **saying so early** when one is going to fail." },

      {
        tbl: {
          t: "The four sentences",
          h: ["Situation", "Say", "Rather than"],
          rows: [
            ["**You are being asked for a date you are not sure about**", "*Let me look at it properly and come back to you by end of day with a date.*", "A number you invented in the meeting to avoid the silence"],
            ["**You are going to be late by a day or two**", "*This is going to land Thursday rather than Tuesday. Nothing is blocked by it, but tell me if that is a problem.*", "Silence, then delivering late, then explaining"],
            ["**You are going to be late by a lot**", "*I have underestimated this. Here is where it actually is, here is what I now think, and here is what we could cut.*", "A series of small slips, each announced at the last moment"],
            ["**You cannot take it on at all**", "*I cannot get to that this week without dropping X. Which would you rather have?*", "Saying yes and quietly delivering neither"]
          ]
        }
      },

      { trap: "The instinct when something is late is to wait, on the theory that you might still recover it and avoid the awkward conversation. This is exactly backwards. **Early bad news is information, which people can use. Late bad news is a problem, which they cannot.** The same slip announced on Monday and announced on Friday afternoon have completely different effects on your standing, and the difference is entirely about what the other person could still have done about it." },

      { h: "The status update that keeps trust" },

      {
        code: {
          lang: "text",
          t: "Four lines, in this order",
          lines: [
            { c: "Payments migration - week 3 of 4 - on track", w: "**Headline first.** The one thing a busy reader takes away. Three states only: on track, at risk, slipped." },
            { c: "", w: "" },
            { c: "Done: read path migrated, dual-write running since Tuesday.", w: "**What actually moved**, not what you did. Activity is not progress and experienced readers tell them apart instantly." },
            { c: "Next: cut over the write path Thursday.", w: "**The next concrete thing**, with a date on it." },
            { c: "Risk: the backfill is slower than estimated. If it is still", w: "**The risk, named before anybody asks.** This is the line that builds trust, because volunteering a risk is the opposite of being caught with one.", hi: true },
            { c: "      behind on Wednesday I will come back with a revised date.", w: "And the trigger and the date at which you will report again — so nobody has to chase you." },
            { c: "Needs: nothing from you this week.", w: "**What you need**, explicitly, including when the answer is nothing. It saves the reader from wondering." }
          ],
          after: "Under sixty words, and it answers every question a manager would otherwise ask in a meeting."
        }
      },

      {
        tryit: {
          t: "Audit one week",
          task: "Look back over the last week and list every commitment you made with a date attached — in meetings, in chat, in passing. How many were met? How many did the other person have to chase?",
          hint: "Chat counts. *Yeah I will send that over* is a commitment with a date of *today* attached to it.",
          sol: { lang: "text", code: "Where the misses almost always are:\n\nNot the big deliverables      those have tracking and meetings\nThe small verbal ones         \"I will send you that link\"\n                              \"I will take a look this afternoon\"\n                              \"I will review it before I log off\"\n\nThose are the ledger. Everybody notices them, nobody\nmentions them, and they are the entire basis of whether you\nare thought of as reliable." },
          w: "The big things are usually fine because they are tracked by somebody else. Reputation is built almost entirely from the small verbal commitments that only you are tracking."
        }
      }
    ],
    k: [
      "Lateness multiplies by the number of people waiting, which is why it costs more standing than it seems to.",
      "Chronic lateness is a planning error: the median journey, the forgotten edges, or back-to-back scheduling.",
      "Everybody keeps a ledger of whether you do what you said. It is built from small verbal commitments.",
      "Early bad news is information. Late bad news is a problem. Same slip, completely different cost.",
      "Headline, what moved, what is next, what is at risk, what you need. Four lines, sixty words."
    ],
    r: ["Standup"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Let me look at it properly and come back to you by end of day with a date.", w: "the answer to a date you are not yet sure of" },
        { c: "I cannot get to that this week without dropping X. Which would you rather have?", w: "declining by making the trade-off visible instead of saying no" },
        { c: "This is going to land Thursday rather than Tuesday. Tell me if that is a problem.", w: "the early slip, announced before it is discovered" }
      ]
    }
  },

  {
    t: "Owning a Mistake Without Losing Standing",
    m: "time",
    lvl: "intermediate",
    s: "The four-part structure for taking responsibility, why blameless postmortems exist, and the specific phrases that make an apology land or quietly make it worse.",
    goal: [
      "Own a visible mistake in a way that increases rather than decreases trust",
      "Write an incident update that a stressed room can actually use",
      "Distinguish the apology that closes an issue from the one that extends it"
    ],
    b: [
      { p: "You will break something. Everybody who ships anything does, and the people whose careers survive it are not the ones who broke less — they are the ones who handled it in a specific way that is entirely learnable." },

      { h: "The four parts" },

      {
        ol: [
          "**Say it happened, plainly and early.** *I pushed a change at 14:20 that took checkout down.* No hedging, no passive voice, no *it appears that an issue may have occurred*.",
          "**Say what the impact is**, in the terms the listener cares about — users, orders, data, money, time. Not in terms of what broke technically.",
          "**Say what you are doing right now**, and when you will next report. *I am rolling back, I will update in ten minutes.* This is the part that lets everybody else stop panicking and go back to work.",
          "**Afterwards, say what changes.** Not *I will be more careful* — a specific mechanism. A test, a check, an alert, a step in the process. This is the part that converts a mistake into credibility."
        ]
      },

      {
        vs: {
          t: "The same incident, two ways",
          bad: { label: "The instinct", c: "Hi all, so it looks like there might be an issue with\ncheckout at the moment, we are seeing some errors, it\nmay be related to a deploy but we are not sure yet, the\npipeline has been a bit flaky this week and there was\nalso a config change from the infra side. Looking into\nit now, will update when we know more.", w: "Hedged, blame is being spread across three parties, and there is no time, no impact and no next update. It costs trust while looking like a status report." },
          good: { label: "The version that holds", c: "Checkout is down. My deploy at 14:20 caused it.\n\nImpact: no orders since 14:20, roughly 40 affected.\nDoing: rolling back now, ETA 5 minutes.\nNext update: 14:40 or when it is back, whichever\nis first.", w: "Owned, quantified, actioned, and time-boxed. Everybody who reads this knows exactly what is happening and whether they need to do anything, which is all an incident channel wants." }
        }
      },

      { n: "Note that the good version says *my deploy* even though the pipeline was flaky and there was a config change. Both of those may turn out to matter, and both belong in the postmortem. In the first ten minutes, naming a cause you can act on beats being technically complete — and taking it on yourself when it plausibly is yours is the single most credibility-building thing in this lesson.", nt: "Why owning it early is not a confession" },

      { h: "Blameless does not mean nobody is responsible" },

      { p: "The industry norm of the **blameless postmortem** is often misread. It does not mean pretending nobody did anything, and it does not mean nobody says *I did that*. It means the analysis targets the **system that allowed the mistake to reach production** rather than the person who made it — because in a healthy system, a single human error should not have been sufficient." },

      {
        tbl: {
          t: "Same fact, two framings",
          h: ["Blameful", "Blameless"],
          rows: [
            ["Aryan deployed without running the tests", "The deploy path allowed a push with no green build, and nothing warned"],
            ["Priya did not check the config", "The config had no validation and no staging step that would have caught it"],
            ["Somebody should have noticed", "There was no alert on the metric that moved first"]
          ]
        }
      },

      { p: "The right-hand column produces a fix. The left-hand column produces a person who will hide the next incident for two hours, which is how a small outage becomes a large one." },

      { h: "The apology, and the phrases that ruin it" },

      {
        tbl: {
          t: "What lands and what does not",
          h: ["Say", "Not"],
          rows: [
            ["*I am sorry — that was my mistake.*", "*I am sorry if anyone was affected.* — conditional, and therefore not an apology"],
            ["*I should have run the migration on staging first.*", "*Mistakes were made.* — the passive voice is famous for exactly this reason"],
            ["*Here is what I am changing so it does not recur.*", "*I will be more careful.* — an intention, not a mechanism, and everybody knows it"],
            ["*You are right, I dropped that.*", "*I was going to, but...* — the *but* deletes everything in front of it"],
            ["*Thanks for catching it.*", "*It was already on my list.* — even when true, it reads as defending rather than fixing"]
          ]
        }
      },

      { trap: "Over-apologising is its own failure and is more common among careful people than under-apologising. Apologising four times for the same thing, in four channels, across two days, turns a two-minute incident into an ongoing topic and quietly asks everybody else to reassure you. **Once, properly, to the people affected — then the fix.** That is the whole protocol." },

      { h: "When it was not your fault" },

      { p: "You will also be blamed for things you did not do. The response is the same shape and it is deliberately unexciting: **do not defend in the moment, establish the facts, correct it once, calmly, in the same place it was said.** *Just to correct one thing — the 14:20 deploy was the config change, not the service push. Happy to walk through the timeline.* No indignation, no counter-accusation. Then let it go. People who correct the record calmly and once are believed; people who litigate it are not, even when they are right." },

      {
        tryit: {
          t: "Rewrite one",
          task: "Take this and rewrite it using the four parts: *Hey, sorry, I think something might be wrong with the reporting job, it has not run since yesterday I think, might be my change from Friday or might be the upstream data, I will have a look.*",
          hint: "Plainly, impact, doing now, next update.",
          sol: { lang: "text", code: "The nightly reporting job has not run since Friday 23:00.\nMy change on Friday is the likely cause.\n\nImpact: Saturday and Sunday reports are missing. Nothing\ndownstream has failed yet; Monday morning dashboards will\nbe empty if this is not fixed by 07:00.\n\nDoing: reverting my change now and re-running for both days.\nNext update: within the hour, or sooner if it is not that." },
          w: "The rewrite is longer than the original, and that is correct. The original made the reader do all the work: what broke, since when, what it affects, whether they need to act. Every one of those is now answered."
        }
      }
    ],
    k: [
      "Say it happened, say the impact, say what you are doing and when you will report next. Then say what changes.",
      "Own the plausible cause early. Being technically complete is for the postmortem, not for minute three.",
      "Blameless means the analysis targets the system, not that nobody says *I did that*.",
      "*Sorry if anyone was affected* is not an apology, and *I will be more careful* is not a fix.",
      "Once, properly, then the mechanism. Over-apologising extends the incident."
    ],
    r: ["Code Review", "Retrospective"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "Checkout is down. My deploy at 14:20 caused it. Rolling back now, update at 14:40.", w: "the four-part incident line: what, whose, doing, next update" },
        { c: "I am sorry — that was my mistake.", w: "the unconditional apology, said once" },
        { c: "Just to correct one thing — that was the config change, not the service push.", w: "correcting a wrong attribution, calmly, in the same channel" }
      ]
    }
  }

]);
