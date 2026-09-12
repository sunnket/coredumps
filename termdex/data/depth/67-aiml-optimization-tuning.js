/* ==========================================================================
   Depth pass 67 — AI/ML core batch 5: optimization, tuning, and deployment.
   Hyperparameter, Hyperparameter Tuning, Grid Search,
   Stochastic Gradient Descent, Learning Rate, Inference,
   SMOTE, Baseline Model.

   Hyperparameters configure the hypothesis space; optimizers navigate
   the loss terrain; baselines anchor empirical progress to reality.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "hyperparameter",

      why: {
        before: "Practitioners conflated internal learned parameters (weights and biases) " +
          "with external architectural configuration knobs, attempting to optimize everything " +
          "via a single gradient descent pass.",
        problem: "Standard gradient descent cannot learn discrete architectural settings " +
          "(number of layers, tree depth, kernel type, learning rate) because their derivatives " +
          "do not exist or trivially collapse (e.g. setting regularization to zero to minimize training loss).",
        shift: "**Parameters vs Hyperparameters.** Distinguish between **model parameters** " +
          "(learned automatically from training data via optimization) and **hyperparameters** " +
          "(external structural configurations set *before* training begins to govern the learning process)."
      },

      num: {
        t: "Model Parameters vs Hyperparameters across ML architectures",
        h: ["Dimension", "Model Parameters ($\\theta$)", "Hyperparameters ($\\gamma$)"],
        r: [
          ["**Optimization Mechanism**", "**Learned automatically via training (SGD, Normal Eq, Trees)**", "**Set externally; tuned via cross-validation (HPO)**"],
          ["**Storage Location**", "**Stored inside model weight artifact (`.safetensors`, `.pt`)**", "**Defined in training scripts, config YAMLs, pipelines**"],
          ["**Linear / Logistic Models**", "**Coefficients ($w_1, \\dots, w_d$) and intercept bias ($b$)**", "**Regularization penalty ($\\lambda$, $C$), penalty type (L1/L2)**"],
          ["**Decision Trees / Ensembles**", "**Split feature indices, split threshold values, leaf values**", "**`max_depth`, `n_estimators`, `min_samples_split`, `learning_rate`**"],
          ["**Deep Neural Networks**", "**Connection weights and bias tensors across all layers**", "**Layer count, hidden units, learning rate ($\\eta$), batch size, dropout**"],
          ["**Evaluation Target**", "**Minimized empirical training loss $\\mathcal{L}(\\theta)$**", "**Maximized generalization metric on validation split**"]
        ],
        n: "In machine learning, the distinction between **parameters** and " +
          "**hyperparameters** represents the boundary between internal optimization " +
          "and external governance. **Parameters $\\theta$** are the internal " +
          "mathematical variables that the algorithm adjusts directly during " +
          "training to minimize empirical risk (e.g. the 70 billion floating-point " +
          "weights in LLaMA-3). Conversely, **Hyperparameters $\\gamma$** are " +
          "external configuration variables that cannot be updated directly by " +
          "gradient descent. Hyperparameters operate across three tiers: " +
          "(1) **Model Capacity Hyperparameters**: dictate the representational " +
          "breadth of the hypothesis space (tree depth, neural network layers, " +
          "polynomial degree); (2) **Optimization Hyperparameters**: dictate " +
          "how the optimizer navigates the loss surface (learning rate $\\eta$, " +
          "momentum $\\beta$, mini-batch size $B$, optimizer type); and (3) " +
          "**Regularization Hyperparameters**: penalize model complexity to " +
          "prevent overfitting (L1/L2 penalty $\\lambda$, dropout probability $p$, " +
          "early stopping patience). Because hyperparameters cannot be evaluated " +
          "on training data without trivially overfitting, they must be tuned " +
          "strictly against **validation splits** using Hyperparameter Optimization (HPO)."
      },

      miss: [
        {
          w: "Hyperparameters can be learned automatically by backpropagation during training.",
          r: "Standard gradient descent cannot optimize hyperparameters. Attempting to optimize " +
            "regularization $\\lambda$ on training loss would trivially drive $\\lambda \\to 0$ to overfit."
        },
        {
          w: "Default hyperparameter values in scikit-learn or XGBoost are optimal for production.",
          r: "Default values are generic, conservative baselines. Systematic hyperparameter tuning " +
            "on domain data typically yields 15% to 30% relative performance improvements."
        },
        {
          w: "Tuning more hyperparameters always produces a better model.",
          r: "Searching dozens of hyperparameters against a small validation set causes " +
            "**hyperparameter overfitting**, finding configurations that fit validation noise but fail in production."
        },
        {
          w: "Hyperparameters are strictly numerical values.",
          r: "Hyperparameters include discrete categorical choices: activation function (`relu` vs `gelu`), " +
            "optimizer algorithm (`AdamW` vs `SGD`), and distance metrics (`euclidean` vs `cosine`)."
        }
      ],

      trade: {
        buys: [
          "Directly governs model capacity, convergence speed, and regularization balance.",
          "Unlocks the peak predictive performance ceiling of algorithms on specific domain datasets.",
          "Enables fine-grained trade-offs between computational training cost and model accuracy.",
          "Allows tailoring model behavior to specific operational constraints (inference latency vs accuracy)."
        ],
        costs: [
          "Requires expensive multi-trial search and cross-validation loops (high compute and time cost).",
          "Risk of overfitting the validation split when too many hyperparameter combinations are evaluated.",
          "Combinatorial explosion: search spaces grow exponentially with each added hyperparameter.",
          "Best hyperparameters often shift when new training data arrives, requiring retuning."
        ],
        avoid: [
          "Evaluating or tuning hyperparameters on the final holdout test set.",
          "Leaving default hyperparameters uninspected in high-stakes production deployments.",
          "Tuning dozens of minor hyperparameters while ignoring core feature engineering."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hyperparameter-tuning",

      why: {
        before: "Engineers adjusted hyperparameters manually by hand, guessing " +
          "learning rates and tree depths in an ad-hoc, irreproducible cycle.",
        problem: "Manual tuning is painfully slow, biased toward human preconceptions, " +
          "and unable to explore complex non-linear interactions across dozens of continuous hyperparameters.",
        shift: "**Systematic Hyperparameter Optimization (HPO).** Employ automated search " +
          "strategies (Grid Search, Random Search, Bayesian Optimization, Hyperband) to navigate " +
          "the multi-dimensional configuration space and maximize validation performance automatically."
      },

      num: {
        t: "Hyperparameter optimization strategies & algorithmic trade-offs",
        h: ["Optimization Strategy", "Sampling Logic", "Search Efficiency", "Best Use Case"],
        r: [
          ["**Grid Search**", "**Exhaustive Cartesian product across discrete grid**", "**Low ($O(V^P)$ exponential scaling)**", "**Small spaces ($\\le 3$ parameters) with coarse grids**"],
          ["**Random Search**", "**Uniform random sampling across continuous distributions**", "**High (finds non-linear optima faster than Grid)**", "**Standard default baseline for general ML tuning**"],
          ["**Bayesian Optimization (TPE / Optuna)**", "**Probabilistic surrogate model balances exploration/exploitation**", "**Very High (learns from previous trial outcomes)**", "**Expensive models where every training trial costs real compute**"],
          ["**Hyperband / ASHA**", "**Multi-fidelity search: aggressively prunes unpromising trials**", "**State-of-the-Art for deep learning**", "**Large neural networks, deep vision, LLM fine-tuning**"],
          ["**Population-Based Training (PBT)**", "**Evolutionary updates of hyperparameters during training**", "**High (dynamic schedule tuning)**", "**Reinforcement learning, generative adversarial networks (GANs)**"]
        ],
        n: "Hyperparameter Tuning (Hyperparameter Optimization / HPO) formalizes " +
          "the search for the optimal configuration vector $\\gamma^*$: " +
          "$$\\gamma^* = \\arg\\min_{\\gamma \\in \\Gamma} \\mathbb{E}_{\\mathcal{D}_{\\text{val}}} \\left[ \\mathcal{L}(f_{\\theta^*(\\gamma)}(\\mathbf{x}), y) \\right]$$ " +
          "In 2012, James Bergstra and Yoshua Bengio proved the mathematical " +
          "superiority of **Random Search over Grid Search**: because most " +
          "models have a low 'effective dimensionality' (only 2 or 3 hyperparameters " +
          "dominate performance while others have negligible impact), Random " +
          "Search tests distinct values for every parameter in every trial, " +
          "whereas Grid Search wastes trials re-testing the exact same values. " +
          "For computationally expensive models, **Bayesian Optimization** " +
          "(using Tree-structured Parzen Estimators / TPE in frameworks like " +
          "**Optuna**) models the unknown objective function as a probability " +
          "distribution. An **Acquisition Function (Expected Improvement / EI)** " +
          "decides the next trial coordinates by balancing **exploration** " +
          "(sampling regions of high uncertainty) with **exploitation** " +
          "(sampling near known high-performing configurations). Modern " +
          "large-scale pipelines combine Bayesian tuning with **Hyperband " +
          "early-stopping**, killing off bottom-performing trials after a " +
          "few epochs to reallocate compute to promising runs."
      },

      miss: [
        {
          w: "Grid Search is always the most thorough and optimal tuning methodology.",
          r: "Grid Search suffers from exponential combinatorial explosion and wastes compute; " +
            "Random Search and Bayesian Optimization find superior configurations in a fraction of the time."
        },
        {
          w: "You should tune all 40 available model hyperparameters simultaneously.",
          r: "Tuning too many parameters dilutes the search budget. Focusing on the 3 to 5 " +
            "dominant hyperparameters (learning rate, depth, regularization) yields 95% of performance gains."
        },
        {
          w: "Hyperparameter tuning can be run directly on the final test set.",
          r: "Tuning against the test set causes test-set data leakage, invalidating its " +
            "ability to provide an honest, unbiased estimate of future production generalization."
        },
        {
          w: "Automated HPO replaces the need for feature engineering.",
          r: "High-quality feature engineering consistently yields 10x greater accuracy " +
            "improvements than hyperparameter tuning. HPO refines a model; it cannot fix missing signals."
        }
      ],

      trade: {
        buys: [
          "Discovers non-intuitive, synergistic parameter combinations that humans miss.",
          "Automates model optimization, freeing engineers to focus on feature engineering.",
          "Consistently extracts 10%–25% higher predictive performance compared to default settings.",
          "Multi-fidelity algorithms (Hyperband) save thousands of dollars in cloud GPU compute."
        ],
        costs: [
          "Multiplies compute requirements by the number of evaluated search trials.",
          "Risk of overfitting the validation split if too many trials are evaluated on small datasets.",
          "Requires dedicated orchestration infrastructure (Optuna, Ray Tune, Weights & Biases).",
          "Can produce fragile models tuned specifically to historical validation quirks."
        ],
        avoid: [
          "Using exhaustive Grid Search for more than 2 or 3 parameters simultaneously.",
          "Tuning hyperparameters without cross-validation on small, noisy datasets.",
          "Spending weeks on HPO before establishing clean features and baseline models."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grid-search",

      why: {
        before: "Practitioners evaluated hyperparameters haphazardly, trying random " +
          "isolated settings without documenting or systematically covering parameter combinations.",
        problem: "Hyperparameters interact non-linearly (e.g. tree depth interacts with " +
          "learning rate; batch size interacts with momentum); testing them one-at-a-time missed optimal pairings.",
        shift: "**Grid Search: exhaustive Cartesian product evaluation.** Define a discrete " +
          "list of candidate values for each hyperparameter, systematically training and validating " +
          "a model for every single combination across the resulting multi-dimensional grid."
      },

      num: {
        t: "Grid Search combinatorial explosion & computational scaling",
        h: ["Hyperparameters Tuned ($P$)", "Values per Parameter ($V$)", "Total Combinations ($V^P$)", "5-Fold CV Model Runs ($5 \\times V^P$)"],
        r: [
          ["**2 parameters** (e.g. $C, \\gamma$)", "**5 values each**", "**25 combinations**", "**125 models trained**"],
          ["**3 parameters**", "**5 values each**", "**125 combinations**", "**625 models trained**"],
          ["**4 parameters**", "**5 values each**", "**625 combinations**", "**3,125 models trained**"],
          ["**5 parameters**", "**5 values each**", "**3,125 combinations**", "**15,625 models trained**"],
          ["**6 parameters**", "**10 values each**", "**1,000,000 combinations**", "**5,000,000 models trained**"]
        ],
        n: "Grid Search (`GridSearchCV` in scikit-learn) is the most historically " +
          "common automated hyperparameter tuning algorithm. It operates by " +
          "taking a user-defined dictionary of discrete values (e.g. `{'max_depth': " +
          "[3, 5, 10], 'learning_rate': [0.01, 0.1, 0.2]}`) and computing the " +
          "**Cartesian product** of all parameter arrays. For each coordinate " +
          "in the grid, it executes $K$-fold cross-validation, recording the " +
          "mean validation score and identifying the global best configuration. " +
          "The fatal vulnerability of Grid Search is **Combinatorial Explosion**: " +
          "the number of models to train scales exponentially as $O(V^P)$, " +
          "where $P$ is the number of parameters and $V$ is the number of " +
          "discrete values. Furthermore, Grid Search suffers from severe " +
          "**resolution blindness**: if the optimal learning rate is $0.034$, " +
          "and the grid only evaluates $[0.01, 0.1]$, Grid Search will never " +
          "discover the optimum. Despite these theoretical limitations, Grid " +
          "Search remains popular for small 1D or 2D parameter sweeps " +
          "(such as tuning $C$ and $\\gamma$ in an RBF Support Vector Machine) " +
          "because it is trivially parallelizable, deterministic, and leaves " +
          "zero doubt about the performance of the specified grid points."
      },

      miss: [
        {
          w: "Grid Search guarantees finding the global optimal hyperparameter configuration.",
          r: "Grid Search only evaluates discrete, pre-selected points on a grid. " +
            "If the true optimal value falls in the gaps between grid coordinates, Grid Search misses it."
        },
        {
          w: "Grid Search is the best method for tuning deep neural networks.",
          r: "Training a single deep net takes hours or days. Running hundreds of grid combinations " +
            "is computationally impossible; Bayesian Optimization or Hyperband is required."
        },
        {
          w: "A finer, denser grid always produces a superior model.",
          r: "Denser grids explode computational training time exponentially while increasing " +
            "the risk of hyperparameter overfitting to validation split noise."
        },
        {
          w: "Grid Search should be used to explore continuous hyperparameters.",
          r: "Continuous parameters (like learning rate) span logarithmic scales ($10^{-5}$ to $10^{-1}$), " +
            "making discrete grids highly inefficient compared to continuous random sampling."
        }
      ],

      trade: {
        buys: [
          "Simple, deterministic, and completely reproducible: identical grids yield identical results.",
          "Trivially parallelizable: every grid trial is independent and can run across distributed CPU cores.",
          "Exhaustively maps out the validation response surface across specified coordinates.",
          "Ideal for small, well-understood 1D or 2D parameter sweeps (e.g. SVM $C$ and $\\gamma$)."
        ],
        costs: [
          "Exponential combinatorial scaling ($O(V^P)$) makes tuning >3 parameters computationally prohibitive.",
          "Wastes massive compute repeatedly evaluating uninformative parameters on fixed coordinates.",
          "Coarse resolution misses optimal parameter values lying between grid intervals.",
          "Cannot dynamically adapt search trajectory based on results from previous trials."
        ],
        avoid: [
          "Tuning more than 3 hyperparameters simultaneously.",
          "Deep learning or large gradient boosted tree ensembles with long training runtimes.",
          "Continuous hyperparameters with wide logarithmic dynamic ranges."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stochastic-gradient-descent",

      why: {
        before: "Batch Gradient Descent computed the true mathematical gradient across " +
          "the **entire dataset** ($N$ samples) before executing a single parameter update.",
        problem: "On modern datasets with millions of samples, computing full-batch gradients " +
          "requires immense memory, takes minutes or hours per update step, and gets permanently " +
          "trapped in local minima and saddle points.",
        shift: "**Stochastic Gradient Descent (SGD): approximate gradients on mini-batches.** " +
          "Compute noisy gradient estimates on small random subsets ($B=32$ to $512$), updating " +
          "parameters frequently with stochastic noise that accelerates training and escapes saddle points."
      },

      num: {
        t: "Gradient descent family comparison across batch paradigms",
        h: ["Algorithm Variant", "Batch Size ($B$)", "Gradient Nature", "Convergence Behavior & Speed"],
        r: [
          ["**Batch Gradient Descent**", "$B = N$ (Full dataset)", "**Deterministic, exact true gradient**", "**Smooth descent; slow updates; traps in saddle points**"],
          ["**Mini-Batch SGD**", "$B \\in [32, 512]$", "**Unbiased stochastic approximation**", "**Fast vectorization; escapes sharp minima; industry standard**"],
          ["**Pure SGD**", "$B = 1$ (Single sample)", "**High-variance noisy gradient**", "**Immediate updates; cannot saturate GPU tensor parallelism**"],
          ["**SGD with Momentum**", "$B \\in [32, 512]$", "**Velocity vector dampens oscillations**", "**Accelerates through flat plateaus and narrow ravines**"],
          ["**AdamW**", "$B \\in [32, 512]$", "**Adaptive per-parameter learning rates + weight decay**", "**Fast initial convergence; dominant in LLM training**"]
        ],
        n: "Stochastic Gradient Descent (SGD) is the computational engine " +
          "powering modern machine learning. In classical batch gradient " +
          "descent, the parameter update is $\\theta_{t+1} = \\theta_t - " +
          "\\eta \\frac{1}{N}\\sum_{i=1}^N \\nabla \\mathcal{L}_i(\\theta_t)$, " +
          "requiring a pass over all $N$ examples for one step. In Mini-Batch " +
          "SGD, the update is computed over a small random batch $\\mathcal{B}$: " +
          "$$\\theta_{t+1} = \\theta_t - \\eta \\frac{1}{|\\mathcal{B}|} \\sum_{i \\in \\mathcal{B}} \\nabla \\mathcal{L}_i(\\theta_t)$$ " +
          "Because the expected value of the mini-batch gradient equals the " +
          "true full-batch gradient ($\\mathbb{E}[\\nabla \\mathcal{L}_\\mathcal{B}] " +
          "= \\nabla J(\\theta)$), the optimization trajectory moves toward " +
          "the minimum in expectation. Crucially, the **stochastic noise** " +
          "introduced by mini-batch sampling is not a flaw—it is a profound " +
          "mathematical advantage: it creates a random perturbation that " +
          "allows the optimizer to **escape saddle points and shallow, " +
          "overfitted local minima**, naturally settling into **flat, wide " +
          "minima** that generalize significantly better. To tame gradient " +
          "oscillations in steep ravines, **Momentum** adds an exponentially " +
          "decaying velocity vector: $\\mathbf{v}_{t+1} = \\beta \\mathbf{v}_t " +
          "+ \\eta \\nabla \\mathcal{L}$, smoothing trajectory updates."
      },

      miss: [
        {
          w: "Pure SGD (batch size = 1) is the standard method used in modern deep learning.",
          r: "Batch size 1 is rarely used because it cannot leverage GPU SIMD tensor parallelism. " +
            "Mini-Batch SGD (batch sizes 32 to 512) is the universal industry standard."
        },
        {
          w: "The stochastic gradient noise in SGD is a defect that harms optimization.",
          r: "Stochastic noise acts as implicit regularization, helping the optimizer escape " +
            "saddle points and sharp minima, leading to superior real-world generalization."
        },
        {
          w: "SGD always converges to the exact global minimum.",
          r: "In non-convex deep learning loss landscapes, SGD converges to high-quality local " +
            "minima or flat basins, guided by learning rate decay schedules."
        },
        {
          w: "Adaptive optimizers like Adam make SGD obsolete.",
          r: "In computer vision and competitive deep learning benchmarks, properly tuned SGD " +
            "with momentum consistently achieves higher final test accuracy than Adam."
        }
      ],

      trade: {
        buys: [
          "Drastically faster parameter updates: hundreds of updates per epoch rather than one.",
          "Low memory footprint: only mini-batch tensors must reside in GPU memory at any time.",
          "Stochastic noise escapes saddle points and shallow overfitted local minima.",
          "Excellent hardware utilization when mini-batch sizes align with GPU tensor core architectures."
        ],
        costs: [
          "Optimization trajectory oscillates noisily rather than following a smooth monotonic descent.",
          "Requires careful tuning of learning rate schedules, warmup, and momentum coefficients.",
          "Sensitive to mini-batch size selection (batch sizes that are too large degrade generalization).",
          "Can struggle in poorly conditioned loss landscapes without momentum or adaptive scaling."
        ],
        avoid: [
          "Using full-batch gradient descent on multi-million row datasets.",
          "Using batch size 1 on modern GPUs (wastes hardware tensor parallelism).",
          "Training SGD without learning rate decay or momentum schedules."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "learning-rate",

      why: {
        before: "Optimization algorithms calculated gradient vectors pointing in the " +
          "direction of steepest descent, but had no principled scalar to control step size.",
        problem: "Taking full gradient steps causes parameters to wildly overshoot minima, " +
          "exploding loss to infinity (`NaN`), while taking microscopic steps requires years of compute.",
        shift: "**The Learning Rate ($\\eta$): the fundamental optimization step size.** " +
          "A crucial hyperparameter that scales the gradient vector in parameter updates " +
          "($\\theta \\leftarrow \\theta - \\eta \\nabla J(\\theta)$), governing the speed and stability of learning."
      },

      num: {
        t: "Learning rate regimes, diagnostic symptoms & scheduling strategies",
        h: ["Learning Rate Regime", "Loss Trajectory Behavior", "Diagnostic Signature", "Operational Consequence"],
        r: [
          ["**Too Large ($\\eta \\gg \\eta_{\\text{opt}}$)**", "**Explodes exponentially toward infinity**", "**Loss outputs `NaN` / `inf`; parameters diverge**", "**Total training failure; requires immediate restart**"],
          ["**Too Small ($\\eta \\ll \\eta_{\\text{opt}}$)**", "**Flat, microscopically slow descent**", "**Loss barely decreases after hundreds of epochs**", "**Massive waste of cloud compute; traps in plateau**"],
          ["**Optimal ($\\eta = \\eta_{\\text{opt}}$)**", "**Rapid, steady exponential loss decay**", "**Smooth descent curve settling into low minimum**", "**Optimal model convergence and generalization**"],
          ["**Learning Rate Warmup**", "**Linearly ramps $\\eta$ from $0$ over initial steps**", "**Prevents early gradient explosion**", "**Mandatory for stable Transformer and LLM training**"],
          ["**Cosine Annealing Decay**", "**Decays $\\eta$ following cosine curve to near zero**", "**Smoothly settles into deep minimum valleys**", "**Standard schedule in modern deep learning**"]
        ],
        n: "The Learning Rate $\\eta$ is universally acknowledged by deep learning " +
          "pioneers (including Yoshua Bengio) as **the single most critical " +
          "hyperparameter in machine learning**. It controls the magnitude " +
          "of parameter adjustments during gradient descent: $\\theta_{t+1} " +
          "= \\theta_t - \\eta \\mathbf{g}_t$. The mathematical dilemma is " +
          "acute: if $\\eta$ exceeds the threshold $\\frac{2}{\\lambda_{\\max}}$ " +
          "(where $\\lambda_{\\max}$ is the maximum eigenvalue of the loss " +
          "Hessian), the optimization diverges, bouncing uncontrollably " +
          "up the canyon walls of the loss surface. Conversely, an overly " +
          "timid learning rate crawls at glacial speeds, trapping the network " +
          "in suboptimal plateaus. Modern deep learning architectures (especially " +
          "Transformers) employ **Dynamic Learning Rate Schedules**: (1) " +
          "**Linear Warmup**: during initial epochs, random weight initializations " +
          "produce massive, erratic gradients; ramping $\\eta$ from zero over " +
          "the first 2,000 steps stabilizes early representations. (2) " +
          "**Cosine Annealing**: gradually reducing the learning rate toward " +
          "zero allows the optimizer to explore broadly early on, and then " +
          "settle precisely into the deepest, flattest minimum basin."
      },

      miss: [
        {
          w: "A constant learning rate throughout training is optimal.",
          r: "Constant learning rates are suboptimal. High learning rates are required early " +
            "for broad exploration; decaying schedules (cosine, step decay) are required to settle into minima."
        },
        {
          w: "Adaptive optimizers like Adam eliminate the need to tune the learning rate.",
          r: "Adam adapts per-parameter learning rates relative to each other, but still requires " +
            "a base learning rate $\\eta_0$ (default 0.001); selecting the wrong base rate causes divergence."
        },
        {
          w: "Scaling batch size has no impact on the optimal learning rate.",
          r: "By the **Linear Scaling Rule**, when you scale batch size by $k$, you must scale " +
            "the base learning rate by $k$ to maintain consistent gradient update variance."
        },
        {
          w: "If training loss stops improving, you should always increase the learning rate.",
          r: "A loss plateau usually means the learning rate is too large to fit into the narrow " +
            "minimum basin, causing the optimizer to bounce across the valley; reducing $\\eta$ allows it to settle."
        }
      ],

      trade: {
        buys: [
          "Dictates the convergence speed, numerical stability, and final accuracy of training.",
          "Enables fine-grained control over optimization dynamics through schedules and warmup.",
          "Helps models escape sharp, overfitted local minima when set appropriately.",
          "Simple single scalar controlling complex multi-million parameter updates."
        ],
        costs: [
          "Extreme sensitivity: changing $\\eta$ by an order of magnitude can cause complete training collapse.",
          "Requires careful orchestration of warmup and decay schedules across epochs.",
          "Interacts tightly with batch size, momentum, and weight decay hyperparameters.",
          "Loss curves must be monitored in real time to catch early divergence or stalling."
        ],
        avoid: [
          "Training deep networks without learning rate warmup and decay schedules.",
          "Ignoring exploding gradients or loss spikes during initial training epochs.",
          "Scaling batch size without proportionally adjusting the base learning rate."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inference",

      why: {
        before: "Machine learning engineering focused almost exclusively on the training " +
          "pipeline, treating model execution as an identical, unoptimized forward pass.",
        problem: "Serving trained models using heavy training pipelines consumes massive " +
          "memory (holding unnecessary gradient graphs and optimizer states) and introduces " +
          "unacceptable multi-second latencies for real-time user requests.",
        shift: "**Inference: deploying optimized, frozen models for production prediction.** " +
          "Transition from training mode (gradient computation, backward pass, optimizer state, " +
          "dropout) to inference mode (forward-only pass, static weights, quantization, low latency)."
      },

      num: {
        t: "Training vs Inference operational comparison & architectural differences",
        h: ["Dimension", "Training Mode", "Inference Mode"],
        r: [
          ["**Computation Graph**", "**Forward pass + Backward pass (Autograd)**", "**Forward-only pass (`torch.no_grad()`)**"],
          ["**Memory Overhead**", "**High (stores layer activations + optimizer states)**", "**Minimal (discards activations immediately)**"],
          ["**Stochastic Layers**", "**Dropout active; BatchNorm computes batch statistics**", "**Dropout disabled; BatchNorm uses fixed running stats**"],
          ["**Weight Precision**", "**FP32 / BF16 / FP16 mixed precision**", "**Quantized INT8 / INT4 (AWQ, GGUF, GPTQ)**"],
          ["**Key Metrics**", "**Throughput (samples/sec), convergence loss**", "**p99 Latency (ms), Time-To-First-Token, cost per 1k reqs**"],
          ["**Optimization Techniques**", "**Gradient checkpointing, distributed data parallel**", "**Operator fusion, KV-cache, TensorRT, vLLM**"]
        ],
        n: "Inference is the phase where machine learning delivers actual " +
          "economic value: using a frozen, trained model to generate predictions " +
          "on live, unseen production data. The architectural differences " +
          "between training and inference are profound. During training, deep " +
          "learning frameworks must store every intermediate activation tensor " +
          "in VRAM to calculate gradients during backpropagation, and optimizers " +
          "(like Adam) maintain momentum and variance tensors that triple " +
          "memory consumption. During **inference**, all gradient machinery " +
          "is explicitly deactivated (`torch.inference_mode()`). Intermediate " +
          "activations are discarded immediately after forward execution, " +
          "and stochastic layers switch modes: **Dropout is deactivated** " +
          "and **Batch Normalization** switches from dynamic batch statistics " +
          "to fixed population running averages. Production inference optimization " +
          "relies on three pillars: (1) **Quantization**: converting 16-bit " +
          "floating-point weights to 8-bit or 4-bit integers (INT8/INT4), " +
          "slashing memory bandwidth bottlenecks and leveraging integer tensor " +
          "cores; (2) **Graph Optimization & Kernel Fusion**: combining " +
          "consecutive operations (e.g. `Conv2D + BiasAdd + ReLU`) into a single " +
          "fused GPU kernel via **TensorRT** or **ONNX Runtime**; and (3) " +
          "**KV-Caching**: in autoregressive Large Language Models, caching " +
          "key-value attention tensors across token generation steps to prevent " +
          "quadratic recomputation (powered by engines like **vLLM**)."
      },

      miss: [
        {
          w: "Inference requires the exact same GPU hardware resources as training.",
          r: "Inference requires zero gradient tracking and zero optimizer states; it consumes " +
            "a fraction of the memory and compute, comfortably running on CPUs or mobile devices."
        },
        {
          w: "You do not need to alter model code between training and inference.",
          r: "Failing to invoke `model.eval()` leaves Dropout and dynamic BatchNorm active, " +
            "generating erratic, degraded predictions on single production requests."
        },
        {
          w: "Inference latency is solely dictated by model parameter count.",
          r: "Memory bandwidth, operator kernel fusion, KV-cache efficiency, and I/O serialization " +
            "frequently bottleneck real-time inference latency far more than raw parameter count."
        },
        {
          w: "Quantizing a model for inference severely harms predictive accuracy.",
          r: "Modern post-training quantization techniques (INT8, AWQ, GPTQ) compress models " +
            "by 50%–75% while degrading accuracy by less than 0.5%–1.0%."
        }
      ],

      trade: {
        buys: [
          "Delivers real-time predictions to end users with sub-10ms latency SLAs.",
          "Dramatically reduces operational cloud hosting costs through quantization and model compression.",
          "Enables edge deployment directly on mobile smartphones, microcontrollers, and IoT devices.",
          "Eliminates memory overhead by stripping away gradient graphs and optimizer states."
        ],
        costs: [
          "Strict production latency and throughput SLAs demand complex serving infrastructure.",
          "Vulnerability to training-serving skew if preprocessing logic drifts from offline pipelines.",
          "Quantization and optimization passes can introduce subtle numerical discrepancies.",
          "Serving large models (LLMs) requires specialized distributed inference engines (vLLM, TensorRT-LLM)."
        ],
        avoid: [
          "Running production inference without disabling gradient tracking (`torch.inference_mode()`).",
          "Serving models without calling `model.eval()` to freeze Dropout and BatchNorm layers.",
          "Deploying unquantized 32-bit floating point models to latency-sensitive edge environments."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "smote",

      why: {
        before: "Practitioners handled imbalanced classification by randomly duplicating " +
          "minority samples (random oversampling) or discarding majority samples (undersampling).",
        problem: "Randomly duplicating minority instances causes severe overfitting: models " +
          "memorize identical duplicate points in feature space, forming narrow, fragile decision islands.",
        shift: "**Synthetic Minority Over-sampling Technique (SMOTE): interpolate in feature space.** " +
          "Synthesize brand new, plausible minority examples along the vector line segments " +
          "connecting existing minority neighbors in high-dimensional feature space."
      },

      num: {
        t: "SMOTE algorithmic variants & synthesis mechanisms",
        h: ["SMOTE Variant", "Synthesis Strategy", "Handling of Decision Boundaries", "Best Use Case"],
        r: [
          ["**Standard SMOTE**", "**Linear interpolation between $k$-NN minority samples**", "**Uniformly expands minority regions**", "**General continuous numerical tabular datasets**"],
          ["**Borderline-SMOTE**", "**Synthesizes only along the dangerous decision boundary**", "**Focuses on borderline minority points**", "**Complex overlapping classification boundaries**"],
          ["**ADASYN**", "**Adaptive synthesis weighted by difficulty of learning**", "**Synthesizes more points for hard-to-learn samples**", "**Uneven minority density distributions**"],
          ["**SMOTE-NC**", "**Combines Euclidean distance with nominal value sharing**", "**Handles mixed numerical and categorical data**", "**Enterprise tabular data with categoricals**"],
          ["**SMOTE-Tomek**", "**Synthesizes via SMOTE, then cleans noise via Tomek Links**", "**Removes ambiguous overlapping boundary pairs**", "**Noisy datasets with high class overlap**"]
        ],
        n: "SMOTE (Chawla et al., 2002) is the definitive data-level algorithm " +
          "for combating severe class imbalance. The core algorithm operates " +
          "geometrically: for every minority instance $\\mathbf{x}_i$: (1) " +
          "Compute its $k$-nearest neighbors strictly within the minority " +
          "class using Euclidean distance; (2) Randomly select one neighbor " +
          "$\\mathbf{x}_{zi}$; (3) Generate a synthetic instance $\\mathbf{x}_{\\text{new}}$ " +
          "along the line segment: " +
          "$$\\mathbf{x}_{\\text{new}} = \\mathbf{x}_i + \\lambda (\\mathbf{x}_{zi} - \\mathbf{x}_i), \\quad \\lambda \\sim \\mathcal{U}(0, 1)$$ " +
          "Because $\\lambda$ is a uniform random scalar between $0$ and $1$, " +
          "the new synthetic point lies directly on the vector line connecting " +
          "the two genuine observations. This forces decision trees and " +
          "neural networks to learn a larger, smoother convex decision region " +
          "around the minority class rather than overfitting to individual points. " +
          "**The Fatal SMOTE Leakage Trap**: applying SMOTE to the entire " +
          "dataset prior to train/test splitting synthesizes points that blend " +
          "information across train and test boundaries, producing falsely " +
          "miraculous test scores that collapse in production. SMOTE must " +
          "**strictly execute inside cross-validation training folds** " +
          "(using `imblearn.pipeline.Pipeline`)."
      },

      miss: [
        {
          w: "SMOTE can be applied to the full dataset before splitting into train and test.",
          r: "Running SMOTE before splitting synthesizes hybrid points bridging train and test data, " +
            "causing catastrophic data leakage and completely invalidating validation metrics."
        },
        {
          w: "Standard SMOTE works seamlessly on raw categorical string features.",
          r: "Standard SMOTE computes Euclidean distances and continuous linear interpolations. " +
            "Categorical features require specialized variants like **SMOTE-NC** or prior target encoding."
        },
        {
          w: "SMOTE is always superior to algorithmic cost-sensitive loss weighting.",
          r: "Cost-sensitive class weighting (`class_weight='balanced'`) directly modifies " +
            "loss gradients without manufacturing synthetic data, often matching or outperforming SMOTE."
        },
        {
          w: "SMOTE must always be tuned to force a perfect 50/50 class balance.",
          r: "Forcing 50/50 balance on extreme 1:10,000 data synthesizes massive volumes of artificial data " +
            "that distort posterior probabilities; mild oversampling (e.g. 1:10) is frequently optimal."
        }
      ],

      trade: {
        buys: [
          "Overcomes majority class bias without permanently discarding majority data.",
          "Expands minority decision boundaries, preventing exact-duplicate memorization overfitting.",
          "Significantly boosts minority class Recall on fraud, medical, and failure detection tasks.",
          "Rich ecosystem of specialized variants (Borderline-SMOTE, ADASYN, SMOTE-Tomek)."
        ],
        costs: [
          "Can synthesize noisy, implausible points in overlapping multi-class boundary zones.",
          "Increases training dataset size, multiplying model training time and memory.",
          "Ineffective on high-dimensional sparse text data where Euclidean distances concentrate.",
          "Distorts predicted output probabilities, requiring post-hoc probability calibration."
        ],
        avoid: [
          "Applying SMOTE outside of cross-validation pipelines (data leakage).",
          "Applying standard SMOTE to high-dimensional text or categorical data.",
          "Using SMOTE when algorithmic loss weighting (`class_weight='balanced'`) achieves identical results."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "baseline-model",

      why: {
        before: "Data scientists spent weeks engineering complex 50-layer deep neural " +
          "networks or massive ensembles without first establishing a simple reference benchmark.",
        problem: "After weeks of effort, the team could not prove whether their complex " +
          "model was genuinely adding business value, because they had no simple reference " +
          "point to measure against (e.g. did the 90% accuracy model beat predicting the majority class?).",
        shift: "**The Baseline Model: the non-negotiable zero-anchor of empirical machine learning.** " +
          "Build the simplest possible heuristic, statistical, or linear model on day one to " +
          "establish the minimum performance threshold that any complex architecture must beat."
      },

      num: {
        t: "Baseline model hierarchy & progressive benchmarking stages",
        h: ["Baseline Tier", "Model / Implementation", "Operational Complexity", "Purpose / Benchmark Target"],
        r: [
          ["**Tier 0: Trivial Dummy**", "`DummyClassifier` (predict majority) / `DummyRegressor` (mean)", "**Zero (simple statistical summary)**", "**Establishes the absolute performance floor (e.g. 99% accuracy floor)**"],
          ["**Tier 1: Simple Linear / Tree**", "**Logistic Regression, Ridge Regression, Decision Tree Stump**", "**Minimal (10 lines of scikit-learn code)**", "**Proves linear separability; verifies data pipeline health**"],
          ["**Tier 2: Existing Business Rules**", "**Current corporate heuristics, manual underwriting rules**", "**Domain business logic**", "**Proves machine learning delivers positive ROI over legacy systems**"],
          ["**Tier 3: Competitive ML Benchmark**", "**Default XGBoost / LightGBM, standard pre-trained model**", "**Moderate (standard tabular baseline)**", "**Benchmark that custom architectures and deep nets must beat**"]
        ],
        n: "The Baseline Model is the primary intellectual anchor of professional " +
          "machine learning engineering. Building a baseline answers the foundational " +
          "question: **'Is machine learning even needed here, and is our complex " +
          "model earning its keep?'**. The baseline hierarchy progresses through " +
          "three stages: (1) **Trivial Statistical Baselines**: In classification, " +
          "a `DummyClassifier` that always predicts the most frequent class " +
          "(establishing the metric floor); in regression, predicting the historical " +
          "mean or median. (2) **Simple Model Baselines**: a fast, unregularized " +
          "Logistic Regression or shallow Decision Tree implemented in minutes. " +
          "If a complex deep neural network requiring a multi-GPU cluster achieves " +
          "85.2% accuracy while a 5-millisecond Logistic Regression baseline " +
          "achieves 84.8%, **the neural network is an engineering failure** " +
          "that does not justify its operational latency, hosting costs, " +
          "and maintenance burden. (3) **Business Heuristic Baselines**: benchmarking " +
          "against existing manual rules to demonstrate financial ROI. Furthermore, " +
          "building a baseline on day one acts as a **pipeline sanity check**: " +
          "if the simple baseline scores 100% accuracy, you have caught a data " +
          "leakage bug in 5 minutes rather than discovering it after weeks " +
          "of deep learning engineering."
      },

      miss: [
        {
          w: "Building a baseline model is a waste of time when you know you will use deep learning.",
          r: "Without a baseline, you cannot detect data leakage, verify pipeline integrity, " +
            "or prove that a deep network is actually outperforming simple, cost-effective models."
        },
        {
          w: "A baseline must always be a machine learning model.",
          r: "The best initial baseline is often a non-ML domain heuristic: predicting yesterday's " +
            "value in time-series, or applying historical manual business rules."
        },
        {
          w: "A complex model that beats the baseline by 0.1% should always be deployed.",
          r: "A microscopic accuracy gain does not justify the massive latency, compute cost, " +
            "and technical debt of a complex model; the gain must outweigh the complexity tax."
        },
        {
          w: "Baseline models do not need to be evaluated on proper validation splits.",
          r: "Baselines must be evaluated against the exact same cross-validation and test splits " +
            "as complex models to guarantee an honest, apples-to-apples comparison."
        }
      ],

      trade: {
        buys: [
          "Establishes an honest, objective reference point proving whether complex models justify their cost.",
          "Instantly catches data leakage, target contamination, and pipeline bugs on day one.",
          "Provides an immediate working end-to-end prototype deployed to production early.",
          "Protects teams from spending months building over-engineered deep learning failures."
        ],
        costs: [
          "Requires engineering discipline to build and benchmark before jumping into complex modeling.",
          "Simple baseline performance can disappoint stakeholders expecting glamorous AI marketing.",
          "Requires maintaining and evaluating multiple models in experimentation tracking suites.",
          "Can reveal uncomfortable truths: that expensive ML models add negligible value over simple rules."
        ],
        avoid: [
          "Skipping baseline models on any new machine learning project.",
          "Evaluating baselines and candidate models on different data splits.",
          "Deploying complex deep learning architectures that do not meaningfully outperform simple baselines."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
