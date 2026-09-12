/* ==========================================================================
   Depth pass 130 — DevOps & Cloud batch 1: Culture, CI/CD & Delivery Pipelines.
   DevOps, CI/CD, Continuous Integration, Continuous Deployment,
   Pipeline, Artifact, GitHub Actions.

   DORA cultural acceleration, trunk-based integration loops, automated deployment pipelines,
   immutable content-addressed build artifacts, and declarative YAML workflow runtimes
   establish automated continuous delivery foundations.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "devops",

      why: {
        before: "Software development was divided by a rigid 'wall of confusion': developers wrote features and threw them over the wall to a separate operations team that was measured solely on uptime and stability; releases occurred once every six months, deployments were manual panic sessions, and production outages triggered toxic finger-pointing.",
        problem: "Modern business demands rapid iteration and continuous feature delivery, but separating development from operations creates conflicting incentives, bureaucratic Change Advisory Boards (CABs), delayed bug detection, and fragile manual releases.",
        shift: "**DevOps: An organizational culture, engineering philosophy, and operational practice that unites software development (Dev) and IT operations (Ops) to shorten the systems development life cycle while delivering features, fixes, and updates reliably and continuously.** Championing shared ownership ('You build it, you run it'), DevOps replaces silos with automated CI/CD, infrastructure as code, and blameless retrospectives."
      },

      num: {
        t: "DevOps Maturity Paradigms: Traditional IT Ops vs DevOps vs SRE vs Platform Engineering",
        h: ["Operating Model", "Core Responsibility Division", "Release Cadence & Batch Size", "Infrastructure Provisioning", "Incident Culture & Postmortem"],
        r: [
          ["Traditional IT Ops", "Siloed Dev vs Ops teams; manual handover tickets", "Quarterly / Biannual massive releases", "Manual ticket-based server configuration", "Blame-centric; punitive root-cause assignment"],
          ["DevOps Culture", "Shared ownership ('You build it, you run it')", "Daily / Weekly small batch releases", "Infrastructure as Code (Terraform, Ansible)", "Blameless postmortems; systemic process fixes"],
          ["Site Reliability Engineering (SRE)", "Software engineers applying software methods to Ops", "Continuous deployment governed by Error Budgets", "Declarative self-healing infrastructure (Kubernetes)", "Quantitative SLA/SLO review; automated toil cap (50%)"],
          ["Platform Engineering", "Dedicated team provides Internal Developer Platform (IDP)", "Continuous self-service deployment by product teams", "Golden paths, automated platform APIs", "Paved-road resilience, automated telemetry"]
        ],
        n: "The efficacy of a DevOps organization is measured scientifically by the **DORA Metrics (DevOps Research and Assessment)**: (1) **Deployment Frequency** (how often an organization successfully deploys code to production; elite performers deploy multiple times per day); (2) **Lead Time for Changes** (time elapsed from code commit to running in production; elite: <1 hour); (3) **Change Failure Rate** (percentage of deployments causing degraded service or requiring hotfixes; elite: 0-15%); and (4) **Time to Restore Service (MTTR)** (time required to recover from a production incident; elite: <1 hour). Achieving elite DORA performance requires the **CALMS Framework**: Culture (shared empathy), Automation (CI/CD and IaC), Lean (small batch sizes), Measurement (telemetry and observability), and Sharing (blameless knowledge transfer)."
      },

      miss: [
        {
          w: "DevOps is a specific job title or an isolated team you hire to manage cloud servers.",
          r: "DevOps is an **organizational culture and shared operational practice**, not a single job title. Creating a separate 'DevOps Team' that manages deployments simply creates a third silo between developers and operations, perpetuating the exact wall of confusion DevOps was designed to abolish."
        },
        {
          w: "DevOps means developers must spend all their time managing Kubernetes YAML and Linux kernels.",
          r: "DevOps empowers developers through **self-service automation and Platform Engineering**. Product engineers own the operation and monitoring of their code in production, supported by standardized 'paved roads' and infrastructure abstractions."
        },
        {
          w: "Deploying software multiple times per day is inherently riskier than deploying once every few months.",
          r: "Empirical DORA research proves the exact opposite: **frequent, small deployments carry exponentially lower risk**. A 20-line change that causes a regression is trivially diagnosed and rolled back in 2 minutes, whereas a 6-month release with 50,000 lines of code introduces unknown combinatorial failures."
        },
        {
          w: "DevOps eliminates the need for operations engineers and system architects.",
          r: "DevOps transforms operations engineers into **Site Reliability Engineers and Platform Architects** who design automated cloud platforms, CI/CD pipelines, observability fabrics, and security policies rather than executing manual server maintenance."
        }
      ],

      trade: {
        buys: [
          "Rapid time-to-market: ship customer value, security patches, and experiments in hours rather than months.",
          "Radically lower change failure rates: small, decoupled commits make bugs easily isolated, diagnosed, and resolved.",
          "Psychological safety and blameless culture: engineers report mistakes openly, transforming outages into learning opportunities.",
          "High operational stability: automated testing, continuous integration, and canary rollouts catch defects before users see them."
        ],
        costs: [
          "Cultural transformation friction: requires dismantling entrenched organizational hierarchies and changing management mindsets.",
          "Toolchain and automation overhead: managing CI/CD systems, Kubernetes clusters, and monitoring fabrics requires engineering effort.",
          "On-call responsibility for developers: developers must participate in on-call rotations, requiring training and operational readiness.",
          "Alert fatigue risk: poorly tuned telemetry can inundate product engineers with noisy, non-actionable production alerts."
        ],
        avoid: [
          "Never create an isolated 'DevOps Team' that acts as an intermediary ticket queue between developers and production.",
          "Never conduct punitive postmortems that blame individuals for human error; fix systemic process and automation gaps.",
          "Never prioritize release velocity while neglecting automated testing and observability guardrails.",
          "Never measure developers on vanity metrics (lines of code, story points) instead of DORA business outcome metrics."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ci-cd",

      why: {
        before: "Software teams endured 'Integration Hell': developers isolated themselves in feature branches for months, and merging them together before a release produced thousands of code conflicts, broken unit tests, and weeks of manual regression testing on shared staging servers.",
        problem: "Organizations need to eliminate manual release friction, detect integration regressions within minutes of writing code, and maintain the software in an always-releasable state.",
        shift: "**CI/CD (Continuous Integration / Continuous Delivery): The combined engineering practice and automated pipeline that validates, tests, and prepares every code change for immediate production release.** Automating the path from git commit to live deployment, CI/CD replaces manual release ceremonies with predictable automated workflows."
      },

      num: {
        t: "CI/CD Progression: From Manual Release to Continuous Deployment",
        h: ["Phase", "Core Trigger & Action", "Verification Mechanism", "Human Approval Gate?", "Deployment Cadence"],
        r: [
          ["Continuous Integration (CI)", "Developer pushes commit to git branch", "Automated linting, unit testing, security scanning", "N/A (build & test verification only)", "Tens of times daily per developer"],
          ["Continuous Delivery (CDel)", "Commit passes CI and merges to mainline", "Builds deployable artifact; tests in staging", "Yes (manual 1-click approval for production)", "Daily to weekly production releases"],
          ["Continuous Deployment (CDep)", "Commit passes all automated test stages", "Fully automated canary/blue-green rollout to prod", "No (100% automated release pipeline)", "Multiple times per day automatically"],
          ["GitOps Delivery", "Git repository state acts as single source of truth", "Pull-based cluster reconcilers (ArgoCD / Flux)", "Controlled via Git Pull Request approval", "Continuous automated state synchronization"]
        ],
        n: "CI/CD operates as a continuous automated feedback loop. The **Continuous Integration (CI)** half mandates that developers integrate small batches of code into the shared mainline branch at least daily. Every push triggers an automated build that compiles code, runs linting, executes unit and integration tests, and scans dependencies for vulnerabilities. The **Continuous Delivery (CD)** half packages the validated code into an immutable, versioned artifact (such as a Docker image) and deploys it to a production-mirror staging environment. In Continuous Delivery, pushing to production remains a **one-click manual business decision**; in **Continuous Deployment**, even that manual click is eliminated, and every commit that passes the automated pipeline is deployed directly to production users within minutes."
      },

      miss: [
        {
          w: "Continuous Delivery and Continuous Deployment mean the exact same thing.",
          r: "In **Continuous Delivery**, every commit is *deployable* to production, but the actual production rollout requires a human business trigger (e.g., clicking a button). In **Continuous Deployment**, there is *no human approval gate*; every passing commit automatically deploys directly to production."
        },
        {
          w: "A pipeline that takes 45 minutes to run is fine as long as it runs comprehensive end-to-end tests.",
          r: "Slow CI pipelines kill developer productivity. If a pipeline takes 45 minutes, developers switch tasks, ignore test results, and batch up giant commits. **A production CI pipeline must complete in under 10 minutes** through aggressive test parallelization and dependency caching."
        },
        {
          w: "A broken build on the main branch can be left for the next sprint or investigated when convenient.",
          r: "A red (failing) mainline is an **immediate P0 team emergency**. All subsequent developer merges will be blocked or masked by the failure. The team must stop all feature work immediately to either fix the build or revert the offending commit."
        },
        {
          w: "CI/CD pipelines eliminate the need for automated rollback mechanisms.",
          r: "Even with 100% test coverage, unanticipated production loads and edge-case data anomalies can cause live outages. A robust CI/CD pipeline **must include automated canary health checks and sub-minute rollback automation**."
        }
      ],

      trade: {
        buys: [
          "Rapid defect detection: bugs and integration conflicts are identified within minutes of code being written.",
          "Small batch sizes: commits consisting of 10-50 lines of code make root cause analysis trivial when pipelines fail.",
          "Elimination of release ceremonies: releases become routine, non-events executed during normal business hours.",
          "High developer velocity: developers spend time writing business features rather than manually executing tests and deployments."
        ],
        costs: [
          "Pipeline maintenance overhead: flaky tests, toolchain upgrades, and runner capacity require continuous engineering attention.",
          "Infrastructure compute costs: running thousands of automated builds and test containers daily consumes cloud compute resources.",
          "Strict engineering discipline required: developers must write reliable automated tests and commit code frequently.",
          "Security attack surface: CI/CD runners hold production deployment secrets and require strict access hardening."
        ],
        avoid: [
          "Never tolerate flaky tests in your CI/CD pipeline; quarantine or delete tests that intermittently fail without cause.",
          "Never build different artifacts for different environments; build once, promote the identical artifact from staging to prod.",
          "Never allow developers to bypass CI/CD checks using force-push or admin override privileges on protected branches.",
          "Never store plaintext cloud secrets or long-lived API keys in pipeline configuration files; use OIDC and secret managers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "continuous-integration",

      why: {
        before: "Developers worked in isolated personal git branches for weeks; when integrating code into the shared repository, thousands of lines collided, third-party libraries conflicted, and tests failed without identifying whose change broke the system.",
        problem: "Software teams need immediate, automated verification that newly authored code integrates cleanly with the main codebase, conforms to linting standards, passes unit tests, and introduces no security vulnerabilities.",
        shift: "**Continuous Integration (CI): The software engineering practice where members of a team integrate their work into a shared mainline repository frequently (at least daily), with each integration verified by an automated build and test pipeline.** Championed by Extreme Programming and trunk-based development, CI catches regressions at the earliest possible moment."
      },

      num: {
        t: "Continuous Integration Quality Gates: Execution Order & SLA Metrics",
        h: ["Pipeline Stage", "Automated Tooling", "Execution Latency SLA", "Flakiness Probability", "Primary Architectural Guardrail"],
        r: [
          ["Static Analysis & Linting", "ESLint, Ruff, SonarQube, shellcheck", "10 - 30 seconds", "0% (deterministic AST parsing)", "Enforces syntax rules, security best practices, formatting"],
          ["Type Checking & Compilation", "TypeScript `tsc`, Go `build`, Rust `cargo`", "30 - 60 seconds", "0% (deterministic compiler type check)", "Guarantees interface contracts and compile-time type safety"],
          ["Unit Test Suite", "Jest, Pytest, Go test, JUnit", "1 - 3 minutes", "<0.1% (in-memory execution with fakes)", "Verifies isolated business logic algorithms and edge cases"],
          ["Integration & DB Tests", "Testcontainers, Docker Compose, SQLite", "2 - 5 minutes", "Low (bounded DB transactions in containers)", "Validates ORM queries, schema migrations, API contracts"],
          ["Dependency & CVE Audit", "Snyk, Dependabot, Trivy, npm audit", "30 - 60 seconds", "Zero (scans against known vulnerability DBs)", "Blocks known supply-chain vulnerabilities before build"]
        ],
        n: "Continuous Integration is governed by Martin Fowler's classic principles: (1) **Maintain a Single Source Repository**; (2) **Automate the Build**; (3) **Make Your Build Self-Testing**; (4) **Everyone Commits to the Mainline Every Day** (Trunk-Based Development); (5) **Every Commit Builds the Mainline on an Integration Machine**; (6) **Fix Broken Builds Immediately**; (7) **Keep the Build Fast** (<10 minutes); (8) **Test in a Clone of the Production Environment**; and (9) **Make it Easy for Anyone to Get the Latest Executable**. A critical operational hazard is **Flaky Tests**: tests that fail intermittently due to race conditions or timing issues. Flaky tests destroy trust in the CI system, leading engineers to re-run builds blindly. Flaky tests MUST be quarantined immediately."
      },

      miss: [
        {
          w: "Continuous Integration simply means having an automated tool like GitHub Actions running on your repo.",
          r: "CI is a **developer practice**, not just a tool. If developers write code in private branches for three weeks and only open a pull request at the end of the sprint, they are **NOT practicing Continuous Integration**, regardless of how many automated tools run on the PR."
        },
        {
          w: "Flaky tests that fail only 5% of the time can be tolerated by simply clicking 'Re-run'.",
          r: "Flaky tests are **toxic to engineering velocity**. A 5% failure rate across 20 test files means the overall pipeline will fail more than 60% of the time. Engineers stop trusting the test signal, ignore real regressions, and bypass gates."
        },
        {
          w: "The CI pipeline should run all end-to-end browser UI tests and performance load tests on every commit.",
          r: "Running heavy, multi-hour E2E tests on every single commit slows the feedback loop to a crawl. **CI must be fast (<10 min)**. Heavy end-to-end tests should be partitioned into asynchronous nightly runs or post-merge staging checks."
        },
        {
          w: "Code can be merged to main even if unit tests fail, as long as the developer promises to fix it later.",
          r: "Merging broken code to the mainline poisons the well for the entire team. In disciplined CI environments, **branch protection rules strictly forbid merging any pull request that fails automated quality gates**."
        }
      ],

      trade: {
        buys: [
          "Early regression discovery: detects compilation errors, contract breaks, and logic bugs minutes after code is committed.",
          "Elimination of merge paralysis: frequent daily integrations ensure merge conflicts remain small, localized, and easy to resolve.",
          "High code quality consistency: linters, type checkers, and formatters enforce uniform coding standards automatically.",
          "Continuous release readiness: guarantees the main branch is always in a working, deployable state."
        ],
        costs: [
          "Test suite maintenance overhead: writing and updating unit and integration tests requires dedicated engineering time.",
          "Flaky test triage: identifying and resolving intermittent timing and concurrency bugs in tests consumes senior engineer time.",
          "CI runner infrastructure compute: running multi-node parallelized build runners incurs monthly cloud infrastructure bills.",
          "Merge queuing friction: high-velocity engineering teams face merge queues and CI runner queue delays during peak hours."
        ],
        avoid: [
          "Never allow long-lived feature branches that diverge from the mainline for more than 1-2 days.",
          "Never ignore a failing CI build on the main branch; revert the commit immediately if not fixable within 10 minutes.",
          "Never allow non-deterministic tests (network calls, unseeded random numbers, sleep timers) inside unit test suites.",
          "Never run CI builds without caching package manager dependencies (e.g., `actions/setup-node with cache: npm`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "continuous-deployment",

      why: {
        before: "Software deployments required human Change Advisory Boards (CABs), executive sign-offs, and weekend maintenance windows; code that was finished and tested sat idle in staging for weeks, delaying customer feedback and bundling hundreds of changes into high-risk giant releases.",
        problem: "Organizations need to deliver validated features to end users within minutes of passing tests, eliminating human gatekeeping friction while maintaining rock-solid production availability.",
        shift: "**Continuous Deployment (CD): The advanced software release practice where every code change that successfully passes all stages of the automated production pipeline is released automatically into live production with zero human intervention.** Requiring robust canary rollouts, automated health monitoring, and instant automated rollbacks, Continuous Deployment maximizes delivery speed and organizational agility."
      },

      num: {
        t: "Release Delivery Modes: Continuous Delivery vs Continuous Deployment",
        h: ["Dimension", "Continuous Delivery (Manual Gate)", "Continuous Deployment (Automated)", "Canary Rollout Automation", "Typical Time to Production"],
        r: [
          ["Production Release Gate", "Manual business sign-off / 1-click trigger", "Zero human gates; 100% automated release", "Automated traffic routing via ingress", "Minutes from git push to live traffic"],
          ["Testing Rigor Required", "High (automated unit & integration tests)", "Extreme (automated synthetic, contract, & canary)", "Automated metric anomaly detection", "Immediate upon pipeline green status"],
          ["Rollback Mechanism", "Manual trigger or automated scripts", "Fully automated health metric rollback", "Instant traffic shift to previous baseline", "Sub-minute automated traffic reversal"],
          ["Feature Release Control", "Coupled to code deployment", "Decoupled via Feature Flags (LaunchDarkly)", "Gradual user cohort rollout", "Features dark until enabled via flag"],
          ["Organizational Fit", "Regulated banking, medical devices, legacy enterprise", "Modern SaaS, internet-scale tech (Netflix, GitHub)", "Essential for production safety", "Multiple releases per engineer per day"]
        ],
        n: "Continuous Deployment represents the pinnacle of DevOps maturity. Because there is no human verification before code hits production, safety must be guaranteed through **Automated Progressive Delivery**: (1) **Canary Deployment**: newly deployed code receives only 1-5% of live production traffic; (2) **Automated Canary Analysis (ACA)**: monitoring systems (Prometheus, Datadog) compare real-time metrics (error rates, P99 latency, HTTP 5xx responses) between the canary pod and the baseline pods; (3) **Automated Promotion or Rollback**: if metrics remain healthy after 10 minutes, traffic ramps to 25%, 50%, and 100%; if error rates exceed a threshold (e.g., 0.1%), the deployment system automatically rolls back traffic to the previous version and alerts on-call engineers; and (4) **Feature Flag Decoupling**: code is deployed 'dark' with new features disabled, allowing product managers to release features to user cohorts independently."
      },

      miss: [
        {
          w: "Continuous Deployment means deploying untested code directly to production users.",
          r: "Continuous Deployment requires the **most rigorous, comprehensive automated test suites in the industry**. Code must pass linting, unit tests, integration tests, contract tests, security scans, staging smoke tests, and canary metric evaluations before handling 100% of user traffic."
        },
        {
          w: "Continuous Deployment makes manual QA testers obsolete.",
          r: "Manual testers transition from running repetitive regression test checklists to **Exploratory Testing, usability testing, and chaos engineering**, discovering edge cases that automated unit tests cannot anticipate."
        },
        {
          w: "Continuous Deployment is impossible in regulated industries (HIPAA, PCI-DSS, SOC 2).",
          r: "Regulated standards mandate **traceability, auditability, separation of duties, and verification**. A properly audited CI/CD pipeline where peer review is enforced via protected pull requests satisfies compliance standards far better than manual error-prone release spreadsheets."
        },
        {
          w: "Every company should immediately adopt Continuous Deployment on day one.",
          r: "Continuous Deployment requires mature observability, automated rollbacks, comprehensive test suites, and feature flagging. Attempting continuous deployment without these safety guardrails leads to continuous production outages. **Teams should master Continuous Delivery first**."
        }
      ],

      trade: {
        buys: [
          "Zero release latency: customer bug fixes and features go live within minutes of code review approval.",
          "Radically smaller failure blast radius: tiny incremental changes mean failures are isolated and instantly understood.",
          "Elimination of release anxiety: releases happen continuously during daylight hours; zero weekend maintenance windows.",
          "Rapid competitive feedback loop: product teams validate hypotheses and iterate with real user data in real time."
        ],
        costs: [
          "Extreme test suite maintenance burden: test suites must be comprehensive, robust, fast, and 100% flake-free.",
          "Complex progressive delivery infrastructure: requires service meshes (Istio), canary controllers (Argo Rollouts, Flagger), and APM.",
          "Feature flag technical debt: requires rigorous management and prompt cleanup of feature toggles across the codebase.",
          "High cultural maturity requirement: demands strict adherence to peer code reviews and blameless operational discipline."
        ],
        avoid: [
          "Never implement Continuous Deployment without automated metric-based rollback capabilities.",
          "Never deploy directly to 100% of production traffic in one burst; use progressive canary rollouts.",
          "Never couple code deployment with business release; use feature flags to release functionality independently.",
          "Never allow single-developer direct pushes to production branches; enforce peer reviews and automated checks."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pipeline",

      why: {
        before: "Software was built and deployed using manual bash scripts executed on individual developers' laptops; builds succeeded or failed depending on what local dependencies, compilers, or environment variables the developer had installed, making releases completely non-reproducible.",
        problem: "Software teams require a declarative, repeatable, automated sequence of stages that compiles code, executes verification checks, and promotes immutable build artifacts through testing environments to production.",
        shift: "**Pipeline (Build & Deployment Pipeline): An automated, deterministic sequence of stages and jobs that a code commit must pass through to be validated, packaged, and deployed.** Defined as version-controlled code (`.github/workflows`, `Jenkinsfile`), pipelines enforce consistent quality gates across the delivery lifecycle."
      },

      num: {
        t: "CI/CD Pipeline Topologies: Architectural Comparison",
        h: ["Topology", "Execution Flow", "Failure Optimization", "Compute Efficiency", "Ideal Pipeline Stage"],
        r: [
          ["Linear Sequential Pipeline", "Stage 1 -> Stage 2 -> Stage 3 -> Stage 4", "Fails fast at earliest bottleneck", "Low (runners wait sequentially)", "Simple applications, small repositories"],
          ["Parallel Matrix Build", "Fans out across multiple OS/language versions", "Tests matrix simultaneously in parallel", "High compute burst; fast overall wall time", "Open source libraries, multi-platform SDKs"],
          ["Directed Acyclic Graph (DAG)", "Jobs execute as soon as explicit dependencies finish", "Maximum efficiency (bypasses rigid stage barriers)", "Optimal (minimizes idle runner time)", "Complex enterprise microservices, monorepos"],
          ["Ephemeral Container Runners", "Spins up fresh isolated container per job", "Zero pollution (guaranteed clean state)", "Requires container image pull overhead", "Standard secure cloud CI (GitHub Actions, GitLab)"],
          ["Self-Hosted Persistent Runners", "Runs on dedicated long-lived VM/bare-metal server", "High build cache reuse (fast disk I/O)", "Risk of workspace pollution and state drift", "Heavy C++/Rust builds, iOS Xcode builds, GPU training"]
        ],
        n: "A production pipeline is structured according to the **Fail-Fast Principle**: the cheapest, fastest, and most likely-to-fail checks execute first. A canonical delivery pipeline consists of five stages: (1) **Validation (Fast Feedback <1 min)**: syntax linting, static type checking, and secret scanning; (2) **Compilation & Unit Testing (1-3 min)**: building code in clean containers and executing in-memory unit tests; (3) **Artifact Generation & Scanning (2-3 min)**: building an immutable OCI container image, generating a Software Bill of Materials (SBOM), and scanning image layers for CVEs; (4) **Integration Testing (3-5 min)**: deploying the artifact to an ephemeral preview environment to test database migrations and API contracts; and (5) **Production Deployment (Canary)**: promoting the *exact same artifact* to production via progressive traffic shifting."
      },

      miss: [
        {
          w: "A pipeline should rebuild the application container image for each target environment.",
          r: "Rebuilding per environment violates the fundamental law of CD: **Build Once, Promote Everywhere**. Rebuilding in staging and then rebuilding in production risks pulling different upstream base images or npm dependencies, deploying untested code to production."
        },
        {
          w: "Pipeline definitions should be configured manually inside web UI dashboards.",
          r: "Pipeline configurations MUST be stored as **Pipeline as Code** (`.github/workflows/*.yml` or `Jenkinsfile`) inside the application repository. This ensures pipeline changes are peer-reviewed, versioned, and rolled back with the code."
        },
        {
          w: "Running all pipeline jobs in parallel is always better than sequential stages.",
          r: "Running expensive integration tests and cloud deployments in parallel with fast linters wastes massive compute resources. If the linter fails on line 5, you want to **fail fast and cancel expensive downstream jobs immediately**."
        },
        {
          w: "Self-hosted CI runners are always more secure than public cloud runners.",
          r: "Self-hosted runners maintain persistent disk state across runs. If an untrusted pull request from a fork executes malicious code, it can **poison the runner's disk cache and exfiltrate secrets**. Public ephemeral runners provide pristine, disposable virtualization per job."
        }
      ],

      trade: {
        buys: [
          "Deterministic reproducibility: builds execute identically regardless of which developer authored the code.",
          "Enforced quality gates: prevents unlinted, untested, or vulnerable code from ever reaching staging or production.",
          "Rapid developer feedback: fail-fast stage ordering alerts developers to syntax and test errors within 60 seconds.",
          "Full audit traceability: git commit history links directly to pipeline build logs, test reports, and deployed artifact hashes."
        ],
        costs: [
          "Pipeline maintenance overhead: debugging CI environment timeouts, runner provisioning, and cache invalidation consumes time.",
          "Cloud compute costs: high-frequency parallelized CI pipelines generate noticeable monthly cloud infrastructure bills.",
          "Merge queue delays: if multiple developers merge simultaneously, pipeline execution queues can slow down delivery.",
          "Secret management complexity: pipeline runners require secure credential injection (OIDC) to deploy to cloud providers."
        ],
        avoid: [
          "Never rebuild artifacts between staging and production; promote the identical immutable container digest.",
          "Never execute all pipeline stages sequentially when independent jobs (lint, type-check, unit-test) can run in parallel.",
          "Never allow pipeline configurations to live outside git version control.",
          "Never run un-sandboxed workflows on forks using `pull_request_target` without strict script validation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "artifact",

      why: {
        before: "Teams deployed software by pulling git source code directly onto production servers and running `npm install` or `pip install` live on production machines; differences in OS libraries, package manager network timeouts, or upstream package deletions caused servers to crash or behave inconsistently.",
        problem: "Production deployments require an immutable, self-contained, versioned binary package that has been tested in staging and can be deployed to thousands of production servers with zero runtime compilation or external dependency fetching.",
        shift: "**Artifact: An immutable, versioned, deployable binary package or archive generated by a build process that encapsulates all application code, compiled binaries, and runtime dependencies.** Embodying the 'Build Once, Deploy Everywhere' philosophy, artifacts are stored in centralized registries and deployed consistently across all environments."
      },

      num: {
        t: "Software Artifact Formats: Operational Comparison",
        h: ["Artifact Format", "Encapsulated Content", "Immutability & Integrity Guarantee", "Storage Repository / Registry", "Deployment Portability"],
        r: [
          ["OCI Container Image", "App code, runtime binaries, OS libraries, configs", "Cryptographic SHA-256 layer digests", "Container Registry (ECR, Docker Hub, GCR)", "Runs identically on any OCI-compliant container engine"],
          ["Compiled Native Binary", "Standalone executable (Go, Rust, C++)", "Cryptographic checksum (SHA-256)", "GitHub Releases, S3, Artifactory", "Requires matching OS/architecture target (Linux x86_64)"],
          ["Language Package Archive", "Bytecode/source (Java JAR/WAR, Python Wheel)", "Signed archive with package metadata", "Maven Central, PyPI, Nexus", "Requires pre-installed language runtime (JVM, Python)"],
          ["Static Web Bundle", "Minified HTML, JS, CSS, and web assets", "Content-addressed file hashing (`app.8f3a.js`)", "S3, Cloudflare Pages, CDN Edge", "Universal across web browsers via HTTP CDN"],
          ["OS Package (Deb/RPM)", "Binaries, systemd unit files, dependencies", "GPG signature verification", "Apt, Yum, private package repository", "Tightly coupled to specific Linux distribution"]
        ],
        n: "The defining engineering law of software artifacts is: **Build Once, Deploy Everywhere**. When code merges to main, the CI pipeline compiles the code and generates a single artifact (e.g., Docker image tag `sha-b4ffde6`). This exact artifact is deployed to development, then promoted to staging, and finally promoted to production. Crucially, **tags are mutable, but digests are immutable**: referencing an image by tag (`my-app:v1.2`) allows upstream registries to overwrite the image; production systems MUST reference artifacts by their **immutable cryptographic SHA-256 digest** (`my-app@sha256:7f83b1657ff1fc5...`). In secure software supply chains, artifacts are signed using tools like **Cosign (Sigstore)**, and accompanied by an automated **SBOM (Software Bill of Materials)**."
      },

      miss: [
        {
          w: "Deploying by running `git pull` on production servers is acceptable for simple web applications.",
          r: "Deploying via `git pull` requires running compilers and package managers on production servers, creates non-reproducible environments, risks network timeouts during package installation, and leaks production credentials. **Always deploy pre-built immutable artifacts**."
        },
        {
          w: "Container image tags like `v1.0.0` or `latest` are immutable guarantees of image contents.",
          r: "Container tags are **mutable pointers**: anyone with registry write access can push a new image to `v1.0.0`, silently altering what runs in production. **Production deployments must pin the immutable SHA-256 digest**."
        },
        {
          w: "Compiling a separate artifact for staging and production ensures environment-specific optimizations.",
          r: "Compiling separate artifacts completely destroys deployment confidence. A rebuild in production can pick up a minor patch of a transitive dependency that contains a critical bug. **The identical artifact tested in staging must be promoted to production**."
        },
        {
          w: "Artifact repositories should store every build artifact forever without retention limits.",
          r: "Container registries and artifact stores accumulate gigabytes of ephemeral build images daily. Without **retention policies** (e.g., pruning untagged images older than 30 days while keeping release tags), storage bills grow into thousands of dollars of wasted cloud spend."
        }
      ],

      trade: {
        buys: [
          "Zero environment discrepancy: guarantees that what was tested and verified in staging runs identically in production.",
          "Sub-second deployment starts: servers pull pre-compiled binaries immediately without compiling code or running package managers.",
          "Trivial instant rollbacks: rolling back requires simply redeploying the previous immutable artifact digest.",
          "Cryptographic supply chain verification: sign artifacts with Cosign to guarantee that only authorized CI builds execute in production."
        ],
        costs: [
          "Registry storage management: storing large container images across multiple versions consumes significant registry storage.",
          "Artifact promotion pipeline complexity: requires tooling to promote images between registry repositories and environments.",
          "Network transfer bandwidth: distributing 1GB+ container images across hundreds of nodes can saturate internal cluster networks.",
          "Vulnerability patching lag: base OS vulnerabilities require rebuilding and promoting fresh artifacts through the pipeline."
        ],
        avoid: [
          "Never rebuild an artifact when promoting software from staging to production.",
          "Never deploy container images using the mutable `:latest` tag in production environments.",
          "Never bake environment-specific secrets (database passwords, API keys) into the immutable artifact; inject at runtime.",
          "Never publish artifacts without automated CVE security scans (Trivy, Grype) checking for critical vulnerabilities."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "github-actions",

      why: {
        before: "Teams operated and maintained dedicated Jenkins master-slave servers, configuring SSH keys, updating Linux kernels, and fixing broken plugins just to run automated unit tests; maintaining the CI toolchain consumed 20-30% of DevOps engineering capacity.",
        problem: "Developers need an integrated, cloud-native CI/CD workflow engine built directly into their code hosting platform that triggers automatically on repository events, scales compute on demand, and requires zero server maintenance.",
        shift: "**GitHub Actions: GitHub's built-in automation and CI/CD platform that executes custom workflows directly within software repositories in response to any GitHub event.** Defining workflows as declarative YAML files, GitHub Actions provides disposable hosted runners, an expansive marketplace of actions, and native OIDC cloud authentication."
      },

      num: {
        t: "GitHub Actions Architecture & Runner Topologies: Comparative Analysis",
        h: ["Runner Type", "Hosting & Infrastructure", "Security & Workspace Isolation", "Custom Hardware / GPU Support", "Billing & Cost Model"],
        r: [
          ["GitHub-Hosted Standard", "Azure cloud VMs managed entirely by GitHub", "Ephemeral clean VM per job (zero persistence)", "Standard x86_64 / ARM64 vCPUs", "Per-minute billing (free tier included for public repos)"],
          ["GitHub-Hosted Larger", "Dedicated enterprise high-spec Azure VMs", "Ephemeral clean VM with static IP ranges", "High RAM, up to 64 vCPUs, macOS M1/M2", "Higher per-minute enterprise rate"],
          ["Self-Hosted Ephemeral", "Autoscaling Kubernetes pods (Actions Runner Controller / ARC)", "Ephemeral pod per job; destroyed on completion", "Full control: custom GPUs, internal VPC network", "Customer pays underlying cloud compute costs"],
          ["Self-Hosted Static", "Persistent dedicated virtual machines or bare metal", "Persistent disk (HIGH risk of state pollution)", "Full control: specialized hardware, local caches", "Fixed monthly server cost; requires OS maintenance"]
        ],
        n: "GitHub Actions structures automation around five core primitives: (1) **Workflows**: automated procedures declared in `.github/workflows/*.yml`; (2) **Events**: webhook triggers initiating workflows (`push`, `pull_request`, `schedule`, `workflow_dispatch`); (3) **Jobs**: sets of steps executing on the same runner; (4) **Steps**: individual shell tasks or actions executed sequentially; and (5) **Actions**: reusable packaged units of code. In production, security hardening is critical: (a) **Pin Actions to Immutable Commit SHAs**: referencing mutable tags (`uses: actions/checkout@v4`) allows compromised third-party repositories to execute arbitrary code; use full commit hashes (`uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`); (b) **Passwordless OIDC Federation**: connect to AWS/GCP using OpenID Connect (`aws-actions/configure-aws-credentials`) rather than storing permanent cloud access keys; and (c) **Restrict Fork PR Permissions**: never use `pull_request_target` with explicit checkouts of untrusted code."
      },

      miss: [
        {
          w: "Pinning third-party GitHub Actions to major release tags like `@v4` is completely safe.",
          r: "Git tags are **mutable pointers**. If an action author's account is compromised, an attacker can overwrite the `@v4` tag with malicious cryptomining or credential-stealing code. **Production security standards mandate pinning to immutable 40-character commit SHAs**."
        },
        {
          w: "The `pull_request_target` event trigger is just an alias for `pull_request`.",
          r: "`pull_request_target` runs in the context of the **base repository and has access to repository secrets and write tokens**, even when triggered by an untrusted fork. Checking out and executing code from the fork under `pull_request_target` is a **critical vulnerability allowing secret exfiltration**."
        },
        {
          w: "Workflows must use hardcoded AWS secret keys stored in repository secrets to deploy to cloud providers.",
          r: "Hardcoding static access keys creates credential rotation burdens and leak risks. GitHub Actions supports **OpenID Connect (OIDC)**: GitHub acts as an identity provider, issuing short-lived cryptographic identity tokens to assume cloud IAM roles without static keys."
        },
        {
          w: "All jobs in a GitHub Actions workflow run on the same virtual machine and share local files automatically.",
          r: "Each job in a workflow runs on a **completely separate, isolated virtual machine**. Files created in Job 1 do not exist in Job 2 unless explicitly passed using `actions/upload-artifact` and `actions/download-artifact`."
        }
      ],

      trade: {
        buys: [
          "Zero infrastructure maintenance: hosted runners eliminate the need to patch, upgrade, or scale CI/CD servers.",
          "Native GitHub integration: workflows integrate natively with pull requests, branch protection rules, checks, and deployments.",
          "Expansive action ecosystem: thousands of pre-built community actions automate common tasks (docker build, linting, notifications).",
          "Passwordless cloud authentication: native OIDC integration eliminates permanent cloud API credentials from repository secrets."
        ],
        costs: [
          "Supply chain security vulnerability: relying on third-party marketplace actions creates supply-chain attack vectors.",
          "Hosted runner compute costs: private repositories incur per-minute billing for runner compute beyond monthly quotas.",
          "Complex YAML syntax limitations: expressive control flow, loops, and dynamic task graphs can be awkward in declarative YAML.",
          "Vendor lock-in: workflow definitions are tightly coupled to GitHub's proprietary runtime schema."
        ],
        avoid: [
          "Never reference third-party marketplace actions using mutable branch or version tags; always pin to full commit SHAs.",
          "Never store long-lived AWS, GCP, or Azure root credentials in GitHub Secrets; use OIDC role federation.",
          "Never combine `pull_request_target` with a checkout of the PR head branch without strict review gates.",
          "Never print environment variables containing decrypted secrets into workflow logs; GitHub will mask known secrets, but novel variations can leak."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
