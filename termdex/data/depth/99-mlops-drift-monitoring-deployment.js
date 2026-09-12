/* ==========================================================================
   Depth pass 99 — MLOps batch 2: Drift, Monitoring & Traffic Routing.
   Model Drift, Concept Drift, Model Monitoring, Retraining,
   Training-Serving Skew, Shadow Deployment, A/B Testing, Champion-Challenger.

   Statistical hypothesis tests quantify covariate shifts across live feature distributions;
   asynchronous shadow routers validate challenger inference pipelines without user impact.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "model-drift",

      why: {
        before: "Teams assumed machine learning models behaved like traditional software, believing that a model tested with 95% accuracy in January would continue performing at 95% accuracy indefinitely.",
        problem: "The physical world is non-stationary: macroeconomic trends shift, consumer behaviors evolve, sensor hardware degrades, and competitor actions disrupt markets, causing a model's real-world predictive performance to decay over time.",
        shift: "**Model Drift (Model Decay): The gradual degradation of an ML model's real-world predictive accuracy over time caused by discrepancies between the statistical distribution of the training data and the distribution of live production data.** Detected via statistical divergence metrics (PSI, KS-test, Wasserstein distance) and continuous evaluation."
      },

      num: {
        t: "Statistical Drift Detection Metrics: Data Types, Formulations & Alert Thresholds",
        h: ["Metric", "Applicable Data Type", "Mathematical Formulation", "Rule-of-Thumb Alert Threshold", "Sensitivity Profile"],
        r: [
          ["Population Stability Index (PSI)", "Continuous & Categorical features", "$\\sum (P_i - Q_i) \\ln(P_i / Q_i)$", "$\\text{PSI} \\ge 0.2$ (Significant drift)", "Standard in financial credit risk modeling"],
          ["Kolmogorov-Smirnov (KS) Test", "Continuous numerical distributions", "$\\sup_x |F_{\\text{ref}}(x) - F_{\\text{curr}}(x)|$", "$p\\text{-value} < 0.05$", "Non-parametric maximum distance between empirical CDFs"],
          ["Wasserstein / Earth Mover's", "Continuous multi-modal distributions", "$\\int |F_{\\text{ref}}(x) - F_{\\text{curr}}(x)| dx$", "Domain-scaled distance shift", "Measures minimum physical work to transform distributions"],
          ["Chi-Square ($\\chi^2$) Test", "Categorical discrete variables", "$\\sum \\frac{(O_i - E_i)^2}{E_i}$", "$p\\text{-value} < 0.05$", "Detects shifts in category proportions"],
          ["Maximum Mean Discrepancy (MMD)", "High-dimensional embeddings / images", "$\\| \\mathbb{E}[\\phi(X)] - \\mathbb{E}[\\phi(Y)] \\|_{\\mathcal{H}}$", "Permutation test threshold", "Kernel-based non-parametric two-sample test"]
        ],
        n: "Model drift encompasses two distinct statistical shifts: **Data Drift (Covariate Shift)**—where the input feature distribution changes ($P(X_{\\text{live}}) \\ne P(X_{\\text{train}})$) while the underlying relationship remains static ($P(Y \\mid X)$ constant)—and **Concept Drift**—where the true relationship between features and labels changes ($P(Y \\mid X_{\\text{live}}) \\ne P(Y \\mid X_{\\text{train}})$). The **Population Stability Index (PSI)** is widely adopted in enterprise production monitoring: it partitions the reference training distribution $P$ and current production distribution $Q$ into $K$ quantile buckets (typically 10). A $\\text{PSI} < 0.10$ denotes stability; $0.10 \\le \\text{PSI} < 0.20$ indicates moderate shift; and $\\text{PSI} \\ge 0.20$ denotes significant drift requiring automated model retraining."
      },

      miss: [
        {
          w: "Model drift means a software bug or memory leak was introduced into the deployment server.",
          r: "Model drift is not an infrastructure or software bug. The software container and weights are 100% mathematically intact, but the external real-world data distribution shifted, rendering the model's learned patterns obsolete."
        },
        {
          w: "Model drift can only be detected if you have immediate ground-truth labels.",
          r: "Ground-truth labels are frequently delayed by weeks or months (e.g., loan defaults take months to materialize). **Data Drift (Covariate Shift)** monitors changes in input features $P(X)$ in real time, detecting shifts long before ground-truth labels arrive."
        },
        {
          w: "A statistical drift alert always means model performance has degraded.",
          r: "Statistical tests on massive datasets ($N > 100,000$) have extreme statistical power, flagging tiny, economically meaningless distribution shifts with $p < 0.001$. Drift metrics must be calibrated against actual business KPIs."
        },
        {
          w: "Retraining on the most recent week of data will always fix model drift.",
          r: "If the drift was caused by a temporary outlier anomaly (e.g., Black Friday sales spike or a pandemic lockdown), retraining blindly on recent data overfits the model to temporary noise, degrading long-term performance."
        }
      ],

      trade: {
        buys: [
          "Early warning system: detects shifts in user behavior and incoming data before business revenue is impacted.",
          "Automated pipeline triggers: provides quantitative thresholds to trigger automated retraining pipelines.",
          "Protects algorithmic fairness: identifies when demographic distribution shifts risk introducing algorithmic bias.",
          "Maintains stakeholder confidence by proving active operational governance over production AI systems."
        ],
        costs: [
          "Compute monitoring overhead: calculating continuous statistical distances across millions of events consumes database compute.",
          "Alert fatigue: sensitive statistical hypothesis tests generate frequent false positive alerts on high-volume traffic.",
          "Storage requirements: logging and snapshotting high-resolution production inference features requires storage capacity.",
          "Complex remediation: diagnosing whether drift requires retraining, feature pruning, or upstream bug fixes requires human effort."
        ],
        avoid: [
          "Never deploy production models without automated data drift monitoring on key input features.",
          "Do not trigger expensive model retraining on every minor statistical $p$-value shift without checking PSI magnitude.",
          "Avoid using static drift thresholds across seasonal features without accounting for natural weekly and holiday variance."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "concept-drift",

      why: {
        before: "Engineers monitored input data distributions (covariates), assuming that if incoming customer demographics remained identical, the model's predictions would remain accurate.",
        problem: "The fundamental meaning of data changes over time: macroeconomic inflation alters what counts as an 'expensive' purchase, pandemics redefine normal commuting patterns, and fraud tactics evolve rapidly, rendering historical labels inaccurate even when input features appear identical.",
        shift: "**Concept Drift: The phenomenon where the statistical relationship between the input features and the target label changes over time ($P(Y \\mid X_{\\text{live}}) \\ne P(Y \\mid X_{\\text{train}})$).** The most dangerous form of model decay because it cannot be detected by monitoring input features alone."
      },

      num: {
        t: "Concept Drift Types, Temporal Dynamics & Real-World Manifestations",
        h: ["Drift Type", "Temporal Velocity", "Mathematical Dynamic", "Real-World Business Example", "Remediation Strategy"],
        r: [
          ["Sudden / Abrupt", "Instantaneous step change", "$P(Y \\mid X)$ jumps to new state at $t_0$", "Global pandemic lockdown alters travel demand overnight", "Emergency fallback model / rule override"],
          ["Gradual / Incremental", "Continuous progressive shift", "$P(Y \\mid X)$ shifts smoothly over months", "Inflation steadily alters luxury spending price thresholds", "Sliding window continuous retraining"],
          ["Recurring / Seasonal", "Periodic cyclical shift", "$P(Y \\mid X)$ cycles periodically", "Black Friday holiday shopping patterns / summer travel", "Seasonality-aware features / cyclical models"],
          ["Adversarial / Reactive", "Strategic evasive shift", "Agents deliberately alter behavior to bypass model", "Spammers and fraudsters adapting techniques to evade detection", "Online learning / adversarial retraining"]
        ],
        n: "Concept drift represents a shift in the underlying Bayesian conditional probability distribution: $P(Y \\mid X) = \\frac{P(X \\mid Y) P(Y)}{P(X)}$. Even if input distribution $P(X)$ remains completely unchanged, $P(Y \\mid X)$ can change, meaning identical inputs now map to different ground-truth outputs. For example, in real estate, an input vector $X = [\\text{sqft}=1200, \\text{bedrooms}=2]$ mapped to target $Y = \\$300,000$ in 2019, but the exact same $X$ maps to $Y = \\$550,000$ in 2024. Because concept drift involves the target $Y$, it **cannot** be discovered by inspecting input features alone; it is detected by monitoring model evaluation metrics (Error Rate, F1-Score, Brier Score) as delayed ground-truth labels arrive, using drift algorithms like **DDM (Drift Detection Method)** or **ADWIN (Adaptive Windowing)**."
      },

      miss: [
        {
          w: "Concept drift and Data drift are interchangeable terms for the same thing.",
          r: "They are mathematically distinct. **Data Drift** is a shift in inputs $P(X)$. **Concept Drift** is a shift in the conditional relationship between inputs and targets $P(Y \\mid X)$. Concept drift can occur even when input distributions $P(X)$ are 100% identical."
        },
        {
          w: "Monitoring feature histograms in Evidently or Great Expectations will catch concept drift.",
          r: "Feature histograms monitor only input distributions $P(X)$. They are completely blind to concept drift. Catching concept drift requires matching model predictions against delayed **ground-truth labels** to detect decaying accuracy."
        },
        {
          w: "Concept drift always happens slowly and gradually.",
          r: "Concept drift can be instantaneous and violent (Sudden Drift), such as regulatory interest rate changes, algorithmic competitor price wars, or natural disasters that instantly break historical predictive relationships."
        },
        {
          w: "Training on all available historical data since the company's inception produces the best model.",
          r: "Under concept drift, old historical data is toxic: it actively teaches the model obsolete relationships. In non-stationary environments, training on a **recent sliding window** (e.g., past 90 days) significantly outperforms training on 5 years of stale data."
        }
      ],

      trade: {
        buys: [
          "Identifies the root cause of declining business conversion rates and degraded decision quality.",
          "Protects against sophisticated adversarial attacks in spam, fraud, and cybersecurity domains.",
          "Forces data science teams to adopt adaptive learning architectures (sliding windows, online decay weighting).",
          "Drives automated feedback loops between ground-truth ingestion and model retraining."
        ],
        costs: [
          "Requires ground-truth labels: detection is bottlenecked by the label latency of real-world business outcomes.",
          "High retraining complexity: requires automated pipeline pipelines capable of retraining, validating, and deploying frequently.",
          "Risk of overfitting to temporary noise if sliding training windows are set too aggressively short.",
          "High compute costs if retraining must be executed weekly or daily to track rapid concept shifts."
        ],
        avoid: [
          "Never assume a model is performing well simply because input feature distributions have zero data drift.",
          "Do not train models on stale multi-year historical data without validating whether the concept has drifted.",
          "Avoid using static retraining schedules (e.g., yearly) in fast-moving domains like fraud detection or ad click prediction."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-monitoring",

      why: {
        before: "Organizations deployed machine learning models into production black boxes, relying on end users or customer support complaints to discover that an AI model had begun outputting corrupted predictions or hallucinated numbers.",
        problem: "ML systems fail silently: unlike software servers that crash with HTTP 500 errors, decaying ML models continue outputting HTTP 200 OK responses with clean JSON payloads that contain completely wrong predictions.",
        shift: "**Model Monitoring: The continuous operational practice of tracking, logging, and analyzing machine learning systems in production across software health, input data drift, predictive output distributions, and business KPIs.** Enabled by platforms like Evidently AI, Arize, WhyLabs, and Fiddler."
      },

      num: {
        t: "Model Monitoring Hierarchy: Telemetry Tiers, Metrics & Response Times",
        h: ["Monitoring Tier", "Monitored Metrics / Telemetry", "Detection Latency", "Alert Mechanism", "Remediation Action"],
        r: [
          ["Infrastructure Health", "CPU/GPU utilization, RAM, network I/O, error rate", "Real-time (< 1s)", "Prometheus / Grafana / PagerDuty", "Horizontal Pod Auto-scaling / Restart"],
          ["Inference Performance", "Latency ($P_{50}, P_{95}, P_{99}$), throughput (RPS), queue depth", "Real-time (< 5s)", "Datadog / APM alerts", "Dynamic batching adjustment / scale nodes"],
          ["Data Quality & Drift", "Missing values, schema drift, PSI, KS-test on features", "Near real-time (minutes to hours)", "Evidently AI / Slack webhook", "Quarantine anomalous traffic / fallback rules"],
          ["Prediction Drift", "Output classification probability distributions, mean score", "Hourly / Daily batch", "Drift dashboards", "Trigger champion-challenger review"],
          ["Ground-Truth Performance", "Accuracy, Precision, Recall, ROC-AUC, RMSE, Business ROI", "Days to weeks (label delay)", "Executive business alerts", "Automated pipeline retraining & redeployment"]
        ],
        n: "Model monitoring operates across a four-layer observability stack: (1) **System Layer**: Tracks traditional SRE metrics via Prometheus: inference latency percentiles ($P_{99} < 50$ ms), HTTP error codes, and GPU VRAM saturation. (2) **Data Layer**: Monitors incoming feature payloads for schema drift (missing fields, unexpected string values) and statistical distribution drift ($P(X)$) using streaming sliding-window algorithms. (3) **Prediction Layer**: Analyzes model output logits and score distributions ($P(\\hat{Y})$). Even without ground-truth labels, a sudden shift in approval rates (e.g., loan approval model jumping from 20% to 60%) serves as a proxy for model malfunction. (4) **Business KPI Layer**: Pairs predictions with delayed ground truth ($Y$) to compute true operational accuracy and business return on investment."
      },

      miss: [
        {
          w: "Traditional software APM tools (Datadog, New Relic) provide complete ML model monitoring.",
          r: "APM tools monitor server uptime, latency, and CPU usage. They have zero understanding of statistical distribution drift, feature attribution shifts, embedding degradation, or concept drift. Specialized ML monitoring is required."
        },
        {
          w: "Model monitoring is impossible if ground-truth labels take 3 months to arrive.",
          r: "Over 75% of monitoring value comes from tracking **input feature drift ($P(X)$)** and **output prediction drift ($P(\\hat{Y})$)**, both of which are measured instantaneously in real time without needing ground-truth labels."
        },
        {
          w: "Logging every single inference input and prediction creates too much storage overhead.",
          r: "In high-throughput systems (10,000+ RPS), storing 100% of payloads can be costly. Best practice utilizes **reservoir sampling** or statistical profiling (e.g., Whylogs sketch profiles) that capture exact statistical distributions with negligible storage."
        },
        {
          w: "A model monitoring alert should always immediately wake up an on-call engineer at 2:00 AM.",
          r: "Paging on-call engineers for statistical drift alerts causes severe alert fatigue. Only hard infrastructure crashes, extreme data corruption, or sudden drops in business conversion should trigger high-priority pages; drift alerts should route to asynchronous ticketing queues."
        }
      ],

      trade: {
        buys: [
          "Eliminates silent failures: immediately detects when an ML model begins outputting corrupted or anomalous predictions.",
          "Enables proactive governance: catches input data drift before downstream business metrics and revenue are degraded.",
          "Establishes a quantitative feedback loop to justify when and why model retraining is necessary.",
          "Provides complete forensic audit trails for debugging customer complaints and regulatory compliance inquiries."
        ],
        costs: [
          "Logging storage costs: persisting high-dimensional feature vectors across millions of requests increases storage volume.",
          "Compute overhead: running continuous statistical hypothesis tests and histogram diffs requires background compute.",
          "Alert fatigue risk: poorly calibrated drift thresholds trigger frequent false alarms that desensitize engineering teams.",
          "Integration complexity: requires instrumenting inference serving layers, message queues, and ground-truth joining pipelines."
        ],
        avoid: [
          "Never rely exclusively on server uptime (HTTP 200) as evidence that a machine learning model is operating correctly.",
          "Do not configure raw data logging without data privacy scrubbing (stripping PII, passwords, and sensitive fields).",
          "Avoid monitoring high-throughput models without statistical sketching (e.g., Whylogs) or intelligent sampling."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "retraining",

      why: {
        before: "Retraining machine learning models was an ad-hoc, manual chore performed only after an executive noticed that business conversion rates had plummeted, requiring weeks of manual data gathering, training, and testing.",
        problem: "Real-world data decays continuously; without systematic retraining pipelines, models become stale, losing predictive accuracy and allowing competitors with fresh models to outperform them.",
        shift: "**Retraining: The programmatic process of re-executing model training pipelines on fresh, updated datasets to combat model decay, adapt to concept drift, and maintain predictive performance.** Operates across three triggers: schedule-based, metric-based, or event-driven."
      },

      num: {
        t: "Retraining Trigger Strategies: Complexity, Resource Cost & Freshness",
        h: ["Trigger Strategy", "Triggering Mechanism", "System Complexity", "Compute Cost", "Model Freshness"],
        r: [
          ["Scheduled Retraining", "Cron calendar interval (daily, weekly, monthly)", "Low (standard Airflow schedule)", "Predictable / Periodic", "Moderate (lags by schedule interval)"],
          ["Performance-Driven", "Accuracy drops below threshold on delayed ground truth", "Moderate (requires ground-truth pipeline)", "On-demand (cost-efficient)", "High on true degradation"],
          ["Drift-Driven (Covariate)", "Input feature PSI $\\ge 0.2$ or KS-test failure", "Moderate (real-time drift monitoring)", "On-demand when input shifts", "Proactive (retrains before ground truth fails)"],
          ["Continuous Online Learning", "Model weights update incrementally on every incoming stream event", "Very High (requires online algorithms)", "Continuous micro-compute", "Instantaneous (adapts in seconds)"]
        ],
        n: "Retraining is the central component of **Continuous Training (CT)** in mature MLOps pipelines. A production retraining pipeline must be entirely automated and deterministic: $\\mathcal{D}_{\\text{new}} \\rightarrow \\text{Validate Data} \\rightarrow \\text{Train Model} \\rightarrow \\text{Evaluate vs Champion} \\rightarrow \\text{Deploy}$. To avoid catastrophic model regressions, the newly trained 'Challenger' model is subjected to automated **Model Evaluation Gates**: (1) It must outperform the existing 'Champion' model on a pristine, held-out historical benchmark test set. (2) It must pass **Data Slice Tests** (ensuring accuracy on critical business cohorts hasn't degraded). (3) It must pass inference latency benchmarks. Only if all automated validation gates pass is the new model promoted to the Model Registry."
      },

      miss: [
        {
          w: "Retraining always means training the model from scratch on the entire historical dataset.",
          r: "Training from scratch on all historical data is computationally wasteful and dilutes recent patterns. Modern retraining frequently uses **fine-tuning** (updating existing weights with recent data) or a **sliding window** (training on only the past 60 to 90 days)."
        },
        {
          w: "Retraining should be completely automated to push new models to production without human review.",
          r: "While automated retraining pipelines are standard, promoting a retrained model directly to 100% production traffic without guardrails is dangerous. Robust systems require automated shadow evaluation or human sign-off on major metric reports."
        },
        {
          w: "A newly retrained model is always superior to the older production model.",
          r: "Newly retrained models can suffer from data poisoning, feedback loops, overfitting to temporary anomalies, or regression on rare edge cases. A newly retrained model must prove superiority over the existing champion before promotion."
        },
        {
          w: "Retraining is the only solution when a model's accuracy drops in production.",
          r: "Accuracy drops are frequently caused by upstream data pipeline bugs (e.g., a software release broke the currency feature or changed a timestamp format). Retraining a model on corrupted upstream features permanently bakes the bug into the model weights."
        }
      ],

      trade: {
        buys: [
          "Maintains peak model accuracy in non-stationary, evolving business environments (e-commerce, fraud, pricing).",
          "Automates operational maintenance: eliminates manual, high-stress retraining fire drills for data science teams.",
          "Enables rapid adaptation to emerging trends, competitor actions, and consumer behavioral shifts.",
          "Establishes a standardized, reproducible CI/CD/CT pipeline that accelerates machine learning deployment velocity."
        ],
        costs: [
          "High cloud compute costs: frequent retraining of large deep learning architectures consumes significant GPU hours.",
          "Risk of silent regressions: newly trained models can fail on rare but mission-critical business edge cases.",
          "Label acquisition latency: requires building robust pipelines to collect, clean, and join delayed ground-truth labels.",
          "Validation pipeline complexity: requires rigorous multi-stage testing to prevent deployment of degraded models."
        ],
        avoid: [
          "Never retrain a model on fresh data without investigating whether performance drops were caused by upstream data bugs.",
          "Do not auto-deploy retrained models without automated champion-vs-challenger evaluation gates.",
          "Avoid retraining on excessively short temporal windows that overfit to temporary holiday noise."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "training-serving-skew",

      why: {
        before: "Data scientists engineered complex features using Python/Pandas in offline notebooks, while production software engineers re-implemented those same features in Java/C++ for low-latency live serving, resulting in subtle mathematical discrepancies.",
        problem: "A machine learning model evaluated with 98% accuracy in research fails completely in production because the mathematical definition of a feature during live inference diverges from how it was calculated during training.",
        shift: "**Training-Serving Skew: A critical failure mode where a discrepancy exists between the performance, code, or data distribution during the training phase versus the live production serving phase.** Remedied by unified feature stores (Feast, Hopsworks), shared transformation pipelines, and strict schema contracts."
      },

      num: {
        t: "Root Causes of Training-Serving Skew & Architectural Mitigations",
        h: ["Skew Mechanism", "Physical / Engineering Cause", "Production Symptom", "Architectural Mitigation", "Severity"],
        r: [
          ["Code Discrepancy", "Features calculated in Pandas during training; re-written in Java/Go for production", "Subtle numerical/rounding divergence across implementations", "Shared single-source feature definitions / Feature Store", "Catastrophic (silent failure)"],
          ["Data Leakage (Lookahead)", "Training data included future information unavailable at inference time", "99% training accuracy; near 0% real-world accuracy", "Point-in-Time correct feature joins (AS-OF joins)", "Fatal (invalidates model)"],
          ["Time-Lag Skew", "Live inference uses stale cached features; training used fresh historical ground truth", "Degraded real-time prediction confidence", "Low-latency streaming feature stores (Redis/Feast)", "High"],
          ["Payload Schema Shift", "Client application sends integer `1/0` instead of boolean `True/False`", "Inference server crashes or casts feature to wrong value", "Strict Model Signatures / Pydantic schema validation", "High (crashes / bad predictions)"]
        ],
        n: "Training-Serving Skew occurs when the input distribution seen by the model during training $\\mathcal{D}_{\\text{train}}$ diverges systematically from the live inference distribution $\\mathcal{D}_{\\text{serve}}$. The most subtle cause is **Data Leakage via Point-in-Time Violations**: when calculating historical features for a transaction at $T_0$, an analytics query accidentally aggregates data from $T_0 + 2\\text{ hours}$, exposing future information that could never exist during live inference. The industry standard solution is a **Centralized Feature Store** (e.g., Feast). A feature store guarantees that the exact same transformation code is used for both **Offline Storage** (Parquet/Snowflake for batch training with point-in-time time travel) and **Online Storage** (Redis/DynamoDB for sub-10ms key-value live serving)."
      },

      miss: [
        {
          w: "Training-serving skew is simply another name for data drift.",
          r: "Data drift is caused by external real-world behavioral shifts over time. **Training-serving skew** is an internal engineering defect caused by bugs, code implementation discrepancies, or lookahead data leakage in feature calculation pipelines."
        },
        {
          w: "If a model passes all unit tests, training-serving skew is impossible.",
          r: "Unit tests rarely catch training-serving skew. A feature function can pass unit tests while introducing point-in-time leakage or subtle differences in time zone handling (UTC vs local time) that distort production features."
        },
        {
          w: "Re-implementing Python features in C++ for low latency is standard and safe.",
          r: "Dual-codebase feature engineering is the primary cause of training-serving skew in enterprises. Modern architectures use unified runtimes (e.g., compiling transformations into ONNX graphs, SQL, or sharing Rust/Python bindings) to guarantee 100% mathematical parity."
        },
        {
          w: "Logging model inputs at inference time is unnecessary if you have the production database.",
          r: "Reconstructing live feature values from production database records after the fact is nearly impossible due to asynchronous database updates. Production serving must log the **exact feature vector payload** seen by the model at the millisecond of inference."
        }
      ],

      trade: {
        buys: [
          "Guarantees that high offline training accuracy translates reliably into high real-world business accuracy.",
          "Feature stores unify data engineering, data science, and production serving into a single shared codebase.",
          "Point-in-time correct joins eliminate catastrophic lookahead data leakage in temporal machine learning.",
          "Accelerates deployment velocity by eliminating the need to rewrite Python features into Java or C++ for production."
        ],
        costs: [
          "Infrastructure complexity: implementing and managing an enterprise feature store (Feast, Hopsworks) requires dedicated systems.",
          "Dual storage overhead: feature stores synchronize an offline historical warehouse (Snowflake) with an online key-value cache (Redis).",
          "Latency trade-offs: complex online feature transformations can add milliseconds to real-time inference latency budgets.",
          "Engineering discipline: requires strict adherence to centralized feature definitions across all analytics teams."
        ],
        avoid: [
          "Never calculate features for live inference using a different programming language or codebase than training.",
          "Do not compute historical training features without enforcing strict point-in-time (AS-OF) join constraints.",
          "Avoid deploying production models without logging the exact raw feature vectors received at the inference endpoint."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "shadow-deployment",

      why: {
        before: "Deploying a newly trained machine learning model required cutting over live user traffic immediately, risking application crashes, extreme latency spikes, or disastrous business revenue loss if the new model behaved unexpectedly.",
        problem: "Simulated validation on historical test sets cannot fully replicate the chaotic reality of live production traffic (unexpected payloads, network spikes, edge-case user inputs); teams need a way to test models on real traffic with zero risk.",
        shift: "**Shadow Deployment (Dark Launch): A deployment pattern where live incoming production requests are duplicated and routed to a new candidate model (shadow) in parallel with the active production model (champion), without returning the shadow model's predictions to users.** The safest deployment strategy in modern MLOps."
      },

      num: {
        t: "Production Deployment Patterns: Risk, Traffic Allocation & Failure Blast Radius",
        h: ["Deployment Strategy", "User Impact Risk", "Traffic Routing Mechanism", "Downstream User Prediction", "Failure Blast Radius"],
        r: [
          ["Direct Cutover (Recreate)", "Extreme (high risk of downtime)", "100% instant DNS/load balancer swap", "New model immediately", "100% of live users impacted"],
          ["Canary Deployment", "Low to Medium", "Progressive traffic shift (e.g. 2% $\\rightarrow$ 10% $\\rightarrow$ 100%)", "New model for canary traffic slice", "Isolated to small canary user percentage"],
          ["Shadow Deployment (Dark Launch)", "Zero User Risk", "Asynchronous traffic mirroring (100% duplicated)", "Always active champion model", "Zero (shadow predictions discarded/logged)"],
          ["A/B Testing", "Controlled Business Risk", "Deterministic split (50/50) based on user ID", "Split between Model A and Model B", "50% of users see new model variant"],
          ["Blue-Green Deployment", "Moderate (instant switch)", "Two identical production environments swapped", "Active environment only", "Rollback requires instant traffic revert"]
        ],
        n: "In a Shadow Deployment architecture, an API Gateway or Service Mesh (such as Envoy or Istio) receives a live client request: $q$. The gateway forwards $q$ synchronously to the active **Champion Model** container, which computes prediction $\\hat{y}_{\\text{champ}}$ and returns it immediately to the client to satisfy the latency SLA. Simultaneously, the gateway **asynchronously mirrors (shadows)** the identical payload $q$ to the candidate **Challenger Model** container: $q \\xrightarrow{\\text{mirror}} M_{\\text{challenger}}$. The challenger computes prediction $\\hat{y}_{\\text{challenger}}$, which is logged alongside $\\hat{y}_{\\text{champ}}$ in an observability store (Kafka/S3). Crucially, the shadow model's prediction is completely ignored by the client application, guaranteeing that unexpected crashes, memory leaks, or bizarre predictions have **zero blast radius** on live user experience."
      },

      miss: [
        {
          w: "Shadow deployment is the same thing as A/B testing.",
          r: "A/B testing exposes real users to the new model's predictions to measure business conversion impact. **Shadow deployment never exposes predictions to users**; it runs silently in the background solely to evaluate technical stability, latency, and predictive distributions on live data."
        },
        {
          w: "Shadowing traffic doubles the latency experienced by real users.",
          r: "Production traffic shadowing is executed **asynchronously** via non-blocking fire-and-forget network mirrors (Envoy/Istio). The user response is returned as soon as the active champion model finishes, with zero waiting for the shadow model."
        },
        {
          w: "Shadow deployment can measure business metric lift (like revenue or click-through rate).",
          r: "Because shadow predictions are never seen by users, they cannot drive user behavior. Measuring business metric lift requires **A/B Testing** or **Interleaving**; shadow deployment measures technical latency, error rates, and output distribution divergence."
        },
        {
          w: "Shadow deployment requires zero additional infrastructure cost.",
          r: "Shadowing duplicates live inference workloads, requiring you to provision and pay for a second set of inference servers (often doubling GPU/CPU infrastructure compute costs for the duration of the test)."
        }
      ],

      trade: {
        buys: [
          "Zero user-facing risk: test candidate models on real, unpredictable production traffic without impacting a single user.",
          "Real-world latency validation: measures true $P_{99}$ latency, GPU utilization, and memory stability under live traffic loads.",
          "Output distribution auditing: compare shadow predictions against champion predictions on identical live payloads.",
          "Stress-tests infrastructure: validates that the new model container handles unexpected live JSON malformations gracefully."
        ],
        costs: [
          "Doubled compute cost: running shadow inference in parallel doubles infrastructure resource consumption.",
          "Network bandwidth consumption: duplicating every incoming request across internal service meshes increases internal network load.",
          "Cannot evaluate business impact: cannot determine if the new model actually improves customer conversion or revenue.",
          "State management hazards: if the shadow model triggers stateful downstream side-effects (e.g., database writes), it can corrupt operational data."
        ],
        avoid: [
          "Never allow a shadow model container to execute stateful side-effects (e.g., charging credit cards or writing to DBs).",
          "Do not run synchronous traffic mirroring that forces live users to wait for the slower shadow model to finish.",
          "Avoid running shadow deployments indefinitely; establish a strict time window (e.g., 48 hours) to validate stability."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "a-b-testing",

      why: {
        before: "Organizations rolled out new machine learning models across all users simultaneously, unable to scientifically isolate whether an increase in sales was driven by the new model or by external seasonal factors (like a holiday or marketing campaign).",
        problem: "Offline validation accuracy (ROC-AUC, RMSE) frequently fails to translate into real-world business success; companies need a mathematically sound, randomized experimental method to measure causal business impact.",
        shift: "**A/B Testing (Online Controlled Experimentation): A scientific methodology where two or more variants (Model A vs Model B) are served concurrently to statistically randomized, isolated user cohorts to measure causal impact on business metrics.** Governed by null hypothesis significance testing (t-tests, z-tests)."
      },

      num: {
        t: "A/B Testing Statistical Parameters, Sample Sizing & Decision Rules",
        h: ["Parameter / Concept", "Statistical Definition", "Standard Industry Value", "Operational Purpose", "Failure Mode if Ignored"],
        r: [
          ["Statistical Power ($1 - \\beta$)", "Probability of detecting a true effect when it exists", "0.80 (80%)", "Ensures experiment has sufficient sample size to find real gains", "Type II error (false negative: killing a great model)"],
          ["Significance Level ($\\alpha$)", "Probability of rejecting the null hypothesis when true", "0.05 (5%)", "Upper bound on accepting random noise as real lift", "Type I error (false positive: shipping a placebo model)"],
          ["Minimum Detectable Effect (MDE)", "Smallest relative metric lift worth detecting", "1% – 3% relative lift", "Determines required duration and sample size", "Experiment runs indefinitely without statistical significance"],
          ["Sample Size Calculation", "$N = \\frac{2(Z_{\\alpha/2} + Z_\\beta)^2 \\sigma^2}{\\delta^2}$", "Calculated prior to test", "Prevents premature stopping (peeking problem)", "False discoveries due to continuous p-value peeking"]
        ],
        n: "A/B testing is the ultimate gold standard for measuring causal lift. The system establishes a **Null Hypothesis** ($H_0: \\mu_B = \\mu_A$) asserting that the new Model B produces no change in the business metric (e.g., click-through rate, conversion rate, revenue per user). Users are deterministically and consistently assigned to variants using consistent hashing: $\\text{Variant} = h(\\text{user\\_id}) \\pmod 2$. When the target sample size $N$ is reached, statistical hypothesis tests (such as a two-sample Welch's t-test) calculate the **$p$-value**—the probability of observing the measured metric divergence under $H_0$. If $p < \\alpha$ (typically $0.05$), $H_0$ is rejected, concluding with 95% confidence that Model B drove a statistically significant causal improvement."
      },

      miss: [
        {
          w: "A/B testing can be evaluated daily, stopping the test as soon as the $p$-value drops below 0.05.",
          r: "This is the classic **Peeking Problem (P-Hacking)**. Continuously checking p-values and stopping early inflates false-positive rates from 5% to over 30%. The sample size $N$ must be predetermined upfront via power analysis, and evaluated ONLY after reaching $N$ (or adjusted using sequential testing methods like mSPRT)."
        },
        {
          w: "A higher validation ROC-AUC in the offline notebook guarantees that Model B will win the A/B test.",
          r: "Offline metrics often diverge from online behavior. A model optimized for raw click-through rate may recommend sensationalist clickbait that increases immediate clicks but triggers high user churn, causing long-term business revenue to drop in an online A/B test."
        },
        {
          w: "Assigning users randomly on every individual request is valid for A/B testing.",
          r: "Random request assignment confuses users and contaminates experiments: a user sees Model A recommendations at 10:00 AM and Model B recommendations at 10:05 AM. Users must be consistently hashed by `user_id` to ensure a consistent experience throughout the experiment."
        },
        {
          w: "A/B testing requires an exact 50/50 traffic split between models.",
          r: "While 50/50 maximizes statistical power, high-risk models can start with a 95/5 or 90/10 split to minimize business exposure, gradually ramping up traffic as confidence in stability grows."
        }
      ],

      trade: {
        buys: [
          "The definitive scientific proof of causal business impact: proves definitively whether an ML model increases revenue.",
          "Eliminates internal political debates: replaces subjective executive opinions with rigorous empirical data.",
          "Protects against regressions: prevents shipping models that score high on paper but harm real customer experience.",
          "Enables continuous iterative optimization: establishes a measurable baseline for incremental algorithmic improvements."
        ],
        costs: [
          "Experimentation latency: requires running tests for weeks to gather sufficient sample size and capture weekly seasonality.",
          "Infrastructure complexity: requires deterministic routing proxies, experimentation feature flags, and metrics telemetry pipelines.",
          "Opportunity cost: 50% of users are served the inferior model for the duration of the experimental test.",
          "Network effects contamination: in two-sided marketplaces (Uber, Airbnb), treatment and control users interact, violating SUTVA assumptions."
        ],
        avoid: [
          "Never stop an A/B test early simply because the p-value momentarily crossed 0.05; run to the predetermined sample size.",
          "Do not run A/B tests for less than one full week to ensure natural weekend behavioral cycles are captured.",
          "Avoid testing multiple simultaneous variants without applying false-discovery rate corrections (Bonferroni correction)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "champion-challenger",

      why: {
        before: "Upgrading production machine learning systems was an all-or-nothing gamble where teams replaced the incumbent model with a new model overnight, leaving no automated framework to continuously pit new experimental models against the active standard.",
        problem: "Static machine learning deployments grow stale; organizations need a structured tournament framework to continuously test, benchmark, and promote candidate models against the reigning production champion.",
        shift: "**Champion-Challenger: An operational deployment architecture where an incumbent 'Champion' model serves the majority of production traffic while one or more 'Challenger' models are evaluated concurrently against live data to determine if they should dethrone the champion.** The foundational operational paradigm for continuous model evolution."
      },

      num: {
        t: "Champion-Challenger Operational Workflow: Stages, Routing & Promotion Criteria",
        h: ["Tournament Phase", "Traffic Allocation", "User Visibility", "Evaluation Metric", "Exit / Promotion Action"],
        r: [
          ["Phase 1: Shadow Tournament", "Champion: 100% | Challenger: 100% (mirrored)", "Challenger invisible to users", "Latency, error rate, distribution drift", "Passes to Phase 2 if latency and errors acceptable"],
          ["Phase 2: Canary / Pilot Split", "Champion: 90% | Challenger: 10%", "Challenger served to 10% of users", "Short-term error rates, user complaints", "Ramps to Phase 3 if no user regressions detected"],
          ["Phase 3: Formal A/B Contest", "Champion: 50% | Challenger: 50%", "Full split across user cohorts", "Core business conversion KPIs & accuracy", "Challenger promoted to Champion if $p < 0.05$ with positive lift"],
          ["Phase 4: Dethroning & Rollback", "Challenger: 100% | Old Champion: Retired", "Challenger becomes the new Champion", "Ongoing production monitoring", "Old champion archived; immediately available for instant rollback"]
        ],
        n: "Champion-Challenger formalizes continuous tournament-style evaluation in production MLOps. In modern Model Registries (such as MLflow or Databricks Unity Catalog), models are tagged with dynamic stage aliases: **`@champion`** (the active production baseline) and **`@challenger`** (the candidate model under evaluation). The routing layer (Envoy, Kong, or custom API gateways) reads these registry aliases dynamically. Traffic routing can follow fixed percentages (e.g., 90% Champion, 10% Challenger) or use **Multi-Armed Bandits (MAB)** (such as Thompson Sampling or Upper Confidence Bound), which dynamically shift traffic towards whichever model demonstrates superior real-time reward, minimizing the business regret of serving an underperforming model during the evaluation period."
      },

      miss: [
        {
          w: "Champion-Challenger is strictly identical to basic A/B testing.",
          r: "A/B testing is a temporary statistical experiment. Champion-Challenger is a **permanent operational tournament architecture**: the incumbent champion permanently defends its status against a continuous conveyor belt of incoming challenger models trained on newer data."
        },
        {
          w: "A challenger model that wins on accuracy should be promoted to champion immediately.",
          r: "Accuracy is only one production dimension. If a challenger model achieves 1% higher accuracy but takes $5\\times$ more memory, incurs $4\\times$ higher latency, or costs $10\\times$ more in GPU cloud compute, it may fail overall production criteria."
        },
        {
          w: "There can only be one single challenger model at a time.",
          r: "A robust Champion-Challenger platform can evaluate multiple challenger models simultaneously (e.g., Champion: 70%, Challenger A: 10%, Challenger B: 10%, Challenger C: 10%), testing diverse feature engineering sets or architectures concurrently."
        },
        {
          w: "Dethroning the champion requires re-deploying production Kubernetes pods.",
          r: "In mature MLOps platforms, promoting a challenger to champion is a simple metadata pointer swap in the Model Registry. The routing layer detects the alias transition and shifts traffic instantly with zero container rebuilds or downtime."
        }
      ],

      trade: {
        buys: [
          "Continuous improvement framework: ensures production machine learning systems are continually tested and upgraded.",
          "Minimizes business risk: candidate models must prove statistical superiority in production before receiving full traffic.",
          "Instantaneous rollback capability: the old champion remains warm and available for instant reversion if issues emerge.",
          "Multi-Armed Bandit integration minimizes user regret by dynamically routing traffic to the winning model."
        ],
        costs: [
          "Infrastructure overhead: running concurrent champion and challenger serving containers increases cloud resource costs.",
          "Routing complexity: requires an intelligent routing proxy capable of deterministic user hashing and telemetry logging.",
          "Telemetry fragmentation: pairing outcomes with multiple competing models complicates downstream business attribution pipelines.",
          "Governance overhead: requires maintaining formal criteria and review processes for model dethroning."
        ],
        avoid: [
          "Never dethrone an active champion model without verifying that the challenger satisfies the latency budget.",
          "Do not discard the old champion container immediately after promoting a challenger; keep it warm for rapid rollback.",
          "Avoid routing users randomly between champion and challenger on every page refresh; enforce consistent session affinity."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
