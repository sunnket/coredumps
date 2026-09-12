/* ==========================================================================
   Depth pass 78 — Deep Learning batch 6: gated recurrence & attention mechanisms.
   GRU, Sequence Model, Attention Mechanism, Self-Attention,
   Multi-Head Attention, Positional Encoding, Encoder-Decoder, Embedding.

   Gated recurrence compresses temporal state; multi-head attention computes
   all-to-all topological routing; positional coordinates break permutation symmetry.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "gru",

      why: {
        before: "LSTMs cured vanishing gradients in recurrent networks but required 4 internal linear gates " +
          "and maintained two separate state vectors (cell state $c_t$ and hidden state $h_t$), resulting in high compute overhead.",
        problem: "Large-scale sequence modeling and low-latency mobile inference required a leaner recurrent cell " +
          "that preserved the long-term memory benefits of LSTMs while cutting parameters and memory transfers.",
        shift: "**Gated Recurrent Unit (GRU, Cho et al. 2014): Streamlined dual-gate recurrence.** " +
          "Merge cell state and hidden state into a single vector $h_t$, governed by two gates: " +
          "an Update Gate ($z_t$) that balances memory retention and candidate addition, and a Reset Gate ($r_t$) that controls access to previous state."
      },

      num: {
        t: "GRU vs LSTM architectural & mathematical comparison",
        h: ["Component / Property", "Long Short-Term Memory (LSTM)", "Gated Recurrent Unit (GRU)"],
        r: [
          ["**Total Internal Gates**", "**4 gates**: Forget ($f$), Input ($i$), Candidate ($\\tilde{c}$), Output ($o$)", "**2 gates**: Update ($z$) and Reset ($r$)"],
          ["**State Representation**", "**Dual state**: Cell state $c_t$ and Hidden state $h_t$", "**Single state**: Hidden state $h_t$ only"],
          ["**Update Formulation**", "$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$", "$h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t$ (convex interpolation)"],
          ["**Parameter Count**", "$4 \\times (d_h^2 + d_h d_x)$ parameters", "**$3 \\times (d_h^2 + d_h d_x)$ parameters (25% fewer)**"],
          ["**Computational Speed**", "Baseline standard", "**Up to 20-30% faster forward/backward passes**"]
        ],
        n: "The Gated Recurrent Unit (GRU) was engineered by Kyunghyun Cho et al. " +
          "in 2014 as an efficient, streamlined evolution of the LSTM. The GRU simplifies " +
          "recurrent gating through two primary mechanisms: First, it eliminates the separate " +
          "cell state $c_t$, storing all persistent memory directly in the hidden state $h_t$. " +
          "Second, it merges the LSTM's forget and input gates into a single **Update Gate ($z_t$)**: " +
          "$z_t = \\sigma(W_z [h_{t-1}, x_t] + b_z)$. " +
          "The state update is computed via a clean **convex linear interpolation**: " +
          "$h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t$. " +
          "If $z_t = 0$, the new candidate $\\tilde{h}_t$ is ignored and the previous memory $h_{t-1}$ " +
          "passes through completely unaltered. If $z_t = 1$, old memory is completely wiped and " +
          "replaced by the candidate. The **Reset Gate ($r_t$)** controls how much of the past hidden " +
          "state should be visible when computing the candidate: " +
          "$\\tilde{h}_t = \\tanh(W_h [r_t \\odot h_{t-1}, x_t] + b_h)$. " +
          "By reducing the number of matrix multiplications from 4 to 3, the GRU slashes " +
          "parameter count and GPU memory bandwidth by **25%** while matching LSTM accuracy " +
          "across most sequence modeling benchmarks."
      },

      miss: [
        {
          w: "LSTMs always achieve higher accuracy than GRUs on all sequence datasets.",
          r: "Empirical studies (Chung et al. 2014) demonstrate that GRU and LSTM performance is virtually identical across translation, speech, and time series; neither strictly dominates the other."
        },
        {
          w: "GRUs can be parallelized across time during training.",
          r: "Like all recurrent architectures, GRU step t depends on the output of step t-1 ($h_{t-1}$). It inherits the exact same serial execution constraint as LSTMs and cannot be parallelized across time steps."
        },
        {
          w: "The reset gate in a GRU is identical to the forget gate in an LSTM.",
          r: "The update gate $z_t$ acts as the forget/input gate. The reset gate $r_t$ determines whether the previous hidden state should influence candidate state generation."
        },
        {
          w: "GRUs have been completely replaced by Transformers in all applications.",
          r: "On edge microcontrollers, resource-constrained IoT devices, and real-time streaming sensor telemetry, GRUs are widely preferred due to zero quadratic memory footprint and tiny parameter sizes."
        }
      ],

      trade: {
        buys: [
          "25% fewer parameters and 20-30% faster execution than LSTM cells.",
          "Convex update gate formulation enforces a strict conservation of information between past and present.",
          "Lightweight memory footprint makes GRU the premier recurrent choice for edge and mobile deployments."
        ],
        costs: [
          "Still bound by $\\mathcal{O}(T)$ sequential execution: cannot parallelize across sequence length on GPUs.",
          "Slightly less expressive than LSTM on tasks requiring independent memory gating and output filtering.",
          "Lacks the multi-head attention capabilities of modern Transformer architectures."
        ],
        avoid: [
          "Using LSTMs instead of GRUs when hardware memory bandwidth and inference latency are severely constrained.",
          "Using GRUs on massive document-level corpora where Transformers are computationally viable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sequence-model",

      why: {
        before: "Standard machine learning algorithms treated input features as unordered bags of tokens " +
          "or fixed-width tabular vectors, completely ignoring chronological or syntactic ordering.",
        problem: "Language, audio, genomic sequences, and financial markets are governed by sequential context: " +
          "'not good, very bad' means the opposite of 'good, not very bad' despite containing identical tokens.",
        shift: "**Sequence Modeling: Learning joint probability distributions over ordered tokens.** " +
          "Model the joint sequence probability using the autoregressive chain rule of probability: " +
          "$P(x_1, x_2, \\dots, x_T) = \\prod_{t=1}^T P(x_t \\mid x_1, \\dots, x_{t-1})$, " +
          "enabling generation, translation, and structured sequence labeling across variable-length horizons."
      },

      num: {
        t: "Sequence modeling paradigm taxonomy & computational complexity",
        h: ["Paradigm / Family", "Context Mechanism", "Training Time per Token", "Inference Step Complexity", "Context Length Limit"],
        r: [
          ["**Autoregressive RNN / LSTM**", "Recurrent hidden state $h_t$", "$\\mathcal{O}(T)$ (sequential, non-parallel)", "$\\mathcal{O}(1)$ (fixed state update)", "Short to Medium ($T < 1000$)"],
          ["**Temporal 1D CNN (WaveNet)**", "Dilated causal convolutions", "$\\mathcal{O}(1)$ (fully parallel training)", "$\\mathcal{O}(\\log T)$ with circular buffers", "Medium ($T \\approx 4000$)"],
          ["**Transformer (Self-Attention)**", "All-to-all dot-product attention", "$\\mathcal{O}(1)$ (fully parallel training)", "$\\mathcal{O}(T)$ (KV-Cache scan)", "**Very Long ($10^5 - 10^6$ tokens)**"],
          ["**State Space Model (Mamba)**", "Selective linear recurrent state", "$\\mathcal{O}(1)$ (parallel associative scan)", "$\\mathcal{O}(1)$ (recurrent state update)", "**Infinite / $10^6+$ tokens**"]
        ],
        n: "Sequence modeling is the computational framework for processing " +
          "data where sequential order matters. Mathematically, a sequence model learns " +
          "a conditional probability distribution over an ordered series of discrete or continuous " +
          "tokens $(x_1, x_2, \\dots, x_T)$. Through the probabilistic **chain rule**, the joint " +
          "probability factorizes autoregressively: $P(X) = \\prod_{t=1}^T P(x_t \\mid x_{<t})$. " +
          "The historical evolution of sequence modeling spans four architectural eras: " +
          "(1) **Markov and N-gram models**, which made the strong independence assumption that $x_t$ " +
          "depended only on the preceding $n-1$ tokens; (2) **Recurrent Networks (RNNs, LSTMs, GRUs)**, " +
          "which maintained a hidden state vector $h_t$ that compressed all historical context, but suffered " +
          "from sequential training bottlenecks; (3) **Transformers**, which shattered sequential bottlenecks " +
          "by computing all-to-all attention in parallel during training, but incurred quadratic $\\mathcal{O}(T^2)$ " +
          "compute costs; and (4) **Modern Linear State Space Models (SSMs / Mamba)**, which merge the " +
          "parallel training of Transformers with the $\\mathcal{O}(1)$ inference efficiency of RNNs via " +
          "parallel associative prefix scans."
      },

      miss: [
        {
          w: "Sequence models can only process textual natural language.",
          r: "Sequence models process any ordered data modality, including raw audio waveforms, protein amino acid chains, DNA genomics, robotic motor trajectory logs, and financial order-book ticks."
        },
        {
          w: "All sequence models must process tokens sequentially one by one during training.",
          r: "Transformers and Convolutional sequence models process the ENTIRE sequence simultaneously in parallel during training by utilizing causal attention masks and parallel tensor GEMM operations."
        },
        {
          w: "Autoregressive generation can be parallelized across output tokens during inference.",
          r: "During generation, predicting token $t+1$ strictly requires the model to have already sampled token $t$. Autoregressive inference remains fundamentally sequential (unless using speculative decoding)."
        },
        {
          w: "A sequence model cannot perform classification.",
          r: "Sequence models are routinely used for classification (e.g. sentiment analysis, document tagging) by pooling token representations or taking the final hidden state projection."
        }
      ],

      trade: {
        buys: [
          "Captures arbitrary complex contextual dependencies across ordered sequences.",
          "Enables autoregressive text, audio, and code generation via probabilistic token sampling.",
          "Universal abstraction: unifies translation, transcription, summarization, and time-series forecasting."
        ],
        costs: [
          "Sequential generation bottleneck during inference: generating $N$ tokens requires $N$ sequential forward passes.",
          "Memory scaling pressures: storing context KV-caches or hidden states across long sequences strains GPU VRAM.",
          "Vulnerable to error compounding: an incorrect token sampled at step $t$ corrupts all subsequent predictions."
        ],
        avoid: [
          "Using non-causal bidirectional models (like BERT) for autoregressive text generation tasks.",
          "Neglecting KV-cache management during Transformer sequence model inference."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "attention-mechanism",

      why: {
        before: "Sequence-to-sequence networks (Encoder-Decoder RNNs) forced the encoder to compress " +
          "an entire sentence of arbitrary length into a single, fixed-size context vector $c \\in \\mathbb{R}^{d_h}$.",
        problem: "Compressing a 100-word paragraph into a single vector created an impossible information bottleneck, " +
          "causing translation accuracy to plummet rapidly for sentences longer than 20 words.",
        shift: "**Attention Mechanism (Bahdanau et al. 2014, Luong 2015): Dynamic soft-alignment retrieval.** " +
          "Retain ALL encoder hidden states and dynamically compute a normalized alignment weight distribution " +
          "between the current decoder state and all encoder states, taking a weighted sum context vector $c_t = \\sum \\alpha_{t, i} h_i$."
      },

      num: {
        t: "Attention score alignment formulations: Additive vs Multiplicative",
        h: ["Alignment Mechanism", "Score Formula $e_{i, j}$", "Compute Complexity", "Operational Advantage"],
        r: [
          ["**Additive Attention (Bahdanau)**", "$v_a^T \\tanh(W_a s_{i-1} + U_a h_j)$", "$\\mathcal{O}(d_h)$ with MLP layer", "Smooth alignment; handles disparate dimensions well"],
          ["**Multiplicative / Dot-Product (Luong)**", "$s_i^T h_j$ (or $s_i^T W_a h_j$)", "**$\\mathcal{O}(1)$ matrix multiply**", "**Blistering fast**: optimized via high-speed GPU GEMM routines"],
          ["**Scaled Dot-Product (Vaswani)**", "$\\frac{q_i k_j^T}{\\sqrt{d_k}}$", "$\\mathcal{O}(d_k)$", "Scaling factor $\\sqrt{d_k}$ prevents softmax saturation for large dimensions"],
          ["**Fixed Context Bottleneck**", "Single vector: $c \\in \\mathbb{R}^{d_h}$", "Degrades at $T > 20$", "**Completely eliminated**: attention looks back at all $T$ states"]
        ],
        n: "The Attention Mechanism was invented by Dzmitry Bahdanau, Kyunghyun Cho, " +
          "and Yoshua Bengio in 2014 to resolve the **fixed-length vector bottleneck** " +
          "in neural machine translation. In traditional seq2seq models, the encoder was " +
          "forced to compress the entire source sentence into a single vector $h_T$. " +
          "Bahdanau et al. proposed keeping **every intermediate encoder hidden state** " +
          "$(h_1, h_2, \\dots, h_{T_x})$. When the decoder generates output token $t$, " +
          "it computes an **alignment score** $e_{t, i}$ comparing its current state $s_{t-1}$ " +
          "with each encoder state $h_i$. These scores are passed through Softmax to produce " +
          "**attention weights**: $\\alpha_{t, i} = \\frac{\\exp(e_{t, i})}{\\sum_j \\exp(e_{t, j})}$. " +
          "The dynamic context vector is then computed as the weighted sum: " +
          "$c_t = \\sum_{i=1}^{T_x} \\alpha_{t, i} h_i$. " +
          "This allows the decoder to 'look back' and attend selectively to the specific source " +
          "words relevant to the word it is currently translating. This concept of **soft, differentiable " +
          "addressing** eliminated the context bottleneck and laid the direct architectural foundation " +
          "for the Transformer."
      },

      miss: [
        {
          w: "Attention requires hard selection of a single word at each step.",
          r: "Standard attention is 'Soft Attention', which is completely continuous and differentiable, taking a weighted average over all source words via Softmax. 'Hard Attention' chooses a single discrete word but requires reinforcement learning to train."
        },
        {
          w: "Attention was invented as part of the 2017 Transformer paper.",
          r: "Attention was invented in 2014 by Bahdanau et al. as an enhancement for RNN-based machine translation. The 2017 paper ('Attention Is All You Need') showed that recurrence could be eliminated entirely, leaving only attention."
        },
        {
          w: "Attention weights are human-calibrated rules.",
          r: "Attention weights are dynamic activations produced on the fly by neural projections. They are learned entirely through backpropagation and gradient descent without human labeling."
        },
        {
          w: "Cross-attention and Self-attention are identical mechanisms.",
          r: "Cross-attention compares queries from one sequence (e.g. Decoder) against keys/values from another sequence (e.g. Encoder). Self-attention computes attention among tokens within the exact same sequence."
        }
      ],

      trade: {
        buys: [
          "Completely cures the fixed-vector information bottleneck in sequence-to-sequence tasks.",
          "Bridges arbitrary long-range distances: gradient paths between distant tokens have length $\\mathcal{O}(1)$.",
          "Rich interpretability: attention weight heatmaps visualize which source tokens informed each generated output."
        ],
        costs: [
          "Quadratic computational and memory complexity $\\mathcal{O}(T_x \\cdot T_y)$ between sequences.",
          "Requires caching and storing all encoder hidden states in GPU memory throughout decoding.",
          "Softmax normalization requires global sum across all source tokens, preventing streaming chunking."
        ],
        avoid: [
          "Using plain RNN encoder-decoder architectures without attention on sentences longer than 20 words.",
          "Interpreting raw attention heatmaps as absolute proof of causality (attention correlates with, but does not strictly cause, decisions)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "self-attention",

      why: {
        before: "Capturing relationships between distant words in a sentence required sequential RNN steps ($\\mathcal{O}(T)$ steps) " +
          "or deep stacks of dilated convolutions ($\\mathcal{O}(\\log T)$ layers), which struggled with long-range dependencies.",
        problem: "RNNs cannot parallelize during training, while convolutions struggle to model relationships " +
          "between arbitrary pairs of words without deep hierarchical stacking.",
        shift: "**Self-Attention (Scaled Dot-Product Attention, Vaswani et al. 2017): Direct all-to-all topological routing.** " +
          "Map every token into Query ($Q$), Key ($K$), and Value ($V$) projections, computing pairwise affinity scores " +
          "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$ in parallel across the entire sequence."
      },

      num: {
        t: "Scaled Dot-Product Self-Attention mathematical operations & tensor dimensions",
        h: ["Step / Operation", "Mathematical Formula", "Tensor Dimensions", "Operational Complexity"],
        r: [
          ["**Linear Projections**", "$Q = X W_Q, \\, K = X W_K, \\, V = X W_V$", "$[B, N, d_{\\text{model}}]$", "GEMM: $\\mathcal{O}(N \\cdot d_{\\text{model}}^2)$"],
          ["**Raw Attention Scores**", "$S = Q K^T$", "$[B, N, N]$", "GEMM: **$\\mathcal{O}(N^2 \\cdot d_k)$** (quadratic token scaling)"],
          ["**Scale & Mask**", "$S_{\\text{scaled}} = S / \\sqrt{d_k} + M$", "$[B, N, N]$", "Prevents softmax saturation; $M$ enforces causality"],
          ["**Attention Weights ($A$)**", "$A = \\text{softmax}(S_{\\text{scaled}})$", "$[B, N, N]$", "Normalizes scores into pairwise affinity distribution"],
          ["**Context Output ($O$)**", "$O = A \\cdot V$", "$[B, N, d_k]$", "GEMM: $\\mathcal{O}(N^2 \\cdot d_k)$ weighted sum of values"]
        ],
        n: "Self-Attention is the revolutionary mathematical core of the " +
          "**Transformer architecture** (Vaswani et al. 2017). Unlike recurrent networks " +
          "that process tokens sequentially, self-attention allows **every token to attend " +
          "directly to every other token in the sequence in a single computational step**. " +
          "Given an input sequence matrix $X \\in \\mathbb{R}^{N \\times d_{\\text{model}}}$, " +
          "the layer computes three linear projections using learnable weight matrices: " +
          "**Queries ($Q = X W_Q$)**, **Keys ($K = X W_K$)**, and **Values ($V = X W_V$)**. " +
          "The dot product $Q K^T$ measures the semantic compatibility between every query token $i$ " +
          "and key token $j$. Crucially, the scores are scaled by $\\frac{1}{\\sqrt{d_k}}$: " +
          "for large vector dimensions $d_k$, the magnitude of the dot product grows large " +
          "($\\mathbb{E}[q \\cdot k] = 0, \\, \\text{Var}(q \\cdot k) = d_k$), which pushes the Softmax " +
          "function into extreme saturation regions where gradients vanish. Dividing by $\\sqrt{d_k}$ " +
          "pulls variance back to $1.0$, stabilizing gradients. The Softmax probabilities then form a " +
          "routing matrix that takes a weighted linear combination of the Value vectors: " +
          "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$. " +
          "This operation has **maximum path length $\\mathcal{O}(1)$** between any two tokens, " +
          "enabling effortless capture of long-range dependencies."
      },

      miss: [
        {
          w: "Self-attention requires knowing the sequence length N before compiling the model.",
          r: "Self-attention is completely flexible: its matrix operations ($Q K^T V$) operate dynamically on any sequence length N at runtime, bounded only by available GPU memory."
        },
        {
          w: "The scaling factor $1/\\sqrt{d_k}$ is an arbitrary heuristic.",
          r: "If components of Q and K are independent random variables with mean 0 and variance 1, their dot product has mean 0 and variance $d_k$. Scaling by $1/\\sqrt{d_k}$ mathematically restores unit variance, preventing Softmax gradient saturation."
        },
        {
          w: "Self-attention naturally understands the sequential order of words.",
          r: "Self-attention is completely permutation-invariant: shuffling the tokens produces the exact same output (permuted). Positional encodings must be explicitly added to inject token order."
        },
        {
          w: "Self-attention scales linearly with sequence length.",
          r: "Standard self-attention computes an $N \\times N$ attention matrix, scaling quadratically $\\mathcal{O}(N^2)$ in both compute and memory. FlashAttention optimizes memory I/O, but compute remains quadratic."
        }
      ],

      trade: {
        buys: [
          "Maximum path length $\\mathcal{O}(1)$: connects any two distant tokens in a single operation, eliminating vanishing gradients.",
          "Embarrassingly parallel training: unrolls all sequence positions simultaneously across GPU tensor cores.",
          "Dynamic context-aware representations: word embeddings dynamically adapt their meaning based on surrounding context."
        ],
        costs: [
          "Quadratic computational and memory complexity $\\mathcal{O}(N^2)$ with respect to context length $N$.",
          "Permutation invariance requires explicit positional encoding mechanisms (RoPE, ALiBi).",
          "High GPU memory bandwidth pressure when materializing large $N \\times N$ attention matrices (mitigated by FlashAttention)."
        ],
        avoid: [
          "Omitting the $\\frac{1}{\\sqrt{d_k}}$ scaling factor when implementing self-attention from scratch.",
          "Using naive self-attention without FlashAttention on sequences longer than 2,048 tokens."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "multi-head-attention",

      why: {
        before: "A single self-attention head computed an average over all tokens, " +
          "forcing the model to choose between tracking syntactic agreement, semantic coreference, or positional adjacency.",
        problem: "A single attention distribution cannot simultaneously attend to multiple disparate relationships " +
          "(e.g. who did what to whom, grammatical tense, and pronoun antecedents) at the same position.",
        shift: "**Multi-Head Attention (MHA, Vaswani et al. 2017): Multi-subspace parallel projection.** " +
          "Project Queries, Keys, and Values into $h$ distinct lower-dimensional subspaces ($d_k = d_{\\text{model}} / h$), " +
          "compute scaled dot-product attention in each head independently in parallel, concatenate outputs, and project linearly."
      },

      num: {
        t: "Multi-Head Attention architectural decomposition & parameter budgets",
        h: ["Parameter / Tensor", "Mathematical Formula / Dimension", "Value in Standard Transformer (Base)"],
        r: [
          ["**Number of Heads ($h$)**", "Integer hyperparameter dividing $d_{\\text{model}}$", "$h = 8$ heads (GPT-3 uses $h=96$)"],
          ["**Head Dimension ($d_k = d_v$)**", "$d_k = d_{\\text{model}} / h$", "$512 / 8 = **64$ dimensions**"],
          ["**Head Computation**", "$\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$", "$W_i^Q, W_i^K \\in \\mathbb{R}^{d_{\\text{model}} \\times d_k}$"],
          ["**Concatenation & Projection**", "$\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$", "$W^O \\in \\mathbb{R}^{h d_v \\times d_{\\text{model}}} = \\mathbb{R}^{d_{\\text{model}} \\times d_{\\text{model}}}$"],
          ["**Total Parameter Count**", "$4 \\times d_{\\text{model}}^2$ (identical to single full-rank head)", "**Identical compute/parameter cost** to single-head attention!"]
        ],
        n: "Multi-Head Attention (MHA) extends self-attention by allowing " +
          "the model to **jointly attend to information from different representation " +
          "subspaces at different positions**. In a single-head attention layer, averaging " +
          "inhibits the model from focusing on multiple distinct aspects simultaneously. " +
          "Vaswani et al. solved this by splitting the hidden dimension $d_{\\text{model}}$ " +
          "into $h$ parallel heads, where each head operates in a reduced subspace of dimension " +
          "$d_k = d_{\\text{model}} / h$. For example, in Transformer-Base with $d_{\\text{model}} = 512$ " +
          "and $h = 8$, each head operates on $d_k = 64$. " +
          "Each head has its own learnable projection matrices $W_i^Q, W_i^K, W_i^V \\in \\mathbb{R}^{d_{\\text{model}} \\times d_k}$. " +
          "Crucially, because the dimension of each head is scaled down by $1/h$, **the total computational " +
          "cost and parameter count of multi-head attention is identical to single-head attention with full dimensionality**! " +
          "After parallel attention computation across all $h$ heads, the resulting $h$ output vectors " +
          "are concatenated: $\\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) \\in \\mathbb{R}^{N \\times d_{\\text{model}}}$, " +
          "and multiplied by an output projection matrix $W^O \\in \\mathbb{R}^{d_{\\text{model}} \\times d_{\\text{model}}}$ " +
          "to synthesize the multi-head representations into a unified tensor. Probing studies reveal " +
          "that individual heads specialize naturally: some track direct syntactic dependencies (verb-object), " +
          "others resolve pronouns (coreference), and others attend to previous or subsequent tokens."
      },

      miss: [
        {
          w: "Multi-Head Attention has h-times more parameters and compute than single-head attention.",
          r: "Because each head's dimension is reduced to $d_k = d_{\\text{model}} / h$, the sum of parameter dimensions across all heads equals $h \\times (d_{\\text{model}} \\times d_{\\text{model}}/h) = d_{\\text{model}}^2$, exactly matching a single full-rank head."
        },
        {
          w: "All attention heads in a trained Transformer are equally important.",
          r: "Pruning studies (Michel et al. 2019) show that up to 40% of attention heads can be pruned post-training with virtually zero loss in accuracy, as some heads learn redundant representations."
        },
        {
          w: "Multi-Head Attention requires sequential loops across heads in code.",
          r: "Modern implementations reshape the input tensor into $[B, h, N, d_k]$ and execute all heads simultaneously in a single batched matrix multiplication (BMM) on GPU tensor cores."
        },
        {
          w: "Multi-Query Attention (MQA) and Grouped-Query Attention (GQA) are just marketing names for MHA.",
          r: "MQA shares a single Key and Value head across all Query heads; GQA groups Key/Value heads. Both drastically reduce KV-cache memory during LLM inference, solving memory bandwidth bottlenecks."
        }
      ],

      trade: {
        buys: [
          "Simultaneously captures diverse syntactic, semantic, and positional relationships across separate subspaces.",
          "Identical computational complexity and parameter cost to single-head attention.",
          "Specialization of heads enables robust representation learning across complex multi-modal sequences."
        ],
        costs: [
          "Increases KV-cache memory footprint during autoregressive inference (mitigated by GQA/MQA in modern LLMs).",
          "Reshaping and transposing tensors between $[B, N, d]$ and $[B, h, N, d_k]$ introduces memory overhead.",
          "Head pruning and dynamic routing add complexity to model optimization."
        ],
        avoid: [
          "Implementing MHA with a Python for-loop over heads (always use batched tensor reshaping).",
          "Using standard MHA for massive 70B+ LLMs without Grouped-Query Attention (GQA) to manage KV-cache memory."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "positional-encoding",

      why: {
        before: "Recurrent networks (RNNs) captured word order through sequential time steps, " +
          "while Bag-of-Words and pure Self-Attention were completely permutation-invariant.",
        problem: "Self-attention computes dot products based purely on content: the sentences 'the dog bit the man' " +
          "and 'the man bit the dog' produce the exact same attention outputs without explicit token position coordinates.",
        shift: "**Positional Encoding: Injecting order into permutation-invariant attention.** " +
          "Add or multiply spatial/temporal coordinate vectors into token embeddings, " +
          "using sinusoidal wave functions, learned parameter tables, or relative rotation operators (RoPE)."
      },

      num: {
        t: "Positional encoding taxonomy & mathematical formulations",
        h: ["Encoding Scheme", "Mathematical Formulation", "Type", "Extrapolation & Modern Adoption"],
        r: [
          ["**Sinusoidal (Vaswani 2017)**", "$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right); \\, \\cos$", "Absolute (Additive)", "Analytical; smooth dot-product decay; limited length extrapolation"],
          ["**Learned Absolute (BERT / GPT-2)**", "$E_{\\text{pos}} \\in \\mathbb{R}^{L_{\\max} \\times d}$ lookup table", "Absolute (Additive)", "**Hard context ceiling**: cannot process sequences longer than $L_{\\max}$"],
          ["**T5 Relative Bias**", "$S_{ij} = \\frac{q_i k_j^T}{\\sqrt{d_k}} + b_{i - j}$", "Relative (Bias)", "Encodes relative distance $i-j$; generalizes well to longer sequences"],
          ["**RoPE (Rotary Position Embedding)**", "$R_{\\Theta, m}^d x_m$ (complex 2D rotations)", "**Relative via Inner Product**", "**Universal standard in modern LLMs** (Llama 3, Mistral, Qwen)"],
          ["**ALiBi (Press et al. 2021)**", "$S_{ij} = \\frac{q_i k_j^T}{\\sqrt{d_k}} - m \\cdot |i - j|$", "Relative (Linear Slope)", "Zero parameters; extrapolates to sequences 10x longer than training"]
        ],
        n: "Because Self-Attention operates on sets rather than sequences, " +
          "it is inherently **permutation-invariant**: $\\text{Attention}(P X) = P \\, \\text{Attention}(X)$ " +
          "for any permutation matrix $P$. To enable the network to recognize sequence order, " +
          "**Positional Encoding** injects spatial coordinate signals into the token representations. " +
          "In the original Transformer, Vaswani et al. used **Sinusoidal Positional Encodings**, " +
          "where each dimension of the position vector corresponds to a sinusoid of different frequency: " +
          "$PE_{(pos, 2i)} = \\sin\\left(pos / 10000^{2i/d}\\right)$ and " +
          "$PE_{(pos, 2i+1)} = \\cos\\left(pos / 10000^{2i/d}\\right)$. " +
          "This fixed geometric progression allows the model to learn relative positions easily, because " +
          "for any fixed offset $k$, $PE_{pos+k}$ is a linear function of $PE_{pos}$. " +
          "However, modern frontier Large Language Models have largely abandoned additive sinusoidal " +
          "encodings in favor of **RoPE (Rotary Position Embedding, Su et al. 2021)**. " +
          "RoPE rotates the Query and Key vectors in 2D coordinate pairs by an angle proportional " +
          "to their position: $\\tilde{q}_m = R_{\\Theta, m} q_m$. " +
          "Crucially, the inner product between rotated vectors naturally preserves relative distance: " +
          "$\\langle \\tilde{q}_m, \\tilde{k}_n \\rangle = g(q, k, m-n)$. " +
          "This grants modern LLMs superior context length extrapolation and rotary interpolation capabilities."
      },

      miss: [
        {
          w: "Adding positional encodings directly to token embeddings corrupts word semantic meanings.",
          r: "In high-dimensional spaces (e.g. $d = 4096$), semantic word information and positional frequencies occupy nearly orthogonal subspaces. The network easily disentangles content from position."
        },
        {
          w: "Learned positional embeddings (like in GPT-2) can extrapolate to any length at test time.",
          r: "Learned positional embeddings use a fixed lookup table of size $L_{\\max}$ (e.g. 2048). If a test prompt has 2049 tokens, the model crashes because position index 2048 does not exist in the embedding table."
        },
        {
          w: "Positional encodings are required in Recurrent Neural Networks (RNNs).",
          r: "RNNs process tokens sequentially one by one ($t=1, 2, 3$). Sequential processing inherently enforces word order without needing positional embeddings."
        },
        {
          w: "RoPE adds parameters to the model.",
          r: "RoPE is a fixed mathematical rotation operator applied to Queries and Keys; it adds zero learnable parameters to the model."
        }
      ],

      trade: {
        buys: [
          "Enables permutation-invariant attention networks to understand syntax, grammar, and chronological order.",
          "RoPE enables context length extension via simple frequency scaling (YaRN, RoPE interpolation).",
          "Sinusoidal and RoPE approaches require zero learnable parameters."
        ],
        costs: [
          "Additive encodings struggle to extrapolate to sequence lengths significantly longer than seen during training.",
          "Applying rotational matrices (RoPE) adds minor memory bandwidth overhead during query-key projection kernels.",
          "Learned absolute embeddings hardcode an immutable context ceiling into the model architecture."
        ],
        avoid: [
          "Using learned absolute positional embeddings when designing models intended for long-context extrapolation.",
          "Omitting positional encodings in Transformer architectures (reduces the model to a bag-of-words)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "encoder-decoder",

      why: {
        before: "Standard neural networks mapped fixed inputs to fixed outputs ($X \\in \\mathbb{R}^{d_{\\text{in}}} \\to Y \\in \\mathbb{R}^{d_{\\text{out}}}$), " +
          "failing when input and output sequences had disparate, variable lengths (e.g. translating a 15-word English sentence into a 12-word French sentence).",
        problem: "Generating target sequences requires bidirectional understanding of the full source context " +
          "combined with strict causal autoregressive generation of the target sequence.",
        shift: "**Encoder-Decoder Architecture (Seq2Seq, Sutskever 2014, Vaswani 2017): Asymmetric representation & generation.** " +
          "An Encoder processes the full source sequence bidirectionally to extract contextual representations; " +
          "a Decoder autoregressively generates the target sequence token-by-token using causal masking and Cross-Attention."
      },

      num: {
        t: "Encoder-Decoder vs Decoder-Only vs Encoder-Only architectures",
        h: ["Architecture Paradigm", "Attention Type", "Information Access", "Canonical Models / Primary Tasks"],
        r: [
          ["**Encoder-Decoder**", "Bidirectional Encoder + Causal Cross-Attention Decoder", "Full source context $\\to$ autoregressive output", "**T5, BART, Whisper**: Machine Translation, Summarization, Speech-to-Text"],
          ["**Encoder-Only**", "Bidirectional Self-Attention only", "Full all-to-all context across all tokens", "**BERT, RoBERTa**: Classification, Extractive QA, Embeddings"],
          ["**Decoder-Only**", "Causal / Autoregressive Self-Attention only", "Left-to-right past tokens only ($j \\le i$)", "**GPT-4, Llama 3, Claude**: Text Generation, General Foundation LLMs"],
          ["**Cross-Attention Bottleneck**", "Decoder queries attend to Encoder Keys/Values: $Q_{\\text{dec}} K_{\\text{enc}}^T$", "Evaluated at every decoder layer", "Transfers full source conditioning into generation"]
        ],
        n: "The Encoder-Decoder architecture is the classical framework for " +
          "**Sequence-to-Sequence (Seq2Seq)** transformation. The network is partitioned " +
          "into two specialized sub-networks: (1) The **Encoder**, which ingests the source sequence " +
          "$X = (x_1, \\dots, x_{T_x})$ using **unmasked, bidirectional self-attention**. " +
          "Every source token can attend to all other source tokens, building rich, deeply contextualized " +
          "representations of the input without any causal masking. (2) The **Decoder**, which " +
          "generates the target sequence $Y = (y_1, \\dots, y_{T_y})$ **autoregressively**. " +
          "The decoder consists of two distinct attention layers in each block: first, **Masked Causal " +
          "Self-Attention**, which prevents target tokens from peeking into future target tokens " +
          "(enforcing $j \\le i$); and second, **Cross-Attention (Encoder-Decoder Attention)**, " +
          "where the Queries come from the previous decoder layer, while the Keys and Values are " +
          "retrieved directly from the final Encoder output! " +
          "While **Decoder-Only** architectures (like GPT) dominate pure generative text, Encoder-Decoder " +
          "models remain the gold standard for **asymmetric modality tasks** like Speech Recognition (Whisper), " +
          "where a dense audio spectrogram encoder conditions a text decoder."
      },

      miss: [
        {
          w: "Modern Large Language Models like GPT-4 and Llama 3 are Encoder-Decoder models.",
          r: "GPT-4, Llama 3, and Mistral are DECODER-ONLY models. They dispense with the encoder entirely, processing both prompt and generation within a single causal autoregressive model."
        },
        {
          w: "The Encoder in a Transformer requires a causal mask to prevent lookahead.",
          r: "The Encoder is explicitly unmasked and bidirectional: looking ahead is desirable because the full source sentence is already known at inference time."
        },
        {
          w: "The Encoder and Decoder must have the exact same number of layers.",
          r: "Encoder and decoder depths can be asymmetric. In many speech-to-text models, a heavy 24-layer audio encoder feeds into a lightweight 6-layer text decoder."
        },
        {
          w: "Cross-Attention must be recomputed on the encoder outputs for every new generated token.",
          r: "Encoder outputs are computed ONCE during the initial pre-fill phase and cached. Subsequent autoregressive decoding steps simply reuse the cached encoder Key and Value tensors."
        }
      ],

      trade: {
        buys: [
          "Optimal for asymmetric modality tasks: effortlessly pairs audio, vision, or source language encoders with text decoders.",
          "Bidirectional source comprehension: encoder representations capture holistic context without causal degradation.",
          "Reuses cached encoder representations throughout multi-token decoding."
        ],
        costs: [
          "Higher architectural complexity: maintains two distinct sets of weights, attention mechanisms, and KV-caches.",
          "Underperforms decoder-only models on general-purpose in-context few-shot prompting.",
          "Cross-attention layers add computational FLOPs and parameter overhead to decoder blocks."
        ],
        avoid: [
          "Using Encoder-Decoder architectures for open-ended conversational chatbots where Decoder-Only models excel.",
          "Re-evaluating the Encoder forward pass during autoregressive token generation (always cache encoder outputs)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "embedding",

      why: {
        before: "Discrete categorical variables and words were represented as sparse, orthogonal One-Hot vectors, " +
          "which suffered from the curse of dimensionality ($V \\times V$ matrices) and assumed all words were equally dissimilar.",
        problem: "In one-hot encoding, $\\text{dist}(\\text{'cat'}, \\text{'kitten'}) = \\text{dist}(\\text{'cat'}, \\text{'refrigerator'}) = \\sqrt{2}$; " +
          "models cannot generalize across synonyms, concepts, or related entities.",
        shift: "**Embedding: Dense continuous latent vector representation.** " +
          "Map discrete vocabulary tokens or categorical IDs into a compact continuous vector space $E \\in \\mathbb{R}^d$ ($d \\ll V$), " +
          "where geometric proximity (cosine similarity) directly reflects semantic similarity and relational analogies."
      },

      num: {
        t: "Embedding vectors vs One-Hot encoding properties",
        h: ["Dimension / Property", "One-Hot Encoding", "Dense Embedding Vector"],
        r: [
          ["**Vector Dimensionality**", "Sparse: $V$ dimensions (e.g. $100,000$)", "**Dense: $d$ dimensions** (e.g. $768, 1536, 4096$)"],
          ["**Matrix Sparsity**", "$99.999\\%$ zeros; single $1.0$", "**100% dense real values** ($-\\infty, +\\infty$)"],
          ["**Semantic Distance**", "Orthogonal: dot product is strictly $0.0$", "**Continuous**: $\\cos(u, v) \\approx 1.0$ for synonyms"],
          ["**Lookup Complexity**", "Sparse matrix multiply: $\\mathcal{O}(V)$", "**Direct array slice indexing**: $\\mathcal{O}(1)$ via pointer offset"],
          ["**Linear Vector Analogies**", "Impossible", "**Mikolov Analogy**: $\\vec{v}_{\\text{King}} - \\vec{v}_{\\text{Man}} + \\vec{v}_{\\text{Woman}} \\approx \\vec{v}_{\\text{Queen}}$"]
        ],
        n: "An Embedding is a learnable mapping from a discrete categorical domain " +
          "(words, user IDs, product SKUs) into a continuous low-dimensional vector space: " +
          "$f: \\{1, \\dots, V\\} \\to \\mathbb{R}^d$. Formally, an embedding layer is a parameter matrix " +
          "$E \\in \\mathbb{R}^{V \\times d}$, where $V$ is vocabulary size and $d$ is embedding dimension. " +
          "While mathematically equivalent to multiplying a one-hot vector by matrix $E$ ($1_{w}^T E$), " +
          "software frameworks implement embeddings as an $\\mathcal{O}(1)$ **table lookup** " +
          "(`nn.Embedding(V, d)`), directly indexing row $w$ from GPU memory without matrix multiplication. " +
          "The theoretical justification rests on the **Distributional Hypothesis** (Firth 1957: " +
          "*'You shall know a word by the company it keeps'*). When trained end-to-end or via self-supervised " +
          "objectives (Word2Vec, Masked Language Modeling), embedding spaces organize themselves geometrically: " +
          "semantically similar words cluster tightly together, categorical hierarchies form parallel directional " +
          "manifolds, and vector arithmetic reveals linear analogies (e.g. $\\vec{v}_{\\text{Paris}} - \\vec{v}_{\\text{France}} + \\vec{v}_{\\text{Japan}} \\approx \\vec{v}_{\\text{Tokyo}}$). " +
          "In modern AI, embeddings form the universal currency powering **Vector Databases**, " +
          "Approximate Nearest Neighbor (ANN) search, and Retrieval-Augmented Generation (**RAG**)."
      },

      miss: [
        {
          w: "An embedding layer performs an expensive matrix multiplication during inference.",
          r: "An embedding layer is simply a memory array lookup table: `E[token_id]`. It retrieves a pointer to a pre-stored row of floats in $\\mathcal{O}(1)$ time with zero multiplication."
        },
        {
          w: "Static embeddings (like Word2Vec) can handle words with multiple meanings (polysemy).",
          r: "Static embeddings assign a single fixed vector per word: 'bank' (river) and 'bank' (finance) share the exact same vector. Modern contextual embeddings (Transformers) dynamically compute new embeddings based on surrounding sentence context."
        },
        {
          w: "Embedding dimensions should always be as large as possible.",
          r: "Excessively large embedding dimensions waste GPU VRAM, increase inference latency, and cause overfitting on small vocabularies. Dimensions typically range between 64 (tabular) and 4096 (frontier LLMs)."
        },
        {
          w: "Cosine similarity is the only way to compare embedding vectors.",
          r: "While cosine similarity is standard, dot-product (inner product) and Euclidean distance ($L_2$) are equally valid; if embeddings are normalized to unit length ($\\|v\\|=1$), dot product and cosine similarity are mathematically identical."
        }
      ],

      trade: {
        buys: [
          "Compresses sparse categorical inputs into compact, expressive, dense continuous vector representations.",
          "Encodes semantic similarity and conceptual relationships directly into Euclidean geometric distances.",
          "Powers modern vector retrieval, semantic search, and Retrieval-Augmented Generation (RAG) systems."
        ],
        costs: [
          "Vocabulary size $V$ scales parameter footprint linearly: an embedding table for $100,000$ tokens at $d=4096$ requires $1.6$ GB of VRAM.",
          "Out-of-Vocabulary (OOV) tokens require subword tokenization (BPE, WordPiece) to avoid lookup failures.",
          "Static embeddings cannot resolve polysemous word senses without contextual attention layers."
        ],
        avoid: [
          "Using one-hot encoding for high-cardinality features ($>1,000$ categories) when embeddings are far more compact.",
          "Forgetting to normalize embedding vectors before performing fast inner-product vector database similarity search."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
