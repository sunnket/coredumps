/* Journeys — role-shaped routes through everything else.

   The platform has 24 tracks, 400 lessons, a problem bank, a logic vault and
   a speed trainer. That is a library, and a library is not a plan. A person
   who wants to be hired as an AI engineer does not need to be told that all
   of it exists — they need to be told what to open on Monday.

   Rules this file follows:

   * Weeks are honest, and assume roughly 10-12 focused hours a week. They are
     deliberately not the optimistic numbers a marketing page would use.
   * Every phase names practice, not just reading. Reading without practice is
     the exact failure this platform exists to prevent.
   * Every phase ends with `proof`: something you can DO, stated so plainly
     that you can test yourself honestly.
   * Nothing references a track that does not exist. Where a journey needs a
     track that has not been written yet, the phase says so in `goal` rather
     than silently pointing at nothing. */

TD.defineJourneys([

  /* ================================================================== */
  {
    id: "ai",
    name: "AI / ML Engineer",
    short: "AI Engineer",
    icon: "brain",
    col: "#8b5cf6",
    deck: "Python, maths, models, and the production skill that separates a notebook from a product.",
    desc: "The role that builds systems on top of models — training some, calling others, and being responsible for whether the result is reliable enough to ship. This is the longest of the four journeys because it needs both the maths and the engineering, and skipping either is what produces candidates who can fine-tune a model but cannot deploy one.",
    market: "The most competitive of the four for freshers, and the one where a portfolio matters most. Expect to be asked about evaluation and cost as often as about architectures.",

    phases: [
      {
        id: "found",
        name: "Foundations",
        weeks: "Weeks 1–4",
        weekCount: 4,
        goal: "Get the machine working, learn the concepts once in no language, then spend them on Python. Do not skip the concepts stage even if you are impatient — it is the one most courses omit, and its absence is why people stall in month two.",
        tracks: ["zero", "basics"],
        practice: [
          { href: "#/speed/keys", label: "Speed Coding, rung 1", why: "Type the keywords until they cost you nothing. Ten minutes a day." },
          { href: "#/quiz/basics", label: "Basics question bank", why: "Assignment, types and scope — the confusions that stall people in month two." },
          { href: "#/drill", label: "Daily drill", why: "Whatever you learned yesterday, from memory today." }
        ],
        proof: "You can open a terminal, write a 30-line Python script from a blank file, and read an error message without panic."
      },
      {
        id: "lang",
        name: "Python, properly",
        weeks: "Weeks 5–12",
        weekCount: 8,
        goal: "All of Python, including the parts tutorials skip: comprehensions, generators, decorators, and why loops in NumPy are a mistake. SQL alongside it, because every data job needs it and it is small enough to learn in parallel.",
        tracks: ["python", "sql"],
        practice: [
          { href: "#/code", label: "Code Dojo", why: "Start the array and hashing problems. Two a day beats twenty on Sunday." },
          { href: "#/speed/lines", label: "Speed Coding, rung 2", why: "Whole lines, timed. Fluency is what you are building here." },
          { href: "#/logic/complexity", label: "Logic Vault: complexity", why: "Big-O and the latency numbers, before you need them in an interview." }
        ],
        proof: "You can write a script that reads a CSV, cleans it, groups it and writes the result — without looking up the syntax."
      },
      {
        id: "tools",
        name: "The professional layer",
        weeks: "Weeks 13–15",
        weekCount: 3,
        goal: "Git before you lose work, not after. This is short but non-negotiable: every job assumes it, and no job teaches it.",
        tracks: ["git"],
        practice: [
          { href: "#/quiz/git", label: "Git question bank", why: "The three places, and how to undo something already pushed." },
          { href: "#/code", label: "Code Dojo", why: "Keep going — pointers, sliding window, binary search." }
        ],
        proof: "You can branch, commit, resolve a merge conflict, and open a pull request without a tutorial open."
      },
      {
        id: "maths",
        name: "Maths and classical ML",
        weeks: "Weeks 16–23",
        weekCount: 8,
        goal: "Enough maths to read a paper and size a model, then the classical ML that everything else is built on. Overfitting, the split, and which metric to quote are worth more in an interview than any architecture.",
        tracks: ["math", "ml"],
        practice: [
          { href: "#/quiz/ml", label: "ML question bank", why: "After each module. The questions are harder than the lessons on purpose." },
          { href: "#/logic/ml", label: "Logic Vault: ML core", why: "Bias-variance and precision/recall until you can say them cold." }
        ],
        proof: "You can explain why a model with 99% accuracy might be worthless, and pick the right metric for a given problem."
      },
      {
        id: "deep",
        name: "Deep learning and language models",
        weeks: "Weeks 24–35",
        weekCount: 12,
        goal: "Neural networks from one neuron to transformers, then generative models, then the LLM engineering that the job is actually about. This is the longest phase and the one that most defines the role.",
        tracks: ["dl", "nlp", "llm", "finetune"],
        practice: [
          { href: "#/speed/aieng", label: "Speed Coding: the training loop", why: "zero_grad, forward, loss, backward, step — from memory, fast." },
          { href: "#/logic/aieng", label: "Logic Vault: the AI engineer's shelf", why: "Tokens, RAG, evals, agents. The working set of the job." },
          { href: "#/quiz/dl", label: "DL question bank", why: "Including the generative and frontier modules." }
        ],
        proof: "You can write a training loop from a blank file, explain why RAG usually beats fine-tuning, and describe how you would evaluate a non-deterministic system."
      },
      {
        id: "ship",
        name: "Shipping it",
        weeks: "Weeks 36–43",
        weekCount: 8,
        goal: "The half of the job that notebooks never teach: serving a model behind an API, containerising it, understanding the machine it runs on, and knowing what breaks at scale.",
        tracks: ["backend", "docker", "osnet", "cloud", "mlops"],
        practice: [
          { href: "#/logic/systems", label: "Logic Vault: systems", why: "Idempotency, backpressure, circuit breakers — the vocabulary of a design review." },
          { href: "#/projects/aiml", label: "Project Lab", why: "Start your first real portfolio project now, not at the end." }
        ],
        proof: "You can take a model from a notebook to a containerised API with a health check, and say what happens when it gets ten times the traffic."
      },
      {
        id: "prove",
        name: "Portfolio and interview",
        weeks: "Weeks 44–52",
        weekCount: 9,
        goal: "Two finished projects with live links, then the interview machinery: DSA, system design, and the human filters that reject more candidates than technical skill does.",
        tracks: ["dsa", "systemdesign", "hunt", "english", "conduct", "aptitude"],
        practice: [
          { href: "#/interviews", label: "Interview Bank", why: "Answer out loud before opening the answer. Reading is not practice." },
          { href: "#/quiz/hunt", label: "Job hunt question bank", why: "What makes a project count, and how to answer the salary question." },
          { href: "#/speak", label: "Speaking Practice", why: "Explaining a project is a separate skill from building it." },
          { href: "#/speed/slow", label: "Speed run", why: "Whatever your hands are still slow at, before someone is watching." }
        ],
        proof: "Two deployed projects with public links, and the ability to explain any decision in either of them under questioning."
      }
    ]
  },

  /* ================================================================== */
  {
    id: "backend",
    name: "Backend & Systems Engineer",
    short: "Backend Engineer",
    icon: "server",
    col: "#10b981",
    deck: "APIs, databases, the machine underneath, and what happens at scale.",
    desc: "The most reliable route into the industry: for every AI role posted there are many more backend ones, and the skills transfer into AI work later if you want them to. This journey is shorter than the AI one because it needs less maths, not because it is easier.",
    market: "The largest and most forgiving market for freshers. Solid fundamentals plus one well-built, deployed project beats a long list of tutorials.",

    phases: [
      {
        id: "found",
        name: "Foundations",
        weeks: "Weeks 1–4",
        weekCount: 4,
        goal: "The machine, the terminal, and the concepts of programming taught once in no language.",
        tracks: ["zero", "basics"],
        practice: [
          { href: "#/speed/keys", label: "Speed Coding, rung 1", why: "Keywords and punctuation until they are automatic." }
        ],
        proof: "You can navigate a filesystem from the terminal and write a small script from scratch."
      },
      {
        id: "lang",
        name: "Language and data",
        weeks: "Weeks 5–13",
        weekCount: 9,
        goal: "Python thoroughly, and SQL properly rather than superficially — a backend engineer who cannot write a join and read a query plan is not finished.",
        tracks: ["python", "sql"],
        practice: [
          { href: "#/code", label: "Code Dojo", why: "Arrays, hashing, two pointers. Little and often." },
          { href: "#/logic/data", label: "Logic Vault: databases", why: "ACID, indexes, and the N+1 problem you will meet in week one of a real job." },
          { href: "#/quiz/sql", label: "SQL question bank", why: "" }
        ],
        proof: "You can design a small schema, write the queries against it, and explain why you indexed what you indexed."
      },
      {
        id: "tools",
        name: "Version control",
        weeks: "Weeks 14–16",
        weekCount: 3,
        goal: "Git, including the parts people avoid: branching, merge conflicts, and rebasing.",
        tracks: ["git"],
        practice: [
          { href: "#/speed/shell", label: "Speed Coding: terminal", why: "Fumbling git in front of an interviewer reads as inexperience." },
          { href: "#/quiz/git", label: "Git question bank", why: "Branches, conflicts, and why a pushed commit needs revert not reset." }
        ],
        proof: "You can resolve a merge conflict calmly and explain what a rebase does to history."
      },
      {
        id: "api",
        name: "Building services",
        weeks: "Weeks 17–26",
        weekCount: 10,
        goal: "HTTP as it really works, then APIs, then the operating system and network underneath them — because a backend engineer who cannot diagnose a hung connection is stuck the first time production misbehaves.",
        tracks: ["backend", "osnet", "docker"],
        practice: [
          { href: "#/logic/systems", label: "Logic Vault: systems", why: "Idempotency and retries, before you build something that charges a card twice." },
          { href: "#/quiz/osnet", label: "OS & Networking bank", why: "" },
          { href: "#/projects/backend", label: "Project Lab", why: "Build something real and deploy it. A live link is worth more than a repository." }
        ],
        proof: "You can build an API with authentication, containerise it, deploy it, and diagnose it when it stops responding."
      },
      {
        id: "scale",
        name: "Scale and cloud",
        weeks: "Weeks 27–34",
        weekCount: 8,
        goal: "What breaks when one server becomes ten, and how to run it somewhere other than your laptop.",
        tracks: ["cloud", "systemdesign"],
        practice: [
          { href: "#/logic/complexity", label: "Logic Vault: cost and latency", why: "Little's Law and the latency ladder decide architectures." },
          { href: "#/quiz/systemdesign", label: "System design bank", why: "" }
        ],
        proof: "You can whiteboard a URL shortener or a rate limiter and defend every trade-off you made."
      },
      {
        id: "prove",
        name: "Portfolio and interview",
        weeks: "Weeks 35–44",
        weekCount: 10,
        goal: "Finish two deployed projects, then work the interview loop deliberately.",
        tracks: ["dsa", "hunt", "english", "conduct", "aptitude"],
        practice: [
          { href: "#/interviews", label: "Interview Bank", why: "Out loud, before reading the answer." },
          { href: "#/speak", label: "Speaking Practice", why: "" },
          { href: "#/code", label: "Code Dojo", why: "Finish the bank. Aim for recognition of the pattern, not memorisation of the solution." }
        ],
        proof: "Two live services you built, and fluent answers on how each one would behave under load."
      }
    ]
  },

  /* ================================================================== */
  {
    id: "data",
    name: "Data Analyst / Data Engineer",
    short: "Data",
    icon: "database",
    col: "#f59e0b",
    deck: "SQL, Python, statistics, pipelines — and the judgement to know when a number is lying.",
    desc: "The fastest of the four to become employable in, because the core skill — SQL plus honest analysis — can be learned in months rather than years. It is also the most common first step into an ML career later.",
    market: "The shortest route from beginner to a paying job. Analyst roles hire on SQL fluency and clear communication far more than on programming depth.",

    phases: [
      {
        id: "found",
        name: "Foundations",
        weeks: "Weeks 1–3",
        weekCount: 3,
        goal: "The machine and the concepts. Shorter here than in the other journeys, because analysis work needs less software engineering.",
        tracks: ["zero", "basics"],
        practice: [
          { href: "#/speed/keys", label: "Speed Coding, rung 1", why: "" }
        ],
        proof: "You can run a script and read an error."
      },
      {
        id: "sql",
        name: "SQL until it is boring",
        weeks: "Weeks 4–10",
        weekCount: 7,
        goal: "This is the phase that gets you hired. Every join, every aggregate, window functions, and reading a query plan. Do not rush it — depth here beats breadth everywhere else.",
        tracks: ["sql"],
        practice: [
          { href: "#/quiz/sql", label: "SQL question bank", why: "Every module. Twice." },
          { href: "#/logic/data", label: "Logic Vault: databases", why: "Indexes and normalisation — why a query is instant on one table and fatal on another." }
        ],
        proof: "You can answer a vague business question by writing the query yourself, including the joins you were not told about."
      },
      {
        id: "python",
        name: "Python for data",
        weeks: "Weeks 11–18",
        weekCount: 8,
        goal: "Python through pandas and NumPy — the analysis half of the toolkit, and the point where 'why are loops slow' stops being abstract.",
        tracks: ["python"],
        practice: [
          { href: "#/speed/lines", label: "Speed Coding, rung 2", why: "`df = pd.read_csv(path)` should cost you no thought." },
          { href: "#/quiz/python", label: "Python question bank", why: "" }
        ],
        proof: "You can load a messy dataset, clean it, join it to another, and produce a chart that answers a question."
      },
      {
        id: "stats",
        name: "Statistics and honesty",
        weeks: "Weeks 19–25",
        weekCount: 7,
        goal: "The maths that stops you being fooled — base rates, distributions, and why an average hides the thing that matters. Then classical ML, which is where analysis becomes prediction.",
        tracks: ["math", "ml"],
        practice: [
          { href: "#/logic/math", label: "Logic Vault: the working set", why: "Bayes and base rates. The most misunderstood idea in applied statistics." },
          { href: "#/quiz/math", label: "Maths question bank", why: "" }
        ],
        proof: "You can explain why a 99%-accurate test for a rare condition is mostly wrong, using numbers."
      },
      {
        id: "pipe",
        name: "Pipelines and scale",
        weeks: "Weeks 26–33",
        weekCount: 8,
        goal: "When the data stops fitting in memory, and how it gets from where it is produced to where it is analysed.",
        tracks: ["docker", "cloud", "mlops"],
        practice: [
          { href: "#/projects/data", label: "Project Lab", why: "Build a pipeline that runs on a schedule and does not need you." }
        ],
        proof: "You can build a pipeline that ingests, transforms and stores data on a schedule, and explain what happens when it fails."
      },
      {
        id: "prove",
        name: "Portfolio and interview",
        weeks: "Weeks 34–42",
        weekCount: 9,
        goal: "Analysis work is judged on communication as much as correctness — a correct answer nobody understands is worth nothing here.",
        tracks: ["hunt", "english", "conduct", "aptitude"],
        practice: [
          { href: "#/speak", label: "Speaking Practice", why: "Presenting a finding is the job, not an extra." },
          { href: "#/interviews", label: "Interview Bank", why: "" }
        ],
        proof: "A published analysis with a clear narrative, and the ability to defend your method when someone disagrees with the conclusion."
      }
    ]
  },

  /* ================================================================== */
  {
    id: "web",
    name: "Full-Stack Web Engineer",
    short: "Full-Stack",
    icon: "browser",
    col: "#0ea5e9",
    deck: "The browser, the server, and everything between them.",
    desc: "The largest hiring market in software, and the shortest route from beginner to something you can show someone: a page you built, live, on a real domain. HTML and CSS give a page shape and appearance; JavaScript is what makes it do anything.",
    market: "The biggest market by volume, and the one where a portfolio of live sites substitutes most effectively for a degree.",

    phases: [
      {
        id: "found",
        name: "Foundations",
        weeks: "Weeks 1–4",
        weekCount: 4,
        goal: "The machine, the terminal, and programming concepts in no language.",
        tracks: ["zero", "basics"],
        practice: [
          { href: "#/speed/keys", label: "Speed Coding, rung 1", why: "" }
        ],
        proof: "You can run a script and read an error message."
      },
      {
        id: "markup",
        name: "The browser's own languages",
        weeks: "Weeks 5–9",
        weekCount: 5,
        goal: "HTML for structure and CSS for layout — including flexbox and grid, which is where most people's CSS actually breaks.",
        tracks: ["html", "css"],
        practice: [
          { href: "#/quiz/css", label: "CSS question bank", why: "The cascade and specificity questions are the ones that stop 'my CSS isn't working'." },
          { href: "#/projects/extras", label: "Project Lab", why: "Rebuild a page you like from scratch. Nothing teaches CSS faster." }
        ],
        proof: "You can build a responsive page from a design, without a framework, and explain why it reflows the way it does."
      },
      {
        id: "js",
        name: "JavaScript",
        weeks: "Weeks 10–20",
        weekCount: 11,
        goal: "The language the browser actually runs. Syntax first, then the DOM, then the async model — which is the part that confuses everyone arriving from a language where things block. TypeScript and React at the end, because both make far more sense once plain JavaScript is solid.",
        tracks: ["js"],
        practice: [
          { href: "#/logic/craft", label: "Logic Vault: engineering judgement", why: "Language-independent, and useful throughout." },
          { href: "#/code", label: "Code Dojo", why: "The problems are Python, but the patterns transfer directly." },
          { href: "#/quiz/js", label: "JavaScript question bank", why: "After each module — the equality and async questions especially." },
          { href: "#/speed/jslines", label: "Speed Coding: JavaScript", why: "Arrow syntax and template literals are shapes your fingers have never made. Ten minutes a day." }
        ],
        proof: "You can manipulate the DOM, handle events, call an API with fetch, and explain what await actually does."
      },
      {
        id: "server",
        name: "The server side",
        weeks: "Weeks 21–30",
        weekCount: 10,
        goal: "Databases, APIs, and the machine underneath. Python here rather than Node, because the platform teaches it properly and the concepts port directly.",
        tracks: ["python", "sql", "backend", "git"],
        practice: [
          { href: "#/logic/data", label: "Logic Vault: databases", why: "" },
          { href: "#/projects/backend", label: "Project Lab", why: "Full stack means one project with both halves. Build it now." }
        ],
        proof: "You can build and deploy a full application with a database, authentication and a real domain."
      },
      {
        id: "ship",
        name: "Deploy and operate",
        weeks: "Weeks 31–36",
        weekCount: 6,
        goal: "Containers, hosting, and enough networking to diagnose why the site is down.",
        tracks: ["docker", "osnet", "cloud"],
        practice: [
          { href: "#/quiz/osnet", label: "OS & Networking bank", why: "" },
          { href: "#/logic/systems", label: "Logic Vault: systems", why: "" }
        ],
        proof: "Your project is live on a real domain over HTTPS, and you can explain every step of the request that serves it."
      },
      {
        id: "prove",
        name: "Portfolio and interview",
        weeks: "Weeks 37–46",
        weekCount: 10,
        goal: "Three live sites beat any certificate in this market.",
        tracks: ["dsa", "systemdesign", "hunt", "english", "conduct"],
        practice: [
          { href: "#/interviews", label: "Interview Bank", why: "" },
          { href: "#/speak", label: "Speaking Practice", why: "" }
        ],
        proof: "Three deployed projects with public links, and fluency explaining the architecture of each."
      }
    ]
  }

]);
