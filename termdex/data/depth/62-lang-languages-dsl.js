/* ==========================================================================
   Depth pass 62 — programming languages batch 7: domain-specific languages,
   markup languages, standard libraries, Bash, PowerShell, MATLAB, F#, VBA.

   From specialized DSLs and Unix shells to numerical engineering and
   embedded office automation: languages shape the problem domains they conquer.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "domain-specific-language",

      why: {
        before: "Specialized computational problems (database querying, text pattern " +
          "matching, UI layouts, cloud infrastructure) were expressed in general-purpose " +
          "languages via awkward API methods and concatenated string literals.",
        problem: "General-Purpose Languages (GPLs) lack the domain vocabulary, " +
          "syntactic conciseness, and semantic constraints required for specialized " +
          "domains, producing verbose, error-prone, and unreadable code.",
        shift: "**Domain-Specific Languages (DSLs): tailor the language to the problem.** " +
          "Sacrifice general-purpose computation (Turing completeness) in exchange for " +
          "extreme expressiveness, safety, and domain alignment (SQL, Regex, HTML, Terraform HCL)."
      },

      num: {
        t: "DSL classifications & real-world architectures",
        h: ["DSL Paradigm", "Mechanism / Implementation", "Prominent Examples", "Primary Advantage"],
        r: [
          ["**External DSL**", "**Custom grammar, independent lexer/parser, separate AST**", "**SQL, Regular Expressions, CSS, Terraform HCL, GraphQL**", "**Total syntax freedom; accessible to domain non-programmers**"],
          ["**Internal / Embedded DSL**", "**Fluent APIs, method chaining, operator overloading in host language**", "**RSpec (Ruby), Gradle (Kotlin/Groovy), SwiftUI (Swift), LINQ (C#)**", "**Leverages host language compiler, IDE tooling, and type checker**"],
          ["**Macro-based DSL**", "**Syntactic code transformation at compile time**", "**Rust `macro_rules!`, Lisp macros, Elixir macros**", "**Zero runtime cost; generates native AST nodes**"],
          ["**Declarative DSL**", "**Describes desired end-state rather than execution steps**", "**HTML, Kubernetes YAML, SQL, Nix**", "**Engine determines optimal execution path; idempotent**"],
          ["**Executable Specification DSL**", "**Human-readable business logic specifications**", "**Gherkin (`Given-When-Then`), Drools Rules**", "**Enables non-technical stakeholders to audit logic**"]
        ],
        n: "Domain-Specific Languages (DSLs) represent the opposite of " +
          "general-purpose computing: instead of building one language " +
          "to solve every problem (like C++ or Python), a DSL is engineered " +
          "to solve **one specific problem with absolute elegance**. DSLs " +
          "are broadly bifurcated into **External DSLs** and **Internal " +
          "(Embedded) DSLs**. An External DSL (such as SQL or GraphQL) has " +
          "its own bespoke grammar, parsed by a custom parser generator " +
          "(like ANTLR or Tree-sitter). The advantage is total freedom: SQL " +
          "reads like natural English set theory (`SELECT name FROM users " +
          "WHERE age > 21`), which a business analyst can read without " +
          "knowing how a B-tree works. An Internal DSL (such as Kotlin's " +
          "HTML builders or Ruby's RSpec) operates inside a host language, " +
          "leveraging higher-order functions, lambdas with receivers, and " +
          "fluent method chaining to create the illusion of a custom language " +
          "while retaining full access to the host compiler, type safety, " +
          "and IDE autocompletion. Crucially, most successful DSLs are " +
          "**intentionally not Turing-complete**: regular expressions and " +
          "CSS cannot enter infinite loops, guaranteeing that execution " +
          "will terminate deterministically."
      },

      miss: [
        {
          w: "All DSLs must be Turing-complete programming languages.",
          r: "Most great DSLs (SQL, CSS, Markdown, Regex) are deliberately non-Turing-complete " +
            "to guarantee termination, security, and static analyzability."
        },
        {
          w: "Building a DSL requires writing an entire compiler and runtime from scratch.",
          r: "Internal DSLs leverage existing host languages (Kotlin, Ruby, Rust, Groovy) " +
            "using fluent builders and macros without writing a standalone parser."
        },
        {
          w: "A DSL is just an ordinary API with a fancy marketing name.",
          r: "A true DSL introduces a structured grammar, specialized vocabulary, " +
            "and domain semantics that fundamentally reflect the mental model of the domain."
        },
        {
          w: "DSLs are only useful for software engineers.",
          r: "DSLs empower domain experts who cannot code: financial quants writing " +
            "pricing formulas, biologists querying genetic markers, and accountants querying SQL."
        }
      ],

      trade: {
        buys: [
          "Extreme expressiveness: complex domain logic expressed in concise, readable syntax.",
          "Empowers non-programmers and domain specialists to collaborate on business logic.",
          "Enables domain-specific static analysis, safety checks, and compiler optimizations.",
          "Reduces boilerplate bugs by eliminating general-purpose language mechanics."
        ],
        costs: [
          "High maintenance overhead for external DSL parsers, syntax highlighters, and language servers.",
          "Language fragmentation: developers must learn separate DSL syntaxes for different subsystems.",
          "Debugging across DSL abstraction boundaries into generated code can be painful.",
          "Risk of 'DSL creep': domain languages organically growing Turing-complete features poorly."
        ],
        avoid: [
          "Inventing a custom external DSL when standard data formats (JSON, YAML) or a clean API suffices.",
          "Adding complex general-purpose programming constructs into purely declarative domain languages.",
          "Building internal DSLs with cryptic operator overloading that mystifies new team members."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "markup-language",

      why: {
        before: "Documents were stored as flat, unformatted plain text files " +
          "or proprietary binary blobs (like early Word files).",
        problem: "Plain text lacked structure, semantics, layout, and hyperlinking, " +
          "while proprietary binary documents could not be parsed cross-platform, " +
          "searched by web engines, or rendered consistently on different display hardware.",
        shift: "**Standardized text markup systems.** Annotate plain text with " +
          "human-readable tags and delimiters that explicitly define document hierarchy, " +
          "semantic relationships, and visual styling without executing computational instructions."
      },

      num: {
        t: "Major markup language families & specifications",
        h: ["Markup Language", "Syntactic Structure", "Primary Purpose", "Standard Specification"],
        r: [
          ["**HTML (HyperText Markup Language)**", "**Angle brackets with closing tags (`<p>...</p>`)**", "**World Wide Web document structure & semantics**", "**W3C / WHATWG HTML Living Standard**"],
          ["**XML (eXtensible Markup Language)**", "**Strict, user-defined tag trees (`<user><id>1</id></user>`)**", "**Enterprise data interchange, configuration, Office docs**", "**W3C XML 1.0 (DTD / XSD validation)**"],
          ["**Markdown**", "**Lightweight human-readable punctuation (`# Heading`, `**bold**`)**", "**Developer documentation, READMEs, chat formatting**", "**CommonMark, GitHub Flavored Markdown (GFM)**"],
          ["**LaTeX**", "**Backslash commands (`\\section{Title}`, `\\frac{a}{b}`)**", "**Academic publishing, complex mathematical typography**", "**Donald Knuth's TeX engine**"],
          ["**SVG (Scalable Vector Graphics)**", "**XML-based 2D vector graphic paths and shapes**", "**Resolution-independent responsive web graphics**", "**W3C SVG specification**"]
        ],
        n: "A Markup Language is fundamentally distinct from a programming " +
          "language: it does not perform calculations, manage memory, or " +
          "control computational loops. Instead, it **annotates content with " +
          "metadata**. The heritage of modern markup traces back to IBM's " +
          "GML (1969) and the ISO standard **SGML (Standard Generalized " +
          "Markup Language, 1986)**. In 1991, Tim Berners-Lee created **HTML** " +
          "by borrowing SGML tag syntax to interconnect scientific papers " +
          "via hyperlinks across the internet. Modern markup follows two " +
          "divergent design philosophies: (1) **Heavyweight Structural " +
          "Markup (HTML, XML)**: uses explicit angle-bracket tag pairs " +
          "(`<element attribute=\"val\">content</element>`). While syntactically " +
          "verbose, it provides rigid hierarchical nesting (the **Document " +
          "Object Model / DOM**) and formal schema validation via XSD. " +
          "(2) **Lightweight Markup (Markdown, AsciiDoc)**: designed by " +
          "John Gruber in 2004 to be instantly readable as plain text without " +
          "rendering. In modern web architecture, the golden rule of markup " +
          "is the **separation of concerns**: HTML provides semantic structure, " +
          "CSS handles visual presentation, and JavaScript controls dynamic behavior."
      },

      miss: [
        {
          w: "HTML is a programming language.",
          r: "HTML is a declarative markup language that annotates document structure. " +
            "It lacks computational control flow, loops, variable assignment, and logic."
        },
        {
          w: "XML is dead and obsolete in modern software engineering.",
          r: "XML remains foundational: it powers SVG graphics, Android layout files, " +
            "Microsoft Office documents (DOCX/XLSX are zipped XML files), and enterprise SOAP APIs."
        },
        {
          w: "Markdown is a single universally standardized specification.",
          r: "Markdown has dozens of competing dialects with conflicting parsing rules. " +
            "CommonMark and GitHub Flavored Markdown (GFM) exist to standardize behavior."
        },
        {
          w: "Markup files can execute arbitrary computational code natively.",
          r: "Markup is purely passive structural data. Rendering or execution requires " +
            "a downstream engine (like a web browser or LaTeX compiler)."
        }
      ],

      trade: {
        buys: [
          "Human-readable, plain-text format easily tracked in version control (Git).",
          "Universal cross-platform interoperability across any operating system or device.",
          "Strict separation of semantic content from visual presentation (CSS/LaTeX).",
          "Enables search engines (SEO) and screen readers (accessibility) to parse content structure."
        ],
        costs: [
          "Syntactic verbosity: closing tags in XML and HTML introduce heavy visual clutter.",
          "Parsing ambiguities in lightweight markup (Markdown edge cases across parsers).",
          "Lacks native computational logic: cannot evaluate formulas without external templating engines.",
          "Vulnerability to Cross-Site Scripting (XSS) if unescaped user markup is rendered in browsers."
        ],
        avoid: [
          "Using heavyweight XML for lightweight REST API payloads (use JSON instead).",
          "Rendering raw, unsanitized user-submitted HTML directly in web pages.",
          "Over-complicating plain documentation with excessive nested markup tags."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "standard-library",

      why: {
        before: "Every developer had to write their own data structures (hash tables, " +
          "dynamic arrays), string manipulation routines, mathematical functions, " +
          "and file I/O primitives from scratch.",
        problem: "Re-inventing the wheel wasted thousands of engineering hours, " +
          "fragmented language ecosystems, and introduced rampant memory bugs, " +
          "buffer overflows, and algorithmic security vulnerabilities.",
        shift: "**The Standard Library: ship a battle-tested core toolset.** " +
          "Bundle every language distribution with standardized, highly optimized, " +
          "and mathematically verified implementations of foundational data structures, " +
          "system I/O, networking, and concurrency."
      },

      num: {
        t: "Standard library architectural philosophies across major languages",
        h: ["Language", "Design Philosophy", "Prominent Standard Modules", "Ecosystem Impact"],
        r: [
          ["**Python**", "**'Batteries Included'**", "`json`, `sqlite3`, `math`, `asyncio`, `csv`, `re`", "**Productive immediately without third-party package managers**"],
          ["**Go**", "**Production-grade Cloud Toolset**", "`net/http`, `crypto/tls`, `encoding/json`, `sync`", "**High-performance web services built with zero third-party dependencies**"],
          ["**Rust**", "**Lean & Modular**", "`std::collections`, `std::sync`, `std::fs`", "**Small core stdlib; ecosystem innovates rapidly via crates.io**"],
          ["**JavaScript / Node**", "**Minimalist Core**", "`fs`, `path`, `http`, `crypto` (historical browser bareness)", "**Massive reliance on npm (leading to `left-pad` supply-chain crises)**"],
          ["**Java**", "**Enterprise Comprehensive**", "`java.util`, `java.io`, `java.net`, `java.time`, `java.nio`", "**Near-zero breaking changes across 30 years of enterprise deployment**"],
          ["**C**", "**Minimal Systems CRT**", "`stdio.h`, `stdlib.h`, `string.h`, `math.h`", "**Ubiquitous across microcontrollers; notorious for unsafe string functions**"]
        ],
        n: "The Standard Library is the intellectual and cultural backbone " +
          "of any programming language. It establishes the **canonical " +
          "idioms** and data representations shared by all developers in " +
          "that ecosystem. Language designers balance two competing " +
          "philosophies: (1) **The 'Batteries-Included' Philosophy (Python, Go)**: " +
          "the language distribution arrives fully equipped. In Go, the " +
          "`net/http` standard package implements an enterprise-grade, " +
          "high-throughput HTTP/2 web server and TLS stack with zero external " +
          "dependencies. In Python, standard modules like `sqlite3`, `json`, " +
          "and `csv` allow building production data pipelines on day one. " +
          "(2) **The Lean/Modular Philosophy (Rust, modern JavaScript)**: " +
          "the core standard library is kept intentionally tiny, focusing " +
          "only on primitive types, memory allocation, and basic I/O. Higher-level " +
          "capabilities (like HTTP servers or regex engines) are developed " +
          "as independent open-source packages. The reason for the lean " +
          "approach is **the curse of backward compatibility**: once an API " +
          "enters a standard library, it can almost never be removed or " +
          "broken without destroying thousands of corporate codebases (as " +
          "seen with Java's legacy `Date` and `Vector` classes)."
      },

      miss: [
        {
          w: "Third-party open-source packages are always faster and better than the standard library.",
          r: "Standard library code is written by core language architects, tuned " +
            "with intimate knowledge of compiler internals, and battle-tested across billions of executions."
        },
        {
          w: "Standard libraries can be easily refactored and updated in new releases.",
          r: "Standard libraries are strictly bound by backward compatibility contracts. " +
            "Flawed API designs (e.g. Python's `urllib2`) persist for decades to avoid breaking code."
        },
        {
          w: "A minimal standard library is always superior to a large standard library.",
          r: "JavaScript's historically minimal standard library forced developers to install " +
            "micro-packages like `left-pad` and `is-number`, creating severe supply-chain attack vulnerabilities."
        },
        {
          w: "The C standard library (`libc`) provides memory-safe string functions.",
          r: "Functions like `strcpy` and `gets` do not check buffer bounds and are " +
            "responsible for decades of security vulnerabilities; modern code mandates safe alternatives."
        }
      ],

      trade: {
        buys: [
          "Instant out-of-the-box developer productivity with zero dependency installation.",
          "Immunity from supply-chain hijacking and third-party package abandonment.",
          "Establishes a universal, shared dialect across the entire global developer community.",
          "Optimized directly against compiler internals and operating system system calls."
        ],
        costs: [
          "Standard library APIs freeze in time and cannot innovate as fast as external packages.",
          "Bloats language installation footprint in 'batteries-included' languages.",
          "Legacy architectural mistakes remain permanent scars due to backward compatibility.",
          "Risk of vendor lock-in to language-specific standard paradigms."
        ],
        avoid: [
          "Importing heavy third-party dependencies for trivial operations already in the standard library.",
          "Relying on deprecated standard library functions with known security flaws.",
          "Expecting rapid API innovations in core standard library modules."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bash",

      why: {
        before: "Interacting with Unix systems required either tedious manual terminal " +
          "typing or writing, compiling, and linking C programs for simple administration.",
        problem: "The original Bourne Shell (`sh`) was limited in interactive usability, " +
          "lacking command history, tab completion, arrays, process substitution, and arithmetic.",
        shift: "**Bourne-Again Shell (Bash): the ubiquitous Unix shell and command language.** " +
          "Brian Fox created Bash for the GNU Project, combining an interactive terminal " +
          "command interpreter with a Turing-complete scripting language to automate Unix workflows."
      },

      num: {
        t: "Bash scripting primitives & defensive programming controls",
        h: ["Construct / Command", "Mechanism", "Operational Purpose", "Defensive Rule"],
        r: [
          ["`set -euo pipefail`", "**Strict shell safety modes**", "**Aborts on error, uninitialized vars, or pipe fails**", "**Mandatory header for all production scripts**"],
          ["`|` (Pipe)", "**Anonymous kernel memory ring buffer**", "**Streams `stdout` of Process A to `stdin` of Process B**", "**Enables composable Unix pipeline architecture**"],
          ["`[[ ... ]]`", "**Bash conditional evaluation keyword**", "**Supports regex (`=~`), logical `&&`/`||`, avoids word splitting**", "**Always prefer over legacy POSIX `[ ... ]`**"],
          ["`\"$var\"` (Quoting)", "**Double-quoting variable expansions**", "**Prevents field splitting and glob wildcard expansion**", "**Always double-quote variables to prevent command injection**"],
          ["`<()` (Process Sub)", "**Creates anonymous FIFO / `/dev/fd/` pipe**", "**Passes output of a command as a file argument**", "**`diff <(cmd1) <(cmd2)` without temporary files**"],
          ["`$()` (Command Sub)", "**Spawns subshell and captures stdout**", "**Assigns command output to variable**", "**Replaces archaic backticks (`` `cmd` ``)**"]
        ],
        n: "Bash is the undisputed glue of the global computing infrastructure, " +
          "powering Linux servers, Docker container entrypoints, CI/CD runners, " +
          "and cloud orchestration scripts. Its power stems directly from the " +
          "**Unix Philosophy: write programs that do one thing well, and write " +
          "programs to work together**. The Unix pipe (`|`) connects the " +
          "standard output (`stdout`, file descriptor 1) of one process " +
          "directly to the standard input (`stdin`, file descriptor 0) of " +
          "another process via an in-memory kernel buffer, streaming data " +
          "with zero temporary disk files. However, Bash is notorious for " +
          "**dangerous default behaviors**: by default, if a command fails, " +
          "Bash prints an error and blithely continues executing the next line! " +
          "If a script contains `cd /var/app; rm -rf *` and the `cd` fails, " +
          "Bash will execute `rm -rf *` in the root directory. Therefore, " +
          "every production Bash script must start with the non-negotiable " +
          "defensive header: **`set -euo pipefail`** (`-e`: exit immediately " +
          "on error; `-u`: treat unset variables as errors; `-o pipefail`: " +
          "fail if any command in a pipeline fails). Furthermore, variables " +
          "must always be double-quoted (`\"$var\"`) to prevent **word splitting " +
          "and path expansion**, which are notorious vectors for arbitrary " +
          "command injection."
      },

      miss: [
        {
          w: "Bash is just a simple terminal prompt, not a real programming language.",
          r: "Bash is a full Turing-complete programming language featuring functions, " +
            "associative arrays, conditional logic, arithmetic evaluation, and signal trapping."
        },
        {
          w: "Writing Bash scripts without `set -e` is standard practice.",
          r: "Omitting `set -e` causes scripts to ignore errors and continue executing " +
            "subsequent destructive commands. `set -euo pipefail` is mandatory."
        },
        {
          w: "Legacy `[ ... ]` and modern `[[ ... ]]` are interchangeable in Bash.",
          r: "`[` is a legacy external command (`test`) subject to word splitting. " +
            "`[[` is a built-in Bash keyword supporting regex, logical operators, and safe parsing."
        },
        {
          w: "Bash scripts are completely safe from injection attacks.",
          r: "Unquoted variables (`$var`) undergo word splitting and glob expansion. " +
            "Passing unsanitized user inputs into unquoted variables allows remote command execution."
        }
      ],

      trade: {
        buys: [
          "Pre-installed on virtually every Linux distribution, macOS terminal, and container image.",
          "Unmatched efficiency for composing external CLI tools (`curl`, `jq`, `grep`, `docker`).",
          "Zero runtime dependencies: execute immediate systems automation without installing interpreters.",
          "Native control over Unix processes, file descriptors, signals, and environment variables."
        ],
        costs: [
          "Cryptic, error-prone syntax with dozens of edge-case quoting and expansion rules.",
          "Fragile error handling unless strict defensive flags (`set -euo pipefail`) are enforced.",
          "Very poor performance for intensive computation, string parsing, or math.",
          "Lacks structured object data types: everything is a string of text bytes."
        ],
        avoid: [
          "Writing complex business applications or large scripts exceeding 200–300 lines (use Python/Go).",
          "High-performance numerical calculations or heavy multi-threading.",
          "Parsing complex nested JSON or XML structures without external tools like `jq`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "powershell",

      why: {
        before: "Unix shells (sh, bash) passed all pipeline data as flat, unstructured " +
          "streams of plain text, forcing engineers to write fragile text-scraping " +
          "parsers (`grep`, `awk`, `sed`, regex) that broke whenever formatting shifted.",
        problem: "Windows systems administration lacked a unified command-line automation " +
          "tool, and text scraping was brittle, inefficient, and error-prone across enterprise fleets.",
        shift: "**An object-oriented shell and scripting language.** Jeffrey Snover " +
          "created PowerShell to pass live, structured .NET objects through the pipeline, " +
          "allowing commands to access typed properties and methods directly without text parsing."
      },

      num: {
        t: "PowerShell core architecture & object pipeline features",
        h: ["Architecture Feature", "Mechanism", "Operational Purpose", "Enterprise Value"],
        r: [
          ["**Object Pipeline**", "**Pipes pass live `System.Object` .NET instances**", "**Eliminates string scraping (`grep`/`awk`)**", "**Direct access to `$proc.CPU`, `$user.Email`**"],
          ["**Cmdlets (`Verb-Noun`)**", "**Standardized command syntax (e.g. `Get-Service`)**", "**Consistent, discoverable API conventions**", "**Unified cognitive model across all modules**"],
          ["**Cross-Platform Core (PS 7+)**", "**Open-source runtime built on modern .NET Core**", "**Automates Linux, macOS, and Windows**", "**Universal cloud orchestration for AWS and Azure**"],
          ["**PowerShell Remoting**", "**WS-Man / SSH protocol for remote execution**", "**Run scripts concurrently across thousands of nodes**", "**Massive enterprise fleet management**"],
          ["**Script Block Logging**", "**Logs full de-obfuscated script content to event log**", "**Deep security auditing and threat detection**", "**Defeats encoded malicious PowerShell payloads**"]
        ],
        n: "PowerShell is a paradigm shift in command-line computing. The " +
          "fundamental innovation of PowerShell is the **Object Pipeline**. " +
          "In a traditional Unix shell, running `ps -ef | grep httpd` outputs " +
          "a raw stream of ASCII characters; to extract the Process ID, you " +
          "must carefully parse spaces and column offsets using `awk '{print $2}'`. " +
          "If the utility changes its spacing or adds a column, the script " +
          "breaks. In PowerShell, running `Get-Process | Where-Object CPU -gt " +
          "10 | Stop-Process` does not pass text: the pipeline transmits " +
          "live, typed **`System.Diagnostics.Process` .NET objects**. " +
          "Downstream commands can directly inspect properties (`$_.CPU`, " +
          "`$_.WorkingSet64`, `$_.StartTime`) or invoke methods directly " +
          "on the object. PowerShell strictly enforces a **Verb-Noun naming " +
          "convention** (`Get-`, `Set-`, `New-`, `Remove-`, `Start-`), creating " +
          "unmatched API discoverability through `Get-Command` and `Get-Help`. " +
          "While originally a proprietary Windows tool, modern **PowerShell " +
          "(PowerShell Core / PS 7+)** is fully open-source, cross-platform, " +
          "and runs natively on Linux and macOS, serving as a primary " +
          "automation engine for cloud infrastructure (Azure, AWS, Microsoft 365)."
      },

      miss: [
        {
          w: "PowerShell is only for Windows systems administration.",
          r: "Modern PowerShell (PS 7+) is open-source and cross-platform, running on " +
            "Linux, macOS, and Docker to manage cloud resources and Kubernetes."
        },
        {
          w: "PowerShell is just a newer version of `cmd.exe`.",
          r: "`cmd.exe` is a primitive 1980s text shell. PowerShell is a fully " +
            "object-oriented programming language and shell hosting the full .NET CLR."
        },
        {
          w: "Passing objects through pipelines makes PowerShell significantly slower than Bash.",
          r: "Passing objects avoids the severe CPU overhead of converting data to text, " +
            "spawning subshells, and running regex parsers (`grep`/`awk`) on every pipeline step."
        },
        {
          w: "PowerShell is inherently insecure and a hacker's tool.",
          r: "PowerShell provides the most advanced enterprise security auditing in the industry: " +
            "Script Block Logging, Constrained Language Mode, and Antimalware Scan Interface (AMSI)."
        }
      ],

      trade: {
        buys: [
          "Object pipeline eliminates brittle text parsing and regex scraping.",
          "Seamless access to the entire high-performance .NET class library.",
          "Consistent `Verb-Noun` syntax makes commands intuitive and self-documenting.",
          "Built-in enterprise remoting across thousands of servers simultaneously."
        ],
        costs: [
          "More verbose command and variable syntax than compact Unix shell aliases.",
          "Higher memory and startup footprint than lightweight C-based Bash shells.",
          "Steeper initial learning curve for engineers accustomed to plain text streams.",
          "Cross-platform scripts must account for differences in underlying OS filesystems."
        ],
        avoid: [
          "Ultra-lightweight Docker containers where single-digit megabyte image sizes are mandatory.",
          "High-frequency low-latency mathematical computation.",
          "Writing scripts using cryptic short aliases (`%`, `?`) in production code (use full cmdlet names)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "matlab",

      why: {
        before: "Scientists and engineers implementing numerical matrix calculations " +
          "had to write multi-page Fortran or C programs manually managing linear algebra " +
          "libraries (LINPACK, EISPACK).",
        problem: "Writing and debugging linear algebra algorithms in compiled, low-level " +
          "languages created immense friction, slowing down scientific exploration, signal " +
          "processing engineering, and control systems design.",
        shift: "**Matrix Laboratory (MATLAB): matrix-first numerical computing.** " +
          "Cleve Moler created MATLAB to treat the multi-dimensional matrix as a " +
          "fundamental primitive data type, backed by optimized BLAS/LAPACK libraries " +
          "and interactive graphical visualization."
      },

      num: {
        t: "MATLAB core engineering domains & simulation toolboxes",
        h: ["Toolbox / Environment", "Core Capability", "Industry Domain", "Hardware Target"],
        r: [
          ["**Matrix Computing Engine**", "**Vectorized matrix operations and linear algebra**", "**Academic research, physics, mathematics**", "**Multi-core CPU (Intel MKL), GPU acceleration**"],
          ["**Simulink**", "**Block-diagram visual dynamic simulation & model-based design**", "**Aerospace, automotive, robotics, energy grids**", "**Hardware-in-the-loop (HIL) testing rigs**"],
          ["**Embedded Coder**", "**Compiles Simulink models directly into optimized C/C++**", "**Automotive ECUs, aircraft flight controllers**", "**MISRA-C compliant automotive microcontrollers**"],
          ["**Signal Processing & DSP**", "**Filter design, spectral analysis, wavelets**", "**Telecommunications, audio processing, radar**", "**FPGA and DSP chips**"],
          ["**Control System Toolbox**", "**Bode plots, root locus, PID tuning, state-space models**", "**Industrial automation, mechanical engineering**", "**Actuators, servos, industrial controllers**"]
        ],
        n: "MATLAB is a numerical computing environment that fundamentally " +
          "re-engineers programming around **the matrix**. In MATLAB, every " +
          "variable—even a single scalar number like `5`—is internally treated " +
          "as a 1x1 matrix. Operations are vectorized by default: adding two " +
          "matrices `C = A + B` or performing matrix multiplication `C = A * B` " +
          "executes optimized low-level machine code calling **Intel MKL " +
          "(Math Kernel Library)** and **LAPACK/BLAS**, saturating SIMD " +
          "vector units across CPU cores. The absolute industrial standard " +
          "of MATLAB is **Simulink**: a graphical block-diagram environment " +
          "for **Model-Based Design**. In aerospace and automotive engineering, " +
          "engineers model flight controllers, anti-lock braking systems (ABS), " +
          "and electric vehicle powertrains inside Simulink. Through **Embedded " +
          "Coder**, the system compiles the visual simulation diagram directly " +
          "into certified, safety-critical **MISRA-C code** that is flashed " +
          "onto physical microcontrollers inside commercial airliners and " +
          "cars. While the data science and deep learning world has largely " +
          "migrated to open-source Python (NumPy, PyTorch), MATLAB and Simulink " +
          "remain deeply entrenched in mission-critical hardware engineering."
      },

      miss: [
        {
          w: "MATLAB is just an expensive graphing calculator for university students.",
          r: "MATLAB and Simulink are the industrial standard for model-based engineering, " +
            "powering flight control systems in Boeing/Airbus and electronic controls in modern cars."
        },
        {
          w: "Writing explicit for-loops in MATLAB is good programming practice.",
          r: "Explicit for-loops in MATLAB are notorious performance anti-patterns. " +
            "High performance requires vectorization and broadcasting across entire matrix arrays."
        },
        {
          w: "Python NumPy has completely replaced MATLAB across all engineering sectors.",
          r: "While Python dominates web data science and AI research, MATLAB and Simulink " +
            "remain unrivaled in control theory, digital signal processing (DSP), and embedded code generation."
        },
        {
          w: "MATLAB models cannot run on embedded microcontrollers.",
          r: "MATLAB's Embedded Coder compiles Simulink diagrams directly into ANSI C/C++ " +
            "optimized for automotive and aerospace embedded chips."
        }
      ],

      trade: {
        buys: [
          "Peerless verified numerical toolboxes for signal processing, control theory, and aerospace.",
          "Simulink visual modeling for hardware-in-the-loop (HIL) simulation.",
          "Automated C/C++ code generation deploying models directly to physical microcontrollers.",
          "Exceptional interactive visualization, plotting, and 3D data exploration."
        ],
        costs: [
          "Extremely expensive proprietary commercial licensing costs.",
          "Closed-source proprietary ecosystem that restricts community sharing and open science.",
          "Slower general-purpose programming performance outside pure vectorized matrix math.",
          "Language quirks: 1-based indexing and unorthodox function scoping rules."
        ],
        avoid: [
          "Building general-purpose web applications, REST APIs, or cloud microservices.",
          "Budget-constrained open-source scientific research (use Python, NumPy, or Julia instead).",
          "String-heavy text processing or database transaction management."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
    {
      slug: "vba",

      why: {
        before: "Automating office tasks (spreadsheets, accounting reports, document " +
          "formatting) required building external C++ or COM applications communicating " +
          "over complex Windows OLE interfaces.",
        problem: "Financial analysts, accountants, and office managers were stranded " +
          "with repetitive, manual spreadsheet data entry, formula updates, and manual " +
          "report consolidation across hundreds of Excel files.",
        shift: "**Visual Basic for Applications (VBA): macros embedded directly inside Office.** " +
          "Embed a full event-driven scripting language and macro recorder directly inside " +
          "Microsoft Excel, Word, and Access, providing direct programmatic access to document object models."
      },

      num: {
        t: "VBA architecture & Excel object model hierarchy",
        h: ["Object Model Level", "Key Objects", "Operational Responsibility", "Performance Pitfall"],
        r: [
          ["**Application**", "`Application`", "**Controls Excel environment (screen updating, calculation mode)**", "**Failing to disable `ScreenUpdating` slows macros 10x**"],
          ["**Workbook**", "`Workbooks`, `ActiveWorkbook`", "**File management, saving, opening workbooks**", "**Iterating across workbooks without closing creates memory leaks**"],
          ["**Worksheet**", "`Worksheets`, `ActiveSheet`", "**Sheet-level events (`Worksheet_Change`), protection**", "**Relying on `ActiveSheet` instead of explicit references causes target bugs**"],
          ["**Range**", "`Range(\"A1:B10\")`, `Cells(r, c)`", "**Cell values, formulas, formatting**", "**Reading cell-by-cell in loops is excruciatingly slow (COM boundary)**"],
          ["**Variant Arrays**", "`Dim arr As Variant: arr = Range(\"A1:Z1000\").Value`", "**In-memory block data manipulation**", "**Best practice: read/write blocks in bulk to avoid COM overhead**"]
        ],
        n: "Visual Basic for Applications (VBA) is one of the most economically " +
          "influential programming environments in business history. Embedded " +
          "inside Microsoft Office applications (primarily Excel, Word, and " +
          "Access), VBA is based on legacy **Visual Basic 6 (1998)**. Its " +
          "revolutionary gateway feature was the **Macro Recorder**: a business " +
          "user could click 'Record Macro', perform complex spreadsheet " +
          "operations manually, and Excel would automatically generate clean, " +
          "executable VBA code. VBA interacts with documents through the **Excel " +
          "Object Model**: `Application -> Workbook -> Worksheet -> Range`. " +
          "The critical architectural bottleneck in VBA is the **COM boundary**: " +
          "every time a script reads or writes an individual cell via " +
          "`Range.Value`, it crosses an inter-process COM boundary. Iterating " +
          "over 50,000 cells in a for-loop takes minutes. High-performance " +
          "VBA bypasses this by dumping the entire range into an in-memory " +
          "**Variant Array** in a single call, processing the data in RAM, " +
          "and writing the array back in one atomic operation. However, VBA " +
          "has become an enterprise nightmare: it spawned the pervasive " +
          "phenomenon of **'Shadow IT'** (where multi-million-dollar banking " +
          "and hedge fund operations rely on unversioned `.xlsm` spreadsheets " +
          "maintained by a single employee), and its access to Windows APIs " +
          "made macro-enabled spreadsheets the **#1 vector for corporate " +
          "ransomware and malware distribution**."
      },

      miss: [
        {
          w: "VBA is modern Visual Basic (.NET).",
          r: "VBA is based on legacy Visual Basic 6 from the 1990s. It does not run " +
            "on .NET, lacks multithreading, lacks package managers, and is frozen in time."
        },
        {
          w: "VBA is obsolete and no longer used in real enterprise business.",
          r: "VBA remains deeply entrenched: global investment banks, accounting giants, " +
            "and government agencies run critical daily financial operations on Excel VBA macros."
        },
        {
          w: "Cell-by-cell loops are the standard way to process data in VBA.",
          r: "Iterating cell-by-cell crosses the COM boundary repeatedly, taking minutes. " +
            "Professional VBA loads ranges into memory Variant Arrays in bulk, running 100x faster."
        },
        {
          w: "Enabling macros on downloaded spreadsheets is completely harmless.",
          r: "VBA macros have full access to the local filesystem and Windows APIs, " +
            "making them a primary attack vector for ransomware, trojans, and malware."
        }
      ],

      trade: {
        buys: [
          "Pre-installed inside Microsoft Office on millions of corporate desktops with zero IT setup.",
          "Macro recorder allows non-programmers to generate functional automation code instantly.",
          "Direct, granular control over every aspect of Excel spreadsheets, charts, and formulas.",
          "Extremely rapid automation of repetitive daily office reporting tasks."
        ],
        costs: [
          "Antiquated 1990s language and IDE lacking Git version control, unit tests, or package managers.",
          "Massive security liability: primary corporate malware vector, blocked by default in modern Windows.",
          "Fosters unmaintained 'Shadow IT' systems that threaten institutional business continuity.",
          "Single-threaded execution: long calculations freeze the Excel user interface completely."
        ],
        avoid: [
          "Building mission-critical corporate business systems or enterprise databases.",
          "Writing new automation for cloud-first environments (use Python or Office Scripts instead).",
          "Distributing macro-enabled files (`.xlsm`) to external or untrusted recipients."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
