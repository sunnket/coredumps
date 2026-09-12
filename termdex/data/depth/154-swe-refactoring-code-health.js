(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "refactoring",
      why: {
        before: "When software codebases degraded in readability or modularity, developers either left them to rot or attempted risky, large-scale rewrites that broke existing behaviors and introduced dozens of regressions.",
        problem: "Changing working code without a rigorous framework risked breaking subtle edge cases; teams accumulated unmanageable technical debt because altering code was feared as a destabilizing act.",
        shift: "Martin Fowler and Kent Beck formalized Refactoring: a disciplined technique for restructuring an existing body of code, altering its internal structure without changing its external observable behavior, supported by automated regression tests."
      },
      num: {
        t: "Core Refactoring Patterns & AST Transformations",
        h: ["Refactoring Move / Pattern", "Source Code Smell Addressed", "AST Transformation Mechanism", "Safety Precondition", "Primary Architectural Benefit"],
        r: [
          ["Extract Method / Function", "Long Method (> 30 LOC), duplicated logic", "Extracts AST sub-tree into separate function; passes local variables as parameters", "Identifies all mutated variables in scope; ensures pure outputs", "Improves readability, isolates responsibilities, enables reusability"],
          ["Replace Conditional with Polymorphism", "Switch statements checking type flags", "Creates subclass hierarchy or Strategy objects implementing a common interface", "All conditional branch logic encapsulated in concrete subclasses", "Adheres to Open/Closed Principle; adds new types without altering callers"],
          ["Introduce Parameter Object", "Data Clumps (3+ parameters passed together)", "Encapsulates grouped parameters into a cohesive immutable record/class", "Grouped parameters always co-occur and represent a single domain concept", "Simplifies method signatures; provides dedicated home for domain logic"],
          ["Separate Query from Modifier", "Functions performing both computation and side effects", "Splits method into a pure getter (idempotent) and a void mutation method", "Callers must be updated to execute the command then query state separately", "Eliminates unexpected side effects; guarantees command-query separation (CQS)"],
          ["Extract Class / Module", "Large Class (God Object with too many responsibilities)", "Moves subset of fields and corresponding methods to a new collaborating class", "Clean interface defined between the original and new collaborator", "Restores Single Responsibility Principle; reduces cognitive load"]
        ],
        n: "The formal definition of refactoring strictly requires that the observable behavior of the software remains completely invariant before and after the transformation. If an external consumer or integration test can detect a behavioral difference (such as altered return values, modified HTTP status codes, or new exceptions), the change is a feature modification or bug fix, not a refactoring. Fowler's catalog of refactorings operates as a sequence of atomic, behavior-preserving transformations. Each atomic transformation—such as renaming a variable, inlining a temporary variable, or extracting an interface—is validated instantaneously against an automated suite of unit tests. Modern IDEs (like IntelliJ, VS Code, and Eclipse) automate these transformations by manipulating the Abstract Syntax Tree (AST) directly, ensuring semantic correctness and reference updates across all project call sites."
      },
      miss: [
        {
          w: "Refactoring means fixing bugs and adding new feature functionality at the same time.",
          r: "Refactoring exclusively improves internal code design while preserving exact external behavior; mixing refactoring with bug fixes or new features makes regressions impossible to isolate."
        },
        {
          w: "You can safely refactor a large codebase without having automated regression tests.",
          r: "Refactoring without comprehensive automated tests is gambling; without instantaneous feedback verifying invariant behavior, unintended regressions will silently enter production."
        },
        {
          w: "Refactoring should be scheduled as a multi-month engineering sprint where all product features stop.",
          r: "Refactoring is not a standalone project; it should be practiced continuously as part of everyday development (the Boy Scout Rule: leave the code cleaner than you found it)."
        },
        {
          w: "If a module's code is ugly and messy, rewriting it from scratch is always better than refactoring it.",
          r: "Rewriting from scratch discards decades of hard-won edge case handling, bug fixes, and domain nuances encoded in legacy code, and frequently fails to reach feature parity."
        }
      ],
      trade: {
        buys: [
          "Preserved system longevity: prevents codebases from deteriorating into unmaintainable spaghetti that requires total rewrites.",
          "Accelerated future velocity: clean, modular code allows new features to be added with far less friction and fewer side effects.",
          "Defect reduction: simplifying complex nested logic and eliminating duplication naturally eliminates hidden bug habitats.",
          "Enhanced developer ergonomics: self-documenting code with clear names and small methods lowers cognitive strain."
        ],
        costs: [
          "No immediate user-facing value: refactoring produces zero new features or visible UI improvements for customers.",
          "Regression liability: even with tests, subtle edge cases (like reflection, serialization, or performance timing) can break.",
          "Merge conflict amplification: sweeping structural refactoring across hundreds of files causes merge conflicts for teammates.",
          "Over-engineering temptation: developers can fall into refactoring rabbit holes, gold-plating abstractions that solve no real problem."
        ],
        avoid: [
          "Combining massive refactoring with major business feature changes in a single giant pull request.",
          "Refactoring code paths that lack sufficient automated test coverage without first adding characterization tests.",
          "Over-abstracting simple logic into convoluted design pattern hierarchies that increase cognitive complexity.",
          "Refactoring third-party library calls without verifying runtime reflection or dynamic typing constraints."
        ]
      }
    },
    {
      slug: "technical-debt",
      why: {
        before: "Teams took engineering shortcuts to hit deadlines, viewing the quick code as a permanent cost-saving victory with zero downstream accountability.",
        problem: "As shortcuts accumulated, systems became brittle; minor modifications took weeks instead of hours, bugs proliferated exponentially, and development ground to a complete standstill.",
        shift: "Ward Cunningham coined the financial metaphor of Technical Debt: taking an engineering shortcut is like borrowing money—it accelerates initial delivery, but incurs continuous compounding 'interest' until the principal is repaid through refactoring."
      },
      num: {
        t: "Martin Fowler's Technical Debt Quadrant & Operational Impact",
        h: ["Quadrant Category", "Intent / Origin", "Mindset / Cause", "Interest Compounding Rate", "Remediation Strategy"],
        r: [
          ["Deliberate & Prudent", "Intentional strategic shortcut", "'We must ship now to secure funding; we will refactor next month'", "Moderate; conscious trade-off tracked on engineering backlog", "Schedule dedicated repayment sprints immediately post-launch"],
          ["Deliberate & Reckless", "Intentional laziness / neglect", "'We don't have time for design, tests, or documentation; just hack it together'", "Catastrophic; code rapidly rots into unmaintainable spaghetti", "Impose branch protections, CI quality gates, and architectural review"],
          ["Inadvertent & Prudent", "Accidental discovery through learning", "'Now that we shipped and gathered real user feedback, we realize the domain model is wrong'", "Low; inevitable byproduct of learning and product evolution", "Incremental refactoring as new domain understanding matures"],
          ["Inadvertent & Reckless", "Ignorance of basic engineering principles", "'What is modularity? What is a design pattern? What are unit tests?'", "Extreme; junior/untrained developers writing unmaintainable code", "Engineering mentorship, pair programming, and coding standards"]
        ],
        n: "The technical debt metaphor has precise operational corollaries to financial balance sheets. The 'Principal' is the engineering effort (measured in developer-hours or story points) required to refactor the shortcut into a clean, extensible architectural design. The 'Interest' is the continuous operational drag suffered every day the principal remains unpaid: slower feature development velocity, time spent debugging recurring regressions, increased server infrastructure costs to overcome unoptimized algorithms, and the emotional toll on developer retention. Just as financial debt can be strategically useful for capital investments (e.g., launching a Minimum Viable Product before competitors), technical debt becomes toxic when the recurring interest payments exceed the organization's total engineering capacity, leading to 'technical bankruptcy' where even minor changes cause cascading system-wide outages."
      },
      miss: [
        {
          w: "All technical debt is bad and should be eliminated completely until a codebase has zero debt.",
          r: "Zero technical debt is economically irrational; strategic, deliberate debt taken to validate product-market fit or meet critical regulatory deadlines can be a vital business enabler."
        },
        {
          w: "Technical debt is just another word for messy code written by bad programmers.",
          r: "Much technical debt is prudent and emergent: as an engineering team's understanding of the domain deepens over time, code written a year ago naturally becomes technical debt."
        },
        {
          w: "Business stakeholders and product managers can never understand or support technical debt repayment.",
          r: "When technical debt is quantified in terms of financial interest—slower feature delivery, customer-impacting outages, and increased cloud infrastructure bills—business leaders prioritize its repayment."
        },
        {
          w: "Refactoring a broken system from scratch in a total rewrite is the best way to pay off technical debt.",
          r: "Total rewrites almost always incur massive technical debt of their own; paying off debt incrementally via the Strangler Fig pattern delivers value safely without halting business progress."
        }
      ],
      trade: {
        buys: [
          "Immediate time-to-market speed: permits rapid shipping of critical features to capture market windows or secure customer contracts.",
          "Early user feedback: enables gathering real-world user validation before investing heavily in enterprise-grade architecture.",
          "Pragmatic resource allocation: prioritizes engineering capital on high-uncertainty prototypes rather than premature optimization.",
          "Business flexibility: allows startups to pivot rapidly without being weighed down by rigid, over-engineered architectures."
        ],
        costs: [
          "Compounding engineering drag: interest payments manifest as progressively slower feature velocity across the entire team.",
          "Heightened defect rates: brittle, hacky code introduces unexpected edge-case bugs and production outages.",
          "Developer attrition and morale decay: talented engineers leave organizations where they spend all day wrestling with spaghetti code.",
          "System opacity: obscure workarounds and lack of documentation make onboarding new engineers painfully slow."
        ],
        avoid: [
          "Taking on reckless, undocumented debt without recording the deliberate trade-off and repayment plan.",
          "Letting technical debt interest compound until the team spends 90% of every sprint fixing legacy regressions.",
          "Hiding technical debt from product leadership instead of communicating the measurable impact on delivery speed.",
          "Treating routine maintenance (upgrading dependencies, patching security CVEs) as optional technical debt."
        ]
      }
    },
    {
      slug: "code-smell",
      why: {
        before: "Developers evaluated code health subjectively using vague phrases like 'this code looks ugly' or 'it feels wrong', with no shared technical vocabulary to pinpoint exact architectural deficiencies.",
        problem: "Subjective debates caused friction in code reviews; teams failed to diagnose the root structural issues that led to bugs, resulting in superficial fixes that masked deeper architectural flaws.",
        shift: "Kent Beck and Martin Fowler defined Code Smells: surface indications in source code that usually correspond to deeper architectural problems, cataloged with clear names, diagnostic indicators, and corresponding refactoring recipes."
      },
      num: {
        t: "Fowler & Beck Code Smell Taxonomy & Refactoring Cures",
        h: ["Code Smell Category", "Diagnostic Indicator / Symptom", "Structural Violation", "Risk to Codebase", "Primary Refactoring Cure"],
        r: [
          ["Long Method / Function", "Function exceeding 30-40 lines; handles multiple tasks", "Violation of Single Responsibility Principle", "High cognitive load; difficult to test edge cases", "Extract Method / Function into smaller named helpers"],
          ["Large Class (God Object)", "Class with dozens of fields, methods, and 1000+ LOC", "Low cohesion; class knows and does too much", "Becomes central point of coupling and merge conflicts", "Extract Class; separate domain responsibilities"],
          ["Feature Envy", "Method accesses another object's fields more than its own", "Misplaced responsibility; data and logic separated", "High coupling across domain boundaries", "Move Method into the object whose data is being manipulated"],
          ["Primitive Obsession", "Using basic types (strings, numbers) for rich domain concepts (e.g. currency, phone, zip)", "Lack of domain modeling; scattered validation", "Validation logic duplicated everywhere; invalid states allowed", "Replace Data Value with Object (Value Object pattern)"],
          ["Data Clumps", "The same 3 or 4 fields repeatedly passed together across functions", "Implicit conceptual entity left unformalized", "Inconsistent parameter order; parameter list bloat", "Introduce Parameter Object / Preserve Whole Object"],
          ["Shotgun Surgery", "A single small change requires tiny edits across 15 different files", "Scattered responsibilities; poor encapsulation", "Developers forget to update one file, causing silent bugs", "Move Method / Move Field to consolidate logic in one place"]
        ],
        n: "A code smell is not an inherent bug: a program infested with code smells may pass 100% of its unit tests, compile without warnings, and execute correctly in production. Instead, a code smell is a heuristic diagnostic indicator that the design violates fundamental software engineering principles (such as Low Coupling, High Cohesion, Single Responsibility, or Information Hiding). Just as a physical smell suggests spoilage before food becomes toxic, a code smell warns that the code will be difficult to understand, modify, or extend in the future. Beck and Fowler's catalog groups smells into distinct taxonomic families: Bloaters (Long Method, Large Class, Primitive Obsession), Object-Orientation Abusers (Switch Statements, Refused Bequest), Change Preventers (Divergent Change, Shotgun Surgery), Dispensables (Comments explaining bad code, Duplicate Code, Dead Code), and Couplers (Feature Envy, Inappropriate Intimacy, Message Chains)."
      },
      miss: [
        {
          w: "A code smell is a fatal syntax error or a defect that must be fixed immediately.",
          r: "Code smells are not bugs; they are structural design indicators suggesting that the code may be fragile or costly to maintain, but they may be tolerated if the code rarely changes."
        },
        {
          w: "Every single method that exceeds 20 lines of code is automatically an evil code smell.",
          r: "Lines of code is a heuristic, not a law; a 30-line method containing a clear, linear algorithm with zero branching may be far cleaner than ten heavily fragmented 3-line methods."
        },
        {
          w: "Writing extensive comments to explain convoluted, unreadable code fixes the code smell.",
          r: "Comments explaining *how* convoluted code works are often a smell themselves ('Comments smell'); the code should be refactored with clean method and variable names to explain itself."
        },
        {
          w: "Static analysis linters can detect 100% of all code smells automatically.",
          r: "Linters easily detect structural smells (cyclomatic complexity, method length), but subtle architectural smells (Feature Envy, Inappropriate Intimacy, Divergent Change) require human design judgment."
        }
      ],
      trade: {
        buys: [
          "Shared vocabulary: provides engineering teams with precise terms (e.g. 'Feature Envy') to communicate during code reviews.",
          "Early warning system: flags fragile or overly complex modules before they turn into major production defects.",
          "Targeted refactoring roadmap: directly points developers to specific Fowler refactoring recipes to clean the codebase.",
          "Cognitive load reduction: eradicating bloaters and couplers makes code easy for new team members to understand."
        ],
        costs: [
          "Subjectivity debates: developers may waste time arguing whether a particular structure constitutes a smell.",
          "Over-refactoring trap: aggressively hunting every minor smell can lead to over-abstraction and fragmented codebases.",
          "Context ignorance: rigidly eliminating smells without understanding historical trade-offs can introduce regressions.",
          "Initial cleanup time: dedicating developer hours to cleaning code smells takes time away from feature delivery."
        ],
        avoid: [
          "Treating code smells as absolute laws rather than helpful heuristics to be evaluated in context.",
          "Creating hundreds of tiny, one-line functions that scatter logic and make tracing control flow impossible (Middle Man smell).",
          "Ignoring glaring smells in core business modules that undergo frequent changes and modifications.",
          "Using comments as deodorizers to explain away poorly structured, unreadable code instead of refactoring it."
        ]
      }
    },
    {
      slug: "linter",
      why: {
        before: "Developers spent hours in manual code reviews arguing over tabs versus spaces, variable naming cases, unused imports, and common syntax pitfalls, while subtle syntax bugs escaped to production.",
        problem: "In dynamic languages like JavaScript and Python, simple typos, undeclared variables, and scope shadowings caused runtime crashes (`ReferenceError: foo is not defined`) only discovered by users.",
        shift: "Stephen C. Johnson created `lint` for C in 1978; modern linters (ESLint, Biome, Ruff, Pylint, Clippy) parse source code into Abstract Syntax Trees (ASTs) to automatically flag syntax errors, anti-patterns, security risks, and style violations."
      },
      num: {
        t: "Modern Linter Engines & Architecture Comparison",
        h: ["Linter Engine", "Supported Languages", "Execution Model / Core Language", "Analysis Speed (kLOC/sec)", "Primary Rule Scope"],
        r: [
          ["ESLint", "JavaScript, TypeScript, JSX", "Node.js (AST via Espree / @typescript-eslint)", "Moderate (50 - 150 kLOC/s)", "Pluggable rules: code quality, AST rules, React hooks, accessibility"],
          ["Biome", "JavaScript, TypeScript, JSX, JSON", "Rust (native multi-threaded parsing)", "Blazing fast (> 1,500 kLOC/s)", "All-in-one linter, formatter, and import sorter"],
          ["Ruff", "Python", "Rust (replaces Flake8, Black, isort, Bandit)", "Blazing fast (100x faster than Flake8)", "Pythonic idioms, unused imports, security warnings, type checks"],
          ["Clippy", "Rust", "Rust compiler integration (`rustc` plugin)", "Fast (runs during compiler pass)", "Over 500 lint passes: performance, idioms, correctness, complexity"],
          ["golangci-lint", "Go", "Go (orchestrates 40+ linters concurrently)", "Fast (shared Go AST cache)", "Deadcode, errcheck, staticcheck, gosec security scanning"]
        ],
        n: "A modern linter operates by taking raw source code text, tokenizing it via a lexical analyzer, and constructing an Abstract Syntax Tree (AST)—a tree representation of the syntactic structure of the source code. Lint rules are implemented as AST visitor patterns: as the linter traverses the tree, specific node selectors (e.g., `CallExpression`, `VariableDeclaration`, or `BinaryExpression`) trigger rule callbacks that inspect properties, scope chains, and type metadata. For example, ESLint's `no-eval` rule triggers whenever a `CallExpression` node has an identifier named `eval`. Advanced linters also perform Static Single Assignment (SSA) and control flow graph (CFG) analysis to detect unreachable code, infinite loops, and unhandled promise rejections before code is ever executed."
      },
      miss: [
        {
          w: "Linters and code formatters do the exact same job and are completely interchangeable.",
          r: "Formatters (Prettier) strictly handle layout aesthetics (whitespace, line wrapping, indentation); linters enforce code quality, bug prevention, scope validation, and security practices."
        },
        {
          w: "If code passes the linter with zero errors, it is guaranteed to be bug-free.",
          r: "Linters perform static analysis of syntax and common anti-patterns; they cannot verify runtime business logic, algorithmic correctness, or database concurrency constraints."
        },
        {
          w: "You should enable every available linter rule with 'error' severity from day one.",
          r: "Enabling overly strict or stylistic rules as blocking CI errors frustrates developers; rules should be curated collaboratively, distinguishing between hard errors (bugs/security) and soft warnings."
        },
        {
          w: "Linters only run in CI pipelines and have no place in local developer environments.",
          r: "Linters integrate directly into modern IDEs (via language server protocols) to provide real-time red squiggly feedback while typing, catching bugs within seconds rather than minutes later in CI."
        }
      ],
      trade: {
        buys: [
          "Automated bug prevention: catches undeclared variables, undefined references, memory leaks, and broken promise chains.",
          "Consistent team practices: enforces uniform programming idioms, naming conventions, and modern syntax across the team.",
          "Streamlined code reviews: eliminates superficial human review debates over syntax style and unused imports.",
          "Security vulnerability defense: flags dangerous patterns like `eval()`, SQL string concatenations, and unsanitized HTML."
        ],
        costs: [
          "Configuration fatigue: configuring multi-package ESLint, TypeScript-ESLint, and plugin rules can be complex and fragile.",
          "CI pipeline latency: running extensive lint suites across millions of lines adds minutes to CI build times (mitigated by Rust linters).",
          "False positive friction: overly aggressive rules require developers to sprinkle `eslint-disable` comments across valid edge-case code.",
          "Rule churn overhead: upgrading major linter versions often introduces breaking rule changes that break existing builds."
        ],
        avoid: [
          "Bypassing linter errors with blanket disable comments (`eslint-disable-line`) without explaining why an exception is necessary.",
          "Using a linter to enforce pure whitespace formatting rules instead of using a dedicated formatter like Prettier or Biome.",
          "Failing to run linters as pre-commit Git hooks (via Husky/lint-staged), allowing dirty commits into remote branches.",
          "Letting linter warning counts grow into the thousands until the team ignores linter output entirely."
        ]
      }
    },
    {
      slug: "formatter",
      why: {
        before: "Every developer formatted code according to personal taste—mixing 2 spaces, 4 spaces, tabs, single quotes, double quotes, and idiosyncratic line-wrapping choices.",
        problem: "Pull requests were filled with massive noisy diffs where 90% of changed lines were cosmetic whitespace reformatting, obscuring real logic changes and triggering endless bikeshedding arguments in code reviews.",
        shift: "Christopher Chedeau and James Long created Prettier (following Go's pioneering `gofmt`), establishing the paradigm of 'Opinionated Code Formatters' that discard original formatting and reprint the AST consistently from scratch."
      },
      num: {
        t: "Modern Opinionated Code Formatters & Formatting Paradigms",
        h: ["Formatter Tool", "Supported Languages", "Underlying Architecture", "Formatting Philosophy", "Print Width Enforcement"],
        r: [
          ["Prettier", "JS, TS, CSS, HTML, JSON, Markdown, YAML", "Node.js (AST reprinting via Wadler-Lindig layout algorithm)", "Opinionated; minimal configuration options", "Reflows AST nodes onto new lines when exceeding `printWidth` (default 80)"],
          ["gofmt", "Go", "Native Go compiler toolchain", "Zero configuration; absolute standardization across the entire Go ecosystem", "Strict tab indentation, standardized bracket and operator layout"],
          ["Biome", "JavaScript, TypeScript, JSX, JSON", "Native Rust (extremely fast)", "Prettier-compatible, highly optimized AST printer", "Dynamic line-breaking matching Prettier layout algorithm at 20x speed"],
          ["Black", "Python", "Python (uncompromising code formatter)", "The 'uncompromising' Python formatter; one true formatting style", "Strict 88-character line limit; standardized quote and bracket layout"],
          ["rustfmt", "Rust", "Rust toolchain integration", "Standardized Rust community style guidelines", "Consistent match arms, struct initialization, and attribute formatting"]
        ],
        n: "The breakthrough architectural insight of modern formatters like `gofmt` and Prettier is that they completely ignore the original formatting of the source code. Instead, the formatter parses the source code into an Abstract Syntax Tree (AST), discards all original whitespace, indentation, comments placement, and newlines, and then 'reprints' the entire AST from scratch according to deterministic formatting rules. Prettier utilizes the Wadler-Lindig pretty-printing algorithm: given a maximum print width (e.g., 80 or 100 characters), the algorithm recursively evaluates AST nodes, choosing the most compact representation that fits within the target width before breaking arguments or object properties across multiple lines. This completely removes human aesthetic choice from software engineering, ensuring that two developers writing the exact same code produce identical, byte-for-byte matching files."
      },
      miss: [
        {
          w: "A code formatter checks for logic bugs, dead code, and variable scope errors.",
          r: "Formatters have zero awareness of logic, variable types, or bugs; their sole responsibility is layout, whitespace, quotation marks, and line-wrapping aesthetics."
        },
        {
          w: "An ideal code formatter should provide hundreds of customization options for every developer's personal preference.",
          r: "Configuration options defeat the entire purpose of a formatter; opinionated formatters provide minimal flags specifically to end team debates and enforce global consistency."
        },
        {
          w: "Formatters should be run manually by developers right before they create a release.",
          r: "Formatters must be automated to run on every file save in the IDE and validated via pre-commit Git hooks and CI pipelines to prevent any unformatted code from entering version control."
        },
        {
          w: "Code formatters can alter the execution semantics or behavior of your application.",
          r: "Reputable formatters parse the AST before and after formatting to mathematically verify that the AST remains completely invariant, ensuring runtime behavior never changes."
        }
      ],
      trade: {
        buys: [
          "Zero code review bikeshedding: stops all developer arguments over tabs, spaces, semicolons, quotes, and line breaks.",
          "Pristine, readable git diffs: eliminates noisy cosmetic whitespace diffs so reviewers can focus purely on business logic.",
          "Effortless developer workflow: developers write messy, unindented code and let the IDE auto-format it instantly on save.",
          "Standardized codebase appearance: makes code written by 50 different engineers look like it was written by a single person."
        ],
        costs: [
          "Loss of artisanal formatting: developers cannot manually align table-like code or ASCII art for visual emphasis.",
          "Occasional awkward line wraps: algorithmic layout engines sometimes wrap chained calls or JSX in visually awkward ways.",
          "Initial adoption diff shock: applying a formatter to an existing legacy repository creates a massive git diff across all files.",
          "Tooling integration overhead: requires configuring editor plugins, pre-commit hooks, and CI verification steps."
        ],
        avoid: [
          "Arguing endlessly over formatting settings; adopt default configurations (Prettier/gofmt/Black) and move on.",
          "Formatting an entire massive legacy repository in the middle of an active feature branch, causing merge conflicts for everyone.",
          "Running the formatter manually instead of setting up 'Format on Save' in editor settings.",
          "Allowing developers to commit unformatted code by neglecting to enforce `prettier --check` in CI pipelines."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
