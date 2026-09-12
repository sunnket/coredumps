/* ==========================================================================
   Depth pass 11 — generative models, architectures, and the linear algebra
   underneath all of it.

   A note that ties several of these together: every generative model is a
   different answer to "how do you learn a distribution you can sample from".
   GANs learn it implicitly through a critic, VAEs learn it explicitly but
   approximately, and diffusion learns to reverse a destruction process. The
   trade-offs between them are almost entirely about which failure mode you
   can tolerate.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "generative-adversarial-network",

      why: {
        before: "Generative models were trained by maximum likelihood, which " +
          "requires being able to **evaluate** the probability of a sample. " +
          "That forces restrictive architectures, and the resulting images " +
          "were blurry.",
        problem: "Blur comes from the objective. Maximum likelihood with a " +
          "pixel-wise loss averages over all plausible outputs, and the average " +
          "of many sharp images is a smudge. Nobody could write a loss function " +
          "that means *looks real to a human*.",
        shift: "**Learn the loss function.** Train a discriminator to tell real " +
          "from fake, and train the generator to fool it. Neither network needs " +
          "an explicit probability — the discriminator's gradient tells the " +
          "generator which direction looks more real. Goodfellow's 2014 idea " +
          "was to make the objective itself adversarial and learned."
      },

      num: {
        t: "Generative model families, compared",
        h: ["Family", "Sample quality", "Diversity", "Sampling speed"],
        r: [
          ["GAN", "**very high**", "poor — mode collapse", "**one pass**"],
          ["VAE", "blurry", "good", "one pass"],
          ["Diffusion", "very high", "**very good**", "slow — many steps"],
          ["Autoregressive", "high", "good", "slow — token by token"]
        ],
        n: "GANs are **one forward pass** to sample, which is why they survive " +
          "in real-time applications despite diffusion overtaking them on " +
          "quality. Their defining failure is **mode collapse**: the generator " +
          "finds one output that reliably fools the discriminator and produces " +
          "only that, scoring well while representing almost none of the data. " +
          "There is also **no meaningful loss curve** — the two losses oscillate " +
          "by design, so you cannot tell from them whether training is going " +
          "well and must look at samples or FID."
      },

      miss: [
        {
          w: "You should train the discriminator until it is accurate, then " +
            "train the generator.",
          r: "A *too good* discriminator is the classic failure. If it " +
            "separates real from fake perfectly, its gradient **vanishes** and " +
            "the generator receives no useful signal. The two must stay roughly " +
            "matched — which is exactly what makes GAN training so delicate."
        },
        {
          w: "Lower generator loss means better samples.",
          r: "The losses are adversarial, so they measure relative performance " +
            "against a moving opponent, not absolute quality. A falling " +
            "generator loss may only mean the discriminator got worse. Quality " +
            "must be judged by **FID** or by looking."
        },
        {
          w: "GANs are obsolete now that diffusion exists.",
          r: "Diffusion wins on quality and diversity; GANs win decisively on " +
            "**inference cost** — one pass against dozens. They remain the " +
            "choice for real-time super-resolution, on-device generation and " +
            "latency-bound work. StyleGAN's latent space also offers editing " +
            "control that diffusion models only approximate."
        },
        {
          w: "Mode collapse means the generator produces identical images.",
          r: "It is a spectrum, and partial collapse is more common and harder " +
            "to spot: the model covers *some* modes and silently ignores " +
            "others. A GAN on a digits dataset that never produces a 7 has " +
            "collapsed partially, and no per-sample quality metric will " +
            "reveal it."
        }
      ],

      trade: {
        buys: [
          "Sharp, realistic samples without a hand-designed loss.",
          "Single forward pass to generate — orders of magnitude faster than " +
            "diffusion.",
          "A structured latent space enabling interpolation and editing.",
          "No need to evaluate probabilities, so architectures are " +
            "unconstrained."
        ],
        costs: [
          "Notoriously unstable; requires careful balancing to converge.",
          "Mode collapse is common and partial collapse is hard to detect.",
          "No usable loss curve — evaluation needs separate metrics.",
          "Cannot compute the likelihood of a given sample."
        ],
        avoid: [
          "You need **diversity** and full coverage of the distribution — " +
            "diffusion or a VAE.",
          "You need likelihoods, for anomaly detection or compression.",
          "Sampling speed is irrelevant, in which case diffusion is simply " +
            "better.",
          "Training stability matters more than peak quality; GANs need a lot " +
            "of babysitting."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "variational-autoencoder",

      why: {
        before: "A plain autoencoder compressed inputs to a latent vector and " +
          "reconstructed them. Excellent compression, and **useless for " +
          "generation** — sample a random latent and you get noise, because " +
          "the encoder scattered training points arbitrarily with gaps between " +
          "them.",
        problem: "You want to *sample* from the latent space, which requires " +
          "knowing its distribution. A plain autoencoder has no reason to make " +
          "the latent space continuous or to give it any particular shape.",
        shift: "Encode to a **distribution** rather than a point, and add a KL " +
          "term pulling every encoded distribution toward a standard Gaussian. " +
          "The latent space becomes continuous and Gaussian-shaped, so sampling " +
          "from `N(0, I)` and decoding produces something plausible. The " +
          "**reparameterisation trick** — sampling as `μ + σ·ε` — is what makes " +
          "the sampling step differentiable."
      },

      num: {
        t: "The ELBO, and what each term does",
        h: ["Term", "Pulls toward", "If it dominates"],
        r: [
          ["Reconstruction loss", "faithful reconstruction", "latent space has gaps"],
          ["KL divergence", "a standard Gaussian latent", "**posterior collapse**"]
        ],
        n: "The balance between these is the whole design. If KL dominates, " +
          "the encoder outputs the prior regardless of input, the decoder " +
          "ignores the latent, and you have learned nothing — **posterior " +
          "collapse**, especially common with a powerful autoregressive " +
          "decoder. Hence **KL annealing** (ramp the KL weight up during " +
          "training) and **β-VAE** (deliberately weight KL above 1 to force " +
          "disentangled factors, at the cost of reconstruction). The blur that " +
          "VAEs are known for comes from the reconstruction term being a " +
          "pixel-wise Gaussian likelihood, which averages over plausible " +
          "outputs."
      },

      miss: [
        {
          w: "A VAE is an autoencoder with noise added.",
          r: "It is derived from **variational inference**: the loss is a lower " +
            "bound on the data's log-likelihood (the **ELBO**), and the KL term " +
            "is not regularisation bolted on but a consequence of that " +
            "derivation. The noise is how you sample from the encoded " +
            "distribution, not a trick for robustness."
        },
        {
          w: "The latent dimensions are interpretable features.",
          r: "Only if you force it. A standard VAE has no reason to align " +
            "dimensions with meaningful factors — the Gaussian prior is " +
            "rotationally symmetric, so any rotation of the latent space is " +
            "equally good. **β-VAE** and related methods add pressure toward " +
            "disentanglement, and even then it is partial and contested."
        },
        {
          w: "VAEs produce blurry images because they are weaker models.",
          r: "The blur comes from the **loss**, not model capacity. A pixel-wise " +
            "reconstruction loss is minimised by predicting the average of all " +
            "plausible images. Replace it with a perceptual or adversarial loss " +
            "(VAE-GAN) and the blur largely goes away."
        },
        {
          w: "VAEs have been superseded by diffusion models.",
          r: "Stable Diffusion runs its entire diffusion process **inside a " +
            "VAE's latent space** — that is what *latent* diffusion means, and " +
            "it is why it is tractable on consumer hardware. The VAE compresses " +
            "512×512×3 to 64×64×4, a 48× reduction. Far from superseded, it is " +
            "load-bearing."
        }
      ],

      trade: {
        buys: [
          "A continuous, sampleable latent space — genuine generation.",
          "A principled probabilistic objective with a likelihood bound.",
          "Stable training, unlike GANs.",
          "The latent space is useful for compression and downstream tasks."
        ],
        costs: [
          "Blurry samples with a standard pixel-wise loss.",
          "Posterior collapse with strong decoders.",
          "The ELBO is a bound, so likelihoods are not exact.",
          "Balancing reconstruction against KL needs tuning."
        ],
        avoid: [
          "You need maximum sample fidelity — diffusion or a GAN.",
          "You only need compression with no generation — a plain autoencoder " +
            "is simpler and reconstructs better.",
          "Exact likelihoods are required — use a normalising flow.",
          "The data is discrete, where the Gaussian latent assumption fits " +
            "poorly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "vision-transformer",

      why: {
        before: "Computer vision was CNNs. Convolution's assumptions — " +
          "locality and translation invariance — matched images so well that " +
          "nothing else was competitive.",
        problem: "Those assumptions are also a ceiling. A convolution's " +
          "receptive field grows only with depth, so relating two distant parts " +
          "of an image takes many layers. Meanwhile transformers had shown that " +
          "with enough data, a model can *learn* structure rather than having " +
          "it built in.",
        shift: "Cut the image into fixed patches, flatten each into a vector, " +
          "and treat the sequence exactly like text. No convolution, no " +
          "locality assumption. The 2020 ViT paper's finding was blunt: with " +
          "**enough** pretraining data it beats CNNs, and without it, it loses."
      },

      num: {
        t: "ViT against ResNet, by pretraining scale",
        h: ["Pretraining data", "ViT-L accuracy", "vs ResNet"],
        r: [
          ["ImageNet (1.3M)", "lower", "**CNN wins**"],
          ["ImageNet-21k (14M)", "comparable", "roughly equal"],
          ["JFT-300M (300M)", "higher", "**ViT wins**"]
        ],
        n: "This table is the clearest empirical statement of the " +
          "inductive-bias trade there is. A 224×224 image at 16×16 patches is " +
          "**196 tokens** plus a class token — a short sequence, so the " +
          "quadratic cost of attention is not the problem it is in language. " +
          "The problem is data hunger: without convolution's built-in " +
          "assumptions the model must learn locality from examples, and that " +
          "takes tens of millions of them. **Hybrid** models and hierarchical " +
          "designs like **Swin** reintroduce some locality to get both."
      },

      miss: [
        {
          w: "ViT is better than CNNs for computer vision.",
          r: "Better **at scale**. Below roughly ImageNet size a comparable CNN " +
            "wins, and on small domain datasets — medical imaging, industrial " +
            "inspection — a CNN or a fine-tuned CNN backbone is usually still " +
            "the right choice."
        },
        {
          w: "ViT has no inductive bias about images.",
          r: "**Patching itself is a bias**: it asserts that a 16×16 square is " +
            "a meaningful unit and imposes a grid. Positional embeddings encode " +
            "2-D layout. It has *less* bias than convolution, not none."
        },
        {
          w: "Attention over patches is prohibitively expensive for images.",
          r: "At 196 tokens it is cheap. The cost appears at **high " +
            "resolution** — 1024×1024 at 16×16 patches is 4,096 tokens, and " +
            "quadratic attention on that is expensive. Hierarchical designs " +
            "with windowed attention (Swin) exist precisely for dense tasks at " +
            "high resolution."
        },
        {
          w: "You need JFT-300M-scale data to use one.",
          r: "You need it to **pretrain** one. In practice you fine-tune a " +
            "released checkpoint, which is exactly how CNNs have been used for " +
            "a decade. **DeiT** also showed that distillation and strong " +
            "augmentation can train a competitive ViT on ImageNet alone."
        }
      ],

      trade: {
        buys: [
          "Global receptive field from the very first layer.",
          "Scales better than CNNs with data and model size.",
          "One architecture shared with language, enabling multimodal models.",
          "Attention maps offer some interpretability."
        ],
        costs: [
          "Needs far more data or heavy augmentation and distillation.",
          "Quadratic in patch count, so high resolution is expensive.",
          "Patching discards fine detail within a patch.",
          "Weaker on small datasets than a CNN of similar size."
        ],
        avoid: [
          "The dataset is small and no suitable pretrained checkpoint exists.",
          "You need very high resolution dense prediction — use a hierarchical " +
            "variant.",
          "Deploying on constrained hardware where efficient CNNs dominate.",
          "The task is narrow and a fine-tuned CNN already performs well."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "catastrophic-forgetting",

      why: {
        before: "The assumption was that a network could be trained on a new " +
          "task the way a person learns a new skill — adding to what it knows.",
        problem: "It does not add; it **overwrites**. Training on task B moves " +
          "the weights to minimise B's loss, with nothing preserving A's. " +
          "Performance on A can collapse from 95% to near chance within a few " +
          "hundred steps. The knowledge was distributed across the same weights " +
          "the new task is now using.",
        shift: "Recognise this as the **stability-plasticity dilemma**: the " +
          "same property that lets a network learn quickly is what lets it " +
          "forget quickly. Every mitigation either protects important weights, " +
          "keeps some old data around, or adds new capacity rather than " +
          "reusing old."
      },

      num: {
        t: "Mitigations",
        h: ["Approach", "Method", "Cost"],
        r: [
          ["Rehearsal", "mix in old examples", "must store old data"],
          ["Regularisation (EWC)", "penalise changing important weights", "compute a Fisher matrix"],
          ["Parameter isolation", "LoRA, adapters, new heads", "grows with tasks"],
          ["Generative replay", "a model generates old examples", "train a generator too"]
        ],
        n: "**Rehearsal is the strongest and the least elegant** — mixing in " +
          "even **5–10%** old data prevents most forgetting, and no clever " +
          "regularisation reliably beats it. This is why instruction-tuning " +
          "datasets deliberately retain general data, and why fine-tuning a " +
          "chat model on a narrow domain often destroys its general ability: " +
          "there is no rehearsal. **LoRA reduces forgetting substantially** " +
          "because the base weights are frozen — the damage is confined to a " +
          "small adapter you can remove."
      },

      miss: [
        {
          w: "Forgetting happens because the network runs out of capacity.",
          r: "It happens with vastly overparameterised networks that have " +
            "capacity to spare. The cause is **interference**: gradient descent " +
            "has no term preserving old performance, so it freely moves weights " +
            "that mattered for the old task. Capacity is not the constraint."
        },
        {
          w: "A lower learning rate prevents it.",
          r: "It slows it, and slows learning the new task by the same factor. " +
            "You are trading plasticity for stability along one axis rather " +
            "than escaping the trade-off. The methods that actually work " +
            "distinguish *which* weights matter."
        },
        {
          w: "Fine-tuning an LLM on my data only adds knowledge.",
          r: "It reliably degrades capabilities you did not train on. " +
            "Fine-tuning on domain text commonly harms instruction-following, " +
            "safety behaviour and reasoning. The standard mitigations are LoRA, " +
            "mixing in general data, and a low learning rate with few epochs."
        },
        {
          w: "Humans do not have this problem, so the architecture is wrong.",
          r: "Humans forget substantially too, and the brain appears to use " +
            "**replay** during sleep — the biological analogue of rehearsal. " +
            "It also has complementary fast and slow learning systems. The " +
            "difference is one of degree and mechanism, not a clean solution " +
            "we are failing to copy."
        }
      ],

      trade: {
        buys: [
          "Naming it explains a large class of otherwise baffling regressions.",
          "Rehearsal is simple and highly effective.",
          "Adapter methods sidestep it almost entirely.",
          "Forces explicit thinking about what must be preserved."
        ],
        costs: [
          "Rehearsal requires keeping old data, which may be impossible for " +
            "privacy or licensing reasons.",
          "Regularisation methods add computation and hyperparameters.",
          "Adapters grow with the number of tasks.",
          "Evaluating it means testing on tasks you are not training on."
        ],
        avoid: [
          "The model is trained once on a fixed distribution and never " +
            "updated.",
          "You genuinely want the old behaviour replaced.",
          "Tasks are disjoint enough to justify separate models — often the " +
            "simplest correct answer.",
          "You are using LoRA and can swap adapters per task."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "shap",

      why: {
        before: "Feature importance came from the model itself — a tree's split " +
          "counts, a linear model's coefficients. Those are **global** and " +
          "model-specific, and they cannot explain a single prediction.",
        problem: "The question that matters operationally is *why was **this** " +
          "loan declined*, and regulation increasingly requires an answer. " +
          "Ad-hoc local explanations turned out to be inconsistent — different " +
          "methods gave contradictory attributions for the same prediction.",
        shift: "Borrow from **cooperative game theory**. Treat features as " +
          "players cooperating to produce the prediction and distribute the " +
          "payout using **Shapley values** — the unique allocation satisfying " +
          "efficiency, symmetry, dummy and additivity. It is not one heuristic " +
          "among many; it is the only allocation with those properties."
      },

      num: {
        t: "Exact against approximate",
        h: ["Method", "Complexity", "Applies to"],
        r: [
          ["Exact Shapley", "**O(2ⁿ)** in features", "anything, infeasibly"],
          ["KernelSHAP", "sampled coalitions", "any model"],
          ["**TreeSHAP**", "O(TLD²) — polynomial", "tree ensembles"],
          ["DeepSHAP", "backprop-based", "neural networks"]
        ],
        n: "Exact computation requires evaluating every subset of features — " +
          "**2ⁿ** coalitions, so 20 features is a million evaluations and 30 is " +
          "a billion. TreeSHAP is the reason SHAP became practical: it exploits " +
          "tree structure to compute exact values in polynomial time, which is " +
          "why SHAP is ubiquitous in gradient-boosting workflows and " +
          "approximated everywhere else. The **additivity** property is what " +
          "makes it uniquely useful: the values sum exactly to the difference " +
          "between this prediction and the average prediction."
      },

      miss: [
        {
          w: "SHAP tells you what caused the prediction.",
          r: "It attributes the model's **output**, not the world's causality. " +
            "If the model uses a proxy for a protected attribute, SHAP faithfully " +
            "reports the proxy's contribution — it is explaining the model, and " +
            "the model may be wrong about the world."
        },
        {
          w: "A high SHAP value means the feature is important.",
          r: "It means important **for this prediction**. A feature can have " +
            "large positive attribution for one instance and large negative for " +
            "another, averaging to near zero globally. Confusing local with " +
            "global importance is the most common misreading."
        },
        {
          w: "SHAP handles correlated features correctly.",
          r: "This is its most serious limitation. With correlated features, " +
            "the standard approach evaluates the model on **unrealistic " +
            "combinations** — off the data manifold — where the model's " +
            "behaviour is undefined and its output arbitrary. Credit can also " +
            "be split arbitrarily between two correlated features."
        },
        {
          w: "You can use SHAP to decide which features to remove.",
          r: "Low attribution may mean the feature is redundant *given the " +
            "others*, not that it carries no information. Remove it and a " +
            "correlated partner absorbs its role — or, if you remove both, " +
            "performance drops. Feature selection needs retraining and " +
            "measurement, not attribution."
        }
      ],

      trade: {
        buys: [
          "Per-prediction explanations, which is what regulation asks for.",
          "Theoretically unique under a clear set of axioms.",
          "Model-agnostic, with a fast exact algorithm for trees.",
          "Local values aggregate into a coherent global picture."
        ],
        costs: [
          "Exponential in general; approximations introduce variance.",
          "Correlated features break the underlying assumption.",
          "Easily misread as causal.",
          "Explaining a wrong model well can increase misplaced confidence."
        ],
        avoid: [
          "The model is already interpretable — read the coefficients.",
          "You need **causal** effects; use a causal method and a designed " +
            "experiment.",
          "Features are heavily correlated and you cannot account for it.",
          "You need global importance only — permutation importance is much " +
            "cheaper."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "eigenvalue",

      why: {
        before: "A matrix was understood as a table of numbers and a set of " +
          "rules for multiplying it. Correct, and it explains nothing about " +
          "what the transformation *does*.",
        problem: "Applying a matrix repeatedly — as happens in Markov chains, " +
          "in recurrent networks, in iterative solvers — has behaviour that is " +
          "invisible from the entries. Does it converge? Explode? Rotate " +
          "forever? The numbers do not say.",
        shift: "Find the directions the matrix does **not** rotate. Along an " +
          "eigenvector, the transformation is pure scaling by the eigenvalue. " +
          "In that basis the matrix is diagonal, repeated application is just " +
          "raising numbers to a power, and the long-run behaviour becomes " +
          "obvious."
      },

      num: {
        t: "What eigenvalues tell you immediately",
        h: ["Condition", "Meaning"],
        r: [
          ["All \\|λ\\| < 1", "repeated application → 0, stable"],
          ["Any \\|λ\\| > 1", "**explodes** along that direction"],
          ["Largest λ = 1", "converges to a steady state"],
          ["Complex λ", "rotation, spiralling"],
          ["λ = 0", "matrix is singular, collapses a dimension"]
        ],
        n: "This is the whole vanishing/exploding gradient problem in one row. " +
          "An RNN applies roughly the same weight matrix at every timestep, so " +
          "gradients over 100 steps involve `W¹⁰⁰` — and `0.9¹⁰⁰ ≈ 0.00003` " +
          "while `1.1¹⁰⁰ ≈ 13,780`. The **spectral radius** decides which. It " +
          "is also why **spectral normalisation** stabilises GANs and why " +
          "orthogonal initialisation (all `|λ| = 1`) helps deep networks. PCA " +
          "is the same idea: eigenvectors of the covariance matrix, with " +
          "eigenvalues giving the variance along each."
      },

      miss: [
        {
          w: "Every matrix has a full set of eigenvectors.",
          r: "**Defective** matrices do not — they have repeated eigenvalues " +
            "with too few independent eigenvectors and cannot be diagonalised. " +
            "This is partly why **SVD** is often preferred: it exists for every " +
            "matrix, including non-square ones, while eigendecomposition does " +
            "not."
        },
        {
          w: "Eigenvalues are always real numbers.",
          r: "Only for **symmetric** (or Hermitian) matrices, which is a big " +
            "reason those are so pleasant — real eigenvalues and orthogonal " +
            "eigenvectors, guaranteed. A general matrix can have complex " +
            "eigenvalues, and their imaginary part encodes rotation."
        },
        {
          w: "The largest eigenvalue is the most important one.",
          r: "It dominates **repeated application**, which is why it governs " +
            "stability and why power iteration finds it. For other purposes the " +
            "small ones matter more — near-zero eigenvalues indicate " +
            "near-singularity and a large **condition number**, which is what " +
            "makes a linear system numerically unstable."
        },
        {
          w: "Computing eigenvalues means finding roots of the characteristic " +
            "polynomial.",
          r: "That is the definition and a terrible algorithm — root-finding is " +
            "numerically unstable and there is no closed form past degree four. " +
            "Real implementations use iterative methods, chiefly the **QR " +
            "algorithm**, which is one of the most important numerical " +
            "algorithms of the twentieth century."
        }
      ],

      trade: {
        buys: [
          "Reveals what a transformation actually does, geometrically.",
          "Makes repeated application tractable — diagonal powers.",
          "The basis of PCA, spectral clustering and PageRank.",
          "Predicts stability of any iterative process."
        ],
        costs: [
          "Only for square matrices, and not all of those are diagonalisable.",
          "`O(n³)` to compute, prohibitive for very large dense matrices.",
          "Can be complex-valued, complicating interpretation.",
          "Numerically delicate for near-defective matrices."
        ],
        avoid: [
          "The matrix is not square — use **SVD**.",
          "You need a numerically robust decomposition regardless of " +
            "structure — again SVD.",
          "Only the top few are needed on a huge sparse matrix — use power " +
            "iteration or Lanczos.",
          "The matrix has no repeated-application interpretation, where the " +
            "spectrum may tell you nothing useful."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bootstrapping",

      why: {
        before: "Confidence intervals came from formulas derived per statistic " +
          "under distributional assumptions — usually normality, usually via " +
          "the central limit theorem.",
        problem: "Those formulas exist for the mean and a handful of others. " +
          "For a median, a 95th percentile, a correlation, an AUC, or the ratio " +
          "of two estimates, either no closed form exists or it rests on " +
          "assumptions your data violates.",
        shift: "Efron's 1979 insight: **the sample is your best estimate of the " +
          "population**, so resample from it. Draw n items with replacement, " +
          "recompute the statistic, repeat thousands of times, and the spread " +
          "of those values estimates the sampling distribution. It works for " +
          "*any* statistic you can compute."
      },

      num: {
        t: "Practical parameters",
        h: ["Question", "Answer", "Note"],
        r: [
          ["How many resamples?", "1,000–10,000", "more for tail percentiles"],
          ["Resample size?", "**n**, same as original", "with replacement"],
          ["Unique items per resample", "~63.2%", "the rest are duplicates"],
          ["Interval method", "percentile, or BCa", "BCa corrects bias and skew"]
        ],
        n: "The **63.2%** figure is `1 - 1/e` and it is not a curiosity — it is " +
          "exactly where random forests' **out-of-bag** error estimate comes " +
          "from: the ~37% of rows not drawn for a given tree serve as its " +
          "validation set for free. On intervals: the simple percentile method " +
          "is biased when the statistic's distribution is skewed, and **BCa** " +
          "(bias-corrected and accelerated) is the recommended default in most " +
          "statistical libraries."
      },

      miss: [
        {
          w: "Bootstrapping creates more data.",
          r: "It creates **no new information**. It reuses the sample you have " +
            "to estimate how much your statistic would vary across samples you " +
            "did not take. If the original sample is unrepresentative, every " +
            "bootstrap replicate inherits that bias faithfully."
        },
        {
          w: "It works for any statistic.",
          r: "It fails for statistics that depend on **extreme order " +
            "statistics** — the maximum or minimum. The bootstrap maximum can " +
            "never exceed the sample maximum, so the distribution is truncated " +
            "and the interval is wrong. It also fails for parameters on the " +
            "boundary of the parameter space."
        },
        {
          w: "It requires no assumptions.",
          r: "It requires that observations are **independent and identically " +
            "distributed**. Time series, clustered data and spatial data all " +
            "violate this, and naive resampling destroys the dependence " +
            "structure. **Block bootstrap** exists precisely for time series."
        },
        {
          w: "More resamples give a more accurate answer.",
          r: "More resamples reduce **Monte Carlo error** — the noise from " +
            "resampling — and converge to the bootstrap's own answer. They do " +
            "not reduce the error from having a small or biased original " +
            "sample. Past ~10,000 you are refining a number whose accuracy is " +
            "set by n."
        }
      ],

      trade: {
        buys: [
          "Confidence intervals for statistics with no closed form.",
          "No distributional assumptions beyond i.i.d.",
          "Conceptually simple and easy to implement correctly.",
          "Underlies bagging, random forests and out-of-bag estimation."
        ],
        costs: [
          "Computationally expensive — thousands of recomputations.",
          "Inherits any bias in the original sample.",
          "Fails on extreme order statistics and dependent data.",
          "Unreliable for very small n, where there is little to resample."
        ],
        avoid: [
          "A well-founded closed-form interval exists — it is exact and free.",
          "The statistic depends on the sample maximum or minimum.",
          "Observations are dependent — use a **block bootstrap** or a model " +
            "of the dependence.",
          "The sample is tiny; resampling five points tells you very little."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "no-free-lunch-theorem",

      why: {
        before: "The search was for the best learning algorithm — the one that " +
          "would outperform the others across the board.",
        problem: "Wolpert and Macready proved that search cannot succeed. " +
          "**Averaged over all possible problems**, every algorithm has " +
          "identical expected performance — including random guessing. Any " +
          "algorithm that does better on one set of problems must do worse on " +
          "another by exactly the same amount.",
        shift: "The conclusion is not despair, it is redirection. Superiority " +
          "is always **relative to a distribution of problems**. The right " +
          "question stops being *what is the best model* and becomes *what " +
          "structure does my problem have, and which algorithm's assumptions " +
          "match it*."
      },

      num: {
        t: "What actually wins, by domain",
        h: ["Domain", "Usual winner", "The structure it exploits"],
        r: [
          ["Tabular", "gradient boosting", "axis-aligned splits, interactions"],
          ["Images", "CNN / ViT", "locality, translation invariance"],
          ["Text", "transformer", "long-range token dependence"],
          ["Small clean data", "linear / GAM", "simplicity, low variance"],
          ["Graphs", "GNN", "relational structure"]
        ],
        n: "Every row is an inductive bias that matches its domain. The theorem " +
          "is often quoted to shut down model comparison, which inverts its " +
          "meaning — **real-world problems are not uniformly distributed over " +
          "all possible problems**. They are overwhelmingly structured, smooth " +
          "and compressible, which is exactly why some algorithms reliably beat " +
          "others in practice. NFL says there is no universal winner; it does " +
          "not say there is no winner *here*."
      },

      miss: [
        {
          w: "No Free Lunch means all algorithms are equally good.",
          r: "Equally good **averaged over all conceivable problems**, " +
            "including the overwhelming majority that are pure noise and that " +
            "nobody will ever face. On the structured problems that actually " +
            "occur, algorithms differ enormously and consistently."
        },
        {
          w: "It means you must always try many models.",
          r: "It means your **assumptions** must match the problem. Domain " +
            "knowledge usually narrows the field to one or two candidates " +
            "immediately. Blindly trying fifty models is expensive and invites " +
            "overfitting the validation set."
        },
        {
          w: "It applies to deep learning, so scale cannot be a general " +
            "solution.",
          r: "Deep learning is not assumption-free — it assumes hierarchical, " +
            "compositional structure with smooth manifolds, which happens to " +
            "describe images, audio and language extremely well. It is a " +
            "*specific* bias that matches a *large class* of real problems, " +
            "which is entirely consistent with NFL."
        },
        {
          w: "It is a purely theoretical result with no practical bearing.",
          r: "It has a direct practical corollary: **an algorithm's " +
            "assumptions are its most important property**, and evaluating a " +
            "model means evaluating whether those assumptions hold for you. " +
            "That reframing is genuinely useful."
        }
      ],

      trade: {
        buys: [
          "Kills the search for a universal best algorithm.",
          "Reframes model selection around problem structure.",
          "Explains why domain knowledge remains valuable.",
          "Justifies benchmarking on *your* data rather than a leaderboard."
        ],
        costs: [
          "Frequently misquoted to justify not comparing models at all.",
          "The uniform-distribution assumption is unrealistic and often " +
            "unstated.",
          "Offers no guidance on which algorithm to pick.",
          "Can be used to excuse a poor choice."
        ],
        avoid: [
          "Someone is using it to argue that model choice does not matter — " +
            "on real data it matters enormously.",
          "You are working in a well-studied domain with a known best " +
            "approach.",
          "You have empirical evidence from your own data, which beats a " +
            "theorem about all possible data."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
