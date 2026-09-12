(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "design-pattern",
      why: {
        before: "Software developers repeatedly solved recurring architectural and structural problems from scratch in ad-hoc, idiosyncratic ways without a shared vocabulary or proven design templates.",
        problem: "Ad-hoc solutions frequently missed subtle edge cases (like thread safety, tight coupling, and memory leaks) and forced developers to spend hours in code reviews explaining their custom architectural mechanisms.",
        shift: "Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides (the 'Gang of Four' / GoF) published 'Design Patterns' in 1994, formalizing 23 reusable, battle-tested solutions to common object-oriented design challenges."
      },
      num: {
        t: "Gang of Four (GoF) Design Pattern Classification",
        h: ["Pattern Category", "Primary Architectural Intent", "Core GoF Patterns", "Coupling & Relationship Type", "Key Design Principle Applied"],
        r: [
          ["Creational Patterns", "Abstracting object instantiation mechanisms", "Singleton, Factory Method, Abstract Factory, Builder, Prototype", "Decouples system from how its objects are created, composed, and represented", "Program to an interface, not an implementation"],
          ["Structural Patterns", "Composing classes and objects into larger structures", "Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy", "Uses inheritance and composition to realize new functionality smoothly", "Favor object composition over class inheritance"],
          ["Behavioral Patterns", "Characterizing complex control flows and object responsibilities", "Observer, Strategy, Command, State, Iterator, Template Method, Chain of Responsibility", "Distributes responsibilities and algorithms across collaborating objects", "Encapsulate what varies; loose coupling between interacting objects"],
          ["Architectural Patterns", "High-level macro-organization of entire software systems", "Model-View-Controller (MVC), Microservices, CQRS, Hexagonal / Ports & Adapters", "Defines subsystem boundaries, communication protocols, and data layers", "Separation of Concerns; Dependency Inversion Principle"]
        ],
        n: "A design pattern is not a finished piece of code, library, or framework that can be copied directly into a program; rather, it is a formal description or template for how to solve a recurring software problem across different contexts. In the Gang of Four taxonomy, design patterns fundamentally operationalize two overarching axioms of good object-oriented software engineering: (1) 'Program to an interface, not an implementation,' and (2) 'Favor object composition over class inheritance.' Inheritance creates white-box reuse where subclasses are tightly coupled to the internal implementation of parent classes, violating encapsulation. In contrast, composition provides black-box reuse where behaviors are assembled dynamically at runtime by referencing interfaces, enabling components to be swapped, mocked, and extended without modifying existing source code."
      },
      miss: [
        {
          w: "Design patterns are pre-packaged code snippets or library functions that you import via a package manager.",
          r: "Design patterns are conceptual architectural templates and design blueprints; their specific implementation details vary dramatically depending on the programming language and problem domain."
        },
        {
          w: "Using as many design patterns as possible in every project proves high engineering maturity.",
          r: "Pattern cramming ('Patternitis') causes severe over-engineering, inflating simple 10-line scripts into labyrinthine hierarchies of abstract factories and strategy wrappers with no practical benefit."
        },
        {
          w: "Modern programming languages with first-class functions have made design patterns completely obsolete.",
          r: "While first-class lambdas simplify certain patterns (e.g. Strategy becomes a higher-order function, Command becomes a closure), structural and creational patterns remain vital for enterprise system architecture."
        },
        {
          w: "Design patterns are only applicable to statically typed, object-oriented languages like Java and C++.",
          r: "Design patterns apply across TypeScript, Python, Rust, and Go; functional programming has its own analogous patterns (Monads, Functors, Currying, Algebraic Data Types)."
        }
      ],
      trade: {
        buys: [
          "Universal engineering vocabulary: saying 'we used an Observer here' instantly communicates the entire architecture to teammates.",
          "Proven robustness: leverages battle-tested templates refined by thousands of engineers over decades to avoid common pitfalls.",
          "High extensibility & maintainability: encapsulates variability, allowing systems to support new requirements without breaking changes.",
          "Separation of concerns: cleanly divides creation, structural composition, and runtime behavioral responsibilities."
        ],
        costs: [
          "Accidental complexity: applying patterns prematurely introduces dozens of extra interfaces, classes, and indirect calls.",
          "Steep learning curve: understanding the nuanced differences between similar patterns (e.g. Strategy vs State) requires study.",
          "Over-engineering temptation: junior engineers often force-fit patterns into simple problems where a direct function suffices.",
          "Runtime indirection: deep object composition and proxy layers add slight call-stack depth and trace debugging complexity."
        ],
        avoid: [
          "Inventing complex factory hierarchies for simple data structures that are only ever instantiated in one place.",
          "Using design patterns as a substitute for understanding the actual business problem requirements.",
          "Rigidly implementing patterns strictly as written in 1994 C++ without adapting to modern language idioms.",
          "Refactoring working, readable procedural code into abstract design patterns without a concrete requirement for extensibility."
        ]
      }
    },
    {
      slug: "singleton",
      why: {
        before: "Applications required shared global resources (such as database connection pools, hardware drivers, or configuration managers) and developers used unconstrained global variables.",
        problem: "Global variables allowed any part of a program to overwrite memory unpredictably, lacked thread-safe initialization, prevented lazy loading, and created hidden dependencies across unrelated modules.",
        shift: "The Gang of Four formalized the Singleton pattern: restricting the instantiation of a class to a single, globally accessible instance with lazy initialization and a private constructor."
      },
      num: {
        t: "Singleton Implementation Strategies & Thread-Safety Models",
        h: ["Implementation Strategy", "Language Context", "Thread Safety Mechanism", "Initialization Timing", "Primary Risk / Overhead"],
        r: [
          ["Double-Checked Locking", "Java / C++", "Volatile variable memory barrier + synchronized block", "Lazy (instantiated on first `getInstance()` call)", "Complex; subtle CPU instruction reordering bugs if `volatile` omitted"],
          ["Bill Pugh Holder Idiom", "Java", "Static nested inner class loaded by JVM ClassLoader", "Lazy (thread-safe by JVM class initialization guarantees)", "Zero locking overhead; elegant JVM-specific optimization"],
          ["Meyers' Singleton", "C++ (C++11 onwards)", "Static local variable inside method", "Lazy (thread safety guaranteed by C++11 standard)", "Zero locking overhead; clean and native to modern C++"],
          ["Module Cache / Export", "Node.js / Python", "Language module system caching (`require` / `import`)", "Lazy on first module import", "Fragile if module is resolved via multiple distinct symlink paths"],
          ["Eager Static Constant", "Universal", "Instantiated at application startup / class loading", "Eager (created during startup regardless of use)", "Startup latency; wastes memory if instance is never queried"]
        ],
        n: "The classic Singleton pattern combines two distinct responsibilities: ensuring that a class has only one instance, and providing a global point of access to that instance. In multithreaded environments, naive lazy initialization (`if (instance == null) instance = new Singleton();`) suffers from race conditions where two threads simultaneously observe `null` and create two distinct instances. To resolve this without paying the synchronization cost on every single access, languages employ Double-Checked Locking with a `volatile` memory barrier to prevent CPU instruction reordering. In modern software engineering, however, the Gang of Four Singleton is widely regarded as an anti-pattern. Global state introduces hidden dependencies, makes unit testing virtually impossible (since state persists across test cases in static memory), and breaks the Single Responsibility Principle."
      },
      miss: [
        {
          w: "The Singleton pattern is just a glorified global variable with no difference in behavior.",
          r: "Unlike a raw global variable, a Singleton enforces instance cardinality at the class level via private constructors, supports lazy on-demand initialization, and can implement interfaces."
        },
        {
          w: "Singletons are trivial to unit test in parallel test suites.",
          r: "Singletons maintain mutable global static state in memory; parallel test runs pollute each other's state, causing intermittent flaky test failures unless reset via reflection."
        },
        {
          w: "Double-checked locking without the `volatile` keyword is safe in modern Java and C++.",
          r: "Without memory barriers (`volatile`), CPU out-of-order instruction execution can expose a reference to a half-initialized object to another thread before its constructor finishes."
        },
        {
          w: "You must use the classic static Singleton class pattern to share a database connection in modern apps.",
          r: "Modern architectures use Dependency Injection (DI) frameworks (Spring, NestJS, Guice) to manage singleton lifecycles as scoped dependencies, avoiding static global access entirely."
        }
      ],
      trade: {
        buys: [
          "Strict instance cardinality: guarantees that hardware resources, connection pools, or loggers exist as exactly one instance.",
          "Lazy memory allocation: delays expensive resource allocation until the instance is explicitly requested by application code.",
          "Controlled global access: provides an encapsulated access method rather than exposing mutable global variables directly.",
          "Interface polymorphism: a singleton can implement an abstract interface, allowing it to be substituted if designed carefully."
        ],
        costs: [
          "Hidden dependency coupling: components reach out to global singletons rather than declaring their dependencies explicitly.",
          "Testing nightmare: shared static state breaks test isolation, prevents parallel test execution, and makes mocking difficult.",
          "Tight concurrency bottleneck: synchronized access to a single shared instance can become a high-contention lock bottleneck.",
          "Violates Single Responsibility: the class manages its core business domain logic while simultaneously managing its own lifecycle."
        ],
        avoid: [
          "Using Singletons to pass arbitrary mutable state across unrelated modules (use explicit parameter passing or DI).",
          "Implementing singletons with naive thread-unsafe lazy initialization in concurrent, multi-threaded environments.",
          "Hardcoding direct calls like `DatabaseConnection.getInstance()` deep inside business service classes.",
          "Failing to provide a package-private or test-only reset mechanism to clear singleton state between automated unit tests."
        ]
      }
    },
    {
      slug: "factory-pattern",
      why: {
        before: "Client code instantiated concrete classes directly throughout the codebase using the `new` operator (e.g. `new PostgresConnection()`, `new StripePayment()`).",
        problem: "Hardcoding concrete constructors coupled calling code to specific implementations, making it impossible to introduce new subclasses or mock implementations for testing without editing every call site.",
        shift: "The Factory Pattern (Factory Method and Abstract Factory) delegates object creation to dedicated creator methods and interfaces, allowing client code to depend purely on abstract interfaces."
      },
      num: {
        t: "Factory Pattern Variations & Architectural Responsibilities",
        h: ["Factory Variation", "GoF Formal Classification", "Creation Mechanism", "Coupling Level", "Primary Use Case"],
        r: [
          ["Simple Factory / Static Factory", "Idiomatic (not formal GoF)", "Static method with conditional logic (`switch/if`)", "Coupled to all concrete products in the switch block", "Creating variant instances based on a type string or config enum"],
          ["Factory Method", "Formal GoF (Creational)", "Defines creator interface; subclasses override to instantiate concrete product", "Client coupled only to abstract creator and product interfaces", "Frameworks delegating component creation to application subclasses"],
          ["Abstract Factory", "Formal GoF (Creational)", "Interface declaring a family of related creation methods", "Client decoupled from entire families of concrete products", "Cross-platform UI toolkits (creating Mac/Windows buttons, windows, dialogs)"],
          ["Dependency Injection Provider", "Modern Architectural Inversion", "IoC Container resolves constructor dependencies automatically", "Zero coupling; container wires graph via reflection/metadata", "Enterprise application frameworks (Spring, NestJS, Dagger)"]
        ],
        n: "The Factory Pattern operationalizes the Open/Closed Principle (classes should be open for extension, but closed for modification) and the Dependency Inversion Principle. In the Factory Method pattern, a creator class defines an abstract method `createProduct(): Product`. Subclasses override this method to return specific concrete products (e.g., `PostgresLoggerFactory` returns `PostgresLogger`). Client code interacts exclusively with the abstract `Logger` interface and the abstract `LoggerFactory`, remaining completely unaware of which concrete database implementation is active. In the Abstract Factory pattern, this concept is extended to entire families of related or dependent objects without specifying their concrete classes (e.g., `GUIFactory` producing compatible `Button`, `Scrollbar`, and `Checkbox` instances for a given operating system theme)."
      },
      miss: [
        {
          w: "Every method that instantiates an object is an implementation of the Factory Pattern.",
          r: "A factory must provide polymorphic abstraction over object creation; simply wrapping `return new User()` in a helper method without polymorphism is just a static constructor helper."
        },
        {
          w: "Abstract Factory and Factory Method are identical terms for the same pattern.",
          r: "Factory Method uses class inheritance to create a single product; Abstract Factory uses object composition to produce families of multiple related products."
        },
        {
          w: "Factories are always necessary whenever you need to create any object in an application.",
          r: "Using factories for simple, immutable value objects (like coordinates, currency amounts, or user names) adds useless boilerplate; simple direct instantiation is preferred."
        },
        {
          w: "Using factories eliminates all coupling from your codebase.",
          r: "Factories do not eliminate coupling—they consolidate and encapsulate it into a single dedicated creation module, isolating client business code from concrete instantiation details."
        }
      ],
      trade: {
        buys: [
          "Loose coupling: business logic depends entirely on abstract interfaces rather than concrete class constructors.",
          "Single point of modification: adding a new concrete product requires updating only the factory, leaving all client callers untouched.",
          "Effortless unit testing: factories can return mock, stub, or fake implementations during automated test suite execution.",
          "Consistent lifecycle management: factories can enforce object caching, connection pooling, or validation prior to returning instances."
        ],
        costs: [
          "Class proliferation: introducing abstract creators, concrete creators, abstract products, and concrete products balloons file counts.",
          "Code indirection: tracing where an object is actually constructed requires navigating through multiple interface layers.",
          "Refactoring overhead: altering product constructor arguments may require updating multiple factory subclasses.",
          "Over-engineering risk: applying factories to simple classes that will never have polymorphic variations wastes engineering time."
        ],
        avoid: [
          "Creating abstract factories for classes that will only ever have one single concrete implementation.",
          "Passing raw boolean flags into complex factories to determine instantiation type (use polymorphic subclasses or strategies).",
          "Bypassing existing factories and calling `new ConcreteClass()` directly in client code, recreating tight coupling.",
          "Leaking concrete product types in the factory method return signature instead of returning the abstract interface."
        ]
      }
    },
    {
      slug: "observer-pattern",
      why: {
        before: "When one object changed state, it had to explicitly call update methods on every dependent object, tightly coupling the publisher to every specific subscriber.",
        problem: "Adding or removing a dependent component required modifying the publisher class; if a subscriber crashed, hung, or had a different interface, the entire notification pipeline failed.",
        shift: "The Gang of Four formalized the Observer Pattern: defining a one-to-many dependency between objects so that when one object changes state, all its registered dependents are notified and updated automatically."
      },
      num: {
        t: "Observer Pattern Evolutions & Reactive Event Architectures",
        h: ["Architecture / Paradigm", "Dispatch Timing", "Payload Delivery Model", "Coupling Mechanism", "Primary Failure Mode / Memory Leak"],
        r: [
          ["Classic GoF Observer", "Synchronous (in-memory method loop)", "Push (passes data) or Pull (passes subject reference)", "Direct interface reference (`Observer` interface)", "Lapsed Listener problem: uncleaned observers cause memory leaks"],
          ["EventEmitter (Node.js / Browser DOM)", "Synchronous or Microtask async", "Push (emits event name + arbitrary payload arguments)", "String-based event names; loose callback registry", "MaxListenersExceededWarning; unhandled error events crash process"],
          ["Reactive Extensions (RxJS / ReactiveX)", "Asynchronous Observable streams", "Push (streams of `next`, `error`, `complete` signals)", "Declarative pipeline operators (map, filter, debounce)", "Unsubscribed subscriptions hold references, leaking memory"],
          ["Distributed Pub/Sub (Kafka, RabbitMQ)", "Asynchronous across network wire", "Push or Pull via broker message partitions", "Zero process coupling; serialized byte payloads", "Consumer lag; network partitions; poison-pill deserialization errors"]
        ],
        n: "The Observer Pattern consists of two primary roles: the Subject (or Observable) and the Observer. The Subject maintains a collection of Observer interfaces and provides public methods (`attach(observer)`, `detach(observer)`). When internal state transitions occur, the Subject invokes `notify()`, which iterates over its registered observers, calling `update()` on each. Communication operates under either a 'Push' model (the Subject sends detailed change data as method arguments) or a 'Pull' model (the Subject sends only a notification or self-reference, and Observers query the Subject for the specific properties they require). The most notorious architectural trap in memory-managed languages (Java, C#, JS) is the 'Lapsed Listener Problem': if an observer registers with a long-lived subject but fails to unregister when its own lifecycle ends, the subject's internal listener array retains a strong reference, preventing garbage collection and leaking memory."
      },
      miss: [
        {
          w: "The classic Observer pattern is naturally asynchronous and runs notifications on background threads.",
          r: "The GoF Observer pattern is strictly synchronous by default; the subject iterates over registered observers on the calling thread, meaning a slow observer blocks the subject and all subsequent observers."
        },
        {
          w: "The Observer pattern and distributed Publish/Subscribe (Pub/Sub) messaging are identical.",
          r: "Observer is an in-memory design pattern where the Subject directly maintains observer references; Pub/Sub introduces a completely independent message broker channel, fully decoupling producers from consumers."
        },
        {
          w: "Garbage collectors automatically clean up observers when the observer object falls out of local scope.",
          r: "As long as the long-lived Subject holds a reference to the observer in its listener collection, the observer cannot be garbage collected, creating silent, catastrophic memory leaks."
        },
        {
          w: "Observers can safely mutate the Subject's state from inside their `update()` callback.",
          r: "Mutating the Subject from within an observer callback often triggers recursive notification loops, leading to stack overflow crashes or corrupted concurrent modification exceptions."
        }
      ],
      trade: {
        buys: [
          "Low runtime coupling: subjects maintain state without needing to know the concrete types or inner workings of observers.",
          "Dynamic subscriptions: observers can register, listen, and unsubscribe dynamically at runtime based on application events.",
          "Broadcast communication: a single state transition cleanly fans out to update multiple user interfaces, caches, and audit logs.",
          "Open/Closed adherence: new observers can be added without modifying a single line of code in the existing subject."
        ],
        costs: [
          "Memory leak vulnerability: failing to explicitly detach observers causes memory leaks via the Lapsed Listener problem.",
          "Unpredictable execution order: observers are typically notified in arbitrary order; logic must not depend on execution sequence.",
          "Cascading synchronous latency: if an observer performs heavy I/O or blocks, the entire notification loop hangs.",
          "Debugging complexity: event-driven control flows jump across indirect listener boundaries, making stack traces difficult to follow."
        ],
        avoid: [
          "Forgetting to unsubscribe observers in lifecycle teardown methods (`ngOnDestroy`, `useEffect` cleanup, `dispose()`).",
          "Performing slow, blocking synchronous operations (like network HTTP calls) inside an observer's notification callback.",
          "Creating circular observer chains where Observer A updates Subject B, which triggers Observer C to update Subject A.",
          "Assuming observers will be executed in a specific sequential order during notification loops."
        ]
      }
    },
    {
      slug: "strategy-pattern",
      why: {
        before: "Algorithms (such as sorting algorithms, discount calculations, or payment processing) were hardcoded inside monolithic classes using massive, nested `if-else` or `switch` statements.",
        problem: "Adding a new algorithm required editing the core business class, risking regressions in existing algorithms, bloating cyclomatic complexity, and violating the Open/Closed Principle.",
        shift: "The Gang of Four formalized the Strategy Pattern: defining a family of algorithms, encapsulating each one in a separate class, and making them interchangeable at runtime."
      },
      num: {
        t: "Strategy Pattern vs Alternative Algorithmic Decomposition Models",
        h: ["Algorithmic Pattern", "Composition vs Inheritance", "Interchangeability Timing", "Coupling Mechanism", "Primary Trade-off"],
        r: [
          ["Strategy Pattern (GoF)", "Object Composition", "Dynamic at runtime (via setter or constructor injection)", "Context holds abstract Strategy interface pointer", "Requires creating multiple strategy classes; excellent testability"],
          ["Template Method (GoF)", "Class Inheritance", "Static at compile time (subclasses override hook methods)", "Subclass extends abstract parent class algorithm skeleton", "Inflexible; cannot change algorithm at runtime; white-box inheritance coupling"],
          ["State Pattern (GoF)", "Object Composition", "Dynamic at runtime (state transitions alter behavior)", "Context delegates to State interface; States can trigger transitions", "Similar structure to Strategy, but State transitions represent internal state machine"],
          ["Higher-Order Functions / Lambdas", "Functional Composition", "Dynamic at runtime (passes pure closure/function)", "Context accepts function signature (`(T) -> R`)", "Zero boilerplate classes; less suitable for complex multi-method algorithms"]
        ],
        n: "The Strategy Pattern comprises three key actors: the Strategy interface (which declares an algorithmic signature common to all supported variants), Concrete Strategies (which implement the specific algorithmic variants, such as `CreditCardPaymentStrategy`, `PayPalPaymentStrategy`, `CryptoPaymentStrategy`), and the Context (which maintains a reference to a Strategy object and delegates the algorithmic execution to it). The Context does not know or care which concrete strategy is active; it interacts exclusively via the abstract interface. This enables seamless runtime algorithm swapping: for example, a routing application can instantly switch its pathfinding strategy from `FastestDrivingRouteStrategy` to `WalkingRouteStrategy` based on a user dropdown toggle, without altering a single line of core navigation logic."
      },
      miss: [
        {
          w: "Strategy pattern and State pattern are identical and can be used interchangeably.",
          r: "While they share identical UML class diagrams, their intent differs: Strategy encapsulates interchangeable, independent algorithms chosen by the client; State models dynamic state machines where state objects transition internally."
        },
        {
          w: "Strategy pattern requires creating dozens of heavyweight classes even in modern languages with first-class functions.",
          r: "In languages with first-class functions (TypeScript, Python, modern Java/C#), a Strategy can be implemented as a simple lambda or higher-order function rather than a full boilerplate class."
        },
        {
          w: "Using a Strategy pattern eliminates the need for any conditional logic anywhere in the system.",
          r: "The conditional logic is merely shifted upstream to the factory or dependency injection container that selects which concrete strategy to instantiate."
        },
        {
          w: "Strategy classes should directly access and mutate the private internal fields of the Context.",
          r: "Strategies should receive necessary parameters explicitly through method arguments or read-only context interfaces to maintain clean encapsulation."
        }
      ],
      trade: {
        buys: [
          "Open/Closed Principle adherence: add new algorithms by creating new strategy classes without modifying the Context.",
          "Runtime adaptability: switch algorithms on the fly based on user settings, environment conditions, or data volume.",
          "Elimination of conditional bloat: replaces sprawling 50-line `if-else` and `switch` statements with clean polymorphic dispatch.",
          "Isolated unit testability: test each complex algorithm in complete isolation without instantiating the entire Context."
        ],
        costs: [
          "Object count increase: every algorithm variant requires a new class (or function closure) in the codebase.",
          "Client awareness requirement: clients must understand how different strategies differ in order to select the appropriate one.",
          "Communication overhead: passing context data to strategy methods can require bulky parameter objects or interfaces.",
          "Memory allocation overhead: creating short-lived strategy instances can introduce minor garbage collection overhead."
        ],
        avoid: [
          "Hardcoding concrete strategy instantiations inside the Context class instead of injecting them.",
          "Creating strategies that hold mutable shared state across multiple execution calls (keep strategies stateless).",
          "Applying Strategy when an algorithm will only ever have one fixed implementation with zero variation.",
          "Forcing strategies to inherit from complex abstract classes when a clean single-method interface suffices."
        ]
      }
    },
    {
      slug: "mvc",
      why: {
        before: "In early GUI and web development, developers intermingled database queries, business calculations, input handling, and HTML/UI rendering in a single monolithic script (e.g. legacy PHP/ASP files with raw SQL inside HTML tables).",
        problem: "Coupling UI rendering directly to data storage made applications impossible to unit test, prevented multiple UI views of the same data, and caused minor visual redesigns to corrupt critical business database records.",
        shift: "Trygve Reenskaug formulated Model-View-Controller (MVC) at Xerox PARC in 1979 (later adapted for the web by Ruby on Rails, Django, and Spring MVC), cleanly decoupling data domain logic, visual presentation, and user input handling into three discrete layers."
      },
      num: {
        t: "MVC Layer Responsibilities & Architectural Flow",
        h: ["MVC Component", "Primary Responsibility", "Permitted Dependencies", "State Ownership", "Primary Testing Mechanism"],
        r: [
          ["Model", "Encapsulates business data, validation rules, algorithms, and persistence", "Zero dependencies on View or Controller", "Owns and maintains single source of truth application state", "Fast in-memory unit tests; zero UI or HTTP mocking required"],
          ["View", "Renders visual representation of Model data to the user (HTML, JSON, UI)", "Depends on Model data (read-only); unaware of Controller logic", "Stateless or purely visual transient layout state", "Snapshot testing, visual regression testing, template validation"],
          ["Controller", "Handles incoming HTTP requests/user actions, orchestrates Model updates, selects View", "Depends on Model and View interfaces", "Stateless orchestrator; translates input into domain mutations", "HTTP integration tests, mock request/response assertions"],
          ["Modern Variant (MVVM)", "ViewModel exposes observable state streams directly bound to View", "ViewModel independent of View; View binds to ViewModel", "ViewModel holds UI-specific presentation state", "ViewModel unit tests; zero headless browser requirement"]
        ],
        n: "The architectural brilliance of Model-View-Controller lies in the strict unidirectional flow of data and dependencies. In classic Server-Side Web MVC (popularized by Ruby on Rails), the client sends an HTTP request to the web server. The routing engine dispatches the request to a specific Controller action. The Controller parses and validates incoming HTTP parameters, queries or updates the Model (which executes business logic and database persistence), and then selects an appropriate View template. The Model data is passed to the View, which renders the HTML or JSON response sent back to the client. Crucially, the Model has zero knowledge of the Controller or the View: a `User` model can be rendered simultaneously as an HTML web page, a mobile JSON REST endpoint, or a CLI command-line table without modifying a single line of domain code."
      },
      miss: [
        {
          w: "The Controller should contain all the complex business logic, calculations, and database queries.",
          r: "Fat Controller is an anti-pattern; controllers should be thin orchestrators that validate inputs and delegate immediately to rich domain Models or Service layers ('Fat Model, Skinny Controller')."
        },
        {
          w: "The View can query the database directly if it needs an extra field for display.",
          r: "Views must never query databases or execute business logic; doing so breaks architectural layers and introduces catastrophic $N+1$ query performance bugs in UI templates."
        },
        {
          w: "MVC is identical in desktop applications and modern client-server web applications.",
          r: "In classic desktop Smalltalk MVC, the View observes the Model via the Observer pattern; in server-side Web MVC, the View is a static template rendered once per stateless HTTP request."
        },
        {
          w: "Modern single-page applications (React, Vue) have made the principles of MVC obsolete.",
          r: "Modern SPAs still adhere to MVC separation: state stores (Redux, Zustand, TanStack Query) represent the Model, UI components represent the View, and event handlers/custom hooks act as the Controller."
        }
      ],
      trade: {
        buys: [
          "Clear separation of concerns: isolating business logic from visual presentation ensures changes in one do not destabilize the other.",
          "High unit testability: domain business rules in the Model can be tested at lightning speed without mocking UI rendering.",
          "Parallel team development: frontend designers can update Views and CSS while backend developers refine Models and APIs.",
          "Multiple view representations: the same underlying data Model can be rendered as HTML, JSON, XML, or PDF without code duplication."
        ],
        costs: [
          "Architectural indirection: a simple change (adding a field) requires modifying three separate files across Model, View, and Controller.",
          "Fat Model / Service Layer confusion: complex enterprise logic often outgrows the Model, requiring additional Service and Repository layers.",
          "Framework boilerplate: strict MVC frameworks require substantial directory structure conventions and configuration.",
          "Potential for leaky abstractions: improper coding allows database queries or presentation logic to leak into wrong layers."
        ],
        avoid: [
          "Writing 'Fat Controllers' containing hundreds of lines of database queries, payment processing, and email dispatching.",
          "Executing SQL queries or HTTP calls directly inside HTML/JSX View templates.",
          "Importing View components or UI libraries inside domain Model business logic classes.",
          "Allowing bidirectional cyclic dependencies between Models and Controllers."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
