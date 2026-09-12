/* ==========================================================================
   Depth pass 60 — programming languages batch 5: bytecode, JIT compilation,
   AOT compilation, JVM, Node.js, .NET, runtime environments, and REPLs.

   Languages are not just syntax: they are execution strategies, memory
   runtimes, and compilation pipelines balancing developer velocity,
   portability, and bare-metal performance.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "bytecode",

      why: {
        before: "Source code was either compiled directly to platform-specific " +
          "machine code (x86, ARM) or interpreted directly from raw text syntax trees.",
        problem: "Native machine code binaries had zero cross-platform portability " +
          "(a binary compiled for Windows x86 crashed on Linux ARM), while interpreting " +
          "raw source code in loops was painfully slow, re-parsing syntax on every pass.",
        shift: "**Compile source code into compact, intermediate virtual instructions.** " +
          "Bytecode decouples the language compiler from physical CPU architectures, " +
          "producing a standardized binary format executed by an abstract virtual machine."
      },

      num: {
        t: "Bytecode instruction models & virtual machine architectures",
        h: ["Instruction Architecture", "Execution Mechanism", "Prominent Implementations", "Core Advantage / Trade-off"],
        r: [
          ["**Stack-Based VM**", "**Operands pushed/popped from an evaluation stack**", "**JVM Bytecode, CLR CIL, Python (.pyc), WebAssembly**", "**Simple compiler generation, compact code; requires more instructions**"],
          ["**Register-Based VM**", "**Operands read/written from virtual registers**", "**Dalvik / ART (Android), Lua 5.x VM, Erlang BEAM**", "**Fewer instructions executed per operation; larger instruction size**"],
          ["**Intermediate Representation (IR)**", "**Static Single Assignment (SSA) form graph**", "**LLVM IR, GCC GIMPLE**", "**Extreme compiler optimization passes before native code generation**"],
          ["**Typed Bytecode**", "**Instructions encode explicit data types (`iadd`, `dadd`)**", "**JVM, WebAssembly (Wasm)**", "**Fast type verification and straight-line JIT native compilation**"],
          ["**Untyped / Dynamic Bytecode**", "**Instructions handle boxed generic dynamic values**", "**CPython, Ruby YARV, PHP Zend VM**", "**Flexible runtime dynamic typing; higher dispatch overhead**"]
        ],
        n: "Bytecode serves as the critical bridge between human-readable " +
          "source code and hardware execution. In a **stack-based virtual machine** " +
          "(like the Java Virtual Machine or Python's eval loop), an operation " +
          "like `a = b + c` is compiled into: `iload_1` (push variable b), " +
          "`iload_2` (push variable c), `iadd` (pop both, add, push result), " +
          "and `istore_0` (pop into a). In a **register-based VM** (like Lua " +
          "or Android's Dalvik/ART), the same logic compiles into a single " +
          "instruction: `ADD R0, R1, R2`. Register VMs execute 30% fewer " +
          "instructions, but instruction decoding is more complex. Crucially, " +
          "bytecode is not machine code: a physical Intel or ARM CPU cannot " +
          "execute bytecode instructions. The virtual machine must either " +
          "**interpret** each opcode sequentially in a dispatch loop " +
          "(`switch(opcode)`) or invoke a **Just-In-Time (JIT) compiler** " +
          "to translate hot bytecode blocks into native machine instructions " +
          "directly in RAM. Because bytecode files preserve structured symbol " +
          "tables, type descriptors, and method signatures, they can be " +
          "decompiled back into readable source code unless explicitly " +
          "scrambled by bytecode obfuscators."
      },

      miss: [
        {
          w: "Bytecode is machine code that runs directly on CPU silicon.",
          r: "Bytecode is a software-defined instruction format designed for an abstract " +
            "virtual machine. It requires a software runtime or JIT compiler to map to " +
            "physical hardware instructions."
        },
        {
          w: "Bytecode is always dramatically slower than compiled C code.",
          r: "Modern JIT compilers analyze bytecode at runtime and compile hot spots " +
            "into native machine code that often approaches or matches C/C++ speed."
        },
        {
          w: "Python is an interpreted language so it does not use bytecode.",
          r: "CPython compiles all Python scripts into bytecode `.pyc` files stored " +
            "in `__pycache__` before execution. The Python runtime is a bytecode interpreter."
        },
        {
          w: "Distributing bytecode protects proprietary algorithms from reverse engineering.",
          r: "Bytecode retains rich class hierarchies, method names, and variable types. " +
            "Decompilers (such as CFR, JD-GUI, or uncompyle6) reconstruct near-original " +
            "source code in seconds."
        }
      ],

      trade: {
        buys: [
          "True 'Write Once, Run Anywhere' cross-platform software portability.",
          "Significantly faster startup and execution than raw Abstract Syntax Tree (AST) interpreters.",
          "Compact binary distribution format compared to verbose text source code.",
          "Sandboxed execution: the virtual machine validates bytecode safety before execution."
        ],
        costs: [
          "Requires shipping and maintaining a full virtual machine runtime environment.",
          "Slower than pre-compiled native machine binaries on cold startup.",
          "Vulnerable to decompilation and intellectual property extraction without obfuscation.",
          "Instruction dispatch loop introduces CPU branch misprediction overhead in pure interpreters."
        ],
        avoid: [
          "Bare-metal embedded systems with severely constrained microsecond timing.",
          "Writing kernel-space device drivers requiring direct hardware memory addressing.",
          "High-frequency algorithmic trading systems where sub-microsecond latency is critical."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "jit-compilation",

      why: {
        before: "Languages faced a binary compromise: compile statically ahead " +
          "of time to native machine code (fast, but platform-locked), or interpret " +
          "bytecode sequentially (portable, but 10x–50x slower).",
        problem: "Interpreting bytecode inside a software dispatch loop wastes " +
          "massive CPU cycles on interpreter overhead, while static compilers " +
          "cannot utilize runtime profile information like actual branch " +
          "probabilities or dynamic object types.",
        shift: "**Just-In-Time (JIT) compilation: compile hot code at runtime.** " +
          "Execute code initially via an interpreter or fast baseline compiler, " +
          "identify frequently executed 'hot spots' through runtime profiling, " +
          "and compile those hot paths into optimized native machine code in memory."
      },

      num: {
        t: "JIT compilation pipeline tiers & dynamic optimizations",
        h: ["Compilation Tier / Phase", "Operation Performed", "Compilation Speed", "Optimization Depth"],
        r: [
          ["**Interpreter**", "**Executes bytecode directly; gathers execution counters**", "**Instantaneous (zero compilation delay)**", "**Zero optimization; high runtime overhead**"],
          ["**Baseline JIT (e.g. C1 / Maglev)**", "**Fast compilation of methods crossing execution threshold**", "**Fast (milliseconds)**", "**Basic register allocation and local optimizations**"],
          ["**Optimizing JIT (e.g. C2 / TurboFan)**", "**Aggressive native compilation of heavily looped hot spots**", "**Slow (compiles in background threads)**", "**Method inlining, loop unrolling, escape analysis**"],
          ["**Inline Caching (IC)**", "**Caches target method pointers at polymorphic call sites**", "**Executed at runtime**", "**Converts virtual method lookups into direct machine jumps**"],
          ["**Escape Analysis**", "**Detects if an allocated object leaves the current method**", "**Compiler analysis pass**", "**Allocates objects on CPU stack or registers instead of GC heap**"],
          ["**Deoptimization (Bailout)**", "**Discards native code when speculative assumptions fail**", "**Instant fallback to interpreter**", "**Safety net allowing ultra-aggressive speculative optimizations**"]
        ],
        n: "JIT compilation is the technological marvel powering high-speed " +
          "execution in modern runtimes (Java HotSpot, V8 JavaScript, .NET " +
          "RyuJIT, PyPy). Most modern engines use **Tiered Compilation**. " +
          "When a method starts, it is executed by a lightweight interpreter. " +
          "The runtime instruments the code with invocation counters and loop " +
          "backedge counters. When an invocation threshold is crossed (e.g. " +
          "10,000 runs), the method is deemed 'hot'. A background compiler " +
          "analyzes the method's **Profile-Guided Optimization (PGO)** data. " +
          "Crucially, the JIT compiler performs **speculative optimization**: " +
          "if runtime statistics show that an `Animal.speak()` method has " +
          "received a `Dog` object 99.9% of the time, the JIT inlines `Dog.speak()` " +
          "directly into the caller, eliminating virtual method dispatch. " +
          "It places a speculative guard check: if a `Cat` is unexpectedly " +
          "passed in the future, the guard fails, triggering **Deoptimization " +
          "(Bailout)**—the runtime reconstructs the interpreter stack frame " +
          "mid-execution and drops back to the interpreter without crashing."
      },

      miss: [
        {
          w: "JIT-compiled languages can never match the speed of statically compiled C++.",
          r: "Because JIT compilers have access to real-time profile data and exact " +
            "hardware CPU features (AVX instructions) at runtime, JIT code can occasionally " +
            "outperform static C++ on highly polymorphic code."
        },
        {
          w: "JIT compilation has zero runtime resource cost.",
          r: "JIT compilers run on background CPU threads, consuming significant memory " +
            "and CPU during compilation. This causes the classic 'warm-up' period in Java and Node.js."
        },
        {
          w: "All code in a JIT language is eventually compiled to native machine code.",
          r: "Cold code that runs only a few times (e.g. startup initialization, configuration " +
            "parsing) remains in bytecode to avoid wasting CPU on pointless compilation."
        },
        {
          w: "JIT compilers eliminate the need for clean, predictable code.",
          r: "Passing dozens of different object shapes through the same function creates " +
            "a **megamorphic call site**, which defeats inline caching, triggers repeated " +
            "deoptimizations, and causes severe performance degradation."
        }
      ],

      trade: {
        buys: [
          "Combines cross-platform bytecode distribution with near-native execution speed.",
          "Profile-guided optimizations adapt to actual real-world runtime data patterns.",
          "Aggressive speculative optimizations: method inlining, escape analysis, devirtualization.",
          "Automatically targets the exact instruction set (AVX, NEON) of the host CPU."
        ],
        costs: [
          "Warm-up latency: peak performance is only achieved after code paths are profiled.",
          "CPU and memory overhead from running compiler threads alongside application code.",
          "Non-deterministic latency jitter during compilation passes and deoptimizations.",
          "Vulnerability to JIT spray security attacks requiring memory protection mitigations (W^X)."
        ],
        avoid: [
          "Short-lived command-line utilities (warm-up time exceeds total execution time).",
          "Hard real-time systems (robotics, avionics) where deoptimization pauses violate deadlines.",
          "Extremely memory-constrained embedded devices unable to store JIT compiler infrastructures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "aot-compilation",

      why: {
        before: "Managed languages (Java, .NET) relied on JIT compilation, " +
          "requiring massive virtual machine runtimes that took seconds to " +
          "warm up and consumed hundreds of megabytes of baseline RAM.",
        problem: "In cloud-native serverless environments (AWS Lambda) and containerized " +
          "microservices, multi-second 'cold start' warm-up delays and heavy memory " +
          "footprints degrade user experience and balloon cloud hosting costs.",
        shift: "**Ahead-Of-Time (AOT) compilation: compile to native binaries upfront.** " +
          "Translate managed source code or bytecode directly into self-contained, " +
          "platform-specific machine code binaries before deployment (GraalVM Native Image, " +
          "Rust, Go, .NET Native AOT)."
      },

      num: {
        t: "AOT vs JIT execution characteristics comparison",
        h: ["Performance Dimension", "Ahead-Of-Time (AOT)", "Just-In-Time (JIT)"],
        r: [
          ["**Cold Start / Startup Time**", "**Instantaneous (5–20 milliseconds)**", "**Slow (seconds to minutes for large frameworks)**"],
          ["**Baseline Memory Footprint (RSS)**", "**Tiny (15–40 MB for complete REST API)**", "**High (150–500 MB for JVM/CLR base)**"],
          ["**Build / Compilation Time**", "**Slow (minutes of static reachability analysis)**", "**Fast (instant bytecode packaging)**"],
          ["**Peak Throughput on Long Workloads**", "**High (slightly lower than optimal JIT)**", "**Maximum (benefits from dynamic PGO & deopt)**"],
          ["**Dynamic Reflection & Class Loading**", "**Restricted (requires compile-time configuration)**", "**Fully supported dynamically at runtime**"],
          ["**Binary Portability**", "**Tied strictly to target OS and CPU architecture**", "**Universal bytecode runs on any OS with VM**"]
        ],
        n: "AOT compilation transforms managed runtimes into standalone " +
          "native executable files. The fundamental operating principle of " +
          "managed AOT (such as **GraalVM Native Image** or **.NET Native AOT**) " +
          "is the **Closed-World Assumption**. During the build phase, the " +
          "AOT compiler conducts exhaustive **static reachability analysis**: " +
          "starting from `main()`, it walks the entire call graph across all " +
          "classes, dependencies, and runtime libraries. Any class, method, " +
          "or field that cannot be statically proven to be reachable is " +
          "permanently pruned (tree shaking). The compiler then embeds a " +
          "stripped-down, native runtime component (including a lightweight " +
          "garbage collector and thread manager) and compiles everything into " +
          "an ELF, Mach-O, or PE native binary. The resulting executable " +
          "starts in **single-digit milliseconds** with zero VM warm-up " +
          "overhead. However, the closed-world assumption creates major " +
          "engineering hurdles: dynamic Java reflection, runtime dynamic proxies, " +
          "and dynamic class loading cannot be analyzed statically without " +
          "explicit JSON reachability configuration files."
      },

      miss: [
        {
          w: "AOT compiled code always runs faster than JIT compiled code.",
          r: "AOT wins decisively on startup speed and memory footprint. However, for " +
            "long-running server workloads, an optimizing JIT with runtime profile-guided " +
            "optimization (PGO) often achieves higher sustained peak throughput."
        },
        {
          w: "AOT compilation eliminates the garbage collector.",
          r: "Managed AOT (GraalVM, Go, .NET Native AOT) still embeds a garbage collector " +
            "directly into the compiled native binary. Only unmanaged languages (C, C++, Rust) " +
            "run without a garbage collector."
        },
        {
          w: "Any existing Java or .NET codebase can be converted to AOT with one click.",
          r: "Heavy reliance on dynamic reflection, runtime code generation, and unconfigured " +
            "classloaders will cause AOT compilation to fail or crash at runtime."
        },
        {
          w: "AOT compilation replaces bytecode entirely in all development phases.",
          r: "AOT compilation takes minutes of intensive CPU analysis. Developers " +
            "use fast JIT/bytecode during iterative development and compile to AOT for production."
        }
      ],

      trade: {
        buys: [
          "Instantaneous sub-20ms cold start latency ideal for serverless lambdas and CLI tools.",
          "Dramatic 70%–90% reduction in container memory (RSS) footprint.",
          "Self-contained native executables: zero requirement to install external JRE or .NET runtimes.",
          "Enhanced security: prevents dynamic code injection and runtime class tampering."
        ],
        costs: [
          "Significantly longer build times (often 3 to 10 minutes in CI/CD pipelines).",
          "Severely restricts dynamic language features (reflection, bytecode generation, dynamic proxies).",
          "Binaries are platform-dependent: must compile separately for Linux x86, Linux ARM, and Windows.",
          "Slightly lower peak throughput on certain long-running complex server benchmarks."
        ],
        avoid: [
          "Legacy enterprise frameworks relying heavily on unconfigured dynamic reflection.",
          "Rapid local development loops where multi-minute build times destroy developer flow.",
          "Systems requiring dynamic runtime plugin loading from uncompiled external files."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "java-virtual-machine",

      why: {
        before: "Software applications were compiled directly to native machine " +
          "binaries tied to specific CPU architectures and operating system ABIs.",
        problem: "Enterprise code was plagued by platform fragmentation (recompiling " +
          "and patching for Solaris, AIX, Windows, Linux) and fatal memory corruption bugs " +
          "(buffer overflows, dangling pointers, double-free crashes).",
        shift: "**The Java Virtual Machine (JVM): an abstract, standardized computing machine.** " +
          "Provide a secure, memory-managed, cross-platform execution environment " +
          "implementing 'Write Once, Run Anywhere' (WORA) via portable bytecode."
      },

      num: {
        t: "JVM memory architecture & Garbage Collection engines",
        h: ["Memory Subsystem / GC", "Architectural Role", "Key Mechanism", "Production Use Case"],
        r: [
          ["**Heap: Young Generation**", "**Short-lived object allocation (Eden & Survivor spaces)**", "**Minor GC via pointer-bumping; fast copying collector**", "**Holds temporary request-scoped web objects**"],
          ["**Heap: Old Generation**", "**Long-lived objects surviving multiple GC tenuring cycles**", "**Major GC / Mark-Sweep-Compact**", "**Holds caches, singletons, session states**"],
          ["**Metaspace**", "**Native memory storing class metadata and method bytecodes**", "**Allocated out of OS memory (replaces PermGen)**", "**Scales dynamically with loaded class definitions**"],
          ["**G1 GC (Garbage-First)**", "**Region-based incremental concurrent generational collector**", "**Prioritizes regions with most garbage to meet pause targets**", "**Default general-purpose collector for medium heaps (4–32 GB)**"],
          ["**ZGC / Shenandoah**", "**Concurrent, low-latency generational garbage collectors**", "**Colored pointers and load barriers; concurrent compaction**", "**Ultra-low latency (<1 ms pause times) on multi-terabyte heaps**"],
          ["**Virtual Threads (Project Loom)**", "**Lightweight user-mode threads managed by the JVM**", "**Mounts millions of virtual threads onto small OS carrier thread pool**", "**High-throughput concurrent I/O without reactive programming complexity**"]
        ],
        n: "The Java Virtual Machine (JVM) is one of the most sophisticated " +
          "software systems ever engineered. It is not merely an execution " +
          "engine for Java; it is a **universal runtime platform** hosting " +
          "an entire language family including **Kotlin, Scala, Clojure, Groovy, " +
          "and JRuby**. The JVM manages memory across distinct regions: the " +
          "**Heap** (where all class instances and arrays reside), **Metaspace** " +
          "(native memory storing class definitions, constant pools, and method " +
          "descriptors), and **Thread Stacks** (storing local primitive variables " +
          "and method invocation frames). Its execution engine features the " +
          "legendary **HotSpot** tiered compiler, transitioning methods " +
          "from the interpreter to the C1 baseline compiler, and finally to " +
          "the C2 optimizing compiler. Garbage Collection on the JVM has evolved " +
          "from stop-the-world pauses to cutting-edge concurrent collectors " +
          "like **ZGC**, which achieves sub-millisecond maximum pause times " +
          "even on heaps spanning 16 Terabytes. With the introduction of " +
          "**Virtual Threads (Project Loom)** in Java 21, the JVM decouples " +
          "application concurrency from operating system kernel threads, " +
          "allowing millions of concurrent socket connections with clean, " +
          "synchronous, blocking-style code."
      },

      miss: [
        {
          w: "The JVM is exclusively for the Java programming language.",
          r: "The JVM executes standard bytecode. Leading modern languages like Kotlin, " +
            "Scala, and Clojure compile to JVM bytecode and leverage the JVM ecosystem."
        },
        {
          w: "JVM Garbage Collection always causes multi-second stop-the-world freezes.",
          r: "Modern concurrent collectors (ZGC, Shenandoah) perform marking and compaction " +
            "concurrently with running application threads, guaranteeing pause times under 1ms."
        },
        {
          w: "A JVM application's total memory is strictly determined by the `-Xmx` flag.",
          r: "`-Xmx` only caps the Java Heap. Total OS memory includes Metaspace, " +
            "thread stacks (typically 1MB per OS thread), JIT code cache, and native buffers."
        },
        {
          w: "JVM bytecode is insecure compared to native compiled code.",
          r: "The JVM Bytecode Verifier mathematically proves that bytecode cannot forge " +
            "pointers, violate stack boundaries, or access unallocated memory before running."
        }
      ],

      trade: {
        buys: [
          "World-class enterprise stability, observability, and diagnostic tooling (JFR, JMC).",
          "Ultra-high-throughput tiered JIT compilation and sub-millisecond concurrent GC.",
          "Massive language and library ecosystem with seamless cross-language interoperability.",
          "Virtual Threads (Project Loom) deliver unprecedented I/O concurrency scalability."
        ],
        costs: [
          "Significant baseline memory footprint compared to Go or Rust binaries.",
          "Warm-up period required for JIT compilers to profile and optimize code.",
          "Complex configuration and tuning landscape (hundreds of GC and memory flags).",
          "Slow startup time for short-lived command-line tools without AOT Native Image."
        ],
        avoid: [
          "Microcontrollers or IoT devices with single-digit megabytes of RAM.",
          "Short-lived ephemeral CLI utilities without GraalVM ahead-of-time compilation.",
          "Hard real-time systems requiring deterministic nanosecond timing guarantees."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
    {
      slug: "net",

      why: {
        before: "Windows software development was fragmented across Win32 C++, " +
          "Visual Basic 6, and classic ASP, plagued by manual memory leaks and 'DLL Hell'.",
        problem: "Incompatible binary interfaces, memory safety crashes, and the " +
          "inability to share types seamlessly between different languages hindered " +
          "enterprise software development at scale.",
        shift: "**A unified, cross-platform managed developer platform.** " +
          "Microsoft created .NET, anchoring all languages (C#, F#, VB) to the " +
          "Common Language Runtime (CLR), Common Type System (CTS), and Common " +
          "Intermediate Language (CIL), transformed into modern high-speed cross-platform .NET."
      },

      num: {
        t: ".NET runtime architecture & high-performance subsystems",
        h: ["Subsystem / Feature", "Internal Mechanism", "Primary Advantage", "Modern Evolution"],
        r: [
          ["**Common Language Runtime (CLR)**", "**Execution engine managing memory, GC, threads, exceptions**", "**Robust type safety and enterprise reliability**", "**Cross-platform, open-source CoreCLR on Linux/macOS/ARM**"],
          ["**Common Intermediate Language (CIL)**", "**Standardized stack-based virtual bytecode format**", "**Language interoperability (C#, F# compile to same CIL)**", "**Standardized ECMA-335 specification**"],
          ["**Reified Generics**", "**Generics preserved at runtime; native specialization for structs**", "**Zero boxing/unboxing overhead for value types**", "**Massive performance superiority over Java type erasure**"],
          ["**RyuJIT Compiler**", "**Next-gen 64-bit Just-In-Time optimizing compiler**", "**Hardware SIMD intrinsics and Tiered Compilation**", "**Produces highly optimized native assembly**"],
          ["**`Span<T>` & `Memory<T>`**", "**Contiguous memory representation without heap allocation**", "**Enables zero-copy string parsing and array slicing**", "**Powers high-throughput Kestrel web server**"],
          ["**Native AOT**", "**Compiles C# directly to self-contained native machine binaries**", "**Instant startup (<10ms), tiny memory footprint (15MB)**", "**Production-ready for cloud-native microservices**"]
        ],
        n: "Modern .NET is an engineering powerhouse that has completely " +
          "shed its historical legacy as a Windows-only enterprise framework. " +
          "Re-architected from the ground up as open-source and cross-platform " +
          "(.NET Core and modern .NET 8/9), the platform is anchored by the " +
          "**Common Language Runtime (CLR)**. One of the greatest architectural " +
          "triumphs of .NET over competitors is **Reified Generics**: unlike " +
          "Java which utilizes 'type erasure' (converting generics to generic " +
          "`Object` and inserting runtime casts), .NET preserves generic type " +
          "definitions directly in bytecode and at runtime. When a `List<int>` " +
          "is instantiated, RyuJIT compiles a dedicated native machine code " +
          "implementation using 32-bit integers directly in memory, eliminating " +
          "costly **boxing and unboxing**. In recent releases, .NET introduced " +
          "game-changing zero-allocation primitives: **`Span<T>`** and **`Memory<T>`**. " +
          "A `Span<T>` provides a type-safe, bounds-checked window into any " +
          "contiguous memory block (managed heap, stack-allocated memory, or " +
          "unmanaged native buffers) without allocating new heap objects. This " +
          "zero-allocation architecture propelled Microsoft's **Kestrel** " +
          "web server into the top tiers of the TechEmpower benchmarks, " +
          "handling millions of requests per second with minimal garbage collection."
      },

      miss: [
        {
          w: ".NET only runs on Windows systems.",
          r: "Modern .NET is fully open-source and cross-platform, running first-class " +
            "on Linux, macOS, Docker containers, and ARM64 processors."
        },
        {
          w: ".NET is slow, bloated enterprise software.",
          r: "Modern .NET consistently outperforms Node.js, Python, and often Java " +
            "in industry web benchmarks thanks to zero-allocation spans and RyuJIT."
        },
        {
          w: "C# generics work via type erasure like Java.",
          r: ".NET implements reified generics. Generics exist as concrete runtime " +
            "types, generating specialized machine code for value types with zero boxing."
        },
        {
          w: "C# is just Microsoft's version of Java.",
          r: "C# pioneered modern language features years ahead of Java: async/await, " +
            "LINQ, true value types (structs), pattern matching, nullable reference types, and records."
        }
      ],

      trade: {
        buys: [
          "Exceptional runtime throughput and low memory allocation via `Span<T>` and reified generics.",
          "C# language features: async/await, LINQ, pattern matching, records, and memory safety.",
          "True cross-platform runtime running on Linux, Windows, macOS, and mobile (MAUI).",
          "Versatile compilation targets: high-speed JIT, Profile-Guided PGO, or Native AOT binaries."
        ],
        costs: [
          "Historical ecosystem confusion between legacy .NET Framework and modern .NET.",
          "Larger base deployment size than minimal Go or Rust single binaries.",
          "Steep learning curve for advanced memory primitives (`Span`, `Memory`, `ref struct`).",
          "Garbage collection tuning required for massive multi-gigabyte heap workloads."
        ],
        avoid: [
          "Severely constrained microcontrollers with sub-megabyte RAM limits.",
          "Teams exclusively dedicated to dynamic interpreted scripting without static typing.",
          "Building legacy Windows-only WCF or ASP.NET WebForms apps for modern cloud architectures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "runtime-environment",

      why: {
        before: "Early software ran directly on bare metal CPU hardware with " +
          "manual memory addressing, manual register juggling, and zero operating " +
          "system abstractions.",
        problem: "Managing hardware drivers, physical memory allocations, scheduling, " +
          "and security boundaries inside every single application was error-prone, " +
          "completely unportable, and vulnerable to catastrophic memory corruption.",
        shift: "**A standardized software execution layer: the Runtime Environment.** " +
          "Provide programs with a consistent execution layer encompassing memory " +
          "allocation, garbage collection, thread scheduling, system call abstraction, " +
          "and security isolation on top of the host operating system."
      },

      num: {
        t: "Runtime environments & execution models across language families",
        h: ["Runtime Environment", "Primary Languages", "Execution Model", "Core Subsystems Provided"],
        r: [
          ["**Java Virtual Machine (JVM)**", "**Java, Kotlin, Scala, Clojure**", "**Bytecode -> JIT compilation (HotSpot)**", "**Generational GC, classloader, virtual threads, JNI**"],
          ["**Common Language Runtime (CLR)**", "**C#, F#, VB.NET**", "**CIL Bytecode -> JIT / Native AOT**", "**Generational GC, reified generics, value types, P/Invoke**"],
          ["**V8 / libuv (Node.js)**", "**JavaScript, TypeScript**", "**AST -> Ignition bytecode -> TurboFan JIT**", "**Single-threaded event loop, libuv worker pool, GC**"],
          ["**CPython Runtime**", "**Python**", "**Source -> Bytecode -> Eval Loop**", "**Reference counting GC + cyclic detector, GIL, PyObject**"],
          ["**Go Runtime**", "**Go**", "**Statically linked native binary**", "**M:N goroutine scheduler, concurrent tri-color mark-sweep GC**"],
          ["**C Standard Runtime (glibc / musl)**", "**C, C++**", "**Native machine code**", "**`crt0` startup, `malloc`/`free` heap, POSIX syscall wrappers**"]
        ],
        n: "A Runtime Environment is the operational world in which a software " +
          "program lives and breathes. Even languages traditionally considered " +
          "'bare metal' possess a runtime: a compiled C program relies on the " +
          "**C Runtime (CRT / `glibc`)** to set up the call stack, parse command-line " +
          "arguments, initialize standard I/O streams, and manage dynamic " +
          "memory via `malloc`. In managed languages, the runtime is significantly " +
          "more comprehensive: it acts as a virtual operating system in user " +
          "space. Core subsystems of a modern managed runtime include: (1) " +
          "**The Memory Manager & Garbage Collector**, which automates heap " +
          "allocation and recycles unreferenced memory; (2) **The Execution Engine**, " +
          "which interprets bytecode or compiles it into machine instructions; " +
          "(3) **The Thread & Concurrency Scheduler**, which maps application " +
          "threads (or green threads/goroutines) onto operating system kernel " +
          "threads; (4) **The Type Safety & Security Verifier**, which ensures " +
          "memory bounds and pointer integrity; and (5) **Foreign Function " +
          "Interfaces (FFI)**, which bridge managed code to native OS libraries."
      },

      miss: [
        {
          w: "Compiled languages like C, C++, and Go have no runtime environment.",
          r: "All compiled languages have a runtime. C uses `glibc` for stack initialization " +
            "and heap management; Go embeds a sophisticated multi-megabyte runtime into " +
            "every binary to manage goroutines and tri-color garbage collection."
        },
        {
          w: "A runtime environment is simply an interpreter.",
          r: "An interpreter only parses and executes instructions. A runtime environment " +
            "provides memory allocators, thread scheduling, garbage collection, and OS abstractions."
        },
        {
          w: "The runtime environment is part of the operating system kernel.",
          r: "With few exceptions, runtime environments run strictly in user space, " +
            "interacting with the OS kernel through standard system calls (`syscalls`)."
        },
        {
          w: "All JavaScript runtime environments are identical.",
          r: "The V8 engine powers both Chrome and Node.js, but their runtime environments " +
            "diverge: Chrome provides browser Web APIs and the DOM; Node.js provides " +
            "`libuv`, filesystem access, network sockets, and process management."
        }
      ],

      trade: {
        buys: [
          "Insulates application logic from complex hardware architecture and OS idiosyncrasies.",
          "Guarantees memory safety and automated garbage collection, eliminating fatal memory leaks.",
          "Provides high-level concurrency abstractions (goroutines, virtual threads, event loops).",
          "Enforces security sandboxing and dynamic bytecode verification."
        ],
        costs: [
          "Introduces memory and binary size overhead for the embedded or shared runtime.",
          "Garbage collection cycles can introduce non-deterministic latency jitter.",
          "Indirection layer between application instructions and raw hardware execution.",
          "Operational dependency on runtime versions, security patches, and upgrades."
        ],
        avoid: [
          "Writing operating system kernels or hardware bootloaders with managed runtimes.",
          "Strict hard real-time systems where garbage collection pauses violate hardware safety.",
          "Applications requiring direct physical hardware memory register manipulation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "repl",

      why: {
        before: "Software development was bound to a rigid batch cycle: write code " +
          "in an editor, trigger a compiler, link libraries, run the binary from " +
          "the terminal, inspect crash outputs, and repeat.",
        problem: "The batch edit-compile-link-run loop created immense friction, " +
          "throttling exploratory programming, algorithmic experimentation, " +
          "data analysis, and interactive debugging.",
        shift: "**Read-Eval-Print Loop (REPL): an interactive programming shell.** " +
          "Provide a stateful, interactive environment that continuously reads user " +
          "code, evaluates it in the running runtime, prints the result, and loops back."
      },

      num: {
        t: "Interactive REPL stages & language environments",
        h: ["REPL Stage / Variant", "Mechanism", "Internal Action", "Representative Ecosystem"],
        r: [
          ["**Read**", "**Lexer & Parser**", "**Parses input string into an AST; handles multi-line input**", "**All interactive shells**"],
          ["**Eval**", "**Interpreter / Dynamic Compiler**", "**Evaluates AST in active runtime scope; binds new variables**", "**CPython, Node.js REPL**"],
          ["**Print**", "**Object Serializer / Pretty-printer**", "**Calls `repr()` / `toString()`; formats output for human reading**", "**IPython, Clojure REPL**"],
          ["**Loop**", "**Event Loop Handler**", "**Persists environment state and waits for next input line**", "**Interactive CLI shells**"],
          ["**Connected REPL (nREPL)**", "**Network socket protocol**", "**Connects running production server directly to developer editor**", "**Clojure, Common Lisp**"],
          ["**Computational Notebook**", "**HTTP / ZeroMQ kernel architecture**", "**Web interface sends code cells to stateful background kernel**", "**Jupyter, Observable, Google Colab**"]
        ],
        n: "The Read-Eval-Print Loop (REPL) originated in the Lisp community " +
          "(invented by John McCarthy in 1958) and remains one of the most " +
          "potent developer productivity amplifiers in computer science. " +
          "A REPL is fundamentally different from a simple operating system " +
          "terminal command prompt: it is a **stateful, dynamic execution " +
          "window directly inside an active programming language runtime**. " +
          "Variables defined in step 1 remain alive in memory for step 50. " +
          "In the Lisp and Clojure traditions, developers use **Connected REPLs** " +
          "(like nREPL): the developer's IDE (e.g. Emacs, VS Code) connects " +
          "over a TCP socket to a running application—even in a staging or " +
          "production environment. The developer can compile and inject new " +
          "functions, query live in-memory database connections, and fix bugs " +
          "in place with **zero process restarts**. In the data science and " +
          "machine learning revolution, the REPL evolved into the **Computational " +
          "Notebook (Jupyter)**: a web-based document combining rich markdown " +
          "narratives, interactive data visualizations, and executable code " +
          "cells evaluated by an underlying stateful REPL kernel process."
      },

      miss: [
        {
          w: "A REPL is just a basic command-line terminal like bash or zsh.",
          r: "A command-line shell executes discrete external programs. A REPL is a direct, " +
            "stateful interface to a specific language's runtime, evaluating expressions in a shared scope."
        },
        {
          w: "Statically compiled languages cannot have a REPL.",
          r: "Modern compiled languages have exceptional REPLs (Swift REPL, Kotlin REPL, " +
            "C# `dotnet-repl`, Rust `evcxr`), compiling snippets into temporary in-memory " +
            "bytecode or native assemblies on the fly."
        },
        {
          w: "Code tested in a REPL is guaranteed to run cleanly in a production script.",
          r: "REPLs preserve mutable state across out-of-order experiments. A variable " +
            "created 10 minutes earlier may make a function work in the REPL that fails " +
            "when run in a fresh, unpolluted script."
        },
        {
          w: "Computational notebooks (Jupyter) are fundamentally different from REPLs.",
          r: "A Jupyter notebook is an interactive web frontend built on top of a " +
            "standard REPL kernel (IPython) communicating over ZeroMQ sockets."
        }
      ],

      trade: {
        buys: [
          "Instantaneous feedback loop: test code ideas and API calls in seconds.",
          "Exploratory data analysis: inspect live in-memory datasets and models interactively.",
          "Connected REPL development enables live-patching running systems without restart.",
          "Lowers the learning curve for mastering new libraries and language features."
        ],
        costs: [
          "State pollution: out-of-order execution in interactive sessions hides missing dependencies.",
          "Lacks automated version-control reproducibility unless converted into tested scripts.",
          "Memory leaks if large experimental datasets are retained indefinitely in REPL scope.",
          "Security risk: exposing an unauthenticated networked REPL gives full remote code execution."
        ],
        avoid: [
          "Relying solely on REPL testing without writing automated unit test suites.",
          "Exposing connected REPL network ports to public or untrusted networks.",
          "Publishing out-of-order computational notebooks without running a clean restart verification."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
