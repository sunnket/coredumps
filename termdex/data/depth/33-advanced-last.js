/* ==========================================================================
   Depth pass 33 — the final advanced terms.

   With this file the advanced tier (252 terms) is complete. The remaining
   work is the intermediate tier (458) and then core (771).
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "kosaraju-s-algorithm",

      why: {
        before: "Finding strongly connected components by brute force means " +
          "asking, for every pair of vertices, whether each can reach the " +
          "other — `O(V·(V+E))` and hopeless on a large graph.",
        problem: "The mutual-reachability relation is genuinely global: " +
          "whether A and B share a component can depend on a path through " +
          "vertices far from both. Local inspection cannot decide it.",
        shift: "Exploit a **symmetry**. The SCCs of a graph and the SCCs of its " +
          "**reverse** are identical — reversing every edge preserves mutual " +
          "reachability. So: DFS the graph recording finish times, reverse the " +
          "edges, then DFS again in **decreasing finish order**. Each tree in " +
          "that second forest is exactly one SCC."
      },

      num: {
        t: "Kosaraju against Tarjan",
        h: ["", "Kosaraju", "Tarjan"],
        r: [
          ["DFS passes", "2", "**1**"],
          ["Reversed graph", "**required**", "not needed"],
          ["Complexity", "O(V+E)", "O(V+E)"],
          ["Constant factor", "worse", "**better**"],
          ["**Ease of proof**", "**much easier**", "subtle"],
          ["Output order", "**topological**", "reverse topological"]
        ],
        n: "The **ease of proof** row is why Kosaraju is taught first and why " +
          "it is often the right choice in practice: the correctness argument " +
          "fits in a paragraph — the vertex with the highest finish time lies " +
          "in a **source** component of the condensation, so starting the " +
          "reverse-graph DFS there cannot escape that component. Tarjan's " +
          "low-link invariant needs considerably more care to state and to " +
          "implement correctly. The cost is real: building the reversed graph " +
          "doubles edge storage and adds a pass, which matters on very large " +
          "graphs or when the graph is streamed. Note the output order " +
          "difference — Kosaraju emits components in **topological** order of " +
          "the condensation, which is directly useful if you then want to " +
          "process dependencies in order."
      },

      miss: [
        {
          w: "The second DFS can start from any unvisited vertex.",
          r: "It must follow **decreasing finish time** from the first pass. " +
            "That ordering is the entire mechanism — it guarantees you start in " +
            "a source component of the condensation, so the reverse-graph " +
            "traversal is trapped inside one SCC."
        },
        {
          w: "You reverse the graph before the first DFS.",
          r: "The first DFS runs on the **original** graph to compute finish " +
            "times; the second runs on the **reversed** graph in that order. " +
            "Doing it the other way round also works if you are consistent, and " +
            "mixing the two gives wrong components."
        },
        {
          w: "Kosaraju is obsolete because Tarjan is faster.",
          r: "Tarjan has a better constant factor and both are linear. " +
            "Kosaraju is **substantially easier to implement correctly**, and " +
            "when you are writing this once for a real system, correctness " +
            "confidence often outweighs a constant factor."
        },
        {
          w: "Finish time means when the vertex was discovered.",
          r: "It is when the DFS **finishes** exploring it — after all its " +
            "descendants are done, on the way back up. Using discovery time " +
            "instead gives wrong results, and it is the classic implementation " +
            "error."
        }
      ],

      trade: {
        buys: [
          "Linear time with a genuinely simple correctness argument.",
          "Emits components in topological order of the condensation.",
          "Two straightforward DFS passes, easy to verify.",
          "Easier to get right than Tarjan under time pressure."
        ],
        costs: [
          "Requires building and storing the reversed graph.",
          "Two full traversals rather than one.",
          "Worse constant factor than Tarjan.",
          "Recursive DFS overflows the stack on deep graphs."
        ],
        avoid: [
          "Memory is tight — **Tarjan** needs no reversed graph.",
          "The graph is streamed or too large to reverse.",
          "You need maximum performance and can implement Tarjan carefully.",
          "The graph is undirected — use connected components instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inverse-ackermann",

      why: {
        before: "Complexity classes were the familiar ladder: constant, " +
          "logarithmic, linear, quadratic, exponential. Analysis produced " +
          "bounds from that set.",
        problem: "Tarjan's 1975 analysis of **union-find** with both path " +
          "compression and union by rank produced a bound that fitted none of " +
          "them — provably better than `O(log n)` and provably not `O(1)`. " +
          "Something between constant and logarithmic was needed to describe " +
          "it.",
        shift: "**α(n)**, the inverse of the Ackermann function. Because " +
          "Ackermann grows faster than any primitive recursive function, its " +
          "inverse grows more slowly than any function you would normally " +
          "write down — **below 5 for any n that could physically exist**."
      },

      num: {
        t: "α(n) against familiar functions",
        h: ["n", "log₂ n", "log* n", "**α(n)**"],
        r: [
          ["10⁶", "20", "4", "**≤ 4**"],
          ["10⁸⁰ (atoms in universe)", "~266", "5", "**≤ 4**"],
          ["2^65536", "65,536", "**5**", "**≤ 4**"],
          ["Any conceivable n", "grows", "grows", "**≤ 5**"]
        ],
        n: "The table's point is that α is **effectively constant** while being " +
          "provably not constant — Tarjan also proved a matching lower bound, " +
          "so `O(α(n))` is tight rather than an artefact of the analysis. " +
          "**log\\*** (iterated logarithm — how many times you must take the " +
          "log to reach 1) is included because it is the other function in this " +
          "territory and is *far* larger than α despite also being absurdly " +
          "slow-growing. The practical consequence: when someone says " +
          "union-find is `O(1)`, they are being informally correct and " +
          "formally wrong, and the distinction only ever matters in a proof. " +
          "It is worth knowing chiefly as a reminder that **the complexity " +
          "hierarchy is far richer than the six classes people usually " +
          "learn**."
      },

      miss: [
        {
          w: "α(n) is effectively constant, so union-find is O(1).",
          r: "It is `O(α(n))`, which is **not** constant — Tarjan proved a " +
            "matching lower bound, so no implementation of that structure " +
            "achieves true `O(1)` amortised. The difference is real in theory " +
            "and undetectable in practice."
        },
        {
          w: "It appears in lots of algorithms.",
          r: "It is famous almost entirely for **union-find**, and appears in a " +
            "handful of related results — some minimum spanning tree analyses " +
            "and computational geometry bounds. It is a specific, narrow " +
            "result rather than a general tool."
        },
        {
          w: "The Ackermann function is a curiosity with no purpose.",
          r: "It was constructed to prove a specific point: that there exist " +
            "**computable functions that are not primitive recursive**. It " +
            "settled a real question about the limits of a restricted " +
            "computational model, and the inverse showing up in union-find is " +
            "the coincidence."
        },
        {
          w: "α(n) and log*(n) are essentially the same.",
          r: "**log\\* grows much faster.** For n = 2^65536, log\\* is 5 and " +
            "α is still ≤ 4 — and log\\* keeps climbing while α is effectively " +
            "frozen. Both are absurdly slow-growing and they are not " +
            "interchangeable."
        }
      ],

      trade: {
        buys: [
          "A tight bound where log n would be loose.",
          "Justifies treating union-find as effectively constant time.",
          "Demonstrates that the complexity hierarchy is finer than usually " +
            "taught."
        ],
        costs: [
          "Requires defining the Ackermann function to state precisely.",
          "The distinction from constant is undetectable in practice.",
          "Appears in almost nothing else."
        ],
        avoid: [
          "You are describing practical performance — say *effectively " +
            "constant* and move on.",
          "The audience does not need the formal distinction.",
          "You are choosing between data structures; α is never the deciding " +
            "factor."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "multi-query-attention",

      why: {
        before: "Multi-head attention gave every query head its own key and " +
          "value head — 32 heads meant 32 separate K and V tensors cached per " +
          "layer per token.",
        problem: "That cache is what limits how many requests fit on a GPU " +
          "during serving. At long context it exceeds the model weights " +
          "themselves, and reading it every decode step consumes the memory " +
          "bandwidth that bounds generation speed.",
        shift: "Take the reduction to its extreme: **one** key/value head " +
          "shared by all query heads. A 32× cache reduction, the smallest " +
          "possible. Query heads still specialise — they apply their own " +
          "projections — but they all attend over the same keys and values."
      },

      num: {
        t: "The KV cache reduction, and its price",
        h: ["Variant", "KV heads (of 32)", "Cache", "Quality"],
        r: [
          ["MHA", "32", "1×", "baseline"],
          ["GQA-8", "8", "1/4", "**≈ MHA**"],
          ["**MQA**", "**1**", "**1/32**", "**measurably worse**"],
          ["MLA", "compressed latent", "~1/10–1/20", "≥ MHA"]
        ],
        n: "MQA was the first of these ideas (Shazeer, 2019) and it is now " +
          "mostly of historical interest, because **GQA occupies the sensible " +
          "middle**: nearly all the memory saving with quality statistically " +
          "indistinguishable from full attention, where MQA shows a small but " +
          "consistent degradation and reportedly less stable training. Its " +
          "lasting contribution is having demonstrated that the KV cache is " +
          "**enormously over-provisioned** — sharing 32 heads down to 1 " +
          "degrades quality far less than anyone expected, which is what " +
          "opened the door to GQA and MLA. MQA still appears where memory is " +
          "the absolute binding constraint and a small quality cost is " +
          "acceptable — edge deployment, or very long context on limited " +
          "hardware."
      },

      miss: [
        {
          w: "MQA reduces the model's parameter count by 32×.",
          r: "It removes the **K and V projection weights** for 31 of 32 " +
            "heads, which is a small fraction of total parameters. The dramatic " +
            "reduction is in the **KV cache at inference**, not in model size."
        },
        {
          w: "All query heads attending to the same keys means they all do the " +
            "same thing.",
          r: "Each query head has its **own query projection**, so they ask " +
            "different questions of the same keys and values. Specialisation " +
            "is reduced, not eliminated — which is why the quality drop is " +
            "small rather than catastrophic."
        },
        {
          w: "MQA is superseded, so it has no use.",
          r: "It remains the right choice when **memory is the hard " +
            "constraint** and a small quality cost is acceptable — edge " +
            "devices, or serving very long contexts on limited VRAM. GQA is " +
            "the better default, not a universal replacement."
        },
        {
          w: "You can convert an MHA model to MQA by averaging its KV heads.",
          r: "Naive averaging degrades the model substantially. The **GQA " +
            "paper's uptraining recipe** — mean-pool then continue training for " +
            "around 5% of the original compute — is what makes such a " +
            "conversion work, and it is not free."
        }
      ],

      trade: {
        buys: [
          "The smallest possible KV cache — 32× reduction.",
          "Correspondingly larger batch sizes and faster decode.",
          "Very long contexts on constrained hardware.",
          "Simple to implement."
        ],
        costs: [
          "Measurable quality degradation against MHA and GQA.",
          "Reportedly less stable to train.",
          "Must be chosen at training time or paid for with uptraining.",
          "Superseded by GQA for most purposes."
        ],
        avoid: [
          "Quality matters and memory is not critical — **GQA** is the " +
            "default.",
          "You want the smallest cache with no quality cost — consider " +
            "**MLA**.",
          "You are serving an existing MHA checkpoint.",
          "Training stability is a concern."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bi-encoder",

      why: {
        before: "Judging whether a document answers a query most accurately " +
          "means reading them **together** — a cross-encoder, where every " +
          "query token attends to every document token.",
        problem: "That requires a forward pass **per query-document pair**. " +
          "With a million documents you cannot precompute anything, because " +
          "the representation depends on the pair. Search becomes impossible.",
        shift: "**Encode independently.** One encoder embeds the query, " +
          "another (often the same weights) embeds each document, and " +
          "relevance is a dot product or cosine similarity. Because the " +
          "document encoder never sees the query, **every document embedding " +
          "can be computed once, offline**, and search becomes a " +
          "nearest-neighbour lookup."
      },

      num: {
        t: "The architectural trade",
        h: ["", "Bi-encoder", "Cross-encoder"],
        r: [
          ["Document embeddings", "**precomputed**", "impossible"],
          ["Passes per query", "**1 + ANN search**", "one per candidate"],
          ["Search 1M docs", "**~10ms**", "hours"],
          ["Query-document interaction", "**none**", "**full**"],
          ["Accuracy", "good", "**better**"],
          ["Role", "**retrieval**", "**reranking**"]
        ],
        n: "The last row is the resolution: production systems use **both**, " +
          "retrieving top-100 with a bi-encoder in milliseconds and reranking " +
          "those with a cross-encoder. The bi-encoder's real limitation is the " +
          "**information bottleneck** — an entire document is compressed into " +
          "one fixed-size vector, so fine distinctions between similar passages " +
          "are lost. **ColBERT** sits between the two: it keeps a vector per " +
          "**token** and computes a late-interaction score, recovering much of " +
          "the cross-encoder's precision while remaining precomputable, at " +
          "considerably higher storage cost. The other thing that dominates " +
          "bi-encoder quality is **negative sampling during training** — " +
          "in-batch negatives are the standard trick, and hard negatives " +
          "matter more than architecture."
      },

      miss: [
        {
          w: "A bi-encoder is a worse cross-encoder.",
          r: "It solves a **different problem**. A cross-encoder cannot search " +
            "a corpus at all — there is nothing to index, because its score " +
            "exists only for a pair. The bi-encoder makes retrieval possible; " +
            "the cross-encoder refines the result."
        },
        {
          w: "Using the same model for queries and documents is required.",
          r: "**Two-tower** architectures often use separate encoders, which is " +
            "standard in recommendation where users and items are entirely " +
            "different objects. Shared weights are common in text retrieval " +
            "because queries and documents are the same kind of thing."
        },
        {
          w: "Cosine similarity is the right metric.",
          r: "It matters that you **match the metric the model was trained " +
            "with**. Most modern embedding models output normalised vectors, " +
            "making cosine and dot product identical — but using cosine on a " +
            "model trained with unnormalised dot product silently degrades " +
            "results."
        },
        {
          w: "A better base model gives a better bi-encoder.",
          r: "**Training data and negative sampling dominate.** A well-trained " +
            "small bi-encoder routinely beats a poorly-trained large one, " +
            "because the objective is to shape the embedding space and that is " +
            "driven by what you contrast against."
        }
      ],

      trade: {
        buys: [
          "Documents embedded once, offline.",
          "Millisecond retrieval over millions via ANN indexes.",
          "Embeddings reusable for clustering, deduplication, similarity.",
          "Scales to corpus sizes cross-encoders cannot approach."
        ],
        costs: [
          "No query-document interaction — misses fine distinctions.",
          "Whole documents compressed to one fixed vector.",
          "Quality depends heavily on negative sampling.",
          "Re-embedding the corpus whenever the model changes."
        ],
        avoid: [
          "The candidate set is small enough for a cross-encoder.",
          "Maximum precision matters and latency does not.",
          "You need token-level matching — consider **ColBERT**.",
          "The corpus changes constantly and re-embedding is impractical."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "word-sense-disambiguation",

      why: {
        before: "Words were treated as symbols. *Bank* was one token with one " +
          "meaning, one embedding, one entry in the index.",
        problem: "Most common words have several senses — *bank*, *run*, " +
          "*set*, *light*. Retrieval matching *bank* returns river " +
          "documentation for a finance query; translation picks the wrong " +
          "target word; static embeddings blend all senses into one average " +
          "vector that represents none of them well.",
        shift: "Determine the intended sense from **context**, choosing from " +
          "an inventory such as WordNet. The classical approach compared the " +
          "context words against each sense's dictionary gloss (**Lesk**); " +
          "supervised approaches trained per-word classifiers on " +
          "sense-annotated corpora."
      },

      num: {
        t: "The difficulty, quantified",
        h: ["Issue", "Detail"],
        r: [
          ["**Most Frequent Sense baseline**", "**~65–70% — very hard to beat**"],
          ["WordNet senses for *run*", "**~60 verb senses**"],
          ["Human inter-annotator agreement", "~**70–80%**"],
          ["Supervised WSD ceiling", "~75–80%"],
          ["Sense inventory granularity", "**the core problem**"]
        ],
        n: "Two of those rows explain why WSD stalled as a task. The **most " +
          "frequent sense** baseline — always pick the commonest meaning, " +
          "ignoring context entirely — achieves around 65-70%, so a system " +
          "must clear a high bar before it is doing anything useful. And " +
          "**human annotators only agree 70-80% of the time**, which caps what " +
          "any supervised system can learn and reveals the deeper issue: " +
          "**WordNet's sense distinctions are finer than humans reliably " +
          "make**. Sixty senses of *run* is a lexicographer's inventory, not a " +
          "cognitive one. This is precisely what **contextual embeddings** " +
          "sidestepped — BERT gives *bank* a different vector in each sentence " +
          "without ever naming a sense, which is what downstream tasks " +
          "actually needed."
      },

      miss: [
        {
          w: "Contextual embeddings solved word sense disambiguation.",
          r: "They **made it unnecessary for most downstream tasks** by " +
            "representing sense implicitly. They do not produce an explicit " +
            "sense label, which is still required for lexicography, ontology " +
            "population and any application needing an auditable link to a " +
            "sense inventory."
        },
        {
          w: "More sense distinctions give a more accurate system.",
          r: "Finer inventories **lower** agreement and accuracy. WordNet is " +
            "widely considered too fine-grained, which is why coarse-grained " +
            "evaluations exist and score much higher. Granularity is a design " +
            "decision, not a fidelity improvement."
        },
        {
          w: "The most-frequent-sense baseline is trivial and easy to beat.",
          r: "It is around 65-70% and **notoriously hard to beat by much**. " +
            "Many published systems improved on it by only a few points, which " +
            "is a large part of why the field's progress looked disappointing."
        },
        {
          w: "WSD is a solved problem now.",
          r: "Modern systems reach roughly human-agreement level, and " +
            "**human agreement is itself only 70-80%** — so the task is not " +
            "solved so much as bounded by the ambiguity of the sense inventory. " +
            "The task was partly redefined out of existence rather than " +
            "completed."
        }
      ],

      trade: {
        buys: [
          "Explicit sense labels linkable to an ontology.",
          "Improves machine translation target-word choice.",
          "Auditable and inspectable, unlike implicit representations.",
          "Necessary for lexicography and knowledge-base population."
        ],
        costs: [
          "Bounded by human annotator agreement.",
          "Sense inventories are often too fine-grained.",
          "Requires sense-annotated training data, which is scarce.",
          "Adds a pipeline stage most downstream tasks no longer need."
        ],
        avoid: [
          "A contextual embedding model handles the downstream task — usually " +
            "true.",
          "You need meaning, not a sense label.",
          "The domain has its own terminology absent from WordNet.",
          "The task tolerates the most-frequent-sense heuristic."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "objective-c",

      why: {
        before: "In the early 1980s, C was the systems language and Smalltalk " +
          "had the most compelling object model — dynamic message passing, " +
          "runtime introspection, live modification. They were entirely " +
          "separate worlds.",
        problem: "Adopting Smalltalk meant abandoning C's performance, its " +
          "libraries and its ability to talk to the operating system. " +
          "Adopting C meant no objects at all. Brad Cox wanted both.",
        shift: "Layer Smalltalk's **message passing** onto C as a strict " +
          "superset. Any C program is a valid Objective-C program; the " +
          "additions are bracket syntax for sending messages and a runtime " +
          "that dispatches them **dynamically at run time** rather than " +
          "resolving calls at compile time. NeXT adopted it, and Apple " +
          "inherited it when it acquired NeXT in 1996."
      },

      num: {
        t: "Dynamic dispatch — the defining property",
        h: ["Capability", "Objective-C", "Swift / C++"],
        r: [
          ["Method resolution", "**at run time**", "mostly compile time"],
          ["Add methods at run time", "**yes — categories, swizzling**", "no"],
          ["Message a nil object", "**returns nil, no crash**", "compile error / crash"],
          ["Introspection", "**full runtime type info**", "limited"],
          ["**Performance**", "**dispatch overhead**", "**faster**"],
          ["Type safety", "**weak**", "**strong**"]
        ],
        n: "**Messaging nil is a no-op returning nil** — one of the most " +
          "divisive design decisions in the language. It eliminates a huge " +
          "class of null-check boilerplate and it silently swallows errors, " +
          "letting a nil propagate through several calls before surfacing " +
          "somewhere unrelated. **Method swizzling** — replacing a method's " +
          "implementation at run time — is what made Apple's frameworks so " +
          "flexible and what makes Objective-C code so hard to reason about " +
          "statically. Swift was introduced in 2014 explicitly to trade this " +
          "dynamism for **type safety and performance**, and the enormous " +
          "existing Objective-C codebase is why the two interoperate so " +
          "carefully."
      },

      miss: [
        {
          w: "Objective-C is dead now that Swift exists.",
          r: "Apple's own frameworks contain vast amounts of it, and " +
            "maintaining large existing applications remains real work. It is " +
            "**not chosen for new projects** and is far from gone — the " +
            "position of any long-established platform language."
        },
        {
          w: "The bracket syntax is just a different way of calling methods.",
          r: "`[obj method]` **sends a message**, resolved by the runtime, " +
            "which is why you can add methods to existing classes, intercept " +
            "unknown selectors, and swizzle implementations. It is a genuinely " +
            "different dispatch model, not alternative syntax."
        },
        {
          w: "Being a superset of C means it is as fast as C.",
          r: "The **C parts** are as fast as C. Message sending adds runtime " +
            "dispatch overhead — small per call and significant in hot loops, " +
            "which is why performance-critical Objective-C code drops to plain " +
            "C functions."
        },
        {
          w: "ARC made memory management automatic like garbage collection.",
          r: "**Automatic Reference Counting** inserts retain and release calls " +
            "at **compile time** — deterministic, no pauses, and it **cannot " +
            "break reference cycles**. Retain cycles remain a real leak source, " +
            "which is why `weak` and `unowned` references exist."
        }
      ],

      trade: {
        buys: [
          "Full C compatibility — any C library works directly.",
          "Dynamic dispatch enabling powerful runtime patterns.",
          "Mature, battle-tested Apple frameworks.",
          "Deterministic memory management via ARC.",
          "Excellent Swift interoperability."
        ],
        costs: [
          "Weak type safety — many errors surface at run time.",
          "Nil messaging hides bugs.",
          "Verbose syntax.",
          "Dispatch overhead in hot paths.",
          "Shrinking developer pool."
        ],
        avoid: [
          "Starting a new Apple-platform project — use **Swift**.",
          "You need strong compile-time guarantees.",
          "Cross-platform development.",
          "You need maximum performance in hot loops."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "nim",

      why: {
        before: "Systems programming meant C or C++ — full control, manual " +
          "memory management, and syntax that is a real barrier. High-level " +
          "programming meant Python — readable and productive, and slow with a " +
          "large runtime.",
        problem: "The gap is uncomfortable: people prototype in Python and " +
          "rewrite hot paths in C, maintaining two languages and a foreign " +
          "function interface between them.",
        shift: "**Compile Python-like syntax to C.** Nim is statically typed " +
          "with indentation-based syntax, and emits C, C++ or JavaScript — so " +
          "it inherits C's mature optimising compilers and links against any C " +
          "library with no binding layer. It adds a genuinely powerful macro " +
          "system operating on the AST at compile time."
      },

      num: {
        t: "Where Nim sits",
        h: ["Property", "Nim", "C", "Python", "Rust"],
        r: [
          ["Syntax", "**Python-like**", "C", "Python", "C-like"],
          ["Performance", "**≈ C**", "C", "slow", "≈ C"],
          ["Memory safety", "**ARC/ORC**", "none", "GC", "**borrow checker**"],
          ["Compiles to", "**C, C++, JS**", "—", "—", "native"],
          ["Ecosystem", "**small**", "vast", "vast", "growing"],
          ["Metaprogramming", "**AST macros**", "preprocessor", "runtime", "macros"]
        ],
        n: "**Compiling to C** is the most consequential design decision: it " +
          "gives Nim access to every optimising C compiler and every C library " +
          "with no FFI overhead, and it means Nim runs anywhere C runs — " +
          "including embedded targets where a new backend would never be " +
          "ported. Memory management is unusually flexible: **ORC** (automatic " +
          "reference counting with a cycle collector) is the modern default, " +
          "and you can select alternatives per project, including no GC at all " +
          "for embedded work. The honest constraint is the ecosystem row — a " +
          "small community means fewer libraries, fewer answers to search for, " +
          "and a real hiring problem, which is why Nim remains a language " +
          "people admire more often than they ship."
      },

      miss: [
        {
          w: "Nim is a Python variant or a Python compiler.",
          r: "It is a **separate statically-typed language** that borrowed " +
            "Python's indentation-based syntax. Python code does not run in " +
            "Nim. The resemblance is deliberate and superficial."
        },
        {
          w: "Compiling to C means it is slow or produces ugly code.",
          r: "It means Nim benefits from **decades of C compiler " +
            "optimisation** and links to C libraries with zero overhead. " +
            "Generated C is not meant to be read; performance is genuinely " +
            "competitive with hand-written C."
        },
        {
          w: "It is memory safe like Rust.",
          r: "ORC prevents leaks and handles cycles, and there is **no borrow " +
            "checker**. Use-after-free is possible with manual memory " +
            "management or unsafe pointers. It is meaningfully safer than C " +
            "and does not provide Rust's compile-time guarantee."
        },
        {
          w: "The macro system is like C's preprocessor.",
          r: "Nim macros operate on the **typed AST at compile time** in Nim " +
            "itself — closer to Lisp macros than to textual substitution. You " +
            "can write DSLs and generate code with full type information, which " +
            "the C preprocessor cannot approach."
        }
      ],

      trade: {
        buys: [
          "C-level performance with readable syntax.",
          "Compiles to C, C++ or JavaScript.",
          "Zero-overhead C interoperability.",
          "Powerful compile-time AST macros.",
          "Flexible memory management including GC-free operation."
        ],
        costs: [
          "Small ecosystem and community.",
          "Very small hiring pool.",
          "Fewer learning resources.",
          "No compile-time memory safety guarantee.",
          "Some historical churn in language and GC design."
        ],
        avoid: [
          "You need a large ecosystem.",
          "You need guaranteed memory safety — **Rust**.",
          "Hiring matters.",
          "The team is productive in an established language and the gain is " +
            "marginal."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "distributed-training",

      why: {
        before: "Training ran on one accelerator. Bigger models and datasets " +
          "meant waiting longer, and the wait was tolerable.",
        problem: "It stopped being tolerable. A frontier model on one GPU " +
          "would take **centuries**, and beyond time, the model itself no " +
          "longer fits — a 70B model in fp16 with Adam needs over a terabyte " +
          "of state, against 80GB on the largest card.",
        shift: "Split the work across many devices. There are exactly **three " +
          "things you can split** — the batch, the layers, or the tensors " +
          "themselves — and each has a different communication pattern. Real " +
          "systems combine all three, choosing which dimension maps to which " +
          "level of the hardware hierarchy."
      },

      num: {
        t: "3D parallelism — matching strategy to hardware",
        h: ["Dimension", "Splits", "Communication", "Maps to"],
        r: [
          ["**Tensor**", "weight matrices", "**2 all-reduces per layer**", "**within a node (NVLink)**"],
          ["**Pipeline**", "layers", "activations at boundaries", "**across nodes**"],
          ["**Data**", "the batch", "gradients per step", "**across replicas**"],
          ["FSDP/ZeRO", "optimiser + params", "params on demand", "within data-parallel groups"]
        ],
        n: "The **maps to** column is the practical knowledge: tensor " +
          "parallelism communicates so frequently that it only works over " +
          "NVLink inside a node; pipeline parallelism communicates rarely " +
          "enough to cross nodes; data parallelism sits on top. Get that " +
          "assignment wrong — tensor parallel across Ethernet — and " +
          "communication dominates completely. Two constants worth carrying: " +
          "**~16 bytes per parameter** with Adam in mixed precision, and " +
          "**scaling efficiency of 70-90%** on good interconnect, so eight GPUs " +
          "give roughly six times the throughput rather than eight. The " +
          "binding constraint at scale is almost always **interconnect " +
          "bandwidth**, not FLOPs — which is why NVLink and InfiniBand " +
          "specifications matter more than TFLOPs when sizing a cluster."
      },

      miss: [
        {
          w: "Distributed training makes training proportionally faster.",
          r: "Efficiency is typically **70-90%** on good interconnect and " +
            "falls with scale. Communication overhead, stragglers and imperfect " +
            "overlap all cost. Eight GPUs give roughly six times the " +
            "throughput, and it gets worse from there without careful " +
            "engineering."
        },
        {
          w: "You should use tensor parallelism because it has no pipeline " +
            "bubbles.",
          r: "It communicates **twice per layer**, so it is confined to a node " +
            "with NVLink. Across nodes it is dramatically slower than pipeline " +
            "parallelism. The strategy must match the interconnect topology."
        },
        {
          w: "Scaling the batch size with GPU count is free.",
          r: "Larger batches need a **larger learning rate** (linear scaling " +
            "rule) plus warmup, and past a **critical batch size** convergence " +
            "degrades — you spend more compute per unit of progress. Gradient " +
            "noise has a useful regularising role that very large batches " +
            "remove."
        },
        {
          w: "More GPUs always means you can train a bigger model.",
          r: "Only with the right strategy. **Plain data parallelism requires " +
            "the whole model on every GPU**, so a thousand GPUs does not help " +
            "if the model does not fit on one. FSDP, tensor or pipeline " +
            "parallelism are what actually remove that constraint."
        }
      ],

      trade: {
        buys: [
          "Trains models and datasets no single device could handle.",
          "Near-linear speed-up on good interconnect.",
          "3D parallelism composes to reach frontier scale.",
          "Mature framework support — DeepSpeed, FSDP, Megatron."
        ],
        costs: [
          "Scaling efficiency below 100% and falling with scale.",
          "Interconnect bandwidth becomes the binding constraint.",
          "Substantial configuration and tuning complexity.",
          "Debugging across many machines is genuinely hard.",
          "Failures require checkpointing and restart machinery."
        ],
        avoid: [
          "The model trains in acceptable time on one device.",
          "Interconnect is slow — communication will dominate.",
          "The batch is already at the critical size.",
          "The team cannot operate multi-node training; the complexity is " +
            "real."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
