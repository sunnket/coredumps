/* ML — 50+ Hardcore Question Bank (IIT/PhD Level). */

/* ===================================================================
   Module: what — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "what", [
  {
    "tag": "PAC Learning Framework",
    "lvl": "advanced",
    "q": "In Probably Approximately Correct (PAC) learning theory (Valiant), for a hypothesis class $\\mathcal{H}$ with finite cardinality $|\\mathcal{H}|$, what is the sample complexity bound $m$ required to guarantee generalization error $\\epsilon$ with confidence $1 - \\delta$?",
    "o": [
      "$m \\ge \\frac{1}{\\epsilon} \\left( \\ln |\\mathcal{H}| + \\ln \\frac{1}{\\delta} \\right)$",
      "$m \\ge \\epsilon \\cdot \\delta \\cdot |\\mathcal{H}|$",
      "$m \\ge \\frac{\\ln \\delta}{\\epsilon^2}$",
      "$m \\ge \\sqrt{|\\mathcal{H}|} / \\epsilon$"
    ],
    "a": 0,
    "x": "By applying Union Bound over all 'bad' hypotheses with error $> \\epsilon$, setting $|\\mathcal{H}|(1-\\epsilon)^m \\le \\delta$ yields $m \\ge \\frac{1}{\\epsilon}(\\ln |\\mathcal{H}| + \\ln(1/\\delta))$."
  },
  {
    "tag": "Vapnik-Chervonenkis (VC) Dimension",
    "lvl": "advanced",
    "q": "What is the VC dimension of 2D linear classifiers (hyperplanes in $\\mathbb{R}^2$ with bias)?",
    "o": [
      "2",
      "3",
      "4",
      "Infinite"
    ],
    "a": 1,
    "x": "For $d$-dimensional hyperplanes, VC dimension is $d+1$. In $\\mathbb{R}^2$, VC dimension is strictly 3 (cannot shatter XOR of 4 points)."
  },
  {
    "tag": "No Free Lunch Theorem",
    "lvl": "advanced",
    "q": "What is the precise formal statement of Wolpert's No Free Lunch Theorem for supervised machine learning?",
    "o": [
      "Neural networks always outperform decision trees on image data",
      "Averaged over a uniform distribution of all possible data-generating functions, all learning algorithms (including random guessing and gradient descent) have the exact same expected generalization error",
      "More training data always strictly reduces variance",
      "Cross-validation guarantees zero test error"
    ],
    "a": 1,
    "x": "No learning algorithm is universally superior across all possible data distributions without domain-specific inductive biases."
  },
  {
    "tag": "Conformal Prediction Coverage Guarantee",
    "lvl": "advanced",
    "q": "In Conformal Prediction, what finite-sample guarantee is provided for a $(1 - \\alpha)$ prediction interval $\\hat{C}(X_{n+1})$ under exchangeable data?",
    "o": [
      "Guarantees exactly zero error",
      "$P(Y_{n+1} \\in \\hat{C}(X_{n+1})) \\ge 1 - \\alpha$ strictly without any parametric distributional assumptions on the underlying model or data",
      "Valid only for Gaussian linear regression",
      "Requires infinite training data"
    ],
    "a": 1,
    "x": "Conformal prediction guarantees distribution-free valid marginal coverage $P(Y \\in \\hat{C}(X)) \\ge 1 - \\alpha$ for any black-box model using conformal non-conformity scores."
  }
]);

/* ===================================================================
   Module: fit — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "fit", [
  {
    "tag": "Bias-Variance Decomposition",
    "lvl": "advanced",
    "q": "For a regression estimator $\\hat{f}(x)$ with true target $y = f(x) + \\epsilon$ (where $\\mathbb{E}[\\epsilon] = 0, \\text{Var}(\\epsilon) = \\sigma^2$), what is the exact mathematical decomposition of the Expected Mean Squared Error $\\mathbb{E}[(y - \\hat{f}(x))^2]$?",
    "o": [
      "$(\\text{Bias}[\\hat{f}(x)])^2 + \\text{Var}(\\hat{f}(x)) + \\sigma^2$",
      "$\\text{Bias}[\\hat{f}(x)] + (\\text{Var}(\\hat{f}(x)))^2 + \\sigma^2$",
      "$\\text{Var}(\\hat{f}(x)) + \\sigma^2 - (\\text{Bias}[\\hat{f}(x)])^2$",
      "$(\\text{Bias}[\\hat{f}(x)])^2 \\times \\text{Var}(\\hat{f}(x)) + \\sigma^2$"
    ],
    "a": 0,
    "x": "Expected test error decomposes into $\\text{Bias}^2 + \\text{Variance} + \\sigma^2$ (irreducible noise)."
  },
  {
    "tag": "L1 vs L2 Geometric Sparsity",
    "lvl": "advanced",
    "q": "Why does L1 Regularization (Lasso, $\\lambda \\|w\\|_1$) produce exact zero weights, whereas L2 (Ridge, $\\lambda \\|w\\|_2^2$) only shrinks weights asymptotically toward zero?",
    "o": [
      "L1 regularization uses stochastic gradient descent while L2 uses Adam",
      "The L1 norm constraint ball is a non-differentiable polytope with sharp corners on the coordinate axes where the loss function contour intersects, whereas the L2 ball is a smooth hypersphere",
      "L2 penalty is non-convex in parameter space",
      "L1 regularization normalizes features automatically"
    ],
    "a": 1,
    "x": "The corners of the $L_1$ polytope diamond align directly with coordinate axes where parameters are exact zeros."
  },
  {
    "tag": "Huber Loss Outlier Robustness",
    "lvl": "advanced",
    "q": "Why is Huber Loss defined as quadratic for $|y - \\hat{y}| \\le \\delta$ and linear for $|y - \\hat{y}| > \\delta$?",
    "o": [
      "To speed up matrix inversion",
      "It combines the smooth differentiability of MSE near zero with the linear robustness of MAE for large outlier errors (preventing gradient explosion)",
      "It eliminates the need for regularization",
      "It bounds the prediction between 0 and 1"
    ],
    "a": 1,
    "x": "Huber loss is smooth and differentiable at zero while scaling linearly for large outlier residuals, preventing exploding gradients from corrupting updates."
  },
  {
    "tag": "Convexity and Hessian Positive Definiteness",
    "lvl": "advanced",
    "q": "For an empirical risk function $\\mathcal{L}(w)$, what mathematical property guarantees that every local minimum is a global minimum?",
    "o": [
      "$\\mathcal{L}(w)$ is non-negative",
      "The Hessian matrix $\\nabla^2 \\mathcal{L}(w)$ is Positive Semi-Definite (PSD) everywhere (strict convexity)",
      "$\\mathcal{L}(w)$ is differentiable at 0",
      "Weights are bounded in $[-1, 1]$"
    ],
    "a": 1,
    "x": "If the Hessian is positive semi-definite everywhere, the loss function is convex, guaranteeing that all local minima are global minima."
  },
  {
    "tag": "Ridge Closed-Form Invertibility",
    "lvl": "advanced",
    "q": "What is the closed-form analytical solution of Ridge Regression $w^*$, and why does adding $\\lambda I$ resolve singular matrix inversion when $p > n$ (more features than samples)?",
    "o": [
      "$w^* = X^T y$",
      "$w^* = (X^T X + \\lambda I)^{-1} X^T y$; adding $\\lambda I$ shifts all eigenvalues of $X^T X$ positively ($\\lambda_i + \\lambda > 0$), making the matrix strictly positive definite and invertible even when $X^T X$ is rank-deficient",
      "$w^* = X^{-1} y$",
      "$w^* = \\text{diag}(X)$"
    ],
    "a": 1,
    "x": "When $p > n$, $X^T X$ is singular (determinant = 0). Adding $\\lambda I$ guarantees all eigenvalues are strictly $\\ge \\lambda > 0$, ensuring unique analytical invertibility."
  },
  {
    "tag": "Gauss-Markov Theorem (BLUE)",
    "lvl": "advanced",
    "q": "According to the Gauss-Markov theorem, under what condition is the Ordinary Least Squares (OLS) estimator the Best Linear Unbiased Estimator (BLUE)?",
    "o": [
      "Data must be normally distributed",
      "Errors have zero mean ($\\mathbb{E}[\\epsilon]=0$), are uncorrelated ($\\text{Cov}(\\epsilon_i, \\epsilon_j)=0$), and have constant homoskedastic variance ($\\text{Var}(\\epsilon_i)=\\sigma^2$)",
      "Features must be orthogonal",
      "Sample size must be infinite"
    ],
    "a": 1,
    "x": "The Gauss-Markov theorem states OLS has minimum variance among all linear unbiased estimators provided errors are uncorrelated and homoskedastic (no normality assumption required)."
  },
  {
    "tag": "Logistic Regression Log-Loss Derivation",
    "lvl": "advanced",
    "q": "How is the Binary Cross-Entropy (Log-Loss) objective $\\mathcal{L} = -\\sum [y_i \\ln p_i + (1 - y_i) \\ln(1 - p_i)]$ derived mathematically?",
    "o": [
      "From Taylor expansion",
      "By taking the negative logarithm of the Bernoulli Maximum Likelihood Estimation (MLE) joint probability $\\prod p_i^{y_i} (1 - p_i)^{1 - y_i}$",
      "From Fourier transform",
      "From SVM slack variables"
    ],
    "a": 1,
    "x": "Each target $y_i \\in \\{0, 1\\}$ is a Bernoulli random variable with probability $p_i$. The joint likelihood is $\\prod p_i^{y_i} (1-p_i)^{1-y_i}$. Taking $-\\ln(\\text{Likelihood})$ yields Binary Cross-Entropy."
  },
  {
    "tag": "ElasticNet Correlated Feature Grouping",
    "lvl": "advanced",
    "q": "Why is ElasticNet (combining $\\alpha \\lambda \\|w\\|_1 + \\frac{(1-\\alpha)\\lambda}{2} \\|w\\|_2^2$) preferred over Lasso when features are highly collinear?",
    "o": [
      "Lasso is non-convex",
      "Lasso arbitrarily picks one feature among a cluster of correlated features and zeros out the rest; the strictly convex L2 penalty in ElasticNet forces correlated features to have equal non-zero coefficients (grouping effect)",
      "ElasticNet runs in $O(1)$ time",
      "ElasticNet eliminates the bias term"
    ],
    "a": 1,
    "x": "The strict convexity of the quadratic L2 term forces the coefficients of collinear features to group together, rather than Lasso's erratic arbitrary selection."
  },
  {
    "tag": "Lasso Coordinate Descent Soft-Thresholding",
    "lvl": "advanced",
    "q": "In Coordinate Descent optimization for Lasso, what is the closed-form one-dimensional parameter update operator $S(\\rho_j, \\lambda)$?",
    "o": [
      "$S(\\rho, \\lambda) = \\rho / \\lambda$",
      "Soft-thresholding operator: $S(\\rho_j, \\lambda) = \\text{sign}(\\rho_j) \\max(0, |\\rho_j| - \\lambda)$",
      "$S(\\rho, \\lambda) = \\rho^2 - \\lambda$",
      "$S(\\rho, \\lambda) = \\min(\\rho, \\lambda)$"
    ],
    "a": 1,
    "x": "Subgradient optimality for L1 gives the soft-thresholding function, which sets weights directly to zero if correlation $|\\rho_j| \\le \\lambda$, or shrinks by $\\lambda$ otherwise."
  }
]);

/* ===================================================================
   Module: models — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "models", [
  {
    "tag": "SVM Dual KKT Slackness",
    "lvl": "advanced",
    "q": "In the Dual Formulation of a Soft-Margin Support Vector Machine with slack penalty $C$, which points are Support Vectors on the margin boundary?",
    "o": [
      "Points with $\\alpha_i = 0$",
      "Points with $0 < \\alpha_i < C$ (slack variable $\\xi_i = 0$)",
      "Points with $\\alpha_i = C$ and $\\xi_i > 1$",
      "All training points"
    ],
    "a": 1,
    "x": "By KKT complementary slackness: $0 < \\alpha_i < C \\implies \\xi_i = 0$ and $y_i(w^T x_i + b) = 1$ (points lying exactly on the margin boundary)."
  },
  {
    "tag": "XGBoost Second-Order Expansion",
    "lvl": "advanced",
    "q": "What is the key mathematical improvement that XGBoost introduced to tree-split loss objectives over traditional Friedman Gradient Boosting?",
    "o": [
      "Replacing decision trees with linear regression stumps",
      "Applying a second-order Taylor expansion to the loss function using both first-order gradients ($g_i$) and second-order Hessians ($h_i$), enabling closed-form calculation of optimal leaf weights",
      "Enforcing strict L1 sparsity on tree depth",
      "Eliminating the need for learning rates"
    ],
    "a": 1,
    "x": "Second-order Taylor expansion provides analytic closed-form leaf weight solutions $w^* = -\\frac{\\sum g_i}{\\sum h_i + \\lambda}$ and exact split scores."
  },
  {
    "tag": "Random Forest OOB Asymptotic Bound",
    "lvl": "advanced",
    "q": "When bagging $N$ samples with replacement, what is the asymptotic percentage of training samples left out as Out-of-Bag (OOB) data for each individual tree?",
    "o": [
      "$\\approx 50.0\\%$",
      "$\\approx 36.8\\%$ ($1/e$)",
      "$\\approx 25.0\\%$",
      "$\\approx 63.2\\%$"
    ],
    "a": 1,
    "x": "$\\lim_{N \\to \\infty} (1 - 1/N)^N = e^{-1} \\approx 0.367879 \\approx 36.8\\%$."
  },
  {
    "tag": "Mercer's Theorem on Kernels",
    "lvl": "advanced",
    "q": "According to Mercer's Theorem, what condition must a kernel function $K(x, y)$ satisfy to represent a valid inner product $\\langle \\phi(x), \\phi(y) \\rangle$ in some reproducing kernel Hilbert space (RKHS)?",
    "o": [
      "The kernel function must be strictly linear",
      "The Gram matrix $K_{i,j} = K(x_i, x_j)$ must be symmetric and Positive Semi-Definite (PSD) for all finite sets of points",
      "The kernel must have zero trace",
      "The kernel must be bounded between 0 and 1"
    ],
    "a": 1,
    "x": "A kernel corresponds to an inner product in a Hilbert space if and only if its Gram matrix is symmetric Positive Semi-Definite."
  },
  {
    "tag": "AdaBoost Exponential Loss Upper Bound",
    "lvl": "advanced",
    "q": "Why does AdaBoost minimize the Exponential Loss $\\mathcal{L}(y, f(x)) = e^{-y f(x)}$ rather than 0-1 classification error?",
    "o": [
      "Exponential loss is bounded",
      "0-1 loss is non-convex and NP-hard to optimize; exponential loss is a smooth, strictly convex differentiable upper bound on 0-1 misclassification error",
      "Exponential loss ignores outliers",
      "AdaBoost requires neural networks"
    ],
    "a": 1,
    "x": "Exponential loss is a convex, differentiable upper bound: $I(y \\ne \\text{sign}(f)) \\le e^{-y f(x)}$, enabling sequential gradient-style greedy boosting."
  },
  {
    "tag": "Decision Tree Split Criteria: Gini vs Entropy",
    "lvl": "advanced",
    "q": "What is the mathematical definition of Gini Impurity $I_G(p)$ for $C$ classes versus Shannon Entropy $H(p)$?",
    "o": [
      "$I_G(p) = \\sum p_i^2$, $H(p) = \\sum \\log p_i$",
      "$I_G(p) = 1 - \\sum_{i=1}^C p_i^2$, $H(p) = -\\sum_{i=1}^C p_i \\log_2 p_i$",
      "$I_G(p) = \\max(p_i)$",
      "$I_G(p) = \\prod p_i$"
    ],
    "a": 1,
    "x": "Gini impurity measures the probability of incorrectly classifying a randomly chosen element: $1 - \\sum p_i^2$. Entropy measures average information bits."
  },
  {
    "tag": "Naive Bayes Conditional Independence Assumption",
    "lvl": "advanced",
    "q": "What is the core assumption of Gaussian Naive Bayes that often fails in real-world correlated data?",
    "o": [
      "Features are uniformly distributed",
      "Given the class label $y$, all feature attributes $x_1, x_2, \\dots, x_d$ are mutually conditionally independent ($P(x_1, x_2 | y) = P(x_1|y) P(x_2|y)$)",
      "Labels are binary",
      "Dataset has zero noise"
    ],
    "a": 1,
    "x": "Naive Bayes assumes complete conditional independence among features given the class, ignoring feature covariance matrices."
  },
  {
    "tag": "LightGBM GOSS & EFB Algorithms",
    "lvl": "advanced",
    "q": "How do Gradient-based One-Side Sampling (GOSS) and Exclusive Feature Bundling (EFB) in LightGBM accelerate training speed by 10x–20x over traditional GBDT?",
    "o": [
      "They drop all numerical features",
      "GOSS retains samples with large gradients (under-trained) and randomly sub-samples samples with small gradients; EFB bundles mutually exclusive sparse features into a single dense feature",
      "They convert trees to linear regressions",
      "They train solely in GPU SRAM"
    ],
    "a": 1,
    "x": "GOSS focuses computation on instances with large gradients while preserving estimation accuracy. EFB reduces feature dimensionality by merging mutually exclusive sparse features."
  },
  {
    "tag": "CatBoost Oblivious Trees",
    "lvl": "advanced",
    "q": "What architectural feature of CatBoost's Symmetric (Oblivious) Trees enables ultra-fast inference and prevents overfitting?",
    "o": [
      "Trees have no leaves",
      "All nodes at the exact same tree depth share the identical feature and split threshold, forming balanced decision tables whose inference evaluates in parallel via CPU SIMD bitwise masks",
      "Trees are unbounded in depth",
      "CatBoost disables boosting"
    ],
    "a": 1,
    "x": "Oblivious trees enforce identical split conditions across entire horizontal depth layers, eliminating asymmetric branches and enabling fast bitmask evaluation."
  }
]);

/* ===================================================================
   Module: eval — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "eval", [
  {
    "tag": "ROC-AUC Monotonic Invariance",
    "lvl": "advanced",
    "q": "Why does applying a strictly increasing monotonic transformation to predicted probabilities have ZERO effect on ROC-AUC?",
    "o": [
      "ROC-AUC is calculated using logarithmic regression",
      "ROC-AUC depends purely on the **rank-order of positive vs negative predictions** (Wilcoxon-Mann-Whitney U-statistic), which is completely invariant under monotonic transformations",
      "ROC-AUC automatically rescales predictions to unit variance",
      "Because ROC curve integrates over threshold 0.5 only"
    ],
    "a": 1,
    "x": "ROC-AUC measures pairwise ranking probability $P(\\hat{y}_+ > \\hat{y}_-)$, which is unchanged under monotonic sorting transforms."
  },
  {
    "tag": "Brier Score Reliability Decomposition",
    "lvl": "advanced",
    "q": "The Brier Score for probability calibration decomposes into $\\text{Reliability} - \\text{Resolution} + \\text{Uncertainty}$. What does a Reliability score of 0 indicate?",
    "o": [
      "The model is 100% accurate on test data",
      "The model is perfectly calibrated: whenever it predicts probability $p$, the true empirical fraction of positive outcomes is exactly $p$",
      "The model's predictions have zero variance",
      "The model output is purely random noise"
    ],
    "a": 1,
    "x": "Reliability of 0 means predicted probabilities match empirical observed frequencies across all bins."
  },
  {
    "tag": "PR-AUC vs ROC-AUC on Imbalanced Data",
    "lvl": "advanced",
    "q": "Why is Precision-Recall AUC (PR-AUC) preferred over ROC-AUC for severe class imbalance (e.g. 1 positive per 10,000 negatives in fraud detection)?",
    "o": [
      "ROC-AUC cannot be plotted with 1 class",
      "In ROC-AUC, False Positive Rate $\\text{FPR} = \\text{FP} / (\\text{FP} + \\text{TN})$ uses the massive True Negative count in the denominator, keeping FPR artificially near zero even with thousands of false alarms; Precision $\\text{TP} / (\\text{TP} + \\text{FP})$ immediately collapses on false alarms",
      "PR-AUC computes faster",
      "ROC-AUC assumes Gaussian noise"
    ],
    "a": 1,
    "x": "Large TN numbers suppress FPR in ROC curves, masking large numbers of false positives. Precision directly penalizes false positives against true positives."
  },
  {
    "tag": "Cohen's Kappa Inter-Annotator Agreement",
    "lvl": "advanced",
    "q": "What does a Cohen's Kappa coefficient $\\kappa = 0$ signify between two annotators?",
    "o": [
      "100% perfect agreement",
      "Observed agreement equals the agreement expected purely by random chance",
      "Complete inverse disagreement",
      "Data has zero variance"
    ],
    "a": 1,
    "x": "$\\kappa = \\frac{p_o - p_e}{1 - p_e}$. When observed agreement $p_o$ equals chance agreement $p_e$, $\\kappa = 0$."
  },
  {
    "tag": "KL Divergence Non-Negativity",
    "lvl": "advanced",
    "q": "Why is Kullback-Leibler (KL) Divergence $D_{\\text{KL}}(P \\parallel Q) = \\sum P(x) \\log \\frac{P(x)}{Q(x)}$ strictly non-negative ($D_{\\text{KL}} \\ge 0$) with equality if and only if $P = Q$?",
    "o": [
      "Because log is linear",
      "By Gibbs' inequality derived directly from Jensen's inequality applied to the strictly convex function $f(t) = -\\ln(t)$",
      "Because probabilities are integers",
      "KL divergence is a metric distance"
    ],
    "a": 1,
    "x": "Applying Jensen's inequality: $-D_{\\text{KL}}(P \\parallel Q) = \\sum P(x) \\ln \\frac{Q(x)}{P(x)} \\le \\ln \\sum Q(x) = \\ln 1 = 0 \\implies D_{\\text{KL}} \\ge 0$."
  }
]);

/* ===================================================================
   Module: unsup — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "unsup", [
  {
    "tag": "EM Algorithm & Jensen's Lower Bound",
    "lvl": "advanced",
    "q": "In the Expectation-Maximization (EM) algorithm for GMMs, why does the M-step maximize the ELBO rather than marginal log-likelihood directly?",
    "o": [
      "The marginal log-likelihood contains a log of a sum $\\ln \\sum_z P(X, z | \\theta)$ which is mathematically intractable; Jensen's inequality provides a tractable concave lower bound with sum of logs",
      "EM cannot compute derivatives",
      "GMM variance is always zero",
      "To enforce orthogonal covariance matrices"
    ],
    "a": 0,
    "x": "Applying Jensen's inequality moves the logarithm inside the expectation over latent states $z$, yielding an analytical closed-form M-step."
  },
  {
    "tag": "t-SNE Student-t Cauchy Tails",
    "lvl": "advanced",
    "q": "Why does t-SNE use a Student-t distribution with 1 degree of freedom in the low-dimensional map instead of a Gaussian distribution?",
    "o": [
      "Student-t distribution is faster to compute in GPU RAM",
      "In higher dimensions, the volume of a sphere grows exponentially, creating the **Crowding Problem** where moderately distant points crush together; the heavy power-law tails of the Student-t distribution allow moderate distances in high-D to map to larger distances in 2D without repulsive gradient explosion",
      "Gaussian distribution cannot handle negative coordinates",
      "t-SNE requires compact support"
    ],
    "a": 1,
    "x": "Heavy tails of the Cauchy distribution ($1/(1+d^2)$) allow points to be placed further apart in 2D, resolving high-dimensional volume collapse."
  },
  {
    "tag": "PCA Variance Maximization Rayleigh Quotient",
    "lvl": "advanced",
    "q": "In Principal Component Analysis (PCA), finding the first principal component vector $u_1$ corresponds to maximizing which quadratic Rayleigh quotient under $\\|u\\|=1$?",
    "o": [
      "$u^T u$",
      "$u^T \\Sigma u$ where $\\Sigma$ is the sample covariance matrix (whose maximum is the largest eigenvalue $\\lambda_1$)",
      "$u^T X u$",
      "$\\text{Tr}(\\Sigma)$"
    ],
    "a": 1,
    "x": "Projected variance is $\\text{Var}(u^T X) = u^T \\Sigma u$. Maximizing subject to $u^T u = 1$ via Lagrange multipliers yields $\\Sigma u = \\lambda u$."
  },
  {
    "tag": "DBSCAN Core vs Border vs Noise Points",
    "lvl": "advanced",
    "q": "In DBSCAN density clustering with parameters $(\\epsilon, \\text{MinPts})$, what defines a **Border Point**?",
    "o": [
      "A point with $\\ge \\text{MinPts}$ neighbors within $\\epsilon$",
      "A point that has fewer than $\\text{MinPts}$ neighbors within $\\epsilon$, but falls within the $\\epsilon$-neighborhood of a Core Point",
      "An isolated point with 0 neighbors",
      "A centroid"
    ],
    "a": 1,
    "x": "A border point does not satisfy the core density threshold itself, but is reachable within $\\epsilon$ distance of an active core point."
  },
  {
    "tag": "K-Means++ Initialization Bound",
    "lvl": "advanced",
    "q": "How does K-Means++ initialization select initial centroids to guarantee an expected approximation ratio of $O(\\log k)$ against the optimal K-Means clustering cost?",
    "o": [
      "Selects centroids uniformly at random",
      "Selects the first centroid uniformly, then samples each subsequent centroid with probability proportional to the squared Euclidean distance $D(x)^2$ to the closest already-chosen centroid",
      "Picks the $k$ most extreme outlier points",
      "Uses grid search"
    ],
    "a": 1,
    "x": "Sampling with probability $\\propto D(x)^2$ spreads centroids far apart across the data manifold, mathematically bounding expected cost to $O(\\log k) \\cdot \\text{OPT}$."
  },
  {
    "tag": "Hierarchical Clustering Lance-Williams Formula",
    "lvl": "advanced",
    "q": "What is the purpose of the Lance-Williams recurrence formula in agglomerative hierarchical clustering?",
    "o": [
      "Calculates eigenvalues of Gram matrix",
      "Provides a single unified recursive equation to compute the updated distance between a newly merged cluster $(i \\cup j)$ and any other cluster $k$ for Ward, Complete, Single, and Average linkages without re-evaluating raw point distances",
      "Converts dendrograms into neural nets",
      "Normalizes distance between 0 and 1"
    ],
    "a": 1,
    "x": "Lance-Williams expresses $d(i \\cup j, k) = \\alpha_i d(i, k) + \\alpha_j d(j, k) + \\beta d(i, j) + \\gamma |d(i, k) - d(j, k)|$, updating distances in $O(1)$."
  },
  {
    "tag": "Apriori Downward Closure Property",
    "lvl": "advanced",
    "q": "What is the foundational Apriori Principle (Downward Closure Property) in frequent itemset mining?",
    "o": [
      "All frequent itemsets have size 1",
      "All non-empty subsets of a frequent itemset must also be frequent (if itemset ${A, B}$ is infrequent, any superset ${A, B, C}$ is immediately pruned)",
      "Frequent itemsets are ordered alphabetically",
      "Confidence equals support"
    ],
    "a": 1,
    "x": "Support is monotonic: adding items to a set cannot increase its frequency. If a subset is below minimum support, all its supersets are guaranteed infrequent and pruned."
  },
  {
    "tag": "PageRank Stationary Distribution & Damping",
    "lvl": "advanced",
    "q": "In Google's PageRank algorithm, why is the transition probability matrix modified with damping factor $d = 0.85$ to $M = d P + \\frac{1-d}{N} \\mathbf{1} \\mathbf{1}^T$?",
    "o": [
      "To speed up GPU multiplication",
      "To make the Markov chain strictly irreducible and aperiodic (primitive stochastic matrix), guaranteeing by the Perron-Frobenius Theorem the existence of a unique positive stationary distribution vector $\\pi = \\pi M$",
      "To eliminate rank sinks",
      "Because $0.85$ is the golden ratio"
    ],
    "a": 1,
    "x": "Adding the uniform teleportation matrix $(1-d)/N$ makes the graph strongly connected, ensuring a unique principal eigenvector by Perron-Frobenius."
  }
]);

/* ===================================================================
   Module: features — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "features", [
  {
    "tag": "Target Encoding Prior Smoothing",
    "lvl": "advanced",
    "q": "Why does target encoding require Empirical Bayes smoothing $\\frac{n \\cdot \\bar{y}_c + m \\cdot \\bar{y}}{n + m}$ on categorical features?",
    "o": [
      "To prevent division by zero",
      "To prevent overfitting on rare categories with tiny sample size $n$ by shrinking the estimate toward the global target mean $\\bar{y}$",
      "To convert categorical features into one-hot vectors",
      "To scale features between 0 and 1"
    ],
    "a": 1,
    "x": "Categories with few samples ($n=1$) have massive variance and leak the label directly. Smoothing blends category means with global target priors."
  },
  {
    "tag": "SMOTE Cross-Validation Leakage Trap",
    "lvl": "advanced",
    "q": "Why must synthetic oversampling (SMOTE) be applied strictly inside the cross-validation training fold and NEVER on the full dataset prior to splitting?",
    "o": [
      "SMOTE only works on test sets",
      "Applying SMOTE prior to CV splits leaks synthesized points between train and test sets, causing wildly over-optimistic evaluation metrics",
      "SMOTE converts floats to integers",
      "SMOTE requires GPU acceleration"
    ],
    "a": 1,
    "x": "Generating synthetic points before splitting blends test fold distributions into training folds, violating cross-validation independence."
  },
  {
    "tag": "SHAP Additive Efficiency Property",
    "lvl": "advanced",
    "q": "In SHapley Additive exPlanations (SHAP), what unique property is mathematically guaranteed by the Shapley value formulation from cooperative game theory?",
    "o": [
      "Feature attributions sum up to the difference between model prediction $f(x)$ and expected base value $\\mathbb{E}[f(x)]$ (Efficiency property)",
      "SHAP values are always strictly positive",
      "SHAP values eliminate multicollinearity",
      "SHAP values run in $O(1)$ time"
    ],
    "a": 0,
    "x": "Shapley values uniquely satisfy the Efficiency axiom: $\\sum_{i=1}^M \\phi_i = f(x) - \\mathbb{E}[f(x)]$."
  },
  {
    "tag": "Variance Inflation Factor (VIF) Multicollinearity",
    "lvl": "advanced",
    "q": "What does a Variance Inflation Factor $\\text{VIF}_j = \\frac{1}{1 - R_j^2} > 10$ indicate in a linear regression model?",
    "o": [
      "The feature has zero predictive power",
      "Severe multicollinearity: feature $x_j$ is highly linearly predictable from other features ($R_j^2 > 0.90$), inflating standard errors and destabilizing coefficient estimates",
      "The model is underfitting",
      "Feature $x_j$ must be squared"
    ],
    "a": 1,
    "x": "$\\text{VIF} > 10$ means $R_j^2 > 0.90$, indicating that feature $x_j$ is redundant with other regressors, causing unstable regression weights."
  },
  {
    "tag": "ALE Plots vs Partial Dependence Plots",
    "lvl": "advanced",
    "q": "Why are Accumulated Local Effects (ALE) plots preferred over standard Partial Dependence Plots (PDP) for black-box model interpretation when features are strongly correlated?",
    "o": [
      "ALE plots use fewer colors",
      "PDP evaluates predictions on synthetic grid points combining unlikely feature values (e.g. 8-bedroom house with 300 sq ft), violating the data manifold; ALE calculates differences conditionally within local intervals, preventing extrapolation into impossible feature spaces",
      "ALE plots only work on linear regression",
      "PDP is deprecated"
    ],
    "a": 1,
    "x": "Partial Dependence integrates over the marginal distribution, generating unphysical feature combinations. ALE computes localized conditional gradients."
  }
]);

/* ===================================================================
   Module: tuning — (2 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "tuning", [
  {
    "tag": "Bayesian Optimization Gaussian Process Acquisition",
    "lvl": "advanced",
    "q": "In Bayesian Optimization for hyperparameter tuning using a Gaussian Process surrogate, what is the role of the Expected Improvement (EI) Acquisition Function?",
    "o": [
      "To randomly sample hyperparameters",
      "To balance **Exploitation** (sampling where predicted mean is optimal) and **Exploration** (sampling where posterior uncertainty/variance is high)",
      "To invert the Hessian matrix",
      "To prune decision trees"
    ],
    "a": 1,
    "x": "Acquisition functions (EI, UCB) mathematically balance evaluating promising hyperparameter regions vs highly uncertain unexplored regions."
  },
  {
    "tag": "Hyperband Successive Halving",
    "lvl": "advanced",
    "q": "How does the Hyperband algorithm optimize resource allocation compared to standard Random Search?",
    "o": [
      "It runs all configurations to completion",
      "It allocates a small initial budget (e.g. epochs) to many configurations, evaluates intermediate performance, aggressively prunes the bottom $1/\\eta$ underperforming models, and allocates exponentially more budget to surviving candidates",
      "It uses genetic mutations",
      "It requires 100 GPUs"
    ],
    "a": 1,
    "x": "Hyperband uses Successive Halving to discard poor hyperparameter configurations early, focusing compute resources on top-performing candidates."
  }
]);

/* ===================================================================
   Module: pipeline — (2 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "pipeline", [
  {
    "tag": "Data Leakage via Global Imputation",
    "lvl": "advanced",
    "q": "Why is computing feature means on the entire dataset *before* performing train/test split a subtle form of Data Leakage?",
    "o": [
      "Mean computation crashes on test data",
      "The training dataset inherits information about the test distribution (test set mean and variance), producing overly optimistic validation scores",
      "Imputation only works on training data",
      "Means cannot be floats"
    ],
    "a": 1,
    "x": "Pre-split scaling/imputation leaks global statistical parameters from the holdout test set into training features."
  },
  {
    "tag": "Nested Cross-Validation",
    "lvl": "advanced",
    "q": "Why is Nested Cross-Validation (Outer CV for evaluation, Inner CV for hyperparameter tuning) necessary for unbiased performance estimation?",
    "o": [
      "To speed up training",
      "Tuning hyperparameters on the same cross-validation loop used to report model performance produces optimistic selection bias; nested CV separates model selection from generalization assessment",
      "It trains neural networks in parallel",
      "It replaces grid search"
    ],
    "a": 1,
    "x": "Standard CV hyperparameter tuning selects the best model for that specific test split. Nested CV provides an unbiased generalization estimate."
  }
]);

/* ===================================================================
   Module: timeseries — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "timeseries", [
  {
    "tag": "Time-Series Rolling Window Walk-Forward CV",
    "lvl": "advanced",
    "q": "Why can standard K-Fold Cross-Validation NEVER be used for time-series forecasting models?",
    "o": [
      "K-Fold only works on images",
      "Standard K-Fold randomly shuffles data, training models on future data points to predict past data points (Temporal Data Leakage and lookahead bias)",
      "Time series has no variance",
      "K-Fold requires even sample counts"
    ],
    "a": 1,
    "x": "Time-series data has temporal autocorrelation. Shuffling samples violates causality by using future events to predict historical observations."
  },
  {
    "tag": "Stationarity and Augmented Dickey-Fuller (ADF)",
    "lvl": "advanced",
    "q": "In the Augmented Dickey-Fuller (ADF) test for time series stationarity, what does rejecting the null hypothesis ($p < 0.05$) indicate?",
    "o": [
      "The series has a unit root and is non-stationary",
      "The series has NO unit root and is **Stationary** (constant mean and variance over time)",
      "The series is white noise",
      "The series has seasonal periodicity"
    ],
    "a": 1,
    "x": "ADF null hypothesis $H_0$: the series possesses a unit root (non-stationary). Rejecting $H_0$ ($p < 0.05$) confirms stationarity."
  },
  {
    "tag": "ARIMA (p, d, q) Components",
    "lvl": "advanced",
    "q": "In an $\\text{ARIMA}(p, d, q)$ time-series model, what do the three integer parameters represent?",
    "o": [
      "$p$: polynomial degree, $d$: decay rate, $q$: quantiles",
      "$p$: Autoregressive lag order, $d$: degree of differencing to achieve stationarity, $q$: Moving Average error lag order",
      "$p$: period length, $d$: drift, $q$: seasonality",
      "$p$: precision, $d$: dimension, $q$: quality"
    ],
    "a": 1,
    "x": "ARIMA models express observations as a linear combination of $p$ past values (AR), $d$ differences to remove trends, and $q$ past forecast errors (MA)."
  },
  {
    "tag": "GARCH Conditional Heteroskedasticity",
    "lvl": "advanced",
    "q": "In financial time-series forecasting, what unique characteristic does a $\\text{GARCH}(1, 1)$ model capture that standard ARIMA fails to model?",
    "o": [
      "Linear trends",
      "Time-varying **Volatility Clustering** (periods of high market volatility followed by high volatility, and quiet periods followed by quiet periods) by modeling conditional variance as $\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2$",
      "Punctuation errors",
      "Missing values"
    ],
    "a": 1,
    "x": "ARIMA assumes constant residual variance (homoskedasticity). GARCH models autoregressive conditional heteroskedasticity, predicting volatility variance spikes."
  }
]);

/* ===================================================================
   Module: ship — (2 Hardcore Questions)
   =================================================================== */

TD.addMCQ("ml", "ship", [
  {
    "tag": "Model Distillation Temperature Softmax",
    "lvl": "advanced",
    "q": "In Knowledge Distillation (Hinton et al.), why are logits divided by temperature $T > 1$ in the distillation loss $\\mathcal{L}_{\\text{KD}}$?",
    "o": [
      "To prevent integer overflow",
      "Higher temperature softens the output probability distribution, revealing rich **dark knowledge** (relative log-probabilities and inter-class similarities encoded by the teacher model)",
      "To speed up inference on mobile devices",
      "To eliminate the student model"
    ],
    "a": 1,
    "x": "At $T=1$, argmax probability is near 1.0. Softening with $T > 1$ exposes relative probabilities across incorrect classes (e.g. a truck is more like a car than a bird)."
  },
  {
    "tag": "Quantization INT8 Scale and Zero-Point",
    "lvl": "advanced",
    "q": "In linear uniform affine quantization from FP32 to INT8 ($q = \\text{round}(x / S) + Z$), what do $S$ (Scale) and $Z$ (Zero-Point) represent?",
    "o": [
      "$S$ is number of layers; $Z$ is bias",
      "$S$ is a positive float representing the step size between quantized integers, and $Z$ is an integer representing the quantized representation of real value $0.0$",
      "$S$ is matrix determinant; $Z$ is trace",
      "$S$ is random noise"
    ],
    "a": 1,
    "x": "Affine quantization maps real range $[x_{\\min}, x_{\\max}]$ to $[-128, 127]$ with step size $S = (x_{\\max} - x_{\\min}) / 255$ and zero-point $Z = \\text{round}(-x_{\\min} / S) - 128$."
  }
]);

