(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "url-anatomy",
      why: {
        before: "Network systems addressed resources using proprietary, hardware-dependent socket addresses or machine-specific physical file paths that could not be referenced or linked across different networks.",
        problem: "Users had no standardized, universal way to locate, link, or bookmark resources across heterogeneous internet services, causing fragmented information silos.",
        shift: "The Uniform Resource Locator (URL, RFC 3986) establishes a universal, hierarchical syntax that identifies the network protocol, authority host, path, query parameters, and document fragments."
      },
      num: {
        t: "URL Structural Anatomy, RFC 3986 Syntax, and Parsing Invariants",
        h: ["URL Component", "RFC 3986 Grammar", "Example Value", "Transmitted Over Wire to Server?", "Canonical Purpose"],
        r: [
          ["Scheme / Protocol", "ALPHA *( ALPHA / DIGIT / '+' / '-' / '.' )", "https://, ws://, ftp://", "Yes (Implicit in TLS connection)", "Defines transport protocol and default port (443 for https)"],
          ["Authority (Host + Port)", "[userinfo@]host[:port]", "api.example.com:8443", "Yes (Transmitted via HTTP Host header)", "Identifies target network domain/IP and TCP/UDP port"],
          ["Path", "/path-abempty / path-absolute", "/v1/users/42/orders", "Yes (Request-Line in HTTP frame)", "Hierarchical address of resource on host"],
          ["Query String", "?query (*pchar / '/' / '?')", "?sort=desc&limit=20", "Yes (Request-Line in HTTP frame)", "Non-hierarchical filtering, pagination, sorting"],
          ["Fragment", "#fragment (*pchar / '/' / '?')", "#section-heading", "NO (Client-side browser only; never sent to server)", "In-page DOM anchor navigation or client-side routing"]
        ],
        n: "The URI generic syntax (RFC 3986) formalizes a strict grammar: $\\text{URI} = \\text{scheme} \\text{:} \\text{hier-part} \\ [\\text{?} \\text{query}] \\ [\\# \\text{fragment}]$. The authority segment decomposes into $\\text{authority} = [\\text{userinfo} \\text{@}] \\text{host} [\\text{:} \\text{port}]$. When a browser issues an HTTP request, the client parser tears the URL apart: the scheme and authority dictate the DNS lookup and TCP socket connection. Crucially, the fragment component (beginning with `\\#`) is mathematically quarantined on the client: browsers strip the fragment before transmitting the Request-Line, utilizing it exclusively in the local rendering engine for DOM element scroll targeting (`element.scrollIntoView()`) or single-page application (SPA) client-side hash routing."
      },
      miss: [
        {
          w: "The URL fragment (e.g., `#profile`) is transmitted to the web server in the HTTP request.",
          r: "Browsers never transmit the fragment to the server over the network; the fragment is processed entirely client-side by the browser's JavaScript engine and rendering compositor."
        },
        {
          w: "A URI and a URL are two completely unrelated concepts.",
          r: "A URL (Uniform Resource Locator) is a specific type of URI (Uniform Resource Identifier) that identifies a resource by specifying *how* to locate it (e.g., via network protocol and domain address)."
        },
        {
          w: "Putting username and password in the URL userinfo field (`https://user:pass@site.com`) is safe.",
          r: "RFC 3986 explicitly deprecates passing plaintext passwords in URL authorities; credentials appear in plain text in browser histories, logs, and HTTP Referer headers, creating severe security vulnerabilities."
        },
        {
          w: "URL parsing can be reliably implemented using simple regular expressions.",
          r: "URLs possess complex internationalized domain names (IDN), IPv6 bracket literals (`http://[::1]:8080`), and percent-encoded edge cases; parsing must use compliant WHATWG URL parser implementations."
        }
      ],
      trade: {
        buys: [
          "Universal global addressability: any resource on the planet can be uniquely referenced via a single string.",
          "Stateless bookmarking and deep linking: users share precise application states across the web.",
          "Hierarchical path routing allows logical resource nesting (`/organizations/42/projects/99`).",
          "Decouples client navigation from physical server IP addresses via domain authority abstraction."
        ],
        costs: [
          "Security attack surface: SSRF (Server-Side Request Forgery) attacks via malicious user-supplied URLs.",
          "Length constraints: intermediate proxies and browsers enforce hard URL length limits (typically 2,048 to 8,192 bytes).",
          "Privacy leaks: sensitive query parameters can leak into third-party analytics via HTTP Referer headers.",
          "Normalization complexities: handling case sensitivity, percent-encoding variations, and trailing slashes."
        ],
        avoid: [
          "Passing secret API keys or user passwords inside URL userinfo or query string components.",
          "Parsing URLs with custom, hand-rolled regexes instead of the standard `new URL()` parser.",
          "Expecting the server to read or parse URL `#fragment` components.",
          "Fetching user-supplied URLs on the backend without validating against internal IP ranges (preventing SSRF)."
        ]
      }
    },
    {
      slug: "url-encoding",
      why: {
        before: "Transmitting special characters (like spaces, ampersands, slashes, or non-English characters) in URLs corrupted network protocol framing, causing servers to misinterpret query boundaries.",
        problem: "An ampersand inside a search query string (`?company=Ben&Jerry`) broke parameter parsing into two separate keys, while spaces caused terminal shells and HTTP parsers to crash or truncate requests.",
        shift: "URL Encoding (Percent-Encoding, RFC 3986) converts reserved and non-ASCII characters into an unambiguous `%HH` triplet representing the byte's hexadecimal ASCII value."
      },
      num: {
        t: "Percent-Encoding Characters, Hex Mappings, and Form Variations",
        h: ["Character Class", "Characters Included", "Encoding Rule", "Hex Representation Example", "Semantic Meaning in URLs"],
        r: [
          ["Unreserved Characters", "A-Z, a-z, 0-9, '-', '_', '.', '~'", "Never encoded; preserved verbatim", "'A' remains 'A'", "Standard safe identifiers"],
          ["Reserved Delimiters", ":, /, ?, #, [, ], @, !, $, &, ', (, ), *, +, ,, ;, =", "Encoded when used as raw data", "'&' -> %26, '/' -> %2F, '?' -> %3F", "Syntactic structural delimiters"],
          ["Space Character", "Literal whitespace", "%20 (RFC 3986) or '+' (Form-urlencoded)", "Space -> %20 or +", "Separates tokens; %20 is strictly universal"],
          ["Non-ASCII / UTF-8 Text", "Emojis, accented letters, Asian characters", "UTF-8 multi-byte sequence -> multiple %HH", "'é' -> %C3%A9, '🔥' -> %F0%9F%94%A5", "International domain and query representations"],
          ["Double-Encoded Attack", "Percent character itself (%)", "Encoded to %25", "'%2F' double-encoded to '%252F'", "Bypassing naive security WAF filters (CWE-209)"]
        ],
        n: "Percent-encoding (standardized in RFC 3986 §2.1) represents arbitrary octets using a three-character triplet: $\\% H_1 H_2$, where $H_1 H_2$ is the two-digit hexadecimal representation of the 8-bit byte. RFC 3986 partitions the ASCII character space into Unreserved characters (which must never be encoded) and Reserved characters (which possess structural syntactic meaning as delimiters). If a reserved character is used as literal data content, it must be percent-encoded: e.g., a forward slash separating path segments is preserved as `/`, but a slash inside a query value is encoded as `%2F`. Non-ASCII characters (e.g., Unicode symbols) are first converted into their UTF-8 multi-byte sequence, and each resulting byte is individually percent-encoded: e.g., the 4-byte emoji 🔥 (`0xF0 0x9F 0x94 0xA5`) compiles to `%F0%9F%94%A5`."
      },
      miss: [
        {
          w: "`encodeURI()` and `encodeURIComponent()` in JavaScript perform the exact same operation.",
          r: "`encodeURI()` preserves structural URL delimiters (`:`, `/`, `?`, `&`) to encode a full valid URL; `encodeURIComponent()` encodes *all* delimiters, and is specifically designed for encoding individual query parameter values."
        },
        {
          w: "Spaces in URLs must always be encoded as `+` instead of `%20`.",
          r: "`+` for spaces is strictly defined only for `application/x-www-form-urlencoded` query strings; in URL path segments, a `+` represents a literal plus sign, and spaces must strictly be encoded as `%20`."
        },
        {
          w: "URL-decoding a user-supplied string once guarantees it is safe from directory traversal.",
          r: "Attackers use Double Encoding: sending `%252e%252e%252f`; if the web server decodes once to `../` without validating, path traversal succeeds; systems must canonicalize paths after all decoding completes."
        },
        {
          w: "Modern browsers and APIs do not require URL encoding because they handle Unicode natively.",
          r: "HTTP/1.1 and TCP transport layers remain strictly byte-oriented; while modern browser address bars display decoded Unicode (IDN) visually for human ease, on the wire the bytes are 100% percent-encoded."
        }
      ],
      trade: {
        buys: [
          "Guarantees corruption-free URL transmission across all network gateways, proxies, and web servers.",
          "Allows arbitrary binary data, non-ASCII international scripts, and emojis to be transported inside URLs.",
          "Prevents syntactic ambiguity by clearly distinguishing data characters from protocol delimiters.",
          "Standardized across all programming languages via native encoding functions."
        ],
        costs: [
          "Payload bloat: a single 4-byte emoji expands into 12 ASCII characters (`%F0%9F%94%A5`).",
          "Double-encoding security hazards: mismatched decoding passes allow security filter bypasses.",
          "Human readability penalty: long percent-encoded query strings become unreadable in logs and cURL commands.",
          "Parsing friction between differing form encoding (`+`) and standard URI percent-encoding (`%20`)."
        ],
        avoid: [
          "Using `encodeURI()` to encode individual query parameter values (which leaves `&` and `=` un-encoded).",
          "Decoding user input multiple times sequentially, exposing the application to double-encoding vulnerabilities.",
          "Manually concatenating un-encoded variables into URLs instead of using `URLSearchParams`.",
          "Assuming `+` will be interpreted as a space inside URL path segments (outside query strings)."
        ]
      }
    },
    {
      slug: "http-status-code-families",
      why: {
        before: "Early networked protocols returned unstandardized, proprietary error strings or single-bit failure flags, leaving clients guessing whether an error was permanent, transient, or unauthorized.",
        problem: "Automated clients could not make intelligent decisions: scripts could not determine whether to retry a failed request, redirect to a new URL, prompt for a password, or abort execution.",
        shift: "The HTTP status code specification organizes response statuses into five standardized 3-digit numerical families (1xx to 5xx), providing unambiguous execution semantics and automated retry directives."
      },
      num: {
        t: "HTTP Status Code Families, RFC Semantics, and Client Action Contracts",
        h: ["Family / Range", "RFC 7231 Class", "Semantics & System Meaning", "Client Automated Action", "Canonical Production Examples"],
        r: [
          ["1xx (100 - 199)", "Informational", "Request received; continuing protocol transition", "Hold connection open; proceed with payload", "101 Switching Protocols (WebSocket), 103 Early Hints"],
          ["2xx (200 - 299)", "Successful", "Action successfully received, understood, and accepted", "Consume response payload; proceed with workflow", "200 OK, 201 Created (POST), 204 No Content (DELETE)"],
          ["3xx (300 - 399)", "Redirection", "Further action required to complete request", "Follow Location header URL automatically", "301 Moved Permanently, 304 Not Modified, 308 Permanent"],
          ["4xx (400 - 499)", "Client Error", "Request contains invalid syntax or unauthorized state", "Do NOT retry verbatim; fix client request first", "400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found"],
          ["5xx (500 - 599)", "Server Error", "Server failed to fulfill an apparently valid request", "Safe to retry with exponential backoff and jitter", "500 Internal Error, 502 Bad Gateway, 503 Unavailable"]
        ],
        n: "HTTP status codes (RFC 7231 §6) are 3-digit integers where the first digit defines the response family. The mathematical contract governing status code consumption dictates automated client behavior. For any 4xx Client Error, the error is deterministic: repeated identical invocations $f(R)$ are guaranteed to yield identical failures; clients must halt and modify parameters (or credentials) before retrying. Conversely, 5xx Server Errors denote transient infrastructural or software crashes: the request was syntactically valid, meaning clients should apply truncated exponential backoff with full jitter: $t_{\\text{wait}} = \\text{random}(0, \\min(t_{\\text{max}}, t_{\\text{base}} \\times 2^{\\text{attempt}}))$. Special codes like 429 (Too Many Requests) provide explicit backoff windows via the `Retry-After` response header."
      },
      miss: [
        {
          w: "Returning HTTP 200 with `{ status: 'error', code: 404 }` in the JSON body is standard modern API design.",
          r: "This anti-pattern breaks HTTP caching, breaks CDN edge routing, breaks automated client SDK retries, and blinds monitoring tools; errors must return genuine 4xx or 5xx HTTP status codes."
        },
        {
          w: "A 401 Unauthorized status code means the user does not have permission to view the resource.",
          r: "401 specifically means 'Unauthenticated' (the client lacks valid credentials); 403 Forbidden means 'Unauthorized' (the identity is verified, but permissions do not allow this action)."
        },
        {
          w: "Client retry libraries should automatically retry any failed HTTP request, including 400 and 404 errors.",
          r: "Retrying 4xx errors floods servers with useless traffic because client errors cannot succeed without modifying the request; retries are strictly reserved for 5xx errors and 429 rate limits."
        },
        {
          w: "HTTP 502 Bad Gateway and 504 Gateway Timeout mean there is a syntax error in your application code.",
          r: "502 and 504 are network proxy errors: 502 means the reverse proxy (NGINX/ALB) received an invalid response or connection drop from the backend; 504 means the backend took too long to reply."
        }
      ],
      trade: {
        buys: [
          "Universal machine-readable automation: load balancers, CDNs, and client SDKs handle responses deterministically.",
          "CDN and edge caching optimization: caches store 200s and 301s while immediately discarding 500 errors.",
          "Observability clarity: enables automated alerting on 5xx error rate spikes without inspecting response bodies.",
          "Resilient network communication: drives automated exponential backoff retries on transient 503/504 errors."
        ],
        costs: [
          "Coarse granularity: a single 500 status code does not explain whether the error was a DB lock or null pointer.",
          "API developer discipline required to map complex domain error models to standard HTTP status codes.",
          "Risk of leaking internal architecture details if unhandled exceptions emit default framework 500 pages.",
          "Inconsistent client handling of newer status codes (e.g., 418, 451, or custom enterprise codes)."
        ],
        avoid: [
          "Returning HTTP 200 OK for failed operations that encountered exceptions or validation errors.",
          "Confusing 401 (Unauthenticated) with 403 (Forbidden) in API security layers.",
          "Automatically retrying non-idempotent POST requests on 500 errors without idempotency keys.",
          "Inventing proprietary status codes outside standard RFC ranges (e.g., returning HTTP 700)."
        ]
      }
    },
    {
      slug: "crud",
      why: {
        before: "Early database applications manipulated records using ad-hoc, proprietary procedural commands, requiring custom interface code for every single business entity in an organization.",
        problem: "Software architectures were fragmented and inconsistent: developers reinvented custom data lifecycles for every database table, and systems could not expose standard, predictable API contracts.",
        shift: "CRUD formalizes the four fundamental, universal operations of persistent data storage—Create, Read, Update, Delete—mapping data models cleanly to SQL statements and HTTP REST verbs."
      },
      num: {
        t: "CRUD Operations, Protocol Mappings, and Transactional Semantics",
        h: ["CRUD Operation", "SQL DML Equivalent", "HTTP REST Verb", "Idempotent?", "Data Lifecycle Stage"],
        r: [
          ["Create", "INSERT INTO table ...", "POST /resources", "No (Repeated calls create duplicate records)", "Instantiation of new persistent entity"],
          ["Read", "SELECT ... FROM table", "GET /resources/:id", "Yes (Safe: zero state mutation)", "Retrieval of current entity state representation"],
          ["Update (Full Replace)", "UPDATE table SET col=val ...", "PUT /resources/:id", "Yes (Replacing with identical data yields same state)", "Complete state replacement"],
          ["Update (Partial Delta)", "UPDATE table SET col=val WHERE ...", "PATCH /resources/:id", "Conditional / Non-idempotent", "Surgical modification of specific fields"],
          ["Delete", "DELETE FROM table WHERE id=...", "DELETE /resources/:id", "Yes (Deleting already deleted item yields same state)", "Destruction / Soft-deletion of persistent entity"]
        ],
        n: "CRUD represents the foundational lifecycle abstraction of stateful information systems. In relational database management systems (RDBMS), CRUD operations map to Data Manipulation Language (DML) executed within ACID transactions: $\\text{Create} \\leftrightarrow \\text{INSERT}$, $\\text{Read} \\leftrightarrow \\text{SELECT}$, $\\text{Update} \\leftrightarrow \\text{UPDATE}$, and $\\text{Delete} \\leftrightarrow \\text{DELETE}$. In RESTful web architectures, CRUD maps directly to HTTP methods. In high-concurrency production systems, destructive `DELETE` operations are frequently replaced with the *Soft Delete* pattern: setting a timestamp flag (`deleted_at = NOW()`) and filtering active queries via $\\text{WHERE deleted\\_at IS NULL}$. This preserves referential integrity, historical audit logs, and enables accidental deletion recovery."
      },
      miss: [
        {
          w: "All modern web applications are simple CRUD apps and require no other architecture.",
          r: "CRUD models only static state storage; complex applications require Event Sourcing, CQRS (Command Query Responsibility Segregation), state machines, and asynchronous workflows that transcend basic CRUD."
        },
        {
          w: "Using HTTP POST to update or delete a record is acceptable RESTful API design.",
          r: "REST conventions mandate using PUT/PATCH for updates and DELETE for removals; using POST for everything violates idempotency guarantees and prevents automated HTTP proxy caching."
        },
        {
          w: "A hard database DELETE is always better than a soft delete because it frees disk space.",
          r: "Hard deletes permanently destroy historical audit trails, break foreign key relational constraints, and prevent customer disaster recovery; soft deletes with archived partitions are industry standard."
        },
        {
          w: "PUT and PATCH are identical methods for updating database records.",
          r: "PUT represents a complete replacement of the entire resource (omitted fields are overwritten or nulled); PATCH applies a partial delta update, modifying only the specific fields passed."
        }
      ],
      trade: {
        buys: [
          "Extreme conceptual simplicity: universally understood paradigm across frontend, backend, and database tiers.",
          "Rapid development velocity: automated frameworks (Rails, Django, Prisma) scaffold complete CRUD APIs in minutes.",
          "Standardized API contracts: consumers intuitively know how to interact with resources without reading docs.",
          "Direct mapping to relational database SQL primitives and standard ORM patterns."
        ],
        costs: [
          "Inadequate for complex domain logic: struggles to model multi-entity business workflows (e.g., approving a loan).",
          "Soft-delete query pollution: requires remembering to filter `deleted_at IS NULL` on every database query.",
          "Concurrent update collisions: two concurrent updates can overwrite each other without optimistic locking.",
          "Over-fetching / Under-fetching: fixed CRUD endpoints can return too much or too little data for mobile views."
        ],
        avoid: [
          "Using HTTP GET requests to perform Create, Update, or Delete operations.",
          "Executing physical hard DELETEs on primary business entities without soft-delete archiving.",
          "Performing concurrent CRUD updates without Optimistic Concurrency Control (version checking).",
          "Forcing complex state-machine transitions into awkward CRUD updates."
        ]
      }
    },
    {
      slug: "rate-limit",
      why: {
        before: "Web APIs accepted unlimited incoming requests from any client, leaving servers completely unprotected against denial-of-service attacks, scraping bots, and buggy client retry loops.",
        problem: "A single runaway script or malicious bot flooded servers with millions of requests, crashing shared databases, exhausting thread pools, and knocking services offline for all users.",
        shift: "Rate limiting throttles incoming traffic by enforcing strict request quotas per client IP, user token, or API key over specified time windows, protecting system stability and fair resource sharing."
      },
      num: {
        t: "Rate Limiting Algorithms, Memory Complexity, and Burst Handling",
        h: ["Algorithm", "State Storage Mechanism", "Memory per Client", "Burst Handling Capability", "Boundary Edge Flaw"],
        r: [
          ["Fixed Window Counter", "Single atomic counter keyed by current minute/hour", "O(1) (8 bytes in Redis)", "No (Hard cutoff at window limit)", "Traffic spike at boundary (2x limit across window edge)"],
          ["Sliding Window Log", "Sorted Set (ZSET) storing timestamps of every request", "O(N) (Scales with request volume)", "Smooth, exact rate limiting", "Memory exhaustion under massive request volumes"],
          ["Sliding Window Counter", "Weighted sum of current and previous window counts", "O(1) (Two counters)", "Smooth approximation of rolling rate", "Low memory; minor 0.05% approximation error"],
          ["Token Bucket", "Bucket holds B tokens; refills at constant rate R", "O(1) (Last timestamp + token count)", "Allows controlled bursts up to bucket capacity B", "Tokens can be exhausted by sudden initial burst"],
          ["Leaky Bucket", "FIFO queue processes requests at uniform constant rate", "O(Queue Size)", "Zero burst (Smooths out traffic peaks)", "Drops requests immediately when queue saturates"]
        ],
        n: "Rate limiting enforces an upper bound on client request arrival rates: $\\lambda \\le \\lambda_{\\text{max}}$. In high-throughput distributed systems, the standard implementation is the Redis-backed Sliding Window Counter. Time is partitioned into discrete windows of duration $W$. For an arrival at time $t$ within current window $k$, the estimated request count over the preceding window duration $W$ is calculated via interpolation: $\\text{Count} = C_{\\text{current}} + C_{\\text{previous}} \\times \\left(1 - \\frac{t - t_{\\text{start}}}{W}\\right)$. When $\\text{Count} > L$, the reverse proxy drops the request, returning HTTP 429 (Too Many Requests) accompanied by standard RFC headers: `X-RateLimit-Limit: 100`, `X-RateLimit-Remaining: 0`, and `Retry-After: 30`."
      },
      miss: [
        {
          w: "Rate limiting by client IP address is completely sufficient to protect production APIs.",
          r: "IP rate limiting is fragile: thousands of corporate office users share a single NAT gateway IP (causing false-positive blocks), while sophisticated attackers rotate through thousands of residential proxies."
        },
        {
          w: "Rate limiting should be implemented in application code by querying your SQL database.",
          r: "Querying a relational database on every incoming request to check rate limits will crash the database; rate limiting must run at the edge (Envoy, NGINX, Cloudflare) or against an in-memory Redis cluster."
        },
        {
          w: "Fixed Window rate limiting is just as good as sliding window rate limiting.",
          r: "Fixed Window allows 'Boundary Bursts': a client allowed 100 req/min can send 100 requests at 00:59 and 100 requests at 01:00, pushing 200 requests within two seconds and overloading servers."
        },
        {
          w: "Rate limiting is only used for preventing malicious DDoS attacks.",
          r: "Rate limiting is used for billing tiers (freemium vs enterprise quotas), preventing accidental infinite loops in partner integrations, and ensuring fair resource allocation across multi-tenant systems."
        }
      ],
      trade: {
        buys: [
          "Protects backend databases and thread pools from cascading collapse during sudden traffic surges.",
          "Enforces multi-tier SaaS monetization by restricting free-tier users to lower request quotas.",
          "Neutralizes automated scraping bots, brute-force credential stuffing, and abusive API scrapers.",
          "Standardized client backoff communication via HTTP 429 and `Retry-After` headers."
        ],
        costs: [
          "Operational infrastructure dependency: requires maintaining a fast, distributed Redis cluster.",
          "False-positive hazard: legitimate users sharing corporate VPNs or proxy IPs can be blocked accidentally.",
          "Minor latency overhead (~1-3ms) added to every incoming HTTP request for rate limit evaluation.",
          "Complexity of synchronizing rate limit states across multi-region global datacenters."
        ],
        avoid: [
          "Using naive Fixed Window algorithms that permit 2x traffic bursts at window transition boundaries.",
          "Rate limiting solely by IP address for authenticated APIs (use authenticated user IDs or API keys).",
          "Dropping rate-limited requests without returning a clear `Retry-After` HTTP header.",
          "Running rate-limiting queries against primary relational SQL databases instead of in-memory caches."
        ]
      }
    },
    {
      slug: "mime-type",
      why: {
        before: "Internet protocols determined file types solely by inspecting the 3-letter file extension in the filename (e.g., `.txt`, `.exe`), causing files to break if extensions were omitted or misspelled.",
        problem: "Attackers renamed malicious `.exe` or `.html` files to `.jpg`, tricking browsers into executing malicious scripts, while servers misidentified uploaded files without standard content classifications.",
        shift: "MIME types (Media Types, RFC 2045/6838) establish a standardized, two-part identifier (`type/subtype`) that explicitly declares the technical data format and character encoding of payloads independently of filenames."
      },
      num: {
        t: "Standard MIME Types, RFC Categories, and Security Implications",
        h: ["MIME Type Identifier", "Category / Type", "Data Nature / Format", "Security Attack Risk", "Primary Web Usage"],
        r: [
          ["application/json", "Application", "UTF-8 JSON text structured data", "JSON injection / CSRF if parsed loosely", "Standard REST & GraphQL API payloads"],
          ["text/html; charset=utf-8", "Text", "Hypertext markup text", "Cross-Site Scripting (XSS) if unsanitized", "Web page document rendering"],
          ["multipart/form-data", "Multipart", "Delimited stream of fields and binary files", "Unbounded file upload denial-of-service", "HTML forms uploading images or files"],
          ["application/octet-stream", "Application", "Raw arbitrary binary bytes", "Arbitrary binary execution if downloaded", "Fallback for unknown binary file downloads"],
          ["image/svg+xml", "Image", "XML-based vector graphic", "Catastrophic XSS: SVGs can embed <script> tags", "Scalable vector logos and icons"],
          ["text/plain", "Text", "Raw unformatted text", "MIME-sniffing execution if misconfigured", "Log files, robots.txt, plain status text"]
        ],
        n: "MIME types (Multipurpose Internet Mail Extensions, formalized by IANA per RFC 6838) are formatted as a two-part hierarchical string: $\\text{type} / \\text{subtype} [; \\text{parameter} = \\text{value}]$, transmitted via the `Content-Type` header. The top-level type establishes the media class (`text`, `image`, `audio`, `video`, `application`, `multipart`). A notorious security hazard is MIME Sniffing: historically, if a server returned a mismatched header (e.g., serving HTML as `text/plain`), browsers inspected the raw bytes and executed embedded scripts anyway. To eliminate this attack vector, production web servers mandate the security header: `X-Content-Type-Options: nosniff`, forcing browsers to strictly adhere to the declared MIME type."
      },
      miss: [
        {
          w: "Web browsers determine whether a file is an image or script by looking at its `.jpg` or `.js` file extension.",
          r: "Web browsers determine how to process a resource strictly based on the `Content-Type` HTTP header returned by the server; file extensions in URLs are completely ignored by browser renderers."
        },
        {
          w: "Serving an SVG image (`image/svg+xml`) is just as safe as serving a PNG or JPEG image.",
          r: "SVG is an XML document that natively supports embedded `<script>` tags; if a user uploads an SVG and your server serves it directly, viewing the SVG executes arbitrary JavaScript in the user's browser (XSS)."
        },
        {
          w: "Omitting the `Content-Type` header is harmless because browsers will automatically figure it out.",
          r: "Omitting `Content-Type` triggers browser MIME-sniffing, which can interpret user-uploaded text as executable HTML/JS, creating critical cross-site scripting vulnerabilities."
        },
        {
          w: "Custom enterprise MIME types can use any arbitrary string without conventions.",
          r: "RFC standards dictate that unregistered, experimental MIME types must use the `vnd.` (vendor) or `prs.` (personal) tree prefixes (e.g., `application/vnd.mycompany.v1+json`)."
        }
      ],
      trade: {
        buys: [
          "Unambiguous data formatting: clients and servers know precisely how to parse payloads before reading bytes.",
          "Clean separation: decouples file data formatting from volatile, arbitrary operating system filenames.",
          "Content negotiation: clients use the `Accept` header to dynamically request specific MIME formats (JSON vs XML).",
          "Hardened browser security when combined with the `X-Content-Type-Options: nosniff` header."
        ],
        costs: [
          "Security vulnerability: serving user-uploaded files with incorrect MIME types enables severe XSS attacks.",
          "Configuration overhead: web servers must maintain extensive MIME type lookup tables (mime.types).",
          "Multipart parsing complexity: parsing streaming `multipart/form-data` uploads consumes significant server CPU.",
          "Inconsistent client support for newer media formats (e.g., AVIF, WebP, HEIC)."
        ],
        avoid: [
          "Serving user-uploaded image files without the `X-Content-Type-Options: nosniff` header.",
          "Allowing users to upload SVG files and serving them directly on your primary domain without sanitization.",
          "Omitting character encoding parameters on text payloads (always use `Content-Type: text/html; charset=utf-8`).",
          "Trusting the client-reported `Content-Type` header during file uploads without verifying magic bytes."
        ]
      }
    },
    {
      slug: "redirect",
      why: {
        before: "When a website reorganized its URL structure or moved a page, old links and bookmarks died completely, returning unhelpful 404 Not Found errors to users.",
        problem: "Moving URLs destroyed search engine SEO rankings, broke inbound external links, and frustrated users who clicked on saved bookmarks or shared email links.",
        shift: "HTTP redirection provides standardized 3xx response status codes and a `Location` header, instructing clients and search engine crawlers to automatically navigate to a new target URL."
      },
      num: {
        t: "HTTP Redirection Status Codes, Cacheability, and Method Preservation",
        h: ["Status Code", "RFC Name", "HTTP Method Preserved?", "Browser Cacheability", "Canonical Web Application"],
        r: [
          ["301", "Moved Permanently", "NO (Historically mutates POST -> GET)", "Heavily cached by browsers and CDNs", "Permanent domain migration, HTTP -> HTTPS upgrade"],
          ["302", "Found (Temporary)", "NO (Historically mutates POST -> GET)", "Non-cacheable by default", "Temporary maintenance redirect, login page routing"],
          ["303", "See Other", "YES (Explicitly forces GET method)", "Never cached", "Post/Redirect/Get (PRG) pattern after form submissions"],
          ["307", "Temporary Redirect", "STRICTLY YES (Preserves POST/PUT)", "Non-cacheable by default", "Temporary service rerouting where POST payload must not change"],
          ["308", "Permanent Redirect", "STRICTLY YES (Preserves POST/PUT)", "Heavily cached by browsers and CDNs", "Permanent API endpoint migration preserving POST/PUT bodies"]
        ],
        n: "HTTP redirection (RFC 7231 §6.4) instructs a user-agent to issue a subsequent request to a URI specified in the `Location` response header: $\\text{Client} \\xrightarrow{\\text{GET } U_1} \\text{Server} \\xrightarrow{3xx, \\ \\text{Location: } U_2} \\text{Client} \\xrightarrow{\\text{GET } U_2} \\text{Server}$. The historical ambiguity of 301 and 302 led early browsers to rewrite state-mutating `POST` requests into safe `GET` requests upon redirect. To resolve this, modern HTTP specifications bifurcate redirection: 303 (See Other) explicitly forces method mutation to `GET` (ideal for the Post/Redirect/Get pattern preventing double form submission), whereas 307 and 308 strictly mandate that the client *must preserve the identical HTTP method and payload body* when issuing the follow-up request to $U_2$."
      },
      miss: [
        {
          w: "A 301 Moved Permanently and a 302 Found behave identically and can be used interchangeably.",
          r: "301 transfers permanent SEO link equity (PageRank) and is aggressively cached by browsers on disk; 302 is temporary, transfers zero permanent SEO authority, and is not cached by default."
        },
        {
          w: "A 301 permanent redirect cached by a user's browser can easily be cancelled by changing the server config.",
          r: "Browsers cache 301 redirects indefinitely on local disk; once cached, the browser will never query your server again to check for updates, making mistaken 301 redirects notoriously difficult to undo."
        },
        {
          w: "Using a 301 redirect on a POST request will preserve the POST body and submit it to the new URL.",
          r: "Browsers historically mutate 301 redirects into GET requests, stripping the POST body; if you must preserve POST payloads during a permanent redirect, you must strictly use HTTP 308."
        },
        {
          w: "Redirect chains (A -> B -> C -> D) have zero impact on website performance.",
          r: "Every redirect hop incurs an additional network Round-Trip Time (RTT) and TLS handshake; a 3-hop redirect chain can add 500-1,000ms of latency, destroying mobile page speed."
        }
      ],
      trade: {
        buys: [
          "Preserves SEO authority and search engine ranking value when restructuring website directories.",
          "Seamless user experience: legacy bookmarks, shared links, and marketing URLs continue functioning.",
          "Post/Redirect/Get (PRG) pattern prevents users from accidentally resubmitting payment forms on refresh.",
          "Enforces system-wide security policies: automatically upgrades unencrypted HTTP connections to HTTPS."
        ],
        costs: [
          "Latency tax: each redirect requires a full additional network round-trip before content can be fetched.",
          "Risk of infinite redirect loops (`ERR_TOO_MANY_REDIRECTS`) if redirect rules misconfigure circular paths.",
          "Permanent cache hazard: misconfigured 301/308 redirects become permanently stuck in user browser caches.",
          "Method mutation surprises: losing POST payloads when using legacy 301/302 redirects."
        ],
        avoid: [
          "Using 301 permanent redirects during initial testing or temporary website maintenance.",
          "Creating long redirect chains (e.g., http -> https -> www -> path); redirect directly to the final target.",
          "Using 301/302 for API redirects where POST/PUT request bodies must be preserved (use 307/308).",
          "Creating circular redirect rules where URL A points to URL B and URL B points to URL A."
        ]
      }
    },
    {
      slug: "cookie-and-session",
      why: {
        before: "HTTP was designed as a completely stateless protocol where every request was an isolated event; servers had no memory of previous requests, forcing users to log in on every page click.",
        problem: "Web applications could not maintain shopping carts, track user authentication, or remember user preferences across page navigations without ugly URL parameter hacking.",
        shift: "Cookies and sessions establish stateful continuity: the server stores user session data in a database and issues a lightweight, secure cookie token that the browser transmits automatically on subsequent requests."
      },
      num: {
        t: "Cookie Security Flags, Storage Attributes, and Attack Defenses",
        h: ["Cookie Attribute / Flag", "Configuration Syntax", "Browser Enforcement Rule", "Primary Threat Mitigated", "Production Invariant"],
        r: [
          ["HttpOnly", "HttpOnly", "Blocks JavaScript from reading document.cookie", "Cross-Site Scripting (XSS) token theft", "Mandatory for all sensitive auth session cookies"],
          ["Secure", "Secure", "Transmits cookie strictly over encrypted HTTPS/TLS", "Man-in-the-Middle (MITM) network eavesdropping", "Mandatory in production environments"],
          ["SameSite=Strict", "SameSite=Strict", "Never sent on cross-origin requests or external link clicks", "Cross-Site Request Forgery (CSRF)", "Optimal for high-security banking/financial portals"],
          ["SameSite=Lax", "SameSite=Lax", "Sent on top-level GET navigations; blocked on cross-origin POST", "CSRF attacks while preserving user login on link clicks", "Modern browser default standard"],
          ["SameSite=None + Secure", "SameSite=None; Secure", "Sent across all third-party embedded contexts (iframes)", "Third-party embedded iframe workflows", "Required for embedded widgets; high tracking scrutiny"]
        ],
        n: "HTTP state management (RFC 6265) decouples identity identification from session state storage. When a user authenticates, the server instantiates a session record $S = \\{\\text{userId}, \\text{roles}, \\text{createdAt}\\}$ inside a fast in-memory datastore (e.g., Redis). The server generates an opaque, cryptographically random high-entropy token $T \\in \\{0,1\\}^{256}$ and emits the HTTP header: `Set-Cookie: sessionId=T; Secure; HttpOnly; SameSite=Lax; Path=/`. On subsequent requests, the browser's cookie jar automatically injects the cookie header: `Cookie: sessionId=T`. The server performs an $O(1)$ lookup in Redis: $S = \\text{Redis.get}(T)$, restoring identity without client tampering. The `HttpOnly` flag ensures the DOM API `document.cookie` cannot access the secret, mathematically preventing malicious XSS script payloads from exfiltrating the session."
      },
      miss: [
        {
          w: "Storing authentication tokens in browser localStorage is safer than using cookies.",
          r: "localStorage has zero security protections: any Cross-Site Scripting (XSS) vulnerability can read all localStorage tokens in a single line of JavaScript; auth tokens belong in `HttpOnly`, `Secure` cookies."
        },
        {
          w: "A cookie stores the user's full profile, email, and permissions directly on their computer.",
          r: "A secure cookie stores only an opaque, random session ID token; all real user data, permissions, and sensitive records reside securely in the server-side database or Redis session store."
        },
        {
          w: "Setting the `Secure` flag on a cookie prevents Cross-Site Scripting (XSS) attacks.",
          r: "The `Secure` flag only prevents transmission over unencrypted HTTP (preventing MITM attacks); preventing XSS script access requires the `HttpOnly` flag."
        },
        {
          w: "Cookies are sent only to the exact full URL path that originally set them.",
          r: "By default, cookies are transmitted across the entire domain and all subdirectories matching the `Domain` and `Path` attributes; broad domain scopes (`Domain=.example.com`) expose cookies to all subdomains."
        }
      ],
      trade: {
        buys: [
          "Seamless stateful authentication: users remain logged in across page navigations and browser restarts.",
          "Hardened security against XSS token theft via the browser-enforced `HttpOnly` flag.",
          "Automated browser transmission: zero JavaScript code required to manually attach auth headers on requests.",
          "Built-in Cross-Site Request Forgery (CSRF) defense when configured with `SameSite=Lax` or `Strict`."
        ],
        costs: [
          "Cross-Site Request Forgery (CSRF) risk: browsers send cookies automatically, requiring Anti-CSRF token defenses.",
          "Server-side storage overhead: maintaining millions of active user sessions inside Redis or database clusters.",
          "Payload overhead: large or numerous cookies are transmitted in HTTP headers on every single request, including static images.",
          "Third-party cookie restrictions: modern browsers (Safari, Chrome) actively block or restrict cross-site tracking cookies."
        ],
        avoid: [
          "Omitting the `HttpOnly` flag on sensitive authentication session cookies.",
          "Storing sensitive plaintext passwords, credit cards, or PII directly inside cookie values.",
          "Using `SameSite=None` without simultaneously enforcing the `Secure` HTTPS flag.",
          "Setting overly broad `Domain` attributes that leak production cookies to staging or developer subdomains."
        ]
      }
    },
    {
      slug: "csv",
      why: {
        before: "Sharing tabular structured datasets between different spreadsheet programs, databases, and programming languages required complex, proprietary binary file formats (like Excel `.xls`).",
        problem: "Proprietary binary spreadsheets could not be parsed on servers without heavy closed-source libraries, broke across platforms, and were impossible to process in streaming pipelines.",
        shift: "Comma-Separated Values (CSV, RFC 4180) establishes a minimalist, human-readable plain-text tabular format that represents rows as text lines and columns as delimiter-separated fields."
      },
      num: {
        t: "CSV Delimiters, RFC 4180 Invariants, and Parsing Hazards",
        h: ["CSV Dimension / Feature", "RFC 4180 Standard Rule", "Regional / Common Variation", "Parsing Failure Vector", "Security Vulnerability"],
        r: [
          ["Field Delimiter", "Strictly a comma (,)", "Semicolon (;) in European locales (where comma is decimal point)", "Splitting naive string on commas breaks on quoted fields", "Delimiter confusion on unquoted text"],
          ["Quoted Field Escaping", "Enclosed in double quotes: \"value, with comma\"", "Single quotes or backslash escapes (Non-standard)", "Parser crashes on embedded unescaped quotes", "Premature string termination"],
          ["Embedded Quote Escaping", "Escaped by doubling: \"Hello \"\"World\"\"\"", "Backslash escaped: \\\"Hello\\\" (Non-RFC)", "Parsers corrupt trailing fields", "Field misalignment across rows"],
          ["Line Delimiter", "CR-LF (\\r\\n) CRLF standard", "LF (\\n) on POSIX / Unix", "Line break inside quoted field interpreted as new row", "Row splitting desynchronization"],
          ["Cell Value Payload", "Plain text strings or numbers", "Dynamic formulas starting with =, +, -, @", "Spreadsheets execute payload automatically", "CSV / Formula Injection (RCE in Excel/Calc)"]
        ],
        n: "CSV is formalized by RFC 4180 as a MIME type `text/csv`. A compliant CSV file comprises records delimited by CRLF (`\\r\\n`), where each record consists of fields separated by commas. If a field contains a delimiter, line break, or double-quote, the entire field must be enclosed in double-quotes: `\"field\"`. Embedded double-quotes are escaped by two consecutive double-quotes: `\"\"`. A notorious security hazard is CSV Formula Injection (CWE-1236): if an application exports untrusted user input to CSV, an attacker can input `=cmd|' /C calc'!A0`. When an executive opens the downloaded CSV in Microsoft Excel or LibreOffice, the spreadsheet software treats the leading equals sign as a dynamic DDE formula, executing arbitrary operating system commands."
      },
      miss: [
        {
          w: "Writing a custom CSV parser in JavaScript with `line.split(',')` is completely fine.",
          r: "Naive splitting breaks immediately when a field contains a comma inside quotes (e.g., `\"San Francisco, CA\"`); robust CSV parsing requires a full state-machine lexer (e.g., PapaParse)."
        },
        {
          w: "CSV files preserve data types like integers, dates, and boolean flags automatically.",
          r: "CSV is 100% untyped raw text; every value is a string, and parsers must guess types or rely on external schemas to distinguish between the string `'42'`, the integer `42`, or the date `'2026-09-06'`."
        },
        {
          w: "Exporting user text fields directly to a CSV download file has zero security risks.",
          r: "Unsanitized user inputs beginning with `=`, `+`, `-`, or `@` trigger Formula Injection when opened in Excel, executing malware; exported fields starting with formula characters must be prepended with a quote (`'`)."
        },
        {
          w: "A CSV file can be loaded entirely into server memory before parsing, regardless of size.",
          r: "Parsing multi-gigabyte CSVs into memory buffers triggers out-of-memory crashes; production data pipelines must stream CSVs row-by-row using streaming Node.js / Python iterators."
        }
      ],
      trade: {
        buys: [
          "Universal data interoperability: supported by every database, spreadsheet software, and programming language on Earth.",
          "Human readable and editable: inspect, debug, and edit data tables using any plain text editor.",
          "Stream-friendly: rows can be read and written sequentially in chunks without parsing the entire file first.",
          "Zero proprietary lock-in: plain text files remain readable decades into the future."
        ],
        costs: [
          "Lack of formal schema: zero built-in data type enforcement (everything is parsed as raw text strings).",
          "Inefficient storage: text representations of numbers and dates consume vastly more space than binary Parquet.",
          "Vulnerability to CSV Formula Injection attacks in spreadsheet software.",
          "Locale friction: European software using semicolons (`;`) creates parsing incompatibilities with US commas (`,`)."
        ],
        avoid: [
          "Parsing CSV text files using naive regex or `string.split(',')` instead of a robust parser.",
          "Exporting user-provided input into CSV files without escaping leading formula characters (`=`, `+`, `-`, `@`).",
          "Loading multi-million-row CSV files into memory all at once instead of using streaming pipelines.",
          "Assuming all CSV files use commas without verifying whether European semicolons are present."
        ]
      }
    },
    {
      slug: "utf-8",
      why: {
        before: "Computers used hundreds of conflicting legacy 8-bit character encodings (ASCII, Windows-1252, Shift-JIS, ISO-8859-1) that could only support a tiny fraction of global languages.",
        problem: "Opening a file created in Japan on a European computer resulted in 'mojibake' (unreadable corrupted garbage), and international documents combining English, Arabic, and Chinese were physically impossible.",
        shift: "UTF-8 (designed by Ken Thompson and Rob Pike) establishes an ingenious, variable-length universal encoding for all Unicode characters that preserves 100% backward compatibility with 7-bit ASCII."
      },
      num: {
        t: "UTF-8 Bit Patterns, Byte Encodings, and Unicode Ranges",
        h: ["Unicode Code Point Range", "UTF-8 Byte Count", "Byte 1 Pattern", "Byte 2 Pattern", "Byte 3 / Byte 4 Pattern"],
        r: [
          ["U+0000 to U+007F (ASCII)", "1 byte", "0xxxxxxx (7 bits payload)", "None", "None (Identical to 7-bit ASCII)"],
          ["U+0080 to U+07FF (Latin/Greek/Arabic)", "2 bytes", "110xxxxx (5 bits)", "10xxxxxx (6 bits)", "None (Total 11 payload bits)"],
          ["U+0800 to U+FFFF (Asian scripts / Symbols)", "3 bytes", "1110xxxx (4 bits)", "10xxxxxx (6 bits)", "10xxxxxx (Total 16 payload bits)"],
          ["U+10000 to U+10FFFF (Emojis / Historic)", "4 bytes", "11110xxx (3 bits)", "10xxxxxx (6 bits)", "10xxxxxx and 10xxxxxx (Total 21 bits)"],
          ["Overlong Encoding (Anti-Pattern)", "Illegal byte sequences", "Encoding ASCII chars using 2+ bytes", "Strictly rejected by RFC 3629", "Prevents security directory traversal bypasses"]
        ],
        n: "UTF-8 (RFC 3629) is a variable-length character encoding capable of encoding all $1,112,064$ valid code points in Unicode. The architecture features an ingenious mathematical property: *Self-Synchronization*. The leading byte of a multi-byte sequence explicitly declares the total length of the sequence via its count of leading ones (`110x` = 2 bytes, `1110` = 3 bytes, `11110` = 4 bytes), while all continuation bytes strictly begin with the bit pattern `10xxxxxx`. Consequently, an ASCII byte (highest bit `0`) can *never* appear as a continuation byte inside a multi-byte character. If data transmission starts mid-stream or bytes are dropped, a parser scans forward at most 3 bytes to find the next leading byte, achieving instant $O(1)$ re-synchronization without reading from the file beginning."
      },
      miss: [
        {
          w: "Unicode and UTF-8 are two different names for the exact same thing.",
          r: "Unicode is the universal abstract catalog mapping characters to integer code points ($U+0041 = 'A'$); UTF-8 is the physical binary encoding algorithm that converts those code point numbers into bytes on disk."
        },
        {
          w: "UTF-8 files always require a Byte Order Mark (BOM) at the start of the file.",
          r: "UTF-8 is an 8-bit byte sequence and has zero endianness; RFC 3629 explicitly discourages using a BOM in UTF-8, as it corrupts shell scripts, breaks compiler parsers, and introduces invisible character bugs."
        },
        {
          w: "Every character in UTF-8 occupies exactly 1 or 2 bytes.",
          r: "UTF-8 characters scale dynamically from 1 to 4 bytes; common Chinese, Japanese, and Korean characters occupy 3 bytes, and modern emojis occupy 4 full bytes."
        },
        {
          w: "In MySQL, setting the database charset to `utf8` gives you full UTF-8 support.",
          r: "MySQL's historical `utf8` charset is a broken legacy implementation that supports only up to 3 bytes per character, crashing on 4-byte emojis; modern databases must strictly use `utf8mb4`."
        }
      ],
      trade: {
        buys: [
          "Universal global standard: encodes every human language, mathematical notation, and emoji without corruption.",
          "100% backward compatible with legacy ASCII: existing ASCII tools process UTF-8 text seamlessly.",
          "Self-synchronizing byte stream: corruption of one byte never cascades to corrupt the rest of the document.",
          "Storage efficiency: English text consumes zero extra bytes compared to raw 7-bit ASCII."
        ],
        costs: [
          "String indexing complexity: finding the $i$-th character requires $O(N)$ scanning rather than $O(1)$ pointer math.",
          "Storage inflation for Asian scripts: Chinese, Japanese, and Korean characters consume 3 bytes in UTF-8 vs 2 in UTF-16.",
          "Security vulnerability to 'overlong encodings' if parsers fail to enforce strict RFC 3629 validation.",
          "Visual confusion caused by homoglyph attacks (spoofing identical-looking Cyrillic characters in URLs)."
        ],
        avoid: [
          "Using MySQL's legacy `utf8` charset instead of `utf8mb4` (which breaks on emojis).",
          "Adding a Byte Order Mark (BOM: `EF BB BF`) to the beginning of UTF-8 files.",
          "Assuming byte length (`Buffer.byteLength`) equals character length (`string.length`) in software.",
          "Using non-UTF-8 encodings (like ISO-8859-1 or Windows-1252) in new modern web projects."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
