/* ==========================================================================
   Depth pass 72 — AI/ML core batch 10: manifold projection, interpretability & systems.
   UMAP, Curse of Dimensionality, Interpretability, Feature Importance,
   AutoML, Recommendation System, Collaborative Filtering, Time Series Forecasting.

   Manifold topology projects high-dimensional geometric data; game-theoretic
   attributions explain black-box models; collaborative matrices and temporal
   lags power production recommendation and forecasting pipelines.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "umap",

      why: {
        before: "t-SNE provided visually compelling 2D cluster visualizations but was computationally slow, " +
          "destroyed global distance relationships between distant clusters, and could not transform unseen test points.",
        problem: "Large single-cell, NLP, and computer vision datasets with millions of samples take hours to process in t-SNE, " +
          "and machine learning pipelines cannot embed new incoming query vectors without recomputing the entire projection from scratch.",
        shift: "**UMAP (Uniform Manifold Approximation and Projection, McInnes 2018): Riemannian geometry & fuzzy simplicial sets.** " +
          "Model the data as a Riemannian manifold with local metric spaces, construct fuzzy simplicial complexes, " +
          "and optimize low-dimensional coordinates via binary cross-entropy, preserving global structure while enabling fast inference projection."
      },

      num: {
        t: "UMAP vs t-SNE algorithmic comparison & performance metrics",
        h: ["Dimension / Feature", "t-SNE (Barnes-Hut / FIt-SNE)", "UMAP (Uniform Manifold Approx)"],
        r: [
          ["**Theoretical Foundation**", "Probabilistic neighbor matching (Gaussian / Student-t)", "**Riemannian geometry, algebraic topology & fuzzy sets**"],
          ["**Objective Function**", "Kullback-Leibler (KL) divergence: $\\sum p_{ij} \\log \\frac{p_{ij}}{q_{ij}}$", "**Fuzzy Set Cross-Entropy**: $\\sum \\left[ \\mu_{ij} \\log\\frac{\\mu_{ij}}{\\nu_{ij}} + (1-\\mu_{ij})\\log\\frac{1-\\mu_{ij}}{1-\\nu_{ij}} \\right]$"],
          ["**Global Structure Retention**", "**Poor**: inter-cluster distances are essentially arbitrary", "**Superior**: cross-entropy preserves macro-distances and trajectories"],
          ["**Computational Complexity**", "$\\mathcal{O}(N \\log N)$ with high constant factors", "$\\mathcal{O}(N \\log N)$ using Nearest-Neighbor Descent (approx 5-10x faster)"],
          ["**Out-Of-Sample Projection**", "**Impossible**: requires re-optimizing all data points", "**Native support**: `umap.transform(X_new)` projects unseen vectors"]
        ],
        n: "UMAP grounds non-linear dimensionality reduction in rigorous " +
          "**topological data analysis (TDA)**. It operates under three theoretical " +
          "assumptions: (1) data lies on a local Riemannian manifold, (2) the Riemannian " +
          "metric is locally constant, and (3) the manifold is locally connected. " +
          "By defining a local metric for each data point based on its distance to its " +
          "$k$-th nearest neighbor, UMAP constructs **fuzzy simplicial sets** where edge " +
          "weights $\\mu_{ij} = \\exp(-\\max(0, d(x_i, x_j) - \\rho_i) / \\sigma_i)$ represent " +
          "the probability that a simplex exists between points. Crucially, while t-SNE optimizes " +
          "KL divergence (which only penalizes putting nearby points far apart, ignoring distant points), " +
          "UMAP minimizes **fuzzy set cross-entropy**. The second term $(1 - \\mu_{ij}) \\log(1 / (1 - \\nu_{ij}))$ " +
          "acts as an explicit repulsive force across all non-connected point pairs, preserving " +
          "macro-level **global structure and topological continuity**. Furthermore, because UMAP " +
          "learns an approximate coordinate mapping across the simplicial complex, it natively " +
          "supports a `transform()` method to project new, unseen inference vectors into the existing space."
      },

      miss: [
        {
          w: "UMAP is just a faster reimplementation of t-SNE.",
          r: "UMAP is derived from completely distinct algebraic topology foundations and optimizes fuzzy set cross-entropy rather than KL divergence, enabling global structure preservation and native out-of-sample projection."
        },
        {
          w: "UMAP preserves exact metric Euclidean distances between distant points.",
          r: "UMAP preserves topological connectivity and neighborhood graphs, not metric distances. While global inter-cluster relationships are substantially more reliable than t-SNE, distances should not be interpreted as linear metrics."
        },
        {
          w: "UMAP can only project data into 2D or 3D for visualization.",
          r: "Setting `n_components` to 10, 50, or 100 makes UMAP a world-class non-linear feature extractor for downstream gradient boosting or clustering models (such as HDBSCAN)."
        },
        {
          w: "UMAP is strictly unsupervised.",
          r: "UMAP natively supports Supervised and Semi-Supervised dimension reduction by incorporating target labels $y$ into the fuzzy simplicial set intersection, driving class separation."
        }
      ],

      trade: {
        buys: [
          "Preserves both fine-grained local neighborhoods and overarching global manifold topology.",
          "Orders of magnitude faster than t-SNE, scaling smoothly to millions of data points via Nearest Neighbor Descent.",
          "Enables projecting unseen test data vectors onto previously computed manifold embeddings via `transform()`."
        ],
        costs: [
          "Hyperparameter sensitivity: `n_neighbors` and `min_dist` significantly alter cluster tightness and topological continuity.",
          "Stochastic optimization: relies on stochastic gradient descent; results can vary without fixed random seeding.",
          "High memory overhead when building large nearest-neighbor descent graphs on very wide feature vectors ($p > 10,000$)."
        ],
        avoid: [
          "Interpreting empty white space between UMAP clusters as a literal metric distance.",
          "Running UMAP on high-dimensional text vectors without reducing dimensions to 50 via PCA or TruncatedSVD first."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "curse-of-dimensionality",

      why: {
        before: "Engineers assumed that collecting more features (hundreds or thousands of variables) " +
          "would strictly increase the information available to machine learning models, improving accuracy.",
        problem: "As the number of dimensions $p$ increases, the volume of feature space grows exponentially, " +
          "causing data points to become infinitely sparse, distance metrics to lose discriminative power, and models to overfit.",
        shift: "**Curse of Dimensionality (Bellman 1957): Exponential volume explosion and distance concentration.** " +
          "In high-dimensional spaces, the ratio between the distance to the nearest and farthest neighbor approaches zero, " +
          "rendering geometric algorithms (KNN, K-Means, RBF kernels) indistinguishable from random noise without dimensionality reduction."
      },

      num: {
        t: "Curse of dimensionality mathematical phenomena & scaling effects",
        h: ["Phenomenon / Property", "Mathematical Formulation", "Low Dimension ($p=2$)", "High Dimension ($p=1000$)"],
        r: [
          ["**Hypercube Volume ($[-1, 1]^p$)**", "$V_p = 2^p$", "$V_2 = 4$", "$V_{1000} \\approx 1.07 \\times 10^{301}$ (empty space)"],
          ["**Hypersphere Volume Ratio**", "$\\frac{\\text{Vol}(\\text{Sphere})}{\\text{Vol}(\\text{Cube})} = \\frac{\\pi^{p/2}}{2^p \\Gamma(p/2 + 1)} \\to 0$", "$\\approx 78.5\\%$ of volume in sphere", "$\\approx 0.000\\%$ (all volume concentrates in **corners**)"],
          ["**Hypersphere Shell Concentration**", "$\\frac{\\text{Vol}(r) - \\text{Vol}(r-\\epsilon)}{\\text{Vol}(r)} = 1 - (1-\\epsilon/r)^p \\to 1$", "Mass evenly spread across sphere", "**$100\\%$ of data mass lies in razor-thin outer skin**"],
          ["**Distance Concentration (Beyer 1999)**", "$\\lim_{p \\to \\infty} \\frac{\\text{dist}_{\\max} - \\text{dist}_{\\min}}{\\text{dist}_{\\min}} = 0$", "Nearest neighbor is significantly closer than farthest", "**All points become virtually equidistant**"],
          ["**Required Samples for Density**", "$N \\propto k^p$ (where $k$ is bins per axis)", "$10^2 = 100$ samples", "$10^{1000}$ samples (exceeds atoms in the universe)"]
        ],
        n: "Richard Bellman coined the term **'Curse of Dimensionality'** in 1957 " +
          "to describe the exponential barrier encountered in dynamic programming and optimization. " +
          "In machine learning, the curse manifests through three catastrophic geometric phenomena: " +
          "First, **Extreme Sparsity**: to maintain the same density of data points as dimension $p$ grows, " +
          "the required sample size $N$ must grow exponentially ($N \\propto e^p$). Without astronomical " +
          "sample sizes, high-dimensional space is essentially empty. " +
          "Second, **Volume Concentration in Corners**: as $p \\to \\infty$, the volume of an inscribed " +
          "hypersphere relative to its bounding hypercube approaches zero, meaning nearly all data points " +
          "concentrate in the extreme corners of the bounding box. " +
          "Third, **Distance Concentration**: Kevin Beyer et al. (1999) proved that under mild " +
          "conditions, the variance of Euclidean distances between random vectors grows as $\\mathcal{O}(\\sqrt{p})$ " +
          "while the mean distance grows as $\\mathcal{O}(\\sqrt{p})$, causing the relative difference between " +
          "the nearest neighbor and farthest neighbor to converge to zero: " +
          "$\\frac{d_{\\max} - d_{\\min}}{d_{\\min}} \\to 0$. In 1,000 dimensions, every data point is " +
          "nearly the exact same distance from every other point!"
      },

      miss: [
        {
          w: "Adding more features to a model will never degrade its performance if the features are uninformative.",
          r: "Noisy, uninformative features expand the dimensionality of the space, diluting the geometric signal of predictive features and dramatically increasing the variance of distance-based and linear estimators."
        },
        {
          w: "Deep neural networks are completely immune to the curse of dimensionality.",
          r: "Neural networks combat the curse through strong inductive biases (convolutional weight sharing, attention mechanisms) and the 'Manifold Hypothesis' (real data occupies a low-dimensional sub-manifold), but unconstrained MLPs still suffer."
        },
        {
          w: "The curse of dimensionality only affects Euclidean distance metrics.",
          r: "While Euclidean distance degrades rapidly ($L_2$), Manhattan distance ($L_1$) and fractional $L_k$ norms suffer similarly; cosine similarity also exhibits angular concentration in high-dimensional Gaussian spaces."
        },
        {
          w: "The best solution to the curse of dimensionality is always gathering more training data.",
          r: "Because required sample size scales exponentially with feature count ($N \\propto k^p$), gathering enough data to populate a 500-dimensional space is physically impossible. Dimensionality reduction or feature selection is mathematically mandatory."
        }
      ],

      trade: {
        buys: [
          "Understanding the curse prevents catastrophic over-engineering of hundreds of low-signal engineered columns.",
          "Guides proper feature selection, regularization (L1 Lasso), and projection strategies (PCA, UMAP, Autoencoders).",
          "Explains why specialized high-dimensional vector search indices (HNSW, ScaNN) are necessary in modern RAG systems."
        ],
        costs: [
          "Forces teams to invest in dimensionality reduction pipelines, which introduce compression loss and projection latency.",
          "Dimensionality reduction techniques often destroy direct semantic column interpretability.",
          "Requires strict vigilance against data leakage during dimension reduction preprocessing."
        ],
        avoid: [
          "Running standard KNN or K-Means directly on raw 10,000-dimensional TF-IDF vectors without SVD or cosine normalization.",
          "Adding dozens of noisy polynomial interaction features without L1 regularization or feature importance filtering."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "interpretability",

      why: {
        before: "Machine learning engineering treated complex models as black boxes, " +
          "evaluating systems solely on aggregate test set accuracy or AUC.",
        problem: "In high-stakes domains (healthcare, criminal justice, credit underwriting), black-box models " +
          "silently learn spurious correlations, perpetuate systemic societal bias, and violate legal mandates (e.g. GDPR Article 22 Right to Explanation).",
        shift: "**Model Interpretability: Intrinsic transparency and post-hoc model-agnostic explainability.** " +
          "Employ glass-box models (GAMs, Decision Trees) or model-agnostic local/global attribution frameworks " +
          "(SHAP Shapley values, LIME local surrogates) to mathematically explain why a prediction was made."
      },

      num: {
        t: "Interpretability taxonomy & explainability framework comparison",
        h: ["Method / Approach", "Scope (Local vs Global)", "Model-Agnostic?", "Theoretical Grounding & Fidelity"],
        r: [
          ["**Generalized Additive Models (EBM)**", "**Both**: Global feature shapes & local additivity", "No (Intrinsic glass-box)", "**Exact**: $g(E[y]) = \\sum f_i(x_i) + \\sum f_{ij}(x_i, x_j)$; zero approximation error"],
          ["**SHAP (Shapley Additive exPlanations)**", "**Both**: Local attributions sum to prediction; global beeswarm", "**Yes** (and TreeSHAP fast path)", "**Axiomatically unique**: the only method satisfying Efficiency, Symmetry, Dummy & Additivity"],
          ["**LIME (Local Interpretable Model-agnostic)**", "**Local**: explains individual prediction", "**Yes**", "Trains sparse linear surrogate on perturbed local samples; can be unstable across random seeds"],
          ["**Permutation Feature Importance**", "**Global**: dataset-level importance", "**Yes**", "Measures drop in test metric when feature is shuffled; biased by correlated features"],
          ["**Integrated Gradients**", "**Local**: deep neural network attributions", "No (Requires gradient access)", "Integrates path gradients from neutral baseline: $\\int_0^1 \\frac{\\partial F(x' + \\alpha(x-x'))}{\\partial x_i} d\\alpha$"]
        ],
        n: "Model interpretability is divided into two primary paradigms: " +
          "**Intrinsic Interpretability** (models that are naturally transparent, such as " +
          "linear models, shallow decision trees, and Explainable Boosting Machines / EBMs) " +
          "and **Post-Hoc Explainability** (techniques applied to arbitrary black-box models after training). " +
          "At the individual prediction level, **Local Interpretability** answers: *'Why did the model " +
          "deny loan applicant #4092?'* At the system level, **Global Interpretability** answers: " +
          "*'What general decision rules does the model apply across the entire population?'* " +
          "The modern gold standard of model explainability is **SHAP (Shapley Additive exPlanations)**, " +
          "which adapts Lloyd Shapley's Nobel-prize winning cooperative game theory formulation. " +
          "SHAP defines a feature's attribution as its marginal contribution averaged over all " +
          "possible feature coalitions: $\\phi_i = \\sum_{S \\subseteq F \\setminus \\{i\\}} " +
          "\\frac{|S|!(|F|-|S|-1)!}{|F|!} [f(S \\cup \\{i\\}) - f(S)]$. " +
          "SHAP is mathematically proven to be the **only** attribution method that simultaneously satisfies " +
          "Local Accuracy (Efficiency), Missingness, Consistency, and Additivity."
      },

      miss: [
        {
          w: "Model explainability and model accuracy are always an unavoidable zero-sum trade-off.",
          r: "Modern glass-box models like Explainable Boosting Machines (EBMs) achieve predictive accuracy matching or exceeding Random Forests and XGBoost while remaining 100% mathematically interpretable."
        },
        {
          w: "LIME and SHAP will always give identical explanations for the same prediction.",
          r: "LIME relies on stochastic local sampling and heuristic kernel weights, producing explanations that can vary across runs. SHAP computes mathematically unique game-theoretic attributions."
        },
        {
          w: "A feature with high attribution in an explanation caused the model's prediction.",
          r: "Interpretability methods explain the model's internal statistical associations, not real-world physical causality. High SHAP values can be driven entirely by unobserved confounding variables."
        },
        {
          w: "Feature importance plots are sufficient to satisfy regulatory audit requirements.",
          r: "Global feature importance only shows what the model values overall. Regulatory audits (e.g. ECOA, GDPR) mandate adverse action notices explaining the exact local drivers for a specific individual's decision."
        }
      ],

      trade: {
        buys: [
          "Enables deployment in strictly regulated sectors (banking, medicine, insurance) by providing legally compliant explanation audits.",
          "Accelerates model debugging: immediately surfaces data leakage, spurious background artifacts, and demographic biases.",
          "Builds end-user and stakeholder trust by translating raw neural activations or tree splits into plain English attributions."
        ],
        costs: [
          "Substantial computational overhead: computing exact Shapley values across many features is combinatorial $\\mathcal{O}(2^p)$ (though TreeSHAP optimizes this to $\\mathcal{O}(T L D^2)$).",
          "Risk of adversarial manipulation: black-box explanation methods (like LIME) can be fooled by adversarial scaffolding designed to hide discriminatory behavior.",
          "Cognitive overload: complex multi-way interaction graphs can confuse non-technical business stakeholders."
        ],
        avoid: [
          "Deploying black-box healthcare or lending models without local explanation hooks (e.g. TreeSHAP).",
          "Confusing post-hoc statistical attributions with true real-world counterfactual causality."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "feature-importance",

      why: {
        before: "Engineers relied on raw regression coefficients ($w_j$) to gauge feature value, " +
          "which were distorted by differences in feature scaling and collapsed completely under multicollinearity.",
        problem: "Tree ensembles (Random Forests, Gradient Boosting) do not produce linear weights, " +
          "making it impossible to determine which variables drive predictions without specialized scoring algorithms.",
        shift: "**Feature Importance: Rigorous quantification of individual variable contributions.** " +
          "Measure the predictive impact of features via Mean Decrease in Impurity (MDI), " +
          "Permutation Feature Importance (PFI), Drop-Column Importance, or aggregated absolute SHAP values."
      },

      num: {
        t: "Feature importance methods comparison & vulnerability matrix",
        h: ["Method", "Evaluation Mechanism", "Evaluation Split", "Primary Flaw / Bias"],
        r: [
          ["**Mean Decrease in Impurity (MDI / Gini)**", "Sums split impurity reductions across all trees", "**Training data only**", "**Severely biased toward continuous & high-cardinality features**"],
          ["**Permutation Feature Importance (PFI)**", "Measures drop in test metric after randomly shuffling column", "**Held-out test set**", "Creates unrealistic feature combinations if variables are strongly correlated"],
          ["**Drop-Column Importance**", "Retrains model from scratch without feature $j$; compares test metric", "**Held-out test set**", "**Computationally prohibitive**: requires retraining $p$ separate models"],
          ["**SHAP Mean Absolute Value**", "$\\frac{1}{N} \\sum_{i=1}^N |\\phi_i^{(j)}|$", "**Validation / Test set**", "Computationally intensive; can divide credit across collinear features"],
          ["**Coefficient Magnitude ($|w_j|$)**", "Raw weight in linear model: $|w_j| \\cdot \\sigma(x_j)$", "Fitted model parameters", "Meaningless unless features are identically standardized; fails under collinearity"]
        ],
        n: "Feature importance is essential for dimensionality reduction, " +
          "model debugging, and domain discovery. However, different importance " +
          "metrics measure fundamentally different properties. **Mean Decrease Impurity (MDI)**, " +
          "the default metric in Scikit-Learn's `RandomForestClassifier.feature_importances_`, " +
          "tallies the total impurity decrease achieved by all splits on a given feature. " +
          "Because high-cardinality features (such as customer IDs or random numerical noise) " +
          "provide abundant split opportunities, MDI routinely ranks pure random noise " +
          "as the 'most important' feature! To resolve this, Leo Breiman introduced " +
          "**Permutation Feature Importance (PFI)**: after training, feature $j$ is randomly " +
          "shuffled across the held-out validation set, breaking its relationship with the target $y$. " +
          "The resulting drop in validation score (e.g. drop in ROC-AUC) directly measures the " +
          "feature's true predictive dependence. If two features are highly correlated (e.g. $r=0.99$), " +
          "shuffling one feature has little impact because the model utilizes the collinear twin, " +
          "artificially deflating the importance of both features unless assessed via grouped permutation."
      },

      miss: [
        {
          w: "Default scikit-learn tree feature importances (MDI) are reliable for production feature selection.",
          r: "MDI is calculated strictly on training data and exhibits an extreme bias toward numerical features with many distinct values and high-cardinality categories. Permutation importance or SHAP must be used instead."
        },
        {
          w: "If a feature has zero importance, it contains no relationship with the target variable.",
          r: "If two features are perfectly correlated, a tree model may choose one and ignore the other. The omitted feature has near-zero importance despite being 100% predictive of the target."
        },
        {
          w: "Permutation feature importance should be calculated on the training dataset.",
          r: "Computing permutation importance on the training set measures what the model memorized, not what generalizes. PFI must be evaluated on an untouched validation or test dataset."
        },
        {
          w: "Feature importance proves which features are causing the business outcome.",
          r: "Feature importance reflects statistical correlation within the model's learned representation. It cannot distinguish between cause and effect or detect proxy variables."
        }
      ],

      trade: {
        buys: [
          "Prunes noisy, redundant, and expensive-to-collect features from production inference pipelines.",
          "Instantly detects data leakage (e.g. a future timestamp showing 99% importance).",
          "Communicates high-level model mechanics and drivers to non-technical business stakeholders."
        ],
        costs: [
          "MDI defaults silently mislead engineers by over-ranking continuous and high-cardinality columns.",
          "Collinear features dilute each other's importance, obscuring critical signals in correlated datasets.",
          "Computing permutation importance or SHAP across large validation sets adds significant CI/CD pipeline latency."
        ],
        avoid: [
          "Relying on default `rf.feature_importances_` when working with unpruned trees and high-cardinality data.",
          "Discarding low-importance features without checking for multicollinearity against retained variables."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "automl",

      why: {
        before: "Developing machine learning models required tedious manual trial-and-error: " +
          "hand-crafting features, testing disparate algorithms, and running exhaustive grid searches for hyperparameters.",
        problem: "Manual exploration is bottlenecked by human bandwidth, prone to methodological errors " +
          "(data leakage, lack of baseline benchmarks), and fails to scale across hundreds of enterprise modeling tasks.",
        shift: "**AutoML (Automated Machine Learning): Algorithmic end-to-end pipeline synthesis.** " +
          "Automate data preprocessing, feature engineering, algorithm selection, hyperparameter optimization (CASH), " +
          "and ensemble stacking under a strict time or compute budget."
      },

      num: {
        t: "AutoML search strategies & framework performance",
        h: ["Paradigm / Framework", "Core Optimization Algorithm", "Key Architecture / Strategy", "Relative Benchmark Performance"],
        r: [
          ["**AutoGluon (Amazon)**", "Multi-layer ensemble stacking", "No hyperparameter tuning; stacks diverse raw models with out-of-fold blending", "**Top Tabular Rank**: dominates OpenML benchmarks"],
          ["**FLAML (Microsoft)**", "Cost-Frugal Hyperparameter Opt (CFO)", "Starts with simple, fast models; expands search as budget allows", "**Lowest compute cost**: exceptionally fast convergence"],
          ["**H2O AutoML**", "Random grid search + Stacked Ensembles", "Trains diverse models (GBM, DRF, GLM, Deep Learning) + Super Learner", "High enterprise adoption; native Java export"],
          ["**TPOT**", "Genetic Algorithms (GP)", "Evolves scikit-learn pipelines using evolutionary programming", "Produces interpretable Python pipelines; computationally slow"],
          ["**Bayesian / TPE (Optuna)**", "Tree-structured Parzen Estimator", "Models $p(x|y)$ to sample promising hyperparameter regions", "Foundational engine for hyperparameter optimization"]
        ],
        n: "AutoML formalizes machine learning engineering as the **CASH problem** " +
          "(Combined Algorithm Selection and Hyperparameter optimization): " +
          "$\\text{CASH}^* = \\arg\\min_{A \\in \\mathcal{A}, \\lambda \\in \\Lambda_A} " +
          "\\frac{1}{K} \\sum_{k=1}^K \\mathcal{L}(A_\\lambda, D_{\\text{train}}^{(k)}, D_{\\text{val}}^{(k)})$. " +
          "While early AutoML frameworks relied on heavy Bayesian optimization over complex pipeline graphs, " +
          "modern systems (notably **AutoGluon**) demonstrated that **multi-layer ensemble stacking** " +
          "routinely outperforms fine-grained hyperparameter tuning. Modern AutoML pipelines automatically " +
          "detect data types, impute missing values, encode high-cardinality categories, generate " +
          "cross-features, and train a battery of diverse base models (LightGBM, CatBoost, XGBoost, " +
          "Neural Networks, Random Forests). The out-of-fold (OOF) predictions of these base learners " +
          "are then concatenated with original features and passed to a secondary stack layer, " +
          "culminating in a weighted ensemble that consistently matches or outperforms human Kaggle Grandmasters."
      },

      miss: [
        {
          w: "AutoML replaces data scientists and eliminates the need for human domain expertise.",
          r: "AutoML automates mechanical model selection and tuning. It cannot frame business objectives, ensure data quality, detect subtle target leakage, or design domain-specific features."
        },
        {
          w: "AutoML always overfits because it evaluates hundreds of models on the same dataset.",
          r: "Production AutoML systems rely strictly on nested K-fold cross-validation and out-of-fold stacking, which rigorously prevents target leakage and over-optimistic evaluation."
        },
        {
          w: "AutoML models are too bloated and slow to be deployed in production APIs.",
          r: "Modern AutoML frameworks include model distillation (distilling a massive stacked ensemble into a single fast LightGBM model) and pipeline pruning to hit strict millisecond inference budgets."
        },
        {
          w: "AutoML is just a glorified brute-force Grid Search.",
          r: "AutoML employs sophisticated search heuristics: Bayesian optimization (TPE), Successive Halving (Hyperband/ASHA), and genetic programming to allocate compute dynamically to promising candidates."
        }
      ],

      trade: {
        buys: [
          "Dramatically accelerates time-to-baseline: establishes competitive, benchmark-grade models in minutes instead of weeks.",
          "Democratizes machine learning: allows non-specialist software engineers to build high-quality predictive services.",
          "Eliminates human confirmation bias: objectively tests model families that human practitioners might overlook."
        ],
        costs: [
          "Substantial compute and cloud costs: parallel evaluation of dozens of heavy ensemble models demands heavy CPU/GPU resources.",
          "Stacked ensemble complexity: final production artifacts can be massive multi-gigabyte models with higher inference latency.",
          "Reduced debuggability: understanding failure modes within an automated multi-layer stack is significantly harder than a single model."
        ],
        avoid: [
          "Running AutoML on raw, unvalidated datasets containing uncorrected target leakage.",
          "Deploying a 15-model stacked AutoML ensemble directly to hard real-time (<10ms) edge devices without model distillation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "recommendation-system",

      why: {
        before: "Online platforms presented static, manually curated product catalogs or generic top-10 popularity lists, " +
          "ignoring individual user affinities and overwhelming customers with irrelevant choices.",
        problem: "Modern platforms host millions of items and hundreds of millions of users; calculating full " +
          "cross-product rankings in real time across the entire catalog is computationally impossible.",
        shift: "**Modern Recommendation Systems: Multi-stage retrieval and ranking funnel.** " +
          "Decompose discovery into a scalable two-stage funnel: fast vector-based Candidate Generation (retrieving ~100 items from millions) " +
          "followed by high-precision Fine Ranking using feature-rich gradient boosted trees or deep networks."
      },

      num: {
        t: "Recommendation funnel stages & evaluation metrics",
        h: ["Funnel Stage", "Input Scale $\\to$ Output Scale", "Latency Budget", "Algorithms & Technologies"],
        r: [
          ["**Candidate Generation (Retrieval)**", "$10^7 \\text{ items} \\to 10^2 \\text{ items}$", "$< 15 \\text{ ms}$", "Two-Tower vector embeddings, Approximate Nearest Neighbors (ANN / HNSW), Collaborative Filtering"],
          ["**Filtering / Business Rules**", "$100 \\text{ items} \\to 80 \\text{ items}$", "$< 5 \\text{ ms}$", "Deduplication, out-of-stock filtering, regional availability, safety blocks"],
          ["**Fine Ranking (Scoring)**", "$80 \\text{ items} \\to 20 \\text{ items}$", "$< 30 \\text{ ms}$", "Deep & Cross Network (DCN), DLRM, CatBoost / LightGBM, Multi-Task learning"],
          ["**Re-ranking & Diversity**", "$20 \\text{ items} \\to 10 \\text{ items}$", "$< 5 \\text{ ms}$", "Determinantal Point Processes (DPP), contextual bandits, freshness injection"],
          ["**Ranking Evaluation Metrics**", "**NDCG@K, MAP@K, MRR, Hit Rate@K**", "Offline evaluation", "Measures position-discounted relevance of the final displayed list"]
        ],
        n: "Modern recommendation systems power the economic engines of " +
          "e-commerce, streaming, and social media. Because evaluating a complex " +
          "deep neural network across a catalog of 50 million items for every user " +
          "request would violate real-time latency budgets, industry systems universally " +
          "implement a **multi-stage recommendation funnel**. Stage 1 is **Candidate Generation " +
          "(Retrieval)**: lightweight models (such as matrix factorization, item-to-item " +
          "collaborative graphs, or **Two-Tower Neural Networks** that map users and items into a " +
          "shared embedding space) query an Approximate Nearest Neighbor (ANN) index in $<15$ ms " +
          "to retrieve the top ~100 candidates. Stage 2 applies **Hard Filtering** (removing seen items, " +
          "out-of-stock products, or regional restrictions). Stage 3 is **Fine Ranking**: a heavy " +
          "deep learning model (such as Meta's DLRM or Deep & Cross Network) scores the remaining ~80 " +
          "items using hundreds of real-time contextual features (time of day, recent clicks, user history), " +
          "predicting the exact Probability of Click (pCTR) and Conversion (pCVR). Finally, Stage 4 applies " +
          "**Re-ranking** to ensure category diversity, novelty, and exploration."
      },

      miss: [
        {
          w: "A recommendation system should always recommend items with the highest predicted rating.",
          r: "Recommending solely high-rating items creates an 'echo chamber' or 'filter bubble', showing only blockbuster hits. Systems must balance relevance with diversity, novelty, and serendipity."
        },
        {
          w: "Collaborative filtering works seamlessly for newly registered users and brand-new products.",
          r: "This is the classic Cold-Start Problem: collaborative filtering requires historical interaction logs. New entities require content-based heuristics, contextual bandits, or onboarding questionnaires."
        },
        {
          w: "Evaluating a recommender system offline with RMSE guarantees online business success.",
          r: "Offline rating accuracy correlates weakly with online business metrics. A model can predict known ratings accurately while recommending boring, obvious items, failing to drive incremental lift in online A/B tests."
        },
        {
          w: "Candidate retrieval and ranking can be merged into a single end-to-end model in production.",
          r: "Scanning millions of catalog items using a complex ranking network violates hard production latency constraints ($<50$ ms). The two-stage funnel is an architectural necessity."
        }
      ],

      trade: {
        buys: [
          "Massive business lift: drives engagement, retention, and GMV by personalizing experiences across millions of users.",
          "Scalable multi-stage architecture handles catalog scales of tens of millions of items within sub-50ms latency budgets.",
          "Two-tower vector models allow decoupling user embedding updates from real-time catalog serving."
        ],
        costs: [
          "Severe cold-start challenges for newly published items and newly signed-up users.",
          "Feedback loops and popularity bias: models disproportionately recommend popular items, starving niche catalog inventory.",
          "Complex infrastructure footprint: requires vector databases, feature stores, real-time streaming pipelines, and A/B testing frameworks."
        ],
        avoid: [
          "Relying solely on offline rating MSE/RMSE to make production model deployment decisions.",
          "Deploying recommendation systems without exploration mechanisms (e.g. epsilon-greedy or Thompson Sampling) to discover new item affinities."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "collaborative-filtering",

      why: {
        before: "Content-based recommendation systems required manually tagging every item with detailed metadata attributes " +
          "(e.g. genre, director, color), which was expensive, incomplete, and failed to capture nuanced user tastes.",
        problem: "Manual metadata tagging cannot scale to millions of user-generated items, misses cross-domain affinities, " +
          "and ignores the rich behavioral signals hidden in implicit user interaction patterns.",
        shift: "**Collaborative Filtering: Leveraging collective wisdom across user-item interaction matrices.** " +
          "Predict a user's affinity for an item based on the historical preferences of similar users (Neighborhood methods) " +
          "or by decomposing the sparse interaction matrix into latent user and item factor embeddings (Matrix Factorization)."
      },

      num: {
        t: "Collaborative filtering paradigms: Neighborhood vs Matrix Factorization",
        h: ["Dimension / Property", "User-Based / Item-Based CF", "Matrix Factorization (SVD / Funk-SVD)", "Alternating Least Squares (ALS)"],
        r: [
          ["**Representation**", "Raw interaction matrix $R_{m \\times n}$", "Low-rank latent factors: $R \\approx P_{m \\times k} Q_{n \\times k}^T$", "Implicit feedback factor matrices: $P, Q$"],
          ["**Similarity Metric**", "Cosine / Pearson correlation between rows/columns", "Inner product of latent vectors: $\\hat{r}_{ui} = p_u^T q_i$", "Confidence-weighted squared error minimization"],
          ["**Matrix Sparsity Handling**", "Severe degradation when matrix is $>99\\%$ sparse", "**Robust**: maps sparse data into compact $k$-dimensional space", "Treats unobserved entries as negative feedback with low confidence"],
          ["**Computational Complexity**", "Item-Item: $\\mathcal{O}(N^2)$ pairwise similarities", "$\\mathcal{O}(k \\cdot |R|)$ via Stochastic Gradient Descent", "$\\mathcal{O}(k^3 (m+n) + k^2 |R|)$ per iteration; highly parallelizable"],
          ["**Explainability**", "**High**: 'Recommended because you liked X'", "**Low**: latent factors (dimension 42) lack direct human semantics", "Medium: can project latent item similarities"]
        ],
        n: "Collaborative Filtering (CF) is founded on the premise that " +
          "users who agreed in the past will agree in the future. CF is categorized into " +
          "**Memory-Based (Neighborhood)** and **Model-Based (Matrix Factorization)** approaches. " +
          "In memory-based systems, **Item-Item Collaborative Filtering** (pioneered by Amazon) " +
          "computes similarity between items based on user co-consumption vectors, which is more " +
          "stable than User-User CF because item catalogs change slower than human tastes. " +
          "In model-based systems, **Matrix Factorization** (popularized by Simon Funk during the " +
          "Netflix Prize) approximates the massive, sparse user-item interaction matrix $R$ as the " +
          "product of two low-rank dense matrices: $R \\approx P Q^T$, where $P \\in \\mathbb{R}^{m \\times k}$ " +
          "and $Q \\in \\mathbb{R}^{n \\times k}$ represent users and items in a shared $k$-dimensional " +
          "latent factor space ($k \\approx 50-200$). For **Implicit Feedback** datasets (clicks, views, " +
          "listens without explicit 1-5 star ratings), **Alternating Least Squares (ALS)** introduces " +
          "a confidence matrix $c_{ui} = 1 + \\alpha r_{ui}$, solving for $P$ and $Q$ alternately in " +
          "closed form with embarrassingly parallel distributed efficiency."
      },

      miss: [
        {
          w: "Unrated items in a collaborative filtering matrix should be filled with zeros.",
          r: "An unrated item is missing data (unobserved), not a negative rating of zero. Filling missing entries with zero destroys the matrix factorization and severely degrades recommendation quality."
        },
        {
          w: "Collaborative filtering requires explicit user ratings (like 1 to 5 stars).",
          r: "Modern CF algorithms are designed specifically for implicit feedback (clicks, purchases, watch time), converting binary actions into preference $p_{ui}$ and confidence $c_{ui}$ matrices."
        },
        {
          w: "User-User collaborative filtering scales better than Item-Item collaborative filtering.",
          r: "In commercial systems, users vastly outnumber items ($10^8$ users vs $10^5$ items), and user preferences drift constantly. Item-item similarity matrices are smaller, sparser, and far more computationally stable."
        },
        {
          w: "Matrix factorization is identical to classical TruncatedSVD from linear algebra.",
          r: "Classical SVD requires a completely filled, dense matrix. Collaborative filtering matrix factorization (Funk-SVD, ALS) optimizes loss strictly over the observed (non-missing) entries."
        }
      ],

      trade: {
        buys: [
          "Domain-independent personalization: discovers latent affinities without requiring expensive manual content tagging.",
          "Captures serendipitous recommendations: recommends cross-genre items that share latent behavioral patterns.",
          "Matrix factorization compresses multi-terabyte sparse interaction matrices into compact, fast-to-query dense vector spaces."
        ],
        costs: [
          "Severe cold-start vulnerability: completely ineffective for new items with zero ratings or new users with zero history.",
          "Popularity bias: tends to disproportionately recommend catalog bestsellers, reinforcing feedback loops.",
          "Extreme matrix sparsity: real-world e-commerce interaction matrices are typically $>99.9\\%$ empty, challenging neighborhood methods."
        ],
        avoid: [
          "Deploying pure collaborative filtering for new product launches without content-based fallback rules.",
          "Using classical dense SVD algorithms that require imputing missing values with zeros or means."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "time-series-forecasting",

      why: {
        before: "Engineers applied standard regression models (e.g. Linear Regression, Random Forests) " +
          "to temporal data by randomly shuffling samples across training and validation splits.",
        problem: "Randomly shuffling sequential data causes catastrophic lookahead data leakage (predicting the past using future data) " +
          "and violates the core independent and identically distributed (IID) assumption due to strong temporal autocorrelation.",
        shift: "**Time Series Forecasting: Sequential modeling respecting temporal causality.** " +
          "Model temporal structures using classical autoregressive decomposition (ARIMA, ETS), " +
          "feature-engineered gradient boosting with rolling lag statistics, or deep temporal networks, " +
          "evaluating strictly via expanding-window TimeSeriesSplit."
      },

      num: {
        t: "Time series forecasting paradigm comparison",
        h: ["Paradigm / Framework", "Core Mathematical Formulation", "Multi-Horizon Support", "Key Strengths & Constraints"],
        r: [
          ["**ARIMA / SARIMA**", "$\\phi(B)(1-B)^d X_t = \\theta(B)\\epsilon_t$", "Iterative roll-forward", "Strict statistical rigor; requires stationarity; single univariate series"],
          ["**Exponential Smoothing (ETS)**", "Error, Trend, Seasonal additive/multiplicative equations", "Analytical forecast formulas", "Fast, interpretable baseline; handles strong seasonality well"],
          ["**GBDT with Lag Features**", "$y_{t+h} = f(y_{t}, y_{t-1}, \\dots, \\text{roll\\_mean}(y, 7), \\text{day\\_of\\_week})$", "Direct multi-step or recursive", "**Dominates retail tabular forecasting**; natively handles exogenous static/dynamic features"],
          ["**Prophet (Additive Model)**", "$y(t) = g(t) + s(t) + h(t) + \\epsilon_t$ (Trend + Season + Holiday)", "Curve fitting extrapolation", "Handles irregular holidays, missing data, and trend change-points cleanly"],
          ["**Deep Learning (TFT / N-BEATS)**", "Temporal Fusion Transformer / Gated Residual Networks", "**Native direct multi-horizon**", "SOTA across complex multi-series datasets with cross-series interactions"]
        ],
        n: "Time series forecasting differs fundamentally from cross-sectional " +
          "machine learning because observations exhibit **temporal autocorrelation**: " +
          "the value at time $t$ depends mathematically on values at $t-1, t-2, \\dots$. " +
          "Classical statistical forecasting (Box-Jenkins **ARIMA**) requires that the series be " +
          "**Stationary** (constant mean, constant variance, and autocovariance independent of time), " +
          "verified via the **Augmented Dickey-Fuller (ADF) test** and achieved via differencing ($d$). " +
          "In modern enterprise forecasting (e.g., Walmart retail demand across 100,000 SKUs), " +
          "**Gradient Boosted Decision Trees (LightGBM)** dominate by transforming the sequence into a " +
          "tabular supervised learning problem using **lag features** ($y_{t-1}, y_{t-7}$), **rolling window aggregations** " +
          "(mean, standard deviation over 7/30 days), and calendar indicators. Crucially, validation " +
          "must strictly enforce temporal causality using **Expanding-Window Cross-Validation (TimeSeriesSplit)**: " +
          "the training set must always temporally precede the validation set. Randomly shuffling rows leaks future " +
          "information into the past, producing deceptively high validation scores that fail in production."
      },

      miss: [
        {
          w: "K-Fold cross-validation with random shuffling is suitable for evaluating time series models.",
          r: "Random shuffling leaks future information into the training set, violating temporal causality. Time series validation strictly requires forward-chaining / expanding-window TimeSeriesSplit."
        },
        {
          w: "Tree-based models (Random Forests, LightGBM) naturally extrapolate upward and downward trends.",
          r: "Decision trees make constant piecewise leaf predictions. For out-of-sample future time steps where the trend exceeds historical training values, trees predict a flat line. Trends must be detrended first."
        },
        {
          w: "Deep learning models (LSTMs, Transformers) are always superior to ARIMA and LightGBM for forecasting.",
          r: "On standard univariate or small-scale business series, simple ETS, ARIMA, and lagged LightGBM consistently outperform complex deep learning models with a fraction of the compute and tuning cost."
        },
        {
          w: "A stationary time series has no fluctuations or changes over time.",
          r: "Stationarity does not mean a flat line; it means statistical properties (mean, variance, autocorrelation) remain constant over time. The series fluctuates around a stable mean with constant volatility."
        }
      ],

      trade: {
        buys: [
          "Accurate demand, inventory, and resource forecasting unlocks massive operational efficiencies and cost reductions.",
          "GBDT approaches natively incorporate diverse exogenous covariates (promotions, weather, holidays, competitor prices).",
          "Deep models (TFT, DeepAR) provide native probabilistic forecasts (prediction intervals $p_{10}, p_{50}, p_{90}$) for risk assessment."
        ],
        costs: [
          "Vulnerable to regime shifts, black swan events, and non-stationary macroeconomic shocks that violate historical patterns.",
          "Tree models cannot extrapolate linear trends without explicit detrending or differencing preprocessing.",
          "High pipeline maintenance: rolling lag features require low-latency feature stores and strict point-in-time joins."
        ],
        avoid: [
          "Using standard `train_test_split(shuffle=True)` on time series data.",
          "Deploying raw GBDT forecasting models without detrending on data with strong long-term upward or downward trends."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
