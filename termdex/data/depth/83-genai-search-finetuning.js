/* ==========================================================================
   Depth pass 83 — Generative AI & LLMs batch 3: search, adaptation & quantization.
   Semantic Search, Cosine Similarity, Fine-Tuning, Instruction Tuning,
   PEFT, LoRA, Quantisation, Inference Cost.

   Dense latent vector projections match conceptual semantic intent;
   low-rank factorizations and quantized weights slash adaptation and serving costs.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "semantic-search",

      why: {
        before: "Information retrieval relied on lexical keyword matching (TF-IDF, BM25), " +
          "which failed whenever queries used synonyms ('automobile' vs 'car'), paraphrasing, or conceptual intent without exact word matches.",
        problem: "Users query databases using intuitive semantic intent rather than precise database keywords; " +
          "keyword systems return zero results on vocabulary mismatches and cannot capture multi-lingual semantics.",
        shift: "**Semantic Search (Dense Vector Retrieval): Meaning-based geometric proximity.** " +
          "Embed queries and documents into a shared continuous vector space using bi-encoder neural networks, " +
          "retrieving relevant results by calculating nearest neighbors in embedding space regardless of lexical keyword overlap."
      },

      num: {
        t: "Lexical Search (BM25) vs Dense Semantic Search comparison",
        h: ["Dimension / Property", "Lexical Search (BM25 / Inverted Index)", "Dense Semantic Search (Embeddings / Vector DB)"],
        r: [
          ["**Matching Mechanism**", "Exact keyword overlap + term frequency / inverse doc frequency", "**Deep latent conceptual affinity** via transformer embeddings"],
          ["**Synonym & Paraphrase**", "**Fails**: zero score if words don't match exactly", "**Native**: 'cardiac arrest' matches 'heart failure' seamlessly"],
          ["**Specific Entity Precision**", "**Superior**: excels at part numbers, UUIDs, SKUs, rare names", "Poor: can conflate similar-sounding technical part numbers"],
          ["**Index Structure**", "Inverted Index (Postings lists; sparse, lightweight)", "**Vector Index** (HNSW, IVF-PQ; memory-heavy, requires GPUs)"],
          ["**Production Standard**", "Baseline component", "**Hybrid Search**: combines BM25 + Dense Vectors via Reciprocal Rank Fusion (RRF)"]
        ],
        n: "Semantic Search transforms information retrieval from lexical keyword " +
          "counting into **continuous geometric proximity**. The modern architecture is powered " +
          "by **Bi-Encoder Embedding Models** (e.g. BGE, text-embedding-3, E5). " +
          "During indexing, unstructured document passages are passed through a Transformer encoder " +
          "to produce dense, normalized vectors $v_d \\in \\mathbb{R}^{d}$ (typically $d = 768$ to $3072$). " +
          "At query time, the user's natural language question is embedded using the exact same model " +
          "into query vector $v_q$. The retrieval engine searches an **Approximate Nearest Neighbor (ANN)** " +
          "index (such as **HNSW - Hierarchical Navigable Small World**) to find the documents maximizing " +
          "cosine similarity: $\\text{Score} = \\cos(v_q, v_d) = \\frac{v_q \\cdot v_d}{\\|v_q\\| \\|v_d\\|}$. " +
          "Because the model maps meaning rather than spelling, queries like *'How to fix a flat tyre'* " +
          "retrieve documents discussing *'Repairing punctured bicycle wheels'* with high confidence. " +
          "However, pure semantic search suffers on **out-of-domain technical queries** (e.g. error code `ERR_0x80070005`), " +
          "which is why enterprise search engines universally implement **Hybrid Search**—merging dense semantic " +
          "scores with sparse BM25 scores."
      },

      miss: [
        {
          w: "Semantic search makes traditional keyword search (BM25) completely obsolete.",
          r: "Pure semantic search frequently hallucinates conceptual matches for exact SKU numbers, legal case numbers, and code identifiers. Industry state-of-the-art is HYBRID search combining BM25 and vector embeddings."
        },
        {
          w: "Semantic search evaluates a complex neural network on every document in the database during search.",
          r: "Documents are embedded ONCE offline and indexed in a vector database. At query time, only the user's query is embedded, and fast vector indexing (HNSW) retrieves nearest neighbors in sub-millisecond time."
        },
        {
          w: "Any embedding model works equally well for all languages and domains.",
          r: "General embedding models degrade on specialized medical, legal, or code domains. Embedding quality must be verified against domain benchmarks like the Massive Text Embedding Benchmark (MTEB)."
        },
        {
          w: "Cross-Encoders are used to embed entire databases for semantic search.",
          r: "Cross-Encoders pass query and document jointly through full self-attention, which is $\\mathcal{O}(N)$ and computationally impossible across millions of documents. Bi-encoders are used for retrieval; Cross-encoders are reserved for re-ranking the top ~50 candidates."
        }
      ],

      trade: {
        buys: [
          "Captures human conceptual intent, synonyms, multi-lingual translations, and paraphrased queries effortlessly.",
          "Delivers superior recall compared to brittle exact-match keyword algorithms.",
          "Powers modern vector retrieval in Retrieval-Augmented Generation (RAG) and recommendation systems."
        ],
        costs: [
          "High memory footprint: storing millions of 1536-dimensional float32 vectors requires gigabytes of RAM in vector databases.",
          "Struggles with exact keyword, part number, and alphanumeric identifier matching without hybrid BM25 support.",
          "Embedding drift: updating the embedding model requires re-embedding and re-indexing the entire multi-terabyte document corpus."
        ],
        avoid: [
          "Deploying pure vector search without BM25 keyword matching for enterprise technical documentation.",
          "Re-embedding documents dynamically on every search query instead of pre-indexing vectors."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cosine-similarity",

      why: {
        before: "Comparing document similarity using Euclidean distance ($L_2$) caused long documents " +
          "to appear distant from short queries simply because longer texts had higher word count magnitudes.",
        problem: "Vector magnitude reflects document length rather than semantic meaning; " +
          "information retrieval requires a metric that isolates the directional orientation of vectors while ignoring scale.",
        shift: "**Cosine Similarity: Normalized angular orientation metric.** " +
          "Compute the cosine of the angle between two vectors: $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$, " +
          "bounding similarity strictly in $[-1, 1]$ where $1.0$ indicates identical direction regardless of vector magnitude."
      },

      num: {
        t: "Vector distance metrics mathematical comparison & operational properties",
        h: ["Metric", "Mathematical Formula", "Output Range", "Significance in Vector Search"],
        r: [
          ["**Cosine Similarity**", "$\\frac{u \\cdot v}{\\|u\\| \\|v\\|} = \\cos(\\theta)$", "$[-1, 1]$ ($1.0 = \\text{identical}$)", "**Invariant to vector magnitude**; standard in NLP and embeddings"],
          ["**Cosine Distance**", "$1 - \\cos(\\theta)$", "$[0, 2]$", "Converts similarity into a valid metric distance ($0 = \\text{identical}$)"],
          ["**Dot Product (Inner Product)**", "$u \\cdot v = \\sum u_i v_i$", "($-\\infty, \\infty$)", "If vectors are unit normalized ($\\|u\\|=1$), **Dot Product is identical to Cosine Similarity**!"],
          ["**Euclidean Distance ($L_2$)**", "$\\sqrt{\\sum (u_i - v_i)^2}$", "$[0, \\infty)$", "For normalized vectors: $\\|u - v\\|^2 = 2 - 2\\cos(\\theta)$ (monotonic equivalence)"],
          ["**Hardware Optimization**", "**Unit-normalize vectors upon insertion**", "Runs pure Dot Product", "Saves $\\mathcal{O}(d)$ floating-point square root divisions per query"]
        ],
        n: "Cosine Similarity is the foundational mathematical metric governing " +
          "embedding comparisons and vector databases. Given two vectors $u, v \\in \\mathbb{R}^d$, " +
          "the metric evaluates the dot product divided by the product of their Euclidean norms: " +
          "$\\text{sim}(u, v) = \\frac{\\sum_{i=1}^d u_i v_i}{\\sqrt{\\sum u_i^2} \\sqrt{\\sum v_i^2}} = \\cos(\\theta)$. " +
          "By dividing out the magnitudes $\\|u\\|$ and $\\|v\\|$, the metric isolates the pure " +
          "**angular orientation** of the vectors in high-dimensional space: " +
          "if two vectors point in the exact same direction, $\\cos(0^\\circ) = 1.0$; " +
          "if they are orthogonal (unrelated), $\\cos(90^\\circ) = 0.0$; " +
          "if they point in opposite directions, $\\cos(180^\\circ) = -1.0$. " +
          "In production vector databases (Milvus, Pinecone, Qdrant), computing square roots " +
          "and norms during search adds unnecessary floating-point latency. " +
          "Engineers apply a critical optimization: **pre-normalize all vectors to unit length ($\\|v\\|_2 = 1.0$) " +
          "upon ingestion**. Once vectors have unit norm, the denominator collapses: $\\frac{u \\cdot v}{1 \\times 1} = u \\cdot v$. " +
          "Cosine similarity becomes mathematically identical to the **Dot Product**, allowing vector " +
          "search to run at maximum GPU BLAS execution speed."
      },

      miss: [
        {
          w: "Cosine similarity cannot be negative for neural network embeddings.",
          r: "Cosine similarity outputs range strictly from -1 to +1. While text embeddings often cluster in a positive cone (values in [0, 1]), negative cosine similarities are mathematically valid and occur regularly."
        },
        {
          w: "Cosine similarity is a true mathematical distance metric.",
          r: "Cosine similarity is a similarity metric, not a distance. Even 'Cosine Distance' ($1 - \\cos$) violates the triangle inequality ($d(x, z) \\le d(x, y) + d(y, z)$), making it a pseudo-metric (though angular distance $\\arccos(\\cos)/\\pi$ is a true metric)."
        },
        {
          w: "A cosine similarity of 0.90 between two documents means they share 90% of their words.",
          r: "Cosine similarity measures directional alignment in latent continuous space, not lexical word overlap. Two documents can have 0.90 cosine similarity while sharing zero common words if they discuss the exact same concept using different synonyms."
        },
        {
          w: "Euclidean distance is always inferior to cosine similarity.",
          r: "When embedding vectors are L2-normalized to unit length, Euclidean distance and Cosine similarity are strictly monotonically related ($\\|u - v\\|^2 = 2 - 2\\cos(\\theta)$), producing the exact same ranking."
        }
      ],

      trade: {
        buys: [
          "Scale invariance: compares document and query semantics without bias toward document length.",
          "Bounded dynamic range $[-1, 1]$ simplifies thresholding and score filtering.",
          "Pre-normalization converts cosine calculations into high-speed GPU dot products."
        ],
        costs: [
          "Ignores vector magnitude: in models where magnitude encodes frequency or confidence, that signal is lost.",
          "Non-metric nature ($1 - \\cos$) can complicate spatial tree partitioning in certain indexing data structures.",
          "In extremely high dimensions, random vectors tend toward orthogonality ($0.0$), narrowing the discriminative band."
        ],
        avoid: [
          "Computing unnormalized cosine similarity inside tight search loops (always pre-normalize vectors to unit length).",
          "Assuming high cosine similarity proves factual agreement (an argumentative rebuttal often has high cosine similarity to the claim it refutes)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "fine-tuning",

      why: {
        before: "Adapting an AI model to a specialized corporate domain required training a model from scratch, " +
          "which cost millions of dollars and failed due to lack of massive training data.",
        problem: "General-purpose pre-trained foundation models lack specialized domain jargon, corporate style, " +
          "and specific task behaviors, while in-context prompting is constrained by context window limits and latency.",
        shift: "**Fine-Tuning: Supervised parameter weight adaptation.** " +
          "Take a pre-trained foundation model and continue training its neural weights on a curated domain-specific " +
          "dataset $(X, Y)$ using a small learning rate, modifying the model's internal representations to specialize its behavior."
      },

      num: {
        t: "Fine-Tuning vs Prompting vs RAG comparison matrix",
        h: ["Dimension / Requirement", "Prompt Engineering", "Retrieval-Augmented Generation (RAG)", "Fine-Tuning (SFT / LoRA)"],
        r: [
          ["**Primary Purpose**", "Steering behavior & format", "**Injecting dynamic external factual knowledge**", "**Learning specialized style, syntax, tone & task grammar**"],
          ["**Weight Updates**", "**Zero** (weights frozen)", "**Zero** (weights frozen)", "**Yes** (updates weights or adapter layers)"],
          ["**Factual Accuracy Guarantee**", "Low (relies on parametric memory)", "**High** (grounded in retrieved documents)", "Medium (prone to hallucinating learned facts)"],
          ["**Cost & Compute to Implement**", "**Near zero** (text editing)", "Medium (Vector DB + embeddings)", "High (GPU training runs, dataset curation)"],
          ["**Latency at Inference**", "High (long prompts consume tokens)", "Medium (retrieval overhead)", "**Lowest**: short prompts; knowledge baked into weights"]
        ],
        n: "Fine-Tuning is the process of adjusting the parameter weights " +
          "of a pre-trained neural network on a task-specific supervised dataset. " +
          "While pre-training instills broad world knowledge and linguistic grammar across " +
          "trillions of unlabeled tokens, fine-tuning aligns the model's output distribution " +
          "to a specific domain, tone, or operational contract. Fine-tuning is typically executed " +
          "using **Supervised Fine-Tuning (SFT)**: the model is presented with high-quality demonstration " +
          "pairs $(x_i, y_i)$ (e.g. medical queries and physician-vetted responses), and cross-entropy loss " +
          "is minimized strictly over the completion tokens: " +
          "$\\mathcal{L}_{\\text{SFT}} = -\\sum_{t=1}^{|y|} \\log P_\\theta(y_t \\mid x, y_{<t})$. " +
          "To prevent **Catastrophic Forgetting** (where the model loses its general reasoning abilities), " +
          "fine-tuning uses learning rates that are orders of magnitude smaller than pre-training " +
          "(e.g. $10^{-5}$ vs $10^{-3}$), often paired with **Parameter-Efficient Fine-Tuning (PEFT / LoRA)** " +
          "which freezes the base model weights entirely and trains lightweight low-rank adapters."
      },

      miss: [
        {
          w: "Fine-tuning is the best way to teach an LLM new factual knowledge.",
          r: "Fine-tuning is terrible for teaching facts: models hallucinate factual details learned via fine-tuning and cannot cite sources. Fine-tuning teaches STYLE, SYNTAX, and TONE; factual knowledge must be provided via RAG."
        },
        {
          w: "Fine-tuning requires millions of labeled examples.",
          r: "Thanks to foundational pre-training, modern Instruction Fine-Tuning requires only 1,000 to 10,000 high-quality, meticulously curated examples (as proven by the LIMA paper: *Less Is More for Alignment*)."
        },
        {
          w: "Fine-tuning a model on private data guarantees data privacy at inference time.",
          r: "Models can be prompted or jailbroken to regurgitate verbatim snippets of their fine-tuning data (training data extraction attacks). Fine-tuning is NOT a secure vault for private secrets."
        },
        {
          w: "Fine-tuning always requires updating 100% of the model's parameters.",
          r: "Modern enterprise fine-tuning overwhelmingly uses LoRA (Low-Rank Adaptation) or QLoRA, which updates less than 0.1% of the model parameters while matching full fine-tuning performance."
        }
      ],

      trade: {
        buys: [
          "Bakes complex formatting rules, tone, and domain syntax directly into model weights.",
          "Shortens prompt lengths: eliminates the need for long few-shot prompt exemplars, cutting inference latency and cost.",
          "Enables smaller open models (8B) to match or outperform frontier models (70B) on narrow specialized tasks."
        ],
        costs: [
          "Requires curating, cleaning, and validating thousands of high-quality demonstration pairs.",
          "GPU training costs and MLOps maintenance: managing checkpoints, evaluation pipelines, and model hosting.",
          "Risk of Catastrophic Forgetting: fine-tuning on a narrow task can degrade general reasoning and coding abilities."
        ],
        avoid: [
          "Using fine-tuning as a substitute for RAG when the problem requires up-to-date, verifiable factual retrieval.",
          "Fine-tuning on low-quality, noisy, synthetic datasets without manual data curation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "instruction-tuning",

      why: {
        before: "Base pre-trained language models were raw statistical text completion engines: " +
          "when asked 'What is the capital of France?', a base model would often autocomplete with 'What is the capital of Spain?'.",
        problem: "Users expect an AI assistant to act as a helpful agent that answers questions and follows commands, " +
          "not an autocomplete simulator that mirrors arbitrary internet forum behavior.",
        shift: "**Instruction Tuning (FLAN, InstructGPT): Teaching models to act as conversational assistants.** " +
          "Fine-tune pre-trained base models across thousands of diverse tasks formatted as explicit instructional prompts " +
          "paired with helpful, honest, and harmless human-style responses, unlocking reliable zero-shot instruction following."
      },

      num: {
        t: "Base Model vs Instruction-Tuned Model behavior comparison",
        h: ["Prompt Input", "Base Model Behavior (Pre-Trained)", "Instruction-Tuned Model Behavior (Instruct / Chat)"],
        r: [
          ["**'Translate to French: The book is blue.'**", "Appends: *'The car is red. The sky is grey.'* (mimics parallel list)", "Outputs: *'Le livre est bleu.'* (executes instruction directly)"],
          ["**'Write a Python function to compute factorial.'**", "Appends: *'Write a function to compute fibonacci.'* (mimics exam)", "Outputs clean, documented Python code matching specification"],
          ["**'Explain quantum computing to a 10-year-old.'**", "Autocompletes with scientific paper citations or forum comments", "Adopts pedagogical tone, uses metaphors, simplifies vocabulary"],
          ["**Zero-Shot Task Transfer**", "Poor: requires few-shot prompt priming to recognize task", "**Superior**: generalizes to completely unseen tasks described in plain English"],
          ["**Training Corpus Size**", "Trillions of raw web tokens ($10^{12}$)", "Thousands of curated instruction pairs ($10^3 - 10^5$)"]
        ],
        n: "Instruction Tuning is the pivotal evolutionary bridge between " +
          "raw foundation models and deployable conversational assistants. " +
          "Pioneered by Google's **FLAN** (Wei et al. 2021) and OpenAI's **InstructGPT** (Ouyang et al. 2022), " +
          "instruction tuning fine-tunes a base model on a multi-task dataset where inputs are structured " +
          "as direct natural language commands: *'Summarize this article'*, *'Extract all dates from this email'*, " +
          "*'Refactor this SQL query'*. " +
          "The core scientific discovery was **Cross-Task Generalization**: by training a model on hundreds " +
          "of disparate instruction-response pairs, the model learns the meta-concept of **instruction following**. " +
          "At test time, the model can successfully follow completely novel, unseen instructions with zero examples. " +
          "Instruction tuning was democratized by Stanford's **Alpaca** (2023), which demonstrated " +
          "that high-quality instruction datasets could be generated synthetically by prompting a teacher model " +
          "(**Self-Instruct**), allowing an open 7B model to be instruction-tuned for less than $500."
      },

      miss: [
        {
          w: "Instruction tuning increases the model's factual knowledge base.",
          r: "Instruction tuning does not teach new facts; it teaches the model how to ACCESS and FORMAT the knowledge it already absorbed during pre-training. It aligns the interface, not the information."
        },
        {
          w: "Base models are useless and should never be used in production.",
          r: "Base models are essential for continuous domain pre-training (e.g. training on medical books) and custom fine-tuning. Base models possess raw capability without the refusal constraints imposed by instruction alignment."
        },
        {
          w: "Instruction tuning requires millions of human-written instruction examples.",
          r: "Zhou et al. (2023, *LIMA*) proved that training on just 1,000 meticulously curated, high-quality instruction demonstrations is sufficient to achieve competitive conversational alignment."
        },
        {
          w: "Instruction tuning and Reinforcement Learning from Human Feedback (RLHF) are the exact same thing.",
          r: "Instruction tuning is supervised fine-tuning (SFT) on static input-output pairs. RLHF is a secondary phase that uses a reward model and policy gradient optimization (PPO/DPO) to refine safety, tone, and nuanced preferences."
        }
      ],

      trade: {
        buys: [
          "Transforms raw autocomplete engines into intuitive, conversational assistants that follow user intent.",
          "Unlocks powerful zero-shot generalization across novel, unseen tasks and domain commands.",
          "Enforces structured prompt compliance (JSON output, markdown formatting, role-playing)."
        ],
        costs: [
          "Can induce 'alignment tax': slightly degrades raw creative performance or niche benchmark perplexity.",
          "Synthetic instruction tuning datasets can cause models to adopt superficial, verbose conversational boilerplate.",
          "Increases model sycophancy: models often agree with user misconceptions rather than correcting them."
        ],
        avoid: [
          "Deploying raw base models directly to end users expecting an interactive conversational chatbot.",
          "Training on massive low-quality web scrapes for instruction tuning (always prioritize data quality over quantity)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "peft",

      why: {
        before: "Full fine-tuning of Large Language Models required updating 100% of model weights, " +
          "requiring massive multi-GPU clusters and storing a full multi-gigabyte checkpoint for every downstream task.",
        problem: "Fine-tuning a 70B parameter model in FP16 requires over 140 GB just for weights, plus 280 GB for optimizer states; " +
          "deploying 50 customized enterprise models would require terabytes of storage and dozens of dedicated servers.",
        shift: "**Parameter-Efficient Fine-Tuning (PEFT): Freezing the base foundation.** " +
          "Freeze the pre-trained model weights entirely and train only a tiny subset ($<1\\%$) of specialized parameters " +
          "(via Low-Rank Adaptation, Prefix Tuning, or Prompt Tuning), matching full fine-tuning performance at a fraction of the compute."
      },

      num: {
        t: "PEFT taxonomy & architectural mechanisms",
        h: ["PEFT Family", "Mechanism / Architecture", "Trainable Parameter Share", "Inference Latency Impact"],
        r: [
          ["**LoRA (Low-Rank Adaptation)**", "Injects low-rank trainable decomposition matrices into attention weights", "**$0.01\\% - 0.1\\%$**", "**Zero overhead**: adapters merge directly into base weights ($W_0 + BA$)"],
          ["**QLoRA (Quantized LoRA)**", "4-bit NormalFloat base model + 16-bit LoRA adapters", "**$<0.1\\%$**", "**Runs on single consumer GPU** (e.g. fine-tune 70B on 2x RTX 3090)"],
          ["**Prefix Tuning (Li & Liang 2021)**", "Prepends learnable continuous virtual prefix vectors to Keys/Values", "$\\approx 0.1\\% - 1.0\\%$", "Consumes context window token slots; minor latency"],
          ["**Prompt Tuning (Lester 2021)**", "Prepends learnable virtual prompt vectors to input embedding layer", "$\\approx 0.01\\%$", "Effective only at massive scale ($>10\\text{B}$); consumes context tokens"],
          ["**Adapters (Houlsby 2019)**", "Inserts small bottleneck feedforward blocks after attention and FFN layers", "$\\approx 1\\% - 3\\%$", "Adds sequential layers: increases inference forward pass latency by $5-10\\%$"]
        ],
        n: "Parameter-Efficient Fine-Tuning (PEFT) is the technological breakthrough " +
          "that democratized LLM adaptation. In standard full fine-tuning, storing the model weights, " +
          "gradients, and optimizer states (Adam maintains two floats per weight) requires " +
          "roughly **16 to 20 bytes of VRAM per parameter** during training. For a 70B model, " +
          "this requires over **1.2 Terabytes of VRAM**! " +
          "PEFT fundamentally reframes adaptation based on the **Intrinsic Rank Hypothesis** " +
          "(Aghajanyan et al. 2020): the parameter updates $\\Delta W$ for downstream tasks " +
          "have a very low 'intrinsic dimension' and can be represented accurately in a tiny subspace. " +
          "PEFT algorithms keep the pre-trained weights $W_0$ completely frozen, avoiding optimizer " +
          "state memory for 99.9% of the network. Only lightweight adapter parameters are trained. " +
          "The resulting fine-tuned artifact is not a 140 GB model checkpoint, but a tiny **10 to 50 Megabyte " +
          "adapter file** that can be loaded, swapped, or served dynamically on top of a single shared base model."
      },

      miss: [
        {
          w: "PEFT is an inferior compromise that always achieves lower accuracy than full fine-tuning.",
          r: "On standard domain adaptation benchmarks, PEFT (especially LoRA) matches or exceeds full fine-tuning accuracy because freezing the base model acts as a powerful regularizer that prevents catastrophic forgetting."
        },
        {
          w: "PEFT adapters cannot be merged into the base model.",
          r: "LoRA weight updates $BA$ can be added directly into base weights $W = W_0 + BA$ via standard matrix addition, creating a single unified model that incurs ZERO inference latency penalty."
        },
        {
          w: "You need a separate GPU cluster for every fine-tuned PEFT model in production.",
          r: "Modern serving engines (vLLM, S-LoRA) serve hundreds of distinct LoRA adapters simultaneously on a single GPU hosting one shared base model, routing user requests to specific adapters dynamically in RAM."
        },
        {
          w: "PEFT can only be used on decoder-only language models.",
          r: "PEFT is architecture-agnostic: it is widely used on vision models (Vision Transformers, Stable Diffusion LoRAs), speech models (Whisper), and encoder models (BERT)."
        }
      ],

      trade: {
        buys: [
          "Slashes fine-tuning VRAM requirements by up to 75%, enabling adaptation on consumer-grade GPUs.",
          "Tiny storage footprints: saves 20MB adapter files instead of 140GB monolithic model checkpoints.",
          "Multi-tenant serving: host hundreds of customized enterprise models on a single GPU using dynamic adapter routing."
        ],
        costs: [
          "Hyperparameter tuning: requires selecting rank $r$, alpha scaling $\\alpha$, and target module projection layers.",
          "Prefix and Adapter methods can add inference latency if not algebraically mergeable.",
          "Slightly less expressive than full fine-tuning when the target domain requires a complete overhaul of foundational knowledge."
        ],
        avoid: [
          "Executing full fine-tuning on massive LLMs without testing LoRA or QLoRA first.",
          "Setting LoRA rank $r$ excessively high (e.g. $r=256$), which wastes memory without improving task accuracy."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lora",

      why: {
        before: "Adapting deep models using Houlsby-style adapter layers introduced extra sequential layers, " +
          "increasing inference forward-pass latency, while Prefix Tuning consumed precious context window tokens.",
        problem: "Enterprises need parameter-efficient adaptation that trains on minimal GPU memory " +
          "while guaranteeing zero additional inference latency during production serving.",
        shift: "**LoRA (Low-Rank Adaptation, Hu et al. 2021): Factorized matrix decomposition.** " +
          "Freeze base weight matrices $W_0 \\in \\mathbb{R}^{d \\times k}$ and parameterize the weight update " +
          "as the product of two low-rank matrices: $\\Delta W = \\frac{\\alpha}{r} B A$, where $B \\in \\mathbb{R}^{d \\times r}$ " +
          "and $A \\in \\mathbb{R}^{r \\times k}$ with rank $r \\ll \\min(d, k)$, adding zero latency upon weight folding."
      },

      num: {
        t: "LoRA mathematical formulation, parameter reduction & rank scaling",
        h: ["Property / Parameter", "Mathematical Formulation", "Typical Setting / Value", "Operational Significance"],
        r: [
          ["**Forward Pass Formulation**", "$h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x$", "$W_0$ frozen; $A, B$ trainable", "Evaluates low-rank parallel bypass during training"],
          ["**Matrix Dimensions**", "$A \\in \\mathbb{R}^{r \\times k}; \\, B \\in \\mathbb{R}^{d \\times r}$", "$r \\in \\{8, 16, 32, 64\\}$", "$r \\ll d$: slashes parameter count by **$>99\\%$**"],
          ["**Initialization Strategy**", "$A \\sim \\mathcal{N}(0, \\sigma^2); \\, B = 0$", "$BA = 0$ at step zero", "**Guarantees $\\Delta W = 0$ initially**: model starts identical to pre-trained base"],
          ["**Scaling Factor ($\\alpha$)**", "$\\frac{\\alpha}{r}$ scaling constant", "Typically $\\alpha = 2r$ or $\\alpha = r$", "Eliminates need to retune learning rate when experimenting with rank $r$"],
          ["**Production Weight Folding**", "$W_{\\text{deploy}} = W_0 + \\frac{\\alpha}{r} B A$", "**Zero latency penalty**", "Pre-computes exact sum matrix; merges directly into base weights"]
        ],
        n: "Low-Rank Adaptation (LoRA) is the undisputed industry standard " +
          "for fine-tuning foundation models (Edward Hu et al., Microsoft 2021). " +
          "LoRA is predicated on the insight that the change in weights $\\Delta W$ during task adaptation " +
          "has a very low intrinsic rank. For a dense linear layer with weight matrix $W_0 \\in \\mathbb{R}^{d \\times k}$, " +
          "LoRA keeps $W_0$ frozen and represents the update $\\Delta W$ as the product of two low-rank " +
          "matrices: $\\Delta W = B A$, where $B \\in \\mathbb{R}^{d \\times r}$ and $A \\in \\mathbb{R}^{r \\times k}$, " +
          "with rank $r \\ll \\min(d, k)$ (typically $r = 8$ or $16$). " +
          "If $d = k = 4096$ and $r = 8$, the original weight matrix contains $4096 \\times 4096 \\approx 16.7$ million parameters, " +
          "while the LoRA matrices contain only $(4096 \\times 8) + (8 \\times 4096) = 65,536$ parameters—a **99.6% parameter reduction**! " +
          "Crucially, matrix $A$ is initialized from a Gaussian distribution, while matrix $B$ is initialized " +
          "to **all zeros**, ensuring that at step zero, $\\Delta W = B A = 0$, so the model begins training " +
          "from the exact unmodified state of the base model. " +
          "For production deployment, LoRA introduces **Zero Inference Latency**: because matrix multiplication " +
          "is linear ($W_0 x + BAx = (W_0 + BA)x$), the adapter product $BA$ can be added directly into " +
          "the base weights in memory prior to serving, executing as a standard, unified linear layer."
      },

      miss: [
        {
          w: "LoRA must be applied to every single linear layer in the Transformer.",
          r: "Historically, LoRA was applied only to attention projection matrices ($W_q, W_v$). Modern practice applies LoRA to all linear matrices ($W_q, W_k, W_v, W_o$ and FFN gate/up/down layers), which allows using smaller ranks (e.g. $r=8$ or $r=16$) with superior accuracy."
        },
        {
          w: "Setting LoRA rank r = 128 is always better than r = 16.",
          r: "Empirical studies prove that rank $r=8$ or $r=16$ captures nearly all necessary task adaptation capacity. Excessively high ranks ($r \\ge 128$) increase VRAM, slow down training, and increase the risk of overfitting without measurable accuracy gains."
        },
        {
          w: "LoRA modifies the base model weights permanently on disk.",
          r: "The base model weights remain untouched. LoRA generates a separate lightweight adapter file (10-50MB). You can dynamically mount, unmount, or merge the adapter into the base weights as needed."
        },
        {
          w: "QLoRA and LoRA are completely different adaptation algorithms.",
          r: "QLoRA is mathematically identical to LoRA: it simply quantizes the frozen base model weights to 4-bit NormalFloat (NF4) to save VRAM, while training 16-bit LoRA adapter matrices via paged optimizers."
        }
      ],

      trade: {
        buys: [
          "Over 99% parameter reduction: fine-tune 70B parameter models on modest GPU clusters.",
          "Zero inference latency: adapters merge directly into base model weights via matrix addition ($W_0 + BA$).",
          "Decoupled multi-task deployment: store dozens of specialized domain adapters (20MB each) for a single base model."
        ],
        costs: [
          "Requires selecting target layers and tuning rank $r$ and scaling factor $\\alpha$.",
          "Cannot fundamentally alter deep architectural configurations (e.g. changing context window geometry or vocabulary).",
          "Dynamic unmerged multi-adapter serving requires specialized runtimes (e.g. S-LoRA, vLLM)."
        ],
        avoid: [
          "Setting rank $r > 32$ without first validating if $r=8$ or $r=16$ achieves the required benchmark accuracy.",
          "Forgetting to merge LoRA adapters into base weights when deploying dedicated single-task production endpoints."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "quantisation",

      why: {
        before: "Neural networks were trained and served in 32-bit single-precision floating-point (FP32), " +
          "requiring massive GPU memory bandwidth, expensive enterprise VRAM, and consuming high electrical power.",
        problem: "Serving a 70B parameter model in FP32 requires 280 GB of VRAM; a 405B model requires 1.6 TB, " +
          "making local edge inference and high-throughput enterprise serving economically unsustainable.",
        shift: "**Neural Quantisation: Low-precision numerical representation.** " +
          "Compress weights and activations from FP32/FP16 into lower-precision numerical formats (INT8, INT4, FP8, NF4) " +
          "using Post-Training Quantisation (PTQ) or Quantisation-Aware Training (QAT), slashing VRAM by 50-75% with negligible perplexity degradation."
      },

      num: {
        t: "Quantisation precision formats & memory footprints for a 70B model",
        h: ["Precision Format", "Bits per Parameter", "VRAM Footprint (70B Model)", "Perplexity Impact", "Dominant Framework / Target"],
        r: [
          ["**FP32 (Single Precision)**", "$32$ bits ($4$ bytes)", "$280\\text{ GB}$", "Baseline standard", "High-precision scientific research"],
          ["**FP16 / BF16 (Half Precision)**", "$16$ bits ($2$ bytes)", "$140\\text{ GB}$", "**Zero loss**", "Standard model training & native weights"],
          ["**FP8 (E4M3 / E5M2)**", "$8$ bits ($1$ byte)", "$70\\text{ GB}$", "**Near-zero loss**", "**Nvidia H100 / Hopper Tensor Cores**; standard enterprise serving"],
          ["**INT8 (W8A8 / W8A16)**", "$8$ bits ($1$ byte)", "$70\\text{ GB}$", "$< 0.05$ perplexity delta", "SmoothQuant, bitsandbytes"],
          ["**INT4 (GPTQ / AWQ / GGUF)**", "$4$ bits ($0.5$ bytes)", "**$35\\text{ GB}$ (75% savings!)**", "$< 0.2$ perplexity delta", "**Consumer GPU (RTX 3090/4090) & local edge (llama.cpp)**"]
        ],
        n: "Quantisation is the science of mapping continuous high-precision " +
          "floating-point values to discrete, low-bit representations: " +
          "$q = \\text{round}\\left(\\frac{x}{S}\\right) + Z$, where $S$ is a floating-point " +
          "scale factor and $Z$ is an integer zero-point offset. " +
          "Because neural networks are overparameterized, their learned weights exhibit extreme " +
          "topological resilience to small numerical perturbations. " +
          "Quantisation operates along two primary methodologies: " +
          "(1) **Post-Training Quantisation (PTQ)**: quantizes a pre-trained model directly without retraining. " +
          "Modern advanced PTQ algorithms include **AWQ (Activation-aware Weight Quantization)** " +
          "(which protects the top 1% of salient weight channels that correspond to large activation outliers) " +
          "and **GPTQ** (which uses second-order Taylor expansions of layer Hessians to iteratively compensate for quantization error). " +
          "(2) **Quantisation-Aware Training (QAT)**: models the rounding noise during training using " +
          "straight-through estimators (STE), allowing weights to adapt to low-precision representation. " +
          "For edge deployment on CPUs and Apple Silicon, Georgi Gerganov's **`llama.cpp` and GGUF format** " +
          "utilize advanced k-quants (mixed 2-bit to 6-bit precision per layer block), allowing 70B models " +
          "to run locally on consumer workstations."
      },

      miss: [
        {
          w: "Quantizing a model from FP16 to INT4 cuts its accuracy in half.",
          r: "Modern 4-bit quantization techniques (AWQ, GPTQ) incur less than a 0.2 perplexity degradation on large models (70B+), delivering virtually indistinguishable real-world reasoning and generation quality."
        },
        {
          w: "Quantisation always makes inference 4x faster on all hardware.",
          r: "While weight-only quantization slashes memory bandwidth (which speeds up memory-bound single-user autoregressive decoding), executing INT4 math on hardware that lacks native INT4 ALUs requires dequantizing weights back to FP16 in registers, yielding modest compute speedups."
        },
        {
          w: "Weight-only quantization (W4A16) is identical to weight-and-activation quantization (W8A8).",
          r: "Weight-only quantization compresses model storage and VRAM footprint, but activations remain FP16. Weight-activation quantization (W8A8 / FP8) quantizes both, enabling high-throughput fused low-precision Tensor Core compute."
        },
        {
          w: "Smaller models quantize better than larger models.",
          r: "The exact opposite is true: larger models (70B+) have higher parameter redundancy and quantize to 4-bit with near-zero degradation. Tiny models (<3B) suffer noticeable accuracy drops at 4-bit precision."
        }
      ],

      trade: {
        buys: [
          "Slashes VRAM consumption by 50% to 75%, allowing massive models to run on consumer hardware or smaller cloud instances.",
          "Dramatically accelerates token generation speeds in memory-bandwidth-bound single-user serving scenarios.",
          "Drastically cuts energy, cooling, and cloud hardware operating costs."
        ],
        costs: [
          "Small accuracy and perplexity degradation on very low precision formats (3-bit and 2-bit).",
          "Activation outliers in deep Transformer layers can cause catastrophic quantization clipping if unhandled.",
          "Pre-quantization calibration passes require dedicated GPU compute and sample calibration datasets."
        ],
        avoid: [
          "Using naive round-to-nearest quantization on LLMs without outlier protection (use AWQ, GPTQ, or GGUF).",
          "Quantizing small models (<3B parameters) below 4-bit precision without extensive benchmark evaluation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inference-cost",

      why: {
        before: "Organizations evaluated AI feasibility purely based on initial training compute budgets, " +
          "treating operational inference serving as a negligible secondary expense.",
        problem: "In production, an LLM serving millions of customer queries generates inference costs " +
          "that exceed the initial training cost within weeks or months, creating massive financial burn.",
        shift: "**Inference Cost Economics: Memory-bandwidth bound serving optimization.** " +
          "Model inference economics through hardware utilization (FLOPs vs Memory Bandwidth), " +
          "decoupling Prompt Pre-fill from Autoregressive Token Generation, and optimizing costs via quantization, vLLM PagedAttention, and model routing."
      },

      num: {
        t: "Inference phases operational & economic cost profile",
        h: ["Inference Phase", "Hardware Bound Regime", "Latency Metric", "Cost Optimization Lever"],
        r: [
          ["**Prefill Phase (Prompt Processing)**", "**Compute Bound** (High Arithmetic Intensity)", "Time-To-First-Token (TTFT)", "Chunked prefill, prompt caching, FlashAttention"],
          ["**Decode Phase (Token Generation)**", "**Memory Bandwidth Bound** (Low Arithmetic Intensity)", "Inter-Token Latency (Time per Output Token)", "**PagedAttention (vLLM)**, Speculative Decoding, Quantisation"],
          ["**KV-Cache VRAM Cost**", "$2 \\times 2 \\times B \\times L \\times n_{\\text{layers}} \\times d$", "Scales linearly with concurrent users & context", "**Grouped-Query Attention (GQA)**, KV-cache quantization (FP8/INT4)"],
          ["**Economics per 1M Tokens**", "Input: \\$0.15 - \\$3.00 / Output: \\$0.60 - \\$15.00", "Output tokens cost **$3\\times$ to $5\\times$ more** than input", "Output length constraints, structured schema enforcement"],
          ["**Model Routing Savings**", "Route $80\\%$ simple queries to 8B, $20\\%$ to 70B", "Blended latency drops by $60\\%$", "**Slashes blended cloud serving bill by up to $70\\%$**"]
        ],
        n: "The financial economics of Large Language Model deployment are governed " +
          "by the physics of GPU hardware. Serving an LLM consists of two fundamentally " +
          "different operational regimes: " +
          "(1) **The Prefill Phase**: the entire user prompt is ingested simultaneously in a single " +
          "parallel forward pass. This phase has high arithmetic intensity and is **Compute Bound**; " +
          "the GPU runs at near-peak TFLOPS efficiency, governing **Time-To-First-Token (TTFT)**. " +
          "(2) **The Decode Phase**: the model generates output tokens autoregressively, one token " +
          "at a time. For every single token produced, all 70 billion parameters must be read from " +
          "GPU High-Bandwidth Memory (HBM) into on-chip cache! This phase has abysmal arithmetic intensity " +
          "and is strictly **Memory-Bandwidth Bound**. Generating a token on an Nvidia H100 (3.35 TB/s bandwidth) " +
          "takes time proportional to model size divided by bandwidth: $\\frac{140\\text{ GB}}{3350\\text{ GB/s}} \\approx 41\\text{ ms/token}$. " +
          "Because memory bandwidth is the primary bottleneck, serving efficiency is achieved by " +
          "**Continuous Batching** and **PagedAttention (vLLM)**, which eliminates VRAM fragmentation. " +
          "Furthermore, output tokens cost significantly more than input tokens because each output token " +
          "requires a separate memory-bandwidth-bound GPU roundtrip."
      },

      miss: [
        {
          w: "Training an LLM is the biggest cost; running inference is cheap.",
          r: "Training is a fixed one-time capital cost. Inference is an ongoing variable cost: for successful production applications, cumulative inference serving costs dwarf pre-training costs within months."
        },
        {
          w: "Input tokens and output tokens cost the exact same amount to generate.",
          r: "Output tokens require sequential memory-bandwidth-bound GPU passes for every single token, whereas input tokens are processed in parallel in one compute-bound pass. Commercial API providers charge 3x to 5x more per output token."
        },
        {
          w: "Buying your own GPU servers is always cheaper than using hosted commercial LLM APIs.",
          r: "Self-hosting requires paying 100% of GPU hardware and electricity costs 24/7 regardless of traffic. If server utilization is low (<40%), commercial pay-per-token serverless APIs are substantially cheaper."
        },
        {
          w: "You should always route all enterprise queries to the most powerful model available.",
          r: "Sending simple extraction, classification, or formatting queries to a massive frontier model (e.g. GPT-4) wastes 90% of the cost. Dynamic model routing directs easy queries to cheap 8B models, reserving frontier models for difficult logic."
        }
      ],

      trade: {
        buys: [
          "Understanding inference bottlenecks allows building high-throughput, financially sustainable AI applications.",
          "Techniques like KV-cache quantization, prompt caching, and vLLM slash serving costs by 70-80%.",
          "Dynamic model routing optimizes the pareto frontier between per-token cost and task accuracy."
        ],
        costs: [
          "Optimizing serving infrastructure requires complex orchestration: continuous batching, tensor parallelism, and cache management.",
          "Aggressive quantization or speculative decoding can introduce subtle latency jitter or rare verification fallbacks.",
          "Prompt caching requires predictable, standardized prompt prefix architectures."
        ],
        avoid: [
          "Hosting self-managed GPU instances with low, bursty utilization when serverless token APIs are cheaper.",
          "Allowing models to generate unbounded, verbose conversational completions when concise structured outputs suffice."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
