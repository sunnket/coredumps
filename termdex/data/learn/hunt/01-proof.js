/* Portfolio & the Job Hunt — building proof. */
TD.addLessons("hunt", [

    {
        t: "What Makes a Project Count",
        m: "proof",
        lvl: "core",
        s: "The difference between projects that change a hiring decision and projects that fill a GitHub profile.",
        goal: [
            "Choose projects that demonstrate the skills a hiring manager is checking for",
            "Finish a project end to end rather than collecting half-built repositories",
            "Deploy it so a stranger can try it without cloning anything"
        ],
        b: [
            { p: "A project counts when a hiring manager can see it, understand it in three minutes, and conclude you can do the job. That is a much narrower standard than *interesting to build*, and almost every candidate's portfolio fails it — not because the work is bad, but because it is invisible, unexplained or unfinished." },

            { h: "The three things that matter" },
            {
                tbl: {
                    t: "What a project must have",
                    h: ["Property", "Why", "What most people miss"],
                    rows: [
                        ["**Deployed and reachable**", "A link that works beats a repository that requires setup", "A README that says *clone and run* is read by approximately nobody"],
                        ["**Solves a legible problem**", "The reviewer needs to understand the point in ten seconds", "A generic TODO or weather app solves nothing identifiable and demonstrates nothing scarce"],
                        ["**Has a write-up**", "The reviewer cannot run your code and will not read your source", "A bare repository with no README is invisible regardless of quality"]
                    ]
                }
            },

            {
                n: "A single deployed project with a clear write-up outperforms ten repositories with default READMEs. Hiring managers skim. They open the link, see whether it works, read the first paragraph, and move on. Everything above the fold is doing all of the work.",
                nt: "The harsh arithmetic"
            },

            { h: "Projects worth building for AI roles" },
            {
                tbl: {
                    t: "Ranked by signal strength",
                    h: ["Project type", "What it proves", "Signal"],
                    rows: [
                        ["**RAG system over a real corpus**", "Retrieval, evaluation, prompt engineering, system design", "**Very high** — this is the most-asked-about project in AI interviews"],
                        ["**End-to-end ML pipeline**", "Data handling, training, evaluation, deployment", "High — especially if the data is messy and you document the decisions"],
                        ["**Fine-tuned model with evaluation**", "Adaptation techniques, honest evaluation, cost analysis", "High — if you can explain why fine-tuning was worth it over prompting"],
                        ["**API wrapping a model**", "Backend skills, error handling, cost control", "Medium-high — closer to what the daily job looks like"],
                        ["**Data analysis with a finding**", "Pandas, SQL, statistical reasoning, communication", "Medium — strong if the finding is genuinely interesting"],
                        ["**A classifier on a Kaggle dataset**", "Basic ML pipeline", "**Low** — everyone has one and the data was already clean"]
                    ]
                }
            },

            { trap: "The most common portfolio mistake is breadth without depth. Five half-finished projects signal that you start things and do not finish them, which is the precise opposite of the signal you want. Two finished, deployed, explained projects beat five abandoned ones every time." },

            { h: "The anatomy of a project that counts" },
            {
                ol: [
                    "**A problem statement in one sentence.** Not the technology — the problem. *Answers questions over Reserve Bank of India circulars using retrieval-augmented generation.*",
                    "**A live link.** Deployed, working, reachable. If it costs money to keep running, use a free tier and accept the cold start.",
                    "**A README that answers the hiring manager's questions.** What it does, how it works, what trade-offs you made, what the results are, and one honest limitation.",
                    "**A demo or screenshot.** For the reviewer who will not click the link but will look at the image.",
                    "**Clean, readable code.** Not perfect — readable. Functions named clearly, no dead code, no commented-out experiments left in."
                ]
            },

            { h: "Finishing" },
            { p: "The hardest part of a portfolio project is finishing it. The interesting part is the first 60% — the architecture, the data pipeline, the first working retrieval. The remaining 40% is error handling, edge cases, deployment, a README and a demo, and it is where the signal actually lives." },

            {
                l: [
                    "**Set a deadline.** Two weeks for a focused project. Three for something ambitious. Beyond that you are either building too much or procrastinating.",
                    "**Cut scope aggressively.** The best portfolio projects do one thing well, not three things roughly.",
                    "**Deploy before you are ready.** Deploying on day two and iterating is far easier than deploying on day fourteen after the code has calcified around assumptions that do not survive contact with a server.",
                    "**Write the README while you remember why you made each decision.** A month later you will not remember, and the README will show it."
                ]
            },

            { h: "What not to build" },
            {
                l: [
                    "**Tutorials you followed.** If the architecture was chosen for you, the project demonstrates that you can follow instructions, which is not the skill being assessed.",
                    "**Exact copies of course projects.** Interviewers have seen them, and asking one question about a decision you did not make ends the conversation.",
                    "**Anything that requires the reviewer to install dependencies.** If it does not have a live link, it does not exist.",
                    "**Anything you cannot explain in a deep-dive.** If you used a library without understanding what it does, an interviewer will find that in about ninety seconds."
                ]
            },

            {
                tryit: {
                    t: "Audit your own portfolio",
                    task: "List every project on your GitHub. For each, answer: (1) Is there a live link? (2) Can a stranger understand what it does in 30 seconds? (3) Does the README explain a trade-off? (4) Would you be comfortable in a 45-minute deep-dive? Kill or archive everything that fails all four. Pick the strongest one and spend today writing a proper README for it.",
                    hint: "If nothing passes, that is the most useful finding. It means your next project should be designed for the portfolio from day one.",
                    sol: { lang: "text", code: "A realistic audit:\n\n  todo-app          — no link, generic, no README      → archive\n  ml-experiments    — 12 notebooks, no thread, no deploy → archive\n  sentiment-model   — trained on IMDB, no write-up     → archive\n  rag-circular      — deployed, has README, messy code  → KEEP, clean up\n  api-project       — works locally, no deploy          → deploy this week\n\n  Result: 2 keepers, 3 archived.\n  Action: write the rag-circular README today,\n          deploy api-project by Thursday." },
                    w: "Most people find that 70–80% of their repositories are noise. Archiving them is not losing work — it is making the remaining work visible. A GitHub profile with two strong pinned projects reads better than one with forty repositories and no signal."
                }
            },

            { vocab: ["Deployment", "README"] }
        ],
        k: [
            "A project counts when it is deployed, solves a legible problem, and has a write-up a stranger can read in three minutes.",
            "Two finished projects beat five abandoned ones — breadth without depth signals you do not finish things.",
            "RAG systems and end-to-end ML pipelines are the highest-signal AI portfolio projects right now.",
            "Deploy on day two, not day fourteen. Write the README while you still remember your decisions.",
            "Archive everything that fails the audit. Making the strong work visible is the whole point."
        ],
        r: ["Deployment", "README", "Version Control"]
    },

    {
        t: "Writing It Up So a Stranger Can Evaluate It",
        m: "write",
        lvl: "core",
        s: "READMEs, write-ups and demos — turning work into evidence that survives a three-minute scan.",
        goal: [
            "Write a README that answers a hiring manager's questions before they are asked",
            "Structure a project write-up as a decision narrative rather than a feature list",
            "Create a demo that shows the project working without requiring any setup"
        ],
        b: [
            { p: "The reviewer will not clone your repository, install your dependencies, or read your source code. They will read the README, glance at the structure, and possibly click a link. Everything you want them to know must be in those first three minutes of contact." },

            { h: "The README template" },
            {
                code: {
                    lang: "markdown", t: "What a hiring manager is actually looking for",
                    lines: [
                        { c: "# Project Name", w: "" },
                        { c: "", w: "" },
                        { c: "> One sentence: what it does and why.", w: "**The first line is the most important line.** If they read nothing else, this must work.", hi: true },
                        { c: "", w: "" },
                        { c: "## What it does", w: "" },
                        { c: "Two to three sentences. The problem, the approach, the result.", w: "**Not the technology — the problem.** Technologies go in the next section." },
                        { c: "", w: "" },
                        { c: "## How it works", w: "" },
                        { c: "Architecture in one paragraph. A diagram if it helps.", w: "Retrieval → reranking → generation, or train → evaluate → serve. The pipeline." },
                        { c: "", w: "" },
                        { c: "## Key decisions", w: "**This is the section that separates you** from someone who followed a tutorial.", hi: true },
                        { c: "- Why hybrid search over pure vector search", w: "" },
                        { c: "- Why I used a smaller model with LoRA instead of a larger one", w: "" },
                        { c: "- Why cursor pagination instead of offset", w: "" },
                        { c: "", w: "" },
                        { c: "## Results", w: "" },
                        { c: "Metrics, with honest context.", w: "**A number without context is noise.** *92% accuracy* means nothing; *92% accuracy on a held-out set of 500 questions, up from 78% with naive prompting* means something." },
                        { c: "", w: "" },
                        { c: "## Limitations", w: "" },
                        { c: "What it does not handle, and what you would do next.", w: "**Honesty here is a strong signal.** It shows you can evaluate your own work — a skill many senior engineers lack.", hi: true },
                        { c: "", w: "" },
                        { c: "## Run it", w: "" },
                        { c: "Live: https://your-project.example.com", w: "**Link first.** Docker instructions second. Local setup last." },
                        { c: "Docker: docker compose up", w: "" },
                        { c: "", w: "" },
                        { c: "## Stack", w: "" },
                        { c: "Python, FastAPI, ChromaDB, sentence-transformers, Docker", w: "A flat list. The recruiter's keyword scanner reads this." }
                    ]
                }
            },

            {
                n: "The *Key decisions* section is what an interviewer will ask about in the project deep-dive. Every decision you write there is a question you have already prepared for, and a question they do not have to invent — which means you are steering the conversation onto ground you know.",
                nt: "Why this section matters disproportionately"
            },

            { h: "The write-up, for longer projects" },
            { p: "A blog-style write-up of a substantial project is the single most effective portfolio artefact for AI roles. It demonstrates communication, technical depth, and the ability to evaluate trade-offs — three things a repository alone cannot show." },

            {
                ol: [
                    "**Start with the problem, not the solution.** Why did this need solving? What was wrong with the existing approach?",
                    "**Narrate the decisions.** I tried X, it failed because Y, so I switched to Z. This is what the interviewer wants to hear, and it is impossible to fabricate.",
                    "**Show the metrics and explain what they mean.** Charts are good. Charts with annotations explaining what happened at each inflection point are better.",
                    "**Include at least one failure.** Something you tried that did not work and why. This is the section that convinces a senior engineer you actually did the work.",
                    "**End with limitations and next steps.** What would you do with another week? Another month? This shows scope awareness."
                ]
            },

            { h: "The demo" },
            {
                l: [
                    "**A 60-second screen recording** is worth more than a paragraph of description. Loom, OBS, or a GIF.",
                    "**Show the happy path, then an edge case.** The edge case is what separates this from a demo reel.",
                    "**Include it in the README.** Embed the GIF or link the video. Do not make the reviewer go looking for it.",
                    "**If the service has a cold start**, say so. A 20-second loading spinner with no explanation looks broken; with a one-line note it looks honest."
                ]
            },

            { h: "Common mistakes" },
            {
                tbl: {
                    t: "What kills a good project's signal",
                    h: ["Mistake", "Why it hurts", "Fix"],
                    rows: [
                        ["No README at all", "The project is invisible", "Write it today, while you remember the decisions"],
                        ["README lists features, not decisions", "Sounds like marketing copy, not engineering", "Replace *supports X* with *I chose X because Y*"],
                        ["README says *work in progress*", "Signals unfinished, even if it works", "Remove the disclaimer and list limitations honestly instead"],
                        ["No metrics, or metrics without context", "A number alone is noise", "Compare to a baseline and explain the gap"],
                        ["No live link", "95% of reviewers will not clone", "Deploy to a free tier; cold starts are acceptable"],
                        ["Messy commit history", "Visible in 10 seconds", "Squash before sharing, or start a clean repo"]
                    ]
                }
            },

            {
                tryit: {
                    t: "Write the README that gets you an interview",
                    task: "Pick your strongest project. Write the full README following the template above. Then send it to someone who has never seen the project and time how long it takes them to explain back to you what it does and what decision you are most proud of. If it takes longer than three minutes, cut.",
                    hint: "The test is not whether they understand the technology. The test is whether they understand the problem and the trade-off. If they can say *you chose hybrid search because vector-only missed keyword matches*, the README works.",
                    sol: { lang: "text", code: "Feedback you are looking for:\n\n  'It answers questions over RBI circulars using RAG'\n    ✓ they got the problem\n\n  'You used hybrid search because keywords matter\n   for regulatory language'\n    ✓ they got a decision\n\n  'The accuracy went from 78% to 92% on a 500-question\n   held-out set'\n    ✓ they got a metric with context\n\n  'It struggles with tables in PDFs'\n    ✓ they got a limitation\n\n  Total time: under 2 minutes.\n  If it took longer, the README has too much preamble\n  or the decisions are buried below the fold." },
                    w: "The three-minute test is ruthless and effective. If a non-technical person can explain the project after reading the README, a hiring manager certainly can. If they cannot, no amount of code quality will save you — because nobody will read the code."
                }
            },

            { vocab: ["README"] }
        ],
        k: [
            "The reviewer will read the README, glance at the structure, and possibly click a link — that is all.",
            "The Key Decisions section steers the deep-dive onto ground you have already prepared.",
            "A number without context is noise — always compare to a baseline and explain the gap.",
            "Include at least one failure in a write-up. It is what convinces a senior engineer the work is yours.",
            "Test: if a stranger cannot explain your project in three minutes from the README, cut until they can."
        ],
        r: ["README", "Deployment"]
    }

]);
