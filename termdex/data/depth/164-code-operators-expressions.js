(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "operator",
      why: {
        before: "Early programming required invoking explicit subroutine calls or writing raw assembly mnemonic instructions (`ADD`, `SUB`, `MUL`, `CMP`) for every single mathematical calculation and memory comparison.",
        problem: "Writing mathematical formulas as nested function calls (e.g. `add(multiply(a, b), divide(c, d))`) was visually illegible, cognitively exhausting, and obscured algebraic relationships.",
        shift: "Programming language designers introduced Operators: compact, symbolic syntactic tokens (`+`, `-`, `*`, `/`, `&&`) that represent built-in computational operations, governed by formal mathematical precedence and associativity rules."
      },
      num: {
        t: "Operator Classes, Arity & Associativity Hierarchy",
        h: ["Operator Arity / Class", "Number of Operands", "Syntactic Placement", "Associativity Direction", "Example Operation & Evaluation Order"],
        r: [
          ["Unary Prefix", "1 operand", "Precedes operand (`++x`, `!flag`, `~mask`, `-num`)", "Right-to-Left", "`!isValid` (evaluates right operand first)"],
          ["Unary Postfix", "1 operand", "Follows operand (`x++`, `x--`)", "Left-to-Right", "`i++` (returns original value, then mutates variable)"],
          ["Binary Infix (Standard)", "2 operands", "Between operands (`a + b`, `x * y`, `p && q`)", "Left-to-Right (arithmetic); Right-to-Left (assignment)", "`a - b - c` evaluates as `(a - b) - c`"],
          ["Ternary Conditional", "3 operands", "Delimited syntax (`condition ? expr1 : expr2`)", "Right-to-Left", "`a ? b : c ? d : e` parses as `a ? b : (c ? d : e)`"],
          ["Variadic / Spread", "Arbitrary elements", "Prefix token (`...args`)", "Contextual", "Spreads iterable collections or collects variadic arguments"]
        ],
        n: "In compiler construction, operators are syntactic tokens parsed into Abstract Syntax Tree (AST) branches using algorithms such as Pratt Parsing (Top-Down Operator Precedence) or Dijkstra's Shunting-Yard algorithm. Operators are governed by two strict algebraic rules: Precedence (which operator binds more tightly when parentheses are absent, such as multiplication `*` having higher precedence than addition `+`) and Associativity (the evaluation order of operators that share the same precedence level). For example, addition and subtraction are left-associative ($a - b - c \\equiv (a - b) - c$), whereas exponentiation (`**`) and assignment (`=`) are right-associative ($a = b = c \\equiv a = (b = c)$). Languages like C++ and Rust allow Operator Overloading, enabling custom classes (such as vectors or matrices) to define custom behavior for standard operator symbols."
      },
      miss: [
        {
          w: "Operators evaluate strictly from left to right across all operations in all programming languages.",
          r: "Precedence takes priority over reading direction; in `1 + 2 * 3`, the multiplication evaluates before addition regardless of writing order, and assignment operators evaluate right-to-left."
        },
        {
          w: "Operator overloading is always a great design pattern that makes code cleaner.",
          r: "Abusing operator overloading makes code cryptic and unmaintainable (e.g. overloading `+` to send network packets or modify database tables); operators should only be overloaded when mathematical intuition naturally applies."
        },
        {
          w: "Prefix increment (`++x`) and postfix increment (`x++`) produce identical results in expressions.",
          r: "Prefix `++x` increments the value and returns the *new* incremented value; postfix `x++` increments the value but returns the *original* value prior to the increment."
        },
        {
          w: "Adding parentheses around expressions slows down code execution at runtime.",
          r: "Parentheses only guide the compiler's AST parser during compilation; they are discarded during code generation and have zero runtime CPU performance cost."
        }
      ],
      trade: {
        buys: [
          "Mathematical legibility: allows complex algebraic and algorithmic formulas to be written using intuitive mathematical notation.",
          "Compact syntax: eliminates verbose subroutine calls for primitive arithmetic and boolean evaluations.",
          "Compiler optimization: standard primitive operators map directly to single high-speed CPU machine instructions.",
          "Domain expressiveness: judicious operator overloading (e.g. vector math in 3D game engines) keeps algorithmic code concise."
        ],
        costs: [
          "Precedence confusion: complex unparenthesized expressions lead to subtle bugs when developers misremember precedence tables.",
          "Operator overloading obfuscation: hidden side effects inside overloaded operators obscure expensive operations (like memory allocations).",
          "Type coercion anomalies: weak dynamic typing causes bizarre operator results (e.g. `'5' - 3 === 2` but `'5' + 3 === '53'`).",
          "Parsing complexity: compilers must implement sophisticated parsing tables to resolve grammar ambiguities."
        ],
        avoid: [
          "Writing convoluted, unparenthesized compound expressions that require memorizing a 20-level precedence table.",
          "Using prefix and postfix increment operators (`i++`, `++i`) inside complex arithmetic expressions or method parameters.",
          "Overloading operators with unexpected side effects that violate user mathematical expectations.",
          "Relying on implicit type coercion with the `+` operator in JavaScript; explicitly convert strings to numbers."
        ]
      }
    },
    {
      slug: "assignment-operator",
      why: {
        before: "In early mathematical languages, equal signs were used solely for declarative equations ($x = y + 2$), with no distinction between asserting mathematical equivalence and mutating computer memory storage.",
        problem: "Conflating equality testing with memory mutation caused syntax ambiguity in programming languages, leading to compilers unable to distinguish between setting a value and comparing two values.",
        shift: "Programming languages separated Assignment (`=`, `:=`, `<-`) from Equality Comparison (`==`, `===`), formalizing assignment as an explicit operation that stores the evaluated result of a right-hand expression into a left-hand memory location."
      },
      num: {
        t: "Assignment Operators & Compound Memory Mutation Forms",
        h: ["Assignment Operator Form", "Syntax / Expression", "Equivalent Expanded Semantics", "Evaluation Behavior", "Compound Mutation Advantage"],
        r: [
          ["Simple Assignment", "`x = y`", "`x` receives evaluated value of `y`", "Evaluates `y`, stores into `x`, returns assigned value", "Basic memory binding mutation"],
          ["Compound Arithmetic (`+=`, `-=`, `*=`, `/=`)", "`x += y`", "`x = x + y`", "Evaluates `x` memory address only once; mutates in-place", "Avoids duplicate memory addressing; cleaner syntax"],
          ["Compound Bitwise (`&=`, `|=`, `^=`)", "`flags |= MASK`", "`flags = flags | MASK`", "Atomic-like bit manipulation; sets/clears bit positions", "Standard idiom for setting hardware/permission bit flags"],
          ["Logical Assignment (`&&=`, `||=`, `??=`)", "`x ??= defaultValue`", "`x ?? (x = defaultValue)`", "Short-circuits: assigns ONLY if condition is met", "Prevents unnecessary mutation or property re-renders"],
          ["Destructuring Assignment", "`const { a, b } = obj`", "Pulls properties into distinct local identifiers", "Pattern matches against object/array structure", "Extracts multiple values cleanly in a single readable line"]
        ],
        n: "In programming language grammar, an assignment operator requires two distinct operands: an L-value (left-hand side) and an R-value (right-hand side). An R-value represents any computable data expression that yields a value (e.g., `42`, `x + 5`, `getUser()`). An L-value represents an addressable storage location in memory capable of holding data (such as a variable identifier, array index `arr[i]`, or object property `user.age`). Attempting to assign to a non-lvalue (e.g. `5 = x` or `(a + b) = 10`) triggers a compiler error. Assignment operators are right-associative ($a = b = c \\equiv a = (b = c)$) and evaluate to the assigned value, which historically enabled chained assignments but also introduced the notorious 'Assignment in Conditional' bug (`if (x = 5)`)."
      },
      miss: [
        {
          w: "The single equals sign `=` tests whether two values are equal.",
          r: "`=` is the assignment operator that overwrites the left variable with the right value; equality testing requires `==` or `===`."
        },
        {
          w: "Accidentally writing `if (user = null)` will cause a syntax error that the compiler catches.",
          r: "In C, C++, and JavaScript, assignment returns the assigned value, which evaluates as falsy, silently mutating `user` to null without throwing a syntax error (linters flag this)."
        },
        {
          w: "`x += y` is always 100% byte-for-byte identical to `x = x + y`.",
          r: "In `arr[computeIndex()] += 5`, `computeIndex()` is evaluated only once, whereas in `arr[computeIndex()] = arr[computeIndex()] + 5`, the index function is evaluated twice with potential side effects."
        },
        {
          w: "Destructuring assignment (`const { a, b } = obj`) performs a deep clone of the object.",
          r: "Destructuring copies primitive values and object *references* shallowly; nested objects remain shared references and are not deeply cloned."
        }
      ],
      trade: {
        buys: [
          "Clear separation of mutation: distinguishes memory storage operations from mathematical equality assertions.",
          "Compound efficiency: compound operators (`+=`, `*=` ) express in-place accumulation concisely and optimize memory access.",
          "Syntactic sugar ergonomics: logical assignment (`??=`, `||=`) and destructuring eliminate dozens of lines of repetitive boilerplate.",
          "Chained assignment capability: enables initializing multiple variables to the same baseline state simultaneously."
        ],
        costs: [
          "The assignment-in-conditional pitfall: typing `=` instead of `===` inside `if` statements introduces critical silent bugs.",
          "Right-associativity confusion: developers unfamiliar with right-associativity can misread chained assignments.",
          "Hidden side effects in expressions: embedding assignment expressions inside function arguments creates unreadable code.",
          "Destructuring performance overhead: heavily nested destructuring with default fallbacks adds minor runtime overhead."
        ],
        avoid: [
          "Writing assignments inside conditional expressions (`if (match = regex.exec(str))`) without clear parentheses or while-loops.",
          "Embedding assignment expressions (`foo(x = 10)`) as arguments to function calls.",
          "Confusing simple assignment `=` with deep cloning when handling mutable objects and arrays.",
          "Ignoring compiler and linter warnings that flag accidental assignments inside boolean conditionals."
        ]
      }
    },
    {
      slug: "comparison-operators",
      why: {
        before: "Early programming languages used assembly branch instructions (`BNE`, `BEQ`, `BLT`) comparing CPU status register flags (Zero Flag, Negative Flag) after subtracting two numbers.",
        problem: "Low-level flag checking was tedious and machine-dependent; furthermore, dynamic languages introduced implicit type coercions that produced bizarre comparison results that violated mathematical transitivity.",
        shift: "Comparison Operators (`==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`) standardized relational and equality evaluations, returning boolean `true` or `false` based on rigorous type-safe semantics."
      },
      num: {
        t: "Comparison Operators & Equality Semantics Across Languages",
        h: ["Comparison Operator", "Evaluation Mechanism", "Type Coercion Behavior", "Transitivity Guarantee", "Best Practice Usage"],
        r: [
          ["Strict Equality (`===`)", "Identity / Type & Value comparison", "Zero coercion; returns false if types differ", "Guaranteed transitive ($a=b \\land b=c \\implies a=c$)", "Universal standard in modern JavaScript/TypeScript"],
          ["Loose Equality (`==`)", "Abstract Equality Comparison Algorithm", "Aggressive implicit type coercion", "Violates transitivity (`'' == 0`, `0 == '0'`, but `'' != '0'`)", "Avoid; source of subtle and infamous JavaScript bugs"],
          ["Relational (`<`, `>`, `<=`, `>=`)", "Numerical or lexicographical comparison", "Coerces operands to common primitive type", "Transitive for real numbers; non-transitive with NaN", "Numerical bounds checks and sorting algorithms"],
          ["Object Identity (`Object.is`)", "SameValue algorithm (distinguishes `-0` vs `+0`, `NaN` vs `NaN`)", "Zero coercion; exact bit-level semantic equality", "Guaranteed transitive across all values", "React state reconciliation and shallow comparison algorithms"],
          ["Three-Way Comparison (`<=>` Spaceship)", "Returns negative, zero, or positive integer ($-1, 0, 1$)", "Static type comparison in C++20 / PHP / Ruby", "Strict weak ordering", "Standard interface for sorting comparator callbacks"]
        ],
        n: "Comparison operators form the decision-making backbone of conditional control flow. A critical architectural concept is the distinction between Structural Equality (do two objects contain equivalent data values?) and Reference Identity (do two pointers reference the exact same memory address in heap RAM?). In JavaScript, Python, and Java, comparing two independently instantiated objects (`{ a: 1 } === { a: 1 }`) evaluates to `false` because strict equality checks reference identity, not structural content. In JavaScript, the loose equality operator (`==`) implements the complex Abstract Equality Comparison Algorithm (ECMA-262 §7.2.14): it attempts to coerce types when comparing strings, numbers, and booleans, leading to well-known violations of mathematical transitivity (such as `0 == ''` is true, and `0 == '0'` is true, but `'' == '0'` is false)."
      },
      miss: [
        {
          w: "In JavaScript, `==` and `===` do the same thing if the variables are both strings or both numbers.",
          r: "While they yield the same result when types match, `==` triggers complex implicit coercion rules if types drift, while `===` enforces type safety; always use `===` by default."
        },
        {
          w: "Comparing two objects or arrays with `===` checks if their contents and properties are equal.",
          r: "`===` on objects strictly checks *reference identity* (whether both point to the exact same memory address in RAM); checking content equality requires deep comparison or structural hashing."
        },
        {
          w: "The expression `NaN === NaN` evaluates to `true` because both sides are identical.",
          r: "By IEEE 754 floating-point specification, `NaN` is not equal to any value, including itself; checking for NaN requires `Number.isNaN()` or `Object.is(NaN, NaN)`."
        },
        {
          w: "String comparisons with `<` and `>` accurately sort multilingual human names alphabetically.",
          r: "Standard relational operators compare raw UTF-16 code unit numerical values (where `'Z' < 'a'`), which fails for human alphabetical sorting; proper alphabetical sorting requires `localeCompare()`."
        }
      ],
      trade: {
        buys: [
          "Deterministic branching: provides unambiguous boolean outcomes for all programmatic decision paths.",
          "Type safety enforcement: strict comparison (`===`) prevents unexpected runtime bugs caused by implicit type coercion.",
          "Universal sorting capability: relational operators define strict weak ordering for $O(N \\log N)$ sorting algorithms.",
          "Hardware efficiency: primitive numerical comparisons compile directly to single-cycle CPU `CMP` instructions."
        ],
        costs: [
          "Implicit coercion hazards: loose equality (`==`) creates notoriously bizarre bugs in weakly typed languages.",
          "Reference vs value confusion: junior developers constantly make bugs comparing objects and arrays by reference.",
          "Floating-point rounding traps: comparing floating-point calculations with `==` fails due to binary representation drift.",
          "Unicode collation complexity: string comparison does not account for human locale-specific alphabetical ordering."
        ],
        avoid: [
          "Using loose equality `==` in JavaScript; enforce strict equality `===` via automated ESLint rules.",
          "Comparing floating-point numbers directly with `===` (use epsilon tolerance checks).",
          "Comparing objects or arrays with `===` expecting deep structural content equality.",
          "Sorting human-facing multilingual strings using `<` or `>` instead of `String.prototype.localeCompare()`."
        ]
      }
    },
    {
      slug: "logical-operators",
      why: {
        before: "Evaluating multiple conditions required writing deeply nested, repetitive `if` statements, evaluating every single condition even when the first condition had already failed.",
        problem: "Executing all conditions unconditionally caused severe bugs: dereferencing null pointers (e.g. evaluating `user.name` when `user` was null) and wasting CPU cycles on expensive subroutines.",
        shift: "Programming languages standardized Logical Operators (`&&`, `||`, `!`) featuring Short-Circuit Evaluation: terminating boolean expression evaluation the microsecond the final outcome is mathematically determined."
      },
      num: {
        t: "Logical Operators & Short-Circuit Evaluation Semantics",
        h: ["Logical Operator", "Mathematical Operation", "Short-Circuit Condition", "Returned Value in Dynamic Languages (JS/Python)", "Primary Architectural Pattern"],
        r: [
          ["Logical AND (`&&`)", "Conjunction ($A \\land B$)", "Short-circuits if first operand is Falsy", "Returns first falsy value, or last value if all truthy", "Guard clause: safe property access (`user && user.profile`)"],
          ["Logical OR (`||`)", "Disjunction ($A \\lor B$)", "Short-circuits if first operand is Truthy", "Returns first truthy value, or last value if all falsy", "Fallback value assignment (`const name = input || 'Anonymous'`)"],
          ["Logical NOT (`!`)", "Negation ($\\neg A$)", "Never short-circuits (unary operator)", "Returns strictly boolean `true` or `false`", "Inverting conditions, double-bang boolean coercion (`!!value`)"],
          ["Nullish Coalescing (`??`)", "Nullish Disjunction", "Short-circuits if first operand is NOT null/undefined", "Returns first operand unless strictly `null` or `undefined`", "Safe default fallback that preserves `0`, `false`, and `''`"]
        ],
        n: "The defining operational mechanism of modern logical operators is Short-Circuit Evaluation. In a logical AND expression ($A \\land B$), if operand $A$ evaluates to false, the entire expression is mathematically guaranteed to be false regardless of the value of $B$; therefore, $B$ is never executed. In a logical OR expression ($A \\lor B$), if operand $A$ evaluates to true, the entire expression is guaranteed to be true; therefore, $B$ is skipped. In dynamically typed languages like JavaScript and Python, logical operators do not simply return boolean `true` or `false`; instead, they return the actual value of the operand that terminated the evaluation. For example, `'hello' && 42` returns `42`, and `null && 'world'` returns `null`. This behavior enables powerful programming idioms, such as guard clauses and fallback values."
      },
      miss: [
        {
          w: "In JavaScript, the `||` operator always returns a boolean `true` or `false`.",
          r: "`||` returns the actual operand value that satisfied the condition; `'cat' || 'dog'` returns `'cat'`, not `true`."
        },
        {
          w: "Using `||` to provide default fallback values is always safe for numbers and booleans.",
          r: "`||` treats `0`, `false`, and `''` as falsy; using `count || 10` when `count === 0` will accidentally overwrite valid zero with `10` (use `??` instead)."
        },
        {
          w: "Both sides of a logical `&&` or `||` operator are always evaluated by the runtime engine.",
          r: "Logical operators strictly short-circuit; if the first operand determines the outcome, the second operand is never executed, which is critical for preventing null pointer crashes."
        },
        {
          w: "Writing `!x == false` is good, readable programming style.",
          r: "Double negatives and comparing against boolean literals reduces readability and invites coercion bugs; write `Boolean(x)` or `!!x` to coerce, or simply use `if (x)`."
        }
      ],
      trade: {
        buys: [
          "Null safety via short-circuiting: evaluate object properties safely without crashing (`user && user.address && user.address.city`).",
          "Concise expression of complex logic: combines multiple business validation rules into readable boolean conditions.",
          "Performance optimization: skips executing expensive secondary function calls if the initial condition fails.",
          "Clean fallback idiom: allows concise inline default assignments without multi-line `if/else` blocks."
        ],
        costs: [
          "The 'Falsy Zero' bug: using `||` for default values unintentionally overwrites legitimate values like `0`, `false`, and `''`.",
          "Hidden side-effect bugs: if the second operand contains a mutating function, that function may unpredictably never execute.",
          "Cognitive strain in complex chains: compound expressions mixing `&&` and `||` without parentheses are prone to human error.",
          "Readability decay in JSX: using `items.length && <List />` in React renders the number `0` onto the screen if the array is empty."
        ],
        avoid: [
          "Using `||` for numerical defaults where `0` is a valid number (always use nullish coalescing `??`).",
          "Putting functions with important side effects on the right-hand side of short-circuiting operators.",
          "Writing React JSX like `{items.length && <List />}` which renders an unwanted '0' on screen when empty.",
          "Chaining multiple `&&` and `||` operators together without explicit clarifying parentheses."
        ]
      }
    },
    {
      slug: "modulo",
      why: {
        before: "Programmers needed to calculate the remainder of division for cyclic algorithms (clock math, round-robin load balancing, array bounds wrapping) and had to write manual integer division and subtraction loops.",
        problem: "Manual remainder loops were slow, and different hardware CPU architectures handled negative numbers inconsistently, causing negative indices to corrupt memory.",
        shift: "The Modulo / Remainder Operator (`%`) provided hardware-accelerated integer remainder calculation, enabling circular buffer indexing, hash table bucket distributions, and parity checks."
      },
      num: {
        t: "Modulo vs Remainder Across Programming Languages",
        h: ["Language / Implementation", "Operator Symbol", "Handling of Negative Dividends (e.g. `-7 % 4`)", "Mathematical Definition", "Cyclic Wrapping Safety"],
        r: [
          ["Python / Ruby", "`%`", "Returns positive result: `-7 % 4 == 1`", "Floored Division: $r = a - b \\times \\lfloor a / b \\rfloor$", "Safe for circular array wrapping (always within $[0, b-1]$)"],
          ["C / C++ (C99) / Java / C#", "`%`", "Returns negative result: `-7 % 4 == -3`", "Truncated Division: $r = a - b \\times \\text{trunc}(a / b)$", "Unsafe for array indexing; negative index throws out-of-bounds error"],
          ["JavaScript / TypeScript", "`%`", "Returns negative result: `-7 % 4 == -3`", "Truncated Remainder (IEEE 754 remainder)", "Requires manual positive wrapping: `((x % n) + n) % n`"],
          ["Rust", "`%` (remainder) vs `rem_euclid`", "`%` returns negative; `rem_euclid` returns positive", "Provides distinct operators for truncated remainder vs Euclidean modulo", "Use `rem_euclid` for circular buffer index wrapping"]
        ],
        n: "A crucial mathematical distinction in computer science is the difference between the **Remainder** operator and the true mathematical **Modulo** operator. In mathematics, modulo is defined under Euclidean or Floored division, where the result $a \\pmod b$ strictly shares the sign of the divisor $b$, guaranteeing that for a positive divisor $n$, the result always falls within the positive range $[0, n-1]$. Python and Ruby implement true mathematical floored modulo: `-1 % 5 == 4`. However, C, C++, Java, and JavaScript implement the truncated remainder operator: `-1 % 5 == -1`. When developers use `%` to wrap circular buffer indices or cyclic arrays (e.g. `buffer[(index - 1) % size]`), truncated remainder produces a negative index, causing runtime out-of-bounds crashes. In JavaScript and Java, safe circular wrapping requires the idiomatic formula: `((index % n) + n) % n`."
      },
      miss: [
        {
          w: "The `%` operator in JavaScript is a true mathematical modulo operator.",
          r: "In JavaScript, `%` is the *remainder* operator; for negative numbers, it returns negative results (e.g. `-5 % 3 === -2`), whereas true mathematical modulo always returns positive values (`1`)."
        },
        {
          w: "Checking if a number is odd using `x % 2 === 1` works correctly for all integers.",
          r: "If `x` is negative (e.g. `-3`), `-3 % 2` evaluates to `-1`, causing the check to fail; correct parity checking is `x % 2 !== 0` or using bitwise `(x & 1) !== 0`."
        },
        {
          w: "Modulo only works with integer numbers and cannot be used with floating-point numbers.",
          r: "In JavaScript and Python, `%` operates on floating-point numbers (e.g. `5.5 % 2 === 1.5`), though IEEE 754 precision rounding can introduce minor decimal artifacts."
        },
        {
          w: "Modulo division by zero returns zero in most programming languages.",
          r: "Modulo by zero is mathematically undefined; in Python and Java it throws an exception (`ZeroDivisionError` / `ArithmeticException`), and in JavaScript it returns `NaN`."
        }
      ],
      trade: {
        buys: [
          "Cyclic boundary wrapping: enables circular ring buffers, carousel index loops, and clock-face cyclical arithmetic.",
          "Uniform bucket distribution: maps arbitrary hash values into fixed-size hash table arrays ($h(k) \\pmod M$).",
          "Parity and stride filtering: easily identify even/odd numbers (`n % 2`) or execute logic every $N$-th loop iteration.",
          "Single-cycle CPU acceleration: modern CPU ALUs compute division and remainder simultaneously in hardware."
        ],
        costs: [
          "Negative sign divergence: inconsistent handling of negative operands across languages creates subtle cross-language porting bugs.",
          "Division-by-zero vulnerability: dividing or moduloing by zero crashes programs or produces `NaN`.",
          "CPU performance penalty relative to addition: integer division and modulo instructions are slower than basic bitwise operations.",
          "Floating-point rounding drift: using modulo on floats produces imprecise fractional remainders due to binary floating-point representation."
        ],
        avoid: [
          "Checking for odd numbers with `x % 2 === 1` (use `x % 2 !== 0` to handle negative integers correctly).",
          "Using `%` for circular array index wrapping in JavaScript without adding the divisor to prevent negative indices.",
          "Using `%` inside high-performance graphics or crypto loops when power-of-two bitwise masking (`x & (2^n - 1)`) is 10x faster.",
          "Performing modulo operations without verifying that the divisor is non-zero."
        ]
      }
    },
    {
      slug: "expression",
      why: {
        before: "In early imperative languages and assembly, programming consisted solely of rigid sequential commands and instructions that performed actions without evaluating to reusable values.",
        problem: "Developers had to write multiple intermediate statements and temporary storage variables to perform even basic nested mathematical computations.",
        shift: "Computer science formalized the Expression: a syntactic construct of operators and operands that is evaluated by the runtime engine to produce a single resultant value."
      },
      num: {
        t: "Expressions vs Statements in Programming Language Grammars",
        h: ["Syntactic Dimension", "Expression", "Statement", "Primary Grammar Role", "Example Construct"],
        r: [
          ["Return Value", "Always evaluates to a concrete value", "Does NOT evaluate to a value (produces side effects)", "Expressions can be passed as arguments; statements cannot", "`5 + 3` (evaluates to 8) vs `let x = 5;`"],
          ["Syntactic Nestability", "Can be nested arbitrarily inside other expressions", "Cannot be embedded inside expressions", "Composability and functional piping", "`Math.max(a * 2, b + 3)` vs `if (a > b) { ... }`"],
          ["Side Effects", "Pure expressions have zero side effects (referentially transparent)", "Primarily exist to cause side effects (state mutation, I/O)", "Predictability and compiler optimization", "`x * y` (pure) vs `console.log(x);`"],
          ["Language Paradigm Shift", "Central primitive in Functional Programming (everything is an expression)", "Central primitive in traditional Imperative Programming", "Eliminates intermediate temporary variables", "Rust/Kotlin `if` expressions returning values"]
        ],
        n: "In formal language theory, an expression is a valid combination of literals, identifiers, operators, and function calls that can be evaluated to produce a single value. A critical property of expressions is Referential Transparency: an expression is referentially transparent if it can be replaced with its evaluated value without changing the program's observable behavior (e.g. replacing `2 + 3` with `5`). Modern programming languages are increasingly expression-oriented: in languages like Rust, Kotlin, Scala, and Ruby, control flow constructs like `if-else` and `match` blocks are expressions that evaluate to a value (e.g. `let result = if condition { 10 } else { 20 };`), eliminating the need for uninitialized mutable variables and imperative reassignment statements."
      },
      miss: [
        {
          w: "Expressions and statements are completely identical concepts with different names.",
          r: "An expression evaluates to a value (e.g. `4 + 5` or `getUser()`); a statement performs an action or controls execution flow (e.g. `while`, `break`, variable declaration) and does not yield a value."
        },
        {
          w: "Expressions can never have side effects.",
          r: "Expressions can cause side effects if they invoke mutating functions, perform assignments (`x = 5` is an expression that yields 5), or use increment operators (`i++`)."
        },
        {
          w: "In JavaScript, an `if` block is an expression.",
          r: "`if` in JavaScript is a statement and cannot be assigned to a variable; conditional value assignment in JS requires the ternary expression operator (`? :`)."
        },
        {
          w: "Writing code purely with nested expressions is always superior to using statements.",
          r: "Overly dense, deeply nested expression chains become unreadable and difficult to debug; extracting intermediate named variables improves clarity and ease of setting debugger breakpoints."
        }
      ],
      trade: {
        buys: [
          "Extreme composability: expressions can be passed directly as function arguments, array elements, and return values.",
          "Referential transparency: pure expressions are predictable, easy to reason about, and effortless to unit test.",
          "Elimination of mutable state: expression-oriented control flow allows variables to be initialized as immutable constants directly.",
          "Compiler optimization: compilers easily fold, parallelize, and memoize pure expressions via algebraic simplifications."
        ],
        costs: [
          "Readability risk from nesting: deeply nested compound expressions create dense, unreadable 'one-liner' code.",
          "Debugging friction: setting breakpoints or inspecting intermediate state inside complex nested expressions is difficult.",
          "Hidden side effect hazards: expressions containing mutating operations make control flow unpredictable.",
          "Language grammar constraints: in statement-based languages like JavaScript, converting statements to expressions requires workarounds."
        ],
        avoid: [
          "Writing convoluted, 200-character nested expression one-liners where intermediate named variables would be clearer.",
          "Embedding expressions with heavy side effects (like database writes) inside function arguments.",
          "Confusing statement constructs (`if`, `for`) with expressions in languages that treat them as statements.",
          "Relying on the return value of assignment expressions (`while (node = node.next)`) without clear parenthetical intent."
        ]
      }
    },
    {
      slug: "statement",
      why: {
        before: "Non-procedural computing required declaring fixed mathematical equations, lacking a sequential control structure to command hardware step-by-step through complex procedural workflows.",
        problem: "Without sequential execution instructions, expressing linear workflows (e.g. 'read sensor, log data, if threshold exceeded sound alarm') was unnatural and required cumbersome state machines.",
        shift: "Imperative programming established the Statement: a complete syntactical unit of an imperative programming language that expresses an action to be carried out by the computer, controlling sequential execution flow."
      },
      num: {
        t: "Statement Classifications & Control Flow Mechanisms",
        h: ["Statement Category", "Primary Execution Responsibility", "Control Flow Mechanism", "Keyword Examples", "Termination / Delimiter"],
        r: [
          ["Declaration Statement", "Allocates memory bindings and defines types", "Sequential (introduces identifiers to scope)", "`let`, `const`, `function`, `class`", "Semicolon (`;`) or newline"],
          ["Iteration / Loop Statement", "Repeats a block of code based on a predicate", "Cyclic branch jump (backwards conditional jump)", "`for`, `while`, `do-while`", "Loop body block termination (`}`)"],
          ["Selection / Conditional Statement", "Branches execution based on boolean condition", "Forward conditional branch jump", "`if`, `else`, `switch`, `case`", "Conditional block termination (`}`)"],
          ["Jump / Flow Control Statement", "Unconditionally alters program counter execution pointer", "Direct non-linear jump across stack/loop frames", "`return`, `break`, `continue`, `throw`", "Semicolon (`;`)"],
          ["Expression Statement", "Evaluates an expression for its side effects; discards value", "Sequential execution of expression side effect", "`x++;`, `console.log(data);`, `save();`", "Semicolon (`;`)"]
        ],
        n: "In imperative programming, statements are the discrete sequential commands that drive state mutation and control flow. Unlike expressions, which evaluate to a value, statements are executed solely for their side effects (such as mutating a variable, writing bytes to a disk file, jumping to a different instruction address, or terminating a function). In the Grammar and Abstract Syntax Tree (AST) of languages like C, Java, and JavaScript, statements form the top-level structure of function bodies and code blocks. An 'Expression Statement' occurs when an expression is terminated with a semicolon (`x++;` or `launchRocket();`): the engine evaluates the expression, applies any associated side effects, and promptly discards the resulting return value."
      },
      miss: [
        {
          w: "A statement and an expression are the same thing and can be used in the exact same syntactic locations.",
          r: "You cannot place a statement where an expression is expected (e.g. `const x = if (true) { 5 };` is a syntax error in JavaScript), because statements do not evaluate to values."
        },
        {
          w: "JavaScript automatically inserts semicolons perfectly everywhere, so developers never need to think about statements.",
          r: "Automatic Semicolon Insertion (ASI) has notorious edge cases: a newline after a `return` statement causes JS to return `undefined`, silently ignoring the code on the next line."
        },
        {
          w: "Modern functional programming completely eliminates all statements from computer execution.",
          r: "Even in pure functional languages, low-level CPU machine code consists entirely of sequential instructions and statements executed by hardware registers."
        },
        {
          w: "Empty statements (a lone semicolon `;`) are harmless and have zero effect on code execution.",
          r: "Accidentally placing an empty semicolon after an `if` condition (`if (isValid); { doAction(); }`) makes the action block execute unconditionally every single time."
        }
      ],
      trade: {
        buys: [
          "Natural imperative control flow: provides a clear, step-by-step sequence of instructions matching human procedural intuition.",
          "Deterministic state mutation: orchestrates sequential operations like file reading, network writing, and resource allocation.",
          "Explicit execution redirection: provides powerful jump primitives (`break`, `continue`, `return`, `throw`) to control loops.",
          "Direct mapping to CPU instructions: imperative statements translate cleanly to sequential machine instructions and branch jumps."
        ],
        costs: [
          "Lack of composability: statements cannot be passed directly into functions or assigned to variables.",
          "Reliance on mutable state: statement-heavy procedural code frequently relies on mutating shared variables across lines.",
          "Testing complexity: code dominated by side-effecting statements is harder to isolate and unit test than pure expressions.",
          "Boilerplate accumulation: requires declaring temporary variables and multi-line scaffolding for simple conditional assignments."
        ],
        avoid: [
          "Placing accidental semicolons immediately after `if` or `for` statement headers (`if (condition);`), breaking logic.",
          "Relying on Automatic Semicolon Insertion (ASI) in JavaScript, which causes catastrophic bugs with newline returns.",
          "Writing 50-line procedural statement blocks without extracting cohesive sub-steps into pure helper functions.",
          "Using statements that mutate global state when a pure expression returning a new value would be safer."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
