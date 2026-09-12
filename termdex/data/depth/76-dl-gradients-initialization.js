/* ==========================================================================
   Depth pass 76 — Deep Learning batch 4: gradient dynamics, initialization & CNN basics.
   Early Stopping, Vanishing Gradient, Exploding Gradient, Gradient Clipping,
   Weight Initialisation, Convolutional Neural Network, Convolution, Kernel.

   Gradient norms govern training stability across deep computational chains;
   local spatial parameter sharing exploits translation equivariance in vision tensors.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "early-stopping",

      why: {
        before: "Practitioners trained models for an arbitrary, fixed number of epochs (e.g. exactly 100 epochs), " +
          "frequently stopping too early (underfitting) or training far too long (severe overfitting).",
        problem: "As training progresses, the training loss decreases monotonically while validation loss " +
          "reaches an optimal minimum and then starts climbing, causing model generalization to degrade.",
        shift: "**Early Stopping: Validation-monitored checkpoint halting.** " +
          "Continuously track validation metrics at epoch boundaries, terminating training automatically " +
          "when validation performance fails to improve after a specified patience threshold $P$, and restoring the optimal checkpoint."
      },

      num: {
        t: "Early stopping hyperparameters & operational mechanics",
        h: ["Parameter / Component", "Mathematical / Operational Meaning", "Typical Default Value", "Behavioral Impact"],
        r: [
          ["**Patience ($P$)**", "Number of consecutive evaluation epochs tolerated without validation metric improvement", "$P = 5 - 15$ epochs", "Larger patience tolerates temporary noisy validation dips"],
          ["**Minimum Delta ($\\Delta_{\\min}$)**", "Minimum absolute improvement required to reset the patience counter", "$10^{-4}$ or $0.001$", "Prevents minute floating-point noise from resetting patience"],
          ["**Monitored Metric**", "Validation Loss ($\\mathcal{L}_{\\text{val}}$) or Validation Score (ROC-AUC / F1)", "`val_loss` (minimization)", "Loss is smoother than thresholded accuracy metrics"],
          ["**Restore Best Weights**", "Re-loads model parameter state from epoch $e^* = \\arg\\min \\mathcal{L}_{\\text{val}}$", "**True** (mandatory)", "Discards degraded parameters accumulated during the patience window"],
          ["**Implicit Regularization**", "Acts as an effective capacity constraint: $\\|W_t - W_0\\| \\le \\eta t \\|G\\|$", "Proportional to stopping time $t$", "Mathematically equivalent to L2 weight decay (Sjöberg 1995)"]
        ],
        n: "Early Stopping is the most practical and universal implicit regularizer " +
          "in deep learning. During iterative optimization, training error monotonically decays, " +
          "but generalization error follows a **U-shaped curve**: initial optimization reduces both " +
          "bias and variance by capturing true structural patterns, but after epoch $e^*$, the model " +
          "begins memorizing the idiosyncratic noise of the training split, causing out-of-sample " +
          "validation loss to escalate. In mathematical learning theory, Sjöberg and Ljung (1995) " +
          "proved that early stopping is **asymptotically equivalent to L2 weight decay**: " +
          "by bounding the total optimization steps $t$, parameter vectors are restricted to a " +
          "bounded sphere around initialization ($\\theta_t \\approx \\theta_0 - t \\eta \\nabla \\mathcal{L}$), " +
          "preventing weights from exploding. A production early stopping callback monitors " +
          "validation loss, maintains a counter of non-improving checks, and upon hitting `patience` $P$, " +
          "terminates the training loop and executes `model.load_state_dict(best_weights)` to restore " +
          "the optimal historical checkpoint."
      },

      miss: [
        {
          w: "Early stopping should monitor training loss rather than validation loss.",
          r: "Training loss almost always continues to decrease toward zero. Monitoring training loss would never trigger early stopping; early stopping strictly requires an untouched validation dataset."
        },
        {
          w: "When early stopping triggers, the model in memory is automatically at its best performance.",
          r: "When training halts, the model has spent P epochs degrading! You must explicitly serialize the best checkpoint and reload it (`restore_best_weights=True`) upon stopping."
        },
        {
          w: "A patience of 1 epoch is sufficient for clean datasets.",
          r: "Validation loss exhibits natural stochastic jitter due to mini-batch noise and data sampling. A patience of 1 will prematurely terminate training at the very first noisy plateau."
        },
        {
          w: "Early stopping is only useful when compute budgets are constrained.",
          r: "Early stopping is a fundamental statistical regularizer. Even with infinite compute budgets, training past the validation minimum degrades out-of-sample test accuracy."
        }
      ],

      trade: {
        buys: [
          "Zero hyperparameter guesswork: automatically discovers the optimal training duration for any dataset.",
          "Guarantees the model checkpoint with maximal out-of-sample generalization is saved for deployment.",
          "Saves substantial cloud compute and GPU hours by terminating fruitless training runs early."
        ],
        costs: [
          "Requires withholding a dedicated validation split from the training dataset.",
          "Noisy validation splits can trigger premature stopping before the learning rate schedule decays.",
          "Small patience values can halt training during a legitimate optimization plateau preceding a major loss drop."
        ],
        avoid: [
          "Setting `patience` too small ($P \\le 2$) when using stochastic validation subsets.",
          "Forgetting to restore the best checkpoint weights after training terminates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "vanishing-gradient",

      why: {
        before: "Deep networks (especially RNNs and networks deeper than 5-10 layers) completely failed to train, " +
          "with early layers retaining their random initialization while only the final output layer showed any learning.",
        problem: "During backpropagation, error gradients are multiplied across successive layer Jacobian matrices; " +
          "if derivatives are less than 1.0, the signal decays exponentially with depth: $\\delta^{[1]} \\propto \\gamma^L \\to 0$.",
        shift: "**Vanishing Gradient Problem (Hochreiter 1991, Bengio 1994): Exponential gradient attenuation.** " +
          "Understood through multivariable calculus chain-rule decay, resolved via non-saturating activations (ReLU), " +
          "residual skip connections (ResNet), gating mechanisms (LSTM), and normalization layers."
      },

      num: {
        t: "Vanishing gradient decay mechanics & architectural solutions",
        h: ["Architectural Factor", "Mathematical Formulation / Cause", "Impact on Gradient Flow", "Modern Solution"],
        r: [
          ["**Saturating Activations**", "$\\sigma'(z) \\le 0.25$ (Sigmoid); $\\tanh'(z) \\le 1.0$", "Decays by at least $(0.25)^L$ across $L$ layers", "**ReLU / GELU**: constant derivative of $1.0$ for positive inputs"],
          ["**Weight Magnitude Decay**", "$\\prod_{l=1}^L W^{[l]T}$ with spectral radius $\\rho(W) < 1$", "Singular values decay exponentially: $\\sigma_{\\max}^L \\to 0$", "**He / Xavier Initialization**: sets $\\text{Var}(W) = 2/n_{\\text{in}}$"],
          ["**Sequential Time Unrolling**", "$\\frac{\\partial h_T}{\\partial h_1} = \\prod_{t=2}^T W_{hh}^T \\text{diag}(\\sigma')$", "Vanishes across long sequence horizons $T > 50$", "**LSTM / GRU**: additive constant error carousel ($c_t = c_{t-1} + \\dots$)"],
          ["**Deep Layer Stacking**", "$\\nabla_{x_l} \\mathcal{L} = \\nabla_{x_L} \\mathcal{L} \\prod_{k=l}^{L-1} J_k$", "Vanishes in standard feedforward networks ($L > 20$)", "**Residual Connections**: $\\nabla \\mathcal{L} (I + \\nabla F)$, creating gradient highways"]
        ],
        n: "The Vanishing Gradient problem was the central theoretical barrier " +
          "that prevented deep neural networks from functioning for over two decades. " +
          "Mathematically, the gradient of the loss $\\mathcal{L}$ with respect to the " +
          "activations of an early layer $l$ in an $L$-layer network is computed via the chain rule: " +
          "$\\frac{\\partial \\mathcal{L}}{\\partial a^{[l]}} = \\frac{\\partial \\mathcal{L}}{\\partial a^{[L]}} " +
          "\\prod_{k=l}^{L-1} \\left( W^{[k+1]T} \\cdot \\text{diag}(\\sigma'(z^{[k]})) \\right)$. " +
          "This product chains together $L-l$ matrix multiplications. If the eigenvalues of the weight " +
          "matrices are smaller than 1, or if the activation functions have derivatives bounded below 1 " +
          "(such as Sigmoid where $\\sigma'(z) \\le 0.25$), the magnitude of the gradient shrinks " +
          "**exponentially with network depth** ($\\propto \\lambda^{L-l}$). " +
          "By the time the error signal reaches layer 1, it has diminished to machine epsilon, " +
          "leaving the earliest feature representations frozen at their random initial states. " +
          "The problem was systematically defeated through three architectural breakthroughs: " +
          "(1) **Non-saturating activations** (ReLU provides $\\sigma'(z)=1$), (2) **Variance-preserving " +
          "weight initialization** (Kaiming He initialization), and (3) **Residual Connections** (ResNet), " +
          "which introduce an additive identity operator $\\frac{\\partial (x + F(x))}{\\partial x} = I + \\frac{\\partial F}{\\partial x}$, " +
          "allowing gradients to flow backward through hundreds of layers without attenuation."
      },

      miss: [
        {
          w: "The vanishing gradient problem only affects Recurrent Neural Networks (RNNs).",
          r: "Vanishing gradients plague any deep computational graph, including feedforward MLPs, deep CNNs, and Transformers if residual connections and proper initializations are absent."
        },
        {
          w: "Increasing the learning rate by 1,000x fixes vanishing gradients.",
          r: "Increasing the global learning rate causes later layers (which have healthy gradients) to immediately explode and diverge, destroying model parameters while early layers remain starved."
        },
        {
          w: "ReLU completely guarantees that gradients can never vanish.",
          r: "While positive ReLU neurons have a gradient of 1, negative inputs have a gradient of exactly 0. If a large fraction of neurons become inactive ('Dying ReLU'), gradients still vanish completely."
        },
        {
          w: "Gradient clipping cures vanishing gradients.",
          r: "Gradient clipping only fixes EXPLODING gradients by capping large values; it cannot amplify vanishing gradients that have already decayed to numerical zero."
        }
      ],

      trade: {
        buys: [
          "Understanding vanishing gradients led directly to the invention of ResNets, LSTMs, and modern Transformer backbones.",
          "Guarantees that early representation layers receive healthy parameter updates proportional to final task error.",
          "Unlocks the capability to train ultra-deep networks spanning hundreds or thousands of layers."
        ],
        costs: [
          "Requires structural architectural constraints: residual highways, normalization layers, and specific activation families.",
          "Demands careful initialization protocols (Xavier, Kaiming, Orthogonal) tailored to specific activation functions.",
          "Additional memory needed to support skip-connection tensors across long computational chains."
        ],
        avoid: [
          "Stacking more than 5 dense or convolutional layers with Sigmoid or Tanh activations without residual connections.",
          "Using standard un-gated vanilla RNNs for sequences longer than 20 time steps."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "exploding-gradient",

      why: {
        before: "Deep networks and recurrent architectures would train smoothly for several epochs " +
          "before suddenly outputting `NaN` (Not a Number) loss, crashing training runs and destroying parameter weights.",
        problem: "When the spectral norm of weight matrices exceeds 1.0 across deep computational chains, " +
          "gradients compound exponentially: $\\delta^{[1]} \\propto \\gamma^L \\to \\infty$, causing catastrophic arithmetic overflow.",
        shift: "**Exploding Gradient Problem: Exponential gradient amplification.** " +
          "Recognized as the mathematical dual of vanishing gradients, solved via Gradient Clipping, " +
          "Layer/Batch Normalization, weight decay, and spectral radius control."
      },

      num: {
        t: "Exploding gradient symptoms, mathematics & mitigation techniques",
        h: ["Component / Failure Mode", "Mathematical Symptom", "Numerical Consequence", "Standard Defense Mechanism"],
        r: [
          ["**Spectral Norm Explosion**", "$\\sigma_{\\max}(W) > 1.0 \\implies \\|W^L\\| \\to \\infty$", "Gradient magnitude grows exponentially: $\\mathcal{O}(\\lambda^L)$", "**Weight Decay / Spectral Normalization**"],
          ["**Recurrent Temporal Unrolling**", "$\\prod_{t=1}^T W_{hh}^T \\to \\infty$ for long sequences", "Gradients explode across time steps $T > 100$", "**Norm-Based Gradient Clipping** (`clip_grad_norm_`)"],
          ["**Floating-Point Overflow**", "Gradient exceeds IEEE 754 float32 max ($> 3.4 \\times 10^{38}$)", "**Loss becomes `NaN` or `Inf`**; weights corrupted permanently", "**FP16 Dynamic Loss Scaling**"],
          ["**Excessive Learning Rate**", "$\\Delta \\theta = -\\eta \\nabla \\mathcal{L}$ takes astronomical steps", "Pushes parameters into extreme saturation zones", "**Learning Rate Warmup & AdamW**"]
        ],
        n: "The Exploding Gradient problem is the inverse mathematical failure mode " +
          "of vanishing gradients. In deep networks and especially **Recurrent Neural Networks " +
          "(RNNs)** where the exact same hidden transition matrix $W_{hh}$ is multiplied across " +
          "$T$ sequential time steps, the gradient calculation involves the matrix power $W_{hh}^T$. " +
          "If the largest singular value (spectral radius) $\\rho(W_{hh}) > 1.0$, the gradient " +
          "grows exponentially with sequence length: $\\|\\nabla_{h_0} \\mathcal{L}\\| \\propto \\rho^T$. " +
          "When an exploding gradient occurs, parameter updates take massive leaps across the loss " +
          "landscape, catapulting weights into regions of extreme numerical saturation where the loss " +
          "overflows the IEEE 754 floating-point standard, producing fatal **`NaN` (Not a Number)** values. " +
          "Once a parameter tensor contains a single `NaN`, all subsequent forward and backward passes " +
          "propagate `NaN` everywhere, irreversibly corrupting the model checkpoint. " +
          "The two primary defenses are **Gradient Clipping** (enforcing a hard upper bound on the gradient norm) " +
          "and **Normalization Layers** (BatchNorm, LayerNorm), which continually rescale activations."
      },

      miss: [
        {
          w: "If a model outputs `loss = NaN`, training will automatically recover if you keep running.",
          r: "In IEEE 754 floating-point arithmetic, any mathematical operation involving NaN yields NaN ($x + \\text{NaN} = \\text{NaN}$). Once weights become NaN, the model is permanently destroyed and cannot recover without reverting to an earlier checkpoint."
        },
        {
          w: "Exploding gradients only happen in recurrent networks (RNNs).",
          r: "Deep feedforward networks, Transformers without LayerNorm, and poorly initialized CNNs regularly suffer from exploding gradients, especially when learning rates are set too high."
        },
        {
          w: "Reducing the learning rate to zero is the only way to prevent exploding gradients.",
          r: "Gradient clipping by norm ($L_2$) bounds gradient vectors directly, allowing models to train stably with high, productive learning rates without risking explosion."
        },
        {
          w: "Exploding gradients can be fixed by switching from float32 to float16.",
          r: "Float16 has a vastly narrower dynamic range (maximum value $65,504$) compared to Float32 ($3.4 \\times 10^{38}$), making Float16 significantly MORE vulnerable to exploding gradients."
        }
      ],

      trade: {
        buys: [
          "Prevents catastrophic training crashes: protects multi-week GPU training runs from `NaN` corruption.",
          "Permits aggressive learning rates: models can take larger productive steps without risking arithmetic overflow.",
          "Stabilizes deep sequence models and recurrent state transitions across thousands of tokens."
        ],
        costs: [
          "Requires adding gradient norm calculation and synchronization overhead across distributed GPU nodes.",
          "Can mask underlying architectural bugs (e.g. broken loss formulations or un-normalized inputs).",
          "Clipping gradients too aggressively truncates informative steep gradient signals."
        ],
        avoid: [
          "Continuing a training run after observing `NaN` loss without restoring a previous clean checkpoint.",
          "Training deep RNNs or Transformer architectures without setting `max_norm` gradient clipping."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gradient-clipping",

      why: {
        before: "When gradients exploded in recurrent networks or deep Transformers, parameters took " +
          "enormous steps that destroyed learned representations and triggered catastrophic `NaN` floating-point overflow.",
        problem: "Deep loss landscapes frequently contain steep 'cliffs' or pathological curvature; " +
          "a single mini-batch hitting a cliff produces a massive gradient vector that catapults weights out of the optimization basin.",
        shift: "**Gradient Clipping (Pascanu, Mikolov & Bengio 2013): Bounding gradient update magnitude.** " +
          "Rescale gradient vectors whenever their total $L_2$ norm exceeds a threshold $c$: " +
          "$g \\leftarrow g \\cdot \\frac{c}{\\max(\\|g\\|_2, c)}$, preserving exact gradient direction while enforcing a strict ceiling on step size."
      },

      num: {
        t: "Gradient clipping strategies: Norm-based vs Value-based",
        h: ["Clipping Strategy", "Mathematical Formula", "Preserves Gradient Direction?", "Standard Practice / Use Case"],
        r: [
          ["**Clip by Global Norm (L2)**", "$g \\leftarrow g \\cdot \\frac{c}{\\max(\\|g\\|_2, c)}$", "**Yes** (scales entire vector uniformly)", "**Universal standard**: PyTorch `clip_grad_norm_` (typically $c = 1.0$)"],
          ["**Clip by Value (Element-wise)**", "$g_i \\leftarrow \\max(\\min(g_i, c), -c)$", "**No** (distorts direction by capping individual elements)", "Rarely used; can point optimizer in incorrect direction"],
          ["**Standard Threshold ($c$)**", "$c \\in [0.5, 5.0]$ (typically $1.0$)", "N/A", "Threshold chosen to trigger only on rare explosive anomalies"],
          ["**Distributed Communication**", "Compute global $\\|g\\|_2 = \\sqrt{\\sum \\|g_i\\|^2}$ across all GPUs", "Requires an `AllReduce` global norm sync", "Executes immediately before `optimizer.step()`"]
        ],
        n: "Gradient Clipping was popularized by Razvan Pascanu, Tomas Mikolov, " +
          "and Yoshua Bengio in 2013 to stabilize Recurrent Neural Networks. " +
          "When optimization traverses near a steep cliff in the loss landscape, " +
          "the gradient vector $\\nabla_\\theta \\mathcal{L}$ shoots to an astronomical magnitude, " +
          "which would otherwise fling the parameters into unrecoverable space. " +
          "There are two primary paradigms: **Clip by Value** (which clamps each element $g_i$ " +
          "to $[-c, c]$, but drastically alters the *direction* of the gradient vector) and " +
          "**Clip by Global Norm** (which computes the global $L_2$ norm across ALL model parameters: " +
          "$\\|g\\| = \\sqrt{\\sum_i \\|g_i\\|^2}$). If $\\|g\\| > c$, the entire gradient vector is scaled down: " +
          "$g \\leftarrow g \\cdot \\frac{c}{\\|g\\|}$. " +
          "Crucially, **norm-based clipping preserves the exact geometric direction of the gradient vector**, " +
          "simply shortening its stride to a safe length $c$. In modern LLM pre-training pipelines " +
          "(e.g. Llama, GPT-3), gradient clipping with a threshold of $c = 1.0$ is a mandatory safety " +
          "mechanism executed on every single iteration."
      },

      miss: [
        {
          w: "Gradient clipping should be applied after calling `optimizer.step()`.",
          r: "Gradient clipping must be executed strictly BEFORE `optimizer.step()` and AFTER `loss.backward()`. Clipping after the optimizer step has zero effect, as weights have already updated using the unclipped gradients."
        },
        {
          w: "Clipping by value is equivalent to clipping by norm.",
          r: "Clipping by value distorts the vector direction by clamping coordinates independently. Clipping by norm scales all coordinates by the exact same scalar factor, perfectly preserving the gradient's descent trajectory."
        },
        {
          w: "A lower clipping threshold (e.g. c = 0.001) is always safer and better.",
          r: "Setting c too small severely truncates healthy, productive gradients, slowing down optimization to an unviable crawl. Typical production thresholds range between 0.5 and 5.0."
        },
        {
          w: "Gradient clipping solves the vanishing gradient problem.",
          r: "Gradient clipping only sets an upper bound on large gradients; it has zero impact on gradients that have vanished toward zero."
        }
      ],

      trade: {
        buys: [
          "Rock-solid stability against `NaN` loss explosions and unstable loss landscape cliffs.",
          "Preserves the true directional vector of gradient descent when clipping by global $L_2$ norm.",
          "Essential insurance policy for multi-million dollar large-scale foundation model pre-training runs."
        ],
        costs: [
          "Adds an extra reduction pass across all model parameters to compute the global $L_2$ norm.",
          "In distributed Data-Parallel setups, requires cross-GPU synchronization of scalar gradient norms.",
          "Does not treat the underlying root cause of high curvature or poor initialization."
        ],
        avoid: [
          "Placing `clip_grad_norm_()` after `optimizer.step()` in PyTorch training loops.",
          "Using element-wise value clipping instead of global norm clipping in complex neural architectures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "weight-initialisation",

      why: {
        before: "Initializing deep networks with random Gaussian numbers of arbitrary variance " +
          "caused activations and gradients to either vanish to zero or explode to infinity within the first 3 layers.",
        problem: "Linear transformations compound across layers: if the variance of activations changes from layer to layer, " +
          "deep networks become completely untrainable before the very first gradient step is taken.",
        shift: "**Variance-Preserving Weight Initialisation: Matching layer fan-in and fan-out.** " +
          "Scale initial random weights based on the number of input ($n_{\\text{in}}$) and output ($n_{\\text{out}}$) neurons, " +
          "using Xavier/Glorot initialisation for symmetric activations and He/Kaiming initialisation for ReLU."
      },

      num: {
        t: "Weight initialisation schemes, mathematical variance & activation pairing",
        h: ["Initialisation Scheme", "Uniform Distribution Range", "Normal Distribution Variance", "Target Activation Function"],
        r: [
          ["**Xavier / Glorot (2010)**", "$U\\left(-\\sqrt{\\frac{6}{n_{\\text{in}} + n_{\\text{out}}}}, +\\sqrt{\\frac{6}{n_{\\text{in}} + n_{\\text{out}}}}\\right)$", "$\\text{Var}(W) = \\frac{2}{n_{\\text{in}} + n_{\\text{out}}}$", "**Tanh, Sigmoid**, Softmax (symmetric around zero)"],
          ["**He / Kaiming (2015)**", "$U\\left(-\\sqrt{\\frac{6}{n_{\\text{in}}}}, +\\sqrt{\\frac{6}{n_{\\text{in}}}}\\right)$", "**$\\text{Var}(W) = \\frac{2}{n_{\\text{in}}}$**", "**ReLU, Leaky ReLU, GELU** (compensates for 50% zeroed activations)"],
          ["**LeCun (1998)**", "$U\\left(-\\sqrt{\\frac{3}{n_{\\text{in}}}}, +\\sqrt{\\frac{3}{n_{\\text{in}}}}\\right)$", "$\\text{Var}(W) = \\frac{1}{n_{\\text{in}}}$", "Scaled Tanh / SELU"],
          ["**Orthogonal Initialization**", "Draw random matrix, compute QR decomposition $W = Q$", "Eigenvalues on unit circle", "**Recurrent Neural Networks (RNNs)** (prevents exponential state growth)"],
          ["**Zero Initialization**", "$W_{ij} = 0$", "$\\text{Var}(W) = 0$", "**FATAL ERROR**: causes complete gradient symmetry failure"]
        ],
        n: "Weight initialization determines whether a deep neural network will " +
          "survive its very first forward pass. Consider a linear layer $y = \\sum_{i=1}^{n_{\\text{in}}} W_i x_i$. " +
          "Assuming inputs $x$ and weights $W$ are independent with zero mean, the variance " +
          "of the output is: $\\text{Var}(y) = n_{\\text{in}} \\text{Var}(W) \\text{Var}(x)$. " +
          "To keep activation variance constant across layers ($\\text{Var}(y) = \\text{Var}(x)$), " +
          "the weights must satisfy $\\text{Var}(W) = \\frac{1}{n_{\\text{in}}}$. " +
          "In 2010, Xavier Glorot and Yoshua Bengio balanced both forward activation flow " +
          "and backward gradient flow, deriving **Glorot (Xavier) Initialization**: " +
          "$\\text{Var}(W) = \\frac{2}{n_{\\text{in}} + n_{\\text{out}}}$. " +
          "However, Xavier initialization assumes linear or zero-centered symmetric activations (Tanh). " +
          "When applied to **ReLU**, which zeroes out roughly 50% of all activations, " +
          "the forward signal's variance is halved at every layer! In a 30-layer network, " +
          "activations vanish by a factor of $(1/2)^{30} \\approx 10^{-9}$. " +
          "In 2015, Kaiming He et al. solved this by introducing an extra factor of 2, deriving " +
          "**He (Kaiming) Initialization**: $\\text{Var}(W) = \\frac{2}{n_{\\text{in}}}$, perfectly " +
          "compensating for the dead half of the ReLU distribution and enabling the training of ResNet-152."
      },

      miss: [
        {
          w: "Initializing all weights to small random numbers like 0.01 is always safe.",
          r: "Using a fixed variance like 0.01 ignores layer width: in a layer with 10,000 inputs, variance explodes; in a layer with 10 inputs, signals vanish. Scaling by fan-in ($1/n$) is mathematically required."
        },
        {
          w: "Xavier and He initialization produce identical results on ReLU networks.",
          r: "Xavier lacks the factor of 2 needed to compensate for ReLU's one-sided thresholding. Using Xavier on deep ReLU networks causes forward activations to decay exponentially to zero with depth."
        },
        {
          w: "Biases must be initialized using the same variance formulas as weights.",
          r: "Biases do not participate in multiplicative chains and can safely be initialized to zero. For ReLU, a tiny positive bias (0.01) is sometimes used to prevent neurons from starting dead."
        },
        {
          w: "Batch Normalization makes weight initialization completely irrelevant.",
          r: "While BatchNorm provides robustness against moderate initialization errors, improper initialization can still cause the very first forward/backward pass to explode or saturate before running stats stabilize."
        }
      ],

      trade: {
        buys: [
          "Preserves signal variance and gradient norms across dozens of layers from step zero.",
          "Enables immediate, stable convergence without requiring weeks of trial-and-error hyperparameter tuning.",
          "Theoretical foundation that unlocked ultra-deep architectures like ResNet (152+ layers)."
        ],
        costs: [
          "Must be strictly matched to the chosen activation function (Xavier for Tanh, Kaiming for ReLU).",
          "LayerNorm and Residual skip connections interact with initialization, requiring specialized scalings (e.g. DeepNorm or $\\frac{1}{\\sqrt{2L}}$).",
          "Does not eliminate the need for learning rate warmup in large Transformer models."
        ],
        avoid: [
          "Using Xavier/Glorot initialization when training deep ReLU networks (use Kaiming/He instead).",
          "Initializing weight matrices to all zeros or identical constant numbers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "convolutional-neural-network",

      why: {
        before: "Fully connected MLPs flattened 2D images into 1D vectors, destroying spatial pixel locality, " +
          "requiring billions of parameters, and failing to recognize objects if they shifted by a single pixel.",
        problem: "A $1000 \\times 1000$ RGB image has $3 \\times 10^6$ inputs; connecting to a hidden layer of 1,000 units " +
          "requires 3 billion parameters, causing immediate GPU memory exhaustion and catastrophic overfitting.",
        shift: "**Convolutional Neural Network (CNN / ConvNet, LeCun 1989): Spatial parameter sharing & translation equivariance.** " +
          "Slide small parameterized spatial filters (kernels) across input tensors, enforcing local connectivity " +
          "and weight sharing to extract hierarchical feature maps while drastically reducing parameter count."
      },

      num: {
        t: "CNN inductive biases & parameter scaling vs Dense MLP",
        h: ["Dimension / Property", "Dense Multilayer Perceptron (MLP)", "Convolutional Neural Network (CNN)"],
        r: [
          ["**Connectivity Pattern**", "**Fully Connected**: every input connects to every output", "**Locally Connected**: neurons connect only to local $k \\times k$ patch"],
          ["**Parameter Reusability**", "**Zero**: each weight used exactly once per sample", "**Weight Sharing**: the same $3 \\times 3$ kernel scans the entire image"],
          ["**Inductive Bias**", "None (permutation invariant)", "**Translation Equivariance**: $f(g(x)) = g(f(x))$"],
          ["**Parameters ($1000\\times1000$ image, $64$ filters)**", "$3 \\times 10^6 \\times 64 = **192,000,000$ weights**", "$64 \\times (3 \\times 3 \\times 3) = **1,728$ weights** ($>99.99\\%$ reduction!)"],
          ["**Hierarchical Representation**", "Disorganized, non-spatial hidden states", "**Layer hierarchy**: Edges $\\to$ Textures $\\to$ Parts $\\to$ Semantic Objects"]
        ],
        n: "Convolutional Neural Networks (CNNs) revolutionized visual computing " +
          "by hardcoding two powerful physical **inductive biases** into the network architecture: " +
          "(1) **Local Receptive Fields**: pixels that are close together are spatially correlated and " +
          "form coherent structures (edges, corners), so artificial neurons only process small localized patches; " +
          "and (2) **Translation Equivariance (Weight Sharing)**: a visual feature (such as a horizontal edge " +
          "or cat's ear) has the same semantic meaning regardless of where it appears in the image. " +
          "Instead of learning separate weights for every pixel coordinate, a CNN learns a small set of " +
          "spatial filters (e.g. $3 \\times 3$ kernels) that slide across the entire input grid. " +
          "As data flows deeper through successive convolutional and pooling layers, the **effective receptive " +
          "field** of neurons expands exponentially, allowing early layers to detect elementary edges, " +
          "middle layers to recognize motifs and textures, and deep layers to assemble complex semantic " +
          "concepts (e.g. faces, cars). This architecture unlocked landmark models from **LeNet-5 (1998)** " +
          "to **AlexNet (2012)** and modern **ConvNeXt**."
      },

      miss: [
        {
          w: "CNNs are completely invariant to image rotation and scale changes.",
          r: "Standard CNNs are translation equivariant, but they are NOT inherently invariant to rotation, scaling, or 3D viewpoint changes. Rotation and scale robustness must be learned via data augmentation."
        },
        {
          w: "CNNs can only process 2D spatial images.",
          r: "CNNs operate across any grid-structured data: 1D CNNs process temporal audio and time series signals; 3D CNNs process volumetric MRI medical scans and video spatio-temporal frames."
        },
        {
          w: "Larger convolutional kernels (e.g. 11x11, 7x7) are always superior to small kernels.",
          r: "VGGNet (2014) proved that stacking two 3x3 kernels covers the exact same 5x5 receptive field with 28% fewer parameters and twice the non-linear activations. Modern CNNs use 3x3 kernels almost exclusively."
        },
        {
          w: "CNNs have been made obsolete by Vision Transformers (ViT).",
          r: "Modern modernized CNN architectures (like ConvNeXt) match Vision Transformers in accuracy while retaining faster inference speeds, zero quadratic token overhead, and superior performance on small datasets."
        }
      ],

      trade: {
        buys: [
          "Drastic parameter efficiency: weight sharing slashes parameter counts by 99.9% compared to fully connected layers.",
          "Translation equivariance: naturally detects objects regardless of their spatial coordinate placement in the frame.",
          "Hardware-friendly execution: maps directly to highly optimized cuDNN Winograd and `im2col` GEMM GPU routines."
        ],
        costs: [
          "Fixed grid structure constraint: cannot natively process unstructured graph or point-cloud topologies without mesh voxelization.",
          "Limited global context: receptive fields grow slowly with depth, requiring deep stacks to capture distant spatial correlations.",
          "Sensitive to adversarial spatial perturbations and optical illusions."
        ],
        avoid: [
          "Using fully connected dense layers on raw high-resolution image inputs.",
          "Training vision models without spatial data augmentations (flips, crops, jitter) to build rotation and scale invariance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "convolution",

      why: {
        before: "Image processing relied on classical analytical signal processing convolutions " +
          "with hand-crafted static coefficients (Sobel edge detectors, Laplacian sharpening, Gaussian blur filters).",
        problem: "Hand-crafted filters cannot adapt to complex real-world visual variations or multi-channel sensor data; " +
          "computer vision required a differentiable sliding-window operator whose filter values could be learned via backpropagation.",
        shift: "**Neural Convolution (Discrete Cross-Correlation): Learnable multi-channel tensor filtering.** " +
          "Compute the inner product between a sliding kernel tensor and local input receptive fields: " +
          "$(I * K)(i, j) = \\sum_c \\sum_m \\sum_n I(c, i+m, j+n) K(c, m, n)$, learning optimal spatial filters directly from task loss."
      },

      num: {
        t: "Convolutional output dimension formulas & computational algorithms",
        h: ["Formula / Algorithm", "Mathematical Expression", "Operational Significance"],
        r: [
          ["**Output Spatial Dimension**", "$O = \\left\\lfloor \\frac{W - K + 2P}{S} \\right\\rfloor + 1$", "Calculates exact feature map height/width given input $W$, kernel $K$, padding $P$, stride $S$"],
          ["**FLOPs per Conv Layer**", "$2 \\cdot H_{\\text{out}} \\cdot W_{\\text{out}} \\cdot (C_{\\text{in}} \\cdot K_h \\cdot K_w) \\cdot C_{\\text{out}}$", "Floating-point operations required for forward execution"],
          ["**`im2col` + GEMM**", "Unrolls receptive fields into columns: $X_{\\text{col}} \\in \\mathbb{R}^{(C_{\\text{in}} K^2) \\times (H_{\\text{out}} W_{\\text{out}})}$", "Converts spatial sliding window into standard high-speed BLAS matrix multiplication"],
          ["**Winograd Minimal Filtering**", "Transforms $3 \\times 3$ conv into domain transform: $F(2 \\times 2, 3 \\times 3)$", "Reduces multiplication count by **$2.25\\times$**; standard in cuDNN for $3 \\times 3$ convs"],
          ["**Cross-Correlation Reality**", "Deep learning 'convolution' omits the $180^\\circ$ kernel flip", "Mathematically cross-correlation; weights are learned, making the flip irrelevant"]
        ],
        n: "In deep learning, the operation called **convolution** is technically " +
          "**discrete cross-correlation**, because the kernel is not flipped by 180 degrees " +
          "prior to sliding (since kernel weights are learned from scratch, flipping is mathematically " +
          "redundant). For an input tensor with $C_{\\text{in}}$ channels and a bank of $C_{\\text{out}}$ " +
          "filters, the output at coordinate $(i, j)$ for filter channel $k$ is computed by summing " +
          "the element-wise products across all input channels and spatial kernel coordinates: " +
          "$O(k, i, j) = b_k + \\sum_{c=1}^{C_{\\text{in}}} \\sum_{m=0}^{K_h-1} \\sum_{n=0}^{K_w-1} I(c, i\\cdot S + m, j\\cdot S + n) K(k, c, m, n)$. " +
          "On hardware, executing nested loops over spatial coordinates would be terribly slow. " +
          "Modern GPU libraries (like Nvidia cuDNN) evaluate convolutions using two brilliant algorithms: " +
          "(1) **`im2col` (Image to Column)**: unrolls every overlapping spatial patch of the input into " +
          "columns of a large matrix and multiplies it by the flattened kernel matrix via **GEMM**, " +
          "saturating GPU memory bandwidth; and (2) **Winograd Fast Convolution**, which computes " +
          "$3 \\times 3$ convolutions using polynomial algebra, reducing the number of costly floating-point " +
          "multiplications by over 50%."
      },

      miss: [
        {
          w: "Deep learning convolution is mathematically identical to mathematical convolution in signal processing.",
          r: "True mathematical convolution requires flipping the filter 180 degrees ($K(-m, -n)$). Deep learning libraries omit the flip, implementing cross-correlation instead."
        },
        {
          w: "Convolutional layers process each input color channel (R, G, B) completely independently.",
          r: "A standard 2D convolution kernel spans ALL input channels simultaneously ($C_{\\text{in}} \\times K_h \\times K_w$). The products across all channels are summed together to produce a single 2D feature slice."
        },
        {
          w: "Convolutions must use square kernels (e.g. 3x3).",
          r: "Kernels can be asymmetric (e.g. 1x7 and 7x1 in Inception networks), which factorizes 2D convolutions into separable 1D passes to save compute."
        },
        {
          w: "Convolution operations are slow on GPUs because of complex loop branching.",
          r: "Convolutions are rewritten into dense matrix multiplications via `im2col` or Winograd transforms, running at near-peak theoretical TFLOPS on GPU tensor cores."
        }
      ],

      trade: {
        buys: [
          "Extracts shift-invariant spatial and temporal features with high parameter efficiency.",
          "Highly optimized GPU hardware implementations (Winograd, FFT, `im2col`) maximize training throughput.",
          "Arbitrary input dimensions: fully convolutional networks (FCNs) can process images of any variable height and width."
        ],
        costs: [
          "`im2col` unrolling expands memory footprint during forward execution by replicating overlapping pixel patches.",
          "Computation scales linearly with output channels and input channels: $\\mathcal{O}(C_{\\text{in}} \\cdot C_{\\text{out}} \\cdot K^2)$.",
          "Fixed spatial grid assumption prevents native processing of non-Euclidean graphs or point clouds."
        ],
        avoid: [
          "Implementing naive nested for-loops in Python for convolution (always use `torch.nn.functional.conv2d`).",
          "Using large monolithic kernels (e.g. 7x7) when a stack of smaller 3x3 kernels achieves the same receptive field with less compute."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kernel",

      why: {
        before: "Classical image processing used fixed, hardcoded filter matrices (e.g. $3 \\times 3$ Sobel filter " +
          "$\\begin{bmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{bmatrix}$) that could only detect specific pre-determined orientations.",
        problem: "Real-world visual data contains thousands of subtle, domain-specific visual primitives " +
          "that cannot be anticipated or hand-coded by human engineers.",
        shift: "**Convolutional Kernel (Filter Tensor): Differentiable parameter tensor.** " +
          "Parameterize spatial feature detectors as small learnable weight tensors $K \\in \\mathbb{R}^{C_{\\text{out}} \\times C_{\\text{in}} \\times K_h \\times K_w}$, " +
          "allowing backpropagation to discover optimal task-specific spatial pattern matchers directly from loss gradients."
      },

      num: {
        t: "Convolutional kernel archetypes, geometries & operational roles",
        h: ["Kernel Type / Geometry", "Tensor Dimensions", "Operational Mechanism", "Key Architectural Purpose"],
        r: [
          ["**Standard 3x3 Kernel**", "$[C_{\\text{out}}, C_{\\text{in}}, 3, 3]$", "Local spatial filtering + cross-channel mixing", "**Workhorse of modern CNNs** (VGG, ResNet)"],
          ["**1x1 Pointwise Kernel**", "$[C_{\\text{out}}, C_{\\text{in}}, 1, 1]$", "Zero spatial filtering; pure cross-channel linear projection", "Reduces/expands channel depth cheaply; Network-in-Network"],
          ["**Depthwise Separable Kernel**", "$[C_{\\text{in}}, 1, K_h, K_w]$ followed by $1 \\times 1$", "Decouples spatial filtering from channel mixing", "**MobileNet**: slashes FLOPs and parameters by **8-9x**"],
          ["**Dilated / Atrous Kernel**", "$K$ with dilation rate $d > 1$", "Inserts spaces between kernel weights without adding parameters", "Expands receptive field exponentially for segmentation (DeepLab)"],
          ["**Asymmetric Kernel**", "$1 \\times K$ followed by $K \\times 1$", "Spatial factorization ($1 \\times 3$ then $3 \\times 1$)", "Saves $33\\%$ parameters compared to standard $3 \\times 3$"]
        ],
        n: "In convolutional neural networks, a **kernel** (also called a filter) " +
          "is a 4D tensor of learnable parameters $K \\in \\mathbb{R}^{C_{\\text{out}} \\times C_{\\text{in}} \\times K_h \\times K_w}$. " +
          "Each of the $C_{\\text{out}}$ filters acts as a specialized template matcher: " +
          "when convolved across the input tensor, the filter computes the inner product between " +
          "its weights and the underlying local receptive field. When the input pattern matches " +
          "the filter's learned spatial configuration, the dot product produces a strong positive " +
          "activation. While early computer vision models (AlexNet) used large $11 \\times 11$ and " +
          "$5 \\times 5$ kernels, modern architectures universally favor **$3 \\times 3$ kernels**. " +
          "Two stacked $3 \\times 3$ kernels have an effective receptive field of $5 \\times 5$, " +
          "but use only $2 \\times (3^2) = 18$ parameters per channel compared to $5^2 = 25$ parameters " +
          "(a 28% reduction) while incorporating two non-linear activation functions instead of one. " +
          "Another architectural breakthrough is the **$1 \\times 1$ Pointwise Kernel** (Lin et al. 2013, " +
          "GoogLeNet), which computes linear combinations across channel depth without altering spatial " +
          "resolution, acting as a computational bottleneck to compress channel dimensions before expensive convolutions."
      },

      miss: [
        {
          w: "A 3x3 kernel has only 9 learnable weights in a convolutional layer.",
          r: "A 3x3 kernel spans ALL input channels and produces multiple output filters. In a layer with 64 input channels and 128 output channels, the kernel tensor contains $128 \\times 64 \\times 3 \\times 3 = 73,728$ weights!"
        },
        {
          w: "1x1 convolutions are useless because they don't look at neighboring pixels.",
          r: "1x1 convolutions perform cross-channel pooling and dimensionality reduction. They allow networks to shrink or expand channel depth cheaply and introduce extra non-linearities without spatial blurring."
        },
        {
          w: "The kernel values are fixed once the network is created.",
          r: "Kernels are learnable parameter tensors initialized randomly. During training, their values are continuously updated via gradient descent to detect edges, textures, and semantic shapes."
        },
        {
          w: "A kernel in CNNs is the exact same thing as a kernel in Support Vector Machines (SVMs).",
          r: "They share an etymological origin but are mathematically distinct: an SVM kernel is an inner-product similarity function in Hilbert space; a CNN kernel is a spatial sliding matrix of learnable weights."
        }
      ],

      trade: {
        buys: [
          "Automatic discovery of optimal visual primitives directly from training task gradients.",
          "Extreme parameter reuse: a tiny $3 \\times 3$ matrix extracts features across a multi-megapixel image.",
          "Specialized variants (1x1, Depthwise, Dilated) offer fine-grained control over compute vs receptive field."
        ],
        costs: [
          "Fixed spatial geometry: cannot dynamically deform to non-rigid object rotations without deformable convolutions.",
          "Memory bandwidth pressure: storing intermediate gradient tensors for thousands of kernel slices during training.",
          "Receptive field grows linearly with depth unless dilated kernels or pooling are introduced."
        ],
        avoid: [
          "Using large kernels ($>5 \\times 5$) in modern backbones without testing equivalent stacks of $3 \\times 3$ kernels.",
          "Confusing kernel spatial dimensions ($K_h \\times K_w$) with total layer parameter counts."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
