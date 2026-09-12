(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "module",
      why: {
        before: "Codebases consisted of massive multi-thousand-line single files or multiple script tags dumped into a shared global scope (`window`), where any script could overwrite another script's variables.",
        problem: "Global namespace collisions were rampant; loading order had to be manually maintained; and understanding which script depended on which was impossible, causing fragile application architectures.",
        shift: "Modular programming introduced the Module: a self-contained, independent unit of software encapsulating private internal implementation details and exposing a clean, explicit public interface."
      },
      num: {
        t: "Module Systems Evolution & Resolution Architecture",
        h: ["Module Standard / System", "Loading Mechanism", "Dependency Resolution Timing", "Export / Binding Model", "Primary Environment"],
        r: [
          ["ES Modules (ESM)", "Asynchronous, multi-phase (Parse, Instantiate, Evaluate)", "Static analysis at compile / parse time", "Live read-only bindings (variables update across modules)", "Modern Browsers, Node.js (`type: module`), Deno, Bun"],
          ["CommonJS (CJS)", "Synchronous filesystem I/O (`require()`)", "Dynamic at runtime execution", "Value copy (cached object export via `module.exports`)", "Legacy Node.js, server-side npm packages"],
          ["AMD (Asynchronous Module Definition)", "Asynchronous callback wrapping (`define(['dep'], fn)`)", "Dynamic browser script tag injection", "Object export via callback argument return", "Legacy browser script loading (RequireJS)"],
          ["UMD (Universal Module Definition)", "Wrapper boilerplate detecting CJS, AMD, or Global", "Dynamic runtime detection branch", "Adapts export based on detected host environment", "Multi-target open source library publishing (legacy)"]
        ],
        n: "A module establishes an isolated lexical scope boundary: top-level variables, functions, and classes defined inside a module are private by default and cannot leak into the global scope. In ECMAScript Modules (ESM), module loading operates in three strict phases: (1) Construction (fetching files and parsing them into Module Records), (2) Instantiation (allocating memory locations for all exported identifiers and linking live bindings), and (3) Evaluation (executing the top-level executable code to populate the memory locations). Because ESM dependency graphs are statically analyzed before any code executes, bundlers (Webpack, Rollup, Vite) can perform Tree Shaking: dead-code elimination that traces the export/import AST graph and discards unreferenced exports from production bundles."
      },
      miss: [
        {
          w: "CommonJS (`require`) and ES Modules (`import`) are identical with slightly different syntax.",
          r: "CommonJS is synchronous and evaluates code dynamically, exporting value copies; ESM is asynchronous, statically analyzable, and exports *live read-only bindings* where mutations in the exporter reflect in the importer."
        },
        {
          w: "Tree-shaking works equally well on CommonJS modules and ES Modules.",
          r: "Tree-shaking requires static analysis of AST import/export graphs; CommonJS's dynamic `require()` calls cannot be reliably statically analyzed, making complete tree-shaking impossible."
        },
        {
          w: "Circular module dependencies are always a fatal syntax error that prevents applications from running.",
          r: "ESM handles circular dependencies gracefully using live bindings (Module Records link pointers before code evaluation); however, accessing circular imports before evaluation finishes can yield `undefined`."
        },
        {
          w: "A file must contain multiple modules to be well-structured.",
          r: "Modern software engineering enforces 'one module per file', establishing a one-to-one mapping between the filesystem tree and the architectural module dependency graph."
        }
      ],
      trade: {
        buys: [
          "Namespace isolation: eliminates global scope pollution; private variables inside a module cannot be corrupted by external code.",
          "Explicit dependency graphs: code declares exactly what it imports, making architectural relationships clear and auditable.",
          "Tree-shaking optimization: bundlers analyze static import graphs to strip unused code, reducing production bundle sizes.",
          "Concurrent asynchronous loading: modern browsers fetch and parse modules in parallel over HTTP/2 without blocking rendering."
        ],
        costs: [
          "CJS / ESM dual-package hazard: bridging legacy CommonJS and modern ES Modules causes notorious packaging headaches.",
          "Circular dependency subtle bugs: circular references between modules can result in importing half-initialized `undefined` exports.",
          "Bundling toolchain complexity: requires configuring build tools (Vite, Rollup, Webpack, esbuild) to bundle modules for deployment.",
          "Network waterfall latency: loading unbundled native ES modules over HTTP can trigger hundreds of sequential network requests."
        ],
        avoid: [
          "Creating circular import cycles between two modules that depend directly on each other's top-level state.",
          "Using dynamic `require()` statements in modern JavaScript/TypeScript projects instead of standard static `import` syntax.",
          "Exporting massive mutable state objects that external modules mutate directly without encapsulated accessor methods.",
          "Mixing CommonJS and ESM syntax in the same package without explicit configuration in `package.json`."
        ]
      }
    },
    {
      slug: "import",
      why: {
        before: "Applications relied on monolithic scripts, manual script loading tags in HTML in exact manual order, or global variable pollution to share logic across files.",
        problem: "If a developer reordered `<script>` tags, downstream scripts crashed with `ReferenceError: $ is not defined`; dependencies were invisible, undocumented, and fragile.",
        shift: "The `import` statement established a standardized, declarative language keyword to bring specific functions, classes, and variables from external modules into the local scope."
      },
      num: {
        t: "Import Syntax Forms & Static vs Dynamic Loading",
        h: ["Import Syntax Form", "Declaration / Keyword", "Evaluation Timing", "Tree-Shaking Compatibility", "Primary Use Case"],
        r: [
          ["Named Import", "`import { add, sub } from './math'`", "Compile / Parse time (Static)", "100% Tree-Shakeable (bundles only referenced symbols)", "Standard, idiomatic import for modern libraries"],
          ["Default Import", "`import React from 'react'`", "Compile / Parse time (Static)", "Moderate (imports default export entity)", "Importing the primary component or class of a module"],
          ["Namespace Import", "`import * as MathUtils from './math'`", "Compile / Parse time (Static)", "Partial (bundler may include entire module object)", "Grouping dozens of cohesive utility functions under a namespace"],
          ["Dynamic Import", "`const mod = await import('./heavy')`", "Runtime execution (On-Demand)", "Enables Code Splitting (separate bundle chunks)", "Route-based lazy loading, loading heavy components on demand"],
          ["Side-Effect Import", "`import './styles.css'`", "Compile / Parse time", "Cannot be tree-shaken (side effects must execute)", "Injecting CSS stylesheets, polyfills, or global telemetry"]
        ],
        n: "The `import` statement is a top-level declarative statement that instructs the runtime's module loader to fetch, link, and expose specific exported symbols from a target module. Because static `import` declarations can only appear at the top-level scope of a module (outside of any `if` statements or function bodies), the JavaScript engine can analyze the complete dependency tree during the parsing phase without executing a single line of JavaScript. For scenarios requiring conditional or deferred loading (such as lazy-loading an expensive charting library only when a user clicks a modal button), modern ECMAScript provides the Dynamic Import function: `import(specifier)`. Dynamic import returns a `Promise` that resolves to the module namespace, serving as the foundational primitive for Webpack and Vite Code Splitting."
      },
      miss: [
        {
          w: "Static `import` statements can be placed inside an `if` block to load modules conditionally.",
          r: "Static `import` statements are strictly top-level declarations and cannot be nested inside blocks or functions; conditional loading requires dynamic `import()`."
        },
        {
          w: "Default exports are always better and more modern than named exports.",
          r: "Named exports are vastly superior for maintainability, refactoring, and automated tooling: they prevent arbitrary renaming at call sites, enable auto-import IDE features, and optimize tree-shaking."
        },
        {
          w: "Using `import * as Foo` imports every function and makes tree-shaking completely impossible.",
          r: "Modern bundlers (Rollup, Vite, Webpack) analyze property accesses on namespace imports (e.g. `Foo.bar()`) and can still tree-shake unreferenced exports."
        },
        {
          w: "Importing a module multiple times in different files executes that module's code multiple times.",
          r: "Modules are executed exactly once when first loaded; subsequent imports across the application receive cached references to the already evaluated module."
        }
      ],
      trade: {
        buys: [
          "Explicit dependency declarations: every external dependency is documented transparently at the top of the file.",
          "Compile-time tree-shaking: bundlers identify and strip unreferenced imports, keeping client bundle sizes minimal.",
          "Code splitting and lazy loading: dynamic `import()` enables deferred chunk loading, speeding up initial page loads.",
          "Tooling automation: enables IDEs to provide instant auto-completion, jump-to-definition, and automatic refactoring."
        ],
        costs: [
          "Static syntax restriction: static imports cannot be parameterized or executed conditionally at runtime.",
          "Module resolution latency: resolving complex multi-tiered node_modules symlink paths adds build-time overhead.",
          "Bundle bloat from accidental imports: importing a massive library (e.g. `lodash` without subpaths) can inflate bundle sizes.",
          "Strict MIME type and CORS requirements: browsers loading native ES modules enforce strict CORS and MIME type checks."
        ],
        avoid: [
          "Using default exports for utility libraries; prefer named exports to support IDE refactoring and consistent naming.",
          "Importing massive libraries just for one function (e.g. `import _ from 'lodash'` instead of `import debounce from 'lodash/debounce'`).",
          "Placing static `import` declarations anywhere other than the very top of the file.",
          "Loading heavy, rarely used third-party libraries statically in initial landing page bundles (use dynamic `import()`)."
        ]
      }
    },
    {
      slug: "namespace",
      why: {
        before: "In early programming, all function and variable names existed in a single flat, global symbol table.",
        problem: "If two independent libraries both declared a function named `init()` or a class named `List`, the program suffered fatal naming collisions, linker errors, or silent memory overwrites.",
        shift: "Programming languages introduced Namespaces (and Packages): declarative scoping mechanisms that group related identifiers under a distinct named container, preventing naming collisions."
      },
      num: {
        t: "Namespace Mechanisms & Scoping Models Across Languages",
        h: ["Language", "Namespace Primitive / Mechanism", "Filesystem Relationship", "Access Syntax / Scope Resolution", "Primary Architectural Role"],
        r: [
          ["C++", "`namespace Company::Project { ... }`", "Decoupled from filesystem layout", "Scope resolution operator (`::`, e.g. `std::vector`)", "Eliminates global symbol collisions in compiled C/C++ binaries"],
          ["Java / Kotlin", "`package com.company.project;`", "Strictly mirrors filesystem directory path", "Dot notation (`java.util.List`)", "Organizes classes; governs package-private access control"],
          ["C#", "`namespace Company.Project;`", "Decoupled from filesystem directory structure", "Dot notation (`System.Collections.Generic`)", "Logical grouping of classes across compiled assemblies"],
          ["Python", "Modules (`.py` files) and Packages (`__init__.py`)", "Strictly mirrors filesystem directory hierarchy", "Dot notation (`import package.module`)", "Natural filesystem-based module and package organization"],
          ["TypeScript", "`namespace Foo { ... }` (Internal Modules)", "Decoupled (compiled to JS IIFE closure objects)", "Dot notation (`Foo.Bar`)", "Legacy TS feature; superseded by standard ES Modules"]
        ],
        n: "A namespace is an abstract container providing context for the identifiers (names of types, functions, variables) it contains. At the compiler and symbol table level, a namespace modifies the identifier's 'Fully Qualified Name' (FQN). For example, rather than placing the raw symbol `Logger` into the global linker symbol table, a C++ compiler uses Name Mangling to encode the namespace into the symbol name (e.g., `_ZN7Company7Project6LoggerE`). This allows two completely different libraries to define a class named `Logger` without any linker collision. In modern JavaScript and TypeScript, explicit `namespace` keywords are considered obsolete: the ECMAScript Module (ESM) file itself serves as the natural namespace boundary, with directory paths providing higher-level package namespaces."
      },
      miss: [
        {
          w: "In modern TypeScript, you should use the `namespace` keyword to organize application code.",
          r: "The `namespace` keyword in TypeScript is an obsolete legacy feature from before ES6; modern TypeScript codebases use standard ES Modules (`import`/`export`), which provide better tree-shaking and tooling."
        },
        {
          w: "A namespace in C++ or C# allocates memory at runtime.",
          r: "Namespaces are compile-time organizational and symbol-mangling abstractions; they allocate zero memory and have zero runtime CPU performance cost."
        },
        {
          w: "Java package names can be arbitrarily chosen without matching the filesystem folder structure.",
          r: "Java strictly mandates that the `package` declaration match the exact physical directory path on disk; a mismatch causes fatal compiler and classloader errors."
        },
        {
          w: "Using `using namespace std;` in C++ header files is standard, clean practice.",
          r: "Putting `using namespace` in header files pollutes the global namespace of every source file that includes that header, reintroducing the very naming collisions namespaces were invented to solve."
        }
      ],
      trade: {
        buys: [
          "Total collision elimination: allows multiple libraries to declare identical function names without conflict.",
          "Hierarchical domain organization: groups thousands of related classes into logical, discoverable domains (e.g. `System.IO`).",
          "Fine-grained access control: languages like Java use packages to enforce package-private encapsulation boundaries.",
          "Zero runtime overhead: in compiled languages, namespaces are resolved entirely at compile time."
        ],
        costs: [
          "Verbose fully qualified names: typing `com.enterprise.service.auth.SecurityManager` creates syntactic clutter.",
          "Filesystem synchronization friction: in Java and Python, renaming a namespace requires physically moving files on disk.",
          "Namespace pollution via wildcard imports: `import *` or `using namespace` re-introduces naming collisions.",
          "Tooling configuration overhead: managing namespace path mappings in build configs (e.g. `tsconfig.json` paths) can be fragile."
        ],
        avoid: [
          "Writing `using namespace std;` in C++ header files (`.h` / `.hpp`).",
          "Using obsolete TypeScript `namespace` blocks instead of modern ES Modules (`import`/`export`).",
          "Creating overly deep 8-level namespace hierarchies (`com.co.app.domain.sub.feature.impl.util`).",
          "Polluting namespaces with wildcard imports (`from module import *`), which obscures where functions originated."
        ]
      }
    },
    {
      slug: "comment",
      why: {
        before: "Programmers wrote raw, cryptic machine instructions or terse assembly code with zero explanatory annotations, leaving future maintainers to reverse-engineer intent from raw hexadecimal logic.",
        problem: "Code explained *how* an instruction executed, but could never explain *why* it was written, what business constraint motivated it, or what edge-case bug it was patching.",
        shift: "Programming languages introduced Comments: human-readable prose annotations embedded directly in source code, completely stripped by compilers and interpreters during lexical tokenization."
      },
      num: {
        t: "Comment Categories & Engineering Utility Spectrum",
        h: ["Comment Category", "Primary Intent / Purpose", "Engineering Value", "Maintenance Risk", "Representative Example"],
        r: [
          ["Intent / Rationale ('Why')", "Explains non-obvious business rules or architectural trade-offs", "High; captures institutional knowledge invisible in code", "Low; business reasons change only when domain rules change", "`// Workaround for Safari iOS audio autoplay policy restriction`"],
          ["Algorithmic / Mathematical", "Explains complex mathematical formulas or paper citations", "High; clarifies academic or cryptographic derivations", "Low; math invariants remain stable", "`// Implements Fast Inverse Square Root algorithm (Quake III)`"],
          ["Redundant / Noise ('What')", "Restates the exact code in English prose", "Negative; pure visual clutter that slows down reading", "High; code changes while comment remains, becoming a lie", "`i++; // increment i by 1` or `// set user name`"],
          ["TODO / Debt Marker", "Flags known technical debt or deferred optimization", "Moderate; useful if tracked, dangerous if ignored", "Moderate; turns into stale documentation graveyards", "`// TODO(alice): Replace with batch API once v2 is released`"],
          ["Zombie / Commented-Out Code", "Old code commented out 'just in case we need it later'", "Toxic; clutters codebase and confuses developers", "Extreme; decays rapidly and pollutes git search", "`// const legacyTotal = calculateLegacy(x, y);`"]
        ],
        n: "At the compiler and runtime level, comments are eliminated during the first phase of compilation: Lexical Analysis (tokenization). The lexer scans the source text, matches comment patterns (such as `//` single-line or `/* ... */` multi-line blocks), and discards them, ensuring they consume zero memory in compiled binaries and have zero runtime execution cost. In software engineering philosophy, comments follow the golden axiom: 'Code tells you how; comments tell you why.' High-quality code is self-documenting regarding *what* it does through clean variable names and small functions. Comments should be reserved strictly for non-obvious context: explaining *why* an unusual workaround exists, citing regulatory constraints, documenting tricky concurrency race conditions, or referencing external bug trackers."
      },
      miss: [
        {
          w: "Every single line of code should have a comment explaining what it does.",
          r: "Writing comments for self-explanatory code is visual noise that clutters the screen; if code requires a comment to explain *what* it does, the code should be refactored with better names."
        },
        {
          w: "Leaving commented-out code in the repository is a great way to preserve old logic 'just in case'.",
          r: "Git version control already tracks every line of historical code forever; commented-out code ('Zombie Code') creates visual clutter, decays rapidly, and should be deleted immediately."
        },
        {
          w: "Comments make the compiled program run slower or consume more RAM.",
          r: "Compilers and minifiers completely strip comments during lexical analysis; comments have zero impact on binary size, execution speed, or memory consumption."
        },
        {
          w: "Comments are always reliable and can be trusted more than the code.",
          r: "Code never lies, but comments frequently do: when developers update code, they often forget to update the accompanying comment, leaving misleading, outdated explanations."
        }
      ],
      trade: {
        buys: [
          "Preservation of rationale: records *why* an unintuitive workaround or performance hack was necessary.",
          "Edge-case context: warns future maintainers against refactoring away subtle fixes for rare bugs.",
          "Domain alignment: bridges complex regulatory, tax, or legal requirements with the underlying code logic.",
          "Zero runtime overhead: stripped during compilation, incurring zero performance penalty in production."
        ],
        costs: [
          "Documentation rot liability: comments that drift out of sync with updated code actively mislead developers.",
          "Visual clutter: unnecessary comments obscure real code and inflate file sizes.",
          "Excuse for bad code: developers often write confusing, spaghetti code and slap a comment on top instead of refactoring.",
          "False sense of security: developers trust outdated comments without reading the actual implementation."
        ],
        avoid: [
          "Writing redundant comments that merely restate the code in English (`let total = 0; // initialize total to zero`).",
          "Committing blocks of commented-out dead code (delete it; git history preserves it).",
          "Using comments as an excuse to avoid writing clean, self-documenting variable and function names.",
          "Writing sarcastic, angry, or emotional comments venting about teammates or legacy systems."
        ]
      }
    },
    {
      slug: "docstring",
      why: {
        before: "API documentation lived in external PDF manuals or disconnected Wiki pages that drifted out of sync with code within weeks, leaving developers guessing about parameter types and return contracts.",
        problem: "Developers had to leave their code editor to understand functions; documentation could not be parsed by IDEs for autocomplete, nor could it be automatically verified by automated tools.",
        shift: "Programming languages standardized Docstrings (Python docstrings, JSDoc, Javadoc, Rustdoc): structured documentation literals co-located directly inside function and class definitions, parsed by compilers and IDE language servers."
      },
      num: {
        t: "Docstring Standards & Ecosystem Tooling",
        h: ["Language / Ecosystem", "Docstring Syntax / Standard", "Type Metadata Inclusion", "API Portal Generator Tool", "Runtime Metadata Accessibility"],
        r: [
          ["Python", "Triple-quoted strings (`\"\"\"...\"\"\"`) immediately below def", "Google / NumPy / Sphinx format (types optional if using type hints)", "Sphinx, MkDocs, pdoc", "Yes (accessible at runtime via `fn.__doc__`)"],
          ["JavaScript / TypeScript", "JSDoc comment blocks (`/** ... */`)", "Structured tags (`@param {string} name`, `@returns`)", "TypeDoc, JSDoc CLI", "No (stripped during compilation; preserved in TS `.d.ts`)"],
          ["Java", "Javadoc blocks (`/** ... */`)", "Tags (`@param`, `@return`, `@throws`, `@see`)", "Standard `javadoc` tool", "Accessible via reflection if retained in bytecode"],
          ["Rust", "Doc comments (`///` for items, `//!` for modules)", "Markdown-based with executable doctests", "`cargo doc`", "Preserved in AST; doctests compiled and executed in CI!"]
        ],
        n: "A Docstring is a formalized documentation comment written in close syntactic proximity to a code declaration (functions, classes, modules). Unlike regular comments which are discarded by the lexer, docstrings are parsed into the Abstract Syntax Tree (AST) as formal metadata. In Python, a docstring is preserved at runtime and attached to the object's `__doc__` attribute, enabling interactive inspection via `help(fn)`. In Rust and TypeScript, docstrings support Markdown formatting and provide the foundational data for Language Server Protocols (LSP): when a developer hovers over a function in VS Code or IntelliJ, the LSP renders the formatted docstring, parameter descriptions, and return contracts in real time. In Rust, code snippets inside docstrings (`/// ```rust`) are actually compiled and executed as automated unit tests by `cargo test`, mathematically guaranteeing that documentation examples never become stale."
      },
      miss: [
        {
          w: "A docstring is just a standard multi-line comment with no special properties.",
          r: "Docstrings are parsed as structured AST metadata by IDEs, language servers, and doc generators; in Python, they are preserved at runtime in the `__doc__` attribute."
        },
        {
          w: "Every single private helper function must have a complete 20-line docstring.",
          r: "Docstrings are essential for public API boundaries, libraries, and complex modules; internal 3-line helper functions with clear type hints do not need verbose docstring boilerplate."
        },
        {
          w: "Type annotations should be duplicated inside docstrings in modern TypeScript or typed Python.",
          r: "Modern languages enforce types through native type signatures; duplicating types inside JSDoc or Python docstrings creates redundant documentation that easily drifts out of sync."
        },
        {
          w: "Docstrings can never be tested automatically and always rot over time.",
          r: "Rust (`cargo test`) and Python (`doctest`) feature native Doc-Testing: code examples inside docstrings are compiled and executed as automated tests during CI, ensuring documentation stays accurate."
        }
      ],
      trade: {
        buys: [
          "Instant IDE tooltips: developers see parameter descriptions, usage examples, and exception contracts on hover.",
          "Automated API documentation portals: compile entire developer documentation websites directly from source code ASTs.",
          "Tested code examples: doctests mathematically guarantee that documentation examples remain working and up-to-date.",
          "Single source of truth: co-locates API documentation with the code it describes, reducing documentation drift."
        ],
        costs: [
          "Maintenance overhead: updating function signatures requires updating accompanying `@param` tags.",
          "Visual bloat: verbose docstrings can push actual implementation code 30 lines down the screen.",
          "Redundancy with type systems: duplicating type information in docstring tags wastes developer time.",
          "Formatting inconsistency: multi-developer teams can format docstrings inconsistently without linters (e.g. `eslint-plugin-jsdoc`)."
        ],
        avoid: [
          "Duplicating TypeScript type annotations inside JSDoc `@param` tags (document only semantic *meaning*).",
          "Leaving obsolete docstrings after changing function parameters or return behavior.",
          "Writing trivial docstrings that merely restate the function name (`/** Gets user. @param id The id. */`).",
          "Failing to document non-obvious exceptions thrown by the function (`@throws {NotFoundError}`)."
        ]
      }
    },
    {
      slug: "indentation",
      why: {
        before: "Early programming languages used explicit keywords (`BEGIN` / `END`) or curly braces (`{}`) for block scoping, while developers formatted whitespace randomly, making code visual layout completely decoupled from logical execution.",
        problem: "A developer could visually indent code suggesting it was inside an `if` block, while the compiler executed it unconditionally outside the block, causing catastrophic security bugs (e.g. Apple's infamous 'goto fail' bug).",
        shift: "Languages split into two major scoping paradigms: Explicit Braces (C, Java, JS) where indentation is visual style, and Meaningful Whitespace (the Off-Side Rule in Python, YAML, Haskell) where indentation defines execution scope directly."
      },
      num: {
        t: "Indentation Paradigms & Whitespace Standards",
        h: ["Language / Standard", "Scoping Mechanism", "Whitespace Semantic Meaning", "Standard Indentation Width", "Whitespace Collision Hazard"],
        r: [
          ["Python / YAML", "The Off-Side Rule (Peter J. Landin)", "Syntactically significant; indentation defines scope blocks", "4 spaces (PEP 8)", "Mixing Tabs and Spaces causes fatal `TabError` crashes"],
          ["C / C++ / Java / Rust", "Explicit curly braces (`{ ... }`)", "Ignored by compiler; purely aesthetic for human readability", "2 or 4 spaces (Google Style)", "Visual deception: indented code executing outside scope (Apple goto fail)"],
          ["JavaScript / TypeScript", "Explicit curly braces (`{ ... }`)", "Ignored by runtime parser (except ASI newline rules)", "2 spaces (Standard JS / Prettier)", "Single-statement blocks without braces causing dangling else bugs"],
          ["Go (`gofmt`)", "Explicit curly braces (`{ ... }`)", "Zero debate; enforced by `gofmt` compiler toolchain", "Hard Tabs (tabs for indentation, spaces for alignment)", "Zero; compilation toolchain formats code deterministically"]
        ],
        n: "In programming language grammar, indentation governs the visual hierarchy of code. In languages adhering to the 'Off-Side Rule' (formulated by Peter J. Landin in 1966 and popularized by Python), indentation is syntactically significant: the lexical analyzer converts leading indentation spaces into synthetic `INDENT` and `DEDENT` tokens inserted into the token stream, replacing curly braces entirely. In brace-delimited languages, whitespace is technically ignored by the compiler, which creates the dangerous 'Dangling Else' and 'Misleading Indentation' vulnerabilities. In 2014, Apple's iOS SSL/TLS stack suffered the catastrophic 'goto fail' security vulnerability (CVE-2014-1266): a duplicate `goto fail;` line was indented inside an `if` statement, but because the `if` lacked curly braces, the second `goto` executed unconditionally every time, completely bypassing all SSL certificate signature verification."
      },
      miss: [
        {
          w: "In JavaScript and C, the compiler knows an instruction is inside an `if` block because you indented it.",
          r: "Brace-delimited languages ignore indentation completely; an unbraced `if` statement controls *only* the single immediate next line, regardless of how many lines you indent beneath it."
        },
        {
          w: "Mixing tabs and spaces in Python files works fine as long as they look visually aligned in your editor.",
          r: "Python 3 strictly forbids mixing tabs and spaces for indentation; doing so throws an immediate fatal `TabError: inconsistent use of tabs and spaces in indentation`."
        },
        {
          w: "Tabs are universally superior to spaces (or spaces are universally superior to tabs).",
          r: "Tabs allow developers to customize visual display width in their editor; spaces guarantee 100% byte-for-byte identical rendering across all machines, terminals, and GitHub diffs (most modern style guides mandate spaces)."
        },
        {
          w: "Using single-line `if` statements without curly braces (`if (err) return err;`) is safe modern practice.",
          r: "Omitting braces is the root cause of the Apple 'goto fail' vulnerability and countless merge conflict bugs; modern engineering standards mandate curly braces for all blocks."
        }
      ],
      trade: {
        buys: [
          "Visual code hierarchy: visual indentation reflects algorithmic control flow, allowing the human brain to parse structures instantly.",
          "Syntactic brevity (Off-Side Rule): eliminates thousands of lines of visual noise from closing curly braces (`}`).",
          "Automated formatting consistency: modern formatters (Prettier, `gofmt`, Black) enforce uniform indentation across entire engineering teams.",
          "Diff clarity in code reviews: consistent indentation ensures that git diffs highlight genuine logic changes rather than whitespace noise."
        ],
        costs: [
          "The Tab vs Space holy war: endless organizational debates over indentation configuration (eliminated by automated formatters).",
          "Copy-paste indentation corruption: copying Python code into email or text editors can mangle indentation, breaking execution.",
          "Visual deception in unbraced blocks: misleading visual indentation can disguise code executing unconditionally outside an `if`.",
          "Whitespace diff noise: re-indenting legacy files creates massive git diffs that obscure commit histories."
        ],
        avoid: [
          "Omitting curly braces on single-line `if` statements (always wrap blocks in `{ ... }` to prevent 'goto fail' bugs).",
          "Mixing tabs and spaces within the same codebase or file.",
          "Arguing over indentation preferences in code reviews (adopt Prettier or `gofmt` and enforce it in CI).",
          "Letting indentation drift beyond 4 levels deep (refactor using guard clauses and helper functions)."
        ]
      }
    },
    {
      slug: "zero-based-indexing",
      why: {
        before: "Human everyday counting starts at one (ordinal counting: 1st, 2nd, 3rd); early mathematical and scientific languages (Fortran, MATLAB, Julia) adopted 1-based indexing for array elements.",
        problem: "Translating 1-based array indices into physical computer hardware memory addresses required the CPU to perform an extra subtraction instruction ($(\\text{index} - 1) \\times \\text{size}$) for every single memory access.",
        shift: "Martin Richards (BCPL) and Edsger W. Dijkstra established Zero-Based Indexing: indexing arrays starting at 0, representing the physical memory *offset* from the base memory address of the array."
      },
      num: {
        t: "Zero-Based vs One-Based Indexing Across Runtimes",
        h: ["Indexing Paradigm", "Memory Offset Formula ($A[i]$)", "Hardware ALU Overhead", "Half-Open Range Notation", "Representative Languages"],
        r: [
          ["Zero-Based Indexing", "$\\text{Address} = \\text{Base} + (i \\times \\text{sizeof}(T))$", "Zero extra instructions; direct memory base pointer offset", "$[0, N)$ where Length $= \\text{End} - \\text{Start}$", "C, C++, Java, JS, Python, Rust, Go, C#"],
          ["One-Based Indexing", "$\\text{Address} = \\text{Base} + ((i - 1) \\times \\text{sizeof}(T))$", "Requires CPU subtraction instruction (`DEC` / `SUB`) per access", "$[1, N]$ where Length $= \\text{End} - \\text{Start} + 1$", "MATLAB, Julia, R, Fortran, Lua, SQL (arrays)"],
          ["Negative Indexing", "$\\text{Address} = \\text{Base} + ((N + i) \\times \\text{sizeof}(T))$", "Modulo or length addition at runtime", "$[-N, 0)$ indexing backwards from array tail", "Python (`arr[-1]`), Ruby, modern JS (`arr.at(-1)`)"],
          ["Arbitrary Base Indexing", "$\\text{Address} = \\text{Base} + ((i - \\text{Low}) \\times \\text{sizeof}(T))$", "Requires subtracting lower bound constant", "$[\\text{Low}, \\text{High}]$ custom array ranges", "Ada, Pascal, Algol 68"]
        ],
        n: "Zero-based indexing is not an arbitrary cultural convention; it is a direct reflection of physical computer hardware memory architecture. In memory, an array is a contiguous block of bytes beginning at a starting memory address (`Base`). The index $i$ does not represent an ordinal position; it represents a displacement offset: how many memory units must you jump forward from the base address to reach the target element. Therefore, the very first element resides at a displacement of zero units: $\\text{Address}(A[0]) = \\text{Base} + (0 \\times \\text{size}) = \\text{Base}$. In 1982, Edsger W. Dijkstra published his famous paper 'Why numbering should start at zero', demonstrating that half-open intervals $[0, N)$ naturally prevent fencepost bugs, simplify concatenation without overlaps, and ensure that the number of elements is elegantly equal to the upper bound ($N - 0 = N$)."
      },
      miss: [
        {
          w: "Zero-based indexing was chosen purely by accident and has no mathematical justification.",
          r: "Dijkstra proved mathematically that half-open ranges starting at zero $[0, N)$ are algebraically superior, eliminating `+1` and `-1` adjustments in range calculations and array splitting."
        },
        {
          w: "Accessing the last element of an array of length $N$ is located at index $N$.",
          r: "In zero-based indexing, an array of length $N$ has valid indices from $0$ to $N - 1$; accessing index $N$ is an out-of-bounds off-by-one error."
        },
        {
          w: "Languages with 1-based indexing (like MATLAB or R) are technically primitive or obsolete.",
          r: "1-based indexing is natural for linear algebra, statistical matrix manipulation, and mathematical modeling, where vectors are defined as $v_1, v_2, \\dots, v_n$."
        },
        {
          w: "Negative indices (`arr[-1]`) work in all zero-based languages.",
          r: "Negative indexing is supported natively in Python, Ruby, and modern JS (`.at(-1)`); in C, C++, and traditional JS bracket access (`arr[-1]`), it accesses out-of-bounds memory or undefined object properties."
        }
      ],
      trade: {
        buys: [
          "Zero hardware ALU overhead: translates directly to memory address offsets without subtracting 1 on every memory dereference.",
          "Elegant half-open range math: the length of a slice $[a, b)$ is simply $b - a$, with zero `+1` correction terms.",
          "Clean modulo wrapping: cyclic array wrapping maps directly to modulo math (`index % length`) without offset corrections.",
          "Universal systems consistency: standardized across C, C++, Rust, Go, Java, Python, and JavaScript."
        ],
        costs: [
          "Cognitive mismatch for non-programmers: clashes with natural human ordinal counting (the '1st' element is at index 0).",
          "The 'Length Minus One' friction: accessing the final element requires writing `arr[arr.length - 1]` (mitigated by `.at(-1)`).",
          "High susceptibility to off-by-one errors: developers frequently write `<=` instead of `<` in loop termination conditions.",
          "Cross-language porting friction: migrating algorithms between Python/C and MATLAB/R requires shifting all indices by 1."
        ],
        avoid: [
          "Writing loop conditions as `i <= arr.length` (always use `i < arr.length` to avoid out-of-bounds reading).",
          "Attempting to access the last element with `arr[arr.length]` in JavaScript (returns `undefined`).",
          "Writing manual offset math when modern language methods (like `arr.at(-1)`) handle tail indexing cleanly.",
          "Confusing human-facing 1-based pagination parameters with internal 0-based database query offsets."
        ]
      }
    },
    {
      slug: "off-by-one-error",
      why: {
        before: "Programmers wrote manual boundary checks and loop counters, relying on human intuition to determine whether loops should terminate with strict inequalities (`<`) or inclusive inequalities (`<=`).",
        problem: "Misjudging a loop boundary by exactly one element caused programs to process one too many (or one too few) elements, leading to buffer overflow memory corruption, corrupted data, and security vulnerabilities.",
        shift: "Computer science formalized the Off-by-One Error (OBOE, Fencepost Problem): a ubiquitous logic error where a boundary condition is miscalculated by 1, mitigated by modern iterators, half-open ranges, and bounds checkers."
      },
      num: {
        t: "Off-by-One Error Archetypes & Diagnostic Patterns",
        h: ["OBOE Archetype", "Root Cause Mechanism", "Vulnerable Syntax / Expression", "Observable Symptom", "Engineering Remediation"],
        r: [
          ["Fencepost Error", "Counting intervals vs counting boundary posts", "`posts = distance / spacing` (misses final post)", "Constructing 9 fence posts for 10 meters when 11 are required", "Identify whether counting items ($N$) or intervals ($N - 1$)"],
          ["Array Boundary Overrun", "Using `<=` instead of `<` on array length", "`for (let i = 0; i <= arr.length; i++)`", "Accesses `undefined` or reads out-of-bounds heap memory", "Standardize on half-open ranges $[0, N)$; use `for...of`"],
          ["Substring Slicing Truncation", "Misunderstanding whether end index is inclusive or exclusive", "`str.slice(0, 5)` expecting 6 characters", "Omits the 5th character; string is 1 character too short", "Remember that end index is exclusive in half-open slices"],
          ["Loop Counter Under-execution", "Initializing counter at 1 instead of 0", "`for (let i = 1; i < arr.length; i++)`", "First element at index 0 is silently never processed", "Use zero-based loop initialization or modern iterator methods"],
          ["Security Buffer Overflow (C/C++)", "Writing null terminator (`\\0`) past allocated buffer", "`buffer[MAX_LEN] = '\\0'` on buffer of size `MAX_LEN`", "Corrupts adjacent stack frame; remote code execution CVE", "Use safe string functions (`strlcpy`) or bounds-checked containers"]
        ],
        n: "The Off-by-One Error (OBOE) is among the most pervasive algorithmic defects in software engineering, epitomized by the classic 'Fencepost Problem': if you build a 100-meter fence with posts spaced 10 meters apart, you need 11 posts, not 10. In digital computing, OBOEs occur when discrete boundary mathematics are miscalculated—most commonly confusing inclusive ranges $[A, B]$ with half-open ranges $[A, B)$. In languages with direct memory access (C/C++), an off-by-one error writing to an array buffer is known as an 'Off-by-One Buffer Overflow'. Writing a single null-terminator byte (`\\0`) into the byte immediately following an array boundary can overwrite the saved frame pointer (`EBP`) on the call stack, allowing attackers to hijack control flow (e.g. the historical OpenSSH Channel Code vulnerability)."
      },
      miss: [
        {
          w: "Off-by-one errors are just trivial beginner mistakes that experienced senior engineers never make.",
          r: "OBOEs are among the most common root causes of critical production outages and high-severity security vulnerabilities (CVEs) in software written by senior engineers worldwide."
        },
        {
          w: "Off-by-one errors in high-level languages like JavaScript or Python always throw an immediate crash error.",
          r: "In JavaScript, reading out of bounds (`arr[arr.length]`) returns `undefined` without throwing an error, silently propagating `undefined` into calculations and corrupting database state."
        },
        {
          w: "Using `<` instead of `<=` always prevents off-by-one errors.",
          r: "The choice between `<` and `<=` depends on whether the boundary is inclusive or exclusive; blindly using `<` when the upper bound is meant to be included creates an under-run OBOE."
        },
        {
          w: "Modern bounds-checked languages like Rust make off-by-one errors completely impossible.",
          r: "Rust panics on out-of-bounds access, preventing memory corruption security exploits, but logical OBOEs (processing 9 items instead of 10) still occur in application business logic."
        }
      ],
      trade: {
        buys: [
          "Defect eradication: understanding OBOE patterns eliminates the single most common boundary logic bug in algorithms.",
          "Security hardening: prevents off-by-one buffer overflows that serve as vectors for remote code execution.",
          "Precise resource allocation: ensures memory buffers, queue sizes, and array capacities are allocated with exact sizing.",
          "Correct data reporting: ensures analytics queries, pagination counts, and billing calculations are accurate."
        ],
        costs: [
          "Defensive testing overhead: requires authoring unit tests targeting both boundary extremes ($0, 1, N-1, N$).",
          "Cognitive verification strain: developers must consciously verify boundary operators (`<` vs `<=`) during code reviews.",
          "Language-specific range differences: different slicing semantics across languages require constant mental context switching.",
          "Runtime bounds checking overhead: memory-safe languages incur minor CPU branch checks on array index access."
        ],
        avoid: [
          "Writing traditional index loops (`for (let i = 0; i <= arr.length; i++)`) when modern iterators (`for...of`) prevent OBOEs.",
          "Testing loops only on typical happy-path inputs without verifying empty collections ($N=0$) and single-element collections ($N=1$).",
          "Subtracting 1 from array lengths or string indices without checking if the length is greater than 0.",
          "Ignoring compiler warnings that flag potential signed/unsigned integer comparison mismatches."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
