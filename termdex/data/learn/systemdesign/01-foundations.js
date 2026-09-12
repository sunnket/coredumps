/* System Design — Scaling, Load Balancing & Traffic Routing. */
TD.addLessons("systemdesign", [

    {
        t: "Vertical vs Horizontal Scaling & The Bottlenecks of Scale",
        m: "foundations",
        lvl: "core",
        s: "Scale-up vs scale-out, state externalisation, and back-of-the-envelope capacity estimations.",
        goal: [
            "Calculate system capacity (QPS, storage, bandwidth) from rough business metrics",
            "Identify the physical boundaries of vertical scaling and when horizontal scaling is required",
            "Decouple state from compute instances to enable true stateless horizontal scaling"
        ],
        b: [
            { p: "Every system starts on a single box. When traffic spikes 100x, you face the fundamental fork: buy a bigger machine (**Vertical Scaling / Scale-Up**) or buy many smaller machines (**Horizontal Scaling / Scale-Out**). Understanding the physical and economic boundaries of both is the foundation of distributed architecture." },

            { h: "Vertical vs Horizontal: The Trade-off Matrix" },
            {
                tbl: {
                    t: "Vertical scaling vs Horizontal scaling comparison",
                    h: ["Dimension", "Vertical Scaling (Scale-Up)", "Horizontal Scaling (Scale-Out)"],
                    rows: [
                        ["**Hardware Limit**", "Hard physical ceiling (e.g. 128 cores, 4TB RAM)", "Virtually unlimited (thousands of commodity nodes)"],
                        ["**Downtime**", "Requires reboot/maintenance window to resize", "Zero-downtime rolling updates & auto-scaling"],
                        ["**Fault Tolerance**", "Single Point of Failure (SPOF) — node dies = system down", "Resilient — failing node is removed by load balancer"],
                        ["**Application Complexity**", "None — standard multi-threaded code", "High — requires statelessness, network RPCs, data partitioning"],
                        ["**Cost Curve**", "Exponential at the high end (specialist mainframe hardware)", "Linear (pay for commodity VM/container capacity)"]
                    ]
                }
            },

            { h: "Step 1: Back-of-the-Envelope Estimation" },
            { p: "Before drawing any boxes on a whiteboard, you must convert business numbers into engineering numbers: **QPS**, **Peak QPS**, **Bandwidth (Ingress/Egress)**, and **Storage over 5 years**." },

            {
                code: {
                    lang: "python", t: "Standard Capacity Estimation Math",
                    lines: [
                        { c: "# Given: 100 Million Daily Active Users (DAU), 10 requests/user/day", w: "" },
                        { c: "total_requests = 100_000_000 * 10  # 1 Billion requests / day", w: "" },
                        { c: "seconds_per_day = 86_400", w: "" },
                        { c: "", w: "" },
                        { c: "# 1. Average QPS (Queries Per Second)", w: "" },
                        { c: "avg_qps = total_requests / seconds_per_day", w: "**~11,574 QPS average**", hi: true },
                        { c: "", w: "" },
                        { c: "# 2. Peak QPS (Rule of thumb: 2x to 3x average traffic)", w: "" },
                        { c: "peak_qps = avg_qps * 2.5", w: "**~28,935 Peak QPS**", hi: true },
                        { c: "", w: "" },
                        { c: "# 3. Storage Estimation: 2KB per request payload", w: "" },
                        { c: "daily_storage_bytes = total_requests * 2_000  # 2 TB / day", w: "" },
                        { c: "five_year_storage_tb = (2 * 365 * 5)", w: "**3,650 TB = 3.65 Petabytes**", hi: true },
                        { c: "", w: "" },
                        { c: "# 4. Bandwidth: Ingress (incoming) & Egress (outgoing)", w: "" },
                        { c: "ingress_mb_per_sec = (peak_qps * 2_000) / (1024 * 1024)", w: "**~55 MB/s (~440 Mbps)**", hi: true }
                    ]
                }
            },

            { h: "The Golden Rule: Externalise State" },
            { p: "Horizontal scaling fails if application servers store session state, uploaded files, or in-memory caches locally. If User A logs in on Server 1 and their next click hits Server 2, they will be logged out unless session state is stored in a shared, fast store like **Redis** or a stateless token (**JWT**)." },

            { trap: "Relying on 'Sticky Sessions' (Session Affinity) to route a user to the same server is an anti-pattern for scaling. If Server 1 dies, all its active users lose their sessions. Always externalise state to a distributed cache." },

            {
                tryit: {
                    t: "Calculate Video Platform Storage & Bandwidth",
                    task: "A video platform has 10M DAU. 1% upload 1 video per day (average size 50MB). 99% watch 5 videos per day (average 50MB streamed). Calculate daily storage added and peak egress bandwidth in Gbps (assume peak is 2x average).",
                    hint: "Uploads = 10M * 1% = 100K videos. Views = 10M * 99% * 5 = 49.5M views. Egress bytes = 49.5M * 50MB.",
                    sol: { lang: "python", code: "# Storage Added Daily:\nuploads = 100_000 * 50_000_000  # 5 TB / day\n# Egress Bandwidth:\nviews = 49_500_000\ntotal_bytes = views * 50_000_000  # 2.475 Petabytes / day\navg_bytes_per_sec = total_bytes / 86400  # 28.64 GB/s\npeak_gbps = (avg_bytes_per_sec * 8 * 2) / 1e9  # ~458 Gbps Peak" },
                    w: "Notice how storage scales linearly while bandwidth demands require a geo-distributed CDN edge network."
                }
            },

            { vocab: ["Horizontal Scaling", "Vertical Scaling", "Statelessness", "Session", "Latency", "Throughput", "Bottleneck"] }
        ],
        k: [
            "Vertical scaling is bounded by hardware ceilings and introduces single points of failure; horizontal scaling scales infinitely with commodity hardware.",
            "Always calculate QPS, Peak QPS, Bandwidth, and Storage requirements upfront before designing components.",
            "Stateless application servers externalising state to Redis/DB are mandatory for seamless horizontal scaling."
        ],
        r: ["Horizontal Scaling", "Vertical Scaling", "Statelessness", "Load Balancer", "Caching"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "avg_qps = (dau * requests_per_user) / 86400", w: "calculate average queries per second" },
                { c: "peak_qps = avg_qps * 2.5", w: "estimate peak traffic for burst headroom" },
                { c: "# Externalise session state to Redis — never rely on server memory", w: "stateless web tier architecture" }
            ]
        }
    },

    {
        t: "Load Balancing — Layer 4 vs Layer 7, Health Checks & Routing Algorithms",
        m: "foundations",
        lvl: "core",
        s: "How load balancers distribute traffic across server clusters and prevent cascading failures.",
        goal: [
            "Distinguish Layer 4 (Transport/TCP) from Layer 7 (Application/HTTP) load balancing",
            "Select the optimal load balancing algorithm (Round-Robin, Least Connections, Consistent Hashing)",
            "Configure active and passive health checks with failure thresholds"
        ],
        b: [
            { p: "A load balancer sits between clients and server pools, distributing incoming requests so no single server is overwhelmed. It is also the primary mechanism for high availability: when a backend node crashes, the load balancer removes it from rotation within milliseconds." },

            { dg: "sys-loadbalancer" },

            { h: "Layer 4 (L4) vs Layer 7 (L7) Load Balancing" },
            {
                tbl: {
                    t: "L4 vs L7 Load Balancing Comparison",
                    h: ["Feature", "L4 Load Balancer (Transport Layer)", "L7 Load Balancer (Application Layer)"],
                    rows: [
                        ["**Protocol**", "TCP / UDP (IP & Port only)", "HTTP, HTTPS, WebSockets, gRPC"],
                        ["**Inspection**", "Does NOT look into packet payload", "Inspects HTTP headers, cookies, URL paths, JSON payload"],
                        ["**Routing Logic**", "Fast IP:Port packet forwarding (NAT/DSR)", "Intelligent routing (e.g. `/api/v1/video` → Video cluster)"],
                        ["**SSL/TLS Termination**", "Usually passes encrypted TCP through", "Terminates SSL, decrypts, inspects, and re-encrypts"],
                        ["**Performance & Latency**", "Extremely high throughput, sub-millisecond", "Slightly higher compute cost per request"],
                        ["**Examples**", "AWS NLB, HAProxy (TCP mode), IPVS, LVS", "AWS ALB, Nginx, Envoy, Traefik, HAProxy (HTTP mode)"]
                    ]
                }
            },

            { h: "Load Balancing Algorithms" },
            {
                tbl: {
                    t: "Standard Load Balancing Algorithms",
                    h: ["Algorithm", "How It Works", "Ideal Use Case"],
                    rows: [
                        ["**Round Robin**", "Rotates sequentially across all servers: S1 → S2 → S3 → S1", "Identical hardware, uniform short requests"],
                        ["**Weighted Round Robin**", "Assigns weights based on server capacity (e.g. 4-core vs 16-core)", "Heterogeneous server clusters with varying CPU/RAM"],
                        ["**Least Connections**", "Routes to the server with fewest active TCP/HTTP connections", "Long-lived connections (WebSockets, SQL transactions)"],
                        ["**Least Response Time**", "Routes to the node with lowest active connections + lowest latency", "Dynamic cloud environments where node performance fluctuates"],
                        ["**IP / Hash-based**", "Hashes client IP to ensure client always hits the same node", "Stateless caches, rate limit tracking"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Weighted Round Robin Implementation in Python",
                    lines: [
                        { c: "class WeightedRoundRobin:", w: "" },
                        { c: "    def __init__(self, servers):", w: "" },
                        { c: "        # servers: [('server-1', weight=3), ('server-2', weight=1)]", w: "" },
                        { c: "        self.pool = []", w: "" },
                        { c: "        for host, weight in servers:", w: "" },
                        { c: "            self.pool.extend([host] * weight)", w: "**Expand hosts by weight.**", hi: true },
                        { c: "        self.idx = 0", w: "" },
                        { c: "", w: "" },
                        { c: "    def get_server(self):", w: "" },
                        { c: "        server = self.pool[self.idx]", w: "" },
                        { c: "        self.idx = (self.idx + 1) % len(self.pool)", w: "**Cycle safely through pool.**", hi: true },
                        { c: "        return server", w: "" },
                        { c: "", w: "" },
                        { c: "lb = WeightedRoundRobin([('srv-large', 3), ('srv-small', 1)])", w: "" },
                        { c: "print([lb.get_server() for _ in range(4)])", w: "**['srv-large', 'srv-large', 'srv-large', 'srv-small']**", hi: true }
                    ]
                }
            },

            { h: "Health Checking: Active vs Passive" },
            { p: "**Active Health Checks** send periodic probe requests (`GET /healthz`) every 5–10 seconds. If 3 consecutive probes fail, the node is marked unhealthy and removed. **Passive Health Checks** monitor live user traffic; if a server returns 5xx errors for 50% of requests over 10 seconds, it is temporarily quarantined." },

            { trap: "Health check endpoints must test the node's ability to do real work, but must NOT query the entire downstream database cluster on every probe. A database brownout causes every node's health check to fail simultaneously, causing the load balancer to drop ALL servers and take down the entire system." },

            { vocab: ["Load Balancer", "Reverse Proxy", "Health Check", "Status Code", "Statelessness"] }
        ],
        k: [
            "L4 load balancers route at the TCP level with ultra-low latency; L7 load balancers route based on HTTP headers, URLs, and cookies.",
            "Use Least Connections for long-lived WebSocket/database workloads and Weighted Round Robin for mixed-spec hardware.",
            "Isolate health checks so database blips do not cause load balancers to mark all healthy web servers as dead."
        ],
        r: ["Load Balancer", "Reverse Proxy", "Horizontal Scaling", "Health Check", "API Gateway"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "# L4 = TCP/IP packet level; L7 = HTTP path, header, cookie level", w: "L4 vs L7 core distinction" },
                { c: "health_check: interval=5s, timeout=2s, unhealthy_threshold=3", w: "standard active health check parameters" },
                { c: "least_conn = min(servers, key=lambda s: s.active_connections)", w: "least connections routing logic" }
            ]
        }
    },

    {
        t: "Reverse Proxies, API Gateways & Edge CDNs",
        m: "foundations",
        lvl: "core",
        s: "Edge acceleration, request transformation, authentication, and the Backend-For-Frontend (BFF) pattern.",
        goal: [
            "Deploy reverse proxies (Nginx/Envoy) for SSL termination, compression and security",
            "Design an API Gateway managing rate limiting, authentication, and routing",
            "Leverage Content Delivery Networks (CDNs) for static and dynamic edge caching"
        ],
        b: [
            { p: "Clients never talk directly to individual microservices. Between the user and your backend sits a layered edge infrastructure: the **CDN** at the geo-distributed perimeter, followed by the **Reverse Proxy / API Gateway** at the cluster boundary." },

            { h: "The Edge Layer Breakdown" },
            {
                tbl: {
                    t: "Edge Layer Responsibilities",
                    h: ["Layer", "Technology", "Primary Responsibilities"],
                    rows: [
                        ["**Edge CDN**", "Cloudflare, Fastly, CloudFront", "Geo-distributed DNS Anycast, DDoS mitigation, caching static assets & API responses at 300+ PoPs"],
                        ["**Reverse Proxy**", "Nginx, HAProxy, Envoy", "SSL/TLS termination, HTTP/2 to HTTP/1.1 multiplexing, Gzip/Brotli compression, IP whitelisting"],
                        ["**API Gateway**", "Kong, AWS API Gateway, Apigee", "JWT verification, user rate limiting, request validation, API version routing, telemetry / distributed trace ID injection"],
                        ["**BFF (Backend for Frontend)**", "Node.js / Go microservice", "Aggregates 5 backend microservice calls into 1 optimised JSON payload for mobile/web clients"]
                    ]
                }
            },

            {
                code: {
                    lang: "nginx", t: "Production Nginx Reverse Proxy Configuration",
                    lines: [
                        { c: "upstream backend_cluster {", w: "Define upstream server pool." },
                        { c: "    least_conn;", w: "Least connections algorithm." },
                        { c: "    server 10.0.1.10:8080 max_fails=3 fail_timeout=10s;", w: "Health tracking." },
                        { c: "    server 10.0.1.11:8080 max_fails=3 fail_timeout=10s;", w: "" },
                        { c: "    keepalive 64;", w: "**Reuse backend TCP connections.**", hi: true },
                        { c: "}", w: "" },
                        { c: "server {", w: "" },
                        { c: "    listen 443 ssl http2;", w: "SSL termination + HTTP/2." },
                        { c: "    server_name api.example.com;", w: "" },
                        { c: "    ssl_certificate /etc/ssl/cert.pem;", w: "" },
                        { c: "    ssl_certificate_key /etc/ssl/key.pem;", w: "" },
                        { c: "", w: "" },
                        { c: "    location /api/v1/ {", w: "Path-based routing." },
                        { c: "        proxy_pass http://backend_cluster;", w: "Forward request." },
                        { c: "        proxy_set_header Host $host;", w: "" },
                        { c: "        proxy_set_header X-Real-IP $remote_addr;", w: "Pass client IP." },
                        { c: "        proxy_set_header X-Request-ID $request_id;", w: "**Inject trace ID.**", hi: true },
                        { c: "    }", w: "" },
                        { c: "}", w: "" }
                    ]
                }
            },

            { h: "CDN Edge Caching Strategies" },
            { p: "CDNs cache static assets (`.js`, `.css`, `.png`) by default. For dynamic API endpoints, use `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=60`. This tells the CDN edge to cache the response for 5 minutes (`s-maxage`), serving stale data instantly while revalidating asynchronously in the background." },

            { trap: "Never terminate SSL at the gateway and send unencrypted plain HTTP over the public internet between microservices in different data centres. Use mTLS (mutual TLS) inside the service mesh for zero-trust compliance." },

            { vocab: ["Reverse Proxy", "API Gateway", "CDN", "Backend for Frontend", "Rate Limiting", "Authentication", "JWT"] }
        ],
        k: [
            "CDNs absorb 80%+ of bandwidth at the global edge; API Gateways handle auth, rate limiting and routing at the cluster edge.",
            "Offload SSL termination and compression to reverse proxies so backend application servers dedicate CPU to business logic.",
            "Use `stale-while-revalidate` on CDN headers to deliver instantaneous edge response times while refreshing cache in the background."
        ],
        r: ["Reverse Proxy", "API Gateway", "CDN", "Backend for Frontend", "Rate Limiting"],
        drill: {
            lang: "nginx",
            reps: 3,
            items: [
                { c: "proxy_set_header X-Request-ID $request_id;", w: "propagate unique trace ID to upstream services" },
                { c: "Cache-Control: public, s-maxage=300, stale-while-revalidate=60", w: "configure CDN edge caching headers" },
                { c: "upstream app_pool { least_conn; server 10.0.1.1:8080; }", w: "define upstream load-balanced server pool in Nginx" }
            ]
        }
    }

]);
