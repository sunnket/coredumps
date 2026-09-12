/* MLOPS — 50+ Hardcore Question Bank (Principal MLOps Level). */

/* ===================================================================
   Module: drift — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("mlops", "drift", [
  {
    "tag": "Population Stability Index (PSI) Formula",
    "lvl": "advanced",
    "q": "What is the exact mathematical formula for Population Stability Index (PSI) between baseline distribution $E$ and actual production distribution $A$ across $B$ bins, and what does $\\text{PSI} > 0.25$ indicate?",
    "o": [
      "$\\text{PSI} = \\sum (A_i - E_i)^2$; indicates model is perfect",
      "$\\text{PSI} = \\sum_{i=1}^B (A_i - E_i) \\ln \\left( \\frac{A_i}{E_i} \\right)$; a score $> 0.25$ indicates **Significant Distribution Shift / Drift**, requiring urgent model retraining",
      "$\\text{PSI} = \\sum A_i / E_i$; indicates zero drift",
      "$\\text{PSI} = \\max |A_i - E_i|$; indicates data corruption"
    ],
    "a": 1,
    "x": "PSI quantifies divergence between reference and target distributions. $\\text{PSI} < 0.1$ is stable, $0.1 \\le \\text{PSI} \\le 0.25$ shows moderate shift, and $>0.25$ signifies severe drift."
  },
  {
    "tag": "Kolmogorov-Smirnov (KS) Test for Feature Drift",
    "lvl": "advanced",
    "q": "In continuous numerical feature drift detection, how does the two-sample Kolmogorov-Smirnov (KS) test determine whether production feature $X$ has drifted from baseline?",
    "o": [
      "Compares mean and standard deviation only",
      "Computes the supremum of the absolute vertical difference between the two Empirical Cumulative Distribution Functions (eCDFs): $D = \\sup_x |F_{\\text{baseline}}(x) - F_{\\text{production}}(x)|$, rejecting the null hypothesis of identical distributions if $p < \\alpha$",
      "Calculates Pearson correlation",
      "Runs a t-test"
    ],
    "a": 1,
    "x": "The KS test is non-parametric and distribution-free, evaluating the maximum vertical gap between two empirical CDF curves across the entire domain."
  },
  {
    "tag": "Concept Drift vs Covariate Shift vs Prior Shift",
    "lvl": "advanced",
    "q": "What is the precise probabilistic distinction between **Covariate Shift**, **Prior Probability Shift**, and **Concept Drift**?",
    "o": [
      "They are identical terms",
      "**Covariate Shift**: $P(X)$ changes while $P(Y|X)$ remains constant; **Prior Shift**: $P(Y)$ changes while $P(X|Y)$ remains constant; **Concept Drift**: $P(Y|X)$ changes (the underlying relationship between features and labels shifts)",
      "Covariate shift is for text; Concept drift is for images",
      "Concept drift only occurs in neural networks"
    ],
    "a": 1,
    "x": "Covariate shift changes feature inputs $P(X)$. Concept drift changes the true conditional mapping $P(Y|X)$ (e.g. consumer spending behavior changes during macroeconomic crisis)."
  },
  {
    "tag": "Ground Truth Feedback Loop Delay in Fraud Detection",
    "lvl": "advanced",
    "q": "Why is monitoring real-time ROC-AUC or Precision impossible in production credit card fraud detection systems at time $t=0$?",
    "o": [
      "Credit cards do not use ML",
      "Fraud chargeback dispute labels have a **60–90 day ground truth label delay** before banks finalize fraud claims; systems must monitor proxy metrics (feature drift PSI, prediction distribution shift, anomaly rates) in real-time instead of true classification metrics",
      "ROC-AUC is deprecated in banking",
      "Fraud detection is unsupervised only"
    ],
    "a": 1,
    "x": "True fraud labels arrive months after transactions occur. Real-time observability must rely on statistical drift metrics (PSI, KS test, embedding distance) rather than ground truth performance."
  },
  {
    "tag": "Wasserstein Distance (Earth Mover's Distance) for Drift",
    "lvl": "advanced",
    "q": "Why is 1-Wasserstein Distance preferred over KL Divergence for monitoring high-dimensional continuous feature distributions in production?",
    "o": [
      "Wasserstein is faster to compute",
      "Wasserstein distance provides a meaningful, continuous, smooth geometric metric even when two distributions have non-overlapping supports (where KL Divergence explodes to $+\\infty$ or becomes undefined)",
      "Wasserstein distance is always 0",
      "KL divergence cannot be used on numbers"
    ],
    "a": 1,
    "x": "KL divergence is undefined when target support is zero where reference is non-zero. Wasserstein distance measures the minimum work required to transport one distribution into another."
  },
  {
    "tag": "Jensen-Shannon Divergence Symmetrical Bounding",
    "lvl": "advanced",
    "q": "Why is Jensen-Shannon Divergence (JSD) preferred over asymmetric Kullback-Leibler (KL) divergence in automated model monitoring dashboards?",
    "o": [
      "JSD has no logarithm",
      "JSD is symmetric ($D_{\\text{JS}}(P || Q) = D_{\\text{JS}}(Q || P)$), strictly bounded between $[0, 1]$ (when using base 2 logarithm), and is always well-defined and finite even when probability distributions have non-identical support",
      "JSD is for integers only",
      "KL divergence requires GPUs"
    ],
    "a": 1,
    "x": "JSD computes the average KL divergence to the mixture distribution $M = \\frac{1}{2}(P+Q)$, creating a symmetric, finite metric bounded in $[0, 1]$."
  },
  {
    "tag": "Outlier Detection in Production via Mahalanobis Distance",
    "lvl": "advanced",
    "q": "How does Mahalanobis Distance $D_M(x) = \\sqrt{(x - \\mu)^T \\Sigma^{-1} (x - \\mu)}$ detect multidimensional feature anomalies better than standard Euclidean distance?",
    "o": [
      "Mahalanobis runs in $O(1)$ time",
      "It scales distances by the inverse covariance matrix $\\Sigma^{-1}$, taking into account the variance and cross-correlations between features, preventing correlated feature groups from falsely dominating the anomaly score",
      "Mahalanobis ignores negative values",
      "Euclidean distance cannot handle vectors"
    ],
    "a": 1,
    "x": "Euclidean distance treats all axes as orthogonal and unit-variance. Mahalanobis distance transforms feature space using covariance $\\Sigma$, identifying true statistical outliers."
  },
  {
    "tag": "Embedding Drift in Vector Search Systems",
    "lvl": "advanced",
    "q": "How should an MLOps platform detect drift in deep learning embedding spaces (e.g. image or text embeddings in a Vector DB)?",
    "o": [
      "Counts total characters in text",
      "Computes the distribution shift of pairwise cosine distances between current query vectors and reference cluster centroids, or monitors Maximum Mean Discrepancy (MMD) across high-dimensional embedding batches",
      "Compares file size of embeddings",
      "Counts total vector rows"
    ],
    "a": 1,
    "x": "Raw feature drift tests fail on high-dimensional dense embeddings. MLOps systems monitor embedding centroid distances, k-NN graph densities, or kernel MMD metrics."
  }
]);

/* ===================================================================
   Module: store — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("mlops", "store", [
  {
    "tag": "Feature Store Point-in-Time Correctness",
    "lvl": "advanced",
    "q": "Why must Feature Stores (Feast, Tecton) implement **Point-in-Time Correctness (Time-Travel Joins)** when generating training datasets from historical entity event logs?",
    "o": [
      "To speed up SQL queries",
      "To eliminate **Temporal Data Leakage**: ensuring each training example $i$ at event timestamp $T_i$ is joined strictly with the feature values that were valid and observable **prior to or at timestamp $T_i$**, never incorporating future state data into training",
      "To compress Parquet files",
      "To encrypt user data"
    ],
    "a": 1,
    "x": "Without point-in-time correctness, joining historical labels with current feature values leaks future information into training examples, yielding artificially high offline metrics that collapse in production."
  },
  {
    "tag": "Dual-Store Architecture (Online vs Offline)",
    "lvl": "advanced",
    "q": "What is the architectural purpose of having dual storage backends (e.g. Redis + Snowflake/BigQuery) in an enterprise Feature Store?",
    "o": [
      "To backup data twice",
      "The **Online Store** (Redis/DynamoDB) provides ultra-low latency ($<5\\text{ms}$) single-key feature vector lookups for real-time inference; the **Offline Store** (Parquet/Snowflake) provides high-throughput batch historical time-travel joins for ML model training",
      "Redis trains neural networks",
      "Offline store is read-only"
    ],
    "a": 1,
    "x": "Inference requires millisecond single-row lookups (key-value store). Training requires scanning terabytes of historical time-series logs (columnar data lake)."
  },
  {
    "tag": "Training-Serving Skew Root Causes",
    "lvl": "advanced",
    "q": "What is the primary root cause of **Training-Serving Skew** in production machine learning systems?",
    "o": [
      "Different GPU hardware",
      "Discrepancy in feature transformation logic (e.g. pandas/NumPy preprocessing in Python during training vs custom Java/C++ logic in the production inference microservice) or feature definitions diverging between offline training logs and online feature stores",
      "Different Python versions",
      "Model file compression"
    ],
    "a": 1,
    "x": "Training-serving skew occurs when feature engineering pipelines differ between offline training and online serving environments, generating mismatched feature values for identical raw inputs."
  },
  {
    "tag": "Streaming Feature Ingestion (Flink -> Redis)",
    "lvl": "advanced",
    "q": "In real-time fraud detection, how does an MLOps pipeline compute sliding window aggregations (e.g. 'number of transactions in last 10 minutes') with sub-second freshness?",
    "o": [
      "Runs batch cron jobs every 10 minutes",
      "Streams real-time transaction events through Apache Flink/Kafka Streams with managed RocksDB stateful windowing, continuously updating pre-aggregated feature counts directly into the online Redis feature store with millisecond latency",
      "Queries MySQL database with COUNT(*)",
      "Loads historical CSV into RAM"
    ],
    "a": 1,
    "x": "Stateful stream processing engines (Flink) maintain rolling window state in memory, continuously emitting updated aggregation vectors to low-latency key-value stores."
  },
  {
    "tag": "Feature Importance Drift over Time",
    "lvl": "advanced",
    "q": "What does a significant shift in Permutation Feature Importance on production inference batches over a 30-day window indicate?",
    "o": [
      "Model accuracy has doubled",
      "The real-world business dynamics or user behavior have shifted such that features the model historically relied upon for prediction are losing predictive power, signaling impending accuracy degradation",
      "Server CPU load is increasing",
      "Feature values are corrupt"
    ],
    "a": 1,
    "x": "When top predictive features lose relative importance in production data, the underlying generative process has evolved, indicating model decay."
  },
  {
    "tag": "Batch Inference Partitioning & Idempotency",
    "lvl": "advanced",
    "q": "In batch inference pipelines (Apache Airflow / Dagster), how do you ensure idempotent offline scoring across petabyte-scale data lakes?",
    "o": [
      "Re-score everything every hour",
      "Partition outputs strictly by execution date (`/predictions/date=YYYY-MM-DD/`), write scored records to temporary staging prefixes, and execute an atomic directory swap/partition overwrite on completion",
      "Append records to a single CSV",
      "Run queries with LIMIT 100"
    ],
    "a": 1,
    "x": "Atomic partition replacement prevents partial write corruption and guarantees idempotency when batch scoring jobs are retried."
  }
]);

/* ===================================================================
   Module: serve — (14 Hardcore Questions)
   =================================================================== */

TD.addMCQ("mlops", "serve", [
  {
    "tag": "Triton Dynamic Batching (max_queue_delay)",
    "lvl": "advanced",
    "q": "In NVIDIA Triton Inference Server, how does Dynamic Batching optimize GPU compute throughput without violating strict SLA latency limits?",
    "o": [
      "Drops requests when GPU is busy",
      "Combines individual concurrent inference requests arriving within a configured time window (`max_queue_delay_microseconds`) into a single coalesced Tensor batch, maximizing GPU Tensor Core saturation while guaranteeing requests are dispatched before SLA thresholds expire",
      "Runs one process per core",
      "Converts models to ONNX only"
    ],
    "a": 1,
    "x": "Dynamic batching aggregates independent concurrent client requests into optimal GPU batch sizes within a bounded microsecond queue window, maximizing throughput."
  },
  {
    "tag": "Shadow (Dark) Deployment Traffic Mirroring",
    "lvl": "advanced",
    "q": "How does a **Shadow Deployment (Dark Launch)** validate a new candidate ML model in production without risking user experience or business KPIs?",
    "o": [
      "Deploys model to 5% of users",
      "The API gateway duplicates 100% of live production traffic and asynchronously sends a copy to the candidate model; the candidate model's predictions and latency are logged for evaluation, but **only the legacy champion model's output is returned to the user**",
      "Runs model on synthetic test data",
      "Rolls back previous version immediately"
    ],
    "a": 1,
    "x": "Shadow routing tests candidate models against 100% real-world production load, concurrency, and dirty inputs with zero blast radius because shadow outputs are never served to clients."
  },
  {
    "tag": "ONNX Runtime Graph Optimization Passes",
    "lvl": "advanced",
    "q": "What graph-level optimization does ONNX Runtime execute when compiling a PyTorch Transformer model for production inference?",
    "o": [
      "Deletes attention weights",
      "**Operator Fusion & Constant Folding**: Fuses adjacent LayerNorm operations ($(\\text{Add} + \\text{ReduceMean} + \\text{Sub} + \\text{Mul})$) into a single optimized CUDA kernel, pre-computes constant subtrees, and eliminates redundant reshape/transpose memory copies",
      "Quantizes all floats to integers",
      "Converts model to C code"
    ],
    "a": 1,
    "x": "Graph fusion merges multiple elementary tensor operations into a single monolithic GPU CUDA kernel, drastically reducing GPU memory bandwidth round-trips."
  },
  {
    "tag": "Semantic Caching for LLM Production Gateways",
    "lvl": "advanced",
    "q": "How does Semantic Caching (e.g. GPTCache) reduce LLM API costs and response latency for high-throughput enterprise applications?",
    "o": [
      "Caches exact string queries in Redis",
      "Computes dense embedding vectors for incoming user queries and queries a Vector DB; if a cached historical query shares cosine similarity $> 0.95$, the system returns the pre-computed cached LLM response with $<10\\text{ms}$ latency and zero API cost",
      "Translates prompts to SQL",
      "Compresses prompt tokens with gzip"
    ],
    "a": 1,
    "x": "Standard key-value caching fails on minor prompt phrasing variations. Semantic caching uses vector similarity search to return cached completions for semantically equivalent queries."
  },
  {
    "tag": "TensorRT INT8 Calibration (KL Divergence)",
    "lvl": "advanced",
    "q": "How does NVIDIA TensorRT determine optimal scale factors ($S$) during Post-Training INT8 Quantization (PTQ) without degrading model accuracy?",
    "o": [
      "Rounds numbers to nearest integer",
      "Executes calibration on a representative dataset to collect activation histograms across layers, minimizing the **Kullback-Leibler (KL) Divergence** between the original FP32 activation distribution and the quantized INT8 distribution to find the optimal threshold clipping value",
      "Sets scale to max absolute value",
      "Uses random scales"
    ],
    "a": 1,
    "x": "TensorRT uses entropy calibration to minimize information loss (KL divergence) between FP32 and INT8 distributions, picking optimal clipping thresholds that discard outliers."
  },
  {
    "tag": "Multi-Armed Bandit (MAB) Deployment vs A/B Testing",
    "lvl": "advanced",
    "q": "Why is a Multi-Armed Bandit (e.g. Thompson Sampling) deployment superior to a static 50/50 A/B test for production recommendation models?",
    "o": [
      "MAB requires no code",
      "Bandits dynamically adjust traffic routing in real-time, routing increasing proportions of traffic to whichever model variant generates higher business rewards (minimizing regret during the trial period) instead of wasting 50% of traffic on an inferior model for weeks",
      "A/B tests only work on mobile",
      "Bandits train neural networks online"
    ],
    "a": 1,
    "x": "Bandits resolve the exploration-exploitation dilemma dynamically, routing traffic to high-performing models to minimize cumulative regret compared to fixed A/B allocations."
  },
  {
    "tag": "Ray Serve vs FastAPI for Large Model Serving",
    "lvl": "advanced",
    "q": "Why is Ray Serve preferred over single-instance FastAPI + Uvicorn for multi-model LLM pipelines?",
    "o": [
      "FastAPI is written in C++",
      "Ray Serve manages distributed actor worker pools across multiple GPUs and nodes, provides dynamic request batching, model multiplexing, and pipeline composition natively without being constrained by the single-process Python GIL",
      "FastAPI cannot handle JSON",
      "Ray Serve eliminates Python"
    ],
    "a": 1,
    "x": "Ray Serve schedules model replicas across distributed heterogeneous GPU nodes with actor-level lifecycle control and dynamic tensor-level batching."
  },
  {
    "tag": "Structured vs Unstructured Model Pruning",
    "lvl": "advanced",
    "q": "Why does Structured Pruning (channel/layer dropping) yield real-world inference speedups on standard GPUs while Unstructured Pruning (setting 90% of weights to 0) often runs slower?",
    "o": [
      "Unstructured pruning deletes model files",
      "Standard GPU Tensor Cores and cuBLAS dense matrix multiplication engines cannot accelerate unstructured random zero-sparsity without specialized sparse hardware architectures, incurring pointer overhead; Structured pruning physically removes entire channels/matrices, reducing dense FLOPs directly",
      "Structured pruning is lossless",
      "Unstructured pruning is proprietary"
    ],
    "a": 1,
    "x": "Dense tensor hardware relies on regular memory layouts. Structured pruning removes entire matrix rows/columns, accelerating dense BLAS engines directly without sparse pointer overhead."
  },
  {
    "tag": "Triton Model Control Mode Dynamic Eviction",
    "lvl": "advanced",
    "q": "In multi-model GPU inference clusters hosting hundreds of niche models, how does Triton's `model-control-mode=explicit` optimize VRAM utilization?",
    "o": [
      "Compresses models to 1MB",
      "Dynamically loads models into GPU memory on-demand upon invocation and unloads least-recently-used (LRU) models when VRAM pressure exceeds threshold, enabling high model-to-GPU density",
      "Runs models on CPU only",
      "Deletes model files after inference"
    ],
    "a": 1,
    "x": "Explicit model control allows Triton to dynamically load and unload model weights from GPU memory based on traffic demand."
  },
  {
    "tag": "Blue-Green Deployments with DNS Traffic Cutover",
    "lvl": "advanced",
    "q": "How does Blue-Green deployment achieve instantaneous rollback during critical machine learning model serving failures?",
    "o": [
      "Re-trains the model in 1 second",
      "Maintains two identical production environments (Blue = live, Green = idle); after validating Green with smoke tests, router/DNS flips 100% traffic to Green; if errors spike, traffic is reverted to Blue in sub-second time",
      "Rolls back Git commits",
      "Deletes the cloud account"
    ],
    "a": 1,
    "x": "Blue-Green maintains standby environments, allowing instantaneous traffic cutover and near-zero downtime rollback via load balancer switching."
  },
  {
    "tag": "Edge Hardware Acceleration (TFLite / CoreML Delegates)",
    "lvl": "advanced",
    "q": "How do runtime Delegates (Apple CoreML / Android NNAPI) accelerate edge inference on mobile devices?",
    "o": [
      "Transfers computation to cloud servers",
      "Intercepts the model compute graph and compiles compatible sub-graphs directly into native hardware instructions targeting device Neural Processing Units (NPUs) or DSPs, bypassing the mobile CPU",
      "Increases battery drain",
      "Converts floats to doubles"
    ],
    "a": 1,
    "x": "Hardware delegates offload execution graph sub-networks to specialized NPU/DSP coprocessors for sub-10ms edge inference."
  },
  {
    "tag": "LLM Gateway Routing & Failovers (LiteLLM / Portkey)",
    "lvl": "advanced",
    "q": "What is the primary architectural role of an enterprise LLM Gateway in production AI systems?",
    "o": [
      "Trains base foundation models",
      "Provides a unified API abstraction layer managing automatic fallbacks across multiple providers (e.g. OpenAI $\\rightarrow$ Anthropic $\\rightarrow$ self-hosted vLLM), global rate-limiting, load balancing, cost tracking, and PII masking",
      "Translates Python to JavaScript",
      "Stores vectors in RAM"
    ],
    "a": 1,
    "x": "LLM Gateways act as intelligent reverse proxies handling multi-provider routing, retry logic, budget controls, and fallback failovers."
  },
  {
    "tag": "Model Stealing & Extraction Defenses",
    "lvl": "advanced",
    "q": "How does an MLOps inference gateway defend against Model Stealing / Extraction attacks where adversaries query black-box APIs to train surrogate clone models?",
    "o": [
      "Blocks all API traffic",
      "Rounds returned prediction confidence scores (e.g. returning only top-$k$ discrete class labels instead of full 64-bit probability vectors), injects subtle calibrated output perturbation noise, and enforces IP/user query rate limits",
      "Deletes model weights",
      "Encrypts JSON responses with RSA"
    ],
    "a": 1,
    "x": "Model stealing relies on querying full floating-point output distributions. Rounding logits and rate-limiting prevents high-fidelity surrogate model reconstruction."
  },
  {
    "tag": "Active-Active Multi-Region MLOps Inference",
    "lvl": "advanced",
    "q": "In global multi-region active-active ML serving architectures, how is state consistency maintained across feature stores?",
    "o": [
      "Features are stored on local client disks",
      "Uses globally distributed key-value stores (e.g. AWS DynamoDB Global Tables / Redis Enterprise Active-Active CRDTs) with sub-second multi-region asynchronous replication and GeoDNS latency routing",
      "Transfers training data via FTP",
      "Disables online features"
    ],
    "a": 1,
    "x": "Active-Active inference uses Conflict-free Replicated Data Types (CRDTs) to synchronize feature stores across geographic cloud regions."
  }
]);

/* ===================================================================
   Module: ops — (22 Hardcore Questions)
   =================================================================== */

TD.addMCQ("mlops", "ops", [
  {
    "tag": "DVC (Data Version Control) Content-Addressable Storage",
    "lvl": "advanced",
    "q": "How does DVC version multi-gigabyte dataset files in Git repositories without storing large binary blobs in Git history?",
    "o": [
      "Compresses datasets into Git commits",
      "Computes the **md5 content hash** of the dataset file, stores a lightweight 50-byte `.dvc` text pointer file in Git containing the hash, and pushes the actual raw data payload to external Content-Addressable Storage (S3/GCS) indexed by hash",
      "Deletes old dataset versions",
      "Converts datasets to JSON"
    ],
    "a": 1,
    "x": "DVC decouples metadata from heavy data payloads: Git tracks immutable content-hash pointer files (`.dvc`), while external blob storage holds actual dataset versions."
  },
  {
    "tag": "Great Expectations Declarative Validation Checks",
    "lvl": "advanced",
    "q": "In an automated MLOps continuous training pipeline, what role do Great Expectations validation checkpoints play?",
    "o": [
      "Trains machine learning models",
      "Executes declarative data unit tests (e.g. `expect_column_values_to_not_be_null`, `expect_column_quantile_values_to_be_between`) on incoming raw data batches, **halting the training pipeline immediately** if data contract violations or schema corruptions occur",
      "Monitors GPU temperatures",
      "Generates synthetic training data"
    ],
    "a": 1,
    "x": "Great Expectations provides declarative data contracts. Failing expectations abort downstream model training before bad data pollutes model weights."
  },
  {
    "tag": "Kubeflow Pipelines (KFP) Containerized DAG Execution",
    "lvl": "advanced",
    "q": "How does Kubeflow Pipelines achieve reproducible, containerized ML workflow execution on Kubernetes?",
    "o": [
      "Runs Python scripts in a single virtualenv",
      "Encapsulates each pipeline component (data extraction, preprocessing, training, evaluation, deployment) as an **isolated, immutable Docker container**, orchestrating step dependencies and artifact passing as an acyclic DAG via Argo Workflows",
      "Compiles Python to C++",
      "Executes all tasks on CPU only"
    ],
    "a": 1,
    "x": "Each KFP component runs in its own container with locked dependencies. Argo executes the DAG, passing immutable artifact pointers between pipeline stages."
  },
  {
    "tag": "Differential Privacy DP-SGD (Privacy Budget Epsilon)",
    "lvl": "advanced",
    "q": "In Privacy-Preserving Machine Learning with DP-SGD (Abadi et al.), what do the parameters $\\epsilon$ (epsilon) and $\\delta$ (delta) represent in the privacy budget guarantee?",
    "o": [
      "Accuracy and loss thresholds",
      "$\\epsilon$ bounds the maximum log-ratio of output probabilities between adjacent datasets differing by one user (privacy loss bound); $\\delta$ represents the small probability that the strict $\\epsilon$-differential privacy bound is breached",
      "Learning rate and weight decay",
      "GPU memory allocation"
    ],
    "a": 1,
    "x": "DP-SGD clips per-sample gradients and adds Gaussian noise. Smaller $\\epsilon$ provides tighter mathematical guarantees that individual training records cannot be reconstructed."
  },
  {
    "tag": "Federated Learning FedAvg Aggregation Algorithm",
    "lvl": "advanced",
    "q": "In Federated Learning (McMahan et al., 2017), how does the central server aggregate client updates under the **FedAvg (Federated Averaging)** algorithm?",
    "o": [
      "Collects raw user training data to a central database",
      "Clients compute local SGD updates on their private decentralized data and send only weight parameters $w_{t+1}^k$ to the central server; the server computes the weighted average of client weights $w_{t+1} = \\sum_{k=1}^K \\frac{n_k}{n} w_{t+1}^k$ without ever accessing raw user data",
      "Trains model using reinforcement learning",
      "Averages client loss functions"
    ],
    "a": 1,
    "x": "FedAvg preserves data privacy by leaving raw data on edge devices, transmitting only model parameter weights to the server for weighted averaging."
  },
  {
    "tag": "MLflow Model Lineage & Provenance Tracking",
    "lvl": "advanced",
    "q": "What complete metadata artifact set must an enterprise MLflow run capture to ensure 100% reproducible model builds?",
    "o": [
      "Model accuracy number only",
      "Exact Git commit SHA, dataset version hash/URI, runtime environment lockfile (`conda.yaml`/`requirements.txt`), training hyperparameters, random seeds, and serialized model artifact weights",
      "Developer email address",
      "Screenshot of loss curve"
    ],
    "a": 1,
    "x": "Full ML provenance requires capturing code commit SHA, dataset hash, environment dependencies, hyperparameters, and serialized weights."
  },
  {
    "tag": "Horovod Ring-AllReduce vs Parameter Server",
    "lvl": "advanced",
    "q": "Why is the Ring-AllReduce communication algorithm (Baidu/Horovod) bandwidth-optimal for distributed GPU deep learning training compared to a Parameter Server architecture?",
    "o": [
      "Ring-AllReduce uses TCP only",
      "In Ring-AllReduce, each of the $P$ GPUs communicates only with its 2 immediate ring neighbors, transmitting exactly $2 \\left( \\frac{P-1}{P} \\right) N$ total bytes where communication time is independent of the number of GPUs $P$, eliminating parameter server network bottlenecks",
      "Parameter servers eliminate all networking",
      "Ring-AllReduce does not use gradients"
    ],
    "a": 1,
    "x": "Ring-AllReduce distributes gradient communication evenly across all nodes in a ring, eliminating the central network bottleneck of parameter servers."
  },
  {
    "tag": "Optuna Tree-Structured Parzen Estimator (TPE)",
    "lvl": "advanced",
    "q": "In Bayesian Hyperparameter Optimization with Optuna, how does the TPE algorithm model the probability of hyperparameter candidates?",
    "o": [
      "Evaluates random numbers",
      "Splits observed trials into good ($y < y^*$) and bad ($y \\ge y^*$) groups based on an objective quantile $\\gamma$, fits two separate Kernel Density Estimators $l(x)$ and $g(x)$, and samples candidates that maximize Expected Improvement $\\frac{l(x)}{g(x)}$",
      "Fits linear regression",
      "Uses grid search"
    ],
    "a": 1,
    "x": "TPE constructs non-parametric probability density functions $l(x)$ and $g(x)$ over configuration space, picking parameters that maximize likelihood in the top performance quantile."
  },
  {
    "tag": "LLM Observability: TTFT and Inter-Token Latency",
    "lvl": "advanced",
    "q": "In LLM production monitoring (Langfuse / Phoenix), what is the difference between Time to First Token (TTFT) and Inter-Token Latency (ITL)?",
    "o": [
      "TTFT is for embeddings; ITL is for audio",
      "**TTFT** measures the time taken to process the input prompt (prefill phase) and emit token 1; **ITL** measures the time taken per subsequent generated token (autoregressive decode step), determining perceived streaming smoothness",
      "They are identical metrics",
      "ITL measures network bandwidth"
    ],
    "a": 1,
    "x": "TTFT is bound by prefill compute and KV-cache initialization. ITL is bound by autoregressive token generation memory bandwidth."
  },
  {
    "tag": "Ragas Framework for RAG Evaluation",
    "lvl": "advanced",
    "q": "In the Ragas evaluation framework for Retrieval-Augmented Generation, what does the **Faithfulness** metric mathematically measure?",
    "o": [
      "Total word count of the answer",
      "The proportion of claims in the generated LLM response that can be directly inferred from and grounded in the retrieved context documents ($|\\text{Supported Claims}| / |\\text{Total Claims}|$)",
      "Speed of vector search",
      "BLEU score against Wikipedia"
    ],
    "a": 1,
    "x": "Faithfulness measures hallucination: it breaks generated answers into atomic claims and verifies what percentage are strictly supported by the retrieved context."
  },
  {
    "tag": "NVIDIA Multi-Instance GPU (MIG) Partitioning",
    "lvl": "advanced",
    "q": "How does NVIDIA Multi-Instance GPU (MIG) technology on A100/H100 GPUs prevent multi-tenant noisy neighbor interference in Kubernetes MLOps clusters?",
    "o": [
      "Shares GPU memory in software",
      "Physically partitions the single physical GPU into up to 7 hardware-isolated GPU instances, each with dedicated high-bandwidth memory, crossbar paths, L2 cache slices, and SM compute cores with guaranteed QoS",
      "Compresses GPU VRAM with zstd",
      "Converts GPUs to CPUs"
    ],
    "a": 1,
    "x": "MIG divides the physical silicon into true hardware-isolated instances with dedicated SMs, memory controllers, and cache, ensuring zero performance cross-talk."
  },
  {
    "tag": "Canary Automated Rollback via Prometheus Error Budget",
    "lvl": "advanced",
    "q": "In progressive Canary model deployments with Flagger / Argo Rollouts, how is automated rollback triggered?",
    "o": [
      "Developer clicks a red button",
      "Prometheus queries evaluate real-time SLIs (e.g. 5xx HTTP error rate $> 1\\%$ or p99 latency $> 200\\text{ms}$) during canary traffic increments; if metrics fail error budget thresholds for consecutive evaluation intervals, traffic is instantly rolled back to 0%",
      "Model automatically deletes itself",
      "Rollback occurs on fixed 1-hour timer"
    ],
    "a": 1,
    "x": "Flagger analyzes real-time Prometheus SLI/SLO metrics during canary phases, triggering immediate automated rollbacks if latency or error thresholds breach."
  },
  {
    "tag": "Continuous Training (CT) Trigger Architecture",
    "lvl": "advanced",
    "q": "In mature MLOps Level 2 architectures (Google MLOps maturity model), what automated events trigger the Continuous Training (CT) pipeline?",
    "o": [
      "Manual user button clicks only",
      "Automated events: 1) Data drift alert (PSI threshold breach), 2) Model performance degradation on ground truth feedback, 3) New labeled data volume reaching threshold batch size, or 4) Scheduled calendar retraining cron",
      "Server reboots",
      "Git commit to documentation"
    ],
    "a": 1,
    "x": "Automated CT pipelines trigger on performance degradation, drift alerts, data accumulation thresholds, or cron intervals without human intervention."
  },
  {
    "tag": "Warm Start vs Cold Start Retraining Catastrophic Forgetting",
    "lvl": "advanced",
    "q": "What risk arises when using **Warm Start (fine-tuning existing weights)** versus **Cold Start (training from scratch)** during automated continuous model retraining?",
    "o": [
      "Warm start is slower to converge",
      "Warm start on recent drifted data can cause **Catastrophic Forgetting** where the model optimizes strictly for recent data patterns while degrading performance on historical edge cases and long-tail distributions",
      "Cold start requires zero compute",
      "Warm start corrupts neural activations"
    ],
    "a": 1,
    "x": "Warm starting fine-tunes on recent batches, risking loss of generalizability and catastrophic forgetting of older diverse distribution modes."
  },
  {
    "tag": "MinHash Deduplication on Fine-Tuning Corpora",
    "lvl": "advanced",
    "q": "How does MinHash Locality-Sensitive Hashing (LSH) clean large-scale instruction fine-tuning datasets?",
    "o": [
      "Sorts lines alphabetically",
      "Computes Jaccard similarity across $k$-shingle sets using minimum permutation hashes, clustering near-duplicate prompt-response pairs into hash buckets and pruning redundant samples to prevent memorization and hallucination",
      "Encrypts duplicate samples",
      "Translates duplicates to Spanish"
    ],
    "a": 1,
    "x": "MinHash LSH identifies near-duplicate texts in $O(N)$ time, eliminating repetitive examples that cause fine-tuned models to overfit or memorize prompts."
  },
  {
    "tag": "Adversarial FGSM Perturbation Attack Defenses",
    "lvl": "advanced",
    "q": "What mathematical transformation defines the Fast Gradient Sign Method (FGSM, Goodfellow et al.) adversarial attack, and how is it mitigated?",
    "o": [
      "$x_{\\text{adv}} = x \\times 2$",
      "$x_{\\text{adv}} = x + \\epsilon \\operatorname{sign}(\\nabla_x \\mathcal{L}(\\theta, x, y))$, shifting input features along the loss gradient direction; mitigated by Adversarial Training (injecting perturbed examples during training)",
      "$x_{\\text{adv}} = x - \\nabla_w \\mathcal{L}$",
      "$x_{\\text{adv}} = \\text{sigmoid}(x)$"
    ],
    "a": 1,
    "x": "FGSM adds small gradient-aligned noise that maximizes classification loss while remaining imperceptible to human eyes. Adversarial training regularizes against it."
  },
  {
    "tag": "Model Cards & AI Factsheets Standardization",
    "lvl": "advanced",
    "q": "What standardized sections must an enterprise AI Model Card (Mitchell et al., Google) include for regulatory compliance (EU AI Act)?",
    "o": [
      "Model code only",
      "Intended use scope, out-of-scope applications, demographic evaluation sub-populations, fairness/bias metrics (disparate impact ratio), dataset provenance, and known failure modes",
      "Developer salary",
      "GPU serial numbers"
    ],
    "a": 1,
    "x": "Model cards document model scope, limitations, evaluation fairness across demographic slices, and known risk vectors for governance."
  },
  {
    "tag": "TreeSHAP Polynomial Time Complexity",
    "lvl": "advanced",
    "q": "Why is TreeSHAP (Lundberg et al., Nature MI 2020) orders of magnitude faster than KernelSHAP for production tree model explainability?",
    "o": [
      "TreeSHAP uses neural networks",
      "KernelSHAP requires $O(2^M)$ exponential perturbation samples; TreeSHAP optimizes Shapley value computation down to polynomial time $O(T L D^2)$ (where $T$ is trees, $L$ is leaves, and $D$ is maximum tree depth) by recursive tree path aggregation",
      "TreeSHAP runs in $O(1)$ time",
      "KernelSHAP is single-threaded"
    ],
    "a": 1,
    "x": "TreeSHAP computes exact Shapley values in polynomial time by traversing tree decision paths directly, enabling real-time production explanations."
  },
  {
    "tag": "Carbon Footprint Tracking with CodeCarbon",
    "lvl": "advanced",
    "q": "How does CodeCarbon compute $CO_2$ equivalent emissions generated during deep learning model training?",
    "o": [
      "Estimates emissions from code line count",
      "Monitors real-time GPU/CPU energy consumption (in Joules/kWh) via hardware interfaces (NVIDIA NVML / Intel RAPL) and multiplies power by the localized regional carbon intensity of the underlying electricity grid ($gCO_2e/kWh$)",
      "Measures ambient room temperature",
      "Tracks RAM allocations"
    ],
    "a": 1,
    "x": "CodeCarbon reads hardware power draw via NVML/RAPL and correlates it with regional electrical grid carbon data to measure exact $CO_2$ footprint."
  },
  {
    "tag": "Model Registry Automated Staging Gatekeeping",
    "lvl": "advanced",
    "q": "In an automated CI/CD MLOps pipeline, what gatekeeping criteria must a model pass before promoting from `Staging` to `Production` in the MLflow Model Registry?",
    "o": [
      "Passes unit tests on 1 sample",
      "1) Passes data schema validation, 2) Exceeds challenger baseline performance on golden holdout set, 3) Satisfies p99 latency SLA in staging load test, 4) Passes fairness/bias checks, and 5) Artifact signature verified by Cosign",
      "Model must have zero parameters",
      "Approved automatically without evaluation"
    ],
    "a": 1,
    "x": "Production model promotion requires rigorous multi-gate validation: statistical benchmarks, load testing, bias checks, and cryptographic artifact signing."
  },
  {
    "tag": "Production Metric Logging: Structured JSON Events vs Prometheus Histograms",
    "lvl": "advanced",
    "q": "In high-throughput MLOps observability, why are Prometheus metrics used for real-time alerting while structured JSON logs are routed to data warehouses for deep debugging?",
    "o": [
      "Prometheus cannot store numbers",
      "Prometheus aggregates low-cardinality time-series metrics (e.g. latency histograms, QPS) in RAM for sub-second alerting; high-cardinality metadata (feature vectors, user IDs, model prediction tensors) are emitted as structured JSON event streams to object storage to prevent Prometheus TSDB memory explosion",
      "Prometheus deletes data after 10 seconds",
      "JSON logs cannot be parsed"
    ],
    "a": 1,
    "x": "High cardinality (user IDs, prompt hashes) explodes Prometheus TSDB memory. Prometheus handles low-cardinality aggregates for alerting; Kafka/S3 stores rich event logs."
  },
  {
    "tag": "Model Deprecation and Sunset Policy Lifecycle",
    "lvl": "advanced",
    "q": "When sunsetting a legacy ML model API version (`/v1/predict`), what sequence of operational steps ensures zero consumer disruptions?",
    "o": [
      "Delete model weights immediately",
      "1) Add `Sunset` and `Deprecation` HTTP headers with sunset date, 2) Route telemetry to identify lingering client IDs and notify owners, 3) Execute short brownout periods (simulated temporary 503s), 4) Drain remaining traffic, 5) Archive model artifacts and lineage graphs",
      "Reboot load balancers",
      "Rewrite client applications directly"
    ],
    "a": 1,
    "x": "Deprecating production ML models requires standard HTTP deprecation headers, consumer traffic auditing, brownout tests, and artifact archival."
  }
]);

