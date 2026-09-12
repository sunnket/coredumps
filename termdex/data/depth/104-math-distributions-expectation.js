/* ==========================================================================
   Depth pass 104 — Mathematics & Statistics batch 3: Probability Distributions & Moments.
   Probability Distribution, Normal Distribution, Binomial Distribution,
   Poisson Distribution, Expected Value, Variance, Standard Deviation.

   Parametric density functions map stochastic phenomena to statistical manifolds;
   orthogonal central moments quantify expectation, dispersion, and uncertainty.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "probability-distribution",

      why: {
        before: "Empirical data was collected as disorganized lists of individual numbers, leaving scientists with no mathematical function to model the underlying probabilities across the range of possible outcomes.",
        problem: "Simulating physical systems, testing statistical hypotheses, and training generative AI models requires a formal mathematical object that completely describes the probability of every possible outcome.",
        shift: "**Probability Distribution: A mathematical function that gives the probabilities of occurrence of different possible outcomes for an experiment.** Defined by Probability Mass Functions (PMF) for discrete variables, Probability Density Functions (PDF) for continuous variables, and Cumulative Distribution Functions (CDF) universally."
      },

      num: {
        t: "Foundational Probability Distribution Families & Characteristics",
        h: ["Distribution Family", "Domain Support", "Key Parameters", "Entropy Profile", "Machine Learning Application"],
        r: [
          ["Bernoulli / Binomial", "Discrete ($k \\in \\{0, \\dots, n\\}$)", "$n$ trials, $p$ success probability", "Discrete entropy: $-p \\log p - (1-p) \\log(1-p)$", "Binary classification loss (Binary Cross-Entropy)"],
          ["Categorical / Multinomial", "Discrete ($k \\in \\{1, \\dots, K\\}$)", "Simplex vector $\\mathbf{p} \\in \\Delta^{K-1}$", "Maximal for uniform categorical", "Multi-class classification (Softmax output)"],
          ["Gaussian / Normal", "Continuous ($x \\in \\mathbb{R}$)", "Mean $\\mu$, Variance $\\sigma^2$", "Maximum entropy for fixed mean & variance", "Weight initialization, VAE latent priors, diffusion models"],
          ["Poisson", "Discrete counts ($k \\in \\{0, 1, 2, \\dots\\}$)", "Rate parameter $\\lambda > 0$", "Discrete Poisson entropy", "Modeling user arrival rates, API calls, server requests"],
          ["Uniform", "Bounded interval ($x \\in [a, b]$)", "Lower bound $a$, upper bound $b$", "Maximum entropy on bounded support", "Random weight initialization (Glorot/He uniform)"]
        ],
        n: "A probability distribution completely specifies the behavior of a random variable $X$. For a discrete random variable, the **Probability Mass Function (PMF)** satisfies $p(x) = P(X = x)$ where $\\sum_x p(x) = 1$. For a continuous random variable, the **Probability Density Function (PDF)** $f(x)$ represents probability per unit length: $P(a \\le X \\le b) = \\int_a^b f(x) dx$, with normalization $\\int_{-\\infty}^\\infty f(x) dx = 1$. The universal representation uniting both is the **Cumulative Distribution Function (CDF)**: $F(x) = P(X \\le x)$. In generative machine learning (such as Normalizing Flows, VAEs, and Diffusion models), the core task is estimating and sampling from an intractable, high-dimensional probability distribution $P_{\\text{data}}(x)$ by transforming an analytically tractable base distribution (e.g., standard Gaussian $\\mathcal{N}(0, I)$) through deep neural networks."
      },

      miss: [
        {
          w: "All probability distributions are bell-shaped normal curves.",
          r: "Real-world data exhibits diverse distribution geometries: Power-law/Pareto (wealth, web traffic), Exponential (component lifetimes), Poisson (call center arrivals), and multimodal mixtures (customer demographics). Assuming normality when data is heavy-tailed leads to catastrophic risk miscalculations."
        },
        {
          w: "A probability density function (PDF) value cannot exceed 1.0.",
          r: "A PDF represents **density**, not probability. A uniform distribution on the interval $[0, 0.2]$ has a constant density $f(x) = 5.0$ everywhere on that interval. The integral over the interval equals $5.0 \\times 0.2 = 1.0$."
        },
        {
          w: "Fitting a probability distribution to data always requires assuming a parametric shape (like Gaussian).",
          r: "Non-parametric density estimation (such as **Kernel Density Estimation (KDE)**) estimates probability distributions directly from empirical data without imposing rigid parametric mathematical assumptions."
        },
        {
          w: "The mean and median of a probability distribution are always identical.",
          r: "Mean and median coincide only in perfectly symmetric distributions (like the Normal distribution). In skewed distributions (e.g., income), the mean is pulled heavily by extreme outliers into the long tail, while the median remains robust."
        }
      ],

      trade: {
        buys: [
          "Provides a complete, compact mathematical model of uncertainty and variability in physical and digital systems.",
          "Enables statistical simulation and synthetic data generation via Monte Carlo sampling.",
          "Underpins Maximum Likelihood Estimation (MLE) and Maximum A Posteriori (MAP) model parameter optimization.",
          "Generative AI foundation: models generative tasks as learning complex data distributions ($P(x)$)."
        ],
        costs: [
          "Model misspecification risk: assuming an incorrect parametric distribution (e.g., Gaussian instead of Pareto) distorts risk analysis.",
          "Intractable normalization: computing normalizing constants (partition functions) in high dimensions requires expensive MCMC approximations.",
          "Curse of dimensionality: multi-variable joint distributions require exponential parameter expansion without conditional independence assumptions.",
          "Outlier vulnerability: parametric distributions (like Gaussian) fail to account for 'Black Swan' heavy-tailed real-world events."
        ],
        avoid: [
          "Never assume a financial or operational dataset is normally distributed without testing for heavy tails and skewness.",
          "Do not interpret the peak height of a continuous PDF curve as an absolute probability.",
          "Avoid evaluating continuous distributions using discrete PMF formulas; use integrals and CDFs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "normal-distribution",

      why: {
        before: "Before the 18th century, natural variation in astronomy measurements, human heights, and measurement errors appeared chaotic and unpredictable, lacking a unified mathematical governing law.",
        problem: "Summing multiple independent physical noise sources generates a universal bell-shaped distribution across physical and social sciences; mathematicians needed an analytical formulation to model this universal attractor.",
        shift: "**Normal Distribution (Gaussian Distribution): A continuous probability distribution characterized by a symmetric, bell-shaped probability density function completely specified by its mean $\\mu$ and variance $\\sigma^2$.** Formalized by Carl Friedrich Gauss (1809) and Pierre-Simon Laplace, anchored by the Central Limit Theorem as the preeminent distribution in statistics."
      },

      num: {
        t: "Normal Distribution Probability Density & Empirical Rule (68-95-99.7)",
        h: ["Distance from Mean ($\\mu$)", "Z-Score Range", "Percentage of Population Enclosed", "Cumulative Tail Probability", "Six Sigma Quality Benchmark"],
        r: [
          ["$\\pm 1 \\sigma$", "$[-1, 1]$", "68.27%", "15.87% per single tail", "Standard tolerance range"],
          ["$\\pm 2 \\sigma$", "$[-2, 2]$", "95.45%", "2.28% per single tail", "Standard statistical significance boundary ($p \\approx 0.05$)"],
          ["$\\pm 3 \\sigma$", "$[-3, 3]$", "99.73%", "0.135% (1 in 740)", "Traditional engineering quality control limits"],
          ["$\\pm 4 \\sigma$", "$[-4, 4]$", "99.9937%", "31.7 per million", "Severe anomaly detection threshold"],
          ["$\\pm 6 \\sigma$", "$[-6, 6]$", "99.9999998%", "3.4 defects per million opportunities (DPMO)", "Motorola Six Sigma manufacturing defect threshold"]
        ],
        n: "The probability density function of a univariate Gaussian random variable $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$ is: $f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp \\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)$. The distribution is symmetric around the mean $\\mu$, which is simultaneously its median and mode. It has zero skewness and a kurtosis of exactly 3.0 (excess kurtosis 0). In multidimensional space, the **Multivariate Normal Distribution** is parameterized by mean vector $\\boldsymbol{\\mu} \\in \\mathbb{R}^d$ and covariance matrix $\\boldsymbol{\\Sigma} \\in \\mathbb{R}^{d \\times d}$: $f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{d/2} |\\boldsymbol{\\Sigma}|^{1/2}} \\exp \\left( -\\frac{1}{2} (\\mathbf{x} - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu}) \\right)$. Under the **Information Theory Principle of Maximum Entropy**, among all possible continuous distributions with a given mean and variance, the Gaussian distribution possesses the maximum differential entropy, making it the most mathematically unbiased assumption when only mean and variance are known."
      },

      miss: [
        {
          w: "Almost all real-world data is normally distributed.",
          r: "Very little real-world data is strictly Gaussian. Financial asset returns, wealth distributions, website visits, and text word frequencies follow heavy-tailed power laws (Pareto distributions). Assuming a normal distribution in financial risk (e.g., Value at Risk) caused the 2008 financial collapse by underestimating rare market crashes."
        },
        {
          w: "The Central Limit Theorem proves that all raw datasets eventually become normal if sample size is large enough.",
          r: "The Central Limit Theorem states that the **sample mean (average)** of independent random variables converges to a normal distribution, NOT the raw underlying data itself. If raw data is uniform, taking 1,000,000 samples still leaves the raw data completely uniform."
        },
        {
          w: "A standard normal distribution has a mean of 1 and standard deviation of 0.",
          r: "The Standard Normal distribution $\\mathcal{N}(0, 1)$ is defined by a **mean of zero ($\\mu = 0$)** and a **variance / standard deviation of one ($\\sigma = 1, \\sigma^2 = 1$)**."
        },
        {
          w: "The area under the normal curve can be calculated with a simple closed-form algebraic formula.",
          r: "The Gaussian integral $\\int e^{-x^2} dx$ has no elementary algebraic antiderivative. The normal Cumulative Distribution Function (CDF) must be approximated numerically using the Gauss error function: $\\Phi(x) = \\frac{1}{2} [1 + \\text{erf}(x / \\sqrt{2})]$."
        }
      ],

      trade: {
        buys: [
          "Maximum entropy distribution: the least biased, most conservative statistical assumption when only mean and variance are known.",
          "Analytically tractable: linear transformations of Gaussian variables remain Gaussian; marginals and conditionals are closed-form.",
          "Underpinned by the Central Limit Theorem: naturally models aggregated measurement errors and physical noise.",
          "Foundational in deep learning: serves as the base prior for Variational Autoencoders (VAEs) and score-based Diffusion Models."
        ],
        costs: [
          "Thin tails (exponential drop-off): severely underestimates the probability of extreme 'Black Swan' outliers.",
          "Symmetry constraint: cannot model asymmetric, skewed, or strictly positive quantities (e.g., personal wealth, response times).",
          "Multivariate covariance inversion: computing $\\boldsymbol{\\Sigma}^{-1}$ in high dimensions scales cubically ($O(d^3)$).",
          "Misuse in financial and risk domains has historically triggered multi-billion-dollar systemic financial collapses."
        ],
        avoid: [
          "Never use a normal distribution to model asset price crashes, server response times, or insurance claims; use heavy-tailed Pareto.",
          "Do not compute multi-variable Gaussian probabilities without verifying that the covariance matrix is positive semi-definite.",
          "Avoid confusing the distribution of sample averages (which is Gaussian via CLT) with the distribution of raw observations."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "binomial-distribution",

      why: {
        before: "Calculating the probability of getting $k$ successes out of $n$ independent trials (e.g., quality inspection defects, coin flips, drug trial cures) required writing out exhaustive combinatorial tree diagrams that quickly became impossible for $n > 5$.",
        problem: "Industrial manufacturing, clinical trials, and web A/B testing need an exact analytical formula to calculate the probability of observing a specific number of binary successes across $n$ independent trials with constant success probability $p$.",
        shift: "**Binomial Distribution ($X \\sim \\text{Bin}(n, p)$): The discrete probability distribution of the number of successes in a sequence of $n$ independent binary experiments (Bernoulli trials), each yielding success with probability $p$.** Formalized by Jacob Bernoulli in 1713, serving as the foundational model for discrete binary events."
      },

      num: {
        t: "Binomial Distribution Moments, Approximations & Scaling Regimes",
        h: ["Statistical Property / Regime", "Mathematical Formulation", "Physical Condition", "Applicable Approximation", "Practical Application"],
        r: [
          ["Expected Value (Mean)", "$E[X] = n p$", "Valid for all $n$ and $p$", "Exact", "Expected number of conversions in 1,000 ad impressions"],
          ["Variance", "$\\text{Var}(X) = n p (1 - p)$", "Maximized when $p = 0.50$", "Exact", "Variance of binary customer churn in a cohort"],
          ["Probability Mass Function", "$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$", "Exact probability of $k$ successes", "Exact combination", "A/B testing significance calculations"],
          ["Poisson Approximation", "$X \\approx \\text{Poisson}(\\lambda = n p)$", "Large $n$ ($n \\ge 100$), tiny $p$ ($p \\le 0.01$)", "Law of Rare Events", "Factory defect rates, web server error counts"],
          ["Normal Approximation", "$X \\approx \\mathcal{N}(n p, n p (1-p))$", "Large $n$ ($n p \\ge 10$ and $n(1-p) \\ge 10$)", "De Moivre-Laplace CLT (with continuity correction)", "Large-sample election polling, statistical z-tests"]
        ],
        n: "A random variable $X$ follows a Binomial distribution $X \\sim \\text{Bin}(n, p)$ if it satisfies four strict conditions (**BINS**): (1) **Binary**: Outcomes are dichotomous (Success or Failure). (2) **Independent**: The outcome of one trial does not influence any other trial. (3) **Number**: The total number of trials $n$ is fixed in advance. (4) **Success probability**: The probability of success $p$ remains constant across all trials. The Probability Mass Function is: $P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k} = \\frac{n!}{k!(n - k)!} p^k (1 - p)^{n - k}$. The binomial coefficient $\\binom{n}{k}$ counts the number of distinct ways to choose $k$ successes out of $n$ slots. When $n=1$, the Binomial distribution collapses to the **Bernoulli distribution**, which forms the mathematical basis for the binary cross-entropy loss function in logistic regression and deep learning classifiers."
      },

      miss: [
        {
          w: "Sampling without replacement from a small population follows a Binomial distribution.",
          r: "Sampling without replacement alters the probability $p$ on every subsequent draw, violating the constant probability and independence assumptions. Sampling without replacement follows the **Hypergeometric Distribution** (though it approximates Binomial if the population is massive, $N > 10 n$)."
        },
        {
          w: "The Binomial distribution can be used to count events over continuous time intervals.",
          r: "The Binomial distribution models a **fixed number of discrete trials $n$**. Counting events occurring continuously over time or space (e.g., website visitors per minute) is modeled by the **Poisson Distribution**."
        },
        {
          w: "When approximating a Binomial distribution with a Normal distribution, continuity correction is optional.",
          r: "Approximating a discrete integer variable with a continuous density without continuity correction introduces systematic integration errors. To evaluate $P(X = 10)$, you must integrate the continuous Gaussian from $9.5$ to $10.5$."
        },
        {
          w: "Calculating factorials ($n!$) directly in code is the best way to compute binomial probabilities.",
          r: "Calculating $n!$ causes immediate integer overflow in software for $n > 170$. Production libraries compute binomial probabilities in log-space using the **Log-Gamma function**: $\\ln \\binom{n}{k} = \\ln \\Gamma(n+1) - \\ln \\Gamma(k+1) - \\ln \\Gamma(n-k+1)$."
        }
      ],

      trade: {
        buys: [
          "Exact mathematical model for discrete binary experiments: coin flips, A/B test conversions, defect counts, click rates.",
          "Underpins Binary Cross-Entropy loss in machine learning: $-\\sum [y \\log p + (1-y) \\log(1-p)]$.",
          "Closed-form analytical moments: mean ($n p$) and variance ($n p(1-p)$) are calculated instantaneously.",
          "Well-understood asymptotic limits: bridges cleanly to Poisson (rare events) and Normal (large $n$) distributions."
        ],
        costs: [
          "Combinatorial computation bottlenecks: calculating exact binomial coefficients for massive $n$ requires log-gamma approximations.",
          "Rigid assumptions: fails if trials are correlated or if probability $p$ drifts over time (violating BINS).",
          "Overdispersion in real-world data: real-world binary data often exhibits variance exceeding $n p (1-p)$, requiring Beta-Binomial models.",
          "Cannot model multi-category outcomes; requires expanding to the Multinomial Distribution."
        ],
        avoid: [
          "Never calculate $\\binom{n}{k}$ using naive factorial multiplication; use `scipy.stats.binom` or log-gamma formulations.",
          "Do not apply the Binomial distribution to dependent trials (e.g., sampling without replacement from small groups).",
          "Avoid using normal approximations when $n p < 10$ or $n(1-p) < 10$; compute exact binomial probabilities."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "poisson-distribution",

      why: {
        before: "Modeling the count of rare events occurring in continuous time (e.g., customer arrivals at a bank, website server requests per second, radioactive decay clicks) required chopping time into millions of microsecond slices and evaluating awkward binomial limits.",
        problem: "Events occur continuously and independently at a constant average rate; calculating the exact probability of observing $k$ events in a fixed time window without defining arbitrary discrete trials was a major mathematical gap.",
        shift: "**Poisson Distribution ($X \\sim \\text{Pois}(\\lambda)$): A discrete probability distribution that expresses the probability of a given number of events occurring in a fixed interval of time or space, given a known constant average rate $\\lambda$ and independence from the time since the last event.** Introduced by Siméon Denis Poisson in 1837, governing queuing theory, telephony, and rare event modeling."
      },

      num: {
        t: "Poisson Distribution Properties, Moments & Inter-Arrival Relationships",
        h: ["Dimension / Property", "Mathematical Formulation", "Core Significance", "Connection to Other Distributions", "Real-World Application"],
        r: [
          ["Expected Value (Mean)", "$E[X] = \\lambda$", "Average arrival rate across the specified window", "Equi-dispersion: Mean equals Variance", "Average number of customer calls per hour"],
          ["Variance", "$\\text{Var}(X) = \\lambda$", "Dispersion scales linearly with rate", "$\\sigma = \\sqrt{\\lambda}$", "Variance in photon arrival counts on camera sensor"],
          ["Probability Mass Function", "$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$", "Probability of observing exactly $k$ events", "Asymptotic limit of Binomial as $n \\to \\infty, p \\to 0$", "Probability of receiving 0 server 500 errors in a day"],
          ["Inter-Arrival Times", "$T \\sim \\text{Exponential}(\\lambda)$", "Time between consecutive Poisson events", "Memoryless continuous exponential distribution", "Time between incoming HTTP requests"],
          ["Overdispersion Check", "$\\text{Var}(X) / E[X] = 1$ (Dispersion Index)", "Diagnostic test for Poisson assumption", "If $\\text{Var} > \\text{Mean}$, use Negative Binomial", "Validating whether web traffic follows a true Poisson process"]
        ],
        n: "The Poisson distribution arises as the mathematical limit of the Binomial distribution as the number of trials $n \\rightarrow \\infty$ and probability $p \\rightarrow 0$ such that the expected product $\\lambda = n p$ remains constant (known as the **Law of Rare Events**). The Probability Mass Function is: $P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$ for $k \\in \\{0, 1, 2, \\dots\\}$. A foundational, unique mathematical property of the Poisson distribution is **Equi-dispersion**: its theoretical variance is identically equal to its mean: $E[X] = \\text{Var}(X) = \\lambda$. In queueing theory, Poisson processes possess the **Memoryless Property**: the probability of an arrival in the next minute is completely independent of when the previous arrival occurred."
      },

      miss: [
        {
          w: "The parameter $\\lambda$ in a Poisson distribution must be an integer.",
          r: "The parameter $\\lambda$ is the **average rate** and can be any positive real floating-point number (e.g., $\\lambda = 2.7$ customer calls per hour). The random variable count $k$ is an integer ($0, 1, 2, \\dots$), but the rate $\\lambda$ is continuous."
        },
        {
          w: "All count data in machine learning follows a Poisson distribution.",
          r: "Real-world count data frequently exhibits **Overdispersion** (where variance vastly exceeds the mean: $\\text{Var}(X) > E[X]$) due to clustering, burstiness, or unobserved heterogeneity (e.g., viral social media retweets). Modeling overdispersed counts with Poisson produces artificially narrow confidence intervals; **Negative Binomial regression** must be used."
        },
        {
          w: "Poisson events can occur simultaneously at the exact same instant.",
          r: "A fundamental postulate of the Poisson process is that events occur individually: the probability of two or more events occurring in an infinitesimally small time window $\\Delta t$ is asymptotically zero ($o(\\Delta t)$)."
        },
        {
          w: "A Poisson distribution can never look like a symmetric bell curve.",
          r: "For small $\\lambda$ ($\le 3$), the distribution is heavily right-skewed. However, as the rate $\\lambda$ increases ($\\lambda \\ge 20$), the Poisson distribution becomes symmetric and converges to a Normal distribution $\\mathcal{N}(\\lambda, \\lambda)$ via the Central Limit Theorem."
        }
      ],

      trade: {
        buys: [
          "The definitive mathematical model for arrivals, queueing, and rare discrete events across continuous time and space.",
          "Extremely parsimonious: requires only a single parameter $\\lambda$ to completely define both mean and variance.",
          "Underpins Poisson Regression in generalized linear models (GLMs) for count data analysis.",
          "Duality with the Exponential distribution provides a unified mathematical foundation for system reliability and queueing."
        ],
        costs: [
          "Equi-dispersion rigidity: the strict mathematical constraint that $\\text{Var}(X) = E[X]$ fails on real-world overdispersed data.",
          "Vulnerable to contagion/clustering: fails when events trigger other events (e.g., infectious disease transmission, stock market cascades).",
          "Memoryless assumption fails in systems with fatigue, wear-and-tear, or scheduling dependencies.",
          "Computing $k!$ in the denominator requires log-gamma approximations for large event counts to avoid numerical overflow."
        ],
        avoid: [
          "Never use standard Poisson regression when empirical sample variance is significantly greater than sample mean; use Negative Binomial.",
          "Do not apply Poisson models to clustered or contagious events where one occurrence increases the probability of another.",
          "Avoid computing $\\lambda^k / k!$ directly in software code; evaluate in log-space: $\\exp(k \\ln \\lambda - \\lambda - \\ln \\Gamma(k+1))$."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "expected-value",

      why: {
        before: "Decision-makers evaluated uncertain gambles, insurance policies, and investments using raw intuitive guesses, lacking a mathematically rigorous way to determine the fair long-run average payout of a stochastic process.",
        problem: "In games of chance, financial risk analysis, and reinforcement learning, decisions involve stochastic trade-offs between probability and payoff; we need a single numerical measure of the center of mass of a random variable.",
        shift: "**Expected Value (Expectation / Mean): The probability-weighted average of all possible values that a random variable can take ($E[X]$).** The foundational concept of decision theory, game theory, reinforcement learning, and loss minimization in machine learning."
      },

      num: {
        t: "Expected Value Formulations, Linearity Laws & Inequalities",
        h: ["Formulation / Law", "Mathematical Definition", "Operational Constraint", "Core Property", "Machine Learning Role"],
        r: [
          ["Discrete Expectation", "$E[X] = \\sum_{x \\in \\mathcal{X}} x \\cdot p(x)$", "Finite or countably infinite support", "Probability-weighted sum", "Discrete policy return calculation"],
          ["Continuous Expectation", "$E[X] = \\int_{-\\infty}^\\infty x \\cdot f(x) dx$", "Continuous real line $\\mathbb{R}$", "First moment / center of mass", "Expected continuous loss evaluation"],
          ["Linearity of Expectation", "$E[a X + b Y + c] = a E[X] + b E[Y] + c$", "Holds ALWAYS (even if $X$ and $Y$ are dependent!)", "Powerful universal algebraic linearity", "Decomposing complex loss expectations"],
          ["Law of the Unconscious Statistician (LOTUS)", "$E[g(X)] = \\int g(x) f(x) dx$", "Expectation of a transformed variable", "No need to find the density of $g(X)$", "Evaluating loss functions $\\mathcal{L}(f(X))$"],
          ["Jensen's Inequality", "$g(E[X]) \\le E[g(X)]$ for convex $g$", "Strict inequality for non-linear convex $g$", "Defines Evidence Lower Bound (ELBO)", "Variational Autoencoders & EM algorithm"]
        ],
        n: "The Expected Value represents the first raw moment and physical **center of mass** of a probability distribution: $\\mu = E[X]$. For discrete variables, it is the sum $E[X] = \\sum x p(x)$; for continuous variables, it is the Riemann-Stieltjes integral $E[X] = \\int x f(x) dx$. One of the most powerful and counter-intuitive theorems in all of mathematics is the **Linearity of Expectation**: $E[X + Y] = E[X] + E[Y]$. This identity holds unconditionally—$X$ and $Y$ do **not** need to be independent. In machine learning, training an algorithm is formally defined as minimizing the **Expected Risk** over the true underlying data distribution: $w^* = \\arg\\min_w E_{(x, y) \\sim P_{\\text{data}}}[\\mathcal{L}(f_w(x), y)]$, which is approximated in practice by the empirical mean over training batches (**Empirical Risk Minimization, ERM**)."
      },

      miss: [
        {
          w: "The expected value of a random variable is a value that the variable will actually take in reality.",
          r: "The expected value is a mathematical theoretical average, not a guaranteed physical outcome. For a standard 6-sided die, $E[X] = 3.5$, yet it is physically impossible to roll a 3.5 on any single roll."
        },
        {
          w: "$E[g(X)]$ is equal to $g(E[X])$ for any mathematical function $g$.",
          r: "This holds ONLY for strictly linear functions ($g(x) = a x + b$). For non-linear functions (like squares, logarithms, or neural activations), **Jensen's Inequality** dictates that $E[X^2] \\ne (E[X])^2$ and $E[\\log X] \\le \\log(E[X])$. Conflating the two is a severe mathematical error."
        },
        {
          w: "Every well-defined random variable has an expected value.",
          r: "A random variable has an expected value only if the integral $\\int |x| f(x) dx < \\infty$ converges absolutely. Distributions with heavy tails (such as the **Cauchy Distribution** or Pareto with $\\alpha \\le 1$) have **undefined expected values**; empirical sample averages oscillate wildly and never converge."
        },
        {
          w: "Linearity of expectation ($E[X+Y] = E[X] + E[Y]$) requires $X$ and $Y$ to be independent.",
          r: "Linearity of expectation holds unconditionally for **any** random variables, whether they are completely independent, strongly correlated, or adversarial."
        }
      ],

      trade: {
        buys: [
          "Provides a single, rigorous numerical measure of the central tendency of an uncertain outcome.",
          "Linearity of expectation simplifies complex stochastic proofs and allows modular loss function design.",
          "Underpins Reinforcement Learning: Bellman equations optimize expected cumulative discounted future reward.",
          "Empirical Risk Minimization (ERM) bridges theoretical expectation to practical stochastic gradient descent."
        ],
        costs: [
          "Ignores risk and dispersion: a gamble paying $0 with 50% probability and $200 with 50% probability has the same expected value ($100) as receiving $100 guaranteed, but vastly higher risk.",
          "Undefined on heavy-tailed distributions: breaks down on Cauchy or power-law distributions where theoretical integrals diverge.",
          "Vulnerable to extreme outliers: a single multi-billion-dollar outlier drastically skews expected values in skewed populations.",
          "Non-linear transformations require complex mathematical inequalities (Jensen's inequality) rather than direct substitution."
        ],
        avoid: [
          "Never evaluate financial, medical, or engineering risk using expected value alone; always measure Variance and Value at Risk (VaR).",
          "Do not assume $E[X / Y] = E[X] / E[Y]$; the expectation of a ratio is almost never the ratio of expectations.",
          "Avoid using expected values on heavy-tailed power-law data without checking whether the theoretical first moment converges."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "variance",

      why: {
        before: "Evaluating distributions using Expected Value (mean) alone was dangerously misleading: a financial investment guaranteed to return $1,000 was treated as identical to a volatile gamble with an average return of $1,000 that could result in total bankruptcy.",
        problem: "Decision-makers need a quantitative, mathematically rigorous measure of dispersion, volatility, risk, and spread around the expected value to quantify uncertainty.",
        shift: "**Variance ($\\text{Var}(X)$ or $\\sigma^2$): The expected squared deviation of a random variable from its mean, measuring the dispersion, spread, and uncertainty of the distribution: $\\text{Var}(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2$.** The foundational measure of spread in statistics, portfolio theory, and machine learning."
      },

      num: {
        t: "Variance Properties, Scaling Rules & Machine Learning Formulations",
        h: ["Operation / Property", "Mathematical Formula", "Algebraic Behavior", "Physical Meaning", "Machine Learning Role"],
        r: [
          ["Definition", "$\\text{Var}(X) = E[(X - \\mu)^2]$", "Second central moment", "Average squared distance from the mean", "Measures model prediction uncertainty"],
          ["Computational Formula", "$\\text{Var}(X) = E[X^2] - (E[X])^2$", "Single pass calculation formula", "Mean of square minus square of mean", "Numerically fast variance calculation"],
          ["Scalar Scaling Rule", "$\\text{Var}(a X + b) = a^2 \\text{Var}(X)$", "Constants $b$ vanish; scalars scale squared ($a^2$)", "Shifting data doesn't change spread; scaling scales squared", "Batch normalization feature scaling"],
          ["Sum of Independent RVs", "$\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y)$", "Additive if $\\text{Cov}(X, Y) = 0$", "Independent variances add linearly", "Random walk variance scaling with time"],
          ["Sample Variance (Unbiased)", "$s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2$", "Bessel's correction ($n-1$ denominator)", "Eliminates finite sample under-estimation bias", "Standard empirical sample variance estimation"]
        ],
        n: "Variance represents the **second central moment** of a probability distribution. It measures how widely data spreads around the center of mass $\\mu$: $\\text{Var}(X) = E[(X - \\mu)^2]$. Expanding the quadratic algebraically yields the standard computational shortcut: $\\text{Var}(X) = E[X^2 - 2\\mu X + \\mu^2] = E[X^2] - 2\\mu E[X] + \\mu^2 = E[X^2] - \\mu^2$. When estimating variance from a finite empirical sample of size $n$, the naive formula $\\frac{1}{n} \\sum (x_i - \\bar{x})^2$ is systematically biased (it under-estimates true population variance because deviations are calculated from the sample mean $\\bar{x}$ rather than the true population mean $\\mu$). **Bessel's Correction** divides by the degrees of freedom $n - 1$ instead of $n$, yielding an **unbiased estimator**: $s^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2$."
      },

      miss: [
        {
          w: "Variance is measured in the exact same units as the original data (e.g., dollars or meters).",
          r: "Because variance squares deviations from the mean, its units are **squared**: if data is measured in dollars ($), its variance is measured in **dollars squared ($\\$^2$)**, which is physically uninterpretable. Taking the square root yields **Standard Deviation ($\\sigma$)**, which restores original units."
        },
        {
          w: "Multiplying a dataset by 2 doubles its variance.",
          r: "Under scalar multiplication, variance scales by the **square** of the constant: $\\text{Var}(2 X) = 2^2 \\text{Var}(X) = 4 \\text{Var}(X)$. Doubling data values quadruples variance."
        },
        {
          w: "Variances of any two variables can simply be added together ($\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y)$).",
          r: "Variances are additive ONLY if the random variables are strictly **uncorrelated** ($\\text{Cov}(X, Y) = 0$). For correlated variables, the general formula is: $\\text{Var}(X + Y) = \\text{Var}(X) + \\text{Var}(Y) + 2 \\text{Cov}(X, Y)$."
        },
        {
          w: "A model with high variance is always better than a model with high bias.",
          r: "This is the core **Bias-Variance Tradeoff**. High variance means the model is severely **overfitting** to training noise, memorizing peculiar quirks and generalizing terribly to unseen test data."
        }
      ],

      trade: {
        buys: [
          "Rigorous mathematical quantification of risk, volatility, uncertainty, and spread in data.",
          "Central component of the Bias-Variance Tradeoff: guides model complexity and regularization decisions.",
          "Additive property for independent random variables simplifies multi-stage risk and error analysis.",
          "Underpins modern portfolio theory (Markowitz mean-variance optimization) and stochastic control."
        ],
        costs: [
          "Squaring penalty over-weights outliers: a single extreme outlier dramatically inflates variance.",
          "Squared units lack intuitive interpretability (dollars squared vs dollars), requiring conversion to standard deviation.",
          "Undefined on heavy-tailed distributions: Cauchy and Pareto ($\\alpha \\le 2$) distributions have infinite or undefined variance.",
          "Empirical sample variance is sensitive to sample size, requiring Bessel's correction to eliminate bias."
        ],
        avoid: [
          "Never report variance in business or executive presentations without converting to Standard Deviation for interpretability.",
          "Do not sum variances of dependent variables without including their Covariance term ($2 \\text{Cov}(X, Y)$).",
          "Avoid using standard variance as a risk metric on heavy-tailed distributions; use median absolute deviation (MAD) or quantile spreads."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "standard-deviation",

      why: {
        before: "Variance quantified the spread of a distribution, but because it squared deviations, its units were squared (dollars squared, seconds squared, meters squared), making it non-intuitive to communicate to stakeholders or plot alongside raw data.",
        problem: "Scientists and business leaders needed a measure of dispersion that retains the exact same physical units and scale as the original measurements and the mean.",
        shift: "**Standard Deviation ($\\sigma$ or $s$): The square root of the variance, expressing the average dispersion of data points around their mean in the exact same physical units as the original data: $\\sigma = \\sqrt{\\text{Var}(X)}$.** The universal standard metric for volatility, uncertainty, and statistical spread."
      },

      num: {
        t: "Standard Deviation Interpretations, Bounds & Quality Standards",
        h: ["Distribution Context", "Range Around Mean", "Guaranteed Population Proportion", "Underlying Mathematical Law", "Engineering Meaning"],
        r: [
          ["Arbitrary Distribution", "$\\mu \\pm 2 \\sigma$", "$\\ge 75.0\\%$ guaranteed minimum", "Chebyshev's Inequality ($1 - 1/k^2$)", "Holds for ANY distribution regardless of shape"],
          ["Arbitrary Distribution", "$\\mu \\pm 3 \\sigma$", "$\\ge 88.89\\%$ guaranteed minimum", "Chebyshev's Inequality ($1 - 1/9$)", "Conservative non-parametric outlier boundary"],
          ["Gaussian / Normal Distribution", "$\\mu \\pm 1 \\sigma$", "68.27% of population", "Empirical Gaussian rule", "One standard deviation envelope"],
          ["Gaussian / Normal Distribution", "$\\mu \\pm 2 \\sigma$", "95.45% of population", "Empirical Gaussian rule", "Two standard deviations ($p \\approx 0.05$ threshold)"],
          ["Gaussian / Normal Distribution", "$\\mu \\pm 3 \\sigma$", "99.73% of population", "Empirical Gaussian rule", "Three-sigma engineering limits (0.27% outliers)"]
        ],
        n: "The Standard Deviation is defined as the positive square root of the variance: $\\sigma = \\sqrt{E[(X - \\mu)^2]}$. For an empirical sample of size $n$, the sample standard deviation is $s = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2}$. Unlike variance, standard deviation shares the exact scale and units of the measurement: if an algorithm predicts house prices in dollars, the mean is $\\$400,000$ and the standard deviation is $\\$50,000$, enabling direct visual plotting as error bars on charts. Standard deviation enables the calculation of the **Z-Score (Standard Score)**: $z = \\frac{x - \\mu}{\\sigma}$, which normalizes measurements from arbitrary units into standardized units of standard deviations from the mean, enabling direct comparisons between disparate features."
      },

      miss: [
        {
          w: "95% of data is always within 2 standard deviations of the mean for any dataset.",
          r: "The '68-95-99.7' rule applies **strictly to Normal (Gaussian) distributions**. For arbitrary non-normal distributions, **Chebyshev's Inequality** guarantees only that at least $75\\%$ of data lies within $2\\sigma$ ($1 - 1/2^2 = 0.75$)."
        },
        {
          w: "Sample standard deviation $s = \\sqrt{\\frac{1}{n-1} \\sum (x_i - \\bar{x})^2}$ is an unbiased estimator of population $\\sigma$.",
          r: "While Bessel's correction makes sample *variance* $s^2$ an unbiased estimator of $\\sigma^2$, taking the square root introduces a non-linear concave transformation (Jensen's inequality). Consequently, sample standard deviation $s$ is **slightly biased downward**, underestimating true population $\\sigma$ for very small samples."
        },
        {
          w: "Standard deviation and Standard Error of the Mean (SEM) are identical.",
          r: "Standard Deviation ($\\sigma$) measures the dispersion of **individual data points** around the mean. **Standard Error of the Mean** ($\\text{SEM} = \\sigma / \\sqrt{n}$) measures the uncertainty in the **estimate of the sample mean itself**, shrinking towards zero as sample size $n$ grows."
        },
        {
          w: "Standard deviation is completely robust to extreme outliers.",
          r: "Because standard deviation is derived from squared deviations, a single massive outlier will drastically inflate $\\sigma$. For heavily skewed or contaminated data, robust statistics like the **Interquartile Range (IQR)** or **Median Absolute Deviation (MAD)** are superior."
        }
      ],

      trade: {
        buys: [
          "Shares original physical units: enables intuitive visual error bars and direct stakeholder communication.",
          "Universal standardization: powers Z-score normalization ($z = (x - \\mu)/\\sigma$) across all machine learning preprocessing pipelines.",
          "Chebyshev's inequality provides mathematical guarantees on data spread across any arbitrary distribution.",
          "The universal benchmark for risk and volatility in financial markets (Sharpe Ratio, Black-Scholes)."
        ],
        costs: [
          "Vulnerable to outliers: squaring deviations means extreme values distort standard deviation significantly.",
          "Non-additive: unlike variance, standard deviations cannot be added together ($\\sigma_{X+Y} \\ne \\sigma_X + \\sigma_Y$).",
          "Sample standard deviation is technically a biased estimator of true population standard deviation on small samples.",
          "Ineffective for heavy-tailed or multi-modal distributions where the mean itself is unrepresentative."
        ],
        avoid: [
          "Never assume 95% of data lies within $2\\sigma$ without validating that the distribution is approximately Gaussian.",
          "Do not add standard deviations together across components; add their variances and take the square root.",
          "Avoid using standard deviation as an error metric when comparing datasets with vastly different scales; use Coefficient of Variation ($CV = \\sigma / \\mu$)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
