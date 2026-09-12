/* ==========================================================================
   Depth pass 43 — how code is expressed and executed, plus the three
   canonical string/selection DP problems.

   Declarative and imperative are not a style preference; they are a decision
   about who owns the execution strategy. The DP trio here — knapsack, LCS
   and edit distance — are worth knowing as *shapes*, because most real DP
   problems are one of them wearing different clothes.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "imperative-programming",

      why: {
        before: "Early machines were programmed by describing exactly what the " +
          "hardware should do: load this register, add, jump if zero. The " +
          "program **was** the sequence of state changes.",
        problem: "That model matches the hardware perfectly and matches human " +
          "reasoning poorly at scale. Every statement can modify state that " +
          "any other statement reads, so understanding one line eventually " +
          "requires understanding the order of everything before it.",
        shift: "Imperative programming is not an error to be corrected — it is " +
          "the model where **you specify the steps and the sequence, and " +
          "mutation is the mechanism**. Its strength is exactly its " +
          "directness: the code maps closely onto what the machine does, so " +
          "performance is predictable and control is total. Its cost is that " +
          "correctness depends on tracking state through time."
      },

      num: {
        t: "What the two models cost you",
        h: ["", "Imperative", "Declarative"],
        r: [
          ["You specify", "**the steps**", "**the result**"],
          ["Execution strategy owned by", "**you**", "**the system**"],
          ["Performance", "**predictable — you control it**", "depends on the engine"],
          ["**Optimisation across statements**", "**limited — order is semantics**", "**free — the engine may reorder**"],
          ["Reasoning", "trace state over time", "read the specification"],
          ["Debugging", "**step through it**", "**inspect the plan**"]
        ],
        n: "The **optimisation** row is the trade in its sharpest form. Because " +
          "an imperative loop's order is part of its meaning, a compiler may " +
          "only reorder it when it can prove nothing observable changes — and " +
          "with pointers and shared mutable state, it usually cannot. A SQL " +
          "query states no order, so the planner is free to choose join order, " +
          "index use and parallelism. You gave up control and received " +
          "optimisation you could not have written by hand. Note that most " +
          "real languages are **both**: Python is imperative with declarative " +
          "comprehensions, React describes UI declaratively while its " +
          "reconciler is imperative underneath. The useful question is never " +
          "*which language* but **which model fits this particular piece of " +
          "logic**."
      },

      miss: [
        {
          w: "Imperative programming is outdated.",
          r: "Every declarative system is **implemented imperatively** " +
            "underneath — SQL engines, React reconcilers and garbage " +
            "collectors are all imperative code. It remains the right model " +
            "wherever precise control over sequence and resources matters."
        },
        {
          w: "Imperative means object-oriented.",
          r: "OOP is one **organisational** style within the imperative model. " +
            "C is imperative and not object-oriented; procedural code is " +
            "imperative. The axis imperative/declarative is independent of the " +
            "axis procedural/object-oriented."
        },
        {
          w: "Imperative code is always faster.",
          r: "It is more **predictable**, which is not the same thing. A SQL " +
            "planner routinely beats hand-written imperative joins because it " +
            "knows table statistics and index selectivity at run time. " +
            "Declarative gives up control and can gain optimisations you would " +
            "not have written."
        },
        {
          w: "Loops make code imperative.",
          r: "A loop with **no mutation of external state** is closer to " +
            "functional style. What makes code imperative is that **sequence " +
            "and state change carry the meaning** — reordering statements " +
            "changes the result."
        }
      ],

      trade: {
        buys: [
          "Direct control over execution order and resources.",
          "Predictable performance and memory behaviour.",
          "Maps closely to hardware — the model for systems code.",
          "Straightforward step-through debugging.",
          "No engine to fight when the fast path matters."
        ],
        costs: [
          "Correctness depends on state through time.",
          "Mutation makes concurrency hard.",
          "Limited compiler reordering.",
          "More code for the same intent.",
          "Reasoning requires tracing execution."
        ],
        avoid: [
          "The problem is naturally a query or transformation.",
          "Concurrency makes shared mutable state a liability.",
          "A declarative engine can optimise better than you can.",
          "The *how* genuinely does not matter."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "declarative-programming",

      why: {
        before: "Retrieving data meant writing the retrieval: open the file, " +
          "seek, loop, compare, collect. Change the index and the retrieval " +
          "code had to change with it.",
        problem: "Encoding the strategy in the program **freezes** it. A better " +
          "algorithm, a new index, a different data distribution — none can " +
          "be exploited without rewriting. And the strategy is usually the " +
          "part the programmer knows least about, because it depends on run-" +
          "time facts like table sizes and cardinality.",
        shift: "**State the result, let the system choose the strategy.** SQL, " +
          "HTML, CSS, regular expressions, Terraform, React's render function " +
          "and Prolog all share this: they describe *what*, and an engine " +
          "decides *how*. The engine can then use information you do not have " +
          "at the time you write the code — and change its plan as that " +
          "information changes."
      },

      num: {
        t: "Familiar declarative systems",
        h: ["System", "You declare", "The engine decides"],
        r: [
          ["**SQL**", "**the result set**", "**join order, indexes, parallelism**"],
          ["CSS", "the appearance", "layout and paint order"],
          ["**React**", "**UI for a given state**", "**DOM operations to apply**"],
          ["Terraform", "desired infrastructure", "create/update/destroy order"],
          ["Regex", "the pattern", "the matching automaton"],
          ["Make", "targets and dependencies", "**build order and parallelism**"]
        ],
        n: "The **SQL** row shows both the gain and the characteristic " +
          "failure. A planner reading live statistics can choose a hash join " +
          "over a nested loop and pick a better index than you would have, so " +
          "the same query gets faster when the database improves. But when it " +
          "chooses badly, you cannot simply fix it — you **hint, restructure " +
          "or update statistics** and hope, because the imperative escape " +
          "hatch is gone. That is the general shape of declarative debugging: " +
          "you do not step through execution, you **inspect the plan** " +
          "(`EXPLAIN`, the React profiler, `terraform plan`). The other " +
          "recurring cost is the performance cliff — behaviour is excellent " +
          "until a query pattern falls outside what the engine handles well, " +
          "and then it degrades sharply with little warning."
      },

      miss: [
        {
          w: "Declarative means functional programming.",
          r: "They overlap and are distinct. SQL, HTML and CSS are declarative " +
            "and not functional. Functional programming is one **route** to " +
            "declarative expression, not a synonym for it."
        },
        {
          w: "Declarative code is always slower.",
          r: "Often the opposite. A query planner uses **run-time statistics** " +
            "unavailable when the code was written. Declarative loses on " +
            "**predictability** rather than on speed — you cannot be sure which " +
            "plan you will get."
        },
        {
          w: "You do not need to understand the implementation.",
          r: "Until performance matters. Effective SQL requires understanding " +
            "indexes and join strategies; effective React requires " +
            "understanding reconciliation and memoisation. The abstraction " +
            "**leaks precisely where it matters most**."
        },
        {
          w: "Declarative systems are easier to debug.",
          r: "They are **differently** hard. You cannot step through " +
            "execution, so you inspect a plan instead. A slow query and a " +
            "React component re-rendering too often both require reasoning " +
            "about an engine's decisions rather than about your own code."
        }
      ],

      trade: {
        buys: [
          "Far less code for the same intent.",
          "The engine optimises using run-time information.",
          "Improvements arrive free when the engine improves.",
          "Intent is explicit — the code reads as a specification.",
          "Parallelism and reordering come free."
        ],
        costs: [
          "Unpredictable performance — the plan may change.",
          "Limited control when the engine chooses badly.",
          "Debugging means reading plans, not stepping code.",
          "Performance cliffs outside the supported patterns.",
          "Still requires understanding the implementation to tune."
        ],
        avoid: [
          "Precise control over execution is required.",
          "Predictable latency matters more than average throughput.",
          "The engine's model does not fit the problem.",
          "You are writing the engine itself."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pointer",

      why: {
        before: "Variables hold values. Passing a large structure to a " +
          "function copies it; two parts of a program cannot refer to the same " +
          "object; data structures cannot link to one another.",
        problem: "Copying a megabyte to pass it is wasteful, and some " +
          "structures are impossible without indirection. A linked list, a " +
          "tree, a graph — all require one piece of data to **refer** to " +
          "another rather than contain it.",
        shift: "**Store an address instead of a value.** A pointer is a " +
          "variable whose content is a memory location. Passing it costs 8 " +
          "bytes regardless of what it points to, two references can name the " +
          "same object, and structures can link to each other arbitrarily. " +
          "Every reference, every object handle, and every garbage-collected " +
          "language's variables are pointers — the difference is only how much " +
          "the language lets you see and do."
      },

      num: {
        t: "What can go wrong",
        h: ["Failure", "Cause", "Symptom"],
        r: [
          ["**Null dereference**", "**pointer never assigned**", "crash — the good case"],
          ["**Dangling pointer**", "**target freed**", "**reads garbage or corrupts**"],
          ["Use-after-free", "freed then used", "**exploitable vulnerability**"],
          ["Double free", "freed twice", "heap corruption"],
          ["Memory leak", "never freed", "growth until exhaustion"],
          ["Buffer overrun", "pointer arithmetic past the end", "**corruption, often exploitable**"]
        ],
        n: "The table is the reason for most of the last thirty years of " +
          "language design. Microsoft and Google have both reported that " +
          "roughly **70% of their serious security vulnerabilities are memory " +
          "safety issues** — overwhelmingly the dangling and overrun rows. " +
          "**Null dereference is the mild case**, because it crashes " +
          "immediately at a location you can see; a **use-after-free** may " +
          "work fine until the memory is reallocated, then corrupt unrelated " +
          "data or hand an attacker control. Every subsequent design responds " +
          "to this: garbage collection removes manual freeing, **Rust's " +
          "ownership and borrow checker** prevents dangling references at " +
          "compile time with no run-time cost, and **smart pointers** in " +
          "modern C++ tie lifetime to scope. Note also that a pointer's size " +
          "is fixed by the architecture — **8 bytes on 64-bit** — regardless " +
          "of the size of what it points to."
      },

      miss: [
        {
          w: "Languages without pointers do not use them.",
          r: "Java, Python, JavaScript and Go all use pointers " +
            "**pervasively** — every object variable is a reference. What they " +
            "remove is **arithmetic on pointers and manual freeing**, not " +
            "indirection itself. `NullPointerException` is the name of the " +
            "first row in that table."
        },
        {
          w: "A null pointer is the dangerous case.",
          r: "It is the **safest** failure — an immediate, localised crash. A " +
            "**dangling** pointer to freed memory may read plausible garbage " +
            "or let an attacker control what is there. Silent corruption is " +
            "far worse than a crash."
        },
        {
          w: "Passing by pointer is always faster.",
          r: "For small values it can be **slower** — you pay an extra memory " +
            "dereference and lose cache locality, where an 8-byte value would " +
            "have travelled in a register. Pointers pay off for large " +
            "structures or when mutation must be visible to the caller."
        },
        {
          w: "Garbage collection eliminates all pointer problems.",
          r: "It eliminates dangling pointers and double frees. **Leaks " +
            "remain** — a reference held in a cache or listener list keeps an " +
            "object alive forever — and null dereferences remain. GC removes a " +
            "class of bugs, not the category."
        }
      ],

      trade: {
        buys: [
          "Pass large data at constant cost.",
          "Shared references to one object.",
          "Linked structures — lists, trees, graphs.",
          "Dynamic allocation sized at run time.",
          "Direct memory control for systems work."
        ],
        costs: [
          "The dominant source of memory-safety vulnerabilities.",
          "Manual lifetime management is error-prone.",
          "Indirection costs a dereference and hurts cache locality.",
          "Nullability must be handled everywhere.",
          "Aliasing makes reasoning and optimisation harder."
        ],
        avoid: [
          "The value is small — pass by value.",
          "A safer abstraction fits — references, smart pointers, ownership.",
          "You cannot establish clear lifetime rules.",
          "The language provides safe collections that do the job."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "integer-overflow",

      why: {
        before: "Mathematical integers are unbounded. Machine integers are " +
          "not: a fixed number of bits holds a fixed range of values, and " +
          "arithmetic is done in that fixed width.",
        problem: "When a result exceeds the range, the extra bits are simply " +
          "**gone**. In most languages there is no error — a 32-bit signed " +
          "`2,147,483,647 + 1` becomes **−2,147,483,648**. The number wraps " +
          "from the largest positive to the most negative, and execution " +
          "continues as if nothing happened.",
        shift: "Treat the range as a real constraint that must be reasoned " +
          "about. Overflow has grounded aircraft, destroyed rockets and " +
          "produced security vulnerabilities — Ariane 5's 1996 explosion was a " +
          "64-bit float converted to a 16-bit integer. Modern languages " +
          "respond in different ways: **checked arithmetic**, **arbitrary " +
          "precision**, or **explicitly defined wrapping**."
      },

      num: {
        t: "Ranges worth knowing",
        h: ["Type", "Maximum", "Overflows at"],
        r: [
          ["int8", "127", "128 items"],
          ["int16", "32,767", "**Ariane 5**"],
          ["**int32**", "**2,147,483,647**", "**2038 for Unix seconds**"],
          ["**uint32**", "**4,294,967,295**", "**IPv4 address space**"],
          ["int64", "9.2 × 10¹⁸", "~292 years of nanoseconds"],
          ["**JS Number**", "**2⁵³ − 1**", "**large IDs lose precision**"]
        ],
        n: "Three of these rows are live production issues rather than " +
          "history. The **2038 problem** is real and being fixed now: 32-bit " +
          "`time_t` overflows on 19 January 2038, and embedded systems shipping " +
          "today will still be running. The **JavaScript** row bites " +
          "constantly — JS numbers are IEEE-754 doubles with 53 bits of " +
          "integer precision, so a 64-bit database ID or a Twitter snowflake ID " +
          "**silently loses its low digits** when parsed from JSON, which is " +
          "why APIs return large IDs as strings. Language behaviour differs " +
          "sharply and matters: **C signed overflow is undefined behaviour** " +
          "(the compiler may assume it cannot happen and delete your check), " +
          "**unsigned wraps** by definition, **Rust panics in debug and wraps " +
          "in release**, **Python promotes to arbitrary precision**, and " +
          "**Java wraps silently**. The classic defensive bug is writing " +
          "`if (a + b > MAX)` — which itself overflows; check " +
          "`if (a > MAX - b)` instead."
      },

      miss: [
        {
          w: "Overflow throws an error.",
          r: "In C, C++, Java, C# and Go it **wraps silently**. In C, signed " +
            "overflow is **undefined behaviour** — the compiler may assume it " +
            "never happens and remove code that checks for it. Only some " +
            "languages check, and often only in debug builds."
        },
        {
          w: "64-bit integers make overflow a non-issue.",
          r: "They make it rarer, not impossible. **Multiplication** overflows " +
            "quickly — two values near 10¹⁰ exceed int64. Accumulating sums, " +
            "factorials and hash computations all overflow 64 bits routinely."
        },
        {
          w: "JavaScript has no integer overflow.",
          r: "It has a **precision** limit instead. Above 2⁵³ − 1, integers " +
            "lose accuracy silently — `9007199254740993` evaluates to " +
            "`9007199254740992`. Large database IDs from JSON are corrupted " +
            "unless transmitted as strings or handled with `BigInt`."
        },
        {
          w: "Checking with `if (a + b > MAX)` prevents it.",
          r: "The check **itself overflows** — by the time you compare, the " +
            "damage is done. Check `if (a > MAX - b)` instead, or use " +
            "checked-arithmetic intrinsics such as `__builtin_add_overflow` or " +
            "Rust's `checked_add`."
        }
      ],

      trade: {
        buys: [
          "Fixed-width integers are fast and predictable in size.",
          "Wrapping is well-defined and useful for hashes and checksums.",
          "Hardware supports them directly — single instructions.",
          "Memory layout is exact and known."
        ],
        costs: [
          "Silent wrapping produces wrong results with no signal.",
          "Undefined behaviour in C makes checks unreliable.",
          "Historically a major source of security vulnerabilities.",
          "Naive overflow checks overflow themselves.",
          "Range limits must be reasoned about at every boundary."
        ],
        avoid: [
          "Values may plausibly exceed the range — use 64-bit or arbitrary " +
            "precision.",
          "Money or exact accounting — use decimal or integer minor units.",
          "Cryptographic code where wrapping breaks assumptions.",
          "Large IDs crossing a JavaScript boundary — send strings."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sorting-stability",

      why: {
        before: "A sort's job seemed complete once the output was in order. " +
          "Two elements comparing equal could appear in either order, and it " +
          "made no visible difference in isolation.",
        problem: "It makes a difference when you sort **more than once**. Sort " +
          "employees by name, then by department: with an unstable sort, the " +
          "names within each department come out scrambled, and the first sort " +
          "was wasted. Users notice a table that reshuffles rows when they " +
          "sort by a second column.",
        shift: "**Stability** means equal elements keep their original " +
          "relative order. It turns multi-key sorting into a sequence of " +
          "single-key sorts applied from **least** significant to **most** " +
          "significant — and it is what makes radix sort work at all."
      },

      num: {
        t: "Which sorts are stable",
        h: ["Sort", "Stable?", "Note"],
        r: [
          ["**Merge sort**", "**yes**", "**take from the left on ties**"],
          ["**Timsort**", "**yes**", "**Python, Java objects**"],
          ["Insertion sort", "yes", "stop at equal"],
          ["Counting / radix", "**yes**", "**radix depends on it**"],
          ["**Quicksort**", "**no**", "**partition swaps distant elements**"],
          ["**Heapsort**", "**no**", "sift-down reorders"]
        ],
        n: "The split explains a real API decision: **Java's `Arrays.sort` " +
          "uses Timsort for objects and dual-pivot quicksort for primitives**. " +
          "Primitives have no identity beyond their value, so stability is " +
          "meaningless for them and quicksort's smaller constants win; objects " +
          "have identity, so stability is observable and worth paying for. " +
          "**C++'s `std::sort` is not stable** — `std::stable_sort` exists " +
          "separately and uses more memory. Two practical notes: any unstable " +
          "sort can be **made stable** by appending the original index as a " +
          "tiebreaker, at the cost of `O(n)` memory; and for multi-key " +
          "sorting, sorting by a **composite comparator in one pass** is " +
          "usually faster than several stable passes, though the stable-passes " +
          "approach composes better when the sort keys are chosen at run time."
      },

      miss: [
        {
          w: "Stability only matters for equal elements, so it rarely matters.",
          r: "It matters whenever elements are **equal on the sort key but " +
            "differ elsewhere** — which is most real data. Sorting a table of " +
            "people by department has many ties on department and different " +
            "names underneath."
        },
        {
          w: "For multi-key sorting, sort by the primary key first.",
          r: "**Backwards.** With stable sorts you sort by the **least** " +
            "significant key first and the most significant last, so each pass " +
            "preserves the previous ordering within ties. Sorting by primary " +
            "first means the secondary sort destroys it."
        },
        {
          w: "An unstable sort cannot be made stable.",
          r: "Append the **original index** as a final tiebreaker in the " +
            "comparator and no two elements compare equal, making the result " +
            "deterministic and stable. It costs `O(n)` memory for the indices."
        },
        {
          w: "Stable sorts are always slower.",
          r: "Timsort **beats** quicksort on the structured data real programs " +
            "sort. The genuine cost of stability is usually **memory** — merge " +
            "sort's `O(n)` buffer — rather than time. Whether that trade is " +
            "worth it depends on the data, not on stability itself."
        }
      ],

      trade: {
        buys: [
          "Multi-key sorting by successive single-key passes.",
          "Predictable, reproducible output ordering.",
          "Required for radix sort's correctness.",
          "Preserves meaningful input order such as insertion sequence.",
          "Users see stable table behaviour across column sorts."
        ],
        costs: [
          "Usually requires `O(n)` extra memory.",
          "Rules out in-place quicksort and heapsort.",
          "Index tiebreaking costs memory and comparator work.",
          "Slightly larger constant factors."
        ],
        avoid: [
          "Elements have no identity beyond the sort key — primitives.",
          "Memory is tight and in-place sorting is required.",
          "There are no ties on the key.",
          "A composite comparator handles all keys in one pass."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "knapsack",

      why: {
        before: "Choosing the best subset under a budget — which features fit " +
          "in the sprint, which cargo fits in the truck, which investments fit " +
          "the capital — was done greedily by value-to-weight ratio.",
        problem: "That greedy rule is **provably wrong** for indivisible " +
          "items. With a capacity of 10 and items of (weight 6, value 10) and " +
          "two of (weight 5, value 6), the best ratio picks the first for a " +
          "value of 10; taking the two fives gives 12. Checking all subsets is " +
          "`2ⁿ`.",
        shift: "**Dynamic programming over remaining capacity.** For each item " +
          "and each capacity, either take the item or do not, keeping the " +
          "better outcome. `O(n·W)` time, and the problem has optimal " +
          "substructure because the best use of the remaining capacity does " +
          "not depend on how you got there. Knapsack is the archetype of " +
          "selection-under-constraint, and a great many real problems reduce " +
          "to it."
      },

      num: {
        t: "The variants",
        h: ["Variant", "Each item", "Greedy optimal?"],
        r: [
          ["**0/1 knapsack**", "**take or leave, once**", "**no — needs DP**"],
          ["**Fractional**", "**divisible**", "**yes — sort by ratio**"],
          ["Unbounded", "unlimited copies", "no"],
          ["Bounded", "at most k copies", "no"],
          ["Subset sum", "values equal weights", "no"]
        ],
        n: "The **fractional** row is the instructive contrast: allowing items " +
          "to be split makes greedy provably optimal, because you can always " +
          "fill the remaining capacity with the best available ratio. " +
          "Indivisibility alone makes it NP-hard. The `O(n·W)` bound needs an " +
          "important qualification — it is **pseudo-polynomial**, polynomial " +
          "in the *value* of `W` but **exponential in the number of bits** " +
          "used to write it. A capacity of one billion makes the table " +
          "unusable even with only 50 items, which is why knapsack is NP-hard " +
          "despite having a DP solution. The **space optimisation** is the " +
          "detail worth carrying: 0/1 knapsack collapses to a single row " +
          "**iterated backwards**, because iterating forwards would let one " +
          "item be picked twice in the same pass — turning it accidentally " +
          "into the unbounded variant."
      },

      miss: [
        {
          w: "Take items by best value-to-weight ratio.",
          r: "That is optimal for **fractional** knapsack only. For 0/1 it " +
            "fails — a single high-ratio item can block two lower-ratio items " +
            "that together are worth more. Indivisibility is exactly what " +
            "breaks the greedy argument."
        },
        {
          w: "`O(n·W)` means knapsack is polynomial, so it is not NP-hard.",
          r: "It is **pseudo-polynomial**: polynomial in the numeric value of " +
            "`W` but exponential in its **bit length**. A capacity of 10⁹ " +
            "makes the table unusable. This is the standard example of the " +
            "distinction."
        },
        {
          w: "The 1D space optimisation iterates forwards.",
          r: "It must iterate **backwards** over capacity. Forwards allows an " +
            "item already taken at a smaller capacity to be taken again in the " +
            "same pass — which silently solves the **unbounded** variant " +
            "instead of 0/1."
        },
        {
          w: "It is an academic exercise.",
          r: "Resource allocation, sprint planning under capacity, cargo " +
            "loading, ad selection under a budget, cloud instance packing and " +
            "portfolio selection are all knapsack. Recognising the shape is " +
            "the point of learning it."
        }
      ],

      trade: {
        buys: [
          "Optimal selection under a capacity constraint.",
          "`O(n·W)` — practical when capacity is modest.",
          "Space reduces to `O(W)` with a backwards single row.",
          "A recognisable shape that many real problems reduce to.",
          "Extends to multiple constraints and bounded counts."
        ],
        costs: [
          "Pseudo-polynomial — fails for large capacities.",
          "Memory proportional to the capacity.",
          "Requires integer weights.",
          "Space optimisation loses which items were chosen.",
          "Multiple constraints multiply the state space."
        ],
        avoid: [
          "Items are divisible — greedy by ratio is optimal and far cheaper.",
          "Capacity is very large — use approximation or ILP solvers.",
          "Weights are continuous rather than integer.",
          "A good-enough answer suffices — greedy is a decent approximation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "longest-common-subsequence",

      why: {
        before: "Comparing two versions of a file meant comparing them line by " +
          "line in order. Any insertion near the top made every subsequent " +
          "line appear changed.",
        problem: "The real question is not *which lines differ by position* " +
          "but **which lines are shared, in order**. Answering that by " +
          "checking every subsequence is `2ⁿ` — a 100-line file has more " +
          "subsequences than there are atoms in the observable universe.",
        shift: "**Dynamic programming over the two indices.** If the current " +
          "characters match, the LCS extends by one; if not, take the better " +
          "of skipping one from either side. `O(n·m)` time, and the result " +
          "identifies exactly what is common — so everything *not* in the LCS " +
          "is what changed. This is the engine inside `diff`, `git`, and every " +
          "code review tool you have used."
      },

      num: {
        t: "Subsequence against substring",
        h: ["", "Subsequence", "Substring"],
        r: [
          ["Contiguous", "**no**", "**yes**"],
          ["\"ACE\" in \"ABCDE\"", "**yes**", "no"],
          ["Solved by", "**DP, O(n·m)**", "**suffix automaton, O(n+m)**"],
          ["Used for", "**diff, version control**", "text search"],
          ["Relation to edit distance", "**directly related**", "unrelated"]
        ],
        n: "**Subsequence and substring are different problems with different " +
          "algorithms**, and confusing them is the most common misreading of " +
          "the problem statement. When only insertions and deletions are " +
          "allowed, LCS and edit distance are two views of one quantity: " +
          "`edit distance = n + m − 2 × LCS`. Two practical notes. Space can " +
          "be reduced to `O(min(n, m))` by keeping two rows, but that " +
          "**loses the ability to reconstruct the actual sequence** — and for " +
          "diff, the sequence *is* the output, which is why **Hirschberg's " +
          "algorithm** exists: it recovers the alignment in linear space using " +
          "divide-and-conquer at `O(n·m)` time. Real diff tools do not use " +
          "plain LCS either; **Myers' algorithm** runs in `O(nd)` where `d` is " +
          "the number of differences, which is near-linear for the small " +
          "changes typical of a commit."
      },

      miss: [
        {
          w: "Subsequence means substring.",
          r: "A **subsequence** need not be contiguous — `ACE` is a " +
            "subsequence of `ABCDE` but not a substring. They are different " +
            "problems: LCS is `O(n·m)` DP, longest common **substring** is " +
            "solvable in `O(n + m)` with a suffix automaton."
        },
        {
          w: "The `O(n·m)` DP is what git uses.",
          r: "Git uses **Myers' diff algorithm**, `O(nd)` where `d` is the " +
            "number of differences. For typical commits `d` is small, making " +
            "it far faster than `O(n·m)` on large files. Plain LCS DP is the " +
            "teaching version."
        },
        {
          w: "Space optimisation is free.",
          r: "Reducing to two rows gives the **length** and loses the " +
            "**sequence** — you can no longer backtrack the choices. For diff " +
            "the sequence is the entire point, which is why Hirschberg's " +
            "algorithm exists to recover it in linear space."
        },
        {
          w: "The LCS is unique.",
          r: "Multiple distinct subsequences can share the maximum length. " +
            "Different diff tools legitimately produce **different but equally " +
            "valid** diffs of the same change, which is why diff output varies " +
            "between implementations."
        }
      ],

      trade: {
        buys: [
          "Exponential to `O(n·m)`.",
          "Directly powers diff and version control.",
          "Related to edit distance by a simple formula.",
          "Extends to sequence alignment in bioinformatics.",
          "Space reducible to `O(min(n, m))` for length alone."
        ],
        costs: [
          "Quadratic — slow on very long sequences.",
          "`O(n·m)` memory to reconstruct the sequence.",
          "Space optimisation forfeits reconstruction.",
          "Not unique, so output can vary.",
          "Beaten by Myers when differences are few."
        ],
        avoid: [
          "You need a contiguous match — that is longest common substring.",
          "The sequences are very long and differences are few — Myers.",
          "Only similarity is needed — a hash or n-gram measure is cheaper.",
          "Order does not matter — use set intersection."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "edit-distance",

      why: {
        before: "Deciding whether two strings were *nearly the same* used " +
          "exact equality or ad-hoc rules — same first letters, same length, " +
          "shared prefix.",
        problem: "Those rules break immediately. `recieve` and `receive` " +
          "differ by a transposition; `color` and `colour` by an insertion. " +
          "Spell-checking, fuzzy search, DNA alignment and duplicate detection " +
          "all need a **principled numeric measure** of how different two " +
          "sequences are.",
        shift: "**Count the minimum single-character edits** — insertions, " +
          "deletions and substitutions — needed to turn one string into the " +
          "other. Levenshtein's measure is a proper **metric** (symmetric, and " +
          "it satisfies the triangle inequality), which is what makes it " +
          "usable for clustering and indexing rather than merely for " +
          "comparison. The DP is `O(n·m)`, the same shape as LCS."
      },

      num: {
        t: "Distance variants",
        h: ["Variant", "Allows", "Use"],
        r: [
          ["**Levenshtein**", "**insert, delete, substitute**", "**the general default**"],
          ["LCS distance", "insert, delete only", "diff"],
          ["**Damerau–Levenshtein**", "**+ transposition**", "**typos — 'teh' → 'the'**"],
          ["Hamming", "substitution only", "**equal lengths, error codes**"],
          ["Jaro–Winkler", "weighted, prefix bonus", "name matching"]
        ],
        n: "**Damerau–Levenshtein** is the right default for human typos: " +
          "plain Levenshtein counts `teh` → `the` as **two** edits, and it is " +
          "obviously one mistake. Adding transposition as a single operation " +
          "matches how people actually mistype. The optimisations that matter " +
          "in practice: space reduces to `O(min(n, m))` with two rows if you " +
          "only need the number; **early termination** when a threshold is " +
          "exceeded is a large win, since most comparisons in a spell-checker " +
          "fail quickly; and for searching a dictionary, computing the " +
          "distance against every word is far too slow — real systems use a " +
          "**BK-tree** (exploiting the triangle inequality to prune) or a " +
          "**Levenshtein automaton**, which is what Lucene and Elasticsearch " +
          "use for fuzzy queries. Note the metric is **length-blind**: a " +
          "distance of 2 is severe between four-letter words and negligible " +
          "between paragraphs, so normalise by length when comparing across " +
          "sizes."
      },

      miss: [
        {
          w: "Edit distance handles typos well.",
          r: "Plain **Levenshtein counts a transposition as two edits** — " +
            "`teh` → `the` scores 2, though it is one slip. " +
            "**Damerau–Levenshtein** adds transposition as a single operation " +
            "and matches human error patterns much better."
        },
        {
          w: "A distance of 2 means the strings are similar.",
          r: "It is **not normalised**. Two edits between `cat` and `dog` is " +
            "total dissimilarity; two edits between two paragraphs is " +
            "near-identity. Divide by the longer length when comparing across " +
            "different sizes."
        },
        {
          w: "Use it to search a dictionary for near matches.",
          r: "Computing distance against every word is `O(dictionary × n × m)` " +
            "— far too slow. Real systems use a **BK-tree** or a **Levenshtein " +
            "automaton**. Elasticsearch's fuzzy queries use the latter."
        },
        {
          w: "All edit operations should cost the same.",
          r: "**Weighted** variants are often better. Keyboard-adjacent " +
            "substitutions are more likely than distant ones; in " +
            "bioinformatics, substitution matrices give different costs per " +
            "amino acid pair. Uniform cost is a default, not a requirement."
        }
      ],

      trade: {
        buys: [
          "A principled numeric similarity measure.",
          "A true metric — usable for clustering and indexing.",
          "Handles insertions, deletions and substitutions uniformly.",
          "Extends to weighted and transposition-aware variants.",
          "Space reducible to `O(min(n, m))` for the distance alone."
        ],
        costs: [
          "`O(n·m)` — slow for long strings.",
          "Not normalised for length.",
          "Uniform costs do not reflect real error likelihood.",
          "Too slow for dictionary search without an index structure.",
          "Space optimisation loses the alignment."
        ],
        avoid: [
          "The strings are long — use n-gram or embedding similarity.",
          "Searching a large dictionary — use a BK-tree or automaton.",
          "Semantic similarity is wanted, not character similarity.",
          "Lengths are equal and only substitutions matter — **Hamming** is " +
            "`O(n)`."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
