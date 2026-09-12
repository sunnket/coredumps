/* ==========================================================================
   Depth pass 15 — languages, and the specific problem each was built to
   solve.

   A language is an argument about what programs should be. Haskell argues
   for purity, Erlang for isolation, Rust for ownership, COBOL for
   readability by non-programmers. Judging a language without knowing its
   argument produces the usual sterile comparisons; knowing it explains both
   why people love it and where it genuinely does not fit.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "erlang",

      why: {
        before: "Telephone switches were written in C with shared memory, " +
          "locks and careful defensive error handling. A fault anywhere could " +
          "corrupt state anywhere.",
        problem: "Ericsson needed **nine nines** — 31 milliseconds of downtime " +
          "per year — on systems that must be upgraded while running. " +
          "Defensive programming does not get you there: you cannot anticipate " +
          "every fault, and the code that handles errors is itself where bugs " +
          "hide.",
        shift: "**Let it crash.** Make processes so cheap and so isolated that " +
          "a failure destroys only one, then have a supervisor restart it in a " +
          "known-good state. Stop writing error-handling code for unforeseen " +
          "errors and write **recovery** structure instead. Everything else in " +
          "the language follows: no shared memory, message passing only, " +
          "immutable data."
      },

      num: {
        t: "Erlang processes against OS threads",
        h: ["Property", "OS thread", "Erlang process"],
        r: [
          ["Creation cost", "~1ms, ~1MB stack", "**~1µs, ~300 bytes**"],
          ["Practical count", "thousands", "**millions**"],
          ["Shared state", "yes — needs locks", "**none**"],
          ["One crashing", "may corrupt others", "isolated"],
          ["Scheduling", "OS, preemptive", "VM, preemptive per-reduction"]
        ],
        n: "The AXD301 switch reported **99.9999999%** availability — nine " +
          "nines — which is the claim the whole design exists to support. " +
          "WhatsApp famously served **2 million concurrent connections per " +
          "server** with a small engineering team. The critical architectural " +
          "detail is that the scheduler is **preemptive at the bytecode " +
          "level**: a process is interrupted after a fixed number of " +
          "reductions, so one CPU-bound process cannot starve the others. " +
          "That is why Erlang has genuinely predictable latency where " +
          "cooperative async runtimes do not."
      },

      miss: [
        {
          w: "*Let it crash* means ignoring errors.",
          r: "It means not writing speculative handling for errors you cannot " +
            "predict. **Expected** errors are still handled explicitly. What " +
            "you stop doing is trying to recover a process whose state is " +
            "already unknown — restarting from a known-good state is more " +
            "reliable than repairing an unknown one."
        },
        {
          w: "Erlang processes are OS processes or threads.",
          r: "They are **VM-level green processes** — around 300 bytes each, " +
            "scheduled by the BEAM. This is what makes a million of them " +
            "feasible. They share nothing, so *process* describes isolation " +
            "rather than an OS construct."
        },
        {
          w: "Erlang is fast.",
          r: "It is **consistently latent**, not fast. Raw computational " +
            "throughput is poor — it is a dynamically typed VM with immutable " +
            "data and copying message passing. It wins on **concurrency, " +
            "predictable latency and fault tolerance**, and numeric code should " +
            "go to a NIF in C or Rust."
        },
        {
          w: "Hot code reloading means you can deploy without downtime easily.",
          r: "The mechanism is real and genuinely used, and it requires " +
            "deliberate design — versioned state migration, careful handling of " +
            "processes mid-call. It is not a free property you get by writing " +
            "Erlang; it is a capability you build for."
        }
      ],

      trade: {
        buys: [
          "Millions of isolated, cheap concurrent processes.",
          "Fault isolation with supervised restart as a first-class structure.",
          "Predictable latency under load — no stop-the-world pauses.",
          "Hot code reloading for zero-downtime upgrade.",
          "Distribution across nodes built into the language."
        ],
        costs: [
          "Poor raw numeric and single-threaded performance.",
          "Small talent pool and smaller ecosystem.",
          "Dynamic typing on a system where reliability is the point — hence " +
            "Dialyzer and gradual typing efforts.",
          "Unfamiliar syntax and a genuinely different mental model."
        ],
        avoid: [
          "CPU-bound numerical work — the VM is the wrong tool.",
          "You need a large ecosystem of libraries.",
          "The team cannot be trained on the actor model; half-understood OTP " +
            "is worse than no OTP.",
          "It is a simple CRUD service where the reliability machinery buys " +
            "nothing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "haskell",

      why: {
        before: "Functional languages were a scattered research field — " +
          "Miranda, ML, Hope, Clean — each exploring lazy evaluation and type " +
          "inference separately, with no common platform.",
        problem: "Research was fragmenting. A committee formed in 1987 to build " +
          "**one** language everyone could target, so that results were " +
          "comparable and effort compounded.",
        shift: "Commit fully to purity and see what follows. If a function " +
          "cannot have side effects, then the type signature tells you " +
          "everything it can do, evaluation order stops mattering (enabling " +
          "**laziness**), and equational reasoning about code becomes valid. " +
          "The `IO` type is the trick that makes purity survive contact with " +
          "the real world: effects become *values describing effects*, " +
          "sequenced by the runtime."
      },

      num: {
        t: "What purity buys and costs",
        h: ["Property", "Consequence"],
        r: [
          ["No side effects", "type signature is a real contract"],
          ["Lazy evaluation", "infinite structures; **space leaks**"],
          ["Immutability", "trivially parallel; more allocation"],
          ["Strong inference", "few annotations, cryptic errors"],
          ["`IO` in types", "effects visible; **colours your API**"]
        ],
        n: "**Space leaks are the characteristic Haskell production problem**: " +
          "laziness means expressions build up as unevaluated *thunks*, and a " +
          "lazy `foldl` over a large list constructs a chain of them that " +
          "consumes memory until it is forced. The fix — strictness annotations, " +
          "`foldl'`, bang patterns — requires understanding evaluation order " +
          "*in a language whose selling point is that you need not think about " +
          "it*. The other cost is the ecosystem's split between `String`, " +
          "`Text` and `ByteString`, which every real program must navigate."
      },

      miss: [
        {
          w: "Haskell programs cannot do IO because they are pure.",
          r: "`IO` is a **type**, not a prohibition. `IO Int` is a *value " +
            "describing* an action that yields an Int; the runtime executes it. " +
            "Purity is preserved because building the description is pure — " +
            "which is why you can pass actions around, store them, and compose " +
            "them like any other value."
        },
        {
          w: "Monads are the hard part of Haskell.",
          r: "A monad is an interface for sequencing — the mystique exceeds the " +
            "concept. The genuinely hard parts in practice are **reasoning " +
            "about lazy evaluation and space**, decoding type errors involving " +
            "several type classes, and the sheer breadth of language extensions " +
            "in real codebases."
        },
        {
          w: "Haskell is slow because it is functional.",
          r: "GHC produces genuinely fast native code, often within 2× of C. " +
            "The performance problems are **memory** ones — laziness causing " +
            "unpredictable allocation and space leaks — not raw arithmetic " +
            "speed. Performance work in Haskell is mostly about controlling " +
            "strictness."
        },
        {
          w: "Type safety means Haskell programs cannot have bugs.",
          r: "The type system eliminates a large and important class — null, " +
            "many state errors, mismatched effects. It says nothing about your " +
            "logic being right. *If it compiles it works* is a joke that is " +
            "true often enough to be repeated, and false often enough to matter."
        }
      ],

      trade: {
        buys: [
          "A type system that catches whole categories of bug before running.",
          "Purity makes refactoring genuinely safe.",
          "Laziness enables elegant infinite and compositional structures.",
          "Excellent for compilers, parsers and correctness-critical logic.",
          "The ideas propagate — Rust, Swift, Scala and TypeScript all borrow " +
            "from it."
        ],
        costs: [
          "Steep learning curve and an unusual mental model.",
          "Space leaks are hard to diagnose and specific to laziness.",
          "Small hiring pool.",
          "Ecosystem gaps compared with mainstream languages.",
          "Type errors can be genuinely inscrutable."
        ],
        avoid: [
          "The team cannot invest months in learning it.",
          "You need predictable memory in a hard real-time context.",
          "The problem is heavy on IO plumbing with little logic.",
          "You need a large ecosystem of maintained integrations.",
          "Hiring is a constraint, which it usually is."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cobol",

      why: {
        before: "Business programs were written in assembly, and each machine " +
          "had its own. Programs could not move between manufacturers, and only " +
          "specialists could read them.",
        problem: "The US Department of Defense faced enormous duplicated cost " +
          "rewriting the same payroll and inventory logic per machine. Grace " +
          "Hopper's contention was that business logic should be readable by " +
          "the **business people who own it**, not only by programmers.",
        shift: "Design for **readability by non-programmers**: English-like " +
          "syntax, verbose and explicit. `MULTIPLY HOURS BY RATE GIVING " +
          "GROSS-PAY`. And crucially, use **fixed-point decimal** arithmetic " +
          "rather than binary floating point, because money is decimal and " +
          "floating point silently gets it wrong."
      },

      num: {
        t: "COBOL today",
        h: ["Metric", "Figure"],
        r: [
          ["Lines still in production", "~**800 billion** (est.)"],
          ["Share of daily bank transactions", "~**95%**"],
          ["ATM transaction volume", "~95%"],
          ["Systems in Fortune 500", "~70% still use it"]
        ],
        n: "The decimal arithmetic is the technically important part and the " +
          "most under-appreciated. `0.1 + 0.2 != 0.3` in binary floating point, " +
          "and in a system processing millions of financial transactions those " +
          "errors accumulate into real money and failed audits. COBOL's " +
          "`PIC S9(7)V99 COMP-3` is exact decimal, which is why finance stayed. " +
          "Modern languages solved this eventually — Java's `BigDecimal`, " +
          "Python's `decimal` — but they were not there in 1960, and rewriting " +
          "a working exact system to gain nothing is a poor trade."
      },

      miss: [
        {
          w: "COBOL survives only because of inertia and cowardice.",
          r: "It survives because the systems **work**, are exhaustively " +
            "audited, and encode decades of accumulated regulatory edge cases " +
            "that exist nowhere else — often not in any documentation. " +
            "Rewriting is not a technical exercise; it is archaeology on " +
            "business rules nobody remembers, with money at stake if you get " +
            "one wrong."
        },
        {
          w: "COBOL programmers are all retiring and nobody can maintain it.",
          r: "The shortage is real and consistently overstated. Banks train new " +
            "developers on it, IBM runs certification programmes, and the " +
            "language is genuinely **easy to learn** — verbose and explicit by " +
            "design. The scarce skill is understanding the *business domain* " +
            "encoded in the code, not the syntax."
        },
        {
          w: "It cannot do modern things like APIs or web services.",
          r: "Modern COBOL on z/OS calls and exposes REST services, handles " +
            "JSON and XML, and interoperates with Java. The banking app on " +
            "your phone is frequently a modern front end over COBOL " +
            "transaction processing."
        },
        {
          w: "Rewriting in a modern language would obviously improve things.",
          r: "The **Commonwealth Bank of Australia** spent roughly **$750 " +
            "million over five years** on such a migration. Many similar " +
            "projects fail outright. The risk calculation on a system " +
            "processing a nation's payments is not the same as on a web " +
            "application."
        }
      ],

      trade: {
        buys: [
          "Exact decimal arithmetic — correct by construction for money.",
          "Extreme stability; programs run unchanged for decades.",
          "Readable by domain experts, which was the design goal.",
          "Enormous throughput on mainframe transaction systems.",
          "Decades of accumulated correctness and audit history."
        ],
        costs: [
          "Verbose — many times the lines of a modern equivalent.",
          "Weak abstraction facilities in older dialects.",
          "Tooling and developer experience are decades behind.",
          "Mainframe licensing is expensive.",
          "Genuine difficulty hiring, especially for domain knowledge."
        ],
        avoid: [
          "Any new system — nobody should start a project in COBOL.",
          "Anything needing a modern ecosystem or rapid iteration.",
          "Work that is not batch or transaction processing.",
          "You have a working COBOL system and someone proposes a rewrite for " +
            "its own sake — that is usually the expensive mistake."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "zig",

      why: {
        before: "C remains the systems language, and it has known hazards: " +
          "hidden control flow, implicit allocation, undefined behaviour, a " +
          "macro preprocessor that is a separate untyped language, and a build " +
          "system that is whatever you cobbled together.",
        problem: "Rust addresses memory safety with ownership and borrow " +
          "checking, at the cost of a substantial learning curve and a " +
          "different mental model. Some domains want C's simplicity and " +
          "directness with the sharp edges filed down — not a fundamentally " +
          "different paradigm.",
        shift: "**No hidden control flow, no hidden allocations.** No operator " +
          "overloading, no exceptions, no destructors running implicitly, no " +
          "preprocessor. Allocators are passed explicitly as parameters. " +
          "`comptime` replaces macros and generics with ordinary Zig code that " +
          "runs at compile time. If you cannot see it in the source, it does " +
          "not happen."
      },

      num: {
        t: "Zig against C and Rust",
        h: ["Property", "C", "Rust", "Zig"],
        r: [
          ["Memory safety", "none", "**compile-time**", "partial (runtime checks)"],
          ["Learning curve", "moderate", "**steep**", "moderate"],
          ["Hidden allocations", "some", "yes", "**none**"],
          ["Metaprogramming", "preprocessor", "macros + traits", "**`comptime`**"],
          ["C interop", "native", "via FFI", "**imports C headers directly**"]
        ],
        n: "The most immediately useful thing about Zig has little to do with " +
          "writing Zig: **`zig cc` is a drop-in C compiler with built-in " +
          "cross-compilation**. It bundles libc headers for many targets, so " +
          "cross-compiling a C project to another platform becomes one flag " +
          "instead of a toolchain odyssey. Many projects adopt Zig purely as a " +
          "build tool. On safety, be precise: Zig catches overflow, " +
          "out-of-bounds and undefined behaviour in **debug and " +
          "release-safe** builds, and it does **not** prevent use-after-free " +
          "the way Rust's borrow checker does. It is meaningfully safer than " +
          "C, not equivalent to Rust."
      },

      miss: [
        {
          w: "Zig is memory safe like Rust.",
          r: "It is **not**. There is no borrow checker and no ownership " +
            "tracking; use-after-free and double-free remain possible. Zig " +
            "provides runtime safety checks, defined behaviour where C has " +
            "undefined, and tooling like `GeneralPurposeAllocator`'s leak " +
            "detection — real improvements over C, and a different guarantee " +
            "from Rust's."
        },
        {
          w: "`comptime` is Zig's macro system.",
          r: "It is **ordinary Zig executed at compile time** — same syntax, " +
            "same semantics, full type information. There is no separate macro " +
            "language to learn and no textual substitution. Generics are just " +
            "functions taking types as `comptime` parameters."
        },
        {
          w: "Explicit allocators are boilerplate.",
          r: "They are the design's core benefit. Because every allocating " +
            "function takes an allocator, you can swap in an arena for a " +
            "request, a fixed buffer for an embedded target, or a testing " +
            "allocator that fails on leaks. In C or Rust, hidden global " +
            "allocation makes this awkward."
        },
        {
          w: "Zig is production-ready.",
          r: "It is pre-1.0 with **breaking changes between minor versions**. " +
            "Bun and TigerBeetle use it in production seriously, and doing so " +
            "means accepting migration work on every upgrade. Assess that " +
            "honestly rather than by the language's merits alone."
        }
      ],

      trade: {
        buys: [
          "C-level control with defined behaviour and runtime safety checks.",
          "No hidden control flow — the code says what happens.",
          "`comptime` unifies generics and metaprogramming.",
          "Excellent C interop: import headers directly, no bindings.",
          "`zig cc` as a cross-compiling C toolchain."
        ],
        costs: [
          "Pre-1.0 with breaking changes.",
          "Not memory safe in Rust's sense.",
          "Small ecosystem and library selection.",
          "Explicit allocators are more verbose.",
          "Small hiring pool."
        ],
        avoid: [
          "You need compile-time memory safety guarantees — use **Rust**.",
          "API stability matters and you cannot absorb breaking changes.",
          "You need a mature library ecosystem.",
          "The team has no systems programming experience.",
          "It is not systems work at all — a higher-level language is " +
            "appropriate."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "solidity",

      why: {
        before: "Bitcoin Script is deliberately **not** Turing complete — no " +
          "loops, limited operations — so a transaction's cost and termination " +
          "are provable before running it. Safe, and only capable of expressing " +
          "simple conditions.",
        problem: "Ethereum wanted arbitrary programmable contracts, which means " +
          "Turing completeness, which means the halting problem: a contract " +
          "could loop forever and every node in the network would hang.",
        shift: "**Gas.** Every operation costs a metered amount, the caller " +
          "pays up front, and execution halts when gas runs out — reverting all " +
          "state changes but keeping the fee. Termination is bought " +
          "economically rather than proved statically. Everything strange about " +
          "Solidity descends from this: an execution environment where compute " +
          "is expensive, storage is extraordinarily expensive, and code is " +
          "immutable once deployed."
      },

      num: {
        t: "Gas costs — why on-chain code looks the way it does",
        h: ["Operation", "Gas", "Note"],
        r: [
          ["Arithmetic", "3–5", "cheap"],
          ["Memory write", "3", "cheap"],
          ["`SLOAD` (storage read)", "~2,100", "cold access"],
          ["`SSTORE` (new slot)", "**20,000**", "**~4,000× arithmetic**"],
          ["Contract deployment", "32,000 + per byte", "size matters"],
          ["External call", "~2,600+", "and a reentrancy risk"]
        ],
        n: "A single storage write costs about **4,000 times** an arithmetic " +
          "operation, which explains every unusual pattern in Solidity: packing " +
          "several values into one 256-bit slot, avoiding loops over arrays " +
          "(unbounded gas), preferring events to storage for anything only " +
          "read off-chain. And the security model is unforgiving in a way " +
          "ordinary software is not: **code is immutable, public, and directly " +
          "holds money**. The 2016 DAO hack lost **~$60 million** to a " +
          "reentrancy bug — a contract sent ether before updating its balance, " +
          "and the recipient called back in before the update landed."
      },

      miss: [
        {
          w: "Smart contracts are automatically secure because they are on a " +
            "blockchain.",
          r: "The blockchain guarantees the code runs as written and cannot be " +
            "altered. If the code is wrong, that is *worse* — the bug is " +
            "immutable, public and attached to funds. Billions have been lost " +
            "to contract bugs, and the guarantee is precisely what prevents " +
            "fixing them."
        },
        {
          w: "You can update a contract to fix a bug.",
          r: "Deployed code is immutable. Upgradability requires an explicit " +
            "**proxy pattern** — a proxy delegating to a swappable " +
            "implementation — which introduces its own class of bugs (storage " +
            "layout collisions, uninitialised implementations) and reintroduces " +
            "centralised control, which is often the thing users wanted to " +
            "avoid."
        },
        {
          w: "Private variables in Solidity are private.",
          r: "`private` restricts access from **other contracts**. All contract " +
            "storage is publicly readable from the chain — anyone can read the " +
            "slot directly. There is **no secrecy on-chain**, which means " +
            "passwords, keys and hidden game state cannot be stored there."
        },
        {
          w: "`block.timestamp` and block hashes give you randomness.",
          r: "Miners and validators have influence over both, so any contract " +
            "using them for randomness is exploitable by the party producing " +
            "the block. Real randomness needs a VRF oracle such as Chainlink, " +
            "or a commit-reveal scheme."
        }
      ],

      trade: {
        buys: [
          "Programmable, verifiable execution with no trusted operator.",
          "Immutability, where that is genuinely the requirement.",
          "The largest smart-contract ecosystem and tooling.",
          "Familiar C-like syntax with a short ramp-up."
        ],
        costs: [
          "Bugs are permanent and directly financial.",
          "Extreme resource costs distort normal design.",
          "No privacy — all state is public.",
          "Reentrancy, integer and access-control pitfalls with severe " +
            "consequences.",
          "Audits are essential and expensive."
        ],
        avoid: [
          "The application does not need trustlessness — a database is " +
            "cheaper, faster and fixable.",
          "Data must be private.",
          "Logic is complex — every line is attack surface and gas cost.",
          "You cannot afford a professional audit.",
          "Computation is heavy; do it off-chain and verify on-chain."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prolog",

      why: {
        before: "Programming meant specifying **how**: the steps, the loops, " +
          "the order. Even functional languages describe a computation to " +
          "perform.",
        problem: "For a large class of problems — constraint satisfaction, " +
          "parsing, planning, expert systems — the *what* is easy to state and " +
          "the *how* is tedious search code that is easy to get wrong and " +
          "obscures the actual logic.",
        shift: "State the **facts and rules**, and let a general-purpose engine " +
          "find the answers. The engine does depth-first search with " +
          "**unification** and **backtracking**. You write a description of the " +
          "problem; the search strategy is the language's, not yours."
      },

      num: {
        t: "Where declarative logic programming fits",
        h: ["Problem type", "Prolog", "Imperative"],
        r: [
          ["Constraint satisfaction", "**natural**", "hand-written search"],
          ["Parsing (DCG)", "**a few lines**", "a parser generator"],
          ["Rule-based reasoning", "**direct**", "an engine to build"],
          ["Numerical computation", "poor", "natural"],
          ["Stateful systems", "awkward", "natural"]
        ],
        n: "**Definite Clause Grammars** are the underrated feature: a grammar " +
          "written almost as BNF becomes a working parser, and — because " +
          "Prolog relations are bidirectional — the same code can *generate* " +
          "sentences as well as parse them. That bidirectionality is the deep " +
          "idea: `append(X, Y, [1,2,3])` enumerates every way to split the " +
          "list, because you defined a *relation*, not a function. Prolog is " +
          "also still used in production — **IBM Watson** used it for parsing " +
          "in the Jeopardy system, and SICStus runs airline scheduling."
      },

      miss: [
        {
          w: "Prolog is a purely declarative language.",
          r: "It is declarative in intent and **operationally sensitive** in " +
            "practice. Clause order and goal order determine the search path, " +
            "and reordering two clauses can turn a terminating program into an " +
            "infinite loop. You cannot write Prolog well without a model of " +
            "how the engine explores."
        },
        {
          w: "The cut operator is just an optimisation.",
          r: "`!` prunes the search tree and **changes the meaning** of a " +
            "program, not only its speed. A *red cut* removes solutions that " +
            "would otherwise be found. It is the main place where Prolog's " +
            "declarative reading breaks down, and where its subtlest bugs live."
        },
        {
          w: "Prolog is obsolete AI technology from the 1980s.",
          r: "Logic programming is alive in its descendants: **Datalog** in " +
            "static analysis and database engines, **Answer Set Programming** " +
            "in planning, **MiniZinc** in constraint solving, and Datomic's " +
            "query language. The paradigm outlived the expert-systems hype " +
            "that popularised it."
        },
        {
          w: "It is slow because it searches exhaustively.",
          r: "Modern implementations are heavily optimised — first-argument " +
            "indexing, last-call optimisation, WAM compilation. Naive Prolog on " +
            "a badly ordered program is slow; well-written Prolog on a suitable " +
            "problem is competitive with hand-written search, and vastly " +
            "shorter."
        }
      ],

      trade: {
        buys: [
          "Problems stated as relations rather than procedures.",
          "Search, backtracking and unification for free.",
          "Bidirectional relations — one definition, many query modes.",
          "DCGs make parsers almost trivial.",
          "Extremely concise for rule-based reasoning."
        ],
        costs: [
          "The declarative reading leaks; execution order matters.",
          "Cut is powerful and semantically dangerous.",
          "Poor for numerical and stateful work.",
          "Performance is hard to reason about.",
          "Small ecosystem and hiring pool."
        ],
        avoid: [
          "The problem is procedural or numeric.",
          "You need predictable performance.",
          "The team has no logic programming background.",
          "A dedicated constraint solver or SAT solver fits better — often it " +
            "does.",
          "You need a broad library ecosystem."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ada",

      why: {
        before: "The US Department of Defense was maintaining software in " +
          "**over 450 different programming languages** across its embedded " +
          "systems, at ruinous cost and with no shared assurance story.",
        problem: "Beyond the cost, these were systems where a bug kills people " +
          "— avionics, weapons, air traffic control. The languages in use had " +
          "no facilities for expressing safety constraints, and testing alone " +
          "cannot establish the required confidence.",
        shift: "Design a language where **the compiler enforces domain " +
          "constraints**. Not just *this is an integer* but *this is an angle " +
          "between 0 and 360, and it is not interchangeable with a distance*. " +
          "Strong typing extended to ranges and units, mandatory runtime " +
          "checks, and concurrency built into the language rather than a " +
          "library."
      },

      num: {
        t: "What the type system catches",
        h: ["Ada declaration", "Prevents"],
        r: [
          ["`type Angle is range 0 .. 359`", "out-of-range at compile or run time"],
          ["`type Metres is new Float`", "**adding metres to feet**"],
          ["`Ada.Numerics` fixed point", "float rounding in money"],
          ["`pragma Restrictions`", "banned constructs, provably"],
          ["SPARK subset", "**formal proof** of absence of runtime errors"]
        ],
        n: "The unit-confusion example is not hypothetical: the **Mars Climate " +
          "Orbiter** was lost in 1999 because one team used pound-force seconds " +
          "and another newton-seconds — a class of error Ada's distinct types " +
          "make a compile error. **SPARK**, a verifiable Ada subset, allows " +
          "**mathematical proof** that a program is free of runtime errors, and " +
          "is used in avionics certified to DO-178C Level A. Ada is in the " +
          "Boeing 777, Airbus fly-by-wire, and numerous rail signalling systems. " +
          "Note the counterexample though: **Ariane 5** flight 501 was Ada, and " +
          "failed because a range check was *deliberately disabled* for " +
          "performance on a value reused from Ariane 4."
      },

      miss: [
        {
          w: "Ada is a dead language from the 1980s.",
          r: "Ada 2022 is current, GNAT is a maintained GCC frontend, and it is " +
            "actively used in avionics, rail, space and defence. It is " +
            "**niche**, not dead — and in its niche it is often mandated."
        },
        {
          w: "Ada is verbose for the sake of it.",
          r: "The verbosity is deliberate: explicit `in`/`out` parameter modes, " +
            "named associations, no implicit conversions. In a domain where the " +
            "code is read far more often than written and reviewed by " +
            "certification authorities, explicitness is the requirement, not an " +
            "accident."
        },
        {
          w: "Rust makes Ada unnecessary now.",
          r: "They overlap and differ. Rust prevents **memory** errors; Ada's " +
            "strength is **domain** constraints — ranges, units, fixed point — " +
            "plus formal verification through SPARK and decades of " +
            "certification evidence. For a system needing DO-178C Level A " +
            "certification, that certification history is itself the asset."
        },
        {
          w: "Ada's runtime checks make it too slow for embedded work.",
          r: "Checks can be disabled per region where proven unnecessary, and " +
            "Ada compiles to efficient native code. The Ariane 5 failure is " +
            "cited as evidence *for* the checks — disabling one is precisely " +
            "what caused the loss."
        }
      ],

      trade: {
        buys: [
          "A type system that encodes domain constraints, not just data " +
            "layout.",
          "Runtime checks catching violations rather than corrupting state.",
          "Concurrency in the language with well-defined semantics.",
          "SPARK offers formal proof of runtime-error freedom.",
          "Extensive certification track record in safety-critical domains."
        ],
        costs: [
          "Verbose, and slower to write.",
          "Very small talent pool.",
          "Limited ecosystem outside its niche.",
          "Commercial certified toolchains are expensive.",
          "Steep learning curve for its advanced features."
        ],
        avoid: [
          "Ordinary application or web development.",
          "Rapid iteration is the priority.",
          "You need a large ecosystem.",
          "You need memory safety without domain modelling — **Rust** is more " +
            "practical and easier to hire for.",
          "Nobody is going to certify the system, in which case you are paying " +
            "for assurance you will not use."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "elixir",

      why: {
        before: "Erlang's BEAM VM had solved concurrency and fault tolerance " +
          "better than anything else, and almost nobody used it. The barrier " +
          "was largely surface: Prolog-derived syntax, sparse tooling, and a " +
          "small ecosystem.",
        problem: "Twenty-five years of proven reliability engineering was " +
          "locked behind an unfamiliar language. José Valim's observation was " +
          "that the **runtime** was the valuable part, not the syntax.",
        shift: "Keep the VM, replace everything around it. Ruby-influenced " +
          "syntax, a real macro system, a proper build tool (`mix`), a package " +
          "manager (`hex`), documentation as a first-class language feature, " +
          "and polymorphism through protocols. Same OTP guarantees, " +
          "dramatically lower barrier to entry."
      },

      num: {
        t: "What Elixir adds to Erlang",
        h: ["Feature", "Erlang", "Elixir"],
        r: [
          ["Syntax", "Prolog-derived", "Ruby-influenced"],
          ["Macros", "limited parse transforms", "**full, hygienic**"],
          ["Build tool", "rebar3", "**mix**"],
          ["Docs", "edoc", "**built into the language**"],
          ["Protocols", "no", "**yes**"],
          ["Runtime, OTP, processes", "**identical**", "**identical**"]
        ],
        n: "The bottom row is the important one: **Elixir compiles to BEAM " +
          "bytecode and can call any Erlang library with zero overhead**. It is " +
          "not a wrapper or a transpiler — the two are genuinely " +
          "interoperable. **Phoenix LiveView** is the ecosystem's distinctive " +
          "result: server-rendered real-time UI over a websocket, with each " +
          "connection a cheap BEAM process. That architecture is only practical " +
          "*because* processes cost ~300 bytes — it would be absurd on a " +
          "thread-per-connection runtime."
      },

      miss: [
        {
          w: "Elixir is a new language that replaced Erlang.",
          r: "They run on the **same VM**, share the same OTP libraries, and " +
            "interoperate freely. Elixir is an alternative surface on a shared " +
            "runtime. Erlang continues to be developed and Elixir depends on it."
        },
        {
          w: "Elixir is fast because it is compiled and functional.",
          r: "It inherits the BEAM's characteristics exactly: **excellent " +
            "concurrency and predictable latency, mediocre single-threaded " +
            "numeric performance**. CPU-heavy work should go to a NIF or " +
            "Rustler. Choosing Elixir for raw speed is choosing it for the " +
            "wrong reason."
        },
        {
          w: "You do not need to learn OTP to use Elixir.",
          r: "You can write scripts without it, and any real concurrent system " +
            "needs GenServer, supervisors and the process model. Elixir " +
            "**lowers the syntax barrier and not the conceptual one** — the " +
            "actor model, supervision trees and let-it-crash still have to be " +
            "learned."
        },
        {
          w: "The Ruby-like syntax means it works like Ruby.",
          r: "It is functional and immutable with pattern matching and no " +
            "objects. `=` is a **match operator**, not assignment. The " +
            "familiarity is genuinely surface-level, and expecting Ruby " +
            "semantics is a reliable source of confusion."
        }
      ],

      trade: {
        buys: [
          "BEAM's concurrency and fault tolerance with an approachable " +
            "surface.",
          "Excellent tooling — mix, hex, ExUnit, built-in docs.",
          "Phoenix and LiveView for real-time applications.",
          "Full Erlang interoperability with no cost.",
          "Predictable latency under heavy concurrent load."
        ],
        costs: [
          "Weak single-threaded numeric performance.",
          "Smaller ecosystem than mainstream languages.",
          "OTP is still a substantial concept to learn.",
          "Smaller hiring pool.",
          "Dynamic typing, though gradual types are arriving."
        ],
        avoid: [
          "The workload is CPU-bound number crunching.",
          "You need a very large library ecosystem.",
          "The problem is a simple CRUD service with no concurrency demands.",
          "The team cannot invest in learning OTP — the benefits come from it.",
          "You need static typing guarantees today."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
