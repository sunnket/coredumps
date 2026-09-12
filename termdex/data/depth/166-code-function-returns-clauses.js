(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "argument",
      why: {
        before: "Subroutines required placing data into fixed global memory addresses or hardware CPU registers manually before executing a jump instruction.",
        problem: "Passing data via manual register loading was unstandardized, fragile, caused registers to be overwritten accidentally, and broke recursive subroutines.",
        shift: "Programming language runtimes formalized Arguments: the actual concrete data values, expressions, or memory references passed into a function at the point of invocation (the call site)."
      },
      num: {
        t: "Argument Passing Paradigms & Machine Evaluation Models",
        h: ["Evaluation / Passing Strategy", "Evaluation Timing", "Data Handed to Function", "Caller Value Mutation Risk", "Representative Languages"],
        r: [
          ["Pass by Value", "Evaluated before call (Eager / Strict)", "Complete byte-for-byte copy of the value", "Zero mutation risk (caller data is isolated)", "C (primitives), Go, Java (primitives), Rust (without &)"],
          ["Pass by Reference", "Evaluated before call", "Direct memory address pointer alias to caller's variable", "High; mutating parameter mutates caller variable directly", "C++ (`&`), C# (`ref`/`out`), Pascal (`var`)"],
          ["Pass by Sharing (Object References)", "Evaluated before call", "Copy of the memory address pointer (reference value is copied)", "Mutating properties mutates caller object; reassigning parameter does not", "JavaScript, Python, Java (objects), Ruby"],
          ["Pass by Name / Need (Lazy)", "Deferred until argument is actually accessed inside function", "Unevaluated expression thunk (closure)", "Zero risk if pure; evaluated zero times if unused", "Haskell (lazy evaluation), Scala (by-name parameters)"]
        ],
        n: "In programming language semantics, an **Argument** is the concrete expression supplied at the call site (e.g. `10` or `getUserName()`), whereas a **Parameter** is the formal variable declaration in the function definition. At runtime, the caller evaluates the argument expressions before the function body begins execution (known as Applicative Order or Eager Evaluation in most languages). Under modern 64-bit ABIs, integer and pointer arguments are placed into registers (`RDI`, `RSI`, `RDX`, etc.) rather than pushed onto RAM stack memory. In languages like JavaScript and Python, argument passing follows 'Call by Sharing': primitive types are passed by value, while objects and arrays are passed by reference value—meaning the pointer address is copied, allowing the function to mutate internal object properties, but reassigning the argument variable itself does not affect the caller's binding."
      },
      miss: [
        {
          w: "JavaScript passes objects by reference, meaning reassigning an object parameter inside a function reassigns the caller's variable.",
          r: "JavaScript passes by *sharing* (copy of the reference pointer); mutating `obj.name = 'Bob'` mutates the caller's object, but reassigning `obj = {}` merely points the local parameter pointer elsewhere with zero effect on the caller."
        },
        {
          w: "Function arguments are evaluated concurrently or in arbitrary random order in all languages.",
          r: "In most modern languages (JS, Python, Java), arguments are evaluated strictly Left-to-Right before function dispatch; C and C++ historically left argument evaluation order unspecified, which caused compiler-dependent bugs."
        },
        {
          w: "Passing an object with 50 properties to a function copies all 50 properties in memory.",
          r: "Passing an object copies only an 8-byte memory pointer pointing to the heap-allocated object, making argument passing instantaneous regardless of object size."
        },
        {
          w: "The `arguments` object in JavaScript is a standard modern array.",
          r: "`arguments` is a legacy array-like object that lacks array methods (`.map()`, `.filter()`); modern JavaScript replaces it with Rest Parameters (`...args`), which is a genuine ES6 Array."
        }
      ],
      trade: {
        buys: [
          "Dynamic invocation flexibility: callers supply different inputs to the same algorithm to yield different results.",
          "Decoupled caller-callee relationship: functions execute without hardcoded dependencies on caller variable names.",
          "Efficient memory passing: passing large data structures via pointers (Call by Sharing) takes nanoseconds.",
          "First-class expression evaluation: any valid expression (including nested function calls) can be passed as an argument."
        ],
        costs: [
          "Argument count mismatches: dynamic languages permit passing fewer (or more) arguments than parameters, creating silent bugs.",
          "Unintended side-effect mutations: callee functions can inadvertently mutate caller data when modifying object properties.",
          "Argument order confusion: calling functions with multiple same-type arguments (`createUser('admin', 'guest')`) leads to inverted arguments.",
          "Stack allocation overhead: passing arguments beyond CPU register limits spills values onto the call stack memory."
        ],
        avoid: [
          "Reassigning function parameter variables inside the function body (treat parameters as read-only).",
          "Mutating properties of argument objects unless the function is explicitly named and documented as a mutator.",
          "Passing long lists of positional arguments where named arguments or a configuration object would prevent ordering errors.",
          "Using the legacy JavaScript `arguments` object instead of modern ES6 Rest Parameters (`...args`)."
        ]
      }
    },
    {
      slug: "return-value",
      why: {
        before: "Subroutines communicated their results back to callers by writing into shared global variables or dedicated CPU registers, with no formal language contract.",
        problem: "Callers had to guess where the output was placed; concurrent routines or nested subroutine calls silently overwrote the global output before the caller could read it.",
        shift: "Programming languages standardized the Return Value: an explicit data payload handed back to the caller when a function completes execution, terminating the function's stack frame and resuming caller control flow."
      },
      num: {
        t: "Return Value Passing Mechanisms & Compiler Optimizations",
        h: ["Return Value Mechanism", "Hardware Passing Mechanism", "Memory Location / Lifetime", "Compiler Optimization Applied", "Primary Engineering Use Case"],
        r: [
          ["Primitive Scalar Return (int, bool, float)", "CPU register (`RAX` for ints, `XMM0` for floats)", "Register to stack frame", "Zero memory allocation; immediate register access", "Basic mathematical, algorithmic, and status returns"],
          ["Small Object / Pointer Return", "Memory pointer address in `RAX`", "Heap allocated or caller stack frame", "Inline Caching; Escape Analysis", "Returning instantiated objects, arrays, and class instances"],
          ["Large Struct / Value Return", "Caller allocates stack buffer; passes hidden pointer in `RDI`", "Caller's stack frame", "Return Value Optimization (RVO / NRVO)", "Eliminates copying multi-kilobyte structs upon return"],
          ["Multiple Return Values (Tuples / Destructuring)", "Packed into multiple registers or composite record", "Stack frame destructuring", "Destructuring optimization in JIT", "Returning result + error (Go `val, err`), coordinate pairs"],
          ["Void / Unit / No Return", "No value returned (`void`, `()`, `None`, `undefined`)", "Function executed purely for side effects", "Dead code elimination if function is pure with no side effects", "Logging, disk writes, mutating external database state"]
        ],
        n: "When a function reaches a `return` statement, the runtime engine evaluates the return expression, stores the result into the architecture's designated return location, executes the function epilog (popping local stack frames), and returns control to the instruction immediately following the call site. In standard x86-64 ABIs, scalar integer and pointer return values are placed directly into the `RAX` register, while floating-point returns are placed into `XMM0`. When returning large data structures (such as C++ objects or Rust structs), compilers utilize Return Value Optimization (RVO) or Named Return Value Optimization (NRVO): the compiler constructs the return object directly in the memory buffer allocated by the *caller*, completely bypassing the temporary copy that would normally occur during stack teardown."
      },
      miss: [
        {
          w: "A function in JavaScript that does not have an explicit `return` statement returns nothing (`void`).",
          r: "In JavaScript, a function without an explicit `return` statement implicitly returns `undefined`; all JS functions always return a value."
        },
        {
          w: "Returning an object from a function in C++ always incurs a heavy memory copy penalty.",
          r: "Modern compilers apply Return Value Optimization (RVO / Copy Elision), constructing the object directly in the caller's memory space with zero copy overhead."
        },
        {
          w: "A function can return multiple completely independent return statements simultaneously.",
          r: "A function executes at most one `return` per invocation; 'returning multiple values' in languages like Python or Go returns a single grouped tuple or struct that is destructured at the call site."
        },
        {
          w: "Placing a `return` statement on a new line below the returned object in JavaScript is completely fine.",
          r: "JavaScript's Automatic Semicolon Insertion (ASI) inserts a semicolon immediately after `return`, causing the function to return `undefined` and ignoring the object below it."
        }
      ],
      trade: {
        buys: [
          "Composable functional pipelines: enables chaining functions together (`f(g(h(x)))`) where outputs feed inputs.",
          "Immutability enforcement: functions calculate and return fresh data rather than mutating shared global state.",
          "Deterministic caller interfaces: explicit return types declare the contract between a function and its consumers.",
          "Hardware register optimization: primitive return values are handed back in CPU registers with near-zero latency."
        ],
        costs: [
          "Memory allocation for non-primitive returns: returning large arrays or objects requires allocating heap memory.",
          "The 'Null Return' anti-pattern: returning `null` to signal errors forces callers to write defensive null checks everywhere.",
          "ASI syntax traps: in JavaScript, improper line-wrapping after `return` leads to silent `undefined` return bugs.",
          "Signature refactoring overhead: altering a function's return type requires updating every downstream caller."
        ],
        avoid: [
          "Writing `return` followed by a newline before returning an object literal in JavaScript (triggers ASI bug).",
          "Returning `null` or `-1` to indicate errors (use structured Result types, Option monads, or throw explicit exceptions).",
          "Writing functions that inconsistently return different types (e.g. returning a number on success and boolean `false` on failure).",
          "Ignoring function return values when the function was explicitly designed as a pure calculation."
        ]
      }
    },
    {
      slug: "early-return",
      why: {
        before: "Languages followed the rigid structured programming dogma of the 1970s: 'A function must have only one entry point and exactly one single exit point at the very bottom'.",
        problem: "Adhering to single-exit dogma forced developers to wrap entire function bodies inside nested `if-else` blocks, creating deep Arrow Anti-Patterns and maintaining uninitialized result variables throughout the function.",
        shift: "Software engineering embraced Early Return: returning from a function as soon as the result is known or an invalid condition is detected, flattening nested code and reducing cognitive load."
      },
      num: {
        t: "Early Return Pattern vs Single-Exit Anti-Pattern",
        h: ["Structural Dimension", "Early Return Style (Guard Clauses)", "Single-Exit Style (Dogmatic Single Return)", "Cognitive Complexity Impact", "Refactoring Ergonomics"],
        r: [
          ["Indentation & Nesting", "Flat (1 level of indentation; linear top-to-bottom)", "Deeply nested pyramid (3 to 6 indentation levels)", "Slashes cognitive load; readable at a glance", "Effortless to add/remove preconditions"],
          ["Variable Mutation", "Zero; return values returned directly", "Requires mutable `let result;` initialized at top and mutated throughout", "Eliminates temporal coupling and mutable state", "High mutation; risk of returning half-initialized state"],
          ["Happy Path Visibility", "Happy path runs down the unindented left margin of function", "Happy path buried 4 levels deep inside nested curly braces", "Immediate clarity on primary business logic", "Hard to spot main success logic among error branches"],
          ["Resource Teardown", "Handled via RAII (C++/Rust), `defer` (Go), or `finally`", "Manually cleaned before the final single return", "Automated; modern languages clean stack memory safely", "Manual; risk of forgetting resource cleanup in branch"]
        ],
        n: "The Early Return pattern operationalizes the principle of cognitive streamlining. In traditional single-exit code, an engineer must read through multiple nested conditions, holding intermediate validation states in mental working memory until finally reaching the single `return` statement at the bottom of the function. In contrast, the early return style divides a function into two distinct phases: (1) Precondition Verification (checking for empty inputs, unauthorized users, missing parameters, or cache hits and immediately returning), and (2) Core Business Execution (the 'happy path', which executes in unindented, linear code down the left margin). Modern languages ensure early returns are completely safe: destructors (C++ RAII), `defer` statements (Go/Zig), and `finally` blocks execute automatically upon return, guaranteeing that database locks and file descriptors are cleaned up."
      },
      miss: [
        {
          w: "Early returns violate structured programming principles and are considered bad practice by computer scientists.",
          r: "The single-exit rule was designed for languages without automatic memory cleanup (like C and Pascal in 1970) to prevent memory leaks; modern languages use RAII, garbage collection, and defer, making early returns the industry standard."
        },
        {
          w: "An early return leaves open file handles, database connections, and memory allocations leaking in memory.",
          r: "Modern language runtimes automatically clean up stack frames, trigger C++ destructors, and execute `finally` blocks and Go `defer` statements whenever an early return executes."
        },
        {
          w: "Early returns make code harder to debug because there are multiple places where the function can finish.",
          r: "Early returns make debugging *easier*: invalid conditions and edge cases are isolated at the top of the function, allowing developers to set breakpoints on specific error exits instantly."
        },
        {
          w: "You should use early returns for every single line of code until a function has 20 return statements.",
          r: "Having 20 return statements scattered haphazardly throughout a 100-line function is chaotic; early returns should be grouped logically at the top as guard clauses, leaving a clean primary exit."
        }
      ],
      trade: {
        buys: [
          "Eliminates the Arrow Anti-Pattern: flattens deeply nested code into clean, readable linear top-to-bottom logic.",
          "Highlights the happy path: the primary business algorithm sits unindented along the left margin of the screen.",
          "Reduces cognitive working memory load: once an edge-case guard check passes and returns, the reader can completely forget about it.",
          "Eliminates mutable intermediate variables: return results directly rather than storing them in temporary `let result` variables."
        ],
        costs: [
          "Potential for resource leak in manual languages: in raw C, returning early before a manual `free()` leaks memory.",
          "Messy control flow if abused: scattering return statements randomly in the middle of complex algorithms obscures flow.",
          "Multiple breakpoint placement: setting breakpoints on function exit requires placing breakpoints on multiple return lines.",
          "Legacy team resistance: senior developers trained in 1980s single-exit dogma may push back during code reviews."
        ],
        avoid: [
          "Wrapping entire functions inside an `else` block after an `if (error)` check (just return early inside the `if`).",
          "Scattering return statements haphazardly across the middle and bottom of complex algorithmic loops.",
          "Returning early in C or low-level systems without ensuring allocated heap memory or file handles are closed.",
          "Declaring an uninitialized `let output;` at the top of a function purely to satisfy single-return dogma."
        ]
      }
    },
    {
      slug: "guard-clause",
      why: {
        before: "Functions wrapped their primary business logic inside deep nested conditionals (`if (user) { if (hasPermission) { if (cartNotEmpty) { ... } } }`), pushing core logic deep into indented blocks.",
        problem: "Validation logic was intermingled with business algorithms; reading the function required navigating a labyrinth of curly braces, and failure handling was separated from its condition by dozens of lines.",
        shift: "Martin Fowler formalized the Guard Clause (or 'Bouncer Pattern'): a conditional statement placed at the entry of a function that inspects preconditions, immediately exiting (via `return` or `throw`) if requirements are not met."
      },
      num: {
        t: "Guard Clause Structural Anatomy & Precondition Filtering",
        h: ["Guard Clause Stage", "Condition Inspected", "Exit Action", "Cognitive Value", "Example Pattern"],
        r: [
          ["1. Null / Undefined Guard", "Checks if required arguments are null or missing", "Early return or throw `TypeError`", "Guarantees subsequent code never encounters null dereference", "`if (!user) return null;`"],
          ["2. Authentication / Authorization", "Validates user permissions or session token", "Throw `UnauthorizedException` (HTTP 401/403)", "Rejects unauthorized access before executing expensive queries", "`if (!user.isAdmin) throw new ForbiddenError();`"],
          ["3. State Invariant Guard", "Verifies domain business preconditions", "Early return with error message", "Protects state machine integrity (e.g. cart cannot be empty)", "`if (order.status !== 'PENDING') return;`"],
          ["4. Cache / Fast-Path Hit", "Checks if pre-computed answer exists in memory", "Returns cached value immediately", "Bypasses expensive database or network calls in 1 millisecond", "`if (cache.has(key)) return cache.get(key);`"],
          ["5. Primary Happy Path", "Zero conditions; pure business algorithm", "Final return of core computation", "Executes with full confidence that all preconditions passed", "`return processOrder(order);`"]
        ],
        n: "The Guard Clause is the architectural realization of the 'Bouncer Pattern': just as a nightclub bouncer stands at the door checking IDs and turning away unauthorized entrants before they ever enter the club, guard clauses sit at the very top of a function, rejecting invalid inputs, missing permissions, or edge cases before the primary algorithm executes. By checking for the *negative* condition (`if (!isValid) return;`) and exiting immediately, guard clauses eliminate the need for an `else` block. Once all guard clauses have executed, the remainder of the function can proceed with complete mathematical certainty that all inputs are valid, non-null, and authorized, drastically reducing cyclomatic complexity and freeing the primary algorithm from defensive checking clutter."
      },
      miss: [
        {
          w: "A guard clause should check for the positive condition and wrap the rest of the function in an `if` block.",
          r: "A guard clause must check for the *failure condition* and exit immediately; wrapping the function in an `if` block creates nesting and defeats the entire purpose of the pattern."
        },
        {
          w: "Every guard clause must throw a fatal exception when it triggers.",
          r: "Guard clauses can throw exceptions for illegal states, but they can also return default values, empty arrays, cached results, or neutral status codes depending on domain context."
        },
        {
          w: "Guard clauses can be placed randomly anywhere in the middle or bottom of a function.",
          r: "Guard clauses belong exclusively at the top of the function or block; placing guards in the middle indicates the function is doing too many things and should be decomposed."
        },
        {
          w: "Using guard clauses means you never need to use an `else` statement anywhere in your code.",
          r: "While guard clauses eliminate most `else` statements in function bodies, `else` is still valid for genuine binary branching where both paths execute complex logic."
        }
      ],
      trade: {
        buys: [
          "Zero indentation happy path: business logic runs flat down the left margin, maximizing visual readability.",
          "Precondition safety: guarantees that invalid or null inputs are purged before reaching core business logic.",
          "Colocated error handling: failure conditions and their corresponding error responses sit together on adjacent lines.",
          "Fast-path efficiency: cache hits and trivial edge cases exit in microseconds without executing database queries."
        ],
        costs: [
          "Visual verbosity at top: functions may start with 5 to 10 lines of guard assertions before reaching main logic.",
          "Risk of incomplete guards: relying on guards without automated test coverage can let unexpected edge-case types through.",
          "Multiple exit points: functions have multiple return statements, which requires developers to trace multiple exit paths.",
          "Refactoring overhead: complex guards with overlapping conditions require careful ordering to avoid unreachable guards."
        ],
        avoid: [
          "Writing an `else` block after a guard clause that already returns or throws.",
          "Intermingling core business calculations among top-level guard clause checks.",
          "Checking positive conditions that indent the happy path instead of checking negative failure conditions.",
          "Letting guard clause logic become so complex that the guards themselves require multiple helper functions."
        ]
      }
    },
    {
      slug: "method",
      why: {
        before: "In early procedural programming, functions were completely disconnected from the data structures they operated upon; functions accepted raw structs as arguments and had no direct encapsulation.",
        problem: "Any function could access and mutate an object's internal fields directly; data invariants were violated, and changing an object's internal memory layout broke hundreds of external functions.",
        shift: "Object-Oriented Programming introduced Methods: functions associated directly with an object or class, operating on the instance's internal encapsulated state via an implicit context reference (`this` or `self`)."
      },
      num: {
        t: "Method Dispatch Mechanisms & Virtual Table Architecture",
        h: ["Method Invocation Mechanism", "Binding Timing", "Dispatch Mechanism / Overhead", "Polymorphism Support", "Representative Languages"],
        r: [
          ["Static / Direct Dispatch", "Compile time", "Direct jump to fixed memory address ($O(1)$ CPU `CALL`)", "No polymorphism; method cannot be overridden", "C++, Rust, Go, Java (`final` / `static` methods)"],
          ["Dynamic Virtual Dispatch (vtable)", "Runtime execution", "Indirect pointer lookup through Virtual Method Table (`vptr`)", "Full polymorphism and subclass overriding", "C++ (virtual), Java (default for instance methods), C#"],
          ["Message Passing / Dynamic Lookup", "Runtime execution", "Hash table selector lookup in class hierarchy", "Extreme; methods can be added or intercepted dynamically", "Objective-C (`objc_msgSend`), Smalltalk, Ruby"],
          ["Prototype Chain Method", "Runtime execution", "Walks `__proto__` prototype chain until method is found", "Prototypal inheritance with dynamic monkey-patching", "JavaScript / ECMAScript engine"]
        ],
        n: "A method is a function bound to a specific class or object instance. The defining technical characteristic of a method is the implicit passing of the instance context—represented as `this` in C++, Java, and JavaScript, or explicit `self` in Python and Rust. In compiled languages like C++, virtual methods enable polymorphism through a Virtual Table (vtable): each object contains a hidden pointer (`vptr`) to a table of function pointers. When `object->doSomething()` is called, the CPU looks up the function pointer in the vtable and jumps to the implementation corresponding to the concrete runtime subclass, incurring a tiny indirect memory dereference penalty (~1-2 clock cycles). In JavaScript, methods reside on prototype objects (`ClassName.prototype`); calling a method traverses the prototype chain unless optimized into a high-speed direct call by JIT hidden classes and inline caches."
      },
      miss: [
        {
          w: "A method and a standalone function are completely identical with zero difference.",
          r: "A method is coupled to an object instance, possesses access to private internal state via `this`/`self`, and participates in polymorphic inheritance and virtual dispatch; a pure function is standalone."
        },
        {
          w: "In JavaScript, extracting a method and passing it as a callback preserves its `this` binding.",
          r: "Extracting a method (`const fn = user.getName; fn()`) strips its object context, causing `this` to become `undefined` or the global window object, requiring `.bind()` or arrow function wrappers."
        },
        {
          w: "Static methods have access to an object instance's private fields via `this`.",
          r: "Static methods belong to the *class itself*, not to any individual instance; they have no `this` instance context and can only access other static members."
        },
        {
          w: "Dynamic virtual dispatch in C++ or Java causes massive, crippling performance slowdowns.",
          r: "A vtable lookup is an indirect pointer dereference costing only 1 to 3 nanoseconds; modern CPU branch target predictors predict virtual call targets with over 95% accuracy."
        }
      ],
      trade: {
        buys: [
          "Data encapsulation: encapsulates an object's internal fields, exposing only safe, validated behaviors to external callers.",
          "Polymorphic flexibility: client code interacts with an abstract interface, while concrete classes implement custom method logic.",
          "Intuitive domain modeling: combines domain state and domain behavior into a unified, cohesive conceptual entity.",
          "Namespace organization: methods are scoped directly to their class, preventing global namespace collision pollution."
        ],
        costs: [
          "Tight state coupling: methods are coupled to internal instance state, making them harder to test than pure standalone functions.",
          "Virtual dispatch overhead: indirect vtable lookups add minor latency and prevent aggressive compiler function inlining.",
          "The 'this' binding nightmare in JS: losing context during callback passing is a notorious source of frontend bugs.",
          "Inheritance hierarchy bloat: deep class hierarchies lead to the Fragile Base Class problem where modifying a parent method breaks subclasses."
        ],
        avoid: [
          "Passing raw methods as un-bound callbacks in JavaScript without arrow wrappers or explicit `.bind(this)`.",
          "Creating 'Anemic Domain Models' where classes have only getters and setters and all business logic lives in external services.",
          "Overriding parent methods in subclasses while completely changing the semantic meaning and breaking Liskov Substitution.",
          "Making methods virtual by default in performance-critical systems when direct static dispatch suffices."
        ]
      }
    },
    {
      slug: "property",
      why: {
        before: "In early object-oriented programming, classes exposed raw public variables directly, or forced developers to write tedious, boilerplate getter and setter methods (`getName()`, `setName()`) for every field.",
        problem: "Public fields allowed external code to mutate state without validation or business rule enforcement; getter/setter methods cluttered code and created ugly syntax (`user.getAddress().getCity()`).",
        shift: "Programming languages introduced Properties (and Getters/Setters): syntactic constructs that look and behave like plain public fields to callers, but execute underlying accessor and mutator methods behind the scenes."
      },
      num: {
        t: "Property Types & Memory Representation Models",
        h: ["Property Category", "Backing Memory Storage", "Access Syntax", "Execution Mechanism", "Primary Architectural Role"],
        r: [
          ["Stored Property / Instance Field", "Allocated bytes in object memory layout on heap", "Direct field access (`obj.x`)", "Direct offset memory read ($O(1)$)", "Stores core persistent instance state"],
          ["Computed Property / Getter", "Zero backing storage; computed dynamically", "Looks like field access (`obj.area`)", "Executes underlying pure function on read", "Calculates derived state on demand without caching"],
          ["Accessor Property (Getter + Setter)", "Private backing field (`_age`)", "Field syntax (`obj.age = 25`)", "Setter executes validation logic before updating backing field", "Enforces encapsulation and business validation invariants"],
          ["Static Property / Class Field", "Allocated once in class metadata / static memory", "Class name access (`User.count`)", "Global class-level shared memory lookup", "Shared counters, constants, singletons, and cache maps"],
          ["Lazy Property", "Allocated on heap only upon first read access", "Field syntax (`obj.heavyData`)", "Checks initialized flag; computes and caches on first access", "Defers expensive computations or disk reads until actually needed"]
        ],
        n: "A property is a member of an object that provides flexible mechanism to read, write, or compute the value of a private field. In modern language engines (like V8 in Node.js and Chrome), stored properties are arranged in memory using Hidden Classes (Shapes/Maps). When objects share the exact same properties added in the exact same sequential order, V8 assigns them the same hidden class, enabling Inline Caching (IC)—compiling property lookups into a direct, hardcoded memory offset read that executes in a single CPU instruction. Conversely, Computed Properties utilize accessor descriptors (`get` and `set`): when a caller writes `rect.area`, the engine intercepts the read and calls the getter function transparently, preserving clean dot-notation syntax while ensuring validation and encapsulation."
      },
      miss: [
        {
          w: "Accessing a property on an object is always a cheap, harmless memory read that cannot execute heavy code.",
          r: "If a property is a computed getter, reading it can execute arbitrary, expensive logic (including network calls or heavy loops); property getters should always be fast and idempotent."
        },
        {
          w: "Adding properties to JavaScript objects dynamically at runtime in arbitrary order has zero performance penalty.",
          r: "Adding properties in different orders creates divergent V8 hidden classes ('Shapes'), de-optimizing inline caches and causing property lookups to slow down by 10x."
        },
        {
          w: "Private properties in JavaScript prefixed with an underscore (`_name`) are truly private and secure.",
          r: "Underscores are merely an informal naming convention; true hardware-enforced private fields in JavaScript require ECMAScript private identifier syntax (`#name`)."
        },
        {
          w: "A computed property should be used to perform asynchronous network requests and database writes.",
          r: "Property getters are strictly synchronous; asynchronous operations or operations with heavy side effects should always be explicit methods (`fetchData()`), never property getters."
        }
      ],
      trade: {
        buys: [
          "Encapsulation with clean ergonomics: callers use intuitive dot syntax (`user.age`) while the class enforces validation in setters.",
          "Elimination of boilerplate getters: modern properties replace dozens of verbose `getFoo()` and `setFoo()` methods.",
          "Dynamic derived state: computed properties calculate values on the fly, eliminating stale cached data synchronization bugs.",
          "V8 inline cache optimization: consistent property layouts allow JavaScript engines to optimize lookups to single-cycle memory reads."
        ],
        costs: [
          "Hidden computational cost: a developer reading `obj.total` might not realize it is executing an expensive $O(N)$ calculation.",
          "Hidden side effect hazards: poorly designed setters can trigger unexpected mutations, network requests, or UI re-renders.",
          "Memory bloat from dynamic shapes: haphazardly assigning ad-hoc properties creates dozens of hidden classes, bloating memory.",
          "Debugging complexity: tracing property mutations through setter breakpoints can be more difficult than tracing method calls."
        ],
        avoid: [
          "Putting expensive algorithms, database queries, or network I/O inside property getter functions.",
          "Adding properties to JavaScript objects in random, inconsistent orders (initialize all fields in the constructor).",
          "Using informal underscores (`_secret`) for sensitive data when native private fields (`#secret`) exist.",
          "Creating setters that trigger unexpected side effects unrelated to the property being set."
        ]
      }
    },
    {
      slug: "instance",
      why: {
        before: "Programs had only static, global data definitions; creating a second 'User' or 'Account' required manually copying variables and functions with names like `user1_name`, `user2_name`, `user3_name`.",
        problem: "Manually managing multiple copies of data was unscalable, caused variable collisions, and made it impossible to allocate objects dynamically at runtime based on user demand.",
        shift: "Object-Oriented Programming separated the Class (the abstract blueprint) from the Instance (the concrete physical object allocated in memory at runtime), enabling dynamic instantiation of infinite distinct objects."
      },
      num: {
        t: "Classes vs Instances: Memory, Lifecycle & Architecture",
        h: ["Dimension", "Class / Prototype (Blueprint)", "Instance (Concrete Object)", "Underlying Machine Memory", "Lifecycle & Cardinality"],
        r: [
          ["Conceptual Role", "Abstract template, type definition, method dictionary", "Living, stateful physical realization of the class", "Class metadata stored in read-only code/type segment", "1 class definition per codebase"],
          ["State Ownership", "Stateless (or holds shared static class variables)", "Owns its own private, isolated instance field values", "Instance fields stored on managed garbage-collected heap", "Dynamically created ($0$ to millions of instances in RAM)"],
          ["Creation Mechanism", "Written by developer at design time; loaded at startup", "Instantiated dynamically at runtime via `new` or factory", "Allocated via `malloc()` or garbage-collected heap pointer bump", "Created at runtime; destroyed when all references dropped"],
          ["Behavior Access", "Defines the methods and virtual dispatch tables", "Delegates method execution to its class vtable / prototype", "Contains hidden pointer (`vptr` or `__proto__`) to class", "Instances share identical method code in memory"]
        ],
        n: "An instance is an individual, concrete realization of an abstraction, allocated in physical computer memory. When code executes `const user = new User('Alice')`, the runtime memory allocator performs three sequential steps: (1) Allocates a contiguous block of heap memory sufficient to hold the instance's member fields, (2) Sets a hidden header pointer (`vptr` in C++, `__proto__` in JavaScript) pointing to the shared Class or Prototype metadata in memory, and (3) Invokes the constructor method to initialize the instance's unique state. Crucially, while each instance maintains its own isolated copy of member fields in memory, all instances of a class share the *exact same* compiled method machine instructions in read-only memory, ensuring that creating 10,000 instances does not duplicate method bytecode."
      },
      miss: [
        {
          w: "Every time you instantiate an object, all of its methods are duplicated in memory.",
          r: "Methods reside once in the class's shared vtable or prototype object in memory; each instance only allocates memory for its own unique data properties and a single pointer back to the shared class."
        },
        {
          w: "The class and the instance are the exact same thing.",
          r: "The class is the static blueprint written in source code; the instance is the physical, living object allocated in RAM heap memory during program execution."
        },
        {
          w: "An instance cannot be garbage collected if its class is still loaded in memory.",
          r: "Instances are garbage collected the microsecond they have no remaining active reference pointers from root sets, regardless of whether the class remains loaded."
        },
        {
          w: "Using `instanceof` in JavaScript is 100% reliable across all browser environments and iframes.",
          r: "`instanceof` checks prototype identity in memory; if an object was created inside an `<iframe>`, its prototype belongs to that iframe's window context, causing `instanceof` to return `false` in the parent frame."
        }
      ],
      trade: {
        buys: [
          "Dynamic runtime scalability: create thousands of distinct data entities (users, bullets, orders) on demand at runtime.",
          "State isolation: each instance encapsulates its own state; mutating one instance does not affect any other instance.",
          "Memory sharing efficiency: all instances share a single copy of class methods and prototype dispatch tables.",
          "Polymorphic flexibility: pass different instances of the same class or interface to common algorithms seamlessly."
        ],
        costs: [
          "Heap memory allocation overhead: instantiating millions of small objects creates heap fragmentation and garbage collection pressure.",
          "Pointer indirection latency: accessing instance properties requires dereferencing heap memory pointers across CPU caches.",
          "Object identity bugs: comparing two identical instances with `===` fails because strict equality checks memory reference address.",
          "Memory leak hazard: failing to nullify references to unused instances keeps them pinned in heap memory permanently."
        ],
        avoid: [
          "Instantiating thousands of temporary objects inside high-frequency animation or game loops (use Object Pools).",
          "Assuming two distinct instances with identical property values will evaluate as equal with `===`.",
          "Relying on `instanceof Array` across cross-realm iframes (use `Array.isArray()` instead).",
          "Attaching methods directly to the instance inside the constructor instead of placing them on the shared prototype/class."
        ]
      }
    },
    {
      slug: "constructor",
      why: {
        before: "In early programming, creating an object allocated raw uninitialized memory containing random garbage bytes; developers had to remember to call a separate initialization function manually.",
        problem: "Developers frequently forgot to call the initialization function, leading to objects executing with garbage memory pointers, null values, and corrupted states that caused segmentation faults.",
        shift: "Object-Oriented Programming introduced the Constructor: a specialized lifecycle method that is guaranteed by the language runtime to execute automatically the instant an object instance is instantiated in memory."
      },
      num: {
        t: "Constructor Behaviors & Object Initialization Paradigms",
        h: ["Constructor Paradigm", "Invocation Syntax", "Memory Allocation Timing", "Subclass Chaining Rule", "Primary Risk / Anti-Pattern"],
        r: [
          ["Standard Class Constructor", "`new ClassName(args)`", "Heap memory allocated immediately before constructor body runs", "Mandatory `super()` call before accessing `this` in subclasses", "Executing heavy I/O or async operations inside constructor"],
          ["Default / Implicit Constructor", "`new ClassName()`", "Allocated with zero-initialized or default field values", "Compiler synthesizes empty no-arg constructor if omitted", "Leaving critical business invariants uninitialized"],
          ["Static Factory Method", "`ClassName.create(args)`", "Delegates to private constructor; returns validated instance", "Flexible; can return cached instances or subtypes", "Over-abstracting simple constructors with unnecessary factory wrappers"],
          ["Dependency Injection Constructor", "Constructor accepting interface dependencies", "Container resolves and passes dependencies automatically", "Inversion of Control; pure dependency declaration", "Constructor parameter explosion (too many dependencies)"]
        ],
        n: "The constructor is the gatekeeper of object integrity. When a program executes the `new` operator, the language runtime first performs raw memory allocation on the heap to store the object's instance fields. Immediately thereafter, before any other code can touch the newly allocated object, the constructor method is executed. The primary responsibility of a constructor is to establish the object's 'Class Invariants'—guaranteeing that the object starts its life in a mathematically and functionally valid state (e.g. ensuring a bank account balance is non-negative and user IDs are valid). In object-oriented inheritance, when a subclass constructor executes, language rules mandate calling `super()` before any access to `this`, ensuring the parent class's memory layout and invariant state are fully initialized before subclass specialization begins."
      },
      miss: [
        {
          w: "Constructors can be asynchronous and return a `Promise` in JavaScript or Python.",
          r: "Constructors are strictly synchronous in virtually all mainstream languages; they must return the newly instantiated object instance, never a Promise (use an asynchronous Static Factory Method instead)."
        },
        {
          w: "Constructors should perform heavy initialization like opening database connections and reading files from disk.",
          r: "Constructors should do minimal work (only assigning fields and validating invariants); putting heavy I/O in constructors slows down testing, prevents mocking, and causes difficult-to-catch errors."
        },
        {
          w: "In a subclass constructor, you can access `this` before calling `super()`.",
          r: "In JavaScript and Java, accessing `this` before calling `super()` throws a fatal runtime `ReferenceError` because the parent class memory layout has not yet been initialized."
        },
        {
          w: "If you don't write a constructor, the class cannot be instantiated.",
          r: "If you omit an explicit constructor, compilers and runtimes automatically generate an empty default constructor that initializes fields to their default values."
        }
      ],
      trade: {
        buys: [
          "Guaranteed object invariants: ensures an object cannot physically exist in memory in an invalid or half-initialized state.",
          "Automated lifecycle initialization: eliminates the human error of forgetting to initialize newly allocated objects.",
          "Explicit dependency injection: constructors declare all required collaborators upfront, easing unit test mocking.",
          "Type-safe immutability setup: allows setting `readonly` and `final` properties that can never be mutated after construction."
        ],
        costs: [
          "Inability to handle async operations: constructors cannot use `await`, requiring awkward two-phase initialization or factory methods.",
          "Subclass initialization coupling: changes to parent constructor parameter signatures break all subclass `super()` calls.",
          "Difficult to unit test if heavy: constructors that perform real network or disk operations make isolated testing painful.",
          "Lack of polymorphically flexible naming: constructors must share the class name, preventing descriptive alternative names."
        ],
        avoid: [
          "Performing heavy I/O, database queries, or network HTTP requests inside a constructor (use a static async factory).",
          "Accessing `this` before calling `super()` in derived subclass constructors.",
          "Allowing a constructor to fail silently without throwing an exception when mandatory invariants are violated.",
          "Writing constructors with 10 positional parameters (pass a single configuration options object instead)."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
