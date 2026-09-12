/* ==========================================================================
   Depth pass 108 — Mathematics & Statistics batch 7: Causality, Paradoxes & Analytical Foundations.
   Correlation vs Causation, Confounding Variable, Simpson's Paradox,
   Statistics, Data Visualisation, Exploratory Data Analysis.

   Pearl structural causal DAGs, back-door adjustment criteria, and
   Tukey exploratory diagnostics complete the mathematical foundations.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "correlation-vs-causation",

      why: {
        before: "Data analysts and decision-makers routinely mistook strong statistical associations between variables (e.g., ice cream sales and drowning rates) as proof of direct causal intervention, resulting in catastrophic policy and engineering decisions.",
        problem: "Observational data alone cannot distinguish whether variable $X$ directly causes variable $Y$, whether $Y$ causes $X$ (reverse causality), whether both are driven by an unobserved confounder $Z$, or whether the association is purely spurious.",
        shift: "**Correlation vs Causation: The fundamental distinction between statistical association ($P(Y \\mid X)$) and interventional causation ($P(Y \\mid \\text{do}(X))$).** Formalized by Judea Pearl's Causal Calculus and Donald Rubin's Potential Outcomes framework, causal inference requires structural causal models (SCMs), directed acyclic graphs (DAGs), or randomized controlled trials (RCTs) to validate true causal impact."
      },

      num: {
        t: "Associational vs Causal Frameworks: Mathematical & Practical Comparison",
        h: ["Dimension", "Observational Correlation", "Interventional Causation (Pearl / Rubin)", "Mathematical Representation", "Real-World Engineering Failure"],
        r: [
          ["Target Conditioning", "Passive conditioning on observed state $X=x$", "Active experimental intervention: $\\text{do}(X=x)$", "$P(Y \\mid X=x)$ vs $P(Y \\mid \\text{do}(X=x))$", "High power users spend more; forcing unengaged users to click features doesn't increase revenue"],
          ["Confounder Vulnerability", "Hyper-vulnerable to common causes and selection bias", "Blocks non-causal spurious paths via randomization or adjustment", "Back-door criterion: $\\sum_z P(Y|x,z)P(z)$", "Hormone replacement therapy appeared to prevent heart disease due to socioeconomic confounding"],
          ["Mechanism of Discovery", "Pearson $r$, Spearman $\\rho$, Mutual Information", "Randomized A/B testing, Instrumental Variables, DiD", "Potential outcomes: $Y_i(1) - Y_i(0)$", "Feature correlation leads to useless ML feature flags with zero real uplift"],
          ["Directionality", "Symmetric: $\\text{Corr}(X, Y) = \\text{Corr}(Y, X)$", "Asymmetric directed causal flow: $X \\to Y \\not\\equiv Y \\to X$", "Structural equations: $Y := f(X, U_Y)$", "Rooster crowing correlates with sunrise; killing the rooster does not stop the sun"],
          ["Primary Tooling", "Linear regression, covariance matrices, XGBoost", "CausalML, DoWhy, EconML, Double Machine Learning", "Average Treatment Effect (ATE)", "Optimizing ads solely on click propensity targets users who would have converted anyway"]
        ],
        n: "The distinction between correlation and causation is formally codified in Judea Pearl's **do-calculus**. Passive observation computes conditional probability $P(Y=y \\mid X=x) = \\frac{P(X=x, Y=y)}{P(X=x)}$, which captures both causal flow and spurious associations flowing through shared parent confounders ($X \\leftarrow Z \\to Y$). In contrast, an intervention removes all incoming arrows into $X$ in the causal DAG, replacing them with a fixed assigned value: $P(Y=y \\mid \\text{do}(X=x))$. In the potential outcomes framework of Neyman and Rubin, each unit has two counterfactual outcomes: $Y_i(1)$ (outcome under treatment) and $Y_i(0)$ (outcome under control). Because we can only observe one reality for any given individual (the Fundamental Problem of Causal Inference), the Individual Treatment Effect $\\tau_i = Y_i(1) - Y_i(0)$ is unobservable, requiring randomized controlled trials to estimate the Average Treatment Effect (ATE): $\\mathbb{E}[Y(1) - Y(0)] = \\mathbb{E}[Y \\mid X=1] - \\mathbb{E}[Y \\mid X=0]$."
      },

      miss: [
        {
          w: "A statistically significant correlation with $p < 0.001$ from big data proves a causal relationship.",
          r: "No $p$-value, sample size, or machine learning model can convert correlation into causation without structural assumptions or randomization. In fact, massive sample sizes make completely spurious correlations (e.g., US cheese consumption vs bedsheet strangulations) statistically significant ($p < 0.001$)."
        },
        {
          w: "Controlling for every available variable in a regression model always isolates the true causal effect.",
          r: "Controlling for **colliders** (variables caused by both treatment and outcome: $X \\to C \\leftarrow Y$) or **mediators** ($X \\to M \\to Y$) opens spurious non-causal paths (Berkson's bias) or eliminates the true causal mechanism. Conditioning must follow the rigorous **back-door criterion** on causal DAGs."
        },
        {
          w: "Correlation is useless if it doesn't establish causation.",
          r: "Pure correlation is extraordinarily valuable for passive **prediction**. A self-driving car or speech recognition model does not need to know why raindrops correlate with wet roads to apply brakes safely; prediction tasks require stable associations, whereas policy/intervention tasks require causation."
        },
        {
          w: "Randomized A/B testing is immune to causal inference issues.",
          r: "A/B tests can be corrupted by non-compliance, attrition bias (selective dropouts), spillover effects (interference / SUTVA violations across network graphs), and novel bias, breaking the assumption that treatment assignment was purely independent."
        }
      ],

      trade: {
        buys: [
          "Eliminates wasted capital: prevents engineering teams from building features that correlate with engagement but drive zero incremental revenue.",
          "Mathematical rigor: provides formal language (do-calculus, DAGs, Rubin potential outcomes) to evaluate policy changes.",
          "Identifies true uplift: separates incremental conversions from organic customer activity in algorithmic marketing.",
          "Robust out-of-distribution generalization: causal models generalize across distribution shifts where observational correlations collapse."
        ],
        costs: [
          "Expensive experimentation: proving causation via RCTs requires engineering infrastructure, user traffic splits, and latency overhead.",
          "Unverifiable assumptions: observational causal inference relies on uncheckable assumptions (e.g., no unmeasured confounding).",
          "Ethical and logistical limits: many causal questions (e.g., toxic exposures or outages) cannot be ethically or physically randomized.",
          "Complex mathematical modeling: requires specialized tooling (DoWhy, EconML) beyond standard Scikit-Learn regression pipelines."
        ],
        avoid: [
          "Never assume a feature importance score in a gradient boosted tree represents the causal impact of tweaking that feature.",
          "Do not adjust for post-treatment mediators when measuring the total causal effect of an intervention.",
          "Avoid conditioning on colliders in observational analyses to prevent introducing artificial selection bias.",
          "Never deploy major business model interventions based solely on observational correlations without running an A/B test or quasi-experiment."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "confounding-variable",

      why: {
        before: "Observational studies directly compared treated groups to untreated groups, attributing all differences in outcomes directly to the treatment while ignoring underlying disparities between the cohorts.",
        problem: "Unobserved or unadjusted third variables that simultaneously influence both the treatment assignment and the outcome distort or completely reverse the perceived relationship between two variables.",
        shift: "**Confounding Variable: An extraneous variable that correlates (directly or causally) with both the independent variable (exposure/treatment) and the dependent variable (outcome).** In Pearl's graphical causal framework, a confounder is a common cause ($X \\leftarrow Z \\to Y$) creating an open 'back-door path' that injects spurious statistical association unless blocked by randomization, stratification, or propensity score matching."
      },

      num: {
        t: "Causal Graph Structures: Confounders vs Colliders vs Mediators",
        h: ["Graph Node Topology", "Graphical Representation", "Effect of Conditioning", "Spurious Association Status", "Analytics / Machine Learning Example"],
        r: [
          ["Confounder (Fork / Common Cause)", "$X \\leftarrow Z \\to Y$", "Blocks spurious path (Desirable)", "Open if unconditioned; Closed if conditioned", "User age influencing both device choice and purchase spending"],
          ["Collider (Inverted Fork)", "$X \\to Z \\leftarrow Y$", "Opens spurious path (Harmful)", "Closed if unconditioned; Open if conditioned", "Conditioning on hospital admission when studying disease interactions"],
          ["Mediator (Chain / Mechanism)", "$X \\to M \\to Y$", "Blocks direct/indirect effect", "Transmits true causal effect of $X$ onto $Y$", "Search page load latency ($X$) degrading page views ($M$) reducing revenue ($Y$)"],
          ["Instrumental Variable", "$Z \\to X \\to Y$ (no $Z \\to Y$)", "Permits identification of causal effect", "Uncorrelated with error term $U$; predicts $X$", "Lottery draft number used to estimate earnings effect of military service"],
          ["M-Bias Structure", "$X \\leftarrow U_1 \\to Z \\leftarrow U_2 \\to Y$", "Opens spurious path through collider $Z$", "Closed initially; conditioning on $Z$ creates bias", "Controlling for mother's education when unobserved genetics drive child health"]
        ],
        n: "In Judea Pearl's graphical causality, confounding is formally defined through the **Back-Door Criterion**: a set of variables $Z$ satisfies the back-door criterion relative to an ordered pair of variables $(X, Y)$ in a DAG if: (1) no node in $Z$ is a descendant of $X$, and (2) $Z$ blocks every path between $X$ and $Y$ that contains an arrow into $X$ (a back-door path). When $Z$ satisfies this criterion, the causal effect of $X$ on $Y$ is non-parametrically identifiable via the adjustment formula: $P(Y=y \\mid \\text{do}(X=x)) = \\sum_{z} P(Y=y \\mid X=x, Z=z) P(Z=z)$. In observational studies without randomized assignment, failure to adjust for an unobserved confounder $U$ creates **omitted variable bias**, rendering regression coefficients asymptotically inconsistent."
      },

      miss: [
        {
          w: "A confounder is just any variable that causes noise in the outcome variable.",
          r: "A variable that only affects the outcome $Y$ is an **independent predictor** (which actually helps reduce outcome variance). A variable is ONLY a confounder if it causally influences **both** the treatment $X$ AND the outcome $Y$ (or shares unobserved common causes with both)."
        },
        {
          w: "Machine learning algorithms like deep neural networks automatically detect and remove confounding.",
          r: "Supervised machine learning algorithms are designed to exploit ANY statistical pattern that minimizes predictive loss. If an unobserved confounder exists (e.g., hospital protocol artifact in chest X-rays), the neural net will aggressively latch onto the confounding artifact, failing catastrophically in real clinical deployment."
        },
        {
          w: "Throwing all measured features into a regression model is the safest way to eliminate confounding.",
          r: "This practice, known as **kitchen sink regression**, is dangerous. Conditioning on a **collider** ($X \\to C \\leftarrow Y$) opens a spurious association that did not previously exist (Berkson's bias), and conditioning on a **mediator** ($X \\to M \\to Y$) wipes out the true causal impact."
        },
        {
          w: "Propensity score matching can eliminate unobserved confounding.",
          r: "Propensity score matching only balances **observed** covariates included in the model. If an unmeasured confounder exists (e.g., customer grit, latent intent), matching on observed demographics leaves the residual confounding completely unaddressed."
        }
      ],

      trade: {
        buys: [
          "Causal identification: enables valid estimation of treatment effects from observational logs without physical experimentation.",
          "Protects against bad decisions: reveals when apparent metric correlations are illusions driven by user age, geography, or platform.",
          "Grounds covariate adjustment: guides principled feature selection (back-door criterion) rather than blind variable dumping.",
          "Enables quasi-experimental methods: underpins propensity score matching, regression discontinuity, and synthetic controls."
        ],
        costs: [
          "Unverifiable unobserved confounding: impossible to mathematically prove that no hidden confounder exists in purely observational data.",
          "High data collection burden: requires measuring all potential common causes prior to treatment assignment.",
          "Sample efficiency loss: stratifying or weighting across high-dimensional confounders drastically inflates estimator variance.",
          "Requires causal domain expertise: constructing an accurate Causal DAG requires deep domain knowledge, not just raw compute."
        ],
        avoid: [
          "Never condition on variables that are descendants of the treatment variable (mediators) when estimating total causal effects.",
          "Do not include collider variables in regression models; check causal DAG paths before adjusting for variables.",
          "Avoid claiming causal impact from observational datasets without explicitly listing identifying assumptions and potential confounders.",
          "Never assume a high $R^2$ in a regression model means confounding has been eliminated."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
    {
      slug: "statistics",

      why: {
        before: "Decisions across science, commerce, and engineering relied on anecdotal observation, subjective belief, or deterministic assumptions that collapsed whenever real-world systems exhibited randomness, measurement error, or variability.",
        problem: "Humans need a rigorous mathematical discipline to collect, analyze, interpret, and present data, enabling reliable inferences and optimal decisions in the presence of ubiquitous uncertainty.",
        shift: "**Statistics: The mathematical science concerned with collecting, organizing, analyzing, interpreting, and presenting quantitative data.** Divided into descriptive statistics (summarizing empirical samples) and inferential statistics (drawing probabilistic conclusions about target populations), statistics forms the foundational mathematical engine of machine learning, epidemiology, and data science."
      },

      num: {
        t: "Foundational Statistical Paradigms: Frequentist vs Bayesian vs Non-Parametric",
        h: ["Paradigm", "Interpretation of Probability", "Treatment of Parameters $\\theta$", "Handling of Prior Beliefs", "Primary Modern Engineering Application"],
        r: [
          ["Frequentist", "Long-run relative frequency across infinite trials", "Fixed, unknown deterministic constants", "Explicitly excluded; objectivity prioritized", "A/B hypothesis testing (t-test, ANOVA), p-values"],
          ["Bayesian", "Subjective degree of belief / epistemic uncertainty", "Random variables with probability distributions", "Explicitly updated: $P(\\theta \\mid D) \\propto P(D \\mid \\theta)P(\\theta)$", "Multi-armed bandits, Thompson sampling, PyMC"],
          ["Non-Parametric", "Distribution-free ranking and permutation methods", "No assumed functional form (e.g., no Gaussian assumption)", "Minimal structural assumptions", "Mann-Whitney U, Wilcoxon, Random Forests"],
          ["Statistical Learning", "Empirical risk minimization over hypothesis classes", "Parameters optimized to minimize test generalization error", "Controlled via explicit regularization ($L_1, L_2$)", "Deep learning, XGBoost, Scikit-Learn pipelines"],
          ["Causal Statistics", "Structural causal models and potential outcomes", "Identified via DAG surgery and do-calculus", "Domain-specified causal graph topologies", "Observational policy evaluation, uplift modeling"]
        ],
        n: "Statistics establishes the formal bridge between observed sample data $\\mathbf{x} = \\{x_1, \\dots, x_n\\}$ and the underlying data-generating process $P(X; \\theta)$. **Descriptive statistics** condenses raw data into summary measures of central tendency (mean, median), dispersion (variance, interquartile range), and association (covariance, correlation). **Inferential statistics** utilizes probability theory to generalize beyond the observed data: point estimation (e.g., Maximum Likelihood Estimation: $\\hat{\\theta}_{MLE} = \\arg\\max_\\theta \\sum \\log P(x_i \\mid \\theta)$), interval estimation (confidence intervals), and hypothesis testing (Neyman-Pearson lemma). In modern computation, statistics has evolved into **Statistical Learning Theory** (Vapnik-Chervonenkis theory), governing how models trained on finite empirical data bound out-of-sample generalization error: $R(f) \\le R_{emp}(f) + \\mathcal{O}\\left(\\sqrt{\\frac{VC(H)}{n}}\\right)$."
      },

      miss: [
        {
          w: "Statistics and machine learning are two completely distinct, unrelated fields.",
          r: "Machine learning is fundamentally applied computational statistics. Most ML algorithms are statistical estimators: Linear Regression is Ordinary Least Squares, Logistic Regression is Maximum Likelihood Estimation on a Bernoulli GLM, and neural networks are non-linear non-parametric statistical regression models optimized via stochastic approximation."
        },
        {
          w: "Statistics is only concerned with calculating averages and making bar charts.",
          r: "Calculating averages is merely elementary descriptive statistics. Advanced statistics encompasses high-dimensional probability theory, asymptotic analysis, stochastic differential equations, Markov Decision Processes, spatial point processes, and non-parametric functional data analysis."
        },
        {
          w: "If you have enough big data, statistical principles become irrelevant.",
          r: "Big data amplifies statistical bias. Having a billion unrepresentative data points yields an extremely narrow confidence interval centered precisely on the wrong number. Massive sample sizes make tiny, irrelevant confounding associations appear overwhelmingly significant."
        },
        {
          w: "Frequentist and Bayesian statistics always yield contradictory conclusions.",
          r: "Under the Bernstein-von Mises theorem, as the sample size $n \\to \\infty$, Bayesian posterior distributions converge asymptotically to the normal distribution centered at the Frequentist Maximum Likelihood Estimator, making both paradigms yield identical practical inferences."
        }
      ],

      trade: {
        buys: [
          "Rigorous uncertainty quantification: quantifies exactly how confident engineers can be in any empirical finding or prediction.",
          "Protects against noise chasing: distinguishes real systematic signals from random stochastic fluctuations in telemetry.",
          "Optimal decision frameworks: provides formal mathematical criteria (loss functions, Bayes risks) for automated systems.",
          "Sample efficiency: enables extracting maximum statistical power from limited, expensive physical experiments."
        ],
        costs: [
          "Distributional assumptions: classical parametric methods fail if underlying normality or independence assumptions are violated.",
          "Computational complexity: Bayesian MCMC sampling or bootstrapping across terabyte datasets demands heavy distributed compute.",
          "Communication difficulty: statistical concepts (p-values, confidence intervals, power) are routinely misunderstood by teams.",
          "Vulnerable to methodological abuse: p-hacking, publication bias, and HARKing (hypothesizing after results are known) can invalidate findings."
        ],
        avoid: [
          "Never report a point estimate (e.g., 'conversion is 4.2%') without an accompanying measure of uncertainty (e.g., standard error or 95% CI).",
          "Do not assume that massive data volume eliminates the need for proper statistical sampling and bias controls.",
          "Avoid using standard parametric statistics on severely skewed, fat-tailed, or zero-inflated operational metrics.",
          "Never treat machine learning models as black boxes decoupled from statistical assumptions regarding data-generating distributions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-visualisation",

      why: {
        before: "Engineers and researchers relied entirely on summary statistical tables (mean, variance, correlation), failing to detect critical nonlinearities, cluster structures, or severe data corruption lurking inside datasets.",
        problem: "Raw numerical arrays and high-level summary statistics conceal complex multidimensional patterns, distributional distortions, and anomalies that the human visual cortex can identify in milliseconds.",
        shift: "**Data Visualisation: The graphical representation of information and quantitative data using visual elements like charts, graphs, maps, and multidimensional projections.** Grounded in Jacques Bertin's visual semiology and Edward Tufte's graphical integrity principles, effective data visualisation translates numerical relationships into pre-attentive visual attributes (position, length, hue, area) to enable rapid cognitive discovery."
      },

      num: {
        t: "Anscombe's Quartet: Demonstrating the Imperative of Data Visualisation",
        h: ["Dataset Property", "Dataset I", "Dataset II", "Dataset III", "Dataset IV", "Visual Reality Revealed"],
        r: [
          ["Mean of $X$ / Mean of $Y$", "$\\mu_x = 9.0$, $\\mu_y = 7.50$", "$\\mu_x = 9.0$, $\\mu_y = 7.50$", "$\\mu_x = 9.0$, $\\mu_y = 7.50$", "$\\mu_x = 9.0$, $\\mu_y = 7.50$", "Identical first moments across all four datasets"],
          ["Sample Variance of $X$ / $Y$", "$S_x^2 = 11.0$, $S_y^2 = 4.125$", "$S_x^2 = 11.0$, $S_y^2 = 4.125$", "$S_x^2 = 11.0$, $S_y^2 = 4.125$", "$S_x^2 = 11.0$, $S_y^2 = 4.125$", "Identical second moments across all four datasets"],
          ["Linear Regression Line", "$y = 3.00 + 0.500x$", "$y = 3.00 + 0.500x$", "$y = 3.00 + 0.500x$", "$y = 3.00 + 0.500x$", "Identical regression coefficients and $R^2 = 0.67$"],
          ["Graphical Shape (Visual)", "Standard linear scatter with noise", "Smooth quadratic parabolic curve", "Perfect linear line with 1 extreme outlier", "Vertical cluster at $x=8$ with 1 distant point", "Radically different physical structures completely hidden by statistics"],
          ["Correct Modeling Action", "Standard Linear Regression", "Polynomial Regression ($y = ax^2 + bx$)", "Robust Regression (Huber / RANSAC)", "Categorical split / Outlier investigation", "Only revealed upon graphical visual inspection"]
        ],
        n: "The theoretical necessity of data visualization is epitomized by **Anscombe's Quartet** (1973) and the modern **Datasaurus Dozen** (Matejka & Fitzmaurice, 2017), where datasets with identical means, standard deviations, and correlation coefficients exhibit wildly divergent visual structures (including a literal dinosaur). Human visual perception processes **pre-attentive visual attributes** (Cleveland & McGill, 1984) along a rigorous hierarchy of cognitive accuracy: (1) Position along a common scale (most accurate, as in scatter plots and dot plots), (2) Length (bar charts), (3) Direction/Angle (line charts, pie charts), (4) Area (bubble charts), and (5) Color saturation/hue (heatmaps). Visualizations that map continuous quantitative metrics to lower-accuracy perceptual channels (such as 3D angles or circular slices) impose unnecessary cognitive cognitive load and distort statistical interpretation."
      },

      miss: [
        {
          w: "Data visualisation is just aesthetic graphic design to make reports look pretty for executives.",
          r: "Data visualisation is a core **computational diagnostic tool**. In machine learning, embedding visualizers (t-SNE, UMAP), ROC/PR curves, confusion matrices, and residual plots are essential instruments for debugging gradient collapse, data leakage, and class confusion."
        },
        {
          w: "Pie charts are an effective way to compare five or six categories.",
          r: "The human visual cortex is notoriously poor at decoding angular area and arc length compared to linear position. Extensive perceptual research shows users struggle to accurately compare slices of pie charts; a simple horizontal bar chart ordered by magnitude is cognitively superior in virtually all operational use cases."
        },
        {
          w: "Adding 3D effects to charts makes them look more modern and informative.",
          r: "3D perspective projections introduce severe optical distortion (occlusion, foreshortening, and false depth cues), completely corrupting the data-to-ink ratio and preventing accurate metric comparison."
        },
        {
          w: "A chart cannot lie if it accurately plots the raw database numbers.",
          r: "Visualizations frequently mislead without lying about raw numbers: truncating the y-axis on bar charts artificially inflates tiny percentage differences, using dual unaligned y-axes creates false correlations, and unnormalized geographic choropleth maps simply display population density."
        }
      ],

      trade: {
        buys: [
          "Rapid pattern and anomaly recognition: harnesses the human visual cortex to detect clusters, trends, and outliers in milliseconds.",
          "Debugging diagnostic power: reveals model failures (e.g., residual heteroscedasticity, label flips) that summary metrics miss.",
          "High-bandwidth communication: conveys complex multidimensional findings to diverse cross-functional stakeholders instantly.",
          "Facilitates EDA: accelerates hypothesis generation during the initial phases of machine learning data exploration."
        ],
        costs: [
          "Cognitive distortion risks: poor design choices (truncated axes, 3D projections, misleading scales) corrupt user judgment.",
          "High rendering overhead: plotting millions of raw points in the browser causes DOM thrashing and browser crashes without downsampling.",
          "Over-simplification hazard: 2D/3D projections (e.g., t-SNE, PCA) compress high-dimensional manifolds, potentially creating illusory clusters.",
          "Accessibility overhead: demands rigorous color-blind safe palettes (Viridis, ColorBrewer) and screen-reader accessible alternatives."
        ],
        avoid: [
          "Never truncate the y-axis to a non-zero baseline on bar charts, as bar length must encode absolute magnitude.",
          "Do not plot millions of individual SVG points in a web dashboard; use canvas WebGL rendering (Deck.gl) or rasterized hexbin aggregation.",
          "Avoid using rainbow ('jet') colormaps; use perceptually uniform colormaps like `viridis`, `plasma`, or `cividis`.",
          "Never rely on a single summary dashboard without giving users drill-down access to underlying granular distributions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "exploratory-data-analysis",

      why: {
        before: "Data practitioners jumped directly into confirmatory hypothesis testing or training complex predictive models on raw datasets, without inspecting data hygiene, distributions, anomalies, or underlying structure.",
        problem: "Models trained on uninspected data suffer from silent data corruption, unhandled missingness patterns, severe collinearity, survivorship bias, and target leakage, leading to catastrophic production failures.",
        shift: "**Exploratory Data Analysis (EDA): An approach to analyzing datasets to summarize their main characteristics, often using visual methods and non-parametric summaries, without imposing rigid prior model assumptions.** Pioneered by John Tukey in 1977, EDA advocates letting the data suggest hypotheses and uncover its own structure before formal confirmatory modeling begins."
      },

      num: {
        t: "EDA Diagnostic Stages: Systematic Data Profiling Protocol",
        h: ["Diagnostic Stage", "Primary Analytical Operations", "Key Statistical Tools", "Critical Production Defect Uncovered", "Tooling / Framework"],
        r: [
          ["Univariate Profiling", "Inspect feature distributions, central tendency, spread, skew", "Histograms, KDE plots, box plots, quantiles", "Severe multi-modality, zero-inflation, extreme 10-sigma outliers", "Pandas `describe()`, Polars, Seaborn"],
          ["Bivariate / Multivariate", "Analyze pairwise relationships, correlations, cross-tabulations", "Scatter matrices, Pearson/Spearman heatmaps, pairplots", "Extreme multicollinearity (VIF > 10), Simpson's Paradox", "Pingouin, Scipy, Statsmodels"],
          ["Missingness Audit", "Identify missing data mechanisms (MCAR, MAR, MNAR)", "Nullity matrices, missing correlation heatmaps", "Systematic telemetry dropouts, sensor failures disguised as 0s", "Missingno, Great Expectations"],
          ["Cardinality & Encodings", "Evaluate distinct categorical counts, frequency tails, drift", "Frequency tables, rank-frequency log plots (Zipf)", "High-cardinality exploding one-hot encodings, rare levels", "YData Profiling, Sweetviz"],
          ["Target Leakage Audit", "Correlate candidate features against prediction target", "Mutual information scores, temporal split correlation", "Features populated after the target event occurred in time", "Scikit-Learn `mutual_info_classif`"]
        ],
        n: "John Tukey established EDA as a counterweight to classical over-reliance on rigid confirmatory hypothesis testing. EDA follows an iterative loop: (1) Formulate questions, (2) Search for answers through data visualization, transformation, and profiling, (3) Refine questions and generate hypotheses. Mathematically, EDA relies on **robust statistics** that do not presuppose Gaussian normality: the **five-number summary** (minimum, first quartile $Q_1$, median $\\tilde{x}$, third quartile $Q_3$, maximum) and the **Interquartile Range** ($IQR = Q_3 - Q_1$). Tukey's boxplot operationalizes outlier detection by setting fences at $[Q_1 - 1.5 \\cdot IQR, \\; Q_3 + 1.5 \\cdot IQR]$, isolating data points outside this range for manual inspection. In modern machine learning pipelines, systematic EDA prevents **target leakage** (features incorporating information from the future) and identifies **covariate shift** between training and inference partitions."
      },

      miss: [
        {
          w: "Automated profiling tools (e.g., Pandas-Profiling/YData) make manual EDA obsolete.",
          r: "Automated profiling reports generate high-level univariate summaries, but cannot understand domain semantics. Automated tools cannot detect that a column named `account_closed_reason` leaks the target label `churn`, or that a feature's values changed abruptly due to an upstream database schema migration."
        },
        {
          w: "EDA is only performed once at the very start of a machine learning project.",
          r: "EDA is a continuous lifecycle discipline. In production systems, **Continuous EDA** must be applied to incoming inference feature stores to detect data drift, schema anomalies, sensor degradation, and concept drift before predictions degrade."
        },
        {
          w: "Outliers identified during EDA should always be immediately removed.",
          r: "Outliers are often the most valuable part of the dataset. In fraud detection, cybersecurity, and rare disease diagnosis, the outliers represent the actual target events of interest. Deleting them blinds models to the exact phenomenon they are built to detect."
        },
        {
          w: "EDA is unscientific because it does not follow formal hypothesis testing.",
          r: "EDA and Confirmatory Data Analysis (CDA) are complementary. Confirmatory testing requires pre-specified hypotheses; formulating meaningful, high-leverage hypotheses in the first place requires deep, unconstrained exploratory data analysis."
        }
      ],

      trade: {
        buys: [
          "Early bug and leakage detection: catches target leakage, sensor failures, and data entry corruptions before modeling.",
          "Informs feature engineering: uncovers non-linear relationships, interaction terms, and necessary mathematical transformations (log, Box-Cox).",
          "Prevents model deployment failures: ensures training distributions match operational production realities.",
          "Domain alignment: deepens data science understanding of the real-world business generation mechanisms underlying the data."
        ],
        costs: [
          "Time and resource investment: rigorous EDA can consume $50\\text{--}70\\%$ of total data science project time.",
          "Risk of overfitting and p-hacking: exploring data too aggressively can tempt analysts to formulate hypotheses tailored specifically to noise.",
          "Scalability bottlenecks: computing pairwise correlation matrices and pairplots across terabyte-scale datasets is computationally prohibitive.",
          "Requires deep domain expertise: raw profiling numbers are useless without domain context to interpret anomalous patterns."
        ],
        avoid: [
          "Never train a machine learning model without first running a comprehensive missing value and outlier audit across all features.",
          "Do not automatically drop missing rows without diagnosing whether the missingness is MCAR, MAR, or MNAR.",
          "Avoid running full pairwise scatter plots on millions of rows in memory; downsample or compute binned 2D histograms.",
          "Never treat values like `-1`, `999`, or `0` as valid numerical quantities without checking if they were used as sentinel null codes."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
