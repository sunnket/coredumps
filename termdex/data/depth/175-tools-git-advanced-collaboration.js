(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "scaffolding",
      why: {
        before: "Setting up a new project or module required engineers to manually construct directory trees, configure dozens of build and lint config files, and write identical boilerplate connection code from scratch.",
        problem: "Manual setup was slow, inconsistent, and highly error-prone: critical security headers, type configurations, and folder naming conventions diverged across teams, creating fragmented organizational architectures.",
        shift: "Scaffolding tools automate project and feature bootstrapping by evaluating declarative blueprints or schemas, synthesizing complete directory structures, dependencies, tests, and configuration files in seconds."
      },
      num: {
        t: "Scaffolding Paradigms, AST Manipulation, and Tooling Systems",
        h: ["Scaffolding Tool / Engine", "Generation Paradigm", "Template Mechanism", "AST Modification Capability", "Primary Use Case"],
        r: [
          ["Create Next App / Vite Init", "Interactive CLI interactive prompt", "Static file cloning with token substitution", "Minimal; overwrites configuration manifests", "Greenfield full-stack application bootstrapping"],
          ["NestJS CLI / Angular Schematics", "AST-aware structural code generator", "TypeScript AST transforms via TypeScript compiler API", "High; injects imports and updates module decorators", "Adding modules, services, and controllers to active codebases"],
          ["Rails Scaffolding", "Schema-driven Full-stack CRUD generator", "ERB templates compiled against DB schema", "Moderate; updates routes.rb and database migrations", "Instant RESTful resource, model, controller, and view generation"],
          ["Hygen / Plop.js", "Micro-generator templates in local repo", "Handlebars/EJS templates driven by CLI prompts", "Moderate; regex-based code injection or jscodeshift", "Standardizing internal team components, hooks, and test fixtures"],
          ["Cookiecutter / Copier", "Language-agnostic repository template", "Jinja2 templating with Git repository cloning", "None; purely file and directory path substitution", "Bootstrapping data science pipelines, libraries, and microservices"]
        ],
        n: "Scaffolding engines operate across two architectural tiers: whole-repository initializers and incremental AST-aware code generators. While simple initializers perform file-tree copies with lexical string replacements $\\text{Output} = \\text{Replace}(\\text{Template}, \\text{Variables})$, advanced enterprise engines (e.g., Angular Schematics or Nest CLI) operate on the Abstract Syntax Tree (AST). When generating a new controller or service, the engine parses consumer module files into an AST, walks the tree to locate the target decorator or module class, constructs new AST nodes for imports and provider arrays, and emits formatted code. This ensures zero syntax corruption and seamless dependency injection wiring without manual developer intervention."
      },
      miss: [
        {
          w: "Scaffolding tools are only useful for absolute beginners bootstrapping their first simple app.",
          r: "Staff and principal engineers rely heavily on scaffolding tools (e.g., Plop, Cookiecutter) to enforce architectural standards, compliance rules, and testing requirements across hundreds of microservices."
        },
        {
          w: "Scaffolded code is meant to be completely isolated and never modified after initial generation.",
          r: "Scaffolding provides the baseline architectural shell; domain business logic, custom validations, and bespoke algorithms are intended to be actively implemented directly within the generated files."
        },
        {
          w: "Using a third-party full-stack scaffold generator ensures production-ready security by default.",
          r: "Many popular community starter generators package outdated dependencies, insecure default permissions, or excessive boilerplate libraries that introduce immediate technical and security debt."
        },
        {
          w: "AST-based scaffolding generators can never corrupt existing codebase syntax.",
          r: "Complex AST manipulations can fail when encountering non-standard syntax, unformatted source files, or unexpected code arrangements, necessitating strict automated testing and Git validation."
        }
      ],
      trade: {
        buys: [
          "Instant time-to-first-commit: bootstraps fully functioning, compilable architectures in seconds.",
          "Strict organizational consistency across folder layouts, naming patterns, lint rules, and test harnesses.",
          "Automated wiring of repetitive glue code (e.g., routing tables, dependency injection containers).",
          "Reduced cognitive burden on developers when creating standard architectural components."
        ],
        costs: [
          "Risk of generating massive volumes of unneeded code that developers do not understand.",
          "Maintenance burden of updating custom internal organizational generators as frameworks evolve.",
          "Inflexible architectures if the generator enforces opinions that conflict with specific domain needs.",
          "Developer atrophy if engineers rely entirely on generators without understanding underlying configurations."
        ],
        avoid: [
          "Using massive kitchen-sink public starter generators containing dozens of unknown libraries and tools.",
          "Modifying generated files without understanding the structural conventions established by the framework.",
          "Neglecting to version-control and unit-test custom internal team scaffolding generators.",
          "Allowing generated boilerplate to remain untouched when the corresponding feature requirements change."
        ]
      }
    },
    {
      slug: "jupyter-notebook",
      why: {
        before: "Data scientists and researchers wrote exploratory analysis and visualization scripts in flat Python files, repeatedly re-running long-running data imports from scratch on every minor change.",
        problem: "Iterating on heavy computations (training models, parsing gigabytes of data) was painfully slow; inspecting intermediate array states or rendering inline charts required cumbersome debuggers or temporary image exports.",
        shift: "Jupyter Notebooks introduce literate computing: an interactive browser document interleaving live executable code cells, markdown prose, mathematical LaTeX formulas, and dynamic visualizations backed by a stateful kernel."
      },
      num: {
        t: "Jupyter Computational Architecture, Protocol Primitives, and Formats",
        h: ["Component / Layer", "Underlying Technology", "Communication Protocol", "State Persistence", "Primary Vulnerability / Hazard"],
        r: [
          ["Frontend Web UI (JupyterLab)", "TypeScript / React / Lumino", "WebSocket connection to Jupyter Server", "In-memory DOM state + JSON autosave", "Browser memory exhaustion on massive rendered outputs"],
          ["Jupyter Server", "Python (Tornado / Jupyter Server)", "HTTP REST (file management) + WebSocket", "Filesystem disk persistence (.ipynb JSON)", "Unauthenticated remote code execution if token leaks"],
          ["IPython Kernel", "Python daemon process (ipykernel)", "ZeroMQ sockets (Shell, IOPub, Stdin, Control, Heartbeat)", "Persistent long-lived OS process memory heap", "Hidden state out-of-order execution bugs"],
          ["ZeroMQ IOPub Socket", "High-throughput messaging queue", "JSON wire protocol with HMAC-SHA256 signing", "Ephemeral streaming message frames", "Socket saturation during unbounded print loops"],
          [".ipynb Document File", "JSON schema (nbformat v4)", "Static file serialization on disk", "Full code, markdown, and base64 output blobs", "Git diff merge conflicts caused by volatile execution counts"]
        ],
        n: "The Jupyter architecture decouples the editing interface from code execution via the Jupyter Messaging Protocol over ZeroMQ. The user document is stored as a structured JSON object containing an array of cells, metadata, and embedded execution outputs (including inline Base64-encoded PNGs). When a user executes a cell, the server transmits an `execute_request` message over a ZeroMQ Shell socket to the kernel. The kernel executes the code against its persistent memory space, broadcasting execution counters, stdout/stderr streams, and MIME-typed display data back over the IOPub socket. Because cell execution is user-driven and non-linear, the runtime state satisfies $S_t = f(C_k, S_{t-1})$, meaning kernel state depends entirely on the historical order of cell execution rather than the top-to-bottom layout of the document."
      },
      miss: [
        {
          w: "A Jupyter notebook executes top-to-bottom like a standard Python script when you run cells interactively.",
          r: "Cells can be executed in any arbitrary visual order, creating 'hidden state' where variables in memory reflect past cell runs that may have been deleted, edited, or reordered."
        },
        {
          w: "Checking .ipynb notebook files directly into Git provides clean, reviewable pull request diffs.",
          r: ".ipynb files are verbose JSON blobs containing execution counters, volatile cell metadata, and massive Base64 image payloads that cause catastrophic Git merge conflicts."
        },
        {
          w: "Jupyter notebooks are production-ready artifacts suitable for deploying scheduled backend jobs.",
          r: "Production jobs require modular Python packages, proper dependency isolation, structured logging, and unit tests; executing raw notebooks in production obscures stack traces and hinders debugging."
        },
        {
          w: "Restarting a Jupyter kernel erases the notebook file contents from your computer disk.",
          r: "Restarting the kernel clears only the ephemeral in-memory Python process variables; all saved code cells, markdown blocks, and rendered outputs in the .ipynb file remain preserved."
        }
      ],
      trade: {
        buys: [
          "Supercharged exploratory data analysis: retain massive datasets in memory while rapidly iterating on analysis.",
          "Rich literate programming: seamlessly combine executable code, LaTeX equations, narrative text, and interactive charts.",
          "Immediate visual feedback loop for machine learning model evaluation and exploratory data exploration.",
          "Standard lingua franca for academic research, data science prototyping, and machine learning tutorials."
        ],
        costs: [
          "Severe hidden state hazard: non-linear cell execution frequently causes unrepeatable analysis results.",
          "Terrible version control compatibility: raw JSON format produces noisy, unreadable Git diffs and conflicts.",
          "Lack of software engineering discipline: discourages modular functions, unit testing, and type safety.",
          "Memory leakage and browser sluggishness when displaying thousands of log lines or massive high-res plots."
        ],
        avoid: [
          "Sharing or publishing a notebook without executing a clean 'Restart Kernel and Run All Cells' verification.",
          "Committing gigabytes of Base64 image outputs or raw data into Git (use tools like nbstripout or Jupytext).",
          "Writing monolithic 500-line code blocks inside a single notebook cell instead of extracting modular libraries.",
          "Deploying raw notebooks to run critical production data pipelines without refactoring into tested scripts."
        ]
      }
    },
    {
      slug: "repository",
      why: {
        before: "Developers tracked project versions by duplicating folders (e.g., `project_v1`, `project_final_v2`), emailing zip archives, or using centralized locking servers (CVS, SVN) requiring continuous network connectivity.",
        problem: "Folder duplication led to catastrophic file overwrites, lost changes, zero commit traceability, and an inability to branch or experiment safely; centralized servers halted all work if the central network crashed.",
        shift: "A distributed repository models project history as an immutable, content-addressable directed acyclic graph (DAG) of cryptographic snapshots, granting every developer a full, offline-capable clone of the entire history."
      },
      num: {
        t: "Git Repository Internals, Object Storage, and Graph Primitives",
        h: ["Object Type", "Cryptographic Header", "Payload Contents", "Storage Mechanism", "Immutability Rule"],
        r: [
          ["Blob", "blob <size>\\0", "Raw byte content of a specific file version", "zlib-compressed loose object in .git/objects/xx/", "Content-addressed SHA-1/SHA-256; zero metadata stored"],
          ["Tree", "tree <size>\\0", "List of file modes, object types, hashes, and filenames", "zlib-compressed tree object representing directory state", "Hash changes if any nested file content or filename changes"],
          ["Commit", "commit <size>\\0", "Tree hash, parent commit hash(es), author, committer, message", "Immutable DAG node capturing full project snapshot", "Cryptographically seals parent history and tree state"],
          ["Annotated Tag", "tag <size>\\0", "Target commit hash, tagger info, GPG signature, message", "Permanent pointer to a specific commit hash", "Cryptographically verifiable release milestone"],
          ["Packfile (.pack/.idx)", "PACK header + checksum", "Delta-compressed object streams with binary index lookup", "Consolidated single file for disk and network efficiency", "Generated via git gc; optimizes I/O traversal times"]
        ],
        n: "A Git repository is fundamentally an immutable, content-addressable key-value store paired with a Directed Acyclic Graph (DAG). Every entity is addressed by its cryptographic digest $H = \\text{SHA-1}(\\text{header} + \\text{content})$. Unlike delta-storage version control systems, Git stores complete snapshots. When a commit is created, files are converted to blobs, directories to trees, and a commit object is synthesized referencing the root tree and parent commit(s): $C_t = \\text{Hash}(\\text{Tree}, \\{C_{t-1}\\}, \\text{Author}, \\text{Timestamp})$. References (branches in `refs/heads/` and tags in `refs/tags/`) are merely mutable pointers containing a 40-character hex hash. Because every commit includes the hash of its parent, history is cryptographically tamper-evident: modifying a historical byte alters all descendant hashes."
      },
      miss: [
        {
          w: "A Git repository stores file changes as incremental diffs or deltas between consecutive versions.",
          r: "Git fundamentally stores full snapshot trees of files as content-addressed blobs; delta compression is applied only as an internal optimization during packfile garbage collection."
        },
        {
          w: "Deleting a branch in a Git repository permanently destroys all commits authored on that branch.",
          r: "Deleting a branch merely removes a 41-byte pointer file from refs/heads/; the underlying commit objects remain intact in the DAG and recoverable via git reflog until garbage collected."
        },
        {
          w: "Git branches are heavy, disk-intensive copies of the entire project directory tree.",
          r: "A Git branch is simply a 40-byte text file in .git/refs/heads/ storing a commit SHA hash; creating, switching, or deleting branches is virtually instantaneous ($O(1)$ operations)."
        },
        {
          w: "A centralized forge (like GitHub or GitLab) is required for a Git repository to function.",
          r: "Git is completely decentralized; a repository functions fully offline on a local machine, and repositories can synchronize directly peer-to-peer over SSH or local filesystems."
        }
      ],
      trade: {
        buys: [
          "Complete local autonomy: instant branching, committing, diffing, and logging without network access.",
          "Cryptographic auditability: immutable Merkle-DAG guarantees history cannot be quietly altered.",
          "High resilience: every clone acts as a full backup of the entire project history and metadata.",
          "Sophisticated branching and merging models enabling parallel collaboration across distributed teams."
        ],
        costs: [
          "Repository bloat if developers commit large binary assets (videos, datasets, compiled binaries).",
          "Steep conceptual learning curve for developers unfamiliar with DAG mechanics and reflog recovery.",
          "Potential for catastrophic accidental history rewrite if git push --force is used improperly.",
          "Disk consumption scaling over time as long-lived repositories accumulate thousands of loose objects."
        ],
        avoid: [
          "Committing uncompressed binary files, machine learning weights, or database dumps into Git (use Git LFS).",
          "Force-pushing (git push -f) to shared public branches without using --force-with-lease.",
          "Manually altering or editing files inside the internal .git directory without using Git CLI commands.",
          "Treating Git like an operational file backup system instead of a structured version control history."
        ]
      }
    },
    {
      slug: "diff",
      why: {
        before: "Developers compared two versions of a document or codebase by reading both files side-by-side or manually searching line-by-line for subtle alterations.",
        problem: "Manual comparison was excruciatingly slow and blind to whitespace changes, making it nearly impossible to spot critical one-character syntax bugs or merge divergent changes from multiple contributors.",
        shift: "Automated diff algorithms compute the Longest Common Subsequence (LCS) or shortest edit script between two texts, producing compact, unified representations of additions, deletions, and context."
      },
      num: {
        t: "Diff Algorithms, Complexity Bounds, and Heuristics",
        h: ["Algorithm", "Theoretical Time Complexity", "Space Complexity", "Heuristic / Strategy", "Ideal Use Case"],
        r: [
          ["Myers Diff (Standard Git)", "$O((N + M) D)$", "$O(N + M)$", "Greedy graph search finding Shortest Edit Script (SES)", "General-purpose source code diffs with minimal changes"],
          ["Patience Diff", "$O(N \\log N)$ average", "$O(N)$", "Matches unique common lines first to preserve semantic blocks", "Refactored functions, rearranged code, and heavily edited files"],
          ["Histogram Diff", "$O(N)$ average", "$O(N)$", "Frequency-table based acceleration of Patience algorithm", "Fast performance on large files with repeated structural tokens"],
          ["Word / Token Diff", "$O(N \\cdot M)$", "$O(N)$", "Tokenizes on whitespace/punctuation instead of newline characters", "Prose editing, documentation reviews, single-line variable edits"],
          ["Semantic / AST Diff", "$O(T_1 \\cdot T_2)$ tree distance", "$O(\\text{Tree Depth})$", "Computes tree edit distance on parsed AST nodes", "Ignoring code formatting while highlighting genuine logic changes"]
        ],
        n: "The foundational algorithm for text diffing is Eugene Myers' Shortest Edit Script (SES) algorithm, which translates the comparison of two strings $A$ (length $N$) and $B$ (length $M$) into finding the shortest path on an edit graph from $(0,0)$ to $(N,M)$. Diagonal edges represent identical lines ($0$ cost), while horizontal and vertical edges represent deletions and insertions ($1$ cost). Myers' algorithm executes in $O((N+M)D)$ time, where $D$ is the size of the minimal edit script (number of differences). Git represents these differences using the Unified Diff format, grouping modifications into hunks headed by range markers: `@@ -start,count +start,count @@`. In modern workflows, Patience and Histogram diffs improve semantic clarity by anchoring diffs on unique structural lines, preventing mismatched brackets from disorienting human code reviewers."
      },
      miss: [
        {
          w: "A diff algorithm understands the programming language syntax and identifies semantic changes.",
          r: "Standard diff tools operate on raw text lines without syntactic comprehension; an innocent reformatting of curly braces can produce a massive, confusing textual diff."
        },
        {
          w: "If two developers modify the same file in different places, Git will always fail with a merge conflict.",
          r: "Git performs automatic three-way merges: as long as non-overlapping hunks have distinct line ranges and stable context lines, diffs are merged cleanly without human intervention."
        },
        {
          w: "Unified diff line counts (+100, -50) represent the exact number of new net logical statements created.",
          r: "Line counts in diffs reflect raw line operations: moving a function counts as both deleting and adding all its lines unless move detection (--find-copies-harder) is enabled."
        },
        {
          w: "Binary files (images, compiled archives) can be diffed and merged just like plain text files.",
          r: "Standard diff engines rely on newline characters and LCS graph traversal; binary files produce unresolvable byte mismatches and must be replaced wholesale or inspected via specialized tools."
        }
      ],
      trade: {
        buys: [
          "Precise, human-readable isolation of exact textual modifications across file versions.",
          "Automated three-way merging of parallel work streams across distributed software engineering teams.",
          "Efficient bandwidth utilization: Git transmits compact diff hunks and deltas across the network.",
          "Enables high-velocity asynchronous code reviews centered on granular hunk comments."
        ],
        costs: [
          "Textual diffs can obscure genuine architectural movements, treating a moved block as total deletion and recreation.",
          "Computational exhaustion on massive single-line files (e.g., minified JS) where Myers diff degrades to $O(N^2)$.",
          "Risk of false-positive merge success when two logically conflicting changes modify non-overlapping lines.",
          "Visual fatigue caused by noisy diffs when code formatting rules are inconsistently enforced."
        ],
        avoid: [
          "Mixing reformatting changes (indentation, quote styles) with critical functional bug fixes in the same diff.",
          "Reviewing pull requests with thousands of modified lines without splitting them into atomic changesets.",
          "Trusting an automated clean merge diff blindly without executing unit and integration test suites.",
          "Committing generated minified files or build bundles that produce unreadable multi-megabyte diffs."
        ]
      }
    },
    {
      slug: "stash",
      why: {
        before: "Developers needing to urgently switch branches to fix a production bug were forced to either commit half-broken, non-compiling work to their active branch or discard their uncommitted changes.",
        problem: "Creating temporary 'wip' (work-in-progress) commits polluted the Git history with broken builds, while stashing changes in external scratch files often led to lost work and merge confusion.",
        shift: "Git Stash provides an ephemeral, local stack of work-in-progress modifications, capturing the current working directory and index state into dangling commit objects without advancing the branch pointer."
      },
      num: {
        t: "Git Stash Commit Topology, Stack Mechanics, and Index Preservation",
        h: ["Stash Component / Flag", "Commit Tree Topology", "Index State Handling", "Untracked Files Handling", "Recovery Risk"],
        r: [
          ["Standard Stash (git stash)", "2-parent commit ($C_{\\text{stash}} \\to C_{\\text{HEAD}}, C_{\\text{index}}$)", "Collapsed into working tree on restore", "Ignored; remains in working tree", "Low; stored in refs/stash reflog stack"],
          ["Index-Preserving (git stash --keep-index)", "2-parent commit with staging isolation", "Preserves staged vs unstaged separation", "Ignored", "Low; allows testing staged code independently"],
          ["Include Untracked (-u / --include-untracked)", "3-parent commit ($C_{\\text{stash}} \\to C_{\\text{HEAD}}, C_{\\text{idx}}, C_{\\text{untracked}}$)", "Restores index and new files cleanly", "Captured in third commit parent", "Safe; cleans working directory completely"],
          ["All Inclusive (-a / --all)", "3-parent commit including ignored files", "Restores all files including .gitignore", "Captures ignored build artifacts and node_modules", "High disk consumption; stashes build bloat"],
          ["Popped Stash (git stash pop)", "Applies diff and drops top stack entry", "Reapplies changes; may trigger merge conflict", "Restored to working tree", "Moderate; dropped on success, retained on conflict"]
        ],
        n: "Under the hood, `git stash` does not write to a flat temporary file; it synthesizes a special commit topology with two or three parent commits. The primary stash commit $C_{\\text{stash}}$ points to the current branch commit $C_{\\text{HEAD}}$ as its first parent and a synthesized commit $C_{\\text{index}}$ (representing the staged index) as its second parent. If `--include-untracked` is invoked, a third parent $C_{\\text{untracked}}$ is created to store newly created files. The reference `refs/stash` points to the most recent stash commit, and successive stashes are tracked via the reflog of `refs/stash` like a Last-In, First-Out (LIFO) stack: $\\text{stash}@{0}, \\text{stash}@{1}, \\dots$. When running `git stash pop`, Git executes a three-way merge between $C_{\\text{HEAD}}$, $C_{\\text{stash}}$, and the working tree."
      },
      miss: [
        {
          w: "Git stash is a shared team feature that synchronizes across remote repositories on git push.",
          r: "Git stash is strictly local to your specific machine and clone; stashes are stored in local reflogs and are never pushed to remote remotes."
        },
        {
          w: "Running git stash saves every single file in your project folder, including newly created files.",
          r: "By default, git stash ignores untracked files and ignored files; newly created files are completely skipped unless the -u (--include-untracked) flag is passed."
        },
        {
          w: "If git stash pop encounters a merge conflict, your stashed changes are deleted and permanently lost.",
          r: "When a merge conflict occurs during a pop, Git halts, preserves your modified files with conflict markers, and leaves the stash intact on the stash stack until resolved."
        },
        {
          w: "Git stash is the recommended long-term storage mechanism for unfinished feature work.",
          r: "Stashes lack descriptive commit messages, branch context, and remote backup; unfinished work spanning days should always be saved on a dedicated feature branch."
        }
      ],
      trade: {
        buys: [
          "Instant context switching: shelve half-finished, uncompilable code in seconds without polluting Git history.",
          "Safe state reset: cleans the working tree to allow emergency hotfix checkouts or clean pull rebases.",
          "Granular control: option to preserve staged index changes or include untracked scratch files.",
          "Zero branch overhead: no need to invent disposable branch names for quick 5-minute interruptions."
        ],
        costs: [
          "Lack of remote backup: if your local drive dies or folder is wiped, all stashes are permanently lost.",
          "Hidden stack hazard: developers accumulate dozens of forgotten stashes (stash@{14}), creating confusion.",
          "Merge conflict friction when popping an old stash onto a branch that has diverged significantly.",
          "Loss of staged status on default stash pop unless the --index flag is explicitly provided."
        ],
        avoid: [
          "Using git stash as a long-term archiving mechanism for important experimental code.",
          "Running git stash drop or git stash clear without verifying stack contents using git stash show -p.",
          "Stashing with -a (--all) in repositories with massive unignored build or dependency directories.",
          "Forgetting that git stash pop removes the item from the stack, whereas git stash apply retains it."
        ]
      }
    },
    {
      slug: "fork",
      why: {
        before: "Contributing to an open-source or external project required requesting direct commit permissions from project owners or emailing unified diff patches to maintainers via mailing lists.",
        problem: "Granting write access to unknown contributors posed catastrophic security and stability risks, while managing thousands of raw email patch files was cumbersome, disorganized, and unscalable.",
        shift: "A fork creates an independent, server-side clone of a repository under a contributor's personal account, allowing unrestricted experimentation and seamless contributions via pull requests without granting upstream write access."
      },
      num: {
        t: "Fork Architecture, Object Deduplication, and Contribution Models",
        h: ["Platform / Dimension", "Storage Optimization", "Permission Isolation", "Sync Mechanism", "Primary Security Boundary"],
        r: [
          ["GitHub Network Fork", "Git alternates / shared object pools", "Completely decoupled access control lists", "Fetch upstream main -> rebase -> push", "Zero write permission to upstream target repo"],
          ["GitLab Fork", "Repository object deduplication (fork networks)", "Project-level member isolation", "Web UI 'Update fork' or manual Git remote sync", "Isolated CI/CD runner secrets and deployment tokens"],
          ["Self-Hosted Git Clone", "Full independent filesystem clone", "Operating system / SSH key user separation", "git remote add upstream <url> && git fetch", "Total network and credential air-gapping"],
          ["Enterprise Internal Fork", "Shared storage across organization namespace", "Role-based access control (RBAC) per fork", "Automated mirror syncing or bot rebase", "Enforces compliance checks before upstream merge"],
          ["Hard Community Fork", "Severed fork relationship; independent project", "Distinct maintainer team and governance", "Selective cherry-picking of upstream security patches", "Protects against hostile takeovers or relicensing"]
        ],
        n: "Architecturally, a fork is a server-side clone combined with an access-control boundary. On platforms like GitHub, forks do not duplicate gigabytes of Git objects on physical disks; instead, they exploit Git's object borrowing mechanism (Git Alternates). The fork and upstream repository share an underlying content-addressable object pool: common blobs, trees, and historical commits are stored once. When the contributor pushes new commits to their fork, only the unique delta objects are written to the fork's storage namespace. This enables $O(1)$ repository provisioning while maintaining complete authorization isolation: the fork owner possesses administrative privileges over their copy, but zero write permissions to the upstream target."
      },
      miss: [
        {
          w: "A fork and a Git branch are fundamentally the same concept with different names.",
          r: "A branch lives inside the exact same repository namespace and shares access permissions; a fork is an entirely distinct repository copy residing under a separate account with decoupled access controls."
        },
        {
          w: "Forks automatically stay synchronized with new commits pushed to the upstream repository.",
          r: "A fork is completely independent; it immediately diverges and falls behind upstream changes unless the developer explicitly fetches and merges or rebases against upstream tracking branches."
        },
        {
          w: "Forking a repository duplicates all private CI/CD secrets and API keys configured on the upstream project.",
          r: "Forks inherit none of the upstream repository's secrets, environment variables, or protected deployment runners, preventing malicious pull requests from stealing production credentials."
        },
        {
          w: "Forks are only used when you plan to permanently split from the original project and start a rival library.",
          r: "While 'hard forks' do split projects permanently, 99% of forks in software development are benign 'collaboration forks' created solely to submit pull requests back to upstream maintainers."
        }
      ],
      trade: {
        buys: [
          "Zero-trust open collaboration: anyone can contribute code without compromising upstream repository security.",
          "Complete freedom for contributors to experiment, create branches, and run custom CI pipelines.",
          "Resource isolation: malicious code or destructive pushes are confined strictly to the contributor's fork.",
          "Preservation of project independence if upstream maintainers abandon the software or alter licensing."
        ],
        costs: [
          "Synchronization overhead: developers must manually maintain upstream remotes to avoid falling out of date.",
          "Duplicated CI compute costs when forks run automated workflows on every experimental branch.",
          "Ecosystem fragmentation if long-lived unmerged forks proliferate and confuse external users.",
          "Management complexity when tracking multiple cross-fork pull requests in large enterprise programs."
        ],
        avoid: [
          "Directly committing new work to the forked repository's main branch instead of dedicated feature branches.",
          "Allowing a fork to fall months behind upstream before attempting to submit a massive, un-mergeable pull request.",
          "Configuring fork CI/CD pipelines to automatically run on untrusted external forks without review.",
          "Creating a public hard fork to fix a minor bug instead of engaging with upstream maintainers."
        ]
      }
    },
    {
      slug: "upstream",
      why: {
        before: "Developers working on forks or local clones had no standardized way to track, fetch, or reconcile changes made to the canonical original project, leading to severe code divergence.",
        problem: "Local branches quickly became obsolete; contributors submitted pull requests containing dozens of merge conflicts or obsolete code because they were building on top of months-old snapshots.",
        shift: "Upstream establishes a canonical remote reference (`upstream`) that links a local clone or fork directly to the authoritative parent repository, enabling seamless background tracking and rebasing."
      },
      num: {
        t: "Remote Tracking Configurations, Network Topologies, and Sync Commands",
        h: ["Remote Name", "Target URL Repository", "Typical Access Level", "Tracking Branch Reference", "Primary Operational Role"],
        r: [
          ["origin", "Contributor's personal fork URL", "Read / Write (Push permitted)", "refs/remotes/origin/main", "Publishing feature branches and initiating pull requests"],
          ["upstream", "Authoritative canonical project URL", "Read-Only (Fetch only)", "refs/remotes/upstream/main", "Fetching latest team changes, tags, and syncing main"],
          ["upstream (branch)", "Upstream tracking branch in git config", "Local configuration mapping", "branch.<name>.remote = origin", "Enables shorthand git pull and git push commands"],
          ["fork-point", "Merge base between branch and upstream", "Local calculation ($O(N)$ graph walk)", "git merge-base --fork-point", "Identifies the exact commit where a feature branch originated"],
          ["mirror", "Automated CI/CD or internal backup clone", "Automated sync bot", "refs/remotes/mirror/*", "Disaster recovery, regional caching, and audit logging"]
        ],
        n: "In distributed Git workflows, the term 'upstream' carries two distinct technical definitions. At the repository level, `upstream` designates a secondary Git remote reference pointing to the canonical parent repository (conventionally added via `git remote add upstream <url>`). At the branch level, 'upstream' refers to the remote-tracking branch associated with the current local branch, configured in `.git/config` via keys `branch.<name>.remote` and `branch.<name>.merge`. When a developer executes `git fetch upstream`, Git downloads missing object packs into `.git/objects` and advances `refs/remotes/upstream/main`. Computing divergences between local branches and upstream relies on symmetric difference graph queries: $\\text{Divergence} = \\text{HEAD} \\dots \\text{upstream/main}$, revealing commits ahead and behind the authoritative source."
      },
      miss: [
        {
          w: "The remote named 'origin' is always the authoritative upstream source of truth for a project.",
          r: "In forked workflows, 'origin' points to your personal writable fork, while 'upstream' is the standard convention for the authoritative parent repository from which you pull updates."
        },
        {
          w: "Running git fetch upstream automatically overwrites your local working code with the latest changes.",
          r: "git fetch only updates remote-tracking pointers (refs/remotes/upstream/*); it never touches your local working tree or branches until you explicitly merge or rebase."
        },
        {
          w: "You must have write permissions to a repository in order to add it as an upstream remote.",
          r: "Upstream remotes require only public read (fetch) access; any public repository on the internet can be configured as an upstream remote to track its commit history."
        },
        {
          w: "Setting an upstream branch tracking reference is only needed for git push, not for git pull.",
          r: "Configuring the upstream tracking branch (--set-upstream or -u) is what enables parameterless git pull to know which remote and branch to fetch and integrate automatically."
        }
      ],
      trade: {
        buys: [
          "Continuous synchronization with the authoritative project, preventing painful merge conflicts later.",
          "Enables clean rebasing of feature branches against fresh upstream code before opening pull requests.",
          "Clear mental separation between your personal sandbox (origin) and the team's source of truth (upstream).",
          "Parameterless git pull and git push commands once branch upstream tracking is established."
        ],
        costs: [
          "Requires manual initial setup (git remote add upstream) for every newly cloned local repository fork.",
          "Cognitive overhead for junior engineers navigating multi-remote Git topologies.",
          "Potential for accidental rebases against outdated local upstream tracking refs if fetch was skipped.",
          "Increased network traffic if automated scripts fetch all branches and tags from massive upstream repositories."
        ],
        avoid: [
          "Attempting to push directly to upstream when you only have contributor fork access.",
          "Rebasing your feature branch on upstream without fetching the latest remote commits first.",
          "Merging upstream changes into feature branches with messy merge commits instead of rebasing.",
          "Hardcoding authentication credentials into the upstream remote URL in plain text."
        ]
      }
    },
    {
      slug: "cherry-pick",
      why: {
        before: "Applying a specific bug fix from an experimental branch or newer release into a production maintenance branch required manually copying and pasting the changed code line-by-line.",
        problem: "Manual code porting was tedious, error-prone, lost original commit authorship and timestamps, and frequently introduced syntax regressions or missed subtle edge-case corrections.",
        shift: "Git cherry-pick applies the precise changes introduced by an existing commit onto a different target branch, executing a three-way merge to synthesize a new commit with preserved intent."
      },
      num: {
        t: "Cherry-Pick Mechanics, Merge Mathematics, and Collision Risk",
        h: ["Cherry-Pick Mode / Option", "Underlying Algorithm", "Commit Hash Outcome", "Metadata Preservation", "Conflict Risk Level"],
        r: [
          ["Standard (git cherry-pick <SHA>)", "3-way merge ($P, C, \\text{HEAD}$)", "New distinct SHA hash generated", "Preserves original author and message; updates committer", "Moderate; depends on divergence between branches"],
          ["Edit Mode (-e / --edit)", "3-way merge with pause for message", "New distinct SHA hash generated", "Author preserved; committer and commit message updated", "Moderate; allows contextualizing why fix was ported"],
          ["No Commit (-n / --no-commit)", "Applies diff to working tree & index", "No commit created; leaves uncommitted", "Zero commit metadata preserved", "Low; allows batching multiple fixes into one commit"],
          ["Range Pick (<A>..<B>)", "Sequential iterative 3-way merges", "Generates $K$ new distinct SHA commits", "Preserves individual commit sequence and authors", "High; earlier conflicts block subsequent commits in range"],
          ["Merge Commit Pick (-m 1 <SHA>)", "Diffs against specified parent index", "New distinct SHA hash generated", "Captures full merge changeset against main line", "Very High; flattening merge changesets risks subtle bugs"]
        ],
        n: "A cherry-pick operates fundamentally as a three-way merge rather than a naive patch application. When running `git cherry-pick C`, where commit $C$ has parent $P$, Git identifies three states: the common ancestor $P$, the source change $C$, and the current branch head $\\text{HEAD}$. Git computes two diffs: $\\Delta_{\\text{source}} = \\text{Diff}(P, C)$ and $\\Delta_{\\text{target}} = \\text{Diff}(P, \\text{HEAD})$. It merges these diffs onto $\\text{HEAD}$. Because the newly generated commit has a different parent ($\\text{HEAD}$ instead of $P$) and a new timestamp, its cryptographic hash is entirely unique: $\\text{SHA}(C') \\neq \\text{SHA}(C)$. Cherry-picking thus duplicates logical changes across the Git DAG, which can complicate future branch merges."
      },
      miss: [
        {
          w: "Cherry-picking a commit moves it from the source branch to the target branch, deleting it from the original.",
          r: "Cherry-pick never deletes or moves anything; it copies the diff introduced by the target commit and applies it as a brand new commit on the active branch, leaving the original intact."
        },
        {
          w: "A cherry-picked commit shares the exact same commit SHA hash as the original commit.",
          r: "Because commit hashes are cryptographic digests of their tree, author, committer timestamp, and parent commit hash, a cherry-picked commit always receives a brand new, unique SHA hash."
        },
        {
          w: "Cherry-picking is the primary recommended workflow for merging feature branches into main.",
          r: "Cherry-picking creates duplicate commits across branches; standard feature integration should use pull request merges or rebases to maintain coherent DAG ancestry."
        },
        {
          w: "You cannot cherry-pick a commit if the original branch was deleted.",
          r: "As long as you know the commit SHA hash (retrievable via git reflog) and the object has not been garbage-collected, any commit in the repository can be cherry-picked."
        }
      ],
      trade: {
        buys: [
          "Surgical transplantation: backport an isolated emergency security or bug fix to production maintenance releases.",
          "Rescue valuable work: pull specific functional commits out of an abandoned or broken experimental branch.",
          "Preserves original commit authorship, attribution, and descriptive explanation.",
          "Avoids bringing unwanted intermediate commits or unfinished features along with the fix."
        ],
        costs: [
          "Introduces duplicate commits into the repository history, creating phantom divergences.",
          "Can cause severe merge conflicts later when the source branch is eventually merged into the target.",
          "High risk of missing hidden dependencies if the cherry-picked commit relied on code in unpicked parent commits.",
          "Operational complexity when cherry-picking multi-parent merge commits (requiring -m flag)."
        ],
        avoid: [
          "Using cherry-pick as a lazy alternative to properly rebasing or merging feature branches.",
          "Cherry-picking a commit without testing that the ported change compiles and passes tests in the older branch context.",
          "Cherry-picking merge commits unless you thoroughly understand parent mainline index resolution (-m 1).",
          "Forgetting to document the source commit hash in the new commit message (use git cherry-pick -x)."
        ]
      }
    },
    {
      slug: "release",
      why: {
        before: "Teams deployed software by manually copying arbitrary source code files from developer laptops to live servers whenever a new feature seemed complete, without formal versioning.",
        problem: "Deploying unversioned snapshots created total operational chaos: teams had no record of which code was running in production, rollbacks were impossible, and debugging customer issues was guesswork.",
        shift: "A release establishes an immutable, auditable milestone that couples a Semantic Version (SemVer) tag with verified build artifacts, automated changelogs, cryptographic signatures, and deployment manifests."
      },
      num: {
        t: "Release Engineering Lifecycle, Artifact Pipelines, and Verification",
        h: ["Release Stage", "Primary Artifact Produced", "Automation Primitive", "Verification Gate", "Rollback Mechanism"],
        r: [
          ["Tagging & Milestoning", "Annotated GPG Git Tag (v2.4.0)", "git tag -s -m 'Release v2.4.0'", "Commit signature verification + Branch protection", "Point deployment to previous immutable git tag"],
          ["Changelog Synthesis", "RELEASE_NOTES.md / GitHub Release", "Conventional Commits parser (semantic-release)", "PR review labels & breaking change flags", "N/A (Documentation update)"],
          ["Artifact Compilation", "Docker Image / Binary / Wheel / npm tarball", "Hermetic CI/CD runner build (GitHub Actions)", "Cryptographic digest generation (SHA-256)", "Pull previous digest from container/package registry"],
          ["Supply Chain Attestation", "SLSA provenance / SBOM (CycloneDX)", "Sigstore / Cosign keyless signing", "In-toto policy validation in cluster admission controller", "Reject unsigned / non-compliant deployment manifests"],
          ["Deployment Progression", "Canary / Blue-Green routing rule", "ArgoCD / Kubernetes rolling update", "Automated canary metrics analysis (error rate, latency)", "Instant traffic shift to passive blue environment / canary abort"]
        ],
        n: "Modern release engineering governs the transformation of committed source code into immutable, verified production software. Under Semantic Versioning (SemVer 2.0.0), versions follow $\\text{MAJOR}.\\text{MINOR}.\\text{PATCH}$, where increments denote breaking API changes, backward-compatible features, and backward-compatible bug fixes, respectively. When a release is triggered, an annotated Git tag $T$ is cryptographically signed using GPG or Sigstore: $\\text{Signature} = \\text{Sign}_{K_{\\text{priv}}}(\\text{TagData})$. The CI/CD pipeline builds hermetic artifacts, generates a Software Bill of Materials (SBOM), and computes cryptographic hashes: $H = \\text{SHA-256}(\\text{Binary})$. Production container registries index artifacts strictly by immutable digest rather than mutable tags, guaranteeing that what passed staging is bit-for-bit identical to what executes in production."
      },
      miss: [
        {
          w: "A release is simply a Git commit on the main branch that everyone agrees to deploy.",
          r: "A release is an audited, immutable package: it requires a cryptographic tag, compiled and tested binaries, dependency SBOMs, a human-readable changelog, and formal release notes."
        },
        {
          w: "Updating a release tag (e.g., deleting and recreating v1.0.0) is a safe way to fix a quick release bug.",
          r: "Tags must be completely immutable; mutating an existing release tag breaks client package caches, violates supply-chain integrity, and can trigger security admission blocks."
        },
        {
          w: "Automated semantic-release tools eliminate the need for human engineering oversight.",
          r: "While automation parses Conventional Commits to increment versions and write changelogs, human engineers must still verify breaking change migrations and operational deployment runbooks."
        },
        {
          w: "Releases are only necessary for commercial software sold directly to external end customers.",
          r: "Internal services, microservices, and shared libraries depend equally on formal releases to prevent unannounced breaking changes from taking down dependent team services."
        }
      ],
      trade: {
        buys: [
          "Absolute deployment determinism: exact knowledge of which binary and commit SHA are executing in production.",
          "Instant, reliable rollbacks by pointing deployment orchestrators back to the previous verified release artifact.",
          "Transparent communication with users and teams via structured, automated release notes and changelogs.",
          "Hardened supply chain security via cryptographic artifact signing and provenance attestations."
        ],
        costs: [
          "Operational overhead of maintaining release automation, GPG keys, and artifact registry pipelines.",
          "Discipline required across all developers to write strict Conventional Commits for automated version bumping.",
          "Storage costs in package and container registries for archiving immutable historical release images.",
          "Friction in release candidate testing phases before general availability (GA) rollout."
        ],
        avoid: [
          "Deploying untagged, unversioned branch heads (e.g., deploying directly from latest main) to production.",
          "Re-using or overwriting existing release version numbers after discovery of a defect (always bump patch).",
          "Manually building production release binaries on developer laptops instead of automated, clean CI runners.",
          "Releasing breaking API changes under minor or patch version bumps, breaking downstream consumers."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
