/* ==========================================================================
   Depth pass 98 — MLOps batch 1: Lifecycle, Tracking & Model Registries.
   MLOps, Model Deployment, Model Serving, Model Registry,
   Experiment Tracking, MLflow, Model Versioning, Reproducibility.

   Continuous integration and continuous deployment paradigms bridge experimental notebooks to production pipelines;
   immutable artifact hashes link code commits to serialized weights and hyperparameters.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "mlops",

      why: {
        before: "Machine learning was treated as an isolated research activity where data scientists trained models inside bespoke Jupyter notebooks, emailing serialized pickle files to software engineers who struggled to rewrite them for production.",
        problem: "Over 80% of enterprise ML models never reached production, while those that did degraded silently over time, failed under live traffic spikes, and lacked monitoring, versioning, and automated retraining.",
        shift: "**MLOps (Machine Learning Operations): The engineering discipline combining Machine Learning, DevOps, and Data Engineering to standardize and automate the continuous development, deployment, monitoring, and governance of production ML systems.** Brings CI/CD/CT (Continuous Training) to the entire model lifecycle."
      },

      num: {
        t: "MLOps Maturity Levels (Google Cloud MLOps Framework)",
        h: ["Maturity Level", "Training Pipeline", "Deployment Pipeline", "Monitoring & Retraining", "Engineering Reality"],
        r: [
          ["Level 0: Manual Process", "Manual script / Jupyter notebook", "Manual container build / script handoff", "None (silent model degradation)", "Bespoke scripts, zero automation, brittle releases"],
          ["Level 1: ML Pipeline Automation", "Automated orchestration (Kubeflow, Airflow)", "Automated model artifact deployment", "Continuous automated retraining on new data triggers", "Data validation, feature stores, automated pipeline triggers"],
          ["Level 2: CI/CD Pipeline Automation", "Automated multi-stage testing (unit, data, model)", "Automated progressive canary/shadow deployments", "Full closed-loop observability with automated rollback", "Rapid iteration, automated testing of code and data pipelines"]
        ],
        n: "MLOps extends traditional DevOps by managing **three interconnected dimensions: Code, Data, and Models**. While traditional software engineering versions and tests code alone ($C$), machine learning behavior is a joint function of code, training data distribution, and hyperparameter configurations: $M = f(C, D, \\Theta)$. MLOps establishes automated feedback loops: (1) **Continuous Integration (CI)**: Validates code, tests data schemas, and runs unit tests on model architectures. (2) **Continuous Delivery (CD)**: Automatically tests model artifacts on validation canary slices, validates latency budgets, and deploys to containerized inference clusters. (3) **Continuous Training (CT)**: Monitors live inference traffic for data drift and automatically triggers pipeline retraining when model performance degrades."
      },

      miss: [
        {
          w: "MLOps is simply DevOps with a different name.",
          r: "DevOps manages code and infrastructure where system behavior is deterministic. MLOps manages code, data, and models. Code can remain unchanged while an ML system fails completely due to unseen distribution drift in live input data."
        },
        {
          w: "MLOps means buying an all-in-one SaaS platform that does everything.",
          r: "No single platform solves MLOps end-to-end. Production MLOps is an architectural practice composed of modular best-of-breed components: Feast (features), MLflow (registry), Airflow/Kubeflow (orchestration), Triton (serving), and Evidently (monitoring)."
        },
        {
          w: "Deploying a model's REST API endpoint marks the completion of the MLOps lifecycle.",
          r: "Deployment is merely the *beginning* of production MLOps. Post-deployment monitoring, drift detection, data quality auditing, canary traffic shifting, latency profiling, and automated retraining loops constitute over 70% of operational MLOps effort."
        },
        {
          w: "Data scientists should be responsible for building full Kubernetes deployment infrastructure.",
          r: "MLOps builds self-service abstraction platforms that allow data scientists to package and deploy models without manually writing low-level Kubernetes YAML, ingress networking, or CUDA drivers."
        }
      ],

      trade: {
        buys: [
          "Drastically reduces time-to-market: shortens model deployment cycles from months of manual recoding to minutes of automated CI/CD.",
          "Eliminates silent model decay: automated monitoring detects drift and triggers retraining before business revenue is impacted.",
          "Guarantees compliance and auditability: full provenance links live production predictions back to exact code commits and training data.",
          "High operational reliability: containerized auto-scaling inference servers maintain strict SLAs under volatile traffic."
        ],
        costs: [
          "Significant architectural complexity: requires managing feature stores, registries, pipeline orchestrators, and inference clusters.",
          "High cloud compute overhead: continuous retraining pipelines and GPU inference endpoints incur substantial monthly cloud costs.",
          "Cultural and organizational friction: requires deep collaboration between data scientists, ML engineers, and DevOps teams.",
          "Tooling fragmentation: rapid evolution in the MLOps open-source ecosystem requires frequent framework upgrades."
        ],
        avoid: [
          "Never deploy raw serialized pickle files (`model.pkl`) to production without automated CI/CD verification and containerization.",
          "Do not implement continuous automated retraining without automated data quality and model evaluation circuit breakers.",
          "Avoid building custom in-house MLOps platforms from scratch when standard open-source tools (MLflow, Triton) exist."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-deployment",

      why: {
        before: "Machine learning models remained trapped in research sandboxes; deploying a model meant manually copy-pasting Python scoring code into existing monolithic web backend servers, risking server crashes and memory leaks.",
        problem: "Production applications require high availability, isolation, horizontal auto-scaling, zero-downtime rolling updates, and sub-second latency, which ad-hoc Python execution environments cannot provide.",
        shift: "**Model Deployment: The operational process of integrating a validated machine learning model into a production environment where it can reliably serve inference predictions to end users or downstream services.** Progressed from embedded libraries to microservice containers (Docker/Kubernetes), serverless functions, and edge on-device runtimes."
      },

      num: {
        t: "Model Deployment Paradigms: Latency, Cost & Architectural Trade-offs",
        h: ["Deployment Paradigm", "Architecture / Runtime", "Target Latency", "Cost Profile", "Concurrency & Scaling"],
        r: [
          ["Real-Time Microservice", "Docker container on K8s (FastAPI / Triton)", "Sub-50 ms", "High (dedicated always-on instances)", "Horizontal Pod Autoscaling (HPA) via requests/sec"],
          ["Serverless Function", "AWS Lambda / Google Cloud Functions", "100 ms – 1s (cold start penalty)", "Low (pay strictly per inference request)", "Instant auto-scaling; limited by memory/timeout limits"],
          ["Batch / Offline Scoring", "Scheduled Spark / Ray / Python jobs", "Hours (non-interactive)", "Very Low (ephemeral spot instances)", "Massive parallel batch throughput over billions of rows"],
          ["Embedded / Edge Runtime", "ONNX Runtime / TFLite on device", "< 5 ms (zero network round-trip)", "Zero cloud compute cost", "Constrained by mobile/device battery, CPU, and RAM"],
          ["Streaming Inference", "Flink / Kafka consumer reading event stream", "Sub-100 ms continuous", "Medium (always-on stream worker nodes)", "Scales with topic partition count"]
        ],
        n: "Model deployment formalizes the bridge between artifact compilation and operational runtime. In modern containerized microservice deployments, the serialized model weights (ONNX, TensorRT, TorchScript) are packaged into a standardized **Docker container** running an optimized inference server. Kubernetes manages the deployment lifecycle via **Deployment manifests** specifying resource requests (`nvidia.com/gpu: 1`), health probes (`livenessProbe`, `readinessProbe`), and **Horizontal Pod Autoscalers (HPA)** that scale replica counts dynamically based on incoming request rate or GPU compute saturation. Safe production rollout employs **Canary Deployments**: routing 2% of live traffic to the new model container version, monitoring error rates and latency, and incrementally advancing traffic to 100% via service mesh routing (Istio)."
      },

      miss: [
        {
          w: "Wrapping a model in a basic Flask API script is production-ready model deployment.",
          r: "Basic Flask scripts use single-threaded development servers that block on concurrent requests, lack GPU batching, fail under high traffic, and offer zero auto-scaling, metrics instrumentation, or health checks. Production requires dedicated inference servers (Triton, TorchServe) or async ASGI frameworks (FastAPI + Gunicorn/Uvicorn)."
        },
        {
          w: "Every machine learning model should be deployed as a real-time REST API.",
          r: "Over 70% of business ML use cases (e.g., customer churn scores, recommendation feeds, credit risk ratings) are better served via **Batch Inference**, which pre-computes predictions nightly at a fraction of the cost of running 24/7 real-time endpoints."
        },
        {
          w: "Model deployment is purely an infrastructure task that data scientists can ignore.",
          r: "Model deployment requires input payload schema validation, feature transformation parity, error handling for corrupted inputs, and business fallback logic—concerns that demand direct data science involvement."
        },
        {
          w: "Once a model container is deployed, its performance will remain constant indefinitely.",
          r: "Real-world inputs shift continuously over time. Even if the container infrastructure remains 100% healthy, the model's predictive accuracy will silently degrade due to data and concept drift."
        }
      ],

      trade: {
        buys: [
          "Transforms theoretical algorithms into actionable, high-value business prediction services.",
          "Containerization ensures 100% environmental parity between staging and production runtimes.",
          "Dynamic auto-scaling accommodates massive traffic spikes without manual infrastructure provisioning.",
          "Progressive rollout strategies (canary, blue-green) eliminate user-facing downtime during model upgrades."
        ],
        costs: [
          "Infrastructure expenses: always-on real-time GPU/CPU endpoints generate significant recurring cloud bills.",
          "Operational complexity: requires configuring Kubernetes clusters, service meshes, ingress routes, and monitoring.",
          "Cold start latency: serverless deployment architectures suffer from multi-second startup delays on cold boots.",
          "Security vulnerability: exposing inference APIs requires authentication, rate-limiting, and payload sanitization."
        ],
        avoid: [
          "Never deploy models using single-threaded Flask development servers in production environments.",
          "Do not roll out model updates with instant 100% traffic cutovers; always use progressive canary or shadow deployments.",
          "Avoid deploying real-time API endpoints when batch offline scoring fully satisfies business requirements."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-serving",

      why: {
        before: "Serving predictions required running standard Python web frameworks (Flask, Django) that executed Python's Global Interpreter Lock (GIL), resulting in serialized request execution, poor hardware utilization, and high latency under concurrent load.",
        problem: "Deep learning models require hardware acceleration (GPUs, TPUs), dynamic request batching, concurrent worker execution, and optimized tensor runtimes (TensorRT, ONNX) that generic web servers cannot manage.",
        shift: "**Model Serving: The specialized software runtime and infrastructure responsible for loading serialized model artifacts into memory, accepting inference queries, optimizing hardware execution, and returning predictions with minimal latency.** Led by purpose-built inference engines: NVIDIA Triton, TorchServe, TF Serving, and vLLM."
      },

      num: {
        t: "Inference Server Capabilities & Performance Profiles on Deep Learning Models",
        h: ["Serving Engine", "Primary Focus", "Dynamic Batching?", "Multi-Model Concurrency?", "Inference Speedup vs Raw Python"],
        r: [
          ["FastAPI + PyTorch (Baseline)", "Simple custom Python REST API", "Manual implementation required", "Limited by Python GIL", "Baseline ($1\\times$)"],
          ["TorchServe (AWS / PyTorch)", "Native PyTorch models", "Yes (configurable timeout & max batch)", "Yes (multi-worker routing)", "$2\\times$ to $4\\times$"],
          ["TF Serving (Google)", "TensorFlow SavedModel graphs", "Yes (high-throughput queuing)", "Yes (versioned model polling)", "$3\\times$ to $5\\times$ (C++ engine)"],
          ["NVIDIA Triton Inference Server", "Universal (PyTorch, ONNX, TensorRT, TF)", "Yes (dynamic microsecond batching)", "Yes (concurrent model execution per GPU)", "$5\\times$ to $12\\times$ (TensorRT backend)"],
          ["vLLM / TGI", "Large Language Models (LLMs)", "Continuous PagedAttention batching", "Multi-LoRA serving", "$10\\times$ to $25\\times$ throughput on LLMs"]
        ],
        n: "Specialized model serving engines achieve extreme throughput and low latency via three foundational low-level architectural optimizations: (1) **Dynamic Batching**: The server intercepts individual client requests arriving within a microsecond window (e.g., $5$ ms), concatenates them into a single parallel tensor batch $\\mathbf{X} \\in \\mathbb{R}^{B \\times D}$, executes a single forward pass on the GPU, and demultiplexes predictions back to individual HTTP/gRPC streams, saturating GPU Tensor Cores. (2) **Concurrent Model Execution**: Multiple instances of the same model (or different models in an ensemble pipeline) run concurrently on a single physical GPU across isolated CUDA streams. (3) **Zero-Copy Memory Transfers**: gRPC interfaces leverage shared host memory (`shm`), avoiding expensive serialization roundtrips between CPU host memory and GPU VRAM."
      },

      miss: [
        {
          w: "Model serving is just another name for running a web server.",
          r: "Standard web servers handle static file hosting and business logic routing. Model serving engines manage GPU memory allocation, dynamic request batching, model pipeline ensembles, tensor compilation, and hardware-accelerated vector operations."
        },
        {
          w: "Individual real-time requests must be processed one at a time to achieve minimum latency.",
          r: "Processing queries one-by-one underutilizes modern GPU parallel architectures (often $<10\\%$ GPU compute utilization). **Dynamic Batching** adds a negligible queue wait ($< 2$ ms) while multiplying overall system request throughput by $5\\times$ to $10\\times$."
        },
        {
          w: "REST / HTTP JSON is the optimal transport protocol for high-throughput model serving.",
          r: "Serializing and parsing high-dimensional numerical float tensors into JSON text strings is computationally brutal on CPU. High-performance model serving mandates **gRPC with Protocol Buffers** or shared-memory IPC, which transfers raw binary byte buffers."
        },
        {
          w: "A model serving engine can only host one single model at a time per server.",
          r: "Modern serving frameworks (Triton) can host dozens of distinct models across diverse frameworks (e.g., a lightweight ONNX tabular model alongside a heavy PyTorch transformer) concurrently on the same server, routing requests dynamically."
        }
      ],

      trade: {
        buys: [
          "Maximizes hardware ROI: dynamic batching saturates GPU compute cores, driving throughput up by $5\\times$ to $10\\times$.",
          "Sub-millisecond runtime overhead: C++ backends bypass the Python GIL and eliminate serialization bottlenecks.",
          "High operational flexibility: universal servers (Triton) serve PyTorch, ONNX, TensorRT, and custom C++ pipelines side-by-side.",
          "Native ensemble support: chains preprocessing, inference, and postprocessing pipelines without intermediate network hops."
        ],
        costs: [
          "Steep operational learning curve: configuring model repositories, config.pbtxt files, and CUDA memory fractions is complex.",
          "Dynamic batching adds slight tail latency ($P_{99}$) for individual isolated requests during low-traffic periods.",
          "High memory footprint: serving multiple deep models concurrently requires substantial GPU VRAM.",
          "Debugging complexity: diagnosing crashes inside compiled C++ inference runtimes requires specialized profilers (Nsight)."
        ],
        avoid: [
          "Never transmit large numerical tensors over public networks using uncompressed JSON strings; use gRPC or FlatBuffers.",
          "Do not deploy deep learning models to production without enabling dynamic batching in the inference engine.",
          "Avoid running heavy model serving runtimes inside resource-constrained environments without tuning memory limits."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-registry",

      why: {
        before: "Teams tracked trained machine learning models by saving pickle files on local hard drives or shared network drives with ad-hoc filenames like `model_v2_final_really_final.pkl`, with no record of who trained it, what data was used, or whether it passed validation.",
        problem: "Engineers unknowingly deployed untested experimental models to production, overwrote active production weights, and could not roll back to previous stable versions when production incidents occurred.",
        shift: "**Model Registry: A centralized, governed repository for storing, versioning, reviewing, and promoting machine learning model artifacts throughout their lifecycle from experimentation to production.** Popularized by MLflow Model Registry, AWS SageMaker Model Registry, and Databricks Unity Catalog."
      },

      num: {
        t: "Model Registry Lifecycle Stages, Governance Rules & Metadata Tracking",
        h: ["Lifecycle Stage", "Access Permissions", "Validation Requirements", "Artifact Immutability", "Automated Actions"],
        r: [
          ["None / Experimental", "Data Scientists (Read/Write)", "Logs training metrics, params, and weights", "Mutable / Transient", "Created automatically by training run"],
          ["Staging", "ML Engineers / Reviewers", "Automated integration tests, latency benchmarking, data contract check", "Immutable", "Deploys automatically to staging canary cluster"],
          ["Production", "Production Service Accounts (Read-Only)", "Manual/Automated approval gate, business KPI sign-off", "Strictly Immutable & Encrypted", "Triggers zero-downtime rolling production deployment"],
          ["Archived", "Auditors / Data Stewards", "Historical retention for compliance", "Permanent Read-Only", "Deregistered from live traffic routes"]
        ],
        n: "A Model Registry acts as the definitive source of truth for deployable model artifacts. It models the entity relationship: $\\text{Registered Model} \\xrightarrow{\\text{contains}} [\\text{Model Versions}]$. Each model version records: (1) **Artifact URI**: Pointer to the immutable serialized model weights stored in cloud object storage (S3/GCS). (2) **Lineage Metadata**: Exact Git commit hash, training run ID, author, training dataset version/hash, and hyperparameter configuration. (3) **Lifecycle State**: Stage tags (`Staging`, `Production`, `Archived`) or alias pointers (`@champion`, `@challenger`). (4) **Model Signature**: Formal input and output schema specifications enforcing data types and tensor shapes, preventing downstream serving engines from crashing on malformed payloads."
      },

      miss: [
        {
          w: "A model registry is just an S3 bucket or Google Cloud Storage folder.",
          r: "An S3 bucket is raw object storage with no governance, schema validation, approval workflows, or versioning semantics. A model registry wraps storage with lifecycle transitions, access controls, automated webhooks, and lineage tracking."
        },
        {
          w: "Experiment tracking and model registry are the exact same thing.",
          r: "Experiment tracking records hundreds of chaotic trial runs during research (hyperparameters, loss curves, discarded weights). A **Model Registry** curates ONLY the top 1% of models that meet production criteria, managing their formal promotion to production."
        },
        {
          w: "Data scientists should be able to directly push experimental models to the 'Production' stage.",
          r: "Promoting a model to Production must require passing automated validation gates (schema tests, latency thresholds, adversarial tests) and role-based approval from ML Engineers or automated CI/CD pipelines."
        },
        {
          w: "Model artifacts in a registry can be updated in-place when re-trained.",
          r: "Model registry artifacts are strictly **immutable**. Every new training run produces a new, incremented model version (`v2`, `v3`). Overwriting existing production weights destroys auditability and prevents rollback."
        }
      ],

      trade: {
        buys: [
          "Centralized source of truth: eliminates confusion over which exact model version is currently serving production traffic.",
          "Instant zero-downtime rollback: restore a previous stable version in seconds by updating the `@champion` stage alias.",
          "Complete regulatory compliance: provides auditors with exact provenance linking production predictions to training code and data.",
          "Enforces formal Model Signatures, preventing downstream deployment of models with incompatible schema inputs."
        ],
        costs: [
          "Storage overhead: maintaining multi-gigabyte deep learning weights across dozens of registered versions consumes storage.",
          "Governance friction: requires data scientists to follow formal registration and review procedures before deployment.",
          "Infrastructure dependency: requires hosting, securing, and backing up a metadata database (PostgreSQL) and artifact store.",
          "Schema rigidity: strict input signatures require updating client application code when input features change."
        ],
        avoid: [
          "Never point production deployment pipelines directly to experimental run IDs; point only to registered Production aliases.",
          "Do not register model versions without defining explicit input/output Model Signatures.",
          "Avoid granting write permissions to the 'Production' registry stage to un-vetted training scripts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "experiment-tracking",

      why: {
        before: "Machine learning researchers tracked experiments using messy spreadsheets, local text files, or terminal print logs, making it impossible to recall which specific hyperparameter combination or training data split produced a promising result two weeks prior.",
        problem: "Deep learning experimentation generates thousands of trial runs with shifting hyperparameters, learning rates, loss curves, and evaluation metrics; without systematic logging, promising models are permanently lost and research cannot be reproduced.",
        shift: "**Experiment Tracking: The automated, systematic logging, organization, visualization, and comparison of all parameters, code commits, datasets, metrics, and output artifacts generated during machine learning training runs.** Pioneered by MLflow, Weights & Biases (W&B), Comet ML, and Neptune.ai."
      },

      num: {
        t: "Experiment Tracking Data Dimensions & Logging Telemetry",
        h: ["Telemetry Category", "Logged Data Elements", "Logging Frequency", "Storage Format / Backend", "Analytical Utility"],
        r: [
          ["Hyperparameters", "Learning rate, batch size, optimizer, dropout, weight decay", "Once per run (initialization)", "JSON / Key-Value metadata DB", "Hyperparameter importance analysis & sweeps"],
          ["Training Metrics", "Training loss, validation loss, accuracy, perplexity", "Per step / per epoch (continuous)", "Time-series database / Parquet logs", "Detecting overfitting, vanishing gradients, plateauing"],
          ["System Metrics", "GPU compute utilization, VRAM usage, CPU, disk I/O", "Continuous streaming (e.g. 10s)", "System monitoring metrics backend", "Detecting CPU data loader bottlenecks & memory leaks"],
          ["Artifacts", "Model weights (`.pt`), confusion matrices, sample predictions", "End of run / checkpoint intervals", "Cloud Object Storage (S3/GCS)", "Visual auditing & model registry candidate selection"],
          ["Code & Environment", "Git SHA, Python environment (`pip freeze`), OS, Docker digest", "Once per run (initialization)", "Text / metadata DB", "100% exact computational reproducibility"]
        ],
        n: "Experiment tracking libraries instrument training code with programmatic logging hooks (e.g., `wandb.log()` or `mlflow.log_metrics()`). A training execution is formalized as a **Run**: $R = (C_{\\text{git}}, \\mathcal{P}, \\mathcal{D}_{\\text{ref}}, \\mathcal{M}(t), \\mathcal{A})$, where $C_{\\text{git}}$ is the code version, $\\mathcal{P}$ is the hyperparameter configuration, $\\mathcal{D}_{\\text{ref}}$ is the data snapshot pointer, $\\mathcal{M}(t)$ is the vector of time-series loss metrics across training steps $t$, and $\\mathcal{A}$ represents output artifacts (weights, charts). Tracking platforms provide interactive visual dashboards displaying multi-run parallel coordinate plots, hyperparameter correlation matrices, and live GPU telemetry, enabling data scientists to quickly identify optimal configurations and terminate underperforming runs early via automated pruning algorithms (e.g., Hyperband)."
      },

      miss: [
        {
          w: "Experiment tracking is only useful for large deep learning models.",
          r: "Experiment tracking is equally vital for classical tabular models (Scikit-Learn, XGBoost). Tracking feature engineering choices, cross-validation folds, and hyperparameter grids ensures reproducibility and prevents data scientists from wasting days re-running failed ideas."
        },
        {
          w: "Logging metrics at every single batch step causes zero performance overhead.",
          r: "Synchronously logging metrics to remote cloud servers on every training step adds significant network latency and can starve fast GPUs of compute. Metrics must be buffered locally in RAM and flushed asynchronously in batches."
        },
        {
          w: "Experiment tracking automatically guarantees complete scientific reproducibility.",
          r: "Logging metrics and parameters is only half the battle. True reproducibility requires also logging random seed initializations, data split versions (DVC), hardware architecture, CUDA driver versions, and exact dependency lockfiles (`poetry.lock`)."
        },
        {
          w: "All experiment runs should be kept forever in the tracking database.",
          r: "Training runs during broad hyperparameter sweeps generate terabytes of intermediate weights and millions of metric points. Production teams establish automated retention rules to purge intermediate checkpoints from non-candidate runs after 30 days."
        }
      ],

      trade: {
        buys: [
          "Complete experimental visibility: compare hundreds of training runs side-by-side on interactive leaderboards.",
          "Prevents duplicated effort: preserves an authoritative historical record of which architectures failed and why.",
          "Detects hardware bottlenecks: real-time GPU/CPU telemetry identifies data loader bottlenecks starving GPUs.",
          "Seamless model registration: top-performing runs can be promoted to the Model Registry with a single click."
        ],
        costs: [
          "Logging overhead: excessive high-frequency logging can introduce slight computational slowdowns during training.",
          "Storage consumption: saving checkpoints and weights for thousands of experimental runs accumulates cloud storage costs.",
          "Infrastructure maintenance: self-hosted tracking servers require managing PostgreSQL databases and artifact buckets.",
          "Data privacy considerations: logging raw prediction samples must respect compliance policies regarding customer PII."
        ],
        avoid: [
          "Never execute training experiments without logging the associated Git commit hash and environment dependencies.",
          "Do not save multi-gigabyte model checkpoints for every single experimental epoch; save only top-$k$ validation checkpoints.",
          "Avoid synchronous remote network logging inside inner training step loops; log asynchronously."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mlflow",

      why: {
        before: "Machine learning lacked a unified open-source standard for the complete model lifecycle; teams used disconnected, proprietary tools for tracking, disparate packaging scripts for deployments, and ad-hoc directories for artifact storage.",
        problem: "Proprietary ML platforms (SageMaker, Vertex AI) created heavy cloud vendor lock-in, while open-source tools were fragmented across dozens of incompatible single-purpose libraries.",
        shift: "**MLflow: An open-source platform to manage the complete end-to-end machine learning lifecycle, founded on four foundational core components: Tracking, Projects, Models, and Model Registry.** Created by Databricks in 2018, MLflow became the most widely adopted vendor-neutral MLOps framework in the industry."
      },

      num: {
        t: "The Four Core Architectural Components of the MLflow Platform",
        h: ["MLflow Component", "Primary Architectural Role", "Storage Mechanism", "Key Abstraction", "Primary Command / API"],
        r: [
          ["MLflow Tracking", "Logging parameters, metrics, code, and artifacts", "PostgreSQL (metadata) + S3/GCS (artifacts)", "Runs & Experiments", "`mlflow.log_param()`, `mlflow.log_metric()`"],
          ["MLflow Projects", "Standardized packaging for reproducible ML code runs", "Git repository + `MLproject` YAML descriptor", "Project Environments (Conda/Docker)", "`mlflow run <git-uri> -P alpha=0.5`"],
          ["MLflow Models", "Standard model packaging format with multi-flavor support", "Directory layout (`MLmodel` file + weights)", "Model Flavors (Python, PyTorch, ONNX)", "`mlflow.models.build_docker()`, `pyfunc`"],
          ["MLflow Model Registry", "Centralized model governance, versioning & staging", "Shared relational DB schema + cloud object store", "Registered Models & Stages / Aliases", "`client.transition_model_version_stage()`"]
        ],
        n: "MLflow's defining architectural innovation is the **`MLflow Model` format**—a directory convention centered around an `MLmodel` YAML configuration file. This file specifies **Model Flavors**—different interfaces through which the model can be consumed. For example, a model can simultaneously possess a `pytorch` native flavor (allowing PyTorch code to load raw tensor graphs) and a universal **`python_function` (`pyfunc`)** flavor. The `pyfunc` flavor guarantees a standardized, framework-agnostic interface: `model.predict(pandas_df) -> pandas_df`. Any downstream deployment tool (Triton, Kubernetes, SageMaker, Docker) can serve any MLflow-compliant model without knowing whether the underlying algorithm was trained using PyTorch, XGBoost, Scikit-Learn, or a custom Python script."
      },

      miss: [
        {
          w: "MLflow is a cloud service that can only be used on Databricks.",
          r: "MLflow is a 100% open-source, vendor-neutral Linux Foundation project. It can be installed locally via `pip install mlflow`, self-hosted on any private Kubernetes cluster or virtual machine, or used across AWS, GCP, Azure, and Databricks."
        },
        {
          w: "MLflow is an orchestration engine that replaces Apache Airflow.",
          r: "MLflow is NOT a workflow scheduler or orchestrator. It does not manage complex task DAGs, trigger schedules, or manage distributed worker queues. In production, Apache Airflow orchestrates pipelines, calling MLflow to track runs and register model artifacts."
        },
        {
          w: "MLflow requires re-writing all existing training code to fit MLflow classes.",
          r: "MLflow provides **Autologging** (`mlflow.autolog()`). Adding a single line of code automatically instruments Scikit-Learn, PyTorch, TensorFlow, XGBoost, and LightGBM to log hyperparameters, loss metrics, and artifacts without manual logging calls."
        },
        {
          w: "MLflow Models can only output predictions as Pandas DataFrames.",
          r: "While `pyfunc` natively supports Pandas, modern MLflow versions provide complete native tensor support (NumPy arrays, PyTorch tensors), dictionary payloads, and chat-completion schemas for Large Language Models (LLMs)."
        }
      ],

      trade: {
        buys: [
          "Open-source and vendor-neutral: prevents cloud lock-in; runs identically on local laptops, on-prem servers, and cloud VMs.",
          "Universal model packaging: the `pyfunc` flavor standardizes serving across all frameworks (PyTorch, Sklearn, XGBoost).",
          "Automated tracking: `mlflow.autolog()` provides zero-boilerplate instrumentation across all major ML libraries.",
          "Massive community and enterprise adoption: native integration into Databricks, AWS SageMaker, Azure ML, and Kubernetes."
        ],
        costs: [
          "Self-hosted operational maintenance: requires maintaining a dedicated tracking server, PostgreSQL database, and S3 bucket.",
          "Basic visual UI: visual comparison dashboards are less advanced and customizable than specialized SaaS tools (Weights & Biases).",
          "Scalability bottlenecks: high-concurrency runs from large hyperparameter sweeps can strain the central SQLite/PostgreSQL backend.",
          "Security configuration: open-source MLflow historically lacked fine-grained multi-user authentication out-of-the-box."
        ],
        avoid: [
          "Never run MLflow in production using the default local SQLite database and local filesystem storage; use PostgreSQL and S3.",
          "Do not deploy custom prediction microservices without packaging models in the standardized MLflow `pyfunc` format.",
          "Avoid exposing self-hosted MLflow tracking servers to public networks without configuring reverse-proxy authentication."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-versioning",

      why: {
        before: "Teams identified machine learning models by filenames on shared network drives, leading to ambiguity over which exact code commit, training data split, and hyperparameter configuration produced a given model file.",
        problem: "When a production model begins making biased predictions or hallucinations, engineers cannot inspect its training provenance, reproduce its weights, or roll back safely without systematic, immutable model version tracking.",
        shift: "**Model Versioning: The disciplined practice of assigning unique, immutable, monotonically increasing version identifiers to trained model artifacts, paired with complete cryptographic provenance of code, data, and hyperparameters.** Managed via Model Registries and Git-aligned artifact stores."
      },

      num: {
        t: "Model Versioning Dimensions: Provenance Lineage, Storage & Rollback Guarantees",
        h: ["Versioning Dimension", "Logged Artifact / Identifier", "Cryptographic Provenance", "Rollback Mechanism", "Compliance Standard"],
        r: [
          ["Model Weights Version", "Unique integer / semantic version (`v1.4.0`)", "SHA-256 hash of serialized binary file", "Instant pointer swap to previous version", "SOC 2 / FDA AI approval"],
          ["Code State Version", "Git Commit SHA (`7b3f9a2...`)", "Cryptographic Git commit tree hash", "Git checkout to exact training script", "Software engineering audit"],
          ["Training Data Version", "DVC hash / Delta Lake snapshot ID", "Content-addressable hash of raw partitions", "Time travel query: `AS OF VERSION`", "GDPR / EU AI Act traceability"],
          ["Environment Version", "Docker image digest (`sha256:...`)", "Immutable container image manifest", "Pull exact historical container image", "100% execution parity"]
        ],
        n: "Model versioning establishes an immutable, auditable mapping between the trained binary weights and its foundational dependencies: $\\text{ModelVersion}(v) \\equiv \\langle \\text{Weights}_{\\text{hash}}, \\text{Code}_{\\text{SHA}}, \\text{Data}_{\\text{snapshot}}, \\text{Env}_{\\text{digest}}, \\Theta \\rangle$. In modern registries (such as MLflow or AWS SageMaker), when a model is registered, the system generates a sequential version identifier (`v1`, `v2`, `v3`). Crucially, the physical model file stored in cloud object storage is **immutable**: once uploaded, it can never be altered or overwritten. Production deployments refer to models not by static version numbers, but through dynamic **Stage Aliases** (e.g., `@champion` $\\rightarrow$ `v14`, `@challenger` $\\rightarrow$ `v15`). When an issue is detected, rolling back to `v13` requires updating the `@champion` alias pointer in milliseconds without re-deploying containers."
      },

      miss: [
        {
          w: "Model versioning is just storing model files in Git using Git-LFS.",
          r: "Git-LFS tracks binary files, but knows nothing about model performance metrics, input schemas, validation gates, or production promotion stages. Dedicated Model Registries provide the lifecycle governance that Git cannot offer."
        },
        {
          w: "Versioning code in Git is sufficient to version the resulting machine learning model.",
          r: "Code is only one input to training. Compiling the exact same Git commit against data that changed between Monday and Friday produces two completely different models with different weights and behaviors. Model, code, and data must be versioned together."
        },
        {
          w: "Semantic Versioning (MAJOR.MINOR.PATCH) applies to ML models exactly like software libraries.",
          r: "In software, PATCH means a bug fix. In ML, retrained models alter predictive distributions across millions of continuous inputs. MLOps teams typically use sequential versioning (`v1, v2`) combined with metadata tags (`champion, challenger, shadow`) to denote operational status."
        },
        {
          w: "Old model versions can be safely deleted immediately after deploying a new version.",
          r: "Purging old model versions destroys the ability to perform instant rollbacks during catastrophic failures. Regulated industries (healthcare, finance) mandate retaining historical model versions and training lineage for years for legal auditing."
        }
      ],

      trade: {
        buys: [
          "Guarantees instant, zero-downtime rollback: restore the previous stable production model version in milliseconds.",
          "Complete auditability and compliance: satisfies regulatory mandates (EU AI Act, FDA) for AI provenance.",
          "Enables controlled deployment strategies: safely test new versions via A/B testing and champion-challenger routing.",
          "Prevents human error: immutable version numbers ensure engineers cannot accidentally overwrite active production weights."
        ],
        costs: [
          "Storage cost accumulation: retaining multiple versions of multi-gigabyte deep learning weights increases object storage costs.",
          "Metadata management overhead: requires running and monitoring a model registry database and schema store.",
          "Coordination complexity: client applications must handle versioned API routing and payload schema evolutions.",
          "Lifecycle policy maintenance: requires establishing automated retention and archival policies for obsolete versions."
        ],
        avoid: [
          "Never overwrite an existing model version's binary files in place; always increment to a new immutable version.",
          "Do not deploy models to production without recording the exact Git commit SHA and training dataset snapshot.",
          "Avoid hardcoding static model version numbers in client applications; use dynamic stage aliases (`@champion`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reproducibility",

      why: {
        before: "Data scientists trained high-performing models on their local workstations, but neither colleagues nor production deployment pipelines could reproduce the identical evaluation metrics due to hidden random seeds, floating-point GPU variance, and unpinned software libraries.",
        problem: "Non-reproducible models undermine scientific credibility, fail regulatory compliance audits, and turn model debugging into an impossible guessing game when production predictions diverge from research results.",
        shift: "**Reproducibility: The ability to duplicate the exact statistical and mathematical results of an ML training run by using the identical code, data snapshots, hyperparameters, computational environment, and random seed initializations.** The gold standard of scientific integrity in machine learning."
      },

      num: {
        t: "Sources of Non-Determinism in Machine Learning & Remediation Strategies",
        h: ["Source of Non-Determinism", "Physical / Mathematical Cause", "Impact on Model", "Remediation Strategy", "Throughput Penalty"],
        r: [
          ["Pseudo-Random Generators", "Unseeded Python/NumPy/Torch random generators", "Different weight initialization & data shuffling", "Explicitly seed all PRNGs: `torch.manual_seed(42)`", "Zero performance impact"],
          ["Non-Deterministic GPU Convolutions", "Atomic floating-point addition in cuDNN heuristics", "Slight numerical divergence in backward pass gradients", "`torch.use_deterministic_algorithms(True)`", "~10% to 20% slowdown on GPU"],
          ["Multi-Threaded DataLoader", "Asynchronous multi-process thread scheduling", "Batches arrive in variable order across epochs", "`worker_init_fn` with seeded generator per worker", "Negligible"],
          ["Floating-Point Associativity", "$(A + B) + C \\ne A + (B + C)$ across parallel threads", "Accumulation order variance across GPU warps", "Fixed reduction tree algorithms / double precision", "Moderate throughput cost"],
          ["Unpinned Library Environments", "Implicit updates to dependencies (e.g., PyTorch minor)", "Algorithmic implementation shifts across versions", "Docker container images + locked dependency files (`poetry.lock`)", "Zero runtime cost; build-time rigor"]
        ],
        n: "Achieving true reproducibility in deep learning requires controlling non-determinism across five distinct layers: $\\text{Reproducibility} = f(\\text{Code}, \\text{Data}, \\text{Environment}, \\text{Seeds}, \\text{Hardware})$. At the algorithmic layer, all pseudo-random number generators (PRNGs) must be deterministically seeded across Python (`random.seed`), NumPy (`np.random.seed`), and PyTorch (`torch.manual_seed`). At the GPU hardware layer, highly optimized cuDNN benchmarking algorithms select the fastest convolution kernel dynamically at runtime, introducing non-deterministic memory access patterns. Achieving bitwise reproducibility requires forcing deterministic algorithms: `torch.backends.cudnn.deterministic = True` and disabling benchmarks: `torch.backends.cudnn.benchmark = False`. Finally, the computational execution environment must be locked using containerization (Docker) and pinned dependency lockfiles."
      },

      miss: [
        {
          w: "Setting `random.seed(42)` in Python guarantees 100% deterministic training on GPUs.",
          r: "Setting Python's random seed only controls basic Python operations. It does not seed NumPy, PyTorch CPU, PyTorch GPU, or cuDNN non-deterministic atomic floating-point operations. All libraries and CUDA flags must be explicitly locked."
        },
        {
          w: "Identical code and seeds will produce bitwise identical models across different GPU architectures.",
          r: "Training on an NVIDIA A100 vs an RTX 3090 will produce slight numerical discrepancies due to differing hardware Tensor Core architectures, warp scheduling heuristics, and floating-point fused multiply-add (FMA) instructions."
        },
        {
          w: "Reproducibility requires zero data changes across the entire company forever.",
          r: "Reproducibility does not mean data cannot evolve; it means historical training datasets must be snapshot-versioned (via DVC or Iceberg time-travel) so the exact slice used for an experiment can be re-read on demand."
        },
        {
          w: "Enabling strict deterministic mode on PyTorch should always be on in all production training.",
          r: "Strict deterministic GPU algorithms (`torch.use_deterministic_algorithms(True)`) can reduce training throughput by 15% to 30% and cause certain unsupported operations to throw runtime exceptions. Teams often trade strict bitwise reproducibility for statistical reproducibility during rapid research."
        }
      ],

      trade: {
        buys: [
          "Guarantees scientific integrity: experiments can be validated, audited, and built upon by team members with total confidence.",
          "Regulatory compliance: essential for passing strict AI audits in healthcare, aviation, and financial risk modeling.",
          "Rapid debugging: enables exact step-by-step reproduction and diagnosis of production edge-case prediction failures.",
          "Eliminates 'it worked on my machine' syndrome when transitioning models from data science laptops to CI/CD pipelines."
        ],
        costs: [
          "Compute performance penalty: enforcing bitwise deterministic GPU algorithms reduces training throughput by up to 20%.",
          "Engineering discipline: requires strict adherence to containerization, seed management, and dataset versioning.",
          "Storage overhead: snapshotting immutable data versions and Docker images increases cloud storage consumption.",
          "Cross-hardware limitations: bitwise reproducibility across disparate hardware architectures is nearly impossible."
        ],
        avoid: [
          "Never execute deep learning experiments without setting seeds across Python, NumPy, and PyTorch.",
          "Do not rely on unpinned `requirements.txt` files (e.g., `torch>=2.0`); use locked dependency files or Docker digests.",
          "Avoid reporting benchmark results without verifying that numbers are statistically stable across multiple seeded runs."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
