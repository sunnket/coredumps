/* ==========================================================================
   Depth pass 29 — the remaining LLM terms: positional encoding, quantisation,
   vector indexes, alignment and agent memory.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "alibi",

      why: {
        before: "Positional information was **added** to embeddings — " +
          "sinusoidal or learned vectors — or, later, applied as a rotation to " +
          "queries and keys (**RoPE**).",
        problem: "All of them degrade past the trained context length. Learned " +
          "embeddings have no vector for position 5,000 if trained to 2,000; " +
          "RoPE's frequencies become unfamiliar and attention scores go wrong. " +
          "Extending context meant retraining or applying a scaling method.",
        shift: "Do not encode position at all — **penalise distance**. ALiBi " +
          "subtracts a linear penalty proportional to how far apart two tokens " +
          "are, directly from the attention score, with a different slope per " +
          "head. There is nothing to run out of: the penalty formula works at " +
          "any distance, so the model **extrapolates** to sequences far longer " +
          "than it was trained on."
      },

      num: {
        t: "Positional methods compared",
        h: ["Method", "Extrapolates?", "Adds parameters?", "Used by"],
        r: [
          ["Learned absolute", "**no**", "yes", "BERT, GPT-2"],
          ["Sinusoidal", "poorly", "no", "original transformer"],
          ["**RoPE**", "with scaling (YaRN, NTK)", "no", "**Llama, Mistral, Qwen**"],
          ["**ALiBi**", "**yes, natively**", "no", "BLOOM, MPT"]
        ],
        n: "ALiBi's headline result is training on **1,024 tokens and " +
          "evaluating usefully at 2,048+** with no adaptation — genuine " +
          "extrapolation rather than graceful degradation. The mechanism is " +
          "that a linear distance penalty is a **recency bias**: nearby tokens " +
          "are systematically favoured, which is a reasonable prior for " +
          "language and a real limitation when the important token is far " +
          "away. That is why RoPE with scaling has largely won despite ALiBi's " +
          "cleaner extrapolation story — long-context tasks frequently need " +
          "**precise retrieval of a distant token**, and a built-in recency " +
          "penalty works directly against that. Different slopes per head " +
          "mitigate it (some heads look further than others) without removing " +
          "it."
      },

      miss: [
        {
          w: "ALiBi is a positional encoding.",
          r: "It encodes **no position information** anywhere. Nothing is added " +
            "to embeddings and nothing rotates. It biases attention scores by " +
            "distance, so the model never learns *where* a token is — only how " +
            "far it is from the current one, which is a strictly weaker signal."
        },
        {
          w: "It extrapolates infinitely.",
          r: "The **formula** works at any distance; quality still degrades as " +
            "you move far outside the training regime, and the recency bias " +
            "means very distant tokens are heavily discounted. It extrapolates " +
            "far better than the alternatives, not without limit."
        },
        {
          w: "Since it extrapolates, it is strictly better than RoPE.",
          r: "The field went to **RoPE plus scaling**, because the recency bias " +
            "hurts on tasks needing distant recall — and needle-in-a-haystack " +
            "style retrieval is exactly what long context is usually for. ALiBi " +
            "trades precise long-range attention for free extrapolation."
        },
        {
          w: "You can add ALiBi to a trained model to extend its context.",
          r: "It is an **architectural** choice applied during training. A " +
            "model trained with RoPE has learned to use rotational position " +
            "signals; swapping in distance penalties at inference produces " +
            "nonsense. Context extension for RoPE models means **YaRN** or " +
            "**NTK scaling** plus brief fine-tuning."
        }
      ],

      trade: {
        buys: [
          "Native extrapolation beyond the trained length.",
          "No extra parameters and negligible compute.",
          "Simple to implement — an additive bias matrix.",
          "Train short, infer long, saving training cost."
        ],
        costs: [
          "Built-in recency bias hurts distant retrieval.",
          "No absolute position information at all.",
          "Less ecosystem support than RoPE.",
          "Cannot be retrofitted to an existing model."
        ],
        avoid: [
          "The task needs precise recall from far back in context.",
          "You are working with existing RoPE-based checkpoints.",
          "Absolute position matters — structured document parsing.",
          "You want the widest tooling support, which follows RoPE."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "awq",

      why: {
        before: "**GPTQ** quantised weights layer by layer, using second-order " +
          "information to compensate for the error each rounding introduced. " +
          "Effective, and it requires computing and inverting Hessian " +
          "information — hours of work for a large model.",
        problem: "That cost is high, and the method treats all weights as " +
          "equally important when they demonstrably are not. A small fraction " +
          "of weights carry disproportionate influence on the output.",
        shift: "Find the important ones by looking at **activations, not " +
          "weights**. AWQ's observation is that the weights that matter most " +
          "are those multiplied by **large-magnitude activations** — roughly " +
          "**1%** of them. Scale those channels up before quantising so they " +
          "retain precision, and scale the activations down correspondingly. " +
          "No backpropagation, no Hessian, minutes instead of hours."
      },

      num: {
        t: "Post-training quantisation methods",
        h: ["Method", "Signal used", "Time (70B)", "Quality at 4-bit"],
        r: [
          ["Round-to-nearest", "none", "instant", "poor"],
          ["**GPTQ**", "weight Hessian", "**hours**", "good"],
          ["**AWQ**", "**activation magnitude**", "**minutes**", "**good, often better**"],
          ["SmoothQuant", "activation outliers", "fast", "targets W8A8"]
        ],
        n: "The **1% of salient weights** figure is the core empirical claim, " +
          "and the elegant part is that AWQ does not store those weights at " +
          "higher precision — mixed-precision storage is awkward for kernels. " +
          "Instead it applies a **per-channel scaling** that is mathematically " +
          "absorbed into the adjacent layer, so the quantised model has " +
          "uniform 4-bit weights and the important channels simply survive " +
          "rounding better. AWQ is also reported to **generalise better across " +
          "calibration data** than GPTQ, because activation magnitude is a more " +
          "stable signal than a Hessian estimated from a few hundred samples — " +
          "which matters when your deployment distribution differs from your " +
          "calibration set."
      },

      miss: [
        {
          w: "AWQ keeps 1% of weights in higher precision.",
          r: "It does not — mixed precision would complicate the kernels. It " +
            "applies **per-channel scaling** so salient channels quantise more " +
            "accurately, and the scale is folded into neighbouring operations. " +
            "The stored model is uniformly 4-bit."
        },
        {
          w: "AWQ is strictly better than GPTQ.",
          r: "It is **faster to apply** and often comparable or slightly better " +
            "in quality, and results vary by model and task. The stronger " +
            "practical argument is speed and robustness to calibration data, " +
            "not a decisive quality win."
        },
        {
          w: "Calibration data does not matter much for AWQ.",
          r: "It matters **less** than for GPTQ because activation magnitudes " +
            "are more stable than Hessian estimates — not that it is " +
            "irrelevant. Calibrating on generic text and deploying on code " +
            "still degrades quality measurably."
        },
        {
          w: "4-bit quantisation degrades all abilities equally.",
          r: "As with GPTQ, **reasoning, mathematics and long-context recall " +
            "degrade first** while fluency survives. A quantised model can " +
            "converse fine and be measurably worse at the multi-step task you " +
            "deployed it for. Evaluate on your workload, not on perplexity."
        }
      ],

      trade: {
        buys: [
          "~4× smaller weights with quality close to fp16.",
          "Minutes to apply rather than hours.",
          "More robust to calibration-data mismatch than GPTQ.",
          "Well supported in vLLM, TGI and llama.cpp."
        ],
        costs: [
          "Still needs calibration data.",
          "Weight-only — activations and KV cache unaffected.",
          "Reasoning ability degrades before fluency does.",
          "Kernel support varies by hardware."
        ],
        avoid: [
          "The model already fits and latency is acceptable.",
          "Maximum quality on reasoning-heavy work matters.",
          "You intend to fine-tune afterwards — quantise last, or use QLoRA.",
          "Your serving stack lacks efficient kernels for the format."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ivfflat",

      why: {
        before: "Exact nearest-neighbour search compares the query against " +
          "**every** vector. Correct, and linear in corpus size.",
        problem: "At millions of vectors that is far too slow, and the " +
          "structure that makes low-dimensional search fast — trees — collapses " +
          "in high dimensions where nearly all points are roughly equidistant.",
        shift: "**Partition first, search locally.** Cluster the vectors with " +
          "k-means into lists (an *inverted file*), then at query time find the " +
          "nearest few centroids and scan only those lists. You search a small " +
          "fraction of the corpus, at the cost of missing neighbours that " +
          "happen to sit in a cluster you did not probe."
      },

      num: {
        t: "IVFFlat against HNSW",
        h: ["Property", "IVFFlat", "HNSW"],
        r: [
          ["Build time", "**fast** — k-means", "slow"],
          ["Memory overhead", "**minimal**", "**~1.5 GB per 1M×768**"],
          ["Recall at equal latency", "lower", "**higher**"],
          ["Adding vectors", "**easy**", "easy, but degrades"],
          ["Needs training", "**yes — k-means**", "no"],
          ["Tuning knob", "`nprobe`", "`ef_search`"]
        ],
        n: "The tuning knob is `nprobe` — how many clusters to scan — and it " +
          "trades recall for latency **at query time with no rebuild**, exactly " +
          "like HNSW's `ef_search`. The rule of thumb for list count is around " +
          "`√n`, so a million vectors wants roughly 1,000 lists. IVF's real " +
          "argument over HNSW is **memory**: HNSW's graph is a large fixed " +
          "overhead on top of the vectors, while IVF stores little beyond " +
          "centroids — and combined with **product quantisation** (IVF-PQ) it " +
          "compresses the vectors themselves, which is why billion-scale " +
          "indexes are usually IVF-based. The cost is that it **requires " +
          "training**: centroids are fitted to a sample, and if the data " +
          "distribution shifts substantially the clustering becomes " +
          "unrepresentative and recall quietly falls."
      },

      miss: [
        {
          w: "IVFFlat is an approximate index, so the vectors are compressed.",
          r: "**Flat** means the vectors are stored **uncompressed** — the " +
            "approximation is only in *which* vectors get compared. **IVFPQ** " +
            "is the variant that also compresses vectors with product " +
            "quantisation, trading more recall for much less memory."
        },
        {
          w: "You can build the index incrementally as data arrives.",
          r: "The centroids must be **trained on a representative sample " +
            "first**. You can add vectors afterwards, and they are assigned to " +
            "existing clusters — so if the distribution drifts, lists become " +
            "unbalanced and recall degrades. Periodic retraining is part of " +
            "operating it."
        },
        {
          w: "More lists always means faster search.",
          r: "More lists mean smaller lists and therefore faster scanning, and " +
            "**also** more centroids to compare against and higher risk that " +
            "the true neighbour is in an unprobed cluster. Roughly `√n` " +
            "balances the two; both directions get worse."
        },
        {
          w: "HNSW is better, so IVF is obsolete.",
          r: "HNSW wins on recall-per-latency and costs substantially more " +
            "**memory**. At billion scale, or where the index must fit " +
            "alongside other data, IVF and IVF-PQ are frequently the only " +
            "viable option. pgvector's IVFFlat exists for exactly this reason."
        }
      ],

      trade: {
        buys: [
          "Fast build and low memory overhead.",
          "Recall tunable at query time via `nprobe`.",
          "Scales to billions when combined with product quantisation.",
          "Simple and well understood."
        ],
        costs: [
          "Requires training on a representative sample.",
          "Lower recall than HNSW at equal latency.",
          "Distribution drift degrades it silently.",
          "Neighbours in unprobed clusters are missed entirely."
        ],
        avoid: [
          "Memory is plentiful and recall matters most — use **HNSW**.",
          "The corpus is small enough for brute force.",
          "The data distribution shifts continuously and retraining is " +
            "impractical.",
          "You cannot obtain a representative training sample."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "agentic-rag",

      why: {
        before: "RAG was a fixed pipeline: embed the query, retrieve top-k, " +
          "stuff into the prompt, generate. Every query took the same path " +
          "regardless of what it needed.",
        problem: "That pipeline retrieves when it should not (*what is 2+2*), " +
          "fails to retrieve again when the first attempt returned nothing " +
          "useful, cannot choose between a document store and a database, and " +
          "has no way to notice that the retrieved context does not answer the " +
          "question.",
        shift: "Let the model **decide**. Retrieval becomes a **tool** the " +
          "agent may call — or not — possibly several times, possibly against " +
          "different sources, with the ability to evaluate what came back and " +
          "try again. The pipeline becomes a loop with judgement in it."
      },

      num: {
        t: "Fixed pipeline against agentic",
        h: ["Capability", "Fixed RAG", "Agentic RAG"],
        r: [
          ["Skip retrieval when unnecessary", "**no**", "yes"],
          ["Reformulate a failed query", "**no**", "yes"],
          ["Choose among sources", "no", "yes"],
          ["Multi-hop", "no", "yes"],
          ["**Latency**", "**one round trip**", "**unbounded without a cap**"],
          ["**Cost**", "**predictable**", "**variable, can spiral**"],
          ["Debuggability", "**easy**", "hard"]
        ],
        n: "The last three rows are the honest cost, and they are why fixed " +
          "pipelines remain the right default for most systems. An agent that " +
          "can retrieve repeatedly **must** have a hard iteration cap and a " +
          "token budget, or a query it cannot satisfy will loop until something " +
          "stops it. Latency becomes a distribution rather than a number, which " +
          "breaks SLA commitments. And debugging *why did it answer this way* " +
          "means reconstructing a trajectory rather than inspecting one " +
          "retrieval. The sensible middle is **routing** — classify the query " +
          "once and pick a path — which captures much of the benefit with " +
          "bounded cost."
      },

      miss: [
        {
          w: "Agentic RAG is strictly better because it is more flexible.",
          r: "It is more capable and **less predictable**. Fixed pipelines have " +
            "bounded latency, bounded cost and are straightforward to debug. " +
            "For a system answering well-scoped questions over one corpus, " +
            "agency adds cost and variance for capability nobody needs."
        },
        {
          w: "The agent will know when it has enough information.",
          r: "Self-assessment is **poorly calibrated** — models stop early with " +
            "insufficient context, or loop re-retrieving variations of the same " +
            "query. Grounding the decision in something external (did " +
            "retrieval return anything above a score threshold?) is more " +
            "reliable than asking the model."
        },
        {
          w: "You should let the agent choose freely among all sources.",
          r: "Every source is an **attack surface** for prompt injection and a " +
            "cost multiplier. Scope tools narrowly — a search tool restricted " +
            "to one index is far safer than a general HTTP fetch, which is an " +
            "exfiltration channel."
        },
        {
          w: "Multi-hop capability means it handles complex questions well.",
          r: "**Errors compound** across hops — 80% per-hop accuracy is 51% " +
            "over three hops. More agency does not mean more reliability; it " +
            "means more opportunities to go wrong, which is why hop caps and " +
            "verification between steps matter."
        }
      ],

      trade: {
        buys: [
          "Skips retrieval when it is unnecessary.",
          "Recovers from failed retrieval by reformulating.",
          "Routes across multiple sources.",
          "Handles multi-hop and compositional questions."
        ],
        costs: [
          "Unbounded latency and cost without hard caps.",
          "Much harder to debug and to evaluate.",
          "Each tool is an injection and exfiltration surface.",
          "Self-assessment of sufficiency is unreliable."
        ],
        avoid: [
          "Questions are well-scoped over a single corpus — fixed RAG is " +
            "cheaper and more predictable.",
          "Latency SLAs are strict.",
          "You cannot implement iteration caps and budgets.",
          "**Query routing** would capture most of the benefit at bounded " +
            "cost — often true."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "constitutional-ai",

      why: {
        before: "**RLHF** aligned models using human preference comparisons — " +
          "effective, and requiring humans to label tens of thousands of " +
          "response pairs, including many that are distressing to read.",
        problem: "Three costs. It is **expensive and slow**; it exposes " +
          "labellers to harmful content as a job requirement; and the values " +
          "encoded are **implicit in the labels**, so nobody — including the " +
          "developers — can state precisely what the model was trained to " +
          "prefer or audit it.",
        shift: "Write the values down. A **constitution** of explicit " +
          "principles guides the model to **critique and revise its own " +
          "outputs**, producing training data with far less human labelling. " +
          "The values become a document you can read, argue with and version " +
          "— which is arguably a bigger contribution than the labour saving."
      },

      num: {
        t: "The two phases",
        h: ["Phase", "Process", "Human involvement"],
        r: [
          ["**1. Supervised**", "generate → self-critique against a principle → revise → fine-tune on revisions", "**writing the constitution**"],
          ["**2. RLAIF**", "**AI** compares response pairs against principles → preference model → RL", "**almost none**"]
        ],
        n: "The second phase is **RLAIF** — reinforcement learning from *AI* " +
          "feedback — and it is the substantive substitution: the model judges " +
          "which of two responses better follows the constitution, replacing " +
          "the human comparison labels RLHF depends on. Anthropic's published " +
          "constitution draws on sources including the **UN Declaration of " +
          "Human Rights** and platform trust-and-safety principles. The honest " +
          "limitations: the model must already be capable enough to critique " +
          "itself usefully (this does not work on a weak model), the " +
          "constitution's principles can **conflict** with no meta-rule for " +
          "resolving them, and any bias in the base model is applied to " +
          "judging its own outputs — the supervisor and the supervised share " +
          "blind spots."
      },

      miss: [
        {
          w: "The constitution is a set of hard rules the model must follow.",
          r: "It is a set of **principles used to generate training data**. The " +
            "resulting model has *tendencies* shaped by them, not enforced " +
            "constraints. It is not a filter at inference time and can be " +
            "argued out of, which is why jailbreaks work."
        },
        {
          w: "It removes humans from alignment entirely.",
          r: "Humans **write the constitution**, which is where the value " +
            "judgements now live — arguably a more important and more " +
            "scrutinisable role than labelling pairs. Humans also evaluate " +
            "whether it worked. What is removed is the labelling labour, not " +
            "the human judgement."
        },
        {
          w: "Self-critique works because the model knows what is harmful.",
          r: "It works because the model can **apply a stated principle to a " +
            "specific text** — a much narrower ability than knowing what is " +
            "harmful in general. Give it a vague principle and the critique is " +
            "vague; the specificity of the constitution matters enormously."
        },
        {
          w: "A model trained this way is safe.",
          r: "It is more consistently aligned **with the stated principles**, " +
            "under conditions resembling training. Jailbreaks, distribution " +
            "shift and novel framings all still work. It raises the floor of " +
            "behaviour; it is not a security boundary."
        }
      ],

      trade: {
        buys: [
          "Values are explicit, readable, auditable and versionable.",
          "Dramatically less human labelling.",
          "Reduces labeller exposure to harmful content.",
          "Scales — principles apply to cases nobody enumerated."
        ],
        costs: [
          "Requires a base model capable of useful self-critique.",
          "Principles conflict with no resolution mechanism.",
          "Base-model bias is applied to judging itself.",
          "Constitution writing is a genuinely hard values exercise.",
          "Not a guarantee — jailbreaks still work."
        ],
        avoid: [
          "The base model is too weak to critique itself meaningfully.",
          "You need hard guarantees — use filtering and system-level controls.",
          "The domain has objective correctness where verifiable rewards work " +
            "better.",
          "You cannot articulate the principles; writing them is the whole " +
            "method."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "clip",

      why: {
        before: "Image classifiers were trained on **fixed label sets** — " +
          "ImageNet's 1,000 classes — with expensive human annotation. Adding " +
          "a new class meant collecting examples and retraining.",
        problem: "That does not scale and does not match how images exist in " +
          "the world. The internet contains billions of images **already " +
          "paired with text** — captions, alt text, surrounding paragraphs — " +
          "which is supervision nobody had to pay for.",
        shift: "Train image and text encoders **contrastively** so that a " +
          "matching image-caption pair lands close in a shared embedding space " +
          "and mismatched pairs land far apart. Classification then becomes " +
          "**comparison against text**: embed the candidate labels as " +
          "sentences and pick the nearest. Any label expressible in words works " +
          "with no retraining — **zero-shot**."
      },

      num: {
        t: "What the shared space enables",
        h: ["Capability", "How"],
        r: [
          ["**Zero-shot classification**", "compare image to label embeddings"],
          ["Image search by text", "embed the query, nearest-neighbour"],
          ["**Text-to-image guidance**", "**the conditioning in Stable Diffusion**"],
          ["Data filtering", "score image-caption alignment at scale"],
          ["Robustness to distribution shift", "learned from varied web data"]
        ],
        n: "**Prompt engineering matters more than people expect**: the label " +
          "*dog* performs worse than *a photo of a dog*, because the training " +
          "captions were sentences rather than bare nouns. OpenAI reported " +
          "ensembling many such templates for meaningful accuracy gains. The " +
          "real significance beyond classification is the third row — CLIP's " +
          "text encoder is what **conditions image generation** in Stable " +
          "Diffusion and its successors, making it infrastructure rather than " +
          "an application. Its limitations are equally characteristic: it is " +
          "poor at **counting**, at **spatial relations** (*the cat left of the " +
          "dog*), and at fine-grained distinctions, because web captions rarely " +
          "specify any of those — the model learned what its supervision " +
          "contained."
      },

      miss: [
        {
          w: "CLIP understands images.",
          r: "It learned to **align images with the kind of text that " +
            "accompanies them online**. That is a specific and limited " +
            "objective — it captures what captions mention and misses what they " +
            "do not, which is why counting and spatial reasoning are weak."
        },
        {
          w: "Zero-shot means it works on any task without adaptation.",
          r: "It means no **task-specific training data**. It still needs good " +
            "label phrasing, and performance varies enormously by domain — " +
            "strong on natural images resembling web photos, weak on medical " +
            "imaging, satellite data or specialised industrial inspection."
        },
        {
          w: "Bigger CLIP models are uniformly better.",
          r: "Scale helps and the **training data** matters more. OpenCLIP " +
            "showed data quality and scale drive most of the difference, which " +
            "is why DataComp and similar dataset-curation efforts exist. Model " +
            "size is the less interesting variable."
        },
        {
          w: "It is unbiased because it learned from the whole internet.",
          r: "It learned internet **biases** faithfully, and OpenAI's own paper " +
            "documented harmful associations in its zero-shot outputs. " +
            "Uncurated web-scale data is not neutral data — it is a very large " +
            "sample of a biased distribution."
        }
      ],

      trade: {
        buys: [
          "Zero-shot classification over any text-expressible label set.",
          "Natural-language image search.",
          "The conditioning mechanism behind text-to-image generation.",
          "Trained on free supervision — no annotation cost.",
          "Robust across many natural-image distributions."
        ],
        costs: [
          "Weak at counting, spatial relations and fine detail.",
          "Sensitive to prompt phrasing.",
          "Inherits web-scale biases.",
          "Poor on specialised domains unlike its training data.",
          "Fixed resolution loses detail on large images."
        ],
        avoid: [
          "The domain is specialised — medical, satellite, industrial.",
          "The task needs counting or spatial reasoning.",
          "You have labelled data and a supervised model would be stronger.",
          "Fine-grained distinctions matter — species, defect classification."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "episodic-memory",

      why: {
        before: "An agent's context window was its entire memory. Everything " +
          "relevant had to be in the prompt, and anything outside it never " +
          "happened.",
        problem: "Context is finite and expensive, and conversations end. An " +
          "agent that solved a problem yesterday starts today knowing nothing — " +
          "it repeats the same failed approach, asks for information the user " +
          "already gave, and cannot improve from experience.",
        shift: "Store **specific past experiences** externally and retrieve " +
          "them when relevant. The distinction that matters: **episodic** " +
          "memory holds *what happened* — this task, this approach, this " +
          "outcome — where **semantic** memory holds *facts* and " +
          "**procedural** memory holds *how to do things*. Episodic memory is " +
          "what lets an agent learn from its own history without retraining."
      },

      num: {
        t: "Memory types in agent systems",
        h: ["Type", "Holds", "Retrieved when", "Storage"],
        r: [
          ["Working (context)", "current conversation", "always", "**the prompt**"],
          ["**Episodic**", "**past interactions + outcomes**", "similar situation", "vector store"],
          ["Semantic", "facts about the world/user", "relevant topic", "vector store or KV"],
          ["Procedural", "learned workflows", "matching task type", "prompts, tools"]
        ],
        n: "The design problems are the same ones any memory system has, and " +
          "they are unsolved rather than merely fiddly. **What to store** — " +
          "storing everything makes retrieval noisy, storing selectively " +
          "requires judging importance at write time before you know what will " +
          "matter. **When to forget** — without decay, contradictory or " +
          "outdated memories accumulate and an agent confidently acts on a " +
          "preference the user changed months ago. And **retrieval by " +
          "similarity is not retrieval by relevance**: the most semantically " +
          "similar past episode may be the least useful one, particularly if it " +
          "was a failure. Systems that store outcomes alongside episodes and " +
          "weight by success handle this better than plain embedding search."
      },

      miss: [
        {
          w: "Episodic memory means saving the conversation history.",
          r: "A transcript is a **log**. Episodic memory is retrievable, " +
            "structured experience — typically a summary of the situation, the " +
            "action taken and the **outcome**, embedded for similarity search. " +
            "The outcome is the part that makes it useful for learning."
        },
        {
          w: "More memory makes the agent smarter.",
          r: "More memory makes retrieval **noisier**. An agent with thousands " +
            "of stored episodes retrieves marginally-relevant ones that crowd " +
            "out useful context. Precision matters more than volume, which " +
            "means forgetting is a feature."
        },
        {
          w: "You can retrieve memories by semantic similarity to the current " +
            "query.",
          r: "Similarity is a **proxy for relevance** and often a poor one. The " +
            "most similar past episode may be a failure you should not repeat. " +
            "Weighting by recency, by outcome, and by explicit importance " +
            "consistently beats similarity alone."
        },
        {
          w: "Memory makes the agent learn.",
          r: "It gives **access to past experience**; whether the agent uses it " +
            "well is a separate matter. Retrieved memories can also mislead — " +
            "an agent that recalls a previously successful approach may apply " +
            "it to a superficially similar situation where it is wrong."
        }
      ],

      trade: {
        buys: [
          "Continuity across sessions.",
          "Avoids repeating known-failed approaches.",
          "Personalisation without fine-tuning.",
          "Improvement from experience with no retraining."
        ],
        costs: [
          "What to store and what to forget are unsolved design problems.",
          "Retrieval noise grows with memory size.",
          "Stale memories cause confidently wrong behaviour.",
          "Storage, embedding and retrieval infrastructure.",
          "Stored user data raises privacy and retention obligations."
        ],
        avoid: [
          "Interactions are genuinely independent.",
          "The context window holds everything relevant.",
          "You cannot implement forgetting — memory will degrade over time.",
          "Privacy or regulatory constraints make storing interactions " +
            "problematic."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "orpo",

      why: {
        before: "Alignment was a **pipeline**: supervised fine-tuning to teach " +
          "the format and behaviour, then a preference stage (**RLHF** or " +
          "**DPO**) to refine it. Two stages, two datasets, two training runs.",
        problem: "SFT alone has a specific weakness: it only ever shows the " +
          "model **good** examples, so it increases their likelihood without " +
          "ever decreasing the likelihood of bad ones. The model learns what to " +
          "say and not what to avoid — which is exactly why a second " +
          "preference stage was needed.",
        shift: "Fold the two together. ORPO adds an **odds-ratio penalty** to " +
          "the SFT loss that directly reduces the likelihood of the rejected " +
          "response while raising the chosen one. One stage, one loss, **no " +
          "reference model** — which halves memory against DPO."
      },

      num: {
        t: "Alignment methods by pipeline complexity",
        h: ["Method", "Stages", "Models in memory", "Reference model?"],
        r: [
          ["RLHF (PPO)", "**3**", "**4**", "yes"],
          ["DPO", "2 (SFT + DPO)", "2", "**yes**"],
          ["KTO", "2", "2", "yes"],
          ["**ORPO**", "**1**", "**1**", "**no**"]
        ],
        n: "The **no reference model** row is the practical headline: DPO holds " +
          "both the policy and a frozen reference copy, so ORPO halves training " +
          "memory and removes a whole model from the pipeline. The mechanism is " +
          "the **odds ratio** — a monotonic function of probability that " +
          "penalises the rejected response more gently than a direct " +
          "probability ratio would, which the authors argue avoids the " +
          "degeneration DPO can show when it drives down both responses. The " +
          "honest caveat is maturity: ORPO is newer and less studied than DPO, " +
          "with fewer reference implementations and less accumulated knowledge " +
          "about hyperparameters, so *simpler pipeline* comes with *less " +
          "certainty about behaviour*."
      },

      miss: [
        {
          w: "ORPO is DPO applied during SFT.",
          r: "It uses a different objective — an **odds-ratio** penalty rather " +
            "than DPO's log-probability ratio against a reference — and " +
            "requires **no reference model** at all. The one-stage property " +
            "follows from that design, not from rescheduling DPO."
        },
        {
          w: "One stage means it must be worse than a two-stage pipeline.",
          r: "Reported results are competitive with SFT-then-DPO. The intuition " +
            "for why: SFT and preference optimisation are pushing on the same " +
            "parameters anyway, and doing both at once avoids the second stage " +
            "partially undoing the first."
        },
        {
          w: "You can use ORPO with any preference dataset.",
          r: "It expects **pairwise chosen/rejected** data, like DPO. Binary " +
            "good-or-bad labels without pairing need **KTO** instead. And the " +
            "chosen responses must be good enough to serve as SFT targets, " +
            "since they are also the supervised signal."
        },
        {
          w: "It is the obvious choice now that it exists.",
          r: "DPO is far more studied, with more implementations, more " +
            "published hyperparameters and more understood failure modes. ORPO " +
            "is simpler and newer. Choosing it means accepting less collective " +
            "experience in exchange for a cleaner pipeline."
        }
      ],

      trade: {
        buys: [
          "One training stage instead of two.",
          "No reference model — half the memory of DPO.",
          "Chosen responses serve as both SFT and preference signal.",
          "Simpler pipeline with fewer artefacts to manage."
        ],
        costs: [
          "Newer and less studied than DPO.",
          "Requires pairwise preference data.",
          "Fewer reference implementations and tuning recipes.",
          "Chosen responses must be good enough to train on directly."
        ],
        avoid: [
          "You want the best-understood method — **DPO** has far more " +
            "collective experience.",
          "Your feedback is binary rather than pairwise — use **KTO**.",
          "You already have a well-tuned SFT model and only need the " +
            "preference stage.",
          "You need a reusable reward model for evaluation."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
