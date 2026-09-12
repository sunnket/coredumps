/* ==========================================================================
   Depth pass 65 — AI/ML core batch 3: data preparation, encoding, and validation.
   Feature Scaling, One-Hot Encoding, Label Encoding, Training Data,
   Train/Validation/Test Split, Cross-Validation, Data Leakage, Class Imbalance.

   Clean data, honest validation splits, and leakage prevention separate
   production machine learning from deceptive notebook illusions.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "feature-scaling",

      why: {
        before: "Algorithms were fed numerical features with wildly disparate " +
          "physical scales and measurement units (e.g. `age` 0–100, `salary` 0–1,000,000).",
        problem: "Distance-based algorithms (KNN, K-Means, SVM) and gradient-optimized " +
          "models (Neural Networks, Logistic Regression) treat numbers purely as geometric " +
          "coordinates. Large-scale features completely dominate distances and warp loss " +
          "surfaces into narrow elliptical ravines, causing gradient descent to oscillate erratically.",
        shift: "**Feature Scaling: normalize all continuous dimensions to comparable scales.** " +
          "Transform features to share standardized magnitudes (zero mean with unit variance, " +
          "or bounded $[0, 1]$ intervals), restoring isotropic loss surfaces and equitable geometric distances."
      },

      num: {
        t: "Feature scaling techniques & mathematical formulations",
        h: ["Scaling Technique", "Mathematical Formula", "Output Range", "Sensitivity to Outliers"],
        r: [
          ["**Standardization (Z-Score)**", "$z = \\frac{x - \\mu}{\\sigma}$", "**Mean = 0, Std = 1 ($(-\\infty, +\\infty)$)**", "**Moderate; preserves outlier positions**"],
          ["**Min-Max Normalization**", "$x' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}$", "**Strictly $[0, 1]$ (or custom $[a, b]$)**", "**High; extreme outliers squash normal data**"],
          ["**RobustScaler**", "$x' = \\frac{x - Q_2}{\\text{IQR}} = \\frac{x - \\text{median}}{Q_3 - Q_1}$", "**Centered at 0, scaled by IQR**", "**Extremely low; robust to severe outliers**"],
          ["**MaxAbsScaler**", "$x' = \\frac{x}{|x_{\\max}|}$", "**Strictly $[-1, 1]$**", "**Preserves exact zeros in sparse matrices**"],
          ["**Quantile Transformer**", "**Maps empirical cumulative distribution to Uniform/Normal**", "**Uniform $[0, 1]$ or Gaussian $\\mathcal{N}(0, 1)$**", "**Completely neutralizes outlier leverage**"]
        ],
        n: "Feature scaling is mandatory for any machine learning algorithm " +
          "that computes spatial distances or optimizes parameters via gradient " +
          "descent. In **gradient descent**, the convergence rate is governed " +
          "by the **condition number of the Hessian matrix** (the ratio of " +
          "the largest to smallest eigenvalues). When features have unscaled " +
          "variances (e.g. $x_1 \\in [0, 1]$ and $x_2 \\in [0, 100,000]$), " +
          "the loss contours become severely elongated, steep ellipses. " +
          "Gradients point almost perpendicular to the direction of the " +
          "minimum, forcing gradient descent to oscillate violently with " +
          "tiny learning rates. Scaling normalizes the loss contours into " +
          "concentric hyperspheres, allowing gradient descent to point " +
          "directly toward the global minimum with much larger learning " +
          "rates. In **regularized models (Ridge, Lasso)**, scaling is non-negotiable: " +
          "the L1/L2 penalty ($\\lambda \\sum w_j^2$) penalizes all coefficients " +
          "equally; if $x_1$ has tiny numbers, its weight $w_1$ will naturally " +
          "be huge, causing the regularization penalty to penalize $w_1$ " +
          "unfairly. Tree-based models (**Decision Trees, Random Forests, " +
          "XGBoost**) are the sole exception: they evaluate monotonic split " +
          "thresholds ($x_j \\le \\theta$) per feature in isolation, making " +
          "them completely invariant to feature scaling."
      },

      miss: [
        {
          w: "All machine learning models require feature scaling.",
          r: "Tree-based models (Random Forest, XGBoost, LightGBM) evaluate features " +
            "independently via monotonic threshold splits, making scaling completely redundant."
        },
        {
          w: "Scalers can be fitted on the entire dataset before splitting into train/test.",
          r: "Fitting a scaler on the entire dataset leaks the test set mean and variance " +
            "into the training process (**Data Leakage**). Scalers must be fitted strictly on the training split."
        },
        {
          w: "Min-Max scaling is universally safe for all numerical features.",
          r: "If a dataset contains extreme outliers, Min-Max compresses 99% of normal " +
            "data points into a microscopic interval like $[0, 0.01]$, destroying feature variance."
        },
        {
          w: "Standardization turns any arbitrary distribution into a normal bell curve.",
          r: "Standardization is a linear shift and scale; it does not alter distribution shape. " +
            "Transforming skewed data into a normal distribution requires power transforms (Box-Cox, Yeo-Johnson)."
        }
      ],

      trade: {
        buys: [
          "Accelerates gradient descent convergence speed by orders of magnitude.",
          "Prevents large-scale numerical features from dominating distance metrics in KNN, K-Means, and SVM.",
          "Ensures regularization penalties (L1/L2) penalize weights fairly across all dimensions.",
          "Stabilizes numerical floating-point precision during matrix operations."
        ],
        costs: [
          "Transformed numerical values lose intuitive real-world domain interpretability.",
          "Requires persisting scaler parameters (mean, std, min, max) for live inference pipelines.",
          "Sensitivity of Min-Max scaling to unseen out-of-bounds values during production inference.",
          "Adds pipeline complexity and potential data leakage risk if improperly placed outside CV loops."
        ],
        avoid: [
          "Applying feature scalers to tree-based models where it provides zero algorithmic benefit.",
          "Fitting scalers across the full dataset prior to train/validation splitting.",
          "Using Min-Max scaling on heavy-tailed distributions with extreme outliers (use RobustScaler)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "one-hot-encoding",

      why: {
        before: "Engineers converted categorical columns (e.g. `Color`: `Red`, `Green`, " +
          "`Blue`) into arbitrary sequential numbers (`Red=1`, `Green=2`, `Blue=3`).",
        problem: "Assigning sequential integers to nominal categories imposes a false " +
          "mathematical order (`Blue (3) > Green (2) > Red (1)`) and implies that " +
          "`Green` is the exact mathematical average of `Red` and `Blue`, severely " +
          "distorting linear models, neural networks, and distance calculations.",
        shift: "**One-Hot Encoding: orthogonal binary indicator vectors.** " +
          "Expand each unique categorical value into a dedicated binary column ($0$ or $1$), " +
          "representing categories as mutually orthogonal basis vectors with equidistant geometric spacing."
      },

      num: {
        t: "Categorical encoding approaches & structural characteristics",
        h: ["Encoding Method", "Transformation Mechanism", "Dimensionality Expansion", "Best Use Case"],
        r: [
          ["**One-Hot Encoding**", "**$K$ binary columns (one `1`, remaining `0`)**", "**+$K$ columns**", "**Low-cardinality nominal categories ($K < 20$) in linear models/neural nets**"],
          ["**Dummy Encoding**", "**$K-1$ binary columns (drops reference category)**", "**+($K-1$) columns**", "**Linear regression with intercept (avoids dummy variable trap)**"],
          ["**Target / Mean Encoding**", "**Replaces category with smoothed target mean**", "**Zero (replaces column in-place)**", "**High-cardinality categories in tabular gradient boosted trees**"],
          ["**Frequency Encoding**", "**Replaces category with its empirical count/frequency**", "**Zero (replaces column in-place)**", "**Captures popularity signal in tree models**"],
          ["**Entity Embeddings**", "**Learns dense vector $\\mathbb{R}^m$ via neural embedding layer**", "**+$m$ columns ($m \\ll K$)**", "**High-cardinality categoricals in deep learning (FastAI/PyTorch)**"]
        ],
        n: "One-Hot Encoding transforms a nominal categorical variable $C$ " +
          "with $K$ distinct levels into a sparse binary vector $\\mathbf{v} " +
          "\\in \\{0, 1\\}^K$. In Euclidean space, this places every category " +
          "at the exact same distance ($\\sqrt{2}$) from every other category, " +
          "completely eliminating false numerical hierarchy. However, in " +
          "linear models with an intercept term ($y = \\mathbf{w}^T\\mathbf{x} " +
          "+ b$), one-hot encoding introduces the **Dummy Variable Trap**: " +
          "because the sum of all $K$ binary columns is identically $1$ for " +
          "every row, the features exhibit **perfect multicollinearity** " +
          "($\\sum_{j=1}^K x_j = 1$). The data matrix $\\mathbf{X}^T\\mathbf{X}$ " +
          "becomes singular and non-invertible, causing coefficient estimates " +
          "to explode. The remedy in unregularized linear models is **Dummy " +
          "Encoding**: dropping one reference column to retain $K-1$ degrees " +
          "of freedom. In high-cardinality scenarios (e.g. `Postal_Code` " +
          "with 40,000 values), one-hot encoding triggers a catastrophic " +
          "**dimensionality explosion**, bloating memory, slowing training, " +
          "and fragmenting decision trees into sparse, uninformative splits. " +
          "In such cases, **Target Encoding** or learned **Neural Embeddings** " +
          "must be used instead."
      },

      miss: [
        {
          w: "One-hot encoding is always required for tree-based models.",
          r: "Modern gradient boosted trees (LightGBM, CatBoost) natively handle " +
            "categorical features using target statistics and optimal subset splits, " +
            "achieving higher accuracy without sparse feature explosions."
        },
        {
          w: "You should always keep all $K$ binary columns in linear regression.",
          r: "In linear regression with an intercept, keeping all $K$ columns triggers " +
            "the **Dummy Variable Trap** (perfect multicollinearity); you must drop one reference category."
        },
        {
          w: "One-hot encoding naturally handles new, unseen categories during inference.",
          r: "If a category appears at inference time that was absent during training, " +
            "one-hot encoders throw an error unless explicitly configured with `handle_unknown='ignore'`."
        },
        {
          w: "One-hot encoding is appropriate for categories with thousands of unique values.",
          r: "High-cardinality features explode the feature space into thousands of sparse " +
            "columns, triggering the curse of dimensionality and severe memory bloat."
        }
      ],

      trade: {
        buys: [
          "Eliminates false numerical hierarchy and distances in nominal categorical variables.",
          "Creates clean orthogonal basis vectors ideal for linear models, neural networks, and SVMs.",
          "Simple, deterministic, and highly interpretable: each column represents a single category.",
          "Universally supported across all machine learning libraries and data frameworks."
        ],
        costs: [
          "Dimensionality explosion on high-cardinality features, ballooning memory and compute.",
          "Creates sparse matrices that degrade split efficiency in standard decision trees.",
          "Vulnerable to the dummy variable trap in unregularized linear regression.",
          "Cannot naturally capture semantic similarity between categories (unlike dense embeddings)."
        ],
        avoid: [
          "High-cardinality categorical features (ZIP codes, user IDs, product SKUs).",
          "Tree-based models when native categorical support (CatBoost, LightGBM) is available.",
          "Ordinal categories where a natural mathematical hierarchy already exists."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "label-encoding",

      why: {
        before: "Machine learning libraries and linear algebra engines require " +
          "numerical matrices, failing completely when fed raw string text labels.",
        problem: "Target classification classes (e.g. `['cat', 'dog', 'bird']`) " +
          "cannot be processed by loss functions, cross-entropy calculations, or GPU kernels.",
        shift: "**Label Encoding: assign unique sequential integers to discrete labels.** " +
          "Map text labels into contiguous integers ($0, 1, 2, \\dots, K-1$), providing " +
          "a compact numerical format specifically designed for classification target variables."
      },

      num: {
        t: "Label Encoding vs Ordinal Encoding vs One-Hot Encoding comparison",
        h: ["Encoding Technique", "Target Application", "Input Dimension Handling", "Mathematical Property"],
        r: [
          ["**LabelEncoder**", "**Target Variable ($Y$) strictly**", "**1D array / series of class names**", "**Arbitrary non-hierarchical integer assignment**"],
          ["**OrdinalEncoder**", "**Ordinal Input Features ($X$)**", "**2D matrix of ordered categories**", "**Preserves true domain hierarchy ($0 < 1 < 2 < 3$)**"],
          ["**One-Hot Encoder**", "**Nominal Input Features ($X$)**", "**2D matrix of unordered categories**", "**Orthogonal binary vectors (zero false hierarchy)**"],
          ["**Target Encoder**", "**High-Cardinality Input Features ($X$)**", "**2D matrix of categories**", "**Replaces category with smoothed target expectation**"]
        ],
        n: "Label Encoding assigns a unique integer to each distinct value " +
          "in a categorical array (e.g. `['cat', 'dog', 'bird']` $\\to [1, 2, 0]$). " +
          "In professional machine learning engineering, a critical distinction " +
          "exists between **`LabelEncoder`** and **`OrdinalEncoder`**. In scikit-learn, " +
          "`LabelEncoder` is strictly engineered for the **target label variable $Y$** " +
          "in classification tasks, converting string target names into zero-indexed " +
          "integers suitable for computing cross-entropy loss or ROC curves. " +
          "When practitioners mistakenly apply `LabelEncoder` to **input " +
          "feature columns $X$** with nominal data (e.g. `Country`: France=0, " +
          "Germany=1, Spain=2), it introduces a disastrous mathematical " +
          "distortion: linear models and neural networks interpret Spain as " +
          "being numerically twice the value of Germany, manufacturing " +
          "artificial mathematical relationships out of thin air. For input " +
          "features that possess genuine physical order (e.g. Education: " +
          "`High School < Bachelor's < Master's < PhD`), developers must " +
          "use **`OrdinalEncoder`** with an explicitly specified category " +
          "hierarchy, rather than relying on arbitrary alphabetical assignments."
      },

      miss: [
        {
          w: "LabelEncoder is a general-purpose tool for encoding input feature columns.",
          r: "`LabelEncoder` is explicitly designed strictly for 1D target labels ($Y$). " +
            "Input feature columns ($X$) require `OneHotEncoder` or `OrdinalEncoder`."
        },
        {
          w: "Label encoding nominal features is fine because decision trees don't care.",
          r: "While trees can split on integers, arbitrary label ordering forces trees " +
            "to perform multiple deep, unnatural zigzag splits to isolate non-adjacent categories."
        },
        {
          w: "LabelEncoder automatically sorts ordinal categories in their natural order.",
          r: "`LabelEncoder` sorts categories alphabetically. It maps `['Cold', 'Hot', 'Warm']` " +
            "to `[0, 1, 2]`, completely destroying the true thermodynamic order."
        },
        {
          w: "Label encoding and ordinal encoding are identical concepts.",
          r: "Ordinal encoding preserves an explicit, meaningful domain hierarchy. " +
            "Label encoding assigns arbitrary sequential integers without domain order."
        }
      ],

      trade: {
        buys: [
          "Compact 1D memory representation: zero column explosion or memory bloat.",
          "Perfect format for classification target variables ($Y$) required by loss functions.",
          "Preserves explicit domain ordering when used correctly on true ordinal input features.",
          "Fast, deterministic execution with negligible preprocessing compute overhead."
        ],
        costs: [
          "Manufactures false mathematical ordering when misapplied to nominal input features.",
          "Default alphabetical sorting corrupts natural domain hierarchies in ordinal data.",
          "Throws errors on unseen categorical values during inference unless handled explicitly.",
          "Can force tree models into inefficient split paths on unordered categoricals."
        ],
        avoid: [
          "Using `LabelEncoder` on input feature matrices ($X$).",
          "Encoding unordered nominal categories (e.g. colors, countries, device types) as integers.",
          "Relying on default alphabetical ordering for true ordinal variables."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "training-data",

      why: {
        before: "Traditional software behavior was authoritatively dictated by " +
          "human-authored specification documents, business logic rules, and code.",
        problem: "In statistical machine learning, algorithms do not know human rules; " +
          "their entire understanding of reality, edge cases, and behavior is dictated " +
          "strictly by the empirical data they observe during optimization.",
        shift: "**Training Data: the empirical source code of modern AI.** " +
          "The curated collection of historical observations, measurements, features, " +
          "and ground-truth outcomes fed into an optimization algorithm to learn model parameters."
      },

      num: {
        t: "Training data dimensions & critical quality failure modes",
        h: ["Quality Dimension", "Operational Requirement", "Pathology / Failure Mode", "Real-World Impact"],
        r: [
          ["**Representation & Coverage**", "**Reflects full diversity of target operational population**", "**Sampling Bias / Selection Bias**", "**Face recognition failing on minority groups**"],
          ["**Label Fidelity**", "**Accurate, consistent ground-truth annotations**", "**Label Noise / Annotator Disagreement**", "**Limits model performance ceiling; learns errors**"],
          ["**Stationarity**", "**Historical patterns remain valid in current time**", "**Temporal Degradation / Concept Drift**", "**Fraud models failing when fraudsters change tactics**"],
          ["**Volume & Diversity**", "**Sufficient samples to cover high-dimensional space**", "**Underspecification / Shortcut Learning**", "**Model memorizes spurious background artifacts**"],
          ["**Class Balance**", "**Adequate representation of rare critical events**", "**Severe Class Imbalance**", "**Model predicts 100% negative cases (catches 0 fraud)**"]
        ],
        n: "In modern machine learning, **data is the code**. The architecture " +
          "of a neural network (e.g. ResNet or Transformer) is merely an empty " +
          "scaffolding; the actual functional logic, decision thresholds, and " +
          "behavioral biases are permanently etched into the weights by the " +
          "**Training Data**. Andrew Ng's **Data-Centric AI** movement demonstrated " +
          "that in enterprise applications, iteratively improving training data " +
          "quality, fixing noisy labels, and ensuring consistent annotation " +
          "guidelines yields 10x greater performance gains than endlessly tuning " +
          "hyperparameters. Training data suffers from insidious systemic traps: " +
          "(1) **Historical Bias**: training on historical corporate promotion " +
          "or bank loan approvals trains the algorithm to perpetuate and " +
          "amplify historical human discrimination; (2) **Shortcut Learning**: " +
          "models exploit spurious correlations in training data (e.g. deep " +
          "vision models classifying a dog as a wolf purely because the training " +
          "wolf photos contained snow in the background); and (3) **Survivorship " +
          "Bias**: analyzing only surviving entities while ignoring failures."
      },

      miss: [
        {
          w: "More training data always beats better data quality.",
          r: "Feeding massive volumes of dirty, mislabeled, or unrepresentative data " +
            "amplifies noise and bias. Curated, high-quality data consistently outperforms raw volume."
        },
        {
          w: "Training data can be gathered once and reused permanently.",
          r: "Real-world environments evolve constantly. Training data suffers from temporal " +
            "decay and distribution drift, requiring continuous data pipeline refreshes."
        },
        {
          w: "Training data contains objective, unvarnished ground truth.",
          r: "Training data reflects the measurement limitations, institutional incentives, " +
            "and unconscious biases of the humans and sensors that generated it."
        },
        {
          w: "Cleaning and auditing training data is an entry-level clerical task.",
          r: "Data curation, error analysis, and feature validation represent 80% of " +
            "applied ML engineering and dictate whether a system succeeds or fails in production."
        }
      ],

      trade: {
        buys: [
          "Enables computers to solve perceptual and cognitive tasks impossible to code by hand.",
          "Scales software capabilities automatically through continuous data ingestion.",
          "Adapts models to complex local enterprise domains through fine-tuning.",
          "Provides the empirical foundation for all modern artificial intelligence."
        ],
        costs: [
          "Enormous financial, storage, and operational costs for data collection and cleaning.",
          "Risk of institutionalizing and automating historical societal biases.",
          "Legal, privacy, and copyright liabilities (GDPR, CCPA, fair-use litigation).",
          "Vulnerability to data poisoning attacks where adversaries inject malicious samples."
        ],
        avoid: [
          "Training models on biased, unrepresentative historical convenience samples.",
          "Deploying models trained on data with unverified, highly subjective label annotations.",
          "Assuming training performance will persist indefinitely without monitoring data drift."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "training-validation-and-test-split",

      why: {
        before: "Practitioners evaluated machine learning models on the exact same " +
          "data used to train them, celebrating 100% accuracy without realizing the " +
          "model had merely memorized the training samples.",
        problem: "Training performance measures pure memorization (empirical risk), " +
          "providing zero indication of real-world generalization. Furthermore, tuning " +
          "hyperparameters directly on the test set causes test-set overfitting.",
        shift: "**The Strict Three-Way Split: Train, Validation, and Test.** " +
          "Partition historical data into three completely isolated subsets: " +
          "**Train** (learn weights), **Validation** (tune hyperparameters & select models), " +
          "and **Test** (vaulted for final, unbiased real-world generalization evaluation)."
      },

      num: {
        t: "Train / Validation / Test partitions & operational disciplines",
        h: ["Partition Subset", "Typical Proportion", "Operational Purpose", "Access Rules during Development"],
        r: [
          ["**Training Set**", "**60%–80%**", "**Optimizes model parameters $\\theta$ (weights/biases)**", "**Accessed repeatedly by optimizer (backprop/trees)**"],
          ["**Validation Set**", "**10%–20%**", "**Hyperparameter tuning, feature selection, early stopping**", "**Evaluated repeatedly across model iterations**"],
          ["**Test Set**", "**10%–20%**", "**Unbiased final estimate of production generalization**", "**Vaulted; evaluated EXACTLY ONCE at project completion**"],
          ["**Out-of-Time Test Set**", "**Chronological holdout**", "**Simulates true future deployment for temporal data**", "**Strictly future time window (e.g. next month's data)**"]
        ],
        n: "The three-way split is the foundational protocol that prevents " +
          "self-deception in machine learning. Why are two splits (Train/Test) " +
          "insufficient? If a developer tests 50 different model architectures " +
          "or hyperparameter combinations against the Test set and selects " +
          "the one with the highest score, **the test set has been used to make " +
          "design decisions**. The developer has inadvertently overfitted to " +
          "the test set, destroying its ability to provide an honest, unbiased " +
          "estimate of future performance. The **Validation Set** acts as " +
          "the sacrificial buffer: it is used iteratively to select optimal " +
          "hyperparameters, trigger early stopping, and compare model families. " +
          "The **Test Set** is locked in a vault, unobserved by any tuning " +
          "decision, and evaluated exactly once prior to deployment. Splitting " +
          "methodologies must reflect data physics: **Random Splitting** is " +
          "only valid for independent cross-sectional data; **Stratified " +
          "Splitting** preserves class ratios in imbalanced classification; " +
          "**Group Splitting** prevents data leakage by ensuring all records " +
          "from a single entity (patient, customer) reside in the same partition; " +
          "and **Temporal Splitting** trains on past data to predict future " +
          "data in time-series."
      },

      miss: [
        {
          w: "A random 80/20 train/test split is appropriate for any machine learning dataset.",
          r: "Random splitting on time-series leaks future data into the past; on grouped data " +
            "(multiple medical scans per patient), it leaks patient identities across splits."
        },
        {
          w: "You can use test set performance to choose which model checkpoint to deploy.",
          r: "Using the test set to select models turns the test set into a validation set, " +
            "invalidating its ability to provide an unbiased generalization score."
        },
        {
          w: "Cross-validation eliminates the requirement for an isolated test set.",
          r: "Cross-validation replaces the validation set for tuning, but a final " +
            "vaulted test set is still mandatory to verify final real-world generalization."
        },
        {
          w: "Stratified splitting is only needed for extreme class imbalance.",
          r: "Stratified splitting is best practice for all classification tasks to guarantee " +
            "that train, validation, and test splits share identical class proportions."
        }
      ],

      trade: {
        buys: [
          "Guarantees an honest, statistically rigorous estimate of real-world production performance.",
          "Prevents subtle, devastating overfitting to test benchmarks during hyperparameter tuning.",
          "Exposes model memorization, data leakage, and training-serving skew prior to deployment.",
          "Standardizes evaluation reporting across engineering teams and regulatory audits."
        ],
        costs: [
          "Reduces the volume of data available for fitting core model parameters.",
          "Small datasets suffer high variance in test set metrics due to limited sample size.",
          "Requires strict engineering discipline and pipeline tooling to prevent accidental leakage.",
          "Complex splitting requirements for temporal, spatial, or grouped hierarchical data."
        ],
        avoid: [
          "Peeking at test set results to tune hyperparameters or select features.",
          "Applying random splits to chronological time-series data (temporal leakage).",
          "Evaluating models without an isolated, held-out test dataset."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cross-validation",

      why: {
        before: "Evaluating models relied on a single arbitrary train/validation split " +
          "(e.g. 70/30).",
        problem: "A single split is vulnerable to sample noise: an unlucky split " +
          "placing difficult edge cases into the validation set makes a great model look " +
          "terrible, while a lucky split creates false confidence. Furthermore, 30% of " +
          "valuable data is locked away and never used to fit the model.",
        shift: "**K-Fold Cross-Validation: systematic resampling where every sample is tested.** " +
          "Partition data into $K$ equal folds, iteratively training on $K-1$ folds and validating " +
          "on the remaining fold, averaging performance across all iterations to produce a robust estimate."
      },

      num: {
        t: "Cross-validation strategies across data structures",
        h: ["CV Strategy", "Partitioning Logic", "Key Invariant Enforced", "Primary Use Case"],
        r: [
          ["**Standard K-Fold**", "**Random split into $K$ equal disjoint subsets**", "**Uniform random partitioning**", "**Large, balanced, independent cross-sectional data**"],
          ["**Stratified K-Fold**", "**Splits into $K$ folds preserving class ratios**", "**Equal class distribution across all folds**", "**All classification problems (especially imbalanced)**"],
          ["**Group K-Fold**", "**Groups (e.g. Patient ID) never split across folds**", "**Zero entity overlap between train and val**", "**Multi-record entities (medical, repeated customer sessions)**"],
          ["**TimeSeriesSplit**", "**Rolling walk-forward expansion (expanding window)**", "**Strict temporal causality (past predicts future)**", "**Financial trading, demand forecasting, IoT telemetry**"],
          ["**Leave-One-Out (LOOCV)**", "**$K = N$; each sample validated individually**", "**Zero sample waste; near-zero bias**", "**Tiny scientific datasets ($N < 100$)**"]
        ],
        n: "K-Fold Cross-Validation is the gold standard resampling technique " +
          "for evaluating model generalization and tuning hyperparameters. " +
          "The dataset $\\mathcal{D}$ is partitioned into $K$ disjoint subsets " +
          "$\\{F_1, F_2, \\dots, F_K\\}$ (typically $K=5$ or $K=10$). In each " +
          "of the $K$ iterations, the model trains on $K-1$ folds and evaluates " +
          "on the held-out validation fold $F_k$, producing metric $S_k$. " +
          "The final score is reported as the mean $\\bar{S} = \\frac{1}{K}\\sum S_k$ " +
          "accompanied by the **standard deviation $\\sigma_S$**, providing " +
          "a crucial measure of model stability. In classification, **Stratified " +
          "K-Fold** is mandatory to prevent folds from receiving zero positive " +
          "minority cases. In multi-sample entities, **GroupKFold** ensures " +
          "that all rows belonging to a specific customer or patient reside " +
          "exclusively in the training fold OR validation fold, preventing " +
          "identity leakage. A critical operational rule: **Cross-validation " +
          "does not output a production model**; it outputs a performance " +
          "estimate and optimal hyperparameters. Once the best configuration " +
          "is identified via CV, the final production model is retrained on " +
          "the **entire combined training dataset**."
      },

      miss: [
        {
          w: "Cross-validation produces a single trained model that you deploy to production.",
          r: "CV trains $K$ separate temporary models purely to evaluate stability. For production, " +
            "you retrain a final model on the full training dataset using the best hyperparameters found."
        },
        {
          w: "10-fold cross-validation is always superior to 5-fold cross-validation.",
          r: "10-fold doubles training compute and increases the statistical correlation " +
            "between training folds, which can slightly increase estimate variance."
        },
        {
          w: "You can perform feature scaling or selection before running cross-validation.",
          r: "Scaling or selecting features outside the CV loop leaks validation fold information " +
            "into the training folds. Preprocessing must be wrapped inside a `Pipeline`."
        },
        {
          w: "Standard K-Fold cross-validation can be used for stock market time-series.",
          r: "Standard K-Fold trains on future data to predict the past, causing catastrophic " +
            "look-ahead leakage. Time-series requires forward rolling splits (`TimeSeriesSplit`)."
        }
      ],

      trade: {
        buys: [
          "Maximizes data efficiency: every single observation is used for both training and validation.",
          "Yields a statistically robust performance estimate with standard deviation error bounds.",
          "Detects model variance and instability across different data partitions.",
          "Mitigates the risk of drawing false conclusions from a single lucky or unlucky split."
        ],
        costs: [
          "Multiplies computational training costs by $K$ (e.g. 5x or 10x longer training time).",
          "Cannot be applied naively to temporal or grouped data without specialized splitters.",
          "Requires strict pipeline encapsulation to prevent data leakage between folds.",
          "Difficult to parallelize on massive deep learning foundation models."
        ],
        avoid: [
          "Preprocessing features (imputation, scaling, target encoding) outside the CV loop.",
          "Applying standard shuffled K-Fold to chronological time-series data.",
          "Using Leave-One-Out CV on large datasets where training $N$ models is computationally impossible."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-leakage",

      why: {
        before: "Engineers celebrated machine learning models achieving 99.9% accuracy " +
          "in research notebooks, only to deploy them to production where they collapsed " +
          "completely and generated random, worthless predictions.",
        problem: "The model had not learned the underlying physical phenomenon; it had " +
          "inadvertently been fed target information or future signals that exist in historical " +
          "database tables but are completely absent during live real-time inference.",
        shift: "**Strict enforcement of information boundaries.** Data leakage is the " +
          "accidental introduction of information about the target variable from outside " +
          "the training dataset, artificially inflating validation metrics while guaranteeing production failure."
      },

      num: {
        t: "Data leakage archetypes & detection signatures",
        h: ["Leakage Archetype", "Mechanism of Occurrence", "Real-World Example", "Prevention Strategy"],
        r: [
          ["**Target Leakage**", "**Feature contains proxy or consequence of target**", "`patient_took_antibiotics` used to predict pneumonia diagnosis", "**Causal graph audit: verify feature availability at decision time**"],
          ["**Train-Test Contamination**", "**Preprocessing fitted across entire dataset before split**", "`StandardScaler.fit()` or `SimpleImputer` run on full dataset", "**Wrap all transformations in scikit-learn `Pipeline`**"],
          ["**Temporal Look-Ahead**", "**Future information used to predict historical past**", "Using end-of-day closing price to predict intraday trades", "**Strict time-based chronological splitting**"],
          ["**Group / Identity Leakage**", "**Same entity split across train and validation sets**", "Multiple chest X-rays of same patient in train and test", "**Use `GroupKFold` or entity-level partitioning**"],
          ["**Metadata Leakage**", "**Incidental file properties correlate with class**", "Medical images from Hospital A (cancer center) vs Hospital B", "**Strip image headers, sanitize background noise**"]
        ],
        n: "Data Leakage is the most pervasive, dangerous, and insidious pathology " +
          "in applied machine learning because **it never throws an error**. " +
          "Code runs cleanly, tests pass, and validation metrics look miraculous. " +
          "Data leakage occurs in two primary forms: (1) **Target Leakage**: " +
          "when input features include data that would not be available at the " +
          "exact time of prediction. For instance, in an insurance fraud model, " +
          "including `claim_investigation_cost` leaks the target because " +
          "investigation costs are only incurred after fraud is suspected. " +
          "Similarly, in churn prediction, including `customer_support_cancellation_calls` " +
          "occurring on day 30 to predict churn on day 30 creates an artificial " +
          "telepathic shortcut. (2) **Train-Test Contamination**: when the " +
          "boundary between training and validation data is breached. If an " +
          "engineer scales features, imputes missing values with the median, " +
          "or computes target encodings across the full dataset before splitting, " +
          "the training fold absorbs statistical parameters from the validation " +
          "fold. The non-negotiable architectural remedy is **encapsulating " +
          "all feature engineering inside scikit-learn `Pipeline` objects** " +
          "that call `.fit()` strictly on training folds."
      },

      miss: [
        {
          w: "Data leakage triggers compiler warnings or runtime exceptions.",
          r: "Data leakage runs completely silently, manifesting as suspiciously perfect, " +
            "miraculous validation metrics that collapse immediately in live production."
        },
        {
          w: "A random 80/20 train/test split prevents all data leakage.",
          r: "Random splitting does not prevent target leakage, nor does it prevent " +
            "group leakage (same user in train and test) or temporal look-ahead leakage."
        },
        {
          w: "Imputing missing values with the dataset mean before splitting is harmless.",
          r: "Computing the mean on the whole dataset leaks test-set distribution parameters " +
            "into the training fold, producing falsely optimistic validation scores."
        },
        {
          w: "Data leakage only happens to inexperienced junior engineers.",
          r: "Data leakage occurs in cutting-edge research and major enterprise deployments; " +
            "detecting subtle temporal and group leakage requires rigorous architectural audits."
        }
      ],

      trade: {
        buys: [
          "Guarantees that validation performance accurately reflects real-world production capability.",
          "Prevents catastrophic, career-threatening model failures in production.",
          "Forces deep architectural audits of business timelines and data collection realities.",
          "Builds trustworthy, resilient machine learning pipelines that executives can rely on."
        ],
        costs: [
          "Lowers deceptively inflated validation scores to realistic, honest levels.",
          "Requires painstaking timeline analysis to verify when each feature is recorded.",
          "Mandates complex pipeline architectures (`scikit-learn` Pipeline, feature stores).",
          "Can require discarding high-performing features discovered to be target proxies."
        ],
        avoid: [
          "Fitting scalers, encoders, or imputers prior to train/test or cross-validation splitting.",
          "Including features collected chronologically after the prediction decision point.",
          "Deploying models with near-100% validation scores without auditing for target proxies."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "class-imbalance",

      why: {
        before: "Algorithms were trained assuming roughly balanced class proportions " +
          "(50% positive, 50% negative).",
        problem: "Real-world critical applications exhibit extreme class skew: credit " +
          "card fraud is 0.01% positive; rare disease screening is 0.1% positive; ad click " +
          "rates are 0.5%. Models trained naively on imbalanced data optimize overall accuracy " +
          "by predicting the majority class 100% of the time, achieving 99.9% accuracy while catching zero fraud.",
        shift: "**Class Imbalance Engineering: align optimization with minority class value.** " +
          "Rebalance training distributions via resampling (SMOTE, undersampling), apply " +
          "cost-sensitive loss weighting, and evaluate models using Precision-Recall curves rather than accuracy."
      },

      num: {
        t: "Class imbalance remediation strategies across the ML lifecycle",
        h: ["Remediation Level", "Technique / Algorithm", "Operational Mechanism", "Primary Advantage / Trade-off"],
        r: [
          ["**Data-Level (Oversampling)**", "**SMOTE / ADASYN**", "**Synthesizes minority samples along $k$-NN line segments**", "**Prevents information loss; can synthesize noise**"],
          ["**Data-Level (Undersampling)**", "**Random Undersampling / Tomek Links**", "**Discards majority class instances to equalize balance**", "**Massive training speedup; discards real data**"],
          ["**Algorithm-Level (Cost-Sensitive)**", "**`class_weight='balanced'`**", "**Penalizes minority errors inversely to class frequency**", "**Zero synthetic data; shifts loss gradient**"],
          ["**Algorithm-Level (Focal Loss)**", "**Focal Loss: $-\\alpha_t (1 - p_t)^\\gamma \\log(p_t)$**", "**Down-weights well-classified easy negative examples**", "**State-of-the-art in dense object detection & extreme skew**"],
          ["**Decision-Level (Thresholding)**", "**Threshold Tuning (Moving $\\tau$)**", "**Lowers decision cutoff from $0.5$ to $0.05$ or $0.01$**", "**Directly optimizes business ROI without retraining**"]
        ],
        n: "Class Imbalance is a fundamental reality of high-stakes machine " +
          "learning. In standard Empirical Risk Minimization, the objective " +
          "loss is averaged uniformly over all $N$ training instances: " +
          "$\\mathcal{L} = \\frac{1}{N}\\sum_{i=1}^N \\ell(f(x_i), y_i)$. " +
          "When the positive minority class represents only $0.1\\%$ of " +
          "data, a trivial classifier that predicts $y = 0$ universally " +
          "achieves an astonishing **99.9% accuracy**, despite being completely " +
          "worthless. To overcome this, engineers operate across three " +
          "dimensions: (1) **Data Resampling**: **Random Undersampling** " +
          "reduces majority instances, while **SMOTE (Synthetic Minority " +
          "Over-sampling Technique)** generates synthetic minority points by " +
          "interpolating between existing minority neighbors in feature space " +
          "(crucially, SMOTE must run **strictly on the training fold** to " +
          "prevent leakage). (2) **Algorithmic Cost Weighting**: scaling " +
          "the loss function by class weights $w_k = \\frac{N}{K \\cdot N_k}$, " +
          "forcing gradient descent to penalize minority misclassifications " +
          "hundreds of times more heavily than majority misclassifications. " +
          "(3) **Metric & Threshold Realignment**: completely abandoning " +
          "accuracy in favor of **Precision, Recall, F1-Score, and Precision-Recall " +
          "Curves (PR-AUC)**, tuning the operating decision threshold $\\tau$ " +
          "to maximize business utility."
      },

      miss: [
        {
          w: "Accuracy is an acceptable metric for evaluating imbalanced classification.",
          r: "Accuracy is completely deceptive under class imbalance. A fraud model " +
            "with 99.9% accuracy can fail to catch a single fraudulent transaction."
        },
        {
          w: "SMOTE should be applied to the entire dataset before train/test splitting.",
          r: "Applying SMOTE before splitting synthesizes points that bridge across the " +
            "train-test boundary, causing catastrophic data leakage and invalidating test scores."
        },
        {
          w: "Resampling must always force an exact 50/50 class balance.",
          r: "Artificially forcing 50/50 balance on 1:1,000 data heavily warps predicted " +
            "posterior probabilities, requiring complex post-hoc probability calibration."
        },
        {
          w: "Undersampling the majority class is always a bad idea.",
          r: "On massive datasets with 100 million majority rows, undersampling majority " +
            "samples slashes training time by 90% while preserving virtually identical predictive signal."
        }
      ],

      trade: {
        buys: [
          "Enables models to successfully detect rare, catastrophic, high-value minority events.",
          "Directly aligns optimization loss functions with real-world financial cost asymmetries.",
          "Threshold moving allows dynamic business tuning between false positives and false negatives.",
          "Precision-Recall curves provide transparent visibility into model trade-offs."
        ],
        costs: [
          "Oversampling increases training time and memory footprint.",
          "Synthetic data generators (SMOTE) can introduce artificial noise in overlapping boundary regions.",
          "Undersampling permanently discards potentially valuable majority class information.",
          "Distorts predicted probabilities, requiring calibration if raw probabilities are needed."
        ],
        avoid: [
          "Evaluating imbalanced models using raw classification accuracy.",
          "Applying SMOTE, ADASYN, or resampling to validation or test splits.",
          "Leaving classification decision thresholds fixed at 0.5 for asymmetric cost problems."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
