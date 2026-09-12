/* Interview bank — behavioural and values rounds.

   The round candidates prepare least and lose most offers in. Amazon's Bar
   Raiser and Netflix's culture rounds are genuine gates with veto power, not
   formalities after the technical rounds.

   Answers here give structure and a worked example rather than a script to
   memorise — a recited answer is obvious within two sentences. */
(function (TD) {
  "use strict";

  TD.addQuestions([
    {
      id: "bhv-star-method",
      q: "How should a behavioural answer be structured, and how long should it be?",
      topic: "Behavioural",
      level: "easy",
      companies: "*",
      tags: ["star", "structure", "communication"],
      simple: "Set the scene in a sentence, say what you were responsible for, spend most of the time on what you actually did, and end with a number. Two to three minutes. Most people spend too long on background and never get to their own actions.",
      answer: "## STAR, with the right time split\n\n| Part | Time | Content |\n| --- | --- | --- |\n| **Situation** | ~15% | Enough context to follow. Two sentences. |\n| **Task** | ~10% | What *you* were responsible for. |\n| **Action** | **~60%** | What you did, and why you chose it. |\n| **Result** | ~15% | The outcome, quantified, plus what you learned. |\n\nThe usual failure is spending 80% on Situation. The interviewer is assessing *you*, and background is not evidence about you.\n\n## \"I\", not \"we\"\n\n\"We migrated the service\" tells the interviewer nothing about your contribution. \"I owned the schema migration; I wrote the dual-write layer and the backfill\" does. Credit the team explicitly — and be specific about your own part, or the story is unusable as evidence.\n\n## Quantify the result\n\n\"It got faster\" is not a result. \"P99 went from 380 ms to 90 ms, and support tickets about timeouts dropped from about 40 a week to under 5\" is.\n\nIf you genuinely have no number, use scale instead: how many users, how much data, how many services, how long it ran. Something that conveys size.\n\n## Two to three minutes\n\nLong enough for substance, short enough to leave room for follow-ups — and the follow-ups are where the real assessment happens. If you talk for eight minutes, the interviewer learns one thing about you instead of four.\n\nEnd cleanly rather than trailing off. A clear stop invites the follow-up.\n\n## Prepare stories, not answers\n\nDo not memorise responses to specific questions. Prepare **6–8 real stories** with depth, and map each to the several themes it can serve:\n\n| Story | Can answer |\n| --- | --- |\n| The migration that went wrong | Failure, ownership, pressure, learning |\n| The disagreement with a senior engineer | Conflict, influence, data-driven decisions |\n| The performance investigation | Deep dive, problem solving, persistence |\n| The project you cut scope on | Prioritisation, delivering results, judgement |\n| Mentoring a struggling teammate | Leadership, empathy, developing others |\n| The thing you shipped alone | Bias for action, ownership, ambiguity |\n\nOne good story serves four questions. Eight stories cover almost any loop.\n\n## Depth is what is actually tested\n\nExpect three or four levels of follow-up on one story: \"Why that approach?\" \"What did you consider instead?\" \"What would you do differently?\" \"What did the other person say?\"\n\nThis is why the story must be **real**. An invented story survives one layer and collapses at the third, and that collapse is far more damaging than an ordinary story told honestly.",
      takeaways: [
        "Sixty percent of the time goes on Action — most candidates spend it on Situation instead.",
        "Say \"I\" for your own contribution; \"we\" is not evidence about you.",
        "Prepare 6–8 real stories mapped to themes, not scripted answers to questions."
      ],
      followUps: [
        "What if you genuinely have no relevant experience? (Say so, then give the nearest analogue and be explicit about the difference.)",
        "How do you handle a story where the outcome was bad? (Own it, and be concrete about what you changed afterwards.)",
        "How much detail is too much? (If the interviewer stops taking notes, compress.)"
      ],
      trap: "Inventing a story. Interviewers probe three or four levels deep on purpose, and a fabricated story falls apart there — which reads far worse than a modest true one."
    },
    {
      id: "bhv-failure",
      q: "Tell me about a time you failed.",
      topic: "Behavioural",
      level: "medium",
      companies: "*",
      tags: ["failure", "ownership", "learning"],
      simple: "Pick a real failure where you were genuinely responsible, explain honestly what you got wrong, and show what you changed as a result. Do not pick a fake failure like working too hard — everyone recognises it.",
      answer: "## What is being assessed\n\nThree things, in this order:\n\n1. **Can you recognise your own failure?** Someone who cannot has not learned from one.\n2. **Do you take ownership**, or distribute blame?\n3. **Did you actually change anything?** The learning is the point.\n\n## Choosing the story\n\nIt must be:\n\n- **Real, and genuinely yours.** A failure caused by someone else does not answer the question.\n- **Consequential.** A typo does not demonstrate anything. Something that cost time, money, or trust.\n- **Resolved.** You need the second half — what changed.\n- **Not disqualifying.** Not an ethics failure, not something that suggests you would do it again.\n\n**Do not** use \"I care too much\" or \"I take on too much work\". Interviewers hear these constantly and score them as evasion.\n\n## A worked example\n\n> **Situation.** I owned a migration moving our order history from Postgres to a partitioned store. I estimated four weeks.\n>\n> **What went wrong.** I validated the migration against a sample of production data rather than all of it. About 0.3% of legacy rows had a null in a column my new schema declared non-null — data written before a constraint was added in 2019. The backfill failed 60% through, at 2 a.m., and I had not made it resumable. We rolled back and lost two days.\n>\n> **My part in it.** Two decisions were mine. I sampled instead of profiling the full column, because profiling 400 million rows felt slow and I wanted to keep to the estimate. And I wrote the backfill as a single transaction because it was simpler.\n>\n> **What I did next.** I profiled every column across the whole table — it took 40 minutes, which I should have spent at the start. I rewrote the backfill as resumable batches with a checkpoint table. It completed over the next weekend with two restarts, and the restarts cost nothing because of the checkpointing.\n>\n> **What changed since.** Two things stuck. I profile the full dataset before any migration — never a sample, because the interesting rows are by definition rare. And any long-running job I write is resumable from the start; treating that as optional is what turned a data problem into a two-day outage. I wrote both into our migration checklist and they have caught similar issues twice since.\n\n## Why that version works\n\n- The failure is technical, real and specific.\n- Ownership is unambiguous — two named decisions, both his.\n- The learning is **generalisable** (profile fully; make long jobs resumable) rather than trivial (\"check for nulls\").\n- It ends with evidence the change stuck.\n\n## The follow-ups to expect\n\n- \"What made you decide sampling was enough?\" — be honest: schedule pressure.\n- \"What did your manager say?\" — they want to see how you handled the conversation.\n- \"Has it happened again?\" — the checklist is your answer.\n\n## Do not over-apologise\n\nOwn it once, clearly, then spend the time on what changed. Extended self-criticism reads as a lack of confidence, not as honesty.",
      takeaways: [
        "Pick something consequential and genuinely yours; a fake failure is scored as evasion.",
        "Name the specific decisions you got wrong — that is what ownership sounds like.",
        "The learning must be generalisable and you must show it stuck."
      ],
      followUps: [
        "\"What would you do differently?\" — answer at the decision level, not the detail level.",
        "\"How did you tell your manager?\" — quickly, with a plan, is the answer they want.",
        "\"What is your biggest weakness?\" — the same structure: real, specific, actively being worked on."
      ],
      trap: "Choosing a failure that was really someone else's fault. It answers a different question and reads as an inability to take ownership — which is exactly what the question tests."
    },
    {
      id: "bhv-conflict",
      q: "Tell me about a time you disagreed with a colleague or your manager.",
      topic: "Behavioural",
      level: "medium",
      companies: "*",
      tags: ["conflict", "influence", "collaboration"],
      simple: "Show that you can disagree on the substance without making it personal, that you tried to find out why they thought what they did, and that you committed to the outcome even when it went against you.",
      answer: "## What is being assessed\n\n- Can you disagree **without damaging the relationship**?\n- Do you seek to understand the other position, or just restate yours louder?\n- **Can you commit to a decision that went against you?** This is the one people fail.\n- Do you know when to escalate and when to let it go?\n\n## The structure\n\n1. **The disagreement, on the merits.** What was the technical or product question?\n2. **Their reasoning.** Show you understood it. If you cannot state their case fairly, you were not listening.\n3. **How you tried to resolve it.** Data, a prototype, a written comparison — something that could change either mind.\n4. **The outcome**, including whether you were right.\n5. **What you did afterwards.**\n\n## A worked example where you were overruled\n\n> A senior engineer wanted to introduce a message queue between two services. I thought a direct synchronous call was right for that path, because the caller needed the result immediately and the queue would add a hop plus an eventual-consistency problem in the UI.\n>\n> His reasoning was about a spike the previous quarter that had taken the downstream service down, and a queue would have absorbed it. That was a real incident and a fair concern — I had not weighted it properly.\n>\n> Rather than keep arguing in the design review, I built both against a load test. The queue handled the spike better, as he said. It also added about 200 ms to the median request and required a polling endpoint for the UI, which was more complexity than I had estimated.\n>\n> We took his approach with one change from my side: a circuit breaker on the synchronous path for everything else, so we got spike protection without queueing the whole service. He suggested that combination once we had the numbers in front of us.\n>\n> I was wrong about the risk and right about the cost. What I took from it was to ask what incident someone is reacting to before disagreeing with them — the concern is usually specific and it is usually reasonable.\n\n## Why that version works\n\n- The disagreement is technical, not personal.\n- Their position is stated **fairly and sympathetically**, which is the strongest signal in the whole answer.\n- The resolution was evidence, not seniority or volume.\n- Partial wrongness is admitted without collapsing.\n- The lesson is about how to disagree, not about queues.\n\n## Disagree and commit\n\nIf the decision goes against you, commit fully. Not \"I'll do it but I still think it's wrong\" — that is undermining it while appearing to comply. Amazon names this explicitly as a Leadership Principle, and it is assessed directly.\n\nGood phrasing: *\"I still had a concern about the latency, and I said so once, in writing, so it was on record. Then I went and built it properly and did not relitigate it.\"*\n\n## What to avoid\n\n- A story where you were simply right and they were simply wrong. It reads as inability to see another view.\n- A conflict that was actually about personality.\n- Escalating to a manager as the first move rather than the last.\n- Any story where you were still complaining about it afterwards.",
      takeaways: [
        "State their position fairly — being able to is the strongest signal in the answer.",
        "Resolve with evidence, not seniority; a prototype or load test settles most disputes.",
        "Show you committed fully after being overruled, without relitigating."
      ],
      followUps: [
        "\"What if you had been right and they had insisted?\" (Escalate once, in writing, then commit.)",
        "\"How do you disagree with someone much more senior?\" (Ask questions before asserting.)",
        "\"When do you let something go?\" (When it is reversible and low-cost to try their way.)"
      ],
      trap: "Telling a story where you were entirely right. Interviewers are looking for someone who can be persuaded, and a story with no self-correction in it answers the opposite question."
    },
    {
      id: "bhv-amazon-lp",
      q: "How do you prepare for Amazon's Leadership Principles and the Bar Raiser?",
      topic: "Behavioural",
      level: "hard",
      companies: ["amazon"],
      tags: ["amazon", "leadership-principles", "bar-raiser"],
      simple: "Half of every Amazon interview is behavioural, scored against sixteen named principles. Prepare a bank of real stories, map each to several principles, and expect one interviewer whose job is to go deeper than anyone else and who can veto the hire on their own.",
      answer: "## How the loop actually works\n\nEvery interviewer is assigned specific Leadership Principles to probe. Each **coding round is roughly half behavioural** — expect around 20 minutes of LP questions in a 45-minute technical round. Budget for it or you will run out of time on the code.\n\nInterviewers write up detailed notes with quoted evidence, and the debrief is a discussion of that written evidence. Vague answers produce vague write-ups, which do not support a hire.\n\n## The Bar Raiser\n\nAn interviewer from **outside the hiring team**, trained for the role, with **veto power**. Their remit is the long-term bar, not this team's urgency to fill a seat — which is exactly why they can say no when the hiring manager wants a yes.\n\nThey will pick one story and go **three or four levels deep**:\n\n> \"What was the latency before?\" → \"How did you measure it?\" → \"Why that percentile?\" → \"What did the distribution look like?\" → \"What did you rule out first, and why?\"\n\nThis is Dive Deep being assessed directly. An invented or borrowed story dies here, and it dies visibly.\n\n## The principles that carry the most weight\n\nAll sixteen matter; these come up most:\n\n- **Customer Obsession** — start from the customer, not the technology.\n- **Ownership** — \"not my job\" is disqualifying. Show something you fixed that was outside your remit.\n- **Invent and Simplify** — the simplify half is under-used and easier to evidence.\n- **Are Right, A Lot** — show good judgement *and* changing your mind on new evidence.\n- **Dive Deep** — you must know the details three levels down.\n- **Have Backbone; Disagree and Commit** — both halves. Disagreeing is not enough; committing afterwards is the other half.\n- **Deliver Results** — with numbers.\n- **Bias for Action** — a reversible decision made quickly with 70% of the information.\n\n## Preparation that works\n\n**Build a story matrix.** Rows are your 8–10 real stories; columns are the principles. Fill in which stories evidence which. You will find gaps — usually Customer Obsession and Frugality — and can go looking for a real story to fill them.\n\n**Write each one out in full**, with the numbers. Writing forces you to notice where you do not actually remember the figure. Then do not memorise it; you want the substance available, not a script.\n\n**Prepare the depth layers.** For each story, write down the answers three levels down: the exact numbers, the alternatives you rejected, what you would do differently. This is what the Bar Raiser is going to ask for.\n\n**Have Frugality and Customer Obsession stories ready specifically.** They are the two most commonly missing, because engineers naturally reach for technical stories.\n\n## Quantify everything\n\nAmazon is a metrics culture and it shows in the scoring. \"Improved performance\" is not usable evidence. \"Reduced P99 from 380 ms to 90 ms, which cut checkout abandonment by 2%\" is.\n\nIf you do not have the number, give the scale honestly: \"roughly 50,000 requests a minute at peak\" is better than nothing, and better than a number you invented and cannot defend.\n\n## The single most common mistake\n\nUnderpreparing the behavioural half. Candidates spend eighty hours on algorithms and one on stories, then fail the loop on the LP round. Given that roughly half of every round is behavioural, that split is backwards.",
      takeaways: [
        "Roughly half of every round is behavioural — budget your time inside each interview accordingly.",
        "The Bar Raiser is external, trained, and has a veto; they probe three or four levels deep.",
        "Build a story-to-principle matrix and fill the gaps with real stories before the loop."
      ],
      followUps: [
        "\"Tell me about a time you had to make a decision with incomplete data.\" (Bias for Action.)",
        "\"Tell me about a time you went beyond your role.\" (Ownership.)",
        "\"Tell me about the most complex problem you have solved.\" (Dive Deep — expect four layers.)"
      ],
      trap: "Reusing one story across several interviewers. They compare notes in the debrief, and hearing the same story three times reads as a thin body of experience."
    },
    {
      id: "bhv-why-company",
      q: "Why do you want to work here? And why are you leaving your current job?",
      topic: "Behavioural",
      level: "easy",
      companies: "*",
      tags: ["motivation", "fit"],
      simple: "For 'why here', name something specific about this company that you could not say about three of its competitors. For 'why leaving', say what you are moving toward rather than what you are escaping.",
      answer: "## \"Why this company?\"\n\nThe test is specificity. If your answer works for any of their competitors, it is not an answer.\n\n**Weak:** \"You're a leader in the space and I want to work on hard problems with smart people.\" True of every company on the list.\n\n**Strong** — three ingredients:\n\n1. **Something specific and verifiable.** A paper, a product decision, an engineering blog post, an open-source project. Show you actually looked.\n2. **A connection to your own work.** Why this is a continuation of something you already care about, not a random application.\n3. **What you would contribute**, not only what you would receive.\n\n> \"I read your engineering post on moving the ingestion pipeline off Kafka to your own log — the section on why you kept the consumer-group semantics rather than redesigning them matched a decision I made last year on a much smaller system, and I got it wrong in the way that post describes. I've spent two years on streaming ingestion at a scale where those trade-offs start to bite, and this is the one place I know of where they bite at a scale I have not seen.\"\n\nThat cannot be recycled to another company, which is the whole point.\n\n**Do the research.** Half an hour: their engineering blog, recent launches, the team's public work, the job description's actual wording. It is visible immediately whether you did.\n\n## \"Why are you leaving?\"\n\nThe test is whether you can be dissatisfied without being bitter.\n\n**Never criticise your current employer or manager.** Even when the criticism is fair. The interviewer cannot verify it and will note how you talk about people who are not present.\n\n**Frame toward, not away.** Every push has a corresponding pull:\n\n| Push (do not say) | Pull (say this) |\n| --- | --- |\n| \"My manager is difficult\" | \"I'm looking for a team where I get more direct technical mentorship\" |\n| \"The work is boring\" | \"I want to work on problems at a scale I can't reach where I am\" |\n| \"Underpaid\" | \"I'm looking for a role that matches the scope I've grown into\" |\n| \"The company is failing\" | \"I want to work somewhere with the stability to plan multi-year work\" |\n\nThese are not evasions — they are the same fact stated as a goal, and the goal is the part that is actually about you.\n\n**Say something positive about where you are.** \"I've learned a lot there, particularly X\" costs nothing and signals that you leave places well. Someone who was miserable everywhere is a pattern.\n\n**If you were laid off**, say so plainly. It is common and carries no stigma. \"My team was cut in the October restructuring\" is complete. Do not over-explain.\n\n## Ask good questions at the end\n\nYour questions are part of the assessment. Weak questions signal weak interest.\n\nGood ones:\n\n- \"What's the hardest technical problem the team is facing right now?\"\n- \"How do decisions get made when the team disagrees on an approach?\"\n- \"What does someone who does well in this role do differently in their first six months?\"\n- \"What's something about working here that surprised you?\"\n\nAvoid anything answerable from the careers page.",
      takeaways: [
        "If your \"why here\" works for a competitor, it is not an answer.",
        "Frame the departure as moving toward something; never criticise a current employer.",
        "Your closing questions are assessed — prepare three that could not be answered from the website."
      ],
      followUps: [
        "\"Where do you see yourself in five years?\" (Direction and growth, not a job title.)",
        "\"What other companies are you interviewing with?\" (Honest and brief; a coherent pattern is fine.)",
        "\"What are you looking for in your next role?\" (Consistent with everything else you have said.)"
      ],
      trap: "Criticising your current employer. Even a fair criticism reads as a risk, because the interviewer is imagining how you will describe them in two years."
    },
    {
      id: "bhv-ambiguity",
      q: "Tell me about a time you had to make a decision without enough information.",
      topic: "Behavioural",
      level: "medium",
      companies: ["amazon", "netflix", "palantir", "google", "meta-ai", "uber", "anthropic", "openai", "microsoft"],
      tags: ["ambiguity", "judgement", "decision-making"],
      simple: "Show that you can act rather than freeze, that you knew which information was worth waiting for and which was not, and that you built in a way to find out you were wrong.",
      answer: "## What is being assessed\n\n- **Do you act, or wait for certainty that never arrives?**\n- Can you tell a reversible decision from an irreversible one?\n- Do you build in a way to detect being wrong?\n- Do you make your assumptions explicit rather than hiding them?\n\n## The framework worth naming\n\n**One-way versus two-way doors.** A reversible decision should be made quickly with partial information — the cost of being wrong is the cost of changing it back. An irreversible one deserves the time to gather more.\n\nMost decisions are two-way doors treated as one-way, and that is where teams lose speed. Naming this distinction explicitly is a strong signal, particularly at Amazon.\n\n## The structure\n\n1. **What was unknown**, and why you could not simply find out.\n2. **What you did know**, and what you could establish cheaply.\n3. **The decision, and the assumption it rested on** — stated explicitly.\n4. **How you limited the downside** and how you would detect being wrong.\n5. **The outcome**, including whether the assumption held.\n\n## A worked example\n\n> We had to choose a database for a new events service before we knew the read patterns, because the product team had not decided what the analytics surface would look like and we could not wait a month.\n>\n> What I could establish cheaply: write volume from the existing instrumentation — about 8,000 events/sec at peak, growing maybe 3× in a year. Retention was a compliance requirement, so 13 months. Those two were solid.\n>\n> What I could not know was whether reads would be point lookups by entity or wide aggregate scans. Those point at opposite storage choices.\n>\n> I chose Postgres with monthly partitioning, on an explicit assumption: at 8,000 writes/sec we were nowhere near needing a specialised store, and Postgres handles both access patterns adequately even though it is optimal for neither. I wrote the assumption into the design doc so it was reviewable rather than implicit.\n>\n> To limit the downside I put a thin repository interface in front of it, so swapping the store later would be one module rather than a rewrite. And I added a dashboard on query latency by pattern, with a threshold at which we would revisit — I did not want the decision to be reconsidered on vibes six months later.\n>\n> The reads turned out to be mostly aggregate scans. Nine months in we crossed the latency threshold and moved the analytical path to ClickHouse, keeping Postgres for the transactional path. The migration took about three weeks because of the interface. If I had waited for certainty we would have shipped a quarter late; if I had guessed ClickHouse up front we would have carried operational complexity for nine months for a system that did not need it yet.\n\n## Why that version works\n\n- The uncertainty is specific and genuinely unresolvable at the time.\n- The assumption is **stated and written down** — that is the behaviour being assessed.\n- The downside was bounded deliberately, with a **pre-agreed trigger** rather than a vague intention.\n- The outcome includes being partly wrong, and the cost of the alternatives is quantified.\n\n## What to avoid\n\n- A story where you guessed and got lucky, with no reasoning.\n- A story where you waited and the decision made itself.\n- Presenting it as a decision with no downside. Every real decision has one, and claiming otherwise reads as not having thought it through.",
      takeaways: [
        "Distinguish reversible from irreversible decisions — most are reversible and deserve speed.",
        "Write the assumption down so it can be reviewed, not held silently.",
        "Set the trigger for revisiting in advance, or the decision gets reconsidered on vibes."
      ],
      followUps: [
        "\"What would have changed your mind?\" (Have a real answer.)",
        "\"How did you communicate the uncertainty to stakeholders?\"",
        "\"When would you have waited instead?\" (When it is genuinely irreversible.)"
      ],
      trap: "A story where the ambiguity resolved itself and you never actually decided anything. The question is about acting under uncertainty, and a story with no decision in it does not answer it."
    },
    {
      id: "bhv-netflix-culture",
      q: "How is a Netflix-style senior culture interview different, and how do you prepare?",
      topic: "Behavioural",
      level: "hard",
      companies: ["netflix", "anthropic", "openai", "palantir"],
      tags: ["culture", "autonomy", "seniority"],
      simple: "The assumption is that you have already operated without supervision. They are not checking whether you can do the work — they are checking whether you can decide what the work is, disagree well, and take feedback that stings.",
      answer: "## The premise\n\nNetflix hires only senior people and gives them unusual autonomy: minimal process, few approvals, and correspondingly high expectations. The culture round tests whether that works for you, and it can end the loop on its own.\n\nThe operating principle is **context, not control** — managers supply context and you make the decision. So the questions are about judgement exercised alone.\n\n## What is actually assessed\n\n**Independent judgement.** Not \"did you do what you were told well\" but \"did you work out what should be done\". Have a story where you identified the problem yourself, decided the approach, and owned the outcome — with nobody assigning it.\n\n**Candour, in both directions.** Can you give hard feedback to a peer or a manager? Can you receive it without becoming defensive? A story where you *received* difficult feedback and changed as a result is often stronger than one where you gave it, because it is harder to fake.\n\n**Judgement about what not to do.** Seniority is largely knowing what to skip. A story about killing your own project, or cutting scope, evidences this better than a delivery story.\n\n**Comfort with a high bar.** The keeper test — would your manager fight to keep you — means there is no coasting. Some people find that energising and some find it exhausting, and both are legitimate. The interview is partly a genuine two-way filter, so being honest here serves you.\n\n**Impact framed in business terms.** Not \"I built a service\" but \"I built a service that let us stop paying for X, worth roughly Y\".\n\n## Preparing\n\n**Read the culture memo properly and form real reactions.** Not to recite it — to have views. Some of it is genuinely uncomfortable (generous severance as a normal outcome; no vacation policy) and interviewers respect a candidate who engages with that honestly more than one who agrees with everything.\n\n**Know your own numbers cold.** Traffic, latency, cost, team size, incident count. The deep-dive round will push, and vagueness about your own systems is disqualifying at this level.\n\n**Prepare a story about your own work being wrong**, found by you or by someone else, and what you did. Candour about your own output is the central trait.\n\n**Prepare a \"what I decided not to do\" story.** Under-prepared and highly diagnostic.\n\n## The reverse interview matters more here\n\nBecause the culture is genuinely unusual, they expect you to be assessing fit too. Good questions:\n\n- \"How does the keeper test actually feel day to day on this team?\"\n- \"Tell me about a decision someone on this team made that turned out badly. What happened to them?\"\n- \"When has the freedom-and-responsibility model not worked here?\"\n\nThat second one is unusually informative. The answer tells you whether the culture holds under pressure or only in the memo.\n\n## Where candidates fail\n\n- Describing work that was assigned and executed, with no judgement of their own in it.\n- Being unable to name a time they were wrong.\n- Treating the culture memo as marketing rather than as an operating description.\n- Not having the numbers for their own systems.",
      takeaways: [
        "The assessment is independent judgement — have a story where nobody assigned you the problem.",
        "Receiving hard feedback well is often the stronger story, because it is harder to fabricate.",
        "Know your own systems' numbers cold; vagueness is disqualifying at a senior-only bar."
      ],
      followUps: [
        "\"Tell me about a time you gave difficult feedback to someone more senior.\"",
        "\"What have you decided not to build, and why?\"",
        "\"Describe a decision you made that you would make differently now.\""
      ],
      trap: "Agreeing with every part of the culture memo. It reads as not having thought about it — engaging honestly with the uncomfortable parts is the stronger answer."
    },
    {
      id: "bhv-impact-scope",
      q: "What is the most impactful thing you have built, and how do you know?",
      topic: "Behavioural",
      level: "medium",
      companies: "*",
      tags: ["impact", "measurement", "scope"],
      simple: "Pick something whose effect you can measure, explain what it changed for whoever uses it, and be honest about your own share of the credit. Technical difficulty is not the same as impact.",
      answer: "## The two things being separated\n\n**Impact is not complexity.** A clever distributed system nobody uses has no impact. A one-line configuration change that cut infrastructure spend by 30% has a lot. Interviewers are checking whether you can tell the difference — and many engineers instinctively reach for the hardest thing rather than the most useful.\n\n## What makes a strong answer\n\n**1. A measured outcome.** Ideally in business terms:\n\n| Layer | Example |\n| --- | --- |\n| Technical | P99 latency 800 ms → 120 ms |\n| Product | Checkout completion +3.2% |\n| Business | ~€1.4M additional annual revenue |\n\nGetting from the first row to the third is what distinguishes a senior answer. If you cannot reach the business layer, at least reach the product layer.\n\n**2. Honest attribution.** \"I designed and built the caching layer; two colleagues did the client migration; the product team ran the experiment that measured it.\" Overclaiming is easy to detect under follow-up and is expensive when detected.\n\n**3. How you know.** This is the half people skip. \"We measured it\" is not enough — how? An A/B test? Before-and-after with a control? What confounds did you rule out? If the change shipped in the same week as a marketing campaign, you need to say how you separated them.\n\n**4. Durability.** Is it still running? Did the improvement hold? A win that regressed in three months is a different story.\n\n## A compact example\n\n> Our search endpoint was the slowest page in the product at about 2.1 seconds P95, and search was in the funnel for most purchases.\n>\n> I traced it and found we were making one query per result to fetch inventory — an N+1 across a service boundary, so 40 network round trips per search. I batched them into one call and added a 30-second cache on inventory, which was acceptable because the checkout path re-validated stock anyway.\n>\n> P95 went from 2.1 s to 240 ms. We ran it as a 50/50 experiment for two weeks: search-to-purchase conversion went up 4.1% with a confidence interval of 2.8% to 5.4%, which on that quarter's volume was around €900k annualised. The finance team's number, not mine.\n>\n> The batching was mine end to end. The cache invalidation on the checkout path was a colleague's — she caught that my first version could sell stock we did not have, which would have made the whole thing a net negative.\n\n## Why that works\n\n- Measured with a proper experiment, with an interval rather than a point estimate.\n- Business number attributed to the team that produced it, not claimed.\n- The credit to a colleague is specific and material — it makes the rest more credible, not less.\n- The safety consideration shows the change was thought through.\n\n## If you do not have a big number\n\nThat is fine and common, particularly early in a career. Use scale, or use a qualitative outcome with evidence:\n\n> \"It is not a revenue number, but the on-call rotation went from about six pages a week on that service to under one, and two people on the team told me they stopped dreading the rotation. I can point to the PagerDuty numbers.\"\n\nHonest and specific beats a large number you cannot defend under three follow-up questions.",
      takeaways: [
        "Impact is not complexity — the ability to separate them is what is being tested.",
        "Get from the technical metric to the product or business metric if you possibly can.",
        "Say how you measured it and what you ruled out; \"we measured it\" is half an answer."
      ],
      followUps: [
        "\"How did you decide to work on that rather than something else?\"",
        "\"What did you have to give up to do it?\"",
        "\"Is it still in production? Has the improvement held?\""
      ],
      trap: "Claiming a business number you cannot source. \"That saved us millions\" invites \"how did you calculate that\", and not having an answer undermines the whole story."
    }
  ]);
})(window.TD = window.TD || {});
