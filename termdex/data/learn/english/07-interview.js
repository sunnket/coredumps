/* Professional English — interview and group-discussion English. */
TD.addLessons("english", [

  {
    t: "Tell Me About Yourself — the ninety seconds that frame everything after",
    m: "interview",
    lvl: "core",
    s: "The most predictable question in every interview, and the one most candidates have never actually written down.",
    goal: [
      "Build a ninety-second self-introduction with a present-past-future shape",
      "Answer *why this role* and *why us* without flattery",
      "Handle the opening small talk and the closing questions"
    ],
    b: [
      { p: "It is asked in almost every interview. It is asked first, when the interviewer's impression is most malleable. It is entirely predictable. And most candidates answer it by improvising a chronological life story, which is the one shape that does not work." },

      { h: "The shape: present → past → future" },

      {
        code: {
          lang: "text", t: "Ninety seconds, three parts",
          lines: [
            { c: "PRESENT (20s)", w: "" },
            { c: "I am a data engineer at Meridian, where I own the platform that", w: "" },
            { c: "everything downstream reports off - about 40 million records a night.", w: "**Where you are now, with one number that establishes scale.** Not your whole title.", hi: true },
            { c: "", w: "" },
            { c: "PAST (40s)", w: "" },
            { c: "I came to it sideways. I started in backend, mostly payments, and I", w: "" },
            { c: "kept ending up as the person who fixed the reporting when it broke -", w: "" },
            { c: "so about four years ago I moved into it properly.", w: "**One line about how you got here.** A shape, not a chronology." },
            { c: "The thing I am proudest of is the Atlas migration last year: 40M", w: "" },
            { c: "records onto Postgres with an hour of downtime against a four-hour", w: "" },
            { c: "budget, and no data loss.", w: "**One achievement with numbers.** This is the sentence the interviewer will come back to.", hi: true },
            { c: "", w: "" },
            { c: "FUTURE (30s)", w: "" },
            { c: "What I want next is to do that at a bigger scale and with more say in", w: "" },
            { c: "the design, which is why this role interested me - the streaming", w: "" },
            { c: "piece is the part I have not done and want to.", w: "**Why you are in this room specifically.** Connects your trajectory to their job.", hi: true }
          ]
        }
      },

      { n: "The *future* section is what separates a good answer from a forgettable one. It converts the question from *describe your history* into *here is why my history points at your job*, which is the question the interviewer is actually trying to answer.", nt: "The part everyone omits" },

      { trap: "Do not start at university. Do not narrate every role. The interviewer has your resume; repeating it in spoken form wastes your best ninety seconds. If they want the chronology they will ask *walk me through your resume*, which is a different question with a different answer." },

      { h: "Adapting it" },

      {
        tbl: {
          t: "The same three-part shape, different emphases",
          h: ["Asked by", "Emphasise", "Length"],
          rows: [
            ["**Recruiter, first screen**", "Scale, stack, current level, what you are looking for", "60 seconds"],
            ["**Hiring manager**", "The achievement, the trade-offs you made, why this team", "90 seconds"],
            ["**Panel or skip-level**", "Impact beyond your own team, and what you want to grow into", "90 seconds"],
            ["**Peer engineer**", "The technical specifics, honestly — what was hard", "60 seconds, then let it become a conversation"],
            ["**Career changer**", "What transfers, stated explicitly. Do not apologise for the change", "90 seconds, more on *why the change*"],
            ["**Fresher / first job**", "The project you built, what you learned, what you want to do next", "60–75 seconds; lead with the project, not the degree"]
          ]
        }
      },

      { h: "Why this role, and why us" },

      {
        vs: {
          t: "Flattery vs research",
          bad: { label: "Flattery", c: "I have always admired your company, you are a leader in the space and\nI think the culture looks amazing. I would love to be part of such an\ninnovative team.", w: "Could have been written about any company by anyone. Interviewers hear four of these a day and it registers as *has not looked into us*." },
          good: { label: "Specific and honest", c: "Two reasons. The first is the problem - you are doing streaming\nreconciliation at a scale I have only done in batch, and that is the\ngap in what I can do.\n\nThe second is more specific: I read the engineering post about moving\noff the monolith last year, and the part about keeping the old and new\npaths running in parallel for six months is the kind of decision I want\nto be around. Most places would have big-banged it.", w: "One reason about the work, one reason showing genuine research. Neither is flattery, and both are impossible to have said about a different company." }
        }
      },

      { h: "Questions to ask them" },

      { p: "*Do you have any questions for us?* is not a formality — it is an assessment, and *no, I think you have covered everything* is a bad answer. Have five ready; you will get through two or three." },

      {
        tbl: {
          t: "Questions that make you look senior",
          h: ["Question", "What it signals"],
          rows: [
            ["What does someone need to have done in their first six months for you to be pleased you hired them?", "Outcome-oriented; also gives you the real job description"],
            ["What is the hardest problem the team is dealing with right now?", "You want the work, not the title"],
            ["How do decisions actually get made here — where would a design disagreement end up?", "Experience. Only people who have been burned ask this"],
            ["What is the thing about working here that people find harder than they expected?", "Invites honesty; the answer is genuinely useful"],
            ["Who else does this role work with most closely, and what do they need from it?", "Systems thinking"],
            ["What would make you *not* hire someone who was technically strong?", "Bold, and the answer tells you the real culture"],
            ["How has this role changed since the last person was in it?", "Uncovers whether it is a backfill and why"]
          ]
        }
      },

      { trap: "Avoid asking only about salary, leave and working hours in the first interview — not because those questions are wrong, but because they are recruiter questions. Ask the recruiter. And never ask something answered in the first line of the careers page; it reads as not having looked." },

      { h: "The rest of the frame" },

      {
        tbl: {
          t: "Small phrases that carry the interview",
          h: ["Moment", "Say"],
          rows: [
            ["Opening small talk", "Thanks for making the time — how has your week been?"],
            ["Did not understand the question", "Sorry — could you say a bit more about what you are looking for there?"],
            ["Need a moment", "Let me think about that for a second so I give you a real example."],
            ["Answering something you have not done", "I have not done exactly that. The closest is… and here is how I would approach it."],
            ["Correcting yourself", "Actually, let me revise that — the number was closer to 30 million."],
            ["Running long", "I can go deeper on any part of that — is that the level you wanted?"],
            ["Closing", "This has made me more interested, not less. What are the next steps and the timeline?"]
          ]
        }
      },

      { n: "*This has made me more interested, not less* is worth saying if it is true. Interviewers are also selling, and explicit interest measurably improves outcomes at the margin. It costs nothing and very few candidates say it.", nt: "Say you want it" },

      {
        tryit: {
          t: "Write yours",
          task: "Write your own ninety-second answer using present → past → future. Time it out loud. Then cut it to sixty seconds without losing the achievement or the *why this role*.",
          hint: "Twenty seconds present, forty past with one quantified achievement, thirty future. Cut adjectives before you cut facts.",
          sol: { lang: "text", code: "Structure to fill in:\n\nPRESENT  I am a ______ at ______, where I ______ [one number for scale].\n\nPAST     I got here by ______ [one line].\n         The thing I am proudest of is ______ [achievement + number +\n         what it made possible].\n\nFUTURE   What I want next is ______, which is why ______ [something\n         specific about this role].\n\nRead it aloud. If it takes more than 100 seconds, cut the past section\nfirst - it is always the part that has grown." },
          w: "Write it down and rehearse it aloud at least five times. Not memorised word for word — memorised in shape, so that under pressure you know where you are going even if the words differ."
        }
      }
    ],
    k: [
      "Present, past, future — not chronology. Twenty, forty, thirty seconds.",
      "One quantified achievement in the past section; it is what the interviewer will return to.",
      "The future section connects your trajectory to their job, and it is the part most candidates omit.",
      "*Why us* needs one reason about the work and one piece of specific research. Flattery reads as no research.",
      "Have five questions ready; *no questions* is a bad answer.",
      "Say explicitly that you are interested, if you are."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "What I want next is to do that at a larger scale, which is why this role interested me.", w: "the future section that connects you to the job" },
        { c: "What would someone need to have done in six months for you to be pleased you hired them?", w: "the strongest question to ask an interviewer" },
        { c: "I have not done exactly that - the closest is X, and here is how I would approach it.", w: "answering honestly without conceding the point" }
      ]
    }
  },

  {
    t: "STAR, Project Stories and the Questions Designed to Trip You",
    m: "interview",
    lvl: "intermediate",
    s: "The behavioural framework, the deep-dive on your own work, and honest answers to failure, weakness and conflict questions.",
    goal: [
      "Answer any behavioural question in a STAR structure without sounding scripted",
      "Survive a forty-minute deep dive into a project you built",
      "Answer the failure, weakness and conflict questions without either lying or self-harm"
    ],
    b: [
      { h: "STAR, and the letter everyone under-weights" },

      {
        tbl: {
          t: "The four parts and how long each should take",
          h: ["Part", "Contains", "Time", "Common failure"],
          rows: [
            ["**Situation**", "Enough context to understand the problem", "10–15%", "Two minutes of background before anything happens"],
            ["**Task**", "What *you* specifically owned", "10%", "Describing the team's task, not yours"],
            ["**Action**", "What you did, and the decisions you made", "**50–60%**", "Skipped in favour of context. This is the section being assessed"],
            ["**Result**", "What happened, with numbers, and what you learned", "20%", "Omitted entirely — a story with no outcome is an anecdote"]
          ]
        }
      },

      { trap: "Watch your pronouns. Behavioural interviews assess *you*, and candidates who describe their own work as *we* consistently score lower — not because interviewers are pedants, but because they genuinely cannot tell what you did. Use *we* for context and **I** for your actions: *We had two weeks. I decided to…*" },

      {
        code: {
          lang: "text", t: "A STAR answer to \"tell me about a time you disagreed with a decision\"",
          lines: [
            { c: "S: Last year we were three weeks from a launch and the product lead", w: "" },
            { c: "wanted to add SSO because a prospect had asked for it.", w: "Two sentences of situation. That is enough." },
            { c: "", w: "" },
            { c: "T: I owned the auth service, so the estimate and the risk were mine.", w: "What *you* owned. One sentence.", hi: true },
            { c: "", w: "" },
            { c: "A: I did not want to say no flatly, so I costed it properly first -", w: "" },
            { c: "about nine days including the testing nobody was counting.", w: "**Action starts with a decision, not an activity.**", hi: true },
            { c: "Then I put two options to him: SSO at launch with the reporting", w: "" },
            { c: "module cut, or launch as planned with SSO two weeks later. I also", w: "" },
            { c: "went and asked the account manager how firm the prospect actually", w: "" },
            { c: "was, because nobody had.", w: "The extra step you took is what the interviewer is listening for.", hi: true },
            { c: "It turned out they wanted it within the year, not at launch.", w: "" },
            { c: "", w: "" },
            { c: "R: We launched on time and shipped SSO six weeks later. What I took", w: "" },
            { c: "from it is that when someone asks for something late, the useful", w: "" },
            { c: "question is usually about the requirement behind it, not the", w: "" },
            { c: "feature.", w: "**Result plus a transferable lesson.** The lesson is what makes it memorable.", hi: true }
          ]
        }
      },

      { h: "The behavioural questions you will actually be asked" },

      {
        tbl: {
          t: "Prepare one story for each; most stories cover two or three",
          h: ["Question", "Really testing"],
          rows: [
            ["Tell me about a time you disagreed with your manager", "Whether you can dissent without being difficult"],
            ["Tell me about a project that failed", "Honesty and whether you learn"],
            ["Tell me about a difficult stakeholder or colleague", "Whether you talk about people generously under pressure"],
            ["Tell me about a time you had to deliver under a tight deadline", "Prioritisation and what you were willing to cut"],
            ["Tell me about a time you had to influence without authority", "Seniority. This is the promotion question in disguise"],
            ["Tell me about a technical decision you got wrong", "Self-awareness and whether you notice"],
            ["Tell me about a time you had to learn something quickly", "Learning method, not the topic"],
            ["Tell me about a time you received difficult feedback", "Defensiveness"],
            ["Tell me about something you are proud of that nobody noticed", "Values, and often the most revealing answer you give"]
          ]
        }
      },

      { n: "Prepare **six stories, not thirty answers.** A good story — one with a real decision in it — can be told as a deadline story, a conflict story, an influence story or a failure story depending on which part you foreground. Preparing stories rather than answers is also what stops you sounding scripted.", nt: "Six stories cover everything" },

      { h: "The project deep dive" },

      { p: "Forty-five minutes inside something you built. It is the easiest round if the work is genuinely yours and the hardest if it is not, which is exactly why companies run it." },

      {
        tbl: {
          t: "What they will ask, and what a strong answer contains",
          h: ["Question", "Weak answer", "Strong answer"],
          rows: [
            ["Why did you choose X?", "It is what we knew / it is the standard", "The constraint that drove it, and the alternative you rejected"],
            ["What would you do differently?", "Nothing really", "Two specific things, with the reason you did not know them then"],
            ["What was the hardest part?", "Getting it all done in time", "A specific technical or organisational problem, and how you diagnosed it"],
            ["How did you know it worked?", "It worked", "The measurement, the baseline, and what would have told you it had not"],
            ["What broke?", "Nothing", "The incident, the cause, and what you changed"],
            ["What did you own versus the team?", "*(vague)*", "A clear boundary, stated without diminishing colleagues"],
            ["How would it change at 100× scale?", "We would scale it up", "Where the first bottleneck appears and why"]
          ]
        }
      },

      { trap: "*Nothing, I would do it the same way* is the most damaging answer in a deep dive. It says either that you have not thought about it since, or that you cannot evaluate your own work. Have two real changes ready — and *I would have written the runbook before the cutover rather than after* is a perfectly good one." },

      { h: "Failure, weakness and conflict" },

      {
        vs: {
          t: "The weakness question",
          bad: { label: "The disguised strength", c: "I would say my weakness is that I am a perfectionist, I care too much\nabout getting things right and sometimes I work too hard.", w: "Every interviewer has heard this hundreds of times. It reads as evasive, and evasiveness is a much worse signal than any real weakness would be." },
          good: { label: "Real, bounded, being worked on", c: "I under-communicate when a project is going badly. My instinct is to\nfix it first and report once it is under control, and on the Atlas\nmigration that meant my director found out about a three-week risk in a\nstatus meeting rather than from me.\n\nSince then I send a written weekly note with a risk section whether or\nnot there is anything to report, which forces me to say it. It is\nbetter. It is not automatic yet.", w: "Names a genuine weakness with a real consequence, shows the specific mechanism they built to handle it, and does not claim to have solved it. This answer builds more trust than any strength would." }
        }
      },

      {
        tbl: {
          t: "Rules for the hard questions",
          h: ["Question", "Rule"],
          rows: [
            ["**Weakness**", "Real, bounded, professional, with a mechanism. Never a disguised strength; never anything core to the job you are applying for."],
            ["**Failure**", "Own your part exactly. Name what you would do differently. Do not choose a failure that was entirely someone else's."],
            ["**Conflict**", "Be generous about the other person. An interviewer is listening for how you talk about absent people, and that is the whole test."],
            ["**Why did you leave?**", "Forward-looking and short. *I wanted to work on X and there was no path to it there.* Never criticise a former employer, even when the criticism is deserved."],
            ["**Gap in your CV**", "State it plainly in one sentence, say what you did with the time, move on. Discomfort creates suspicion where facts do not."],
            ["**Fired or laid off**", "One factual sentence, no bitterness, then what you learned or built since. Rehearse this one aloud — it is the answer most likely to wobble."]
          ]
        }
      },

      { h: "The group discussion" },

      { p: "Used heavily in campus placements and some consulting processes. It looks like a debate; it is assessed as a collaboration exercise." },

      {
        tbl: {
          t: "What actually scores in a GD",
          h: ["Behaviour", "Effect"],
          rows: [
            ["**Speaking in the first ninety seconds**", "Entering late means competing for airtime for the rest of it. Do not open unprepared, but do open early."],
            ["**Structuring the discussion**", "*Shall we split this into economic and social impact?* — the single highest-scoring move available, and almost nobody makes it."],
            ["**Bringing someone in**", "*Rahul has not had a chance — what do you think?* Evaluators mark this heavily."],
            ["**Building on others explicitly**", "*Adding to what Priya said…* Shows listening, which is half the assessment."],
            ["**Summarising near the end**", "Whoever summarises is remembered as the leader, regardless of how much they said."],
            ["**Data and examples**", "One concrete number beats three opinions."],
            ["**Interrupting or dominating**", "Actively negative. Volume is not scored; contribution is."],
            ["**Changing your view on evidence**", "Positive, not weak — evaluators note it as maturity."]
          ]
        }
      },

      {
        tryit: {
          t: "Build your six stories",
          task: "Write one-line summaries of six projects or incidents from your work, and map each to the behavioural questions it could answer. Then pick the strongest and write it out fully in STAR, with the action section at least half the length.",
          hint: "A story is only usable if there is a decision in it that you made and could have made differently.",
          sol: { lang: "text", code: "Story map template:\n\n1. ______ -> deadline / prioritisation / trade-off\n2. ______ -> conflict / disagreement / influence\n3. ______ -> failure / what I got wrong\n4. ______ -> learned something fast / unfamiliar domain\n5. ______ -> influence without authority / cross-team\n6. ______ -> proud of / nobody noticed / values\n\nTest for each: can I name the decision I made, the alternative I\nrejected, and the number that shows how it turned out? If not, it is\nan anecdote and it will not survive follow-up questions." },
          w: "Six well-chosen stories will cover a full interview loop. Thirty memorised answers will not, because the second follow-up question in any direction goes off the edge of what you rehearsed."
        }
      }
    ],
    k: [
      "STAR: action is 50–60% of the answer. Context is what candidates over-spend on and interviewers do not score.",
      "Use *we* for context and *I* for your actions, deliberately.",
      "Prepare six stories with real decisions in them, not thirty answers.",
      "*I would do nothing differently* is the worst possible deep-dive answer.",
      "The weakness answer must be real, bounded, and paired with the mechanism you built. Disguised strengths read as evasion.",
      "In a group discussion, structuring the problem and bringing others in score higher than talking most."
    ],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "We had two weeks. I decided to cost it properly before saying no.", w: "we for context, I for action" },
        { c: "What I took from it is that the useful question is the requirement behind the request.", w: "the transferable lesson that ends a STAR answer" },
        { c: "Shall we split this into economic and social impact first?", w: "the highest-scoring move in a group discussion" }
      ]
    }
  }

]);
