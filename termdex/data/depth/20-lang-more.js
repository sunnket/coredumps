/* ==========================================================================
   Depth pass 20 — more languages, and the specific bet each one made.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "scala",

      why: {
        before: "The JVM had Java: enormous ecosystem, mature tooling, and a " +
          "language that in 2004 had no generics, no closures, no type " +
          "inference and enormous boilerplate.",
        problem: "Rewriting the JVM ecosystem in a better language was " +
          "impossible; abandoning the JVM meant abandoning every library, tool " +
          "and deployment story an enterprise depended on.",
        shift: "**Keep the platform, replace the language.** Martin Odersky — " +
          "who had written Java's own generics — built a language that " +
          "compiles to JVM bytecode, calls Java freely, and fuses " +
          "object-oriented with functional programming. You get algebraic data " +
          "types, pattern matching, immutability and a powerful type system " +
          "while still using every Java library."
      },

      num: {
        t: "What Scala brought to the JVM",
        h: ["Feature", "Java (2004)", "Scala"],
        r: [
          ["Type inference", "none", "**extensive**"],
          ["Pattern matching", "none", "**exhaustiveness-checked**"],
          ["Immutability", "by convention", "default"],
          ["Higher-kinded types", "no", "**yes**"],
          ["Implicits / givens", "no", "yes — powerful, contentious"],
          ["Boilerplate", "high", "much lower"]
        ],
        n: "**Spark is written in Scala**, and that single fact drove much of " +
          "its adoption — the language's collection API maps naturally onto " +
          "distributed dataset operations. The recurring criticism is real " +
          "though: Scala permits **many dialects**. One team writes " +
          "Java-with-better-syntax, another writes pure functional code with " +
          "Cats and ZIO and higher-kinded abstractions, and the two are barely " +
          "the same language. That flexibility plus historically slow " +
          "compilation and painful **binary incompatibility between minor " +
          "versions** is why Kotlin took much of the pragmatic JVM ground, " +
          "and why Scala 3 focused on simplification."
      },

      miss: [
        {
          w: "Scala is a functional language.",
          r: "It is **both**, deliberately. You can write imperative " +
            "Java-shaped code with `var` and mutable collections, or " +
            "referentially transparent functional code. Neither is *the* Scala " +
            "way, which is exactly what makes team conventions essential."
        },
        {
          w: "Implicits are Scala's biggest mistake.",
          r: "They are the mechanism behind type classes, context passing and " +
            "much of the ecosystem's expressiveness — and they were overloaded " +
            "to do too many unrelated jobs, which made code hard to follow. " +
            "**Scala 3 split them** into `given`/`using`, extension methods and " +
            "conversions, addressing the confusion rather than the concept."
        },
        {
          w: "Scala is slow.",
          r: "It compiles to JVM bytecode with performance comparable to Java. " +
            "**Compilation** is slow, which is a genuine developer-experience " +
            "problem and a different claim from runtime speed. Certain " +
            "abstractions do allocate more, but the baseline is JVM " +
            "performance."
        },
        {
          w: "You should use Scala anywhere you would use Java.",
          r: "For straightforward services, **Kotlin** gives most of the " +
            "ergonomic gain with far less complexity and faster compilation. " +
            "Scala earns its cost where the type system genuinely pays — data " +
            "processing, complex domain modelling, library design."
        }
      ],

      trade: {
        buys: [
          "Full JVM ecosystem access with a far more expressive language.",
          "A powerful type system catching real errors at compile time.",
          "Pattern matching with exhaustiveness checking.",
          "Excellent for data processing — Spark, Kafka Streams.",
          "Strong support for both paradigms."
        ],
        costs: [
          "Steep learning curve, especially the functional ecosystem.",
          "Slow compilation.",
          "Historically painful binary compatibility across versions.",
          "Many dialects — codebases can diverge sharply in style.",
          "Smaller hiring pool than Java or Kotlin."
        ],
        avoid: [
          "The team wants a modest improvement on Java — use **Kotlin**.",
          "Fast compile-test cycles are critical.",
          "You cannot enforce a consistent style; Scala punishes " +
            "inconsistency.",
          "The project is simple CRUD where the type system buys nothing.",
          "Hiring is a hard constraint."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "julia",

      why: {
        before: "Scientific computing lived with the **two-language problem**: " +
          "prototype in Python, MATLAB or R for productivity, then rewrite the " +
          "slow parts in C or Fortran for speed.",
        problem: "That rewrite is expensive, error-prone, and creates a " +
          "permanent divide — the scientists cannot maintain the fast code and " +
          "the engineers do not understand the science. Every change crosses " +
          "the boundary twice.",
        shift: "Make one language fast enough that no rewrite is needed. The " +
          "mechanism is **JIT compilation plus multiple dispatch**: functions " +
          "are compiled to specialised machine code **for the concrete types " +
          "they are called with**, so generic-looking code compiles to " +
          "type-specialised native code — C-like speed from high-level source."
      },

      num: {
        t: "Multiple dispatch — the defining feature",
        h: ["Paradigm", "Dispatch on", "Adding a new type"],
        r: [
          ["Procedural (C)", "nothing", "edit every function"],
          ["OOP single dispatch", "**one** argument (self)", "subclass, but binary ops are awkward"],
          ["**Julia multiple dispatch**", "**all** argument types", "define methods, no source access needed"]
        ],
        n: "Multiple dispatch is why Julia's ecosystem **composes** unusually " +
          "well: define a new number type — a unit-carrying quantity, a dual " +
          "number for automatic differentiation — and every generic library " +
          "function works on it without those libraries knowing it exists. " +
          "That is genuinely hard to achieve elsewhere. The costs are equally " +
          "characteristic: **time to first plot** — the JIT compiles on first " +
          "call, so startup and initial execution are slow, which Julia 1.9's " +
          "native code caching substantially improved but did not eliminate. " +
          "And **type instability** is the classic performance trap: if the " +
          "compiler cannot infer a concrete type, it falls back to dynamic " +
          "dispatch and the code runs orders of magnitude slower with no error."
      },

      miss: [
        {
          w: "Julia is fast because it is compiled.",
          r: "It is fast when the compiler can **infer concrete types**. " +
            "Type-unstable code — a variable that might be `Int` or `Float64` — " +
            "falls back to boxed dynamic dispatch and can be 10–100× slower. " +
            "`@code_warntype` exists to find this, and finding it is a normal " +
            "part of Julia performance work."
        },
        {
          w: "Multiple dispatch is just method overloading.",
          r: "Overloading is resolved at **compile time from static types**; " +
            "multiple dispatch is resolved at **run time from actual types**. " +
            "That difference is what lets a package extend another package's " +
            "functions for its own types without modifying either."
        },
        {
          w: "Julia can replace Python for machine learning.",
          r: "It has genuine strengths — Flux, differential equations, " +
            "scientific ML — and the ecosystem is far smaller. PyTorch, " +
            "TensorFlow and the entire deployment stack are Python. Julia is " +
            "strongest in **scientific and numerical computing**, which is what " +
            "it was designed for."
        },
        {
          w: "The startup time problem has been solved.",
          r: "Julia 1.9's package precompilation to native code helped " +
            "enormously and did not eliminate it. Latency remains a real cost " +
            "for short scripts, command-line tools and serverless functions, " +
            "which is why Julia suits long-running analysis better than " +
            "quick invocations."
        }
      ],

      trade: {
        buys: [
          "C-like speed from high-level readable code.",
          "Multiple dispatch gives exceptional library composability.",
          "Excellent numerical and scientific ecosystem.",
          "Native support for units, autodiff and arbitrary precision.",
          "Solves the two-language problem in its domain."
        ],
        costs: [
          "Startup and first-call latency.",
          "Type instability silently destroys performance.",
          "Much smaller ecosystem than Python.",
          "Deployment story is weaker — large runtime, no easy static binary.",
          "Small hiring pool."
        ],
        avoid: [
          "The work is general application or web development.",
          "You need the Python ML ecosystem.",
          "Startup latency matters — CLI tools, serverless.",
          "The team is Python-fluent and the performance gain is not needed.",
          "You need a small self-contained deployable artefact."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "clojure",

      why: {
        before: "Lisp had macros, homoiconicity and expressive power, and lived " +
          "outside the mainstream — its own runtimes, its own ecosystem, and " +
          "little industrial adoption.",
        problem: "Rich Hickey's diagnosis was more specific than *Lisp needs a " +
          "platform*. He argued that **mutable state is the central source of " +
          "complexity** in software, and that object orientation — encapsulating " +
          "mutable state in objects — institutionalises the problem rather than " +
          "solving it.",
        shift: "Immutable **persistent data structures** by default, on the " +
          "JVM. *Persistent* is the key engineering achievement: modifying a " +
          "map returns a new map sharing most of its structure with the old, so " +
          "immutability costs `O(log32 n)` rather than a full copy. Add " +
          "controlled mutation through atoms, refs and STM, and shared-memory " +
          "concurrency stops requiring locks."
      },

      num: {
        t: "Structural sharing — why immutability is affordable",
        h: ["Operation", "Naive copy", "Persistent (HAMT)"],
        r: [
          ["`assoc` on a 1M-entry map", "**O(n)** — copy everything", "**O(log₃₂ n)** ≈ 4 hops"],
          ["Memory for the new version", "another full map", "~a few nodes"],
          ["Old version", "unchanged", "unchanged, still valid"]
        ],
        n: "The `log₃₂` is the trick: a **hash array mapped trie** with 32-way " +
          "branching is only about four levels deep for a million entries, so " +
          "updating one key copies four small nodes and shares everything else. " +
          "That is what makes *just make it immutable* practical rather than " +
          "aspirational, and the idea spread — **Immutable.js** and React's " +
          "reliance on cheap identity comparison come directly from it. The " +
          "other distinctive choice is **data over ceremony**: Clojure prefers " +
          "plain maps to classes, with `spec` for validating shape at runtime, " +
          "which is liberating in the small and requires real discipline at " +
          "scale."
      },

      miss: [
        {
          w: "Immutable data structures are too slow for real work.",
          r: "Structural sharing makes updates `O(log₃₂ n)` — effectively a " +
            "handful of operations. There is a constant-factor cost against " +
            "mutable structures, and it is nothing like the `O(n)` copy people " +
            "imagine. Transients exist for the hot paths where it matters."
        },
        {
          w: "Clojure is hard because of all the parentheses.",
          r: "Parentheses are surface and structural editing tools make them a " +
            "non-issue quickly. The genuinely different parts are " +
            "**immutability as default**, thinking in data transformations " +
            "rather than objects, and the REPL-driven workflow — which is a " +
            "different way of working, not just a different syntax."
        },
        {
          w: "Macros let you extend the language, so use them freely.",
          r: "Clojure culture is notably **conservative** about macros: they " +
            "are not first-class values, they do not compose, and they make " +
            "code harder to reason about. The community guidance is to reach " +
            "for a function first and use a macro only when you genuinely need " +
            "to control evaluation."
        },
        {
          w: "Dynamic typing makes large Clojure codebases unmaintainable.",
          r: "It is a real trade and the mitigations are substantial: " +
            "**`spec`** for runtime validation and generative testing, and a " +
            "culture of small pure functions over plain data. Whether that " +
            "suffices at scale is genuinely contested — it is a legitimate " +
            "concern rather than a myth."
        }
      ],

      trade: {
        buys: [
          "Immutability by default with affordable performance.",
          "Excellent concurrency story — no locks for shared state.",
          "Full JVM ecosystem access.",
          "REPL-driven development that is genuinely different in kind.",
          "Homoiconicity and macros when they are warranted.",
          "ClojureScript targets the browser with the same language."
        ],
        costs: [
          "Dynamic typing, mitigated but not removed by spec.",
          "JVM startup time.",
          "Small hiring pool.",
          "Stack traces through lazy sequences are hard to read.",
          "Unfamiliar paradigm for most developers."
        ],
        avoid: [
          "The team cannot invest in learning a genuinely different paradigm.",
          "You need static type guarantees.",
          "Startup latency matters — though GraalVM native images help.",
          "Hiring is a hard constraint.",
          "The problem is straightforward CRUD where the power buys little."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "assembly-language",

      why: {
        before: "Programs were written in **machine code** — literal numeric " +
          "opcodes, entered by hand. Changing one instruction meant " +
          "recalculating every jump address after it.",
        problem: "It is unreadable, unmaintainable, and every edit risks " +
          "silently breaking every address. The information density is fine " +
          "for the machine and hopeless for people.",
        shift: "One symbolic **mnemonic per machine instruction**, with named " +
          "labels for addresses. An assembler translates mechanically. Nothing " +
          "is abstracted — it is a **transliteration**, not a compilation — " +
          "which is exactly why it remains the only way to see precisely what " +
          "the machine will do."
      },

      num: {
        t: "Where assembly is still written",
        h: ["Domain", "Why", "Typical size"],
        r: [
          ["Boot code, interrupt vectors", "runs before any runtime exists", "tens of lines"],
          ["**Cryptographic primitives**", "**constant-time guarantees**", "hundreds"],
          ["SIMD kernels", "compiler will not vectorise this", "hundreds"],
          ["Context switching", "manipulates the stack directly", "tens"],
          ["Reverse engineering", "there is no source", "reading, not writing"]
        ],
        n: "The cryptography row is the one people underestimate. A compiler " +
          "may transform a branch into a conditional move, or leave it as a " +
          "branch — and in cryptographic code a data-dependent branch is a " +
          "**timing side channel** that leaks the key. Since C has no way to " +
          "say *this must take the same time regardless of the data*, " +
          "constant-time primitives are written in assembly and checked. " +
          "Otherwise, the honest position is that **compilers usually beat " +
          "hand-written assembly** on general code: they track register " +
          "pressure, instruction scheduling and pipeline behaviour across " +
          "hundreds of instructions better than a person can. Where hand " +
          "assembly still wins is where the compiler lacks information or a " +
          "guarantee it cannot express."
      },

      miss: [
        {
          w: "Hand-written assembly is faster than compiled code.",
          r: "Usually **not**, for anything non-trivial. Modern compilers " +
            "handle instruction scheduling, register allocation and " +
            "vectorisation across large windows. Assembly wins on small " +
            "kernels where you know something the compiler does not, or where " +
            "you need a guarantee it cannot make."
        },
        {
          w: "Learning assembly is only useful if you write it.",
          r: "The main value is **reading** it: understanding why a loop is " +
            "slow, what a compiler did with your code, how a security " +
            "vulnerability works, or what a binary does with no source. " +
            "Reading disassembly is a practical debugging skill; writing it is " +
            "rare."
        },
        {
          w: "Assembly is a single language.",
          r: "It is **per-architecture** and per-assembler. x86-64 and ARM64 " +
            "are entirely different instruction sets, and x86 alone has two " +
            "incompatible syntaxes — Intel and AT&T, with operands in opposite " +
            "order. Assembly is not portable in any sense."
        },
        {
          w: "One assembly instruction equals one thing the CPU does.",
          r: "Modern x86 decodes instructions into **micro-operations**, " +
            "executes them out of order, renames registers and speculates " +
            "across branches. The instruction stream is closer to a request " +
            "than a schedule — which is why performance is hard to predict from " +
            "the assembly alone."
        }
      ],

      trade: {
        buys: [
          "Complete control over exactly which instructions execute.",
          "Access to instructions no high-level language exposes.",
          "Constant-time guarantees that compilers cannot provide.",
          "The only option before a runtime exists — boot, interrupts.",
          "Essential for reverse engineering and low-level debugging."
        ],
        costs: [
          "Extremely slow to write and easy to get wrong.",
          "Zero portability across architectures.",
          "No type checking or memory safety whatsoever.",
          "Maintenance burden is severe.",
          "Usually slower than what a compiler produces."
        ],
        avoid: [
          "You are optimising general code — **measure and help the compiler** " +
            "first.",
          "Intrinsics would give the same instructions with type checking.",
          "Portability matters at all.",
          "You have not profiled and confirmed this is the bottleneck.",
          "The team cannot maintain it — assembly nobody understands is a " +
            "liability."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "fortran",

      why: {
        before: "Scientific computing meant assembly. Every numerical routine " +
          "was hand-coded per machine, and physicists were spending their time " +
          "on register allocation.",
        problem: "IBM's team under John Backus faced deep scepticism — the " +
          "prevailing belief was that a compiler could never produce code " +
          "efficient enough to displace hand assembly, and for scientific work " +
          "efficiency was the whole point.",
        shift: "FORTRAN (1957) proved otherwise, and the language was shaped " +
          "**entirely around making that optimisation possible**. Its most " +
          "consequential decision is one people rarely notice: **arguments do " +
          "not alias by default**, so the compiler can assume two array " +
          "parameters do not overlap and vectorise aggressively. C cannot " +
          "assume that, which is why `restrict` exists."
      },

      num: {
        t: "Why Fortran still wins on numerics",
        h: ["Property", "Fortran", "C"],
        r: [
          ["Argument aliasing", "**assumed none**", "assumed possible"],
          ["Multidimensional arrays", "**first class**", "pointers-to-pointers"],
          ["Array slicing / whole-array ops", "**in the language**", "loops"],
          ["Memory layout", "column-major, contiguous", "row-major, may be scattered"],
          ["Vectorisation", "aggressive by default", "needs `restrict` and hints"]
        ],
        n: "Aliasing is the deep reason. In C, `void f(double *a, double *b)` " +
          "must assume `a` and `b` might point at the same memory, so many " +
          "loop transformations are unsafe. Fortran's standard says they do " +
          "not alias, which unlocks vectorisation and reordering the C compiler " +
          "must decline. This is why **LAPACK and BLAS** — the numerical " +
          "foundation under NumPy, SciPy, MATLAB and R — are Fortran, and why " +
          "every scientist running Python is running Fortran underneath. " +
          "Modern Fortran (2008/2018) also has native parallelism through " +
          "**coarrays** and `do concurrent`, so this is not a frozen 1957 " +
          "language."
      },

      miss: [
        {
          w: "Fortran is obsolete and only survives in legacy code.",
          r: "It is actively standardised — Fortran 2018, with 2023 published " +
            "— and remains the language of choice for new climate models, " +
            "computational fluid dynamics and much HPC. Roughly **the majority " +
            "of supercomputer cycles** run Fortran or C++."
        },
        {
          w: "Fortran means fixed-form punched-card formatting.",
          r: "That was **FORTRAN 77**. Fortran 90 introduced free-form source, " +
            "modules, dynamic allocation, derived types and array operations. " +
            "Modern Fortran reads like an ordinary imperative language."
        },
        {
          w: "C or C++ is just as fast, so language choice is irrelevant.",
          r: "For array-heavy numerical loops, Fortran's aliasing rules and " +
            "native multidimensional arrays give the compiler information C " +
            "does not have. C can approach it with `restrict` and careful " +
            "layout — which is doing by hand what Fortran does by default."
        },
        {
          w: "You should rewrite scientific Fortran in Python or Julia.",
          r: "The performance-critical kernels frequently **remain Fortran** " +
            "and are called from the higher-level language. That is exactly " +
            "what NumPy does. Rewriting decades of validated numerical code " +
            "risks subtle correctness regressions for no clear gain."
        }
      ],

      trade: {
        buys: [
          "Best-in-class optimisation for array numerical code.",
          "Native multidimensional arrays and whole-array operations.",
          "Decades of validated numerical libraries.",
          "Built-in parallelism via coarrays and `do concurrent`.",
          "Extremely stable — old code still compiles."
        ],
        costs: [
          "Poor at strings, I/O and general-purpose programming.",
          "Small and ageing developer community.",
          "Weak modern tooling and package management.",
          "Limited ecosystem outside numerics."
        ],
        avoid: [
          "Anything that is not numerical array computation.",
          "You need a modern ecosystem or web integration.",
          "The team has no Fortran experience and the work is not " +
            "performance-critical.",
          "You are calling it from Python anyway — you may not need to write " +
            "any."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lisp",

      why: {
        before: "Programming languages were designed around what machines do " +
          "— arithmetic, jumps, memory. FORTRAN was a notation for numerical " +
          "computation on a specific architecture.",
        problem: "McCarthy wanted to express **symbolic computation and " +
          "recursion** for AI research. Existing languages had no natural way " +
          "to represent or manipulate symbolic structure, and no recursion.",
        shift: "Base the language on **lambda calculus and lists**, and make " +
          "**code and data the same structure** — an s-expression. That last " +
          "property, **homoiconicity**, is the deep one: a program is a list, " +
          "so programs can construct and transform programs as ordinary data. " +
          "That is what a macro is, and nothing else offers it as directly."
      },

      num: {
        t: "Ideas Lisp introduced that are now universal",
        h: ["Idea", "Year", "Now in"],
        r: [
          ["Garbage collection", "1959", "nearly everything"],
          ["First-class functions", "1958", "JS, Python, Java, Go, Rust"],
          ["Recursion as a norm", "1958", "everything"],
          ["The REPL", "1964", "every scripting language"],
          ["Dynamic typing", "1958", "Python, Ruby, JS"],
          ["**Macros (homoiconic)**", "1963", "**Lisp family, Rust (partly)**"]
        ],
        n: "Five of those six are so universal that nobody attributes them any " +
          "more, which is the strongest statement of Lisp's influence. The " +
          "sixth is the one that did **not** spread, because it requires the " +
          "syntax nobody else wanted: macros that manipulate code as data need " +
          "code to *be* data, and s-expressions are the price. Rust and " +
          "Scala's macros operate on token streams or ASTs — more powerful " +
          "than C's textual preprocessor and less direct than Lisp's. The " +
          "family is alive: **Clojure**, **Racket**, **Emacs Lisp**, and " +
          "**Scheme** in teaching."
      },

      miss: [
        {
          w: "Lisp is a single language.",
          r: "It is a **family** with real differences. Common Lisp is large " +
            "and multi-paradigm; Scheme is minimal and elegant; Clojure is " +
            "immutable-by-default on the JVM; Emacs Lisp is an editor " +
            "extension language. Code does not transfer between them."
        },
        {
          w: "The parentheses are the main obstacle.",
          r: "They are what makes homoiconicity possible — uniform structure " +
            "is why code can be manipulated as data. Structural editing tools " +
            "make them easy in practice. The real adjustment is **thinking in " +
            "expressions and transformations** rather than statements."
        },
        {
          w: "Lisp is slow because it is dynamic and interpreted.",
          r: "SBCL compiles Common Lisp to native code with performance " +
            "approaching C for numeric work, given type declarations. Clojure " +
            "runs on the JVM. *Interpreted* has not been generally true for " +
            "decades."
        },
        {
          w: "Lisp failed because it was not practical.",
          r: "It was central to AI research for thirty years, and its **ideas " +
            "won completely** — every mainstream language now has garbage " +
            "collection, closures and a REPL. What did not spread was the " +
            "syntax and the macro system that depends on it. That is a " +
            "different outcome from failure."
        }
      ],

      trade: {
        buys: [
          "Homoiconicity — genuinely powerful macros.",
          "Interactive REPL-driven development.",
          "Extremely expressive and concise for symbolic work.",
          "A small, consistent core with few special cases.",
          "Long track record in AI, symbolic computation and DSLs."
        ],
        costs: [
          "Unfamiliar syntax that many find genuinely off-putting.",
          "Fragmented across incompatible dialects.",
          "Small ecosystem in most dialects.",
          "Macro-heavy code can be very hard for others to follow.",
          "Small hiring pool."
        ],
        avoid: [
          "The team will not invest in a genuinely different model.",
          "You need a large ecosystem — Clojure on the JVM is the exception.",
          "The problem is straightforward and the expressiveness buys nothing.",
          "Macro-heavy code would be maintained by people who did not write " +
            "it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "perl",

      why: {
        before: "Unix text processing meant stitching together `sed`, `awk`, " +
          "`grep` and shell — each with its own syntax, each limited, and the " +
          "seams between them fragile.",
        problem: "Larry Wall was writing report generators and found himself " +
          "at the boundary: too complex for `awk`, too text-heavy for C. There " +
          "was a genuine gap between the shell tools and a systems language.",
        shift: "Build a language for that gap, with **regular expressions as " +
          "first-class syntax** rather than a library. `if (/pattern/)` is " +
          "built into the grammar. Combined with the philosophy that *there is " +
          "more than one way to do it*, Perl became the glue of the early " +
          "internet — and the same flexibility became its reputational problem."
      },

      num: {
        t: "Perl's lasting contributions",
        h: ["Contribution", "Where it ended up"],
        r: [
          ["**PCRE regex syntax**", "**Python, Java, JS, .NET, PHP, Go**"],
          ["CPAN (1995)", "the model for npm, PyPI, RubyGems, crates.io"],
          ["`use strict`/`warnings`", "gradual-safety patterns elsewhere"],
          ["One-liner text processing", "still unmatched for ad-hoc work"]
        ],
        n: "**Perl-Compatible Regular Expressions** is the quiet legacy: the " +
          "regex syntax you use in Python, JavaScript, Java or Go is Perl's, " +
          "and PCRE is a library explicitly named for compatibility with it. " +
          "**CPAN predates every modern package manager** and established the " +
          "conventions they follow. On the language's decline: the ~15-year " +
          "**Perl 6** development, which eventually became a *separate* " +
          "language (Raku), left Perl 5 in an ambiguous position while Python " +
          "took the scripting ground. Perl is still excellent at what it was " +
          "built for — `perl -pe 's/x/y/'` remains the fastest route to a " +
          "text transformation."
      },

      miss: [
        {
          w: "Perl is unreadable by nature.",
          r: "Perl **permits** unreadable code — sigils, implicit `$_`, " +
            "obscure special variables, and a culture that once celebrated " +
            "golf. With `use strict; use warnings;`, explicit variables and " +
            "ordinary discipline it reads much like any scripting language. " +
            "The reputation comes from what is possible, not what is required."
        },
        {
          w: "Perl 6 is the successor to Perl 5.",
          r: "It is a **different language**, and was renamed **Raku** in 2019 " +
            "precisely to end the confusion. Perl 5 continued independently and " +
            "is now versioned in the 5.3x range. The long naming ambiguity did " +
            "real damage to both."
        },
        {
          w: "Python does everything Perl does, better.",
          r: "For general programming, largely yes. For **ad-hoc text " +
            "processing on the command line**, Perl's `-n`, `-p`, `-a` and " +
            "`-i` flags plus first-class regex remain more concise than " +
            "anything Python offers. Many sysadmins still reach for it for " +
            "exactly that."
        },
        {
          w: "Nobody uses Perl any more.",
          r: "It is deeply embedded in system administration, bioinformatics, " +
            "and a great deal of infrastructure glue. It is not chosen for new " +
            "large projects and it has not gone anywhere — which is a common " +
            "and stable position for a mature tool."
        }
      ],

      trade: {
        buys: [
          "Unmatched conciseness for text processing and one-liners.",
          "First-class regular expressions in the syntax.",
          "CPAN — enormous and mature module archive.",
          "Present on essentially every Unix system.",
          "Extremely stable; old scripts keep working."
        ],
        costs: [
          "Permits genuinely unreadable code.",
          "Sigils and context rules confuse newcomers.",
          "Object system is bolted on and awkward.",
          "Declining community and hiring pool.",
          "Poor fit for large structured applications."
        ],
        avoid: [
          "Building a large maintainable application.",
          "The team has no Perl experience and Python would do.",
          "You need a modern ecosystem for web or ML work.",
          "Long-term maintainability by others is a priority.",
          "It is a one-off text transformation — then Perl is arguably the " +
            "right answer."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ocaml",

      why: {
        before: "ML pioneered type inference and algebraic data types in the " +
          "1970s as a **metalanguage for theorem proving** — a research " +
          "vehicle, not a general-purpose tool.",
        problem: "Those ideas were clearly valuable beyond proof assistants, " +
          "and the languages carrying them were impractical: slow, limited " +
          "libraries, no obvious path to production use.",
        shift: "Build a practical descendant: **native compilation to fast " +
          "code**, a genuinely powerful module system, and pragmatic escape " +
          "hatches — mutable references, imperative loops, objects — where " +
          "purity would be a hindrance. OCaml is what you get when ML is " +
          "designed for use rather than for research."
      },

      num: {
        t: "OCaml against Haskell",
        h: ["Property", "OCaml", "Haskell"],
        r: [
          ["Evaluation", "**strict**", "lazy"],
          ["Purity", "pragmatic — mutation allowed", "enforced"],
          ["Performance predictability", "**good**", "space leaks"],
          ["Compile speed", "**very fast**", "slow"],
          ["Module system", "**functors, very strong**", "type classes"],
          ["Learning curve", "moderate", "steep"]
        ],
        n: "**Strictness is the practical differentiator.** Because " +
          "evaluation order is predictable, memory behaviour is predictable — " +
          "OCaml does not have Haskell's space-leak problem, which is the " +
          "single most common reason Haskell programs misbehave in production. " +
          "Its industrial track record is narrow and serious: **Jane Street** " +
          "runs its entire trading infrastructure on it, and it is the " +
          "implementation language of **Coq**, **Rust's first compiler**, " +
          "**Flow** and **Infer**. The pattern is consistent — it is chosen " +
          "where correctness matters enormously and the domain is symbolic: " +
          "compilers, analysers, and financial logic."
      },

      miss: [
        {
          w: "OCaml is a purely functional language.",
          r: "It is **functional-first and pragmatic**. Mutable records, " +
            "arrays, `ref` cells, `while` loops and an object system are all " +
            "available. You use them where they fit, which is a deliberate " +
            "difference from Haskell rather than a compromise."
        },
        {
          w: "OCaml is niche because it is academic.",
          r: "It has real industrial use — Jane Street, Bloomberg, Docker's " +
            "original tooling, Facebook's static analysers. It is niche because " +
            "its **ecosystem is small** and it has never had a corporate " +
            "champion pushing adoption, not because it is impractical."
        },
        {
          w: "The module system is just namespacing.",
          r: "**Functors** are modules parameterised by modules — the " +
            "equivalent of generics at module granularity. You can write a " +
            "whole library abstract over a data structure implementation and " +
            "instantiate it several ways with full type checking. It is one of " +
            "the most powerful module systems in any language."
        },
        {
          w: "OCaml cannot use multiple cores.",
          r: "That was true until **OCaml 5.0 (2022)**, which introduced " +
            "multicore support with effect handlers. Before it, parallelism " +
            "meant multiple processes. The limitation was real and is now " +
            "historical."
        }
      ],

      trade: {
        buys: [
          "Strong static types with excellent inference and little annotation.",
          "Fast native compilation — both the compiler and the output.",
          "Predictable performance and memory, unlike lazy languages.",
          "An exceptionally powerful module system.",
          "Pragmatic mutation where it is genuinely useful."
        ],
        costs: [
          "Small ecosystem and library selection.",
          "Small hiring pool.",
          "Some rough edges — printf-style formatting, error messages.",
          "Multicore support is recent and still maturing.",
          "Fewer learning resources than mainstream languages."
        ],
        avoid: [
          "You need a broad ecosystem — web frameworks, ML libraries, cloud " +
            "SDKs.",
          "Hiring is a constraint.",
          "The team wants enforced purity — use **Haskell**.",
          "The problem is straightforward and the type system buys little.",
          "You need mature multicore parallelism today."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
