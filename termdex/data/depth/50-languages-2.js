/* ==========================================================================
   Depth pass 50 — programming languages batch 2: Kotlin through Lua.

   The JVM languages solved different problems: Kotlin removed Java's
   ceremony, Scala added functional programming, and Groovy added scripting.
   Meanwhile Swift and Kotlin both replaced earlier platform languages by
   offering the same runtime with better ergonomics.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "kotlin",

      why: {
        before: "Android development meant Java — verbose, null-unsafe, and " +
          "missing modern language features. Boilerplate dominated small " +
          "classes and data objects.",
        problem: "Java's null pointer exceptions were the #1 crash cause on " +
          "Android. Data classes needed dozens of lines for what should be " +
          "one. Coroutines did not exist — async required callbacks.",
        shift: "**A modern JVM language that fixes Java's worst ergonomic " +
          "problems.** Kotlin compiles to JVM bytecode (and to JS, and to " +
          "native), interoperates perfectly with existing Java code, and " +
          "makes nullability a **type-system concern** rather than a " +
          "runtime crash. Google made it the preferred language for Android."
      },

      num: {
        t: "What Kotlin fixes over Java",
        h: ["Problem in Java", "Kotlin solution", "Mechanism"],
        r: [
          ["**NullPointerException**", "**nullable types `T?`**", "**compiler rejects unguarded null access**"],
          ["Data class boilerplate", "`data class`", "auto-generates equals, hashCode, copy, toString"],
          ["**Callback hell**", "**coroutines**", "**structured concurrency with suspend functions**"],
          ["No expression when", "when expression", "exhaustive pattern matching"],
          ["Checked exceptions", "no checked exceptions", "all exceptions are unchecked"],
          ["**Verbosity**", "**extension functions, default args**", "**less code without less safety**"]
        ],
        n: "Kotlin's **null safety** is its single most impactful feature. " +
          "Every type is non-null by default; `String?` is nullable, " +
          "`String` is not. The compiler forces you to handle the null case " +
          "before accessing — either with safe calls (`?.`), elvis (`?:`), " +
          "or explicit checks. This eliminates the entire class of bugs " +
          "that `NullPointerException` represents. **Coroutines** are the " +
          "other major contribution: `suspend fun` marks a function that " +
          "can be suspended without blocking a thread, and **structured " +
          "concurrency** (via `CoroutineScope`) ensures that child " +
          "coroutines are cancelled when their parent is. This prevents " +
          "the fire-and-forget leak that plagues manual threading. Kotlin " +
          "Multiplatform (KMP) is the newer bet: share business logic " +
          "across Android, iOS, web, and server from a single codebase, " +
          "with platform-specific UI layers."
      },

      miss: [
        {
          w: "Kotlin replaces Java.",
          r: "Kotlin **interoperates** with Java — you can call Java from " +
            "Kotlin and vice versa in the same project. It does not replace " +
            "Java; it extends the JVM ecosystem with better ergonomics."
        },
        {
          w: "Coroutines are threads.",
          r: "Coroutines are **suspended computations** multiplexed onto a " +
            "thread pool. They are far lighter than threads and use " +
            "structured concurrency to manage lifetimes."
        },
        {
          w: "Kotlin is only for Android.",
          r: "Kotlin runs on the JVM (server-side, desktop), compiles to " +
            "JavaScript, and compiles to native binaries via Kotlin/Native. " +
            "Spring Boot has first-class Kotlin support."
        },
        {
          w: "Null safety means no NPEs ever.",
          r: "Kotlin's `!!` operator force-unwraps a nullable and throws " +
            "NPE if null. Java interop can also introduce platform types " +
            "where nullability is unknown. The system **reduces** NPEs; " +
            "it does not make them impossible."
        }
      ],

      trade: {
        buys: [
          "Null safety at the type level — eliminates the #1 crash class.",
          "Coroutines with structured concurrency for async code.",
          "Full interop with existing Java code and libraries.",
          "Concise syntax — data classes, extension functions, smart casts.",
          "First-class Android support from Google."
        ],
        costs: [
          "Slower compilation than Java in some configurations.",
          "Two mental models needed when mixing Java and Kotlin.",
          "Coroutine debugging can be harder than thread debugging.",
          "Some Java frameworks are less ergonomic from Kotlin.",
          "Smaller community than Java for server-side development."
        ],
        avoid: [
          "When the entire team knows only Java and there is no ramp-up time.",
          "Performance-critical hot paths where JVM overhead is the bottleneck.",
          "When the project has no existing JVM investment."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "swift",

      why: {
        before: "iOS and macOS development used Objective-C — a 1980s " +
          "Smalltalk-flavoured superset of C with dynamic dispatch, manual " +
          "reference counting (later ARC), and square-bracket message syntax.",
        problem: "Objective-C's dynamism was powerful but unsafe. " +
          "Unrecognised selectors crashed at runtime, nullability was not " +
          "in the type system, and the syntax deterred developers from " +
          "other language backgrounds.",
        shift: "**A safe, fast, expressive replacement for Objective-C.** " +
          "Swift is statically typed with type inference, optionals instead " +
          "of null, value types by default, and protocol-oriented " +
          "programming. It uses ARC for memory management and compiles to " +
          "native code via LLVM."
      },

      num: {
        t: "Swift's safety features",
        h: ["Feature", "What it prevents", "Mechanism"],
        r: [
          ["**Optionals**", "**null dereference**", "**`T?` requires unwrapping before use**"],
          ["Value types", "shared mutable state", "structs are copied, not referenced"],
          ["**ARC**", "**memory leaks (mostly)**", "**compile-time reference counting, no GC pauses**"],
          ["Protocol extensions", "fragile base class", "composition over inheritance"],
          ["**Guard / if let**", "**unsafe unwrap**", "**forced handling of nil cases**"],
          ["Exclusive access", "data races", "compiler enforces law of exclusivity"]
        ],
        n: "Swift's **Automatic Reference Counting (ARC)** is not garbage " +
          "collection — it inserts retain and release calls at compile time, " +
          "so there are no GC pauses. The cost is **retain cycles**: two " +
          "objects referencing each other will never be freed. `weak` and " +
          "`unowned` references break cycles, and failing to use them is " +
          "the most common source of memory leaks in Swift. **Protocol-" +
          "oriented programming** is Swift's answer to deep class " +
          "hierarchies: define capabilities as protocols with default " +
          "implementations in extensions, then compose them. This matches " +
          "how SwiftUI works — views conform to the `View` protocol and " +
          "compose declaratively. Swift Concurrency (async/await, actors) " +
          "was added in 5.5 and provides structured concurrency similar to " +
          "Kotlin's coroutines, with **actors** providing data-race-safe " +
          "mutable state."
      },

      miss: [
        {
          w: "Swift is only for Apple platforms.",
          r: "Swift runs on Linux and Windows, and is used for server-side " +
            "development (Vapor framework). But its ecosystem is overwhelmingly " +
            "Apple-centric, and cross-platform support is a work in progress."
        },
        {
          w: "ARC means you never think about memory.",
          r: "Retain cycles — two objects holding strong references to each " +
            "other — cause leaks that ARC cannot resolve. You must use " +
            "`weak` or `unowned` references to break them."
        },
        {
          w: "Swift replaces Objective-C entirely.",
          r: "Objective-C code is still called via bridging, and many Apple " +
            "frameworks are still Objective-C underneath. Swift interops " +
            "with it but has not fully replaced it in Apple's own codebase."
        },
        {
          w: "Protocol-oriented means no classes.",
          r: "Classes exist and are used — especially when you need reference " +
            "semantics or interop with Objective-C. The recommendation is to " +
            "**prefer** structs and protocols, not to avoid classes entirely."
        }
      ],

      trade: {
        buys: [
          "Optionals eliminate null crashes at the type level.",
          "ARC provides deterministic memory management without GC pauses.",
          "First-class Apple platform support — SwiftUI, Combine, UIKit.",
          "Modern syntax with type inference, closures, and generics.",
          "Protocol-oriented design encourages composition."
        ],
        costs: [
          "ARC retain cycles are easy to create and hard to diagnose.",
          "ABI stability is young — binary compatibility was only Swift 5.",
          "Compile times are slow for large projects.",
          "Cross-platform ecosystem is thin compared to Java or Go.",
          "Rapid language evolution has caused migration churn."
        ],
        avoid: [
          "When the target is not Apple platforms and server-side Swift is too niche.",
          "Cross-platform mobile — use Kotlin Multiplatform or Flutter instead.",
          "When the team has no Apple ecosystem investment."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "r",

      why: {
        before: "Statistical computing meant commercial packages like SAS, " +
          "SPSS, or Stata — expensive, proprietary, and limited in " +
          "extensibility.",
        problem: "Researchers needed a **free, extensible** environment for " +
          "statistics that could handle everything from linear regression " +
          "to Bayesian inference, with publication-quality visualisations.",
        shift: "**A domain-specific language for statistics.** R was built " +
          "by statisticians for statisticians. Its first-class data frame, " +
          "vectorised operations, formula syntax, and ggplot2 for " +
          "visualisation make it the default in academic statistics, " +
          "bioinformatics, and social science research."
      },

      num: {
        t: "R's design trade-offs",
        h: ["Feature", "Benefit", "Cost"],
        r: [
          ["**Vectorised operations**", "**fast on arrays without loops**", "**scalar code is slow**"],
          ["First-class data frames", "tabular data built in", "memory-heavy (copy-on-modify)"],
          ["**Formula syntax**", "**`y ~ x1 + x2` is readable stats**", "**confusing outside statistics**"],
          ["**CRAN**", "**20,000+ packages, quality-reviewed**", "**some packages are unmaintained**"],
          ["ggplot2", "publication-quality plots", "steep learning curve for grammar of graphics"],
          ["**1-based indexing**", "**matches maths conventions**", "**confuses programmers from other languages**"]
        ],
        n: "R's strength is **statistical modelling**, not general-purpose " +
          "programming. Its tidyverse ecosystem (dplyr, ggplot2, tidyr, " +
          "purrr) transformed R from a quirky language into a coherent data " +
          "analysis framework. **The pipe operator** (`|>` natively, `%>%` " +
          "via magrittr) chains transformations readably. The main weakness " +
          "is that R holds data in memory and uses copy-on-modify semantics, " +
          "which makes it struggle with datasets larger than available RAM. " +
          "Python has overtaken R in ML and production data science, but R " +
          "remains dominant in **biostatistics, clinical trials, and " +
          "academic research** where its statistical packages have no " +
          "Python equivalent."
      },

      miss: [
        {
          w: "R is obsolete now that Python has pandas.",
          r: "For **statistical modelling and publication-quality plots**, R " +
            "is still superior. ggplot2 has no true Python equivalent, and " +
            "R's statistical packages cover methods Python does not."
        },
        {
          w: "R cannot handle big data.",
          r: "Base R is memory-bound, but **data.table**, **arrow**, and " +
            "**sparklyr** enable R to work with data far larger than RAM. " +
            "The limitation is base R, not the ecosystem."
        },
        {
          w: "R is only for academics.",
          r: "Pharmaceutical companies, hedge funds, and epidemiologists use " +
            "R in production. Shiny apps serve dashboards to non-technical " +
            "users. Its use is domain-specific, not academic-only."
        },
        {
          w: "R and Python are interchangeable for data science.",
          r: "They overlap but differ. Python is better for ML engineering, " +
            "production pipelines, and deep learning. R is better for " +
            "statistical analysis, clinical trials, and hypothesis testing."
        }
      ],

      trade: {
        buys: [
          "Unmatched statistical modelling ecosystem.",
          "ggplot2 produces publication-ready visualisations.",
          "Tidyverse makes data wrangling readable and consistent.",
          "CRAN provides quality-reviewed, domain-specific packages.",
          "Formula interface makes regression models expressive."
        ],
        costs: [
          "Memory-bound by default — struggles with large datasets.",
          "1-based indexing and copy-on-modify surprise most programmers.",
          "Not a general-purpose language — limited outside data analysis.",
          "Production deployment is harder than Python.",
          "Two ecosystems (base R vs tidyverse) confuse newcomers."
        ],
        avoid: [
          "General-purpose programming — R is not designed for it.",
          "Production ML serving — Python's ecosystem is far richer.",
          "When the team knows Python and the statistical needs are basic.",
          "Large-scale data engineering pipelines."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ruby",

      why: {
        before: "Server-side web development meant PHP, Java servlets, or " +
          "Perl CGI — all functional but none prioritised developer " +
          "happiness or code expressiveness.",
        problem: "Web development involved too much boilerplate and " +
          "configuration. Setting up a CRUD app took hours of wiring " +
          "before writing business logic.",
        shift: "**Optimise for developer happiness.** Ruby is designed to " +
          "be natural to read and pleasant to write. Rails (Ruby on Rails) " +
          "turned that philosophy into a full web framework — convention " +
          "over configuration, sensible defaults, and the ability to " +
          "scaffold a complete web application in minutes."
      },

      num: {
        t: "Ruby's design philosophy in practice",
        h: ["Principle", "How Ruby does it", "Example"],
        r: [
          ["**Everything is an object**", "**even integers and nil**", "**`5.times { puts 'hi' }`**"],
          ["Blocks and closures", "first-class code blocks", "`[1,2,3].map { |x| x * 2 }`"],
          ["**Duck typing**", "**respond to methods, not types**", "**no interfaces needed**"],
          ["Open classes", "modify any class at runtime", "monkey-patching"],
          ["**Convention over config**", "**Rails defaults over XML**", "**`resources :users` for full CRUD**"],
          ["Metaprogramming", "code that writes code", "`attr_accessor :name` generates methods"]
        ],
        n: "Ruby's **metaprogramming** is both its superpower and its " +
          "maintenance risk. `method_missing`, `define_method`, and " +
          "`class_eval` let libraries like Rails create expressive DSLs — " +
          "but they also make code harder to trace and debug, because the " +
          "method being called may not exist in any file you can search. " +
          "Ruby's performance has improved dramatically with YJIT (Yet " +
          "Another JIT), which ships with Ruby 3.2+ and provides " +
          "significant speedups for real-world Rails applications. The " +
          "**GVL (Global VM Lock)** is Ruby's equivalent of Python's GIL — " +
          "it prevents true parallelism in threads, though Ractors " +
          "(Ruby 3.0+) offer actor-based parallelism. Ruby's community " +
          "famously values code beauty and testing culture, and the Rails " +
          "ecosystem remains one of the most productive for CRUD-heavy " +
          "web applications."
      },

      miss: [
        {
          w: "Ruby is dead.",
          r: "GitHub, Shopify, Basecamp, and GitLab all run Ruby at massive " +
            "scale. It is not the fastest-growing language, but it has a " +
            "stable, productive ecosystem."
        },
        {
          w: "Ruby is too slow for production.",
          r: "YJIT (since Ruby 3.2) provides ~30–40% speedups. Shopify " +
            "serves billions of requests with Ruby. The bottleneck in most " +
            "web apps is I/O, not language speed."
        },
        {
          w: "Metaprogramming is always bad.",
          r: "It enables Rails' entire DSL — routes, migrations, " +
            "associations. The issue is **undisciplined** metaprogramming, " +
            "not the feature itself. Libraries should use it; application " +
            "code usually should not."
        },
        {
          w: "Rails is the only way to use Ruby.",
          r: "Sinatra, Hanami, and dry-rb offer alternatives. Ruby is also " +
            "used for scripting, CLI tools (Homebrew is Ruby), and DevOps " +
            "(Chef, Vagrant)."
        }
      ],

      trade: {
        buys: [
          "Exceptionally readable and expressive syntax.",
          "Rails is the most productive framework for CRUD web apps.",
          "Rich testing culture — RSpec, Minitest, Capybara.",
          "Metaprogramming enables powerful internal DSLs.",
          "Strong community conventions reduce decision fatigue."
        ],
        costs: [
          "Slower than compiled languages — though YJIT helps significantly.",
          "GVL limits thread-level parallelism.",
          "Metaprogramming makes code harder to trace and debug.",
          "Type system is absent — no compile-time type checking.",
          "Smaller talent pool than JavaScript or Python."
        ],
        avoid: [
          "CPU-intensive computation — language speed is a real factor.",
          "When the team has no Ruby experience and alternatives are known.",
          "Mobile or embedded development.",
          "When strict type safety is a project requirement."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "php",

      why: {
        before: "Creating dynamic web pages meant CGI scripts — write a C " +
          "or Perl program, have the server fork a process per request, " +
          "and print HTML to stdout.",
        problem: "CGI was slow (process per request) and painful (templating " +
          "in C is not fun). There was no language designed specifically " +
          "for embedding logic inside web pages.",
        shift: "**Embed code in HTML.** PHP started as Personal Home Page " +
          "tools — `<?php ?>` tags inline with HTML. Apache's mod_php " +
          "eliminated the CGI fork, and the shared-nothing request model " +
          "made scaling simple: each request starts fresh, dies fresh, " +
          "leaks nothing. WordPress, Laravel, and Facebook's early " +
          "stack all run on this model."
      },

      num: {
        t: "PHP's execution model vs. other approaches",
        h: ["Aspect", "PHP", "Node.js / Python"],
        r: [
          ["**Request model**", "**shared-nothing, die after each request**", "**persistent process, shared state**"],
          ["Memory leaks", "impossible (process dies)", "a real concern"],
          ["**Scaling**", "**add more workers, each independent**", "**manage shared state carefully**"],
          ["Cold start", "every request boots the app", "mitigated by opcache"],
          ["**Long connections**", "**not native (needs Swoole/ReactPHP)**", "**natural (event loop)**"],
          ["Type system", "gradual types (7.4+, 8.0+)", "dynamic or optional"]
        ],
        n: "PHP's **shared-nothing architecture** is its most underappreciated " +
          "feature. Because each request starts with a clean slate, there " +
          "are no memory leaks, no stale state, and no concurrency bugs " +
          "between requests. The cost is that every request re-bootstraps " +
          "the application — which **OPcache** mitigates by caching " +
          "compiled bytecode in shared memory. Modern PHP (8.0+) is a " +
          "dramatically different language from the PHP of jokes: union " +
          "types, named arguments, attributes, enums, fibers, readonly " +
          "properties, and match expressions. **Laravel** is the framework " +
          "that made PHP respectable again, bringing Eloquent ORM, Blade " +
          "templating, queues, and a testing-first culture. PHP still " +
          "powers **~75% of websites** with a known server-side language " +
          "(mostly WordPress), which makes it impossible to dismiss " +
          "regardless of personal preference."
      },

      miss: [
        {
          w: "PHP is a terrible language.",
          r: "PHP 4 was rough. PHP 8.3 has union types, enums, fibers, " +
            "readonly properties, and a mature ecosystem. Judge the current " +
            "version, not the 2005 version."
        },
        {
          w: "Nobody uses PHP for new projects.",
          r: "Laravel is one of the most popular web frameworks globally. " +
            "Shopify, Wikipedia, Slack (originally), and Etsy run PHP. New " +
            "projects choose it regularly."
        },
        {
          w: "PHP cannot handle real concurrency.",
          r: "**Swoole** and **ReactPHP** provide event-loop and coroutine-" +
            "based concurrency. Laravel Octane runs on Swoole for persistent " +
            "connections and WebSockets."
        },
        {
          w: "The shared-nothing model is wasteful.",
          r: "It eliminates entire classes of bugs (memory leaks, stale " +
            "state, race conditions). OPcache and preloading make the " +
            "bootstrap cost negligible."
        }
      ],

      trade: {
        buys: [
          "Shared-nothing model — no memory leaks, no stale state between requests.",
          "Trivial deployment — upload files, they run.",
          "Largest deployed web language — massive hosting support.",
          "Laravel provides a modern, elegant development experience.",
          "OPcache makes the shared-nothing bootstrap cost negligible."
        ],
        costs: [
          "Historical inconsistencies in the standard library (naming, argument order).",
          "Type system is gradual — runtime errors still possible.",
          "Not suited for long-running processes without Swoole.",
          "Reputation deters some developers and hiring.",
          "Ecosystem is web-centric — weak outside that domain."
        ],
        avoid: [
          "Non-web applications — CLI tools, systems programming, ML.",
          "Real-time applications requiring persistent connections (without Swoole).",
          "When the team has no PHP experience and alternatives are known.",
          "CPU-intensive computation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "c-sharp",

      why: {
        before: "Windows application development meant Win32 C/C++ — raw " +
          "message loops, manual memory management, and GDI for UI. Or " +
          "Visual Basic, which traded power for simplicity.",
        problem: "Java showed that managed code with garbage collection " +
          "was productive and safe. Microsoft needed a response that owned " +
          "the Windows platform and improved on Java's design.",
        shift: "**A managed, type-safe, object-oriented language for the " +
          ".NET runtime.** C# started as Microsoft's answer to Java but " +
          "evolved into one of the most feature-rich languages in existence: " +
          "LINQ, async/await (before any other mainstream language), " +
          "pattern matching, records, and spans for low-level performance."
      },

      num: {
        t: "C# features that set it apart",
        h: ["Feature", "What it does", "Comparable in"],
        r: [
          ["**LINQ**", "**SQL-like queries on any collection**", "**nothing equivalent elsewhere**"],
          ["**async/await**", "**non-blocking I/O without callbacks**", "**copied by JS, Python, Kotlin**"],
          ["Span<T>", "safe stack-allocated views", "Rust slices"],
          ["**Records**", "**immutable value types**", "**Kotlin data class, Java record**"],
          ["Pattern matching", "switch on type and structure", "Rust match, Scala"],
          ["**Source generators**", "**compile-time codegen**", "**Rust macros, Java annotation processors**"]
        ],
        n: "C# was the first mainstream language to ship **async/await** " +
          "(in C# 5, 2012), and JavaScript, Python, Kotlin, and Rust all " +
          "adopted the pattern afterward. **LINQ** (Language-Integrated " +
          "Query) is still unique: it lets you write queries directly in " +
          "the language, and LINQ providers translate them to SQL, XML, " +
          "or in-memory operations transparently. **The .NET runtime** " +
          "(now .NET 8+, cross-platform) has evolved from Windows-only " +
          ".NET Framework to a high-performance, open-source, cross-platform " +
          "runtime. ASP.NET Core regularly tops TechEmpower benchmarks, and " +
          "Unity — the most popular game engine — uses C# as its scripting " +
          "language. The open-sourcing of .NET and C#'s rapid evolution " +
          "(yearly releases) have removed the 'Microsoft lock-in' objection " +
          "that limited its adoption outside Windows shops."
      },

      miss: [
        {
          w: "C# is Windows-only.",
          r: ".NET 6+ is **fully cross-platform** — Linux, macOS, Docker, " +
            "cloud. The Windows-only era ended years ago."
        },
        {
          w: "C# is a Java clone.",
          r: "C# launched with similar syntax but has evolved far beyond Java: " +
            "LINQ, async/await, value types, spans, pattern matching, source " +
            "generators. The languages diverged significantly."
        },
        {
          w: "C# is only for enterprise software.",
          r: "Unity makes C# the most-used game development language. It is " +
            "also used in web APIs, microservices, desktop apps (MAUI), " +
            "and cloud functions."
        },
        {
          w: "Garbage collection means C# cannot be fast.",
          r: ".NET's GC is highly optimised with generational collection " +
            "and server mode. Span<T>, stackalloc, and struct types enable " +
            "zero-allocation paths for hot code."
        }
      ],

      trade: {
        buys: [
          "LINQ for expressive, composable queries on any data source.",
          "async/await is native and deeply integrated into the runtime.",
          "Cross-platform .NET runtime with strong performance.",
          "Unity makes it the default for game scripting.",
          "Rapid language evolution — yearly feature releases."
        ],
        costs: [
          "Historical Windows association limits mindshare in some communities.",
          "Feature-rich language means a large learning surface.",
          "GC pauses exist — not suitable for hard real-time.",
          "Some .NET libraries still assume Windows.",
          "Two ecosystems (.NET Framework vs .NET 6+) cause confusion."
        ],
        avoid: [
          "Systems programming requiring no runtime — use Rust or C.",
          "ML and data science — Python's ecosystem is unmatched.",
          "When the team and infrastructure are entirely in the JVM ecosystem.",
          "Embedded systems with severe memory constraints."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lua",

      why: {
        before: "Applications that needed scripting embedded a full language " +
          "runtime — Python, Tcl, or JavaScript — adding megabytes of " +
          "dependencies and complexity.",
        problem: "Game engines, embedded systems, and network devices need " +
          "a scripting language that is **tiny** (a few hundred KB), " +
          "**fast** (LuaJIT rivals C for some workloads), and **easy to " +
          "embed** in a C/C++ host application.",
        shift: "**A minimal, embeddable scripting language.** Lua is 30 KB " +
          "compiled, has one data structure (the table), and a C API " +
          "designed specifically for embedding. It is the scripting layer " +
          "inside World of Warcraft, Roblox, Redis, Nginx (OpenResty), " +
          "and Neovim."
      },

      num: {
        t: "Lua's minimalism by the numbers",
        h: ["Dimension", "Lua", "Comparable"],
        r: [
          ["**Core size**", "**~30 KB compiled**", "**Python: ~5 MB, Node: ~30 MB**"],
          ["Data structures", "one: the table", "maps, arrays, objects — all tables"],
          ["**LuaJIT speed**", "**within 2–3× of C**", "**faster than V8 for many tasks**"],
          ["Standard library", "minimal", "by design — host provides"],
          ["**1-based indexing**", "**starts at 1**", "**matches human counting**"],
          ["Coroutines", "cooperative, asymmetric", "lightweight concurrency"]
        ],
        n: "Lua's design is **intentionally minimal**: one data structure " +
          "(the table, which is both an array and a hash map), first-class " +
          "functions, coroutines, and metatables for extensibility. " +
          "Everything else is provided by the host application through " +
          "the C API. This makes Lua trivial to embed — you compile a few " +
          "C files into your application and expose your own functions to " +
          "Lua scripts. **LuaJIT** is Mike Pall's JIT compiler for Lua " +
          "5.1 — it is extraordinarily fast, often within 2–3× of optimised " +
          "C, and powers OpenResty (Nginx scripting), Torch (the predecessor " +
          "to PyTorch), and many game engines. The trade-off is that " +
          "LuaJIT is stuck on Lua 5.1 semantics (Lua is now at 5.4), and " +
          "its ARM64 support was long delayed. Lua's **metatables** provide " +
          "a metaprogramming mechanism that lets tables behave like objects, " +
          "with operator overloading, custom indexing, and inheritance-like " +
          "delegation — all without classes in the language."
      },

      miss: [
        {
          w: "Lua is only for games.",
          r: "Lua scripts Redis (EVAL), Nginx (OpenResty), Wireshark, " +
            "Neovim, and embedded systems. Games are visible, but Lua's " +
            "embedding niche is much broader."
        },
        {
          w: "Lua has no data structures.",
          r: "It has **one** — the table — which serves as array, hash map, " +
            "object, module, and namespace. The uniformity is the point."
        },
        {
          w: "LuaJIT is standard Lua.",
          r: "LuaJIT implements Lua 5.1 with extensions (FFI, bit ops). " +
            "Standard Lua is now at 5.4 with integers, generational GC, " +
            "and new features LuaJIT does not support."
        },
        {
          w: "1-based indexing is just a quirk.",
          r: "It affects every loop, every `#` operator call, and every C " +
            "API interaction. It is a constant source of off-by-one errors " +
            "for programmers coming from 0-based languages."
        }
      ],

      trade: {
        buys: [
          "Tiny footprint — embeds anywhere, including firmware.",
          "LuaJIT performance approaches C for many workloads.",
          "C API is simple and well-designed for embedding.",
          "Metatables provide powerful extensibility without complexity.",
          "Coroutines enable cooperative concurrency without threads."
        ],
        costs: [
          "Minimal standard library — you build or bind everything.",
          "1-based indexing is a constant friction for most programmers.",
          "LuaJIT is stuck on 5.1; standard Lua is slower.",
          "Small community compared to Python, JS, or Java.",
          "No built-in module system (until 5.3+) — conventions vary."
        ],
        avoid: [
          "Standalone applications — Lua is designed to be embedded, not standalone.",
          "Large codebases — no type system, no classes, minimal tooling.",
          "When Python or JavaScript embedding is acceptable (and the size cost is fine).",
          "Data science or ML — no ecosystem."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dart",

      why: {
        before: "Cross-platform mobile development meant writing the same " +
          "app twice — once in Swift/Kotlin for iOS/Android — or using " +
          "JavaScript bridges (React Native) that hit performance walls " +
          "at complex animations.",
        problem: "Bridge-based cross-platform frameworks serialize every " +
          "interaction between the app and the platform, creating jank in " +
          "animations and complex UIs.",
        shift: "**Compile to native code and render everything with your own " +
          "engine.** Flutter, powered by Dart, renders every pixel itself " +
          "using Skia/Impeller — no bridge, no platform UI components. " +
          "Dart provides both JIT compilation (hot reload in development) " +
          "and AOT compilation (native performance in production)."
      },

      num: {
        t: "Dart's dual compilation model",
        h: ["Mode", "When used", "Benefit"],
        r: [
          ["**JIT (Dart VM)**", "**development**", "**hot reload — sub-second UI changes**"],
          ["**AOT (native)**", "**production**", "**fast startup, no interpreter overhead**"],
          ["dart2js", "web deployment", "compiles to optimised JavaScript"],
          ["dart2wasm", "web deployment (new)", "compiles to WebAssembly"],
          ["**Sound null safety**", "**always**", "**null errors caught at compile time**"],
          ["Isolates", "concurrency", "no shared memory — message passing"]
        ],
        n: "Dart's **hot reload** is its killer development feature: change " +
          "code, save, and see the result in the running app within a " +
          "second without losing state. This works because the JIT compiler " +
          "patches the running Dart VM. In production, the AOT compiler " +
          "produces native ARM or x64 code with no interpreter overhead. " +
          "**Sound null safety** (Dart 2.12+) means the type system " +
          "**guarantees** a non-nullable variable is never null at runtime — " +
          "unlike TypeScript, where types are erased. **Isolates** are " +
          "Dart's concurrency primitive: like actors, each has its own " +
          "heap and communicates via message passing. There is no shared " +
          "mutable state between isolates, which eliminates data races by " +
          "construction. Dart's fate is tied to Flutter — outside of Flutter, " +
          "Dart has limited adoption, and the language's future depends on " +
          "Flutter's continued growth."
      },

      miss: [
        {
          w: "Dart is a Google experiment that will be abandoned.",
          r: "Flutter is used by Google (Google Pay, Ads), BMW, eBay, and " +
            "Alibaba. Dart is actively developed with yearly releases and " +
            "is Google's primary cross-platform mobile strategy."
        },
        {
          w: "Flutter's custom rendering means it doesn't look native.",
          r: "Flutter's Material and Cupertino widgets replicate platform " +
            "look. For apps with branded UI (most apps), rendering " +
            "independently is an advantage — pixel-perfect control."
        },
        {
          w: "Dart is basically Java.",
          r: "Dart has sound null safety, first-class functions, mixins, " +
            "extension methods, and pattern matching. It shares some syntax " +
            "with Java but is a distinct, more modern language."
        },
        {
          w: "Isolates are the same as threads.",
          r: "Isolates have **separate heaps** — no shared memory. They " +
            "communicate via message passing. This eliminates data races " +
            "but makes sharing large data structures expensive (it must be " +
            "copied or transferred)."
        }
      ],

      trade: {
        buys: [
          "Hot reload for sub-second development iteration.",
          "Sound null safety — runtime null guarantees, not just type hints.",
          "Single codebase for iOS, Android, web, and desktop via Flutter.",
          "AOT compilation gives native performance in production.",
          "Isolates prevent data races by construction."
        ],
        costs: [
          "Tied to Flutter — limited adoption outside that ecosystem.",
          "Smaller community and package ecosystem than JavaScript or Python.",
          "Flutter's custom rendering can miss platform-specific behaviours.",
          "Learning two things at once — Dart and Flutter simultaneously.",
          "Web compilation produces larger bundles than hand-written JavaScript."
        ],
        avoid: [
          "When the project does not use Flutter — there is little reason to choose Dart.",
          "Server-side development — Go, Node, or Python have richer ecosystems.",
          "When native platform fidelity is critical (accessibility, OS integration).",
          "When the team already knows React Native and the project is simple."
        ]
      }
    }

  ]);
})(window.TD);
