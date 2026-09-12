(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "script",
      why: {
        before: "Software had to be written in heavy systems languages (C, Fortran), compiled through multi-minute build pipelines, linked into machine binaries, and manually installed to run even trivial automation tasks.",
        problem: "Automating routine system administrative tasks (file backups, log rotation, text parsing) was slow and cumbersome; modifying an automation required full recompilation.",
        shift: "Scripting languages (sh, Perl, Python, Bash, Node.js) introduced Scripts: interpreted or JIT-compiled source code files executed directly by an interpreter without an explicit ahead-of-time compilation step."
      },
      num: {
        t: "Script Execution Models & Shebang Dispatch Mechanics",
        h: ["Scripting Paradigm / Language", "Shebang Interpreter Directive", "Execution Engine / Mechanism", "Startup Latency", "Primary Application Domain"],
        r: [
          ["Unix Shell Script (Bash / POSIX)", "`#!/usr/bin/env bash`", "Kernel `execve()` forks subshell; interprets line-by-line", "Instantaneous (< 5 ms)", "OS automation, cron jobs, CI/CD pipeline steps"],
          ["Python Script (`.py`)", "`#!/usr/bin/env python3`", "CPython compiles to in-memory bytecode (`.pyc`); executes in VM", "Fast (~30 - 50 ms)", "Data automation, AI inference, glue scripting, DevOps"],
          ["Node.js Script (`.js` / `.mjs`)", "`#!/usr/bin/env node`", "V8 engine parses, generates bytecode, and JIT-compiles hot paths", "Fast (~40 - 70 ms)", "Web tooling, build scripts, microservice CLI automation"],
          ["Compiled Systems Language (Go/Rust)", "N/A (No shebang; compiled ahead of time)", "Executes native machine code binary directly via OS loader", "Instantaneous (< 1 ms)", "High-performance systems tools, production daemons"]
        ],
        n: "A script is a source code file designed to be executed directly by an interpreter rather than compiled ahead of time into a standalone machine binary. In POSIX operating systems, executing a script (`./backup.sh`) relies on the **Shebang** (`#!`): the very first two bytes of the file are the magic number `0x23 0x21`. When the kernel's `execve()` system call detects this magic number, it parses the remainder of the line as an interpreter path (e.g. `#!/usr/bin/env python3`). The kernel then launches that interpreter executable, passing the script file path as its first argument. Using `/usr/bin/env` rather than a hardcoded path like `/usr/bin/python` is a vital engineering best practice because it searches the user's active `$PATH` environment variable, ensuring the script runs within the active virtual environment."
      },
      miss: [
        {
          w: "A script is inherently un-compiled and runs directly as raw text characters on the CPU.",
          r: "Modern scripting engines (Python, Node.js) compile source text into bytecode Abstract Syntax Trees and JIT-compile hot loops into native machine instructions during execution."
        },
        {
          w: "Hardcoding `#!/bin/python` in the shebang is completely portable across all Linux systems.",
          r: "Python paths vary across distributions (e.g. `/usr/bin/python3`, `/usr/local/bin/python3`); using `#!/usr/bin/env python3` dynamically resolves the correct interpreter from `$PATH`."
        },
        {
          w: "Scripts are toy programs that cannot be used for serious production engineering.",
          r: "Global cloud infrastructure, deployment pipelines, and big data ETL systems at Google, Netflix, and Amazon are powered by millions of mission-critical Python and Bash scripts."
        },
        {
          w: "A script does not need the executable permission bit (`chmod +x`) if it has a shebang.",
          r: "The operating system kernel strictly enforces filesystem permissions; executing `./script.py` directly without `chmod +x` results in an immediate `Permission denied` error."
        }
      ],
      trade: {
        buys: [
          "Instant iteration velocity: edit a file and run it immediately with zero compilation, linking, or packaging steps.",
          "Lightweight deployment: deploy plain-text scripts to servers without cross-compiling for different CPU architectures.",
          "High expressiveness: scripting languages provide rich built-in data structures (dictionaries, regex, strings) out of the box.",
          "Universal orchestration glue: seamlessly ties disparate command-line tools, databases, and APIs together."
        ],
        costs: [
          "Runtime error discovery: syntax typos and type mismatches in rarely executed branches are discovered only when reached.",
          "Execution speed limits: CPU-intensive loops in pure Python/Bash run 10x-50x slower than compiled C/Rust/Go binaries.",
          "Environment dependency fragility: scripts break if the host server lacks the required interpreter version or dependencies.",
          "Code obscurity in massive scripts: scripting languages can deteriorate into unmaintainable spaghetti when scripts grow past 500 lines."
        ],
        avoid: [
          "Hardcoding absolute interpreter paths like `#!/usr/bin/python3` instead of portable `#!/usr/bin/env python3`.",
          "Letting a script grow into a 2,000-line monolithic mess (refactor into a structured package or compiled language).",
          "Forgetting to set `chmod +x` on executable scripts before checking them into Git.",
          "Writing critical infrastructure scripts that fail silently without logging or error trapping."
        ]
      }
    },
    {
      slug: "entry-point",
      why: {
        before: "Early programming languages began execution at the very first physical line of the file, intermingling top-level variable declarations, function definitions, and executable startup code in an unstructured linear mess.",
        problem: "Importing a function from a file inadvertently executed its entire startup logic, making automated testing and code reuse across modules impossible without triggering unwanted side effects.",
        shift: "Software engineering formalized the Entry Point (e.g. `main()` in C/Go/Java, `if __name__ == '__main__':` in Python, `index.js` / `main` in `package.json`): the explicitly designated starting boundary where program execution begins."
      },
      num: {
        t: "Application Entry Point Conventions Across Languages",
        h: ["Language / Ecosystem", "Entry Point Syntax / Standard", "Invocation Mechanism", "Side-Effect Isolation Mechanism", "Package Manifest Definition"],
        r: [
          ["C / C++ / Rust / Go", "`int main(int argc, char *argv[])` / `fn main()`", "OS loader jumps directly to `main` symbol after runtime init", "Compile-time boundary; libraries lack `main()`", "Target declared in `Cargo.toml` (`[[bin]]`) or `go.mod`"],
          ["Python", "`if __name__ == '__main__': main()`", "Interpreter sets `__name__` to `'__main__'` when invoked directly", "Prevents code execution when file is imported as a library", "`pyproject.toml` `[project.scripts]` console script entry"],
          ["Node.js / JavaScript", "`index.js` or file specified in `package.json`", "Node.js engine loads and executes specified file top-level", "ES Modules run top-level code once on initial import", "`package.json` `\"main\"` and `\"bin\"` fields"],
          ["Java", "`public static void main(String[] args)`", "JVM invokes specific public static `main` method via reflection", "Classes are loaded without executing `main`", "`MANIFEST.MF` `Main-Class` attribute in JAR"]
        ],
        n: "The Entry Point represents the formal boundary where the operating system hands control over to the application code. In native compiled binaries (C, Rust, Go), execution does not start immediately at `main()`; the OS loader first jumps to `_start`, which initializes the C runtime (CRT), configures the memory stack pointer, initializes static global variables, parses command-line arguments into `argc`/`argv`, and only then invokes `main()`. In interpreted languages like Python, importing a file executes its top-level code; therefore, the idiom `if __name__ == '__main__':` checks whether the script is being executed directly by the user (where `__name__` is set to `'__main__'`) or imported as a module by another file (where `__name__` matches the module's import path), cleanly separating reusable library definitions from executable application scripts."
      },
      miss: [
        {
          w: "In Python, the `if __name__ == '__main__':` check is just optional boilerplate with no functional value.",
          r: "Without this check, importing any function from that file into another script or test suite will accidentally execute the entire script (e.g. launching servers, wiping databases) upon import."
        },
        {
          w: "A software application can have multiple `main()` entry points running simultaneously in the same process.",
          r: "An executable binary or process has exactly one primary entry point where execution begins; secondary processes or threads branch off explicitly from that initial entry point."
        },
        {
          w: "In web frontends, `index.html` is the only entry point that matters.",
          r: "Modern bundlers (Vite, Webpack) define JavaScript/TypeScript entry points (e.g. `src/main.tsx`) where the root React/Vue application tree is mounted to the DOM."
        },
        {
          w: "Command-line arguments passed to an entry point are automatically converted into typed integers and booleans.",
          r: "The operating system hands arguments to the entry point strictly as an array of raw strings (`char *argv[]` or `sys.argv`); the application must parse and validate types explicitly."
        }
      ],
      trade: {
        buys: [
          "Clean separation of concerns: separates reusable function/class declarations from execution startup logic.",
          "Safe library reusability: import helper functions into automated test suites without triggering production side effects.",
          "Deterministic startup sequence: establishes a single, auditable flow for initializing databases, configs, and telemetry.",
          "Clear architectural orientation: new team members know exactly where execution begins when navigating unfamiliar codebases."
        ],
        costs: [
          "Boilerplate friction: requires wrapping simple scripts in standard entry-point guards and main functions.",
          "CLI argument parsing complexity: parsing raw argument string vectors requires dedicated CLI libraries (argparse, Commander).",
          "Multiple entry-point maintenance: packages providing multiple CLI binaries must maintain and map distinct entry points.",
          "Testing orchestration: testing the entry point requires spinning up full subprocess executions rather than simple unit tests."
        ],
        avoid: [
          "Writing top-level executable side-effect code outside of an `if __name__ == '__main__':` block in Python modules.",
          "Putting complex business logic directly inside the entry-point file (delegate immediately to application services).",
          "Relying on raw index access on `argv` (`argv[1]`) without verifying argument counts or using an argument parser.",
          "Misconfiguring the `main` or `bin` fields in `package.json`, causing published npm packages to fail upon import."
        ]
      }
    },
    {
      slug: "package",
      why: {
        before: "Sharing code across projects required emailing zip files of source code, manually copying folders between directories, or compiling static libraries and copying them into `/usr/lib`.",
        problem: "Manual code sharing had no versioning, no automated dependency resolution, caused catastrophic version collisions ('DLL Hell'), and made updating shared libraries across projects impossible.",
        shift: "Software ecosystems established Packages and Package Managers (npm, PyPI, Cargo, Maven): bundling code, assets, and metadata into standardized, versioned archives distributed via central registries."
      },
      num: {
        t: "Package Formats & Package Manager Ecosystems",
        h: ["Ecosystem / Language", "Package Archive Format", "Central Public Registry", "Package Manifest File", "Primary Package Manager Tool"],
        r: [
          ["JavaScript / Node.js", "Gzipped Tarball (`.tgz`)", "npm registry (`registry.npmjs.org`)", "`package.json`", "npm, pnpm, yarn, bun"],
          ["Python", "Built Wheel (`.whl`) / Source Dist (`.tar.gz`)", "PyPI (Python Package Index)", "`pyproject.toml` (PEP 621)", "pip, poetry, uv, pipenv"],
          ["Rust", "Gzipped Tarball (`.crate`)", "crates.io", "`Cargo.toml`", "Cargo"],
          ["Java / JVM", "Java Archive (`.jar`) / Web Archive (`.war`)", "Maven Central", "`pom.xml` (Maven) / `build.gradle`", "Maven, Gradle"],
          ["Go", "Standard Git repository commit/tag archives", "Proxy cache (`proxy.golang.org`)", "`go.mod`", "Go toolchain (`go get`)"]
        ],
        n: "A Package is an organized, versioned bundle of reusable code, binary assets, and metadata packaged in a standardized format for automated distribution. A package is defined by its **Manifest** (e.g. `package.json`, `Cargo.toml`, `pyproject.toml`), which declares the package's canonical name, version (governed by Semantic Versioning), author information, license, and its exact dependency graph. Modern package managers (such as pnpm or Cargo) optimize installation through Content-Addressable Storage: rather than duplicating megabytes of identical dependency files across 50 project folders on disk, pnpm stores packages once in a global hard-linked store, creating hard links in local `node_modules`, saving gigabytes of disk space and slashing installation times."
      },
      miss: [
        {
          w: "Installing a package via npm or pip executes code only when you explicitly import it in your program.",
          r: "Many packages execute post-install lifecycle scripts (`postinstall` in npm, `setup.py` in Python) during the installation phase, which has been the vector for major malicious supply-chain attacks."
        },
        {
          w: "A package and a library are the exact same thing.",
          r: "A library is an architectural collection of functions/classes; a package is the *distribution and delivery mechanism* (archive format + metadata manifest) used to share that library across systems."
        },
        {
          w: "Every package published to public registries like npm or PyPI has been audited and approved for security.",
          r: "Public registries are open, unmoderated platforms; anyone can publish malicious packages, typo-squatted names (`lodas-sh`), or vulnerable dependencies without prior security audits."
        },
        {
          w: "Checking your `node_modules` directory into Git version control is standard modern practice.",
          r: "`node_modules` contains thousands of platform-dependent compiled binaries and gigabytes of files; it should *never* be committed to Git (always exclude via `.gitignore` and reinstall via lockfiles)."
        }
      ],
      trade: {
        buys: [
          "Massive code reusability: leverage hundreds of thousands of battle-tested open-source libraries instantly.",
          "Automated dependency resolution: package managers automatically calculate and fetch entire dependency graphs.",
          "Standardized versioning: Semantic Versioning communicates breaking changes and security patches clearly.",
          "Rapid prototyping: assemble full-stack applications in hours using pre-built UI components, ORMs, and auth packages."
        ],
        costs: [
          "Software Supply Chain vulnerability: malicious packages, compromised maintainers, and dependency confusion attacks.",
          "The 'Dependency Bloat' trap: installing a small utility can pull in 400 transitive dependencies and 200MB of disk space.",
          "Ecosystem churn: frequent breaking changes in popular packages require continuous maintenance and upgrade cycles.",
          "Registry outage vulnerability: public registry downtime (or package unpublishing) can halt company CI/CD builds."
        ],
        avoid: [
          "Committing `node_modules/` or virtual environments to Git version control.",
          "Installing untrusted packages with few downloads or unverified maintainers without auditing source code.",
          "Allowing automated package upgrades in production without locking dependencies in a lockfile.",
          "Publishing private corporate credentials or internal API tokens inside published public packages."
        ]
      }
    },
    {
      slug: "dependency",
      why: {
        before: "Software teams wrote every single algorithm, data structure, network protocol, and database driver from scratch in-house.",
        problem: "Writing everything in-house was slow, costly, distracted from core business logic, and produced buggy, insecure custom implementations of standard algorithms (like cryptography and TLS).",
        shift: "Software engineering adopted external Dependencies: integrating third-party libraries, packages, and frameworks into a project, shifting engineering focus to domain business logic."
      },
      num: {
        t: "Dependency Classifications & Blast Radius Profiles",
        h: ["Dependency Classification", "Execution Scope / Lifecycle", "Bundled in Production Build?", "Security Attack Vector", "Example Dependency"],
        r: [
          ["Direct Runtime Dependency", "Core application execution in production", "Yes (bundled into runtime artifact)", "High (runs in production; processes customer data)", "`express`, `pg` (PostgreSQL driver), `react`"],
          ["Development Dependency (`devDependencies`)", "Build tools, compilers, linters, test runners", "No (excluded from production bundles)", "Medium (can compromise CI build pipelines / dev machines)", "`typescript`, `eslint`, `vitest`, `webpack`"],
          ["Transitive / Indirect Dependency", "Dependencies required by your dependencies", "Yes (if pulled by runtime dependency)", "Highest (invisible to developers; accounts for 80% of CVEs)", "`left-pad`, sub-dependencies of web frameworks"],
          ["Peer Dependency", "Requires host project to provide specific package version", "Yes (provided by consuming project)", "Version conflict / Diamond Dependency skew", "`react` required by a third-party UI component library"]
        ],
        n: "In software engineering, a Dependency is an external software component that another component requires to execute properly. The modern software ecosystem is characterized by deep, complex **Transitive Dependency Trees**: installing a single direct dependency (such as a popular web framework) can recursively pull in hundreds of indirect transitive dependencies. In 2016, the 'left-pad' incident exposed the fragility of transitive dependency graphs: a developer unpublished an 11-line string padding library from npm, breaking builds for React, Babel, and thousands of enterprise platforms globally within minutes. Today, dependency management relies on automated dependency scanners (such as Dependabot, Snyk, and npm audit) and strict Lockfiles to ensure cryptographic reproducibility and vulnerability patching."
      },
      miss: [
        {
          w: "Your project only depends on the packages explicitly listed in your `package.json` file.",
          r: "Over 80% of the code in modern applications comes from *transitive* dependencies—packages imported by your dependencies, and packages imported by those dependencies."
        },
        {
          w: "Development dependencies (`devDependencies`) cannot cause security vulnerabilities.",
          r: "Malicious devDependencies execute arbitrary code on developer laptops and CI build servers during `npm install`, stealing environment variables, cloud AWS keys, and private SSH credentials."
        },
        {
          w: "More dependencies are always better because you write less code yourself.",
          r: "Every dependency is a liability: a maintenance burden, a potential security vulnerability, and a point of failure; choose dependencies judiciously and avoid trivial packages."
        },
        {
          w: "Using caret ranges (`^1.2.3`) guarantees that npm will never install a breaking change.",
          r: "The caret allows automatic upgrades to newer minor versions, but maintainers frequently introduce accidental breaking changes or bugs in minor releases, which is why Lockfiles are mandatory."
        }
      ],
      trade: {
        buys: [
          "Accelerated delivery velocity: build sophisticated applications in days by composing battle-tested packages.",
          "Standardized implementations: leverage community-audited implementations of complex protocols (TLS, OAuth, JWT).",
          "Focus on core business value: spend engineering time on unique company domain logic rather than utility plumbing.",
          "Continuous community improvements: benefit from performance optimizations and bug fixes authored by global engineers."
        ],
        costs: [
          "Supply chain security vulnerability: transitive dependencies can be hijacked by bad actors to inject malware.",
          "Diamond Dependency conflicts: two libraries requiring incompatible versions of the same third-party package.",
          "Dependency rot liability: unmaintained packages become abandoned, blocking major runtime upgrades.",
          "Production bundle bloat: excessive dependencies slow down web page load times and consume server memory."
        ],
        avoid: [
          "Installing tiny, trivial micro-packages (like `is-odd` or `left-pad`) for logic that takes 2 lines of native code.",
          "Allowing transitive dependencies to remain un-audited without automated vulnerability scanners (Snyk / Dependabot).",
          "Deploying production builds with unpinned dependency versions without a verified lockfile.",
          "Using abandoned dependencies that have had zero commits or security updates in over two years."
        ]
      }
    },
    {
      slug: "lockfile",
      why: {
        before: "Package manifests (`package.json`, `requirements.txt`) declared dependencies using flexible version ranges (like `^1.2.0`), allowing package managers to pull the latest compatible version dynamically on each install.",
        problem: "A build that worked on a developer's laptop on Monday failed in production on Tuesday because a minor dependency updated overnight with a subtle bug, creating the catastrophic 'Works on My Machine' nightmare.",
        shift: "Package managers introduced Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `Cargo.lock`, `poetry.lock`): recording the exact, deterministic tree of all direct and transitive package versions along with cryptographic integrity hashes."
      },
      num: {
        t: "Lockfiles Across Package Ecosystems",
        h: ["Package Manager", "Lockfile Name", "Cryptographic Verification Hash", "Deterministic Resolution Guarantee", "CI Installation Command"],
        r: [
          ["npm", "`package-lock.json`", "SHA-512 integrity hashes (`integrity: sha512-...`)", "Exact version tree and sub-dependency resolution", "`npm ci` (strictly adheres to lockfile; fails if out of sync)"],
          ["pnpm", "`pnpm-lock.yaml`", "Content-addressable cryptographic store hashes", "Zero dependency hoisting; strict isolation tree", "`pnpm install --frozen-lockfile`"],
          ["Yarn (v1 / Berry)", "`yarn.lock`", "Package checksums / SHA integrity", "Deterministic resolution; Zero-Installs support (v2+)", "`yarn install --immutable`"],
          ["Cargo (Rust)", "`Cargo.lock`", "SHA-256 package checksums", "Guarantees byte-for-byte identical binary builds", "`cargo build --locked`"],
          ["Poetry (Python)", "`poetry.lock`", "SHA-256 wheel / sdist hashes", "Locks transitive Python dependencies deterministically", "`poetry install --no-root --sync`"]
        ],
        n: "A lockfile is an automatically generated, machine-readable manifest that captures the state of an application's dependency tree. While the primary manifest (`package.json`) declares abstract version constraints (e.g. `\"react\": \"^18.2.0\"`), the lockfile records the **Exact Resolution**: the exact pinned version (`18.2.0`), the exact download URL, and a cryptographic integrity hash (e.g. SHA-512). When another engineer or a CI/CD build runner installs dependencies, the package manager bypasses version negotiation and reconstructs the exact tree recorded in the lockfile. In continuous integration pipelines, teams execute dedicated clean-install commands (such as `npm ci` or `cargo build --locked`), which strictly enforce the lockfile: if the lockfile does not match the manifest or if dependencies are missing, the command fails immediately rather than silently pulling newer versions."
      },
      miss: [
        {
          w: "You should add `package-lock.json` or `Cargo.lock` to `.gitignore` so it isn't committed to Git.",
          r: "Lockfiles MUST be committed to Git version control; ignoring the lockfile completely destroys build reproducibility, ensuring that CI and production run different dependency versions than local machines."
        },
        {
          w: "Editing `package-lock.json` manually in a text editor is a great way to fix merge conflicts.",
          r: "Never manually edit lockfiles; lockfiles contain delicate cryptographic hashes and dependency trees; resolve merge conflicts by running `npm install` or `pnpm install` to let the package manager re-synthesize the tree."
        },
        {
          w: "Running `npm install` in CI/CD pipelines is the best practice for deploying production code.",
          r: "`npm install` can update the lockfile or pull newer versions within allowed ranges; CI pipelines must always run `npm ci` (or `pnpm install --frozen-lockfile`), which strictly respects the lockfile without mutating it."
        },
        {
          w: "A lockfile prevents you from ever updating your dependencies in the future.",
          r: "Lockfiles preserve stability, but dependencies can be intentionally updated at any time by running explicit upgrade commands (e.g. `npm update` or `npm install package@latest`)."
        }
      ],
      trade: {
        buys: [
          "100% deterministic builds: guarantees every developer, CI runner, and production server runs the exact same dependency code.",
          "Cryptographic supply-chain defense: SHA integrity hashes verify that downloaded packages have not been tampered with or modified.",
          "Ultra-fast CI installations: tools like `npm ci` skip expensive dependency resolution algorithms, installing directly from the lockfile.",
          "Elimination of overnight breakage: protects production builds from bugs introduced in unpinned third-party minor releases."
        ],
        costs: [
          "Git merge conflicts: concurrent branches adding different dependencies generate large, painful lockfile merge conflicts.",
          "Massive git diffs: updating a single package can alter hundreds of lines in the lockfile, cluttering pull requests.",
          "File size overhead: detailed lockfiles for large monorepos can grow to several megabytes in size.",
          "Discipline required: developers must understand the difference between `npm install` (which updates lockfile) and `npm ci`."
        ],
        avoid: [
          "Adding lockfiles (`package-lock.json`, `yarn.lock`, `Cargo.lock`) to `.gitignore`.",
          "Running `npm install` instead of `npm ci` in automated continuous deployment pipelines.",
          "Manually resolving lockfile git conflicts with text editors instead of running the package manager install command.",
          "Deleting the lockfile to 'fix' dependency errors instead of diagnosing the root version conflict."
        ]
      }
    },
    {
      slug: "virtual-environment",
      why: {
        before: "Installing packages (e.g. `pip install requests` or `npm install -g`) installed files directly into global operating system directories (`/usr/lib/python3/dist-packages`), shared by all applications on the machine.",
        problem: "If Project A required Django 3 and Project B required Django 4, installing one broke the other; and updating a global package could break system-critical operating system tools.",
        shift: "Software engineering created Virtual Environments (`venv`, `virtualenv`, `conda`, nvm): isolating dependencies, interpreters, and environment paths on a per-project basis, preventing global package collisions."
      },
      num: {
        t: "Virtual Environment & Runtime Isolation Technologies",
        h: ["Isolation Technology / Tool", "Isolation Boundary / Level", "Path Redirection Mechanism", "Supported Languages", "Primary Engineering Use Case"],
        r: [
          ["Python `venv` (PEP 405)", "Project directory (`.venv/`)", "Sets `sys.prefix` and prepends `.venv/bin` to `$PATH`", "Python", "Isolating project packages; prevents OS python contamination"],
          ["Conda / Mamba", "Isolated environment directories", "Manages isolated Python runtimes, C/C++ libraries, and CUDA drivers", "Python, R, C/C++, Data Science", "Machine learning, scientific computing with binary C/CUDA deps"],
          ["Node.js Local `node_modules`", "Project directory (`node_modules/`)", "Local directory traversal up the tree; npx path resolution", "JavaScript / TypeScript", "Default per-project isolation in Node.js ecosystem"],
          ["Runtime Version Managers (asdf, nvm, rbenv)", "User home directory (`~/.asdf/`)", "Shim executables intercept command; routes to active version", "Multi-language (Node, Ruby, Python, Go)", "Switching between different language runtime versions across projects"],
          ["Docker Container", "Operating System Container Namespace", "Linux cgroups, namespaces, and rootfs container image", "Any language / operating system", "Complete OS-level isolation for microservices and cloud deployments"]
        ],
        n: "A virtual environment is a lightweight, isolated directory tree containing a specific version of a language interpreter along with its own private package site-packages directory. In Python (governed by PEP 405), creating a virtual environment via `python -m venv .venv` creates a local folder with a `pyvenv.cfg` configuration file and symlinks to the system Python binary. When an engineer runs `source .venv/bin/activate`, the activation script modifies the shell's environment: it prepends the `.venv/bin` directory to the shell's `$PATH` variable. Consequently, when the user types `python` or `pip`, the operating system executes the local virtual environment binary rather than the global system executable. The Python interpreter detects `pyvenv.cfg` on startup, setting `sys.prefix` to the local `.venv` directory and restricting package imports strictly to local site-packages."
      },
      miss: [
        {
          w: "A virtual environment is a full virtual machine like VMware or VirtualBox that emulates hardware.",
          r: "A virtual environment is merely a lightweight directory containing symlinks and an updated `$PATH` environment variable; it uses your existing operating system kernel with zero hardware virtualization overhead."
        },
        {
          w: "Node.js projects require activating a virtual environment like Python does.",
          r: "Node.js isolates dependencies by default on a per-project basis inside the local `./node_modules` folder, so manual environment activation is unnecessary."
        },
        {
          w: "You should commit your `.venv` directory to Git version control so coworkers have your packages.",
          r: "Virtual environments contain machine-specific symlinks and binary executables; committing `.venv` breaks coworkers' machines and bloats repositories (always ignore via `.gitignore` and share `requirements.txt`)."
        },
        {
          w: "Running `pip install` with `sudo` is the best way to fix permission errors on Linux.",
          r: "Running `sudo pip install` corrupts the operating system's package manager (apt/dnf) and breaks system tools; modern Linux distributions (Debian/Ubuntu PEP 668) explicitly block this, mandating virtual environments."
        }
      ],
      trade: {
        buys: [
          "Total project dependency isolation: run Project A (Django 3) and Project B (Django 4) on the same machine without conflict.",
          "Protection of operating system stability: prevents application package installations from breaking system tools.",
          "Reproducible development environments: ensure all developers install the exact same dependency versions.",
          "Effortless cleanups: deleting a project's dependencies requires simply deleting the local `.venv` folder."
        ],
        costs: [
          "Activation friction: developers must remember to activate the virtual environment (`source .venv/bin/activate`) before running code.",
          "Disk space duplication: having 10 Python projects can mean duplicating identical packages across 10 `.venv` folders.",
          "IDE configuration overhead: developers must configure their IDE (VS Code, PyCharm) to point to the correct virtual interpreter.",
          "Shebang mismatch bugs: scripts running outside of an active virtual environment accidentally run against system Python."
        ],
        avoid: [
          "Committing virtual environment directories (`.venv`, `env/`) to Git version control.",
          "Running `pip install` globally or using `sudo pip install` on developer workstations.",
          "Forgetting to activate the virtual environment in terminal sessions before installing new packages.",
          "Using different Python minor versions between local virtual environments and production deployments."
        ]
      }
    },
    {
      slug: "environment-variable",
      why: {
        before: "Configuration settings (database passwords, API secrets, server ports, environment modes) were hardcoded directly into application source code files.",
        problem: "Committing code to version control exposed production credentials to unauthorized developers; and changing a database URL required rebuilding and redeploying the entire codebase.",
        shift: "The Twelve-Factor App methodology formalized Environment Variables: injecting configuration dynamically into operating system processes from the deployment environment, strictly separating code from config."
      },
      num: {
        t: "Environment Variables Across Deployment Tiers",
        h: ["Environment Variable Tier", "Storage / Injection Mechanism", "Resolution Precedence", "Security Classification", "Primary Real-World Example"],
        r: [
          ["Local Developer `.env` File", "Plaintext local file parsed via `dotenv` library", "Lowest (overridden by host environment)", "Strictly private (MUST be in `.gitignore`)", "`DATABASE_URL=postgres://localhost/dev`"],
          ["Host OS Environment (`export`)", "POSIX Process Environment Block (`environ`)", "Moderate (overrides `.env` file values)", "In-memory process scope", "`export PORT=8080` in terminal or startup script"],
          ["CI/CD Secrets", "Encrypted secrets store in GitHub Actions / GitLab", "Injected as temporary env vars into CI runner", "Encrypted at rest; masked in build logs", "`NPM_TOKEN`, `AWS_SECRET_ACCESS_KEY`"],
          ["Cloud Orchestration (K8s Secrets)", "Kubernetes Secret / ConfigMap mounted into Pod", "Highest (injected into container process)", "Base64 encoded / KMS encrypted at rest", "`STRIPE_SECRET_KEY` injected into production pod"]
        ],
        n: "An Environment Variable is a dynamic named value stored within the operating system process's Environment Block (accessible in C via `char **environ`, in Node via `process.env`, and in Python via `os.environ`). When a parent process launches a child process (via `fork()` or `execve()`), the operating system by default copies the parent's environment block to the child. Under Principle III of the Twelve-Factor App ('Config in the Environment'), an application's source code remains completely agnostic of whether it is running in local development, staging, or production; all differences between deployments are governed exclusively by environment variables. For local developer convenience, developers use `.env` files parsed by libraries like `dotenv`, which populate `process.env` only for variables not already defined by the host environment."
      },
      miss: [
        {
          w: "Committing a `.env` file containing API keys to a private GitHub repository is safe.",
          r: "Private repositories are frequently cloned to compromised laptops or made public accidentally; secrets committed to Git history are permanently compromised and should be rotated immediately."
        },
        {
          w: "Environment variables embedded into frontend React/Next.js code (`NEXT_PUBLIC_...`) remain secret.",
          r: "Any environment variable prefixed for client-side inclusion is bundled directly into public JavaScript files sent to users' browsers, where anyone can inspect them via DevTools."
        },
        {
          w: "All environment variables in Node.js are automatically parsed into typed numbers and booleans.",
          r: "`process.env` values are strictly strings; `process.env.PORT` is `'3000'` (not `3000`), and `process.env.ENABLE_FEATURE` containing `'false'` evaluates as *truthy* unless explicitly parsed."
        },
        {
          w: "Changing an environment variable on a server updates running processes immediately.",
          r: "Environment variables are read during process startup; modifying host environment variables requires restarting the application process for the changes to take effect."
        }
      ],
      trade: {
        buys: [
          "Strict separation of code and config: build a single immutable Docker container and deploy it to dev, staging, and prod.",
          "Credential security: keep production API keys and database passwords out of git version control repositories.",
          "Zero-recompile configuration: update server ports, log levels, and feature flags without rebuilding binaries.",
          "Universal cloud compatibility: native integration across Docker, Kubernetes, AWS ECS, Heroku, and serverless lambdas."
        ],
        costs: [
          "Lack of type safety: environment variables are always strings, requiring manual parsing into integers and booleans.",
          "The 'Missing Env' crash: forgetting to set an environment variable in production causes application startup crashes.",
          "Leaking secrets via logs: printing `process.env` in debug logs can accidentally expose API keys in centralized logging tools.",
          "Frontend exposure confusion: developers confuse backend private environment variables with public client-side variables."
        ],
        avoid: [
          "Committing `.env` files containing real production credentials to Git (always include `.env` in `.gitignore`).",
          "Putting backend private secrets (like Stripe Secret Keys) into client-facing `NEXT_PUBLIC_` variables.",
          "Accessing `process.env` throughout the codebase without validating it through a typed validation schema (e.g. Zod).",
          "Assuming `process.env.FLAG === false` checks boolean false (string `'false'` evaluates to truthy)."
        ]
      }
    },
    {
      slug: "configuration-file",
      why: {
        before: "Applications configured complex settings (database schemas, routing rules, multi-tier permission policies) using hundreds of individual command-line flags or hardcoded constants in code.",
        problem: "Passing 50 command-line arguments to launch an application was unmanageable; and modifying configuration required editing source code and redeploying binaries.",
        shift: "Software engineering standardized Configuration Files (`.json`, `.yaml`, `.toml`, `.ini`): structured, human-readable data files that externalize application settings from executable code."
      },
      num: {
        t: "Configuration File Formats & Structural Profiles",
        h: ["Config Format", "Syntax / Structure", "Data Types & Schema Support", "Human Readability / Editing", "Primary Industry Domain"],
        r: [
          ["JSON (`.json`)", "Strict syntax (double quotes, commas, brackets)", "Strings, numbers, booleans, arrays, objects; NO comments", "Moderate (strict syntax errors on trailing commas)", "Web application manifests (`package.json`, `tsconfig.json`)"],
          ["YAML (`.yaml` / `.yml`)", "Indentation-based whitespace hierarchy; supports comments", "Rich types, anchors, references, multi-line strings", "High (very readable, but whitespace indentation errors occur)", "Cloud infrastructure (Kubernetes, Docker Compose, CI/CD)"],
          ["TOML (`.toml`)", "Table-based key-value sections (`[section]`)", "Explicit types, dates, times, arrays of tables; supports comments", "Highest for human configuration (unambiguous syntax)", "Modern language packaging (`Cargo.toml`, `pyproject.toml`)"],
          ["INI / Properties (`.ini` / `.env`)", "Simple key-value pairs grouped by `[headers]`", "Flat string values only (no nested objects)", "High for simple configurations; limited for complex structures", "Legacy Windows configs, Git config (`.gitconfig`), desktop apps"]
        ],
        n: "A configuration file externalizes non-code operational parameters from executable software. In modern cloud-native architectures, configuration follows a strict **Hierarchical Cascade**: configuration parameters are resolved with defined precedence (typically: Command-Line Flags > Environment Variables > Local Config Files > Default Fallbacks). A major evolution in configuration engineering is the shift from unstructured configuration files to Schema-Validated Configuration (e.g. using JSON Schema, Cue, or Pydantic): an IDE or build validator verifies the configuration file against a formal schema, flagging typos, invalid enum values, and missing required parameters before the application ever attempts to boot."
      },
      miss: [
        {
          w: "Standard JSON is the best format for human-authored configuration files.",
          r: "Standard JSON explicitly forbids code comments (`//`) and rejects trailing commas, making it hostile for human maintenance; TOML and YAML are specifically designed for human configuration."
        },
        {
          w: "YAML is always superior to JSON because it requires fewer curly braces.",
          r: "YAML's whitespace indentation sensitivity and ambiguous parsing rules (such as Norway's country code `NO` being parsed as boolean `false`) cause notorious production configuration bugs."
        },
        {
          w: "Configuration files should store production database passwords and secret API tokens.",
          r: "Configuration files checked into Git must *never* contain secrets; secrets belong in environment variables or secret management vaults (Vault, AWS Secrets Manager)."
        },
        {
          w: "An application should read its configuration file from disk on every single incoming HTTP request.",
          r: "Reading and parsing configuration files from disk adds heavy I/O latency; configuration files should be parsed once at application startup and cached in memory."
        }
      ],
      trade: {
        buys: [
          "Externalized operational behavior: alter timeouts, feature flags, and database endpoints without recompiling code.",
          "Hierarchical structured settings: cleanly represent complex nested architectures, routing tables, and permission matrices.",
          "Schema validation tooling: IDEs validate configuration files against JSON Schemas, providing auto-completion and error checks.",
          "Auditable infrastructure changes: tracking configuration files in Git (GitOps) provides a complete history of system changes."
        ],
        costs: [
          "Syntax and indentation errors: subtle indentation mistakes in YAML files can silently misconfigure cloud infrastructure.",
          "Schema drift liability: configuration files can fall out of sync with evolving software versions without validation checks.",
          "Parsing startup latency: parsing multi-megabyte XML or YAML configuration files adds seconds to application startup times.",
          "Security leak risk: developers accidentally commit private configuration files containing passwords to public repositories."
        ],
        avoid: [
          "Committing private API keys, database passwords, or private certificates inside configuration files.",
          "Using standard JSON for configuration files where explanatory comments are needed (use TOML, YAML, or JSONC).",
          "Reading and parsing configuration files from disk inside hot request-response loops (parse once at startup).",
          "Deploying configuration changes without automated schema validation tests in CI pipelines."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
