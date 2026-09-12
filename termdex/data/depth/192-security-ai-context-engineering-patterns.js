(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "sanitisation",
      why: {
        before: "Applications accepted user input and passed it directly to databases, HTML renderers, and system shells, trusting that users would only type harmless, well-formed text.",
        problem: "Malicious users entered script tags (`<script>`), SQL commands, or terminal escape codes, hijacking administrator sessions via Cross-Site Scripting (XSS) and executing remote code.",
        shift: "Sanitisation cleanses untrusted inputs by modifying, stripping, or neutralizing dangerous payload sequences, ensuring data conforms to strict safety invariants before processing or rendering."
      },
      num: {
        t: "Sanitisation Domains, Engine Algorithms, and Defense Boundaries",
        h: ["Sanitisation Domain", "Target Threat Addressed", "Engine / Mechanism", "Action on Dangerous Payload", "Primary Security Boundary"],
        r: [
          ["HTML / DOM Sanitisation", "Cross-Site Scripting (XSS / Stored XSS)", "DOMPurify / sanitize-html (HTML5 AST walk)", "Strips dangerous tags (<script>, <iframe>, onerror)", "Client-side rendering before DOM insertion"],
          ["Log Sanitisation / PII Masking", "Credential / Privacy leakage in log streams", "Regex maskers + Named Entity Recognition (NER)", "Redacts credit cards, passwords, SSNs with [REDACTED]", "Application logger formatting pipeline"],
          ["Prompt Sanitisation (LLM)", "Direct / Indirect Prompt Injection", "Delimiting boundaries + Guardrail Classifiers (Llama-Guard)", "Escapes delimiter tokens (<|im_start|>, triple quotes)", "Pre-LLM inference request pipeline"],
          ["Path / Filename Sanitisation", "Path Traversal (CWE-22 / Arbitrary file read)", "path.basename() + regex alphanumeric allowlist", "Strips ../ sequences, slashes, and null bytes", "File upload and storage handler"],
          ["Database Input (Validation vs Sanitize)", "SQL Injection (SQLi)", "Parameterized Prepared Statements", "Passes input strictly as data via wire protocol", "Database driver wire protocol"]
        ],
        n: "Sanitisation operates as a filtering transformation $f_{\\text{clean}}: \\mathcal{X} \\to \\mathcal{X}_{\\text{safe}}$, where the output is mathematically guaranteed to belong to a harmless subset of the domain. In HTML sanitisation (e.g., `DOMPurify`), the engine does not use fragile regular expressions; instead, it parses the input into an in-memory Document Object Model (DOM) tree within an inert implementation (`document.implementation.createHTMLDocument('')`). It recursively walks the DOM tree against an explicit allowlist of tags and attributes, stripping forbidden nodes (e.g., `<script>`, `<svg onload=...>`) and neutralizing unsafe URI schemes (e.g., `javascript:alert(1)`). In LLM architectures, sanitisation neutralizes special tokenizer control sequences, preventing untrusted user prompts from spoofing system instruction boundaries."
      },
      miss: [
        {
          w: "Writing a simple regular expression like `text.replace(/<script>/g, '')` is sufficient for HTML sanitisation.",
          r: "Naive regexes are easily bypassed: attackers send `<script src='...'>`, `<SCRIPT>`, `<img onerror=alert(1)>`, or nested tags like `<scr<script>ipt>`, which regex replacements assemble into working attack payloads."
        },
        {
          w: "Input validation and input sanitisation are the exact same thing.",
          r: "Validation is an all-or-nothing check (it rejects invalid data with an error); sanitisation actively mutates and cleans the data so that it becomes safe to process without rejecting it."
        },
        {
          w: "Sanitising user inputs on the client side in React/Vue protects backend databases.",
          r: "Client-side sanitisation is easily bypassed by sending raw HTTP requests via cURL or Postman; backend servers must independently validate and sanitize 100% of incoming data."
        },
        {
          w: "Sanitising HTML is better than using standard parameterized templates.",
          r: "Allowing users to submit rich HTML and sanitising it is high-risk; wherever possible, applications should accept structured plain text or Markdown, eliminating the need to parse raw HTML."
        }
      ],
      trade: {
        buys: [
          "Enables safe rich-text user experiences: allow users to post formatted comments and blogs without XSS.",
          "Protects enterprise privacy by automatically redacting sensitive customer PII from log aggregators.",
          "Defense-in-depth: neutralizes malicious payloads even if downstream rendering components have bugs.",
          "Prevents path traversal vulnerabilities by stripping dangerous directory climbing sequences."
        ],
        costs: [
          "Data mutation hazard: aggressive sanitisation can accidentally strip valid user text, math formulas, or code.",
          "Parsing CPU overhead: parsing large HTML documents into in-memory DOM trees consumes server compute.",
          "Security cat-and-mouse game: new browser parsing quirks (mXSS / Mutation XSS) require updating sanitizers.",
          "Complexity of maintaining context-specific allowlists for complex enterprise rich-text applications."
        ],
        avoid: [
          "Writing custom, hand-rolled regular expressions to sanitize untrusted HTML strings.",
          "Sanitising user inputs before saving them to SQL databases (store raw data, parameterize queries).",
          "Permitting user-uploaded SVG images to be rendered inline without running them through DOMPurify.",
          "Logging raw HTTP request bodies that contain user passwords or payment tokens without PII masking."
        ]
      }
    },
    {
      slug: "context-length",
      why: {
        before: "Early neural network language models processed only 512 or 2,048 tokens at a time, completely incapable of ingesting whole books, codebases, or multi-turn conversational histories.",
        problem: "Small context windows forced aggressive document truncation: models forgot conversations after five messages, could not analyze full legal contracts, and failed on repository-wide coding tasks.",
        shift: "Architectural breakthroughs (FlashAttention, RoPE position interpolation, YaRN) expanded context lengths from 2,048 tokens to over 1,000,000 tokens, enabling whole-book and multi-file reasoning."
      },
      num: {
        t: "Context Window Milestones, Attention Scaling, and Memory Invariants",
        h: ["Model Architecture / Generation", "Context Length ($L_{\\text{ctx}}$)", "Positional Encoding Primitive", "KV-Cache VRAM per Sequence", "Attention Complexity"],
        r: [
          ["GPT-3 (2020 Baseline)", "2,048 tokens", "Absolute Learnable Positional Embeddings", "~0.5 GB (FP16)", "Standard $O(N^2)$ quadratic compute & memory"],
          ["GPT-4 (2023 Launch)", "8,192 / 32,768 tokens", "Rotary Position Embeddings (RoPE)", "~2.0 - 8.0 GB", "FlashAttention-2 memory optimization ($O(N)$ memory)"],
          ["Llama-3.1 (2024 Open Standard)", "128,000 tokens", "RoPE with frequency scaling (Base = 500,000)", "~16.0 GB (GQA / FP8 KV-cache)", "Chunked prefill + Grouped-Query Attention (GQA)"],
          ["Claude 3.5 / Gemini 1.5 Pro", "200,000 - 2,000,000+ tokens", "Linear Attention / Sparse Recurrent Hybrids", "~32.0 - 120.0+ GB", "Hardware-accelerated Ring Attention across TPU/GPU clusters"],
          ["Lost in the Middle Trap", "Degradation at middle depths", "Attention entropy dispersion over long contexts", "N/A", "Needle In A Haystack (NIAH) retrieval degradation"]
        ],
        n: "Context length ($L_{\\text{ctx}}$) represents the maximum token sequence length $N$ that a transformer model can ingest in a single forward pass. Standard multi-head self-attention computes an $N \\times N$ attention matrix: $A = \\text{Softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$, exhibiting quadratic time and memory complexity: $O(N^2)$. FlashAttention eliminates quadratic memory by computing attention in SRAM tiles without materializing the $N \\times N$ matrix to HBM. Extending context beyond pre-training limits utilizes Rotary Position Embedding (RoPE) frequency scaling (YaRN / LongLoRA): scaling the base wavelength $\\theta_i = b^{-2(i-1)/d}$ to compress higher token distances into trained frequency bands. Crucially, empirical research (Liu et al., 'Lost in the Middle') demonstrates that retrieval performance follows a U-shaped curve: information placed at the absolute start or end of a 128k context is retrieved with $99\\%$ accuracy, while information buried in the middle drops significantly."
      },
      miss: [
        {
          w: "A model with a 1,000,000 token context window retrieves every single fact from a document with 100% accuracy.",
          r: "Massive context windows suffer from attention dispersion and 'Lost in the Middle' degradation; models frequently miss nuanced facts buried in the middle of giant context dumps (Needle-in-a-Haystack failures)."
        },
        {
          w: "Context length only applies to the user's input prompt and does not include the output response.",
          r: "Context length is the total combined budget: $L_{\\text{prompt}} + L_{\\text{output}} \\le L_{\\text{context}}$; an input prompt consuming 127,500 tokens in a 128k model leaves only 500 tokens for the generated response."
        },
        {
          w: "Increasing context window size has zero impact on GPU inference memory requirements.",
          r: "The Key-Value (KV) cache grows linearly with context length; serving 128k context requests consumes tens of gigabytes of VRAM per user, drastically reducing server concurrency."
        },
        {
          w: "Having a large context window completely eliminates the need for Retrieval-Augmented Generation (RAG).",
          r: "Dumping 500,000 tokens into every prompt is slow (high TTFT), prohibitively expensive ($5-$10 per query), and prone to hallucinations; targeted RAG retrieval remains vastly cheaper and more accurate."
        }
      ],
      trade: {
        buys: [
          "Enables analyzing entire codebases, multi-hundred-page legal contracts, and financial reports in one prompt.",
          "Long multi-turn conversation memory without aggressively pruning or summarizing previous chat history.",
          "Massive few-shot learning: pass dozens of comprehensive examples directly into the prompt context.",
          "Simplifies document QA architectures by eliminating complex vector chunking for moderately sized files."
        ],
        costs: [
          "High Time To First Token (TTFT): processing 100k prompt tokens takes seconds of GPU prefill compute.",
          "Astronomical API costs: processing hundreds of thousands of input tokens per query inflates monthly bills.",
          "VRAM saturation: long-context KV caches consume massive GPU memory, limiting concurrent serving throughput.",
          "Attention degradation: susceptibility to the 'Lost in the Middle' phenomenon on subtle queries."
        ],
        avoid: [
          "Dumping massive 100k token documents into prompts when a targeted RAG search retrieves the exact paragraph.",
          "Burying critical instructions or answers in the middle of a massive context dump (place instructions at the end).",
          "Assuming high benchmark Needle-in-a-Haystack scores guarantee complex multi-step reasoning over long contexts.",
          "Failing to implement Prefix / Prompt Caching when repeatedly sending identical large context documents."
        ]
      }
    },
    {
      slug: "token-limit-and-truncation",
      why: {
        before: "Applications forwarded arbitrary user documents, conversation histories, and database dumps into LLM API requests without calculating token counts beforehand.",
        problem: "Requests abruptly crashed with fatal `ContextWindowExceeded` HTTP 400 errors, customer transactions failed mid-flight, and naive string truncations cut words in half, corrupting Unicode bytes.",
        shift: "Disciplined token budget management calculates exact token consumption before dispatch, applying structured truncation strategies (sliding window, middle-out, semantic pruning) to fit context bounds."
      },
      num: {
        t: "Context Truncation Strategies, Information Loss, and Algorithmic Profiles",
        h: ["Truncation Strategy", "Data Pruned / Dropped", "Information Preserved", "Algorithmic Implementation", "Ideal Domain Scenario"],
        r: [
          ["Sliding Window (FIFO Head Drop)", "Oldest conversation turns dropped", "Most recent dialogue turns intact", "Deque array slicing on message history", "Multi-turn interactive customer chat assistants"],
          ["Middle-Out Truncation", "Middle of document / chat history pruned", "System prompt, initial context, and latest query", "Keeps head and tail: tokens[:K] + tokens[-K:]", "Long-form document summarization and legal contracts"],
          ["Summarization Compression", "Old turns summarized into compact paragraph", "High-level semantic context preserved", "Asynchronous background LLM summarization call", "Long-running AI companion / executive assistant memory"],
          ["Semantic Token Pruning", "Low-entropy / redundant filler tokens dropped", "High-information tokens preserved", "Attention score sorting / Embedding similarity", "Massive RAG context stuffing optimization"],
          ["Hard String Slice (Anti-Pattern)", "Naive slice text[:1000]", "Corrupts trailing Unicode characters & words", "str.slice() without tokenizer", "Fragile prototypes (Breaks token boundaries)"]
        ],
        n: "Token limit management enforces the physical invariant of transformer context capacity: $N_{\\text{system}} + N_{\\text{history}} + N_{\\text{rag}} + N_{\\text{query}} + N_{\\text{max\\_gen}} \\le L_{\\text{context}}$. Because tokenization is non-linear—subword BPE (Byte Pair Encoding) tokenizes text differently based on surrounding characters—estimating tokens via character counts (e.g., $\\text{len}(text) / 4$) produces a $\\pm 20\\%$ error margin, risking unexpected API rejections. Exact management requires local offline token counting via BPE libraries (e.g., `tiktoken` in Python/Rust). When $N_{\\text{total}} > L_{\\text{budget}}$, Middle-Out Truncation preserves the highest-attention zones: keeping the initial $k_1$ tokens (system prompt and problem setup) and trailing $k_2$ tokens (immediate question and constraints), discarding the low-attention middle $M = [k_1, N - k_2]$."
      },
      miss: [
        {
          w: "You can reliably estimate token counts by dividing character count by 4.",
          r: "The 4-character rule of thumb fails completely on code (heavy indentation creates 1 token per space), foreign languages (Asian characters use 2-3 tokens per character), and JSON data; exact tokenizers (tiktoken) must be used."
        },
        {
          w: "Truncating a string with `text.slice(0, 4000)` safely truncates tokens.",
          r: "Slicing raw characters can sever a 4-byte UTF-8 emoji in half, producing invalid Unicode replacement characters (``), and splits words mid-syllable, corrupting tokenizer subword embeddings."
        },
        {
          w: "When a conversation exceeds the context limit, dropping the oldest messages is always the best solution.",
          r: "Dropping old messages can erase critical context (e.g., the user's initial instructions or system constraints); middle-out truncation or hierarchical summary compaction is vastly more resilient."
        },
        {
          w: "Cloud LLM APIs will automatically truncate oversized prompts for you.",
          r: "Cloud APIs do not truncate prompts; if your request exceeds the model's context window by a single token, the API rejects the request with an immediate fatal HTTP 400 error."
        }
      ],
      trade: {
        buys: [
          "Guarantees 100% API request reliability: completely eliminates fatal `ContextWindowExceeded` 400 crashes.",
          "Predictable cost control: bounds maximum token expenditure per user transaction.",
          "Preserves critical conversational flow: keeps recent context alive through sliding windows.",
          "Optimizes response latency by avoiding unnecessary massive context dumps."
        ],
        costs: [
          "Information loss: truncated history can cause the model to forget user constraints stated earlier.",
          "Computational overhead of executing local BPE tokenization (`tiktoken`) before every API request.",
          "Complexity of managing multi-tiered message compaction and sliding window buffers.",
          "Requires custom application logic to summarize or paginate large ingested documents."
        ],
        avoid: [
          "Dispatching API requests without calculating token budgets using exact local tokenizer libraries.",
          "Truncating text using raw character string slicing instead of token-aware boundaries.",
          "Dropping the system message when pruning context to fit token ceilings.",
          "Allowing conversation histories to grow indefinitely in memory without sliding window caps."
        ]
      }
    },
    {
      slug: "automation",
      why: {
        before: "Software deployments, server provisioning, testing, and database backups were executed manually by human system administrators typing commands into terminal windows.",
        problem: "Manual operations were slow, inconsistent, and error-prone: a single mistyped command took down production, deployments took hours of downtime, and human fatigue caused catastrophic data loss.",
        shift: "Automation replaces manual human procedures with programmatic, deterministic, version-controlled software scripts and CI/CD pipelines, driving high velocity and reproducible operations."
      },
      num: {
        t: "Automation Tiers, Control Loops, and Operational Transformation",
        h: ["Automation Tier / Domain", "Manual Human Task Replaced", "Implementation Primitive", "Idempotency Guarantee", "Operational Failure Mode Addressed"],
        r: [
          ["Continuous Integration (CI)", "Manual compiling, linting, and running test suites", "CI/CD Runners (GitHub Actions, GitLab CI)", "Pure function ($f(\\text{Commit}) \\to \\text{Pass/Fail}$)", "Preventing broken code from merging to main"],
          ["Continuous Delivery (CD)", "Manual SSH and file copying to production servers", "GitOps / ArgoCD / Kubernetes controllers", "Declarative convergence (Actual == Desired)", "Eliminates deployment downtime & human error"],
          ["Infrastructure as Code (IaC)", "Clicking buttons in AWS/GCP cloud web consoles", "Terraform / OpenTofu / Pulumi manifests", "Stateful plan-and-apply state machine", "Configuration drift and un-reproducible infrastructure"],
          ["Automated Database Backups", "Manual database dump commands (pg_dump)", "Cron jobs / Cloud snapshot policies to S3", "Automated point-in-time recovery (PITR)", "Catastrophic unrecoverable data loss"],
          ["Auto-Scaling / Self-Healing", "Manual server provisioning during traffic spikes", "Kubernetes Horizontal Pod Autoscaler (HPA)", "Dynamic control loop feedback ($u(t) = K_p e(t)$)", "Server crashes caused by traffic surges"]
        ],
        n: "Automation transforms operational engineering into a software domain governed by Control Theory. Modern automation systems implement declarative Closed-Loop Reconciliation: given a desired system state $S_{\\text{desired}}$ defined in version-controlled manifests, a control loop continuously measures the empirical state $S_{\\text{actual}}$, calculating the error vector $e(t) = S_{\\text{desired}} - S_{\\text{actual}}$. If $e(t) \\neq 0$, an automated reconciler executes corrective mutations until $e(t) \\to 0$ asymptotically. A non-negotiable mathematical requirement of automation is *Idempotency*: executing an automation script $N$ times must produce the identical state as executing it once: $f(f(x)) = f(x)$, preventing duplicate database entries or redundant server spawns during automated retries."
      },
      miss: [
        {
          w: "Writing a bash script that executes a sequence of commands is sufficient to call it 'automated'.",
          r: "Fragile scripts that fail on non-zero exit codes, lack error handling, or create duplicate resources on retry are not true automation; production automation must be declarative, idempotent, and self-healing."
        },
        {
          w: "Automating a bad, broken manual process automatically makes it a good process.",
          r: "Bill Gates' rule of automation states: 'Automation applied to an efficient operation will magnify efficiency; automation applied to an inefficient operation will magnify inefficiency.' Fix the process before automating."
        },
        {
          w: "Once a system is fully automated, human engineers never need to monitor or understand it again.",
          r: "The 'Ironies of Automation' (Lisanne Bainbridge) proves that automation leaves human operators handling only the most complex, rare, catastrophic edge cases, requiring even deeper human comprehension."
        },
        {
          w: "Automating everything immediately is the best goal for early-stage software projects.",
          r: "Automating volatile, rapidly changing prototypes creates massive maintenance friction; teams should automate stable, proven, repetitive tasks (testing, deployment) while keeping exploratory work flexible."
        }
      ],
      trade: {
        buys: [
          "Drastic reduction in Mean Time to Recovery (MTTR) and deployment cycle times (shipping in minutes vs weeks).",
          "Complete elimination of human typographical and operational error during production deployments.",
          "Sub-linear operational scaling: handle 100x user growth without hiring 100x more operations personnel.",
          "Auditable compliance: version-controlled GitOps manifests provide an immutable record of every change."
        ],
        costs: [
          "Upfront engineering investment: building robust, self-healing automation takes significant initial time.",
          "Blast radius magnification: a bug in an automated script can delete 1,000 production servers in seconds.",
          "Automation maintenance debt: keeping CI/CD pipelines, Docker containers, and Terraform up to date.",
          "Loss of operational muscle memory: engineers forget how to perform tasks manually during automation failures."
        ],
        avoid: [
          "Automating destructive operations (like deleting data) without dry-run confirmation and safety rails.",
          "Writing automation scripts that are not idempotent (scripts that fail or duplicate resources on re-run).",
          "Hardcoding production secrets and passwords directly into automation script files.",
          "Letting automation fail silently without routing failure alerts to active on-call engineering channels."
        ]
      }
    },
    {
      slug: "design-patterns",
      why: {
        before: "Developers solved recurring object-oriented structural and behavioral design challenges from scratch, producing bespoke, tangled spaghetti code architectures that were hard to maintain.",
        problem: "Codebases lacked shared structural vocabulary: every developer invented custom ways to create objects, manage notifications, and wrap algorithms, making code reviews and onboarding painful.",
        shift: "Software design patterns (formalized by the Gang of Four) establish battle-tested, standardized architectural blueprints for solving common software engineering challenges in object-oriented and functional systems."
      },
      num: {
        t: "The Gang of Four (GoF) Pattern Categories, Primitives, and Trade-offs",
        h: ["Pattern Category", "Canonical Pattern", "Structural Intent / Purpose", "Coupling Direction", "Primary Modern Use Case"],
        r: [
          ["Creational", "Factory / Builder / Singleton", "Decouples object instantiation from concrete implementation", "Caller depends on abstract interface, not concrete constructor", "Dependency Injection containers, complex configuration objects"],
          ["Structural", "Adapter / Facade / Proxy", "Composes classes and interfaces into larger unified structures", "Converts incompatible interface $A$ to target interface $B$", "Wrapping legacy APIs, third-party payment gateway adapters"],
          ["Behavioral", "Strategy / Observer / Command", "Distributes algorithms, responsibilities, and communication", "Decouples algorithm selection from consumer execution", "State-management dispatchers (Redux), event emitters, sorting strategies"],
          ["Architectural", "Repository / Unit of Work", "Isolates data access tier from domain business logic", "Domain logic has zero dependency on SQL/ORM libraries", "Clean Architecture / Hexagonal / Domain-Driven Design (DDD)"],
          ["Anti-Pattern", "Patternitis / Over-engineering", "Forcing complex design patterns onto simple CRUD scripts", "Unnecessary layers of indirection and boilerplate", "Avoid! Creates unreadable codebases"]
        ],
        n: "Formalized in 1994 by Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides (the Gang of Four - GoF), design patterns provide reusable architectural templates categorized into three domains: Creational, Structural, and Behavioral. Rather than being finished code implementations, patterns operate as abstract algebraic graphs of collaborating interfaces and polymorphic classes. For example, the Strategy Pattern replaces rigid conditional branching ($O(N)$ `switch` statements) with polymorphic composition: parameterizing a host context with an interface $\\mathcal{I}_{\\text{strategy}}$, allowing dynamic swapping of algorithms ($A = f(x)$ vs $B = g(x)$) at runtime without modifying host code (adhering strictly to the Open/Closed Principle). In modern languages, first-class functions and closures frequently replace verbose historical class patterns."
      },
      miss: [
        {
          w: "Every single class and module in a professional codebase must implement a formal Gang of Four design pattern.",
          r: "Forcing design patterns where they aren't needed ('Patternitis') creates over-engineered, unreadable architectures with dozens of pointless abstract factory beans; patterns should solve real pain, not be forced."
        },
        {
          w: "The Singleton pattern is a great, easy way to manage global state across an entire application.",
          r: "The Singleton pattern is often classified as an anti-pattern: it introduces hidden global state, tightly couples classes, prevents parallel unit testing, and violates the Dependency Inversion Principle."
        },
        {
          w: "Modern functional programming has made all object-oriented design patterns completely obsolete.",
          r: "Core design patterns represent universal concepts: the Strategy pattern is simply passing a higher-order function, the Observer pattern is an Event Emitter or reactive stream, and the Adapter pattern is function wrapping."
        },
        {
          w: "Design patterns provide copy-pasteable code snippets that solve business problems directly.",
          r: "Design patterns are architectural concepts and blueprints, not code libraries; you must adapt the pattern's structural relationships to fit your specific language, domain, and performance constraints."
        }
      ],
      trade: {
        buys: [
          "Shared engineering vocabulary: saying 'we use a Strategy pattern here' conveys complex architecture in five words.",
          "Maximum extensibility: add new features or payment methods without modifying battle-tested existing code.",
          "High testability: decoupling components via interfaces allows effortless mocking and isolated unit testing.",
          "Battle-tested resilience: patterns represent solutions refined over decades of software engineering experience."
        ],
        costs: [
          "Over-engineering hazard: premature introduction of patterns introduces pointless cognitive complexity.",
          "Increased file and interface sprawl: decomposing a simple function into factories and interfaces creates extra code.",
          "Indirection overhead: navigating code requires jumping through multiple interface definitions to find logic.",
          "Can mask simple, elegant functional solutions behind verbose, legacy object-oriented ceremony."
        ],
        avoid: [
          "Introducing complex Factory or Strategy patterns to solve a trivial problem that requires only a simple function.",
          "Using the Singleton pattern as an excuse to maintain global mutable application state.",
          "Evaluating developer seniority based on how many obscure design patterns they can cram into a pull request.",
          "Writing bespoke custom ad-hoc architectures when a well-known, standard design pattern directly fits the problem."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
