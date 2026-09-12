/* Project Lab — architecture blueprints.

   One spec per project, keyed by project id, rendered to SVG by TD.blueprint.
   These live in their own file rather than inside each project entry so the
   whole set can be reviewed together — a diagram language only works if every
   diagram in it uses the same vocabulary.

   Grid convention: row 0 is ingress at the top, rows increase downward, and
   the left-to-right axis follows the request as it travels. */
(function (TD) {
  "use strict";

  TD.projectBlueprints = {

    /* ================= Backend ================= */

    "url-shortener-analytics": {
      title: "Redirect path and the telemetry that hangs off it",
      nodes: [
        { id: "b", label: "Browser", sub: "GET /r/:code", kind: "client", col: 0, row: 1 },
        { id: "gw", label: "Redirect service", sub: "Go · stateless", kind: "service", col: 1, row: 1 },
        { id: "rd", label: "Redis", sub: "code → url, 24h TTL", kind: "cache", col: 2, row: 0 },
        { id: "pg", label: "PostgreSQL", sub: "B-tree on code", kind: "store", col: 2, row: 2 },
        { id: "ch", label: "Event channel", sub: "buffered, non-blocking", kind: "queue", col: 1, row: 3 },
        { id: "wk", label: "Analytics worker", sub: "UA parse · GeoIP2", kind: "worker", col: 2, row: 3 },
        { id: "cs", label: "Clickstream table", sub: "partitioned by day", kind: "store", col: 3, row: 3 }
      ],
      edges: [
        { from: "b", to: "gw", label: "HTTPS" },
        { from: "gw", to: "rd", label: "hit ≈95%" },
        { from: "gw", to: "pg", label: "miss → fill" },
        { from: "gw", to: "ch", label: "fire & forget", dashed: true },
        { from: "ch", to: "wk" },
        { from: "wk", to: "cs" }
      ],
      groups: [{ label: "Off the request path", cols: [1, 3], rows: [3, 3] }],
      note: "The redirect answers from Redis and returns **302** before the click event is written. Telemetry must never be able to slow a redirect down."
    },

    "realtime-collaborative-canvas": {
      title: "Two peers converging through a relay they do not have to trust",
      nodes: [
        { id: "a", label: "Client A", sub: "Konva canvas · Y.Doc", kind: "client", col: 0, row: 0 },
        { id: "c", label: "Client B", sub: "Konva canvas · Y.Doc", kind: "client", col: 3, row: 0 },
        { id: "ws", label: "Sync server", sub: "Node · y-websocket", kind: "service", col: 1, row: 1, span: 2 },
        { id: "ps", label: "Redis pub/sub", sub: "cross-instance fanout", kind: "queue", col: 1, row: 2 },
        { id: "db", label: "LevelDB", sub: "periodic doc snapshots", kind: "store", col: 2, row: 2 }
      ],
      edges: [
        { from: "a", to: "ws", label: "binary delta" },
        { from: "c", to: "ws", label: "binary delta" },
        { from: "ws", to: "ps", label: "broadcast" },
        { from: "ws", to: "db", label: "snapshot" }
      ],
      note: "The server never resolves conflicts — it only relays updates. Convergence is a property of the **CRDT**, which is what lets a client work offline and merge cleanly on reconnect."
    },

    "api-rate-limiter-gateway": {
      title: "One atomic decision per request, then proxy or reject",
      nodes: [
        { id: "cl", label: "API client", sub: "X-API-Key", kind: "client", col: 0, row: 1 },
        { id: "gw", label: "Limiter gateway", sub: "Go reverse proxy", kind: "service", col: 1, row: 1 },
        { id: "rd", label: "Redis", sub: "Lua: check + increment", kind: "cache", col: 2, row: 0 },
        { id: "up", label: "Upstream service", sub: "receives allowed traffic", kind: "service", col: 3, row: 1 },
        { id: "rj", label: "429 + Retry-After", sub: "rejected", kind: "note", col: 2, row: 2 },
        { id: "pm", label: "Prometheus", sub: "allowed / rejected", kind: "external", col: 3, row: 2 }
      ],
      edges: [
        { from: "cl", to: "gw" },
        { from: "gw", to: "rd", label: "1 round trip" },
        { from: "gw", to: "up", label: "allowed" },
        { from: "gw", to: "rj", label: "over quota" },
        { from: "gw", to: "pm", dashed: true, muted: true }
      ],
      note: "The check and the increment happen inside **one Lua script**. Splitting them into GET then SET is a race that lets bursts through under exactly the load the limiter exists for."
    },

    "distributed-task-queue": {
      title: "At-least-once delivery with crash recovery",
      nodes: [
        { id: "api", label: "Producer API", sub: "enqueue job", kind: "service", col: 0, row: 1 },
        { id: "st", label: "Redis Stream", sub: "consumer group + PEL", kind: "queue", col: 1, row: 1 },
        { id: "w1", label: "Worker A", sub: "XREADGROUP · XACK", kind: "worker", col: 2, row: 0 },
        { id: "w2", label: "Worker B", sub: "XREADGROUP · XACK", kind: "worker", col: 2, row: 2 },
        { id: "cl", label: "Claim daemon", sub: "XPENDING · XCLAIM", kind: "worker", col: 3, row: 1 },
        { id: "dlq", label: "Dead-letter queue", sub: "after 5 attempts", kind: "store", col: 3, row: 2 },
        { id: "ui", label: "Monitor UI", sub: "WebSocket live counts", kind: "client", col: 0, row: 2 }
      ],
      edges: [
        { from: "api", to: "st", label: "XADD" },
        { from: "st", to: "w1" },
        { from: "st", to: "w2" },
        { from: "cl", to: "st", label: "reclaim stale", dashed: true },
        { from: "w2", to: "dlq", label: "exhausted" },
        { from: "st", to: "ui", muted: true, dashed: true }
      ],
      note: "The **pending entries list** is what makes crash recovery possible: a job read but never acknowledged stays visible, so the claim daemon can hand it to another worker."
    },

    "webhook-delivery-engine": {
      title: "Signed delivery with per-endpoint circuit breaking",
      nodes: [
        { id: "src", label: "Producing service", sub: "domain event", kind: "service", col: 0, row: 1 },
        { id: "ing", label: "Ingestion API", sub: "match subscriptions", kind: "service", col: 1, row: 1 },
        { id: "pg", label: "PostgreSQL", sub: "subscriptions + attempts", kind: "store", col: 1, row: 2 },
        { id: "q", label: "Delivery queue", sub: "per-endpoint, backoff", kind: "queue", col: 2, row: 1 },
        { id: "d", label: "Dispatcher", sub: "HMAC-SHA256 sign", kind: "worker", col: 3, row: 0 },
        { id: "cb", label: "Circuit breaker", sub: "per endpoint", kind: "note", col: 3, row: 1 },
        { id: "cust", label: "Customer endpoint", sub: "may be slow or down", kind: "external", col: 4, row: 0 },
        { id: "portal", label: "Developer portal", sub: "replay + inspect", kind: "client", col: 4, row: 2 }
      ],
      edges: [
        { from: "src", to: "ing" },
        { from: "ing", to: "pg" },
        { from: "ing", to: "q" },
        { from: "q", to: "d" },
        { from: "d", to: "cust", label: "POST + signature" },
        { from: "d", to: "cb", dashed: true },
        { from: "pg", to: "portal", muted: true, dashed: true }
      ],
      note: "Every attempt is recorded, so a failed delivery can be replayed by hand. The **signature covers a timestamp** as well as the body, or a captured payload can be replayed against the customer forever."
    },

    "custom-orm-sqlite": {
      title: "From a chained expression to one SQL statement",
      nodes: [
        { id: "app", label: "Application code", sub: "User.where(...).limit(10)", kind: "client", col: 0, row: 1 },
        { id: "qb", label: "Query builder", sub: "records intent, runs nothing", kind: "service", col: 1, row: 1 },
        { id: "ast", label: "Expression AST", sub: "where · join · order", kind: "note", col: 2, row: 0 },
        { id: "comp", label: "SQL compiler", sub: "AST → SQL + params", kind: "service", col: 2, row: 1 },
        { id: "hyd", label: "Hydrator", sub: "rows → typed models", kind: "service", col: 3, row: 2 },
        { id: "db", label: "SQLite", sub: "prepared statements", kind: "store", col: 3, row: 1 },
        { id: "mig", label: "Migration runner", sub: "schema versioning", kind: "worker", col: 1, row: 2 }
      ],
      edges: [
        { from: "app", to: "qb" },
        { from: "qb", to: "ast" },
        { from: "ast", to: "comp" },
        { from: "comp", to: "db", label: "one statement" },
        { from: "db", to: "hyd", label: "rows" },
        { from: "mig", to: "db", dashed: true }
      ],
      note: "Nothing executes until the chain is consumed. Building an **AST first** is what allows relation loading to batch into a single `IN (...)` query instead of N+1."
    },

    "multi-tenant-auth-service": {
      title: "Asymmetric tokens so services verify without calling you",
      nodes: [
        { id: "u", label: "User", sub: "email + password", kind: "client", col: 0, row: 1 },
        { id: "auth", label: "Auth service", sub: "Argon2id · RS256 sign", kind: "service", col: 1, row: 1 },
        { id: "pg", label: "PostgreSQL", sub: "RLS by tenant_id", kind: "store", col: 1, row: 2 },
        { id: "rd", label: "Redis", sub: "revocation list · jti", kind: "cache", col: 2, row: 2 },
        { id: "jwks", label: "JWKS endpoint", sub: "public keys, cached", kind: "service", col: 2, row: 0 },
        { id: "api", label: "Resource service", sub: "verifies locally", kind: "service", col: 3, row: 1 }
      ],
      edges: [
        { from: "u", to: "auth", label: "login" },
        { from: "auth", to: "pg" },
        { from: "auth", to: "rd", label: "refresh family" },
        { from: "auth", to: "jwks", dashed: true },
        { from: "jwks", to: "api", label: "public key" },
        { from: "u", to: "api", label: "Bearer token" },
        { from: "api", to: "rd", label: "revoked?", dashed: true }
      ],
      note: "Signing with **RS256** means resource services verify with a public key and never call the auth service on the hot path. The revocation check is the one place that trade-off costs you a lookup."
    },

    "file-storage-cdn-proxy": {
      title: "Resumable upload in, derivative images out",
      nodes: [
        { id: "up", label: "Uploader", sub: "5 MB chunks", kind: "client", col: 0, row: 0 },
        { id: "ing", label: "Upload API", sub: "resume by offset", kind: "service", col: 1, row: 0 },
        { id: "scan", label: "Validator", sub: "magic bytes · size", kind: "worker", col: 2, row: 0 },
        { id: "blob", label: "Object store", sub: "content-addressed", kind: "store", col: 3, row: 1 },
        { id: "viewer", label: "Viewer", sub: "/img/:id?w=400", kind: "client", col: 0, row: 2 },
        { id: "cdn", label: "Transform service", sub: "libvips · ETag", kind: "service", col: 1, row: 2 },
        { id: "cache", label: "Derivative cache", sub: "keyed by params", kind: "cache", col: 2, row: 2 }
      ],
      edges: [
        { from: "up", to: "ing" },
        { from: "ing", to: "scan" },
        { from: "scan", to: "blob", label: "commit" },
        { from: "viewer", to: "cdn" },
        { from: "cdn", to: "cache", label: "hit" },
        { from: "cdn", to: "blob", label: "miss → original" }
      ],
      note: "Derivatives are keyed by the **original hash plus the transform parameters**, so the same crop is only ever computed once and re-uploading an identical file costs nothing."
    },

    "e-commerce-event-driven-saga": {
      title: "A saga with compensations, published through an outbox",
      nodes: [
        { id: "api", label: "Order API", sub: "starts the saga", kind: "service", col: 0, row: 1 },
        { id: "orch", label: "Saga orchestrator", sub: "durable state machine", kind: "service", col: 1, row: 1 },
        { id: "k", label: "Kafka", sub: "partitioned by order id", kind: "queue", col: 2, row: 1 },
        { id: "inv", label: "Inventory", sub: "reserve / release", kind: "service", col: 3, row: 0 },
        { id: "pay", label: "Payment", sub: "charge / refund", kind: "service", col: 3, row: 1 },
        { id: "ship", label: "Shipping", sub: "create / cancel", kind: "service", col: 3, row: 2 },
        { id: "ob", label: "Outbox table", sub: "same txn as the write", kind: "store", col: 2, row: 2 }
      ],
      edges: [
        { from: "api", to: "orch" },
        { from: "orch", to: "k" },
        { from: "k", to: "inv" },
        { from: "k", to: "pay" },
        { from: "k", to: "ship" },
        { from: "ob", to: "k", label: "relay", dashed: true },
        { from: "inv", to: "ob", muted: true, dashed: true }
      ],
      groups: [{ label: "Participants", cols: [3, 3], rows: [0, 2] }],
      note: "Each service writes its event into an **outbox row inside the same local transaction** as its state change. Without that, a crash between committing and publishing strands the saga forever."
    },

    "high-throughput-chat-engine": {
      title: "A million connections, and finding the one that matters",
      nodes: [
        { id: "c", label: "Clients", sub: "persistent WebSocket", kind: "client", col: 0, row: 1 },
        { id: "g1", label: "Gateway node", sub: "epoll · ~100k conns", kind: "service", col: 1, row: 0 },
        { id: "g2", label: "Gateway node", sub: "epoll · ~100k conns", kind: "service", col: 1, row: 2 },
        { id: "reg", label: "Session registry", sub: "user → gateway", kind: "cache", col: 2, row: 1 },
        { id: "bus", label: "Kafka", sub: "per-channel topics", kind: "queue", col: 3, row: 1 },
        { id: "sc", label: "ScyllaDB", sub: "time-bucketed messages", kind: "store", col: 4, row: 1 }
      ],
      edges: [
        { from: "c", to: "g1" },
        { from: "c", to: "g2" },
        { from: "g1", to: "reg", label: "who holds B?" },
        { from: "g2", to: "reg" },
        { from: "g1", to: "bus" },
        { from: "bus", to: "g2", label: "deliver" },
        { from: "bus", to: "sc", label: "persist" }
      ],
      note: "Partitioning messages by **channel and time bucket** keeps a busy channel's history on contiguous rows, so paging backwards is one range read rather than a scatter."
    },

    /* ================= AI, ML & vision ================= */

    "neural-network-from-scratch-numpy": {
      title: "Forward values one way, gradients the other",
      nodes: [
        { id: "x", label: "Input batch", sub: "NumPy array", kind: "client", col: 0, row: 1 },
        { id: "g", label: "Computation graph", sub: "Tensor nodes + parents", kind: "note", col: 1, row: 0, span: 2 },
        { id: "f", label: "Forward pass", sub: "matmul · ReLU · softmax", kind: "service", col: 1, row: 1 },
        { id: "l", label: "Loss", sub: "cross-entropy", kind: "service", col: 2, row: 1 },
        { id: "b", label: "Backward pass", sub: "reverse topological order", kind: "service", col: 2, row: 2 },
        { id: "o", label: "Optimiser", sub: "SGD · momentum · Adam", kind: "worker", col: 1, row: 2 }
      ],
      edges: [
        { from: "x", to: "f" },
        { from: "f", to: "l" },
        { from: "l", to: "b", label: "dL/dL = 1" },
        { from: "b", to: "o", label: "grads" },
        { from: "o", to: "f", label: "update weights", dashed: true }
      ],
      note: "Each node stores its parents and a local derivative. Backprop is then just **reverse topological order** over that graph — the same algorithm PyTorch runs, without the C++."
    },

    "autonomous-lane-detection": {
      title: "A classical vision pipeline, stage by stage",
      nodes: [
        { id: "cam", label: "Camera frame", sub: "1280×720", kind: "client", col: 0, row: 1 },
        { id: "cal", label: "Undistort", sub: "chessboard calibration", kind: "service", col: 1, row: 1 },
        { id: "th", label: "Threshold", sub: "HLS S-channel + Sobel", kind: "service", col: 2, row: 0 },
        { id: "warp", label: "Perspective warp", sub: "to bird's-eye", kind: "service", col: 2, row: 2 },
        { id: "fit", label: "Sliding window fit", sub: "2nd-degree polynomial", kind: "service", col: 3, row: 1 },
        { id: "out", label: "Overlay + curvature", sub: "radius · offset", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "cam", to: "cal" },
        { from: "cal", to: "th" },
        { from: "cal", to: "warp" },
        { from: "th", to: "fit" },
        { from: "warp", to: "fit" },
        { from: "fit", to: "out" }
      ],
      note: "Warping to bird's-eye **before** fitting is what makes a curved lane a simple polynomial. Fit in the camera view and perspective turns every curve into a different shape."
    },

    "realtime-object-tracking-vision": {
      title: "Detect per frame, associate across frames",
      nodes: [
        { id: "v", label: "Video source", sub: "RTSP or file", kind: "client", col: 0, row: 1 },
        { id: "det", label: "YOLOv8", sub: "TensorRT · FP16", kind: "model", col: 1, row: 1 },
        { id: "kf", label: "Kalman filter", sub: "predict next position", kind: "service", col: 2, row: 0 },
        { id: "as", label: "ByteTrack", sub: "IoU + Hungarian match", kind: "service", col: 2, row: 1 },
        { id: "hom", label: "Homography", sub: "pixels → metres", kind: "service", col: 3, row: 1 },
        { id: "api", label: "FastAPI + SQLite", sub: "counts · speed · alerts", kind: "service", col: 4, row: 1 }
      ],
      edges: [
        { from: "v", to: "det" },
        { from: "det", to: "as", label: "boxes" },
        { from: "kf", to: "as", label: "prediction" },
        { from: "as", to: "kf", label: "correction", dashed: true },
        { from: "as", to: "hom", label: "tracks" },
        { from: "hom", to: "api" }
      ],
      note: "ByteTrack's trick is keeping **low-confidence detections** for a second matching pass. Discarding them is what makes naive trackers drop an object the moment it is partly occluded."
    },

    "multimodal-image-search-engine": {
      title: "Text and images sharing one vector space",
      nodes: [
        { id: "imgs", label: "Image corpus", sub: "offline batch", kind: "client", col: 0, row: 0 },
        { id: "ie", label: "CLIP image encoder", sub: "ViT-B/32 → 512-d", kind: "model", col: 1, row: 0 },
        { id: "q", label: "Text query", sub: "\"red bike at night\"", kind: "client", col: 0, row: 2 },
        { id: "te", label: "CLIP text encoder", sub: "same 512-d space", kind: "model", col: 1, row: 2 },
        { id: "vdb", label: "Qdrant", sub: "HNSW · cosine", kind: "store", col: 2, row: 1 },
        { id: "api", label: "Search API", sub: "filters + pagination", kind: "service", col: 3, row: 1 },
        { id: "ui", label: "Web UI", sub: "grid + similarity score", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "imgs", to: "ie" },
        { from: "ie", to: "vdb", label: "index once" },
        { from: "q", to: "te" },
        { from: "te", to: "vdb", label: "query vector" },
        { from: "vdb", to: "api", label: "top-k" },
        { from: "api", to: "ui" }
      ],
      groups: [{ label: "Offline indexing", cols: [0, 1], rows: [0, 0] }],
      note: "CLIP's contrastive training puts captions and images in the **same** space, which is the whole reason a text vector can be compared against image vectors at all."
    },

    "time-series-anomaly-detection": {
      title: "Reconstruction error as the anomaly signal",
      nodes: [
        { id: "m", label: "Metric stream", sub: "CPU · latency · errors", kind: "client", col: 0, row: 1 },
        { id: "fe", label: "Windowing", sub: "sliding · normalised", kind: "service", col: 1, row: 1 },
        { id: "ae", label: "LSTM autoencoder", sub: "encode → decode", kind: "model", col: 2, row: 1 },
        { id: "err", label: "Reconstruction error", sub: "per window", kind: "note", col: 3, row: 0 },
        { id: "th", label: "Dynamic threshold", sub: "extreme value theory", kind: "service", col: 3, row: 2 },
        { id: "al", label: "Alerting", sub: "dedupe + escalate", kind: "worker", col: 4, row: 1 },
        { id: "ts", label: "InfluxDB + Grafana", sub: "history and review", kind: "store", col: 2, row: 3 }
      ],
      edges: [
        { from: "m", to: "fe" },
        { from: "fe", to: "ae" },
        { from: "ae", to: "err" },
        { from: "err", to: "th" },
        { from: "th", to: "al", label: "exceeded" },
        { from: "fe", to: "ts", dashed: true, muted: true }
      ],
      note: "The model only ever trains on **normal** data. Anything it reconstructs badly is unlike what it has seen — which is a far more useful definition of anomalous than a fixed threshold."
    },

    "semantic-segmentation-medical": {
      title: "U-Net, and where the skip connections earn their place",
      nodes: [
        { id: "d", label: "DICOM series", sub: "windowed · resampled", kind: "client", col: 0, row: 1 },
        { id: "aug", label: "Augmentation", sub: "elastic · flip · intensity", kind: "service", col: 1, row: 1 },
        { id: "enc", label: "Encoder", sub: "ResNet · downsampling", kind: "model", col: 2, row: 0 },
        { id: "bott", label: "Bottleneck", sub: "lowest resolution", kind: "note", col: 3, row: 1 },
        { id: "dec", label: "Decoder", sub: "upsample + skips", kind: "model", col: 2, row: 2 },
        { id: "loss", label: "Combo loss", sub: "Dice + focal", kind: "service", col: 4, row: 1 },
        { id: "ui", label: "Review GUI", sub: "overlay + Dice score", kind: "client", col: 4, row: 2 }
      ],
      edges: [
        { from: "d", to: "aug" },
        { from: "aug", to: "enc" },
        { from: "enc", to: "bott" },
        { from: "bott", to: "dec" },
        { from: "enc", to: "dec", label: "skip connections", dashed: true },
        { from: "dec", to: "loss" },
        { from: "dec", to: "ui" }
      ],
      note: "The skips carry **fine spatial detail** that downsampling destroys. Without them the mask is roughly right and its boundary is unusable — which for a clinical measurement is the whole result."
    },

    "speech-emotion-recognition": {
      title: "Audio to spectrogram to sequence model",
      nodes: [
        { id: "mic", label: "Microphone", sub: "WebAudio · 16 kHz", kind: "client", col: 0, row: 1 },
        { id: "pre", label: "Pre-emphasis + VAD", sub: "trim silence", kind: "service", col: 1, row: 1 },
        { id: "mel", label: "Mel spectrogram", sub: "librosa · 64 bands", kind: "service", col: 2, row: 1 },
        { id: "cnn", label: "CNN front-end", sub: "local time-frequency", kind: "model", col: 3, row: 0 },
        { id: "bi", label: "BiLSTM + attention", sub: "temporal context", kind: "model", col: 3, row: 2 },
        { id: "out", label: "Emotion + confidence", sub: "8 classes", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "mic", to: "pre" },
        { from: "pre", to: "mel" },
        { from: "mel", to: "cnn" },
        { from: "cnn", to: "bi" },
        { from: "bi", to: "out" }
      ],
      note: "Treating the spectrogram as an **image for the CNN and a sequence for the LSTM** is the point: one captures timbre, the other captures how it changes over the utterance."
    },

    "graph-neural-network-fraud": {
      title: "Fraud as a property of the neighbourhood, not the row",
      nodes: [
        { id: "tx", label: "Transactions", sub: "tabular rows", kind: "client", col: 0, row: 1 },
        { id: "gb", label: "Graph builder", sub: "shared device · IP · card", kind: "service", col: 1, row: 1 },
        { id: "neo", label: "Neo4j", sub: "accounts + edges", kind: "store", col: 2, row: 0 },
        { id: "sage", label: "GraphSAGE", sub: "neighbour aggregation", kind: "model", col: 2, row: 2 },
        { id: "im", label: "Imbalance handling", sub: "focal loss · sampling", kind: "service", col: 3, row: 2 },
        { id: "exp", label: "GNNExplainer", sub: "which edges mattered", kind: "service", col: 3, row: 0 },
        { id: "ui", label: "Analyst view", sub: "ring visualisation", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "tx", to: "gb" },
        { from: "gb", to: "neo" },
        { from: "gb", to: "sage" },
        { from: "sage", to: "im" },
        { from: "sage", to: "exp" },
        { from: "exp", to: "ui" },
        { from: "im", to: "ui" }
      ],
      note: "A single transaction looks innocent; a **ring sharing three devices** does not. Message passing is what lets a node's label depend on company it keeps."
    },

    "reinforcement-learning-robotics": {
      title: "Parallel environments feeding one policy update",
      nodes: [
        { id: "env", label: "Vectorised envs", sub: "MuJoCo × 16", kind: "external", col: 0, row: 1 },
        { id: "pol", label: "Policy network", sub: "actor: state → action", kind: "model", col: 1, row: 0 },
        { id: "val", label: "Value network", sub: "critic: state → return", kind: "model", col: 1, row: 2 },
        { id: "roll", label: "Rollout buffer", sub: "obs · act · rew · logp", kind: "queue", col: 2, row: 1 },
        { id: "gae", label: "GAE advantage", sub: "λ-weighted returns", kind: "service", col: 3, row: 1 },
        { id: "ppo", label: "PPO update", sub: "clipped ratio · epochs", kind: "service", col: 4, row: 1 },
        { id: "wb", label: "W&B", sub: "reward curves · video", kind: "external", col: 4, row: 2 }
      ],
      edges: [
        { from: "env", to: "roll", label: "transitions" },
        { from: "pol", to: "env", label: "actions" },
        { from: "roll", to: "gae" },
        { from: "val", to: "gae" },
        { from: "gae", to: "ppo" },
        { from: "ppo", to: "pol", label: "update", dashed: true },
        { from: "ppo", to: "wb", muted: true, dashed: true }
      ],
      note: "The **clipped objective** stops a single batch moving the policy too far. Remove the clip and training collapses within a few hundred updates — worth trying once to see it happen."
    },

    "custom-diffusion-model-scratch": {
      title: "Noise in, image out, one step at a time",
      nodes: [
        { id: "img", label: "Training image", sub: "x₀", kind: "client", col: 0, row: 0 },
        { id: "fwd", label: "Forward process", sub: "add noise at step t", kind: "service", col: 1, row: 0 },
        { id: "unet", label: "Denoising U-Net", sub: "self-attention + time embed", kind: "model", col: 2, row: 1 },
        { id: "loss", label: "MSE on ε", sub: "predict the noise", kind: "service", col: 3, row: 0 },
        { id: "noise", label: "Pure noise", sub: "sampling starts here", kind: "client", col: 0, row: 2 },
        { id: "cfg", label: "Guidance", sub: "cond vs uncond, scale s", kind: "service", col: 3, row: 2 },
        { id: "ddim", label: "DDIM sampler", sub: "20–50 steps", kind: "service", col: 4, row: 1 }
      ],
      edges: [
        { from: "img", to: "fwd" },
        { from: "fwd", to: "unet" },
        { from: "unet", to: "loss" },
        { from: "noise", to: "unet" },
        { from: "unet", to: "cfg" },
        { from: "cfg", to: "ddim" },
        { from: "ddim", to: "unet", label: "next step", dashed: true }
      ],
      groups: [{ label: "Training", cols: [0, 3], rows: [0, 0] }],
      note: "The network is trained to predict the **noise that was added**, not the clean image. That reparameterisation is what makes the loss a plain MSE and the training stable."
    },

    /* ================= LLM & agents ================= */

    "structured-json-extractor": {
      title: "A grammar that makes invalid output impossible",
      nodes: [
        { id: "doc", label: "Raw text", sub: "invoice · email · CV", kind: "client", col: 0, row: 1 },
        { id: "sch", label: "Pydantic model", sub: "the target shape", kind: "client", col: 0, row: 0 },
        { id: "gb", label: "Grammar compiler", sub: "schema → GBNF", kind: "service", col: 1, row: 0 },
        { id: "llm", label: "Local LLM", sub: "llama.cpp", kind: "model", col: 2, row: 1 },
        { id: "mask", label: "Logit mask", sub: "only valid next tokens", kind: "note", col: 2, row: 0 },
        { id: "val", label: "Validation", sub: "types · ranges · enums", kind: "service", col: 3, row: 1 },
        { id: "api", label: "Batch API", sub: "FastAPI · concurrency", kind: "service", col: 4, row: 1 }
      ],
      edges: [
        { from: "sch", to: "gb" },
        { from: "gb", to: "mask" },
        { from: "mask", to: "llm", label: "constrain", dashed: true },
        { from: "doc", to: "llm" },
        { from: "llm", to: "val" },
        { from: "val", to: "api" }
      ],
      note: "Masking at **decode time** is categorically different from asking nicely and repairing afterwards: malformed output becomes structurally impossible rather than merely unlikely."
    },

    "smart-document-chat-ocr": {
      title: "Scanned pages made answerable",
      nodes: [
        { id: "pdf", label: "PDF upload", sub: "digital or scanned", kind: "client", col: 0, row: 1 },
        { id: "route", label: "Text or image?", sub: "per page", kind: "note", col: 1, row: 1 },
        { id: "ext", label: "PDFPlumber", sub: "embedded text layer", kind: "service", col: 2, row: 0 },
        { id: "ocr", label: "Tesseract OCR", sub: "deskew · denoise", kind: "service", col: 2, row: 2 },
        { id: "ch", label: "Semantic chunking", sub: "with page anchors", kind: "service", col: 3, row: 1 },
        { id: "vdb", label: "ChromaDB", sub: "chunk + page number", kind: "store", col: 4, row: 1 },
        { id: "chat", label: "Chat UI", sub: "answer + page jump", kind: "client", col: 4, row: 2 }
      ],
      edges: [
        { from: "pdf", to: "route" },
        { from: "route", to: "ext", label: "has text" },
        { from: "route", to: "ocr", label: "scanned" },
        { from: "ext", to: "ch" },
        { from: "ocr", to: "ch" },
        { from: "ch", to: "vdb" },
        { from: "vdb", to: "chat", label: "cited chunks" }
      ],
      note: "Carrying the **page number through chunking** is what turns an answer into a verifiable one — the user clicks the citation and lands on the paragraph."
    },

    "local-voice-ai-assistant": {
      title: "Three models pipelined to stay under 400 ms",
      nodes: [
        { id: "mic", label: "Microphone", sub: "20 ms frames", kind: "client", col: 0, row: 1 },
        { id: "vad", label: "VAD", sub: "detect end of speech", kind: "service", col: 1, row: 1 },
        { id: "stt", label: "Whisper.cpp", sub: "streaming partials", kind: "model", col: 2, row: 0 },
        { id: "llm", label: "Llama 3 8B", sub: "streams tokens", kind: "model", col: 3, row: 1 },
        { id: "tts", label: "Piper TTS", sub: "per sentence", kind: "model", col: 4, row: 0 },
        { id: "spk", label: "Speaker", sub: "first audio ≈ 400 ms", kind: "client", col: 4, row: 2 },
        { id: "bi", label: "Barge-in", sub: "user speaks → cancel", kind: "note", col: 2, row: 2 }
      ],
      edges: [
        { from: "mic", to: "vad" },
        { from: "vad", to: "stt" },
        { from: "stt", to: "llm", label: "transcript" },
        { from: "llm", to: "tts", label: "sentence chunks" },
        { from: "tts", to: "spk" },
        { from: "vad", to: "bi", dashed: true },
        { from: "bi", to: "tts", label: "cancel", dashed: true }
      ],
      note: "Synthesis starts on the **first complete sentence**, not the full response. Waiting for the LLM to finish is what makes most voice assistants feel a second slower than they are."
    },

    "prompt-injection-firewall": {
      title: "Layered checks around a model you cannot trust",
      nodes: [
        { id: "u", label: "User input", sub: "or retrieved document", kind: "client", col: 0, row: 1 },
        { id: "h", label: "Heuristics", sub: "regex · encodings · length", kind: "service", col: 1, row: 0 },
        { id: "pii", label: "PII redaction", sub: "Presidio", kind: "service", col: 1, row: 2 },
        { id: "cls", label: "Injection classifier", sub: "DeBERTa", kind: "model", col: 2, row: 1 },
        { id: "can", label: "Canary token", sub: "injected into system prompt", kind: "note", col: 3, row: 0 },
        { id: "llm", label: "Protected LLM", sub: "the thing being defended", kind: "model", col: 3, row: 1 },
        { id: "out", label: "Output scan", sub: "canary leaked? PII out?", kind: "service", col: 4, row: 1 },
        { id: "log", label: "Threat log", sub: "blocked attempts", kind: "store", col: 2, row: 3 }
      ],
      edges: [
        { from: "u", to: "h" },
        { from: "u", to: "pii" },
        { from: "h", to: "cls" },
        { from: "pii", to: "cls" },
        { from: "cls", to: "llm", label: "clean" },
        { from: "can", to: "llm", dashed: true },
        { from: "llm", to: "out" },
        { from: "cls", to: "log", label: "blocked", dashed: true }
      ],
      note: "The **canary** is the cheapest high-value control: a random string in the system prompt that must never appear in output. If it does, extraction succeeded and you know immediately."
    },

    "multi-agent-research-analyst": {
      title: "A supervised graph, not a chain",
      nodes: [
        { id: "q", label: "Research brief", sub: "user question", kind: "client", col: 0, row: 1 },
        { id: "sup", label: "Supervisor", sub: "routes and decides done", kind: "service", col: 1, row: 1 },
        { id: "pl", label: "Planner", sub: "decompose into subquestions", kind: "model", col: 2, row: 0 },
        { id: "res", label: "Researcher", sub: "Tavily + Playwright", kind: "model", col: 2, row: 1 },
        { id: "cr", label: "Critic", sub: "challenges every claim", kind: "model", col: 2, row: 2 },
        { id: "st", label: "Shared state", sub: "findings + citations", kind: "store", col: 3, row: 1 },
        { id: "pdf", label: "Report writer", sub: "ReportLab PDF", kind: "worker", col: 4, row: 1 }
      ],
      edges: [
        { from: "q", to: "sup" },
        { from: "sup", to: "pl" },
        { from: "sup", to: "res" },
        { from: "sup", to: "cr" },
        { from: "pl", to: "st" },
        { from: "res", to: "st" },
        { from: "cr", to: "st" },
        { from: "st", to: "sup", label: "re-plan", dashed: true },
        { from: "st", to: "pdf" }
      ],
      note: "The critic exists to make the loop **terminate honestly**. Without an agent whose job is to find the weakness, a research agent converges on confident, unsupported prose."
    },

    "multimodal-rag-enterprise": {
      title: "Two retrievers, fused by rank, then reranked",
      nodes: [
        { id: "docs", label: "Documents", sub: "PDF · tables · figures", kind: "client", col: 0, row: 0 },
        { id: "parse", label: "Layout parser", sub: "Unstructured.io", kind: "service", col: 1, row: 0 },
        { id: "emb", label: "BGE-M3 index", sub: "dense · HNSW", kind: "store", col: 2, row: 0 },
        { id: "bm", label: "BM25 index", sub: "sparse · exact terms", kind: "store", col: 2, row: 2 },
        { id: "q", label: "Question", sub: "user query", kind: "client", col: 0, row: 1 },
        { id: "rrf", label: "RRF fusion", sub: "combine by rank, k=60", kind: "service", col: 3, row: 1 },
        { id: "rr", label: "Cross-encoder", sub: "rerank top 50 → 5", kind: "model", col: 4, row: 1 },
        { id: "gen", label: "Generator", sub: "answer + citations", kind: "model", col: 5, row: 1 },
        { id: "ev", label: "Ragas", sub: "faithfulness · recall", kind: "external", col: 5, row: 2 }
      ],
      edges: [
        { from: "docs", to: "parse" },
        { from: "parse", to: "emb" },
        { from: "parse", to: "bm" },
        { from: "q", to: "emb" },
        { from: "q", to: "bm" },
        { from: "emb", to: "rrf" },
        { from: "bm", to: "rrf" },
        { from: "rrf", to: "rr" },
        { from: "rr", to: "gen" },
        { from: "gen", to: "ev", muted: true, dashed: true }
      ],
      groups: [{ label: "Ingestion", cols: [0, 2], rows: [0, 0] }],
      note: "RRF combines the two rankings using **position only**, which is what makes it work: cosine similarity and BM25 scores are on incomparable scales and cannot simply be added."
    },

    "llm-eval-benchmark-harness": {
      title: "Evaluation as a build step, not a spreadsheet",
      nodes: [
        { id: "pr", label: "Pull request", sub: "prompt or model change", kind: "client", col: 0, row: 1 },
        { id: "ci", label: "GitHub Actions", sub: "runs on every PR", kind: "service", col: 1, row: 1 },
        { id: "gold", label: "Golden dataset", sub: "versioned cases", kind: "store", col: 2, row: 0 },
        { id: "run", label: "Runner", sub: "executes each case", kind: "worker", col: 2, row: 1 },
        { id: "det", label: "Deterministic checks", sub: "schema · latency · cost", kind: "service", col: 3, row: 0 },
        { id: "judge", label: "LLM judge", sub: "rubric · pairwise", kind: "model", col: 3, row: 2 },
        { id: "stat", label: "Significance test", sub: "is this real?", kind: "service", col: 4, row: 1 },
        { id: "gate", label: "Pass / block merge", sub: "with a report", kind: "note", col: 5, row: 1 }
      ],
      edges: [
        { from: "pr", to: "ci" },
        { from: "gold", to: "run" },
        { from: "ci", to: "run" },
        { from: "run", to: "det" },
        { from: "run", to: "judge" },
        { from: "det", to: "stat" },
        { from: "judge", to: "stat" },
        { from: "stat", to: "gate" }
      ],
      note: "The significance step is what stops the harness being theatre. A 2% move across 40 cases is **noise**, and blocking a merge on it trains everyone to ignore the gate."
    },

    "fine-tuned-code-reviewer": {
      title: "SFT for the format, DPO for the judgement",
      nodes: [
        { id: "gh", label: "GitHub PRs", sub: "diffs + review comments", kind: "client", col: 0, row: 1 },
        { id: "ast", label: "Tree-sitter", sub: "diff → function context", kind: "service", col: 1, row: 1 },
        { id: "sft", label: "QLoRA SFT", sub: "4-bit base · Unsloth", kind: "model", col: 2, row: 0 },
        { id: "pref", label: "Preference pairs", sub: "accepted vs ignored", kind: "store", col: 2, row: 2 },
        { id: "dpo", label: "DPO", sub: "no reward model", kind: "model", col: 3, row: 1 },
        { id: "merge", label: "Merge adapter", sub: "or serve unmerged", kind: "service", col: 4, row: 0 },
        { id: "bot", label: "Review bot", sub: "GitHub webhook", kind: "service", col: 4, row: 2 }
      ],
      edges: [
        { from: "gh", to: "ast" },
        { from: "ast", to: "sft" },
        { from: "ast", to: "pref" },
        { from: "sft", to: "dpo" },
        { from: "pref", to: "dpo" },
        { from: "dpo", to: "merge" },
        { from: "merge", to: "bot" }
      ],
      note: "Supervised tuning teaches the model **what a review looks like**; preference tuning teaches it which comments were worth making. Both stages are needed, and in that order."
    },

    "speculative-decoding-inference": {
      title: "A small model guesses, a large model checks",
      nodes: [
        { id: "req", label: "Request", sub: "prompt", kind: "client", col: 0, row: 1 },
        { id: "sch", label: "Scheduler", sub: "continuous batching", kind: "service", col: 1, row: 1 },
        { id: "draft", label: "Draft model", sub: "1B · proposes K tokens", kind: "model", col: 2, row: 0 },
        { id: "tgt", label: "Target model", sub: "verifies K in one pass", kind: "model", col: 2, row: 2 },
        { id: "acc", label: "Rejection sampling", sub: "accept longest prefix", kind: "service", col: 3, row: 1 },
        { id: "kv", label: "Paged KV cache", sub: "block table · CoW", kind: "cache", col: 4, row: 1 },
        { id: "out", label: "Token stream", sub: "same distribution", kind: "client", col: 5, row: 1 }
      ],
      edges: [
        { from: "req", to: "sch" },
        { from: "sch", to: "draft" },
        { from: "draft", to: "tgt", label: "K candidates" },
        { from: "tgt", to: "acc" },
        { from: "acc", to: "kv", label: "commit / roll back" },
        { from: "acc", to: "out" },
        { from: "acc", to: "draft", label: "next round", dashed: true }
      ],
      note: "The accepted output is distributed **exactly** as the target model alone would have produced. It is a latency optimisation, not an approximation — verify that empirically before believing it."
    },

    "autonomous-coding-agent": {
      title: "A ReAct loop with everything dangerous behind a wall",
      nodes: [
        { id: "task", label: "Task", sub: "issue or failing test", kind: "client", col: 0, row: 1 },
        { id: "plan", label: "Planner", sub: "ReAct · step budget", kind: "model", col: 1, row: 1 },
        { id: "tools", label: "Tool layer", sub: "read · edit · run · search", kind: "service", col: 2, row: 1 },
        { id: "box", label: "Docker sandbox", sub: "no network · cgroups", kind: "external", col: 3, row: 1 },
        { id: "repo", label: "Workspace copy", sub: "read-only rootfs", kind: "store", col: 4, row: 0 },
        { id: "test", label: "Test runner", sub: "the verification signal", kind: "worker", col: 4, row: 2 },
        { id: "ctx", label: "History compaction", sub: "summarise old steps", kind: "note", col: 1, row: 2 }
      ],
      edges: [
        { from: "task", to: "plan" },
        { from: "plan", to: "tools", label: "action" },
        { from: "tools", to: "box" },
        { from: "box", to: "repo" },
        { from: "box", to: "test" },
        { from: "test", to: "plan", label: "observation", dashed: true },
        { from: "plan", to: "ctx", muted: true, dashed: true }
      ],
      groups: [{ label: "Untrusted execution", cols: [3, 4], rows: [0, 2] }],
      note: "At 95% per-step reliability a 20-step task succeeds **36%** of the time. Tests are the only observation that tells the loop it is actually finished rather than confident."
    },

    /* ================= Systems & OS ================= */

    "custom-shell-posix": {
      title: "What happens between a line of text and a running process",
      nodes: [
        { id: "in", label: "REPL", sub: "readline + history", kind: "client", col: 0, row: 1 },
        { id: "lex", label: "Tokeniser", sub: "quotes · escapes", kind: "service", col: 1, row: 1 },
        { id: "par", label: "Parser", sub: "pipeline + redirections", kind: "service", col: 2, row: 1 },
        { id: "fk", label: "fork()", sub: "child process", kind: "service", col: 3, row: 0 },
        { id: "dup", label: "dup2()", sub: "wire up fds", kind: "service", col: 3, row: 1 },
        { id: "ex", label: "execvp()", sub: "replace the image", kind: "service", col: 4, row: 1 },
        { id: "wait", label: "waitpid()", sub: "reap · exit status", kind: "service", col: 3, row: 2 }
      ],
      edges: [
        { from: "in", to: "lex" },
        { from: "lex", to: "par" },
        { from: "par", to: "fk" },
        { from: "fk", to: "dup" },
        { from: "dup", to: "ex" },
        { from: "ex", to: "wait", dashed: true },
        { from: "wait", to: "in", label: "prompt again", dashed: true }
      ],
      note: "The redirection happens **in the child, after fork and before exec** — that window is the only place file descriptors can be rearranged without affecting the shell itself."
    },

    "memory-allocator-malloc": {
      title: "Heap layout, and what free() actually has to find",
      nodes: [
        { id: "app", label: "malloc(n)", sub: "caller", kind: "client", col: 0, row: 1 },
        { id: "size", label: "Size class", sub: "segregated free lists", kind: "service", col: 1, row: 1 },
        { id: "fl", label: "Free list", sub: "first / best fit", kind: "store", col: 2, row: 0 },
        { id: "brk", label: "sbrk()", sub: "grow the heap", kind: "external", col: 2, row: 2 },
        { id: "mm", label: "mmap()", sub: "large allocations", kind: "external", col: 3, row: 2 },
        { id: "hdr", label: "Block header", sub: "size + in-use bit", kind: "note", col: 3, row: 0 },
        { id: "co", label: "Coalescing", sub: "boundary tags, O(1)", kind: "service", col: 4, row: 1 }
      ],
      edges: [
        { from: "app", to: "size" },
        { from: "size", to: "fl", label: "reuse" },
        { from: "size", to: "brk", label: "no fit" },
        { from: "size", to: "mm", label: "> 128 KB" },
        { from: "fl", to: "hdr" },
        { from: "hdr", to: "co" },
        { from: "co", to: "fl", label: "merged block", dashed: true }
      ],
      note: "A **footer duplicating the header** is what makes coalescing with the previous block O(1) — without it, free() would have to scan the heap to find its left neighbour."
    },

    "p2p-bittorrent-client": {
      title: "Many peers, one file, verified piece by piece",
      nodes: [
        { id: "tor", label: ".torrent file", sub: "bencoded metadata", kind: "client", col: 0, row: 1 },
        { id: "tr", label: "Tracker", sub: "HTTP announce", kind: "external", col: 1, row: 0 },
        { id: "dht", label: "DHT", sub: "trackerless discovery", kind: "external", col: 1, row: 2 },
        { id: "pm", label: "Peer manager", sub: "handshake · bitfield", kind: "service", col: 2, row: 1 },
        { id: "p1", label: "Peer connections", sub: "choke / interested", kind: "external", col: 3, row: 0 },
        { id: "pick", label: "Piece picker", sub: "rarest first", kind: "service", col: 3, row: 2 },
        { id: "ver", label: "SHA-1 verify", sub: "per piece", kind: "service", col: 4, row: 1 },
        { id: "disk", label: "Output file", sub: "sparse writes", kind: "store", col: 5, row: 1 }
      ],
      edges: [
        { from: "tor", to: "pm" },
        { from: "tr", to: "pm", label: "peer list" },
        { from: "dht", to: "pm" },
        { from: "pm", to: "p1" },
        { from: "pick", to: "pm", label: "request blocks" },
        { from: "p1", to: "ver", label: "blocks" },
        { from: "ver", to: "disk", label: "hash ok" }
      ],
      note: "**Rarest-first** is what keeps the swarm alive: downloading the scarcest piece first maximises the chance that every piece stays available when peers leave."
    },

    "redis-from-scratch": {
      title: "One thread, one event loop, no locks",
      nodes: [
        { id: "cl", label: "Clients", sub: "many TCP connections", kind: "client", col: 0, row: 1 },
        { id: "ep", label: "epoll loop", sub: "single-threaded", kind: "service", col: 1, row: 1 },
        { id: "resp", label: "RESP parser", sub: "inline + multibulk", kind: "service", col: 2, row: 1 },
        { id: "cmd", label: "Command table", sub: "GET · SET · EXPIRE", kind: "service", col: 3, row: 1 },
        { id: "ht", label: "Hash table", sub: "two tables while rehashing", kind: "store", col: 4, row: 0 },
        { id: "exp", label: "Expiry cycle", sub: "lazy + sampled active", kind: "worker", col: 4, row: 2 },
        { id: "aof", label: "AOF", sub: "append + rewrite", kind: "store", col: 3, row: 3 }
      ],
      edges: [
        { from: "cl", to: "ep" },
        { from: "ep", to: "resp" },
        { from: "resp", to: "cmd" },
        { from: "cmd", to: "ht" },
        { from: "cmd", to: "exp", dashed: true },
        { from: "cmd", to: "aof", label: "after write" }
      ],
      note: "Single-threaded is a **feature**: every command is atomic with no locking, which is why Redis can offer things like `INCR` and Lua scripts with no concurrency story at all."
    },

    "container-runtime-cgroups": {
      title: "A container is a normal process with things taken away",
      nodes: [
        { id: "cli", label: "run <image> <cmd>", sub: "CLI", kind: "client", col: 0, row: 1 },
        { id: "img", label: "OCI image", sub: "layers + config", kind: "store", col: 1, row: 0 },
        { id: "ovl", label: "OverlayFS", sub: "lower + upper + work", kind: "service", col: 2, row: 0 },
        { id: "ns", label: "clone() namespaces", sub: "pid · net · mnt · uts · ipc", kind: "service", col: 2, row: 1 },
        { id: "piv", label: "pivot_root", sub: "new / , old unmounted", kind: "service", col: 3, row: 1 },
        { id: "cg", label: "cgroups v2", sub: "cpu.max · memory.max · pids", kind: "service", col: 3, row: 2 },
        { id: "proc", label: "Contained process", sub: "thinks it is pid 1", kind: "note", col: 4, row: 1 },
        { id: "veth", label: "veth + bridge", sub: "network namespace", kind: "external", col: 2, row: 2 }
      ],
      edges: [
        { from: "cli", to: "ns" },
        { from: "img", to: "ovl" },
        { from: "ovl", to: "piv" },
        { from: "ns", to: "piv" },
        { from: "piv", to: "proc" },
        { from: "cg", to: "proc", label: "limits", dashed: true },
        { from: "veth", to: "ns", dashed: true }
      ],
      note: "There is no container object in the kernel. It is a process with **namespaces** restricting what it can see and **cgroups** restricting what it can use — nothing more."
    },

    "lisp-compiler-bytecode-vm": {
      title: "Source to bytecode to a dispatch loop",
      nodes: [
        { id: "src", label: "S-expressions", sub: "(+ 1 (* 2 3))", kind: "client", col: 0, row: 1 },
        { id: "lex", label: "Lexer", sub: "tokens", kind: "service", col: 1, row: 1 },
        { id: "par", label: "Parser", sub: "AST", kind: "service", col: 2, row: 1 },
        { id: "comp", label: "Compiler", sub: "AST → bytecode", kind: "service", col: 3, row: 1 },
        { id: "isa", label: "Instruction set", sub: "register-based", kind: "note", col: 3, row: 0 },
        { id: "vm", label: "Dispatch loop", sub: "fetch · decode · execute", kind: "service", col: 4, row: 1 },
        { id: "heap", label: "Object heap", sub: "cons cells · closures", kind: "store", col: 5, row: 0 },
        { id: "gc", label: "Mark & sweep", sub: "roots: stack + globals", kind: "worker", col: 5, row: 2 }
      ],
      edges: [
        { from: "src", to: "lex" },
        { from: "lex", to: "par" },
        { from: "par", to: "comp" },
        { from: "isa", to: "comp", dashed: true },
        { from: "comp", to: "vm" },
        { from: "vm", to: "heap" },
        { from: "gc", to: "heap", label: "reclaim", dashed: true }
      ],
      note: "A **register-based** ISA needs far fewer instructions than a stack machine for the same program — fewer dispatches is most of the speed difference between the two designs."
    },

    "custom-http3-quic-server": {
      title: "Rebuilding reliability on top of UDP",
      nodes: [
        { id: "cl", label: "Client", sub: "QUIC over UDP", kind: "client", col: 0, row: 1 },
        { id: "sock", label: "UDP socket", sub: "one port, many conns", kind: "service", col: 1, row: 1 },
        { id: "cid", label: "Connection ID demux", sub: "survives IP change", kind: "service", col: 2, row: 1 },
        { id: "tls", label: "TLS 1.3 (rustls)", sub: "handshake in-band", kind: "service", col: 3, row: 0 },
        { id: "str", label: "Stream multiplexer", sub: "independent flows", kind: "service", col: 3, row: 2 },
        { id: "loss", label: "Loss recovery", sub: "ACK ranges · RTT · CC", kind: "service", col: 4, row: 1 },
        { id: "h3", label: "HTTP/3 + QPACK", sub: "header compression", kind: "service", col: 5, row: 1 }
      ],
      edges: [
        { from: "cl", to: "sock" },
        { from: "sock", to: "cid" },
        { from: "cid", to: "tls" },
        { from: "cid", to: "str" },
        { from: "str", to: "loss" },
        { from: "tls", to: "loss" },
        { from: "loss", to: "h3" }
      ],
      note: "Streams are independent **at the transport layer**, so one lost packet delays only its own stream. That is the head-of-line blocking HTTP/2 over TCP could never fix."
    },

    "ebpf-network-profiler": {
      title: "Code in the kernel, aggregation in userspace",
      nodes: [
        { id: "nic", label: "NIC", sub: "incoming packets", kind: "external", col: 0, row: 1 },
        { id: "xdp", label: "XDP hook", sub: "earliest possible point", kind: "service", col: 1, row: 1 },
        { id: "kp", label: "Kprobes", sub: "tcp_connect · sched", kind: "service", col: 1, row: 0 },
        { id: "vm", label: "eBPF verifier + JIT", sub: "proves termination", kind: "note", col: 2, row: 0 },
        { id: "map", label: "BPF maps", sub: "per-CPU counters", kind: "store", col: 2, row: 1 },
        { id: "rb", label: "Ring buffer", sub: "events to userspace", kind: "queue", col: 3, row: 1 },
        { id: "go", label: "Go agent", sub: "cilium/ebpf", kind: "worker", col: 4, row: 1 },
        { id: "graf", label: "Grafana", sub: "flamegraphs · flows", kind: "client", col: 5, row: 1 }
      ],
      edges: [
        { from: "nic", to: "xdp" },
        { from: "kp", to: "map" },
        { from: "xdp", to: "map" },
        { from: "vm", to: "map", dashed: true, muted: true },
        { from: "map", to: "rb" },
        { from: "rb", to: "go" },
        { from: "go", to: "graf" }
      ],
      groups: [{ label: "Kernel space", cols: [1, 2], rows: [0, 1] }],
      note: "The **verifier** is why this is safe: it rejects any program that could loop forever or touch memory it should not, before a single instruction runs in the kernel."
    },

    "raft-distributed-kv": {
      title: "One leader, a replicated log, majority commit",
      nodes: [
        { id: "cl", label: "Client", sub: "PUT / GET", kind: "client", col: 0, row: 1 },
        { id: "ld", label: "Leader", sub: "appends first", kind: "service", col: 1, row: 1 },
        { id: "f1", label: "Follower", sub: "AppendEntries", kind: "service", col: 2, row: 0 },
        { id: "f2", label: "Follower", sub: "AppendEntries", kind: "service", col: 2, row: 2 },
        { id: "log", label: "Replicated log", sub: "term + index", kind: "store", col: 3, row: 1 },
        { id: "sm", label: "State machine", sub: "applied after commit", kind: "service", col: 4, row: 1 },
        { id: "snap", label: "Snapshot", sub: "log compaction", kind: "store", col: 4, row: 2 }
      ],
      edges: [
        { from: "cl", to: "ld" },
        { from: "ld", to: "f1", label: "replicate" },
        { from: "ld", to: "f2", label: "replicate" },
        { from: "f1", to: "log" },
        { from: "f2", to: "log" },
        { from: "log", to: "sm", label: "majority → commit" },
        { from: "sm", to: "snap", dashed: true }
      ],
      note: "An entry is committed once a **majority** has it on disk. That single rule is what survives any minority of nodes failing — and why an even cluster size buys you nothing."
    },

    "distributed-load-balancer-l4": {
      title: "Stateless hashing, and a return path that skips you",
      nodes: [
        { id: "cl", label: "Clients", sub: "TCP SYN", kind: "client", col: 0, row: 1 },
        { id: "lb1", label: "Balancer node", sub: "Maglev table", kind: "service", col: 1, row: 0 },
        { id: "lb2", label: "Balancer node", sub: "same table, same result", kind: "service", col: 1, row: 2 },
        { id: "ct", label: "Conntrack", sub: "existing flows pinned", kind: "cache", col: 2, row: 1 },
        { id: "b1", label: "Backend", sub: "holds the VIP", kind: "service", col: 3, row: 0 },
        { id: "b2", label: "Backend", sub: "holds the VIP", kind: "service", col: 3, row: 2 },
        { id: "hc", label: "Health checks", sub: "rebuild on change", kind: "worker", col: 2, row: 3 }
      ],
      edges: [
        { from: "cl", to: "lb1" },
        { from: "cl", to: "lb2" },
        { from: "lb1", to: "ct" },
        { from: "lb2", to: "ct" },
        { from: "ct", to: "b1" },
        { from: "ct", to: "b2" },
        { from: "b1", to: "cl", label: "direct server return", dashed: true },
        { from: "hc", to: "ct", muted: true, dashed: true }
      ],
      note: "Every balancer builds the **same Maglev table** from the same backend list, so any node routes a flow identically — no shared state, and a node can be added mid-traffic."
    },

    /* ================= Data engineering ================= */

    "data-quality-monitoring-suite": {
      title: "Assertions that run where the data lands",
      nodes: [
        { id: "src", label: "Source tables", sub: "warehouse or files", kind: "store", col: 0, row: 1 },
        { id: "prof", label: "Profiler", sub: "nulls · ranges · cardinality", kind: "service", col: 1, row: 1 },
        { id: "rules", label: "Rule engine", sub: "declarative expectations", kind: "service", col: 2, row: 1 },
        { id: "drift", label: "Schema drift", sub: "compare to last snapshot", kind: "service", col: 2, row: 0 },
        { id: "snap", label: "Schema history", sub: "versioned", kind: "store", col: 3, row: 0 },
        { id: "rep", label: "HTML report", sub: "Jinja2 · per run", kind: "client", col: 3, row: 2 },
        { id: "ci", label: "CI gate", sub: "fail the pipeline", kind: "note", col: 4, row: 1 }
      ],
      edges: [
        { from: "src", to: "prof" },
        { from: "prof", to: "rules" },
        { from: "prof", to: "drift" },
        { from: "drift", to: "snap" },
        { from: "rules", to: "rep" },
        { from: "rules", to: "ci" }
      ],
      note: "Blocking the pipeline on a failed expectation is the point. A quality report nobody reads is **strictly worse** than no report, because it creates the impression of coverage."
    },

    "etl-pipeline-observability": {
      title: "Lineage parsed out of the SQL itself",
      nodes: [
        { id: "sql", label: "Pipeline SQL", sub: "dbt · Airflow tasks", kind: "client", col: 0, row: 1 },
        { id: "ast", label: "SQLGlot AST", sub: "resolve tables + columns", kind: "service", col: 1, row: 1 },
        { id: "ev", label: "OpenLineage events", sub: "run · inputs · outputs", kind: "queue", col: 2, row: 1 },
        { id: "gr", label: "Lineage graph", sub: "NetworkX DAG", kind: "store", col: 3, row: 1 },
        { id: "blast", label: "Blast radius", sub: "downstream of a change", kind: "service", col: 4, row: 0 },
        { id: "ui", label: "Graph explorer", sub: "Cytoscape", kind: "client", col: 4, row: 2 }
      ],
      edges: [
        { from: "sql", to: "ast" },
        { from: "ast", to: "ev" },
        { from: "ev", to: "gr" },
        { from: "gr", to: "blast" },
        { from: "gr", to: "ui" }
      ],
      note: "Parsing the SQL gives **column-level** lineage, which is the version people actually need: knowing that a table is downstream is far less useful than knowing which column breaks."
    },

    "realtime-clickstream-pipeline": {
      title: "Event time, not arrival time",
      nodes: [
        { id: "web", label: "Web + mobile", sub: "click events", kind: "client", col: 0, row: 1 },
        { id: "k", label: "Kafka", sub: "Avro + schema registry", kind: "queue", col: 1, row: 1 },
        { id: "fl", label: "Flink", sub: "event-time windows", kind: "service", col: 2, row: 1 },
        { id: "wm", label: "Watermarks", sub: "how late is too late", kind: "note", col: 2, row: 0 },
        { id: "late", label: "Side output", sub: "late events, not dropped", kind: "store", col: 3, row: 0 },
        { id: "ch", label: "ClickHouse", sub: "columnar · MergeTree", kind: "store", col: 3, row: 1 },
        { id: "gr", label: "Grafana", sub: "live funnel", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "web", to: "k" },
        { from: "k", to: "fl" },
        { from: "wm", to: "fl", dashed: true },
        { from: "fl", to: "late", label: "too late" },
        { from: "fl", to: "ch", label: "windowed aggregates" },
        { from: "ch", to: "gr" }
      ],
      note: "A watermark is a **promise** that no earlier event will arrive. Set it too tight and you drop real data; too loose and every window waits. Routing late events to a side output means you can measure the cost of the choice."
    },

    "cdc-stream-processor": {
      title: "Reading the write-ahead log instead of polling",
      nodes: [
        { id: "app", label: "Application", sub: "ordinary writes", kind: "client", col: 0, row: 0 },
        { id: "pg", label: "PostgreSQL", sub: "logical replication slot", kind: "store", col: 1, row: 0 },
        { id: "wal", label: "WAL", sub: "every change, in order", kind: "note", col: 1, row: 1 },
        { id: "dbz", label: "Debezium", sub: "decode → change events", kind: "service", col: 2, row: 1 },
        { id: "k", label: "Kafka", sub: "keyed by primary key", kind: "queue", col: 3, row: 1 },
        { id: "sink", label: "Indexer", sub: "idempotent upsert", kind: "worker", col: 4, row: 1 },
        { id: "es", label: "Elasticsearch", sub: "searchable mirror", kind: "store", col: 5, row: 1 },
        { id: "lag", label: "Lag monitor", sub: "slot growth alarm", kind: "worker", col: 3, row: 2 }
      ],
      edges: [
        { from: "app", to: "pg" },
        { from: "pg", to: "wal" },
        { from: "wal", to: "dbz" },
        { from: "dbz", to: "k" },
        { from: "k", to: "sink" },
        { from: "sink", to: "es" },
        { from: "k", to: "lag", muted: true, dashed: true }
      ],
      note: "Monitor the **replication slot**: a stalled consumer stops Postgres reclaiming WAL, and the disk fills. This is the failure that takes the source database down, not the pipeline."
    },

    "geospatial-h3-indexing-pipeline": {
      title: "Turning coordinates into joinable keys",
      nodes: [
        { id: "gps", label: "GPS pings", sub: "lat · lng · timestamp", kind: "client", col: 0, row: 1 },
        { id: "h3", label: "H3 indexing", sub: "cell id at res 8–9", kind: "service", col: 1, row: 1 },
        { id: "duck", label: "DuckDB", sub: "columnar · vectorised", kind: "store", col: 2, row: 1 },
        { id: "ring", label: "k-ring traversal", sub: "O(1) neighbours", kind: "service", col: 3, row: 0 },
        { id: "agg", label: "Cell aggregates", sub: "supply · demand · speed", kind: "service", col: 3, row: 2 },
        { id: "api", label: "Tile API", sub: "FastAPI", kind: "service", col: 4, row: 1 },
        { id: "kep", label: "Kepler.gl", sub: "hexagon heatmap", kind: "client", col: 5, row: 1 }
      ],
      edges: [
        { from: "gps", to: "h3" },
        { from: "h3", to: "duck" },
        { from: "duck", to: "ring" },
        { from: "duck", to: "agg" },
        { from: "ring", to: "api" },
        { from: "agg", to: "api" },
        { from: "api", to: "kep" }
      ],
      note: "Once a point is a **cell id**, spatial analysis becomes a `GROUP BY` on an integer. That is the whole reason grid indexing beats geometry queries at scale."
    },

    "dag-workflow-orchestrator": {
      title: "A scheduler that only ever runs what is ready",
      nodes: [
        { id: "dag", label: "DAG definition", sub: "tasks + dependencies", kind: "client", col: 0, row: 1 },
        { id: "val", label: "Cycle check", sub: "topological sort", kind: "service", col: 1, row: 0 },
        { id: "sch", label: "Scheduler", sub: "finds runnable tasks", kind: "service", col: 1, row: 1 },
        { id: "db", label: "Run state", sub: "PostgreSQL · SKIP LOCKED", kind: "store", col: 2, row: 1 },
        { id: "q", label: "Task queue", sub: "Redis", kind: "queue", col: 3, row: 1 },
        { id: "w", label: "Worker pool", sub: "heartbeat · retries", kind: "worker", col: 4, row: 1 },
        { id: "ui", label: "Graph UI", sub: "live task states", kind: "client", col: 2, row: 2 }
      ],
      edges: [
        { from: "dag", to: "val" },
        { from: "dag", to: "sch" },
        { from: "sch", to: "db" },
        { from: "db", to: "q", label: "ready" },
        { from: "q", to: "w" },
        { from: "w", to: "db", label: "result", dashed: true },
        { from: "db", to: "ui", muted: true, dashed: true }
      ],
      note: "`SELECT ... FOR UPDATE SKIP LOCKED` lets many schedulers claim tasks concurrently **without a distributed lock** — the database does the mutual exclusion for you."
    },

    "columnar-parquet-query-engine": {
      title: "Read less, and process what you read in batches",
      nodes: [
        { id: "q", label: "Query", sub: "SELECT a WHERE b > 10", kind: "client", col: 0, row: 1 },
        { id: "pl", label: "Planner", sub: "pushdown + pruning", kind: "service", col: 1, row: 1 },
        { id: "meta", label: "Row-group stats", sub: "min / max per column", kind: "note", col: 2, row: 0 },
        { id: "rd", label: "Column reader", sub: "only referenced columns", kind: "service", col: 2, row: 1 },
        { id: "dec", label: "Decoder", sub: "RLE · dictionary · bit-pack", kind: "service", col: 3, row: 1 },
        { id: "arrow", label: "Arrow batches", sub: "columnar in memory", kind: "store", col: 4, row: 1 },
        { id: "simd", label: "SIMD operators", sub: "filter · aggregate", kind: "service", col: 5, row: 1 }
      ],
      edges: [
        { from: "q", to: "pl" },
        { from: "meta", to: "pl", label: "skip groups", dashed: true },
        { from: "pl", to: "rd" },
        { from: "rd", to: "dec" },
        { from: "dec", to: "arrow" },
        { from: "arrow", to: "simd" }
      ],
      note: "Two independent wins compound: **column pruning** avoids reading data, and **row-group statistics** avoid reading rows. Vectorised execution only matters after both."
    },

    "distributed-mapreduce-engine": {
      title: "Map, shuffle, reduce — and what happens when a worker dies",
      nodes: [
        { id: "in", label: "Input splits", sub: "16 MB chunks", kind: "store", col: 0, row: 1 },
        { id: "m", label: "Master", sub: "task state machine", kind: "service", col: 1, row: 1 },
        { id: "mw", label: "Map workers", sub: "emit (k, v)", kind: "worker", col: 2, row: 0 },
        { id: "int", label: "Intermediate files", sub: "hash(k) mod R", kind: "store", col: 3, row: 0 },
        { id: "rw", label: "Reduce workers", sub: "sort + fold", kind: "worker", col: 3, row: 2 },
        { id: "out", label: "Output files", sub: "one per reducer", kind: "store", col: 4, row: 1 },
        { id: "hb", label: "Heartbeats", sub: "reassign on timeout", kind: "note", col: 1, row: 2 }
      ],
      edges: [
        { from: "in", to: "m" },
        { from: "m", to: "mw" },
        { from: "mw", to: "int" },
        { from: "int", to: "rw", label: "shuffle" },
        { from: "rw", to: "out" },
        { from: "hb", to: "m", dashed: true },
        { from: "m", to: "rw", muted: true, dashed: true }
      ],
      note: "Map tasks are **idempotent and deterministic**, so a dead worker's task simply runs again elsewhere. That property is the entire fault-tolerance design."
    },

    "lakehouse-iceberg-metadata-engine": {
      title: "Atomic commits over immutable files",
      nodes: [
        { id: "w", label: "Writer", sub: "adds Parquet files", kind: "client", col: 0, row: 1 },
        { id: "occ", label: "Optimistic commit", sub: "compare-and-swap pointer", kind: "service", col: 1, row: 1 },
        { id: "cat", label: "Catalog pointer", sub: "current metadata file", kind: "note", col: 2, row: 0 },
        { id: "meta", label: "Metadata file", sub: "schema + snapshot list", kind: "store", col: 2, row: 1 },
        { id: "man", label: "Manifest list", sub: "per-file stats", kind: "store", col: 3, row: 1 },
        { id: "data", label: "Parquet files", sub: "immutable", kind: "store", col: 4, row: 1 },
        { id: "r", label: "Reader", sub: "prunes via manifests", kind: "client", col: 4, row: 0 },
        { id: "tt", label: "Time travel", sub: "read an old snapshot", kind: "service", col: 3, row: 2 }
      ],
      edges: [
        { from: "w", to: "occ" },
        { from: "occ", to: "cat", label: "CAS" },
        { from: "cat", to: "meta" },
        { from: "meta", to: "man" },
        { from: "man", to: "data" },
        { from: "man", to: "r", label: "skip files", dashed: true },
        { from: "meta", to: "tt", dashed: true }
      ],
      note: "A commit is one **atomic pointer swap**. Everything else is immutable, which is what gives you time travel and safe concurrent readers for free."
    },

    "distributed-timeseries-aggregator": {
      title: "Compression that exploits how metrics actually behave",
      nodes: [
        { id: "ag", label: "Agents", sub: "regular intervals", kind: "client", col: 0, row: 1 },
        { id: "ing", label: "Ingest", sub: "series id lookup", kind: "service", col: 1, row: 1 },
        { id: "ts", label: "Delta-of-delta", sub: "timestamps → ~1 bit", kind: "service", col: 2, row: 0 },
        { id: "xor", label: "XOR floats", sub: "values → ~1.4 bytes", kind: "service", col: 2, row: 2 },
        { id: "ring", label: "Chunked ring buffer", sub: "2h blocks, then sealed", kind: "store", col: 3, row: 1 },
        { id: "idx", label: "Inverted index", sub: "label → series ids", kind: "store", col: 4, row: 0 },
        { id: "pq", label: "PromQL engine", sub: "select · rate · aggregate", kind: "service", col: 4, row: 2 },
        { id: "mm", label: "Memory-mapped blocks", sub: "sealed history", kind: "store", col: 5, row: 1 }
      ],
      edges: [
        { from: "ag", to: "ing" },
        { from: "ing", to: "ts" },
        { from: "ing", to: "xor" },
        { from: "ts", to: "ring" },
        { from: "xor", to: "ring" },
        { from: "ring", to: "mm", label: "seal" },
        { from: "idx", to: "pq" },
        { from: "pq", to: "mm" }
      ],
      note: "Both compressions exploit the same fact: **consecutive samples barely differ**. Timestamps arrive on a fixed interval and values move slowly, so most bits are zero."
    },

    /* ================= Security ================= */

    "shamir-secret-sharing-vault": {
      title: "A secret that needs k of n people to reconstruct",
      nodes: [
        { id: "s", label: "Secret", sub: "master key", kind: "client", col: 0, row: 1 },
        { id: "gf", label: "GF(2⁸) arithmetic", sub: "add = XOR, mul = log tables", kind: "note", col: 1, row: 0 },
        { id: "poly", label: "Random polynomial", sub: "degree k-1, constant = secret", kind: "service", col: 1, row: 1 },
        { id: "sh", label: "Evaluate at n points", sub: "each point is one share", kind: "service", col: 2, row: 1 },
        { id: "d", label: "Distributed shares", sub: "n holders", kind: "external", col: 3, row: 1 },
        { id: "lag", label: "Lagrange interpolation", sub: "any k shares", kind: "service", col: 4, row: 1 },
        { id: "rec", label: "Secret recovered", sub: "k-1 shares reveal nothing", kind: "client", col: 5, row: 1 }
      ],
      edges: [
        { from: "s", to: "poly" },
        { from: "gf", to: "poly", dashed: true },
        { from: "poly", to: "sh" },
        { from: "sh", to: "d" },
        { from: "d", to: "lag", label: "any k" },
        { from: "lag", to: "rec" }
      ],
      note: "The security is **information-theoretic**, not computational: with k-1 shares every possible secret remains exactly as likely. No amount of compute helps."
    },

    "dns-sinkhole-adblocker": {
      title: "Answering some queries locally and forwarding the rest",
      nodes: [
        { id: "dev", label: "Devices", sub: "port 53 queries", kind: "client", col: 0, row: 1 },
        { id: "srv", label: "DNS server", sub: "UDP + TCP", kind: "service", col: 1, row: 1 },
        { id: "par", label: "RFC 1035 parser", sub: "name compression", kind: "service", col: 2, row: 1 },
        { id: "trie", label: "Blocklist trie", sub: "reversed labels", kind: "store", col: 3, row: 0 },
        { id: "sink", label: "Sinkhole reply", sub: "0.0.0.0 / NXDOMAIN", kind: "note", col: 4, row: 0 },
        { id: "cache", label: "Answer cache", sub: "honours TTL", kind: "cache", col: 3, row: 2 },
        { id: "up", label: "Upstream over DoH", sub: "encrypted forward", kind: "external", col: 4, row: 2 },
        { id: "ui", label: "Admin dashboard", sub: "blocked / allowed", kind: "client", col: 2, row: 3 }
      ],
      edges: [
        { from: "dev", to: "srv" },
        { from: "srv", to: "par" },
        { from: "par", to: "trie" },
        { from: "trie", to: "sink", label: "match" },
        { from: "par", to: "cache" },
        { from: "cache", to: "up", label: "miss" },
        { from: "srv", to: "ui", muted: true, dashed: true }
      ],
      note: "Store domains **reversed** in the trie (`com.example.ads`), so blocking a domain and all its subdomains is a single prefix match rather than a scan."
    },

    "honey-pot-ssh-logger": {
      title: "A convincing shell that records everything and runs nothing",
      nodes: [
        { id: "att", label: "Attacker", sub: "scanning the internet", kind: "external", col: 0, row: 1 },
        { id: "ssh", label: "Fake SSH server", sub: "AsyncSSH · real banner", kind: "service", col: 1, row: 1 },
        { id: "cred", label: "Credential log", sub: "every attempt recorded", kind: "store", col: 2, row: 0 },
        { id: "sh", label: "Emulated shell", sub: "fake fs · plausible output", kind: "service", col: 2, row: 1 },
        { id: "cap", label: "Payload capture", sub: "wget/curl URLs · hashes", kind: "worker", col: 3, row: 1 },
        { id: "geo", label: "Enrichment", sub: "GeoIP · ASN · abuse feeds", kind: "service", col: 4, row: 1 },
        { id: "db", label: "Threat database", sub: "sessions + payloads", kind: "store", col: 5, row: 0 },
        { id: "alert", label: "Alerting", sub: "webhook on novel payload", kind: "worker", col: 5, row: 2 }
      ],
      edges: [
        { from: "att", to: "ssh" },
        { from: "ssh", to: "cred" },
        { from: "ssh", to: "sh" },
        { from: "sh", to: "cap" },
        { from: "cap", to: "geo" },
        { from: "geo", to: "db" },
        { from: "geo", to: "alert" }
      ],
      note: "Run it on an **isolated network with no outbound access**, on a host you can destroy. A honeypot that can reach your other machines is not a honeypot."
    },

    "packet-sniffer-ids": {
      title: "From raw frames to a rule match",
      nodes: [
        { id: "nic", label: "NIC", sub: "promiscuous mode", kind: "external", col: 0, row: 1 },
        { id: "cap", label: "Raw socket", sub: "AF_PACKET / libpcap", kind: "service", col: 1, row: 1 },
        { id: "eth", label: "Layer dissector", sub: "Ethernet → IP → TCP", kind: "service", col: 2, row: 1 },
        { id: "reasm", label: "Stream reassembly", sub: "reorder by sequence", kind: "service", col: 3, row: 0 },
        { id: "scan", label: "Scan detection", sub: "SYN fan-out per source", kind: "service", col: 3, row: 2 },
        { id: "rule", label: "Rule engine", sub: "Snort-style signatures", kind: "service", col: 4, row: 1 },
        { id: "alert", label: "Alert store + TUI", sub: "live view", kind: "client", col: 5, row: 1 }
      ],
      edges: [
        { from: "nic", to: "cap" },
        { from: "cap", to: "eth" },
        { from: "eth", to: "reasm" },
        { from: "eth", to: "scan" },
        { from: "reasm", to: "rule" },
        { from: "scan", to: "rule" },
        { from: "rule", to: "alert" }
      ],
      note: "Reassembly matters because an attacker can **split a signature across packets**. Matching per packet is trivially evaded by fragmenting the payload."
    },

    "static-code-vuln-scanner": {
      title: "Following untrusted data from where it enters to where it hurts",
      nodes: [
        { id: "src", label: "Source files", sub: "repository", kind: "client", col: 0, row: 1 },
        { id: "ts", label: "Tree-sitter", sub: "concrete syntax tree", kind: "service", col: 1, row: 1 },
        { id: "cfg", label: "Control flow", sub: "per function", kind: "service", col: 2, row: 0 },
        { id: "taint", label: "Taint tracker", sub: "source → sink paths", kind: "service", col: 2, row: 1 },
        { id: "rules", label: "YAML rules", sub: "sources · sinks · sanitisers", kind: "store", col: 2, row: 2 },
        { id: "san", label: "Sanitiser check", sub: "clears the taint", kind: "note", col: 3, row: 0 },
        { id: "sarif", label: "SARIF output", sub: "standard finding format", kind: "service", col: 3, row: 2 },
        { id: "ci", label: "Pre-commit / CI", sub: "annotated diffs", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "src", to: "ts" },
        { from: "ts", to: "cfg" },
        { from: "ts", to: "taint" },
        { from: "rules", to: "taint", dashed: true },
        { from: "cfg", to: "taint" },
        { from: "san", to: "taint", dashed: true },
        { from: "taint", to: "sarif" },
        { from: "sarif", to: "ci" }
      ],
      note: "Sanitiser modelling is what keeps the false-positive rate survivable. A scanner that flags every string reaching a query builder gets **turned off** within a week."
    },

    "zero-trust-proxy-mtls": {
      title: "Identity on both ends, policy in the middle",
      nodes: [
        { id: "svc", label: "Calling service", sub: "presents a client cert", kind: "client", col: 0, row: 1 },
        { id: "ca", label: "Internal CA", sub: "SPIFFE identities", kind: "external", col: 0, row: 0 },
        { id: "px", label: "Zero-trust proxy", sub: "terminates mTLS", kind: "service", col: 1, row: 1 },
        { id: "id", label: "Identity extraction", sub: "SPIFFE ID from SAN", kind: "service", col: 2, row: 0 },
        { id: "opa", label: "OPA / Rego", sub: "allow or deny", kind: "service", col: 3, row: 1 },
        { id: "up", label: "Upstream service", sub: "never exposed directly", kind: "service", col: 4, row: 1 },
        { id: "aud", label: "Audit log", sub: "every decision, both ways", kind: "store", col: 3, row: 2 }
      ],
      edges: [
        { from: "ca", to: "svc", label: "short-lived cert", dashed: true },
        { from: "svc", to: "px" },
        { from: "px", to: "id" },
        { from: "id", to: "opa" },
        { from: "opa", to: "up", label: "allow" },
        { from: "opa", to: "aud" }
      ],
      note: "**Log denials as well as allows.** A rising deny rate from one identity is the earliest signal you get of either a misconfiguration or a compromised workload."
    },

    "end-to-end-encrypted-chat": {
      title: "A new key for every message",
      nodes: [
        { id: "a", label: "Alice", sub: "identity + ephemeral keys", kind: "client", col: 0, row: 1 },
        { id: "x3", label: "X25519 exchange", sub: "initial shared secret", kind: "service", col: 1, row: 1 },
        { id: "root", label: "Root chain", sub: "advances on new DH", kind: "service", col: 2, row: 0 },
        { id: "send", label: "Sending chain", sub: "one key per message", kind: "service", col: 2, row: 2 },
        { id: "aes", label: "AES-256-GCM", sub: "encrypt + authenticate", kind: "service", col: 3, row: 1 },
        { id: "srv", label: "Relay server", sub: "sees only ciphertext", kind: "external", col: 4, row: 1 },
        { id: "b", label: "Bob", sub: "mirrored ratchet state", kind: "client", col: 5, row: 1 },
        { id: "skip", label: "Skipped key store", sub: "out-of-order delivery", kind: "note", col: 4, row: 2 }
      ],
      edges: [
        { from: "a", to: "x3" },
        { from: "x3", to: "root" },
        { from: "root", to: "send" },
        { from: "send", to: "aes" },
        { from: "aes", to: "srv" },
        { from: "srv", to: "b" },
        { from: "skip", to: "b", dashed: true }
      ],
      note: "Deriving and discarding a key per message gives **forward secrecy** and post-compromise recovery: stealing today's key reveals neither yesterday's messages nor tomorrow's."
    },

    "fuzzing-engine-binary": {
      title: "Mutate, run, keep whatever finds new code",
      nodes: [
        { id: "seed", label: "Seed corpus", sub: "valid inputs", kind: "store", col: 0, row: 1 },
        { id: "mut", label: "Mutator", sub: "bitflip · splice · havoc", kind: "service", col: 1, row: 1 },
        { id: "fs", label: "Fork server", sub: "skip exec() each run", kind: "service", col: 2, row: 1 },
        { id: "tgt", label: "Instrumented target", sub: "SanitizerCoverage", kind: "external", col: 3, row: 1 },
        { id: "bm", label: "64 KB bitmap", sub: "edge hit counts", kind: "store", col: 3, row: 0 },
        { id: "new", label: "New coverage?", sub: "keep as a new seed", kind: "note", col: 4, row: 0 },
        { id: "cr", label: "Crash triage", sub: "dedupe by stack hash", kind: "worker", col: 4, row: 2 }
      ],
      edges: [
        { from: "seed", to: "mut" },
        { from: "mut", to: "fs" },
        { from: "fs", to: "tgt" },
        { from: "tgt", to: "bm" },
        { from: "bm", to: "new" },
        { from: "new", to: "seed", label: "add to corpus", dashed: true },
        { from: "tgt", to: "cr", label: "signal" }
      ],
      note: "The **fork server** is the single biggest speed win: fork from an already-initialised process instead of paying for `execve` and dynamic linking on every one of a million runs."
    },

    "kernel-rootkit-detector": {
      title: "Cross-checking the kernel against itself",
      nodes: [
        { id: "lkm", label: "Detector LKM", sub: "loadable kernel module", kind: "service", col: 0, row: 1 },
        { id: "sct", label: "Syscall table", sub: "compare to expected", kind: "service", col: 1, row: 0 },
        { id: "tl", label: "Task list walk", sub: "kernel view of processes", kind: "service", col: 1, row: 2 },
        { id: "pr", label: "/proc listing", sub: "userspace view", kind: "external", col: 2, row: 2 },
        { id: "diff", label: "Discrepancy check", sub: "in one, not the other", kind: "note", col: 3, row: 1 },
        { id: "nf", label: "Netfilter hooks", sub: "unexpected registrations", kind: "service", col: 2, row: 0 },
        { id: "rep", label: "Findings report", sub: "with evidence", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "lkm", to: "sct" },
        { from: "lkm", to: "tl" },
        { from: "tl", to: "diff" },
        { from: "pr", to: "diff" },
        { from: "sct", to: "diff" },
        { from: "nf", to: "diff" },
        { from: "diff", to: "rep" }
      ],
      note: "The technique is **differential**: a process hidden from `/proc` by unlinking it from one list is still on the scheduler's run queue. Any inconsistency between two views is the signal."
    },

    "automated-ddos-mitigation-xdp": {
      title: "Dropping floods before the kernel allocates anything",
      nodes: [
        { id: "att", label: "Attack traffic", sub: "SYN flood · spoofed", kind: "external", col: 0, row: 0 },
        { id: "leg", label: "Legitimate traffic", sub: "real clients", kind: "client", col: 0, row: 2 },
        { id: "xdp", label: "XDP hook", sub: "in the NIC driver", kind: "service", col: 1, row: 1 },
        { id: "bloom", label: "BPF bloom filter", sub: "known-good sources", kind: "store", col: 2, row: 0 },
        { id: "ck", label: "SYN cookie check", sub: "XDP_TX the challenge", kind: "service", col: 2, row: 1 },
        { id: "rl", label: "Per-source rate limit", sub: "per-CPU BPF map", kind: "service", col: 2, row: 2 },
        { id: "drop", label: "XDP_DROP", sub: "no skb ever allocated", kind: "note", col: 3, row: 0 },
        { id: "stack", label: "Network stack", sub: "only survivors", kind: "service", col: 3, row: 2 },
        { id: "ui", label: "Telemetry UI", sub: "drop rate · top sources", kind: "client", col: 4, row: 1 }
      ],
      edges: [
        { from: "att", to: "xdp" },
        { from: "leg", to: "xdp" },
        { from: "xdp", to: "bloom" },
        { from: "xdp", to: "ck" },
        { from: "xdp", to: "rl" },
        { from: "ck", to: "drop", label: "bad cookie" },
        { from: "rl", to: "stack", label: "pass" },
        { from: "rl", to: "ui", muted: true, dashed: true }
      ],
      note: "XDP runs **before an `sk_buff` is allocated**, which is why it can drop tens of millions of packets per second on one core. Any filtering above this point has already paid the cost."
    }
  };
})(window.TD = window.TD || {});
