/* ==========================================================================
   Depth pass 114 — Computer Science Fundamentals batch 6: Runtimes, Memory & Concurrency.
   Interpreter, Memory Management, Stack and Heap Memory, Concurrency,
   Parallelism, Thread, Process.

   Bytecode virtual machine dispatch loops, generational garbage collection algorithms,
   virtual memory paging, POSIX process forks, and OS preemptive thread schedulers.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "interpreter",

      why: {
        before: "Every program change required an expensive, minutes-long recompilation and link cycle before any code could be run or tested, slowing down developer feedback and preventing dynamic evaluation.",
        problem: "Languages need an execution model that can execute source code or bytecode immediately without an upfront ahead-of-time compilation phase, providing interactive shells (REPLs) and cross-platform flexibility.",
        shift: "**Interpreter: A computer program that directly executes instructions written in a programming or scripting language, without requiring them previously to have been compiled into a machine language program.** Utilizing tree-walking AST evaluators or stack/register-based bytecode virtual machines, interpreters prioritize developer ergonomics and dynamic flexibility."
      },

      num: {
        t: "Interpreter Execution Architectures: Tree-Walk vs Bytecode VM vs JIT",
        h: ["Execution Architecture", "Input Representation", "Dispatch Mechanism", "Execution Throughput", "Startup Latency"],
        r: [
          ["Tree-Walking Interpreter", "Abstract Syntax Tree (AST)", "Recursive post-order traversal (`eval(node)`)", "Slowest ($100\\times$ slower than native)", "Near instantaneous startup (zero compilation)"],
          ["Stack-Based Bytecode VM", "Linear compact Bytecode array", "Opcode fetch-decode-execute loop (`switch` or computed `goto`)", "Moderate ($5\\text{--}10\\times$ slower than native)", "Fast bytecode compilation upfront (CPython, JVM)"],
          ["Register-Based Bytecode VM", "Linear Bytecode with virtual register operands", "Fewer instructions executed; larger instruction size", "Fast ($1.3\\times$ faster than stack VM)", "Fast (LuaJIT interpreter, Dalvik/ART VM)"],
          ["Tracing JIT Compiler", "Bytecode + Runtime Execution Profiles", "Detects hot loops and compiles trace to machine code", "Near-native speed on hot loops", "Warmup latency; potential deoptimization pauses"],
          ["Method JIT Compiler", "Bytecode + Method Invocation Counters", "Compiles entire hot methods to native machine code", "Near-native to native speed", "Warmup overhead (Java HotSpot C1/C2 compilers)"]
        ],
        n: "An interpreter executes instructions directly. In a **Bytecode Virtual Machine** (like CPython or JVM), the source code is compiled into a compact bytecode stream. The VM runs an inner **dispatch loop**: `while (1) { switch (*pc++) { case OP_ADD: ...; } }`. In modern high-performance interpreters, this naive `switch` statement (which suffers from branch mispredictions) is replaced by **Direct Threaded Code** using GCC's labels-as-values (`computed goto`), jumping directly from the end of one instruction handler to the address of the next opcode handler. Modern runtimes (V8, PyPy, HotSpot) combine interpretation with **Tiered JIT Compilation**: an interpreter provides instant startup, while background threads profile execution and compile frequently executed 'hot' bytecode paths into native machine code."
      },

      miss: [
        {
          w: "Python is an interpreted language, so it never compiles code.",
          r: "Python **always compiles source code**! When you run a Python script, CPython immediately compiles the source into bytecode, caching it in `.pyc` files (`__pycache__`). The Python virtual machine (an interpreter) then executes this compiled bytecode, not raw text."
        },
        {
          w: "Compiled languages are always faster than interpreted languages.",
          r: "While compiled binaries are generally faster, modern JIT-compiled interpreted runtimes (like Java HotSpot or V8) can sometimes outperform statically compiled C/C++ code on specific workloads because the JIT uses **runtime profiling information** to perform speculative optimizations, devirtualization, and cache-line branch layout that static compilers cannot anticipate."
        },
        {
          w: "An interpreter cannot perform any type checking.",
          r: "Interpreters perform extensive **runtime dynamic type checking**. Every time an operation like `a + b` is evaluated in an interpreter, the engine inspects the type tags in the object headers to decide whether to execute integer addition, floating-point math, or string concatenation."
        },
        {
          w: "An interpreter and a virtual machine are completely different concepts.",
          r: "A **Bytecode Interpreter** is a software implementation of a virtual CPU (Virtual Machine). It has its own instruction set, program counter, and virtual stack or registers, executing bytecode exactly as a physical CPU executes machine instructions."
        }
      ],

      trade: {
        buys: [
          "Zero build-time delay: executes code immediately upon saving, enabling rapid interactive development and REPL environments.",
          "Cross-platform portability: bytecode runs identically on any operating system equipped with the virtual machine interpreter.",
          "Dynamic runtime metaprogramming: allows dynamic evaluation (`eval`), reflection, monkey-patching, and hot code reloading.",
          "Sandboxed execution: virtual machine interpreters isolate untrusted code from direct memory and physical CPU hardware."
        ],
        costs: [
          "Runtime performance penalty: instruction fetch-decode-dispatch loop is $5\\text{--}100\\times$ slower than bare-metal machine code.",
          "Delayed error detection: syntax or semantic bugs in un-executed code branches remain hidden until that branch is reached at runtime.",
          "Memory overhead: requires running the entire interpreter runtime environment and object model in memory.",
          "High CPU branch mispredictions: central `switch` dispatch loops thrash CPU branch predictor tables."
        ],
        avoid: [
          "Never execute computationally intensive number crunching in raw Python interpreter loops; offload to NumPy/C-extensions.",
          "Do not use `eval()` or `exec()` in interpreted environments on untrusted user inputs due to catastrophic remote code execution risks.",
          "Avoid shipping untyped interpreted code in large enterprise teams without static type checkers (`mypy`, TypeScript).",
          "Never assume an interpreter executes line-by-line from disk; it compiles to an in-memory bytecode representation first."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "memory-management",

      why: {
        before: "Early programming required manual allocation and deallocation of physical memory addresses; forgetting to free memory caused memory leaks, while freeing too early caused catastrophic dangling pointers and wild memory overwrites.",
        problem: "Software needs systematic, reliable mechanisms to dynamically allocate memory at runtime and safely reclaim it when no longer needed, preventing leaks, fragmentation, and memory safety vulnerabilities.",
        shift: "**Memory Management: The process of controlling and coordinating computer memory, assigning blocks (allocations) to various running programs to optimize overall system performance and reclaiming freed memory.** Ranging from manual allocation (`malloc`/`free`) and compiler-enforced ownership (Rust) to automatic Garbage Collection (JVM/V8), it defines the safety and performance boundaries of software."
      },

      num: {
        t: "Memory Management Paradigms: Mechanics, Safety & Latency",
        h: ["Paradigm", "Allocation / Deallocation Mechanism", "Memory Safety Guarantee", "Runtime Latency Impact", "Primary Language Adoption"],
        r: [
          ["Manual (`malloc` / `free`)", "Programmer explicitly calls allocation & free", "Zero safety: vulnerable to UAF, double-free, leaks", "Zero runtime GC latency; manual allocator overhead", "C, C++, Assembly"],
          ["Automatic Garbage Collection (GC)", "Traced reachability (Mark-and-Sweep, Generational)", "High safety: no use-after-free or dangling pointers", "Periodic 'Stop-The-World' or concurrent GC pauses", "Java, Go, C#, JavaScript, Python"],
          ["Automatic Reference Counting (ARC)", "Monitors reference counter; frees when count $= 0$", "Safe against dangling pointers; leaks on cyclic graphs", "Deterministic destruction; atomic counter increment overhead", "Swift, Objective-C, Python (hybrid)"],
          ["Compile-Time Ownership / RAII", "Compiler enforces affine types, moves, and lifetimes", "Mathematically proven memory safety at compile time", "Zero GC overhead; deterministic stack-based freeing", "Rust, modern C++ (smart pointers)"],
          ["Region-Based / Arena Allocation", "Allocates into contiguous arena; frees entire arena at once", "High safety within region lifetimes", "Near-instantaneous allocation & batch free", "Game engines, compilers, HTTP request lifecycles"]
        ],
        n: "Memory management balances allocation throughput, spatial fragmentation, and reclamation latency. In **Traced Garbage Collection**, the collector identifies **GC Roots** (stack frames, CPU registers, global static references) and traverses the directed graph of pointers. Any node not reachable from the roots is designated garbage. Modern production collectors (like Java's **G1** and **ZGC**) divide heap memory into small regions and segregate objects by age (**Generational Hypothesis**: most objects die young). ZGC uses **Colored Pointers** and **Load Barriers** to perform concurrent marking and compaction with worst-case pause times under 1 millisecond on multi-terabyte heaps. In systems programming, **Arena (Region) Allocators** allocate sequentially from a contiguous memory block via a simple bump pointer (`ptr += size`), freeing all allocations in a single instruction by resetting the pointer to zero."
      },

      miss: [
        {
          w: "Garbage collection prevents all memory leaks.",
          r: "Garbage collection only reclaims **unreachable** memory. If an unused object is still referenced by an active static collection, a global cache, or an uncancelled event listener, it remains reachable from GC roots. The garbage collector can NEVER free it, resulting in a severe **logical memory leak**."
        },
        {
          w: "Reference counting (ARC) is always faster than tracing garbage collection.",
          r: "ARC requires incrementing and decrementing reference counters on every pointer assignment. In multi-threaded environments, these must be **atomic operations** (using CPU `LOCK` bus instructions), which serialize memory access across CPU cores and degrade multi-core scaling. Furthermore, ARC cannot reclaim **cyclic references** without weak references."
        },
        {
          w: "Rust uses a hidden background garbage collector.",
          r: "Rust has **zero runtime garbage collector**. Memory safety is proven entirely at **compile-time** by the Borrow Checker via strict rules of ownership and lifetime analysis. When a variable goes out of scope, the compiler automatically inserts the exact destructor call (`Drop::drop`) to free memory deterministically."
        },
        {
          w: "`free()` immediately returns physical memory to the operating system.",
          r: "`free()` in C or `delete` in C++ returns memory to the **application's user-space heap allocator** (e.g., `glibc malloc`, `jemalloc`), not the operating system kernel. The allocator pools this memory for future `malloc()` requests to avoid the heavy overhead of OS system calls (`brk`/`mmap`)."
        }
      ],

      trade: {
        buys: [
          "Memory safety: eliminates use-after-free, double-free, and wild pointer bugs that cause $70\\%$ of all security vulnerabilities.",
          "Developer productivity: frees developers from writing complex, error-prone manual memory tracking logic.",
          "Automatic defragmentation: compacting garbage collectors reorganize heap memory to eliminate external fragmentation.",
          "Concurrency safety: compile-time ownership systems (Rust) eliminate both memory bugs and data races simultaneously."
        ],
        costs: [
          "Runtime latency spikes: garbage collection pauses (Stop-The-World) can introduce unacceptable jitter in real-time systems.",
          "Memory footprint amplification: tracing GC runtimes typically require $2\\text{--}3\\times$ more physical RAM than manual allocators.",
          "Atomic synchronization overhead: reference counting requires atomic memory bus cycles on every reference copy.",
          "Loss of hardware control: high-level memory abstractions prevent precise control over hardware cache-line alignment."
        ],
        avoid: [
          "Never retain stale object references in static collections or global caches; use Weak References to prevent memory leaks.",
          "Do not use manual `malloc`/`free` in modern C++; use RAII smart pointers (`std::unique_ptr`, `std::shared_ptr`).",
          "Avoid creating circular object references in reference-counted languages (Swift/Python) without `weak` or `unowned` links.",
          "Never allocate and free millions of tiny objects inside performance-critical loops; use object pools or arena allocators."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stack-and-heap-memory",

      why: {
        before: "Early computing environments managed all program memory as a flat, unsegmented space, causing subroutine variable allocations to overwrite data from caller frames and preventing dynamic data sizing.",
        problem: "Programs require a dual memory architecture that provides lightning-fast, automatic lifecycle management for local function variables, alongside a dynamic, long-lived storage area for arbitrary-sized runtime objects.",
        shift: "**Stack and Heap Memory: The two primary logical memory segments utilized by computer programs.** Stack memory provides fast, deterministic, LIFO-allocated storage for local function call frames, while Heap memory provides flexible, dynamically allocated, programmer-managed storage for long-lived objects and variable-sized collections."
      },

      num: {
        t: "Stack vs Heap Memory: Structural, Operational & Performance Comparison",
        h: ["Dimension", "Stack Memory", "Heap Memory", "Hardware / OS Mechanism", "Performance Differential"],
        r: [
          ["Allocation Mechanism", "Deterministic LIFO pointer bump (decrement RSP register)", "Dynamic allocator search (`malloc`, `tcmalloc`, free lists)", "Stack is single CPU instruction; Heap is complex algorithmic search", "Stack allocation is $10\\text{--}100\\times$ faster than Heap"],
          ["Deallocation Mechanism", "Automatic upon function return (increment RSP)", "Manual (`free`) or Automatic Garbage Collector", "Stack unwinds instantly; Heap requires GC tracing or free list updates", "Stack deallocation costs 0 CPU cycles"],
          ["Memory Fragmentation", "Zero fragmentation (strictly contiguous LIFO)", "Prone to external and internal fragmentation", "Heap requires coalescing and compaction passes", "Stack maintains continuous physical packing"],
          ["Access Speed / Cache Locality", "Blazing fast; hot in CPU L1/L2 data cache", "Slower; scattered addresses trigger CPU cache misses", "Stack accesses are local; Heap dereferences follow pointers", "Stack has near 100% L1 cache hit rate"],
          ["Size Boundaries", "Small and fixed (typically $1\\text{--}8$ MB per thread)", "Vast; bounded only by physical RAM and Virtual Memory", "Stack overflow on limit; Heap Out-Of-Memory (OOM)", "Stack cannot store massive data buffers"],
          ["Lifetime Scope", "Bound to the execution of the enclosing function", "Independent of function scope; persists until freed/unreachable", "Stack destroyed on return; Heap outlives function frames", "Heap allows returning data to callers"]
        ],
        n: "Stack and Heap share the same physical RAM virtual address space, typically laid out at opposite ends: the **Stack** begins at high virtual addresses and grows downwards toward zero, while the **Heap** begins at low addresses (above the data/BSS segments) and grows upwards via `brk`/`mmap`. When a function is called, the CPU decrements the Stack Pointer (`RSP`) by the frame size: allocating local variables takes a **single CPU clock cycle**. Accessing stack variables uses fast register-offset addressing: `[RBP - 8]`. In contrast, the **Heap** requires an allocator (like `glibc ptmalloc` or Google's `tcmalloc`) that maintains free-lists, thread-local allocation buffers (TLABs), and binning algorithms to find a block of suitable size, introducing synchronization locks, fragmentation, and pointer indirection."
      },

      miss: [
        {
          w: "Stack memory is stored on the CPU chip, while heap memory is stored on physical RAM sticks.",
          r: "Both Stack and Heap reside in the **exact same physical RAM virtual address space**. The CPU chip contains L1/L2/L3 caches and registers; stack memory is faster purely because its localized, sequential access pattern keeps stack frames warm in the CPU's L1 data cache."
        },
        {
          w: "Primitive variables are always on the stack, and objects are always on the heap.",
          r: "Where a variable lives depends on **where it is declared, not its type**. A primitive integer (`int x = 5`) declared as a field inside a class or object is stored directly **inside that object on the heap**. Conversely, JIT escape analysis can allocate objects on the stack if they do not escape the local method."
        },
        {
          w: "Stack memory can never run out of space.",
          r: "Stack memory is strictly bounded by the operating system (typically $1\\text{--}8$ MB per thread). Deep recursive calls or allocating large local arrays on the stack (`char buffer[10000000]`) will immediately blow past the guard page and trigger a fatal **`StackOverflowError`** segmentation fault."
        },
        {
          w: "Heap memory access is just as fast as stack memory access once allocated.",
          r: "Heap allocations are scattered arbitrarily across RAM. Dereferencing heap pointers frequently results in **CPU cache misses** ($100\\text{--}200$ CPU cycles latency), whereas stack memory enjoys spatial and temporal locality, remaining resident in L1 cache ($1\\text{--}4$ cycles)."
        }
      ],

      trade: {
        buys: [
          "Zero-cost stack allocation: allocating and freeing stack memory requires only moving a CPU register (`RSP`).",
          "Automatic stack cleanup: eliminates memory leaks for all stack-allocated variables upon function return.",
          "Dynamic heap sizing: allows programs to allocate arbitrarily large collections and datasets at runtime.",
          "Global heap persistence: allows data structures to outlive the specific function that constructed them."
        ],
        costs: [
          "Stack size limits: strictly bounded thread stacks cause fatal stack overflow crashes on deep recursion.",
          "Heap allocator overhead: heap allocations require complex free-list searching, memory locks, and metadata tracking.",
          "Heap fragmentation: arbitrary allocation and deallocation patterns fragment heap memory over long runtimes.",
          "Cache penalties on heap: pointer chasing across heap memory thrashes CPU L1/L2 caches."
        ],
        avoid: [
          "Never allocate massive multi-megabyte data buffers on the thread stack; allocate them on the heap.",
          "Do not use deep, unbounded recursion that risks blowing out thread stack boundaries.",
          "Avoid unnecessary heap allocations inside tight performance loops; prefer stack variables or pre-allocated buffers.",
          "Never return a raw pointer or reference to a local stack variable in C/C++; it becomes an invalid dangling pointer instantly upon return."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "concurrency",

      why: {
        before: "Programs ran as single sequential execution streams, leaving computer systems completely idle while waiting for slow disk I/O, network responses, or user keystrokes.",
        problem: "Software systems need to manage multiple overlapping execution tasks simultaneously—handling thousands of incoming network connections, user interface interactions, and background operations without blocking.",
        shift: "**Concurrency: The composition of independently executing computations; the ability of different parts or units of a program to be executed out-of-order or in partial order, without affecting the outcome.** As Rob Pike famously established: 'Concurrency is about structure; parallelism is about execution.' Concurrency allows a single CPU core to interleave multiple tasks through time-slicing."
      },

      num: {
        t: "Concurrency Models: Architecture, Scheduling & Communication",
        h: ["Concurrency Model", "Execution Unit", "Scheduling Mechanism", "State Sharing", "Primary Language Adoption"],
        r: [
          ["Preemptive Multi-Threading", "Kernel Threads", "OS Kernel Preemptive Scheduler", "Shared memory with explicit locks (Mutex, Semaphores)", "C, C++, Java, C#"],
          ["Event-Driven / Event Loop", "Single OS Thread", "Non-blocking I/O multiplexing (`epoll`, `kqueue`)", "Single-threaded execution; zero shared state races", "JavaScript (Node.js), Python (AsyncIO), NGINX"],
          ["Cooperative Coroutines / Fibers", "Green Threads / Tasks", "User-space scheduler / language runtime", "Shared memory or message channels", "Go (Goroutines), Rust (Tokio), Kotlin (Coroutines)"],
          ["Actor Model", "Actors", "Mailbox message-passing dispatcher", "Zero shared state; asynchronous immutable messages", "Erlang / Elixir (BEAM), Akka (Scala/Java)"],
          ["Communicating Sequential Processes (CSP)", "Goroutines / Channels", "Runtime M:N multiplexing scheduler", "Channels: 'Do not communicate by sharing memory; share memory by communicating'", "Go, Clojure (core.async)"]
        ],
        n: "Concurrency models the logical structure of a program as multiple independent execution threads of control. In operating systems, a single CPU core achieves concurrency through **Preemptive Time-Slicing**: the OS kernel timer interrupt fires (typically every $1\\text{--}10$ ms), triggering a **context switch** where the kernel saves the current thread's CPU registers to its PCB (Process Control Block) and restores another thread's registers. In modern asynchronous network servers, **Event-Driven Concurrency** uses OS multiplexing primitives (**`epoll`** on Linux, **`kqueue`** on BSD/macOS) to monitor tens of thousands of idle socket descriptors simultaneously on a single OS thread, waking up only when a network packet arrives, eliminating context switch overhead."
      },

      miss: [
        {
          w: "Concurrency and Parallelism are the exact same thing.",
          r: "**Concurrency** is about **dealing with a lot of things at once** (structure); **Parallelism** is about **doing a lot of things at once** (simultaneous physical execution on multiple CPU cores). A concurrent program can run on a single-core CPU by interleaving tasks via time-slicing without any physical parallelism."
        },
        {
          w: "Single-threaded event loops (like Node.js) are immune to concurrency bugs.",
          r: "While Node.js eliminates multi-threaded data races on memory, it is still vulnerable to **asynchronous race conditions**. If two asynchronous operations read a database record, yield control across an `await`, and then update it, they can overwrite each other's changes (lost updates) without proper concurrency locking."
        },
        {
          w: "Adding more concurrent threads always makes a program run faster.",
          r: "Spawning too many threads causes **thrashing**: the CPU spends more time executing kernel context switches, invalidating CPU caches, and waiting on lock contention than doing actual useful work. Concurrency improves throughput only up to the limits of hardware resources and I/O bottlenecks."
        },
        {
          w: "Non-blocking asynchronous code runs on background CPU threads automatically.",
          r: "Non-blocking asynchronous I/O (like Node.js or AsyncIO) relies on OS kernel socket notifications (`epoll`), NOT background threads. The CPU does not spin on a thread; the hardware network card and OS kernel handle packet buffering."
        }
      ],

      trade: {
        buys: [
          "High responsiveness: prevents user interfaces and APIs from freezing while waiting for long-running I/O operations.",
          "Efficient resource utilization: keeps CPUs productive by executing other tasks while waiting on network or disk latency.",
          "Massive connection scalability: event loops and green threads handle $100{,}000+$ simultaneous connections on minimal RAM.",
          "Decoupled structural architecture: decomposes complex software into independent, collaborating workers."
        ],
        costs: [
          "Non-deterministic timing bugs: introduces elusive race conditions, deadlocks, and livelocks that are notoriously hard to reproduce.",
          "Cognitive complexity: reasoning about interleaved asynchronous control flows requires complex mental models.",
          "Context switch overhead: excessive kernel thread switching degrades CPU cache efficiency and consumes CPU cycles.",
          "Debugging difficulty: stack traces become fragmented across asynchronous event loops and thread boundaries."
        ],
        avoid: [
          "Never block the main thread or event loop with synchronous CPU-intensive tasks in event-driven systems (Node.js).",
          "Do not share mutable state across concurrent threads without synchronization primitives or message passing.",
          "Avoid spawning an unbounded number of OS threads; use bounded thread pools or user-space green threads.",
          "Never assume asynchronous operations complete in the order they were dispatched."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "parallelism",

      why: {
        before: "Single-core CPU clock speeds plateaued around 2004 due to physical thermal and power dissipation limits (the 'Power Wall'), ending the era where software automatically ran twice as fast every two years without architectural changes.",
        problem: "Software needs to execute multiple computational tasks simultaneously across multiple physical CPU cores, GPUs, and distributed compute clusters to process massive datasets and high-throughput workloads.",
        shift: "**Parallelism: The simultaneous physical execution of multiple computational tasks at the exact same instant in time across multiple physical processing units (CPU cores, GPUs, or cluster nodes).** Governed by Amdahl's Law and Gustafson's Law, parallelism scales computational throughput beyond single-core physics."
      },

      num: {
        t: "Levels of Hardware Parallelism: From Bit-Level to Distributed Clusters",
        h: ["Parallelism Level", "Hardware Mechanism", "Data / Instruction Processing", "Typical Execution Unit", "Modern Practical Usage"],
        r: [
          ["Bit-Level Parallelism", "Wider ALU registers (e.g., 8-bit to 64-bit)", "Processes 64-bit integers in a single clock cycle", "Single CPU ALU", "Universal modern 64-bit microprocessors"],
          ["Instruction-Level (ILP)", "Superscalar pipelining & out-of-order execution", "Executes multiple independent machine instructions per cycle", "CPU execution units (ALU, FPU)", "Modern x86-64 and ARM CPU microarchitectures"],
          ["Data Parallelism (SIMD)", "Single Instruction, Multiple Data (AVX-512, Neon)", "Same mathematical operation applied across vector registers", "Vector registers (128, 256, 512 bits)", "Machine learning matrix multiplication, image processing"],
          ["Task / Thread Parallelism", "Multi-core CPUs (SMP - Symmetric Multiprocessing)", "Different threads executing independent instruction streams", "Physical CPU Cores", "Web server worker pools, database query execution"],
          ["Massive Parallelism (SIMT)", "Graphics Processing Units (GPUs) with thousands of ALUs", "Single Instruction, Multiple Threads across warps/wavefronts", "Streaming Multiprocessors (SMs)", "LLM deep learning training, 3D shader rasterization"],
          ["Distributed Parallelism", "Computer clusters connected by high-speed networks", "Data partitioned across independent server machines", "Nodes / VMs (Infiniband / RDMA)", "Apache Spark, Hadoop, MPI, distributed training"]
        ],
        n: "Parallelism requires physical hardware concurrency: at least two separate processing units running instructions simultaneously at the exact same nanosecond. The theoretical speedup of parallelizing a program is bounded by **Amdahl's Law**: $S(p) = \\frac{1}{(1 - s) + \\frac{s}{p}}$, where $s$ is the proportion of the program that can be parallelized, and $p$ is the number of processors. If $5\\%$ of an algorithm is strictly sequential ($s = 0.95$), the maximum theoretical speedup is limited to $\\frac{1}{0.05} = 20\\times$, even with an infinite number of CPU cores! In contrast, **Gustafson's Law** notes that for large-scale data workloads, the problem size scales with available processors, allowing massive parallelism in deep learning and scientific computing. In modern systems, **Data Parallelism** on GPUs executes identical matrix arithmetic across tens of thousands of tensor cores simultaneously via CUDA."
      },

      miss: [
        {
          w: "Parallelism and Concurrency mean the exact same thing.",
          r: "They are fundamentally distinct. **Concurrency** is about system structure (managing multiple tasks by interleaving execution on one or more cores). **Parallelism** is about physical hardware execution (running multiple tasks at the exact same physical instant on multiple cores). You can have concurrency without parallelism on a single-core CPU."
        },
        {
          w: "Running a program on an 8-core CPU will make it run 8 times faster automatically.",
          r: "Unless a program is specifically written to decompose work into parallel threads, it executes on a **single core**, leaving the other 7 cores idle. Furthermore, by **Amdahl's Law**, any sequential portion of the code, along with thread synchronization and memory bus contention, prevents linear $8\\times$ scaling."
        },
        {
          w: "Parallel computing is always faster than sequential computing.",
          r: "Parallelizing a task introduces significant **parallel overhead**: partitioning data, spawning threads, executing memory barriers, and aggregating results. For small workloads, the overhead of setting up parallelism is far greater than the computation itself, making the parallel version significantly **slower** than a simple sequential loop."
        },
        {
          w: "Multi-threading code in Python automatically runs in parallel across all CPU cores.",
          r: "In standard CPython, the **Global Interpreter Lock (GIL)** prevents multiple native threads from executing Python bytecode simultaneously. Standard Python threads provide concurrency for I/O, but **zero CPU parallelism**. Achieving true multi-core parallelism in Python requires the `multiprocessing` module or non-GIL runtimes."
        }
      ],

      trade: {
        buys: [
          "Bypasses the CPU clock speed ceiling: scales throughput across multiple cores and thousands of GPU tensor cores.",
          "Massive throughput acceleration: executes large-scale matrix operations, video encoding, and big data joins in seconds.",
          "Linear scalability on embarrassingly parallel problems: tasks with zero inter-thread communication scale near-linearly.",
          "Enables modern AI: deep neural network training is physically impossible without massive SIMD/SIMT parallel execution."
        ],
        costs: [
          "Amdahl's Law bottleneck: overall speedup is strictly limited by the sequential fraction of the algorithm.",
          "High parallelization overhead: thread creation, inter-process communication, and synchronization consume CPU cycles.",
          "Complex memory contention: multiple cores competing for the shared RAM memory bus cause cache line invalidation storms.",
          "Massive debugging complexity: non-deterministic execution schedules make parallel race bugs extremely difficult to reproduce."
        ],
        avoid: [
          "Never attempt to parallelize tiny computational loops where thread spawning overhead exceeds execution time.",
          "Do not rely on Python `threading` for CPU-bound parallelism; use `multiprocessing` or native C-extensions.",
          "Avoid fine-grained locks across parallel threads; use data partitioning or lock-free parallel structures.",
          "Never ignore Amdahl's Law when estimating the ROI of adding more CPU cores to an existing workload."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "thread",

      why: {
        before: "Operating systems only provided full heavyweight processes, meaning running concurrent tasks required duplicating entire virtual memory address spaces, consuming massive RAM and making inter-task communication extremely slow.",
        problem: "Software needs a lightweight execution unit that can run concurrently within a single program while sharing memory, file handles, and resources with other units in the same process.",
        shift: "**Thread: The smallest sequence of programmed instructions that can be managed independently by an operating system scheduler.** As a component of a process, multiple threads share the process's memory space (code, data, heap) while maintaining their own private stack and registers, enabling lightweight concurrent execution."
      },

      num: {
        t: "Kernel Threads vs User-Space Green Threads: Structural Trade-offs",
        h: ["Feature / Metric", "Kernel Thread (1:1 Model)", "Green Thread / Goroutine (M:N Model)", "Operational Consequence", "Engineering Decision"],
        r: [
          ["Management Entity", "Operating System Kernel Scheduler", "Language Runtime Scheduler in User Space", "Kernel context switches involve ring transition", "Green threads switch in user-space with zero syscall"],
          ["Memory Footprint", "$1\\text{--}8$ MB pre-allocated stack space", "$2\\text{--}4$ KB dynamic resizable stack", "System exhausts RAM after $\\approx 10{,}000$ OS threads", "Green threads can spawn millions in RAM (Go/Erlang)"],
          ["Creation / Switch Time", "Slow: $1\\text{--}10$ microseconds (system call)", "Fast: $10\\text{--}100$ nanoseconds (register swap)", "OS thread context switches flush CPU caches", "Green threads switch with minimal cache penalty"],
          ["Physical Core Parallelism", "Direct 1:1 mapping to physical CPU cores", "Multiplexed M:N onto $N$ kernel threads", "Kernel threads run in true physical parallelism", "Both achieve physical multi-core scaling"],
          ["Blocking I/O Behavior", "Thread blocks; OS schedules another thread", "Runtime intercepts syscall; parking green thread", "Kernel threads handle blocking C libraries natively", "Green threads require non-blocking I/O runtime hooks"]
        ],
        n: "A thread represents an independent stream of execution within a process. All threads inside a process share the same **Virtual Memory Address Space** (code segment, data segment, and heap) and OS resources (file descriptors, sockets). However, each thread maintains its own private: (1) **Program Counter (PC)**, (2) **CPU Register State**, and (3) **Execution Call Stack** (for local variables). In the standard **1:1 Threading Model** (POSIX `pthreads`, Java, Linux NPTL), each language thread maps directly to an OS kernel task (`task_struct` in Linux). Context switching between kernel threads requires saving registers, updating the kernel stack pointer, and executing a kernel interrupt. In contrast, the **M:N Model** (Go Goroutines) multiplexes $M$ lightweight user-space green threads onto $N$ OS kernel threads, utilizing small 2 KB dynamic stacks to support millions of concurrent routines simultaneously."
      },

      miss: [
        {
          w: "Each thread has its own completely separate, private heap memory.",
          r: "Threads share the **exact same virtual heap memory**. Any thread can read or modify any object on the heap if it holds a pointer or reference to it. Only the **execution stack** and CPU registers are private to each thread."
        },
        {
          w: "Spawning 100,000 OS kernel threads is standard practice for modern web servers.",
          r: "Spawning 100,000 OS kernel threads will crash most operating systems with Out-Of-Memory or thrash the kernel scheduler into collapse (each thread allocates $1\\text{--}8$ MB of stack space). Handling massive connection counts requires **event loops** (Node.js) or **user-space green threads** (Go goroutines, Erlang actors)."
        },
        {
          w: "Thread priority settings guarantee the exact order of thread execution.",
          r: "Thread priorities are merely hints to the OS kernel scheduler. Modern preemptive schedulers employ dynamic heuristics (aging, I/O boosts, CFS fairness) and can preempt high-priority threads or execute low-priority threads to prevent **priority inversion**."
        },
        {
          w: "Multi-threading is always faster than single-threaded execution.",
          r: "If a task is bound by single-core CPU math, splitting it across multiple threads on a single core will make it **slower** due to the overhead of thread creation, synchronization locks, and continuous context switching."
        }
      ],

      trade: {
        buys: [
          "Lightweight concurrency: creates concurrent execution streams with a fraction of the memory and startup cost of processes.",
          "Fast data sharing: threads communicate through direct memory pointers on the shared heap without IPC overhead.",
          "True multi-core parallelism: maps directly to physical CPU cores to execute compute-intensive tasks simultaneously.",
          "Asynchronous I/O offloading: allows long-running disk or database queries to execute in background threads without freezing UI."
        ],
        costs: [
          "Race condition hazard: uncoordinated access to shared heap memory causes silent data corruption.",
          "Context switch latency: excessive kernel threads trigger continuous CPU register saving and cache thrashing.",
          "No fault isolation: a fatal segmentation fault or uncaught exception in one thread immediately terminates the entire process.",
          "Lock contention and deadlocks: coordinating threads requires synchronization primitives that can freeze execution."
        ],
        avoid: [
          "Never share mutable heap data between threads without synchronization (mutex, atomics) or memory barriers.",
          "Do not spawn unconstrained new threads per incoming request; use a bounded thread pool (`ThreadPoolExecutor`).",
          "Avoid holding locks while performing long-running network or disk I/O operations to prevent thread starvation.",
          "Never assume thread execution order is deterministic; operating system scheduling is non-deterministic."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "process",

      why: {
        before: "Early operating systems executed programs in a single flat memory space without boundaries, meaning a bug, infinite loop, or memory error in one program would overwrite the memory of other programs or crash the entire physical machine.",
        problem: "Operating systems require an isolated, protected execution environment that encapsulates a running program's memory, file descriptors, and hardware access, ensuring complete fault containment and security.",
        shift: "**Process: An instance of a computer program that is being executed by one or many threads, containing the program code and its current activity.** Equipped with its own private virtual memory address space, file descriptor table, and security credentials, the process is the fundamental unit of isolation in modern operating systems."
      },

      num: {
        t: "Process Memory Anatomy: The Virtual Address Space Layout (Linux x86-64)",
        h: ["Memory Segment", "Address Range Boundary", "Growth Direction", "Permissions (R/W/X)", "Segment Contents"],
        r: [
          ["Kernel Space", "Top $128$ TB (`0xFFFF8000...`)", "Fixed", "Privileged (Ring 0)", "OS kernel code, page tables, physical memory mapping"],
          ["User Stack", "Grows downward from `0x7FFFFFFF...`", "Downwards ($\\downarrow$)", "Read / Write (No-Execute - NX)", "Local variables, function call frames, return addresses"],
          ["Memory Mapping Segment", "Between Stack and Heap", "Downwards / Upwards", "Read / Write / Execute", "Shared libraries (`libc.so`), memory-mapped files (`mmap`)"],
          ["Heap Segment", "Above BSS segment", "Upwards ($\\uparrow$)", "Read / Write (NX)", "Dynamically allocated memory (`malloc`, `new`, GC heap)"],
          ["BSS Segment", "Above Data Segment", "Fixed size", "Read / Write", "Uninitialized static and global variables (zero-filled)"],
          ["Data Segment", "Above Text Segment", "Fixed size", "Read / Write", "Initialized static and global variables"],
          ["Text Segment (Code)", "Bottom (`0x00400000...`)", "Fixed size", "Read / Execute (No-Write)", "Compiled machine instructions (read-only executable code)"]
        ],
        n: "A process is managed by the OS kernel through a **Process Control Block (PCB)** (`task_struct` in Linux). The defining property of a process is **Virtual Memory Isolation**: through the CPU's **Memory Management Unit (MMU)** and hierarchical **Page Tables**, every 64-bit process operates under the illusion that it owns a private, continuous 48-bit virtual address space (256 TB). The physical DRAM addresses mapped to two different processes are completely disjoint. A process creates child processes via the POSIX **`fork()`** system call, which utilizes **Copy-On-Write (COW)**: the child shares the exact same physical memory pages as the parent, marked read-only; physical pages are only duplicated when one of the processes attempts to write to memory, making `fork()` fast and memory-efficient."
      },

      miss: [
        {
          w: "A process and a program are the exact same thing.",
          r: "A **program** is a passive collection of instructions stored on disk (an executable file like `nginx` or `python.exe`). A **process** is the active, running instance of that program in RAM, with allocated CPU registers, virtual memory, program counter, and open file descriptors."
        },
        {
          w: "Two processes can directly read each other's memory pointers.",
          r: "Processes operate in completely **isolated virtual memory address spaces**. Pointer address `0x7ffeefbff500` in Process A points to a completely different physical RAM transistor than `0x7ffeefbff500` in Process B. Sharing data requires explicit **Inter-Process Communication (IPC)**: shared memory (`shmget`), pipes, Unix domain sockets, or message queues."
        },
        {
          w: "When a process crashes, it takes down the entire operating system.",
          r: "Due to **hardware-enforced memory protection (Ring 0 vs Ring 3)**, a process crashing (e.g., segmentation fault) is cleanly intercepted by the kernel. The kernel terminates the faulty process, reclaims all its physical RAM, and closes its file descriptors, leaving the OS and all other processes completely unaffected."
        },
        {
          w: "`fork()` duplicates all of the parent process's physical memory in RAM immediately.",
          r: "`fork()` uses **Copy-On-Write (COW)**. It only duplicates the page table entries, marking the underlying physical memory pages as read-only. Physical memory is only copied when either parent or child attempts to write to a specific page."
        }
      ],

      trade: {
        buys: [
          "Complete fault isolation: a crash, segfault, or memory corruption in one process cannot corrupt or terminate other processes.",
          "Hardware-enforced security: prevents unauthorized processes from inspecting, reading, or tampering with sensitive memory.",
          "Clean resource reclamation: when a process terminates, the operating system kernel automatically frees all its RAM, sockets, and files.",
          "Multi-tenant sandboxing: forms the fundamental boundary for OS security, web browser tabs, and containerization (Docker/cgroups)."
        ],
        costs: [
          "Heavy creation overhead: creating a new process is orders of magnitude slower and uses more memory than spawning a thread.",
          "High context-switch penalty: switching processes requires flushing the CPU's Translation Lookaside Buffer (TLB), slowing cache throughput.",
          "Complex communication (IPC): sharing data between processes requires serialization across pipes, sockets, or shared memory segments.",
          "Memory duplication: running multiple independent processes duplicates shared runtime overhead compared to multi-threaded designs."
        ],
        avoid: [
          "Never spawn a new OS process for every short-lived web request; use worker thread pools or persistent worker processes.",
          "Do not forget to reap child processes with `wait()` / `waitpid()` to prevent accumulating **Zombie Processes** in the OS process table.",
          "Avoid passing massive data objects over standard IPC pipes without exploring zero-copy shared memory (`shm_open`) or memory mapping (`mmap`).",
          "Never assume child processes inherit open network sockets cleanly across `fork()` without setting the `FD_CLOEXEC` flag."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
