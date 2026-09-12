/* BACKEND — 50+ Hardcore Question Bank (Staff/Principal Level). */

/* ===================================================================
   Module: arch — (15 Hardcore Questions)
   =================================================================== */

TD.addMCQ("backend", "arch", [
  {
    "tag": "TCP TIME_WAIT 2*MSL State",
    "lvl": "advanced",
    "q": "Why must a TCP socket endpoint that actively initiates connection termination linger in the `TIME_WAIT` state for $2 \\times \\text{MSL}$ (Maximum Segment Lifetime, typically 1–2 minutes)?",
    "o": [
      "To allow the CPU to cool down",
      "To ensure the final ACK sent to the remote host arrives reliably (retransmitting ACK if remote retransmits FIN) and to prevent delayed duplicate packets from an old connection from corrupting a newly spawned connection on the same IP:port tuple",
      "To keep SSL certificates warm in RAM",
      "To prevent DNS spoofing"
    ],
    "a": 1,
    "x": "TIME_WAIT ensures the final ACK is received by the remote endpoint (handling lost ACKs) and allows any wandering delayed segments from the old connection to expire from the network before reusing that port."
  },
  {
    "tag": "TCP Head-of-Line (HOL) Blocking in HTTP/2 vs HTTP/3",
    "lvl": "advanced",
    "q": "Why does HTTP/2 still suffer from TCP Head-of-Line (HOL) blocking across multiplexed streams, and how does HTTP/3 (QUIC) resolve this?",
    "o": [
      "HTTP/2 uses text instead of binary",
      "In HTTP/2, all multiplexed streams share a single TCP connection; a single lost TCP packet stalls delivery of **all** streams until the lost packet is retransmitted. HTTP/3 runs over UDP with independent per-stream QUIC packet loss recovery",
      "HTTP/3 eliminates encryption",
      "HTTP/2 is single-threaded"
    ],
    "a": 1,
    "x": "TCP enforces strictly ordered byte stream delivery. If packet 3 of stream A is dropped, TCP blocks streams B and C in the OS kernel until packet 3 is retransmitted. QUIC operates over UDP where streams are independent."
  },
  {
    "tag": "Constant-Time HMAC Timing Attack Defense",
    "lvl": "advanced",
    "q": "Why is comparing authorization HMAC tokens using standard JavaScript `stringA === stringB` vulnerable to timing attacks, and how does `crypto.timingSafeEqual` prevent it?",
    "o": [
      "`===` converts strings to numbers",
      "Standard equality operators return `false` immediately upon encountering the first mismatching byte ($O(k)$ time), allowing attackers to deduce characters one-by-one by measuring sub-microsecond response latencies; `timingSafeEqual` executes in constant time ($O(N)$) by comparing all bytes regardless of mismatches",
      "`===` leaks memory to the OS",
      "`crypto.timingSafeEqual` hashes strings in GPU"
    ],
    "a": 1,
    "x": "Early-exit string comparison leaks the position of the first invalid byte via precise execution timing measurements. Constant-time comparison executes identical clock cycles regardless of where mismatches occur."
  },
  {
    "tag": "HikariCP Database Connection Pool Formula",
    "lvl": "advanced",
    "q": "According to PostgreSQL and HikariCP performance benchmarks (Brett Wooldridge), what is the optimal formula for maximum database connection pool size on a multi-core server with spinning disks/SSD?",
    "o": [
      "$\\text{Connections} = \\text{CPU Cores} \\times 100$",
      "$\\text{Connections} = 2 \\times \\text{CPU Cores} + \\text{Effective Spindle Count}$ (e.g. 17 connections on an 8-core CPU)",
      "$\\text{Connections} = \\text{Concurrent Web Users}$",
      "$\\text{Connections} = 1,000$"
    ],
    "a": 1,
    "x": "Excess connections create severe OS thread context-switching and disk page lock thrashing. Optimal pool size is small: $2 \\times \\text{Cores} + \\text{Disk Spindles}$."
  },
  {
    "tag": "Ephemeral Socket Exhaustion",
    "lvl": "advanced",
    "q": "When a high-throughput microservice makes thousands of outbound HTTP/1.1 API calls per second without HTTP Keep-Alive, why does the server experience sudden `EADDRNOTAVAIL` socket errors?",
    "o": [
      "DNS servers crash",
      "Each closed TCP connection lingers in OS `TIME_WAIT` for 60 seconds; opening thousands of short-lived connections exhausts the entire range of ephemeral client ports (`/proc/sys/net/ipv4/ip_local_port_range`, ~65k ports), preventing new outgoing sockets from opening",
      "HTTP headers exceed 8KB",
      "The database ran out of disk space"
    ],
    "a": 1,
    "x": "Without persistent connection pooling (Keep-Alive), every outbound request creates a new socket that sits in TIME_WAIT for 60s. High QPS rapidly depletes the ~60,000 ephemeral port range."
  },
  {
    "tag": "Epoll Edge-Triggered vs Level-Triggered",
    "lvl": "advanced",
    "q": "In Linux `epoll` network programming, what is the critical operational requirement when using Edge-Triggered (`EPOLLET`) mode compared to Level-Triggered mode?",
    "o": [
      "Sockets must be synchronous blocking",
      "The application receives a notification **only once** when new data arrives at the network buffer; the worker thread MUST continuously loop `read()` until receiving `EAGAIN` or `EWOULDBLOCK`, otherwise remaining unread bytes will block forever without triggering another event",
      "Sockets must use UDP only",
      "Epoll requires root permissions"
    ],
    "a": 1,
    "x": "Level-triggered fires as long as data remains in the buffer. Edge-triggered fires only on state transitions (empty $\\rightarrow$ non-empty), requiring non-blocking drained reads until `EAGAIN`."
  },
  {
    "tag": "Protobuf Zigzag Varint Encoding",
    "lvl": "advanced",
    "q": "How does Protocol Buffers (Protobuf) Zigzag encoding compress negative signed integers (`sint32` / `sint64`) efficiently?",
    "o": [
      "Compresses integers with zlib",
      "Maps negative numbers to positive integers by interleaving bits ($n \\mapsto (n \\ll 1) \\oplus (n \\gg 31)$), mapping $-1 \\rightarrow 1, 1 \\rightarrow 2, -2 \\rightarrow 3$, allowing small negative numbers like $-1$ to encode in 1 varint byte instead of 10 bytes",
      "Converts integers to ASCII strings",
      "Rounds negative numbers to zero"
    ],
    "a": 1,
    "x": "Standard two's complement for $-1$ is `0xFFFFFFFF` (all 1s, taking 5-10 varint bytes). Zigzag maps small negative integers to small positive integers, encoding in a single byte."
  },
  {
    "tag": "Zero-Copy I/O sendfile() System Call",
    "lvl": "advanced",
    "q": "How does the Linux `sendfile()` system call achieve Zero-Copy file transfer from disk to a network socket?",
    "o": [
      "Transfers files via Bluetooth",
      "Streams data directly from the OS Page Cache buffer to the Network Socket buffer inside kernel space, completely avoiding copying data into user-space application memory buffers and eliminating CPU context switches",
      "Compresses files into RAM",
      "Deletes intermediate file descriptors"
    ],
    "a": 1,
    "x": "Traditional transfers copy Disk $\\rightarrow$ Kernel Page Cache $\\rightarrow$ User Memory $\\rightarrow$ Kernel Socket Buffer. `sendfile()` moves pages directly within kernel space without user-space buffer hops."
  },
  {
    "tag": "Nagle's Algorithm and Delayed ACKs (40ms Latency Spike)",
    "lvl": "advanced",
    "q": "Why does the interaction between Nagle's Algorithm and TCP Delayed ACKs cause mysterious 40ms–200ms latency spikes in RPC microservices?",
    "o": [
      "TCP reboots every 40ms",
      "Nagle's algorithm buffers outgoing small packets until a full TCP segment (MSS) is filled or an ACK is received, while the receiving server's Delayed ACK algorithm waits up to 40ms–200ms before acknowledging partial segments; resolved by setting `TCP_NODELAY` (disabling Nagle)",
      "DNS servers cache packets for 40ms",
      "SSL encryption takes 40ms"
    ],
    "a": 1,
    "x": "Nagle waits for an ACK before sending small packets; Delayed ACK waits for more data before sending an ACK. Both sides deadlock in a 40ms sleep. Setting `TCP_NODELAY` bypasses Nagle."
  },
  {
    "tag": "Linux SO_REUSEPORT Load Balancing",
    "lvl": "advanced",
    "q": "How does the `SO_REUSEPORT` socket option in Linux 3.9+ optimize multi-process web servers (Nginx/Node.js cluster)?",
    "o": [
      "Encrypts sockets in hardware",
      "Allows multiple independent worker processes to bind to the exact same IP:port tuple, with the Linux kernel performing lock-free Layer 4 load balancing of incoming SYN packets across processes to eliminate accept mutex contention",
      "Runs sockets on GPUs",
      "Disables firewall checks"
    ],
    "a": 1,
    "x": "`SO_REUSEPORT` creates separate kernel accept queues per worker process, distributing incoming connection requests evenly with zero inter-process lock contention."
  },
  {
    "tag": "TLS 1.3 0-RTT Early Data Replay Vulnerability",
    "lvl": "advanced",
    "q": "Why is TLS 1.3 0-RTT (Early Data) resumption dangerous for non-idempotent HTTP requests (e.g. `POST /api/transfer-funds`)?",
    "o": [
      "0-RTT uses weak encryption",
      "0-RTT early data does not have forward secrecy or replay protection; a passive network eavesdropper can intercept and re-send the raw 0-RTT encrypted packet to the server, causing the server to execute the state-mutating transaction multiple times",
      "0-RTT crashes browsers",
      "0-RTT disables TLS certificates"
    ],
    "a": 1,
    "x": "Early data is transmitted before the cryptographic handshake finishes. Attackers can replay the recorded 0-RTT payload. Backends must restrict 0-RTT to strictly idempotent GET requests."
  },
  {
    "tag": "Redis 6.0 Threaded I/O Architecture",
    "lvl": "advanced",
    "q": "How does Redis 6.0 utilize multi-threading without introducing locking overhead or race conditions to its core key-value engine?",
    "o": [
      "Runs all commands in parallel threads",
      "Core command execution remains **strictly single-threaded and sequential**, while multi-threading is utilized strictly to offload CPU-intensive network socket reading, protocol parsing, and response writing",
      "Converts Redis to PostgreSQL",
      "Uses thread pools for Lua scripts only"
    ],
    "a": 1,
    "x": "Command execution in Redis remains atomic and single-threaded. Worker threads only handle network read/write and serialization, eliminating socket I/O bottlenecks without concurrency locks."
  },
  {
    "tag": "Reactor vs Proactor I/O Patterns",
    "lvl": "advanced",
    "q": "What is the core architectural difference between the Reactor Pattern (Linux `epoll` / Node.js) and the Proactor Pattern (Windows IOCP / Boost.Asio)?",
    "o": [
      "Reactor is synchronous; Proactor is multithreaded",
      "In the Reactor pattern, the application is notified when an I/O resource is **ready to be read/written**; in the Proactor pattern, the operating system kernel completes the asynchronous read/write directly into application memory and notifies the application when the operation is **finished**",
      "Reactor only works on UDP",
      "Proactor is deprecated"
    ],
    "a": 1,
    "x": "Reactor notifies about I/O readiness (application executes the read syscall). Proactor initiates asynchronous I/O and notifies on completion (kernel fills application buffer)."
  },
  {
    "tag": "Nginx Smooth Weighted Round-Robin Algorithm",
    "lvl": "advanced",
    "q": "Why is Nginx's Smooth Weighted Round-Robin algorithm superior to simple weighted interleaving for balancing backend servers with weights $W = [5, 1, 1]$?",
    "o": [
      "Smooth WRR encrypts requests",
      "Simple weighted interleaving sends 5 consecutive requests to Server A before hitting B and C (creating traffic spikes on A); Smooth WRR distributes A's requests evenly across the sequence (e.g. `A, A, B, A, C, A, A`), keeping server load balanced across time",
      "Smooth WRR uses zero memory",
      "Smooth WRR is for UDP only"
    ],
    "a": 1,
    "x": "Smooth WRR computes dynamic effective weights, interspersing requests to heavily-weighted servers smoothly among other servers to prevent micro-burst hotspots."
  },
  {
    "tag": "HTTP/2 HPACK Huffman Compression Security",
    "lvl": "advanced",
    "q": "Why does HTTP/2 use HPACK static and dynamic indexing tables instead of standard gzip/DEFLATE for header compression?",
    "o": [
      "Gzip is too slow on ARM CPUs",
      "Standard LZ77/DEFLATE compression is vulnerable to CRIME and BREACH side-channel attacks where an attacker observes compressed payload size variations to decrypt secret cookies/tokens; HPACK was specifically designed to mitigate byte-level compression leakage",
      "HPACK requires no memory",
      "Gzip is proprietary"
    ],
    "a": 1,
    "x": "CRIME/BREACH attacks exploit length-leakage in general-purpose streaming compression. HPACK uses fixed static tables and prefix-coded Huffman trees to securely compress HTTP headers."
  }
]);

/* ===================================================================
   Module: node — (10 Hardcore Questions)
   =================================================================== */

TD.addMCQ("backend", "node", [
  {
    "tag": "Node.js Event Loop Microtask Starvation",
    "lvl": "advanced",
    "q": "What happens if a recursive asynchronous function in Node.js continuously schedules work via `process.nextTick()`?",
    "o": [
      "Node.js spawns background threads",
      "The Event Loop is **completely starved and frozen**: the Microtask queue drains before moving to Timers or I/O Poll phases, preventing any I/O events, setTimeout callbacks, or network responses from ever executing",
      "The CPU resets",
      "Node.js converts recursion to a loop"
    ],
    "a": 1,
    "x": "`process.nextTick` queues callbacks into the microtask queue, which executes immediately after the current operation. An infinite recursive nextTick loop prevents the event loop from ever advancing to the I/O phase."
  },
  {
    "tag": "V8 Heap GC Tri-Color Marking",
    "lvl": "advanced",
    "q": "In Google V8's Mark-Sweep Garbage Collector, what does the **Gray** state represent in the Tri-Color marking algorithm?",
    "o": [
      "Dead object ready for deallocation",
      "The object has been reached and visited by GC, but its referenced child objects have not yet been scanned and placed onto the marking worklist",
      "Object is allocated in Old Space",
      "Object is immutable"
    ],
    "a": 1,
    "x": "White = unvisited (potential garbage). Gray = visited, but children unscanned. Black = visited and all referenced children scanned."
  },
  {
    "tag": "Node.js Worker Threads vs Cluster Module",
    "lvl": "advanced",
    "q": "What is the architectural difference in memory sharing between Node.js `worker_threads` and the `cluster` module?",
    "o": [
      "They are identical",
      "`cluster` forks independent OS processes with isolated memory spaces communicating via IPC pipes; `worker_threads` runs lightweight threads inside the same OS process capable of true zero-copy shared memory via `SharedArrayBuffer`",
      "Worker threads cannot execute JavaScript",
      "Cluster module runs only on Windows"
    ],
    "a": 1,
    "x": "`cluster` forks separate processes (copy-on-write memory). `worker_threads` spawn isolated V8 isolates within the same process that can share memory buffers directly."
  },
  {
    "tag": "Node.js Event Listener Memory Leaks",
    "lvl": "advanced",
    "q": "Why does attaching event listeners to long-lived singleton objects (e.g. `process.on('event', callback)`) inside short-lived HTTP request handlers cause rapid memory leaks?",
    "o": [
      "Event listeners consume 10MB each",
      "The closure of the callback retains a reference to the HTTP request/response object in memory; because the singleton `process` object never dies, all accumulated request contexts are prevented from being garbage collected",
      "Event listeners crash V8",
      "Node.js deletes unused listeners"
    ],
    "a": 1,
    "x": "The global emitter retains references to callbacks in an internal array. If the callback captures the request scope, the entire request context remains pinned in memory forever."
  },
  {
    "tag": "Go Goroutine Stack Allocation vs OS Threads",
    "lvl": "advanced",
    "q": "Why can a single Go service spawn 1,000,000 Goroutines concurrently while standard OS threads crash the server at ~10,000 threads?",
    "o": [
      "Goroutines run on GPU",
      "OS threads allocate a fixed 2MB–8MB stack in memory; Goroutines start with a tiny **2KB dynamic stack** that grows and shrinks contiguously on demand, consuming minimal RAM and avoiding kernel context-switch CPU overhead",
      "Goroutines do not use RAM",
      "Go disables memory protection"
    ],
    "a": 1,
    "x": "OS threads reserve megabytes of guard memory. Go's runtime uses tiny 2KB segmented/contiguous stacks and a user-space $M:N$ scheduler, multiplexing millions of goroutines on a few OS threads."
  },
  {
    "tag": "Fastify Radix Tree Routing Performance",
    "lvl": "advanced",
    "q": "Why does Fastify achieve significantly higher HTTP request routing throughput than legacy Express?",
    "o": [
      "Fastify is written in C++",
      "Express matches routes by linearly iterating through an array of regular expressions ($O(N)$); Fastify builds a **Radix Tree (Trie)** (`find-my-way`) achieving deterministic $O(K)$ route matching and uses JIT schema compilation (`fast-json-stringify`)",
      "Fastify disables middleware",
      "Express runs only on 32-bit"
    ],
    "a": 1,
    "x": "Fastify matches routes via deterministic Radix Trees and compiles JSON schemas into optimized JIT serialization functions, avoiding slow `JSON.stringify` object traversal."
  },
  {
    "tag": "Rust Ownership & Borrow Checker Lifetimes",
    "lvl": "advanced",
    "q": "How does Rust guarantee thread safety and eliminate memory bugs (use-after-free, double-free, data races) without a Garbage Collector?",
    "o": [
      "By running all code in single-threaded mode",
      "Enforcing affine type system ownership rules at compile-time: every value has exactly one owner, and you can have either **multiple immutable references (`&T`)** OR **one mutable reference (`&mut T`)**, but never both simultaneously within the same lifetime `'a`",
      "By allocating all memory on disk",
      "By converting code to WebAssembly"
    ],
    "a": 1,
    "x": "Rust's borrow checker enforces the aliasing XOR mutability principle at compile-time, eliminating memory leaks and data races with zero runtime GC pauses."
  },
  {
    "tag": "Go GC GOGC Tuning & Tri-Color Concurrent Sweeping",
    "lvl": "advanced",
    "q": "What is the exact meaning of setting `GOGC=200` in a Go backend service?",
    "o": [
      "Increases garbage collection speed by 200%",
      "The Go runtime will trigger the next concurrent GC cycle only after the reachable live heap memory has grown by **200%** (tripled in size) since the previous collection, trading higher RAM usage for lower GC CPU overhead",
      "Limits maximum memory to 200MB",
      "Disables GC entirely"
    ],
    "a": 1,
    "x": "Default `GOGC=100` triggers GC when heap doubles (100% growth). `GOGC=200` delays GC until heap triples (200% growth), reducing CPU cycles spent in mark-sweep phases."
  },
  {
    "tag": "Go Race Detector Mechanics (-race)",
    "lvl": "advanced",
    "q": "How does the Go Race Detector (`go test -race`) detect unsynchronized concurrent memory access?",
    "o": [
      "By simulating slow networks",
      "Instruments every memory read and write operation with compiler hooks using ThreadSanitizer (TSan), tracking synchronization state via shadow memory vector clocks to detect concurrent unsynchronized reads/writes to the same memory address",
      "By locking all variables with mutexes",
      "By running code in isolated processes"
    ],
    "a": 1,
    "x": "The race detector instruments code with ThreadSanitizer, maintaining 8 bytes of shadow memory per allocation to track memory access history and flag data races."
  },
  {
    "tag": "Memory Leaks via Un-cleared setInterval in Node.js",
    "lvl": "advanced",
    "q": "Why does creating an active `setInterval()` callback that references an external object prevent that object from being garbage collected in Node.js?",
    "o": [
      "Timers run in C++ heap only",
      "The Node.js internal active timer list retains a strong reference to the timer object, which retains the callback function closure, which in turn retains references to all captured variables in its lexical scope until `clearInterval()` is called",
      "V8 ignores intervals during GC",
      "Intervals freeze the event loop"
    ],
    "a": 1,
    "x": "Node's event loop timer queue holds a root reference to active intervals. Any variable captured in the interval closure remains strongly reachable and cannot be garbage collected."
  }
]);

/* ===================================================================
   Module: sec — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("backend", "sec", [
  {
    "tag": "OAuth 2.0 PKCE code_verifier Mechanics",
    "lvl": "advanced",
    "q": "Why is Proof Key for Code Exchange (PKCE, RFC 7636) mandatory for Single Page Apps (SPAs) and Mobile Apps in OAuth 2.0?",
    "o": [
      "To encrypt database passwords",
      "Public clients (SPAs/Mobile) cannot securely keep client secrets; PKCE generates a dynamic cryptographic `code_verifier` and sends `code_challenge = SHA256(code_verifier)` on the authorization request, ensuring an intercepted authorization code cannot be exchanged without the original verifier secret",
      "To eliminate HTTPS requirements",
      "To speed up login by 10x"
    ],
    "a": 1,
    "x": "SPAs cannot store static client secrets. PKCE generates an ephemeral secret per login attempt, proving that the client exchanging the authorization code is the identical client that initiated the auth request."
  },
  {
    "tag": "JWT alg: none Vulnerability",
    "lvl": "advanced",
    "q": "How did the infamous `alg: none` security flaw allow attackers to forge arbitrary JSON Web Tokens (JWTs)?",
    "o": [
      "Exploited zero-day CPU bug",
      "Flawed JWT verification libraries trusted the token's unverified header `alg` field; when an attacker set `\"alg\": \"none\"` and stripped the signature, the library treated the token as valid and bypassed all signature verification checks",
      "Reversed SHA-256 hashes",
      "Cracked RSA private keys"
    ],
    "a": 1,
    "x": "If the backend verification code dynamically determines the verification algorithm from the untrusted token header without an explicit whitelist, an attacker can set `alg: none` to authenticate as any user without a signature."
  },
  {
    "tag": "SameSite Cookie Strict vs Lax vs None",
    "lvl": "advanced",
    "q": "What is the difference in CSRF protection between `SameSite=Strict` and `SameSite=Lax` cookie flags?",
    "o": [
      "`Strict` encrypts cookies; `Lax` does not",
      "`Strict` prevents cookies from being sent on ANY cross-site request (including clicking external links); `Lax` allows cookies to be sent on top-level safe GET navigations (e.g. clicking a link to the site from Google search) while blocking cross-site POST/PUT/DELETE calls",
      "`Lax` disables cookies on mobile devices",
      "`Strict` requires HTTP/2"
    ],
    "a": 1,
    "x": "`SameSite=Strict` suppresses cookies on all cross-origin requests. `SameSite=Lax` permits cookies on top-level safe GET navigations while blocking cross-origin mutation requests (POST/iframe)."
  },
  {
    "tag": "Content-Security-Policy (CSP) Nonce Protection",
    "lvl": "advanced",
    "q": "How does a cryptographic Nonce in `Content-Security-Policy: script-src 'nonce-rAnd0m123'` prevent stored XSS attacks?",
    "o": [
      "Deletes all HTML script tags",
      "The browser refuses to execute any inline `<script>` tag whose `nonce` attribute does not match the exact random, cryptographically secure 128-bit base64 nonce generated dynamically by the backend for that specific HTTP response page",
      "Encodes HTML into base64",
      "Disables JavaScript in the browser"
    ],
    "a": 1,
    "x": "Even if an attacker injects `<script>stealCookie()</script>` into a database, the browser rejects execution because the injected tag lacks the unique single-use cryptographic nonce sent in the CSP header."
  },
  {
    "tag": "CORS Preflight Caching (Access-Control-Max-Age)",
    "lvl": "advanced",
    "q": "How does setting `Access-Control-Max-Age: 86400` optimize frontend API performance?",
    "o": [
      "Caches the API JSON data for 24 hours",
      "Instructs the client browser to cache the preflight `OPTIONS` response for 24 hours (86,400s), eliminating redundant preflight round-trip HTTP requests before subsequent `POST`/`PUT` API calls",
      "Forces SSL certificate validation",
      "Disables CORS completely"
    ],
    "a": 1,
    "x": "Browsers send an `OPTIONS` preflight request before complex CORS calls. `Access-Control-Max-Age` caches this preflight permission, cutting subsequent request latency in half."
  },
  {
    "tag": "Webhook Idempotency Key Tracking",
    "lvl": "advanced",
    "q": "How should a payment webhook handler (e.g. Stripe webhook) prevent duplicate credit card charges during network retry storms?",
    "o": [
      "Disable retries on client",
      "Extract the unique `Idempotency-Key` / event ID from headers and execute an atomic `SET key status NX EX 86400` in Redis; if key already exists, return `200 OK` immediately without re-processing business logic",
      "Delete the webhook endpoint",
      "Process payments asynchronously without checks"
    ],
    "a": 1,
    "x": "Network failures cause webhook providers to retry event delivery. Storing and checking event IDs atomically with TTL in Redis guarantees exactly-once business execution."
  },
  {
    "tag": "OpenAPI / Zod Runtime Contract Validation",
    "lvl": "advanced",
    "q": "Why is runtime contract validation (e.g. Zod / Ajv) mandatory even when TypeScript types are strictly defined across a full-stack codebase?",
    "o": [
      "TypeScript converts code to assembly",
      "TypeScript types are completely erased at compile-time and provide zero validation against incoming HTTP JSON payloads over the network; Zod/Ajv enforces runtime type checking and sanitization at the API boundary",
      "TypeScript types slow down V8",
      "Zod encrypts incoming requests"
    ],
    "a": 1,
    "x": "TypeScript exists solely at compile time. Runtime boundary validation with Zod guarantees untrusted external JSON data matches expected types before hitting business logic."
  },
  {
    "tag": "Redlock Distributed Lock Clock Drift Vulnerability",
    "lvl": "advanced",
    "q": "What was Martin Kleppmann's famous critique regarding the safety of Redis Redlock in distributed systems with un-synchronized physical clocks?",
    "o": [
      "Redis is too slow",
      "Redlock relies on physical system clock monotonicity ($NTP$); if an unsynchronized NTP step jumps a node's clock forward, a lock's TTL expires prematurely while a client is paused in a GC pause, allowing another client to acquire the same lock simultaneously and causing data corruption",
      "Redlock does not support clustering",
      "Redlock requires Raft consensus"
    ],
    "a": 1,
    "x": "Kleppmann demonstrated that asynchronous distributed locks without fencing tokens or consensus (Paxos/Raft) cannot guarantee mutual exclusion in the presence of GC pauses and NTP clock jumps."
  }
]);

/* ===================================================================
   Module: db — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("backend", "db", [
  {
    "tag": "N+1 Query Problem in ORMs",
    "lvl": "advanced",
    "q": "Why does querying 100 users and their profile addresses in an ORM without eager loading trigger the **N+1 Query Problem**?",
    "o": [
      "The database crashes on 100 rows",
      "The ORM executes 1 query to fetch 100 users (`SELECT * FROM users`), and then loops and executes 1 separate query for EACH user to fetch their address (`SELECT * FROM addresses WHERE user_id = ?`), resulting in 101 round-trip queries instead of 1 `JOIN`",
      "ORMs cannot handle foreign keys",
      "N+1 query runs in $O(1)$ time"
    ],
    "a": 1,
    "x": "Without eager fetching (`JOIN FETCH` or `selectinload`), the ORM lazily queries child tables per entity inside an application loop, destroying database throughput with 100 round-trips."
  },
  {
    "tag": "Optimistic vs Pessimistic Concurrency Locking",
    "lvl": "advanced",
    "q": "In a high-concurrency e-commerce checkout service with rare inventory conflicts, why is **Optimistic Locking** (`UPDATE items SET qty = qty - 1, version = version + 1 WHERE id = 1 AND version = 5`) preferred over Pessimistic Locking (`SELECT FOR UPDATE`)?",
    "o": [
      "Optimistic locking runs in RAM only",
      "Optimistic locking avoids holding exclusive database row locks during external network API calls (e.g. payment gateway processing), maximizing throughput and aborting/retrying only if a rare version collision occurs on commit",
      "Pessimistic locking cannot update records",
      "Optimistic locking requires NoSQL"
    ],
    "a": 1,
    "x": "Holding database row locks while calling external payment gateways blocks all concurrent checkouts. Optimistic version checking executes fast with zero held locks during I/O."
  },
  {
    "tag": "Database Sharding Key Selection: Hash vs Range",
    "lvl": "advanced",
    "q": "What is the primary drawback of Range-Based Sharding (e.g. sharding by `created_at` timestamp) compared to Hash-Based Sharding?",
    "o": [
      "Range queries are impossible",
      "All concurrent write operations target the newest time range partition on a single database shard (creating a massive write hotspot), leaving historical shards idle",
      "Hash sharding corrupts data",
      "Range sharding uses 10x more disk"
    ],
    "a": 1,
    "x": "Time-based range sharding funnels 100% of incoming writes to the latest date shard, saturating a single server while other shards sit idle. Hash sharding distributes writes evenly across shards."
  },
  {
    "tag": "SQL Prepared Statements Security Mechanics",
    "lvl": "advanced",
    "q": "How do Prepared Statements (Parameterized Queries) mathematically eliminate SQL Injection at the query parser level?",
    "o": [
      "By escaping single quote characters with regex",
      "The SQL engine pre-compiles the query template into an Abstract Syntax Tree (AST) structure first; parameter values are bound directly to AST leaf nodes as literal data after compilation, making it impossible for user input to alter the syntax or logic tree of the query",
      "By converting SQL to JSON",
      "By running queries in read-only mode"
    ],
    "a": 1,
    "x": "Prepared statements compile the execution plan and syntax tree before parameters are injected. User input is treated strictly as data literals and can never modify the parser's syntax tokens."
  },
  {
    "tag": "Distributed Rate Limiting via Redis Token Bucket Lua Script",
    "lvl": "advanced",
    "q": "Why must distributed Token Bucket rate limiting in Redis be implemented as an atomic Lua script rather than separate `GET` and `SET` commands?",
    "o": [
      "Lua scripts compile to machine code",
      "Separate `GET` and `SET` commands create a race condition (check-then-act) between concurrent microservice workers; executing the calculation inside a Redis Lua script runs atomically on the single Redis thread without distributed locks",
      "Redis does not support numbers",
      "Lua scripts encrypt user IPs"
    ],
    "a": 1,
    "x": "Evaluating remaining tokens and updating timestamps across separate Redis commands leads to race conditions. Lua scripts execute atomically in Redis, ensuring perfect concurrency safety."
  },
  {
    "tag": "Background Job Delayed Queues with Redis Sorted Sets",
    "lvl": "advanced",
    "q": "How do distributed job processors (BullMQ / Celery / Sidekiq) schedule delayed background tasks in Redis?",
    "o": [
      "Using JavaScript `setTimeout`",
      "Adding job payloads to a Redis **Sorted Set (ZSET)** with `score = scheduled_execution_timestamp`; background workers periodically poll `ZRANGEBYSCORE zset -inf <current_time> LIMIT 0 1` and atomically pop ready tasks",
      "Storing jobs in text files",
      "Using Redis pub/sub channels"
    ],
    "a": 1,
    "x": "Sorted sets index jobs by execution epoch timestamp score. Workers poll tasks where `score <= now` and atomically transfer them to active execution lists."
  },
  {
    "tag": "Database Connection Pool Validation Query Overhead",
    "lvl": "advanced",
    "q": "Why is `testOnBorrow` (running `SELECT 1` on every connection checkout from a pool) anti-pattern in high-throughput microservices?",
    "o": [
      "`SELECT 1` crashes PostgreSQL",
      "It doubles database query load (every 1 real business query executes 1 validation query first); modern connection pools (HikariCP) use TCP keepalive and asynchronous idle eviction timers instead of synchronous checkout validation",
      "`SELECT 1` consumes 10MB of RAM",
      "Validation queries are for MySQL only"
    ],
    "a": 1,
    "x": "Validating connections on every checkout adds an extra round-trip per query. Modern pools rely on TCP KeepAlive and heartbeat threads to verify connection health asynchronously."
  }
]);

/* ===================================================================
   Module: deploy — (10 Hardcore Questions)
   =================================================================== */

TD.addMCQ("backend", "deploy", [
  {
    "tag": "Graceful Shutdown SIGTERM Draining",
    "lvl": "advanced",
    "q": "What sequence of operations must a production web backend execute upon receiving a `SIGTERM` signal during zero-downtime rolling updates?",
    "o": [
      "Immediately kill the process with `process.exit(0)`",
      "1) Stop accepting new connections and fail readiness health checks, 2) Complete in-flight HTTP requests within a grace period (e.g. 30s), 3) Flush logging/metrics buffers and close database connection pools, 4) Exit process",
      "Delete all database tables",
      "Restart the server immediately"
    ],
    "a": 1,
    "x": "Failing readiness checks informs the load balancer to stop routing new traffic. Waiting for active in-flight requests to complete before closing DB pools prevents dropping user requests mid-execution."
  },
  {
    "tag": "Blue-Green vs Canary Deployment Risk",
    "lvl": "advanced",
    "q": "What is the key difference in traffic management and failure blast radius between a Blue-Green deployment and a Canary deployment?",
    "o": [
      "Blue-Green uses Docker; Canary does not",
      "Blue-Green switches 100% of user traffic instantaneously to the new environment; Canary routes a tiny percentage (e.g. 1%–5%) of live traffic to the new version to monitor error rates and latency before gradual rollout, limiting failure blast radius",
      "Canary requires two identical full-size production clusters",
      "Blue-Green cannot rollback"
    ],
    "a": 1,
    "x": "Canary deployments minimize risk by exposing a small subset of real user traffic to the new release, observing error metrics before rolling out fleet-wide."
  },
  {
    "tag": "Zero-Downtime Database Schema Migrations",
    "lvl": "advanced",
    "q": "How do you rename a column `old_name` to `new_name` in a high-throughput relational table without application downtime?",
    "o": [
      "`ALTER TABLE table RENAME COLUMN old_name TO new_name;` during peak hours",
      "Use Expand/Contract pattern: 1) Add `new_name` column, 2) Deploy app writing to both columns and reading from `old_name`, 3) Backfill historical data, 4) Deploy app reading from `new_name`, 5) Drop `old_name`",
      "Take the database offline for 2 hours",
      "Delete the table and rebuild it"
    ],
    "a": 1,
    "x": "Instant column renames crash older application versions during rolling updates. The Expand-and-Contract (multi-phase) migration maintains dual compatibility across deployment versions."
  },
  {
    "tag": "Unix Domain Sockets vs Loopback TCP",
    "lvl": "advanced",
    "q": "Why are Unix Domain Sockets (UDS) ~30% faster than Loopback TCP (`127.0.0.1`) for local inter-process communication (e.g. Nginx reverse proxy to Node.js backend on same host)?",
    "o": [
      "UDS uses UDP",
      "UDS bypasses the entire TCP/IP network stack (no checksums, no packet routing, no TCP flow control/congestion control headers), operating as direct in-memory kernel byte streams with zero network serialization overhead",
      "UDS runs in GPU memory",
      "TCP/IP is deprecated on Linux"
    ],
    "a": 1,
    "x": "Unix domain sockets operate purely through OS kernel memory buffers without the overhead of TCP packet framing, sliding window flow control, port management, or checksum calculation."
  },
  {
    "tag": "Liveness vs Readiness Probe Semantics",
    "lvl": "advanced",
    "q": "In container orchestration (Kubernetes), what is the fundamental difference between a **Liveness Probe** failure and a **Readiness Probe** failure?",
    "o": [
      "Both immediately restart the container",
      "A **Readiness Probe** failure temporarily removes the container from the load balancer service endpoints (preventing traffic while the app warms up caches or recovers from temporary overload); a **Liveness Probe** failure immediately terminates and restarts the deadlocked container",
      "Liveness probe deletes the pod permanently",
      "Readiness probe is for databases only"
    ],
    "a": 1,
    "x": "Readiness controls traffic routing (stops sending requests to warming/overloaded pods). Liveness controls process lifecycle (restarts stuck/deadlocked pods)."
  },
  {
    "tag": "Cache-Control no-cache vs no-store Directives",
    "lvl": "advanced",
    "q": "What is the exact semantic difference between `Cache-Control: no-cache` and `Cache-Control: no-store`?",
    "o": [
      "They are identical",
      "`no-cache` allows browsers/CDNs to store the response, but **MUST revalidate with the origin server (e.g. via ETag)** before serving; `no-store` forbids the response from ever being written to disk or memory caches under any circumstances (mandatory for sensitive banking data)",
      "`no-store` caches for 1 hour",
      "`no-cache` deletes cookies"
    ],
    "a": 1,
    "x": "`no-cache` means 'store, but revalidate with origin before every use'. `no-store` means 'never write this response to volatile or persistent cache anywhere'."
  },
  {
    "tag": "HTTP ETag Conditional Requests (304 Not Modified)",
    "lvl": "advanced",
    "q": "How do `ETag` and `If-None-Match` HTTP headers save network bandwidth during web API communication?",
    "o": [
      "Compresses JSON to 1 byte",
      "The client sends `If-None-Match: \"hash123\"`; if the server's computed resource hash matches, the backend returns an empty `304 Not Modified` response header with **zero response body bytes**, allowing the client to reuse its cached copy",
      "Deletes unread notifications",
      "Converts HTTP to WebSocket"
    ],
    "a": 1,
    "x": "Conditional requests send the entity tag hash. If unchanged, the server returns 304 without payload bytes, saving network egress."
  },
  {
    "tag": "HTTP Status Code Semantics (400 vs 409 vs 422)",
    "lvl": "advanced",
    "q": "When should an API return `HTTP 409 Conflict` versus `HTTP 422 Unprocessable Entity`?",
    "o": [
      "409 is for database errors; 422 is for network errors",
      "`422 Unprocessable Entity` is used when request syntax is valid JSON but semantic validation fails (e.g. negative age); `409 Conflict` is used when the request violates current resource state constraints (e.g. unique username already registered or version concurrency conflict)",
      "409 is for GET requests only",
      "422 is deprecated"
    ],
    "a": 1,
    "x": "422 signifies semantic payload validation error. 409 signifies a conflict with current server state (e.g. unique constraint collision or edit race)."
  },
  {
    "tag": "gRPC Streaming over HTTP/2 Frames",
    "lvl": "advanced",
    "q": "How does gRPC achieve bidirectional streaming over a single TCP connection?",
    "o": [
      "Uses WebSocket handshakes",
      "Multiplexes Protobuf binary message payloads over HTTP/2 `DATA` frames with 5-byte length-prefixed headers inside independent HTTP/2 bidirectional streams",
      "Polls the server every 10ms",
      "Converts gRPC to JSON"
    ],
    "a": 1,
    "x": "gRPC frames binary Protobuf payloads over HTTP/2 data frames, allowing client and server to stream messages concurrently over an open stream."
  },
  {
    "tag": "JVM DNS Lookup Cache Infinite TTL Trap",
    "lvl": "advanced",
    "q": "Why do Java/JVM backends fail to discover updated load balancer IP addresses when connecting to AWS ALB / Cloudflare endpoints?",
    "o": [
      "JVM disables DNS",
      "By default with a Security Manager enabled, the JVM caches successful DNS name resolutions **forever (`networkaddress.cache.ttl=-1`)**, continuing to send requests to dead IP addresses after AWS ALB dynamic DNS IP rotation; resolved by setting `networkaddress.cache.ttl=30`",
      "JVM only supports IPv6",
      "DNS queries are blocked by garbage collector"
    ],
    "a": 1,
    "x": "Java's default DNS cache policy caches hostnames indefinitely, preventing connection re-routing when cloud load balancers dynamically alter IP addresses."
  }
]);

