/* ==========================================================================
   Depth pass 81 — Generative AI & LLMs batch 1: foundational concepts.
   Generative AI, Large Language Model, Foundation Model, Token,
   Tokenisation, Context Window, Temperature, Prompt.

   Autoregressive probability estimation over discrete token vocabularies;
   temperature-scaled soft distributions condition contextual prompts.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "generative-ai",

      why: {
        before: "Classical AI focused almost entirely on discriminative tasks: estimating conditional " +
          "probabilities $P(Y \\mid X)$ to classify inputs, predict labels, or detect anomalies.",
        problem: "Discriminative models cannot create novel content, synthesize coherent long-form text, " +
          "generate photorealistic images, or simulate complex high-dimensional real-world data distributions.",
        shift: "**Generative AI: Modeling the true joint data distribution $P(X)$.** " +
          "Model the underlying data-generating distribution directly, enabling systems to generate " +
          "novel synthetic samples (text, code, audio, 3D assets, video) by sampling from high-dimensional latent manifolds."
      },

      num: {
        t: "Discriminative vs Generative AI mathematical and operational comparison",
        h: ["Dimension / Property", "Discriminative AI (Classifier / Regressor)", "Generative AI (LLMs / Diffusion)"],
        r: [
          ["**Target Distribution**", "Conditional probability $P(Y \\mid X)$", "**Joint distribution $P(X)$ or $P(X, Y)$**"],
          ["**Mathematical Objective**", "Carves separating decision boundaries between classes", "**Learns density landscape of the data manifold**"],
          ["**Output Capability**", "Discrete class label, bounding box, or scalar score", "**High-dimensional synthetic media** (text, video, audio)"],
          ["**Inference Mechanism**", "Single deterministic forward pass", "**Iterative stochastic sampling** (autoregressive generation, reverse diffusion)"],
          ["**Evaluation Paradigm**", "Deterministic ground truth metrics (Accuracy, F1, MSE)", "Probabilistic / Human evaluation (Perplexity, ELO, Win-Rate, FID)"]
        ],
        n: "Generative AI represents a fundamental mathematical transition from " +
          "**discrimination to generation**. While a discriminative model merely learns " +
          "the boundary separating cats from dogs ($P(y=\\text{cat} \\mid X)$), a generative " +
          "model learns what constitutes a cat ($P(X \\mid y=\\text{cat})$) or models the " +
          "entire data distribution $P(X)$. The mathematics of modern generative AI is divided " +
          "into three primary model families: (1) **Autoregressive Models (Transformers)**, " +
          "which factorize the high-dimensional joint probability of tokens into a sequence " +
          "of conditional distributions via the chain rule: $P(x_1, \\dots, x_T) = \\prod_{t=1}^T P(x_t \\mid x_{<t})$; " +
          "(2) **Diffusion Models**, which model data density by learning the score function " +
          "(gradients of the log probability density $\\nabla_x \\log p(x)$) to invert thermodynamic " +
          "Gaussian noise; and (3) **Generative Adversarial Networks (GANs)** and **VAEs**, " +
          "which map simple Gaussian latent priors $z \\sim \\mathcal{N}(0, I)$ onto complex real-world " +
          "manifolds via non-linear generator functions. Generative AI shifts software engineering " +
          "from writing deterministic instructions to **steering stochastic probabilistic engines**."
      },

      miss: [
        {
          w: "Generative AI creates content by retrieving and stitching together pre-existing database snippets.",
          r: "Generative models do not store or search a database of training examples. They synthesize novel artifacts by sampling trajectories across a continuous high-dimensional probability distribution parameterized by neural weights."
        },
        {
          w: "Generative AI models are strictly deterministic if given the same input.",
          r: "Unless temperature is set to absolute zero and random seeds are strictly locked, generative inference is inherently stochastic, drawing random samples from soft categorical or Gaussian distributions."
        },
        {
          w: "Generative AI understands human facts and real-world physical logic.",
          r: "Generative models learn statistical co-occurrence and grammatical distributions of tokens or pixels. They possess no intrinsic sensorimotor embodiment, intent, or grounding in physical reality."
        },
        {
          w: "Generative models are always superior to discriminative models.",
          r: "For structured tabular risk scoring, fraud detection, and high-precision medical diagnosis, specialized discriminative models (LightGBM, SVMs) are faster, cheaper, and vastly less prone to hallucinations."
        }
      ],

      trade: {
        buys: [
          "Unprecedented creative and cognitive automation: synthesizes fluent text, code, images, audio, and protein structures.",
          "Natural language interfaces: allows non-programmers to interact with complex software systems via plain speech.",
          "High flexibility: a single foundation model can perform thousands of disparate tasks without task-specific retraining."
        ],
        costs: [
          "Non-deterministic outputs and hallucinations require extensive guardrails and validation scaffolding.",
          "Astronomical training and serving costs compared to classical deterministic algorithms.",
          "Copyright, privacy, and intellectual property risks inherent in training on public web crawls."
        ],
        avoid: [
          "Using Generative AI for deterministic calculations (e.g. accounting math) where exact algorithmic software is required.",
          "Deploying un-moderated generative outputs directly to end users without safety guardrails and evaluation gates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "large-language-model",

      why: {
        before: "Natural Language Processing relied on small, task-specific models (e.g. separate models " +
          "for sentiment, entity extraction, and translation), each capped at tens of millions of parameters.",
        problem: "Small models lacked general reasoning, failed on few-shot tasks, and plateaued rapidly in accuracy " +
          "as training data was scaled up.",
        shift: "**Large Language Model (LLM): Giant autoregressive foundation networks.** " +
          "Scale Transformer architectures to tens or hundreds of billions of parameters trained on trillions of tokens, " +
          "unlocking emergent in-context learning, multi-step chain-of-thought reasoning, and zero-shot task execution."
      },

      num: {
        t: "LLM parameter scale regimes & computational requirements",
        h: ["Parameter Scale Regime", "Typical Size", "VRAM (FP16 / 4-bit)", "Hardware Requirement", "Typical Capabilities"],
        r: [
          ["**Small Language Model (SLM)**", "$1\\text{B} - 3\\text{B}$", "$6\\text{ GB} / 2\\text{ GB}$", "Single consumer laptop / edge device", "Basic summarization, fast classification, on-device mobile tasks"],
          ["**Medium Open-Weight LLM**", "$7\\text{B} - 14\\text{B}$", "$28\\text{ GB} / 8\\text{ GB}$", "Single RTX 4090 / Mac M-series", "Strong coding, conversational chat, fluent multi-turn dialogue"],
          ["**Enterprise Foundation Scale**", "$70\\text{B}$", "$140\\text{ GB} / 40\\text{ GB}$", "$2\\times$ to $4\\times$ A100/H100 (80GB)", "Near-frontier reasoning, complex tool calling, agentic execution"],
          ["**Frontier Super-Scale**", "$400\\text{B} - 1\\text{T}+ (\\text{MoE})$", "$800+\\text{ GB}$", "Massive 8-GPU multi-node clusters", "**State-of-the-art benchmark dominance**: deep reasoning, math, PhD-level tasks"]
        ],
        n: "A Large Language Model (LLM) is an overparameterized, decoder-only " +
          "Transformer trained on multi-trillion token text corpora via self-supervised " +
          "next-token prediction. While the fundamental architecture is conceptually identical " +
          "to smaller transformers, **scaling laws** (Kaplan et al. 2020) demonstrated that " +
          "cross-entropy loss follows a strict empirical power-law with compute, dataset size, and " +
          "parameters: $L(N, D) \\propto N^{-\\alpha_N} D^{-\\alpha_D}$. " +
          "As models cross qualitative scale thresholds (typically $>10\\text{B}$ parameters), " +
          "they exhibit **Emergent Capabilities** (Wei et al. 2022)—abilities that do not exist " +
          "in smaller models and cannot be predicted by simple extrapolation, such as multi-step arithmetic, " +
          "symbolic translation, and **In-Context Learning (Few-Shot Prompting)**. " +
          "Modern LLMs are delivered via a three-stage pipeline: (1) **Pre-training** on raw tokens, " +
          "(2) **Supervised Fine-Tuning (SFT)** on conversational instruction demonstrations, and " +
          "(3) **Reinforcement Learning from Human/AI Feedback (RLHF / DPO)** to align outputs " +
          "with human intent, helpfulness, and safety constraints."
      },

      miss: [
        {
          w: "An LLM is a search engine that searches the internet in real time during its forward pass.",
          r: "Standard base LLMs have zero internet access: their responses are generated entirely by passing activations through static neural weights frozen at pre-training time. Real-time internet access requires external RAG or tool-calling frameworks."
        },
        {
          w: "Larger parameter models always outperform smaller models in all deployment scenarios.",
          r: "A smaller model (e.g. 8B) trained on 15 trillion high-quality tokens consistently outperforms an older 70B model trained on only 2 trillion tokens, with 10x faster inference latency and dramatically lower hosting costs."
        },
        {
          w: "LLMs understand the meaning of the words they generate.",
          r: "LLMs are statistical probability estimators over token sequences. They do not possess consciousness, mental models, subjective understanding, or intent."
        },
        {
          w: "An LLM's knowledge can be updated by simply adding new documents to its training folder.",
          r: "Updating an LLM's parametric weights requires computationally expensive fine-tuning or full pre-training. For dynamic real-time knowledge, Retrieval-Augmented Generation (RAG) is standard."
        }
      ],

      trade: {
        buys: [
          "Universal cognitive flexibility: solves translation, coding, summarization, and extraction without task-specific models.",
          "In-context few-shot learning: adapts to new domain tasks instantly via natural language instructions without weight updates.",
          "Unlocks autonomous agentic architectures capable of tool execution, planning, and code synthesis."
        ],
        costs: [
          "Significant inference latency and memory requirements: serving a 70B model requires multiple enterprise GPUs.",
          "Hallucination vulnerabilities: models assert confident factual falsehoods without external ground-truth verification.",
          "Knowledge cutoff: parametric memory is permanently frozen on the date pre-training data was collected."
        ],
        avoid: [
          "Deploying large 70B+ LLMs for simple classification tasks that an 8B model or fine-tuned DeBERTa solves with 50x lower cost.",
          "Assuming an LLM output is factually accurate without secondary verification or grounding."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "foundation-model",

      why: {
        before: "AI development operated in isolated silos: separate teams trained custom vision, " +
          "speech, and NLP models from scratch on specialized domain datasets.",
        problem: "Siloed model development is redundant, expensive, and produces brittle systems " +
          "incapable of cross-modal reasoning or multi-task flexibility.",
        shift: "**Foundation Model (Stanford HAI, Bommasani et al. 2021): Homogenized general-purpose core.** " +
          "Train massive, multi-modal neural backbones on broad internet-scale data that serve as a common foundation " +
          "adaptable to thousands of downstream enterprise tasks via fine-tuning, prompting, and API integration."
      },

      num: {
        t: "Foundation model paradigm shift & ecosystem homogenization",
        h: ["Dimension / Property", "Pre-Foundation Era (Narrow AI)", "Foundation Model Era"],
        r: [
          ["**Model Architecture**", "Bespoke architectures for every single task (CNN, BiLSTM, SVM)", "**Homogenized Transformer architecture** across text, vision, audio, robotics"],
          ["**Training Paradigm**", "Supervised learning on task-specific labeled sets", "**Self-supervised pre-training** on massive web-scale corpora"],
          ["**Downstream Adaptation**", "Retrain whole model from scratch", "**In-context prompting**, LoRA fine-tuning, or API function calling"],
          ["**Ecosystem Centralization**", "Fragmented across thousands of custom models", "**Centralized around a handful of frontier foundation backbones** (OpenAI, Anthropic, Meta, Google)"],
          ["**Failure Blast Radius**", "Isolated to a single application", "**Global blast radius**: a bias or hallucination in the foundation model cascades into thousands of apps"]
        ],
        n: "The term 'Foundation Model' was coined in 2021 by the Stanford Institute " +
          "for Human-Centered Artificial Intelligence (HAI) to capture the profound paradigm shift " +
          "underpinning modern AI. A foundation model is defined as *'any model that is trained on " +
          "broad data at scale and can be adapted (e.g., fine-tuned) to a wide range of downstream " +
          "tasks'*. Rather than training separate bespoke algorithms for medical transcription, " +
          "customer service chat, code generation, and financial analysis, a single foundation model " +
          "(e.g. GPT-4, Llama 3, Gemini) serves as the universal cognitive substrate across all domains. " +
          "This architectural convergence provides unprecedented **economies of scale**: billions " +
          "of dollars in compute are amortized across millions of downstream applications. " +
          "However, Bommasani et al. highlighted that foundation models introduce **extreme systemic homogenization**: " +
          "because hundreds of thousands of downstream commercial products inherit the exact same " +
          "underlying weights, any latent blindspot, systematic bias, hallucination pattern, " +
          "or security vulnerability embedded in the foundation model cascades across the entire global software economy."
      },

      miss: [
        {
          w: "Foundation models are strictly limited to text-based Large Language Models.",
          r: "Foundation models span all perceptual modalities: CLIP (vision-language), Whisper (audio), Segment Anything (SAM - vision segmentation), AlphaFold (biology), and RT-2 (robotics) are all foundation models."
        },
        {
          w: "A foundation model is specialized and ready to be deployed as a vertical enterprise product out of the box.",
          r: "Foundation models are deliberately broad and generalized. Commercial production requires vertical adaptation: domain fine-tuning, prompt engineering, RAG grounding, and strict evaluation guardrails."
        },
        {
          w: "Foundation models eliminate the need for traditional software engineering.",
          r: "Foundation models replace only the core cognitive reasoning layer. Building reliable software requires extensive traditional infrastructure: APIs, databases, CI/CD, deterministic business logic, and monitoring."
        },
        {
          w: "Every enterprise company should train its own proprietary foundation model from scratch.",
          r: "Pre-training a foundation model requires tens of millions of dollars in compute, specialized distributed systems expertise, and petabytes of data. 99% of enterprises achieve superior ROI by adapting open-weight foundation models."
        }
      ],

      trade: {
        buys: [
          "Massive developmental leverage: build sophisticated AI applications in days by prompting pre-trained foundations.",
          "Cross-domain emergence: combines coding, multi-lingual fluency, and visual reasoning in a single unified architecture.",
          "Monotonically improving capabilities: downstream applications automatically benefit whenever foundation providers upgrade backbones."
        ],
        costs: [
          "Single-point-of-failure risk: an upstream model outage, API deprecation, or behavioral drift breaks all downstream services.",
          "Systemic risk amplification: shared biases and security vulnerabilities permeate thousands of dependent apps.",
          "Vendor lock-in and pricing exposure when relying on proprietary closed-source foundation APIs."
        ],
        avoid: [
          "Attempting to pre-train a custom foundation model from scratch without tens of millions of dollars in capital and petabytes of unique data.",
          "Deploying foundation models in safety-critical domains without deterministic verification layers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "token",

      why: {
        before: "Early NLP models operated either on raw individual characters (which produced excessively long sequences " +
          "with weak semantic signal) or whole words (which had massive out-of-vocabulary failures and huge embedding tables).",
        problem: "Language models need a standardized, compact discrete numerical unit that handles arbitrary text, " +
          "code, and punctuation while bounding vocabulary size and optimizing compute efficiency.",
        shift: "**Token: The atomic discrete unit of language model computation.** " +
          "Segment raw Unicode text into chunks of characters or subwords using statistical compression algorithms (BPE), " +
          "mapping each unique chunk to an integer ID within a fixed vocabulary matrix."
      },

      num: {
        t: "Token conversion heuristics, economic pricing & vocabulary sizing",
        h: ["Metric / Property", "Typical Value / Rule of Thumb", "Significance in Model Architecture"],
        r: [
          ["**English Text-to-Token Ratio**", "$100 \\text{ tokens} \\approx 75 \\text{ words}$ ($1 \\text{ token} \\approx 4 \\text{ characters}$)", "Standard conversion heuristic for cost and context length estimation"],
          ["**Vocabulary Size ($V$)**", "$32,000$ (Llama 1) $\\to 128,000$ (Llama 3) $\\to 100,000+$ (GPT-4)", "Larger vocabularies compress text into fewer tokens, accelerating inference"],
          ["**Token Pricing Economics**", "Priced per **1 Million Tokens** (e.g. \\$0.15 to \\$5.00 / 1M)", "Inference billing is strictly metered on prompt + completion token volume"],
          ["**Code & Math Compression**", "$1 \\text{ token} \\approx 1.5 - 2 \\text{ characters}$", "Indentation, whitespace, and brackets consume significantly more tokens than prose"],
          ["**Non-English Token Inflation**", "Hindi, Arabic, or Cyrillic: **$2\\times$ to $5\\times$ more tokens per word**", "Inefficient tokenization increases latency and cost for low-resource languages"]
        ],
        n: "In modern language models, a token is the atomic quantum of data. " +
          "A token is not necessarily a word; it is a **subword string chunk** " +
          "derived through statistical compression algorithms like Byte-Pair Encoding (BPE). " +
          "For example, common words like 'apple' map to a single token, whereas rare or compound " +
          "words like 'hyperparameter' might be segmented into three tokens: `['hyper', 'param', 'eter']`. " +
          "A model's tokenizer converts raw text strings into an integer array `List[int]` " +
          "representing indices into the model's embedding matrix: $x \\in \\{0, \\dots, V-1\\}$. " +
          "Understanding tokens is essential for four core operational disciplines: " +
          "(1) **Context Window Budgeting**: every prompt and generated output consumes a finite " +
          "number of token slots in the context window. (2) **Latency and Throughput**: because " +
          "autoregressive generation produces exactly **one token per forward pass**, inference latency " +
          "scales directly with the number of generated tokens. (3) **Financial Economics**: API pricing " +
          "is universally billed per 1 million input and output tokens. (4) **Linguistic Fairness**: " +
          "tokenizers trained primarily on English text require 2x to 5x more tokens to represent the " +
          "same semantic sentence in Hindi, Japanese, or Arabic—a phenomenon termed **Token Inflation** " +
          "that makes LLM usage significantly more expensive and context-constrained for non-English speakers."
      },

      miss: [
        {
          w: "One token is always equal to exactly one English word.",
          r: "One token is roughly 0.75 words on average. Punctuation, whitespace, code syntax, and complex vocabulary split words into multiple tokens."
        },
        {
          w: "Language models read and understand raw ASCII/Unicode text strings directly.",
          r: "LLMs never see characters or strings. They consume integer arrays of token IDs and output probability distributions over discrete token vocabulary indices."
        },
        {
          w: "Token count depends only on the length of the text, regardless of the model.",
          r: "Every model family uses its own distinct tokenizer and vocabulary. A sentence that takes 15 tokens in GPT-2 might take only 9 tokens in Llama 3 due to its larger 128k vocabulary."
        },
        {
          w: "Numbers and digits are always tokenized as single individual digits.",
          r: "Different tokenizers handle numbers differently: some split multi-digit numbers into single digits (`1`, `2`, `3`), while others group them into arbitrary chunks (`12`, `345`), which explains why LLMs struggle with basic mental arithmetic."
        }
      ],

      trade: {
        buys: [
          "Bridges raw continuous text and discrete matrix multiplications in neural embedding spaces.",
          "Compresses text efficiently: larger vocabularies pack more semantic content into fewer sequence steps.",
          "Subword tokenization eliminates Out-Of-Vocabulary (OOV) crashes by breaking unknown words into known byte pieces."
        ],
        costs: [
          "Token inflation penalizes non-English languages with higher API costs and shorter effective context lengths.",
          "Inconsistent number tokenization impairs arithmetic reasoning and numerical precision.",
          "Leading/trailing whitespace sensitivity: an extra space at the end of a prompt can completely alter the token sequence."
        ],
        avoid: [
          "Assuming character counts equal token counts when calculating API budgets.",
          "Leaving trailing whitespace at the end of structured prompts without testing token boundaries."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tokenisation",

      why: {
        before: "Text preprocessing used whitespace splitting (word-level tokenization), " +
          "which generated massive vocabularies ($V > 1,000,000$), failed on rare words, and crashed on typos.",
        problem: "Character-level tokenization had tiny vocabularies ($V \\approx 256$) but expanded sequence lengths " +
          "by 5x to 10x, creating prohibitive quadratic attention compute costs and destroying long-range context.",
        shift: "**Subword Tokenisation (BPE, WordPiece, SentencePiece): Data-driven frequency compression.** " +
          "Iteratively merge the most frequent byte or character pairs into a fixed-size vocabulary ($V \\approx 32k - 128k$), " +
          "representing common words as single tokens while gracefully decomposing rare words and typos into subword fragments."
      },

      num: {
        t: "Subword tokenisation algorithms & vocabulary characteristics",
        h: ["Algorithm", "Merge / Segmentation Criterion", "Whitespace Handling", "Flagship Models"],
        r: [
          ["**Byte-Pair Encoding (BPE)**", "Frequency: merges most frequent adjacent token pairs", "Pre-tokenizes via regex; whitespace treated as token prefix", "**GPT-2, GPT-4, Llama 3, RoBERTa**"],
          ["**WordPiece**", "Likelihood: merges pair that maximizes language model score", "Requires explicit `##` prefix for inner subwords", "**BERT, DistilBERT**"],
          ["**SentencePiece (Unigram)**", "Pruning: starts with giant vocab, removes least likely tokens", "**Reversible**: treats input as raw byte stream with `_` whitespace", "**T5, Llama 1/2, Gemma**"],
          ["**Tiktoken (OpenAI BPE)**", "Rust-compiled byte-level BPE with custom regex splits", "Direct UTF-8 byte sequences; immune to OOV errors", "**GPT-4, text-embedding-3**"],
          ["**Vocabulary Scaling**", "$32\\text{k}$ (Llama 2) $\\to 128\\text{k}$ (Llama 3)", "Larger vocab slashes total tokens by $\\approx 15-20\\%$", "Dramatically improves non-English and code efficiency"]
        ],
        n: "Tokenisation is the algorithmic pre-processing pipeline that transforms " +
          "raw strings into discrete integer sequences. The modern gold standard is " +
          "**Byte-Level Byte-Pair Encoding (BPE)** (Sennrich et al. 2016, Radford et al. 2019). " +
          "The algorithm begins with a base vocabulary containing all 256 possible bytes in the " +
          "extended ASCII / UTF-8 standard. It then scans a massive training corpus, identifies the " +
          "most frequently co-occurring pair of adjacent bytes (e.g. `'t'` and `'h'`), merges them " +
          "into a new single token `'th'`, and repeats this process iteratively until reaching a " +
          "target vocabulary size $V$ (e.g. 50,257 in GPT-2, or 128,256 in Llama 3). " +
          "Because the base vocabulary contains all 256 raw bytes, **Byte-level BPE is completely " +
          "incapable of encountering an Out-Of-Vocabulary (OOV) error**: any unseen word, foreign emoji, " +
          "or corrupted binary string can always be broken down into individual valid byte tokens. " +
          "Furthermore, modern tokenizers use specialized **regular expressions** (like Tiktoken's regex) " +
          "to prevent merges across punctuation boundaries and whitespace, preserving clear semantic " +
          "separation between numbers, code identifiers, and natural prose."
      },

      miss: [
        {
          w: "Tokenization is performed by the neural network weights during the forward pass.",
          r: "Tokenization is a deterministic CPU pre-processing step executing independently of the neural network. It runs as compiled Rust or C++ code before any tensor reaches the GPU."
        },
        {
          w: "A tokenizer trained on English text handles other languages with equal efficiency.",
          r: "Tokenizers trained primarily on English allocate their vocabulary merges to English subwords. Non-English languages are broken down into inefficient character or raw byte fragments, multiplying token counts."
        },
        {
          w: "All models from the same company use the exact same tokenizer.",
          r: "Tokenizers evolve across model generations: GPT-3 used a 50k vocabulary, while GPT-4 switched to a new cl100k_base tokenizer (100k vocab), producing completely different token sequences for identical text."
        },
        {
          w: "Tokenization is completely reversible without losing formatting.",
          r: "While modern byte-level tokenizers (SentencePiece, Tiktoken) are fully reversible (lossless roundtrip `decode(encode(text)) == text`), older tokenizers discarded multiple spaces or altered case normalization."
        }
      ],

      trade: {
        buys: [
          "Eliminates Out-Of-Vocabulary (OOV) errors: raw byte fallback guarantees any text or code can be tokenized.",
          "Optimizes sequence length: common words and phrases condense into single tokens, minimizing attention compute.",
          "Language-agnostic statistical segmentation: discovers optimal subwords without human linguistic dictionaries."
        ],
        costs: [
          "Tokenization anomalies: subtle token boundary quirks can trigger prompt injection or unexpected hallucinations.",
          "Token inflation creates economic and latency disparities for non-Latin writing systems.",
          "Fast tokenization requires optimized Rust/C++ bindings (Tiktoken, HuggingFace Tokenizers) to prevent CPU bottlenecks."
        ],
        avoid: [
          "Mixing tokenizers: feeding tokens produced by a Llama tokenizer into a GPT model will produce complete gibberish.",
          "Writing custom string tokenizers using simple Python regexes instead of standardized libraries."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "context-window",

      why: {
        before: "Early Transformers were strictly limited to tiny context windows of 512 tokens (BERT) " +
          "or 2,048 tokens (GPT-3), unable to process full academic papers, books, codebases, or complex conversational history.",
        problem: "Self-attention computes pairwise affinities between all tokens, causing computational time " +
          "and KV-cache memory consumption to scale quadratically $\\mathcal{O}(N^2)$ as context length expands.",
        shift: "**Context Window: The active working memory horizon.** " +
          "The maximum sequence of tokens an LLM can attend to simultaneously in a single forward pass, " +
          "expanded from 2k tokens to 128k (GPT-4) and 1M-2M+ tokens (Gemini) via FlashAttention, RoPE scaling, and sparse linear attention."
      },

      num: {
        t: "Context window scaling history & KV-cache memory footprints",
        h: ["Model & Era", "Context Window ($N$)", "Attention Complexity", "KV-Cache Size per Request (FP16, 70B model)"],
        r: [
          ["**BERT (2018)**", "$512$ tokens", "Quadratic ($N^2$)", "Negligible ($< 0.1\\text{ GB}$)"],
          ["**GPT-3 (2020)**", "$2,048$ tokens", "Quadratic ($N^2$)", "$\\approx 0.3\\text{ GB}$"],
          ["**Llama 2 (2023)**", "$4,096$ tokens", "FlashAttention 2", "$\\approx 0.65\\text{ GB}$"],
          ["**GPT-4-Turbo / Llama 3**", "**$128,000$ tokens**", "RoPE scaling + GQA", "**$\\approx 10 - 20\\text{ GB}$** (demands Grouped-Query Attention)"],
          ["**Gemini 1.5 Pro (2024)**", "**$1,000,000 - 2,000,000$ tokens**", "Linear attention / RingAttention", "Massive distributed multi-GPU KV-cache clusters"]
        ],
        n: "The Context Window represents an LLM's **active working memory**. " +
          "Any information outside the context window cannot be seen, attended to, " +
          "or reasoned over by the model during generation. Expanding the context window " +
          "from 2,048 tokens to over 1,000,000 tokens required overcoming two brutal physical barriers: " +
          "(1) **Quadratic Computational Scaling**: standard self-attention evaluates an " +
          "$N \\times N$ attention matrix; scaling from 2k to 128k represents a **$4,096\\times$ explosion** " +
          "in compute and memory. This was solved via **FlashAttention** (Dao et al. 2022), which uses " +
          "tiling to compute Softmax without materializing the massive $N \\times N$ matrix in high-bandwidth memory (HBM). " +
          "(2) **KV-Cache Memory Explosion**: during autoregressive generation, storing Key and Value " +
          "tensors for every token across all layers scales linearly with context length: " +
          "$\\text{KV-Cache} = 2 \\times 2 \\times B \\times L \\times n_{\\text{layers}} \\times d_{\\text{model}}$ bytes. " +
          "For a 70B model at 128k context, a single request's KV-cache can exceed **40 GB of VRAM**! " +
          "This necessitated **Grouped-Query Attention (GQA)**, which shares Key/Value heads across " +
          "Query heads to slash KV-cache memory by 8x. Context recall fidelity across millions of tokens " +
          "is benchmarked using the **Needle-In-A-Haystack (NIAH)** test."
      },

      miss: [
        {
          w: "A 1-million token context window means the model remembers everything forever.",
          r: "Context window is working memory for a single execution session, not persistent long-term storage. When the session terminates or context resets, all working memory is cleared."
        },
        {
          w: "An LLM pays equal attention to all tokens throughout a 128k context window.",
          r: "LLMs suffer from the 'Lost in the Middle' phenomenon (Liu et al. 2023): models recall information placed at the very beginning or very end of the prompt with high accuracy, but frequently ignore facts buried in the middle."
        },
        {
          w: "You can send 100,000 tokens for every simple query without cost or latency penalties.",
          r: "Pre-filling a 100k token context requires significant GPU compute (Time-To-First-Token latency explodes) and incurs substantial financial costs (100k input tokens billed per request)."
        },
        {
          w: "Large context windows make Retrieval-Augmented Generation (RAG) completely obsolete.",
          r: "Stuffing 50 documents into context is expensive, slow, and prone to 'lost in the middle' hallucinations. RAG remains essential for filtering precision, data security, provenance tracking, and cost optimization."
        }
      ],

      trade: {
        buys: [
          "Enables ingesting entire books, code repositories, legal discovery bundles, and hour-long audio files in one prompt.",
          "Reduces chunking fragmentation errors common in naive RAG pipelines.",
          "Allows rich in-context learning with dozens of complex few-shot demonstration examples."
        ],
        costs: [
          "Massive KV-cache memory consumption on GPUs, capping concurrent serving throughput.",
          "High Time-To-First-Token (TTFT) latency due to expensive prompt pre-fill passes.",
          "'Lost in the Middle' degradation: attention degrades on facts buried in long middle passages."
        ],
        avoid: [
          "Stuffing massive uncurated documents into prompts when a targeted RAG search retrieves the exact relevant passage.",
          "Placing the most critical system instructions in the middle of a massive long-context prompt (always place them at the start or end)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "temperature",

      why: {
        before: "Sampling from categorical probability distributions used fixed Softmax equations, " +
          "forcing models into either completely rigid, repetitive greedy outputs or chaotic, nonsensical word choices.",
        problem: "Different application domains demand fundamentally different sampling behaviors: " +
          "code generation and factual QA require strict determinism, while creative writing requires diverse, imaginative expression.",
        shift: "**Temperature ($\\tau$): Logit scaling entropy control.** " +
          "Divide raw unnormalized logits by a positive scalar temperature before computing Softmax: " +
          "$p_i = \\frac{\\exp(z_i / \\tau)}{\\sum_j \\exp(z_j / \\tau)}$, smoothly controlling the entropy and randomness of generation."
      },

      num: {
        t: "Temperature scaling regimes & generation behavior",
        h: ["Temperature Setting ($\\tau$)", "Mathematical Softmax Behavior", "Output Entropy", "Ideal Application Domain"],
        r: [
          ["**$\\tau = 0.0$ (Greedy Search)**", "Argmax: highest logit probability $\\to 1.0$, all others $\\to 0.0$", "**Zero entropy (deterministic)**", "**Code generation**, SQL queries, mathematical deduction, factual extraction"],
          ["**$\\tau = 0.2 - 0.4$ (Low)**", "Sharp peak: strongly favors top candidate tokens", "Low randomness, high consistency", "Technical documentation, legal analysis, API JSON structured outputs"],
          ["**$\\tau = 0.7 - 0.9$ (Balanced)**", "Preserves natural categorical distribution shape", "Balanced creativity and coherence", "**Conversational chat**, general prose, email drafting, customer support"],
          ["**$\\tau = 1.0$ (Default)**", "Pure unscaled logits: $z_i / 1.0$", "Exact training distribution entropy", "Standard LLM pre-training evaluation"],
          ["**$\\tau \\ge 1.5$ (High)**", "Flattens distribution toward uniform ($1/V$)", "High entropy, high randomness", "Brainstorming, surrealist poetry; high risk of gibberish and hallucination"]
        ],
        n: "Temperature is a thermodynamic analogy applied to the **Softmax categorical " +
          "distribution**. At each generation step $t$, the language model outputs a vector " +
          "of raw unnormalized log-odds (logits) $z \\in \\mathbb{R}^V$ across the vocabulary. " +
          "Before taking the Softmax, logits are divided by the temperature parameter $\\tau > 0$: " +
          "$p_i = \\frac{\\exp(z_i / \\tau)}{\\sum_{j=1}^V \\exp(z_j / \\tau)}$. " +
          "The parameter $\\tau$ acts as an entropy governor: " +
          "(1) When **$\\tau \\to 0$**, the largest logit dominates completely, " +
          "collapsing the distribution into a one-hot Dirac delta distribution (equivalent to **Greedy Search / Argmax**). " +
          "The model becomes completely deterministic and repeatable, always selecting the single highest-probability token. " +
          "(2) When **$\\tau = 1.0$**, Softmax operates on raw logits, matching the empirical cross-entropy distribution. " +
          "(3) When **$\\tau \\to \\infty$**, the differences between logits shrink to zero ($z_i / \\tau \\to 0$), " +
          "causing all exponents to approach $e^0 = 1.0$. The distribution flattens into a **discrete uniform distribution** " +
          "($p_i = 1/V$), where every token in the vocabulary has an equal chance of being selected, producing pure random gibberish. " +
          "In production pipelines, temperature is typically paired with **Top-$p$ (Nucleus) sampling**."
      },

      miss: [
        {
          w: "Setting temperature = 0.0 makes an LLM API 100% mathematically deterministic across all calls.",
          r: "While $\\tau=0$ selects argmax, non-deterministic floating-point summation order in parallel GPU matrix kernels (`atomicAdd`) can occasionally alter fractional logit values, causing rare token divergence unless seed and deterministic flags are enforced."
        },
        {
          w: "Higher temperature makes the model smarter and more knowledgeable.",
          r: "Temperature alters sampling randomness; it does not add intelligence. Higher temperature increases the probability of selecting low-probability tokens, dramatically increasing factual hallucinations and grammatical errors."
        },
        {
          w: "Temperature changes the model's internal parameter weights.",
          r: "Temperature is an inference-only decoding hyperparameter applied to the final Softmax layer. It does not modify a single weight in the neural network."
        },
        {
          w: "You should always set both Temperature and Top-p to high values simultaneously.",
          r: "Altering both parameters simultaneously creates unpredictable interactions. Leading LLM providers strongly recommend adjusting EITHER Temperature OR Top-p, keeping the other at its default."
        }
      ],

      trade: {
        buys: [
          "Continuous control over the balance between deterministic precision and imaginative diversity.",
          "Setting $\\tau=0$ provides reproducible outputs for structured JSON schema generation and code synthesis.",
          "Zero computational overhead: requires only a scalar vector division prior to Softmax."
        ],
        costs: [
          "High temperatures ($\\tau > 1.0$) drastically escalate factual hallucinations and syntax errors.",
          "Low temperatures ($\\tau < 0.2$) can trap models in repetitive degenerate token loops ('the the the').",
          "Interacts sensitively with prompt structure and secondary sampling filters (Top-k, Top-p, Min-p)."
        ],
        avoid: [
          "Using high temperature ($\\tau > 0.5$) for code generation, mathematical reasoning, or structured JSON outputs.",
          "Tuning both Temperature and Top-p at the same time during hyperparameter optimization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prompt",

      why: {
        before: "Interacting with neural networks required programmatic inputs formatted as rigid, " +
          "normalized numerical matrices or categorical index arrays through custom software code.",
        problem: "General-purpose foundation models contain broad, multi-task knowledge; " +
          "steering their generative trajectory toward a specific task requires an expressive, natural language conditioning signal.",
        shift: "**Prompt: Natural language context conditioning.** " +
          "Provide an initial sequence of natural language instructions, context, few-shot examples, and questions " +
          "that steer the autoregressive model's attention mechanism to generate the desired task completion."
      },

      num: {
        t: "Prompt anatomy, token allocations & structural roles",
        h: ["Prompt Component", "Structural Function", "Typical Position", "Recommended Best Practice"],
        r: [
          ["**System Message / Directive**", "Sets behavioral persona, tone, guardrails, and constraints", "**Very Beginning** (Priority attention)", "Specify explicit formatting constraints and edge-case rules"],
          ["**Context / Reference Material**", "Provides external domain facts retrieved via RAG", "Middle / Body", "Demarcate clearly using XML tags (e.g. `<context>...</context>`)"],
          ["**Few-Shot Demonstrations**", "Exemplars showing input-output target format", "Preceding user query", "Include 2-3 diverse, high-quality input/output pairs"],
          ["**User Query / Instruction**", "The immediate task or question to solve", "**Bottom / End** (Recency bias)", "Place immediate question at the end to exploit recency attention"],
          ["**Format Trigger (Scaffolding)**", "Forces output syntax (e.g. ````json` or `<thinking>`)", "Final token prompt suffix", "Pre-fills assistant turn to guarantee structured response"]
        ],
        n: "A Prompt is the complete input token sequence provided to an autoregressive " +
          "language model to condition its generative trajectory. Mathematically, given a prompt " +
          "sequence $X = (x_1, \\dots, x_M)$, the model computes conditional continuation probabilities: " +
          "$P(x_{M+1}, \\dots, x_{M+T} \\mid x_1, \\dots, x_M) = \\prod_{t=1}^T P(x_{M+t} \\mid X, x_{M+1}, \\dots, x_{M+t-1})$. " +
          "The prompt acts as a **coordinate anchor in the model's latent representation space**: " +
          "by establishing a specific context, the prompt activates relevant sub-networks and " +
          "attention circuits learned during pre-training. Modern conversational models structure " +
          "prompts into standardized **Chat Templates** (e.g. ChatML) using special demarcation tokens: " +
          "`<|im_start|>system...<|im_end|><|im_start|>user...<|im_end|><|im_start|>assistant`. " +
          "A production-grade prompt consists of four architectural layers: " +
          "(1) **System Instructions** (defining persona, tone, safety boundaries, and negative constraints), " +
          "(2) **Grounding Context** (documents retrieved via RAG to eliminate hallucinations), " +
          "(3) **Few-Shot Exemplars** (in-context demonstrations of input-output format), and " +
          "(4) **The User Query**, typically formatted with explicit structural delimiters (e.g. Markdown or XML tags) " +
          "to prevent prompt injection and ambiguous instruction parsing."
      },

      miss: [
        {
          w: "A prompt is just an informal conversational message like a Google search query.",
          r: "In production engineering, a prompt is an execution specification. High-performing prompts use structured markup (XML/Markdown), precise negative constraints, few-shot schemas, and defensive delimiter boundaries."
        },
        {
          w: "Politeness in prompts ('please', 'thank you') makes the model perform better technically.",
          r: "While politeness can subtly influence persona tone, empirical benchmarks show that explicit structural instructions, clear examples, and deterministic constraints have vastly more impact on accuracy than conversational politeness."
        },
        {
          w: "Prompts can only contain natural human language text.",
          r: "Prompts routinely incorporate programming code, JSON schemas, SQL queries, Base64 image tokens, XML data structures, and mathematical LaTeX equations."
        },
        {
          w: "The model remembers instructions from earlier prompts in previous independent API calls.",
          r: "LLM APIs are strictly stateless: each API call is evaluated from scratch. The entire conversational history must be re-sent in the prompt on every single turn."
        }
      ],

      trade: {
        buys: [
          "Zero-code task specification: program sophisticated reasoning behaviors using plain natural language.",
          "Instant iteration: modify application logic by tweaking prompt instructions without retraining or fine-tuning models.",
          "Enables in-context steering, dynamic tool-calling integration, and few-shot formatting control."
        ],
        costs: [
          "Token overhead: long system prompts and extensive few-shot examples consume context window space and inflate API costs.",
          "Vulnerable to prompt injection: malicious user inputs can override system prompt constraints.",
          "Fragility: slight wording changes or whitespace variations can cause non-deterministic output drift."
        ],
        avoid: [
          "Writing vague, open-ended prompts without explicit output format specifications.",
          "Interpolating untrusted user inputs directly into system prompts without delimiter sanitization."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
