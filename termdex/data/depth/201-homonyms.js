/* ==========================================================================
   Depth pass 201 — the five homonym terms.

   These slugs carry a "-2" suffix because the encyclopedia already holds a
   term of the same name from a different field: `kernel` is a convolution
   kernel in deep learning and the privileged core of an OS here; `react` is
   the ReAct prompting pattern there and the UI library here. Same word,
   unrelated concept — so each earns its own reasoning rather than a
   cross-reference.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "deadlock-2",

      why: {
        before: "Locks make concurrent code correct: acquire before touching " +
          "shared state, release afterwards, and no two threads corrupt each " +
          "other's work.",
        problem: "Locks compose badly. Thread A holds lock 1 and wants lock 2; " +
          "thread B holds lock 2 and wants lock 1. Neither will release what " +
          "it has until it gets what it wants, so **both wait forever**. " +
          "Nothing crashes, no error is raised — the threads simply stop, and " +
          "the symptom is a hung request rather than a stack trace.",
        shift: "Deadlock is not a bug in any single lock but a **property of " +
          "the system's lock ordering**. Coffman established that four " +
          "conditions must hold simultaneously — and that breaking **any one** " +
          "prevents it. That turns an apparently mysterious hang into a " +
          "design checklist."
      },

      num: {
        t: "The four Coffman conditions — break any one",
        h: ["Condition", "Means", "How to break it"],
        r: [
          ["Mutual exclusion", "a resource is exclusive", "lock-free structures"],
          ["Hold and wait", "hold one, request another", "**acquire everything at once**"],
          ["No preemption", "cannot force a release", "**lock timeouts**"],
          ["**Circular wait**", "**a cycle in the wait graph**", "**global lock ordering**"]
        ],
        n: "**Breaking circular wait is the standard fix** because it costs " +
          "nothing at run time: define a global order over locks — by address, " +
          "by ID, by name — and require every thread to acquire in that order. " +
          "A cycle then becomes impossible, since a cycle requires some thread " +
          "to acquire out of order. The alternatives all have real costs: " +
          "acquiring everything at once hurts concurrency and needs the full " +
          "set known in advance; timeouts turn a hang into a retry, which " +
          "risks **livelock** where threads repeatedly grab and release " +
          "without progressing. Note the distinction worth keeping straight — " +
          "**deadlock** is threads stuck not running, **livelock** is threads " +
          "busily running but not advancing, and **starvation** is one thread " +
          "perpetually losing to others. Databases take a different route " +
          "entirely: rather than preventing deadlock they **detect** the cycle " +
          "in their wait-for graph and abort one transaction as a victim, " +
          "which is why application code must be prepared to retry."
      },

      miss: [
        {
          w: "Deadlock means the program crashes.",
          r: "Nothing crashes — the threads **stop making progress silently**. " +
            "There is no exception and no error log, only a request that never " +
            "returns. That is precisely what makes it hard to diagnose in " +
            "production."
        },
        {
          w: "Using fewer locks prevents it.",
          r: "**One lock can deadlock** if a thread tries to acquire it " +
            "reentrantly and the lock is not reentrant. Conversely many locks " +
            "are safe under a consistent global ordering. **Ordering matters " +
            "more than count.**"
        },
        {
          w: "Timeouts solve deadlock.",
          r: "They convert a permanent hang into a **retry**, which is better " +
            "and is not a solution. Threads can repeatedly acquire, time out " +
            "and retry in lockstep without ever progressing — that is " +
            "**livelock**, and it burns CPU where deadlock at least stayed " +
            "quiet."
        },
        {
          w: "It only affects threads and mutexes.",
          r: "**Database transactions deadlock** on row locks routinely, and " +
            "distributed systems deadlock across services. Databases detect " +
            "the cycle and abort a victim transaction, which is why " +
            "application code must handle deadlock errors and retry."
        }
      ],

      trade: {
        buys: [
          "Lock ordering prevents deadlock at zero run-time cost.",
          "The Coffman conditions give a concrete design checklist.",
          "Detection-and-abort lets databases stay live under contention.",
          "Timeouts bound the damage when prevention is impractical."
        ],
        costs: [
          "Global lock ordering must be documented and enforced by discipline.",
          "Acquiring all locks at once reduces concurrency.",
          "Timeouts risk livelock and add retry logic.",
          "Detection requires maintaining a wait-for graph.",
          "Failures are silent and hard to reproduce."
        ],
        avoid: [
          "The code is single-threaded — there is nothing to order.",
          "Lock-free or immutable structures remove the need for locks.",
          "A single coarse lock is fast enough and cannot cycle.",
          "You cannot establish a consistent ordering — restructure instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "react-2",

      why: {
        before: "UI code manipulated the DOM directly: find the element, " +
          "change its text, toggle a class, attach a handler. Each state " +
          "change required knowing which parts of the page it affected.",
        problem: "That knowledge does not scale. With `n` pieces of state and " +
          "`m` UI elements, the developer maintains the mapping between them " +
          "by hand, and every new feature adds edges. Bugs arrive as **the UI " +
          "disagreeing with the data** — a counter updated but its badge not, " +
          "because one of many update paths was missed.",
        shift: "**Describe what the UI should look like for the current " +
          "state, and let the library work out the DOM changes.** A component " +
          "is a function from state to described output; React diffs the new " +
          "description against the old and applies the minimum real DOM " +
          "changes. The developer stops maintaining transitions and maintains " +
          "only the mapping from state to appearance."
      },

      num: {
        t: "The core ideas, and what each replaced",
        h: ["Idea", "Replaces", "Consequence"],
        r: [
          ["**Declarative rendering**", "**manual DOM updates**", "**UI cannot drift from state**"],
          ["Components", "template + controller split", "reuse by composition"],
          ["**Virtual DOM diffing**", "**hand-tuned updates**", "**correctness by default**"],
          ["**Unidirectional data flow**", "**two-way binding**", "**changes are traceable**"],
          ["Hooks", "class lifecycle methods", "logic reusable across components"],
          ["**Keys in lists**", "**positional matching**", "**identity survives reorder**"]
        ],
        n: "**The virtual DOM is a correctness mechanism people mistake for a " +
          "performance one.** Hand-written DOM updates are faster than " +
          "diffing — React's own docs have never claimed otherwise. What " +
          "diffing buys is that the UI is **always consistent with state " +
          "without the developer tracking which elements to touch**, and that " +
          "guarantee is worth more than the microseconds. The **keys** row is " +
          "the most common real bug: without stable keys React matches list " +
          "children by position, so inserting at the front makes it believe " +
          "every item changed — losing input focus, scroll position and " +
          "component state. Using an array index as the key reproduces exactly " +
          "the bug keys exist to prevent. And **unidirectional flow** is why " +
          "React apps are debuggable at scale: state flows down, events flow " +
          "up, so any wrong value has one path to trace backwards rather than " +
          "a web of two-way bindings."
      },

      miss: [
        {
          w: "The virtual DOM makes React fast.",
          r: "Direct DOM manipulation is **faster**. Diffing buys " +
            "**correctness without manual tracking** — the UI always matches " +
            "state. React is fast enough, not fastest, and that trade is the " +
            "actual design choice."
        },
        {
          w: "An array index is a fine key for a list.",
          r: "It reproduces the bug keys exist to prevent. Insert at the front " +
            "and every index shifts, so React treats all items as changed — " +
            "**losing focus, scroll and component state**. Keys must be " +
            "**stable identities**, typically an ID from the data."
        },
        {
          w: "React is a framework.",
          r: "It is a **library for rendering views**. Routing, data fetching, " +
            "forms and state management are separate choices — which is why " +
            "meta-frameworks like Next.js exist to assemble a full " +
            "application stack around it."
        },
        {
          w: "Re-rendering means the DOM is rebuilt.",
          r: "A re-render runs the **component function** and produces a new " +
            "description. React then applies **only the differences** to the " +
            "real DOM, often nothing at all. Confusing the two is why people " +
            "over-apply memoisation to renders that cost nothing."
        }
      ],

      trade: {
        buys: [
          "UI provably consistent with state.",
          "Composable components with clear boundaries.",
          "Unidirectional flow makes bugs traceable.",
          "Enormous ecosystem and hiring pool.",
          "Hooks make stateful logic reusable."
        ],
        costs: [
          "Slower than hand-tuned direct DOM updates.",
          "Bundle size and a build step.",
          "Routing, data and state are separate decisions.",
          "Re-render semantics and memoisation are easy to misuse.",
          "Rapid ecosystem churn."
        ],
        avoid: [
          "The page is static content — plain HTML is correct.",
          "Interactivity is trivial — a few event handlers suffice.",
          "Bundle size is critical and a lighter library fits.",
          "The team has no build tooling and does not want one."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kernel-2",

      why: {
        before: "Early machines ran one program with total control of the " +
          "hardware. That program could do anything — and a single mistake " +
          "took down the whole machine.",
        problem: "Running several programs at once makes that unworkable. If " +
          "any program can write any memory address, one buggy process " +
          "corrupts another; if any can monopolise the CPU, nothing else " +
          "runs; if any can drive the disk directly, two writing at once " +
          "destroy the filesystem. **Untrusted code cannot be given the " +
          "hardware.**",
        shift: "**Put one trusted program between everything else and the " +
          "hardware.** The kernel runs in a privileged CPU mode with full " +
          "access; applications run unprivileged and must **ask** for " +
          "hardware operations via system calls. The CPU itself enforces the " +
          "boundary, so the guarantee does not depend on applications " +
          "behaving."
      },

      num: {
        t: "What the privilege boundary costs and buys",
        h: ["Aspect", "User mode", "Kernel mode"],
        r: [
          ["Hardware access", "**none — must ask**", "**full**"],
          ["Memory", "**own virtual space only**", "all physical memory"],
          ["**A crash takes down**", "**one process**", "**the whole machine**"],
          ["**Syscall cost**", "**~100–300 ns each**", "—"],
          ["Scheduling", "subject to it", "controls it"]
        ],
        n: "The **syscall cost** row drives a surprising amount of modern " +
          "systems design. Crossing the boundary means a mode switch, register " +
          "saves and cache effects, so a program making millions of tiny " +
          "syscalls spends much of its time on transitions rather than work. " +
          "Every high-performance I/O technique is an attempt to cross less " +
          "often: **batching**, `epoll`/`io_uring` to handle many events per " +
          "call, **memory-mapped files** to read without syscalls at all, and " +
          "**DPDK-style kernel bypass** in networking. The **crash** row " +
          "explains the architectural argument between designs: a monolithic " +
          "kernel (Linux) runs drivers in kernel mode, so a driver bug can " +
          "panic the machine but calls are fast; a microkernel moves drivers " +
          "to user space for isolation and pays more boundary crossings. " +
          "Linux's answer to extending the kernel safely is **eBPF** — " +
          "verified programs that run in kernel space without the risk of a " +
          "custom module."
      },

      miss: [
        {
          w: "The kernel is the operating system.",
          r: "It is the **privileged core**. Shells, window managers, package " +
            "managers and system daemons are user-space programs. *Linux* is a " +
            "kernel; a distribution is that kernel plus the enormous user-space " +
            "system around it."
        },
        {
          w: "System calls are ordinary function calls.",
          r: "They are **privilege transitions** costing roughly 100–300 ns " +
            "each — orders of magnitude more than a function call. This is why " +
            "batching, `io_uring` and memory-mapped I/O exist."
        },
        {
          w: "A microkernel is simply a smaller kernel.",
          r: "It is a **different placement of trust**: drivers and " +
            "filesystems move to **user space**, so a driver crash does not " +
            "take the machine down. The cost is more boundary crossings, which " +
            "is why Linux stayed monolithic."
        },
        {
          w: "Containers each run their own kernel.",
          r: "Containers **share the host kernel**, isolated by namespaces and " +
            "cgroups — which is why they start in milliseconds. **Virtual " +
            "machines** run separate kernels, which is why they are heavier " +
            "and isolate more strongly."
        }
      ],

      trade: {
        buys: [
          "Hardware-enforced isolation between processes.",
          "A buggy program cannot take down the machine.",
          "Fair scheduling and resource arbitration.",
          "One stable interface across varied hardware.",
          "Security boundaries the application cannot bypass."
        ],
        costs: [
          "Syscall transitions are expensive.",
          "A kernel bug or driver fault is fatal machine-wide.",
          "Kernel development is difficult and unforgiving.",
          "Abstraction hides hardware capabilities from applications.",
          "Monolithic designs trust a great deal of code."
        ],
        avoid: [
          "Bare-metal embedded work with one trusted program.",
          "Latency demands justify kernel bypass for the data path.",
          "A unikernel fits — one application, no multi-tenancy.",
          "The isolation you need is stronger — use a VM."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "latency-2",

      why: {
        before: "Performance was discussed as a single quantity — the system " +
          "was *fast* or *slow*, and making it faster meant adding capacity.",
        problem: "That conflates two independent things. **Throughput** is how " +
          "much work completes per second; **latency** is how long one unit " +
          "takes. They are not the same and often trade against each other: " +
          "batching raises throughput and *increases* latency for the requests " +
          "that wait to fill the batch. Adding servers raises throughput and " +
          "does nothing for a slow single request.",
        shift: "**Measure latency as a distribution, not a number.** The " +
          "average hides exactly what users notice — the average of 99 " +
          "requests at 10 ms and one at 5 s is 60 ms, which describes nobody's " +
          "experience. Percentiles describe the actual spread, and the tail is " +
          "where the complaints come from."
      },

      num: {
        t: "Latencies worth knowing by order of magnitude",
        h: ["Operation", "Time", "Relative"],
        r: [
          ["L1 cache reference", "~1 ns", "1×"],
          ["**Main memory reference**", "**~100 ns**", "**100×**"],
          ["**SSD random read**", "**~100 µs**", "**100,000×**"],
          ["Disk seek (HDD)", "~10 ms", "10,000,000×"],
          ["**Same-datacentre round trip**", "**~0.5 ms**", "**500,000×**"],
          ["**Cross-continent round trip**", "**~150 ms**", "**physics — cannot be optimised**"]
        ],
        n: "The **cross-continent** row is a hard floor, not an engineering " +
          "target: light in fibre covers roughly 200 km per millisecond, so " +
          "London to Sydney has an irreducible round trip near 160 ms whatever " +
          "you do to the code. That is why **CDNs and edge deployment exist** " +
          "— the only way to beat the number is to move the data closer. The " +
          "distribution matters as much as the median: at **p99**, one request " +
          "in a hundred is slower, and a page making 100 backend calls will " +
          "**almost certainly** hit that tail, so p99 backend latency becomes " +
          "typical page latency. This is why tail latency is tracked so " +
          "carefully at scale, and why **hedged requests** — sending a " +
          "duplicate after a short delay and taking the first response — are " +
          "worth their extra load. The related trap is **coordinated " +
          "omission**: load generators that wait for a response before sending " +
          "the next request stop measuring during a stall, systematically " +
          "under-reporting exactly the latency you care about."
      },

      miss: [
        {
          w: "Latency and throughput are two views of the same thing.",
          r: "They are **independent and often opposed**. Batching improves " +
            "throughput and worsens latency. Adding servers improves " +
            "throughput and leaves single-request latency unchanged. Optimise " +
            "the one that matters for the workload."
        },
        {
          w: "Average latency describes user experience.",
          r: "It hides the tail. Ninety-nine requests at 10 ms and one at 5 s " +
            "averages 60 ms — a number nobody experienced. **Percentiles** " +
            "describe the distribution; **p99 and p99.9** describe the users " +
            "who complain."
        },
        {
          w: "p99 latency affects one percent of users.",
          r: "It affects **far more**. A page making 100 backend calls has " +
            "roughly a 63% chance of hitting at least one p99 response, so " +
            "tail latency becomes typical **page** latency at any real fan-out."
        },
        {
          w: "Network latency can be optimised away.",
          r: "Round-trip time across continents is bounded by **the speed of " +
            "light** — about 150 ms London to Sydney, irreducible. You can " +
            "only reduce **round trips** or **move the data closer**, which is " +
            "what CDNs and edge computing do."
        }
      ],

      trade: {
        buys: [
          "Percentiles expose what averages hide.",
          "Separating latency from throughput clarifies what to optimise.",
          "Known magnitudes make back-of-envelope estimation possible.",
          "Tail tracking catches problems users feel first.",
          "Hedged requests cut tail latency at modest extra load."
        ],
        costs: [
          "Percentile tracking needs histograms, not averages.",
          "Percentiles do not average across services correctly.",
          "Load generators can under-report via coordinated omission.",
          "Reducing tail latency often costs throughput or capacity.",
          "Physical round-trip limits cannot be engineered away."
        ],
        avoid: [
          "The workload is batch — throughput is what matters.",
          "Request volume is too low for percentiles to be meaningful.",
          "The bottleneck is capacity, not per-request time.",
          "You are optimising below the network's physical floor."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "benchmark-2",

      why: {
        before: "Performance claims were made from intuition and one-off " +
          "timings — run it, look at the clock, declare the change an " +
          "improvement.",
        problem: "A single timing measures far more than the code: JIT warm-up, " +
          "cache state, other processes, CPU frequency scaling, garbage " +
          "collection timing. Run the same code twice and get different " +
          "numbers. Worse, an optimiser can **delete a benchmark's body " +
          "entirely** when the result is unused, producing an impossibly fast " +
          "figure that measures nothing.",
        shift: "**Measure repeatedly under controlled conditions and report " +
          "the distribution.** A benchmark is an experiment, and it needs the " +
          "discipline of one: warm-up, many iterations, statistical " +
          "comparison, and defences against the compiler optimising the work " +
          "away. Frameworks like JMH and Criterion exist because doing this " +
          "correctly by hand is genuinely hard."
      },

      num: {
        t: "What corrupts a benchmark",
        h: ["Hazard", "Effect", "Defence"],
        r: [
          ["**Dead-code elimination**", "**work removed — absurdly fast**", "**consume the result**"],
          ["**Cold start / JIT**", "**first runs far slower**", "**warm-up iterations**"],
          ["Constant folding", "computed at compile time", "**inputs the compiler cannot know**"],
          ["**Measuring the wrong thing**", "**setup timed with the work**", "**time only the region**"],
          ["Noise", "run-to-run variance", "**many runs, report percentiles**"],
          ["**Unrealistic data**", "**cache-friendly toy input**", "**production-shaped data**"]
        ],
        n: "**Dead-code elimination is the classic silent failure**: if the " +
          "benchmark computes a value and never uses it, the optimiser is " +
          "entitled to remove the computation entirely, and you measure an " +
          "empty loop. Results that look impossibly good usually are — that is " +
          "the first thing to suspect. Benchmark frameworks provide a " +
          "*blackhole* or `std::hint::black_box` specifically to consume " +
          "results so the work cannot be elided. The deeper problem is " +
          "**relevance rather than accuracy**: a microbenchmark can be " +
          "perfectly measured and still mislead, because in isolation the code " +
          "runs with a warm cache and no competition, while in production it " +
          "runs with a cold cache under memory pressure. This is why a " +
          "microbenchmark showing a 3× win frequently produces no measurable " +
          "improvement in the real system, and why **profiling the real " +
          "workload should decide what to optimise** — the benchmark only " +
          "verifies the specific change."
      },

      miss: [
        {
          w: "A benchmark showing a large speedup proves the code is faster.",
          r: "It proves **that code, in that harness, on that data** is " +
            "faster. Microbenchmark wins routinely vanish in production, where " +
            "the cache is cold and the code competes for resources. Verify " +
            "against the real workload."
        },
        {
          w: "Timing a loop is a benchmark.",
          r: "Without **warm-up** you measure JIT compilation and cold caches; " +
            "without **consuming the result** the optimiser may delete the " +
            "work; with one run you measure noise. Frameworks like JMH exist " +
            "because these defences are easy to miss."
        },
        {
          w: "Report the fastest run — it shows the true potential.",
          r: "The minimum is the luckiest sample, not the typical one. Report " +
            "the **distribution** — median plus spread, or percentiles. If " +
            "variance is high, that instability is itself the finding."
        },
        {
          w: "Benchmarks tell you what to optimise.",
          r: "**Profiling** tells you what to optimise, by showing where real " +
            "workloads spend time. Benchmarks **verify** a specific change. " +
            "Optimising what is convenient to benchmark rather than what is " +
            "actually slow is the common mistake."
        }
      ],

      trade: {
        buys: [
          "Repeatable evidence in place of intuition.",
          "Catches performance regressions in CI.",
          "Isolates one change's effect from everything else.",
          "Makes trade-offs concrete and arguable.",
          "Frameworks handle warm-up and elision correctly."
        ],
        costs: [
          "Microbenchmarks often fail to predict production behaviour.",
          "Easy to measure the wrong thing convincingly.",
          "Needs controlled environments to be stable.",
          "Slow to run properly with enough iterations.",
          "Encourages optimising the measurable over the important."
        ],
        avoid: [
          "You have not profiled — you may optimise the wrong code.",
          "The change is obviously correct and performance-neutral.",
          "The environment is too noisy for meaningful numbers.",
          "An end-to-end load test would answer the real question."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
