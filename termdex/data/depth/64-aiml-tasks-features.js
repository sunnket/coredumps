/* ==========================================================================
   Depth pass 64 — AI/ML core batch 2: tasks & feature engineering.
   Classification, Regression, Clustering, Dimensionality Reduction,
   Anomaly Detection, Feature, Feature Engineering, Feature Selection.

   Features are the coordinates of reality in mathematical space; tasks
   define the geometry of optimization; selection separates signal from noise.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "classification",

      why: {
        before: "Categorizing entities (spam vs ham, benign vs malignant, fraud vs " +
          "legitimate) required handcrafting hundreds of nested Boolean if-else rules.",
        problem: "Human rule sets fail when classification boundaries depend on " +
          "complex, non-linear interactions across dozens of continuous features, " +
          "leading to severe rule conflicts, high false positives, and brittle maintenance.",
        shift: "**Classification: mapping feature vectors to discrete categorical labels.** " +
          "Optimize a decision boundary dividing high-dimensional feature space into " +
          "discrete decision regions, estimating conditional class probabilities $P(Y=k|X)$."
      },

      num: {
        t: "Classification task paradigms & decision boundary mechanics",
        h: ["Classification Type", "Target Space ($Y$)", "Output Activation", "Standard Loss Function"],
        r: [
          ["**Binary Classification**", "**Two discrete classes ($Y \\in \\{0, 1\\}$)**", "**Sigmoid ($\\sigma(z) = \\frac{1}{1 + e^{-z}}$)**", "**Binary Cross-Entropy (Log Loss)**"],
          ["**Multi-class Classification**", "**Single mutually exclusive class from $K$ categories**", "**Softmax ($\\frac{e^{z_i}}{\\sum e^{z_j}}$)**", "**Categorical Cross-Entropy**"],
          ["**Multi-label Classification**", "**Multiple non-exclusive binary tags per sample**", "**Independent Sigmoid per label**", "**Summed Binary Cross-Entropy**"],
          ["**Cost-Sensitive Classification**", "**Asymmetric real-world misclassification penalties**", "**Threshold-tuned probabilities**", "**Custom Cost Matrix / Focal Loss**"],
          ["**Imbalanced Classification**", "**Extreme class skew (e.g. 99.9% negative)**", "**Calibrated probabilities**", "**Focal Loss, Balanced Cross-Entropy**"]
        ],
        n: "Classification is the formal mathematical task of assigning an " +
          "input feature vector $\\mathbf{x} \\in \\mathbb{R}^d$ to one of " +
          "$K$ discrete classes $y \\in \\{1, \\dots, K\\}$. Modern classification " +
          "models operate by learning a **decision boundary** that partitions " +
          "feature space. The geometry of this boundary depends on the algorithm: " +
          "**Logistic Regression and Linear SVMs** construct linear hyperplanes " +
          "($\\mathbf{w}^T\\mathbf{x} + b = 0$); **Decision Trees** construct " +
          "orthogonal, axis-aligned rectangular bounding boxes; and **Deep " +
          "Neural Networks** warp space into complex, non-linear manifolds. " +
          "Crucially, modern classifiers rarely output hard categorical labels " +
          "directly; instead, they output **continuous probability estimates** " +
          "$P(Y=1|X)$. The conversion from continuous probability to a discrete " +
          "decision requires establishing a **decision threshold $\\tau$**. " +
          "While the textbook default threshold is $0.5$, production engineering " +
          "requires tuning $\\tau$ based on real-world business economics: in " +
          "fraud detection or cancer screening, a false negative is catastrophic " +
          "while a false positive is merely an inconvenience, dictating an " +
          "asymmetric threshold of $0.1$ or $0.05$ to maximize **Recall**."
      },

      miss: [
        {
          w: "Classification models output definitive binary decisions directly.",
          r: "Classifiers compute continuous probability scores $P(Y=1|X)$. Assigning " +
            "a discrete class requires explicitly choosing a decision threshold $\\tau$."
        },
        {
          w: "The optimal classification decision threshold is always 0.5.",
          r: "0.5 assumes equal costs for false positives and false negatives. In fraud, " +
            "medicine, and security, asymmetric real-world costs mandate tuning the threshold."
        },
        {
          w: "High classification accuracy proves that a model is successful.",
          r: "On a dataset with 99% negative cases (fraud, rare disease), a trivial model " +
            "predicting all negatives achieves 99% accuracy while catching zero positive cases."
        },
        {
          w: "Multi-class and multi-label classification are the same thing.",
          r: "Multi-class assigns exactly one mutually exclusive class (e.g. Dog OR Cat). " +
            "Multi-label assigns zero, one, or multiple overlapping tags (e.g. Article is Politics AND Finance)."
        }
      ],

      trade: {
        buys: [
          "Automates discrete categorical decision-making across complex multi-dimensional data.",
          "Outputs calibrated confidence probabilities supporting risk-adjusted business actions.",
          "Clear, standardized evaluation frameworks (ROC curves, PR curves, Confusion Matrices).",
          "Rich algorithmic tooling: from ultra-fast linear models to state-of-the-art gradient boosted trees."
        ],
        costs: [
          "Real-world misclassification penalties are frequently asymmetric and difficult to quantify.",
          "Vulnerable to severe class imbalance, requiring sampling techniques (SMOTE) or specialized loss functions.",
          "Raw model output probabilities often require post-hoc calibration (Platt scaling, Isotonic regression).",
          "Cannot handle unseen, out-of-vocabulary target categories without open-set architectures."
        ],
        avoid: [
          "Continuous numerical estimation (use regression instead).",
          "Ranking and recommendation problems where relative sorting order matters more than discrete class boundaries.",
          "Datasets with severe label noise where human annotators disagree on category definitions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "regression",

      why: {
        before: "Estimating continuous numerical values (asset prices, customer " +
          "lifetime value, hardware failure times) relied on static averages or simple " +
          "one-dimensional linear extrapolations.",
        problem: "Real-world numerical quantities are non-linear functions of " +
          "multiple interacting factors with noise, collinearity, and non-constant variance.",
        shift: "**Regression: modeling the conditional expectation of continuous targets.** " +
          "Learn a mathematical function $f: \\mathbb{R}^d \\to \\mathbb{R}$ that predicts " +
          "a continuous real-valued scalar target $Y$ from feature vectors $X$, minimizing prediction residuals."
      },

      num: {
        t: "Regression loss formulations & algorithmic properties",
        h: ["Regression Formulation", "Optimization Objective / Loss", "Residual Penalty", "Sensitivity to Outliers"],
        r: [
          ["**Ordinary Least Squares (OLS)**", "**Mean Squared Error (MSE)**", "**Quadratic ($r_i^2$)**", "**Extremely high (outliers dominate fit)**"],
          ["**Mean Absolute Error (L1)**", "**Median Regression / MAE**", "**Linear ($|r_i|$)**", "**Robust; estimates conditional median**"],
          ["**Huber Regression**", "**Piecewise quadratic-linear loss**", "**Quadratic for small error, linear for large**", "**Balanced robustness and smooth differentiability**"],
          ["**Ridge Regression (L2)**", "**MSE + $\\lambda \\sum w_j^2$**", "**Quadratic residuals + weight shrinkage**", "**Prevents multicollinearity and coefficient blowup**"],
          ["**Lasso Regression (L1)**", "**MSE + $\\lambda \\sum |w_j|$**", "**Quadratic residuals + sparse selection**", "**Drives uninformative weights to exactly zero**"],
          ["**Quantile Regression**", "**Pinball / Tilted Absolute Loss**", "**Asymmetric linear penalty**", "**Predicts arbitrary percentiles (e.g. p95 latency)**"]
        ],
        n: "Regression is the foundational machine learning task of estimating " +
          "a continuous numerical outcome $Y \\in \\mathbb{R}$. In classical " +
          "linear regression, the relationship is modeled as $Y = \\mathbf{w}^T\\mathbf{x} " +
          "+ b + \\epsilon$, where $\\epsilon \\sim \\mathcal{N}(0, \\sigma^2)$ " +
          "represents random Gaussian noise. Ordinary Least Squares (OLS) " +
          "computes the unique closed-form analytical solution via the normal " +
          "equation: $\\hat{\\mathbf{w}} = (\\mathbf{X}^T\\mathbf{X})^{-1}\\mathbf{X}^T\\mathbf{y}$. " +
          "By the celebrated **Gauss-Markov Theorem**, OLS is the Best Linear " +
          "Unbiased Estimator (BLUE) under the classical assumptions of strict " +
          "exogeneity, homoskedasticity (constant variance), and absence of " +
          "multicollinearity. However, because MSE squares the residual errors " +
          "($e_i^2$), **a single extreme outlier exerts massive leverage**, " +
          "pulling the regression hyperplane away from the true data distribution. " +
          "Modern applied regression overcomes these limitations through **regularization** " +
          "(Ridge, Lasso, ElasticNet), **robust loss functions** (Huber loss, " +
          "RANSAC), and **non-linear tree ensembles** (Gradient Boosted Trees), " +
          "which can model complex, non-linear physical response surfaces " +
          "without requiring manual feature transformations."
      },

      miss: [
        {
          w: "Regression can only model straight linear lines.",
          r: "Polynomial feature expansion, splines, kernel ridge regression, and gradient " +
            "boosted trees model arbitrary, highly complex non-linear mathematical surfaces."
        },
        {
          w: "A high $R^2$ score proves that the model identified the causal drivers.",
          r: "$R^2$ only measures statistical variance explained. Omitted variable bias " +
            "and spurious correlations easily yield high $R^2$ with zero true causal validity."
        },
        {
          w: "Outliers have minimal effect on linear regression models.",
          r: "Because Ordinary Least Squares squares the residuals, distant outliers exert " +
            "disproportionate leverage, radically tilting the fitted regression line."
        },
        {
          w: "Regression models cannot handle categorical input features.",
          r: "Categorical variables are seamlessly integrated into regression via one-hot " +
            "encoding, target encoding, or frequency encoding."
        }
      ],

      trade: {
        buys: [
          "Continuous numerical predictions with infinite precision and resolution.",
          "Highly interpretable linear models: coefficients directly quantify feature elasticity.",
          "Provides formal statistical confidence intervals and prediction intervals.",
          "Computationally efficient: closed-form normal equation or fast convex gradient descent."
        ],
        costs: [
          "Vulnerable to extreme outliers and heavy-tailed noise distributions under MSE loss.",
          "Can produce mathematically impossible predictions (e.g. negative prices, probabilities > 1).",
          "Linear models suffer severe variance instability under strong feature multicollinearity.",
          "Requires extensive residual diagnostics (checking homoskedasticity and normality)."
        ],
        avoid: [
          "Discrete categorical classification problems.",
          "Bounded probability estimation without a logistic link function (sigmoid).",
          "Heavily multi-modal target distributions where a single mean estimate is meaningless."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "clustering",

      why: {
        before: "Businesses segmented customers, products, and documents using " +
          "rigid, manually crafted demographic rules authored by marketing teams.",
        problem: "Manual business rules cannot discover non-obvious, multi-dimensional " +
          "behavioral cohorts across hundreds of transactional and behavioral features.",
        shift: "**Clustering: mathematical partitioning into cohesive, separated groups.** " +
          "Unsupervised algorithms partition unlabeled data points into clusters such " +
          "that items within the same cluster exhibit high mutual similarity, while " +
          "items in different clusters exhibit high dissimilarity."
      },

      num: {
        t: "Clustering algorithmic paradigms & geometric behaviors",
        h: ["Clustering Family", "Core Algorithm", "Geometric Cluster Assumption", "Handling of Arbitrary Shapes & Noise"],
        r: [
          ["**Centroid-Based**", "**K-Means / K-Means++**", "**Spherical, isotropic, equal-variance clusters**", "**Fails on non-convex shapes; sensitive to noise/outliers**"],
          ["**Density-Based**", "**DBSCAN / HDBSCAN**", "**Continuous high-density regions separated by low density**", "**Excels at arbitrary shapes; explicitly isolates noise points**"],
          ["**Hierarchical**", "**Agglomerative (Ward linkage)**", "**Nested tree hierarchy (dendrogram)**", "**Versatile; expensive $O(N^2)$ memory and compute**"],
          ["**Distribution-Based**", "**Gaussian Mixture Models (GMM)**", "**Elliptical clusters with soft probabilistic assignment**", "**Captures varying cluster variances; soft membership**"],
          ["**Graph-Based**", "**Spectral Clustering**", "**Graph connectivity and Laplacian eigenvectors**", "**Handles complex non-convex manifold geometries**"]
        ],
        n: "Clustering is the preeminent unsupervised learning task. The " +
          "most widely utilized clustering algorithm is **K-Means**, which " +
          "aims to minimize the **Within-Cluster Sum of Squares (WCSS)**, " +
          "also known as **inertia**: " +
          "$$J = \\sum_{k=1}^K \\sum_{\\mathbf{x} \\in C_k} \\|\\mathbf{x} - \\boldsymbol{\\mu}_k\\|^2$$ " +
          "where $\\boldsymbol{\\mu}_k$ is the centroid of cluster $C_k$. " +
          "K-Means optimizes this via **Lloyd's Algorithm**: alternating " +
          "between (1) assigning every data point to its nearest centroid, " +
          "and (2) recalculating centroids as the mean of assigned points. " +
          "Because K-Means measures pure Euclidean distance, it makes a " +
          "strict geometric assumption: **clusters are convex, spherical, " +
          "and similarly sized**. When confronted with complex real-world " +
          "geometries (e.g. intertwined spirals, rings, or varying densities), " +
          "K-Means fails completely. In such domains, **density-based clustering " +
          "(DBSCAN/HDBSCAN)** is superior: it defines clusters as continuous " +
          "spatial zones where the local density of points exceeds a threshold " +
          "($\\epsilon$ neighborhood containing at least `minPts`), automatically " +
          "discovering arbitrary geometric shapes while classifying sparse " +
          "outliers as **noise**."
      },

      miss: [
        {
          w: "K-Means can detect clusters of any arbitrary real-world shape.",
          r: "K-Means relies on Euclidean distance to centroids, forcing decision boundaries " +
            "to be linear Voronoi tessellations. It fails completely on non-convex or concentric shapes."
        },
        {
          w: "Clustering algorithms automatically deduce the true number of clusters.",
          r: "Algorithms like K-Means require pre-specifying $k$. Determining optimal $k$ " +
            "is an exploratory process evaluated via Silhouette scores, Davies-Bouldin indices, or elbow plots."
        },
        {
          w: "Feature scaling is optional before running clustering.",
          r: "Clustering algorithms depend entirely on spatial distance calculations. " +
            "An unscaled feature with large values will dominate the distance metric and dictate all clusters."
        },
        {
          w: "Every data point must belong to a cluster.",
          r: "Centroid methods force every point into a cluster, corrupting centers with outliers. " +
            "Density algorithms (DBSCAN) explicitly classify sparse points as unassigned noise."
        }
      ],

      trade: {
        buys: [
          "Discovers organic behavioral segments and latent patterns without human labeling.",
          "Reduces complex multi-million row datasets into representative cluster prototypes.",
          "Density-based algorithms isolate spatial outliers and anomalous noise points naturally.",
          "Serves as a powerful preprocessing step: cluster IDs can be used as categorical features."
        ],
        costs: [
          "Subjective evaluation: without ground-truth labels, cluster validity is open to interpretation.",
          "Extreme sensitivity to distance metrics, scaling, and hyperparameter selection ($k$, $\\epsilon$).",
          "High computational complexity: hierarchical and spectral algorithms scale $O(N^2)$ to $O(N^3)$.",
          "The Curse of Dimensionality: Euclidean distances concentrate and become meaningless in high dimensions."
        ],
        avoid: [
          "Datasets with unscaled, heterogeneous feature dimensions.",
          "High-dimensional raw text or image spaces without prior dimensionality reduction.",
          "Problems requiring strict, verifiable predictive ground truth."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dimensionality-reduction",

      why: {
        before: "Machine learning models were trained on raw, ultra-high-dimensional " +
          "feature spaces (thousands of gene expressions, term-frequency vectors, raw image pixels).",
        problem: "The Curse of Dimensionality: high-dimensional space is overwhelmingly " +
          "sparse, computational costs explode, distance metrics lose discriminative power, " +
          "and models suffer from severe overfitting.",
        shift: "**Project high-dimensional data onto compact, informative low-dimensional manifolds.** " +
          "Extract lower-dimensional representations that preserve maximum variance, " +
          "geometric topology, or semantic information while discarding noise and redundant collinearity."
      },

      num: {
        t: "Dimensionality reduction algorithms & mathematical mechanisms",
        h: ["Algorithm", "Type / Linearity", "Optimization Objective", "Primary Application"],
        r: [
          ["**PCA (Principal Component Analysis)**", "**Linear**", "**Maximize variance / Minimize reconstruction error**", "**Feature compression, multicollinearity removal**"],
          ["**t-SNE**", "**Non-linear**", "**Minimize KL-divergence of pairwise probability distributions**", "**High-dimensional cluster visualization (2D/3D)**"],
          ["**UMAP**", "**Non-linear**", "**Fuzzy simplicial set cross-entropy on Riemannian manifold**", "**Fast non-linear visualization and clustering preprocessing**"],
          ["**Linear Discriminant Analysis (LDA)**", "**Linear (Supervised)**", "**Maximize between-class variance relative to within-class**", "**Supervised class-separable projection**"],
          ["**Autoencoders**", "**Non-linear (Neural)**", "**Bottleneck layer reconstruction error (MSE)**", "**Complex non-linear compression, denoising, anomaly detection**"]
        ],
        n: "Dimensionality reduction techniques compress a feature space from " +
          "$D$ dimensions to $d$ dimensions ($d \\ll D$). The gold standard " +
          "linear technique is **Principal Component Analysis (PCA)**. PCA " +
          "computes the eigenvectors and eigenvalues of the empirical covariance " +
          "matrix $\\mathbf{\\Sigma} = \\frac{1}{N}\\mathbf{X}^T\\mathbf{X}$ " +
          "(via Singular Value Decomposition / SVD). The first principal component " +
          "aligns with the axis of maximum variance; subsequent components " +
          "are strictly orthogonal to all preceding components, capturing " +
          "successively decreasing variance. By retaining the top $k$ components " +
          "that explain 95% of cumulative variance, engineers compress data " +
          "while completely eliminating **multicollinearity**. However, linear " +
          "PCA cannot unroll non-linear structures (like the Swiss Roll manifold). " +
          "For non-linear relationships, **t-SNE (t-Distributed Stochastic " +
          "Neighbor Embedding)** and **UMAP (Uniform Manifold Approximation " +
          "and Projection)** model local neighborhood probabilities, mapping " +
          "high-dimensional data points onto 2D or 3D planes where visual " +
          "clusters reflect local topological proximity. UMAP has largely " +
          "superseded t-SNE due to superior execution speed and better " +
          "preservation of global data structure."
      },

      miss: [
        {
          w: "Dimensionality reduction is only useful for plotting 2D scatter plots.",
          r: "It is a foundational feature engineering technique that eliminates noise, " +
            "prevents overfitting, slashes storage and compute costs, and combats the curse of dimensionality."
        },
        {
          w: "PCA can capture complex non-linear curves and relationships.",
          r: "PCA is strictly a linear orthogonal transformation. Non-linear manifolds " +
            "require non-linear techniques like UMAP, t-SNE, Kernel PCA, or Autoencoders."
        },
        {
          w: "Distances between distant clusters in a t-SNE plot have physical meaning.",
          r: "t-SNE preserves local neighborhoods. Distances between distant clusters and " +
            "relative cluster sizes in t-SNE plots are arbitrary artifacts of perplexity settings."
        },
        {
          w: "Compressing dimensions always causes a drop in model accuracy.",
          r: "By eliminating noise, redundant collinear features, and uninformative dimensions, " +
            "dimensionality reduction frequently improves out-of-sample generalization accuracy."
        }
      ],

      trade: {
        buys: [
          "Eliminates multicollinearity, stabilizing linear model coefficients.",
          "Dramatically reduces memory, storage, and compute requirements for downstream models.",
          "Enables human 2D/3D visualization of complex embeddings and deep representations.",
          "Combats the curse of dimensionality, mitigating severe overfitting."
        ],
        costs: [
          "Loss of interpretability: transformed dimensions (e.g. PC1) are linear combinations of all features.",
          "Information loss: non-retained dimensions discard subtle variance signals.",
          "Non-linear methods (t-SNE, UMAP) are computationally intensive and non-parametric.",
          "Hyperparameter sensitivity (e.g. perplexity in t-SNE, n_neighbors in UMAP)."
        ],
        avoid: [
          "Applying t-SNE directly as an inductive feature transformer for live production inference.",
          "Compressing datasets that already have very few, highly interpretable domain features.",
          "Blindly discarding components without verifying cumulative explained variance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "anomaly-detection",

      why: {
        before: "Organizations detected security breaches, industrial machine failures, " +
          "and financial fraud using manual static threshold rules (`if memory > 95% then alert`).",
        problem: "Static thresholds trigger alert fatigue (thousands of false positives " +
          "during normal seasonal traffic surges) while completely missing multi-dimensional " +
          "anomalies where individual metrics appear normal but their combination is abnormal.",
        shift: "**Unsupervised modeling of baseline normality.** Model the statistical " +
          "distribution, geometric density, or reconstruction fidelity of normal system behavior, " +
          "flagging rare, out-of-distribution events without requiring labeled anomaly examples."
      },

      num: {
        t: "Anomaly detection algorithmic paradigms & operational mechanisms",
        h: ["Algorithm / Technique", "Underlying Principle", "Isolation Mechanism", "Primary Production Domain"],
        r: [
          ["**Isolation Forest**", "**Anomalies are few and structurally isolated**", "**Random recursive partitioning isolates anomalies in shallow tree depths**", "**Tabular fraud detection, server metric anomalies**"],
          ["**One-Class SVM**", "**Support vector boundary around normal data**", "**Maps normal data to high-dimensional feature space; isolates origin**", "**Novelty detection, high-dimensional sensor telemetry**"],
          ["**Local Outlier Factor (LOF)**", "**Local density comparison against neighbors**", "**Computes ratio of local density to $k$-nearest neighbors**", "**Spatial anomaly detection with varying cluster densities**"],
          ["**Autoencoder Reconstruction Error**", "**Neural compression trained exclusively on normal data**", "**Anomalous inputs cannot be reconstructed; high MSE error**", "**Industrial visual defect detection, acoustic telemetry**"],
          ["**Statistical / Mahalanobis Distance**", "**Multivariate Gaussian distance from mean**", "**Accounts for covariance structure across dimensions**", "**Low-dimensional financial risk auditing**"]
        ],
        n: "Anomaly Detection (also known as Outlier Detection or Novelty " +
          "Detection) addresses the challenge of identifying rare observations " +
          "that deviate substantially from baseline behavior. Anomalies fall " +
          "into three distinct classes: (1) **Point Anomalies**: an individual " +
          "data instance is anomalous relative to the rest of the dataset " +
          "(e.g. a $50,000 credit card transaction for a student); (2) " +
          "**Contextual Anomalies**: an observation is anomalous only in a " +
          "specific context (e.g. a temperature of 90°F in Antarctica, or " +
          "heavy CPU usage at 3:00 AM on a holiday); and (3) **Collective " +
          "Anomalies**: a collection of individual events that appear normal " +
          "in isolation but form an attack pattern when observed sequentially " +
          "(e.g. a micro-sequence of rapid authentication handshakes indicating " +
          "credential stuffing). The most celebrated modern tabular algorithm " +
          "is the **Isolation Forest**. Instead of modeling normal points " +
          "(which is computationally expensive), Isolation Forests exploit " +
          "two quantitative properties: **anomalous instances are few and " +
          "attribute-distinct**. When a dataset is recursively partitioned " +
          "by selecting a random feature and a random split value, anomalies " +
          "are isolated near the root of the tree with very short **average " +
          "path lengths $h(x)$**, enabling sub-linear, memory-efficient detection."
      },

      miss: [
        {
          w: "Anomaly detection is just standard binary classification.",
          r: "True anomalies are so rare (<0.01%) and unpredictable in nature that " +
            "labeled data is scarce or non-existent, requiring unsupervised density or isolation methods."
        },
        {
          w: "An anomaly is always a malicious attack or critical system failure.",
          r: "Outliers are frequently benign data collection glitches, sensor recalibrations, " +
            "or unexpected but legitimate viral surges in customer activity."
        },
        {
          w: "Anomaly detection models do not require maintenance once trained.",
          r: "Baseline 'normal' behavior drifts over time (seasonal shifts, organic business growth). " +
            "Models must be retrained continuously to avoid flagging normal modern behavior as anomalies."
        },
        {
          w: "Analyzing one metric at a time is sufficient for enterprise anomaly detection.",
          r: "The most dangerous anomalies are multi-dimensional: every single feature " +
            "sits comfortably within normal 1D ranges, but their joint multi-dimensional correlation is impossible."
        }
      ],

      trade: {
        buys: [
          "Identifies zero-day cyber attacks and unknown hardware failure modes without prior signatures.",
          "Operates effectively on massive unlabeled datasets without expensive human annotation.",
          "Dramatically reduces alert fatigue by accounting for multivariate correlations.",
          "Linear time complexity and low memory footprint in algorithms like Isolation Forest."
        ],
        costs: [
          "Inherent false positive rate: high-probability alerts still require human investigator triage.",
          "Contaminated training data: historical undetected anomalies in the training set corrupt the baseline.",
          "Subjective threshold tuning: choosing the anomaly contamination rate $\\nu$ dictates alert volume.",
          "Difficulty diagnosing root causes: black-box neural autoencoders flag errors without explanation."
        ],
        avoid: [
          "Problems where abundant, balanced labeled examples of all failure types exist (use supervised learning).",
          "Environments where baseline behavior is completely non-stationary and chaotic.",
          "Fully automated blocking systems where false positives incur severe legal or financial liabilities."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "feature",

      why: {
        before: "Early computing systems processed raw domain artifacts (unstructured " +
          "log strings, raw audio waveforms, database rows) as monolithic, unparsed blobs.",
        problem: "Mathematical optimization algorithms cannot operate on abstract " +
          "real-world entities; they require structured, measurable numerical coordinates.",
        shift: "**The Feature: an individual measurable property or characteristic.** " +
          "Decompose complex real-world observations into structured numerical and " +
          "categorical dimensions, assembling them into a mathematical feature vector $\\mathbf{x} \\in \\mathbb{R}^d$."
      },

      num: {
        t: "Feature data types & mathematical representations in Machine Learning",
        h: ["Feature Modality", "Data Representation", "Mathematical Domain", "Standard Preprocessing Requirement"],
        r: [
          ["**Continuous Numerical**", "**Floating-point scalars (e.g. salary, temperature)**", "$\\mathbb{R}$", "**StandardScaler (Z-score) / MinMaxScaler**"],
          ["**Discrete Numerical**", "**Integer counts (e.g. page visits, age in years)**", "$\\mathbb{N}_0$", "**Log transformation / Binning / Scaling**"],
          ["**Nominal Categorical**", "**Unordered discrete categories (e.g. country, color)**", "Finite set $\\mathcal{S}$", "**One-Hot Encoding / Target Encoding / Embeddings**"],
          ["**Ordinal Categorical**", "**Ordered categories (e.g. low, medium, high)**", "Ordered set $\\mathcal{O}$", "**Ordinal Integer Encoding ($0, 1, 2$)**"],
          ["**Dense Semantic Vector**", "**High-dimensional embedding (e.g. text/image vectors)**", "$\\mathbb{R}^{768}$ to $\\mathbb{R}^{4096}$", "**L2 Normalization / Cosine similarity alignment**"],
          ["**Cyclical Temporal**", "**Repeating time cycles (e.g. hour of day, month)**", "$[0, 2\\pi)$ radians", "**$\\sin(2\\pi t / T)$ and $\\cos(2\\pi t / T)$ encoding**"]
        ],
        n: "A Feature is the foundational atom of machine learning. In the " +
          "formal language of mathematical statistics, an observation is an " +
          "instance $\\mathbf{x} = [x_1, x_2, \\dots, x_d]^T$ residing in a " +
          "$d$-dimensional **Feature Space** $\\mathcal{X} \\subseteq \\mathbb{R}^d$. " +
          "Each feature represents a specific dimension of that space. Machine " +
          "learning algorithms differ fundamentally in how they perceive " +
          "feature geometries: **Linear Models and Support Vector Machines** " +
          "treat features as coordinates in metric space, making them highly " +
          "sensitive to feature scale (a feature measured in dollars with " +
          "values in millions will dominate a feature measured in years with " +
          "values under 100). **Tree-Based Models (Random Forest, XGBoost)** " +
          "evaluate features via individual threshold splits ($x_j \\le \\theta$), " +
          "making them completely invariant to monotonic transformations and " +
          "scale. The quality of a feature is governed by its **predictive " +
          "power**: the degree of mutual information or statistical dependence " +
          "it shares with the target variable $Y$, conditioned on all other " +
          "features in the vector."
      },

      miss: [
        {
          w: "Adding more features into an ML model is always beneficial.",
          r: "Adding uninformative, redundant, or noisy features triggers the Curse of " +
            "Dimensionality, increases model variance, slows inference, and causes severe overfitting."
        },
        {
          w: "Features can be fed directly to any model without transformation.",
          r: "Linear models and neural networks fail on raw features: they require scaling, " +
            "encoding of categoricals, handling of missing values, and clipping of extreme outliers."
        },
        {
          w: "Deep learning completely eliminates the concept of features.",
          r: "Deep learning automates representation learning from raw pixels or tokens, " +
            "but the resulting hidden layer activations are dense mathematical features."
        },
        {
          w: "Feature values have intrinsic meaning independent of their physical units.",
          r: "Algorithms treat feature values purely as geometric distance coordinates; " +
            "measuring distance in kilometers versus millimeters will radically warp linear model weights."
        }
      ],

      trade: {
        buys: [
          "Standardizes messy real-world phenomena into clean, structured mathematical vectors.",
          "Allows human domain experts to inject specialized institutional knowledge into models.",
          "Decouples data collection infrastructure from downstream learning algorithms.",
          "Enables granular feature importance analysis and model explainability."
        ],
        costs: [
          "Feature store and data pipeline infrastructure introduces heavy operational maintenance.",
          "Garbage in, garbage out: poorly engineered features cap the performance ceiling of any model.",
          "Storage and memory bloat when scaling to thousands of wide feature columns.",
          "Vulnerability to training-serving skew if feature logic differs between offline and online systems."
        ],
        avoid: [
          "Including features that leak future information unavailable during live inference.",
          "Retaining zero-variance features that provide zero mathematical signal.",
          "Feeding unnormalized features to distance-based or gradient-optimized models."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "feature-engineering",

      why: {
        before: "Engineers fed raw database columns directly into learning algorithms " +
          "(e.g. raw timestamp strings, raw street addresses, raw transaction amounts).",
        problem: "Raw data rarely exposes the underlying physical, behavioral, or " +
          "non-linear relationships directly. A model cannot easily deduce that a " +
          "transaction occurred at 3:00 AM on Sunday from a raw ISO timestamp string.",
        shift: "**Feature Engineering: synthesize informative predictive representations.** " +
          "Transform raw data using domain expertise into mathematical signals that " +
          "expose non-linearities, interactions, cyclicities, and aggregates directly to the model."
      },

      num: {
        t: "Essential feature engineering techniques & transformations",
        h: ["Engineering Technique", "Mathematical / Logical Operation", "Input Example", "Engineered Output"],
        r: [
          ["**Cyclical Encoding**", "**$\\sin(2\\pi t / T)$ & $\\cos(2\\pi t / T)$ mapping**", "`hour = 23` and `hour = 0`", "**Coordinates on circle where 23 and 0 are close neighbors**"],
          ["**Interaction Terms**", "**Multiplication, ratios, polynomial features**", "`debt`, `income`", "`debt_to_income_ratio = debt / income`"],
          ["**Rolling Aggregations**", "**Windowed statistical moments (mean, std, max)**", "**Stream of daily transaction amounts**", "**7-day rolling average, 30-day volatility**"],
          ["**Target Encoding**", "**Replace categorical with smoothed target mean**", "`city = 'Zurich'`", "**Historical default probability for Zurich (with smoothing)**"],
          ["**Log / Box-Cox Transform**", "**$y = \\log(x + 1)$ variance stabilization**", "**Extreme right-skewed revenue distribution**", "**Bell-shaped Gaussian-like distribution**"],
          ["**Frequency Encoding**", "**Replace category with its occurrence count**", "`browser = 'Chrome'`", "**Percentage frequency of Chrome across dataset**"]
        ],
        n: "Applied machine learning pioneer Andrew Ng famously stated: " +
          "*'Coming up with features is difficult, time-consuming, requires " +
          "expert knowledge. Applied machine learning is basically feature " +
          "engineering.'* While deep learning automates representation learning " +
          "for unstructured perceptual data (images, audio, text), feature " +
          "engineering remains the **decisive competitive advantage in tabular " +
          "enterprise data** (financial transactions, healthcare records, " +
          "e-commerce logs). Feature engineering bridges domain knowledge " +
          "and mathematical optimization. For example, a raw timestamp like " +
          "`2026-10-12 03:15:00` contains hidden signals: is it a weekend? " +
          "is it after midnight? is it a national holiday? Furthermore, linear " +
          "numerical scales break on cyclical time: on a 0–23 scale, hour 23 " +
          "and hour 0 are separated by a distance of 23 units despite being " +
          "adjacent! Mapping time onto a 2D trigonometric circle via $\\sin(2\\pi t / 24)$ " +
          "and $\\cos(2\\pi t / 24)$ restores continuous geometric proximity. " +
          "Crucially, all feature engineering pipelines must be fitted strictly " +
          "on the **training split** and applied identically to validation and " +
          "production data to prevent **Data Leakage** and **Training-Serving Skew**."
      },

      miss: [
        {
          w: "Deep learning has made feature engineering completely obsolete.",
          r: "For tabular enterprise data—representing the vast majority of commercial " +
            "applications—feature engineering combined with Gradient Boosted Trees consistently outperforms deep learning."
        },
        {
          w: "Feature engineering can be calculated on the entire dataset before train/test splitting.",
          r: "Calculating target encodings, scalers, or aggregations on the entire dataset causes " +
            "catastrophic **Data Leakage**, artificially inflating test scores while failing in production."
        },
        {
          w: "Creating hundreds of automated polynomial interaction features is good engineering.",
          r: "Mindless automated feature expansion causes massive multicollinearity, severe " +
            "overfitting, and the curse of dimensionality. High-value features come from domain expertise."
        },
        {
          w: "Feature engineering only involves mathematical transformations.",
          r: "The most impactful features come from deep institutional domain knowledge, " +
            "such as debt-to-income ratios in underwriting or velocity checks in payment fraud."
        }
      ],

      trade: {
        buys: [
          "Dramatically boosts model predictive performance without changing underlying algorithms.",
          "Enables lightweight, interpretable models (Logistic Regression, shallow trees) to capture complex non-linearities.",
          "Directly embeds domain expertise and physical laws into the mathematical representation.",
          "Reduces required model complexity and compute overhead during live inference."
        ],
        costs: [
          "Labor-intensive: requires extensive exploratory data analysis and domain research.",
          "Risk of Data Leakage during feature generation if split boundaries are breached.",
          "Feature pipeline maintenance: online production inference must replicate offline logic with zero drift.",
          "Feature store infrastructure overhead (Feast, Hopsworks, Tecton) required at scale."
        ],
        avoid: [
          "Using future information not accessible at inference time (data leakage).",
          "Generating thousands of arbitrary polynomial features without feature selection.",
          "Discrepancies between training SQL queries and live inference API feature extractors."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "feature-selection",

      why: {
        before: "Engineers dumped every available raw and engineered feature into " +
          "the model, training algorithms on hundreds or thousands of columns.",
        problem: "Irrelevant, noisy, and redundant collinear features degrade model " +
          "accuracy, cause severe overfitting, bloat training and inference latency, " +
          "and destroy model interpretability.",
        shift: "**Feature Selection: identify the minimal optimal predictive subset.** " +
          "Systematically evaluate, rank, and retain only the most informative, non-redundant " +
          "features while discarding noise and uninformative dimensions."
      },

      num: {
        t: "Feature selection methodologies & algorithmic families",
        h: ["Selection Paradigm", "Evaluation Strategy", "Core Algorithms / Metrics", "Computational Complexity"],
        r: [
          ["**Filter Methods**", "**Statistical properties independent of model training**", "**Pearson correlation, Mutual Information, Chi-Square ($\\chi^2$), ANOVA F-test**", "**Fast ($O(d)$); evaluates features in isolation**"],
          ["**Wrapper Methods**", "**Treats model as a black box; evaluates feature subsets**", "**Recursive Feature Elimination (RFE), Sequential Forward/Backward Selection**", "**Very slow ($O(d^2)$ model trainings); captures interactions**"],
          ["**Embedded Methods**", "**Selection occurs naturally during model training**", "**Lasso L1 Regularization, Tree Impurity Gain, ElasticNet**", "**Efficient; tied directly to model objective**"],
          ["**Permutation Importance**", "**Measures drop in test metric when feature is shuffled**", "**Model-agnostic permutation testing**", "**Reliable; breaks relationship between feature and target**"],
          ["**Collinearity Pruning**", "**Detects linear redundancy between features**", "**Variance Inflation Factor (VIF > 5), correlation heatmaps**", "**Fast; stabilizes regression coefficients**"]
        ],
        n: "Feature Selection is the strategic process of pruning non-informative " +
          "dimensions to produce a leaner, more robust model. Feature selection " +
          "methods are divided into three primary categories: (1) **Filter " +
          "Methods**: evaluate statistical correlation or **Mutual Information** " +
          "between individual features and the target variable prior to model " +
          "training. While extremely fast ($O(d)$), filter methods evaluate " +
          "features in isolation and miss non-linear feature interactions. " +
          "(2) **Wrapper Methods**: search the combinatorial space of feature " +
          "subsets using the model itself as the evaluator. In **Recursive " +
          "Feature Elimination (RFE)**, the model is trained on all features, " +
          "the least important features are pruned, and the process repeats " +
          "iteratively until the optimal subset is found. (3) **Embedded " +
          "Methods**: perform feature selection inherently during the training " +
          "optimization. **Lasso (L1) Regularization** adds a penalty proportional " +
          "to the absolute value of weights ($\\lambda \\sum |w_j|$), driving " +
          "the coefficients of uninformative features to **exactly zero**, " +
          "effectively deleting them from the model. A critical operational " +
          "caution is **impurity-based tree feature importance** (MDI in " +
          "scikit-learn): it is notoriously biased toward high-cardinality " +
          "continuous features; production audits mandate using **Permutation " +
          "Feature Importance** on held-out validation data."
      },

      miss: [
        {
          w: "Feature selection is identical to dimensionality reduction.",
          r: "Feature selection retains a subset of original features, preserving full " +
            "interpretability. Dimensionality reduction (PCA) constructs new synthetic dimensions."
        },
        {
          w: "Filter methods based on Pearson correlation catch all important features.",
          r: "Pearson correlation only detects linear relationships. A feature with a perfect " +
            "quadratic relationship ($y = x^2$) has zero linear correlation with $y$."
        },
        {
          w: "Default Gini feature importance from Random Forests is always trustworthy.",
          r: "Gini impurity importance is heavily biased toward high-cardinality numerical noise. " +
            "Permutation importance on held-out validation data is significantly more reliable."
        },
        {
          w: "Feature selection can be performed once on the full dataset before cross-validation.",
          r: "Selecting features using the entire dataset leaks target information from validation folds, " +
            "yielding falsely optimistic cross-validation scores that collapse in production."
        }
      ],

      trade: {
        buys: [
          "Improves generalization by removing uninformative noise features that cause overfitting.",
          "Dramatically reduces model training time, memory consumption, and real-time inference latency.",
          "Enhances model explainability, regulatory transparency, and stakeholder trust.",
          "Lowers operational costs by reducing the volume of data that must be collected and stored."
        ],
        costs: [
          "Risk of inadvertently discarding features that are weak individually but powerful in non-linear combinations.",
          "Wrapper methods (RFE) are computationally expensive, requiring hundreds of model retraining runs.",
          "Requires strict integration inside cross-validation pipelines to prevent data leakage.",
          "Feature importance rankings can be unstable in the presence of strong multicollinearity."
        ],
        avoid: [
          "Selecting features before splitting into train/test sets (data leakage).",
          "Discarding features based purely on univariate linear correlation without checking non-linear interactions.",
          "Relying uncritically on default Gini impurity importance without permutation verification."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
