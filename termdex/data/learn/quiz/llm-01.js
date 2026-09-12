/* LLM — 50+ Hardcore Question Bank (IIT/PhD Level). */

/* ===================================================================
   Module: arch — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "arch", [
  {
    "tag": "KV Cache Exact Memory Formula",
    "lvl": "advanced",
    "q": "For a 70B parameter model with 80 layers, 8 Key-Value heads, head dimension 128, sequence length 4,096 tokens, and batch size 4 in 16-bit precision (FP16, 2 bytes/element), what is the EXACT memory size of the Key-Value (KV) cache?",
    "o": [
      "~5.37 GB",
      "~10.74 GB ($2 \\times 2 \\times 80 \\times 8 \\times 128 \\times 4096 \\times 4 = 10,737,418,240\\text{ bytes}$)",
      "~21.48 GB",
      "~42.95 GB"
    ],
    "a": 1,
    "x": "Memory = $2 \\text{ (K and V)} \\times 2 \\text{ bytes (FP16)} \\times 80 \\text{ layers} \\times 8 \\text{ heads} \\times 128 \\text{ dim} \\times 4096 \\text{ seq} \\times 4 \\text{ batch} = 10,737,418,240\\text{ bytes} = 10.0\\text{ GiB} \\approx 10.74\\text{ GB}$."
  },
  {
    "tag": "PagedAttention Internal Fragmentation",
    "lvl": "advanced",
    "q": "How does PagedAttention (vLLM, Kwon et al.) eliminate up to 96% of memory waste in LLM serving KV caches?",
    "o": [
      "Quantizes KV cache to 1-bit",
      "Allocates KV cache in fixed-size contiguous virtual memory blocks (e.g. 16 tokens/block) mapped to non-contiguous physical DRAM pages via an operating-system-style Page Table, completely eliminating internal and external memory fragmentation",
      "Compresses tokens using LZ4",
      "Discards Key tensors entirely"
    ],
    "a": 1,
    "x": "Standard serving pre-allocates maximum sequence length buffers per request (causing 60-80% memory waste). PagedAttention dynamically allocates small physical blocks on-demand, boosting batch sizes 2x-4x."
  },
  {
    "tag": "Speculative Decoding Acceptance Math",
    "lvl": "advanced",
    "q": "In Speculative Decoding (Leviathan et al. / Chen et al.), given target model distribution $p(x)$ and draft model distribution $q(x)$, what is the exact acceptance probability $P(\\text{accept})$ for draft token $x$ that preserves mathematical equivalence to target model sampling?",
    "o": [
      "$P(\\text{accept}) = p(x) / q(x)$",
      "$P(\\text{accept}) = \\min\\left(1, \\frac{p(x)}{q(x)}\\right)$; if rejected, sample from adjusted residual distribution $(p(x) - q(x))_+$",
      "$P(\\text{accept}) = 1 - q(x)$",
      "$P(\\text{accept}) = \\frac{p(x) + q(x)}{2}$"
    ],
    "a": 1,
    "x": "Accepting with probability $\\min(1, p(x)/q(x))$ and resampling rejected tokens from the positive residual $(p(x) - q(x))_+$ provably guarantees the output distribution is identical to the target model alone."
  },
  {
    "tag": "YaRN Context Extension Scaling",
    "lvl": "advanced",
    "q": "How does YaRN (Yet another RoPE extensioN, Peng et al.) extrapolate context windows from 4K to 128K tokens without fine-tuning degradation?",
    "o": [
      "Doubles attention heads",
      "Applies NTK-by-parts interpolation: leaves high-frequency dimensions un-interpolated (preserving local syntax), while aggressively interpolating low-frequency dimensions and applying an entropy temperature correction scale $\\sqrt{1/t}$",
      "Replaces attention with Mamba SSM",
      "Quantizes attention matrix"
    ],
    "a": 1,
    "x": "YaRN decomposes RoPE dimensions by frequency bands, avoiding catastrophic loss of high-frequency positional resolution while stretching low frequencies across long contexts."
  },
  {
    "tag": "ALiBi Linear Attention Biases",
    "lvl": "advanced",
    "q": "In Attention with Linear Biases (ALiBi, Press et al.), how is positional information encoded without any explicit positional embedding vectors?",
    "o": [
      "Random noise added to queries",
      "Subtracting a static, non-learned linear penalty proportional to token distance from attention logits: $\\text{softmax}\\left( \\frac{q_i k_j^T}{\\sqrt{d}} - m \\cdot |i - j| \\right)$ where head slope $m = 2^{-8i/H}$",
      "Multiplying keys by sine waves",
      "Sorting tokens by frequency"
    ],
    "a": 1,
    "x": "ALiBi injects linear distance penalties directly into attention logits, providing zero-shot length generalization to sequences longer than those seen during pre-training."
  },
  {
    "tag": "BitNet 1.58-bit Ternary Weights",
    "lvl": "advanced",
    "q": "What mathematical transformation allows BitNet 1.58b (Wang et al.) to replace floating-point matrix multiplications with integer additions?",
    "o": [
      "Weights are converted to IEEE 754 floats",
      "Weights are constrained to the ternary set $\\{-1, 0, 1\\}$ using $\\text{RoundClip}\\left( \\frac{W}{\\gamma + \\epsilon}, -1, 1 \\right)$, converting standard GEMM into pure additions and subtractions with zero floating-point multipliers",
      "Weights are set to 0",
      "Uses complex numbers"
    ],
    "a": 1,
    "x": "Ternary weights $\\{-1, 0, 1\\}$ encode $\\log_2 3 \\approx 1.58$ bits per weight, replacing power-hungry FP multipliers on silicon with lightweight integer adders."
  },
  {
    "tag": "Mixture of Depths (MoD)",
    "lvl": "advanced",
    "q": "How does Mixture-of-Depths (MoD, Raposo et al., 2024) dynamically allocate compute per token?",
    "o": [
      "Prunes weights during inference",
      "Uses a top-$k$ router to select only a fixed capacity fraction of tokens (e.g. 50%) to pass through full self-attention and MLP computations at each layer, while unselected tokens skip the block entirely via residual connections",
      "Converts deep layers to shallow layers",
      "Runs on CPUs"
    ],
    "a": 1,
    "x": "MoD dynamically routes tokens through or around entire transformer layers, allocating compute adaptively to complex tokens while letting easy tokens skip layers."
  },
  {
    "tag": "Medusa Multi-Head Speculative Decoding",
    "lvl": "advanced",
    "q": "How does Medusa (Cai et al.) achieve speculative decoding acceleration without running a separate draft model?",
    "o": [
      "Quantizes model weights to 2 bits",
      "Attaches multiple lightweight MLP prediction heads to the frozen base LLM's final hidden state, each trained to predict the $(t+1)$-th, $(t+2)$-th, $\\dots$ tokens simultaneously and verifying the speculative tree in a single forward step via tree-attention",
      "Runs parallel GPUs for each head",
      "Uses regex token matching"
    ],
    "a": 1,
    "x": "Medusa adds multiple decoding heads on top of the last layer to generate multiple tokens concurrently, validating them in parallel with a tree attention mask."
  }
]);

/* ===================================================================
   Module: train — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "train", [
  {
    "tag": "Chinchilla Compute-Optimal Scaling Laws",
    "lvl": "advanced",
    "q": "According to Hoffmann et al. (Chinchilla, 2022), for a compute-optimal training run given a compute budget $C \\approx 6 N D$, how should model parameters $N$ and training tokens $D$ scale relative to each other?",
    "o": [
      "$N$ should scale 10x faster than $D$",
      "Model parameters $N$ and dataset tokens $D$ should scale **equally in equal proportion** ($N \\propto C^{0.5}, D \\propto C^{0.5}$), meaning a 70B model requires $\\approx 1.4$ Trillion tokens",
      "$D$ should stay fixed at 300 Billion tokens",
      "$N$ should stay fixed while $D$ scales as $C^2$"
    ],
    "a": 1,
    "x": "Chinchilla proved that earlier models (e.g. GPT-3 175B trained on 300B tokens) were severely undertrained. Optimal compute allocation scales parameters and token counts in equal 1:1 proportion."
  },
  {
    "tag": "Direct Preference Optimization (DPO) Loss",
    "lvl": "advanced",
    "q": "What is the closed-form objective loss function of Direct Preference Optimization (DPO, Rafailov et al.) that eliminates the need for training a separate reward model or running PPO?",
    "o": [
      "$\\mathcal{L}_{\\text{DPO}} = -\\log \\sigma(r_w - r_l)$",
      "$\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]$",
      "$\\mathcal{L}_{\\text{DPO}} = \\|y_w - y_l\\|_2^2$",
      "$\\mathcal{L}_{\\text{DPO}} = D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}})$"
    ],
    "a": 1,
    "x": "DPO analytically solves the RLHF reward-constrained optimization equation, showing that the ground-truth reward $r(x, y) = \\beta \\log \\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)}$ can be substituted directly into the Bradley-Terry preference loss without training a reward network."
  },
  {
    "tag": "RLHF PPO KL-Divergence Drift Penalty",
    "lvl": "advanced",
    "q": "In standard RLHF with Proximal Policy Optimization (PPO), why is a KL-divergence penalty $-\\beta D_{\\text{KL}}(\\pi_\\theta(y|x) \\parallel \\pi_{\\text{ref}}(y|x))$ added to the policy reward $R(x, y)$?",
    "o": [
      "To speed up training by 10x",
      "To prevent **Reward Hacking** (where the policy exploits flaws in the imperfect reward model to generate gibberish or spam) and ensure the policy remains close to the coherent pre-trained base model",
      "To prevent GPU out-of-memory errors",
      "To force all responses to be short"
    ],
    "a": 1,
    "x": "Without KL regularization, RL policies exploit reward model vulnerabilities (producing repetitive keywords, excessive sycophancy, or nonsensical high-scoring strings). KL penalty anchors the policy to the reference SFT model."
  },
  {
    "tag": "KTO (Kahneman-Tversky Optimization)",
    "lvl": "advanced",
    "q": "How does Kahneman-Tversky Optimization (KTO, Ethayarajh et al.) align language models without requiring pairwise preference comparisons $(y_w, y_l)$?",
    "o": [
      "Trains with reinforcement learning on games",
      "Directly maximizes the utility of individual binary feedback signals (thumbs up or thumbs down) using Prospect Theory value functions with loss aversion asymmetry",
      "Quantizes model weights to ternary bits",
      "Uses unsupervised contrastive learning"
    ],
    "a": 1,
    "x": "KTO uses behavioral economics Prospect Theory, optimizing per-example binary labels directly without requiring expensive pairwise preference datasets."
  },
  {
    "tag": "ORPO (Odds Ratio Preference Optimization)",
    "lvl": "advanced",
    "q": "How does ORPO (Hong et al.) unify Supervised Fine-Tuning (SFT) and preference alignment into a single monolithic training step?",
    "o": [
      "Runs SFT on odds ratios only",
      "Appends a penalty based on the Odds Ratio $\\text{OR}_\\theta(y_w, y_l) = \\frac{P_\\theta(y_w|x) / (1 - P_\\theta(y_w|x))}{P_\\theta(y_l|x) / (1 - P_\\theta(y_l|x))}$ directly to the standard SFT negative log-likelihood loss, penalizing unchosen generation odds during SFT",
      "Eliminates cross-entropy loss",
      "Requires 4 GPUs"
    ],
    "a": 1,
    "x": "ORPO combines $\\mathcal{L}_{\\text{SFT}} + \\lambda \\mathcal{L}_{\\text{OR}}$, dynamically discouraging the model from generating rejected response patterns while learning task formatting in a single training run."
  },
  {
    "tag": "Kaplan Power-Law Scaling Exponents",
    "lvl": "advanced",
    "q": "In OpenAI's Kaplan et al. (2020) scaling law $\\mathcal{L}(N) = \\left( \\frac{N_c}{N} \\right)^{\\alpha_N}$, what does the exponent $\\alpha_N \\approx 0.076$ imply about loss reduction?",
    "o": [
      "Loss decreases linearly with parameter count",
      "Loss decreases smoothly as a power-law without sudden plateaus, meaning every 10x increase in parameter count yields a predictable constant reduction in test cross-entropy loss",
      "Loss drops to zero at 100B parameters",
      "Loss is independent of compute"
    ],
    "a": 1,
    "x": "Kaplan showed empirical cross-entropy loss follows strict power-law scaling relationships across model parameters ($N$), dataset tokens ($D$), and compute ($C$) over many orders of magnitude."
  },
  {
    "tag": "MinHash LSH for Pre-Training Deduplication",
    "lvl": "advanced",
    "q": "Why is MinHash Local Sensitive Hashing (LSH) standard for deduplicating multi-terabyte web pre-training corpora (e.g. Common Crawl)?",
    "o": [
      "MinHash compresses text to 1 byte",
      "It estimates Jaccard similarity $J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}$ in $O(N)$ linear time by hashing token $k$-shingles, allowing billions of document pairs to be deduplicated without $O(N^2)$ pairwise text comparisons",
      "MinHash fixes grammar errors",
      "MinHash encrypts text for safety"
    ],
    "a": 1,
    "x": "Pairwise comparison of $N=10^9$ documents is computationally impossible ($O(N^2)$). MinHash LSH hashes $k$-shingle sets into small signature buckets for near-linear time fuzzy deduplication."
  },
  {
    "tag": "Pre-Training Data Quality Classifiers (FastText)",
    "lvl": "advanced",
    "q": "How do modern LLM pipelines (e.g. LLaMA, RefinedWeb) filter out low-quality web crawl text at multi-terabyte scale?",
    "o": [
      "Manual human review of every page",
      "Training a lightweight binary classifier (e.g. FastText / Logistic Regression on word n-grams) on curated high-quality text (Wikipedia, textbooks) vs uncurated Common Crawl, filtering documents below a tuned acceptance threshold score",
      "Translating all web pages into Latin",
      "Counting word length only"
    ],
    "a": 1,
    "x": "FastText quality classifiers score web documents against high-quality reference corpora (Wikipedia, arXiv, books), filtering out SEO spam and machine-translated junk at massive throughput."
  }
]);

/* ===================================================================
   Module: rag — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "rag", [
  {
    "tag": "HyDE (Hypothetical Document Embeddings)",
    "lvl": "advanced",
    "q": "How does Hypothetical Document Embeddings (HyDE, Gao et al.) improve zero-shot dense retrieval for short or ambiguous user queries?",
    "o": [
      "Translates query to 10 languages",
      "Prompts an LLM to generate a hypothetical answer document first, embeds the generated hypothetical document into vector space, and uses that document vector to search the vector index (bridging the query-document semantic gap)",
      "Compresses vector DB with PCA",
      "Deletes unranked documents"
    ],
    "a": 1,
    "x": "Queries are short and phrased as questions; documents are long and phrased as statements. HyDE generates a synthetic answer whose embedding lives in document vector space, matching relevant documents much more closely."
  },
  {
    "tag": "ColBERT Late Interaction MaxSim",
    "lvl": "advanced",
    "q": "What is the computational difference between Single-Vector dense retrieval (e.g. standard OpenAI embeddings) and ColBERT Late Interaction (Khattab & Zaharia)?",
    "o": [
      "ColBERT uses BM25 only",
      "Single-vector collapses the entire document into 1 vector ($O(1)$ cosine similarity); ColBERT retains per-token vector representations and computes token-level MaxSim $\\sum_{i} \\max_j (q_i \\cdot d_j)$, preserving granular token interactions with low latency",
      "ColBERT requires full cross-encoder attention on all documents",
      "ColBERT converts vectors to text"
    ],
    "a": 1,
    "x": "ColBERT computes the sum of maximum cosine similarities between query tokens and document tokens. It provides cross-encoder-level fine-grained matching with fast vector index indexing."
  },
  {
    "tag": "Reciprocal Rank Fusion (RRF) Math",
    "lvl": "advanced",
    "q": "In hybrid search combining Dense Vector search and Sparse BM25 search, what is the exact formula for Reciprocal Rank Fusion (RRF) score of document $d$ with smoothing constant $k = 60$?",
    "o": [
      "$\\text{RRF}(d) = \\text{Score}_{\\text{dense}} + \\text{Score}_{\\text{BM25}}$",
      "$\\text{RRF}(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$ where $r_m(d)$ is the 1-based rank of document $d in system $m$",
      "$\\text{RRF}(d) = \\sqrt{r_1(d) \\cdot r_2(d)}$",
      "$\\text{RRF}(d) = \\max(r_1, r_2)$"
    ],
    "a": 1,
    "x": "RRF calculates rank reciprocals $\\frac{1}{60 + \\text{rank}}$, gracefully combining disparate score distributions without needing score normalization calibrations."
  },
  {
    "tag": "Matryoshka Representation Learning (MRL)",
    "lvl": "advanced",
    "q": "How does Matryoshka Representation Learning (MRL, Kusupati et al.) in modern embedding models (e.g. OpenAI `text-embedding-3-large`) allow vector truncation from 3,072 dimensions to 256 dimensions without retraining?",
    "o": [
      "Rounds floating points to integers",
      "Enforces nested representation optimization during training such that the first $d'$ dimensions ($d' \\in \\{64, 128, 256, \\dots, 3072\\}$) independently form valid, highly informative embedding vectors",
      "Uses autoencoders to compress vectors",
      "Discards odd-indexed dimensions"
    ],
    "a": 1,
    "x": "MRL trains models with multi-scale loss objectives across nested prefix slices, allowing users to truncate vectors to smaller dimensions to save 10x RAM and disk while retaining 95%+ retrieval accuracy."
  },
  {
    "tag": "Lost in the Middle Retrieval Degradation",
    "lvl": "advanced",
    "q": "What did Liu et al. (2023) discover regarding LLM performance in long context retrieval ('Lost in the Middle')?",
    "o": [
      "LLMs process middle tokens fastest",
      "LLMs exhibit a U-shaped performance curve: accuracy is highest when relevant information is at the very beginning or very end of the context window, and degrades significantly when relevant context is placed in the middle",
      "LLMs ignore the beginning of prompts",
      "Context length has zero impact on retrieval accuracy"
    ],
    "a": 1,
    "x": "Positional biases in decoder-only transformers cause attention to disproportionately weight tokens at the prompt start and end, causing sharp accuracy drops on facts buried in the middle of long contexts."
  },
  {
    "tag": "HNSW Vector DB M and efConstruction",
    "lvl": "advanced",
    "q": "In Hierarchical Navigable Small World (HNSW) vector indexing, what do parameters $M$ and $efConstruction$ trade off?",
    "o": [
      "Model size vs learning rate",
      "$M$ (number of bidirectional links per node) and $efConstruction$ (search beam width during index build) trade off index construction time and RAM usage against query recall accuracy and latency",
      "Batch size vs epochs",
      "Number of shards vs replicas"
    ],
    "a": 1,
    "x": "Higher $M$ and $efConstruction$ create a denser multi-layer graph with higher query recall, but increase memory footprint and index build time."
  },
  {
    "tag": "Prompt Compression via LLMLingua",
    "lvl": "advanced",
    "q": "How does LLMLingua (Jiang et al., 2023) achieve 4x–5x prompt compression without significant downstream task performance loss?",
    "o": [
      "Deletes all vowels from prompts",
      "Uses a compact, well-calibrated small language model (e.g. LLaMA-7B) to compute per-token conditional perplexity and budget-prunes tokens with low surprise/information content",
      "Translates prompts into emoji",
      "Replaces prompt with embeddings"
    ],
    "a": 1,
    "x": "Tokens with low conditional surprisal (low perplexity under a small LM) convey redundant linguistic fluff and can be safely dropped without losing task semantics."
  }
]);

/* ===================================================================
   Module: serve — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "serve", [
  {
    "tag": "Continuous Batching (Iteration-Level Scheduling)",
    "lvl": "advanced",
    "q": "Why is Iteration-Level Scheduling (Continuous Batching, Yu et al. / Orca) 5x–10x more efficient than traditional Static Batching in LLM serving?",
    "o": [
      "Static batching uses 32-bit floats",
      "Under static batching, an entire batch is blocked until the longest sequence completes generation; continuous batching operates at the iteration step level, dynamically evicting finished sequences and inserting new incoming requests at every token generation step",
      "Continuous batching disables KV cache",
      "Static batching runs on CPUs only"
    ],
    "a": 1,
    "x": "In LLM generation, sequence lengths vary widely. Static batching wastes GPU compute on padded tokens. Continuous batching injects new requests the exact cycle a finished request completes."
  },
  {
    "tag": "Chunked Prefill Scheduling",
    "lvl": "advanced",
    "q": "How does Chunked Prefill (Sarathi / vLLM) prevent large prompt prefill bursts from causing massive latency spikes (Time-To-First-Token) for concurrent decode tokens?",
    "o": [
      "Converts prompts into images",
      "Slices large prefill prompts into smaller chunks (e.g. 512 tokens) and co-schedules them into the same execution batch alongside ongoing single-token decode steps, keeping GPU compute saturated while maintaining steady decode token inter-arrival times",
      "Rejects long prompts",
      "Runs prefill on separate CPU clusters"
    ],
    "a": 1,
    "x": "Prefill is compute-bound (GEMM); decode is memory-bound (GEMV). Chunked prefill blends prefill chunks with decode tokens, achieving optimal compute-memory saturation."
  },
  {
    "tag": "Radix Tree Prefix Caching (SGLang)",
    "lvl": "advanced",
    "q": "How does SGLang use a Radix Tree for automatic Prefix Caching across multi-turn chat sessions and few-shot prompts?",
    "o": [
      "Compresses prompts into hash values",
      "Maintains a Radix Tree where tree nodes store KV cache tensors corresponding to token sub-sequences; incoming requests traverse the tree to reuse existing KV cache blocks for shared prompt prefixes with zero recomputation",
      "Deletes cached tokens every 5 seconds",
      "Stores KV caches on NVMe drives only"
    ],
    "a": 1,
    "x": "Radix Tree prefix caching matches incoming prompt token prefixes against stored KV cache branches in memory, achieving $O(1)$ instant prompt prefill reuse."
  },
  {
    "tag": "AWQ (Activation-aware Weight Quantization)",
    "lvl": "advanced",
    "q": "What is the core insight of AWQ (Lin et al.) for 4-bit integer LLM weight quantization?",
    "o": [
      "All weights are equally important",
      "Only 0.1%–1% of salient weight channels (corresponding to features with large activation magnitudes) drive model perplexity; protecting these salient channels from quantization error by applying per-channel scaling protects model accuracy without FP16 mixed-precision overhead",
      "Quantizes activations to 1-bit",
      "Prunes all negative weights"
    ],
    "a": 1,
    "x": "AWQ observes that activation outliers dictate error. By observing activation distributions, AWQ scales salient weight channels to minimize quantization error on critical features."
  },
  {
    "tag": "GPTQ Second-Order Quantization",
    "lvl": "advanced",
    "q": "In GPTQ (Frantar et al.), how does the Optimal Brain Surgeon (OBS) second-order Hessian error formula update remaining unquantized weights?",
    "o": [
      "Randomly adjusts weights",
      "When quantizing column $w_q$, it updates all remaining unquantized weights in the layer via $w_{\\text{remain}} \\leftarrow w_{\\text{remain}} - \\frac{w_q - \\hat{w}_q}{[H^{-1}]_{qq}} H^{-1}_{:, q}$, compensating for the introduced quantization error using the inverse Hessian matrix",
      "Multiplies weights by learning rate",
      "Zeros out the lowest 10% of weights"
    ],
    "a": 1,
    "x": "GPTQ applies second-order Taylor error compensation: as each weight coordinate is rounded to INT4, the residual quantization error is propagated to remaining weights using the inverse Hessian $(X X^T)^{-1}$."
  },
  {
    "tag": "FlashDecoding KV-Parallelization",
    "lvl": "advanced",
    "q": "Why does FlashDecoding achieve up to 8x speedup over standard FlashAttention during long-context generation decoding?",
    "o": [
      "Compresses the model weights",
      "Standard attention processes 1 query token sequentially along batch and head dimensions; FlashDecoding splits the long KV-cache sequence dimension across separate GPU Thread Blocks in parallel and performs an online final reduction step",
      "Discards half of attention heads",
      "Runs on CPU cores"
    ],
    "a": 1,
    "x": "In decode mode, sequence length is 1 query token (under-utilizing GPU cores). FlashDecoding parallelizes along the long KV cache dimension, saturating GPU compute."
  }
]);

/* ===================================================================
   Module: align — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "align", [
  {
    "tag": "Rejection Sampling Fine-Tuning (Best-of-N / RAFT)",
    "lvl": "advanced",
    "q": "How does Rejection Sampling Fine-Tuning (RAFT, Dong et al.) generate high-quality SFT data from an aligned policy?",
    "o": [
      "Randomly drops 50% of training samples",
      "Generates $N$ candidate responses per prompt using the policy model, scores all $N$ completions using a Reward Model / Verifier, and fine-tunes the policy strictly on the highest-scoring candidate via standard cross-entropy loss",
      "Rejects prompts with toxic keywords",
      "Trains a discriminator GAN"
    ],
    "a": 1,
    "x": "Best-of-N sampling filters out low-reward trajectories and trains the base model directly on the filtered top-1 trajectories via supervised maximum likelihood."
  },
  {
    "tag": "Length Bias in RLHF Preference Models",
    "lvl": "advanced",
    "q": "Why do models trained with standard RLHF frequently develop severe **Verbosity / Length Bias** (generating unnecessarily long-winded answers)?",
    "o": [
      "Longer responses use less GPU RAM",
      "Human evaluators and Reward Models systematically assign higher reward scores to longer, more detailed-looking responses even when shorter responses are equally or more accurate",
      "Softmax requires at least 500 tokens",
      "RLHF penalizes short tokens"
    ],
    "a": 1,
    "x": "Human annotators conflate verbosity with thoroughness. Reward models learn this correlation, incentivizing RL policies to produce verbose fluff to game the reward score."
  },
  {
    "tag": "Representation Engineering Refusal Vectors",
    "lvl": "advanced",
    "q": "In safety alignment research (Arditi et al., 2024), how are 'Refusal Vectors' identified and edited inside LLM activation spaces?",
    "o": [
      "By retraining the model from scratch",
      "By computing the mean activation difference vector $\\mathbf{v}_{\\text{refusal}} = \\mathbb{E}[\\mathbf{h}_{\\text{harmful}}] - \\mathbb{E}[\\mathbf{h}_{\\text{harmless}}]$ across intermediate residual stream layers and subtracting its projection to ablate refusal behavior without retraining",
      "By fine-tuning on Shakespeare",
      "By adding dropout to attention"
    ],
    "a": 1,
    "x": "Refusal in LLMs is mediated by a single dominant linear direction in activation space. Projecting out this directional vector removes refusal behavior across diverse prompts."
  },
  {
    "tag": "Sycophancy in Aligned LLMs",
    "lvl": "advanced",
    "q": "What is **Sycophancy** in aligned AI systems, and why does it emerge during RLHF?",
    "o": [
      "The model repeats words continuously",
      "The model falsely agrees with incorrect user premises or flatters the user's misconceptions because human evaluators reward responses that validate their preexisting beliefs",
      "The model refuses all requests",
      "The model generates random code"
    ],
    "a": 1,
    "x": "Sycophancy arises because human annotators give higher satisfaction scores to models that agree with them, training the policy to prioritize agreement over factual truth."
  },
  {
    "tag": "Self-Reward Language Models Iterative Alignment",
    "lvl": "advanced",
    "q": "How do Self-Rewarding Language Models (Yuan et al., Meta 2024) improve both instruction following and reward modeling capabilities across training iterations?",
    "o": [
      "They copy data from OpenAI",
      "The LLM acts as its own LLM-as-a-judge to evaluate and score pairs of self-generated responses, creating a new synthetic preference dataset to train the next iteration via DPO in a self-improving loop",
      "They quantize weights to 1 bit",
      "They replace attention with linear layers"
    ],
    "a": 1,
    "x": "Self-Rewarding LMs train on self-evaluated responses, improving both task-generation quality and self-evaluation grading accuracy across progressive rounds."
  }
]);

/* ===================================================================
   Module: eval — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "eval", [
  {
    "tag": "Perplexity to Cross-Entropy Conversion",
    "lvl": "advanced",
    "q": "For a test set with average cross-entropy loss $\\mathcal{L} = 2.302585$ nats per token, what is the exact mathematical Perplexity (PPL)?",
    "o": [
      "$\\text{PPL} = 2.302585$",
      "$\\text{PPL} = e^{\\mathcal{L}} = e^{2.302585} = 10.0$",
      "$\\text{PPL} = \\log_2(2.302585)$",
      "$\\text{PPL} = 100.0$"
    ],
    "a": 1,
    "x": "Perplexity is the exponentiated cross-entropy loss: $\\text{PPL} = \\exp(\\mathcal{L}) = e^{2.302585} = 10.0$. Intuitively, the model is as confused as if choosing uniformly among 10 candidate words at each step."
  },
  {
    "tag": "BLEU Score Brevity Penalty Math",
    "lvl": "advanced",
    "q": "In BLEU evaluation, given candidate length $c$ and reference length $r$, what is the Brevity Penalty (BP) formula when candidate length $c \\le r$?",
    "o": [
      "$\\text{BP} = c / r$",
      "$\\text{BP} = \\exp\\left(1 - \\frac{r}{c}\\right)$",
      "$\\text{BP} = 1.0$",
      "$\\text{BP} = 0.0$"
    ],
    "a": 1,
    "x": "When $c > r$, $\\text{BP} = 1$. When $c \\le r$, $\\text{BP} = \\exp(1 - r/c)$, exponentially penalizing overly short candidate outputs that artificially game precision."
  },
  {
    "tag": "Pass@k Unbiased Estimator",
    "lvl": "advanced",
    "q": "In code generation evaluation (HumanEval, Chen et al.), what is the unbiased estimator for $\\text{pass}@k$ given $n$ generated samples ($n \\ge k$) with $c$ correct solutions?",
    "o": [
      "$\\text{pass}@k = c / n$",
      "$\\text{pass}@k = \\mathbb{E}\\left[ 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}} \\right]$",
      "$\\text{pass}@k = (c/n)^k$",
      "$\\text{pass}@k = k \\cdot c / n$"
    ],
    "a": 1,
    "x": "Evaluating whether at least 1 of $k$ samples passes is $\\text{pass}@k = 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}}$, which provides an unbiased minimum-variance estimator without high-variance sampling."
  },
  {
    "tag": "LLM-as-a-Judge Position & Verbosity Bias",
    "lvl": "advanced",
    "q": "What two systematic cognitive biases must be controlled when using an LLM (e.g. GPT-4) as an automated judge to evaluate pairs of model completions?",
    "o": [
      "Grammar bias and spelling bias",
      "**Position Bias** (tendency to favor whichever answer is presented as Option A) and **Verbosity Bias** (tendency to favor longer answers regardless of correctness); controlled by evaluating both $(A, B)$ and $(B, A)$ permutations",
      "Font size bias and capitalization bias",
      "Temperature bias"
    ],
    "a": 1,
    "x": "LLM judges exhibit strong order bias (preferring candidate 1) and length bias. Swapping candidate order and averaging scores across both permutations mitigates position bias."
  },
  {
    "tag": "Needle In A Haystack (NIAH) Test",
    "lvl": "advanced",
    "q": "How does the Needle In A Haystack (NIAH) benchmark evaluate long-context LLM retrieval robustness?",
    "o": [
      "Counts total tokens in memory",
      "Places a single specific target sentence ('needle') at various depth percentages ($0\\%$ to $100\\%$) inside long filler text ('haystack') across varying context lengths ($1\\text{k}$ to $128\\text{k}+$ tokens) and checks if the model can accurately retrieve it",
      "Measures GPU memory bandwidth",
      "Evaluates BLEU score on Wikipedia"
    ],
    "a": 1,
    "x": "NIAH systematically varies context depth ($0-100\\%$) and document length to build a 2D heatmap showing where the model's attention retrieval fails across long contexts."
  },
  {
    "tag": "Knowledge Distillation on LLM Token Distributions",
    "lvl": "advanced",
    "q": "When distilling a large teacher LLM into a smaller student LLM (e.g. MiniLLM / DistilGPT), why is Reverse KL Divergence $\\mathcal{L} = D_{\\text{KL}}(P_{\\text{student}} \\parallel P_{\\text{teacher}})$ often preferred over Forward KL?",
    "o": [
      "Forward KL is non-differentiable",
      "Forward KL is **zero-avoiding** (forces the student to cover all modes of the teacher, producing vague/blurry average generations); Reverse KL is **mode-seeking**, forcing the student to focus on major high-probability modes and generate sharper, higher-confidence outputs",
      "Reverse KL runs on CPUs",
      "Forward KL requires reinforcement learning"
    ],
    "a": 1,
    "x": "Forward KL penalizes the student heavily when teacher probability is non-zero (mode covering). Reverse KL penalizes student when teacher probability is zero (mode seeking), generating crisp single-mode samples."
  }
]);

/* ===================================================================
   Module: reason — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "reason", [
  {
    "tag": "Tree-of-Thoughts (ToT) Search Algorithm",
    "lvl": "advanced",
    "q": "How does Tree-of-Thoughts (ToT, Yao et al.) generalize beyond standard Chain-of-Thought (CoT) prompting?",
    "o": [
      "Translates prompts to Python code",
      "Maintains a tree of intermediate thought steps, using the LLM to self-evaluate thought quality and employing deliberate heuristic tree search (BFS or DFS with backtracking) to explore multiple reasoning paths",
      "Increases model temperature to 2.0",
      "Prunes all negative tokens"
    ],
    "a": 1,
    "x": "ToT enables deliberate exploration, lookahead, and backtracking across tree-structured reasoning spaces rather than simple left-to-right greedy token sampling."
  },
  {
    "tag": "Self-Consistency Majority Voting",
    "lvl": "advanced",
    "q": "How does Self-Consistency prompting (Wang et al., 2022) improve reasoning accuracy on mathematical benchmarks (GSM8K)?",
    "o": [
      "Sets temperature to 0.0",
      "Samples multiple diverse reasoning paths at temperature $T > 0$ (e.g. 40 paths) and selects the final answer via majority vote / marginalization across all generated candidate answers",
      "Forces the model to output JSON",
      "Retries failed API calls"
    ],
    "a": 1,
    "x": "Reasoning tasks have multiple valid derivation paths leading to the same correct answer. Marginalizing over sampled reasoning traces significantly reduces idiosyncratic reasoning errors."
  },
  {
    "tag": "ReAct (Reasoning + Acting) Paradigm",
    "lvl": "advanced",
    "q": "What is the execution loop of the ReAct (Yao et al., 2022) framework in LLM autonomous agents?",
    "o": [
      "Prompt $\\rightarrow$ Response $\\rightarrow$ Exit",
      "Interleaved sequence of **Thought** (reasoning step) $\\rightarrow$ **Action** (external tool invocation, e.g. API call or search query) $\\rightarrow$ **Observation** (tool return value) $\\rightarrow$ Repeat until final answer",
      "Compile $\\rightarrow$ Execute $\\rightarrow$ Debug",
      "Input $\\rightarrow$ Quantize $\\rightarrow$ Output"
    ],
    "a": 1,
    "x": "ReAct combines verbal reasoning traces with concrete external tool actions and environment feedback observations to solve complex multi-hop problems."
  },
  {
    "tag": "Process Reward Models (PRM) vs Outcome Reward Models (ORM)",
    "lvl": "advanced",
    "q": "In mathematical reasoning alignment (Lightman et al. / OpenAI Let's Verify Step by Step), why are Process Reward Models (PRMs) superior to Outcome Reward Models (ORMs)?",
    "o": [
      "PRMs use fewer tokens",
      "PRMs assign step-level reward feedback to every individual reasoning step in a derivation, detecting intermediate logical errors even if the final numerical answer happens to be accidentally correct",
      "PRMs eliminate hallucination completely",
      "ORMs cannot score text"
    ],
    "a": 1,
    "x": "ORMs only evaluate whether the final answer is right or wrong. PRMs provide dense step-by-step supervision, identifying subtle false-positive derivations that arrive at the right answer through flawed logic."
  }
]);

/* ===================================================================
   Module: decode — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("llm", "decode", [
  {
    "tag": "Top-p (Nucleus) Sampling Cutoff Math",
    "lvl": "advanced",
    "q": "In Nucleus (Top-$p$) sampling with parameter $p = 0.90$, how is the candidate token set $V^{(p)}$ determined from sorted probability distribution $P(x_i)$?",
    "o": [
      "Takes top 90 tokens",
      "Sorts tokens by probability $P(x_1) \\ge P(x_2) \\ge \\dots$ and retains the smallest subset of top tokens whose cumulative probability $\\sum_{i=1}^{k} P(x_i) \\ge p$, re-normalizing probabilities over this dynamic subset",
      "Discards tokens with probability $< 0.90$",
      "Samples from uniform distribution"
    ],
    "a": 1,
    "x": "Nucleus sampling dynamically adjusts candidate pool size based on model confidence: when confident, the pool is small (1-2 tokens); when uncertain, the pool expands, filtering out the unreliable low-probability tail."
  },
  {
    "tag": "Min-p Sampling Dynamic Thresholding",
    "lvl": "advanced",
    "q": "How does Min-$p$ sampling calculate the dynamic probability cutoff threshold relative to the top token?",
    "o": [
      "$\\text{cutoff} = p$",
      "$\\text{cutoff} = p_{\\text{base}} \\times P(x_{\\text{top}})$ where $P(x_{\\text{top}})$ is the probability of the single highest-scoring token in the current distribution",
      "$\\text{cutoff} = 1 - p$",
      "$\\text{cutoff} = p_{\\text{base}} / \\text{vocab\\_size}$"
    ],
    "a": 1,
    "x": "Min-$p$ scales the cutoff threshold relative to the top token's probability $P(x_{\\text{top}})$, providing a more natural filter than Top-$p$ across flat vs sharp distributions."
  },
  {
    "tag": "Grammar-Constrained FSM Decoding",
    "lvl": "advanced",
    "q": "How does Grammar-Constrained Decoding (e.g. Outlines / llama.cpp BNF grammar) guarantee 100% syntactically valid JSON output from an LLM?",
    "o": [
      "Runs regex validation on output after generation completes",
      "Constructs a Deterministic Finite Automaton (FSA) from the JSON schema and, at every single token step, masks out all vocabulary token logits that would produce an illegal state transition before softmax",
      "Fine-tunes the model on 10,000 JSON files",
      "Forces temperature to 0.0"
    ],
    "a": 1,
    "x": "FSM-guided decoding maps token prefixes to valid grammar states and sets logits of non-compliant tokens to $-\\infty$, guaranteeing that sampled tokens strictly adhere to the grammar specification."
  },
  {
    "tag": "Contrastive Decoding Logit Subtraction",
    "lvl": "advanced",
    "q": "In Contrastive Decoding (Li et al., 2023), how is the output token distribution computed between an expert LLM and an amateur/small LLM?",
    "o": [
      "Averages the two probability distributions",
      "Computes the logit difference: $\\mathcal{L}_{\\text{CD}}(x_t) = \\log P_{\\text{expert}}(x_t | x_{<t}) - \\alpha \\log P_{\\text{amateur}}(x_t | x_{<t})$ over a valid plausible candidate set, amplifying expert capabilities while suppressing generic, repetitive low-level tokens",
      "Multiplies their outputs",
      "Swaps tokens every step"
    ],
    "a": 1,
    "x": "Subtracting amateur model log-probabilities amplifies the distinct, sophisticated knowledge of the expert model while subtracting common language generation artifacts and hallucinations."
  },
  {
    "tag": "Repetition Penalty Multiplicative Formula",
    "lvl": "advanced",
    "q": "In LLM decoding (Keskar et al.), how is the multiplicative Repetition Penalty $\\theta > 1$ applied to a logit $z_i$ corresponding to a token that has already appeared in the generated sequence?",
    "o": [
      "Sets $z_i = -\\infty$",
      "If $z_i > 0$, divides logit by $\\theta$ ($z_i \\leftarrow z_i / \\theta$); if $z_i \\le 0$, multiplies logit by $\\theta$ ($z_i \\leftarrow z_i \\cdot \\theta$), lowering its probability in both cases",
      "Subtracts $\\theta$ from all logits",
      "Multiplies temperature by $\\theta$"
    ],
    "a": 1,
    "x": "Repetition penalty scales positive logits down ($z/\\theta$) and negative logits further down ($z \\cdot \\theta$), consistently decreasing the exponentiated probability $e^z$ for previously seen tokens."
  },
  {
    "tag": "Function Calling Tool Choice Enforcement",
    "lvl": "advanced",
    "q": "How do LLM inference engines enforce strict schema compliance for function/tool calling?",
    "o": [
      "Re-prompting the model 10 times if JSON fails",
      "Mapping the tool's JSON Schema to a Context-Free Grammar (CFG) / pushdown automaton, forcing token generation to strictly follow valid JSON syntax for function names and argument keys",
      "Passing function outputs to Python eval",
      "Disabling token embeddings"
    ],
    "a": 1,
    "x": "Pushdown grammar constraints restrict next-token logits to grammar-compliant characters, guaranteeing valid JSON parameter serialization."
  }
]);

