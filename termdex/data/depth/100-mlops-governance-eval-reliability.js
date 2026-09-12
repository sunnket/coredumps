/* ==========================================================================
   Depth pass 100 — MLOps batch 3: Interoperability, Governance & Safety.
   ONNX, Model Card, Responsible AI, Bias,
   Human-in-the-Loop, Ground Truth, Model Rollback.

   Open computational graph intermediates bridge heterogeneous training backends to C++ runtimes;
   standardized algorithmic disclosures document operational failure boundaries and ethical baselines.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "onnx",

      why: {
        before: "Deploying a model trained in PyTorch or TensorFlow to production required packaging the entire massive training framework (including CUDA autograd engines and Python dependencies) into the serving container, resulting in 5GB+ Docker images and slow inference.",
        problem: "Edge devices, mobile phones, and embedded microcontrollers cannot run full Python frameworks; compiling models for diverse target hardware (Intel CPUs, ARM mobile chips, Apple Silicon, NVIDIA GPUs) required rewriting inference graphs for each chip.",
        shift: "**ONNX (Open Neural Network Exchange): An open-source, framework-agnostic format for representing machine learning models as standardized computational graphs.** Created by Microsoft and Meta in 2017, paired with ONNX Runtime to provide high-performance, cross-platform hardware acceleration."
      },

      num: {
        t: "ONNX Runtime Execution Providers & Hardware Acceleration Backends",
        h: ["Execution Provider (EP)", "Target Hardware Architecture", "Underlying Acceleration Library", "Typical Speedup vs PyTorch CPU", "Primary Deployment Domain"],
        r: [
          ["Default CPU (MLAS)", "x86_64 / ARM64 CPUs", "Hand-optimized assembly / AVX-512 / NEON", "$2\\times$ to $4\\times$", "Lightweight microservices, local edge servers"],
          ["OpenVINO EP", "Intel Core / Xeon CPUs & iGPUs", "Intel Deep Learning Boost (VNNI / AMX)", "$3\\times$ to $6\\times$", "Enterprise Intel enterprise servers, industrial PCs"],
          ["CUDA / TensorRT EP", "NVIDIA GPUs (Tensor Cores)", "NVIDIA TensorRT kernel fusion + FP16/INT8", "$4\\times$ to $10\\times$", "High-throughput cloud inference clusters (Triton)"],
          ["CoreML EP", "Apple Silicon (M-series / A-series)", "Apple Neural Engine (ANE)", "Native Apple silicon speed", "iOS / macOS client-side edge applications"],
          ["DirectML EP", "Windows DirectX 12 GPUs (AMD/Intel/NVIDIA)", "DirectX 12 Compute Shaders", "Hardware-accelerated Windows", "Windows consumer applications, gaming AI"]
        ],
        n: "ONNX formalizes machine learning models as an extensible, directed computation graph serialized using Google Protocol Buffers (`.onnx`). The graph consists of nodes representing standardized **Operators** (from the formal ONNX Operator Set, or **Opset**) operating on input and output tensors. **ONNX Runtime (ORT)** optimizes this computational graph through multi-stage graph transformations: (1) **Constant Folding**: Pre-computing static subexpressions at compile time. (2) **Node Fusion**: Merging sequential operators (e.g., fusing `Conv + BatchNorm + ReLU` into a single fused GPU kernel) to eliminate expensive memory roundtrips. (3) **Execution Providers (EPs)**: ORT acts as a hardware abstraction layer, delegating subgraphs to specialized hardware accelerators (TensorRT on NVIDIA, OpenVINO on Intel, CoreML on Apple) without requiring code modifications."
      },

      miss: [
        {
          w: "Exporting any arbitrary Python function to ONNX is guaranteed to work seamlessly.",
          r: "Python is a dynamic programming language, whereas ONNX represents static computational graphs. Python control flow (`if/else` based on runtime tensor values, dynamic loops, or unsupported custom C++ extensions) fails to trace into ONNX unless rewritten using scripted symbolic control flow."
        },
        {
          w: "ONNX is only for deep neural networks and cannot represent classical ML models.",
          r: "**ONNX-ML** extends the core operator specification to support classical machine learning: decision trees, Random Forests, Support Vector Machines, and Scikit-Learn transformers, executing tabular inference up to $10\\times$ faster than native Scikit-Learn."
        },
        {
          w: "ONNX Runtime is written in Python and suffers from Python's Global Interpreter Lock (GIL).",
          r: "ONNX Runtime is engineered in high-performance **C++**. While Python bindings exist for convenience, the underlying engine executes entirely in C++ or native hardware assembly, completely bypassing the Python GIL."
        },
        {
          w: "Once exported to ONNX, a model can never be modified.",
          r: "The ONNX Python API allows programmatic graph surgery: inserting custom quantization nodes, modifying input dimensions to dynamic axes (`dynamic_axes={'input': {0: 'batch_size'}}`), pruning dead layers, or appending pre-processing filters."
        }
      ],

      trade: {
        buys: [
          "Framework interoperability: train in PyTorch or TensorFlow; deploy to a unified, lightweight C++ runtime.",
          "Significant inference speedups: kernel fusion and constant folding yield $2\\times$ to $8\\times$ lower latency.",
          "Dramatically reduced container image sizes: eliminates massive 5GB PyTorch/CUDA installs in favor of a 100MB runtime.",
          "Universal hardware acceleration: write once, deploy across NVIDIA GPUs, Intel CPUs, Apple Silicon, and mobile ARM."
        ],
        costs: [
          "Export friction: tracing dynamic Python control flow, recurrent loops, or bleeding-edge transformer attention requires troubleshooting.",
          "Opset version fragmentation: mismatch between the export Opset and target runtime version can cause unsupported operator errors.",
          "Debugging complexity: diagnosing numerical precision divergence between native PyTorch and compiled ONNX runtimes is challenging.",
          "Limited training support: ONNX is primarily an inference runtime (though ORT-Training exists, it is less common)."
        ],
        avoid: [
          "Never export models without configuring `dynamic_axes` if production requests require variable batch sizes or sequence lengths.",
          "Do not deploy ONNX models to production without verifying numerical parity (allclose checks) against the native PyTorch model.",
          "Avoid using outdated Opset versions that lack optimizations for modern transformer architectures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-card",

      why: {
        before: "Machine learning models were released into production or open-source ecosystems with zero standardized documentation, leaving developers and auditors with no information about how the model was trained, its intended use cases, or its known failure boundaries.",
        problem: "Deploying undocumented models leads to catastrophic failures when models are applied outside their intended operational envelope (e.g., using a facial recognition model trained solely on adults on pediatric patients).",
        shift: "**Model Card: A standardized, structured documentation artifact that discloses a machine learning model's architecture, intended applications, training data provenance, quantitative evaluation benchmarks, known limitations, and ethical considerations.** Pioneered by Margaret Mitchell et al. at Google in 2019, adopted globally by Hugging Face and enterprise AI standards."
      },

      num: {
        t: "Standard Model Card Structural Sections & Regulatory Audit Disclosures",
        h: ["Model Card Section", "Disclosed Technical Information", "Operational Importance", "Target Audience", "Regulatory Alignment"],
        r: [
          ["Model Details", "Architecture, version, developer, license, publication date", "Identifies technical provenance and software dependencies", "Developers, ML engineers", "EU AI Act transparency"],
          ["Intended Use", "Primary intended tasks, out-of-scope & prohibited applications", "Explicitly defines operational boundaries to prevent misuse", "Product managers, end users", "Risk mitigation & liability"],
          ["Training & Eval Data", "Dataset name, source, demographic breakdown, filtering rules", "Discloses potential training representation gaps", "Auditors, compliance officers", "Fairness & anti-bias audits"],
          ["Quantitative Analysis", "Performance metrics broken down across demographic slices", "Reveals disparate impact and cohort accuracy gaps", "Data scientists, stakeholders", "Equal Credit Opportunity Act (ECOA)"],
          ["Ethical & Safety Factors", "Known bias vectors, environmental carbon footprint, risks", "Documents safety mitigations and red-teaming findings", "Ethicists, general public", "Responsible AI governance"]
        ],
        n: "A Model Card acts as the 'nutrition label' for AI systems. Modeled as a structured markdown or JSON document (e.g., `README.md` on Hugging Face), it enforces transparency by separating technical specs from operational safety constraints. Crucially, a Model Card requires **Disaggregated Evaluation**: rather than reporting a single global accuracy figure (which masks failure modes on minority groups), evaluation metrics must be broken down across critical demographic slices (gender, age, ethnicity, skin tone) and environmental conditions (lighting, background noise). It explicitly declares **Out-of-Scope Use Cases**—formal legal and operational boundaries that declare where the model must NEVER be deployed (e.g., 'Not certified for automated clinical diagnosis without human oversight')."
      },

      miss: [
        {
          w: "A model card is just a technical software API documentation page.",
          r: "Technical API docs explain functions and parameters. A Model Card documents **societal impact, intended use boundaries, demographic slice performance, known limitations, and ethical risks**."
        },
        {
          w: "Model cards are only necessary for public open-source models.",
          r: "Model Cards are increasingly mandatory for internal enterprise models in banking, healthcare, and insurance to pass internal risk committees, model risk management (SR 11-7) audits, and compliance regulations."
        },
        {
          w: "A model card guarantees that a model is completely unbiased and safe to use.",
          r: "A Model Card does not certify a model as 'safe'; it provides honest, transparent disclosure of where the model is biased, where it fails, and under what conditions it can be deployed responsibly."
        },
        {
          w: "Model cards must be written entirely by hand from scratch.",
          r: "Modern MLOps tools automate 70% of Model Card generation: pulling hyperparameters, training datasets, carbon emissions (CodeCarbon), and evaluation slice charts directly from experiment tracking registries."
        }
      ],

      trade: {
        buys: [
          "Prevents dangerous model misuse: clearly states where the model is unsuited and prohibited from being applied.",
          "Streamlines compliance and legal approval: satisfies regulatory disclosure mandates (EU AI Act, NIST AI RMF).",
          "Surfaces hidden demographic disparities via mandatory disaggregated evaluation slice reporting.",
          "Establishes institutional memory: documents key assumptions and data limitations for future engineering teams."
        ],
        costs: [
          "Documentation labor: generating thorough disaggregated evaluations and ethical reviews requires engineering time.",
          "Maintenance overhead: Model Cards must be continually updated when models are retrained or re-evaluated.",
          "Potential legal liability: documenting known model flaws can create discoverable liability records in litigation.",
          "Requires cross-functional review: demands input from legal, ethics, and product teams beyond data science."
        ],
        avoid: [
          "Never report only a single aggregate performance metric in a Model Card; always include disaggregated slice evaluations.",
          "Do not leave the 'Out-of-Scope Use Cases' section blank or vague; state specific prohibited applications.",
          "Avoid treating Model Cards as static write-and-forget documents; update them whenever the model evolves."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "responsible-ai",

      why: {
        before: "Machine learning focused exclusively on maximizing raw benchmark accuracy, ignoring whether models amplified racial biases, violated user privacy, acted as opaque un-interpretable black boxes, or generated toxic outputs.",
        problem: "Unregulated AI systems deployed in credit scoring, criminal justice, hiring, and healthcare reproduced historical discrimination, leaked private training data, and eroded public trust, triggering global regulatory clampdowns.",
        shift: "**Responsible AI: An overarching governance and engineering methodology that ensures artificial intelligence systems are developed and deployed ethically, safely, transparently, equitably, and in compliance with human values and legal standards.** Anchored by the NIST AI Risk Management Framework, EU AI Act, and corporate ethical charters."
      },

      num: {
        t: "Core Dimensions of Responsible AI Engineering & Technical Mitigations",
        h: ["Responsible AI Pillar", "Core Ethical Objective", "Primary Failure Risk", "Technical Engineering Mitigation", "Regulatory Benchmark"],
        r: [
          ["Fairness & Equity", "Prevent disparate impact across protected demographic groups", "Biased loan rejections / hiring discrimination", "Fairlearn / Disparate Impact re-weighting / Adversarial debiasing", "EEOC / Equal Credit Opportunity Act"],
          ["Explainability / Transparency", "Provide human-interpretable reasoning for algorithmic decisions", "Opaque black-box denials without recourse", "SHAP, LIME, Integrated Gradients, Counterfactual explanations", "GDPR 'Right to an Explanation'"],
          ["Privacy & Security", "Prevent leakage of confidential training data and PII", "Model inversion attacks, prompt extraction, PII leaks", "Differential Privacy (DP-SGD), federated learning, PII scrubbing", "GDPR / CCPA / HIPAA"],
          ["Safety & Robustness", "Ensure stable, non-hallucinatory, attack-resistant behavior", "Adversarial perturbations, toxic hallucinations, jailbreaks", "Red-teaming, input guardrails (NeMo), automated safety evals", "EU AI Act High-Risk systems"],
          ["Accountability & Governance", "Establish clear human ownership, auditability, and rollback", "Orphaned models operating without human oversight", "Model registries, Model Cards, automated lineage, kill switches", "NIST AI RMF / ISO 42001"]
        ],
        n: "Responsible AI operationalizes ethical guidelines into concrete software engineering and MLOps practices. In algorithmic fairness, systems measure mathematical parity across protected classes: **Demographic Parity** ($P(\\hat{Y}=1 \\mid A=0) = P(\\hat{Y}=1 \\mid A=1)$) and **Equalized Odds** ($P(\\hat{Y}=1 \\mid Y=y, A=0) = P(\\hat{Y}=1 \\mid Y=y, A=1)$). In data privacy, **Differential Privacy (DP-SGD)** injects calibrated Gaussian noise into gradient updates, mathematically proving that an adversary cannot deduce whether an individual record was present in the training set ($\\|M(D) - M(D')\\| \\le e^\\epsilon$). Responsible AI establishes operational **Kill Switches** and human oversight layers to intervene whenever model outputs breach established safety boundaries."
      },

      miss: [
        {
          w: "Responsible AI is just public relations marketing and ethical philosophy.",
          r: "Responsible AI is implemented through rigorous mathematical code: differential privacy noise parameters ($\\epsilon$), fairness constraint optimization (Fairlearn), cryptographic model watermarking, and automated red-teaming suites."
        },
        {
          w: "A model is fair if you simply remove protected attributes (like race or gender) from training data.",
          r: "This is 'Fairness through Unawareness', which fails completely. Proxy variables (such as zip code, school, or browsing history) correlate strongly with race and gender, allowing models to reconstruct protected attributes and reproduce identical discrimination."
        },
        {
          w: "All definitions of algorithmic fairness can be satisfied simultaneously in one model.",
          r: "The Kleinberg Impossibility Theorem mathematically proved that three primary fairness definitions (Demographic Parity, Equalized Odds, and Predictive Parity) are mutually exclusive whenever base rates differ across groups. Teams must make deliberate, transparent trade-offs."
        },
        {
          w: "Generative AI safety can be completely solved by putting a system prompt warning.",
          r: "System prompts are easily bypassed via jailbreak attacks, prompt injections, and multi-turn roleplaying. Production safety requires multi-layer defense: input guardrails, output classification filters, fine-tuned alignment (RLHF), and external content moderation APIs."
        }
      ],

      trade: {
        buys: [
          "Protects enterprise reputation and customer trust by preventing public algorithmic scandals.",
          "Guarantees compliance with strict international AI regulations (EU AI Act, FTC enforcement, NIST).",
          "Improves model robustness: systems designed for fairness and privacy generalize better to out-of-distribution real-world cases.",
          "Mitigates corporate legal liability for discriminatory hiring, credit, or healthcare decisions."
        ],
        costs: [
          "Accuracy-Fairness trade-off: constraining models to satisfy fairness metrics can slightly reduce overall global accuracy.",
          "Compute and engineering overhead: differential privacy and adversarial debiasing increase training complexity and duration.",
          "Extended development cycles: thorough red-teaming and compliance reviews extend time-to-market.",
          "Inference latency: multi-stage safety guardrails and input/output filters add milliseconds to user-facing responses."
        ],
        avoid: [
          "Never deploy high-stakes decision models (credit, hiring, parole) without disaggregated demographic parity auditing.",
          "Do not rely on simply dropping demographic columns to eliminate bias; audit proxy feature correlations.",
          "Avoid deploying conversational LLMs to customers without external input and output safety guardrails."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bias",

      why: {
        before: "Engineers assumed algorithms were inherently neutral and objective because they relied on mathematical optimization, believing that computers were incapable of human prejudice.",
        problem: "Machine learning algorithms learn by mimicking historical data; if historical data reflects societal inequalities, under-representation, or institutional prejudice, the model amplifies and automates that bias at scale.",
        shift: "**Bias: Systematic, repeatable errors in a machine learning system that create unfair disparities, privilege certain groups over others, or skew statistical estimations away from true population distributions.** Dissected into statistical estimation bias, historical data bias, representation bias, and measurement bias."
      },

      num: {
        t: "Taxonomy of Machine Learning Biases Across the Engineering Pipeline",
        h: ["Bias Taxonomy", "Source / Location in Lifecycle", "Mechanism", "Real-World Manifestation", "Technical Mitigation"],
        r: [
          ["Historical Bias", "Real-world ground truth data", "Data accurately reflects historical systemic societal inequality", "Hiring models penalizing female resumes based on past hiring records", "Fairness-constrained loss optimization / synthetic rebalancing"],
          ["Representation Bias", "Data collection & sampling", "Certain population cohorts are under-represented in the training set", "Facial recognition error rates 30x higher on darker skin tones", "Targeted stratified sampling & data augmentation"],
          ["Measurement Bias", "Feature engineering & labeling", "Chosen proxy feature does not accurately reflect target construct", "Using healthcare expenditure as a proxy for healthcare need", "Re-defining target labels with clinical experts"],
          ["Aggregation Bias", "Model architecture design", "A single one-size-fits-all model applied to heterogeneous sub-populations", "Diabetes model failing on distinct ethnic subgroups", "Disaggregated multi-task learning or subgroup-specific models"],
          ["Inductive / Statistical Bias", "Mathematical assumptions", "L1 regularization enforcing sparsity / linear model assumptions", "Underfitting complex non-linear interactions", "Increasing model capacity / switching architecture"]
        ],
        n: "Algorithmic bias manifests when an estimator exhibits systematic error: $\\mathbb{E}[\\hat{\\theta}] \\ne \\theta$. In fairness engineering, bias is quantified through disparate impact metrics. Under the US Equal Employment Opportunity Commission (EEOC) **Four-Fifths Rule (80% Rule)**, a selection rate for any protected group $A$ that is less than four-fifths ($80\\%$) of the rate for the highest group is prima facie evidence of disparate impact: $\\text{Disparate Impact} = \\frac{P(\\hat{Y}=1 \\mid A=0)}{P(\\hat{Y}=1 \\mid A=1)} < 0.80$. Mitigations operate across three stages: (1) **Pre-processing**: Re-weighting training samples or applying disparate impact removal to feature distributions. (2) **In-processing**: Incorporating adversarial debiasing heads or fairness penalty terms into loss functions: $\\mathcal{L} = \\mathcal{L}_{\\text{task}} + \\lambda \\mathcal{L}_{\\text{fairness}}$. (3) **Post-processing**: Adjusting classification decision thresholds independently across demographic groups to achieve equalized odds."
      },

      miss: [
        {
          w: "Bias in machine learning is always malicious and introduced deliberately by bad actors.",
          r: "Over 99% of algorithmic bias is completely unintentional. It arises naturally from historical inequalities baked into training data, convenience sampling, misaligned proxy labels, and feedback loops."
        },
        {
          w: "Statistical bias and societal unfairness are identical concepts.",
          r: "Statistical bias is a mathematical property (an estimator's expected value differing from the true parameter: $\\mathbb{E}[\\hat{\\theta}] - \\theta$). Societal bias refers to unjust discrimination against protected groups. A model can be statistically unbiased against historical training data while being socially unfair."
        },
        {
          w: "Collecting more data will automatically eliminate bias.",
          r: "If the underlying data collection process is flawed or reflects historical prejudice, collecting ten times more data simply teaches the model to automate and entrench that bias with higher statistical confidence."
        },
        {
          w: "Setting the exact same classification threshold (e.g., 0.50) for all groups is fair.",
          r: "Because feature distributions and baseline group scores often diverge due to socioeconomic factors, a uniform threshold can result in wildly disparate false positive or false negative rates across groups, violating Equalized Odds."
        }
      ],

      trade: {
        buys: [
          "Prevents systemic discrimination and protects vulnerable demographic cohorts from automated harm.",
          "Protects organizations from devastating legal penalties, regulatory injunctions, and public reputational damage.",
          "Improves overall model generalization by eliminating spurious demographic correlations.",
          "Aligns corporate AI systems with regulatory standards (EEOC, Fair Housing Act, EU AI Act)."
        ],
        costs: [
          "Accuracy trade-offs: constraining a model to eliminate disparate impact can reduce raw global statistical accuracy.",
          "Data collection complexity: auditing bias requires collecting and handling sensitive demographic attributes safely.",
          "Engineering overhead: requires implementing fairness testing frameworks (AIF360, Fairlearn) and ongoing monitoring.",
          "Stakeholder alignment difficulty: choosing which fairness definition to prioritize requires difficult business and legal compromises."
        ],
        avoid: [
          "Never evaluate model performance solely on aggregate accuracy; always compute metrics across demographic cohorts.",
          "Do not assume a model is fair because protected attributes were excluded from the input feature set.",
          "Avoid using historical outcome data as target ground truth without auditing whether historical decisions were biased."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "human-in-the-loop",

      why: {
        before: "Organizations attempted full end-to-end automation of high-stakes decisions (medical diagnosis, legal bail recommendations, large-dollar credit underwriting), leading to catastrophic errors when algorithms encountered rare edge cases.",
        problem: "Autonomous AI models lack common-sense world reasoning, cannot assess ethical context, and output confident hallucinations on out-of-distribution inputs that can cause real-world physical or financial harm.",
        shift: "**Human-in-the-Loop (HITL): An architectural design pattern that integrates human judgment, oversight, review, and feedback directly into the operational machine learning lifecycle.** Spans training data annotation, active learning triage, high-stakes prediction escalations, and RLHF alignment."
      },

      num: {
        t: "Human-in-the-Loop Operational Patterns Across the AI Lifecycle",
        h: ["HITL Operational Pattern", "Lifecycle Stage", "Human Role", "Trigger Mechanism", "Primary Value"],
        r: [
          ["Active Learning", "Model Training", "Data annotator / Oracle", "Model uncertainty sampling (entropy $> \\tau$)", "Reduces data labeling cost by 80%"],
          ["Reinforcement Learning (RLHF)", "Model Alignment", "Preference judge / Ranker", "Comparative output evaluation", "Aligns LLM behavior with human intent and safety"],
          ["Confidence-Based Triage", "Production Inference", "Decision maker / Approver", "Prediction confidence below threshold ($< 0.85$)", "Zero-risk automation: delegates edge cases to humans"],
          ["Exception / Appeal Review", "Post-Inference Auditing", "Auditor / Ombudsman", "Customer complaint / statistical anomaly", "Provides human recourse against algorithmic errors"],
          ["Shadow Co-Pilot", "Interactive Assistance", "End user (lawyer, doctor, coder)", "Always human in driver's seat", "Multiplies human productivity while retaining accountability"]
        ],
        n: "Human-in-the-Loop transforms machine learning from an autonomous black box into a collaborative cognitive pipeline. In production inference, HITL is implemented via **Confidence-Gated Escalation**: $y = f(x)$ if $\\text{Confidence}(x) \\ge \\tau$, else escalate to $\\text{HumanReviewer}(x)$. For example, in automated claims processing, an AI model automatically approves 70% of claims where its predicted confidence is $>99\\%$. For the remaining 30% containing ambiguous receipts, potential fraud signals, or missing documentation, the request is paused and routed to a human adjuster dashboard. The human's resolution is recorded and fed back into the training store as high-value labeled data, creating a continuous **Active Learning Flywheel** that progressively increases the model's automation coverage over time."
      },

      miss: [
        {
          w: "Human-in-the-loop is an admission that the machine learning model is a failure.",
          r: "HITL is the industry gold standard for responsible AI in high-stakes systems. Automating 70% of straightforward cases while delegating the 30% complex edge cases to human experts delivers massive cost savings while eliminating catastrophic automated liability."
        },
        {
          w: "Humans in the loop are always objective and never introduce bias.",
          r: "Human reviewers introduce human fatigue, implicit racial/gender biases, and inconsistent decisions. Production HITL systems require blinded reviews, consensus labeling across multiple reviewers, and automated auditing of human decision variance."
        },
        {
          w: "HITL makes real-time sub-second application inference impossible.",
          r: "HITL can be implemented asynchronously: the system issues an immediate conservative provisional action (or triggers an instant human-assist queue) while complex edge cases are reviewed in background queues within an agreed customer SLA."
        },
        {
          w: "RLHF is just asking human annotators to write good text.",
          r: "RLHF typically asks humans to **rank** competing model outputs pairwise, training a continuous neural Reward Model that guides Reinforcement Learning (PPO/DPO), optimizing mathematical preference policies at scale."
        }
      ],

      trade: {
        buys: [
          "Eliminates catastrophic automated risk: ensures high-stakes decisions (medical, legal, financial) always have human oversight.",
          "Establishes a continuous active learning flywheel: edge cases resolved by humans continuously retrain and improve the model.",
          "Maintains legal and ethical accountability: keeps a human in the loop to satisfy regulatory mandates (EU AI Act).",
          "Dramatically reduces labeling costs: Active Learning selects only the most informative samples for human annotation."
        ],
        costs: [
          "High operational and staffing expenses: maintaining dedicated teams of trained human reviewers is costly.",
          "Introduces decision latency: tasks routed to human queues take minutes or hours to resolve instead of milliseconds.",
          "Reviewer fatigue and inconsistency: human reviewers degrade in accuracy over long shifts without quality controls.",
          "UI/UX tooling complexity: requires building and maintaining specialized annotation and review software interfaces."
        ],
        avoid: [
          "Never deploy full autonomous AI in life-or-death (medical) or liberty-affecting (criminal justice) domains without HITL.",
          "Do not route edge cases to human reviewers without standardized rubrics, training, and inter-annotator agreement auditing.",
          "Avoid discarding human reviewer corrections; feed them directly back into the automated retraining pipeline."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ground-truth",

      why: {
        before: "Teams evaluated machine learning models against noisy, subjective, and conflicting labels assigned by untrained annotators, believing that the resulting benchmark numbers represented true real-world accuracy.",
        problem: "A machine learning model can never be more accurate than the data used to evaluate it; corrupted, noisy, or misaligned ground truth leads to deploying flawed models while rejecting superior ones.",
        shift: "**Ground Truth: The verified, empirical real-world facts, outcomes, or gold-standard annotations used as the target benchmark to train, evaluate, and calibrate machine learning models.** The foundational bedrock of supervised learning and model monitoring."
      },

      num: {
        t: "Ground Truth Acquisition Models: Latency, Cost & Verification Fidelity",
        h: ["Ground Truth Type", "Acquisition Mechanism", "Fidelity / Trust Level", "Label Latency", "Primary Business Example"],
        r: [
          ["Direct Empirical Outcome", "Observed real-world physical event", "Absolute (100% ground truth)", "Hours to months", "Credit card chargeback occurred; patient survived 5 years; loan defaulted"],
          ["Expert Human Consensus", "Multiple board-certified domain specialists", "Very High (gold standard)", "Days to weeks", "Radiologists segmenting MRI tumor margins; lawyers parsing contracts"],
          ["Crowdsourced Annotation", "Third-party platform gig workers (MTurk)", "Moderate (subject to noise/spam)", "Days", "General object bounding boxes; sentiment analysis"],
          ["Weak Supervision / Heuristic", "Rule engines (Snorkel) / LF labeling functions", "Moderate (systematic noise)", "Instantaneous", "Heuristic keyword matches for training data bootstrapping"],
          ["LLM-as-a-Judge / Synthetic", "Frontier LLM (GPT-4) evaluating outputs", "Moderate to High", "Seconds", "Evaluating conversational chatbot fluency and helpfulness"]
        ],
        n: "In supervised learning theory, ground truth represents the true underlying target function $Y = f^*(X) + \\epsilon$. A model's measured empirical risk $\\hat{R}(f) = \\frac{1}{N} \\sum_{i=1}^N \\mathcal{L}(f(x_i), y_i)$ is valid ONLY under the assumption that $y_i$ accurately reflects $f^*(x_i)$. In production MLOps, a critical engineering bottleneck is **Label Latency**—the delay between making an inference prediction $\\hat{y}_t$ and observing the true ground truth outcome $y_{t+\\Delta t}$. In ad-click prediction, label latency is minutes (user clicked or didn't); in loan default prediction, label latency is 3 to 5 years. Evaluating models on delayed ground truth requires complex **Feedback Join Pipelines** that match historical prediction IDs with delayed outcome event streams in cloud data lakes."
      },

      miss: [
        {
          w: "Ground truth in existing datasets is always 100% accurate and represents absolute truth.",
          r: "Extensive academic audits (Northcutt et al., Confident Learning) revealed that popular benchmark datasets (including ImageNet, MNIST, and CoNLL) contain 3% to 10% label errors, where ground-truth tags are blatantly wrong."
        },
        {
          w: "Ground truth is available immediately after a model makes an inference prediction.",
          r: "Real-world ground truth is almost always asynchronous and delayed. In fraud detection, a transaction flagged as clean today may be reported as fraudulent by the cardholder 60 days later."
        },
        {
          w: "Subjective tasks (like creative writing or aesthetic beauty) have a single definitive ground truth.",
          r: "Tasks involving human aesthetics, humor, or policy interpretation have no objective physical ground truth. They represent distributions of diverse human perspectives, requiring multi-annotator modeling rather than collapsing into a single label."
        },
        {
          w: "LLM-generated synthetic labels are a complete replacement for human ground truth.",
          r: "LLMs amplify their own internal biases and hallucinations when generating synthetic labels. Evaluating models exclusively on LLM-generated synthetic ground truth creates circular confirmation bias and masks real-world failure modes."
        }
      ],

      trade: {
        buys: [
          "The definitive benchmark: provides the immutable empirical standard required to train and evaluate supervised models.",
          "Enables true model observability: calculating true business ROI and error rates requires pairing predictions with ground truth.",
          "High-quality ground truth acts as a competitive moat: proprietary verified datasets yield superior models.",
          "Provides the objective basis for resolving human disputes regarding model accuracy and compliance."
        ],
        costs: [
          "Extreme financial expense: acquiring gold-standard expert ground truth (e.g., board-certified doctors) is expensive.",
          "Label latency delays: long delays before real-world outcomes materialize delay performance evaluation.",
          "Label noise and disagreement: human annotators diverge on ambiguous cases, requiring multi-annotator adjudication.",
          "Privacy and security constraints: handling ground-truth records containing sensitive customer outcomes requires strict governance."
        ],
        avoid: [
          "Never evaluate production model accuracy without accounting for label latency and delayed outcome arrivals.",
          "Do not train models on crowdsourced labels without automated quality filtering (e.g., inter-annotator agreement $\\kappa$).",
          "Avoid treating noisy single-annotator tags as infallible ground truth; use Confident Learning to filter label errors."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-rollback",

      why: {
        before: "When a newly deployed machine learning model began outputting corrupted predictions, hallucinating, or causing application crashes, panicked engineers had to manually rebuild older code, recompile containers, and wait 45 minutes for deployment pipelines to finish while live users suffered outages.",
        problem: "Production incidents require sub-second remediation; in high-stakes trading, medical, or checkout environments, waiting minutes for a traditional software rollback destroys millions of dollars in revenue.",
        shift: "**Model Rollback: The automated or instantaneous capability to revert an active production machine learning service to a previously verified, stable model artifact or safe heuristic baseline.** Orchestrated via dynamic Model Registry aliases, blue-green routing, and automated circuit breakers."
      },

      num: {
        t: "Model Rollback Mechanisms: Execution Speed, Blast Radius & Automation Triggers",
        h: ["Rollback Mechanism", "Technical Execution Mechanism", "Rollback Latency", "Deployment Impact", "Trigger Autonomy"],
        r: [
          ["Registry Alias Pointer Swap", "Update `@champion` alias pointer from `v15` to `v14` in registry", "Sub-second (< 500 ms)", "Zero pod rebuilds; routing proxy detects alias shift", "Automated via drift / error circuit breaker"],
          ["Service Mesh Traffic Shift", "Istio / Envoy route 100% traffic to Green stable pod", "Sub-second (< 1s)", "Instant network routing shift; pods remain warm", "Automated on HTTP 5xx or latency spikes"],
          ["Kubernetes Rollback", "`kubectl rollout undo deployment/model-serving`", "1 to 3 minutes", "Terminates failing pods; spins up old container image", "Manual CLI / CD pipeline rollback"],
          ["Fallback Heuristic Switch", "In-memory circuit breaker swaps to rule-based logic", "< 5 milliseconds", "Bypasses ML inference entirely; runs deterministic code", "Automated on inference timeout / exception"],
          ["Cold Container Re-deploy", "Re-building and pushing older Docker image tag", "15 to 45 minutes", "Full CI/CD pipeline execution", "Emergency disaster recovery"]
        ],
        n: "Model Rollback in modern MLOps is designed around the principle of **Decoupled Architecture**: the physical container hosting the inference runtime is decoupled from the model artifact pointer. The Model Serving engine polls or receives webhooks from the **Model Registry**. When an automated observability platform (e.g., Evidently) detects an unacceptable anomaly (e.g., HTTP error rate $> 1\\%$, $P_{99}$ latency $> 200$ ms, or prediction distribution divergence $> 3\\sigma$), it triggers an automated **Rollback Circuit Breaker**: $\\text{Alias}(\\text{Production}) \\leftarrow \\text{Version}_{t-1}$. The serving layer detects the alias transition and atomically swaps its in-memory weight pointers to the pre-warmed previous stable version in milliseconds, executing a complete recovery without restarting Kubernetes pods or dropping active TCP connections."
      },

      miss: [
        {
          w: "Model rollback requires re-running the entire model training pipeline for the old model.",
          r: "Model artifacts in a Model Registry are strictly **immutable and permanently preserved**. Rolling back requires zero training; it is an instantaneous pointer swap to an existing, pre-compiled, and pre-validated historical artifact."
        },
        {
          w: "Kubernetes pod rollback is the fastest and best way to roll back an ML model.",
          r: "Kubernetes pod rollouts take 1 to 3 minutes to pull images, initialize CUDA drivers, allocate GPU VRAM, and pass readiness probes. **Registry alias routing or service mesh traffic shifting** executes in under 500 milliseconds without touching pods."
        },
        {
          w: "Deleting the buggy model version from the registry rolls back production automatically.",
          r: "Deleting an active model version creates an immediate catastrophic outage: running inference servers will throw `ModelNotFoundError` exceptions. Rollback requires explicitly re-pointing the production alias to a healthy historical version before archiving the bad version."
        },
        {
          w: "Model rollback is purely an emergency manual action executed by an SRE.",
          r: "Modern MLOps incorporates **Automated Canary Rollbacks**: if a new model canary exhibits an elevated error rate or abnormal prediction drift within the first 10 minutes of deployment, the deployment orchestrator rolls back automatically without human intervention."
        }
      ],

      trade: {
        buys: [
          "Minimizes incident Mean Time to Resolution (MTTR): restores healthy production service in sub-seconds.",
          "Zero-downtime recovery: eliminates user-facing disruption, dropped connections, or pod restarts.",
          "Empowers fearless deployment: engineering teams deploy candidate models with confidence knowing instant rollback is guaranteed.",
          "Automated circuit breakers protect business revenue from catastrophic model hallucinations or latency spikes."
        ],
        costs: [
          "Storage retention costs: requires retaining older multi-gigabyte model artifacts and container images in registries.",
          "Pre-warmed infrastructure overhead: blue-green instant rollbacks require running idle fallback compute instances.",
          "Database and state synchronization: rolling back a model that altered downstream database schemas requires database rollback logic.",
          "Routing proxy complexity: requires maintaining dynamic routing proxies (Envoy/Kong) integrated with the model registry."
        ],
        avoid: [
          "Never delete or purge historical production model artifacts without an established retention policy.",
          "Do not roll out model deployments without verifying that the automated rollback trigger and path are functional.",
          "Avoid cold container redeployment as your primary rollback strategy in mission-critical applications."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
