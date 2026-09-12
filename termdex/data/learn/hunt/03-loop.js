/* Portfolio & the Job Hunt — the interview loop. */
TD.addLessons("hunt", [

    {
        t: "Every Stage, and What Each One Is Really Testing",
        m: "loop",
        lvl: "core",
        s: "The recruiter screen, the coding round, the AI technical, the system design, and the project deep-dive — prepared for specifically.",
        goal: [
            "Name what each interview stage is assessing and prepare for it accordingly",
            "Rehearse the project deep-dive so it is your strongest round",
            "Recover from a blank in the coding round without losing the offer"
        ],
        b: [
            { p: "An interview loop has four to six stages, each testing something different. Preparing generically — *I will study everything* — wastes time. Preparing specifically — *the coding round tests pattern recognition, the AI technical tests depth, the project deep-dive tests ownership* — lets you allocate hours where they convert." },

            { h: "The typical loop" },
            {
                tbl: {
                    t: "Stage by stage",
                    h: ["Stage", "What it tests", "Duration", "How to prepare"],
                    rows: [
                        ["**Recruiter screen**", "Fit, salary expectations, basic communication", "20–30 min", "Rehearse your 90-second story. Know the company's product"],
                        ["**Online assessment**", "Whether you can code at all", "60–90 min", "Practise under a timer with no IDE. Two medium problems is typical"],
                        ["**Coding round (live)**", "Problem solving, communication, complexity analysis", "45–60 min", "DSA patterns. Think aloud. State complexity unprompted"],
                        ["**AI / ML technical**", "Depth in your domain", "45–60 min", "Know your projects deeply. Be able to draw a transformer, explain RAG, discuss evaluation"],
                        ["**System design**", "Architecture, trade-offs, scaling", "45–60 min", "Practise the structure: requirements → estimation → design → trade-offs"],
                        ["**Project deep-dive**", "Ownership, depth, honesty", "45–60 min", "**The easiest round if the work is yours.** Rehearse the story"]
                    ]
                }
            },

            { h: "The 90-second story" },
            { p: "Every loop starts with *tell me about yourself*. This is not a conversation opener — it is the first piece of evidence. A 90-second answer that is structured, specific and ends with why you are here is worth rehearsing until it sounds natural." },

            {
                code: {
                    lang: "text", t: "The structure",
                    lines: [
                        { c: "1. WHO YOU ARE (10 seconds)", w: "" },
                        { c: "   'I'm an AI engineer focused on retrieval systems", w: "" },
                        { c: "    and applied ML.'", w: "**One sentence.** Not your life story." },
                        { c: "", w: "" },
                        { c: "2. WHAT YOU'VE DONE (40 seconds)", w: "" },
                        { c: "   'Most recently I built a RAG pipeline over", w: "" },
                        { c: "    regulatory documents — hybrid search, reranking,", w: "" },
                        { c: "    evaluation harness — that improved relevance by", w: "" },
                        { c: "    16 points on a 500-question golden set.'", w: "**One project, with a number.**", hi: true },
                        { c: "", w: "" },
                        { c: "3. WHAT YOU LEARNED (20 seconds)", w: "" },
                        { c: "   'The biggest lesson was that evaluation is where", w: "" },
                        { c: "    the real engineering lives — the retrieval was", w: "" },
                        { c: "    straightforward, but knowing whether it worked", w: "" },
                        { c: "    was the hard part.'", w: "**A reflection, not a feature.**", hi: true },
                        { c: "", w: "" },
                        { c: "4. WHY HERE (20 seconds)", w: "" },
                        { c: "   'I'm excited about this role because your team", w: "" },
                        { c: "    is solving retrieval at a scale I haven't worked", w: "" },
                        { c: "    at yet, and the evaluation challenges interest", w: "" },
                        { c: "    me specifically.'", w: "**Specific to this company.** Generic enthusiasm sounds generic." }
                    ]
                }
            },

            { h: "The coding round" },
            {
                ol: [
                    "**Read the problem, then read it again.** Most wrong answers start with misreading the problem.",
                    "**Clarify.** Ask about edge cases, input size, whether the input is sorted. This is scored.",
                    "**State the brute force.** Analyse its complexity. Then say *I think we can do better* and describe the optimisation.",
                    "**Discuss before coding.** The interviewer wants to agree on the approach before you type. Coding the wrong thing wastes twenty minutes.",
                    "**Think aloud the entire time.** Silence is the worst thing you can do, because the interviewer has no way to distinguish *stuck* from *thinking*.",
                    "**Test your own code.** Walk through an example. Catch your own bugs. This is both impressive and rare.",
                    "**State time and space complexity unprompted.** After every approach, every optimisation. It is always scored and frequently forgotten."
                ]
            },

            {
                n: "If you go blank, say so immediately: *I am not seeing the pattern yet. Let me talk through what I know about the problem.* Then enumerate: what is the input, what is the output, what structures is this a candidate for. Nine times out of ten, the act of talking yourself through it produces the insight — and an interviewer would rather hear that process than watch you sit in silence.",
                nt: "Recovering from a blank"
            },

            { h: "The AI / ML technical round" },
            { p: "This round probes depth, not breadth. They will start broad — *explain attention* — and then drill until they find your boundary. The boundary is not a failure; it is where the conversation gets interesting. Saying *I am not sure, but my intuition is X because Y* is a strong answer." },

            {
                l: [
                    "**Be able to draw the transformer.** Queries, keys, values, multi-head attention, layer normalisation, the residual connections. This is asked in essentially every AI loop.",
                    "**Know your evaluation.** Be able to explain every metric you reported, the test that validates it, and the ways it can mislead.",
                    "**Know your trade-offs.** *Why did you choose this model over that one?* is the question. *Because the tutorial used it* is not an answer.",
                    "**Know the failure modes.** When does your system break? What does a failure look like to a user? How would you detect it in production?",
                    "**Admit what you do not know.** Making something up collapses under one follow-up question. Saying *I have not worked with that specific approach, but here is how I would reason about it* survives."
                ]
            },

            { h: "The project deep-dive" },
            { p: "Forty-five minutes inside something you built. This is the round most candidates are least prepared for and should be most prepared for, because *you chose the topic*. The interviewer is testing ownership, depth and honesty — did you actually build this, do you understand it, and can you evaluate your own work?" },

            {
                tbl: {
                    t: "What they are looking for",
                    h: ["Signal", "How you show it"],
                    rows: [
                        ["**Ownership**", "You made the decisions and can explain why — not *the team decided*"],
                        ["**Depth**", "You can answer two levels deeper than the overview, on any component"],
                        ["**Trade-offs**", "You can name what you gave up and what you would do differently"],
                        ["**Honesty**", "You have a failure story and a limitation you can name without prompting"],
                        ["**Scope awareness**", "You know what the project does not handle and what the next steps would be"]
                    ]
                }
            },

            { h: "The failure story" },
            { p: "You will be asked *what would you do differently*. You should also have a genuine failure story ready — something you tried that did not work, and what you learned. This is not a weakness question; it is a gauge of self-awareness. Senior engineers expect failures; they are suspicious of candidates who report none." },

            {
                code: {
                    lang: "text", t: "A failure story that works",
                    lines: [
                        { c: "SITUATION", w: "" },
                        { c: "  I assumed that a larger context window would", w: "" },
                        { c: "  improve answer quality, so I chunked documents at", w: "" },
                        { c: "  2,000 tokens instead of 500.", w: "" },
                        { c: "", w: "" },
                        { c: "WHAT HAPPENED", w: "" },
                        { c: "  Relevance dropped by 11 points. The retriever", w: "" },
                        { c: "  ranked long chunks lower because the embedding", w: "" },
                        { c: "  averaged over too much irrelevant text.", w: "**Specific, measurable, understood.**", hi: true },
                        { c: "", w: "" },
                        { c: "WHAT I LEARNED", w: "" },
                        { c: "  Chunk size is an empirical question, not a", w: "" },
                        { c: "  heuristic one. I built an eval loop that tested", w: "" },
                        { c: "  four sizes and picked the one that scored highest", w: "" },
                        { c: "  on the golden set, rather than guessing.", w: "**The learning changed behaviour** — that is what makes it genuine.", hi: true }
                    ]
                }
            },

            { h: "System design round" },
            {
                ol: [
                    "**Clarify requirements.** Functional and non-functional. How many users? What latency? What availability?",
                    "**Estimate.** Back-of-envelope numbers. Storage, throughput, cost. This is what separates the round from a whiteboard exercise.",
                    "**Start with the API.** What endpoints, what request/response shapes. This grounds the conversation.",
                    "**Draw the architecture.** Components and data flow. Name each component's responsibility.",
                    "**Discuss trade-offs.** For every choice, name the alternative and why you did not pick it.",
                    "**Address failure.** What happens when each component goes down? How do you detect it? How do you recover?"
                ]
            },

            {
                tryit: {
                    t: "Rehearse the deep-dive",
                    task: "Pick your strongest project. Set a timer for 5 minutes and tell the story aloud — what the problem was, what you built, the key decisions, the results, and one limitation. Then ask yourself: could I go two levels deeper on any component if asked? Practise the depth on whichever part you are weakest on.",
                    hint: "Record yourself and listen back. Everyone speaks faster than they think, explains less than they believe, and skips the trade-offs. The recording is uncomfortable and the fastest way to improve.",
                    sol: { lang: "text", code: "The 5 minute structure:\n\n  0:00 - Problem (30s)\n    'Regulatory documents are long. Analysts spend\n     hours searching manually.'\n\n  0:30 - Approach (90s)\n    'RAG: chunk, embed, retrieve, rerank, generate.\n     Hybrid search because regulatory text has specific\n     keywords that semantic search alone misses.'\n\n  2:00 - Key decision (60s)\n    'Chose sentence-transformers over OpenAI embeddings\n     because of cost and data residency. Traded some\n     quality for 10x lower cost and no data leaving\n     the country.'\n\n  3:00 - Results (60s)\n    '94% relevance on 500-question golden set, up from\n     78% with naive prompting. Latency p95 under 3s.'\n\n  4:00 - Limitation + next steps (60s)\n    'Struggles with tables in PDFs. Next: a table\n     extraction step before chunking.'\n\n  Depth drill: can I explain how the reranker works?\n  Can I defend the chunking strategy with numbers?\n  Can I draw the full architecture from memory?" },
                    w: "The deep-dive is the easiest round if you have rehearsed it and the hardest if you have not. The difference is entirely preparation, not intelligence — and it is the one round where having built the project yourself is an unbeatable advantage."
                }
            },

            ],
        k: [
            "Each stage tests something different — prepare specifically, not generically.",
            "The 90-second story: who you are, one project with a number, a reflection, and why here.",
            "In the coding round, think aloud, state complexity unprompted, and test your own code.",
            "The project deep-dive is the easiest round if the work is yours. Rehearse the story and the depth.",
            "Have a genuine failure story ready — specific, measurable, and with a learning that changed behaviour."
        ],
        r: ["Algorithm"]
    },

    {
        t: "Offers, Negotiation, and Choosing",
        m: "offer",
        lvl: "core",
        s: "Reading a compensation breakdown, negotiating without hostility, and deciding between offers on the right numbers.",
        goal: [
            "Read a CTC breakdown and identify the actual liquid cash",
            "Negotiate an offer without damaging the relationship",
            "Choose between competing offers using a framework rather than instinct"
        ],
        b: [
            { p: "An offer is a document, not a verdict. It is the beginning of a conversation, and failing to negotiate is the most expensive single mistake in a career — not because companies are trying to underpay you, but because the first number is almost never the final number, and the difference compounds over every year you stay." },

            { h: "Reading the Indian CTC breakdown" },
            {
                tbl: {
                    t: "What the numbers actually mean",
                    h: ["Component", "What it is", "Liquid?"],
                    rows: [
                        ["**Basic salary**", "The base on which PF, gratuity and tax are calculated", "Yes"],
                        ["**HRA**", "House rent allowance — tax-advantaged if you pay rent", "Yes"],
                        ["**Special allowance**", "The flexible balancing component", "Yes"],
                        ["**PF (employer contribution)**", "12% of basic, locked until you leave", "**No** — illiquid for years"],
                        ["**Gratuity**", "Paid after 5 years of service", "**No** — most people leave before it vests"],
                        ["**Insurance**", "Health, life, accident coverage", "Not cash — but has real value"],
                        ["**Variable / bonus**", "Performance-dependent, often 0–100% of target", "**Partially** — never count 100% of it"],
                        ["**ESOPs / RSUs**", "Equity, vesting over 3–4 years", "**Depends** — in a listed company, yes. In a startup, maybe never"],
                        ["**Joining bonus**", "One-time, often with a clawback", "Yes, once — and repayable if you leave within a year"]
                    ]
                }
            },

            {
                n: "The CTC (cost to company) is designed to look as large as possible. Your *in-hand salary* — what lands in your bank account each month — is typically 60–70% of the CTC. Compare offers on in-hand, not on CTC, and ask the recruiter for the monthly in-hand figure directly.",
                nt: "CTC is not your salary"
            },

            {
                code: {
                    lang: "text", t: "Comparing two offers honestly",
                    lines: [
                        { c: "                    Offer A         Offer B", w: "" },
                        { c: "CTC                 ₹24 LPA         ₹28 LPA", w: "" },
                        { c: "In-hand/month       ₹1,52,000       ₹1,48,000", w: "**Offer A pays more monthly** despite the lower CTC.", hi: true },
                        { c: "Variable (target)   ₹2L (80% avg)   ₹6L (50% avg)", w: "" },
                        { c: "Expected variable   ₹1.6L           ₹3L", w: "" },
                        { c: "ESOPs               None            ₹4L/yr (private)", w: "**Worth ₹0 until an exit event.** Do not count them as cash.", hi: true },
                        { c: "Joining bonus       ₹1L (1yr claw)  None", w: "" },
                        { c: "", w: "" },
                        { c: "Real annual comp    ~₹20L           ~₹20.8L", w: "**Nearly identical** once you strip the illiquid parts." },
                        { c: "", w: "" },
                        { c: "Remote?             Hybrid 3 days   Full remote", w: "" },
                        { c: "Commute saved       0               ~₹2L + 500 hrs/yr", w: "**This goes on the other side of the ledger.**" },
                        { c: "", w: "" },
                        { c: "Team                ML platform     AI product", w: "" },
                        { c: "Growth              Operate systems  Build new ones", w: "**The role matters more than the number** at this stage.", hi: true }
                    ]
                }
            },

            { h: "Negotiation" },
            { p: "Negotiation is not adversarial. It is a conversation about what the role is worth and what you need to accept it. Companies expect it, recruiters are trained for it, and the only way to lose is to be unpleasant or to invent competing offers." },

            {
                ol: [
                    "**Express enthusiasm first.** *I am excited about this role and I would like to make it work.* This is not theatre — it reframes the conversation as collaborative rather than transactional.",
                    "**Name a specific number with a reason.** *Based on my research and the scope of this role, I was hoping for ₹X. I bring Y and Z that are directly relevant to the team's goals.* A number with a justification is taken seriously; a number alone is taken as haggling.",
                    "**Negotiate on total package, not just base.** Signing bonus, variable target, ESOP grants, remote days and learning budgets are all movable — and often easier for the company to adjust than base salary, which has internal equity constraints.",
                    "**Never lie about competing offers.** Recruiters have networks. If they discover a fabricated offer, you lose the real one and the reputation damage is permanent.",
                    "**Set a deadline for yourself.** Ask for 48–72 hours to consider. Longer than a week signals indecision; less than 24 hours signals you did not think.",
                    "**Get the final offer in writing.** Verbal agreements are worth less than the paper they are not printed on."
                ]
            },

            { trap: "Never give your current salary or expected salary first if you can avoid it. Say *I would prefer to understand the full scope and expectations of the role before discussing numbers.* If pressed, give a range based on market research, not your current package — anchoring to your current salary penalises you for every previous negotiation you did not have." },

            { h: "Choosing between offers" },
            {
                tbl: {
                    t: "The framework",
                    h: ["Factor", "Weight", "Questions to ask"],
                    rows: [
                        ["**What you will learn**", "**High**", "Will you be building new skills or running existing systems? Where will you be in 2 years?"],
                        ["**The team and manager**", "**High**", "Have you spoken to the manager? Ask: how does the team handle on-call, tech debt, career growth?"],
                        ["**Total liquid compensation**", "High", "In-hand + realistic variable. Ignore illiquid equity in startups for base comparison"],
                        ["**Role scope**", "Medium-High", "Are you an IC or managing? Greenfield or maintenance? How much autonomy?"],
                        ["**Company trajectory**", "Medium", "Growing, stable, or shrinking? What does the next funding round or earnings report suggest?"],
                        ["**Work-life balance**", "Medium", "Remote flexibility, on-call, expected hours. Ask the team, not the recruiter"],
                        ["**Location and commute**", "Medium", "A ₹2L/yr commute cost and 500 hours of your life is real compensation"],
                        ["**Brand on your resume**", "Low-Medium", "Diminishing returns after the first well-known company. A great role at a small company beats a boring one at a big name"]
                    ]
                }
            },

            {
                n: "At the early-career stage, what you learn in the first two years matters more than the salary difference between offers. A ₹2L/yr gap feels large now and is irrelevant in five years; the skills and reputation you build are not. Optimise for learning velocity, then for compensation.",
                nt: "The career decision hierarchy"
            },

            { h: "After accepting" },
            {
                l: [
                    "**Decline other offers gracefully.** *Thank you for the process. I have decided to go in a different direction, and I appreciated the time your team spent with me.* This is a relationship you may need later.",
                    "**Keep in touch with your contacts.** The people who referred you, the hiring managers who interviewed you, the candidates you met — your network is your career's immune system.",
                    "**Stop searching immediately.** Continuing to interview after accepting is a breach of good faith that burns bridges permanently.",
                    "**Prepare for the first day.** Read the team's recent work, set up your machine before you start, and arrive knowing who your first three conversations should be with."
                ]
            },

            {
                tryit: {
                    t: "Build your comparison framework",
                    task: "If you have an offer, build the comparison table above with real numbers. If you do not, take a job listing you are targeting and research: what is the typical in-hand salary for this role and level? What does the total package typically include? Use levels.fyi, Glassdoor, LinkedIn salary insights, and peers — and note the confidence level of each source.",
                    hint: "The in-hand number is what matters. Back out PF, gratuity and insurance from the CTC to get it. If the recruiter will not give you the in-hand figure directly, that is itself information.",
                    sol: { lang: "text", code: "Example for 'AI Engineer, 0-2 yrs, Bangalore':\n\n  Source          Base range       Total CTC\n  levels.fyi      12-18 LPA        16-24 LPA\n  Glassdoor       10-16 LPA        14-22 LPA\n  Peer (Arjun)    14 LPA base      19 LPA CTC\n  Peer (Meera)    16 LPA base      22 LPA CTC\n\n  Estimate: 14-16 LPA base is realistic.\n  In-hand at 15L base: ~₹1,05,000/month\n\n  When negotiating, anchor to the peer data\n  and the levels.fyi range, not to your current\n  or previous salary." },
                    w: "Salary research removes anxiety from negotiation because you are working from data rather than guessing. The recruiter has this data; now you do too, and the conversation is between equals."
                }
            },

            ],
        k: [
            "CTC is not your salary — in-hand is typically 60–70% of CTC. Compare on in-hand, not headline numbers.",
            "Negotiate on total package: signing bonus, variable, equity, remote days, and learning budget are all levers.",
            "Never fabricate competing offers. Recruiters have networks, and the reputational cost is permanent.",
            "At early-career, optimise for learning velocity over a ₹2L salary gap. The skills compound; the gap does not.",
            "Decline other offers gracefully. Every interviewer and recruiter is someone you may need in three years."
        ],
        
    }

]);
