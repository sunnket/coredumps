/* Career Roadmap — Software Engineering roles.
   The largest hiring pool in Indian tech by a very wide margin. */

TD.addRoles("soft", [

  /* ==================================================================== */
  {
    id: "frontend-engineer",
    t: "Frontend Engineer",
    a: "UI Engineer · Web Developer",
    icon: "browser",
    tag: "Most visible work",
    demand: "strong",
    deck: "You build the part people actually touch — the interface, its speed, its accessibility, and the thousand small decisions that make software feel good or feel cheap.",

    what: [
      "Frontend has quietly become one of the harder engineering disciplines. A modern web application is a distributed system running in an environment you do not control, on devices you cannot test, with a user watching every millisecond of it.",
      "The job is state management, rendering performance, accessibility, browser compatibility, build tooling and API integration — plus a design sensibility that most engineers do not have and which is worth a great deal when you do.",
      "It is also the most immediately rewarding discipline to learn. You change a line and see it. That feedback loop makes frontend the fastest route from beginner to something impressive in a portfolio, which matters more than it sounds when your motivation has to survive nine months.",
      "The pay is slightly below backend at the same level in India, and closes at senior levels — particularly for engineers who can also handle design systems, performance and accessibility, which very few can."
    ],

    day: [
      { t: "9:30", d: "A bug: the checkout button does nothing on iOS Safari. Two hours later it is a date-parsing difference. Frontend is substantially archaeology." },
      { t: "11:30", d: "Build a new component. The design has fourteen states, and the honest work is enumerating them before writing anything." },
      { t: "14:00", d: "Performance. The dashboard takes 4.2 seconds to become interactive; you split the bundle, defer a chart library and get it under 1.5." },
      { t: "16:00", d: "Accessibility pass with a screen reader. Three components are unusable by keyboard. Nobody asked; it is still your job." }
    ],

    fit: {
      love: [
        "You care how things look and feel, and small details bother you.",
        "You want to see your work immediately, not after a deploy pipeline.",
        "You enjoy working closely with designers.",
        "You like a fast feedback loop more than deep theoretical work."
      ],
      avoid: [
        "Visual detail bores you.",
        "You want to work on algorithms and data at scale — that is backend.",
        "Browser inconsistency will make you furious rather than curious."
      ]
    },

    skills: [
      {
        g: "Foundation",
        note: "The framework everyone talks about matters far less than these. Engineers with weak fundamentals hit a hard ceiling around year three.",
        items: [
          { n: "HTML, semantically", lvl: "must", d: "Structure, forms, semantics. The foundation of accessibility and of everything else.", track: "html" },
          { n: "CSS, properly", lvl: "must", d: "Flexbox, grid, cascade, specificity, responsive design. Underrated to an extraordinary degree; strong CSS is genuinely rare.", track: "css" },
          { n: "JavaScript, deeply", lvl: "must", d: "Closures, prototypes, the event loop, promises, async/await, modules. This is what separates a framework user from an engineer.", track: "js" },
          { n: "The browser", lvl: "must", d: "DOM, rendering pipeline, reflow, network, storage, devtools. You cannot optimise what you cannot picture.", term: "DOM" },
          { n: "Git", lvl: "must", d: "Branching, review, conflict resolution.", track: "git" }
        ]
      },
      {
        g: "The modern stack",
        items: [
          { n: "One framework, well", lvl: "must", d: "React dominates Indian hiring by a wide margin. Learn its model — reconciliation, hooks, state — not just its API.", track: "react" },
          { n: "TypeScript", lvl: "must", d: "Effectively standard now. Most serious postings assume it.", track: "ts" },
          { n: "State management", lvl: "must", d: "Server state versus client state; React Query, Zustand, Redux. Knowing which problem you have is the skill." },
          { n: "A meta-framework", lvl: "should", d: "Next.js above all. Routing, rendering strategies, server components.", track: "nextjs" },
          { n: "Performance", lvl: "must", d: "Core Web Vitals, bundle analysis, lazy loading, memoisation, image strategy. Directly tied to revenue and therefore to your value." },
          { n: "Accessibility", lvl: "must", d: "Semantic markup, ARIA, keyboard navigation, contrast. A legal requirement in many markets and a rare differentiator in India.", term: "WCAG" },
          { n: "Testing", lvl: "should", d: "Vitest/Jest, Testing Library, Playwright. Testing behaviour, not implementation.", track: "testing" },
          { n: "Build tooling", lvl: "should", d: "Vite, bundling, code splitting, environment configuration." },
          { n: "Design systems", lvl: "should", d: "Tokens, component APIs, theming, documentation. The path to senior frontend work." },
          { n: "Animation and interaction", lvl: "edge", d: "Motion that communicates rather than decorates. A genuine differentiator in product companies." }
        ]
      }
    ],

    stack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite", "React Query", "Zustand / Redux", "Playwright", "Storybook", "Figma", "Vercel"],

    edge: [
      { t: "Be the performance person", d: "Most frontend engineers cannot systematically diagnose a slow page. Learn to read a flame chart and a waterfall, and you can walk into any team and produce a measurable win in your first fortnight." },
      { t: "Take accessibility seriously", d: "Very few Indian engineers have real accessibility skill, and global product companies and GCCs increasingly require it. It is a small, learnable body of knowledge with outsized hiring value." },
      { t: "Develop actual design taste", d: "An engineer who can tell that spacing is wrong and fix it without a designer is worth substantially more than one who implements a mockup literally. Taste is learnable — study interfaces deliberately." },
      { t: "Own the component library", d: "Building the design system that other engineers consume is the most leveraged work in frontend, and it is how you become senior faster than by shipping features." },
      { t: "Learn enough backend to be dangerous", d: "Frontend engineers who can build their own API stop being blocked, and become the people who can carry a feature end to end alone." }
    ],

    ladder: [
      { t: "Frontend Engineer I", y: "0–2 yrs", pay: "₹4–20 LPA", d: "You build components and pages to a given design." },
      { t: "Frontend Engineer II", y: "2–4 yrs", pay: "₹12–35 LPA", d: "You own a surface, including its performance and accessibility." },
      { t: "Senior Frontend Engineer", y: "4–8 yrs", pay: "₹28–65 LPA", d: "Architecture, design systems, mentoring, technical direction for the client." },
      { t: "Staff / Principal", y: "8+ yrs", pay: "₹55–140 LPA", d: "Frontend platform and standards across many teams." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 3.5, mid: 8, hi: 20, note: "The widest possible spread. Services ₹3.5–6; agencies ₹5–9; Indian product ₹12–20; global product ₹20–35. A strong portfolio of live sites moves you between these tiers far more than a degree does." },
        { k: "Early", y: "1–3 yrs", lo: 8, mid: 16, hi: 32, note: "TypeScript and React depth is the standard step up." },
        { k: "Mid", y: "3–6 yrs", lo: 16, mid: 30, hi: 58, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 28, mid: 55, hi: 105, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 50, mid: 95, hi: 190, note: "" }
      ],
      notes: [
        "Roughly 10–15% below backend at entry level in India; the gap narrows considerably at senior levels and disappears for engineers with design-system or performance specialisation.",
        "Frontend has the largest freelance and contract market of any role here, which is a genuine option while job hunting."
      ]
    },

    cos: [
      { tier: "Product companies", pay: "₹12–30 LPA at entry", d: "Real design partnership and scale.", names: ["Flipkart", "Swiggy", "Zomato", "CRED", "Razorpay", "Postman", "Zoho", "Freshworks", "Atlassian", "Adobe", "Microsoft"] },
      { tier: "Design-led startups", pay: "₹8–24 LPA at entry", d: "Where craft is genuinely valued and you will grow fastest.", names: ["CRED", "Postman", "Notion", "Linear", "Figma", "Razorpay", "Jupiter", "Zepto"] },
      { tier: "GCCs", pay: "₹8–20 LPA at entry", d: "Large-scale enterprise interfaces, strong accessibility standards.", names: ["Walmart Global Tech", "Target", "American Express", "Optum", "Wells Fargo", "SAP", "Salesforce"] },
      { tier: "Services and agencies", pay: "₹3–10 LPA at entry", d: "Highest fresher volume; broad exposure across many projects.", names: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Thoughtworks", "Publicis Sapient"] }
    ],

    hire: [
      { t: "Portfolio screen", d: "They open your live sites. This round is decided before any conversation.", tip: "Three deployed, polished, fast projects. Not fifteen half-finished ones." },
      { t: "JavaScript fundamentals", d: "Closures, event loop, `this`, promises, debounce, deep clone.", tip: "Implement debounce, throttle and a promise from scratch. All three are asked constantly." },
      { t: "React round", d: "Hooks, re-render behaviour, keys, effects, performance.", tip: "Be able to explain exactly why a component re-rendered. It is the most common React question at every level." },
      { t: "Machine coding", d: "Build a working component in 60–90 minutes — autocomplete, infinite scroll, a carousel.", tip: "This is the decisive round at Indian product companies. Practise building small components under a timer until it is muscle memory." },
      { t: "CSS and layout", d: "Centring, responsive layout, specificity, flexbox versus grid.", tip: "Do not skip CSS preparation because it feels beneath you — candidates fail here regularly." },
      { t: "System design (frontend)", d: "'Design a feed.' Rendering strategy, caching, state, pagination, offline.", tip: "Talk about loading and error states unprompted; most candidates only design the happy path." }
    ],

    proof: [
      { t: "One genuinely polished product", d: "Not a to-do list. Something with real state, real data, authentication, error handling and edge cases — deployed and fast.", why: "Depth reads as competence. A single excellent project outperforms a portfolio of tutorials." },
      { t: "A component library", d: "Ten well-built accessible components with Storybook documentation and a published package.", why: "Signals design-system thinking, which is senior-level thinking." },
      { t: "A performance case study", d: "Take a slow public site or your own, measure, optimise, publish the before and after Lighthouse numbers.", why: "Extremely rare in a fresher portfolio and directly commercially relevant." },
      { t: "A clone with the hard parts included", d: "Not the UI — the parts nobody clones: optimistic updates, virtualised lists, offline support, real-time sync.", why: "Anyone can copy a layout. Copying the engineering is the signal." }
    ],

    plan: [
      { n: "HTML", d: "Semantics and structure first. It is short and it matters.", track: "html", mo: "Month 1" },
      { n: "CSS", d: "Layout, responsive design, the cascade. Give this real time.", track: "css", mo: "Months 1–2" },
      { n: "JavaScript, deeply", d: "The single highest-return investment in this path.", track: "js", mo: "Months 2–5" },
      { n: "Git", d: "From week three, as always.", track: "git", mo: "Month 2" },
      { n: "React", d: "Learn the model, not only the syntax.", track: "react", mo: "Months 5–7" },
      { n: "TypeScript", d: "Effectively mandatory in current hiring.", track: "ts", mo: "Months 7–8" },
      { n: "Next.js and rendering strategies", d: "Where modern React hiring has moved.", track: "nextjs", mo: "Months 8–9" },
      { n: "Testing and performance", d: "The two things that separate juniors from mid-level engineers.", track: "testing", mo: "Months 9–11" },
      { n: "DSA for interviews", d: "Lighter than backend requires, but not zero. Parallel from month five.", track: "dsa", mo: "Months 5–11, parallel" },
      { n: "Portfolio and applications", d: "Three deployed products, then apply.", track: "hunt", mo: "Months 10–13" }
    ],

    myths: [
      { m: "Frontend is the easy one.", r: "It is the easy one to *start*. It is not the easy one to master — state, performance, accessibility and cross-browser behaviour are genuinely hard, and the ceiling is much higher than beginners assume." },
      { m: "I need to learn React, Vue, Angular and Svelte.", r: "Learn one properly. They share a model; the second takes a week once the first is deep. A resume listing four frameworks reads as knowing none." },
      { m: "AI website builders make this obsolete.", r: "They generate plausible interfaces quickly and cannot make architectural decisions, debug a Safari-specific rendering bug or own accessibility compliance. The trivial work compresses; the engineering does not." }
    ],

    next: ["fullstack-engineer", "mobile-engineer", "backend-engineer"],
    r: ["DOM", "JavaScript", "React", "TypeScript", "CSS Grid", "Web Accessibility", "Virtual DOM", "Event Loop"]
  },

  /* ==================================================================== */
  {
    id: "backend-engineer",
    t: "Backend Engineer",
    a: "Server-side Engineer · API Engineer",
    icon: "server",
    tag: "Largest job market",
    demand: "strong",
    deck: "You build the systems behind the interface — APIs, databases, business logic, and everything that has to stay correct when a million people use it at once.",

    what: [
      "The largest and most durable engineering job market in India. Every company with software needs backend engineers, and that has been true for thirty years and will remain true.",
      "The work is data modelling, API design, correctness under concurrency, performance, and the accumulated judgement about what breaks at scale. It is less immediately visible than frontend and considerably more consequential when wrong — a rendering bug is embarrassing, a transaction bug is a lawsuit.",
      "For anyone targeting AI engineering, this is worth understanding clearly: **most of an AI engineer's job is backend engineering**. Strong backend skills are the difference between an AI engineer who can ship and one who needs someone else to.",
      "It also has the clearest interview process, the most abundant preparation material, and the most predictable career ladder of any role on this page. If you want the highest probability of employment from a standing start, this and data engineering are the two answers."
    ],

    day: [
      { t: "9:30", d: "An alert: p99 latency on the orders API tripled overnight. It is a missing index on a table that grew past the point where the query planner changed its mind." },
      { t: "11:00", d: "Design review for a new service. Most of the discussion is about failure — what happens when the payment provider times out after taking the money." },
      { t: "14:00", d: "Implementation. Idempotency keys, retries with backoff, a state machine for the order lifecycle." },
      { t: "16:00", d: "Write tests for the concurrent case. Two requests arriving simultaneously is where the real bugs live." }
    ],

    fit: {
      love: [
        "You like correctness and enjoy reasoning about edge cases.",
        "Systems, data and scale interest you more than pixels.",
        "You are comfortable with problems whose consequences are financial.",
        "You want the broadest possible job market."
      ],
      avoid: [
        "You need to see your work visually.",
        "You dislike on-call and production responsibility.",
        "Careful, slow reasoning frustrates you."
      ]
    },

    skills: [
      {
        g: "Foundation",
        items: [
          { n: "One language, deeply", lvl: "must", d: "Java and Python dominate Indian hiring; Node.js and Go are strong and growing. Choose by your target companies and then go deep.", track: "python" },
          { n: "Data structures and algorithms", lvl: "must", d: "The interview gate at essentially every product company. Also genuinely useful, contrary to popular complaint.", track: "dsa" },
          { n: "Databases", lvl: "must", d: "SQL, schema design, indexing, transactions, isolation levels, query plans. The most under-invested skill among junior backend engineers.", track: "sql" },
          { n: "HTTP and API design", lvl: "must", d: "REST properly, status codes, idempotency, versioning, pagination, authentication.", term: "REST" },
          { n: "Git and Linux", lvl: "must", d: "Daily tools.", track: "git" },
          { n: "Operating system basics", lvl: "should", d: "Processes, threads, memory, file descriptors. Needed to debug the strange production problems.", track: "os" }
        ]
      },
      {
        g: "Building real systems",
        items: [
          { n: "Concurrency", lvl: "must", d: "Race conditions, locks, transactions, async patterns. Where the expensive bugs come from.", term: "Race Condition" },
          { n: "Caching", lvl: "must", d: "Redis, invalidation strategy, cache stampedes. The most common and most misused performance tool.", term: "Cache" },
          { n: "Message queues", lvl: "should", d: "Kafka, RabbitMQ, SQS. Decoupling, retries, dead letters, exactly-once semantics and why it is largely a myth.", track: "kafka" },
          { n: "System design", lvl: "must", d: "Load balancing, replication, sharding, consistency trade-offs, failure modes. The senior interview and the senior job.", track: "sysdesign" },
          { n: "Testing", lvl: "must", d: "Unit, integration, contract. Backend without tests is a liability.", track: "testing" },
          { n: "Docker and deployment", lvl: "should", d: "Containerise, deploy, roll back.", track: "docker" },
          { n: "Observability", lvl: "should", d: "Structured logs, metrics, traces. You will debug production through these.", track: "observability" },
          { n: "Security", lvl: "must", d: "Authentication, authorisation, injection, secrets, the OWASP basics. Non-negotiable.", track: "appsec" }
        ]
      }
    ],

    stack: ["Java + Spring Boot", "Python + FastAPI/Django", "Node.js", "Go", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "AWS", "gRPC", "Elasticsearch"],

    edge: [
      { t: "Get genuinely good at databases", d: "Most backend engineers are mediocre at SQL and worse at indexing. Being the person who can read a query plan and fix a production slowdown in twenty minutes gives you standing everywhere you go." },
      { t: "Design for failure by instinct", d: "Junior engineers design the happy path. Senior engineers start from 'what happens when this times out halfway through' — and are recognisable in interviews within five minutes because of it." },
      { t: "Learn one domain's rules properly", d: "Payments, healthcare, logistics. Domain rules are where real backend complexity lives and where domain-experienced engineers command premiums." },
      { t: "Write the design doc", d: "The engineer who writes the clear document that aligns five people has more influence than the one who writes the most code. This is how you move from senior to staff." },
      { t: "Add AI competence to strong backend", d: "This is currently the most valuable pairing in the market. A backend engineer who can build reliable AI features is exactly what the applied AI job market is short of." }
    ],

    ladder: [
      { t: "Backend Engineer I / SDE-1", y: "0–2 yrs", pay: "₹4–24 LPA", d: "You implement well-scoped features against an existing design." },
      { t: "Backend Engineer II / SDE-2", y: "2–5 yrs", pay: "₹14–45 LPA", d: "You own services and design them. The most common level in the industry." },
      { t: "Senior / SDE-3", y: "5–8 yrs", pay: "₹30–80 LPA", d: "Architecture across services, mentoring, on-call leadership." },
      { t: "Staff / Principal", y: "8+ yrs", pay: "₹65–180 LPA", d: "Technical direction across teams; you prevent problems rather than fix them." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 4, mid: 10, hi: 24, note: "Services ₹3.5–7; GCC ₹10–20; Indian product ₹16–28; global product ₹25–50. This spread is why DSA preparation is worth the tedium — it is the mechanism that moves you between tiers." },
        { k: "Early", y: "1–3 yrs", lo: 10, mid: 20, hi: 40, note: "The first switch typically adds 60–100%." },
        { k: "Mid", y: "3–6 yrs", lo: 20, mid: 38, hi: 72, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 35, mid: 68, hi: 130, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 65, mid: 120, hi: 250, note: "" }
      ],
      notes: [
        "The most reliable pay ladder in Indian tech. Less volatile than AI, with a very similar ceiling at senior levels.",
        "Go and Rust experience carries a premium in infrastructure-heavy companies; Java remains the volume employer across BFSI and GCCs."
      ]
    },

    cos: [
      { tier: "Global product companies", pay: "₹25–50 LPA at entry", d: "Hardest interviews, strongest engineering culture, best compensation.", names: ["Google", "Microsoft", "Amazon", "Uber", "Atlassian", "Salesforce", "Adobe", "Stripe", "Databricks", "Netflix"] },
      { tier: "Indian product and unicorns", pay: "₹14–30 LPA at entry", d: "Real scale, strong ownership, faster growth than anywhere else.", names: ["Flipkart", "Swiggy", "Zomato", "Razorpay", "PhonePe", "CRED", "Meesho", "Zepto", "Groww", "Postman", "Zoho", "Freshworks"] },
      { tier: "GCCs", pay: "₹10–24 LPA at entry", d: "The volume employer for good engineers who want balance. Frequently underrated.", names: ["Walmart Global Tech", "Target", "JPMorgan Chase", "Goldman Sachs", "Wells Fargo", "American Express", "Optum", "SAP", "Visa", "Shell"] },
      { tier: "IT services", pay: "₹3.5–9 LPA at entry", d: "By far the largest fresher intake in the country. A legitimate first door — use it as a corridor, not a destination.", names: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "HCLTech", "Capgemini", "LTIMindtree", "Tech Mahindra"] }
    ],

    hire: [
      { t: "Online assessment", d: "Two or three DSA problems, timed.", tip: "This is a pure filter. Roughly 200–300 well-chosen problems clears almost every one of them." },
      { t: "DSA rounds", d: "One to three live coding interviews.", tip: "Speak while you solve. Communication is graded alongside the solution, and silent correct answers score worse than narrated ones." },
      { t: "Low-level design", d: "Design classes for a parking lot, a lift, a rate limiter.", tip: "Know SOLID and the common patterns well enough to apply, not recite." },
      { t: "High-level system design", d: "From SDE-2 upward. Design a URL shortener, a feed, a payment system.", tip: "Always start with requirements and scale estimates. Jumping to a diagram is the classic failure." },
      { t: "Hiring manager round", d: "Ownership, conflict, incidents, judgement.", tip: "Prepare three specific stories: something you shipped, something you broke, something you disagreed about." }
    ],

    proof: [
      { t: "A real API with real concerns", d: "Authentication, rate limiting, pagination, validation, error handling, tests, documentation — deployed with a public URL.", why: "It demonstrates the actual daily job rather than a tutorial's happy path." },
      { t: "Something that handles concurrency correctly", d: "A booking system, an inventory service, a wallet. Prove correctness under simultaneous requests.", why: "Concurrency is where junior engineers are weakest and where interviews probe hardest." },
      { t: "A system with a load test", d: "Benchmark it, find the bottleneck, fix it, publish the numbers.", why: "Almost no fresher does this, and it maps exactly onto senior thinking." },
      { t: "A written system design", d: "Design a real system on paper — requirements, estimates, schema, APIs, failure handling.", why: "Practises the round that determines your level for the rest of your career." }
    ],

    plan: [
      { n: "Programming basics", d: "Concepts before syntax if you are starting from zero.", track: "basics", mo: "Months 1–2" },
      { n: "One language, deeply", d: "Python or Java. Depth beats breadth decisively here.", track: "python", mo: "Months 2–5" },
      { n: "Git", d: "From week three.", track: "git", mo: "Month 2" },
      { n: "SQL and databases", d: "Schema design and indexing, not just queries.", track: "sql", mo: "Months 4–6" },
      { n: "Data structures and algorithms", d: "The interview gate. Start early and keep it running.", track: "dsa", mo: "Months 3–10, parallel" },
      { n: "Backend framework and APIs", d: "FastAPI, Django or Spring Boot. Build real services.", track: "backend", mo: "Months 6–8" },
      { n: "Operating systems and networking", d: "Enough to debug production and pass interviews.", track: "os", mo: "Months 7–9" },
      { n: "System design", d: "Start reading it early even though you will only be tested later.", track: "sysdesign", mo: "Months 9–12" },
      { n: "Docker and deployment", d: "Ship it somewhere real.", track: "docker", mo: "Month 10" },
      { n: "Portfolio and applications", d: "Two serious backend systems, deployed and documented.", track: "hunt", mo: "Months 11–14" }
    ],

    myths: [
      { m: "DSA is useless for the actual job.", r: "Partly true and entirely irrelevant. It is the gate, it is learnable, and refusing to prepare it on principle costs you tier-one access. Treat it as an entrance exam and stop arguing with it." },
      { m: "I should learn microservices from the start.", r: "Build one good monolith first. Distributed systems solve problems you do not have yet and create several you are not equipped to debug." },
      { m: "Backend is boring compared to AI.", r: "Backend is what makes AI usable. It is also the largest, steadiest and most transferable job market in the industry, and it is the most common route *into* AI teams." }
    ],

    next: ["fullstack-engineer", "ai-engineer", "devops-engineer", "data-engineer"],
    r: ["REST", "Idempotency", "ACID", "Database Index", "Cache", "Load Balancer", "Race Condition", "Message Queue"]
  },

  /* ==================================================================== */
  {
    id: "fullstack-engineer",
    t: "Full-Stack Engineer",
    a: "Product Engineer · Software Development Engineer",
    icon: "layers",
    tag: "Best for startups",
    demand: "strong",
    deck: "You own a feature from the database to the button — which makes you extraordinarily useful in a small company and requires you to be honest about depth.",

    what: [
      "A full-stack engineer takes a problem and returns a working feature, without handoffs. In a startup that is the most valuable shape a person can have, because the cost of coordination between specialists is larger than most people realise.",
      "The trap is real and worth naming: 'full-stack' can mean 'shallow everywhere'. The engineers who do well are T-shaped — genuinely deep in one half, competent across the other. Aim for that explicitly rather than drifting into uniform mediocrity.",
      "It is the best first role for learning quickly, because you see the whole system and develop judgement about where problems actually originate. It is a weaker choice if you want to work at the largest companies, which tend to hire and promote specialists.",
      "In India this is the dominant startup title, and increasingly the dominant product-company one under the name 'product engineer'."
    ],

    day: [
      { t: "9:30", d: "Ship yesterday's feature. Migration, deploy, watch the logs, verify." },
      { t: "11:00", d: "New feature kickoff. You design the schema, the API and the interface — in that order, which is the right order." },
      { t: "14:00", d: "Backend work. Endpoints, validation, tests." },
      { t: "16:00", d: "Frontend work for the same feature. Because you designed the API, it fits — the single biggest practical advantage of owning both halves." }
    ],

    fit: {
      love: [
        "You want to build whole things rather than parts of things.",
        "You like variety and get restless doing one layer forever.",
        "Startups appeal to you more than large organisations.",
        "You enjoy shipping more than perfecting."
      ],
      avoid: [
        "You want to go deep on one hard problem for years.",
        "You are aiming for a large product company's specialist ladder.",
        "Context switching drains you."
      ]
    },

    skills: [
      {
        g: "Both halves",
        note: "Cover this, then pick one side to go genuinely deep on. The depth is what stops you plateauing.",
        items: [
          { n: "JavaScript / TypeScript", lvl: "must", d: "The common language across both halves and the reason the JS stack dominates this role.", track: "js" },
          { n: "React", lvl: "must", d: "The client half.", track: "react" },
          { n: "Node.js or Python backend", lvl: "must", d: "Express, NestJS, FastAPI or Django.", track: "backend" },
          { n: "Databases", lvl: "must", d: "PostgreSQL, schema design, indexing, migrations, an ORM and its limits.", track: "sql" },
          { n: "API design", lvl: "must", d: "REST, authentication, validation, error contracts.", term: "REST" },
          { n: "Deployment", lvl: "must", d: "Docker, one cloud, CI/CD, environment configuration. In a startup this is also your job.", track: "docker" },
          { n: "Git", lvl: "must", d: "", track: "git" },
          { n: "Testing", lvl: "should", d: "Enough to move fast without breaking things repeatedly.", track: "testing" },
          { n: "Product judgement", lvl: "should", d: "Scoping, cutting, knowing what can ship on Thursday. The skill that makes you valuable beyond your code." }
        ]
      }
    ],

    stack: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker", "AWS / Vercel", "Redis", "tRPC"],

    edge: [
      { t: "Be deep on one side, not level across both", d: "The full-stack engineer who is genuinely excellent at backend and competent at frontend has a career. The one who is average at both has a ceiling around year four. Choose your deep side deliberately, early." },
      { t: "Own delivery, not tickets", d: "The value of this shape is that no coordination is required. Lean into it: take a problem, return a shipped feature, report the outcome not the effort." },
      { t: "Learn to scope ruthlessly", d: "In a startup the highest-value skill is knowing which 60% of a feature delivers 95% of the value. Engineers who can do this get given the important work." },
      { t: "Add AI features to your range", d: "Full-stack plus applied AI is currently the most hireable profile at Indian startups by a clear margin — you can build the entire feature, model included." }
    ],

    ladder: [
      { t: "Full-Stack Engineer I", y: "0–2 yrs", pay: "₹4–22 LPA", d: "You build features with guidance." },
      { t: "Full-Stack Engineer II", y: "2–5 yrs", pay: "₹14–40 LPA", d: "You own features end to end and make architecture decisions." },
      { t: "Senior / Lead", y: "5–8 yrs", pay: "₹30–70 LPA", d: "You own a product area and often a small team." },
      { t: "Principal / Founding Engineer", y: "8+ yrs", pay: "₹55–150 LPA + equity", d: "Technical direction; in startups this shades into a founding role." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 4, mid: 9, hi: 22, note: "Startups ₹6–18; product companies ₹14–24; services ₹3.5–7. A portfolio of complete shipped products matters more here than in any other role." },
        { k: "Early", y: "1–3 yrs", lo: 9, mid: 18, hi: 36, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 18, mid: 34, hi: 65, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 30, mid: 60, hi: 115, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 55, mid: 100, hi: 200, note: "Founding-engineer equity can dominate cash at this level — evaluate it sceptically." }
      ],
      notes: [
        "Slightly below specialists at large companies, often above them at startups where breadth is scarce.",
        "The strongest freelance and contract market after frontend, and the best profile for building your own product."
      ]
    },

    cos: [
      { tier: "Startups (seed to Series C)", pay: "₹6–24 LPA + equity", d: "The natural home of this role. Maximum ownership, maximum learning rate, real risk.", names: ["Any funded early-stage company", "YC-backed Indian startups", "Accel / Sequoia portfolio companies"] },
      { tier: "Product companies", pay: "₹14–28 LPA at entry", d: "Often titled 'product engineer'. Feature ownership across the stack.", names: ["Razorpay", "Postman", "CRED", "Zoho", "Freshworks", "Atlassian", "Zeta", "Chargebee", "Hasura"] },
      { tier: "Agencies and consultancies", pay: "₹5–14 LPA at entry", d: "Many projects, fast exposure, variable depth.", names: ["Thoughtworks", "Publicis Sapient", "Josh Software", "Talentica", "Innovaccer"] }
    ],

    hire: [
      { t: "Portfolio and build round", d: "Startups care most about what you have actually shipped.", tip: "A live product with real users beats every other credential in this role's hiring." },
      { t: "Machine coding", d: "Build a small full feature in two to three hours.", tip: "Working and complete beats elegant and half-finished. Ship the whole thing." },
      { t: "Full-stack design", d: "'Design a booking feature.' Schema, API, interface, edge cases.", tip: "Start with the data model. It disciplines everything downstream and interviewers notice." },
      { t: "DSA", d: "Lighter at startups, standard at product companies.", tip: "Do not skip it entirely; the product companies still gate on it." }
    ],

    proof: [
      { t: "A product with actual users", d: "Anything real — a tool for your college, a niche SaaS, a community app. Even fifty users counts.", why: "'People use it' is the most powerful sentence available to a fresher, and almost nobody can say it." },
      { t: "A complete SaaS build", d: "Authentication, payments, roles, admin, email, deployment. All the unglamorous parts.", why: "The unglamorous parts are the job; showing them proves you have done it rather than started it." },
      { t: "One AI-powered feature, shipped", d: "Add something genuinely useful using an LLM to an app you built.", why: "Currently the highest-signal addition to a full-stack portfolio in the Indian startup market." }
    ],

    plan: [
      { n: "HTML and CSS", d: "The visible half's foundation.", track: "html", mo: "Month 1" },
      { n: "JavaScript, deeply", d: "The language of both halves.", track: "js", mo: "Months 2–4" },
      { n: "Git", d: "", track: "git", mo: "Month 2" },
      { n: "React", d: "The client.", track: "react", mo: "Months 4–6" },
      { n: "Node or Python backend", d: "The server.", track: "backend", mo: "Months 6–8" },
      { n: "Databases and SQL", d: "Schema design is the skill that holds it all together.", track: "sql", mo: "Months 7–8" },
      { n: "TypeScript", d: "Across both halves.", track: "ts", mo: "Month 9" },
      { n: "Deployment and DevOps basics", d: "In a startup, shipping is also your job.", track: "docker", mo: "Month 10" },
      { n: "Build and launch something real", d: "Get actual users. This is the whole strategy for this role.", track: "hunt", mo: "Months 10–14" }
    ],

    myths: [
      { m: "Full-stack means knowing everything.", r: "It means being able to deliver a whole feature. Nobody is deep everywhere; the good ones are deep somewhere and competent adjacent." },
      { m: "Big companies will not hire full-stack engineers.", r: "They will — usually under a specialist title. Your breadth is fine; be ready to demonstrate depth in whichever half you apply for." }
    ],

    next: ["frontend-engineer", "backend-engineer", "ai-engineer", "mobile-engineer"],
    r: ["REST", "React", "PostgreSQL", "Authentication", "ORM", "CI/CD"]
  },

  /* ==================================================================== */
  {
    id: "mobile-engineer",
    t: "Mobile Engineer",
    a: "Android Developer · iOS Developer · React Native Developer",
    icon: "browser",
    tag: "India is mobile-first",
    demand: "steady",
    deck: "You build the apps people use on the device in their pocket — under real constraints of battery, network, memory and an app store that must approve you.",

    what: [
      "India is a mobile-first country by an enormous margin, which makes this role structurally important here in a way it is not everywhere. Most Indian consumers experience a product exclusively through an app.",
      "The constraints are what make it distinctive: intermittent 3G, ₹8,000 devices with limited memory, aggressive battery management, and the fact that a bad release cannot be rolled back the way a website can.",
      "There are three paths. **Native Android** (Kotlin) has the largest Indian job market. **Native iOS** (Swift) is smaller domestically but pays better and has less competition. **Cross-platform** (React Native, Flutter) is dominant at startups and gives you both platforms at some cost in depth.",
      "Demand is steadier than it is explosive. It is a good, durable career with less hype-driven volatility than AI — and offline-first engineering skill is genuinely scarce and valuable in the Indian market."
    ],

    day: [
      { t: "9:30", d: "A crash report affecting 0.3% of users, all on Android 11 with one specific manufacturer's skin. Mobile debugging is frequently forensic." },
      { t: "11:00", d: "Build a screen. Most of the work is states: loading, empty, error, offline, partially cached." },
      { t: "14:00", d: "Optimise app startup time from 3.1s to 1.4s. Directly moves retention, and retention is what the business cares about." },
      { t: "16:00", d: "Prepare a release. Staged rollout, because you cannot hotfix a mobile release in ten minutes." }
    ],

    fit: {
      love: [
        "You like working within tight constraints.",
        "You care about polish and the feel of an interaction.",
        "Building something people carry with them appeals to you.",
        "You are patient with device fragmentation and store processes."
      ],
      avoid: [
        "You want to deploy fixes instantly — mobile release cycles are slow and unforgiving.",
        "Testing across many devices sounds tedious rather than interesting.",
        "You want the very largest job market — web is larger."
      ]
    },

    skills: [
      {
        g: "Pick a platform, then go deep",
        items: [
          { n: "Kotlin + Android", lvl: "must", d: "Jetpack Compose, coroutines, lifecycle, architecture components. The largest mobile market in India.", track: "kotlin" },
          { n: "Swift + iOS", lvl: "must", d: "SwiftUI, UIKit, concurrency. Smaller Indian market, better pay, less competition.", track: "swift" },
          { n: "React Native or Flutter", lvl: "must", d: "One codebase, both platforms. Dominant at Indian startups.", track: "reactnative" },
          { n: "Mobile architecture", lvl: "must", d: "MVVM, unidirectional data flow, dependency injection, navigation. Mobile codebases rot fast without it." }
        ]
      },
      {
        g: "What the platform demands",
        items: [
          { n: "Offline-first design", lvl: "must", d: "Local persistence, sync, conflict resolution. Disproportionately important in India, and a genuine differentiator." },
          { n: "Performance", lvl: "must", d: "Startup time, frame rate, memory, battery, app size. App size matters enormously on entry-level Indian devices." },
          { n: "State management", lvl: "must", d: "Across a lifecycle that can destroy and rebuild your screen at any moment." },
          { n: "Networking", lvl: "must", d: "REST, caching, retries, and behaving sensibly on a poor connection." },
          { n: "Testing", lvl: "should", d: "Unit and instrumentation tests. Higher stakes because rollback is slow.", track: "testing" },
          { n: "Release engineering", lvl: "should", d: "Store processes, staged rollouts, feature flags, crash monitoring.", track: "cicd" },
          { n: "Push, deep links and permissions", lvl: "should", d: "The platform integrations every real app needs." },
          { n: "On-device ML", lvl: "edge", d: "TensorFlow Lite, Core ML. Growing and still scarce." }
        ]
      }
    ],

    stack: ["Kotlin", "Jetpack Compose", "Swift", "SwiftUI", "React Native", "Flutter", "Room / Core Data", "Retrofit", "Firebase", "Fastlane", "Sentry"],

    edge: [
      { t: "Own offline-first", d: "Indian networks are unreliable and the apps that handle it gracefully win. Engineers who can design robust sync are scarce and immediately valuable here." },
      { t: "Obsess over app size and startup", d: "On a ₹7,000 Android phone, a 40MB app that opens in one second beats a 120MB app that opens in four — and this shows up directly in install and retention numbers that leadership watches." },
      { t: "Go native-deep even if you write cross-platform", d: "The cross-platform engineer who can drop into Kotlin or Swift when the abstraction leaks is worth twice one who cannot, because the abstraction always eventually leaks." },
      { t: "Learn the release process properly", d: "Staged rollouts, feature flags, crash triage. Owning safe releases makes you the person the team relies on at the riskiest moment." }
    ],

    ladder: [
      { t: "Mobile Engineer I", y: "0–2 yrs", pay: "₹4–20 LPA", d: "Screens and features to a given design." },
      { t: "Mobile Engineer II", y: "2–5 yrs", pay: "₹12–35 LPA", d: "You own a module and its performance." },
      { t: "Senior Mobile Engineer", y: "5–8 yrs", pay: "₹26–60 LPA", d: "App architecture, release strategy, mentoring." },
      { t: "Staff / Mobile Lead", y: "8+ yrs", pay: "₹50–120 LPA", d: "Platform direction across apps." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 3.5, mid: 8, hi: 20, note: "A published app on the Play Store is the single strongest fresher credential in this role. Actually shipping one puts you ahead of most applicants." },
        { k: "Early", y: "1–3 yrs", lo: 8, mid: 16, hi: 32, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 16, mid: 30, hi: 55, note: "iOS typically pays 10–20% above Android in India due to thinner supply." },
        { k: "Senior", y: "6–10 yrs", lo: 26, mid: 50, hi: 95, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 45, mid: 90, hi: 170, note: "" }
      ],
      notes: [
        "Roughly comparable to frontend pay. Smaller total market than web, and correspondingly less competition per role.",
        "A strong freelance market, particularly for Flutter and React Native."
      ]
    },

    cos: [
      { tier: "Consumer apps at scale", pay: "₹12–28 LPA at entry", d: "Tens of millions of users and genuinely hard performance constraints.", names: ["Flipkart", "Swiggy", "Zomato", "PhonePe", "Paytm", "Meesho", "Dream11", "CRED", "Zepto", "Groww", "ShareChat"] },
      { tier: "Global product companies", pay: "₹20–40 LPA at entry", d: "Highest engineering standards.", names: ["Google", "Microsoft", "Amazon", "Uber", "Adobe", "Samsung R&D", "Truecaller"] },
      { tier: "Startups", pay: "₹5–18 LPA at entry", d: "Usually cross-platform. Broad ownership.", names: ["Early-stage consumer startups", "D2C brands", "Fintech apps", "Healthtech apps"] }
    ],

    hire: [
      { t: "Portfolio", d: "A published app carries this round almost by itself.", tip: "Publish something to the Play Store. The barrier is low and the signal is disproportionate." },
      { t: "Platform fundamentals", d: "Lifecycle, memory, threading, the platform's own quirks.", tip: "Know why your app was killed in the background. It is asked constantly." },
      { t: "Coding round", d: "Language-specific plus some DSA.", tip: "Kotlin coroutines or Swift concurrency come up in nearly every loop." },
      { t: "App architecture", d: "'Design a feed app with offline support.'", tip: "Lead with the caching and sync strategy — that is the interesting part and most candidates leave it out." }
    ],

    proof: [
      { t: "A published app", d: "On the Play Store or App Store. Solve a real problem, however small.", why: "The single highest-signal artefact in mobile hiring, and entirely within your control." },
      { t: "An offline-first app", d: "Works fully without a network, syncs cleanly when it returns, resolves conflicts sensibly.", why: "Demonstrates the hardest and most India-relevant part of mobile engineering." },
      { t: "A performance write-up", d: "Cut startup time and app size measurably; publish the numbers.", why: "Speaks directly to the metrics mobile teams are judged on." }
    ],

    plan: [
      { n: "Programming basics", d: "Concepts first if you are new.", track: "basics", mo: "Months 1–2" },
      { n: "Kotlin or Swift or Dart", d: "Choose your platform and commit to it.", track: "kotlin", mo: "Months 2–4" },
      { n: "Git", d: "", track: "git", mo: "Month 2" },
      { n: "The platform SDK", d: "Compose or SwiftUI, lifecycle, navigation.", track: "android", mo: "Months 4–7" },
      { n: "Networking and persistence", d: "APIs, local storage, caching.", track: "mobile-data", mo: "Months 7–8" },
      { n: "Architecture", d: "MVVM and dependency injection — mobile code rots without it.", track: "mobile-arch", mo: "Months 8–9" },
      { n: "Publish an app", d: "The single most important step in this entire plan.", track: "hunt", mo: "Months 9–11" },
      { n: "DSA and applications", d: "Prepare the interview format, then apply.", track: "dsa", mo: "Months 10–13" }
    ],

    myths: [
      { m: "Mobile is dying because everything is moving to web.", r: "In India the opposite is true. Mobile is the primary and often the only surface for consumer products, and app engineering demand has been stable for a decade." },
      { m: "Cross-platform means I never need native knowledge.", r: "Until you need a native module, or debug a platform-specific crash, or optimise a bridge. Which is roughly monthly." }
    ],

    next: ["frontend-engineer", "fullstack-engineer", "backend-engineer"],
    r: ["REST", "Caching", "Offline First", "Push Notification", "MVVM"]
  }

]);
