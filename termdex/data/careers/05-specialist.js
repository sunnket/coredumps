/* Career Roadmap — Product & Specialist roles.
   Technical skill is the entry price here, not the job itself. */

TD.addRoles("edge", [

  /* ==================================================================== */
  {
    id: "ai-product-manager",
    t: "AI Product Manager",
    a: "Technical PM · Product Manager (AI/ML)",
    icon: "compass",
    tag: "Rarely a first job",
    demand: "strong",
    deck: "You decide what gets built and why — which for AI products means constantly separating what the technology can genuinely do from what everyone believes it can do.",

    what: [
      "A product manager owns the *what* and the *why*; engineering owns the *how*. You are accountable for the outcome without authority over the people producing it, which means influence and clarity are your only real tools.",
      "AI product management is distinctly harder than general product management for one structural reason: **the product is probabilistic**. You cannot write a specification that says 'the answer will be correct'. You have to define acceptable quality, design for the cases where it fails, and set expectations with customers who have been told AI is magic.",
      "The work is problem discovery, prioritisation, evaluation criteria, working with engineering on trade-offs, pricing a feature whose cost varies per request, and being the person who says a demo is not a product.",
      "**Be realistic about entry.** This is very rarely a first job in India. The reliable routes in are: engineer for two to four years and move across, business analyst or consultant with technical depth, or associate product manager programmes — which exist at a handful of companies and are extraordinarily competitive."
    ],

    day: [
      { t: "9:30", d: "Customer calls. Three in a row. This is the part juniors skip and seniors protect — you cannot build for a user you have not listened to." },
      { t: "11:30", d: "Work through evaluation criteria with engineering. What accuracy is good enough to ship? What happens on the failures? Nobody else will define this." },
      { t: "14:00", d: "Write the specification. Mostly it is about the edge cases and the failure behaviour — the happy path takes a paragraph." },
      { t: "16:00", d: "Tell a senior stakeholder that the feature they saw in a competitor's launch video does not work reliably, and explain what you can actually deliver instead." }
    ],

    fit: {
      love: [
        "You like deciding more than building.",
        "You are comfortable with responsibility that exceeds your authority.",
        "You communicate exceptionally well, in writing and in rooms.",
        "You genuinely enjoy talking to customers."
      ],
      avoid: [
        "You want to write code — you will not, and pretending otherwise makes you a bad PM.",
        "Meetings drain you; this job is largely meetings.",
        "You need clear personal credit for outcomes."
      ]
    },

    skills: [
      {
        g: "Technical depth",
        note: "You do not need to build it. You absolutely need to understand it well enough that engineers respect your judgement and cannot mislead you.",
        items: [
          { n: "How LLMs work, conceptually", lvl: "must", d: "Tokens, context, hallucination, retrieval, fine-tuning. Enough to know what is possible and what is a fantasy.", term: "Large Language Model" },
          { n: "AI evaluation", lvl: "must", d: "How quality is measured, why it is hard, what 'good enough' means for your case. The defining PM skill in AI products." },
          { n: "Cost and latency literacy", lvl: "must", d: "AI features have per-request costs. Pricing, margins and rate limits are product decisions and they are yours." },
          { n: "Data literacy", lvl: "must", d: "SQL and analytics well enough to answer your own questions rather than queue behind an analyst.", track: "sql" },
          { n: "System understanding", lvl: "should", d: "APIs, latency, what makes something hard to build. It is what makes your prioritisation credible." },
          { n: "AI risk and ethics", lvl: "should", d: "Bias, privacy, misuse, regulation. Increasingly a formal requirement rather than a philosophical interest." }
        ]
      },
      {
        g: "The actual craft",
        items: [
          { n: "Problem discovery", lvl: "must", d: "Customer interviews, distinguishing what people say from what they do. Everything downstream is worthless if this is wrong." },
          { n: "Prioritisation", lvl: "must", d: "Saying no, repeatedly, with reasons. The core mechanical skill." },
          { n: "Written communication", lvl: "must", d: "Specifications, strategy documents, updates. In product management writing *is* thinking, and it is how you scale." },
          { n: "Metrics and experimentation", lvl: "must", d: "Defining success before building, then measuring honestly afterwards.", term: "A/B Testing" },
          { n: "Stakeholder management", lvl: "must", d: "Engineering, design, sales, leadership — all with different incentives, all needing the same story." },
          { n: "Expectation setting", lvl: "must", d: "Uniquely important in AI. Overselling a probabilistic product is how trust dies, in one release." }
        ]
      }
    ],

    stack: ["Jira / Linear", "Figma", "SQL", "Amplitude / Mixpanel", "Notion", "LangSmith / Langfuse", "Miro", "Excel"],

    edge: [
      { t: "Be the one who defines 'good enough'", d: "Every AI product stalls on the question of what quality is acceptable to ship. The PM who can define it, defend it and evolve it is the one the team cannot function without." },
      { t: "Ship the failure path", d: "Most AI products are designed only for when the model is right. The ones that succeed handle uncertainty gracefully — showing sources, admitting doubt, offering a fallback. Designing that is a product decision, not an engineering one." },
      { t: "Own the unit economics", d: "AI features can be gross-margin negative and frequently are. A PM who understands cost per request and designs around it protects the business in a way most PMs cannot." },
      { t: "Stay close to the technology", d: "Build small things yourself. A PM who has personally built a RAG prototype makes better decisions and earns engineering trust immediately." },
      { t: "Write extremely well", d: "In product management, the document is the deliverable. Clear writing is the single highest-return skill in the role, and it compounds." }
    ],

    ladder: [
      { t: "Associate PM", y: "0–2 yrs", pay: "₹12–35 LPA", d: "Rare and highly competitive. Usually via a formal APM programme." },
      { t: "Product Manager", y: "2–5 yrs", pay: "₹25–60 LPA", d: "You own a product area end to end." },
      { t: "Senior PM", y: "5–8 yrs", pay: "₹45–100 LPA", d: "Strategy for a significant surface; you influence what the company builds." },
      { t: "Group PM / Director", y: "8+ yrs", pay: "₹90–250 LPA", d: "Portfolio ownership and people leadership." }
    ],

    pay: {
      bands: [
        { k: "APM / entry", y: "0–2 yrs", lo: 10, mid: 22, hi: 40, note: "Very few seats. APM programmes at Google, Microsoft, Flipkart, Swiggy and a handful of others receive thousands of applications for a few dozen places. An MBA from a top institute is a common but not mandatory route." },
        { k: "Early", y: "2–4 yrs", lo: 22, mid: 40, hi: 70, note: "" },
        { k: "Mid", y: "4–7 yrs", lo: 38, mid: 65, hi: 110, note: "" },
        { k: "Senior", y: "7–12 yrs", lo: 60, mid: 110, hi: 200, note: "" },
        { k: "Director+", y: "12+ yrs", lo: 100, mid: 200, hi: 400, note: "" }
      ],
      notes: [
        "Pay is high and entry is narrow. The realistic route for most people is engineering first, then an internal move — which is a well-worn path and considerably more achievable than applying externally as a fresher.",
        "A top-tier MBA remains a significant advantage for product management in India, unlike in engineering roles where it is largely irrelevant."
      ]
    },

    cos: [
      { tier: "Global product companies", pay: "₹30–60 LPA at entry", d: "Structured product craft and formal APM programmes.", names: ["Google", "Microsoft", "Amazon", "Adobe", "Atlassian", "Salesforce", "Uber", "Meta"] },
      { tier: "Indian product companies", pay: "₹18–45 LPA at entry", d: "More ownership sooner, faster progression.", names: ["Flipkart", "Swiggy", "Razorpay", "CRED", "PhonePe", "Meesho", "Zomato", "Postman", "Freshworks", "Zoho"] },
      { tier: "AI startups", pay: "₹15–40 LPA + equity", d: "Where AI product management is being invented in real time.", names: ["Sarvam AI", "Observe.AI", "Krutrim", "Haptik", "Rephrase.ai", "AI-first SaaS startups"] }
    ],

    hire: [
      { t: "Product sense", d: "'Improve this product.' 'Design an AI feature for this user.'", tip: "Start with the user and the problem, never the solution. Structure is more important than creativity here." },
      { t: "Analytical round", d: "Metric definition, estimation, trade-off analysis.", tip: "Practise market sizing aloud. It is a standard round and it is purely a technique." },
      { t: "Technical round", d: "For AI PM roles specifically: how retrieval works, why models hallucinate, what fine-tuning does.", tip: "Know the limitations better than the capabilities. It is what distinguishes a technical PM from an enthusiastic one." },
      { t: "Execution round", d: "Prioritisation, launch planning, handling a slipping deadline.", tip: "Show a framework and then show judgement overriding it where appropriate." },
      { t: "Behavioural", d: "Influence without authority, conflict with engineering, a failed launch.", tip: "Have a real failure story with what you learned. It is asked in nearly every PM loop." }
    ],

    proof: [
      { t: "Ship something yourself", d: "Build and launch a small AI product, even a trivial one. Get ten users, then write about what you learned.", why: "The strongest possible signal for an aspiring PM without PM experience, and entirely within your control." },
      { t: "A written product teardown", d: "Analyse an AI product in depth — its decisions, its trade-offs, what you would change and why.", why: "Demonstrates product thinking and writing simultaneously, which are the two things being assessed." },
      { t: "A specification for an AI feature", d: "Write a complete spec including evaluation criteria, failure handling and cost model.", why: "Very few candidates show they understand that AI specifications are different. It marks you immediately." }
    ],

    plan: [
      { n: "Become technical first", d: "Two to four years in engineering or data is the most reliable route in. Take it seriously rather than treating it as a detour.", href: "#/role/ai-engineer", kind: "role", mo: "Years 1–3" },
      { n: "SQL and analytics", d: "Answer your own data questions.", track: "sql", mo: "Months 1–3" },
      { n: "AI fundamentals", d: "Enough depth to be respected by engineers.", track: "llm", mo: "Months 4–7" },
      { n: "Product craft", d: "Discovery, prioritisation, metrics, specification writing.", track: "pm", mo: "Months 6–10" },
      { n: "Build and launch something", d: "The strongest evidence available to you.", track: "hunt", mo: "Months 8–12" },
      { n: "Write publicly", d: "Teardowns, analyses, opinions. Product managers are hired substantially on visible thinking.", track: "writing", mo: "Ongoing" }
    ],

    myths: [
      { m: "PM is a good first job because it does not require coding.", r: "It requires judgement built from experience, which is precisely what a fresher lacks. It is one of the hardest roles to enter directly and one of the easiest to enter after a few years of building." },
      { m: "PMs tell engineers what to do.", r: "PMs have no authority over engineers. Everything runs on persuasion, evidence and trust — which is exactly why technical credibility matters so much." },
      { m: "An MBA is required.", r: "Not required, genuinely helpful in India for this particular role. Many excellent product managers came from engineering with no MBA at all." }
    ],

    next: ["ai-engineer", "data-scientist", "solutions-engineer"],
    r: ["A/B Testing", "Large Language Model", "Hallucination", "Retrieval-Augmented Generation", "Product-Market Fit"]
  },

  /* ==================================================================== */
  {
    id: "solutions-engineer",
    t: "AI Solutions Engineer",
    a: "Forward-Deployed Engineer · Sales Engineer · Customer Engineer",
    icon: "chat",
    tag: "Fast-growing niche",
    demand: "hot",
    deck: "You sit between the product and the customer — building real integrations, running proofs of concept, and turning a general platform into something that solves one company's specific problem.",

    what: [
      "One of the fastest-growing roles in AI, and one almost nobody plans for. When a company sells an AI platform, someone has to go and make it work inside a customer's messy real environment. That is this job.",
      "It is genuinely technical — you write code, build integrations, debug in unfamiliar systems — and genuinely customer-facing. That combination is rare, which is why it pays well and why the people who are good at it are fought over.",
      "The 'forward-deployed engineer' variant, popularised by Palantir and now common at AI companies, sits embedded with a customer for weeks or months building bespoke solutions. It is demanding, unusually varied, and an extraordinary way to learn how businesses actually work.",
      "It is an excellent role for an engineer who has discovered they like people, and a common bridge into product management, sales leadership or founding a company. Very few people target it deliberately, which is exactly why it is worth knowing about."
    ],

    day: [
      { t: "9:30", d: "A customer call. Their data is in a format the documentation does not mention. You write a connector during the call." },
      { t: "11:30", d: "Build a proof of concept for a prospect. Forty-eight hours to demonstrate value on their actual data — not a demo dataset." },
      { t: "14:00", d: "Feed reality back to the product team. Three customers have asked for the same missing capability; you are the reason it gets built." },
      { t: "16:00", d: "Debug a failing integration inside a customer's environment, with limited access and a deadline. This is the job at its most characteristic." }
    ],

    fit: {
      love: [
        "You are technical and you genuinely enjoy people.",
        "Variety appeals to you; every customer is a different problem.",
        "You like solving business problems, not only technical ones.",
        "You are comfortable being the only technical person in a room of stakeholders."
      ],
      avoid: [
        "You want to go deep on one system for years.",
        "Customer pressure and deadlines stress you rather than energise you.",
        "You dislike travel or constant context switching."
      ]
    },

    skills: [
      {
        g: "Technical",
        items: [
          { n: "Python and scripting", lvl: "must", d: "You build integrations quickly and often disposably.", track: "python" },
          { n: "APIs and integration", lvl: "must", d: "REST, webhooks, authentication, data formats, and other people's badly documented systems.", term: "REST" },
          { n: "SQL and data wrangling", lvl: "must", d: "Customer data always arrives in the wrong shape.", track: "sql" },
          { n: "AI product knowledge", lvl: "must", d: "RAG, agents, evaluation — enough to design a genuine solution rather than repeat marketing.", track: "llm" },
          { n: "Cloud basics", lvl: "should", d: "Deploying into a customer's environment and respecting their constraints.", track: "cloud" },
          { n: "Debugging in the dark", lvl: "must", d: "Diagnosing problems in systems you cannot see, with partial access and an audience." }
        ]
      },
      {
        g: "Commercial",
        items: [
          { n: "Discovery", lvl: "must", d: "Finding the real problem behind the stated request. Customers ask for solutions; your job is to find the problem." },
          { n: "Demonstration and storytelling", lvl: "must", d: "Showing technical work in terms of business outcome." },
          { n: "Scoping", lvl: "must", d: "Knowing what can be delivered in two weeks and being honest about it. Overpromising destroys the account." },
          { n: "Writing", lvl: "should", d: "Proposals, solution designs, documentation for people who will not read it twice." },
          { n: "Patience", lvl: "must", d: "Enterprise timelines are slow, procurement is real, and none of it is personal." }
        ]
      }
    ],

    stack: ["Python", "REST APIs", "SQL", "Postman", "Docker", "AWS / Azure", "LangChain", "Streamlit", "Jupyter", "Salesforce"],

    edge: [
      { t: "Become the customer's trusted engineer", d: "The solutions engineer the customer asks for by name is worth more than any account manager. Trust is the entire asset in this role and it is built by being honest about limitations." },
      { t: "Turn each solution into a product", d: "If three customers need it, it belongs in the product. The engineer who spots and pushes those patterns shapes the roadmap from outside the product team." },
      { t: "Learn industries, not just technology", d: "Understanding how banks or hospitals or logistics companies actually operate is what lets you design solutions that survive contact with their reality." },
      { t: "Use it as a launchpad", d: "This role gives you a view of the market, the product and the customer simultaneously. It is one of the best possible backgrounds for product management or for founding a company." }
    ],

    ladder: [
      { t: "Solutions Engineer", y: "1–3 yrs", pay: "₹10–30 LPA", d: "Usually entered after some engineering experience." },
      { t: "Senior Solutions Engineer", y: "3–6 yrs", pay: "₹25–55 LPA", d: "You own strategic accounts and complex deployments." },
      { t: "Principal / Solutions Architect", y: "6+ yrs", pay: "₹50–120 LPA", d: "Architecture across accounts; often includes commission." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 6, mid: 12, hi: 24, note: "Some companies hire freshers into associate solutions roles; most prefer a year or two of engineering first." },
        { k: "Early", y: "1–3 yrs", lo: 12, mid: 24, hi: 45, note: "Often includes a variable component tied to accounts." },
        { k: "Mid", y: "3–6 yrs", lo: 24, mid: 45, hi: 80, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 42, mid: 80, hi: 150, note: "" }
      ],
      notes: [
        "Compensation frequently includes a commission or bonus component tied to revenue, which raises the ceiling above equivalent engineering roles and adds variability.",
        "Global companies hiring solutions engineers in India for international customers pay particularly well."
      ]
    },

    cos: [
      { tier: "AI and data platform companies", pay: "₹15–40 LPA at entry", d: "Where this role is most developed and most valued.", names: ["Databricks", "Snowflake", "Palantir", "OpenAI", "Anthropic", "Scale AI", "Confluent", "MongoDB", "Elastic"] },
      { tier: "Enterprise SaaS", pay: "₹12–30 LPA at entry", d: "Complex integrations into large organisations.", names: ["Salesforce", "SAP", "ServiceNow", "Freshworks", "Zoho", "Postman", "Atlassian", "HubSpot"] },
      { tier: "Indian AI startups", pay: "₹10–28 LPA at entry", d: "You will often be the entire solutions function, which is a fast education.", names: ["Observe.AI", "Sarvam AI", "Haptik", "Yellow.ai", "Gupshup", "Fractal"] }
    ],

    hire: [
      { t: "Technical screen", d: "Coding and integration ability. Real, not decorative.", tip: "You must genuinely be able to build. This is not a sales role with a technical veneer." },
      { t: "Demo / presentation round", d: "Present a technical solution to a mixed audience.", tip: "Lead with the business outcome, then show the technology. Practise this — the ordering is what is being assessed." },
      { t: "Customer scenario", d: "'The customer says it does not work and is angry.'", tip: "Acknowledge, gather facts, commit to a specific follow-up. Never argue and never overpromise." },
      { t: "Product deep-dive", d: "How well do you understand what you would be selling?", tip: "Research the product properly and prepare an honest opinion about its limitations. It signals integrity." }
    ],

    proof: [
      { t: "An integration project", d: "Connect two systems that were not designed to talk to each other. Document it clearly.", why: "It is the literal job." },
      { t: "A technical demo you present well", d: "Record yourself demonstrating something you built, aimed at a business audience.", why: "Demonstrates the rare half of the skill combination." },
      { t: "A solution write-up", d: "Take a real business problem and design a complete solution — architecture, timeline, cost, risks.", why: "Mirrors the proposal work that defines the role." }
    ],

    plan: [
      { n: "Engineering foundations", d: "Python, APIs, SQL. You must be genuinely technical.", track: "python", mo: "Months 1–5" },
      { n: "AI application skills", d: "RAG, agents, integration patterns.", track: "llm", mo: "Months 5–9" },
      { n: "Cloud basics", d: "Deploying into environments you do not control.", track: "cloud", mo: "Months 9–10" },
      { n: "Communication and demo practice", d: "Record yourself. Watch it. Improve it. Repeat.", track: "comms", mo: "Ongoing" },
      { n: "Build integrations for a portfolio", d: "Two or three, documented as if for a customer.", track: "hunt", mo: "Months 10–13" }
    ],

    myths: [
      { m: "It is a sales job for failed engineers.", r: "It requires strong engineering ability plus communication skill that most engineers do not have. The combination is scarce, which is why it pays what it does." },
      { m: "It is a career dead end.", r: "It is one of the best routes into product management, sales leadership and founding companies, because you see the customer, the product and the market at once." }
    ],

    next: ["ai-engineer", "ai-product-manager", "backend-engineer"],
    r: ["REST", "Retrieval-Augmented Generation", "API Gateway", "Webhook", "Proof of Concept"]
  },

  /* ==================================================================== */
  {
    id: "developer-advocate",
    t: "Developer Advocate",
    a: "DevRel Engineer · Technical Evangelist · Developer Educator",
    icon: "sparkles",
    tag: "For the explainers",
    demand: "niche",
    deck: "You help developers succeed with a product — through documentation, examples, talks and content — and bring their frustrations back to the people who can fix them.",

    what: [
      "Developer relations exists because developers do not respond to advertising. They respond to something that works, explained clearly by someone who has evidently used it. Your job is to be that person, at scale.",
      "The work is genuinely varied: writing documentation and tutorials, building sample applications, speaking at conferences, answering questions in community forums, producing video, and carrying developer feedback into the product team with enough credibility that it changes the roadmap.",
      "It requires real technical ability. Developers detect someone who has not actually used the product within about ninety seconds, and once they do, your credibility is gone permanently.",
      "It is a small field with few openings and unusual accessibility — because your qualification is your public work. Someone with a strong blog, active open-source contributions and a few conference talks can enter this field without a conventional background, which is true of almost nothing else."
    ],

    day: [
      { t: "9:30", d: "Answer questions in the community forum and on GitHub issues. Three people are stuck on the same thing, which means the documentation is wrong, which is now your problem to fix." },
      { t: "11:00", d: "Build a sample application demonstrating a new feature. Building it properly is how you find the rough edges before customers do." },
      { t: "14:00", d: "Write the tutorial. Clarity is the entire product here; a confusing tutorial is worse than none." },
      { t: "16:00", d: "Take feedback to the product team with specifics: 'Eleven developers hit this error this week; here is the exact confusion.'" }
    ],

    fit: {
      love: [
        "You genuinely enjoy explaining things and are good at it.",
        "You like helping people get unstuck.",
        "You are comfortable in public — writing, speaking, video.",
        "You enjoy breadth over depth and get restless on one codebase."
      ],
      avoid: [
        "You dislike public exposure or find it draining.",
        "You want deep focused engineering work.",
        "You need clearly measurable impact — DevRel's value is real and awkward to quantify."
      ]
    },

    skills: [
      {
        g: "Technical",
        items: [
          { n: "Real engineering ability", lvl: "must", d: "You must be able to build genuinely useful things. Credibility is the entire asset and it cannot be faked.", track: "python" },
          { n: "The product's domain", lvl: "must", d: "Deep working knowledge of whatever you advocate for — AI tooling, databases, cloud infrastructure." },
          { n: "Multiple languages", lvl: "should", d: "Your audience uses many; examples in only one exclude most of them." },
          { n: "Git and open source", lvl: "must", d: "You live in public repositories.", track: "git" }
        ]
      },
      {
        g: "Communication",
        items: [
          { n: "Technical writing", lvl: "must", d: "The core skill. Documentation, tutorials, blog posts that respect the reader's time." },
          { n: "Public speaking", lvl: "must", d: "Conference talks, meetups, workshops, livestreams. Learnable with practice and genuinely uncomfortable at first." },
          { n: "Video and demos", lvl: "should", d: "Increasingly the primary format for developer learning." },
          { n: "Community management", lvl: "must", d: "Forums, Discord, GitHub. Being consistently helpful in public is most of the job." },
          { n: "Teaching instinct", lvl: "must", d: "Remembering what it was like not to know. The scarcest skill in technical communication." },
          { n: "Feedback synthesis", lvl: "should", d: "Turning scattered developer complaints into a product argument that engineering will act on." }
        ]
      }
    ],

    stack: ["Markdown", "Docusaurus / MkDocs", "GitHub", "Video editing", "Figma", "Jupyter", "The advocated product itself"],

    edge: [
      { t: "Build genuinely useful things, not demos", d: "A sample application that people actually use in production earns more credibility than fifty polished toy examples. Usefulness is the currency." },
      { t: "Own the documentation", d: "Documentation is the highest-traffic developer surface at almost every company, and it is chronically neglected. Improving it measurably is the clearest value you can create." },
      { t: "Be honest about limitations", d: "Advocates who acknowledge what the product does badly are believed when they say what it does well. Advocates who only praise are ignored. This is not a moral point; it is a strategic one." },
      { t: "Build a personal audience", d: "In DevRel your reach is a portable career asset. It survives every job change and it is what makes you hireable without an interview." }
    ],

    ladder: [
      { t: "Developer Advocate", y: "1–3 yrs", pay: "₹10–28 LPA", d: "Content, documentation, community, events." },
      { t: "Senior Developer Advocate", y: "3–6 yrs", pay: "₹24–55 LPA", d: "You own a product area's developer experience and strategy." },
      { t: "Head of DevRel", y: "6+ yrs", pay: "₹45–120 LPA", d: "Team and strategy leadership." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 5, mid: 11, hi: 22, note: "Rare directly, and unusually accessible via a strong public portfolio. A well-followed technical blog is a genuine qualification here in a way it is nowhere else." },
        { k: "Early", y: "1–3 yrs", lo: 11, mid: 22, hi: 40, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 22, mid: 40, hi: 70, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 38, mid: 70, hi: 130, note: "Global companies hiring from India for worldwide audiences pay at the top of this." }
      ],
      notes: [
        "A small field — perhaps a few hundred full-time roles in India — with disproportionate visibility and strong global remote opportunities.",
        "Your public work is your resume, which makes this one of the few fields where you can build your qualification entirely in your spare time before ever applying."
      ]
    },

    cos: [
      { tier: "Developer tool companies", pay: "₹14–35 LPA at entry", d: "Where DevRel is a core function rather than a marketing experiment.", names: ["Postman", "MongoDB", "Vercel", "GitHub", "GitLab", "HashiCorp", "Redis", "Confluent", "Hasura", "Appwrite"] },
      { tier: "Cloud and AI platforms", pay: "₹16–40 LPA at entry", d: "Large developer audiences and substantial budgets.", names: ["AWS", "Google Cloud", "Microsoft Azure", "OpenAI", "Anthropic", "Hugging Face", "Nvidia", "Databricks"] },
      { tier: "Indian startups", pay: "₹8–24 LPA at entry", d: "Often the first DevRel hire, which means you define the function.", names: ["Razorpay", "Zoho", "Freshworks", "Hasura", "Appwrite", "Deepgram", "Zerodha (Kite Connect)"] }
    ],

    hire: [
      { t: "Portfolio review", d: "Your blog, talks, open-source work and content. This round is decided before you apply.", tip: "Start publishing now. The portfolio *is* the application in this field." },
      { t: "Technical round", d: "Real coding — they are checking you are genuinely an engineer.", tip: "Do not underestimate this. Weak technical ability is disqualifying." },
      { t: "Content exercise", d: "Write a tutorial or record a demo for their product.", tip: "Show your teaching instinct: anticipate where a reader gets stuck and address it before they do." },
      { t: "Presentation", d: "Give a talk to the team.", tip: "Practise until the structure is invisible. Energy and clarity matter more than depth in this format." }
    ],

    proof: [
      { t: "A consistent technical blog", d: "Twenty genuinely useful posts about things you built and problems you solved.", why: "It is simultaneously the qualification, the portfolio and the interview in this field." },
      { t: "Conference or meetup talks", d: "Start with local meetups. The barrier is far lower than people assume.", why: "Speaking ability is a core requirement and it must be demonstrated, not claimed." },
      { t: "Meaningful open-source contribution", d: "Documentation, examples, tooling for a project you use.", why: "Public collaboration under review is the closest available proxy for the job." },
      { t: "A tutorial series", d: "Teach something end to end, well.", why: "Demonstrates the teaching instinct, which is the scarcest part of the skill set." }
    ],

    plan: [
      { n: "Become genuinely technical first", d: "You cannot advocate for what you cannot build. Any engineering path works.", href: "#/role/ai-engineer", kind: "role", mo: "Year 1" },
      { n: "Start writing publicly", d: "Immediately, from week one. Badly at first. That is fine and it is the only way.", track: "writing", mo: "Ongoing from month 1" },
      { n: "Contribute to open source", d: "Documentation and examples are welcome contributions and a natural fit.", track: "git", mo: "Months 4+" },
      { n: "Speak at a local meetup", d: "The most uncomfortable and highest-return step in this whole plan.", track: "speaking", mo: "Months 8+" },
      { n: "Build an audience, then apply", d: "In DevRel the portfolio does the applying for you.", track: "hunt", mo: "Months 12+" }
    ],

    myths: [
      { m: "DevRel is marketing.", r: "It sits near marketing and it is a technical role. Advocates who are not real engineers lose credibility with developers immediately and permanently." },
      { m: "You need to be famous already.", r: "You need to be consistently useful. Audience follows from that, not the other way round, and most working advocates built theirs after entering the field." }
    ],

    next: ["solutions-engineer", "ai-product-manager", "frontend-engineer"],
    r: ["Open Source", "API Documentation", "SDK"]
  }

]);
