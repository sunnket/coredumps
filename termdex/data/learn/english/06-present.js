/* Professional English — presenting and public speaking. */
TD.addLessons("english", [

  {
    t: "Structuring a Talk — the shapes that hold an audience",
    m: "present",
    lvl: "intermediate",
    s: "Openings that earn attention, four reusable structures, transitions, and the ending that most presenters throw away.",
    goal: [
      "Open a talk without wasting the most valuable thirty seconds you will get",
      "Choose a structure that matches your purpose instead of defaulting to chronology",
      "Land an ending that produces the action you want"
    ],
    b: [
      { p: "An audience decides in the first thirty seconds whether to pay attention, and they decide again every few minutes. Structure is what wins those repeated decisions. It is far more important than delivery, and it is far easier to fix." },

      { h: "The opening: what to do with your first thirty seconds" },

      {
        vs: {
          t: "The default opening vs an opening",
          bad: { label: "What most people say", c: "Hi everyone, thanks for having me, my name is Alex and I am a senior\ndata engineer on the platform team, I have been here about three years,\nand today I am going to talk to you a bit about our data pipeline and\nsome of the work we have been doing on it recently.", w: "Fifty words, no information. The audience has learned your name, which is on the slide, and that you will talk about the thing they came to hear about. Attention has already started to leak." },
          good: { label: "An opening that buys attention", c: "Last quarter our nightly pipeline failed eleven times. Each failure cost\nabout four hours of someone's morning, and twice it meant the board got\nnumbers that were a day old.\n\nToday it fails about once a month, and I want to show you the three\nchanges that did it - because two of them are things any team here could\ndo in a week.", w: "Names a real problem with numbers, states the result, and tells the audience why it is relevant *to them*. The speaker's name and title are on the slide where they belong." }
        }
      },

      {
        tbl: {
          t: "Opening moves that work",
          h: ["Move", "Example"],
          rows: [
            ["**A number that surprises**", "Eleven failures last quarter. This quarter, one."],
            ["**A specific moment**", "At 04:00 on a Tuesday in March, my phone went off for the fourth night running."],
            ["**A question the audience has**", "Why does a pipeline that works perfectly in test fail every third Tuesday in production?"],
            ["**A confident claim**", "I think we are solving the wrong half of this problem, and I want to show you why."],
            ["**The map**", "Three things: what broke, what we changed, and what I would do differently. Fifteen minutes."],
            ["**The stakes**", "If we get this wrong, we cannot onboard the next customer. That is the whole talk."]
          ]
        }
      },

      { trap: "Never open with an apology. *Sorry, I only had a day to prepare this*, *sorry for the ugly slides*, *I am not really an expert on this*. It lowers the audience's expectations, which does not protect you — it just makes them less likely to listen, and they would not have noticed the thing you apologised for." },

      { h: "Four structures worth knowing" },

      {
        tbl: {
          t: "Match the structure to the purpose",
          h: ["Structure", "Shape", "Use for"],
          rows: [
            ["**Problem → Solution → Proof**", "Here is what hurts, here is the fix, here is the evidence it works", "Most internal technical talks; proposals"],
            ["**Situation → Complication → Question → Answer** (SCQA)", "Things were fine, then X changed, so what do we do, here is the answer", "Executive and strategy communication; the consulting default"],
            ["**What → So what → Now what**", "The finding, why it matters, what should change", "Research and analysis readouts"],
            ["**Chronology**", "First this, then this, then this", "Incident reviews and post-mortems only. It is the default everywhere else and it is almost always wrong"],
            ["**Three points**", "Independent claims, each with evidence", "Where the parts do not depend on each other"]
          ]
        }
      },

      { n: "**SCQA is worth learning properly.** Situation: something everyone agrees on. Complication: what has changed or gone wrong. Question: the question that raises. Answer: your recommendation. It reliably makes an executive audience feel the problem before they hear the solution, which is the difference between a recommendation being accepted and being interrogated.", nt: "Situation, complication, question, answer" },

      { h: "Transitions" },

      { p: "Audiences get lost between sections, not inside them. A transition should say where you have been and where you are going." },

      {
        tbl: {
          t: "Transition phrases",
          h: ["Function", "Say"],
          rows: [
            ["Section change", "So that is what broke. Now — what we changed."],
            ["Recap and advance", "Two things so far: X and Y. The third is where it gets interesting."],
            ["Signal the important part", "If you remember one thing from today, this is it."],
            ["Handle a digression", "This is a side road, but a short one."],
            ["Bring it back", "Which brings us back to the number I opened with."],
            ["Signal the end approaching", "Two more minutes and then I will take questions."]
          ]
        }
      },

      { h: "Telling a story with data" },

      {
        ol: [
          "**One message per slide.** If a slide needs two sentences to summarise, it is two slides.",
          "**Put the message in the title.** Not *Q3 Revenue by Region* but *Revenue growth is entirely from EMEA*. The audience reads titles whether you like it or not; make the titles say the thing.",
          "**Say the number, then say what it means.** *Churn is 4.2% — that is one in twenty-four customers gone every month, and it is up from 2.8%.*",
          "**Give a comparison for every number.** A number alone is unreadable. Against last quarter, against target, against the competitor, against what you expected.",
          "**Name the one thing to look at.** *The line I want you to look at is the orange one.* Audiences scan charts randomly unless directed."
        ]
      },

      { h: "The ending" },

      {
        vs: {
          t: "Two endings",
          bad: { label: "Thrown away", c: "So yeah, that is pretty much it, um, thanks. Any questions?", w: "The last thirty seconds are the second most valuable in the talk and this discards them. It also hands the room a vague *any questions?* which produces silence." },
          good: { label: "Landed", c: "So: eleven failures down to one, and two of the three changes took a\nweek each.\n\nWhat I would ask is this - if your team runs anything nightly, try the\ncanary step. It is half a day, and it caught six of our eleven.\n\nI have got five minutes for questions, and I am around after this if\nanyone wants to go deeper on the schema part.", w: "Restates the headline number, makes one specific ask of the audience, and opens questions with an invitation and a scope rather than a vague offer." }
        }
      },

      { trap: "Do not end on a *Thank you* slide or a *Questions?* slide. The slide on screen during Q&A will be up for ten minutes and is the last thing anyone sees — make it your summary or your call to action. That is free real estate that almost everyone gives away." },

      {
        tryit: {
          t: "Write an SCQA opening",
          task: "You are presenting a case for hiring two more engineers. Write the four SCQA sentences.",
          hint: "Situation: something the audience already agrees with. Complication: what changed. Question: what that forces. Answer: your ask.",
          sol: { lang: "text", code: "Situation:    We committed to onboarding four enterprise customers this\n              year, and the platform work to support them was scoped in\n              January.\n\nComplication: Two of those customers need data residency in the EU,\n              which was not in the January scope and adds roughly five\n              months of work.\n\nQuestion:     So we either move the dates, cut the commitment, or add\n              capacity.\n\nAnswer:       I am asking for two engineers from March. That holds the\n              dates and costs less than the penalty clause on a single\n              missed onboarding." },
          w: "Notice that the audience has agreed with you three times before your ask arrives. That is what SCQA is for: by the time the recommendation lands, it is the obvious answer to a question they have already accepted."
        }
      }
    ],
    k: [
      "Do not spend the first thirty seconds on your name and job title — open with a number, a moment, a question or a claim.",
      "Never open with an apology.",
      "Chronology is the default structure and is almost always the wrong one outside incident reviews.",
      "SCQA — situation, complication, question, answer — is the most reliable structure for senior audiences.",
      "Put the message in the slide title, and give every number a comparison.",
      "The last thirty seconds and the slide left up during Q&A are the most wasted real estate in presenting."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "If you remember one thing from today, this is it.", w: "signalling the key point" },
        { c: "Churn is 4.2% - one in twenty-four customers, up from 2.8%.", w: "number, meaning, comparison" },
        { c: "So that is what broke. Now - what we changed.", w: "a transition that names where you have been and where you are going" }
      ]
    }
  },

  {
    t: "Delivery — voice, pace, pauses and killing filler words",
    m: "present",
    lvl: "intermediate",
    s: "The mechanical half of speaking. Pace, pitch, stress, pausing, and the specific habits that make a confident person sound uncertain.",
    goal: [
      "Control pace and volume deliberately rather than by adrenaline",
      "Remove filler words using the one technique that actually works",
      "Fix the intonation patterns that undercut your authority"
    ],
    b: [
      { p: "Research on executive presence keeps landing in the same place: how you say something accounts for a very large share of how competent you are judged to be. That is uncomfortable, and it is also good news, because delivery is mechanical and therefore trainable in a way that charisma is not." },

      { h: "The four dials" },

      {
        tbl: {
          t: "What to control, and how",
          h: ["Dial", "Problem", "Fix"],
          rows: [
            ["**Pace**", "Adrenaline speeds everyone up by 20–30%. Fast reads as anxious and is much harder to follow in a second language.", "Deliberately start slower than feels natural. Mark two or three places in your notes to stop for a breath."],
            ["**Volume**", "Trailing off at the end of sentences — the most common and most damaging habit.", "Aim your voice at the person furthest away. Push slightly *harder* on the last three words of every sentence."],
            ["**Pitch**", "Rising pitch at the end of a statement makes it sound like a question.", "Statements go **down** at the end. Questions go up. Practise the same sentence both ways until you can hear it."],
            ["**Pause**", "Silence feels enormous to the speaker and short to the audience.", "Pause after your key sentence, not before it. Two seconds. It is the single strongest emphasis tool available."]
          ]
        }
      },

      { n: "A pause before a sentence signals that you are searching for a word. A pause *after* a sentence signals that the sentence mattered. Same silence, opposite effect. Move your pauses one clause later and you will sound noticeably more authoritative with no other change.", nt: "Pause after, not before" },

      { h: "Upspeak, uptalk and the credibility drop" },

      {
        code: {
          lang: "text", t: "The same sentence, two intonation contours",
          lines: [
            { c: "The migration will finish on Friday?", w: "Rising pitch on *Friday*. Reads as: I think so? Are you happy with that? Do not be angry with me?", hi: true },
            { c: "The migration will finish on Friday.", w: "Falling pitch on *Friday*. Reads as: this is a fact I am responsible for.", hi: true },
            { c: "", w: "" },
            { c: "So, I have looked at the numbers, and, um, I think, maybe, we should", w: "" },
            { c: "probably consider possibly delaying?", w: "Six hedges and a rise. The content might be excellent; nobody will act on it." },
            { c: "We should delay. Here is why.", w: "Same view. Now it is a position.", hi: true }
          ]
        }
      },

      { h: "Killing filler words" },

      { p: "*Um*, *uh*, *like*, *you know*, *basically*, *actually*, *sort of*, *I mean*, *right?* — fillers are not a vocabulary problem. They are what your mouth does while your brain catches up, and the only reliable fix is to give your mouth something else to do." },

      {
        ol: [
          "**Replace the filler with silence.** This is the whole technique. When you feel *um* coming, close your mouth. The pause is imperceptible to the audience and enormous to you, which is why it feels wrong and works anyway.",
          "**Record yourself for two minutes and count.** Almost nobody knows their own filler rate. Counting is unpleasant and it is what makes the habit visible enough to change.",
          "**Slow down.** Most filler is caused by speaking faster than you are composing. Reducing pace reduces filler with no extra effort.",
          "**Finish sentences with a full stop, not a comma.** Chaining clauses with *and… so… and then…* is what creates the gaps that fillers fill. Shorter sentences, fewer fillers.",
          "**Do not eliminate them entirely.** Perfectly filler-free speech sounds rehearsed and slightly synthetic. The target is *few enough not to notice*, not zero."
        ]
      },

      { trap: "*Basically*, *actually* and *literally* are worse than *um*, because they carry meaning. *Basically* signals that you are about to simplify — so if you are not, delete it. *Actually* implies a correction of what the listener believed, which is faintly condescending when overused. Search your writing for all three; you will find more than you expect." },

      { h: "Hedges that leak authority" },

      {
        tbl: {
          t: "The habits that undercut competent people",
          h: ["Habit", "Example", "Instead"],
          rows: [
            ["**Pre-apologising**", "Sorry, this might be a stupid question, but…", "Just ask the question."],
            ["**Permission-seeking**", "Can I just say something?", "Say it. Or *One thing to add:*"],
            ["**Diminishing your own point**", "This is probably obvious, but…", "Delete the clause."],
            ["**Tag questions**", "That is the right approach, is it not?", "That is the right approach. *(Then stop and let them respond.)*"],
            ["**Just**", "I just wanted to check whether…", "Could you confirm whether…"],
            ["**Undermining the ask**", "If you have got time, no pressure…", "Could you do this by Thursday? *(Then* no rush *if you mean it.)*"],
            ["**Apologising for existing**", "Sorry to bother you —", "*(Nothing. Start with the question.)*"]
          ]
        }
      },

      { n: "Two caveats worth stating plainly. First, this advice is aimed most often at women and at junior staff, who receive it constantly and often unfairly — the underlying issue is frequently how they are heard rather than how they speak. Second, softeners are genuinely useful and stripping them all out produces someone who reads as abrupt. The goal is deliberate use: keep the softener when you mean to soften, delete it when it is only nerves.", nt: "Two caveats" },

      { h: "Nerves" },

      {
        tbl: {
          t: "What actually helps, and what does not",
          h: ["Helps", "Does not"],
          rows: [
            ["Rehearsing the **first ninety seconds** until it is automatic — that is where nerves peak", "Memorising the whole talk, which produces a recitation and collapses when interrupted"],
            ["Slow exhale, longer out than in, for a minute beforehand", "Telling yourself to relax"],
            ["Arriving early and speaking to two people in the room, so the audience is not strangers", "Avoiding everyone until you start"],
            ["Reframing the feeling as excitement — it is the same physiology and the relabelling measurably helps", "Trying to suppress it"],
            ["Having water and a place to put your hands", "Holding a clicker with both hands in front of you"],
            ["Knowing your material one level deeper than you will present it", "Adding more slides"]
          ]
        }
      },

      { h: "Body language that carries in a room and on video" },

      {
        tbl: {
          t: "In person and on camera",
          h: ["Element", "In the room", "On video"],
          rows: [
            ["**Eyes**", "One person per sentence, then move. Not a sweep.", "Look at the *lens*, not the faces, when you make a key point."],
            ["**Hands**", "Visible, above the waist, gesturing inside the frame of your body.", "Keep them in shot — gestures read as warmth and disappear off-camera."],
            ["**Stance**", "Feet planted, weight even. Move deliberately between sections, not constantly.", "Sit upright and slightly forward; leaning back reads as disengaged."],
            ["**Framing**", "—", "Camera at eye level. Looking down at a laptop camera is the most common and least flattering setup there is."],
            ["**Pause use**", "Pause and hold eye contact.", "Pause slightly longer — network lag eats short pauses and people talk over you."]
          ]
        }
      },

      { h: "Q&A: the part that is actually judged" },

      {
        tbl: {
          t: "Handling questions",
          h: ["Situation", "Say"],
          rows: [
            ["Buy a moment", "That is a good question — let me think about that for a second."],
            ["Did not understand it", "Sorry — are you asking about X, or about Y?"],
            ["Repeat for the room", "*(Repeat the question aloud before answering — always, in a large room.)*"],
            ["Do not know", "I do not know. I will find out and come back to you today."],
            ["Hostile question", "*(Answer the strongest reasonable version of it, not the hostile framing.)* I think the real question there is whether… — and the honest answer is…"],
            ["Off-topic or too deep", "That is a bigger conversation than we have time for — can we take it after?"],
            ["Someone making a speech", "*(Wait for a breath)* So is the question whether we considered X?"],
            ["Close Q&A", "Time for one more."]
          ]
        }
      },

      { trap: "Never say *as I mentioned earlier* in answer to a question. It tells the asker they were not listening, in front of everyone. Just answer it again, differently — the fact that they asked means the first version did not land, which is your problem and not theirs." },

      {
        tryit: {
          t: "Two minutes, recorded",
          task: "Record yourself explaining a project you have worked on for two minutes, with no preparation. Then listen once and count: filler words, sentences that end on a rising pitch, and pre-apologies. Re-record with one change: replace every filler with a closed mouth.",
          hint: "You are not trying to sound better on the second take. You are trying to hear the gap between what you thought you sounded like and what you did.",
          sol: { lang: "text", code: "Typical first-take numbers for someone who has never done this:\n  fillers            12-25 in two minutes\n  rising statements  3-8\n  pre-apologies      1-3\n\nAfter one deliberate re-take, most people cut fillers by half. The\nremaining half takes a few weeks of noticing, not a technique." },
          w: "This is the only exercise in the module that reliably changes behaviour. Reading about filler words has never removed one. Hearing your own recording removes several immediately."
        }
      }
    ],
    k: [
      "Adrenaline speeds you up; deliberately start slower than feels right.",
      "Push volume through the last three words of every sentence — trailing off is the most damaging delivery habit.",
      "Statements fall at the end. Rising pitch turns a fact into a request for approval.",
      "Pause *after* the important sentence, not before it.",
      "Replace fillers with closed-mouth silence; record yourself to find out how many you actually use.",
      "Delete pre-apologies and permission-seeking — but keep the softeners you are using on purpose.",
      "In Q&A, never say *as I mentioned earlier*. Answer it again, differently."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "That is a good question - let me think about that for a second.", w: "buying time in Q and A" },
        { c: "I do not know. I will find out and come back to you today.", w: "the answer that costs nothing and buys credibility" },
        { c: "We should delay. Here is why.", w: "a position, not a hedged suggestion" }
      ]
    }
  }

]);
