/* ==========================================================================
   Depth pass 75 — Deep Learning batch 3: optimization & regularization.
   Optimiser, Adam Optimiser, Momentum, Learning Rate Schedule,
   Weight Decay, Dropout, Batch Normalisation, Layer Normalisation.

   Adaptive moments navigate anisotropic curvature; normalization layers
   stabilize hidden distribution shifts while stochastic dropouts regularize capacity.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "optimiser",

      why: {
        before: "Early mathematical optimization used exact second-order methods (Newton-Raphson), " +
          "which computed the inverse Hessian matrix $\\mathcal{H}^{-1}$, scaling as $\\mathcal{O}(P^3)$ and failing for large parameter spaces.",
        problem: "Deep neural networks possess millions to trillions of non-convex parameters; finding a trajectory " +
          "down treacherous, ill-conditioned loss ravines requires scalable, first-order update rules.",
        shift: "**Neural Optimisers: First-order parameter update policies.** " +
          "Iteratively adjust parameters $\\theta_{t+1} = \\theta_t - \\Delta \\theta(g_t, m_t, v_t)$ using stochastic mini-batch " +
          "gradients, incorporating momentum and adaptive per-parameter learning rates to accelerate convergence and navigate saddle points."
      },

      num: {
        t: "Deep learning optimiser taxonomy & algorithmic characteristics",
        h: ["Optimiser", "Update Equation Mechanism", "Memory Overhead per Parameter", "Convergence & Landscape Profile"],
        r: [
          ["**Standard SGD**", "$\\theta_{t+1} = \\theta_t - \\eta g_t$", "**0 bytes** (zero state memory)", "Oscillates violently in ill-conditioned ravines; slow convergence"],
          ["**SGD with Momentum**", "$v_t = \\beta v_{t-1} + g_t; \\, \\theta_{t+1} = \\theta_t - \\eta v_t$", "**4 bytes** (stores 1st moment vector $v$)", "Dampens oscillations across steep walls; speeds down ravines"],
          ["**RMSprop**", "$v_t = \\beta v_{t-1} + (1-\\beta) g_t^2; \\, \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{v_t}+\\epsilon} g_t$", "**4 bytes** (stores exponential squared gradient)", "Adapts step size per parameter; handles non-stationary streaming data"],
          ["**Adam (Adaptive Moments)**", "Combines 1st ($m_t$) and 2nd ($v_t$) moments with bias correction", "**8 bytes** (stores $m_t$ and $v_t$ vectors)", "**Default workhorse**: ultra-fast convergence on complex non-convex surfaces"],
          ["**AdamW (Decoupled Decay)**", "Adam update + independent weight decay: $\\theta_{t+1} = \\theta_t(1-\\eta\\lambda) - \\dots$", "**8 bytes** (standard in Transformers)", "**Prevents L2 weight decay corruption** inherent to adaptive gradient algorithms"]
        ],
        n: "In deep learning, an optimizer is the mathematical algorithm that " +
          "translates computed loss gradients $\\nabla_\\theta \\mathcal{L}$ into concrete parameter " +
          "updates. In high-dimensional non-convex loss landscapes, the principal obstacles " +
          "are not local minima (which are mostly benign in overparameterized networks), " +
          "but **saddle points** (where the gradient vanishes in most directions) and **ill-conditioned " +
          "ravines** (where the curvature is drastically steeper in some directions than others, " +
          "indicated by a high condition number in the Hessian). Standard SGD oscillates uncontrollably " +
          "between the ravine walls while making negligible forward progress down the base. " +
          "Modern optimizers solve this using two complementary mathematical principles: " +
          "**Momentum** (accumulating an exponentially decaying average of past gradients to maintain " +
          "forward inertia) and **Adaptive Learning Rates** (scaling each parameter's step inversely " +
          "proportional to the root-mean-square of its historical gradient magnitudes, ensuring " +
          "infrequently updated parameters take larger exploratory steps while volatile parameters are dampened)."
      },

      miss: [
        {
          w: "Adaptive optimizers like Adam always generalize better than SGD with Momentum.",
          r: "In computer vision (e.g. ResNets on ImageNet), well-tuned SGD with Momentum consistently achieves slightly better out-of-sample generalization accuracy than Adam, because Adam can be attracted to sharper minima."
        },
        {
          w: "Optimizers operate directly on the scalar loss value.",
          r: "Optimizers never inspect the raw scalar loss; they consume the partial derivative vectors $\\frac{\\partial \\mathcal{L}}{\\partial \\theta}$ produced by backpropagation to calculate parameter update deltas."
        },
        {
          w: "You do not need to tune the learning rate when using an adaptive optimizer like Adam.",
          r: "While Adam is more forgiving than SGD, its initial learning rate (default 0.001) is still the single most critical hyperparameter in deep learning, requiring careful tuning or learning rate warmup."
        },
        {
          w: "Second-order optimizers (like L-BFGS) are always preferred if GPU memory allows.",
          r: "L-BFGS relies on deterministic curvature estimates and degrades severely in stochastic mini-batch regimes where gradient noise destroys quasi-Newton Hessian approximations."
        }
      ],

      trade: {
        buys: [
          "Enables rapid, automated convergence across complex non-convex deep loss landscapes.",
          "Adaptive algorithms eliminate manual per-layer learning rate tuning by scaling steps per parameter.",
          "Momentum mechanisms glide through high-dimensional saddle points and flat plateaus."
        ],
        costs: [
          "Memory footprint: storing momentum and second-moment buffers in Adam doubles the optimizer memory to 8 bytes/param.",
          "Hyperparameter sensitivity: subtle interactions between learning rate, betas, epsilon, and weight decay.",
          "Potential generalization gap: adaptive methods can settle into sharper minima than classical stochastic momentum."
        ],
        avoid: [
          "Using standard Adam instead of AdamW when applying L2 weight decay regularization.",
          "Sticking strictly to default learning rates without conducting a brief learning rate range test (LR finder)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "adam-optimiser",

      why: {
        before: "Engineers had to choose between RMSprop (which adapted per-parameter learning rates using squared gradients) " +
          "and SGD with Momentum (which accelerated down ravines using running directional averages).",
        problem: "RMSprop lacked directional inertia and stalled in flat plateaus, while Momentum lacked adaptive scaling " +
          "and suffered on sparse features with disparate gradient frequencies.",
        shift: "**Adam (Kingma & Ba 2014): Adaptive Moment Estimation with analytical bias correction.** " +
          "Track both the exponentially decaying first moment (mean $m_t$) and second uncentered moment (variance $v_t$) of gradients, " +
          "correcting for their initialization bias toward zero to calculate smooth, scale-invariant parameter steps."
      },

      num: {
        t: "Adam algorithm mathematical equations & canonical hyperparameters",
        h: ["Step / Parameter", "Mathematical Equation / Value", "Algorithmic Purpose"],
        r: [
          ["**First Moment (Mean)**", "$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$", "Tracks running directional velocity (momentum); default $\\beta_1 = 0.9$"],
          ["**Second Moment (Variance)**", "$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$", "Tracks uncentered gradient variance (energy); default $\\beta_2 = 0.999$"],
          ["**1st Moment Bias Correction**", "$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}$", "Compensates for $m_0 = 0$ initialization bias during initial steps $t$"],
          ["**2nd Moment Bias Correction**", "$\\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$", "Prevents massive initial steps by scaling up small early variance"],
          ["**Parameter Update Step**", "$\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$", "Step size is roughly bounded by $\\pm \\eta$; default $\\epsilon = 10^{-8}$"]
        ],
        n: "Adam (Adaptive Moment Estimation) is the undisputed default optimizer " +
          "of modern deep learning and Large Language Model pre-training. It synthesizes " +
          "the advantages of **AdaGrad** (effective for sparse features) and **RMSprop** " +
          "(effective for non-stationary environments). At each time step $t$, Adam updates " +
          "the exponentially decaying average of past gradients $m_t$ (first moment, mean) " +
          "and past squared gradients $v_t$ (second raw moment, uncentered variance). " +
          "Because $m_0$ and $v_0$ are initialized to zero vectors, they are heavily biased toward " +
          "zero, especially during early iterations when decay rates $\\beta_1$ and $\\beta_2$ are close to 1. " +
          "Kingma and Ba derived analytical **bias correction terms**: $\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}$ " +
          "and $\\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$. " +
          "As $t \\to \\infty$, the correction factor $1 - \\beta^t \\to 1.0$, naturally fading out. " +
          "The effective update step $\\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t}}$ is approximately scale-invariant: " +
          "rescaling the loss by a constant factor $c$ scales both $m_t$ by $c$ and $\\sqrt{v_t}$ by $c$, " +
          "canceling out and keeping the effective step size bounded approximately by $\\pm \\eta$."
      },

      miss: [
        {
          w: "Setting epsilon to 1e-8 in Adam is always safe and optimal.",
          r: "In mixed-precision training (FP16), numbers below 1e-7 can underflow to zero. Setting $\\epsilon = 10^{-8}$ in float16 can trigger division-by-zero crashes; modern LLM training often sets $\\epsilon = 10^{-6}$ or $10^{-5}$."
        },
        {
          w: "Adam with `weight_decay > 0` in standard PyTorch Adam implements true L2 weight decay.",
          r: "Standard Adam adds weight decay directly to the gradient ($g_t \\leftarrow g_t + \\lambda \\theta$). In adaptive optimizers, this divides the decay penalty by $\\sqrt{v_t}$, penalizing large-gradient weights LESS than small-gradient weights. AdamW fixes this."
        },
        {
          w: "Adam eliminates the need for learning rate warmup.",
          r: "During early iterations, variance estimates $v_t$ are noisy; without linear warmup, early updates can destabilize attention layers in Transformers, causing training divergence."
        },
        {
          w: "Adam requires the same amount of GPU VRAM as SGD.",
          r: "Adam maintains two floating-point state tensors ($m_t$ and $v_t$) for every single parameter, consuming an extra 8 bytes per parameter in FP32 (e.g. 56 GB of extra RAM just for optimizer states on a 7B model)."
        }
      ],

      trade: {
        buys: [
          "Robust, reliable convergence across diverse architectures (Transformers, CNNs, GNNs) with minimal tuning.",
          "Adaptive per-parameter step sizing handles mixed gradient frequencies and sparse token embeddings gracefully.",
          "Bias corrections guarantee numerical stability during the critical early iterations of training."
        ],
        costs: [
          "High VRAM overhead: requires storing two state tensors ($m$ and $v$) per parameter (8 bytes/param in FP32).",
          "Can fail to converge to the optimal flat minima compared to SGD on clean image classification datasets.",
          "Susceptible to exploding updates if $\\epsilon$ is set too small in low-precision floating-point formats (FP16)."
        ],
        avoid: [
          "Using standard `torch.optim.Adam` when applying weight decay (always use `torch.optim.AdamW`).",
          "Using default $\\epsilon = 10^{-8}$ when training in pure FP16 mixed precision."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "momentum",

      why: {
        before: "Pure stochastic gradient descent took steps strictly proportional to the current mini-batch gradient, " +
          "causing catastrophic oscillations across steep canyon walls and crawling at a snail's pace along flat ravines.",
        problem: "When the loss landscape has high condition number (anisotropic curvature), gradients point almost entirely " +
          "perpendicular to the true direction of the minimum, resulting in inefficient zig-zagging trajectories.",
        shift: "**Momentum (Polyak 1964): Physical heavy ball simulation.** " +
          "Accumulate past gradient vectors into a velocity buffer: $v_t = \\beta v_{t-1} + \\eta g_t$, " +
          "dampening orthogonal high-frequency oscillations while amplifying directional momentum down the ravine."
      },

      num: {
        t: "Momentum dynamics, velocity accumulation & Nesterov acceleration",
        h: ["Algorithm", "Velocity Formulation", "Parameter Update Rule", "Effective Velocity Multiplier"],
        r: [
          ["**Standard SGD**", "$v_t = g_t$ (no memory)", "$\\theta_{t+1} = \\theta_t - \\eta g_t$", "$1.0\\times$ (pure local gradient)"],
          ["**Polyak Classical Momentum**", "$v_t = \\beta v_{t-1} + g_t$", "$\\theta_{t+1} = \\theta_t - \\eta v_t$", "**$\\frac{1}{1 - \\beta}$** (e.g., $10\\times$ speedup when $\\beta = 0.9$)"],
          ["**Nesterov Accelerated (NAG)**", "$v_t = \\beta v_{t-1} + \\nabla \\mathcal{L}(\\theta_t - \\eta \\beta v_{t-1})$", "$\\theta_{t+1} = \\theta_t - \\eta v_t$", "**Lookahead gradient**: acts as an anticipatory predictive brake"],
          ["**Oscillation Cancellation**", "Signs alternate: $+g, -g, +g, -g$", "Sum converges toward zero", "Dampens orthogonal canyon wall bounce"],
          ["**Directional Reinforcement**", "Signs agree: $+g, +g, +g, +g$", "Sum accelerates toward asymptote", "Builds high velocity along flat ravine floor"]
        ],
        n: "The physical intuition behind Momentum is modeled after a heavy " +
          "ball rolling down a hilly terrain. Rather than letting the current gradient " +
          "dictate the entire step, the particle possesses physical inertia. " +
          "The velocity vector $v_t$ accumulates an exponentially decaying moving average " +
          "of historical gradients: $v_t = \\beta v_{t-1} + g_t$. " +
          "When gradients alternate signs along an axis (as occurs when bouncing across the " +
          "steep walls of an ill-conditioned ravine), the positive and negative vectors cancel " +
          "each other out, **dampening transverse oscillations**. Conversely, along directions " +
          "where gradients consistently point in the same direction (down the gentle slope of the ravine), " +
          "the velocity accumulates: $\\sum_{k=0}^\\infty \\beta^k = \\frac{1}{1 - \\beta}$. " +
          "For the standard setting $\\beta = 0.9$, the effective step size down the ravine is " +
          "amplified by a factor of **$10\\times$**! In **Nesterov Accelerated Gradient (NAG)**, " +
          "the algorithm computes the gradient not at the current position, but at the *projected " +
          "future position* $\\theta_t - \\beta v_{t-1}$. This 'lookahead' mechanism allows the optimizer " +
          "to apply brakes before overshooting the bottom of a steep valley."
      },

      miss: [
        {
          w: "Momentum allows you to use an arbitrarily high learning rate without instability.",
          r: "Because momentum amplifies effective step size by $\\frac{1}{1 - \\beta}$, a high learning rate combined with high momentum (e.g. $\\beta = 0.99$) causes severe velocity overshoot and numerical explosion."
        },
        {
          w: "Momentum is only used in classical SGD, not in modern optimizers like Adam.",
          r: "Adam's first moment $m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$ is mathematically identical to momentum. Momentum is an integral component of Adam, AdamW, and RMSprop."
        },
        {
          w: "Nesterov momentum requires computing two separate gradient passes per iteration.",
          r: "Through a clever change of variables discovered by Bengio et al. (2013), NAG can be evaluated using a single standard gradient pass with a modified parameter update formulation."
        },
        {
          w: "A momentum coefficient of 0.9 means the model remembers the last 10 gradients equally.",
          r: "Momentum uses an exponential decay window where the effective memory horizon is approximately $\\frac{1}{1 - \\beta} = 10$ steps, with older gradients decaying exponentially ($0.9^k$)."
        }
      ],

      trade: {
        buys: [
          "Dampens destructive oscillations in steep ravines while accelerating progress down flat slopes.",
          "Helps the optimizer roll past small, rugged saddle points and shallow sub-optimal local minima.",
          "Near-zero computational cost: requires only a single vector-addition update per iteration."
        ],
        costs: [
          "Requires allocating an extra 4 bytes of VRAM per parameter to store the velocity buffer vector.",
          "Prone to overshooting narrow global minima if the momentum coefficient $\\beta$ is set excessively high.",
          "Introduces an additional hyperparameter $\\beta$ (typically tuned between 0.9 and 0.99)."
        ],
        avoid: [
          "Training deep networks with pure SGD ($\\beta=0$) without momentum.",
          "Setting momentum $\\beta > 0.95$ without simultaneously reducing the base learning rate $\\eta$."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "learning-rate-schedule",

      why: {
        before: "Training deep models with a fixed, static learning rate ($\\eta$) meant choosing between " +
          "a high rate (which diverged or bounced chaotically around the minimum) and a low rate (which took months to converge).",
        problem: "Loss landscapes require aggressive exploration during early stages to escape initial conditions, " +
          "but require fine-grained, delicate stepping near the end of training to settle into the bottom of the basin.",
        shift: "**Learning Rate Scheduling: Dynamic temporal modulation of step size.** " +
          "Systematically adjust $\\eta(t)$ across iterations using warmup ramps, step decay, polynomial decay, " +
          "or Cosine Annealing to maximize convergence speed early while stabilizing final convergence."
      },

      num: {
        t: "Learning rate scheduling policies & mathematical formulations",
        h: ["Schedule Policy", "Mathematical Equation $\\eta(t)$", "Visual Trajectory", "Standard Domain / Use Case"],
        r: [
          ["**Linear Warmup**", "$\\eta_0 \\cdot \\frac{t}{T_{\\text{warm}}}$", "Linear ramp from $0 \\to \\eta_{\\text{max}}$", "**Mandatory in Transformers**: stabilizes early self-attention gradients"],
          ["**Step Decay (StepLR)**", "$\\eta_0 \\cdot \\gamma^{\\lfloor t / s \\rfloor}, \\, \\gamma=0.1$", "Stepwise staircase drop", "Classical computer vision (ResNet on ImageNet at epochs 30, 60, 90)"],
          ["**Cosine Annealing**", "$\\eta_{\\min} + \\frac{1}{2}(\\eta_0 - \\eta_{\\min})(1 + \\cos(\\frac{t}{T}\\pi))$", "Smooth non-linear S-curve decay", "**Gold standard in LLM pre-training** (smooth transition to 10% of peak)"],
          ["**OneCycle Policy**", "Warmup to $\\eta_{\\max}$, cosine decay to $\\eta_{\\min}$, paired with inverse momentum", "Triangle / Bell curve", "Super-convergence: trains models in $10\\times$ fewer total epochs"],
          ["**ReduceLROnPlateau**", "$\\eta \\leftarrow \\eta \\cdot \\text{factor}$ if $\\mathcal{L}_{\\text{val}}$ stalls for $P$ epochs", "Adaptive event-driven drops", "Great fallback baseline when total epoch count is unknown"]
        ],
        n: "The learning rate is universally acknowledged as the single most critical " +
          "hyperparameter in deep learning. A static learning rate is virtually never optimal. " +
          "Modern training regimens employ sophisticated schedules that govern the temporal trajectory " +
          "of $\\eta(t)$. The modern standard begins with **Linear Learning Rate Warmup**: " +
          "over the first $T_{\\text{warm}}$ steps (typically 1% to 5% of training), the learning rate " +
          "is ramped up linearly from zero to $\\eta_{\\max}$. Warmup is crucial for stabilizing deep " +
          "architectures (especially Transformers and Adam), preventing large, volatile early gradients " +
          "from destroying randomly initialized weights. Following warmup, the rate decays smoothly. " +
          "The modern gold standard is **Cosine Annealing** (Loshchilov & Hutter 2016), which decays " +
          "the learning rate following a half-cosine curve down to $\\eta_{\\min} \\approx 0.1 \\cdot \\eta_{\\max}$. " +
          "The smooth cosine decay allows the parameters to settle gently into the flattest, most robust " +
          "local minimum without the abrupt shocks caused by stepwise decays."
      },

      miss: [
        {
          w: "Adaptive optimizers like Adam don't need a learning rate schedule.",
          r: "Adam adapts per-parameter rates based on variance, but it scales them by the global learning rate $\\eta$. Without a schedule (warmup and cosine decay), Adam underperforms severely on modern vision and LLM benchmarks."
        },
        {
          w: "Decaying the learning rate all the way to absolute zero is always best.",
          r: "Decaying to absolute zero freezes learning prematurely. Standard practice in LLM pre-training sets the minimum learning rate $\\eta_{\\min}$ to roughly 10% of the peak learning rate."
        },
        {
          w: "Warmup is just an optional trick for very large clusters.",
          r: "In Transformer models, LayerNorm and self-attention layers exhibit severe gradient variance at initialization. Without warmup, even a single-GPU Transformer training run will frequently diverge."
        },
        {
          w: "You should call `scheduler.step()` before `optimizer.step()` in PyTorch.",
          r: "In PyTorch, calling `scheduler.step()` before `optimizer.step()` results in a silent bug (skipping the initial learning rate). You must call `optimizer.step()` first, followed by `scheduler.step()`."
        }
      ],

      trade: {
        buys: [
          "Early stability: warmup prevents early training explosions on randomly initialized networks.",
          "Peak generalization: smooth decay guides the optimizer into deep, flat, generalizing minima.",
          "Super-convergence: aggressive schedules (OneCycle) can reduce required training epochs by up to 80%."
        ],
        costs: [
          "Requires pre-specifying the total number of training steps $T$ (in Cosine Annealing) upfront.",
          "Coupled hyperparameters: changing the schedule length often requires re-tuning peak learning rates.",
          "Additional boilerplate in training loops and checkpoint serialization states."
        ],
        avoid: [
          "Calling `scheduler.step()` before `optimizer.step()` in PyTorch training loops.",
          "Omitting learning rate warmup when training Transformer architectures with Adam/AdamW."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "weight-decay",

      why: {
        before: "Deep neural networks with millions of parameters easily overfitted training data by driving " +
          "individual weight magnitudes to astronomical extremes, creating hyper-sensitive, oscillating decision boundaries.",
        problem: "Constraining model capacity requires an explicit mathematical penalty that discourages large weights, " +
          "smoothing the learned function's curvature without reducing the number of parameters.",
        shift: "**Weight Decay: Direct L2 parameter shrinkage.** " +
          "Add an explicit quadratic penalty to the loss function $\\mathcal{L}_{\\text{reg}} = \\mathcal{L}_0 + \\frac{1}{2}\\lambda \\|W\\|^2$, " +
          "or directly decay weights during the optimizer update: $W_{t+1} = (1 - \\eta \\lambda) W_t - \\eta \\nabla \\mathcal{L}$, " +
          "driving unnecessary weights toward zero."
      },

      num: {
        t: "L2 regularization vs Decoupled Weight Decay (AdamW)",
        h: ["Dimension / Property", "Standard L2 Regularization", "Decoupled Weight Decay (AdamW)", "Engineering Impact"],
        r: [
          ["**Loss Formulation**", "$\\mathcal{L} = \\mathcal{L}_0 + \\frac{\\lambda}{2} \\|W\\|^2$", "$\\mathcal{L} = \\mathcal{L}_0$ (loss untouched)", "AdamW decouples the regularization penalty from the gradient computation"],
          ["**Gradient Modification**", "$g_t \\leftarrow g_t + \\lambda W_t$", "$g_t$ remains pure $\\nabla \\mathcal{L}_0$", "L2 injects parameter magnitude directly into the first and second moment buffers"],
          ["**SGD Equivalence**", "$W_{t+1} = (1 - \\eta \\lambda) W_t - \\eta g_t$", "$W_{t+1} = (1 - \\eta \\lambda) W_t - \\eta g_t$", "**Mathematically identical in SGD**"],
          ["**Adam Equivalence**", "$W_{t+1} = W_t - \\eta \\frac{g_t + \\lambda W_t}{\\sqrt{v_t} + \\epsilon}$", "$W_{t+1} = (1 - \\eta \\lambda) W_t - \\eta \\frac{m_t}{\\sqrt{v_t} + \\epsilon}$", "**Radically different in Adam!** L2 divides penalty by $\\sqrt{v_t}$"],
          ["**Large Gradient Weights**", "Regularized **less** (divided by large $\\sqrt{v_t}$)", "Regularized **proportionally** to weight value", "AdamW restores true weight decay across all parameters"]
        ],
        n: "Weight decay is the quintessential regularization technique in deep learning. " +
          "Historically, weight decay and **L2 regularization** were considered mathematically " +
          "synonymous. In classical SGD, adding $\\frac{1}{2}\\lambda \\|W\\|^2$ to the loss adds " +
          "$\\lambda W$ to the gradient, producing the update: " +
          "$W_{t+1} = W_t - \\eta (g_t + \\lambda W_t) = (1 - \\eta \\lambda) W_t - \\eta g_t$. " +
          "Notice the term $(1 - \\eta \\lambda)$: at each step, the weight is decayed by a factor " +
          "proportional to $\\eta \\lambda$ before the gradient step is applied. " +
          "However, in 2017, Ilya Loshchilov and Frank Hutter demonstrated in **Fixing Weight Decay " +
          "Regularization in Adam (AdamW)** that for adaptive gradient algorithms, L2 regularization " +
          "is **NOT** weight decay! When $\\lambda W$ is added to the gradient in Adam, it gets added " +
          "to the second moment buffer $v_t$, meaning weights with large historical gradients have their " +
          "regularization penalty divided by a huge $\\sqrt{v_t}$, effectively turning off regularization " +
          "for the most active features! **AdamW decouples weight decay entirely**, subtracting " +
          "$\\eta \\lambda W_t$ directly from the parameter *after* the adaptive step is calculated, " +
          "restoring true weight regularization and dramatically improving Transformer generalization."
      },

      miss: [
        {
          w: "Weight decay should be applied to all model parameters, including biases and LayerNorm scales.",
          r: "Standard practice in modern deep learning (e.g. GPT, Llama) strictly excludes 1D parameters (biases, LayerNorm gamma/beta) from weight decay, applying it solely to 2D/3D weight matrices."
        },
        {
          w: "L2 regularization and Weight Decay are always mathematically identical.",
          r: "They are only identical in SGD. In adaptive gradient methods like Adam and RMSprop, L2 regularization distorts moment estimation and fails to properly regularize weights; AdamW is required."
        },
        {
          w: "Weight decay makes the model's weights sparse (driving them exactly to zero).",
          r: "L2 weight decay shrinks weights toward zero asymptotically, but rarely sets them exactly to zero. Exact weight sparsity requires L1 regularization (Lasso)."
        },
        {
          w: "Setting weight decay higher always prevents overfitting without trade-offs.",
          r: "An excessively high weight decay coefficient causes severe underfitting by over-constraining network capacity and collapsing feature representations."
        }
      ],

      trade: {
        buys: [
          "Prevents parameter explosion: keeps weight matrices bounded, promoting smooth, robust decision boundaries.",
          "Improves generalization: penalizes complex, high-frequency oscillatory functions that memorize training noise.",
          "AdamW formulation provides clean, independent hyperparameter control decoupled from learning rate scaling."
        ],
        costs: [
          "Requires careful tuning of the decay coefficient $\\lambda$ (typically between $0.01$ and $0.1$ in modern models).",
          "Requires custom parameter grouping in PyTorch code to exclude biases and normalization weights from decay.",
          "Excessive decay restricts model capacity and degrades performance on difficult edge-case distributions."
        ],
        avoid: [
          "Applying weight decay to bias vectors and LayerNorm/BatchNorm scale/shift parameters.",
          "Using `torch.optim.Adam` instead of `torch.optim.AdamW` when specifying `weight_decay > 0`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dropout",

      why: {
        before: "Overparameterized deep networks suffered from severe feature co-adaptation, " +
          "where neurons developed mutual dependencies that memorized training quirks but failed on unseen data.",
        problem: "Training an ensemble of hundreds of distinct deep neural networks to prevent overfitting " +
          "was computationally and memory-wise impossible for large models.",
        shift: "**Dropout (Srivastava et al. 2014, Hinton): Stochastic sub-network sampling.** " +
          "During each training pass, randomly zero out each neuron activation with probability $p$, " +
          "forcing every neuron to learn robust, self-reliant features and training an implicit ensemble of $2^N$ sub-networks."
      },

      num: {
        t: "Dropout mechanics: Standard vs Inverted Dropout",
        h: ["Property / Phase", "Standard Dropout (Hinton 2012)", "Inverted Dropout (Modern / PyTorch)"],
        r: [
          ["**Training Pass**", "$a_{\\text{train}} = m \\odot a, \\, m_i \\sim \\text{Bernoulli}(1-p)$", "**$a_{\\text{train}} = \\frac{1}{1-p} (m \\odot a)$** (pre-scales activations)"],
          ["**Inference Pass**", "$a_{\\text{test}} = (1-p) \\cdot a$ (requires scaling)", "**$a_{\\text{test}} = a$ (identity function; zero math overhead)**"],
          ["**Implicit Ensemble Size**", "**$2^N$ sub-networks** with shared parameters", "**$2^N$ sub-networks** with shared parameters"],
          ["**Optimal Dropout Rate ($p$)**", "Hidden layers: $p = 0.2 - 0.5$; Input layer: $p = 0.1 - 0.2$", "Hidden layers: $p = 0.1 - 0.3$ in modern Transformers"],
          ["**Backward Gradient Flow**", "Gradient flows only through active neurons: $\\delta \\odot m$", "Gradient scaled by $\\frac{1}{1-p} (\\delta \\odot m)$"]
        ],
        n: "Dropout is one of the most elegant regularization inventions in machine " +
          "learning. During training, for each forward pass of every mini-batch, a binary mask " +
          "vector $m$ is sampled where each element is drawn from a Bernoulli distribution: " +
          "$m_i \\sim \\text{Bernoulli}(1-p)$. Neurons corresponding to $m_i = 0$ are completely " +
          "dropped: their activations are set to zero, and during backpropagation, zero gradient " +
          "flows through them. This prevents **feature co-adaptation**: a neuron cannot rely on the presence " +
          "of a specific peer neuron to fix its mistakes, forcing each unit to learn robust, independent " +
          "representations. Mathematically, dropping nodes among $N$ neurons dynamically samples from " +
          "an ensemble of **$2^N$ distinct sub-networks** that share weights. At test time, we want " +
          "to evaluate the expected prediction of this vast ensemble without running $2^N$ models. " +
          "Modern frameworks achieve this via **Inverted Dropout**: by scaling the activations by " +
          "$\\frac{1}{1-p}$ during the *training* pass, the expected value of activations is preserved " +
          "($\\mathbb{E}[a_{\\text{train}}] = a$), allowing the inference pass to run as a clean, " +
          "unaltered identity function without any test-time scaling overhead!"
      },

      miss: [
        {
          w: "Dropout should remain active during model inference and evaluation.",
          r: "Dropout is strictly a training regularizer. During inference, dropout must be disabled (`model.eval()`) so the deterministic full network is evaluated (unless performing Monte Carlo Dropout for uncertainty estimation)."
        },
        {
          w: "Dropout should be placed before Batch Normalization layers.",
          r: "Placing Dropout directly before BatchNorm creates the 'Variance Shift' problem (BatchNorm's variance calculations clash with Dropout's zeroing). Modern practice places Dropout after normalization or avoids combining them directly."
        },
        {
          w: "Modern Large Language Models use heavy dropout (p = 0.5).",
          r: "State-of-the-art LLMs (Llama, GPT-3, Mistral) are pre-trained on multi-trillion token datasets with ZERO dropout (`dropout=0.0`), because underfitting the massive corpus is a far bigger risk than overfitting."
        },
        {
          w: "Dropout reduces the parameter count of the model.",
          r: "Dropout does not remove parameters from memory; it dynamically masks activations to zero during specific forward passes. The full weight matrix is retained throughout training."
        }
      ],

      trade: {
        buys: [
          "Powerful defense against overfitting: breaks feature co-adaptation across dense layers.",
          "Simulates an ensemble of $2^N$ models within a single model architecture at zero extra parameter cost.",
          "Monte Carlo Dropout allows estimating Bayesian model uncertainty at test time by keeping dropout active."
        ],
        costs: [
          "Slows down training convergence: models typically require 2x to 3x more training epochs to converge.",
          "Clashes with Batch Normalization if layer order is mismanaged (Variance Shift).",
          "Largely redundant when pre-training foundation models on colossal, near-infinite datasets."
        ],
        avoid: [
          "Forgetting to call `model.eval()` before running test evaluation loops in PyTorch.",
          "Using high dropout rates ($p > 0.1$) when pre-training large language models on multi-terabyte corpora."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "batch-normalisation",

      why: {
        before: "As deep networks trained, parameter updates in early layers continually shifted " +
          "the distribution of inputs to later layers ('Internal Covariate Shift'), requiring tiny learning rates and delicate initialization.",
        problem: "Deep networks suffered from unstable gradient propagation, saturated activations, " +
          "and extreme sensitivity to initial weight distributions, capping practical network depth.",
        shift: "**Batch Normalisation (Ioffe & Szegedy 2015): Mini-batch standardization with learnable affine scaling.** " +
          "Normalize each hidden layer's activations across the mini-batch to have zero mean and unit variance, " +
          "restoring representational capacity via learnable parameters $\\gamma$ and $\\beta$: $y = \\gamma \\hat{x} + \\beta$."
      },

      num: {
        t: "Batch Normalisation operations: Training vs Inference dynamics",
        h: ["Stage / Parameter", "Mathematical Formulation", "Operational Execution"],
        r: [
          ["**Mini-Batch Mean**", "$\\mu_B = \\frac{1}{B} \\sum_{i=1}^B x_i$", "Computed dynamically across batch axis $B$ in forward pass"],
          ["**Mini-Batch Variance**", "$\\sigma_B^2 = \\frac{1}{B} \\sum_{i=1}^B (x_i - \\mu_B)^2$", "Computes empirical variance per channel across batch"],
          ["**Standardization**", "$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$", "Forces activations to zero mean, unit variance; $\\epsilon = 10^{-5}$"],
          ["**Scale and Shift (Affine)**", "$y_i = \\gamma \\hat{x}_i + \\beta$", "Learnable parameters $\\gamma, \\beta$ restore identity mapping if needed"],
          ["**Inference Running Stats**", "$\\mu_{\\text{run}} = (1-m)\\mu_{\\text{run}} + m \\mu_B$", "**Frozen during eval**: inference uses accumulated running stats independent of batch size"]
        ],
        n: "Batch Normalization (BatchNorm) transformed deep computer vision " +
          "by smoothing the optimization landscape. While originally hypothesized to eliminate " +
          "'Internal Covariate Shift', Santurkar et al. (2018) proved that BatchNorm's true power " +
          "stems from **smoothing the loss landscape**: it significantly reduces the Lipschitz " +
          "constant of the loss and makes the gradients vastly more predictive and well-behaved. " +
          "During **Training**, for each channel, BatchNorm computes the mean $\\mu_B$ and variance " +
          "$\\sigma_B^2$ across all samples in the mini-batch, normalizes the activations, and applies " +
          "learnable scale $\\gamma$ and shift $\\beta$ parameters. Simultaneously, it tracks exponential " +
          "moving averages of population statistics (running mean and variance). " +
          "During **Inference**, computing batch statistics is impossible (e.g. when processing a single " +
          "sample $B=1$), so BatchNorm freezes its weights and applies the pre-computed running statistics: " +
          "$\\hat{x} = \\frac{x - \\mu_{\\text{run}}}{\\sqrt{\\sigma_{\\text{run}}^2 + \\epsilon}}$. " +
          "BatchNorm allows practitioners to train with **10x higher learning rates**, provides mild " +
          "stochastic regularization, and makes networks robust to weight initialization."
      },

      miss: [
        {
          w: "Batch Normalization computes mean and variance across the feature channels of a single sample.",
          r: "BatchNorm normalizes ACROSS the mini-batch for each individual channel independently. Normalizing across the feature channels of a single sample is Layer Normalization."
        },
        {
          w: "Batch Normalization works effectively with tiny batch sizes like B = 2.",
          r: "With small batch sizes ($B < 8$), empirical batch mean and variance estimates become wildly noisy, causing catastrophic performance degradation. GroupNorm or LayerNorm must be used instead."
        },
        {
          w: "A linear layer preceding BatchNorm requires a bias term.",
          r: "Because BatchNorm subtracts the batch mean $\\mu_B$, any constant bias added in the preceding linear or convolutional layer is mathematically canceled out: $(Wx + b) - \\text{mean}(Wx + b) = Wx - \\text{mean}(Wx)$. Set `bias=False`."
        },
        {
          w: "Batch Normalization is standard in modern Large Language Models.",
          r: "BatchNorm fails in NLP because sentence lengths vary dynamically and sequence dependencies make batch-wise normalization unstable. Transformers exclusively use Layer Normalization or RMSNorm."
        }
      ],

      trade: {
        buys: [
          "Smoothes the optimization loss landscape, permitting up to $10\\times$ higher learning rates and faster convergence.",
          "Drastically reduces network sensitivity to weight initialization schemes.",
          "Acts as a mild regularizer: stochastic batch statistics inject noise, reducing the need for heavy dropout in CNNs."
        ],
        costs: [
          "Strict dependency on batch size: degrades catastrophically when batch sizes are very small ($B < 8$).",
          "Discrepancy between training and inference: mismatch between batch stats and running stats can cause test degradation.",
          "Incompatible with variable-length sequence modeling and distributed training with tiny per-GPU batch slices."
        ],
        avoid: [
          "Using BatchNorm in recurrent neural networks or Transformer sequence models (use LayerNorm).",
          "Leaving `bias=True` in linear or convolution layers immediately preceding a BatchNorm layer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "layer-normalisation",

      why: {
        before: "Batch Normalization depended heavily on mini-batch size and struggled with variable-length sequences, " +
          "failing completely in recurrent neural networks and distributed training with small per-GPU batches.",
        problem: "Sequence models process inputs token-by-token with dynamic padding; computing statistics across " +
          "the batch axis creates inter-sample dependencies and breaks during sequential autoregressive generation.",
        shift: "**Layer Normalisation (Ba, Kiros & Hinton 2016): Batch-independent per-sample feature standardization.** " +
          "Compute mean and variance across all hidden feature dimensions for each individual sample independently: " +
          "$\\mu_L = \\frac{1}{H}\\sum_{i=1}^H x_i$, guaranteeing identical execution during training and inference regardless of batch size."
      },

      num: {
        t: "Layer Normalisation vs Batch Normalisation architectural comparison",
        h: ["Dimension / Property", "Batch Normalisation (BatchNorm)", "Layer Normalisation (LayerNorm)"],
        r: [
          ["**Normalization Axis**", "Across the **Batch dimension** ($B$) for each channel", "Across the **Hidden feature dimension** ($H$) for each sample"],
          ["**Batch Size Dependency**", "**High**: degrades when $B < 8$; fails at $B = 1$", "**Zero**: mathematically identical for $B=1$ as for $B=1024$"],
          ["**Inference Behavior**", "Requires switching to accumulated running statistics", "**Identical**: computes exact sample stats on the fly"],
          ["**Primary Domain**", "Computer Vision (CNNs, ConvNets)", "**NLP & Transformers** (BERT, GPT, Llama, ViT)"],
          ["**Modern Simplification**", "BatchRenorm", "**RMSNorm** (Zhang & Sennrich 2019): drops mean centering, saving $20\\%$ compute"]
        ],
        n: "Layer Normalization (LayerNorm) solved the fundamental scaling barriers " +
          "of Batch Normalization in natural language processing and modern foundation models. " +
          "Given an input tensor for a single sample at a given token position $x \\in \\mathbb{R}^H$, " +
          "LayerNorm computes the mean and variance across all $H$ hidden feature dimensions: " +
          "$\\mu = \\frac{1}{H} \\sum_{j=1}^H x_j$ and $\\sigma^2 = \\frac{1}{H} \\sum_{j=1}^H (x_j - \\mu)^2$. " +
          "It then normalizes the vector and applies learnable element-wise gain $\\gamma \\in \\mathbb{R}^H$ " +
          "and bias $\\beta \\in \\mathbb{R}^H$: " +
          "$y = \\gamma \\odot \\left( \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} \\right) + \\beta$. " +
          "Because statistics are computed strictly within each individual sample's feature vector, " +
          "LayerNorm introduces **zero cross-sample dependencies**. A model processes a single prompt " +
          "during production inference with the exact same mathematical behavior as when training across " +
          "a distributed cluster with 1,024 GPUs. In Transformer architectures, the placement of LayerNorm " +
          "is critical: early models used **Post-LN** (normalizing after the residual addition), which required " +
          "delicate learning rate warmup to avoid gradient explosions; modern architectures universally " +
          "use **Pre-LN** (normalizing before the self-attention and FFN sub-layers), creating an unhindered " +
          "identity gradient highway that enables training models with hundreds of layers."
      },

      miss: [
        {
          w: "Layer Normalization requires running statistics during inference just like Batch Normalization.",
          r: "LayerNorm does not track or store running statistics. It calculates the mean and variance of the active feature vector on the fly, behaving identically in training and inference."
        },
        {
          w: "Post-LN and Pre-LN Transformer architectures have identical training stability.",
          r: "Post-LN normalizes the residual path, causing gradients to explode or vanish in deep networks without warmup. Pre-LN places LayerNorm on the input branches, leaving the residual highway clean and enabling stable training of 100+ layer Transformers."
        },
        {
          w: "Layer Normalization is optimal for convolutional feature maps in computer vision.",
          r: "In CNNs, spatial channels represent distinct semantic filters, while spatial coordinates represent geometry. BatchNorm preserves channel individuality while LayerNorm pools across channels, making BatchNorm or GroupNorm superior for ConvNets."
        },
        {
          w: "RMSNorm is a completely different normalization paradigm from LayerNorm.",
          r: "RMSNorm is simply LayerNorm with the mean centering step omitted ($y = \\frac{x}{\\text{RMS}(x)} \\odot \\gamma$), achieving identical empirical accuracy while cutting normalization latency by roughly 20%."
        }
      ],

      trade: {
        buys: [
          "Complete independence from batch size: runs with identical mathematical fidelity for single-sample inference ($B=1$).",
          "Ideal for sequence modeling and autoregressive generation where input lengths vary dynamically.",
          "Pre-LN configuration provides clean gradient highways, unlocking stable training of massive 100B+ parameter Transformers."
        ],
        costs: [
          "Underperforms Batch Normalization on standard convolutional vision architectures.",
          "Element-wise vector reductions across hidden dimensions create memory bandwidth pressure on GPU kernels.",
          "Slightly higher per-sample floating point operations during inference compared to frozen BatchNorm folding."
        ],
        avoid: [
          "Using Post-LN in deep Transformers without careful learning rate warmup schedules (always use Pre-LN or RMSNorm).",
          "Applying LayerNorm across spatial axes in standard convolutional networks without testing GroupNorm."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
