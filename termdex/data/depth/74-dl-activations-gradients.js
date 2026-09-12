/* ==========================================================================
   Depth pass 74 — Deep Learning batch 2: activations, passes & gradient cycles.
   Sigmoid, Tanh, Softmax, Forward Pass,
   Backpropagation, Epoch, Batch Size, Iteration.

   Probability squashing normalizes latent logits; the forward execution graph
   caches activations for the reverse-mode chain rule across training iterations.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "sigmoid",

      why: {
        before: "Binary classification models produced unbounded linear scores ($-\\infty, +\\infty$), " +
          "which could not be interpreted as normalized event probabilities.",
        problem: "Step functions (Heaviside) provided binary outputs but had zero derivatives everywhere, " +
          "preventing gradient-based optimization via backpropagation.",
        shift: "**Sigmoid Activation (Logistic Function): Differentiable S-curve probability mapping.** " +
          "Squash arbitrary real-valued log-odds $z \\in (-\\infty, +\\infty)$ into a strictly bounded probability " +
          "range $\\sigma(z) = \\frac{1}{1 + e^{-z}} \\in (0, 1)$ with a smooth, self-referential derivative."
      },

      num: {
        t: "Sigmoid mathematical properties & gradient attenuation limits",
        h: ["Property / Metric", "Mathematical Formulation", "Numerical Value / Limit"],
        r: [
          ["**Mathematical Definition**", "$\\sigma(z) = \\frac{1}{1 + e^{-z}} = \\frac{e^z}{e^z + 1}$", "Maps $\\mathbb{R} \\to (0, 1)$"],
          ["**Derivative Formulation**", "$\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$", "Expressed purely in terms of function output"],
          ["**Maximum Derivative**", "$\\max \\sigma'(z) = \\sigma'(0) = 0.5 \\times 0.5$", "**$0.25$** (occurs strictly at $z=0$)"],
          ["**Gradient Vanishing Factor**", "$\\prod_{l=1}^L \\sigma'(z_l) \\le (0.25)^L$", "In a 5-layer network: $(0.25)^5 \\approx **0.000976$** ($99.9\\%$ loss of signal)"],
          ["**Output Mean Offset**", "$\\mathbb{E}[a] > 0$ (strictly positive)", "Non-zero-centered: induces systematic zig-zagging in weight updates"]
        ],
        n: "The Sigmoid activation function is mathematically identical to the " +
          "logistic function. It maps any real-valued logit $z$ into the open interval $(0, 1)$, " +
          "making it the canonical activation for the final output layer of **binary classification** " +
          "and multi-label classification networks. Its derivative exhibits an elegant algebraic property: " +
          "$\\frac{d\\sigma}{dz} = \\sigma(z)(1 - \\sigma(z))$. However, using Sigmoid in the intermediate " +
          "hidden layers of deep networks introduces two severe architectural flaws. " +
          "First, **Catastrophic Vanishing Gradients**: the maximum possible value of $\\sigma'(z)$ is " +
          "only $0.25$ (at $z=0$), and as $|z| > 4$, the derivative rapidly asymptotically collapses to $0.0$. " +
          "When backpropagating through $L$ layers, error gradients are scaled by at least $(0.25)^L$, " +
          "decaying exponentially toward numerical zero and freezing early layer weights. " +
          "Second, **Non-Zero-Centered Outputs**: because $\\sigma(z) > 0$ for all inputs, " +
          "the activations $a^{[l]}$ fed into the next layer are strictly positive. Because " +
          "$\\frac{\\partial \\mathcal{L}}{\\partial W_{ij}} = \\delta_i a_j$, all weight gradients " +
          "for a given neuron share the sign of $\\delta_i$, forcing the optimizer into slow, " +
          "inefficient zig-zagging trajectories toward the minimum."
      },

      miss: [
        {
          w: "Sigmoid should be used in all hidden layers of a deep neural network.",
          r: "Using Sigmoid across multiple hidden layers causes catastrophic vanishing gradients that prevent deep networks from training. Modern networks use ReLU, GELU, or Swish in hidden layers, reserving Sigmoid strictly for output binary probability layers."
        },
        {
          w: "Sigmoid outputs are true Bayesian probabilities.",
          r: "Sigmoid outputs merely satisfy the Kolmogorov axioms of being bounded in $(0, 1)$. Uncalibrated neural networks are frequently overconfident; true probabilities require post-hoc calibration (e.g. Platt scaling or isotonic regression)."
        },
        {
          w: "A large negative input to Sigmoid causes floating-point overflow.",
          r: "In naive software implementations, large negative z ($z < -709$ in FP64) causes $e^{-z}$ to overflow to infinity. Robust implementations evaluate `1 / (1 + exp(-z))` for $z \\ge 0$ and `exp(z) / (1 + exp(z))` for $z < 0$."
        },
        {
          w: "Sigmoid can be used for multi-class mutually exclusive classification.",
          r: "Sigmoid treats each output node independently (multi-label classification). For mutually exclusive single-label multi-class classification, Softmax is mathematically required because its outputs sum to 1.0 across classes."
        }
      ],

      trade: {
        buys: [
          "Natural probabilistic interpretation: directly models Bernoulli probability parameters $p(y=1|x)$ in binary classification.",
          "Smooth, continuous differentiability: enables gradient descent with a self-referential derivative requiring no transcendental re-computation.",
          "Ideal gating mechanism: acts as a soft binary switch in LSTM/GRU forget and input gates."
        ],
        costs: [
          "Catastrophic vanishing gradients when $|z| > 3$, with a maximum derivative bounded at $0.25$.",
          "Non-zero-centered activations introduce gradient covariance bias and slow optimizer convergence.",
          "Relatively expensive transcendental exponential computation compared to hardware branchless operations like ReLU."
        ],
        avoid: [
          "Using Sigmoid in intermediate hidden layers of feedforward or convolutional networks.",
          "Evaluating naive `1.0 / (1.0 + np.exp(-z))` without numerical clipping to prevent floating-point overflow on large negative numbers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tanh",

      why: {
        before: "Sigmoid activations produced strictly non-negative outputs ($a > 0$), " +
          "causing all backpropagated weight gradients in subsequent layers to share the same sign and oscillate wildly.",
        problem: "Deep networks required a smooth non-linear activation function that was strictly zero-centered " +
          "to eliminate systematic gradient bias while maintaining a higher maximum derivative.",
        shift: "**Tanh (Hyperbolic Tangent): Zero-centered symmetric squashing function.** " +
          "Scale and shift the sigmoid function: $\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}} = 2\\sigma(2z) - 1$, " +
          "mapping real-valued inputs symmetrically into $(-1, 1)$ with a maximum derivative of $1.0$ at the origin."
      },

      num: {
        t: "Tanh vs Sigmoid mathematical comparison & properties",
        h: ["Dimension / Property", "Sigmoid ($\\sigma$)", "Tanh ($\\tanh$)", "Mathematical Advantage of Tanh"],
        r: [
          ["**Output Range**", "$(0, 1)$", "**$(-1, 1)$**", "Symmetric about the origin; outputs have zero mean"],
          ["**Maximum Derivative**", "$0.25$ (at $z=0$)", "**$1.0$** (at $z=0$)", "**4x stronger gradient signal** around the origin"],
          ["**Derivative Formulation**", "$\\sigma(1 - \\sigma)$", "**$1 - \\tanh^2(z)$**", "Directly computed from output activation without exponentiation"],
          ["**Zero-Centered?**", "**No** (strictly positive)", "**Yes** (mean activation $\\approx 0$)", "Eliminates gradient zig-zagging in subsequent weight matrices"],
          ["**Saturation Region**", "$|z| > 4$", "$|z| > 2.5$", "Both saturate heavily at tails, causing vanishing gradients in deep stacks"]
        ],
        n: "The Hyperbolic Tangent (Tanh) activation was introduced to resolve " +
          "the non-zero-centered limitation of Sigmoid. Because $\\tanh(-z) = -\\tanh(z)$, " +
          "it is an odd function centered strictly at zero. If the input features to a layer " +
          "have mean zero, Tanh activations maintain approximately zero-mean distributions " +
          "into subsequent layers, which prevents weight gradients from becoming locked into " +
          "all-positive or all-negative updates. Its derivative is computed instantaneously " +
          "from the forward activation: $\\frac{d\\tanh(z)}{dz} = 1 - \\tanh^2(z)$. " +
          "At the origin ($z=0$), its derivative is exactly $1.0$—four times larger than Sigmoid's " +
          "puny $0.25$ maximum. Consequently, in the 1990s and early 2000s, Yann LeCun and colleagues " +
          "strongly recommended Tanh over Sigmoid for hidden layers. However, Tanh still suffers " +
          "from **tail saturation**: for inputs $|z| > 2.5$, $\\tanh^2(z) \\approx 1$, meaning " +
          "$\\tanh'(z) \\to 0$. In networks deeper than ~6-8 layers without residual connections, " +
          "Tanh still inevitably succumbs to vanishing gradients. Today, Tanh is the standard activation " +
          "governing cell state candidate generation and hidden state updates within **LSTM and GRU** recurrent units."
      },

      miss: [
        {
          w: "Tanh completely eliminates the vanishing gradient problem in deep networks.",
          r: "Tanh only alleviates vanishing gradients near z = 0 (where derivative is 1.0). For activations with magnitude $|z| > 3$, the derivative decays to 0, which still chokes gradient flow in deep architectures."
        },
        {
          w: "Tanh is computationally faster than ReLU.",
          r: "Tanh requires calculating two transcendental exponential functions ($e^z$ and $e^{-z}$), making it significantly more compute-intensive than ReLU's single hardware threshold comparison."
        },
        {
          w: "Tanh can be used directly as the final output layer for binary probability classification.",
          r: "Tanh outputs range from -1 to +1, which violates the Kolmogorov probability axiom ($P \\in [0, 1]$). Sigmoid is mathematically required for probability outputs."
        },
        {
          w: "Tanh and Sigmoid are completely independent, unrelated functions.",
          r: "Tanh is an exact affine transformation of Sigmoid: $\\tanh(z) = 2\\sigma(2z) - 1$."
        }
      ],

      trade: {
        buys: [
          "Zero-centered outputs: accelerates gradient descent convergence by eliminating directional bias in layer weight gradients.",
          "Stronger gradient transmission near origin: peak derivative of $1.0$ (vs $0.25$ for Sigmoid) preserves signal in shallow networks.",
          "Bounded dynamic range $(-1, +1)$: prevents activation explosion in recurrent neural network state loops."
        ],
        costs: [
          "Saturation at extremes: derivatives collapse to zero for $|z| > 2.5$, causing vanishing gradients in deep networks.",
          "Transcendental floating-point computational overhead on large tensor operations.",
          "Outperformed in modern feedforward and transformer architectures by non-saturating activations (ReLU, GELU, Swish)."
        ],
        avoid: [
          "Using Tanh in deep convolutional or transformer backbones without residual connections.",
          "Using Tanh on the output layer when predicting non-negative quantities or probabilities."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "softmax",

      why: {
        before: "Multi-class classification models produced unconstrained, real-valued logit vectors ($z_1, \\dots, z_K$), " +
          "which could not be interpreted as a valid discrete probability distribution across mutually exclusive classes.",
        problem: "Simply dividing each logit by the sum of logits fails when numbers are negative ($z_k < 0$), " +
          "while taking an absolute value destroys the ordinal meaning of relative confidence scores.",
        shift: "**Softmax (Normalized Exponential): Differentiable categorical probability distribution.** " +
          "Exponentiate each logit and normalize by the partition sum: $\\text{softmax}(z)_i = \\frac{e^{z_i / \\tau}}{\\sum_{j=1}^K e^{z_j / \\tau}}$, " +
          "guaranteeing strictly positive outputs that sum exactly to $1.0$ while supporting temperature calibration $\\tau$."
      },

      num: {
        t: "Softmax mathematical formulation, derivatives & temperature dynamics",
        h: ["Property / Operation", "Mathematical Formulation", "Role in Deep Learning"],
        r: [
          ["**Softmax Probability ($p_i$)**", "$p_i = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}$", "Maps unconstrained logits to valid probability simplex: $\\sum p_i = 1.0, \\, p_i > 0$"],
          ["**Numerical Stability Shift**", "$p_i = \\frac{e^{z_i - \\max(z)}}{\\sum e^{z_j - \\max(z)}}$", "**Prevents floating-point overflow** by setting largest exponent to $e^0 = 1.0$"],
          ["**Temperature Scaling ($\\tau$)**", "$p_i = \\frac{e^{z_i / \\tau}}{\\sum e^{z_j / \\tau}}$", "$\\tau \\to 0$: Argmax (one-hot); $\\tau \\to \\infty$: Uniform distribution ($1/K$)"],
          ["**Jacobian Derivative**", "$\\frac{\\partial p_i}{\\partial z_j} = p_i (\\delta_{ij} - p_j)$", "Diagonal: $p_i(1 - p_i)$; Off-diagonal: $-p_i p_j$"],
          ["**Combined Softmax + Cross-Entropy**", "$\\frac{\\partial \\mathcal{L}_{\\text{CE}}}{\\partial z_i} = p_i - y_i$", "**Astonishingly clean gradient**: predicted probability minus one-hot label!"]
        ],
        n: "The Softmax function is the universal mathematical bridge between " +
          "continuous neural network representations and **categorical probability distributions**. " +
          "Given a vector of raw unnormalized log-odds (logits) $z \\in \\mathbb{R}^K$, Softmax " +
          "exponentiates each logit to enforce positivity ($e^z > 0$) and divides by the partition " +
          "function $\\sum_{j=1}^K e^{z_j}$, projecting the vector onto the standard probability simplex " +
          "$\\Delta^{K-1}$. In production software, naive evaluation of $e^{z_i}$ triggers catastrophic " +
          "floating-point overflow whenever $z_i > 88.7$ (in IEEE 754 single-precision float32). " +
          "To guarantee **numerical stability**, implementations apply the identity " +
          "$\\frac{e^{z_i}}{\\sum e^{z_j}} = \\frac{e^{z_i - c}}{\\sum e^{z_j - c}}$ by setting " +
          "$c = \\max_j(z_j)$, ensuring the maximum exponent is exactly $e^0 = 1.0$. " +
          "When combined with Cross-Entropy Loss ($\\mathcal{L} = -\\sum y_i \\log p_i$), " +
          "the complex Jacobian derivative cancels out through logarithmic algebra, yielding " +
          "an extraordinarily simple, numerically elegant gradient: $\\frac{\\partial \\mathcal{L}}{\\partial z_i} = p_i - y_i$. " +
          "In modern Transformer architectures, Softmax is also the foundational operator " +
          "normalizing query-key dot products within **Scaled Dot-Product Attention**: $\\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right)$."
      },

      miss: [
        {
          w: "Applying Softmax to logits changes the rank order of the highest scoring class.",
          r: "Because the exponential function $e^z$ is strictly monotonically increasing, $\\text{argmax}_i(\\text{softmax}(z)_i) = \\text{argmax}_i(z_i)$. Softmax preserves logit rank ordering perfectly."
        },
        {
          w: "Softmax probabilities can be used for multi-label classification where an image contains both a dog and a cat.",
          r: "Softmax mathematically forces probabilities to sum to 1.0, assuming classes are mutually exclusive. For multi-label classification, independent Sigmoid activations must be used on each output node."
        },
        {
          w: "In PyTorch, you should pass Softmax outputs into `nn.CrossEntropyLoss`.",
          r: "PyTorch's `nn.CrossEntropyLoss` combines `nn.LogSoftmax` and `nn.NLLLoss` into a single fused, numerically stable kernel. Passing manual Softmax outputs into CrossEntropyLoss applies Softmax twice, corrupting training."
        },
        {
          w: "Higher Softmax probabilities mean the model is calibrated and safe.",
          r: "Modern deep neural networks are notoriously uncalibrated: an overparameterized network will regularly output 99.9% Softmax confidence on completely out-of-distribution or corrupted inputs."
        }
      ],

      trade: {
        buys: [
          "Rigorous multi-class probability normalization: outputs strictly sum to $1.0$ on the probability simplex.",
          "Incredible analytical synergy with Cross-Entropy: yields an exceptionally simple gradient ($p_i - y_i$).",
          "Differentiable soft competition: temperature $\\tau$ allows continuous interpolation from smooth blending to hard argmax selection."
        ],
        costs: [
          "Global normalization dependency: computing the denominator requires summing across all $K$ classes, creating GPU synchronization bottlenecks for massive vocabularies ($K > 100,000$).",
          "Inapplicable to non-mutually exclusive multi-label scenarios.",
          "Prone to overconfident miscalibration on out-of-distribution test inputs."
        ],
        avoid: [
          "Computing raw exponentials in code without subtracting $\\max(z)$ for numerical stability.",
          "Feeding Softmax outputs directly into PyTorch `nn.CrossEntropyLoss`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "forward-pass",

      why: {
        before: "Evaluating complex mathematical models required bespoke procedural scripts " +
          "manually stitching intermediate equations together without a standardized computational framework.",
        problem: "Deep learning models require evaluating billions of operations sequentially while caching " +
          "the exact intermediate tensor states required for reverse-mode automatic differentiation.",
        shift: "**Forward Pass: Topological execution of the computational graph.** " +
          "Feed input tensors through successive parameterized layers to generate predictions and scalar loss, " +
          "allocating activation memory and building the backward execution tape for backpropagation."
      },

      num: {
        t: "Forward pass operational profile: Training vs Inference mode",
        h: ["Component / Behavior", "Training Forward Pass", "Inference / Eval Forward Pass (`torch.no_grad()`)"],
        r: [
          ["**Activation Tensor Caching**", "**Mandatory**: caches all intermediate activations in VRAM", "**Disabled**: activations are freed immediately after layer consumption"],
          ["**GPU VRAM Consumption**", "High: Parameters + Activations + Workspace", "**Low**: strictly Parameters + temporary scratch buffer (~$70\\%$ less RAM)"],
          ["**Dropout Behavior**", "Randomly zeros neuron activations with probability $p$", "**Disabled**: acts as identity function scaling by $1.0$"],
          ["**Batch Normalization**", "Calculates dynamic batch mean & variance: $\\mu_B, \\sigma_B^2$", "Freezes batch stats; uses accumulated running statistics"],
          ["**Computational Graph Tape**", "Constructs dynamic autograd DAG (`grad_fn` pointers)", "Tape construction disabled; zero autograd graph overhead"]
        ],
        n: "The Forward Pass is the directional traversal of an artificial neural network " +
          "from input features to output loss. For an $L$-layer network, it sequentially computes: " +
          "$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$ followed by $a^{[l]} = \\sigma(z^{[l]})$, " +
          "culminating in task loss $\\mathcal{L}(a^{[L]}, y)$. In **Training Mode**, the forward " +
          "pass does not merely compute the loss; it acts as an **activation recording tape**. " +
          "Because the backpropagation gradient of a linear layer $\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} (a^{[l-1]})^T$ " +
          "requires the exact input activation $a^{[l-1]}$ that was produced during the forward pass, " +
          "the deep learning framework (e.g. PyTorch Autograd) must retain all intermediate tensors " +
          "in GPU VRAM until the backward pass completes! This is why training consumes vastly more " +
          "memory than inference. In **Inference Mode** (invoked via `with torch.no_grad():`), " +
          "graph construction and activation caching are disabled, allowing intermediate buffers " +
          "to be overwritten immediately, drastically cutting memory consumption and latency."
      },

      miss: [
        {
          w: "In PyTorch, setting `model.eval()` disables gradient calculation and saves memory.",
          r: "`model.eval()` only switches operational behavior for layers like Dropout and BatchNorm; it does NOT stop autograd from building the backward graph. You must explicitly wrap evaluation in `torch.no_grad()` to prevent activation caching."
        },
        {
          w: "The forward pass consumes more GPU compute time than the backward pass.",
          r: "The backward pass requires roughly 2x more floating-point operations (FLOPs) than the forward pass, because it must compute gradients with respect to both weights AND layer inputs."
        },
        {
          w: "Activations can be safely deleted as soon as a layer finishes its forward execution.",
          r: "During training, intermediate activations must be pinned in GPU memory because backpropagation directly multiplies them against downstream error signals to compute weight gradients."
        },
        {
          w: "Inference forward passes must always run with batch size 1.",
          r: "Batched inference ($B = 16, 32, 64$) dramatically increases GPU hardware utilization and throughput by saturating memory bandwidth and tensor cores."
        }
      ],

      trade: {
        buys: [
          "Generates task predictions and evaluates training loss across batched inputs.",
          "Records the dynamic directed acyclic graph (DAG) required for reverse-mode automatic differentiation.",
          "Exposes clean execution hooks for debugging activations, feature visualization, and intermediate embeddings."
        ],
        costs: [
          "Enormous GPU memory footprint during training to cache activation tensors across all layers.",
          "Memory bandwidth bottlenecks on large batch sizes when streaming tensor inputs to compute cores.",
          "Behavioral drift between training and inference modes if model flags (`train()` vs `eval()`) are mismanaged."
        ],
        avoid: [
          "Running validation or test evaluation loops without `torch.no_grad()` context managers.",
          "Forgetting to toggle `model.train()` when switching back from validation to training epochs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "backpropagation",

      why: {
        before: "Training multi-layer networks was deemed intractable because researchers had no systematic, " +
          "computationally efficient mathematical method to compute gradients for internal hidden layers without direct targets.",
        problem: "Numerically estimating gradients via finite differences (perturbing each parameter $\\theta_i$ by $\\epsilon$) " +
          "requires $P+1$ full forward passes for $P$ parameters; for a billion-parameter network, a single update would take years.",
        shift: "**Backpropagation (Rumelhart, Hinton & Williams 1986): Reverse-mode automatic differentiation.** " +
          "Apply the multivariable calculus chain rule backward from the scalar loss, computing exact analytic " +
          "gradients for ALL millions or billions of parameters simultaneously in a single reverse sweep."
      },

      num: {
        t: "Backpropagation mathematical formulations & operational complexity",
        h: ["Stage / Variable", "Mathematical Equation", "Dimensionality", "Computational Cost"],
        r: [
          ["**Output Layer Error ($\\delta^{[L]}$)**", "$\\delta^{[L]} = \\nabla_{a^{[L]}} \\mathcal{L} \\odot \\sigma'(z^{[L]})$", "$[d_L \\times B]$", "$\\mathcal{O}(d_L \\cdot B)$ element-wise"],
          ["**Hidden Layer Error ($\\delta^{[l]}$)**", "$\\delta^{[l]} = (W^{[l+1]T} \\delta^{[l+1]}) \\odot \\sigma'(z^{[l]})$", "$[d_l \\times B]$", "GEMM: $\\mathcal{O}(d_l \\cdot d_{l+1} \\cdot B)$"],
          ["**Weight Gradient ($\\nabla_{W^{[l]}} \\mathcal{L}$)**", "$\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} (a^{[l-1]})^T$", "$[d_l \\times d_{l-1}]$", "Outer product GEMM across batch"],
          ["**Bias Gradient ($\\nabla_{b^{[l]}} \\mathcal{L}$)**", "$\\frac{\\partial \\mathcal{L}}{\\partial b^{[l]}} = \\sum_{i=1}^B \\delta^{[l](i)}$", "$[d_l \\times 1]$", "Vector reduction along batch axis"],
          ["**Algorithmic Complexity**", "**$\\approx 2\\times$ Forward Pass FLOPs**", "Full network parameter set", "**$\to \mathcal{O}(P)$ compute!** vs $\mathcal{O}(P^2)$ for numerical perturbation"]
        ],
        n: "Backpropagation is the foundational computational engine of the deep learning " +
          "revolution. Mathematically, it is **Reverse-Mode Automatic Differentiation** applied " +
          "to a scalar loss function $\\mathcal{L}$. Rather than calculating forward derivatives " +
          "$\\frac{\\partial z_k}{\\partial x_j}$ (which requires work proportional to input dimensions), " +
          "reverse-mode tracks adjoint values (sensitivities) $\\delta = \\frac{\\partial \\mathcal{L}}{\\partial z}$ " +
          "starting from the scalar output $\\frac{\\partial \\mathcal{L}}{\\partial \\mathcal{L}} = 1$ " +
          "and working backward via the chain rule: " +
          "$\\delta^{[l]} = (W^{[l+1]T} \\delta^{[l+1]}) \\odot \\sigma'(z^{[l]})$. " +
          "Crucially, computing the gradient with respect to any weight matrix $W^{[l]}$ requires " +
          "only a single matrix multiplication between the downstream error tensor $\\delta^{[l]}$ " +
          "and the transposed incoming activation matrix from the forward pass: $\\frac{\\partial \\mathcal{L}}{\\partial W^{[l]}} = \\delta^{[l]} (a^{[l-1]})^T$. " +
          "This enables the exact gradient of **every single parameter in the network** to be " +
          "calculated with a computational complexity that is only approximately **two times the " +
          "cost of the forward pass**, completely independent of the number of parameters $P$!"
      },

      miss: [
        {
          w: "Backpropagation and gradient descent are the same algorithm.",
          r: "Backpropagation is an algorithm for computing partial derivatives (gradients) using the chain rule. Gradient descent is an optimization algorithm that uses those computed gradients to update parameters."
        },
        {
          w: "Backpropagation requires computing and storing full Jacobian matrices.",
          r: "Backpropagation never computes massive explicit Jacobian matrices; it evaluates Vector-Jacobian Products (VJPs) directly, accumulating scalar-vector dot products with minimal memory."
        },
        {
          w: "Backpropagation cannot handle non-differentiable operations like ReLU or Max-Pooling.",
          r: "Backpropagation utilizes subgradient calculus. For non-differentiable points (like max-pooling or ReLU at zero), it routes the gradient through the active branch and sets the subgradient to zero elsewhere."
        },
        {
          w: "Backpropagation is how the human brain learns.",
          r: "Biological plausibility of backprop remains deeply controversial: real brains lack symmetric backward weight transport, global error broadcasts, and distinct forward/backward phases (the 'weight transport problem')."
        }
      ],

      trade: {
        buys: [
          "Exact analytic gradients computed in $\\mathcal{O}(P)$ time across billions of parameters simultaneously.",
          "Universal applicability: works on any directed acyclic graph composed of piecewise differentiable operators.",
          "Naturally maps to modern GPU GEMM routines via vector-Jacobian product formulation."
        ],
        costs: [
          "Requires caching all intermediate forward activations in high-bandwidth memory (VRAM).",
          "Subject to vanishing and exploding gradient dynamics across long computational chains.",
          "Sequential backward dependency: layer $l$ cannot compute its gradients until layer $l+1$ finishes."
        ],
        avoid: [
          "Building deep networks without monitoring gradient norms (checking for vanishing or exploding values).",
          "Retaining unnecessary computational graph references that prevent Python garbage collection (`loss` instead of `loss.item()`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "epoch",

      why: {
        before: "Batch optimization algorithms processed the entire dataset at once, " +
          "while single-sample stochastic algorithms had no standardized unit to measure training lifecycle progress.",
        problem: "Deep learning needed a standardized metric to track how many times the model had inspected " +
          "the complete empirical data distribution during iterative stochastic mini-batch optimization.",
        shift: "**Epoch: One complete traversal of the full training dataset.** " +
          "Track model training duration and generalization milestones in units of epochs, " +
          "where one epoch corresponds to $\\lceil N / B \\rceil$ mini-batch updates."
      },

      num: {
        t: "Epoch dynamics, dataset traversal & learning curve tracking",
        h: ["Metric / Event", "Mathematical Definition", "Significance in Training Dynamics"],
        r: [
          ["**Steps per Epoch**", "$S = \\lceil N / B \\rceil$", "Number of gradient update iterations required to sweep $N$ samples with batch size $B$"],
          ["**Dataset Reshuffling**", "Permute index array: $\\pi = \\text{shuffle}([1, \\dots, N])$", "Mandatory at epoch boundaries to prevent cyclical gradient oscillations"],
          ["**Validation Evaluation**", "Run inference on untouched test split at epoch end", "Detects the exact onset of overfitting when validation loss begins rising"],
          ["**Learning Rate Schedule Decay**", "$\\eta_{e} = \\eta_0 \\cdot \\gamma^e$ or Cosine Annealing", "Steps down learning rate at predefined epoch milestones"],
          ["**Early Stopping Threshold**", "Triggered when $\\mathcal{L}_{\\text{val}}$ fails to improve for $P$ epochs", "Halts training automatically at peak generalization checkpoint"]
        ],
        n: "An epoch marks the completion of one full cycle through all $N$ training " +
          "examples. Because modern neural networks are trained via mini-batch stochastic gradient " +
          "descent with batch size $B$, a single epoch consists of $S = \\lceil N / B \\rceil$ " +
          "distinct parameter update iterations. At the beginning of each epoch, the dataset " +
          "**must be randomly reshuffled** (`shuffle=True` in PyTorch's `DataLoader`). Failing to " +
          "shuffle causes the network to see the exact same sequences of mini-batches every epoch, " +
          "inducing pathological cyclical oscillations and harmonic traps in the optimizer's momentum buffers. " +
          "Epoch boundaries are the canonical synchronization points in MLOps pipelines: validation loss " +
          "and accuracy are evaluated across held-out test splits, model checkpoints are serialized to disk, " +
          "and learning rate schedulers (like Cosine Annealing or StepLR) update learning rates based on " +
          "the epoch index. The divergence between the training loss curve and the validation loss curve " +
          "across epochs is the primary diagnostic used to diagnose underfitting versus overfitting."
      },

      miss: [
        {
          w: "Training for more epochs always improves the performance of a neural network.",
          r: "Training for too many epochs leads to severe overfitting: training loss continues to drop toward zero as the network memorizes noise, while out-of-sample validation loss skyrockets."
        },
        {
          w: "One epoch equals one model weight update iteration.",
          r: "One epoch equals $\\lceil N / B \\rceil$ iterations. If a dataset has 1,000,000 samples and batch size is 100, one epoch consists of 10,000 parameter update iterations."
        },
        {
          w: "Dataset reshuffling at the start of each epoch is an optional optimization.",
          r: "Shuffling is mathematically essential for stochastic gradient descent; without it, batches exhibit identical variance patterns, causing optimizer momentum to settle into deterministic limit cycles."
        },
        {
          w: "Modern LLMs are trained for hundreds of epochs like computer vision models.",
          r: "Frontier LLMs (GPT-4, Llama 3) are trained for only 1 to 2 epochs over multi-trillion token corpora, because training multi-epoch on text rapidly induces memorization and performance degradation."
        }
      ],

      trade: {
        buys: [
          "Standardized temporal unit for scheduling learning rate decay, checkpointing, and validation evaluations.",
          "Guarantees that every training sample has exerted equal expected influence on the model's parameters.",
          "Clear visual diagnostic: plotting train vs validation loss across epochs reveals the onset of overfitting."
        ],
        costs: [
          "Meaningless for streaming or infinite synthetic datasets where data never repeats.",
          "Training for excessive epochs wastes costly GPU compute and degrades out-of-domain generalization.",
          "Dataset reshuffling across millions of multi-modal files can create disk I/O bottlenecks if un-cached."
        ],
        avoid: [
          "Disabling `shuffle=True` in production training `DataLoader` configurations.",
          "Continuing training past the point where validation loss has been rising for multiple consecutive epochs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "batch-size",

      why: {
        before: "Optimization strictly oscillated between Batch Gradient Descent (loading the entire multi-gigabyte dataset into memory) " +
          "and Pure Stochastic Gradient Descent (updating weights after every single sample, running slowly on hardware).",
        problem: "Full-batch GD requires impossible amounts of RAM and gets trapped in saddle points, " +
          "while pure SGD ($B=1$) cannot utilize SIMD hardware parallelism on modern GPUs.",
        shift: "**Mini-Batch Gradient Descent: Balancing stochastic gradient noise and SIMD parallelism.** " +
          "Group training samples into small batches of size $B \\in [16, 2048]$, achieving high GPU hardware occupancy " +
          "while injecting sufficient stochastic sampling noise to escape sharp local minima."
      },

      num: {
        t: "Batch size scaling dynamics, generalization & hardware alignment",
        h: ["Batch Size Regime", "Typical Size ($B$)", "GPU Compute Efficiency", "Generalization & Optimization Behavior"],
        r: [
          ["**Pure SGD**", "$B = 1$", "Abysmal: memory bandwidth bound, zero tensor core utilization", "High stochastic noise; acts as strong regularizer but training is glacial"],
          ["**Small Mini-Batch**", "$B = 32 - 128$", "Good: moderate tensor core saturation", "**Superior generalization**: stochastic noise escapes sharp minima; standard default"],
          ["**Large Mini-Batch**", "$B = 512 - 8192$", "Optimal: maximum memory bandwidth & GPU utilization", "Prone to sharp minima; requires **Linear Learning Rate Scaling** ($\\eta \\propto B$)"],
          ["**Hardware Multiples**", "$B \\pmod{8} = 0$ or $16$", "**Maximum speedup via Tensor Cores**", "Non-power-of-two batches incur massive padding and memory alignment penalties"],
          ["**Linear Scaling Rule**", "$\\eta_{\\text{new}} = \\eta_{\\text{base}} \\cdot \\frac{B_{\\text{new}}}{B_{\\text{base}}}$", "Goyal et al. (2017) scaling theorem", "Required to maintain stable gradient step magnitudes when scaling batch size"]
        ],
        n: "The choice of batch size $B$ dictates the fundamental trade-off between " +
          "**computational efficiency** and **generalization performance**. From a hardware " +
          "perspective, GPUs execute matrix multiplications (GEMM) using thousands of parallel " +
          "cores; choosing batch sizes that are multiples of 8, 16, or 32 aligns with GPU warp " +
          "and Tensor Core tile dimensions, maximizing arithmetic intensity and memory bandwidth. " +
          "From a statistical perspective, the gradient of a mini-batch is an unbiased estimate " +
          "of the true population gradient, with variance inversely proportional to batch size: " +
          "$\\text{Var}(\\nabla \\mathcal{L}_B) \\propto \\frac{\\sigma^2}{B}$. " +
          "**Small batch sizes** ($B = 32-128$) introduce beneficial gradient noise that continuously " +
          "knocks the parameters out of narrow, sharp local minima, guiding optimization toward **flat minima** " +
          "that exhibit superior generalization (Keskar et al. 2016). When scaling to **large batch sizes** " +
          "(e.g. $B = 8192$ in distributed data-parallel training), practitioners must apply the " +
          "**Linear Scaling Rule** (Goyal et al. 2017): scale the learning rate proportionally " +
          "$\\eta \\propto B$ and introduce **gradual learning rate warmup** to prevent early optimization instability."
      },

      miss: [
        {
          w: "Using the largest batch size that fits in GPU memory is always optimal.",
          r: "While massive batch sizes maximize GPU utilization, they drastically reduce stochastic gradient noise, frequently trapping models in sharp minima that generalize poorly to test data."
        },
        {
          w: "Batch size has no relationship with the optimal learning rate.",
          r: "Larger batch sizes require larger learning rates (e.g. linear or square-root scaling) and warmup schedules; keeping the learning rate constant while increasing batch size causes severe underfitting."
        },
        {
          w: "Batch size can be set to any arbitrary integer, like 37 or 93.",
          r: "Modern GPUs process threads in warps of 32. Non-power-of-two batch sizes cause severe thread divergence and unaligned memory access, running significantly slower than larger aligned batches (e.g. 64 or 128)."
        },
        {
          w: "Gradient Accumulation is mathematically inferior to true large batch sizes.",
          r: "Accumulating gradients over $K$ forward/backward passes before calling `optimizer.step()` is mathematically identical to a true batch size of $K \\times B$ (except for small BatchNorm statistics differences)."
        }
      ],

      trade: {
        buys: [
          "Saturates GPU SIMD parallelism and Tensor Cores, maximizing hardware training throughput.",
          "Tunable stochastic noise: small batches naturally regularize models and find flatter, more robust minima.",
          "Gradient accumulation allows simulating arbitrarily large batch sizes even on memory-constrained consumer GPUs."
        ],
        costs: [
          "Excessively large batches degrade generalization without specialized warmup and optimizer scaling (LARS, LAMB).",
          "Excessively small batches underutilize GPU computing power, leaving tensor cores idle.",
          "Altering batch size necessitates re-tuning learning rates, weight decay, and normalization statistics."
        ],
        avoid: [
          "Using batch sizes that are not multiples of 8 or 16 on modern Nvidia GPUs.",
          "Increasing batch size by 8x without scaling the learning rate and adding a learning rate warmup phase."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "iteration",

      why: {
        before: "Machine learning workflows measured training progress purely in epochs, " +
          "which obscured fine-grained step-by-step optimizer dynamics on massive or streaming datasets.",
        problem: "In web-scale training (terabytes of text or video), waiting an entire epoch to log metrics, " +
          "decay learning rates, or save checkpoints takes days or weeks.",
        shift: "**Iteration (Optimization Step): A single mini-batch forward-backward-update cycle.** " +
          "Measure computational throughput and schedule optimizer state transitions at the atomic level of single iterations, " +
          "where one iteration processes $B$ samples and executes a single parameter update."
      },

      num: {
        t: "Iteration lifecycle, computational throughput & memory metrics",
        h: ["Phase / Metric", "Mathematical / Architectural Operation", "Primary Hardware Bottleneck"],
        r: [
          ["**1. Forward Pass**", "Computes activations $a^{[l]}$ and loss $\\mathcal{L}$", "Compute & Memory Bandwidth (GEMM)"],
          ["**2. Backward Pass**", "Computes gradients $\\nabla_W \\mathcal{L}$ via reverse autograd", "Compute Bound (approx $2\\times$ forward FLOPs)"],
          ["**3. Gradient Synchronization**", "`AllReduce` sum across distributed GPU workers", "**Inter-node Network Bandwidth** (InfiniBand / NVLink)"],
          ["**4. Optimizer Step**", "$W \\leftarrow W - \\eta \\cdot m_t / (\\sqrt{v_t} + \\epsilon)$", "GPU Memory Bandwidth (streaming weights from VRAM)"],
          ["**Throughput Metric**", "**TFLOPS, Samples/sec, Tokens/sec**", "Hardware benchmarking efficiency vs theoretical peak"]
        ],
        n: "An iteration (also termed an optimization **step**) is the fundamental " +
          "atomic heartbeat of neural network training. Exactly one iteration consists " +
          "of four discrete sequential stages: (1) extracting a mini-batch of size $B$ from disk/RAM, " +
          "(2) executing the **Forward Pass** to evaluate predictions and compute scalar loss $\\mathcal{L}$, " +
          "(3) executing the **Backward Pass** to propagate sensitivities and compute parameter gradients $\\nabla_\\theta \\mathcal{L}$, " +
          "and (4) executing the **Optimizer Step** (`optimizer.step()`), which modifies the weights " +
          "according to the optimization algorithm (e.g. Adam, SGD). In modern distributed training " +
          "(such as training Large Language Models across thousands of GPUs), training lifecycles " +
          "are parameterized entirely in **iterations rather than epochs** (e.g., 'train for 500,000 steps'). " +
          "Learning rate schedules (such as linear warmup followed by cosine decay) update their values " +
          "after every single iteration, ensuring smooth, continuous parameter trajectory optimization " +
          "without coarse epoch boundary shocks."
      },

      miss: [
        {
          w: "An iteration and an epoch are synonymous terms.",
          r: "An iteration processes a single mini-batch and updates parameters once. An epoch processes the entire dataset, consisting of $\\lceil N / B \\rceil$ individual iterations."
        },
        {
          w: "Calling `optimizer.step()` automatically clears the gradients for the next iteration.",
          r: "In PyTorch, gradients accumulate by default (`grad += new_grad`). You must explicitly call `optimizer.zero_grad()` at the start of each iteration to prevent previous gradients from corrupting the new step."
        },
        {
          w: "Hardware throughput is best measured by seconds per epoch.",
          r: "Epoch time depends on dataset size; throughput is strictly measured in iterations per second, samples per second, or tokens per second to provide objective hardware utilization comparisons."
        },
        {
          w: "Gradient accumulation increases the number of iterations required to finish training.",
          r: "Gradient accumulation executes multiple forward/backward passes before calling one optimizer step, reducing optimizer update frequency while maintaining mathematically identical effective batch sizes."
        }
      ],

      trade: {
        buys: [
          "Fine-grained control over learning rate warmup, decay, logging, and evaluation metrics.",
          "Essential metric for web-scale and streaming datasets where training never completes a full epoch.",
          "Enables Gradient Accumulation: decouple physical GPU memory limits from target mathematical batch sizes."
        ],
        costs: [
          "Excessively frequent metric logging (e.g. every single step) creates severe CPU-GPU synchronization bottlenecks.",
          "Accumulating gradients across iterations increases latency between parameter updates.",
          "Requires strict vigilance to zero gradients (`zero_grad()`) between iterations to prevent gradient pollution."
        ],
        avoid: [
          "Forgetting to call `optimizer.zero_grad()` at the beginning or end of each iteration loop.",
          "Logging scalar metrics to disk on every single iteration (log every 50-100 steps instead to avoid I/O bottlenecks)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
