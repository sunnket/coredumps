/* Portfolio & the Job Hunt — resume and profile. */
TD.addLessons("hunt", [

    {
        t: "The Eight-Second Scan",
        m: "resume",
        lvl: "core",
        s: "A one-page resume that survives a recruiter's scan, a keyword filter, and a hiring manager's follow-up.",
        goal: [
            "Write resume bullets with metrics and trade-offs instead of responsibilities",
            "Structure the page so the strongest signal is above the fold",
            "Pass an ATS keyword screen without stuffing"
        ],
        b: [
            { p: "A recruiter spends roughly eight seconds on a resume. In that time they read your name, your most recent title, the company, and approximately two bullet points. Everything above the fold is doing all of the work, and everything below it is insurance for the hiring manager who reads more carefully later." },

            { h: "The structure that works" },
            {
                code: {
                    lang: "text", t: "Top to bottom, in signal order",
                    lines: [
                        { c: "NAME", w: "" },
                        { c: "email · phone · city · GitHub · LinkedIn", w: "**One line.** No address, no photo, no date of birth." },
                        { c: "", w: "" },
                        { c: "SUMMARY (optional, 2 lines max)", w: "**Only include it if it adds signal.** *Passionate team player* does not. *AI engineer, built a retrieval system serving 12k daily queries at 94% relevance* does.", hi: true },
                        { c: "", w: "" },
                        { c: "EXPERIENCE", w: "**Most recent first.** Each role: title, company, dates, 3–5 bullets." },
                        { c: "  • Built X that did Y, resulting in Z", w: "**Action → object → measurable outcome.** This is the only bullet format that works." },
                        { c: "", w: "" },
                        { c: "PROJECTS", w: "**For early-career.** Treat these exactly like jobs: problem, approach, outcome.", hi: true },
                        { c: "  • Built a RAG system over RBI circulars;", w: "" },
                        { c: "    hybrid search + reranking lifted relevance", w: "" },
                        { c: "    from 78% to 94% on 500-question eval set", w: "" },
                        { c: "  • [live link]  [github]", w: "**Always include the link.** A project without a link is a claim." },
                        { c: "", w: "" },
                        { c: "SKILLS", w: "**A flat list**, grouped loosely. Python, PyTorch, FastAPI, Docker, PostgreSQL, etc." },
                        { c: "", w: "" },
                        { c: "EDUCATION", w: "**Last.** Degree, institution, year. GPA only if it helps." }
                    ]
                }
            },

            { h: "Writing bullets that carry weight" },
            {
                vs: {
                    t: "The same work, two ways", lang: "text",
                    bad: {
                        c: "• Responsible for building machine learning models\n• Worked on data pipelines\n• Helped improve system performance\n• Collaborated with cross-functional teams", label: "Responsibilities — what the job description said",
                        w: "Every ML engineer's resume says this. It tells the reader nothing about what *you* specifically did, how well you did it, or what happened as a result."
                    },
                    good: {
                        c: "• Trained a gradient-boosted churn model on 2M rows;\n  reduced false positives 38%, saving ~₹1.2Cr/yr in\n  retention spend directed at non-churners\n• Built the feature pipeline (Airflow, BigQuery) that\n  replaced a manual Excel process; cut data freshness\n  from 3 days to 4 hours\n• Identified and fixed a label leakage bug that was\n  inflating AUC by 12 points; actual model performance\n  was 0.79, not 0.91", label: "Outcomes — what actually happened",
                        w: "Each bullet names the action, the scale, the result, and — in the third — an honest correction. The leakage bullet is the strongest of the three, because it demonstrates judgement rather than effort."
                    }
                }
            },

            {
                n: "The third bullet — finding the leakage bug — is the kind of thing most people would leave off their resume because it initially looks like admitting a mistake. It is actually the strongest possible signal: you caught an error that inflated results, you fixed it, and you reported the real number. This is exactly the judgement AI teams are hiring for.",
                nt: "Why the honest bullet wins"
            },

            { h: "Metrics when you do not have metrics" },
            {
                tbl: {
                    t: "Proxies that work",
                    h: ["Situation", "What to measure"],
                    rows: [
                        ["No revenue impact to claim", "**Scale:** rows processed, requests served, users affected"],
                        ["No before/after comparison", "**Absolute performance:** accuracy, latency, uptime"],
                        ["Internal tool with no analytics", "**Time saved:** *reduced manual review from 2 hours to 15 minutes*"],
                        ["Open-source or personal project", "**Evaluation results:** *94% relevance on a 500-question golden set*"],
                        ["You improved something but do not know by how much", "**Describe the mechanism:** *replaced O(n²) deduplication with hash-based; query time dropped from minutes to under a second*"]
                    ]
                }
            },

            { h: "The ATS screen" },
            { p: "Before a human sees your resume, a keyword filter probably does. It is looking for exact matches on skills the job posting listed. This is not a conspiracy — it is a company receiving 800 applications and needing to narrow them." },
            {
                l: [
                    "**Use the exact phrases from the job posting.** If they say *retrieval-augmented generation*, use those words, not just *RAG*.",
                    "**Include both the acronym and the full term** the first time: *large language models (LLMs)*.",
                    "**Put skills in a dedicated section** as well as in the bullets. The parser may only read the skills section.",
                    "**Use a simple format.** No tables, text boxes, columns, headers-as-images or fancy layouts. ATS parsers are surprisingly fragile.",
                    "**Submit as PDF**, unless they ask for .docx. Name it `FirstName_LastName_Resume.pdf`."
                ]
            },

            { h: "LinkedIn and GitHub" },
            {
                l: [
                    "**LinkedIn headline is not your job title.** It is a search term: *AI Engineer · RAG · LLMs · FastAPI · PyTorch*.",
                    "**Pin your two strongest repositories on GitHub.** Unpin everything else. The profile page is a portfolio, not a chronological list.",
                    "**Write a GitHub bio** that says what you build, not what you aspire to.",
                    "**Make sure your pinned repos have READMEs.** A pinned repository with no README actively hurts you — it signals that the work is either unfinished or unexplained."
                ]
            },

            { h: "One page" },
            { p: "One page, unless you have more than eight years of relevant experience. Two or three pages for an early-career resume does not signal thoroughness — it signals inability to prioritise, which is the precise skill the resume is supposed to demonstrate." },

            {
                tryit: {
                    t: "Rewrite your bullets",
                    task: "Take your current resume. Rewrite every bullet using the format: action → object → measurable outcome. For bullets where you have no metric, find the closest proxy from the table above. Then delete the weakest two bullets entirely — the constraint is what forces priority.",
                    hint: "Read each bullet and ask: could any ML engineer in the world have written this? If yes, it carries no signal and needs either a specific number or to be cut.",
                    sol: { lang: "text", code: "Before:\n  • Responsible for model development\n  • Worked on improving data quality\n  • Collaborated with the product team\n\nAfter:\n  • Trained a logistic regression baseline + XGBoost\n    model on 800k customer records; XGBoost lifted\n    precision from 0.71 to 0.84 at fixed recall\n  • Built a validation pipeline that flagged 23% of\n    incoming records as duplicates or inconsistent;\n    retrained model on cleaned data, AUC rose 0.06\n  • (deleted 'collaborated' — it said nothing)\n\nTwo bullets instead of three, and each one now\nnames what you did, on what, and what happened." },
                    w: "Cutting bullets is psychologically hard and strategically necessary. A resume with five strong bullets per role reads as confident and selective. One with eight weak bullets reads as a wall of text that the recruiter will not finish."
                }
            },

            ],
        k: [
            "Eight seconds: name, title, company, two bullets. Everything above the fold does all the work.",
            "Action → object → measurable outcome. This is the only bullet format that carries signal.",
            "Finding and fixing a bug that inflated results is a stronger bullet than any accuracy improvement.",
            "Match exact phrases from the job posting for the ATS, and include both acronyms and full terms.",
            "One page unless you have 8+ years. The constraint forces prioritisation, which is itself the skill."
        ],
        
    },

    {
        t: "Where Jobs Actually Come From",
        m: "apply",
        lvl: "core",
        s: "Referrals, channels ranked by yield, targeting, and running the search as a tracked process.",
        goal: [
            "Rank application channels by conversion rate and invest time accordingly",
            "Get a referral from someone who has seen your work",
            "Run the search as a weekly process with a target, not a sporadic hope"
        ],
        b: [
            { p: "The hardest part of a job search is not the interview — it is getting one. The conversion rate from a cold application on a job board is roughly 2–5%. From a referral, it is 30–50%. Almost all job search advice ignores this ratio, which is why almost all job search advice fails." },

            { h: "The channels, ranked by yield" },
            {
                tbl: {
                    t: "Where interviews actually come from",
                    h: ["Channel", "Conversion to interview", "Volume", "Effort per application"],
                    rows: [
                        ["**Referral from someone who has seen your work**", "**30–50%**", "Low", "High — you need the relationship first"],
                        ["**Referral from a connection**", "15–30%", "Low–Medium", "Medium — a warm introduction"],
                        ["**Recruiter inbound on LinkedIn**", "10–20%", "Depends on profile", "Low — but you cannot control the timing"],
                        ["**Direct application to a hiring manager's post**", "5–10%", "Medium", "Medium — targeted and visible"],
                        ["**Job board cold apply**", "**2–5%**", "**High**", "Low — and that is the trap"]
                    ]
                }
            },

            {
                n: "Cold applications are the highest-volume and lowest-yield channel. People default to them because they feel productive — you can send twenty in an afternoon. But twenty applications at 3% is 0.6 interviews, and the same afternoon spent getting one referral is 0.4 interviews from a single application. Referrals are not optional; they are the primary channel.",
                nt: "The maths nobody mentions"
            },

            { h: "Getting referrals without being awkward" },
            { p: "A referral is someone inside a company submitting your name. The best referrals come from people who have seen your work, because they can attach a genuine recommendation. The second best come from connections you have maintained. Cold referral requests from strangers rarely work and often damage the relationship before it exists." },

            {
                ol: [
                    "**Build in public.** Write about what you are building — a short LinkedIn post, a blog, a thread. This is the foundation referrals grow from.",
                    "**Engage with people at target companies.** Comment thoughtfully on their posts, attend their meetups, contribute to their open-source projects.",
                    "**Ask specifically.** *Could you refer me for the AI engineer role on the Retrieval team?* works. *Let me know if there are any openings* does not — it puts the work on them.",
                    "**Make it easy.** Send them your resume, the job link, and a two-sentence summary of why you are a fit. They will copy-paste this into the referral form.",
                    "**Do not ask strangers.** If your only connection to someone is that they work at a company you want to join, you do not have a relationship — you have a cold outreach dressed as a referral request."
                ]
            },

            { h: "The search as a process" },
            {
                tbl: {
                    t: "A weekly rhythm",
                    h: ["Day", "Activity", "Target"],
                    rows: [
                        ["Monday", "**Source 10–15 roles** that match your skills", "Identify the ones worth a targeted application"],
                        ["Tuesday–Wednesday", "**Apply to 5–8**, tailored", "Each application should reference something specific about the role or team"],
                        ["Thursday", "**Reach out to 3–5 people** for conversations or referrals", "Warm connections, not cold spam"],
                        ["Friday", "**Review and track** — what happened this week, what to follow up on", "A spreadsheet, a Notion board, anything that is not memory"],
                        ["Weekend", "**Build or write** — project work, a blog post, something visible", "This feeds the referral channel"]
                    ]
                }
            },

            { h: "Targeting" },
            {
                l: [
                    "**Make a list of 20–30 companies**, not 200. Know why you want each one, what team you would join, and what you would work on.",
                    "**Read the job description carefully.** If it asks for 5 years of experience and you have 0, that is not the listing. If it asks for skills you have but calls them by different names, adjust your resume.",
                    "**Find the hiring manager.** On LinkedIn, find who manages the team. Their posts about the role carry more context than the job listing, and a direct application to their post converts better than one through the portal.",
                    "**Apply to the right level.** Reaching for a role two levels above your experience wastes both your time and theirs. Applying one level above is reasonable; the interview will calibrate."
                ]
            },

            { h: "Tracking" },
            {
                code: {
                    lang: "text", t: "The minimum viable tracker",
                    lines: [
                        { c: "Company | Role | Applied | Channel | Status | Follow-up", w: "" },
                        { c: "--------|------|---------|---------|--------|----------", w: "" },
                        { c: "Razorpay| ML Eng| Aug 12 | Referral (Priya) | Phone screen Aug 19 | Prep system design", hi: true },
                        { c: "Swiggy | AI Eng| Aug 14 | Cold apply | No response | Follow up Aug 28", w: "" },
                        { c: "Flipkart| Data | Aug 15 | HM post on LinkedIn | Acknowledged | Wait", w: "" },
                        { c: "", w: "" },
                        { c: "This week: 8 applied, 3 referral asks, 1 phone screen scheduled", w: "" },
                        { c: "Last week: 7 applied, 2 referral asks, 0 responses", w: "" },
                        { c: "", w: "" },
                        { c: "If no responses after 3 weeks, audit the resume.", w: "**The tracker is what tells you the resume is the problem**, rather than the market.", hi: true }
                    ]
                }
            },

            { trap: "The most dangerous pattern is applying to fifty roles in a day and then waiting. It feels productive. It produces nothing — because untargeted applications at 3% need 200 to produce six interviews, and the energy would have produced the same six interviews from twenty referral-backed applications. Track your yield by channel and invest where it converts." },

            {
                tryit: {
                    t: "Set up the search engine",
                    task: "Create your tracker. List 20 target companies with the specific team and role. For each, find the hiring manager on LinkedIn. Identify 5 people across those companies who you could ask for a referral — not strangers, but people who have seen your work or with whom you have had a genuine interaction.",
                    hint: "If you cannot find 5 people, that is the most important signal. Your next action is to start building in public and engaging with people at target companies — before applying.",
                    sol: { lang: "text", code: "Target list (sample):\n\n  1. Razorpay — ML Platform team\n     HM: [name], principal engineer\n     Referral: Priya (worked together on open-source)\n\n  2. Flipkart — Search Relevance\n     HM: [name], director of ML\n     Referral: none yet — engage with their blog posts\n\n  3. Swiggy — Recommendations\n     HM: [name], senior manager\n     Referral: Arjun (met at PyCon India)\n\n  ...\n\n  Referral contacts: 3 warm, 2 need warming up.\n  Action: reach out to the 3 warm ones this week,\n  start engaging with the 2 others' content." },
                    w: "The list of 20 companies feels small, and that is the point. Twenty companies with research, targeting and referral paths produce more interviews than 200 cold applications. Quality of targeting is the variable that moves the outcome."
                }
            },

            ],
        k: [
            "Cold applications convert at 2–5%; referrals convert at 30–50%. Referrals are the primary channel, not a bonus.",
            "The best referrals come from people who have seen your work — which is why building in public feeds the pipeline.",
            "20 targeted companies with referral paths beat 200 cold applications.",
            "Track by channel and week. The tracker tells you whether the resume is the problem or the targeting is.",
            "A weekly rhythm — source, apply, reach out, track, build — turns a hope into a process."
        ],
        
    }

]);
