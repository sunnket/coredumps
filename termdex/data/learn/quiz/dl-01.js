/* DL — 50+ Hardcore Question Bank (IIT/PhD Level). */

/* ===================================================================
   Module: nets — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "nets", [
  {
    "tag": "Universal Approximation Theorem",
    "lvl": "advanced",
    "q": "What is the exact requirement of the Cybenko (1989) / Hornik Universal Approximation Theorem for a feedforward network with 1 hidden layer to approximate any continuous function on a compact subset of $\\mathbb{R}^n$?",
    "o": [
      "The activation function must be linear",
      "The activation function must be non-constant, bounded, and continuous (non-linear), with an arbitrarily large number of hidden neurons",
      "The network must have at least 100 hidden layers",
      "The weights must be initialized with orthogonal matrices"
    ],
    "a": 1,
    "x": "The Universal Approximation Theorem proves that a single hidden layer feedforward network with non-linear continuous activation functions can approximate any continuous function on compact subsets of $\\mathbb{R}^n$ to arbitrary precision $\\epsilon > 0$, provided sufficient hidden units are allocated."
  },
  {
    "tag": "Vanishing Gradients & Sigmoid Saturation",
    "lvl": "advanced",
    "q": "For the standard logistic sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$, what is its maximum possible derivative value $\\sigma'(z)$, and why does this trigger vanishing gradients in deep networks?",
    "o": [
      "Maximum derivative is 1.0 at $z=0$",
      "Maximum derivative is $0.25$ at $z=0$; multiplying $L$ layers together decays gradients by at least $(0.25)^L$",
      "Maximum derivative is 0.5",
      "Maximum derivative is infinite"
    ],
    "a": 1,
    "x": "$\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$. The maximum occurs at $z=0$ where $\\sigma(0) = 0.5 \\implies 0.5 \\times 0.5 = 0.25$. Backpropagating through 10 layers multiplies gradients by at most $(0.25)^{10} \\approx 10^{-6}$, effectively killing parameter updates in early layers."
  },
  {
    "tag": "Dead ReLU Problem",
    "lvl": "advanced",
    "q": "Why do neurons using standard $\\text{ReLU}(z) = \\max(0, z)$ sometimes become permanently 'dead' during training?",
    "o": [
      "ReLU overflows on positive numbers",
      "If a large gradient updates weights such that the neuron outputs $z < 0$ for all training samples, its gradient is strictly $0$ everywhere, so it will never receive non-zero gradient updates again",
      "ReLU cannot be computed on GPUs",
      "ReLU disables bias terms"
    ],
    "a": 1,
    "x": "For $z < 0$, $\\text{ReLU}'(z) = 0$. If a neuron's activation becomes negative across the entire dataset due to an aggressive learning rate step, zero gradient flows through it forever. Leaky ReLU or GELU solves this by maintaining non-zero slopes for negative inputs."
  },
  {
    "tag": "GELU Probabilistic Gating",
    "lvl": "advanced",
    "q": "Gaussian Error Linear Unit (GELU) is defined as $\\text{GELU}(x) = x \\Phi(x) = x P(X \\le x)$ where $X \\sim \\mathcal{N}(0, 1)$. What intuitive property does GELU provide over standard ReLU?",
    "o": [
      "GELU is piece-wise constant",
      "GELU probabilistically scales inputs by their percentile value, providing smooth non-zero curvature for negative values (preventing dead neurons) while asymptotically matching ReLU for large positive inputs",
      "GELU is non-differentiable",
      "GELU bounds outputs between -1 and 1"
    ],
    "a": 1,
    "x": "GELU weights inputs by their likelihood under a standard normal cumulative distribution $\\Phi(x)$. It is smooth, non-monotonic, and allows negative inputs near zero to pass small negative values, improving gradient propagation in deep transformers (used in GPT, BERT, RoBERTa)."
  },
  {
    "tag": "SwiGLU Activation Function",
    "lvl": "advanced",
    "q": "Why do modern LLMs (LLaMA, PaLM) use SwiGLU $\\text{SwiGLU}(x) = \\text{Swish}(x W) \\otimes (x V)$ in their MLP feedforward layers instead of standard ReLU/GELU MLPs?",
    "o": [
      "SwiGLU uses fewer parameters",
      "SwiGLU is a Gated Linear Unit where one projection acts as an adaptive multiplicative gate over the other, consistently yielding superior validation perplexity across extensive scaling benchmarks (Shazeer, 2020)",
      "SwiGLU is linear",
      "SwiGLU eliminates GPU memory fragmentation"
    ],
    "a": 1,
    "x": "SwiGLU combines Swish with Gated Linear Units: $(\\text{Swish}(xW) \\otimes xV) W_2$. The component-wise product allows dynamic feature gating, significantly outperforming standard MLPs at equivalent compute budgets."
  },
  {
    "tag": "Depthwise Separable Convolutions FLOP Reduction",
    "lvl": "advanced",
    "q": "In MobileNet, how does a Depthwise Separable Convolution (Depthwise $D_k \\times D_k$ per channel + Pointwise $1 \\times 1$ across channels) reduce computational FLOPs compared to standard 2D convolution?",
    "o": [
      "Reduces FLOPs by exactly 50%",
      "Reduces computational cost by a factor of $\\frac{1}{N} + \\frac{1}{D_k^2}$ (where $N$ is output channels and $D_k$ is kernel size, achieving 8x–9x speedup for $3 \\times 3$ filters)",
      "Eliminates all multiply-accumulate operations",
      "Runs exclusively on CPUs"
    ],
    "a": 1,
    "x": "Standard conv cost is $D_k \\cdot D_k \\cdot M \\cdot N \\cdot D_F \\cdot D_F$. Depthwise separable cost is $D_k^2 \\cdot M \\cdot D_F^2 + M \\cdot N \\cdot D_F^2$. Ratio is $\\frac{1}{N} + \\frac{1}{D_k^2}$."
  },
  {
    "tag": "InfoNCE Contrastive Loss Formula",
    "lvl": "advanced",
    "q": "In Contrastive Representation Learning (SimCLR / CLIP), what is the purpose of the temperature parameter $\\tau$ in the InfoNCE loss $\\mathcal{L} = -\\log \\frac{\\exp(\\text{sim}(z_i, z_j)/\\tau)}{\\sum_k \\exp(\\text{sim}(z_i, z_k)/\\tau)}$?",
    "o": [
      "Normalizes gradients to unit norm",
      "Controls the penalty hardness on hard negative examples: smaller $\\tau$ scales logits up, causing the loss to focus gradients almost exclusively on the most challenging, confusing negative samples",
      "Converts embeddings to binary codes",
      "Prevents model collapse by adding Gaussian noise"
    ],
    "a": 1,
    "x": "Lower temperature values create sharper probability distributions, forcing the gradient to penalize hard negatives that are erroneously close to the anchor in cosine embedding space."
  }
]);

/* ===================================================================
   Module: train — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "train", [
  {
    "tag": "AdamW Decoupled Weight Decay",
    "lvl": "advanced",
    "q": "Why does AdamW (Loshchilov & Hutter) decouple weight decay from gradient updates rather than implementing L2 regularization in the loss function?",
    "o": [
      "L2 regularization inside Adam scales weight decay by the adaptive second-moment preconditioner $1/\\sqrt{\\hat{v}_t + \\epsilon}$, causing weights with large gradients to experience less decay than weights with small gradients; AdamW subtracts decay directly from weights $\\theta_{t+1} = \\theta_t - \\gamma w_t - \\frac{\\alpha}{\\sqrt{v_t}} m_t$",
      "AdamW runs in $O(1)$ time",
      "L2 regularization crashes PyTorch",
      "AdamW is for SGD only"
    ],
    "a": 0,
    "x": "In standard Adam with L2 loss, weight decay is added to gradients, meaning it gets divided by $\\sqrt{v_t}$. Weights with large historical gradients get decayed *less*, which is opposite to true L2 shrinkage. AdamW decouples weight decay directly into parameter updates."
  },
  {
    "tag": "Gradient Clipping L2 Norm Thresholding",
    "lvl": "advanced",
    "q": "In deep RNN and Transformer training, how does Global Gradient Norm Clipping ($g \\leftarrow g \\cdot \\frac{\\text{threshold}}{\\max(\\text{threshold}, \\|g\\|_2)}$) prevent gradient explosion without corrupting update direction?",
    "o": [
      "It sets all gradients to zero",
      "It scales the entire gradient vector proportionally, preserving its exact directional angle in parameter space while capping its Euclidean magnitude to $\\text{threshold}$",
      "It converts floats to integers",
      "It randomly drops 50% of weights"
    ],
    "a": 1,
    "x": "Dividing by $\\max(\\text{threshold}, \\|g\\|_2)$ preserves the unit vector $\\hat{g} = g / \\|g\\|$, maintaining the exact gradient descent direction while preventing catastrophic parameter step explosions."
  },
  {
    "tag": "Cosine Annealing with Warm Restarts",
    "lvl": "advanced",
    "q": "What is the primary benefit of the Cosine Annealing Learning Rate Schedule with Warm Restarts (SGDR, Loshchilov & Hutter)?",
    "o": [
      "It keeps the learning rate constant",
      "Periodically resetting the learning rate to maximum allows the optimizer to escape sharp, sub-optimal local minima and explore different basins of attraction across parameter space",
      "It prevents GPU overheating",
      "It disables momentum"
    ],
    "a": 1,
    "x": "Dropping learning rate finds local minima; suddenly restarting learning rate gives the optimizer kinetic energy to jump out of sharp local basins and converge into wider, more generalizable flat minima."
  },
  {
    "tag": "Sharpness-Aware Minimization (SAM)",
    "lvl": "advanced",
    "q": "What objective does the Sharpness-Aware Minimization (SAM, Foret et al.) optimizer minimize beyond empirical training loss?",
    "o": [
      "Minimizes the number of layers",
      "Minimizes the worst-case loss in an $\\epsilon$-neighborhood: $\\min_w \\max_{\\|\\epsilon\\| \\le \\rho} \\mathcal{L}(w + \\epsilon)$, actively driving parameters toward flat minima that exhibit superior out-of-distribution generalization",
      "Minimizes model disk size",
      "Minimizes matrix trace"
    ],
    "a": 1,
    "x": "SAM seeks parameters whose entire surrounding neighborhood has low loss (flat minima), mathematically bounding generalization error and boosting test accuracy."
  },
  {
    "tag": "Cross-Entropy Label Smoothing",
    "lvl": "advanced",
    "q": "How does Label Smoothing ($y_{\\text{smooth}} = (1 - \\epsilon) y + \\frac{\\epsilon}{K}$) prevent model overconfidence and improve calibration in classification networks?",
    "o": [
      "It removes the softmax layer",
      "It prevents the model from driving logit activations toward $\\pm \\infty$ to produce 100% probabilities, keeping weights bounded and regularizing the penultimate feature representation",
      "It converts multi-class to binary",
      "It speeds up backpropagation by 10x"
    ],
    "a": 1,
    "x": "Standard cross-entropy forces logits toward infinity to reach probability 1.0. Label smoothing sets target probability to $1 - \\epsilon$, forcing finite logit margins and preventing overconfident miscalibration."
  },
  {
    "tag": "BF16 vs FP16 Numerical Stability",
    "lvl": "advanced",
    "q": "Why is Bfloat16 (BF16) preferred over standard FP16 for training large deep learning models on modern GPUs/TPUs?",
    "o": [
      "BF16 uses only 8 bits of memory",
      "BF16 allocates 8 bits to the exponent (identical to FP32) and 7 bits to the mantissa, providing the exact same dynamic dynamic range as FP32 and completely eliminating underflow/overflow without requiring dynamic Loss Scaling",
      "BF16 has higher precision than FP32",
      "BF16 requires no hardware support"
    ],
    "a": 1,
    "x": "FP16 has only 5 exponent bits (range $10^{-5}$ to $65504$), requiring complex dynamic loss scaling to prevent underflow. BF16 has 8 exponent bits (range $10^{-38}$ to $10^{38}$), matching FP32 dynamic range perfectly."
  },
  {
    "tag": "AdaFactor Optimizer Memory Reduction",
    "lvl": "advanced",
    "q": "How does the AdaFactor optimizer (Shazeer & Stern) reduce optimizer VRAM footprint compared to Adam?",
    "o": [
      "Discards momentum entirely",
      "Factorizes the 2D second-moment matrix $V \\in \\mathbb{R}^{R \\times C}$ into row and column sums ($R + C$), reducing state memory from $O(R \\cdot C)$ to $O(R + C)$",
      "Replaces 32-bit floats with 1-bit booleans",
      "Runs optimizer steps on CPU"
    ],
    "a": 1,
    "x": "AdaFactor replaces full $R \\times C$ second-moment tracking with low-rank row and column marginal factorizations, slashing optimizer VRAM from 8 bytes/param to near zero."
  },
  {
    "tag": "Lion Optimizer Signum Updates",
    "lvl": "advanced",
    "q": "How does Google's Lion (EvoLved Sign Momentum) optimizer compute parameter updates?",
    "o": [
      "Computes second-order Hessian inversions",
      "Applies the sign operator to momentum: $u_t = \\text{sign}(\\beta_1 m_{t-1} + (1 - \\beta_1) g_t)$, enforcing a uniform magnitude update across every single parameter and saving memory by tracking only first moments",
      "Samples from a Gaussian distribution",
      "Uses coordinate descent"
    ],
    "a": 1,
    "x": "Lion uses the signum operation $\\text{sign}(\\cdot)$, making every coordinate update have the exact same step size $\\pm \\eta$, eliminating second-moment variance tracking and saving substantial VRAM."
  }
]);

/* ===================================================================
   Module: attn — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "attn", [
  {
    "tag": "Scaled Dot-Product Attention Variance",
    "lvl": "advanced",
    "q": "In Transformer self-attention $\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$, why is the dot product strictly divided by $\\sqrt{d_k}$?",
    "o": [
      "To convert the matrix product into an orthogonal projection",
      "Assuming elements of $q$ and $k$ are independent random variables with mean 0 and variance 1, their dot product has variance $d_k$; for large $d_k$, large logits push softmax into saturated near-zero gradient regions",
      "To prevent floating point overflow in GPU registers",
      "To enforce causality in autoregressive generation"
    ],
    "a": 1,
    "x": "The variance of the sum of $d_k$ independent unit-variance components is $d_k$, so its standard deviation is $\\sqrt{d_k}$. Dividing by $\\sqrt{d_k}$ normalizes the variance back to 1.0, preventing softmax from saturating."
  },
  {
    "tag": "FlashAttention GPU Memory Hierarchy",
    "lvl": "advanced",
    "q": "How does FlashAttention (Dao et al.) achieve 2x–4x wall-clock speedups without approximating the mathematical output of attention?",
    "o": [
      "It quantizes 16-bit floats into 4-bit integers",
      "It tiles $Q, K, V$ into blocks in GPU SRAM and computes exact Online Softmax, completely avoiding reading/writing the intermediate $N \\times N$ attention matrix to slow GPU High Bandwidth Memory (HBM)",
      "It converts attention into linear RNN layers",
      "It drops the lower 50% lowest-scoring attention weights"
    ],
    "a": 1,
    "x": "Standard attention is IO-bound by writing/reading the $N \\times N$ matrix to HBM. FlashAttention tiles queries and keys into SRAM and uses the Online Softmax algorithm to update softmax normalizers incrementally in $O(N)$ memory."
  },
  {
    "tag": "Multi-Head vs Multi-Query vs Grouped-Query Attention",
    "lvl": "advanced",
    "q": "In terms of Key-Value head counts ($H_{kv}$) relative to Query heads ($H_q$), what is the exact configuration of Multi-Query Attention (MQA)?",
    "o": [
      "$H_{kv} = H_q$",
      "$H_{kv} = 1$ (all $H_q$ Query heads share a single Key head and a single Value head across the entire layer)",
      "$H_{kv} = H_q / 8$",
      "$H_{kv} = 0$"
    ],
    "a": 1,
    "x": "Multi-Query Attention (MQA, Shazeer 2019) collapses all Key and Value heads to strictly $H_{kv} = 1$, reducing KV-cache bandwidth to the absolute minimum at the cost of minor capacity degradation."
  },
  {
    "tag": "Rotary Position Embedding (RoPE) Dot Product Invariant",
    "lvl": "advanced",
    "q": "What algebraic identity allows Rotary Position Embedding (RoPE) to encode relative token distances $m - n$?",
    "o": [
      "$R_m + R_n = R_{m+n}$",
      "$\\langle R_{\\Theta, m} q, R_{\\Theta, n} k \\rangle = q^T R_{\\Theta, m}^T R_{\\Theta, n} k = q^T R_{\\Theta, n-m} k = g(q, k, m-n)$ via orthogonal 2D rotation matrix properties",
      "$\\det(R_m) = m$",
      "$R_m k = 0$"
    ],
    "a": 1,
    "x": "Because 2D rotation matrices satisfy $R_m^T R_n = R_{-m} R_n = R_{n-m}$, the inner product of rotated Query and Key vectors depends strictly on their relative token offset $m - n$."
  },
  {
    "tag": "Causal Masking Matrix in Autoregressive Decoders",
    "lvl": "advanced",
    "q": "In autoregressive decoder self-attention, how is the causal attention mask applied to the attention score logits $S = \\frac{QK^T}{\\sqrt{d_k}}$ before softmax?",
    "o": [
      "Multiply by 0",
      "Add an upper-triangular matrix with $-\\infty$ above the main diagonal (setting future positions to $-\\infty$ so $\\text{softmax}(-\\infty) = 0$)",
      "Subtract the diagonal",
      "Zero out the lower triangle"
    ],
    "a": 1,
    "x": "Adding $-\\infty$ to upper-triangular elements forces their exponentiated values to $e^{-\\infty} = 0$, strictly preventing token $t$ from attending to future tokens $t+1, t+2, \\dots$."
  },
  {
    "tag": "Perceiver IO Cross-Attention Bottleneck",
    "lvl": "advanced",
    "q": "How does the Perceiver / Perceiver IO (Jaegle et al.) scale transformer attention to 100,000+ input tokens without $O(M^2)$ memory explosion?",
    "o": [
      "Compresses tokens using gzip",
      "Uses an asymmetric Cross-Attention layer where a small fixed set of learned latent vectors ($N \\approx 512$) queries the large raw input sequence ($M \\approx 100,000$), reducing attention complexity from $O(M^2)$ to $O(M \\cdot N)$",
      "Runs attention on CPUs only",
      "Prunes all self-attention layers"
    ],
    "a": 1,
    "x": "Perceiver distills arbitrary high-dimensional multimodal inputs of length $M$ into a compact latent array of length $N \\ll M$ via cross-attention, followed by deep $O(N^2)$ latent self-attention."
  }
]);

/* ===================================================================
   Module: reg — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "reg", [
  {
    "tag": "LayerNorm vs BatchNorm in Transformers",
    "lvl": "advanced",
    "q": "Why is Layer Normalization used in sequence transformers instead of Batch Normalization?",
    "o": [
      "LayerNorm is non-linear",
      "BatchNorm computes statistics across the batch dimension ($N$), which fluctuates on variable-length padded sequences and fails on batch size 1, whereas LayerNorm normalizes across the feature dimension ($D$) independently per token",
      "LayerNorm eliminates trainable bias parameters",
      "BatchNorm cannot run on Tensor Cores"
    ],
    "a": 1,
    "x": "BatchNorm normalizes across batch samples, corrupting statistics on padded sequences. LayerNorm normalizes across feature dimensions per token, making it completely independent of batch size and padding."
  },
  {
    "tag": "RMSNorm Efficiency Optimization",
    "lvl": "advanced",
    "q": "Why do modern LLMs (LLaMA, Gemma) replace standard LayerNorm with Root Mean Square Normalization (RMSNorm, Zhang & Sennrich)?",
    "o": [
      "RMSNorm uses 64-bit precision",
      "RMSNorm hypothesizes that scaling invariance is the core driver of normalization success, completely eliminating the mean computation $\\mu$ and centering step to compute $\\bar{a}_i = \\frac{a_i}{\\text{RMS}(a)} g_i$, saving 10%–50% GPU kernel execution time",
      "RMSNorm is non-differentiable",
      "RMSNorm adds batch normalization"
    ],
    "a": 1,
    "x": "RMSNorm proves that enforcing scale regularity without calculating and subtracting the mean $\\mu = \\frac{1}{D} \\sum x_i$ yields identical learning stability while saving substantial GPU memory bandwidth."
  },
  {
    "tag": "Weight Initialization Kaiming He vs Xavier Glorot",
    "lvl": "advanced",
    "q": "For networks with ReLU activations, why is He (Kaiming) initialization variance $\\text{Var}(W) = \\frac{2}{n_{\\text{in}}}$ used instead of Xavier (Glorot) initialization $\\text{Var}(W) = \\frac{2}{n_{\\text{in}} + n_{\\text{out}}}$?",
    "o": [
      "ReLU doubles the magnitude of inputs",
      "Because ReLU zeroes out approximately 50% of activations in expectation, halving the variance; the factor of 2 in the numerator compensates for this 50% loss to preserve signal variance across layers",
      "He initialization works only with Sigmoid",
      "Xavier initialization produces complex numbers"
    ],
    "a": 1,
    "x": "Since ReLU sets negative activations to zero, $\\mathbb{E}[\\text{ReLU}(z)^2] = \\frac{1}{2} \\text{Var}(z)$. Xavier assumes linear zero-mean activations; Kaiming He derived that multiplying variance by 2 ($\text{Var}(W) = 2/n_{\text{in}}$) restores unit variance."
  },
  {
    "tag": "Monte Carlo Dropout (MC Dropout)",
    "lvl": "advanced",
    "q": "How does Monte Carlo Dropout (Gal & Ghahramani) estimate Epistemic (Model) Uncertainty during inference?",
    "o": [
      "Trains 1,000 separate networks",
      "Keeps Dropout active during inference time and passes the same input $T$ times through the network to sample from the approximate Bayesian posterior distribution over weights, using output variance as the epistemic uncertainty measure",
      "Measures GPU memory usage",
      "Uses random weights"
    ],
    "a": 1,
    "x": "Gal & Ghahramani proved that dropout training is mathematically equivalent to variational inference in Gaussian processes. Keeping dropout on at inference samples from the model's weight posterior."
  },
  {
    "tag": "Weight Standardization (WS)",
    "lvl": "advanced",
    "q": "How does Weight Standardization (Qiao et al.) allow training with micro-batch sizes (1–2 images per GPU) without batch norm degradation?",
    "o": [
      "Standardizes training labels",
      "Normalizes the convolution filter weights $\\hat{W} = \\frac{W - \\mu_W}{\\sigma_W}$ in the forward pass, smoothing the loss landscape Lipschitz constants and eliminating dependency on batch statistics when combined with GroupNorm",
      "Quantizes weights to INT8",
      "Deletes bias terms"
    ],
    "a": 1,
    "x": "Weight Standardization re-parameterizes weights to have zero mean and unit variance per output channel, decoupling normalization from batch sizes."
  },
  {
    "tag": "Stochastic Depth DropPath Regularization",
    "lvl": "advanced",
    "q": "In deep Vision Transformers and ResNets, how does Stochastic Depth (DropPath, Huang et al.) regularize deep networks during training?",
    "o": [
      "Zeroes out individual scalar weights randomly",
      "Randomly drops entire residual blocks with probability $p_l$ linearly increasing with layer depth during training, effectively training an ensemble of varying-depth networks while keeping all layers active at inference",
      "Reduces convolution filter size",
      "Deletes attention heads"
    ],
    "a": 1,
    "x": "DropPath skips entire transformation blocks $x_{l+1} = x_l + b_l F(x_l)$ where $b_l \\sim \\text{Bernoulli}(1 - p_l)$, preventing deep feature redundancy and speeding up training."
  }
]);

/* ===================================================================
   Module: arch — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "arch", [
  {
    "tag": "Residual Skip Connections Gradient Highway",
    "lvl": "advanced",
    "q": "Mathematically, why do residual skip connections $x_{l+1} = x_l + F(x_l, W_l)$ eliminate vanishing gradients in deep ResNets?",
    "o": [
      "Because $F(x_l)$ is always linear",
      "By the chain rule, $\\frac{\\partial \\mathcal{E}}{\\partial x_l} = \\frac{\\partial \\mathcal{E}}{\\partial x_L} \\left( \\mathbf{I} + \\frac{\\partial}{\\partial x_l} \\sum_{i=l}^{L-1} F_i \\right)$; the identity matrix $\\mathbf{I}$ guarantees that gradient $\\frac{\\partial \\mathcal{E}}{\\partial x_L}$ flows directly back to layer $l$ without passing through decaying weight products",
      "Skip connections double the parameter count",
      "They eliminate the need for backpropagation"
    ],
    "a": 1,
    "x": "Expanding recursions reveals $x_L = x_l + \\sum F_i$. Differentiating gives the identity term $\\mathbf{I}$. Even if all weight gradients vanish to zero, the $+1$ identity path delivers clean gradients directly to early layers."
  },
  {
    "tag": "Mixture of Experts (MoE) Auxiliary Loss",
    "lvl": "advanced",
    "q": "In Sparse Mixture of Experts (MoE) models (e.g. Mixtral 8x7B), why is an auxiliary Load Balancing Loss $\\mathcal{L}_{\\text{aux}} = \\alpha N \\sum_{i=1}^N f_i P_i$ added to the training objective?",
    "o": [
      "To force all experts to share identical weights",
      "To prevent routing collapse where the top-k router continuously routes 99% of all tokens to the same 1 or 2 favorite experts while other experts receive zero tokens and stop learning",
      "To compress model weights to 4-bit precision",
      "To eliminate the softmax layer"
    ],
    "a": 1,
    "x": "Without load balancing, routing exhibits positive feedback: slightly better initialized experts receive more tokens, learn faster, and starve other experts. Auxiliary loss penalizes uneven expert utilization."
  },
  {
    "tag": "Vision Transformer (ViT) Patch Projection",
    "lvl": "advanced",
    "q": "In Vision Transformer (ViT, Dosovitskiy et al.), how is a 2D image of resolution $H \\times W \\times C$ with patch size $P$ converted into a sequence of 1D token embeddings?",
    "o": [
      "Running a 50-layer ResNet backbone",
      "Flattening the image into $N = \\frac{HW}{P^2}$ patches of dimension $P^2 C$ and applying a trainable linear projection matrix $E \\in \\mathbb{R}^{(P^2 C) \\times D}$ (implemented efficiently as a 2D Conv with kernel $P$ and stride $P$)",
      "Computing 2D discrete Fourier transforms",
      "Passing pixels directly into self-attention"
    ],
    "a": 1,
    "x": "ViT divides the image into $N = HW/P^2$ non-overlapping patches and projects each flattened patch of size $P^2 C$ into vector space $\\mathbb{R}^D$ via a linear layer or strided 2D convolution."
  },
  {
    "tag": "Squeeze-and-Excitation (SE) Channel Attention",
    "lvl": "advanced",
    "q": "What two mathematical operations define a Squeeze-and-Excitation (SE, Hu et al.) block on feature map $X \\in \\mathbb{R}^{H \\times W \\times C}$?",
    "o": [
      "Matrix multiplication and transpose",
      "**Squeeze**: Global Average Pooling to aggregate spatial information into a $1 \\times 1 \\times C$ channel descriptor; **Excitation**: A two-layer bottleneck MLP with Sigmoid gating producing per-channel scale factors $s \\in [0, 1]^C$",
      "2D Fourier transform and bandpass filter",
      "Max pooling and sorting"
    ],
    "a": 1,
    "x": "Squeeze computes global channel statistics $z_c = \\frac{1}{HW} \\sum x_{i,j,c}$. Excitation computes non-linear channel dependencies $s = \\sigma(W_2 \\text{ReLU}(W_1 z))$ to recalibrate feature maps."
  },
  {
    "tag": "Transposed Convolution Checkerboard Artifacts",
    "lvl": "advanced",
    "q": "Why do Transposed Convolutions (Deconvolutions) in GAN generators frequently produce visible 'checkerboard' artifacts in generated images?",
    "o": [
      "Because of color quantization",
      "When kernel size is not evenly divisible by stride, filter receptive fields overlap unevenly on the output grid, causing periodic 2D stripes of amplified activation magnitudes; solved by Bilinear Upsampling followed by standard convolution",
      "Because GAN discriminators use ReLU",
      "Due to floating point underflow"
    ],
    "a": 1,
    "x": "Unequal kernel-stride division creates uneven overlap patterns across 2D output coordinates, producing periodic high-frequency checkerboard patterns. Sub-pixel convolution or bilinear resizing avoids this."
  },
  {
    "tag": "Dilated (Atrous) Convolutions Receptive Field",
    "lvl": "advanced",
    "q": "What is the formula for the effective kernel size $K'$ of a 1D convolution with base kernel size $K$ and dilation rate $d$?",
    "o": [
      "$K' = K \\times d$",
      "$K' = K + (K - 1)(d - 1)$",
      "$K' = K / d$",
      "$K' = K^d$"
    ],
    "a": 1,
    "x": "A dilated convolution inserts $d - 1$ zeros between consecutive filter taps. The effective spatial span is $K' = K + (K - 1)(d - 1)$, exponentially expanding the receptive field without downsampling or parameter increase."
  },
  {
    "tag": "Transformer-XL Segment-Level Recurrence",
    "lvl": "advanced",
    "q": "How does Transformer-XL (Dai et al.) model long-range context across consecutive text segments without recomputing activations?",
    "o": [
      "Trains an external LSTM layer",
      "Caches the hidden state sequence of the previous segment in memory and prepends it to the Key and Value matrices of the current segment, enabling cross-segment attention flow while using relative positional encodings",
      "Doubles the attention window size",
      "Compresses tokens into vectors"
    ],
    "a": 1,
    "x": "Transformer-XL reuses cached activations from prior chunks as extended key-value memory, allowing information to propagate across arbitrary context lengths without context fragmentation."
  }
]);

/* ===================================================================
   Module: torch — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "torch", [
  {
    "tag": "PyTorch Autograd Tape Mechanics",
    "lvl": "advanced",
    "q": "In PyTorch's dynamic computational graph (Reverse-Mode Autograd), what role does the `grad_fn` attribute play on a Tensor?",
    "o": [
      "Stores the Tensor memory address in C",
      "Points to the `Node` object in the backward Directed Acyclic Graph (DAG) that computes vector-Jacobian products (VJPs) during `.backward()`",
      "Encrypts the tensor",
      "Deletes intermediate gradients"
    ],
    "a": 1,
    "x": "Every Tensor created by an operation has a `grad_fn` referencing the specific backward function node. Calling `.backward()` traverses these nodes in reverse topological order, executing VJPs."
  },
  {
    "tag": "Tensor Hook and In-Place Mutation Trap",
    "lvl": "advanced",
    "q": "Why does performing an in-place mutation (e.g. `x.add_(1)`) on a tensor needed for backward gradient computation trigger `RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation`?",
    "o": [
      "PyTorch arrays are strictly immutable",
      "Autograd saves specific forward activation tensors needed to compute derivatives (e.g. $x$ in $\\frac{\\partial}{\\partial x} x^2 = 2x$); mutating $x$ in-place overwrites the stored forward values with new data, invalidating the mathematical integrity of the gradient calculation",
      "In-place operations are disabled on GPUs",
      "In-place operations corrupt CUDA driver"
    ],
    "a": 1,
    "x": "Backward formulas require the exact forward activation values saved in `ctx.save_for_backward`. Overwriting those memory buffers in-place corrupts derivative computation, raising runtime errors."
  },
  {
    "tag": "Activation Checkpointing (Gradient Checkpointing)",
    "lvl": "advanced",
    "q": "How does Activation Checkpointing (PyTorch `torch.utils.checkpoint`) reduce GPU VRAM consumption by 60%–80% during large model training at the cost of ~20% compute overhead?",
    "o": [
      "Compresses weights to 2 bits",
      "It discards intermediate forward activation tensors from VRAM during the forward pass, and dynamically recomputes them on-the-fly during the backward pass for each segment",
      "Moves the entire model to CPU memory",
      "Disables optimizer states"
    ],
    "a": 1,
    "x": "Instead of storing every layer's activation matrix in GPU RAM for the backward pass, checkpointing stores only segment boundary tensors and re-executes the forward pass for that block during backward."
  },
  {
    "tag": "DistributedDataParallel vs DataParallel (DDP vs DP)",
    "lvl": "advanced",
    "q": "Why is PyTorch `DistributedDataParallel` (DDP) vastly superior to legacy `DataParallel` (DP)?",
    "o": [
      "DP runs only on CPUs",
      "DP is single-process multi-threaded and suffers from Python GIL bottlenecks and heavy scatter/gather parameter replication on GPU 0; DDP spawns 1 independent OS process per GPU, communicating via non-blocking Ring-AllReduce with zero GIL contention",
      "DP cannot run on Linux",
      "DDP uses 10x more VRAM"
    ],
    "a": 1,
    "x": "DP replicates models from master GPU 0 on every forward pass under a single Python GIL thread. DDP runs separate native processes per GPU, synchronizing gradients asynchronously via NCCL Ring-AllReduce."
  }
]);

/* ===================================================================
   Module: pretrain — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "pretrain", [
  {
    "tag": "ZeRO-3 (Zero Redundancy Optimizer) Memory Sharding",
    "lvl": "advanced",
    "q": "In DeepSpeed's ZeRO-3 memory optimization for distributed training, what components of the training state are sharded across all data-parallel GPUs?",
    "o": [
      "Only model outputs",
      "Optimizer states (ZeRO-1), Gradients (ZeRO-2), and **Model Parameters** (ZeRO-3), eliminating all redundant memory replication so total VRAM per GPU scales linearly as $\\frac{\\text{Memory}}{N_{\\text{GPUs}}}$",
      "Only dataset batches",
      "Zero components are sharded"
    ],
    "a": 1,
    "x": "ZeRO-1 shards optimizer states (16 bytes/param in FP32 Adam). ZeRO-2 shards gradients (2 bytes/param). ZeRO-3 shards the actual FP16 model weights (2 bytes/param), gathering them on-demand via All-Gather during forward/backward."
  },
  {
    "tag": "Tensor Parallelism Megatron-LM Matrix Splits",
    "lvl": "advanced",
    "q": "In Megatron-LM Tensor Parallelism for an MLP layer $Y = \\text{GELU}(X A) B$, how are weight matrices $A$ and $B$ partitioned across GPUs to minimize inter-GPU communication?",
    "o": [
      "Both $A$ and $B$ are split row-wise",
      "$A$ is partitioned **Column-wise** ($A = [A_1, A_2]$) so GELU evaluates independently without communication, and $B$ is partitioned **Row-wise** ($B = [B_1; B_2]$) with an `All-Reduce` sum at the very end",
      "Both are split along diagonals",
      "Partitioning is done randomly"
    ],
    "a": 1,
    "x": "Column-parallel $A$ computes $Y_i = \\text{GELU}(X A_i)$ locally without communication. Row-parallel $B$ computes $Y_i B_i$. Summing across GPUs requires only a single `All-Reduce` at the layer output."
  },
  {
    "tag": "Pipeline Parallelism 1F1B Schedule",
    "lvl": "advanced",
    "q": "In Pipeline Parallelism (Megatron-LM / PipeDream), why is the **1F1B (One Forward, One Backward)** schedule preferred over naive GPipe batch scheduling?",
    "o": [
      "1F1B eliminates backpropagation",
      "1F1B alternates executing one forward chunk and one backward chunk per device, bounding the number of active in-flight micro-batches in memory to the number of pipeline stages ($P$) and drastically reducing peak activation VRAM",
      "1F1B runs without GPU synchronization",
      "GPipe cannot run on NVIDIA GPUs"
    ],
    "a": 1,
    "x": "GPipe accumulates forward activations for all $M$ microbatches before starting backwards. 1F1B immediately frees activation memory as soon as each backward micro-batch completes, capping activation VRAM to $O(P)$."
  },
  {
    "tag": "Weight Tying in Language Modeling",
    "lvl": "advanced",
    "q": "What is the mathematical justification and memory benefit of **Weight Tying** (Press & Wolf) in language models?",
    "o": [
      "Combines Conv2D with Linear layers",
      "Shares the exact same parameter matrix between the input token embedding layer $E \\in \\mathbb{R}^{V \\times D}$ and the output unembedding LM head projection matrix $W_{\\text{out}} = E^T$, halving vocabulary parameter count while regularizing semantic representations",
      "Eliminates attention heads",
      "Converts softmax to sigmoid"
    ],
    "a": 1,
    "x": "Because input word vectors and output word prediction scores inhabit the same semantic vector space, setting $W_{\\text{out}} = E$ forces them to share representations while saving $V \\times D$ parameters (~100M+ parameters)."
  }
]);

/* ===================================================================
   Module: adapt — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("dl", "adapt", [
  {
    "tag": "Prefix Tuning vs Prompt Tuning vs LoRA",
    "lvl": "advanced",
    "q": "What is the architectural distinction between Prefix Tuning (Li & Liang) and LoRA (Hu et al.) for parameter-efficient fine-tuning?",
    "o": [
      "Prefix tuning modifies model weights directly; LoRA adds prompt tokens",
      "Prefix Tuning prepends learned continuous virtual key-value prompt vectors to all attention layers, while LoRA injects trainable low-rank decomposition matrices ($Delta W = B A$) parallel to existing frozen linear weight projections",
      "Prefix tuning is only for CNNs",
      "LoRA trains all weights"
    ],
    "a": 1,
    "x": "Prefix tuning optimizes continuous virtual key-value prefix tensors prepended to attention layers. LoRA adds low-rank linear adapters $\\Delta W = B A$ directly to weight projections."
  },
  {
    "tag": "QLoRA Double Quantization & NF4",
    "lvl": "advanced",
    "q": "How does QLoRA (Dettmers et al.) fine-tune a 65B model on a single 48GB GPU without performance degradation?",
    "o": [
      "Prunes 90% of model layers",
      "Quantizes base weights to 4-bit NormalFloat (NF4 - information-theoretically optimal for Gaussian weights), uses Double Quantization to compress quantization constants, and implements Paged Optimizers to manage CUDA memory spikes during backward passes",
      "Runs training on CPU RAM",
      "Converts transformer to Mamba"
    ],
    "a": 1,
    "x": "QLoRA combines NF4 quantization, double quantization (quantizing quantization constants, saving 0.37 bits/param), and paged memory paging to fine-tune 4-bit base models with 16-bit LoRA adapters."
  },
  {
    "tag": "Reparameterization Trick in VAEs",
    "lvl": "advanced",
    "q": "In Variational Autoencoders (VAEs), why is the Reparameterization Trick ($z = \\mu + \\sigma \\odot \\epsilon$ where $\\epsilon \\sim \\mathcal{N}(0, I)$) mathematically required to train the encoder via backpropagation?",
    "o": [
      "Sampling from $\\mathcal{N}(\\mu, \\sigma^2)$ is non-differentiable (zero gradient through stochastic nodes); isolating the randomness into independent noise $\\epsilon$ makes the latent code a deterministic differentiable function of $\\mu$ and $\\sigma$",
      "Gaussian distribution has no mean",
      "To eliminate the KL divergence term",
      "Backpropagation cannot calculate squares"
    ],
    "a": 0,
    "x": "Stochastic nodes block backpropagation because sampling operations have undefined gradients. The reparameterization trick moves the stochasticity into an external independent input $\\epsilon$, allowing gradients to flow freely through $\\mu$ and $\\sigma$."
  },
  {
    "tag": "VQ-VAE Straight-Through Estimator",
    "lvl": "advanced",
    "q": "In Vector Quantized VAE (VQ-VAE, van den Oord et al.), how does the Straight-Through Estimator backpropagate gradients from the decoder back to the encoder through the non-differentiable argmin codebook discretization operation $z_q = e_k$?",
    "o": [
      "Computes high-dimensional integrals",
      "Copies gradients directly from the quantized vector $z_q$ to the continuous encoder output $z_e$ ($z_q = z_e + \\text{sg}[z_q - z_e]$), while using a Commitment Loss $\\beta \\|z_e - \\text{sg}[e]\\|^2$ to train encoder outputs to match codebook vectors",
      "Uses reinforcement learning policy gradients",
      "Quantizes gradients to 1-bit"
    ],
    "a": 1,
    "x": "The argmin quantization operation has zero derivative. The straight-through estimator copies gradients directly across the quantization operator in the backward pass: $\\nabla_z \\mathcal{L} = \\nabla_{z_q} \\mathcal{L}$."
  },
  {
    "tag": "Classifier-Free Guidance (CFG) Math",
    "lvl": "advanced",
    "q": "In Diffusion Models, what is the exact formula for Classifier-Free Guidance (CFG, Ho & Salimans) score prediction with guidance scale $w > 1$?",
    "o": [
      "$\\hat{\\epsilon} = \\epsilon_\\theta(x_t, c) + \\epsilon_\\theta(x_t, \\emptyset)$",
      "$\\hat{\\epsilon}_\\theta(x_t, c) = \\epsilon_\\theta(x_t, \\emptyset) + w \\left( \\epsilon_\\theta(x_t, c) - \\epsilon_\\theta(x_t, \\emptyset) \\right) = (1 - w) \\epsilon_\\theta(x_t, \\emptyset) + w \\epsilon_\\theta(x_t, c)$",
      "$\\hat{\\epsilon} = w \\cdot \\epsilon_\\theta(x_t, c)$",
      "$\\hat{\\epsilon} = \\epsilon_\\theta(x_t, c) / w$"
    ],
    "a": 1,
    "x": "CFG extrapolates in the direction of the conditioned score vector away from the unconditioned score vector by scale $w$, significantly increasing sample prompt fidelity and alignment."
  },
  {
    "tag": "Spectral Normalization on GAN Discriminators",
    "lvl": "advanced",
    "q": "Why is Spectral Normalization ($W_{\\text{SN}} = W / \\sigma(W)$ where $\\sigma(W)$ is the matrix spectral norm) applied to discriminator weight matrices in Wasserstein GANs?",
    "o": [
      "To speed up matrix multiplication",
      "It bounds the matrix spectral norm to strictly 1.0, guaranteeing that the discriminator function is **1-Lipschitz continuous** as strictly required by the Kantorovich-Rubinstein duality theorem for WGANs",
      "To eliminate negative weights",
      "To prevent mode collapse in generators"
    ],
    "a": 1,
    "x": "Dividing by the matrix spectral norm (largest singular value $\\sigma_1$) bounds the Lipschitz constant $\\|f\\|_{\\text{Lip}} \\le 1$, satisfying the mathematical constraint of Wasserstein distance optimization."
  },
  {
    "tag": "DDPM Forward Closed-Form Sampling",
    "lvl": "advanced",
    "q": "In Denoising Diffusion Probabilistic Models (DDPM, Ho et al.), what is the closed-form equation to sample noisy latent $x_t$ directly from clean image $x_0$ at arbitrary timestep $t$ without simulating intermediate steps?",
    "o": [
      "$x_t = x_0 + t \\cdot \\epsilon$",
      "$x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon$ where $\\bar{\\alpha}_t = \\prod_{s=1}^t (1 - \\beta_s)$ and $\\epsilon \\sim \\mathcal{N}(0, \\mathbf{I})$",
      "$x_t = x_0 / \\sqrt{t}$",
      "$x_t = \\exp(-\\beta t) x_0$"
    ],
    "a": 1,
    "x": "By composing Gaussian transition properties, $q(x_t|x_0) = \\mathcal{N}(x_t; \\sqrt{\\bar{\\alpha}_t}x_0, (1-\\bar{\\alpha}_t)\\mathbf{I})$, allowing single-step forward diffusion sampling for any timestep $t$."
  },
  {
    "tag": "WGAN Gradient Penalty (WGAN-GP)",
    "lvl": "advanced",
    "q": "In WGAN-GP (Gulrajani et al.), why is the Gradient Penalty $\\lambda \\mathbb{E}_{\\hat{x}} [(\\|\\nabla_{\\hat{x}} D(\\hat{x})\\|_2 - 1)^2]$ computed on straight line interpolations $\\hat{x} = \\epsilon x_{\\text{real}} + (1 - \\epsilon) x_{\\text{fake}}$?",
    "o": [
      "To speed up training",
      "Enforces the 1-Lipschitz property by penalizing discriminator gradients whose norm deviates from 1 along the data manifold between real and generated distributions, resolving weight clipping capacity collapse",
      "Normalizes discriminator outputs between 0 and 1",
      "Prevents generator mode collapse"
    ],
    "a": 1,
    "x": "Weight clipping in vanilla WGAN forces weights to extreme values $\\pm c$. Gradient penalty penalizes deviations from unit norm $\\|\\nabla D\\|=1$ directly on interpolated samples."
  }
]);

