/* Category definitions — order here drives the sidebar and home page. */
TD.defineCategories([
  { id: "crash-course", name: "Crash Course — Plain English", short: "Crash Course",
    icon: "bulb", col: "#fbbf24", colL: "#a2560a",
    desc: "The words everyone assumes you already know — reading code, the everyday tooling, how the web works, and AI engineering explained without jargon." },

  { id: "programming-languages", name: "Programming Languages", short: "Languages",
    icon: "code", col: "#818cf8", colL: "#4338ca",
    desc: "Every language an engineer bumps into — what it is, what it is good at, and when it is the wrong tool." },

  { id: "databases", name: "Databases & SQL", short: "Databases",
    icon: "database", col: "#38bdf8", colL: "#0369a1",
    desc: "SQL and its sub-languages, NoSQL families, indexes, transactions, modelling and the engines that store the world's data." },

  { id: "ai-ml-core", name: "Machine Learning Core", short: "ML Core",
    icon: "brain", col: "#34d399", colL: "#047857",
    desc: "The vocabulary of classical machine learning: learning paradigms, algorithms, metrics and the failure modes that bite everyone." },

  { id: "deep-learning", name: "Deep Learning", short: "Deep Learning",
    icon: "layers", col: "#f472b6", colL: "#be185d",
    desc: "Neural networks from the perceptron to the transformer — layers, training tricks, architectures and the maths that makes them learn." },

  { id: "genai-llm", name: "Generative AI & LLMs", short: "GenAI / LLM",
    icon: "sparkles", col: "#a78bfa", colL: "#6d28d9",
    desc: "Large language models, prompting, RAG, fine-tuning, agents, inference economics and everything the modern AI engineer ships." },

  { id: "nlp", name: "Natural Language Processing", short: "NLP",
    icon: "chat", col: "#2dd4bf", colL: "#0f766e",
    desc: "How machines turn text into meaning — tokenisation, embeddings, classic NLP tasks and the metrics used to score them." },

  { id: "computer-vision", name: "Computer Vision", short: "Vision",
    icon: "eye", col: "#fb923c", colL: "#c2410c",
    desc: "Teaching machines to see: convolutions, detection, segmentation, augmentation and the metrics vision teams live by." },

  { id: "data-engineering", name: "Data Engineering", short: "Data Eng",
    icon: "pipeline", col: "#facc15", colL: "#a16207",
    desc: "Pipelines, warehouses, lakes, streaming and file formats — the plumbing that gets data to the model and the dashboard." },

  { id: "mlops", name: "MLOps & Model Ops", short: "MLOps",
    icon: "gauge", col: "#4ade80", colL: "#15803d",
    desc: "Everything after the notebook: tracking, registries, serving, drift, monitoring and shipping models like real software." },

  { id: "math-stats", name: "Maths & Statistics", short: "Maths & Stats",
    icon: "sigma", col: "#c084fc", colL: "#7e22ce",
    desc: "Linear algebra, calculus, probability and statistics — the small set of ideas that every ML concept is built on." },

  { id: "cs-fundamentals", name: "CS Fundamentals", short: "CS Core",
    icon: "cpu", col: "#60a5fa", colL: "#1d4ed8",
    desc: "Data structures, algorithms, complexity, paradigms and concurrency — the part of the job that never goes out of date." },

  { id: "web-frontend", name: "Web & Frontend", short: "Frontend",
    icon: "browser", col: "#fb7185", colL: "#be123c",
    desc: "The browser platform and the frameworks on top of it — rendering models, state, performance, accessibility and styling." },

  { id: "backend-architecture", name: "Backend & Architecture", short: "Backend",
    icon: "server", col: "#22d3ee", colL: "#0e7490",
    desc: "APIs, services, messaging, caching and the architectural patterns that keep systems alive under load." },

  { id: "devops-cloud", name: "DevOps & Cloud", short: "DevOps",
    icon: "cloud", col: "#a3e635", colL: "#4d7c0f",
    desc: "Containers, orchestration, infrastructure as code, CI/CD, observability and the cloud primitives underneath them." },

  { id: "os-networking", name: "Operating Systems & Networking", short: "OS & Network",
    icon: "network", col: "#7dd3fc", colL: "#0284c7",
    desc: "Processes, memory, files, sockets, protocols and the layers a packet crosses before your request returns." },

  { id: "security", name: "Security", short: "Security",
    icon: "shield", col: "#f87171", colL: "#b91c1c",
    desc: "Cryptography, authentication, the classic web vulnerabilities and the defensive habits every engineer is expected to have." },

  { id: "software-engineering", name: "Software Engineering Practice", short: "Practice",
    icon: "gitbranch", col: "#94a3b8", colL: "#475569",
    desc: "Version control, testing, design patterns, principles, process and the craft habits that separate code from software." },

  { id: "emerging-tech", name: "Emerging & Adjacent Tech", short: "Emerging",
    icon: "atom", col: "#e879f9", colL: "#a21caf",
    desc: "Blockchain, edge, quantum, embedded, robotics, XR and the accelerator hardware that all of modern AI runs on." }
]);

/* Curated reading orders.

   A path is authored as *parts* — named chapters of a handful of terms
   each — rather than as one flat run of names. Thirty words in a column
   tells a reader the order and nothing else; the same thirty words under
   six headings tells them the shape of the subject, which is the thing
   they came to learn.

     id      route fragment and storage key
     name    what it is called
     cat     the category whose accent colour it borrows
     kind    start | core | role — drives the filter row on the index
     lvl     the badge: who it is pitched at
     icon    a glyph from icons.js
     desc    the one-line promise
     who     the reader it is written for, in their own words
     gain    what they can do at the bottom that they could not at the top
     course  the Learn Coding track that teaches the same ground in code,
             or a { soon: "Name" } marker when that course is not written yet
     parts   [{ n: chapter, d: why this chapter exists, s: [term names] }]

   Names inside `s` must match term titles exactly — core.js resolves them
   once at registration and reports any that miss.                        */
TD.definePaths([

  /* ================= start here ================= */
  {
    id: "first-words",
    name: "Your first 30 words",
    cat: "crash-course",
    kind: "start",
    lvl: "No experience needed",
    icon: "spark",
    desc: "If you are new, start here. Thirty words that unlock the rest of the dictionary, in the order they make sense.",
    who: "You have never written code, or you have tried and every tutorial assumed a vocabulary nobody gave you.",
    gain: "You can read a beginner tutorial without stopping at every third noun.",
    course: "basics",
    parts: [
      { n: "Storing a value", d: "Everything else is built on a name pointing at a piece of data.",
        s: ["Variable", "Data Type", "String", "Integer", "Boolean", "Null", "Operator"] },
      { n: "Choosing and repeating", d: "The two ways a program stops being a straight line.",
        s: ["Conditional", "Loop"] },
      { n: "Packaging work up", d: "Naming a block of steps so you can use it without rereading it.",
        s: ["Function", "Parameter", "Return Value"] },
      { n: "Holding many things at once", d: "One name, many values — and the off-by-one that catches everyone.",
        s: ["Array", "Dictionary", "Zero-Based Indexing"] },
      { n: "When it goes wrong", d: "Error vocabulary, learned early, because you will meet all of it in week one.",
        s: ["Bug", "Syntax Error", "Runtime Error", "Exception", "Stack Trace", "Debugging", "Comment"] },
      { n: "Standing on other people's code", d: "Nobody writes everything themselves. This is how you borrow.",
        s: ["Module", "Import", "Library", "Framework", "Dependency", "Command Line Interface"] },
      { n: "Keeping what you wrote", d: "The two words that make experimenting free instead of frightening.",
        s: ["Repository", "Commit"] }
    ]
  },

  {
    id: "read-any-codebase",
    name: "Reading someone else's code",
    cat: "crash-course",
    kind: "start",
    lvl: "After your first 30 words",
    icon: "eye",
    desc: "The vocabulary you need to open an unfamiliar repository and actually follow what is happening.",
    who: "You can write a little code, but a real project on GitHub still looks like a wall.",
    gain: "You can open a strange repository, find where it starts, and follow one feature end to end.",
    course: "basics",
    parts: [
      { n: "Finding the front door", d: "Every project has one file that runs first. Start there, never in the middle.",
        s: ["Entry Point", "Module", "Import", "Namespace"] },
      { n: "Following the calls", d: "The unit of reading is not the file, it is the function.",
        s: ["Function", "Parameter", "Return Value"] },
      { n: "Objects and what they own", d: "Most code you will inherit is organised around these five words.",
        s: ["Method", "Class", "Instance", "Constructor", "Property"] },
      { n: "Where a name is visible", d: "Half of confusing code is confusing because you cannot see where a name lives.",
        s: ["Scope", "Closure"] },
      { n: "House style you keep meeting", d: "Conventions that look like rules but are choices — knowing that saves arguments.",
        s: ["Guard Clause", "Early Return", "Type Hint", "Docstring"] },
      { n: "Reading history, not just files", d: "Why the code is the way it is lives in the log, not the file.",
        s: ["Comment", "Diff", "Code Review", "Legacy Code"] }
    ]
  },

  {
    id: "one-web-request",
    name: "What happens when you click a link",
    cat: "crash-course",
    kind: "start",
    lvl: "No experience needed",
    icon: "browser",
    desc: "Follow a single request from the browser to the database and back, one word at a time.",
    who: "You use the web every day and have no picture at all of what happens between the click and the page.",
    gain: "You can describe a page load end to end, and you know which word to search when it is slow.",
    course: "backend",
    parts: [
      { n: "Finding the machine", d: "Before anything is sent, the browser has to work out where to send it.",
        s: ["Client", "DNS", "Server", "Port"] },
      { n: "Sending the question", d: "A request is just a very well-specified piece of text.",
        s: ["Request", "HTTP Header", "Query Parameter", "Payload"] },
      { n: "What answers it", d: "On the other end, something has been waiting for exactly this shape of message.",
        s: ["Endpoint", "REST", "JSON", "Serialization"] },
      { n: "The answer coming back", d: "Status codes are the whole conversation compressed into three digits.",
        s: ["Response", "Status Code", "Cache"] },
      { n: "Why it feels fast or slow", d: "Three words that explain every performance complaint you will ever file.",
        s: ["Latency", "Throughput", "Bottleneck"] },
      { n: "Doing it a million times, safely", d: "What has to be true for the same trip to work for everybody at once.",
        s: ["Stateless", "SSL Certificate"] }
    ]
  },

  {
    id: "ai-plain-english",
    name: "AI engineering, in plain English",
    cat: "crash-course",
    kind: "start",
    lvl: "No maths required",
    icon: "sparkles",
    desc: "Everything you need to hold a real conversation about building on models — no maths required.",
    who: "You work near people building with models and want to follow the meeting rather than nod through it.",
    gain: "You can read an AI product spec, price it roughly, and ask the question that matters.",
    course: "llm",
    parts: [
      { n: "What a model actually is", d: "Strip the mystique: a very large pile of numbers and two verbs.",
        s: ["Model", "Weights", "Parameter Count", "Training", "Inference"] },
      { n: "What it learned from", d: "Every property of a model traces back to what it was shown.",
        s: ["Dataset", "Label"] },
      { n: "How it reads you", d: "It never sees your words. It sees pieces of them, and only so many.",
        s: ["Token", "Context Window"] },
      { n: "How you talk to it", d: "The three layers of instruction that every product on the market uses.",
        s: ["Prompt", "Prompt Template", "System Message"] },
      { n: "The knobs on the box", d: "The small set of settings that change the character of every answer.",
        s: ["Temperature", "Greedy Decoding", "Max Tokens"] },
      { n: "What it costs, and how fast it feels", d: "Speed and price are design decisions, not fixed properties.",
        s: ["Streaming Response", "Time To First Token", "Cost Per Token"] },
      { n: "Giving it your own documents", d: "How a general model answers questions about your private data.",
        s: ["Embedding", "Embedding Dimension", "Chunking", "Chunk Overlap", "Retrieval-Augmented Generation"] },
      { n: "Letting it act, and keeping it honest", d: "The part everyone skips, and the part that decides whether it ships.",
        s: ["Tool Use", "Hallucination", "Golden Dataset", "Human-in-the-Loop"] }
    ]
  },

  /* ================= foundations ================= */
  {
    id: "cs-fundamentals-crash",
    name: "CS & Systems Essentials",
    cat: "cs-fundamentals",
    kind: "core",
    lvl: "Foundational",
    icon: "cpu",
    desc: "The foundational computer science and systems mental models every engineer should know by heart.",
    who: "You can write working code but could not explain what your program is doing to the machine.",
    gain: "You can reason about memory, cost and concurrency instead of guessing at them.",
    course: "dsa",
    parts: [
      { n: "How work gets measured", d: "The language for saying whether a solution is good, before you write it.",
        s: ["Recursion", "Time Complexity", "Space Complexity"] },
      { n: "Where values live", d: "Almost every mystifying bug is one of these four ideas, misunderstood.",
        s: ["Stack and Heap Memory", "Pass by Value vs Reference", "Pure Function", "Immutability"] },
      { n: "When memory and timing betray you", d: "The failures that only appear under load, months after you shipped.",
        s: ["Memory Leak", "Garbage Collection", "Race Condition"] },
      { n: "Structures worth knowing cold", d: "Six shapes that cover the overwhelming majority of real problems.",
        s: ["Array vs Linked List", "Stack and Queue", "Binary Search", "Hash Table", "Binary Search Tree", "Graph Traversal"] },
      { n: "Two things at once", d: "Concurrency, and the classic way it goes wrong.",
        s: ["Process vs Thread", "Deadlock"] },
      { n: "Code other people inherit", d: "The two phrases every code review eventually reaches for.",
        s: ["SOLID Principles", "Technical Debt"] },
      { n: "The systems layer underneath", d: "What is happening below your program, in four words.",
        s: ["TCP Three-Way Handshake", "DNS Resolution", "Hashing vs Encryption", "Load Balancing"] }
    ]
  },

  {
    id: "cs-interview",
    name: "CS fundamentals for interviews",
    cat: "cs-fundamentals",
    kind: "core",
    lvl: "Interview prep",
    icon: "graph",
    desc: "The set of ideas that ninety percent of technical interviews are drawn from.",
    who: "You have interviews booked and want to know exactly what the question bank is made of.",
    gain: "You recognise which of a dozen shapes a question is in the first minute rather than the twentieth.",
    course: "dsa",
    parts: [
      { n: "The measuring stick", d: "You cannot discuss a solution until you can price one.",
        s: ["Algorithm", "Big O Notation"] },
      { n: "Linear structures", d: "Four structures, and the trade-off between them that gets asked constantly.",
        s: ["Array", "Linked List", "Stack", "Queue"] },
      { n: "Lookups and ordering", d: "How to find one thing among a million, four different ways.",
        s: ["Hash Table", "Binary Search", "Binary Search Tree", "Heap"] },
      { n: "Graphs", d: "The structure behind maps, networks, dependencies and half of the hard questions.",
        s: ["Graph", "Breadth-First Search", "Depth-First Search"] },
      { n: "The techniques questions are built from", d: "Four methods that between them solve most of what you will be asked.",
        s: ["Recursion", "Dynamic Programming", "Greedy Algorithm", "Sorting Algorithm"] },
      { n: "Patterns to spot in the room", d: "Two tricks that turn a quadratic answer into a linear one.",
        s: ["Two Pointers", "Sliding Window"] },
      { n: "Saying the cost out loud", d: "The last two minutes of every interview, and the part most people fumble.",
        s: ["Time Complexity", "Space Complexity"] }
    ]
  },

  {
    id: "security-basics",
    name: "Security every engineer should know",
    cat: "security",
    kind: "core",
    lvl: "Foundational",
    icon: "shield",
    desc: "The minimum security literacy expected of anyone who ships code.",
    who: "You ship code that other people use, and security has so far been somebody else's job.",
    gain: "You can spot the four attacks that account for most breaches, in your own diff.",
    course: { soon: "Security engineering" },
    parts: [
      { n: "Scrambling data", d: "Encryption and hashing are not the same thing, and confusing them is the classic mistake.",
        s: ["Encryption", "Symmetric Encryption", "Asymmetric Encryption", "Hashing", "Salt"] },
      { n: "Trusting a connection", d: "What the padlock in the address bar is actually asserting.",
        s: ["TLS", "Public Key Infrastructure"] },
      { n: "Attacks you will actually be hit by", d: "Not exotic. These are in automated scans against your site tonight.",
        s: ["SQL Injection", "Cross-Site Scripting", "Cross-Site Request Forgery", "OWASP Top 10"] },
      { n: "Not making it easy for them", d: "Four habits that remove most of the blast radius when something does get through.",
        s: ["Principle of Least Privilege", "Multi-Factor Authentication", "Secrets Management", "Zero Trust"] }
    ]
  },

  /* ================= role tracks ================= */
  {
    id: "ai-engineer",
    name: "AI / ML Engineer — from zero",
    cat: "ai-ml-core",
    kind: "role",
    lvl: "Role track",
    icon: "brain",
    desc: "The shortest honest route from what is a model to shipping one. Read top to bottom.",
    who: "You want to build models, not just call somebody else's API.",
    gain: "You can frame a problem as a learning task, train something, and prove honestly whether it works.",
    course: "ml",
    parts: [
      { n: "What the field is", d: "Words people use interchangeably and should not.",
        s: ["Artificial Intelligence", "Machine Learning", "Supervised Learning", "Unsupervised Learning"] },
      { n: "Getting data into learnable shape", d: "The unglamorous majority of the job, and where most accuracy is won.",
        s: ["Feature Engineering", "Training, Validation and Test Split"] },
      { n: "How a model learns", d: "Two ideas. Every training loop you will ever read is these two in a cycle.",
        s: ["Loss Function", "Gradient Descent"] },
      { n: "Why it fails, and the fix", d: "The most common way a model that looked great turns out to be worthless.",
        s: ["Overfitting", "Regularisation", "Cross-Validation"] },
      { n: "Proving it works", d: "Accuracy is the metric that lies. These are the ones that do not.",
        s: ["Confusion Matrix", "Precision", "Recall", "F1 Score"] },
      { n: "Neural networks", d: "From one neuron to the architecture behind everything in the news.",
        s: ["Neural Network", "Backpropagation", "Convolutional Neural Network", "Transformer"] },
      { n: "Getting it in front of users", d: "A model in a notebook is not a product, and it starts decaying the day it ships.",
        s: ["Transfer Learning", "Model Deployment", "Model Drift"] }
    ]
  },

  {
    id: "llm-engineer",
    name: "LLM / Generative AI Engineer",
    cat: "genai-llm",
    kind: "role",
    lvl: "Role track",
    icon: "sparkles",
    desc: "What you actually need to know to build on top of large language models in production.",
    who: "You are building a product on top of a model somebody else trained.",
    gain: "You can design a retrieval system, evaluate it, and defend its cost and its failure modes.",
    course: "llm",
    parts: [
      { n: "The model and how it sees text", d: "Five words that explain most surprising model behaviour.",
        s: ["Large Language Model", "Tokenisation", "Embedding", "Context Window", "Temperature"] },
      { n: "Getting a better answer out of it", d: "Prompting is engineering, and it has named, repeatable techniques.",
        s: ["Prompt Engineering", "Few-Shot Prompting", "Chain-of-Thought Prompting", "System Prompt"] },
      { n: "Giving it your own knowledge", d: "The architecture behind almost every AI feature shipped in the last two years.",
        s: ["Hallucination", "Retrieval-Augmented Generation", "Vector Database", "Semantic Search", "Chunking", "Reranking"] },
      { n: "Changing the model itself", d: "When prompting is not enough — and the cheap ways to do it.",
        s: ["Fine-Tuning", "LoRA", "Quantisation"] },
      { n: "Letting it do things", d: "The step from a chatbot to a system that takes actions on your behalf.",
        s: ["Function Calling", "AI Agent", "Model Context Protocol"] },
      { n: "Shipping it responsibly", d: "The three things a reviewer will ask for before this goes near a customer.",
        s: ["Guardrails", "LLM Evaluation", "Inference Cost"] }
    ]
  },

  {
    id: "backend",
    name: "Backend Engineer essentials",
    cat: "backend-architecture",
    kind: "role",
    lvl: "Role track",
    icon: "server",
    desc: "From a single HTTP request to a system that survives a traffic spike.",
    who: "You want to build the part of a product that lives on a server and holds the data.",
    gain: "You can design an API, put it behind auth, back it with a database, and keep it up under load.",
    course: "backend",
    parts: [
      { n: "The contract you expose", d: "An API is a promise. These six words are the terms of it.",
        s: ["API", "REST", "HTTP", "JSON", "Status Code", "Idempotency"] },
      { n: "Knowing who is calling", d: "Two different questions people constantly merge into one.",
        s: ["Authentication", "Authorisation", "JWT", "OAuth 2.0"] },
      { n: "Where the data lives", d: "The storage layer, and the guarantees it does and does not give you.",
        s: ["Relational Database", "SQL", "Index", "Transaction", "ACID"] },
      { n: "Surviving the traffic", d: "Three cheap moves that buy an order of magnitude before you rearchitect anything.",
        s: ["Caching", "Rate Limiting", "Load Balancer"] },
      { n: "Splitting the system up", d: "What you gain, and the failure modes you buy with it.",
        s: ["Message Queue", "Microservices", "Circuit Breaker"] },
      { n: "Running it in production", d: "The difference between code that works and a service you can operate.",
        s: ["Horizontal Scaling", "Observability"] }
    ]
  },

  {
    id: "frontend",
    name: "Frontend Engineer essentials",
    cat: "web-frontend",
    kind: "role",
    lvl: "Role track",
    icon: "browser",
    desc: "The browser, the render pipeline, and the frameworks that sit on top.",
    who: "You want to build the part people actually see and touch.",
    gain: "You can build an accessible, fast interface and explain every layer between your file and the pixels.",
    course: "html",
    parts: [
      { n: "The three languages of a page", d: "Structure, appearance, behaviour — kept separate on purpose.",
        s: ["HTML", "CSS", "JavaScript"] },
      { n: "How the browser runs it", d: "The two mechanisms every framework is built on top of.",
        s: ["DOM", "Event Loop"] },
      { n: "Laying it out on any screen", d: "Modern layout is two systems and one attitude.",
        s: ["Flexbox", "CSS Grid", "Responsive Design"] },
      { n: "Frameworks, and where they came from", d: "Each of these words answers a problem the one before it created.",
        s: ["Single Page Application", "Virtual DOM", "React", "Component", "State Management"] },
      { n: "Rendering on the server again", d: "The industry went full circle, and this is why.",
        s: ["Server-Side Rendering", "Hydration"] },
      { n: "Shipping less JavaScript", d: "Performance work on the frontend is mostly the art of sending less.",
        s: ["Bundler", "Code Splitting", "Lazy Loading"] },
      { n: "The quality bar", d: "The four things a senior reviewer checks that a junior forgets.",
        s: ["Core Web Vitals", "Web Accessibility", "CORS", "Progressive Web App"] }
    ]
  },

  {
    id: "data-engineer",
    name: "Data Engineer track",
    cat: "data-engineering",
    kind: "role",
    lvl: "Role track",
    icon: "pipeline",
    desc: "Moving data reliably from where it is produced to where it is useful.",
    who: "You want to build the plumbing that every analyst and model in the company drinks from.",
    gain: "You can design a pipeline that reruns safely, lands in a queryable shape, and can be trusted.",
    course: "sql",
    parts: [
      { n: "Moving data at all", d: "The three-letter acronyms, and the one real difference between them.",
        s: ["Data Pipeline", "ETL", "ELT"] },
      { n: "Batch or stream", d: "The fork in the road that determines every tool choice after it.",
        s: ["Batch Processing", "Stream Processing", "Apache Kafka", "Apache Spark"] },
      { n: "Where it lands", d: "Warehouse, lake or lakehouse — and the file format that quietly decides your bill.",
        s: ["Data Warehouse", "Data Lake", "Lakehouse", "Parquet", "Partitioning"] },
      { n: "Running it on a schedule", d: "A pipeline that cannot be safely rerun is not a pipeline, it is a liability.",
        s: ["Apache Airflow", "dbt", "Change Data Capture", "Idempotency"] },
      { n: "Trusting what comes out", d: "The half of the job that separates a data engineer from a script author.",
        s: ["Data Quality", "Data Lineage", "Star Schema", "Slowly Changing Dimension"] }
    ]
  },

  {
    id: "devops",
    name: "DevOps & Cloud starter",
    cat: "devops-cloud",
    kind: "role",
    lvl: "Role track",
    icon: "cloud",
    desc: "How code gets from your laptop to a machine somebody else pays for.",
    who: "Your code works locally and you have no idea how it becomes something the world can open.",
    gain: "You can containerise an app, ship it through a pipeline, and watch it once it is out there.",
    course: "docker",
    parts: [
      { n: "The idea and the habit", d: "DevOps is a working practice first and a toolchain second.",
        s: ["DevOps", "Version Control", "Git", "CI/CD"] },
      { n: "Packaging the app", d: "The move that made works on my machine stop being an argument.",
        s: ["Container", "Docker", "Container Image"] },
      { n: "Running many of them", d: "What you reach for when one container stops being enough.",
        s: ["Kubernetes", "Pod"] },
      { n: "Describing the infrastructure", d: "Servers as files in a repository, reviewable like any other change.",
        s: ["Infrastructure as Code", "Terraform"] },
      { n: "Releasing without an outage", d: "Two strategies that make a deploy boring, which is the goal.",
        s: ["Blue-Green Deployment", "Canary Deployment"] },
      { n: "Knowing what it is doing", d: "You cannot operate what you cannot see, and here is what to look at.",
        s: ["Monitoring", "Logging", "Distributed Tracing", "SLA, SLO and SLI"] },
      { n: "Paying for it", d: "The cloud is somebody else's computer, billed by the second.",
        s: ["IaaS, PaaS and SaaS", "Autoscaling"] }
    ]
  },

  {
    id: "nlp-engineer",
    name: "NLP Engineer",
    cat: "nlp",
    kind: "role",
    lvl: "Role track",
    icon: "chat",
    desc: "Text as data — from tokenisation and classical pipelines through to modern sequence models and production NLP.",
    who: "You want to build systems that read, classify, extract and generate text.",
    gain: "You can design a text pipeline from preprocessing to evaluation and defend every architectural choice.",
    course: "nlp",
    parts: [
      { n: "Cleaning and representing text", d: "Everything downstream depends on this step being right.",
        s: ["Natural Language Processing", "Corpus", "Stemming", "Lemmatisation", "Stop Words", "Text Normalisation", "Regular Expression"] },
      { n: "From words to vectors", d: "The representations that let models see meaning in text.",
        s: ["Bag of Words", "TF-IDF", "N-gram", "GloVe", "FastText", "Sentence Embedding"] },
      { n: "The core NLP tasks", d: "Classification, extraction and structural understanding — the tasks that turn text into data.",
        s: ["Text Classification", "Sentiment Analysis", "Named Entity Recognition", "Part-of-Speech Tagging", "Dependency Parsing", "Coreference Resolution"] },
      { n: "Sequence models and attention", d: "The architectures that made modern NLP possible.",
        s: ["Language Model", "Perplexity"] },
      { n: "Generation and translation", d: "Producing text, not just labelling it.",
        s: ["Machine Translation", "Text Summarisation", "Question Answering"] },
      { n: "Extraction and knowledge", d: "Turning documents into structured, queryable knowledge.",
        s: ["Information Extraction", "Knowledge Graph", "Topic Modelling", "Latent Dirichlet Allocation", "Intent Recognition", "Word Sense Disambiguation"] },
      { n: "Evaluation and production", d: "The metrics that keep NLP honest, and the concerns that separate research from deployment.",
        s: ["BLEU", "ROUGE", "Speech Recognition", "Text-to-Speech"] }
    ]
  },

  {
    id: "mlops-production",
    name: "MLOps — models in production",
    cat: "mlops",
    kind: "role",
    lvl: "Role track",
    icon: "gauge",
    desc: "Tracking, registries, serving and the monitoring that tells you a model has quietly stopped working.",
    who: "You have a model that works in a notebook and needs to survive contact with real traffic.",
    gain: "You can deploy a model, version it, monitor it and roll it back at 2am without guessing.",
    course: "mlops",
    parts: [
      { n: "The unglamorous 90%", d: "What happens after the notebook: the engineering that makes a model something you can operate.",
        s: ["MLOps", "Reproducibility"] },
      { n: "Tracking and versioning", d: "Recording every experiment so the good run is never lost.",
        s: ["Experiment Tracking", "MLflow"] },
      { n: "Registries and governance", d: "Promoting a model through stages with metrics, approvals and rollback.",
        s: ["Model Registry"] },
      { n: "Getting it deployed", d: "From a pickle file to a URL that survives a traffic spike.",
        s: ["Model Deployment", "Model Serving", "Containerisation"] },
      { n: "Pipeline orchestration", d: "Automating the train-evaluate-deploy cycle so humans approve rather than execute.",
        s: ["Apache Airflow", "CI/CD"] },
      { n: "Monitoring and drift", d: "The model will degrade silently — monitoring is how you notice before your users do.",
        s: ["Model Drift", "Data Quality", "A/B Testing"] }
    ]
  },

  {
    id: "databases-beyond-sql",
    name: "Databases beyond SQL",
    cat: "databases",
    kind: "role",
    lvl: "Role track",
    icon: "database",
    desc: "Document, key-value, column and graph stores — what each is genuinely for, and when it is a trap.",
    who: "You know SQL well and keep hearing that relational is not always the answer.",
    gain: "You can choose the right database family for a workload and explain why, instead of picking the one you know.",
    course: "sql",
    parts: [
      { n: "Why not everything is a table", d: "The trade-offs that made NoSQL necessary and the ones that make it dangerous.",
        s: ["NoSQL", "CAP Theorem", "Eventual Consistency", "BASE"] },
      { n: "Document stores", d: "When your data is a self-contained blob rather than a normalised graph.",
        s: ["Document Database", "MongoDB"] },
      { n: "Key-value and caching", d: "The fastest lookup: a key in, a value out, nothing else.",
        s: ["Key-Value Store", "Redis", "DynamoDB"] },
      { n: "Wide-column stores", d: "When you have a billion rows and a thousand columns, most of them empty.",
        s: ["Wide-Column Store", "Cassandra"] },
      { n: "Graph databases", d: "When the relationships are the data, not an afterthought.",
        s: ["Graph Database", "Neo4j"] },
      { n: "Search and analytics engines", d: "Full-text search, log analytics and the inverted index underneath.",
        s: ["Elasticsearch", "Full-Text Search", "Inverted Index"] },
      { n: "Vectors, time-series and OLAP", d: "Specialised engines for specialised workloads.",
        s: ["Vector Database", "Time-Series Database", "Columnar Storage", "ClickHouse", "Snowflake", "BigQuery"] },
      { n: "Distributed fundamentals", d: "The infrastructure that lets any of these scale beyond one machine.",
        s: ["Sharding", "Replication", "Connection Pool"] }
    ]
  },

  {
    id: "system-design",
    name: "System design for interviews & scale",
    cat: "backend-architecture",
    kind: "core",
    lvl: "Interview prep",
    icon: "network",
    desc: "The whiteboard round: estimating load, choosing storage, designing caches, message queues, and defending trade-offs out loud.",
    who: "You can build backend services and want to architect systems that scale to millions of concurrent users and ace technical interviews.",
    gain: "You can design a high-availability distributed system from scratch and defend every architectural trade-off with quantitative rigor.",
    course: "systemdesign",
    parts: [
      { n: "Scaling and traffic routing", d: "How requests get from the user to the right server without melting anything.",
        s: ["Horizontal Scaling", "Vertical Scaling", "Load Balancer", "Reverse Proxy", "API Gateway", "CDN", "Statelessness"] },
      { n: "Data partitioning and replication", d: "Splitting and copying data so writes scale and disks survive hardware failure.",
        s: ["Relational Database", "NoSQL", "Sharding", "Replication"] },
      { n: "Consistency and consensus", d: "The theoretical and practical limits of distributed agreement over real networks.",
        s: ["CAP Theorem", "Eventual Consistency", "ACID", "BASE", "Consensus", "Leader Election"] },
      { n: "High-performance caching", d: "Sub-millisecond memory lookups, invalidation strategies, and stampede prevention.",
        s: ["Caching", "Cache Invalidation", "Redis"] },
      { n: "Asynchronous messaging and streams", d: "Decoupling services with queues, event logs, and resilient outbox pipelines.",
        s: ["Message Queue", "Publish-Subscribe", "Dead Letter Queue", "Event Sourcing", "CQRS", "Saga Pattern"] },
      { n: "Fault tolerance and resilience", d: "Keeping the system alive when individual services, disks, and networks fail.",
        s: ["Distributed System", "Circuit Breaker", "Bulkhead", "Rate Limiting", "Exponential Backoff", "Timeout", "Graceful Degradation", "Health Check"] },
      { n: "Real-time communication and protocols", d: "Protocols and architectures for live, bidirectional streaming.",
        s: ["WebSocket", "Microservices", "Monolith", "Status Code"] }
    ]
  }

]);

/* Paths that are planned but not yet written. They are declared here rather
   than left out, because a reader looking for the vision track deserves to
   know it is coming instead of concluding the subject is not covered. Each
   one names the category it will draw from, so the day the terms exist the
   path is a short edit rather than a design exercise.                     */
TD.defineSoonPaths([
  { id: "vision-engineer", name: "Computer Vision Engineer", cat: "computer-vision", kind: "role",
    icon: "eye", lvl: "Role track",
    desc: "Pixels, convolutions, detection and segmentation — the branch of deep learning that got there first.",
    course: { soon: "Computer vision" } },

  { id: "math-for-ml", name: "The maths you actually need", cat: "math-stats", kind: "core",
    icon: "sigma", lvl: "Foundational",
    desc: "The working subset of linear algebra, calculus and probability — no more, taken alongside your first models.",
    course: "math" },

  { id: "os-networking", name: "Operating systems & networking", cat: "os-networking", kind: "core",
    icon: "cpu", lvl: "Foundational",
    desc: "Processes, memory, files and packets: the layer every program sits on and most engineers never learn.",
    course: { soon: "Systems & networking" } },

  { id: "language-tour", name: "A tour of the languages", cat: "programming-languages", kind: "start",
    icon: "code", lvl: "No experience needed",
    desc: "What each major language is for, what it is bad at, and how to choose one without joining a religion.",
    course: "basics" },

  { id: "practice", name: "How professional teams work", cat: "software-engineering", kind: "core",
    icon: "list", lvl: "Foundational",
    desc: "Testing, review, agile ritual and technical debt — the practices around the code that decide whether it survives.",
    course: { soon: "Engineering practice" } },

  { id: "emerging", name: "The edge of the field", cat: "emerging-tech", kind: "role",
    icon: "atom", lvl: "Curiosity",
    desc: "Quantum, edge, Web3 and the rest — what is real, what is early, and what the words mean.",
    course: { soon: "Emerging tech" } }
]);
