(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "conditional",
      why: {
        before: "Early electromechanical and linear calculation engines could only execute rigid, unconditional sequences of punch cards from start to finish, incapable of adapting behavior to variable input data.",
        problem: "Linear execution could not handle exceptions, edge cases, or divergent business logic; programs had to be physically reconfigured for different operational conditions.",
        shift: "Ada Lovelace and Alan Turing conceptualized conditional branching, implemented in modern languages as Conditional Statements (`if-else`, `switch-case`, pattern matching), allowing software to alter its execution path based on runtime boolean predicates."
      },
      num: {
        t: "Conditional Branching Architectures & Execution Models",
        h: ["Branching Construct", "Hardware / Machine Execution", "Algorithmic Complexity", "Branch Prediction Behavior", "Optimal Use Case"],
        r: [
          ["`if-else` Chain", "Conditional jump instructions (`JZ`, `JNZ`, `JNE`)", "$O(N)$ sequential condition evaluation", "Branch Target Buffer (BTB) tracks history; pipeline stall on miss", "Boolean predicates, non-contiguous range checks, complex logical tests"],
          ["`switch-case` (Dense Keys)", "Jump Table / Indirect Branch Table (array of code pointers)", "$O(1)$ constant time direct index dispatch", "Indirect branch predictor; high prediction rate for consistent targets", "Enum values, contiguous integers, opcode dispatch loops"],
          ["`switch-case` (Sparse Keys)", "Binary Search Tree of comparisons or hash lookup", "$O(\\log N)$ comparison bisection", "Multiple dependent branch predictions", "Sparse integer codes, non-sequential status IDs"],
          ["Pattern Matching (Rust / Scala)", "Algebraic Data Type exhaustiveness check at compile time", "$O(1)$ to $O(\\log N)$ optimized dispatch", "Compiler optimizes into jump table or decision tree", "Destructuring tagged unions, AST node traversal, complex domain states"]
        ],
        n: "At the CPU hardware layer, conditionals are executed via conditional branch instructions (`JE`, `JNE`, `JG`). In modern pipelined microprocessors (which execute 15 to 20 stages of instructions concurrently), waiting for the result of a conditional predicate before fetching the next instruction would cause catastrophic CPU pipeline bubbles (stalls). To maintain throughput, CPUs use Branch Predictors backed by Branch History Tables (BHT) to speculatively execute instructions down the predicted path. If the prediction is correct, execution continues at peak speed; if a 'Branch Misprediction' occurs, the CPU must flush its entire speculative pipeline (wasting 15-20 clock cycles) and restart down the alternate path. For this reason, optimizing compilers often convert simple conditionals into branchless machine instructions, such as Conditional Moves (`CMOV`) or bitwise masks."
      },
      miss: [
        {
          w: "A `switch` statement is always identical in performance to a long chain of `if-else` statements.",
          r: "A compiler can compile a dense `switch` into an $O(1)$ jump table (a single direct array lookup of code pointers), whereas an `if-else` chain requires $O(N)$ sequential branch evaluations."
        },
        {
          w: "Conditionals have zero hardware performance cost because modern CPUs run at gigahertz speeds.",
          r: "Branch mispredictions flush the CPU instruction pipeline, causing significant latency spikes in tight loops (e.g. processing unsorted arrays can run 3x slower than sorted arrays due to branch mispredicts)."
        },
        {
          w: "Writing deeply nested `if` statements 6 levels deep is completely fine as long as the logic is correct.",
          r: "Deep nesting creates astronomical cyclomatic complexity, dramatically increases the probability of unhandled edge-case paths, and can be refactored into clean early returns and guard clauses."
        },
        {
          w: "Pattern matching is just syntactic sugar for a standard `switch` statement.",
          r: "Pattern matching combines value matching, type narrowing, structural destructuring of inner properties, and compile-time exhaustiveness guarantees that `switch` lacks."
        }
      ],
      trade: {
        buys: [
          "Dynamic algorithmic adaptability: enables software to make intelligent, context-aware decisions based on runtime state.",
          "Error isolation and boundary protection: guards against invalid inputs, division by zero, and unauthenticated requests.",
          "Polymorphic branching: replaces rigid procedural code with expressive domain routing.",
          "Hardware optimization potential: compilers can emit branchless conditional move (`CMOV`) instructions for simple branches."
        ],
        costs: [
          "Branch misprediction latency: unpredictable branches in inner computational loops degrade CPU execution pipeline throughput.",
          "Cyclomatic complexity explosion: every conditional branch doubles the number of test paths required for 100% test coverage.",
          "Arrow Anti-Pattern liability: nested conditionals create unreadable, pyramid-shaped code blocks that confuse reviewers.",
          "Fallthrough bugs: traditional `switch` statements without explicit `break` statements cause accidental fallthrough execution."
        ],
        avoid: [
          "Leaving out the `default` case in `switch` statements or failing to enforce compile-time exhaustiveness.",
          "Nesting conditionals 4+ levels deep (use guard clauses and early returns to flatten control flow).",
          "Writing conditionals with complex, negated compound boolean logic instead of extracting clear named boolean variables.",
          "Accidentally creating fallthrough bugs in `switch` blocks by forgetting the `break` statement."
        ]
      }
    },
    {
      slug: "ternary-operator",
      why: {
        before: "Assigning a value based on a condition required writing a multi-line `if-else` statement, requiring developers to declare a mutable variable using `let` before initializing it inside the branch.",
        problem: "Multi-line statements introduced unnecessary mutable state (`let`), bloated line counts for simple assignments, and prevented conditional values from being passed directly as inline function arguments.",
        shift: "Christopher Strachey introduced the Ternary Conditional Operator (`condition ? expr1 : expr2`) in CPL (1963): a three-operand expression that evaluates a condition and yields one of two values inline, preserving immutable `const` declarations."
      },
      num: {
        t: "Ternary Operator vs If-Else Statement Comparison",
        h: ["Dimension", "Ternary Operator (`? :`)", "If-Else Statement (`if {} else {}`)", "Primary Structural Advantage", "Readability Limit"],
        r: [
          ["Grammar Classification", "Expression (evaluates directly to a value)", "Statement (controls block execution flow)", "Ternary can be assigned to `const` or passed as argument", "1 simple condition; unreadable if nested"],
          ["Immutability Support", "Direct assignment to `const` identifier", "Requires uninitialized `let` variable outside block", "Enforces immutable bindings; prevents reassignment", "N/A"],
          ["Inline JSX / Templating", "Supported natively inside `{ condition ? A : B }`", "Illegal inside JSX expression brackets", "Enables clean declarative UI conditional rendering", "Keep branches concise; extract sub-components if bulky"],
          ["Side Effects", "Discouraged; should evaluate pure values", "Standard vehicle for executing side-effecting code", "If-else is superior when calling void/mutating methods", "Never use ternary purely for side effects (`c ? fn1() : fn2()`)"]
        ],
        n: "The ternary operator is the only three-operand (ternary arity) operator in most programming languages. Its formal syntax is: `Predicate ? Consequent : Alternative`. Crucially, like logical operators, the ternary operator guarantees Short-Circuit Evaluation: only the branch corresponding to the predicate's truth value is evaluated; the alternate branch is never executed. This makes ternary operations completely safe for guarded calculations, such as `const ratio = count !== 0 ? total / count : 0;` (preventing division-by-zero crashes). The cardinal anti-pattern of the ternary operator is nesting: chaining multiple ternary operators (`a ? b : c ? d : e ? f : g`) creates cognitive nightmares that violate readability and are rejected by production code style guides."
      },
      miss: [
        {
          w: "The ternary operator is just a compact shorthand for an `if-else` statement.",
          r: "Ternary is an *expression* that returns a value; `if-else` is a *statement* that executes code blocks; you can assign a ternary directly to a `const`, but you cannot assign an `if-else` statement in JS."
        },
        {
          w: "Both the true and false branches of a ternary operator are always evaluated.",
          r: "Ternary strictly short-circuits: only the chosen branch is evaluated; the unselected branch is completely ignored, ensuring safety against null dereferences."
        },
        {
          w: "Using ternary operators to execute void functions with side effects (`isValid ? save() : delete()`) is good practice.",
          r: "Using ternary operators purely for side effects rather than returning values is an anti-pattern; use a standard `if-else` statement when no value is being assigned."
        },
        {
          w: "Nesting 3 or 4 ternary operators together is a clean way to handle multi-branch logic.",
          r: "Nested ternary expressions destroy code readability; multi-branch logic should be refactored into a `switch` statement, an `if-else if` chain, or a lookup dictionary."
        }
      ],
      trade: {
        buys: [
          "Immutable variable initialization: allows conditional values to be assigned directly to `const` bindings in a single line.",
          "Declarative UI rendering: enables clean inline conditional rendering inside modern UI frameworks (React JSX, Vue, Svelte).",
          "Concise expression syntax: eliminates 5 lines of boilerplate scaffolding for trivial binary value selections.",
          "Short-circuit evaluation safety: guarantees that the alternate branch will never execute, preventing invalid operations."
        ],
        costs: [
          "Severe readability degradation when nested: chaining ternary operators creates nearly unparseable visual clutter.",
          "Temptation to execute side effects: developers abuse ternary to execute statements rather than returning values.",
          "Difficult to set debugger breakpoints: stepping through a single-line ternary in an interactive debugger can be awkward.",
          "Formatting instability: long expressions cause code formatters (Prettier) to wrap ternary branches across multiple lines awkwardly."
        ],
        avoid: [
          "Nesting ternary operators inside other ternary operators (extract to helper functions or use `switch`).",
          "Using ternary operators when you don't use the return value (use a standard `if` statement for side effects).",
          "Writing overly long ternary conditions that span more than 80 characters without line wrapping.",
          "Returning boolean literals from a ternary (`isReady ? true : false`) instead of simply using `Boolean(isReady)` or `isReady`."
        ]
      }
    },
    {
      slug: "truthy-and-falsy",
      why: {
        before: "Statically typed languages strictly required conditional expressions to evaluate to a formal boolean type (`true` or `false`); passing an integer, string, or pointer to an `if` statement was a fatal compiler error.",
        problem: "Checking whether a string was empty, a number was zero, or a pointer was null required verbose boilerplate comparisons (`if (str.length() > 0 && ptr != NULL && count != 0)`).",
        shift: "Dynamic and weakly typed languages (JavaScript, Python, Ruby, PHP) introduced Truthy and Falsy coercion: automatically coercing any data type to a boolean when evaluated in a boolean context (like an `if` statement)."
      },
      num: {
        t: "Falsy Values Across Major Programming Languages",
        h: ["Language", "Official Falsy Values", "Empty Collections (`[]`, `{}`)", "The Number Zero (`0`)", "Infamous Coercion Trap"],
        r: [
          ["JavaScript / TypeScript", "`false`, `0`, `-0`, `0n` (BigInt), `\"\"` (empty string), `null`, `undefined`, `NaN`", "Truthy! (`[]` and `{}` are both Truthy)", "Falsy (`0` coerces to false)", "`[] == false` is true, but `Boolean([])` is true!"],
          ["Python", "`False`, `None`, `0`, `0.0`, `\"\"`, `[]` (empty list), `()` (empty tuple), `{}` (empty dict), `set()`", "Falsy! (Empty collections coerce to False)", "Falsy", "Overriding `__bool__()` or `__len__()` alters truthiness unexpectedly"],
          ["Ruby", "ONLY `false` and `nil` (everything else is truthy!)", "Truthy! (`[]` and `{}` are Truthy)", "Truthy! (The number `0` is Truthy in Ruby!)", "Python/JS developers assuming `0` is falsy write broken Ruby conditions"],
          ["PHP", "`FALSE`, `0`, `0.0`, `\"\"`, `\"0\"`, `array()`, `NULL`", "Falsy (empty array is falsy)", "Falsy (AND string `\"0\"` is falsy!)", "String `\"0\"` evaluating as falsy breaks form input validation"]
        ],
        n: "Truthy and Falsy describe the automatic type coercion rules that govern how non-boolean values behave when evaluated by a boolean control structure (such as an `if` predicate, `while` loop, or ternary condition). In JavaScript, the internal abstract operation `ToBoolean(argument)` (ECMA-262 §7.1.2) partitions the entire universe of values into exactly two sets: Falsy values (which coerce to `false`) and Truthy values (which coerce to `true`). There are exactly eight falsy values in JavaScript: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, and `NaN`. Crucially, in JavaScript, all objects are truthy—meaning an empty array `[]` and an empty object `{}` evaluate to `true`. This contrasts sharply with Python, where empty containers (`[]`, `{}`) evaluate to `False` via their `__len__()` implementation."
      },
      miss: [
        {
          w: "In JavaScript, an empty array `[]` evaluates to `false` in an `if` statement.",
          r: "In JavaScript, ALL objects and arrays are Truthy; `if ([])` executes the true branch! (To check if an array is empty, check `arr.length === 0`)."
        },
        {
          w: "The number `0` is falsy in every single programming language.",
          r: "In Ruby, `0` is explicitly Truthy; only `false` and `nil` are falsy in Ruby; assuming `0` is falsy in Ruby introduces major application defects."
        },
        {
          w: "Using `if (value)` is completely safe to check whether an optional function argument was provided.",
          r: "If the caller passes `0`, `false`, or `\"\"`, `if (value)` treats them as falsy and ignores them; use `value !== undefined` to check for missing arguments."
        },
        {
          w: "The string `\"false\"` evaluates to `false` in JavaScript.",
          r: "Any non-empty string is Truthy in JavaScript; `Boolean(\"false\")` evaluates to `true`, which frequently breaks web form inputs parsing string attributes."
        }
      ],
      trade: {
        buys: [
          "Concise existence checks: allows checking for non-empty strings and non-null objects in a single clean expression (`if (user)`).",
          "Idiomatic collection checks: in Python, `if not items:` provides an elegant, readable check for empty lists or dictionaries.",
          "Streamlined default values: enables concise fallback patterns using logical operators (`const name = input || 'Guest'`).",
          "Reduced syntactic clutter: eliminates repetitive comparisons against null, empty strings, and zero across codebases."
        ],
        costs: [
          "The 'Falsy Zero' bug: developers unintentionally ignore legitimate valid inputs like `0` or `false`.",
          "Cross-language cognitive dissonance: differences between JS (where `[]` is truthy) and Python (where `[]` is falsy) cause bugs.",
          "Coercion confusion: loose equality mixing truthy values with numbers produces non-intuitive results (`[] == ![]` is true).",
          "Loss of type intent: implicit truthy checks obscure whether the developer was checking for null, empty array, or zero."
        ],
        avoid: [
          "Writing `if (count)` when `0` is a valid count value (write `if (count !== undefined)` or `if (count > 0)`).",
          "Checking if a JavaScript array is empty using `if (arr)` (always check `if (arr.length === 0)`).",
          "Parsing web query parameters with `Boolean(req.query.isAdmin)` when string `'false'` evaluates to `true`.",
          "Using truthy/falsy checks in security-critical authorization logic; always use strict explicit equality."
        ]
      }
    },
    {
      slug: "loop",
      why: {
        before: "Repeating an operation 1,000 times required either manually writing 1,000 identical lines of code or using unconditional assembly jump instructions (`JMP`) that created unstructured, chaotic 'Spaghetti Code'.",
        problem: "Unstructured jumps were difficult to trace, lacked formal termination conditions, and frequently created infinite loops that froze computer hardware.",
        shift: "Structured programming introduced Loops (`for`, `while`, `do-while`, `for-of`, iterators): formal control flow structures that repeat a block of code until a specified termination condition is met."
      },
      num: {
        t: "Loop Constructs & Machine Execution Mechanics",
        h: ["Loop Construct", "Termination Condition Check", "Minimum Iterations", "Primary Hardware / Compiler Optimization", "Primary Application Domain"],
        r: [
          ["`for` Loop (Traditional Index)", "Pre-condition check before each iteration", "0 iterations (if condition initially false)", "Loop Unrolling; Auto-Vectorization (SIMD AVX-512)", "Array traversing, index-based mathematical iterations"],
          ["`while` Loop", "Pre-condition check before each iteration", "0 iterations", "Strength Reduction (replacing multiplications with additions)", "Event loops, queue processing, polling until state change"],
          ["`do-while` Loop", "Post-condition check after each iteration", "Guaranteed at least 1 iteration", "Eliminates initial jump instruction before loop body", "User prompts, retry loops, reading at least one packet"],
          ["`for...of` / Iterator Loop", "Queries iterator protocol (`iterator.next()`)", "0 iterations (if iterable empty)", "Inline caching of iterator symbols; iterator unrolling", "Traversing collections, Sets, Maps, and generator streams"],
          ["Functional Iteration (`map`, `forEach`)", "Callback invocation per collection element", "0 iterations", "Higher-order abstraction; function inlining by JIT", "Declarative array transformations without index mutation"]
        ],
        n: "At the machine instruction level, a loop consists of a backward conditional branch. The compiler evaluates the loop predicate, executes the loop body, increments the loop counter, and executes a conditional jump (e.g. `JNE` - Jump if Not Equal) back to the top of the loop. To maximize CPU throughput, optimizing compilers apply Loop Unrolling: duplicating the loop body multiple times (e.g. 4x or 8x) to reduce the total number of conditional branch instructions and branch prediction penalties. Furthermore, compilers apply Auto-Vectorization: transforming scalar loops into SIMD (Single Instruction, Multiple Data) instructions that process 4, 8, or 16 array elements simultaneously in 256-bit or 512-bit vector registers (`YMM`, `ZMM`). However, loops carry the existential threat of the Infinite Loop: if the termination condition is never satisfied, the CPU core spins at 100% utilization indefinitely."
      },
      miss: [
        {
          w: "A `while` loop is inherently faster than a standard `for` loop in compiled languages.",
          r: "Compilers translate both `for` and `while` loops into identical underlying conditional jump machine instructions; their performance is mathematically identical."
        },
        {
          w: "The `forEach` method in JavaScript can be stopped early using a `break` statement.",
          r: "`break` is a statement keyword that only works inside standard loops (`for`, `while`, `for-of`); calling `break` inside a `forEach` callback is a syntax error (it cannot be broken early)."
        },
        {
          w: "Modifying an array's length while iterating over it in a `for` loop is completely safe.",
          r: "Mutating an array (adding or deleting elements) while iterating over it alters indices, causing elements to be skipped or visited twice, leading to severe off-by-one bugs."
        },
        {
          w: "Infinite loops only happen because of programmer incompetence.",
          r: "Infinite loops frequently occur due to subtle floating-point rounding errors (e.g. `for (let i = 0; i != 1.0; i += 0.1)` never hits exactly 1.0) or concurrent race conditions modifying loop bounds."
        }
      ],
      trade: {
        buys: [
          "Repetitive computation automation: process millions of records, render frames, and iterate data structures with concise code.",
          "Hardware vectorization: structured loops allow compilers to vectorize operations using SIMD CPU instructions.",
          "Dynamic operational sizing: algorithms handle input arrays of arbitrary size without changing code structure.",
          "Resource polling and event streaming: powers event loops, background daemons, and consumer queue listeners."
        ],
        costs: [
          "Infinite loop liability: a flawed termination condition locks the CPU thread, freezing the user interface or server process.",
          "Off-by-one errors: misconfiguring boundary conditions (`<` vs `<=`) causes missed elements or buffer overflow crashes.",
          "Complexity of nested loops: nesting loops increases time complexity exponentially ($O(N^2), O(N^3)$), causing performance cliffs.",
          "Garbage collection pressure: creating temporary objects inside high-frequency loops stresses runtime memory allocators."
        ],
        avoid: [
          "Using floating-point numbers as loop counters and testing for exact equality (`i != 10.0`).",
          "Mutating an array or collection while iterating over it with a forward index loop.",
          "Nesting multiple loops without calculating the algorithmic Big-O time complexity on production-scale datasets.",
          "Allocating large objects or closures inside tight loops where they can be allocated outside the loop body."
        ]
      }
    },
    {
      slug: "nesting",
      why: {
        before: "Developers wrote procedural code by sequentially wrapping every successive condition, loop, and error check inside the body of the previous block, creating deeply indented, pyramid-shaped code.",
        problem: "The 'Pyramid of Doom' (or Arrow Anti-Pattern) pushed code 60 characters off the right side of the screen; tracking open curly braces was mentally exhausting, and unhandled error cases were lost at the bottom of distant files.",
        shift: "Software engineering established anti-nesting design patterns (Guard Clauses, Early Returns, Pipeline Architectures, and Async/Await), flattening deep control hierarchies into readable, linear top-to-bottom workflows."
      },
      num: {
        t: "Nesting Depth, Cognitive Load & Architectural Mitigations",
        h: ["Nesting Depth Tier", "Cognitive Complexity Score", "Human Working Memory Impact", "Recommended Architectural Pattern", "Primary Refactoring Technique"],
        r: [
          ["Level 1 - 2 (Flat / Optimal)", "Low (1 - 4)", "Effortless; fits comfortably within human working memory", "Linear pipeline, top-to-bottom control flow", "Ideal standard for production codebases"],
          ["Level 3 (Caution Zone)", "Moderate (5 - 8)", "Requires conscious mental tracking of nested scope variables", "Guard clauses; invert `if` conditions to return early", "Extract inner loop/logic to dedicated private helper function"],
          ["Level 4 - 5 (Code Smell / Danger)", "High (9 - 15)", "High fatigue; developers lose track of parent preconditions", "Decompose into separate classes or strategy objects", "Replace Nested Conditionals with Polymorphism or State pattern"],
          ["Level 6+ (Pyramid of Doom)", "Extreme (> 15)", "Unmaintainable; impossible to reason about edge cases without bugs", "Total architectural refactoring required", "Flatten via async/await, Promise chains, or early return guards"]
        ],
        n: "Nesting describes the practice of placing control flow structures (conditionals, loops, try-catch blocks, and function closures) inside other control flow structures. In 1976, Thomas McCabe formulated Cyclomatic Complexity: a quantitative measure of the number of linearly independent paths through a program's source code ($M = E - N + 2P$, where $E$ is edges, $N$ is nodes, and $P$ is connected components). While linear conditionals add complexity additively, deeply nested conditionals escalate cognitive complexity exponentially because a developer must mentally maintain the truth values of all parent predicates simultaneously to understand the code at the bottom of the pyramid. The most effective technique to eradicate nesting is the 'Bouncer Pattern' (Guard Clause): checking for error conditions, invalid inputs, and boundary failures at the very top of a function and returning immediately."
      },
      miss: [
        {
          w: "Deeply nested code runs significantly slower on modern CPUs than flat code.",
          r: "Compilers flatten nested structures into jump instructions; the primary damage of nesting is human cognitive complexity, readability decay, and high defect rates, not raw CPU execution speed."
        },
        {
          w: "A function must have only a single `return` statement at the very bottom, which justifies deep nesting.",
          r: "The 'Single Exit Point' rule was created in the 1970s for languages like C/Pascal to prevent memory leaks before automatic cleanup; in modern languages, multiple early returns eliminate nesting cleanly."
        },
        {
          w: "Extracting a nested block into a separate helper function is bad because it creates more functions to read.",
          r: "Extracting nested blocks into small, well-named helper functions gives meaningful names to complex logic, isolates scope, and drastically reduces cognitive strain."
        },
        {
          w: "Using callbacks inside callbacks (Callback Hell) is the only way to handle asynchronous code in JavaScript.",
          r: "Modern JavaScript uses Promises and `async/await` syntax, which flattens asynchronous callback pyramids into clean, linear top-to-bottom code."
        }
      ],
      trade: {
        buys: [
          "Localized scope encapsulation: inner blocks have access to outer scope variables without exposing them globally.",
          "Hierarchical decision filtering: drill down through multi-stage validations sequentially.",
          "Multi-dimensional data processing: nested loops provide an intuitive mechanism to process 2D/3D matrices and tree structures.",
          "Contextual error handling: nest specific try-catch blocks around fragile operations without catching broader system exceptions."
        ],
        costs: [
          "The Arrow Anti-Pattern: code drifts horizontally off the right margin, requiring horizontal scrolling to read.",
          "Astronomical cognitive load: engineers must hold 5 layers of conditional state in mental working memory simultaneously.",
          "Explosion of cyclomatic complexity: testing every branch combination across nested conditionals requires dozens of tests.",
          "High bug incidence: edge cases and error handling at the bottom of nested blocks are easily overlooked by developers."
        ],
        avoid: [
          "Nesting `if` statements 4+ levels deep (invert conditions and return early using guard clauses).",
          "Writing 'Callback Hell' pyramids of nested asynchronous callbacks (refactor to `async/await`).",
          "Nesting loops 3 levels deep ($O(N^3)$) over large collections (use hash maps or sets to pre-index data).",
          "Adhering to outdated dogma that forbids multiple return statements in a single function."
        ]
      }
    },
    {
      slug: "function",
      why: {
        before: "Early programming languages used unstructured global subroutines invoked via `GOTO` or `GOSUB`, which shared global memory and could jump to arbitrary line numbers throughout the program.",
        problem: "Unstructured jumps created spaghetti code where tracking variable state was impossible; subroutines could not be reused across different programs or tested in isolation.",
        shift: "Maurice Wilkes invented the Subroutine in 1951, formalized in structured programming as the Function: an encapsulated, reusable block of code that accepts input parameters, executes in an isolated local stack frame, and returns an output value."
      },
      num: {
        t: "Function Calling Conventions & Stack Frame Architecture",
        h: ["Calling Convention / ABI", "Parameter Passing Mechanism", "Stack Cleanup Responsibility", "Name Mangling", "Primary Operating System / Language"],
        r: [
          ["System V AMD64 ABI", "First 6 integer/pointer args in registers (`RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`); rest on stack", "Caller cleans stack parameters", "Yes (C++ / Rust / Swift)", "Linux, macOS, BSD, modern Unix systems"],
          ["Microsoft x64", "First 4 args in registers (`RCX`, `RDX`, `R8`, `R9`); mandatory 32-byte Shadow Space", "Caller cleans stack parameters", "Yes", "Windows x64 OS and native binaries"],
          ["cdecl (x86 32-bit)", "All arguments pushed onto stack in reverse order (Right-to-Left)", "Caller cleans stack parameters (`add esp, N`)", "No (prefixed with `_`)", "Legacy 32-bit C programs; supports variadic functions (`printf`)"],
          ["stdcall (x86 32-bit)", "All arguments pushed onto stack Right-to-Left", "Callee cleans stack before `RET` (`ret N`)", "Yes (decorated with `@bytes`)", "Standard Win32 API functions; compact binary size"]
        ],
        n: "At the CPU hardware architecture layer, invoking a function triggers a precise sequence governed by the Application Binary Interface (ABI) calling convention. When code executes a `CALL` instruction, the CPU pushes the current Instruction Pointer (`RIP`) onto the Call Stack as the Return Address and jumps to the function's entry address. The function executes its 'Prolog': pushing the previous Base Pointer (`RBP`), establishing a new stack frame, and decrementing the Stack Pointer (`RSP`) to allocate space for local variables. When execution reaches a `return` statement, the function executes its 'Epilog': restoring `RSP` and `RBP`, placing the return value into register `RAX`, and executing `RET`, which pops the return address off the stack and resumes execution in the caller. Pure functions embody Referential Transparency: given identical inputs, they always return identical outputs with zero side effects."
      },
      miss: [
        {
          w: "Calling a function is just an aesthetic organizational tool that has zero effect on hardware execution.",
          r: "Function calls execute hardware instructions: pushing return addresses, setting up stack frames, passing register parameters, and jumping memory addresses; tiny functions are often inlined by compilers to eliminate this overhead."
        },
        {
          w: "Pure functions and impure functions are essentially the same thing.",
          r: "Pure functions have no side effects (no mutating global state, no disk I/O, no network calls) and always return the same output for the same input, making them trivial to test, cache (memoize), and parallelize."
        },
        {
          w: "Functions should ideally be 100 to 200 lines long to encapsulate an entire complete feature in one place.",
          r: "High-quality engineering guidelines mandate functions stay under 20-30 lines, doing exactly ONE thing well with high cohesion and a single level of abstraction."
        },
        {
          w: "Recursive functions are always superior to iterative loops.",
          r: "Every recursive call allocates a new stack frame; without Tail Call Optimization (TCO), deep recursion consumes all stack space and crashes with a `StackOverflowError`."
        }
      ],
      trade: {
        buys: [
          "Code reusability (DRY): eliminates copy-pasted logic by encapsulating algorithms into callable units.",
          "Isolated local scope: local variables inside a function cannot collide with or corrupt variables in other functions.",
          "Unit testability: pure functions with explicit inputs and outputs can be tested thoroughly in isolated memory.",
          "Decomposition of complexity: breaks multi-thousand-line monolithic systems into small, understandable modules."
        ],
        costs: [
          "Call stack overhead: allocating and tearing down stack frames adds minor latency (eliminated by compiler function inlining).",
          "Stack overflow risk: uncontrolled or deeply nested recursion exhausts call stack memory, crashing the process.",
          "Over-fragmentation risk: decomposing simple logic into dozens of 2-line functions can make tracing control flow difficult.",
          "Parameter explosion liability: functions that accept 8+ parameters become clumsy to call and maintain."
        ],
        avoid: [
          "Writing massive 200-line 'God Functions' that perform multiple unrelated tasks and mix abstraction levels.",
          "Mutating external global variables or input reference arguments from inside a function (prefer returning new values).",
          "Deep recursive calls without verifying base cases and ensuring call stack safety.",
          "Accepting more than 3 or 4 positional parameters (bundle them into a structured parameter object)."
        ]
      }
    },
    {
      slug: "parameter",
      why: {
        before: "Subroutines accessed data by reading from fixed global memory addresses, requiring callers to manually write input values into specific global variables before calling the routine.",
        problem: "Global variable sharing caused catastrophic bugs: concurrent threads overwrote each other's inputs, recursive calls corrupted their own state, and subroutines were tightly coupled to specific memory locations.",
        shift: "Programming language theory established formal Parameters: named variable placeholders defined in a function's signature that receive values (arguments) dynamically when the function is invoked."
      },
      num: {
        t: "Parameter Types & Argument Passing Paradigms",
        h: ["Parameter Mechanism", "Syntactic Definition", "Binding Time & Evaluation", "Memory / Storage Behavior", "Key Engineering Advantage"],
        r: [
          ["Positional Parameter", "`function add(a, b)`", "Bound by argument position / order at call site", "Mapped to CPU registers or stack frame offsets", "Standard, lowest-overhead parameter passing"],
          ["Default Parameter", "`function connect(port = 8080)`", "Evaluated if argument is omitted or `undefined`", "Assigns fallback value automatically in function prolog", "Eliminates manual defensive fallback checks (`port || 8080`)"],
          ["Named / Keyword Parameter", "`def createUser(*, name, email)`", "Bound by explicit name at call site (`name='Alice'`)", "Passed via dictionary or object destructuring", "Immune to argument ordering mistakes; self-documenting call sites"],
          ["Rest / Variadic Parameter", "`function sum(...numbers)`", "Collects unbounded variable arguments into an array", "Allocates array on heap or stack to hold inputs", "Enables variadic math and wrapper forwarding functions"],
          ["Pass-by-Reference Parameter", "`void update(int &x)` (C++ / Rust `&mut`)", "Binds parameter alias directly to caller's original memory", "Zero copy; parameter pointer points to original address", "High performance for large structs; mutates caller data in-place"]
        ],
        n: "In programming language grammar, a rigorous distinction exists between a **Parameter** (the formal variable defined in the function declaration signature, such as `a` and `b` in `function add(a, b)`) and an **Argument** (the actual concrete value passed into the function at runtime, such as `4` and `5` in `add(4, 5)`). Under modern calling conventions (like System V AMD64), the first 6 integer/pointer parameters are not pushed onto the stack in RAM; instead, the compiler maps them directly into dedicated high-speed CPU registers (`RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`). If a function defines more parameters than available registers, the excess parameters are 'spilled' onto the call stack memory, incurring slight memory read latency. Clean code guidelines (such as Robert C. Martin's Clean Code) recommend restricting function signatures to at most two or three parameters (Dyadic or Triadic); functions requiring four or more parameters should be refactored to accept a single cohesive Parameter Object."
      },
      miss: [
        {
          w: "The terms 'parameter' and 'argument' are 100% identical and interchangeable technical terms.",
          r: "Parameters are the *variables* listed in the function definition signature; arguments are the real *values* passed to the function when it is invoked."
        },
        {
          w: "Default parameters in JavaScript evaluate when `null` is passed as an argument.",
          r: "Default parameters in JavaScript trigger *only* when the argument is strictly `undefined` or omitted; passing `null` explicitly assigns `null` and bypasses the default fallback."
        },
        {
          w: "Passing a large object to a function in JavaScript copies the entire object in memory, slowing down performance.",
          r: "JavaScript passes objects by *sharing* (copying only the memory pointer reference, which is 8 bytes), so passing large objects is essentially instantaneous."
        },
        {
          w: "Default argument expressions in Python evaluate fresh every time the function is called.",
          r: "In Python, default arguments are evaluated *once* at function definition time; using a mutable default argument (`def append(x, items=[])`) creates a shared list across all calls (the classic mutable default bug)."
        }
      ],
      trade: {
        buys: [
          "Dynamic parameterization: enables a single function to execute its logic across infinite combinations of input data.",
          "Decoupled execution: functions do not depend on external global state, operating purely on data provided through parameters.",
          "Self-documenting API signatures: clear parameter names and type hints communicate expected inputs to callers.",
          "Compiler register optimization: compilers pass parameters via ultra-fast CPU registers rather than slow RAM."
        ],
        costs: [
          "Parameter order brittleness: functions with multiple parameters of the same type can easily be called with inverted arguments.",
          "Signature refactoring friction: adding or reordering positional parameters breaks every existing call site across the codebase.",
          "Stack spilling overhead: functions with excessive parameters exceed CPU register counts, forcing stack memory allocation.",
          "Cognitive tracking strain: remembering the meaning of 6 positional parameters at a call site (`f(true, 1, false, null, 20)`) is impossible."
        ],
        avoid: [
          "Writing functions that accept 5+ positional parameters (bundle them into a single typed Parameter Object).",
          "Using mutable default arguments in Python (e.g. `def add(x, list=[])`; use `list=None` instead).",
          "Assuming default parameters trigger on `null` in JavaScript (they only trigger on `undefined`).",
          "Mutating object parameter properties in-place unless explicitly designed and documented as a mutating procedure."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
