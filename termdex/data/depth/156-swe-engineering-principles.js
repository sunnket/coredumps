(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "solid",
      why: {
        before: "Object-oriented codebases deteriorated into rigid, fragile, and immobile architectures where a minor change in one module caused unexpected breaking cascades across distant classes.",
        problem: "Classes knew too much, did too much, depended on concrete implementations, and broke subtype substitutability, making codebases resist refactoring and impossible to test reliably.",
        shift: "Robert C. Martin (Uncle Bob) compiled the SOLID principles (SRP, OCP, LSP, ISP, DIP), providing five foundational design tenets that maximize maintainability, testability, and extensibility in software systems."
      },
      num: {
        t: "The Five SOLID Principles: Architectural Definitions & Violations",
        h: ["Acronym Principle", "Core Engineering Tenet", "Diagnostic Smell / Violation Symptom", "Structural Mechanism", "Primary Design Benefit"],
        r: [
          ["Single Responsibility (SRP)", "A module/class should have one, and only one, reason to change (single actor)", "God Class; class handles persistence, business rules, and UI formatting", "Decompose into specialized collaborating classes", "High cohesion; changes requested by one stakeholder don't impact others"],
          ["Open/Closed (OCP)", "Software entities should be open for extension, but closed for modification", "Switch statements checking type enums; editing existing class to add feature", "Abstract interfaces, Strategy pattern, polymorphism", "Add new business capabilities by adding new classes without editing existing code"],
          ["Liskov Substitution (LSP)", "Subtypes must be behavioral substitutes for their base types ($S \\le T$)", "Overriding method throws `UnsupportedOperationException`; type checks (`instanceof`)", "Strict behavioral subtyping; invariants & contracts preserved", "Polymorphic safety; client code works seamlessly with any subtype"],
          ["Interface Segregation (ISP)", "Clients should not be forced to depend on methods they do not use", "Fat interfaces with 20+ methods; implementing classes leave dummy empty bodies", "Decompose into role-specific client interfaces", "Low coupling; clients only recompile/retest when their specific interface changes"],
          ["Dependency Inversion (DIP)", "High-level modules should not depend on low-level modules; both depend on abstractions", "High-level business service instantiates concrete SQL database driver directly (`new`)", "Dependency Injection (DI) and Inversion of Control (IoC)", "Decouples domain business policy from infrastructure mechanisms and databases"]
        ],
        n: "The SOLID principles operate cohesively to guide object-oriented and modular system architecture. Single Responsibility (SRP) defines boundaries of change aligned with human business actors: if an accounting report class changes when tax laws change AND when email formatting changes, it violates SRP. Open/Closed (OCP) ensures systems grow by accretion of new code rather than mutation of existing code. Liskov Substitution (LSP, formulated by Barbara Liskov) mathematically requires that if $S$ is a subtype of $T$, then objects of type $T$ may be replaced with objects of type $S$ without altering any of the desirable properties of the program (preconditions cannot be strengthened, postconditions cannot be weakened). Interface Segregation (ISP) advocates for client-specific role interfaces. Finally, Dependency Inversion (DIP) turns traditional top-down architectural coupling upside-down: high-level business policy dictates the interfaces, and low-level infrastructure adapters (databases, message queues, external REST clients) implement those interfaces."
      },
      miss: [
        {
          w: "Single Responsibility Principle means every function or class should do only one trivial thing.",
          r: "SRP states a class should have one *reason to change*—meaning responsibility to a single business actor or stakeholder; it does not mean a class must have only one single method."
        },
        {
          w: "Liskov Substitution is automatically satisfied if the compiler allows the subclass to compile without errors.",
          r: "LSP is about *behavioral semantics*, not mere compiler type checking; a subclass that compiles but violates parent invariants, strengthens preconditions, or throws unexpected runtime errors violates LSP."
        },
        {
          w: "Dependency Inversion is just a fancy synonym for using a Dependency Injection framework like Spring or NestJS.",
          r: "DIP is high-level architectural principle about module dependency directions (business policy defining abstractions); Dependency Injection is merely a tactical creational pattern to wire instances."
        },
        {
          w: "Following SOLID requires creating separate interfaces for every single class in the entire application from day one.",
          r: "Premature interface extraction for classes that will never have multiple implementations adds needless indirection; extract interfaces when polymorphism or test boundaries genuinely demand it."
        }
      ],
      trade: {
        buys: [
          "Extreme testability: decoupling through abstractions and DIP allows trivial in-memory mocking and isolated unit testing.",
          "Long-term extensibility: OCP allows adding new features by writing new classes without risking regressions in existing code.",
          "High architectural resilience: changes to database technologies or UI frameworks do not affect core domain business rules.",
          "Reduced cognitive load: small, cohesive SRP classes with focused ISP interfaces are easy to understand and maintain."
        ],
        costs: [
          "Increased file and interface proliferation: strictly applying SOLID multiplies the number of classes and interfaces in a project.",
          "Indirection overhead: navigating control flow requires jumping through multiple interface definitions and DI containers.",
          "Risk of premature abstraction: applying all five principles dogmatically to simple CRUD apps causes over-engineering.",
          "Steep initial learning curve: junior developers often struggle to understand behavioral subtyping and dependency inversion."
        ],
        avoid: [
          "Creating 'God Objects' that handle database access, business algorithms, and HTTP rendering in a single 2,000-line class.",
          "Throwing `UnsupportedOperationException` in subclasses because the parent interface forced implementing an irrelevant method.",
          "Checking `if (obj instanceof Subclass)` in client code instead of relying on polymorphic dispatch (violating LSP/OCP).",
          "Hardcoding `new ConcretePostgresClient()` inside high-level business domain services."
        ]
      }
    },
    {
      slug: "dry",
      why: {
        before: "Developers repeatedly copy-pasted identical business calculations, validation routines, and SQL queries across multiple files in a codebase.",
        problem: "When a bug was discovered or a business rule changed, developers updated only 3 of the 5 copy-pasted locations, causing inconsistent behavior, subtle data corruption, and maintenance nightmares.",
        shift: "Andy Hunt and Dave Thomas formulated the DRY principle in 'The Pragmatic Programmer': 'Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.'"
      },
      num: {
        t: "DRY Implementation Spectrum & Architectural Trade-offs",
        h: ["Duplication Level / Scope", "Form of Duplication", "DRY Solution / Mechanism", "Engineering Risk if Left Duplicated", "Risk of Premature DRY Extraction"],
        r: [
          ["Literal / Textual Duplication", "Identical mathematical formulas or validation regexes", "Extract to pure utility function or domain Value Object", "Inconsistent updates; bug fixes miss copy-pasted sites", "Near zero; pure calculations should always be centralized"],
          ["Structural / Incidental Duplication", "Two unrelated database models share identical field names", "Keep separate; do not force shared base class", "Low; models change for completely different business reasons", "High; premature abstraction couples independent business domains"],
          ["API / Contract Duplication", "Frontend TypeScript types manually mirror Backend DB schema", "Generate TypeScript types automatically from OpenAPI/Prisma AST", "Type skew; frontend breaks when backend renames a field", "Moderate; requires automated schema codegen tooling in CI"],
          ["System-Level Knowledge Duplication", "Business validation rules repeated in DB constraints, Backend, and UI", "Single authoritative schema (e.g. Zod) shared across full stack", "Inconsistent validation; client permits inputs that backend rejects", "Requires full-stack monorepo or published shared validation packages"]
        ],
        n: "The true essence of the DRY (Don't Repeat Yourself) principle is the single representation of *knowledge*, not merely identical lines of code. Two completely independent pieces of code can appear syntactically identical by coincidence (incidental duplication) while representing distinct domain knowledge that will evolve in different directions for different business reasons. For example, validating that an e-commerce order quantity is positive and validating that a user's age is positive may look like identical `if (x > 0)` checks, but forcing them into a shared abstraction creates accidental coupling. Sandi Metz famously warned: 'Duplication is far cheaper than the wrong abstraction.' Pragmatic engineers allow duplication to occur up to three times (the Rule of Three) before abstracting, ensuring the underlying domain pattern has truly stabilized."
      },
      miss: [
        {
          w: "DRY means you should never have two blocks of code that look syntactically similar anywhere in a project.",
          r: "DRY is about duplicating business *knowledge*, not syntax; if two similar blocks change for different business reasons (incidental duplication), forcing a shared abstraction creates harmful coupling."
        },
        {
          w: "Copy-pasting test setup fixtures across unit tests is a horrible violation of DRY that must be eradicated.",
          r: "Unit tests prize readability and self-containment ('DAMP' - Descriptive And Meaningful Phrases) over DRY; excessive test abstraction obscures test intent and causes test brittleness."
        },
        {
          w: "The DRY principle only applies to programming language source code files.",
          r: "DRY applies to documentation, database schemas, build configurations, deployment manifests, and error messages; duplicate configs across environments violate DRY."
        },
        {
          w: "Creating a massive 5,000-line `Utils.js` file with shared functions is the best way to practice DRY.",
          r: "Generic grab-bag utility files violate Single Responsibility and Domain-Driven Design; shared knowledge should reside in cohesive domain modules or value objects."
        }
      ],
      trade: {
        buys: [
          "Single point of modification: fixing a defect or updating a tax calculation in the single authoritative source updates the entire system.",
          "Consistency guarantees: eliminates subtle behavioral divergence where different parts of the system calculate different totals.",
          "Reduced codebase size: eliminating boilerplate copy-paste reduces the total lines of code requiring maintenance.",
          "Enhanced domain clarity: extracting shared knowledge into dedicated domain objects makes business concepts explicit."
        ],
        costs: [
          "Wrong abstraction liability: abstracting incidental duplication couples unrelated domains, making future changes excruciatingly hard.",
          "Increased coupling: multiple consumers become dependent on a single shared module, complicating independent deployments.",
          "Parameter explosion: poorly abstracted shared functions accumulate dozens of boolean flags (`if (isSpecialCase)`) to serve different callers.",
          "Cognitive indirection: developers must trace through multiple shared layers rather than reading a self-contained routine."
        ],
        avoid: [
          "Creating shared abstractions between two modules on the first occurrence before a clear three-instance pattern emerges.",
          "Adding boolean flags to a shared function to handle slightly different behavior for different callers (violates OCP).",
          "Sacrificing test readability and clarity in automated test suites in a dogmatic pursuit of DRY.",
          "Manually duplicating backend database entity types in frontend code instead of auto-generating them."
        ]
      }
    },
    {
      slug: "kiss",
      why: {
        before: "Engineers designed complex, highly abstracted systems with intricate inheritance hierarchies, dynamic reflection, and multi-layered indirection for simple problems.",
        problem: "Over-engineered systems had high cognitive load, were infested with subtle edge-case bugs, took months to onboard new engineers, and were painfully difficult to debug during production outages.",
        shift: "Kelly Johnson (lead engineer at Lockheed Skunk Works) coined KISS ('Keep It Simple, Stupid'), establishing simplicity as a premier engineering constraint: systems perform best when designed with the simplest possible mechanisms."
      },
      num: {
        t: "KISS: Essential vs Accidental Complexity in Software Design",
        h: ["Engineering Dimension", "Simple / KISS Approach", "Over-Engineered Anti-Pattern", "Cyclomatic / Cognitive Complexity", "Production Debugging Velocity"],
        r: [
          ["Control Flow", "Linear, explicit procedural execution with early returns", "Deeply nested inheritance hierarchies with dynamic reflection", "Low ($O(1)$ - $O(V)$ branches)", "Instant; stack traces lead directly to failing line"],
          ["Data Modeling", "Plain data structures (DTOs, records) with pure functions", "Heavy domain models with bidirectional cyclic object graphs", "Low memory footprint & zero cycles", "Trivial; inspect plain JSON/memory snapshots"],
          ["State Management", "Explicit unidirectional state flow or localized state", "Distributed event-driven saga with optimistic locking for local state", "Minimal states and clean state machines", "High; deterministic state transitions reproducible in tests"],
          ["Configuration", "Simple environment variables with typed fallbacks", "Complex dynamic XML/YAML DSL with custom scripting engine", "Low; config errors caught at compile or startup time", "Immediate failure on missing config vs runtime failure"]
        ],
        n: "In software engineering, complexity is partitioned into two fundamental classes: Essential Complexity (the inherent difficulty of the real-world business domain problem being solved, such as calculating complex international import tariffs) and Accidental Complexity (the self-inflicted difficulty introduced by our choice of tools, convoluted abstractions, premature microservices, and convoluted design patterns). The KISS principle mandates the aggressive minimization of accidental complexity. A simple design, as defined by Kent Beck, satisfies four rules in priority order: (1) Passes all automated tests, (2) Reveals its intent clearly to human readers, (3) Contains no duplication, and (4) Has the fewest possible classes and methods. Simplicity is not synonymous with easy: writing simple, clear code requires deep design discipline and exhaustive cognitive effort."
      },
      miss: [
        {
          w: "KISS means writing quick, sloppy, hacky code with zero architectural structure or tests.",
          r: "Sloppy hacky code creates monstrous accidental complexity; true simplicity produces clean, highly readable, modular code that is trivial to reason about and test."
        },
        {
          w: "Simplicity is easy to achieve on the first draft of writing code.",
          r: "Writing simple code is exceptionally difficult ('Simple is not easy'); the first draft is usually complex and convoluted, requiring rigorous refactoring to distill down to its simplest form."
        },
        {
          w: "A 5-line ternary operator nested inside another ternary operator is simpler than a 15-line `if/else` block because it has fewer lines.",
          r: "Brevity is not simplicity; dense, cryptic one-liners maximize cognitive load and mental parsing time, whereas explicit, structured branches are simpler to understand."
        },
        {
          w: "The KISS principle means you should never use design patterns, frameworks, or microservices.",
          r: "When domain problems possess genuine essential complexity (e.g. 50 interchangeable algorithms), design patterns represent the simplest, most maintainable solution available."
        }
      ],
      trade: {
        buys: [
          "Rapid developer onboarding: new engineers understand the codebase and ship productive features within days.",
          "High operational reliability: systems with fewer moving parts and minimal indirection have far fewer unexpected failure modes.",
          "Blazing fast debugging: stack traces point directly to straightforward code rather than disappearing into reflection proxies.",
          "Low cognitive strain: developers can hold entire subsystems in mental working memory without cognitive exhaustion."
        ],
        costs: [
          "Ego suppression: engineers must resist the temptation to show off cleverness or implement trendy complex architectures.",
          "Perceived lack of sophistication: non-technical stakeholders or dogmatic architects may view simple code as 'unsophisticated'.",
          "Potential for later refactoring: keeping initial solutions simple may require refactoring when business requirements legitimately expand.",
          "Effort to distill: crafting the simplest possible abstraction often requires more design iterations than building a complicated one."
        ],
        avoid: [
          "Introducing microservices, Kubernetes, and distributed event streaming for an internal application with 50 daily users.",
          "Writing cryptic one-line functional chains with multiple regexes instead of clear, named helper functions.",
          "Adding abstract factory layers for dependencies that have only one concrete implementation.",
          "Using dynamic runtime reflection or monkey-patching when straightforward explicit parameter passing works."
        ]
      }
    },
    {
      slug: "yagni",
      why: {
        before: "Developers spent weeks building elaborate, flexible frameworks and speculative configuration hooks for features they assumed stakeholders 'might need next year'.",
        problem: "Over 60% of speculative code was never used, but remained in the codebase forever, consuming maintenance effort, complicating refactoring, introducing bugs, and slowing down delivery of actual current requirements.",
        shift: "Extreme Programming (XP) formalized YAGNI ('You Aren't Gonna Need It'): always implement things when you actually need them, never when you just foresee that you may need them."
      },
      num: {
        t: "Speculative Architecture vs YAGNI Delivery Economics",
        h: ["Development Approach", "Feature Delivery Timeline", "Wasted Engineering Cost", "Adaptability to Requirements Shifts", "Maintenance Drag"],
        r: [
          ["Speculative / Anticipatory Design", "Delayed; weeks spent building unused generic frameworks", "High (60%+ of speculative abstractions discarded)", "Low; speculative architecture is almost always wrong for future needs", "High; dead code and unnecessary abstractions must be maintained forever"],
          ["YAGNI / Just-in-Time Implementation", "Immediate; ships minimum viable feature in hours/days", "Near Zero (engineers only build verified present requirements)", "High; clean, simple code is effortless to extend when needs materialize", "Minimal; only active, utilized code paths exist in production"],
          ["Premature Database Abstraction", "Building custom multi-DB ORM layer 'just in case we leave Postgres'", "Very High (companies rarely switch core DBs)", "Near Zero; database-specific features abandoned for lowest-common-denominator", "Massive; ongoing impedance mismatch across all queries"],
          ["Premature Microservices Splitting", "Splitting 3-person startup codebase into 20 microservices upfront", "Devastating; network latency, serialization, distributed transactions", "Extremely Low; refactoring microservice boundaries is 10x harder than a monolith", "Overwhelming infrastructure and deployment maintenance overhead"]
        ],
        n: "The economic calculus of YAGNI rests on the reality that software requirements evolve unpredictably in response to market feedback. When an engineer builds speculative code today to support an anticipated future requirement, they incur two major costs: the opportunity cost of not delivering present value today, and the continuous carrying cost of maintaining, testing, and recompiling that speculative code over time. Furthermore, because future requirements almost never arrive in the exact form anticipated, the speculative abstraction is almost always wrong, requiring extensive refactoring or deletion. YAGNI does not advocate for writing shoddy code that cannot be extended; rather, it dictates writing the simplest, cleanest code possible to solve today's problem, making future extension straightforward when the real requirement actually arrives."
      },
      miss: [
        {
          w: "YAGNI means you should write messy, non-extensible code without thinking about good architectural design.",
          r: "YAGNI means building *only current requirements*, but building them cleanly with modularity and automated tests so adapting them in the future is effortless."
        },
        {
          w: "YAGNI applies to security controls, backup strategies, and automated testing.",
          r: "Security, disaster recovery, data backups, and automated tests are essential operational prerequisites for production systems, not speculative features."
        },
        {
          w: "Building a generic, universal abstraction now is always cheaper than refactoring later.",
          r: "Building speculative abstractions is almost always more expensive because human predictions of future requirements are inaccurate, resulting in wasted code."
        },
        {
          w: "YAGNI forbids any architectural planning or future roadmap consideration.",
          r: "Architects should consider future direction when designing module boundaries, but engineers should only write concrete code and implement abstractions for requirements that exist today."
        }
      ],
      trade: {
        buys: [
          "Rapid time-to-market: teams ship working software to customers weeks or months ahead of over-engineering competitors.",
          "Zero dead code waste: eliminates thousands of lines of unused, speculative configuration hooks and unused interfaces.",
          "Accurate abstractions: when abstractions are finally created, they are informed by real, proven requirements rather than guesses.",
          "Maximized engineering ROI: capital and developer hours are focused 100% on delivering verifiable business value."
        ],
        costs: [
          "Subsequent refactoring requirement: when new requirements arrive, existing simple code must be refactored to accommodate them.",
          "Risk of myopic design: junior developers may use YAGNI as an excuse to ignore fundamental domain modeling and modularity.",
          "Architectural rework friction: occasionally, a genuinely predictable scale requirement might have been slightly cheaper if built upfront.",
          "Discipline required: requires constant vigilance in code reviews to challenge and reject speculative pull request additions."
        ],
        avoid: [
          "Building a generic plugin architecture when you only have one single hardcoded use case.",
          "Creating abstract database layers to support Oracle, PostgreSQL, and DynamoDB for an app that only runs on SQLite.",
          "Using YAGNI as an excuse to skip writing automated unit tests, documentation, or input validations.",
          "Adding dozens of optional configuration parameters to an API that no current client has requested."
        ]
      }
    },
    {
      slug: "separation-of-concerns",
      why: {
        before: "Software applications bundled user interface rendering, network communications, business calculations, and database file I/O into unstructured, monolithic scripts.",
        problem: "A minor visual UI layout tweak could corrupt database records; changing a database column broke network protocols; and modules could not be reused or tested in isolation.",
        shift: "Edsger W. Dijkstra coined Separation of Concerns (SoC) in 1974, establishing that software systems must be separated into distinct, modular sections where each section addresses a separate conceptual concern."
      },
      num: {
        t: "Separation of Concerns Across the Modern Software Stack",
        h: ["Architectural Layer / Concern", "Primary Conceptual Focus", "Standard Industry Technologies", "Coupling Constraint / Boundary", "Key Defect Prevented"],
        r: [
          ["Presentation / View", "Visual rendering, accessibility, and user event handling", "React, Vue, HTML5, CSS3, Tailwind", "Unaware of database schemas, SQL queries, or server filesystems", "Prevents UI updates from breaking domain logic or persisting bad state"],
          ["Business / Domain Logic", "Core algorithms, domain entities, and business validation rules", "Pure language classes, domain services, state machines", "Pure in-memory; zero dependencies on HTTP, UI, or specific DBs", "Isolates core business calculations from external infrastructure changes"],
          ["Persistence / Data Access", "Database queries, transactions, ORM mappings, caching", "PostgreSQL, Redis, Prisma, Hibernate, SQL", "Encapsulates query syntax and connection pools behind repository interfaces", "Prevents SQL injection leaks and $N+1$ query loops in UI templates"],
          ["Infrastructure / Transport", "HTTP routing, gRPC serialization, message queues, TLS", "Fastify, Express, NGINX, Kafka, gRPC", "Translates wire protocols into domain commands and vice versa", "Isolates network protocol upgrades from internal application logic"]
        ],
        n: "Separation of Concerns (SoC) is the foundational meta-principle from which virtually all modern architectural patterns (including MVC, Layered Architecture, Clean Architecture, and Hexagonal / Ports & Adapters) originate. Dijkstra observed that human working memory cannot comprehend all aspects of a complex system simultaneously; by decomposing a problem into separate, well-bounded concerns, engineers can focus their attention on one isolated dimension at a time. In Hexagonal Architecture (Alistair Cockburn), SoC is enforced through strict dependency boundaries: the core business domain sits at the center, isolated behind Ports (abstract interfaces). Adapters (concrete implementations for PostgreSQL, REST, CLI, or GraphQL) sit on the periphery. The domain knows nothing about the adapters, ensuring that replacing an HTTP transport layer with a Kafka event consumer requires zero changes to core business rules."
      },
      miss: [
        {
          w: "Separation of Concerns means separating files by file extension (e.g. putting all HTML in one folder, JS in another, CSS in another).",
          r: "Separating by file extension is superficial separation of *technologies*, not concerns; modern component architectures (React/Vue) co-locate HTML, CSS, and logic for a single cohesive feature concern."
        },
        {
          w: "Separation of Concerns and Single Responsibility Principle are identical concepts.",
          r: "SoC is a macro architectural principle about dividing distinct system concerns (UI, persistence, domain); SRP is an object-level guideline stating that a module should have only one reason to change (single business actor)."
        },
        {
          w: "Separating concerns into layers means every layer must have its own separate microservice.",
          r: "Separation of concerns can be achieved completely within a single monolithic codebase using modular namespaces, packages, and clean interface boundaries."
        },
        {
          w: "Separation of concerns adds so much overhead that it is not worth doing for small applications.",
          r: "Even small applications benefit enormously from separating SQL queries from UI rendering, preventing security holes like SQL injection and enabling simple unit testing."
        }
      ],
      trade: {
        buys: [
          "High modularity & maintainability: update presentation layers or swap database vendors without touching business algorithms.",
          "Parallel engineering velocity: frontend teams can build interfaces against mock contracts while backend teams implement data models.",
          "Effortless unit testing: test core business rules in memory without spinning up databases, web servers, or headless browsers.",
          "Component reusability: domain calculations and utility modules can be reused across web, mobile, CLI, and background workers."
        ],
        costs: [
          "Mapping boilerplate: requires translating data transfer objects (DTOs) to domain entities to database records across layers.",
          "Architectural indirection: tracing an end-to-end user request requires navigating across controllers, services, and repositories.",
          "Risk of over-layering: creating four layers of pass-through interfaces for simple CRUD apps adds useless busywork.",
          "Performance overhead: serializing and mapping data structures across multiple layer boundaries adds slight memory and CPU overhead."
        ],
        avoid: [
          "Writing raw SQL queries directly inside frontend React/Vue components or UI controller templates.",
          "Importing HTTP request/response objects (`req`, `res`) deep into domain business entities or repository classes.",
          "Creating anemic pass-through layers where every method just calls the exact same method on the layer below with zero logic.",
          "Confusing separation of file types (`.html`, `.css`, `.js`) with genuine separation of domain concerns."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
