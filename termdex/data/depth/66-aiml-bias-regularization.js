/* ==========================================================================
   Depth pass 66 — AI/ML core batch 4: bias, variance, and regularization.
   Underfitting, Bias-Variance Trade-off, Regularisation,
   L1 and L2 Regularisation, Model Capacity, Generalisation,
   Loss Function, Cost Function.

   The bias-variance trade-off is the fundamental law of generalization;
   regularization is the constraint that tames empirical optimization.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "underfitting",

      why: {
        before: "When predictive models produced poor accuracy, practitioners " +
          "assumed the dataset was simply too noisy, corrupted, or inherently unlearnable.",
        problem: "The model's hypothesis space was too rigid, linear, or heavily constrained " +
          "to capture the true underlying data-generating distribution, leading to high " +
          "systematic error across both training and validation datasets.",
        shift: "**Underfitting (High Bias): the failure to capture structural patterns.** " +
          "When a model lacks sufficient representational capacity or features to learn " +
          "the true complexity of the problem, resulting in poor performance on both training and test data."
      },

      num: {
        t: "Underfitting vs Overfitting diagnostic signatures & remedies",
        h: ["Diagnostic Dimension", "Underfitting (High Bias)", "Overfitting (High Variance)", "Optimal Balance"],
        r: [
          ["**Training Error**", "**High (fails to fit training set)**", "**Very low (near zero)**", "**Low (matches Bayes error)**"],
          ["**Validation Error**", "**High (tracks training error closely)**", "**High (diverges from training)**", "**Low (close to training error)**"],
          ["**Generalization Gap**", "**Tiny or zero (both errors equally bad)**", "**Massive gap ($E_{\\text{val}} \\gg E_{\\text{train}}$)**", "**Small, stable gap**"],
          ["**Underlying Cause**", "**Insufficient capacity, missing features, excessive regularization**", "**Excessive capacity, noisy data, lack of regularization**", "**Capacity matched to data complexity**"],
          ["**Primary Remedy**", "**Add features, increase model complexity, decrease $\\lambda$**", "**Add data, apply regularization, select features**", "**Model ready for production deployment**"]
        ],
        n: "Underfitting occurs when a learning algorithm produces a model " +
          "that is fundamentally too simplistic to represent the underlying " +
          "relationships in the data. The definitive quantitative signature " +
          "of underfitting is **high training error accompanied by high " +
          "validation error**, with virtually no gap between the two. In " +
          "the language of statistical learning theory, underfitting corresponds " +
          "to **High Bias**: the model makes strong, erroneous prior assumptions " +
          "about the data (for example, attempting to fit a strictly linear " +
          "plane $y = \\mathbf{w}^T\\mathbf{x} + b$ to a phenomenon that is " +
          "fundamentally quadratic or exponential). The critical diagnostic " +
          "doctrine of underfitting is that **adding more training data will " +
          "NOT resolve underfitting**: if a linear model cannot fit 1,000 " +
          "points of a sinusoidal wave, giving it 1,000,000 points will only " +
          "increase training error while leaving the model completely unable " +
          "to fit the curve. Remedying underfitting mandates **increasing " +
          "effective model capacity**: engineering non-linear polynomial or " +
          "interaction features, transitioning to more flexible model families " +
          "(from linear models to Gradient Boosted Trees or Deep Neural Networks), " +
          "decreasing regularization penalties (lowering $\\lambda$ or increasing $C$), " +
          "or training for more optimization iterations (epochs)."
      },

      miss: [
        {
          w: "Adding more training data will fix an underfitting model.",
          r: "Adding data to an underfitting model does not help; the model cannot even " +
            "fit its existing training samples. Fixing underfitting requires increasing model capacity."
        },
        {
          w: "Linear models always underfit.",
          r: "Linear models equipped with rich polynomial expansions, radial basis kernels, " +
            "or millions of one-hot features can achieve massive capacity and easily overfit."
        },
        {
          w: "An underfitting model has high variance.",
          r: "Underfitting corresponds strictly to **High Bias and Low Variance**. " +
            "The model's predictions are consistently and systematically wrong across all resampled datasets."
        },
        {
          w: "Underfitting means the learning algorithm failed to converge.",
          r: "An algorithm can converge to the absolute mathematical global minimum of its loss " +
            "surface and still severely underfit if its hypothesis space is too constrained."
        }
      ],

      trade: {
        buys: [
          "Underfitting models are computationally lightweight, fast to train, and ultra-fast during inference.",
          "High interpretability: simple linear equations or shallow decision stumps are transparent.",
          "Zero risk of memorizing random noise or spurious historical dataset anomalies.",
          "Stable and robust against out-of-distribution variance."
        ],
        costs: [
          "High systematic prediction error on both historical and future real-world data.",
          "Fails to capture subtle, lucrative business patterns and non-linear interactions.",
          "Severely caps the predictive performance ceiling and ROI of the AI system.",
          "Can result in dangerous algorithmic blindness in medical or safety applications."
        ],
        avoid: [
          "Deploying underfitting models when competitive or safety requirements demand high accuracy.",
          "Adding more data to an underfitting model without first increasing its capacity.",
          "Increasing regularization penalties (L1/L2) on a model that is already underfitting."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bias-variance-trade-off",

      why: {
        before: "Engineers adjusted model complexity via intuition and guesswork, " +
          "unable to explain why models that scored 100% on training data collapsed on test sets.",
        problem: "Making a model more flexible reduced training error but caused " +
          "wild test-set hallucinations (overfitting), while constraining it produced " +
          "persistent systematic errors (underfitting).",
        shift: "**The Bias-Variance Decomposition: the foundational law of generalization.** " +
          "A model's expected out-of-sample error decomposes mathematically into three " +
          "orthogonal components: $\\text{Expected Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$."
      },

      num: {
        t: "Bias-variance decomposition components & error mechanics",
        h: ["Component", "Mathematical Definition", "Source in Modeling", "Behavior as Model Capacity Increases"],
        r: [
          ["**Bias Squared ($\\text{Bias}^2$)**", "$(\\mathbb{E}[\\hat{f}(x)] - f(x))^2$", "**Systematic error from overly simplistic assumptions**", "**Monotonically decreases toward zero**"],
          ["**Variance**", "$\\mathbb{E}[(\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2]$", "**Sensitivity to random fluctuations in the training set**", "**Monotonically increases (in classical regime)**"],
          ["**Irreducible Noise ($\\sigma^2$)**", "$\\text{Var}(\\epsilon)$", "**True physical randomness and unmeasured variables in universe**", "**Completely constant (cannot be reduced by any model)**"],
          ["**Underfitting Regime**", "**High Bias, Low Variance**", "**Model too rigid (e.g. linear line on curved data)**", "**Dominated by $\\text{Bias}^2$**"],
          ["**Overfitting Regime**", "**Low Bias, High Variance**", "**Model too complex (memorizes training noise)**", "**Dominated by $\\text{Variance}$**"]
        ],
        n: "The Bias-Variance Trade-off is the central theoretical compass " +
          "governing supervised machine learning. For squared error loss, " +
          "the expected prediction error on a novel test point $x$ decomposes " +
          "rigorously into: " +
          "$$\\mathbb{E}[(y - \\hat{f}(x))^2] = \\underbrace{(\\mathbb{E}[\\hat{f}(x)] - f(x))^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}[(\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Irreducible Noise}}$$ " +
          "**Bias** measures the systematic error: how far the average " +
          "prediction across all hypothetical training datasets deviates " +
          "from the true physical relationship $f(x)$. **Variance** measures " +
          "the instability: how wildly the model's predictions swing if " +
          "it is trained on a slightly different random sample of data. " +
          "The trade-off dictates that as model complexity increases, **bias " +
          "decreases while variance increases**. The optimal model sits at " +
          "the inflection point where total error (the sum of bias and variance) " +
          "reaches its global minimum. In modern deep learning, researchers " +
          "discovered the **Double Descent** phenomenon: when model capacity " +
          "passes the 'interpolation threshold' (fitting 100% of training data), " +
          "the test error unexpectedly declines again because the inductive " +
          "bias of stochastic gradient descent (SGD) acts as an implicit " +
          "regularizer, finding minimum-norm solutions that generalize remarkably well."
      },

      miss: [
        {
          w: "A machine learning model can achieve zero total error if given enough data.",
          r: "The irreducible error $\\sigma^2$ (noise inherent in sensor measurements, " +
            "missing latent variables, and physical randomness) sets a permanent lower bound on error."
        },
        {
          w: "Ensemble bagging (Random Forest) reduces model bias.",
          r: "Bagging trains independent models on bootstrap samples and averages them, " +
            "which mathematically reduces **variance** by $1/M$ while leaving bias virtually unchanged."
        },
        {
          w: "Deep neural networks with billions of parameters always suffer from fatal variance.",
          r: "In the overparameterized modern regime, massive networks exhibit 'double descent': " +
            "inductive architectural biases and SGD implicit regularization prevent high variance."
        },
        {
          w: "Bias refers to societal or ethical prejudice in machine learning theory.",
          r: "In mathematical statistics, bias strictly refers to the mathematical divergence " +
            "between the expected value of an estimator and the true population parameter."
        }
      ],

      trade: {
        buys: [
          "Provides the foundational mathematical framework for diagnosing all generalization failures.",
          "Directly informs whether to invest in more data (reduces variance) or more complex models (reduces bias).",
          "Explains why ensemble techniques (Bagging reduces variance, Boosting reduces bias) work.",
          "Guides optimal regularization and hyperparameter tuning strategy."
        ],
        costs: [
          "The individual mathematical components cannot be computed directly because true $f(x)$ is unknown.",
          "Must be inferred indirectly through learning curves (comparing train vs validation error).",
          "Classical trade-off intuition can mislead engineers working with modern overparameterized foundation models.",
          "Requires disciplined cross-validation architectures to measure accurately."
        ],
        avoid: [
          "Tuning hyperparameters randomly without analyzing training versus validation error curves.",
          "Assuming high training accuracy implies low generalization error.",
          "Collecting more data to fix high bias (data cures variance, not bias)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "regularisation",

      why: {
        before: "Algorithms minimized pure empirical training error without constraints " +
          "($\\min_\\theta \\sum \\mathcal{L}(f_\\theta(x_i), y_i)$), fitting parameters aggressively to every outlier.",
        problem: "Unconstrained optimization allows model weights to explode to massive " +
          "values, manufacturing complex oscillating decision boundaries that fit training " +
          "noise perfectly while failing catastrophically on test data.",
        shift: "**Penalize model complexity in the loss function (Occam's Razor).** " +
          "Add a mathematical complexity penalty $\\Omega(\\theta)$ to the training loss " +
          "($\\min_\\theta \\mathcal{L}_{\\text{data}} + \\lambda \\Omega(\\theta)$), constraining weights and favoring simpler functions."
      },

      num: {
        t: "Regularization techniques across machine learning paradigms",
        h: ["Regularization Paradigm", "Mechanism / Formula", "Primary Model Family", "Core Operational Effect"],
        r: [
          ["**L2 Regularization (Ridge / Weight Decay)**", "**$+\\lambda \\sum w_j^2$**", "**Linear models, Neural Networks**", "**Smooth weight shrinkage; combats multicollinearity**"],
          ["**L1 Regularization (Lasso)**", "**$+\\lambda \\sum |w_j|$**", "**Linear models, Sparse GLMs**", "**Drives uninformative weights to exactly zero (feature selection)**"],
          ["**ElasticNet**", "**$+\\lambda_1 \\sum |w_j| + \\lambda_2 \\sum w_j^2$**", "**Linear regression, Logistic regression**", "**Balances sparsity and grouping of correlated features**"],
          ["**Dropout**", "**Randomly zeroes activations with probability $p$**", "**Deep Neural Networks**", "**Prevents co-adaptation of hidden units; implicit ensembling**"],
          ["**Early Stopping**", "**Halt training when validation loss stops improving**", "**Iterative gradient models, Neural Nets, GBDTs**", "**Prevents optimizer from traversing into overfitted loss basins**"],
          ["**Data Augmentation**", "**Synthesizes perturbed inputs (rotations, noise)**", "**Computer Vision, Audio, NLP**", "**Expands training manifold; enforces invariant representations**"]
        ],
        n: "Regularization is the mathematical enforcement of **Occam's " +
          "Razor**: among competing hypotheses that explain the empirical data, " +
          "the simplest hypothesis is the most likely to generalize. In formal " +
          "terms, regularization alters the optimization landscape: " +
          "$$\\mathcal{J}(\\theta) = \\underbrace{\\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}(f_\\theta(\\mathbf{x}_i), y_i)}_{\\text{Empirical Data Fit}} + \\underbrace{\\lambda \\Omega(\\theta)}_{\\text{Complexity Penalty}}$$ " +
          "The hyperparameter $\\lambda \\ge 0$ acts as the master tuning " +
          "knob: setting $\\lambda = 0$ yields unconstrained empirical risk " +
          "minimization (vulnerable to severe overfitting); setting $\\lambda " +
          "\\to \\infty$ forces all parameters to zero (causing extreme underfitting). " +
          "In deep learning, regularization extends far beyond parameter " +
          "penalties: **Dropout** randomly disables neurons during each " +
          "forward pass, preventing neurons from developing fragile co-dependencies " +
          "and effectively training an ensemble of $2^H$ sub-networks; " +
          "**Weight Decay** in modern optimizers like **AdamW** decouples " +
          "gradient updates from L2 weight penalties; and **Early Stopping** " +
          "acts as a non-parametric regularizer by halting optimization at " +
          "the exact epoch where validation error begins to climb."
      },

      miss: [
        {
          w: "Regularization is only needed when working with very small datasets.",
          r: "Even on datasets with millions of rows, high-capacity models (neural nets, " +
            "wide tree ensembles) will overfit without proper regularization."
        },
        {
          w: "Regularization improves training set accuracy.",
          r: "Regularization intentionally degrades training accuracy in order to improve " +
            "validation and test generalization accuracy."
        },
        {
          w: "Weight decay and L2 regularization are identical in all optimizers.",
          r: "In standard SGD they are mathematically equivalent; in adaptive optimizers " +
            "(Adam), L2 regularization fails to scale properly, which necessitated **AdamW**."
        },
        {
          w: "Regularization can salvage a dataset with zero predictive signal.",
          r: "Regularization prevents overfitting to noise; it cannot manufacture predictive " +
            "signal if the input features have zero correlation with the target."
        }
      ],

      trade: {
        buys: [
          "Dramatically prevents catastrophic overfitting and stabilizes out-of-sample generalization.",
          "Controls parameter magnitudes, stabilizing numerical floating-point precision.",
          "Mitigates multicollinearity, preventing wildly fluctuating coefficients in linear models.",
          "Enables automatic feature selection (L1 sparsity) in high-dimensional feature spaces."
        ],
        costs: [
          "Introduces additional hyperparameters ($\\lambda$, dropout rate $p$) requiring tuning via CV.",
          "Intentionally increases training error, requiring disciplined communication with stakeholders.",
          "Overly aggressive regularization causes severe underfitting and loss of predictive signal.",
          "Requires mandatory feature scaling beforehand for parameter-based penalties (L1/L2)."
        ],
        avoid: [
          "Applying heavy regularization to models that are already severely underfitting.",
          "Applying L1/L2 regularization without prior feature standardization.",
          "Relying on arbitrary default regularization values without cross-validation tuning."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "l1-and-l2-regularisation",

      why: {
        before: "Linear and logistic models suffered from exploding weights and unstable " +
          "coefficients under multicollinearity, lacking principled mathematical constraints.",
        problem: "When features are correlated or when dimensions exceed sample size ($d > N$), " +
          "Ordinary Least Squares produces infinite valid solutions with massive cancelling positive " +
          "and negative weights that collapse on test data.",
        shift: "**Norm-based weight constraints: L1 (Lasso) vs L2 (Ridge).** " +
          "Penalize the sum of absolute values ($\\sum |w_j|$) to produce sparse models with " +
          "automatic feature selection, or penalize squared weights ($\\sum w_j^2$) to smoothly shrink coefficients."
      },

      num: {
        t: "L1 (Lasso) vs L2 (Ridge) mathematical & operational comparison",
        h: ["Dimension / Property", "L1 Regularization (Lasso)", "L2 Regularization (Ridge)"],
        r: [
          ["**Penalty Term**", "$\\lambda \\sum_{j=1}^d |w_j|$ ($L_1$ norm)", "$\\lambda \\sum_{j=1}^d w_j^2$ (squared $L_2$ norm)"],
          ["**Geometric Constraint**", "**Diamond / Hyper-rhombus (sharp corners on axes)**", "**Hypersphere / Smooth ball**"],
          ["**Weight Sparsity**", "**Exact zeros ($w_j = 0$) -> automated feature selection**", "**Weights shrunk near zero, but never exactly zero**"],
          ["**Multicollinearity Handling**", "**Arbitrarily selects one feature, zeroes the rest**", "**Shrinks correlated coefficients together equitably**"],
          ["**Closed-Form Solution**", "**No (requires coordinate descent / subgradients)**", "**Yes: $\\hat{\\mathbf{w}} = (\\mathbf{X}^T\\mathbf{X} + \\lambda \\mathbf{I})^{-1}\\mathbf{X}^T\\mathbf{y}$**"],
          ["**Bayesian Prior Interpretation**", "**Laplace Prior (sharp peak at zero)**", "**Gaussian Prior (bell curve centered at zero)**"]
        ],
        n: "The mathematical divergence between L1 (Lasso) and L2 (Ridge) " +
          "is one of the most elegant geometric insights in machine learning. " +
          "Under the Karush-Kuhn-Tucker (KKT) formulation, adding a penalty is " +
          "equivalent to minimizing the MSE loss subject to a budget constraint: " +
          "$\\sum |w_j| \\le t$ for L1, and $\\sum w_j^2 \\le t$ for L2. The " +
          "budget boundary for L1 forms a **diamond (hyper-rhombus)** with " +
          "sharp corners aligned precisely with the coordinate axes. The " +
          "elliptical contours of the loss function naturally intersect the " +
          "diamond at these **corners**, where one or more coordinates are " +
          "**identically zero**. Thus, L1 performs **embedded feature selection**, " +
          "producing sparse, interpretable models. Conversely, the L2 budget " +
          "forms a **smooth hypersphere** with zero corners. The loss ellipses " +
          "intersect the sphere tangentially at points where all coordinates " +
          "are non-zero. L2 shrinks all weights proportionally toward zero " +
          "without eliminating them. Furthermore, in Ridge regression, the " +
          "matrix $(\\mathbf{X}^T\\mathbf{X} + \\lambda \\mathbf{I})$ is strictly " +
          "positive definite and **always invertible**, mathematically solving " +
          "the singularity breakdown caused by multicollinearity. **ElasticNet** " +
          "bridges both: $\\lambda_1 \\|w\\|_1 + \\lambda_2 \\|w\\|_2^2$, retaining " +
          "Lasso's sparsity while grouping correlated features like Ridge."
      },

      miss: [
        {
          w: "L1 and L2 regularization can be applied to unscaled features.",
          r: "L1 and L2 penalize weights equally. Unscaled features with small numerical values " +
            "have huge weights that are unfairly penalized; feature scaling is strictly mandatory."
        },
        {
          w: "L1 (Lasso) is always superior to L2 (Ridge) because it performs feature selection.",
          r: "When features are strongly correlated, Lasso arbitrarily keeps one and zeroes the rest, " +
            "losing predictive signal. Ridge retains all correlated features, achieving higher accuracy."
        },
        {
          w: "In scikit-learn's LogisticRegression, `C=100` means strong regularization.",
          r: "`C` is the **inverse** of regularization strength ($C = 1/\\lambda$). " +
            "`C=100` means virtually no regularization; `C=0.01` means extremely strong regularization."
        },
        {
          w: "L2 regularization sets weights to zero if $\\lambda$ is large enough.",
          r: "L2 shrinks weights asymptotically toward zero, but they mathematically never reach " +
            "exact zero. Only L1 produces true structural zeros."
        }
      ],

      trade: {
        buys: [
          "L1 delivers automatic feature selection and sparse, highly interpretable models.",
          "L2 stabilizes ill-conditioned matrices under severe multicollinearity ($d > N$).",
          "ElasticNet provides the optimal compromise: sparsity plus grouped feature handling.",
          "Guarantees numerical stability and prevents wild coefficient inflation."
        ],
        costs: [
          "Requires mandatory feature standardization beforehand to prevent biased penalties.",
          "Introduces penalty hyperparameters ($\\lambda, C$) that must be tuned via cross-validation.",
          "L1 lacks an analytical closed-form solution, requiring iterative coordinate descent.",
          "Lasso can fail when $d \\gg N$ by selecting at most $N$ features before saturating."
        ],
        avoid: [
          "Applying L1 or L2 penalties to unstandardized data.",
          "Using pure Lasso on datasets with known groups of tightly correlated features (use ElasticNet).",
          "Confusing scikit-learn's inverse parameter `C` with the direct penalty parameter $\\lambda$."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-capacity",

      why: {
        before: "Engineers selected machine learning models by trial and error, lacking " +
          "a formal concept to describe what functions a given architecture could learn.",
        problem: "Deploying low-capacity models on complex vision tasks caused chronic " +
          "underfitting, while deploying high-capacity models on small datasets caused severe overfitting.",
        shift: "**Model Capacity: the representational flexibility of a hypothesis space.** " +
          "Quantify a model's theoretical ability to fit diverse, non-linear mathematical functions " +
          "using formal metrics like VC-Dimension, parameter count, and architectural depth."
      },

      num: {
        t: "Model capacity continuum across machine learning architectures",
        h: ["Model Architecture", "Capacity Spectrum", "Formal Capacity Metric", "Primary Capacity Control Hyperparameter"],
        r: [
          ["**Linear / Logistic Regression**", "**Low / Rigid**", "**VC-Dimension = $d + 1$**", "**Number of input features ($d$), L1/L2 penalty**"],
          ["**Decision Tree**", "**Scalable (Low to Infinite)**", "**Shattering up to $2^D$ leaves**", "**`max_depth`, `min_samples_split`, `max_leaf_nodes`**"],
          ["**Random Forest / GBDT**", "**High (Ensemble)**", "**Ensemble hypothesis space**", "**`n_estimators`, `max_depth`, `learning_rate`**"],
          ["**Support Vector Machine (RBF Kernel)**", "**Infinite in Hilbert Space**", "**Infinite VC-Dimension**", "**Kernel bandwidth $\\gamma$, regularization $C$**"],
          ["**Multi-Layer Perceptron (MLP)**", "**Universal Approximator**", "**Number of hidden neurons/layers**", "**Layer count, hidden units, activation functions**"],
          ["**Transformer (e.g. GPT-4)**", "**Massive (Billions of parameters)**", "**Dense attention tensor graph**", "**Parameter count, context length, layer depth**"]
        ],
        n: "Model Capacity defines the theoretical boundary of functions " +
          "a learning algorithm can express. The foundational mathematical " +
          "formulation was established by Vladimir Vapnik through **Vapnik-Chervonenkis " +
          "(VC) Dimension**: the maximum number of arbitrary data points " +
          "that a hypothesis class $\\mathcal{H}$ can **shatter** (assign " +
          "all possible $2^N$ binary labelings without error). A 2D linear " +
          "classifier can shatter 3 points in general position, but cannot " +
          "shatter 4 points arranged as an XOR gate; hence its VC-dimension " +
          "is 3. In general, a linear classifier in $\\mathbb{R}^d$ has " +
          "$\\text{VC-dim} = d + 1$. By the **Universal Approximation Theorem** " +
          "(Cybenko, 1989), a feedforward neural network with a single hidden " +
          "layer and non-linear squashing activations possesses **infinite " +
          "capacity** in the limit of width, capable of approximating any " +
          "continuous function to arbitrary precision. However, capacity is " +
          "a double-edged sword: matching capacity to data complexity is " +
          "mandatory. If model capacity is significantly lower than data " +
          "complexity, the model **underfits**; if capacity significantly " +
          "exceeds the information content of the training dataset, the model " +
          "memorizes sample noise and **overfits**."
      },

      miss: [
        {
          w: "Model capacity is determined strictly by the number of trainable parameters.",
          r: "Capacity depends on parameter count, architectural inductive bias, and constraints. " +
            "An unconstrained decision tree can overfit faster than a regularized neural net with more parameters."
        },
        {
          w: "Maximizing model capacity is always the primary goal in machine learning.",
          r: "The goal is optimal generalization. Maximizing capacity without corresponding data " +
            "volume and regularization triggers catastrophic overfitting."
        },
        {
          w: "Deep neural networks have the same capacity as wide networks with identical parameter counts.",
          r: "Deep networks compose functions hierarchically, achieving exponential representational " +
            "efficiency over shallow networks for structured real-world data (vision, language)."
        },
        {
          w: "A high-capacity model cannot be trained on a small dataset.",
          r: "High-capacity pretrained foundation models fine-tuned with strong regularization " +
            "or Low-Rank Adaptation (LoRA) generalize exceptionally well on small datasets."
        }
      ],

      trade: {
        buys: [
          "High capacity enables learning complex, non-linear real-world phenomena (vision, NLP).",
          "Eliminates underfitting by ensuring the hypothesis space can represent the true relationship.",
          "Enables foundation models to act as zero-shot general-purpose reasoning engines.",
          "Provides a formal theoretical metric (VC-dimension) to analyze generalization bounds."
        ],
        costs: [
          "Excessive capacity directly drives overfitting in the presence of noise or limited data.",
          "High-capacity models require massive compute, memory, and energy to train and serve.",
          "Black-box complexity: high-capacity models lose direct mathematical interpretability.",
          "Demands sophisticated regularization, dropout, and early stopping to constrain parameter search."
        ],
        avoid: [
          "Deploying massive high-capacity neural networks on simple, small tabular business datasets.",
          "Using rigid low-capacity linear models on complex multi-modal perceptual tasks.",
          "Increasing capacity without checking validation loss curves for overfitting."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "generalisation",

      why: {
        before: "Computer programs were judged solely on whether they executed " +
          "correctly on the exact test cases and unit tests written into the codebase.",
        problem: "In machine learning, achieving 100% accuracy on training data is " +
          "trivial (a simple hash table lookup achieves 100%), but completely worthless " +
          "if the system fails on the next novel customer transaction.",
        shift: "**Generalization: the ultimate objective of Machine Learning.** " +
          "The mathematical capacity of a learned model to make accurate predictions " +
          "on novel, previously unobserved inputs drawn from the same underlying probability distribution."
      },

      num: {
        t: "Generalization evaluation frameworks & theoretical bounds",
        h: ["Framework / Metric", "Mathematical Formulation", "Core Invariant Measured", "Failure Signature"],
        r: [
          ["**Generalization Gap**", "$|\\mathcal{R}_{\\text{emp}} - \\mathcal{R}_{\\text{true}}| \\approx |E_{\\text{train}} - E_{\\text{test}}|$", "**Degree of overfitting to training samples**", "**Huge gap ($E_{\\text{val}} \\gg E_{\\text{train}}$)**"],
          ["**PAC Learning Bound**", "$\\mathcal{R} \\le \\hat{\\mathcal{R}} + \\mathcal{O}\\left(\\sqrt{\\frac{\\text{VC} + \\ln(1/\\delta)}{N}}\\right)$", "**Theoretical upper bound on out-of-sample risk**", "**High VC-dimension with small $N$**"],
          ["**In-Distribution Generalization**", "**Test data drawn from identical distribution $P_{\\text{train}}$**", "**Standard evaluation benchmark accuracy**", "**High test score, fails in deployment**"],
          ["**Out-of-Distribution (OOD) Robustness**", "**Evaluation on covariate-shifted distribution $P_{\\text{test}} \\ne P_{\\text{train}}$**", "**Real-world deployment resilience**", "**Severe performance collapse under domain shift**"],
          ["**Double Descent Phenomenon**", "**Generalization improves past interpolation threshold**", "**Overparameterization implicit regularization**", "**Classical U-curve intuition failure**"]
        ],
        n: "Generalization is what elevates machine learning from mere data " +
          "memorization into true artificial intelligence. Formally, given " +
          "a data-generating distribution $\\mathcal{P}(\\mathbf{x}, y)$, " +
          "the true goal of an algorithm is to minimize **True Risk (Generalization " +
          "Error)**: " +
          "$$\\mathcal{R}(f) = \\mathbb{E}_{(\\mathbf{x}, y) \\sim \\mathcal{P}} [\\mathcal{L}(f(\\mathbf{x}), y)]$$ " +
          "Because $\\mathcal{P}$ is unknown, the algorithm minimizes **Empirical " +
          "Risk** on training sample $\\mathcal{D}$. The difference between " +
          "the two is the **Generalization Gap**. Classical statistical " +
          "learning theory dictates that generalization requires constraining " +
          "model capacity to prevent fitting noise. However, modern deep " +
          "learning revealed the **Double Descent phenomenon**: as model " +
          "capacity increases, test error follows the classical U-curve until " +
          "it hits the **interpolation threshold** (where the model fits " +
          "100% of training data perfectly). Beyond this threshold, test " +
          "error begins **declining again**, achieving superior generalization " +
          "because the inductive bias of stochastic gradient descent (SGD) " +
          "selects the simplest, minimum-norm interpolating function. " +
          "Crucially, standard generalization assumes data is **Identically " +
          "and Independently Distributed (I.I.D.)**; true production engineering " +
          "requires auditing **Out-of-Distribution (OOD) Robustness** to ensure " +
          "the model does not fail when real-world conditions diverge."
      },

      miss: [
        {
          w: "A model that achieves 99% training accuracy has generalized well.",
          r: "Training accuracy only measures memorization. Generalization can only " +
            "be verified on completely independent, held-out validation and test sets."
        },
        {
          w: "Generalization guarantees a model will work across all future real-world environments.",
          r: "Generalization assumes identical probability distributions (I.I.D.). " +
            "When real-world distributions shift (covariate shift, concept drift), generalization breaks."
        },
        {
          w: "Massive overparameterized models with billions of parameters cannot generalize.",
          r: "Modern foundation models prove that overparameterization combined with SGD " +
            "implicit regularization and massive pretraining achieves unprecedented generalization."
        },
        {
          w: "High test accuracy proves the model is immune to adversarial attacks.",
          r: "A model can generalize well to standard test distributions while remaining " +
            "vulnerable to tiny, imperceptible adversarial noise perturbations."
        }
      ],

      trade: {
        buys: [
          "Enables automated software systems to perform accurately on future, unseen real-world data.",
          "Transforms static historical data into dynamic, predictive intelligence.",
          "Defines the primary optimization objective separating machine learning from memorization.",
          "Provides rigorous mathematical bounds (PAC learning) to evaluate system reliability."
        ],
        costs: [
          "True generalization error cannot be observed directly, requiring disciplined holdout sets.",
          "Generalization breaks down silently under real-world distribution shift and concept drift.",
          "Mandates strict prevention of data leakage across engineering pipelines.",
          "Evaluating real-world generalization requires ongoing MLOps production monitoring."
        ],
        avoid: [
          "Evaluating generalization using training set metrics.",
          "Assuming high in-distribution test scores imply out-of-distribution robustness.",
          "Deploying models without automated monitoring for production performance decay."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "loss-function",

      why: {
        before: "Engineers evaluated predictive accuracy using discrete business " +
          "rules, lacking a differentiable mathematical formulation to guide parameter updates.",
        problem: "Discrete evaluation metrics (like Accuracy or Error Count) are " +
          "non-differentiable step functions with zero gradients, making gradient descent impossible.",
        shift: "**The Loss Function: a smooth, differentiable error penalty.** " +
          "A formal mathematical function $\\ell(\\hat{y}_i, y_i)$ that measures the exact " +
          "penalty incurred by a model's prediction for a single individual data sample, " +
          "providing continuous gradients that point parameters toward optimal convergence."
      },

      num: {
        t: "Essential loss functions across machine learning disciplines",
        h: ["Loss Function", "Mathematical Formulation", "Target Task", "Key Mathematical Behavior"],
        r: [
          ["**Binary Cross-Entropy (Log Loss)**", "$-\\left[ y \\log p + (1-y) \\log(1-p) \\right]$", "**Binary Classification**", "**Heavily penalizes confident incorrect predictions**"],
          ["**Categorical Cross-Entropy**", "$-\\sum_{k=1}^K y_k \\log p_k$", "**Multi-class Classification**", "**Information-theoretic negative log-likelihood of true class**"],
          ["**Mean Squared Error (MSE / L2)**", "$\\frac{1}{2}(\\hat{y} - y)^2$", "**Regression**", "**Quadratic penalty; estimates conditional mean; sensitive to outliers**"],
          ["**Mean Absolute Error (MAE / L1)**", "$|\\hat{y} - y|$", "**Robust Regression**", "**Linear penalty; estimates conditional median; robust to outliers**"],
          ["**Huber Loss**", "**$\\begin{cases} \\frac{1}{2}e^2 & |e| \\le \\delta \\\\ \\delta(|e| - \\frac{1}{2}\\delta) & |e| > \\delta \\end{cases}$**", "**Robust Regression**", "**Smooth quadratic core with linear outlier robustness**"],
          ["**Hinge Loss**", "$\\max(0, 1 - y \\cdot f(x))$", "**Support Vector Machines (SVM)**", "**Enforces maximum margin separation; zero loss beyond margin**"]
        ],
        n: "The Loss Function is the mathematical compass that steers the " +
          "entire optimization process. It operates at the level of a **single " +
          "observation**, quantifying the discrepancy between the model's " +
          "prediction $\\hat{y}_i$ and the ground truth $y_i$. In **classification**, " +
          "the intuitive human metric is Accuracy (percentage of correct " +
          "predictions). However, Accuracy is a step function: its derivative " +
          "is zero almost everywhere and undefined at split boundaries, " +
          "rendering gradient-based optimization impossible. Therefore, " +
          "classifiers optimize a **smooth, differentiable surrogate loss**: " +
          "**Cross-Entropy Loss (Negative Log-Likelihood)**. Cross-entropy " +
          "measures the information distance between the predicted probability " +
          "distribution and the true one-hot distribution. Crucially, cross-entropy " +
          "exerts **asymmetric penalties**: if the true label is $y=1$ and the " +
          "model predicts $p=0.99$, the loss is near zero ($-\\log(0.99) \\approx " +
          "0.01$); but if the model confidently predicts $p=0.01$, the loss " +
          "explodes to $-\\log(0.01) \\approx 4.6$, generating massive gradients " +
          "that aggressively correct the network weights."
      },

      miss: [
        {
          w: "The loss function and the business evaluation metric must be the same.",
          r: "Evaluation metrics (Accuracy, F1, AUC) are often non-differentiable step functions. " +
            "Smooth loss functions (Cross-Entropy, MSE) act as differentiable surrogates for optimization."
        },
        {
          w: "Mean Squared Error is suitable for training classification models.",
          r: "Using MSE on classification probabilities produces non-convex loss surfaces " +
            "with flat plateaus and severe vanishing gradients; Cross-Entropy is mathematically required."
        },
        {
          w: "All loss functions are convex and guarantee reaching the global minimum.",
          r: "While linear and logistic regression losses are convex, deep neural network " +
            "loss surfaces are highly non-convex, containing millions of saddle points and local minima."
        },
        {
          w: "Loss function and cost function are completely identical terms.",
          r: "In strict statistical terminology, a **loss function** measures error on a single instance; " +
            "a **cost function** computes the aggregate error across a mini-batch or dataset."
        }
      ],

      trade: {
        buys: [
          "Provides smooth, continuous gradients guiding parameters toward optimal convergence.",
          "Mathematically encodes task-specific error tolerances and penalty structures.",
          "Differentiable surrogate for non-differentiable discrete real-world business objectives.",
          "Well-understood probabilistic interpretations (Maximum Likelihood Estimation)."
        ],
        costs: [
          "Misalignment risk: optimizing the mathematical surrogate loss can fail to optimize the true business metric.",
          "Non-convex loss landscapes in deep learning can trap gradient descent in suboptimal plateaus.",
          "Sensitive to outliers (e.g. quadratic explosion in Mean Squared Error).",
          "Requires careful numerical stability handling (e.g. `log_softmax` to avoid floating-point underflow)."
        ],
        avoid: [
          "Using non-differentiable metrics directly as optimization loss functions.",
          "Using Mean Squared Error for classification problems with sigmoid activations.",
          "Ignoring outlier leverage when choosing between MSE and robust losses like Huber."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cost-function",

      why: {
        before: "Optimizing models based on individual prediction errors produced " +
          "erratic, thrashing parameter updates that failed to converge globally.",
        problem: "Single-instance loss functions fluctuate wildly; an algorithm needs " +
          "a unified, global mathematical scalar that evaluates performance across the entire dataset.",
        shift: "**The Cost Function: the aggregate optimization objective.** " +
          "Average the individual loss values across all $N$ training samples and incorporate " +
          "regularization complexity penalties to establish the global objective function $J(\\theta)$."
      },

      num: {
        t: "Loss Function vs Cost Function vs Objective Function hierarchy",
        h: ["Conceptual Level", "Mathematical Entity", "Scope of Evaluation", "Operational Role in ML"],
        r: [
          ["**Loss Function**", "$\\ell(f_\\theta(\\mathbf{x}_i), y_i)$", "**Single data instance ($i$)**", "**Computes local error for one sample**"],
          ["**Cost Function**", "$J(\\theta) = \\frac{1}{N} \\sum_{i=1}^N \\ell_i$", "**Entire dataset or mini-batch**", "**Averages empirical risk across training data**"],
          ["**Objective Function**", "$\\mathcal{J}(\\theta) = J(\\theta) + \\lambda \\Omega(\\theta)$", "**Global optimization target**", "**Total function minimized by the optimizer**"],
          ["**Evaluation Metric**", "**Accuracy, F1-Score, AUC, RMSE**", "**Validation / Test dataset**", "**Non-differentiable score reported to humans**"]
        ],
        n: "While practitioners frequently use the terms interchangeably, " +
          "rigorous machine learning architecture distinguishes between " +
          "**Loss, Cost, and Objective Functions**. The **Loss Function " +
          "$\\ell$** quantifies error for a single training observation. " +
          "The **Cost Function $J(\\theta)$** is the empirical mean of " +
          "the loss across the entire training dataset: " +
          "$$J(\\theta) = \\frac{1}{N} \\sum_{i=1}^N \\ell(f_\\theta(\\mathbf{x}_i), y_i)$$ " +
          "The **Objective Function $\\mathcal{J}(\\theta)$** is the complete " +
          "mathematical quantity handed to the optimizer, typically combining " +
          "the empirical cost function with a regularization penalty: " +
          "$\\min_\\theta \\mathcal{J}(\\theta) = J(\\theta) + \\lambda \\Omega(\\theta)$. " +
          "In **Batch Gradient Descent**, the gradient $\\nabla_\\theta J(\\theta)$ " +
          "is computed across all $N$ training examples simultaneously, yielding " +
          "an exact, deterministic gradient vector that moves smoothly toward " +
          "the minimum. However, for datasets with millions of rows, computing " +
          "the full cost on every iteration is computationally intractable. " +
          "**Mini-Batch Stochastic Gradient Descent (SGD)** computes an " +
          "unbiased stochastic estimate of the cost function over small random " +
          "subsets (e.g. 64 or 256 samples). The resulting stochastic gradient " +
          "noise prevents the optimizer from getting trapped in shallow " +
          "local minima, enabling faster training and superior generalization."
      },

      miss: [
        {
          w: "The cost function is computed on a single training example.",
          r: "The cost function computes the aggregate average error across a mini-batch " +
            "or the full dataset. The error on a single instance is the **loss function**."
        },
        {
          w: "A cost function must always be minimized.",
          r: "Objective functions can also be maximized, such as maximizing expected log-likelihood " +
            "or maximizing expected cumulative discounted return in reinforcement learning."
        },
        {
          w: "Minimizing the training cost function guarantees high real-world accuracy.",
          r: "The cost function measures empirical training error. Minimizing cost to zero " +
            "causes severe overfitting; validation metrics must guide deployment."
        },
        {
          w: "Full-batch cost computation is always superior to mini-batch estimation.",
          r: "Full-batch gradient descent is computationally slow on large data and often " +
            "gets trapped in sharp local minima. Mini-batch gradient noise helps models generalize."
        }
      ],

      trade: {
        buys: [
          "Provides a unified, stable scalar value representing overall model fit across the dataset.",
          "Enables stable mini-batch and full-batch gradient descent parameter updates.",
          "Smooths out individual noisy outlier sample errors into a cohesive optimization trajectory.",
          "Directly unifies data loss with regularization complexity penalties."
        ],
        costs: [
          "Computing exact cost across millions of records is computationally prohibitive.",
          "Averages across the dataset can hide poor performance on critical minority sub-populations.",
          "Can become trapped in non-convex local minima and saddle points in deep architectures.",
          "Requires mini-batch stochastic approximation with careful batch size tuning."
        ],
        avoid: [
          "Computing full-batch cost gradients on massive datasets during training (use mini-batch SGD).",
          "Confusing the mathematical cost function with business KPIs reported to stakeholders.",
          "Evaluating model success solely on training cost convergence without checking validation metrics."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
