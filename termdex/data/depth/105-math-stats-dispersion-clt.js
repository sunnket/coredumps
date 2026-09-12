/* ==========================================================================
   Depth pass 105 — Mathematics & Statistics batch 4: Co-dispersion, Summary Stats & Asymptotics.
   Covariance, Correlation, Mean, Median and Mode, Percentile,
   Outlier, Skewness, Central Limit Theorem.

   Bivariate central cross-moments quantify directional co-movement;
   asymptotic convolution of finite-variance variables converges to Gaussian geometry.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "covariance",

      why: {
        before: "Univariate statistics measured the variance and spread of individual variables in isolation, leaving data scientists unable to quantify how two different variables move together.",
        problem: "Variables in machine learning interact; determining whether an increase in advertising spend associates with an increase in product revenue requires a mathematical measure of joint directional co-movement.",
        shift: "**Covariance: A measure of the joint variability and directional linear association between two random variables: $\\text{Cov}(X, Y) = E[(X - E[X])(Y - E[Y])]$.** Serves as the foundational mathematical building block for the Covariance Matrix, Principal Component Analysis (PCA), and portfolio theory."
      },

      num: {
        t: "Covariance Mathematical Formulations, Properties & Matrix Layouts",
        h: ["Property / Structure", "Mathematical Formula", "Algebraic Behavior", "Geometric Meaning", "Machine Learning Role"],
        r: [
          ["Population Covariance", "$\\text{Cov}(X, Y) = E[X Y] - E[X] E[Y]$", "Bilinear and symmetric", "Cross-moment of centered variables", "Measures direction of joint variability"],
          ["Sample Covariance", "$s_{xy} = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})$", "Unbiased sample estimator ($n-1$)", "Empirical sample cross-product", "Empirical data feature correlation analysis"],
          ["Self-Covariance", "$\\text{Cov}(X, X) = \\text{Var}(X)$", "Recovers variance on diagonal", "Dispersion of variable with itself", "Diagonal entries of the Covariance Matrix"],
          ["Symmetry", "$\\text{Cov}(X, Y) = \\text{Cov}(Y, X)$", "Commutative", "Directional symmetry", "Ensures Covariance Matrix is symmetric positive semi-definite"],
          ["Covariance Matrix ($\\boldsymbol{\\Sigma}$)", "$\\boldsymbol{\\Sigma}_{i,j} = \\text{Cov}(X_i, X_j) = E[(\\mathbf{X} - \\boldsymbol{\\mu})(\\mathbf{X} - \\boldsymbol{\\mu})^T]$", "$D \\times D$ symmetric matrix", "Hyper-ellipsoidal data scatter orientation", "Eigendecomposition for PCA dimensionality reduction"]
        ],
        n: "Covariance measures the degree to which two random variables move together. If greater values of $X$ correspond mainly to greater values of $Y$, the products $(x_i - \\bar{x})(y_i - \\bar{y})$ will be mostly positive, yielding a **positive covariance** ($\\text{Cov}(X, Y) > 0$). If greater values of $X$ correspond to lesser values of $Y$, the products are negative, yielding a **negative covariance**. In multidimensional data science, for a feature vector $\\mathbf{X} \\in \\mathbb{R}^D$, the **Covariance Matrix** $\\boldsymbol{\\Sigma} = E[(\\mathbf{X} - \\boldsymbol{\\mu})(\\mathbf{X} - \\boldsymbol{\\mu})^T]$ captures all pairwise covariances. The diagonal entries $\\boldsymbol{\\Sigma}_{i,i}$ are the individual feature variances, while the off-diagonal entries $\\boldsymbol{\\Sigma}_{i,j}$ describe feature correlations. In **Principal Component Analysis (PCA)**, the eigenvectors of the empirical covariance matrix define the orthogonal axes of maximum variance."
      },

      miss: [
        {
          w: "A large covariance value proves a strong relationship between two variables.",
          r: "Covariance is **un-standardized** and scale-dependent. If you measure height in meters and weight in kilograms, the covariance might be 4.2; if you change height to millimeters, the covariance jumps by $1000\\times$ to 4,200 despite the physical relationship being identical. Standardizing covariance yields the **Correlation Coefficient** ($r$), which is scale-invariant."
        },
        {
          w: "A covariance of zero ($\\text{Cov}(X, Y) = 0$) proves that two variables are independent.",
          r: "Covariance measures **linear** relationships ONLY. Two variables can have a perfect deterministic non-linear relationship (e.g., $Y = X^2$ on symmetric interval $[-1, 1]$) and have a covariance of exactly zero. Independence implies zero covariance, but zero covariance does NOT imply independence."
        },
        {
          w: "Covariance can be calculated between a continuous variable and a text category.",
          r: "Covariance is strictly defined for numerical variables with well-defined mathematical means. Categorical variables require contingency tables, Chi-Square tests, or encoding into numerical dummy variables."
        },
        {
          w: "The covariance matrix of any dataset is always invertible.",
          r: "If features are collinear (e.g., one feature is a linear combination of others) or if the sample size is smaller than the feature dimension ($n < d$), the covariance matrix is **singular and rank-deficient**, meaning it cannot be inverted without regularization (shrinkage / ridge penalty)."
        }
      ],

      trade: {
        buys: [
          "Captures the directional co-movement between pairs of continuous random variables.",
          "The Covariance Matrix completely characterizes the orientation and shape of multivariate Gaussian distributions.",
          "Underpins dimensionality reduction: PCA diagonalizes the sample covariance matrix to eliminate redundant features.",
          "Enables risk diversification in finance: constructing portfolios with negatively co-varying assets reduces total portfolio variance."
        ],
        costs: [
          "Scale-dependent units: units are the product of individual variable units ($X \\cdot Y$), preventing meaningful cross-domain comparisons.",
          "Blind to non-linear associations: will report 0 covariance for non-linear relationships (parabolic, sinusoidal).",
          "Vulnerable to extreme outliers: a single distant point can completely flip the sign of the covariance.",
          "Memory scaling: an $N \\times N$ covariance matrix for 100,000 features requires $10^{10}$ floats (40 GB of RAM)."
        ],
        avoid: [
          "Never compare raw covariance magnitudes across datasets with different measurement units; standardize to Correlation.",
          "Do not assume variables are independent simply because their covariance is zero.",
          "Avoid inverting sample covariance matrices when $n < d$ without shrinkage estimators (Ledoit-Wolf)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "correlation",

      why: {
        before: "Covariance measured whether two variables moved together, but because its numerical magnitude depended on arbitrary measurement units, scientists could not compare the strength of relationships across different experiments.",
        problem: "An analyst cannot determine whether a covariance of 850 in housing prices indicates a stronger relationship than a covariance of 0.04 in chemical reaction rates.",
        shift: "**Correlation: The normalized, dimensionless statistical measure of the strength and direction of the linear relationship between two variables, bounded strictly between $-1.0$ and $+1.0$.** Formalized as Pearson's Product-Moment Correlation Coefficient ($r$ or $\\rho$), accompanied by rank-based non-parametric alternatives (Spearman, Kendall)."
      },

      num: {
        t: "Correlation Metrics: Formulations, Linearity & Outlier Robustness",
        h: ["Metric", "Mathematical Formulation", "Underlying Relationship Measured", "Bounded Range", "Outlier Robustness"],
        r: [
          ["Pearson Correlation ($r$)", "$r = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2 \\sum(y_i-\\bar{y})^2}}$", "Strictly Linear association", "$[-1.0, +1.0]$", "Low (highly sensitive to extreme outliers)"],
          ["Spearman Rank ($\\rho$)", "$r_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$ (Pearson on ranks)", "Monotonic relationship (linear or non-linear)", "$[-1.0, +1.0]$", "High (ranks eliminate outlier leverage)"],
          ["Kendall's Tau ($\\tau$)", "$\\tau = \\frac{C - D}{\\frac{1}{2} n (n-1)}$ (Concordant vs Discordant pairs)", "Monotonic ordinal association", "$[-1.0, +1.0]$", "Very High (smaller sample efficiency)"],
          ["Distance Correlation", "$\\text{dCor}(X, Y) = \\frac{\\text{dCov}(X,Y)}{\\sqrt{\\text{dVar}(X) \\text{dVar}(Y)}}$", "Any statistical dependence (linear AND non-linear)", "$[0.0, 1.0]$", "Moderate (detects non-linear dependencies)"]
        ],
        n: "Pearson's Correlation Coefficient normalizes covariance by dividing by the product of individual standard deviations: $\\rho_{X,Y} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{E[(X - \\mu_X)(Y - \\mu_Y)]}{\\sigma_X \\sigma_Y}$. Under the **Cauchy-Schwarz Inequality** ($|u \\cdot v| \\le \\|u\\| \\|v\\|$), correlation is mathematically bounded strictly between $-1.0$ and $+1.0$: (1) $\\rho = +1.0$: Perfect positive linear relationship. (2) $\\rho = -1.0$: Perfect negative linear relationship. (3) $\\rho = 0.0$: Absence of any linear association. The square of Pearson's correlation is the **Coefficient of Determination ($R^2 = r^2$)**, which represents the proportion of variance in $Y$ that is predictable from $X$ in a simple linear regression."
      },

      miss: [
        {
          w: "Correlation implies causation (if $r=0.9$, $X$ causes $Y$).",
          r: "Correlation measures statistical co-occurrence, NOT physical causation. A strong correlation can be driven entirely by a third unobserved **Confounding Variable** (e.g., ice cream sales and shark attacks correlate strongly because both peak in summer heat), or by pure coincidence (Spurious Correlations)."
        },
        {
          w: "A correlation of $0$ proves that $X$ and $Y$ have no relationship.",
          r: "Pearson correlation measures **linear** relationships ONLY. If $Y = X^2$ on $[-1, 1]$, the correlation is exactly $0.0$, yet $Y$ is 100% deterministically predictable from $X$. Non-linear relationships require Spearman rank correlation, Mutual Information, or Distance Correlation."
        },
        {
          w: "A correlation of $0.8$ is twice as strong as a correlation of $0.4$.",
          r: "Correlation does not scale linearly in predictive power. Using $R^2 = r^2$: $r=0.4$ explains only $16\\%$ of variance ($0.4^2 = 0.16$), whereas $r=0.8$ explains $64\\%$ of variance ($0.8^2 = 0.64$)—meaning an $r=0.8$ relationship is **four times** more informative, not twice."
        },
        {
          w: "Spearman rank correlation is only for ordinal survey data.",
          r: "Spearman rank correlation is widely used on continuous data whenever relationships are monotonic but non-linear (e.g., exponential growth), or when datasets contain extreme outliers that would distort Pearson's $r$."
        }
      ],

      trade: {
        buys: [
          "Scale-invariant and dimensionless: normalized between $-1.0$ and $+1.0$, allowing direct comparison across diverse domains.",
          "Fast feature selection: correlation heatmaps quickly identify redundant collinear features ($r > 0.90$).",
          "Square of correlation ($R^2$) provides direct intuitive interpretability of explained variance in linear models.",
          "Spearman rank correlation captures non-linear monotonic trends and is robust to extreme outliers."
        ],
        costs: [
          "Pearson's $r$ is completely blind to non-monotonic, circular, or complex non-linear relationships.",
          "Highly sensitive to outliers: a single extreme leverage point can inflate an $r=0.0$ relationship to $r=0.8$ (Anscombe's Quartet).",
          "Subject to ecological fallacies and Simpson's Paradox when aggregating across heterogeneous subgroups.",
          "Does not provide causal directionality: cannot tell whether $X \\rightarrow Y$, $Y \\rightarrow X$, or $Z \\rightarrow (X, Y)$."
        ],
        avoid: [
          "Never evaluate correlation without plotting a visual scatter plot (to avoid Anscombe's Quartet traps).",
          "Do not use Pearson's correlation for skewed, heavy-tailed, or non-linear data; use Spearman's rank correlation.",
          "Avoid inferring causal relationships from high correlation values without controlled experimentation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mean-median-and-mode",

      why: {
        before: "Summarizing datasets required reporting entire raw tables of numbers, overwhelming human comprehension and preventing compact comparisons across groups.",
        problem: "Datasets contain natural variation; decision-makers need single-number summary statistics (central tendencies) that best represent the typical, middle, or most common value of a population.",
        shift: "**Central Tendency Measures (Mean, Median, Mode): The three foundational summary statistics that describe the center or typical value of a probability distribution or dataset.** Mean (arithmetic center of mass), Median (ordinal 50th percentile midpoint), and Mode (most frequent value)."
      },

      num: {
        t: "Central Tendency Measures: Formulations, Robustness & Distribution Skew Alignment",
        h: ["Measure", "Mathematical Definition / Formulation", "Sensitivity to Outliers", "Applicable Data Types", "Location in Right-Skewed Data"],
        r: [
          ["Mean (Arithmetic Average)", "$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i$", "High (pulled heavily by extreme outliers)", "Continuous / Interval numerical data", "Pulled furthest to the right (highest value)"],
          ["Median", "Middle value when sorted (50th percentile)", "Zero (robust; breakdown point 50%)", "Ordinal & Continuous numerical data", "Lies between Mode and Mean"],
          ["Mode", "$\\arg\\max_x p(x)$ (Peak frequency)", "Zero (unaffected by distant tails)", "Nominal (Categorical), Discrete & Continuous", "Remains at the peak of the distribution (lowest value)"],
          ["Geometric Mean", "$\\left( \\prod_{i=1}^n x_i \\right)^{1/n} = \\exp(\\frac{1}{n} \\sum \\ln x_i)$", "Moderate", "Strictly positive multiplicative growth / ratios", "Investment compounding & metric normalization"],
          ["Trimmed Mean", "Mean computed after dropping top/bottom $k\\%$", "Tunable robustness", "Continuous numerical data", "Mitigates outlier pull while preserving sample efficiency"]
        ],
        n: "The three measures of central tendency minimize different mathematical error loss functions: (1) **Mean**: Minimizes the sum of **squared errors**: $\\bar{x} = \\arg\\min_c \\sum (x_i - c)^2$. This makes the mean the physical center of mass, but renders it highly sensitive to outliers. (2) **Median**: Minimizes the sum of **absolute errors**: $\\tilde{x} = \\arg\\min_c \\sum |x_i - c|$. It has a breakdown point of $50\\%$, meaning up to half the data can be corrupted to infinity without breaking the median. (3) **Mode**: Minimizes **zero-one loss** (misclassification rate): $x_{\\text{mode}} = \\arg\\min_c \\sum \\mathbb{I}(x_i \\ne c)$. In a perfectly symmetric Gaussian distribution, $\\text{Mean} = \\text{Median} = \\text{Mode}$. In a **Right-Skewed (Positive)** distribution (like income), the long right tail pulls the metrics apart: $\\text{Mode} < \\text{Median} < \\text{Mean}$."
      },

      miss: [
        {
          w: "The arithmetic mean is always the best measure of the 'average' person.",
          r: "When data is skewed (wealth, salaries, house prices), the mean is heavily distorted by extreme billionaires. If 9 people make $\\$50,000$ and 1 person makes $\\$10,000,000$, the mean salary is $\\$1,045,000$ (completely unrepresentative of all 10 people), while the median is $\\$50,000$."
        },
        {
          w: "Every dataset has exactly one mode.",
          r: "A dataset can have no mode (if all values are unique), a single mode (unimodal), two modes (bimodal), or multiple modes (multimodal). In continuous data, the mode corresponds to local maxima of the probability density function."
        },
        {
          w: "Percentages and financial growth rates should be averaged using the arithmetic mean.",
          r: "Averaging compounding growth rates with the arithmetic mean produces mathematically false results. A portfolio that gains 100% in year 1 and loses 50% in year 2 has an arithmetic mean return of $(100 - 50)/2 = 25\\%$, yet the true wealth return is exactly $0\\%$. Multiplicative rates require the **Geometric Mean**."
        },
        {
          w: "The median can only be calculated on numerical continuous numbers.",
          r: "The median can be computed on any data with an **ordinal** ranking (e.g., Likert survey ratings: 'Disagree', 'Neutral', 'Agree'), whereas calculating an arithmetic mean on arbitrary ordinal categories is mathematically invalid."
        }
      ],

      trade: {
        buys: [
          "Instant cognitive compression: distills millions of observations into a single representative number.",
          "Median provides extreme robustness against noisy sensor glitches, fat-tailed errors, and outliers.",
          "Arithmetic mean integrates directly with linear algebra and calculus (minimizes sum of squared errors).",
          "Relative positions of Mean, Median, and Mode provide an instant diagnostic of distribution skewness."
        ],
        costs: [
          "Severe information loss: collapses distribution variance, multimodality, and tail risk into one point.",
          "Arithmetic mean is notoriously vulnerable to extreme outlier distortion in non-Gaussian datasets.",
          "The mode is unstable on continuous data, requiring arbitrary histogram binning or kernel density estimation.",
          "Averaging bimodal data (e.g., two distinct customer clusters) produces a mean that represents nobody in the population."
        ],
        avoid: [
          "Never report average salaries, home prices, or customer response times using the arithmetic mean; use the Median.",
          "Do not average growth rates, interest rates, or currency ratios using the arithmetic mean; use the Geometric Mean.",
          "Avoid using a single central tendency metric on bimodal or multimodal distributions without segmenting clusters."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "percentile",

      why: {
        before: "Evaluating performance using simple averages masked critical customer experiences: a cloud service could report an 'average latency of 20ms' while 10% of users suffered broken 2-second timeouts.",
        problem: "Engineers, educators, and clinicians need a non-parametric measure that describes the exact relative rank, cumulative distribution, and tail behavior of observations regardless of distribution shape.",
        shift: "**Percentile: A statistical measure indicating the value below which a given percentage of observations in a group of observations falls.** Standardized into quartiles ($Q_1, Q_2, Q_3$), deciles, and tail percentiles ($P_{95}, P_{99}, P_{99.9}$), serving as the universal standard for Service Level Agreements (SLAs) and outlier detection."
      },

      num: {
        t: "Key Percentile Benchmarks, Statistical Roles & Operational Definitions",
        h: ["Percentile Rank", "Alternative Name", "Statistical Role", "SLA / Operational Meaning", "Robustness Profile"],
        r: [
          ["$P_{25}$", "First Quartile ($Q_1$)", "Boundary of bottom 25% of data", "Lower baseline of interquartile range", "Robust to bottom outliers"],
          ["$P_{50}$", "Median / Second Quartile ($Q_2$)", "Exact 50th percentile midpoint", "Typical user operational baseline", "Maximum robustness (50% breakdown)"],
          ["$P_{75}$", "Third Quartile ($Q_3$)", "Boundary of top 25% of data", "Upper baseline of interquartile range", "Robust to top outliers"],
          ["$P_{95}$", "95th Percentile", "Excludes top 5% worst cases", "Standard web application latency SLA", "Filters rare transient network hiccups"],
          ["$P_{99}$ / $P_{99.9}$", "Tail Latency Percentiles", "Captures extreme tail events (1 in 100 / 1 in 1,000)", "High-stakes mission-critical financial SLAs", "Directly measures severe edge-case degradation"]
        ],
        n: "The $p$-th percentile of a continuous random variable $X$ with cumulative distribution function $F(x)$ is the value $x_p$ satisfying: $F(x_p) = P(X \\le x_p) = \\frac{p}{100}$, computed via the quantile function: $x_p = F^{-1}(p/100)$. In finite empirical samples of size $n$, computing percentiles requires sorting the data and interpolating between discrete ranks. The **Interquartile Range (IQR)** is defined as $\\text{IQR} = Q_3 - Q_1 = P_{75} - P_{25}$. In modern Site Reliability Engineering (SRE) and cloud infrastructure, performance is governed by **Tail Latency Percentiles**: an SLA guaranteeing $P_{99} < 100$ ms ensures that 99 out of 100 user requests complete within 100ms, exposing performance degradation that average ($P_{50}$) metrics hide."
      },

      miss: [
        {
          w: "Percentile and Percentage are the exact same mathematical term.",
          r: "**Percentage** is a proportion of a whole (e.g., getting 80 out of 100 questions right is 80%). **Percentile** is a relative rank: scoring in the 80th percentile means you scored higher than 80% of all other participants, regardless of your raw percentage score."
        },
        {
          w: "Percentiles across multiple microservices can simply be added together to calculate total latency.",
          r: "Percentiles are **strictly non-additive**: $P_{99}(A + B) \\ne P_{99}(A) + P_{99}(B)$. A user request traversing 10 sequential microservices each with a 99th percentile SLA of 50ms will experience a total latency far worse than $P_{99}$, because the probability of hitting at least one slow tail grows exponentially: $1 - (0.99)^{10} \\approx 9.56\\%$ (a 1-in-10 failure rate!)."
        },
        {
          w: "The 50th percentile and the arithmetic mean are always the same value.",
          r: "The 50th percentile is the **Median**. It equals the arithmetic mean ONLY in perfectly symmetric distributions. In skewed distributions (e.g., cloud latency, wealth), the 50th percentile is significantly lower than the mean."
        },
        {
          w: "Calculating the 99.9th percentile is accurate on a sample of 50 data points.",
          r: "Evaluating $P_{99.9}$ requires observing at least thousands of samples. Attempting to estimate high tail percentiles on tiny samples produces extreme sampling variance and noisy, meaningless estimates."
        }
      ],

      trade: {
        buys: [
          "Non-parametric and distribution-agnostic: valid across normal, skewed, multimodal, and heavy-tailed data.",
          "Exposes tail degradation: $P_{95}$ and $P_{99}$ metrics reveal severe user-facing performance bottlenecks that averages hide.",
          "Robust summary statistic: the Interquartile Range (IQR) provides a dispersion metric immune to extreme outliers.",
          "Universal standard for contractual Service Level Agreements (SLAs) and SLO definitions in enterprise software."
        ],
        costs: [
          "Non-additive: cannot sum or average percentiles across servers or microservices without raw data or t-digests.",
          "Requires sorting or streaming approximation: exact percentile calculation requires $O(n \\log n)$ sorting or heavy memory.",
          "High sample size requirement: accurately measuring extreme percentiles ($P_{99.99}$) requires millions of observations.",
          "Memory overhead in streaming systems: requires approximate streaming quantile sketches (T-Digest, HdrHistogram)."
        ],
        avoid: [
          "Never average percentiles together across servers (e.g., `AVG(p99)`); use approximate streaming sketches (T-Digest).",
          "Do not define latency SLAs based on average ($P_{50}$) latency; use $P_{95}$ or $P_{99}$.",
          "Avoid estimating high percentiles ($P_{99}$) on small sample sizes ($N < 1,000$)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "outlier",

      why: {
        before: "Scientists calculated statistical averages and regressions on raw empirical data without checking for anomalies, allowing a single corrupted sensor reading or typing typo to completely skew findings and model weights.",
        problem: "Extreme observations distort linear regressions, inflate variance, bias mean estimations, and derail machine learning optimizers, while occasionally representing the exact phenomenon of interest (e.g., credit card fraud, cyber intrusions).",
        shift: "**Outlier: An observation that deviates so significantly from other observations in a dataset as to arouse suspicions that it was generated by a different mechanism or represents a rare extreme phenomenon.** Detected via parametric Z-scores, non-parametric IQR fences, and machine learning anomaly detectors (Isolation Forests, One-Class SVM)."
      },

      num: {
        t: "Outlier Detection Methodologies: Assumptions, Bounds & Computational Profiles",
        h: ["Methodology", "Statistical Assumption", "Mathematical Outlier Boundary", "Breakdown Point", "Best Use Case"],
        r: [
          ["Tukey's IQR Fence", "Non-parametric (no distribution assumed)", "$x < Q_1 - 1.5 \\cdot \\text{IQR}$ or $x > Q_3 + 1.5 \\cdot \\text{IQR}$", "50% robust", "Standard exploratory data analysis & boxplots"],
          ["Z-Score Thresholding", "Normal (Gaussian) distribution", "$|z| = \\left| \\frac{x - \\mu}{\\sigma} \\right| > 3.0$", "0% (mean and std skewed by outlier)", "Clean, symmetric, approximately normal datasets"],
          ["Modified Z-Score (MAD)", "Non-parametric median-based", "$M_i = \\frac{0.6745 |x_i - \\tilde{x}|}{\\text{MAD}} > 3.5$", "50% robust", "Robust statistical anomaly detection in skewed data"],
          ["Isolation Forest", "Tree-based structural isolation", "Anomaly score based on average path length $h(x)$", "Non-parametric", "High-dimensional multivariate tabular anomaly detection"],
          ["Local Outlier Factor (LOF)", "Density-based nearest neighbors", "Local reachability density ratio $\\gg 1$", "Non-parametric", "Detecting outliers in multi-density spatial clusters"]
        ],
        n: "An outlier is an empirical data point $x$ that lies in the extreme tails of an assumed generating distribution: $P(X = x) < \\epsilon$. John Tukey formalized the non-parametric **Tukey's Fences** using the Interquartile Range: an observation is an **outlier** if it lies outside the inner fences: $[Q_1 - 1.5 \\cdot \\text{IQR}, Q_3 + 1.5 \\cdot \\text{IQR}]$, and an **extreme outlier** if outside the outer fences: $[Q_1 - 3.0 \\cdot \\text{IQR}, Q_3 + 3.0 \\cdot \\text{IQR}]$. In multivariable spaces, Euclidean distance fails to detect outliers that follow correlated trends; the **Mahalanobis Distance** measures distance normalized by the covariance matrix: $D_M(x) = \\sqrt{(x - \\mu)^T \\boldsymbol{\\Sigma}^{-1} (x - \\mu)}$. In production, handling outliers requires distinguishing between **measurement errors** (which should be pruned or winsorized) and **genuine rare signals** (fraud, system crashes, scientific breakthroughs) which must be preserved."
      },

      miss: [
        {
          w: "All outliers are errors or corrupted data that should be deleted automatically.",
          r: "Blindly deleting outliers is dangerous. In cybersecurity, credit card fraud detection, and rare disease diagnostics, the **outliers are the exact data points of interest**. Deleting them eliminates the very signal the machine learning model is being built to detect."
        },
        {
          w: "Using standard Z-scores ($|z| > 3$) is a reliable way to find outliers.",
          r: "Standard Z-score thresholding suffers from **masking**: the outlier itself massively inflates the sample standard deviation $\\sigma$ and shifts the sample mean $\\mu$, artificially shrinking its own Z-score below 3.0. Robust methods use the **Median Absolute Deviation (MAD)**."
        },
        {
          w: "Outliers can only be detected one variable at a time.",
          r: "Univariate outlier detection misses complex **multivariate anomalies**. A person with a height of 180cm is normal; a person with a weight of 45kg is normal; but an observation of 180cm paired with 45kg is a significant multivariate outlier detected via Mahalanobis distance or Isolation Forests."
        },
        {
          w: "Winsorization is the same as trimming/dropping outliers.",
          r: "Trimming deletes the outlier rows entirely, reducing sample size. **Winsorization** caps extreme values at a specific percentile (e.g., setting all values above the 99th percentile to the 99th percentile value), preserving total sample size while neutralizing leverage."
        }
      ],

      trade: {
        buys: [
          "Protects model training: prevents extreme anomalous values from distorting linear regression slopes or gradient updates.",
          "Core engine of security and fraud detection: identifying anomalies uncovers financial fraud and network intrusions.",
          "Improves data pipeline reliability: flags upstream sensor failures and telemetry logging bugs before publishing.",
          "Robust methods (Tukey's fences, MAD) provide standardized, non-parametric detection criteria."
        ],
        costs: [
          "Risk of deleting genuine discoveries: aggressively pruning valid extreme data points introduces severe selection bias.",
          "High-dimensional detection complexity: distance-based anomaly detection degrades in high dimensions (curse of dimensionality).",
          "Subjective threshold tuning: choosing between $1.5 \\cdot \\text{IQR}$ or $3.0 \\cdot \\text{IQR}$ is heuristic and domain-dependent.",
          "Compute overhead: multivariate methods (LOF, Isolation Forest) require significant processing time on large datasets."
        ],
        avoid: [
          "Never automatically delete outliers in fraud, cybersecurity, or medical safety datasets without manual audit.",
          "Do not use standard Z-scores for outlier detection on small, contaminated datasets; use Median Absolute Deviation (MAD).",
          "Avoid evaluating multivariable datasets using isolated univariate outlier checks; use Isolation Forests or Mahalanobis distance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "skewness",

      why: {
        before: "Data analysis assumed datasets were symmetrically distributed around their mean, calculating standard deviations that produced nonsensical confidence intervals (e.g., predicting negative customer response times or negative insurance claims).",
        problem: "Real-world data (income, housing prices, server latency, insurance claims) is inherently asymmetric; models that ignore distributional asymmetry suffer from biased parameter estimations and poor risk calibration.",
        shift: "**Skewness: A standardized measure of the asymmetry of a probability distribution around its mean, quantified by the standardized third central moment: $\\gamma_1 = E\\left[\\left(\\frac{X-\\mu}{\\sigma}\\right)^3\\right]$.** Distinguishes between symmetric, right-skewed (positive), and left-skewed (negative) distributions."
      },

      num: {
        t: "Skewness Regimes, Tail Dynamics & Data Transformation Strategies",
        h: ["Skewness Value ($\\gamma_1$)", "Distribution Characterization", "Tail Direction / Geometry", "Central Tendency Alignment", "Standard Normalizing Transformation"],
        r: [
          ["$\\gamma_1 = 0$", "Symmetric (e.g. Gaussian)", "Equal balanced tails on both sides", "$\\text{Mean} = \\text{Median} = \\text{Mode}$", "None required (native linear models apply)"],
          ["$\\gamma_1 > +1.0$", "Highly Right-Skewed (Positive)", "Long tail extends to the right (positive)", "$\\text{Mode} < \\text{Median} < \\text{Mean}$", "Log transform ($\\ln(x)$) / Box-Cox ($\\lambda=0$)"],
          ["$0.5 < \\gamma_1 < 1.0$", "Moderately Right-Skewed", "Moderate right tail elongation", "$\\text{Median} < \\text{Mean}$", "Square root transform ($\\sqrt{x}$)"],
          ["$\\gamma_1 < -1.0$", "Highly Left-Skewed (Negative)", "Long tail extends to the left (negative)", "$\\text{Mean} < \\text{Median} < \\text{Mode}$", "Reflection + Log or Exponential transform ($e^x$)"],
          ["$-0.5 \\le \\gamma_1 \\le 0.5$", "Approximately Symmetric", "Slight tail variation", "$\\text{Mean} \\approx \\text{Median}$", "Linear scaling / standard Z-score normalization"]
        ],
        n: "Skewness is the **third standardized central moment**: $\\gamma_1 = \\frac{E[(X - \\mu)^3]}{\\sigma^3} = \\frac{\\mu_3}{\\sigma^3}$. Because the deviation $(X - \\mu)$ is raised to an odd power ($3$), deviations above the mean contribute positive values while deviations below contribute negative values. In an **empirical sample**, the Fisher-Pearson standardized skewness coefficient is calculated as: $g_1 = \\frac{n}{(n-1)(n-2)} \\sum_{i=1}^n \\left( \\frac{x_i - \\bar{x}}{s} \\right)^3$. Machine learning algorithms (such as linear regression and neural networks) struggle with highly skewed feature inputs because extreme tail values act as high-leverage points that dominate the gradient loss surface. Applying **Power Transforms** (such as the **Box-Cox transformation**: $y^{(\\lambda)} = \\frac{x^\\lambda - 1}{\\lambda}$ or **Yeo-Johnson** for non-positive values) normalizes skewed features into symmetric, near-Gaussian distributions."
      },

      miss: [
        {
          w: "A right-skewed distribution has the bulk of its data on the right side.",
          r: "Skewness refers to the **direction of the long tail**, NOT the peak. A **Right-Skewed (Positive)** distribution has its peak on the **left** and its long tail stretching out to the **right**."
        },
        {
          w: "A skewness of 0 proves that the distribution is a normal Gaussian distribution.",
          r: "A skewness of 0 means only that the distribution is **symmetric**. The Uniform distribution, Student's t-distribution, and bimodal symmetric distributions all have a skewness of exactly 0 while being completely non-Gaussian."
        },
        {
          w: "Applying a log transformation ($\\\\ln(x)$) can be done on datasets containing negative numbers.",
          r: "The natural logarithm is undefined for zero and negative numbers. For datasets containing zero or negative values, analysts use $\\ln(x + 1)$ (for $x \\ge 0$) or the **Yeo-Johnson transformation**, which supports negative real numbers."
        },
        {
          w: "Tree-based models (Random Forest, XGBoost) require removing skewness before training.",
          r: "Tree-based algorithms split data based purely on **ordinal ranks** (threshold inequalities like $x > c$), making them completely invariant to monotonic transformations like $\\ln(x)$. Skewness normalization is mandatory for linear models, neural networks, and distance-based algorithms, but unnecessary for decision trees."
        }
      ],

      trade: {
        buys: [
          "Identifies asymmetric risk and long-tail behavior in financial, operational, and customer datasets.",
          "Diagnoses feature non-normality before feeding inputs to linear regression or neural networks.",
          "Power transformations (Box-Cox, Yeo-Johnson) restore symmetry, stabilizing gradient descent optimization.",
          "Explains why the arithmetic mean diverges from the median in socioeconomic and latency data."
        ],
        costs: [
          "Cubing deviations makes sample skewness estimates highly volatile and sensitive to extreme sample outliers.",
          "Non-linear transformations (log, Box-Cox) make model feature coefficients harder to interpret directly.",
          "Requires separate handling of zero and negative values during logarithmic power transformations.",
          "Cannot capture multimodality: a distribution can have zero skewness while being a split bimodal mixture."
        ],
        avoid: [
          "Never evaluate linear regressions on raw features with skewness $|\\gamma_1| > 2.0$ without applying a log/power transform.",
          "Do not apply standard Box-Cox transformations to datasets containing negative values; use Yeo-Johnson.",
          "Avoid using the arithmetic mean to represent central tendency when feature skewness is severe."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "central-limit-theorem",

      why: {
        before: "Early statisticians could not construct confidence intervals or test scientific hypotheses without knowing the exact underlying probability distribution of the population, which was almost always impossible to discover.",
        problem: "Real-world populations are messy, multimodal, skewed, or uniform; scientists needed a universal mathematical theorem that guarantees a predictable distribution for aggregated sample statistics regardless of the population's shape.",
        shift: "**Central Limit Theorem (CLT): The foundational theorem of statistics stating that the distribution of the normalized sum (or mean) of a large number of independent and identically distributed (i.i.d.) random variables approaches a Normal Distribution, regardless of the underlying population distribution.** The bedrock theorem justifying hypothesis testing, polling, and z/t-statistics."
      },

      num: {
        t: "Central Limit Theorem Scaling Regimes & Convergence Behaviors",
        h: ["Sample Size ($n$)", "Underlying Population Shape", "Distribution of the Sample Mean ($\\bar{X}_n$)", "Applicable Statistical Test", "Convergence Speed"],
        r: [
          ["Any $n \\ge 1$", "Normally distributed population $\\mathcal{N}(\\mu, \\sigma^2)$", "Strictly Normal: $\\mathcal{N}(\\mu, \\sigma^2 / n)$", "Exact z-test / t-test", "Instantaneous (exact by convolution)"],
          ["$n \\approx 30$ (Rule of Thumb)", "Moderately skewed continuous population", "Approximately Normal: $\\mathcal{N}(\\mu, \\sigma^2 / n)$", "Standard t-test / z-test", "Sufficient for standard business analytics"],
          ["$n \\ge 100$", "Discrete / Binomial ($n p \\ge 10$)", "Asymptotically Normal", "Normal approximation to Binomial", "Governed by Berry-Esseen bound"],
          ["$n \\ge 1,000$", "Highly skewed exponential / lognormal", "Approaches Normal in the central body", "Large-sample asymptotic tests", "Tails converge slower than the central peak"],
          ["Any $n$", "Cauchy / Heavy-tailed (Infinite Variance)", "NEVER converges to Normal (stable law)", "Non-parametric tests (Mann-Whitney)", "Fails completely (CLT does not apply!)"]
        ],
        n: "Let $X_1, X_2, \\dots, X_n$ be a sequence of independent and identically distributed (i.i.d.) random variables with finite population mean $\\mu$ and finite population variance $\\sigma^2 < \\infty$. The sample mean is $\\bar{X}_n = \\frac{1}{n} \\sum_{i=1}^n X_i$. The Central Limit Theorem proves that as $n \\rightarrow \\infty$, the standardized sample mean converges in distribution to the Standard Normal distribution: $Z_n = \\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} \\mathcal{N}(0, 1)$. The standard deviation of the sample mean is the **Standard Error**: $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$, which shrinks at the rate of $O(1/\\sqrt{n})$. The **Berry-Esseen Theorem** bounds the maximum approximation error: $\\sup_x |F_n(x) - \\Phi(x)| \\le \\frac{C \\cdot \\rho}{\\sigma^3 \\sqrt{n}}$, proving that convergence speed depends directly on the population's third moment (skewness $\\rho$)."
      },

      miss: [
        {
          w: "The CLT proves that as you collect more data, the raw dataset becomes normally distributed.",
          r: "The CLT says NOTHING about the raw data. If you roll a fair die a million times, the raw distribution of rolls remains completely **flat and uniform**. The CLT states that the **average (mean)** of multiple rolls converges to a normal distribution."
        },
        {
          w: "The Central Limit Theorem applies to all probability distributions without exception.",
          r: "The classical CLT requires the **finite variance condition** ($\\sigma^2 < \\infty$). Distributions with infinite variance (such as the **Cauchy distribution** or Pareto with $\\alpha \\le 2$) completely violate the CLT; their sample averages never converge to a Gaussian."
        },
        {
          w: "A sample size of $n = 30$ is an absolute mathematical law for the CLT.",
          r: "$n = 30$ is merely an informal rule of thumb for moderately well-behaved data. For heavily skewed distributions (e.g., insurance claims or web latency), a sample size of $n = 500$ or more is required before the sample mean approaches normality."
        },
        {
          w: "Doubling the sample size $n$ cuts the margin of error in half.",
          r: "The standard error scales as $\\frac{\\sigma}{\\sqrt{n}}$. Because of the square root, halving the margin of error requires **quadrupling ($4\\times$)** the sample size $n$, not doubling it."
        }
      ],

      trade: {
        buys: [
          "The foundational justification for parametric statistics: allows using z-tests and t-tests on non-normal populations.",
          "Enables public opinion polling and A/B testing: guarantees predictable confidence intervals on sample proportions.",
          "Standard error formula ($\\sigma / \\sqrt{n}$) quantifies the exact return on investment for collecting larger sample sizes.",
          "Explains why normal distributions are ubiquitous in nature: physical measurements aggregate thousands of microscopic independent forces."
        ],
        costs: [
          "Square root scaling bottleneck ($1/\\sqrt{n}$): achieving $10\\times$ higher estimation precision requires $100\\times$ more data.",
          "Fails completely on heavy-tailed distributions with infinite variance (Cauchy, Pareto).",
          "Slow tail convergence: while the central body of the sample mean converges quickly, extreme tails ($P_{99}$) converge slowly.",
          "Requires i.i.d. data: fails when observations are strongly auto-correlated (time-series, spatial data) without cluster corrections."
        ],
        avoid: [
          "Never apply the standard CLT to financial returns or network packet data without testing for infinite variance.",
          "Do not assume $n=30$ is sufficient for normality when data is heavily skewed or contains extreme outliers.",
          "Avoid confusing the sample standard deviation ($s$) with the standard error of the mean ($s/\\sqrt{n}$)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
