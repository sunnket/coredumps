/* ==========================================================================
   Depth pass 124 — Backend Architecture batch 1: API Protocols & Serialization.
   API, GraphQL, gRPC, WebSocket,
   Webhook, JSON, XML.

   HTTP transport abstraction, AST field selection execution, HTTP/2 multiplexed protobufs,
   full-duplex TCP framing, and event-driven webhook web-hook topologies establish backend foundations.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "api",

      why: {
        before: "Software applications were monolithic silos with proprietary internal memory formats and hardcoded database hooks; integrating two different programs required reverse-engineering memory offsets or custom binary file exports.",
        problem: "Modern distributed systems require a standardized, programming-language-agnostic communication interface that allows heterogeneous software systems to exchange data and invoke functionality reliably.",
        shift: "**API (Application Programming Interface): A set of defined rules, protocols, and tools that enable different software applications to communicate with each other.** Spanning internal library interfaces, operating system system calls (POSIX), and network web APIs (REST, GraphQL, gRPC), APIs are the connective tissue of modern software engineering."
      },

      num: {
        t: "API Architectural Paradigms: REST vs GraphQL vs gRPC vs WebSocket",
        h: ["API Style", "Primary Transport Protocol", "Data Serialization Format", "Communication Pattern", "Optimal Production Domain"],
        r: [
          ["REST (Representational State)", "HTTP/1.1 or HTTP/2", "JSON, XML, Form-Data", "Stateless Request-Response (CRUD resources)", "Public developer platforms, CRUD SaaS applications"],
          ["GraphQL", "HTTP (POST over HTTP/1.1 or 2)", "JSON", "Client-driven field query & mutation", "Complex frontend dashboards, mobile app data aggregation"],
          ["gRPC", "HTTP/2 (Multiplexed streams)", "Protocol Buffers (Binary)", "Unary, Client/Server streaming, Bi-directional", "Internal microservice-to-microservice RPCs"],
          ["WebSocket", "TCP (Full-Duplex socket)", "Text (JSON) or Binary (ArrayBuffer)", "Bi-directional persistent streaming", "Real-time chat, financial tickers, collaborative gaming"],
          ["SOAP (Enterprise Legacy)", "HTTP, SMTP, TCP", "XML (Strict WSDL contracts)", "RPC / Document Envelope messaging", "Legacy banking, government infrastructure, healthcare"]
        ],
        n: "An API establishes an **Interface Contract** between a service provider and a consumer. In network web APIs, the interface contract defines: (1) **Addressing** (URLs/URIs identifying resources), (2) **Transport Methods** (HTTP Verbs: GET, POST, PUT, DELETE), (3) **Serialization Schemas** (JSON Schema, Protobuf `.proto`, OpenAPI/Swagger specifications), and (4) **Status Codes & Error Shapes**. By abstracting internal implementation details (e.g., whether the backend is written in Rust, Go, or Python, or backed by Postgres or MongoDB), APIs decouple consumers from service internals, allowing backend teams to refactor databases, rewrite algorithms, and scale infrastructure without breaking external client integrations."
      },

      miss: [
        {
          w: "An API is always a REST web service that returns JSON over the internet.",
          r: "Web REST APIs are only one subset of APIs. An API is **any interface that allows software to communicate**: POSIX system calls are operating system APIs (`open()`, `read()`), standard library functions are language APIs (`Math.max()`), and graphic drivers use GPU APIs (Vulkan, DirectX)."
        },
        {
          w: "Designing an API simply means exposing your database tables directly over HTTP.",
          r: "Directly exposing database schemas over an API is a **severe architectural anti-pattern**. It couples client callers to internal database schema implementations, leaks internal database IDs and timestamps, prevents database refactoring, and introduces massive security vulnerabilities."
        },
        {
          w: "Private internal APIs don't need formal contracts or documentation.",
          r: "Undocumented internal APIs are the leading cause of microservice integration bugs, breaking changes, and deployment outages. Production engineering mandates documenting all APIs with **OpenAPI (Swagger)** or **Protocol Buffers**."
        },
        {
          w: "APIs are inherently secure because only authorized mobile apps have the endpoint URLs.",
          r: "Mobile app traffic is easily intercepted and inspected using proxy tools (Charles, Wireshark, Burp Suite). All public and private API endpoints MUST enforce server-side authentication, authorization, rate limiting, and input validation."
        }
      ],

      trade: {
        buys: [
          "System modularity: enables independent teams to build, deploy, and scale microservices without breaking callers.",
          "Ecosystem interoperability: allows third-party developers, partners, and mobile apps to build on top of your platform.",
          "Language independence: allows a Python frontend to query a Go backend that talks to a Rust payment service.",
          "Decoupled refactoring: internal databases and business algorithms can be overhauled without altering external caller contracts."
        ],
        costs: [
          "Breaking change risks: altering an API signature breaks external consumers, requiring strict semantic versioning.",
          "Network latency and failure: distributed API calls introduce network latency, packet loss, and timeout handling complexity.",
          "Documentation maintenance: requires maintaining synchronized API documentation (OpenAPI, Postman) alongside code.",
          "Security attack surface: exposing APIs to networks creates targets for brute-force attacks, data scraping, and DDoS."
        ],
        avoid: [
          "Never make breaking changes to an existing production API endpoint; introduce versioning (`/v2/`) or backward-compatible fields.",
          "Do not expose raw database entity models directly over public APIs; use dedicated Data Transfer Objects (DTOs).",
          "Avoid returning inconsistent error shapes across different API endpoints; standardize on RFC 7807 (Problem Details).",
          "Never ship an API without automated rate limiting and authentication checks on every non-public route."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "graphql",

      why: {
        before: "REST APIs forced mobile and web frontends into two painful extremes: 'Over-fetching' (downloading 50KB user objects when only the username was needed) or 'Under-fetching' (requiring 5 sequential network round-trips to assemble a single dashboard view).",
        problem: "Complex client applications need a query language that allows the frontend to request exactly the data it needs and nothing more, fetching nested relational resources across multiple backend services in a single round-trip.",
        shift: "**GraphQL: An open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.** Developed internally by Facebook in 2012 and open-sourced in 2015, GraphQL replaces rigid REST endpoints with a single dynamic schema-driven endpoint."
      },

      num: {
        t: "GraphQL vs REST Architectural Comparison",
        h: ["Dimension", "GraphQL", "REST (Representational State)", "Underlying Mechanism", "Engineering Impact"],
        r: [
          ["Over-fetching / Under-fetching", "Zero: client specifies exact fields requested", "Common: fixed server-defined endpoint shapes", "Client-specified AST query document", "Saves cellular mobile bandwidth and eliminates waterfalls"],
          ["Endpoint Architecture", "Single endpoint (`/graphql` via HTTP POST)", "Multiple resource URLs (`/users`, `/posts`, `/comments`)", "Single entry point dispatcher", "Simplifies client networking; complicates HTTP caching"],
          ["Schema & Type System", "Strictly typed Schema Definition Language (SDL)", "Loose (optional OpenAPI / JSON Schema)", "Compile-time schema validation", "Strong type safety between frontend and backend"],
          ["Network Round-Trips", "1 round-trip for arbitrary nested relational data", "Multiple round-trips (fetch user -> fetch posts)", "Batch resolver execution", "Accelerates mobile dashboard rendering"],
          ["HTTP Caching", "Difficult (all requests POST to same URL)", "Trivial & native (HTTP GET URLs cached at CDN edge)", "Custom client caches (Apollo Normalized Cache)", "Requires specialized caching layer instead of standard CDNs"]
        ],
        n: "A GraphQL service is defined by a **Schema Definition Language (SDL)** specifying Object Types, Queries, Mutations, and Subscriptions: `type User { id: ID!, name: String!, posts: [Post!]! }`. When a client POSTs a query string, the GraphQL server parses it into an **Abstract Syntax Tree (AST)**, validates it against the schema, and executes it. Execution is handled by **Resolver Functions**: each field in the schema maps to a resolver function `resolve(parent, args, context, info)`. However, naive recursive resolution introduces the lethal **$N+1$ Database Problem**: querying 100 users and their posts executes 1 query for users followed by 100 separate database queries for posts. Production backends solve this using **DataLoader** (Lee Byron), which uses Node.js event-loop microtask batching to coalesce separate primary key IDs into a single SQL `WHERE id IN (...)` query."
      },

      miss: [
        {
          w: "GraphQL replaces the database or acts as a database query language.",
          r: "GraphQL is **NOT a database query language** (like SQL). It is an **Application-Layer API Query Protocol**. GraphQL runs on your backend API server; your resolver functions must still query SQL databases (PostgreSQL), NoSQL stores, or microservices to retrieve the data."
        },
        {
          w: "GraphQL automatically makes your backend faster.",
          r: "GraphQL makes the **frontend network transfer faster** by eliminating over-fetching. However, it can make the **backend slower** if resolvers are un-optimized, triggering $N+1$ database query waterfalls and expensive AST parsing on every incoming request."
        },
        {
          w: "You can cache GraphQL responses in a standard CDN just like REST GET endpoints.",
          r: "Because GraphQL requests are sent as **HTTP POST requests to a single `/graphql` URL**, standard CDN edge caches (Cloudflare, Fastly) cannot cache responses by default. Caching requires specialized GraphQL client caches (Apollo InMemoryCache) or Stored Persistent Queries."
        },
        {
          w: "Clients can execute arbitrarily deep queries without backend restrictions.",
          r: "Allowing unrestricted queries allows attackers to issue **Denial of Service (DoS) queries**: e.g., querying `user { friends { friends { friends ... } } }` 100 levels deep can crash your database. Production GraphQL servers MUST enforce **Query Depth Limiting** and **Query Complexity Analysis**."
        }
      ],

      trade: {
        buys: [
          "Zero over-fetching: clients receive only the exact fields declared in the query, slashing mobile data payload sizes.",
          "Single round-trip relational queries: fetches users, orders, and products in a single HTTP request.",
          "Strict end-to-end type safety: automated code generators (GraphQL Code Generator) generate TypeScript types directly from schemas.",
          "Self-documenting interactive APIs: tools like GraphiQL provide instant autocomplete and schema documentation."
        ],
        costs: [
          "N+1 database query vulnerability: naive resolvers hammer databases with hundreds of queries without DataLoader batching.",
          "Loss of native HTTP edge caching: all queries hit `/graphql` via POST, bypassing standard CDN edge caches.",
          "Query complexity DoS risk: malicious clients can execute deeply nested combinatorial queries to exhaust server CPU.",
          "Backend complexity: implementing, maintaining, and securing GraphQL schemas and resolvers requires high engineering overhead."
        ],
        avoid: [
          "Never ship a GraphQL API without using **DataLoader** to batch and deduplicate database queries (resolving the N+1 problem).",
          "Do not expose an unrestricted public GraphQL endpoint without enforcing **Query Depth Limiting** and rate limiting.",
          "Avoid using GraphQL for simple CRUD applications where a standard REST API is simpler and benefits from native CDN caching.",
          "Never put file uploads directly through multipart GraphQL if you can upload to S3 directly via pre-signed URLs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grpc",

      why: {
        before: "Microservices communicated using REST over HTTP/1.1 with verbose JSON payloads, wasting CPU cycles on text serialization/parsing, suffering from head-of-line blocking, and lacking strict compile-time interface contracts across languages.",
        problem: "Internal microservice-to-microservice communication requires ultra-low latency, binary serialization, bi-directional streaming, and automated strongly-typed client generation across heterogeneous backend languages.",
        shift: "**gRPC (Google Remote Procedure Call): A high-performance, open-source universal RPC framework developed by Google.** Operating natively over HTTP/2 with Protocol Buffers binary serialization, gRPC is the industry standard for high-throughput, low-latency microservice architectures."
      },

      num: {
        t: "gRPC vs REST over HTTP/1.1: Systems Performance Comparison",
        h: ["Feature / Metric", "gRPC", "REST over HTTP/1.1", "Underlying Technology", "Production Performance Advantage"],
        r: [
          ["Transport Protocol", "HTTP/2 (Multiplexed bidirectional streams)", "HTTP/1.1 (Sequential / Pipeling issues)", "HTTP/2 binary framing layer", "Zero Head-of-Line blocking; single TCP connection handles $1000$ RPCs"],
          ["Serialization Format", "Protocol Buffers (Binary)", "JSON (Human-readable text)", "Binary Varint / Tag-Length-Value encoding", "$5\\text{--}10\\times$ faster serialization; $60\\text{--}80\\%$ smaller wire payload"],
          ["Streaming Capabilities", "Unary, Server-stream, Client-stream, Bi-directional", "Unary Request/Response (SSE is server-only)", "Native HTTP/2 streaming frames", "Enables real-time duplex streaming between microservices"],
          ["Contract Enforcement", "Strict compile-time `.proto` contracts", "Loose / Optional OpenAPI documentation", "`protoc` compiler code generation", "Guarantees cross-language type safety (Go, Java, C++, Rust)"],
          ["Browser Compatibility", "Requires gRPC-Web proxy (Envoy)", "Universal native browser support", "Browser HTTP/2 API access restrictions", "REST dominates frontend; gRPC dominates backend"]
        ],
        n: "gRPC operates on the **Remote Procedure Call (RPC)** paradigm: a client invokes a method on a remote server as if it were a local function call. Services and data structures are defined in `.proto` files. The Protocol Buffer compiler (**`protoc`**) compiles the definition into strongly-typed client stubs and server interfaces across multiple languages. gRPC relies exclusively on **HTTP/2**: multiple concurrent RPC calls are multiplexed over a **single long-lived TCP connection** as independent binary streams, eliminating the latency of repeated TCP handshakes and TLS negotiations. It supports four communication modes: (1) **Unary RPC** (single request/response), (2) **Server Streaming** (client sends 1 request, server streams multiple responses), (3) **Client Streaming** (client streams data, server responds once), and (4) **Bi-directional Streaming**."
      },

      miss: [
        {
          w: "gRPC is a replacement for REST in frontend web browsers.",
          r: "Modern web browsers **cannot natively speak standard gRPC**! Browsers do not expose low-level control over HTTP/2 framing and trailers to JavaScript. Using gRPC in web browsers requires **gRPC-Web**, which necessitates running an intermediary reverse proxy (like **Envoy**) to translate between HTTP/1.1 and binary gRPC."
        },
        {
          w: "gRPC payloads can be easily read and debugged using standard network sniffers.",
          r: "gRPC payloads are encoded in **compact binary Protocol Buffers**. Inspecting a raw gRPC packet in Wireshark or browser devtools shows unreadable binary gibberish unless you provide the original `.proto` schema to decode the field tags."
        },
        {
          w: "gRPC load balancing works identically to HTTP/1.1 REST load balancing.",
          r: "Standard L4 (TCP) load balancers **FAIL on gRPC**! Because gRPC multiplexes thousands of calls over a single long-lived HTTP/2 TCP connection, an L4 load balancer routes the entire connection to a single backend pod, leaving all other pods idle. gRPC requires **L7 (Application-Layer) Load Balancing** (Envoy, Linkerd, Istio) that balances individual RPC streams."
        },
        {
          w: "Protocol Buffers and gRPC are the exact same thing.",
          r: "**Protocol Buffers** is a binary serialization format. **gRPC** is the network RPC communications framework. You can use Protocol Buffers without gRPC (e.g., storing bytes in Kafka or Redis), and gRPC can theoretically use JSON (though Protobuf is standard)."
        }
      ],

      trade: {
        buys: [
          "Extreme throughput & low latency: binary serialization and HTTP/2 multiplexing execute RPCs up to $10\\times$ faster than REST.",
          "Polyglot type safety: `protoc` generates identical, type-safe client and server code across Go, Java, C++, Python, and Rust.",
          "True bi-directional streaming: enables real-time duplex data streaming over persistent connections.",
          "Connection efficiency: multiplexes hundreds of concurrent requests over a single TCP connection, saving server sockets."
        ],
        costs: [
          "Poor browser support: requires running Envoy gRPC-Web proxy shims to communicate with web browser frontends.",
          "Unreadable payload debugging: binary format prevents inspecting requests with simple cURL or Postman without specialized tooling (grpcurl).",
          "Load balancing complexity: requires L7 proxy infrastructure (service mesh) to prevent connection pinning.",
          "Strict schema governance: requires managing central `.proto` repositories and maintaining backward compatibility."
        ],
        avoid: [
          "Never use standard L4 TCP load balancers for gRPC traffic; use L7 load balancers (Envoy) to balance individual RPC streams.",
          "Do not change existing field numbers in `.proto` files; field numbers define the binary wire format and break compatibility.",
          "Avoid using gRPC for public third-party web developer APIs where REST/JSON is the universal expected standard.",
          "Never omit request timeouts (deadlines); gRPC deadlines must be propagated across microservice chains to prevent cascading hangs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "websocket",

      why: {
        before: "Building real-time web features (live chat, multiplayer games, financial tickers) required 'HTTP Polling' (the browser sending an HTTP request every 1 second) or 'Long Polling', wasting massive bandwidth on redundant HTTP headers and hammering servers with thousands of empty requests.",
        problem: "Modern web applications need a persistent, bi-directional, full-duplex communication channel over a single TCP connection, allowing the server to push data to the client instantly with minimal latency and near-zero packet overhead.",
        shift: "**WebSocket: A computer communications protocol providing full-duplex communication channels over a single TCP connection.** Standardized by the IETF as RFC 6455, WebSocket upgrades standard HTTP connections into persistent, event-driven sockets."
      },

      num: {
        t: "WebSocket vs HTTP Polling vs Server-Sent Events (SSE)",
        h: ["Real-Time Protocol", "Communication Direction", "Transport Mechanism", "Packet Overhead per Message", "Primary Production Fit"],
        r: [
          ["WebSocket (RFC 6455)", "Full-Duplex (Both client and server push simultaneously)", "Single persistent TCP connection (binary frames)", "Minimal ($2\\text{--}10$ bytes frame header)", "Live chat, multiplayer gaming, collaborative editing (Figma)"],
          ["Server-Sent Events (SSE)", "Half-Duplex (Server-to-client push only)", "Standard HTTP stream (`text/event-stream`)", "Moderate (HTTP text formatting)", "LLM AI streaming completions (ChatGPT), live stock tickers"],
          ["HTTP Long Polling", "Simulated push (Client waits on open HTTP request)", "Repeated HTTP request-response cycles", "Massive ($500\\text{--}1000$ bytes HTTP headers per poll)", "Legacy fallback when WebSockets are blocked by proxies"],
          ["WebTransport (Next-Gen)", "Full-Duplex over HTTP/3 (QUIC / UDP)", "Multiplexed streams + unreliable datagrams", "Ultra-low (bypasses TCP Head-of-Line blocking)", "Cloud gaming, live video streaming, low-latency audio"]
        ],
        n: "A WebSocket connection begins with an **HTTP Handshake Upgrade**: the client issues a standard HTTP GET request with headers: `Upgrade: websocket`, `Connection: Upgrade`, `Sec-WebSocket-Key: <base64>`, and `Sec-WebSocket-Version: 13`. The server verifies the key and responds with **`HTTP/1.1 101 Switching Protocols`**. At this instant, the HTTP protocol is discarded, and both client and server switch to the **WebSocket Framing Protocol** over the existing open TCP socket. WebSocket frames have an ultra-compact binary header ($2\\text{ to }10\\text{ bytes}$), consisting of a FIN bit, opcode (Text `0x1`, Binary `0x2`, Ping `0x9`, Pong `0xA`), masking key, and payload length. This eliminates the $500\\text{--}1000\\text{ bytes}$ of HTTP header overhead on every single message."
      },

      miss: [
        {
          w: "WebSockets and HTTP are two completely unrelated protocols that run on different ports.",
          r: "WebSockets **begin as a standard HTTP request** on standard web ports (**Port 80 for `ws://` and Port 443 for `wss://`**). This design allows WebSocket connections to pass cleanly through existing corporate firewalls, NAT routers, and reverse proxies before upgrading to the raw binary framing protocol."
        },
        {
          w: "WebSockets should always be used whenever you need real-time data from a server.",
          r: "If communication is strictly **one-way (server-to-client)**, such as an AI chat completion or financial stock ticker, **Server-Sent Events (SSE)** is vastly simpler, runs over standard HTTP/2, supports automatic reconnection out of the box, and bypasses proxy corporate firewalls that block WebSockets."
        },
        {
          w: "A WebSocket connection reconnects automatically if the network drops.",
          r: "Raw native WebSockets **DO NOT reconnect automatically**! If a mobile user walks into an elevator or switches from Wi-Fi to cellular, the socket terminates (`close` event). Developers must write custom exponential backoff reconnection logic or use libraries like Socket.IO."
        },
        {
          w: "Scaling WebSockets across multiple backend servers is identical to scaling stateless REST APIs.",
          r: "WebSockets are **stateful, long-lived TCP connections**. If User A is connected to Server 1 and User B is connected to Server 2, Server 1 cannot push messages directly to User B. Scaling WebSockets horizontally mandates an external **Pub/Sub Message Bus (Redis Pub/Sub, Kafka)** to broadcast messages across server instances."
        }
      ],

      trade: {
        buys: [
          "True full-duplex communication: allows client and server to push messages simultaneously with zero delay.",
          "Ultra-low packet overhead: strips HTTP headers, sending messages with only 2 to 10 bytes of framing metadata.",
          "Instantaneous push latency: sub-millisecond data delivery ideal for financial trading and online gaming.",
          "Firewall traversal: initiates over standard HTTP/HTTPS ports (80/443), passing cleanly through network infrastructure."
        ],
        costs: [
          "Stateful server architecture: holding open persistent connections consumes server memory and file descriptors (C10K problem).",
          "Horizontal scaling complexity: broadcasting messages across multi-server clusters requires Redis Pub/Sub or message brokers.",
          "Manual heartbeat management: requires implementing manual Ping/Pong keep-alive frames to prevent load balancer timeouts.",
          "No built-in reconnection: requires custom client code to handle network reconnects, token refreshes, and missed message buffering."
        ],
        avoid: [
          "Never deploy unencrypted `ws://` in production; always use secure `wss://` (TLS) to prevent proxy tampering.",
          "Do not use WebSockets for simple one-way server streaming (like LLM token generation); use Server-Sent Events (SSE).",
          "Avoid scaling WebSocket servers horizontally without a centralized message broker (Redis Pub/Sub) to bridge server nodes.",
          "Never forget to implement heartbeat Ping/Pong frames; idle connections are killed by AWS/Cloudflare ALBs after 60 seconds."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "webhook",

      why: {
        before: "To know when an event happened in an external service (like a Stripe payment succeeding or a GitHub commit pushing), backend servers had to execute continuous polling loops every 5 seconds, wasting millions of API calls and missing real-time triggers.",
        problem: "Distributed systems need an event-driven mechanism where a third-party service pushes an automated notification directly to an application's HTTP endpoint the exact instant an event occurs.",
        shift: "**Webhook: An automated HTTP callback triggered by a specific event in a source system, sending a payload of data (usually JSON) to a configured destination URL.** Transforming passive API polling into reactive event-driven web architecture, webhooks power the modern API economy."
      },

      num: {
        t: "Webhook Security & Delivery Architecture: Verification & Retries",
        h: ["Engineering Requirement", "Failure Mechanism", "Standard Technical Solution", "Cryptographic / Protocol Mechanism", "Production Implementation"],
        r: [
          ["Origin Authenticity", "Attacker spoofs fake payment success payload", "HMAC SHA-256 Signature Verification", "`crypto.createHmac('sha256', secret).update(body)`", "Stripe `Stripe-Signature`, GitHub `X-Hub-Signature-256`"],
          ["Replay Attack Prevention", "Attacker captures and re-sends valid webhook", "Timestamp Verification in Signature Header", "Rejects payloads where $|t_{\\text{current}} - t_{\\text{header}}| > 300\\text{s}$", "Stripe timestamp check in header"],
          ["Delivery Reliability", "Destination server temporarily offline or 500 error", "Exponential Backoff Retry with Dead-Letter Queue", "Source retries over 24-72 hours (`1s, 5s, 30s, 5m, 1h`)", "Webhook provider automated retry queue"],
          ["Idempotency Handling", "Network glitches cause provider to deliver webhook twice", "Idempotency Keys / Event ID deduplication table", "Database uniqueness constraint on `event_id`", "Ignores duplicate `evt_12345` transactions"],
          ["Timeout Avoidance", "Receiver executes 30s long task; provider times out at 5s", "Asynchronous Ingestion (Queue First, Process Later)", "Receiver returns immediate HTTP 200; pushes to SQS/RabbitMQ", "Decouples webhook ingestion from processing"]
        ],
        n: "A Webhook operates as a **Reverse API**: instead of the consumer calling the provider, the provider makes an HTTP POST request to the consumer's registered URL. The canonical webhook lifecycle adheres to strict security standards: (1) When an event occurs (e.g., `payment_intent.succeeded`), the provider constructs a JSON payload containing the event data and a unique `event_id`. (2) The provider computes an **HMAC SHA-256 Signature** using a shared secret key and attaches it to the HTTP header (`Stripe-Signature: t=161455,v1=9f8a...`). (3) The consumer's webhook endpoint receives the request, verifies the signature against the raw, unparsed request byte buffer, checks that the timestamp is fresh ($< 5\\text{ minutes}$ old to prevent **Replay Attacks**), writes the event to a **Background Message Queue**, and immediately returns an **HTTP 200 OK** in under $200\\text{ ms}$."
      },

      miss: [
        {
          w: "Parsing the webhook body with `express.json()` before verifying the signature is fine.",
          r: "Verifying an HMAC signature **FAILS if you use parsed JSON**! `JSON.parse()` can alter whitespace, key ordering, and unicode characters, which changes the cryptographic hash. Webhook signature verification **MUST use the exact, raw byte buffer** received directly from the network socket (`express.raw({ type: 'application/json' })`)."
        },
        {
          w: "Webhooks guarantee that an event will be delivered exactly once.",
          r: "Webhooks operate on **At-Least-Once Delivery**. Network hiccups, timeouts, and automatic retry loops mean your endpoint **WILL receive the exact same webhook multiple times**! Webhook consumers MUST be **Idempotent**: track processed `event_id`s in a database to skip duplicates."
        },
        {
          w: "You should execute your full business logic (sending emails, database updates) before returning HTTP 200.",
          r: "Executing heavy business logic before responding is a **catastrophic anti-pattern**. Most webhook providers have strict timeouts ($5\\text{--}10\\text{ seconds}$): if your database takes 6 seconds, the provider marks the webhook as failed and triggers aggressive retries. The receiver should verify the signature, **push the event to a background queue (Redis/SQS)**, and return **HTTP 200 immediately**."
        },
        {
          w: "Webhooks can only send JSON data.",
          r: "While JSON is the overwhelming modern standard, webhooks are simply HTTP POST requests. They can transmit form-urlencoded payloads, XML, or binary protobuf data depending on the provider."
        }
      ],

      trade: {
        buys: [
          "Zero polling overhead: eliminates millions of wasteful polling requests, saving massive server compute and API quota.",
          "Real-time event notification: updates application state the exact millisecond an external transaction or event occurs.",
          "Decoupled asynchronous workflows: enables building reactive pipelines triggered by third-party events.",
          "Universal SaaS integration: standard integration model for Stripe, GitHub, Twilio, Shopify, and Slack."
        ],
        costs: [
          "Security attack surface: exposing a public webhook endpoint requires strict HMAC signature verification and replay prevention.",
          "Idempotency requirement: handling duplicate deliveries mandates maintaining event deduplication state in databases.",
          "Local development friction: testing webhooks locally requires tunneling tools (ngrok, Cloudflare Tunnel, Stripe CLI).",
          "Out-of-order delivery: webhooks for the same entity can arrive out of chronological sequence due to network retries."
        ],
        avoid: [
          "Never parse JSON before verifying webhook HMAC signatures; always verify against the raw unparsed request buffer.",
          "Do not perform long-running tasks inside the webhook handler; return HTTP 200 immediately and process in a background queue.",
          "Avoid processing webhooks without recording `event_id` in an idempotency table to prevent duplicate charges or actions.",
          "Never accept webhooks in production without validating the timestamp header to prevent Replay Attacks."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "json",

      why: {
        before: "Data exchange across the web relied on heavy, complex XML documents with rigid schemas, closing tags, and namespace boilerplate that was notoriously difficult and slow to parse in JavaScript.",
        problem: "Distributed web services and browser applications require a lightweight, human-readable, minimal data-interchange format that maps directly to native programming language data structures.",
        shift: "**JSON (JavaScript Object Notation): A lightweight, text-based, language-independent data-interchange format derived from JavaScript object syntax.** Standardized by ECMA-404 and RFC 8259, JSON is the universal lingua franca of web APIs and modern data exchange."
      },

      num: {
        t: "JSON Native Types & Grammar Constraints",
        h: ["JSON Data Type", "Syntax Example", "Allowed Values / Structure", "JavaScript Native Equivalent", "Disallowed / Unsupported Types"],
        r: [
          ["Object", `{"name": "Alice", "age": 30}`, "Unordered key-value pairs; keys MUST be double-quoted strings", "Plain JavaScript Object (`{}`)", "Cannot store functions, methods, or class instances"],
          ["Array", `["apple", 42, true, null]`, "Ordered sequence of zero or more values", "JavaScript Array (`[]`)", "Zero structural constraints; mixed types allowed"],
          ["String", `"Hello, world! \\n"`, "Sequence of Unicode characters enclosed in DOUBLE quotes", "JavaScript `String`", "Single quotes (`'text'`) are strictly ILLEGAL in JSON"],
          ["Number", "`42`, `-3.1415`, `1.5e10`", "Integer or floating point in standard base-10 decimal", "JavaScript `Number` (IEEE 754 float)", "Cannot store `NaN`, `Infinity`, or `BigInt`"],
          ["Boolean", "`true`, `false`", "Strictly lowercase `true` or `false`", "JavaScript `Boolean`", "Capitalized `True` or `FALSE` are illegal"],
          ["Null", `null`, "Literal `null` representing empty value", "JavaScript `null`", "`undefined` is strictly ILLEGAL in JSON"]
        ],
        n: "JSON is formalized by the **ECMA-404 JSON Data Interchange Standard**. Its grammar is defined as a strict context-free grammar with zero comments, single quotes, or trailing commas. Serialization in JavaScript is performed via **`JSON.stringify(value, replacer, space)`**, and parsing via **`JSON.parse(text, reviver)`**. Because JSON numbers are specified without fixed precision limits, parsing large 64-bit integers (e.g., Twitter Snowflake IDs $> 2^{53} - 1$) into standard JavaScript numbers causes **silent precision truncation**: `JSON.parse('{\"id\": 1829384918239481923}')` becomes `1829384918239481900`. High-performance systems use specialized parsers (**`simdjson`**, Daniel Lemire) that parse gigabytes of JSON per second using single-instruction multiple-data (SIMD) CPU vector registers."
      },

      miss: [
        {
          w: "JSON is valid JavaScript, so any JavaScript object literal is valid JSON.",
          r: "JavaScript object literals are vastly more permissive than JSON. In JSON: **keys MUST be enclosed in double quotes** (`\"key\": 1`), **single quotes are illegal**, **trailing commas are strictly forbidden** (`[1, 2,]` crashes), and **comments (`//`) are illegal**."
        },
        {
          w: "JSON can serialize `Date`, `Map`, `Set`, and `undefined`.",
          r: "JSON has **zero representation** for these types! `Date` objects are converted to ISO string representations, `Map` and `Set` become empty objects `{}` or arrays, `undefined` and functions are **silently omitted** from objects, and `NaN` or `Infinity` are converted to `null`."
        },
        {
          w: "`JSON.parse(JSON.stringify(obj))` is the best way to deep-clone an object.",
          r: "Using JSON for deep-cloning is an **anti-pattern**: it strips functions, converts `Date`s to strings, converts `NaN` to `null`, drops `undefined`, and crashes with a fatal `TypeError` if the object contains circular references. Modern JavaScript provides native **`structuredClone(obj)`** for robust deep copying."
        },
        {
          w: "JSON supports comments if you write `/* comment */`.",
          r: "Douglas Crockford (creator of JSON) **intentionally removed comments from JSON** to prevent people from holding parsing directives inside comments. Modern tools that need comments use **JSONC (JSON with Comments)** or JSON5, but standard JSON strictly rejects comments."
        }
      ],

      trade: {
        buys: [
          "Universal language compatibility: parsed natively by virtually every programming language on Earth.",
          "Human readable and editable: easy for developers to inspect, write, and debug in API logs.",
          "Native JavaScript integration: maps directly to native JavaScript objects with built-in C++ `JSON.parse()` speed.",
          "Clean, minimal specification: small grammar footprint makes parser implementations simple and consistent."
        ],
        costs: [
          "Verbose text overhead: repetitive string keys waste network bandwidth compared to binary formats (Protobuf).",
          "CPU parsing bottleneck: parsing massive multi-megabyte JSON files locks CPU threads with string conversions.",
          "Limited type system: lacks native representations for dates, binary byte arrays, BigInt, and enums.",
          "No native schema validation: requires external libraries (Zod, Ajv, JSON Schema) to enforce data structures."
        ],
        avoid: [
          "Never pass un-sanitized, untrusted JSON to `eval()`; always use native `JSON.parse()`.",
          "Do not serialize 64-bit integer database IDs as raw JSON numbers; serialize them as strings to prevent precision truncation.",
          "Avoid using `JSON.parse(JSON.stringify(x))` for deep cloning; use native `structuredClone()`.",
          "Never leave trailing commas in JSON configuration files (like `tsconfig.json` or `package.json`) unless the parser explicitly supports JSONC."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "xml",

      why: {
        before: "SGML was too complex and difficult to implement for web applications, while early HTML lacked customizable tags, validation schemas, and structural extensibility required for enterprise data interchange.",
        problem: "Enterprises, financial institutions, and document publishing systems need an extensible, strictly validated, hierarchical markup language with formal schema validation (XSD) and namespace isolation.",
        shift: "**XML (Extensible Markup Language): A markup language and file format for storing, transmitting, and reconstructing arbitrary data.** Defined by the W3C in 1998, XML introduced self-describing tree hierarchies with formal document type definitions (DTD/XSD), XPath querying, and XSLT transformations."
      },

      num: {
        t: "XML vs JSON: Structural & Enterprise Capabilities",
        h: ["Capability / Dimension", "XML (Extensible Markup Language)", "JSON (JavaScript Object Notation)", "Underlying Mechanism", "Enterprise Production Role"],
        r: [
          ["Schema Validation", "Strict, standardized XML Schema (XSD) / DTD", "External JSON Schema (optional)", "Formal schema validation engines", "Financial messaging (ISO 20022), healthcare (HL7/FHIR)"],
          ["Namespaces", "Native XML Namespaces (`xmlns:prefix`)", "Zero native namespace support", "Prefix isolation for combining vocabularies", "Combining SVG, MathML, and XHTML in one document"],
          ["Query Language", "XPath (`/users/user[@id='1']`) and XQuery", "JSONPath / jq (non-standardized extensions)", "Declarative W3C tree query standard", "Complex XML document extraction and transformations"],
          ["Transformation Engine", "XSLT (Extensible Stylesheet Transformations)", "Manual programmatic mapping in JS/Python", "Declarative XML-to-HTML/XML translation", "Publishing pipelines (DocBook, DITA to PDF/HTML)"],
          ["Wire Payload Efficiency", "Heaviest: closing tags (`</user>`) and attributes", "Lightweight: minimal punctuation brackets", "Text verbosity", "JSON displaced XML for public REST web APIs"]
        ],
        n: "An XML document is a tree of nodes adhering to strict syntactic rules: it must have a single root element, all tags must close, attribute values must be quoted, and entity references (`&amp;`, `&lt;`) must escape special characters. Unlike JSON, XML separates **Elements** (`<user>Alice</user>`) from **Attributes** (`<user id='42' status='active'/>`). XML Schema Definition (**XSD**) provides industrial-grade validation: verifying data types, regex patterns, enumerations, and structural cardinality before processing. However, XML parsers are historically vulnerable to **XXE (XML External Entity)** attacks: an attacker injects a malicious DTD containing `<!ENTITY xxe SYSTEM 'file:///etc/passwd'>`, forcing the XML parser to read and exfiltrate sensitive server files unless external entity resolution is explicitly disabled."
      },

      miss: [
        {
          w: "XML is completely dead and never used in modern software development.",
          r: "XML is heavily used in global enterprise backends: **Android layout files (`activity_main.xml`)**, **SVG vector images**, **Microsoft Office documents (`.docx`, `.xlsx` are zipped XML files)**, **SAML 2.0 Single Sign-On**, **RSS/Atom feeds**, and global banking protocols (**ISO 20022**)."
        },
        {
          w: "Parsing XML in modern languages is safe by default.",
          r: "Default XML parsers in Java, Python, and PHP are frequently **vulnerable to XXE (XML External Entity) attacks and Billion Laughs (XML bomb) denial-of-service attacks**! Production XML parsers MUST be explicitly configured to disable external DTDs (`disallow-doctype-decl`)."
        },
        {
          w: "HTML and XML are basically the same thing.",
          r: "HTML is designed for **displaying data** with a forgiving parser that auto-corrects errors. XML is designed for **storing and transporting data** with a strict parser that **fails fatally on any syntax error**. XHTML is HTML formulated as valid XML."
        },
        {
          w: "JSON is strictly better than XML for all use cases.",
          r: "XML excels over JSON for **rich document publishing** (mixing text and markup, like `<b>bold</b> inside text`), **namespacing**, **formal mathematical schemas (XSD)**, and **declarative transformations (XSLT)**, where JSON's rigid key-value model is awkward."
        }
      ],

      trade: {
        buys: [
          "Industrial schema validation: XSD validates complex data types, patterns, and hierarchies before application code runs.",
          "Document markup power: excels at mixed-content documents (text containing inline markup tags) like XHTML and DocBook.",
          "Namespace isolation: allows combining disparate data schemas (SVG inside HTML inside SAML) without naming collisions.",
          "Declarative transformations: XSLT allows converting complex XML datasets into HTML, PDF, or text with zero custom code."
        ],
        costs: [
          "Extreme payload verbosity: closing tags and attribute boilerplate make XML payloads significantly larger than JSON.",
          "High parsing CPU overhead: building and validating DOM trees from XML consumes heavy CPU and memory.",
          "Severe security risks: vulnerable to XML External Entity (XXE) and XML Entity Expansion (Billion Laughs) attacks.",
          "Developer ergonomics friction: verbose APIs and complex namespace syntax make XML painful for modern web developers."
        ],
        avoid: [
          "Never parse untrusted XML without explicitly disabling external DTDs and entity expansion to prevent XXE attacks.",
          "Do not use XML for modern public web APIs where JSON is the universal industry standard.",
          "Avoid using XML when data consists solely of simple key-value pairs without mixed text markup or namespace needs.",
          "Never omit proper XML encoding declarations (`<?xml version='1.0' encoding='UTF-8'?>`) on document headers."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
