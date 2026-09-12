/* ==========================================================================
   Depth pass 63 — AI/ML core batch 1: paradigms & core primitives.
   Artificial Intelligence, Machine Learning, Supervised Learning,
   Unsupervised Learning, Semi-Supervised Learning, Self-Supervised Learning,
   Reinforcement Learning, and the Model artifact.

   AI shifted computation from deductive hand-coded logic to inductive
   statistical inference: parameterizing the world into learned weights.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "artificial-intelligence",

      why: {
        before: "Computation was purely deterministic: human software engineers " +
          "manually authored static rule trees, nested if-else logic, and expert " +
          "knowledge bases for every conceivable edge case.",
        problem: "Real-world perceptual and reasoning problems (computer vision, " +
          "natural language understanding, medical diagnosis, autonomous driving) " +
          "possess astronomical combinatorial complexity that cannot be hand-engineered.",
        shift: "**Autonomous perception, reasoning, and goal-directed action.** " +
          "Artificial Intelligence (AI) designs computational agents that perceive " +
          "their environment, learn representations from data, plan actions under " +
          "uncertainty, and solve problems without explicit hardcoded instructions."
      },

      num: {
        t: "Historical eras & dominant paradigms of Artificial Intelligence",
        h: ["Era / Paradigm", "Core Mechanism", "Primary Capability", "Failure Mode / Bottleneck"],
        r: [
          ["**Symbolic AI (GOFAI, 1950s–1980s)**", "**Formal logic, heuristic search (A*), production rules**", "**Theorem proving, chess, structured planning**", "**Combinatorial explosion; cannot handle noisy sensory data**"],
          ["**Expert Systems (1980s)**", "**Knowledge engineering: human rules codified in inference engines**", "**Domain diagnosis (MYCIN), configuration engines**", "**Brittleness; maintenance nightmare when rules conflict**"],
          ["**Statistical Machine Learning (1990s–2010s)**", "**Probabilistic models, SVMs, decision tree ensembles**", "**Spam detection, credit scoring, tabular prediction**", "**Feature engineering bottleneck; struggles with unstructured data**"],
          ["**Deep Learning (2012–2020)**", "**Deep hierarchical neural networks (CNNs, RNNs, Transformers)**", "**Computer vision, speech recognition, machine translation**", "**Massive labeled data hunger; black-box interpretability**"],
          ["**Foundation Models & GenAI (2020+)**", "**Massive self-supervised pretraining on multimodal internet data**", "**Zero-shot reasoning, code generation, autonomous agents**", "**Hallucination, alignment complexity, massive compute cost**"]
        ],
        n: "Artificial Intelligence as a formal scientific discipline was " +
          "founded at the historic 1956 Dartmouth Summer Research Project " +
          "by John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude " +
          "Shannon. Historically, AI has swung between two competing " +
          "philosophical paradigms: the **Symbolic (Rationalist) School**, " +
          "which argued that intelligence is the manipulation of explicit " +
          "symbols and formal logic, and the **Connectionist (Empiricist) " +
          "School**, which argued that intelligence emerges from statistical " +
          "learning across interconnected networks of simple mathematical neurons. " +
          "While symbolic AI dominated the 20th century, connectionism and " +
          "statistical machine learning triumphed in the 21st century due to " +
          "the convergence of three technological forces: **Rich Sutton's " +
          "'Bitter Lesson'** (computation and learning scale exponentially " +
          "better than human-engineered heuristics), the emergence of **GPU " +
          "accelerators**, and the availability of **internet-scale datasets**. " +
          "Modern AI systems operate on an **Agentic Loop**: an agent receives " +
          "high-dimensional sensory observations from an environment, encodes " +
          "them into dense vector representations, updates an internal **world " +
          "model**, evaluates candidate futures via search or probabilistic " +
          "inference, and executes actions to maximize an objective function."
      },

      miss: [
        {
          w: "Artificial Intelligence is identical to Machine Learning.",
          r: "Machine Learning is a specific subset of AI focused on learning from data. " +
            "AI also encompasses classical symbolic logic, heuristic search (A*), constraint " +
            "satisfaction, robotics kinematics, and automated theorem proving."
        },
        {
          w: "Modern AI systems possess human-like sentience and consciousness.",
          r: "Current AI models are sophisticated mathematical function approximators " +
            "operating via tensor transformations and probability distributions. They lack " +
            "subjective awareness, self-directed intent, or biological feelings."
        },
        {
          w: "Given enough compute, an AI model will never make mistakes.",
          r: "Statistical models operate probabilistically. Out-of-distribution inputs, " +
            "adversarial perturbations, and inherent statistical uncertainty make occasional " +
            "errors, hallucinations, and edge-case failures mathematically inevitable."
        },
        {
          w: "Symbolic rule-based AI is completely dead.",
          r: "Deterministic rule systems remain legally mandated and operationally vital " +
            "in avionics safety interlocks, tax engines, and financial compliance where " +
            "100% auditable, non-probabilistic execution is required."
        }
      ],

      trade: {
        buys: [
          "Solves previously intractable perceptual problems: vision, natural language, robotics.",
          "Discovers non-obvious patterns and correlations across petabytes of complex data.",
          "Automates high-order cognitive tasks (code generation, translation, document analysis).",
          "Adapts dynamically to changing real-world environments through retraining and learning."
        ],
        costs: [
          "Astronomical compute and electrical power requirements for model training and serving.",
          "Probabilistic outputs carry inherent risks of hallucinations and false confidence.",
          "Opacity and black-box nature makes debugging and formal legal auditing difficult.",
          "Vulnerability to adversarial manipulation, prompt injection, and data poisoning."
        ],
        avoid: [
          "Mission-critical safety systems requiring 100% deterministic mathematical verification without guardrails.",
          "Simple arithmetic or procedural calculations easily handled by standard deterministic algorithms.",
          "Environments where zero training data exists and errors incur irreversible legal or physical harm."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "machine-learning",

      why: {
        before: "Classical software engineering followed a rigid formula: " +
          "human programmers manually wrote both the **rules** and provided " +
          "the **data** to calculate **answers** (`Rules + Data -> Answers`).",
        problem: "For perceptual problems (e.g. recognizing whether an image contains " +
          "a tumor or a cat), human beings cannot articulate the millions of mathematical " +
          "pixel rules required, causing classical software programs to fail completely.",
        shift: "**Inductive learning from experience: `Data + Answers -> Rules`.** " +
          "Feed historical input data paired with observed outcomes into learning " +
          "algorithms, allowing the computer to automatically synthesize the underlying " +
          "predictive mathematical mapping function."
      },

      num: {
        t: "Classical programming vs Machine Learning paradigm comparison",
        h: ["Dimension", "Classical Programming", "Machine Learning"],
        r: [
          ["**Core Equation**", "`Rules + Data -> Answers`", "`Data + Answers -> Rules (Model)`"],
          ["**Knowledge Representation**", "**Hand-authored imperative code & conditional logic**", "**Trained numerical parameters (weights, thresholds, trees)**"],
          ["**Adaptation to Change**", "**Manual code modification, testing, and recompilation**", "**Automated retraining on new data distributions**"],
          ["**Primary Failure Mode**", "**Syntax errors, unhandled exceptions, logical bugs**", "**Overfitting, data leakage, distribution drift**"],
          ["**Optimization Criterion**", "**Functional correctness against unit test assertions**", "**Empirical Risk Minimization against objective loss function**"],
          ["**Execution Predictability**", "**100% deterministic (given identical inputs and state)**", "**Probabilistic (confidence distributions, soft predictions)**"]
        ],
        n: "Machine Learning is the engineering discipline of constructing " +
          "algorithms that improve their performance at a task through " +
          "experience. The foundational formal definition was articulated " +
          "by Tom Mitchell in 1997: *'A computer program is said to learn " +
          "from experience E with respect to some class of tasks T and " +
          "performance measure P, if its performance at tasks in T, as " +
          "measured by P, improves with experience E.'* In modern mathematical " +
          "terms, Machine Learning frames problem solving as **Empirical " +
          "Risk Minimization (ERM)**. Given a dataset $\\mathcal{D}$, the " +
          "learning algorithm searches a constrained **hypothesis space** " +
          "$\\mathcal{H}$ (e.g. all possible linear planes, all decision " +
          "trees of depth 6, or all neural network parameter configurations) " +
          "to find the specific parameter set $\\theta^*$ that minimizes " +
          "an **objective loss function** $\\mathcal{L}$. Crucially, the " +
          "ultimate goal of machine learning is **never training accuracy**; " +
          "it is **generalization**: the mathematical capacity of the " +
          "learned function to make accurate predictions on novel, unobserved " +
          "data drawn from the same underlying probability distribution."
      },

      miss: [
        {
          w: "Machine Learning is just a trendy name for basic linear regression.",
          r: "While linear regression is a foundational ML algorithm, modern machine learning " +
            "spans non-linear kernel methods, gradient boosted trees, probabilistic graphical " +
            "models, and deep transformer architectures with billions of parameters."
        },
        {
          w: "A machine learning model with 100% training accuracy is ideal.",
          r: "100% training accuracy almost always signifies severe overfitting: the model " +
            "has memorized the training noise and will fail catastrophically on new real-world data."
        },
        {
          w: "Feeding more data into an ML model always improves its accuracy.",
          r: "More data only helps if it is high-quality, diverse, and well-distributed. " +
            "Feeding massive volumes of noisy, biased, or unrepresentative data amplifies errors."
        },
        {
          w: "Machine learning models continuously learn and update in real time in production.",
          r: "Most production models are static artifacts trained offline in batches. " +
            "Real-time online learning is rare due to risks of catastrophic forgetting and feedback loops."
        }
      ],

      trade: {
        buys: [
          "Automates high-dimensional pattern recognition that humans cannot explicitly code.",
          "Adapts continuously to shifting real-world behavior through automated retraining pipelines.",
          "Replaces thousands of brittle, hardcoded heuristic business rules with unified mathematical models.",
          "Extracts predictive signal from vast, unexploited historical databases."
        ],
        costs: [
          "Demands continuous MLOps infrastructure: data pipelines, drift monitoring, retraining.",
          "Silent degradation: models do not crash with stack traces; they silently make worse predictions.",
          "Susceptibility to data leakage, class imbalance, and training-serving skew.",
          "Significant computational cost for feature engineering, training, and GPU inference."
        ],
        avoid: [
          "Problems with simple, completely known deterministic rules (tax calculation, payroll).",
          "Applications where training data is unavailable, corrupted, or statistically non-stationary.",
          "Scenarios where every decision requires a 100% legally auditable, deterministic audit trail."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "supervised-learning",

      why: {
        before: "Organizations had to manually program rule engines to categorize " +
          "records or estimate numbers, failing whenever input dimensions exceeded " +
          "human comprehension.",
        problem: "When an e-commerce platform needs to predict customer churn " +
          "across 150 behavioral metrics, writing manual threshold rules is " +
          "statistically impossible and constantly inaccurate.",
        shift: "**Learning from ground-truth labeled input-output pairs.** " +
          "Provide the algorithm with training pairs $(X, Y)$, where $X$ is the " +
          "feature vector and $Y$ is the verified ground-truth target label, optimizing " +
          "parameters to learn a predictive mapping function $f(X) \\approx Y$."
      },

      num: {
        t: "Supervised learning task taxonomy & algorithm pairings",
        h: ["Supervised Task", "Target Variable ($Y$) Type", "Loss Function", "Standard Algorithms"],
        r: [
          ["**Binary Classification**", "**Discrete boolean (`0` or `1`)**", "**Binary Cross-Entropy (Log Loss)**", "**Logistic Regression, XGBoost, LightGBM, SVM**"],
          ["**Multi-class Classification**", "**Single discrete label from $K$ classes**", "**Categorical Cross-Entropy**", "**Random Forest, CatBoost, Softmax Deep Neural Nets**"],
          ["**Multi-label Classification**", "**Multiple non-exclusive labels per item**", "**Binary Cross-Entropy per class**", "**One-Vs-Rest Classifiers, Neural Networks with Sigmoid**"],
          ["**Regression**", "**Continuous numerical value ($Y \\in \\mathbb{R}$)**", "**Mean Squared Error (MSE) / MAE**", "**Linear Regression, Ridge/Lasso, Gradient Boosted Trees**"],
          ["**Sequence Prediction**", "**Ordered sequence of tokens / labels**", "**CTC Loss, Sequence Cross-Entropy**", "**Transformers, Bi-LSTM, Hidden Markov Models**"]
        ],
        n: "Supervised learning is the commercial workhorse of applied AI, " +
          "accounting for the vast majority of enterprise machine learning value. " +
          "Mathematically, the algorithm is supplied with a training set of " +
          "$N$ labeled observations: $\\mathcal{D} = \\{(x_1, y_1), (x_2, y_2), " +
          "\\dots, (x_N, y_N)\\}$, where each $x_i \\in \\mathbb{R}^d$ is a " +
          "$d$-dimensional feature vector and $y_i$ is the ground-truth " +
          "target. The learning engine minimizes empirical risk: " +
          "$$\\min_\\theta \\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}(f_\\theta(x_i), y_i) + \\lambda \\Omega(\\theta)$$ " +
          "where $\\mathcal{L}$ measures prediction error, $\\Omega$ is a " +
          "regularization penalty constraining model complexity, and $\\lambda$ " +
          "balances fit versus simplicity. The fundamental prerequisite of " +
          "supervised learning is the **Identically and Independently Distributed " +
          "(I.I.D.) assumption**: training and test data must be drawn from " +
          "the same joint probability distribution $P(X, Y)$. When real-world " +
          "conditions violate this assumption—via **Covariate Shift** (the " +
          "distribution of $X$ shifts) or **Concept Drift** (the relationship " +
          "between $X$ and $Y$ changes)—supervised models degrade rapidly, " +
          "requiring continuous retraining."
      },

      miss: [
        {
          w: "Supervised learning is only useful for simple tabular business metrics.",
          r: "Supervised learning powers the most advanced AI on earth, including autonomous " +
            "vehicle perception (bounding box regression) and LLM Supervised Fine-Tuning (SFT)."
        },
        {
          w: "Human ground-truth training labels are always 100% accurate.",
          r: "Human annotation is noisy: inter-annotator disagreement in medical imaging " +
            "and content moderation frequently exceeds 15%–20%. Models learn human errors."
        },
        {
          w: "A supervised classification model can detect classes it was never trained on.",
          r: "Standard closed-world classifiers can only assign probabilities to known " +
            "training categories. Detecting novel classes requires open-set or zero-shot architectures."
        },
        {
          w: "Minimizing training loss guarantees high test performance.",
          r: "Training loss measures memorization. A model can achieve near-zero training " +
            "loss while overfitting completely, failing on held-out validation datasets."
        }
      ],

      trade: {
        buys: [
          "Directly solves defined, high-value business predictions (fraud, churn, pricing).",
          "Clear, objective performance evaluation against held-out ground truth (AUC, F1, RMSE).",
          "Extremely mature ecosystem of optimized tabular libraries (XGBoost, LightGBM, scikit-learn).",
          "Well-understood optimization dynamics and reliable convergence guarantees."
        ],
        costs: [
          "The Human Annotation Bottleneck: labeling millions of training records is extraordinarily expensive.",
          "Fragile under concept drift and distribution shift when real-world conditions change.",
          "Susceptible to learning and amplifying historical human prejudices baked into labels.",
          "Completely blind to patterns or categories absent from the labeled training corpus."
        ],
        avoid: [
          "Problems where ground-truth labels do not exist and cannot be feasibly collected.",
          "Exploratory discovery where the categories or goals are unknown upfront.",
          "Environments where the relationship between features and targets mutates daily."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "unsupervised-learning",

      why: {
        before: "Machine learning was restricted to the tiny sliver of data (<5%) " +
          "that human beings had expensively cleaned, structured, and labeled.",
        problem: "Over 95% of real-world data (terabytes of raw web text, network " +
          "packet logs, audio recordings, customer clickstreams) arrives completely " +
          "unlabeled, leaving immense information potential locked away.",
        shift: "**Discovering intrinsic geometric and statistical structure without labels.** " +
          "Unsupervised algorithms analyze raw feature vectors $X$ without target answers $Y$, " +
          "identifying natural clusters, low-dimensional manifolds, probability densities, and anomalies."
      },

      num: {
        t: "Unsupervised learning paradigms & primary algorithms",
        h: ["Unsupervised Domain", "Mathematical Goal", "Prominent Algorithms", "Enterprise Use Case"],
        r: [
          ["**Clustering**", "**Partition data into cohesive, distinct groups**", "**K-Means, DBSCAN, Hierarchical Clustering**", "**Customer market segmentation, document topic grouping**"],
          ["**Dimensionality Reduction**", "**Project data to lower-dimensional manifold**", "**PCA, t-SNE, UMAP, Autoencoders**", "**Feature compression, data visualization, noise reduction**"],
          ["**Anomaly Detection**", "**Identify low-probability distribution outliers**", "**Isolation Forest, One-Class SVM, Local Outlier Factor**", "**Cybersecurity intrusion detection, industrial equipment failure**"],
          ["**Density Estimation**", "**Model underlying probability density function $P(X)$**", "**Gaussian Mixture Models (GMM), Kernel Density (KDE)**", "**Synthetic data generation, risk probability modeling**"],
          ["**Association Rule Mining**", "**Discover frequent co-occurrence patterns**", "**Apriori Algorithm, FP-Growth**", "**Market basket analysis ('customers who bought X also bought Y')**"]
        ],
        n: "Unsupervised learning operates without external feedback or ground-truth " +
          "supervision. Instead of estimating the conditional distribution " +
          "$P(Y|X)$ as in supervised learning, unsupervised learning models " +
          "the **joint distribution $P(X)$** or the **intrinsic geometry** " +
          "of the input space. In **clustering**, the algorithm groups points " +
          "such that intra-cluster distance is minimized while inter-cluster " +
          "distance is maximized. In **dimensionality reduction**, techniques " +
          "like **Principal Component Analysis (PCA)** compute the eigenvectors " +
          "of the feature covariance matrix, projecting high-dimensional data " +
          "along orthogonal axes of maximal variance, while non-linear manifold " +
          "learners like **UMAP** preserve local topological neighborhoods. " +
          "In **anomaly detection**, algorithms like **Isolation Forests** " +
          "exploit the mathematical reality that anomalous points are few " +
          "and structurally isolated, requiring fewer random recursive splits " +
          "to isolate in a tree than normal points. The fundamental challenge " +
          "of unsupervised learning is the **lack of an objective ground truth**: " +
          "there is no mathematically 'correct' number of customer segments " +
          "or topic clusters; evaluation depends heavily on human domain interpretation " +
          "and heuristic metrics like the **Silhouette Coefficient**."
      },

      miss: [
        {
          w: "Unsupervised learning produces objectively 'correct' classifications.",
          r: "Clustering is exploratory. Different distance metrics (Euclidean, Cosine, " +
            "Manhattan) and algorithms produce radically different cluster boundaries on identical data."
        },
        {
          w: "Unsupervised clustering algorithms automatically choose the number of clusters.",
          r: "Classic algorithms like K-Means require the engineer to pre-specify $k$. " +
            "Techniques like the Elbow Method or Silhouette analysis provide heuristics, not definitive answers."
        },
        {
          w: "Dimensionality reduction is only useful for plotting 2D scatter charts.",
          r: "Dimensionality reduction eliminates multicollinearity, reduces storage and compute " +
            "costs, combats the curse of dimensionality, and accelerates downstream supervised models."
        },
        {
          w: "Unsupervised learning eliminates the need for human domain expertise.",
          r: "Interpreting clusters, naming latent dimensions, and evaluating anomaly " +
            "thresholds requires deep human domain expertise."
        }
      ],

      trade: {
        buys: [
          "Unlocks immediate business value from massive, cheap, unannotated data repositories.",
          "Discovers unexpected hidden behavioral patterns and customer cohorts without human bias.",
          "Identifies zero-day cybersecurity intrusions and hardware anomalies without prior signatures.",
          "Compresses massive high-dimensional datasets while retaining critical variance."
        ],
        costs: [
          "No objective ground-truth metric: evaluation is subjective and exploratory.",
          "Extremely sensitive to feature scaling, outliers, and distance metric choices.",
          "High risk of finding spurious, mathematically real but commercially useless correlations.",
          "Computationally expensive on massive datasets ($O(N^2)$ distance matrices in naive algorithms)."
        ],
        avoid: [
          "Problems requiring specific, verifiable predictive targets (credit underwriting, medical diagnosis).",
          "Datasets where feature dimensions have completely unnormalized, arbitrary physical scales.",
          "High-stakes automated decision-making requiring strict legal justification."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "semi-supervised-learning",

      why: {
        before: "Organizations had millions of raw, unlabeled data records, but " +
          "could only afford human expert annotation for a few thousand examples.",
        problem: "Supervised models trained on just the small labeled subset overfitted " +
          "severely, while unsupervised algorithms on the unlabeled data could not " +
          "predict the required business target categories.",
        shift: "**Semi-Supervised Learning (SSL): bridge the labeled-unlabeled divide.** " +
          "Leverage the geometric cluster structure and data manifold of massive unlabeled " +
          "data to regularize and guide the decision boundaries of supervised models."
      },

      num: {
        t: "Semi-supervised learning paradigms & core mechanisms",
        h: ["SSL Paradigm", "Operational Mechanism", "Prominent Algorithms / Methods", "Core Benefit"],
        r: [
          ["**Self-Training / Pseudo-Labeling**", "**Model predicts unlabeled data; confident predictions added to training set**", "**Standard Pseudo-Labeling, Noisy Student**", "**Simple to implement; iteratively expands labeled dataset**"],
          ["**Consistency Regularization**", "**Forces model to output identical predictions on perturbed views of unlabeled data**", "**FixMatch, MixMatch, Temporal Ensembling**", "**State-of-the-art accuracy in low-label image classification**"],
          ["**Graph-Based SSL**", "**Propagates labels across a nearest-neighbor graph of all data points**", "**Label Propagation, Label Spreading**", "**Leverages manifold geometry; non-parametric**"],
          ["**Generative SSL**", "**Models joint distribution $P(X, Y)$ using latent variables**", "**Variational Autoencoders (M2 model), Semi-supervised GANs**", "**Disentangles latent representation from label distribution**"],
          ["**Co-Training**", "**Two models trained on separate feature views teach each other**", "**Blum & Mitchell Co-Training**", "**Effective when features split naturally (e.g. text vs metadata)**"]
        ],
        n: "Semi-Supervised Learning operates on the boundary where labeled " +
          "data is scarce but unlabeled data is abundant. It relies on three " +
          "foundational mathematical assumptions: (1) **The Smoothness " +
          "Assumption**: if two points $x_1, x_2$ reside in a high-density " +
          "neighborhood, their output labels $y_1, y_2$ should be identical; " +
          "(2) **The Cluster Assumption**: the decision boundary between " +
          "classes should pass through **low-density regions** rather than " +
          "slicing through high-density clusters; and (3) **The Manifold " +
          "Assumption**: high-dimensional data points lie approximately on " +
          "a lower-dimensional manifold. Modern semi-supervised learning " +
          "reached its zenith with **FixMatch**: a model receives a weakly " +
          "augmented unlabeled image (horizontal flip); if the model's " +
          "predicted probability exceeds a strict confidence threshold " +
          "(e.g. $\\tau = 0.95$), the prediction becomes a **pseudo-label**. " +
          "The model is then fed a strongly augmented version of the same " +
          "image (Cutout, RandAugment) and trained to predict that pseudo-label " +
          "via cross-entropy. By pairing consistency regularization with " +
          "pseudo-labeling, FixMatch can match fully supervised performance " +
          "on image benchmarks using **less than 1% of the original labels**."
      },

      miss: [
        {
          w: "Adding unlabeled data to a training set is guaranteed to improve model accuracy.",
          r: "If the semi-supervised assumptions (cluster/smoothness) do not hold, or if " +
            "pseudo-labeling introduces confirmation bias, unlabeled data degrades model accuracy."
        },
        {
          w: "Pseudo-labeling is identical to standard supervised training.",
          r: "Pseudo-labeling introduces **confirmation bias**: false predictions made with " +
            "high confidence poison subsequent training epochs, compounding errors."
        },
        {
          w: "Semi-supervised learning has been completely replaced by Foundation Models.",
          r: "In proprietary tabular enterprise data, specialized medical scans, and niche " +
            "industrial domains where foundation models do not exist, SSL remains vital."
        },
        {
          w: "Any off-the-shelf classifier automatically supports semi-supervised learning.",
          r: "SSL requires custom training loops that balance supervised loss on labeled " +
            "data with consistency regularization loss on unlabeled batches."
        }
      ],

      trade: {
        buys: [
          "Slashes human annotation costs by 80%–95% while approaching fully supervised accuracy.",
          "Regularizes model decision boundaries, preventing severe overfitting on tiny label sets.",
          "Extracts business value from massive dark data repositories that cannot be manually labeled.",
          "Improves out-of-distribution robustness through consistency regularization."
        ],
        costs: [
          "Vulnerable to confirmation bias where early model errors permanently corrupt training.",
          "Complex training pipelines requiring simultaneous scheduling of labeled and unlabeled batches.",
          "Highly sensitive to confidence thresholds and data augmentation hyperparameters.",
          "Increased training time compared to standard supervised training."
        ],
        avoid: [
          "Workloads where labeled data is already cheap, fast, and plentiful.",
          "Scenarios where unlabeled data comes from a completely different distribution (covariate shift).",
          "Teams without deep MLOps maturity to monitor pseudo-label quality."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "self-supervised-learning",

      why: {
        before: "Deep learning models hit an insurmountable bottleneck: scaling " +
          "neural networks to hundreds of millions of parameters required millions " +
          "of human-labeled examples, exhausting annotation budgets worldwide.",
        problem: "Human supervision does not scale to the entire internet, and models " +
          "trained on narrow supervised classification tasks learned brittle, narrow " +
          "representations that could not transfer to other domains.",
        shift: "**Self-Supervised Learning (SSL): turn the raw data into its own supervisor.** " +
          "Autonomously generate supervisory training signals from the unannotated data " +
          "itself by masking, corrupting, or shifting parts of the input and training the " +
          "network to reconstruct or predict the missing information."
      },

      num: {
        t: "Self-supervised learning pretraining objectives across modalities",
        h: ["Modality", "Pretext Objective", "Mechanism", "Pioneering Foundation Models"],
        r: [
          ["**Text (Autoregressive)**", "**Causal Next-Token Prediction**", "**Predict token $t$ given preceding context $t_{<t}$**", "**GPT-3, GPT-4, LLaMA, Mistral**"],
          ["**Text (Bidirectional)**", "**Masked Language Modeling (MLM)**", "**Mask 15% of tokens; predict masked words from bidirectional context**", "**BERT, RoBERTa**"],
          ["**Vision (Masked)**", "**Masked Autoencoding (MAE)**", "**Mask 75% of image patches; reconstruct raw pixel values**", "**ViT-MAE, SimMIM**"],
          ["**Vision (Contrastive)**", "**Instance Discrimination / Contrastive**", "**Pull augmented views together; push different images apart**", "**SimCLR, MoCo, CLIP (Text-Image)**"],
          ["**Audio / Speech**", "**Masked Quantized Audio Prediction**", "**Mask continuous audio frames; predict latent codebook IDs**", "**Wav2Vec 2.0, Whisper**"],
          ["**Multimodal**", "**Cross-Modal Contrastive & Generative**", "**Align text and image embeddings in shared vector space**", "**CLIP, Gemini, Flamingo**"]
        ],
        n: "Self-Supervised Learning is the foundational engine that unleashed " +
          "the modern Generative AI and Foundation Model revolution. AI luminary " +
          "Yann LeCun famously introduced the **'Cake Analogy'**: *'If intelligence " +
          "is a cake, self-supervised learning is the cake, supervised learning " +
          "is the icing on the cake, and reinforcement learning is the cherry " +
          "on the cake.'* Supervised learning provides only a few bits of " +
          "supervisory signal per sample (e.g. a single label integer); " +
          "self-supervised learning extracts **millions of bits of feedback " +
          "per sample** by predicting the underlying structure of the data itself. " +
          "The core mechanism is the **Pretext Task**. In **Next-Token Prediction** " +
          "(the engine of Large Language Models), every single word in a 10-trillion " +
          "token corpus serves as both the target label for the preceding words " +
          "and the context for subsequent words. In **Contrastive Learning (InfoNCE)**, " +
          "the model projects data into an embedding space where positive pairs " +
          "(two crops of the same dog) are pulled together while negative pairs " +
          "(a cat and a car) are pushed apart. Through self-supervised pretraining, " +
          "models learn profound **world models**—synthesizing grammar, common-sense " +
          "physics, code logic, and spatial relationships—which can then be " +
          "adapted to downstream tasks with zero or minimal fine-tuning."
      },

      miss: [
        {
          w: "Self-supervised learning is just unsupervised learning with a new buzzword.",
          r: "Unsupervised learning discovers intrinsic clusters without supervision. " +
            "Self-supervised learning uses standard supervised gradient descent against " +
            "targets automatically generated from the data itself."
        },
        {
          w: "A self-supervised foundation model is ready for user-facing chat out of the box.",
          r: "Base pretrained models are raw autocomplete predictors. They require " +
            "Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF) " +
            "to follow instructions and act safely."
        },
        {
          w: "Self-supervised learning is only applicable to natural language processing.",
          r: "Self-supervised learning revolutionized computer vision (CLIP, DINOv2), " +
            "speech recognition (Wav2Vec), computational biology (AlphaFold), and robotics."
        },
        {
          w: "Contrastive vision models require massive negative sample memory banks.",
          r: "Modern architectures like BYOL and SimSiam achieved state-of-the-art self-supervised " +
            "representations using asymmetrical target networks without negative sample pairs."
        }
      ],

      trade: {
        buys: [
          "Scales learning across the entire unannotated internet (trillions of tokens and images).",
          "Learns deep, generalizable foundational representations transferable to hundreds of tasks.",
          "Powers emergent capabilities: zero-shot classification, in-context few-shot prompting.",
          "Eliminates the human annotation bottleneck for foundational pretraining."
        ],
        costs: [
          "Staggering compute, memory, and energy requirements (millions of GPU hours to pre-train).",
          "Ingests societal biases, hallucinations, and toxicity present in raw internet corpora.",
          "Downstream safety alignment and instruction tuning are mandatory before deployment.",
          "Evaluating base pretrained representations requires complex probing and benchmark suites."
        ],
        avoid: [
          "Pretraining massive foundation models from scratch for standard corporate business problems.",
          "Tabular business databases with small record counts (gradient boosted trees perform better).",
          "Low-compute edge environments without access to cloud pretraining clusters."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reinforcement-learning",

      why: {
        before: "Algorithms could only learn if an explicit supervisor showed them " +
          "the exact correct answer for every input (supervised learning) or left them " +
          "to explore static data (unsupervised learning).",
        problem: "In sequential decision problems (playing chess or Go, robotics " +
          "manipulation, cooling a datacenter, autonomous driving), no supervisor can " +
          "prescribe the exact optimal micro-action at second 4; the only signal is an " +
          "eventual win/loss outcome or score minutes later.",
        shift: "**Reinforcement Learning (RL): learn optimal policies through trial and error.** " +
          "An agent interacts with a dynamic environment: observing states, taking actions, " +
          "and updating its behavioral policy to maximize long-term cumulative discounted reward."
      },

      num: {
        t: "Reinforcement learning core components & algorithmic families",
        h: ["Component / Family", "Mathematical Definition / Role", "Key Mechanism", "Prominent Algorithms"],
        r: [
          ["**Markov Decision Process (MDP)**", "$\\langle S, A, P, R, \\gamma \\rangle$", "**Formal mathematical framework for sequential decisions**", "**Foundational framework for all RL**"],
          ["**Value-Based RL**", "**Estimates expected cumulative return $Q(s, a)$**", "**Bellman Optimality Equation, temporal difference**", "**Q-Learning, Deep Q-Networks (DQN)**"],
          ["**Policy-Based RL**", "**Directly parameterizes and optimizes policy $\\pi_\\theta(a|s)$**", "**Policy Gradient Theorem, likelihood ratio trick**", "**REINFORCE**"],
          ["**Actor-Critic Methods**", "**Actor updates policy; Critic evaluates state value $V(s)$**", "**Reduces variance using advantage estimates**", "**PPO (Proximal Policy Opt), SAC, A3C**"],
          ["**Model-Based RL**", "**Learns transition model $P(s'|s, a)$ to plan ahead**", "**Monte Carlo Tree Search (MCTS) + dynamic programming**", "**MuZero, DreamerV3, AlphaGo**"],
          ["**RL from Human Feedback (RLHF)**", "**Aligns LLMs with human preferences via reward models**", "**PPO / DPO against learned human preference reward**", "**ChatGPT, Claude, LLaMA-Instruct**"]
        ],
        n: "Reinforcement Learning formalizes goal-directed learning and " +
          "decision making. The mathematical foundation is the **Markov Decision " +
          "Process (MDP)**: at time step $t$, the agent observes an environment " +
          "state $s_t \\in \\mathcal{S}$, selects an action $a_t \\in \\mathcal{A}$ " +
          "according to its policy $\\pi(a_t|s_t)$, receives a scalar reward " +
          "$r_{t+1} \\in \\mathbb{R}$, and transitions to a new state $s_{t+1}$ " +
          "governed by environment dynamics $P(s_{t+1}|s_t, a_t)$. The objective " +
          "is to maximize the **expected discounted return**: " +
          "$$J(\\pi) = \\mathbb{E}_\\pi \\left[ \\sum_{k=0}^\\infty \\gamma^k r_{t+k+1} \\right]$$ " +
          "where $\\gamma \\in [0, 1)$ is the **discount factor**, prioritizing " +
          "immediate rewards over distant futures. RL confronts two fundamental " +
          "challenges: (1) **The Credit Assignment Problem**: determining " +
          "which specific action taken 50 steps ago caused the eventual victory " +
          "or defeat; and (2) **The Exploration vs. Exploitation Dilemma**: " +
          "deciding whether to exploit known high-reward actions or explore " +
          "uncertain actions that might yield higher long-term payoffs. In " +
          "the GenAI revolution, **PPO (Proximal Policy Optimization)** and " +
          "**DPO (Direct Preference Optimization)** serve as the critical " +
          "alignment mechanism: treating an LLM as an RL policy agent whose " +
          "token outputs are scored by a reward model trained on human preference pairs."
      },

      miss: [
        {
          w: "Reinforcement Learning is just supervised learning with numerical rewards.",
          r: "In supervised learning, targets are independent of model predictions. In RL, " +
            "an agent's actions directly alter future environment states, observations, and rewards."
        },
        {
          w: "RL agents can be trained directly in live physical production environments.",
          r: "Early RL exploration requires thousands of erratic, random trial-and-error actions " +
            "that would destroy physical robots or crash live trading systems. Training mandates simulation."
        },
        {
          w: "Maximizing the reward function always achieves the developer's true intent.",
          r: "**Reward Hacking (Goodhart's Law)**: agents exploit subtle loopholes in reward formulas " +
            "(e.g. an autonomous racing car driving in circles to collect milestone rewards without finishing the race)."
        },
        {
          w: "RLHF is only used to censor offensive content in language models.",
          r: "RLHF fundamentally improves instruction-following adherence, complex reasoning, " +
            "code generation accuracy, and formatting compliance."
        }
      ],

      trade: {
        buys: [
          "Discovers superhuman strategies beyond human knowledge (AlphaGo, AlphaZero).",
          "Solves continuous sequential control in robotics, drone flight, and industrial HVAC.",
          "Enables dynamic game-theoretic optimization against competing agents.",
          "Core alignment technology (RLHF) transforming raw LLMs into helpful, steerable assistants."
        ],
        costs: [
          "Extreme sample inefficiency: requires millions to billions of interaction steps.",
          "High training instability and hyperparameter sensitivity (policy collapses).",
          "Risk of reward hacking and dangerous unintended agent behaviors.",
          "Requires building high-fidelity physics simulators or robust offline RL datasets."
        ],
        avoid: [
          "Standard static classification or regression problems where supervised learning works.",
          "Environments where physical failure is dangerous and simulation is impossible.",
          "Applications where low latency, deterministic algorithmic control is required."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model",

      why: {
        before: "Software logic was authored entirely by human software engineers " +
          "as procedural source code files compiled into static binaries.",
        problem: "Human-authored source code cannot encapsulate the statistical " +
          "nuances of high-dimensional perception (voice, vision, natural language), " +
          "requiring billions of hand-written rules that cannot be maintained.",
        shift: "**The Machine Learning Model: a compiled artifact of learned parameters.** " +
          "Decouple the training algorithm (code that learns) from the resulting " +
          "computational artifact (the trained model weights), representing knowledge " +
          "as a parameterized mathematical function optimized for inference."
      },

      num: {
        t: "Machine Learning model representations & deployment artifacts",
        h: ["Model Family", "Internal Parameter Representation", "Standard File Formats", "Inference Runtime"],
        r: [
          ["**Linear / Logistic**", "**Weight vector $\\mathbf{w} \\in \\mathbb{R}^d$ + bias scalar $b$**", "**Joblib, Pickle, PMML**", "**scikit-learn, ONNX Runtime**"],
          ["**Decision Tree Ensembles**", "**Arrays of node split features, thresholds, leaf values**", "**JSON, Treelite, ONNX**", "**XGBoost, LightGBM, ForestInference**"],
          ["**Deep Neural Networks**", "**Multi-dimensional weight tensors (FP32/FP16/BF16/INT8)**", "**SafeTensors, PyTorch (`.pt`), ONNX**", "**TensorRT, vLLM, ONNX Runtime, TFLite**"],
          ["**Quantized Edge Models**", "**INT4 / INT8 quantized weights + scale factors**", "**GGUF, AWQ, GPTQ, EXL2**", "**llama.cpp, Ollama, CoreML, ExecuTorch**"],
          ["**Computation Graph**", "**Directed Acyclic Graph (DAG) of mathematical operators**", "**ONNX, TorchScript**", "**OpenVINO, DirectML, WebGPU**"]
        ],
        n: "In modern computing, an AI/ML Model is a distinct **software " +
          "artifact** that represents a parameterized mathematical function " +
          "$f_\\theta(x) = \\hat{y}$. The architecture defines the computational " +
          "graph (e.g. a 70-billion-parameter Transformer consisting of self-attention " +
          "heads, MLP blocks, and layer norms), while the **weights $\\theta$** " +
          "represent the specific numerical values learned through optimization. " +
          "Historically, models were serialized using Python's native `pickle` " +
          "module; however, because `pickle` can execute arbitrary system " +
          "code during deserialization, the industry has universally shifted " +
          "to **SafeTensors**: a secure, zero-copy, memory-mapped format " +
          "developed by Hugging Face that cannot execute code. For edge and " +
          "consumer inference, models are compiled into **GGUF** (used by " +
          "llama.cpp) or **ONNX (Open Neural Network Exchange)**. A critical " +
          "lifecycle reality of ML models is that they are subject to **Model " +
          "Drift (Concept Drift and Covariate Shift)**: unlike traditional code " +
          "that runs identically forever, an ML model's accuracy degrades " +
          "over time as real-world distributions evolve away from its training " +
          "distribution, necessitating continuous MLOps monitoring and retraining."
      },

      miss: [
        {
          w: "A machine learning model is the same thing as the training algorithm.",
          r: "The algorithm is the learning process (e.g. Gradient Descent, AdamW). " +
            "The model is the resulting artifact containing learned parameters $\\theta$."
        },
        {
          w: "Loading model checkpoint files (`.pkl`, `.pt`) from the internet is completely safe.",
          r: "Python `pickle` files can execute arbitrary malicious code upon loading. " +
            "Modern production pipelines mandate secure formats like `safetensors`."
        },
        {
          w: "A trained model file contains a literal database copy of its training data.",
          r: "A model stores abstract numerical weights and statistical parameters, " +
            "not raw database records (though LLMs can memorize verbatim text strings)."
        },
        {
          w: "Once trained and deployed, an ML model requires zero maintenance.",
          r: "Models suffer from model decay and concept drift as real-world conditions shift, " +
            "requiring ongoing performance tracking, data monitoring, and scheduled retraining."
        }
      ],

      trade: {
        buys: [
          "Encapsulates complex empirical knowledge into a deployable mathematical artifact.",
          "Decouples expensive offline training compute from lightweight real-time inference.",
          "Can be quantized (INT8/INT4) to execute on consumer smartphones and edge devices.",
          "Universal portability across platforms via standardized formats (ONNX, SafeTensors, GGUF)."
        ],
        costs: [
          "Black-box opacity: modifying a single behavior requires fine-tuning or retraining.",
          "Model decay requires ongoing MLOps infrastructure for drift detection and retraining.",
          "Large storage and memory footprint (ranging from megabytes to hundreds of gigabytes).",
          "Vulnerability to adversarial weight extraction, model inversion, and jailbreaking."
        ],
        avoid: [
          "Deploying unversioned model files without an artifact registry (MLflow, Hugging Face).",
          "Using Python `pickle` for model serialization in production or multi-tenant systems.",
          "Leaving models in production without automated data drift and performance monitoring."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
