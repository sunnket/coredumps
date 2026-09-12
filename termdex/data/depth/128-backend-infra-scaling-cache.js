/* ==========================================================================
   Depth pass 128 — Backend Architecture batch 5: Infrastructure, Scaling & Caching.
   Middleware, Reverse Proxy, Caching, CDN,
   Horizontal Scaling, Vertical Scaling, Statelessness.

   Request pipeline composition, Layer 7 reverse proxy ingress, multi-tier caching hierarchies,
   edge CDN anycast routing, elastic horizontal scale-out, and twelve-factor statelessness
   form the performance and scalability spine of production web backends.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "middleware",

      why: {
        before: "Controllers and route handlers duplicated common cross-cutting logic (authentication verification, input body parsing, CORS headers, access logging, rate limit counters); forgetting a single auth check inside a newly added route created critical security holes.",
        problem: "Web backends require a composable, modular request-handling pipeline where shared cross-cutting concerns execute systematically before or after core domain handlers without polluting business controllers.",
        shift: "**Middleware: A software function or component within a request-handling pipeline that intercepts incoming HTTP requests and outgoing responses, performing preprocessing, context injection, authorization, or short-circuiting.** Adhering to the Chain of Responsibility / Onion architecture, middleware provides declarative request lifecycle management."
      },

      num: {
        t: "Middleware Execution Paradigms: Architectural Comparison",
        h: ["Paradigm", "Execution Model", "Response Interception Style", "Error Propagation Mechanism", "Dominant Framework Ecosystem"],
        r: [
          ["Onion / Pipeline (`next()`)", "Nested concentric execution (`before -> next() -> after`)", "Post-yield execution after `await next()`", "Try/catch blocks wrapping `await next()`", "Koa, Express (Promise-based), ASP.NET Core"],
          ["Filter Chain (Pre/Post Handler)", "Linear chain with explicit pre-handle / post-handle hooks", "Dedicated `postHandle` and `afterCompletion` callbacks", "Centralized `HandlerExceptionResolver`", "Java Spring Boot, Jakarta Servlets"],
          ["gRPC / RPC Interceptor", "Streaming or unary RPC envelope interception", "Wraps `ServerCallHandler` delegate", "Status codes propagated up interceptor chain", "gRPC (Go, Java, Node, Python)"],
          ["Edge Middleware", "Runs on globally distributed edge before hitting origin", "Modifies headers, redirects, or rewrites request URL", "Edge execution catches errors before origin hit", "Next.js Edge Middleware, Cloudflare Workers"]
        ],
        n: "Middleware implements the **Chain of Responsibility** pattern. Each middleware function receives the request (`req`), response (`res`), and a continuation function (`next`). Crucially, **registration order dictates execution order**: (1) **Trace / Request ID Middleware** must run first to attach unique correlation IDs; (2) **Security & CORS Middleware** runs early to reject illegal origins; (3) **Body Parsing Middleware** deserializes raw streams into JSON objects; (4) **Authentication Middleware** validates tokens and populates `req.user`; (5) **Authorization Middleware** checks permissions; and (6) **Error-Handling Middleware** MUST be registered last to catch unhandled rejections from all upstream layers. Middleware can **short-circuit** the pipeline (e.g., returning `401 Unauthorized` immediately) without invoking downstream handlers."
      },

      miss: [
        {
          w: "The order in which middleware is registered in an application does not affect execution.",
          r: "Middleware registration order is **strictly sequential and critical**. Registering an error handler before route handlers leaves errors uncaught, and placing an authorization middleware before the authentication middleware causes auth checks to fail on unpopulated user contexts."
        },
        {
          w: "Middleware is only useful for processing incoming requests, not outgoing responses.",
          r: "In the modern **Onion model** (Koa, ASP.NET Core, Express async), code *after* `await next()` executes on the return path after the route handler completes, enabling response timing, compression, response header injection, and response logging."
        },
        {
          w: "Every microservice should implement its own rate-limiting, CORS, and TLS middleware.",
          r: "While lightweight auth context middleware belongs in services, network-heavy concerns like TLS termination, brute-force rate limiting, and CORS are much better handled at the **API Gateway or Reverse Proxy (NGINX/Cloudflare)** to save application compute."
        },
        {
          w: "Middleware can safely mutate the request object with arbitrary untyped properties.",
          r: "Attaching untyped ad-hoc properties (`req.customStuff = 123`) produces brittle runtime bugs. Modern TypeScript applications enforce type declaration merging (`declare global { namespace Express { interface Request { user: User; } } }`) to guarantee type safety."
        }
      ],

      trade: {
        buys: [
          "Elimination of boilerplate: security, parsing, and logging execute uniformly across all endpoints without manual controller calls.",
          "Fail-fast security boundary: unauthenticated or malformed requests are short-circuited before hitting expensive database queries.",
          "Composable modularity: plug-and-play middleware packages (helmet, cors, compression) can be toggled per route group.",
          "Unified error handling: a single terminal error middleware transforms unhandled exceptions into sanitized RFC 7807 problem payloads."
        ],
        costs: [
          "Debugging opacity: deeply nested middleware stacks obscure the call stack, making tracing errors and request mutations difficult.",
          "Hidden latency accumulation: registering 20+ middleware functions adds measurable CPU and garbage collection overhead to every HTTP hop.",
          "Execution order brittleness: accidental reordering of middleware lines during refactorings causes silent production regressions.",
          "Request context pollution: global mutations to request objects create implicit hidden dependencies across unrelated modules."
        ],
        avoid: [
          "Never register error-handling middleware at the top or middle of the pipeline; always register it as the final middleware.",
          "Never forget to invoke `next()` or send a response; forgetting both causes incoming HTTP requests to hang until timeout.",
          "Never perform heavy database-intensive queries or un-indexed searches inside global middleware executed on every request.",
          "Never suppress errors inside middleware without passing them to `next(err)` or logging them to APM systems."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reverse-proxy",

      why: {
        before: "Application web servers (Node.js Express, Python Gunicorn, Ruby Unicorn, PHP-FPM) were exposed directly to the public internet; slow client networks (Slowloris attacks) held application threads open for minutes, TLS handshakes burned app CPU, and servers had no defense against DDoS floods.",
        problem: "Application runtimes are optimized for business logic, not raw network I/O, TLS cryptography, static file streaming, or connection multiplexing; systems need a high-performance network boundary protecting origin backends.",
        shift: "**Reverse Proxy: A network server that sits in front of one or more backend web servers, intercepting client requests and forwarding them to the appropriate origin while presenting itself as the origin server.** Managing TLS termination, caching, load balancing, and request buffering, the reverse proxy is the front-line shield of production architectures."
      },

      num: {
        t: "Reverse Proxy Engines: Performance & Architectural Comparison",
        h: ["Proxy Engine", "Concurrency Model", "TLS & HTTP/2/3 Termination", "Configuration Reload Mechanism", "Dominant Production Domain"],
        r: [
          ["NGINX", "Asynchronous, event-driven, non-blocking C worker processes", "High performance (OpenSSL / BoringSSL; HTTP/2 & 3)", "Graceful master-worker reload (`nginx -s reload`, zero dropped conns)", "Standard web edge, static file serving, Kubernetes ingress"],
          ["HAProxy", "Event-driven single-process multi-threaded C engine", "Extremely high throughput, advanced Layer 4/7 balancing", "Runtime API / seamless zero-downtime socket transfer", "Extreme load balancing, high-concurrency TCP/HTTP routing"],
          ["Envoy Proxy", "C++ multi-threaded event-driven non-blocking", "Native HTTP/2 & HTTP/3, gRPC transcoding", "Dynamic xDS gRPC APIs (zero config reloads needed)", "Service mesh data plane (Istio), modern cloud-native ingress"],
          ["Caddy", "Go / Goroutine per connection model", "Automatic HTTPS (Let's Encrypt / ACME out of the box)", "Dynamic JSON API and Caddyfile reload", "Developer environments, fast automated SSL production setups"],
          ["Traefik", "Go / Concurrent event-driven pipeline", "Native Let's Encrypt, HTTP/2 & 3", "Dynamic discovery via Docker / Kubernetes API", "Microservice container platforms, Docker Swarm, Kubernetes"]
        ],
        n: "A **Reverse Proxy** sits in front of servers (acting on behalf of servers), in contrast to a **Forward Proxy**, which sits in front of clients (acting on behalf of clients to access the external internet). In production, reverse proxies perform crucial optimizations: (1) **Slow Client Buffering**: slow mobile connections upload requests at 5 KB/sec; the proxy buffers the full payload in memory/disk and delivers it to the backend over a gigabit local loopback in 0.2ms, freeing application threads instantly; (2) **TLS Termination**: handles CPU-heavy asymmetric cryptography and session resumption keys, passing unencrypted HTTP to internal VPC backends; (3) **Header Sanitization & Injection**: appends `X-Forwarded-For`, `X-Forwarded-Proto`, and `X-Real-IP`; and (4) **HTTP/2 and HTTP/3 Multiplexing**: converts modern multiplexed client streams into pipelined HTTP/1.1 or gRPC keepalive connections upstream."
      },

      miss: [
        {
          w: "A Forward Proxy and a Reverse Proxy are just two names for the same device.",
          r: "A **Forward Proxy** sits in front of clients (e.g., a corporate proxy inspecting outbound employee web traffic). A **Reverse Proxy** sits in front of backend servers (e.g., NGINX greeting incoming internet traffic to route it to internal application clusters)."
        },
        {
          w: "Application servers like Node.js or Python Flask can safely be exposed directly to the internet in production.",
          r: "Exposing application runtimes directly makes them vulnerable to **Slowloris attacks**, thread exhaustion, memory leaks from open TCP sockets, and inefficient static file delivery. A reverse proxy (NGINX/HAProxy) must always sit in front."
        },
        {
          w: "The client IP address can always be read directly from the TCP socket remote address in application code.",
          r: "Because the reverse proxy terminates the client connection, the socket remote address is always the proxy's internal IP (e.g., `127.0.0.1` or `10.0.0.5`). The true client IP must be extracted from the **`X-Forwarded-For`** header injected by the trusted proxy."
        },
        {
          w: "A reverse proxy introduces too much latency to be worth using in latency-critical backends.",
          r: "High-performance C/C++ reverse proxies (NGINX, Envoy, HAProxy) process requests in **less than 0.2 milliseconds**. The performance gained through connection reuse, static caching, and TLS session caching far outweighs the negligible proxy traversal cost."
        }
      ],

      trade: {
        buys: [
          "Application runtime isolation: protects fragile application worker threads from slow clients, port scans, and SYN floods.",
          "Centralized TLS management: automated certificate renewals (ACME), modern cipher enforcement, and hardware-accelerated TLS termination.",
          "High-performance static file offloading: NGINX serves images, CSS, and JS directly from disk using kernel `sendfile` zero-copy I/O.",
          "Seamless zero-downtime deployments: smoothly drains connections from old server versions while routing traffic to new releases."
        ],
        costs: [
          "Extra architectural layer: requires managing configuration files, proxy logs, health checks, and process supervisors.",
          "Header spoofing risk: trusting `X-Forwarded-For` from untrusted upstream proxies allows attackers to spoof client IPs.",
          "Additional network hop: introduces a sub-millisecond hop and local socket overhead between the proxy and backend.",
          "Troubleshooting complexity: diagnosing connection drops requires correlating reverse proxy error logs with application logs."
        ],
        avoid: [
          "Never expose Node.js, Django, Rails, or Flask directly to the public internet without a reverse proxy.",
          "Never blindly trust incoming `X-Forwarded-For` headers without configuring trusted proxy IP CIDR blocks.",
          "Never disable connection keepalive between the reverse proxy and upstream backends; socket churn causes port exhaustion.",
          "Never serve large static media assets through application runtimes; let the reverse proxy serve them via zero-copy `sendfile`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "caching",

      why: {
        before: "Every incoming HTTP request executed identical complex database queries, table joins, and template renderings; under modest traffic, databases hit 100% CPU utilization, connection pools starved, and response latencies spiked from 20ms to 8,000ms.",
        problem: "Relational database disks and complex application computations cannot scale linearly with read traffic; backends must store precomputed results in high-speed, in-memory storage to serve repeated queries in sub-millisecond time.",
        shift: "**Caching: The architectural technique of transparently storing copies of frequently accessed data in a fast, temporary storage layer (such as RAM or Redis) so subsequent requests are served orders of magnitude faster than querying primary storage.** Underpinning every tier from CPU L1 to global CDNs, caching is the primary driver of web throughput."
      },

      num: {
        t: "Caching Topologies & Write Strategies: Comparative Mechanics",
        h: ["Strategy", "Read Latency", "Write Latency Overhead", "Data Consistency Guarantee", "Primary Production Workload"],
        r: [
          ["Cache-Aside (Lazy Loading)", "Sub-millisecond on hit; DB query on miss", "Zero write penalty (DB write only, invalidate key)", "Eventual consistency (stale window during TTL)", "Standard web APIs, user profiles, product catalogs"],
          ["Write-Through", "Sub-millisecond on hit", "High (writes to cache AND database synchronously)", "Strong consistency (cache always mirrors DB)", "Financial ledgers, critical inventory counts"],
          ["Write-Behind (Write-Back)", "Sub-millisecond on hit", "Ultra-low (writes to cache; async flush to DB)", "Eventual (risk of data loss if cache crashes before flush)", "High-speed counters, analytics ingestion, gaming state"],
          ["Refresh-Ahead", "Always sub-millisecond (cache is pre-warmed)", "Low (background daemon predicts and refreshes keys)", "High (refreshed before expiration)", "Frequently accessed leaderboards, hot news feeds"]
        ],
        n: "Caching operates across a multi-tier hierarchy: Browser -> CDN Edge -> Reverse Proxy -> Application Memory (In-Process) -> Distributed In-Memory (Redis/Memcached) -> Database Buffer Pool. In the standard **Cache-Aside Pattern**, the application checks Redis: on a **Cache Hit**, it returns immediately; on a **Cache Miss**, it reads from the primary database, populates Redis with a Time-To-Live (TTL), and returns. Handling the three classic caching pathologies is mandatory: (1) **Cache Stampede (Thundering Herd)**: when a hot key expires, thousands of concurrent requests miss and hammer the DB; solved via probabilistic early expiration (XFetch algorithm) or distributed mutex locks; (2) **Cache Penetration**: requests for non-existent keys bypass the cache and hit the DB; solved via Bloom filters or caching `null` with a short TTL; (3) **Cache Avalanche**: thousands of keys expiring simultaneously; solved by adding random jitter to TTLs."
      },

      miss: [
        {
          w: "Adding a cache to an architecture is always a simple, risk-free performance win.",
          r: "As Phil Karlton famously noted, 'There are only two hard things in Computer Science: cache invalidation and naming things.' Caching introduces **stale data, split-brain reads, cache stampedes, synchronization bugs, and memory leaks**."
        },
        {
          w: "Setting an infinite TTL and manually deleting the cache key on every database update guarantees perfect consistency.",
          r: "Manual event-based deletion is **brittle and prone to race conditions**: if a write succeeds in the database but the cache invalidation command drops or fails, stale data persists *forever*. **All cache entries MUST have a finite safety TTL**."
        },
        {
          w: "In-process memory caching (e.g., storing data in a JavaScript Map or Python dict) is always better than Redis.",
          r: "In-process memory caches cannot be shared across horizontally scaled instances, leading to inconsistent responses depending on which server a user hits. Furthermore, in-process caches consume garbage-collected heap memory and do not survive container restarts."
        },
        {
          w: "A cache hit ratio of 50% is considered good for a web application.",
          r: "A 50% hit ratio means half of all requests still hit your slow database, while adding cache network round trips to every request. Healthy production caches target a **hit ratio exceeding 85% to 95%**; otherwise, the caching layer adds complexity without justifying its existence."
        }
      ],

      trade: {
        buys: [
          "Orders-of-magnitude latency reduction: sub-millisecond RAM lookups (0.5ms) replace 20-100ms disk and relational database queries.",
          "Massive throughput scaling: a single Redis node handles 100,000+ operations/sec, protecting downstream databases from collapse.",
          "Cost optimization: reduces the required size and IOPS provisioned for expensive primary database clusters.",
          "Graceful degradation: if primary databases experience transient outages, cached data continues serving read traffic."
        ],
        costs: [
          "Data staleness risk: clients may read stale data during the window between a database write and cache expiration.",
          "Cache stampede vulnerability: expiration of hot keys can instantly overwhelm databases with a thundering herd of queries.",
          "Infrastructure complexity: requires operating, monitoring, and scaling a high-availability Redis cluster.",
          "Memory cost overhead: high-RAM cloud instances (AWS ElastiCache) incur significant monthly cloud infrastructure expenses."
        ],
        avoid: [
          "Never cache data without setting a Time-To-Live (TTL); orphaned keys will accumulate and exhaust RAM.",
          "Never set identical TTLs on bulk-cached objects; always add random jitter (e.g., `TTL = 300s + rand(0, 60s)`) to prevent avalanches.",
          "Never cache sensitive user credentials, unhashed passwords, or unmasked credit card numbers in shared caches.",
          "Never treat a cache as a durable primary database; caches must be capable of being wiped without data loss."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cdn",

      why: {
        before: "All global users fetched static assets (images, JavaScript, CSS) and API payloads directly from a single centralized origin datacenter; a user in Sydney downloading a 5MB bundle from a Virginia origin suffered 250ms latency per round trip, causing 5-10 second initial load times.",
        problem: "The physical speed of light in optical fiber (~200 km/ms) imposes an inescapable physical latency floor over continental distances; backends need servers stationed physically close to end users worldwide.",
        shift: "**CDN (Content Delivery Network): A geographically distributed network of proxy servers and data centers (Points of Presence / PoPs) deployed at the edge of the internet to deliver content with high availability and performance.** Utilizing BGP Anycast routing, CDNs terminate TLS and serve cached assets within tens of miles of users."
      },

      num: {
        t: "Global CDN Architectures & Edge Capabilities: Comparative Analysis",
        h: ["CDN Network", "Global Edge Routing", "Purge / Invalidation Propagation Latency", "Edge Programmability", "DDoS Mitigation Capacity"],
        r: [
          ["Cloudflare", "BGP Anycast across 300+ global cities", "Near-instantaneous (~150ms globally)", "V8 Isolates (Cloudflare Workers, Wasm)", "Over 200+ Tbps edge capacity"],
          ["Fastly", "BGP Anycast across optimized global POPs", "Instantaneous (~150ms via soft purge)", "WebAssembly / Lucet (Compute@Edge, VCL)", "Over 100+ Tbps edge capacity"],
          ["AWS CloudFront", "BGP Anycast + AWS private backbone", "1 to 5 seconds across edge locations", "CloudFront Functions (lightweight JS) & Lambda@Edge", "Integrated with AWS Shield Advanced"],
          ["Akamai", "DNS-based geo-routing + Anycast edge", "Seconds to minutes (Fast Purge API)", "EdgeWorkers (JavaScript engine)", "World's largest enterprise edge presence"]
        ],
        n: "A CDN operates via hundreds of **Points of Presence (PoPs)** located at Internet Exchange Points (IXPs) adjacent to residential ISPs. When a user requests `https://example.com/bundle.js`, **BGP Anycast** routes the TCP packet to the topologically closest edge data center. The edge checks its local SSD/RAM cache: on a hit, it returns the asset in under 10ms; on a miss, it fetches from the origin via **Origin Shielding** (a designated intermediate cache that protects origin backends from multiple edge misses). Modern CDNs provide **Dynamic Site Acceleration (DSA)**: even for uncacheable dynamic API requests, the CDN maintains pre-warmed, persistent TCP/TLS keepalive connections over private fiber backbones directly to the origin, cutting round-trip handshake times dramatically."
      },

      miss: [
        {
          w: "CDNs are only useful for caching static assets like images, videos, and CSS files.",
          r: "Modern CDNs optimize dynamic traffic through **TLS termination at the edge**, route optimization over private backbones, edge API authentication, WebSocket proxying, and executing serverless business logic directly at the edge."
        },
        {
          w: "Setting a long Cache-Control header means users will never see new deployments of frontend code.",
          r: "Production web applications use **Cache-Busting via Content-Hashed Filenames** (e.g., `app.8f3a1c.js`). This allows setting `Cache-Control: public, max-age=31536000, immutable` for assets forever, while serving `index.html` with `no-cache` to instantly point browsers to the new bundle."
        },
        {
          w: "Purging a CDN cache globally is instantaneous across all worldwide servers.",
          r: "While modern CDNs like Cloudflare and Fastly propagate purges in 150-300ms, legacy CDNs can take up to 5-15 minutes to clear caches across all edge POPs worldwide. Relying on cache purges for normal application workflows is an anti-pattern."
        },
        {
          w: "CDNs completely prevent origin servers from crashing during traffic spikes.",
          r: "If a cache-busting query parameter is attached to requests (e.g., `?rand=123`), every request bypasses the CDN cache entirely and hits the origin directly (**Origin Bypass**), instantly overwhelming backend databases."
        }
      ],

      trade: {
        buys: [
          "Extreme latency reduction: serves content from edge servers within 5-20ms of end users, regardless of geographic location.",
          "Origin server shielding: absorbs 85-98% of web traffic, allowing modest backend clusters to support millions of concurrent users.",
          "DDoS flood absorption: multi-terabit edge networks absorb volumetric Layer 3/4 and Layer 7 DDoS attacks before reaching origin.",
          "Global high availability: if an origin temporarily restarts, the CDN can serve stale cached assets (`stale-if-error`)."
        ],
        costs: [
          "Cache invalidation lag: deploying critical bug fixes or updating data requires managing cache purges or content hashing.",
          "Data transfer and bandwidth costs: high outbound egress bandwidth pricing from cloud providers and CDN vendors.",
          "Debugging complexity: diagnosing whether an issue is caused by edge cache rules, geo-routing, or origin logic is difficult.",
          "Configuration drift risk: subtle misconfigurations in edge header rules can inadvertently cache private user-specific data."
        ],
        avoid: [
          "Never cache personalized, authenticated user responses (`Set-Cookie`, `Authorization`) on public CDN edge servers.",
          "Never deploy static assets without content-hashing in production; changing assets in-place leads to stale browser caching.",
          "Never serve `index.html` with long `max-age` caching headers; always serve HTML entrypoints with `Cache-Control: no-cache`.",
          "Never allow untrusted query parameters to bypass edge caching on public endpoints; sanitize and sort query parameters."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "horizontal-scaling",

      why: {
        before: "When traffic grew, engineering teams upgraded the server to a larger machine with more CPU and RAM (Vertical Scaling); eventually, systems hit physical motherboard hardware ceilings, cost scaled non-linearly, and any single hardware failure took down the entire company.",
        problem: "Internet-scale applications require an architectural model with no theoretical upper bound on compute capacity, where capacity can be added dynamically and the failure of individual physical servers does not cause downtime.",
        shift: "**Horizontal Scaling (Scale-Out): The architectural strategy of increasing system capacity by adding more discrete machine or container instances to a pool, distributing traffic evenly across them via load balancers.** Operating on commodity hardware, horizontal scaling is the bedrock of cloud computing."
      },

      num: {
        t: "Scaling Dimensions: Horizontal Scale-Out vs Vertical Scale-Up",
        h: ["Dimension", "Horizontal Scaling (Scale-Out)", "Vertical Scaling (Scale-Up)", "Auto-Scaling Elasticity", "Fault Tolerance & Availability"],
        r: [
          ["Maximum Capacity Ceiling", "Virtually unlimited (thousands of instances)", "Hard hardware ceiling (e.g., 128 vCPUs, 4TB RAM)", "Trivial (add/remove instances in seconds)", "High (N-1 redundancy survives node crashes)"],
          ["Architectural Code Requirements", "Strict statelessness; externalized session and cache", "Zero code changes (app runs on larger machine)", "Seamless with Kubernetes HPA / Cloud ASGs", "Zero redundancy (single machine failure is catastrophic)"],
          ["Cost Curve", "Linear (pay per small commodity instance)", "Exponential / non-linear at high-end hardware", "Highly optimized (scale to zero or down at night)", "Requires hot-standby replication to achieve HA"],
          ["Database Suitability", "Complex (requires sharding, distributed consensus)", "Trivial & ideal (scale up CPU, RAM, NVMe storage)", "Difficult for writes; easier for read replicas", "Standard primary-replica failover"]
        ],
        n: "Horizontal scaling operates by deploying $N$ identical application instances behind a **Layer 4 or Layer 7 Load Balancer** (AWS ALB, NGINX, HAProxy). The fundamental prerequisite for horizontal scaling is **Statelessness**: application processes must never store persistent state, in-memory user sessions, or local disk uploads on the instance itself. All state must be externalized to distributed datastores (PostgreSQL, DynamoDB, Redis, S3). In modern cloud environments (Kubernetes, AWS ECS), **Horizontal Pod Autoscalers (HPA)** monitor metrics (CPU utilization, memory, request latency, or queue depth) and dynamically adjust replica counts between defined minimum and maximum boundaries."
      },

      miss: [
        {
          w: "Horizontal scaling can be applied to any legacy application by simply deploying two instances.",
          r: "If an application stores user sessions in process memory, saves uploaded files to local disk (`/var/uploads`), or uses in-memory background cron jobs, running multiple instances **immediately corrupts state and breaks user sessions**."
        },
        {
          w: "Horizontal scaling is equally simple for application servers and relational databases.",
          r: "Application servers are stateless and scale out trivially. **Relational databases are stateful and notoriously difficult to scale out horizontally for writes**, requiring complex multi-master replication, distributed consensus, or sharding."
        },
        {
          w: "Adding more instances always decreases request latency proportionally.",
          r: "Under **Amdahl's Law**, scaling compute instances accelerates parallelizable work, but serialized bottlenecks (such as database locks, centralized caches, and network serialization) remain fixed and can become worse due to contention."
        },
        {
          w: "Auto-scaling can instantly handle sudden massive traffic spikes without pre-warming.",
          r: "Spinning up new virtual machines or container pods takes time (30 seconds to 3 minutes for container boot and health checks). Sudden 100x traffic surges will overwhelm existing instances before autoscalers can react; **pre-warming capacity is required for planned spikes**."
        }
      ],

      trade: {
        buys: [
          "Virtually limitless capacity: add tens, hundreds, or thousands of commodity instances as user traffic expands.",
          "High availability and resilience: individual instance crashes, hardware failures, and AZ outages do not impact service availability.",
          "Dynamic cost elasticity: automatically scale instance counts down during off-peak hours to minimize cloud infrastructure spending.",
          "Zero-downtime rolling deployments: seamlessly upgrade software version instance by instance without dropping connections."
        ],
        costs: [
          "Mandatory statelessness discipline: requires externalizing sessions, caches, and file storage to dedicated distributed clusters.",
          "Load balancer operational overhead: requires configuring, maintaining, and monitoring Layer 4/7 load balancers and health checks.",
          "Downstream connection pool pressure: 50 application instances opening 20 database connections each will exhaust database pool limits.",
          "Distributed debugging complexity: log aggregation and distributed tracing are mandatory to debug issues spanning multiple nodes."
        ],
        avoid: [
          "Never store user session data, in-memory caches, or local file uploads on local application instance disks.",
          "Never scale out application servers without monitoring downstream database connection limits; use connection poolers (PgBouncer).",
          "Never omit automated health checks on horizontally scaled instances; dead instances will continue receiving traffic.",
          "Never use sticky sessions as a permanent crutch for stateful applications; externalize session state to Redis."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "vertical-scaling",

      why: {
        before: "Teams faced with performance degradation immediately attempted complex horizontal sharding or microservice splits, spending months rewriting code and introducing distributed consistency bugs before exploring simple hardware upgrades.",
        problem: "Software engineering time is expensive, and distributed architectures incur massive operational complexity; applications need a way to scale performance and throughput immediately with zero architectural refactoring.",
        shift: "**Vertical Scaling (Scale-Up): The practice of increasing system capacity by upgrading a single machine with more powerful hardware resources—adding more CPU cores, faster processor clock speeds, larger RAM capacity, or high-IOPS NVMe storage.** Providing instant performance gains without code changes, vertical scaling is the gold standard first step for stateful databases."
      },

      num: {
        t: "Vertical Scaling Instance Milestones: Resource & Performance Progression",
        h: ["Cloud Instance Tier", "vCPU / Hardware Cores", "RAM Capacity", "EBS / Storage IOPS Bandwidth", "Optimal Production Workload"],
        r: [
          ["Small Web Node (`t4g.small`)", "2 vCPUs (Burstable)", "2 GB RAM", "Up to 2,085 Mbps network", "Development environments, staging, low-traffic APIs"],
          ["Standard Production (`m6i.2xlarge`)", "8 vCPUs", "32 GB RAM", "Up to 12.5 Gbps network / 12,500 IOPS", "Standard monolithic web apps, background queue workers"],
          ["High-Memory DB Node (`r6i.8xlarge`)", "32 vCPUs", "256 GB RAM", "Up to 12.5 Gbps network / 20,000 IOPS", "Production relational databases (PostgreSQL/MySQL), Redis clusters"],
          ["Mega Database Node (`r6i.32xlarge`)", "128 vCPUs", "1,024 GB (1 TB) RAM", "50 Gbps network / 40,000 IOPS", "High-throughput enterprise relational databases, massive in-memory stores"],
          ["Extreme Bare Metal (`u-6tb1.metal`)", "448 logical cores", "6,144 GB (6 TB) RAM", "100 Gbps network", "Giant SAP HANA, extreme in-memory enterprise databases"]
        ],
        n: "Vertical scaling requires **zero architectural code refactoring**: an application or database running on a 2-core / 4GB server runs identically on a 64-core / 512GB server, but with vastly expanded thread parallelism and memory buffer pool capacity. For databases, vertical scaling is particularly transformative because expanding RAM allows the database engine (e.g., PostgreSQL `shared_buffers` or MySQL InnoDB Buffer Pool) to **cache the entire working dataset directly in memory**, turning expensive disk I/O operations into microsecond RAM lookups. However, vertical scaling faces two hard constraints: (1) **Hardware Ceilings**: no single physical machine can exceed current semiconductor limits; and (2) **Single Point of Failure (SPOF)**: running on a single vertical machine means any hardware crash causes 100% downtime."
      },

      miss: [
        {
          w: "Vertical scaling is an outdated, primitive practice that modern engineers should avoid.",
          r: "Vertical scaling is **frequently the smartest, most cost-effective engineering decision**. A modern cloud instance with 64 vCPUs and 256GB RAM costs a few hundred dollars a month and can handle over 100,000 requests/sec, avoiding months of complex distributed systems engineering."
        },
        {
          w: "You can vertically scale an instance indefinitely whenever traffic increases.",
          r: "Vertical scaling hits a **hard physical ceiling** dictated by physical motherboard and CPU limits. Furthermore, beyond a certain size, cloud providers charge non-linear premium prices for top-tier instances."
        },
        {
          w: "Vertically scaling a virtual machine never requires downtime.",
          r: "Resizing a cloud virtual machine (e.g., modifying an EC2 instance type) requires **stopping the instance, re-allocating it on a new physical host, and booting it up**, incurring 1-5 minutes of downtime unless running in a high-availability active-passive cluster."
        },
        {
          w: "Vertical scaling solves software deadlocks, algorithmic bottlenecks, and unindexed database queries.",
          r: "If a database query executes an unindexed $O(N)$ full table scan, upgrading the CPU only makes the inefficient scan run slightly faster. **Software optimization and index tuning must always accompany scaling**."
        }
      ],

      trade: {
        buys: [
          "Zero code modification: scale applications and databases immediately without altering software architecture.",
          "Zero distributed systems complexity: preserve ACID transactions, simple debugging, and single-connection-pool simplicity.",
          "Massive database buffer pools: holding entire database tables in multi-gigabyte RAM eliminates disk I/O bottlenecks.",
          "Rapid time-to-market: teams focus 100% on business product features rather than managing complex distributed clusters."
        ],
        costs: [
          "Hard physical ceiling: systems eventually hit maximum hardware limits where larger machines do not exist.",
          "Single Point of Failure (SPOF): a single vertical machine provides zero high availability unless backed by replication.",
          "Downtime during resizing: scaling up or down virtual machines requires stopping the instance for reconfiguration.",
          "Steep financial cost curve: top-tier mega-instances exhibit non-linear pricing per compute unit compared to commodity hardware."
        ],
        avoid: [
          "Never rely on a single vertically scaled machine for mission-critical production without an automated standby replica for failover.",
          "Never vertically scale to compensate for missing database indexes, N+1 queries, or unbounded memory leaks.",
          "Never scale up indefinitely without planning a horizontal scaling or sharding migration path before hitting hardware limits.",
          "Never forget to tune database memory configurations (`shared_buffers`, `innodb_buffer_pool_size`) after upgrading RAM."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "statelessness",

      why: {
        before: "Web applications stored user login credentials, shopping cart items, multi-step wizards, and uploaded files directly in the web server's local RAM or local filesystem; adding a second server behind a load balancer broke user sessions, and any server reboot logged out thousands of active customers.",
        problem: "Modern cloud platforms require elastic auto-scaling, instantaneous rolling deployments, and container orchestration where instances can be destroyed, restarted, or multiplied dynamically without impacting user sessions.",
        shift: "**Statelessness: A design principle where a service processes each incoming request using only the information provided within the request itself or retrieved from an external, shared state store.** Codified in the Twelve-Factor App methodology, statelessness enables effortless horizontal scaling and crash-resilient infrastructure."
      },

      num: {
        t: "Architectural Comparison: Stateful vs Stateless Service Architecture",
        h: ["Dimension", "Stateful Architecture", "Stateless Architecture", "Auto-Scaling Elasticity", "Crash Recovery Mechanics"],
        r: [
          ["Session State Location", "Web server process memory (Heap / RAM)", "Externalized shared store (Redis, Database)", "Trivial (new nodes handle any request immediately)", "Instantaneous (crashed node replaced with zero data loss)"],
          ["Load Balancing Mechanism", "Requires Sticky Sessions (Session Affinity)", "Pure Round-Robin, Least Connections, Random", "Instantaneous traffic rebalancing across cluster", "Users pinned to crashed node lose session entirely"],
          ["Deployment Strategy", "Downtime required or complex session draining", "Seamless zero-downtime rolling deployments", "Zero session disruption during container rollout", "Users must re-login if node is recycled"],
          ["File Upload Handling", "Saved to local server hard drive (`/uploads`)", "Streamed directly to Object Storage (S3, GCS)", "Any node reads shared S3 bucket URL", "Files on crashed local disk are permanently lost"]
        ],
        n: "Statelessness does not mean state ceases to exist; rather, it dictates that **state is externalized from the execution process**. Under the **Twelve-Factor App** methodology (Factor 6: 'Processes - Execute the app as one or more stateless processes'), any request must be capable of being processed by *any* running instance in the fleet. Transient session state moves to an in-memory cluster (Redis), persistent business data moves to ACID databases (PostgreSQL), and media uploads stream directly to object stores (Amazon S3). When an application instance crashes or is terminated by a cloud autoscaler during off-peak hours, zero client data is lost because the ephemeral container held no authoritative state."
      },

      miss: [
        {
          w: "Stateless architecture means the application never stores any user data or database records.",
          r: "Statelessness applies strictly to the **compute tier (application servers)**. The application still maintains state, but state lives exclusively in dedicated, managed external state stores (Redis, Postgres, S3), keeping compute nodes 100% ephemeral."
        },
        {
          w: "Sticky Sessions on a load balancer are a good permanent way to scale stateful applications.",
          r: "Sticky sessions are a **temporary stopgap, not a scalable architecture**. They cause uneven load distribution (hot instances), lose all user sessions when an instance is deployed or dies, and prevent smooth autoscaling."
        },
        {
          w: "Stateless applications are always slower because they must make network calls to Redis on every request.",
          r: "While external state lookups add 0.5-1.5ms over local RAM, this minor overhead is vastly outweighed by the ability to **scale horizontally to hundreds of nodes**, perform zero-downtime rolling deployments, and achieve 99.99% availability."
        },
        {
          w: "JWTs are the only way to achieve statelessness in web applications.",
          r: "A backend using opaque session cookies backed by a shared **Redis cluster** is completely stateless from the perspective of the application servers. Any node can read and validate the session from the shared store."
        }
      ],

      trade: {
        buys: [
          "Effortless horizontal auto-scaling: dynamically spin up or terminate compute containers in response to traffic surges without dropping state.",
          "Zero-downtime rolling updates: replace application instances continuously during production releases without logging users out.",
          "Unmatched fault tolerance: if a server crashes, subsequent client requests land on healthy instances seamlessly.",
          "Simplified load balancing: traffic distributes evenly across instances using standard round-robin or least-connections algorithms."
        ],
        costs: [
          "External state store latency: querying Redis or databases adds 0.5-2ms of network traversal to authenticated requests.",
          "Infrastructure operational overhead: requires provisioning, monitoring, and scaling dedicated Redis and database clusters.",
          "Network bandwidth consumption: serializing and transferring session context over the internal network uses VPC bandwidth.",
          "Strict programming discipline: developers must never use process-global variables or local disk for business state."
        ],
        avoid: [
          "Never save uploaded files directly to local instance hard drives; stream them directly to cloud object storage (S3).",
          "Never store user authentication sessions in local process heap memory when scaling behind a load balancer.",
          "Never schedule local in-process cron jobs (e.g., node-cron) on horizontally scaled stateless instances; use distributed schedulers.",
          "Never use sticky sessions as a long-term architectural substitute for externalizing state to Redis."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
