/* ==========================================================================
   Depth pass 73 — Deep Learning batch 1: foundational neural architectures.
   Deep Learning, Neural Network, Perceptron, Multilayer Perceptron,
   Weight, Bias Term, Activation Function, ReLU.

   Linear projections stack with non-linear activations to form hierarchical
   representation spaces; subgradients flow backward across layered tensors.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "deep-learning",

      why: {
        before: "Classical machine learning relied on labor-intensive, handcrafted feature engineering " +
          "(SIFT, HOG, bag-of-words) that required deep domain expertise and failed to generalize to raw perceptual data.",
        problem: "Hand-engineered features discard subtle latent correlations, plateau quickly as data volume expands, " +
          "and cannot learn complex, hierarchical abstractions (e.g. pixels $\\to$ edges $\\to$ textures $\\to$ object parts $\\to$ semantic classes).",
        shift: "**Deep Learning: End-to-end hierarchical representation learning.** " +
          "Stack multiple parameterized non-linear layers trained jointly via backpropagation and gradient descent, " +
          "allowing models to discover optimal representations directly from raw, uncurated perceptual tensors."
      },

      num: {
        t: "Deep learning vs classical machine learning scaling & operational profiles",
        h: ["Dimension / Property", "Classical Machine Learning (GBDT, SVM)", "Deep Learning (DNN, Transformers)"],
        r: [
          ["**Feature Representation**", "Manual domain engineering required", "**Learned end-to-end from raw data** (pixels, audio, text tokens)"],
          ["**Data Scaling Behavior**", "Accuracy plateaus at medium data scale ($N \\approx 10^5$)", "**Power-law scaling**: performance scales continuously with compute and data"],
          ["**Hardware Dependency**", "CPU-bound (RAM & single-node multi-threading)", "**Heavily GPU/TPU-bound** (highly parallel SIMD tensor operations)"],
          ["**Parameter Scale**", "$10^2$ to $10^7$ parameters", "$10^6$ to $10^{12}+$ parameters (overparameterized regime)"],
          ["**Theoretical Expressivity**", "Kernel limits / orthogonal splits", "**Universal Approximation**: exponential compositional efficiency with depth"]
        ],
        n: "Deep Learning represents a paradigm shift from feature engineering to " +
          "**architecture engineering**. Its mathematical foundation rests on two pillars: " +
          "the **Universal Approximation Theorem** (Cybenko 1989, Hornik 1991), which proves " +
          "that even a single hidden layer with non-linear activations can approximate any continuous " +
          "function on a compact subset of $\\mathbb{R}^n$, and **Depth Efficiency Theorems** " +
          "(Telgarsky 2016, Eldan & Shamir 2016), which demonstrate that deep networks can compute " +
          "compositional functions with polynomial parameter complexity that would require an " +
          "exponential number of neurons in a shallow network ($2^{\\Omega(d)}$). Modern deep learning " +
          "operates in the **overparameterized regime**, where models have far more parameters than " +
          "training samples yet generalize exceptionally well without explicit regularization—a " +
          "phenomenon characterized by the **Double Descent** risk curve. Furthermore, empirical " +
          "**Scaling Laws** (Kaplan et al. 2020, Chinchilla 2022) prove that test cross-entropy loss " +
          "scales as a predictable power-law with respect to model parameters $N$, dataset size $D$, " +
          "and training compute $C$."
      },

      miss: [
        {
          w: "Deep learning always outperforms gradient boosted trees (XGBoost) on all dataset types.",
          r: "On structured tabular datasets, GBDTs (XGBoost, LightGBM, CatBoost) routinely outperform deep neural networks in accuracy, training speed, and hyperparameter stability."
        },
        {
          w: "Overparameterized deep networks with more parameters than data points inevitably overfit.",
          r: "In deep learning, stochastic gradient descent (SGD) exerts an implicit regularization bias toward flat, generalizing minima, exhibiting the 'double descent' phenomenon where test error drops beyond the interpolation threshold."
        },
        {
          w: "Deep learning models are biological replicas of the human brain.",
          r: "Artificial neural networks are high-dimensional differentiable mathematical graphs optimized via reverse-mode automatic differentiation. Biological brains use spiking dynamics, local plasticity (STDP), and sparse asynchronous signaling."
        },
        {
          w: "A deep network requires millions of labeled samples to be useful.",
          r: "Through transfer learning, pre-trained foundation models (ResNet, BERT, CLIP, Llama) can be fine-tuned to state-of-the-art performance on niche downstream tasks using only dozens or hundreds of labeled samples."
        }
      ],

      trade: {
        buys: [
          "End-to-end representation learning: eliminates years of manual feature engineering on raw perceptual inputs (vision, speech, text).",
          "Power-law scalability: accuracy scales monotonically as training compute and dataset sizes grow.",
          "Compositional transferability: pre-trained representations can be reused across disparate downstream modalities and tasks."
        ],
        costs: [
          "Massive computational and financial footprints: pre-training modern deep architectures requires high-end GPU clusters (e.g. H100s).",
          "Opaque black-box internal mechanics: multi-million parameter non-linear representations are difficult to formally audit or interpret.",
          "Extreme data appetite: training deep networks from scratch on small datasets ($N < 10,000$) leads to poor generalization."
        ],
        avoid: [
          "Using complex deep neural networks on small tabular datasets where XGBoost or Logistic Regression are superior.",
          "Training deep networks without monitoring gradient norms, learning rate warmup, and validation loss early stopping."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "neural-network",

      why: {
        before: "Linear regression and generalized linear models applied a single affine projection " +
          "directly to input features, fundamentally incapable of modeling complex topological folds or decision boundaries.",
        problem: "Biological brains perform complex reasoning through interconnected webs of simple neurons; " +
          "reproducing flexible intelligence requires a parameterized computational graph of interconnected processing units.",
        shift: "**Artificial Neural Network (ANN): Directed acyclic graph of parameterized mathematical transformations.** " +
          "Propagate inputs through layers of synthetic neurons where each unit computes an affine transformation " +
          "$z = Wx + b$ followed by a non-linear activation $\\sigma(z)$, optimized via backpropagation."
      },

      num: {
        t: "Neural network layer mathematics & computational execution",
        h: ["Component / Operation", "Mathematical Formula", "Tensor Dimensions", "Computational Role"],
        r: [
          ["**Affine Linear Projection**", "$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$", "$W: [d_{\\text{out}}, d_{\\text{in}}], \\, b: [d_{\\text{out}}, 1]$", "Rotates, scales, and translates the coordinate space via matrix multiplication"],
          ["**Non-linear Activation**", "$a^{[l]} = \\sigma(z^{[l]})$", "$a^{[l]}: [d_{\\text{out}}, \\text{batch\\_size}]$", "Injects non-linearity, allowing the network to fold and warp feature space"],
          ["**Loss Calculation**", "$\\mathcal{L}(a^{[L]}, y)$", "Scalar ($1 \\times 1$)", "Quantifies discrepancy between final network output and ground truth target"],
          ["**Forward Pass Complexity**", "$\\mathcal{O}\\left(\\sum_{l=1}^L d_l \\cdot d_{l-1} \\cdot B\\right)$", "Batch execution matrix multiply (GEMM)", "Highly optimized on GPU Tensor Cores via cuBLAS"],
          ["**Gradient Propagation**", "$\\delta^{[l]} = (W^{[l+1]T} \\delta^{[l+1]}) \\odot \\sigma'(z^{[l]})$", "Matches layer activation shape", "Applies chain rule backward to compute parameter error gradients"]
        ],
        n: "An Artificial Neural Network (ANN) is fundamentally a parameterized, " +
          "differentiable function $f(x; \\theta)$ composed of layers of artificial neurons. " +
          "Within any layer $l$, the incoming activation vector $a^{[l-1]}$ undergoes an affine " +
          "transformation defined by learnable weight matrix $W^{[l]}$ and bias vector $b^{[l]}$, " +
          "producing the pre-activation vector $z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$. " +
          "This pre-activation is then passed through an element-wise non-linear activation function " +
          "$\\sigma(\\cdot)$ to produce layer activations $a^{[l]}$. Without non-linear activations, " +
          "stacking 100 layers would collapse mathematically into a single matrix multiplication: " +
          "$W_{100} \\dots W_2 W_1 x = W_{\\text{eff}} x$, reducing the deep network to a simple " +
          "linear model. In vector form, inputs from a mini-batch of size $B$ are stacked into a matrix " +
          "$X \\in \\mathbb{R}^{d_{\\text{in}} \\times B}$, transforming layer computation into General " +
          "Matrix Multiply (**GEMM**) routines that exploit modern GPU memory hierarchies and SIMD execution."
      },

      miss: [
        {
          w: "Stacking more linear layers without activation functions increases a neural network's expressive power.",
          r: "The composition of linear functions is strictly linear: $W_2(W_1 x + b_1) + b_2 = (W_2 W_1)x + (W_2 b_1 + b_2)$. Without non-linear activations, an arbitrary deep network collapses to a single linear model."
        },
        {
          w: "Every neuron in a neural network performs autonomous, intelligent reasoning.",
          r: "A single neuron is just an inner product followed by a scalar non-linearity. Intelligent behaviors emerge strictly from the collective self-organization of millions of interconnected weights."
        },
        {
          w: "Neural networks must be fully connected (every neuron connected to every next neuron).",
          r: "Dense connections are only one topology. Convolutional networks enforce sparse local receptive fields, recurrent networks enforce cyclic temporal loops, and transformers use dynamic attention masks."
        },
        {
          w: "Initializing all neural network weights to zero is standard practice.",
          r: "Zero initialization causes all hidden neurons in a layer to compute identical gradients during backpropagation (symmetry problem), preventing the network from learning diverse features. Random initialization is mandatory."
        }
      ],

      trade: {
        buys: [
          "Arbitrary non-linear functional mapping capable of approximating complex high-dimensional distributions.",
          "Modular architecture: easily customized with convolutional, recurrent, attention, or normalization blocks.",
          "End-to-end differentiability enables global optimization using standard first-order gradient descent."
        ],
        costs: [
          "Non-convex loss surface: training can become trapped in plateaus, saddle points, or bad local optima.",
          "Hypersensitive to architecture choices: depth, width, activation types, and learning rate require extensive tuning.",
          "Requires substantial floating-point computational power (FLOPs) for forward and backward passes."
        ],
        avoid: [
          "Omitting non-linear activation functions between intermediate hidden layers.",
          "Initializing network weight matrices to identical constant values (e.g. all zeros or all ones)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "perceptron",

      why: {
        before: "Early cybernetics and computing machines operated strictly on hand-wired boolean logic " +
          "gates (AND, OR, NOT), unable to learn from empirical sensor data or adapt their own internal parameters.",
        problem: "Computing systems needed a mathematical model of an adaptive biological neuron capable " +
          "of learning binary classification boundaries directly from training examples.",
        shift: "**The Perceptron (Frank Rosenblatt 1958): First algorithmic learning machine.** " +
          "Combine weighted inputs with a threshold step function: $f(x) = \\text{step}(w^T x + b)$, " +
          "updating weights iteratively whenever an error occurs: $w \\leftarrow w + \\eta (y - \\hat{y}) x$."
      },

      num: {
        t: "Perceptron learning dynamics & convergence bounds",
        h: ["Component / Property", "Mathematical Formulation", "Physical / Geometric Meaning"],
        r: [
          ["**Perceptron Decision Rule**", "$f(x) = \\begin{cases} +1 & \\text{if } w^T x + b \\ge 0 \\\\ -1 & \\text{if } w^T x + b < 0 \\end{cases}$", "Partitions feature space via a single linear hyperplane"],
          ["**Weight Update Rule**", "$w^{(t+1)} = w^{(t)} + \\eta \\cdot (y_i - \\hat{y}_i) x_i$", "Rotates the hyperplane toward misclassified positive points and away from negatives"],
          ["**Novikoff's Convergence Theorem**", "$k \\le \\left(\\frac{2 R}{\\gamma}\\right)^2$", "If data is linearly separable with margin $\\gamma$ and radius $R$, **convergence is guaranteed in finite steps**"],
          ["**Activation Function**", "Heaviside Step Function: $H(z) = \\mathbf{1}_{z \\ge 0}$", "Non-differentiable; derivative is zero everywhere except $z=0$ (infinite impulse)"],
          ["**Representational Ceiling**", "**Linearly separable functions only**", "Failed catastrophically on non-linear XOR, triggering the first AI Winter"]
        ],
        n: "Frank Rosenblatt developed the Perceptron in 1958 at Cornell " +
          "Aeronautical Laboratory, implementing it as custom hardware (the Mark I " +
          "Perceptron) containing motorized potentiometers that mechanically turned " +
          "to adjust weights. Mathematically, the Perceptron computes the inner product " +
          "of an input vector $x$ with weight vector $w$, adding bias $b$. If the sum is " +
          "non-negative, it outputs $+1$; otherwise $-1$. **Novikoff's Theorem (1962)** " +
          "provided the first rigorous proof in machine learning: if a dataset is linearly " +
          "separable by a margin $\\gamma > 0$ and bounded within a sphere of radius $R$, " +
          "the Perceptron learning algorithm is guaranteed to converge to a separating " +
          "hyperplane in at most $(2R/\\gamma)^2$ updates. However, because the step activation " +
          "function has a derivative of zero almost everywhere ($\\frac{d}{dz} H(z) = 0$ for $z \\ne 0$), " +
          "the Perceptron cannot be trained using gradient descent. In 1969, Marvin Minsky " +
          "and Seymour Papert published their landmark book *Perceptrons*, proving that a " +
          "single-layer perceptron could not learn the simple non-linear **XOR logic function**, " +
          "which collapsed funding for neural network research for over a decade."
      },

      miss: [
        {
          w: "The Perceptron uses backpropagation to update its weights.",
          r: "The Perceptron uses the Perceptron Learning Rule ($w \\leftarrow w + \\eta \\Delta y x$), which predates backpropagation by decades. Backpropagation requires differentiable activations, whereas the Perceptron uses a discontinuous step function."
        },
        {
          w: "If data is not linearly separable, the Perceptron learning algorithm will find a line that minimizes misclassifications.",
          r: "If the data is non-linearly separable, the Perceptron learning algorithm never terminates: its weights oscillate wildly forever without converging to a minimal error solution."
        },
        {
          w: "The Perceptron outputs continuous probabilities between 0 and 1.",
          r: "The classical Perceptron outputs discrete binary values $\\{-1, +1\\}$ or $\\{0, 1\\}$. Continuous probabilistic outputs were introduced later by Logistic Regression and Sigmoid activations."
        },
        {
          w: "Minsky and Papert proved that neural networks could never solve XOR.",
          r: "Minsky and Papert proved that a SINGLE-LAYER perceptron could not solve XOR. They noted multi-layer networks could, but argued there was no known mathematical method to train the hidden layers (until backprop)."
        }
      ],

      trade: {
        buys: [
          "Historical and conceptual foundation of all modern artificial neural network architectures.",
          "Novikoff's convergence guarantee: provably finds a separating hyperplane in finite iterations if data is linearly separable.",
          "Extremely fast and lightweight online learning update with $\\mathcal{O}(d)$ computational complexity per sample."
        ],
        costs: [
          "Zero tolerance for non-linear decision boundaries: cannot solve the elementary XOR problem.",
          "Fails to converge on non-separable or noisy datasets, oscillating indefinitely without early stopping thresholds.",
          "Non-differentiable step activation prevents chaining into deep multi-layer networks via gradient-based backpropagation."
        ],
        avoid: [
          "Attempting to train a classical single-layer Perceptron on non-linearly separable real-world data.",
          "Using the step function when building multi-layer networks (use ReLU or GELU instead)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "multilayer-perceptron",

      why: {
        before: "Single-layer perceptrons were strictly constrained to linear hyperplanes, " +
          "collapsing completely when confronted with non-linear patterns such as the XOR problem.",
        problem: "Adding intermediate 'hidden' layers of neurons was conceptually known to enable non-linear mapping, " +
          "but researchers lacked a mathematical algorithm to train intermediate layers without direct target labels.",
        shift: "**Multilayer Perceptron (MLP, Rumelhart, Hinton & Williams 1986): Feedforward networks with Backprop.** " +
          "Stack multiple fully-connected dense layers with smooth, differentiable non-linear activations, " +
          "using reverse-mode automatic differentiation (backpropagation) to compute exact error gradients for all hidden layers."
      },

      num: {
        t: "Multilayer Perceptron architecture & computational scaling",
        h: ["Metric / Parameter", "Hidden Layer 1 ($l=1$)", "Hidden Layer $l$", "Output Layer ($l=L$)"],
        r: [
          ["**Input Dimensions**", "$d_{\\text{in}}$ (raw features)", "$d_{l-1}$ (previous activations)", "$d_{L-1}$"],
          ["**Output Dimensions**", "$d_1$ (hidden units)", "$d_l$ (hidden units)", "$d_{\\text{out}}$ (classes / regression targets)"],
          ["**Weight Matrix Size**", "$[d_1 \\times d_{\\text{in}}]$", "$[d_l \\times d_{l-1}]$", "$[d_{\\text{out}} \\times d_{L-1}]$"],
          ["**Bias Vector Size**", "$[d_1 \\times 1]$", "$[d_l \\times 1]$", "$[d_{\\text{out}} \\times 1]$"],
          ["**FLOPs per Sample**", "$2 \\cdot d_1 \\cdot d_{\\text{in}}$", "$2 \\cdot d_l \\cdot d_{l-1}$", "$2 \\cdot d_{\\text{out}} \\cdot d_{L-1}$"]
        ],
        n: "The Multilayer Perceptron (MLP) is the canonical **feedforward artificial " +
          "neural network**. It resolves the XOR dilemma by introducing one or more " +
          "**hidden layers** that transform the original feature coordinates into a " +
          "learned latent space where the target classes become linearly separable. " +
          "Mathematically, an $L$-layer MLP computes: " +
          "$f(x) = \\sigma_L(W_L \\sigma_{L-1}(W_{L-1} \\dots \\sigma_1(W_1 x + b_1) \\dots + b_{L-1}) + b_L)$. " +
          "The breakthrough that rescued neural networks from the AI Winter was the rediscovery " +
          "of **Backpropagation** (Rumelhart, Hinton, and Williams 1986), which applies the " +
          "multivariate chain rule in reverse topological order, allowing exact loss gradients " +
          "$\\frac{\\partial \\mathcal{L}}{\\partial W_l}$ and $\\frac{\\partial \\mathcal{L}}{\\partial b_l}$ " +
          "to be calculated for every hidden weight. In modern deep learning, MLPs serve as the " +
          "feedforward network (**FFN**) blocks within Transformer layers, projection heads in " +
          "contrastive vision models (CLIP), and classification heads atop CNN feature extractors."
      },

      miss: [
        {
          w: "A Multilayer Perceptron consists of Perceptrons with step activation functions.",
          r: "Despite the historical name, MLPs do NOT use Perceptrons. They use neurons with smooth, differentiable activations (ReLU, GELU, Sigmoid, Tanh); step functions have zero gradients and cannot be trained via backpropagation."
        },
        {
          w: "Making an MLP wider (more neurons per layer) is always better than making it deeper.",
          r: "While wide shallow networks can approximate functions, deep networks achieve exponential compositional efficiency, requiring exponentially fewer total parameters to approximate complex fractal or hierarchical topologies."
        },
        {
          w: "MLPs are naturally well-suited for high-resolution 2D image processing.",
          r: "MLPs flatten inputs into 1D vectors, destroying 2D spatial locality and spatial translation invariance, and suffer from parameter explosion on images (a $1000 \\times 1000$ image with 1000 hidden units requires $10^9$ weights)."
        },
        {
          w: "The Universal Approximation Theorem guarantees an MLP will find the optimal solution.",
          r: "The theorem only proves that an approximating network EXISTS within the hypothesis space; it does not guarantee that gradient descent will discover those optimal weights without getting trapped or overfitting."
        }
      ],

      trade: {
        buys: [
          "Universal function approximation: capable of learning arbitrary non-linear mappings between inputs and outputs.",
          "Dense feature interactions: every output neuron receives information from every input neuron in the preceding layer.",
          "Core building block: forms the Feedforward Network (FFN) sub-layer in Transformer architectures and ranking systems."
        ],
        costs: [
          "Quadratic parameter scaling $\\mathcal{O}(d_l \\cdot d_{l-1})$ creates massive parameter bloat on high-dimensional inputs.",
          "Lacks inductive biases: does not preserve spatial translation invariance (unlike CNNs) or temporal causality (unlike RNNs/Transformers).",
          "Prone to severe overfitting on small datasets without heavy dropout, weight decay, or early stopping."
        ],
        avoid: [
          "Feeding raw un-flattened image or audio spatial grids directly into dense MLP layers without prior convolutional or patch projection.",
          "Building extremely deep MLPs ($>20$ layers) without residual skip connections or layer normalization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "weight",

      why: {
        before: "Fixed-function algorithms relied on static mathematical formulas where coefficients " +
          "had to be determined through analytical physics derivations or hand-coded heuristic constants.",
        problem: "Complex patterns cannot be derived analytically; machines require learnable numerical parameters " +
          "that dynamically scale the relative importance of incoming signals based on feedback from data.",
        shift: "**Neural Weights: Differentiable scaling matrices.** " +
          "Represent the connection strengths between neurons as dense matrices $W \\in \\mathbb{R}^{d_{\\text{out}} \\times d_{\\text{in}}}$, " +
          "updated iteratively along negative loss gradients: $W \\leftarrow W - \\eta \\nabla_W \\mathcal{L}$."
      },

      num: {
        t: "Weight matrix mathematical operations & gradient updates",
        h: ["Phase / Operation", "Forward Formulation", "Backward Gradient Formulation", "Hardware Execution"],
        r: [
          ["**Fully Connected Layer**", "$z = W x + b$", "$\\frac{\\partial \\mathcal{L}}{\\partial W} = \\delta x^T$", "GEMM (General Matrix Multiply)"],
          ["**Convolutional Layer**", "$z = W * x$", "$\\frac{\\partial \\mathcal{L}}{\\partial W} = \\delta * x$", "GEMM via `im2col` or Winograd"],
          ["**L2 Regularization (Decay)**", "$W_{\\text{reg}} = W - \\eta \\lambda W$", "Adds $\\lambda W$ directly to gradient", "Executed during optimizer step"],
          ["**Gradient Descent Update**", "$W^{(t+1)} = W^{(t)} - \\eta \\frac{\\partial \\mathcal{L}}{\\partial W}$", "Moves parameter down steepest slope", "Memory bandwidth bound on GPU"],
          ["**Memory Footprint**", "Parameters: $4 \\times |W|$ bytes (FP32)", "Gradients: $4 \\times |W|$; Optimizer: $8 \\times |W|$ (Adam)", "**Total: 16 bytes per parameter** during FP32 training"]
        ],
        n: "Weights ($W$) are the fundamental learnable parameters that encode " +
          "a neural network's acquired knowledge. In a dense linear layer, $W$ is a 2D " +
          "matrix where entry $W_{ij}$ specifies the connection strength from input neuron $j$ " +
          "to output neuron $i$. During the forward pass, the input vector $x$ is scaled " +
          "via matrix-vector multiplication: $z_i = \\sum_j W_{ij} x_j + b_i$. " +
          "During the backward pass, the gradient of the scalar loss $\\mathcal{L}$ with " +
          "respect to the weight matrix is given by the outer product of the downstream error vector " +
          "$\\delta = \\frac{\\partial \\mathcal{L}}{\\partial z}$ and the transposed input: " +
          "$\\frac{\\partial \\mathcal{L}}{\\partial W} = \\delta x^T$. " +
          "This outer product proves that weight updates are proportional to both the error signal " +
          "and the input activation magnitude. Managing the **spectral norm** and variance of weight " +
          "matrices is critical: if weights are initialized too large, activations explode exponentially " +
          "with depth; if too small, signals vanish to zero. During training with modern optimizers " +
          "(e.g. Adam in 32-bit floating point), storing weights, their gradients, and optimizer momentum " +
          "states requires **16 bytes of VRAM per parameter** ($4 + 4 + 8$ bytes)."
      },

      miss: [
        {
          w: "Weights represent the direct probability that a neuron will activate.",
          r: "Weights are real-valued scalars ($-\\infty, +\\infty$) that scale inputs linearly. Activation probabilities only emerge after passing the affine sum through non-linear functions like Sigmoid or Softmax."
        },
        {
          w: "All weights in a layer can be initialized to zero as long as biases are non-zero.",
          r: "Initializing weights to zero forces all neurons in the hidden layer to compute identical forward values and identical backpropagation gradients, causing them to update identically and destroying network capacity."
        },
        {
          w: "Larger weight magnitudes always indicate that a feature is more important.",
          r: "Weight magnitude is sensitive to feature scaling and regularization. An unscaled feature with tiny values may have a massive weight simply to compensate for numerical scale."
        },
        {
          w: "Weights remain fixed during inference and cannot be adapted to new inputs.",
          r: "While standard inference uses fixed weights, modern dynamic architectures like Hypernetworks and Fast Weight Programmers generate or adapt weights dynamically at inference time based on the input context."
        }
      ],

      trade: {
        buys: [
          "Continuous differentiability: enables gradient descent to discover complex representations across billions of parameters.",
          "High operational density: dense weight matrices map directly to specialized matrix-multiplication hardware (Nvidia Tensor Cores, Google TPUs).",
          "Compression flexibility: can be quantized post-training from FP32 to INT8 or INT4 with minimal loss of accuracy."
        ],
        costs: [
          "Massive memory footprint: storing billions of weights and their optimizer states strains GPU High-Bandwidth Memory (HBM).",
          "Susceptible to catastrophic forgetting: updating weights on new tasks erases knowledge acquired from previous training distributions.",
          "Overparameterization risk: unconstrained weights easily memorize training noise without proper regularization."
        ],
        avoid: [
          "Initializing weight matrices with constant values (all zeros, all ones).",
          "Training multi-billion parameter weight matrices in FP32 when FP16 or BF16 mixed-precision provides identical convergence at half the memory."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bias-term",

      why: {
        before: "Without a bias term, an artificial neuron was constrained to computing a pure linear dot product $z = w^T x$, " +
          "forcing its separating hyperplane to pass strictly through the origin $(0, 0, \\dots, 0)$.",
        problem: "Real-world decision boundaries and regression targets rarely intersect the origin; " +
          "forcing hyperplanes through $(0,0)$ makes it impossible to model shifted thresholds (e.g. predicting positive only when $x > 50$).",
        shift: "**Bias Term ($b$): Learnable affine translation parameter.** " +
          "Add an unconstrained learnable scalar or vector $b$ to the inner product ($z = Wx + b$), " +
          "decoupling the neuron's activation threshold from the coordinate origin."
      },

      num: {
        t: "Bias term mathematical mechanics & gradient updates",
        h: ["Property / Metric", "Mathematical Formulation", "Role in Network Dynamics"],
        r: [
          ["**Affine Transformation**", "$z = W x + b$", "Translates the hyperplane across feature space independently of input magnitudes"],
          ["**Neuron Activation Threshold**", "Fires when $w^T x \\ge -b$", "$-b$ defines the baseline internal threshold required to trigger an output"],
          ["**Gradient Formulation**", "$\\frac{\\partial \\mathcal{L}}{\\partial b} = \\delta = \\frac{\\partial \\mathcal{L}}{\\partial z}$", "Gradients depend strictly on downstream error $\\delta$, **completely independent of input $x$**"],
          ["**Batch Gradient Aggregation**", "$\\frac{\\partial \\mathcal{L}}{\\partial b} = \\sum_{i=1}^B \\delta^{(i)}$", "Sums the error vectors across all samples in the mini-batch"],
          ["**Regularization Convention**", "**Excluded from L2 Weight Decay**", "Penalizing bias drives the threshold toward zero, which artificially restricts function shift"]
        ],
        n: "The bias term $b$ is the learnable translation offset in an " +
          "affine transformation. Geometrically, in 2D space, the equation $w_1 x_1 + w_2 x_2 = 0$ " +
          "is a line that MUST pass through $(0,0)$. Introducing bias: $w_1 x_1 + w_2 x_2 + b = 0$ " +
          "allows the line to translate anywhere in the Cartesian plane. In neuron dynamics, " +
          "the bias acts as an intrinsic firing threshold: if $b$ is a large positive number, " +
          "the neuron fires even with zero input signals ($x = 0$); if $b$ is a large negative " +
          "number, the neuron remains quiescent unless overcome by massive positive input activations. " +
          "Mathematically, the bias gradient $\\frac{\\partial \\mathcal{L}}{\\partial b}$ is simply " +
          "the downstream error vector $\\delta$, because $\\frac{\\partial z}{\\partial b} = 1$. " +
          "In standard deep learning practice, **bias terms are excluded from L2 weight decay** " +
          "(regularization): regularizing weights prevents overfitting by smoothing the function's curvature, " +
          "whereas regularizing biases merely shifts the global output baseline without reducing model variance."
      },

      miss: [
        {
          w: "Biases should be regularized with L2 weight decay just like weight matrices.",
          r: "Biases control the global threshold offset, not the curvature or slope of the function. Applying weight decay to biases provides virtually zero regularization benefit and restricts the model from fitting shifted targets."
        },
        {
          w: "A bias term is mandatory in every single layer of a deep neural network.",
          r: "If a linear or convolutional layer is immediately followed by Batch Normalization, the bias term is redundant and should be disabled (`bias=False`), because BatchNorm centers activations by subtracting the batch mean."
        },
        {
          w: "Biases must be initialized randomly to break symmetry, just like weights.",
          r: "Biases can safely be initialized to all zeros. Symmetry breaking is accomplished entirely by the random initialization of the weight matrix W."
        },
        {
          w: "The bias gradient depends directly on the input feature vector x.",
          r: "The derivative $\\frac{\\partial z}{\\partial b} = 1$; therefore, $\\frac{\\partial \\mathcal{L}}{\\partial b} = \\delta$, depending solely on the upstream error signal without scaling by input $x$."
        }
      ],

      trade: {
        buys: [
          "Affine translation flexibility: allows separating hyperplanes and decision boundaries to exist anywhere in coordinate space.",
          "Independent firing thresholds: allows individual neurons to remain inactive or active regardless of zero-centered input vectors.",
          "Zero initialization stability: can be safely initialized to zero without causing gradient symmetry failure."
        ],
        costs: [
          "Wasted parameters and compute if placed directly before Batch Normalization layers.",
          "Adds minor memory tracking overhead during optimizer state management.",
          "Improper bias initialization in classification output layers on imbalanced datasets can cause severe early gradient instability."
        ],
        avoid: [
          "Enabling `bias=True` in PyTorch `nn.Linear` or `nn.Conv2d` layers when immediately followed by `nn.BatchNorm2d`.",
          "Applying L2 weight decay regularization to bias parameter groups."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "activation-function",

      why: {
        before: "Early networks stacked multiple linear transformations ($W_2 W_1 x$), " +
          "which collapsed algebraically into a single linear matrix, rendering multi-layer depth mathematically useless.",
        problem: "Real-world data generation processes are fundamentally non-linear; a machine learning model " +
          "must introduce non-linearities while remaining continuously differentiable for backpropagation.",
        shift: "**Activation Function: Element-wise non-linear scalar mapping.** " +
          "Apply a non-linear mathematical operator $\\sigma(z)$ to pre-activations at every hidden layer, " +
          "enabling the network to warp, fold, and carve non-linear decision boundaries in high-dimensional space."
      },

      num: {
        t: "Activation functions mathematical taxonomy & properties",
        h: ["Activation Function", "Mathematical Formula", "Output Range", "Gradient Saturation Behavior"],
        r: [
          ["**ReLU**", "$\\max(0, z)$", "$[0, \\infty)$", "**Zero saturation for $z > 0$**; vanishes completely for $z < 0$ (Dying ReLU)"],
          ["**GELU**", "$z \\Phi(z) = z P(X \\le z)$", "$[-0.17, \\infty)$", "Smooth, probabilistic gating; standard in modern Transformers (BERT, GPT)"],
          ["**Sigmoid**", "$\\frac{1}{1 + e^{-z}}$", "$(0, 1)$", "**Severe saturation at both tails**; max gradient is $0.25$; not zero-centered"],
          ["**Tanh**", "$\\frac{e^z - e^{-z}}{e^z + e^{-z}}$", "$(-1, 1)$", "**Saturates at tails**; max gradient is $1.0$; strictly zero-centered"],
          ["**Leaky ReLU**", "$\\max(\\alpha z, z), \\, \\alpha=0.01$", "$(-\\infty, \\infty)$", "Prevents dying neurons by providing small slope $\\alpha$ for $z < 0$"]
        ],
        n: "Activation functions are the sole mathematical mechanism that allows " +
          "deep neural networks to learn non-linear functions. When choosing an activation " +
          "function, three mathematical properties dictate convergence: " +
          "(1) **Gradient Saturation**: if an activation's derivative approaches zero for large " +
          "positive or negative inputs (as occurs in Sigmoid and Tanh where $\\sigma'(z) \\to 0$ " +
          "when $|z| \\gg 0$), the backpropagated error gradient $\\delta^{[l]} = \\delta^{[l+1]} W^T \\odot \\sigma'(z^{[l]})$ " +
          "shrinks exponentially with every layer traversed, causing the **Vanishing Gradient problem**. " +
          "(2) **Zero-Centered Outputs**: if activations are strictly positive (like Sigmoid where $a > 0$), " +
          "the gradients with respect to weights in the subsequent layer all share the same sign, " +
          "forcing weight updates into inefficient zig-zagging trajectories during gradient descent. " +
          "(3) **Computational Cost**: functions requiring transcendental exponentials ($e^z$) " +
          "incur substantial clock-cycle latency compared to simple threshold comparisons ($\\,\\max(0, z)$)."
      },

      miss: [
        {
          w: "Any non-linear mathematical function can be used effectively as an activation function.",
          r: "Activations must be piecewise differentiable and numerically stable. Wildly oscillating functions (like $\\sin(1/x)$) create chaotic, un-optimizable loss landscapes that defeat gradient descent."
        },
        {
          w: "Activation functions are required on the final output layer of regression networks.",
          r: "Regression networks predicting unconstrained continuous values generally use an identity linear activation ($f(z) = z$) at the output layer to allow arbitrary positive and negative targets."
        },
        {
          w: "Sigmoid is the best activation function because it models biological action potentials.",
          r: "Sigmoid causes catastrophic vanishing gradients in deep networks and produces non-zero-centered outputs. It has been completely replaced in intermediate hidden layers by ReLU, GELU, and Swish."
        },
        {
          w: "Activation functions increase the parameter count of the layer.",
          r: "Standard activation functions (ReLU, Sigmoid, Tanh, GELU) are fixed, element-wise mathematical operators containing zero learnable parameters (with rare exceptions like PReLU)."
        }
      ],

      trade: {
        buys: [
          "Unlocks multi-layer representational capacity: enables networks to approximate arbitrary continuous functions.",
          "Shapes gradient flow: modern activations (GELU, Swish, Leaky ReLU) maintain healthy gradient highways across hundreds of layers.",
          "Scales non-linearly: allows selective gating of information through deep computational graphs."
        ],
        costs: [
          "Poor choices (unbounded Sigmoid/Tanh in deep networks) cause catastrophic vanishing gradients and stall training.",
          "Transcendental functions (GELU, Swish, Sigmoid) require higher GPU FLOPs than simple thresholding (ReLU).",
          "Asymmetric activations can induce internal covariate shift and dying neuron phenomena."
        ],
        avoid: [
          "Using Sigmoid or Tanh in hidden layers of networks deeper than 5 layers without residual skip connections.",
          "Omitting activations between dense layers, which mathematically collapses the stack into a single linear layer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "relu",

      why: {
        before: "Deep networks in the 1990s and 2000s relied on Sigmoid and Tanh activations, " +
          "which saturated heavily at both extremes, causing gradients to vanish and capping practical network depth at ~4-5 layers.",
        problem: "Computing transcendental exponentials ($e^z$) across millions of activations was computationally expensive, " +
          "and saturated gradients made backpropagation through dozens of layers mathematically impossible.",
        shift: "**ReLU (Rectified Linear Unit, Nair & Hinton 2010): One-sided thresholding with constant unit gradient.** " +
          "Compute $f(x) = \\max(0, x)$, providing a constant gradient of $1.0$ for all positive inputs, " +
          "completely eliminating vanishing gradients for positive activations and unlocking ultra-deep networks."
      },

      num: {
        t: "ReLU family comparison & mathematical properties",
        h: ["Activation Variant", "Mathematical Formula", "Derivative ($z > 0$)", "Derivative ($z < 0$)", "Dying Neuron Risk"],
        r: [
          ["**Standard ReLU**", "$\\max(0, z)$", "$1.0$", "$0.0$", "**High** (neurons can die permanently)"],
          ["**Leaky ReLU**", "$\\max(\\alpha z, z), \\, \\alpha=0.01$", "$1.0$", "$\\alpha = 0.01$", "**Zero** (maintains continuous small gradient)"],
          ["**Parametric ReLU (PReLU)**", "$\\max(\\alpha z, z), \\, \\alpha \\text{ learned}$", "$1.0$", "$\\alpha$ (learnable parameter)", "**Zero** (adapts slope to dataset)"],
          ["**ELU (Exponential Linear)**", "$z \\text{ if } z>0 \\text{ else } \\alpha(e^z - 1)$", "$1.0$", "$\\alpha e^z$", "**Zero** (smooth, pushes mean activations to zero)"],
          ["**GELU (Gaussian Error Linear)**", "$z \\cdot \\Phi(z) \\approx 0.5z(1 + \\tanh(\\dots))$", "Smooth non-linear", "Smooth non-zero", "**Zero** (probabilistic gating; SOTA in LLMs)"]
        ],
        n: "The Rectified Linear Unit (ReLU) was the single most impactful algorithmic " +
          "catalyst of the modern deep learning revolution (Nair & Hinton 2010, Glorot et al. 2011). " +
          "Defined as $f(z) = \\max(0, z)$, its derivative is piecewise constant: " +
          "$f'(z) = 1$ if $z > 0$, and $f'(z) = 0$ if $z < 0$ (with subgradient conventionally set to 0 or 0.5 at $z=0$). " +
          "Because the derivative is exactly $1.0$ for any positive pre-activation, gradients " +
          "flow backward through positive neurons without being attenuated by multiplying fractions, " +
          "resolving the **Vanishing Gradient problem** and enabling the training of deep networks like AlexNet (2012). " +
          "Furthermore, ReLU enforces **true representational sparsity**: on average, roughly 50% " +
          "of hidden neurons output exactly 0 for any given input, mimicking biological cortical sparsity. " +
          "Computationally, ReLU requires only a single branchless CPU/GPU comparison instruction, " +
          "running up to **6x faster** than Sigmoid or Tanh. However, ReLU suffers from the **Dying ReLU problem**: " +
          "if a large negative gradient knocks a neuron's bias so low that $z < 0$ across the entire dataset, " +
          "its gradient becomes permanently zero, rendering the neuron permanently dead."
      },

      miss: [
        {
          w: "ReLU is non-differentiable at z = 0, so it cannot be used with gradient descent.",
          r: "In convex and non-convex optimization, subgradient calculus formally handles points of non-differentiability. In software implementations, the subgradient at z = 0 is simply hardcoded to 0.0 (or 0.5)."
        },
        {
          w: "Dead ReLU neurons will naturally recover later in training.",
          r: "If a neuron outputs zero for all training samples, its gradient is strictly zero across all mini-batches. With zero gradient, its weights and bias never update, leaving it permanently dead for the remainder of training."
        },
        {
          w: "ReLU is an unbounded activation function, so it causes exploding gradients.",
          r: "While ReLU is unbounded above, exploding gradients are caused by large weight matrices, improper initialization, or excessive learning rates—not the activation function itself. Proper He/Kaiming initialization stabilizes ReLU."
        },
        {
          w: "ReLU produces zero-centered activations.",
          r: "ReLU outputs are strictly non-negative ($[0, \\infty)$), meaning the mean activation is always positive, which can introduce a bias shift in subsequent layers (a flaw resolved by Batch Normalization or ELU)."
        }
      ],

      trade: {
        buys: [
          "Completely cures the vanishing gradient problem for positive activations via a constant unit gradient ($f'(z) = 1$).",
          "Extreme computational speed: requires only a trivial hardware conditional comparison rather than expensive transcendental exponentials.",
          "Induces biological-like representational sparsity: inactive neurons output absolute zero, simplifying downstream feature spaces."
        ],
        costs: [
          "Dying ReLU vulnerability: aggressive learning rates can permanently deactivate large fractions of network neurons.",
          "Non-zero-centered outputs: strictly positive activations induce systematic positive bias drift in downstream layers.",
          "Unbounded positive range can lead to activation explosion without proper weight initialization or normalization."
        ],
        avoid: [
          "Using high learning rates with standard ReLU without gradient clipping or adaptive optimizers.",
          "Initializing biases to large negative values when using ReLU (use small positive biases like 0.01 or 0.1 to keep neurons active initially)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
