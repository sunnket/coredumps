/* ==========================================================================
   Depth pass 127 — Backend Architecture batch 4: Microservices & Event-Driven Systems.
   Microservices, Serverless, Function as a Service,
   Event-Driven Architecture, Message Queue, Publish-Subscribe,
   Dependency Injection.

   Independent service boundaries, scale-to-zero execution runtimes, asynchronous messaging fabrics,
   event pub/sub broadcast decoupling, and IoC dependency management govern distributed backends.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "microservices",

      why: {
        before: "Enterprises scaled large monolithic codebases to hundreds of engineers; release coordination degenerated into bureaucratic deployment trains, merge conflicts blocked continuous integration, and a memory leak in an experimental module crashed the entire core banking platform.",
        problem: "Large organizations need autonomous engineering teams to develop, test, deploy, and scale distinct business domains independently without global coordination bottlenecks or shared deployment blast radiuses.",
        shift: "**Microservices: An architectural approach where a single application is composed of many small, independently deployable services, each running in its own process and communicating via lightweight protocols (HTTP REST, gRPC, or message brokers).** Governed by Domain-Driven Design bounded contexts, microservices align software architecture with organizational team structures (Conway's Law)."
      },

      num: {
        t: "Microservices Decomposition & Integration Patterns: Comparative Analysis",
        h: ["Pattern", "Primary Decoupling Mechanism", "Data Consistency Model", "Failure Blast Radius", "Core Operational Tooling"],
        r: [
          ["Database-per-Service", "Each service owns private isolated schema/DB", "Eventual consistency via domain events", "Isolated (database outage affects one service)", "Flyway/Liquibase, distributed transactional outbox"],
          ["Strangler Fig Pattern", "Gradually route legacy endpoints to new services", "Dual-write / CDC data sync during migration", "Controlled (incremental traffic shift via proxy)", "API Gateway, Envoy, Cloudflare path routing"],
          ["Saga Pattern (Orchestrated)", "Central coordinator manages multi-step flow", "Local ACID transactions + compensating actions", "Bounded (coordinator handles failure recovery)", "Temporal, AWS Step Functions, Camunda"],
          ["Event-Carried State Transfer", "Services broadcast complete entity snapshots", "Local read-only caches, eventual consistency", "Extremely low (downstream reads survive upstream outage)", "Apache Kafka, AWS Kinesis, Schema Registry"],
          ["Service Mesh Sidecar", "Envoy sidecar proxies intercept all L7 traffic", "N/A (infrastructure transport layer)", "Isolated per pod/container", "Istio, Linkerd, OpenTelemetry tracing"]
        ],
        n: "Microservices solve an **organizational scaling problem**, not a performance problem. By adhering to **Conway's Law** ('organizations design systems that mirror their communication structures'), autonomous two-pizza teams own individual services from database schema to production deployment. However, microservices incur a steep **Distributed Systems Tax**: (1) in-process function calls become network RPCs subject to the *Fallacies of Distributed Computing* (latency, packet loss, network partitions); (2) ACID database transactions must be replaced by eventual consistency and **Sagas**; (3) debugging requires distributed tracing headers (`traceparent` under W3C Trace Context); and (4) local development requires orchestration (Docker Compose, Minikube, or ephemeral cloud environments)."
      },

      miss: [
        {
          w: "Adopting microservices makes an application inherently faster and more performant.",
          r: "Microservices are **inherently slower than monoliths for individual user requests** because they replace nanosecond in-memory function calls with millisecond network serialization, socket connections, TLS handshakes, and network traversal across multiple hops."
        },
        {
          w: "Multiple microservices can share the same underlying database tables if schemas are aligned.",
          r: "Sharing a database across microservices is the **deadliest microservice anti-pattern** (the 'Distributed Monolith'). It reintroduces schema coupling, locks database connection pools, bypasses service API boundaries, and prevents independent team deployments."
        },
        {
          w: "Microservices should be sized based on lines of code (e.g., under 500 lines of code).",
          r: "Service boundaries must be determined by **Domain-Driven Design (DDD) Bounded Contexts** and team autonomy, not arbitrary code lengths. A service that does one complex business domain (like Tax Calculation or Fraud Detection) is a proper microservice regardless of line count."
        },
        {
          w: "Every startup and new project should start with a microservices architecture.",
          r: "Premature microservices adoption is a primary cause of startup failure. Before the problem domain is deeply understood, service boundaries will be drawn incorrectly, requiring painful distributed refactoring. **Always build a Modular Monolith first**."
        }
      ],

      trade: {
        buys: [
          "Autonomous team velocity: engineering squads build, test, and ship code independently without deployment trains.",
          "Targeted horizontal scalability: scale only compute-heavy or memory-hungry services without replicating the entire application.",
          "Heterogeneous technology choices: use Python for machine learning services, Go for network proxies, and Node for APIs.",
          "Fault isolation: an out-of-memory crash or unhandled exception in one service does not crash unrelated services."
        ],
        costs: [
          "Operational complexity explosion: managing 50+ services requires Kubernetes, service meshes, CI/CD pipelines, and APM tracing.",
          "Distributed data consistency: cross-service transactions require complex Saga orchestrations and compensating workflows.",
          "Network latency amplification: deep microservice call graphs turn a single user click into a cascade of network round trips.",
          "Testing and debugging friction: reproducing distributed race conditions or testing service interactions locally is extremely difficult."
        ],
        avoid: [
          "Never allow multiple microservices to connect directly to the same production database tables.",
          "Never adopt microservices before achieving mature continuous delivery, automated testing, and distributed observability.",
          "Never design deep synchronous RPC chains (Service A -> B -> C -> D); use asynchronous event-driven messaging.",
          "Never break a monolithic codebase apart before defining clear domain boundaries through a modular monolith."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "serverless",

      why: {
        before: "Cloud infrastructure required provisioning, sizing, and paying 24/7 for dedicated virtual machines (EC2) or container clusters (Kubernetes); during off-peak hours and weekends, idle servers consumed full infrastructure budgets while sudden marketing spikes exhausted capacity and crashed systems.",
        problem: "Modern cloud engineering requires an infrastructure paradigm where developers write only business code, systems automatically scale from zero to tens of thousands of instances on demand, and billing aligns strictly with actual CPU execution time down to the millisecond.",
        shift: "**Serverless: A cloud execution model where the cloud provider dynamically manages the allocation, provisioning, and scaling of compute resources, completely abstracting server management from the developer.** Characterized by scale-to-zero mechanics, event-driven activation, and consumption-based pay-per-use billing."
      },

      num: {
        t: "Cloud Compute Paradigms: Dedicated VMs vs Containers vs Serverless",
        h: ["Model", "Provisioning & Scaling Speed", "Scale to Zero (Idle Cost)", "Operational Server Management", "Maximum Execution Lifespan"],
        r: [
          ["Virtual Machines (AWS EC2)", "Minutes (Auto Scaling Groups)", "No (pay full hourly cost while idle)", "High (OS patching, security updates, kernel tuning)", "Infinite (always-on daemon processes)"],
          ["Managed Kubernetes (EKS/GKE)", "Seconds (HPA / Cluster Autoscaler)", "No (control plane & worker nodes incur base cost)", "High (node pools, CNI networking, ingress controllers)", "Infinite (always-on container pods)"],
          ["Serverless Containers (Cloud Run)", "Sub-second (100ms - 1s)", "Yes (zero billing when zero requests arrive)", "Extremely low (container image provided, infra managed)", "Long (up to 60 minutes per request)"],
          ["Serverless FaaS (AWS Lambda)", "Milliseconds (50ms - 300ms)", "Yes (pay strictly per millisecond executed)", "Zero (upload code zip or container handler)", "Short (hard 15-minute maximum timeout)"],
          ["Edge Serverless (Cloudflare Workers)", "Near-instant (<5ms V8 Isolates)", "Yes (pay per request / CPU time)", "Zero (pure JavaScript/Wasm deployed globally)", "Extremely short (CPU time bounded to 50ms)"]
        ],
        n: "Serverless encompasses more than compute (FaaS); it is an **architectural philosophy** encompassing serverless storage (S3), serverless databases (DynamoDB, Aurora Serverless), and serverless messaging (SQS, EventBridge). When an event occurs (an HTTP request, a file uploaded to S3, or a message published to a queue), the platform provisions an isolated execution container (such as AWS Firecracker MicroVMs or V8 Isolates), executes the handler function, and freezes or terminates the environment. The economic advantage is **Scale to Zero**: during periods of zero traffic, financial cost is exactly $0.00. However, at sustained high throughput (e.g., 50,000 requests/sec 24/7), serverless billing curves cross reserved virtual machine costs, making dedicated container clusters more cost-effective."
      },

      miss: [
        {
          w: "Serverless means there are no physical servers running your code.",
          r: "Serverless means **there are no servers that *you* manage or provision**. Physical servers, virtualization layers, and operating systems still exist, but they are fully maintained, patched, secured, and scaled by cloud providers like AWS, GCP, and Azure."
        },
        {
          w: "Serverless is always cheaper than running traditional virtual machines or Kubernetes.",
          r: "Serverless is dramatically cheaper for **spiky, low-traffic, batch, or event-driven workloads**. However, for steady-state, high-concurrency 24/7 workloads, serverless per-millisecond billing is significantly more expensive than running reserved EC2 instances or autoscaling Kubernetes clusters."
        },
        {
          w: "Serverless functions can safely hold persistent local state in memory between calls.",
          r: "Serverless execution environments are **strictly ephemeral and stateless**. The platform can freeze, terminate, or migrate container instances at any millisecond. All persistent state must be stored in external databases (DynamoDB, Redis) or object stores (S3)."
        },
        {
          w: "Any monolithic application can be moved to serverless without architectural changes.",
          r: "Monoliths rely on long-lived database connection pools, background threads, local file caches, and persistent WebSockets. Moving to serverless requires re-architecting for stateless handlers, external connection proxying (RDS Proxy), and asynchronous event queues."
        }
      ],

      trade: {
        buys: [
          "Zero infrastructure management: eliminate OS patching, security hardening, capacity planning, and cluster management.",
          "True scale-to-zero economics: pay nothing during idle periods, matching infrastructure spend directly with business activity.",
          "Massive automatic elasticity: seamlessly scale from zero to tens of thousands of concurrent executions in seconds during traffic surges.",
          "Event-driven cloud native integration: native triggers connect object storage, queues, databases, and cron schedules directly."
        ],
        costs: [
          "Cold start latency: spin-up time for idle runtimes adds 100ms to 2,000ms of latency on first invocations.",
          "Hard execution time constraints: workloads are terminated if they exceed platform timeouts (e.g., AWS Lambda 15-minute ceiling).",
          "Vendor lock-in: tight coupling to proprietary cloud triggers (EventBridge, Step Functions, DynamoDB Streams) limits portability.",
          "Database connection exhaustion: thousands of ephemeral function instances can overwhelm downstream relational database connection pools."
        ],
        avoid: [
          "Never run long-running streaming services, video rendering, or machine learning training loops on standard FaaS.",
          "Never connect thousands of serverless functions directly to a PostgreSQL/MySQL database without a connection pooler (RDS Proxy, PgBouncer).",
          "Never store user session data or temporary file uploads in local serverless container disk without syncing to S3/Redis.",
          "Never ignore cold starts for customer-facing synchronous web APIs; use provisioned concurrency or lightweight runtimes (Go, Rust, Node)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "function-as-a-service",

      why: {
        before: "Running a single background task (e.g., generating an image thumbnail upon upload) required provisioning a virtual server, configuring an operating system, installing runtime dependencies, managing process managers (PM2/systemd), and running a daemon listener 24/7.",
        problem: "Developers need to deploy single granular units of logic (individual functions) triggered by discrete events, delegating all runtime lifecycle, scaling, and infrastructure management to the cloud platform.",
        shift: "**Function as a Service (FaaS): A category of cloud computing services that provides a platform allowing customers to develop, run, and manage application functionalities without the complexity of building and maintaining infrastructure.** Pioneered by AWS Lambda, Google Cloud Functions, and Azure Functions, FaaS represents the core compute implementation of serverless."
      },

      num: {
        t: "FaaS Platform Execution Environments & Performance Characteristics",
        h: ["Platform", "Virtualization / Isolation Technology", "Cold Start P99 Latency", "Maximum Execution Timeout", "Concurrency Scaling Model"],
        r: [
          ["AWS Lambda", "Firecracker MicroVMs (KVM-based)", "100ms - 500ms (Java/C# up to 2s)", "15 minutes (900 seconds)", "Up to 1,000 initial concurrent bursts per region"],
          ["Google Cloud Functions (2nd Gen)", "Cloud Run / gVisor container sandbox", "200ms - 800ms", "60 minutes for HTTP; 10 min event", "Up to 1,000 concurrent instances per project"],
          ["Azure Functions (Consumption)", "Hyper-V / Windows & Linux containers", "300ms - 1,500ms", "10 minutes (configurable limit)", "Scales up to 200 instances dynamically"],
          ["Cloudflare Workers", "V8 Isolates (Chromium engine)", "Near-zero (<5ms cold start)", "50ms CPU time (unlimited wall clock I/O)", "Thousands of simultaneous edge isolates"],
          ["Fastly Compute@Edge", "WebAssembly (Lucet / Wasmtime)", "Sub-millisecond (<1ms cold start)", "Bounded CPU time", "Instantaneous edge instantiation per request"]
        ],
        n: "A FaaS runtime operates through a strict five-stage lifecycle: (1) **Cold Start / Provisioning**: when an event triggers an idle function, the platform provisions a container/microVM, mounts the code bundle, and boots the runtime (Node.js, Python, JVM); (2) **Initialization (Init Phase)**: code *outside* the exported handler function executes once (importing libraries, initializing database connections, instantiating SDK clients); (3) **Handler Invocation**: the exported function executes with the event payload and context object; (4) **Idle Freeze**: after execution completes, the container is frozen in memory for several minutes to serve subsequent requests warm without re-initializing; (5) **Container Reaper**: if no requests arrive, the environment is terminated. Crucially, **allocating database connection pools and caching static clients in the global scope outside the handler** ensures they persist across warm invocations."
      },

      miss: [
        {
          w: "A cold start happens on every single request sent to a FaaS function.",
          r: "Cold starts happen **only when the platform must spin up a new container instance** (the first request after idle, or when scaling out to handle concurrent traffic). Warm instances handle subsequent requests immediately with zero initialization overhead."
        },
        {
          w: "Database connections and HTTP client SDKs should be created inside the handler function on every call.",
          r: "Creating clients inside the handler creates a new connection on every request, exhausting database connection limits and adding significant latency. **Initialize database clients and SDKs outside the handler function in global scope** so warm executions reuse existing socket connections."
        },
        {
          w: "Increasing allocated memory in AWS Lambda only increases RAM, not CPU performance.",
          r: "In AWS Lambda, **CPU and network bandwidth scale proportionally with memory allocation**. Configuring 1,769 MB grants the equivalent of 1 full vCPU. Allocating more memory to CPU-bound functions often *reduces* execution duration enough to lower total financial cost."
        },
        {
          w: "FaaS functions are completely immune to Distributed Denial of Service (DDoS) outages.",
          r: "While FaaS scales automatically, downstream databases (PostgreSQL/MySQL) have fixed connection capacities. A sudden burst of 5,000 concurrent Lambda instances will exhaust database connections, causing cascading outages across your infrastructure."
        }
      ],

      trade: {
        buys: [
          "Pure focus on business logic: engineers write single function handlers without managing operating systems or servers.",
          "Autonomous micro-scaling: each function scales independently based on its specific invocation volume.",
          "Cost efficiency for intermittent traffic: zero ongoing cost for functions executed only a few times per day or hour.",
          "Built-in fault tolerance: platforms automatically retry failed event invocations and route around failed host machines."
        ],
        costs: [
          "Cold start latency spikes: latency-sensitive user-facing web endpoints suffer occasional 200ms-1,000ms latency spikes.",
          "Strict execution constraints: hard time limits (15 min) and restricted local disk space (/tmp 512MB-10GB) prevent large batch jobs.",
          "Local debugging challenges: testing cloud triggers (S3 events, DynamoDB streams) locally requires complex mocking or local emulators.",
          "Architecture fragmentation: decomposing a system into hundreds of discrete lambdas creates a distributed tracing and governance nightmare."
        ],
        avoid: [
          "Never instantiate heavy database clients, ORM models, or SDKs inside the request handler; declare them in the outer global scope.",
          "Never use FaaS for high-frequency low-latency trading or continuous WebSocket connections; use persistent container services.",
          "Never store persistent data in the local `/tmp` directory expecting it to survive across function invocations.",
          "Never deploy monolithic zip bundles containing hundreds of unused npm/pip dependencies; trim bundle sizes to minimize cold starts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "event-driven-architecture",

      why: {
        before: "Distributed services communicated exclusively through synchronous HTTP REST or RPC calls; if Service A called B, B called C, and C called D, any network hiccup, slow database query, or deployment outage along the chain caused cascading failures and blocked client threads across the entire system.",
        problem: "Modern cloud architectures require decoupling systems in both time and space: producers must record domain changes without knowing or waiting for consumers, and consumer failures must never block producer transactions.",
        shift: "**Event-Driven Architecture (EDA): A software architecture pattern where decoupled software components communicate by asynchronously emitting, detecting, and reacting to domain events.** Representing immutable records of state changes that have already occurred (`OrderPlaced`, `UserRegistered`), EDA maximizes system resilience and horizontal scalability."
      },

      num: {
        t: "Communication Topologies: Synchronous RPC vs Choreographed EDA vs Orchestrated EDA",
        h: ["Topology", "Coupling Degree", "Temporal Dependency", "Failure Blast Radius", "Observability & Tracing Complexity"],
        r: [
          ["Synchronous Request-Response (REST/gRPC)", "High (producer knows exact consumer endpoint)", "High (caller blocks waiting for immediate response)", "Cascading (failure of downstream blocks upstream)", "Low (single synchronous stack trace across hops)"],
          ["EDA Choreography (Event Broadcast)", "Extremely Low (producer emits event; zero consumer awareness)", "Zero (producer returns immediately; consumers react later)", "Isolated (consumer crash has zero impact on producer)", "High (requires distributed tracing `traceparent` and correlation IDs)"],
          ["EDA Orchestration (Workflow Engine)", "Moderate (central coordinator executes steps via events)", "Low (coordinator manages retries, timers, and compensations)", "Bounded (coordinator detects failures and triggers rollbacks)", "Low to Moderate (centralized execution state machine in UI)"],
          ["Event Sourcing (Append-Only Log)", "Low (immutable append-only event stream)", "Zero (replays historical events asynchronously)", "Minimal (immutable audit log guarantees data recovery)", "High (requires dedicated read projections and snapshotting)"]
        ],
        n: "In Event-Driven Architecture, an **Event** is an immutable statement of fact about something that occurred in the past (e.g., `PaymentProcessed`, not a command like `ProcessPayment`). EDA operates via three core models: (1) **Choreography**: decentralized event broadcast where services subscribe to topics and react autonomously; (2) **Orchestration**: a central state machine (Temporal, AWS Step Functions) invokes workers and tracks multi-step business transactions; and (3) **Event-Carried State Transfer**: events carry the complete entity payload (e.g., full order details) so consumers never need to make synchronous back-queries to the producer. Because message brokers enforce **At-Least-Once Delivery**, every event consumer MUST be engineered to be **idempotent** (handling duplicate delivery safely using unique event IDs)."
      },

      miss: [
        {
          w: "An Event and a Command are interchangeable concepts in distributed systems.",
          r: "A **Command** is a request for an action to happen in the future (`CreateOrder`), sent to a specific recipient that can reject it. An **Event** is an immutable notification of something that has *already happened* in the past (`OrderCreated`), broadcast to anyone interested without expectation of a return value."
        },
        {
          w: "Event-driven systems eliminate the need for distributed transactions.",
          r: "EDA does not eliminate distributed transactions; it replaces ACID transactions with **Eventual Consistency** and **Sagas**. If a multi-step business workflow fails halfway through, the system must publish compensating events (`CancelOrder`, `RefundPayment`) to restore business consistency."
        },
        {
          w: "Message brokers guarantee that events are always delivered in exact chronological order.",
          r: "Once a topic is partitioned across multiple consumer threads or machines, **global ordering is lost**. Standard brokers (Kafka, SQS, RabbitMQ) guarantee ordering only *within a specific partition or message group ID* (e.g., all events for `order_id_1042`)."
        },
        {
          w: "Consumers can safely assume an event will only ever be delivered to them once.",
          r: "Network acknowledgments can fail even after successful processing, leading brokers to redeliver messages. Distributed systems operate under **At-Least-Once Delivery**. Consumers must implement **idempotency checks** (e.g., recording processed event IDs in a deduplication table)."
        }
      ],

      trade: {
        buys: [
          "Extreme temporal decoupling: producers complete user requests immediately without waiting for slow downstream consumers.",
          "Zero-friction extensibility: add new downstream features (e.g., audit loggers, analytics, recommendation engines) without modifying producer code.",
          "Traffic spike buffering: message brokers absorb viral traffic surges, allowing consumers to process backlogs at a steady rate.",
          "High fault tolerance: an outage in a downstream service (e.g., email notification service) never stops core checkout operations."
        ],
        costs: [
          "Eventual consistency: reading immediately after writing can return stale data while asynchronous events propagate.",
          "Debugging and distributed tracing overhead: following business transactions requires correlation IDs and distributed tracing tools.",
          "Event schema versioning: evolving event payloads over time requires schema registries (Avro, Protobuf) and backward-compatibility rules.",
          "Duplicate and out-of-order delivery: consumers must implement complex idempotency logic and handle out-of-sequence events."
        ],
        avoid: [
          "Never assume messages will be delivered exactly once; always make event consumers idempotent.",
          "Never send commands disguised as events (`SendEmailEvent`); name events in the past tense describing business facts (`OrderPlaced`).",
          "Never publish events before the local database transaction has committed; use the **Transactional Outbox Pattern** to prevent phantom events.",
          "Never allow unbounded queue growth without alerting; monitor consumer lag and configure Dead Letter Queues (DLQs)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "message-queue",

      why: {
        before: "Web servers handled heavy background tasks (sending emails, processing payments, resizing images, generating PDFs) synchronously inside the HTTP request thread; users waited 15 seconds for pages to load, and any traffic spike exhausted thread pools and crashed web servers.",
        problem: "High-throughput systems must decouple the speed of request producers from consumer workers, buffer bursty workloads during peak hours, and guarantee reliable background task execution without losing data during worker crashes.",
        shift: "**Message Queue: A dedicated asynchronous inter-process communication component that stores messages in a durable buffer until consumed by worker processes.** Adhering to First-In, First-Out (FIFO) semantics and point-to-point delivery, message queues smooth traffic spikes and isolate system failure boundaries."
      },

      num: {
        t: "Message Queue Systems: Technical Architecture Comparison",
        h: ["Queue System", "Core Protocol / Architecture", "Delivery Guarantees", "Peak Throughput Capacity", "Primary Production Workload"],
        r: [
          ["RabbitMQ", "Erlang AMQP 0-9-1 / Quorum Queues", "At-least-once (configurable FIFO/priority)", "50,000+ msg/sec per node", "Complex routing, transactional task processing, enterprise microservices"],
          ["AWS SQS", "Cloud-native distributed HTTP API", "At-least-once (Standard) / Exactly-once (FIFO)", "Virtually unlimited (Standard) / 3,000 msg/s (FIFO)", "Cloud-native serverless decoupling, decoupled microservice queues"],
          ["Redis Streams / BullMQ", "In-memory append-only log with persistence", "At-least-once with consumer groups", "100,000+ msg/sec per core", "Node.js background jobs, rate-limited delayed task scheduling"],
          ["Apache ActiveMQ Artemis", "Java / AMQP, JMS, MQTT, OpenWire", "Strict transactional message ordering", "30,000+ msg/sec", "Traditional enterprise banking, legacy JMS application integration"],
          ["Celery (with Redis/RabbitMQ)", "Python distributed task queue abstraction", "At-least-once task execution", "Depends on underlying broker", "Python/Django asynchronous background compute and data pipelines"]
        ],
        n: "In a Message Queue, producers enqueue messages, and worker processes dequeue them using the **Competing Consumers Pattern** (multiple workers process messages from the same queue, but each message is processed by **exactly one worker**). When a worker fetches a message, the queue starts a **Visibility Timeout** (e.g., 30 seconds) during which the message is invisible to other workers. If the worker successfully finishes, it sends an acknowledgment (`ACK`), and the broker permanently deletes the message. If the worker crashes or times out, the visibility timeout expires, and the broker makes the message visible again for another worker to retry. Messages that fail repeatedly (poison pills) are routed to a **Dead Letter Queue (DLQ)** for engineering inspection."
      },

      miss: [
        {
          w: "A Message Queue and a Publish-Subscribe (Pub/Sub) topic are the exact same thing.",
          r: "In a **Message Queue**, a message is processed by **exactly one worker** among competing consumers (work distribution). In **Pub/Sub**, a message is broadcast to **every subscriber** that has registered interest in the topic (fan-out)."
        },
        {
          w: "Message Queues guarantee zero message loss under all failure conditions automatically.",
          r: "Zero message loss requires specific configuration: messages must be marked **persistent** (written to disk/WAL), queues must be durable, and publishers must use **publisher confirms**. Without persistent flags, in-memory broker queues lose all data on node restart."
        },
        {
          w: "Queued background tasks will always execute in the exact millisecond order they were sent.",
          r: "In distributed queues with multiple concurrent workers, network jitter, variable task execution times, and worker crashes cause tasks to complete out of order. **Global strict ordering requires single-consumer FIFO queues**, which severely limits horizontal throughput."
        },
        {
          w: "A Dead Letter Queue (DLQ) automatically fixes broken or unprocessable messages.",
          r: "A DLQ is merely a holding pen for poison messages. Without monitoring alerts and operational replay tooling, an unmonitored DLQ becomes a **silent data graveyard** where critical user actions are permanently lost."
        }
      ],

      trade: {
        buys: [
          "Traffic peak absorption (Load Leveling): buffers huge traffic spikes so downstream databases process work at a safe, steady rate.",
          "Sub-millisecond API response times: web endpoints enqueue tasks in 2ms and return immediately, offloading work to background workers.",
          "Worker fault isolation: worker crashes do not drop messages; the broker reassigns the unacknowledged message to another healthy worker.",
          "Independent worker autoscaling: scale background worker pools up or down based directly on queue depth metrics."
        ],
        costs: [
          "Eventual execution latency: tasks are not executed instantaneously; they incur queuing delays depending on backlog depth.",
          "Infrastructure management: maintaining high-availability broker clusters (RabbitMQ/Redis) requires dedicated operational monitoring.",
          "Poison pill management: corrupted or malformed payloads require dead-letter queues, alert systems, and manual replay mechanisms.",
          "Duplicate task execution risk: network timeouts during acknowledgment cause redelivery, requiring idempotent worker logic."
        ],
        avoid: [
          "Never enqueue large binary files, videos, or PDFs directly into queue message payloads; store in S3 and pass the URL pointer.",
          "Never omit a Dead Letter Queue (DLQ); unhandled message exceptions will trigger infinite retry loops that crash worker pools.",
          "Never assume background workers will never process the same message twice; always enforce idempotency.",
          "Never set a visibility timeout shorter than the maximum possible execution duration of the background task."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "publish-subscribe",

      why: {
        before: "When an event occurred (e.g., a customer placed an order), the core checkout service had to maintain hardcoded HTTP connections to notify the inventory service, the email service, the fraud detection system, and the analytics warehouse; adding a new consumer required modifying and redeploying the checkout codebase.",
        problem: "Publishers need to broadcast state changes across a distributed enterprise without knowing how many consumers exist, where they are hosted, what protocols they speak, or how they process the data.",
        shift: "**Publish-Subscribe (Pub/Sub): A messaging pattern where senders (publishers) categorize messages into topics without knowledge of which subscribers will receive them, and receivers (subscribers) express interest in topics to receive broadcasted messages.** Enabling 1-to-N message fanout, Pub/Sub decouples system producers from consumer evolution."
      },

      num: {
        t: "Pub/Sub Systems & Event Brokers: Architectural Comparison",
        h: ["Broker System", "Storage Architecture", "Consumer Model", "Message Retention After Consumption", "Max Scale / Throughput"],
        r: [
          ["Apache Kafka", "Distributed immutable commit log on disk", "Pull (Consumer Groups track log offsets)", "Retained by time/size (e.g., 7 days) regardless of consumption", "Millions of msgs/sec across partitioned clusters"],
          ["RabbitMQ (Fanout Exchange)", "Transient in-memory queues per subscriber", "Push (Broker delivers to bound subscriber queues)", "Deleted immediately after subscriber acknowledgment", "50,000 - 100,000 msgs/sec"],
          ["AWS SNS (Simple Notification)", "Managed serverless push fanout", "Push (invokes Lambda, HTTP webhooks, SQS queues)", "Transient (forwarded immediately, no persistent history)", "Virtually unlimited serverless fanout"],
          ["Google Cloud Pub/Sub", "Globally distributed managed log stream", "Pull & Push (independent subscriber subscriptions)", "Retained up to 7 days (supports message seek/replay)", "Millions of msgs/sec globally"],
          ["NATS", "High-performance memory-centric messaging core", "Push / JetStream pull subscriptions", "Transient (core) or durable stream (JetStream)", "10+ million msgs/sec with ultra-low latency"]
        ],
        n: "Pub/Sub operates on the concept of **Topics**. A publisher writes a message to a topic (`orders.v1.created`). The broker replicates the message to all active subscriptions bound to that topic. In modern systems like **Apache Kafka**, Pub/Sub is merged with log-based storage: a topic is split into **Partitions**, and messages are permanently appended to an immutable disk log. Consumers join **Consumer Groups** where each group reads an independent pointer (offset) in the log. This hybrid model allows Kafka to simultaneously act as a **broadcast Pub/Sub system** (each consumer group gets every message) AND a **load-balanced message queue** (within a group, individual consumer instances share the partitions)."
      },

      miss: [
        {
          w: "Pub/Sub requires the publisher to wait until all subscribers have successfully processed the message.",
          r: "Pub/Sub is **completely asynchronous**. The publisher receives an acknowledgment from the message broker indicating the event was accepted into the topic; it has zero knowledge of when or if subscribers process the message."
        },
        {
          w: "If a subscriber is offline when a message is published, the message is permanently lost.",
          r: "Modern Pub/Sub systems (Kafka, Google Cloud Pub/Sub, AWS SNS backed by SQS) maintain **durable subscriber subscriptions**. When an offline consumer restarts, it resumes reading messages from where it left off without missing data."
        },
        {
          w: "Publishing directly to multiple subscriber webhooks via HTTP is the same as Pub/Sub.",
          r: "Synchronous HTTP fanout forces the publisher to handle network retries, connection timeouts, and slow subscriber backpressure. A **true Pub/Sub broker** offloads buffering, persistence, retries, and rate decoupling completely."
        },
        {
          w: "Pub/Sub messages are strictly ordered across the entire distributed topic.",
          r: "In high-throughput brokers like Kafka and Cloud Pub/Sub, **ordering is only guaranteed within a single partition or ordered key**. Messages across different partitions are interleaved and consumed concurrently."
        }
      ],

      trade: {
        buys: [
          "Zero-friction 1-to-N broadcast: a single published event seamlessly fans out to dozens of independent microservices.",
          "Complete producer-consumer decoupling: publishers have zero knowledge of subscriber hostnames, implementations, or availability.",
          "Event replayability (Log-based Pub/Sub): new services deployed months later can replay historical event streams from the beginning.",
          "Independent scaling and maintenance: slow consumers never back up or slow down other subscribers consuming the same topic."
        ],
        costs: [
          "Eventual consistency across services: downstream subscriber caches and databases lag milliseconds or seconds behind the publisher.",
          "Schema management overhead: changes to event schemas require strict backward-compatibility rules to avoid breaking subscribers.",
          "Distributed tracing complexity: following an event through multiple asynchronous fanouts requires distributed APM tracing headers.",
          "Consumer lag monitoring: slow subscribers accumulate backlogs, requiring monitoring of consumer group lag metrics."
        ],
        avoid: [
          "Never put sensitive unencrypted secrets, tokens, or PII inside broadcasted Pub/Sub messages.",
          "Never change an existing event payload schema without backward compatibility (e.g., removing fields); use schema registries.",
          "Never use synchronous HTTP calls when broadcasting domain state changes to multiple internal systems; use Pub/Sub.",
          "Never ignore consumer lag; alerting on consumer lag is vital to detect slow or failing worker services before disk fills up."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dependency-injection",

      why: {
        before: "Classes constructed their own dependencies directly using hardcoded constructors (`const db = new PostgresDatabase()`; `const stripe = new StripeClient()`); this tightly coupled business logic to concrete infrastructure, prevented automated unit testing without live databases, and made switching implementations impossible.",
        problem: "Software architectures require loose coupling: high-level business domain logic must depend on abstract interfaces rather than low-level concrete implementations, allowing dependencies to be swapped for testing, reconfiguration, or technology upgrades.",
        shift: "**Dependency Injection (DI): A software design pattern implementing Inversion of Control (IoC) where a component's external dependencies are supplied (injected) from the outside rather than created internally.** By separating object construction from object behavior, DI enforces clean architectural boundaries and testability."
      },

      num: {
        t: "Dependency Management Paradigms: Comparative Architectural Analysis",
        h: ["Pattern", "Coupling Degree", "Unit Testability with Mocks", "Runtime Reflection Overhead", "Control Flow Transparency"],
        r: [
          ["Hardcoded Instantiation (`new`)", "Maximum (tightly coupled to concrete class)", "Nearly impossible (requires bytecode monkey-patching)", "Zero (direct compile-time instantiation)", "Obvious (explicit direct creation in code)"],
          ["Service Locator Pattern", "High (hidden coupling to central service registry)", "Moderate (must configure mock registry before test)", "Low (dictionary lookup by token)", "Obscure (dependencies are hidden inside method bodies)"],
          ["Pure Constructor Injection (No framework)", "Zero (coupled only to abstract interfaces)", "Trivial (pass mock implementations directly in test)", "Zero (standard function/class arguments)", "Completely transparent (visible in constructor signature)"],
          ["Dynamic IoC Container (Spring / NestJS)", "Zero (managed by container metadata/annotations)", "Excellent (container swaps providers in test module)", "Moderate (runtime reflection / decorator parsing)", "Obscure (magic autowiring can hide wiring bugs)"],
          ["Compile-Time DI (Go Wire / Dagger)", "Zero (code generator wires dependencies at build time)", "Excellent (generate test graphs or pass fakes)", "Zero (pure generated static code)", "High (generated code is fully inspectable)"]
        ],
        n: "Dependency Injection is the practical realization of the **Dependency Inversion Principle (the 'D' in SOLID)**: 'High-level modules should not depend on low-level modules; both should depend on abstractions.' There are three primary injection styles: (1) **Constructor Injection** (the industry gold standard, where dependencies are passed as mandatory arguments during instantiation, guaranteeing the object is never in an uninitialized state); (2) **Setter / Method Injection** (optional dependencies configured after creation); and (3) **Field / Property Injection** (injected directly into private fields via runtime reflection, common in legacy frameworks but considered an anti-pattern). In modern architectures (such as **Hexagonal / Clean Architecture**), the domain core defines **Ports** (interfaces like `UserRepository`), and the DI layer injects concrete infrastructure **Adapters** (like `PostgresUserRepository`) at runtime."
      },

      miss: [
        {
          w: "Dependency Injection requires installing a heavy third-party framework or IoC container.",
          r: "Dependency Injection is a **fundamental design pattern, not a framework**. Simply passing dependencies into a class constructor (`new OrderService(database, paymentGateway)`) is pure Dependency Injection ('Pure DI') and requires zero third-party libraries."
        },
        {
          w: "Service Locator and Dependency Injection are equivalent patterns for managing dependencies.",
          r: "Service Locator is considered an **anti-pattern** because it hides a class's true dependencies inside its method implementations. Dependency Injection explicitly exposes all required dependencies in the public constructor signature, making contracts completely transparent."
        },
        {
          w: "Field injection via `@Inject` or `@Autowired` on private class variables is the cleanest approach.",
          r: "Field injection is **strongly discouraged** by modern software engineering standards. It hides dependencies, makes unit testing outside of the DI container impossible without reflection hacks, and allows circular dependencies to form silently. **Always use Constructor Injection**."
        },
        {
          w: "Using Dependency Injection makes application execution significantly slower.",
          r: "Pure Constructor Injection has **zero runtime overhead** beyond passing normal memory pointers. Even reflection-based IoC containers (NestJS, Spring) incur reflection costs only once during initial startup when building the dependency graph, leaving steady-state execution unaffected."
        }
      ],

      trade: {
        buys: [
          "Unrivaled unit testability: swap real databases and payment APIs with fast in-memory mocks in unit tests without touching code.",
          "Loose architectural coupling: domain logic depends exclusively on abstract interfaces, insulating it from infrastructure changes.",
          "Single Responsibility enforcement: constructors with too many injected arguments (e.g., 7+) immediately signal code smell and SRP violations.",
          "Flexible lifecycle management: IoC containers manage object lifecycles (Singletons, Request-scoped, Transient) uniformly."
        ],
        costs: [
          "Indirection and traceability: following code execution requires navigating through interface definitions to find concrete implementations.",
          "Boilerplate code: declaring interfaces, constructor parameters, and wiring modules increases code verbosity in typed languages.",
          "Startup initialization overhead: large reflection-based IoC containers add seconds to application startup when scanning packages.",
          "Configuration errors at runtime: misconfigured dynamic DI bindings can fail at runtime during application boot rather than compile time."
        ],
        avoid: [
          "Never use field injection on private variables; always use constructor injection for clarity and testability.",
          "Never use the Service Locator pattern to fetch dependencies dynamically inside business logic methods.",
          "Never instantiate concrete database or third-party API clients inside domain entities using the `new` keyword.",
          "Never create giant 'God Classes' with dozens of injected dependencies; refactor into smaller, focused single-responsibility services."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
