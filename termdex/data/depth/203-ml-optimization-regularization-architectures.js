(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "lasso",
      why: {
        before: "Fitting linear regression models on datasets with hundreds of features resulted in severe overfitting, high parameter variance, and models dense with tiny non-zero coefficients that were impossible to interpret.",
        problem: "Standard Ordinary Least Squares (OLS) cannot handle cases where features exceed observations ($P > N$), while Ridge regression ($L_2$) shrinks coefficients but retains all features, providing zero automatic feature elimination.",
        shift: "LASSO (Least Absolute Shrinkage and Selection Operator, introduced by Robert Tibshirani) adds an $L_1$ penalty to the least squares objective: $\\lambda \\sum |\\beta_j|$, exploiting the diamond geometry of the $L_1$ ball to drive coefficients strictly to zero, performing simultaneous parameter shrinkage and sparse feature selection."
      },
      num: {
        t: "Linear Regularization Techniques & Mathematical Properties",
        h: ["Regularization Method", "Penalty Term", "Sparsity (Zero Weights)", "Analytic Closed-Form Solution", "Collinear Features Handling"],
        r: [
          ["Ordinary Least Squares (OLS)", "None", "No (Dense)", "Yes: (X^T X)^(-1) X^T y", "Fails (Singular X^T X matrix)"],
          ["Ridge Regression (L2)", "\\lambda \\sum \\beta_j^2", "No (Smooth shrinkage)", "Yes: (X^T X + \\lambda I)^(-1) X^T y", "Shrinks collinear coefficients equally"],
          ["LASSO Regression (L1)", "\\lambda \\sum |\\beta_j|", "Yes (Strict sparse zeros)", "No (Coordinate Descent required)", "Arbitrarily selects one feature and zeroes others"],
          ["Elastic Net (L1 + L2)", "\\lambda_1 |\\beta| + \\lambda_2 \\beta^2", "Yes (Sparse selection)", "No (Coordinate Descent required)", "Groups and selects correlated features together"],
          ["Scad / Non-Convex Penalty", "Folded concave penalties", "Yes (Oracle property)", "No (Non-convex optimization)", "Reduces estimation bias on large weights"]
        ],
        n: "The LASSO optimization objective minimizes: $\\mathcal{L}_{\\text{lasso}} = \\frac{1}{2N} \\|y - X\\beta\\|_2^2 + \\lambda \\|\\beta\\|_1$. Because the $L_1$ norm constraint region has sharp corners at the coordinate axes, the elliptical least-squares loss contours intersect the constraint at coordinates where parameters are exactly zero."
      },
      miss: [
        {
          w: "LASSO can be solved with standard matrix inversion like Ordinary Least Squares.",
          r: "Because the absolute value function $|x|$ has a non-differentiable kink at $x=0$, LASSO has no closed-form analytical solution and must be solved iteratively via subgradient coordinate descent or proximal gradient methods."
        },
        {
          w: "If two features are highly correlated, LASSO retains both with equal weights.",
          r: "When two features are highly collinear, LASSO arbitrarily selects one and forces the coefficient of the other to exactly zero; Elastic Net was specifically invented to retain groups of correlated features."
        },
        {
          w: "LASSO can select more features than the number of training samples (P > N).",
          r: "In high-dimensional settings where $P > N$, standard LASSO can select at most $N$ non-zero features before saturating, regardless of how many true predictive variables exist."
        },
        {
          w: "Feature scaling (normalization/standardization) is optional when running LASSO.",
          r: "Because the $L_1$ penalty treats all coefficient magnitudes equally, unscaled features with larger numerical units are penalized unfairly; features must strictly be standardized to zero mean and unit variance beforehand."
        }
      ],
      trade: {
        buys: [
          "Automated feature selection: produces sparse, interpretable models by zeroing out irrelevant predictors.",
          "Effectively controls overfitting and mitigates multicollinearity in high-dimensional feature spaces.",
          "Reduces model inference latency and storage by eliminating zero-weight feature computations.",
          "Convex optimization problem with guaranteed global convergence via coordinate descent."
        ],
        costs: [
          "No closed-form analytical matrix solution; requires iterative coordinate descent optimization.",
          "Arbitrary, unstable selection among groups of highly correlated features.",
          "Introduces estimation bias, shrinking true large coefficients toward zero.",
          "Limited to selecting at most $N$ features when number of predictors $P$ exceeds sample size $N$."
        ],
        avoid: [
          "Avoid applying LASSO without first standardizing all input features to mean 0 and variance 1.",
          "Avoid using LASSO when retaining all correlated predictors as a group is desired; use Elastic Net.",
          "Avoid regularizing the intercept parameter $\\beta_0$; penalize only the feature slope coefficients.",
          "Avoid choosing the hyperparameter $\\lambda$ arbitrarily; select $\\lambda$ using cross-validation (`LassoCV`)."
        ]
      }
    },
    {
      slug: "ridge-regression",
      why: {
        before: "Ordinary Least Squares (OLS) failed whenever features exhibited strong multicollinearity or when features outnumbered samples ($P > N$), producing singular, non-invertible Gram matrices $(X^T X)$ and wildly unstable coefficients.",
        problem: "In multicollinear regression, small fluctuations in input data cause massive swings in coefficient signs and magnitudes, destroying model generalization and creating extreme prediction variance.",
        shift: "Ridge Regression (Tikhonov Regularization) adds an $L_2$ squared Euclidean penalty to the least squares objective: $\\lambda \\sum \\beta_j^2$, which mathematically shifts the eigenvalues of the Gram matrix by adding $\\lambda I$, guaranteeing a strictly invertible matrix $(X^T X + \\lambda I)^{-1}$ with minimal prediction variance."
      },
      num: {
        t: "Ridge Regression Mathematical Stability & Characteristics",
        h: ["Property", "Ordinary Least Squares", "Ridge Regression (L2)", "LASSO Regression (L1)", "Principal Component Regression"],
        r: [
          ["Matrix Invertibility", "Requires X^T X full rank", "Guaranteed invertible via (X^T X + \\lambda I)", "N/A (Coordinate Descent)", "Guaranteed via orthogonal SVD components"],
          ["Coefficient Shrinkage", "None (Unbiased)", "Continuous proportional shrinkage", "Shrinkage + Truncation to 0", "Projection onto top K eigenvectors"],
          ["Handling Multicollinearity", "Catastrophic variance explosion", "Shares weight smoothly across features", "Arbitrarily picks single feature", "Rotates away collinear correlation"],
          ["Closed-Form Formula", "\\beta = (X^T X)^(-1) X^T y", "\\beta = (X^T X + \\lambda I)^(-1) X^T y", "None (Iterative solver)", "\\beta = V_k \\Sigma_k^(-1) U_k^T y"],
          ["Computational Complexity", "O(P^3 + P^2 N)", "O(P^3 + P^2 N)", "O(P * N * iterations)", "O(N P^2 + P^3)"]
        ],
        n: "In Singular Value Decomposition $X = U \\Sigma V^T$, the Ridge solution decomposes as: $\\hat{\\beta}_{\\text{ridge}} = \\sum_{j=1}^P \\frac{\\sigma_j^2}{\\sigma_j^2 + \\lambda} (u_j^T y) v_j$. The shrinkage factor $\\frac{\\sigma_j^2}{\\sigma_j^2 + \\lambda} < 1$ heavily dampens directions with tiny singular values $\\sigma_j$, eliminating variance explosion."
      },
      miss: [
        {
          w: "Ridge regression sets unimportant feature coefficients to zero.",
          r: "Ridge regression asymptotically shrinks coefficients toward zero but never sets them exactly to zero; all features remain in the final model (no sparsity)."
        },
        {
          w: "Ridge regression can be run on raw, unnormalized data without consequence.",
          r: "Because $L_2$ penalties square coefficient magnitudes ($\\beta_j^2$), predictors on larger numerical scales are penalized disproportionately; features must be standardized to unit variance first."
        },
        {
          w: "Ridge regression is strictly worse than LASSO because it doesn't perform feature selection.",
          r: "When many features contribute small, distributed effects to the target, or when features are highly correlated, Ridge regression consistently outperforms LASSO in predictive accuracy."
        },
        {
          w: "Setting $\\lambda = 0$ in Ridge regression produces different results than Ordinary Least Squares.",
          r: "When the regularization hyperparameter $\\lambda = 0$, the $L_2$ penalty term vanishes completely, making the Ridge regression solution mathematically identical to OLS."
        }
      ],
      trade: {
        buys: [
          "Guarantees a mathematically unique, closed-form solution even when $P > N$ or features are collinear.",
          "Smoothly shrinks correlated predictors together rather than arbitrarily dropping features.",
          "Provides the optimal trade-off in the bias-variance spectrum for dense, multi-signal datasets.",
          "Extremely computationally stable with efficient Cholesky decomposition or SVD solvers."
        ],
        costs: [
          "Does not produce sparse models: all feature coefficients remain non-zero.",
          "Requires storing and computing all $P$ features during real-time inference.",
          "Introduces slight statistical estimation bias into parameter estimates.",
          "Sensitive to feature scaling; requires robust preprocessing pipelines."
        ],
        avoid: [
          "Avoid using Ridge regression when an interpretable, sparse subset of features is required; use LASSO.",
          "Avoid forgetting to standardize inputs prior to applying the $L_2$ penalty.",
          "Avoid penalizing the bias/intercept term $\\beta_0$ in the regression formula.",
          "Avoid guessing $\\lambda$; evaluate cross-validation error curves via `RidgeCV`."
        ]
      }
    },
    {
      slug: "stratified-sampling",
      why: {
        before: "Splitting datasets into training and testing sets relied on simple uniform random sampling (`random_state=42`), assuming large sample sizes would naturally reflect underlying population distributions.",
        problem: "In real-world imbalanced datasets (fraud detection with 0.1% positive cases, rare disease diagnosis, failure telemetry), random sampling frequently starves the test set of minority samples or creates wildly divergent class ratios between train and test splits.",
        shift: "Stratified Sampling partitions the dataset into homogeneous subgroups (strata) based on target labels or categorical features before sampling, guaranteeing that train, validation, and test subsets mirror the exact class proportion ratios of the parent population."
      },
      num: {
        t: "Dataset Splitting & Sampling Methodologies",
        h: ["Sampling Strategy", "Class Proportion Preservation", "Variance of Evaluation", "Multi-Label Support", "Risk on Imbalanced Data"],
        r: [
          ["Simple Random Sampling", "No (Stochastic fluctuation)", "High (Especially on small/rare classes)", "Native", "Test split may receive zero minority samples"],
          ["Stratified Sampling (Single-Label)", "Exact (100% proportional match)", "Lowest evaluation variance", "Single target only", "Zero risk of class starvation"],
          ["Iterative Multi-Label Stratification", "Near-Exact across all label sets", "Low evaluation variance", "Yes (Seeded greedy split)", "Minimal risk across complex label combinations"],
          ["Stratified K-Fold Cross-Validation", "Exact across every fold", "Optimal (True generalization estimate)", "Standard single-label", "Protects cross-validation integrity"],
          ["Cluster / Group Sampling", "Preserves group boundaries", "High (Focuses on unseen groups)", "Group-dependent", "Tests out-of-distribution generalization"]
        ],
        n: "If population $N$ contains $K$ strata with counts $N_1, N_2, \\dots, N_K$, the proportion in stratum $k$ is $p_k = N_k / N$. In a stratified sample of total size $n$, the allocated count for stratum $k$ is strictly $n_k = \\text{round}(n \\cdot p_k)$, ensuring $\\sum n_k = n$ and minimizing sampling error variance."
      },
      miss: [
        {
          w: "Stratified sampling is only necessary when a dataset has fewer than 1,000 rows.",
          r: "Even in a dataset of 1,000,000 rows, if a critical fraud class occurs in 0.01% of instances (100 cases), random sampling can cause massive relative variance ($> 30\\%$) in evaluation splits."
        },
        {
          w: "Stratified sampling balances the minority class by duplicating positive samples.",
          r: "Stratified sampling preserves the true natural class ratio in all splits; balancing classes requires oversampling (SMOTE) or undersampling techniques, which are distinct from data splitting."
        },
        {
          w: "Standard stratified split tools in scikit-learn handle multi-label classification natively.",
          r: "`StratifiedKFold` only handles single-label targets; multi-label stratification requires specialized algorithms like `MultilabelStratifiedKFold` (iterative stratification)."
        },
        {
          w: "Stratifying continuous numerical targets is impossible.",
          r: "Continuous numerical regression targets can be stratified by binning the continuous target into quantiles or percentiles before executing stratified sampling."
        }
      ],
      trade: {
        buys: [
          "Eliminates evaluation variance caused by unlucky random class distribution splits.",
          "Guarantees that rare minority classes are proportionally represented in train, val, and test splits.",
          "Prevents models from evaluating on test sets that contain zero positive instances.",
          "Essential prerequisite for reliable cross-validation on imbalanced classification tasks."
        ],
        costs: [
          "Requires access to target labels prior to dataset splitting.",
          "Higher implementation complexity for multi-label or continuous regression datasets.",
          "Cannot be applied directly to streaming data where global class proportions are unknown upfront.",
          "May complicate group-level independence if data exhibits hierarchical grouping (requires GroupKFold)."
        ],
        avoid: [
          "Avoid using standard random `train_test_split` on imbalanced classification datasets; pass `stratify=y`.",
          "Avoid applying single-label stratification directly to multi-label classification problems.",
          "Avoid confusing stratified sampling (preserving ratios) with data balancing (resampling ratios).",
          "Avoid ignoring temporal sequence order in time-series data; stratification must respect time boundaries."
        ]
      }
    },
    {
      slug: "silu",
      why: {
        before: "Deep neural networks relied on ReLU (Rectified Linear Unit, $f(x) = \\max(0, x)$), which suffered from the 'dying ReLU' problem where large negative gradients permanently deactivated neurons with zero gradient flow.",
        problem: "ReLU's hard non-differentiable corner at $x=0$ and complete zeroing of negative inputs caused optimization instabilities, dead parameters, and suboptimal gradient propagation in massive transformer language models.",
        shift: "SiLU (Sigmoid Linear Unit, also known as Swish-1: $f(x) = x \\cdot \\sigma(x) = \\frac{x}{1 + e^{-x}}$) introduced a smooth, continuous, non-monotonic activation function that permits small negative gradients for negative inputs, becoming the default activation in modern frontier foundation models (LLaMA, Mistral, Stable Diffusion)."
      },
      num: {
        t: "Neural Network Activation Functions Mathematical Properties",
        h: ["Activation Function", "Mathematical Formulation", "Smoothness / Differentiability", "Monotonicity", "Negative Value Saturation"],
        r: [
          ["ReLU", "max(0, x)", "Piecewise continuous (Non-diff at 0)", "Strictly Monotonic", "Hard zero (Dying ReLU risk)"],
          ["Leaky ReLU", "max(\\alpha x, x)", "Piecewise continuous (Non-diff at 0)", "Strictly Monotonic", "Small constant slope (\\alpha x)"],
          ["GELU", "x * \\Phi(x) \\approx x * \\sigma(1.702 x)", "Smooth everywhere (C^\\infty)", "Non-Monotonic (Dip at -0.17)", "Smooth asymptote to 0"],
          ["SiLU / Swish", "x * \\sigma(x) = x / (1 + e^(-x))", "Smooth everywhere (C^\\infty)", "Non-Monotonic (Dip at -0.28)", "Smooth asymptote to 0"],
          ["GeGLU / SwiGLU", "(x W_1) * SiLU(x W_2)", "Smooth gated bilinear product", "Non-Monotonic gated", "Smooth gated modulation"]
        ],
        n: "The first derivative of SiLU is: $f'(x) = \\sigma(x) + x \\sigma(x)(1 - \\sigma(x)) = \\sigma(x) + f(x)(1 - \\sigma(x))$. The non-monotonic dip reaches a minimum value of $-0.278$ at $x \\approx -1.28$, allowing subtle negative activations to contribute to learning."
      },
      miss: [
        {
          w: "SiLU and GELU are the exact same mathematical function.",
          r: "GELU weights $x$ by the standard Gaussian cumulative distribution function $\\Phi(x)$, whereas SiLU weights $x$ by the logistic sigmoid function $\\sigma(x)$."
        },
        {
          w: "SiLU is strictly monotonic like ReLU.",
          r: "SiLU is non-monotonic: for negative values between $0$ and $-1.28$, the function dips downward to $-0.278$ before smoothly rising back toward zero as $x \\to -\\infty$."
        },
        {
          w: "SiLU is computationally identical in speed to ReLU on all hardware.",
          r: "SiLU requires computing an exponential transcendental function ($e^{-x}$), which is slightly more expensive than ReLU's single hardware comparison (`max(0, x)`), but hardware fused kernels render the difference negligible."
        },
        {
          w: "SwiGLU is just another name for SiLU.",
          r: "SiLU is a standalone activation function; SwiGLU is a gated linear unit architecture that computes the elementwise product of a linear projection and a SiLU-activated projection: $\\text{SwiGLU}(x) = (x W) \\odot \\text{SiLU}(x V)$."
        }
      ],
      trade: {
        buys: [
          "Smooth, everywhere-differentiable curvature provides superior gradient landscapes for gradient descent.",
          "Non-monotonic profile prevents the 'dying neuron' problem common in standard ReLU networks.",
          "Empirically superior convergence and lower validation loss in deep transformer architectures.",
          "Core building block of state-of-the-art SwiGLU feed-forward blocks in LLaMA, Mistral, and Gemma."
        ],
        costs: [
          "Higher computational FLOPs per neuron than simple piece-wise linear ReLU.",
          "Requires custom Triton or CUDA fused kernels to prevent memory bandwidth bottlenecks during backprop.",
          "Non-zero negative asymptote requires slightly more numerical precision in quantized low-bit models.",
          "Slightly increased activation memory caching during backward autograd passes."
        ],
        avoid: [
          "Avoid implementing SiLU as separate un-fused PyTorch ops (`x * torch.sigmoid(x)`); use `torch.nn.functional.silu`.",
          "Avoid using ReLU in modern generative transformer MLPs when SwiGLU/SiLU is feasible.",
          "Avoid quantizing SiLU layers to 4-bit without verifying non-monotonic curve representation.",
          "Avoid confusing the standalone SiLU activation with the gated SwiGLU multi-matrix projection layer."
        ]
      }
    },
    {
      slug: "adamw",
      why: {
        before: "Deep learning models used standard Adam with an added $L_2$ regularization penalty in the loss function, assuming that $L_2$ regularization and weight decay were mathematically equivalent as they are in standard Stochastic Gradient Descent (SGD).",
        problem: "In adaptive gradient algorithms like Adam, adding $L_2$ regularization to the loss causes weight penalties to be scaled inversely by the second moment gradient accumulator ($1 / \\sqrt{v_t}$), heavily penalizing weights with infrequent gradients and failing to regularize weights with large gradients.",
        shift: "AdamW (Decoupled Weight Decay, introduced by Ilya Loshchilov and Frank Hutter) fixed this fundamental flaw by decoupling weight decay from the gradient update step: weight decay is applied directly to the model weights independently of the adaptive moment buffers, becoming the universal optimizer for foundation models."
      },
      num: {
        t: "Deep Learning Optimizers Regularization Mechanics",
        h: ["Optimizer", "Weight Decay Implementation", "Coupled to Gradient Moments", "Generalization on Transformers", "Hyperparameter Sensitivity"],
        r: [
          ["SGD with L2 Regularization", "Coupled (\\nabla L + \\lambda \\theta)", "Yes (Trivially identical to decay)", "Good (with careful tuning)", "High (sensitive to learning rate)"],
          ["Standard Adam (with L2)", "Coupled (\\nabla L + \\lambda \\theta)", "Yes (Distorted by 1 / sqrt(v_t))", "Poor (Suboptimal generalization)", "Moderate"],
          ["AdamW", "Decoupled (\\theta_{t+1} = \\theta_t (1 - \\eta \\lambda) - \\dots)", "No (True decoupled decay)", "Optimal (State of the art)", "Robust"],
          ["Lion (Google Brain)", "Decoupled sign-based update", "No (Decoupled decay)", "Competitive (Faster / Lower memory)", "Sensitive to batch size"],
          ["LAMB / LARS", "Layer-wise trust ratio adaptive", "Decoupled variant", "Optimal for massive batch sizes (32k+)", "Tuned for massive clusters"]
        ],
        n: "The AdamW parameter update separates the two operations: $m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$, $v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$, and updates weights as: $\\theta_{t+1} = \\theta_t - \\eta_t \\lambda \\theta_t - \\frac{\\eta_t}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$. Decoupled decay shrinks weights by $(1 - \\eta_t \\lambda)$ uniformly."
      },
      miss: [
        {
          w: "Adding `weight_decay` in standard PyTorch `torch.optim.Adam` executes AdamW.",
          r: "In PyTorch, `torch.optim.Adam(..., weight_decay=1e-2)` implements historical broken $L_2$ regularization; true decoupled weight decay strictly requires using `torch.optim.AdamW`."
        },
        {
          w: "Weight decay and L2 regularization are always mathematically identical in all optimizers.",
          r: "They are only identical for standard Stochastic Gradient Descent (SGD); for adaptive moment algorithms (Adam, RMSprop, Adagrad), $L_2$ regularization couples to gradient variance while weight decay does not."
        },
        {
          w: "Weight decay in AdamW should be applied to all model parameters including bias and LayerNorm.",
          r: "Applying weight decay to 1D parameters (biases and normalization gain/bias parameters $\\gamma, \\beta$) causes underfitting; weight decay must strictly target 2D weight matrices (attention projections, MLP layers)."
        },
        {
          w: "AdamW requires setting the learning rate higher when weight decay increases.",
          r: "Because decoupled weight decay directly incorporates the learning rate $\\eta_t$ in its update step, optimal weight decay values remain far more stable across learning rate sweeps."
        }
      ],
      trade: {
        buys: [
          "Restores true weight decay regularization to adaptive moment optimizers.",
          "Dramatically improves out-of-sample generalization and validation perplexity in transformers.",
          "Decouples hyperparameter tuning: learning rate and weight decay can be optimized independently.",
          "The undisputed, universal industry standard optimizer for training LLMs and Vision Transformers."
        ],
        costs: [
          "Maintains two state tensors ($m_t$ and $v_t$) per parameter, tripling optimizer memory footprint (8 bytes/param).",
          "Requires custom parameter grouping to exclude bias and LayerNorm/RMSNorm tensors from decay.",
          "High memory overhead often necessitates 8-bit AdamW (bitsandbytes) or ZeRO optimizer offloading.",
          "Still requires learning rate warmup and decay schedules for stable transformer convergence."
        ],
        avoid: [
          "Avoid using `torch.optim.Adam` with `weight_decay`; always import `torch.optim.AdamW`.",
          "Avoid applying weight decay to bias vectors and LayerNorm/RMSNorm gain parameters.",
          "Avoid running full 32-bit AdamW on memory-constrained GPUs; use 8-bit AdamW or AdamW-BF16.",
          "Avoid omitting learning rate warmup when training large models with AdamW."
        ]
      }
    },
    {
      slug: "rmsnorm",
      why: {
        before: "Transformers normalized hidden states using standard Layer Normalization (LayerNorm), which computes both the mean and variance across the hidden dimension, subtracting the mean and dividing by the standard deviation.",
        problem: "Computing the mean across hidden vectors requires a sequential reduction pass and extra memory barrier synchronizations, consuming 3% to 7% of total training and inference time without contributing to representation stability.",
        shift: "Root Mean Square Layer Normalization (RMSNorm, proposed by Biao Zhang and Rico Sennrich) demonstrated that the mean-centering operation in LayerNorm is redundant; normalizing purely by the root mean square of activations achieves identical training stability while slashing computational overhead by up to 50% in the normalization kernel."
      },
      num: {
        t: "Normalization Techniques in Deep Neural Networks",
        h: ["Normalization Layer", "Mathematical Formulation", "Mean Subtraction (Shift)", "Computational Complexity", "Primary Adoption"],
        r: [
          ["LayerNorm (Ba et al.)", "(x - \\mu) / sqrt(\\sigma^2 + \\epsilon) * \\gamma + \\beta", "Yes (Computes \\mu and \\sigma)", "Higher (2 reduction passes)", "Original Transformer, GPT-3, BERT"],
          ["RMSNorm (Zhang et al.)", "x / RMS(x) * \\gamma", "No (Scales by RMS only)", "Lower (1 reduction pass, no \\beta)", "LLaMA, Mistral, Gemma, Chinchilla"],
          ["BatchNorm", "(x - \\mu_B) / sqrt(\\sigma_B^2 + \\epsilon) * \\gamma + \\beta", "Yes (Batch-level statistics)", "High (Synchronized batch overhead)", "Convolutional Neural Networks (ResNet)"],
          ["GroupNorm", "(x - \\mu_G) / sqrt(\\sigma_G^2 + \\epsilon) * \\gamma + \\beta", "Yes (Channel group statistics)", "Moderate", "Computer Vision & Diffusion Models"],
          ["InstanceNorm", "(x - \\mu_I) / sqrt(\\sigma_I^2 + \\epsilon) * \\gamma + \\beta", "Yes (Per-instance spatial)", "Moderate", "Style Transfer & Generative Audio"]
        ],
        n: "RMSNorm calculates: $\\text{RMS}(x) = \\sqrt{\\frac{1}{d} \\sum_{i=1}^d x_i^2 + \\epsilon}$, and produces the normalized output: $\\bar{y}_i = \\frac{x_i}{\\text{RMS}(x)} \\gamma_i$. Because the learnable bias parameter $\\beta$ and the mean $\\mu$ are discarded, kernel memory bandwidth requirements drop significantly."
      },
      miss: [
        {
          w: "RMSNorm degrades LLM reasoning and benchmark performance compared to LayerNorm.",
          r: "Extensive empirical research across LLaMA, Mistral, and Gemma shows zero degradation in reasoning, perplexity, or downstream accuracy when replacing LayerNorm with RMSNorm."
        },
        {
          w: "RMSNorm includes a learnable bias vector $\\beta$ like LayerNorm.",
          r: "RMSNorm typically dispenses with the learnable bias parameter $\\beta$ entirely, utilizing only a learnable scale parameter $\\gamma$, saving parameters and memory."
        },
        {
          w: "RMSNorm computes statistics across the batch dimension like BatchNorm.",
          r: "RMSNorm operates strictly along the hidden feature dimension ($d_{\\text{model}}$) of each individual token independently, making it completely invariant to batch size."
        },
        {
          w: "RMSNorm cannot prevent activation scaling explosions in deep networks.",
          r: "By scaling activations strictly by their root mean square, RMSNorm enforces identical scaling invariance ($f(\\alpha x) = f(x)$) as LayerNorm, guaranteeing gradient stability in deep networks."
        }
      ],
      trade: {
        buys: [
          "Reduces normalization kernel execution time by up to 50%, saving 3-7% total training time.",
          "Eliminates sequential reduction passes required to compute mean statistics in GPU memory.",
          "Fewer trainable parameters per layer by discarding the learnable additive bias vector $\\beta$.",
          "Universal adoption in modern open-weights foundation architectures (LLaMA 1/2/3, Mistral, Gemma)."
        ],
        costs: [
          "Lacks the mean-centering property; uncentered inputs with massive constant DC offsets are not shifted.",
          "Requires custom Triton or CUDA fused kernels to achieve maximum speedups over standard PyTorch.",
          "Not backward compatible with legacy transformer checkpoints trained with standard LayerNorm.",
          "Epsilon value must be tuned carefully (e.g. $10^{-5}$ or $10^{-6}$) to prevent underflow in FP16/BF16."
        ],
        avoid: [
          "Avoid implementing RMSNorm with separate un-fused PyTorch arithmetic operations; use fused kernels.",
          "Avoid adding an additive bias parameter $\\beta$ back into RMSNorm unless replicating legacy models.",
          "Avoid using a tiny epsilon ($10^{-12}$) in FP16 precision, which causes numerical instability; use $10^{-5}$ or $10^{-6}$.",
          "Avoid mixing LayerNorm and RMSNorm layers haphazardly across a single transformer stack."
        ]
      }
    },
    {
      slug: "learning-rate-warmup",
      why: {
        before: "Neural network training started immediately at the peak learning rate from the very first step, which caused catastrophic parameter destabilization when initial random weights produced massive, noisy gradients.",
        problem: "In adaptive optimizers (Adam/AdamW), the second-moment accumulator ($v_t$) is initialized to zero; in early steps, uncalibrated variance estimates combined with high learning rates cause gradients to make destructive, irreversible weight updates.",
        shift: "Learning Rate Warmup starts training with a tiny initial learning rate (near zero) and linearly or cosine-scales it up to the target peak learning rate over the initial $W$ steps, allowing Adam's moment estimates to stabilize and preventing early divergence in deep transformers."
      },
      num: {
        t: "Learning Rate Schedules & Initialization Mechanics",
        h: ["Schedule Strategy", "Warmup Mechanism", "Decay Phase", "Early Stability Risk", "Primary Target"],
        r: [
          ["Linear Warmup + Cosine Decay", "Linear increase (0 to $\\eta_{max}$ in W steps)", "Smooth cosine decay to $\\eta_{min}$", "Near Zero (Highly stable)", "Modern LLMs (LLaMA, GPT-4)"],
          ["Linear Warmup + Linear Decay", "Linear increase (0 to $\\eta_{max}$ in W steps)", "Linear decay to 0", "Near Zero (Highly stable)", "Standard fine-tuning (BERT, SFT)"],
          ["Constant Learning Rate", "None (Starts at $\\eta_{max}$ immediately)", "None (Constant)", "Extreme (Gradient explosion / NaN)", "Simple classical models"],
          ["Step Decay (No Warmup)", "None", "Discrete drops at epochs (e.g. 0.1x)", "High at step 0", "Legacy Computer Vision (ResNet)"],
          ["Warmup + WSD (Warmup-Stable-Decay)", "Linear increase in W steps", "Long stable plateau + rapid decay", "Near Zero (Flexible compute)", "MiniMax, modern continual training"]
        ],
        n: "During linear warmup for step $t \\le W$, the learning rate is: $\\eta_t = \\eta_{\\text{max}} \\cdot \\frac{t}{W}$. For subsequent steps $t > W$ under cosine decay across total steps $T$: $\\eta_t = \\eta_{\\text{min}} + \\frac{1}{2}(\\eta_{\\text{max}} - \\eta_{\\text{min}})\\left(1 + \\cos\\left(\\frac{t - W}{T - W} \\pi\\right)\\right)$."
      },
      miss: [
        {
          w: "Learning rate warmup is only needed when training from scratch, never during fine-tuning.",
          r: "Fine-tuning on new domain data also causes sharp initial gradient spikes; a brief warmup phase (typically 1-5% of total steps) prevents destroying pre-trained foundation weights."
        },
        {
          w: "Making the warmup phase as long as possible (e.g. 50% of total training) is always safer.",
          r: "Excessively long warmup wastes valuable compute training at suboptimal, tiny learning rates, drastically slowing down convergence; standard warmup spans 1% to 5% of total steps."
        },
        {
          w: "Warmup is only necessary because weights are initialized with high random values.",
          r: "Even with optimal weight initialization (Xavier/He), adaptive optimizers like Adam still suffer from uncalibrated moment estimates ($v_t \\approx 0$) during early steps, requiring warmup."
        },
        {
          w: "The learning rate should start at 10% of peak learning rate during warmup.",
          r: "Warmup should start from near zero (e.g. $0.0$ or $10^{-8}$) to provide the gentlest possible stabilization for early optimizer moment accumulation."
        }
      ],
      trade: {
        buys: [
          "Prevents early catastrophic gradient explosions and NaN loss spikes in deep networks.",
          "Allows adaptive optimizers (Adam, AdamW) to accumulate stable moving average statistics.",
          "Enables training with much higher peak learning rates without risk of early divergence.",
          "Proven empirical necessity for stable training across all modern transformer architectures."
        ],
        costs: [
          "Adds an additional hyperparameter: selecting the warmup step duration $W$.",
          "Initial warmup steps contribute minimal loss reduction due to tiny learning rates.",
          "Slightly complicates learning rate scheduler logic and checkpoint resumption code.",
          "Requires knowing or estimating the total step count in advance for proper ratio calculation."
        ],
        avoid: [
          "Avoid training transformers from scratch without a learning rate warmup phase.",
          "Avoid setting warmup duration to more than 10% of total scheduled training steps.",
          "Avoid resuming training from a saved checkpoint with a new warmup phase unless resetting the optimizer.",
          "Avoid starting warmup from a large fraction of the peak learning rate; begin near zero."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
