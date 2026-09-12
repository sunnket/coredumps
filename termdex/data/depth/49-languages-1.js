/* ==========================================================================
   Depth pass 49 — programming languages: the first eight remaining.

   Every language is a set of trade-offs frozen in time. The ones that
   survive are the ones whose trade-offs matched a niche large enough to
   sustain an ecosystem — not the ones that were theoretically best.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "python",

      why: {
        before: "Writing programs meant compiling typed source code, waiting " +
          "for the build, fixing errors the compiler caught, and only then " +
          "running. Iteration speed scaled with how fast you could compile.",
        problem: "Compilation is a wall between idea and feedback. For " +
          "scripting, exploration, and glue code the wall is not worth the " +
          "type safety it buys. Scientists and analysts need to try things, " +
          "not declare types.",
        shift: "**Trade execution speed for iteration speed.** Python runs " +
          "slower than C, but you write it faster, read it easier, and the " +
          "ecosystem — NumPy, pandas, PyTorch, scikit-learn — delegates the " +
          "hot loops to compiled code anyway. The programmer writes Python; " +
          "the machine runs C. That split made it the default language of ML."
      },

      num: {
        t: "Where Python's speed comes from — and where it does not",
        h: ["Layer", "Speed", "Why"],
        r: [
          ["**Pure Python loop**", "**~100× slower than C**", "**interpreter overhead, dynamic dispatch**"],
          ["NumPy vectorised", "near-C", "compiled C/Fortran underneath"],
          ["**PyTorch CUDA**", "**GPU-speed**", "**kernel launches from Python surface**"],
          ["Cython / Numba", "near-C", "compiles a Python subset"],
          ["**GIL-bound threads**", "**no CPU parallelism**", "**threads help I/O only**"],
          ["multiprocessing", "scales with cores", "separate processes, IPC cost"]
        ],
        n: "The **Global Interpreter Lock (GIL)** is the single fact about " +
          "Python's runtime that matters most in practice. It means only one " +
          "thread executes Python bytecode at a time, so threading helps I/O-" +
          "bound work (network, disk) but not CPU-bound work. The standard " +
          "workaround is `multiprocessing`, which spawns separate processes " +
          "each with their own GIL — effective but heavier. The deeper " +
          "workaround, and the one the entire ML ecosystem uses, is to never " +
          "do CPU-heavy work in Python at all: call into NumPy, PyTorch, or " +
          "a C extension, which releases the GIL while the compiled code " +
          "runs. **Python is not slow — it is a fast language for calling " +
          "fast libraries.** The cost is that debugging crosses language " +
          "boundaries: a segfault in a C extension gives you no Python " +
          "traceback, and memory leaks in native code are invisible to " +
          "Python's garbage collector."
      },

      miss: [
        {
          w: "Python is slow, so it's a bad choice for production.",
          r: "Python is slow **at pure loops**. Production ML serving, web " +
            "backends (via ASGI servers), and data pipelines all run Python " +
            "successfully because the hot paths call compiled code. If your " +
            "bottleneck is actually a Python loop, rewrite that loop — not " +
            "the whole system."
        },
        {
          w: "Type hints make Python statically typed.",
          r: "Type hints are **checked by external tools** (mypy, Pyright) " +
            "and **ignored by the runtime**. They improve tooling and " +
            "readability but do not prevent type errors at execution time. " +
            "For boundary validation, use a runtime schema library like " +
            "Pydantic."
        },
        {
          w: "Virtual environments are optional.",
          r: "Without them, every project shares one global set of packages. " +
            "Two projects needing different versions of the same library " +
            "will corrupt each other. **Always use a venv, conda env, or " +
            "equivalent.** This is not a best practice — it is the minimum " +
            "for reproducibility."
        },
        {
          w: "The GIL will be removed soon.",
          r: "PEP 703 (free-threaded Python) is experimental in 3.13 and " +
            "**will take years** before the ecosystem adapts. C extensions " +
            "that assume the GIL exists need rewriting. Plan for the GIL " +
            "today, and treat no-GIL as a future benefit."
        }
      ],

      trade: {
        buys: [
          "Fastest iteration cycle of any mainstream language.",
          "The ML and data-science ecosystem has no real competitor.",
          "Readable syntax lowers onboarding cost for teams.",
          "Massive standard library and third-party package index.",
          "Glue between systems written in different languages."
        ],
        costs: [
          "Pure Python is genuinely slow for CPU-bound loops.",
          "GIL limits true thread-level CPU parallelism.",
          "Dynamic typing means bugs surface at runtime.",
          "Packaging and dependency management is still fragmented.",
          "Memory usage is high — every int is a heap object."
        ],
        avoid: [
          "Latency-critical path where microseconds matter — use C/C++/Rust.",
          "Mobile app development — no mainstream mobile runtime.",
          "Large client-side applications — no browser runtime.",
          "Systems programming requiring manual memory control."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "javascript",

      why: {
        before: "Web pages were static documents. Interactivity meant a " +
          "round trip to the server — submit a form, wait, get a new page.",
        problem: "Round trips are too slow for responsive interfaces. " +
          "Dragging, animating, validating input — all need instant feedback " +
          "in the browser, where no compiled language was allowed to run.",
        shift: "**Put a programming language in the browser.** JavaScript " +
          "became the only language every browser executes natively. That " +
          "monopoly — not the quality of the language — is what made it the " +
          "most widely deployed programming language on earth. Node.js then " +
          "brought it to the server, and the single-language-everywhere " +
          "argument kept it there."
      },

      num: {
        t: "JavaScript's execution model",
        h: ["Concept", "What it means", "Consequence"],
        r: [
          ["**Single-threaded**", "**one call stack**", "**long computation blocks the UI**"],
          ["**Event loop**", "**queue of callbacks**", "**async I/O without threads**"],
          ["Microtask queue", "Promises resolve here", "runs before rendering"],
          ["**Macrotask queue**", "**setTimeout, I/O**", "**runs after microtasks**"],
          ["Web Workers", "separate threads", "no shared memory, message passing"],
          ["**JIT compilation**", "**V8 optimises hot code**", "**near-native speed when warm**"]
        ],
        n: "The event loop is JavaScript's answer to concurrency: instead of " +
          "multiple threads sharing memory, there is one thread draining a " +
          "queue of callbacks. I/O is non-blocking — `fetch`, `setTimeout`, " +
          "file reads all return immediately and push a callback onto the " +
          "queue when done. This makes I/O-heavy servers (Node.js) " +
          "surprisingly efficient: one thread handles thousands of " +
          "connections because it never waits. The trap is **CPU-bound " +
          "work**: a tight loop blocks the queue, freezing the UI in a " +
          "browser or starving other requests on a server. The fix is Web " +
          "Workers (browser) or worker threads (Node), which run on separate " +
          "OS threads but communicate only via message passing — no shared " +
          "mutable state. **Promises** replaced callback nesting (" +
          "\"callback hell\") and **async/await** made Promises read like " +
          "synchronous code, which is the form most modern JS is written in."
      },

      miss: [
        {
          w: "JavaScript is not a real programming language.",
          r: "It runs the front end of every major application on earth, " +
            "powers server infrastructure at Netflix, PayPal, and LinkedIn, " +
            "and its JIT compilers produce near-native machine code. Its " +
            "quirks are real, but so is its reach."
        },
        {
          w: "`==` and `===` are interchangeable.",
          r: "`==` coerces types before comparing: `0 == ''` is `true`, " +
            "`null == undefined` is `true`. `===` compares without coercion. " +
            "**Use `===` always** — the coercion rules are a memorisation " +
            "tax that buys nothing."
        },
        {
          w: "async/await makes code run in parallel.",
          r: "It makes **asynchronous** code read sequentially. It does not " +
            "add threads. `await` yields the thread back to the event loop; " +
            "the awaited operation runs elsewhere (OS, network, timer). For " +
            "parallelism, use `Promise.all()` or Workers."
        },
        {
          w: "Node.js is slow because it is JavaScript.",
          r: "V8's JIT compiles hot code to machine instructions. Node's " +
            "event-loop model handles **high-concurrency I/O** better than " +
            "thread-per-request servers for many workloads. It is not the " +
            "right tool for CPU-heavy computation, but it is genuinely fast " +
            "at what it is designed for."
        }
      ],

      trade: {
        buys: [
          "Runs in every browser on earth — no installation.",
          "Single language for front end and back end.",
          "Non-blocking I/O model handles massive concurrency.",
          "Ecosystem (npm) is the largest package registry in existence.",
          "JIT compilation makes hot code surprisingly fast."
        ],
        costs: [
          "Type coercion and loose typing cause subtle bugs.",
          "Single-threaded — CPU-bound work blocks everything.",
          "npm dependency trees can be enormous and fragile.",
          "Language quirks (this, prototypes, hoisting) require discipline.",
          "Security surface of third-party packages is vast."
        ],
        avoid: [
          "CPU-intensive computation — use a compiled language.",
          "Systems programming — no direct memory access.",
          "Embedded or real-time systems — runtime is too heavy.",
          "When type safety is critical and TypeScript overhead is unwanted."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "typescript",

      why: {
        before: "JavaScript codebases grew from scripts to applications — " +
          "hundreds of files, dozens of contributors, millions of lines. " +
          "Every rename, every changed return type, every optional field was " +
          "a potential silent breakage.",
        problem: "Dynamic typing at scale is a **maintenance tax**. A function " +
          "that used to return a string now returns an object, and every " +
          "caller must be found and updated manually. The language provides " +
          "no help.",
        shift: "**Add types that the compiler checks and the runtime ignores.** " +
          "TypeScript is a superset of JavaScript: every `.js` file is valid " +
          "TypeScript. You add annotations, the compiler checks them, then " +
          "erases them and emits plain JavaScript. The types exist at " +
          "development time — not at runtime — which is both its power " +
          "(incremental adoption) and its main gotcha (runtime data is " +
          "untyped)."
      },

      num: {
        t: "Type system features that matter most",
        h: ["Feature", "What it does", "Why it matters"],
        r: [
          ["**Union types**", "**`string | number`**", "**models values that are one of several types**"],
          ["**Generics**", "**`Array<T>`**", "**type-safe containers and utilities**"],
          ["Conditional types", "`T extends U ? X : Y`", "type-level branching"],
          ["**Mapped types**", "**`{ [K in keyof T]: ... }`**", "**transform types systematically**"],
          ["**Structural typing**", "**shape match, not name match**", "**no explicit implements needed**"],
          ["Discriminated unions", "`{ type: 'a' } | { type: 'b' }`", "exhaustive switch checking"]
        ],
        n: "TypeScript's type system is **structural, not nominal**: if an " +
          "object has the right shape, it fits the type, regardless of what " +
          "class it came from. This is a fundamental difference from Java or " +
          "C#, where a class must explicitly declare that it implements an " +
          "interface. Structural typing makes TypeScript feel natural over " +
          "JavaScript's duck-typed objects — but it also means two unrelated " +
          "types with the same shape are assignable to each other, which " +
          "occasionally causes confusion. The **`strict: true`** compiler " +
          "flag enables null checking, strict function types, and several " +
          "other checks — it is where most of TypeScript's value lives, and " +
          "running without it defeats much of the purpose. The deepest " +
          "gotcha is **runtime boundaries**: data from an API, a database, " +
          "or user input has no types at runtime, so TypeScript's guarantees " +
          "stop at the network edge. Use **Zod, Valibot, or io-ts** to " +
          "validate at the boundary and derive TypeScript types from the " +
          "schema."
      },

      miss: [
        {
          w: "TypeScript adds runtime overhead.",
          r: "Types are **completely erased** before the code runs. The " +
            "output is plain JavaScript. There is zero runtime cost — the " +
            "cost is compile time and developer time writing types."
        },
        {
          w: "`any` is fine for quick prototyping.",
          r: "`any` **disables the type system** for that value and " +
            "everything it touches. Use `unknown` instead — it requires " +
            "narrowing before use, which is the whole point of types."
        },
        {
          w: "TypeScript catches all bugs.",
          r: "It catches **type errors** — wrong shapes, missing fields, " +
            "impossible assignments. It cannot catch logic errors, race " +
            "conditions, or runtime data that does not match your types. " +
            "Validate external data at the boundary."
        },
        {
          w: "You need to convert the whole codebase at once.",
          r: "TypeScript is designed for **incremental adoption**. Rename " +
            "`.js` to `.ts`, fix errors file by file, and use " +
            "`allowJs: true` to mix. Large projects migrate over months."
        }
      ],

      trade: {
        buys: [
          "Catches entire bug class at compile time — renames, nulls, shape mismatches.",
          "IDE autocompletion and refactoring become reliable.",
          "Types serve as documentation that the compiler enforces.",
          "Incremental adoption — no rewrite required.",
          "Structural typing fits JavaScript's duck-typing culture."
        ],
        costs: [
          "Build step required — adds toolchain complexity.",
          "Complex generics and conditional types have a learning curve.",
          "Runtime data is still untyped — boundary validation needed.",
          "Type definitions for third-party packages can lag or be wrong.",
          "Over-engineering types can make simple code unreadable."
        ],
        avoid: [
          "Tiny scripts where the type overhead exceeds the code.",
          "When the team has no TypeScript experience and deadlines are tight.",
          "Prototypes that will be thrown away before anyone maintains them."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "java",

      why: {
        before: "Programs compiled to machine code for one CPU architecture. " +
          "Moving software to a different OS or chip meant recompiling, " +
          "fixing platform-specific bugs, and sometimes rewriting.",
        problem: "Enterprise software runs on heterogeneous infrastructure — " +
          "different OSes, different hardware. Compiling to native code ties " +
          "the binary to one platform.",
        shift: "**Compile to bytecode, run on a virtual machine.** The JVM " +
          "abstracts the hardware: write once, run anywhere. Java added " +
          "automatic garbage collection, strong typing, and a philosophy of " +
          "explicitness that makes large teams on large codebases safer — at " +
          "the cost of verbosity that smaller projects do not need."
      },

      num: {
        t: "JVM execution pipeline",
        h: ["Stage", "What happens", "Implication"],
        r: [
          ["**Compilation**", "**`.java` → bytecode (`.class`)**", "**platform-independent artifact**"],
          ["**Class loading**", "**bytecode loaded on demand**", "**startup is lazy**"],
          ["Interpretation", "bytecode interpreted initially", "fast startup, slow execution"],
          ["**JIT compilation**", "**hot methods → machine code**", "**steady-state speed near C**"],
          ["**Garbage collection**", "**automatic memory reclaim**", "**no manual free, but GC pauses**"],
          ["Tiered compilation", "C1 quick, C2 aggressive", "warm-up before peak throughput"]
        ],
        n: "Java's startup is slow because the JVM must load classes, verify " +
          "bytecode, and JIT-compile hot paths. But once warm, the JIT " +
          "compiler (C2, or Graal) produces machine code that competes with " +
          "ahead-of-time compiled languages. This warm-up cost is why Java " +
          "is a poor fit for CLI tools and serverless functions with cold " +
          "starts, but an excellent fit for long-running servers where " +
          "throughput matters more than first-request latency. **GraalVM " +
          "Native Image** addresses the cold-start problem by compiling " +
          "ahead of time to a native binary, but at the cost of reflection " +
          "and dynamic class loading — features the ecosystem relies on " +
          "heavily. **Virtual threads** (Project Loom, Java 21) are the " +
          "other major shift: they make one-thread-per-request viable again " +
          "by multiplexing millions of lightweight threads onto a small pool " +
          "of OS threads, eliminating the reactive-programming complexity " +
          "that was Java's answer to high concurrency."
      },

      miss: [
        {
          w: "Java is too verbose to be productive.",
          r: "Modern Java (17+) has records, sealed classes, pattern matching, " +
            "`var`, and text blocks. The verbosity critique applies to " +
            "Java 8 idioms. The language has evolved significantly."
        },
        {
          w: "Java is slow.",
          r: "The JIT compiles hot code to machine instructions with " +
            "aggressive inlining and escape analysis. Long-running Java " +
            "services routinely match or exceed C++ throughput. Startup is " +
            "slow — steady-state is fast."
        },
        {
          w: "Garbage collection means you never think about memory.",
          r: "You do not manually free, but you still cause leaks — " +
            "unbounded caches, unclosed streams, listener registrations that " +
            "prevent collection. GC also introduces **pause latency** that " +
            "matters for real-time systems."
        },
        {
          w: "You must use Spring for everything.",
          r: "Spring is dominant but not mandatory. Quarkus, Micronaut, and " +
            "Helidon offer lighter alternatives optimised for cloud-native " +
            "and GraalVM native compilation."
        }
      ],

      trade: {
        buys: [
          "Write once, run anywhere — JVM abstracts the platform.",
          "Best-in-class tooling: IDEs, profilers, debuggers.",
          "Strong static typing catches errors at compile time.",
          "Massive enterprise ecosystem and library availability.",
          "Virtual threads make high-concurrency servers simple."
        ],
        costs: [
          "Slow cold start — JIT needs warm-up time.",
          "Verbose compared to Python or Kotlin for small tasks.",
          "GC pauses can affect latency-sensitive applications.",
          "Heavy memory footprint per process.",
          "Ecosystem heavily favours annotation-driven frameworks."
        ],
        avoid: [
          "Short-lived CLI tools or serverless functions (cold start).",
          "Quick scripts and prototypes where iteration speed matters.",
          "Resource-constrained embedded systems.",
          "When the team is small and verbosity slows development."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "c",

      why: {
        before: "Programs were written in assembly — one instruction set per " +
          "CPU. Porting meant rewriting. Productivity scaled with how well " +
          "you knew one chip.",
        problem: "Assembly is not portable, not readable, and not productive " +
          "enough for systems as large as an operating system.",
        shift: "**A portable assembler.** C maps almost directly to the " +
          "machine — pointers are addresses, structs are memory layouts, " +
          "there is no runtime. But it compiles on every architecture, so " +
          "Unix could be written once and ported everywhere. The cost is " +
          "that **entire vulnerability classes** — buffer overflows, " +
          "use-after-free, double free — are the programmer's responsibility."
      },

      num: {
        t: "What C gives you, and what it does not",
        h: ["Feature", "C provides", "C does not provide"],
        r: [
          ["**Memory**", "**malloc/free — manual control**", "**garbage collection, bounds checking**"],
          ["**Pointers**", "**raw addresses, arithmetic**", "**safety, null checking**"],
          ["Types", "structs, enums, unions", "generics, classes, methods"],
          ["**Error handling**", "**return codes, errno**", "**exceptions, try/catch**"],
          ["Concurrency", "pthreads (library)", "language-level async"],
          ["**ABI**", "**the lingua franca of ABIs**", "**name mangling, templates**"]
        ],
        n: "C's enduring relevance is not nostalgia — it is **the ABI**. " +
          "Almost every language on earth can call a C function through its " +
          "foreign function interface. Python's ctypes, Java's JNI, Rust's " +
          "`extern \"C\"`, Go's cgo — all speak C's calling convention. " +
          "That makes C the interoperability layer of computing. Operating " +
          "system kernels (Linux, Windows, macOS), database engines " +
          "(SQLite, PostgreSQL), language runtimes (CPython, Ruby MRI), and " +
          "embedded firmware are overwhelmingly C because the alternatives " +
          "did not exist when they were started and rewriting is too costly. " +
          "**Undefined behaviour** is the concept that trips newcomers: if " +
          "you dereference a null pointer, overflow a signed integer, or " +
          "access freed memory, the compiler may do **anything** — not just " +
          "crash, but silently produce wrong results or optimise away your " +
          "safety check. Modern practice mitigates with sanitisers " +
          "(AddressSanitizer, UBSan), static analysis, and increasingly " +
          "with rewriting the risky parts in Rust."
      },

      miss: [
        {
          w: "C is obsolete now that Rust exists.",
          r: "C is embedded in the foundations of every operating system, " +
            "every major database, and most language runtimes. Rewriting " +
            "billions of lines is not feasible. New C is still written for " +
            "embedded, kernel, and ABI-boundary code."
        },
        {
          w: "Careful programmers can avoid memory bugs in C.",
          r: "Decades of CVEs from expert teams (Google, Microsoft, Apple) " +
            "prove otherwise. The issue is not carelessness — it is that C " +
            "provides **no structural defence** against these bugs. Manual " +
            "discipline does not scale."
        },
        {
          w: "C and C++ are the same language.",
          r: "C++ is a distinct language with classes, templates, RAII, " +
            "exceptions, and a much larger standard library. They share " +
            "syntax and C heritage, but idiomatic C++ looks nothing like C."
        },
        {
          w: "C is the fastest language.",
          r: "C gives the **most control**, which a skilled programmer can " +
            "use to write fast code. But Fortran often beats C at numerical " +
            "code, and modern C++ and Rust match C's speed with safer " +
            "abstractions. Speed comes from the programmer, not the language."
        }
      ],

      trade: {
        buys: [
          "Maps directly to hardware — predictable performance.",
          "Universal ABI — every language can call C.",
          "Tiny runtime — suitable for embedded and kernels.",
          "Compiles on essentially every platform that exists.",
          "Mature toolchain: GCC, Clang, sanitisers, Valgrind."
        ],
        costs: [
          "No memory safety — buffer overflows, use-after-free are your problem.",
          "Undefined behaviour can silently produce wrong results.",
          "Manual memory management is error-prone at scale.",
          "No built-in string type, containers, or error handling.",
          "Macro-heavy codebases are hard to read and debug."
        ],
        avoid: [
          "Application-level code where developer safety matters more than control.",
          "Large codebases where memory bugs are statistical certainties.",
          "When Rust provides the same performance with safety guarantees.",
          "Rapid prototyping — the iteration cycle is too slow."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "c-plus-plus",

      why: {
        before: "C provided raw speed and hardware control but no " +
          "abstraction. As programs grew, organising code with just structs " +
          "and functions became unmanageable.",
        problem: "Large systems need abstraction — encapsulation, " +
          "polymorphism, generic programming — but cannot afford to lose " +
          "the performance control that C provides.",
        shift: "**Zero-cost abstractions.** C++ adds classes, templates, " +
          "RAII, and operator overloading with the rule that features you " +
          "do not use cost nothing, and features you do use are as fast as " +
          "the equivalent hand-written C. This is why game engines, trading " +
          "systems, browsers, and ML frameworks are C++."
      },

      num: {
        t: "Key C++ mechanisms and their costs",
        h: ["Mechanism", "What it enables", "Runtime cost"],
        r: [
          ["**RAII**", "**resource cleanup via destructors**", "**zero — destructor is compile-time determined**"],
          ["**Templates**", "**generic code, metaprogramming**", "**zero at runtime — instantiated at compile time**"],
          ["Virtual dispatch", "polymorphism via vtable", "one indirection per call"],
          ["**Smart pointers**", "**automatic memory management**", "**unique_ptr: zero; shared_ptr: refcount**"],
          ["Move semantics", "transfer ownership cheaply", "no copy, just pointer swap"],
          ["**Exceptions**", "**error propagation**", "**zero-cost when not thrown (table-based)**"]
        ],
        n: "C++ is one of the largest languages in existence, and different " +
          "teams use **wildly different subsets**. Google bans exceptions. " +
          "Game studios avoid the standard library's allocators. Embedded " +
          "teams disable RTTI. This is not fragmentation — it is the " +
          "consequence of a language that tries to serve every domain. " +
          "**Modern C++ (11 onwards)** is a dramatically better language " +
          "than C++98: move semantics eliminate unnecessary copies, " +
          "`std::unique_ptr` replaces most raw `new`/`delete`, range-based " +
          "for loops replace iterator boilerplate, and `auto` reduces type " +
          "noise. The perpetual complaints are **compile times** (templates " +
          "are instantiated per translation unit) and **error messages** " +
          "(template errors can span hundreds of lines). Concepts (C++20) " +
          "constrain templates and improve errors significantly. The " +
          "competitive pressure from Rust is real: Rust provides similar " +
          "performance with compile-time memory safety guarantees, and new " +
          "systems projects increasingly choose it."
      },

      miss: [
        {
          w: "C++ is just C with classes.",
          r: "Modern C++ has templates, RAII, smart pointers, lambdas, " +
            "concepts, modules, coroutines, and ranges. Idiomatic C++ looks " +
            "nothing like C. Treating it as C-with-classes produces unsafe, " +
            "unidiomatic code."
        },
        {
          w: "Smart pointers eliminate all memory bugs.",
          r: "`unique_ptr` and `shared_ptr` eliminate most **ownership** " +
            "bugs, but **dangling references**, iterator invalidation, and " +
            "use-after-move are still possible and common."
        },
        {
          w: "C++ is always the right choice for performance.",
          r: "The performance advantage over Java, C#, or Rust is often " +
            "negligible for typical workloads. C++ is worth its complexity " +
            "only when you need **both fine control and heavy abstraction**."
        },
        {
          w: "Newer standards make old C++ code wrong.",
          r: "C++ is **backwards-compatible**: valid C++98 code compiles " +
            "under C++23. Newer standards add features; they rarely break " +
            "existing code. The pain is in **not using** the new features, " +
            "not in them breaking old code."
        }
      ],

      trade: {
        buys: [
          "Zero-cost abstractions — use what you need, pay nothing for what you do not.",
          "Direct hardware control with high-level programming constructs.",
          "RAII makes resource management deterministic.",
          "Massive ecosystem: Unreal, Qt, LLVM, TensorFlow internals.",
          "Templates enable generic programming without runtime dispatch."
        ],
        costs: [
          "Enormous language — learning surface is vast.",
          "Compile times scale poorly with heavy template usage.",
          "Template error messages are notoriously unreadable.",
          "Still has unsafe operations — dangling references, undefined behaviour.",
          "Build systems (CMake, Bazel) add significant complexity."
        ],
        avoid: [
          "Small tools and scripts where development speed matters more.",
          "When the team lacks C++ expertise — the footgun density is high.",
          "Web applications — no mainstream web runtime.",
          "When Rust's safety guarantees outweigh C++'s ecosystem advantages."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rust",

      why: {
        before: "Systems programming meant choosing between C's speed and C's " +
          "memory bugs. Decades of buffer overflows, use-after-free, and " +
          "data races were accepted as the cost of performance.",
        problem: "Memory safety bugs account for roughly **70% of serious " +
          "security vulnerabilities** at Microsoft and Google. The humans " +
          "writing the code are not getting worse — the problem is structural.",
        shift: "**Prove memory safety at compile time.** Rust's borrow " +
          "checker enforces ownership, borrowing, and lifetime rules " +
          "statically. No garbage collector, no runtime — the same " +
          "performance model as C — but entire vulnerability classes are " +
          "eliminated by construction, not by vigilance."
      },

      num: {
        t: "Ownership rules and what each prevents",
        h: ["Rule", "What it states", "Bug it prevents"],
        r: [
          ["**Ownership**", "**every value has exactly one owner**", "**double free**"],
          ["**Move semantics**", "**assignment transfers ownership**", "**use-after-free**"],
          ["**Borrowing**", "**references do not own**", "**dangling pointer**"],
          ["**One `&mut` XOR many `&`**", "**exclusive or shared, never both**", "**data races**"],
          ["**Lifetimes**", "**references cannot outlive the data**", "**dangling references**"],
          ["No null", "`Option<T>` instead", "null pointer dereference"]
        ],
        n: "The borrow checker is Rust's defining feature and its steepest " +
          "learning curve. Code that a C programmer would write casually — " +
          "returning a reference to a local variable, aliasing a mutable " +
          "pointer — will not compile. The frustration is real and front-" +
          "loaded: you fight the compiler early but rarely fight bugs in " +
          "production. **`unsafe`** blocks exist for cases the checker " +
          "cannot verify — FFI, raw pointer manipulation, hardware access — " +
          "but they are explicitly marked, auditable, and expected to be " +
          "rare. The cultural norm is that `unsafe` code is reviewed more " +
          "carefully and encapsulated behind safe APIs. Rust's **type " +
          "system** goes further than safety: algebraic data types (`enum`), " +
          "pattern matching, traits (like interfaces with default " +
          "implementations), and a powerful macro system enable expressive " +
          "code. The **ecosystem** is younger than C++'s but growing fast: " +
          "Cargo (build + package manager) is consistently rated the best " +
          "in any language."
      },

      miss: [
        {
          w: "Rust is just C++ but safer.",
          r: "Rust has a fundamentally different ownership model, no " +
            "inheritance, algebraic data types, and a package manager built " +
            "in. The safety is not an add-on — the entire language is " +
            "designed around it."
        },
        {
          w: "The borrow checker rejects valid programs too often.",
          r: "It rejects programs it **cannot prove safe**. Some valid " +
            "patterns need restructuring — but the rejected programs include " +
            "patterns that are **valid today but would break under " +
            "maintenance**. The checker protects against future you."
        },
        {
          w: "`unsafe` defeats the whole purpose.",
          r: "`unsafe` is **scoped and auditable**. It says: 'I, the " +
            "programmer, have verified the invariant the compiler cannot " +
            "check.' The expectation is that `unsafe` blocks are small, " +
            "rare, and wrapped in safe APIs."
        },
        {
          w: "Rust is too hard for most teams.",
          r: "The learning curve is steep but **front-loaded**. Teams that " +
            "push through report fewer production bugs and lower debugging " +
            "time. The question is whether the domain justifies the upfront " +
            "investment."
        }
      ],

      trade: {
        buys: [
          "Memory safety without garbage collection — compile-time guarantees.",
          "C-level performance with high-level ergonomics.",
          "No data races in safe code — fearless concurrency.",
          "Cargo is the best build and package manager in systems programming.",
          "Algebraic types and pattern matching enable expressive, safe code."
        ],
        costs: [
          "Steep learning curve — the borrow checker demands a new mental model.",
          "Compile times are slow, especially for large projects.",
          "Ecosystem is younger — fewer libraries than C++ or Java.",
          "Some valid patterns require restructuring to satisfy the checker.",
          "Interop with C requires `unsafe` blocks."
        ],
        avoid: [
          "Quick prototyping where iteration speed matters more than safety.",
          "When the team has no Rust experience and the deadline is near.",
          "Applications where a garbage-collected language is fast enough.",
          "Scripting and automation — Python or Bash are more productive."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "go",

      why: {
        before: "Building concurrent network services meant choosing between " +
          "C++ (fast but complex), Java (safe but heavy), or Python (simple " +
          "but slow). Threading models were complex and error-prone.",
        problem: "Google needed a language for large-scale network services " +
          "that compiled fast, ran fast, and could be learned in a week by " +
          "any engineer. None of the existing languages hit all three.",
        shift: "**Simplicity as a feature.** Go intentionally omits generics " +
          "(added later, minimally), exceptions, inheritance, and operator " +
          "overloading. It compiles to native code in seconds, has " +
          "**goroutines** for lightweight concurrency, and produces a single " +
          "statically linked binary. It is the language of infrastructure: " +
          "Docker, Kubernetes, Terraform, and Prometheus are all Go."
      },

      num: {
        t: "Go's concurrency model",
        h: ["Concept", "What it is", "Key detail"],
        r: [
          ["**Goroutine**", "**lightweight green thread**", "**~4 KB stack, multiplexed onto OS threads**"],
          ["**Channel**", "**typed pipe between goroutines**", "**send and receive are blocking by default**"],
          ["select", "multiplex on channels", "like switch for channels"],
          ["**WaitGroup**", "**wait for N goroutines**", "**counter-based synchronisation**"],
          ["Mutex", "mutual exclusion lock", "sync.Mutex, sync.RWMutex"],
          ["**Context**", "**cancellation and deadlines**", "**propagated through call chains**"]
        ],
        n: "Go's goroutines are **not OS threads** — the Go runtime " +
          "multiplexes potentially millions of goroutines onto a small pool " +
          "of OS threads (M:N scheduling). This is the same idea as " +
          "Java's virtual threads, but Go had it from day one. The " +
          "idiomatic pattern is **'don't communicate by sharing memory; " +
          "share memory by communicating'** — goroutines pass messages " +
          "through channels rather than accessing shared state under locks. " +
          "In practice, most production Go code uses channels for " +
          "coordination and mutexes for shared state, because not every " +
          "problem maps to message passing. **Error handling** is Go's " +
          "most controversial design choice: functions return `(result, " +
          "error)` tuples and the caller checks explicitly. There are no " +
          "exceptions. This leads to repetitive `if err != nil { return " +
          "err }` blocks — verbose but explicit. The trade-off is " +
          "that error paths are always visible, never hidden by a catch " +
          "block three files away."
      },

      miss: [
        {
          w: "Go is too simple for real software.",
          r: "Docker, Kubernetes, Terraform, CockroachDB, and Prometheus are " +
            "all Go. Simplicity is the **point** — it reduces the set of " +
            "things that can go wrong and makes onboarding fast."
        },
        {
          w: "Goroutines are threads.",
          r: "Goroutines are **green threads** managed by Go's runtime, not " +
            "the OS. They start at ~4 KB (vs ~1 MB for OS threads) and the " +
            "runtime multiplexes millions of them onto a few OS threads."
        },
        {
          w: "Go has no error handling.",
          r: "Go has explicit error handling: functions return errors as " +
            "values. The complaint is about **syntax**, not absence — " +
            "`if err != nil` is verbose but every error path is visible."
        },
        {
          w: "Without generics Go requires lots of code duplication.",
          r: "Go 1.18 added generics. They are intentionally minimal — no " +
            "type-level programming — but they cover the common cases: " +
            "containers, sorting, map/filter/reduce."
        }
      ],

      trade: {
        buys: [
          "Compiles in seconds — fast feedback loop.",
          "Single static binary — trivial deployment.",
          "Goroutines make concurrent services natural.",
          "Small language — learnable in days.",
          "Dominant in infrastructure and cloud-native tooling."
        ],
        costs: [
          "Verbose error handling — if err != nil everywhere.",
          "No exceptions — error propagation is manual.",
          "Generics are minimal — advanced type-level programming is not possible.",
          "No sum types — cannot express 'one of these types' cleanly.",
          "GC pauses, though short, exist — not suitable for hard real-time."
        ],
        avoid: [
          "CPU-bound numerical computation — no SIMD, no manual memory layout.",
          "When rich type systems prevent bugs the team commonly makes.",
          "GUI applications — no mature GUI framework.",
          "When the problem is better expressed with algebraic data types."
        ]
      }
    }

  ]);
})(window.TD);
