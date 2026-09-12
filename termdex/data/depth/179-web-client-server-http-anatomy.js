(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "client",
      why: {
        before: "Mainframe computing relied on dumb terminals that acted solely as video display monitors, transmitting raw keystrokes to a central mainframe that performed 100% of processing and rendering.",
        problem: "Centralized mainframes suffered from extreme network bottlenecks, single points of failure, lack of offline capabilities, and high latency for every micro-interaction and keystroke.",
        shift: "The client evolved into an autonomous, rich computational node that manages user input, local state, hardware-accelerated rendering, and client-side business logic while orchestrating network requests."
      },
      num: {
        t: "Client Paradigms, Execution Environments, and Capabilities",
        h: ["Client Archetype", "Runtime Environment", "Rendering Pipeline", "Local Storage Primitives", "Security Sandbox Model"],
        r: [
          ["Web Browser (SPA / PWA)", "Browser Engine (V8/SpiderMonkey) + DOM", "Blink/Gecko layout engine, GPU Compositor", "LocalStorage, IndexedDB, Cache Storage", "Same-Origin Policy (SOP), iframe sandboxing, CSP"],
          ["Native Mobile (iOS / Android)", "Native OS / ART / Swift Runtime", "CoreAnimation / Android View / Skia GPU", "SQLite, Keychain / Keystore, CoreData", "OS process sandboxing, app capabilities permissions"],
          ["Desktop Application (Electron)", "Chromium + Node.js runtime", "Chromium web rendering + native OS windows", "Local filesystem, SQLite, LevelDB", "Isolated Renderer process + ContextBridge IPC"],
          ["Headless / CLI Client (cURL / Fetch)", "C / POSIX socket runtime", "None (stdout byte streaming / terminal escape)", "Volatile memory buffer / local files", "User shell execution context and file permissions"],
          ["IoT / Embedded Client", "Microcontroller RTOS / Embedded Linux", "OLED / Framebuffer / Headless telemetry", "Flash memory, EEPROM, local ring buffer", "Hardware TrustZone / Secure Boot crypto"]
        ],
        n: "In the client-server architectural style (formalized by Roy Fielding), the client acts as the active initiator of state transitions. Modern clients operate as complex event-driven reactive runtimes. Within a browser client, the user interface is represented as a Document Object Model (DOM) tree. User interactions trigger asynchronous event dispatches through the browser's task queues and microtask queues: $\\text{Event} \\to \\text{Dispatch} \\to \\text{V-DOM Diff} \\to \\text{Layout} \\to \\text{Paint} \\to \\text{Composite}$. Crucially, client environments are fundamentally untrusted: while clients handle state caching, optimistic UI updates, and client-side form validation to eliminate network round-trip time (RTT), the security boundary dictates that zero authorization, validation, or pricing logic executed on the client can ever be trusted by the server."
      },
      miss: [
        {
          w: "Client-side form validation and input sanitization is sufficient to protect application security.",
          r: "The client environment is completely under the user's physical control; malicious actors can bypass any client-side JavaScript or validation rules in seconds using cURL, Postman, or proxy debuggers."
        },
        {
          w: "A client is strictly a graphical web browser like Google Chrome or Mozilla Firefox.",
          r: "Any software that initiates an outbound network connection to a server is a client: background cron jobs, terminal CLI utilities (cURL), native mobile apps, and microservices are all clients."
        },
        {
          w: "Storing sensitive authentication tokens in browser localStorage is safe from malicious scripts.",
          r: "Any script running on the page (including malicious third-party analytics, ad tags, or XSS exploits) has unrestricted read access to localStorage; sensitive tokens belong in HttpOnly, Secure, SameSite cookies."
        },
        {
          w: "Thick clients that perform heavy computations locally are always superior to thin server-driven clients.",
          r: "Heavy client-side bundles introduce massive download payloads, high memory consumption, battery drain on mobile devices, and complex client-side cache invalidation bugs."
        }
      ],
      trade: {
        buys: [
          "Instant interactive responsiveness via local state, optimistic updates, and GPU-accelerated rendering.",
          "Drastic reduction in server compute overhead by offloading UI layout, sorting, and filtering to the client device.",
          "Offline capabilities: Progressive Web Apps and native clients continue functioning during network outages.",
          "Hardware access: access to device cameras, geolocation, biometric sensors, and local file storage."
        ],
        costs: [
          "Zero trust: the server must re-validate, re-authorize, and sanitize 100% of data incoming from clients.",
          "Fragmented execution matrix: clients run on hundreds of different screen sizes, CPU speeds, and OS versions.",
          "Bundle size bloat: large client-side JavaScript applications introduce slow initial page load latency.",
          "Client-side state synchronization: managing cache invalidation and stale local state across tabs or restarts."
        ],
        avoid: [
          "Trusting any calculation, authorization check, or price calculation performed by a client.",
          "Storing sensitive private keys, database passwords, or un-scoped API keys inside client-side code.",
          "Blocking the single-threaded client UI rendering loop with heavy synchronous CPU computations.",
          "Failing to implement graceful network offline and reconnection handling on mobile clients."
        ]
      }
    },
    {
      slug: "server",
      why: {
        before: "Early software systems stored data locally on individual isolated computers, requiring physical floppy disks or tapes to synchronize records between offices and users.",
        problem: "Distributed collaboration was impossible: records diverged constantly, concurrent data updates overwrote each other, and business logic could not be updated without reinstalling software on every machine.",
        shift: "The server establishes a centralized, authoritative host daemon that listens on network ports, enforces business domain invariants, manages concurrent data persistence, and coordinates client requests."
      },
      num: {
        t: "Server Concurrency Architectures, I/O Multiplexing, and Scale Profiles",
        h: ["Concurrency Model", "Operating System Primitive", "Thread / Process Overhead", "I/O Handling Mechanism", "Ideal Workload Profile"],
        r: [
          ["Multi-Process / Pre-Fork (Apache / Postgres)", "fork(2) + socket file descriptor passing", "Heavy (~10-50 MB RAM per process)", "Blocking synchronous I/O per worker", "CPU-heavy processing with absolute fault isolation"],
          ["Thread-per-Request (Tomcat / Rails Puma)", "pthread_create / OS thread pool", "Moderate (~1-8 MB stack per thread)", "Synchronous blocking I/O on pooled threads", "Enterprise CRUD backends with predictable concurrent loads"],
          ["Event-Driven Reactor (Node.js / NGINX)", "epoll(7) / kqueue(2) / io_uring", "Ultra-light single process heap", "Non-blocking asynchronous event loop", "I/O-heavy workloads with 100,000+ concurrent connections (C10K)"],
          ["M:N Green Threads (Go / Erlang BEAM)", "Userspace scheduler multiplexed on OS threads", "Minimal (~2-4 KB initial stack per goroutine)", "Asynchronous runtime poller masquerading as blocking code", "Massive concurrency, distributed messaging, microservices"],
          ["Serverless Ephemeral Container", "Firecracker microVM / OCI Container", "Isolated container sandbox on demand", "Event-driven request lifecycle (boot, execute, freeze)", "Burst-heavy, irregular traffic; auto-scales to zero"]
        ],
        n: "A server is fundamentally a software process that binds to an IP address and transport layer port, transitioning into an active listening state via POSIX system calls: $\\text{socket}() \\to \\text{bind}() \\to \\text{listen}() \\to \\text{accept}()$. In modern high-throughput servers, handling the C10K and C100K concurrency problem relies on OS I/O multiplexing: `epoll` (Linux) or `kqueue` (macOS/BSD). Rather than dedicating an OS thread to every incoming connection, the kernel registers socket file descriptors in an internal red-black tree. When network packets arrive on the network interface card (NIC), hardware interrupts trigger the kernel to populate an $O(1)$ ready list, waking the server event loop to dispatch requests without context-switch thrashing."
      },
      miss: [
        {
          w: "A server is strictly a physical piece of rack-mounted metal computer hardware.",
          r: "A server is fundamentally a software process that listens on a network port; multiple servers (web server, database server, cache server) routinely run concurrently on a single physical host."
        },
        {
          w: "A server can accept infinite incoming concurrent client connections as long as CPU utilization is low.",
          r: "Concurrency is strictly bounded by OS file descriptor limits (nofile ulimit), socket listen backlog queues (somaxconn), TCP port exhaustion, and RAM exhaustion."
        },
        {
          w: "Serverless architectures mean there are literally no servers involved in executing code.",
          r: "Serverless abstracts server management away from the developer, but the code still executes on real physical servers running containerized microVMs managed by cloud providers."
        },
        {
          w: "Servers should always retain user session state in local server memory for speed.",
          r: "Storing session state in local server memory breaks horizontal auto-scaling and makes load balancing complex (sticky sessions); modern production servers are stateless, delegating state to Redis or databases."
        }
      ],
      trade: {
        buys: [
          "Centralized source of truth: authoritative enforcement of business logic, validations, and ACID data persistence.",
          "Total security encapsulation: proprietary algorithms and private database credentials remain hidden from clients.",
          "Seamless updates: deploy bug fixes and new features instantly without requiring user client downloads.",
          "Coordination and collaboration: enables multi-user real-time state synchronization across the globe."
        ],
        costs: [
          "Centralized point of failure: server downtime halts operations for all connected clients.",
          "Scaling complexity: handling massive traffic spikes requires load balancers, caching tiers, and database clustering.",
          "Continuous operational costs: compute, bandwidth, and database hosting bills incur ongoing monthly expenses.",
          "Geographic network latency: clients far from the server experience speed-of-light round-trip latency delays."
        ],
        avoid: [
          "Storing persistent user session state in local process memory instead of a distributed cache like Redis.",
          "Blocking an event-driven server's main thread with heavy synchronous calculations (e.g., image resizing).",
          "Leaving server socket file descriptor limits (ulimit) at low default operating system thresholds.",
          "Exposing internal database connection strings or root credentials in public server error traces."
        ]
      }
    },
    {
      slug: "request",
      why: {
        before: "Early networked computers communicated via raw, proprietary binary streams over dedicated serial connections, requiring custom parsing software for every single pair of interacting programs.",
        problem: "Without standardized communication semantics, systems could not interoperate, caching was impossible, and clients had no predictable way to express whether they wanted to read, alter, or delete data.",
        shift: "The HTTP request standardizes client-to-server messaging into a uniform, human-readable envelope specifying a method verb, target uniform resource identifier (URI), headers, and optional payload body."
      },
      num: {
        t: "HTTP Request Methods, RFC Semantics, and Wire Protocols",
        h: ["HTTP Method", "CRUD Mapping", "RFC 7231 Safe?", "RFC 7231 Idempotent?", "Typical Body Allowed?"],
        r: [
          ["GET", "Read", "Yes (No server state mutation)", "Yes ($f(x) = f(f(x))$)", "No (RFC allows, but undefined semantics)"],
          ["POST", "Create / Process", "No (State mutating)", "No (Repeated calls create duplicates)", "Yes (JSON / Form / Multipart)"],
          ["PUT", "Replace / Upsert", "No (State mutating)", "Yes (Replacing resource $N$ times is identical)", "Yes (Full resource representation)"],
          ["PATCH", "Partial Update", "No (State mutating)", "No / Conditional (RFC 5789)", "Yes (Delta changeset or JSON Patch)"],
          ["DELETE", "Delete", "No (State mutating)", "Yes (Deleting already deleted item yields same state)", "Optional (Typically empty)"],
          ["OPTIONS", "Capabilities / Preflight", "Yes (Safe read)", "Yes", "No (Preflight handshake for CORS)"]
        ],
        n: "An HTTP request represents an explicit invocation of an action on a target resource. In HTTP/1.1 wire framing (RFC 7230), a request comprises a Request-Line (Method, Request-URI, HTTP-Version), followed by CR-LF (`\\r\\n`) delimited header fields, an empty line separator, and an optional message body: $\\text{Stream} = \\text{Method} \\ \\text{URI} \\ \\text{Version} \\backslash r \\backslash n \\ [\\text{Headers}] \\backslash r \\backslash n \\backslash r \\backslash n \\ [\\text{Body}]$. RFC semantics rigorously distinguish between Safe methods (which produce zero observable server state side effects) and Idempotent methods (where the effect on server state of $N > 0$ identical requests is identical to a single request). In HTTP/2 and HTTP/3, the text framing is replaced with binary frames (HEADERS frame, DATA frame) compressed via HPACK or QPACK, multiplexing multiple concurrent requests over a single transport connection."
      },
      miss: [
        {
          w: "A GET request can safely be used to delete a record or trigger a payment as long as it passes parameters in the query string.",
          r: "GET is defined as a Safe method; web crawlers, browser prefetchers, and CDN caches automatically trigger GET requests in the background, which would cause accidental mass deletions or charges if side-effects exist."
        },
        {
          w: "PUT and POST are identical methods that can be used interchangeably for updating data.",
          r: "PUT is strictly idempotent and represents a full replacement of the target resource; POST is non-idempotent and used for creating new resources or triggering arbitrary processing."
        },
        {
          w: "The server receives the complete HTTP request body simultaneously in a single instant.",
          r: "Requests stream across TCP/IP in packets; the server reads incoming bytes asynchronously from a network buffer and may reject or abort a request before the entire payload finishes uploading."
        },
        {
          w: "Any request headers sent by a browser client can be trusted as authoritative identity verification.",
          r: "Request headers (including User-Agent, Referer, and X-Forwarded-For) are easily spoofed by any client; authentication must rely on verified cryptographic signatures (JWT, session cookies, mTLS)."
        }
      ],
      trade: {
        buys: [
          "Universal interoperability: any HTTP client in any programming language can communicate with any HTTP server.",
          "Built-in caching: HTTP intermediaries and CDNs can automatically cache safe GET requests based on RFC headers.",
          "Idempotency guarantees: clients and proxies can safely retry failed network requests for idempotent methods.",
          "Self-descriptive messaging: headers explicitly describe content formatting, authentication, and compression."
        ],
        costs: [
          "Protocol overhead: HTTP text headers introduce byte overhead on small payloads (mitigated by HTTP/2 HPACK).",
          "Latency of request-response round-trips: every request incurs network propagation and TLS latency.",
          "Risk of malicious request flooding: servers must implement rate limiting to prevent Denial-of-Service attacks.",
          "Parsing CPU consumption: servers must continuously parse incoming HTTP text streams and deserialized JSON."
        ],
        avoid: [
          "Performing state mutations (inserts, updates, deletes) in response to safe HTTP GET requests.",
          "Sending non-idempotent requests (like credit card charges) without an Idempotency-Key header.",
          "Allowing unbounded request body sizes without enforcing maximum payload limits (causing memory exhaustion).",
          "Relying on client-controlled request headers (like IP addresses) for security authorization without trusted proxy validation."
        ]
      }
    },
    {
      slug: "response",
      why: {
        before: "Early networked protocols returned unstructured, raw text or numeric exit codes without specifying data formatting, caching lifetimes, or character encoding sets.",
        problem: "Clients had no standard way to determine whether an operation succeeded, whether an error was transient or permanent, or how to parse the returned byte payload without hardcoded custom parsers.",
        shift: "The HTTP response establishes a standardized envelope containing a three-digit status code, metadata headers, and an optional body, providing unambiguous execution status and caching semantics."
      },
      num: {
        t: "HTTP Status Code Taxonomy, RFC Specifications, and Client Behaviors",
        h: ["Status Class", "Code Range", "Semantics & RFC Meaning", "Client Standard Action", "Canonical Production Example"],
        r: [
          ["1xx Informational", "100 - 199", "Request received; continuing process", "Wait for final response or upgrade socket", "101 Switching Protocols (WebSocket upgrade)"],
          ["2xx Success", "200 - 299", "Action successfully received and accepted", "Consume response payload", "200 OK, 201 Created, 204 No Content"],
          ["3xx Redirection", "300 - 399", "Further action needed to complete request", "Follow Location header URL automatically", "301 Moved Permanently, 304 Not Modified (Cache hit)"],
          ["4xx Client Error", "400 - 499", "Request contains bad syntax or unauthorized state", "Do NOT retry without modifying request", "400 Bad Request, 401 Unauthorized, 404 Not Found"],
          ["5xx Server Error", "500 - 599", "Server failed to fulfill apparently valid request", "Safe to retry with exponential backoff", "500 Internal Error, 502 Bad Gateway, 503 Unavailable"]
        ],
        n: "The HTTP response represents the server's authoritative reply to a client request. On the wire, an HTTP/1.1 response opens with the Status-Line: $\\text{HTTP-Version} \\ \\text{Status-Code} \\ \\text{Reason-Phrase} \\backslash r \\backslash n$, followed by response headers, an empty line, and the message body. In high-performance streaming architectures, responses utilize Chunked Transfer Encoding (`Transfer-Encoding: chunked`), allowing the server to stream dynamically generated data chunks prefixed by their hex size without needing to know the total `Content-Length` ahead of time. This enables modern features like Server-Sent Events (SSE) and React Server Component (RSC) streaming, allowing clients to render progressive page elements before the complete backend calculation terminates."
      },
      miss: [
        {
          w: "Returning an HTTP 200 OK containing a JSON body like `{ success: false, error: 'User not found' }` is good API design.",
          r: "This anti-pattern breaks HTTP caching, breaks CDN edge routing, breaks automated client retry libraries, and violates REST standards; errors must return appropriate 4xx or 5xx status codes."
        },
        {
          w: "HTTP 401 Unauthorized means the user lacks permission to access the requested resource.",
          r: "401 specifically means 'Unauthenticated' (the user has not proven their identity); 403 Forbidden is the status code for 'Unauthorized' (identity is known, but lacks required permissions)."
        },
        {
          w: "A 502 Bad Gateway and 504 Gateway Timeout mean that your primary application code crashed.",
          r: "502 and 504 are reverse proxy / load balancer errors: 502 means the proxy received an invalid response from upstream (or upstream was down); 504 means the upstream took too long to reply."
        },
        {
          w: "The reason phrase (like 'OK' or 'Not Found') is parsed by clients to determine success.",
          r: "RFC specifications dictate that clients must parse only the 3-digit numeric code; the human-readable text phrase is purely informative and can be altered or omitted entirely."
        }
      ],
      trade: {
        buys: [
          "Unambiguous client state handling: machines immediately know whether to retry, redirect, or display errors.",
          "Edge caching enablement: CDNs and browser caches use status codes (200 vs 404 vs 500) to control cache lifetimes.",
          "Bandwidth conservation: 304 Not Modified responses allow clients to use local disk cache with zero body download.",
          "Streaming capabilities: chunked transfer encoding enables streaming massive files or live LLM tokens."
        ],
        costs: [
          "Risk of leaking internal system details (stack traces, database engines) in unhandled 500 error response bodies.",
          "Overhead of serializing complex backend objects into JSON or Protobuf response streams.",
          "Complexity of managing compression (Gzip/Brotli) tradeoffs between CPU load and network bandwidth.",
          "Head-of-line blocking in HTTP/1.1 where responses must be returned in the exact order requested."
        ],
        avoid: [
          "Returning HTTP 200 status codes for failed business operations or server exceptions.",
          "Exposing internal database error traces or SQL queries in production error response bodies.",
          "Omitting the Content-Type header, forcing the client to guess encoding via MIME-sniffing.",
          "Buffering multi-gigabyte files entirely into server RAM before streaming the response to the client."
        ]
      }
    },
    {
      slug: "endpoint",
      why: {
        before: "Early networked software executed procedures on remote machines via Remote Procedure Calls (RPC) that tightly coupled client code to specific internal function names and memory addresses.",
        problem: "Changing an internal function signature broke all remote clients, routing was opaque to network proxies, and inspecting or caching individual business resources was impossible.",
        shift: "An endpoint establishes an addressable, uniform resource location (URI/URL) where an application exposes a standardized interface for interacting with a specific business capability or entity."
      },
      num: {
        t: "Endpoint Routing Architectures, Data Structures, and Lookup Performance",
        h: ["Router Engine", "Underlying Routing Data Structure", "Lookup Complexity", "Memory Footprint", "Parametric / Wildcard Support"],
        r: [
          ["Linear Scan Router (Express.js regex)", "Array of RegExp route matchers", "$O(N)$ linear search per request", "Minimal memory", "Full regex and arbitrary capture groups"],
          ["Radix Tree / Trie (Fastify / Gin / Echo)", "Compact Prefix Tree (Radix Tree)", "$O(K)$ where $K$ is URL path length", "Optimized contiguous node blocks", "Named parameters (:id) and catch-all wildcards (*path)"],
          ["Hash Map Table", "Exact string match hash table", "$O(1)$ constant time lookup", "Scales with route count", "Static routes only; zero wildcard support"],
          ["RESTful Resource Endpoint", "Hierarchical resource URI paths (/users/:id/orders)", "$O(K)$ via Radix walk", "Structured node hierarchy", "Standardized CRUD mappings to HTTP methods"],
          ["GraphQL Single Endpoint (/graphql)", "Single static POST endpoint", "$O(1)$ initial route -> $O(V)$ AST parse", "Single route entry", "Internal query document dictates execution graph"]
        ],
        n: "In modern web backends, an endpoint is the entry point where an HTTP request is routed to an execution handler. High-performance web routers discard naive $O(N)$ regex scanning in favor of Radix Trees (compact tries). The routing path space is modeled as a tree where common URL prefixes share edges: $\\text{Root} \\to \\text{/api/v1/} \\to \\{\\text{users}, \\text{orders}\\}$. For an incoming request path $P$ of length $K$, matching executes in $O(K)$ time, completely independent of the total number of registered routes $N$. Once the node is matched, the router extracts named route parameters (e.g., `/users/:userId` maps to `params.userId`) and constructs a middleware onion pipeline around the endpoint handler."
      },
      miss: [
        {
          w: "An endpoint URL should contain verbs describing the action being performed (e.g., /getUsers, /deleteUser).",
          r: "RESTful endpoint conventions dictate that endpoints represent nouns (resources like /users); the action is determined by the HTTP method (GET, POST, DELETE)."
        },
        {
          w: "An endpoint and an API are identical concepts and the words mean the exact same thing.",
          r: "An API is the entire overarching interface and contract comprising dozens of capabilities; an endpoint is a single, specific URL location within that API."
        },
        {
          w: "Exposing an internal database table directly as a REST endpoint is best practice for development speed.",
          r: "Tightly coupling endpoints to internal database schemas exposes private data, creates massive security vulnerabilities, and prevents future database refactoring without breaking clients."
        },
        {
          w: "All endpoints in an application must use the exact same authentication and authorization mechanism.",
          r: "Endpoints require varying security postures: public marketing endpoints are unauthenticated, webhook endpoints require cryptographic HMAC signatures, and admin endpoints require strict RBAC."
        }
      ],
      trade: {
        buys: [
          "Clean resource abstraction: decouples internal database and code structures from public client contracts.",
          "Fine-grained access control: security policies, rate limits, and caching can be applied per endpoint.",
          "Discoverability and documentation: OpenAPI/Swagger specifications model systems as clear endpoint collections.",
          "Independent scalability and deployment routing via microservices and API gateways."
        ],
        costs: [
          "API surface sprawl: large organizations accumulate thousands of endpoints, risking zombie or shadow endpoints.",
          "Versioning overhead: updating endpoint contracts requires maintaining backward-compatible versioned paths (/v1, /v2).",
          "Routing latency: deep middleware stacks and complex regex routers can add computational overhead.",
          "Under-fetching or over-fetching when REST endpoints return fixed data shapes."
        ],
        avoid: [
          "Using verb-heavy endpoint naming (e.g., /createUser or /updatePrice) instead of standard HTTP REST nouns.",
          "Exposing sensitive internal identifiers (like auto-incrementing integer database IDs) directly in public endpoints.",
          "Creating new versioned endpoints (/v2) for minor, non-breaking backward-compatible changes.",
          "Leaving deprecated legacy endpoints active in production without telemetry monitoring or sunset schedules."
        ]
      }
    },
    {
      slug: "payload",
      why: {
        before: "Systems transmitted data across networks by sending raw memory structs directly over sockets, causing fatal memory alignment crashes whenever CPU architectures or compilers differed.",
        problem: "Network communication was completely brittle: a single byte offset error corrupted all fields, systems were tied to specific hardware byte-order (endianness), and debugging required reading hex dumps.",
        shift: "The payload encapsulates the actual essential data content carried by a transmission frame, serialized into standard, self-describing formats (JSON, Protobuf, XML) decoupled from protocol metadata."
      },
      num: {
        t: "Payload Serialization Formats, Wire Overhead, and Parsing Speed",
        h: ["Format / Codec", "Data Encoding Type", "Wire Size Ratio", "Serialization / Deserialization Speed", "Schema Enforcement"],
        r: [
          ["JSON", "UTF-8 Text (Human-readable)", "100% (Baseline)", "Moderate (CPU text parsing & tokenizing)", "Optional (JSON Schema / Zod runtime validation)"],
          ["Protocol Buffers (Protobuf)", "Compact binary (Varints, Tag-Length-Value)", "~20% - 35% of JSON", "Blazing Fast (Direct memory buffer decode)", "Strict compile-time schema (.proto contracts)"],
          ["MessagePack / CBOR", "Binary JSON representation", "~60% - 75% of JSON", "Fast (Avoids string parsing)", "Schemaless; dynamic types embedded in bytes"],
          ["Multipart / Form-Data", "MIME boundary delimited text/binary", "110% - 130% (Boundary overhead)", "Moderate to Slow (Boundary scanning)", "Implicit field and file metadata"],
          ["Raw Binary (Octet-Stream)", "Pure byte stream / Wasm / Images", "Optimal for raw binary data", "Instantaneous (Zero serialization)", "Application-specific binary decoding"]
        ],
        n: "The payload represents the cargo of a network transmission, distinct from transport framing and protocol metadata headers. In TCP/IP encapsulation, a payload is nested: the Application Payload (e.g., JSON text) becomes the TCP Segment Payload, which becomes the IP Packet Payload, which becomes the Ethernet Frame Payload. In application protocols, payload delimitation is governed by either the `Content-Length` header (specifying exact byte count: $N = \\text{bytes}$) or Chunked Transfer Encoding. Payloads undergo serialization transformations: given an in-memory object $O$, an encoder computes a byte stream $B = \\text{Serialize}(O)$. Modern high-throughput systems utilize Protocol Buffers with Varint encoding to achieve significant size reduction: numbers are packed into 7-bit chunks with the 8th bit serving as a continuation marker, minimizing wire transmission latency."
      },
      miss: [
        {
          w: "The payload includes the HTTP headers, status code, and IP routing addresses.",
          r: "Headers, status codes, and routing addresses are protocol metadata; the payload refers strictly to the actual message body being transported."
        },
        {
          w: "JSON is always the best payload format for all web and mobile application communications.",
          r: "While JSON is human-readable and universal, its text encoding is verbose and CPU-intensive; high-throughput internal microservices achieve 5-10x performance gains using binary Protobuf or gRPC."
        },
        {
          w: "Compressing a tiny 50-byte JSON payload with Gzip will make network transmission faster.",
          r: "Compression algorithms add headers and dictionary overhead; compressing payloads smaller than ~1 KB often results in an output that is larger than the original uncompressed text."
        },
        {
          w: "A server can safely deserialize incoming user payloads directly into native programming language objects.",
          r: "Unsafe deserialization (e.g., Python pickle, Java ObjectInputStream) allows malicious payloads to execute arbitrary remote code; payloads must be parsed via safe data-only serializers and validated."
        }
      ],
      trade: {
        buys: [
          "Decouples application business data from underlying network transport and routing mechanics.",
          "Standard formats (JSON) enable effortless cross-language interoperability across heterogeneous platforms.",
          "Binary codecs (Protobuf) provide extreme wire efficiency and sub-millisecond parsing throughput.",
          "Allows applying targeted end-to-end payload encryption and content integrity hashing (HMAC/SHA-256)."
        ],
        costs: [
          "Serialization and deserialization CPU tax: converting objects to text/binary consumes significant server compute.",
          "Network bandwidth consumption when using verbose text payloads without compression.",
          "Security attack surface: malicious oversized payloads can cause denial-of-service memory exhaustion.",
          "Schema drift: clients and servers can disagree on payload structures if versions are not managed strictly."
        ],
        avoid: [
          "Deserializing untrusted network payloads using unsafe language execution primitives (e.g., eval or pickle).",
          "Transmitting massive multi-megabyte payloads in a single synchronous HTTP request without pagination or streaming.",
          "Applying Gzip compression to already-compressed binary payloads (such as JPEG images or MP4 videos).",
          "Accepting incoming payloads without validating shapes and types using a runtime schema validator (e.g., Zod)."
        ]
      }
    },
    {
      slug: "http-header",
      why: {
        before: "Early communication protocols embedded metadata directly into data bodies or required out-of-band control channels, making it difficult for intermediate proxies to inspect, route, or cache traffic.",
        problem: "Network intermediaries (proxies, CDNs, firewalls) had to deeply parse and alter message bodies to manage routing or caching, slowing transmission and violating privacy.",
        shift: "HTTP headers provide a standardized, extensible key-value metadata mechanism that allows clients, servers, and intermediaries to negotiate content, authentication, caching, and security out-of-band."
      },
      num: {
        t: "HTTP Header Categories, RFC Specifications, and Operational Roles",
        h: ["Header Category", "Representative Header", "Direction / Scope", "RFC Specification", "Operational Function"],
        r: [
          ["Authentication & Security", "Authorization: Bearer <token>", "Request (Client to Server)", "RFC 6750 / RFC 7235", "Transmits credentials to authenticate identity"],
          ["Content Negotiation", "Accept-Encoding: gzip, br", "Request & Response", "RFC 7231", "Client declares supported compression formats"],
          ["Caching Directive", "Cache-Control: max-age=3600, public", "Response (Server to Intermediaries)", "RFC 7234", "Dictates caching validity across CDNs and browsers"],
          ["CORS & Origin Security", "Access-Control-Allow-Origin: *", "Response", "W3C Fetch Spec", "Instructs browser whether to permit cross-origin access"],
          ["Security Hardening", "Strict-Transport-Security (HSTS)", "Response", "RFC 6797", "Forces browser to communicate exclusively over TLS/HTTPS"],
          ["Hop-by-Hop Framing", "Connection: keep-alive / close", "Single transport hop only", "RFC 7230", "Controls TCP socket lifecycle between immediate peers"]
        ],
        n: "HTTP headers are case-insensitive key-value pairs formatted as `Field-Name: Field-Value\\r\\n`. The HTTP specification establishes a fundamental architectural distinction between End-to-End headers (which must be transmitted to the ultimate recipient and preserved across caches) and Hop-by-Hop headers (e.g., `Connection`, `Keep-Alive`, `Transfer-Encoding`), which apply strictly to a single transport link between immediate proxies. In HTTP/2 and HTTP/3, headers are transformed via HPACK and QPACK algorithms, which utilize a dual-table state machine: a static table of 61 common pre-defined headers (e.g., `:method GET`) and an adaptive dynamic table of recently transmitted headers. By transmitting $O(1)$ index pointers and Huffman-encoded deltas, HPACK reduces header bandwidth consumption by up to 85%."
      },
      miss: [
        {
          w: "HTTP header names are case-sensitive, so `Content-Type` and `content-type` are treated as different headers.",
          r: "RFC specifications explicitly mandate that HTTP header field names are case-insensitive; in HTTP/2 and HTTP/3, headers are strictly standardized to all-lowercase on the wire."
        },
        {
          w: "You can safely pass sensitive user credentials in custom headers because headers are encrypted by HTTPS.",
          r: "While HTTPS encrypts headers over the wire, headers are routinely logged in plaintext by API gateways, load balancers, CDN access logs, and proxy monitoring tools."
        },
        {
          w: "Custom headers must always be prefixed with `X-` (e.g., X-User-Id).",
          r: "RFC 6648 officially deprecated the `X-` prefix convention in 2012 because when experimental headers became standard, changing names broke implementations; custom headers should use standard naming."
        },
        {
          w: "Adding dozens of security headers is purely aesthetic and has no impact on real attacks.",
          r: "Security headers like Content-Security-Policy (CSP), HSTS, and X-Content-Type-Options: nosniff are the primary defense mechanisms against XSS, clickjacking, and protocol downgrade attacks."
        }
      ],
      trade: {
        buys: [
          "Clean separation of protocol metadata (routing, caching, security) from application business payloads.",
          "Enables transparent intermediate caching across global Content Delivery Networks (CDNs) and proxies.",
          "Dynamic content negotiation: client and server agree on optimal compression (Brotli) and formats (JSON/WebP).",
          "Powerful browser security enforcement via standardized security headers (CSP, HSTS, CORS)."
        ],
        costs: [
          "Header bloat: uncompressed HTTP/1.1 headers can easily reach 1-2 KB per request, dwarfing small payloads.",
          "Security logging leaks: sensitive tokens placed in custom headers risk leaking into access log aggregators.",
          "Intermediate proxy interference: misconfigured corporate proxies can strip, mutate, or corrupt headers.",
          "CORS preflight latency penalty when non-simple custom headers trigger OPTIONS round-trips."
        ],
        avoid: [
          "Placing raw passwords or sensitive PII inside custom headers that are written to web server logs.",
          "Inventing new `X-` prefixed headers for modern web APIs (use clean, semantic domain header names).",
          "Setting `Access-Control-Allow-Origin: *` simultaneously with `Access-Control-Allow-Credentials: true`.",
          "Allowing client request headers to grow larger than the server's maximum header buffer (triggering HTTP 431)."
        ]
      }
    },
    {
      slug: "query-parameter",
      why: {
        before: "Clients requesting filtered, paginated, or sorted datasets had to invent proprietary payload bodies or construct chaotic nested URL path structures, breaking standard HTTP caching.",
        problem: "Sending payloads for simple reads required POST requests, preventing web browsers and CDNs from caching identical data searches, while complex path parameters made optional filtering unmanageable.",
        shift: "Query parameters standardize optional, key-value query parameters appended to the Uniform Resource Identifier (URI), providing an idempotent, cacheable mechanism for filtering, sorting, and pagination."
      },
      num: {
        t: "Query Parameter Formatting, RFC Specifications, and Encoding Rules",
        h: ["Parameter Role", "URI Syntax Convention", "RFC 3986 Handling", "Cache Key Inclusion", "Security / Performance Hazard"],
        r: [
          ["Filtering / Search", "?category=shoes&color=red", "Percent-encoding of reserved characters", "Included in standard CDN cache key", "SQL injection if concatenated directly into queries"],
          ["Pagination (Offset / Limit)", "?page=2&limit=50", "Integer parsing and clamping", "Included (Creates distinct cache entry per page)", "Unbounded limits (limit=100000) causing memory exhaustion"],
          ["Cursor-Based Pagination", "?cursor=eyJpZCI6NDJ9", "Base64 URL-safe encoding", "Included in cache key", "Tampering with cursor tokens if unverified"],
          ["Sorting / Ordering", "?sort=created_at&order=desc", "Strict whitelist validation against allowed columns", "Included in cache key", "Un-indexed sort columns causing full database table scans"],
          ["Tracking / Analytics (UTM)", "?utm_source=twitter&utm_medium=cpc", "Standard string key-value", "Ignored by CDN via Cache-Key normalization", "Cache fragmentation if CDNs fail to strip analytics params"]
        ],
        n: "Query parameters form the query component of a URI as defined in RFC 3986: $\\text{URI} = \\text{scheme} \\text{://} \\text{authority} \\text{/} \\text{path} \\ \\mathbf{[?\\text{query}]} \\ [\\#\\text{fragment}]$. The query begins with a question mark (`?`) and consists of key-value pairs delimited by ampersands (`&`). Any character outside the unreserved character set ($[a\\text{-}zA\\text{-}Z0\\text{-}9\\text{-}\\_\\.\\~]$) must undergo Percent-Encoding (e.g., spaces convert to `%20` or `+`). Because HTTP GET requests with identical query strings are safe and idempotent, CDNs construct cache keys from the normalized URI string: $\\text{Key} = \\text{Hash}(\\text{Host} + \\text{Path} + \\text{Sort}(\\text{QueryParameters}))$. Ensuring query parameter ordering invariance prevents cache fragmentation when different clients serialize parameters in varying orders."
      },
      miss: [
        {
          w: "Passing sensitive information (like API keys or passwords) in query parameters is secure over HTTPS.",
          r: "Query strings appear in full in browser history, proxy access logs, CDN logs, and HTTP Referer headers; sensitive secrets must never be placed in query parameters."
        },
        {
          w: "Query parameters can be infinitely long because modern web servers have gigabytes of memory.",
          r: "Web servers, proxies, and browsers enforce strict URI length limits (typically 2,048 to 8,192 bytes); exceeding these limits triggers HTTP 414 URI Too Long errors."
        },
        {
          w: "Duplicate keys in query strings (e.g., ?tag=js&tag=react) are handled identically across all backends.",
          r: "Different frameworks parse duplicate keys differently: Express creates an array, PHP captures only the last value unless [] is used, and Python may take only the first, creating security parameter-pollution risks."
        },
        {
          w: "You must always use query parameters instead of URL path parameters.",
          r: "Path parameters (e.g., /users/42) identify the specific unique resource entity; query parameters (e.g., ?sort=asc) modify, filter, or paginate how that resource collection is retrieved."
        }
      ],
      trade: {
        buys: [
          "Idempotent filtering and sorting that enables browser, proxy, and CDN caching out-of-the-box.",
          "Effortless bookmarking and link sharing: users can share exact search and pagination states via URLs.",
          "Simple, standardized parameter parsing supported natively by every programming language and browser.",
          "Ideal for optional, non-hierarchical parameters that do not alter the core identity of the resource."
        ],
        costs: [
          "Severe privacy risk: query parameters are permanently recorded in access logs and browser histories.",
          "URL length limits prevent transmitting complex, nested, or large query structures (requiring POST queries).",
          "Cache key fragmentation: unordered query parameters (?a=1&b=2 vs ?b=2&a=1) can cause redundant cache misses.",
          "HTTP Parameter Pollution (HPP) vulnerabilities when frameworks mishandle duplicate parameter keys."
        ],
        avoid: [
          "Putting authentication tokens, API secrets, passwords, or PII into URL query parameters.",
          "Concatenating raw query parameter strings directly into SQL queries without parameterized inputs.",
          "Allowing clients to pass unbounded pagination limits (e.g., ?limit=9999999) without server clamping.",
          "Using query parameters to pass large multi-kilobyte JSON payloads that approach browser URL limits."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
