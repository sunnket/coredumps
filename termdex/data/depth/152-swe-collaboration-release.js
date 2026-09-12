(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "code-review",
      why: {
        before: "In early software engineering, developers pushed code directly to production or shared repositories without peer inspection, relying entirely on downstream QA teams or end-user error reports to discover bugs.",
        problem: "Post-deployment debugging cost orders of magnitude more than upstream defect discovery; lone-wolf coding produced idiosyncratic architectures, unreadable logic, unhandled edge cases, and zero cross-team knowledge sharing.",
        shift: "Formalized peer code review—institutionalized via asynchronous pull requests, pair programming, and Gerrit-style change-lists—made software development an audited, collaborative discipline where every line of code requires peer consensus before merging."
      },
      num: {
        t: "Code Review Methodologies & Effectiveness Metrics",
        h: ["Review Methodology", "Inspection Speed / Size Limit", "Defect Detection Rate", "Knowledge Sharing Velocity", "Primary Failure Mode"],
        r: [
          ["Over-the-shoulder / Pair review", "Synchronous live pairing (< 400 LOC)", "70% - 85% algorithmic & design bugs", "High; immediate conversational mentoring", "Cognitive exhaustion; rubber-stamping due to peer pressure"],
          ["Asynchronous Pull Request (GitHub/GitLab)", "Asynchronous (< 250 LOC / PR optimal)", "60% - 75% logic, edge case, and styling bugs", "Medium; documented review comments on diff lines", "PR bottlenecks; slow review turnaround (> 48h) stalls deployment"],
          ["Formal Fagan Inspection", "Strict 2-hour synchronous meeting (100 LOC/h)", "80% - 90% specification & defect discovery", "Low; rigid roles (moderator, reader, recorder)", "Excessive operational overhead; abandoned by agile teams"],
          ["AI-Augmented Automated Review", "Instantaneous automated CI webhook", "90%+ lint, security SAST, syntax violations", "Low; automated bot suggestions without contextual empathy", "Alert fatigue; developers ignore automated bot comments"]
        ],
        n: "Empirical studies by Cisco Systems and Google demonstrate that code review efficacy degrades precipitously once a changeset exceeds 400 lines of code (LOC) or when reviewers inspect faster than 500 LOC per hour. Above 400 LOC, reviewers transition from critical cognitive analysis to superficial 'looks good to me' (LGTM) scanning. Effective code review serves three distinct architectural tiers: (1) functional correctness (verifying edge cases, boundary conditions, race conditions, and algorithmic complexities), (2) architectural coherence (ensuring design conforms to domain-driven boundaries, service contracts, and modularity principles), and (3) organizational knowledge distribution (cross-pollinating domain context across team members). High-performing engineering organizations enforce branch protection rules requiring at least one approving review from a designated code owner (`CODEOWNERS`) alongside green continuous integration suites before merging."
      },
      miss: [
        {
          w: "The primary purpose of code review is finding syntax errors, formatting inconsistencies, and spelling mistakes.",
          r: "Automated linters, formatters, and static analysis tools handle syntax and formatting; human code reviews should focus on architectural design, domain correctness, edge-case failure modes, and long-term maintainability."
        },
        {
          w: "Submitting massive 2,000-line pull requests once a month is more efficient than submitting ten 200-line PRs.",
          r: "Massive PRs take days to review, suffer superficial inspections where critical bugs slip through unnoticed, cause severe merge conflicts, and block continuous deployment pipelines."
        },
        {
          w: "Senior engineers don't need their code reviewed by junior engineers.",
          r: "Code review is bidirectional: junior engineers catch blind spots, ask clarifying questions that expose accidental complexity, and rapidly absorb architectural patterns by reading senior code."
        },
        {
          w: "Code review approval guarantees that software is free of bugs.",
          r: "Code review is an empirical risk-mitigation layer, not formal mathematical verification; subtle concurrent race conditions, runtime environment drift, and unexpected production load profiles still require automated tests and canary deployments."
        }
      ],
      trade: {
        buys: [
          "Defect prevention: catches bugs, security flaws, and logic oversights before code reaches production environments.",
          "Knowledge dissemination: prevents single points of failure by ensuring multiple engineers understand every subsystem.",
          "Architectural consistency: enforces unified coding conventions, library usage, and domain boundaries across the organization.",
          "Mentorship and onboarding: accelerates engineering ramp-up time through constructive, documented peer feedback."
        ],
        costs: [
          "Developer cycle time latency: waiting for peer reviews introduces delays between writing code and deploying to production.",
          "Context-switching overhead: reviewing teammates' code interrupts deep focus and engineering flow states.",
          "Interpersonal tension: unconstructive, nitpicky, or egotistical feedback damages psychological safety and team morale.",
          "Operational tooling burden: managing review rules, bot integrations, merge queues, and CODEOWNERS configurations."
        ],
        avoid: [
          "Using human review time to debate code formatting, indentation, or linting rules that an automated formatter can solve.",
          "Letting pull requests linger unreviewed for days, creating stale branches and demoralizing submitters.",
          "Approving massive 1,500+ LOC PRs with a thoughtless 'LGTM' without reading the changes thoroughly.",
          "Leaving vague criticism like 'this is bad' without explaining the specific technical risk or proposing an alternative."
        ]
      }
    },
    {
      slug: "trunk-based-development",
      why: {
        before: "Teams used GitFlow or long-lived feature branches where developers worked in isolation for weeks or months, creating massive branch divergence from the primary integration branch.",
        problem: "Long-lived branches caused 'Merge Hell'—catastrophic integration sessions where reconciling incompatible changes consumed entire sprints, destabilized releases, and delayed feedback loops.",
        shift: "Trunk-Based Development (TBD) mandates that all developers merge small, frequent commits directly into a single shared trunk (mainline) at least once a day, using feature flags to decouple code deployment from feature release."
      },
      num: {
        t: "Trunk-Based Development vs GitFlow Branching Models",
        h: ["Branching Paradigm", "Branch Lifespan", "Merge Frequency", "Integration Conflict Risk", "Production Deployment Velocity"],
        r: [
          ["GitFlow / Feature Branching", "Weeks to months", "Infrequent (at sprint end or release milestones)", "Extremely High (exponential divergence over time)", "Slow; weekly or bi-monthly batched release trains"],
          ["Trunk-Based Development (Core)", "Hours to < 1 day (short-lived branches)", "Multiple times per developer per day", "Very Low (linear, incremental diff reconciliations)", "Continuous; multiple deployments per day"],
          ["GitHub Flow", "1 to 3 days per feature branch", "Daily to several times weekly via PRs", "Low to Moderate; fast reviews prevent divergence", "Frequent; deployed immediately upon PR merge"],
          ["Environment Branching", "Persistent (dev, test, staging, prod)", "Manual promotions via branch-to-branch merges", "High (environment drift and divergent commits)", "Rigid, sequential release stages prone to cherry-pick errors"]
        ],
        n: "The mathematical risk of merge conflicts in version control scales quadratically with the duration of branch divergence, represented conceptually by Metcalfe's or interaction-network complexity where each diverging commit increases the probability of overlapping abstract syntax tree (AST) modifications. Trunk-Based Development compresses branch divergence to near zero by enforcing short-lived branches (lifespan < 24 hours) or direct-to-trunk commits. To ship incomplete or experimental business logic to production without exposing unfinished user interfaces, engineering teams employ Feature Flags (Feature Toggles) and Branch by Abstraction. By constantly integrating with trunk, automated Continuous Integration (CI) test suites run against the collective state of the entire team's work, providing instantaneous feedback on regressions."
      },
      miss: [
        {
          w: "Trunk-Based Development means developers push unvetted, broken code directly into production without review.",
          r: "TBD uses short-lived pull requests (hours, not days), automated CI pre-merge checks, automated merge queues, and dark-launching behind feature flags so incomplete code remains dormant in runtime."
        },
        {
          w: "Trunk-Based Development only works for tiny startups and cannot scale to large enterprise engineering teams.",
          r: "Google, Meta, and Netflix operate the world's largest engineering organizations exclusively on trunk-based development with thousands of daily commits into a single shared repository."
        },
        {
          w: "Feature branches are the only safe way to prevent unfinished features from breaking production.",
          r: "Feature flags and Branch by Abstraction isolate unfinished features in runtime far more safely than long-lived branches, without creating integration bottlenecks."
        },
        {
          w: "You can adopt Trunk-Based Development without fast, automated CI test suites.",
          r: "Without sub-10-minute automated test suites that guarantee mainline stability, trunk commits quickly destabilize the build and halt development for the entire team."
        }
      ],
      trade: {
        buys: [
          "Elimination of merge hell: daily integrations reduce merge conflicts to trivial, easily resolvable single-line diffs.",
          "Rapid continuous delivery: enables multiple production deployments per day with minimal release ceremony.",
          "Immediate regression feedback: automated CI immediately surfaces incompatibilities between concurrent developer changes.",
          "Code visibility and transparency: all engineers see the latest codebase state without branch isolation."
        ],
        costs: [
          "Mandatory CI speed & reliability: requires high-performance test suites (< 10 min) to avoid blocking the trunk.",
          "Feature flag technical debt: necessitates flag management systems and scheduled cleanups to remove dead flag conditionals.",
          "Disciplined test automation: requires rigorous unit and contract test coverage to catch bugs before merging to main.",
          "Merge queue orchestration: large teams require automated merge queues (e.g., Bors, GitHub Merge Queue) to serialize merges."
        ],
        avoid: [
          "Keeping feature branches open for weeks while accumulating hundreds of commits away from trunk.",
          "Merging code to trunk when continuous integration test suites are failing or flaky.",
          "Using long-lived release branches that diverge with custom hotfixes instead of fixing forward on trunk.",
          "Shipping unfinished features without wrapping them in feature toggles or abstraction layers."
        ]
      }
    },
    {
      slug: "monorepo",
      why: {
        before: "Organizations split applications into dozens or hundreds of independent Git repositories (polyrepos), each housing a single microservice, shared library, or frontend package.",
        problem: "Polyrepos created dependency hell: updating a shared library required publishing a package version, updating `package.json` in 40 downstream repositories, submitting 40 PRs, and suffering broken cross-repo integration tests.",
        shift: "Monorepos consolidate multiple projects, services, and shared libraries into a single unified version control repository, backed by incremental build systems and change-detection graph engines."
      },
      num: {
        t: "Monorepo vs Polyrepo Architecture Comparison",
        h: ["Dimension", "Monorepo Architecture (Nx / Turborepo / Bazel)", "Polyrepo Architecture (Multi-Repo)", "Scale Bottleneck", "Cross-Cutting Change Difficulty"],
        r: [
          ["Dependency Management", "Single source of truth; atomic cross-project upgrades", "Version skew; Diamond Dependency conflicts across repos", "Package registry propagation latency", "Trivial; single atomic commit updates library and all consumers"],
          ["Code Sharing", "Direct internal package imports; zero publishing ceremony", "Must publish to private npm/Maven/PyPI registry", "Registry token governance & publishing flakiness", "High; requires coordinating multi-repo release sequences"],
          ["Build & CI Scaling", "Hermetic, incremental builds via DAG computation caching", "Each repo runs its own independent CI pipeline", "VCS performance & Git clone/status size at scale", "Low per-repo CI time, but high aggregate organizational CI time"],
          ["Tooling Complexity", "Requires monorepo orchestrators (Turborepo, Bazel, Pants)", "Standard off-the-shelf git & language tools suffice", "Developer machine RAM/disk & IDE language server indexing", "Low tooling learning curve; high organizational coordination"]
        ],
        n: "Monorepos transform dependency management by enabling atomic cross-cutting refactoring: an engineer can modify an API interface in a shared library and simultaneously update all calling microservices within a single Git commit. If any consumer fails compilation or unit tests, the commit fails CI and cannot merge. However, scaling a monorepo to millions of lines of code requires advanced build tooling. Modern monorepo build systems (such as Bazel, Buck2, Nx, and Turborepo) model the repository as a Directed Acyclic Graph (DAG) of packages and tasks. By hashing input files and environment variables, they achieve hermetic build caching: if package A and its dependencies have not changed, its build and test outputs are retrieved from a local or remote distributed cache in milliseconds, running tests only on affected subgraphs."
      },
      miss: [
        {
          w: "A monorepo is the same thing as a monolithic software architecture.",
          r: "Monorepo describes the version control storage strategy (many projects in one Git repo); architecture describes runtime deployment (a monorepo can host hundreds of independently deployed microservices, serverless functions, and static frontends)."
        },
        {
          w: "In a monorepo, every CI run must build and test every project in the entire repository.",
          r: "Modern monorepo build systems use git diffs and task dependency graphs to run tests only on projects directly or transitively affected by the changed files (affected-mode), leveraging remote build caches."
        },
        {
          w: "Polyrepos provide better security boundaries between teams by default.",
          r: "Modern monorepos use `CODEOWNERS`, path-based access controls, and strict project-level dependency visibility rules (e.g., Bazel visibility) to restrict which teams can modify or import specific modules."
        },
        {
          w: "Standard Git handles multi-terabyte monorepos out of the box with zero custom infrastructure.",
          r: "Massive enterprise monorepos (like Google's Piper or Meta's Sapling/Eden) require virtual filesystems (VFS), sparse checkouts, or specialized version control backends because standard Git clones balloon past workstation storage."
        }
      ],
      trade: {
        buys: [
          "Atomic cross-project refactoring: update shared interfaces and all downstream callers in a single, verified commit.",
          "Single source of truth: eliminates version skew, diamond dependency conflicts, and package publishing overhead.",
          "Universal code discovery: developers can search, view, and understand the entire corporate codebase in their IDE.",
          "Unified tooling & linting: enforce consistent TypeScript, formatting, CI, and testing standards across all company projects."
        ],
        costs: [
          "Specialized build tooling requirements: requires learning and configuring tools like Turborepo, Nx, or Bazel.",
          "VCS scaling challenges: large repositories slow down `git status`, `git checkout`, and local disk indexing.",
          "CI pipeline orchestration: requires distributed remote caching and change-detection graph infrastructure.",
          "Tighter coupling temptation: developers may accidentally import internal code across domain boundaries without clean APIs."
        ],
        avoid: [
          "Adopting a monorepo without an incremental, cached build tool (Turborepo, Nx, Bazel), causing unbearable CI times.",
          "Allowing circular dependencies between internal libraries and applications in the repository graph.",
          "Treating the monorepo as a monolith by deploying all services together instead of continuous, independent service releases.",
          "Checking in large binary assets or database dumps that permanently inflate Git packfile sizes."
        ]
      }
    },
    {
      slug: "semantic-versioning",
      why: {
        before: "Software releases used arbitrary, marketing-driven version numbers (e.g., 'Windows 95', 'Version 3.1.2a', 'Build 1042') with no standardized meaning regarding backward compatibility.",
        problem: "Automated package managers (npm, pip, Cargo) could not safely determine whether upgrading a dependency from `1.2` to `1.3` would silently break existing application code or introduce security vulnerabilities.",
        shift: "Tom Preston-Werner formulated Semantic Versioning (SemVer), establishing a formal three-part specification (`MAJOR.MINOR.PATCH`) where increment rules unambiguously communicate API compatibility guarantees."
      },
      num: {
        t: "Semantic Versioning (SemVer 2.0.0) Specification & Rules",
        h: ["Version Component", "Increment Condition", "API Compatibility Guarantee", "Package Manager Range Specifier", "Example Upgrade Scenario"],
        r: [
          ["MAJOR (X.y.z)", "Breaking / incompatible API modifications", "Incompatible; consumer code may fail compilation or execution", "^1.0.0 allows < 2.0.0; ~1.0.0 allows < 1.1.0", "v1.4.2 -> v2.0.0 (Removed deprecated method, altered return types)"],
          ["MINOR (x.Y.z)", "Backward-compatible feature additions", "Fully compatible; new features added, existing APIs preserved", ">= 1.2.0 < 2.0.0 or ^1.2.0 in npm", "v1.4.2 -> v1.5.0 (Added optional configuration parameter)"],
          ["PATCH (x.y.Z)", "Backward-compatible bug fixes", "Fully compatible; internal defect resolution without API changes", "~1.4.2 allows >= 1.4.2 < 1.5.0", "v1.4.2 -> v1.4.3 (Fixed null-pointer dereference in parser)"],
          ["Pre-release (-alpha.1)", "Unstable development / testing builds", "No compatibility guarantees; internal APIs in flux", "Explicit opt-in required by package managers", "v2.0.0-alpha.1 -> v2.0.0-rc.2 (Pre-release testing builds)"],
          ["Build Metadata (+build)", "Build metadata, commit hash, timestamp", "Ignored when determining version precedence", "Informational only; does not affect package resolution", "v1.4.2+20260906 or v1.4.2+sha.7a8b9c"]
        ],
        n: "Semantic Versioning 2.0.0 defines a strict precedence algorithm for comparing version numbers: Major, Minor, and Patch are evaluated as positive decimal integers compared numerically from left to right (e.g., 1.10.0 > 1.9.0, debunking the common misconception that version numbers represent decimal fractions). When Major is `0` (e.g., `0.y.z`), software is considered in initial development; the public API is not stable, and any change may break compatibility regardless of which digit increments. In automated dependency resolution, package managers use range operators like caret (`^1.2.3` allowing `>= 1.2.3 < 2.0.0`) and tilde (`~1.2.3` allowing `>= 1.2.3 < 1.3.0`). Strict adherence to SemVer is the cornerstone of automated dependency updates (e.g., Dependabot, Renovate), allowing systems to apply security patches autonomously without manual intervention."
      },
      miss: [
        {
          w: "Version numbers are decimals, so version 1.10 is the same as 1.1 or comes before 1.9.",
          r: "SemVer components are independent integers separated by periods; `1.10.0` is the tenth minor release after `1.9.0` and represents a newer version with more features."
        },
        {
          w: "Fixing a bug that accidentally changes the public API return type should be a PATCH release because it was a bug fix.",
          r: "If a fix breaks existing public API contracts or consumer expectations, it MUST increment the MAJOR version, regardless of whether the original behavior was intended as a bug."
        },
        {
          w: "Zero-major versions (`0.x.x`) follow the same breaking change rules as stable versions (`1.x.x+`).",
          r: "Under SemVer clause 4, `0.y.z` is initial development where anything may change at any time; many package managers treat `0.2.0` to `0.3.0` as a breaking change."
        },
        {
          w: "Semantic versioning guarantees that a dependency upgrade will never break your application in practice.",
          r: "SemVer relies on human judgment and discipline; developers frequently make accidental breaking changes in minor/patch releases (Hyrum's Law: every observable behavior becomes a dependency for someone)."
        }
      ],
      trade: {
        buys: [
          "Predictable dependency upgrades: automated package managers safely pull bug fixes and features without breaking builds.",
          "Explicit developer expectations: communicating API breaking changes upfront reduces user surprise and debugging time.",
          "Automated release pipelines: tools like semantic-release can automatically calculate version bumps from commit messages.",
          "Standardized ecosystem interoperability: establishes a universal language across npm, Cargo, Maven, Go modules, and PyPI."
        ],
        costs: [
          "Release overhead: maintaining strict backward compatibility requires disciplined API deprecation cycles.",
          "Major version churn: frequent breaking changes force Major version bumps, causing ecosystem fragmentation.",
          "Hyrum's Law vulnerability: subtle internal behavior changes can break downstream consumers even if the formal signature did not change.",
          "Pre-1.0 ambiguity: maintaining `0.x.x` for years delays formal compatibility guarantees to consumers."
        ],
        avoid: [
          "Introducing breaking changes in a MINOR or PATCH release, breaking downstream production builds.",
          "Treating version numbers as marketing vehicles (e.g., jumping from v2.0 to v10.0 for promotional flair).",
          "Staying on version `0.x.x` indefinitely for production software relied upon by thousands of external consumers.",
          "Failing to document breaking changes and migration paths in accompanying release notes when bumping MAJOR."
        ]
      }
    },
    {
      slug: "changelog",
      why: {
        before: "Software releases were shipped with no release notes, or raw `git log` dumps filled with messy commit messages like 'fixed typo', 'wip', 'fix bug 2', and 'final merge'.",
        problem: "Users, operations teams, and library consumers could not decipher what changed, whether an upgrade contained breaking changes, what security vulnerabilities were patched, or how to migrate their code.",
        shift: "Curated, structured Changelogs (formalized by the 'Keep a Changelog' standard) provide human-readable, chronological records of notable changes for each software version, categorized by change type."
      },
      num: {
        t: "Keep a Changelog Categories & Release Documentation Standards",
        h: ["Change Category", "Definition & Purpose", "SemVer Correlation", "Target Audience", "Example Entry"],
        r: [
          ["Added", "New user-facing features or public API functions", "Triggers MINOR version increment", "Developers & end users seeking new capabilities", "Added support for OAuth2 PKCE authorization flow"],
          ["Changed", "Changes in existing functionality without breaking APIs", "Triggers MINOR or PATCH depending on impact", "Existing users monitoring behavioral shifts", "Changed default cache eviction policy from FIFO to LRU"],
          ["Deprecated", "Features marked for impending removal in upcoming releases", "Precedes upcoming MAJOR breaking change", "Developers planning migration roadmaps", "Deprecated `client.connect()`; use `client.connectAsync()`"],
          ["Removed", "Features or APIs completely deleted from the codebase", "Requires MAJOR version increment", "Developers migrating to new major versions", "Removed support for legacy TLS 1.0 and 1.1 handshakes"],
          ["Fixed", "Defect resolutions and bug fixes", "Triggers PATCH version increment", "Operations & reliability engineers verifying stability", "Fixed memory leak in connection pool during network partition"],
          ["Security", "Vulnerabilities patched and CVE remediations", "Triggers PATCH or backported security release", "Security teams, compliance auditors, and sysadmins", "Remediated CVE-2026-1042: Patched prototype pollution in parser"]
        ],
        n: "A high-quality changelog adheres to the 'Keep a Changelog' principles: it is written for humans (not a machine-generated dump of raw git commits), contains one entry per notable change, clearly specifies the version number and release date (ISO 8601 `YYYY-MM-DD`), and groups entries under standardized headings: Added, Changed, Deprecated, Removed, Fixed, and Security. In modern DevOps pipelines, changelog generation is often automated using Conventional Commits (e.g., `feat:`, `fix:`, `feat!:`, `chore:`) via tools like `standard-version`, `commitizen`, or `release-it`. These tools parse structured commit messages since the previous Git tag, determine the appropriate SemVer bump, generate the formatted changelog entry, and attach it to GitHub/GitLab Releases automatically."
      },
      miss: [
        {
          w: "A git commit log (`git log --oneline`) is an acceptable substitute for a changelog.",
          r: "Raw git logs are cluttered with internal development noise, typos, reverted commits, and technical jargon; a changelog is a curated, human-centric document explaining user impact."
        },
        {
          w: "Changelogs are only necessary for open-source libraries and have no value for internal microservices.",
          r: "Internal microservices and APIs rely on changelogs for smooth inter-team communication, incident root-cause investigations, and audit compliance during deployment rollouts."
        },
        {
          w: "You should rewrite past changelog entries if you realize an old bug existed in an earlier release.",
          r: "A changelog is an immutable historical record of what was released at that point in time; retroactively rewriting old release sections causes confusion and breaks auditability."
        },
        {
          w: "Automated commit messages can write great changelogs without any human editorial discipline.",
          r: "Automated tools require strict adherence to Conventional Commits; if developers write lazy commit headers, automated changelogs become useless noise without human review."
        }
      ],
      trade: {
        buys: [
          "Seamless upgrade decisions: consumers immediately know whether an upgrade requires code changes or fixes a blocker.",
          "Rapid incident triage: during production outages, on-call engineers check the changelog to correlate incidents with new changes.",
          "Audit & compliance readiness: provides an official, verifiable trail of security patches and vulnerability remediations.",
          "Transparent customer communication: builds trust with users by openly communicating new features and bug resolutions."
        ],
        costs: [
          "Maintenance discipline: developers must consistently update `CHANGELOG.md` or write pristine conventional commits.",
          "Release pipeline overhead: integrating automated changelog tools requires configuring CI release workflows.",
          "Deprecation timeline tracking: requires managing and communicating deprecation timelines across multiple versions.",
          "Coordination overhead: multi-team projects require editorial alignment to ensure consistent entry formatting."
        ],
        avoid: [
          "Publishing changelogs that say 'Bug fixes and performance improvements' with zero specifics on what changed.",
          "Dumping raw, unedited git commit histories directly into user-facing release notes.",
          "Releasing breaking changes in a major release without documenting them in the 'Removed' or 'Changed' sections.",
          "Omitting the release date or using ambiguous date formats instead of standard ISO 8601 (`YYYY-MM-DD`)."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
