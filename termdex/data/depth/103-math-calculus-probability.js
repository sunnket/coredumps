/* ==========================================================================
   Depth pass 103 — Mathematics & Statistics batch 2: Multivariable Calculus & Probability Foundations.
   Partial Derivative, Gradient, Chain Rule, Probability,
   Conditional Probability, Bayes Theorem, Random Variable.

   Directional partial gradients span the tangent hyperplane of the loss manifold;
   Bayesian inversions update subjective epistemic posteriors via empirical likelihood evidence.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "partial-derivative",

      why: {
        before: "Single-variable calculus could compute the rate of change of a function with respect to a single isolated input, but failed completely when modeling real-world systems with thousands of simultaneously interacting variables.",
        problem: "In a neural network with 100 million weights, altering weight $W_{3,5}$ changes the output loss; we need a mathematical tool to isolate the specific sensitivity of the loss with respect to $W_{3,5}$ while treating all other 99,999,999 weights as fixed constants.",
        shift: "**Partial Derivative: The derivative of a multivariable function with respect to one single variable, holding all other independent variables strictly constant as fixed parameters ($\\frac{\\partial f}{\\partial x_i}$).** The fundamental mathematical building block of multivariable gradients, Hessians, and backpropagation."
      },

      num: {
        t: "Multivariable Differential Operators Derived from Partial Derivatives",
        h: ["Differential Operator", "Mathematical Definition", "Tensor Order / Shape", "Geometric Meaning", "Machine Learning Role"],
        r: [
          ["Partial Derivative", "$\\frac{\\partial f}{\\partial x_i} = \\lim_{h \\to 0} \\frac{f(x + h e_i) - f(x)}{h}$", "Scalar (0D)", "Slope along one canonical coordinate axis", "Individual parameter sensitivity"],
          ["Gradient ($\\nabla f$)", "$[\\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n}]^T$", "Vector (1D $\\in \\mathbb{R}^n$)", "Direction of steepest steepest instantaneous ascent", "First-order optimization (SGD, Adam)"],
          ["Jacobian Matrix ($J$)", "$J_{i,j} = \\frac{\\partial f_i}{\\partial x_j}$ for $f: \\mathbb{R}^n \\rightarrow \\mathbb{R}^m$", "Matrix (2D $\\in \\mathbb{R}^{m \\times n}$)", "Linear best approximation of vector-valued map", "Vector-Jacobian Products (VJP) in PyTorch Autograd"],
          ["Hessian Matrix ($H$)", "$H_{i,j} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$ for $f: \\mathbb{R}^n \\rightarrow \\mathbb{R}$", "Matrix (2D $\\in \\mathbb{R}^{n \\times n}$)", "Local surface curvature and concavity", "Second-order optimization (Newton's method, L-BFGS)"]
        ],
        n: "For a function of $n$ variables $f(x_1, x_2, \\dots, x_n)$, the partial derivative with respect to $x_i$ is defined by the limit: $\\frac{\\partial f}{\\partial x_i} = \\lim_{h \\to 0} \\frac{f(x_1, \\dots, x_i + h, \\dots, x_n) - f(x_1, \\dots, x_i, \\dots, x_n)}{h}$. Geometrically, if you slice the multidimensional surface of $f$ with a vertical plane parallel to the $x_i$ coordinate axis, the partial derivative $\\frac{\\partial f}{\\partial x_i}$ is the standard 2D slope of the tangent line to the resulting trace curve. Under **Clairaut's Theorem (Schwarz's Theorem)**, if the second-order partial derivatives are continuous, mixed partial derivatives are strictly symmetric: $\\frac{\\partial^2 f}{\\partial x_i \\partial x_j} = \\frac{\\partial^2 f}{\\partial x_j \\partial x_i}$, guaranteeing that the Hessian curvature matrix is always symmetric."
      },

      miss: [
        {
          w: "A partial derivative measures how a function changes when all variables change together.",
          r: "A partial derivative holds **all other variables strictly fixed as constants**, measuring sensitivity along exactly one coordinate axis. The rate of change when all variables change simultaneously along an arbitrary unit vector $v$ is the **Directional Derivative**: $D_v f = \\nabla f \\cdot v$."
        },
        {
          w: "The symbol $\\partial$ (curly d) is just an italicized stylistic font for standard $d$.",
          r: "The symbol $\\partial$ is mathematically distinct from total differential $d$. $\\frac{df}{dx}$ denotes a total derivative where other variables may implicitly depend on $x$, whereas $\\frac{\\partial f}{\\partial x}$ explicitly assumes other variables are held fixed."
        },
        {
          w: "Computing partial derivatives for 1,000 parameters requires running 1,000 separate forward passes.",
          r: "This is true only for numerical finite differences. In deep learning, **Reverse-Mode Automatic Differentiation (Backpropagation)** calculates the partial derivatives of the scalar loss with respect to all 1,000 parameters simultaneously in a single reverse pass."
        },
        {
          w: "If all partial derivatives of a function exist at a point, the function is guaranteed to be continuous.",
          r: "Counter-intuitively, a multivariable function can have well-defined partial derivatives along coordinate axes at the origin while being wildly discontinuous along diagonal trajectories ($y = x$). Full **Differentiability** requires all directional derivatives to form a continuous linear map."
        }
      ],

      trade: {
        buys: [
          "Isolates individual parameter contributions: tells the optimizer exactly how much adjusting one weight affects loss.",
          "Core component of gradients, Jacobians, and Hessians that drive all scientific optimization algorithms.",
          "Clairaut's symmetry halves the computational burden of calculating second-order Hessian curvature matrices.",
          "Powers backpropagation: enables calculating analytical parameter sensitivities through recursive chain rule composition."
        ],
        costs: [
          "Curse of dimensionality: a model with $N$ parameters has an $N$-dimensional gradient vector and an $N \\times N$ Hessian matrix.",
          "Hessian matrix explosion: storing the second-order partial derivatives for a 1B parameter LLM requires $10^{18}$ floats (exabytes of RAM).",
          "Coordinate-axis dependency: partial derivatives are tied to chosen basis axes, failing to capture diagonal interactions directly.",
          "Vanishing partials: deep activation saturations (sigmoid/tanh) cause partial derivatives to approach zero, halting training."
        ],
        avoid: [
          "Never calculate the full second-order Hessian matrix explicitly for deep networks; use Hessian-free or quasi-Newton (L-BFGS) methods.",
          "Do not confuse total derivatives with partial derivatives when downstream variables have implicit dependencies.",
          "Avoid saturated activation functions that drive partial derivatives to zero across early network layers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gradient",

      why: {
        before: "Optimizing multi-dimensional functions required evaluating trial steps in random directions or updating parameters along coordinate axes one by one (coordinate descent), which zig-zagged inefficiently and failed on diagonal ravines.",
        problem: "In an $N$-dimensional parameter space, there are infinite possible directions to step; finding which direction reduces error the fastest without evaluating all possibilities is a foundational challenge.",
        shift: "**Gradient ($\\nabla f$): A vector operator that packages all first-order partial derivatives of a scalar multivariable function into a single vector ($[\\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n}]^T$).** Points in the direction of greatest rate of increase of the function, with magnitude equal to that rate of increase."
      },

      num: {
        t: "Gradient-Based Optimization Trajectories & Convergence Properties",
        h: ["Algorithm", "Gradient Formulation / Update Rule", "Directional Geometry", "Memory Overhead", "Convergence Rate (Convex)"],
        r: [
          ["Standard Gradient Descent (GD)", "$w_{t+1} = w_t - \\eta \\nabla f(w_t)$", "Steepest descent perpendicular to contour lines", "$O(N)$ (parameters only)", "Linear convergence: $O(1/t)$"],
          ["Polyak Momentum", "$v_{t+1} = \\beta v_t + \\nabla f(w_t)$, $w_{t+1} = w_t - \\eta v_{t+1}$", "Exponentially decaying moving average of past gradients", "$2N$ (parameters + velocity)", "Accelerated Nesterov: $O(1/t^2)$"],
          ["RMSProp", "$s_t = \\beta s_{t-1} + (1-\\beta) (\\nabla f)^2$, $w_{t+1} = w_t - \\frac{\\eta}{\\sqrt{s_t + \\epsilon}} \\nabla f$", "Rescales gradient independently per coordinate", "$2N$ (parameters + variance)", "Adapts step size to local gradient scale"],
          ["Adam (Kingma & Ba 2014)", "$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$, $v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2$", "Combines momentum and coordinate-wise RMS scaling", "$3N$ (parameters + 1st/2nd moments)", "Gold standard for deep learning / transformers"],
          ["Newton's Method (2nd-Order)", "$w_{t+1} = w_t - [H(w_t)]^{-1} \\nabla f(w_t)$", "Points directly to quadratic minimum via curvature", "$O(N^2)$ (Hessian matrix)", "Quadratic convergence: $O(1/2^t)$"]
        ],
        n: "For a continuously differentiable scalar field $f: \\mathbb{R}^n \\rightarrow \\mathbb{R}$, the gradient vector $\\nabla f(x)$ is defined as: $\\nabla f(x) = \\left[ \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]^T$. The gradient exhibits two fundamental geometric properties: (1) **Steepest Ascent**: For any unit vector $u$, the directional derivative is $D_u f = \\nabla f \\cdot u = \\|\\nabla f\\| \\cos \\theta$, which achieves its absolute maximum when $\\theta = 0$ ($u$ points in the exact direction of $\\nabla f$). Consequently, $-\\nabla f$ is the direction of **Steepest Descent**. (2) **Orthogonality to Level Sets**: The gradient vector at any point is strictly perpendicular (normal) to the level surface (contour line) passing through that point. Gradient descent updates weights in the negative gradient direction: $w_{t+1} = w_t - \\eta \\nabla \\mathcal{L}(w_t)$."
      },

      miss: [
        {
          w: "The gradient always points directly at the global minimum of the loss function.",
          r: "The gradient is a strictly **local** operator: it points in the direction of steepest instantaneous slope at the current infinitesimal coordinate. On non-convex loss surfaces, following the gradient leads to local minima, saddle points, or plateaus."
        },
        {
          w: "Gradient descent moves in a straight line toward the minimum.",
          r: "Because the gradient is always perpendicular to contour lines, in narrow, elongated valleys (ill-conditioned loss landscapes), standard gradient descent oscillates wildly back and forth across steep walls while making negligible progress along the base. Momentum and adaptive optimizers (Adam) are required."
        },
        {
          w: "A gradient magnitude of zero ($\\nabla f = \\mathbf{0}$) proves the model has reached optimal weights.",
          r: "$\\nabla f = \\mathbf{0}$ defines a **Stationary Point**. In high dimensions, the vast majority of stationary points are **Saddle Points** (where some directions curve upward and others curve downward) or local maxima, not true local minima."
        },
        {
          w: "The gradient has the same mathematical dimensions as the input data points.",
          r: "The gradient $\\nabla_w \\mathcal{L}$ has the exact same dimensions as the **model parameters $w$**, NOT the input data. If a model has 7 billion parameters, its gradient is a 7-billion-dimensional vector."
        }
      ],

      trade: {
        buys: [
          "The engine of machine learning: provides the mathematically optimal direction to reduce loss at every training step.",
          "Scales to billions of parameters: reverse-mode automatic differentiation computes gradients with $O(1)$ overhead.",
          "Smooth continuous optimization: drives weights across complex loss landscapes toward low empirical error.",
          "Orthogonality to level sets enables geometric projection methods (e.g., Projected Gradient Descent for constraints)."
        ],
        costs: [
          "Vanishing and exploding gradients: gradients can shrink to zero or explode to infinity across deep neural networks.",
          "Vulnerable to local minima and saddle points on non-convex optimization surfaces.",
          "Sensitive to learning rate hyperparameter ($\\eta$): setting it too high causes divergence; setting it too low stalls training.",
          "Stochastic noise: Mini-batch estimation introduces gradient variance that requires adaptive momentum dampening."
        ],
        avoid: [
          "Never execute gradient descent without tuning or scheduling the learning rate (e.g., Cosine Annealing with Warmup).",
          "Do not use plain SGD on ill-conditioned loss surfaces without momentum or adaptive moment estimation (AdamW).",
          "Avoid unbounded gradient norm accumulation; implement gradient clipping (`clip_grad_norm_`) to prevent training divergence."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "chain-rule",

      why: {
        before: "Calculating the derivative of a multi-stage composite function required algebraically expanding the entire formula into a single massive expression before differentiating, causing symbolic expression explosion.",
        problem: "Deep neural networks are compositions of dozens to hundreds of nested functions: $y = f_L(f_{L-1}(\\dots f_1(x) \\dots))$; computing analytical derivatives of the loss with respect to early layer weights without a recursive decomposition is mathematically impossible.",
        shift: "**Chain Rule: The fundamental calculus theorem that computes the derivative of a composite function by multiplying the derivatives of its constituent sub-functions: $\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx}$.** The foundational mathematical law that makes neural network backpropagation possible."
      },

      num: {
        t: "Chain Rule Traversal: Scalar Calculus vs Multivariate Tensor Backpropagation",
        h: ["Formulation", "Mathematical Function", "Chain Rule Formula", "Computational Direction", "Machine Learning Role"],
        r: [
          ["Univariate Scalar", "$z = g(y)$, $y = f(x)$", "$\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx}$", "Single scalar product", "Introductory calculus baseline"],
          ["Multivariate Scalar", "$z = f(x_1, \\dots, x_n)$ where $x_i = g_i(t)$", "$\\frac{dz}{dt} = \\sum_{i=1}^n \\frac{\\partial z}{\\partial x_i} \\frac{dx_i}{dt}$", "Sum over all dependency paths", "Total derivative with multiple intermediary branches"],
          ["Vector-to-Vector (Forward)", "$z = g(y) \\in \\mathbb{R}^p$, $y = f(x) \\in \\mathbb{R}^m$", "$J_{z}(x) = J_g(y) \\cdot J_f(x)$", "Left-to-right matrix multiplication", "Forward-mode Automatic Differentiation (Dual Numbers)"],
          ["Reverse-Mode (Backprop)", "Scalar Loss $L$, hidden $h$, weights $W$", "$\\frac{\\partial L}{\\partial W} = \\left( \\frac{\\partial h}{\\partial W} \\right)^T \\frac{\\partial L}{\\partial h}$", "Right-to-left vector-Jacobian products (VJP)", "Standard Deep Learning Backpropagation (PyTorch)"]
        ],
        n: "The Chain Rule governs the differentiation of composite functions. For scalar functions $y = f(u)$ and $u = g(x)$, the rate of change is multiplicative: $\\frac{dy}{dx} = \\frac{dy}{du} \\frac{du}{dx}$. In multivariable deep learning, where a scalar loss $\\mathcal{L}$ depends on an intermediate vector $h \\in \\mathbb{R}^m$, which depends on weight matrix $W \\in \\mathbb{R}^{m \\times n}$, the chain rule sums over all intermediate paths: $\\frac{\\partial \\mathcal{L}}{\\partial W_{i,j}} = \\sum_{k=1}^m \\frac{\\partial \\mathcal{L}}{\\partial h_k} \\frac{\\partial h_k}{\\partial W_{i,j}}$. In vector notation, this evaluates to **Vector-Jacobian Products (VJPs)**: $\\delta_x = J_f^T \\delta_y$. Crucially, by traversing the computational graph in **reverse order (from loss back to inputs)**, the chain rule multiplies a $1 \\times m$ vector by an $m \\times n$ Jacobian, executing in cheap vector-matrix multiplications ($O(m n)$) and avoiding expensive $O(m^2 n)$ matrix-matrix multiplies."
      },

      miss: [
        {
          w: "Backpropagation is a completely new machine learning algorithm invented in the 1980s.",
          r: "Backpropagation is mathematically nothing more than the **multivariable chain rule** evaluated in reverse topological order, caching intermediate forward-pass activations in memory for reuse during the backward pass."
        },
        {
          w: "Evaluating the chain rule from left-to-right (input to output) is just as fast as right-to-left.",
          r: "Forward accumulation computes Jacobian-matrix products: for $N$ parameters and 1 loss output, forward-mode requires $N$ forward sweeps. Reverse accumulation (right-to-left) computes Vector-Jacobian products, evaluating gradients for all $N$ parameters in a **single reverse sweep**."
        },
        {
          w: "The chain rule allows gradients to propagate infinitely deep without numerical issues.",
          r: "Because the chain rule multiplies derivatives together across $L$ layers: $\\prod_{l=1}^L W_l$, if individual layer derivatives are $< 1$, the gradient decays exponentially to zero (**Vanishing Gradient**). If derivatives are $> 1$, gradients explode exponentially (**Exploding Gradient**)."
        },
        {
          w: "Branching computational graphs with multiple paths require running backprop multiple times.",
          r: "Under the multivariate chain rule, when a node's output splits into multiple branches (e.g., residual skip connections), the gradients returning from all downstream branches are simply **summed together** at that node: $\\frac{\\partial \\mathcal{L}}{\\partial x} = \\sum_{i} \\frac{\\partial \\mathcal{L}}{\\partial y_i} \\frac{\\partial y_i}{\\partial x}$."
        }
      ],

      trade: {
        buys: [
          "Enables end-to-end differentiable learning: trains deep neural networks with hundreds of layers simultaneously.",
          "Reverse-mode evaluation reduces computational complexity from $O(N)$ forward passes to a single $O(1)$ backward pass.",
          "Naturally handles branching computational graphs: gradients across split paths sum linearly.",
          "Modular software design: each neural layer needs only implement its local forward function and its local VJP backward method."
        ],
        costs: [
          "Memory bottleneck: intermediate forward-pass activations must be retained in RAM/VRAM to compute the backward chain rule.",
          "Exponential numerical degradation: chain multiplications trigger vanishing or exploding gradients in deep networks.",
          "Requires strict differentiability: cannot propagate gradients through non-differentiable discrete operations.",
          "High memory traffic during training: backprop requires continuous reads and writes across GPU high-bandwidth memory (HBM)."
        ],
        avoid: [
          "Never evaluate long composite chains without residual connections or normalization layers to prevent vanishing gradients.",
          "Do not implement manual analytical derivatives for complex architectures; use automated autograd engines.",
          "Avoid caching unnecessary intermediate tensors in PyTorch without calling `.detach()` when gradients are not needed."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "probability",

      why: {
        before: "Classical computer science and formal logic operated on deterministic Boolean binary states (True or False), leaving systems completely unable to reason under incomplete information, noisy sensor measurements, or real-world randomness.",
        problem: "Real-world environments are inherently uncertain, stochastic, and partially observable; automated systems need a mathematically rigorous framework to quantify, model, and reason about uncertainty.",
        shift: "**Probability: The branch of mathematics that formalizes the quantification of uncertainty, likelihood, and chance.** Axiomatized by Andrey Kolmogorov in 1933, serving as the foundational language of statistical inference, machine learning, and decision theory."
      },

      num: {
        t: "Probability Axioms & Fundamental Rules of Mathematical Reasoning",
        h: ["Axiom / Law", "Mathematical Formulation", "Physical Meaning", "Operational Constraint", "Violations Trigger"],
        r: [
          ["Non-negativity (Axiom 1)", "$P(E) \\ge 0$ for all events $E \\subseteq \\Omega$", "Probabilities cannot be negative", "Lower-bounded by zero", "Nonsensical negative likelihoods"],
          ["Unitarity / Normalization (Axiom 2)", "$P(\\Omega) = 1$", "The certainty of the entire sample space is 1", "Sum of all mutually exclusive events must equal 1", "Uncalibrated models / probability leaks"],
          ["Countable Additivity (Axiom 3)", "$P\\left(\\bigcup_{i=1}^\\infty E_i\\right) = \\sum_{i=1}^\\infty P(E_i)$ for disjoint $E_i$", "Union of mutually exclusive events equals the sum of probabilities", "Mutual exclusivity ($E_i \\cap E_j = \\emptyset$)", "Double-counting overlapping event likelihoods"],
          ["Complement Rule", "$P(A^c) = 1 - P(A)$", "Probability of an event not occurring", "Derived from Axioms 2 and 3", "Inconsistent risk assessments"],
          ["Addition Law", "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$", "Probability of $A$ or $B$ occurring", "Subtracts the intersection to avoid double-counting", "Inclusion-exclusion errors"]
        ],
        n: "Modern probability is founded on **Kolmogorov's Probability Space** triple: $(\\Omega, \\mathcal{F}, P)$, where $\\Omega$ is the **Sample Space** (all possible outcomes), $\\mathcal{F}$ is a $\\sigma$-algebra of events (subsets of $\\Omega$ closed under complements and countable unions), and $P: \\mathcal{F} \\rightarrow [0, 1]$ is a probability measure satisfying Kolmogorov's three axioms. Probability bifurcates into two major philosophical interpretations: (1) **Frequentist**: Probability represents the long-run relative frequency of an event in an infinite sequence of identical, repeatable trials: $P(A) = \\lim_{N \\to \\infty} \\frac{n_A}{N}$. (2) **Bayesian**: Probability represents a subjective degree of belief or epistemic confidence given incomplete evidence: $P(\\theta \\mid D)$, updated continuously as new observations arrive."
      },

      miss: [
        {
          w: "A probability of 0 means the event is physically impossible.",
          r: "In continuous probability spaces (e.g., picking a real number between 0 and 1), the probability of picking any exact individual number (such as $0.5000...$) is mathematically $P(X = 0.5) = 0$, yet the event is not impossible (it is in the sample space). Probability 0 events occur continuously in continuous distributions."
        },
        {
          w: "Probabilities of multiple events can simply be multiplied together ($P(A \\cap B) = P(A) P(B)$).",
          r: "Multiplying probabilities directly is valid **only if the events are strictly statistically independent**. If events are dependent, the correct formula is $P(A \\cap B) = P(A \\mid B) P(B)$."
        },
        {
          w: "A neural network's softmax output is a true Bayesian probability.",
          r: "Softmax outputs sum to 1.0, but standard neural networks are notoriously **miscalibrated and overconfident**, outputting 99% probability on inputs they have never seen before. True probability calibration requires temperature scaling or conformal prediction."
        },
        {
          w: "Frequentist and Bayesian probability methods always produce identical results.",
          r: "Frequentists treat parameters $\\theta$ as fixed, unknown constants and data as random. Bayesians treat parameters $\\theta$ as random variables with prior distributions and observed data as fixed. On small datasets, Bayesian results depend heavily on chosen prior distributions."
        }
      ],

      trade: {
        buys: [
          "Provides a mathematically rigorous framework for reasoning under uncertainty, noise, and incomplete data.",
          "Foundational engine of modern generative AI: models learn probability distributions $P_{\\text{data}}(x)$ over text and images.",
          "Enables risk-calibrated decision-making in autonomous driving, algorithmic trading, and medical diagnosis.",
          "Unifies classification, regression, and clustering under the formal framework of Maximum Likelihood Estimation."
        ],
        costs: [
          "Cognitive complexity: human intuition is notoriously bad at evaluating probability, suffering from cognitive biases.",
          "Calibration difficulty: training models to output well-calibrated probabilities requires specialized loss functions.",
          "Computational complexity: exact Bayesian integration over high-dimensional posterior distributions is analytically intractable.",
          "Prior sensitivity: Bayesian methods can be skewed by poorly chosen subjective prior distributions."
        ],
        avoid: [
          "Never treat raw Softmax output scores as calibrated real-world probabilities without temperature scaling.",
          "Do not multiply probabilities together without mathematically verifying that the events are independent.",
          "Avoid confusing the probability of the data given a hypothesis $P(D \\mid H)$ with the probability of the hypothesis $P(H \\mid D)$."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "conditional-probability",

      why: {
        before: "Statistical analysis evaluated events in isolation using marginal probabilities ($P(A)$), ignoring how the occurrence of one event fundamentally alters the likelihood of another event.",
        problem: "In real-world decision making, events are rarely independent; knowing a patient has a cough drastically changes the probability that they have pneumonia, but classical unconditional probability cannot model this context update.",
        shift: "**Conditional Probability: The probability of an event $A$ occurring given the knowledge that another event $B$ has already occurred ($P(A \\mid B)$).** Defined as $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$ (for $P(B) > 0$), serving as the foundational basis of Bayesian inference, Markov chains, and autoregressive language models."
      },

      num: {
        t: "Probability Relationships: Marginal, Joint & Conditional Formulations",
        h: ["Probability Type", "Mathematical Notation", "Definition / Meaning", "Calculus / Summation Rule", "Machine Learning Role"],
        r: [
          ["Marginal Probability", "$P(A)$", "Unconditional probability of event $A$ occurring alone", "$P(A) = \\sum_{b \\in B} P(A, b)$ (Marginalization)", "Prior class probabilities / base rates"],
          ["Joint Probability", "$P(A, B)$ or $P(A \\cap B)$", "Probability of both event $A$ and event $B$ occurring simultaneously", "$P(A, B) = P(A \\mid B) P(B)$ (Product rule)", "Co-occurrence modeling, multi-modal alignment"],
          ["Conditional Probability", "$P(A \\mid B)$", "Probability of $A$ occurring given that $B$ has occurred", "$P(A \\mid B) = \\frac{P(A, B)}{P(B)}$", "Classification: $P(Y \\mid X)$; Next-token prediction: $P(w_t \\mid w_{<t})$"],
          ["Independence", "$P(A \\mid B) = P(A)$", "Knowledge of $B$ provides zero information about $A$", "$P(A, B) = P(A) P(B)$", "Naive Bayes assumption (conditional independence)"]
        ],
        n: "Conditional probability formalizes the mathematical process of **restricting the sample space**. In unconditional probability, event $A$ is measured against the entire universal sample space $\\Omega$: $P(A) = \\frac{|A|}{|\\Omega|}$. When event $B$ is known to have occurred, the universe of possible outcomes shrinks from $\\Omega$ down to $B$. The only portion of $A$ that can still occur is the intersection $A \\cap B$. Normalizing this new restricted space by dividing by $P(B)$ yields the formal Kolmogorov definition: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$. In modern generative Large Language Models, text generation is purely the sequential computation of conditional probabilities via the chain rule: $P(w_1, w_2, \\dots, w_T) = \\prod_{t=1}^T P(w_t \\mid w_1, \\dots, w_{t-1})$."
      },

      miss: [
        {
          w: "$P(A \\mid B)$ and $P(B \\mid A)$ are identical probabilities.",
          r: "This is the classic **Prosecutor's Fallacy (Confusion of the Inverse)**. $P(\\text{DNA match} \\mid \\text{Innocent})$ is tiny ($0.0001\\%$), but $P(\\text{Innocent} \\mid \\text{DNA match})$ depends heavily on the base rate of the suspect population and can be significant. $P(A \\mid B) \\ne P(B \\mid A)$."
        },
        {
          w: "If $P(A \\mid B) = P(A)$, then events $A$ and $B$ are mutually exclusive.",
          r: "If $P(A \\mid B) = P(A)$, the events are **statistically independent**, meaning knowing $B$ gives zero information about $A$. If they were mutually exclusive, then $P(A \\mid B) = 0$ (if $B$ happened, $A$ cannot happen)."
        },
        {
          w: "Conditional probability implies a physical causal relationship ($B$ caused $A$).",
          r: "Conditional probability measures statistical association, not physical causation. Seeing a wet lawn increases the conditional probability that it rained ($P(\\text{Rain} \\mid \\text{Wet Lawn}) > P(\\text{Rain})$), but a wet lawn does not cause rain (correlation $\\ne$ causation)."
        },
        {
          w: "Conditional probability is undefined if $P(B) = 0$.",
          r: "Under classical Kolmogorov axioms, dividing by zero is undefined. However, in continuous probability spaces where specific point events have probability zero, conditional probability is rigorously defined using the Radon-Nikodym derivative or conditioning on sub-$\\sigma$-algebras."
        }
      ],

      trade: {
        buys: [
          "Enables dynamic context updating: updates risk assessments and predictions as new observations arrive.",
          "Foundational basis of supervised learning: framing classification as estimating $P(Y \\mid X)$.",
          "Drives autoregressive generative models: decomposes joint text sequences into next-token predictions.",
          "Powers Bayesian networks and Markov Decision Processes (MDPs) in reinforcement learning."
        ],
        costs: [
          "Data sparsity: estimating conditional probabilities on rare combinations ($P(A \\cap B)$ tiny) leads to high variance.",
          "Cognitive vulnerability: human intuition routinely confuses conditional inverses ($P(A \\mid B)$ vs $P(B \\mid A)$).",
          "Curse of dimensionality: conditioning on high-dimensional histories ($P(w_t \\mid w_1, \\dots, w_{t-1})$) requires deep foundation models.",
          "Sensitive to sampling bias: if the condition $B$ is unreliably observed, conditional estimates will be skewed."
        ],
        avoid: [
          "Never confuse $P(A \\mid B)$ with $P(B \\mid A)$; always invert conditional probabilities using Bayes' Theorem.",
          "Do not assume features are conditionally independent ($P(X_1, X_2 \\mid Y) = P(X_1 \\mid Y) P(X_2 \\mid Y)$) without testing correlations.",
          "Avoid computing raw empirical conditional frequencies on sparse zero-count bins without smoothing techniques."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bayes-theorem",

      why: {
        before: "Medical diagnostics, criminal forensics, and scientific research knew the probability of observing a symptom given a disease ($P(\\text{Symptom} \\mid \\text{Disease})$), but had no mathematical method to invert the relationship to calculate the actual probability of the disease given the symptom.",
        problem: "Clinicians, engineers, and judges systematically misjudged risk by ignoring background population base rates, confusing the accuracy of a test with the true probability of having the condition.",
        shift: "**Bayes' Theorem: The fundamental mathematical law describing how to update the conditional probability of a hypothesis ($H$) in light of new empirical evidence ($E$): $P(H \\mid E) = \\frac{P(E \\mid H) P(H)}{P(E)}$.** Formulated by Thomas Bayes (1763), serving as the foundational law of Bayesian statistics, machine learning, and rational decision theory."
      },

      num: {
        t: "The Four Core Components of Bayes' Theorem",
        h: ["Component Name", "Mathematical Term", "Epistemic Role / Meaning", "Calculated From", "Medical Diagnosis Example"],
        r: [
          ["Posterior Probability", "$P(H \\mid E)$", "Updated probability of hypothesis AFTER seeing evidence", "The target output of Bayes' Theorem", "Probability patient HAS cancer given a positive mammogram (~10%)"],
          ["Likelihood", "$P(E \\mid H)$", "Probability of observing evidence if hypothesis were true", "Test sensitivity / lab validation", "True Positive Rate: probability mammogram is positive given cancer (90%)"],
          ["Prior Probability", "$P(H)$", "Baseline probability of hypothesis BEFORE new evidence", "Historical epidemiological base rates", "Background disease prevalence in population (e.g. 1%)"],
          ["Marginal Likelihood (Evidence)", "$P(E)$", "Total probability of observing the evidence under all hypotheses", "$\\sum_i P(E \\mid H_i) P(H_i)$ (Law of Total Probability)", "Total probability of receiving a positive test result across everyone (~9.8%)"]
        ],
        n: "Bayes' Theorem is derived directly from the definition of conditional probability: $P(H \\cap E) = P(H \\mid E) P(E) = P(E \\mid H) P(H)$. Dividing by $P(E)$ yields: $P(H \\mid E) = \\frac{P(E \\mid H) P(H)}{P(E)}$. Expanding the denominator using the Law of Total Probability produces the full operational equation: $P(H \\mid E) = \\frac{P(E \\mid H) P(H)}{P(E \\mid H) P(H) + P(E \\mid \\neg H) P(\\neg H)}$. This reveals the classic **Base Rate Fallacy**: if a rare disease affects $1$ in $1,000$ people ($P(H) = 0.001$), and a test has $99\\%$ accuracy ($P(E \\mid H) = 0.99, P(E \\mid \\neg H) = 0.01$), testing positive means your true probability of having the disease is: $P(H \\mid E) = \\frac{0.99 \\times 0.001}{(0.99 \\times 0.001) + (0.01 \\times 0.999)} \\approx \\frac{0.00099}{0.01098} \\approx 9.0\\%$. Despite a 99% accurate test, there is a 91% chance you are completely healthy."
      },

      miss: [
        {
          w: "A medical test with 99% accuracy means testing positive gives you a 99% chance of having the disease.",
          r: "This is the classic **Base Rate Fallacy**. If the disease is rare ($1$ in $1,000$), the false positives from the 99.9% healthy population will dwarf the true positives. The true posterior probability is often under 10%."
        },
        {
          w: "Bayes' Theorem can only be used by subjective Bayesian statisticians.",
          r: "Bayes' Theorem is a proven mathematical identity derived from Kolmogorov axioms. Frequentists use Bayes' Theorem routinely whenever objective prior frequencies $P(H)$ are known from empirical data."
        },
        {
          w: "The Prior Probability $P(H)$ is just an unscientific guess.",
          r: "Priors are typically derived from empirical historical baselines, physical laws, or previous experiments. In iterative learning, today's **Posterior** becomes tomorrow's **Prior** as new data streams in."
        },
        {
          w: "Bayes' Theorem is too simple to be used in modern deep learning.",
          r: "Bayes' Theorem underpins Bayesian Neural Networks (BNNs), Variational Autoencoders (VAEs with ELBO loss), probabilistic diffusion models, and Active Learning uncertainty sampling."
        }
      ],

      trade: {
        buys: [
          "The mathematically optimal framework for updating beliefs in the presence of noisy, incomplete evidence.",
          "Eliminates the Base Rate Fallacy: naturally incorporates background population prevalence into risk analysis.",
          "Sequential learning: updates posteriors iteratively as data arrives in real time without retraining from scratch.",
          "Provides complete predictive uncertainty: outputs a full probability distribution over hypotheses rather than a point estimate."
        ],
        costs: [
          "Denominator intractability: in continuous high-dimensional spaces, computing $P(E) = \\int P(E \\mid \\theta) P(\\theta) d\\theta$ is analytically impossible.",
          "Requires approximate inference: high-dimensional Bayesian models demand costly MCMC sampling or Variational Inference.",
          "Prior sensitivity: choosing an overly strong or misaligned prior can distort posterior inference when data is sparse.",
          "Cognitive barrier: human stakeholders struggle to interpret probabilistic Bayesian intervals compared to binary assertions."
        ],
        avoid: [
          "Never evaluate the meaning of a positive diagnostic test without incorporating the baseline population prior ($P(H)$).",
          "Do not use uniform 'uninformative' priors blindly in high dimensions without verifying they don't introduce implicit biases.",
          "Avoid computing the marginal likelihood integral directly in complex models; use MCMC or variational approximations."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "random-variable",

      why: {
        before: "Probability theory described experimental outcomes using qualitative prose descriptions ('the coin landed heads', 'the dice rolled five'), preventing the application of algebra, calculus, and matrix mathematics to stochastic events.",
        problem: "Computers and mathematical equations operate on real numbers; we need a formal mathematical mapping that translates qualitative, random real-world outcomes into well-defined numerical variables.",
        shift: "**Random Variable: A formal mathematical function that maps the outcomes of a random process in a sample space to measurable real numbers ($X: \\Omega \\rightarrow \\mathbb{R}$).** The fundamental bridge connecting probability theory to calculus, statistics, and machine learning."
      },

      num: {
        t: "Random Variable Classifications: Discrete vs Continuous Mechanics",
        h: ["Dimension", "Discrete Random Variable", "Continuous Random Variable", "Mathematical Distinction"],
        r: [
          ["Range / Codomain", "Countable set of isolated values (finite or countably infinite)", "Uncountable continuous intervals on the real line $\\mathbb{R}$", "Discrete jumps vs smooth continuous support"],
          ["Probability Function", "Probability Mass Function (PMF): $p(x) = P(X = x)$", "Probability Density Function (PDF): $f(x)$", "Points have non-zero mass vs points have zero density mass"],
          ["Normalization Constraint", "$\\sum_{x \\in \\mathcal{X}} p(x) = 1$", "$\\int_{-\\infty}^\\infty f(x) dx = 1$", "Summation over discrete keys vs integration over real line"],
          ["Probability of Single Point", "$P(X = a) = p(a) \\ge 0$", "$P(X = a) = \\int_a^a f(x) dx = 0$", "Individual exact point probability is zero in continuous RVs"],
          ["Interval Probability", "$P(a \\le X \\le b) = \\sum_{x=a}^b p(x)$", "$P(a \\le X \\le b) = \\int_a^b f(x) dx$", "Calculated via Cumulative Distribution Function (CDF)"]
        ],
        n: "Despite its name, a Random Variable is **neither random nor a variable**—it is a deterministic, measurable **function** $X: \\Omega \\rightarrow \\mathbb{R}$ that assigns a real number to each physical outcome $\\omega \\in \\Omega$. For example, when flipping two coins, the sample space is $\\Omega = \\{HH, HT, TH, TT\\}$. A random variable $X$ defined as 'the number of heads' deterministically maps: $X(HH)=2, X(HT)=1, X(TH)=1, X(TT)=0$. Random variables are characterized by their **Cumulative Distribution Function (CDF)**: $F_X(x) = P(X \\le x)$, which is monotonically non-decreasing, right-continuous, and bounded between $0$ and $1$. The CDF completely and uniquely characterizes the probabilistic behavior of any random variable without requiring separate rules for discrete and continuous types."
      },

      miss: [
        {
          w: "A random variable is a variable that randomly changes its value over time.",
          r: "A random variable is a fixed, deterministic **mathematical function** mapping sample space outcomes to the real numbers. The randomness lies in which outcome $\\omega \\in \\Omega$ is realized from the physical experiment, not in the mapping function itself."
        },
        {
          w: "For a continuous random variable, the value of the PDF $f(x)$ represents the probability $P(X = x)$.",
          r: "The value of a Probability Density Function (PDF) $f(x)$ is a **density**, not a probability. In fact, $f(x)$ can exceed $1.0$ (e.g., a uniform distribution on $[0, 0.1]$ has density $f(x) = 10$). The probability of any single exact point in a continuous distribution is strictly $0$."
        },
        {
          w: "If $X$ and $Y$ are random variables, $X + Y$ is just a simple number.",
          r: "The sum of two random variables $Z = X + Y$ is a **new random variable** whose probability distribution is given by the mathematical **convolution** of their individual probability density functions: $f_Z(z) = \\int_{-\\infty}^\\infty f_X(x) f_Y(z - x) dx$."
        },
        {
          w: "A random variable cannot map to negative numbers.",
          r: "The codomain of a random variable is the entire real line $\\mathbb{R}$. Financial returns, temperature deviations, and error residuals are routinely modeled using random variables that take negative real values."
        }
      ],

      trade: {
        buys: [
          "Translates qualitative real-world random events into numerical mathematical entities compatible with linear algebra and calculus.",
          "Enables calculation of summary statistics: Expected Value (mean), Variance, Skewness, and Kurtosis.",
          "The Cumulative Distribution Function (CDF) provides a unified mathematical foundation for both discrete and continuous events.",
          "Forms the core input and output representations for all statistical models and neural network regression targets."
        ],
        costs: [
          "Continuous density counter-intuitiveness: students confuse probability density $f(x)$ with actual probability $P(X=x)$.",
          "Joint distributions scale exponentially: modeling $N$ coupled discrete random variables requires $O(K^N)$ states.",
          "Requires integration: evaluating continuous multi-variable random variables requires multi-dimensional calculus.",
          "Potential for undefined moments: certain random variables (e.g., Cauchy distribution) have undefined means and infinite variance."
        ],
        avoid: [
          "Never interpret the height of a continuous Probability Density Function ($f(x)$) as a probability value.",
          "Do not compute probabilities for continuous random variables without integrating over an interval $[a, b]$.",
          "Avoid assuming that $E[g(X)] = g(E[X])$ unless $g$ is strictly a linear function (Jensen's Inequality)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
