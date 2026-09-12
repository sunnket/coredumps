(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "documentation",
      why: {
        before: "Software systems relied on oral tradition, outdated Word documents saved on private desktops, or scattered Wiki pages that diverged from reality within weeks of initial authoring.",
        problem: "When key engineers departed or on-call rotations shifted, teams had no accurate record of how systems were deployed, why architectural choices were made, or how APIs functioned, paralyzing incident response and engineering velocity.",
        shift: "The 'Docs-as-Code' paradigm revolutionized technical documentation: treating documentation with the same rigor as source code—authored in plain text (Markdown/AsciiDoc), versioned in Git alongside code, reviewed via PRs, and deployed via automated CI/CD static site generators."
      },
      num: {
        t: "The Diátaxis Documentation Framework & Architecture",
        h: ["Diátaxis Quadrant", "Primary User Need", "Orientation / Mode", "Structural Focus", "Example Artifact"],
        r: [
          ["Tutorials (Learning-oriented)", "Help newcomers acquire basic competence", "Practical learning; guided hands-on sequence", "Step-by-step walkthrough of building a basic app from scratch", "'Getting Started: Building Your First REST API in 15 Minutes'"],
          ["How-To Guides (Problem-oriented)", "Help practitioners solve specific real-world tasks", "Practical task execution; assumes competence", "Recipes and sequential steps to achieve a specific outcome", "'How to Configure Mutual TLS Authentication on Ingress Gateways'"],
          ["Reference (Information-oriented)", "Describe technical machinery accurately and completely", "Theoretical description; dry, authoritative truth", "API endpoints, parameter types, return schemas, error codes", "'OpenAPI Specification for v2/payments: Schema & Error Codes'"],
          ["Explanation (Understanding-oriented)", "Provide context, architectural rationale, and background", "Theoretical understanding; discursive and analytical", "High-level architectural design, historical trade-offs, and vision", "'Architectural Overview: Why We Chose Raft Consensus Over Paxos'"]
        ],
        n: "The Diátaxis documentation framework (formulated by Daniele Procida) organizes documentation along two orthogonal axes: practical versus theoretical, and learning versus working. Software documentation fails when it conflates these distinct modes—for example, when an API reference guide wanders into a discursive history of the project, or when a quickstart tutorial attempts to document every obscure configuration flag. Modern engineering teams adopt the 'Docs-as-Code' philosophy: documentation is authored in Markdown or MDX, co-located in the same Git repository as application code, validated in CI using linters (e.g. Vale for prose consistency, markdown-link-check for dead URLs), and compiled into modern documentation portals using static site generators like Docusaurus, Astro, or MkDocs. This ensures that documentation changes are reviewed and merged atomically with the code changes they describe."
      },
      miss: [
        {
          w: "Writing good code eliminates the need for any technical documentation because 'clean code documents itself'.",
          r: "Clean code reveals *what* the code does and *how* it does it, but code can never reveal *why* a particular architectural path was chosen over alternatives, nor can it provide high-level system context."
        },
        {
          w: "Documentation should be written once at the very end of a major project by dedicated technical writers.",
          r: "Documentation written at project completion is often stale on arrival; treating Docs-as-Code allows software engineers to update documentation continuously alongside every pull request."
        },
        {
          w: "A 200-page monolithic Wiki page is better than a concise, well-structured 2-page Markdown document.",
          r: "Unstructured, bloated Wikis quickly turn into unsearchable documentation graveyards filled with contradictory, outdated information that developers actively avoid."
        },
        {
          w: "API documentation should be manually written and maintained in static Markdown files.",
          r: "API reference documentation should be auto-generated from code annotations or formal schemas (e.g. OpenAPI, Swagger, TypeDoc, GraphQL introspection), guaranteeing that documentation never drifts from code."
        }
      ],
      trade: {
        buys: [
          "Rapid developer onboarding: reduces new engineer ramp-up time from months to days through clear tutorials and how-to guides.",
          "Self-service operations: empowers client developers and operations teams to integrate and troubleshoot without interrupting engineers.",
          "Decreased MTTR: on-call incident responders resolve outages faster when accurate architecture diagrams and runbooks exist.",
          "Institutional knowledge retention: protects organizations against brain drain and bus factor risks when senior engineers depart."
        ],
        costs: [
          "Continuous maintenance effort: keeping documentation accurate requires ongoing engineering time on every pull request.",
          "CI pipeline overhead: validating markdown links, running prose linters, and building static documentation sites adds CI latency.",
          "Tooling complexity: managing documentation generators, search indexes (Algolia), and translation pipelines requires infrastructure.",
          "Risk of rot: stale or incorrect documentation is worse than no documentation, as it actively misleads developers during incidents."
        ],
        avoid: [
          "Allowing documentation to reside in unversioned, disconnected Google Docs or private employee desktops.",
          "Writing code comments that merely restate the code (e.g., `i++; // increment i by one`).",
          "Merging pull requests that introduce major architectural or API changes without updating accompanying docs.",
          "Failing to set up automated link-checking in CI, resulting in broken documentation links."
        ]
      }
    },
    {
      slug: "architecture-decision-record",
      why: {
        before: "Major technical decisions (like choosing a database, adopting GraphQL, or partitioning microservices) were made in ephemeral Slack chats, hallway discussions, or meeting whiteboards.",
        problem: "Six months later, nobody remembered *why* the decision was made, what alternatives were evaluated, or what constraints existed; new engineers re-debated the exact same topics or inadvertently reversed critical choices.",
        shift: "Michael Nygard formulated Architecture Decision Records (ADRs): lightweight, plain-text documents captured in version control that record important architectural decisions along with their context and consequences."
      },
      num: {
        t: "Architecture Decision Record (ADR) Anatomy & Nygard Schema",
        h: ["ADR Section", "Mandatory Content / Objective", "Tone & Style", "Lifecycle Role", "Example Content"],
        r: [
          ["Title & Metadata", "Sequential number, short title, date, author, status", "Formal record metadata", "Establishes chronological index and operational state", "ADR-0014: Adopt PostgreSQL Partitioning for Audit Logs (Accepted)"],
          ["Context", "The technical, business, or operational forces motivating the decision", "Objective, factual, neutral description of the problem space", "Explains the exact constraints and forces in play at that time", "Audit table exceeds 2B rows; write latency spiking; 90-day retention rule required"],
          ["Decision", "The specific architectural choice made and how it will be implemented", "Active voice, definitive ('We will...')", "Declares the chosen path of action unambiguously", "We will use PostgreSQL declarative range partitioning by month on `created_at`"],
          ["Status", "Current operational standing of the decision", "Lifecycle enum: Proposed, Accepted, Rejected, Deprecated, Superseded", "Tracks whether decision is active or has been replaced", "Status: Superseded by ADR-0028 (Migrate Audit Logs to ClickHouse)"],
          ["Consequences", "The trade-offs resulting from this decision (both positive and negative)", "Honest, balanced assessment of buys, costs, and risks", "Documents known liabilities accepted by the engineering team", "Positive: Queries bounded to single partition. Negative: Cross-partition updates slow"]
        ],
        n: "An Architecture Decision Record (ADR) is an immutable historical snapshot. ADRs are stored as numbered Markdown files directly inside the code repository (typically under `docs/adr/0001-record-architecture-decisions.md`). When an existing architectural decision is rendered obsolete by new technological capabilities or shifting business requirements, the original ADR is *never edited or deleted*; instead, its status is marked as 'Superseded by ADR-XXXX', and a new ADR is authored. This creates an auditable, append-only log of the architectural evolution of the system. Michael Nygard's structure emphasizes honesty in the 'Consequences' section: every significant architectural choice involves trade-offs, and explicitly documenting the accepted negative consequences prevents future developers from believing the original authors were naive or careless."
      },
      miss: [
        {
          w: "ADRs are heavyweight 30-page enterprise architecture documents that require weeks of committee approval.",
          r: "ADRs are intentionally lightweight 1-to-2-page Markdown documents designed to be authored in an hour and reviewed via a standard Git pull request."
        },
        {
          w: "You should rewrite or delete an old ADR when the team decides to change its architectural direction.",
          r: "ADRs are immutable historical records; you never delete an old ADR, you mark its status as 'Superseded' and author a new ADR referencing it."
        },
        {
          w: "ADRs are only necessary for massive multi-million dollar technology vendor acquisitions.",
          r: "ADRs should capture any decision that is significant or difficult to reverse: choosing a state management library, defining API error schemas, or selecting a caching strategy."
        },
        {
          w: "An ADR should only document the benefits and hide the negative consequences to sell the idea.",
          r: "The Consequences section MUST transparently articulate all drawbacks, operational burdens, and trade-offs; an ADR that claims zero downsides is fundamentally dishonest engineering."
        }
      ],
      trade: {
        buys: [
          "Institutional memory preservation: stops repeated debates over previously resolved architectural questions.",
          "Psychological safety: provides historical context so new team members understand why legacy code was structured that way.",
          "Collaborative architectural governance: teams review and approve major design choices asynchronously via standard Git PRs.",
          "Explicit trade-off alignment: forces engineers to systematically evaluate alternatives and confront negative consequences upfront."
        ],
        costs: [
          "Authoring friction: requires engineers to pause and write structured prose rather than immediately coding.",
          "Review process overhead: reviewing and debating ADR PRs requires time and alignment across technical leadership.",
          "Tooling and indexing maintenance: managing hundreds of ADRs requires tools (like `adr-tools` or Log4brains) to index records.",
          "Risk of dogma: teams can become rigid, refusing to re-evaluate superseded decisions when environmental conditions change."
        ],
        avoid: [
          "Deleting or secretly rewriting historical ADRs instead of formally superseding them with a new record.",
          "Writing ADRs retroactively months after code has already been deployed to production.",
          "Omitting the 'Consequences' section or pretending the chosen solution has zero technical trade-offs.",
          "Using ADRs for trivial implementation details (like indentation style or variable naming conventions)."
        ]
      }
    },
    {
      slug: "readme",
      why: {
        before: "When developers cloned a new code repository, they were greeted by an empty directory or a blank README file, forcing them to guess how to install dependencies, configure environment variables, or run the application.",
        problem: "New team members and open-source contributors spent days struggling with cryptic dependency errors, missing Docker containers, and undocumented runtime configurations before writing a single line of code.",
        shift: "The standardized `README.md` became the undisputed universal front door of software projects: a single authoritative Markdown document residing at the repository root that guides developers from zero to running code in under 10 minutes."
      },
      num: {
        t: "Production-Grade README Anatomy & Core Components",
        h: ["README Component", "Primary Objective", "Essential Elements Included", "Target Audience", "Key Antipattern to Avoid"],
        r: [
          ["Header & Value Proposition", "Instantly communicate what the project is and why it exists", "Project name, 1-line elevator pitch, badges (CI, license, version), demo GIF", "All visitors (developers, managers, contributors)", "Cryptic acronyms; failing to state what the software actually does"],
          ["Prerequisites & Quickstart", "Get a developer from `git clone` to running application in < 5 mins", "Required runtimes (Node 20+, Docker), copy-paste terminal commands (`npm i && npm run dev`)", "New developers onboarding to the team", "Assuming undocumented global tools are pre-installed"],
          ["Environment Configuration", "Document all required secrets, API keys, and environment variables", "List of keys, descriptions, expected formats, example `.env.example` reference", "Developers and DevOps engineers", "Hardcoding production secrets or leaving mandatory keys undocumented"],
          ["Testing & Verification", "Explain how to validate local changes against regression suites", "Commands for unit, integration, and E2E suites (`npm test`, `npm run test:e2e`)", "Contributors making pull requests", "Omitting database test container prerequisites"],
          ["Deployment & Architecture", "High-level architectural overview and deployment instructions", "Links to architecture diagrams, ADRs, Docker builds, CI/CD pipelines", "Senior engineers and operations staff", "Dumping 500 lines of complex cloud architecture into the root README"]
        ],
        n: "A world-class README adheres to the 'Ten-Minute Rule': an engineer with standard development tools should be able to clone the repository, install dependencies, run the test suite, and launch the application locally in under ten minutes without asking a teammate for help. The document acts as an executive summary and navigation hub: it provides the essential instructions directly in the root file while linking out to specialized documentation (such as `CONTRIBUTING.md`, `ARCHITECTURE.md`, `LICENSE`, and `docs/adr/`) for exhaustive details. Modern automated tooling validates README code blocks (using tools like `markdown-code-runner` or `mdsh`) to verify that the copy-pasted setup commands in the README actually execute successfully in CI environments, preventing documentation rot."
      },
      miss: [
        {
          w: "A README is only necessary for open-source repositories and is a waste of time for internal company codebases.",
          r: "Internal repositories suffer higher onboarding churn and cross-team dependency inquiries; a clear README saves hundreds of hours of senior engineer interruptions."
        },
        {
          w: "The README should contain complete, exhaustive documentation for every single function and class in the system.",
          r: "The README is a high-level orientation portal; detailed API documentation belongs in generated reference portals (TypeDoc, OpenAPI) or specialized docs directories."
        },
        {
          w: "README instructions don't need to be tested because they are just Markdown text.",
          r: "Setup commands in READMEs rot rapidly as Node/Python versions change; testing README setup steps in clean CI containers ensures instructions remain functional."
        },
        {
          w: "It is safe to put default production API keys or database passwords in the README for quick testing.",
          r: "Never put real credentials in a README; provide an `.env.example` template with dummy placeholder values and document how to obtain development credentials securely."
        }
      ],
      trade: {
        buys: [
          "Frictionless onboarding: reduces developer setup time from multiple frustrated days to a single automated command sequence.",
          "Reduced context interruptions: eliminates repetitive 'how do I run this locally?' Slack messages to senior engineers.",
          "Open-source adoption: clear, polished READMEs with demo GIFs and quickstarts dramatically increase library adoption and contributions.",
          "Unified team alignment: provides a single source of truth for standard local development commands and scripts."
        ],
        costs: [
          "Documentation rot vulnerability: commands and environment variables can become stale if dependencies or runtimes change.",
          "Maintenance discipline: developers must remember to update README instructions when modifying configuration setups.",
          "Formatting care: crafting high-quality diagrams, clear formatting, and tested quickstarts requires initial design effort.",
          "Scope control challenge: balancing brevity with sufficient detail requires editorial discipline to avoid document bloat."
        ],
        avoid: [
          "Leaving the default boilerplate README generated by frameworks (e.g. 'This is a Next.js project created with...') unchanged.",
          "Listing commands that fail when copy-pasted into a clean terminal on a fresh machine.",
          "Omitting mandatory environment variables, leaving developers with cryptic runtime startup crashes.",
          "Burying the local quickstart commands under 10 pages of theoretical architectural prose."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
