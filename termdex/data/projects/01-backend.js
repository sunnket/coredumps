/* Project Lab — Full-Stack & Backend Systems */
(function (TD) {
  TD.addProjects("backend", [
    {
      id: "url-shortener-analytics",
      title: "High-Throughput URL Shortener & Clickstream Engine",
      domain: "backend",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "1–2 weeks",
      tagline: "Build a production-grade URL redirection service with Base62 encoding and real-time geo-analytics.",
      problem: "Standard relational databases choke when handling millions of shortlink redirections per second. You must engineer a low-latency redirection gateway that encodes 64-bit integer IDs into compact 7-character URLs, caches hot routes in Redis, and asynchronously captures clickstream telemetry (IP, user agent, referrer, geographic country) without degrading read response latency (<5ms).",
      outcome: "A deployed REST API and modern dashboard that converts long URLs into custom shortlinks, executes sub-5ms redirects, and visualizes real-time click heatmaps and device analytics.",
      stack: ["Go or Node.js / Express", "PostgreSQL", "Redis", "GeoIP2", "Tailwind CSS"],
      diagram: 
"Client HTTP GET /r/:code\n      │\n      ▼\n┌───────────────────────────────┐\n│ Nginx Reverse Proxy & SSL     │\n└──────────────┬────────────────┘\n               │\n               ▼\n┌───────────────────────────────┐      Cache Hit (<2ms)\n│ App Gateway (Go / Node.js)    ├──────────────────────────► Redis Cache (LRU)\n└──────────────┬────────────────┘\n               │ Cache Miss\n               ▼\n┌───────────────────────────────┐\n│ PostgreSQL (B-Tree on code)   │\n└──────────────┬────────────────┘\n               │ Async Event\n               ▼\n┌───────────────────────────────┐\n│ Background Analytics Worker   │ ──► GeoIP Lookup ──► Clickstream Table\n└───────────────────────────────┘",
      steps: [
        { title: "Phase 1: Base62 & Database Schema", desc: "Design the PostgreSQL schema with autoincrementing 64-bit sequence IDs. Implement a Base62 bi-directional converter algorithm (mapping alphabet [0-9a-zA-Z]) to convert IDs into 6-7 char slugs." },
        { title: "Phase 2: Redis Caching & Fast Redirection", desc: "Implement a Cache-Aside pattern. On GET `/r/:code`, query Redis first. On cache miss, query PostgreSQL, populate Redis with a 24-hour TTL, and issue an HTTP 302 redirect." },
        { title: "Phase 3: Asynchronous Telemetry Pipeline", desc: "Use an in-memory channel or Redis pub/sub to offload click metrics. The background worker parses User-Agent headers and resolves client IP to geographic country using MaxMind GeoIP2." },
        { title: "Phase 4: Analytics Dashboard UI", desc: "Build a frontend dashboard with Chart.js showing total clicks over time, geographic breakdown, browser/OS distribution, and top referrers." }
      ],
      resources: [
        { title: "Base62 Encoding Explained (RFC 4648 Reference)", url: "https://en.wikipedia.org/wiki/Base62" },
        { title: "Redis Cache-Aside Pattern Guide", url: "https://redis.io/docs/manual/patterns/" },
        { title: "MaxMind GeoLite2 Free Geolocation Database", url: "https://dev.maxmind.com/geoip/geolite2-free-geolocation-data" }
      ],
      pitfalls: [
        "Avoid using random string generation for slugs; collisions scale rapidly (Birthday Paradox). Use monotonic counter IDs + Base62.",
        "Do not use HTTP 301 (Permanent Redirect) for analytics URLs because browsers cache 301s locally, bypassing your clickstream tracking. Use HTTP 302 Found."
      ],
      interview: [
        "How do you handle counter ID exhaustion in a distributed setup? (Answer: Snowflake ID generation or distributed ticket services).",
        "Why is HTTP 302 preferred over 301 when click telemetry is required?"
      ]
    },
    {
      id: "realtime-collaborative-canvas",
      title: "Real-Time Collaborative Canvas with CRDTs",
      domain: "backend",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a multiplayer whiteboard with conflict-free replicated data types and WebSocket synchronization.",
      problem: "When multiple users draw, drag objects, and type simultaneously on a shared canvas over high-latency networks, traditional client-server locking causes jitter and state desynchronization. You must implement a Conflict-Free Replicated Data Type (CRDT) engine over WebSockets to ensure eventual consistency, offline mutation queuing, and peer presence awareness.",
      outcome: "A Figma-like multi-user canvas supporting freehand drawing, geometric shapes, sticky notes, multiplayer live cursor tracking, undo/redo history, and room persistence.",
      stack: ["TypeScript", "HTML5 Canvas / Konva.js", "WebSockets", "Node.js", "Yjs / Automerge CRDT", "Redis"],
      diagram:
"Browser Client A                        Browser Client B\n┌──────────────────────┐                ┌──────────────────────┐\n│ Konva.js Canvas UI   │                │ Konva.js Canvas UI   │\n│ Local Yjs CRDT Doc   │                │ Local Yjs CRDT Doc   │\n└──────────┬───────────┘                └──────────┬───────────┘\n           │ Binary Yjs Updates (Delta)            │\n           ▼                                       ▼\n┌──────────────────────────────────────────────────────────────┐\n│ WebSocket Synchronization Server (Node.js)                   │\n│ Broadcasts binary state vectors & manages room connections   │\n└──────────────────────────────┬───────────────────────────────┘\n                               │ Pub/Sub Multi-Node Scale\n                               ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Redis Pub/Sub Cluster + LevelDB Persistent Room Store        │\n└──────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Canvas Engine & Vector Primitives", desc: "Set up Konva.js / Fabric.js canvas to render bezier curves, rectangles, text boxes, and transformations with 60 FPS requestAnimationFrame rendering." },
        { title: "Phase 2: CRDT Integration with Yjs", desc: "Model shapes as `Y.Array` and `Y.Map` primitives. Bind canvas event listeners to local CRDT transactions and listen for remote delta updates." },
        { title: "Phase 3: WebSocket Server & Ephemeral Awareness", desc: "Build a WebSocket server handling room joining, heartbeat pings, and live cursor coordinates (X, Y, user color, username) using Yjs Awareness protocol." },
        { title: "Phase 4: Persistence & Room Management", desc: "Implement incremental document snapshots saved to SQLite or LevelDB so boards persist across server restarts." }
      ],
      resources: [
        { title: "Yjs CRDT Framework Documentation", url: "https://docs.yjs.dev/" },
        { title: "Martin Kleppmann: Conflict-Free Replicated Data Types Paper", url: "https://martin.kleppmann.com/papers/crdt-survey.pdf" },
        { title: "HTML5 Canvas Optimization Guide (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas" }
      ],
      pitfalls: [
        "Do not send raw mousemove events over WebSockets on every pixel; throttle cursor updates to ~30Hz to prevent saturating bandwidth.",
        "Beware of memory leaks in long-running canvas sessions; serialize shape histories into consolidated snapshots."
      ],
      interview: [
        "Explain the difference between Operational Transformation (OT) and CRDTs in real-time collaborative editors.",
        "How do State-based CRDTs (CvRDT) differ from Operation-based CRDTs (CmRDT)?"
      ]
    },
    {
      id: "api-rate-limiter-gateway",
      title: "Distributed API Rate Limiter & Reverse Proxy",
      domain: "backend",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a high-performance reverse proxy with Token Bucket, Sliding Window Counter, and Redis Lua scripts.",
      problem: "Public APIs must protect upstream microservices from brute-force denial of service, greedy API scrapers, and cascading server outages. You need to engineer an inline reverse proxy that authenticates API keys, enforces tier-based rate limits (e.g. 100 req/min for Free, 5,000 req/min for Enterprise), and returns RFC-compliant rate limit headers with sub-millisecond overhead.",
      outcome: "A standalone gateway middleware and CLI load tester that intercepts HTTP traffic, validates JWT/API tokens, and enforces rate limiters with atomic Redis scripts.",
      stack: ["Go / Rust or Node.js", "Redis (Lua Scripting)", "HTTP Reverse Proxy", "Prometheus / Grafana"],
      diagram:
"Incoming Client HTTP Request\n              │\n              ▼\n┌────────────────────────────────────────┐\n│ Rate Limiter Middleware Gateway        │\n│ 1. Extract API Key / IP                │\n│ 2. Check Plan Quota Tier               │\n└─────────────┬──────────────────────────┘\n              │ Execute Atomic Lua Script\n              ▼\n┌────────────────────────────────────────┐\n│ Redis (Sliding Window Log / Counter)   │\n└─────────────┬──────────────────────────┘\n              │\n       ┌──────┴──────────────────────────┐\n       │ Allowed                         │ Quota Exceeded (429)\n       ▼                                 ▼\n┌───────────────────────────────┐ ┌──────────────────────────────────────┐\n│ Reverse Proxy to Upstream App │ │ Return HTTP 429 Too Many Requests    │\n│ Headers: X-RateLimit-Remaining│ │ Headers: Retry-After: 14             │\n└───────────────────────────────┘ └──────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Reverse Proxy Core", desc: "Construct a Go `httputil.ReverseProxy` or Node `http-proxy` that forwards traffic to upstream target servers while measuring latency." },
        { title: "Phase 2: Token Bucket & Sliding Window Algorithms", desc: "Implement Token Bucket and Sliding Window Counter algorithms. Write atomic Redis Lua scripts to increment timestamps and check counts within a single atomic roundtrip." },
        { title: "Phase 3: RFC Headers & Dynamic Tier Policies", desc: "Attach `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers. On violations, respond immediately with HTTP 429 and `Retry-After`." },
        { title: "Phase 4: Benchmarking & Prometheus Metrics", desc: "Benchmark the gateway with `wrk` or `k6` to verify it handles 20,000+ RPS with <1ms P99 latency impact. Export Prometheus metrics for rejected vs accepted requests." }
      ],
      resources: [
        { title: "IETF RFC 6585: HTTP 429 Status Code Specification", url: "https://datatracker.ietf.org/doc/html/rfc6585" },
        { title: "Redis Lua Scripting Reference Guide", url: "https://redis.io/docs/manual/programmability/eval-intro/" },
        { title: "Stripe Engineering: Scaling Your API with Rate Limiters", url: "https://stripe.com/blog/rate-limiters" }
      ],
      pitfalls: [
        "Do not execute multiple non-atomic GET and SET commands in Redis; race conditions will allow users to exceed quotas. Always use atomic Lua scripts or Redis Transactions (MULTI/EXEC).",
        "Watch out for memory bloat when using Sliding Window Logs with high request volumes. Transition to Sliding Window Counter for $O(1)$ memory."
      ],
      interview: [
        "Compare the Token Bucket, Leaky Bucket, and Sliding Window Counter rate limiting algorithms.",
        "How do you handle race conditions in distributed rate limiters across multiple gateway instances?"
      ]
    },
    {
      id: "distributed-task-queue",
      title: "Distributed Task Queue & Job Scheduler from Scratch",
      domain: "backend",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a reliable Celery/BullMQ alternative with Redis Streams, exponential backoff, and dead-letter queues.",
      problem: "Long-running tasks (video processing, email dispatch, AI model batch inference) cannot execute inside synchronous HTTP request-response cycles. You must build an asynchronous distributed job queue that distributes jobs across a pool of concurrent worker nodes, handles node crashes with ack heartbeats, and guarantees at-least-once delivery.",
      outcome: "A complete task queue library, CLI worker runner, and real-time web monitoring UI showing active, waiting, failed, and delayed job metrics.",
      stack: ["Go or TypeScript", "Redis Streams / PostgreSQL SKIP LOCKED", "WebSockets", "Docker"],
      diagram:
"Web API Server                   Worker Cluster (Node 1, Node 2, Node 3)\n┌──────────────┐                 ┌───────────────┐ ┌───────────────┐\n│ Producer     │                 │ Worker Node A │ │ Worker Node B │\n│ Enqueue Job  │                 │ Heartbeat     │ │ Heartbeat     │\n└──────┬───────┘                 └───────▲───────┘ └───────▲───────┘\n       │ XADD stream                     │ XREADGROUP (Consumer Group)\n       ▼                                 │\n┌────────────────────────────────────────┴─────────────────────────┐\n│ Redis Streams (Persistent Append-Only Log)                       │\n│ • Pending Entries List (PEL) tracks in-flight un-ACKed jobs      │\n└────────────────────────────────┬─────────────────────────────────┘\n                                 │ Auto-Claim on Worker Crash\n                                 ▼\n┌──────────────────────────────────────────────────────────────────┐\n│ Dead-Letter Queue (DLQ) for jobs exceeding max retry limit (5x)  │\n└──────────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Task Serialization & Message Envelope", desc: "Define a JSON/MessagePack envelope containing JobID, HandlerName, Payload, Priority, RetryCount, and DelayTimestamp." },
        { title: "Phase 2: Redis Stream Consumer Groups", desc: "Use `XADD` to enqueue jobs and `XREADGROUP` to distribute work among worker instances. Implement `XACK` on successful job completion." },
        { title: "Phase 3: Worker Failure Recovery & Exponential Backoff", desc: "Build an auto-claim daemon using `XPENDING` and `XCLAIM` to detect crashed workers (PEL timeout > 30s) and reassign in-flight jobs. Implement exponential backoff with jitter on task errors." },
        { title: "Phase 4: Dead Letter Queue & Monitoring Dashboard", desc: "Route tasks failing after 5 attempts to a Dead Letter Queue (DLQ). Build a dashboard UI for monitoring throughput, latency, and manual job re-triggering." }
      ],
      resources: [
        { title: "Redis Streams Specification & Consumer Groups", url: "https://redis.io/docs/data-types/streams/" },
        { title: "PostgreSQL SELECT FOR UPDATE SKIP LOCKED Architecture", url: "https://www.2ndquadrant.com/en/blog/what-is-select-skip-locked/" },
        { title: "AWS Architecture: Exponential Backoff and Jitter", url: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/" }
      ],
      pitfalls: [
        "Failing to implement heartbeats causes phantom tasks: a worker running an intensive job may get its task re-assigned if its ack timeout is too short.",
        "Ensure task handlers are **idempotent** because network partitions and worker restarts will result in duplicate executions under at-least-once delivery."
      ],
      interview: [
        "What is the difference between at-least-once, at-most-once, and exactly-once message delivery semantics?",
        "How do you safely schedule future delayed jobs (e.g. run this in 3 hours) using Redis Sorted Sets or DB indexes?"
      ]
    },
    {
      id: "webhook-delivery-engine",
      title: "Resilient Webhook Dispatcher & Ingestion Engine",
      domain: "backend",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a Stripe-grade webhook engine with HMAC SHA-256 signatures, backpressure, and jitter retries.",
      problem: "When building developer platforms, sending webhooks to third-party customer endpoints is fraught with timeouts, SSL errors, and server crashes on the receiver's side. You need to build a high-volume dispatcher that signs payloads with cryptographic HMAC keys, isolates failing customer URLs so they don't block healthy endpoints, and executes smart exponential retries over 72 hours.",
      outcome: "A developer-facing webhook service with payload signing, customer retry inspection logs, endpoint health monitoring, and a mock webhook receiver debugger.",
      stack: ["Node.js / Go", "PostgreSQL", "RabbitMQ or Redis", "Fastify / Gin", "Crypto (HMAC-SHA256)"],
      diagram:
"Internal Business Event (e.g. payment.succeeded)\n                     │\n                     ▼\n┌────────────────────────────────────────┐\n│ Webhook Dispatch Service               │\n│ Computes HMAC-SHA256 Signature Header  │\n└────────────────────┬───────────────────┘\n                     │ Enqueue per-endpoint partition\n                     ▼\n┌────────────────────────────────────────┐\n│ Message Broker (RabbitMQ / Redis)      │\n└────────────────────┬───────────────────┘\n                     │ Worker Pool with Circuit Breaker\n                     ▼\n┌────────────────────────────────────────┐\n│ HTTP Delivery Dispatcher (Timeout: 5s) │\n└──────────┬─────────────────────────────┘\n           │\n     ┌─────┴─────────────────────────────┐\n     │ 200 OK                            │ 500 / Timeout\n     ▼                                   ▼\n┌─────────────────────────┐  ┌───────────────────────────────────┐\n│ Mark Event Delivered    │  │ Exponential Backoff + Jitter Retries\n│ Save Status in DB       │  │ Next attempt in 5m → 15m → 1h → 6h│\n└─────────────────────────┘  └───────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Event Subscription Management", desc: "Build CRUD APIs for registering webhook URLs, subscribed event types (e.g. `user.created`, `invoice.paid`), and generating unique per-endpoint signing secrets." },
        { title: "Phase 2: Cryptographic Payload Signing", desc: "Generate `Stripe-Signature` style headers: `t=timestamp,v1=HMAC_SHA256(timestamp + '.' + payload, secret)`. Prevent replay attacks by validating timestamps." },
        { title: "Phase 3: Worker Queue with Circuit Breakers", desc: "Implement delivery workers with strict 5-second timeouts. If a customer's endpoint fails consecutively (e.g. 50 times in a row), trigger a circuit breaker to disable the endpoint and alert the user." },
        { title: "Phase 4: Developer Webhook Portal", desc: "Build a UI where developers can view delivery history, inspect request headers and response bodies, test mock deliveries, and re-send failed events." }
      ],
      resources: [
        { title: "Stripe Webhook Signatures & Security Guide", url: "https://stripe.com/docs/webhooks/signatures" },
        { title: "Standard Webhooks Open Specification", url: "https://www.standardwebhooks.com/" },
        { title: "Martin Fowler: Circuit Breaker Pattern", url: "https://martinfowler.com/bliki/CircuitBreaker.html" }
      ],
      pitfalls: [
        "Never perform webhook HTTP dispatches in the main API request thread; slow receiver endpoints will exhaust your server's connection pool.",
        "Always implement SSRF protection to prevent malicious customers from registering `http://169.254.169.254/` (cloud metadata IP) or internal network URLs as webhooks."
      ],
      interview: [
        "How do you prevent Server-Side Request Forgery (SSRF) when making outbound HTTP requests to user-defined webhook URLs?",
        "How does cryptographic HMAC payload signing prevent MITM tampering and replay attacks?"
      ]
    },
    {
      id: "custom-orm-sqlite",
      title: "Lightweight Type-Safe ORM & Query Builder",
      domain: "backend",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build an active-record/data-mapper ORM with SQL AST generation, schema migrations, and connection pooling.",
      problem: "Developers frequently rely on heavy ORMs like Prisma or Hibernate without understanding how object properties map to parameterized SQL queries, how relations are hydrated without the N+1 query problem, or how database connection pooling operates. You will build a lightweight, type-safe TypeScript/Go ORM from first principles.",
      outcome: "A published NPM / Go module that allows developers to define models, run automated schema migrations, execute type-safe chained queries (`db.users.where('age', '>', 21).join(...)`), and batch pre-fetch relations.",
      stack: ["TypeScript", "SQLite3 / better-sqlite3", "Node.js", "AST Expression Parsing"],
      diagram:
"Developer Code: db.users.where('status', '=', 'active').include('posts').limit(10)\n                              │\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Abstract Syntax Tree (AST) Query Builder                     │\n│ Generates AST node tree: { SELECT, FROM, WHERE, LIMIT }      │\n└─────────────────────────────┬────────────────────────────────┘\n                              │\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ SQL Compiler & Parameter Sanitizer                           │\n│ Emits: 'SELECT * FROM users WHERE status = ? LIMIT 10', ['active']\n└─────────────────────────────┬────────────────────────────────┘\n                              │\n                              ▼\n┌──────────────────────────────────────────────────────────────┐\n│ Connection Pooler & Hydration Engine                         │\n│ Executes SQL on SQLite, batch-fetches posts (WHERE user_id IN)\n│ and hydrates nested JavaScript Objects                       │\n└──────────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Model Definition & Schema DDL", desc: "Design a schema declaration syntax specifying column types (string, int, boolean, foreign key) and auto-generate `CREATE TABLE` DDL queries." },
        { title: "Phase 2: Chained AST Query Builder", desc: "Implement fluent query chaining methods: `.where()`, `.andWhere()`, `.orderBy()`, `.limit()`, and `.offset()`. Build parameterized SQL queries to prevent SQL injection." },
        { title: "Phase 3: Relation Loading without N+1", desc: "Implement `hasMany` and `belongsTo` relations. When `.include('posts')` is requested, collect all parent IDs and execute a single `SELECT * FROM posts WHERE user_id IN (...)` batch query." },
        { title: "Phase 4: Migration Runner CLI", desc: "Build a CLI tool (`my-orm migrate:up`, `migrate:down`) that reads migration files and tracks applied version timestamps in a `_migrations` schema table." }
      ],
      resources: [
        { title: "How Query Builders Work: AST Compilation", url: "https://knexjs.org/guide/query-builder.html" },
        { title: "Solving the N+1 Query Problem with DataLoader", url: "https://github.com/graphql/dataloader" },
        { title: "SQLite C/C++ API Architecture", url: "https://www.sqlite.org/cintro.html" }
      ],
      pitfalls: [
        "Never concatenate raw user strings into SQL queries; always use parameterized positional arguments (`?` or `$1`) to avoid SQL injection vulnerabilities.",
        "Ensure foreign keys are properly indexed; unindexed foreign key lookups in relation pre-fetching cause full table scans."
      ],
      interview: [
        "Explain the N+1 query problem and how batch loading (`WHERE IN (...)`) solves it.",
        "What are the trade-offs between the Active Record pattern and the Data Mapper pattern?"
      ]
    },
    {
      id: "multi-tenant-auth-service",
      title: "Multi-Tenant OAuth2 & RBAC Authentication Service",
      domain: "backend",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a centralized identity provider with JWT asymmetric signing, RBAC permissions, and tenant data isolation.",
      problem: "Modern SaaS platforms require multi-tenant architectures where enterprise customers manage their own users, roles, and SSO credentials while guaranteeing complete cryptographic and database isolation between competing company accounts.",
      outcome: "A standalone Auth service implementing OAuth2 Authorization Code flow, RS256 JWT key rotation, session revocation with Redis, and tenant-scoped role-based access control (RBAC).",
      stack: ["Go or Node.js / Express", "PostgreSQL", "Redis", "Crypto (RSA / ECDSA)", "Docker"],
      diagram:
"Client App / SPA                   Auth Server                     Resource API\n┌──────────────┐                  ┌──────────────┐                ┌──────────────┐\n│ 1. Login Req ├─────────────────►│ Verify Creds │                │              │\n│              │◄─────────────────┤ Sign RS256   │                │              │\n│              │ JWT Access Token │ Access Token │                │              │\n│              │ (RS256 Private)  │ Refresh Token│                │              │\n│              │                  └──────────────┘                │              │\n│ 2. API Call with Bearer Token                                   │              │\n├────────────────────────────────────────────────────────────────►│ 3. Verify JWT│\n│                                                                 │ with RS256   │\n│                                                                 │ Public Key   │\n│                                                                 │ Check RBAC   │\n└─────────────────────────────────────────────────────────────────┴──────────────┘",
      steps: [
        { title: "Phase 1: Password Hashing & Schema Isolation", desc: "Design multi-tenant PostgreSQL schema with `tenant_id` foreign keys. Hash passwords using Argon2id or bcrypt with high work factors." },
        { title: "Phase 2: Asymmetric JWT Signing (RS256)", desc: "Generate 2048-bit RSA key pairs. The Auth server signs tokens with the Private Key; resource microservices verify tokens using only the cached Public Key (`/.well-known/jwks.json`)." },
        { title: "Phase 3: RBAC & Permission Middleware", desc: "Define granular permissions (e.g. `billing:read`, `users:delete`). Attach permissions into the JWT payload and build route guard middleware." },
        { title: "Phase 4: Refresh Token Rotation & Instant Revocation", desc: "Implement Refresh Token rotation with one-time use tokens in Redis. If a stolen refresh token is re-used, invalidate the entire token family immediately." }
      ],
      resources: [
        { title: "IETF RFC 7519: JSON Web Token (JWT) Standard", url: "https://datatracker.ietf.org/doc/html/rfc7519" },
        { title: "OWASP Authentication & Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
        { title: "RFC 6749: The OAuth 2.0 Authorization Framework", url: "https://datatracker.ietf.org/doc/html/rfc6749" }
      ],
      pitfalls: [
        "Never store sensitive information (passwords, PII) inside JWT payloads; JWTs are base64-encoded and can be read by anyone.",
        "Always implement Refresh Token Family tracking to detect token reuse attacks in compromised environments."
      ],
      interview: [
        "Why is RS256 asymmetric signing preferred over HS256 symmetric signing in microservice architectures?",
        "How do you instantly revoke a stateless JWT access token before its expiration time?"
      ]
    },
    {
      id: "file-storage-cdn-proxy",
      title: "Chunked File Storage & On-The-Fly Image CDN",
      domain: "backend",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build an S3-compatible chunked upload server with on-demand image transformations and local disk caching.",
      problem: "Uploading multi-gigabyte files fails frequently on unstable mobile connections, and serving raw user-uploaded images without resizing or format optimization wastes immense network bandwidth and slows page load times.",
      outcome: "A resumable file upload server (Tus / Multipart protocol) with on-the-fly image resizing/WebP transformation (`/image.jpg?w=300&q=80&format=webp`) and edge disk caching.",
      stack: ["Go / Node.js", "Sharp (libvips)", "SQLite / PostgreSQL", "Local File Storage / MinIO"],
      diagram:
"Client Large Upload              Upload Server (Tus Protocol)        Image Transform Pipeline\n┌─────────────────┐              ┌───────────────────────────┐       ┌────────────────────────┐\n│ Chunk 1 (5MB)   ├─────────────►│ Validate & Append Chunk   │       │ Sharp (libvips)        │\n│ Chunk 2 (5MB)   ├─────────────►│ Reassemble on Final Chunk │──────►│ Resize, WebP Convert,  │\n│ Chunk 3 (5MB)   ├─────────────►│ Save to Disk / S3 Storage │       │ Strip EXIF Metadata    │\n└─────────────────┘              └───────────────────────────┘       └───────────┬────────────┘\n                                                                                 │\n                                 Client HTTP GET /img.jpg?w=400&fmt=webp         │\n                                 ◄───────────────────────────────────────────────┘\n                                 Cache-Control: public, max-age=31536000, immutable",
      steps: [
        { title: "Phase 1: Resumable Chunked Upload API", desc: "Implement chunked file upload endpoints using the Tus open protocol. Handle offset verification, chunk appending, and checksum validation." },
        { title: "Phase 2: Security & Virus / Magic Byte Validation", desc: "Inspect file magic bytes (file signature headers) instead of trusting client file extensions. Strip dangerous EXIF metadata from uploaded images." },
        { title: "Phase 3: Dynamic Image Transformation Pipeline", desc: "Build an image delivery endpoint using `sharp` / `libvips` that extracts query params (`?w=400&h=300&fit=crop&format=webp`) and performs sub-50ms transformations in memory." },
        { title: "Phase 4: Multi-Tier Cache & ETag Validation", desc: "Save transformed images in an LRU disk cache. Return HTTP `ETag` and `304 Not Modified` headers for browser cache hits." }
      ],
      resources: [
        { title: "Tus.io Resumable Upload Protocol Specification", url: "https://tus.io/protocols/resumable-upload.html" },
        { title: "Sharp High-Performance Image Processing (libvips)", url: "https://sharp.pixelplumbing.com/" },
        { title: "MDN Guide to HTTP Caching & ETags", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" }
      ],
      pitfalls: [
        "Never trust `file.type` or file extension sent by the browser; malicious attackers can upload executable shell scripts masquerading as `.png` files.",
        "Sanitize file names to prevent directory traversal attacks (e.g. `../../etc/passwd`)."
      ],
      interview: [
        "How does the Tus protocol handle resuming an interrupted 5GB file upload?",
        "How do `ETag` and `If-None-Match` HTTP headers work to prevent redundant data downloads?"
      ]
    },
    {
      id: "e-commerce-event-driven-saga",
      title: "Event-Driven Saga Pattern E-Commerce Engine",
      domain: "backend",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "4–6 weeks",
      tagline: "Implement distributed transactions across microservices using the Orchestrated Saga pattern and Kafka.",
      problem: "In distributed microservice architectures, traditional 2-Phase Commit (2PC) database locks are slow, brittle, and create tight coupling. When an order is placed (Order Service), inventory is reserved (Inventory Service), payment is processed (Payment Service), and loyalty points are credited (Rewards Service), any single failure requires atomic compensating transactions to undo previous steps across separate databases.",
      outcome: "A full event-driven distributed system demonstrating the Saga Orchestrator pattern with Kafka event streams, idempotent consumer handlers, and automated compensating rollbacks.",
      stack: ["Go or Java (Spring Boot) / Node.js", "Apache Kafka", "PostgreSQL (Outbox Pattern)", "Docker Compose"],
      diagram:
"1. Order Created ──► [ Order Service ]\n                          │ Writes Order + Outbox Record (Atomic DB Tx)\n                          ▼\n                     [ Debezium / Outbox Poller ] ──► [ Kafka Topic: order-events ]\n                                                            │\n┌───────────────────────────────────────────────────────────┴────────────────────────────────┐\n▼                                                           ▼                                ▼\n[ Inventory Service ]                                       [ Payment Service ]              [ Saga Orchestrator ]\nReserve Stock (SKU-123)                                     Charge Credit Card               Monitors State Machine\nSuccess ──► Publish: inventory-reserved                     Success ──► Publish: payment-ok  If Payment FAILS:\n                                                                                             Triggers Compensating Tx:\n                                                                                             Publish: release-inventory",
      steps: [
        { title: "Phase 1: Microservice Domain Separation", desc: "Build independent Order, Inventory, and Payment services, each with its own isolated PostgreSQL database." },
        { title: "Phase 2: Transactional Outbox Pattern", desc: "Implement the Transactional Outbox pattern: write business entities and event records within the same ACID database transaction to avoid dual-write bugs." },
        { title: "Phase 3: Saga Orchestration State Machine", desc: "Build the central Saga Orchestrator managing order states: `PENDING`, `INVENTORY_RESERVED`, `PAYMENT_COMPLETED`, and `ORDER_FAILED`." },
        { title: "Phase 4: Compensating Rollback Workflows", desc: "Simulate payment failures (insufficient funds) and verify that the orchestrator publishes compensating events that restore inventory and notify the user." }
      ],
      resources: [
        { title: "Microservices.io: Saga Pattern Architecture", url: "https://microservices.io/patterns/data/saga.html" },
        { title: "Transactional Outbox Pattern Guide", url: "https://microservices.io/patterns/data/transactional-outbox.html" },
        { title: "Apache Kafka Core Concepts & Partitioning", url: "https://kafka.apache.org/documentation/" }
      ],
      pitfalls: [
        "Avoid the Dual-Write problem (writing to DB and publishing to Kafka separately); network failures between the two operations leave data in inconsistent states. Use the Outbox pattern.",
        "Ensure all event consumer handlers are strictly idempotent by storing processed message IDs in a deduplication table."
      ],
      interview: [
        "What are the key trade-offs between Choreographed Sagas and Orchestrated Sagas?",
        "Why is 2-Phase Commit (2PC) rarely used in modern cloud-native distributed microservices?"
      ]
    },
    {
      id: "high-throughput-chat-engine",
      title: "Discord-Scale High-Throughput Chat Architecture",
      domain: "backend",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "6–8 weeks",
      tagline: "Build a massive real-time messaging engine with epoll socket multiplexing, ScyllaDB/Cassandra partitioning, and read receipts.",
      problem: "Large community chat platforms (Discord, Slack, Twitch) must support channels with 100,000+ concurrent connected users where a single message triggers instantaneous fanout without crashing WebSocket gateways, overloading storage, or creating unbounded latency.",
      outcome: "A horizontally scalable distributed chat engine capable of sustaining 50,000 concurrent WebSocket connections, sub-20ms message delivery, channel presence, and infinite scroll message pagination.",
      stack: ["Rust / Go", "WebSockets / Epoll", "ScyllaDB / Cassandra", "Redis Cluster", "Kafka"],
      diagram:
"50,000 Concurrent WebSocket Clients\n                 │\n                 ▼\n┌────────────────────────────────────────┐\n│ Edge Gateway Cluster (Go / Rust Epoll) │\n│ Multiplexes persistent TCP sockets     │\n└────────────────┬───────────────────────┘\n                 │ Publish Message to Kafka\n                 ▼\n┌────────────────────────────────────────┐\n│ Kafka Ingestion Cluster (By ChannelID) │\n└────────┬───────────────────────────────┘\n         │\n         ├───────────────────────────────┬────────────────────────────────┐\n         ▼                               ▼                                ▼\n┌───────────────────┐          ┌───────────────────┐            ┌───────────────────┐\n│ ScyllaDB /        │          │ Fanout Workers    │            │ Presence Engine   │\n│ Cassandra Storage │          │ Broadcasts to all │            │ Redis HyperLogLog │\n│ Clustered by Time │          │ connected gateways│            │ & Heartbeats      │\n└───────────────────┘          └───────────────────┘            └───────────────────┘",
      steps: [
        { title: "Phase 1: Epoll Connection Multiplexer", desc: "Build the edge connection gateway in Go/Rust with custom TCP/WebSocket buffer management to handle thousands of idle connections per node with minimal RAM." },
        { title: "Phase 2: Time-Partitioned Storage Schema", desc: "Model message history in ScyllaDB/Cassandra using `(channel_id, bucket_month)` as Partition Key and Snowflake ID (timestamp ordered) as Clustering Key for constant-time pagination." },
        { title: "Phase 3: High-Fanout Broadcast Engine", desc: "Implement smart fanout routing: channels with <100 members use direct Redis Pub/Sub; massive channels with 50,000+ members use batch-aggregated WebSocket frames." },
        { title: "Phase 4: Read Receipts & Typing Indicators", desc: "Build ephemeral presence engines using Redis sorted sets and Bloom filters to track user online status, typing indicators, and unread badges." }
      ],
      resources: [
        { title: "Discord Engineering: How Discord Stores Billions of Messages", url: "https://discord.com/blog/how-discord-stores-billions-of-messages" },
        { title: "ScyllaDB Architecture: High Performance NoSQL", url: "https://www.scylladb.com/product/technology/" },
        { title: "The C10K and C1000K Problem: Epoll vs Threads", url: "http://www.kegel.com/c10k.html" }
      ],
      pitfalls: [
        "Do not store millions of messages in a relational database with `OFFSET` pagination; `OFFSET 500000` causes massive disk scans. Use keyset pagination with Snowflake IDs.",
        "In giant chat rooms (Twitch / mega Discord servers), do not broadcast individual typing indicators or presence updates; downsample or suppress them."
      ],
      interview: [
        "How does Discord utilize Snowflake IDs to enable chronological message pagination without database indexes?",
        "How do you handle the 'celebrity fanout' problem when a message in a 1,000,000-user room must be distributed to all active connections?"
      ]
    }
  ]);
})(window.TD = window.TD || {});
