/* ==========================================================================
   Depth pass 112 — Computer Science Fundamentals batch 4: Object-Oriented Paradigms & Architecture.
   Object-Oriented Programming, Class, Object, Encapsulation,
   Inheritance, Polymorphism, Abstraction.

   Vtable dispatch tables, class prototypes, encapsulation barriers,
   and subtype polymorphism establish modular software engineering.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "object-oriented-programming",

      why: {
        before: "Early procedural code relied on global variables, unstructured subroutines, and separate data structures passed into disparate functions, leading to fragile spaghetti code where any function could silently mutate any piece of data.",
        problem: "Large-scale software systems need a modular architectural paradigm that binds data structures together with the procedures that operate on them, enforcing data integrity, component isolation, and code reuse.",
        shift: "**Object-Oriented Programming (OOP): A programming paradigm based on the concept of 'objects', which can contain data (attributes/properties) and code (methods/procedures).** Built upon four core pillars—Encapsulation, Abstraction, Inheritance, and Polymorphism—OOP enables developers to model real-world and conceptual entities as autonomous, collaborating software components."
      },

      num: {
        t: "Core Programming Paradigms: OOP vs Procedural vs Functional vs Data-Oriented",
        h: ["Paradigm", "Primary Organizational Unit", "State Handling", "Code Reuse Mechanism", "Concurrency Safety", "Primary Modern Domain"],
        r: [
          ["Object-Oriented (OOP)", "Objects (State + Behavior)", "Encapsulated mutable state", "Inheritance and Composition", "Requires explicit locking / mutexes", "Enterprise backends (Java, C#), GUI applications"],
          ["Procedural / Imperative", "Procedures / Functions", "Global and local variables", "Shared libraries and function calls", "Vulnerable to shared memory race conditions", "Operating system kernels (C), embedded firmware"],
          ["Functional (FP)", "Pure Functions & Expressions", "Immutable data transformations", "Higher-Order Functions & Monads", "Naturally thread-safe (no shared state)", "Financial systems, data pipelines, compilers"],
          ["Data-Oriented (DOD)", "Arrays of Structures (AoS) / SoA", "Packed contiguous memory buffers", "Component systems (ECS)", "Cacheline partitioned parallelism", "Game engines, physics simulations, high-frequency trading"]
        ],
        n: "Object-Oriented Programming originated with Simula 67 (Dahl and Nygaard) and Alan Kay's Smalltalk-72, originally defined around **message passing**: autonomous objects communicating by sending and receiving messages. In mainstream compiled OOP (C++, Java, C#), it evolved into **class-based structural OOP**, where classes serve as blueprints defining state fields and a Virtual Method Table (**vtable**) for dynamic dispatch. Under the **SOLID design principles** (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion), OOP decouples client callers from concrete implementations, allowing polymorphic substitution at runtime."
      },

      miss: [
        {
          w: "Object-Oriented Programming is strictly defined by classes and class inheritance.",
          r: "Alan Kay (who coined the term OOP) stated that OOP is about **messaging, local retention and protection of state, and extreme late-binding of all things**, not classes or inheritance. Languages like JavaScript achieve OOP through **prototypal inheritance** without class blueprints, and Go achieves OOP through composition and structural interfaces without any class hierarchy."
        },
        {
          w: "Deep inheritance hierarchies are a best practice in Object-Oriented Programming.",
          r: "Deep inheritance creates the **Fragile Base Class problem**: modifying a parent class breaks subclasses in subtle, unexpected ways. Modern software engineering strongly favors **Composition over Inheritance** ('Favor object composition over class inheritance' — Gang of Four)."
        },
        {
          w: "OOP is inherently slower than procedural or functional code.",
          r: "Well-designed OOP compiled with modern optimizing compilers (LLVM, HotSpot JVM) inlines small methods and optimizes monomorphic method calls to direct jumps. While dynamic vtable dispatch introduces one level of pointer indirection ($\approx 1\text{--}2$ ns), it is negligible in virtually all application software."
        },
        {
          w: "Functional programming and Object-Oriented Programming are mutually exclusive.",
          r: "Modern multi-paradigm languages (Scala, Kotlin, Rust, TypeScript, Python, modern Java) blend both paradigms. They utilize OOP for top-level module architecture and interface boundaries, and FP (pure functions, immutability, lambdas) for internal method business logic."
        }
      ],

      trade: {
        buys: [
          "High modularity: encapsulates internal state within discrete objects, preventing unintended global mutations.",
          "Natural domain modeling: maps business entities (Users, Accounts, Orders) directly to software types.",
          "Polymorphic extensibility: enables adding new feature implementations without modifying existing client caller code (Open/Closed Principle).",
          "Rich design pattern ecosystem: provides standardized architectural vocabularies (Factory, Strategy, Observer, Decorator)."
        ],
        costs: [
          "Vtable dispatch overhead: dynamic method dispatch prevents compiler inlining and adds a pointer dereference penalty.",
          "Memory footprint bloat: each object carries header metadata (object headers, class pointers, lock words) inflating memory.",
          "Cache thrashing: scattered heap-allocated objects break CPU cacheline locality compared to flat Data-Oriented arrays.",
          "Inheritance coupling: poorly designed inheritance hierarchies tightly couple subsystems, making refactoring brittle."
        ],
        avoid: [
          "Never create deep inheritance hierarchies ($> 2\\text{--}3$ levels); use composition and interfaces instead.",
          "Do not expose public mutable fields on classes; always protect internal invariants via encapsulation.",
          "Avoid using OOP for dense number-crunching game loops where Data-Oriented Design (DOD) yields $10\\times$ cache throughput.",
          "Never violate the Liskov Substitution Principle: a subclass must always be substitutable for its parent without breaking behavior."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "class",

      why: {
        before: "Developers had to manually construct structs, allocate memory buffers, and pass them as explicit pointer arguments to disjoint standalone functions, with zero automatic initialization or lifecycle management.",
        problem: "Languages require an authoritative structural blueprint that defines the memory schema, type contracts, constructor initializers, access controls, and behavioral methods for a category of objects.",
        shift: "**Class: An extensible program-code-template for creating objects, providing initial values for state (member variables) and implementations of behavior (member functions or methods).** Serving as a user-defined type, classes establish the compile-time type system and runtime layout for object instantiation."
      },

      num: {
        t: "Class Implementations: Memory Layout, Dispatch & Lifecycle",
        h: ["Language Runtime", "Class Blueprint Representation", "Method Storage", "Instance Layout in RAM", "Dynamic Dispatch Mechanism"],
        r: [
          ["C++ (Compiled)", "Compile-time type info (RTTI optional)", "Shared text segment (static code)", "Padding + vptr (8 bytes) + member fields", "Virtual Method Table (`vtable`) pointer"],
          ["Java / JVM", "`Class<?>` object in Metaspace", "Bytecode in loaded class metadata", "12/16-byte object header + compressed refs + fields", "vtable (`v_table`) in JVM Klass metadata"],
          ["Python (CPython)", "`type` instance object on heap", "`tp_dict` namespace hash table", "`PyObject` header (16 bytes) + `__dict__` pointer", "`PyMethodDef` / MRO linear dict search"],
          ["JavaScript (V8)", "`Function` object + Hidden Class (Shape)", "Stored on `.prototype` object", "Map pointer (Hidden Class) + property array", "Inline Cache (IC) against Hidden Class shapes"],
          ["Rust (Trait Alternative)", "No classes; `struct` + `impl` blocks", "Monomorphized code or `dyn Trait` fat pointer", "Flat contiguous struct fields (zero header overhead)", "Fat pointer: `(data_ptr, vtable_ptr)`"]
        ],
        n: "A class defines a user-defined data type. At compile time, the compiler allocates an internal type descriptor and constructs a **Virtual Method Table (vtable)**: an array of function pointers corresponding to all virtual/overridable methods defined on the class. When an instance of the class is instantiated (`new MyClass()`), the memory allocator allocates a contiguous block of heap memory containing: (1) An **Object Header** (containing GC metadata, lock state, and a pointer to the class vtable), and (2) Memory slots for all instance member variables aligned to hardware word boundaries. Crucially, method bytecode is NOT duplicated per object: all instances share the single static code block in the executable text segment, reading their specific instance state via the implicit `this` (or `self`) pointer passed as the first hidden register argument."
      },

      miss: [
        {
          w: "Every time you instantiate an object, a new copy of all its methods is created in memory.",
          r: "Methods exist as a **single copy** in the executable text/code segment of memory. Every instantiated object merely stores its own unique instance field variables and an 8-byte pointer to the shared class metadata and vtable."
        },
        {
          w: "Classes in JavaScript (ES6) work identically to classes in Java or C++.",
          r: "JavaScript classes are purely **syntactic sugar over prototypal inheritance**. Under the hood, defining a class attaches methods to a constructor function's `.prototype` object. Objects inherit via the prototype chain (`__proto__`), not static class table layouts."
        },
        {
          w: "Static methods and instance methods have identical execution costs.",
          r: "Static methods are essentially plain procedural functions with namespace scoping; they cannot access `this` and are resolved completely at compile time (direct jump). Instance methods require passing the `this` pointer and may require dynamic vtable lookup."
        },
        {
          w: "A class constructor can return any arbitrary object or primitive.",
          r: "In classical compiled languages (C++, Java, C#), a constructor has no return type and is dedicated solely to initializing the newly allocated memory block of that specific class type. (In JavaScript, returning an object from a constructor overrides the new instance, but this is an antipattern)."
        }
      ],

      trade: {
        buys: [
          "Authoritative structural contract: defines a unified type definition with compile-time field and method validation.",
          "Lifecycle management: guarantees deterministic initialization through constructors and cleanup through destructors/finalizers.",
          "Access boundary control: enforces information hiding via visibility modifiers (`private`, `protected`, `public`).",
          "Memory sharing efficiency: shares a single instance of executable method code across millions of individual object instances."
        ],
        costs: [
          "Rigid coupling: tight coupling between methods and specific internal fields complicates refactoring.",
          "Object header overhead: JVM and CPython object headers add $12\\text{--}16+$ bytes of RAM overhead to every instance.",
          "Boilerplate explosion: classical classes often require verbose getters, setters, constructors, and equals/hashCode overrides.",
          "Inheritance fragility: subclasses become fragilely dependent on the internal implementation details of parent classes."
        ],
        avoid: [
          "Never create 'God Classes' that accumulate dozens of unrelated responsibilities; adhere to Single Responsibility.",
          "Do not expose mutable internal class state through public getters without returning defensive copies or read-only views.",
          "Avoid deep class inheritance hierarchies; prefer interfaces and composition.",
          "Never perform heavy I/O or network calls inside class constructors; keep constructors fast and purely focused on state initialization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "object",

      why: {
        before: "Variables and functions existed as disconnected entities in global or stack memory, making it impossible to pass autonomous, self-contained entities with both state and behavior between subsystems.",
        problem: "Programs need concrete runtime entities that encapsulate discrete state, maintain memory boundaries, and respond to method invocations as distinct instances of a conceptual model.",
        shift: "**Object: A concrete instance of a class or prototype created at runtime, occupying physical computer memory and encapsulating state (attributes) and behavior (methods).** As the fundamental runtime primitive of object-oriented systems, an object manages its own internal invariants and interacts through defined interfaces."
      },

      num: {
        t: "Object Internals: Memory Anatomy & Runtime Layout",
        h: ["Memory Component", "Byte Size (64-bit Architecture)", "Internal Contents", "Primary Operational Purpose", "Optimization / Compaction"],
        r: [
          ["Mark Word (JVM Header)", "$8$ bytes", "Hash code, GC age bits, biased lock state", "Thread synchronization and garbage collector tracking", "Compressed in compact object headers (JEP 450)"],
          ["Klass Word / Shape Ptr", "$8$ bytes (or $4$ bytes compressed)", "Pointer to class metadata / vtable / prototype", "Identifies concrete type and method dispatch table", "Compressed OOPs (`-XX:+UseCompressedOops`)"],
          ["Primitive Instance Fields", "1, 2, 4, or 8 bytes per field", "Raw values (int, boolean, double, pointer)", "Encapsulated state payload of the object", "Field reordering to minimize memory alignment padding"],
          ["Reference Fields", "$8$ bytes (or $4$ bytes compressed)", "Memory address pointers to other heap objects", "Object graph composition and relationship links", "Reference compression (32-bit offset indexing)"],
          ["Alignment / Padding", "$0\\text{--}7$ bytes", "Zero-filled bytes", "Aligns object size to 8-byte CPU cache boundary", "Eliminated via packing optimization"]
        ],
        n: "At runtime, an object is an allocated chunk of memory on the heap (or stack via **Escape Analysis**). In a 64-bit JVM, an object consists of a **Mark Word** (8 bytes) storing GC generation age (4 bits), hashcode, and locking states; a **Klass Word** (8 bytes) pointing to the class metadata; followed by instance fields aligned to 8-byte boundaries. In prototype-based engines like V8 (JavaScript), objects do not have static classes; instead, V8 creates dynamic **Hidden Classes (Maps/Shapes)** that track field memory offsets. When multiple objects share the same property addition sequence, they share the same Shape, allowing V8's **Inline Caches (IC)** to bypass hash table lookups and read properties via direct memory offsets in single-cycle machine instructions."
      },

      miss: [
        {
          w: "An object reference and the object itself are the exact same thing.",
          r: "An **object reference** is an 8-byte memory pointer (or handle) stored in a variable on the stack or in another object. The **object itself** is the physical block of memory allocated on the heap containing the object header and field values. Assigning `a = b` merely copies the 8-byte reference, NOT the underlying object."
        },
        {
          w: "Objects are always allocated on the heap.",
          r: "Modern optimizing JIT compilers (HotSpot JVM, V8) use **Escape Analysis**. If the compiler proves that an object does not 'escape' the method where it is created (it is not returned or stored globally), the compiler eliminates the heap allocation entirely and **scalar replaces** the object's fields directly onto the CPU execution stack or registers, eliminating GC overhead."
        },
        {
          w: "Cloning an object (`b = Object.assign({}, a)`) creates a completely independent deep copy.",
          r: "`Object.assign()` and spread syntax (`{...a}`) perform a **shallow copy**. They copy primitive values, but for nested object fields, they merely copy the reference pointers. Mutating a nested object in `b` will silently mutate the exact same nested object in `a`."
        },
        {
          w: "Garbage collection immediately destroys an object the instant it goes out of scope.",
          r: "Going out of scope merely makes the object **unreachable**. The physical memory is not reclaimed until the garbage collector runs a collection cycle (e.g., Young Generation Minor GC), which may occur seconds, minutes, or hours later depending on memory pressure."
        }
      ],

      trade: {
        buys: [
          "Runtime state encapsulation: guarantees that an entity's data can only be manipulated according to its business rules.",
          "Dynamic lifecycle autonomy: allows objects to be allocated, passed across components, and collected automatically.",
          "Polymorphic runtime behavior: objects dynamically resolve their own behavior at runtime based on their concrete type.",
          "Decoupled dependency graphs: enables dependency injection where objects receive collaborators via interfaces."
        ],
        costs: [
          "Heap allocation pressure: creating millions of short-lived objects strains garbage collectors, triggering latency pauses.",
          "Memory overhead: object headers ($12\\text{--}16+$ bytes) dwarf tiny primitive payloads, bloating memory consumption.",
          "Pointer indirection: following object references across heap memory causes CPU L1/L2 cache misses.",
          "Shallow copy pitfalls: sharing mutable object references across threads introduces catastrophic race conditions."
        ],
        avoid: [
          "Never allocate millions of tiny temporary objects inside hot loops; reuse buffers or use primitive arrays.",
          "Do not share mutable objects across concurrent threads without synchronization or defensive copying.",
          "Avoid circular object references in reference-counting memory runtimes (like Python/Swift) to prevent memory leaks.",
          "Never assume a shallow copy (`{...obj}`) isolates nested child objects from shared mutation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "encapsulation",

      why: {
        before: "External functions directly read and wrote to the internal fields of data structs, meaning a single bug or invalid value in any distant module could corrupt global state, and altering a struct field broke every file in the codebase.",
        problem: "Software architectures need a mechanism to hide internal implementation details and restrict direct access to state, ensuring that an object's invariants are strictly protected and internal mechanics can change without breaking client code.",
        shift: "**Encapsulation: The bundling of data with the methods that operate on that data, and restricting direct external access to some of an object's components.** Enforced through access modifiers (`private`, `protected`, `public`) and property accessors, encapsulation protects object invariants and establishes clear modular boundaries."
      },

      num: {
        t: "Access Control & Information Hiding: Language Enforcements",
        h: ["Language", "Private Modifier", "Protected Modifier", "Package / Internal", "Runtime Enforcement Mechanism"],
        r: [
          ["Java", "`private` (class-only)", "`protected` (subclasses + package)", "Package-private (default no modifier)", "Strict JVM bytecode verification (`IllegalAccessException`)"],
          ["C++", "`private` (class + friends)", "`protected` (derived classes)", "No package level; namespace scope", "Compile-time access checks (zero runtime cost)"],
          ["C#", "`private`", "`protected`", "`internal` (assembly boundary)", "Strict CLR runtime reflection and type security"],
          ["Python", "Convention: `_name` / `__name` (name mangling)", "Convention: `_name` (no enforcement)", "Module scope (files)", "Gentleman's agreement; no strict runtime prohibition"],
          ["JavaScript (ES2022+)", "`#privateField`", "None (use composition)", "Module scope (export)", "V8 private brand symbols (strict runtime error)"],
          ["Rust", "`pub(self)` / private by default", "None (Rust rejects inheritance)", "`pub(crate)` / `pub(in path)`", "Strict compiler borrow checker and visibility checks"]
        ],
        n: "Encapsulation combines two distinct principles: (1) **Data Bundling** (grouping state with behavior), and (2) **Information Hiding** (Parnas, 1972). Information hiding establishes an **encapsulation barrier**: client code interacts exclusively with the object's **public interface**, while the internal representation remains hidden behind access modifiers. This guarantees **invariant maintenance**: for example, a `BankAccount` object can enforce that `balance` is never negative by rejecting invalid inputs inside `withdraw()`. Furthermore, it provides **implementation independence**: an internal data store can be refactored from a flat array to a B-Tree without altering a single line of client calling code, because the external method signatures remain perfectly unchanged."
      },

      miss: [
        {
          w: "Encapsulation is just writing getters and setters for every private field in a class.",
          r: "Writing brainless getters and setters for every field completely destroys encapsulation! Exposing `setBalance(int)` allows external callers to manipulate internal state just as destructively as making the field `public`. True encapsulation provides meaningful behavioral methods (e.g., `deposit(amount)`, `withdraw(amount)`) that enforce domain invariants."
        },
        {
          w: "Python's double underscore (`__var`) makes a variable completely private and inaccessible.",
          r: "Python enforces privacy through **name mangling**, not true access control. A field named `__balance` inside class `Account` is merely renamed to `_Account__balance`. Any caller can still directly read and mutate it via `account._Account__balance`."
        },
        {
          w: "Encapsulation provides security against malicious internal hackers.",
          r: "Encapsulation is a **software engineering tool** to prevent accidental misuse and manage complexity, NOT a cryptographic security sandbox. In most runtimes, reflection (e.g., Java `field.setAccessible(true)`) or raw pointers in C++ can bypass encapsulation modifiers easily."
        },
        {
          w: "Encapsulation slows down execution time due to method call overhead.",
          r: "Modern compilers and JIT engines (LLVM, JVM) perform **getter/setter inlining**: simple accessors are compiled down to direct machine memory reads, providing complete compile-time encapsulation with zero runtime overhead."
        }
      ],

      trade: {
        buys: [
          "Invariant protection: guarantees that internal state cannot be placed into an invalid, corrupt, or inconsistent state.",
          "Implementation flexibility: allows internal data structures to be swapped or refactored without breaking client callers.",
          "Localized bug isolation: bugs in state mutation are guaranteed to originate inside the class methods managing that state.",
          "Reduced cognitive complexity: external developers only need to understand the clean public interface, not internal plumbing."
        ],
        costs: [
          "Boilerplate code: requires writing accessor methods and validation logic around private state fields.",
          "Testing friction: testing private helper methods directly can require reflection or package-private visibility workarounds.",
          "Serialization challenges: serializing private fields into JSON/binary requires custom adapters or reflection access.",
          "Design cognitive overhead: designing clean, durable encapsulation boundaries requires deep domain modeling upfront."
        ],
        avoid: [
          "Never generate automatic getters and setters for every private variable; expose high-level behavioral methods instead.",
          "Do not return mutable references to private internal collections; return unmodifiable views (`Collections.unmodifiableList`) or copies.",
          "Avoid using reflection to bypass private encapsulation barriers in production code, as this breaks on runtime updates.",
          "Never leave fields with public mutable visibility in production domain models."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inheritance",

      why: {
        before: "Developers building new entities with overlapping properties had to copy-paste identical struct definitions and method logic across files, leading to catastrophic duplication and impossible bug maintenance.",
        problem: "Software systems need a structured mechanism to express 'is-a' relationships and share common attributes and behaviors across related classes without redundant code duplication.",
        shift: "**Inheritance: The mechanism of basing an object or class upon another object (prototypal inheritance) or class (class-based inheritance).** Enabling a derived subclass to inherit fields and methods from a base superclass while overriding or extending specific behaviors, inheritance forms the traditional foundation of OOP hierarchy."
      },

      num: {
        t: "Inheritance Models: Class vs Prototype vs Composition",
        h: ["Inheritance Model", "Mechanism of Sharing", "Lookup Timing", "Multiple Inheritance", "Language Adoptions"],
        r: [
          ["Single Class Inheritance", "Base class layout + subclass extension", "Compile-time vtable / JVM Klass hierarchy", "Forbidden (Interfaces only)", "Java, C#, Swift, Kotlin"],
          ["Multiple Class Inheritance", "Multiple base classes merged", "Compile-time offset adjustment / C3 Linearization", "Native support (Virtual Base Classes)", "C++, Python (via MRO)"],
          ["Prototypal Inheritance", "Delegation chain (`__proto__`)", "Runtime prototype chain traversal", "Multiple prototypes via Mixins/Proxy", "JavaScript, Lua, Self"],
          ["Interface Inheritance", "Inheriting method signatures, zero state", "Dynamic interface table (itable) dispatch", "Universal multiple interface support", "Java, Go, Rust, C#"],
          ["Composition (Alternative)", "Has-a aggregation of collaborator objects", "Direct object delegation call", "Unconstrained composition", "Rust, Go, modern TypeScript/Java"]
        ],
        n: "Inheritance establishes an **is-a relationship**: a `Dog` is an `Animal`. In memory layout (C++), an instance of derived class $D$ that inherits from base class $B$ is physically laid out such that the $B$ sub-object occupies the initial bytes of $D$, followed immediately by the additional member fields of $D$. This ensures that a pointer `B*` can point directly to the beginning of a `D` instance without address modification in single inheritance. When multiple inheritance is supported (C++), it introduces the infamous **Diamond Problem** (class $D$ inherits from $B$ and $C$, which both inherit from $A$), requiring **Virtual Base Classes** to ensure only one instance of $A$ exists in memory. In dynamic languages like Python, inheritance order is resolved via the **C3 Linearization Algorithm** (Method Resolution Order - MRO)."
      },

      miss: [
        {
          w: "Inheritance is the primary and best tool for code reuse in modern software development.",
          r: "Modern software engineering strongly recommends **Composition over Inheritance**. Inheritance creates tight coupling, exposes internal base class implementation details to subclasses, and violates encapsulation (the Fragile Base Class problem). Composition ('has-a') provides far greater flexibility and runtime swappability."
        },
        {
          w: "A subclass should inherit from a class whenever it shares similar fields or methods.",
          r: "Inheritance is only valid when there is a true, undeniable **Liskov-compliant 'is-a' relationship**, never for incidental code sharing. If a `Stack` shares methods with a `Vector`, it should NOT inherit from `Vector` (as Java mistakenly did with `java.util.Stack`), because exposing `vector.insert(0)` completely breaks stack LIFO invariants."
        },
        {
          w: "JavaScript classes use class-based inheritance like C++ and Java.",
          r: "JavaScript uses **prototypal delegation**. When accessing `obj.prop`, if the property does not exist on `obj`, the engine searches `obj.__proto__`, then `obj.__proto__.__proto__`, until reaching `null`. ES6 `class` syntax is merely a cleaner wrapper over this dynamic prototype link."
        },
        {
          w: "Private methods and fields are inherited and directly accessible by subclasses.",
          r: "While private fields physically occupy space in the memory layout of the subclass instance, they are **inaccessible** to subclass code. Subclasses can only manipulate them indirectly through inherited public or protected methods."
        }
      ],

      trade: {
        buys: [
          "Code reuse: eliminates redundant field and method declarations across specialized sub-types.",
          "Subtype polymorphism: enables treating derived subclass instances as instances of the base superclass.",
          "Hierarchical taxonomy: establishes clear semantic relationships across domain models.",
          "Template Method pattern: base classes define algorithmic workflows while subclasses customize individual steps."
        ],
        costs: [
          "Fragile Base Class problem: changing a method in a parent class can silently break subclasses across the codebase.",
          "Tight structural coupling: subclasses are permanently bound to the compile-time hierarchy of their superclass.",
          "Diamond Problem complexity: multiple inheritance introduces ambiguous method resolution and complex memory offsets.",
          "Encapsulation degradation: protected fields expose internal parent implementation details to derived classes."
        ],
        avoid: [
          "Never inherit for code reuse alone; only inherit when a strict Liskov-compliant 'is-a' relationship exists.",
          "Do not inherit from concrete classes; inherit from abstract base classes or implement interfaces.",
          "Avoid multiple class inheritance in production; prefer single inheritance combined with multiple interfaces or mixins.",
          "Never create inheritance hierarchies deeper than 2 or 3 levels; refactor to composition and strategy patterns."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "polymorphism",

      why: {
        before: "Code processing different types of records had to use massive switch statements or if-else ladders (`if type == DOG ... else if type == CAT ...`), requiring manual modification of every conditional block across the codebase whenever a new type was introduced.",
        problem: "Software architectures require a mechanism where a single function or caller interface can interact with entities of different types, and each entity automatically executes its own specific behavior without the caller knowing its concrete type.",
        shift: "**Polymorphism: The provision of a single interface to entities of different types, or the use of a single symbol to represent multiple different types.** Encompassing Subtype Polymorphism (dynamic dispatch), Parametric Polymorphism (generics), and Ad-hoc Polymorphism (function overloading), polymorphism is the core enabler of extensible, decoupled software architectures."
      },

      num: {
        t: "The Three Polymorphic Paradigms: Mechanics & Operational Behaviors",
        h: ["Polymorphism Type", "Mechanism", "Resolution Time", "Primary Language Feature", "Performance Impact"],
        r: [
          ["Subtype Polymorphism", "Virtual method tables (vtable) / dynamic dispatch", "Runtime (Late binding)", "Class inheritance, interface implementation", "Pointer dereference ($\approx 1\text{--}2$ ns) + prevents inlining"],
          ["Parametric Polymorphism", "Generic type parameters, templates", "Compile-time (Early binding)", "C++ Templates, Rust Generics, Java Generics", "Zero runtime cost (monomorphized to concrete code)"],
          ["Ad-hoc Polymorphism", "Function / operator overloading", "Compile-time signature matching", "Multiple methods with same name, diff params", "Zero runtime cost (resolved at compile time)"],
          ["Coercion Polymorphism", "Implicit or explicit type casting", "Compile-time or runtime conversion", "Integer to float conversion, string coercion", "Arithmetic conversion instruction overhead"],
          ["Row Polymorphism / Structural", "Duck typing / structural subtyping", "Compile-time (TypeScript/Go) or Runtime (Python)", "Go interfaces, TypeScript structural types", "Zero overhead in Go (fat pointer itable)"]
        ],
        n: "In object-oriented systems, **Subtype Polymorphism** is implemented via the **Virtual Method Table (vtable)**. When a class declares virtual methods, the compiler creates a static table of function pointers. Every object instance stores a hidden **vptr** (virtual pointer) pointing to its class's vtable. When executing `shape->draw()`, the CPU does NOT execute a direct jump to a hardcoded memory address; instead, it executes: (1) Fetch `vptr` from the object: `vtable = shape->vptr`, (2) Fetch method address at fixed slot offset $k$: `func = vtable[k]`, (3) Indirect call: `call func(shape)`. This dynamic dispatch takes only a couple of CPU cycles, but its true cost is that indirect calls inhibit compiler **function inlining** and branch prediction. Modern JIT compilers mitigate this through **Monomorphic Inline Caching (MIC)**: if profiling proves that `shape` is almost always a `Circle`, the JIT devirtualizes the call into a direct jump guarded by a cheap pointer check."
      },

      miss: [
        {
          w: "Polymorphism only refers to class inheritance and method overriding.",
          r: "Subtype polymorphism (inheritance) is only one of three major types of polymorphism categorized by Luca Cardelli and Peter Wegner (1985). **Parametric Polymorphism** (Generics in Java/Rust, Templates in C++) and **Ad-hoc Polymorphism** (Function and Operator Overloading) are equally fundamental forms of polymorphism."
        },
        {
          w: "Dynamic polymorphism has massive performance penalties that ruin real-time software.",
          r: "A vtable lookup is merely an array dereference and an indirect branch, taking $\\approx 1\\text{--}3$ nanoseconds. Furthermore, JIT compilers perform **devirtualization**, converting polymorphic calls into inline direct calls if only one concrete implementation is actively executed."
        },
        {
          w: "Method Overloading and Method Overriding are the same thing.",
          r: "**Overloading** (Ad-hoc Polymorphism) is resolved at **compile-time** based on parameter types and counts within the same scope. **Overriding** (Subtype Polymorphism) is resolved at **runtime** based on the dynamic concrete type of the target object."
        },
        {
          w: "Languages without classes (like Go or Rust) cannot have polymorphism.",
          r: "Go achieves runtime polymorphism through **structural interfaces**, and Rust achieves it through **Trait Objects (`dyn Trait`)** using fat pointers `(data_ptr, vtable_ptr)`, providing complete polymorphic flexibility without class inheritance."
        }
      ],

      trade: {
        buys: [
          "Open/Closed Principle: enables adding new derived classes and features without modifying existing client caller code.",
          "Eliminates conditional branching: replaces fragile, sprawling `switch` statements with clean dynamic dispatch.",
          "Interface-driven architecture: enables mocking, dependency injection, and plug-in architectures.",
          "Expressive type reusability: parametric polymorphism (generics) allows writing type-safe collections and algorithms once."
        ],
        costs: [
          "Inhibits compiler inlining: indirect vtable calls prevent compilers from inlining method bodies, limiting optimizations.",
          "Indirection latency: vtable pointer dereferencing adds minor CPU latency and can trigger branch mispredictions.",
          "Code tracing complexity: navigating code in an IDE becomes harder when clicking a method jumps to an interface rather than the concrete implementation.",
          "Object memory bloat: every polymorphic class instance must store a vptr (8 bytes on 64-bit architectures)."
        ],
        avoid: [
          "Never use `switch(type)` or `instanceof` checks to execute type-specific logic; use polymorphic method overriding.",
          "Do not make methods virtual by default in languages like C++ where static dispatch provides superior inlining.",
          "Avoid mega-polymorphic call sites where hundreds of different types pass through the same call, defeating JIT inline caches.",
          "Never violate the Liskov Substitution Principle when overriding a method (e.g., throwing an `UnsupportedOperationException`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "abstraction",

      why: {
        before: "Programmers had to deal with the low-level physical realities of hardware registers, memory addresses, disk sectors, and network wire protocols for every single task, making complex software cognitively unmanageable.",
        problem: "Human working memory is limited to a few conceptual chunks; software systems require mechanisms to suppress unnecessary low-level details and expose only the essential high-level operational concepts.",
        shift: "**Abstraction: The process of removing physical, spatial, or temporal details or attributes in the study of objects or systems to focus attention on details of greater importance.** In software engineering, abstraction creates clean conceptual layers where higher levels interact through simplified interfaces without needing to know lower-level implementation mechanics."
      },

      num: {
        t: "Computing Abstraction Layers: The Modern Technology Stack",
        h: ["Abstraction Layer", "What It Conceals (Implementation Details)", "What It Exposes (Abstract Interface)", "Typical Latency Boundary", "Primary Abstraction Mechanism"],
        r: [
          ["Application Code", "Database queries, socket calls, caching layers", "Business functions: `placeOrder()`, `login()`", "$10\\text{--}100$ ms", "Domain models, REST/GraphQL APIs"],
          ["Standard Library / Framework", "System calls, thread scheduling, memory allocation", "High-level primitives: `fetch()`, `Map`, `Thread`", "$1\\text{--}10$ $\\mu$s", "APIs, SDKs, Abstract Data Types (ADTs)"],
          ["Operating System", "Hardware registers, interrupt lines, physical disk sectors", "Virtual files (`read`, `write`), virtual memory, sockets", "$100\\text{--}1000$ ns", "POSIX System Calls (`syscall`)"],
          ["Instruction Set (ISA)", "Microarchitecture pipeline stages, branch predictors", "Machine instructions: `MOV`, `ADD`, `JMP`", "$1$ ns (per instruction)", "x86-64, ARM, RISC-V specifications"],
          ["Microarchitecture / Silicon", "Transistor switching, gate delays, voltage levels", "ALUs, register files, L1/L2 cache lines", "$0.2\\text{--}0.5$ ns (clock cycle)", "VLSI logic gates, CMOS silicon physics"]
        ],
        n: "Abstraction is the foundational strategy for managing software complexity, formally defined through **levels of abstraction** (Dijkstra, 1968). In programming languages, abstraction is operationalized through **Abstract Data Types (ADTs)**, **Interfaces**, and **Abstract Classes**. An abstract class defines a partial implementation with one or more `abstract` methods that declare *what* must be done without specifying *how*. Under the **Law of Leaky Abstractions** (Joel Spolsky, 2002): *All non-trivial abstractions, to some degree, are leaky.* When an abstraction leaks (e.g., a SQL query taking 40 seconds because an index is missing, or a high-level network RPC failing due to a dropped TCP packet), the engineer must mentally plunge through the abstraction layers to diagnose the underlying physical reality."
      },

      miss: [
        {
          w: "Abstraction and Encapsulation are two terms for the exact same thing.",
          r: "**Abstraction** focuses on **what** an object or component does from the perspective of the outside world (hiding complexity and exposing a simplified interface). **Encapsulation** focuses on **how** that behavior is packaged and protected internally (hiding internal state and preventing unauthorized direct access)."
        },
        {
          w: "More layers of abstraction always make a software codebase better.",
          r: "Over-abstraction leads to **Architecture Astronauting**: codebases buried under dozens of redundant Factory, Proxy, Adapter, and Wrapper layers that obscure what the program actually does, bloating runtime latency and destroying developer productivity."
        },
        {
          w: "A good abstraction means you never need to understand how the underlying system works.",
          r: "Because of the **Law of Leaky Abstractions**, every abstraction eventually fails under extreme load, edge cases, or resource exhaustion. High-performing senior engineers must understand both the clean high-level abstraction and the physical underlying mechanics below it."
        },
        {
          w: "Abstract classes and Interfaces are interchangeable.",
          r: "An **Interface** defines a pure behavioral contract with zero instance state. An **Abstract Class** can define concrete member fields, constructors, and partial method implementations, providing shared template behavior along with abstract method hooks."
        }
      ],

      trade: {
        buys: [
          "Cognitive complexity management: allows humans to build complex global systems by thinking in high-level modular concepts.",
          "Interchangeable implementations: client code depends on abstract interfaces, allowing implementations to be swapped seamlessly.",
          "Parallel engineering: different engineering teams can work concurrently against agreed-upon abstract interface contracts.",
          "Enhanced testability: abstractions enable trivial mocking and stubbing of databases, network APIs, and external hardware."
        ],
        costs: [
          "Leaky abstraction debugging: when an abstraction breaks, debugging requires deep comprehension of underlying hidden layers.",
          "Indirection performance overhead: each layer of abstraction adds function call overhead, pointer dereferencing, and serialization.",
          "Risk of over-engineering: premature abstraction creates Byzantine codebases with dozens of single-use interfaces and factories.",
          "Loss of hardware optimization: high-level abstractions often prevent utilizing low-level CPU cache and SIMD capabilities."
        ],
        avoid: [
          "Never create an abstraction for a piece of logic that is only used once; follow the Rule of Three (wait until three uses).",
          "Do not assume high-level network abstractions (like distributed RPCs) behave like local function calls; network latency and failure are real.",
          "Avoid over-abstracting simple CRUD code with multiple nested layers of DTOs, mappers, and interfaces.",
          "Never create an abstract base class without at least two distinct, concrete, production-validated subclasses."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
