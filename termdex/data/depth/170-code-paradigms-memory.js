(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "naming-conventions",
      why: {
        before: "Early programming languages severely restricted variable names to 1 or 2 cryptic characters (like `I`, `J`, `X1`, `TEMP`), forcing developers to decipher meaning from raw code context.",
        problem: "As codebases expanded to millions of lines, unstructured naming led to chaotic mixes of casing, ambiguous abbreviations, and inability to distinguish classes from functions or constants from variables.",
        shift: "Software engineering formalized Naming Conventions: agreed-upon, codified grammatical casing rules (camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE) that communicate an identifier's type, scope, and semantic role at a glance."
      },
      num: {
        t: "Industry Standard Naming Conventions & Semantic Casing Matrix",
        h: ["Naming Convention", "Casing Pattern / Delimiter", "Syntactic & Architectural Target", "Standard Language Ecosystems", "Example Canonical Identifier"],
        r: [
          ["camelCase", "Lower initial word, capitalized subsequent words", "Functions, methods, variables, object properties", "JavaScript, TypeScript, Java, Go (unexported), C#", "`calculateUserDiscount`, `retryCount`, `isActive`"],
          ["PascalCase", "All words capitalized, no delimiters", "Classes, interfaces, React components, types, enums", "TypeScript, C#, Java, Python (classes), Go (exported)", "`UserProfileCard`, `PaymentGateway`, `OrderState`"],
          ["snake_case", "All lowercase words separated by underscores", "Functions, variables, modules, database column names", "Python (PEP 8), Rust, C, Ruby, SQL schemas", "`calculate_discount`, `user_id`, `created_at`"],
          ["SCREAMING_SNAKE_CASE", "All uppercase words separated by underscores", "Global immutable constants, configuration environment keys", "Universal across virtually all programming languages", "`MAX_RETRY_COUNT`, `API_BASE_URL`, `TIMEOUT_MS`"],
          ["kebab-case", "All lowercase words separated by hyphens", "URLs, HTML/CSS class names, package names, file slugs", "Web standards, CSS/HTML, npm package names, REST APIs", "`user-profile-card`, `text-align-center`, `termdex`"]
        ],
        n: "Naming conventions serve as an immediate cognitive parsing layer for human engineers. In human reading psychology, the brain reads code ten times more often than it writes code; consistent casing standards allow the visual cortex to instantly categorize an identifier without checking its declaration. For example, in Go, casing directly determines language semantics: identifiers starting with an uppercase letter (`PascalCase`) are automatically exported (public) across packages, while identifiers starting with a lowercase letter (`camelCase`) are package-private. High-performing engineering teams enforce naming conventions automatically in CI via linters (such as ESLint's `@typescript-eslint/naming-convention` or Python's `flake8-naming`), rejecting pull requests that deviate from established architectural conventions."
      },
      miss: [
        {
          w: "Naming conventions are just subjective aesthetics that have no real impact on software engineering.",
          r: "Naming conventions establish cognitive readability and prevent bugs; in languages like Go, casing controls public vs private visibility; in React, PascalCase distinguishes custom components from native HTML elements."
        },
        {
          w: "Single-letter variable names like `x`, `y`, `temp`, `data` are fine if the function is short.",
          r: "Vague single-letter names force future readers to mentally reverse-engineer intent; except for standard coordinate pairs `(x, y)` or loop indices `i`, identifiers should explicitly reflect domain intent."
        },
        {
          w: "Adding Hungarian notation prefixes (like `strName` or `iCount`) makes modern code safer.",
          r: "Hungarian type prefixing is an obsolete 1980s practice rendered redundant by modern static type-checkers and IDE tooltips; clean code emphasizes domain semantics over raw type prefixes."
        },
        {
          w: "Booleans should be named as raw nouns like `open`, `status`, or `admin`.",
          r: "Boolean identifiers should always be prefixed with an auxiliary verb (`isOpen`, `hasPermission`, `canExecute`, `shouldRefresh`) to unambiguously signal their binary true/false nature."
        }
      ],
      trade: {
        buys: [
          "Instant cognitive classification: identify whether an identifier is a class, constant, or variable instantly from its casing.",
          "Seamless team collaboration: code written by 50 different engineers looks completely unified and familiar.",
          "Automated lint enforcement: linters automatically block casing deviations in CI before merging.",
          "Self-documenting domain model: descriptive names eliminate the need for redundant explanatory comments."
        ],
        costs: [
          "Cross-language casing friction: developers switching between Python (snake_case) and TypeScript (camelCase) experience mental friction.",
          "API boundary serialization overhead: converting between backend `snake_case` JSON and frontend `camelCase` requires mapping adapters.",
          "Refactoring rename churn: renaming a widely used identifier generates noisy git diffs across multiple files.",
          "Occasional verbosity: descriptive names (`fetchUserProfileByIdWithCache`) create longer lines of code."
        ],
        avoid: [
          "Using vague, uninformative names like `data`, `info`, `temp`, `val`, or `obj`.",
          "Mixing snake_case and camelCase arbitrarily within the same file or module.",
          "Naming boolean variables with ambiguous nouns (`user` vs `isUserActive` or `hasValidToken`).",
          "Debating naming styles in code reviews when automated linter rules can enforce them objectively."
        ]
      }
    },
    {
      slug: "magic-number",
      why: {
        before: "Developers hardcoded raw numeric literals (like `86400`, `0.0825`, `403`, `1024`) directly into algorithms and business calculations throughout their code.",
        problem: "Nobody reading the code knew what the numbers represented; changing a business rate required searching and replacing raw numbers across 50 files, risking missing an instance or accidentally altering unrelated numbers.",
        shift: "Software engineering established the prohibition against Magic Numbers: extracting raw numeric literals into well-named constants (`SECONDS_PER_DAY = 86400`, `SALES_TAX_RATE = 0.0825`), making intent explicit and centralizing updates."
      },
      num: {
        t: "Magic Numbers vs Named Constants: Diagnostic Comparison",
        h: ["Code Construct / Expression", "Code Quality Classification", "Semantic Intent & Meaning", "Blast Radius if Value Changes", "Maintainability Score"],
        r: [
          ["`if (user.role === 3)`", "Severe Magic Number Smell", "Completely opaque; what does 3 mean? Admin? Guest? Banned?", "High; modifying role IDs requires risky global search-and-replace", "Very Low; error-prone and unreadable"],
          ["`if (user.role === UserRole.ADMIN)`", "Best Practice (Named Enum)", "Crystal clear domain intent; type-safe compile-time check", "Zero; update role definition in a single central enum file", "Very High; self-documenting and safe"],
          ["`setTimeout(fn, 86400000)`", "Magic Number Smell", "Requires reader to do mental math ($1000 \\times 60 \\times 60 \\times 24$ = 1 day)", "High; difficult to verify whether it's 24 hours or 2.4 hours", "Low; error-prone timing constant"],
          ["`setTimeout(fn, ONE_DAY_IN_MS)`", "Best Practice (Named Constant)", "Instant clarity; zero mental calculation required", "Zero; update constant value cleanly if schedule changes", "Very High; clear intent"],
          ["`for (let i = 0; i < 2; i++)`", "Acceptable Literal (Not a Magic Number)", "Standard mathematical or indexing bounds (e.g. 2D coordinates `[x, y]`)", "Local; self-evident in immediate geometric context", "High; extracting constant adds needless noise"]
        ],
        n: "A Magic Number is a unique, un-named numeric (or string) literal in source code that has no obvious semantic meaning without external context. Magic numbers violate two cardinal rules of software engineering: (1) Self-Documenting Code (a reader encountering `price * 1.0825` must guess what `1.0825` represents, whereas `price * SALES_TAX_RATE` is instantly clear), and (2) The Single Source of Truth (DRY: if the tax rate changes from 8.25% to 8.5%, a developer must hunt down every instance of `1.0825`, risking accidentally replacing unrelated mathematical ratios or missing an instance in a background report). Linters (e.g. ESLint's `no-magic-numbers`) parse the AST to automatically detect and flag raw numbers, allowing exceptions only for standard mathematical literals like `0`, `1`, and `-1`."
      },
      miss: [
        {
          w: "Every single number in a program, including 0 in a loop counter, must be extracted into a named constant.",
          r: "Numbers like `0`, `1`, and `2` in standard array loops, coordinate pairs, or increment operations are self-evident and should not be extracted (e.g. creating `const ZERO = 0;` is an anti-pattern)."
        },
        {
          w: "Using a comment next to a magic number (`price * 1.0825; // tax rate`) is just as good as a named constant.",
          r: "Comments explain the number, but they do not solve the maintenance problem: when the value changes, you still have to find and edit 20 files instead of updating a single constant."
        },
        {
          w: "Extracting magic numbers into constants makes the compiled program run slower.",
          r: "Modern optimizing compilers apply Constant Folding and Constant Propagation: named constants are replaced with raw literals in machine code during compilation, with zero runtime performance cost."
        },
        {
          w: "Magic strings (like raw string status codes `'PENDING'` or `'PAID'`) are fine; only numbers are bad.",
          r: "Magic strings are equally toxic: typos in raw strings (`'PENDNG'`) bypass compiler checks, causing silent runtime failures; extract them into enums or string constants."
        }
      ],
      trade: {
        buys: [
          "Instant semantic comprehension: reveals the business rationale behind mathematical and operational constants.",
          "Single point of maintenance: update a business rate, timeout, or boundary once in a central configuration file.",
          "Elimination of typo regressions: typos in named identifiers are caught at compile time; typos in raw numbers/strings are not.",
          "Zero runtime overhead: compilers fold and inline constants directly into machine instructions at build time."
        ],
        costs: [
          "Declaration verbosity: requires declaring and exporting extra constants at the top of files or in config modules.",
          "Namespace clutter: codebases can accumulate hundreds of constant identifiers that require organized file structures.",
          "Over-extraction risk: junior developers often over-zealously extract self-evident numbers (`const TWO = 2`).",
          "File indirection: readers may occasionally have to jump to a config file to inspect the exact numeric value."
        ],
        avoid: [
          "Hardcoding raw HTTP status codes (`403`, `500`), timeouts (`30000`), or tax rates directly in business logic.",
          "Creating useless tautological constants like `const FIVE = 5` or `const ONE = 1`.",
          "Scattering identical magic strings (`'admin'`, `'pending'`) across multiple files instead of using an Enum.",
          "Disabling linter `no-magic-numbers` rules instead of extracting legitimate business constants."
        ]
      }
    },
    {
      slug: "enum",
      why: {
        before: "Developers represented a fixed set of states (like order statuses or user roles) using arbitrary integers (`1 = PENDING`, `2 = SHIPPED`) or raw strings (`'pending'`, `'shipped'`).",
        problem: "Typos in strings (`'shippd'`) slipped past compilers, causing silent bugs; and integer flags were opaque, allowing developers to accidentally assign invalid numbers (e.g. `status = 999`) with zero compiler warnings.",
        shift: "Programming languages standardized Enumerations (Enums): a distinct type consisting of a fixed, type-safe set of named values, enabling compile-time exhaustiveness checking and memory optimization."
      },
      num: {
        t: "Enum Paradigms Across Programming Languages",
        h: ["Language / Paradigm", "Underlying Machine Representation", "Type Safety & Exhaustiveness", "Data Payload Capability (Algebraic)", "Key Performance Advantage"],
        r: [
          ["TypeScript (Standard Enum)", "Bidirectional lookup object mapping key <-> value", "Compile-time type checking (ambient runtime JS object)", "Numeric or String constants only", "Easy reverse mapping, but emits bulky JS runtime code"],
          ["TypeScript (Const Enum / Union Type)", "Inlined literals (e.g. `'PENDING' | 'PAID'`)", "100% type-safe; zero runtime object emission", "Literal union types without runtime footprint", "Zero runtime overhead; optimal for modern bundlers"],
          ["Rust (`enum`)", "Tagged Union / Algebraic Data Type (discriminant byte + payload)", "Strict compile-time pattern matching exhaustiveness", "Each variant can hold distinct, complex data structs", "Memory-efficient tagged union packing; impossible invalid states"],
          ["Java (`enum`)", "Full-fledged class extending `java.lang.Enum`", "Type-safe; checked `switch` statements", "Enums can have fields, methods, and constructors", "Thread-safe singleton instances with serialization safety"],
          ["C / C++ (enum class)", "Underlying integer type (`uint8_t`, `int32_t`)", "Strongly typed in `enum class`; weak in legacy `enum`", "Integer mappings only", "Compiles to single-cycle CPU integer comparisons and jump tables"]
        ],
        n: "An enumeration defines a formal domain type that restricts a variable to one of a finite set of predefined symbolic values. In compiled systems (C++, Rust), enums are backed by a compact integer discriminant (often a single byte `uint8_t`), allowing compilers to optimize `switch` statements into $O(1)$ constant-time Jump Tables in machine code. In Rust and Swift, enums are generalized into Algebraic Data Types (Tagged Unions): an enum variant can carry arbitrary data (e.g. `enum Result<T, E> { Ok(T), Err(E) }`), where the compiler enforces Pattern Matching Exhaustiveness—guaranteeing at compile time that every possible enum variant is handled, eliminating unhandled state crashes entirely."
      },
      miss: [
        {
          w: "Standard TypeScript `enum` is always the best way to define a set of strings in modern TypeScript.",
          r: "Standard TypeScript enums emit bulky, non-standard JavaScript IIFE code; modern TypeScript engineering prefers String Literal Union Types (`type Status = 'PENDING' | 'PAID'`) or `as const` object maps for zero runtime footprint."
        },
        {
          w: "Enums are just string constants with zero type-checking benefits.",
          r: "Enums create a distinct, dedicated type; passing an arbitrary string or integer to a function expecting an enum causes a compile-time type error, preventing invalid states."
        },
        {
          w: "Enums in all languages are restricted to simple integer numbers.",
          r: "In Rust and Swift, enums are full Algebraic Data Types that can encapsulate rich, heterogeneous data structures inside individual variants."
        },
        {
          w: "Numeric enums in TypeScript prevent you from assigning numbers that are not in the enum.",
          r: "Historically in TypeScript, numeric enums permitted assigning arbitrary numbers (e.g. `const s: Status = 999;` was valid), which is why string enums or string unions are preferred."
        }
      ],
      trade: {
        buys: [
          "Type-safe finite states: restricts variables to a strict, pre-defined set of valid domain values.",
          "Compile-time exhaustiveness: compilers enforce that every possible enum case is handled in `switch` blocks.",
          "IDE discoverability: developers type `Status.` and instantly see all permissible options via auto-complete.",
          "Hardware execution efficiency: in compiled languages, enums compile to fast single-cycle integer jump tables."
        ],
        costs: [
          "Runtime code emission in TS: standard TypeScript enums generate awkward runtime JS boilerplate that resists tree-shaking.",
          "Database serialization mapping: mapping enums between database columns and application code requires translation layers.",
          "Serialization versioning friction: adding or reordering enum variants can break backwards compatibility in binary protocols.",
          "Rigidity against dynamic data: enums cannot accommodate values that are discovered dynamically at runtime."
        ],
        avoid: [
          "Using standard numeric enums in TypeScript where arbitrary numbers can be assigned (use String Enums or `as const`).",
          "Using raw, untyped strings throughout a codebase instead of an enum or union type.",
          "Omitting the exhaustive `default` check in switch statements when matching against enum variants.",
          "Storing integer enum values in databases without explicit string mappings, causing corruption if enums are reordered."
        ]
      }
    },
    {
      slug: "pass-by-value-vs-reference",
      why: {
        before: "Early programming languages used unstandardized memory models where developers had to manually manage physical memory pointers, leading to accidental caller state corruption and race conditions.",
        problem: "Developers could not predict whether calling a function would mutate their original data or operate on an isolated copy, causing subtle, unpredictable bugs across software modules.",
        shift: "Programming language theory formally defined Evaluation Strategies: strictly distinguishing between Pass-by-Value (copying data bytes) and Pass-by-Reference (passing direct memory address aliases), with modern managed languages adopting Call-by-Sharing."
      },
      num: {
        t: "Evaluation Strategies & Memory Mutation Dynamics",
        h: ["Passing Strategy", "What is Copied to Stack Frame", "Reassigning Parameter Inside Function", "Mutating Parameter Properties", "Representative Languages"],
        r: [
          ["Pass by Value", "Complete byte-for-byte copy of the actual data value", "Alters only the local stack copy; caller unaffected", "Alters only local copy; caller unaffected", "C (primitives/structs), Go, Java/JS (primitives)"],
          ["Pass by Reference", "Direct memory address alias to the caller's variable", "Reassigns the caller's original variable directly!", "Mutates caller's original memory directly!", "C++ (`int &x`), C# (`ref` / `out`), Pascal (`var`)"],
          ["Pass by Sharing (Call-by-Object)", "A copy of the memory pointer reference", "Alters only local pointer; caller variable retains original object", "Mutates the original object in heap memory!", "JavaScript, Python, Java (all objects), Ruby"],
          ["Pass by Move (Ownership)", "Transfers unique ownership; invalidates caller variable", "N/A (caller variable can no longer be accessed)", "Mutates uniquely owned memory", "Rust (default non-Copy types), C++ (`std::move`)"]
        ],
        n: "The debate over passing semantics is clouded by informal terminology. In true **Pass-by-Value**, the CPU copies the raw bytes of the argument into the callee's stack frame or register; modifications to the parameter inside the function have zero effect on the caller. In true **Pass-by-Reference** (as in C++ `void swap(int &a, int &b)`), the function receives a direct alias to the caller's variable: reassigning `a = 5` inside the function overwrites the caller's variable in the caller's own stack frame. In modern garbage-collected languages (JavaScript, Python, Java), all non-primitive objects are passed via **Call-by-Sharing** (or 'Pass-by-Value where the value is a pointer'): the 8-byte pointer address is copied by value. Therefore, mutating an object's property (`obj.x = 10`) mutates the underlying heap object shared with the caller, but reassigning the parameter variable (`obj = { x: 10 }`) merely points the local pointer at a new memory address, leaving the caller's original variable completely unchanged."
      },
      miss: [
        {
          w: "JavaScript passes objects by reference.",
          r: "JavaScript is strictly Pass-by-Value for everything; for objects, the *value that is copied* is the memory pointer reference (Call-by-Sharing); you cannot write a function in JS that reassigns a caller's external variable."
        },
        {
          w: "Passing a 100MB array to a function in Python or JavaScript creates a 100MB copy in RAM.",
          r: "Objects and arrays are passed by sharing: only an 8-byte memory pointer is copied, so passing a 100MB array takes nanoseconds and uses negligible stack memory."
        },
        {
          w: "Primitive types (numbers, booleans) can be passed by reference in JavaScript.",
          r: "Primitives in JavaScript are strictly passed by value and are completely immutable; a function can never alter the caller's primitive variable."
        },
        {
          w: "Modifying an object inside a function is safe as long as you return it at the end.",
          r: "Because objects are shared references, mutating the object inside the function modifies the caller's copy *immediately*, causing unintended side effects across any other code holding a reference to that object."
        }
      ],
      trade: {
        buys: [
          "Deterministic state isolation (Pass-by-Value): guarantees that called functions cannot corrupt caller variables.",
          "Zero-copy performance (Pass-by-Sharing/Ref): passing multi-gigabyte data structures takes nanoseconds via 8-byte pointers.",
          "Efficient in-place transformations: allows algorithms (like quicksort) to sort large arrays in-place without memory allocation.",
          "Clear semantic contracts: explicit languages (C++, Rust) require callers to explicitly state whether data is borrowed or moved."
        ],
        costs: [
          "Accidental mutation bugs: functions modifying object properties produce subtle side effects that break caller invariants.",
          "Mental confusion around sharing: junior developers struggle to understand why property mutation affects callers but reassignment does not.",
          "Concurrency data races: sharing mutable object references across multiple threads requires mutex locking or immutability.",
          "Memory cloning overhead: defensive copying (`structuredClone`) to prevent mutations consumes CPU time and heap memory."
        ],
        avoid: [
          "Mutating properties on object arguments unless the function is explicitly designed and named as an in-place mutator.",
          "Reassigning an object parameter inside a function expecting the caller to observe the reassignment.",
          "Assuming primitive arguments in JavaScript or Python can be mutated by a function (return the new value instead).",
          "Passing large structs by value in C or Go when passing a pointer (`*T`) avoids multi-kilobyte stack copies."
        ]
      }
    },
    {
      slug: "memory-leak",
      why: {
        before: "In manual memory management languages (C, C++), developers had to manually pair every `malloc()` with a corresponding `free()`; forgetting a `free()` leaked physical memory until the operating system ran out of RAM.",
        problem: "Manual leaks caused servers to crash after days of uptime; while modern automatic Garbage Collection (GC) eliminated manual `free()` bugs, it introduced a new class of subtle leaks: unintentional retaining references.",
        shift: "Software engineering formalized Memory Leak detection and remediation: identifying scenarios where unneeded memory remains anchored to the Garbage Collector's root set, preventing reclamation."
      },
      num: {
        t: "Memory Leak Archetypes & Garbage Collection Root Retention",
        h: ["Memory Leak Archetype", "Root Retention Mechanism", "Memory Accumulation Rate", "Diagnostic Tooling", "Primary Engineering Cure"],
        r: [
          ["Uncleaned Event Listeners", "DOM node or EventEmitter retains strong closure reference", "Linear with user interactions (1 listener per click/route)", "Chrome DevTools Heap Snapshot comparison", "Explicitly remove listeners (`removeEventListener`, `AbortSignal`) in cleanup"],
          ["Unbounded Caches / Maps", "Global `Map` or static collection appends keys forever without eviction", "Linear with system throughput (leaks every transaction)", "Memory profilers (heap allocation timelines)", "Use LRU (Least Recently Used) cache with fixed max capacity, or `WeakMap`"],
          ["Forgotten Timers / Intervals", "`setInterval()` holds reference to callback and captured scope variables", "Continuous background memory pinning", "Chrome DevTools Profiler, node `--inspect`", "Clear intervals in teardown (`clearInterval(timerId)`)"],
          ["Detached DOM Nodes", "JavaScript variable retains reference to a DOM node deleted from document tree", "Proportional to UI navigation and modal rendering", "Chrome DevTools Heap Snapshot (filter: 'Detached')", "Nullify local references after removing nodes from DOM"],
          ["Closure Scope Retention", "Small inner closure unintentionally captures a massive outer variable in its scope", "Pins entire outer lexical scope in heap RAM", "V8 heap snapshot closure retainers tree", "Isolate closures; extract functions outside scope to break retention"]
        ],
        n: "In modern memory-managed runtimes (V8, JVM, Python), memory is managed automatically via Tracing Garbage Collection (such as Mark-and-Sweep or Generational Scavenging). The garbage collector determines whether an object is alive by tracing reference pointers starting from the 'Root Set' (active call stack frames, global variables, and DOM roots). A memory leak in a garbage-collected language is **not** a lost pointer; it is an **Unintentional Reference**: an object that is no longer needed by application logic, but remains transitively reachable from a GC root. Because the GC can trace a path from a global variable or active event listener to the object, it is mathematically forbidden from reclaiming that memory. Over time, accumulated leaks exhaust available heap memory, causing progressive performance degradation due to continuous Full GC pauses, culminating in an Out-Of-Memory (`OOMKilled`) crash."
      },
      miss: [
        {
          w: "Languages with automatic Garbage Collection (like JavaScript, Python, Java) cannot have memory leaks.",
          r: "Garbage collectors only reclaim memory that has *zero reachable references*; if an unused object is anchored to a global variable, cache, or lingering event listener, the GC can never free it, causing a severe memory leak."
        },
        {
          w: "Circular references between two objects in JavaScript prevent them from ever being garbage collected.",
          r: "Modern engines use Mark-and-Sweep tracing, not reference counting; if two objects reference each other in a circle but are disconnected from the root set, the GC cleans them up easily."
        },
        {
          w: "Setting a variable to `null` (`x = null`) immediately forces the Garbage Collector to run and free RAM.",
          r: "Setting a variable to null merely removes that single reference pointer; the garbage collector runs autonomously on its own internal heuristics and memory pressure schedule."
        },
        {
          w: "Using `WeakMap` or `WeakSet` completely eliminates the need to think about memory management.",
          r: "`WeakMap` only allows objects as keys and prevents keys from leaking; the values inside the WeakMap are still strongly held as long as the key object is alive elsewhere in memory."
        }
      ],
      trade: {
        buys: [
          "Process longevity and stability: prevents long-running servers and Single Page Applications (SPAs) from crashing due to OOM.",
          "Consistent latency: eliminates severe latency spikes caused by the garbage collector thrashing during full GC sweeps.",
          "Cloud infrastructure cost savings: prevents servers from requiring oversized RAM allocations to survive memory leaks.",
          "Smooth user experience: prevents browser tabs from slowing down and lagging during multi-hour user sessions."
        ],
        costs: [
          "Diagnostic complexity: diagnosing subtle heap retention paths requires specialized heap snapshot profiling expertise.",
          "Cleanup discipline overhead: requires diligent implementation of lifecycle teardown methods (`useEffect`, `dispose()`).",
          "Weak reference ergonomics: using `WeakRef` or `WeakMap` introduces API complexity compared to standard collections.",
          "Defensive architecture overhead: implementing bounded LRU eviction algorithms adds code complexity over plain objects."
        ],
        avoid: [
          "Attaching event listeners to `window` or `document` inside components without removing them on component unmount.",
          "Using unbounded global objects or maps as caches without implementing an eviction strategy (LRU / TTL).",
          "Leaving `setInterval()` running in background workers or components after their lifecycle has ended.",
          "Retaining references to detached DOM elements in global JavaScript variables or singleton arrays."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
