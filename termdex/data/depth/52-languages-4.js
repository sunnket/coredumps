/* ==========================================================================
   Depth pass 52 — programming languages batch 4: remaining language terms.

   Garbage collection, memory safety, package management, concurrency
   primitives, and the Node.js runtime. These are the cross-cutting
   concepts that every language implements differently.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "memory-safety",

      why: {
        before: "Programs managed their own memory — allocate with malloc, " +
          "free when done, and hope nothing accesses the freed memory.",
        problem: "Humans cannot reliably track every allocation in a large " +
          "program. Buffer overflows, use-after-free, and double-free " +
          "account for **~70% of critical security vulnerabilities** at " +
          "Microsoft and Google.",
        shift: "**Eliminate memory bugs by construction, not by discipline.** " +
          "Garbage-collected languages (Java, Go, Python) prevent manual " +
          "memory errors entirely. Rust prevents them at compile time " +
          "without a GC. The remaining question is which trade-off you " +
          "accept: GC pauses, or borrow-checker complexity."
      },

      num: {
        t: "Memory safety strategies",
        h: ["Strategy", "Used by", "Trade-off"],
        r: [
          ["**Garbage collection**", "**Java, Go, Python, C#**", "**GC pauses, higher memory usage**"],
          ["**Borrow checker**", "**Rust**", "**steep learning curve, no runtime cost**"],
          ["Reference counting", "Swift (ARC), Python (+ GC)", "deterministic but retain cycles"],
          ["**Manual**", "**C, C++**", "**fastest but unsafe**"],
          ["Region-based", "research languages", "limited applicability"],
          ["**Smart pointers**", "**C++ (unique_ptr, shared_ptr)**", "**safer but not enforced**"]
        ],
        n: "Memory safety is not binary — it is a spectrum. **Garbage " +
          "collection** is the most common solution: the runtime traces " +
          "live objects and frees the rest. The cost is unpredictable " +
          "pauses (though modern collectors like ZGC and Shenandoah keep " +
          "pauses under 1ms for Java). **Rust's borrow checker** proves " +
          "safety at compile time with zero runtime cost, but requires " +
          "restructuring code to satisfy ownership rules. **Reference " +
          "counting** (Swift's ARC) is deterministic — objects are freed " +
          "when the count reaches zero — but **retain cycles** (A → B → A) " +
          "leak unless broken with weak references. C++ offers smart " +
          "pointers as a convention, but nothing prevents you from using " +
          "raw pointers alongside them. The industry direction is clear: " +
          "every new systems language (Rust, Zig, Vale) prioritises memory " +
          "safety, and even the US government (NSA, CISA) now recommends " +
          "memory-safe languages."
      },

      miss: [
        {
          w: "Garbage collection solves all memory problems.",
          r: "It prevents invalid access but not **logical leaks** — objects " +
            "that are technically reachable but no longer needed. Unbounded " +
            "caches and forgotten event listeners leak in GC languages."
        },
        {
          w: "Memory-safe languages are always slower.",
          r: "Java matches C++ in steady-state throughput. Rust has zero " +
            "runtime memory safety overhead. The performance cost is in " +
            "GC pauses or developer time fighting the borrow checker — " +
            "not in the generated code."
        },
        {
          w: "unsafe in Rust means it is as bad as C.",
          r: "`unsafe` blocks are **scoped, auditable, and rare**. The " +
            "surrounding safe code still has guarantees. It is not 'C mode' " +
            "— it is a controlled escape hatch."
        },
        {
          w: "Careful coding prevents memory bugs in C.",
          r: "Decades of CVEs from the world's best C programmers prove " +
            "otherwise. The issue is structural, not about skill."
        }
      ],

      trade: {
        buys: [
          "Eliminates buffer overflows, use-after-free, and double-free.",
          "Removes ~70% of critical security vulnerabilities.",
          "Allows less experienced programmers to write safer code.",
          "Reduces debugging and security audit costs.",
          "Enables safer concurrent programming."
        ],
        costs: [
          "GC: unpredictable pauses and higher memory usage.",
          "Borrow checker: steep learning curve and code restructuring.",
          "ARC: retain cycles must be manually broken.",
          "Some valid patterns become harder to express.",
          "Performance-critical code may need escape hatches."
        ],
        avoid: [
          "The question is which strategy to use, not whether to use one. " +
            "Manual memory management is appropriate only for embedded " +
            "firmware, kernel code, and performance-critical hot paths " +
            "where every alternative has been evaluated."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "package-manager",

      why: {
        before: "Using someone else's code meant downloading a tarball, " +
          "extracting it, putting the files in the right place, and hoping " +
          "the versions of its dependencies were compatible with yours.",
        problem: "Manual dependency management does not scale. A project " +
          "with 50 dependencies, each with their own dependencies, creates " +
          "a **dependency graph** that no human can resolve manually.",
        shift: "**Automate dependency resolution, downloading, and versioning.** " +
          "A package manager reads a manifest (package.json, Cargo.toml, " +
          "requirements.txt), resolves compatible versions, downloads them, " +
          "and makes them available to the build."
      },

      num: {
        t: "Major package managers and their ecosystems",
        h: ["Manager", "Language", "Registry"],
        r: [
          ["**npm / yarn / pnpm**", "**JavaScript**", "**npmjs.com (~3M packages)**"],
          ["**pip / uv**", "**Python**", "**PyPI (~500K packages)**"],
          ["**Cargo**", "**Rust**", "**crates.io (~140K crates)**"],
          ["Maven / Gradle", "Java / Kotlin", "Maven Central"],
          ["**NuGet**", "**C#**", "**nuget.org**"],
          ["Go modules", "Go", "proxy.golang.org"],
          ["RubyGems", "Ruby", "rubygems.org"],
          ["Composer", "PHP", "packagist.org"]
        ],
        n: "The **lockfile** is the most important artefact a package " +
          "manager produces. `package-lock.json`, `Cargo.lock`, " +
          "`poetry.lock` — these pin the exact version of every dependency " +
          "(and transitive dependency) so that builds are **reproducible**. " +
          "Without a lockfile, running `npm install` on two machines can " +
          "produce different results if a dependency published a new " +
          "version between installs. **Commit the lockfile.** The other " +
          "critical concept is **semantic versioning** (semver): `^1.2.3` " +
          "means any compatible version ≥1.2.3 and <2.0.0. The assumption " +
          "is that major versions break compatibility, minors add features, " +
          "and patches fix bugs — but not all packages follow this " +
          "correctly, which is why lockfiles exist. **Supply chain " +
          "attacks** — malicious code in published packages — are a " +
          "growing threat. Tools like `npm audit`, `cargo audit`, and " +
          "Dependabot scan for known vulnerabilities, but they cannot " +
          "catch novel attacks."
      },

      miss: [
        {
          w: "Lockfiles are optional.",
          r: "Without a lockfile, builds are **not reproducible**. A patch " +
            "release of a transitive dependency can break your build on " +
            "Tuesday when it worked on Monday."
        },
        {
          w: "Semantic versioning guarantees compatibility.",
          r: "Semver is a **convention**, not a guarantee. Packages routinely " +
            "introduce breaking changes in minor or patch releases. The " +
            "lockfile is your real guarantee."
        },
        {
          w: "More dependencies are fine as long as each is small.",
          r: "Each dependency is a **trust decision** and a potential attack " +
            "surface. The left-pad incident showed that a single trivial " +
            "package being unpublished can break thousands of builds."
        },
        {
          w: "npm and pip work the same way.",
          r: "npm installs into a project-local `node_modules`. pip installs " +
            "globally by default (use a venv). Cargo downloads and caches " +
            "globally but builds per-project. The models differ significantly."
        }
      ],

      trade: {
        buys: [
          "Automates dependency resolution and downloading.",
          "Lockfiles make builds reproducible.",
          "Security scanning catches known vulnerable packages.",
          "Version constraints express compatibility requirements.",
          "Transitive dependencies are resolved automatically."
        ],
        costs: [
          "Large dependency trees increase attack surface.",
          "Version conflicts (dependency hell) are hard to resolve.",
          "Network dependency — builds fail without registry access.",
          "Bloated node_modules / site-packages are common.",
          "Supply chain attacks target package registries."
        ],
        avoid: [
          "Never avoid using a package manager — managing dependencies " +
            "manually is strictly worse. The choice is which manager, not " +
            "whether to use one."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "node-js",

      why: {
        before: "JavaScript ran only in browsers. Server-side code meant " +
          "a different language — Java, PHP, Python, Ruby — and a different " +
          "mental model.",
        problem: "Full-stack teams needed two languages, two toolchains, two " +
          "dependency ecosystems. Data validation was written twice. Types " +
          "were defined twice.",
        shift: "**Run JavaScript on the server.** Node.js embeds V8 " +
          "(Chrome's JS engine) in a runtime with file system, network, " +
          "and process APIs. One language for front end and back end, one " +
          "team, one set of shared types and validation logic."
      },

      num: {
        t: "Node.js architecture",
        h: ["Component", "What it does", "Key detail"],
        r: [
          ["**V8**", "**JIT-compiles JavaScript**", "**same engine as Chrome**"],
          ["**libuv**", "**async I/O event loop**", "**cross-platform, handles file/network/DNS**"],
          ["Event loop", "drains callback queue", "single-threaded main loop"],
          ["**Worker threads**", "**CPU-bound parallelism**", "**separate V8 isolates, message passing**"],
          ["**npm**", "**package manager**", "**largest package registry in existence**"],
          ["Streams", "process data chunk by chunk", "memory-efficient for large files"]
        ],
        n: "Node's **event loop** (powered by libuv) is the reason a single " +
          "thread can handle thousands of concurrent connections: I/O " +
          "operations are non-blocking and push callbacks onto a queue. The " +
          "main thread never waits — it just drains the queue. This model " +
          "excels at **I/O-heavy, connection-heavy** workloads (APIs, " +
          "proxies, real-time apps) and struggles with **CPU-heavy** " +
          "workloads (image processing, compression) because a long " +
          "computation blocks the loop. **Worker threads** (added in " +
          "Node 10) solve this by running CPU work on separate threads with " +
          "separate V8 isolates. Node's ecosystem has fragmented into " +
          "alternatives: **Deno** (secure by default, TypeScript native, " +
          "by Node's original creator) and **Bun** (faster runtime, " +
          "built-in bundler and test runner). Whether they will displace " +
          "Node is uncertain; Node's installed base is enormous."
      },

      miss: [
        {
          w: "Node.js is single-threaded and therefore slow.",
          r: "It is single-threaded for **JavaScript execution**, but I/O " +
            "runs on a thread pool in libuv. For I/O-bound workloads " +
            "(most web servers), one thread handling thousands of " +
            "connections is faster than one-thread-per-connection models."
        },
        {
          w: "Node.js is only for web servers.",
          r: "Node runs CLI tools (webpack, eslint), desktop apps (Electron/ " +
            "VS Code), serverless functions, build scripts, and streaming " +
            "data processors."
        },
        {
          w: "Deno and Bun have replaced Node.",
          r: "Node has billions of downloads per week, thousands of " +
            "production deployments, and continues to release actively. " +
            "Deno and Bun are alternatives, not replacements — yet."
        },
        {
          w: "Every npm package is safe to use.",
          r: "npm has had supply chain attacks, typosquatting, and malicious " +
            "packages. Audit dependencies, minimise the tree, and use " +
            "lockfiles."
        }
      ],

      trade: {
        buys: [
          "One language for front end and back end.",
          "Non-blocking I/O handles high concurrency efficiently.",
          "npm is the largest package ecosystem.",
          "V8 JIT compilation makes JavaScript surprisingly fast.",
          "Streaming APIs handle large data without loading it all in memory."
        ],
        costs: [
          "CPU-bound work blocks the event loop.",
          "Callback/promise error handling can miss errors silently.",
          "npm dependency trees can be enormous and fragile.",
          "Single-threaded model requires careful architecture.",
          "Ecosystem churn — frameworks and tools change frequently."
        ],
        avoid: [
          "CPU-intensive computation — image processing, ML inference.",
          "When type safety is critical and the team prefers a compiled language.",
          "Hard real-time systems.",
          "When the team does not know JavaScript well."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
    {
      slug: "scripting-language",

      why: {
        before: "Writing any program meant compilation — a multi-step " +
          "process before you could see results.",
        problem: "System administration, file processing, and automation " +
          "tasks need quick, disposable programs. A full compiled language " +
          "is too heavy for a 10-line file renamer.",
        shift: "**Languages optimised for writing short programs quickly.** " +
          "Scripting languages (Python, Bash, Perl, Ruby, JavaScript) are " +
          "interpreted (no build step), have high-level abstractions " +
          "(strings, regex, file I/O built in), and prioritise developer " +
          "time over execution time."
      },

      num: {
        t: "Scripting languages by domain",
        h: ["Language", "Primary scripting domain", "Strength"],
        r: [
          ["**Bash / sh**", "**system administration, CI/CD**", "**pipes, process control**"],
          ["**Python**", "**automation, data, ML glue**", "**readability, ecosystem**"],
          ["Perl", "text processing", "regex integration"],
          ["**PowerShell**", "**Windows administration**", "**object pipeline, .NET access**"],
          ["**Lua**", "**embedded scripting (games, tools)**", "**tiny footprint, fast**"],
          ["awk / sed", "text transformation", "stream processing"]
        ],
        n: "The boundary between 'scripting language' and 'programming " +
          "language' is marketing, not technical. Python is a 'scripting " +
          "language' that runs Instagram. Ruby is a 'scripting language' " +
          "that runs GitHub. The distinction mattered in the 1990s when " +
          "interpreted languages were orders of magnitude slower than " +
          "compiled ones; JIT compilation has narrowed the gap. The useful " +
          "definition today is **a language whose typical workflow has no " +
          "explicit build step** — you save the file and run it. **Shell " +
          "scripting** (Bash) is the one truly distinct category: it " +
          "excels at orchestrating processes, piping output between " +
          "programs, and running commands — but it is terrible at anything " +
          "involving data structures, error handling, or string " +
          "manipulation. The rule of thumb: **if a Bash script exceeds " +
          "~50 lines, rewrite it in Python.**"
      },

      miss: [
        {
          w: "Scripting languages are not real programming languages.",
          r: "They are Turing-complete, run production systems, and are used " +
            "to build applications of arbitrary complexity. The label is " +
            "about workflow (no build step), not capability."
        },
        {
          w: "Bash is fine for complex automation.",
          r: "Bash has no data structures, terrible error handling (`set -e` " +
            "is unreliable), whitespace-sensitive quoting, and platform " +
            "inconsistencies. Beyond simple pipelines, use Python."
        },
        {
          w: "Scripting languages cannot be fast.",
          r: "LuaJIT rivals C. V8's JIT makes Node.js fast for I/O. Python " +
            "delegates to C libraries. Speed is about architecture, not " +
            "the scripting label."
        },
        {
          w: "You do not need error handling in scripts.",
          r: "A cron job that fails silently at 3am is worse than one that " +
            "fails loudly. Scripts need error handling, logging, and " +
            "non-zero exit codes."
        }
      ],

      trade: {
        buys: [
          "No build step — write and run immediately.",
          "High-level abstractions for common tasks (files, strings, regex).",
          "Fast development cycle for automation and glue code.",
          "Easy to read and maintain for short programs.",
          "Widely available on all platforms."
        ],
        costs: [
          "Slower execution than compiled languages.",
          "Runtime errors instead of compile-time errors.",
          "Scaling scripts into applications often requires rewriting.",
          "Dependency management is less mature (especially for Bash).",
          "Type safety is usually absent."
        ],
        avoid: [
          "Performance-critical systems — use a compiled language.",
          "Large, long-lived applications — use a typed, structured language.",
          "When the script grows beyond 100 lines — consider a real language.",
          "Security-sensitive code where type confusion enables exploits."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
]);
})(window.TD);
