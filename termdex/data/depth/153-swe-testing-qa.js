(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "unit-test",
      why: {
        before: "Developers verified software by manually launching entire applications, clicking through user interfaces, or running manual ad-hoc test scripts against live databases.",
        problem: "Manual testing was slow, non-repeatable, and incapable of isolating failures; when an error occurred, engineers spent hours debugging whether the fault was in business logic, network latency, database corruption, or UI rendering.",
        shift: "Unit testing isolates the smallest testable units of source code (pure functions, methods, or classes) from all external dependencies, executing them in-memory within milliseconds to verify determinism and boundary correctness."
      },
      num: {
        t: "Unit Testing Schools & Isolation Strategies",
        h: ["Testing School / Approach", "Isolation Boundary", "Dependency Handling", "Execution Speed", "Coupling to Implementation"],
        r: [
          ["Solitary / London (Mockist)", "Single class or function in strict isolation", "All collaborators replaced with test doubles (mocks/stubs)", "Extremely fast (< 1 ms per test)", "High; brittle tests break when internal collaborator methods change"],
          ["Sociable / Detroit (Classical)", "Behavioral unit across multiple real classes", "Only out-of-process dependencies (DB, network) mocked", "Fast (< 5 ms per test)", "Low; tests verify behavior and survive internal refactoring"],
          ["Property-Based Testing (QuickCheck)", "Mathematical invariants across generated inputs", "Pure functions tested with 100+ randomized inputs", "Moderate (10 - 50 ms per suite)", "Zero; tests specify algebraic properties rather than fixed examples"],
          ["Mutation Testing (Stryker/Pitest)", "Syntactic mutations inserted into production code", "Runs existing unit suite against mutated AST nodes", "Slow (minutes; recompiles and reruns for each mutant)", "Validates test quality by measuring whether tests catch code mutations"]
        ],
        n: "A unit test follows the Arrange-Act-Assert (AAA) or Given-When-Then pattern and must satisfy the FIRST principles: Fast (executing hundreds of tests per second in RAM without disk or network I/O), Independent/Isolated (no shared global mutable state; tests can run in arbitrary order or in parallel), Repeatable (deterministic; runs identically on developer laptops or air-gapped CI nodes without flakiness), Self-validating (boolean pass/fail outcome without manual log inspection), and Timely (authored concurrently with or prior to production code). In the classical (Detroit) testing school, unit tests execute real domain objects in memory and only stub out out-of-process resources (such as relational databases or third-party HTTP endpoints), avoiding over-mocking that couples assertions to private implementation details."
      },
      miss: [
        {
          w: "A test that connects to an in-memory SQLite database or Redis container is still a unit test.",
          r: "Connecting to a database, even in-memory, crosses architectural process boundaries, involves I/O serialization, and exercises relational query execution; it is an integration test, not a pure unit test."
        },
        {
          w: "Unit tests are meant to test private methods directly.",
          r: "Unit tests should exercise public API contracts and observable behaviors; testing private methods binds tests to transient implementation details, creating brittle tests that resist refactoring."
        },
        {
          w: "100% unit test line coverage proves that a module is completely bug-free.",
          r: "Line coverage merely records that an instruction was executed; it does not test unexpected input combinations, asynchronous race conditions, memory leaks, or missing requirement edge cases."
        },
        {
          w: "Mocking every single collaborator method makes unit tests superior.",
          r: "Over-mocking verifies mock interactions rather than real behavior, leading to tests that pass green in CI while the system fails catastrophically when real components are wired together."
        }
      ],
      trade: {
        buys: [
          "Instantaneous feedback loops: sub-second execution allows developers to verify algorithmic correctness after every edit.",
          "Pinpoint failure localization: when a unit test fails, the exact broken function or branch is identified immediately.",
          "Living API specification: tests serve as executable documentation detailing expected inputs, outputs, and exception contracts.",
          "Fearless refactoring: engineers can restructure internal algorithms knowing regression tests will immediately catch defects."
        ],
        costs: [
          "Maintenance overhead: changing method signatures or domain models requires updating corresponding unit tests.",
          "False sense of security: green unit tests do not guarantee that database queries, network calls, or third-party APIs work.",
          "Brittle test risk: tests tightly coupled to private implementation details require constant rewriting during refactoring.",
          "Initial development friction: authoring comprehensive unit tests increases upfront implementation time by 20% to 40%."
        ],
        avoid: [
          "Making network HTTP calls, disk file I/O, or sleeping on real clock timers inside unit test suites.",
          "Asserting on private class internals or internal variable names rather than public observable outcomes.",
          "Writing unit tests with multiple unrelated assertions testing dozens of different behaviors in a single test case.",
          "Ignoring intermittent failures by re-running tests until they pass instead of diagnosing non-determinism."
        ]
      }
    },
    {
      slug: "integration-test",
      why: {
        before: "Teams relied entirely on isolated unit tests with mock objects, discovering only in production that their SQL queries had syntax errors, database constraints failed, or serialization schemas mismatched.",
        problem: "Unit tests cannot detect interface mismatches, network timeout misconfigurations, database transaction rollbacks, foreign key violations, or distributed serialization bugs between independent modules.",
        shift: "Integration testing verifies that multiple cohesive software components, microservices, databases, and message queues interact correctly across real communication boundaries and protocols."
      },
      num: {
        t: "Integration Testing Strategies & Infrastructure Models",
        h: ["Integration Approach", "Infrastructure Realism", "Execution Latency", "Defect Detection Scope", "Environment Setup Overhead"],
        r: [
          ["Component / Subsystem Integration", "In-memory fake adapters + real domain services", "Fast (10 - 50 ms / test)", "Service-to-service contracts and domain orchestration", "Low; zero external container dependencies"],
          ["Containerized Integration (Testcontainers)", "Real Docker containers (PostgreSQL, Kafka, Redis)", "Moderate (200 - 1,500 ms / test)", "SQL queries, migrations, constraint locks, broker offsets", "Medium; requires Docker daemon on CI and developer machines"],
          ["Contract Testing (Pact / Spring Cloud Contract)", "Consumer-driven mock provider verification", "Fast (50 - 100 ms / test)", "Cross-service API schema compatibility & breaking changes", "Medium; requires shared contract broker repository"],
          ["Staging Environment Integration", "Live shared cluster (Kubernetes / cloud environment)", "Slow (seconds to minutes)", "End-to-end network, IAM permissions, TLS certificates", "High; vulnerable to test data collisions and environmental drift"]
        ],
        n: "Integration tests occupy the critical middle layer of the test automation pyramid. Unlike unit tests which execute in pristine memory, integration tests cross wire boundaries: they execute actual SQL queries against ephemeral database instances, publish messages to real broker queues, and serialize JSON/Protobuf payloads over HTTP/gRPC. Modern integration testing heavily leverages Testcontainers—a library that programmatically spins up throwaway Docker containers (e.g., PostgreSQL, RabbitMQ, Redis) for the duration of the test suite and terminates them afterward. This eliminates the historical dichotomy between unrealistic in-memory mocks (like H2 or SQLite emulating PostgreSQL syntax) and brittle shared staging databases where parallel test runs polluted each other's test data."
      },
      miss: [
        {
          w: "In-memory database engines (like H2 or SQLite) are perfect stand-ins for PostgreSQL in integration tests.",
          r: "In-memory databases differ in SQL dialect, JSON operators, concurrency locking behaviors, and constraint enforcement, letting dialect-specific production bugs slip past CI."
        },
        {
          w: "Integration tests should cover every single algorithmic permutation and mathematical boundary condition.",
          r: "Combinatorial edge cases belong in fast unit tests; integration tests should focus on verifying the integration boundary, schema alignment, data persistence, and error handling."
        },
        {
          w: "Testing microservices against a live shared staging environment is superior to contract testing.",
          r: "Shared staging environments suffer from environment drift, concurrent data mutations, network downtime, and slow feedback; contract testing (e.g., Pact) provides isolated, deterministic verification."
        },
        {
          w: "Integration tests do not need automated teardown or database cleaning between tests.",
          r: "Without transactional rollbacks or database truncation between test runs, residual records cause order-dependent test failures and subtle data pollution."
        }
      ],
      trade: {
        buys: [
          "Real-world protocol verification: validates actual database queries, schema migrations, network protocols, and third-party contracts.",
          "High defect fidelity: discovers serialization mismatches, ORM mapping failures, and database deadlocks before deployment.",
          "Resilience against refactoring: tests verify system integration boundaries rather than internal class implementations.",
          "Contract safety: ensures upstream API changes do not silently break downstream consumers or client applications."
        ],
        costs: [
          "Slower execution speed: network I/O, database round-trips, and container startups take orders of magnitude longer than unit tests.",
          "Environment management complexity: requires Docker, Testcontainers, or ephemeral cloud test environments in CI/CD pipelines.",
          "Data isolation discipline: requires database transaction rollbacks, table truncations, or unique test tenant IDs.",
          "Higher flakiness risk: network timeouts, port conflicts, and resource exhaustion can cause non-deterministic failures."
        ],
        avoid: [
          "Using shared persistent staging databases where multiple CI jobs concurrently overwrite each other's records.",
          "Re-testing every permutation of internal business logic that is already covered by sub-millisecond unit tests.",
          "Failing to clean up ephemeral Docker containers or database tables after test execution completes.",
          "Allowing integration tests to call unmocked third-party paid production APIs (like Stripe or Twilio) during CI runs."
        ]
      }
    },
    {
      slug: "end-to-end-test",
      why: {
        before: "Teams relied entirely on manual QA engineers manually clicking buttons, entering form data, and validating user workflows across web browsers and mobile devices prior to major releases.",
        problem: "Manual testing was slow, expensive, unscalable, prone to human fatigue, and incapable of executing continuous delivery pipelines where code ships to production multiple times a day.",
        shift: "End-to-End (E2E) testing automates the entire user journey through headless browsers (Playwright, Cypress) or mobile emulators, verifying that the integrated frontend, backend, databases, and third-party gateways function seamlessly from the user's perspective."
      },
      num: {
        t: "End-to-End (E2E) Testing Frameworks & Execution Engines",
        h: ["Testing Framework", "Architecture & Protocol", "Browser Execution Environment", "Flakiness Mitigation Engine", "Execution Latency per Flow"],
        r: [
          ["Playwright (Microsoft)", "WebSocket over Chrome DevTools Protocol (CDP)", "Multi-browser (Chromium, Firefox, WebKit)", "Built-in auto-waiting, network interception, web assertion retries", "Fast (1 - 3 seconds per workflow)"],
          ["Cypress", "In-browser execution engine within iframe", "Chromium, Firefox, Electron", "DOM polling, command queuing, automatic retry assertions", "Moderate (2 - 5 seconds per workflow)"],
          ["Selenium WebDriver", "W3C WebDriver HTTP JSON-RPC protocol", "Cross-browser via independent driver binaries", "Manual explicit/implicit polling waits (high flakiness prone)", "Slow (5 - 15 seconds per workflow)"],
          ["Appium", "Mobile WebDriver JSON-RPC protocol", "Real iOS/Android devices & emulators", "Appium UIAutomator2 / XCUITest driver polling", "Very Slow (15 - 60 seconds per workflow)"]
        ],
        n: "End-to-End testing exercises the complete software stack in an environment that replicates production as closely as possible. Modern browser automation frameworks like Playwright communicate directly with browser rendering engines via the Chrome DevTools Protocol (CDP) over a single persistent WebSocket connection, rather than translating commands through the legacy HTTP-based Selenium WebDriver architecture. This allows Playwright to implement native 'auto-waiting'—automatically awaiting DOM element visibility, clickability, network idle states, and animation completions before dispatching synthetic user events. To prevent E2E suites from ballooning into hours of execution time, production teams execute tests in parallel across headless browser workers and leverage trace viewers to record video, DOM snapshots, and network waterfalls for post-mortem debugging."
      },
      miss: [
        {
          w: "E2E tests should be the primary testing layer and replace unit and integration tests completely.",
          r: "E2E tests are slow, resource-intensive, and prone to flakiness; relying on them as the primary test layer (an inverted 'ice cream cone' anti-pattern) causes CI pipelines to take hours and fail intermittently."
        },
        {
          w: "Hardcoded arbitrary sleeps (`sleep(5000)`) are an effective way to wait for elements in E2E tests.",
          r: "Hardcoded sleeps create horribly slow, non-deterministic test suites; modern frameworks use smart condition polling and auto-waiting on element accessibility and network idle states."
        },
        {
          w: "E2E tests must always hit live production third-party external services like credit card gateways.",
          r: "External third-party payment gateways should be mocked or pointed to official sandbox/stub APIs using network request interception to prevent billing charges and external network flakiness."
        },
        {
          w: "Selecting DOM elements using CSS classes or XPath (e.g., `.btn-primary-active`) makes robust E2E tests.",
          r: "Styling classes and XPath change frequently during UI redesigns; tests should query using user-facing accessible roles (`getByRole('button', { name: 'Submit' })`) or dedicated test IDs (`data-testid`)."
        }
      ],
      trade: {
        buys: [
          "True user journey validation: guarantees that critical revenue-generating workflows (signup, checkout) work end-to-end.",
          "Cross-system verification: validates complex interactions between frontend SPAs, backend APIs, databases, and microservices.",
          "Visual regression catching: detects broken CSS styling, overlapping modal overlays, and unclickable buttons.",
          "High deployment confidence: gives stakeholders certainty that release candidates meet real-world user acceptance criteria."
        ],
        costs: [
          "High execution latency: running full browser sessions takes minutes to hours, slowing down continuous integration loops.",
          "Susceptibility to test flakiness: network blips, animation delays, and timing race conditions cause intermittent false alarms.",
          "High maintenance overhead: minor UI layout modifications can break dozens of brittle test selectors.",
          "Compute resource consumption: running multi-browser instances consumes significant CPU and RAM in CI runner clusters."
        ],
        avoid: [
          "Using arbitrary sleep timers (`waitForTimeout(3000)`) instead of dynamic element and network state assertions.",
          "Testing complex algorithmic edge cases through browser clicks that could be tested in milliseconds via unit tests.",
          "Using brittle fragile selectors like XPath (`/html/body/div[2]/div[1]/button`) instead of accessible ARIA roles.",
          "Running an entire 500-test E2E suite sequentially on a single runner instead of sharding across parallel workers."
        ]
      }
    },
    {
      slug: "test-pyramid",
      why: {
        before: "Teams practiced testing either haphazardly or adhered to an 'inverted test pyramid' (the ice cream cone), writing thousands of fragile, slow UI end-to-end tests and very few fast unit tests.",
        problem: "The ice cream cone model resulted in CI pipelines that took 4 hours to run, failed 30% of the time due to timing flakiness, and provided no granular information about which component caused a failure.",
        shift: "Mike Cohn and Martin Fowler formalized the Test Pyramid, establishing an architectural model that balances speed, cost, and confidence by maintaining a broad base of unit tests, a middle tier of integration tests, and a narrow apex of E2E tests."
      },
      num: {
        t: "Test Pyramid Layers: Economics, Latency & Volume Ratios",
        h: ["Pyramid Layer", "Recommended Test Volume Ratio", "Execution Speed per Test", "Financial & Infrastructure Cost", "Primary Diagnostic Value"],
        r: [
          ["Unit Tests (Base)", "70% - 80% of total test suite", "< 1 ms - 5 ms (pure RAM)", "Near Zero (local CPU only)", "Pinpoints exact logical, algorithmic, and branch defects"],
          ["Integration / Service Tests (Middle)", "15% - 20% of total test suite", "50 ms - 1,500 ms (I/O, DB, brokers)", "Low to Moderate (Docker containers, local networks)", "Validates queries, migrations, wire contracts, and orchestration"],
          ["End-to-End / UI Tests (Apex)", "5% - 10% of total test suite", "1,000 ms - 15,000 ms (browser sessions)", "High (cloud VMs, headless browser runners, grid fleets)", "Validates critical business user journeys and full-stack health"],
          ["Manual Exploratory Testing (Crown)", "Ad-hoc, continuous exploration", "Human time (minutes to hours)", "Highest (expensive engineering & QA human labor)", "Discovers UX usability friction, novel edge cases, and unexpected workflows"]
        ],
        n: "The Test Pyramid provides an economic model for software quality assurance. Because the cost of test maintenance, execution latency, and non-deterministic flakiness scales exponentially as tests move up the stack from pure memory to multi-process networks to real web browser DOMs, the distribution of tests must be inverted relative to complexity. A healthy engineering test suite maintains thousands of unit tests that run in seconds, hundreds of integration tests verifying persistence contracts and messaging boundaries, and dozens of end-to-end tests verifying mission-critical user paths. In modern microservices architectures, the pyramid is sometimes adapted into the 'Testing Trophy' (popularized by Kent C. Dodds), which places heavy emphasis on integration tests to verify component contracts while retaining unit tests for complex business algorithms."
      },
      miss: [
        {
          w: "The Test Pyramid requires strict mathematical percentages (exactly 70/20/10) across all software projects.",
          r: "The pyramid is a conceptual guideline balancing feedback speed and test cost; headless APIs or event-driven pipelines may shift toward the Testing Trophy or integration-heavy models."
        },
        {
          w: "High unit test coverage at the base of the pyramid removes the need for E2E tests at the top.",
          r: "Unit tests verify components in isolation; without E2E tests, misconfigured reverse proxies, CORS headers, missing environment variables, or broken UI assets will cause catastrophic production outages."
        },
        {
          w: "Integration tests are just slow unit tests and should be avoided in favor of more unit tests.",
          r: "Integration tests exercise database query syntax, transaction isolation levels, and network serialization protocols that unit tests with mocks simply cannot validate."
        },
        {
          w: "The test pyramid suggests that manual testing should be completely eliminated.",
          r: "The pyramid eliminates repetitive manual regression verification; skilled manual exploratory testing remains essential for evaluating user experience, visual aesthetics, and novel security attack vectors."
        }
      ],
      trade: {
        buys: [
          "Optimized feedback velocity: sub-minute CI feedback on the majority of code changes accelerates developer productivity.",
          "Cost-effective CI infrastructure: running mostly in-memory tests slashes cloud runner compute hours and pipeline costs.",
          "Root-cause isolation: lower-level test failures immediately identify the exact broken function without wading through browser logs.",
          "Sustainable test maintenance: minimizes the surface area of brittle browser-based tests that break on CSS changes."
        ],
        costs: [
          "Architectural discipline: requires engineering teams to consciously structure code for testability and separation of concerns.",
          "Mocking complexity: maintaining mocks and stubs at the unit level requires ongoing synchronization with evolving contracts.",
          "Potential integration gaps: over-reliance on the unit base without adequate integration tests can allow wire bugs to escape.",
          "Testing culture overhead: training developers across multiple testing paradigms, tools, and best practices."
        ],
        avoid: [
          "Building an 'ice cream cone' anti-pattern with 500 slow E2E tests and zero unit tests.",
          "Duplicating exhaustive edge-case algorithmic testing in the slow E2E layer instead of the fast unit layer.",
          "Abandoning the middle integration layer and relying solely on unit tests and a handful of smoke tests.",
          "Treating the pyramid ratios as dogma rather than adapting to system architecture (e.g., pure backend APIs vs rich UI SPAs)."
        ]
      }
    },
    {
      slug: "test-driven-development",
      why: {
        before: "Developers wrote production code first, manually tested it until it appeared to work, and then either skipped automated tests entirely or wrote superficial tests as an afterthought to appease coverage quotas.",
        problem: "Writing tests after implementation produces code tightly coupled to internal architecture, untestable spaghetti classes with hidden dependencies, confirmation bias in test assertions, and low meaningful coverage.",
        shift: "Kent Beck revitalized Test-Driven Development (TDD) as a core Extreme Programming discipline, enforcing a strict 'Red-Green-Refactor' micro-cycle where no production code is written without a prior failing automated test."
      },
      num: {
        t: "Test-Driven Development (TDD) Micro-Cycle Phases",
        h: ["TDD Phase", "Primary Objective", "Developer Action / Rule", "Allowable Code Scope", "Design Impact"],
        r: [
          ["RED", "Specify behavior & define API contract", "Write a small automated unit test for a single behavior; run test and watch it fail", "Zero production code written; test must fail for the expected reason (e.g. method missing or assertion fails)", "Forces designer to view API from client perspective"],
          ["GREEN", "Achieve functional correctness quickly", "Write the minimal production code necessary to make the failing test pass", "Do not write extra features or anticipatory abstractions; bare-minimum implementation", "Validates behavioral hypothesis with immediate green feedback"],
          ["REFACTOR", "Clean code & eliminate duplication", "Improve code design, remove duplication, rename variables, extract methods while tests stay green", "Behavior-preserving modifications only; all tests must remain green", "Emergent architecture without fear of regression"],
          ["REPEAT", "Continuous incremental advancement", "Select the next smallest unit of behavior or edge case and begin the cycle again", "Cycle duration should be 2 to 5 minutes per iteration", "Builds comprehensive regression test safety net organically"]
        ],
        n: "Test-Driven Development is fundamentally a software design methodology disguised as a testing practice. By forcing engineers to write the test before the implementation, TDD mandates that code be designed for testability from its inception. Classes must accept dependencies via dependency injection rather than instantiating hardcoded singletons; methods must have well-defined inputs and outputs rather than mutating hidden global state; and modules must maintain low coupling and high cohesion. The 'Red' phase confirms that the test is actually capable of detecting a defect (guarding against false-positive tests that pass unconditionally due to improper assertions). The 'Green' phase emphasizes rapid feedback, while the 'Refactor' phase provides a psychologically safe space to refine internal architecture, apply design patterns, and eliminate code smells while continuously protected by an executing suite of regression tests."
      },
      miss: [
        {
          w: "TDD means writing all the tests for a multi-week project upfront before writing any production code.",
          r: "TDD operates in tight 2-to-5-minute micro-cycles (one tiny test, minimal code to pass, refactor), not waterfall upfront test specifications."
        },
        {
          w: "TDD guarantees that the overall software architecture will be flawless without any architectural planning.",
          r: "TDD creates clean, modular, testable code at the unit level, but high-level system architecture (event-driven vs REST, data storage schemas, distributed topology) still requires deliberate architectural foresight."
        },
        {
          w: "TDD slows down software development permanently and cuts developer velocity in half.",
          r: "While upfront coding takes 15% to 30% longer initially, TDD dramatically reduces downstream debugging, eliminates manual QA rework, and slashes production defect remediation costs over the software lifecycle."
        },
        {
          w: "You should never write a line of code without TDD, even for exploratory throwaway prototypes.",
          r: "For exploratory spikes, novel proof-of-concepts, or learning unfamiliar third-party libraries, quick scratch scripts are appropriate; once the design is understood, production code is rewritten with TDD."
        }
      ],
      trade: {
        buys: [
          "Superior modular architecture: code written test-first naturally exhibits low coupling, high cohesion, and clean interfaces.",
          "Near-zero regression defects: continuous regression suite prevents newly added code from breaking existing behaviors.",
          "Self-documenting codebase: the test suite serves as a living, executable specification of all supported business rules.",
          "Psychological safety during refactoring: developers can fearlessly clean code and optimize algorithms with instant verification."
        ],
        costs: [
          "Steep cognitive learning curve: mastering test-first thinking and disciplined refactoring takes months of practice.",
          "Initial velocity slowdown: upfront feature development takes longer than rushing out untested code.",
          "Dogmatism liability: rigid adherence to TDD on trivial CRUD glue code or volatile UI prototypes can cause developer burnout.",
          "Test maintenance burden: brittle tests written during TDD that mock internal details can increase refactoring friction."
        ],
        avoid: [
          "Skipping the Refactor step and leaving messy, duplicate 'Green' code in production repositories.",
          "Writing massive tests that attempt to verify multiple complex behaviors in a single Red-Green cycle.",
          "Writing tests that pass immediately without ever witnessing them fail during the RED phase.",
          "Refactoring production code and modifying test assertions at the same time, risking silent regressions."
        ]
      }
    },
    {
      slug: "behaviour-driven-development",
      why: {
        before: "Business analysts wrote ambiguous prose requirement documents (PRDs), developers interpreted them idiosyncratically into code and technical unit tests, and QA tested against a third mental model.",
        problem: "The communication chasm between non-technical stakeholders and engineers led to building software that functioned perfectly according to technical tests but failed to solve the actual business problem.",
        shift: "Dan North developed Behaviour-Driven Development (BDD), unifying requirements, automated acceptance testing, and executable documentation into a shared domain language using structured 'Given-When-Then' scenarios."
      },
      num: {
        t: "BDD Gherkin Syntax & Architectural Execution Pipeline",
        h: ["Gherkin Keyword", "Semantic Phase", "Step Definition Implementation", "Domain Role / Stakeholder Focus", "Example Specification"],
        r: [
          ["Feature", "Business capability declaration", "High-level feature file metadata (`.feature`)", "Product Manager / Business Stakeholder", "Feature: Tiered Loyalty Program Discounts"],
          ["Scenario", "Concrete business acceptance criterion", "Test case execution container", "Shared collaboration (Three Amigos: PM, Dev, QA)", "Scenario: Gold tier member receives 20% discount on electronics"],
          ["Given", "Initial state / Preconditions", "Sets up domain context, database fixtures, or mocks", "System setup & state initialization", "Given a user 'Alice' with loyalty tier 'Gold' and an active cart"],
          ["When", "Action / Trigger event", "Executes domain action, API endpoint, or UI event", "User action or external system stimulus", "When Alice adds a laptop priced at $1,000 to the cart and checks out"],
          ["Then", "Observable business outcome", "Asserts post-conditions and state changes", "Business outcome verification", "Then the total checkout price should be $800 and 800 loyalty points awarded"],
          ["And / But", "Syntactic conjunctions", "Chains multiple preconditions or outcome assertions", "Readability enhancer for fluent English specifications", "And an order confirmation email should be dispatched to Alice"]
        ],
        n: "Behaviour-Driven Development bridges the gap between technical implementation and business intent through Ubiquitous Language and collaborative discovery ceremonies (such as 'The Three Amigos'—involving the Product Owner, Software Developer, and Quality Assurance Engineer). Scenarios are codified in plain text using the Gherkin DSL (`Given`, `When`, `Then`, `And`, `But`). BDD test automation runners (such as Cucumber, SpecFlow, or Behave) parse these Gherkin feature files using regular expressions or parameter matchers, mapping each natural-language step to an underlying 'step definition' in code (Java, TypeScript, Python, etc.) that interacts with the real application API or UI. BDD scenarios serve simultaneously as user requirements, acceptance criteria, automated regression suites, and living documentation."
      },
      miss: [
        {
          w: "BDD is just Cucumber and writing Gherkin syntax files for testing.",
          r: "BDD is primarily a collaborative communication methodology for aligning developers and business stakeholders on shared behavior; Cucumber is merely an optional automation tool."
        },
        {
          w: "BDD replaces unit tests and TDD completely.",
          r: "BDD operates at the acceptance and system behavior level (outside-in); developers still use TDD and unit tests (inside-out) to implement internal algorithmic logic."
        },
        {
          w: "BDD scenarios should specify technical UI details like 'When I click button with id #submit-btn'.",
          r: "Gherkin should specify business intentions ('When Alice submits the payment'), not brittle technical UI implementation details, keeping tests resilient to UI redesigns."
        },
        {
          w: "Developers should write BDD scenarios in isolation after finishing the code.",
          r: "BDD scenarios must be written collaboratively with product owners and QA BEFORE coding begins, defining the acceptance criteria that prove when the feature is complete."
        }
      ],
      trade: {
        buys: [
          "Shared mental model: eliminates misunderstandings between business stakeholders, developers, and QA engineers.",
          "Living documentation: human-readable Gherkin feature files always reflect current, verified system capabilities.",
          "Explicit acceptance criteria: provides a clear, unambiguous definition of 'Done' before code implementation begins.",
          "High-level regression suite: validates that critical user journeys and business rules continue to operate over time."
        ],
        costs: [
          "Regex glue code maintenance: maintaining step definition mappings between Gherkin text and underlying code requires effort.",
          "Execution overhead: BDD automation runs slower than native code-level test suites due to parsing and step dispatching.",
          "Collaboration time commitment: requires regular Three Amigos refinement sessions involving cross-functional team members.",
          "Risk of verbose test bloat: poorly authored Gherkin scenarios can become repetitive, bloated, and difficult to manage."
        ],
        avoid: [
          "Writing Gherkin scenarios loaded with UI mechanics ('click div', 'scroll 200px') instead of user business intentions.",
          "Using BDD for low-level mathematical or algorithmic unit testing where standard unit testing frameworks are 100x faster.",
          "Treating BDD as an afterthought QA automation phase rather than an upfront design and discovery conversation.",
          "Allowing step definitions to directly mutate database state bypassing application business logic validations."
        ]
      }
    },
    {
      slug: "mocking",
      why: {
        before: "When testing a class, developers had to instantiate its entire graph of real dependencies—including real relational databases, live third-party payment gateways, and external SMTP email servers.",
        problem: "Tests were excruciatingly slow, failed when third-party servers were down or rate-limited, incurred financial charges (e.g. charging real credit cards), and could not reliably simulate transient error conditions (e.g. socket timeouts).",
        shift: "Gerard Meszaros formalized Test Doubles (Dummies, Stubs, Mocks, Spies, and Fakes), enabling developers to isolate units of code by replacing out-of-process or expensive collaborators with controllable, in-memory simulations."
      },
      num: {
        t: "Test Double Taxonomy (Meszaros Classification)",
        h: ["Test Double Type", "Behavioral Mechanism", "State vs Behavior Verification", "Primary Use Case", "Risk / Failure Mode"],
        r: [
          ["Dummy", "Passed around but never actually used (e.g. null, empty object)", "Neither; fills mandatory parameter list", "Satisfying compiler method parameter signatures", "Throws unexpected NullPointerException if called"],
          ["Stub", "Provides canned, hardcoded responses to specific calls", "State verification (asserting on final return value)", "Simulating specific collaborator query results or HTTP responses", "Silently returns stale data if real API contract changes"],
          ["Spy", "Wraps real object or stub; records invocation history", "Both state and historical behavioral verification", "Verifying call count, passed arguments, and invocation order", "Can leak real collaborator state if wrapping real implementations"],
          ["Mock", "Pre-programmed with expectations of calls it must receive", "Behavior verification (fails if expected call is not made)", "Ensuring a side-effecting action occurred (e.g. email sent)", "Brittle tests tightly coupled to collaborator implementation details"],
          ["Fake", "Working implementation with a shortcut (e.g. in-memory DB)", "State verification (asserting on simulated state)", "Fast, realistic testing without external infrastructure (e.g. in-memory repository)", "Requires maintaining a duplicate implementation that may diverge"]
        ],
        n: "Test Doubles isolate the System Under Test (SUT) from external collaborators. In strict mockist testing (popularized by jMock and Mockito), a mock verifies behavioral interactions: the test configures expected method invocations with specific arguments (e.g., `verify(paymentGateway, times(1)).charge(accountId, amount)`) and asserts that the collaborator was called as planned. In contrast, stubs verify state: they return pre-programmed data when queried without asserting on how or when they were called. The most sophisticated test double is a Fake—a lightweight, fully functioning in-memory implementation of an interface (such as an `InMemoryUserRepository` backed by a hash map). Fakes allow sociable unit tests to run in microseconds without mocking internals, providing high fidelity while keeping tests completely decoupled from internal method dispatch sequences."
      },
      miss: [
        {
          w: "Mocks, stubs, and fakes are all interchangeable synonyms for the exact same thing.",
          r: "They have distinct operational definitions: stubs provide canned query responses, mocks verify interaction behavior, and fakes provide working lightweight implementations."
        },
        {
          w: "A test suite that mocks all external dependencies guarantees that the system will work in production.",
          r: "Mocks represent the developer's assumptions about how external services behave; if the third-party API changes its payload format or error codes, mocked tests remain green while production crashes."
        },
        {
          w: "Mocking private methods or third-party libraries you don't own is good testing practice.",
          r: "Mocking third-party types couples tests to external library internals ('Don't mock what you don't own'); developers should wrap external libraries in internal adapter interfaces and mock the adapter."
        },
        {
          w: "Mocking is always superior to using in-memory fakes.",
          r: "Over-mocking produces brittle tests that break on every internal refactoring; in-memory fakes enable sociable unit tests that test real logic while running in milliseconds."
        }
      ],
      trade: {
        buys: [
          "Deterministic execution: eliminates external network timeouts, third-party service outages, and rate-limiting during tests.",
          "Sub-millisecond test speeds: replacing I/O-heavy database connections with in-memory doubles allows thousands of tests to run in seconds.",
          "Fault injection capability: easily simulates edge-case failure modes like network partitions, HTTP 503 errors, and corrupted payloads.",
          "Isolation of side-effects: prevents test suites from sending real emails, charging credit cards, or mutating production databases."
        ],
        costs: [
          "Contract divergence risk: test doubles can drift out of sync with real production collaborator APIs without contract tests.",
          "Brittle test coupling: verifying internal method invocation sequences causes tests to break when refactoring implementation details.",
          "Maintenance overhead: updating complex mock expectations across hundreds of tests when an interface changes.",
          "False sense of security: green mock suites do not validate SQL syntax, connection pool limits, or transaction rollback behavior."
        ],
        avoid: [
          "Mocking what you don't own: wrapping third-party libraries in your own domain interfaces before mocking them.",
          "Asserting on every single intermediate method call when only the final state or outcome matters.",
          "Using mocks when a simple value object, stub, or in-memory fake would provide cleaner, less brittle verification.",
          "Allowing mocks to return invalid or impossible data structures that the real production service could never produce."
        ]
      }
    },
    {
      slug: "test-coverage",
      why: {
        before: "Engineering leadership had no quantitative visibility into which parts of a codebase were exercised by automated test suites versus which parts were completely untested and vulnerable to regression.",
        problem: "Developers assumed their tests were comprehensive based on subjective intuition, leaving critical exception-handling blocks, authorization checks, and edge-case branches unexecuted.",
        shift: "Code coverage analysis tools (Istanbul/nyc, JaCoCo, Coverage.py) instrument source code or bytecode to mathematically measure the percentage of lines, branches, statements, and functions executed during test runs."
      },
      num: {
        t: "Code Coverage Metrics & Analysis Depth",
        h: ["Coverage Metric", "Mathematical Definition", "Defect Detection Sensitivity", "Computational Overhead", "Susceptibility to False Confidence"],
        r: [
          ["Line / Statement Coverage", "$\frac{\\text{Executed Statements}}{\\text{Total Statements}} \\times 100$", "Low; confirms code was executed, not that logic was verified", "Very Low (simple counter instrumentation)", "Extremely High; executing a line with zero assertions counts as 100% covered"],
          ["Branch / Decision Coverage", "$\frac{\\text{Traversed Decision Outlines}}{\\text{Total Boolean Branches}} \\times 100$", "Moderate; forces testing both true and false paths of if/else", "Low (instruments control flow graph AST nodes)", "Moderate; does not verify compound boolean condition permutations"],
          ["Modified Condition/Decision (MC/DC)", "Each condition shown to independently affect decision outcome", "Very High (mandatory in aerospace avionics DO-178C)", "High (requires formal truth-table test generation)", "Very Low; rigorous mathematical proof of decision testing"],
          ["Mutation Score", "$\frac{\\text{Killed Mutants}}{\\text{Total Syntactic Mutants}} \\times 100$", "Highest; injects bugs into code to see if tests fail", "Extremely High (re-runs test suite against 1000s of mutants)", "Near Zero; measures whether tests actually detect introduced defects"]
        ],
        n: "Code coverage tools operate by instrumenting source code or Abstract Syntax Trees (ASTs) with execution counters before test compilation or JIT interpretation. While line coverage measures whether an execution pointer visited a given line of code, branch coverage measures whether all boolean branches of conditional statements (`if`, `else`, `switch`, ternary operators) were traversed. Goodhart's Law heavily impacts code coverage: 'When a measure becomes a target, it ceases to be a good measure.' Mandating strict 100% coverage quotas often leads developers to write low-value 'assertion-free' tests that execute lines to satisfy CI gates without validating correctness. Modern high-reliability engineering pairs branch coverage with Mutation Testing (e.g., Stryker or Pitest), which intentionally mutates operators in production code (e.g., changing `>` to `<=`) and measures the 'mutation score'—the percentage of mutants killed by failing tests."
      },
      miss: [
        {
          w: "100% code coverage guarantees that a software application has no bugs.",
          r: "Coverage measures which lines were executed, not whether the test made meaningful assertions; code can have 100% line coverage and still crash on missing requirement edge cases."
        },
        {
          w: "Writing tests without assertions is fine as long as it increases the CI code coverage percentage.",
          r: "Tests without assertions are dangerous illusions; they artificially inflate coverage metrics without verifying correctness, masking untested regression risks."
        },
        {
          w: "Branch coverage and line coverage are essentially identical metrics.",
          r: "A line like `if (isAdmin && hasPermission) execute()` can have 100% line coverage by testing a single true case, while missing 3 alternate boolean branch permutations."
        },
        {
          w: "Enforcing a mandatory 100% coverage gate in CI improves engineering productivity and quality.",
          r: "Dogmatic 100% quotas incentivize developers to test trivial boilerplate (getters, setters, framework configs) with low-value brittle tests while neglecting complex domain edge cases."
        }
      ],
      trade: {
        buys: [
          "Uncovers blind spots: immediately highlights completely untested modules, unreachable dead code, and unhandled catch blocks.",
          "Informed refactoring decisions: reveals whether legacy modules possess sufficient test safety nets prior to refactoring.",
          "Pull request quality gate: prevents developers from introducing new features without accompanying automated test suites.",
          "Objective quality baseline: provides teams and auditors with verifiable quantitative metrics of test suite health."
        ],
        costs: [
          "Goodhart's Law gaming: developers write low-effort tests that execute code paths without verifying correctness to hit quotas.",
          "Diminishing returns: pushing coverage from 85% to 100% often costs more engineering effort than all preceding work combined.",
          "CI pipeline slowdown: runtime code instrumentation and report aggregation adds latency to continuous integration jobs.",
          "Maintenance burden: tests written solely to satisfy arbitrary coverage thresholds increase brittle maintenance drag."
        ],
        avoid: [
          "Mandating strict 100% coverage targets that force developers to write useless tests for trivial data transfer objects (DTOs).",
          "Relying solely on line coverage while ignoring branch coverage and edge-case boundary conditions.",
          "Writing tests that execute code without asserting expected outputs or post-condition state changes.",
          "Failing to exclude auto-generated code, database migrations, and framework boilerplate from coverage reports."
        ]
      }
    },
    {
      slug: "flaky-test",
      why: {
        before: "Engineering teams treated automated test suites as binary truth: tests were either green (working) or red (broken), assuming failures always represented defects in newly committed code.",
        problem: "As test suites grew, tests began failing intermittently due to timing race conditions, async rendering delays, and shared state, causing developers to mistrust CI, ignore failures, and hit 're-run' until tests passed.",
        shift: "Industry engineering leaders (Google, Microsoft) formalized Flaky Test management, categorizing non-deterministic failure mechanics and implementing quarantine pipelines, automated retry thresholds, and deterministic execution tools."
      },
      num: {
        t: "Root Causes of Test Flakiness & Mitigation Strategies",
        h: ["Root Cause Category", "Primary Mechanism", "Typical Frequency", "Engineering Mitigation", "Diagnostic Tooling"],
        r: [
          ["Async Timing & Race Conditions", "Assertions evaluate before asynchronous promises, DOM rendering, or network calls resolve", "High (5% - 25% of E2E runs)", "Replace hardcoded timeouts with smart condition polling and auto-waiting", "Playwright Trace Viewer, Chrome CDP event timeline"],
          ["Shared Mutable Global State", "Tests leak records in shared databases, static singletons, or global memory across runs", "Moderate (order-dependent failures)", "Enforce test independence; database transaction rollbacks; randomized execution order", "JUnit/Jest `--randomize-order`, test container isolation"],
          ["Unmocked External Dependencies", "Tests hit live third-party network APIs, DNS, or public time servers that rate-limit or fail", "Variable (spikes during network outages)", "Mock or stub all third-party external networks; use local container mocks", "WireMock, Pact contract testing, local mock servers"],
          ["Resource Exhaustion & Concurrency", "CPU starvation, RAM exhaustion, or thread pool exhaustion in CI runners causes timeouts", "Moderate (correlates with CI concurrency load)", "Right-size CI runners; limit concurrent browser workers; optimize memory footprint", "Datadog CI visibility, runner resource profiling"],
          ["Timezone & Clock Drift", "Hardcoded date assertions fail across leap years, daylight savings, or non-UTC runner clocks", "Low (periodic spikes at midnight or year-end)", "Inject mock system clocks (e.g. `clock.freeze()`); standardize all test environments on UTC", "Sinon.js fake timers, Timecop, UTC CI containers"]
        ],
        n: "A flaky test is formally defined as an automated test that produces both passing and failing outcomes across repeated executions against the exact same immutable git commit without any changes to underlying source code or test configuration. At Google scale, over 1.5% of all test runs exhibit flakiness, requiring continuous automated quarantine pipelines. Flakiness erodes developer trust in continuous integration: when developers observe intermittent red builds, they succumb to the 'Broken Windows' effect, assuming failures are CI noise and merging broken code into mainline branches. To eradicate timing flakiness in browser and integration suites, modern frameworks abandon arbitrary time sleeps (`sleep(5000)`) in favor of asynchronous predicates that poll expectations at 50ms intervals until a configurable timeout threshold."
      },
      miss: [
        {
          w: "Adding automatic retries (`retry: 3`) in CI completely solves the flaky test problem.",
          r: "Retrying masks the symptom without fixing the underlying root cause, exponentially lengthening CI pipeline durations and allowing race conditions to slip into production."
        },
        {
          w: "Flaky tests only occur in browser End-to-End tests and never in unit tests.",
          r: "Unit tests that depend on system clocks, unseeded random number generators, iterating over unordered hash sets, or shared static memory become severely flaky."
        },
        {
          w: "If a test fails once in CI but passes on a developer's local laptop, the failure can be safely ignored.",
          r: "CI environments operate under resource constraints, multi-threaded CPU saturation, and different network latencies; a failure in CI almost always exposes a real race condition."
        },
        {
          w: "Deleting or quarantining a flaky test is an admission of failure and should never be permitted.",
          r: "Quarantining a flaky test to a separate non-blocking pipeline immediately protects the mainline build, giving engineers time to diagnose and fix the root cause without blocking team releases."
        }
      ],
      trade: {
        buys: [
          "High deployment velocity: eliminating flakiness restores trust in continuous deployment pipelines and stops merge blockages.",
          "Engineering morale: developers spend their time shipping features rather than endlessly re-running failed CI workflows.",
          "Reliable regression detection: guarantees that when a test turns red, it represents a genuine defect that must be addressed.",
          "Cost efficiency: stops wasted cloud CI compute spend caused by repeatedly re-running failed multi-hour test suites."
        ],
        costs: [
          "Root-cause diagnostic effort: debugging asynchronous race conditions and memory leaks requires advanced instrumentation.",
          "Quarantine management overhead: requires automated systems to detect, isolate, track, and remediate flaky tests.",
          "Infrastructure investment: upgrading CI runners to avoid CPU/memory starvation requires increased budget allocation.",
          "Refactoring legacy tests: rewriting brittle timing tests to use deterministic polling requires significant engineering time."
        ],
        avoid: [
          "Masking flakiness by blanket-enabling 3 to 5 automated retries on every test in the pipeline without investigating.",
          "Leaving flaky tests in the critical blocking merge path where they repeatedly disrupt the entire engineering team.",
          "Using arbitrary sleep delays (`Thread.sleep()`, `setTimeout()`) as a quick fix for asynchronous race conditions.",
          "Ignoring test order dependencies: ensure tests pass consistently regardless of execution order using randomized test runners."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
