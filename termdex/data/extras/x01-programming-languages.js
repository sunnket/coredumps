/* Real-world examples and step-by-step flows — Programming Languages. */
TD.attach("programming-languages", {

"Python": {
 ex: { h: "The lingua franca of the lab",
       b: "A biologist, a quant and a machine-learning engineer who share no other tools all write Python, because it is readable enough to be picked up alongside a real job and it has a library for everything. It is not fast, and for gluing fast things together that has never mattered." },
 fl: { t: "Why it dominates data and AI",
       s: ["The syntax is close to pseudocode",
           { s: "Which means domain experts can read and write it", n: "Not just professional programmers." },
           { s: "The heavy lifting is C or CUDA underneath", n: "NumPy and PyTorch are thin Python over compiled kernels." },
           { q: "Is Python itself slow?",
             y: "Yes — and your loop is usually one line calling into compiled code",
             n: "The GIL blocks CPU threads; use processes or native extensions" },
           "Use a virtual environment per project or the dependency mess is immediate"] }
},

"JavaScript": {
 ex: { h: "The only language every browser speaks",
       b: "Designed in ten days in 1995 and now running most of the world's user interfaces, because there is no alternative on the client. That accident of history is why its rough edges — type coercion, `this`, `==` — are permanent: the web cannot break backwards compatibility." },
 fl: { t: "Why the oddities survive",
       s: ["A quirk is found in the language",
           { q: "Can it be fixed?",
             y: "Only additively — `===`, `let`, `??` were added alongside the old behaviour",
             n: "Removing anything breaks pages nobody maintains, so nothing is removed" },
           { s: "So the language grows rather than changes", n: "Which is why there are three ways to do most things." },
           "Linters and TypeScript exist largely to steer you away from the old paths"] }
},

"TypeScript": {
 ex: { h: "A spellchecker for your data shapes",
       b: "It does not change what runs — the types are stripped at build time and plain JavaScript ships. What it changes is that renaming a field breaks the build instead of breaking production, and your editor can autocomplete accurately across a large codebase." },
 fl: { t: "What happens to the types",
       s: ["You annotate your code with types",
           { s: "The compiler checks them against every usage", n: "Before anything runs." },
           { q: "Do the types exist at runtime?",
             y: "No — they are erased. `any` from an API response is unchecked",
             n: "Which is why you still validate external data with Zod or similar" },
           { s: "`strict` mode is where most of the value is", n: "Without it, null checking is largely off." },
           "It is a build-time tool: a passing compile says nothing about runtime data"] }
},

"Java": {
 ex: { h: "The language running the bank you do not think about",
       b: "Verbose, stable, and everywhere in enterprise and Android. Its real achievement is the JVM: write once, run on any machine with a JVM, with decades of work on garbage collection and JIT compilation behind it. Boring, in the way infrastructure should be." },
 fl: { t: "From source to running code",
       s: ["`javac` compiles source to bytecode",
           { s: "Bytecode is platform-independent", n: "That is the *write once, run anywhere* claim." },
           { s: "The JVM interprets it, then JIT-compiles hot paths", n: "Which is why long-running Java gets faster after warmup." },
           { q: "Why the slow startup?",
             y: "JIT warmup and classloading — painful for short-lived functions",
             n: "GraalVM native images compile ahead of time to fix exactly that" }] }
},

"C": {
 ex: { h: "The language the other languages are written in",
       b: "Linux, Postgres, Redis, CPython and the standard libraries of most languages. It maps almost directly onto what the hardware does, which is its power and its danger — nothing checks that your pointer is valid, so decades of security holes trace back here." },
 fl: { t: "Why it is fast and dangerous",
       s: ["You manage memory yourself",
           { q: "Did you free everything you allocated?",
             y: "No leak — and now check you did not free it twice",
             n: "A memory leak; the process grows until it dies" },
           { s: "Nothing checks array bounds", n: "Writing past the end corrupts whatever is next — the buffer overflow." },
           { s: "Undefined behaviour is not *unpredictable*", n: "The compiler may assume it cannot happen and optimise accordingly." },
           "Which is exactly the ground Rust was designed to take"] }
},

"C++": {
 ex: { h: "C, plus forty years of everything",
       b: "Game engines, browsers, trading systems, CAD. It gives you zero-cost abstractions — templates and RAII that compile away to nothing — and an enormous surface area. Two experienced C++ engineers can write code the other finds unreadable, and both be right." },
 fl: { t: "The idea that changed it",
       s: ["A resource is acquired — memory, a file, a lock",
           { s: "It is owned by an object on the stack", n: "RAII: resource acquisition is initialisation." },
           { q: "The scope exits — by return, or by an exception?",
             y: "The destructor runs and the resource is released, automatically",
             n: "There is no path where it leaks" },
           { s: "Smart pointers apply the same idea to the heap", n: "`unique_ptr` and `shared_ptr` rather than raw `new`." },
           "Modern C++ is a different language from the C-with-classes people remember"] }
},

"C#": {
 ex: { h: "Microsoft's answer to Java, which grew past it",
       b: "It started as a close relative and has since accumulated async/await, LINQ, records and pattern matching — often ahead of the languages it was compared to. And since .NET Core it runs perfectly well on Linux, which changed who was willing to use it." },
 fl: { t: "Where it is used",
       s: ["A .NET application is compiled to IL",
           { s: "The CLR JIT-compiles it at runtime", n: "The same model as the JVM." },
           { q: "Which platform?",
             y: "Cross-platform since .NET Core — Linux containers are ordinary now",
             n: "Windows desktop, enterprise backends, and Unity games" },
           { s: "async/await originated here", n: "JavaScript and Python borrowed it." },
           "LINQ gives you query syntax over collections, databases and XML alike"] }
},

"Go": {
 ex: { h: "A language designed against complexity",
       b: "Google's answer to enormous codebases and slow builds: a small language you can learn in a weekend, compiled to a single static binary with no runtime to install. Deliberately plain — the absence of features is the design, and it is why large teams stay productive in it." },
 fl: { t: "Goroutines and channels",
       s: ["`go doWork()` starts a goroutine",
           { s: "Thousands are cheap — a few kilobytes each", n: "Not OS threads; the runtime multiplexes them." },
           { s: "Channels pass values between them", n: "*Share memory by communicating*, rather than the reverse." },
           { q: "Nobody reads from the channel?",
             y: "The sender blocks forever — a goroutine leak, and they are easy to create",
             n: "`select` handles multiple channels and timeouts" },
           "A single static binary with no dependencies is why it took over cloud tooling"] }
},

"Rust": {
 ex: { h: "A compiler that refuses to let you make the classic mistakes",
       b: "Use-after-free, data races and buffer overflows are rejected at compile time rather than found in production. The cost is a steep initial fight with the borrow checker — and the reward is C-level performance with a whole class of security bugs made impossible." },
 fl: { t: "Ownership, in three rules",
       s: ["Every value has exactly one owner",
           { s: "When the owner goes out of scope, the value is dropped", n: "No garbage collector, no manual free." },
           { q: "Want to use it elsewhere?",
             y: "Borrow it — many immutable references, or exactly one mutable reference",
             n: "Move it, and the original binding can no longer be used" },
           { s: "That one-mutable-reference rule eliminates data races", n: "The compiler proves it, at compile time." },
           "Fighting the borrow checker is the learning curve; after it, refactoring is fearless"] }
},

"Ruby": {
 ex: { h: "A language optimised for programmer happiness",
       b: "Matz's stated goal, and it shows: code reads close to English and there is usually an elegant way to express what you mean. Rails made it famous by demonstrating how much a strong convention could remove — and its metaprogramming makes some magic hard to trace." },
 fl: { t: "Convention over configuration",
       s: ["You create a model named `Order`",
           { s: "Rails infers the table is `orders`", n: "No configuration file says so." },
           { q: "What did you gain and lose?",
             y: "Enormous speed for anything following the convention",
             n: "Behaviour defined by naming, which is hard to grep for" },
           "Metaprogramming means methods can exist that appear nowhere in the source"] }
},

"PHP": {
 ex: { h: "The language most of the web still runs on",
       b: "WordPress alone is a large fraction of all websites. It was genuinely messy for years and PHP 8 is a different language — typed properties, JIT, proper error handling. It remains the fastest path from *I have a server* to *I have a website*." },
 fl: { t: "The request model",
       s: ["A request arrives",
           { s: "The script runs from scratch", n: "Nothing persists between requests by default." },
           { q: "Is that a limitation?",
             y: "No shared state, so a crash affects one request — a genuinely robust model",
             n: "It also means bootstrapping cost on every request" },
           { s: "Composer and PSR standards modernised the ecosystem", n: "Laravel and Symfony are serious frameworks." },
           "The old reputation is largely about PHP 5 code that is still running"] }
},

"Swift": {
 ex: { h: "Apple replacing Objective-C without breaking it",
       b: "Modern syntax, optionals that make null-handling explicit, and full interoperability with the existing Objective-C ecosystem. If you are shipping to iPhone, this is the language — and SwiftUI has made the declarative approach the default." },
 fl: { t: "Optionals, and the force-unwrap trap",
       s: ["A value may be absent, so its type is `String?`",
           { q: "How do you use it?",
             y: "`if let` or `guard let` — safe unwrapping with an explicit else",
             n: "`!` force-unwraps and crashes if it is nil" },
           { s: "The type system makes absence visible", n: "You cannot forget to handle it — it will not compile." },
           "Memory is managed by ARC, not a garbage collector — retain cycles are the thing to watch"] }
},

"Kotlin": {
 ex: { h: "Java with the sharp edges filed off",
       b: "Null safety in the type system, far less ceremony, and complete interoperability so you can adopt it one file at a time. Google made it the preferred Android language, and it has grown into a credible server-side option too." },
 fl: { t: "Null safety at compile time",
       s: ["A type is non-nullable by default",
           { q: "Can it hold null?",
             y: "Only if declared `String?` — and the compiler then forces you to handle it",
             n: "A NullPointerException becomes a compile error instead" },
           { s: "`?.` and `?:` make the handling terse", n: "Safe call and elvis operator." },
           { s: "Coroutines give structured concurrency", n: "Lightweight, cancellable, with a defined scope." },
           "Calls into Java can still return null — platform types are the gap in the guarantee"] }
},

"Scala": {
 ex: { h: "Functional programming on the JVM",
       b: "Powerful type system, immutability by default, and it can call any Java library. Spark is written in it, which is why data engineers meet it. Its reputation for complexity is earned: the same problem can be solved in five very different styles." },
 fl: { t: "Where you will meet it",
       s: ["A JVM project needs functional abstractions",
           { q: "Is it a data platform?",
             y: "Spark's native API is Scala — the PySpark wrapper sits on top",
             n: "Akka for actor-based concurrency; Play for web services" },
           { s: "The type system is expressive and slow to compile", n: "Build times are a real complaint." },
           "Scala 3 simplified the syntax considerably"] }
},

"R": {
 ex: { h: "A statistician's workbench, not a general-purpose language",
       b: "Built by statisticians for statistics, so the things that are awkward elsewhere — data frames, factor variables, model formulas, publication-quality plots — are native. ggplot2 remains a better plotting grammar than anything Python has." },
 fl: { t: "R or Python?",
       s: ["You have an analysis to do",
           { q: "Is it statistical modelling and visualisation?",
             y: "R — CRAN has the specialist methods, and ggplot2 is genuinely better",
             n: "Is it going into a production system?" },
           { q: "Production deployment?",
             y: "Python — it integrates with everything else you will need",
             n: "Many teams use both: R to explore, Python to ship" },
           "1-indexed, and vectorised by default — both surprise Python users"] }
},

"Julia": {
 ex: { h: "Trying to end the two-language problem",
       b: "The usual pattern is prototype in Python, rewrite the slow part in C. Julia's pitch is that you write it once: high-level syntax, JIT-compiled to near-C speed. It is genuinely fast, and the ecosystem is far smaller than Python's." },
 fl: { t: "Multiple dispatch and the compile pause",
       s: ["You call a function with particular argument types",
           { s: "Julia compiles a specialised version for those types", n: "Multiple dispatch — the method is chosen by every argument's type." },
           { q: "Why is the first call slow?",
             y: "That is compilation — the *time to first plot* problem",
             n: "Subsequent calls with the same types are fast" },
           "Excellent for scientific computing; check library coverage before committing"] }
},

"MATLAB": {
 ex: { h: "The engineering department's standard tool",
       b: "Matrix operations are the native syntax, the toolboxes for control systems and signal processing are excellent and validated, and Simulink models are what regulators expect. It is commercial and expensive, which is why teaching increasingly moves to Python." },
 fl: { t: "Where it still holds",
       s: ["An engineering domain needs numerical work",
           { q: "Is there a validated toolbox for it?",
             y: "Control, signal processing, and Simulink — hard to replace",
             n: "NumPy plus SciPy covers general numerical work at no licence cost" },
           { s: "1-indexed, and matrix-first", n: "`A*B` is matrix multiplication, not element-wise." },
           "Code generation to C for embedded targets is a genuine differentiator"] }
},

"Perl": {
 ex: { h: "The duct tape of the internet",
       b: "For a decade it was how text got processed and sysadmin work got done, and its regular expression engine was so good that *PCRE* — Perl Compatible Regular Expressions — is what almost every other language now implements." },
 fl: { t: "Its lasting contribution",
       s: ["Perl made regular expressions first-class",
           { s: "The syntax became the de facto standard", n: "PCRE is embedded in PHP, Python, Java, and countless tools." },
           { q: "Should you start a new project in it?",
             y: "Rarely — Python covers the same ground with more maintainers",
             n: "You will still meet it in legacy build scripts and sysadmin tooling" },
           "*There is more than one way to do it* is why unfamiliar Perl is hard to read"] }
},

"Haskell": {
 ex: { h: "The language that teaches you the ideas",
       b: "Purely functional, lazily evaluated, with a type system that catches an extraordinary amount before you run anything. Relatively few people ship it — and the ideas that came out of it, from monads to type inference, are now in Rust, Scala, TypeScript and Swift." },
 fl: { t: "Purity and where effects go",
       s: ["Every function is pure by default",
           { q: "How do you read a file or print?",
             y: "Through the IO type — effects are visible in the signature",
             n: "A function's type tells you whether it can touch the outside world" },
           { s: "Evaluation is lazy", n: "Nothing computes until demanded — elegant, and a source of space leaks." },
           "If it compiles, it very often works — that is not a joke"] }
},

"Elixir": {
 ex: { h: "Ruby's syntax on the telecoms runtime",
       b: "It runs on the BEAM, the virtual machine built for phone switches that had to stay up for years. Millions of lightweight processes, supervision trees that restart what fails, and hot code reloading — with a syntax that is genuinely pleasant." },
 fl: { t: "Let it crash",
       s: ["A process encounters an unexpected error",
           { q: "Should it defensively handle every case?",
             y: "No — let it crash. The supervisor restarts it in a known-good state",
             n: "Defensive code everywhere is how you get subtle corrupted state" },
           { s: "Processes are isolated with no shared memory", n: "One crashing cannot corrupt another." },
           { s: "Supervision trees define the restart strategy", n: "Declaratively." },
           "Phoenix LiveView gives real-time UI with very little JavaScript"] }
},

"Erlang": {
 ex: { h: "Built to keep a phone exchange running",
       b: "Ericsson needed nine nines of availability and code upgrades without dropping calls, so they built a language for it. WhatsApp famously served hundreds of millions of users with a very small engineering team on it — the concurrency model is that good." },
 fl: { t: "The actor model, concretely",
       s: ["Everything is a lightweight process",
           { s: "No shared memory at all", n: "Processes communicate only by sending messages." },
           { q: "A process crashes?",
             y: "It cannot corrupt anything else — its supervisor restarts it",
             n: "Isolation is what makes *let it crash* safe" },
           { s: "Hot code reloading swaps code in a running system", n: "Without dropping connections." },
           "Elixir gave the same runtime a more approachable syntax"] }
},

"Clojure": {
 ex: { h: "A Lisp for the JVM, built around immutability",
       b: "Data structures are immutable and persistent, so concurrency stops being frightening — nothing can change under you. The parentheses put people off; the ones who stay generally describe it as the most productive language they have used." },
 fl: { t: "Persistent data structures",
       s: ["You *modify* a map",
           { q: "Is the original changed?",
             y: "No — you get a new map, and the original is untouched",
             n: "Which sounds expensive" },
           { s: "Structure is shared between versions", n: "Only the changed path is copied — it is efficient, not wasteful." },
           { s: "So concurrency needs no locks for reads", n: "Nothing can mutate beneath you." },
           "REPL-driven development is the workflow — the running system is edited live"] }
},

"Lisp": {
 ex: { h: "The language where code is data",
       b: "From 1958, and still the source of ideas other languages are adopting. Because a program is written as the same nested lists the language manipulates, macros can rewrite code at compile time — which is why every powerful macro system is compared to it." },
 fl: { t: "Homoiconicity, and why it matters",
       s: ["Code is written as nested lists",
           { s: "The same structure the language operates on", n: "`(+ 1 2)` is a list containing a symbol and two numbers." },
           { q: "So what?",
             y: "Macros can transform code before it is evaluated — you extend the language itself",
             n: "In most languages, syntax is fixed and only libraries can be added" },
           "Conditionals, garbage collection and REPLs all originated here"] }
},

"Dart": {
 ex: { h: "The language Flutter needed",
       b: "It exists in practice as Flutter's language: JIT-compiled during development for sub-second hot reload, then AOT-compiled to native code for release. That dual mode is exactly what a cross-platform UI toolkit wants." },
 fl: { t: "Two compilation modes",
       s: ["During development, Dart is JIT-compiled",
           { s: "Which is what makes Flutter's hot reload instant", n: "Change a widget and see it without losing state." },
           { q: "For release?",
             y: "AOT-compiled to native ARM or x86 — fast startup, no JIT overhead",
             n: "Or to JavaScript, for the web target" },
           "Sound null safety came in Dart 3 — the type system enforces it end to end"] }
},

"Lua": {
 ex: { h: "The scripting language hiding inside other software",
       b: "Tiny, fast and trivially embeddable — which is why it is in Roblox, World of Warcraft, Redis, Nginx and Neovim. It is rarely the language of a project and frequently the language of a project's configuration and extensions." },
 fl: { t: "Why it is the default embedded language",
       s: ["An application needs user scripting",
           { q: "What are the constraints?",
             y: "Small binary, fast, easy C interop, permissive licence — Lua fits all four",
             n: "Embedding Python or JavaScript brings a much larger runtime" },
           { s: "Everything is built on the table", n: "One data structure serving as array, map and object." },
           "1-indexed, which catches everyone at least once"] }
},

"Bash": {
 ex: { h: "The glue between command-line tools",
       b: "Nobody writes an application in it and almost every deployment touches it. It is excellent at chaining programs together and genuinely awkward as a programming language — which is why the rule of thumb is to move to Python once you need a second data structure." },
 fl: { t: "Writing a script that fails safely",
       s: ["Start with `set -euo pipefail`",
           { s: "Exit on error, on undefined variable, and on any pipeline failure", n: "Without it, a failing command in the middle is ignored." },
           { q: "Do variables hold paths that might contain spaces?",
             y: "Quote every expansion: `\"$var\"` — unquoted is the classic bug",
             n: "Run shellcheck; it catches most of the rest" },
           "Past a hundred lines, or once you need arrays and functions, switch languages"] }
},

"PowerShell": {
 ex: { h: "A shell that pipes objects, not text",
       b: "In bash you pipe text and parse it with awk. In PowerShell you pipe a .NET object with real properties, so `Get-Process | Where CPU -gt 100` needs no parsing at all. It is a genuinely different and better model — and it is verbose." },
 fl: { t: "Objects in the pipeline",
       s: ["A cmdlet emits objects, not lines of text",
           { q: "Filtering on a property?",
             y: "`Where-Object` reads the real property — no parsing, no fragile column positions",
             n: "In bash you would cut a column and hope the format never changes" },
           { s: "Verb-Noun naming is consistent and discoverable", n: "`Get-`, `Set-`, `New-`, `Remove-`." },
           "Bash syntax does not work here — `&&`, `$VAR` and `2>/dev/null` all differ"] }
},

"Assembly Language": {
 ex: { h: "Speaking to the processor in its own words",
       b: "One line per machine instruction, specific to one architecture. Almost nobody writes whole programs in it now — you meet it reading a disassembly during a security investigation, or writing the handful of instructions a compiler cannot express." },
 fl: { t: "Where you actually encounter it",
       s: ["Something needs to happen at the instruction level",
           { q: "Is it performance?",
             y: "Rarely worth it — modern compilers beat hand-written assembly almost always",
             n: "Bootloaders, interrupt handlers, and SIMD intrinsics" },
           { s: "Reverse engineering is the common case", n: "Reading a disassembly to understand a binary." },
           "It is architecture-specific: x86 assembly means nothing to an ARM chip"] }
},

"COBOL": {
 ex: { h: "The language still moving the money",
       b: "A large share of daily banking transactions still passes through COBOL written decades ago. It is verbose by design — it was meant to be readable by business people — and it works, which is why replacing it is a risk nobody is eager to take." },
 fl: { t: "Why it has not been replaced",
       s: ["A system has run correctly for forty years",
           { q: "What does a rewrite cost?",
             y: "Re-deriving business rules that exist only in the code, with no room for error",
             n: "The existing system is slow to change but does not fail" },
           { s: "Fixed-point decimal arithmetic is native", n: "No floating-point rounding on money — which is exactly right." },
           "The shortage is people who understand both COBOL and the business domain"] }
},

"Fortran": {
 ex: { h: "Still the fastest way to multiply large matrices",
       b: "1957, and it remains the language of weather models, computational fluid dynamics and physics simulation. Its array semantics let compilers optimise numerical loops extremely aggressively — and the libraries underneath NumPy are partly Fortran." },
 fl: { t: "Why numerical code stayed here",
       s: ["A simulation does enormous array arithmetic",
           { s: "Fortran's aliasing rules let the compiler vectorise freely", n: "It knows arrays do not overlap." },
           { q: "Could C do the same?",
             y: "Only with careful `restrict` annotations that most code omits",
             n: "Decades of validated numerical libraries are the other reason" },
           "BLAS and LAPACK sit under NumPy, MATLAB and R alike"] }
},

"Objective-C": {
 ex: { h: "What Apple used before Swift",
       b: "C with Smalltalk-style message passing bolted on, and square brackets everywhere. Swift has replaced it for new work — and enormous amounts of existing framework code and app code are still written in it, which is why Swift interoperates so carefully." },
 fl: { t: "Message passing, not method calling",
       s: ["`[object doSomething]` sends a message",
           { q: "What if the object does not respond to it?",
             y: "It fails at runtime, not compile time — dynamic dispatch",
             n: "A message to nil is a no-op rather than a crash, which is unusual" },
           { s: "That dynamism enables method swizzling", n: "Powerful, and used by analytics libraries in ways that surprise people." },
           "Swift can call it directly, which is what made the transition possible"] }
},

"Groovy": {
 ex: { h: "The language your build file is written in",
       b: "Most people meet it exclusively as Gradle's build DSL. It is a dynamic language on the JVM that reads like a relaxed Java, and its lasting contribution is being pleasant enough to write configuration in." },
 fl: { t: "Where you will meet it",
       s: ["You open a `build.gradle` file",
           { q: "Is this Groovy or Kotlin?",
             y: "Groovy — the historic default, dynamically typed, no IDE completion to speak of",
             n: "`build.gradle.kts` is the Kotlin DSL, with real type checking" },
           { s: "Jenkins pipelines are also Groovy", n: "Which is why they fail at runtime rather than at parse time." },
           "New Gradle projects increasingly default to the Kotlin DSL"] }
},

"F#": {
 ex: { h: "Functional-first on .NET",
       b: "ML-family language with strong type inference and immutability by default, able to call any .NET library. It finds its niche in financial modelling and data-heavy domains where correctness matters and the type system does real work." },
 fl: { t: "Making illegal states unrepresentable",
       s: ["Model a domain with discriminated unions",
           { s: "An order is `Draft | Paid of Payment | Cancelled of Reason`", n: "Each case carries exactly the data it needs." },
           { q: "Can you have a cancelled order with a payment?",
             y: "Not representable — the type system forbids it",
             n: "In a class with nullable fields, every invalid combination is expressible" },
           "Exhaustive pattern matching means adding a case breaks the build until handled"] }
},

"OCaml": {
 ex: { h: "The language the Rust compiler was first written in",
       b: "Fast, strongly typed, functional, with an exceptional module system. Jane Street runs its trading systems on it. Its influence is larger than its user base — Rust, Swift and ReasonML all borrow heavily from its ideas." },
 fl: { t: "Type inference doing the work",
       s: ["You write a function with no annotations",
           { s: "The compiler infers the most general type", n: "Hindley-Milner inference." },
           { q: "What does that buy you?",
             y: "Full static type safety with almost none of the typing",
             n: "And a type error caught at the definition rather than at the call site" },
           "Pattern matching is exhaustive — the compiler tells you which case you forgot"] }
},

"Zig": {
 ex: { h: "A modern attempt at replacing C",
       b: "No hidden control flow, no hidden allocations, no preprocessor — everything you can see is what happens. It also ships a C compiler and can cross-compile C projects, which has made it useful to people who never write Zig at all." },
 fl: { t: "Explicit allocation",
       s: ["A function needs memory",
           { q: "Where does it come from?",
             y: "An allocator passed in as a parameter — always visible in the signature",
             n: "No hidden global allocator, so embedded and freestanding targets are natural" },
           { s: "`comptime` runs arbitrary code at compile time", n: "Replacing macros and generics with one mechanism." },
           "Pre-1.0 — the language still changes between releases"] }
},

"Nim": {
 ex: { h: "Python-like syntax compiled to C speed",
       b: "Indentation-based and readable, compiled through C to native binaries with no runtime dependency. Powerful macros and a small, capable community — the perennial question is whether the ecosystem is deep enough for what you need." },
 fl: { t: "How it compiles",
       s: ["Nim source is compiled to C, C++ or JavaScript",
           { s: "Then handed to a native C compiler", n: "Which is why it inherits excellent platform support." },
           { q: "What about memory?",
             y: "ARC/ORC gives deterministic destruction without a tracing GC",
             n: "Manual management is available where you need it" },
           "The macro system operates on the AST — genuinely powerful metaprogramming"] }
},

"Solidity": {
 ex: { h: "Code where a bug is a bank robbery",
       b: "Smart contracts are immutable once deployed and hold real money, so a reentrancy bug is not a support ticket — it is a permanent loss. That is why the language has such an unusual culture of audits, formal verification and known-vulnerability checklists." },
 fl: { t: "The reentrancy pattern",
       s: ["A contract sends funds to an external address",
           { q: "Did it update its internal balance first?",
             y: "Checks-effects-interactions — state updated before the external call",
             n: "The recipient can call back in before the balance is reduced, and drain it" },
           { s: "That is the DAO hack, and it still recurs", n: "Reentrancy guards exist for exactly this." },
           { s: "Every operation costs gas", n: "An unbounded loop can make a function permanently uncallable." },
           "Deployed code is immutable — upgrades need a proxy pattern designed in from the start"] }
},

"VBA": {
 ex: { h: "The macros running the finance department",
       b: "Enormous quantities of critical business logic live in Excel workbooks, written by people who would not describe themselves as programmers. It is unversioned, untested and load-bearing — which is exactly why it is both a running joke and a genuine risk." },
 fl: { t: "The spreadsheet problem",
       s: ["A business process is automated in a workbook",
           { q: "Is it in version control, or tested?",
             y: "Very unusually",
             n: "The usual case — and the author has often left" },
           { s: "It works, and it is invisible to IT", n: "Which is how a single spreadsheet becomes a critical dependency." },
           "The migration path is usually Python plus openpyxl, and it is a project, not an afternoon"] }
},

"Pascal": {
 ex: { h: "The language that taught a generation to program",
       b: "Designed by Wirth for teaching, and its strictness made it good at that. Delphi turned it into a serious Windows development tool, and a surprising amount of business software still runs on that lineage." },
 fl: { t: "Its lasting influence",
       s: ["Pascal enforced structured programming strictly",
           { s: "Clear block structure, strong typing, no falling through", n: "Deliberately pedagogical." },
           { q: "Where did it go?",
             y: "Delphi and Free Pascal keep it alive commercially",
             n: "Its influence shows in Ada, Modula and the general shape of imperative languages" },
           "`:=` for assignment and `=` for comparison — a distinction later languages blurred"] }
},

"Prolog": {
 ex: { h: "Stating the rules and letting the machine search",
       b: "You do not write an algorithm. You state facts and rules, ask a question, and the engine works out how to satisfy it by backtracking. Utterly different from everything else, and the mental model behind modern constraint solvers." },
 fl: { t: "How a query is answered",
       s: ["You declare facts and rules",
           { s: "`parent(tom, bob).` and `grandparent(X,Y) :- parent(X,Z), parent(Z,Y).`", n: "No procedure is written." },
           { q: "You ask `grandparent(tom, W)`?",
             y: "The engine searches for bindings that satisfy the rules, backtracking as needed",
             n: "You never specified how — only what must be true" },
           "Clause order affects performance and termination, which is where the pragmatism creeps in"] }
},

"Ada": {
 ex: { h: "The language for things that must not fail",
       b: "Commissioned by the US Department of Defense, and used in avionics, rail signalling and spacecraft. Strong typing taken further than almost anywhere else — you can define a type that is a distance in metres and be prevented from adding it to a time." },
 fl: { t: "Types that carry meaning",
       s: ["Define a type with a range and a unit",
           { s: "`type Metres is new Float range 0.0 .. 10_000.0;`", n: "It is not interchangeable with a plain float." },
           { q: "Add metres to seconds?",
             y: "Compile error — the units are distinct types",
             n: "Range violations are caught at runtime with a defined exception" },
           { s: "SPARK is a subset that supports formal proof", n: "You can prove the absence of runtime errors." },
           "The Mars Climate Orbiter was lost to exactly the unit confusion this prevents"] }
},

"Compiled Language": {
 ex: { h: "Translating the whole book before publication",
       b: "All the work happens before anyone reads it, so errors are found early and reading is fast. The trade is a build step between writing and running — and for a large project that step can take minutes, which shapes how people work." },
 fl: { t: "The trade against interpreted",
       s: [{ s: "Before anyone runs your program, a tool reads all your code and translates it into instructions the processor understands directly", n: "This translation step is called building or compiling, and it happens on your machine, not the user's." },
           { s: "What ships to the user is that translated file, not your original text", n: "They cannot read your source code from it, and they do not need any extra software to run it." },
           { q: "What do you get for that extra step?",
             y: "It runs fast, because the translating was already done — and many mistakes get caught during translation, before anyone can hit them",
             n: "You pay with a wait every time you change something, and you need a separate build for each kind of machine: Windows, Mac, phone" },
           { s: "Most modern languages now blur this line", n: "Many so-called interpreted languages quietly translate the busy parts while running, and end up nearly as fast." }] }
},

"Interpreted Language": {
 ex: { h: "Reading the translation aloud as you go",
       b: "You start immediately and find errors when you reach them. Faster to iterate, slower to run, and portable because the interpreter handles the platform differences — which is exactly why scripting languages took this route." },
 fl: { t: "The trade against compiled",
       s: [{ s: "There is no separate build step — a program called the interpreter reads your code and carries it out as it goes", n: "Save the file, run it, see the result. Nothing in between." },
           { s: "The user needs that interpreter installed to run anything you wrote", n: "This is why you install Python before running a Python script." },
           { q: "What do you get?",
             y: "You see the result of a change immediately, which makes experimenting and learning far quicker",
             n: "It runs slower, because the translating happens over and over while the program runs — and mistakes only surface when that line is actually reached" },
           { s: "That last point is the real catch", n: "A typo on a rarely used line can sit undiscovered for months, then break in front of a user." }] }
},

"Static Typing": {
 ex: { h: "Checking the parts fit before assembly",
       b: "The compiler verifies that you are not passing a string where a number is expected, everywhere, before anything runs. It costs you some ceremony and catches an entire class of bug at the cheapest possible moment." },
 fl: { t: "When the check happens",
       s: [{ s: "Every value in a program has a kind: a whole number, some text, a list, and so on. That kind is its type", n: "Putting text where a number belongs is a mistake — the question is only when you find out." },
           { s: "With static typing, a tool checks all of this before the program ever runs", n: "It reads your code and works out what kind each value is meant to be." },
           { q: "You accidentally pass text where a number was expected. What happens?",
             y: "The check fails immediately and refuses to build. You lose thirty seconds and nothing broken ever leaves your machine",
             n: "In a language without this, it runs perfectly happily until it reaches that exact line — which might be in front of a customer" },
           { s: "You do not have to write the type out everywhere", n: "Modern languages work most of them out for you from what you wrote." },
           { s: "It is also what makes your editor genuinely helpful", n: "Knowing the type is how it offers the right suggestions and renames safely." }] }
},

"Dynamic Typing": {
 ex: { h: "Finding out when you try it",
       b: "Types belong to values rather than to variables, so the same name can hold a number and later a list. It makes prototyping fast and it moves the whole class of type errors from build time to runtime — which is why large dynamic codebases usually adopt a type checker eventually." },
 fl: { t: "Flexibility, and what it costs",
       s: [{ s: "A variable is not tied to one kind of value — you can put a number in it now and text in it later", n: "The language does not object, and nothing is checked in advance." },
           { s: "The kind of a value is only worked out at the moment that line actually runs", n: "Which is why you can write code that would never survive an advance check." },
           { q: "What does that buy you?",
             y: "Speed of writing. Less to type, easy experimenting, and code that bends to whatever you throw at it",
             n: "Mistakes hide until the line runs. A branch you rarely take can hold a broken line for a very long time" },
           { s: "The usual fix is tests, plus optional type hints", n: "Python's hints and TypeScript both add back an advance check without giving up the flexibility." }] }
},

"Strong Typing": {
 ex: { h: "Refusing to guess what you meant",
       b: "`\"5\" + 5` is an error rather than a silent conversion. Python is strongly and dynamically typed — it will not add a string to a number, but it will happily let a variable change type. The two axes are independent and are constantly confused." },
 fl: { t: "Strong versus static",
       s: ["Two independent questions",
           { q: "When are types checked — compile time or runtime?",
             y: "That is static versus dynamic",
             n: "How willing is the language to convert between types?" },
           { s: "That second question is strong versus weak", n: "Python: strong and dynamic. C: static and relatively weak." },
           "Strong typing means fewer silent surprises, whenever the check happens"] }
},

"Weak Typing": {
 ex: { h: "A language that helpfully guesses",
       b: "JavaScript's `\"5\" - 3` is 2 and `\"5\" + 3` is `\"53\"`, because it converts differently for different operators. Convenient occasionally and a reliable source of bugs — which is why `===` exists and why linters ban `==`." },
 fl: { t: "Where implicit conversion bites",
       s: ["An operator meets mismatched types",
           { q: "Does the language convert automatically?",
             y: "`\"5\" - 3` is 2 but `\"5\" + 3` is `\"53\"` — the rules differ per operator",
             n: "A strongly typed language raises an error and you fix it" },
           { s: "Comparisons are the worst case", n: "`0 == \"\"` and `null == undefined` are both true." },
           "Use `===`, and convert explicitly at every boundary"] }
},

"Type Inference": {
 ex: { h: "The compiler filling in what is obvious",
       b: "`let x = 5` clearly holds an integer — nobody needs to be told. Inference gives you the safety of static typing without the ceremony, which is why modern statically typed languages feel so much lighter than Java of twenty years ago." },
 fl: { t: "How far it goes",
       s: [{ s: "You write `x = 5` and never say anywhere that x is a whole number", n: "You did not have to. Look at the 5 and it is obvious." },
           { s: "The language does exactly that: it works out the kind from what you assigned", n: "And keeps following it — if you then add x to another whole number, it knows that result is one too." },
           { q: "Does it work everywhere?",
             y: "Inside a function, almost always — you rarely need to spell anything out",
             n: "At the edges of a function — what goes in and what comes out — you usually still write it down on purpose" },
           { s: "That split is the practical advice: be explicit at the boundaries, let it figure out the inside", n: "The boundaries are what other people read; the inside is just plumbing." }] }
},

"Bytecode": {
 ex: { h: "An intermediate language for a virtual machine",
       b: "Not machine code for any real processor — instructions for an imaginary one that the JVM or CPython implements. That indirection is what makes *compile once, run anywhere* possible, and what allows JIT compilation to specialise for the machine it finds itself on." },
 fl: { t: "From your text to something running",
       s: [{ s: "Your code is translated once into a compact set of simple instructions", n: "Not the ones your processor uses — a made-up simpler set, invented for this purpose." },
           { s: "That translated file runs on any machine, because it is not tied to any real processor", n: "Java's `.class` files and Python's `.pyc` files are exactly this." },
           { s: "A program called a virtual machine then reads those instructions and carries them out", n: "It is the piece that knows how to turn the made-up instructions into real ones for the machine it is on." },
           { q: "What if one part of the program is used constantly?",
             y: "The virtual machine notices, translates that part properly into real processor instructions, and runs the fast version from then on",
             n: "Rarely used parts stay in the slower form — translating them properly would cost more time than it saves" }] }
},

"JIT Compilation": {
 ex: { h: "Deciding what is worth optimising while the show runs",
       b: "An ahead-of-time compiler must guess. A JIT can watch which loop actually runs a million times, see which types actually appear, and compile a specialised version — sometimes beating static compilation because it knows things the static compiler could not." },
 fl: { t: "How a busy path gets sped up",
       s: [{ s: "Your program starts out running the slow way, one instruction at a time", n: "Fine for code that runs once, wasteful for code that runs a million times." },
           { s: "While running, the system counts how often each piece of code is used", n: "It also watches what kinds of value actually pass through — real behaviour, not guesses." },
           { q: "Has one piece been used enough times to be worth the effort?",
             y: "Yes — translate it properly into fast processor instructions, tuned to exactly the kinds of value it has been seeing",
             n: "No — leave it alone. Translating code that runs twice costs more than it saves" },
           { s: "If something unexpected later shows up, it throws the fast version away and goes back to the slow one", n: "The fast version was built assuming things that turned out not to hold." },
           { s: "This is why a program can be slow for its first few seconds and then speed up", n: "And why timing a program must ignore those first runs, or the number is meaningless." }] }
},

"AOT Compilation": {
 ex: { h: "Doing all the compiling before the doors open",
       b: "No warmup, no JIT pauses, instant startup — which matters enormously for serverless functions and command-line tools. The cost is that the compiler cannot see real runtime behaviour, so peak throughput can be lower than a warmed-up JIT." },
 fl: { t: "When to choose it",
       s: ["A program's startup time matters",
           { q: "Is it short-lived — a CLI, a lambda, a container that scales to zero?",
             y: "AOT — the JIT never gets time to warm up anyway",
             n: "A long-running server benefits from JIT's runtime specialisation" },
           { s: "GraalVM native image gives Java AOT compilation", n: "Milliseconds to start instead of seconds." },
           "Reflection and dynamic loading need configuration — AOT must know at build time"] }
},

"REPL": {
 ex: { h: "A conversation with the language",
       b: "Type an expression, see the result, adjust. It turns learning and debugging from a write-run-read cycle into a dialogue — which is why Lisp had one in 1960 and why every language that lacks one eventually grows one." },
 fl: { t: "The loop",
       s: ["Read — parse what you typed",
           { s: "Eval — execute it in the current session", n: "State from previous lines is still there." },
           { s: "Print — show the result", n: "Immediately." },
           { q: "Why does that matter?",
             y: "You can inspect a live object rather than guessing from a stack trace",
             n: "Loop, with everything you have built still in memory" },
           "Notebooks are a REPL with the history saved and rendered"] }
},

"Package Manager": {
 ex: { h: "An app store for code",
       b: "It resolves what you asked for, works out the whole dependency tree, downloads it and records the exact versions. It also means one compromised package can reach thousands of projects — which is why lockfiles and audits matter." },
 fl: { t: "What `install` actually does",
       s: ["You name a package and a version range",
           { s: "It resolves the full transitive tree", n: "Often hundreds of packages from your four." },
           { q: "Is there a lockfile?",
             y: "Install exactly those versions — reproducible everywhere",
             n: "It resolves ranges afresh and may pull something new" },
           { s: "It writes or updates the lockfile", n: "Commit it." },
           "Audit regularly; typosquatting and compromised maintainers are real"] }
},

"Standard Library": {
 ex: { h: "What comes in the box",
       b: "Python's *batteries included* philosophy means HTTP, JSON, dates, compression and testing are all there with no dependencies. C's is minimal, which is why every C project reimplements string handling. Where a language sits on that spectrum shapes its ecosystem enormously." },
 fl: { t: "Reach for it first",
       s: ["You need a common capability",
           { q: "Is it in the standard library?",
             y: "Use it — no dependency, no supply-chain risk, no version drift",
             n: "Now weigh a package against writing it yourself" },
           { s: "Standard libraries move slowly", n: "Which is stability, and also why third-party alternatives are sometimes better." },
           "Go's is unusually good for network services; Rust's is deliberately small"] }
},

"Scripting Language": {
 ex: { h: "The language you reach for to automate something",
       b: "Interpreted, dynamically typed, minimal ceremony — no build step between the idea and the result. The distinction has largely dissolved: Python and JavaScript are *scripting languages* running enormous production systems." },
 fl: { t: "What the label really means",
       s: ["A language optimised for quick automation",
           { q: "Is the boundary meaningful today?",
             y: "Not really — Python and JS run banks and browsers",
             n: "It describes a style: no compile step, fast to write, dynamic" },
           "The useful question is not *is it a scripting language* but *how does it fail*"] }
},

"Markup Language": {
 ex: { h: "Annotating a document rather than instructing a computer",
       b: "HTML, XML, Markdown and YAML describe structure and content — this is a heading, this is a list. They are not programming languages, which is exactly why *HTML is not a programming language* is both pedantic and correct." },
 fl: { t: "Markup or programming?",
       s: ["A language describes something",
           { q: "Can it express conditionals and loops?",
             y: "It is a programming language",
             n: "It is markup — it annotates structure, and something else interprets it" },
           { s: "Templating adds logic on top", n: "Which is where the boundary genuinely blurs." },
           "YAML is markup that people keep trying to use as a programming language"] }
},

"Domain-Specific Language": {
 ex: { h: "A vocabulary built for one job",
       b: "SQL cannot open a socket and is unbeatable at querying tables. Regex cannot loop and is unbeatable at pattern matching. Deliberate narrowness is the whole design — and it lets a non-programmer express things they otherwise could not." },
 fl: { t: "Building one",
       s: ["A domain has repetitive, expressible logic",
           { q: "External or internal DSL?",
             y: "External — its own syntax and parser. Powerful, and you own the tooling",
             n: "Internal — a fluent API in the host language. Free tooling, less freedom" },
           { s: "Restricting expressiveness is a feature", n: "A non-Turing-complete DSL can be analysed and guaranteed to terminate." },
           "The cost is documentation, error messages and editor support — usually underestimated"] }
},

"Low-Level Language": {
 ex: { h: "Close enough to the metal to see it",
       b: "You manage memory, you think about registers and cache lines, and there is very little between what you write and what the processor does. That control is what operating systems and device drivers require, and what makes it slow to write." },
 fl: { t: "What *low-level* costs and buys",
       s: ["The language exposes the machine",
           { q: "What do you control?",
             y: "Memory layout, allocation, and exactly which instructions run",
             n: "And you are responsible for every one of those decisions" },
           { s: "Predictable performance is the real prize", n: "No GC pause, no hidden allocation." },
           "Rust is the first serious attempt at this control without the classic memory bugs"] }
},

"High-Level Language": {
 ex: { h: "Expressing the intent, not the mechanism",
       b: "`for user in users` says nothing about pointers, memory or iteration protocol. That abstraction is why a small team can build something large — and it is why a performance problem can be genuinely hard to see from the source." },
 fl: { t: "What is hidden from you",
       s: ["You write in terms of the problem, not the machine",
           { s: "Memory management, machine details, iteration mechanics", n: "All handled." },
           { q: "What is the cost?",
             y: "Less control, and performance characteristics you cannot always see",
             n: "Enormous gains in productivity, safety and portability" },
           "Most work belongs here; drop lower only where measurement says to"] }
},

"Java Virtual Machine": {
 ex: { h: "A pretend computer that every real computer can imitate",
       b: "Compile to its instruction set once and any machine with a JVM can run it. Thirty years of work on garbage collection and JIT compilation have gone into it, which is why it now hosts Kotlin, Scala and Clojure as well as Java." },
 fl: { t: "Where the tuning happens",
       s: ["Bytecode is loaded and verified",
           { s: "It is interpreted, and hot paths are JIT-compiled", n: "Which is why throughput improves after warmup." },
           { q: "Latency-sensitive workload?",
             y: "Choose the collector deliberately — ZGC and Shenandoah target very low pauses",
             n: "G1 is the sensible default for most services" },
           { s: "Heap sizing is the other main dial", n: "Too small means constant collection; too large means longer pauses." },
           "The JVM is the reason Kotlin could be adopted incrementally"] }
},

"Node.js": {
 ex: { h: "JavaScript let out of the browser",
       b: "Ryan Dahl put V8 on a server with an event loop, and suddenly one language covered both ends of a web application. Its single-threaded, non-blocking model is superb for I/O-heavy services and exactly wrong for CPU-heavy ones." },
 fl: { t: "One thread, many connections",
       s: ["A request arrives and needs a database query",
           { s: "The query is started and the thread moves on", n: "It does not wait." },
           { q: "What if the handler does heavy computation instead?",
             y: "The event loop is blocked — every other request stalls",
             n: "Move it to a worker thread or a separate service" },
           { s: "Thousands of concurrent connections, one thread", n: "As long as none of them blocks." },
           "`cluster` or a process manager uses the other cores"] }
},

".NET": {
 ex: { h: "Microsoft's runtime, now genuinely cross-platform",
       b: "For years it meant Windows. Since .NET Core it runs on Linux and macOS as a first-class target, which is why .NET in a container is now unremarkable. One runtime, one library, several languages on top." },
 fl: { t: "The pieces",
       s: ["Your language compiles to IL — intermediate language",
           { s: "C#, F# and VB all target it", n: "One runtime, several languages." },
           { s: "The CLR JIT-compiles and manages memory", n: "Garbage collected, like the JVM." },
           { q: "Which .NET?",
             y: "Modern .NET (5+) is cross-platform and where new work goes",
             n: "*.NET Framework* is Windows-only and in maintenance" }] }
},

"Runtime Environment": {
 ex: { h: "Everything the program needs that is not the program",
       b: "The interpreter or VM, the standard library, the memory manager, the bridge to the operating system. *Works on my machine* almost always means the runtime differs — a different Node version, a different Python, a missing shared library." },
 fl: { t: "Why it broke in production",
       s: ["Code works locally and fails after deploy",
           { q: "Are the runtime versions identical?",
             y: "Look elsewhere — config, environment variables, data",
             n: "Very likely the cause: a syntax or API present in one and not the other" },
           { s: "Pin it explicitly", n: "`.nvmrc`, `engines`, a specific base image tag." },
           "Containers exist largely so the runtime travels with the code"] }
},

"Null Safety": {
 ex: { h: "A type system that will not let you forget",
       b: "Hoare called null his billion-dollar mistake. Kotlin, Swift and Rust encode absence in the type: a `String` cannot be null, a `String?` might be, and the compiler forces you to handle the difference before it will build." },
 fl: { t: "Turning a crash into a warning you get early",
       s: [{ s: "Sometimes a value is simply missing — no user found, no file, nothing returned", n: "Languages usually represent that absence with a special empty value: null, nil, or None." },
           { s: "The classic crash is using that empty value as if something were there", n: "Asking for the name of a user that does not exist. It has caused more crashes than any other single mistake in programming." },
           { q: "Does the language make you say, up front, that a value might be missing?",
             y: "Yes — and then it refuses to let you use it until you have written what to do when it is empty",
             n: "No — the code builds fine and crashes later, in front of whoever happened to hit that case" },
           { s: "Most languages that do this give you a wrapper meaning *either a value or nothing*", n: "You have to open the wrapper, and opening it means handling both cases." },
           { s: "Most also give you an escape hatch that skips the check", n: "Using it brings back exactly the crash the feature existed to prevent." }] }
},

"Memory Safety": {
 ex: { h: "Not being able to read someone else's mail",
       b: "Buffer overflows and use-after-free have been behind roughly two thirds of serious vulnerabilities in large C and C++ codebases for decades. Memory-safe languages make those bugs impossible rather than merely discouraged — which is why national security agencies now recommend them." },
 fl: { t: "How different languages protect you",
       s: [{ s: "Every running program is handed some memory to work in — a numbered set of slots for its values", n: "Reading or writing a slot that is not yours is where a huge share of serious security holes come from." },
           { s: "The classic mistake is using a slot after you have given it back, or reaching past the end of a list", n: "Sometimes it crashes. Worse, sometimes it quietly returns whatever happened to be there." },
           { q: "What stops that from happening?",
             y: "Most languages check as the program runs, and tidy up unused memory for you automatically — Java, Python, Go, C#",
             n: "Rust instead checks before the program runs, using strict rules about who owns what, so there is nothing to check while running" },
           { s: "C and C++ do neither by default", n: "They trust you completely, which is why they are fast and why so many security bugs live there." },
           { s: "The practical advice is not to rewrite everything", n: "It is to write anything new in a language that protects you." }] }
},

"Transpiler": {
 ex: { h: "Translating between two languages of similar level",
       b: "A compiler goes down toward the machine; a transpiler goes sideways. TypeScript to JavaScript, modern JS to older JS, Sass to CSS — the output is still source code a person could read." },
 fl: { t: "Where it fits in a build",
       s: [{ s: "A normal compiler turns your code into instructions for a processor. A transpiler turns it into *other code*", n: "Same job — translating — but the output is still something a person could read." },
           { s: "You write in the language you would rather use", n: "TypeScript, or a very new version of JavaScript with features browsers do not have yet." },
           { s: "The transpiler rewrites it into the language that actually has to run there", n: "TypeScript becomes plain JavaScript, because that is all a browser understands." },
           { q: "What if the target already supports the feature you used?",
             y: "It is left alone — no need to rewrite something that already works",
             n: "It gets rewritten into older equivalents, or a small piece of support code is bundled in to fill the gap" },
           { s: "A side file records which output line came from which original line", n: "Without it, an error would point at generated code you never wrote." }] }
},

"Syntax": {
 ex: { h: "Grammar, not meaning",
       b: "*Colourless green ideas sleep furiously* is grammatically perfect and says nothing. A syntax error means the parser could not read your sentence at all — which is why it stops before running anything, and why the reported line is often one after the real mistake." },
 fl: { t: "Syntax or semantics?",
       s: ["Something is wrong with your code",
           { q: "Did it fail to parse?",
             y: "Syntax error — a bracket, a colon, a quote. Nothing ran",
             n: "It parsed, so this is a semantic or logic problem" },
           { s: "Syntax errors are the cheapest kind", n: "Found instantly, before any side effects." },
           "Editors with bracket matching catch nearly all of them as you type"] }
},

"Semantics": {
 ex: { h: "What the sentence actually means",
       b: "`x = 5` parses identically in twenty languages and does subtly different things in several of them — copy or reference, mutable or not. Semantics is where the real differences between languages live, and where the interesting bugs are." },
 fl: { t: "Where meaning differs even when the code looks identical",
       s: [{ s: "Syntax is what code looks like. Semantics is what it actually does", n: "Two languages can share the exact same punctuation and behave completely differently." },
           { s: "Take one line that exists in nearly every language: `b = a`", n: "It looks obvious. It is not." },
           { q: "Does that line copy the value, or just point at the same thing?",
             y: "In Python it points at the same thing — change the list through b and a changes too, which catches people out constantly",
             n: "In C++ it makes a copy by default — change one and the other is untouched, which catches Python programmers out just as often" },
           { s: "The same split appears in scoping, in what counts as equal, and in the order things happen", n: "Syntax is what you learn in week one. Semantics is what bites you in month six." },
           { s: "In C, some mistakes have no defined meaning at all", n: "The compiler is then allowed to do anything, including quietly deleting your check." }] }
},

"Duck Typing": {
 ex: { h: "If it quacks, it is close enough",
       b: "Nothing checks that an object is a File — only that it has a `read` method. That is why you can pass a StringIO anywhere a file is expected, with no interface to declare, and why a typo in a method name is discovered only when that line runs." },
 fl: { t: "Judged by what it can do, not what it is",
       s: [{ s: "The name comes from a saying: if it walks like a duck and quacks like a duck, treat it as a duck", n: "Never mind what it actually is — can it do the thing you need?" },
           { s: "Your code calls `thing.read()` on whatever it was handed", n: "It does not ask what kind of object that is." },
           { q: "Does it check the object's type first?",
             y: "No — it simply tries. If the object has a `read` that works, everything is fine",
             n: "So a real file, a chunk of text pretending to be a file, and a network connection all work, with nothing in common between them" },
           { s: "This makes testing very easy", n: "A stand-in object needs only the right method names — no special setup, no relationship to the real thing." },
           { s: "The cost: if the object cannot do it, you find out only when that line runs", n: "And the error appears at the point of use, which may be far from where the wrong thing was passed in." }] }
}

});
