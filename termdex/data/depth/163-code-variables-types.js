(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "variable",
      why: {
        before: "In early machine-code and assembly programming, developers had to manually keep track of raw physical memory addresses (e.g. store accumulator to hex address `0x7FFF04A8`), recalculating all memory offsets whenever new instructions were added.",
        problem: "Manual memory addressing was excruciatingly error-prone; a minor code insertion shifted memory addresses, causing silent memory overwrites, buffer corruption, and unmaintainable programs.",
        shift: "The Variable abstracted physical memory into named, symbolic bindings, allowing compilers and runtimes to handle stack offsets, heap pointers, and register allocation automatically."
      },
      num: {
        t: "Variable Scoping & Memory Allocation Models",
        h: ["Variable Scoping Model", "Memory Allocation Region", "Lifespan / Lifetime", "Resolution & Lookup Mechanism", "Primary Bug / Risk Vector"],
        r: [
          ["Local / Block-Scoped (`let`, `const`)", "Call Stack frame or CPU register", "Enclosing block / lexical scope", "Lexical environment record ($O(1)$ stack offset)", "Temporal Dead Zone (TDZ); accessing before declaration"],
          ["Function-Scoped (`var`)", "Enclosing function stack frame", "Entire function execution", "Hoisted to top of function scope", "Accidental hoisting pollution; loop closure binding bug"],
          ["Heap-Allocated Dynamic Variable", "Managed Garbage-Collected Heap", "Until all references are dropped", "Pointer dereference from stack or root set", "Memory leaks via unintended lingering reference retention"],
          ["Global Variable", "Static data segment / global object", "Application process lifetime", "Global scope dictionary lookup", "Namespace collisions; unconstrained concurrent mutations across modules"]
        ],
        n: "At the hardware and compiler layer, a variable is not a physical storage container, but a symbolic identifier mapped to an address in physical memory, a virtual memory page, or a hardware CPU register. In optimizing compilers (LLVM, GCC), variables are converted into Static Single Assignment (SSA) form, where each variable is assigned exactly once, allowing register allocators to use graph coloring algorithms to map variables directly to high-speed hardware registers (`RAX`, `RBX`, etc.) rather than memory. When variables escape the local function scope or exceed register capacity, they are spilled onto the call stack frame or allocated on the dynamic heap. Scope defines the visibility and lifetime of this binding: lexical (static) scoping resolves bindings based on physical position in source code ASTs, whereas dynamic scoping resolves bindings based on the runtime call stack."
      },
      miss: [
        {
          w: "A variable is literally a physical box in RAM that holds your data.",
          r: "Variables are compiler-level symbolic abstractions; modern optimizing compilers frequently optimize variables away entirely, inline their values, or keep them purely in CPU registers without ever touching RAM."
        },
        {
          w: "Declaring a variable with `var` in JavaScript is identical to declaring with `let`.",
          r: "`var` is function-scoped and hoisted with an initial value of `undefined`, whereas `let` is block-scoped and exists in a Temporal Dead Zone (TDZ) where accessing it before declaration throws a `ReferenceError`."
        },
        {
          w: "Reassigning a variable modifies the existing value in memory in-place.",
          r: "Reassigning an immutable primitive variable (like a number or string) binds the variable name to a brand-new value at a different memory location, rather than mutating the original memory in-place."
        },
        {
          w: "Global variables are harmless in small scripts and have no performance drawbacks.",
          r: "Global variables prevent compiler optimizations, cannot be garbage collected, cause race conditions in concurrent runtimes, and create namespace pollution across libraries."
        }
      ],
      trade: {
        buys: [
          "Human-readable abstraction: replaces raw hexadecimal memory addresses with meaningful domain identifiers.",
          "Automatic memory lifecycle: compilers automatically compute stack offsets and deallocate local memory upon scope exit.",
          "Lexical encapsulation: restricts data access to specific functions or blocks, preventing accidental mutations.",
          "Compiler optimization: enables register allocation, constant folding, and dead code elimination via SSA analysis."
        ],
        costs: [
          "Memory overhead: allocating excessive variables on the heap increases memory consumption and garbage collection churn.",
          "Scope shadowing confusion: declaring inner variables with the same name as outer variables leads to readability errors.",
          "Cognitive tracking load: mutable variables that change value over time increase mental debugging complexity.",
          "Concurrency race condition risk: shared mutable variables accessed across multiple threads require locking primitives."
        ],
        avoid: [
          "Using global variables to pass state between independent functions or modules.",
          "Reusing the same variable name for completely different data types across different parts of a function.",
          "Mutating variables when a pure, immutable computation with a new constant would be clearer.",
          "Relying on variable hoisting behaviors; always declare variables at the top of their intended block."
        ]
      }
    },
    {
      slug: "constant",
      why: {
        before: "Programs used standard mutable variables for fixed values (like mathematical constants, tax rates, or API endpoints), allowing any part of the codebase to inadvertently mutate the value at runtime.",
        problem: "Accidental reassignment of fixed values caused silent mathematical errors, security bypasses, and concurrency race conditions that were extraordinarily difficult to track down.",
        shift: "Modern programming languages introduced Constants (`const`, `final`, `val`, `constexpr`), creating immutable bindings that prevent reassignment at compile time and unlock aggressive compiler optimizations."
      },
      num: {
        t: "Constants Across Compilers & Runtimes",
        h: ["Constant Type / Keyword", "Immutability Guarantee", "Evaluation Timing", "Memory Allocation", "Primary Compiler Optimization"],
        r: [
          ["Compile-Time Constant (`constexpr` / `const` in Rust)", "Strict shallow & deep immutability", "Compile-time (evaluated by compiler)", "Zero RAM allocation; inlined directly into machine code", "Constant Folding & Propagation; dead branch removal"],
          ["Runtime Immutable Binding (`const` in JS)", "Shallow immutability (binding cannot be reassigned)", "Runtime execution initialization", "Standard stack or heap allocation", "Inline caching optimizations; prevents identifier de-opts"],
          ["Deep Immutable Record (`Object.freeze` / `Readonly`)", "Deep property mutation prevention", "Runtime execution initialization", "Heap allocated with runtime mutation checks", "Type-checker compile-time verification; runtime error on mutation"],
          ["Enum Constant", "Type-safe set of distinct named values", "Compile-time or module load", "Small integer or symbol table index", "Exhaustive pattern match checking; jump table generation"]
        ],
        n: "A constant enforces immutability at the binding level: once initialized, the identifier cannot be rebound to a different memory address or value. In compiled languages (C++, Rust, Go), compile-time constants (e.g., `constexpr` in C++ or `const` in Rust) undergo Constant Folding: mathematical operations like `const SECONDS = 60 * 60 * 24;` are evaluated by the compiler at build time, replacing the expression with the literal integer `86400` in the resulting machine binary with zero runtime calculation overhead. However, a crucial distinction exists between shallow binding immutability and deep value immutability: in languages like JavaScript, `const user = { name: 'Alice' };` prevents reassigning `user = {}`, but does *not* prevent mutating `user.name = 'Bob'` unless combined with `Object.freeze()`."
      },
      miss: [
        {
          w: "Declaring an object with `const` in JavaScript makes all of its internal properties immutable.",
          r: "`const` only makes the *variable binding* immutable (it cannot be reassigned); internal object properties can still be freely mutated unless frozen via `Object.freeze()`."
        },
        {
          w: "Constants make programs run slower because the runtime has to constantly check that the value hasn't changed.",
          r: "Constants make programs *faster*; because compilers know the value will never change, they perform constant propagation, inline the value into machine instructions, and eliminate dead branches."
        },
        {
          w: "Constants should only be used for universal mathematical laws like Pi or Speed of Light.",
          r: "Constants should be the default for virtually all variable declarations in modern software; variables should only be declared mutable (`let`) when reassignment is explicitly required."
        },
        {
          w: "You can re-declare or re-assign a constant inside an `if` block if the condition changes.",
          r: "Constants cannot be reassigned within their scope; conditional assignment requires ternary operators or initializing the constant from a helper function return value."
        }
      ],
      trade: {
        buys: [
          "Elimination of reassignment bugs: guarantees that values cannot be accidentally overwritten by errant code.",
          "Thread safety: immutable values can be shared across concurrent threads without locks or mutexes.",
          "Aggressive compiler optimizations: allows constant folding, instruction inlining, and dead code elimination.",
          "Reduced cognitive load: developers reading code know with certainty that the value never mutates."
        ],
        costs: [
          "Shallow immutability confusion: junior developers often falsely assume `const` freezes nested object properties.",
          "Verbosity for conditional setup: assigning a constant conditionally requires helper functions or ternary expressions.",
          "Memory reallocation overhead: transforming immutable objects requires copying memory rather than in-place mutation.",
          "Refactoring friction: converting a constant to a mutable variable requires changing the declaration keyword."
        ],
        avoid: [
          "Assuming `const arr = []` prevents developers from pushing items into the array (use `ReadonlyArray` or freeze).",
          "Defaulting to `let` or `var` when a value is never reassigned after initialization.",
          "Scattering raw magic numbers throughout code instead of extracting them into well-named constants.",
          "Attempting to catch runtime constant reassignment errors in production instead of catching them via TypeScript/linters."
        ]
      }
    },
    {
      slug: "data-type",
      why: {
        before: "At the physical hardware level, computer memory is just an undifferentiated, homogenous sequence of raw binary voltage levels (1s and 0s) with no inherent meaning.",
        problem: "Without a system to interpret bit sequences, the CPU cannot distinguish whether a 32-bit pattern represents an integer, a floating-point number, four ASCII characters, or an executable machine instruction, leading to catastrophic type confusion crashes.",
        shift: "Type Systems established Data Types: formal classifications defining the bit representation, memory layout, valid value ranges, and permissible mathematical operations for every piece of data."
      },
      num: {
        t: "Type System Dimensions & Classification Matrix",
        h: ["Type System Dimension", "Primary Mechanism", "Validation Timing", "Type Safety Guarantee", "Representative Languages"],
        r: [
          ["Static & Strong", "Variables have fixed types; implicit dangerous conversions banned", "Compile time", "High; prevents invalid operations and memory reinterpretations", "Rust, Haskell, Go, Java, Swift"],
          ["Static & Weak", "Types checked at compile time, but allows unsafe pointer casting", "Compile time", "Low; permits reinterpret-casts and raw memory arithmetic", "C, C++"],
          ["Dynamic & Strong", "Values carry runtime type tags; type errors throw exceptions", "Runtime execution", "Moderate; prevents memory corruption, but errors surface at runtime", "Python, Ruby, Elixir"],
          ["Dynamic & Weak", "Values carry runtime tags; engine aggressively coerces types implicitly", "Runtime execution", "Lowest; bizarre implicit coercions (e.g. `[] + {} == '[object Object]'`)", "JavaScript, PHP (legacy), Perl"]
        ],
        n: "A data type performs two critical functions: (1) memory layout definition (determining how many bytes of memory are allocated, such as 1 byte for an `int8` versus 8 bytes for a `float64`), and (2) semantic operation constraints (dictating which operations are mathematically legal, such as allowing division on integers while forbidding division on string text). In statically typed languages, type checking is performed ahead of time by a type-checker using algorithms like Hindley-Milner type inference, mapping variables to machine registers with zero runtime type tags. In dynamic languages, every value in memory is wrapped in a 'Box' or 'NaN-boxed' pointer containing a type tag (e.g. 3 bits identifying whether the payload is an integer, object pointer, boolean, or string), incurring runtime memory overhead and continuous type-checking branches during execution."
      },
      miss: [
        {
          w: "Static typing and strong typing are identical concepts.",
          r: "Static vs Dynamic describes *when* types are checked (compile-time vs runtime); Strong vs Weak describes *how strictly* the language enforces type boundaries without implicit type coercion."
        },
        {
          w: "Dynamic languages have no types.",
          r: "Dynamic languages are fully typed; the crucial difference is that types belong to the *values* at runtime, rather than being attached to the *variable identifiers* at compile time."
        },
        {
          w: "TypeScript provides 100% runtime type safety in production JavaScript environments.",
          r: "TypeScript types are erased completely at compile time; runtime environments execute raw JavaScript, meaning external API payloads or unvalidated inputs can violate TypeScript types at runtime."
        },
        {
          w: "Data types have no impact on application memory consumption or CPU cache performance.",
          r: "Choosing a 64-bit integer (`int64`) over an 8-bit byte (`uint8`) in an array of 10 million elements wastes 56 megabytes of RAM and causes severe CPU L1/L2 cache misses."
        }
      ],
      trade: {
        buys: [
          "Compile-time defect prevention: eliminates entire classes of runtime crashes (e.g. 'undefined is not a function').",
          "Superior hardware performance: allows compilers to emit unboxed native CPU instructions without runtime type tags.",
          "Self-documenting codebases: function signatures explicitly declare accepted inputs and outputs, easing maintenance.",
          "Confident automated refactoring: changing a type immediately triggers compiler errors at every broken call site."
        ],
        costs: [
          "Upfront syntactic verbosity: requires writing type annotations and generic constraints (mitigated by type inference).",
          "Initial development latency: satisfying complex static type-checkers (e.g. Rust borrow checker) takes more upfront time.",
          "Compilation time overhead: complex type checking and generic expansion adds latency to software builds.",
          "Rigidity with heterogeneous data: handling highly dynamic, unpredictable JSON payloads requires complex validation schemas."
        ],
        avoid: [
          "Bypassing static type-checkers by sprinkling `any` or `unsafe` throughout the codebase.",
          "Relying on implicit type coercion in dynamic languages (e.g. using `==` instead of `===` in JavaScript).",
          "Using primitive types (strings, ints) for complex domain concepts instead of formal custom types (Primitive Obsession).",
          "Trusting external untrusted JSON payloads at runtime without parsing them through validation schemas (e.g. Zod)."
        ]
      }
    },
    {
      slug: "string",
      why: {
        before: "Early computers represented text using 7-bit ASCII or regional character encodings (ISO-8859, Shift-JIS), which could only represent a tiny subset of characters and corrupted multilingual text ('Mojibake').",
        problem: "Representing global languages (Chinese, Arabic, emoji) was impossible within a single document; byte lengths did not match character counts, causing buffer overflows and truncated text.",
        shift: "The Unicode Consortium and Ken Thompson/Rob Pike created Unicode and UTF-8: establishing a universal character set mapping every symbol in human history to unique Code Points, encoded compactly in variable-length byte sequences."
      },
      num: {
        t: "Text Encoding & String Representation Standards",
        h: ["Encoding / Architecture", "Byte Length per Character", "Backward Compatibility", "Memory Footprint", "Character Indexing Complexity"],
        r: [
          ["ASCII", "Strictly 1 byte (7 bits used; 0 - 127)", "Native baseline for all computing", "Minimal (1 byte per char)", "$O(1)$ constant time byte/char indexing; English only"],
          ["UTF-8 (Web Standard)", "Variable: 1 to 4 bytes per Code Point", "100% backward compatible with ASCII", "Optimal for Western text; compact storage", "$O(N)$ linear scanning to find the $N$-th visible character"],
          ["UTF-16", "Variable: 2 or 4 bytes (Surrogate Pairs)", "Incompatible with ASCII; requires BOM", "High for Western text; doubles ASCII size", "$O(1)$ for BMP code units, but $O(N)$ for surrogate pairs/emojis"],
          ["UTF-32", "Fixed: strictly 4 bytes per Code Point", "Incompatible with ASCII", "Massive (4x memory bloat for Latin text)", "$O(1)$ constant time indexing by Code Point, but ignores grapheme clusters"],
          ["Grapheme Clusters (Extended)", "Variable sequence of code points + ZWJ", "Unicode standard for human visual characters", "Varies based on skin tones, flags, modifiers", "Requires complex Unicode segmentation algorithms (UAX #29)"]
        ],
        n: "In modern software systems, a string is an immutable sequence of Unicode Code Points encoded as bytes. A fundamental mistake in string manipulation is confusing three distinct concepts: (1) Bytes (raw memory storage units), (2) Code Points (the formal Unicode integer identifier, e.g. `U+1F468` for 'man'), and (3) Grapheme Clusters (what a human perceives as a single visual character on screen). For example, the family emoji '👨‍👩‍👧‍👦' is a single visible grapheme cluster, but it consists of 4 distinct emoji code points glued together with 3 Zero-Width Joiner (ZWJ, `U+200D`) characters, occupying 7 Unicode code points and 25 raw bytes in UTF-8. In memory, strings are typically immutable: modifying a string creates a new string in memory. To prevent quadratic $O(N^2)$ memory copying during frequent string concatenations, runtimes employ Ropes, string builders, or intern pools."
      },
      miss: [
        {
          w: "One character in a string is always exactly one byte of memory.",
          r: "In UTF-8, characters consume between 1 and 4 bytes; emoji and complex scripts (combining accents, flags) can consume over 20 bytes for a single human-visible character."
        },
        {
          w: "String `.length` in JavaScript or Python returns the number of visible characters you see on screen.",
          r: "In JavaScript, `.length` returns the count of 16-bit UTF-16 code units, meaning emojis return a length of 2 or more; human-visible grapheme count requires an Intl segmenter (`Intl.Segmenter`)."
        },
        {
          w: "Strings in modern languages like Python and JavaScript can be mutated in-place like arrays.",
          r: "Strings are strictly immutable in Python, JavaScript, Java, and C#; operations like `.toUpperCase()` or string replacement return brand-new string objects in memory."
        },
        {
          w: "Comparing two strings with `==` compares the physical memory addresses of the strings.",
          r: "In languages like Python and JavaScript, string comparison checks value equality (comparing characters lexicographically); in languages like Java, `==` compares object references while `.equals()` compares values."
        }
      ],
      trade: {
        buys: [
          "Universal internationalization: Unicode support allows software to seamlessly handle all human languages, scripts, and emojis.",
          "Thread safety via immutability: immutable strings can be shared across concurrent threads without locks or race conditions.",
          "String interning optimization: runtimes deduplicate identical string literals in memory, enabling pointer-equality comparisons.",
          "Human readability: provides the primary medium for user-facing communication, APIs, and structured data formats (JSON, HTML)."
        ],
        costs: [
          "Indexing complexity: variable-length UTF-8 encodings make random-access character indexing $O(N)$ rather than $O(1)$.",
          "Memory allocation churn: repeated concatenations in tight loops create thousands of temporary string objects, stressing GC.",
          "Security vulnerability habitat: unvalidated strings are the attack vector for SQL Injection, XSS, and command injection.",
          "Normalization pitfalls: identical-looking characters can have different Unicode byte representations (e.g. NFC vs NFD forms)."
        ],
        avoid: [
          "Concatenating strings inside large loops using `+` (use an array join, StringBuilder, or list append).",
          "Truncating strings at arbitrary byte boundaries, which splits multi-byte UTF-8 sequences and corrupts text into replacement characters ().",
          "Using string comparison for sensitive data (like passwords/tokens) without constant-time comparison to prevent timing attacks.",
          "Assuming `.length` accurately measures human-visible character counts for UI layout rendering."
        ]
      }
    },
    {
      slug: "integer",
      why: {
        before: "Early mechanical and analog computers used decimal gear wheels or discrete voltage levels, which were fragile, drifted with temperature, and could not reliably scale computation.",
        problem: "Representing signed negative numbers using sign-and-magnitude created dual representations of zero (`+0` and `-0`), requiring complex, inefficient hardware ALU circuits for basic addition and subtraction.",
        shift: "Computer hardware adopted Two's Complement binary representation: an elegant mathematical system where addition, subtraction, and signed arithmetic are executed on identical CPU ALU circuits with zero redundant zeros."
      },
      num: {
        t: "Integer Bit Widths & Value Ranges (Two's Complement)",
        h: ["Integer Type", "Bit Width / Storage", "Signed Value Range (Two's Complement)", "Unsigned Value Range", "Primary Architectural Use Case"],
        r: [
          ["8-bit (`int8` / `byte`)", "1 byte (8 bits)", "$-128$ to $+127$", "$0$ to $255$", "Raw byte stream buffers, image pixel color channels, network packets"],
          ["16-bit (`int16` / `short`)", "2 bytes (16 bits)", "$-32,768$ to $+32,767$", "$0$ to $65,535$", "Audio PCM samples, sensor telemetry, legacy hardware registers"],
          ["32-bit (`int32` / `int`)", "4 bytes (32 bits)", "$-2,147,483,648$ to $+2,147,483,647$ (~2.14B)", "$0$ to $4,294,967,295$ (~4.29B)", "Standard integer for loop counters, array indices, IPv4 addresses"],
          ["64-bit (`int64` / `long`)", "8 bytes (64 bits)", "$-9.22 \\times 10^{18}$ to $+9.22 \\times 10^{18}$", "$0$ to $1.84 \\times 10^{19}$", "Database primary keys, microsecond Unix timestamps, memory pointers"],
          ["Arbitrary Precision (BigInt)", "Variable (dynamically allocated array)", "Bounded only by available system RAM", "Bounded only by available system RAM", "Cryptography (RSA/ECC keys), financial ledgers, blockchain calculations"]
        ],
        n: "Integers in digital computing are represented using Two's Complement binary arithmetic. In an $n$-bit two's complement integer, the most significant bit (MSB) acts as a negative weight ($-2^{n-1}$). To negate an integer, the CPU inverts all bits (one's complement) and adds 1: $-x = \\sim x + 1$. This mathematical formulation guarantees a single unique representation of zero (`00000000`), eliminates special-case subtraction logic (subtraction is simply addition of the negated operand), and enables high-speed ALU pipelining. However, integers are subject to 'Integer Overflow': if a program adds 1 to the maximum 32-bit signed integer ($2,147,483,647$), the bits roll over into the negative sign bit, wrapping around to $-2,147,483,648$. In languages like C, signed overflow is Undefined Behavior; in Rust, it triggers a panic in debug mode; while in JavaScript, all standard numbers are 64-bit floats, safe only up to $2^{53} - 1$ (`Number.MAX_SAFE_INTEGER`)."
      },
      miss: [
        {
          w: "JavaScript numbers are standard 32-bit integers by default.",
          r: "JavaScript has no standard integer type; all numbers in JS are 64-bit IEEE 754 floating-point doubles, safe only up to $2^{53} - 1$ ($9,007,199,254,740,991$) unless using `BigInt`."
        },
        {
          w: "When an integer overflows, the program automatically crashes with an error.",
          r: "In C, C++, and standard production binaries, integers silently wrap around (e.g. $255 + 1 = 0$ in an 8-bit unsigned integer) without warnings, causing critical financial and security bugs."
        },
        {
          w: "Signed and unsigned integers of the same bit width require different CPU addition hardware.",
          r: "Two's complement ensures that the exact same binary adder circuit adds both signed and unsigned integers; the CPU only checks different overflow flags (Carry vs Overflow)."
        },
        {
          w: "Using 64-bit integers everywhere has zero performance cost compared to 32-bit integers.",
          r: "64-bit integers double memory usage in arrays, cutting CPU cache line density in half and reducing SIMD vectorization throughput by 50% compared to 32-bit integers."
        }
      ],
      trade: {
        buys: [
          "Exact mathematical precision: guarantees zero rounding errors or precision drift, essential for financial and counting logic.",
          "Peak hardware execution speed: modern CPUs execute integer addition, subtraction, and bitwise logic in a single clock cycle.",
          "Minimal memory consumption: small bit-width integers (`int8`, `int16`) allow packing millions of values into tiny memory buffers.",
          "Efficient bitwise operations: enables fast bitwise masking, hashing, and boolean flag combinations."
        ],
        costs: [
          "Overflow and underflow risks: exceeding bit-width boundaries causes silent wrap-around or runtime panics.",
          "Truncation on division: integer division truncates fractions (e.g. $7 / 2 = 3$), which can introduce subtle rounding defects.",
          "Dynamic range limitations: fixed-width integers cannot represent astronomical or microscopic quantities (requires floating-point).",
          "Type conversion friction: mixing signed and unsigned integers of different widths requires explicit casting to prevent bugs."
        ],
        avoid: [
          "Using 32-bit integers for database auto-incrementing primary keys on high-traffic tables (exhausts 2.14B IDs, causing outages).",
          "Relying on standard JavaScript `Number` to parse 64-bit database IDs or Twitter IDs (use `BigInt` or strings to avoid truncation).",
          "Assuming integer arithmetic will automatically check for overflow in production C/C++ binaries.",
          "Subtracting unsigned integers where the result could be negative, causing massive wrap-around values (e.g. $0 - 1 = 4,294,967,295$)."
        ]
      }
    },
    {
      slug: "floating-point-number",
      why: {
        before: "Early computers used fixed-point arithmetic (fixed number of decimal places), which had a severely restricted dynamic range and could not simultaneously represent astronomical planetary distances and microscopic atomic measurements.",
        problem: "Fixed-point calculations frequently underflowed to zero or overflowed to infinity; different computer manufacturers used idiosyncratic, incompatible floating-point hardware that gave different answers to the same scientific equations.",
        shift: "William Kahan led the IEEE 754 Standard for Floating-Point Arithmetic in 1985: standardizing binary scientific notation across sign, exponent, and mantissa bits, ensuring identical floating-point results across all computer hardware."
      },
      num: {
        t: "IEEE 754 Floating-Point Formats & Bit Layouts",
        h: ["Precision Format", "Total Bits (Sign / Exponent / Fraction)", "Significant Decimal Digits", "Approximate Dynamic Range", "Primary Engineering Domain"],
        r: [
          ["Half Precision (FP16)", "16 bits (1 / 5 / 10)", "~3 - 4 decimal digits", "$6.10 \\times 10^{-5}$ to $65,504$", "Deep learning AI model training and GPU inference"],
          ["Brain Floating Point (BF16)", "16 bits (1 / 8 / 7)", "~2 - 3 decimal digits", "$1.17 \\times 10^{-38}$ to $3.39 \\times 10^{38}$ (same as FP32)", "Modern LLM training (preserves FP32 range with half memory)"],
          ["Single Precision (FP32 / `float`)", "32 bits (1 / 8 / 23)", "~7 decimal digits", "$1.18 \\times 10^{-38}$ to $3.40 \\times 10^{38}$", "3D graphics rendering, physics engines, general scientific compute"],
          ["Double Precision (FP64 / `double`)", "64 bits (1 / 11 / 52)", "~15 - 17 decimal digits", "$2.23 \\times 10^{-308}$ to $1.79 \\times 10^{308}$", "Default in JS/Python; financial modeling, aerospace navigation"],
          ["Special Values (NaN / Inf)", "Exponent all 1s", "N/A (Represents $0/0$, $\\sqrt{-1}$, or overflow)", "N/A", "Hardware exception signaling; non-halting error propagation"]
        ],
        n: "The IEEE 754 standard represents real numbers using binary scientific notation: $V = (-1)^s \\times (1 + m) \\times 2^{e - \\text{bias}}$, where $s$ is the sign bit, $m$ is the fractional mantissa (significand), and $e$ is the biased exponent. The fundamental limitation of binary floating-point arithmetic is that numbers with clean decimal representations (like $0.1$ or $0.2$) cannot be represented as finite binary fractions, just as $1/3$ cannot be represented as a finite decimal ($0.3333...$). In binary, $0.1$ is an infinite repeating sequence ($0.0001100110011..._2$). When rounded to 53 bits of precision in a 64-bit float, $0.1 + 0.2$ produces $0.3000000000000000444...$. Consequently, direct equality comparisons (`0.1 + 0.2 == 0.3`) evaluate to `false`, requiring tolerance-based epsilon comparisons ($|a - b| < \\epsilon$)."
      },
      miss: [
        {
          w: "The fact that `0.1 + 0.2 != 0.3` is a bug in JavaScript or Python.",
          r: "It is not a bug; it is a fundamental mathematical property of IEEE 754 binary floating-point representation implemented by hardware CPUs across all programming languages."
        },
        {
          w: "Floating-point numbers should be used to store financial currency balances and monetary transactions.",
          r: "Floating-point rounding errors accumulate and corrupt financial ledgers; financial systems must use integer cents (e.g. $1000 for $10.00) or arbitrary-precision decimal types (e.g. `BigDecimal`)."
        },
        {
          w: "A 64-bit float has the same precision across all numbers throughout its entire dynamic range.",
          r: "Precision is relative: floats have immense precision near zero, but as numbers grow large, the gap between representable numbers (ULP - Unit in the Last Place) widens; past $2^{53}$, floats cannot even represent odd integers."
        },
        {
          w: "NaN (Not a Number) is equal to itself in conditional checks (`NaN == NaN`).",
          r: "Under IEEE 754, `NaN` is explicitly defined to never be equal to any value, including itself (`NaN == NaN` is always `false`); detection requires `Number.isNaN()` or `math.isnan()`."
        }
      ],
      trade: {
        buys: [
          "Colossal dynamic range: represents microscopic subatomic measurements and galactic distances within a compact 32-bit or 64-bit footprint.",
          "Hardware acceleration: modern CPUs and GPUs contain dedicated FPU (Floating Point Unit) hardware executing teraFLOPS.",
          "Non-halting error propagation: operations like division by zero produce `Infinity` or `NaN` rather than crashing the hardware.",
          "Standardized international reproducibility: IEEE 754 ensures identical mathematical results across Intel, AMD, ARM, and Apple chips."
        ],
        costs: [
          "Representation rounding errors: cannot represent common decimal fractions ($0.1, 0.2, 0.7$) exactly in binary.",
          "Direct equality comparison danger: testing `if (a == b)` fails due to rounding drift, requiring epsilon tolerance checks.",
          "Accumulated precision drift: compounding floating-point additions over millions of iterations causes catastrophic cancellation.",
          "Unsuitable for financial ledgers: rounding errors violate regulatory banking standards and corrupt balance sheets."
        ],
        avoid: [
          "Storing money, prices, or account balances in floating-point fields (use integer minor units or `Decimal`).",
          "Comparing two floating-point numbers using strict equality `==` (use `Math.abs(a - b) < Number.EPSILON`).",
          "Adding a very small floating-point number to a very large floating-point number, where the small number gets completely lost (swallowed).",
          "Checking if a value is NaN using `x === NaN` (always use `Number.isNaN(x)`)."
        ]
      }
    },
    {
      slug: "boolean",
      why: {
        before: "Early mechanical calculating engines and multi-valued logic systems attempted to represent complex logic using decimal numbers (0 through 9) or ternary logic (three states), leading to fragile electronic circuits.",
        problem: "Multi-state logic circuits were vulnerable to electrical noise and voltage drift; deciding control flow was mathematically complex and lacked a unified algebraic foundation.",
        shift: "George Boole formulated Boolean Algebra in 1847 (later connected to electronic switching circuits by Claude Shannon in 1937), establishing binary two-valued logic (`true` and `false`) as the fundamental foundation of digital computing."
      },
      num: {
        t: "Boolean Algebra Operators & Hardware Gate Equivalents",
        h: ["Boolean Operator", "Algebraic Notation", "Truth Condition", "Hardware Logic Gate", "De Morgan's Dual Law"],
        r: [
          ["Logical AND (`&&`)", "$A \\land B$ or $A \\cdot B$", "True if and only if BOTH operands are true", "AND Gate (transistors in series)", "$\\neg(A \\land B) \\iff \\neg A \\lor \\neg B$"],
          ["Logical OR (`||`)", "$A \\lor B$ or $A + B$", "True if EITHER operand (or both) is true", "OR Gate (transistors in parallel)", "$\\neg(A \\lor B) \\iff \\neg A \\land \\neg B$"],
          ["Logical NOT (`!`)", "$\\neg A$ or $\\bar{A}$", "Inverts truth value (true becomes false, false becomes true)", "Inverter / NOT Gate", "$\\neg(\\neg A) \\iff A$ (Involution Law)"],
          ["Exclusive OR (XOR `^`)", "$A \\oplus B$", "True if exactly ONE operand is true, but NOT both", "XOR Gate (Half-adder logic)", "$(A \\lor B) \\land \\neg(A \\land B)$"],
          ["NAND / NOR Gates", "$\\neg(A \\cdot B)$ / $\\neg(A + B)$", "Functional completeness (can synthesize any logic circuit)", "NAND / NOR Flash Memory", "Universal logic primitives powering all modern microprocessors"]
        ],
        n: "In digital computer architecture, a boolean is a data type that has one of two possible values: `true` or `false`, representing binary 1 and 0. While a single bit is theoretically sufficient to represent a boolean value, modern computer hardware addresses memory in byte boundaries (8 bits). Consequently, a boolean variable in languages like C, C++, and Java typically occupies 1 full byte (8 bits) of memory because CPUs cannot natively address individual sub-byte bits without bit-masking instructions. In performance-critical engineering where memory density is paramount (e.g. database Bloom filters or graph visited bitsets), developers use 'Bitfields' or 'Bitmaps' (such as `std::vector<bool>` or `BitSet`), packing 8 distinct boolean values into a single byte of memory through bitwise shift (`>>`, `<<`) and mask (`&`, `|`) operations."
      },
      miss: [
        {
          w: "A boolean variable in memory always takes up exactly 1 bit of RAM.",
          r: "CPUs are byte-addressable and cannot read a single isolated bit from RAM; booleans typically occupy 1 full byte (8 bits) or 4 bytes in memory alignment unless packed into a bitfield."
        },
        {
          w: "Writing `if (isValid == true)` is better and safer than writing `if (isValid)`.",
          r: "Comparing against `== true` is redundant, less readable, and in dynamic languages like JavaScript can cause bizarre bugs due to implicit coercion rules."
        },
        {
          w: "Short-circuit evaluation of booleans is just an optional performance hint that compilers can ignore.",
          r: "Short-circuit evaluation is a strict language specification guarantee: in `A && B`, if `A` is false, `B` is *guaranteed* never to be evaluated, which is essential for safe null-guards (`user && user.name`)."
        },
        {
          w: "Bitwise operators (`&`, `|`) and logical operators (`&&`, `||`) are completely interchangeable.",
          r: "Logical operators short-circuit and operate on boolean truth; bitwise operators evaluate both operands, operate bit-by-bit on integer bit patterns, and never short-circuit."
        }
      ],
      trade: {
        buys: [
          "Definitive binary decision branching: powers all conditional routing (`if/else`, loops) across digital software.",
          "Formal mathematical foundations: enables formal logic proofs, SAT solvers, and circuit synthesis via Boolean algebra.",
          "Short-circuit evaluation safety: enables safe guard clauses where secondary expressions evaluate only if preconditions hold.",
          "Ultra-compact bitfield representation: pack 64 distinct boolean state flags into a single 64-bit integer."
        ],
        costs: [
          "Memory overhead in standard types: storing a single boolean as a full byte wastes 7 out of 8 bits of allocated RAM.",
          "Implicit type coercion traps: languages with weak typing produce subtle bugs when coercing non-booleans (truthy/falsy).",
          "Excessive flag parameter smell: passing multiple boolean flags to a function (`init(true, false, true)`) destroys code readability.",
          "Combinatorial state explosion: every boolean flag doubles the number of possible application states ($2^N$ states for $N$ flags)."
        ],
        avoid: [
          "Writing verbose comparisons like `if (isReady === true)` instead of the idiomatic `if (isReady)`.",
          "Passing raw boolean flags to functions where an enum or options object would communicate intent clearly (`sendEmail(true)`).",
          "Creating complex, unreadable compound boolean expressions without applying De Morgan's laws or extracting named helper variables.",
          "Confusing bitwise operators (`&`, `|`) with logical short-circuit operators (`&&`, `||`)."
        ]
      }
    },
    {
      slug: "null-and-undefined",
      why: {
        before: "Early programming languages used raw memory pointers where uninitialized variables held whatever garbage bytes previously occupied that memory address, or used magic numbers (like `-1` or `9999`) to signify absent data.",
        problem: "Dereferencing garbage pointers crashed programs with segmentation faults; magic numbers were accidentally included in mathematical averages and calculations, corrupting data silently.",
        shift: "Sir Tony Hoare introduced `null` in ALGOL W in 1965 to represent the absence of a value (which he later famously called his 'Billion-Dollar Mistake'); modern systems distinguish intentional absence (`null`) from uninitialized absence (`undefined`), or replace them with `Option`/`Maybe` monads."
      },
      num: {
        t: "Null, Undefined & Absence Representation Across Languages",
        h: ["Absence Primitive / Model", "Language Context", "Underlying Machine Representation", "Semantic Meaning", "Safe Handling Mechanism"],
        r: [
          ["`undefined`", "JavaScript, TypeScript", "Unique internal runtime singleton primitive", "Variable declared but has not yet been assigned a value", "Optional chaining (`?.`), Nullish coalescing (`??`)"],
          ["`null`", "JS, Java, C#, Python (`None`), Go (`nil`)", "Null pointer address (`0x0` or typed tagged pointer)", "Intentional, explicit representation of 'no value' or empty object", "Strict null checks, Non-null assertions, `@NonNull` annotations"],
          ["`Option<T>` / `Maybe`", "Rust, Haskell, Scala, Swift", "Tagged union enum (`Some(value)` vs `None`)", "Absence made explicit in type system; compiler enforces handling", "Pattern matching (`match`), monadic combinators (`map`, `and_then`)"],
          ["Null Object Pattern", "Object-Oriented Design", "Polymorphic class implementing interface with no-op methods", "Provides default neutral behavior without null checks", "Call methods directly without checking for null"]
        ],
        n: "The representation of 'nothing' is one of the most fraught concepts in computer science. In languages with raw pointers (C/C++), `NULL` is simply the memory address `0x0`. When an application attempts to read or write to address zero, the hardware Memory Management Unit (MMU) detects a page fault (since page zero is intentionally unmapped in virtual memory), triggering a CPU interrupt that results in a catastrophic Segmentation Fault (`SIGSEGV`). In managed runtimes, attempting to access a property on an uninitialized reference throws `NullPointerException` (Java) or `TypeError: Cannot read properties of undefined` (JavaScript). In JavaScript, a historical quirk distinguishes `undefined` (the engine's default for unassigned variables, missing parameters, and non-existent object keys) from `null` (an explicit value assigned by a developer to denote intentional emptiness). Modern languages eliminate null entirely using algebraic `Option<T>` types, making absence a compile-time checked contract."
      },
      miss: [
        {
          w: "`null` and `undefined` in JavaScript are identical and can be used completely interchangeably.",
          r: "`undefined` means a variable has been declared but never assigned a value; `null` is an explicit assignment indicating an intentional absence of an object value; `typeof null === 'object'` while `typeof undefined === 'undefined'`."
        },
        {
          w: "Checking `if (val)` is the best way to check if a variable is not null.",
          r: "Falsy checks fail if `val` contains legitimate falsy values like `0`, `\"\"`, or `false`; check explicitly using `val !== null && val !== undefined` or the nullish operator `val != null`."
        },
        {
          w: "Enabling strict null checks in TypeScript prevents all null pointer errors in production.",
          r: "TypeScript type checks compile-time contracts, but runtime data from external API responses or database queries can still contain unexpected null values that bypass TypeScript assumptions."
        },
        {
          w: "Using the non-null assertion operator (`user!.name`) is a safe way to clean up TypeScript compiler warnings.",
          r: "The `!` operator merely tells the compiler to 'shut up' without fixing the runtime risk; if the value is null at runtime, the application crashes immediately."
        }
      ],
      trade: {
        buys: [
          "Explicit representation of absence: provides a standard way to represent missing, uninitialized, or optional data.",
          "Distinction between omitted and empty: in JS, distinguishes between an unprovided parameter (`undefined`) and explicit null (`null`).",
          "Low runtime footprint: null pointers and tagged undefined singletons consume minimal memory in runtime engines.",
          "Short-circuit ergonomics: modern syntax (`?.`, `??`) allows clean traversing of deeply nested optional data structures."
        ],
        costs: [
          "The 'Billion-Dollar Mistake': forgotten null checks cause the single most common category of production crashes globally.",
          "Defensive boilerplate code: functions get cluttered with repetitive null checks (`if (x == null) return;`).",
          "Dual absence confusion: having both `null` and `undefined` in JavaScript introduces continuous developer confusion.",
          "JSON serialization anomalies: `undefined` properties are silently stripped during `JSON.stringify()`, while `null` is preserved."
        ],
        avoid: [
          "Silencing TypeScript compiler null errors with the non-null assertion operator `!` without validating data.",
          "Using standard falsy checks (`if (!count)`) when `0` is a valid input value.",
          "Assigning `undefined` manually to object properties (use `null` for intentional emptiness, or delete the key).",
          "Returning `null` from functions when an empty collection (empty array `[]` or set) would eliminate caller null checks."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
