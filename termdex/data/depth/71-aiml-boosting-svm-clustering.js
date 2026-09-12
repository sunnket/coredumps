/* ==========================================================================
   Depth pass 71 — AI/ML core batch 9: boosting, SVM, clustering & projection.
   Boosting, Support Vector Machine, K-Nearest Neighbours,
   K-Means Clustering, DBSCAN, Hierarchical Clustering,
   Principal Component Analysis, t-SNE.

   Support vectors define maximal separation margins; clustering groups
   density and distance; dimensionality reduction maps high-dimensional
   manifolds onto orthogonal or probabilistic topological manifolds.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "boosting",

      why: {
        before: "Machine learning theory assumed that creating a highly accurate predictive model " +
          "required discovering a complex, monolithic algorithm capable of high-dimensional non-linear fitting.",
        problem: "In 1988, Kearns and Valiant posed a fundamental question in PAC (Probably Approximately Correct) " +
          "learning theory: can an ensemble of weak learners (which perform only slightly better than random guessing) " +
          "be provably combined to construct an arbitrarily strong learner?",
        shift: "**Boosting (Schapire 1990, Freund & Schapire 1996): Sequential error-adaptive re-weighting.** " +
          "Iteratively train weak base learners where each subsequent learner focuses computational capacity " +
          "on the errors and residuals of its predecessors, linearly combining their outputs to drive training error to zero."
      },

      num: {
        t: "Boosting paradigm comparison: AdaBoost vs Gradient Boosting",
        h: ["Dimension / Property", "AdaBoost (Adaptive Boosting)", "Gradient Boosting (GBM)", "Theoretical Implication"],
        r: [
          ["**Optimization Mechanism**", "Reweights training instance weights $w_i$", "Fits pseudo-residuals $-\\nabla L$", "AdaBoost reweights points; GBM performs gradient descent in function space"],
          ["**Loss Function**", "Constrained strictly to **Exponential Loss** ($e^{-yF}$)", "Any differentiable loss (Huber, Logit, MSE)", "Exponential loss is notoriously vulnerable to noisy/flipped labels"],
          ["**Base Learner Aggregation**", "Weighted sum based on error: $\\alpha_m = \\frac{1}{2}\\ln\\frac{1-\\epsilon_m}{\\epsilon_m}$", "Shrunk additive sum: $F_m = F_{m-1} + \\eta h_m$", "AdaBoost weights learners by performance; GBM uses uniform shrinkage $\\eta$"],
          ["**Training Error Bound**", "$\\epsilon_{\\text{train}} \\le \\exp\\left(-2\\sum_{m=1}^M \\gamma_m^2\\right)$", "Asymptotically converges to empirical risk minimum", "**Guaranteed exponential decay** of training error under weak learner assumption"],
          ["**Margin Theory**", "Maximizes the minimal classification margin", "Optimizes functional loss margin", "Explains why boosting often resists overfitting even after training error is zero"]
        ],
        n: "Boosting fundamentally transformed statistical learning theory. " +
          "Robert Schapire's mathematical proof demonstrated that any weak learning " +
          "algorithm that achieves an error rate $\\epsilon < 0.5 - \\gamma$ (marginally " +
          "better than a coin flip) can be amplified into a **strong learner** with " +
          "arbitrarily small error $\\epsilon > 0$. In **AdaBoost**, each sample begins " +
          "with equal weight $w_i = 1/N$. At each round $m$, a weak classifier $h_m(x)$ " +
          "is trained, its weighted error $\\epsilon_m$ is computed, and its stage weight " +
          "$\\alpha_m = \\frac{1}{2}\\ln\\left(\\frac{1-\\epsilon_m}{\\epsilon_m}\\right)$ is assigned. " +
          "Sample weights are then updated: correctly classified points are downweighted by $e^{-\\alpha_m}$, " +
          "while misclassified points are boosted by $e^{+\\alpha_m}$, forcing the next learner " +
          "to prioritize difficult, boundary-adjacent instances. Schapire and Freund later proved " +
          "via **Margin Theory** that boosting does not merely minimize 0-1 classification loss; " +
          "it continually drives the classification margins of training points further from the decision boundary, " +
          "which explains why boosting frequently avoids overfitting long after achieving 100% training accuracy."
      },

      miss: [
        {
          w: "Boosting trains models in parallel to speed up execution.",
          r: "Boosting is fundamentally sequential: learner m cannot be trained until learner m-1 has evaluated the dataset and computed errors or pseudo-residuals."
        },
        {
          w: "AdaBoost is robust to noisy datasets with mislabeled samples.",
          r: "AdaBoost is extraordinarily sensitive to noise: because exponential loss exponentially increases the weight of persistent errors, the algorithm wastes its capacity memorizing label noise and outliers."
        },
        {
          w: "Boosting is just an informal heuristic without mathematical guarantees.",
          r: "Boosting has rigorous PAC-learning foundation proofs guaranteeing that training error drops exponentially with the number of boosting iterations."
        },
        {
          w: "Weak learners in boosting must be complex, high-depth decision trees.",
          r: "Boosting requires weak learners with high bias and low variance—most commonly decision stumps (trees of depth 1) or shallow trees of depth 2 to 4."
        }
      ],

      trade: {
        buys: [
          "Provable bias reduction: converts simple, constrained weak learners into highly expressive non-linear models.",
          "Automatic margin maximization: pushes decision boundaries away from training instances, enhancing generalization.",
          "Flexible foundation: underpins the most competitive tabular algorithms in industry (XGBoost, LightGBM, CatBoost)."
        ],
        costs: [
          "Inability to parallelize training across sequential iterations, bounding training velocity by serial execution.",
          "High sensitivity to outliers and corrupted ground-truth labels, which can hijack the sequential boosting weights.",
          "Risk of severe overfitting on small datasets if the number of boosting iterations is not bounded by validation early stopping."
        ],
        avoid: [
          "Using AdaBoost on datasets known to contain severe label noise or extreme measurement outliers.",
          "Setting deep base trees (`max_depth > 10`) within boosting workflows, which defeats the weak-learner premise."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "support-vector-machine",

      why: {
        before: "Linear classifiers (Perceptron, Logistic Regression) found arbitrary separating hyperplanes " +
          "among infinite valid options, often passing dangerously close to training points and failing on new data.",
        problem: "Classifiers with razor-thin margins have high generalization error, while mapping data into high-dimensional " +
          "spaces to make it linearly separable leads to computational intractability and the curse of dimensionality.",
        shift: "**Support Vector Machine (Cortes & Vapnik 1995): Maximum margin hyperplanes with the Kernel Trick.** " +
          "Find the unique hyperplane that maximizes the geometric margin $\\frac{2}{\\|w\\|}$ between classes, " +
          "and project non-linear data into infinite-dimensional Hilbert spaces using inner-product kernels without explicit transformation."
      },

      num: {
        t: "SVM formulation, optimization mathematics & kernels",
        h: ["Kernel / Parameter", "Mathematical Formula", "Geometry / Feature Space", "Complexity / Behavior"],
        r: [
          ["**Primal Objective (Soft Margin)**", "$\\min_{w, b, \\xi} \\frac{1}{2}\\|w\\|^2 + C \\sum_{i=1}^N \\xi_i$", "Constrained quadratic programming with slack variables $\\xi_i$", "$C$ controls margin width vs training violations"],
          ["**Dual Formulation**", "$\\max_\\alpha \\sum \\alpha_i - \\frac{1}{2} \\sum \\alpha_i \\alpha_j y_i y_j K(x_i, x_j)$", "Solution depends **only on inner products** between support vectors", "Sparse solution: $\\alpha_i > 0$ strictly for support vectors"],
          ["**Linear Kernel**", "$K(x, x') = x^T x'$", "Original input feature space $\\mathbb{R}^p$", "$\\mathcal{O}(p)$ per evaluation; best for high-dimensional text ($p > N$)"],
          ["**RBF / Gaussian Kernel**", "$K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)$", "**Infinite-dimensional** Hilbert space", "$\\gamma = \\frac{1}{2\\sigma^2}$; high $\\gamma$ creates tight localized islands"],
          ["**Polynomial Kernel**", "$K(x, x') = (\\gamma x^T x' + r)^d$", "Degree-$d$ polynomial combinations", "Captures explicit feature intersections up to degree $d$"]
        ],
        n: "The Support Vector Machine is grounded in **Structural Risk Minimization** " +
          "from statistical learning theory. The geometric distance from any point $x_i$ " +
          "to a hyperplane $w^T x + b = 0$ is $\\frac{y_i(w^T x_i + b)}{\\|w\\|}$. " +
          "Maximizing this margin is equivalent to minimizing $\\frac{1}{2}\\|w\\|^2$ subject " +
          "to $y_i(w^T x_i + b) \\ge 1 - \\xi_i$. The parameter $C$ acts as an inverse regularization " +
          "constant: large $C$ heavily penalizes margin violations (hard margin behavior, risk of overfitting), " +
          "whereas small $C$ tolerates more violations to achieve a wider, more robust margin. " +
          "Solving the Lagrangian dual problem reveals that the weight vector is a sparse linear " +
          "combination of only those critical data points that lie exactly on or inside the margin: " +
          "$w = \\sum_{i \\in \\text{SVs}} \\alpha_i y_i x_i$. All non-support vector data points " +
          "have $\\alpha_i = 0$ and can be deleted from the dataset with zero impact on the boundary. " +
          "Through **Mercer's Theorem**, any positive semi-definite kernel function $K(x, x') = \\langle \\phi(x), \\phi(x') \\rangle$ " +
          "computes inner products in a transformed high-dimensional space without ever calculating " +
          "the expensive coordinates $\\phi(x)$ directly—the celebrated **Kernel Trick**."
      },

      miss: [
        {
          w: "In scikit-learn's SVC, a larger C value provides stronger regularization.",
          r: "C is inversely proportional to regularization ($C \\propto 1/\\lambda$). A large C imposes a heavy penalty on classification errors, leading to a narrower margin and potential overfitting."
        },
        {
          w: "SVMs scale efficiently to datasets with millions of training samples.",
          r: "Standard dual quadratic programming solvers (like SMO in LIBSVM) scale between $\\mathcal{O}(N^2)$ and $\\mathcal{O}(N^3)$ with respect to sample size N, making non-linear kernel SVMs intractable for $N > 100,000$."
        },
        {
          w: "SVM does not require feature scaling when using the RBF kernel.",
          r: "RBF kernels compute Euclidean distances $\\|x - x'\\|^2$. If one feature has scale [0, 1000] and another [0, 1], the large feature completely dominates distance calculations; scaling is mandatory."
        },
        {
          w: "SVM outputs true calibrated class probabilities natively.",
          r: "SVMs are non-probabilistic geometric margin classifiers. Probability estimates (`probability=True`) require running expensive Platt Scaling (fitting a post-hoc logistic sigmoid via 5-fold CV)."
        }
      ],

      trade: {
        buys: [
          "Theoretical optimality: convex quadratic programming guarantees finding the globally optimal hyperplane with no local minima.",
          "High-dimensional efficacy: excels in spaces where feature count exceeds sample count ($p > N$), such as genomics and text classification.",
          "Memory efficiency at inference time: only the subset of support vectors needs to be retained in memory for decision evaluation."
        ],
        costs: [
          "Quadratic to cubic training complexity $\\mathcal{O}(N^2 \\text{ to } N^3)$ making kernel SVMs unviable for large-scale production data.",
          "Sensitive to hyperparameter combinations: finding the optimal pairing of $(C, \\gamma)$ requires fine-grained exponential grid search.",
          "Uncalibrated outputs: does not provide native probabilities without expensive secondary Platt scaling."
        ],
        avoid: [
          "Using non-linear kernel SVM on datasets with more than 100,000 rows (use LinearSVC or GBDTs instead).",
          "Feeding unscaled features into an SVM with RBF or polynomial kernels."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "k-nearest-neighbours",

      why: {
        before: "Parametric learning algorithms (e.g. Linear Regression, Logistic Regression) assumed " +
          "a fixed mathematical functional form for the data generating distribution, failing when patterns were complex and multi-modal.",
        problem: "Parametric models cannot adapt their capacity as more data arrives, and fitting them requires " +
          "expensive iterative training phases before any prediction can occur.",
        shift: "**K-Nearest Neighbours (Cover & Hart 1967): Instance-based non-parametric lazy learning.** " +
          "Skip training entirely by memorizing the training instances, and predict the label of a query point " +
          "by finding the $k$ closest neighbors in feature space and taking their majority vote or distance-weighted average."
      },

      num: {
        t: "KNN distance metrics, algorithmic complexity & indexing data structures",
        h: ["Search Algorithm", "Training Complexity", "Query / Inference Complexity", "Best Suited Data Profile"],
        r: [
          ["**Brute Force (Flat Scan)**", "$\\mathcal{O}(1)$ (zero training)", "$\\mathcal{O}(N \\cdot p)$ per query", "Small datasets ($N < 5,000$) or very high dimensions ($p > 50$)"],
          ["**KD-Tree**", "$\\mathcal{O}(p \\cdot N \\log N)$", "$\\mathcal{O}(2^p \\log N)$", "Low-dimensional continuous Euclidean spaces ($p < 20$)"],
          ["**Ball Tree**", "$\\mathcal{O}(p \\cdot N \\log N)$", "$\\mathcal{O}(p \\log N)$", "Medium-dimensional spaces or non-Euclidean metric distances"],
          ["**HNSW (Approximate)**", "$\\mathcal{O}(N \\log N)$", "$\\mathcal{O}(\\log N)$ with $\\ge 99\\%$ recall", "**Massive scale vector search** (millions of vectors, $p > 1,000$)"],
          ["**Cover-Hart Bound** (theory)", "—", "$R^* \\le R_{\\text{Bayes}} \\le 2 R^*(1 - R^*)$ as $N \\to \\infty$", "**1-NN error is at most twice the Bayes optimal error**"]
        ],
        n: "K-Nearest Neighbours (KNN) is the archetype of **lazy learning** " +
          "and non-parametric estimation. Because it makes no assumptions about " +
          "the underlying probability distribution, its representational capacity " +
          "grows naturally with the size of the dataset. The core decision rule " +
          "computes distances between a test query $x$ and all training points using " +
          "the **Minkowski Distance**: $D(x, x') = \\left( \\sum_{j=1}^p |x_j - x'_j|^q \\right)^{1/q}$ " +
          "(where $q=2$ is Euclidean distance and $q=1$ is Manhattan distance). " +
          "The hyperparameter $k$ governs the bias-variance trade-off: when $k=1$, " +
          "the model fits Voronoi tessellation cells tightly around every training point, " +
          "yielding **zero training error but high variance** (hypersensitive to noise). " +
          "As $k \\to N$, the prediction approaches the global majority class, creating " +
          "**high bias and near-zero variance**. While training complexity is virtually zero " +
          "($\\mathcal{O}(1)$), inference requires computing distances across all $N$ data points, " +
          "creating an $\\mathcal{O}(N \\cdot p)$ bottleneck at runtime."
      },

      miss: [
        {
          w: "KNN has a fast inference phase because it has zero training time.",
          r: "The exact opposite is true: KNN is a lazy learner that defers all computation to inference time. Querying a single test sample requires scanning and computing distances to every training instance."
        },
        {
          w: "KNN performs well on raw data without feature scaling.",
          r: "KNN depends entirely on geometric distance. If one feature ranges from 0 to 100,000 (e.g. income) and another from 0 to 1 (e.g. age ratio), the income feature completely dominates the distance metric."
        },
        {
          w: "Increasing k always makes a KNN model more complex and prone to overfitting.",
          r: "Increasing k increases smoothing and simplifies the decision boundary. The effective degrees of freedom of KNN is $N/k$; hence, $k=1$ is the most complex model, while $k=N$ is the simplest."
        },
        {
          w: "KD-Trees maintain fast logarithmic $\\mathcal{O}(\\log N)$ search speed in 500-dimensional spaces.",
          r: "KD-trees suffer catastrophically from the curse of dimensionality: when $p > 20$, the algorithm must inspect nearly all leaves, degrading to worse performance than an unindexed brute-force scan."
        }
      ],

      trade: {
        buys: [
          "Zero training time: new data instances can be appended to the index instantly without retraining models.",
          "Non-parametric adaptability: effortlessly models arbitrarily complex, multi-modal, non-linear decision boundaries.",
          "Intuitive explainability: decisions can be justified to end users by displaying the exact $k$ most similar historical examples."
        ],
        costs: [
          "Severe inference latency and computational cost $\\mathcal{O}(N \\cdot p)$ that scales poorly in production APIs.",
          "High memory footprint: the entire training dataset must reside in active memory at all times.",
          "Catastrophic vulnerability to irrelevant and noisy features, which distort distance calculations in high dimensions."
        ],
        avoid: [
          "Using KNN for real-time high-throughput prediction on datasets with more than 100,000 samples without approximate vector indexers (e.g. FAISS/HNSW).",
          "Running KNN on high-dimensional data without prior dimensionality reduction or feature selection."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "k-means-clustering",

      why: {
        before: "Grouping unlabelled observations required manual domain heuristic rules or exhaustive " +
          "pair-wise similarity evaluations that scaled quadratically with dataset size.",
        problem: "Unsupervised discovery of latent customer segments or feature groupings requires an efficient " +
          "mathematical objective that clusters observations without external supervision.",
        shift: "**K-Means Clustering (Lloyd 1957, MacQueen 1967): Expectation-Maximization partition optimization.** " +
          "Partition $N$ observations into $K$ clusters by iteratively alternating between assigning each point " +
          "to its closest cluster centroid and recalculating centroids as the arithmetic mean of assigned points."
      },

      num: {
        t: "K-Means algorithmic phases, complexity & initialization strategies",
        h: ["Phase / Method", "Mathematical Operation", "Computational Complexity", "Key Purpose / Behavior"],
        r: [
          ["**Standard Objective (WCSS / Inertia)**", "$J = \\sum_{k=1}^K \\sum_{x_i \\in S_k} \\|x_i - \\mu_k\\|^2$", "$\\mathcal{O}(N \\cdot K \\cdot p \\cdot I)$", "Minimizes Within-Cluster Sum of Squares across $I$ iterations"],
          ["**Assignment Step (Expectation)**", "$S_k^{(t)} = \\{x_i : \\|x_i - \\mu_k^{(t)}\\|^2 \\le \\|x_i - \\mu_j^{(t)}\\|^2 \\,\\forall j\\}$", "$\\mathcal{O}(N \\cdot K \\cdot p)$ per pass", "Assigns every point to its closest Euclidean centroid"],
          ["**Update Step (Maximization)**", "$\\mu_k^{(t+1)} = \\frac{1}{|S_k^{(t)}|} \\sum_{x_i \\in S_k^{(t)}} x_i$", "$\\mathcal{O}(N \\cdot p)$ per pass", "Recomputes centroid as the exact center of mass"],
          ["**K-Means++ Initialization**", "Selects next centroid with probability $\\frac{D(x)^2}{\\sum D(x')^2}$", "$\\mathcal{O}(N \\cdot K \\cdot p)$ prior to Lloyd", "**Guarantees $\\mathcal{O}(\\log K)$-competitive** bound relative to global optimum"],
          ["**Mini-Batch K-Means**", "Updates centroids using stochastic sub-batches of size $B$", "$\\mathcal{O}(B \\cdot K \\cdot p)$ per step", "Reduces convergence runtime by up to $90\\%$ for massive streaming data"]
        ],
        n: "K-Means is the foundational algorithm of **partition-based unsupervised learning**. " +
          "It frames clustering as an optimization problem designed to minimize **Inertia** " +
          "(Within-Cluster Sum of Squares, WCSS). Because finding the global minimum across all " +
          "possible partitions is NP-hard, **Lloyd's Algorithm** applies a greedy 2-step " +
          "iterative heuristic that is mathematically guaranteed to converge to a local minimum: " +
          "(1) assignment of points to nearest centroids, and (2) recomputation of centroids. " +
          "However, standard random initialization frequently traps the algorithm in poor local optima. " +
          "To solve this, **K-Means++** (Arthur & Vassilvitskii 2007) seeds the initial centroids " +
          "by choosing the first centroid uniformly at random and subsequent centroids with a probability " +
          "proportional to the squared Euclidean distance $D(x)^2$ to the nearest existing centroid. " +
          "This spreads initial centers across the feature space, yielding provable $\\mathcal{O}(\\log K)$ " +
          "approximation bounds and accelerating convergence by orders of magnitude. The optimal $K$ " +
          "is traditionally evaluated via the **Elbow Method** (detecting the point of diminishing returns in WCSS) " +
          "or the **Silhouette Score** (measuring cluster tightness versus separation)."
      },

      miss: [
        {
          w: "K-Means can detect clusters of arbitrary shapes, such as concentric circles or interlocking spirals.",
          r: "K-Means minimizes Euclidean distance to a single central point, mathematically enforcing convex, spherical Voronoi cluster boundaries. It fails completely on non-convex or manifold geometries."
        },
        {
          w: "Running K-Means multiple times with random initialization is just as effective as K-Means++.",
          r: "Random restarts still have high probability of placing multiple centroids within the same dense cluster. K-Means++ provably achieves an expected approximation ratio within $\\mathcal{O}(\\log K)$ of the global optimum."
        },
        {
          w: "K-Means automatically determines the optimal number of clusters K.",
          r: "K is a mandatory hyperparameter that must be specified beforehand. Determining K requires external evaluation metrics like the Silhouette Coefficient, Davies-Bouldin index, or the Elbow Method."
        },
        {
          w: "K-Means is robust to feature scale differences.",
          r: "Because centroid updates and point assignments compute Euclidean distance $\\|x - \\mu\\|^2$, unscaled features with large variances completely distort cluster geometries. Standardization is essential."
        }
      ],

      trade: {
        buys: [
          "Linear scalability $\\mathcal{O}(N \\cdot K \\cdot p \\cdot I)$, making it fast and practical for millions of data points.",
          "Simplicity of implementation and clear geometric interpretability via cluster centroids as representative archetypes.",
          "Mini-Batch variants allow clustering streaming datasets that exceed available system memory."
        ],
        costs: [
          "Assumes spherical, equally-sized clusters with similar isotropic variances; struggles with elongated or varying-density data.",
          "Hypersensitive to outliers, which disproportionately pull centroids away from true cluster cores due to squared distances.",
          "Requires pre-specifying the integer count $K$ without knowing ground-truth cluster counts."
        ],
        avoid: [
          "Using K-Means on non-convex geometric topologies (use DBSCAN or Spectral Clustering instead).",
          "Applying K-Means to high-dimensional sparse text vectors without prior dimensionality reduction or spherical cosine normalization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dbscan",

      why: {
        before: "Partitioning algorithms (K-Means) required pre-specifying cluster count $K$, " +
          "forced every point (including extreme outliers) into a cluster, and could only find spherical shapes.",
        problem: "Real-world physical and spatial data contains arbitrary non-convex geometries " +
          "(e.g. winding coastlines, winding trajectories) and abundant sensor noise that corrupts distance-based centroids.",
        shift: "**DBSCAN (Ester et al. 1996): Density-based spatial clustering with noise rejection.** " +
          "Discover clusters as contiguous high-density regions separated by low-density zones, " +
          "automatically classifying isolated points as noise without requiring a target cluster count."
      },

      num: {
        t: "DBSCAN point classification, parameters & algorithmic complexity",
        h: ["Point Type / Metric", "Definition / Mathematical Rule", "Algorithmic Behavior", "Complexity"],
        r: [
          ["**Epsilon Neighborhood ($N_\\epsilon(p)$)**", "$\\{q \\in D : \\text{dist}(p, q) \\le \\epsilon\\}$", "Search radius determining local proximity reach", "$\\mathcal{O}(N \\log N)$ with KD-tree / Ball-tree"],
          ["**Core Point**", "$|N_\\epsilon(p)| \\ge \\text{min\\_samples}$", "Anchors a dense cluster; initiates recursive expansion", "Triggers breadth-first density traversal"],
          ["**Border Point**", "$|N_\\epsilon(p)| < \\text{min\\_samples}$ but $p \\in N_\\epsilon(\\text{Core})$", "Lies on the outer fringe of a cluster; assigned to core's cluster", "Terminal leaf of cluster boundary"],
          ["**Noise Point (Outlier)**", "Neither Core nor Border", "**Labeled as $-1$ (outlier)**; rejected from all clusters", "Filtered automatically without distorting clusters"],
          ["**Computational Complexity**", "Brute force: $\\mathcal{O}(N^2)$ / Spatial index: $\\mathcal{O}(N \\log N)$", "No need to pre-specify $K$; finds arbitrary cluster topologies", "Memory: $\\mathcal{O}(N)$"]
        ],
        n: "DBSCAN (Density-Based Spatial Clustering of Applications with Noise) " +
          "replaces distance-to-centroid with **density-reachability**. A point $p$ is a " +
          "**Core Point** if at least `min_samples` points reside within distance $\\epsilon$ of it. " +
          "A point $q$ is **directly density-reachable** from $p$ if $q \\in N_\\epsilon(p)$ and $p$ is a Core Point. " +
          "Density-reachability is the transitive closure of this relation: if $p_1$ connects to $p_2$, " +
          "which connects to $p_3$, all mutually reachable core points and their border points are " +
          "merged into a single, unified cluster. Any point that cannot be reached from any core point " +
          "is designated as **Noise (label -1)**. This architecture allows DBSCAN to effortlessly isolate " +
          "complex topological manifolds, such as intertwined rings, concentric arcs, and serpentine paths. " +
          "Furthermore, because DBSCAN does not force noise points into clusters, it serves as a dual-purpose " +
          "**anomaly detection** system. However, DBSCAN relies on a single global $\\epsilon$, making it " +
          "ineffective when a dataset contains multiple clusters with wildly varying local densities—a " +
          "limitation later resolved by **HDBSCAN** (Hierarchical DBSCAN)."
      },

      miss: [
        {
          w: "DBSCAN requires the user to specify the expected number of clusters K.",
          r: "DBSCAN discovers the number of clusters dynamically based on density connectivity. The user only tunes epsilon (radius) and min_samples (density threshold)."
        },
        {
          w: "DBSCAN can cluster datasets with clusters of varying densities effectively.",
          r: "A single global epsilon cannot capture both dense and sparse clusters: an epsilon tuned for dense clusters will classify sparse clusters as noise, while a larger epsilon merges dense clusters into a single giant blob."
        },
        {
          w: "DBSCAN is completely deterministic for all data points.",
          r: "While core point cluster assignments and noise classifications are deterministic, border points reachable from multiple distinct core clusters can be assigned to whichever cluster reaches them first, depending on data ordering."
        },
        {
          w: "DBSCAN scales effortlessly to 10,000-dimensional embedding vectors.",
          r: "Due to the curse of dimensionality, spatial indexing structures (KD-trees) break down in high dimensions, causing DBSCAN to degenerate to $\\mathcal{O}(N^2)$ pairwise distance calculations where Euclidean distance distances become uniform."
        }
      ],

      trade: {
        buys: [
          "Discovers arbitrary non-convex cluster shapes that defeat K-Means and Gaussian Mixture Models.",
          "Robust noise filtering: automatically identifies and isolates outliers rather than forcing them into clusters.",
          "Eliminates the requirement to guess or pre-specify the number of clusters $K$ upfront."
        ],
        costs: [
          "Cannot handle multi-density datasets where different clusters have significantly different spatial concentrations.",
          "Hypersensitive to the $(\\epsilon, \\text{min\\_samples})$ parameter pairing: slight shifts in $\\epsilon$ cause dramatic cluster merging or fragmentation.",
          "Degrades to $\\mathcal{O}(N^2)$ compute and struggles geometrically in high-dimensional feature spaces ($p > 30$)."
        ],
        avoid: [
          "Using standard DBSCAN on datasets with heavily varied cluster densities (use HDBSCAN instead).",
          "Applying Euclidean DBSCAN to raw high-dimensional text embeddings without cosine metric adaptation or prior PCA/UMAP projection."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hierarchical-clustering",

      why: {
        before: "Flat clustering algorithms (K-Means, DBSCAN) produced an unnested partition of data " +
          "at a single fixed resolution, revealing nothing about the multi-scale taxonomy or hierarchical relationships.",
        problem: "Biological taxonomies, document ontologies, and organizational structures exhibit nested multi-level groupings " +
          "that cannot be expressed as a single flat list of clusters.",
        shift: "**Hierarchical Clustering (Agglomerative / Divisive): Recursive multi-scale dendrogram induction.** " +
          "Build a nested hierarchy of clusters by either iteratively merging the most similar clusters bottom-up (Agglomerative) " +
          "or recursively splitting clusters top-down (Divisive), visualizing the entire structure as a Dendrogram."
      },

      num: {
        t: "Hierarchical linkage criteria & mathematical distance formulations",
        h: ["Linkage Criterion", "Inter-Cluster Distance Metric $D(A, B)$", "Cluster Geometry Bias", "Outlier Sensitivity"],
        r: [
          ["**Single Linkage (Minimum)**", "$\\min \\{d(x, y) : x \\in A, y \\in B\\}$", "Elongated, non-elliptical shapes; prone to **Chaining Effect**", "Highly sensitive to single noisy bridge points"],
          ["**Complete Linkage (Maximum)**", "$\\max \\{d(x, y) : x \\in A, y \\in B\\}$", "Compact, tightly bounded spherical clusters with equal diameters", "Resistant to chaining; favors uniform cluster sizes"],
          ["**Average Linkage (UPGMA)**", "$\\frac{1}{|A||B|} \\sum_{x \\in A} \\sum_{y \\in B} d(x, y)$", "Balanced compromise between single and complete linkage", "Relatively robust to individual outliers"],
          ["**Ward's Minimum Variance**", "$\\Delta \\text{ESS} = \\frac{|A||B|}{|A|+|B|} \\|\\mu_A - \\mu_B\\|^2$", "Minimizes within-cluster variance (like K-Means); spherical", "Robust; most popular linkage for general tabular clustering"],
          ["**Algorithmic Complexity**", "Standard: $\\mathcal{O}(N^3)$ / Optimized: $\\mathcal{O}(N^2 \\log N)$", "Requires storing $N \\times N$ distance matrix: $\\mathcal{O}(N^2)$ RAM", "Prohibitive for large datasets ($N > 30,000$)"]
        ],
        n: "Hierarchical Agglomerative Clustering (HAC) is the premier " +
          "framework for uncovering nested multi-scale structures. The algorithm initializes " +
          "with each data point in its own singleton cluster ($N$ clusters) and iteratively " +
          "merges the two clusters that exhibit the minimum linkage distance until a single " +
          "universal root cluster remains. The entire history of merges is preserved in a " +
          "tree structure called a **Dendrogram**, where the vertical height of each branch " +
          "represents the exact dissimilarity at which the merge occurred. A practitioner can " +
          "extract any desired number of clusters post-hoc by drawing a horizontal slice across " +
          "the dendrogram at a chosen distance threshold. The choice of **Linkage Criterion** " +
          "dictates the geometric bias of the algorithm: **Single Linkage** connects clusters " +
          "based on their closest pair of points, which can cause disastrous **chaining** where " +
          "disparate clusters are fused by a sparse line of noise points; **Ward's Linkage** " +
          "calculates the increase in total within-cluster sum of squares after merging, " +
          "producing balanced, robust clusters analogous to an exhaustive hierarchical K-Means."
      },

      miss: [
        {
          w: "Hierarchical clustering allows you to adjust the clustering decisions retrospectively during the run.",
          r: "HAC is strictly greedy and irreversible: once two clusters or samples are merged in an agglomerative step, they can never be separated or reassigned at subsequent levels."
        },
        {
          w: "Single linkage is the best linkage method because it finds non-spherical shapes.",
          r: "Single linkage suffers severely from the chaining phenomenon: a single stray noise point between two distinct clusters will cause the algorithm to merge them into a single sprawling component."
        },
        {
          w: "Hierarchical clustering scales well to millions of samples.",
          r: "Agglomerative clustering requires computing and updating an $N \\times N$ distance matrix, demanding $\\mathcal{O}(N^2)$ memory and $\\mathcal{O}(N^2 \\log N)$ time, making it unfeasible for $N > 50,000$ without subsampling."
        },
        {
          w: "You must know the number of clusters before running hierarchical clustering.",
          r: "The dendrogram is computed independently of cluster count. Slicing the dendrogram to form discrete clusters is done entirely after the full hierarchy is built."
        }
      ],

      trade: {
        buys: [
          "Rich taxonomic interpretability: the dendrogram provides an intuitive multi-level visualization of data relationships.",
          "Post-hoc threshold flexibility: allows choosing cluster granularity after viewing the complete tree without re-running training.",
          "Works with any custom distance metric (e.g. Jaccard, Cosine, Levenshtein) without requiring coordinate-space centroids."
        ],
        costs: [
          "Prohibitive $\\mathcal{O}(N^2)$ memory and $\\mathcal{O}(N^2 \\log N)$ computational complexity limits application to modest dataset sizes.",
          "Greedy irreversibility: early suboptimal merge decisions cannot be corrected later in the tree construction.",
          "Dendrogram visualization becomes illegible and uninterpretable when sample sizes exceed a few hundred instances."
        ],
        avoid: [
          "Using standard agglomerative clustering on datasets with $N > 50,000$ samples without prior BIRCH or K-Means clustering.",
          "Using Single Linkage on noisy data without prior outlier filtering."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "principal-component-analysis",

      why: {
        before: "High-dimensional datasets suffered from extreme multicollinearity, storage bloat, " +
          "and computational explosion, while visual inspection was limited to 2D/3D scatter plots.",
        problem: "Discarding features manually loses critical information, while keeping all correlated features " +
          "inflates model variance and exacerbates the curse of dimensionality.",
        shift: "**Principal Component Analysis (Pearson 1901, Hotelling 1933): Orthogonal variance maximization.** " +
          "Project data onto an orthogonal basis aligned with the directions of maximal variance, " +
          "derived via the eigendecomposition of the covariance matrix or Singular Value Decomposition (SVD)."
      },

      num: {
        t: "PCA mathematical foundations, SVD equivalence & variance metrics",
        h: ["Step / Property", "Mathematical Formulation", "Computational Implementation", "Significance"],
        r: [
          ["**Covariance Matrix**", "$\\Sigma = \\frac{1}{N-1} X_c^T X_c$", "Requires centering data: $X_c = X - \\bar{X}$", "Quantifies all pairwise linear feature correlations"],
          ["**Eigendecomposition**", "$\\Sigma v_k = \\lambda_k v_k$", "Eigenvectors $v_k$ define principal axes; $\\lambda_k$ is variance", "Eigenvectors form an orthonormal basis: $v_i^T v_j = \\delta_{ij}$"],
          ["**Singular Value Decomp (SVD)**", "$X_c = U \\Sigma V^T$", "Standard implementation in Scikit-Learn / LAPACK", "Right singular vectors $V$ are the principal component loadings"],
          ["**Explained Variance Ratio**", "$\\text{EVR}_k = \\frac{\\lambda_k}{\\sum_{j=1}^p \\lambda_j} = \\frac{s_k^2}{\\sum s_j^2}$", "Determined via cumulative scree plot", "Quantifies the exact percentage of total information preserved"],
          ["**Data Reconstruction Error**", "$\\|X_c - X_k\\|_F^2 = \\sum_{j=k+1}^p \\lambda_j$", "Projection: $Z_k = X_c V_k$; Reconstruction: $\\hat{X} = Z_k V_k^T$", "**Eckart-Young Theorem**: PCA is the optimal rank-$k$ linear approximation"]
        ],
        n: "Principal Component Analysis (PCA) is the gold standard of " +
          "**unsupervised linear dimensionality reduction**. The algorithm seeks " +
          "a sequence of orthogonal unit vectors $v_1, v_2, \\dots, v_p$ such that the " +
          "projection of the centered data matrix onto $v_1$ has the maximum possible variance: " +
          "$\\max_{\\|v_1\\|=1} \\frac{1}{N} v_1^T X_c^T X_c v_1 = \\max v_1^T \\Sigma v_1$. " +
          "By the Rayleigh quotient and Lagrange multipliers, this vector is exactly " +
          "the eigenvector of the sample covariance matrix corresponding to the largest eigenvalue $\\lambda_1$. " +
          "Subsequent principal components maximize remaining variance subject to being strictly " +
          "orthogonal to all prior components ($v_i \\perp v_j$). Rather than computing the massive $p \\times p$ " +
          "covariance matrix directly, modern numerical software applies **Singular Value Decomposition (SVD)** " +
          "directly to the centered data: $X_c = U \\Sigma V^T$, where the singular values $s_i$ relate to eigenvalues " +
          "via $\\lambda_i = \\frac{s_i^2}{N-1}$. The cumulative explained variance ratio allows engineers " +
          "to select the minimum number of components $k$ required to retain a target threshold (e.g. 95%) " +
          "of total dataset variance."
      },

      miss: [
        {
          w: "PCA can be run directly on raw data without mean centering or scaling.",
          r: "Centering the data at the origin is mathematically required for covariance calculation. Furthermore, unscaled features with large numerical magnitudes will artificially dominate the first principal component regardless of their true information content."
        },
        {
          w: "PCA always selects the most predictive features for supervised classification.",
          r: "PCA is completely unsupervised: it maximizes total variance, not class separability. A high-variance feature may be pure noise, while the most predictive discriminatory feature might have low variance and be discarded."
        },
        {
          w: "Principal components correspond directly to individual original features.",
          r: "Each principal component is a linear combination (loading vector) across ALL original features. While PCA reduces dimensionality, it reduces direct semantic feature interpretability."
        },
        {
          w: "PCA can capture non-linear relationships like Swiss-roll manifolds.",
          r: "PCA is strictly a linear projection technique. Unfolding non-linear curved manifolds requires non-linear techniques like Kernel PCA, t-SNE, or UMAP."
        }
      ],

      trade: {
        buys: [
          "Optimal rank-$k$ linear compression: mathematically guarantees minimal reconstruction error under squared Frobenius norm.",
          "Complete multicollinearity elimination: transformed principal components are guaranteed to be mutually orthogonal (zero correlation).",
          "Dramatically reduces downstream training costs and storage footprints for high-dimensional models."
        ],
        costs: [
          "Loss of direct domain interpretability: original column names are replaced by abstract linear combinations of features.",
          "Blind to non-linear relationships: cannot unroll complex curved topological manifolds in feature space.",
          "Unsupervised variance bias: can inadvertently discard low-variance features that contain critical predictive signal for supervised tasks."
        ],
        avoid: [
          "Applying PCA without standardizing features (e.g. using `StandardScaler`) when columns have different units.",
          "Using PCA as a black-box feature selection tool before checking whether low-variance components hold class discriminative power."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "t-sne",

      why: {
        before: "Linear projections (PCA) forced high-dimensional data onto flat hyperplanes, " +
          "collapsing distant clusters on top of each other and failing to visualize complex non-linear manifolds.",
        problem: "Preserving global pairwise distances in 2D forces disparate points together " +
          "due to the volume expansion of high-dimensional spheres (the 'crowding problem').",
        shift: "**t-SNE (van der Maaten & Hinton 2008): Probabilistic local neighborhood preservation with Student-t kernels.** " +
          "Convert high-dimensional Euclidean distances into Gaussian probabilities, and map them into a low-dimensional " +
          "space using a heavy-tailed Student-t distribution to solve crowding and reveal local cluster structures."
      },

      num: {
        t: "t-SNE mathematical formulations, distributions & gradient mechanics",
        h: ["Component / Equation", "High-Dimensional Space ($P$)", "Low-Dimensional Map ($Q$)", "Mathematical Purpose"],
        r: [
          ["**Probability Kernel**", "Gaussian: $p_{j|i} = \\frac{\\exp(-\\|x_i - x_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\ne i} \\exp(-\\|x_i - x_k\\|^2 / 2\\sigma_i^2)}$", "**Student-t (1 DOF)**: $q_{ij} = \\frac{(1 + \\|y_i - y_j\\|^2)^{-1}}{\\sum_k \\sum_{l \\ne k} (1 + \\|y_k - y_l\\|^2)^{-1}}$", "Heavy tails of Student-t allow moderate distances in high dimensions to expand widely in 2D"],
          ["**Symmetric Probabilities**", "$p_{ij} = \\frac{p_{j|i} + p_{i|j}}{2N}$", "$q_{ij}$ is inherently symmetric", "Prevents isolated outlier points from having negligible gradient influence"],
          ["**Loss Function (Cost)**", "$KL(P \\parallel Q) = \\sum_{i \\ne j} p_{ij} \\log \\frac{p_{ij}}{q_{ij}}$", "Kullback-Leibler divergence", "Asymmetric penalty: heavily penalizes putting nearby points far apart"],
          ["**Gradient Formula**", "$\\frac{\\partial KL}{\\partial y_i} = 4 \\sum_j (p_{ij} - q_{ij})(y_i - y_j)(1 + \\|y_i - y_j\\|^2)^{-1}$", "Evaluated via Barnes-Hut or FFT", "Acts as a physical spring system: attractive forces pull neighbors, repulsive forces push non-neighbors"],
          ["**Perplexity Parameter**", "$\\text{Perp}(P_i) = 2^{H(P_i)}$ where $H$ is Shannon entropy", "Typically set between $5$ and $50$", "Determines the effective number of local neighbors considered for each point"]
        ],
        n: "t-Distributed Stochastic Neighbor Embedding (t-SNE) is the " +
          "premier technique for **visualizing high-dimensional datasets in 2D or 3D**. " +
          "The algorithm models neighborhoods probabilistically: in high-dimensional space, " +
          "the probability that point $x_i$ picks $x_j$ as its neighbor is proportional to a " +
          "Gaussian centered at $x_i$, with variance $\\sigma_i^2$ determined via binary search " +
          "to match a user-specified **Perplexity** ($2^{H(P_i)}$). In low-dimensional space, " +
          "probabilities $q_{ij}$ are modeled using a heavy-tailed **Cauchy / Student-t distribution** " +
          "with 1 degree of freedom: $q_{ij} \\propto (1 + \\|y_i - y_j\\|^2)^{-1}$. " +
          "The inverse-square decay of the Student-t distribution is the mathematical solution to the " +
          "**Crowding Problem**: because an $N$-dimensional sphere has infinitely more volume than a 2D circle, " +
          "preserving distances linearly crushes points together; the heavy tails allow moderately distant " +
          "points in high dimensions to be mapped much further apart in 2D without incurring severe KL penalties. " +
          "By minimizing the **Kullback-Leibler (KL) divergence** via gradient descent, t-SNE creates " +
          "striking visual maps that clearly separate distinct clusters, manifolds, and cell types."
      },

      miss: [
        {
          w: "The relative distances between distant clusters in a t-SNE plot represent true global distances.",
          r: "t-SNE strictly preserves local neighborhood topology; distances between widely separated clusters are arbitrary and meaningless. You cannot conclude cluster A is more related to B than C based on their 2D separation."
        },
        {
          w: "Cluster sizes and densities in a t-SNE plot reflect true cluster densities.",
          r: "t-SNE automatically adapts its bandwidth $\\sigma_i$ to maintain constant perplexity across points, naturally expanding dense clusters and compressing sparse ones. Visual cluster size does not indicate true data variance."
        },
        {
          w: "You can train a t-SNE model and use it to transform new incoming test data points.",
          r: "t-SNE is a non-parametric optimization over the coordinates of the specific dataset provided; it does not learn a functional mapping $f(x) \\to y$. Embedding a new sample requires re-running optimization from scratch."
        },
        {
          w: "Running t-SNE with a single perplexity value is sufficient to understand data structure.",
          r: "Perplexity controls the balance between local and global structure. Validating topological structures requires testing multiple perplexities (e.g., 5, 30, 100) to ensure clusters are not artifacts of optimization."
        }
      ],

      trade: {
        buys: [
          "Superlative visualization quality: separates complex, entangled, non-linear high-dimensional clusters with extraordinary visual clarity.",
          "Resolves the crowding problem via heavy-tailed Student-t kernel probability mapping.",
          "Captures both discrete cluster formations and continuous branching trajectories (e.g. in single-cell RNA sequencing)."
        ],
        costs: [
          "High computational complexity: standard Barnes-Hut t-SNE scales as $\\mathcal{O}(N \\log N)$, making runs on $N > 500,000$ sluggish without GPU-accelerated FIt-SNE.",
          "Cannot transform unseen test samples: no parameterized projection function is produced.",
          "Non-convex objective: sensitive to initialization and random seed; global cluster arrangement varies across runs."
        ],
        avoid: [
          "Using t-SNE as a feature extraction step for downstream regression or classification pipelines (use PCA or UMAP instead).",
          "Interpreting global inter-cluster Euclidean distances as true physical or semantic similarities."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
