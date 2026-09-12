/* ==========================================================================
   Depth pass 107 — Mathematics & Statistics batch 6: Information Theory, Distance & Standard Scores.
   Statistical Power, Entropy, Information Gain, Gini Impurity,
   Euclidean Distance, Z-Score.

   Shannon surprise invariants quantify metric entropy and split criteria;
   L2 Minkowski topologies scale alongside standardized normal deviate projections.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "statistical-power",

      why: {
        before: "Scientific studies and enterprise A/B tests were launched with arbitrary sample sizes based on budget or intuition, frequently declaring 'no significant effect' simply because the test was too small to detect real shifts.",
        problem: "Underpowered experiments suffer from high Type II error rates ($\\beta$), causing teams to discard winning features, abandon viable drug candidates, and fall victim to the 'winner's curse' where detected effects are massively exaggerated.",
        shift: "**Statistical Power ($1 - \\beta$): The probability that a hypothesis test will correctly reject a false null hypothesis when an actual effect of a given magnitude exists.** Prospective power analysis formally sizes samples upfront based on significance level ($\\alpha$), minimum detectable effect (MDE), and baseline variance."
      },

      num: {
        t: "Statistical Power Trade-offs: Sample Size, Effect Size & Error Rates",
        h: ["Parameter", "Mathematical Role", "Impact on Power ($1 - \\beta$)", "Sample Size Scaling", "Production A/B Example"],
        r: [
          ["Alpha Level ($\\alpha$)", "Type I error rate (false positive threshold)", "Lower $\\alpha$ (e.g., 0.01 vs 0.05) reduces statistical power", "Decreasing $\\alpha$ requires larger sample size $N$", "Bonferroni multi-armed testing requires $2\\times$ traffic"],
          ["Effect Size ($\\delta$ or Cohen's $d$)", "Magnitude of difference between variants: $(\\mu_B - \\mu_A)/\\sigma$", "Smaller effects drastically reduce power", "Sample size scales quadratically: $N \\propto 1/\\delta^2$", "Detecting $+0.5\\%$ checkout lift requires $16\\times$ traffic vs $+2\\%$"],
          ["Sample Size ($N$)", "Total observation count per treatment arm", "Larger sample size increases power toward $1.0$", "Governed by $N = 2 \\left( \\frac{z_{1-\\alpha/2} + z_{1-\\beta}}{\\delta} \\right)^2$", "Scaling from $N=5{,}000$ to $N=20{,}000$ boosts power $0.50 \\to 0.88$"],
          ["Variance ($\\sigma^2$)", "Dispersion of the target metric (e.g., revenue)", "High metric noise reduces effective signal-to-noise ratio", "Variance reduction (CUPED) shrinks required $N$ by $30\\text{--}50\\%$", "High-variance purchase carts require pre-experiment covariate adjustment"],
          ["Target Power ($1 - \\beta$)", "Probability of true discovery (standard: 0.80 or 0.90)", "Higher power demands wider non-overlapping distributions", "Increasing power from $0.80$ to $0.95$ requires $+75\\%$ sample size", "Mission-critical medical clinical trials mandate $1 - \\beta = 0.90$"]
        ],
        n: "Statistical power is defined mathematically as $P(\\text{Reject } H_0 \\mid H_1 \\text{ is true}) = 1 - \\beta$. For a two-sample $z$-test comparing means with equal variance $\\sigma^2$, the required sample size per variant is given by $n = \\frac{2(z_{1-\\alpha/2} + z_{1-\\beta})^2 \\sigma^2}{(\\mu_B - \\mu_A)^2}$. When an experiment is underpowered (e.g., power $= 0.20$), an observed statistically significant result ($p < 0.05$) is prone to **Type M (Magnitude)** and **Type S (Sign)** errors. The 'Winner's Curse' dictates that when power is low, an effect must be abnormally large or inflated by random noise to cross the significance threshold, leading to massive overestimation of production impact."
      },

      miss: [
        {
          w: "A non-significant result ($p > 0.05$) proves that the two treatments have identical performance.",
          r: "Absence of evidence is not evidence of absence. If an experiment has only $30\\%$ statistical power, there is a $70\\%$ chance of failing to detect a real, meaningful difference. In underpowered experiments, failing to reject $H_0$ conveys virtually zero scientific or business information."
        },
        {
          w: "Post-hoc (retrospective) power calculated from the observed $p$-value tells you if your test had enough power.",
          r: "Retrospective power is a direct mathematical transformation of the $p$-value and provides zero new information. Calculating power after an experiment using the observed effect size is known as the **post-hoc power fallacy** and is roundly condemned by mathematical statisticians."
        },
        {
          w: "Statistical power only matters before the experiment starts, not during analysis.",
          r: "Power determines the reliability of positive results. By Bayes' theorem, the False Discovery Rate (FDR) depends on prior probability and statistical power: $\\text{FDR} = \\frac{\\alpha (1 - \\pi)}{\\alpha (1 - \\pi) + (1 - \\beta) \\pi}$. Low power directly pollutes your pool of 'significant' findings with false positives."
        },
        {
          w: "Increasing sample size is the only way to increase statistical power.",
          r: "Power can also be increased by reducing metric variance through covariate adjustment (CUPED), pairing/blocking observations, choosing more sensitive surrogate metrics, or testing stronger, higher-leverage interventions."
        }
      ],

      trade: {
        buys: [
          "Pre-experiment certainty: guarantees a known probability (e.g., 80% or 90%) of detecting business-critical KPI improvements.",
          "Protects against the Winner's Curse: ensures reported effect sizes reflect true underlying reality rather than noise spikes.",
          "Determines exact experiment duration: prevents running tests too short (underpowered) or too long (wasted traffic and opportunity cost).",
          "Calculates Minimum Detectable Effect (MDE): grounds product teams in the limits of what their traffic can realistically resolve."
        ],
        costs: [
          "Traffic commitment: detecting small, incremental gains ($<1\\%$ lift) demands massive user samples scaling inversely with $\\delta^2$.",
          "Time-to-insight delay: high power requirements often force multi-week run times across slow conversion cycles.",
          "Requires upfront estimates: accurate power calculation requires reliable prior knowledge of metric baseline variance $\\sigma^2$.",
          "Multiple testing penalty: testing multiple metrics or variants splits power unless corrected with larger sample allocations."
        ],
        avoid: [
          "Never run an enterprise A/B test without an upfront prospective power calculation defining required sample size and MDE.",
          "Do not interpret $p > 0.05$ as 'feature has zero impact' without verifying whether the test had sufficient statistical power.",
          "Avoid computing post-hoc power on observed effects; calculate prospective power using the minimum meaningful business effect.",
          "Never peek at ongoing experiment data continuously without formal alpha-spending functions, as peeking destroys statistical power and inflates false positive rates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "entropy",

      why: {
        before: "Engineers and physicists had no unified mathematical formalism to quantify the amount of uncertainty, surprise, or information contained in an arbitrary probability distribution or communication channel.",
        problem: "Machine learning algorithms and compression codecs require an objective, differentiable metric to evaluate class purity, optimize transmission bandwidth, and quantify predictive ambiguity.",
        shift: "**Shannon Entropy: The expected value of the information (self-information or surprise) conveyed by a random variable.** Grounded in Claude Shannon's 1948 landmark theorem, $H(X) = -\\sum p(x) \\log_2 p(x)$, entropy establishes the theoretical limit for lossless data compression and serves as the mathematical foundation for cross-entropy loss and decision trees."
      },

      num: {
        t: "Entropy Metrics: Information Measures across Probability Distributions",
        h: ["Entropy Formulation", "Mathematical Expression", "Base / Unit", "Properties & Extreme Values", "Machine Learning / Systems Role"],
        r: [
          ["Shannon Entropy $H(X)$", "$-\\sum_{x} P(x) \\log_2 P(x)$", "Bits (Shannon)", "Min $= 0$ (deterministic); Max $= \\log_2 K$ (uniform)", "Information bottleneck; decision tree split purity"],
          ["Differential Entropy $h(X)$", "$-\\int p(x) \\ln p(x) \\, dx$", "Nats", "Can be negative ($-\\infty$); max for Gaussian", "Continuous probability; variational inference (VAE)"],
          ["Cross-Entropy $H(P, Q)$", "$-\\sum_{x} P(x) \\log Q(x)$", "Nats or Bits", "$H(P, Q) = H(P) + D_{\\text{KL}}(P \\parallel Q)$", "Canonical loss function for neural network classification"],
          ["Kullback-Leibler Divergence", "$\\sum_{x} P(x) \\log \\frac{P(x)}{Q(x)}$", "Nats or Bits", "$D_{\\text{KL}} \\ge 0$; asymmetric distance between distributions", "RLHF policy divergence; knowledge distillation loss"],
          ["Joint Entropy $H(X, Y)$", "$-\\sum_{x,y} P(x,y) \\log P(x,y)$", "Bits", "$H(X, Y) \\le H(X) + H(Y)$ with equality iff independent", "Multivariate feature dependency analysis"]
        ],
        n: "The information content (surprise) of an event $x$ is defined as $I(x) = -\\log_2 P(x)$. An event with probability $1$ carries $0$ bits of surprise, while an event with probability $0.001$ carries $\\approx 9.97$ bits. Shannon Entropy $H(X) = \\mathbb{E}[I(X)] = -\\sum_{x \\in \\mathcal{X}} P(x) \\log_2 P(x)$ represents the average number of binary yes/no questions needed to identify a random draw from the distribution. For a discrete variable with $K$ states, entropy achieves its global minimum $H=0$ when one state has probability $1$ (absolute certainty) and reaches its maximum $H = \\log_2 K$ when all states are equally likely (maximum uncertainty). In deep learning, cross-entropy loss minimizes the divergence between the empirical label distribution and the model's predicted softmax distribution."
      },

      num_math: {
        formula: "H(X) = -\\sum_{i=1}^n P(x_i) \\log_2 P(x_i)"
      },

      miss: [
        {
          w: "Entropy measures the physical disorder of a computer system or software codebase.",
          r: "In computer science and machine learning, **Shannon entropy** is an exact probabilistic measure of information uncertainty and surprise, not physical thermodynamic disorder. While mathematically isomorphic to Boltzmann's entropy ($S = k_B \\ln \\Omega$), information entropy operates strictly over discrete or continuous probability distributions."
        },
        {
          w: "A model with low prediction entropy is always accurate.",
          r: "Entropy measures **confidence**, not correctness. A deeply overfitted or miscalibrated neural network can output a probability of $0.999$ for an entirely incorrect class, yielding near-zero entropy while being completely wrong (overconfident misclassification)."
        },
        {
          w: "Continuous differential entropy cannot be negative.",
          r: "Unlike discrete Shannon entropy which is strictly non-negative ($H(X) \\ge 0$), **differential entropy** $h(X) = -\\int f(x) \\ln f(x) dx$ for continuous random variables can become negative (e.g., a uniform distribution on $[0, 0.5]$ has $h(X) = \\ln(0.5) < 0$)."
        },
        {
          w: "Entropy can only be computed using base 2 logarithms.",
          r: "The choice of logarithmic base merely defines the unit of information: base 2 yields **bits** (or shannons), base $e$ yields **nats** (common in deep learning calculus), and base 10 yields **hartleys** (or bans)."
        }
      ],

      trade: {
        buys: [
          "Universal information metric: establishes the provable lower bound for data compression (Shannon's Source Coding Theorem).",
          "Differentiable objective: powers categorical cross-entropy loss, enabling gradient-based optimization in modern deep learning.",
          "Optimal splitting criterion: guides decision trees (ID3, C4.5) toward nodes with maximum reduction in class uncertainty.",
          "Quantifies model uncertainty: tracks predictive ambiguity in active learning, out-of-distribution detection, and Bayesian neural nets."
        ],
        costs: [
          "Computationally expensive: requires logarithmic calculations across all classes for every prediction step.",
          "Sensitive to tail probabilities: extremely small probabilities $P(x) \\to 0$ require numerical stabilization (clipping or log-sum-exp) to avoid $\\text{NaN}$.",
          "Insensitive to semantic distances: treating labels as orthogonal categorical states ignores whether errors are minor or catastrophic.",
          "Overfitting risk: raw entropy minimization in decision trees without pruning leads to pure, over-fragmented leaf partitions."
        ],
        avoid: [
          "Never calculate $\\sum p \\log p$ without handling $p = 0$ edge cases; use $p \\log(p + \\epsilon)$ or dedicated `torch.nn.CrossEntropyLoss`.",
          "Do not confuse Shannon entropy (bits of surprise) with cross-entropy (bits needed using an approximate model distribution).",
          "Avoid using raw entropy as a sole proxy for model calibration without verifying reliability diagrams or Brier scores.",
          "Never evaluate continuous distributions with discrete entropy formulas; apply differential entropy or discretization binning."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "information-gain",

      why: {
        before: "Early rule-based decision trees split data using ad-hoc heuristics or arbitrary threshold guesses, leading to combinatorially exploding, inefficient, and deep trees that generalized poorly.",
        problem: "Algorithms need a mathematically principled, greedy criterion at each tree node to select the single feature split that produces the cleanest, most informative child partitions.",
        shift: "**Information Gain: The expected reduction in entropy of a target variable resulting from partitioning a dataset on a given attribute.** Popularized by Ross Quinlan in the ID3 decision tree algorithm, Information Gain $IG(T, a) = H(T) - H(T \\mid a)$ quantifies the mutual information $I(T; a)$ between feature and target."
      },

      num: {
        t: "Decision Tree Splitting Metrics: Information Gain vs Gain Ratio vs Gini",
        h: ["Metric", "Mathematical Formula", "Logarithmic Compute", "Bias Toward High-Cardinality", "Primary Algorithm Usage"],
        r: [
          ["Information Gain", "$H(D) - \\sum_{v} \\frac{|D_v|}{|D|} H(D_v)$", "High (base 2 log per class)", "Severe (favors IDs, timestamps, distinct values)", "ID3 (Quinlan 1986)"],
          ["Gain Ratio", "$\\frac{IG(D, A)}{\\text{SplitInfo}_A(D)}$", "Highest (normalized by split entropy)", "Low (penalizes excessive partition branching)", "C4.5 (Quinlan 1993)"],
          ["Gini Impurity Reduction", "$G(D) - \\sum_{v} \\frac{|D_v|}{|D|} G(D_v)$", "Zero (arithmetic sum of squares)", "Moderate (mitigated by binary-only splits)", "CART (Breiman 1984), Scikit-Learn"],
          ["Variance Reduction", "$\\sigma^2(D) - \\sum_{v} \\frac{|D_v|}{|D|} \\sigma^2(D_v)$", "Zero (mean squared error)", "Low (governed by continuous variance)", "Regression Trees (CART, XGBoost, LightGBM)"],
          ["Mutual Information", "$I(X; Y) = \\sum_{x,y} p(x,y) \\log \\frac{p(x,y)}{p(x)p(y)}$", "High (joint and marginal logs)", "High if continuous variables unbinned", "Feature selection filter methods"]
        ],
        n: "Information Gain represents the **Mutual Information** $I(Y; X) = H(Y) - H(Y \\mid X)$ between the target class $Y$ and the feature $X$. Given dataset $D$ with Shannon entropy $H(D) = -\\sum_{i=1}^C p_i \\log_2 p_i$, splitting on attribute $A$ with $V$ distinct values partitions $D$ into subsets $\\{D_1, \\dots, D_V\\}$. The remaining conditional entropy is $H(D \\mid A) = \\sum_{v=1}^V \\frac{|D_v|}{|D|} H(D_v)$. The Information Gain is $IG(D, A) = H(D) - H(D \\mid A)$. Because $IG$ increases monotonically with the number of partition bins, splitting on unique identifiers (e.g., Customer ID) yields $H(D \\mid A) = 0$ and maximizes $IG$, while providing zero generalization power. Quinlan's C4.5 solved this by introducing **Gain Ratio**, which divides $IG$ by the intrinsic split information $\\text{SplitInfo}_A(D) = -\\sum_{v=1}^V \\frac{|D_v|}{|D|} \\log_2 \\frac{|D_v|}{|D|}$."
      },

      miss: [
        {
          w: "Information Gain and Gini Impurity produce completely different decision trees in practice.",
          r: "Empirical studies (Raileanu & Stoffel, 2004) demonstrate that Information Gain and Gini Impurity agree on the optimal split feature over $98\\%$ of the time. The choice of metric rarely affects model accuracy; Gini is preferred in production frameworks (like Scikit-Learn) purely because avoiding logarithms provides a $20\\text{--}30\\%$ training speedup."
        },
        {
          w: "Information Gain can be directly applied to continuous features without modification.",
          r: "Continuous features have infinite possible split points. To compute Information Gain, continuous features must first be sorted and discretized into binary candidate thresholds $t$, evaluating $IG$ across the midpoint of adjacent distinct values."
        },
        {
          w: "Maximizing Information Gain always creates the best machine learning model.",
          r: "Pure Information Gain has an inherent pathological bias toward features with many distinct levels (high cardinality). A feature like Social Security Number yields perfect Information Gain (entropy goes to 0) but causes immediate overfitting and catastrophic test failure."
        },
        {
          w: "Information Gain can never be zero or negative.",
          r: "By Shannon's conditioning theorem, conditioning cannot increase entropy on average ($H(Y \\mid X) \\le H(Y)$), meaning Information Gain is strictly non-negative ($IG \\ge 0$). It equals zero if and only if $X$ and $Y$ are statistically independent."
        }
      ],

      trade: {
        buys: [
          "Theoretically optimal greedy splits: maximizes statistical information extraction from features at each decision step.",
          "Intuitive interpretability: allows data scientists to quantify exactly how many bits of uncertainty each feature eliminates.",
          "Direct bridge to information theory: shares unified foundations with Shannon entropy, mutual information, and Kullback-Leibler divergence.",
          "Effective feature selection: functions as a high-speed filter method for ranking top predictors prior to model training."
        ],
        costs: [
          "Logarithmic compute penalty: requires evaluating $\\log_2$ operations across candidate thresholds, slowing training on massive datasets.",
          "High-cardinality vulnerability: unchecked Information Gain favors features with many categories over binary indicators.",
          "Greedy horizon blindness: myopic step-by-step split selection fails to capture complex XOR-style multi-feature interactions.",
          "Data-hungry probability estimates: requires adequate sample size in every partitioned child bucket to estimate probabilities reliably."
        ],
        avoid: [
          "Never use unnormalized Information Gain on high-cardinality categorical features (e.g., ZIP codes, user IDs); use Gain Ratio or target encoding.",
          "Do not evaluate Information Gain on continuous variables without sorting and candidate deduplication to avoid $O(N^2)$ bottlenecks.",
          "Avoid growing unpruned trees using Information Gain alone; set `min_samples_leaf` or `max_depth` to stop noise splitting.",
          "Never confuse Mutual Information feature selection with model feature importance; linear correlations can mislead non-linear tree gain."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gini-impurity",

      why: {
        before: "Information theory-based decision trees required heavy transcendental functions ($\\log_2$), creating massive computational bottlenecks during iterative tree construction over large enterprise datasets.",
        problem: "Machine learning libraries need a computationally lightweight, non-logarithmic metric that quantifies misclassification probability to evaluate split quality across millions of candidate thresholds in real time.",
        shift: "**Gini Impurity: A computationally efficient measure of how often a randomly chosen element from a dataset would be incorrectly labeled if it were randomly labeled according to the distribution of labels in the subset.** Introduced by Leo Breiman et al. (1984) in the CART algorithm, $I_G(p) = 1 - \\sum_{i=1}^J p_i^2$ operates purely on floating-point multiplications and subtractions."
      },

      num: {
        t: "Gini Impurity vs Shannon Entropy: Algorithmic & Mathematical Comparison",
        h: ["Dimension", "Gini Impurity ($I_G$)", "Entropy ($H$ / 2)", "Operational Consequence", "Engineering Trade-off"],
        r: [
          ["Formula (Binary)", "$2p(1-p)$", "$-\\frac{1}{2}(p \\log_2 p + (1-p) \\log_2(1-p))$", "Gini is first-order Taylor approximation of entropy", "Avoids transcendental CPU/GPU instructions"],
          ["Maximum Impurity (Binary)", "$0.50$ (at $p=0.5$)", "$1.00$ bit (at $p=0.5$)", "Both achieve maximum at uniform distribution", "Gini curves are slightly flatter near extremes"],
          ["Computational Cost", "Low: $O(K)$ arithmetic multiplies and adds", "High: $O(K)$ logarithmic transcendental operations", "CART builds $20\\text{--}40\\%$ faster than C4.5/ID3", "Massive speedup across ensembles (Random Forests)"],
          ["Multiclass Scaling ($K$)", "$1 - \\sum_{i=1}^K p_i^2$", "$-\\sum_{i=1}^K p_i \\log_2 p_i$", "Gini approaches $1 - 1/K$ for uniform distributions", "Both reward single-class pure leaf nodes ($I_G=0$)"],
          ["Primary Implementation", "Scikit-Learn `DecisionTreeClassifier(criterion='gini')`", "Scikit-Learn `criterion='entropy'` / LightGBM", "Default standard across modern ML toolkits", "Default criterion across almost all production libraries"]
        ],
        n: "Gini Impurity measures the probability of misclassifying a randomly selected observation under a random label drawn from the empirical distribution. If class $i$ has probability $p_i$, the probability of choosing class $i$ and then mislabeling it is $p_i(1 - p_i)$. Summing over all $J$ classes yields $I_G(p) = \\sum_{i=1}^J p_i(1 - p_i) = \\sum p_i - \\sum p_i^2 = 1 - \\sum_{i=1}^J p_i^2$. For a perfectly pure node where $p_1 = 1$, $I_G = 1 - 1^2 = 0$. For a binary classification with equal balance ($p_1 = 0.5, p_2 = 0.5$), $I_G = 1 - (0.25 + 0.25) = 0.5$. Because $\\ln(x) \\approx x - 1$, the first-order Taylor expansion of Shannon entropy directly produces the Gini index: $H(p) = -\\sum p_i \\ln p_i \\approx -\\sum p_i (p_i - 1) = 1 - \\sum p_i^2 = I_G(p)$."
      },

      miss: [
        {
          w: "Gini Impurity in machine learning is the same thing as the Gini Coefficient in economics.",
          r: "They are related conceptually to Corrado Gini's work, but mathematically distinct. The **Gini Coefficient** in economics measures income inequality via the area under the Lorenz Curve (scale $0$ to $1$). **Gini Impurity** in ML measures the probability of categorical misclassification ($1 - \\sum p_i^2$, max $0.5$ for binary classification)."
        },
        {
          w: "Entropy produces significantly more accurate decision trees than Gini Impurity.",
          r: "Extensive benchmarking shows that Gini and Entropy produce virtually identical decision tree architectures in over $98\\%$ of splits. Neither metric is fundamentally 'more accurate'; Gini is chosen because avoiding logarithm computations yields substantial training throughput gains."
        },
        {
          w: "A Gini Impurity of 0.5 means the model is $50\\%$ accurate.",
          r: "Gini Impurity measures **node class mixture**, not model validation accuracy. A binary split node with Gini $= 0.5$ indicates a $50/50$ uniform distribution of classes (maximum disorder), meaning the node currently has zero discriminative power."
        },
        {
          w: "Gini Impurity can be directly calculated on continuous regression targets.",
          r: "Gini Impurity is strictly defined for discrete categorical targets. For regression trees, the equivalent split criterion is **Mean Squared Error (MSE)** or variance reduction ($\\sum (y_i - \\bar{y})^2$)."
        }
      ],

      trade: {
        buys: [
          "High-speed training: relies entirely on vector addition and multiplication without expensive transcendentals ($\log$).",
          "Bounded mathematical domain: bounded strictly in $[0, 1 - 1/K]$, facilitating stable numerical comparisons.",
          "Favors dominant pure classes: strongly pushes tree building toward isolating the largest homogeneous classes into pure leaves.",
          "Universal ecosystem support: serves as the battle-tested default criterion in Scikit-Learn, Spark MLlib, and XGBoost."
        ],
        costs: [
          "Sensitive to class imbalance: struggles to isolate extremely rare minority classes when overwhelmed by a massive majority class.",
          "Greedy split vulnerability: like entropy, myopic single-feature thresholding cannot detect XOR interactions without deep branching.",
          "Continuous feature sorting cost: requires pre-sorting continuous feature values ($O(N \\log N)$) to evaluate candidate thresholds.",
          "Overfitting without regularization: unconstrained minimization drives leaf impurities to 0 by memorizing training instances."
        ],
        avoid: [
          "Never run tree induction on raw unpruned trees; always enforce stopping criteria like `max_depth` or `min_impurity_decrease`.",
          "Do not spend engineering time fine-tuning between Gini and Entropy; focus on feature engineering and ensemble regularization instead.",
          "Avoid computing Gini across millions of unique floating-point split points; use histogram binning (as in LightGBM/XGBoost).",
          "Never confuse Gini Impurity with the economic Gini Coefficient when communicating metrics to non-technical stakeholders."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "euclidean-distance",

      why: {
        before: "Algorithms struggled to mathematically quantify spatial proximity, similarity, or geometric separation between multidimensional observations in continuous real-valued vector spaces.",
        problem: "Clustering (K-Means), nearest-neighbor classification (KNN), and embedding retrieval systems require an intuitive, rotationally invariant metric that models physical straight-line distance.",
        shift: "**Euclidean Distance: The straight-line length of the line segment connecting two points in Cartesian coordinate space.** Defined by the $L_2$ vector norm, $d(\\mathbf{p}, \\mathbf{q}) = \\|\\mathbf{p} - \\mathbf{q}\\|_2 = \\sqrt{\\sum_{i=1}^n (p_i - q_i)^2}$, it constitutes the canonical metric of classical geometry and vector space modeling."
      },

      num: {
        t: "Vector Distance Metrics: Geometric Properties & Dimensional Behavior",
        h: ["Distance Metric", "Mathematical Formulation", "Geometric Meaning", "High-Dimensional Behavior", "Optimal Machine Learning Use Case"],
        r: [
          ["Euclidean ($L_2$)", "$\\sqrt{\\sum_{i=1}^n (x_i - y_i)^2}$", "Straight-line 'as the crow flies' distance", "Suffers severe distance concentration as $n \\to \\infty$", "K-Means clustering; low-to-medium dimensional spatial data"],
          ["Manhattan ($L_1$)", "$\\sum_{i=1}^n |x_i - y_i|$", "Grid / city-block navigation path", "More robust to outliers and moderate dimensionality", "High-dimensional sparse text vectors; Lasso regularization"],
          ["Cosine Distance", "$1 - \\frac{\\mathbf{x} \\cdot \\mathbf{y}}{\\|\\mathbf{x}\\| \\|\\mathbf{y}\\|}$", "Angular deviation independent of vector magnitude", "Invariant to vector scale/magnitude", "Dense vector embeddings (LLMs, CLIP, Sentence Transformers)"],
          ["Mahalanobis", "$\\sqrt{(\\mathbf{x}-\\mathbf{y})^T \\mathbf{\\Sigma}^{-1} (\\mathbf{x}-\\mathbf{y})}$", "Distance normalized by covariance matrix $\\mathbf{\\Sigma}$", "Scale-invariant and correlation-aware", "Multivariate outlier detection; Gaussian mixture models"],
          ["Chebyshev ($L_\\infty$)", "$\\max_i |x_i - y_i|$", "Maximum single coordinate difference (chessboard king)", "Dominated entirely by the single worst feature dimension", "Warehouse robot routing; minimax logistics optimization"]
        ],
        n: "Euclidean distance is the $L_2$ instance of the generalized **Minkowski metric** $D_p(\\mathbf{x}, \\mathbf{y}) = \\left( \\sum_{i=1}^n |x_i - y_i|^p \\right)^{1/p}$. In Euclidean spaces, it satisfies all formal mathematical metric axioms: non-negativity ($d(x,y) \\ge 0$), identity of indiscernibles ($d(x,y)=0 \\iff x=y$), symmetry ($d(x,y) = d(y,x)$), and the triangle inequality ($d(x,z) \\le d(x,y) + d(y,z)$). However, in high-dimensional machine learning ($n > 100$), Euclidean distance suffers from the **Curse of Dimensionality** (Beyer et al., 1999): as $n \\to \\infty$, the relative difference between the distance to the nearest neighbor and the farthest neighbor approaches zero: $\\lim_{n \\to \\infty} \\frac{D_{\\max} - D_{\\min}}{D_{\\min}} = 0$, rendering un-normalized Euclidean distance ineffective for dense nearest-neighbor searches."
      },

      miss: [
        {
          w: "Euclidean distance is scale-invariant and can be computed directly on raw tabular data.",
          r: "Euclidean distance is **hyper-sensitive to feature scales**. If one feature is 'Salary' (range 20,000 to 200,000) and another is 'Age' (range 18 to 80), the salary feature will dominate $99.99\\%$ of the squared distance calculation. Features MUST be standardized (Z-score) or MinMax scaled before computing Euclidean distance."
        },
        {
          w: "Cosine similarity and Euclidean distance measure completely unrelated geometric properties.",
          r: "When vectors are normalized to unit length ($\\|\\mathbf{x}\\|_2 = 1$), Euclidean distance is monotonically related to cosine similarity: $\\|\\mathbf{x} - \\mathbf{y}\\|_2^2 = \\|\\mathbf{x}\\|^2 + \\|\\mathbf{y}\\|^2 - 2(\\mathbf{x} \\cdot \\mathbf{y}) = 2 - 2 \\cos(\\theta)$. Ranking items by Euclidean distance on normalized vectors yields the exact same ordering as cosine similarity."
        },
        {
          w: "Euclidean distance works well on high-dimensional text or word embedding spaces.",
          r: "In high-dimensional spaces (e.g., 1536-dimensional OpenAI embeddings), document length or token frequency artificially stretches vector lengths. **Cosine similarity** or normalized inner product is preferred because it isolates directional semantics from vector magnitude."
        },
        {
          w: "Euclidean distance can be used natively on categorical or nominal data.",
          r: "Euclidean distance assumes a continuous metric space with an ordered geometry. Calculating the Euclidean distance between categorical variables (e.g., `Country = France` vs `Country = Japan`) is meaningless without embedding them into a metric latent space."
        }
      ],

      trade: {
        buys: [
          "True rotational invariance: distance between points remains perfectly unchanged under rigid spatial rotations and translations.",
          "Direct geometric intuition: maps seamlessly to human perception of physical spatial proximity and shortest-path navigation.",
          "Convex and differentiable: possesses smooth gradients almost everywhere, enabling gradient-based optimization and stress minimization.",
          "Foundational algorithm anchor: serves as the mathematical engine for K-Means, standard KNN, Voronoi diagrams, and PCA projections."
        ],
        costs: [
          "Scale sensitivity: completely distorted by unnormalized features with divergent numerical ranges and units.",
          "Curse of Dimensionality: high-dimensional distance concentration causes all data points to become equidistant.",
          "Square root computation cost: evaluating $\\sqrt{\\cdot}$ is slow in high-throughput loops (mitigated by comparing squared Euclidean distance).",
          "High sensitivity to outliers: squaring coordinate deviations $(x_i - y_i)^2$ disproportionately penalizes large single-feature errors."
        ],
        avoid: [
          "Never calculate Euclidean distance without first standardizing features using `StandardScaler` or `MinMaxScaler`.",
          "Do not compute square roots when only comparing or sorting distances; use Squared Euclidean Distance $\\sum (x_i - y_i)^2$ to save CPU cycles.",
          "Avoid using raw Euclidean distance in high-dimensional sparse spaces (e.g., TF-IDF); use Cosine or Jaccard distance instead.",
          "Never use Euclidean distance on correlated tabular features without considering Mahalanobis distance to decorrelate variance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "z-score",

      why: {
        before: "Engineers and researchers could not directly compare measurements taken across different scales, units, or distributions (e.g., comparing an SAT score of 1450 to an ACT score of 32, or latency in milliseconds to CPU usage in percent).",
        problem: "Machine learning algorithms with distance metrics or gradient descent diverge or assign arbitrary importance to features with physically large numbers (revenue) over small ones (click-through rates).",
        shift: "**Z-Score (Standard Score): A dimensionless measure that quantifies the exact number of standard deviations an observation lies above or below the population or sample mean.** Defined as $z = \\frac{x - \\mu}{\\sigma}$, standardizing transforms any distribution into a zero-centered metric with unit variance ($\\{\\mu=0, \\sigma=1\\}$)."
      },

      num: {
        t: "Z-Score Scale Invariance & Outlier Thresholding Properties",
        h: ["Z-Score ($z$)", "Percentile (Standard Normal)", "Two-Tailed Rejection ($p$)", "Empirical Rule Coverage", "Production Pipeline Action"],
        r: [
          ["$0.00$", "$50.00\\%$", "$p = 1.000$", "Center of mass ($\mu$)", "Baseline mean value; zero adjustment"],
          ["$\\pm 1.00$", "$15.87\\% \\text{ / } 84.13\\%$", "$p = 0.3173$", "$68.27\\%$ of normal data within $\\pm 1\\sigma$", "Standard operational variation boundary"],
          ["$\\pm 1.96$", "$2.50\\% \\text{ / } 97.50\\%$", "$p = 0.0500$", "$95.00\\%$ of normal data within $\\pm 1.96\\sigma$", "Standard $\\alpha=0.05$ hypothesis testing critical value"],
          ["$\\pm 2.58$", "$0.49\\% \\text{ / } 99.51\\%$", "$p = 0.0100$", "$99.00\\%$ of normal data within $\\pm 2.58\\sigma$", "Conservative $\\alpha=0.01$ critical value"],
          ["$\\pm 3.00$", "$0.13\\% \\text{ / } 99.87\\%$", "$p = 0.0027$", "$99.73\\%$ of normal data within $\\pm 3\\sigma$", "Traditional 3-sigma statistical outlier threshold"],
          ["$\\pm 6.00$", "$9.86 \\times 10^{-10}$", "$p \\approx 2 \\times 10^{-9}$", "$99.9999998\\%$ defect-free", "Motorola Six Sigma manufacturing quality standard"]
        ],
        n: "The Z-Score converts raw observation $x$ into dimensionless standard deviation units via the linear affine transformation $z = \\frac{x - \\mu}{\\sigma}$. In machine learning preprocessing (**StandardScaler**), sample estimates replace parameters: $z_i = \\frac{x_i - \\bar{x}}{s}$. This maps any feature distribution to $\\mathbb{E}[Z] = 0$ and $\\text{Var}(Z) = 1$. In gradient descent, this spherical conditioning transforms elongated elliptical loss surfaces into symmetric hyperspheres, preventing zig-zagging and allowing uniform, higher learning rates across all weights. However, the standard Z-score relies on sample mean $\\bar{x}$ and standard deviation $s$, which are themselves vulnerable to extreme outliers. For robust outlier detection, the **Modified Z-Score** replaces them with median and Median Absolute Deviation (MAD): $M_i = \\frac{0.6745(x_i - \\tilde{x})}{\\text{MAD}}$."
      },

      miss: [
        {
          w: "Calculating the Z-score of a skewed dataset transforms it into a normal distribution.",
          r: "A Z-score is a **linear affine transformation** ($z = ax + b$). It changes the mean to 0 and variance to 1, but **preserves the exact underlying shape, skewness, and kurtosis** of the original distribution. If the original data is log-normal, bimodal, or power-law distributed, the standardized Z-scores will remain equally log-normal, bimodal, or power-law distributed."
        },
        {
          w: "Any data point with $|z| > 3$ is guaranteed to be a bad data error that should be deleted.",
          r: "In large datasets, $|z| > 3$ is mathematically expected by pure chance ($0.27\\%$ of a standard normal distribution, or 2,700 points per million). Furthermore, in heavy-tailed distributions (e.g., financial market returns or web traffic spikes), extreme Z-scores reflect authentic physical reality rather than corrupt telemetry."
        },
        {
          w: "Z-score normalization and Min-Max scaling can be used interchangeably without difference.",
          r: "Min-Max scaling bounds data strictly to $[0, 1]$, which compresses normal variances if extreme outliers exist. Z-score scaling does not bound values to a fixed range, preserving relative standard distances and handling future out-of-bounds streaming values much more gracefully."
        },
        {
          w: "You should fit the StandardScaler on both train and test sets combined before modeling.",
          r: "Fitting a scaler on combined train and test data constitutes **data leakage**. The scaler's mean and variance parameters must be fit strictly on training splits alone (`scaler.fit(X_train)`), and then applied out-of-sample to transform validation and test sets (`scaler.transform(X_test)`)."
        }
      ],

      trade: {
        buys: [
          "Scale standardization: eliminates arbitrary physical units, placing features with wildly divergent scales onto a unified comparative scale.",
          "Conditioning optimization: transforms ill-conditioned gradient descent error surfaces into isotropic landscapes for faster convergence.",
          "Statistical anomaly detection: establishes rigorous, probability-grounded thresholds (e.g., $|z| > 3$) for automated outlier alerts.",
          "Universal comparability: allows direct comparison of relative ranking performance across disparate testing instruments or user cohorts."
        ],
        costs: [
          "Outlier distortion: extreme outliers inflate sample variance $s$, artificially suppressing the Z-scores of other anomalous points.",
          "Unbounded range: output values are not bounded to a fixed interval, which can destabilize neural network activation functions expecting $[0, 1]$.",
          "Assumes meaningful mean/variance: ineffective on highly multimodal, discrete count, or Cauchy-like heavy-tailed distributions.",
          "Production state management: requires persisting and versioning training $\\mu$ and $\\sigma$ vectors for real-time inference serving pipelines."
        ],
        avoid: [
          "Never calculate Z-scores across training and testing data simultaneously; always fit on train and transform on test to prevent data leakage.",
          "Do not use standard Z-scores for outlier rejection when the dataset contains extreme contaminated anomalies; use Modified Z-scores with MAD.",
          "Avoid applying Z-scores to sparse binary or one-hot encoded features, as zero-centering destroys sparsity and massively inflates memory consumption.",
          "Never assume $|z| > 3$ maps to $p < 0.003$ unless you have verified that the underlying data is approximately normally distributed."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
