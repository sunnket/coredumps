/* ==========================================================================
   Depth pass 70 — AI/ML core batch 8: tree-based algorithms & ensemble foundations.
   Decision Tree, Random Forest, Gradient Boosting, XGBoost,
   LightGBM, CatBoost, Ensemble Learning, Bagging.

   Decision trees partition feature space orthogonally; ensembles trade
   uncorrelated learner errors to squash variance (Bagging) or systematically
   minimize residual bias (Boosting).
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "decision-tree",

      why: {
        before: "Linear models (linear/logistic regression) required linear separability " +
          "or explicit manual engineering of polynomial interaction terms ($x_1 \\cdot x_2$), " +
          "failing completely on non-linear step functions and hierarchical rules.",
        problem: "Engineering millions of cross-feature interactions is computationally intractable " +
          "and humanly unintuitive when tabular data exhibits nested threshold conditions.",
        shift: "**Decision Trees (CART / C4.5): recursive orthogonal feature space partitioning.** " +
          "Greedily split datasets at orthogonal hyperplanes that maximize Information Gain " +
          "or Gini impurity reduction, producing an interpretable, hierarchical if-else decision flowchart."
      },

      num: {
        t: "Decision tree splitting criteria & algorithmic complexity",
        h: ["Metric / Property", "CART (Classification & Reg)", "C4.5 / ID3", "Cost-Complexity Pruning"],
        r: [
          ["**Splitting Criterion**", "Gini Impurity / MSE / MAE", "Information Gain (Entropy) / Gain Ratio", "Minimal Cost-Complexity: $R_\\alpha(T) = R(T) + \\alpha|T|$"],
          ["**Tree Structure**", "Strict binary splits ($X_j \\le t$ vs $X_j > t$)", "Multi-way splits for categorical variables", "Pruned sub-tree balancing size $|T|$ and error $R(T)$"],
          ["**Training Complexity**", "$\\mathcal{O}(p \\cdot N \\log N)$ (sorting per split)", "$\\mathcal{O}(p \\cdot N \\log N)$", "$\\mathcal{O}(|T|^2)$ weakest-link pruning passes"],
          ["**Inference Complexity**", "$\\mathcal{O}(\\text{depth}) = \\mathcal{O}(\\log N)$", "$\\mathcal{O}(\\text{depth})$", "$\\mathcal{O}(\\text{depth})$ with reduced memory cache misses"],
          ["**Feature Scaling**", "**Completely invariant** (strictly monotonic)", "**Completely invariant**", "**Completely invariant**"]
        ],
        n: "A decision tree constructs a non-parametric piecewise constant approximation " +
          "of the target function. At each node, the algorithm searches across all $p$ features " +
          "and all candidate threshold values $t$ to find the split that maximizes the impurity drop: " +
          "$\\Delta I = I(\\text{parent}) - \\frac{N_L}{N} I(\\text{left}) - \\frac{N_R}{N} I(\\text{right})$. " +
          "For classification, **Gini Impurity** ($G = 1 - \\sum p_k^2$) computes the probability " +
          "of misclassifying a randomly chosen element if it were randomly labeled according to the " +
          "class distribution, while **Entropy** ($H = -\\sum p_k \\log_2 p_k$) measures information theoretical " +
          "disorder. Unconstrained decision trees have arbitrarily high capacity and zero training bias: " +
          "they will recursively split until every single training leaf is completely pure ($N=1$), " +
          "memorizing observational noise and suffering from extreme **high variance**. Regularization " +
          "is enforced via pre-pruning parameters (`max_depth`, `min_samples_split`, `min_samples_leaf`, " +
          "`max_leaf_nodes`) or post-pruning via **Minimal Cost-Complexity Pruning** (governed by " +
          "`ccp_alpha` in Scikit-Learn)."
      },

      miss: [
        {
          w: "Decision trees require feature standardization or MinMax normalization.",
          r: "Splitting criteria depend solely on the relative rank ordering of values along an axis. Any monotonic transformation (e.g. log, square root, linear scaling) preserves the exact same split boundaries."
        },
        {
          w: "Decision trees can extrapolate trends outside the range of observed training data.",
          r: "Regression trees output a constant leaf average $\\hat{y} = \\frac{1}{N_m}\\sum_{i \\in R_m} y_i$. For input features beyond the training domain, predictions flatline at the boundary leaf's mean."
        },
        {
          w: "Gini impurity is significantly more accurate than Shannon entropy.",
          r: "Empirically, Gini and Entropy yield identical splits over 98% of the time; Gini is simply preferred computationally because it avoids calculating expensive logarithmic operations."
        },
        {
          w: "A greedy decision tree finds the globally optimal set of decision boundaries.",
          r: "Tree induction algorithms (CART, ID3) are strictly top-down greedy heuristics; finding the globally optimal binary decision tree is an NP-complete problem."
        }
      ],

      trade: {
        buys: [
          "Complete interpretability: decision logic can be visually audited and transcribed into plain SQL `CASE WHEN` statements.",
          "Handles mixed data types (continuous, ordinal) and raw feature distributions without requiring normalization or scaling.",
          "Automatic feature selection: irrelevant variables with low information gain are naturally excluded from tree splits."
        ],
        costs: [
          "High variance and extreme instability: perturbing a single training sample can completely alter the root split and cascade down the entire hierarchy.",
          "Orthogonal axis limitations: struggles with diagonal decision boundaries (e.g., $x_1 + x_2 > 5$) without deep, jagged stair-step approximations.",
          "Greedy bias towards high-cardinality categorical features when using raw entropy without gain ratio correction."
        ],
        avoid: [
          "Leaving `max_depth` unbounded on noisy datasets without setting `min_samples_leaf` or `ccp_alpha`.",
          "Using raw single decision trees for high-stakes quantitative production inference without ensemble bagging or boosting."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "random-forest",

      why: {
        before: "Single deep decision trees were notorious for high variance: a minor change " +
          "in the training dataset caused massive structural changes and catastrophic overfitting on unseen test data.",
        problem: "Simply averaging multiple decision trees trained on the same data yields highly correlated trees; " +
          "the variance of the average of $B$ identically distributed variables with pairwise correlation $\\rho$ " +
          "is $\\rho \\sigma^2 + \\frac{1-\\rho}{B}\\sigma^2$, bounded below by $\\rho \\sigma^2$.",
        shift: "**Random Forest (Breiman 2001): Bagging combined with random feature subspace sampling.** " +
          "Train $B$ unpruned trees on bootstrap samples while forcing each split to choose from a random subset " +
          "of $m \\approx \\sqrt{p}$ features, decorrelating the trees and driving $\\rho \\to 0$."
      },

      num: {
        t: "Random Forest hyperparameter scaling & mathematical properties",
        h: ["Hyperparameter / Metric", "Classification Default", "Regression Default", "Mathematical Role"],
        r: [
          ["**Feature Subspace ($m = \\text{max\\_features}$)**", "$m = \\lfloor\\sqrt{p}\\rfloor$", "$m = \\lfloor p/3 \\rfloor$", "Decorrelates individual tree structures by limiting split candidates"],
          ["**Tree Independence ($\\rho$)**", "Lower $m \\to$ lower correlation $\\rho$", "Lower $m \\to$ lower correlation $\\rho$", "Drives the irreducible variance floor $\\rho \\sigma^2$ down toward zero"],
          ["**Out-Of-Bag (OOB) Sample Proportion**", "$\\left(1 - \\frac{1}{N}\\right)^N \\approx e^{-1} \\approx 36.8\\%$", "$\\approx 36.8\\%$ of data", "Provides free cross-validation without reserving a dedicated validation split"],
          ["**Computational Complexity**", "$\\mathcal{O}(B \\cdot m \\cdot N \\log N)$", "$\\mathcal{O}(B \\cdot m \\cdot N \\log N)$", "**Embarrassingly parallel**: trees train completely independently"],
          ["**Overfitting Behavior**", "**Cannot overfit by increasing $B$**", "**Cannot overfit by increasing $B$**", "Adding trees drives variance to asymptote; it does not increase model capacity"]
        ],
        n: "The mathematical genius of Leo Breiman's Random Forest lies in " +
          "**tree decorrelation**. While standard bootstrap aggregating (Bagging) " +
          "reduces variance by averaging, if a few dominant features exist, " +
          "virtually all individual trees will choose those dominant features " +
          "for their top splits, creating high positive covariance ($\\rho$) " +
          "among tree predictions. By restricting each split candidate pool to " +
          "a random subset of size $m = \\sqrt{p}$, Random Forest forces other " +
          "sub-dominant features to be explored, effectively decorrelating the base " +
          "estimators. Because each tree is trained on an unpruned bootstrap sample " +
          "drawn with replacement, approximately $36.8\\%$ of samples ($e^{-1}$) " +
          "are never seen by any given tree. These **Out-of-Bag (OOB)** samples " +
          "allow the forest to compute an unbiased out-of-sample error estimate " +
          "during training, eliminating the computational cost of $K$-fold cross-validation. " +
          "Crucially, increasing the number of trees ($B$) never leads to overfitting; " +
          "it merely tightens the Monte Carlo approximation of the infinite-forest expectation."
      },

      miss: [
        {
          w: "Adding more trees (e.g. increasing n_estimators from 100 to 10,000) causes the Random Forest to overfit.",
          r: "By the Law of Large Numbers, the generalization error of a random forest converges to a limiting bound as B grows. More trees only increases computational time, never overfitting."
        },
        {
          w: "Random Forests cannot handle imbalanced datasets without re-sampling.",
          r: "Standard random forests can struggle with rare classes, but Balanced Random Forest or setting `class_weight='balanced_subsample'` re-weights samples per individual bootstrap draw."
        },
        {
          w: "Random Forest feature importance (MDI) is completely unbiased.",
          r: "Mean Decrease in Impurity (MDI / Gini importance) is heavily biased toward numerical features with many unique values and high-cardinality categorical columns. Permutation importance should be used instead."
        },
        {
          w: "Random Forest is an ensemble of pruned, shallow decision trees.",
          r: "Random Forests rely on deep, fully-grown, unpruned trees with high variance and near-zero bias. The ensemble aggregation mechanism is what extinguishes the variance."
        }
      ],

      trade: {
        buys: [
          "Exceptional out-of-the-box accuracy on tabular datasets with virtually zero hyperparameter tuning required.",
          "Embarrassingly parallel training: each tree is built on an isolated memory space, scaling linearly across CPU cores (`n_jobs=-1`).",
          "Built-in out-of-bag (OOB) error estimation and non-parametric proximity matrices for unsupervised clustering and missing data imputation."
        ],
        costs: [
          "Large serialization memory footprints: storing hundreds of fully grown binary trees can consume gigabytes of RAM/disk.",
          "Slow inference latency compared to linear models or shallow boosted trees, as all $B$ trees must be traversed per prediction.",
          "Cannot extrapolate trend lines outside observed feature boundaries (inheriting the piecewise constant limitation of CART)."
        ],
        avoid: [
          "Relying on default Gini feature importance for critical feature selection decisions on high-cardinality data.",
          "Deploying giant 1,000-tree models to microcontrollers or ultra-low-latency real-time bidding APIs without tree-pruning or compilation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gradient-boosting",

      why: {
        before: "Bagging algorithms (Random Forests) trained base learners in parallel " +
          "to reduce variance, but could not systematically reduce the inherent approximation bias of weak learners.",
        problem: "AdaBoost demonstrated that sequential training could reduce bias, but was mathematically " +
          "constrained to exponential loss, making it acutely fragile to noise and label corruptions.",
        shift: "**Gradient Boosting (Friedman 2001): Functional gradient descent in arbitrary loss spaces.** " +
          "Sequentially train weak regression trees to predict the negative gradient (pseudo-residuals) " +
          "of any differentiable loss function, scaling each tree by a shrinkage learning rate $\\eta$."
      },

      num: {
        t: "Gradient Boosting vs Bagging & AdaBoost architectural mechanics",
        h: ["Dimension", "Bagging (Random Forest)", "AdaBoost", "Gradient Boosting (GBM)"],
        r: [
          ["**Primary Target**", "Variance reduction", "Bias & variance reduction", "**Bias reduction (and variance via shrinkage)**"],
          ["**Base Learner Training**", "Independent / Parallel", "Sequential (re-weights samples)", "**Sequential (fits pseudo-residuals $-\\nabla_F L$)**"],
          ["**Loss Function Flexibility**", "Implicit (Impurity/MSE)", "Constrained to Exponential Loss", "**Any arbitrary differentiable loss (Huber, Poisson, Tweedie)**"],
          ["**Learner Capacity**", "Deep, unpruned trees (low bias)", "Stumps (depth 1 trees)", "**Shallow trees (depth 3 to 8, high bias)**"],
          ["**Shrinkage / Regularization**", "None (tree averaging $1/B$)", "Step size weighting $\\alpha_m$", "**Learning rate $\\eta \\in (0.01, 0.2)$ scaling each tree**"]
        ],
        n: "Gradient Boosting views ensemble learning as numerical optimization " +
          "in function space. Given a differentiable loss function $L(y, F(x))$, " +
          "the ensemble prediction after $m$ iterations is updated additively: " +
          "$F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x)$, where $h_m(x)$ is a base tree " +
          "trained to fit the negative gradient of the loss with respect to the previous " +
          "ensemble prediction: $r_{im} = -\\left[ \\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)} " +
          "\\right]_{F(x)=F_{m-1}(x)}$. For squared error loss $L(y, F) = \\frac{1}{2}(y - F)^2$, " +
          "the pseudo-residual is simply the raw observational error $y_i - F_{m-1}(x_i)$. " +
          "For logistic loss or robust regression (Huber loss), the pseudo-residuals " +
          "represent smooth, bounded gradient vectors. The parameter $\\eta$ (shrinkage) " +
          "acts as a critical regularizer: smaller values of $\\eta$ ($0.01 \\le \\eta \\le 0.1$) " +
          "drastically improve generalization by forcing each tree to capture only a modest fraction " +
          "of the remaining residual signal, requiring more estimators $M$ to converge."
      },

      miss: [
        {
          w: "Gradient boosting can train trees in parallel just like Random Forests.",
          r: "Because tree m depends strictly on the residuals produced by tree m-1, gradient boosting is inherently sequential across iterations (though individual node split finding within a tree can be parallelized)."
        },
        {
          w: "Gradient boosting cannot overfit if you use a small learning rate.",
          r: "A small learning rate slows down learning, but if the number of boosting iterations M is excessively large, gradient boosting will eventually overfit noisy training data. Early stopping on validation loss is mandatory."
        },
        {
          w: "Gradient boosting for classification fits trees to binary classes (0 and 1).",
          r: "Classification trees in GBM fit continuous pseudo-residuals in log-odds space (logits), transforming ensemble sums through the sigmoid or softmax function at inference time."
        },
        {
          w: "Gradient boosting and AdaBoost are completely unrelated algorithms.",
          r: "AdaBoost is mathematically a special case of gradient boosting where the loss function is the exponential loss $L(y, F) = e^{-yF}$."
        }
      ],

      trade: {
        buys: [
          "State-of-the-art predictive performance on structured tabular data across virtually all industry domains.",
          "Arbitrary loss function customization: can optimize directly for quantile regression, ranking (LambdaMART), Poisson counts, or custom business asymmetric losses.",
          "High data efficiency: achieves superior accuracy with dramatically fewer trees and parameters than Random Forests."
        ],
        costs: [
          "Sequential training execution cannot parallelize across boosting iterations, leading to longer training wall-clock times on massive datasets.",
          "Hyperparameter sensitivity: highly sensitive to the interaction between learning rate $\\eta$, tree depth, and number of iterations.",
          "Susceptible to catastrophic overfitting on noisy datasets if early stopping and subsampling are neglected."
        ],
        avoid: [
          "Training gradient boosting without an isolated validation set for early stopping.",
          "Setting deep tree depths (e.g. `max_depth > 12`) in classical GBM, which causes immediate memorization of pseudo-residuals."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "xgboost",

      why: {
        before: "Classical Gradient Boosting (GBM) relied on first-order gradient approximations, " +
          "did not explicitly penalize tree complexity in the loss function, and required exhaustive continuous split scans.",
        problem: "Evaluating exact continuous split candidates across millions of rows created extreme memory bandwidth " +
          "bottlenecks and failed to scale across distributed clusters or handle sparse datasets natively.",
        shift: "**XGBoost (Chen & Guestrin 2016): Second-order Taylor expansion with hardware-aware tree pruning.** " +
          "Optimize a unified objective utilizing both gradients ($g_i$) and Hessians ($h_i$) with an explicit " +
          "L1/L2 tree regularization penalty, histogram split approximations, and cache-conscious data pre-fetching."
      },

      num: {
        t: "XGBoost algorithmic innovations & objective mathematics",
        h: ["Feature / Innovation", "Classical GBM", "XGBoost (Extreme Gradient Boosting)"],
        r: [
          ["**Objective Approximation**", "1st order gradient ($g_i$)", "**2nd order Taylor expansion**: $\\mathcal{L}^{(t)} \\approx \\sum [g_i f_t(x_i) + \\frac{1}{2} h_i f_t^2(x_i)] + \\Omega(f_t)$"],
          ["**Tree Complexity Penalty**", "Heuristic pre/post-pruning", "**Explicit Analytic Regularization**: $\\Omega(f) = \\gamma T + \\frac{1}{2}\\lambda \\sum w_j^2 + \\alpha \\sum |w_j|$"],
          ["**Optimal Leaf Weight ($w_j^*$)**", "Empirical line search", "**Exact Closed Form**: $w_j^* = -\\frac{\\sum_{i \\in I_j} g_i}{\\sum_{i \\in I_j} h_i + \\lambda}$"],
          ["**Split Gain Metric**", "Variance reduction / Impurity", "**Analytic Gain**: $\\frac{1}{2}\\left[\\frac{G_L^2}{H_L+\\lambda} + \\frac{G_R^2}{H_R+\\lambda} - \\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}\\right] - \\gamma$"],
          ["**Sparse & Missing Values**", "Impute or fail", "**Sparsity-Aware Split Finding**: automatically learns default split direction per node"]
        ],
        n: "XGBoost revolutionized applied machine learning by uniting mathematical " +
          "rigor with systems engineering. By expanding the objective function using a " +
          "second-order Taylor series around the current prediction, the algorithm incorporates " +
          "both the first derivative ($g_i = \\partial_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})$) " +
          "and the second derivative (Hessian $h_i = \\partial^2_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})$). " +
          "This enables an exact, closed-form solution for the optimal leaf weights $w_j^*$ " +
          "and defines an analytic **Gain** formula that directly incorporates structural " +
          "regularization ($\\lambda$ shrinks leaf weights, while $\\gamma$ sets the minimum " +
          "gain required to permit a new split). At the systems level, XGBoost introduced " +
          "**Column Block** data structures stored in compressed sparse column (CSC) format, " +
          "cache-aware buffer allocation to eliminate CPU pipeline stalls, and out-of-core " +
          "block compression to process multi-terabyte datasets directly from NVMe SSDs."
      },

      miss: [
        {
          w: "XGBoost requires users to impute missing values (NaN) during data preprocessing.",
          r: "XGBoost features a built-in Sparsity-Aware Split algorithm: it tests routing all missing values to the left child, then to the right child, and permanently assigns the direction that yields maximum gain."
        },
        {
          w: "The gamma parameter in XGBoost is an arbitrary smoothing coefficient.",
          r: "Gamma ($\\gamma$) is the exact Lagrange multiplier representing the cost of adding an additional leaf node to the tree. If split gain is less than $\\gamma$, the split is pruned."
        },
        {
          w: "XGBoost cannot be trained on GPUs.",
          r: "Setting `tree_method='hist'` or `device='cuda'` offloads all histogram construction and gradient binning onto GPU tensor cores, accelerating training by up to 50x."
        },
        {
          w: "XGBoost is always superior to LightGBM and CatBoost.",
          r: "On massive datasets ($>10^7$ rows), LightGBM trains faster with lower memory; on datasets dominated by complex categorical features, CatBoost frequently achieves higher out-of-the-box accuracy."
        }
      ],

      trade: {
        buys: [
          "Incredible speed and scalability via cache-aware parallelization and exact second-order optimization.",
          "Built-in L1 (`reg_alpha`) and L2 (`reg_lambda`) leaf regularization to suppress overfitting on noisy features.",
          "Native handling of sparse matrices and missing values without heuristic imputation artifacts."
        ],
        costs: [
          "Extensive hyperparameter space (`max_depth`, `learning_rate`, `subsample`, `colsample_bytree`, `gamma`, `min_child_weight`) requiring systematic tuning.",
          "Exact greedy split finding (`tree_method='exact'`) requires massive memory for sorting continuous feature columns.",
          "Requires explicit numeric encoding for categorical variables (unlike CatBoost, which handles high-cardinality categories natively)."
        ],
        avoid: [
          "Using `tree_method='exact'` on datasets with more than $10^6$ rows (use `hist` instead).",
          "Leaving `early_stopping_rounds` unset when running grid searches with thousands of boosting rounds."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lightgbm",

      why: {
        before: "XGBoost and traditional GBMs sorted continuous feature values or iterated " +
          "over every data instance to calculate split gradients, exhausting memory bandwidth on big tabular datasets.",
        problem: "As datasets scaled into tens of millions of rows, sorting and scanning all data instances " +
          "at every tree node caused training runtimes to explode from minutes into days.",
        shift: "**LightGBM (Microsoft 2017): Histogram binning, GOSS, and EFB with Leaf-Wise tree growth.** " +
          "Discretize continuous features into 256 integer bins, subsample small-gradient instances (GOSS), " +
          "merge mutually exclusive sparse features (EFB), and grow trees best-first (Leaf-Wise)."
      },

      num: {
        t: "LightGBM performance optimizations vs traditional tree boosting",
        h: ["Innovation Mechanism", "Traditional GBDT / XGBoost (Pre-2017)", "LightGBM", "Performance Impact"],
        r: [
          ["**Tree Growth Strategy**", "Level-wise (depth-wise symmetric)", "**Leaf-wise (best-first)**", "Finds splits with highest loss reduction first; lower loss at equal depth"],
          ["**Data Scanning (GOSS)**", "Scan all $N$ training samples", "**Gradient-based One-Side Sampling**", "Keeps top $a\\%$ largest gradients, subsamples $b\\%$ small gradients with weight correction"],
          ["**Feature Bundling (EFB)**", "Scans every sparse column independently", "**Exclusive Feature Bundling**", "Combines non-overlapping sparse features into dense composite bins"],
          ["**Histogram Binning**", "Sort floating-point values: $\\mathcal{O}(N \\log N)$", "**$\\le 256$ bins (uint8_t)**: $\\mathcal{O}(N)$", "Memory consumption drops by $80\\%$; histogram subtraction enables fast child creation"],
          ["**Training Speed**", "Baseline standard", "**Up to 15x to 20x faster**", "Allows training models on 100M+ rows directly in single-node RAM"]
        ],
        n: "LightGBM engineered breakthroughs across algorithmic theory and hardware " +
          "efficiency. Instead of level-wise tree growth—which splits all nodes at a given depth " +
          "equally—LightGBM uses **Leaf-Wise (Best-First) tree growth**, always choosing the " +
          "leaf that achieves the maximum loss reduction regardless of balance. While leaf-wise " +
          "growth can overfit on small datasets, it is strictly controlled via `max_depth` " +
          "and `num_leaves`. To compress massive datasets, LightGBM quantizes continuous floats " +
          "into 8-bit integer histogram bins ($K \\le 256$), allowing split evaluation in $\\mathcal{O}(K)$ " +
          "time rather than $\\mathcal{O}(N \\log N)$. Furthermore, **Histogram Subtraction** means " +
          "once a parent's histogram and one child's histogram are built, the second child's histogram " +
          "is obtained instantaneously in $\\mathcal{O}(K)$ via simple element-wise subtraction: " +
          "$H_{\\text{right}} = H_{\\text{parent}} - H_{\\text{left}}$. Finally, **GOSS** " +
          "proves mathematically that instances with large gradients contribute more to information " +
          "gain, allowing small-gradient samples to be aggressively downsampled while preserving unbiased estimators."
      },

      miss: [
        {
          w: "LightGBM's leaf-wise tree growth always overfits compared to XGBoost's level-wise growth.",
          r: "Leaf-wise growth achieves lower loss with the same number of leaves. Overfitting only occurs if `num_leaves` is unconstrained; setting `num_leaves < 2^(max_depth)` prevents over-branching."
        },
        {
          w: "Quantizing continuous features into 256 bins severely degrades model accuracy.",
          r: "Feature binning acts as an implicit regularizer. On real-world noisy tabular datasets, histogram quantization almost universally matches or exceeds floating-point exact search accuracy."
        },
        {
          w: "LightGBM cannot handle categorical data without One-Hot Encoding.",
          r: "LightGBM features native categorical split support (`categorical_feature`), partitioning categories into two subsets via Fisher's exact test in $\\mathcal{O}(K \\log K)$ time, outperforming one-hot encoding."
        },
        {
          w: "GOSS introduces severe estimation bias into gradient boosting.",
          r: "GOSS applies a mathematical weight compensation factor $\\frac{1-a}{b}$ to the retained small-gradient samples when computing information gain, proving asymptotic unbiasedness."
        }
      ],

      trade: {
        buys: [
          "Unmatched training velocity and RAM efficiency on massive tabular datasets with tens of millions of rows.",
          "Histogram subtraction eliminates 50% of node histogram construction overhead.",
          "Native high-cardinality categorical feature support without explosive one-hot feature matrix expansion."
        ],
        costs: [
          "Susceptible to rapid overfitting on small datasets ($<10,000$ samples) when using default `num_leaves=31`.",
          "Asymmetric leaf-wise tree structures can be harder to visually reason about than balanced binary trees.",
          "Default hyperparameter configurations require careful tuning of `min_child_samples` to prevent singleton leaf memorization."
        ],
        avoid: [
          "Using LightGBM with default `num_leaves` on tiny datasets ($N < 5,000$).",
          "Applying manual one-hot encoding on high-cardinality categorical features before feeding them to LightGBM."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "catboost",

      why: {
        before: "Target encoding for high-cardinality categorical features suffered from target leakage " +
          "(overfitting to training targets), while standard gradient boosting suffered from prediction shift.",
        problem: "Standard GBDT algorithms calculate gradients using the entire training set, creating a statistical " +
          "dependency between the gradient of sample $i$ and its own label, inducing severe out-of-sample bias.",
        shift: "**CatBoost (Yandex 2017): Ordered Target Statistics and Oblivious (Symmetric) Decision Trees.** " +
          "Compute Target Statistics sequentially over random permutations to eliminate target leakage, " +
          "and grow symmetric decision trees for ultra-fast, cache-friendly SIMD inference."
      },

      num: {
        t: "CatBoost structural innovations & algorithmic comparison",
        h: ["Feature / Property", "LightGBM / XGBoost", "CatBoost (Categorical Boosting)"],
        r: [
          ["**Categorical Encoding**", "One-hot or Fisher partitioning", "**Ordered Target Statistics**: $x_k^i = \\frac{\\sum_{j=1}^{p-1} [x_{\\sigma(j), k} = x_{\\sigma(i), k}] \\cdot y_{\\sigma(j)} + a \\cdot P}{p - 1 + a}$"],
          ["**Tree Structure**", "Asymmetric binary / Leaf-wise", "**Oblivious / Symmetric Trees**: all nodes at the same tree level share the exact same split rule"],
          ["**Gradient Calculation**", "Classical residual gradients", "**Ordered Boosting**: maintains separate models trained on permutation prefixes to eliminate prediction shift"],
          ["**Inference Execution**", "Recursive pointer tree traversal", "**Bitwise SIMD evaluation**: converts entire tree into a flat lookup table indexing binary feature masks"],
          ["**Default Hyperparameter Stability**", "Requires systematic tuning", "**Superior out-of-the-box defaults**: rarely overfits without custom tuning"]
        ],
        n: "CatBoost (Categorical Boosting) solves two fundamental statistical flaws " +
          "in classical gradient boosting: **target leakage** and **prediction shift**. " +
          "When converting categorical features into numerical target statistics, standard methods " +
          "compute the mean target value for that category across the entire dataset, leaking " +
          "ground-truth labels into the feature representation. CatBoost circumvents this via " +
          "**Ordered Target Statistics**: it generates multiple random permutations of the dataset " +
          "and computes target averages strictly from samples appearing *before* the current sample " +
          "in the permutation. In addition, CatBoost builds **Oblivious Decision Trees**, meaning " +
          "every node at depth $d$ tests the exact same feature and threshold. While this appears " +
          "restrictive, symmetric trees act as an exceptional regularizer and map directly to " +
          "**SIMD bitwise instructions**: a 6-deep symmetric tree is evaluated by compiling a 6-bit " +
          "integer index from 6 boolean tests and retrieving the leaf weight in $\\mathcal{O}(1)$ time " +
          "via a flat array lookup, achieving industry-leading inference throughput."
      },

      miss: [
        {
          w: "CatBoost is only useful if your dataset contains categorical features.",
          r: "Even on purely numerical tabular data, CatBoost's Ordered Boosting and symmetric tree architecture routinely match or beat XGBoost/LightGBM by suppressing prediction shift."
        },
        {
          w: "CatBoost is slower than LightGBM on GPU hardware.",
          r: "On modern GPUs, CatBoost's symmetric oblivious tree structure enables extreme tensor parallelization, frequently outperforming LightGBM and XGBoost in multi-GPU training benchmarks."
        },
        {
          w: "CatBoost requires users to manually combine interacting categorical features.",
          r: "CatBoost automatically constructs on-the-fly cross-feature combinations (e.g. `Country` + `DeviceType`) at each tree split, capturing high-order interactions without manual engineering."
        },
        {
          w: "Target encoding in CatBoost is just simple K-Fold target encoding.",
          r: "K-fold target encoding still leaks target distribution within folds; CatBoost uses historical permutation-ordered prefixes with a Bayesian prior parameter $a$ to achieve zero leakage."
        }
      ],

      trade: {
        buys: [
          "State-of-the-art accuracy on tabular datasets with high-cardinality categorical features with zero manual preprocessing.",
          "Blistering inference latency: symmetric oblivious trees compile into branchless SIMD bit-mask array index lookups.",
          "Bulletproof default hyperparameters that rarely require extensive grid/random search to achieve near-optimal results."
        ],
        costs: [
          "Training wall-clock time on CPU can be substantially slower than LightGBM when processing large numbers of categorical combinations.",
          "Higher RAM usage during training due to storing multiple dataset permutations for ordered statistics.",
          "Symmetric tree structure may require greater depth to approximate highly asymmetric decision surfaces."
        ],
        avoid: [
          "Applying manual one-hot encoding to categorical features before passing them to CatBoost.",
          "Using CPU training on massive datasets with dozens of high-cardinality features when GPU acceleration is available."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ensemble-learning",

      why: {
        before: "Machine learning workflows relied on selecting a single best-performing model family " +
          "(e.g., SVM vs Decision Tree), discarding all other hypothesis spaces and betting on one inductive bias.",
        problem: "No single model architecture minimizes all sources of error across complex distributions; " +
          "individual models are vulnerable to sample variance, local minima, and representational limits.",
        shift: "**Ensemble Learning: Combining diverse hypotheses to reduce generalization error.** " +
          "Aggregate the predictions of multiple base estimators via voting, averaging, boosting, " +
          "or meta-learning (stacking) to construct a composite model with provably lower risk."
      },

      num: {
        t: "Ensemble learning taxonomy & error decomposition",
        h: ["Paradigm", "Primary Mechanism", "Base Learner Diversity", "Target Error Source"],
        r: [
          ["**Bagging (Bootstrap Aggregating)**", "Parallel independent training on bootstrap draws; average outputs", "Homogeneous, high-variance learners (e.g. deep trees)", "**Variance reduction**"],
          ["**Boosting**", "Sequential iterative correction; each learner fits previous residuals", "Homogeneous, high-bias learners (e.g. shallow trees)", "**Bias reduction** (and variance)"],
          ["**Stacking (Stacked Generalization)**", "Train meta-model on out-of-fold predictions of base models", "Heterogeneous (e.g. Ridge + LightGBM + Neural Net)", "**Bias & variance reduction**"],
          ["**Voting / Blending**", "Weighted or unweighted majority vote / probability average", "Heterogeneous models evaluated on held-out blend set", "**Variance smoothing**"],
          ["**Condorcet's Jury Bound**", "As $M \\to \\infty$, ensemble accuracy $P \\to 1.0$", "Requires individual learner accuracy $p > 0.5$ and uncorrelated errors", "Eliminates individual error"]
        ],
        n: "The statistical foundation of ensemble learning is rooted in " +
          "**Condorcet's Jury Theorem** and the **Bias-Variance Decomposition**. " +
          "If an ensemble aggregates $M$ independent classifiers that each make errors " +
          "with probability $p < 0.5$, the probability that the majority vote is incorrect " +
          "decays exponentially as $M$ increases: $P_{\\text{error}} = \\sum_{k=\\lceil M/2 \\rceil}^M " +
          "\\binom{M}{k} p^k (1-p)^{M-k} \\to 0$. In continuous regression, the expected mean squared " +
          "error of an ensemble of $M$ models with individual variance $\\sigma^2$ and average correlation $\\rho$ " +
          "is decomposed as: $\\mathbb{E}[\\text{Error}] = \\text{Bias}^2 + \\rho \\sigma^2 + \\frac{1-\\rho}{M} \\sigma^2$. " +
          "When learners are completely uncorrelated ($\\rho = 0$), the variance is reduced by a factor of $1/M$. " +
          "Thus, the central objective across all ensemble engineering is **maximizing diversity** " +
          "among individual models while maintaining individual competence."
      },

      miss: [
        {
          w: "Ensembling any group of models will always improve accuracy.",
          r: "Ensembles only outperform their components if individual models are diverse and have error rates below 0.5. Combining five nearly identical, highly correlated models simply replicates single-model errors with added computational overhead."
        },
        {
          w: "Stacking should be trained on the training data used to fit base models.",
          r: "Training a meta-learner on the base models' training predictions leads to catastrophic target leakage and overfitting. Stacking strictly requires out-of-fold (OOF) cross-validation predictions."
        },
        {
          w: "Ensemble learning is only applicable to decision trees.",
          r: "Ensembling is architecture-agnostic: model averaging across neural network checkpoints (SWA), mixture of experts (MoE), and stacking across linear models and kernel methods are common."
        },
        {
          w: "Soft voting (probability averaging) is identical to hard voting (majority vote).",
          r: "Hard voting discards prediction confidence, treating a 51% certainty prediction the same as a 99% certainty prediction. Soft voting weights predictions by calibrated probabilities, yielding higher ROC-AUC."
        }
      ],

      trade: {
        buys: [
          "Highest possible predictive performance and benchmark-winning accuracy across competitive ML and production ranking.",
          "Drastically lower variance and reduced sensitivity to training set fluctuations.",
          "Ability to combine disparate inductive biases (e.g. combining linear models with non-linear tree ensembles)."
        ],
        costs: [
          "Linear increase in inference latency: deploying an ensemble of 10 models requires executing 10 forward passes.",
          "Loss of direct interpretability: model decisions cannot be explained via a single mathematical equation or tree diagram.",
          "Operational complexity in CI/CD pipelines: managing serialization, versioning, and feature stores for multiple concurrent architectures."
        ],
        avoid: [
          "Ensembling models that have nearly 1.0 prediction correlation with each other.",
          "Deploying massive multi-layer stacked ensembles to hard real-time latency budgets ($<5$ ms) without model distillation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bagging",

      why: {
        before: "High-capacity learning algorithms (such as unpruned decision trees) had low bias " +
          "but suffered from severe sensitivity to the specific training dataset, yielding high test set variance.",
        problem: "Gathering multiple independent datasets from the true data generating distribution " +
          "to train and average multiple models is financially and physically impossible.",
        shift: "**Bagging (Bootstrap Aggregating, Breiman 1996): Resample the training dataset with replacement.** " +
          "Generate $B$ synthetic bootstrap datasets of size $N$, fit an independent high-variance base learner " +
          "to each, and aggregate their predictions via simple averaging or majority voting."
      },

      num: {
        t: "Bagging bootstrap sampling properties & statistical limits",
        h: ["Metric / Property", "Mathematical Value", "Significance in Practice"],
        r: [
          ["**Bootstrap Sample Size**", "$N$ samples drawn with replacement from dataset of size $N$", "Matches original empirical distribution scale and sample size"],
          ["**Inclusion Probability**", "$1 - \\left(1 - \\frac{1}{N}\\right)^N \\xrightarrow{N\\to\\infty} 1 - e^{-1} \\approx 63.2\\%$", "Each bootstrap sample contains roughly $63.2\\%$ unique training observations"],
          ["**Out-Of-Bag (OOB) Fraction**", "$\\left(1 - \\frac{1}{N}\\right)^N \\xrightarrow{N\\to\\infty} e^{-1} \\approx 36.8\\%$", "Roughly $36.8\\%$ of data is omitted per model, providing unbiased test validation"],
          ["**Variance Reduction Bound**", "$\\text{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1-\\rho}{B}\\sigma^2$", "Variance drops to the irreducible floor $\\rho \\sigma^2$ set by pairwise learner correlation"],
          ["**Bias Impact**", "$\\text{Bias}(\\bar{f}) \\approx \\text{Bias}(f_1)$ (slightly higher)", "Bagging cannot fix high-bias models (e.g. shallow linear models)"]
        ],
        n: "Bootstrap Aggregating is the definitive statistical variance-reduction " +
          "technique for unstable estimators. By drawing $N$ observations uniformly " +
          "at random with replacement from a training dataset of size $N$, the probability " +
          "that any specific observation is *not* selected in $N$ draws is $(1 - 1/N)^N$. " +
          "As $N \\to \\infty$, this converges to $1/e \\approx 0.3679$, meaning that approximately " +
          "**36.8% of the data** is excluded from each bootstrap draw. These untouched instances " +
          "form the **Out-Of-Bag (OOB)** set, enabling each base model $b$ to be evaluated solely " +
          "on samples it never saw during training. Averaging the predictions across $B$ models " +
          "smooths out the jagged, idiosyncratic decision boundaries caused by individual outlier " +
          "data points. However, because each base learner is trained on the same underlying dataset, " +
          "the base models are inevitably positively correlated ($\\rho > 0$), which sets a hard " +
          "theoretical lower bound $\\rho \\sigma^2$ on the variance reduction achievable through " +
          "pure bagging alone."
      },

      miss: [
        {
          w: "Bagging improves the performance of any machine learning algorithm, including linear regression.",
          r: "Bagging only reduces variance. For stable, low-variance high-bias algorithms like linear regression or naive Bayes, bagging provides virtually zero accuracy improvement and can slightly increase bias."
        },
        {
          w: "Bootstrap sampling draws samples without replacement.",
          r: "Bootstrap sampling strictly requires sampling WITH replacement. Sampling without replacement of size N would simply recreate the exact original dataset every time."
        },
        {
          w: "Out-of-Bag (OOB) error estimation is optimistic compared to K-Fold cross-validation.",
          r: "OOB error has been mathematically and empirically proven to be an unbiased estimate of generalization error, yielding results virtually identical to K-Fold CV without additional model training."
        },
        {
          w: "Bagging is identical to Random Forest.",
          r: "Bagging simply averages models trained on bootstrap samples. Random Forest extends bagging by also sampling a random subset of features at every individual node split to decorrelate the trees."
        }
      ],

      trade: {
        buys: [
          "Proven, dramatic variance reduction for unstable, high-capacity models (unpruned trees, neural networks).",
          "Built-in out-of-bag validation eliminating the computational need for separate cross-validation folds.",
          "Trivially parallelizable: every bootstrap model is trained completely independently on isolated threads or cluster nodes."
        ],
        costs: [
          "Incapable of reducing bias: if base learners systematically underfit the problem, bagging will not rescue performance.",
          "Multiplies memory consumption and inference time by a factor of $B$ relative to a single base model.",
          "Loss of direct model interpretability compared to examining a single decision tree."
        ],
        avoid: [
          "Applying bagging to stable, high-bias models like Ridge Regression or Linear SVMs.",
          "Setting the bootstrap sample size significantly smaller than $N$ without understanding the resulting increase in model bias."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
