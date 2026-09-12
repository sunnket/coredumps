/* Career Roadmap — AI & Machine Learning roles.

   Shape of a role, once, here at the top so the rest read quickly:

     what    what the job actually is, past the job title
     day     a real day, hour by hour — the strongest signal of fit there is
     fit     who thrives, who quietly hates it
     skills  grouped matrix. lvl: "must" | "should" | "edge"
     stack   the tools that appear in the job posting
     edge    what separates competent from sought-after
     ladder  the levels, with years and money
     pay     India, fixed CTC, in lakhs per annum
     cos     who hires, by tier — because tier is the biggest pay multiplier
     hire    the interview loop, stage by stage, with how to pass each
     proof   portfolio projects that actually change a hiring decision
     plan    the study order. A step whose track does not exist yet
             renders as "coming soon" on its own — see TD.resolveStep
     myths   what beginners believe that costs them months
     next    adjacent roles, by slug
     r       dictionary terms worth reading
*/

TD.addRoles("ai", [

  /* ==================================================================== */
  {
    id: "ai-engineer",
    t: "AI Engineer",
    a: "LLM Engineer · Applied AI Engineer · GenAI Engineer",
    icon: "brain",
    tag: "Most in demand",
    demand: "explosive",
    deck: "You build products on top of models — retrieval, agents, evaluation, and all the unglamorous plumbing that makes a demo survive real users.",

    what: [
      "The title is new and the market has not agreed on it, so read the description not the heading. Roughly speaking there are two jobs wearing this name, and they want different people.",
      "**The common one — applied AI engineering.** You take models that already exist and turn them into something a business can sell. Retrieval pipelines, agent loops, tool calling, prompt and context engineering, evaluation harnesses, guardrails, latency and cost work. You will write far more ordinary backend code than you expect, and the machine learning you need is *conceptual* — you must know what an embedding is and why your retrieval is returning rubbish, but you will not be deriving gradients.",
      "**The rarer one — model engineering.** You fine-tune, distil, quantise and serve models, and occasionally train them. This one genuinely needs the mathematics, and it mostly hires people with a master's degree, publications, or a few years of ML engineering behind them.",
      "For someone entering the field now, the applied role is the realistic and the more available target — and it is not a lesser one. It is where most of the money currently is, because it is where the products are. The scarce skill in 2026 is not *can you call an API*; it is **can you make an AI feature reliable enough to charge money for**. Almost anyone can build a demo that works. Very few can build one that still works on the ten-thousandth user, at a cost that does not eat the margin.",
      "That gap — demo to production — is the entire job. Internalise it and everything else on this page is detail."
    ],

    day: [
      { t: "9:30", d: "Read overnight evaluation runs. Your retrieval quality dipped on one query class after yesterday's chunking change — you look at twenty failing examples by hand, because aggregate metrics never tell you *why*." },
      { t: "10:30", d: "Standup. Product wants the assistant to handle uploaded PDFs. You spend the rest of it explaining, without condescension, why 'it should just read the PDF' is four weeks of work." },
      { t: "11:00", d: "Real engineering block. Rewrite the chunking strategy, add a reranker, wire it behind a feature flag. This is mostly Python, mostly plumbing, and it is where the value is created." },
      { t: "14:00", d: "A production incident. Latency has doubled at p95. It turns out to be a retry storm against the model provider, not the model. Most of your incidents will be like this — the AI is fine, the system around it is not." },
      { t: "15:30", d: "Write forty new evaluation cases for the failure a customer reported. Boring. This is the actual craft; everything else is downstream of whether you can measure quality." },
      { t: "16:30", d: "Read. A new technique, a paper summary, a competitor's release notes. In this field the reading is the job, not a luxury — the ground moves under you every quarter." },
      { t: "17:30", d: "Cost review. Someone shipped a prompt that quietly costs ₹4 per request. You cache it, shrink the context and cut it by ninety percent." }
    ],

    fit: {
      love: [
        "You like building systems more than proving theorems.",
        "Ambiguity does not paralyse you — nobody will tell you what 'good' means, you have to define it and defend it.",
        "You enjoy debugging things that fail probabilistically rather than deterministically, which is a genuinely different mental sport.",
        "You are willing to read continuously, forever, because the field will not stop moving.",
        "You get satisfaction from making something reliable, not just from making it work once."
      ],
      avoid: [
        "You want a stable, settled stack. This is the opposite of that; the tool you master this year may be irrelevant in two.",
        "You want to do research and publish. That is the research engineer path, not this one.",
        "You dislike writing evaluation code and documentation — that is the majority of a senior AI engineer's day.",
        "You need certainty that your work is correct. Here it is a distribution, not a proof."
      ]
    },

    skills: [
      {
        g: "Foundation — non-negotiable",
        note: "Nobody will interview you without these. They are also the ones that stay valuable when the current tools are gone.",
        items: [
          { n: "Python, genuinely fluent", lvl: "must", d: "Not 'I did a course'. Comfortable with generators, async, typing, decorators, context managers, virtual environments and packaging. You will live here every day.", track: "python" },
          { n: "Git and collaborative workflow", lvl: "must", d: "Branches, pull requests, review, resolving conflicts without panic. Non-negotiable the moment you work with anyone.", track: "git" },
          { n: "SQL", lvl: "must", d: "Your data lives in a database. Joins, aggregation, window functions. Two weeks of work, a career of use.", track: "sql" },
          { n: "APIs and HTTP", lvl: "must", d: "REST, JSON, auth, status codes, streaming responses, retries and backoff. Almost all your integration pain will be here.", track: "backend" },
          { n: "The Linux command line", lvl: "must", d: "Servers are Linux. You will ssh into one on a bad day and need to find out why it is on fire.", track: "zero" },
          { n: "Data structures and complexity", lvl: "must", d: "Needed for interviews at any decent company, and for knowing why your vector search is slow.", track: "dsa" }
        ]
      },
      {
        g: "The AI core",
        note: "The part that makes it an AI job rather than a backend one. Conceptual depth matters more than mathematical depth for this role.",
        items: [
          { n: "How transformers actually work", lvl: "must", d: "Attention, tokens, context windows, why the model forgets, why it invents. You cannot debug what you cannot picture.", term: "Transformer" },
          { n: "Embeddings and vector search", lvl: "must", d: "What an embedding represents, cosine similarity, ANN indexes, when semantic search fails and why hybrid search fixes it.", term: "Embedding" },
          { n: "RAG, done properly", lvl: "must", d: "Chunking strategy, retrieval, reranking, citation, grounding. The single most-asked skill in applied AI interviews today.", term: "Retrieval-Augmented Generation" },
          { n: "Prompt and context engineering", lvl: "must", d: "Structured output, few-shot design, system prompt discipline, and the fact that context is a scarce budget you spend, not free space." },
          { n: "Evaluation", lvl: "must", d: "Golden sets, LLM-as-judge and its failure modes, regression suites, offline against online metrics. **This is the skill that separates hires from rejections.** Most candidates cannot answer 'how would you know it got worse?'" },
          { n: "Agents and tool use", lvl: "should", d: "Function calling, planning loops, multi-step execution, and a realistic sense of where agents break — which is most places, most of the time." },
          { n: "Fine-tuning and adaptation", lvl: "should", d: "LoRA, QLoRA, instruction tuning, and — more valuable — knowing when *not* to fine-tune, which is usually.", track: "finetune" },
          { n: "Classical ML fundamentals", lvl: "should", d: "Train/test splits, overfitting, bias-variance, the standard metrics. Interviewers still ask, and the intuitions transfer.", track: "ml" },
          { n: "Maths: linear algebra, probability", lvl: "should", d: "Enough to read a paper's method section without drowning. Vectors, matrices, distributions, expectation. Not a full degree.", track: "math" }
        ]
      },
      {
        g: "Shipping it",
        note: "The reason applied AI engineers are scarce is that this column and the one above rarely appear in the same person.",
        items: [
          { n: "Backend service design", lvl: "must", d: "FastAPI or similar, async concurrency, queues, caching, timeouts, idempotency. Your AI feature is a service before it is anything else.", track: "backend" },
          { n: "Docker", lvl: "must", d: "If it does not containerise, it does not deploy. Basic images, compose, and reading someone else's Dockerfile.", track: "docker" },
          { n: "Cost and latency engineering", lvl: "must", d: "Token accounting, caching, batching, streaming, model routing, choosing a smaller model on purpose. Directly visible to the people who set your salary." },
          { n: "Observability", lvl: "should", d: "Tracing a request through a chain, logging prompts and outputs safely, dashboards for quality drift. You cannot fix what you cannot see." },
          { n: "One cloud, decently", lvl: "should", d: "Pick **AWS** and learn it properly — it is the cloud named most often in Indian job descriptions, and one cloud known well beats three known vaguely. IAM, S3, Fargate, a database, secrets, monitoring, and the bill.", track: "cloud" },
          { n: "Vector database operations", lvl: "should", d: "pgvector, Pinecone, Qdrant, Weaviate. Indexing strategy, filtering, and what happens at ten million vectors instead of ten thousand." },
          { n: "Safety and guardrails", lvl: "should", d: "Prompt injection, data leakage, PII handling, output validation, refusal behaviour. Increasingly a compliance requirement, not a nicety." },
          { n: "GPU and inference serving", lvl: "edge", d: "vLLM, quantisation, batching, KV caching. Needed only if you self-host — but it pays extremely well when you do." }
        ]
      },
      {
        g: "The human half",
        note: "Underrated to the point of absurdity. At senior level this is most of the job, and it is what gets you promoted past people who write better code than you.",
        items: [
          { n: "Writing clearly", lvl: "must", d: "Design docs, evaluation reports, README files. In a field where nobody agrees what is true, the person who explains their reasoning best sets the direction." },
          { n: "Expectation management", lvl: "must", d: "Non-technical stakeholders have watched a marketing video and believe AI can do anything. Recalibrating that, kindly and repeatedly, is a core duty." },
          { n: "Product judgement", lvl: "should", d: "Knowing which problems deserve a model and which deserve an if-statement. The second category is much larger than anyone admits." },
          { n: "Reading papers", lvl: "should", d: "Abstract, method, results, limitations. You do not need to reproduce them; you need to extract the one usable idea." }
        ]
      }
    ],

    stack: ["Python", "PyTorch", "Hugging Face", "LangChain / LlamaIndex", "FastAPI", "OpenAI + Anthropic APIs", "pgvector / Qdrant / Pinecone", "Docker", "Redis", "LangSmith / Langfuse", "Ragas", "vLLM", "AWS / GCP", "Weights & Biases"],

    edge: [
      { t: "Be the person who can measure quality", d: "Almost every applicant can build a RAG demo. Vanishingly few can walk into a room and say how they would detect a five percent regression in answer quality before a customer does. Build one serious evaluation harness and you will be able to talk about it in every interview you ever take." },
      { t: "Own the cost line", d: "AI features have a per-request cost, which makes them unlike all other software and deeply alarming to finance. An engineer who cuts inference spend by seventy percent without hurting quality has produced a number that appears in someone's quarterly review. That is career fuel of a kind pure code quality never is." },
      { t: "Learn what the model cannot do, precisely", d: "Value comes from knowing the failure boundary — where hallucination begins, where context breaks down, where an agent loop spirals. Engineers who know the edges design around them. Engineers who do not ship demos that collapse in month two." },
      { t: "Keep one foot in real software engineering", d: "The AI-only engineer plateaus fast. Testing, code review, system design, databases — these are what let you take an idea all the way to production alone, and being able to do that is the rarest profile on the market." },
      { t: "Write in public", d: "One good technical post about something you actually built — with the failures in it — outperforms a year of quiet competence for getting noticed. This field's hiring runs substantially on visible thinking." },
      { t: "Go deep on one domain", d: "AI plus legal, AI plus healthcare, AI plus finance. Domain knowledge is what turns a general engineer into someone a specific company cannot replace, and the pay difference is significant." },
      { t: "Stay boring where it counts", d: "Use the smallest model that works. Prefer a lookup to a generation. Cache aggressively. Senior engineers are recognisable by how *little* AI they use to solve a problem." }
    ],

    ladder: [
      { t: "AI Engineer I / Associate", y: "0–2 yrs", pay: "₹8–26 LPA", d: "You implement features someone else scoped. Prompts, pipelines, integration, plenty of evaluation grunt work. Expect to be given the tickets nobody else wants — do them exceptionally and you will move fast, because the bar here is low and visible." },
      { t: "AI Engineer II", y: "2–4 yrs", pay: "₹18–45 LPA", d: "You own a feature end to end, including its quality bar and its cost. You are trusted to say a thing is not worth building. This is the level where the pay curve starts to bend sharply upward." },
      { t: "Senior AI Engineer", y: "4–7 yrs", pay: "₹35–80 LPA", d: "You design the system, choose the architecture, and are accountable when it degrades. Substantial mentoring. You are now paid mostly for judgement — which build, which buy, which not at all." },
      { t: "Staff / Principal AI Engineer", y: "7–12 yrs", pay: "₹70–160 LPA", d: "You set technical direction across teams. Fewer commits, far more influence. Your job is to prevent expensive mistakes twelve months before they would happen." },
      { t: "Head of AI / Distinguished", y: "12+ yrs", pay: "₹1.2–4 Cr", d: "Strategy, hiring, external presence, budget. Split between deep-technical (Distinguished Engineer) and organisational (Head of AI) — pick deliberately, because the skills diverge." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 6, mid: 13, hi: 28, note: "Enormous spread. A service company pays ₹4–7; an Indian product company ₹14–24; a global product company or funded AI startup ₹25–45 for an exceptional fresher with real projects. The spread is wider here than in any other role on this site — which means your preparation actually moves the number." },
        { k: "Early", y: "1–3 yrs", lo: 12, mid: 24, hi: 48, note: "The first switch is the biggest single jump of your career. People routinely double here, and people who stay put routinely do not." },
        { k: "Mid", y: "3–6 yrs", lo: 22, mid: 42, hi: 85, note: "Now paid for having shipped something that survived contact with users. Ownership of a production AI system is the differentiator." },
        { k: "Senior", y: "6–10 yrs", lo: 40, mid: 75, hi: 150, note: "Includes equity at product companies, which is often a third or more of total compensation and should be evaluated sceptically at startups." },
        { k: "Staff+", y: "10+ yrs", lo: 70, mid: 130, hi: 300, note: "Small population, very wide range. Global AI labs with India presence pay at the top of this and beyond." }
      ],
      notes: [
        "AI engineering currently carries roughly a 25–45% premium over general backend engineering at the same experience level in India. That premium is real but it is not permanent — it exists because supply has not caught up, and supply is catching up.",
        "Beware inflated headline CTC. Ask for the fixed component. A '₹20 LPA' offer that is ₹11 fixed, ₹4 variable-on-performance, ₹3 joining bonus and ₹2 in notional equity is a ₹11 LPA job.",
        "Equity at an unlisted startup should be valued near zero when comparing offers, then treated as a genuine bonus if it ever pays. This is not cynicism; it is the base rate."
      ]
    },

    cos: [
      {
        tier: "Global product & AI labs",
        pay: "₹30–80 LPA at entry",
        d: "Hardest to enter, best paid, best learning. Rarely hire true freshers into AI roles directly — the usual route in is a software engineering role first, then an internal transfer, which works far more often than people assume.",
        names: ["Google", "Microsoft", "OpenAI", "Anthropic", "Nvidia", "Meta", "Adobe", "Databricks", "Salesforce", "Uber", "Atlassian"]
      },
      {
        tier: "Indian product & unicorns",
        pay: "₹14–40 LPA at entry",
        d: "The sweet spot for most people: real scale, real ownership, genuinely strong pay, and they will actually interview a good fresher from a non-elite college.",
        names: ["Flipkart", "Swiggy", "Zomato", "Razorpay", "PhonePe", "CRED", "Meesho", "Zepto", "Dream11", "Groww", "Postman", "Zoho", "Freshworks"]
      },
      {
        tier: "AI-first startups",
        pay: "₹8–30 LPA + equity",
        d: "Most responsibility per year of experience anywhere. You will touch everything, learn violently fast, and carry real risk — many will not exist in three years. Excellent for a first or second job if you can absorb that risk.",
        names: ["Sarvam AI", "Krutrim", "Observe.AI", "Mad Street Den", "Neysa", "CoRover", "Haptik", "Gnani.ai", "Rephrase.ai"]
      },
      {
        tier: "Global capability centres (GCCs)",
        pay: "₹10–30 LPA at entry",
        d: "The most underrated option in India by a distance. Multinational engineering centres with a strong work-life balance, real technical work, and heavy fresher hiring. Often better pay than domestic startups with a fraction of the volatility.",
        names: ["Walmart Global Tech", "Target", "Goldman Sachs", "JPMorgan Chase", "Wells Fargo", "American Express", "Shell", "Lowe's", "Optum", "Rakuten", "Visa"]
      },
      {
        tier: "IT services, consulting & analytics",
        pay: "₹3.5–12 LPA at entry",
        d: "By far the largest volume of fresher hiring in the country, and therefore the most realistic first door for many people. Pay starts low and the work is often less deep — but two years here plus serious self-directed projects is a completely valid launchpad into tier one. Do not let anyone tell you it is a dead end; let it be a corridor.",
        names: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Capgemini", "LTIMindtree", "HCLTech", "Tiger Analytics", "Fractal Analytics", "Mu Sigma", "ZS Associates", "Deloitte", "EY"]
      }
    ],

    hire: [
      { t: "Resume and portfolio screen", d: "Six to eight seconds. They are looking for a deployed AI project and a stack keyword match.", tip: "One link at the top that opens a working thing. Every project bullet must name a metric and a trade-off." },
      { t: "Recruiter call", d: "Fifteen minutes. Notice period, expectations, whether you can explain your own project coherently.", tip: "Prepare a ninety-second version of your best project — problem, approach, result, what broke. Rehearse it aloud; it is used in every single interview you will ever take." },
      { t: "Coding round", d: "DSA at product companies, or a practical Python/API task at startups. Usually 60–90 minutes.", tip: "Roughly 150 well-chosen problems covering arrays, strings, hashing, two pointers, trees, graphs and dynamic programming clears most AI-engineer screens. This round is a format, not a measure of you — treat it as such and grind it deliberately." },
      { t: "AI / ML technical round", d: "The core round. Transformers, embeddings, RAG design, hallucination, evaluation, chunking, why-not-fine-tune, cost trade-offs.", tip: "Be ready to design a RAG system aloud, end to end, including how you would evaluate it and what you would do when quality drops. If you can only prepare one thing, prepare this." },
      { t: "System design", d: "'Design an AI assistant over ten million company documents.' Scale, latency, cost, failure modes, privacy.", tip: "Talk about cost and evaluation unprompted. Most candidates never mention either, and the ones who do are remembered." },
      { t: "Project deep-dive", d: "Forty-five minutes inside your own project. Why that chunk size, why that model, what you tried first, what failed.", tip: "This is where fabricated portfolios die. Build things yourself and this round becomes the easiest one." },
      { t: "Behavioural / hiring manager", d: "Collaboration, disagreement, ambiguity, how you handle being wrong.", tip: "Have one real story about a mistake you made, caught and fixed. Candidates who cannot name a failure read as either inexperienced or dishonest." }
    ],

    proof: [
      { t: "A RAG system over a corpus you actually care about", d: "Your university's regulations, Indian tax rules, a game's wiki, your own notes. Include hybrid retrieval, reranking and inline citations.", why: "It is the single most requested competency in the market, and using a corpus you care about is what makes you able to judge whether an answer is any good." },
      { t: "An evaluation harness — and the write-up", d: "A golden set of two hundred questions, automated scoring, a regression gate, and a blog post about which metrics misled you.", why: "This is the rarest thing a junior candidate can show. It signals production thinking louder than any model work." },
      { t: "An agent that does one narrow thing reliably", d: "Not a general assistant. Something small — books a slot, files an expense, triages an inbox — with retries, tool errors and a hard stop condition.", why: "Narrow and reliable proves engineering judgement. Broad and flaky proves you watched a demo video." },
      { t: "A cost and latency optimisation study", d: "Take one of your own projects, cut its cost by 80% and its p95 latency by half. Document every step and what you sacrificed.", why: "Almost nobody does this. It maps directly onto what senior engineers are actually paid for." },
      { t: "A fine-tune with an honest conclusion", d: "Fine-tune a small open model on a narrow task, benchmark it against prompting a larger one, and report the result even if fine-tuning lost.", why: "Knowing when not to fine-tune is a senior-level judgement. Demonstrating it as a fresher is disproportionately impressive." },
      { t: "One real open-source contribution", d: "A bug fix or docs improvement to LangChain, LlamaIndex, vLLM, Ragas or similar.", why: "Proves you can operate inside code you did not write and survive public review — the closest thing to a work sample." }
    ],

    plan: [
      { n: "Get the machine ready", d: "Terminal, editor, how a program actually runs. Skip only if you already live in a terminal.", track: "zero", mo: "Weeks 1–2" },
      { n: "Programming concepts, language-free", d: "Variables, types, logic, loops, functions, data, errors — learned once, spent forever.", track: "basics", mo: "Weeks 3–6" },
      { n: "Python to real fluency", d: "The language you will write every day for this role. Do not rush it; everything downstream compounds off this.", track: "python", mo: "Months 2–4" },
      { n: "Git and GitHub", d: "Start in week three of Python, not later. It makes experimenting free.", track: "git", mo: "Month 2, alongside" },
      { n: "SQL", d: "Two weeks of work, permanent value. Your data lives in a database and always will.", track: "sql", mo: "Month 4" },
      { n: "Maths for machine learning", d: "Linear algebra, probability, statistics — to the depth needed to read a method section, not to sit an exam.", track: "math", mo: "Months 4–6" },
      { n: "Machine learning foundations", d: "Classical ML, the metrics, the failure modes. The intuitions here underpin everything in the LLM era too.", track: "ml", mo: "Months 5–7" },
      { n: "Deep learning and transformers", d: "PyTorch, backpropagation, attention. Build a tiny transformer from scratch once — it demystifies the whole field permanently.", track: "dl", mo: "Months 6–8" },
      { n: "LLM application engineering", d: "Prompting, structured output, RAG, agents, evaluation, guardrails. The core of the actual job.", track: "llm", mo: "Months 8–11" },
      { n: "Backend and APIs", d: "FastAPI, async, queues, caching. Your model has to become a service somebody can call.", track: "backend", mo: "Months 9–11" },
      { n: "Containerise it", d: "Docker, images, Compose. If it does not containerise, it does not deploy.", track: "docker", mo: "Month 11" },
      { n: "One cloud, properly — AWS", d: "IAM, S3, Fargate, Postgres with pgvector, Bedrock, monitoring and the bill. A URL somebody else can open is what turns a project into evidence.", track: "cloud", mo: "Months 11–12" },
      { n: "Fine-tuning, and when not to", d: "LoRA and QLoRA on rented hardware, an evaluation that could show it failed, and the judgement to say a fine-tune was not worth it. Optional — and disproportionately impressive when a fresher has done one honestly.", track: "finetune", mo: "Month 12, optional" },
      { n: "DSA for interviews", d: "Run this in parallel from month six. It is a separate game from the job and it must be practised as one.", track: "dsa", mo: "Months 6–12, parallel" },
      { n: "Build the portfolio, then hunt", d: "Two or three deep projects, deployed and written up. Then apply in volume, with referrals.", track: "hunt", mo: "Months 10–14" }
    ],

    myths: [
      { m: "I need a master's or a PhD to work in AI.", r: "For applied AI engineering — the majority of the jobs — no. It matters for research roles and for a handful of frontier-lab positions. Most teams hiring AI engineers today care about what you have shipped. A strong portfolio beats an unremarkable master's, routinely." },
      { m: "I must master all the maths before I touch anything.", r: "This costs more aspiring engineers their momentum than any other belief. You need working intuition for vectors, probability and gradients, and you can acquire the rest as you meet it. Nobody has ever been rejected from an applied AI role for being unable to derive backpropagation by hand." },
      { m: "AI will replace AI engineers.", r: "AI has made writing code faster, which has increased demand for people who can decide what to build and verify that it works. The bottleneck has moved from typing to judgement. Judgement is the job." },
      { m: "I should learn every framework — LangChain, LlamaIndex, CrewAI, all of it.", r: "Learn one deeply. They are thin wrappers over the same handful of ideas, and once you understand retrieval, tool calling and context management, you can pick up any of them in an afternoon. Interviewers probe the ideas, not the API surface." },
      { m: "My non-CS degree disqualifies me.", r: "It does not. A meaningful share of working AI engineers came from physics, mathematics, electronics, mechanical, even economics. A domain background is often an asset — an AI engineer who genuinely understands healthcare or finance is scarcer than one who understands neither." },
      { m: "I need to build something original and impressive.", r: "You need to build something *finished*, deployed and honestly explained. A well-executed ordinary project with a real evaluation section beats an ambitious half-built one every time." },
      { m: "Prompt engineering is a career.", r: "It is a skill inside this job, not a job. The market briefly believed otherwise in 2023 and corrected hard. Anyone selling a 'prompt engineer' career track is selling you something." }
    ],

    next: ["ml-engineer", "mlops-engineer", "data-scientist", "backend-engineer", "research-engineer"],
    r: ["Transformer", "Retrieval-Augmented Generation", "Embedding", "Fine-Tuning", "Vector Database", "Hallucination", "Prompt Engineering", "Large Language Model", "Tokenisation"]
  },

  /* ==================================================================== */
  {
    id: "ml-engineer",
    t: "Machine Learning Engineer",
    a: "MLE · Applied Scientist (Engineering)",
    icon: "sigma",
    tag: "The classic path",
    demand: "hot",
    deck: "You train, evaluate and ship models that make predictions inside a product — recommendations, ranking, fraud, forecasting, pricing.",

    what: [
      "Where the AI engineer builds *on* models, the ML engineer builds the models. You own a prediction problem end to end: framing it, assembling the data, choosing an approach, training, evaluating honestly, deploying, and watching it decay.",
      "The largest surprise for newcomers is the ratio. Perhaps fifteen percent of the job is modelling. The rest is data — finding it, cleaning it, discovering that the label you were given means something different from what everyone believed, and rebuilding the pipeline that produced it.",
      "Most ML engineering money in India is not in generative AI at all. It is in recommendation and ranking, fraud and risk, demand forecasting, pricing and search relevance — problems where a two percent improvement is worth crores annually and gradient-boosted trees frequently beat anything fancier.",
      "This role demands more mathematics than applied AI engineering and more engineering than data science. It sits precisely in the middle, which is why it has been in continuous demand for a decade and shows no sign of stopping."
    ],

    day: [
      { t: "9:30", d: "Check yesterday's training run. It converged, but the validation gain came almost entirely from one feature — which is usually the smell of leakage. You go and prove it either way before believing the number." },
      { t: "11:00", d: "Feature engineering. Mostly SQL and pandas. This is the part that actually moves the metric, and the part nobody puts in a course." },
      { t: "13:00", d: "A/B test review with product. Your new ranking model won offline by 4% and is flat online. You explain why that happens more often than not, without sounding defensive." },
      { t: "15:00", d: "Rewrite the training pipeline so it can be reproduced by someone who is not you. Boring, essential, and the thing that makes you promotable." },
      { t: "16:30", d: "Investigate drift. A model shipped nine months ago has quietly degraded because user behaviour moved. Nobody noticed until you built the monitor." }
    ],

    fit: {
      love: [
        "You genuinely enjoy data cleaning, or can at least respect it as the real work.",
        "You are sceptical by instinct — good ML engineers assume every impressive result is a bug until proven otherwise.",
        "You like measurable problems where the scoreboard is unambiguous.",
        "You are comfortable with mathematics as a tool rather than as an aesthetic."
      ],
      avoid: [
        "You want to spend your day on model architecture — you will spend it on pipelines.",
        "You need fast feedback. Some experiments take days to tell you they failed.",
        "You dislike being wrong in public; ML is a discipline of mostly-failed experiments."
      ]
    },

    skills: [
      {
        g: "Foundation",
        note: "Same base as every technical role here, plus a heavier mathematical component.",
        items: [
          { n: "Python and the scientific stack", lvl: "must", d: "NumPy, pandas, scikit-learn to real depth. Vectorised thinking, not for-loops.", track: "python" },
          { n: "SQL, seriously good", lvl: "must", d: "Window functions, CTEs, query plans. You will write more SQL than model code.", track: "sql" },
          { n: "Statistics and probability", lvl: "must", d: "Distributions, hypothesis testing, confidence intervals, sampling bias. This is what stops you shipping noise.", track: "math" },
          { n: "Linear algebra and calculus", lvl: "must", d: "Matrices, eigenvectors, gradients, the chain rule. Enough to understand what an optimiser is doing.", track: "math" },
          { n: "Git and code quality", lvl: "must", d: "ML code rots faster than any other code. Tests and structure are not optional here.", track: "git" }
        ]
      },
      {
        g: "The modelling core",
        items: [
          { n: "Classical ML, thoroughly", lvl: "must", d: "Linear and logistic regression, trees, random forests, gradient boosting. XGBoost and LightGBM still win most tabular problems in industry.", track: "ml" },
          { n: "Evaluation and validation", lvl: "must", d: "Cross-validation, leakage, class imbalance, choosing the metric that matches the business cost. The most common place juniors go wrong.", term: "Cross-Validation" },
          { n: "Feature engineering", lvl: "must", d: "The highest-leverage skill in applied ML and the least teachable from books. Comes from doing it repeatedly." },
          { n: "Deep learning", lvl: "should", d: "PyTorch, CNNs, transformers. Essential for text, image and audio problems; frequently unnecessary for tabular ones.", track: "dl" },
          { n: "Experiment design", lvl: "should", d: "A/B tests, power analysis, why offline gains vanish online. This is what makes your work believed.", term: "A/B Testing" },
          { n: "Recommender and ranking systems", lvl: "should", d: "Collaborative filtering, learning to rank, embeddings for retrieval. Where a large share of Indian product-company ML money actually is." },
          { n: "Time series", lvl: "edge", d: "Forecasting, seasonality, the fact that random splits are invalid here. Vital in retail, logistics and finance." }
        ]
      },
      {
        g: "Production",
        items: [
          { n: "ML pipelines", lvl: "must", d: "Reproducible training, versioned data, scheduled retraining. Airflow, Prefect or an in-house equivalent.", track: "mlops" },
          { n: "Model serving", lvl: "must", d: "Batch against real-time, latency budgets, feature stores, and keeping training and serving features consistent." },
          { n: "Monitoring and drift", lvl: "should", d: "Models decay silently. Detecting that is a defining part of the job and a strong interview topic.", term: "Model Drift" },
          { n: "Docker and one cloud", lvl: "should", d: "Enough to package a model and deploy it without needing a platform team.", track: "docker" },
          { n: "Distributed data tools", lvl: "edge", d: "Spark or equivalent, for when the data stops fitting on one machine.", track: "spark" }
        ]
      }
    ],

    stack: ["Python", "pandas", "NumPy", "scikit-learn", "XGBoost / LightGBM", "PyTorch", "MLflow", "Airflow", "Spark", "Docker", "AWS SageMaker / GCP Vertex", "Feast", "Weights & Biases"],

    edge: [
      { t: "Be relentless about leakage", d: "The most common cause of a model that dazzles offline and fails in production is target leakage. Engineers who hunt it instinctively save their companies from expensive public embarrassments, and they get a reputation for it." },
      { t: "Learn to say the baseline is enough", d: "A rules engine or a logistic regression often solves the problem at a tenth of the complexity. Recommending that, against your own interest in doing something fancier, marks you as senior faster than any technique." },
      { t: "Connect the metric to money", d: "'AUC improved by 0.03' is invisible to leadership. '₹2.1 crore of fraud prevented annually' is a promotion. Same work, translated." },
      { t: "Own one domain's data deeply", d: "The engineer who knows the quirks of the company's data — which table lies, which timestamp is in the wrong timezone — becomes structurally difficult to replace." }
    ],

    ladder: [
      { t: "ML Engineer I", y: "0–2 yrs", pay: "₹7–24 LPA", d: "You run experiments others design, and do a great deal of data work. Do the data work well and visibly." },
      { t: "ML Engineer II", y: "2–4 yrs", pay: "₹16–40 LPA", d: "You own a model in production, including its failures." },
      { t: "Senior ML Engineer", y: "4–8 yrs", pay: "₹32–75 LPA", d: "You frame the problem, not just solve it. Deciding what to model is now most of the value." },
      { t: "Staff / Principal", y: "8+ yrs", pay: "₹65–150 LPA", d: "ML strategy across teams, platform decisions, mentoring." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 5, mid: 11, hi: 24, note: "Product companies ₹14–24; GCCs ₹10–18; services ₹4–8. Kaggle results and a genuine end-to-end project move this band more than coursework does." },
        { k: "Early", y: "1–3 yrs", lo: 11, mid: 20, hi: 40, note: "Owning one production model is the qualification that unlocks the upper half." },
        { k: "Mid", y: "3–6 yrs", lo: 20, mid: 38, hi: 72, note: "Domain specialisation — fraud, recsys, forecasting — pays a clear premium." },
        { k: "Senior", y: "6–10 yrs", lo: 35, mid: 65, hi: 130, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 60, mid: 110, hi: 250, note: "" }
      ],
      notes: [
        "ML engineering pays slightly below headline AI-engineer numbers at entry, and converges by the mid level. The demand is steadier and less fashion-driven.",
        "Fintech and e-commerce pay the strongest ML premiums in India, because the link from model quality to revenue is direct and immediate."
      ]
    },

    cos: [
      { tier: "Product companies at scale", pay: "₹16–45 LPA at entry", d: "Recommendation, ranking, fraud and pricing teams. The best learning environment for this role by some distance.", names: ["Flipkart", "Swiggy", "Zomato", "Myntra", "Meesho", "Uber", "Amazon", "Google", "Microsoft", "Netflix"] },
      { tier: "Fintech and risk", pay: "₹14–40 LPA at entry", d: "Credit scoring, fraud, underwriting. High stakes, strong pay, heavily regulated — which means explainability matters as much as accuracy.", names: ["Razorpay", "PhonePe", "Paytm", "CRED", "Groww", "Jupiter", "Navi", "Slice", "American Express", "Visa"] },
      { tier: "GCCs and enterprise", pay: "₹10–28 LPA at entry", d: "Forecasting, supply chain, operations research. Excellent balance and genuinely interesting problems at scale.", names: ["Walmart Global Tech", "Target", "Shell", "Lowe's", "Optum", "JPMorgan Chase", "Goldman Sachs"] },
      { tier: "Analytics consultancies", pay: "₹6–16 LPA at entry", d: "High-volume fresher hiring and broad exposure across industries. Strong training, less depth per problem.", names: ["Mu Sigma", "Fractal Analytics", "Tiger Analytics", "ZS Associates", "Tredence", "LatentView", "Course5i"] }
    ],

    hire: [
      { t: "Resume screen", d: "They look for end-to-end projects, not notebooks.", tip: "'Deployed' is the word that changes this round." },
      { t: "Coding round", d: "Python and SQL, sometimes DSA at product companies.", tip: "Practise pandas and SQL under time pressure; that is what actually appears." },
      { t: "ML fundamentals", d: "Bias-variance, regularisation, imbalance, metric choice, why your model failed.", tip: "Prepare to explain overfitting to a non-technical person. It is asked constantly and it separates understanding from memorisation." },
      { t: "Case round", d: "'How would you detect fraudulent transactions here?' Framing, data, metric, deployment, monitoring.", tip: "Start with the business cost of a false positive versus a false negative. Almost nobody does; it immediately reads as senior." },
      { t: "Project deep-dive", d: "Your own work, interrogated.", tip: "Know your own numbers, including the baseline you beat. 'What was your baseline?' catches out an alarming share of candidates." }
    ],

    proof: [
      { t: "An end-to-end pipeline, not a notebook", d: "Raw data in, trained model out, served behind an API, with retraining scheduled and monitoring attached.", why: "Notebooks are the default fresher submission. A pipeline instantly places you in a different pile." },
      { t: "A Kaggle competition worked properly", d: "Not a copied kernel. Your own feature engineering, your own validation strategy, and a write-up of what failed.", why: "It is verifiable, comparable and demonstrates the validation discipline the job is built on." },
      { t: "A model with a documented business case", d: "Translate your metric into rupees. State the assumptions plainly.", why: "Shows you understand that a model exists to change a decision, not to have a good score." },
      { t: "A drift monitoring dashboard", d: "Track feature distributions and prediction quality over time; simulate a drift and catch it.", why: "Production maturity as a fresher is rare and extremely persuasive." }
    ],

    plan: [
      { n: "Python", d: "pandas and NumPy fluency is the daily tool.", track: "python", mo: "Months 1–3" },
      { n: "SQL", d: "You will write more of this than model code.", track: "sql", mo: "Month 3" },
      { n: "Git", d: "ML code rots; version it from the start.", track: "git", mo: "Month 2, alongside" },
      { n: "Statistics and maths", d: "Distributions, testing, linear algebra, gradients.", track: "math", mo: "Months 3–5" },
      { n: "Classical machine learning", d: "Regression, trees, boosting, and validation done properly.", track: "ml", mo: "Months 4–7" },
      { n: "Deep learning", d: "PyTorch and neural network fundamentals.", track: "dl", mo: "Months 7–9" },
      { n: "MLOps and pipelines", d: "The half of the job that turns a notebook into a system.", track: "mlops", mo: "Months 9–11" },
      { n: "DSA for interviews", d: "Parallel track from month five.", track: "dsa", mo: "Months 5–12, parallel" },
      { n: "Portfolio and applications", d: "Two deep end-to-end projects, then the hunt.", track: "hunt", mo: "Months 10–14" }
    ],

    myths: [
      { m: "Deep learning is always better.", r: "On tabular data — which is most of industry — gradient-boosted trees usually win, train in minutes and are far easier to explain to a regulator. Reaching for a neural network first is a junior tell." },
      { m: "My accuracy is 97%, so the model is good.", r: "If 97% of your data is one class, a model that always guesses that class scores the same. Metric choice under imbalance is the single most common fresher error." },
      { m: "The modelling is the hard part.", r: "The data is the hard part. Always. Every experienced practitioner will tell you this and every newcomer has to learn it personally." }
    ],

    next: ["ai-engineer", "data-scientist", "mlops-engineer", "data-engineer"],
    r: ["Gradient Boosting", "Overfitting", "Cross-Validation", "Feature Engineering", "Random Forest", "Regularisation", "Model Drift", "Precision and Recall"]
  },

  /* ==================================================================== */
  {
    id: "data-scientist",
    t: "Data Scientist",
    a: "Applied Scientist · Decision Scientist",
    icon: "graph",
    tag: "Analysis meets influence",
    demand: "strong",
    deck: "You answer questions the business cannot answer for itself — with statistics, experiments and models — and then you make people act on the answer.",

    what: [
      "The title covers two quite different jobs, and knowing which one a posting means will save you a great deal of wasted preparation.",
      "**Product / decision scientist.** You run experiments, size opportunities, build metrics and tell product teams what is actually happening. Heavy on statistics, SQL and communication. Comparatively light on engineering. This variant is common at consumer companies and is where a lot of genuine influence sits.",
      "**Modelling data scientist.** Closer to an ML engineer, but with more emphasis on analysis and less on production systems. Builds models that inform decisions rather than serving live traffic.",
      "What unites them is that the deliverable is a *decision*, not a model. A brilliant analysis nobody acts on has produced nothing. This is why communication is not a soft extra in this role — it is the product."
    ],

    day: [
      { t: "9:30", d: "A stakeholder asks why revenue dipped on Tuesday. Four hours later you establish it was a tracking bug, not a business event. This is a good outcome and it happens constantly." },
      { t: "12:00", d: "Design an experiment for a new checkout flow. Sample size, duration, guardrail metrics, and what you will *not* conclude from it." },
      { t: "14:30", d: "Build the analysis. SQL, then Python, then a chart that a vice-president can read in nine seconds." },
      { t: "16:00", d: "Present. The hard part is not the statistics; it is saying 'the data does not support that' to someone senior who wants it to." }
    ],

    fit: {
      love: [
        "You enjoy explaining things and are good at it.",
        "You are curious about *why* rather than only *what*.",
        "You can hold your ground politely when the numbers disagree with someone powerful.",
        "You like statistics as a way of thinking, not only as a toolkit."
      ],
      avoid: [
        "You want to write code all day — much of this role is meetings and writing.",
        "You need your work to ship as software; here it ships as a decision.",
        "You find stakeholder politics draining rather than interesting."
      ]
    },

    skills: [
      {
        g: "Foundation",
        items: [
          { n: "SQL, excellent", lvl: "must", d: "The primary tool. Window functions, cohort analysis, funnel queries. Interviewed hard and often.", track: "sql" },
          { n: "Statistics", lvl: "must", d: "Hypothesis testing, confidence intervals, regression, causal thinking, Simpson's paradox. The intellectual core of the role.", track: "math" },
          { n: "Python for analysis", lvl: "must", d: "pandas, matplotlib, statsmodels, scikit-learn. R is fine too, and still preferred in some research-heavy teams.", track: "python" },
          { n: "Experimentation", lvl: "must", d: "A/B design, power, novelty effects, peeking, guardrails. This is the highest-value skill in product data science.", term: "A/B Testing" },
          { n: "Data visualisation", lvl: "must", d: "Charts that make one point clearly. Chart junk is a career limiter in this role." }
        ]
      },
      {
        g: "Applied",
        items: [
          { n: "Business metric design", lvl: "must", d: "Defining what 'active user' means, and understanding that the definition changes behaviour across the company." },
          { n: "Causal inference", lvl: "should", d: "Difference-in-differences, propensity scores, instrumental variables. For the many questions where an experiment is impossible.", term: "Causal Inference" },
          { n: "Machine learning", lvl: "should", d: "Enough to build a churn or propensity model and to know its limits.", track: "ml" },
          { n: "Dashboarding", lvl: "should", d: "Tableau, Power BI, Looker, Metabase. Not glamorous; extremely present in the job." },
          { n: "Storytelling and executive communication", lvl: "must", d: "Structuring a finding as answer-first, then evidence. The genuine differentiator between a ₹15 LPA and a ₹40 LPA data scientist." }
        ]
      }
    ],

    stack: ["SQL", "Python", "pandas", "statsmodels", "scikit-learn", "Jupyter", "Tableau / Power BI / Looker", "dbt", "Amplitude / Mixpanel", "R", "Snowflake / BigQuery"],

    edge: [
      { t: "Answer the question behind the question", d: "Someone asks for a dashboard; they need to know whether to fund a team. Juniors deliver the dashboard. Seniors deliver the decision — and get invited to the next planning meeting." },
      { t: "Be the person who kills bad ideas early", d: "A well-argued 'this will not work, here is the evidence' saves quarters of engineering effort. It is uncomfortable and it is the most valuable thing you can do." },
      { t: "Learn the domain properly", d: "A data scientist who understands lending, or logistics, or two-sided marketplaces, sees things in the data that a generalist cannot." },
      { t: "Write like a journalist", d: "Headline first, evidence second, caveats last and honestly. Analyses written this way get read and acted on; the reverse order gets skimmed and forgotten." }
    ],

    ladder: [
      { t: "Data Scientist I", y: "0–2 yrs", pay: "₹6–20 LPA", d: "Scoped analyses, dashboards, experiment readouts." },
      { t: "Data Scientist II", y: "2–4 yrs", pay: "₹14–35 LPA", d: "You own a product area's measurement and are trusted with ambiguous questions." },
      { t: "Senior Data Scientist", y: "4–8 yrs", pay: "₹28–65 LPA", d: "You set what gets measured, which quietly sets what the company optimises for." },
      { t: "Principal / Head of DS", y: "8+ yrs", pay: "₹55–140 LPA", d: "Strategy, methodology standards, and building the function." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 5, mid: 10, hi: 22, note: "Consultancies hire freshers in volume at ₹5–9; product companies pay ₹12–22 but interview much harder on SQL and statistics." },
        { k: "Early", y: "1–3 yrs", lo: 10, mid: 18, hi: 35, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 18, mid: 33, hi: 62, note: "Communication skill starts visibly outpacing technical skill as a pay driver here." },
        { k: "Senior", y: "6–10 yrs", lo: 30, mid: 58, hi: 110, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 55, mid: 95, hi: 200, note: "" }
      ],
      notes: [
        "This is the most accessible high-paying analytical role for a fresher in India, because the volume of hiring is large and the entry bar is SQL and statistics rather than heavy engineering.",
        "A common and effective route: join as a data analyst, move to data scientist internally in 18–24 months. The internal move is far easier than the external one."
      ]
    },

    cos: [
      { tier: "Consumer product companies", pay: "₹12–28 LPA at entry", d: "Experimentation at real scale — the best possible training ground for this role.", names: ["Flipkart", "Swiggy", "Zomato", "Meesho", "Dream11", "Zepto", "Uber", "Amazon", "Google", "Microsoft"] },
      { tier: "Fintech", pay: "₹12–30 LPA at entry", d: "Risk, credit and growth analytics. Regulated, rigorous, well paid.", names: ["Razorpay", "PhonePe", "CRED", "Groww", "Paytm", "Navi", "American Express"] },
      { tier: "Analytics consultancies", pay: "₹5–14 LPA at entry", d: "The largest fresher intake in Indian analytics. Broad exposure, structured training, and a well-worn path into product companies after two years.", names: ["Mu Sigma", "ZS Associates", "Fractal Analytics", "Tiger Analytics", "Tredence", "Bain (ACE)", "McKinsey (QuantumBlack)", "Deloitte", "EY", "PwC"] },
      { tier: "GCCs", pay: "₹9–22 LPA at entry", d: "Stable, broad, respectable pay, strong work-life balance.", names: ["Walmart Global Tech", "Target", "Optum", "Wells Fargo", "JPMorgan Chase", "Shell", "Lowe's"] }
    ],

    hire: [
      { t: "SQL screen", d: "Often the first and most brutal filter. Joins, window functions, funnels, cohorts.", tip: "This round eliminates more candidates than any other. Practise until window functions are automatic." },
      { t: "Statistics round", d: "p-values, confidence intervals, sample size, what a test does and does not prove.", tip: "Be able to explain a p-value in plain language. It is asked in most loops and answered badly in most of them." },
      { t: "Case study", d: "'Daily active users dropped 8% last week. Go.'", tip: "Structure aloud before analysing: segment, timeframe, instrumentation, external events. The structure is what is being marked." },
      { t: "Product sense", d: "Metric definition, trade-offs, what you would measure for a new feature.", tip: "Always name a guardrail metric alongside a success metric." },
      { t: "Presentation", d: "Sometimes a take-home analysis presented live.", tip: "Answer first, then evidence. Never build to a reveal — executives will interrupt." }
    ],

    proof: [
      { t: "An end-to-end analysis of a public dataset", d: "A real question, honest methodology, stated limitations, and a clear recommendation.", why: "Demonstrates the whole loop — which is the job — rather than a technique." },
      { t: "An experiment design document", d: "Take a real product, propose a change, design the test fully: hypothesis, metrics, sample size, duration, risks.", why: "Almost no fresher has one, and it directly mirrors day-one work." },
      { t: "A dashboard someone else uses", d: "Build one for a college society, a small business, a community project — and get real feedback.", why: "'Someone used it and asked for changes' is a stronger sentence than any tool list." },
      { t: "A written analysis for non-technical readers", d: "One post explaining a genuine finding to people who do not know statistics.", why: "This role's ceiling is set by communication. Show it early." }
    ],

    plan: [
      { n: "SQL first", d: "Unusually, start here rather than with Python. It is the interview filter and the daily tool.", track: "sql", mo: "Months 1–2" },
      { n: "Python for analysis", d: "pandas and visualisation.", track: "python", mo: "Months 2–4" },
      { n: "Statistics", d: "The intellectual core. Do not rush it.", track: "math", mo: "Months 3–6" },
      { n: "Experimentation and causal thinking", d: "A/B testing done properly.", track: "stats-exp", mo: "Months 5–7" },
      { n: "Git", d: "Analysis code deserves version control too.", track: "git", mo: "Month 3, alongside" },
      { n: "Machine learning basics", d: "Enough to build and critique a propensity model.", track: "ml", mo: "Months 7–9" },
      { n: "Business and domain reading", d: "Learn one industry properly — it is what makes analysis insightful rather than merely correct.", track: "domain", mo: "Ongoing" },
      { n: "Portfolio and applications", d: "Two analyses and one experiment design, written for humans.", track: "hunt", mo: "Months 8–12" }
    ],

    myths: [
      { m: "Data science is mostly machine learning.", r: "In most companies it is mostly SQL, statistics and persuasion. Teams that expected otherwise are the source of the 'data scientists spend all their time cleaning data' complaint." },
      { m: "I need a PhD.", r: "Helpful in research-heavy teams, irrelevant in most product ones. A portfolio of clear analyses matters more." },
      { m: "The analysis speaks for itself.", r: "It does not. Ever. An unactioned analysis is indistinguishable from no analysis, and learning that early is worth years." }
    ],

    next: ["data-analyst", "ml-engineer", "analytics-engineer", "ai-product-manager"],
    r: ["A/B Testing", "p-value", "Confidence Interval", "Regression", "Causal Inference", "Cohort Analysis", "Statistical Significance"]
  },

  /* ==================================================================== */
  {
    id: "mlops-engineer",
    t: "MLOps / ML Platform Engineer",
    a: "ML Infrastructure Engineer · AI Platform Engineer",
    icon: "pipeline",
    tag: "Quietly well paid",
    demand: "hot",
    deck: "You build the machinery every other ML person depends on — training infrastructure, deployment, monitoring, and the reason models can be shipped weekly instead of quarterly.",

    what: [
      "Your users are other engineers. You build the platform on which models are trained, versioned, deployed, served and observed — so that a data scientist can ship without knowing what Kubernetes is.",
      "This role exists because the gap between a working model and a reliable service is enormous, and because the industry learned the hard way that models in production decay, break silently and cost more than expected.",
      "It is one of the strongest paying roles per unit of glamour in the entire field. Almost nobody enters tech dreaming of it, demand is high, and supply is thin — which is precisely why the compensation is good.",
      "It rarely hires true freshers. The standard route is one to three years in backend, DevOps or ML engineering first. If you are starting from zero, treat this as a two-to-four-year target rather than a first job."
    ],

    day: [
      { t: "9:30", d: "A training job has been failing overnight. It is a CUDA version mismatch in a base image someone updated. Nobody else could have found it in under a day." },
      { t: "11:00", d: "Build a feature that lets data scientists roll a model back in one command. Small feature, enormous reduction in team anxiety." },
      { t: "14:00", d: "Cost review. GPU instances are running idle overnight; you add autoscaling and remove a large recurring line item." },
      { t: "16:00", d: "Help a data scientist debug why their model performs differently in production. It is training/serving skew, as it usually is." }
    ],

    fit: {
      love: [
        "You like building tools other engineers use.",
        "Systems thinking appeals more to you than modelling.",
        "You take satisfaction in reliability and in things not breaking.",
        "You are comfortable being the person who is called when it does break."
      ],
      avoid: [
        "You want to build models — you will enable others to.",
        "You want visible product credit; this work is invisible when it goes well.",
        "You dislike on-call."
      ]
    },

    skills: [
      {
        g: "Engineering foundation",
        items: [
          { n: "Python and one systems language", lvl: "must", d: "Python for the ML side, plus Go or a similar language at platform-heavy shops.", track: "python" },
          { n: "Linux and networking", lvl: "must", d: "Processes, permissions, DNS, TLS, ports. You will debug at this layer constantly.", track: "linux" },
          { n: "Docker", lvl: "must", d: "Deeply — layers, caching, multi-stage builds, image size. Everything you ship is a container.", track: "docker" },
          { n: "Kubernetes", lvl: "must", d: "Deployments, services, autoscaling, resource limits, GPU scheduling. The industry default and unavoidable here.", track: "k8s" },
          { n: "CI/CD", lvl: "must", d: "GitHub Actions, GitLab CI, Jenkins. Automated testing and deployment of models as well as code.", track: "cicd" },
          { n: "Infrastructure as code", lvl: "should", d: "Terraform. Clicking in a console does not scale and cannot be reviewed.", track: "terraform" }
        ]
      },
      {
        g: "The ML half",
        items: [
          { n: "The ML lifecycle", lvl: "must", d: "You need to understand training, validation and drift well enough to build the right tools — though not to do the modelling yourself.", track: "ml" },
          { n: "Experiment and model tracking", lvl: "must", d: "MLflow, Weights & Biases. Versioning models, data and parameters together." },
          { n: "Pipeline orchestration", lvl: "must", d: "Airflow, Kubeflow, Prefect, Dagster. Scheduled retraining that actually recovers from failure.", track: "mlops" },
          { n: "Model serving at scale", lvl: "must", d: "Triton, TorchServe, KServe, vLLM. Batching, GPU utilisation, autoscaling to zero." },
          { n: "Feature stores", lvl: "should", d: "The standard answer to training/serving skew, and a frequent interview topic." },
          { n: "Monitoring and observability", lvl: "must", d: "Prometheus, Grafana, plus data-drift and quality monitoring on top.", track: "observability" },
          { n: "GPU economics", lvl: "should", d: "Spot instances, scheduling, quantisation, right-sizing. Directly measurable savings." }
        ]
      }
    ],

    stack: ["Kubernetes", "Docker", "Terraform", "Airflow / Kubeflow", "MLflow", "Prometheus + Grafana", "AWS SageMaker / GCP Vertex", "Ray", "vLLM / Triton", "GitHub Actions", "Feast", "Python", "Go"],

    edge: [
      { t: "Measure the cycle time you remove", d: "'Reduced model deployment from nine days to forty minutes' is a sentence that gets you hired anywhere. Platform work must be quantified or it stays invisible." },
      { t: "Own the GPU bill", d: "GPUs are the most expensive line in any AI organisation. The engineer who halves that spend has more leverage than almost anyone else in the building." },
      { t: "Treat your platform as a product", d: "Documentation, sane defaults, good error messages. Platform engineers who think about their users' experience become indispensable; those who do not build tools nobody adopts." },
      { t: "Combine with security", d: "MLOps plus model security, supply-chain integrity and compliance is a rare and increasingly mandated combination as AI regulation arrives." }
    ],

    ladder: [
      { t: "Platform / MLOps Engineer I", y: "1–3 yrs", pay: "₹10–28 LPA", d: "Usually entered after some backend or DevOps experience." },
      { t: "MLOps Engineer II", y: "3–5 yrs", pay: "₹22–50 LPA", d: "You own a component of the platform." },
      { t: "Senior MLOps Engineer", y: "5–9 yrs", pay: "₹40–90 LPA", d: "You design the platform and set the standards teams build against." },
      { t: "Staff / Principal", y: "9+ yrs", pay: "₹80–180 LPA", d: "Infrastructure strategy for the whole AI organisation." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 6, mid: 12, hi: 24, note: "Genuinely rare as a first job. If this is the target, enter through backend or DevOps and move across — that route is common and works." },
        { k: "Early", y: "1–3 yrs", lo: 12, mid: 24, hi: 45, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 24, mid: 45, hi: 85, note: "Kubernetes plus GPU serving experience commands a clear premium." },
        { k: "Senior", y: "6–10 yrs", lo: 42, mid: 80, hi: 150, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 75, mid: 140, hi: 280, note: "" }
      ],
      notes: [
        "Pay tracks slightly above general DevOps because of the GPU and ML-specific knowledge, and because far fewer people have both halves.",
        "This role is unusually resistant to being automated away — it is the automation."
      ]
    },

    cos: [
      { tier: "AI-heavy product companies", pay: "₹18–45 LPA at entry", d: "Where the platform problems are real and large.", names: ["Google", "Microsoft", "Nvidia", "Databricks", "Uber", "Flipkart", "Swiggy", "Meesho", "Sarvam AI"] },
      { tier: "Cloud and platform vendors", pay: "₹20–50 LPA at entry", d: "Building the tools everyone else uses.", names: ["AWS", "Google Cloud", "Microsoft Azure", "Databricks", "Snowflake", "Confluent", "HashiCorp"] },
      { tier: "GCCs and enterprise", pay: "₹12–30 LPA at entry", d: "Building internal ML platforms for large organisations. Stable and well paid.", names: ["Walmart Global Tech", "JPMorgan Chase", "Goldman Sachs", "Optum", "Wells Fargo", "Shell", "Target"] }
    ],

    hire: [
      { t: "Systems and Linux round", d: "Processes, memory, networking, debugging a slow service.", tip: "Be able to narrate how you would diagnose high latency from first principles." },
      { t: "Kubernetes and containers", d: "Pods, scheduling, resource limits, why a pod is stuck in pending.", tip: "Have run a real cluster, not just followed a tutorial. It shows immediately." },
      { t: "Pipeline design", d: "'Design a system that retrains a model nightly and deploys it safely.'", tip: "Cover rollback and validation gates unprompted — that is what they are listening for." },
      { t: "Coding", d: "Python or Go, plus scripting and automation.", tip: "Clean, tested, boring code. Cleverness is a negative signal in platform work." }
    ],

    proof: [
      { t: "A complete ML platform on a small scale", d: "Train, register, deploy, monitor, roll back — automated end to end, running on a cheap cloud instance or a local cluster.", why: "This one project covers the entire interview surface of the role." },
      { t: "A CI/CD pipeline for a model", d: "Push to main triggers training, evaluation gating, and deployment only if metrics hold.", why: "Evaluation-gated deployment is the idea that defines mature MLOps." },
      { t: "A cost optimisation write-up", d: "Take a GPU workload, cut its cost significantly, document the method.", why: "Speaks directly to the value the role creates." }
    ],

    plan: [
      { n: "Python", d: "The glue language of the whole platform.", track: "python", mo: "Months 1–3" },
      { n: "Linux and the command line", d: "Deeply. This is the substrate of everything else.", track: "linux", mo: "Months 2–4" },
      { n: "Git and CI/CD", d: "Automation begins here.", track: "git", mo: "Month 2" },
      { n: "Docker", d: "Containers before orchestration, always.", track: "docker", mo: "Month 4" },
      { n: "One cloud", d: "AWS or GCP. Compute, storage, IAM, networking.", track: "cloud", mo: "Months 5–6" },
      { n: "Kubernetes", d: "The largest single learning investment in this path.", track: "k8s", mo: "Months 6–8" },
      { n: "ML fundamentals", d: "Enough to build the right tools for the people who model.", track: "ml", mo: "Months 7–9" },
      { n: "MLOps tooling", d: "MLflow, Airflow, serving, monitoring.", track: "mlops", mo: "Months 9–12" },
      { n: "Build the platform project, then hunt", d: "One end-to-end platform is worth more than any certificate.", track: "hunt", mo: "Months 12–15" }
    ],

    myths: [
      { m: "MLOps is just DevOps with a different name.", r: "It shares the foundation, then adds problems DevOps never had: data versioning, model decay, training/serving skew, GPU scheduling and evaluation gates. The extra half is why it pays more." },
      { m: "I need to be good at machine learning first.", r: "You need to understand the lifecycle, not to be a modeller. Strong engineers with moderate ML understanding do very well here." }
    ],

    next: ["devops-engineer", "ml-engineer", "ai-engineer", "sre"],
    r: ["CI/CD", "Kubernetes", "Docker", "Model Drift", "Feature Store", "Model Registry", "Containerization"]
  },

  /* ==================================================================== */
  {
    id: "cv-engineer",
    t: "Computer Vision Engineer",
    a: "Perception Engineer · Vision AI Engineer",
    icon: "eye",
    tag: "Deep specialisation",
    demand: "steady",
    deck: "You build systems that extract meaning from images and video — detection, segmentation, tracking, OCR, quality inspection, and perception for machines that move.",

    what: [
      "Computer vision is one of the few AI specialisations where physical reality is part of the problem. Lighting changes, cameras vary, lenses distort, and a model that works in the lab fails in a warehouse at 4pm when the sun comes through a window.",
      "Indian demand concentrates in a few specific places: manufacturing quality inspection, retail and shelf analytics, agritech, medical imaging, surveillance and security, document OCR, and a small but growing autonomous-systems and drone sector.",
      "It is deeper and narrower than general AI engineering. That cuts both ways — fewer jobs, but much less competition for them, and strong pay once you have real deployed experience.",
      "A significant part of the work is not modelling at all. It is data collection, annotation strategy, camera placement, and running inference on a device with no GPU and eight watts of power."
    ],

    day: [
      { t: "9:30", d: "Review overnight inference on the factory line. Detection accuracy fell on one camera — it turns out someone moved a light." },
      { t: "11:00", d: "Annotation review. Two labellers disagreed on edge cases; you write clearer labelling guidelines, which improves the model more than any architecture change would." },
      { t: "14:00", d: "Optimise the model for the edge device. Quantise, prune, convert to TensorRT, and lose two points of accuracy to gain 4× the speed — a trade everyone will accept." },
      { t: "16:00", d: "Field visit or a call with the deployment site. Vision work is unusually physical; you cannot solve these problems entirely from a desk." }
    ],

    fit: {
      love: [
        "You are interested in the physical world, not only in data.",
        "You enjoy visual debugging — much of this job is looking at images and noticing things.",
        "You like constrained optimisation problems: make this run in 30ms on this cheap board.",
        "You do not mind that success is often judged by a factory manager rather than a metric dashboard."
      ],
      avoid: [
        "You want to work entirely in language and text — that is the AI engineer path.",
        "You dislike data collection and annotation, which is a large fraction of real vision work.",
        "You want a purely remote desk job; the best vision work touches the deployment site."
      ]
    },

    skills: [
      {
        g: "Foundation",
        items: [
          { n: "Python and NumPy", lvl: "must", d: "Array manipulation is the daily grammar of image work.", track: "python" },
          { n: "Linear algebra and geometry", lvl: "must", d: "Transformations, projections, camera models. Vision is applied geometry.", track: "math" },
          { n: "OpenCV and classical CV", lvl: "must", d: "Filtering, edges, contours, morphology, homography. Frequently solves problems no neural network is needed for." },
          { n: "Deep learning", lvl: "must", d: "PyTorch, CNNs, and modern vision transformers.", track: "dl" },
          { n: "Git", lvl: "must", d: "Plus data versioning, because vision datasets are large and change often.", track: "git" }
        ]
      },
      {
        g: "Vision core",
        items: [
          { n: "Detection and segmentation", lvl: "must", d: "YOLO family, Faster R-CNN, SAM, U-Net. Know the accuracy/latency trade-offs by heart." },
          { n: "Data and annotation strategy", lvl: "must", d: "Label quality caps model quality. Guidelines, inter-annotator agreement, active learning." },
          { n: "Augmentation", lvl: "must", d: "The cheapest accuracy you will ever buy, and the main defence against overfitting on small datasets." },
          { n: "Edge deployment", lvl: "should", d: "TensorRT, ONNX, OpenVINO, quantisation, Jetson devices. Where much of the Indian industrial demand actually is." },
          { n: "Video and tracking", lvl: "should", d: "Multi-object tracking, temporal consistency, re-identification." },
          { n: "3D and depth", lvl: "edge", d: "Stereo, point clouds, SLAM. For robotics and autonomous systems." },
          { n: "Multimodal models", lvl: "should", d: "CLIP, vision-language models. Increasingly the bridge between this role and general AI engineering." }
        ]
      }
    ],

    stack: ["PyTorch", "OpenCV", "YOLO / Ultralytics", "Albumentations", "ONNX", "TensorRT", "NVIDIA Jetson", "CVAT / Label Studio", "Weights & Biases", "FastAPI", "Docker"],

    edge: [
      { t: "Get good at data, not architectures", d: "Nearly every real vision improvement comes from better data — more of it, cleaner labels, better augmentation — and almost never from a novel architecture. Engineers who internalise this outperform ones who keep swapping backbones." },
      { t: "Own the accuracy-latency trade-off", d: "Being able to say 'this runs in 22ms on a Jetson Nano at 91% mAP, and here is what we give up to get there' is exactly the sentence that closes industrial deals." },
      { t: "Learn the deployment environment", d: "The engineer who has actually stood on a factory floor and seen the lighting builds different, better systems than the one who has only had a dataset." },
      { t: "Pair vision with a domain", d: "Medical imaging, agritech, manufacturing QC. Regulatory and domain knowledge here creates real, durable scarcity." }
    ],

    ladder: [
      { t: "CV Engineer I", y: "0–2 yrs", pay: "₹6–22 LPA", d: "Training and evaluating models on prepared datasets." },
      { t: "CV Engineer II", y: "2–4 yrs", pay: "₹15–38 LPA", d: "You own a perception pipeline including its data strategy." },
      { t: "Senior CV Engineer", y: "4–8 yrs", pay: "₹30–70 LPA", d: "System design, edge optimisation, deployment ownership." },
      { t: "Principal / Perception Lead", y: "8+ yrs", pay: "₹60–150 LPA", d: "Architecture across products; often the person the business depends on entirely." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 5, mid: 11, hi: 22, note: "Startups in manufacturing and agritech hire freshers more readily than general AI teams do — a real and often-overlooked entry point." },
        { k: "Early", y: "1–3 yrs", lo: 11, mid: 20, hi: 38, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 20, mid: 36, hi: 68, note: "Edge deployment experience is the single biggest differentiator in this band." },
        { k: "Senior", y: "6–10 yrs", lo: 34, mid: 62, hi: 120, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 60, mid: 110, hi: 220, note: "Autonomous systems and medical imaging sit at the top." }
      ],
      notes: [
        "Fewer roles than general AI engineering, but proportionally far fewer qualified applicants — which for a determined candidate is an advantage, not a drawback.",
        "Automotive and robotics work often carries a premium, and increasingly involves working with global teams from India."
      ]
    },

    cos: [
      { tier: "Vision-first startups", pay: "₹8–25 LPA at entry", d: "Where most Indian CV work happens. Real ownership, real deployment, real constraints.", names: ["Mad Street Den", "Netradyne", "Detect Technologies", "Cron AI", "Intello Labs", "Fasal", "Qure.ai", "SigTuple", "Niramai"] },
      { tier: "Automotive and robotics", pay: "₹12–35 LPA at entry", d: "ADAS, autonomous systems, warehouse robotics. Rigorous engineering standards.", names: ["Bosch", "Continental", "Mercedes-Benz R&D India", "Nvidia", "Ati Motors", "GreyOrange", "Ola Electric", "Tata Elxsi"] },
      { tier: "Product companies", pay: "₹14–35 LPA at entry", d: "Visual search, content moderation, document intelligence.", names: ["Amazon", "Microsoft", "Google", "Flipkart", "Myntra", "Adobe", "Samsung R&D"] }
    ],

    hire: [
      { t: "Vision fundamentals", d: "Convolutions, receptive fields, IoU, mAP, NMS, why your detector misses small objects.", tip: "Be able to explain mAP properly. Very many candidates cannot, and it is asked almost every time." },
      { t: "Coding", d: "Python, NumPy, image manipulation, sometimes DSA.", tip: "Practise writing IoU and NMS from scratch — both are classic whiteboard questions." },
      { t: "Project deep-dive", d: "Your dataset, your labels, your failure cases.", tip: "Bring failure images. Showing where your model breaks and why reads as maturity, not weakness." },
      { t: "Deployment round", d: "How would you run this on a device with no GPU?", tip: "Quantisation, pruning, distillation, and the accuracy you would trade. Know actual numbers." }
    ],

    proof: [
      { t: "A detector trained on data you collected yourself", d: "Photograph a real problem — parking spaces, crop disease, shelf stock — annotate it, train, evaluate, deploy.", why: "Collecting your own data proves the half of the job that public datasets hide entirely." },
      { t: "An edge deployment", d: "Get a model running in real time on a Raspberry Pi, a Jetson or a phone. Report the honest frame rate." },
      { t: "A failure analysis study", d: "Take a public model and document exactly where and why it breaks: lighting, occlusion, scale, domain shift.", why: "Deep understanding of failure modes is what industrial employers are buying." }
    ],

    plan: [
      { n: "Python and NumPy", d: "Array thinking is the foundation of all image work.", track: "python", mo: "Months 1–3" },
      { n: "Maths: linear algebra and geometry", d: "Vision is applied geometry; this is not optional here.", track: "math", mo: "Months 3–5" },
      { n: "Classical computer vision", d: "OpenCV. Learn what works without deep learning first.", track: "cv", mo: "Months 4–6" },
      { n: "Deep learning", d: "PyTorch and CNNs.", track: "dl", mo: "Months 6–8" },
      { n: "Modern vision models", d: "Detection, segmentation, tracking, multimodal.", track: "cv-deep", mo: "Months 8–11" },
      { n: "Edge deployment", d: "ONNX, TensorRT, quantisation.", track: "edge-ai", mo: "Months 11–13" },
      { n: "Git and Docker", d: "Version control and reproducible environments throughout.", track: "git", mo: "Ongoing" },
      { n: "Portfolio and applications", d: "One self-collected dataset project beats three Kaggle reruns.", track: "hunt", mo: "Months 12–15" }
    ],

    myths: [
      { m: "I need a better architecture to improve accuracy.", r: "You almost always need better data. More examples of the failing case, cleaner labels, smarter augmentation. Architecture is the last lever, not the first." },
      { m: "Computer vision is a dying speciality now that multimodal models exist.", r: "General multimodal models are excellent at open-ended understanding and poor at 30ms inference on a ₹6,000 board detecting a specific defect. The industrial demand is unaffected." }
    ],

    next: ["ml-engineer", "ai-engineer", "research-engineer"],
    r: ["Convolutional Neural Network", "Object Detection", "Image Segmentation", "Transfer Learning", "Data Augmentation", "Quantisation"]
  },

  /* ==================================================================== */
  {
    id: "research-engineer",
    t: "AI Research Engineer",
    a: "Research Scientist · Member of Technical Staff",
    icon: "atom",
    tag: "Hardest to enter",
    demand: "niche",
    deck: "You push the methods forward rather than applying them — training models, running experiments at scale, and turning papers into working code.",

    what: [
      "The rarest and most selective role on this page. You work on problems where the answer is not known: new training methods, new architectures, evaluation of capabilities, alignment and safety, efficiency research.",
      "The distinction between research scientist and research engineer is meaningful. Scientists set the research direction and usually hold a PhD. Research engineers make the experiments actually run at scale — which requires exceptional engineering and deep ML understanding, and does not always require a doctorate.",
      "**Be honest with yourself about the odds.** These positions number in the low hundreds across India, attract global applicant pools, and typically expect publications, an exceptional open-source record, or a strong graduate degree. That is not a reason to abandon the ambition — it is a reason to sequence it properly.",
      "The realistic path for almost everyone: become an excellent AI or ML engineer first, publish or reproduce serious work in public, then move across. Several of the best research engineers working today arrived exactly this way, without a PhD."
    ],

    day: [
      { t: "9:30", d: "Read. Genuinely — two or three papers, properly, is a scheduled part of this job rather than an indulgence." },
      { t: "11:00", d: "Implement an idea from yesterday's reading. Most of these will not work; that is the expected outcome, not a failure." },
      { t: "14:00", d: "Launch a training run across a lot of GPUs. Then debug why loss diverged at step 4,000 — usually a data problem, occasionally a genuinely interesting one." },
      { t: "17:00", d: "Write up results, including the negative ones. Negative results save colleagues months and are valued accordingly in good labs." }
    ],

    fit: {
      love: [
        "You are comfortable with a very high failure rate — most experiments fail, and that is the work functioning correctly.",
        "You read mathematics for pleasure, or at least without resistance.",
        "You are driven by curiosity more than by shipping.",
        "You can work for months without a visible deliverable."
      ],
      avoid: [
        "You want to see users benefit from your work this quarter.",
        "You need clear direction and defined tickets.",
        "You find ambiguity stressful rather than energising."
      ]
    },

    skills: [
      {
        g: "Depth requirements",
        note: "This role is unusual in requiring genuine mathematical maturity, not merely working intuition.",
        items: [
          { n: "Mathematics, properly", lvl: "must", d: "Linear algebra, multivariable calculus, probability, optimisation. To the level of being able to derive, not just apply.", track: "math" },
          { n: "Deep learning theory", lvl: "must", d: "Architectures, optimisation dynamics, regularisation, scaling laws.", track: "dl" },
          { n: "PyTorch, expertly", lvl: "must", d: "Custom layers, autograd internals, distributed training, profiling." },
          { n: "Reading and reproducing papers", lvl: "must", d: "The core professional skill. Reproduction is much harder than reading and is the real test." },
          { n: "Distributed training", lvl: "must", d: "Data and model parallelism, DeepSpeed, FSDP, and debugging across many GPUs." },
          { n: "Experimental rigour", lvl: "must", d: "Ablations, seeds, honest baselines, statistical care. Sloppiness here destroys credibility permanently." },
          { n: "Scientific writing", lvl: "should", d: "Papers, technical reports, clear internal documentation." },
          { n: "CUDA and low-level performance", lvl: "edge", d: "Custom kernels, Triton. Rare, extremely valuable, and a genuine differentiator." }
        ]
      }
    ],

    stack: ["PyTorch", "JAX", "Hugging Face", "DeepSpeed / FSDP", "Weights & Biases", "Slurm", "CUDA / Triton", "NumPy", "LaTeX"],

    edge: [
      { t: "Reproduce a hard paper in public", d: "This is the single most effective way into research work without a PhD. A clean, documented reproduction of a significant paper is a stronger signal than most master's degrees, and it is entirely within your control." },
      { t: "Be the person whose experiments are trustworthy", d: "Rigour is the currency of research. An engineer whose results always hold up gets given the important questions." },
      { t: "Specialise in efficiency", d: "Making training or inference cheaper is research with an immediate commercial value, which makes it an unusually accessible entry point." },
      { t: "Publish, in any form", d: "A workshop paper, an arXiv preprint, a serious technical blog. Visible thinking is how this field's hiring actually works." }
    ],

    ladder: [
      { t: "Research Engineer", y: "0–3 yrs", pay: "₹18–50 LPA", d: "Usually entered with a master's, a PhD, or an exceptional public record." },
      { t: "Senior Research Engineer", y: "3–6 yrs", pay: "₹45–100 LPA", d: "You own a research direction." },
      { t: "Staff Research Scientist", y: "6+ yrs", pay: "₹90–250 LPA", d: "You set the agenda for a team." },
      { t: "Principal / Distinguished", y: "10+ yrs", pay: "₹2–6 Cr", d: "A very small number of people. Compensation at frontier labs is genuinely exceptional." }
    ],

    pay: {
      bands: [
        { k: "Entry (MS/PhD)", y: "0–2 yrs", lo: 18, mid: 35, hi: 70, note: "Rarely open to freshers without a graduate degree or an outstanding public record." },
        { k: "Early", y: "2–4 yrs", lo: 35, mid: 60, hi: 110, note: "" },
        { k: "Mid", y: "4–8 yrs", lo: 55, mid: 100, hi: 190, note: "" },
        { k: "Senior", y: "8+ yrs", lo: 90, mid: 180, hi: 400, note: "Frontier labs pay well beyond the top of this range for a small number of people." }
      ],
      notes: [
        "The highest ceiling in the industry and the smallest number of seats. Both facts matter.",
        "Indian research positions concentrate at Google Research India, Microsoft Research India, Adobe Research, IBM Research, Nvidia, Sarvam AI, and the IITs/IISc."
      ]
    },

    cos: [
      { tier: "Industrial research labs", pay: "₹25–70 LPA at entry", d: "Publication-oriented, PhD-heavy, genuinely at the frontier.", names: ["Google Research India", "Microsoft Research India", "Adobe Research", "IBM Research India", "Nvidia", "Amazon Science", "Samsung R&D"] },
      { tier: "Frontier AI labs", pay: "₹40 LPA–2 Cr+", d: "Very few India-based seats; some remote hiring. Exceptionally selective.", names: ["OpenAI", "Anthropic", "Google DeepMind", "Meta AI (FAIR)", "Mistral", "Cohere"] },
      { tier: "Indian AI labs and academia", pay: "₹15–45 LPA at entry", d: "Building sovereign and Indic-language models. Growing quickly and a realistic target.", names: ["Sarvam AI", "Krutrim", "AI4Bharat", "IIT Bombay / Madras / Delhi", "IISc Bangalore", "Wadhwani AI"] }
    ],

    hire: [
      { t: "Research discussion", d: "Your work, in depth, and your reading of the field.", tip: "Have strong, defensible opinions about two or three recent papers." },
      { t: "Maths and ML depth", d: "Derivations, optimisation, architecture reasoning.", tip: "Be able to derive backpropagation and explain attention from first principles." },
      { t: "Implementation round", d: "Implement an attention mechanism or a training loop from scratch.", tip: "Practise writing multi-head attention in PyTorch without reference until it is fluent." },
      { t: "Paper critique", d: "Read a paper and identify its weaknesses.", tip: "Look at the baselines and the ablations — that is where papers are usually weakest." }
    ],

    proof: [
      { t: "A faithful reproduction of a significant paper", d: "Code, results, and an honest account of where you could not match the reported numbers.", why: "The single highest-leverage artefact for entering research without a doctorate." },
      { t: "A small model trained from scratch", d: "A tiny language model or vision model, trained end to end, with the training dynamics documented.", why: "Proves you understand training rather than only fine-tuning." },
      { t: "A publication of any size", d: "A workshop paper, a preprint, or a rigorous technical blog post with experiments.", why: "Demonstrates you can complete and defend a piece of research." }
    ],

    plan: [
      { n: "Everything on the AI Engineer path first", d: "Research engineering is built on top of strong engineering, not instead of it.", href: "#/role/ai-engineer", kind: "role", mo: "Year 1" },
      { n: "Mathematics, to real depth", d: "Beyond intuition — derivations, proofs, optimisation theory.", track: "math-adv", mo: "Year 1–2" },
      { n: "Deep learning theory", d: "Not just how to use PyTorch, but why training behaves as it does.", track: "dl", mo: "Year 2" },
      { n: "Reproduce papers, publicly", d: "Start with a small one. This is the core apprenticeship of the field.", track: "papers", mo: "Year 2, ongoing" },
      { n: "Distributed training", d: "Multi-GPU, sharding, profiling.", track: "distributed", mo: "Year 2–3" },
      { n: "Consider a master's", d: "Genuinely helpful for this specific role, unlike for applied AI engineering.", track: "grad", mo: "Optional" }
    ],

    myths: [
      { m: "I can get a research role straight out of a bachelor's degree.", r: "It happens, and it is rare enough that you should not plan around it. The dependable route is engineering first, public research output second, research role third — and it typically takes three to five years." },
      { m: "Research is more valuable than engineering.", r: "It is more prestigious in some circles and not more valuable. Most of the world's AI impact is created by applied engineers, and applied roles are far more numerous and often equally well paid." }
    ],

    next: ["ai-engineer", "ml-engineer", "cv-engineer"],
    r: ["Backpropagation", "Gradient Descent", "Scaling Laws", "Ablation Study", "Transformer"]
  }

]);
