/* Project Lab — the parts a blueprint does not carry.

   Three fields per project, chosen because they are the three questions a
   student actually has and a step list does not answer:

     learn    what skill you walk away with, named precisely enough to put on
              a CV and defend in an interview
     proof    what to put in the README so someone believes you built it —
              a number, a recording, a benchmark. "I made a chat app" is not
              evidence; "12k concurrent connections on one 2-vCPU box, here
              is the load test" is
     stretch  where to take it once it works, ordered from an afternoon to a
              term project. This is where the depth lives: the base project
              gets you a working thing, the stretches get you an interesting
              one */
(function (TD) {
  "use strict";

  TD.projectExtras = {

    /* ---------------- Backend ---------------- */

    "url-shortener-analytics": {
      learn: ["Cache-aside with a real hit-rate measurement", "Why 302 and not 301, in terms of a metric", "Getting work off the request path with a queue", "Base-62 encoding and distributed ID generation"],
      proof: "A load-test graph showing P99 redirect latency with the cache warm and cold, and the measured hit rate. State the numbers in the README.",
      stretch: [
        "Add custom aliases with a race-free uniqueness check — insert and catch the constraint violation rather than checking first.",
        "Make IDs distributed: replace the sequence with Snowflake IDs and show that two instances never collide.",
        "Add link expiry and a bot filter, then measure how much of your traffic was never human."
      ]
    },

    "realtime-collaborative-canvas": {
      learn: ["CRDT convergence and why it needs no server-side merge", "WebSocket lifecycle: reconnect, backfill, presence", "Throttling high-frequency events without visible lag", "Snapshotting an append-only structure"],
      proof: "A recording of two browsers editing while one is offline, then reconnecting and converging. That is the demo — the drawing itself is not.",
      stretch: [
        "Add undo/redo that is correct under concurrency — undoing your own operation while someone else edits is genuinely hard.",
        "Implement awareness cursors with interpolation so remote cursors move smoothly at 30 Hz rather than jumping.",
        "Swap Yjs for a CRDT you write yourself for one shape type, to see exactly what it is buying you."
      ]
    },

    "api-rate-limiter-gateway": {
      learn: ["Atomicity as a correctness requirement, not an optimisation", "The four limiter algorithms and their failure modes", "Writing and benchmarking a reverse proxy", "RFC-correct 429 responses"],
      proof: "A benchmark table: requests/sec and added P99 latency with the limiter on and off, plus a test that proves the quota holds under 500 concurrent clients.",
      stretch: [
        "Add per-plan tiers changeable at runtime without a restart.",
        "Implement the local-token-bucket variant with periodic reconciliation and measure how far it drifts from exact.",
        "Make it fail open, then deliberately kill Redis under load and show the graph."
      ]
    },

    "distributed-task-queue": {
      learn: ["At-least-once delivery and idempotent handlers", "Crash recovery through a pending-entries list", "Exponential backoff with jitter, and why jitter matters", "Dead-letter queues that someone actually looks at"],
      proof: "Kill a worker mid-job and show the job completing on another worker, with the timeline. That single demo is the whole project.",
      stretch: [
        "Add priority queues and prove a flood of low-priority jobs cannot starve high-priority ones.",
        "Add scheduled and recurring jobs with a durable timer wheel.",
        "Support job dependencies — a job that runs only after three others succeed."
      ]
    },

    "webhook-delivery-engine": {
      learn: ["HMAC request signing with replay protection", "Per-endpoint circuit breaking", "Designing a retry policy that distinguishes retryable failures", "Building a developer-facing debug surface"],
      proof: "A customer endpoint that returns 500 for two minutes, and the dashboard showing backoff, circuit opening, and successful recovery without duplicate deliveries.",
      stretch: [
        "Add per-endpoint ordered delivery — much harder than it sounds once retries exist.",
        "Implement webhook replay from the portal, with an idempotency key so a replay is safe.",
        "Add subscriber-side rate limiting so a slow customer cannot exhaust your worker pool."
      ]
    },

    "custom-orm-sqlite": {
      learn: ["Building and walking an expression AST", "Parameterised query generation (and never string concatenation)", "Batch loading to avoid N+1", "Forward and reverse migrations"],
      proof: "A test showing the same relation load issuing 2 queries rather than 101, with the SQL logged.",
      stretch: [
        "Add compile-time type safety so a typo in a column name fails to compile.",
        "Implement a query planner hint that warns when a generated query would do a full scan.",
        "Support transactions with savepoints and nested rollback."
      ]
    },

    "multi-tenant-auth-service": {
      learn: ["Password hashing done correctly (Argon2id, with parameters you can justify)", "Asymmetric JWT and why RS256 changes the architecture", "Refresh token rotation and reuse detection", "Tenant isolation at the database level"],
      proof: "A demonstration of refresh-token reuse detection: replay an old refresh token and show the entire family being revoked immediately.",
      stretch: [
        "Add WebAuthn / passkeys as a second factor.",
        "Implement fine-grained permissions with a policy engine rather than role strings.",
        "Add an admin impersonation flow that is fully audited and time-limited."
      ]
    },

    "file-storage-cdn-proxy": {
      learn: ["Resumable uploads and why chunking is not optional on mobile", "Content-addressed storage and free deduplication", "Image transformation pipelines and cache key design", "ETag and conditional requests"],
      proof: "Kill an upload at 60% and resume it. Then show the cache-hit ratio for derivatives and the bytes saved by deduplication.",
      stretch: [
        "Add signed, expiring URLs so private files can be served without an auth round trip.",
        "Generate responsive image sets and modern formats, negotiated by Accept header.",
        "Add virus scanning as an async step that quarantines rather than blocking the upload."
      ]
    },

    "e-commerce-event-driven-saga": {
      learn: ["Sagas and compensating transactions", "The transactional outbox pattern", "Idempotent consumers", "Why two-phase commit is not an option here"],
      proof: "Force a payment failure mid-saga and show the compensations running in reverse, with the ledger showing both the charge and the refund.",
      stretch: [
        "Add a reservation TTL and a sweeper so abandoned carts return stock automatically.",
        "Introduce a deliberate duplicate message and prove the consumer is idempotent.",
        "Build a saga inspector UI answering 'where is order X stuck' in one query."
      ]
    },

    "high-throughput-chat-engine": {
      learn: ["epoll and the C10K problem in practice", "Time-bucketed partitioning for message history", "Fan-out strategies and the hot-channel problem", "Tuning file descriptor and socket buffer limits"],
      proof: "A load test holding tens of thousands of concurrent connections on one machine, with the memory-per-connection figure and the kernel settings you had to change.",
      stretch: [
        "Add a hybrid fan-out for very large channels, mirroring the celebrity problem in feeds.",
        "Implement message search over history without scanning every partition.",
        "Add end-to-end encryption and confront what it costs you in server-side features."
      ]
    },

    /* ---------------- AI, ML & vision ---------------- */

    "neural-network-from-scratch-numpy": {
      learn: ["Reverse-mode autodiff, implemented rather than described", "Why initialisation and learning rate dominate early training", "The optimiser family from SGD to Adam", "Reading a loss curve"],
      proof: "Gradient-check every operation against a numerical finite-difference estimate and show the agreement to 1e-7. That test is the credibility of the whole project.",
      stretch: [
        "Add convolution and pooling, then train on CIFAR-10.",
        "Implement batch normalisation and show its effect on the loss curve at a high learning rate.",
        "Add a simple graph optimiser that fuses adjacent operations and measure the speedup."
      ]
    },

    "autonomous-lane-detection": {
      learn: ["Camera calibration and why undistortion comes first", "Colour spaces, and why HLS beats RGB for this", "Perspective transforms", "Fitting and smoothing a curve over time"],
      proof: "A side-by-side video with the pipeline's intermediate stages visible, plus the failure cases — shadows, worn markings, rain — named honestly.",
      stretch: [
        "Add temporal smoothing so the fit does not jitter frame to frame.",
        "Detect when the lane fit is unreliable and say so, rather than reporting a confident wrong lane.",
        "Compare against a small segmentation model and quantify where classical CV still wins."
      ]
    },

    "realtime-object-tracking-vision": {
      learn: ["Detection versus tracking, and why you need both", "Kalman filtering for motion prediction", "The Hungarian algorithm for assignment", "Homography for real-world measurement"],
      proof: "A speed measurement validated against a known ground truth, with the error stated. An unvalidated speed number is decoration.",
      stretch: [
        "Add re-identification so an object occluded for two seconds keeps its ID.",
        "Export to ONNX and TensorRT, then report the FPS gain and any accuracy loss.",
        "Handle multiple cameras with overlapping views and merge tracks across them."
      ]
    },

    "multimodal-image-search-engine": {
      learn: ["Joint embedding spaces", "Approximate nearest neighbour and the recall/latency trade-off", "Filtered vector search", "Evaluating retrieval with recall@k"],
      proof: "A recall@10 measurement against a hand-labelled query set, plus the latency at 1M vectors with HNSW parameters stated.",
      stretch: [
        "Add negative queries ('a dog, not on grass') and see where CLIP breaks down.",
        "Implement query-by-image as well as by text and compare the result quality.",
        "Quantise the vectors to int8 and measure the recall loss against the memory saved."
      ]
    },

    "time-series-anomaly-detection": {
      learn: ["Autoencoders for unsupervised anomaly detection", "Why a fixed threshold fails on non-stationary data", "Extreme value theory for dynamic thresholding", "Alert fatigue as an engineering problem"],
      proof: "Precision and recall on injected synthetic anomalies, plus the false-positive rate per day — which is the number that decides whether anyone keeps the alerts on.",
      stretch: [
        "Add seasonality decomposition so a Monday-morning spike is not an anomaly.",
        "Support multivariate anomalies where no single metric looks unusual.",
        "Add root-cause hints by ranking which input contributed most to the reconstruction error."
      ]
    },

    "semantic-segmentation-medical": {
      learn: ["Encoder–decoder architectures and skip connections", "Loss functions for severe class imbalance", "Medical-grade augmentation", "Evaluating with Dice and Hausdorff rather than accuracy"],
      proof: "Per-case Dice scores with a distribution, not a mean — and the worst five cases shown. Reporting only the mean hides exactly what a clinician cares about.",
      stretch: [
        "Add uncertainty estimation via MC dropout so the model can flag cases for review.",
        "Move to 3D convolutions over the full volume and compare against slice-wise 2D.",
        "Test generalisation on data from a different scanner and quantify the drop."
      ]
    },

    "speech-emotion-recognition": {
      learn: ["Audio feature extraction and mel scaling", "Combining convolutional and recurrent layers", "Attention pooling over variable-length input", "Streaming inference in a browser"],
      proof: "A confusion matrix over the held-out set, and an honest note on which emotion pairs the model confuses — because it will confuse some.",
      stretch: [
        "Add speaker normalisation and measure the gain on unseen speakers.",
        "Test cross-corpus: train on RAVDESS, evaluate on TESS, and report the drop.",
        "Replace the front-end with a pretrained speech encoder and compare."
      ]
    },

    "graph-neural-network-fraud": {
      learn: ["Message passing and neighbourhood aggregation", "Building a graph from tabular data", "Handling extreme class imbalance", "Explaining a graph model's decision"],
      proof: "Precision@k at your actual review capacity, compared against a gradient-boosted baseline on the same features. If the GNN does not beat it, say so.",
      stretch: [
        "Make it temporal so edges have timestamps and the model cannot see the future.",
        "Add inductive inference for accounts that did not exist at training time.",
        "Implement subgraph sampling so it scales past what fits in GPU memory."
      ]
    },

    "reinforcement-learning-robotics": {
      learn: ["Policy gradients and the PPO clipped objective", "Reward shaping, and how easily it goes wrong", "Vectorised environments", "Domain randomisation for sim-to-real"],
      proof: "A reward curve with several seeds plotted, not one. A single lucky seed is the most common way RL results mislead.",
      stretch: [
        "Deliberately design a reward the agent can hack, then show it hacking it.",
        "Add curriculum learning and measure whether it actually helps.",
        "Try transferring to a physical robot or a much-perturbed simulator."
      ]
    },

    "custom-diffusion-model-scratch": {
      learn: ["The forward and reverse diffusion processes", "Why predicting noise beats predicting the image", "Classifier-free guidance", "Fast samplers and the quality trade-off"],
      proof: "A guidance-scale sweep image grid showing the fidelity/diversity trade-off, plus an FID score against a baseline.",
      stretch: [
        "Move to latent diffusion with a trained autoencoder and compare the compute per step.",
        "Add inpainting by replacing the known region at every denoising step.",
        "Distil into a few-step consistency model and measure the quality you lose."
      ]
    },

    /* ---------------- LLM & agents ---------------- */

    "structured-json-extractor": {
      learn: ["Grammar-constrained decoding", "Compiling a schema into a token mask", "Why prompt-and-repair is not a guarantee", "Batch inference throughput"],
      proof: "A 1,000-document run with a 100% schema-valid rate, next to the same run with prompting alone. The gap is the entire argument for the project.",
      stretch: [
        "Add confidence scores per field from token log-probabilities.",
        "Support nested and recursive schemas, where naive grammar compilation falls over.",
        "Benchmark the throughput cost of the mask and optimise the automaton."
      ]
    },

    "smart-document-chat-ocr": {
      learn: ["OCR pre-processing and when it is needed", "Chunking that preserves provenance", "Conversational memory and query rewriting", "Citations that can be verified"],
      proof: "Every answer links to a page, and clicking it lands on the paragraph. Demonstrate one answer that correctly says the document does not contain the information.",
      stretch: [
        "Add table extraction — the single hardest part of real document QA.",
        "Handle multi-document questions requiring evidence from two sources.",
        "Add a confidence score and a refusal threshold, then measure both."
      ]
    },

    "local-voice-ai-assistant": {
      learn: ["Latency budgeting across a pipeline", "Streaming inference and partial results", "Voice activity detection", "Barge-in and cancellation"],
      proof: "A latency waterfall showing each stage's contribution to time-to-first-audio, measured, not estimated.",
      stretch: [
        "Add tool calling so the assistant can actually do something, and keep the latency budget.",
        "Support interruption mid-sentence with graceful audio fade rather than a hard cut.",
        "Run the whole thing on a Raspberry Pi and report what you had to give up."
      ]
    },

    "prompt-injection-firewall": {
      learn: ["Direct versus indirect prompt injection", "Layered defence and why no single layer suffices", "Canary tokens", "The cost of false positives in a security filter"],
      proof: "A red-team corpus of 100+ injection attempts with your true-positive and false-positive rates. Include the attacks that got through.",
      stretch: [
        "Add output-side scanning for the markdown image exfiltration channel.",
        "Test against encoded and multilingual injections, which defeat most naive filters.",
        "Measure the latency the firewall adds and decide whether it is acceptable."
      ]
    },

    "multi-agent-research-analyst": {
      learn: ["Graph-based agent orchestration versus chains", "Tool design and error messages that let an agent recover", "Adversarial self-checking", "Bounding a loop that could otherwise run forever"],
      proof: "A generated report with every claim traceable to a source, and a log showing the critic actually rejecting and forcing a retry at least once.",
      stretch: [
        "Add a cost budget that halts the run and reports partial findings rather than overspending.",
        "Add source-quality weighting so a forum post does not outrank a filing.",
        "Run the same brief three times and measure how much the output varies."
      ]
    },

    "multimodal-rag-enterprise": {
      learn: ["Hybrid retrieval and rank fusion", "Cross-encoder reranking", "Chunking strategies that preserve context", "Per-stage RAG evaluation"],
      proof: "A retrieval recall@k number and an end-to-end faithfulness score, reported separately. A single end-to-end number tells you nothing about where to improve.",
      stretch: [
        "Add multi-hop question decomposition.",
        "Add per-document access control and prove a user cannot retrieve what they cannot read.",
        "Measure the quality gain from each stage independently and drop anything that does not earn its latency."
      ]
    },

    "llm-eval-benchmark-harness": {
      learn: ["Designing a rubric two people would agree on", "Validating an LLM judge against human grades", "Statistical significance for small eval sets", "Treating prompts as versioned code"],
      proof: "The judge-to-human agreement rate on a sampled subset. Without it, every number the harness produces is unvalidated.",
      stretch: [
        "Add pairwise comparison with position randomisation and compare against absolute scoring.",
        "Add cost and latency as first-class gates alongside quality.",
        "Detect eval-set staleness by comparing its distribution against production traffic."
      ]
    },

    "fine-tuned-code-reviewer": {
      learn: ["QLoRA and the memory arithmetic that makes it fit", "Building a preference dataset from real signals", "DPO and why the partition function cancels", "Detecting catastrophic forgetting"],
      proof: "A held-out comparison against the base model, judged blind, plus a general-capability benchmark before and after to show what tuning cost you.",
      stretch: [
        "Serve several adapters over one base model and measure the memory saved.",
        "Add retrieval of the repository's own conventions so reviews match house style.",
        "Measure the acceptance rate of the bot's comments in a real repository."
      ]
    },

    "speculative-decoding-inference": {
      learn: ["Why decoding is memory-bandwidth-bound", "Rejection sampling and distribution preservation", "KV cache paging", "Profiling GPU work properly"],
      proof: "A statistical test showing the output distribution matches the target model's, plus tokens/sec with and without speculation and the measured acceptance rate.",
      stretch: [
        "Make the draft length adaptive based on a running acceptance rate.",
        "Try self-speculation using early layers as the draft, removing the second model.",
        "Combine with continuous batching and find where the two interact badly."
      ]
    },

    "autonomous-coding-agent": {
      learn: ["The ReAct loop and step budgeting", "Sandboxing untrusted generated code", "Context compaction over long runs", "Verification as the only reliable success signal"],
      proof: "A SWE-bench-lite score, plus a per-step breakdown: how often the right tool was chosen, and how often a failing action repeated.",
      stretch: [
        "Add a planning phase that writes tests first, then makes them pass.",
        "Add multi-file refactoring, where context management genuinely becomes the bottleneck.",
        "Deliberately plant a prompt injection in a repository file and confirm the sandbox contains it."
      ]
    },

    /* ---------------- Systems ---------------- */

    "custom-shell-posix": {
      learn: ["fork, exec, wait and the relationship between them", "File descriptor manipulation with dup2", "Process groups and signal handling", "Why redirection happens between fork and exec"],
      proof: "Run a three-stage pipeline with redirection and job control, and show Ctrl-C killing the foreground job without killing the shell.",
      stretch: [
        "Add job control: background jobs, fg, bg, and a jobs table.",
        "Implement command substitution and here-documents.",
        "Add tab completion using the terminal in raw mode."
      ]
    },

    "memory-allocator-malloc": {
      learn: ["Heap layout and block metadata", "Fragmentation, internal and external", "O(1) coalescing with boundary tags", "Benchmarking allocator throughput and utilisation"],
      proof: "A benchmark against glibc malloc on several allocation patterns, reporting both throughput and peak memory. Losing on speed but winning on fragmentation is a real result.",
      stretch: [
        "Add thread-local arenas and measure the contention you removed.",
        "Implement a slab allocator for fixed-size objects.",
        "Add a debug mode with guard pages and use-after-free detection."
      ]
    },

    "p2p-bittorrent-client": {
      learn: ["Binary protocol implementation from a specification", "Bencoding and metadata parsing", "Piece selection strategy and its effect on swarm health", "Concurrent connection management"],
      proof: "Download a real public torrent to completion with hash verification passing, and a graph of download rate against peer count.",
      stretch: [
        "Implement seeding, including the tit-for-tat choking algorithm.",
        "Add DHT so it works with no tracker at all.",
        "Add magnet link support, which requires fetching metadata from peers."
      ]
    },

    "redis-from-scratch": {
      learn: ["Event-driven single-threaded server design", "Implementing a wire protocol", "Incremental rehashing without a pause", "Lazy and active expiry strategies"],
      proof: "Run `redis-benchmark` against your server. Compatibility with the real client is the proof; the ops/sec number is the bonus.",
      stretch: [
        "Add sorted sets with a skip list — the most interesting data structure in Redis.",
        "Implement replication with a replica that can catch up from a partial resync.",
        "Add Lua scripting and confront what atomicity means for it."
      ]
    },

    "container-runtime-cgroups": {
      learn: ["Linux namespaces, one at a time", "pivot_root and mount propagation", "cgroups v2 resource limits", "OverlayFS and layered images"],
      proof: "Run a real image, show the process seeing itself as PID 1, then prove a memory limit by having the container OOM while the host is fine.",
      stretch: [
        "Add user namespaces for rootless containers — the hardest namespace to get right.",
        "Implement image pulling from a registry with layer caching.",
        "Add a network bridge with port forwarding between containers."
      ]
    },

    "lisp-compiler-bytecode-vm": {
      learn: ["Lexing and recursive-descent parsing", "Designing an instruction set", "Dispatch loop performance", "Mark-and-sweep garbage collection with a correct root set"],
      proof: "Run a non-trivial program — a metacircular evaluator, or a recursive benchmark — and report the instruction dispatch rate.",
      stretch: [
        "Add closures and proper tail calls so deep recursion does not grow the stack.",
        "Implement a generational GC and measure the pause-time improvement.",
        "Add a simple JIT for hot loops."
      ]
    },

    "custom-http3-quic-server": {
      learn: ["Building reliability on an unreliable transport", "Connection IDs and migration", "Loss recovery and congestion control", "Reading an RFC and implementing it faithfully"],
      proof: "Interoperate with a real client — curl with HTTP/3, or a browser. Interop against an independent implementation is the only proof that matters for a protocol.",
      stretch: [
        "Implement connection migration and demonstrate a transfer surviving a network change.",
        "Add 0-RTT resumption, and handle the replay risk correctly.",
        "Implement a second congestion controller and compare them on a lossy link."
      ]
    },

    "ebpf-network-profiler": {
      learn: ["eBPF's execution model and the verifier's constraints", "XDP and kprobes as different attachment points", "BPF maps and ring buffers", "Low-overhead production profiling"],
      proof: "Measure the overhead your probes add under load. An observability tool that costs 15% CPU is not one you can run in production.",
      stretch: [
        "Add TCP retransmission and RTT tracking per flow.",
        "Build continuous profiling with stack sampling and flame graphs.",
        "Add a CO-RE build so one binary runs across kernel versions."
      ]
    },

    "raft-distributed-kv": {
      learn: ["Leader election and split-vote avoidance", "Log replication and the commit rule", "Snapshotting and log compaction", "Testing distributed systems under partition"],
      proof: "A Jepsen-style test: partition the cluster during writes and show linearizability holding. Passing that is the project.",
      stretch: [
        "Add membership changes — adding and removing nodes safely is where most Raft implementations break.",
        "Add read-only queries served without a full round trip using lease reads.",
        "Implement pre-vote to stop a partitioned node disrupting the cluster on rejoin."
      ]
    },

    "distributed-load-balancer-l4": {
      learn: ["Packet-level networking and checksum handling", "Maglev hashing and why it beats naive consistent hashing here", "Connection tracking", "Direct server return"],
      proof: "Throughput in packets-per-second per core, and a demonstration that removing a backend does not break existing flows to other backends.",
      stretch: [
        "Move the data path into XDP and compare the packet rate.",
        "Add weighted backends for heterogeneous hardware.",
        "Add health-check-driven table rebuilds and measure the disruption during one."
      ]
    },

    /* ---------------- Data ---------------- */

    "data-quality-monitoring-suite": {
      learn: ["Expressing data expectations declaratively", "Schema drift detection", "Where to fail a pipeline versus warn", "Making a report someone will actually read"],
      proof: "Catch a real problem in a real dataset. Manufacture one if you must, but show the report that caught it and the pipeline run that failed.",
      stretch: [
        "Add distribution drift detection with PSI, not just schema changes.",
        "Add anomaly detection on the metrics themselves, so thresholds adapt.",
        "Integrate with a data catalogue so failures annotate the affected tables."
      ]
    },

    "etl-pipeline-observability": {
      learn: ["Parsing SQL into an AST", "Column-level lineage", "Impact analysis", "Graph visualisation that stays readable past 50 nodes"],
      proof: "Point it at a real dbt project and produce the lineage graph. Then answer 'what breaks if I drop this column' correctly.",
      stretch: [
        "Add cross-system lineage spanning a warehouse and a streaming job.",
        "Detect unused columns — often the highest-value output of a lineage tool.",
        "Add freshness tracking so the graph shows staleness, not just structure."
      ]
    },

    "realtime-clickstream-pipeline": {
      learn: ["Event time versus processing time", "Watermarks and late-data handling", "Exactly-once semantics and what they really guarantee", "Columnar OLAP schema design"],
      proof: "Deliberately inject late and out-of-order events and show the pipeline handling them, with the late-arrival count visible on the dashboard.",
      stretch: [
        "Add session windows with a dynamic gap, which is much harder than fixed windows.",
        "Add a real-time funnel with per-step conversion and drop-off.",
        "Implement backfill from historical data through the same pipeline code."
      ]
    },

    "cdc-stream-processor": {
      learn: ["Logical decoding and replication slots", "Idempotent sinks", "Schema evolution across a pipeline", "Replication lag as an operational risk"],
      proof: "Show end-to-end lag under sustained write load, and demonstrate that stopping the consumer grows the slot — the failure mode that takes the database down.",
      stretch: [
        "Handle schema changes without stopping the pipeline.",
        "Add an initial snapshot phase that transitions cleanly into streaming.",
        "Add exactly-once sink semantics with a transactional write."
      ]
    },

    "geospatial-h3-indexing-pipeline": {
      learn: ["Hierarchical spatial indexing", "Why hexagons and what the 12 pentagons cost", "Vectorised analytics on columnar data", "Map visualisation at scale"],
      proof: "A benchmark of k-ring neighbour queries against an equivalent PostGIS radius query, with both timings.",
      stretch: [
        "Add time as a second dimension for spatio-temporal aggregation.",
        "Implement a surge-pricing style supply/demand ratio smoothed over the k-ring.",
        "Handle the pentagon cells correctly and write a test that covers one."
      ]
    },

    "dag-workflow-orchestrator": {
      learn: ["Topological sorting and cycle detection", "Distributed task claiming without a lock service", "Retry and backfill semantics", "Rendering a live graph"],
      proof: "Run several schedulers concurrently and prove no task executes twice, with the SKIP LOCKED query shown.",
      stretch: [
        "Add dynamic task generation, where a task's output determines the next tasks.",
        "Add SLA monitoring with alerts on a DAG missing its window.",
        "Implement backfill over a date range with configurable parallelism."
      ]
    },

    "columnar-parquet-query-engine": {
      learn: ["Columnar layout and encoding schemes", "Predicate pushdown and statistics-based pruning", "Vectorised execution", "Using SIMD deliberately"],
      proof: "A benchmark against DuckDB on the same Parquet file. Losing is fine; not knowing why you lost is not.",
      stretch: [
        "Add joins with a vectorised hash join.",
        "Add late materialisation so filtered-out rows never have their other columns decoded.",
        "Implement parallel scan across row groups and measure the scaling."
      ]
    },

    "distributed-mapreduce-engine": {
      learn: ["Master–worker coordination", "Hash partitioning and the shuffle", "Idempotent task design for fault tolerance", "Straggler mitigation"],
      proof: "Kill a worker mid-job and show the job completing correctly, plus a scaling curve from 1 to 8 workers.",
      stretch: [
        "Add combiners to reduce shuffle volume and measure the bytes saved.",
        "Implement speculative execution for stragglers.",
        "Add a second job type chained off the first, forming a small pipeline."
      ]
    },

    "lakehouse-iceberg-metadata-engine": {
      learn: ["Optimistic concurrency over object storage", "Metadata trees and snapshot isolation", "File-level pruning from manifest statistics", "Time travel as a consequence of immutability"],
      proof: "Two concurrent writers, one of which must retry, with both results correct and no lost update. That test is the whole point of OCC.",
      stretch: [
        "Add partition evolution — changing the partitioning without rewriting data.",
        "Implement compaction of small files with no reader downtime.",
        "Add row-level deletes with delete files rather than rewriting."
      ]
    },

    "distributed-timeseries-aggregator": {
      learn: ["Delta-of-delta and XOR compression", "Memory-mapped storage", "Inverted indexes for label matching", "Writing a small query language evaluator"],
      proof: "Bytes-per-sample achieved on real metric data, compared against the uncompressed 16 bytes. Under 2 bytes is the target.",
      stretch: [
        "Add downsampling with mergeable quantile sketches rather than averages.",
        "Implement PromQL range vectors and rate() correctly, including counter resets.",
        "Add a remote-write endpoint so Prometheus can ship data to it."
      ]
    },

    /* ---------------- Security ---------------- */

    "shamir-secret-sharing-vault": {
      learn: ["Finite field arithmetic", "Polynomial interpolation", "Information-theoretic versus computational security", "Building a CLI people can use under stress"],
      proof: "A test proving that any k-1 shares yield no information — show that every candidate secret remains equally consistent with the shares held.",
      stretch: [
        "Add verifiable secret sharing so a share holder can detect a corrupted share.",
        "Add a threshold-change operation without reconstructing the secret.",
        "Generate printable paper backups with error-correcting codes."
      ]
    },

    "dns-sinkhole-adblocker": {
      learn: ["Binary protocol parsing including name compression", "Trie structures for domain matching", "DNS caching and TTL correctness", "DoH and what it changes about privacy"],
      proof: "Run it as your actual resolver for a week and report the block rate and the queries-per-second it sustained.",
      stretch: [
        "Add per-client policies so one device on the network gets different rules.",
        "Add DNSSEC validation.",
        "Add regex and wildcard rules without destroying lookup performance."
      ]
    },

    "honey-pot-ssh-logger": {
      learn: ["Implementing enough of a protocol to be convincing", "Safe capture of hostile input", "Threat intelligence enrichment", "Operational isolation"],
      proof: "Deploy on an isolated cloud host and report a week of real attack data: top credentials, top source countries, and the payloads collected.",
      stretch: [
        "Emulate a more convincing filesystem so sessions last longer and yield more.",
        "Add automatic malware sample submission to an analysis service.",
        "Correlate against public threat feeds and report novel sources."
      ]
    },

    "packet-sniffer-ids": {
      learn: ["Raw sockets and protocol dissection", "TCP stream reassembly", "Signature matching and evasion", "Detection rules with a tolerable false-positive rate"],
      proof: "Detect a port scan and a fragmented attack payload that a per-packet matcher would miss. The second one is the interesting demo.",
      stretch: [
        "Add TLS fingerprinting (JA3) to identify clients without decrypting.",
        "Add flow-based anomaly detection alongside signatures.",
        "Move the capture path to AF_XDP and measure the packet rate gain."
      ]
    },

    "static-code-vuln-scanner": {
      learn: ["AST-based pattern matching", "Taint analysis: sources, sinks and sanitisers", "Balancing false positives against recall", "SARIF and tool interoperability"],
      proof: "Run against a deliberately vulnerable application and report both the vulnerabilities found and the ones missed. Reporting only the hits is not an evaluation.",
      stretch: [
        "Add inter-procedural analysis so taint flows across function boundaries.",
        "Support a second language and see how much of the engine was actually language-agnostic.",
        "Add autofix suggestions for the simplest rule classes."
      ]
    },

    "zero-trust-proxy-mtls": {
      learn: ["Running a small internal PKI", "Mutual TLS and identity extraction", "Policy as code with Rego", "Audit logging that supports an investigation"],
      proof: "Show a request denied by policy, with the audit entry naming the identity, the rule and the reason. Then show the same request allowed after a policy change.",
      stretch: [
        "Add automatic certificate rotation with no dropped connections.",
        "Add policy testing in CI so a bad rule cannot be deployed.",
        "Build an access graph showing which services actually call which, versus which are permitted to."
      ]
    },

    "end-to-end-encrypted-chat": {
      learn: ["Diffie-Hellman key agreement", "KDF chains and the double ratchet", "Forward secrecy and post-compromise security", "Handling out-of-order and lost messages"],
      proof: "Demonstrate that compromising the current key does not decrypt captured earlier messages. That property is the reason the ratchet exists.",
      stretch: [
        "Add group messaging, where the ratchet no longer works directly and you need sender keys.",
        "Add multi-device support with per-device sessions.",
        "Add a safety-number verification flow so users can detect a man in the middle."
      ]
    },

    "fuzzing-engine-binary": {
      learn: ["Coverage instrumentation", "Genetic mutation strategies", "Fork servers and execution throughput", "Crash triage and deduplication"],
      proof: "Find a real bug in a real library. Failing that, plant one and report executions-per-second and time-to-discovery.",
      stretch: [
        "Add a structure-aware mutator for a specific input format and compare the coverage curve.",
        "Add concolic execution to get past magic-byte comparisons that random mutation cannot.",
        "Implement corpus minimisation so the seed set stays small and fast."
      ]
    },

    "kernel-rootkit-detector": {
      learn: ["Kernel module development", "Syscall table integrity checking", "Direct kernel object manipulation and how to detect it", "Working safely in kernel space"],
      proof: "Write a simple rootkit yourself in a VM, then detect it. Building both sides is what makes the detector credible.",
      stretch: [
        "Detect ftrace-based hooking, which is subtler than syscall table patching.",
        "Add memory forensics comparing on-disk and in-memory module text.",
        "Detect hidden network connections by comparing kernel state to /proc/net."
      ]
    },

    "automated-ddos-mitigation-xdp": {
      learn: ["XDP and where it sits in the kernel network path", "SYN cookies as stateless connection validation", "Bloom filters in BPF maps", "Measuring packet-rate capacity"],
      proof: "Generate a SYN flood and report the packets-per-second dropped per core, with legitimate traffic still completing handshakes throughout.",
      stretch: [
        "Add adaptive thresholds so mitigation engages only under attack.",
        "Handle amplification attacks (DNS, NTP) as well as SYN floods.",
        "Add per-source reputation that decays over time."
      ]
    }
  };
})(window.TD = window.TD || {});
