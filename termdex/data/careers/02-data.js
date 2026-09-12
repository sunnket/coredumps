/* Career Roadmap — Data & Analytics roles.
   The shortest honest path from zero to employed in Indian tech. */

TD.addRoles("data", [

  /* ==================================================================== */
  {
    id: "data-analyst",
    t: "Data Analyst",
    a: "Business Analyst (Data) · Product Analyst",
    icon: "graph",
    tag: "Fastest way in",
    demand: "strong",
    deck: "You turn the company's data into answers people can act on — queries, dashboards, and the sentence at the end that says what to do about it.",

    what: [
      "If you want to be employed in tech within six to nine months of starting from zero, this is the honest answer. The entry bar is SQL, spreadsheets, one visualisation tool and clear thinking — not a computer science degree and not a year of algorithms.",
      "The work is genuinely useful. You define what the business measures, find out why a number moved, size opportunities, and build the reporting everyone else runs on. In a well-run company the analyst is one of the few people who actually knows what is happening.",
      "It is also the best-positioned launchpad in the industry. From analyst you can move to data scientist, analytics engineer, data engineer or product management — and internal moves are dramatically easier than external ones. A very large number of senior data and AI people in India started here.",
      "The honest downside: the ceiling is lower than the engineering roles if you stay put, and a lot of the work is repetitive reporting. The people who thrive treat the reporting as the price of admission and spend their spare capacity on questions nobody asked them."
    ],

    day: [
      { t: "9:30", d: "Refresh the weekly dashboards, notice that one metric looks wrong, and spend an hour proving it is a pipeline issue rather than a business event." },
      { t: "11:00", d: "An ad-hoc request: 'which cities are our best customers in?' Twenty minutes of SQL, forty minutes of deciding what 'best' should mean." },
      { t: "14:00", d: "Deep work on a real question — why repeat purchase fell in one segment. This is the part of the job worth having." },
      { t: "16:00", d: "Present the finding in four slides. The recommendation goes on slide one, not slide four." }
    ],

    fit: {
      love: [
        "You are curious and like finding out why.",
        "You enjoy explaining things simply.",
        "You want to be employed quickly without a long theoretical ramp.",
        "You are comfortable being helpful — a lot of this role is service to other teams."
      ],
      avoid: [
        "You want to build software; this is analysis, not engineering.",
        "Repetitive reporting will grind you down and you cannot see past it.",
        "You want the highest possible ceiling — engineering roles pay more at the top."
      ]
    },

    skills: [
      {
        g: "The core four",
        note: "Get these four to a genuinely good standard and you are employable. Everything else is upside.",
        items: [
          { n: "SQL", lvl: "must", d: "The whole job. Joins, aggregation, window functions, CTEs, date logic. Nothing else matters as much.", track: "sql" },
          { n: "Spreadsheets", lvl: "must", d: "Excel or Google Sheets, properly — pivot tables, lookups, cleaning. Unfashionable and used every single day." },
          { n: "One BI tool", lvl: "must", d: "Power BI, Tableau or Looker. Pick whichever your target companies list and learn it well rather than all three badly." },
          { n: "Communication", lvl: "must", d: "Answer-first writing, clean charts, and the confidence to state a conclusion. This is what separates ₹6 LPA from ₹18 LPA analysts." }
        ]
      },
      {
        g: "The multipliers",
        items: [
          { n: "Python for analysis", lvl: "should", d: "pandas for the work spreadsheets cannot do. Roughly doubles the roles open to you.", track: "python" },
          { n: "Statistics", lvl: "should", d: "Averages lie, samples mislead, correlation is not causation. Enough to avoid confidently wrong conclusions.", track: "math" },
          { n: "Business domain knowledge", lvl: "must", d: "Understanding the funnel, the unit economics, what the company actually sells. Analysts without this produce correct answers to useless questions." },
          { n: "Experimentation basics", lvl: "should", d: "How A/B tests work and what they can conclude.", term: "A/B Testing" },
          { n: "Git and dbt", lvl: "edge", d: "The first step toward the analytics engineer role and a higher salary band.", track: "git" }
        ]
      }
    ],

    stack: ["SQL", "Excel / Google Sheets", "Power BI / Tableau / Looker", "Python + pandas", "BigQuery / Snowflake / Redshift", "dbt", "Metabase", "Google Analytics", "Amplitude / Mixpanel"],

    edge: [
      { t: "Always answer the next question too", d: "They asked which cities perform best. Also tell them why, and what you would do. The analyst who does this gets promoted; the one who returns exactly what was asked stays a query service." },
      { t: "Automate your own reporting", d: "Every hour of recurring manual work you automate is an hour you can spend on questions that get you noticed. It also demonstrates the engineering instinct that unlocks the next role." },
      { t: "Learn the money", d: "Understand margins, CAC, LTV, retention. An analyst who speaks the language of the business gets into the rooms where decisions happen." },
      { t: "Build a definition, not a chart", d: "Owning the canonical definition of a core metric makes you structurally important to the company in a way that no dashboard does." }
    ],

    ladder: [
      { t: "Data Analyst", y: "0–2 yrs", pay: "₹4–14 LPA", d: "Reporting, ad-hoc queries, dashboards." },
      { t: "Senior Data Analyst", y: "2–4 yrs", pay: "₹10–26 LPA", d: "You own an area's measurement and get asked open questions." },
      { t: "Lead / Analytics Manager", y: "4–8 yrs", pay: "₹22–50 LPA", d: "You run a small team and set analytical standards." },
      { t: "Head of Analytics", y: "8+ yrs", pay: "₹45–110 LPA", d: "Function leadership; often the route into a broader data leadership role." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 3.5, mid: 7, hi: 16, note: "The widest accessibility of any role here. Services and small firms pay ₹3.5–6; product companies ₹10–16 for a strong SQL interview. The gap is almost entirely SQL depth and communication." },
        { k: "Early", y: "1–3 yrs", lo: 7, mid: 13, hi: 26, note: "Adding Python and statistics is the clearest single step up." },
        { k: "Mid", y: "3–6 yrs", lo: 13, mid: 24, hi: 45, note: "Most people move to data scientist or analytics engineer around here for the pay bump." },
        { k: "Senior", y: "6–10 yrs", lo: 22, mid: 42, hi: 80, note: "" },
        { k: "Lead+", y: "10+ yrs", lo: 40, mid: 75, hi: 140, note: "" }
      ],
      notes: [
        "Lower entry pay than engineering roles, and a far shorter runway to your first offer. For many people that trade is clearly worth making — a year of earning and learning inside the industry beats a year of studying outside it.",
        "The fastest realistic pay path: analyst for eighteen to twenty-four months, then move internally to data scientist or analytics engineer. That transition commonly adds 50–80%."
      ]
    },

    cos: [
      { tier: "Product companies", pay: "₹9–18 LPA at entry", d: "Real scale, real experimentation, and the best environment to grow out of the role.", names: ["Flipkart", "Swiggy", "Zomato", "Meesho", "Razorpay", "PhonePe", "CRED", "Zepto", "Groww", "Dream11"] },
      { tier: "GCCs", pay: "₹7–16 LPA at entry", d: "Very heavy fresher hiring, structured onboarding, good balance.", names: ["Walmart Global Tech", "Target", "Optum", "Wells Fargo", "American Express", "JPMorgan Chase", "Shell", "Accenture"] },
      { tier: "Consulting and analytics firms", pay: "₹4–12 LPA at entry", d: "The largest volume of entry-level analytics hiring in India, and a reliable first door.", names: ["Mu Sigma", "ZS Associates", "Fractal", "Tiger Analytics", "Tredence", "LatentView", "Deloitte", "EY", "KPMG", "Genpact"] },
      { tier: "Startups", pay: "₹5–14 LPA at entry", d: "Wide scope, less structure. You may be the entire data function, which is terrifying and educational.", names: ["Any Series A–C company", "D2C brands", "SaaS startups", "Fintechs"] }
    ],

    hire: [
      { t: "SQL test", d: "Almost always first, almost always decisive. Joins, aggregation, window functions, funnels.", tip: "Solve 100+ SQL problems until window functions are reflexive. This one skill determines most outcomes in this role's hiring." },
      { t: "Excel / case round", d: "Cleaning messy data, pivots, a small business calculation.", tip: "Do not dismiss Excel because it feels basic. Candidates fail here regularly." },
      { t: "Business case", d: "'Sales dropped 12% in Pune. Investigate.'", tip: "Say your structure out loud before you touch data — segment, time, instrumentation, external factors." },
      { t: "Dashboard / take-home", d: "Build something from a supplied dataset.", tip: "One clear insight beats twelve charts. Put your conclusion in the title of the dashboard." }
    ],

    proof: [
      { t: "Three SQL-heavy analyses on public data", d: "Indian datasets are ideal — census, elections, IPL, RBI, weather. Real questions with real answers.", why: "Directly mirrors the interview and the job." },
      { t: "One public dashboard", d: "Published on Tableau Public or Power BI, with a written explanation of the decisions it should drive.", why: "A live link is the fastest possible credibility with a recruiter." },
      { t: "An analysis for a real organisation", d: "A college society, a local business, an NGO. Unpaid is fine.", why: "'Real stakeholder, real data, real messiness' outranks any coursework." }
    ],

    plan: [
      { n: "SQL, thoroughly", d: "This is the job. Give it more time than feels necessary.", track: "sql", mo: "Months 1–2" },
      { n: "Spreadsheets", d: "Pivot tables, lookups, cleaning. Two weeks.", track: "excel", mo: "Month 2" },
      { n: "One BI tool", d: "Power BI or Tableau. Build five dashboards, not five tutorials.", track: "bi", mo: "Month 3" },
      { n: "Statistics basics", d: "Enough to not be confidently wrong.", track: "math", mo: "Months 3–4" },
      { n: "Python and pandas", d: "The step that widens your options considerably.", track: "python", mo: "Months 4–6" },
      { n: "Business fundamentals", d: "Unit economics, funnels, retention. Read your target industry.", track: "domain", mo: "Ongoing" },
      { n: "Portfolio and applications", d: "Three analyses, one dashboard, then apply broadly.", track: "hunt", mo: "Months 5–8" }
    ],

    myths: [
      { m: "Data analyst is a dead-end job.", r: "It is a dead end only if you stay in it doing exactly the same thing for five years. As a two-year entry point into data and AI careers it is the most reliable one available in India." },
      { m: "I need Python to get an analyst job.", r: "You need SQL. Python widens your options and raises pay, but a great many analysts are hired on SQL, Excel and clear thinking alone." },
      { m: "AI will delete this role.", r: "AI tools write queries well and cannot decide what to measure, cannot tell you the number is wrong because of a tracking bug, and cannot argue with a stakeholder. The mechanical part shrinks; the judgement part grows." }
    ],

    next: ["data-scientist", "analytics-engineer", "data-engineer", "ai-product-manager"],
    r: ["SQL", "Window Function", "Cohort Analysis", "Data Warehouse", "Business Intelligence", "OLAP"]
  },

  /* ==================================================================== */
  {
    id: "data-engineer",
    t: "Data Engineer",
    a: "Big Data Engineer · Data Platform Engineer",
    icon: "pipeline",
    tag: "Highest demand in data",
    demand: "hot",
    deck: "You build the pipelines and warehouses that everyone else's analysis, dashboards and models depend on — reliably, at scale, at three in the morning.",

    what: [
      "Every data scientist, analyst and ML engineer in a company is downstream of a data engineer. If the pipeline breaks, all of their work is wrong — and worse, silently wrong. That dependency is why the demand is consistently high and the pay is strong.",
      "The work is real software engineering applied to data: ingestion from dozens of sources, transformation, storage design, orchestration, quality checks, and the warehouse or lakehouse everything reads from.",
      "It is more stable and less fashion-driven than AI roles. Companies were hiring data engineers before the LLM wave, hired more during it, and will continue afterwards — because every AI system needs clean data more than it needs a better model.",
      "For someone from a non-elite college with strong engineering instincts, this is one of the highest-probability, highest-return roles on this page. It is under-glamorised and therefore under-competed."
    ],

    day: [
      { t: "9:00", d: "A pipeline failed overnight. The upstream vendor changed a column name without telling anyone. This is the archetypal data engineering morning." },
      { t: "10:30", d: "Backfill the affected days and add a schema check so the same failure becomes loud instead of silent next time." },
      { t: "13:00", d: "Build a new ingestion from a payments API — incremental loads, idempotency, retries, late-arriving data." },
      { t: "15:30", d: "Optimise a warehouse query that costs ₹40,000 a month. Partitioning and clustering take it to ₹6,000." },
      { t: "16:30", d: "Review a data model with analysts. Getting the model right saves everyone downstream a year of confusion." }
    ],

    fit: {
      love: [
        "You like building things that work reliably rather than things that are clever.",
        "You are systematic and enjoy tracing a problem to its source.",
        "Being the foundation others depend on appeals to you.",
        "You would rather solve a problem permanently than solve it quickly."
      ],
      avoid: [
        "You want to build models or analyse — you enable both, you do neither.",
        "You cannot tolerate on-call.",
        "You want visible product credit."
      ]
    },

    skills: [
      {
        g: "Foundation",
        items: [
          { n: "SQL, advanced", lvl: "must", d: "Beyond querying — query plans, partitioning, optimisation, cost. You will read execution plans routinely.", track: "sql" },
          { n: "Python", lvl: "must", d: "The lingua franca of pipelines. Clean, tested, production code.", track: "python" },
          { n: "Data modelling", lvl: "must", d: "Star schemas, normalisation, slowly changing dimensions, idempotency. The design skill that separates good data engineers from script writers.", term: "Star Schema" },
          { n: "Linux and Git", lvl: "must", d: "Everything runs on Linux and everything is versioned.", track: "git" },
          { n: "Distributed systems basics", lvl: "should", d: "Partitioning, shuffles, consistency, why your job is slow. Enough to reason about Spark rather than incant it." }
        ]
      },
      {
        g: "The stack",
        items: [
          { n: "One warehouse", lvl: "must", d: "Snowflake, BigQuery or Redshift. Storage, partitioning, cost model.", track: "warehouse" },
          { n: "Orchestration", lvl: "must", d: "Airflow above all, or Dagster/Prefect. DAGs, retries, backfills, dependencies.", track: "airflow" },
          { n: "Spark", lvl: "should", d: "For data too large for one machine. PySpark, partitioning, joins, skew.", track: "spark" },
          { n: "dbt", lvl: "should", d: "The industry default for transformation-as-code. Fast to learn, disproportionately valuable.", track: "dbt" },
          { n: "Streaming", lvl: "should", d: "Kafka and one processing framework. Increasingly expected rather than optional.", track: "kafka" },
          { n: "Cloud", lvl: "must", d: "AWS, GCP or Azure — storage, compute, IAM, managed data services.", track: "cloud" },
          { n: "Data quality and observability", lvl: "should", d: "Great Expectations, contracts, freshness and volume checks. The difference between trusted and distrusted data." },
          { n: "Docker and CI/CD", lvl: "should", d: "Pipelines are software and deserve the same discipline.", track: "docker" }
        ]
      }
    ],

    stack: ["SQL", "Python", "Airflow", "dbt", "Spark", "Kafka", "Snowflake / BigQuery", "AWS / GCP", "Docker", "Terraform", "Great Expectations", "Databricks"],

    edge: [
      { t: "Make failure loud", d: "The worst data problem is not a broken pipeline; it is one that keeps running and produces wrong numbers. Engineers who build detection for silent corruption become the person leadership trusts." },
      { t: "Know what your queries cost", d: "Warehouse bills are enormous and largely invisible. A data engineer who cuts spend by 60% while improving performance has produced a board-visible number." },
      { t: "Design the model, not just the pipeline", d: "Anyone can move bytes. Designing a data model that stays comprehensible after three years of business change is a genuinely senior skill and it pays like one." },
      { t: "Learn streaming properly", d: "Batch is commoditised; real-time is where the remaining scarcity and the premium sit." }
    ],

    ladder: [
      { t: "Data Engineer I", y: "0–2 yrs", pay: "₹5–20 LPA", d: "You build and maintain pipelines to a given design." },
      { t: "Data Engineer II", y: "2–4 yrs", pay: "₹14–38 LPA", d: "You own a domain's data and design its models." },
      { t: "Senior Data Engineer", y: "4–8 yrs", pay: "₹30–70 LPA", d: "Platform architecture, standards, mentoring." },
      { t: "Staff / Principal", y: "8+ yrs", pay: "₹60–150 LPA", d: "Data strategy and platform direction across the organisation." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 4.5, mid: 10, hi: 22, note: "Services ₹4–7; GCC ₹9–16; product ₹14–22. Airflow and Spark on a resume move a fresher noticeably up this band." },
        { k: "Early", y: "1–3 yrs", lo: 10, mid: 19, hi: 38, note: "Cloud plus Spark plus streaming is the combination that unlocks the top of this band." },
        { k: "Mid", y: "3–6 yrs", lo: 19, mid: 35, hi: 68, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 32, mid: 60, hi: 115, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 55, mid: 100, hi: 200, note: "" }
      ],
      notes: [
        "Demand has consistently outstripped supply in India for several years. Job security here is among the best in tech.",
        "Databricks, Snowflake and streaming experience each carry a measurable premium — often 15–25% each at the mid level."
      ]
    },

    cos: [
      { tier: "Product companies", pay: "₹14–28 LPA at entry", d: "Petabyte-scale problems and modern tooling.", names: ["Flipkart", "Swiggy", "Zomato", "Meesho", "PhonePe", "Razorpay", "Uber", "Amazon", "Microsoft", "Netflix"] },
      { tier: "GCCs and BFSI", pay: "₹9–22 LPA at entry", d: "Enormous data estates, strong governance, excellent stability.", names: ["Walmart Global Tech", "JPMorgan Chase", "Goldman Sachs", "Wells Fargo", "American Express", "HSBC", "Optum", "Target"] },
      { tier: "Data platform vendors", pay: "₹16–40 LPA at entry", d: "Building the tools the rest of the industry runs on.", names: ["Databricks", "Snowflake", "Confluent", "AWS", "Google Cloud", "Cloudera"] },
      { tier: "Services and consulting", pay: "₹3.5–10 LPA at entry", d: "High-volume fresher hiring, broad tool exposure, good stepping stone.", names: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "LTIMindtree", "Capgemini", "Tredence"] }
    ],

    hire: [
      { t: "SQL round", d: "Hard SQL — window functions, optimisation, deduplication, incremental logic.", tip: "Expect harder SQL than a data analyst interview, not easier." },
      { t: "Python / coding", d: "Data manipulation, file processing, sometimes DSA.", tip: "Write code that handles the malformed row. They are checking whether you think about bad data." },
      { t: "Pipeline design", d: "'Design ingestion for 500 GB of daily event data.'", tip: "Cover idempotency, late-arriving data, backfills and monitoring. Mentioning backfills unprompted is a strong senior signal." },
      { t: "Data modelling", d: "Design a warehouse schema for a given business.", tip: "Know star schema and slowly changing dimensions cold — they come up constantly." },
      { t: "Spark / big data", d: "Partitioning, shuffles, skew, why the job is slow.", tip: "Have a real story about optimising an actual job." }
    ],

    proof: [
      { t: "An end-to-end pipeline on real public data", d: "Ingest from an API daily, transform with dbt, load to a warehouse, orchestrate with Airflow, add quality checks and a dashboard on top.", why: "This single project covers most of the interview surface and proves you can build a system, not a script." },
      { t: "A streaming pipeline", d: "Kafka producing events, consumed and aggregated in near real time.", why: "Far fewer freshers have this, and it is exactly where demand is heading." },
      { t: "A cost or performance optimisation write-up", d: "Take a slow query or an expensive job and make it dramatically better. Show the before and after." }
    ],

    plan: [
      { n: "SQL, deeply", d: "Deeper than an analyst needs — including how the database executes it.", track: "sql", mo: "Months 1–3" },
      { n: "Python", d: "Production-quality, not notebook-quality.", track: "python", mo: "Months 2–4" },
      { n: "Git and Linux", d: "Non-negotiable engineering foundation.", track: "git", mo: "Month 2" },
      { n: "Data modelling and warehousing", d: "Star schemas, dimensions, warehouse design.", track: "warehouse", mo: "Months 4–5" },
      { n: "Airflow and orchestration", d: "Where pipelines become systems.", track: "airflow", mo: "Months 5–7" },
      { n: "One cloud", d: "AWS or GCP data services.", track: "cloud", mo: "Months 6–8" },
      { n: "Spark", d: "For when the data outgrows one machine.", track: "spark", mo: "Months 8–10" },
      { n: "Streaming with Kafka", d: "The premium skill in this role.", track: "kafka", mo: "Months 10–12" },
      { n: "Portfolio and applications", d: "One serious end-to-end pipeline, documented.", track: "hunt", mo: "Months 11–14" }
    ],

    myths: [
      { m: "Data engineering is just ETL scripts.", r: "It is distributed systems engineering with data as the payload — schema evolution, exactly-once semantics, backfills, cost, reliability. The scripting is the easy tenth." },
      { m: "It is less prestigious than data science, so it must pay less.", r: "In India it frequently pays more, particularly at the mid level, because demand exceeds supply more sharply." }
    ],

    next: ["analytics-engineer", "mlops-engineer", "backend-engineer", "data-scientist"],
    r: ["ETL", "Data Warehouse", "Apache Spark", "Kafka", "Star Schema", "Data Lake", "Idempotency", "Change Data Capture"]
  },

  /* ==================================================================== */
  {
    id: "analytics-engineer",
    t: "Analytics Engineer",
    a: "Data Modeller · dbt Developer",
    icon: "layers",
    tag: "The bridge role",
    demand: "strong",
    deck: "You sit between data engineering and analysis — turning raw tables into clean, tested, documented models that the whole company trusts.",

    what: [
      "A newer title that has settled quickly, because the gap it fills was real. Data engineers move raw data; analysts consume it; between the two sits a large and previously unowned space of transformation, definition and testing.",
      "The core of it is applying software engineering discipline to analytics: version control, tests, code review, documentation, CI. dbt made this practical and is effectively the defining tool of the role.",
      "It is an excellent target for an analyst who has discovered they enjoy the engineering side, and it pays meaningfully better than analysis while requiring less infrastructure work than data engineering.",
      "The deliverable is trust. When a company has one agreed definition of 'active customer' that is tested, documented and used everywhere, an analytics engineer built it."
    ],

    day: [
      { t: "9:30", d: "Review a colleague's dbt pull request. Their model double-counts refunds — caught in review rather than in a board deck, which is the entire point of the discipline." },
      { t: "11:00", d: "Rebuild the customer model. Three teams have three definitions; your job is to get them to one, which is a diplomatic problem wearing a technical costume." },
      { t: "14:00", d: "Add tests: uniqueness, referential integrity, freshness, accepted values. Unglamorous and the reason anyone believes the numbers." },
      { t: "16:00", d: "Write documentation that will let an analyst answer their own question next time instead of messaging you." }
    ],

    fit: {
      love: [
        "You like SQL and want to do it with real engineering rigour.",
        "Correctness and clarity matter to you, possibly excessively.",
        "You enjoy being the person who makes other people's work easier.",
        "You are good at getting disagreeing teams to one definition."
      ],
      avoid: [
        "You want to build infrastructure — that is data engineering.",
        "You want to answer business questions — that is analysis.",
        "You find documentation and testing tedious; here they are the product."
      ]
    },

    skills: [
      {
        g: "Core",
        items: [
          { n: "SQL, expert level", lvl: "must", d: "You write SQL all day and it must be maintainable by others. Modularity matters as much as correctness.", track: "sql" },
          { n: "dbt", lvl: "must", d: "Models, tests, macros, snapshots, documentation, lineage. The defining tool of the role.", track: "dbt" },
          { n: "Data modelling", lvl: "must", d: "Dimensional modelling, grain, slowly changing dimensions. Getting grain wrong is the most expensive mistake in this job.", term: "Star Schema" },
          { n: "Git and code review", lvl: "must", d: "Analytics code reviewed like software is the whole premise of the role.", track: "git" },
          { n: "One warehouse", lvl: "must", d: "Snowflake, BigQuery or Redshift, including its cost model.", track: "warehouse" }
        ]
      },
      {
        g: "Surrounding",
        items: [
          { n: "Testing and data quality", lvl: "must", d: "Assertions, freshness, anomaly detection, contracts with upstream teams." },
          { n: "BI tools", lvl: "should", d: "You build the layer they sit on; you must understand how they will be used." },
          { n: "Python", lvl: "should", d: "For the transformations SQL handles badly and for tooling.", track: "python" },
          { n: "CI/CD", lvl: "should", d: "Automated testing of models on every pull request.", track: "cicd" },
          { n: "Stakeholder facilitation", lvl: "must", d: "Getting three teams to agree one definition is the hardest part of the job and it is not technical." }
        ]
      }
    ],

    stack: ["dbt", "SQL", "Snowflake / BigQuery", "Git + GitHub", "Airflow", "Looker / Tableau", "Python", "Great Expectations", "Metabase"],

    edge: [
      { t: "Own the semantic layer", d: "Whoever defines the company's core metrics has quiet, durable influence over what the company optimises for. It is one of the most leveraged positions in a data organisation." },
      { t: "Make the warehouse cheap", d: "Poorly written models cost enormous amounts. Halving the bill while improving freshness is a visible, quantified win." },
      { t: "Write documentation people actually read", d: "Rare enough to be a differentiator on its own. It also reduces your interruption load, which compounds." },
      { t: "Bring engineering practice with you", d: "Analytics teams that adopt review, testing and CI outperform those that do not. Being the person who introduces that changes a whole team's output." }
    ],

    ladder: [
      { t: "Analytics Engineer", y: "1–3 yrs", pay: "₹8–24 LPA", d: "Usually entered from analyst or junior data engineer." },
      { t: "Senior Analytics Engineer", y: "3–6 yrs", pay: "₹20–45 LPA", d: "You own the core data models and the standards around them." },
      { t: "Lead / Staff", y: "6+ yrs", pay: "₹40–90 LPA", d: "Semantic layer architecture and team leadership." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 5, mid: 10, hi: 18, note: "Uncommon as a first title; most arrive from a year or two of analyst work. If you are targeting it from zero, apply to analyst roles with dbt on your resume." },
        { k: "Early", y: "1–3 yrs", lo: 10, mid: 18, hi: 32, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 18, mid: 32, hi: 58, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 30, mid: 55, hi: 100, note: "" }
      ],
      notes: [
        "Pays roughly 30–50% above a pure analyst role at the same experience level, for a skill delta of about three months of focused work. It is one of the best effort-to-return moves available in data.",
        "Concentrated in companies with a modern data stack — largely product companies and well-funded startups."
      ]
    },

    cos: [
      { tier: "Modern-stack product companies", pay: "₹12–26 LPA at entry", d: "Where dbt and cloud warehouses are already standard.", names: ["Razorpay", "CRED", "Meesho", "Groww", "Postman", "Zomato", "Swiggy", "Freshworks", "Zeta"] },
      { tier: "SaaS and data companies", pay: "₹14–30 LPA at entry", d: "Often the most mature analytics engineering practices.", names: ["dbt Labs", "Atlan", "Hevo Data", "Snowflake", "Databricks", "Chargebee"] },
      { tier: "GCCs", pay: "₹9–20 LPA at entry", d: "Increasingly adopting the modern data stack.", names: ["Walmart Global Tech", "Target", "Optum", "Wells Fargo"] }
    ],

    hire: [
      { t: "SQL round", d: "Complex, modular, maintainable SQL.", tip: "Write readable SQL with CTEs. Style is genuinely assessed in this role." },
      { t: "dbt round", d: "Project structure, tests, macros, incremental models.", tip: "Have a real dbt project on GitHub. It converts this round into a conversation." },
      { t: "Modelling exercise", d: "Design models for a given business scenario.", tip: "State the grain of every model out loud. It is the single most important design decision and interviewers listen for it." },
      { t: "Stakeholder scenario", d: "Two teams define a metric differently. What do you do?", tip: "The correct answer involves a conversation, not a technical fix." }
    ],

    proof: [
      { t: "A public dbt project", d: "Raw public data, staged and modelled into marts, with tests, docs and lineage.", why: "Directly demonstrates the entire job in one artefact." },
      { t: "A documented metric layer", d: "Define ten business metrics precisely, with edge cases handled explicitly.", why: "Shows the rigour of thought that the role is actually about." },
      { t: "A CI pipeline for analytics", d: "Automated dbt tests running on every pull request.", why: "Very few candidates show engineering practice applied to analytics." }
    ],

    plan: [
      { n: "SQL to a high level", d: "Beyond querying — into structure and maintainability.", track: "sql", mo: "Months 1–3" },
      { n: "Git and code review", d: "The practice that defines the role.", track: "git", mo: "Month 2" },
      { n: "Data modelling", d: "Dimensional modelling and grain.", track: "warehouse", mo: "Months 3–4" },
      { n: "dbt", d: "The core tool. A month of focused work gets you genuinely competent.", track: "dbt", mo: "Months 4–5" },
      { n: "One warehouse", d: "Snowflake or BigQuery, including cost.", track: "warehouse", mo: "Month 5" },
      { n: "Python basics", d: "For tooling and the awkward transformations.", track: "python", mo: "Months 6–7" },
      { n: "Portfolio and applications", d: "One public dbt project is worth more than any certification.", track: "hunt", mo: "Months 7–10" }
    ],

    myths: [
      { m: "It is just an analyst who knows dbt.", r: "The tool is the visible part. The role is dimensional modelling, testing discipline and metric governance — and getting an organisation to agree on definitions, which is genuinely difficult." },
      { m: "The role will disappear as tools improve.", r: "Tooling has improved continuously and the role has grown, because the hard part is organisational agreement, not transformation syntax." }
    ],

    next: ["data-engineer", "data-scientist", "data-analyst"],
    r: ["ETL", "Star Schema", "Data Warehouse", "Idempotency", "Data Lineage", "SQL"]
  }

]);
