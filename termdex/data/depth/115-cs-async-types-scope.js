/* ==========================================================================
   Depth pass 115 — Computer Science Fundamentals batch 7: Async, Synchronization, Formats & Scopes.
   Race Condition, Mutex, Asynchronous Programming, Callback,
   Promise, Serialisation, Unicode, Floating Point, Scope.

   Peterson lock synchronization, Event Loop microtask queues, IEEE 754 floating-point
   bit representations, UTF-8 variable encoding, and lexical scope closures complete CS fundamentals.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "race-condition",

      why: {
        before: "Software was written with the implicit assumption that instructions executed in strict sequential order, leading to catastrophic, non-reproducible bugs when concurrent threads or processes interleaved execution unexpectedly.",
        problem: "When multiple concurrent threads access shared mutable state without proper synchronization, the final outcome depends on the non-deterministic physical timing of CPU thread scheduling, causing silent data corruption and security vulnerabilities.",
        shift: "**Race Condition: An undesirable situation that occurs when a device or system attempts to perform two or more operations at the same time, but because of the nature of the device or system, the operations must be done in the proper sequence to be done correctly.** Encompassing both data races (unsynchronized memory access) and check-then-act race conditions (TOCTOU), it represents the most notorious bug class in concurrent programming."
      },

      num: {
        t: "Race Condition Taxonomy: Data Races vs Logic Races vs Architectural Flaws",
        h: ["Race Condition Class", "Root Failure Mechanism", "Detection Mechanism", "Primary Vulnerability / Impact", "Mitigation Strategy"],
        r: [
          ["Data Race (Low-Level)", "Concurrent read/write to same memory without sync", "ThreadSanitizer (TSan), Valgrind", "Silent memory corruption, torn reads", "Mutex, Atomics, Memory Barriers, Rust borrow checker"],
          ["Check-Then-Act (TOCTOU)", "Condition checked, state changes before action taken", "Static analysis, stress fuzzing", "Double-spending, privilege escalation", "Atomic compare-and-swap (CAS), database serializable transactions"],
          ["Read-Modify-Write (RMW)", "Interleaved increments (`count++`) across threads", "TSan, formal model checking (TLA+)", "Lost updates (1000 threads yield count < 1000)", "Atomic instructions (`atomic_fetch_add`), Mutexes"],
          ["File System Race", "Temporary file checked before write (`access`/`open`)", "Audit logs, OS system call tracing", "Symlink attacks, unauthorized file overwrite", "Atomic filesystem flags (`O_EXCL | O_CREAT`), `mkstemp`"],
          ["Asynchronous Logic Race", "Unordered network responses resolve in wrong order", "Frontend logging, network interception", "UI displays stale search results over newer ones", "AbortController, generation counters, RxJS `switchMap`"]
        ],
        n: "In theoretical computer science, a **Data Race** is formally defined as: two or more concurrent memory accesses to the same memory location, where at least one access is a write, and the threads do not use any synchronization to coordinate. Under the C++11 and Java memory models, the presence of a data race results in **Undefined Behavior (UB)**: optimizing compilers assume data races do not exist, allowing them to reorder memory writes or optimize away reads entirely. At the CPU hardware level, an operation like `count++` is NOT atomic: it expands into three separate instructions: (1) `MOV EAX, [count]`, (2) `ADD EAX, 1`, and (3) `MOV [count], EAX`. If Thread B is scheduled between steps 1 and 3, both threads read the same initial value and write back the same increment, causing a **lost update**."
      },

      miss: [
        {
          w: "Writing `count++` on a global variable is safe in multi-threaded code because it's a single line.",
          r: "`count++` is **not a single instruction**. In assembly, it requires three distinct hardware steps: read memory into register, increment register, write register back to memory. Without a CPU bus lock (`LOCK XADD` in x86) or atomic wrapper, concurrent threads will interleave these steps and lose updates."
        },
        {
          w: "A race condition will always cause a visible crash or error immediately.",
          r: "Race conditions are notoriously **silent**. A program with a race condition can run perfectly across billions of operations in development, only to silently corrupt database account balances or memory pointers months later under specific heavy production server loads (Heisenbugs)."
        },
        {
          w: "Adding a small sleep (`sleep(10ms)`) is an acceptable way to fix a race condition.",
          r: "Adding a sleep is a **cardinal antipattern** known as 'sleep and pray'. It does not eliminate the race condition; it merely alters timing slightly, guaranteeing the race will reappear under higher system loads or slower hardware. Proper synchronization (mutexes, channels, atomics) is mandatory."
        },
        {
          w: "Single-threaded languages like JavaScript never have race conditions.",
          r: "While JavaScript cannot have low-level memory data races, it is hyper-vulnerable to **asynchronous logic race conditions**. For example, if a user types 'A' and then 'B', triggering two asynchronous API calls, the response for 'A' might arrive *after* the response for 'B', rendering stale search results."
        }
      ],

      trade: {
        buys: [
          "Eliminating race conditions guarantees deterministic, repeatable, mathematically sound program execution.",
          "Protects against catastrophic financial errors: prevents double-spending, negative account balances, and inventory overselling.",
          "Guarantees memory integrity: prevents use-after-free, memory corruption, and security privilege escalations.",
          "Enables robust multi-threaded scaling: allows systems to exploit multi-core CPU hardware safely."
        ],
        costs: [
          "Synchronization latency: acquiring mutexes or atomic memory barriers introduces CPU pipeline stalls and cacheline invalidation.",
          "Risk of deadlocks: introducing locks to prevent race conditions creates the hazard of deadlock cycles.",
          "Cognitive complexity: designing and reasoning about lock-free or synchronized data structures requires high engineering skill.",
          "Reduced parallelism: coarse-grained locks serialize thread execution, eliminating the throughput gains of multi-core hardware."
        ],
        avoid: [
          "Never use non-atomic global variables for thread-shared counters or flags; use `std::atomic` or `AtomicInteger`.",
          "Do not perform 'Check-Then-Act' operations without holding a lock or using atomic compare-and-swap (CAS).",
          "Avoid fixing race conditions with arbitrary `sleep()` or timeout delays; use explicit condition variables or synchronization barriers.",
          "Never compile multi-threaded C/C++/Rust code without running **ThreadSanitizer** (`-fsanitize=thread`) in testing pipelines."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mutex",

      why: {
        before: "Concurrent threads accessing shared critical sections had no reliable mechanism to prevent simultaneous entry, causing concurrent writes, corrupted memory, and broken invariant states.",
        problem: "Software requires a synchronization primitive that guarantees Mutual Exclusion, ensuring that only one thread can execute within a critical section at any given instant while all other competing threads wait.",
        shift: "**Mutex (Mutual Exclusion Lock): A synchronization primitive that grants exclusive access to a shared resource to only one thread at a time.** Featuring two core operations—`lock()` (acquire) and `unlock()` (release)—mutexes enforce the atomicity of critical sections across multi-threaded operating systems."
      },

      num: {
        t: "Synchronization Primitives: Mutex vs Spinlock vs Semaphore vs RWLock",
        h: ["Primitive", "Waiting Mechanism", "Resource Access Rule", "Contention Latency", "Primary Systems Use Case"],
        r: [
          ["Standard Mutex (Futex)", "Sleep / Parks thread in OS scheduler queue", "Strictly 1 thread (ownership enforced)", "Low-to-high (context switch penalty: $\\approx 1\\text{--}5$ $\\mu$s)", "General application multi-threading with long locks"],
          ["Spinlock", "Busy-wait loop (burns CPU cycles spinning)", "Strictly 1 thread", "Zero context switch; burns $100\\%$ CPU core while waiting", "OS kernel interrupt handlers, microsecond critical sections"],
          ["Counting Semaphore", "Sleep / Parks thread when counter $= 0$", "Up to $N$ concurrent threads", "Kernel context switch on exhaustion", "Resource pooling (database connection pools, rate limits)"],
          ["Read-Write Lock (RWLock)", "Sleep / Shared for readers, exclusive for writer", "Multiple readers OR exactly 1 writer", "Higher lock metadata overhead than basic mutex", "Read-heavy, write-rare caches and routing tables"],
          ["Recursive Mutex", "Sleep / Allows same thread to re-acquire lock", "1 thread (tracks re-entrant acquisition depth)", "Slightly higher tracking overhead than flat mutex", "Legacy recursive object call chains"]
        ],
        n: "A Mutex coordinates access to a **critical section**. In modern Linux, high-performance mutexes are implemented via **Futexes (Fast Userspace Mutexes)**: in the uncontended case (no collision), acquiring a mutex is a single-cycle atomic assembly instruction in user-space (`CMPXCHG`), requiring **zero operating system system calls**. Only when contention occurs (another thread already holds the lock) does the thread execute a `sys_futex` system call to put itself to sleep in the kernel scheduler wait queue. Formally, Dijkstra established the requirements for mutual exclusion: (1) **Mutual Exclusion** (no two threads in critical section simultaneously), (2) **Progress** (threads outside critical section cannot block others), and (3) **Bounded Waiting** (no thread waits indefinitely - starvation freedom). Careless lock ordering across multiple mutexes leads to **Deadlock**, violating Coffman's circular wait condition."
      },

      miss: [
        {
          w: "A Mutex and a Binary Semaphore are identical concepts.",
          r: "A Mutex enforces **ownership**: the exact thread that called `lock()` MUST be the thread that calls `unlock()`. A Semaphore has no ownership: any thread can post/signal a semaphore to unblock another thread, making semaphores signaling mechanisms rather than mutual exclusion locks."
        },
        {
          w: "Spinlocks are always faster than mutexes because they avoid context switching.",
          r: "Spinlocks are only faster if the critical section executes in a few CPU nanoseconds. If the thread holding the lock is preempted or executes I/O, spinning threads will **burn 100% of the CPU core** in an empty busy loop, causing massive thermal throttling, power waste, and starving other productive threads."
        },
        {
          w: "A Read-Write Lock (RWLock) is always faster than a Mutex for reading data.",
          r: "RWLocks have significantly higher internal synchronization overhead than simple mutexes (they must atomically update reader counters). In benchmarks with high concurrency and small critical sections, a standard Mutex often outperforms an RWLock due to cacheline bouncing on the reader counter."
        },
        {
          w: "Using a Mutex automatically makes all data structures thread-safe.",
          r: "A Mutex only provides safety if **every single piece of code** that reads or writes the shared data properly acquires and releases the exact same mutex. A single un-synchronized read anywhere in the codebase bypasses the mutex and causes data races."
        }
      ],

      trade: {
        buys: [
          "Guarantees mutual exclusion: ensures critical sections execute atomically without data races or corrupted state.",
          "Low uncontended latency: modern user-space futexes acquire uncontended locks in single-digit nanoseconds.",
          "Thread sleep efficiency: puts waiting threads to sleep, freeing physical CPU cores for other productive work.",
          "Universal ecosystem support: native standard library primitive across all major programming languages (C++, Java, Rust, Go)."
        ],
        costs: [
          "Deadlock hazard: acquiring multiple locks in inconsistent order causes irreversible system deadlocks.",
          "Priority Inversion: a low-priority thread holding a mutex can block a high-priority thread while medium threads run.",
          "Context switch overhead: high contention forces threads into kernel sleep, incurring $1\\text{--}5$ $\\mu$s context switch penalties.",
          "Thread serialization: turns parallel multi-core hardware into single-threaded serial execution during critical sections."
        ],
        avoid: [
          "Never hold a Mutex while executing long-running network requests, database queries, or blocking disk I/O.",
          "Do not acquire multiple mutexes in arbitrary order; always acquire locks in a globally consistent hierarchical order to prevent deadlocks.",
          "Avoid forgetting to unlock in error/exception branches; always use RAII lock guards (`std::lock_guard`, `synchronized`, `defer`).",
          "Never use a Mutex across separate processes without backing it with shared memory and POSIX `PTHREAD_PROCESS_SHARED` flags."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "asynchronous-programming",

      why: {
        before: "Programs performed I/O (disk reads, database queries, network calls) synchronously, blocking the operating system thread entirely until the hardware responded, wasting CPU cycles and freezing user interfaces.",
        problem: "High-throughput servers and responsive UIs need to handle thousands of concurrent operations without dedicating an expensive OS thread to every waiting I/O operation.",
        shift: "**Asynchronous Programming: A form of parallel/concurrent programming that allows a unit of work to run separately from the primary application thread, notifying the main thread upon completion.** Driven by non-blocking I/O multiplexing, event loops, promises, and async/await syntax, asynchronous programming decouples operational latency from thread consumption."
      },

      num: {
        t: "Asynchronous Mechanics: Synchronous Blocking vs Multi-Threaded vs Asynchronous Event Loop",
        h: ["Execution Paradigm", "Thread Scaling per Connection", "Memory Footprint for 10k Conns", "I/O Wait Behavior", "Typical Latency Profile"],
        r: [
          ["Synchronous Blocking (Thread-per-req)", "1 OS kernel thread per connection ($10{,}000$ threads)", "Massive: $\\approx 10\\text{--}80$ GB RAM (thread stacks)", "Thread blocks completely in kernel sleep", "Predictable; high context-switch latency at scale"],
          ["Asynchronous Event Loop (Node.js/Nginx)", "Single OS thread (multiplexed via `epoll`)", "Tiny: $\\approx 50\\text{--}200$ MB RAM (socket descriptors)", "Non-blocking; kernel registers socket notification", "Sub-millisecond latency; susceptible to CPU blocking"],
          ["Async / Await State Machines (Rust/C#)", "ThreadPool of $N$ threads ($N = \\text{CPU cores}$)", "Low: state machines allocated on heap/stack", "Yields execution state; returns thread to pool", "Bare-metal efficiency; zero GC or kernel thread bloat"],
          ["Worker Pool Offloading", "Fixed pool of background worker threads", "Moderate: bounded by pool size", "Thread blocks in pool while caller remains async", "Optimal for integrating legacy blocking C libraries"],
          ["Reactive Streams (RxJava/Project Reactor)", "Event-driven publisher/subscriber channels", "Low: backpressure buffers", "Non-blocking demand-driven streaming", "High throughput; high cognitive design overhead"]
        ],
        n: "Asynchronous programming fundamentally relies on **Non-Blocking I/O**. When a program issues an asynchronous network read, the OS kernel does NOT block the thread; it immediately returns a `EWOULDBLOCK` or `EAGAIN` status code. The runtime registers the socket file descriptor with the kernel's event multiplexer (**`epoll`** on Linux, **`kqueue`** on macOS, **`IOCP`** on Windows). When network packets arrive, the kernel notifies the runtime's **Event Loop**, which pulls the pending callback from the **Task Queue (Macrotasks)** or **Microtask Queue** and executes it. In modern languages with **`async/await`** (Rust, C#, TypeScript, Python), the compiler transforms asynchronous functions into **State Machines**: hitting an `await` pauses execution, yields the thread back to the runtime, and resumes at the exact state machine step when the awaited promise completes."
      },

      miss: [
        {
          w: "Asynchronous code always runs on multiple background CPU threads.",
          r: "Asynchronous code often runs on a **single thread**! In JavaScript (Node.js) or Python AsyncIO, asynchronous I/O runs entirely on the main event loop. Non-blocking I/O delegates waiting to the operating system kernel and hardware network controllers, NOT to background worker threads."
        },
        {
          w: "Making a function `async` automatically makes it run faster.",
          r: "Marking a function `async` adds state machine overhead, promise allocation, and microtask scheduling. If the function performs CPU-bound computation rather than I/O, making it `async` will actually make it **slower** and will still block the event loop."
        },
        {
          w: "Asynchronous programming eliminates the need to worry about race conditions.",
          r: "Asynchronous programming eliminates multi-threaded *data races*, but introduces **asynchronous logic race conditions**. If two asynchronous functions interleave executions across an `await` boundary, they can read and overwrite shared state in non-deterministic order."
        },
        {
          w: "You should use `async/await` for everything in modern codebases.",
          r: "Using `async/await` for simple synchronous in-memory operations adds unnecessary Promise allocations, microtask queue churn, and developer overhead. Asynchronous primitives should be reserved for operations that involve real I/O latency (network, disk, subprocesses)."
        }
      ],

      trade: {
        buys: [
          "Massive I/O scalability: handles tens of thousands of concurrent network connections on a single CPU core without thread exhaustion.",
          "UI responsiveness: keeps main rendering threads smooth and interactive during background data fetching.",
          "Minimal memory consumption: avoids pre-allocating multi-megabyte thread stacks for idle connections.",
          "Clean linear code: `async/await` syntax expresses asynchronous pipelines as clean, sequential readable code."
        ],
        costs: [
          "Event loop blocking vulnerability: a single heavy CPU calculation blocks the entire event loop, freezing all concurrent requests.",
          "Stack trace fragmentation: asynchronous context switching fragments call stacks, making error tracing more difficult.",
          "Function coloring problem: asynchronous functions can only be awaited inside other asynchronous functions ('red/blue function problem').",
          "Complex error handling: unhandled promise rejections or dropped errors can silently crash or leak memory."
        ],
        avoid: [
          "Never execute heavy synchronous CPU math or long loops on an asynchronous event loop thread; offload to a worker thread.",
          "Do not forget to handle promise rejections; unhandled rejections can terminate Node.js processes.",
          "Avoid mixing raw callback APIs with modern `async/await` without wrapping them in proper Promise constructors (`promisify`).",
          "Never use `async` on functions that perform zero asynchronous operations."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "callback",

      why: {
        before: "Synchronous functions blocked execution entirely, while early multi-threaded models required spawning heavyweight threads to wait for operations, with no way to notify the caller when an operation finished without polling.",
        problem: "Asynchronous and event-driven systems require a lightweight mechanism to pass executable instructions to a function so that it can invoke those instructions when a future event or I/O operation completes.",
        shift: "**Callback: A function that is passed as an argument to another function, to be called back at a later time.** Serving as the foundational asynchronous mechanism in C (function pointers) and early JavaScript, callbacks establish event-driven reactivity."
      },

      num: {
        t: "Callback Paradigms: Synchronous vs Asynchronous vs Systems Bindings",
        h: ["Callback Type", "Invocation Timing", "Call Stack Behavior", "Error Handling Strategy", "Typical Real-World Usage"],
        r: [
          ["Synchronous Callback", "Immediately during caller execution", "Runs within caller's current stack frame", "Propagates via standard `try/catch`", "Array iteration (`Array.prototype.forEach`, `sort`)"],
          ["Asynchronous Callback", "Deferred via Event Loop task queue", "Runs on new clean call stack from event loop", "Node.js Error-First convention (`(err, res) => ...`)", "File system read (`fs.readFile`), timer (`setTimeout`)"],
          ["C Function Pointer", "Synchronous or interrupt-driven", "Direct indirect jump via register", "Return codes / integer error statuses", "OS kernel callbacks, C standard library `qsort`"],
          ["Event Handler Callback", "Triggered on external user/hardware event", "Dispatched from browser UI event queue", "Event listener error boundary", "DOM click handlers (`addEventListener`), GUI buttons"],
          ["Continuation-Passing (CPS)", "Explicit tail invocation of next step", "Requires Tail-Call Optimization to avoid stack overflow", "Explicit error continuation function", "Compiler transformations, Scheme/Lisp runtimes"]
        ],
        n: "A callback operates by passing a **function pointer** or closure reference into a higher-order function. In **Synchronous Callbacks** (like `[1, 2, 3].map(x => x * 2)`), the callback is invoked immediately in a blocking fashion within the current execution frame. In **Asynchronous Callbacks** (like `fs.readFile('data.txt', callback)`), the calling function returns immediately; the background I/O subsystem handles the operation, and upon completion, the callback reference is pushed to the **Macro/Task Queue**. When the call stack empties, the Event Loop pulls the callback and invokes it. However, composing multiple asynchronous steps with callbacks leads to the infamous **Callback Hell (Pyramid of Doom)**, where deeply nested functions, manual error forwarding, and fragmented closures make code unreadable and error-prone."
      },

      miss: [
        {
          w: "All callbacks are asynchronous.",
          r: "Callbacks can be completely **synchronous**! `Array.prototype.forEach`, `Array.prototype.map`, and `sort()` in JavaScript, or `qsort()` in C, execute callbacks synchronously on the current call stack before returning."
        },
        {
          w: "You can catch errors from an asynchronous callback using a surrounding `try/catch` block.",
          r: "A surrounding `try/catch` block CANNOT catch errors thrown inside an asynchronous callback! The `try/catch` block finishes executing and exits the call stack long before the asynchronous callback is pulled from the event queue and executed. Asynchronous errors must be handled via error-first callback arguments or Promises."
        },
        {
          w: "Callbacks are a legacy feature that should never be used in modern programming.",
          r: "Callbacks remain the foundational building block of event-driven architectures. DOM event listeners (`addEventListener`), timer APIs, array higher-order methods, and low-level C system bindings rely fundamentally on callbacks."
        },
        {
          w: "A callback function cannot access variables from the function where it was created.",
          r: "In languages with lexical scoping (JavaScript, Python, Rust, Go), callbacks form **closures**, preserving access to variables in their enclosing lexical environment even after the enclosing function has returned."
        }
      ],

      trade: {
        buys: [
          "Zero-abstraction simplicity: minimal syntactic and runtime overhead for passing executable code.",
          "Foundational event handling: maps naturally to hardware interrupts, OS signals, and user interface click events.",
          "High flexibility: allows callers to customize algorithmic behavior (custom comparison, filtering, transformations).",
          "Universal language compatibility: works in low-level languages like C through raw function pointers."
        ],
        costs: [
          "Callback Hell: deeply nested sequential asynchronous callbacks create unmaintainable, heavily indented code.",
          "Inversion of Control: delegating execution to a third-party library risks having callbacks called multiple times, too early, or never.",
          "Broken error handling: requires manually passing error arguments through every layer (`if (err) return cb(err)`).",
          "Fragmented stack traces: asynchronous callback invocations originate from the event loop root, obscuring causal origin."
        ],
        avoid: [
          "Never nest callbacks more than two levels deep; refactor to Promises, `async/await`, or named functions.",
          "Do not forget to return immediately after calling an error callback to prevent executing subsequent success logic.",
          "Avoid writing APIs that are conditionally synchronous and conditionally asynchronous (Zalgo's Law: release Zalgo).",
          "Never throw synchronous exceptions inside an asynchronous callback; pass them through the error parameter or reject handler."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "promise",

      why: {
        before: "Asynchronous programming with nested callbacks resulted in 'Callback Hell' (Pyramid of Doom), unhandled errors, fragmented stack traces, and loss of control over how and when callbacks were invoked.",
        problem: "Software needs a first-class, composable abstraction that represents the eventual completion (or failure) of an asynchronous operation and its resulting value, enabling clean chaining, unified error handling, and parallel coordination.",
        shift: "**Promise: An object representing the eventual completion or failure of an asynchronous operation and its resulting value.** Transitioning through three mutually exclusive states—Pending, Fulfilled, Rejected—Promises standardize asynchronous control flow and form the structural foundation of modern `async/await`."
      },

      num: {
        t: "Promise State Machine & Combinator Mechanics",
        h: ["Combinator / State", "Trigger Condition", "Fulfillment Condition", "Rejection Condition", "Typical Architectural Use Case"],
        r: [
          ["Pending State", "Initial state upon creation", "Transitioned via `resolve(val)`", "Transitioned via `reject(err)`", "Asynchronous operation currently in-flight"],
          ["Fulfilled State", "Terminal state", "Permanent immutable value stored", "Cannot transition to Rejected", "Successful completion; triggers `.then()` handlers"],
          ["Rejected State", "Terminal state", "Cannot transition to Fulfilled", "Permanent error reason stored", "Failed operation; triggers `.catch()` handlers"],
          ["`Promise.all()`", "All inputs resolve", "Resolves with array of all results", "Rejects immediately on FIRST rejection (fail-fast)", "Parallel dependent tasks (fetching user + permissions + preferences)"],
          ["`Promise.allSettled()`", "All inputs settle", "Resolves with array of `{status, value/reason}`", "Never rejects", "Batch processing where partial failures are acceptable"],
          ["`Promise.race()`", "First input settles", "Settles with value of fastest Promise", "Settles with rejection of fastest Promise", "Request timeouts (racing API fetch against timeout timer)"],
          ["`Promise.any()`", "First input fulfills", "Fulfills with value of fastest successful Promise", "Rejects only if ALL reject (AggregateError)", "Querying redundant backup mirrors for fastest response"]
        ],
        n: "A Promise is a formal state machine adhering to the **Promises/A+ specification**. It exists in one of three states: **Pending**, **Fulfilled**, or **Rejected**. The transition from Pending to Fulfilled/Rejected is **one-way and permanent**: once settled, a Promise's value is completely immutable, and subsequent calls to `resolve()` or `reject()` are silently ignored. In the JavaScript runtime, `.then()` and `.catch()` callbacks are scheduled on the **Microtask Queue**, which executes immediately at the end of the current task before the event loop yields to UI rendering, guaranteeing that Promise reactions execute before any Macrotasks (like `setTimeout`). Crucially, `.then()` returns a **new Promise**, enabling clean monadic chaining (`a().then(b).then(c).catch(handleError)`) that completely eliminates nesting."
      },

      miss: [
        {
          w: "A Promise is asynchronous from the instant it is created.",
          r: "The function passed into `new Promise((resolve, reject) => { ... })` (the **executor function**) runs **completely synchronously and immediately**! Only the resolved `.then()` and `.catch()` callback reactions are scheduled asynchronously on the microtask queue."
        },
        {
          w: "`Promise.all()` runs multiple promises in parallel threads.",
          r: "`Promise.all()` does NOT spawn threads. In a single-threaded runtime like JavaScript, it simply initiates multiple non-blocking asynchronous operations concurrently and waits for all of their event loop notifications to resolve."
        },
        {
          w: "Cancelling a Promise is built into the standard Promise specification.",
          r: "Standard ECMAScript Promises are **not cancellable**. Once a Promise is initiated, its underlying asynchronous operation will run to completion regardless of whether the caller is still listening. Cancellation requires external cancellation tokens or the **`AbortController`** API."
        },
        {
          w: "Throwing an error inside an async function crashes the program.",
          r: "Throwing an error inside an `async` function or a `.then()` callback does not crash the call stack; it **automatically converts the error into a rejected Promise**, which can be cleanly caught via `.catch()` or a surrounding `try/catch` around an `await`."
        }
      ],

      trade: {
        buys: [
          "Eliminates Callback Hell: transforms deeply nested asynchronous logic into flat, linear, composable chains.",
          "Unified error propagation: errors bubble down the chain automatically to the nearest `.catch()` handler.",
          "Immutable result caching: once fulfilled, a Promise retains its value forever, allowing multiple consumers to read it anytime.",
          "Powerful concurrency combinators: `Promise.all`, `allSettled`, `race`, and `any` provide standardized coordination patterns."
        ],
        costs: [
          "Memory allocation overhead: each Promise is an allocated heap object with internal handler queues, increasing memory pressure.",
          "Microtask starvation risk: chaining infinite microtasks can starve the event loop, preventing rendering and I/O tasks.",
          "Non-cancellable by default: cannot abort long-running network requests without explicit `AbortSignal` plumbing.",
          "Unhandled rejection hazard: forgetting to attach `.catch()` or `await try/catch` can cause unhandled rejection crashes."
        ],
        avoid: [
          "Never nest Promises inside other Promises; return the inner Promise and chain it with `.then()`.",
          "Do not forget to return Promises inside `.then()` handlers if subsequent steps depend on their completion.",
          "Avoid using `new Promise()` when an existing API already returns a Promise (the Promise Constructor Antipattern).",
          "Never use `Promise.all()` on large arrays of thousands of operations without batching or concurrency limits, as this overwhelms network sockets."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "serialisation",

      why: {
        before: "Data in memory existed as live pointers, virtual method tables, and architecture-specific binary layouts, meaning objects could not be saved to disk, sent across networks, or shared between programs written in different languages.",
        problem: "Software needs a standardized mechanism to convert complex in-memory object graphs into a continuous stream of bytes that can be transmitted across networks or persisted to storage, and accurately reconstructed later.",
        shift: "**Serialisation: The process of translating a data structure or object state into a format that can be stored (for example, in a file or memory data buffer) or transmitted (such as over a computer network) and reconstructed later (deserialisation).** Spanning text formats (JSON, XML) and schema-driven binary formats (Protocol Buffers, Avro, MessagePack), it powers modern distributed computing."
      },

      num: {
        t: "Serialisation Formats: Encoding, Throughput & Schema Enforcements",
        h: ["Format", "Type Representation", "Schema Enforcement", "Payload Size", "Parsing Throughput", "Primary Production Use Case"],
        r: [
          ["JSON", "Human-readable UTF-8 text", "Schema-free (or JSON Schema optional)", "Large (verbose text keys)", "Moderate (CPU text parsing overhead)", "Public REST APIs, web frontend communication"],
          ["Protocol Buffers (Protobuf)", "Binary packed (Varints, Tag-Length-Value)", "Strict compile-time schema (`.proto`)", "Tiny (omits keys; uses numeric field tags)", "Extremely fast (SIMD bit shifting)", "Internal microservice RPCs (gRPC), distributed systems"],
          ["Apache Avro", "Compact binary with embedded/registry schema", "Dynamic strict schema (JSON defined)", "Smallest (zero field tags; schema required to read)", "Fast (high throughput bulk processing)", "Kafka event streaming, Hadoop big data storage"],
          ["MessagePack", "Binary-encoded JSON equivalent", "Schema-free dynamic typing", "Compact binary ($20\\text{--}40\\%$ smaller than JSON)", "Fast (avoids text parsing)", "Low-latency caching (Redis), IoT sensor telemetry"],
          ["Java / Python Native Pickling", "Language-specific binary object graph", "Implicit class definition reflection", "Moderate to large", "Moderate (heavy reflection overhead)", "Internal caching (HIGH SECURITY RISK: Remote Code Execution)"]
        ],
        n: "Serialisation maps non-contiguous, pointer-linked object graphs into a contiguous linear byte sequence. In text formats like **JSON**, field names and values are encoded as UTF-8 character strings, requiring the deserializer to execute expensive string scanning, number conversions (e.g., ASCII string to IEEE 754 float), and memory allocations. In binary formats like **Protocol Buffers**, fields are defined by numeric tags: data is encoded using **Varints** (Variable-length quantities using the MSB as a continuation bit) and **ZigZag Encoding** (mapping signed integers to positive integers: $n \\mapsto 2n$ for $n \\ge 0$, $-2n-1$ for $n < 0$). Field names are completely stripped from the wire payload, reducing bandwidth by $80\\%$ and allowing deserialization via direct pointer offsets in nanoseconds."
      },

      miss: [
        {
          w: "Deserializing untrusted JSON or Protobuf is safe, but deserializing untrusted Python `pickle` or Java serialization is dangerous.",
          r: "This is true! Native language serialization (`pickle` in Python, Java native `ObjectInputStream`, PHP `unserialize`) encodes **executable bytecode and class construction logic**. Deserializing untrusted data with these formats allows attackers to achieve **arbitrary Remote Code Execution (RCE)**. Format serializers like JSON and Protobuf are pure data formats that cannot execute code by design."
        },
        {
          w: "JSON serialization preserves all data types perfectly.",
          r: "JSON has only a handful of primitive types: string, number, boolean, null, object, and array. It CANNOT natively serialize `Date` objects (converted to strings), `Map` or `Set` (converted to arrays or plain objects), `undefined`, functions, `NaN` (converted to `null`), or `BigInt` (throws a `TypeError`)."
        },
        {
          w: "Binary serialization is always faster than text serialization.",
          r: "Well-optimized text parsers (like `simdjson`, which parses gigabytes of JSON per second using AVX-512 vector instructions) can outperform poorly written binary deserializers that allocate dozens of intermediate heap objects per message."
        },
        {
          w: "Circular object references can be serialized with standard `JSON.stringify()`.",
          r: "Standard `JSON.stringify()` throws a fatal `TypeError: Converting circular structure to JSON` if an object contains a reference to itself or an ancestor. Serializing cyclic graphs requires maintaining a visited set or using formats that support reference pointers."
        }
      ],

      trade: {
        buys: [
          "Network interoperability: allows services written in Go, Java, Python, and C++ to exchange structured data seamlessly.",
          "State persistence: enables storing complex runtime memory state on disk or databases for recovery across reboots.",
          "Bandwidth optimization: binary formats (Protobuf, Avro) compress wire traffic, drastically reducing network egress costs.",
          "Schema evolution: strict schema formats support backwards and forwards compatibility as data schemas evolve."
        ],
        costs: [
          "CPU serialization overhead: converting objects to bytes and parsing them back consumes substantial CPU cycles and memory bandwidth.",
          "Security vulnerability vector: insecure deserialization of native language payloads (pickle/Java) enables Remote Code Execution.",
          "Information loss: converting rich OOP classes into plain serialized formats strips behavioral methods and private invariants.",
          "Schema maintenance burden: managing protobuf/avro schema registries across microservices adds operational complexity."
        ],
        avoid: [
          "Never deserialize untrusted data using native language object serializers (`pickle.loads`, Java `readObject`).",
          "Do not use `JSON.stringify()` for high-throughput microservice communication; use Protocol Buffers (gRPC) or Avro.",
          "Avoid serializing circular object references without custom replacer functions or specialized graph serializers.",
          "Never change numeric field tag numbers in Protocol Buffers schemas, as this corrupts backwards compatibility."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "unicode",

      why: {
        before: "Computing systems used disjoint 7-bit and 8-bit character encodings (ASCII, ISO-8859, Shift-JIS, Windows-1252), meaning text written in Japanese, Russian, or Arabic turned into unreadable gibberish ('Mojibake') when opened on different computers.",
        problem: "Global information systems require a universal, unambiguous standard that assigns a unique mathematical identifier to every character, symbol, and emoji in every human writing system.",
        shift: "**Unicode: An information technology standard for the consistent encoding, representation, and handling of text expressed in most of the world's writing systems.** Maintained by the Unicode Consortium, it defines over 149,000 characters across 161 scripts, decoupled from physical byte encoding through UTF-8, UTF-16, and UTF-32."
      },

      num: {
        t: "Unicode Encodings: Physical Byte Layouts, Space & Compatibility",
        h: ["Encoding Format", "Code Unit Width", "Bytes per Character", "ASCII Compatibility", "Primary Production Standard"],
        r: [
          ["UTF-8", "8-bit (1 byte)", "Variable: 1 to 4 bytes", "100% byte-for-byte backward compatible", "Universal standard for the Web, Linux, JSON, APIs ($>98\\%$ of internet)"],
          ["UTF-16 (Little/Big Endian)", "16-bit (2 bytes)", "Variable: 2 or 4 bytes (Surrogate Pairs)", "Incompatible (ASCII chars take 2 bytes)", "Internal memory in Java JVM, JavaScript V8, Windows NT kernel"],
          ["UTF-32", "32-bit (4 bytes)", "Fixed: strictly 4 bytes per code point", "Incompatible (3 bytes of zeroes per ASCII char)", "Internal string indexing in Python 3, specialized terminal emulators"],
          ["ASCII (Historic)", "7-bit", "1 byte (top bit 0)", "Native baseline (Code points $0\\text{--}127$)", "Legacy serial protocols, basic network headers"],
          ["ISO-8859-1 (Latin-1)", "8-bit", "1 byte (256 distinct values)", "Extends ASCII ($128\\text{--}255$)", "Legacy Western European desktop software"]
        ],
        n: "Unicode separates the abstract **Code Point** from the physical **Byte Encoding**. A Code Point is a unique integer designated as `U+XXXX` (ranging from `U+0000` to `U+10FFFF`, totaling 1,114,112 possible code points across 17 Planes). **UTF-8** (Ken Thompson and Rob Pike, 1992) encodes code points into 1 to 4 bytes using a self-synchronizing prefix code: code points $0\\text{--}127$ use 1 byte (`0xxxxxxx`, identical to ASCII); code points $128\\text{--}2047$ use 2 bytes (`110xxxxx 10xxxxxx`); up to 4 bytes for emoji (`11110xxx 10xxxxxx 10xxxxxx 10xxxxxx`). Because bytes $10xxxxxx$ are continuation bytes, a UTF-8 parser can immediately resynchronize after corrupted streams. In text processing, a visual character (user-perceived glyph) is a **Grapheme Cluster**: for example, the emoji '👨‍👩‍👧‍👦' consists of 4 separate emoji code points linked by 3 Zero-Width Joiner (`U+200D`) characters, occupying 25 bytes in UTF-8 while appearing as a single visual symbol."
      },

      miss: [
        {
          w: "One character always equals one byte in computer memory.",
          r: "That was only true for 1970s ASCII. In modern Unicode, a character can occupy anywhere from **1 to 4 bytes** in UTF-8. In fact, a single visual emoji (like a family or flag) can require up to **28 bytes** in memory due to combining code points and skin-tone modifiers."
        },
        {
          w: "`string.length` in JavaScript returns the number of visible characters in a string.",
          r: "JavaScript strings are internally encoded in **UTF-16**. `string.length` returns the number of **16-bit code units**, NOT characters! Any character outside the Basic Multilingual Plane (like emojis or rare Chinese characters) uses a 4-byte **surrogate pair** (two 16-bit units), meaning `'😀'.length` evaluates to **`2`**."
        },
        {
          w: "UTF-8 and Unicode are two competing standards.",
          r: "Unicode is the **abstract catalog** of character numbers (Code Points). **UTF-8** is one specific **encoding format** that serializes those numbers into bytes. Unicode can also be encoded using UTF-16 or UTF-32."
        },
        {
          w: "Truncating a UTF-8 string by cutting it at $N$ bytes is always safe.",
          r: "Slicing an arbitrary byte offset in UTF-8 can slice through the middle of a multi-byte character sequence, leaving trailing invalid continuation bytes that corrupt text and trigger decoding crashes (`UnicodeDecodeError`). Truncation must be grapheme-aware."
        }
      ],

      trade: {
        buys: [
          "Universal linguistic support: accurately represents every language, script, mathematical symbol, and emoji on Earth.",
          "Eliminates Mojibake: universal character mapping prevents corrupted text across different operating systems and languages.",
          "UTF-8 backwards compatibility: seamlessly processes legacy 7-bit ASCII files without requiring translation.",
          "Self-synchronizing byte stream: corrupting a byte in UTF-8 allows parsers to recover on the next character boundary."
        ],
        costs: [
          "Variable-length complexity: indexing the $k$-th visual character in UTF-8/UTF-16 requires an $\\mathcal{O}(N)$ scan.",
          "String length ambiguity: `byte_length != codepoint_count != grapheme_cluster_count`, leading to subtle sizing bugs.",
          "Security attack surface: visually identical characters (homoglyphs, like Cyrillic 'а' vs Latin 'a') enable phishing domain spoofing.",
          "Normalization overhead: characters can have multiple binary representations (e.g., 'é' as single char vs 'e' + combining accent), requiring NFC/NFD normalization."
        ],
        avoid: [
          "Never assume 1 byte = 1 character; never truncate strings by slicing raw byte offsets.",
          "Do not use `str.length` in JavaScript to enforce user-facing character limits for passwords, tweets, or names.",
          "Avoid comparing Unicode strings without normalizing them first using Unicode Normalization Form C (`NFC`).",
          "Never write text to files or network sockets without explicitly specifying an encoding (always default to UTF-8)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "floating-point",

      why: {
        before: "Early computers used fixed-point arithmetic, which could not represent both astronomical numbers (distance to stars) and microscopic numbers (subatomic particle widths) without requiring massive registers and causing severe precision overflow.",
        problem: "Computers need an efficient binary format to represent real numbers across a vast dynamic range within fixed-width registers (32-bit or 64-bit), balancing range and numerical precision.",
        shift: "**Floating Point: A formulaic representation of real numbers as an approximation, allowing a trade-off between range and precision.** Standardized globally by IEEE 754 in 1985, floating point represents numbers in scientific notation: $(-1)^s \\times (1 + m) \\times 2^{e - \\text{bias}}$, establishing uniform hardware arithmetic across all CPUs and GPUs."
      },

      num: {
        t: "IEEE 754 Floating-Point Formats: Bit Anatomy & Precision Bounds",
        h: ["Format", "Total Bits", "Sign Bits ($s$)", "Exponent Bits ($e$)", "Fraction / Mantissa ($m$)", "Significant Decimal Digits", "Approximate Range"],
        r: [
          ["Half Precision (`float16`)", "16 bits", "1 bit", "5 bits (bias 15)", "10 bits", "$\\approx 3.3$ digits", "$\\pm 6.55 \\times 10^4$ (AI training/inference)"],
          ["Single Precision (`float32`)", "32 bits", "1 bit", "8 bits (bias 127)", "23 bits", "$\\approx 7.2$ digits", "$\\pm 3.40 \\times 10^{38}$ (GPUs, graphics shaders)"],
          ["Double Precision (`float64`)", "64 bits", "1 bit", "11 bits (bias 1023)", "52 bits", "$\\approx 15.9$ digits", "$\\pm 1.80 \\times 10^{308}$ (Standard Python `float`, JS `Number`)"],
          ["Bfloat16 (`bfloat16`)", "16 bits", "1 bit", "8 bits (bias 127)", "7 bits", "$\\approx 2.4$ digits", "Matches `float32` range (LLM deep learning)"],
          ["Quadruple Precision (`float128`)", "128 bits", "1 bit", "15 bits (bias 16383)", "112 bits", "$\\approx 34$ digits", "Astrophysics, high-precision cryptography"]
        ],
        n: "The **IEEE 754** standard encodes a real number into three contiguous bitfields: (1) **Sign bit ($s$)**: 0 for positive, 1 for negative, (2) **Biased Exponent ($e$)**: stores power of two with an added bias to eliminate negative sign bits, (3) **Fraction / Mantissa ($m$)**: stores normalized fractional bits with an implicit leading 1 ($1.m_1 m_2 \\dots$). Special bit patterns represent non-finite values: if $e = \\text{all 1s}$ and $m = 0$, the value represents $\\pm \\infty$; if $e = \\text{all 1s}$ and $m \\ne 0$, it represents **NaN (Not a Number)**. Because floating-point numbers are base-2 binary fractions, numbers that have clean finite representations in base-10 (such as $0.1 = 1/10$) become **infinitely repeating binary fractions** in base-2: $0.0001100110011\\dots_2$. Truncating this infinite expansion to 52 bits causes the famous rounding error: `0.1 + 0.2 === 0.30000000000000004`."
      },

      miss: [
        {
          w: "Computers are broken because `0.1 + 0.2` does not equal `0.3` in JavaScript/Python.",
          r: "This is NOT a bug; it is an inherent mathematical property of **base-2 binary floating point**. Just as $1/3$ cannot be represented finitely in base-10 ($0.3333\\dots$), the decimal fraction $0.1$ ($1/10$) cannot be represented finitely in base-2 binary. When converted to IEEE 754 double precision, rounding errors produce `0.30000000000000004`."
        },
        {
          w: "Floating-point numbers can be used to store financial currency and money.",
          r: "Using floating-point numbers for money is a **critical architectural failure**. Accumulated binary rounding errors in balance subtractions, interest calculations, and sales tax will silently corrupt financial accounting. Financial systems MUST use fixed-point arithmetic, arbitrary-precision decimals (`BigDecimal`), or integer cents."
        },
        {
          w: "Checking equality with `a == b` is perfectly safe for floating-point numbers.",
          r: "Direct equality comparisons (`==`) on floating-point values will randomly fail due to subtle calculation path rounding differences. Floating point numbers must ALWAYS be compared using an **epsilon tolerance threshold**: `Math.abs(a - b) < EPSILON`."
        },
        {
          w: "NaN equals NaN in floating-point comparisons.",
          r: "By IEEE 754 specification, **`NaN == NaN` is strictly FALSE**! NaN is defined to be not equal to anything, including itself. The only way to check if a value is NaN is via `Number.isNaN(x)` or `x !== x` (which is only true for NaN)."
        }
      ],

      trade: {
        buys: [
          "Astronomical dynamic range: represents both $10^{-308}$ and $10^{308}$ within a compact 64-bit memory word.",
          "Hardware-accelerated speed: modern CPU and GPU Floating Point Units (FPUs) execute billions of float operations per second.",
          "Global standardization: IEEE 754 guarantees mathematically identical results across all modern CPU and GPU architectures.",
          "Reduced precision formats (FP16, BF16) double or quadruple deep learning matrix throughput on modern GPUs."
        ],
        costs: [
          "Imprecise representation: cannot represent decimal fractions (0.1, 0.2) exactly, causing rounding drift.",
          "Catastrophic cancellation: subtracting two nearly equal numbers loses precision digits, multiplying relative error.",
          "Non-associative arithmetic: $(a + b) + c \\ne a + (b + c)$ in floating point, meaning compiler reordering alters answers.",
          "Unsuitable for financial calculations: accumulated rounding errors violate accounting and legal compliance."
        ],
        avoid: [
          "Never use `float` or `double` to store money, financial balances, or currency transactions; use integer cents or `BigDecimal`.",
          "Do not check floating-point equality with `==`; compare using an epsilon boundary (`abs(a - b) < 1e-9`).",
          "Avoid adding very small numbers to very large numbers in tight loops; the small numbers get rounded out of existence.",
          "Never assume `(a + b) + c` yields the exact same bitwise output as `a + (b + c)` across different compiler optimization levels."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "scope",

      why: {
        before: "Early programming languages placed all variables into a single global namespace, meaning any function could accidentally overwrite variables used by other functions, causing chaotic, unpredictable side effects.",
        problem: "Software requires systematic boundaries that govern the visibility, accessibility, and lifetime of identifiers (variables, functions), preventing name collisions and enforcing information hiding.",
        shift: "**Scope: The current context of execution in which values and expressions are 'visible' or can be referenced.** Predominantly formalized as Lexical (Static) Scope, scope binds identifiers to specific syntactic blocks, functions, or modules, enabling closures and lexical encapsulation."
      },

      num: {
        t: "Scope Classifications: Resolution Timing, Boundaries & Mechanics",
        h: ["Scope Type", "Boundary Definition", "Lookup Resolution Timing", "Shadowing Permitted?", "Language Adoption"],
        r: [
          ["Lexical (Static) Scope", "Physical textual structure of source code", "Compile-time (or AST parse time)", "Yes (inner shadows outer)", "JavaScript, Python, C, C++, Rust, Java, Go"],
          ["Dynamic Scope", "Runtime execution call stack history", "Runtime (scans caller stack frames)", "Yes (callee reads caller state)", "Emacs Lisp, Bash, early Lisp (rare in modern general languages)"],
          ["Block Scope", "Syntactic curly braces `{ ... }`", "Compile-time block boundary", "Yes", "C, C++, Java, Rust, JavaScript (`let`/`const`)"],
          ["Function Scope", "Function boundary (`function() { ... }`)", "Function execution frame", "Yes", "Python, legacy JavaScript (`var`)"],
          ["Module Scope", "Individual source code file", "File module boundary", "Yes", "ES Modules, Python files, Rust modules (`mod`)"],
          ["Global Scope", "Universal top-level application environment", "Fallback lookup at end of scope chain", "Base layer", "All languages (browser `window`, Node `global`)"]
        ],
        n: "Modern programming languages overwhelmingly utilize **Lexical (Static) Scope**: the scope of an identifier is determined entirely by its physical, syntactic position within the source code text, completely independent of how or where the function is called at runtime. When an identifier is referenced, the runtime traverses the **Scope Chain** outward: (1) Local Block/Function Scope, (2) Enclosing Lexical Parent Scopes, (3) Module Scope, and (4) Global Scope. If not found, a `ReferenceError` is thrown. Crucially, lexical scoping enables **Closures**: when an inner function is returned from an outer function, it retains a reference to its enclosing lexical scope environment (allocated on the heap), preserving access to outer variables even after the outer function has finished executing."
      },

      miss: [
        {
          w: "JavaScript's `var` and `let` have identical scoping rules.",
          r: "`var` is **Function-Scoped** (or globally scoped) and is hoisted to the top of the enclosing function, ignoring block boundaries like `if` or `for`. `let` and `const` (ES6) are strictly **Block-Scoped**, meaning they exist only within their enclosing curly braces `{ ... }` and reside in a **Temporal Dead Zone (TDZ)** before declaration."
        },
        {
          w: "Dynamic scope and lexical scope are basically the same thing.",
          r: "They are exact opposites. In **Lexical Scope**, a function resolves variables where it was **defined in source text**. In **Dynamic Scope**, a function resolves variables where it is **called at runtime**. Under dynamic scope, calling `foo()` from inside `bar()` allows `foo()` to access `bar`'s local variables, which makes program behavior notoriously difficult to predict."
        },
        {
          w: "Variable shadowing permanently overwrites the outer variable.",
          r: "Variable shadowing occurs when an inner scope declares a variable with the same name as an outer variable. The outer variable is merely **hidden (shadowed)** within that specific inner block; once execution exits the inner block, the outer variable remains completely intact and unaffected."
        },
        {
          w: "Closures copy the values of variables from the outer scope when created.",
          r: "In JavaScript and Python, closures hold a **live reference** to the outer scope environment, NOT a snapshot copy of the value. If an outer variable changes after the closure is created, invoking the closure will observe the updated, latest value."
        }
      ],

      trade: {
        buys: [
          "Prevents naming collisions: allows developers to reuse common variable names (`i`, `result`, `temp`) locally without conflicts.",
          "Information hiding: encapsulates helper variables inside local blocks, preventing unauthorized external access.",
          "Enables closures and factories: lexical scoping allows functions to encapsulate private state across invocations.",
          "Compile-time verification: enables compilers to verify variable resolution and optimize memory layout before execution."
        ],
        costs: [
          "Memory retention via closures: closures holding references to large outer scopes prevent garbage collection, causing memory leaks.",
          "Scope chain traversal latency: deeply nested scope lookups require multiple environment link dereferences in dynamic interpreters.",
          "Accidental variable shadowing: shadowing outer variables can lead to subtle logic bugs where the wrong variable is manipulated.",
          "Temporal Dead Zone (TDZ) friction: accessing block-scoped variables before declaration triggers runtime reference errors."
        ],
        avoid: [
          "Never pollute the global scope with application state; encapsulate logic inside modules, classes, or closures.",
          "Do not use `var` in modern JavaScript; always use `const` and `let` to guarantee predictable block scoping.",
          "Avoid deep variable shadowing where an inner variable reuses an outer variable name across complex nested blocks.",
          "Never retain unnecessary closures in long-lived event listeners or singletons, as this keeps parent scope memory alive indefinitely."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
