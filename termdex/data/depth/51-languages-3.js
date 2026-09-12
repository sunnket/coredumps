/* ==========================================================================
   Depth pass 51 — programming languages batch 3: the paradigm terms.

   Languages are vehicles for paradigms. Understanding static vs dynamic
   typing, compiled vs interpreted, and type inference tells you more about
   how to think in a language than knowing its syntax.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "compiled-language",

      why: {
        before: "Programs were always compiled — source code went through a " +
          "compiler and came out as machine code the CPU ran directly.",
        problem: "Compilation produces fast executables but introduces a " +
          "build step. Change one line, wait for the compiler, then test. " +
          "For large codebases, that cycle can take minutes.",
        shift: "**Trade build time for runtime speed.** Compiled languages " +
          "(C, C++, Rust, Go) produce native binaries that start instantly " +
          "and run at full hardware speed. The compilation step catches " +
          "errors before runtime and enables optimisations an interpreter " +
          "cannot perform — dead code elimination, inlining, register " +
          "allocation — because the compiler sees the whole program."
      },

      num: {
        t: "Compilation stages and what each does",
        h: ["Stage", "Input → Output", "Key optimisation"],
        r: [
          ["**Preprocessing**", "**source → expanded source**", "**macro expansion, includes**"],
          ["Lexing / Parsing", "text → AST", "syntax validation"],
          ["**Semantic analysis**", "**AST → typed AST**", "**type checking, scope resolution**"],
          ["**IR generation**", "**AST → intermediate representation**", "**platform-independent optimisations**"],
          ["Optimisation", "IR → optimised IR", "inlining, loop unrolling, DCE"],
          ["**Code generation**", "**IR → machine code**", "**register allocation, instruction selection**"]
        ],
        n: "Modern compilers rarely go straight from source to machine code. " +
          "They lower through **intermediate representations** — LLVM IR " +
          "is the most famous — where optimisations are applied " +
          "platform-independently. This is why Clang (C/C++), Rust, Swift, " +
          "and Zig all produce competitive code: they share LLVM's " +
          "optimisation passes. The distinction between compiled and " +
          "interpreted is **blurring**: Java compiles to bytecode, then " +
          "JIT-compiles to native; JavaScript's V8 JIT-compiles hot " +
          "functions; Python 3.13 has an experimental JIT. The meaningful " +
          "question is not 'is it compiled?' but 'when is it compiled, and " +
          "how much does the compiler know at that point?'"
      },

      miss: [
        {
          w: "Compiled means faster in all cases.",
          r: "A JIT compiler can optimise based on **runtime profiling** — " +
            "inlining virtual calls it knows are monomorphic. An AOT " +
            "compiler cannot. In steady-state, JIT-compiled Java sometimes " +
            "beats AOT-compiled C++ for specific workloads."
        },
        {
          w: "Compilation catches all bugs.",
          r: "It catches **type and syntax errors**. Logic bugs, race " +
            "conditions, and runtime failures (file not found, network " +
            "timeout) are invisible to the compiler."
        },
        {
          w: "Languages are either compiled or interpreted.",
          r: "Most modern runtimes use **both**. Java compiles to bytecode, " +
            "then JIT-compiles. Python compiles to bytecode (.pyc), then " +
            "interprets. The boundary is a spectrum."
        },
        {
          w: "Compilation is a single step.",
          r: "It is a **pipeline** of stages — lexing, parsing, type " +
            "checking, IR generation, optimisation, code generation, " +
            "linking — each with its own error surface."
        }
      ],

      trade: {
        buys: [
          "Peak runtime performance — no interpreter overhead.",
          "Errors caught at compile time, before deployment.",
          "Whole-program optimisations the runtime cannot do.",
          "Predictable performance — no JIT warm-up.",
          "Self-contained binary — no runtime installation needed."
        ],
        costs: [
          "Build step adds latency to the development cycle.",
          "Cross-compilation required for different targets.",
          "Slower iteration than interpreted languages.",
          "Compiler complexity limits language design flexibility.",
          "Debug builds may behave differently from optimised builds."
        ],
        avoid: [
          "Rapid prototyping where iteration speed matters most.",
          "When the runtime's JIT compiler is fast enough for the workload.",
          "Scripting and automation tasks.",
          "When deployment targets change frequently and cross-compilation is painful."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "interpreted-language",

      why: {
        before: "Computers ran machine code. Every program required " +
          "compilation before execution — no compilation, no execution.",
        problem: "Compilation is a barrier to experimentation. You cannot " +
          "type a line of code and see what it does without a build step. " +
          "For scripting, exploration, and teaching, the barrier is too high.",
        shift: "**Execute source code directly, line by line.** An " +
          "interpreter reads source, parses it, and executes it without " +
          "producing a standalone binary. Python, Ruby, and Perl work " +
          "this way — you write a script and run it immediately."
      },

      num: {
        t: "Interpretation strategies",
        h: ["Strategy", "How it works", "Speed"],
        r: [
          ["**Tree-walking**", "**execute the AST directly**", "**slowest**"],
          ["**Bytecode**", "**compile to bytecode, then interpret**", "**faster — less overhead per instruction**"],
          ["JIT", "compile hot bytecode to native at runtime", "near-native for hot paths"],
          ["**REPL**", "**read-eval-print loop**", "**interactive — immediate feedback**"],
          ["Tracing JIT", "record a trace, compile it", "fast for loops"]
        ],
        n: "Almost no modern 'interpreted' language is purely interpreted. " +
          "Python compiles to bytecode (`.pyc` files), then the CPython VM " +
          "interprets that bytecode. Ruby, PHP, and Lua do the same. The " +
          "**REPL** (Read-Eval-Print Loop) is the defining experience of " +
          "interpreted languages: type an expression, see the result " +
          "instantly. This makes them ideal for **exploratory programming** " +
          "— data analysis, API testing, teaching. The performance cost " +
          "is real but often irrelevant: most scripts spend their time " +
          "waiting for I/O, network, or calling into compiled libraries. " +
          "The practical distinction today is not 'interpreted vs compiled' " +
          "but **'does it have a compilation step the developer waits for?'**"
      },

      miss: [
        {
          w: "Interpreted languages are always slow.",
          r: "They are slow **at CPU-bound loops**. For I/O-bound workloads " +
            "(web servers, scripts, glue code) the interpreter is not the " +
            "bottleneck — the network is."
        },
        {
          w: "Interpretation means no compilation at all.",
          r: "CPython compiles to bytecode. V8 JIT-compiles to machine code. " +
            "The user experience is 'no explicit build step', but " +
            "compilation happens internally."
        },
        {
          w: "You cannot build production systems in interpreted languages.",
          r: "Instagram runs on Python, Shopify on Ruby, Wikipedia on PHP. " +
            "The bottleneck in most production systems is I/O and " +
            "architecture, not language speed."
        },
        {
          w: "Interpreted languages have no type checking.",
          r: "Some are dynamically typed, but that is orthogonal. Dart is " +
            "interpreted (via JIT) with sound static types. TypeScript is " +
            "statically typed but compiles to interpreted JavaScript."
        }
      ],

      trade: {
        buys: [
          "No build step — write and run immediately.",
          "REPL enables interactive exploration.",
          "Easier to learn — immediate feedback on every expression.",
          "Platform-independent source code — the interpreter handles portability.",
          "Dynamic features (eval, reflection) are natural."
        ],
        costs: [
          "Slower than compiled code for CPU-bound tasks.",
          "Runtime errors that a compiler would have caught.",
          "Interpreter must be installed on the target machine.",
          "Less predictable performance — GC, JIT warm-up.",
          "Source code is deployed — no binary protection."
        ],
        avoid: [
          "Latency-critical systems where microseconds matter.",
          "Embedded systems with limited memory and no interpreter.",
          "When static type safety is a project requirement.",
          "CPU-intensive computation that cannot be delegated to native libraries."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "static-typing",

      why: {
        before: "Variables could hold any value at any time. A function " +
          "returning a number today might return a string tomorrow, and " +
          "no tool would warn you.",
        problem: "In large codebases, this flexibility becomes a liability. " +
          "Renaming a field, changing a return type, or removing a method " +
          "requires finding every caller manually — and missing one " +
          "produces a runtime crash that could have been a compile error.",
        shift: "**Declare types, check them before running.** Static type " +
          "systems catch entire bug classes at compile time: wrong argument " +
          "types, missing fields, impossible assignments. The compiler " +
          "becomes a verification tool that runs faster than any test suite."
      },

      num: {
        t: "What static typing catches vs what it does not",
        h: ["Catches", "Does not catch", "Why"],
        r: [
          ["**Type mismatch**", "**logic errors**", "**types describe shapes, not intent**"],
          ["Missing fields", "off-by-one errors", "indexing is runtime behaviour"],
          ["**Null safety (some)**", "**race conditions**", "**concurrency is dynamic**"],
          ["Unreachable code", "performance bugs", "speed is an execution property"],
          ["**API contract violations**", "**business rule violations**", "**types express structure, not policy**"]
        ],
        n: "Static type systems exist on a **spectrum of expressiveness**. " +
          "Go has a simple, structural type system with no generics until " +
          "recently. Haskell has a rich type system with type classes, " +
          "higher-kinded types, and GADTs that can encode invariants most " +
          "languages cannot express. Rust's type system encodes ownership " +
          "and lifetime information. TypeScript's is structural and " +
          "Turing-complete. The key trade-off is always the same: **more " +
          "expressive types catch more bugs but impose more complexity on " +
          "the programmer**. The pragmatic position is to use types to " +
          "encode the invariants you actually get wrong — nullability, " +
          "shape mismatches, API contracts — and not to chase type-level " +
          "encoding of every business rule."
      },

      miss: [
        {
          w: "Static typing prevents all bugs.",
          r: "It prevents **type errors**. Logic bugs, race conditions, " +
            "performance problems, and incorrect requirements are invisible " +
            "to the type checker."
        },
        {
          w: "Static typing is verbose.",
          r: "Modern type inference (Rust, Kotlin, TypeScript, Haskell) lets " +
            "you write far fewer type annotations. The compiler infers " +
            "types from context — you annotate only where needed."
        },
        {
          w: "Static and dynamic typing are binary choices.",
          r: "**Gradual typing** (Python with mypy, TypeScript over JS) " +
            "lets you add types incrementally. The boundary is a spectrum."
        },
        {
          w: "If it compiles, it works.",
          r: "Compilation checks **type soundness**, not **correctness**. A " +
            "program can be perfectly well-typed and produce wrong answers."
        }
      ],

      trade: {
        buys: [
          "Catches type mismatches, missing fields, and null errors at compile time.",
          "IDE autocompletion and refactoring are reliable.",
          "Types serve as documentation that the compiler verifies.",
          "Refactoring is safe — the compiler finds all affected callsites.",
          "Performance — the compiler can optimise when types are known."
        ],
        costs: [
          "Type annotations add verbosity (mitigated by inference).",
          "Learning curve for advanced type features.",
          "Slower iteration — must satisfy the type checker before running.",
          "Some valid dynamic patterns are hard to express in types.",
          "Compile-time overhead."
        ],
        avoid: [
          "Quick throwaway scripts — the overhead is not worth it.",
          "When rapid prototyping and the team is faster in a dynamic language.",
          "When the program is small enough that one person can hold it in their head."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dynamic-typing",

      why: {
        before: "Every variable had a declared type, checked by the compiler " +
          "before running. Writing code meant writing types.",
        problem: "For scripting, data exploration, and rapid prototyping, " +
          "declaring types slows you down more than it helps. You want to " +
          "try something and see what happens, not declare every shape.",
        shift: "**Types are checked at runtime, not compile time.** A " +
          "variable holds whatever you put in it. Functions accept whatever " +
          "they receive and fail at runtime if the operation does not make " +
          "sense. Iteration speed goes up; safety guarantees go down."
      },

      num: {
        t: "Dynamic typing trade-offs",
        h: ["Benefit", "Risk", "Mitigation"],
        r: [
          ["**Fast iteration**", "**type errors at runtime**", "**gradual typing (mypy, TypeScript)**"],
          ["No compile step", "refactoring breaks silently", "comprehensive test suites"],
          ["**Duck typing**", "**wrong object passed undetected**", "**protocol/structural types**"],
          ["Flexible APIs", "API contracts are implicit", "documentation, linters"],
          ["**Metaprogramming**", "**hard-to-trace code**", "**discipline and conventions**"]
        ],
        n: "Dynamic typing's actual benefit is **speed of experimentation**, " +
          "not brevity — modern static languages with inference are equally " +
          "concise. The cost appears at scale: a function that used to " +
          "receive a `User` now receives a dict, and the only way to find " +
          "all callers is to run the program or grep. **Gradual typing** " +
          "(Python + mypy, JavaScript + TypeScript) is the industry's " +
          "answer: start dynamic, add types where they help, and get " +
          "compiler-like feedback without rewriting. The key insight is " +
          "that dynamic typing is a choice about **when** you discover " +
          "errors — in development (via tests) rather than at compile time " +
          "(via types). If your test suite does not cover a code path, " +
          "the error waits for production."
      },

      miss: [
        {
          w: "Dynamic typing means no types.",
          r: "Values **always have types** at runtime. Dynamic typing means " +
            "the **variable** is untyped — it can hold any value. The check " +
            "happens when you use the value, not when you declare it."
        },
        {
          w: "Dynamic languages cannot be used for large systems.",
          r: "Instagram (Python), Shopify (Ruby), Wikipedia (PHP) are large " +
            "production systems. They mitigate with tests, linters, and " +
            "increasingly with gradual type systems."
        },
        {
          w: "Type annotations in Python make it statically typed.",
          r: "Python's type hints are **ignored by the runtime**. They are " +
            "checked by external tools (mypy, Pyright) — useful, but not " +
            "the same as static typing."
        },
        {
          w: "Duck typing is the same as no typing.",
          r: "Duck typing says 'if it walks and quacks like a duck, it is a " +
            "duck.' It checks capabilities at runtime, which is still a " +
            "type system — just a deferred one."
        }
      ],

      trade: {
        buys: [
          "Fastest iteration speed — no build step, no type annotations needed.",
          "REPL-friendly — ideal for exploration and prototyping.",
          "Flexible APIs that accept diverse input shapes.",
          "Metaprogramming and monkey-patching are natural.",
          "Lower barrier to entry for beginners."
        ],
        costs: [
          "Type errors surface at runtime, not compile time.",
          "Refactoring is risky — no compiler to find all callsites.",
          "IDE support is weaker — autocompletion is best-effort.",
          "Tests must compensate for the lack of compiler verification.",
          "Performance — runtime type checks add overhead."
        ],
        avoid: [
          "Large codebases with many contributors — the maintenance cost dominates.",
          "When correctness is critical and types can encode the invariants.",
          "Long-lived production systems where refactoring safety matters.",
          "When the team regularly makes type errors the compiler would catch."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "type-inference",

      why: {
        before: "Static typing meant writing types everywhere: " +
          "`HashMap<String, List<Integer>> map = new HashMap<String, " +
          "List<Integer>>();` — the type appears three times in one line.",
        problem: "Excessive type annotations make statically typed code " +
          "verbose. Developers avoid static languages because they feel " +
          "like they are writing types more than logic.",
        shift: "**Let the compiler figure out the types.** Type inference " +
          "deduces types from context — `let x = 5` is obviously an " +
          "integer, and the compiler knows it without an annotation. You " +
          "get the safety of static typing with the conciseness of " +
          "dynamic typing."
      },

      num: {
        t: "Inference strategies",
        h: ["Strategy", "How it works", "Used by"],
        r: [
          ["**Local inference**", "**infer from the right-hand side**", "**Go, Kotlin, C++ (auto), C# (var)**"],
          ["**Hindley-Milner**", "**whole-function inference via unification**", "**Haskell, OCaml, ML family**"],
          ["Bidirectional", "propagate types both ways", "TypeScript, Rust (partially)"],
          ["**Flow typing**", "**narrow types after checks**", "**Kotlin (smart casts), TypeScript**"],
          ["Return type inference", "infer function return from body", "Rust, Kotlin"]
        ],
        n: "**Hindley-Milner** inference is the gold standard: given no type " +
          "annotations at all, it infers the most general type for every " +
          "expression. Haskell programs routinely have zero type " +
          "annotations and are fully type-checked. Most mainstream " +
          "languages use **local inference** — simpler, less powerful, but " +
          "sufficient for `var x = 5`. **Flow typing** (also called smart " +
          "casts or narrowing) is the inference that happens after a type " +
          "check: `if (x is String) { x.length }` — inside the branch, " +
          "`x` is narrowed to `String`. This is how TypeScript, Kotlin, " +
          "and Rust handle union types and optionals without explicit " +
          "casting. The pragmatic advice is: **annotate function " +
          "signatures** (they are documentation for callers) and **let " +
          "inference handle local variables** (the type is obvious from " +
          "context)."
      },

      miss: [
        {
          w: "Type inference means you never write types.",
          r: "Good practice is to annotate **function signatures** and let " +
            "inference handle locals. Omitting all annotations makes code " +
            "harder to read and can produce confusing error messages."
        },
        {
          w: "var and let make the language dynamically typed.",
          r: "The type is **inferred at compile time** and fixed. `var x = 5` " +
            "makes `x` an integer — assigning a string to it later is a " +
            "compile error. This is still static typing."
        },
        {
          w: "All type inference is the same.",
          r: "Local inference (Go) is trivial. Hindley-Milner (Haskell) can " +
            "infer types for entire programs. The power and complexity " +
            "differ enormously."
        },
        {
          w: "Inference makes error messages clearer.",
          r: "It can make them **worse** — when the compiler infers wrong " +
            "and the error appears far from the cause. Explicit annotations " +
            "at function boundaries anchor the error."
        }
      ],

      trade: {
        buys: [
          "Static type safety without verbose annotations.",
          "Code reads like a dynamic language but has compile-time checks.",
          "Encourages using specific types — no cost to being precise.",
          "Refactoring remains safe — the compiler still verifies everything.",
          "Reduces boilerplate without reducing safety."
        ],
        costs: [
          "Error messages can be confusing when inference goes wrong.",
          "Implicit types make code harder to read without IDE support.",
          "Over-reliance on inference can obscure intended types.",
          "Different inference strategies have different limitations.",
          "Build times may increase with complex inference."
        ],
        avoid: [
          "When explicit types serve as essential documentation (public APIs).",
          "When the inference algorithm produces confusing errors for the team.",
          "Teaching — beginners benefit from seeing types explicitly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
    {
      slug: "transpiler",

      why: {
        before: "Languages compiled to machine code or bytecode. Source code " +
          "in one language produced an executable — never source code in " +
          "another language.",
        problem: "New languages cannot run in environments locked to an " +
          "existing language — browsers only run JavaScript, the JVM only " +
          "runs bytecode. And language features arrive faster than runtimes " +
          "adopt them.",
        shift: "**Compile source-to-source.** A transpiler transforms source " +
          "code from one language (or language version) into another. " +
          "TypeScript → JavaScript, Babel (modern JS → older JS), CoffeeScript " +
          "→ JavaScript, Kotlin → JavaScript. The output is source code " +
          "that the target platform already knows how to run."
      },

      num: {
        t: "Major transpilation use cases",
        h: ["Transpiler", "Source → Target", "Purpose"],
        r: [
          ["**TypeScript (tsc)**", "**TS → JS**", "**add types to JavaScript**"],
          ["**Babel**", "**modern JS → ES5**", "**browser compatibility**"],
          ["SWC", "TS/JS → JS", "Rust-based, 20–70× faster than Babel"],
          ["**esbuild**", "**TS/JS → JS**", "**Go-based, extremely fast bundling**"],
          ["CoffeeScript", "CS → JS", "syntactic sugar (historical)"],
          ["**Cython**", "**Python-subset → C**", "**performance-critical Python code**"]
        ],
        n: "The most important transpiler in the industry is the TypeScript " +
          "compiler (**tsc**), which erases types and emits JavaScript. " +
          "**Source maps** are what make transpilation usable in practice: " +
          "they map the generated code back to the original source, so " +
          "debuggers show TypeScript while the browser runs JavaScript. " +
          "Without source maps, debugging transpiled code is a nightmare. " +
          "The trend is toward **faster transpilers written in compiled " +
          "languages**: SWC (Rust), esbuild (Go), and oxc (Rust) are " +
          "replacing Babel (JavaScript) because build speed is a developer " +
          "experience metric. Transpilation is not limited to JavaScript: " +
          "Cython transpiles a Python subset to C for performance, and " +
          "many DSLs transpile to SQL, Python, or other host languages."
      },

      miss: [
        {
          w: "Transpilation is the same as compilation.",
          r: "Compilation typically produces **lower-level output** (machine " +
            "code, bytecode). Transpilation produces **same-level source " +
            "code** in another language. The distinction is fuzzy but " +
            "useful: transpiled output is human-readable."
        },
        {
          w: "Source maps are optional.",
          r: "Without source maps, debugging shows generated code that " +
            "does not match what you wrote. In practice, source maps are " +
            "**mandatory** for any transpiled production code."
        },
        {
          w: "Transpilers add runtime overhead.",
          r: "Transpilers run at **build time**, not runtime. The generated " +
            "code runs exactly as the target language would. There is no " +
            "runtime cost (though the generated code may be less optimal " +
            "than hand-written)."
        },
        {
          w: "You should always transpile to the oldest target.",
          r: "Transpiling to ES5 produces **larger, slower code**. Target " +
            "the oldest browser you actually support — usually ES2020+ for " +
            "modern applications. Over-transpilation wastes bytes."
        }
      ],

      trade: {
        buys: [
          "Use modern language features on older runtimes.",
          "Add type systems to dynamically typed platforms.",
          "Prototype new language ideas without building a runtime.",
          "Source maps maintain debugging experience.",
          "Incremental adoption — transpile file by file."
        ],
        costs: [
          "Build step adds toolchain complexity.",
          "Source maps must be maintained and shipped.",
          "Generated code may differ subtly from hand-written.",
          "Build tool configuration can be complex (Babel plugins, tsconfig).",
          "Debugging generated code without source maps is painful."
        ],
        avoid: [
          "When the target runtime already supports all features you need.",
          "When build toolchain complexity is unacceptable.",
          "When the transpilation output is too large or too slow.",
          "When source maps cannot be shipped (some embedded contexts)."
        ]
      }
    }

  ]);
})(window.TD);
