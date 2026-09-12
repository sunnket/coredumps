/* ==========================================================================
   Depth pass 125 — Backend Architecture batch 2: API Design & Identity Foundations.
   YAML, Status Code, Pagination, API Versioning,
   Rate Limiting, Authentication, Authorisation.

   Data serialization syntax, HTTP status protocol contracts, keyset cursor traversal,
   evolutionary API lifecycle versioning, distributed token bucket rate limiting,
   and cryptographic AuthN/AuthZ access control establish backend interface robustness.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "yaml",

      why: {
        before: "Configuration files and infrastructure manifests were authored in JSON (strict syntactic noise, unquoted keys, lack of native human comments, absence of multi-line strings) or XML (overwhelming tag verbosity, bloated byte size, low legibility for human operators).",
        problem: "DevOps and cloud-native workflows require declarative, human-readable configuration files (Kubernetes manifests, CI/CD pipelines, Docker Compose, Ansible playbooks) where engineers frequently write comments, manage deep hierarchies, and embed multi-line scripts without escaping quotes.",
        shift: "**YAML (YAML Ain't Markup Language): A human-friendly data serialization language constructed around clean indentation, minimal syntactic punctuation, native comments, and rich scalar types.** Operating as a strict superset of JSON (in YAML 1.2), YAML enables complex declarative configuration while maintaining human maintainability."
      },

      num: {
        t: "Configuration & Serialization Formats: YAML vs JSON vs TOML vs HCL vs XML",
        h: ["Format", "Syntactic Structure", "Native Comments", "Parsing Speed & Complexity", "Dominant Production Domain"],
        r: [
          ["YAML", "Indentation-based whitespace hierarchy", "Yes (`# comment`)", "Slow (complex spec, type coercion hazards)", "Kubernetes manifests, CI/CD pipelines, Ansible, OpenAPI"],
          ["JSON", "Brackets, braces, quotes, comma-delimited", "No (RFC 8259 forbids comments)", "Extremely fast (native C++/browser parsers)", "API payloads, web networking, state persistence"],
          ["TOML", "INI-style tables with explicit keys (`[table]`)", "Yes (`# comment`)", "Fast (minimal ambiguity, strict typing)", "Rust Cargo, Python pyproject.toml, Go toolchain"],
          ["HCL (HashiCorp)", "Block-based declarative DSL (`resource \"type\" \"name\"`)", "Yes (`#`, `//`, `/* */`)", "Fast (tailored AST with expressions/functions)", "Terraform, Nomad, Consul infrastructure-as-code"],
          ["XML", "Angle-bracket element pairs (`<tag>...</tag>`)", "Yes (`<!-- comment -->`)", "Moderate (heavy DOM/SAX tree allocation)", "SOAP web services, enterprise Java/Maven, Android manifests"]
        ],
        n: "YAML 1.2 defines a graph model mapping scalars (strings, integers, floats, booleans, timestamps), sequences (ordered lists `- item`), and mappings (`key: value`). However, YAML's extensive syntactic features introduce serious engineering pitfalls: (1) **The Norway Problem**: unquoted tokens like `no`, `yes`, `on`, `off`, `true`, `false` are parsed into boolean primitives by YAML 1.1 parsers, notoriously coercing country code `NO` (Norway) into boolean `false`; (2) **Arbitrary Code Execution**: unsafe deserializers (such as Python's legacy `yaml.load()`) evaluate custom language tags (e.g., `!!python/object/apply`) enabling Remote Code Execution (RCE), mandating `yaml.safe_load()`; and (3) **Node Anchors & Aliases**: YAML supports graph structures via anchors (`&anchor`) and merge keys (`<<: *anchor`), enabling DRY configurations at the cost of exponential memory expansion attacks (Billion Laughs YAML attack)."
      },

      miss: [
        {
          w: "YAML is just JSON without curly braces and double quotes.",
          r: "YAML is an enormously complex specification with advanced features absent in JSON: **anchors (`&`) and aliases (`*`)**, merge keys (`<<`), explicit tag typecasting (`!!str 123`), multi-line scalar chomp/clip modifiers (`|`, `|-`, `|+`, `>`, `>-`), and complex mapping keys."
        },
        {
          w: "Tabs and spaces can be freely mixed as long as the indentation looks visually aligned.",
          r: "The YAML specification **strictly forbids tab characters (`\\t`) for indentation**. Using tabs causes immediate parser fatal syntax errors. All indentation must consist strictly of space characters (typically 2 spaces per indentation level)."
        },
        {
          w: "Unquoted strings in YAML are always safely treated as plain string values.",
          r: "YAML parsers aggressively coerce unquoted strings: version identifiers like `version: 1.10` become floating point `1.1`, phone numbers starting with zero `0123` become octal integers, and strings matching boolean patterns (`y`, `n`, `yes`, `no`) become booleans. **Always quote string identifiers, postal codes, and versions**."
        },
        {
          w: "YAML parsers are lightweight, pure data extractors with zero security vulnerabilities.",
          r: "YAML supports object tags (`!!`) that instruct language runtimes to instantiate arbitrary classes. Without `yaml.safe_load()` in Python or `yaml.SafeLoader`, an untrusted YAML input can instantiate system sub-processes and execute arbitrary OS shell commands."
        }
      ],

      trade: {
        buys: [
          "Extreme human readability: eliminates braces, trailing commas, and quotes for configuration files.",
          "First-class documentation: allows inline and block comments directly adjacent to critical infrastructure values.",
          "Expressive multi-line strings: clean embedding of shell scripts, SQL queries, and certificates via `|` and `>`.",
          "DRY configuration inheritance: node anchors (`&`) and aliases (`*`) prevent duplicate configuration blocks."
        ],
        costs: [
          "Parsing latency and memory footprint: YAML parsers are an order of magnitude slower than native JSON parsers.",
          "Whitespace sensitivity: invisible indentation errors and copy-paste tab characters break production deployments silently.",
          "Type coercion bugs: unquoted words (`no`, `off`, `1.20`) convert unexpectedly to booleans and truncated floats.",
          "Security attack surface: custom tags enable object deserialization vulnerabilities if safe parsing is omitted."
        ],
        avoid: [
          "Never parse untrusted user-supplied YAML without a restricted safe loader (`yaml.safe_load`).",
          "Never leave version strings (`1.0`, `1.10`) or string codes (`YES`, `NO`, `01234`) unquoted.",
          "Never use tabs for indentation in any YAML manifest or template file.",
          "Never use YAML for high-throughput, low-latency microservice inter-process communication; use JSON, Protobuf, or FlatBuffers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "status-code",

      why: {
        before: "Custom web protocols and naive RPC backends returned HTTP 200 OK for every response, burying error flags and status strings inside custom JSON payload envelopes (`{ code: -1, error: 'Unauthorized' }`).",
        problem: "When backends bury errors inside HTTP 200 responses, network intermediaries (CDNs, reverse proxies, API gateways, load balancers), browser caches, client SDKs, and automated APM metrics cannot determine whether a request succeeded, failed, was rate limited, or should be retried.",
        shift: "**HTTP Status Code: A standardized three-digit integer returned by an HTTP server indicating the specific outcome and semantics of a client's request.** Codified in RFC 9110 (and RFC 7807), status codes govern routing, caching, circuit breakers, and client retry policies."
      },

      num: {
        t: "HTTP Status Code Classes & Core Architectural Semantics (RFC 9110)",
        h: ["Range / Code", "Semantic Class", "Safe to Retry Automatically?", "Cacheable by Intermediaries?", "Primary Architectural Function"],
        r: [
          ["1xx (100, 101, 103)", "Informational", "No (Protocol transition)", "Never", "Protocol handshake (`101 Switching Protocols` for WebSocket, `103 Early Hints`)"],
          ["2xx (200, 201, 204)", "Successful", "N/A (Operation succeeded)", "Yes (Conditional on Cache-Control)", "`200 OK` (read/mutate), `201 Created` (+ Location header), `204 No Content` (DELETE/update)"],
          ["3xx (301, 304, 307)", "Redirection", "Yes (Follow Location / reuse cache)", "301/304 cacheable; 307 depends", "`301 Moved Permanently`, `304 Not Modified` (ETag validation), `307 Temporary Redirect`"],
          ["4xx (400, 401, 403, 404, 409, 422, 429)", "Client Error", "No (Request is flawed; retry will fail)", "Only 404/410 under specific headers", "`400 Bad Request`, `401 Unauthorized` (no auth), `403 Forbidden` (no permission), `409 Conflict`, `422 Unprocessable`, `429 Too Many Requests`"],
          ["5xx (500, 502, 503, 504)", "Server Error", "Yes for 502/503/504 with exponential backoff", "Never (Unless explicit short max-age)", "`500 Internal Error`, `502 Bad Gateway` (upstream crash), `503 Service Unavailable` (overload), `504 Gateway Timeout`"]
        ],
        n: "HTTP status codes establish an explicit protocol contract across distributed systems. Intermediary reverse proxies (NGINX, Cloudflare, Envoy) rely exclusively on status codes: a `503 Service Unavailable` triggers health-check failure ejections and circuit breakers; a `304 Not Modified` eliminates data transfer by referencing browser disk caches; a `429 Too Many Requests` combined with a `Retry-After: 30` header instructs client HTTP libraries to throttle requests without user intervention. Returning `200 OK` with `{ error: 'Resource Not Found' }` causes CDNs to cache error responses globally, APM dashboards (Datadog, Prometheus) to report 100% false health, and client error-handling middlewares to fail silently."
      },

      miss: [
        {
          w: "HTTP 401 Unauthorized means the user does not have permission to access the resource.",
          r: "HTTP 401 actually means **Unauthenticated** (missing, invalid, or expired credentials). If the user is successfully authenticated but lacks sufficient permission/role to perform the action, the correct status code is **403 Forbidden**."
        },
        {
          w: "HTTP 400 Bad Request should be returned for all invalid form inputs and schema validation failures.",
          r: "RFC 9110 specifies `400 Bad Request` for malformed syntax (e.g., corrupted JSON, illegal characters). When the payload is syntactically valid JSON but fails business validation rules (e.g., negative price, invalid email), **422 Unprocessable Content** (RFC 9110) is the semantic standard."
        },
        {
          w: "Returning HTTP 200 OK with an error object inside the body is acceptable if the frontend handles it.",
          r: "This is a **critical anti-pattern** (the '200 OK with error' antipattern). It corrupts CDN edge caching (caching error payloads as valid data), breaks load balancer retry logic, blinds monitoring metrics, and requires custom parsing in every client."
        },
        {
          w: "All 5xx server errors mean the backend code crashed with an unhandled exception.",
          r: "`500 Internal Server Error` indicates an unhandled server crash. However, `502 Bad Gateway` means a reverse proxy received an invalid response from upstream, `503 Service Unavailable` signals server overload or maintenance, and `504 Gateway Timeout` indicates an upstream response timeout."
        }
      ],

      trade: {
        buys: [
          "Universal protocol semantics: standard HTTP clients, browsers, CDNs, and proxies interpret outcomes without parsing bodies.",
          "Edge cache optimization: proxies automatically cache 200, 301, and 304 responses while bypassing errors.",
          "Automated APM & observability: Datadog, Prometheus, and Grafana instantly compute accurate error budgets and SLA metrics.",
          "Resilient client retries: client libraries cleanly distinguish retryable server faults (503, 429) from fatal client bugs (400, 422)."
        ],
        costs: [
          "Subtle semantic distinctions: engineering teams frequently debate 400 vs 422, 401 vs 403, and 200 vs 204.",
          "Information leakage risk: naive 500 status codes with raw stack traces leak internal database topologies to attackers.",
          "Inflexible granularity: standard 3-digit status codes cannot capture domain-specific business failure details alone.",
          "Client coupling: clients must be programmed to handle diverse 3xx, 4xx, and 5xx edge cases gracefully."
        ],
        avoid: [
          "Never return HTTP 200 OK when an operation has failed; return an appropriate 4xx or 5xx code with an RFC 7807 problem body.",
          "Never return 401 when a caller is authenticated but forbidden; use 403 Forbidden.",
          "Never omit the `Retry-After` header when returning HTTP 429 (Too Many Requests) or 503 (Service Unavailable).",
          "Never expose raw stack traces, database query logs, or internal file paths inside 500 error responses in production."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pagination",

      why: {
        before: "Databases returned all matching rows in a single unbounded query (`SELECT * FROM orders WHERE user_id = 123`); as tables grew to millions of records, single requests allocated gigabytes of memory, starved thread pools, and triggered fatal Out-Of-Memory (OOM) crashes.",
        problem: "Large datasets must be segmented into discrete pages, but naive offset pagination (`OFFSET 100000 LIMIT 20`) causes the database storage engine to read, parse, and discard 100,000 index tuples on every request ($O(N)$ degradation) while causing phantom records and missed items during concurrent writes.",
        shift: "**Pagination: The technique of dividing large dataset query results into controlled, sequential subsets (pages) to ensure constant-time retrieval, bounded memory allocation, and stable cursor traversal.** Modern APIs adopt keyset/cursor pagination to achieve predictable $O(1)$ or $O(\\log N)$ database queries."
      },

      num: {
        t: "Pagination Paradigms: Offset/Limit vs Keyset (Cursor) vs Time-Windowed",
        h: ["Strategy", "Query Syntax Example", "Database Time Complexity at Depth $N$", "Concurrent Mutation Stability", "Random Page Access (`Page 50`)"],
        r: [
          ["Offset / Limit", "`LIMIT 20 OFFSET 50000`", "$O(N)$ (scans and discards $N$ tuples)", "Unstable (drift: duplicates & missed items)", "Yes (direct mathematical jump)"],
          ["Keyset (Cursor-based)", "`WHERE (created_at, id) < ($last_time, $last_id) LIMIT 20`", "$O(\\log S + K)$ (index seek directly to cursor)", "Stable (deterministic pointer; zero drift)", "No (sequential navigation only)"],
          ["Time-Windowed Bucket", "`WHERE timestamp BETWEEN $start AND $end`", "$O(\\log S + K)$ (range scan on partition/index)", "Highly stable (immutable historical partitions)", "Yes (by selecting target date range)"],
          ["Snapshot / Session ID", "`SELECT * FROM temp_snapshot_123 LIMIT 20 OFFSET 40`", "$O(1)$ read from temp table; high storage cost", "Frozen in time (zero drift, stale data)", "Yes (arbitrary index within snapshot)"]
        ],
        n: "In offset pagination (`LIMIT $k OFFSET $n`), the database storage engine must walk $n + k$ index entries, deserialize each row tuple from disk or buffer pool, and discard the first $n$ rows. At page 10,000 (`OFFSET 200000`), response latency degrades from 2ms to over 5,000ms. Furthermore, if a new record is inserted at page 1 while a client is viewing page 2, all subsequent records shift down by one position, causing the user to see a duplicate record on page 3. In contrast, **Keyset / Cursor Pagination** encodes the composite sorting key (e.g., base64 of `{ created_at: 1718000000, id: 1042 }`). The database executes an indexed $B$-Tree seek (`WHERE (created_at, id) < (:cursor_time, :cursor_id) ORDER BY created_at DESC, id DESC LIMIT 20`), executing in constant logarithmic time regardless of whether the client requests page 1 or page 50,000."
      },

      miss: [
        {
          w: "Offset pagination is fine for production as long as the sorting column is indexed.",
          r: "Even with a composite $B$-Tree index, the database engine **must still traverse every single index leaf entry up to the offset value**. `OFFSET 500000` forces the database to traverse 500,000 index pointers before returning the 20 requested rows, consuming heavy CPU and I/O."
        },
        {
          w: "Cursor pagination only works when sorting by a strictly unique auto-incrementing integer ID.",
          r: "Cursor pagination works on any column (e.g., `created_at`, `price`, `last_name`) by using a **composite cursor tie-breaker**: `ORDER BY created_at DESC, id DESC` and `WHERE (created_at, id) < (:time, :id)`. The unique secondary column guarantees total ordering."
        },
        {
          w: "Clients should compute and construct their own pagination cursors manually.",
          r: "Clients should never parse or generate cursor internals. The server must return an opaque cursor token (e.g., base64-encoded binary or encrypted string) inside `links.next` or `page_info.end_cursor`, allowing the backend to alter internal indexing without breaking callers."
        },
        {
          w: "Infinite scroll UIs can simply use offset pagination because users rarely scroll far.",
          r: "Infinite scroll triggers high-frequency concurrent writes: as users scroll down social media feeds, new posts arrive at the top continuously. Offset pagination causes duplicate items to appear repeatedly in the feed and skips fresh posts entirely."
        }
      ],

      trade: {
        buys: [
          "Constant query latency: cursor pagination guarantees $O(\\log S + K)$ index seek time regardless of pagination depth.",
          "Write resilience: prevents duplicate items and missed rows when items are created or deleted during client scrolling.",
          "Bounded server memory: protects backend runtimes and databases from runaway full-table memory allocation.",
          "Optimized network payloads: streams data in small, predictable, cacheable chunks with bounded serialization cost."
        ],
        costs: [
          "Loss of arbitrary page jumping: cursor pagination cannot jump directly to 'Page 47'; users must traverse sequentially.",
          "Sorting constraints: requires deterministic sorting on unique columns or composite keys with secondary unique tie-breakers.",
          "Complex bi-directional navigation: navigating backwards ('previous page') requires inverting sort orders and re-reversing results.",
          "Total count overhead: calculating `total_count` requires an expensive separate `COUNT(*)` query that negates cursor benefits."
        ],
        avoid: [
          "Never run `SELECT COUNT(*)` on multi-million row tables just to display total page numbers alongside cursor queries.",
          "Never expose raw SQL statements or unencrypted sensitive database IDs in plain-text client pagination cursors.",
          "Never permit unbounded `limit` query parameters from clients; always enforce a strict server-side maximum (e.g., `max_limit = 100`).",
          "Never use offset pagination for public high-volume APIs or infinite-scroll mobile feeds."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "api-versioning",

      why: {
        before: "Backend teams deployed API changes directly to live production endpoints, modifying JSON field types, renaming keys, or removing properties; existing mobile apps installed on customer phones crashed immediately upon opening.",
        problem: "Public and internal APIs must evolve continuously to support new business capabilities, but breaking changes deployed without isolation instantly destroy downstream consumer integrations and invalidate third-party software contracts.",
        shift: "**API Versioning: The disciplined architectural practice of managing changes to an API interface contract so existing clients continue functioning uninterrupted while new clients adopt evolved capabilities.** Spanning URI path, HTTP header, query parameter, and content-negotiation strategies, versioning enforces predictable lifecycle deprecation."
      },

      num: {
        t: "API Versioning Strategies: Comparative Architectural Trade-offs",
        h: ["Strategy", "Syntax Example", "Visibility & Discoverability", "CDN / HTTP Caching Simplicity", "Server Routing Complexity"],
        r: [
          ["URI Path", "`GET /v1/users`, `GET /v2/users`", "High (explicit in URL, simple documentation)", "Trivial (unique cache key per URL)", "Low (standard reverse-proxy path routing)"],
          ["Custom Request Header", "`GET /users` + `X-API-Version: 2`", "Moderate (hidden from browser URL bar)", "Complex (requires `Vary: X-API-Version`)", "Moderate (requires header inspection in router)"],
          ["Accept Header (Content Negotiation)", "`Accept: application/vnd.myapi.v2+json`", "Low (REST purist, invisible in links)", "Complex (requires strict `Vary: Accept`)", "High (complex media type parsers in middleware)"],
          ["Date-based Versioning (Stripe style)", "`Stripe-Version: 2026-09-01`", "High (developer dashboard pinned to date)", "Requires header-based caching or private API", "High (requires transformation pipeline / backports)"]
        ],
        n: "An API change is classified as either **Non-breaking (additive)** or **Breaking**. Non-breaking changes include adding new optional request parameters, adding new fields to a JSON response, or introducing new endpoints. Breaking changes include removing an existing field, renaming a field (`user_name` to `username`), changing a data type (string to array), altering HTTP status codes, or tightening request validation rules. Under **Hyrum's Law**, with a sufficient number of consumers, every observable behavior of your API will be depended upon by someone. Production engineering standards require publishing a formal **Deprecation Policy**, instrumenting telemetry to track active traffic per version, and signaling impending retirement using the standard `Sunset: Wed, 11 Nov 2026 00:00:00 GMT` and `Deprecation: @1762819200` HTTP response headers (RFC 8594)."
      },

      miss: [
        {
          w: "Every API change requires incrementing the API version number.",
          r: "Additive changes (adding a new endpoint, adding optional fields to a request, adding new properties to a response) are **non-breaking** and should never trigger a major version bump. Version bumps should only occur for breaking contract changes."
        },
        {
          w: "URL path versioning (`/v1/`, `/v2/`) violates REST principles and should never be used.",
          r: "While academic REST purists argue for Content Negotiation via `Accept` headers, **URI path versioning is the overwhelming industry standard** (used by Google, AWS, Twitter, Stripe). It is explicit, easily tested with `curl`, straightforward to route at reverse proxies, and trivially cached by CDNs."
        },
        {
          w: "Once a new API version is released, the old version can be decommissioned immediately.",
          r: "Decommissioning an API requires a lengthy **deprecation window** (often 6 to 24 months). Mobile app users do not update their apps immediately, and enterprise B2B partners require long migration cycles. Telemetry must verify zero traffic before endpoint termination."
        },
        {
          w: "Supporting multiple API versions requires duplicating the entire application codebase and database.",
          r: "Maintaining duplicate codebases leads to massive tech debt and security vulnerabilities. Modern architectures use **in-flight transformation pipelines** (like Stripe) where database models remain unified, and request/response adapters translate between version schemas."
        }
      ],

      trade: {
        buys: [
          "Zero client disruption: legacy mobile applications and third-party partner integrations run uninterrupted.",
          "Independent deployment cycles: backend teams can refactor data contracts without coordinating synchronized client releases.",
          "Controlled feature rollout: enables progressive migration of client cohorts to modern endpoints.",
          "Explicit deprecation timelines: formal HTTP sunset headers give consumers unambiguous migration deadlines."
        ],
        costs: [
          "Maintenance overhead: engineering teams must maintain, test, and patch multiple concurrent API versions.",
          "Codebase complexity: adapter layers, translation middleware, and conditional logic clutter backend request pipelines.",
          "Database migration friction: database column drops must be deferred until the oldest dependent API version is retired.",
          "Documentation bloat: API documentation must accurately display schemas and examples across all active versions."
        ],
        avoid: [
          "Never release a breaking change under an existing API version; always increment the version or use date pinning.",
          "Never maintain more than 2-3 active API versions concurrently; enforce strict deprecation and sunset schedules.",
          "Never omit `Sunset` (RFC 8594) and `Deprecation` response headers when clients invoke deprecated endpoints.",
          "Never fork entire application codebases per version; implement adapter layers over a unified core domain model."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rate-limiting",

      why: {
        before: "APIs accepted unlimited inbound requests from any IP or API key; a single runaway client script, scraper bot, or malicious DoS flood consumed all available database connections, starving legitimate users and crashing production clusters.",
        problem: "Backend services possess finite CPU, memory, thread pool, and downstream database capacities; without protective rate governance, distributed systems succumb to cascading failures, noisy-neighbor tenant exhaustion, and catastrophic cloud billing spikes.",
        shift: "**Rate Limiting: The operational practice of tracking and capping the rate of incoming requests from a client, IP, or tenant over a specified time window.** Enforcing HTTP 429 Too Many Requests with standardized headers, rate limiting guarantees service availability and fair multi-tenant resource distribution."
      },

      num: {
        t: "Rate Limiting Algorithms: Operational Mechanics & Trade-offs",
        h: ["Algorithm", "Burst Capacity Handling", "Memory Footprint per Client/Key", "Edge Concurrency Precision", "Distributed Implementation Complexity"],
        r: [
          ["Token Bucket", "Excellent (bursts up to bucket capacity $b$)", "Minimal (stores 2 numbers: token count, last timestamp)", "High (atomic Redis Lua script)", "Low (standard Redis token decrement)"],
          ["Leaky Bucket", "Zero (enforces strict constant egress rate)", "Minimal (stores current water level and last leak time)", "High (smooths out jitter and bursts)", "Low to Moderate"],
          ["Fixed Window Counter", "High risk (allows $2\\times$ burst at window boundary)", "Extremely low (single integer counter with TTL)", "Poor (bursts at boundary reset bypass limit)", "Trivial (`INCR` + `EXPIRE` in Redis)"],
          ["Sliding Window Log", "Perfect (exact sliding time range)", "Extremely high (stores timestamp for every single request)", "Absolute (exact down to millisecond)", "High (Redis Sorted Sets `ZREMRANGEBYSCORE` + `ZCARD`)"],
          ["Sliding Window Counter", "Very good (interpolates previous & current window)", "Very low (stores 2 integer counters)", "High (~99.5% accuracy without logging individual calls)", "Moderate (weighted sum of window percentages)"]
        ],
        n: "Rate limiting is implemented using five primary algorithms. The **Token Bucket** algorithm maintains a bucket of capacity $b$ replenished with tokens at rate $r$ tokens/second. When a request arrives, if tokens $\\ge 1$, the token is consumed and the request proceeds; otherwise, it is rejected with `429 Too Many Requests`. In distributed systems running across multiple API gateway nodes, rate limit state must be centralized in an in-memory datastore like Redis using atomic Lua scripts (`evalsha`) to avoid race conditions. Standard RFC 6585 and IETF draft headers must accompany every response: `RateLimit-Limit: 100`, `RateLimit-Remaining: 24`, `RateLimit-Reset: 1718000060`, and `Retry-After: 36` when throttled."
      },

      miss: [
        {
          w: "Rate limiting by client IP address alone is sufficient to protect a public web API.",
          r: "IP-based rate limiting fails because thousands of corporate or university users share single NAT gateway IP addresses, while malicious botnets distribute attacks across millions of residential proxy IPs. **Production APIs rate-limit by authenticated API Key, User ID, or Tenant ID**, reserving IP limiting as a fallback for unauthenticated routes."
        },
        {
          w: "Fixed window counter is the best algorithm because it is the simplest to implement.",
          r: "Fixed window counters suffer from the **Boundary Burst Problem**: if the limit is 100 req/min, an attacker can send 100 requests at 00:59 and another 100 requests at 01:01, successfully delivering 200 requests within a 2-second interval and crashing downstream services."
        },
        {
          w: "Rate limiting should always be implemented inside the application business logic code.",
          r: "Executing application code, ORM queries, or database connections before enforcing rate limits exhausts server thread pools during an attack. **Rate limiting must execute as early as possible** at the API Gateway, reverse proxy (NGINX/Envoy), or Cloudflare edge."
        },
        {
          w: "When a client is rate limited, the server should return HTTP 403 Forbidden.",
          r: "403 Forbidden indicates an authorization permission denial that will not change on retry. Throttled requests must return **HTTP 429 Too Many Requests** accompanied by a `Retry-After` header specifying how many seconds to wait."
        }
      ],

      trade: {
        buys: [
          "Resilience against Denial of Service: prevents malicious floods and accidental infinite client loops from taking down services.",
          "Fair multi-tenant resource sharing: stops noisy neighbors from monopolizing database connection pools and compute threads.",
          "Monetization and tiering: enables SaaS subscription tiers (e.g., Free: 60 req/min, Pro: 1,000 req/min, Enterprise: 10,000 req/min).",
          "Cascading failure prevention: protects downstream legacy systems and third-party APIs from overload."
        ],
        costs: [
          "Infrastructure latency: centralized state lookups in Redis introduce 1-3ms network overhead per HTTP request.",
          "Single point of failure: if the distributed cache (Redis) goes down, the gateway must choose between failing open or closed.",
          "Client integration complexity: client SDKs must implement jittered exponential backoff and parse rate limit headers.",
          "Legitimate traffic throttling: sudden legitimate viral traffic surges may be mistakenly rejected without burst headroom."
        ],
        avoid: [
          "Never rate-limit without returning the `Retry-After` header in 429 responses; clients will hammer the server blindly.",
          "Never rely on in-memory process-local counters when running multiple horizontally scaled application instances.",
          "Never perform non-atomic read-then-write counter checks in Redis; always use atomic Lua scripts or transactions.",
          "Never fail-closed during rate-limiter infrastructure outages for critical tier-1 revenue-generating endpoints."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "authentication",

      why: {
        before: "Early networks relied on IP address whitelisting or unencrypted cleartext passwords transmitted in custom HTTP headers, leaving systems open to packet sniffing, replay attacks, and trivial identity spoofing.",
        problem: "Modern web and cloud architectures require a cryptographically rigorous mechanism to verify the claimed identity of a user, service, or machine without transmitting reversible credentials or trusting client-side claims.",
        shift: "**Authentication (AuthN): The process of verifying the identity of a user, process, or device attempting to access a system.** Distinguishing 'who you are' from 'what you are allowed to do', modern AuthN spans salted password hashes, multi-factor challenges (MFA/WebAuthn), and signed identity tokens."
      },

      num: {
        t: "Authentication Architectures: Stateful Sessions vs Stateless Tokens vs Public-Key Passkeys",
        h: ["Mechanism", "Credential Format", "Server-Side State Storage", "Revocation Speed & Simplicity", "Optimal Production Domain"],
        r: [
          ["HTTP Basic Auth", "Base64-encoded `username:password`", "None (checked against DB on every request)", "Requires changing password", "Internal dev tools, legacy webhooks, metrics endpoints"],
          ["Stateful Session Cookies", "Opaque random string (64+ bits entropy)", "In-memory datastore (Redis / DB session table)", "Instant (delete session row from Redis)", "Monolithic web apps, traditional browser-first SaaS"],
          ["Stateless Signed Tokens (JWT)", "Cryptographic base64 JSON payload", "None (validated via public/secret signature)", "Difficult (requires blocklist or short TTLs)", "Distributed microservices, mobile apps, SPA APIs"],
          ["mTLS (Mutual TLS)", "X.509 Client & Server Certificates", "None (verified in TLS cryptographic handshake)", "Moderate (CRL / OCSP certificate revocation)", "Zero-trust microservice-to-microservice mesh"],
          ["FIDO2 / WebAuthn Passkeys", "Asymmetric public/private keypair", "Public key stored in DB; private in hardware", "Instant (disable public key record in DB)", "Phishing-resistant consumer & enterprise modern web login"]
        ],
        n: "Authentication operates across three classical factors: (1) **Something you know** (passwords, PINs), (2) **Something you have** (hardware security keys, TOTP authenticator apps, SMS/email tokens), and (3) **Something you are** (biometrics, fingerprints, facial recognition). In password-based authentication, passwords MUST NEVER be stored in plain text or encrypted with reversible ciphers. They must be hashed using computationally heavy, memory-hard adaptive hashing algorithms: **Argon2id** (winner of the Password Hashing Competition), **bcrypt**, or **scrypt**, with a unique cryptographically random salt per user to defeat precomputed rainbow table attacks. Combining multiple factors (MFA via RFC 6238 TOTP or FIDO2 WebAuthn) neutralizes credential-stuffing and phishing attacks."
      },

      miss: [
        {
          w: "Hashing passwords with SHA-256 or SHA-512 with a salt is secure enough for production.",
          r: "SHA-256 and SHA-512 are designed for maximum throughput; modern GPUs can compute over **10 billion SHA-256 hashes per second**, making brute-force cracking trivial. Password hashing mandates **memory-hard, computationally expensive algorithms** like Argon2id, bcrypt, or scrypt."
        },
        {
          w: "Authentication and Authorization are synonyms and can be handled by the same component.",
          r: "They solve fundamentally different problems: **Authentication (AuthN)** verifies identity ('Who are you?'), whereas **Authorization (AuthZ)** determines permissions ('Are you permitted to delete order #42?'). Authenticating a user does not grant them administrative rights."
        },
        {
          w: "Stateless JWT tokens eliminate the need for server-side authentication databases completely.",
          r: "Purely stateless JWTs cannot be revoked if compromised before their expiration time. Real-world secure JWT systems must maintain token revocation blocklists in Redis or enforce short token lifetimes (5-15 min) paired with stateful refresh tokens stored in a database."
        },
        {
          w: "Storing authentication session tokens in browser `localStorage` is safe if HTTPS is enabled.",
          r: "`localStorage` is directly accessible by any JavaScript running on the origin. If your application has a single Cross-Site Scripting (XSS) vulnerability, an attacker can extract all tokens. Session tokens should be stored in **`HttpOnly`, `Secure`, `SameSite=Strict` cookies**."
        }
      ],

      trade: {
        buys: [
          "Verifiable identity integrity: guarantees that operations are linked to authenticated users or verified machine identities.",
          "Protection against impersonation: salted adaptive hashes and MFA protect accounts against credential stuffing and brute force.",
          "Audit compliance: satisfies SOC 2, HIPAA, PCI-DSS, and ISO 27001 regulatory identity verification mandates.",
          "Single Sign-On federation: enables integration with enterprise identity providers (Okta, Google, Azure AD) via SAML/OIDC."
        ],
        costs: [
          "Computational overhead: Argon2id and bcrypt intentionally consume significant server CPU and memory during login hashing.",
          "Session synchronization latency: querying session stores (Redis) adds network latency to every authenticated request.",
          "Account recovery vulnerability: password resets and account recovery flows introduce high-risk social engineering attack vectors.",
          "User friction: requiring multi-factor authentication and frequent re-authentication increases login drop-off."
        ],
        avoid: [
          "Never store passwords using MD5, SHA-1, SHA-256, or SHA-512; use Argon2id or bcrypt.",
          "Never store sensitive auth tokens in browser `localStorage` or `sessionStorage`; use `HttpOnly`, `Secure` cookies.",
          "Never transmit credentials over unencrypted HTTP; enforce HTTPS with HSTS (HTTP Strict Transport Security).",
          "Never allow unlimited consecutive failed login attempts; enforce progressive lockouts or CAPTCHAs to stop brute-forcing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "authorisation",

      why: {
        before: "Applications verified only that a user was logged in, assuming any authenticated user could invoke any endpoint; users could tamper with URL parameters (`/api/orders/1042` to `/api/orders/1043`) to view and modify other customers' private data.",
        problem: "Authenticating identity (AuthN) does not determine what resources an entity can read, edit, or delete; lacking granular, server-side authorization leads directly to Insecure Direct Object References (IDOR) and catastrophic privilege escalation breaches.",
        shift: "**Authorisation (AuthZ): The security mechanism that determines whether an authenticated identity has permission to perform a specific action on a specific resource.** Enforced via RBAC, ABAC, or ReBAC, authorization operates as a non-negotiable server-side boundary."
      },

      num: {
        t: "Authorization Access Control Paradigms: Comparative Architecture",
        h: ["Access Control Model", "Core Decision Logic", "Contextual Awareness (Time/IP/Geo)", "Scalability with Enterprise Complexity", "Optimal Production Domain"],
        r: [
          ["RBAC (Role-Based Access Control)", "Permissions mapped to Roles (`admin`, `editor`); Roles assigned to Users", "None (static role assignments)", "Poor (leads to 'role explosion' with many permissions)", "Standard SaaS apps, basic internal dashboards, CMS"],
          ["ABAC (Attribute-Based Access Control)", "Boolean policies evaluating User, Resource, and Environmental attributes", "Complete (evaluates IP, time, device health, department)", "High (flexible dynamic rules without multiplying roles)", "Enterprise healthcare, banking, government zero-trust"],
          ["ReBAC (Relationship-Based Access Control)", "Graph traversal of relations (`user` -> `member of group` -> `viewer of doc`)", "Moderate (relational graph structure)", "Extremely high (modeled after Google Zanzibar)", "Google Docs sharing, GitHub organization/repo permissions"],
          ["PBAC (Policy-Based / OPA Rego)", "Decoupled declarative code policies evaluated by dedicated engine", "Complete (declarative policy as code)", "Extremely high (centralized governance across microservices)", "Kubernetes admission controllers, service mesh routing"]
        ],
        n: "Authorization must be evaluated on **every single request at the server layer**, entirely independent of frontend UI state. Hiding a 'Delete' button in a React dashboard provides zero security if the underlying endpoint (`DELETE /api/v1/projects/:id`) accepts requests without validating permissions. The most prevalent web vulnerability is **Insecure Direct Object Reference (IDOR)**, where an authenticated user changes an entity ID to manipulate another user's record. Mitigating IDOR requires enforcing ownership scopes in data queries (`SELECT * FROM invoices WHERE id = :invoice_id AND tenant_id = :current_user_tenant_id`). In microservice architectures, authorization is decoupled using **Policy Decision Points (PDP)** such as Open Policy Agent (OPA) with Rego or Zanzibar-inspired relation graphs (Ory Keto, Auth0 Fine-Grained Authorization)."
      },

      miss: [
        {
          w: "Hiding unauthorized buttons and menu items in the frontend UI secures the application.",
          r: "Frontend UI controls are purely cosmetic for user experience. Any user can open Chrome DevTools, extract their auth token, and send arbitrary HTTP requests directly to backend endpoints. **Authorization must be strictly enforced on the server for every endpoint**."
        },
        {
          w: "Checking if the user has the 'User' role is sufficient to permit updating a user profile.",
          r: "This creates an **IDOR vulnerability**: any authenticated user with the 'User' role could update *anyone else's* profile. The authorization check must verify **resource ownership**: `current_user.id === target_resource.owner_id` or tenant multi-tenancy boundaries."
        },
        {
          w: "Role-Based Access Control (RBAC) scales cleanly to any enterprise system.",
          r: "RBAC suffers from **Role Explosion**: as requirements grow (e.g., 'regional manager who can approve purchases over $5,000 only on weekdays'), systems end up with thousands of hyper-specific roles (`Manager_US_East_Approval_Tier2`), becoming unmaintainable. Dynamic systems require **ABAC** or **ReBAC**."
        },
        {
          w: "Authorization tokens (like JWTs with embedded roles) never need server-side validation.",
          r: "JWT claims are frozen at token generation time. If an employee is revoked or their permissions are downgraded, their active JWT remains valid until expiration unless the server verifies permission state against a live authorization store or revokes tokens."
        }
      ],

      trade: {
        buys: [
          "Data privacy and multi-tenant isolation: guarantees that users and organizations can never access each other's data.",
          "IDOR and privilege escalation defense: stops malicious actors from tampering with object identifiers in API calls.",
          "Compliance and governance: satisfies GDPR, HIPAA, and SOC 2 requirements for strict least-privilege access controls.",
          "Audit trail traceability: enables clear logging of which identity accessed or altered specific sensitive resources."
        ],
        costs: [
          "Query complexity and latency: filtering data by tenant and permissions requires complex database joins and index overhead.",
          "Maintenance complexity: policy definitions, role matrices, and attribute rules require continuous testing and audits.",
          "Cache invalidation challenges: caching personalized or permissioned responses at the CDN edge requires complex cache keying.",
          "Performance bottlenecks: evaluating complex ABAC or Zanzibar graph queries on high-throughput read paths adds latency."
        ],
        avoid: [
          "Never rely on client-side authorization checks alone; enforce every rule on the backend.",
          "Never perform database updates using solely the client-provided ID (`UPDATE orders SET status = ... WHERE id = :id`); always scope by owner/tenant (`WHERE id = :id AND user_id = :user_id`).",
          "Never hardcode role authorization checks throughout business logic; use centralized middleware or policy guards.",
          "Never assign permissions directly to users; assign permissions to roles or define relationship policies to prevent permission drift."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
