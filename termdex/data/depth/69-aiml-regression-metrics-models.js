/* ==========================================================================
   Depth pass 69 — AI/ML core batch 7: regression metrics & foundational models.
   Mean Squared Error, Mean Absolute Error, R-Squared, Cross-Entropy,
   Evaluation Metric, Linear Regression, Logistic Regression, Naive Bayes.

   MSE squares residuals to optimize the mean; MAE penalizes linearly to find
   the median; Cross-Entropy drives classification gradients.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "mean-squared-error",

      why: {
        before: "Evaluating regression models by summing raw residuals ($\\sum (y_i - \\hat{y}_i)$) " +
          "caused positive and negative errors to cancel each other out ($+50$ and $-50$ yielded zero error).",
        problem: "An error metric must guarantee all deviations are strictly positive " +
          "while providing a smooth, continuously differentiable mathematical function for gradient optimization.",
        shift: "**Mean Squared Error (MSE / L2 Loss): quadratic residual penalty.** " +
          "Square the residuals before averaging: $\\text{MSE} = \\frac{1}{N}\\sum (y_i - \\hat{y}_i)^2$, " +
          "heavily penalizing large errors and mathematically estimating the conditional mean $\\mathbb{E}[Y|X]$."
      },

      num: {
        t: "Regression error metrics comparison & mathematical properties",
        h: ["Metric", "Mathematical Formula", "Output Scale / Units", "Outlier Sensitivity & Behavior"],
        r: [
          ["**Mean Squared Error (MSE)**", "$\\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$", "**Squared units ($\\text{units}^2$)**", "**Quadratic penalty; extreme sensitivity to outliers**"],
          ["**Root Mean Squared Error (RMSE)**", "$\\sqrt{\\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2}$", "**Original units (e.g. dollars)**", "**Heavily weights large errors; human-interpretable scale**"],
          ["**Mean Absolute Error (MAE)**", "$\\frac{1}{N} \\sum_{i=1}^N |y_i - \\hat{y}_i|$", "**Original units**", "**Linear penalty; robust to extreme outliers**"],
          ["**Mean Absolute Percentage (MAPE)**", "$\\frac{100\\%}{N} \\sum \\left|\\frac{y_i - \\hat{y}_i}{y_i}\\right|$", "**Percentage (%)**", "**Scale-free; divides by zero if $y_i = 0$**"],
          ["**Mean Squared Log Error (MSLE)**", "$\\frac{1}{N} \\sum (\\log(y_i+1) - \\log(\\hat{y}_i+1))^2$", "**Log ratio**", "**Penalizes under-estimates more than over-estimates**"]
        ],
        n: "Mean Squared Error (MSE) is the foundational loss function of " +
          "classical regression analysis. Under the assumption that observational " +
          "noise is normally distributed ($\\epsilon \\sim \\mathcal{N}(0, \\sigma^2)$), " +
          "minimizing MSE is mathematically identical to **Maximum Likelihood " +
          "Estimation (MLE)**. The derivative with respect to predictions " +
          "is smooth and linear: $\\frac{\\partial \\text{MSE}}{\\partial \\hat{y}_i} " +
          "= -\\frac{2}{N}(y_i - \\hat{y}_i)$, providing clean, proportional " +
          "gradients that naturally shrink as predictions approach the ground " +
          "truth. However, squaring the residuals creates an aggressive " +
          "**quadratic penalty curve**: an error of 2 incurs a penalty of " +
          "4, while an error of 20 incurs a penalty of 400! Consequently, " +
          "a single extreme outlier exerts massive leverage during optimization, " +
          "dragging the entire fitted regression surface toward itself. " +
          "To restore interpretability, practitioners calculate **Root Mean " +
          "Squared Error (RMSE = $\\sqrt{\\text{MSE}}$)**, which maps the " +
          "metric back into the original physical dimensions of the target " +
          "variable (e.g. dollars or degrees Celsius)."
      },

      miss: [
        {
          w: "An MSE of 36 means predictions are off by 36 units on average.",
          r: "MSE is in squared units ($\\text{units}^2$). Taking the square root " +
            "($\\text{RMSE} = \\sqrt{36} = 6$) gives the actual magnitude of typical prediction error."
        },
        {
          w: "MSE is always superior to MAE for training regression models.",
          r: "On datasets with heavy-tailed distributions or severe unverified outliers, " +
            "MSE overfits to the outliers. MAE or Huber loss provides significantly greater robustness."
        },
        {
          w: "Minimizing MSE trains the model to predict the median of the target.",
          r: "MSE mathematically optimizes parameters to estimate the conditional **mean** " +
            "$\\mathbb{E}[Y|X]$. Estimating the conditional **median** requires minimizing MAE."
        },
        {
          w: "A model with lower MSE always achieves a higher $R^2$ score across datasets.",
          r: "MSE is scale-dependent (dependent on target magnitude). $R^2$ is a scale-free " +
            "ratio. MSE cannot be used to compare models across different datasets."
        }
      ],

      trade: {
        buys: [
          "Smooth, continuously differentiable convex loss function with clean linear gradients.",
          "Mathematically optimal under Gaussian distributed noise (Maximum Likelihood Estimation).",
          "Severely punishes large, dangerous prediction errors (ideal for risk-averse engineering).",
          "Closed-form analytical solution exists for linear Ordinary Least Squares."
        ],
        costs: [
          "Extreme sensitivity to outliers: a few bad training rows can distort the entire model.",
          "Units are squared ($\\text{units}^2$), requiring conversion to RMSE for human communication.",
          "Assumes symmetric error costs: treats positive and negative deviations identically.",
          "Vulnerable to heavy-tailed target distributions without log-transformation."
        ],
        avoid: [
          "Datasets contaminated with extreme, unverified target outliers (use MAE or Huber loss).",
          "Targets spanning multiple orders of magnitude without prior log-transformation.",
          "Using MSE for classification problems with sigmoid activations (causes vanishing gradients)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mean-absolute-error",

      why: {
        before: "Using Mean Squared Error (MSE) allowed a handful of corrupt outlier " +
          "records to hijack model parameters, pulling predictions away from the majority of normal data.",
        problem: "In real-world data (real estate prices, financial transactions, server latencies), " +
          "extreme outliers exist; squaring errors gives outliers immense, unearned leverage.",
        shift: "**Mean Absolute Error (MAE / L1 Loss): robust linear residual penalty.** " +
          "Average the absolute values of residuals: $\\text{MAE} = \\frac{1}{N}\\sum |y_i - \\hat{y}_i|$, " +
          "penalizing errors linearly and mathematically estimating the robust conditional median."
      },

      num: {
        t: "MSE vs MAE mathematical & operational characteristics",
        h: ["Dimension", "Mean Squared Error (MSE)", "Mean Absolute Error (MAE)"],
        r: [
          ["**Loss Penalty Curve**", "**Quadratic: $e^2$ (penalizes large errors heavily)**", "**Linear: $|e|$ (proportional penalty)**"],
          ["**Mathematical Target**", "**Conditional Mean ($\\mathbb{E}[Y|X]$)**", "**Conditional Median ($\\text{Median}(Y|X)$)**"],
          ["**Derivative / Gradient**", "**Linear: $2e$ (vanishes smoothly at zero)**", "**Constant: $\\text{sign}(e) \\in \\{-1, +1\\}$**"],
          ["**Outlier Robustness**", "**Very Low (outliers dominate the loss surface)**", "**Extremely High (outliers exert constant pull)**"],
          ["**Differentiability**", "**Smoothly differentiable everywhere**", "**Non-differentiable cusp at $e = 0$**"],
          ["**Scale of Metric**", "**Squared units ($\\text{dollars}^2$)**", "**Natural units ($\\text{dollars}$)**"]
        ],
        n: "Mean Absolute Error (MAE) is the primary robust alternative to " +
          "Mean Squared Error. In mathematical statistics, minimizing MAE " +
          "corresponds to **Maximum Likelihood Estimation under a Laplace " +
          "(double-exponential) distribution**. While MSE models the conditional " +
          "mean, MAE models the **conditional median**. The decisive advantage " +
          "of MAE is its **outlier robustness**: because the derivative of " +
          "$|e|$ is simply $\\text{sign}(e)$, an outlier with an error of " +
          "$10,000$ exerts the exact same gradient magnitude ($+1$ or $-1$) " +
          "as a normal error of $1$. The model is not coerced into twisting " +
          "its decision surface to accommodate rogue outliers. However, " +
          "this constant derivative introduces an optimization hurdle: " +
          "at $e = 0$, the function exhibits a **sharp, non-differentiable " +
          "cusp**. During gradient descent, unless the learning rate decays " +
          "smoothly, the optimizer will bounce back and forth across zero " +
          "without settling. To overcome this, modern architectures frequently " +
          "utilize **Huber Loss**, which combines a smooth quadratic parabola " +
          "for small errors with robust linear MAE slopes for large errors."
      },

      miss: [
        {
          w: "MAE and RMSE measure the exact same thing in different ways.",
          r: "RMSE is mathematically always greater than or equal to MAE ($\\text{RMSE} \\ge \\text{MAE}$). " +
            "The difference between them directly reflects the presence and severity of outliers."
        },
        {
          w: "MAE cannot be optimized by gradient descent because of the non-differentiable cusp.",
          r: "Modern autodiff frameworks (PyTorch, TensorFlow) employ subgradients, setting " +
            "the derivative at zero to 0, allowing smooth gradient optimization."
        },
        {
          w: "A model trained on MAE produces the same predictions as one trained on MSE.",
          r: "MSE predicts the mean; MAE predicts the median. In asymmetric or skewed " +
            "distributions (income, house prices), the mean and median diverge significantly."
        },
        {
          w: "MAE is a percentage error.",
          r: "MAE is an absolute error expressed in the exact physical units of the target variable; " +
            "percentage error is Mean Absolute Percentage Error (MAPE)."
        }
      ],

      trade: {
        buys: [
          "Exceptional robustness against extreme, unverified outliers and heavy-tailed noise.",
          "Direct, intuitive human interpretability in the original measurement units.",
          "Estimates the robust conditional median rather than a sensitive mean.",
          "Linear penalty prevents single bad rows from destabilizing training."
        ],
        costs: [
          "Non-differentiable at zero requires subgradient handling and learning rate decay.",
          "Constant gradient magnitude can lead to slow convergence when errors are small.",
          "Does not penalize rare, catastrophic errors quadratically when required by business.",
          "Lacks a closed-form analytical solution in linear regression (requires iterative solvers)."
        ],
        avoid: [
          "Problems where large errors carry catastrophic quadratic real-world costs.",
          "Datasets where the conditional mathematical mean is strictly required by accounting standards.",
          "Training gradient descent without learning rate decay schedules."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "r-squared",

      why: {
        before: "Scale-dependent metrics (MSE, MAE) could not answer the fundamental " +
          "question: 'How much of the total variation in the data is actually explained by our model?'.",
        problem: "An MSE of 50 is magnificent when predicting house prices in millions, " +
          "but terrible when predicting human body temperatures; scale-dependent metrics cannot be compared across problems.",
        shift: "**R-Squared ($R^2$ / Coefficient of Determination): proportion of variance explained.** " +
          "Compute $1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$, providing a standardized, " +
          "scale-free benchmark comparing the model against a trivial baseline predicting the target mean."
      },

      num: {
        t: "$R^2$ score ranges & statistical interpretations",
        h: ["$R^2$ Value", "Statistical Interpretation", "Model Quality Assessment", "Operational Meaning"],
        r: [
          ["**$1.00$**", "**$\\text{SS}_{\\text{res}} = 0$ (Zero error)**", "**Perfect fit**", "**Model explains 100% of variance (check for data leakage)**"],
          ["**$0.80 - 0.99$**", "**Residual variance is 1%–20% of total variance**", "**Strong predictive model**", "**High-performing production regression model**"],
          ["**$0.00$**", "**$\\text{SS}_{\\text{res}} = \\text{SS}_{\\text{tot}}$**", "**Baseline equivalent**", "**Performs identically to simply predicting target mean $\\bar{y}$**"],
          ["**$< 0.00$ (Negative)**", "**$\\text{SS}_{\\text{res}} > \\text{SS}_{\\text{tot}}$**", "**Worse than baseline**", "**Broken model; makes worse predictions than a flat mean line**"],
          ["**Adjusted $R^2$**", "**$1 - \\left[ \\frac{(1-R^2)(N-1)}{N-p-1} \\right]$**", "**Penalizes feature bloat**", "**True metric for comparing multi-feature models**"]
        ],
        n: "R-Squared ($R^2$), or the **Coefficient of Determination**, " +
          "measures the proportion of variance in the dependent variable $Y$ " +
          "that is predictable from the independent features $X$. Mathematically: " +
          "$$R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}} = 1 - \\frac{\\sum_{i=1}^N (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^N (y_i - \\bar{y})^2}$$ " +
          "where $\\text{SS}_{\\text{res}}$ is the Residual Sum of Squares " +
          "and $\\text{SS}_{\\text{tot}}$ is the Total Sum of Squares around " +
          "the empirical mean $\\bar{y}$. A common misconception is that $R^2$ " +
          "cannot be negative: while training $R^2$ is bounded between $0$ " +
          "and $1$ in Ordinary Least Squares, **$R^2$ can be arbitrarily " +
          "negative on held-out test data** if the model's predictions have " +
          "larger errors than a flat horizontal line through the mean. A fatal " +
          "flaw of standard $R^2$ is that **adding new features never decreases " +
          "$R^2$ on training data**, even if the features are random noise. " +
          "The solution is **Adjusted $R^2$**, which penalizes the score " +
          "based on the number of features $p$ relative to sample size $N$, " +
          "increasing only if a new feature improves model fit beyond random chance."
      },

      miss: [
        {
          w: "R-Squared can never be negative.",
          r: "On held-out test data, a model that makes worse predictions than the baseline " +
            "target mean has $\\text{SS}_{\\text{res}} > \\text{SS}_{\\text{tot}}$, resulting in a negative $R^2$."
        },
        {
          w: "A high $R^2$ proves that a causal relationship exists.",
          r: "$R^2$ only measures statistical variance explained. Confounding variables " +
            "and spurious correlations easily produce high $R^2$ with zero true causal link."
        },
        {
          w: "R-Squared is always the square of Pearson's correlation coefficient $r$.",
          r: "$R^2 = r^2$ strictly holds only for simple univariate linear regression. " +
            "In multivariate regression or non-linear models, this equivalence breaks down."
        },
        {
          w: "A low $R^2$ means the model is completely useless.",
          r: "In noisy environments (e.g. stock returns, human psychology), an $R^2$ of " +
            "0.05 or 0.10 can be highly statistically significant and commercially valuable."
        }
      ],

      trade: {
        buys: [
          "Standardized, scale-free metric comparing models across different targets and units.",
          "Directly quantifies the percentage of variance explained by model features.",
          "Intuitive baseline anchor: instantly shows whether a model beats predicting the mean.",
          "Adjusted $R^2$ provides formal penalties against feature bloat."
        ],
        costs: [
          "Standard $R^2$ artificially inflates whenever any feature is added, encouraging bloat.",
          "Blind to systematic bias in residuals (a model can have high $R^2$ but biased predictions).",
          "Highly sensitive to outliers in the total sum of squares denominator.",
          "Does not directly indicate prediction accuracy in physical real-world units."
        ],
        avoid: [
          "Using standard $R^2$ instead of Adjusted $R^2$ when evaluating multi-feature models.",
          "Assuming high $R^2$ implies causal proof or homoskedastic residuals.",
          "Relying on $R^2$ as the sole regression evaluation metric without checking RMSE."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cross-entropy",

      why: {
        before: "Early neural network classifiers used Mean Squared Error (MSE) on " +
          "sigmoid output probabilities, resulting in severe optimization plateaus.",
        problem: "The derivative of sigmoid activations $\\sigma(z)(1-\\sigma(z))$ " +
          "approaches zero when predictions are confidently wrong, causing gradients to " +
          "vanish and training to stall completely.",
        shift: "**Cross-Entropy Loss (Negative Log-Likelihood): information-theoretic divergence.** " +
          "Measure the divergence between true one-hot distributions and predicted probabilities: " +
          "$H(p, q) = -\\sum p(x) \\log q(x)$, generating steep, non-vanishing linear gradients."
      },

      num: {
        t: "Cross-Entropy loss formulations across classification domains",
        h: ["Classification Domain", "Loss Formulation", "Output Layer Activation", "Gradient with Respect to Logits ($z_i$)"],
        r: [
          ["**Binary Classification**", "$-\\left[ y \\log p + (1-y) \\log(1-p) \\right]$", "**Sigmoid ($\\sigma(z)$)**", "**$p - y$ (linear prediction error)**"],
          ["**Multi-class Classification**", "$-\\sum_{k=1}^K y_k \\log p_k = -\\log(p_{\\text{true}})$", "**Softmax**", "**$p_i - y_i$ (linear prediction error)**"],
          ["**Sparse Multi-class**", "$-\\log(p_{\\text{target\\_idx}})$", "**Softmax**", "**$p_i - \\mathbf{1}_{\\{i=\\text{target}\\}}$**"],
          ["**Focal Loss (Imbalance)**", "$-\\alpha_t (1 - p_t)^\\gamma \\log(p_t)$", "**Sigmoid / Softmax**", "**Dynamically scales gradients by $(1-p_t)^\\gamma$**"],
          ["**KL Divergence Connection**", "**$D_{\\text{KL}}(P \\parallel Q) = H(P, Q) - H(P)$**", "**Probability distributions**", "**Drives predicted $Q$ to match true $P$**"]
        ],
        n: "Cross-Entropy Loss is the mathematical cornerstone of classification " +
          "optimization. Anchored in Claude Shannon's Information Theory, " +
          "cross-entropy measures the average number of bits required to " +
          "encode events from true distribution $P$ using an estimated " +
          "distribution $Q$. In supervised learning, the true distribution " +
          "is a one-hot vector where $y_k = 1$ for the correct class and $0$ " +
          "elsewhere. The loss collapses to the **Negative Log-Likelihood**: " +
          "$$\\mathcal{L}_{\\text{CE}} = -\\log(p_{\\text{true}})$$ " +
          "When paired with the **Softmax activation function** ($p_i = \\frac{e^{z_i}}{\\sum e^{z_j}}$), " +
          "the derivative with respect to the input logit $z_i$ simplifies with " +
          "astonishing mathematical elegance: " +
          "$$\\frac{\\partial \\mathcal{L}_{\\text{CE}}}{\\partial z_i} = p_i - y_i$$ " +
          "The gradient is **strictly linear with respect to prediction error**! " +
          "If the model predicts $p = 0.01$ when $y = 1$, the gradient is " +
          "$-0.99$ (maximum force), completely eliminating the vanishing " +
          "gradient problem. Furthermore, cross-entropy exacts **severe " +
          "asymmetric penalties on overconfident errors**: predicting $p=0.99$ " +
          "when $y=0$ incurs an immense loss penalty ($-\\log(0.01) \\approx 4.6$), " +
          "aggressively penalizing models that make confident blunders."
      },

      miss: [
        {
          w: "Cross-Entropy and Mean Squared Error behave identically in classification.",
          r: "MSE combined with sigmoid produces flat loss plateaus and vanishing gradients " +
            "on wrong predictions; Cross-Entropy guarantees steep, non-vanishing linear gradients."
        },
        {
          w: "Categorical Cross-Entropy and Sparse Categorical Cross-Entropy compute different losses.",
          r: "They compute the exact same mathematical loss; the only difference is whether " +
            "target labels are formatted as one-hot vectors or integer indices."
        },
        {
          w: "Cross-Entropy loss is bounded between 0 and 1.",
          r: "Cross-Entropy ranges from $0$ to $+\\infty$. Confidently wrong predictions ($p \\to 0$ " +
            "on true class) incur an infinite loss penalty."
        },
        {
          w: "Computing Cross-Entropy directly via `log(softmax(x))` is safe in PyTorch.",
          r: "Naive `log(softmax(x))` causes catastrophic floating-point underflow; frameworks " +
            "mandate using numerically stabilized implementations like `torch.nn.CrossEntropyLoss`."
        }
      ],

      trade: {
        buys: [
          "Guarantees linear non-vanishing gradients ($p_i - y_i$) when paired with Softmax/Sigmoid.",
          "Heavily penalizes confident incorrect predictions, driving aggressive parameter correction.",
          "Grounded in Maximum Likelihood Estimation and Information Theory.",
          "Universal standard loss function for deep learning classification and LLM pretraining."
        ],
        costs: [
          "Extreme sensitivity to mislabeled training samples: a wrong label can cause gradient spikes.",
          "Can encourage overconfidence: networks drive logits to infinity to minimize cross-entropy.",
          "Requires label smoothing or temperature scaling to prevent overconfident calibration.",
          "Susceptible to floating-point underflow without numerically stabilized log-sum-exp implementations."
        ],
        avoid: [
          "Using Mean Squared Error for classification problems with sigmoid outputs.",
          "Implementing naive `log(softmax(x))` without numerical log-sum-exp stabilization.",
          "Training on noisy datasets with high label corruption without label smoothing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "evaluation-metric",

      why: {
        before: "Engineers judged model success by checking if the training loss " +
          "decreased, assuming lower loss translated directly to business value.",
        problem: "Optimization loss functions (Cross-Entropy, MSE) are mathematical " +
          "surrogates chosen for differentiability, not business value; a model with " +
          "decreasing loss can fail to meet real-world operational ROI goals.",
        shift: "**The Evaluation Metric: the independent benchmark of operational success.** " +
          "Decouple the internal differentiable loss function (used by gradient descent) from " +
          "the external evaluation metric (used by humans to measure business utility and safety)."
      },

      num: {
        t: "Internal Loss Functions vs External Evaluation Metrics across ML tasks",
        h: ["Task Domain", "Internal Differentiable Loss", "External Evaluation Metric", "Business Rationale for Separation"],
        r: [
          ["**Binary Fraud Detection**", "**Binary Cross-Entropy (Log Loss)**", "**PR-AUC / Cost-Weighted Savings ($)**", "**Loss is differentiable; metric reflects investigator capacity and money saved**"],
          ["**Object Detection**", "**Smooth L1 + Focal Loss**", "**Mean Average Precision (mAP@50-95)**", "**Loss guides bounding box coordinates; mAP measures IoU overlap precision**"],
          ["**Search / Recommendation**", "**BPR Loss / Contrastive Loss**", "**NDCG@10 / Mean Reciprocal Rank (MRR)**", "**Loss ranks positive pairs; NDCG measures top-10 visual position discounting**"],
          ["**Machine Translation / NLP**", "**Cross-Entropy (Next-Token)**", "**BLEU / ROUGE / chrF**", "**Loss trains autoregressive logits; BLEU evaluates n-gram semantic fluency**"],
          ["**Speech Recognition (ASR)**", "**Connectionist Temporal Class. (CTC)**", "**Word Error Rate (WER)**", "**Loss aligns alignments; WER counts discrete word insertions/deletions**"]
        ],
        n: "The Evaluation Metric represents the North Star of real-world " +
          "machine learning system design. A fundamental tenet of machine " +
          "learning engineering is the **separation of Loss Function from " +
          "Evaluation Metric**: " +
          "$$\\underbrace{\\mathcal{L}(\\theta) \\text{ [Differentiable Surrogate]}}_{\\text{Used by Optimizer (SGD, Adam)}} \\quad \\longleftrightarrow \\quad \\underbrace{\\mathcal{M}(\\hat{y}, y) \\text{ [Real-World Benchmark]}}_{\\text{Used by Engineers & Stakeholders}}$$ " +
          "The loss function is constrained by mathematical requirements: " +
          "it must be **continuous and differentiable** (smooth $\\mathcal{C}^1$) " +
          "to supply non-zero gradients via backpropagation. In contrast, " +
          "real-world evaluation metrics (Accuracy, F1-Score, NDCG, BLEU, " +
          "Expected Financial Value) are almost always **non-differentiable " +
          "step functions, combinatorial ranks, or discrete counts** that " +
          "gradient descent cannot directly optimize. Evaluation metrics " +
          "must be selected based on **operational economics**: in high-throughput " +
          "APIs, primary accuracy metrics must be paired with **guardrail " +
          "metrics** (p99 latency < 20ms, model memory footprint < 500MB, " +
          "demographic parity fairness bounds) before code is approved for production."
      },

      miss: [
        {
          w: "You should always train models by optimizing the evaluation metric directly.",
          r: "Most evaluation metrics (F1, Accuracy, NDCG, BLEU) are non-differentiable step " +
            "functions with zero gradients; smooth surrogate loss functions are mathematically required."
        },
        {
          w: "Tracking a single evaluation metric is sufficient for production deployment.",
          r: "Production deployment requires a primary metric paired with operational guardrail " +
            "metrics (inference latency SLAs, memory footprint, fairness constraints)."
        },
        {
          w: "A model with lower cross-entropy loss always achieves a higher evaluation score.",
          r: "Loss functions evaluate probabilistic confidence. A model with slightly worse " +
            "cross-entropy can achieve higher F1 or accuracy if its decision boundaries are sharper."
        },
        {
          w: "Evaluation metrics can be computed on the training split.",
          r: "Training metrics measure memorization. Evaluation metrics must strictly be computed " +
            "on held-out validation and test sets to evaluate generalization."
        }
      ],

      trade: {
        buys: [
          "Directly aligns machine learning systems with real-world business KPIs and financial ROI.",
          "Completely independent of mathematical differentiability and gradient constraints.",
          "Provides transparent, auditable performance scorecards for non-technical stakeholders.",
          "Enables establishing strict deployment gates (e.g. CI/CD automated model validation)."
        ],
        costs: [
          "Cannot be optimized directly via gradient descent; requires tuning surrogate losses.",
          "Multiple competing metrics require complex trade-off negotiations (accuracy vs latency).",
          "Selecting the wrong evaluation metric optimizes models for the wrong business behavior.",
          "Metric definitions can shift over time as corporate business priorities evolve."
        ],
        avoid: [
          "Reporting evaluation metrics calculated on the training dataset.",
          "Using accuracy as the evaluation metric on imbalanced real-world datasets.",
          "Deploying models without automated guardrail metrics for inference latency and fairness."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "linear-regression",

      why: {
        before: "Estimating continuous outcomes relied on manual eye-balling of graphs " +
          "or naive rule-of-thumb ratios with no statistical guarantees.",
        problem: "Modeling relationships between continuous variables required an objective, " +
          "mathematically verified framework that minimized total prediction error.",
        shift: "**Linear Regression: the foundational statistical learning algorithm.** " +
          "Model the target variable $Y$ as a linear combination of input features $X$ plus " +
          "Gaussian noise: $y = \\mathbf{w}^T\\mathbf{x} + b + \\epsilon$, solving for optimal weights via Ordinary Least Squares."
      },

      num: {
        t: "Linear regression solvers & mathematical properties",
        h: ["Solver / Variant", "Mathematical Formulation", "Computational Complexity", "Optimal Application Scale"],
        r: [
          ["**Ordinary Least Squares (OLS)**", "$\\hat{\\mathbf{w}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y}$", "$\\mathcal{O}(d^3 + N d^2)$ matrix inversion", "**Small/medium datasets ($d < 10,000$ features)**"],
          ["**SGD Regressor**", "$\\theta_{t+1} = \\theta_t - \\eta (\\hat{y}_i - y_i) \\mathbf{x}_i$", "$\\mathcal{O}(k \\cdot N d)$ iterative descent", "**Massive streaming datasets ($N > 10^7$ rows)**"],
          ["**Ridge Regression (L2)**", "$\\hat{\\mathbf{w}} = (\\mathbf{X}^T\\mathbf{X} + \\lambda \\mathbf{I})^{-1}\\mathbf{X}^T\\mathbf{y}$", "$\\mathcal{O}(d^3)$ (guaranteed invertible)", "**Multicollinear features; prevents weight explosion**"],
          ["**Lasso Regression (L1)**", "**Coordinate descent on MSE $+ \\lambda \\sum |w_j|$**", "**Iterative coordinate descent**", "**Sparse feature selection ($d \\gg N$)**"],
          ["**Polynomial Regression**", "**Linear OLS on expanded basis $[x, x^2, x_1 x_2]$**", "**Expands dimensionality to $\\mathcal{O}(d^p)$**", "**Non-linear physical response surfaces**"]
        ],
        n: "Linear Regression is the bedrock of statistical modeling. First " +
          "published by Legendre (1805) and Gauss (1809), it models the target " +
          "as: $y_i = \\mathbf{w}^T\\mathbf{x}_i + b + \\epsilon_i$. By the celebrated " +
          "**Gauss-Markov Theorem**, the Ordinary Least Squares (OLS) estimator " +
          "is the **Best Linear Unbiased Estimator (BLUE)** under the classical " +
          "assumptions: (1) Linearity in parameters; (2) Strict exogeneity " +
          "($\\mathbb{E}[\\epsilon|\\mathbf{X}] = 0$); (3) Homoskedasticity " +
          "(constant error variance); and (4) No perfect multicollinearity. " +
          "The computational complexity of closed-form OLS is governed by " +
          "the matrix inversion $(\\mathbf{X}^T\\mathbf{X})^{-1}$, scaling as " +
          "$\\mathcal{O}(d^3)$. When feature count $d$ exceeds 10,000 or rows " +
          "exceed millions, matrix inversion becomes intractable, and solvers " +
          "switch to **Stochastic Gradient Descent (SGDRegressor)**. Linear " +
          "regression delivers peerless **interpretability**: each coefficient " +
          "$w_j$ represents the marginal change in target $Y$ for a single unit " +
          "increase in feature $X_j$, holding all other features strictly constant."
      },

      miss: [
        {
          w: "Linear regression can only model straight linear relationships.",
          r: "Linear regression requires linearity in the **parameters $\\mathbf{w}$**, not the features. " +
            "Expanding features into polynomials ($x^2, x^3$), splines, or radial kernels models arbitrary curves."
        },
        {
          w: "Multicollinearity has zero impact on linear regression models.",
          r: "While predictions may remain stable, multicollinearity inflates coefficient variance " +
            "wildly, causing coefficients to flip signs and destroying feature interpretability."
        },
        {
          w: "Linear regression assumes input features are normally distributed.",
          r: "Linear regression makes zero assumptions about the distribution of input features $X$; " +
            "it assumes that the **residuals $\\epsilon$** are normally distributed."
        },
        {
          w: "A high $R^2$ in linear regression proves causality.",
          r: "Linear regression measures empirical correlation. Omitted variable bias and spurious " +
            "correlations easily yield high $R^2$ with zero true causal validity."
        }
      ],

      trade: {
        buys: [
          "Peerless interpretability: coefficients directly quantify marginal feature effects.",
          "Extremely fast training and sub-millisecond real-time production inference.",
          "Closed-form analytical solution guarantees finding the exact global optimum.",
          "Provides formal statistical hypothesis testing ($p$-values, confidence intervals)."
        ],
        costs: [
          "High bias: fails to capture complex non-linear relationships without manual feature engineering.",
          "Extreme sensitivity to outliers: quadratic residual penalty magnifies leverage points.",
          "Coefficient instability and matrix inversion collapse under severe multicollinearity.",
          "Prone to underfitting on complex perceptual data (vision, audio, natural language)."
        ],
        avoid: [
          "Complex perceptual tasks (image classification, voice recognition).",
          "Datasets with severe unaddressed multicollinearity without Ridge regularization.",
          "Non-linear physical phenomena without polynomial basis expansion."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "logistic-regression",

      why: {
        before: "Engineers attempted to use standard Linear Regression for binary " +
          "classification ($y \\in \\{0, 1\\}$), fitting straight lines to discrete classes.",
        problem: "Linear regression produces predictions outside $[0, 1]$ (e.g. $\\hat{y} = -0.4$ " +
          "or $\\hat{y} = 1.6$), which cannot represent probabilities, and is severely distorted by distant outliers.",
        shift: "**Logistic Regression: squash linear logits through a sigmoid link function.** " +
          "Map the unbounded linear combination $(-\\infty, +\\infty)$ onto a valid probability interval $(0, 1)$ " +
          "using the logistic function: $P(Y=1|X) = \\sigma(\\mathbf{w}^T\\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T\\mathbf{x} + b)}}$."
      },

      num: {
        t: "Logistic regression internal mechanics & logit formulations",
        h: ["Conceptual Form", "Mathematical Equation", "Value Range", "Interpretation"],
        r: [
          ["**Linear Combination (Logit)**", "$z = \\mathbf{w}^T\\mathbf{x} + b$", "$(-\\infty, +\\infty)$", "**Raw linear model output (log-odds)**"],
          ["**Sigmoid Link Function**", "$\\sigma(z) = \\frac{1}{1 + e^{-z}}$", "$(0, 1)$", "**Calibrated posterior class probability $P(Y=1|X)$**"],
          ["**Odds Ratio**", "$\\text{Odds} = \\frac{p}{1-p} = e^{\\mathbf{w}^T\\mathbf{x} + b}$", "$(0, +\\infty)$", "**Ratio of success probability to failure probability**"],
          ["**Log-Odds Form**", "$\\ln\\left(\\frac{p}{1-p}\\right) = \\mathbf{w}^T\\mathbf{x} + b$", "$(-\\infty, +\\infty)$", "**Linear in parameters; direct statistical interpretation**"],
          ["**Multinomial (Softmax)**", "$P(Y=k|X) = \\frac{e^{\\mathbf{w}_k^T\\mathbf{x}}}{\\sum e^{\\mathbf{w}_j^T\\mathbf{x}}}$", "$(0, 1)$ sum to 1", "**Generalization to $K > 2$ mutually exclusive classes**"]
        ],
        n: "Despite its historical name, **Logistic Regression is a classification " +
          "algorithm**. It models the **log-odds (logit)** of the positive " +
          "class as a linear combination of input features: " +
          "$$\\ln\\left(\\frac{p}{1 - p}\\right) = \\mathbf{w}^T\\mathbf{x} + b$$ " +
          "Applying the exponential function and solving for $p$ yields the " +
          "legendary **Logistic Sigmoid Function**: " +
          "$$p(\\mathbf{x}) = P(Y=1|\\mathbf{x}) = \\frac{1}{1 + e^{-(\\mathbf{w}^T\\mathbf{x} + b)}}$$ " +
          "Because the output is bounded strictly between $0$ and $1$, it " +
          "provides valid probability estimates. The decision boundary " +
          "is the hyperplane where $\\mathbf{w}^T\\mathbf{x} + b = 0$, corresponding " +
          "to $p = 0.5$. Unlike linear regression, Logistic Regression has " +
          "**no closed-form analytical solution**; its parameters must be " +
          "optimized iteratively via Maximum Likelihood Estimation using " +
          "convex gradient descent or **L-BFGS / Newton-Raphson**. Coefficients " +
          "have a direct statistical interpretation via the **Odds Ratio**: " +
          "exponentiating a coefficient ($e^{w_j}$) reveals the multiplicative " +
          "change in odds of the positive outcome for a one-unit increase in " +
          "$x_j$. Due to sub-millisecond inference latency (a single dot product " +
          "plus sigmoid lookup), Logistic Regression remains heavily deployed " +
          "in real-time ad click-through prediction (CTR) and bank credit scoring."
      },

      miss: [
        {
          w: "Logistic regression is a regression algorithm that predicts continuous targets.",
          r: "Logistic regression is strictly a classification algorithm. It outputs continuous " +
            "probabilities that are thresholded into discrete categorical predictions."
        },
        {
          w: "Logistic regression can learn non-linear curved decision boundaries automatically.",
          r: "Raw logistic regression is strictly a linear classifier; its decision boundary in " +
            "feature space is always a flat hyperplane unless non-linear polynomial features are engineered."
        },
        {
          w: "The output of logistic regression is always a perfectly calibrated probability.",
          r: "Severe class imbalance, heavy L2 regularization, and unrepresentative training samples " +
            "can distort output probabilities, requiring post-hoc calibration (Platt scaling)."
        },
        {
          w: "Logistic regression is too outdated for modern enterprise tech companies.",
          r: "Tech giants deploy logistic regression extensively for real-time ad ranking and fraud " +
            "detection because it executes in single-digit microseconds at massive query scale."
        }
      ],

      trade: {
        buys: [
          "Outputs calibrated continuous probabilities rather than raw uncalibrated scores.",
          "Highly interpretable via Odds Ratios ($e^{w_j}$), complying with financial regulations.",
          "Ultra-low latency inference: executes in microseconds via a single vector dot product.",
          "Convex loss landscape (Binary Cross-Entropy) guarantees finding the global minimum."
        ],
        costs: [
          "Linear decision boundary: fails on non-linear XOR problems without feature engineering.",
          "Easily outperformed by Gradient Boosted Trees on complex tabular datasets.",
          "Vulnerable to multicollinearity, requiring L2 regularization to stabilize weights.",
          "Sensitive to extreme outliers in feature space."
        ],
        avoid: [
          "Complex non-linear problems without manual interaction feature engineering.",
          "Unstructured perceptual data (computer vision, raw audio).",
          "Continuous numerical regression estimation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "naive-bayes",

      why: {
        before: "Computing true Bayesian posterior probabilities $P(Y|\\mathbf{x})$ " +
          "required estimating the complete joint probability distribution $P(x_1, x_2, \\dots, x_d | Y)$.",
        problem: "The curse of dimensionality makes estimating joint multivariate probabilities " +
          "intractable: a text document with 10,000 words requires estimating $2^{10,000}$ combinations, " +
          "demanding more training samples than atoms in the universe.",
        shift: "**The 'Naive' Conditional Independence Assumption.** " +
          "Assume that every feature is conditionally independent of every other feature " +
          "given the class label: $P(x_1, \\dots, x_d | Y) = \\prod_{j=1}^d P(x_j | Y)$, simplifying an " +
          "intractable joint probability into trivial 1D multiplications."
      },

      num: {
        t: "Naive Bayes variants & feature distribution modeling",
        h: ["Algorithm Variant", "Feature Distribution Model", "Input Data Type", "Primary Application"],
        r: [
          ["**Multinomial Naive Bayes**", "**Multinomial distribution (word frequency vectors)**", "**Discrete word counts / TF-IDF**", "**Text classification, spam filtering, topic tagging**"],
          ["**Gaussian Naive Bayes**", "**Gaussian normal distribution $(\\mu_k, \\sigma_k^2)$**", "**Continuous numerical features**", "**Real-time sensor reading classification**"],
          ["**Bernoulli Naive Bayes**", "**Bernoulli distribution (binary presence/absence)**", "**Binary features ($0$ or $1$)**", "**Short document classification, keyword detection**"],
          ["**Categorical Naive Bayes**", "**Categorical distribution per category level**", "**Discrete nominal categories**", "**Tabular demographic survey classification**"],
          ["**Laplace Smoothing (Add-1)**", "**$P(w|Y) = \\frac{N_{wy} + \\alpha}{N_y + \\alpha |V|}$**", "**Prevents zero-probability collapse**", "**Mandatory parameter in all text Naive Bayes**"]
        ],
        n: "Naive Bayes is a probabilistic classifier founded directly upon " +
          "**Bayes' Theorem**: " +
          "$$P(Y=k | \\mathbf{x}) = \\frac{P(Y=k) P(\\mathbf{x} | Y=k)}{P(\\mathbf{x})} \\propto P(Y=k) \\prod_{j=1}^d P(x_j | Y=k)$$ " +
          "The 'Naive' assumption—that all input features are conditionally " +
          "independent given the class—is notoriously violated in reality: " +
          "in natural language, the word 'San' strongly predicts 'Francisco'. " +
          "Yet, Naive Bayes works remarkably well in practice. In 1997, Pedro " +
          "Domingos proved mathematically why: **classification accuracy depends " +
          "on the correct ranking of class probabilities, not their calibration**. " +
          "Even if the independence assumption distorts probabilities toward " +
          "extreme values ($0$ or $1$), the maximum a posteriori (MAP) class " +
          "rank remains correct. In text classification, a non-negotiable " +
          "requirement is **Laplace (Additive) Smoothing ($\\alpha = 1$)**: " +
          "if a test document contains a word never seen in training class $Y$, " +
          "the empirical count is $0$. Without smoothing, multiplying by zero " +
          "collapses the entire document probability to zero, blinding the " +
          "model to 500 other matching words! Laplace smoothing adds pseudo-counts, " +
          "ensuring unseen words receive a tiny non-zero probability."
      },

      miss: [
        {
          w: "Naive Bayes outputs accurate, well-calibrated posterior probabilities.",
          r: "The independence assumption pushes predicted probabilities to extreme, " +
            "overconfident values near 0 or 1; while classification ranking is good, calibration is terrible."
        },
        {
          w: "Naive Bayes cannot handle continuous numerical features.",
          r: "**Gaussian Naive Bayes** models continuous features by fitting a 1D normal " +
            "bell curve $(\\mu, \\sigma^2)$ per feature per class, running in milliseconds."
        },
        {
          w: "Naive Bayes requires iterative gradient descent training.",
          r: "Naive Bayes is completely non-iterative: training requires a single pass over data " +
            "to tally frequency counts and calculate means, training in seconds on millions of rows."
        },
        {
          w: "Naive Bayes is obsolete in the modern era of transformers.",
          r: "Multinomial Naive Bayes remains an indispensable ultra-fast baseline for text routing, " +
            "cold-start spam filtering, and low-compute embedded classification."
        }
      ],

      trade: {
        buys: [
          "Blistering training and inference speed: requires only simple frequency tallying in a single pass.",
          "Performs exceptionally well on high-dimensional sparse text data with tiny memory footprint.",
          "Handles small sample sizes gracefully where complex models overfit.",
          "Naturally handles multi-class classification without one-vs-rest wrappers."
        ],
        costs: [
          "Conditional independence assumption is almost universally false in real-world data.",
          "Output probabilities are horribly uncalibrated and cannot be trusted as true confidence scores.",
          "Cannot capture feature interactions or dependencies (e.g. phrases, combinations).",
          "Zero-frequency problem requires mandatory Laplace smoothing."
        ],
        avoid: [
          "Applications where feature correlations dictate the true outcome.",
          "Systems requiring calibrated, trustworthy output probability scores.",
          "Complex computer vision or audio problems."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
