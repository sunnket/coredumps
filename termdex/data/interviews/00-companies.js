/* Company Technical Interview Hub — company registry and question registry.

   Two things live here:

   1. The company list. Each entry carries an explicit `group` rather than
      leaving the UI to guess from a prose `domain` string — the old code
      substring-matched "Frontier AI" against the domain text, which silently
      dropped NVIDIA, Apple, Netflix, Uber, Tesla, ByteDance, Adobe, Flipkart
      and TCS out of every filter tab they belonged in.

   2. The question registry. Questions are authored once in topic banks and
      tagged with the companies that actually ask them, because that is how
      the material really works: a B-tree question is a B-tree question
      whether Oracle or Snowflake asks it. `TD.questionsByCompany` is derived
      from those tags at load time, so a company's count is whatever it
      genuinely has — never a padded round number. */
(function (TD) {
  "use strict";

  /* Difficulty rungs, shared by every question and rendered as one badge.
     "staff" is not simply "harder than hard": it is the round where the
     interviewer stops asking whether you know the mechanism and starts
     asking which mechanism you would pick, and what you would give up. */
  TD.ivLevels = ["easy", "medium", "hard", "staff"];

  TD.ivLevelMeta = {
    easy: { label: "Easy", blurb: "Warm-up. You should get this without pausing.", cls: "lvl-easy" },
    medium: { label: "Medium", blurb: "The bread and butter of a screening round.", cls: "lvl-med" },
    hard: { label: "Hard", blurb: "Onsite depth. Expect follow-ups either way.", cls: "lvl-hard" },
    staff: { label: "Staff / Bar raiser", blurb: "Judgement, not recall. Trade-offs are the answer.", cls: "lvl-staff" }
  };

  /* The topic taxonomy. Fixed and closed: every question must name one of
     these, which is what lets the filter counts be trustworthy. */
  TD.ivTopics = [
    { id: "DSA", label: "DSA & Algorithms", icon: "graph", col: "#4d5bd8",
      blurb: "Arrays, graphs, trees, heaps, dynamic programming, and the complexity argument for each." },
    { id: "System Design", label: "System Design", icon: "server", col: "#0891b2",
      blurb: "Sizing, partitioning, replication, caching, queues, and the failure story." },
    { id: "DBMS", label: "Databases", icon: "database", col: "#c2410c",
      blurb: "Indexes, transactions, isolation, query planning, and the storage engine underneath." },
    { id: "OS & Concurrency", label: "OS & Concurrency", icon: "cpu", col: "#7c3aed",
      blurb: "Processes, threads, locks, memory, scheduling, and everything that races." },
    { id: "Networks", label: "Networks", icon: "network", col: "#0d9488",
      blurb: "TCP, TLS, HTTP, DNS, load balancing, and where the latency actually goes." },
    { id: "OOP & Code Quality", label: "OOP & Code Quality", icon: "code", col: "#b45309",
      blurb: "Design patterns, SOLID, testing, and the machine-coding round." },
    { id: "ML & Statistics", label: "ML & Statistics", icon: "sigma", col: "#be123c",
      blurb: "Bias/variance, evaluation, features, and the maths that keeps models honest." },
    { id: "LLM & GenAI", label: "LLM & GenAI", icon: "spark", col: "#9333ea",
      blurb: "Transformers, attention internals, fine-tuning, RAG, agents, and serving." },
    { id: "Behavioural", label: "Behavioural & Values", icon: "users", col: "#059669",
      blurb: "The round most candidates under-prepare and most offers turn on." }
  ];

  TD.ivTopicById = {};
  TD.ivTopics.forEach(function (t) { TD.ivTopicById[t.id] = t; });

  TD.ivGroups = [
    { id: "frontier", label: "Frontier AI Labs", short: "Frontier AI",
      blurb: "Research-heavy loops. Expect derivations, not recall." },
    { id: "bigtech", label: "Big Tech & Cloud", short: "Big Tech",
      blurb: "Structured loops with a strong algorithms and scale bias." },
    { id: "applied", label: "AI-First Product Companies", short: "Applied AI",
      blurb: "Where applied AI engineering is the product. Retrieval, evaluation and cost, at scale." },
    { id: "data", label: "Data, Systems & Robotics", short: "Data & Systems",
      blurb: "Storage engines, streaming, geospatial, and real-time perception." },
    { id: "enterprise", label: "Enterprise, Social & Global", short: "Enterprise & Global",
      blurb: "Machine coding, multi-tenancy, and very large user counts." }
  ];

  TD.interviewCompanies = [
    /* ---------------- Frontier AI labs ---------------- */
    {
      id: "openai",
      name: "OpenAI",
      group: "frontier",
      domain: "Frontier AI & LLMs",
      col: "#10a37f",
      badge: "GPT & frontier research",
      tagline: "Scaling laws, post-training reinforcement learning, and the systems that serve them.",
      difficulty: "hard",
      loop: "4–6 rounds over 3–5 weeks",
      rounds: [
        { name: "Coding screen", what: "One or two problems, usually practical rather than puzzle-like — parsing, streaming, or a small data structure.", prep: "Write runnable code. They care that it works more than that it is clever." },
        { name: "ML / LLM depth", what: "Attention internals, tokenisation, training dynamics, why a loss curve looks the way it does.", prep: "Be able to derive attention and explain what the KV cache actually stores." },
        { name: "Systems design", what: "Serving, throughput, batching, GPU memory. Often framed around a real serving bottleneck.", prep: "Know continuous batching, PagedAttention, and where time-to-first-token goes." },
        { name: "Alignment & judgement", what: "How you reason about model behaviour, misuse, and shipping under uncertainty.", prep: "Have opinions with reasons, and be willing to change them under new evidence." }
      ],
      hiringFocus: "Transformer internals, KV-cache economics, RL post-training (PPO/GRPO/DPO), inference throughput, and agent tool-calling.",
      signals: [
        "Can you go from a symptom (latency, loss spike, OOM) to a mechanism without guessing?",
        "Do you quantify? Rough numbers beat adjectives every time.",
        "Do you say 'I don't know' cleanly and then reason forward anyway?"
      ],
      topicMix: { "LLM & GenAI": 40, "System Design": 25, "ML & Statistics": 15, "DSA": 12, "Behavioural": 8 }
    },
    {
      id: "anthropic",
      name: "Anthropic",
      group: "frontier",
      domain: "Frontier AI & LLMs",
      col: "#d97706",
      badge: "Claude & Constitutional AI",
      tagline: "Reliable, interpretable, steerable systems — and the engineering that makes them fast.",
      difficulty: "hard",
      loop: "4–5 rounds, heavy on practical work samples",
      rounds: [
        { name: "Practical coding", what: "A realistic task in a real editor. Often a small service, a parser, or a data pipeline.", prep: "Practise writing complete, tested code under time pressure — not whiteboard pseudocode." },
        { name: "ML systems", what: "Context windows, retrieval, evaluation harnesses, throughput and cost.", prep: "Be able to design an eval before designing the system it measures." },
        { name: "Interpretability / safety", what: "How you would find out what a model is doing, and what you would do about it.", prep: "Superposition, probing, and why a benchmark number can be misleading." },
        { name: "Values", what: "How you weigh speed against caution when both are defensible.", prep: "Bring a real example where you slowed something down on purpose." }
      ],
      hiringFocus: "Long-context retrieval, evaluation design, interpretability, high-throughput inference, and honest reasoning about uncertainty.",
      signals: [
        "Do you test your own claims, or assert them?",
        "Can you design an evaluation that would catch you being wrong?",
        "Do you communicate calibrated confidence rather than confident vagueness?"
      ],
      topicMix: { "LLM & GenAI": 38, "System Design": 22, "ML & Statistics": 15, "OOP & Code Quality": 12, "Behavioural": 13 }
    },
    {
      id: "google-deepmind",
      name: "Google DeepMind",
      group: "frontier",
      domain: "Frontier AI & Research",
      col: "#4285f4",
      badge: "Gemini & AlphaFold",
      tagline: "Research-grade maths with production-grade compute behind it.",
      difficulty: "hard",
      loop: "5–6 rounds including a research discussion",
      rounds: [
        { name: "Algorithms & maths", what: "Classic algorithms plus probability and linear algebra reasoning.", prep: "Expectation, variance, eigenvectors, and gradient derivations by hand." },
        { name: "Deep learning depth", what: "Architectures, optimisers, and why a training run diverged.", prep: "Know what each normalisation layer actually fixes." },
        { name: "Large-scale systems", what: "Distributed training, sharding, and TPU/GPU topology.", prep: "Data vs tensor vs pipeline parallelism, and when each stops scaling." },
        { name: "Research discussion", what: "A deep dive on your own past work, pushed until it breaks.", prep: "Know the weakest part of your own project better than they do." }
      ],
      hiringFocus: "Multimodal architectures, reinforcement learning, mixture-of-experts routing, distributed training, and first-principles derivation.",
      signals: [
        "Can you derive rather than recall?",
        "Do you know the limits of your own results?",
        "Can you scope a research idea down to something testable this week?"
      ],
      topicMix: { "ML & Statistics": 30, "LLM & GenAI": 28, "DSA": 20, "System Design": 14, "Behavioural": 8 }
    },
    {
      id: "meta-ai",
      name: "Meta AI (FAIR)",
      group: "frontier",
      domain: "Frontier AI & Systems",
      col: "#0668e1",
      badge: "Llama & PyTorch core",
      tagline: "Open weights, enormous recommender systems, and the compiler stack underneath both.",
      difficulty: "hard",
      loop: "5 rounds — two coding, one design, one domain, one behavioural",
      rounds: [
        { name: "Coding × 2", what: "Two 45-minute rounds, two problems each. Speed matters here more than at most labs.", prep: "Drill until a medium takes 15 minutes including tests." },
        { name: "ML system design", what: "A recommender or ranking system end to end: features, training, serving, feedback loop.", prep: "Two-tower retrieval, then ranking. Know why the split exists." },
        { name: "Domain depth", what: "PyTorch internals, CUDA, or large-scale training depending on the team.", prep: "torch.compile, autograd, and where the memory actually goes." },
        { name: "Behavioural", what: "Impact, ambiguity, disagreement.", prep: "Quantify your impact. 'Improved latency' is not an answer; '380 ms to 90 ms at P99' is." }
      ],
      hiringFocus: "Recommender architecture, PyTorch and compiler internals, RoPE and attention variants, and very large-scale training.",
      signals: [
        "Speed and correctness together in the coding rounds.",
        "Can you name the metric your design is optimising before designing it?",
        "Do you talk about impact in numbers?"
      ],
      topicMix: { "DSA": 28, "LLM & GenAI": 24, "System Design": 22, "ML & Statistics": 16, "Behavioural": 10 }
    },
    {
      id: "nvidia",
      name: "NVIDIA",
      group: "frontier",
      domain: "AI hardware & compute",
      col: "#76b900",
      badge: "CUDA & TensorRT-LLM",
      tagline: "Where deep learning meets the memory hierarchy, and the memory hierarchy usually wins.",
      difficulty: "hard",
      loop: "4–5 rounds, strongly C++ and hardware flavoured",
      rounds: [
        { name: "C++ & data structures", what: "Pointers, memory, RAII, and a classic algorithm or two.", prep: "Be fluent in C++ memory semantics — move, copy, and lifetime." },
        { name: "GPU architecture", what: "Warps, occupancy, coalescing, shared memory banks.", prep: "Know why a kernel is memory-bound before you optimise it." },
        { name: "DL acceleration", what: "Quantisation, kernel fusion, TensorRT graph optimisation.", prep: "FP8/INT8 trade-offs and what breaks numerically." },
        { name: "System architecture", what: "Multi-GPU communication, NVLink, collective operations.", prep: "All-reduce cost models and when interconnect becomes the ceiling." }
      ],
      hiringFocus: "CUDA kernel optimisation, memory-hierarchy reasoning, quantisation, inference engines, and multi-GPU collectives.",
      signals: [
        "Do you reason about bytes moved, not just operations performed?",
        "Can you profile before optimising?",
        "Do you know the arithmetic intensity of the thing you are speeding up?"
      ],
      topicMix: { "OS & Concurrency": 30, "LLM & GenAI": 24, "DSA": 20, "System Design": 16, "Behavioural": 10 }
    },

    /* ---------------- AI-first product companies ----------------
       The group an applied AI engineer is most likely to actually get into.
       These loops probe retrieval, evaluation and cost rather than kernels
       and derivations — which is why they are the realistic target for
       someone whose evidence is a shipped system rather than a paper. */
    {
      id: "perplexity",
      name: "Perplexity AI",
      group: "applied",
      domain: "AI search & retrieval",
      col: "#20808d",
      badge: "Answer engine at web scale",
      tagline: "Retrieval is the product. Latency, freshness and citation are the whole engineering problem.",
      difficulty: "hard",
      loop: "4 rounds, retrieval-heavy, usually inside two weeks",
      rounds: [
        { name: "Practical coding", what: "A real task — a crawler, a ranking merge, a streaming parser. Runnable code, not pseudocode.", prep: "Practise finishing. A working solution with two tests beats an elegant half." },
        { name: "Retrieval depth", what: "Hybrid search, reranking, freshness, deduplication, and why a citation is wrong.", prep: "Know reciprocal rank fusion, cross-encoders, and how you would measure recall@k without labels." },
        { name: "Latency system design", what: "An answer engine with a sub-second budget across search, rerank and generation.", prep: "Budget the milliseconds out loud. Streaming and speculative fetching are expected answers." },
        { name: "Product judgement", what: "What a good answer is, and how you would know your change made answers worse.", prep: "Have an opinion on when the system should refuse to answer." }
      ],
      hiringFocus: "Hybrid retrieval, reranking, index freshness, citation grounding, streaming latency, and evaluation without ground truth.",
      signals: [
        "Do you budget latency in milliseconds rather than describing it with adjectives?",
        "Can you design an evaluation for answers that have no single correct form?",
        "Do you treat a wrong citation as a bug rather than a rounding error?"
      ],
      topicMix: { "LLM & GenAI": 40, "System Design": 26, "DSA": 16, "ML & Statistics": 10, "Behavioural": 8 }
    },
    {
      id: "cohere",
      name: "Cohere",
      group: "applied",
      domain: "Enterprise LLMs & retrieval",
      col: "#39594d",
      badge: "Command, Embed & Rerank",
      tagline: "Models sold to enterprises, which means retrieval quality, privacy and cost are the product.",
      difficulty: "hard",
      loop: "4–5 rounds with a strong applied-research flavour",
      rounds: [
        { name: "Coding", what: "Data-shaped problems — tokenisation, batching, dataset processing.", prep: "Be comfortable manipulating text and tensors without a framework holding your hand." },
        { name: "Embeddings & reranking", what: "Bi-encoders against cross-encoders, contrastive training, hard negatives, multilingual retrieval.", prep: "Know why in-batch negatives are cheap and why hard negatives are what actually move recall." },
        { name: "Applied system design", what: "A private, on-premise RAG deployment for a bank or a hospital.", prep: "Access control, data residency and audit are first-class parts of the answer." },
        { name: "Fine-tuning judgement", what: "When a customer should adapt a model and when they should fix their retrieval instead.", prep: "Be able to recommend against fine-tuning and defend it." }
      ],
      hiringFocus: "Embedding and reranker training, multilingual retrieval, enterprise deployment constraints, and adaptation versus retrieval judgement.",
      signals: [
        "Can you train a retriever, not only call one?",
        "Do you raise the compliance constraints unprompted?",
        "Do you know what a hard negative is and how to mine one?"
      ],
      topicMix: { "LLM & GenAI": 38, "ML & Statistics": 22, "System Design": 20, "DSA": 12, "Behavioural": 8 }
    },
    {
      id: "mistral",
      name: "Mistral AI",
      group: "applied",
      domain: "Open-weight models & serving",
      col: "#fa5111",
      badge: "Open weights, efficient serving",
      tagline: "Small models made to punch above their size — which makes efficiency the entire craft.",
      difficulty: "hard",
      loop: "4 rounds, efficiency and open-source flavoured",
      rounds: [
        { name: "Systems coding", what: "Something close to the metal — a batching loop, a tokeniser, a memory-bounded queue.", prep: "Python fluency plus a real understanding of where the memory goes." },
        { name: "Architecture & efficiency", what: "Sliding-window attention, grouped-query attention, mixture-of-experts routing.", prep: "Know what each of those buys and what it costs in quality." },
        { name: "Inference serving", what: "Throughput per GPU, continuous batching, quantisation, multi-tenant serving.", prep: "Do the KV-cache arithmetic in front of them." },
        { name: "Open-source judgement", what: "How you would maintain something a thousand strangers depend on.", prep: "Have a real contribution to talk about, however small." }
      ],
      hiringFocus: "Efficient architectures, quantisation, high-throughput serving, and getting frontier-adjacent quality out of a small model.",
      signals: [
        "Can you compute memory and throughput rather than describe them?",
        "Do you know which efficiency tricks are exact and which are approximations?",
        "Have you actually run a model yourself, not only called an API?"
      ],
      topicMix: { "LLM & GenAI": 42, "System Design": 22, "OS & Concurrency": 14, "DSA": 14, "Behavioural": 8 }
    },
    {
      id: "huggingface",
      name: "Hugging Face",
      group: "applied",
      domain: "ML tooling & open source",
      col: "#ff9d00",
      badge: "Transformers, Hub & TRL",
      tagline: "The libraries everyone else builds on. Public code review is the interview.",
      difficulty: "medium",
      loop: "3–4 rounds, plus your public work read carefully",
      rounds: [
        { name: "Open-source review", what: "They read your GitHub. A real pull request into a real project carries more weight here than anywhere else.", prep: "Land one genuine contribution before applying. Documentation counts." },
        { name: "Library engineering", what: "API design, backwards compatibility, and making something usable by beginners without crippling experts.", prep: "Be able to argue about a function signature for ten minutes with reasons." },
        { name: "ML depth", what: "Training loops, PEFT, tokenisers, datasets — the layer under the abstractions.", prep: "Know what the Trainer class is doing that you would otherwise write by hand." },
        { name: "Community judgement", what: "How you respond to a rude issue, a wrong bug report, a breaking change.", prep: "Patience is a technical skill here." }
      ],
      hiringFocus: "Library and API design, PEFT and TRL internals, tokenisers, dataset tooling, and public collaboration.",
      signals: [
        "Is there a merged pull request with your name on it?",
        "Can you design an API a beginner can use and an expert can escape?",
        "Do you write documentation as though somebody has to read it at 2am?"
      ],
      topicMix: { "OOP & Code Quality": 30, "LLM & GenAI": 28, "ML & Statistics": 16, "DSA": 14, "Behavioural": 12 }
    },
    {
      id: "glean",
      name: "Glean",
      group: "applied",
      domain: "Enterprise search & assistants",
      col: "#343ceb",
      badge: "Work assistant over everything",
      tagline: "RAG across every tool a company uses, where showing the wrong document is a security incident.",
      difficulty: "hard",
      loop: "4–5 rounds, permissions and quality heavy",
      rounds: [
        { name: "Coding", what: "Practical problems around indexing, merging and deduplicating documents.", prep: "Streaming, batching and idempotency come up more than graph algorithms." },
        { name: "Retrieval & ranking", what: "Personalised ranking, recency, authority signals, and hybrid search over messy corpora.", prep: "Know how you would rank two identical documents arriving from different sources." },
        { name: "Permissions design", what: "Per-user access control over a search index across a dozen SaaS tools.", prep: "Pre-filtering against post-filtering, and why post-filtering destroys recall." },
        { name: "Quality & evaluation", what: "How you would detect that answers got worse for one department only.", prep: "Segmented metrics. An aggregate number hides exactly this." }
      ],
      hiringFocus: "Multi-source connectors, permission-aware retrieval, personalised ranking, and per-segment quality measurement.",
      signals: [
        "Do you treat access control as part of retrieval rather than a filter bolted on top?",
        "Can you reason about ranking signals beyond embedding similarity?",
        "Do you segment your metrics before you trust them?"
      ],
      topicMix: { "LLM & GenAI": 34, "System Design": 26, "DBMS": 14, "DSA": 16, "Behavioural": 10 }
    },
    {
      id: "scale-ai",
      name: "Scale AI",
      group: "applied",
      domain: "Data engine & evaluation",
      col: "#5b21b6",
      badge: "Training data & model evals",
      tagline: "The unglamorous half of AI — data quality and evaluation — sold as a product.",
      difficulty: "medium",
      loop: "4 rounds, data-quality and pipeline flavoured",
      rounds: [
        { name: "Coding", what: "Data pipeline problems: deduplication, sampling, validation, throughput.", prep: "Hashing, streaming and pandas fluency matter more than dynamic programming." },
        { name: "Data quality design", what: "How you would measure and improve the quality of a million human labels.", prep: "Inter-annotator agreement, gold tasks, and the economics of a second review." },
        { name: "Evaluation design", what: "Building a benchmark that a model cannot game and a customer will trust.", prep: "Contamination, distribution shift, and why a public benchmark stops being informative." },
        { name: "Behavioural", what: "Working with operations teams and non-engineers at scale.", prep: "Be able to explain a technical constraint to someone who does not want to hear it." }
      ],
      hiringFocus: "Data pipelines, label quality, deduplication and contamination, benchmark design, and human-in-the-loop systems.",
      signals: [
        "Do you know how to measure label quality rather than assume it?",
        "Can you spot benchmark contamination in a proposal?",
        "Are you comfortable that most of the value here is in the boring part?"
      ],
      topicMix: { "ML & Statistics": 30, "LLM & GenAI": 24, "DSA": 18, "System Design": 18, "Behavioural": 10 }
    },
    {
      id: "sarvam",
      name: "Sarvam AI & Indian AI labs",
      group: "applied",
      domain: "Indic LLMs & sovereign AI",
      col: "#c2410c",
      badge: "Indian-language models",
      tagline: "Frontier-adjacent work you can realistically reach from India, on problems nobody else is solving.",
      difficulty: "medium",
      loop: "3–4 rounds, plus a take-home more often than not",
      rounds: [
        { name: "Take-home", what: "A small end-to-end build — a fine-tune, an evaluation harness, a retrieval pipeline.", prep: "Finish it, document it, and include the negative results. That is the differentiator." },
        { name: "Applied ML", what: "Tokenisation for Indic scripts, low-resource fine-tuning, speech recognition and synthesis basics.", prep: "Know why a Devanagari sentence costs several times the tokens an English one does." },
        { name: "Engineering", what: "Serving, quantisation, and running on the hardware a startup can actually afford.", prep: "Cost per thousand requests, computed out loud." },
        { name: "Founder round", what: "Why this problem, and whether you will still be here in two years.", prep: "Have a real reason that is not that AI is currently fashionable." }
      ],
      hiringFocus: "Low-resource language modelling, tokenisation for Indic scripts, speech, efficient fine-tuning, and shipping on a startup budget.",
      signals: [
        "Did you finish the take-home, and did you report what did not work?",
        "Can you reason about cost as a first-class constraint?",
        "Do you have a genuine reason to care about the problem?"
      ],
      topicMix: { "LLM & GenAI": 36, "ML & Statistics": 22, "System Design": 18, "DSA": 14, "Behavioural": 10 }
    },
    /* ---------------- Big tech & cloud ---------------- */
    {
      id: "google",
      name: "Google",
      group: "bigtech",
      domain: "Big Tech & Cloud",
      col: "#ea4335",
      badge: "Search, Android & GCP",
      tagline: "The most algorithm-forward loop in big tech, and a design round that expects planetary numbers.",
      difficulty: "hard",
      loop: "1 screen + 4–5 onsite, then hiring committee",
      rounds: [
        { name: "Phone screen", what: "One or two algorithm problems in a shared editor.", prep: "Talk while you think. Silence reads as being stuck." },
        { name: "Coding × 2", what: "Graphs, trees, intervals, dynamic programming. Follow-ups always come.", prep: "State complexity unprompted, then improve it unprompted." },
        { name: "System design", what: "Sized properly: QPS, storage, and a failure story.", prep: "Do the arithmetic out loud. They are grading the estimate, not just the boxes." },
        { name: "Googliness & leadership", what: "Collaboration, ambiguity, and how you treat people who disagree with you.", prep: "Concrete stories, not philosophy." }
      ],
      hiringFocus: "Graph and string algorithms, complexity rigour, distributed storage, consistent hashing, and back-of-envelope sizing.",
      signals: [
        "Correct complexity stated without being asked.",
        "Edge cases found before the interviewer names them.",
        "A design that survives one node dying."
      ],
      topicMix: { "DSA": 42, "System Design": 26, "OS & Concurrency": 10, "DBMS": 10, "Behavioural": 12 }
    },
    {
      id: "microsoft",
      name: "Microsoft",
      group: "bigtech",
      domain: "Big Tech & Cloud",
      col: "#00a4ef",
      badge: "Azure, Windows & Copilot",
      tagline: "A humane loop with real depth on cloud architecture and clean code.",
      difficulty: "medium",
      loop: "OA + 3–4 rounds including the As-Appropriate round",
      rounds: [
        { name: "Online assessment", what: "Two or three timed problems.", prep: "Practise under a clock; partial credit is real here." },
        { name: "Problem solving", what: "Algorithms with an emphasis on clarity and testing.", prep: "Write the test cases first. It reads very well." },
        { name: "Design", what: "A service on Azure: scaling, caching, resilience.", prep: "Know retries, idempotency, and the difference between them." },
        { name: "As-Appropriate (AA)", what: "A senior interviewer with a veto, mixing technical and behavioural.", prep: "Be ready to defend a past technical decision you now think was wrong." }
      ],
      hiringFocus: "Clean modular design, cloud architecture, distributed caching, C#/.NET or Python fluency, and enterprise resilience.",
      signals: [
        "Readable code with names that explain themselves.",
        "Do you handle the failure path, or only the happy path?",
        "Can you disagree with an interviewer politely and correctly?"
      ],
      topicMix: { "DSA": 34, "System Design": 24, "OOP & Code Quality": 16, "DBMS": 12, "Behavioural": 14 }
    },
    {
      id: "amazon",
      name: "Amazon / AWS",
      group: "bigtech",
      domain: "Big Tech & Cloud",
      col: "#ff9900",
      badge: "AWS & high-scale retail",
      tagline: "Half the loop is technical. The other half is Leadership Principles, and it is not a formality.",
      difficulty: "hard",
      loop: "OA + 4–5 onsite, one of which is the Bar Raiser",
      rounds: [
        { name: "Online assessment", what: "Two coding problems plus a work-style survey.", prep: "The survey is scored. Answer consistently, not aspirationally." },
        { name: "Coding × 2", what: "Algorithms, always paired with two Leadership Principle stories.", prep: "Budget time: roughly 20 minutes of code, 20 of behavioural, per round." },
        { name: "System design", what: "A distributed service with a hard consistency or throughput constraint.", prep: "Know DynamoDB's model well enough to justify or reject it." },
        { name: "Bar Raiser", what: "An interviewer from outside the team with veto power.", prep: "Depth on one story until it hurts. They will keep asking 'and then what'." }
      ],
      hiringFocus: "Distributed systems, queueing, idempotency, DynamoDB data modelling, and sixteen Leadership Principles told as STAR stories.",
      signals: [
        "Stories in STAR form with a measurable result and your own contribution clear.",
        "Ownership: did you fix the cause, or just the symptom?",
        "Can you dive deep two or three levels below your usual altitude?"
      ],
      topicMix: { "DSA": 30, "System Design": 24, "Behavioural": 26, "DBMS": 10, "OS & Concurrency": 10 }
    },
    {
      id: "apple",
      name: "Apple",
      group: "bigtech",
      domain: "Consumer hardware & OS",
      col: "#555555",
      badge: "iOS, macOS & Apple silicon",
      tagline: "Team-specific loops, low-level depth, and a strong bias toward doing it on-device.",
      difficulty: "hard",
      loop: "Screen + 4–6 rounds, heavily team-dependent",
      rounds: [
        { name: "Technical screen", what: "C, C++, Swift or Objective-C depending on team.", prep: "Memory ownership. Every Apple loop returns to it." },
        { name: "OS internals", what: "Virtual memory, scheduling, ARC, locking.", prep: "Know what a page fault costs and what ARC does at compile time." },
        { name: "Domain round", what: "On-device ML, graphics, or embedded depending on the org.", prep: "Quantisation and battery/thermal budgets if the team is ML." },
        { name: "Team match", what: "Cross-functional, often with a designer or PM present.", prep: "Explain something technical to a non-engineer without dumbing it down." }
      ],
      hiringFocus: "Low-level memory behaviour, POSIX concurrency, on-device inference budgets, and privacy-preserving design.",
      signals: [
        "Do you know where every allocation goes?",
        "Can you reason about power and thermals, not only speed?",
        "Do you care about the user-visible detail?"
      ],
      topicMix: { "OS & Concurrency": 32, "DSA": 26, "OOP & Code Quality": 16, "ML & Statistics": 12, "Behavioural": 14 }
    },
    {
      id: "netflix",
      name: "Netflix",
      group: "bigtech",
      domain: "Streaming & media tech",
      col: "#e50914",
      badge: "Resilience & streaming scale",
      tagline: "A senior-only bar. They hire people who have already run the thing you are describing.",
      difficulty: "staff",
      loop: "3–5 deep rounds, culture-weighted throughout",
      rounds: [
        { name: "Recruiter & culture", what: "Real screening on judgement and independence, not a formality.", prep: "Read the culture memo and have honest reactions to it." },
        { name: "Technical deep dive", what: "Your own past architecture, interrogated hard.", prep: "Know your own numbers: traffic, latency, cost, incident count." },
        { name: "Resilient systems", what: "Failure injection, degradation, and blast-radius control.", prep: "Circuit breakers, bulkheads, and what you shed first under load." },
        { name: "Senior culture bar", what: "Context over control: can you operate without being managed?", prep: "Show a decision you made alone and owned the outcome of." }
      ],
      hiringFocus: "Chaos engineering, graceful degradation, streaming pipelines, personalisation, and senior autonomy.",
      signals: [
        "Do you design for the failure you have actually seen?",
        "Can you name what you would drop first when the system is overloaded?",
        "Do you seek feedback that costs you something?"
      ],
      topicMix: { "System Design": 40, "Behavioural": 22, "DSA": 14, "ML & Statistics": 12, "Networks": 12 }
    },

    /* ---------------- Data, systems & robotics ---------------- */
    {
      id: "databricks",
      name: "Databricks",
      group: "data",
      domain: "Data & lakehouse",
      col: "#ff3621",
      badge: "Spark & lakehouse",
      tagline: "Query engines, distributed execution, and the file format underneath it all.",
      difficulty: "hard",
      loop: "Screen + 4 rounds with a strong storage bias",
      rounds: [
        { name: "Coding", what: "Data-shaped algorithms: merging, grouping, external sorting.", prep: "Practise problems where the data does not fit in memory." },
        { name: "Distributed systems", what: "Shuffles, skew, spill, and fault recovery.", prep: "Know why a join skews and the three ways to fix it." },
        { name: "Design", what: "A query engine, a metadata layer, or a vector index.", prep: "Columnar layout, predicate pushdown, and statistics-driven pruning." },
        { name: "Hiring manager", what: "Depth on your past work and how you handle ambiguity.", prep: "Bring a performance investigation you drove end to end." }
      ],
      hiringFocus: "Spark execution, Delta Lake transaction logs, columnar formats, query optimisation, and shuffle behaviour.",
      signals: [
        "Do you think in terms of data movement, not just computation?",
        "Can you read a query plan and say what is wrong with it?",
        "Do you know what breaks when a partition is 100× the others?"
      ],
      topicMix: { "System Design": 30, "DBMS": 28, "DSA": 20, "OS & Concurrency": 12, "Behavioural": 10 }
    },
    {
      id: "snowflake",
      name: "Snowflake",
      group: "data",
      domain: "Data & cloud warehousing",
      col: "#29b5e8",
      badge: "Cloud data warehouse",
      tagline: "Storage and compute pulled apart, and everything that follows from that decision.",
      difficulty: "hard",
      loop: "Screen + 4 rounds, C++ heavy for engine roles",
      rounds: [
        { name: "Phone screen", what: "A solid medium-to-hard algorithm problem.", prep: "Clean code, stated complexity." },
        { name: "Core C++ / data structures", what: "Memory layout, cache behaviour, and custom containers.", prep: "Know why an array of structs and a struct of arrays perform differently." },
        { name: "Database internals", what: "Concurrency control, pruning, vectorised execution.", prep: "MVCC and snapshot isolation, precisely." },
        { name: "Architecture", what: "Multi-tenant elasticity and metadata services.", prep: "What separating storage from compute buys and what it costs." }
      ],
      hiringFocus: "Storage/compute separation, micro-partition pruning, vectorised execution, MVCC, and multi-tenant isolation.",
      signals: [
        "Cache-aware thinking, not just asymptotic thinking.",
        "Precision about isolation levels and the anomalies they permit.",
        "Can you explain elasticity without hand-waving the metadata problem?"
      ],
      topicMix: { "DBMS": 34, "DSA": 24, "OS & Concurrency": 18, "System Design": 14, "Behavioural": 10 }
    },
    {
      id: "uber",
      name: "Uber",
      group: "data",
      domain: "Mobility & real-time systems",
      col: "#111111",
      badge: "Geospatial & dispatch",
      tagline: "A real-time marketplace where being ten seconds late is the same as being wrong.",
      difficulty: "hard",
      loop: "Screen + 4 rounds including a domain design round",
      rounds: [
        { name: "Coding", what: "Graphs and grids, often with a geospatial flavour.", prep: "Dijkstra, A*, and k-nearest on a grid." },
        { name: "Real-time architecture", what: "Matching, streaming state, and exactly-once-ish semantics.", prep: "Know what Kafka does and does not guarantee." },
        { name: "Concurrency & APIs", what: "High-throughput services and shared mutable state.", prep: "Idempotency keys and optimistic concurrency." },
        { name: "Bar raiser", what: "Judgement under conflicting constraints.", prep: "A time you traded correctness for latency, and why it was right." }
      ],
      hiringFocus: "Spatial indexing, stream processing, matching algorithms, state machines, and low-latency APIs.",
      signals: [
        "Can you keep a distributed state machine consistent under retries?",
        "Do you know the cost of a geospatial query at scale?",
        "Do you design for the driver and rider both seeing the truth?"
      ],
      topicMix: { "System Design": 32, "DSA": 28, "OS & Concurrency": 14, "DBMS": 12, "Behavioural": 14 }
    },
    {
      id: "tesla",
      name: "Tesla",
      group: "data",
      domain: "Autopilot AI & embedded",
      col: "#e82127",
      badge: "Autonomy & vision",
      tagline: "Perception on a hard deadline, on hardware you cannot upgrade.",
      difficulty: "hard",
      loop: "3–5 rounds, fast turnaround, very practical",
      rounds: [
        { name: "C++ / Python screen", what: "Performance-sensitive code, often image or tensor manipulation.", prep: "Know your language's allocation behaviour cold." },
        { name: "Vision & inference", what: "Detection, tracking, calibration, and real-time budgets.", prep: "Non-max suppression, IoU, and multi-object tracking." },
        { name: "Embedded systems", what: "Linux, real-time constraints, sensor buses.", prep: "What makes a system hard real-time rather than merely fast." },
        { name: "Lead interview", what: "Ownership and speed of iteration.", prep: "Show something you shipped quickly and then hardened." }
      ],
      hiringFocus: "Real-time computer vision, multi-camera fusion, deterministic latency, and embedded C++.",
      signals: [
        "Do you budget latency explicitly, per stage?",
        "Can you debug something that only fails one time in ten thousand?",
        "Do you ship?"
      ],
      topicMix: { "ML & Statistics": 30, "OS & Concurrency": 24, "DSA": 22, "System Design": 14, "Behavioural": 10 }
    },
    {
      id: "palantir",
      name: "Palantir",
      group: "data",
      domain: "Enterprise AI & defence",
      col: "#101820",
      badge: "Foundry, Gotham & AIP",
      tagline: "Decomposition under pressure. They watch how you think more than what you know.",
      difficulty: "hard",
      loop: "HackerRank + 3–4 rounds including a scenario round",
      rounds: [
        { name: "Coding screen", what: "Timed, practical, usually data-manipulation shaped.", prep: "Speed on parsing and aggregation." },
        { name: "Decomposition", what: "A deliberately underspecified problem. Asking is part of the answer.", prep: "Practise stating assumptions out loud before coding." },
        { name: "Design & integration", what: "Modelling messy real-world data into a coherent schema.", prep: "Entity resolution and access control at the property level." },
        { name: "The scenario round", what: "A pressured, ambiguous situation with no clean answer.", prep: "Stay calm, restate the problem, name the trade-off." }
      ],
      hiringFocus: "Data modelling, ontology design, fine-grained authorisation, and reasoning aloud through ambiguity.",
      signals: [
        "Do you ask clarifying questions before assuming?",
        "Can you name what you are choosing not to solve?",
        "Do you stay coherent when the ground shifts?"
      ],
      topicMix: { "System Design": 30, "DSA": 24, "DBMS": 18, "OOP & Code Quality": 14, "Behavioural": 14 }
    },

    /* ---------------- Enterprise, social & global ---------------- */
    {
      id: "bytedance",
      name: "ByteDance / TikTok",
      group: "enterprise",
      domain: "High-concurrency social tech",
      col: "#3370ff",
      badge: "Recommendation at scale",
      tagline: "Genuinely hard algorithm rounds, then fan-out numbers most systems never see.",
      difficulty: "hard",
      loop: "3–4 technical rounds, algorithm-heavy throughout",
      rounds: [
        { name: "Algorithms", what: "Harder than most: expect a genuine hard, not a dressed-up medium.", prep: "Dynamic programming and advanced graph work." },
        { name: "Concurrency & media", what: "Sockets, buffering, and streaming protocols.", prep: "Know epoll versus threads and why it matters at a million connections." },
        { name: "Feed system design", what: "Fan-out, ranking, and caching for a billion users.", prep: "Push versus pull fan-out, and the hybrid everyone actually uses." },
        { name: "Director round", what: "Depth, ambition, and speed.", prep: "Be ready to go deeper than you expect on anything you claim." }
      ],
      hiringFocus: "Advanced algorithms, recommendation serving, socket multiplexing, caching, and video delivery.",
      signals: [
        "Raw algorithmic strength under time pressure.",
        "Can you reason about a cache hit rate you have not measured?",
        "Do you know what breaks at a million concurrent connections?"
      ],
      topicMix: { "DSA": 40, "System Design": 26, "OS & Concurrency": 16, "ML & Statistics": 10, "Behavioural": 8 }
    },
    {
      id: "adobe",
      name: "Adobe",
      group: "enterprise",
      domain: "Creative tech & generative AI",
      col: "#ed2224",
      badge: "Firefly, Photoshop & PDF",
      tagline: "Graphics maths, document formats, and a generative stack with commercial constraints.",
      difficulty: "medium",
      loop: "OA + 3–4 rounds",
      rounds: [
        { name: "Online assessment", what: "Standard timed algorithm problems.", prep: "Arrays, strings, and a graph." },
        { name: "Algorithms & geometry", what: "2D geometry shows up more here than anywhere else.", prep: "Line intersection, bounding boxes, transforms." },
        { name: "Design & cloud APIs", what: "Document sync, versioning, conflict resolution.", prep: "Delta sync and how to merge two edits to the same object." },
        { name: "Hiring manager", what: "Craft, collaboration, and product sense.", prep: "Have a view on what makes a tool feel good to use." }
      ],
      hiringFocus: "Geometry and rasterisation, diffusion models, document synchronisation, and browser-side performance.",
      signals: [
        "Comfort with coordinate maths.",
        "Do you think about the artist's workflow, not just the pixels?",
        "Can you make something fast enough to feel instant?"
      ],
      topicMix: { "DSA": 34, "System Design": 20, "ML & Statistics": 16, "OOP & Code Quality": 16, "Behavioural": 14 }
    },
    {
      id: "oracle",
      name: "Oracle",
      group: "enterprise",
      domain: "Databases & enterprise cloud",
      col: "#c74634",
      badge: "OCI & database engines",
      tagline: "The most database-internals-heavy loop on this list, by a wide margin.",
      difficulty: "medium",
      loop: "OA + 3–4 rounds",
      rounds: [
        { name: "Coding screen", what: "Solid mediums with an emphasis on correctness.", prep: "Careful edge-case handling reads very well here." },
        { name: "OS & algorithms", what: "Concurrency, deadlock, and tree structures.", prep: "B-trees by hand, including the split." },
        { name: "Database internals", what: "Logging, recovery, isolation, and indexing.", prep: "Write-ahead logging and ARIES-style recovery." },
        { name: "Director round", what: "Depth and long-term thinking.", prep: "Show that you can maintain something for a decade." }
      ],
      hiringFocus: "B-tree and LSM indexing, write-ahead logging, MVCC, recovery, and high-availability clustering.",
      signals: [
        "Precision about durability guarantees.",
        "Can you explain what happens if the machine loses power mid-commit?",
        "Do you understand indexes well enough to know when not to add one?"
      ],
      topicMix: { "DBMS": 36, "DSA": 24, "OS & Concurrency": 20, "System Design": 10, "Behavioural": 10 }
    },
    {
      id: "salesforce",
      name: "Salesforce",
      group: "enterprise",
      domain: "Enterprise SaaS & agents",
      col: "#00a1e0",
      badge: "CRM & Agentforce",
      tagline: "Multi-tenancy as the central engineering constraint, with agents layered on top.",
      difficulty: "medium",
      loop: "Screen + 3–4 rounds",
      rounds: [
        { name: "Coding", what: "Practical mediums, well-structured code expected.", prep: "Name things well. It is genuinely graded." },
        { name: "Object-oriented design", what: "A small system modelled properly, with extension in mind.", prep: "Strategy, factory, observer — and when not to use them." },
        { name: "Multi-tenant design", what: "Isolation, noisy neighbours, and per-tenant limits.", prep: "Row-level security and shared-schema trade-offs." },
        { name: "Values & manager", what: "Trust, customer success, collaboration.", prep: "A story where you protected a customer from your own team's mistake." }
      ],
      hiringFocus: "Multi-tenant isolation, OAuth/SAML identity, async workers, and agent orchestration over enterprise data.",
      signals: [
        "Design that survives one tenant behaving badly.",
        "Clean abstractions without over-engineering.",
        "Do you think about the admin, not just the developer?"
      ],
      topicMix: { "OOP & Code Quality": 28, "System Design": 24, "DSA": 20, "DBMS": 14, "Behavioural": 14 }
    },
    {
      id: "flipkart",
      name: "Flipkart",
      group: "enterprise",
      domain: "High-scale e-commerce",
      col: "#2874f0",
      badge: "Flash sales & supply chain",
      tagline: "The machine-coding round is the whole interview. Everything else is confirmation.",
      difficulty: "medium",
      loop: "Machine coding + problem solving + HLD + manager",
      rounds: [
        { name: "Machine coding", what: "90 minutes, working code, in-memory, extensible. No frameworks.", prep: "Practise building a complete small system in 90 minutes, repeatedly." },
        { name: "Problem solving", what: "Algorithms with a practical bent.", prep: "Standard mediums, clean implementation." },
        { name: "High-level design", what: "Flash sales, inventory, and payments under load.", prep: "Overselling is the classic question. Know three ways to prevent it." },
        { name: "Engineering manager", what: "Ownership and prioritisation.", prep: "A story about cutting scope correctly." }
      ],
      hiringFocus: "Machine coding under time pressure, distributed transactions, inventory reservation, and rate limiting.",
      signals: [
        "Working code at the end of 90 minutes beats elegant unfinished code.",
        "Separation of concerns you can point at.",
        "Do you handle concurrency in the reservation path?"
      ],
      topicMix: { "OOP & Code Quality": 32, "System Design": 26, "DSA": 22, "DBMS": 10, "Behavioural": 10 }
    },
    {
      id: "tcs",
      name: "TCS & global IT services",
      group: "enterprise",
      domain: "Global IT services",
      col: "#1a365d",
      badge: "Prime / Digital hiring",
      tagline: "Foundations, tested directly. Breadth matters more than depth here.",
      difficulty: "easy",
      loop: "Aptitude + coding, then technical and HR rounds",
      rounds: [
        { name: "Online assessment", what: "Aptitude, verbal reasoning, and basic coding.", prep: "Speed arithmetic matters more than you expect." },
        { name: "Technical interview", what: "OOP, DBMS, OS, and one language in depth.", prep: "Be able to define every term you put on your resume." },
        { name: "Problem solving", what: "Straightforward programs, cleanly written.", prep: "Strings, arrays, and basic recursion." },
        { name: "HR & managerial", what: "Communication, relocation, and motivation.", prep: "Know why this company, specifically." }
      ],
      hiringFocus: "OOP fundamentals, normalisation, SQL, operating-system basics, and clear communication.",
      signals: [
        "Can you define a term precisely rather than gesture at it?",
        "Is your SQL correct on the first attempt?",
        "Do you communicate clearly in English under mild pressure?"
      ],
      topicMix: { "OOP & Code Quality": 26, "DBMS": 24, "DSA": 22, "OS & Concurrency": 16, "Behavioural": 12 }
    }
  ];

  TD.companyById = {};
  TD.interviewCompanies.forEach(function (c) { TD.companyById[c.id] = c; });

  /* ---------------- question registry ---------------- */

  TD.interviewQuestions = [];
  TD.questionsById = {};
  TD.questionsByCompany = {};
  TD.interviewCompanies.forEach(function (c) { TD.questionsByCompany[c.id] = []; });

  /* The AI-engineer track is a curated cross-company view rather than a
     company, so it gets its own bucket fed by the `aiTrack` flag. */
  TD.aiEngineerQuestions = [];

  var seq = 0;

  /* Register a batch of questions. `companies` may be "*" to mean every
     company in the registry — used for genuine fundamentals that no loop
     skips — or a list of company ids. Unknown ids fail loudly in the console
     rather than silently vanishing from a company page. */
  TD.addQuestions = function (batch) {
    batch.forEach(function (q) {
      seq++;
      q.id = q.id || ("q" + seq);

      if (TD.questionsById[q.id]) {
        console.warn("[interviews] duplicate question id:", q.id);
        return;
      }

      if (!TD.ivTopicById[q.topic]) {
        console.warn("[interviews] unknown topic '" + q.topic + "' on", q.id);
      }
      if (TD.ivLevels.indexOf(q.level) === -1) {
        console.warn("[interviews] unknown level '" + q.level + "' on", q.id);
      }

      var ids = q.companies === "*"
        ? TD.interviewCompanies.map(function (c) { return c.id; })
        : (q.companies || []);

      q.companyIds = ids;
      TD.interviewQuestions.push(q);
      TD.questionsById[q.id] = q;

      ids.forEach(function (cid) {
        if (!TD.questionsByCompany[cid]) {
          console.warn("[interviews] question", q.id, "names unknown company", cid);
          return;
        }
        TD.questionsByCompany[cid].push(q);
      });

      if (q.aiTrack) TD.aiEngineerQuestions.push(q);
    });
  };

  /* Sort a company's questions into a sensible reading order: easiest first
     within a topic, topics in taxonomy order. A bank you can read top to
     bottom is worth more than a bank you have to filter to use. */
  TD.finaliseInterviewBank = function () {
    var topicRank = {};
    TD.ivTopics.forEach(function (t, i) { topicRank[t.id] = i; });

    function order(a, b) {
      var ta = topicRank[a.topic] === undefined ? 99 : topicRank[a.topic];
      var tb = topicRank[b.topic] === undefined ? 99 : topicRank[b.topic];
      if (ta !== tb) return ta - tb;
      var la = TD.ivLevels.indexOf(a.level);
      var lb = TD.ivLevels.indexOf(b.level);
      if (la !== lb) return la - lb;
      return 0;
    }

    Object.keys(TD.questionsByCompany).forEach(function (cid) {
      TD.questionsByCompany[cid].sort(order);
    });
    TD.aiEngineerQuestions.sort(order);
    TD.interviewQuestions.sort(order);

    /* Counts are derived, never authored, so a company card can never claim a
       number the bank cannot show. */
    TD.interviewCompanies.forEach(function (c) {
      c.qCount = TD.questionsByCompany[c.id].length;
    });
  };
})(window.TD = window.TD || {});
