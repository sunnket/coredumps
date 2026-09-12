/* ==========================================================================
   Depth pass 106 — Mathematics & Statistics batch 5: Sampling & Hypothesis Testing.
   Sampling, Hypothesis Testing, Null Hypothesis, P-Value,
   Confidence Interval, Statistical Significance, Type I and Type II Error.

   Neyman-Pearson decision frameworks control critical type-I rejection thresholds;
   dual confidence intervals invert asymptotic test statistics over parameter manifolds.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "sampling",

      why: {
        before: "Measuring population metrics required an exhaustive, complete census of every individual entity (interviewing all 300 million citizens or testing every manufacturing part to destruction), which was physically impossible, prohibitively expensive, and destructive.",
        problem: "Organizations need to make highly accurate statistical inferences about vast populations by measuring only a tiny fraction of observations, without introducing systematic selection bias.",
        shift: "**Sampling: The statistical methodology of selecting a representative subset of individuals or observations from within a statistical population to estimate characteristics of the whole.** Formalized through probability sampling designs (Simple Random, Stratified, Cluster, Reservoir) and computational sampling (MCMC, Bootstrap)."
      },

      num: {
        t: "Sampling Methodologies: Design, Variance Reduction & Algorithmic Complexities",
        h: ["Sampling Methodology", "Selection Mechanism", "Primary Advantage", "Design Effect / Variance", "Machine Learning / Big Data Use"],
        r: [
          ["Simple Random Sampling (SRS)", "Every entity has equal probability $\\pi_i = n/N$", "Unbiased baseline; zero prior knowledge required", "Baseline variance ($S^2/n$)", "Random train/test cross-validation splits"],
          ["Stratified Sampling", "Partitioned into strata; sampled proportionally or optimally", "Guarantees representation of rare minority cohorts", "Variance reduction ($< \\text{Var}_{\\text{SRS}}$)", "Imbalanced classification (stratified k-fold)"],
          ["Cluster Sampling", "Clusters sampled randomly; all units in cluster measured", "Extreme cost efficiency in geographic field surveys", "Variance inflation ($\\text{Deff} > 1$)", "Distributed edge device telemetry collection"],
          ["Reservoir Sampling", "Online streaming algorithm over unknown stream size $N$", "Exact uniform sampling over unbounded streams in $O(N)$", "Matches SRS on streaming logs", "Kafka / network packet streaming telemetry"],
          ["Bootstrap Resampling", "Sampling with replacement ($n$ from $n$)", "Non-parametric standard error & confidence estimation", "Simulates sampling distribution", "Random Forest bagging (Bootstrap Aggregation)"]
        ],
        n: "Sampling theory bridges finite empirical samples to infinite target populations. A probability sample assigns every unit $i$ a known non-zero inclusion probability $\\pi_i = P(i \\in S)$. The Horvitz-Thompson estimator provides an unbiased estimate of the population total: $\\hat{Y}_{HT} = \\sum_{i \\in S} \\frac{y_i}{\\pi_i}$. In modern big data and streaming systems where total length $N$ is unknown, **Reservoir Sampling (Algorithm R)** maintains a representative sample of size $k$ in a single pass: the reservoir is filled with the first $k$ items; for each subsequent item $i > k$, a random integer $j \\in [1, i]$ is generated. If $j \\le k$, the item replaces element $j$ in the reservoir, mathematically guaranteeing that every item in the stream has an exact uniform probability $\\frac{k}{N}$ of being selected."
      },

      miss: [
        {
          w: "A sample of 1,000 people cannot accurately predict an election in a country of 300 million people.",
          r: "This is the **Sample Size Fallacy**. In probability theory, the margin of error of a sample depends almost entirely on the **absolute sample size $n$** ($\\text{SE} \\approx 1/\\sqrt{n}$), NOT on the population size $N$ (as long as $N > 10 n$). A properly randomized sample of 1,000 people yields approximately $\\pm 3\\%$ margin of error whether the population is 100,000 or 1 billion."
        },
        {
          w: "A massive un-randomized dataset (e.g., 10 million Twitter users) is better than a small randomized sample of 1,000.",
          r: "Big data cannot compensate for **Selection Bias**. The classic 1936 Literary Digest poll surveyed 2.4 million people and failed catastrophically because the sample was biased toward wealthy car owners, whereas George Gallup accurately predicted the election using a representative sample of only 50,000."
        },
        {
          w: "Sampling with replacement and sampling without replacement are identical.",
          r: "Sampling with replacement allows the same entity to be selected multiple times, maintaining independent probabilities across draws (the basis of **Bootstrapping** in Random Forests). Sampling without replacement alters probabilities on subsequent draws, governed by hypergeometric distributions."
        },
        {
          w: "Convenience sampling (surveying whoever is available) is fine if you apply statistical weighting.",
          r: "If a subpopulation has a zero probability of inclusion ($\\pi_i = 0$), statistical weighting cannot reconstruct the missing data. True probability sampling requires every unit to have a non-zero, known inclusion probability."
        }
      ],

      trade: {
        buys: [
          "Massive resource efficiency: estimates population metrics to high accuracy using a tiny fraction of data volume.",
          "Enables non-destructive testing: evaluate quality without destroying an entire manufacturing inventory.",
          "Reservoir sampling enables uniform statistical tracking over infinite, unbounded real-time data streams.",
          "Bootstrapping enables robust non-parametric confidence interval estimation without assuming normality."
        ],
        costs: [
          "Sampling error: introduces irreducible random sampling variance (margin of error) that scales as $1/\\sqrt{n}$.",
          "Selection bias risk: flawed sampling frames or voluntary non-response corrupt findings systematically.",
          "Complex survey weighting: stratified and cluster designs require complex design effect (Deff) variance math.",
          "Rare subgroup challenges: tiny minority cohorts require over-sampling to achieve statistical significance."
        ],
        avoid: [
          "Never evaluate machine learning models on un-stratified train/test splits when classes are heavily imbalanced.",
          "Do not assume large sample sizes compensate for non-representative selection bias.",
          "Avoid using standard random sampling on infinite streaming data; use Reservoir Sampling."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hypothesis-testing",

      why: {
        before: "Scientific discoveries and medical treatments were evaluated based on subjective human impressions or unvalidated anecdotal claims, unable to distinguish between a genuine effect and random chance variation.",
        problem: "In any empirical experiment, an observed difference (e.g., a drug group healing 5% faster, or a website variant converting 2% higher) might be a true effect or pure random noise; science needed a formal decision framework to rule out luck.",
        shift: "**Hypothesis Testing: A formal statistical decision-making framework for determining whether empirical evidence from a sample provides sufficient statistical support to reject a default baseline hypothesis (Null Hypothesis).** Formalized by Ronald Fisher, Jerzy Neyman, and Egon Pearson, anchoring modern scientific validation."
      },

      num: {
        t: "Standard Statistical Hypothesis Tests, Test Statistics & Data Assumptions",
        h: ["Statistical Test", "Test Statistic Formulation", "Parametric Assumption", "Degrees of Freedom", "Typical Machine Learning / Business Use"],
        r: [
          ["One-Sample Z-Test", "$Z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$", "Normal distribution + Known population $\\sigma$", "N/A (Standard Normal)", "Quality control testing against known industry standard"],
          ["Two-Sample Student's t-Test", "$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p \\sqrt{1/n_1 + 1/n_2}}$", "Normal distributions + Equal variances", "$n_1 + n_2 - 2$", "Standard A/B testing conversion comparison"],
          ["Welch's t-Test", "$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$", "Normal distributions + UNEQUAL variances", "Satterthwaite approximation", "Production A/B testing (robust default across tech industry)"],
          ["Chi-Square ($\\chi^2$) Test", "$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$", "Categorical counts (contingency table)", "$(r-1)(c-1)$", "A/B test click-through conversions / independence testing"],
          ["ANOVA (F-Test)", "$F = \\frac{\\text{MS}_{\\text{between}}}{\\text{MS}_{\\text{within}}}$", "Normal distributions across $k$ groups", "$k-1, N-k$", "Multi-variant A/B/n testing across 3+ UI designs"]
        ],
        n: "Hypothesis testing operates as a formal proof by contradiction within the **Neyman-Pearson Framework**: (1) **Null Hypothesis ($H_0$)**: Asserts no real effect, difference, or relationship exists. (2) **Alternative Hypothesis ($H_1$)**: Asserts a genuine effect exists. (3) **Test Statistic Calculation**: Sample data is transformed into a standardized test statistic ($Z, t, F, \\chi^2$) whose theoretical distribution under $H_0$ is known. (4) **Decision Rule**: Prior to the experiment, a significance threshold $\\alpha$ (typically $0.05$) is established, defining the **Critical Region**. If the observed test statistic falls in the critical region (or equivalently, if $p \\le \\alpha$), $H_0$ is rejected, concluding that the observed effect is statistically significant."
      },

      miss: [
        {
          w: "Failing to reject the Null Hypothesis ($p > 0.05$) proves that the Null Hypothesis is true.",
          r: "This is a fundamental logical error: **Absence of evidence is not evidence of absence**. A high p-value means only that the sample data is insufficient to rule out chance (often due to small sample size or high noise). In statistics, you 'fail to reject' $H_0$; you **never** 'accept' $H_0$."
        },
        {
          w: "A hypothesis test proves whether an effect is practically and commercially important.",
          r: "Statistical significance is NOT practical significance. With a sample of 10,000,000 users, an A/B test can detect a 0.0001% increase in click rate with $p < 0.001$ (statistically significant), but the revenue gain may be completely negligible compared to infrastructure costs."
        },
        {
          w: "The Student's t-test should always be used for comparing two sample means.",
          r: "Student's t-test assumes **equal variances** between groups. If sample sizes or variances differ (standard in online A/B tests), Student's t-test produces inflated false-positive rates. **Welch's t-test** does not assume equal variance and is the modern industry standard default."
        },
        {
          w: "You can formulate the alternative hypothesis after looking at the experiment results.",
          r: "Formulating hypotheses after inspecting data is **HARKing (Hypothesizing After Results are Known)**. It invalidates the mathematics of probability theory, turning random noise into apparent discoveries and destroying scientific reproducibility."
        }
      ],

      trade: {
        buys: [
          "Provides an objective, mathematically rigorous standard to distinguish true discoveries from random chance.",
          "Protects companies from rolling out placebo features or harmful algorithm modifications.",
          "Establishes a common universal language for scientific validation across medicine, biology, and computer science.",
          "Well-calibrated control over False Positive risks via pre-specified significance levels ($\\alpha$)."
        ],
        costs: [
          "Vulnerable to P-Hacking and multiple testing contamination without strict correction methods.",
          "Binary decision trap: reduces nuanced continuous scientific inquiry to a rigid binary 'significant / not significant' switch.",
          "Does not measure effect size: a statistically significant result can be commercially meaningless.",
          "Requires strict assumptions: parametric tests fail if data severely violates normality or independence assumptions."
        ],
        avoid: [
          "Never formulate your hypothesis after inspecting the experimental data; preregister hypotheses.",
          "Do not use Student's t-test for A/B testing without verifying variance equality; use Welch's t-test.",
          "Avoid reporting statistical significance without simultaneously reporting the Effect Size (Cohen's d) and Confidence Interval."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "null-hypothesis",

      why: {
        before: "Researchers approached data analysis with confirmation bias, seeking only data that confirmed their pet theories while ignoring contradictory evidence.",
        problem: "In statistical decision theory, you cannot prove a positive claim directly from noisy sample data; you need a neutral, conservative baseline anchor against which all empirical claims must be tested.",
        shift: "**Null Hypothesis ($H_0$): The default, conservative baseline proposition that there is no true relationship, no difference between groups, or no effect in the population.** In statistical hypothesis testing, $H_0$ is assumed innocent until proven guilty beyond a reasonable doubt ($p \\le \\alpha$)."
      },

      num: {
        t: "Null vs Alternative Hypotheses Across Core Scientific & Engineering Contexts",
        h: ["Context / Domain", "Null Hypothesis ($H_0$)", "Alternative Hypothesis ($H_1$)", "Directional Nature", "Burden of Proof"],
        r: [
          ["Web A/B Testing", "$\\mu_{\\text{variant}} - \\mu_{\\text{control}} = 0$ (No conversion difference)", "$\\mu_{\\text{variant}} \\ne \\mu_{\\text{control}}$ (Two-tailed) or $> 0$ (One-tailed)", "Typically Two-Tailed", "On new variant to prove metric lift"],
          ["Clinical Drug Trial", "$\\mu_{\\text{drug}} - \\mu_{\\text{placebo}} \\le 0$ (Drug has no therapeutic benefit)", "$\\mu_{\\text{drug}} - \\mu_{\\text{placebo}} > 0$ (Drug is effective)", "One-Tailed", "On pharmaceutical company to prove clinical efficacy"],
          ["Criminal Law (Analog)", "Defendant is Innocent ($H_0$)", "Defendant is Guilty ($H_1$)", "Presumption of innocence", "On prosecution to prove guilt beyond reasonable doubt"],
          ["Model Drift Detection", "$P(X_{\\text{prod}}) = P(X_{\\text{train}})$ (Data has not drifted)", "$P(X_{\\text{prod}}) \\ne P(X_{\\text{train}})$ (Data has drifted)", "Two-Tailed distribution divergence", "On drift detector to trigger automated retraining"],
          ["Feature Importance", "$\\beta_i = 0$ (Feature $X_i$ has zero effect on $Y$)", "$\\beta_i \\ne 0$ (Feature $X_i$ is a statistically significant predictor)", "Two-Tailed", "On feature to prove predictive association"]
        ],
        n: "The Null Hypothesis ($H_0$) represents the **mathematical baseline model** of the universe under which the probability distribution of the test statistic is calculated: $P(\\text{Data} \\mid H_0)$. It is the mathematical embodiment of Occam's Razor and the scientific method: by default, we assume that any observed difference in our sample is the result of random sampling noise. An experiment can yield only two outcomes regarding $H_0$: (1) **Reject $H_0$**: The empirical data is so wildly improbable under the assumption of $H_0$ ($p \\le \\alpha$) that we reject the baseline in favor of $H_1$. (2) **Fail to Reject $H_0$**: The empirical data is plausibly consistent with random chance ($p > \\alpha$); we retain the baseline status quo."
      },

      miss: [
        {
          w: "Failing to reject $H_0$ means we have proven that $H_0$ is true.",
          r: "You can never 'prove' the null hypothesis. In a criminal trial, a verdict of 'Not Guilty' does not prove the defendant is innocent; it proves only that the prosecution failed to provide enough evidence to prove guilt. In statistics, we 'fail to reject' $H_0$."
        },
        {
          w: "The Null Hypothesis must always assert that a parameter equals zero ($H_0: \\mu = 0$).",
          r: "While common, $H_0$ can assert any specific baseline value (e.g., $H_0: \\mu \\ge 50$ for minimum strength, or $H_0: \\mu_{\\text{new}} - \\mu_{\\text{old}} \\le \\delta$ for non-inferiority trials in medicine)."
        },
        {
          w: "Rejecting $H_0$ proves that the Alternative Hypothesis is 100% true.",
          r: "Rejecting $H_0$ means only that the data is unlikely under the null. There remains a probability $\\alpha$ (typically 5%) that $H_0$ was actually true and our rejection was a **Type I error (False Positive)**."
        },
        {
          w: "The Null Hypothesis is formulated after analyzing the experiment data.",
          r: "The Null Hypothesis must be established **strictly before** data collection begins. Altering $H_0$ post-hoc based on observations destroys the validity of statistical significance testing."
        }
      ],

      trade: {
        buys: [
          "Provides a conservative, objective baseline that prevents researchers from chasing random sampling noise.",
          "Establishes the exact probability distribution needed to calculate analytical p-values and critical thresholds.",
          "Prevents harmful corporate actions: requires new algorithm variants to prove superiority before replacing champions.",
          "Formalizes scientific skepticism: anchors decision-making in empirical proof rather than intuition."
        ],
        costs: [
          "Logical misunderstanding: non-statisticians routinely misinterpret 'fail to reject' as proving no effect exists.",
          "Conservative bias: can lead to Type II errors (failing to adopt great features because sample size was too small).",
          "Straw-man nulls: testing against a trivial null ($H_0: \\beta = 0$) can declare tiny, economically useless effects 'significant'.",
          "Does not quantify the magnitude or business value of the alternative hypothesis."
        ],
        avoid: [
          "Never write 'we accept the null hypothesis' in reports; use 'we fail to reject the null hypothesis'.",
          "Do not change your Null Hypothesis from two-tailed to one-tailed after seeing which direction the data moved.",
          "Avoid testing against a zero null when a meaningful business non-inferiority margin exists."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "p-value",

      why: {
        before: "Scientific claims were debated based on subjective interpretations of raw data differences, lacking an objective quantitative metric to measure how unusual an observation was under the assumption of pure chance.",
        problem: "When an A/B test variant shows a 3% lift in revenue, decision-makers need a precise mathematical probability to answer: 'How likely is it that we would see a 3% lift purely by random chance if the new variant had zero real effect?'",
        shift: "**P-Value: The probability, calculated under the assumption that the Null Hypothesis is true, of obtaining a test statistic result at least as extreme as the one actually observed in the sample data.** Formalized by Ronald Fisher in the 1920s, serving as the most widely used—and most widely misunderstood—metric in empirical science."
      },

      num: {
        t: "P-Value Thresholds, Statistical Interpretations & Scientific Decision Contexts",
        h: ["P-Value Magnitude", "Fisherian Interpretation", "Neyman-Pearson Decision ($\\alpha = 0.05$)", "Strength of Evidence Against $H_0$", "Typical Scientific / Business Domain"],
        r: [
          ["$p > 0.10$", "Weak or no evidence against $H_0$", "Fail to reject $H_0$", "Consistent with random chance variation", "Standard underpowered experimental result"],
          ["$0.05 < p \\le 0.10$", "Marginal / suggestive trend", "Fail to reject $H_0$", "Cannot claim statistical significance", "Often reported as 'approaching significance'"],
          ["$0.01 < p \\le 0.05$", "Moderate evidence against $H_0$", "Reject $H_0$ (Statistically Significant)", "Data is sufficiently surprising under $H_0$", "Standard tech A/B testing & social science threshold"],
          ["$p \\le 0.001$", "Strong evidence against $H_0$", "Reject $H_0$ (Highly Significant)", "Very unlikely to observe under pure chance", "Clinical medical trials / FDA drug approvals"],
          ["$p \\le 3 \\times 10^{-7}$", "$5\\sigma$ (Five-Sigma standard)", "Definitive Discovery", "Extremely improbable under noise ($1$ in $3.5$ million)", "Particle physics (Higgs Boson discovery at CERN)"]
        ],
        n: "The p-value is a conditional probability statement about the **data**, NOT the hypothesis: $p = P(T(X) \\ge t_{\\text{obs}} \\mid H_0)$, where $T(X)$ is the test statistic and $t_{\\text{obs}}$ is the value calculated from the observed sample. For a standard two-tailed z-test, $p = 2 [1 - \\Phi(|z_{\\text{obs}}|)]$. The p-value measures how 'surprising' the sample data is under the assumption of the null hypothesis: a tiny p-value ($p = 0.001$) means the observed data would occur only $1$ in $1,000$ times if the null were true, leading us to reject $H_0$. Crucially, under the null hypothesis, the theoretical distribution of the p-value itself is **strictly Uniform on $[0, 1]$**: $P(p \\le u \\mid H_0) = u$, meaning that setting a rejection threshold of $\\alpha = 0.05$ will falsely reject a true null hypothesis exactly $5\\%$ of the time by design."
      },

      miss: [
        {
          w: "A p-value of 0.03 means there is a 3% chance that the Null Hypothesis is true.",
          r: "This is the single most common statistical fallacy on Earth. The p-value is $P(\\text{Data} \\mid H_0)$, NOT $P(H_0 \\mid \\text{Data})$. The p-value assumes $H_0$ is 100% true from the start; calculating the probability that a hypothesis is true requires Bayesian posterior inference ($P(H_0 \\mid D)$)."
        },
        {
          w: "A p-value of 0.03 means there is a 97% chance that the experiment's results will replicate.",
          r: "The p-value does not measure replication probability. In fact, an experiment with $p = 0.04$ and $80\\%$ power has a replication probability of less than $60\\%$ in a repeated trial."
        },
        {
          w: "A smaller p-value proves that the new algorithm has a larger business impact.",
          r: "The p-value measures **statistical evidence against chance**, NOT effect size. With a sample of 50 million users, an imperceptible 0.00001% conversion increase can yield $p = 10^{-15}$. Always report effect size alongside p-values."
        },
        {
          w: "P-values can be checked continuously during an A/B test, stopping the test when $p < 0.05$.",
          r: "This is **P-Hacking (Peeking)**. Because p-values fluctuate randomly over time under the null hypothesis, repeatedly testing and stopping when $p < 0.05$ inflates the true False Positive rate from $5\\%$ to over $30\\%$. Sample sizes must be fixed in advance."
        }
      ],

      trade: {
        buys: [
          "Standardized, objective continuous metric to evaluate whether empirical data is consistent with chance.",
          "Universal baseline across scientific literature, tech A/B testing, and regulatory validation.",
          "Controls the maximum acceptable Type I error rate (False Positive rate) when paired with threshold $\\alpha$.",
          "Calculated instantaneously from standard test statistics ($z, t, F, \\chi^2$) without complex software."
        ],
        costs: [
          "Routinely misunderstood and misrepresented by engineers, business leaders, and scientists.",
          "Vulnerable to P-Hacking, data dredging, and peeking in online A/B testing platforms.",
          "Conflates sample size with effect size: massive datasets produce tiny p-values for trivial real-world differences.",
          "Does not measure the probability that a hypothesis is true or that a discovery will replicate."
        ],
        avoid: [
          "Never interpret the p-value as the probability that the null hypothesis is true.",
          "Do not stop A/B testing experiments early the moment the p-value crosses below 0.05; run to full sample size.",
          "Avoid reporting p-values without including effect size estimates (e.g., Cohen's d) and confidence intervals."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "confidence-interval",

      why: {
        before: "Reporting a single point estimate (e.g., 'the model improves revenue by 3.2%') provided a false illusion of precision, giving decision-makers zero visibility into the statistical margin of error or uncertainty of the measurement.",
        problem: "Sample data is subject to random sampling noise; a point estimate alone cannot tell you whether the true population value is reliably between 3.0% and 3.4%, or wildly uncertain between -1.5% and +7.9%.",
        shift: "**Confidence Interval (CI): A range of plausible values for an unknown population parameter, constructed from sample data such that a specified percentage of such intervals (typically 95%) would contain the true parameter value under repeated sampling.** Formalized by Jerzy Neyman in 1937, providing an indispensable dual alternative to p-values."
      },

      num: {
        t: "Confidence Interval Widths, Confidence Levels & Standard Multipliers ($Z^*$)",
        h: ["Confidence Level ($1 - \\alpha$)", "Critical Value ($Z^*$ for Normal)", "Interval Formulation", "Coverage Guarantee", "Margin of Error Relative Width"],
        r: [
          ["90% Confidence Interval", "$Z^* = 1.645$", "$\\bar{x} \\pm 1.645 \\cdot \\frac{\\sigma}{\\sqrt{n}}$", "90% of repeated CIs contain true $\\mu$", "Narrowest (lower certainty, higher precision)"],
          ["95% Confidence Interval", "$Z^* = 1.960$", "$\\bar{x} \\pm 1.960 \\cdot \\frac{\\sigma}{\\sqrt{n}}$", "95% of repeated CIs contain true $\\mu$", "Standard universal benchmark across science and A/B testing"],
          ["99% Confidence Interval", "$Z^* = 2.576$", "$\\bar{x} \\pm 2.576 \\cdot \\frac{\\sigma}{\\sqrt{n}}$", "99% of repeated CIs contain true $\\mu$", "Wider interval (high certainty, lower precision)"],
          ["99.9% Confidence Interval", "$Z^* = 3.291$", "$\\bar{x} \\pm 3.291 \\cdot \\frac{\\sigma}{\\sqrt{n}}$", "99.9% of repeated CIs contain true $\\mu$", "Very wide (extreme safety critical tolerance)"]
        ],
        n: "A confidence interval for a population mean $\\mu$ with known variance $\\sigma^2$ is defined as: $\\text{CI} = \\left[ \\bar{x} - Z^* \\frac{\\sigma}{\\sqrt{n}}, \\, \\bar{x} + Z^* \\frac{\\sigma}{\\sqrt{n}} \\right]$, where the half-width $\\text{ME} = Z^* \\frac{\\sigma}{\\sqrt{n}}$ is the **Margin of Error**. When population variance is unknown, sample standard deviation $s$ is substituted, and $Z^*$ is replaced by the critical value $t^*$ from **Student's t-distribution** with $n - 1$ degrees of freedom. There is an exact mathematical **duality between Confidence Intervals and Hypothesis Testing**: a two-sided hypothesis test rejects the null hypothesis $H_0: \\mu = \\mu_0$ at significance level $\\alpha$ if and only if the $(1 - \\alpha)$ confidence interval does NOT contain the null value $\\mu_0$."
      },

      miss: [
        {
          w: "A 95% confidence interval means there is a 95% probability that the true population mean lies inside this specific calculated interval.",
          r: "In classical frequentist statistics, the true population mean $\\mu$ is a **fixed constant**, NOT a random variable; it is either inside this specific calculated interval or it isn't (probability is 0 or 1). The '95%' describes the **procedure**: if you drew 100 independent random samples and computed 100 confidence intervals, approximately 95 of those intervals would contain the true parameter. Calculating the probability of a parameter lying inside an interval requires **Bayesian Credible Intervals**."
        },
        {
          w: "A narrower confidence interval always means the study was of higher quality.",
          r: "A narrower interval can simply mean that a lower confidence level was chosen (e.g., 80% instead of 99%), or that the sample standard deviation was artificially deflated by filtering out genuine variance. Narrowness is valuable only when confidence level and sampling integrity are held constant."
        },
        {
          w: "If two 95% confidence intervals for two different groups overlap, the difference between them cannot be statistically significant.",
          r: "Two 95% confidence intervals can overlap moderately while the difference between their means is still statistically significant ($p < 0.05$). The correct test evaluates the confidence interval of the **difference between means** ($\\text{CI}_{\\bar{x}_1 - \\bar{x}_2}$), not visual overlap."
        },
        {
          w: "Doubling the sample size cuts the width of the confidence interval in half.",
          r: "The margin of error scales inversely with the square root of $n$: $\\text{ME} \\propto 1/\\sqrt{n}$. To cut the confidence interval width in half, you must **quadruple ($4\\times$)** the sample size $n$."
        }
      ],

      trade: {
        buys: [
          "Combines point estimation and uncertainty quantification into a single intuitive range.",
          "Duality with hypothesis testing: provides all the information of a p-value test PLUS the effect size and precision.",
          "Exposes poor study power: an excessively wide interval immediately alerts decision-makers to high uncertainty.",
          "Directly informs risk management: reveals the plausible worst-case and best-case bounds for business metrics."
        ],
        costs: [
          "Frequentist definition is counter-intuitive and widely misinterpreted by non-statisticians.",
          "Requires $4\\times$ data collection to cut interval width by half ($1/\\sqrt{n}$ scaling).",
          "Parametric formulations require normality or large sample sizes ($n \\ge 30$) to be mathematically valid.",
          "Can be misleading on skewed or multimodal data without logarithmic or bootstrap transformations."
        ],
        avoid: [
          "Never interpret a 95% frequentist CI as a 95% posterior probability that the parameter lies between the bounds.",
          "Do not determine statistical significance by visually checking if two independent group CIs overlap; compute the CI of the difference.",
          "Avoid reporting single-number metric lifts without publishing their accompanying 95% confidence intervals."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "statistical-significance",

      why: {
        before: "Scientific disputes were settled by charisma, status, or qualitative rhetoric, allowing unvalidated claims and experimental noise to be declared breakthrough discoveries.",
        problem: "In empirical research and online A/B testing, random sampling fluctuations naturally produce small differences; organizations need a standardized mathematical threshold to decide when an observed result cannot be reasonably attributed to chance.",
        shift: "**Statistical Significance: A formal statistical determination that an observed experimental result is highly unlikely to have occurred by random chance alone, under the assumption of the Null Hypothesis ($p \\le \\alpha$).** The universal standard gatekeeper for publishing scientific claims, deploying A/B test variants, and validating medical treatments."
      },

      num: {
        t: "Significance Thresholds ($\\alpha$) Across Industries & Scientific Disciplines",
        h: ["Discipline / Industry", "Standard Significance Level ($\\alpha$)", "Allowable False Positive Risk", "Equivalent Sigma Threshold", "Operational Rationale"],
        r: [
          ["Standard Web A/B Testing", "$\\alpha = 0.05$", "5% chance of false discovery", "~1.96 standard deviations", "Balances iteration speed against shipping placebo features"],
          ["Exploratory Data Science", "$\\alpha = 0.10$", "10% chance of false discovery", "~1.645 standard deviations", "Permissive threshold to avoid missing early-stage exploratory signals"],
          ["Biomedical / Clinical Trials", "$\\alpha = 0.01$ to $0.05$", "1% to 5% (strictly audited)", "~2.576 standard deviations", "FDA safety standards to prevent deploying ineffective drugs"],
          ["Genomics / GWAS", "$\\alpha = 5 \\times 10^{-8}$", "Genome-wide false positive control", "~5.45 standard deviations", "Bonferroni correction across 1,000,000 simultaneous gene tests"],
          ["Particle Physics", "$\\alpha = 2.87 \\times 10^{-7}$", "1 in 3.5 million false discovery rate", "$5\\sigma$ (Five-Sigma threshold)", "Golden standard for claiming new particle discovery (CERN)"]
        ],
        n: "Statistical significance is formalized through the pre-specified **Significance Level ($\\alpha$)**, which represents the maximum allowable probability of committing a **Type I error (False Positive)**. A result is declared statistically significant if the calculated p-value satisfies: $p \\le \\alpha$. When testing multiple hypotheses simultaneously (e.g., evaluating 20 different button colors in an A/B test), the probability of finding at least one false positive by chance alone inflates exponentially: $P(\\text{At least 1 False Positive}) = 1 - (1 - \\alpha)^K$. For $K = 20$ tests at $\\alpha = 0.05$, the false discovery rate jumps to $1 - (0.95)^{20} \\approx 64.15\\%$. Rigorous data science mandates **Multiple Testing Corrections**, such as the **Bonferroni Correction** (testing each individual hypothesis at $\\alpha / K$) or the **Benjamini-Hochberg procedure** controlling the False Discovery Rate (FDR)."
      },

      miss: [
        {
          w: "Statistical significance proves that the observed finding is practically and commercially important.",
          r: "Statistical significance measures **only whether the effect is distinguishable from zero noise**. With a large enough sample size ($N = 1,000,000$), a completely useless 0.001% increase in conversion will be statistically significant ($p < 0.0001$), but provides zero meaningful business value."
        },
        {
          w: "A non-statistically significant result ($p = 0.06$) proves that there is no effect.",
          r: "'Not statistically significant' means only that the data did not provide sufficient evidence to surpass the arbitrary threshold. The experiment may simply be **underpowered** (sample size too small to detect a real effect)."
        },
        {
          w: "The significance threshold $\\alpha = 0.05$ is a universal law of nature.",
          r: "$\\alpha = 0.05$ was an arbitrary convention proposed casually by Ronald Fisher in 1925 ('one in twenty is a convenient line'). In genomics or particle physics, $\\alpha = 0.05$ is considered laughably unscientific and would lead to millions of false discoveries."
        },
        {
          w: "Statistical significance guarantees that the scientific discovery is true.",
          r: "Under $\\alpha = 0.05$, exactly 1 out of every 20 tests where no effect exists will be declared 'statistically significant' purely by chance. In fields with low prior probabilities, the majority of published statistically significant findings are actually false (Ioannidis, 2005)."
        }
      ],

      trade: {
        buys: [
          "Provides a clear, objective decision rule for product teams: prevents shipping placebo code based on random noise.",
          "Quantitatively bounds the False Positive rate (Type I error) to an acceptable risk tolerance ($\\alpha$).",
          "Universal scientific standard enabling peer-reviewed academic reproducibility.",
          "Forces teams to calculate sample sizes and power analyses prior to launching experiments."
        ],
        costs: [
          "Encourages binary thinking: creates an artificial cliff where $p = 0.049$ is 'true' and $p = 0.051$ is 'worthless'.",
          "Incentivizes P-Hacking and publication bias: researchers discard non-significant findings.",
          "Misleads executives: non-technical stakeholders confuse statistical significance with commercial importance.",
          "Requires strict multiple testing corrections when evaluating multiple metrics or cohorts simultaneously."
        ],
        avoid: [
          "Never declare a business result 'important' solely because it is statistically significant; verify Effect Size.",
          "Do not test multiple variants or metrics simultaneously without applying Bonferroni or Benjamini-Hochberg corrections.",
          "Avoid altering the significance threshold $\\alpha$ post-hoc after seeing the p-value."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "type-i-and-type-ii-error",

      why: {
        before: "Decision systems assumed testing was a single-variable problem of 'getting it right', failing to recognize that binary decisions in uncertain environments inherently involve two distinct, mutually conflicting failure modes.",
        problem: "In spam filtering, disease diagnosis, and criminal justice, the real-world cost of a False Alarm is radically different from the cost of a Missed Detection; engineering systems require a formal framework to trade off these two errors.",
        shift: "**Type I and Type II Error: The foundational dichotomy of statistical testing and classification.** Type I Error ($\\alpha$, False Positive: rejecting a true null hypothesis) versus Type II Error ($\\beta$, False Negative: failing to reject a false null hypothesis)."
      },

      num: {
        t: "The Statistical Confusion Matrix: Error Types, Rates & Real-World Costs",
        h: ["True Reality \\ Decision", "Accept / Retain $H_0$ (Predict Negative)", "Reject $H_0$ (Predict Positive)", "Error Probability", "Real-World High-Stakes Example"],
        r: [
          ["Null Hypothesis is TRUE (No effect / Innocent / Healthy)", "**Correct Decision** (True Negative)", "**TYPE I ERROR** (False Positive / False Alarm)", "Probability = $\\alpha$ (Significance Level)", "Convicting an innocent person / Sending healthy patient to chemo"],
          ["Null Hypothesis is FALSE (Real effect / Guilty / Sick)", "**TYPE II ERROR** (False Negative / Missed Detection)", "**Correct Decision** (True Positive / Hit)", "Probability = $\\beta$ ($1 - \\beta = \\text{Power}$)", "Acquitting a guilty murderer / Discharging a cancer patient as healthy"]
        ],
        n: "Type I and Type II errors are governed by an inescapable mathematical trade-off: for a fixed sample size $n$, **reducing Type I error ($\\alpha$) inevitably increases Type II error ($\\beta$)**, and vice versa. (1) **Type I Error ($\\alpha$)**: A **False Alarm**. Defined as $\\alpha = P(\\text{Reject } H_0 \\mid H_0 \\text{ is True})$. The researcher claims an effect exists when it doesn't. (2) **Type II Error ($\\beta$)**: A **Missed Opportunity**. Defined as $\\beta = P(\\text{Fail to Reject } H_0 \\mid H_0 \\text{ is False})$. The researcher misses a real effect. The complement of Type II error is **Statistical Power ($1 - \\beta$)**—the probability of correctly detecting a real effect. The only mathematical way to reduce both $\\alpha$ and $\\beta$ simultaneously is to **increase the sample size $n$** or reduce measurement noise."
      },

      miss: [
        {
          w: "Type I and Type II errors can both be reduced to zero with better algorithms.",
          r: "In any non-trivial stochastic environment with overlapping class distributions, errors are mathematically unavoidable. You can achieve 0% Type I error by never predicting positive (causing 100% Type II error), or 0% Type II error by predicting positive on everything (causing 100% Type I error)."
        },
        {
          w: "Type I error is always worse and more dangerous than Type II error.",
          r: "Error severity depends entirely on the domain. In cancer screening or smoke alarms, a **Type II error (missing cancer / missing a fire)** is fatal, while a Type I error (a false alarm biopsy / false alarm siren) is merely inconvenient. In criminal law, society prioritizes minimizing Type I error (Blackstone's ratio: 'better that ten guilty escape than one innocent suffer')."
        },
        {
          w: "Setting $\\alpha = 0.05$ guarantees that the overall error rate of the system is 5%.",
          r: "$\\alpha = 0.05$ bounds the probability of a False Positive **given that the null hypothesis is true**. It says nothing about Type II error ($\\beta$), which in underpowered studies can easily be $50\\%$ or higher."
        },
        {
          w: "In machine learning classification, Type I and Type II errors are called Accuracy and Loss.",
          r: "In machine learning classification, Type I error corresponds to **False Positives (FP)** (which degrades **Precision**), and Type II error corresponds to **False Negatives (FN)** (which degrades **Recall**). The Precision-Recall tradeoff is the direct machine learning equivalent of the $\\alpha$-vs-$\\beta$ tradeoff."
        }
      ],

      trade: {
        buys: [
          "Provides a formal mathematical framework to balance risk according to domain-specific real-world costs.",
          "Forms the foundation of the Precision-Recall and ROC curve trade-off in machine learning.",
          "Forces explicit calculation of Statistical Power ($1 - \\beta$) to avoid launching underpowered experiments.",
          "Guides threshold tuning: allows shifting decision thresholds to prioritize safety (low FN) or precision (low FP)."
        ],
        costs: [
          "Inescapable trade-off: decreasing one error rate inevitably increases the other for a fixed sample size.",
          "Simultaneous reduction requires collecting more data, increasing financial and computational experimentation costs.",
          "Requires cost-benefit modeling: quantifying the dollar cost of a False Positive vs a False Negative is difficult.",
          "Cognitive confusion: business stakeholders routinely confuse False Positives with False Negatives."
        ],
        avoid: [
          "Never design medical screening or security systems with high Type II error (missing positive cases).",
          "Do not adjust classification thresholds without analyzing the asymmetric financial costs of Type I vs Type II errors.",
          "Avoid launching experiments without conducting a Power Analysis to verify that Type II error is bounded ($\\beta \\le 0.20$)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
