/* ==========================================================================
   Depth pass 79 — Deep Learning batch 7: transfer, generative foundations & frameworks.
   Transfer Learning, Pre-training, Autoencoder, Diffusion Model,
   Tensor, Automatic Differentiation, Computational Graph, PyTorch.

   Pre-trained representations transfer across downstream tasks; autograd
   engines traverse dynamic graphs across multi-dimensional tensor layouts.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "transfer-learning",

      why: {
        before: "Every machine learning model had to be trained from scratch on task-specific labeled data, " +
          "requiring millions of labeled images or texts for every new commercial application.",
        problem: "Acquiring millions of high-quality human labels for niche domains (e.g. rare disease pathology, " +
          "specialized legal contracts) is economically unviable and technically impossible.",
        shift: "**Transfer Learning: Cross-domain knowledge amortization.** " +
          "Take a model pre-trained on a massive generic source dataset (e.g. ImageNet, Common Crawl), " +
          "freeze or adapt its learned feature representations, and fine-tune it on a target domain with minimal labeled data."
      },

      num: {
        t: "Transfer learning adaptation strategies & parameter regimes",
        h: ["Strategy / Paradigm", "Trained Parameters", "Compute Cost & Memory", "Best Suited Target Profile"],
        r: [
          ["**Feature Extraction (Linear Probing)**", "Output head only ($<1\\%$ of weights frozen)", "**Minimal**: fast CPU/GPU training", "Small target dataset ($N < 1,000$); highly similar to source domain"],
          ["**Full Fine-Tuning**", "**$100\\%$ of model parameters**", "High: full backward pass across entire graph", "Large target dataset ($N > 50,000$); domain differs from pre-training"],
          ["**Parameter-Efficient (PEFT / LoRA)**", "Low-rank adapter matrices ($<0.1\\%$ parameters)", "**Extremely low**: 70% VRAM reduction", "**Standard in LLMs**: adapts 70B models on single consumer GPU"],
          ["**Gradual Unfreezing**", "Unfreezes layers from top to bottom gradually", "Medium: stabilizes intermediate representations", "Prevents catastrophic forgetting on specialized text/vision"],
          ["**Domain Transfer Efficiency**", "**Requires $100\\times$ less data**", "Reuses generic edge/syntax features", "Solves data scarcity in healthcare and industrial inspection"]
        ],
        n: "Transfer Learning formalizes the reuse of knowledge across domains. " +
          "Given a source domain $\\mathcal{D}_S$ with learning task $\\mathcal{T}_S$ and a target " +
          "domain $\\mathcal{D}_T$ with task $\\mathcal{T}_T$, transfer learning leverages the representation " +
          "space learned in the source task to maximize performance on the target task. " +
          "In deep networks, early layers learn **generic, domain-agnostic primitives** " +
          "(e.g. Gabor edges, color blobs, phonetic transitions, grammatical syntax), " +
          "while late layers capture task-specific semantics. Transfer learning operates along a spectrum: " +
          "(1) **Feature Extraction (Linear Probing)**: all pre-trained layers are frozen, and their " +
          "output embeddings are passed to a simple linear classifier. (2) **Full Fine-Tuning**: " +
          "all network weights are updated with a very small learning rate (e.g. $10^{-5}$), adapting " +
          "the entire backbone to the new task. (3) **Parameter-Efficient Fine-Tuning (PEFT / LoRA)**: " +
          "the pre-trained weights remain frozen, while low-rank decomposition matrices $W = W_0 + B A$ " +
          "are injected into linear projections, enabling parameter adaptation with less than 0.1% " +
          "trainable parameters. The principal hazard during fine-tuning is **Catastrophic Forgetting**, " +
          "where aggressive gradient updates destroy the rich general knowledge acquired during pre-training."
      },

      miss: [
        {
          w: "Transfer learning is only possible if the source and target tasks are identical.",
          r: "Transfer learning excels across completely disparate tasks: a model pre-trained on generic image classification (ImageNet) transfers seamlessly to cancer tumor segmentation, satellite object detection, and autonomous driving."
        },
        {
          w: "Full fine-tuning is always superior to linear probing (feature extraction).",
          r: "When the target dataset is small, full fine-tuning rapidly overfits the training samples, destroying pre-trained general representations. In data-scarce regimes, linear probing or LoRA achieves higher test accuracy."
        },
        {
          w: "Fine-tuning should use the same high learning rate as pre-training.",
          r: "Pre-training uses high learning rates (e.g. 1e-3). Fine-tuning requires learning rates that are 10x to 100x smaller (e.g. 1e-5 to 5e-5) to avoid catastrophic disruption of pre-trained feature detectors."
        },
        {
          w: "Transfer learning only works between identical model architectures.",
          r: "Through knowledge distillation, representations can be transferred across disparate architectures: a massive 100B teacher Transformer can transfer its learned capabilities into a lightweight 1B student model."
        }
      ],

      trade: {
        buys: [
          "Cuts labeled data requirements by 90-99%, unlocking deep learning in niche, data-scarce domains.",
          "Dramatically slashes training wall-clock time and carbon footprints compared to training from scratch.",
          "Provides an exceptional inductive bias, leading to higher final accuracy and out-of-distribution robustness."
        ],
        costs: [
          "Risk of Negative Transfer: if source domain is fundamentally mismatched with target domain, performance degrades.",
          "Vulnerable to inheriting biases, vulnerabilities, and toxicity embedded in the pre-training source corpus.",
          "Managing large foundation model checkpoint storage across multiple downstream fine-tuned instances."
        ],
        avoid: [
          "Fine-tuning large foundation models with large learning rates without a warmup schedule.",
          "Training deep networks from scratch on small domain datasets ($N < 10,000$) when high-quality pre-trained models exist."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pre-training",

      why: {
        before: "Neural networks were trained exclusively via supervised learning on labeled datasets, " +
          "leaving 99.9% of the world's text, video, and audio unused because human labeling was too costly.",
        problem: "Supervised models learn narrow, brittle representations that do not generalize " +
          "beyond the specific annotated classification categories of the training benchmark.",
        shift: "**Pre-training (Self-Supervised Learning): Foundation representation initialization.** " +
          "Train massive neural networks on vast, uncurated internet-scale datasets using self-supervised objectives " +
          "(Masked Language Modeling, Next-Token Prediction, Contrastive Vision), establishing general world knowledge."
      },

      num: {
        t: "Pre-training self-supervised paradigms & loss objectives",
        h: ["Pre-training Paradigm", "Mathematical Loss Objective", "Target Data Modality", "Flagship Models"],
        r: [
          ["**Causal Next-Token Prediction**", "$\\mathcal{L} = -\\sum_{t=1}^T \\log P(x_t \\mid x_{<t})$", "Unlabeled text corpora (trillions of tokens)", "**GPT-4, Llama 3, Mistral, Claude**"],
          ["**Masked Language Modeling (MLM)**", "$\\mathcal{L} = -\\sum_{i \\in \\text{Mask}} \\log P(x_i \\mid X_{\\setminus i})$", "Corrupted bidirectional text", "**BERT, RoBERTa, DeBERTa**"],
          ["**Contrastive Vision-Language**", "$\\mathcal{L} = -\\frac{1}{2}\\left(\\log \\frac{e^{\\text{sim}(I, T)/\\tau}}{\\sum e} + \\dots\\right)$", "Image-text paired web crawl ($400M+$ pairs)", "**CLIP, SigLIP**"],
          ["**Masked Autoencoding (MAE)**", "$\\mathcal{L} = \\frac{1}{|M|}\\sum_{p \\in M} \\|I_p - \\hat{I}_p\\|^2$", "Images with $75\\%$ patches masked", "**MAE (He et al. 2021)**"],
          ["**Compute Scaling Law**", "$L(C) = (C_c / C)^{\\alpha_c}$ (Chinchilla 2022)", "Tokens $\\approx 20 \\times$ Parameters", "Defines compute-optimal model-data balance"]
        ],
        n: "Pre-training is the bedrock phase that creates modern **Foundation Models**. " +
          "By eliminating human annotators and turning the raw data itself into the supervisory signal " +
          "(**Self-Supervised Learning**), pre-training allows models to absorb statistical patterns " +
          "from multi-terabyte corpora. In natural language processing, the dominant pre-training " +
          "objective is **Autoregressive Next-Token Prediction**: the model is presented with a sequence " +
          "of tokens and must predict the probability distribution of the immediately following token: " +
          "$\\mathcal{L}_{\\text{pretrain}} = -\\sum_t \\log P_\\theta(x_t \\mid x_1, \\dots, x_{t-1})$. " +
          "To minimize cross-entropy loss across trillions of diverse tokens, the network must implicitly " +
          "learn grammar, factual encyclopedic knowledge, commonsense reasoning, code execution, and translation. " +
          "DeepMind's **Chinchilla Scaling Laws** (Hoffmann et al. 2022) established that for optimal " +
          "pre-training compute allocation, the number of training tokens should scale linearly with model parameters: " +
          "roughly **20 tokens per parameter** (e.g. a 70B parameter model requires at least 1.4 trillion tokens). " +
          "The pre-trained model acts as an expansive, generalized computational base that can subsequently " +
          "be adapted via instruction tuning (SFT) and RLHF."
      },

      miss: [
        {
          w: "Pre-training an LLM requires human fact-checking and curated annotations.",
          r: "Pre-training is entirely self-supervised: it predicts raw upcoming tokens in unstructured web documents, code repositories, and books without human manual annotation."
        },
        {
          w: "A pre-trained base model is ready to serve as a conversational chatbot.",
          r: "A raw pre-trained base model is merely an unguided text completion engine. It will autocomplete questions with more questions; conversational alignment requires Post-Training (SFT and DPO/RLHF)."
        },
        {
          w: "Pre-training can be performed multiple times during typical product development.",
          r: "Pre-training a frontier foundation model requires thousands of GPUs running for months, costing tens of millions of dollars in compute. Enterprise teams pre-train rarely, focusing instead on fine-tuning."
        },
        {
          w: "Pre-training loss continues to drop indefinitely as you add more epochs on the same data.",
          r: "Multi-epoch pre-training on repetitive data induces rapid overfitting and performance collapse. Pre-training strictly requires vast token diversity (unique tokens)."
        }
      ],

      trade: {
        buys: [
          "Creates universal foundation representations that transfer to thousands of diverse downstream tasks.",
          "Scales predictably with compute according to established empirical power-law scaling laws.",
          "Extracts generalized world knowledge from uncurated multi-modal internet data."
        ],
        costs: [
          "Astronomical capital and energy costs: multi-million dollar GPU cluster deployments.",
          "Absorbs internet-scale noise, toxic biases, hallucinations, and copyright risks into model weights.",
          "Massive data filtering and deduplication engineering pipelines required prior to training."
        ],
        avoid: [
          "Attempting full pre-training of an LLM from scratch when open-weights base models (Llama 3, Mistral) are freely available.",
          "Violating Chinchilla compute-optimal ratios by training a massive parameter model on too few tokens."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "autoencoder",

      why: {
        before: "Linear dimensionality reduction (PCA) was strictly constrained to flat orthogonal projections, " +
          "failing to compress and reconstruct complex non-linear image and audio manifolds.",
        problem: "Unsupervised representation learning requires an objective that forces a network to learn " +
          "a compact, low-dimensional bottleneck code without requiring external supervision or labels.",
        shift: "**Autoencoder: Non-linear bottleneck reconstruction.** " +
          "Pass inputs through an Encoder $z = f_\\theta(x)$ into a low-dimensional latent space $\\mathbb{R}^d$, " +
          "followed by a Decoder $\\hat{x} = g_\\phi(z)$ trained to reconstruct the original input: $\\min \\|x - g(f(x))\\|^2$."
      },

      num: {
        t: "Autoencoder family taxonomy & mathematical objectives",
        h: ["Autoencoder Variant", "Latent Space Formulation", "Optimization Objective / Penalty", "Primary Practical Application"],
        r: [
          ["**Undercomplete Autoencoder**", "Deterministic bottleneck: $\\dim(z) \\ll \\dim(x)$", "Reconstruction Loss: $\\frac{1}{N} \\sum \\|x - \\hat{x}\\|^2$", "Non-linear dimensionality reduction & compression"],
          ["**Denoising Autoencoder (DAE)**", "Corrupted input: $\\tilde{x} \\sim q(\\tilde{x}|x)$", "Reconstructs uncorrupted $x$: $\\|x - g(f(\\tilde{x}))\\|^2$", "Learns robust manifold score matching; feature extraction"],
          ["**Variational Autoencoder (VAE)**", "**Probabilistic latent**: $q_\\phi(z|x) = \\mathcal{N}(\\mu, \\sigma^2)$", "**ELBO**: $\\mathbb{E}[\\log p_\\theta(x|z)] - D_{\\text{KL}}(q_\\phi(z|x) \\parallel p(z))$", "**Generative modeling**: smooth, continuous latent space for sampling"],
          ["**Vector Quantized (VQ-VAE)**", "**Discrete codebook**: $z_q = e_k$", "Commitment loss: $\\|\\text{sg}[z_e] - e\\|^2 + \\beta \\|z_e - \\text{sg}[e]\\|^2$", "**Latent tokenization**: foundation for Stable Diffusion & DALL-E"],
          ["**Reparameterization Trick**", "$z = \\mu + \\sigma \\odot \\epsilon, \\, \\epsilon \\sim \\mathcal{N}(0, I)$", "Pushes stochasticity into external input $\\epsilon$", "Allows backpropagation through probabilistic latent nodes"]
        ],
        n: "An Autoencoder is an unsupervised neural network designed to solve the identity " +
          "mapping under structural constraints. It consists of two sub-networks: an **Encoder** " +
          "$z = f_\\theta(x)$ that maps the input into a latent code $z$, and a **Decoder** " +
          "$\\hat{x} = g_\\phi(z)$ that reconstructs the input from $z$. If the latent dimension " +
          "is strictly smaller than the input dimension (an **Undercomplete Autoencoder**), " +
          "the network cannot simply learn the identity function; it is forced to discover the " +
          "most salient non-linear manifold coordinates to minimize reconstruction loss: " +
          "$\\mathcal{L}(x, \\hat{x}) = \\|x - \\hat{x}\\|^2$. In **Variational Autoencoders (VAEs)** " +
          "(Kingma & Welling 2013), the latent space is regularized into a continuous probabilistic " +
          "prior: the encoder outputs mean $\\mu$ and variance $\\sigma^2$, and the network optimizes " +
          "the **Evidence Lower Bound (ELBO)**, balancing reconstruction fidelity against the " +
          "**Kullback-Leibler (KL) Divergence** to a standard normal prior: $D_{\\text{KL}}(q(z|x) \\parallel \\mathcal{N}(0, I))$. " +
          "To permit backpropagation through the random sampling node, Kingma and Welling introduced " +
          "the **Reparameterization Trick**: $z = \\mu + \\sigma \\odot \\epsilon$, where " +
          "$\\epsilon \\sim \\mathcal{N}(0, I)$ is an auxiliary noise variable, allowing gradients " +
          "to flow directly to $\\mu$ and $\\sigma$."
      },

      miss: [
        {
          w: "A standard autoencoder can be used as a generative model by sampling random z vectors.",
          r: "Standard deterministic autoencoders create sparse, fragmented latent spaces with vast 'dead zones'. Sampling a random z almost always produces corrupted, unrecognizable noise. Generative sampling strictly requires VAEs or VQ-VAEs."
        },
        {
          w: "An autoencoder with identical input and latent dimensions cannot learn useful features.",
          r: "Overcomplete autoencoders (where latent dimension $\\ge$ input) learn powerful representations if regularized via sparsity penalties (Sparse Autoencoders) or noise corruption (Denoising Autoencoders)."
        },
        {
          w: "The reparameterization trick eliminates the randomness of the VAE.",
          r: "The sampling remains fully stochastic; the reparameterization trick merely isolates the stochasticity into an independent parameter-free input node $\\epsilon$, making the path from $\\mu$ and $\\sigma$ to loss continuously differentiable."
        },
        {
          w: "VAEs produce sharper images than GANs and Diffusion models.",
          r: "VAEs are infamous for producing blurry image reconstructions due to mean-squared error loss and Gaussian prior assumptions, which is why Diffusion Models have supplanted them for final pixel generation."
        }
      ],

      trade: {
        buys: [
          "Non-linear dimensionality reduction capturing complex curved data manifolds that defeat PCA.",
          "Self-supervised anomaly detection: inputs with high reconstruction error are flagged as out-of-distribution outliers.",
          "VQ-VAE acts as the essential spatial tokenizer compressing images into discrete tokens for Latent Diffusion."
        ],
        costs: [
          "Standard autoencoders generate fragmented latent spaces that cannot be used for generative synthesis.",
          "VAEs produce notoriously blurry image generations due to the L2 reconstruction objective.",
          "Tuning the balance parameter $\\beta$ between reconstruction loss and KL divergence in VAEs requires delicate balancing."
        ],
        avoid: [
          "Using standard deterministic autoencoders for generative sampling without variational or codebook constraints.",
          "Evaluating VAE latent loss without applying the reparameterization trick (which breaks backpropagation)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "diffusion-model",

      why: {
        before: "Generative Adversarial Networks (GANs) suffered from notorious training instability, mode collapse, " +
          "and adversarial minimax divergence, while VAEs produced blurry, low-fidelity reconstructions.",
        problem: "Generating photorealistic high-resolution images requires a stable, maximum-likelihood objective " +
          "that covers all modes of the data distribution without adversarial game-theoretic collapse.",
        shift: "**Diffusion Models (DDPM, Sohl-Dickstein 2015, Ho et al. 2020): Invertible thermodynamic non-equilibrium denoising.** " +
          "Gradually destroy image structure by adding Gaussian noise over $T$ forward steps, " +
          "then train a neural network to iteratively reverse the process by predicting and subtracting noise at each step."
      },

      num: {
        t: "Diffusion model mathematical framework: Forward vs Reverse processes",
        h: ["Process / Stage", "Mathematical Formulation", "Direction", "Parameterization / Compute"],
        r: [
          ["**Forward Diffusion ($q$)**", "$q(x_t \\mid x_{t-1}) = \\mathcal{N}(x_t; \\sqrt{1-\\beta_t} x_{t-1}, \\beta_t I)$", "Data $\\to$ Noise (fixed Markov chain)", "**Zero parameters**: analytical closed-form jump to any step $t$"],
          ["**Direct Sampling Jump**", "$x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon, \\, \\epsilon \\sim \\mathcal{N}(0, I)$", "$x_0 \\to x_t$ in one step", "Enables training on arbitrary timesteps $t$ without stepping through $1 \\dots t$"],
          ["**Reverse Denoising ($p_\\theta$)**", "$p_\\theta(x_{t-1} \\mid x_t) = \\mathcal{N}(x_{t-1}; \\mu_\\theta(x_t, t), \\Sigma_t)$", "Noise $\\to$ Clean Image", "**Parameterized Neural Network** (U-Net with cross-attention)"],
          ["**Simplified Loss (DDPM)**", "$\\mathcal{L}(\\theta) = \\mathbb{E}_{t, x_0, \\epsilon} \\left[ \\| \\epsilon - \\epsilon_\\theta(x_t, t) \\|^2 \\right]$", "Mean Squared Error", "**Predicts the injected noise vector $\\epsilon$** rather than clean image"],
          ["**Classifier-Free Guidance**", "$\\tilde{\\epsilon}_\\theta = \\epsilon_\\theta(x_t, \\emptyset) + s \\cdot (\\epsilon_\\theta(x_t, c) - \\epsilon_\\theta(x_t, \\emptyset))$", "Inference steering", "$s > 1$ amplifies prompt adherence at the cost of diversity"]
        ],
        n: "Diffusion models represent the state of the art in generative AI " +
          "(Stable Diffusion, Midjourney, Sora, Imagen). Inspired by non-equilibrium " +
          "thermodynamics, diffusion decomposes generation into two symmetrical processes: " +
          "(1) The **Forward (Noising) Process $q$**: a predetermined Markov chain that slowly " +
          "adds Gaussian noise to an image $x_0$ over $T \\approx 1000$ discrete steps, controlled " +
          "by variance schedule $\\beta_1, \\dots, \\beta_T$. As $t \\to T$, the image completely transforms " +
          "into pure isotropic Gaussian noise: $x_T \\sim \\mathcal{N}(0, I)$. " +
          "Thanks to Gaussian algebra, any intermediate noisy state $x_t$ can be sampled in **closed form** " +
          "without stepping sequentially: $x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon$, " +
          "where $\\alpha_t = 1 - \\beta_t$ and $\\bar{\\alpha}_t = \\prod_{s=1}^t \\alpha_s$. " +
          "(2) The **Reverse (Denoising) Process $p_\\theta$**: a neural network (typically a U-Net " +
          "equipped with cross-attention) is trained with a simple MSE loss to predict the exact " +
          "noise vector $\\epsilon$ that was injected at timestep $t$: " +
          "$\\mathcal{L}_{\\text{simple}} = \\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2$. " +
          "During inference, generation starts from pure random noise $x_T$ and iteratively evaluates " +
          "the network over dozens of steps, subtracting predicted noise to reveal a photorealistic image. " +
          "In **Latent Diffusion Models (LDMs / Stable Diffusion)**, this entire diffusion process is " +
          "executed inside the low-dimensional latent space of a pre-trained VQ-VAE, slashing compute by 90%."
      },

      miss: [
        {
          w: "Diffusion models train by stepping sequentially through all 1,000 timesteps for every sample.",
          r: "Training samples a random timestep $t \\sim U(1, T)$ for each image and computes $x_t$ in a single closed-form equation ($x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1-\\bar{\\alpha}_t} \\epsilon$). Steps are completely independent during training."
        },
        {
          w: "The neural network in a diffusion model is trained to output the clean image directly.",
          r: "Predicting the clean image directly produces blurry averages. Ho et al. (DDPM) proved that training the network to predict the NOISE vector $\\epsilon$ simplifies the loss and dramatically sharpens fine textures."
        },
        {
          w: "Diffusion models must always run 1,000 steps during inference.",
          r: "Advanced numerical ODE solvers (DDIM, DPMSolver, Euler-A) generate photorealistic images in only 15 to 25 steps; modern distilled models (SDXL-Turbo, LCM) generate images in 1 to 4 steps."
        },
        {
          w: "Diffusion models suffer from mode collapse just like GANs.",
          r: "Diffusion models optimize an exact variational lower bound on data likelihood across all timesteps, naturally covering the entire data distribution and completely immune to adversarial mode collapse."
        }
      ],

      trade: {
        buys: [
          "State-of-the-art generation quality: produces photorealistic, fine-grained visual details across images and video.",
          "Rock-solid training stability: optimizes standard MSE loss without adversarial minimax oscillations or mode collapse.",
          "Flexible conditioning: Classifier-Free Guidance (CFG) allows precise steering via text prompts, depth maps, or poses."
        ],
        costs: [
          "High inference latency: requires multiple iterative forward passes (15-50 steps) through a large U-Net to generate a single image.",
          "High compute requirements during pre-training compared to single-pass feedforward models.",
          "Requires secondary latent compression models (VAEs) to make high-resolution diffusion computationally viable."
        ],
        avoid: [
          "Executing diffusion directly in high-resolution pixel space ($1024 \\times 1024$) without using a latent space (Latent Diffusion).",
          "Using standard DDPM 1000-step sampling in production APIs when DPMSolver achieves identical quality in 20 steps."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tensor",

      why: {
        before: "Scientific computing relied on scalar numbers ($0\\text{D}$), vectors ($1\\text{D}$), and matrices ($2\\text{D}$), " +
          "lacking a unified algebraic data structure to represent multi-dimensional batch, spatial, and channel data.",
        problem: "Deep learning models operate on high-dimensional multi-modal grids " +
          "(e.g. batched color video: $[\\text{Batch}, \\text{Frames}, \\text{Channels}, \\text{Height}, \\text{Width}]$) " +
          "that require generalized multi-axis broadcasting, slicing, and memory stride manipulation.",
        shift: "**Tensor: N-dimensional geometric array with strided memory layout.** " +
          "Generalize scalars, vectors, and matrices to arbitrary rank $N$, decoupling logical coordinate shapes " +
          "from physical contiguous 1D memory buffers via strides, offsets, and hardware-accelerated memory views."
      },

      num: {
        t: "Tensor geometric rank hierarchy & memory strides",
        h: ["Rank ($N$)", "Mathematical Entity", "Typical Deep Learning Representation", "Shape Example"],
        r: [
          ["**0D**", "Scalar", "Single real loss value or learning rate", "`torch.tensor(3.14)`"],
          ["**1D**", "Vector", "Bias vector, 1D audio waveform, or categorical targets", "`[hidden_dim]` (e.g. `[768]`)"],
          ["**2D**", "Matrix", "Dense layer weights, token sequence embeddings", "`[batch_size, seq_len]`"],
          ["**3D**", "3-Tensor", "Batched sequence tokens, 1D convolutional features", "`[batch_size, seq_len, embed_dim]`"],
          ["**4D**", "4-Tensor", "Batched 2D images in CNNs", "`[B, C, H, W]` (PyTorch) or `[B, H, W, C]` (TF)"],
          ["**5D**", "5-Tensor", "Batched video clips or 3D MRI volumetric scans", "`[B, C, T, H, W]` (Time/Frames)"]
        ],
        n: "In deep learning engineering, a **Tensor** is an $N$-dimensional array " +
          "of homogeneous numerical elements (typically 32-bit, 16-bit, or 8-bit floats). " +
          "Under the hood, a tensor consists of two distinct components: " +
          "(1) A flat, contiguous **Storage Buffer** residing in system RAM or GPU VRAM, containing " +
          "raw linear sequential memory bytes; and (2) **Tensor Metadata**, which defines the tensor's " +
          "**Data Type (`dtype`)**, **Shape (Dimensions)**, and **Strides**. " +
          "The **Stride** specifies the number of memory elements in the flat buffer that must be skipped " +
          "to move one index forward along each dimension. For example, a 2D tensor with shape $[H, W]$ " +
          "in row-major (C-contiguous) layout has strides $[W, 1]$: advancing one row skips $W$ elements, " +
          "while advancing one column skips $1$ element. This strided architecture enables **zero-copy views**: " +
          "operations like `transpose()`, `reshape()`, `permute()`, and `narrow()` simply modify " +
          "the tensor's metadata strides and shape **without copying a single byte of underlying memory**, " +
          "executing in $\\mathcal{O}(1)$ time! However, non-contiguous views must be restored via `.contiguous()` " +
          "before feeding them into memory-aligned CUDA kernels."
      },

      miss: [
        {
          w: "Transposing a tensor (`x.transpose()`) copies all data into a new GPU memory location.",
          r: "Transposition is a metadata operation: it merely swaps the stride values of the tensor. Zero memory copying occurs, creating a non-contiguous view in $\\mathcal{O}(1)$ time."
        },
        {
          w: "A tensor is identical to a nested Python list (`[[1, 2], [3, 4]]`).",
          r: "Nested Python lists store pointers to individual heap-allocated scalar objects, scattered across memory. Tensors allocate a single contiguous block of raw binary memory, optimized for vectorized SIMD instructions."
        },
        {
          w: "All deep learning frameworks share the same tensor memory layout for images.",
          r: "PyTorch standardizes on NCHW (channels-first), which is optimized for cuDNN convolutions. TensorFlow historically favored NHWC (channels-last), which aligns better with CPU hardware SIMD and TPU matrix units."
        },
        {
          w: "Tensors can store mixed data types like integers and strings in the same tensor.",
          r: "Tensors are strictly homogeneous: every single element in a tensor must share the exact same primitive data type (e.g. all `float32` or all `int64`)."
        }
      ],

      trade: {
        buys: [
          "Unified mathematical abstraction for multi-dimensional operations across batch, temporal, and spatial axes.",
          "Zero-copy memory views (`transpose`, `view`, `slice`) execute in $\\mathcal{O}(1)$ time without data allocation.",
          "Native support for SIMD vectorization, GPU Tensor Core acceleration, and automatic broadcasting rules."
        ],
        costs: [
          "Non-contiguous memory views can cause silent performance degradation or crashes in low-level CUDA kernels.",
          "Broadcasting semantics can silently introduce subtle dimension-mismatch bugs (e.g. $[N] + [N, 1] \\to [N, N]$).",
          "Memory fragmentation on GPUs when allocating and destroying thousands of temporary intermediate tensors."
        ],
        avoid: [
          "Calling `.contiguous()` unnecessarily on tensors that are already contiguous (wastes memory and compute).",
          "Using Python loops to iterate over tensor elements (always use vectorized tensor operations)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "automatic-differentiation",

      why: {
        before: "Computing gradients required either manual analytical calculus derivations (error-prone and tedious for deep networks) " +
          "or numerical finite differences ($f(x+\\epsilon) - f(x)$), which suffered from truncation errors and scaled linearly with parameter count.",
        problem: "Deep networks contain billions of parameters embedded in complex non-linear DAGs; " +
          "optimizing them requires machine-precision exact gradients computed in a single efficient pass.",
        shift: "**Automatic Differentiation (Autodiff / AD): Programmatic chain-rule decomposition.** " +
          "Decompose arbitrary computer programs into elementary arithmetic operations with known derivatives, " +
          "applying the multivariable calculus chain rule mechanically to compute exact analytic gradients at machine precision."
      },

      num: {
        t: "Differentiation paradigms comparison & computational complexity",
        h: ["Differentiation Method", "Accuracy & Stability", "Time Complexity ($P$ parameters)", "Memory Overhead"],
        r: [
          ["**Numerical (Finite Differences)**", "Approximation error; subtractive cancellation", "$\\mathcal{O}(P)$ full forward passes (**intractable** for billions)", "$\\mathcal{O}(1)$ memory"],
          ["**Symbolic Differentiation (Computer Algebra)**", "Exact analytic formula", "Suffers from **Expression Swell** (equations explode exponentially)", "Memory explodes exponentially"],
          ["**Forward-Mode Autodiff (Dual Numbers)**", "Exact machine precision", "$\\mathcal{O}(P)$ passes for $P$ inputs $\\to$ 1 output", "$\\mathcal{O}(1)$ memory (no activation tape)"],
          ["**Reverse-Mode Autodiff (Backprop)**", "**Exact machine precision**", "**$\\mathcal{O}(1)$ pass** for $P$ inputs $\\to$ 1 scalar loss!", "$\\mathcal{O}(N)$ memory (caches forward tape)"]
        ],
        n: "Automatic Differentiation (Autodiff) is neither numerical differentiation " +
          "nor symbolic differentiation. It relies on the insight that any computer " +
          "program—no matter how complex—executes a sequence of elementary arithmetic " +
          "operations ($+, -, \\times, \\div$) and elementary functions ($\\sin, \\exp, \\ln$). " +
          "By tracking these elementary steps via a computational tape, Autodiff applies the " +
          "calculus **chain rule** mechanically to compute exact mathematical derivatives to " +
          "floating-point machine precision. Autodiff operates in two fundamental modes: " +
          "(1) **Forward-Mode Autodiff**: tracks derivatives alongside forward evaluations using " +
          "**Dual Numbers** ($x + \\epsilon \\dot{x}$ where $\\epsilon^2 = 0$). Forward mode is optimal " +
          "when the number of inputs is small and outputs is large ($f: \\mathbb{R}^1 \\to \\mathbb{R}^M$). " +
          "(2) **Reverse-Mode Autodiff**: evaluates the forward pass first, builds a directed graph of " +
          "adjoint dependencies, and propagates derivatives backward from the output to inputs. " +
          "Reverse-mode is exceptionally optimal when the function maps **millions of inputs to a single " +
          "scalar output** ($f: \\mathbb{R}^P \\to \\mathbb{R}^1$)—which is the exact mathematical " +
          "definition of a neural network loss function! Reverse-mode Autodiff computes the partial " +
          "derivatives for all $P$ parameters simultaneously in roughly **two times the cost of a forward pass**."
      },

      miss: [
        {
          w: "Automatic differentiation uses symbolic math engines like SymPy or Mathematica under the hood.",
          r: "Autodiff does not construct symbolic closed-form formulas; it executes numeric evaluations of elementary derivative rules at runtime, avoiding the exponential 'expression swell' that paralyzes computer algebra."
        },
        {
          w: "Autodiff is subject to approximation and roundoff truncation errors like finite differences.",
          r: "Autodiff computes exact analytic mathematical derivatives; it contains zero finite-difference step-size approximations ($h \\to 0$). Its accuracy is limited only by standard IEEE floating-point precision."
        },
        {
          w: "Forward-mode autodiff is preferred for training deep neural networks.",
          r: "Forward-mode requires one complete forward pass PER PARAMETER. For a 7B parameter network, a single update would require 7 billion forward passes! Reverse-mode computes all 7B gradients in a single backward pass."
        },
        {
          w: "Autodiff cannot differentiate code containing standard Python `if` statements or `for` loops.",
          r: "Dynamic tape-based autodiff (PyTorch Autograd) records operations as they execute in real time. It naturally handles arbitrary Python control flow, branching, and dynamic recursion seamlessly."
        }
      ],

      trade: {
        buys: [
          "Exact machine-precision analytic gradients for arbitrary complex software algorithms and neural layers.",
          "Reverse-mode calculates gradients for billions of parameters in $\\mathcal{O}(1)$ backward passes.",
          "Frees research engineers from deriving and coding manual backpropagation calculus equations by hand."
        ],
        costs: [
          "Reverse-mode requires substantial GPU memory to cache intermediate forward activations (the autograd tape).",
          "Non-differentiable operations (like discrete argmax or sampling) require custom surrogate subgradients or tricks.",
          "Graph construction and tape recording introduce minor CPU execution overhead compared to static fused kernels."
        ],
        avoid: [
          "Using finite differences to calculate parameter gradients in deep neural networks.",
          "Retaining unnecessary computational graph references in Python loops (e.g. accumulating `total_loss += loss` instead of `loss.item()`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "computational-graph",

      why: {
        before: "Scientific numerical libraries executed operations imperatively in isolated steps, " +
          "unable to analyze the global topological structure of mathematical programs for global memory optimization or automatic differentiation.",
        problem: "Reverse-mode automatic differentiation requires recording the exact topological dependencies " +
          "of all intermediate tensor operations so error signals can be routed backward via the chain rule.",
        shift: "**Computational Graph: Directed Acyclic Graph (DAG) of mathematical operations.** " +
          "Represent computations as a directed graph where nodes represent tensors (data) or mathematical operators (kernels), " +
          "and directed edges represent the flow of data dependencies during forward and backward execution."
      },

      num: {
        t: "Computational graph paradigms: Dynamic (Eager) vs Static",
        h: ["Dimension / Feature", "Dynamic Graph (Eager / PyTorch Autograd)", "Static Graph (Declarative / TF 1.x, JAX)"],
        r: [
          ["**Graph Construction**", "**Run-time (Define-by-Run)**: built dynamically during forward pass", "**Compile-time (Define-and-Run)**: compiled once before execution"],
          ["**Control Flow Integration**", "Native Python `if`, `while`, `for` loops execute seamlessly", "Requires custom graph control primitives (`tf.cond`, `tf.while_loop`)"],
          ["**Debugging Experience**", "**Exceptional**: standard Python `pdb`, print statements, stack traces", "Difficult: errors surface in compiled C++ runtime, not Python source"],
          ["**Kernel Optimization**", "Sub-optimal: dispatches individual operations to GPU", "**Superior**: global operator fusion, dead-code elimination, memory reuse"],
          ["**Modern Convergence**", "`torch.compile` (captures dynamic graph into static graph)", "JAX `jax.jit` (traces Python code to XLA static graph)"]
        ],
        n: "A Computational Graph is a **Directed Acyclic Graph (DAG)** that formalizes " +
          "the execution of mathematical functions. In this graph, leaf nodes represent " +
          "input data tensors or learnable parameters (weights, biases), intermediate nodes " +
          "represent elementary differentiable operators (matrix multiplication, addition, ReLU), " +
          "and edges represent the directional flow of tensors. The architectural division in deep " +
          "learning history centered on **Static vs Dynamic Graphs**: " +
          "(1) **Static Graphs (Define-and-Run)** (e.g. TensorFlow 1.x): the entire program was declared " +
          "symbolically, optimized by a compiler (XLA) which performed global operator fusion and memory " +
          "re-planning, and executed inside a high-speed C++ engine. However, debugging was nightmarish, " +
          "and dynamic sequence lengths were difficult to express. " +
          "(2) **Dynamic Graphs (Define-by-Run)** (e.g. PyTorch): the graph is constructed on the fly " +
          "as Python executes each line of code. Every resulting tensor stores a pointer to its creator " +
          "function (`tensor.grad_fn`). During `loss.backward()`, the engine simply traverses these " +
          "`grad_fn` pointers backward down the DAG. " +
          "In modern deep learning, the industry has achieved synthesis via **JIT Tracing (`torch.compile`)**: " +
          "write code imperatively with dynamic eager execution, but let a compiler trace and freeze the DAG " +
          "at runtime to fuse kernels and eliminate memory bandwidth bottlenecks."
      },

      miss: [
        {
          w: "PyTorch does not build a computational graph because it is an eager execution framework.",
          r: "PyTorch builds a dynamic computational graph on the fly during every single forward pass! Every tensor with `requires_grad=True` maintains an internal `grad_fn` DAG that autograd traverses during backprop."
        },
        {
          w: "Static graphs are permanently dead and obsolete in modern AI.",
          r: "Modern high-performance runtimes (`torch.compile`, JAX, TensorRT, ONNX) capture static graphs under the hood to perform kernel fusion and memory optimization, delivering 20-50% speedups over pure eager execution."
        },
        {
          w: "A computational graph can contain cyclical loops.",
          r: "A computational graph is strictly a Directed ACYCLIC Graph (DAG). Recurrent loops in RNNs are unrolled across time steps into a linear acyclic sequence of nodes."
        },
        {
          w: "Calling `.backward()` multiple times on the same graph works automatically without errors.",
          r: "By default, PyTorch frees intermediate activation buffers immediately after `.backward()` completes to save memory. Calling backward a second time triggers a runtime error unless `retain_graph=True` is specified."
        }
      ],

      trade: {
        buys: [
          "Provides the explicit topological schedule required for reverse-mode automatic differentiation.",
          "Enables graph-level compiler optimizations: operator fusion, dead-code elimination, and buffer reuse.",
          "Facilitates graph serialization into portable production formats (ONNX, TensorRT, TorchScript)."
        ],
        costs: [
          "Dynamic graph building introduces Python-to-C++ dispatch latency on small tensor operations.",
          "Retaining graph buffers in GPU memory consumes the vast majority of training VRAM.",
          "Static graph compilation requires warm-up compilation overhead on the first training iteration."
        ],
        avoid: [
          "Using `retain_graph=True` in PyTorch training loops unless strictly required (causes massive memory leaks).",
          "Modifying tensor data in-place when that tensor is required by the computational graph for backward passes."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pytorch",

      why: {
        before: "Deep learning frameworks (Theano, Caffe, TensorFlow 1.x) forced researchers into rigid, static declarative paradigms " +
          "that were notoriously painful to debug, required custom control-flow DSLs, and separated code definition from execution.",
        problem: "Advancing deep learning research demanded an intuitive, imperative 'Pythonic' framework " +
          "where models could be debugged using standard Python tools, dynamic control flow worked naturally, and execution felt seamless.",
        shift: "**PyTorch (Paszke et al. 2016, Meta AI): Imperative, dynamic tensor computation with Autograd.** " +
          "Unite NumPy-like tensor operations on GPUs with dynamic define-by-run automatic differentiation, " +
          "becoming the undisputed dominant framework for global AI research and foundation model pre-training."
      },

      num: {
        t: "PyTorch ecosystem architecture & core technical primitives",
        h: ["Module / Subsystem", "Technical Primitive / Class", "Core Operational Role"],
        r: [
          ["**Core Tensor & Dispatch**", "`torch.Tensor` / ATen library", "Contiguous multi-dimensional arrays; dispatches to CPU, CUDA, MPS, TPU"],
          ["**Autograd Engine**", "`torch.autograd`", "Dynamic reverse-mode automatic differentiation via tape-based DAG traversal"],
          ["**Neural Network Library**", "`torch.nn.Module`", "Encapsulates learnable parameters, forward passes, sub-modules, and hooks"],
          ["**Distributed Training**", "`DistributedDataParallel` (DDP) / FSDP", "Multi-GPU data and model parallelism with ring-AllReduce gradient sync"],
          ["**Graph Compiler**", "`torch.compile` (Inductor backend)", "**JIT compiler**: fuses operations into fast Triton/CUDA kernels with zero code rewrites"]
        ],
        n: "PyTorch was created at Facebook AI Research (FAIR) in 2016 by Adam Paszke, " +
          "Soumith Chintala, Ronan Collobert, and colleagues, building on the Torch C library. " +
          "Its philosophy of **Imperative Eager Execution ('Python-first')** radically disrupted " +
          "the deep learning landscape. Unlike TensorFlow 1.x where users constructed static graphs " +
          "and executed them through an opaque `Session.run()`, PyTorch executed operations immediately: " +
          "calling `y = model(x)` instantly executes the GPU CUDA kernels and returns the concrete tensor values. " +
          "Users can insert standard Python `print()` statements, inspect shapes, and set native `pdb` breakpoints " +
          "anywhere inside the forward pass. Under the hood, PyTorch's **ATen C++ core** provides " +
          "highly optimized tensor memory management and hardware dispatch, while **Autograd** dynamically " +
          "builds the backward graph during execution. With the release of **PyTorch 2.0**, the framework " +
          "solved the historical eager-mode performance gap by introducing **`torch.compile()`**: " +
          "a non-intrusive JIT compiler that captures graphs via TorchDynamo and generates optimized, " +
          "fused GPU kernels via **TorchInductor and OpenAI Triton**, accelerating models by 20-40% " +
          "while preserving full Python flexibility."
      },

      miss: [
        {
          w: "PyTorch is only an academic research tool and cannot be used in production.",
          r: "Modern production AI is overwhelmingly powered by PyTorch: OpenAI, Meta, Tesla, and Microsoft deploy PyTorch directly to production via TorchServe, TensorRT, vLLM, and ONNX Runtime."
        },
        {
          w: "In PyTorch, `loss.backward()` automatically updates the model parameters.",
          r: "`loss.backward()` ONLY computes the gradients and stores them in `p.grad`. You must explicitly call `optimizer.step()` to apply those gradients and modify the parameters."
        },
        {
          w: "PyTorch tensors share the same memory space as NumPy arrays automatically across devices.",
          r: "PyTorch tensors on CPU can share memory with NumPy (`torch.from_numpy`), but GPU tensors (`.cuda()`) live in separate physical VRAM and cannot directly share memory with CPU NumPy arrays."
        },
        {
          w: "`model.eval()` disables gradient calculation in PyTorch.",
          r: "`model.eval()` only alters the behavioral state of layers like Dropout and BatchNorm; it does NOT disable gradient tracking. Disabling autograd requires wrapping code in `with torch.no_grad():`."
        }
      ],

      trade: {
        buys: [
          "Unrivaled developer ergonomics: Pythonic, imperative design with effortless debugging via native Python tools.",
          "Universal community adoption: over 80% of contemporary AI research papers and Hugging Face models are built in PyTorch.",
          "`torch.compile` delivers compiled static graph performance without sacrificing eager dynamic flexibility."
        ],
        costs: [
          "Pure eager mode execution incurs Python-to-C++ dispatch overhead on tiny tensor operations.",
          "Managing multi-node distributed training (FSDP, Megatron-LM) requires complex orchestration infrastructure.",
          "Mobile and embedded deployments require export and quantization through secondary toolchains (ExecuTorch, ONNX)."
        ],
        avoid: [
          "Omitting `with torch.no_grad():` when running evaluation loops in PyTorch.",
          "Writing custom CUDA C++ kernels from scratch when `torch.compile` or OpenAI Triton can generate optimized fused kernels automatically."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
