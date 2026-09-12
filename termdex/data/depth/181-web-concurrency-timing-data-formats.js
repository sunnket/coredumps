(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "debounce",
      why: {
        before: "Every keystroke typed into a search input or every pixel of a window resize event fired an immediate API request or expensive DOM layout calculation.",
        problem: "Fast typing generated dozens of redundant network requests per second, overloading backend databases, causing out-of-order race conditions, and freezing browser rendering.",
        shift: "Debouncing postpones function execution until a specified duration of inactivity has elapsed, collapsing rapid continuous event bursts into a single execution."
      },
      num: {
        t: "Debounce Execution Modes, Timing Invariants, and Use Cases",
        h: ["Debounce Mode", "Execution Trigger Moment", "Timer Reset Behavior", "Worst-Case Latency", "Canonical Application"],
        r: [
          ["Trailing Edge (Default)", "After quiet period $\\Delta$ with zero calls", "Reset on every incoming call", "Unbounded if calls never pause", "Search auto-complete typeahead, auto-save drafts"],
          ["Leading Edge (Immediate)", "Immediately on first call in burst", "Locks execution until quiet period $\\Delta$", "Zero latency for initial call", "Preventing double-click button submissions"],
          ["Leading & Trailing", "On first call AND after quiet period", "Resets trailing timer on calls", "Bounded by burst duration + $\\Delta$", "Interactive slider scrubbing with instant start and final settle"],
          ["Debounce with Max Wait", "Trailing edge OR when maxWait reached", "Resets timer up to maxWait limit", "Strictly bounded by maxWait", "Real-time collaborative editing buffers"],
          ["Debounced Search with AbortController", "Trailing edge + cancels prior fetch", "Cancels in-flight network promises", "Bounded by network RTT", "Fast search API calls with zero out-of-order responses"]
        ],
        n: "Debouncing is a temporal filtering function that transforms an event stream $E = \\{e(t_1), e(t_2), \\dots, e(t_k)\\}$ into a single output invocation. In a trailing-edge debounce with quiet duration $\\tau$, each incoming event clears the pending timer and registers a new timer: $t_{\\text{exec}} = t_{\\text{current}} + \\tau$. Execution occurs if and only if $\\Delta t = t - t_{\\text{last}} \\ge \\tau$. If events arrive continuously with inter-arrival intervals $\\delta < \\tau$, execution is starved indefinitely. To prevent infinite starvation in high-frequency inputs, production implementations (e.g., Lodash `debounce`) incorporate a `maxWait` parameter, guaranteeing execution occurs at least once every $T_{\\text{max}}$ interval regardless of ongoing activity."
      },
      miss: [
        {
          w: "Debouncing and throttling are two different words for the exact same rate-limiting function.",
          r: "Debounce waits for a pause in events before executing once; throttle guarantees execution at a steady, fixed rate (at most once every $N$ milliseconds) during continuous activity."
        },
        {
          w: "A debounced search input eliminates the need for backend rate limiting.",
          r: "Debouncing is a client-side performance optimization; attackers bypassing your frontend using scripts can still flood your backend with unthrottled requests."
        },
        {
          w: "Debouncing guarantees that asynchronous network responses will return in the exact order typed.",
          r: "If multiple debounced requests fire over a slow connection, variable network latency can cause the response for an earlier keystroke to arrive after a later one, requiring an AbortController."
        },
        {
          w: "Creating a debounced function directly inside a React component render function works cleanly.",
          r: "Re-rendering re-creates the debounced function and its internal timer on every render, completely breaking debounce state; debounced handlers must be wrapped in `useCallback` or `useRef`."
        }
      ],
      trade: {
        buys: [
          "Drastic reduction in unnecessary network requests: cuts search API call volume by 80-95%.",
          "Prevents browser UI thread freezing during high-frequency window resize or orientation events.",
          "Eliminates wasted auto-save database writes by waiting until the user finishes typing a thought.",
          "Protects backend systems from being overwhelmed by fast user input bursts."
        ],
        costs: [
          "Perceived latency: user must stop typing and wait for the quiet period (e.g., 300ms) before seeing results.",
          "Starvation hazard: continuous event streams without a maxWait parameter will never execute.",
          "State management complexity in reactive UI frameworks (React hooks, component lifecycles).",
          "Memory overhead if thousands of un-cleared debounce timers accumulate during unmount."
        ],
        avoid: [
          "Re-instantiating debounced functions on every React render without memoization.",
          "Omitting a `maxWait` parameter when debouncing operations that must eventually execute during sustained input.",
          "Using debounce when throttle is needed (e.g., tracking continuous scroll positions for infinite scroll).",
          "Forgetting to cancel pending debounce timers when a component unmounts."
        ]
      }
    },
    {
      slug: "throttle",
      why: {
        before: "Continuous browser events—such as scrolling, mouse movement, or canvas dragging—fired hundreds of times per second, triggering heavy layout reflows and recalculations on every single pixel.",
        problem: "Unregulated event handling saturated the browser main thread, dropped frame rates below 60 FPS, caused severe visual stutter (jank), and drained mobile device batteries.",
        shift: "Throttling enforces a strict rate ceiling on function execution, guaranteeing that a function executes at most once per specified time interval during continuous event streams."
      },
      num: {
        t: "Throttling Algorithms, Execution Windows, and Animation Alignment",
        h: ["Throttling Strategy", "Timing Window Primitive", "Execution Rate", "Frame Alignment", "Canonical Use Case"],
        r: [
          ["Timestamp Throttle", "Date.now() delta check ($t - t_{\\text{last}} \\ge \\Delta$)", "At most once every $\\Delta$ ms", "Asynchronous with display refresh", "API rate limiters, logging telemetry"],
          ["requestAnimationFrame (rAF)", "Browser vsync display cycle (~16.6ms)", "Exactly once per browser paint frame", "100% synchronized with GPU vsync (60/120Hz)", "Scroll-linked animations, parallax effects, canvas drawing"],
          ["Token Bucket Throttling", "Bucket holds $B$ tokens; refills at rate $R$", "Allows initial burst up to $B$, then rate $R$", "Decoupled from display", "Network traffic shaping, API client rate limiting"],
          ["Leaky Bucket Throttling", "Queue processes requests at constant rate $R$", "Strict, uniform output rate", "Decoupled from display", "Smoothing out bursty data packet transmissions"],
          ["Leading + Trailing Throttle", "Executes immediately on start + final trailing execution", "Guarantees start and final settle", "Asynchronous timer interval", "Infinite scrolling feeds with final edge check"]
        ],
        n: "Throttling guarantees that a function $f$ is invoked at a maximum frequency: $f_{\\text{rate}} \\le \\frac{1}{\\Delta t}$. Given a continuous sequence of events arriving at times $t_1, t_2, \\dots$, the throttle gate evaluates the duration since the last execution: if $t_{\\text{now}} - t_{\\text{last}} \\ge \\Delta t$, execution proceeds and $t_{\\text{last}} \\leftarrow t_{\\text{now}}$. Otherwise, the call is suppressed (or queued as a trailing edge). For graphical web interfaces, throttling UI operations using raw millisecond timers is an anti-pattern: human eyes detect frame drops when timer ticks fall out of phase with the display monitor's 60Hz or 120Hz vertical blanking interval (vsync). The mathematically optimal UI throttle is `window.requestAnimationFrame()`, which aligns callbacks directly to the browser compositor's render clock ($~16.6\\text{ ms}$ at 60 FPS)."
      },
      miss: [
        {
          w: "Throttling and debouncing are interchangeable techniques for optimizing search input fields.",
          r: "Using throttle on search inputs fires API requests every 300ms while the user is actively mid-word; debounce is correct because it waits until the user pauses typing."
        },
        {
          w: "Throttling a scroll listener to 16ms using `setTimeout` guarantees smooth 60 FPS animations.",
          r: "Timer callbacks do not synchronize with display vsync cycles, causing dropped frames and micro-stutter; UI animations must use `requestAnimationFrame()` or CSS transforms."
        },
        {
          w: "Throttling completely eliminates all dropped events.",
          r: "Throttling intentionally discards intermediate events; if you need to process every single event eventually, you must use a queue or buffer rather than a throttle."
        },
        {
          w: "Client-side throttling replaces the need for server-side API rate limits.",
          r: "Client throttling is purely for local UI performance and polite resource usage; servers must independently enforce token-bucket or leaky-bucket rate limits against malicious clients."
        }
      ],
      trade: {
        buys: [
          "Guarantees regular, predictable execution updates during continuous high-frequency user actions.",
          "Maintains buttery smooth 60/120 FPS rendering by preventing main-thread layout thrashing.",
          "Protects client memory and CPU from being exhausted by endless mousemove or scroll events.",
          "Ensures reliable rate compliance when communicating with strict rate-limited third-party APIs."
        ],
        costs: [
          "Loss of intermediate event data: events occurring between throttle ticks are discarded.",
          "Risk of missing the final state if a trailing edge execution is not configured.",
          "Overhead of managing timer state and lifecycle cleanup inside UI component frameworks.",
          "Slight perceived lag in fast UI interactions if the throttle window is set too long."
        ],
        avoid: [
          "Using millisecond `setTimeout` loops for canvas or DOM animation instead of `requestAnimationFrame`.",
          "Omitting trailing-edge execution on scroll throttles, leaving the final scroll position un-evaluated.",
          "Using throttling on search typeahead inputs where debouncing is the mathematically correct choice.",
          "Failing to clean up throttle handlers when elements are removed from the DOM."
        ]
      }
    },
    {
      slug: "blocking",
      why: {
        before: "Programs executed every operation sequentially on a single thread; when a program requested data from a slow mechanical hard disk or remote network socket, the CPU halted completely.",
        problem: "Synchronous blocking operations froze the entire computer or server: while waiting for a 200ms database query, the system could not handle user keystrokes or accept new incoming network connections.",
        shift: "Non-blocking and asynchronous I/O decouples requests from execution threads, allowing the CPU to continue processing other concurrent work while the operating system handles I/O in the background."
      },
      num: {
        t: "Blocking vs Non-Blocking I/O Models, System Calls, and Concurrency Impact",
        h: ["I/O Model", "POSIX System Call Primitive", "Thread Behavior During I/O", "Concurrency Mechanism", "Scalability Ceiling"],
        r: [
          ["Synchronous Blocking", "read(2) / write(2) on blocking fd", "Thread placed in sleep state by kernel", "One thread per connection (Thread-per-request)", "Low (~1,000 threads before RAM/context thrashing)"],
          ["Non-Blocking Polling", "fcntl(O_NONBLOCK) + EAGAIN check", "Thread loops checking socket readiness", "Busy-waiting / spinlock in user space", "Very Low; wastes 100% CPU on tight spinloops"],
          ["I/O Multiplexing (Reactor)", "epoll(7) / kqueue(2) / select(2)", "Thread sleeps until kernel notifies of ready fds", "Single event loop managing thousands of sockets", "Extremely High (C10K / C100K connections)"],
          ["Asynchronous I/O (Proactor)", "Linux io_uring / Windows IOCP", "Kernel processes read into buffer -> notifies completion", "Zero-copy completion queue ring buffer", "State of the art (Millions of IOPS)"],
          ["CPU-Bound Blocking", "Long synchronous math / crypto loops", "Thread 100% saturated executing instructions", "Worker threads / Subprocesses", "Bounded strictly by physical CPU core count"]
        ],
        n: "In operating systems, a blocking operation forces the calling thread to surrender its CPU time slice, transitioning from the RUNNING state to the BLOCKED/WAITING state in the kernel scheduler. The thread remains asleep until hardware interrupts signal that I/O buffers are populated. In single-threaded, event-driven runtimes like Node.js, the event loop operates as a state machine processing microtasks and timer phases. If a developer executes synchronous CPU-bound operations (e.g., `crypto.pbkdf2Sync` or un-indexed nested JSON loops) directly on the main thread, the entire event loop is blocked: $\\Delta t_{\\text{loop}} = \\infty$, halting all incoming HTTP connections, timer expirations, and socket reads across all concurrent users."
      },
      miss: [
        {
          w: "Asynchronous code using async/await or Promises can never block the execution thread.",
          r: "Async/await only prevents blocking on asynchronous I/O; running a heavy synchronous CPU calculation (like computing prime numbers or resizing an image) inside an async function completely blocks the thread."
        },
        {
          w: "Blocking I/O is always bad and should be eliminated from all software systems.",
          r: "Blocking I/O is simple, straightforward to reason about, and highly efficient for simple command-line scripts, sequential batch utilities, and worker processes with dedicated thread pools."
        },
        {
          w: "Node.js can never block because it is inherently asynchronous.",
          r: "Node.js runs your JavaScript code on a single event loop thread; any blocking synchronous call (e.g., fs.readFileSync, heavy JSON.parse, or infinite loops) freezes the entire server for all users."
        },
        {
          w: "Increasing the thread pool size to 1,000 threads eliminates all blocking bottlenecks.",
          r: "Operating system threads carry heavy memory overhead (~1-8 MB stack each) and context-switching penalties; 1,000 active threads cause CPU thrashing and degrade performance."
        }
      ],
      trade: {
        buys: [
          "Non-blocking I/O allows a single server process to maintain 100,000+ concurrent idle connections (C100K).",
          "Optimal hardware utilization: keeps CPU cores fully utilized without sleeping on disk or network transfers.",
          "Smooth user interface responsiveness: keeps graphical desktop and mobile apps fluid during background data loading.",
          "Enables lightweight green-thread concurrency architectures (Go goroutines, Erlang actors)."
        ],
        costs: [
          "Cognitive complexity: non-blocking asynchronous programming requires managing promises, callbacks, and race conditions.",
          "Stack trace fragmentation: asynchronous call stacks lose context across event loop ticks, complicating debugging.",
          "Vulnerability to CPU starvation: a single accidental synchronous block freezes the entire application.",
          "Error handling complexity: unhandled promise rejections can silently drop or crash processes."
        ],
        avoid: [
          "Calling synchronous file system APIs (e.g., `fs.readFileSync`) inside high-throughput web server request paths.",
          "Executing CPU-heavy tasks (cryptography, image compression, large regexes) on the main event loop thread.",
          "Writing synchronous blocking sleep loops (e.g., `while (Date.now() < target)`) instead of timer delays.",
          "Assuming asynchronous functions automatically execute on separate background CPU hardware threads."
        ]
      }
    },
    {
      slug: "stateless",
      why: {
        before: "Web servers stored user session data (shopping carts, login tokens, multi-step wizard state) directly in the local RAM memory of the specific physical server machine that the user connected to.",
        problem: "If that specific server crashed, user sessions were wiped out; users were bound to a single server via brittle 'sticky sessions', making horizontal auto-scaling and zero-downtime rolling deployments impossible.",
        shift: "Stateless architecture dictates that the server retains zero client state between requests; every incoming request contains all the necessary credentials, context, and data required for any server to process it."
      },
      num: {
        t: "Stateful vs Stateless Architectures, Scaling Mechanics, and Trade-offs",
        h: ["Architectural Model", "Session Storage Location", "Load Balancer Routing Strategy", "Server Failure Impact", "Horizontal Scalability"],
        r: [
          ["Stateful (Server Memory)", "Local server RAM heap (HttpSession)", "Sticky sessions (IP hash / affinity cookie)", "Catastrophic; user sessions lost on crash", "Extremely poor; cannot scale down without dropping users"],
          ["Stateless (Token / JWT)", "Cryptographically signed client token", "Pure Round-Robin / Least Connections", "Zero impact; any server can process request", "Infinite horizontal scaling with zero server state"],
          ["Stateless App + External State Store", "Centralized distributed cache (Redis / DB)", "Round-Robin / Any server pulls from Redis", "Zero impact; session preserved in distributed cache", "High; application tier is completely disposable"],
          ["Stateful Actors (Erlang / Orleans)", "Persistent in-memory virtual actors", "Consistent hashing / Actor directory", "Actor state recovered from event log/snapshot", "High within actor cluster; complex cluster management"],
          ["Serverless Function", "Strictly ephemeral container memory", "Random dispatch to warm/cold microVM", "Containers freeze and terminate at will", "Instantaneous auto-scaling to thousands of instances"]
        ],
        n: "A system is defined as stateless if the execution of request $R_k$ is completely independent of the historical sequence of preceding requests $R_1, R_2, \\dots, R_{k-1}$: $f(R_k, S_{\\text{local}}) = f(R_k, \\emptyset)$. In modern cloud-native architectures (codified in the Twelve-Factor App methodology), applications treat individual server instances as completely disposable cattle, not pets. Session state is either pushed entirely to the client via cryptographically signed self-contained tokens (JSON Web Tokens: $\\text{JWT} = \\text{Base64}(\\text{Header}) . \\text{Base64}(\\text{Payload}) . \\text{Sign}$) or offloaded to a high-speed centralized in-memory datastore (e.g., Redis cluster). This enables load balancers to distribute traffic uniformly across auto-scaling clusters, terminating or booting instances in seconds with zero session loss."
      },
      miss: [
        {
          w: "A stateless application means that user accounts, shopping carts, and databases do not exist.",
          r: "Applications still store state, but the state is externalized into dedicated database and cache tiers (Postgres, Redis); the application compute servers themselves remain completely stateless and disposable."
        },
        {
          w: "Using JWTs automatically makes your application 100% stateless and secure.",
          r: "If your system requires instant session revocation (e.g., revoking stolen tokens), you must maintain a token blacklist or revocation database check, reintroducing shared state validation."
        },
        {
          w: "Sticky sessions on a load balancer provide the same scalability benefits as true statelessness.",
          r: "Sticky sessions bind users to specific servers, causing uneven load distribution, preventing graceful server termination during scale-down, and disconnecting users when servers restart."
        },
        {
          w: "Stateless architectures are always faster than stateful architectures in raw response time.",
          r: "Statelessness incurs overhead: servers must repeatedly validate tokens, fetch user sessions from external Redis clusters over the network, or accept larger payload headers on every request."
        }
      ],
      trade: {
        buys: [
          "Effortless horizontal auto-scaling: dynamically spin up or tear down hundreds of server pods based on load.",
          "Zero-downtime rolling deployments: restart or replace application servers without disrupting user sessions.",
          "High fault tolerance: the sudden crash of a server instance has zero impact on user session continuity.",
          "Simple load balancing: traffic is routed via pure Round-Robin without complex sticky session configurations."
        ],
        costs: [
          "Network latency overhead: every request must retrieve state from an external cache or database.",
          "Increased payload sizes: client tokens (JWTs) must transmit session claims and signatures on every request.",
          "Operational dependency on external state stores (Redis, Memcached) as critical infrastructure tiers.",
          "Instant revocation challenges: revoking stateless tokens requires building secondary blacklist checks."
        ],
        avoid: [
          "Storing user login sessions or uploaded files in local container memory or local ephemeral disk.",
          "Relying on load-balancer sticky sessions as a long-term substitute for refactoring stateful code.",
          "Putting massive, high-entropy data payloads inside stateless client JWT tokens.",
          "Forgetting that if Redis or the database is down, stateless application servers cannot function."
        ]
      }
    },
    {
      slug: "uuid",
      why: {
        before: "Databases identified records using sequential auto-incrementing integers (1, 2, 3, ...), requiring a single centralized database lock to coordinate every new primary key generation.",
        problem: "Auto-incrementing IDs prevented distributed database sharding, caused primary key collisions during database merges, and exposed business metrics to competitors via trivial enumeration attacks (e.g., `/orders/42`).",
        shift: "Universally Unique Identifiers (UUIDs) generate 128-bit identifiers with sufficient mathematical entropy to guarantee global uniqueness across distributed systems without centralized coordination."
      },
      num: {
        t: "UUID Versions, Generation Mechanisms, and Indexing Performance",
        h: ["UUID Version", "Generation Inputs / RFC Standard", "Timestamp Ordered?", "Entropy / Collision Probability", "B-Tree Index Fragmentation"],
        r: [
          ["UUIDv1", "60-bit timestamp + 48-bit MAC address (RFC 4122)", "Yes (100ns intervals)", "Prone to MAC privacy leaks; host collisions", "Moderate fragmentation; time bits ordered backwards"],
          ["UUIDv4 (Standard)", "122 bits of CSPRNG pseudo-random data", "No (Completely random)", "Near-zero ($p \\approx 10^{-15}$ after billions)", "Catastrophic; random inserts destroy B-tree leaf cache"],
          ["UUIDv7 (Modern Standard)", "48-bit Unix timestamp ms + 74-bit random (RFC 9562)", "Yes (Millisecond precision)", "Cryptographically secure random; zero collisions", "Optimal; sequential inserts append cleanly to B-tree leaves"],
          ["ULID (Alternative)", "48-bit timestamp + 80-bit random (Crockford Base32)", "Yes (Millisecond precision)", "Safe; monotonic sorting guarantee", "Optimal; highly compact 26-character URL-safe string"],
          ["Sequential Int (Legacy)", "Centralized DB sequence counter (32/64 bit)", "Yes (Sequential integer)", "Guaranteed collision across shards without coordination", "Optimal disk layout; terrible security & sharding"]
        ],
        n: "A UUID is a 128-bit (16-byte) unsigned integer conventionally formatted as five hexadecimal groups: `8-4-4-4-12` (36 characters including hyphens). UUIDv4 derives its safety from the Birthday Paradox: with 122 bits of true entropy, the probability of generating a collision after creating $k$ identifiers is approximated by $p(k) \\approx 1 - e^{-\\frac{k^2}{2 \\times 2^{122}}}$. To achieve a one-in-a-billion collision risk ($p = 10^{-9}$), a distributed system must generate over $103$ trillion UUIDs. However, UUIDv4 causes severe B-tree index degradation: because hashes are randomly distributed across the keyspace $[0, 2^{128}-1]$, database index insertions occur at random leaf pages, destroying CPU L1/L2 cache locality and forcing massive disk write amplification. Modern RFC 9562 UUIDv7 resolves this by embedding a 48-bit Unix epoch timestamp at the most significant bits, achieving both distributed uniqueness and sequential B-tree append performance."
      },
      miss: [
        {
          w: "Two computers in different parts of the world will eventually generate the same random UUIDv4.",
          r: "The entropy of UUIDv4 ($2^{122}$) is so astronomically vast that generating a duplicate requires creating billions of UUIDs every second for centuries; accidental collisions in practice are effectively impossible."
        },
        {
          w: "UUIDv4 is the best primary key format for high-throughput relational databases like PostgreSQL or MySQL.",
          r: "Random UUIDv4 primary keys cause catastrophic B-tree fragmentation and disk thrashing; modern systems should use time-ordered UUIDv7 or ULID for database primary keys."
        },
        {
          w: "Sequential integer IDs (1, 2, 3) are completely safe to expose in public frontend URLs.",
          r: "Sequential IDs expose severe security and competitive vulnerabilities: attackers can scrape every record by iterating numbers and calculate private business transaction volumes."
        },
        {
          w: "UUIDv1 is safer than UUIDv4 because it includes the computer's physical MAC address.",
          r: "UUIDv1 leaks the physical network hardware MAC address and exact creation timestamp, creating privacy and security surveillance vulnerabilities."
        }
      ],
      trade: {
        buys: [
          "Decentralized generation: clients and microservices generate primary keys instantly without database round-trips.",
          "Security by obscurity: impossible for competitors or attackers to guess or enumerate neighboring record IDs.",
          "Trivial database merging: multiple regional databases can be consolidated without primary key collisions.",
          "Time-ordered UUIDv7 delivers the security of UUIDs with the B-tree indexing efficiency of sequential integers."
        ],
        costs: [
          "Storage overhead: a 128-bit UUID consumes 16 bytes (or 36 bytes as text), quadruple the size of a 32-bit integer.",
          "Foreign key bloat: joining tables across large UUID keys consumes significantly more memory and index space.",
          "Human readability penalty: reciting or typing a 36-character UUID string during support calls is frustrating.",
          "Severe B-tree index fragmentation if using non-time-ordered UUIDv4 on high-volume tables."
        ],
        avoid: [
          "Using raw UUIDv4 as clustered primary keys on massive high-write tables (use UUIDv7 instead).",
          "Generating UUIDs using insecure Math.random() instead of a cryptographically secure random generator (CSPRNG).",
          "Storing UUIDs in databases as un-indexed 36-character text strings instead of native 16-byte UUID types.",
          "Exposing auto-incrementing sequential integers in public REST API URLs and invoice links."
        ]
      }
    },
    {
      slug: "timestamp",
      why: {
        before: "Computers recorded event times using ambiguous, localized text strings (e.g., `03/04/05 08:30 PM`) without recording time zones, calendar standards, or standardized epoch references.",
        problem: "Comparing event order across servers was impossible: software could not tell if `03/04/05` was March 4th or April 3rd, daylight saving shifts created duplicate hours, and chronological sorting failed.",
        shift: "A timestamp represents a precise, unambiguous point on the universal temporal continuum, modeled mathematically as an elapsed duration (seconds or milliseconds) since a fixed global epoch."
      },
      num: {
        t: "Timestamp Formats, Epoch Standards, and Precision Profiles",
        h: ["Timestamp Standard / Type", "Representation Format", "Epoch Reference", "Resolution / Precision", "Year Range / Overflow Limit"],
        r: [
          ["Unix Timestamp (32-bit signed)", "Integer (e.g., 1718000000)", "1970-01-01 00:00:00 UTC", "Seconds", "Overflows on Jan 19, 2038 (Y2038 Problem)"],
          ["Unix Timestamp (64-bit signed)", "Integer / BigInt", "1970-01-01 00:00:00 UTC", "Milliseconds / Nanoseconds", "Valid for ~292 billion years"],
          ["ISO 8601 / RFC 3339", "String: 2026-09-06T18:30:00.000Z", "Universal Coordinated Time (UTC)", "Milliseconds (Configurable)", "Arbitrary 4-digit years; human-readable"],
          ["Monotonic Clock (CLOCK_MONOTONIC)", "Relative CPU ticks / nanoseconds", "System boot time / Hardware counter", "Sub-microsecond", "Monotonically increasing; immune to NTP jumps"],
          ["Database Timestamp (TIMESTAMPTZ)", "Postgres 8-byte microsecond integer", "2000-01-01 00:00:00 UTC (Postgres epoch)", "Microseconds ($10^{-6}\\text{ s}$)", "Valid from 4713 BC to 294276 AD"]
        ],
        n: "In computer systems, time tracking separates into two distinct domains: Wall Clock time (Real Time) and Monotonic Clock time. Wall Clock time represents civil time, anchored to the Unix Epoch: 00:00:00 UTC on January 1, 1970. Wall clocks are vulnerable to non-linear jumps caused by Network Time Protocol (NTP) synchronizations, daylight saving adjustments, and manual clock alterations. Consequently, calculating elapsed operation durations via wall clock subtraction ($t_{\\text{elapsed}} = t_{\\text{end}} - t_{\\text{start}}$) can yield negative numbers. For measuring durations, benchmarking, and timeouts, systems must query monotonic clocks: $\\frac{dt_{\\text{mono}}}{dt} > 0$ strictly, guaranteeing monotonically increasing ticks derived from invariant CPU hardware counters."
      },
      miss: [
        {
          w: "Storing timestamps in local server time is fine as long as the server stays in the same physical office.",
          r: "Storing local time corrupts history during Daylight Saving Time fall-back (creating duplicate, ambiguous timestamps) and makes future cloud migration across regions a data-cleaning nightmare; always store UTC."
        },
        {
          w: "The Unix 2038 problem (Y2038) is an imaginary myth that was already solved years ago.",
          r: "Any 32-bit signed integer storing Unix epoch seconds will overflow at 03:14:07 UTC on January 19, 2038, wrapping into negative numbers and crashing legacy embedded systems and C databases."
        },
        {
          w: "You should measure function execution duration using `new Date()` or `Date.now()`.",
          r: "System wall clocks jump forward and backward during NTP clock synchronization; accurate performance durations must be measured using monotonic clocks (`performance.now()` or `clock_gettime(CLOCK_MONOTONIC)`)."
        },
        {
          w: "An ISO 8601 string without a time zone offset (e.g., '2026-09-06T12:00:00') represents UTC.",
          r: "A timestamp lacking an explicit 'Z' or offset indicator represents floating local wall time, which different parsers interpret in unpredictable time zones; unambiguous timestamps must end in 'Z' or explicit offsets."
        }
      ],
      trade: {
        buys: [
          "Universal chronological ordering: numeric timestamps allow instant sorting via standard integer comparison.",
          "Total elimination of temporal ambiguity when standardized to UTC and ISO 8601 / RFC 3339 formats.",
          "Efficient storage: 64-bit integer timestamps consume only 8 bytes of storage while preserving millisecond precision.",
          "Accurate performance diagnostics and distributed tracing when backed by monotonic clocks."
        ],
        costs: [
          "Human readability penalty: raw Unix epoch integers (e.g., 1772841600) cannot be interpreted without conversion tools.",
          "Storage bloat when storing timestamps as verbose 24-character ISO 8601 text strings in high-volume tables.",
          "Complexity of handling leap seconds in high-frequency financial trading systems.",
          "Risk of silent overflow bugs on legacy 32-bit integer timestamp database columns."
        ],
        avoid: [
          "Storing timestamps in non-UTC local time zones in production databases.",
          "Using wall clock time (`Date.now()`) to measure execution durations instead of `performance.now()`.",
          "Defining new database timestamp columns using 32-bit integers (always use 64-bit integers or TIMESTAMPTZ).",
          "Parsing dates from unstructured, locale-dependent strings like 'MM/DD/YYYY' across international users."
        ]
      }
    },
    {
      slug: "time-zone",
      why: {
        before: "Local communities set clocks strictly by the local solar noon; traveling 50 miles meant adjusting watches by arbitrary minutes, making scheduled train routes and telegraph networks impossible to coordinate.",
        problem: "When software systems interact globally, naive date handling causes catastrophic bugs: users see events scheduled on the wrong day, billing cycles charge customers early, and scheduled jobs run twice or not at all.",
        shift: "Time zones standardize geographic regions into legal offsets from Universal Coordinated Time (UTC), governed by historical geopolitical rules and Daylight Saving Time (DST) transitions."
      },
      num: {
        t: "Time Zone Conventions, Offset Invariants, and Storage Rules",
        h: ["Time Representation", "Offset from UTC", "Daylight Saving (DST) Aware?", "Historical Rule Stability", "Canonical Production Usage"],
        r: [
          ["Coordinated Universal Time (UTC)", "Constant $+00:00$", "No (Zero DST; invariant continuum)", "Absolute; internationally defined baseline", "System persistence, database storage, internal API wire payloads"],
          ["Fixed Numeric Offset (e.g., +05:30)", "Static numeric delta (IST)", "No (Fixed offset; no seasonal shifts)", "Subject to national law changes", "Logging local wire event timestamps with offset context"],
          ["IANA Time Zone Name (tzdb)", "Dynamic seasonal offset (e.g., America/New_York)", "Yes (Handles complex DST spring/fall shifts)", "Updated multiple times per year by IANA", "User profile preferences, recurring future calendar events"],
          ["Three-Letter Abbreviation (EST/CST)", "Ambiguous text code", "Partially (EST vs EDT)", "Terrible (CST = Central Standard, China Standard, Cuba Standard)", "Casual human display ONLY; never use for parsing or logic"],
          ["Floating Local Time", "No offset associated", "N/A", "Undefined timezone", "Alarms and store opening hours (e.g., 'open at 9 AM local')"]
        ],
        n: "Time zones are not simple static mathematical offsets; they are geopolitical legal constructs maintained in the IANA Time Zone Database (tzdb, or Olson database). A time zone is an identifier (e.g., `Europe/London`) that maps an instantaneous UTC timestamp $t_{\\text{utc}}$ to a local wall time $t_{\\text{wall}}$ by evaluating complex piecewise historical rules: $t_{\\text{wall}} = t_{\\text{utc}} + \\text{BaseOffset} + \\text{DST}(t_{\\text{utc}})$. During the spring Daylight Saving transition ('spring forward'), an entire hour does not exist (creating a gap where local times like 02:30 AM are invalid). During the fall transition ('fall back'), an hour is repeated, creating an ambiguous local time that maps to two distinct UTC instants. Robust scheduling requires the fundamental rule: *Store in UTC, translate to IANA time zone only at the UI boundary*."
      },
      miss: [
        {
          w: "Three-letter time zone abbreviations like 'CST' or 'PST' are safe to use for storing user time zones.",
          r: "Abbreviations are completely ambiguous: 'CST' stands for US Central Standard Time, China Standard Time, and Cuba Standard Time; systems must always store full IANA identifiers like 'America/Chicago'."
        },
        {
          w: "Every country's time zone is offset from UTC by an exact whole number of hours.",
          r: "Multiple populated regions use half-hour or 45-minute fractional offsets: India is UTC+5:30, Iran is UTC+3:30, Nepal is UTC+5:45, and Central Australia is UTC+9:30."
        },
        {
          w: "Future scheduled events (like a recurring meeting in 6 months) should always be converted and stored in UTC.",
          r: "If a government changes its DST laws between now and the event, a stored UTC timestamp will fire at the wrong local time; recurring future events must store the local time plus the IANA time zone identifier."
        },
        {
          w: "JavaScript `Date` objects allow you to store and preserve custom time zones on the object.",
          r: "JavaScript `Date` objects store strictly a single Unix epoch millisecond integer; any time zone displayed is derived dynamically from the host browser's local operating system settings."
        }
      ],
      trade: {
        buys: [
          "Flawless global user experience: displays dates, times, and schedules in the user's familiar local context.",
          "Eliminates critical billing and scheduling errors around Daylight Saving Time spring/fall transitions.",
          "Enables accurate future event scheduling that respects dynamic international legal time zone modifications.",
          "Complete compliance with international data interchange standards (ISO 8601 / RFC 3339)."
        ],
        costs: [
          "Operational requirement to continuously update the IANA tzdata library across servers as laws change.",
          "Cognitive overhead: developers must master complex rules regarding UTC storage and client-side localization.",
          "Library bundle size: embedding full IANA time zone databases in frontend apps adds significant byte weight.",
          "Edge-case testing complexity: verifying behavior across ambiguous and non-existent local DST transition hours."
        ],
        avoid: [
          "Storing localized time strings without UTC offsets in application databases.",
          "Using ambiguous 3-letter acronyms (EST, BST, CST) in database columns or API schemas.",
          "Assuming adding 86,400 seconds (24 hours) to a timestamp always advances the calendar by exactly one day (DST days have 23 or 25 hours).",
          "Performing date arithmetic using simple string manipulation instead of dedicated temporal libraries (e.g., Luxon, date-fns, Temporal)."
        ]
      }
    },
    {
      slug: "base64",
      why: {
        before: "Early internet communication protocols (like email SMTP and Usenet) were designed strictly to transport 7-bit ASCII text; transmitting raw 8-bit binary files caused byte corruption and dropped packets.",
        problem: "Sending images, compiled binaries, or encrypted keys over text-only protocols resulted in corrupted files because control characters (like null bytes or EOF markers) were stripped or mutated by intermediate mail routers.",
        shift: "Base64 encodes arbitrary 8-bit binary data into a restricted, safe alphabet of 64 printable 7-bit ASCII characters, guaranteeing corruption-free transmission across any text-based network protocol."
      },
      num: {
        t: "Base64 Encoding Mechanics, Variants, and Wire Overhead",
        h: ["Base64 Variant", "Alphabet Characters", "URL / Filename Safe?", "Padding Character", "Primary Application"],
        r: [
          ["Standard Base64 (RFC 4648 §4)", "A-Z, a-z, 0-9, '+', '/'", "No ('+' and '/' conflict with URLs)", "Mandatory '=' padding", "MIME email attachments, PEM SSL certificates, basic auth"],
          ["Base64URL (RFC 4648 §5)", "A-Z, a-z, 0-9, '-', '_'", "Yes (Safe for URL query strings & paths)", "Optional / Stripped padding", "JSON Web Tokens (JWT), WebAuthn credentials, URL tokens"],
          ["Data URI Scheme", "data:<mime>;base64,<data>", "Requires URL encoding if in HTML attrs", "Standard '=' padding", "Embedding small icons and fonts directly into CSS/HTML"],
          ["Base32 (RFC 4648 §6)", "A-Z, 2-7 (Case-insensitive)", "Yes (Avoids visually ambiguous chars)", "'=' padding", "Two-Factor Auth (TOTP/HOTP keys), human-spoken codes"],
          ["Base58 (Bitcoin)", "Alphanumeric minus 0, O, I, l", "Yes", "No padding", "Cryptocurrency wallet addresses; avoids human reading errors"]
        ],
        n: "Base64 represents binary data in a radix-64 representation. The algorithm consumes binary input in 24-bit blocks (3 bytes: $3 \\times 8\\text{ bits}$) and partitions each block into four 6-bit integers ($4 \\times 6\\text{ bits} = 24\\text{ bits}$). Each 6-bit value ($0$ to $63$) indexes into an ASCII lookup table: $[A\\text{-}Z] \\to [0\\text{-}25]$, $[a\\text{-}z] \\to [26\\text{-}51]$, $[0\\text{-}9] \\to [52\\text{-}61]$, $+ \\to 62$, $/ \\to 63$. If the total byte count is not divisible by 3, padding is appended: 1 trailing byte produces two Base64 chars plus `==`; 2 trailing bytes produce three Base64 chars plus `=`. Mathematically, Base64 introduces a constant expansion ratio of $\\frac{4}{3} \\approx 133.33\\%$, inflating wire payload sizes by 33% before transport compression."
      },
      miss: [
        {
          w: "Base64 is a form of encryption that secures passwords and sensitive data from hackers.",
          r: "Base64 is strictly a public, reversible encoding format with zero cryptographic security; anyone can decode Base64 in one second using standard command-line tools like `base64 -d`."
        },
        {
          w: "Inlining all images as Base64 Data URIs inside CSS and HTML files makes web pages load faster.",
          r: "Base64 inflates image file sizes by 33%, blocks parallel browser asset downloads, and prevents independent browser caching of images; it should only be used for tiny (<2 KB) critical icons."
        },
        {
          w: "Standard Base64 strings can be safely passed inside URL paths and query parameters without modification.",
          r: "Standard Base64 uses `+` and `/`, which are reserved URL delimiters (where `+` converts to space); URLs must use the Base64URL variant, which substitutes `-` and `_`."
        },
        {
          w: "Base64 encoding and decoding operations have zero impact on computer CPU performance.",
          r: "Encoding and decoding large multi-megabyte binary blobs in memory consumes significant CPU cycles and creates massive string allocations in garbage-collected runtimes."
        }
      ],
      trade: {
        buys: [
          "Guarantees binary data can be transported safely across text-only protocols (JSON, email, HTML, XML).",
          "Enables embedding assets directly into single-file documents (CSS, HTML Data URIs) to eliminate HTTP requests.",
          "Universal compatibility supported natively in every programming language, runtime, and browser.",
          "Standard wire format for transmitting cryptographic keys, digital signatures, and JWT tokens."
        ],
        costs: [
          "33% bandwidth penalty: increases the uncompressed size of all binary data by one-third.",
          "High memory overhead: decoding large files requires holding both the Base64 string and binary buffer in RAM.",
          "Prevents streaming: standard Base64 payloads are typically processed as monolithic strings rather than streams.",
          "Disables independent browser asset caching when images are inlined directly into HTML or CSS."
        ],
        avoid: [
          "Using Base64 encoding as an attempt to 'encrypt' or hide sensitive user passwords or tokens.",
          "Using standard Base64 in URL query parameters or JWT tokens without switching to Base64URL.",
          "Inlining massive multi-megabyte images or PDF files as Base64 strings into JSON API responses.",
          "Repeatedly re-encoding static binary assets on every incoming HTTP request instead of caching the result."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
