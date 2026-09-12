/* ==========================================================================
   Depth pass 113 — Computer Science Fundamentals batch 5: Interfaces, Functional Paradigms & Compilers.
   Interface, Functional Programming, Pure Function, Side Effect,
   Immutability, Higher-Order Function, Compiler.

   Itable interface dispatch, Church-Rosser lambda reductions, referential transparency,
   and AST intermediate representation (IR) pipelines establish language architecture.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "interface",

      why: {
        before: "Modules were tightly bound to concrete class implementations, making it impossible to swap database drivers, mock external services for testing, or write polymorphic code without inheriting unwanted base state.",
        problem: "Software architectures need a pure behavioral contract that specifies exactly what methods an entity must provide without dictating how they are implemented or requiring any shared memory inheritance.",
        shift: "**Interface: A shared boundary across which two or more separate components of a computer system exchange information, or a contract in programming that defines method signatures without implementation.** Serving as the ultimate decoupling mechanism in statically typed languages, interfaces enforce the Dependency Inversion Principle."
      },

      num: {
        t: "Interface Dispatch Mechanisms: Nominal vs Structural vs Traits",
        h: ["Paradigm", "Language Implementation", "Type Checking Timing", "Dispatch Mechanism", "Memory Representation", "Coupling Level"],
        r: [
          ["Nominal Interfaces", "Java, C#, Kotlin", "Compile-time (explicit `implements`)", "Interface Method Table (`itable`)", "Object header points to class metadata containing itables", "Moderate (requires upfront declaration)"],
          ["Structural Interfaces (Duck)", "Go, TypeScript", "Compile-time (Go/TS) or Runtime (Python)", "Go `iface` fat pointer: `(tab, data)`", "Pair of pointers: type metadata pointer + data pointer", "Zero (implicitly satisfied by matching signatures)"],
          ["Traits / Typeclasses", "Rust (`trait`), Haskell", "Compile-time (monomorphization or `dyn`)", "Static monomorphization or `dyn Trait` fat pointer", "Zero cost (static) or 16-byte fat pointer (dynamic)", "Decoupled (can implement traits for external types)"],
          ["Abstract Base Class (ABC)", "C++ (pure virtual `= 0`), Python", "Compile-time (C++) / Runtime (Python)", "Standard vtable pointer (`vptr`)", "Single pointer in object memory layout", "Tightly coupled via class inheritance"],
          ["Protocol / Dynamic Duck", "Objective-C, Swift, Python `typing.Protocol`", "Compile-time (Swift) or dynamic `respondsToSelector`", "Witness Table (Swift) or dynamic lookup", "Existential container (3 words buffer + witness table)", "Decoupled"]
        ],
        n: "An interface defines a **pure contract of behavior**: a set of method signatures and return types with zero state (no instance fields). In nominal type systems (Java), classes must explicitly declare `implements MyInterface`. At the JVM level, because a class can implement multiple interfaces, methods cannot reside at fixed indices in a single vtable; the JVM uses an **Interface Method Table (itable)** or inline caches, executing `invokeinterface` by searching the itable for the corresponding method offset. In Go, interfaces are **structural**: a type satisfies an interface automatically simply by implementing its methods, with zero import dependency on the interface package. In memory, a Go interface value is represented as a 16-byte **fat pointer** (`iface`): `struct iface { itab* tab; void* data; }`, storing a pointer to the type/interface dispatch metadata and a pointer to the underlying concrete data payload."
      },

      miss: [
        {
          w: "An interface and an abstract class are basically the same thing.",
          r: "An **interface** is a pure behavioral contract that cannot maintain instance state (no member variables) and supports multiple inheritance/implementation in virtually all languages. An **abstract class** can hold concrete instance state, fields, constructors, and default implementations, and is constrained by single class inheritance in languages like Java, C#, and Kotlin."
        },
        {
          w: "In Go, you must explicitly declare that a struct implements an interface.",
          r: "Go uses **structural typing**. If a `struct` implements all the methods defined by an `interface`, it satisfies that interface **implicitly and automatically** without any `implements` keyword. This enables consumers to define minimal, specialized interfaces in their own packages to consume third-party types."
        },
        {
          w: "Adding a new method to a public interface is a non-breaking change.",
          r: "Adding a method to a published interface is a **severe breaking change** for all third-party consumers who have implemented that interface, as their concrete classes will fail to compile. Languages added **default interface methods** (Java 8+) specifically to mitigate this issue."
        },
        {
          w: "Interfaces add massive runtime overhead that slows down execution.",
          r: "In languages like Rust and C++, implementing traits or interfaces with generics uses **monomorphization** (static dispatch), resolving calls to direct jumps at compile time with **zero runtime cost**. Even dynamic dispatch (`dyn Trait`, `invokeinterface`) costs only a couple of nanoseconds via modern inline caches."
        }
      ],

      trade: {
        buys: [
          "Enforces Dependency Inversion: high-level business modules depend on stable abstractions rather than volatile low-level details.",
          "Seamless mock testing: permits substituting production databases, payment gateways, and networks with mock test stubs.",
          "Multiple behavioral inheritance: allows a single class to satisfy multiple orthogonal contracts (`Serializable`, `Comparable`).",
          "Promotes Interface Segregation: client code is only exposed to the minimal specific methods it actually needs."
        ],
        costs: [
          "Indirection navigation: IDEs jump to interface definitions rather than concrete code, requiring extra cognitive steps to trace logic.",
          "Dynamic dispatch penalty: dynamic interface dispatch (`invokeinterface`, fat pointers) prevents compiler function inlining.",
          "Evolution rigidity: modifying or adding methods to existing interfaces breaks all existing implementers.",
          "Boilerplate explosion: over-interfacing every single internal class with 1:1 interfaces (`IUserService` / `UserService`) clutters codebases."
        ],
        avoid: [
          "Never create an interface with a single concrete implementation unless required for unit testing or dependency injection.",
          "Do not design 'fat' interfaces with dozens of methods; break them down into focused, single-purpose interfaces (Interface Segregation).",
          "Avoid using empty marker interfaces without methods; use metadata annotations or language attributes instead.",
          "Never leak implementation-specific types or exceptions through generic interface method signatures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "functional-programming",

      why: {
        before: "Software relied entirely on imperative loops and shared mutable global state, leading to catastrophic race conditions in multi-threaded environments and bugs where functions silently altered remote state.",
        problem: "Concurrent, distributed, and safety-critical software requires a paradigm that treats computation as the mathematical evaluation of pure functions, eliminating shared mutable state and non-deterministic timing bugs.",
        shift: "**Functional Programming (FP): A programming paradigm where programs are constructed by applying and composing functions, treating computation as the evaluation of mathematical functions and avoiding changing-state and mutable data.** Grounded in Alonzo Church's Lambda Calculus (1930s), FP prioritizes immutability, referential transparency, and first-class functions."
      },

      num: {
        t: "Functional Programming vs Imperative / OOP Paradigms",
        h: ["Dimension", "Functional Programming (FP)", "Imperative / Traditional OOP", "Mathematical Foundation", "Core Operational Benefit"],
        r: [
          ["State Treatment", "Immutable data; transformations produce new values", "Mutable state updated in-place", "Mathematical functions: $f: X \\to Y$", "Trivial parallel execution with zero data races"],
          ["Primary Building Block", "Pure Functions & Expressions", "Objects, Procedures, and Statements", "Lambda Calculus ($\\alpha, \\beta, \\eta$ conversions)", "High modularity via mathematical composition"],
          ["Flow of Control", "Function composition, recursion, pattern matching", "Loops (`for`, `while`), conditionals, GOTO", "Category theory (Monoids, Functors, Monads)", "Declarative clarity: expresses *what*, not *how*"],
          ["Side Effects", "Isolated at boundaries or managed via Monads (IO)", "Permitted freely anywhere in any method", "Referential transparency ($f(x) \\equiv \\text{value}$)", "Deterministic, repeatable testing without mocks"],
          ["Memory Management", "Heavy allocation of persistent immutable structures", "In-place memory mutation", "Garbage collection / Structural Sharing", "Thread safety at the cost of allocation GC pressure"]
        ],
        n: "Functional programming is rooted in **Lambda Calculus** ($\\lambda$-calculus), a formal mathematical system for expressing computation through variable binding and substitution. Under the **Church-Rosser Theorem**, any valid sequence of $\\beta$-reductions on a confluent lambda expression yields the same unique normal form regardless of evaluation order, guaranteeing that pure functional expressions can be evaluated in parallel across CPU cores without synchronization locks. The foundational properties of FP include: (1) **First-Class and Higher-Order Functions** (functions can be passed as arguments, returned, and assigned), (2) **Immutability** (data cannot be altered after instantiation), (3) **Referential Transparency** (an expression can be replaced with its evaluated value without changing program behavior), and (4) **Declarative Pipelines** (`map`, `filter`, `reduce`)."
      },

      miss: [
        {
          w: "Functional programming means you can never perform I/O, database writes, or print to the screen.",
          r: "Software that performs zero I/O is useless. Functional programming does not ban side effects; it **isolates and controls them**. In pure languages like Haskell, side effects are explicitly modeled and contained within algebraic types like the **IO Monad**, keeping the core business logic completely pure and referentially transparent."
        },
        {
          w: "Immutability means copying the entire massive dataset in memory on every change.",
          r: "Functional programming engines use **Persistent Data Structures with Structural Sharing** (Okasaki, 1998). Modifying a collection (like a Clojure or Immutable.js vector) does NOT copy the entire array; it creates a new root node in a 32-way branching Trie, reusing and sharing $99.9\\%$ of the existing node pointers in $\\mathcal{O}(\\log_{32} N) \\approx \\mathcal{O}(1)$ time."
        },
        {
          w: "Functional programming is only for niche academic languages like Haskell and Lisp.",
          r: "Core FP principles dominate modern mainstream software: JavaScript/TypeScript (`Array.map`, `filter`, Redux, React hooks), Python (list comprehensions, lambdas), Java (Streams API, records), Rust (iterators, pattern matching), and distributed big data (Apache Spark RDDs)."
        },
        {
          w: "Recursion in functional programming always blows out the call stack.",
          r: "Functional compilers and modern runtimes implement **Tail-Call Optimization (TCO)**. When a recursive call is in the tail position (the final operation of the function), the compiler reuses the current stack frame, compiling the recursion down into a tight, flat machine loop with strictly **$\\mathcal{O}(1)$ stack space**."
        }
      ],

      trade: {
        buys: [
          "Zero race conditions: immutable data structures can be shared across unlimited CPU threads without mutexes or deadlocks.",
          "Referential transparency: allows caching (memoisation), dead-code elimination, and safe compiler reordering of expressions.",
          "High testability: pure functions require zero mocking, dependency injection containers, or complex environment setups.",
          "Time-travel debugging: immutable state architectures (Redux, Event Sourcing) enable recording, rewinding, and replaying state."
        ],
        costs: [
          "Garbage collection pressure: creating new immutable values instead of mutating in-place increases allocation rates and GC pauses.",
          "Steep cognitive learning curve: concepts like Monads, Functors, Currying, and Higher-Kinded Types have high conceptual friction.",
          "Structural sharing overhead: persistent trees have higher constant-factor access overhead compared to flat contiguous C arrays.",
          "Stack overflow risk: languages lacking Tail-Call Optimization (like standard Python or Java) crash on deep recursive calls."
        ],
        avoid: [
          "Never use deep recursion in languages that do not guarantee Tail-Call Optimization (Python, Java); convert to iterative loops.",
          "Do not mutate global state inside functions passed to `map`, `filter`, or concurrency thread pools.",
          "Avoid deep structural sharing in high-frequency trading loops where single-nanosecond cache line latency is critical.",
          "Never convert an entire codebase to extreme esoteric Category Theory abstractions without team-wide buy-in and alignment."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pure-function",

      why: {
        before: "Functions secretly read or modified global variables, system clocks, hardware registers, and remote databases, making it impossible to predict the output of a function or test it without setting up an entire operating environment.",
        problem: "Software architectures require deterministic computational units whose behavior depends exclusively on their declared input arguments, guaranteeing consistent behavior and zero unintended side effects.",
        shift: "**Pure Function: A function that has two fundamental properties: (1) Its return value is identical for identical arguments (deterministic), and (2) Its evaluation causes no side effects (no mutation of external state or I/O).** Forming the mathematical core of functional programming, pure functions establish referential transparency."
      },

      num: {
        t: "Pure vs Impure Functions: Behavioral & Operational Comparison",
        h: ["Property / Feature", "Pure Function", "Impure Function", "Compiler / Runtime Implication", "Engineering Consequence"],
        r: [
          ["Determinism", "Strict: $f(x)$ always returns same $y$", "Non-deterministic: can vary per call", "Pure functions can be evaluated at compile time", "Trivial unit testing with fixed asserts"],
          ["External State Dependency", "Zero; depends solely on parameters", "Reads global variables, DB, time, env", "Impure functions require environment setup", "Impure tests require complex mocks and stubs"],
          ["Mutation of State", "Zero; never mutates arguments or external state", "Mutates arguments, files, DOM, sockets", "Pure functions can be safely executed concurrently", "Zero lock contention or race conditions in parallel code"],
          ["Memoisation Eligibility", "100% safe to cache results", "Dangerous / Impossible (cache invalidation)", "Compilers can replace call with cached value", "Massive speedup on expensive calculations"],
          ["Compiler Optimization", "Common Subexpression Elimination (CSE)", "Must preserve call to maintain side effects", "Compilers can vectorize and eliminate dead calls", "Maximum performance optimization by LLVM"]
        ],
        n: "A pure function is a direct implementation of a mathematical function $f: A \\to B$, mapping each domain element $a \\in A$ to an exact codomain element $b \\in B$. Formally, a function satisfies **Referential Transparency** if any expression containing the function call can be replaced with its evaluated result without changing the observable behavior of the program. For example, `add(2, 3)` can be safely replaced by `5` everywhere in code. In contrast, `Date.now()`, `Math.random()`, or `readFile()` are inherently impure because calling them at different times or on different machines yields different results. In modern web architectures (React), UI components are modeled as pure functions of state: $\\text{UI} = f(\\text{state})$, guaranteeing that rendering the same state always produces the exact same DOM tree."
      },

      miss: [
        {
          w: "A function is pure as long as it doesn't print to the console or call an API.",
          r: "Printing and API calls are only two forms of impurity. A function is also impure if it **reads a global variable**, accesses `Date.now()`, generates a random number, reads from a database, or **mutates any object passed to it as an argument**."
        },
        {
          w: "A pure function can never allocate local variables or mutate memory internally.",
          r: "A function can mutate **local variables** allocated entirely within its own internal stack frame (e.g., a local `for` loop accumulating a sum into a local variable `let total = 0`), as long as that mutation is strictly contained and has zero observable effect outside the function boundary."
        },
        {
          w: "Pure functions make programs slower because they cannot mutate arrays in-place.",
          r: "While in-place mutations avoid allocations, pure functions enable transformative global optimizations: compilers can eliminate duplicate calls (**Common Subexpression Elimination**), run pure calls across all CPU cores simultaneously without locks, and memoise expensive computations."
        },
        {
          w: "All code in an enterprise application should be 100% pure functions.",
          r: "A program composed exclusively of pure functions can do nothing except heat up the CPU, because writing to disk, displaying pixels, and sending network packets are all side effects. Practical architectures use the **Functional Core, Imperative Shell** pattern: pure functions handle business logic, while an outer shell orchestrates I/O."
        }
      ],

      trade: {
        buys: [
          "Referential transparency: guarantees mathematical equivalence between the function call and its returned value.",
          "Effortless testability: unit tests require only input arguments and expected outputs without mock frameworks.",
          "Thread-safety by default: can be invoked concurrently across thousands of threads with zero synchronization locks.",
          "Safe caching and memoisation: results can be stored in RAM caches indefinitely with zero risk of stale external mutation."
        ],
        costs: [
          "Defensive copying overhead: producing new return structures instead of mutating in-place can increase memory allocations.",
          "Parameter explosion: must explicitly pass all dependencies and state as parameters rather than reading ambient global context.",
          "I/O separation discipline: forces architectures to decouple calculation logic from database reads and network calls.",
          "Language impedance: languages with default mutable semantics (JS, Python) require discipline to prevent accidental mutation."
        ],
        avoid: [
          "Never mutate an object or array passed into a function as an argument; return a new modified copy instead.",
          "Do not call `Date.now()` or `Math.random()` inside business calculations; pass timestamps and seeds as explicit arguments.",
          "Avoid mixing database queries and business calculations in the same function; query data first, then pass to a pure function.",
          "Never assume a function is pure if it depends on a mutable singleton or global configuration object."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "side-effect",

      why: {
        before: "Developers assumed calling a function only computed a return value, while underneath, the function silently altered shared global variables, wrote to the filesystem, or mutated caller memory, triggering bizarre non-reproducible bugs.",
        problem: "Software systems need a precise classification for any operation that modifies state outside its local execution environment or interacts with the physical external world, allowing engineers to isolate volatility.",
        shift: "**Side Effect: Any change in system state or observable interaction with the outside world that occurs during the execution of a function beyond returning a value.** Encompassing memory mutation, I/O operations, network transmission, and exception throwing, managing side effects is the central challenge of reliable software engineering."
      },

      num: {
        t: "Side Effect Spectrum: Classification, Observability & Mitigation",
        h: ["Side Effect Category", "Concrete Operations", "State Boundary Impact", "Testing Strategy", "Architectural Mitigation"],
        r: [
          ["I/O Operations", "File read/write, DB query, console log, network socket", "Interacts with external OS/network environment", "Mocking / Contract testing", "Hexagonal architecture / Ports & Adapters"],
          ["Shared Memory Mutation", "Mutating global variables, modifying passed objects", "Alters heap memory visible to other threads/callers", "Requires state reset before each test", "Immutability / Defensive copying"],
          ["System Clock / Hardware", "Reading `Date.now()`, CPU cycle counters, `/dev/urandom`", "Introduces non-deterministic external physical input", "Clock injection / Mock providers", "Pass timestamp/seed as explicit argument"],
          ["Process Control / Exceptions", "Throwing exceptions, calling `exit()`, aborting process", "Interrupts normal execution call stack flow", "Error boundary verification", "Result/Either monadic error types (`Result<T, E>`)"],
          ["DOM / UI Manipulation", "Directly mutating web page HTML DOM nodes", "Alters browser rendering state", "End-to-End browser automation", "Virtual DOM diffing / Declarative UI frameworks"]
        ],
        n: "In computer science, a function $f$ has a side effect if it modifies some state variable outside its local execution context, or if it has an observable interaction with the calling functions or the outside world. In mathematical terms, a function is a pure mapping $f: X \\to Y$. If a function additionally alters external state $S$, it is effectively a state transition function $f: X \\times S \\to Y \\times S$. When side effects are hidden, code becomes **temporally coupled**: calling `foo()` before `bar()` works, but calling `bar()` before `foo()` crashes because `foo()` sets an invisible global state variable. Clean architectural paradigms—such as **Command-Query Separation (CQS)** (Bertrand Meyer, 1988) and **Functional Core, Imperative Shell**—strictly separate methods that return values (Queries, side-effect free) from methods that change state (Commands, containing side effects)."
      },

      miss: [
        {
          w: "Side effects are bugs and should be completely eliminated from software.",
          r: "Without side effects, a computer program is completely useless! Saving a user profile, rendering graphics to a monitor, sending an email, and updating a database are ALL side effects. Software engineering does not aim to eliminate side effects, but to **isolate, control, and sequence them explicitly**."
        },
        {
          w: "Logging to a file or terminal does not count as a side effect.",
          r: "Logging is an **observable I/O side effect**. Writing to a log file can block execution on disk I/O, throw an Out-Of-Disk-Space exception, trigger buffer flushes, and alter thread timing, occasionally masking or creating race conditions (Heisenbugs)."
        },
        {
          w: "Throwing an exception is not a side effect because it's part of normal error handling.",
          r: "Throwing an exception is a **major side effect**: it bypasses normal control flow, unwinds the execution call stack, and can cause memory leaks or unreleased locks if not cleanly caught. Modern languages (Rust, Go) prefer explicit `Result<T, E>` return values over exceptions."
        },
        {
          w: "Calling a getter method is always guaranteed to be free of side effects.",
          r: "Badly engineered getters frequently contain hidden side effects: lazy-loading database queries, initializing caches, updating access counters, or triggering network calls, surprising callers who expect cheap, idempotent reads."
        }
      ],

      trade: {
        buys: [
          "Real-world utility: enables software to interact with users, persist data, transfer money, and communicate across networks.",
          "State persistence: allows systems to maintain durable state across system reboots and hardware failures.",
          "Performance optimization: in-place cache updates and buffer mutations can achieve higher hardware throughput than immutable copies.",
          "Real-time reactivity: triggers external alerts, hardware sensor actuations, and user interface notifications."
        ],
        costs: [
          "Destroys referential transparency: prevents compilers from caching results, reordering calls, or eliminating dead code.",
          "Concurrency bugs: uncoordinated side effects on shared memory produce race conditions, deadlocks, and corrupted state.",
          "Testing complexity: testing code with side effects requires spinning up databases, mock servers, and cleanup fixtures.",
          "Temporal coupling: functions must be called in a strict, fragile chronological sequence to avoid runtime crashes."
        ],
        avoid: [
          "Never perform hidden side effects inside getters, properties, or `toString()`/`equals()` methods.",
          "Do not interleave side effects (database writes) with business rule validation; validate first, then execute effects.",
          "Avoid sharing mutable references across thread boundaries; use message-passing or thread-safe channels.",
          "Never execute uncoordinated network or disk side effects inside retry loops without ensuring idempotency."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "immutability",

      why: {
        before: "Variables and objects were freely mutable by any thread or function holding a reference, leading to catastrophic race conditions, memory corruption, and bugs where an object was modified without the caller's knowledge.",
        problem: "Concurrent and distributed systems require guaranteed data stability so that once an object is created, its state can never be modified, eliminating the need for defensive copying and synchronization locks.",
        shift: "**Immutability: An architectural property of an object or data structure whose state cannot be modified after it is created.** Enforced through language keywords (`const`, `final`, `readonly`) or persistent structural-sharing data structures, immutability enables safe concurrent data sharing and simplifies state reasoning."
      },

      num: {
        t: "Immutability Enforcements: Languages, Keywords & Structural Mechanics",
        h: ["Language", "Immutability Keyword", "Enforcement Level", "Collection Immutability", "Structural Sharing Support"],
        r: [
          ["Rust", "Immutable by default (`let` vs `let mut`)", "Strict compile-time borrow checker", "Enforced across all structures", "Compile-time move/borrow semantics"],
          ["Java", "`final` (variables/classes)", "Shallow reference immutability only", "Unmodifiable views (`List.of()`)", "Java Records (shallow immutability)"],
          ["JavaScript / TS", "`const` / `readonly`", "Shallow reference (`Object.freeze()` shallow)", "Third-party libraries (`Immutable.js`)", "Immer.js (Copy-on-write proxy mechanism)"],
          ["Clojure", "Universal default", "Deep structural runtime enforcement", "Persistent Hash Array Mapped Tries (HAMT)", "Native 32-way branching persistent trees"],
          ["Python", "`tuple`, `frozenset`", "Immutable primitives/containers", "No deep immutability for arbitrary classes", "Third-party (`pyrsistent`)"],
          ["C++", "`const` / `constexpr`", "Compile-time const-correctness", "`std::span` const views", "Value semantics with move optimization"]
        ],
        n: "Immutability fundamentally alters how computer memory is manipulated. When state cannot be mutated in-place, updating an entity creates a **new version** rather than overwriting existing bytes. In naive implementations, copying a 100,000-element collection on every change would require $\\mathcal{O}(N)$ time and memory. Modern functional runtimes solve this via **Persistent Data Structures with Structural Sharing** (Phil Bagwell's Hash Array Mapped Trie - HAMT): a collection is represented as a tree of small nodes (e.g., 32 elements per node). Modifying an element creates only a new path from the root down to the changed leaf node ($\\mathcal{O}(\\log_{32} N)$ nodes allocated), while the rest of the tree's nodes are shared directly with the old version, achieving near $\\mathcal{O}(1)$ performance while retaining complete version history."
      },

      miss: [
        {
          w: "Declaring `const x = [1, 2, 3]` in JavaScript makes the array completely immutable.",
          r: "`const` in JavaScript only makes the **variable assignment binding** immutable (you cannot reassign `x = ...`). The underlying array itself remains **completely mutable**: calling `x.push(4)` or `x[0] = 99` mutates the array in-place without error. True immutability requires `Object.freeze()` or persistent libraries."
        },
        {
          w: "Immutability is too slow and wastes too much memory for high-performance software.",
          r: "In multi-core systems, immutability often **improves overall performance**. Immutable data requires **zero synchronization locks**, eliminating thread contention, cache coherence invalidation bus traffic, and context switches. Structural sharing makes mutations fast, and lock-free parallelism scales linearly across cores."
        },
        {
          w: "Java's `final` keyword guarantees that an object's fields cannot change.",
          r: "`final` only guarantees that the reference cannot be reassigned to a new object. If the `final` field points to a mutable object (like an `ArrayList`), the contents of that list can still be freely modified by any thread."
        },
        {
          w: "Immutability prevents garbage collection from working efficiently.",
          r: "Modern Generational Garbage Collectors (HotSpot G1/ZGC, V8) are specifically optimized for functional programming patterns: short-lived immutable allocations in the Young Generation are collected in sub-millisecond minor collections with near-zero overhead."
        }
      ],

      trade: {
        buys: [
          "Zero lock contention: multiple threads can read, traverse, and iterate over immutable data concurrently without mutexes.",
          "Predictable state reasoning: eliminates bugs where an object is modified unexpectedly by a distant downstream function.",
          "Effortless time-travel & undo: preserves historical states automatically, powering Redux DevTools and database MVCC.",
          "Safe dictionary keys: immutable objects maintain permanent hash codes, preventing hash map corruption."
        ],
        costs: [
          "Memory allocation churn: creating new versions produces higher heap allocation volumes, increasing garbage collector workload.",
          "Access latency overhead: traversing persistent HAMT trees has higher constant factor latency than indexing a contiguous flat C array.",
          "Language impedance: requires defensive copying or wrapper libraries in languages built primarily for mutable objects.",
          "Steeper design curve: algorithms must be refactored from in-place procedural loops to recursive or structural transformations."
        ],
        avoid: [
          "Never assume `const` in JavaScript or `final` in Java creates deep immutability; use frozen structures or records.",
          "Do not perform naive deep copies (`JSON.parse(JSON.stringify(x))`) to achieve immutability; use structural sharing libraries.",
          "Avoid using persistent immutable collections in tight, raw DSP/audio processing loops where contiguous SIMD memory is required.",
          "Never pass a mutable collection to another thread without wrapping it in an unmodifiable view or creating an immutable copy."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "higher-order-function",

      why: {
        before: "Algorithms operating on collections (filtering, transforming, accumulating) required writing separate, repetitive `for` loops with manual index counters for every single operation, mixing traversal logic with business logic.",
        problem: "Software needs a mechanism to treat functions as first-class citizens that can be passed as arguments and returned from other functions, allowing algorithms to abstract away control flow and reuse generic patterns.",
        shift: "**Higher-Order Function (HOF): A function that does at least one of the following: (1) Takes one or more functions as arguments, or (2) Returns a function as its result.** Canonicalized by `map`, `filter`, and `reduce`, HOFs transform computation into composable, declarative pipelines."
      },

      num: {
        t: "Canonical Higher-Order Functions: Contracts, Algebra & Complexity",
        h: ["HOF Primitive", "Mathematical Signature", "Operational Purpose", "Time Complexity", "Canonical Imperative Equivalent"],
        r: [
          ["`map`", "$(A \\to B) \\to [A] \\to [B]$", "Transforms every element via function $f$", "$\\mathcal{O}(N)$", "Loop applying $f(x)$ and appending to new array"],
          ["`filter`", "$(A \\to \\text{Bool}) \\to [A] \\to [A]$", "Extracts elements satisfying predicate $p$", "$\\mathcal{O}(N)$", "Loop with `if (p(x))` appending matching items"],
          ["`reduce` / `fold`", "$(B \\times A \\to B) \\to B \\to [A] \\to B$", "Accumulates elements into a single aggregate value", "$\\mathcal{O}(N)$", "Loop accumulating state into a single accumulator variable"],
          ["`compose`", "$(B \\to C) \\to (A \\to B) \\to (A \\to C)$", "Chains two functions: $(f \\circ g)(x) = f(g(x))$", "$\\mathcal{O}(1)$ setup", "Calling $f(g(x))$ sequentially"],
          ["`curry`", "$(A \\times B \\to C) \\to (A \\to (B \\to C))$", "Translates multi-arg function into unary chain", "$\\mathcal{O}(1)$ closure", "Nested functions returning closures"]
        ],
        n: "Higher-Order Functions require **First-Class Functions**: the runtime must treat functions as values with types, allowing them to be assigned to variables, stored in data structures, passed as parameters, and returned from other functions. When a function returns another function that references variables from its enclosing lexical scope, the runtime creates a **Closure**: an allocated data structure on the heap bundling the function's code pointer with a reference environment holding the captured variables. The canonical triumvirate—**`map`**, **`filter`**, and **`reduce`**—forms a complete computational basis: in category theory, `map` operates over **Functors**, while `reduce` (catamorphism) can express ANY linear list processing operation (including re-implementing `map` and `filter` purely through `reduce`)."
      },

      miss: [
        {
          w: "Higher-Order Functions and First-Class Functions are identical terms.",
          r: "**First-Class Functions** is a **language feature** (the language allows functions to be treated as regular values). A **Higher-Order Function** is a **mathematical property of a specific function** (it accepts a function as an argument or returns one). A language must have first-class functions to support higher-order functions."
        },
        {
          w: "Chaining `map().filter().map()` is always efficient because it looks clean.",
          r: "In naive runtimes (like standard JavaScript arrays), chaining `.map().filter().map()` creates **multiple intermediate arrays in memory**, traversing the dataset three separate times and thrashing garbage collection. Modern languages use **Lazy Streams / Iterators** or **Transducers** to fuse the pipeline into a single pass with zero intermediate allocations."
        },
        {
          w: "Arrow functions and closures don't allocate any memory if they aren't called.",
          r: "Defining a closure allocates a heap object to capture the referenced environment variables. Creating thousands of closures inside hot loops without invocation still strains the memory allocator."
        },
        {
          w: "Higher-Order Functions cannot be used in low-level languages like C.",
          r: "C supports higher-order functions through **function pointers** (e.g., the standard library `qsort()` takes a comparison function pointer `int (*cmp)(const void*, const void*)`). However, C lacks native closures with captured lexical environments."
        }
      ],

      trade: {
        buys: [
          "Declarative code clarity: replaces verbose, error-prone manual loop indexing with expressive intent-driven pipelines.",
          "Separation of concerns: cleanly separates the mechanics of collection iteration from the business logic applied to elements.",
          "Composability: enables building complex data pipelines by chaining small, single-purpose mathematical functions.",
          "Parallelization readiness: declarative operations like `map` and `filter` can be mapped directly to GPU cores or Spark clusters."
        ],
        costs: [
          "Function call overhead: invoking a callback function on every element adds call stack and indirection overhead in un-optimized engines.",
          "Intermediate array allocations: un-fused array chaining creates temporary collections, driving up garbage collector pressure.",
          "Debugging complexity: stack traces through multiple layers of anonymous closures and higher-order wrappers are harder to read.",
          "Closure memory retention: closures that accidentally capture large parent scopes can cause memory leaks."
        ],
        avoid: [
          "Never chain multiple array operations (`.map().filter()`) on massive datasets without using lazy iterators or streams.",
          "Do not perform heavy, blocking I/O operations inside synchronous higher-order callbacks like `Array.prototype.forEach`.",
          "Avoid creating closures inside hot, tight performance loops; define the callback function once outside the loop.",
          "Never use `reduce()` for simple operations where a built-in `sum()` or a readable standard `for` loop is clearer to the team."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "compiler",

      why: {
        before: "Programmers wrote machine code in raw hexadecimal instructions or assembly language for specific CPU hardware, meaning software had to be completely rewritten for every new computer architecture and was unreadable to humans.",
        problem: "Software needs to be written in high-level, human-readable, architecture-independent languages, requiring an automated system that translates high-level source code into mathematically correct, hyper-optimized machine instructions.",
        shift: "**Compiler: A computer program that translates computer code written in one programming language (the source language) into another language (the target language, usually machine code or bytecode).** Organized into a multi-stage pipeline—Lexing, Parsing, Semantic Analysis, Intermediate Representation (IR), Optimization, and Code Generation—compilers form the bedrock of computing infrastructure."
      },

      num: {
        t: "Compiler Pipeline Architecture: Stages, Data Formats & Transformations",
        h: ["Compiler Stage", "Input Data Structure", "Output Data Structure", "Primary Theoretical Tool", "Core Optimizations / Checks"],
        r: [
          ["1. Lexical Analysis (Lexer)", "Raw source characters (ASCII/UTF-8)", "Token Stream", "Regular Expressions / DFAs", "Strips whitespace, comments; validates basic tokens"],
          ["2. Syntax Analysis (Parser)", "Token Stream", "Abstract Syntax Tree (AST)", "Context-Free Grammars (LL/LR/LALR)", "Verifies grammatical syntax; reports syntax errors"],
          ["3. Semantic Analysis", "Abstract Syntax Tree (AST)", "Decorated AST / Symbol Table", "Type Systems / Attribute Grammars", "Type checking, scope verification, variable resolution"],
          ["4. Intermediate Representation (IR)", "Decorated AST", "Target-agnostic IR (e.g., SSA form)", "Three-Address Code (TAC)", "Translates language-specific syntax into canonical math"],
          ["5. Middle-End Optimization", "Static Single Assignment (SSA) IR", "Optimized SSA IR", "Dataflow Analysis / Graph Coloring", "Constant folding, dead code elimination, loop unrolling"],
          ["6. Code Generation (Backend)", "Optimized IR", "Machine Code (ELF / Mach-O / PE)", "Instruction Scheduling / Register Allocation", "Chaitin's graph coloring for CPU register assignment"]
        ],
        n: "Modern optimizing compilers (e.g., **LLVM**, **GCC**) decouple frontends from backends through a unified **Intermediate Representation (IR)**. The frontend parses source code into an **Abstract Syntax Tree (AST)**, performs semantic type-checking, and lowers it into **Static Single Assignment (SSA)** form—an IR where every variable is assigned exactly once, making dataflow dependencies explicit Directed Acyclic Graphs (DAGs). The middle-end optimization engine runs hundreds of optimization passes over the SSA IR: **Dead Code Elimination (DCE)**, **Common Subexpression Elimination (CSE)**, **Loop Invariant Code Motion (LICM)**, and **Function Inlining**. The backend then performs **Instruction Selection**, **Register Allocation** (mapping infinite IR virtual registers to physical CPU registers via NP-complete graph coloring heuristics), and instruction scheduling for specific target hardware (x86-64, ARM64, RISC-V)."
      },

      miss: [
        {
          w: "A compiler translates code line-by-line while the program runs.",
          r: "That describes an **interpreter**. A **compiler** analyzes the **entire program upfront** before execution, performing global semantic analysis and multi-pass optimization to generate a standalone executable binary or bytecode file."
        },
        {
          w: "Compilers can optimize any bad algorithm into a fast program.",
          r: "A compiler cannot fix fundamental algorithmic asymptotic complexity. A compiler can vectorize loops and inline functions, but it can NEVER turn an $\\mathcal{O}(N^2)$ BubbleSort into an $\\mathcal{O}(N \\log N)$ QuickSort. Algorithmic efficiency remains the sole responsibility of the software engineer."
        },
        {
          w: "A Just-In-Time (JIT) compiler is the exact same thing as an interpreter.",
          r: "An interpreter executes bytecode sequentially via an evaluation loop. A **JIT compiler** monitors running code, identifies 'hot' execution paths, and **compiles that bytecode directly into native machine code in RAM during runtime**, executing subsequent calls at native hardware speed."
        },
        {
          w: "Compilers always output machine code for physical CPUs.",
          r: "Many compilers output **bytecode** for virtual machines (Java `javac` compiles to JVM bytecode; C# compiles to CIL), or output other high-level programming languages (transpilers like TypeScript compiling to JavaScript, or Babel)."
        }
      ],

      trade: {
        buys: [
          "Maximum runtime performance: pre-compiles and optimizes code to execute at bare-metal hardware speeds without runtime interpretation overhead.",
          "Early bug detection: catches syntax errors, type mismatches, and unresolved symbols at compile time before production release.",
          "Hardware architecture portability: LLVM/GCC frontends compile once to IR, which can target dozens of CPU architectures (x86, ARM, WebAssembly).",
          "Aggressive global optimizations: inlines functions, unrolls loops, vectorizes SIMD instructions, and eliminates dead code."
        ],
        costs: [
          "Build time latency: compiling large C++ or Rust codebases with heavy optimizations can take minutes or hours.",
          "Loss of dynamic runtime flexibility: statically compiled binaries cannot easily evaluate dynamic code strings or modify types at runtime.",
          "Complex debugging: aggressive compiler optimizations reorder instructions and inline functions, making debug stack tracing challenging.",
          "Platform-specific binary artifacts: native compilation requires producing separate binaries for every target OS and CPU architecture."
        ],
        avoid: [
          "Never disable compiler optimizations (`-O2` / `-O3` / `--release`) when benchmarking or deploying production systems.",
          "Do not ignore compiler warnings; treat warnings as errors (`-Werror`) to catch subtle undefined behavior early.",
          "Avoid excessive template or macro metaprogramming that explodes compiler memory usage and compilation times.",
          "Never assume undefined behavior will be ignored by optimizing compilers; modern compilers aggressively exploit UB to delete entire blocks of code."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
