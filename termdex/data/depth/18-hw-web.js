/* ==========================================================================
   Depth pass 18 — specialised hardware and the browser platform.

   The hardware terms share a spectrum: general-purpose silicon trades
   efficiency for flexibility, and each step toward specialisation buys
   performance per watt by giving up the ability to change your mind. Where
   you sit on that spectrum is an economic decision about volume and
   stability, not a technical one about speed.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "tpu",

      why: {
        before: "Neural networks ran on GPUs, which were designed for graphics " +
          "and adapted. A GPU spends significant silicon and power on things " +
          "inference does not need: texture units, rasterisers, wide " +
          "general-purpose caches, and flexible scheduling.",
        problem: "Google's 2013 projection was stark — if every Android user " +
          "used voice search for three minutes a day, they would need to " +
          "**double their datacentre count**. General-purpose hardware made the " +
          "economics impossible.",
        shift: "Build silicon for one operation. Neural networks are " +
          "overwhelmingly **matrix multiplication**, so devote the chip to a " +
          "**systolic array**: a grid of multiply-accumulate units where data " +
          "flows through and each value is reused across many operations " +
          "without returning to memory. Give up general programmability " +
          "entirely."
      },

      num: {
        t: "Why the systolic array wins",
        h: ["Property", "GPU", "TPU"],
        r: [
          ["Designed for", "graphics, adapted", "**matrix multiply only**"],
          ["Memory reads per MAC", "several", "**~1** — data reused in-array"],
          ["Precision", "fp16/fp32/int8", "bf16 / int8 focused"],
          ["Flexibility", "**any parallel work**", "neural networks"],
          ["Reported perf/watt (v1)", "1×", "~30–80×"]
        ],
        n: "The memory row is the entire idea. In a conventional design each " +
          "multiply-accumulate fetches operands from registers or cache, and " +
          "**data movement dominates energy** — moving a value from DRAM costs " +
          "orders of magnitude more than the arithmetic on it. A systolic array " +
          "pumps values through a grid so each is reused across an entire row " +
          "or column before leaving. The trade is total: a TPU cannot run your " +
          "database, your web server, or arbitrary CUDA. Note also that the " +
          "**software stack is the real lock-in** — TPUs run through XLA, so " +
          "code written against CUDA kernels does not transfer."
      },

      miss: [
        {
          w: "A TPU is just a faster GPU.",
          r: "It is a fundamentally different architecture with **no general " +
            "programmability**. A GPU runs arbitrary parallel code; a TPU runs " +
            "matrix operations dispatched through a compiler. It is closer to a " +
            "fixed-function accelerator than to a processor."
        },
        {
          w: "TPUs are always faster than GPUs for machine learning.",
          r: "Faster and more efficient on **large dense matrix workloads that " +
            "fit its model** — big transformers, large batches. GPUs win on " +
            "small models, irregular computation, sparse operations, custom " +
            "kernels, and anything needing the CUDA ecosystem. Model shape " +
            "decides it."
        },
        {
          w: "You can port PyTorch code to a TPU by changing the device.",
          r: "PyTorch/XLA makes it look that way and the reality is more " +
            "demanding: dynamic shapes trigger expensive recompilation, some " +
            "operations fall back to CPU, and performance requires " +
            "restructuring for static shapes. It works, and it is not a " +
            "one-line change."
        },
        {
          w: "TPUs are only available inside Google.",
          r: "They are available on Google Cloud, and TPU v1 was " +
            "inference-only while later generations train as well. The **Edge " +
            "TPU** is a separate low-power inference chip for devices, sharing " +
            "the name and not the architecture."
        }
      ],

      trade: {
        buys: [
          "Very high performance per watt on large matrix workloads.",
          "Enormous memory bandwidth per chip.",
          "Scales to pods with fast dedicated interconnect.",
          "Better cost per unit of training compute at scale."
        ],
        costs: [
          "No general programmability.",
          "Cloud-only, so single-vendor dependency.",
          "XLA compilation is unforgiving about dynamic shapes.",
          "A far smaller ecosystem than CUDA.",
          "Poor fit for small or irregular models."
        ],
        avoid: [
          "The model is small or the workload is irregular.",
          "You depend on custom CUDA kernels or the wider GPU ecosystem.",
          "Shapes are dynamic and recompilation would dominate.",
          "You need on-premises hardware.",
          "The work is not neural network inference or training at all."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "real-time-operating-system",

      why: {
        before: "General-purpose operating systems optimise for **average** " +
          "performance and throughput. Linux's scheduler maximises useful work " +
          "across many processes, which is exactly right for a server.",
        problem: "For an airbag controller, an anti-lock braking system or a " +
          "pacemaker, the average is irrelevant and the **worst case is the " +
          "specification**. An airbag that deploys in 3ms on average and " +
          "occasionally takes 50ms has killed someone. Linux offers no bound " +
          "at all — page faults, interrupt handling and scheduler decisions can " +
          "delay a task arbitrarily.",
        shift: "Optimise for **predictability instead of throughput**. Bounded " +
          "worst-case latency for every operation, strict priority scheduling " +
          "with preemption, no demand paging, and deterministic interrupt " +
          "handling. An RTOS is usually *slower* on average and is never " +
          "surprising."
      },

      num: {
        t: "Latency characteristics",
        h: ["System", "Typical latency", "Worst case", "Bounded?"],
        r: [
          ["Linux (standard)", "~10µs", "**tens of ms**", "no"],
          ["Linux PREEMPT_RT", "~10µs", "~100µs", "soft"],
          ["**RTOS (FreeRTOS, VxWorks)**", "~1µs", "**~10µs**", "**yes**"]
        ],
        n: "The distinction that matters most is **hard against soft** " +
          "real-time. *Hard* means a missed deadline is a **system failure** — " +
          "flight control, engine timing, medical devices. *Soft* means it " +
          "degrades quality — a dropped video frame, audio glitch. Most systems " +
          "described as real-time are soft, and soft real-time is often " +
          "achievable on Linux with `PREEMPT_RT` and careful engineering. The " +
          "other counterintuitive point: **priority inversion** is the classic " +
          "RTOS bug, and it grounded the **Mars Pathfinder** in 1997 — a " +
          "low-priority task held a mutex a high-priority task needed while a " +
          "medium-priority task preempted it, causing repeated watchdog " +
          "resets. Priority inheritance is the standard fix."
      },

      miss: [
        {
          w: "Real-time means fast.",
          r: "It means **predictable**. An RTOS often has lower average " +
            "throughput than Linux because it forgoes optimisations that " +
            "introduce variance — caching heuristics, demand paging, work " +
            "batching. Guaranteeing 10µs always is a different goal from " +
            "averaging 1µs."
        },
        {
          w: "You can make Linux real-time by raising process priority.",
          r: "`SCHED_FIFO` and `chrt` help substantially and do not give a " +
            "bound. Interrupt handlers, kernel locks, page faults and SMIs can " +
            "still delay you. `PREEMPT_RT` (now largely mainlined) gets Linux " +
            "to soft real-time; hard real-time typically needs an RTOS or a " +
            "hypervisor partitioning a core."
        },
        {
          w: "An RTOS is a small operating system for microcontrollers.",
          r: "Size and real-time capability are independent. FreeRTOS is tiny; " +
            "VxWorks and QNX are full-featured with networking and file " +
            "systems, and run in aircraft and cars. Conversely, plenty of tiny " +
            "embedded systems are not real-time at all."
        },
        {
          w: "Dynamic memory allocation is fine as long as you have enough RAM.",
          r: "`malloc` has **unbounded** worst-case time — it may search a free " +
            "list or compact — and fragmentation can cause a failure hours in. " +
            "Hard real-time systems typically forbid dynamic allocation after " +
            "initialisation entirely, using static pools instead."
        }
      ],

      trade: {
        buys: [
          "Bounded, provable worst-case latency.",
          "Deterministic priority-based scheduling.",
          "Small, auditable kernel suitable for certification.",
          "Predictable interrupt handling."
        ],
        costs: [
          "Lower average throughput than a general-purpose OS.",
          "A far smaller ecosystem of drivers and libraries.",
          "Dynamic allocation is restricted or forbidden.",
          "Commercial RTOSes and their certification are expensive.",
          "Requires disciplined, constrained programming."
        ],
        avoid: [
          "The workload is soft real-time — Linux with `PREEMPT_RT` is far " +
            "more practical.",
          "You need a rich ecosystem — networking stacks, databases, " +
            "libraries.",
          "It is a server or desktop application, where throughput matters " +
            "more.",
          "Nobody has actually specified a deadline; *fast* is not a real-time " +
            "requirement."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "quantum-computing",

      why: {
        before: "Simulating quantum systems — molecules, materials, chemical " +
          "reactions — on classical computers scales **exponentially** in the " +
          "number of particles. Feynman's 1981 observation was that this is " +
          "not a software problem: nature is quantum, and classical bits are " +
          "the wrong representation.",
        problem: "Some problems have structure a classical computer cannot " +
          "exploit. Factoring, simulating quantum chemistry, and certain " +
          "optimisation and linear algebra problems appear to need exponential " +
          "classical resources.",
        shift: "Compute *with* quantum mechanics. **Superposition** lets n " +
          "qubits represent 2ⁿ amplitudes simultaneously; **interference** " +
          "amplifies correct answers and cancels wrong ones; **entanglement** " +
          "correlates qubits in ways classical bits cannot. The whole art is " +
          "designing interference so the right answer survives measurement."
      },

      num: {
        t: "Where quantum computers genuinely help",
        h: ["Problem", "Speed-up", "Practical?"],
        r: [
          ["Factoring (Shor)", "**exponential**", "needs ~10⁶ physical qubits"],
          ["Quantum simulation", "**exponential**", "the most likely first win"],
          ["Unstructured search (Grover)", "quadratic only", "rarely worth it"],
          ["NP-complete problems", "**no known speed-up**", "no"],
          ["Machine learning", "unclear, contested", "no"]
        ],
        n: "Two rows deserve emphasis. **Grover's quadratic speed-up is " +
          "usually not worth it** — turning 2ⁿ into 2^(n/2) still leaves an " +
          "exponential, and the constant factors of quantum hardware are " +
          "enormous. And **quantum computers are not believed to solve " +
          "NP-complete problems efficiently**; BQP is not thought to contain " +
          "NP. The dominant engineering constraint is **error correction**: " +
          "current qubits have error rates around 10⁻³ and useful algorithms " +
          "need ~10⁻¹⁵, so roughly **1,000 physical qubits per logical qubit**. " +
          "Machines today have a few hundred to a couple of thousand physical " +
          "qubits, meaning a handful of logical ones at best."
      },

      miss: [
        {
          w: "Quantum computers try all possibilities simultaneously.",
          r: "The most persistent misconception. A superposition holds all " +
            "states, and **measurement returns exactly one**, at random by " +
            "amplitude. Quantum algorithms work by arranging **interference** " +
            "so the right answer has high amplitude before you measure. Without " +
            "that structure you get a random answer, which is useless."
        },
        {
          w: "Quantum computers will replace classical ones.",
          r: "They are **accelerators for specific structured problems**. They " +
            "are worse at almost everything — no advantage for arithmetic, " +
            "databases, rendering or web serving. The realistic future is a " +
            "quantum coprocessor called by classical code."
        },
        {
          w: "More qubits means a more capable machine.",
          r: "**Quality matters more than count.** A thousand noisy qubits with " +
            "short coherence times may do less than fifty high-fidelity ones. " +
            "Error rate, coherence time, connectivity and gate fidelity are the " +
            "meaningful specifications; qubit count alone is a marketing " +
            "number."
        },
        {
          w: "Quantum supremacy means quantum computers are now useful.",
          r: "*Supremacy* or *advantage* means a quantum machine did **some** " +
            "task faster than the best known classical method — and the tasks " +
            "chosen have been deliberately contrived to suit the hardware, with " +
            "no practical application. Several claims were subsequently " +
            "narrowed by improved classical algorithms."
        }
      ],

      trade: {
        buys: [
          "Exponential speed-up on a small set of structured problems.",
          "Quantum simulation may transform chemistry and materials science.",
          "Forced valuable work on post-quantum cryptography.",
          "Genuine new complexity-theoretic understanding."
        ],
        costs: [
          "Error rates are ~12 orders of magnitude from where they need to be.",
          "Extreme physical requirements — millikelvin cooling for " +
            "superconducting qubits.",
          "The problem set is narrow.",
          "Enormous hype relative to demonstrated results.",
          "Timelines are genuinely uncertain."
        ],
        avoid: [
          "Any current production problem — nothing commercially useful runs " +
            "on one today.",
          "You have been told it will solve your optimisation problem — check " +
            "whether a real speed-up exists for it.",
          "The problem is NP-complete and you expect quantum to solve it.",
          "Planning around it on a short horizon; the exception is starting " +
            "**post-quantum crypto migration**, which is genuinely urgent."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "islands-architecture",

      why: {
        before: "Single-page applications shipped the whole application as " +
          "JavaScript. Even a mostly-static article page loaded a framework, " +
          "hydrated the entire tree, and only then became interactive.",
        problem: "The cost is paid on every page by every user, including on " +
          "content that needs no JavaScript at all. **Hydration is the " +
          "specific waste**: the server rendered HTML, then the client " +
          "downloads the framework, re-runs the component tree and attaches " +
          "listeners — doing the same work twice to end up where it started.",
        shift: "Render the page as **static HTML**, and hydrate only the " +
          "genuinely interactive parts — the *islands* — independently. A " +
          "search box and a like button ship their own small bundles; the " +
          "article text ships none."
      },

      num: {
        t: "Rendering approaches",
        h: ["Approach", "JS shipped", "Interactive when"],
        r: [
          ["SPA", "**everything**", "after full hydration"],
          ["SSR + full hydration", "everything", "after full hydration"],
          ["**Islands**", "**only islands**", "each island independently"],
          ["Static / MPA", "none", "n/a"]
        ],
        n: "The characteristic result is a content site dropping from hundreds " +
          "of kilobytes of JavaScript to **tens**, because most of a page is " +
          "genuinely static. Islands also hydrate **independently and lazily** " +
          "— `client:visible` defers until scrolled into view, `client:idle` " +
          "until the browser is free — so a below-the-fold widget costs nothing " +
          "up front. The cost is the model's central constraint: **islands do " +
          "not share client-side state**. Two islands needing to communicate " +
          "must use a store outside the framework, URL state, or custom events, " +
          "and a page whose interactivity is deeply interconnected fights the " +
          "architecture."
      },

      miss: [
        {
          w: "Islands architecture means less JavaScript, so it is always " +
            "better.",
          r: "It is better for **content-heavy** pages with isolated " +
            "interactivity — blogs, docs, marketing, commerce listings. A " +
            "dashboard or editor where everything is interactive and shares " +
            "state gains little and loses the coherence of a single component " +
            "tree."
        },
        {
          w: "Islands are just lazy-loaded components.",
          r: "Lazy loading defers code within one hydrated application. Islands " +
            "are **separately hydrated roots** in otherwise static HTML — there " +
            "is no application-wide runtime, no shared component tree, and no " +
            "framework loaded for the page as a whole."
        },
        {
          w: "You must use Astro to do this.",
          r: "Astro popularised it; the pattern is older and broader. Fresh, " +
            "Marko, Eleventy with a partial-hydration plugin, and Qwik's " +
            "resumability all address the same problem. Even hand-rolled " +
            "`customElements` on server-rendered HTML is a form of it."
        },
        {
          w: "Islands can share state like normal components.",
          r: "They cannot, by construction — each is its own root. Shared state " +
            "needs an external store (nanostores is the common answer), URL " +
            "parameters, or custom events. Discovering this after building the " +
            "page is the usual painful moment."
        }
      ],

      trade: {
        buys: [
          "Dramatically less JavaScript on content pages.",
          "Fast first paint and interactivity.",
          "Independent, lazy hydration per island.",
          "Islands can use different frameworks on one page.",
          "Excellent Core Web Vitals with little effort."
        ],
        costs: [
          "No shared client state between islands.",
          "Client-side routing is not the default model.",
          "Deciding island boundaries is a real design task.",
          "Poor fit for highly interconnected interactive UIs.",
          "Smaller ecosystem than mainstream SPA frameworks."
        ],
        avoid: [
          "The application is a dashboard, editor or tool where nearly " +
            "everything is interactive.",
          "Complex state must flow across the whole page.",
          "You need SPA-style client routing with preserved state.",
          "The page is genuinely static — skip the framework entirely.",
          "The team's expertise is in one SPA framework and the site is small."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "shadow-dom",

      why: {
        before: "CSS is **global**. Every stylesheet on a page can affect every " +
          "element, and specificity decides who wins. That is a feature for " +
          "documents and a serious problem for components.",
        problem: "A reusable widget cannot guarantee its own appearance. A host " +
          "page's `button { }` rule reaches inside it; the widget's styles leak " +
          "outward and break the host. Every workaround — BEM, CSS Modules, " +
          "styled-components — is a **convention or build step** simulating " +
          "isolation the platform does not provide.",
        shift: "Give the browser real encapsulation. A shadow root is a " +
          "**separate DOM tree** attached to an element: styles inside do not " +
          "escape, styles outside do not enter, and IDs and classes cannot " +
          "collide. It is enforced by the platform rather than by naming " +
          "discipline."
      },

      num: {
        t: "What crosses the boundary",
        h: ["Thing", "Crosses in?", "Note"],
        r: [
          ["Page CSS selectors", "**no**", "the whole point"],
          ["Inherited properties", "**yes**", "font, colour, line-height"],
          ["CSS custom properties", "**yes**", "the intended styling API"],
          ["`::part()` / `::slotted()`", "yes", "explicit opt-in"],
          ["Events", "yes, retargeted", "`composed: true` needed to escape"],
          ["`document.querySelector`", "**no**", "must go through the root"]
        ],
        n: "The **custom properties** row is the practical key: because they " +
          "inherit through the boundary, they are how a component offers a " +
          "deliberate theming API — `--button-bg` rather than letting arbitrary " +
          "selectors in. `::part()` exposes named internals for styling on " +
          "purpose. The costs are real: `document.querySelector` cannot see " +
          "inside, which **breaks many third-party scripts, test selectors and " +
          "analytics**; global stylesheets including Tailwind and Bootstrap do " +
          "not apply inside; and forms need `delegatesFocus` and " +
          "`ElementInternals` to participate properly. Open shadow roots are " +
          "reachable via `element.shadowRoot`; closed ones are not, which is " +
          "encapsulation and not security."
      },

      miss: [
        {
          w: "Shadow DOM gives you complete style isolation.",
          r: "**Inheritable properties still cross** — `font-family`, `color`, " +
            "`line-height` and CSS custom properties all inherit in. This is " +
            "deliberate so components look native to their page, and it means " +
            "isolation is one-directional and partial rather than total."
        },
        {
          w: "Closed shadow roots are a security boundary.",
          r: "They prevent casual access from JavaScript in the same page. They " +
            "are **not** a security boundary — script running on the page can " +
            "still reach content in many ways, and everything is in the same " +
            "origin and process. Use it for encapsulation, never for secrets."
        },
        {
          w: "You need Shadow DOM to build web components.",
          r: "Custom Elements and Shadow DOM are separate specifications. You " +
            "can define a custom element that renders into normal light DOM " +
            "— which many do specifically so global styles and existing tooling " +
            "keep working."
        },
        {
          w: "It works fine with existing CSS frameworks.",
          r: "It largely does not. Tailwind's generated classes, Bootstrap and " +
            "any global stylesheet **do not penetrate** a shadow root. You must " +
            "adopt stylesheets into the root explicitly (`adoptedStyleSheets`) " +
            "or inline them per component — a genuine integration cost."
        }
      ],

      trade: {
        buys: [
          "Real, browser-enforced style and DOM encapsulation.",
          "No naming conventions or build tooling required.",
          "Safe for widgets embedded in pages you do not control.",
          "Custom properties and `::part()` give a deliberate styling API.",
          "Framework-independent — works anywhere."
        ],
        costs: [
          "Global stylesheets and CSS frameworks do not apply inside.",
          "Breaks `querySelector`, many test tools and third-party scripts.",
          "Form participation needs extra work.",
          "Server-side rendering was awkward until declarative shadow DOM.",
          "Debugging across the boundary is harder."
        ],
        avoid: [
          "You control the whole page and CSS Modules or scoped styles " +
            "suffice.",
          "You rely on a global CSS framework.",
          "SEO or SSR requirements make it awkward.",
          "Your test tooling cannot pierce it.",
          "The component is internal and encapsulation buys nothing."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "indexeddb",

      why: {
        before: "Browser storage meant cookies (4KB, sent on every request) or " +
          "`localStorage` (~5MB, strings only, and **synchronous**).",
        problem: "`localStorage` blocks the main thread on every read and " +
          "write, so a large value freezes the UI. It stores only strings, so " +
          "objects need `JSON.parse` on every access. It cannot be indexed or " +
          "queried, and 5MB is nothing for an offline-capable application.",
        shift: "Provide a real **transactional database** in the browser: " +
          "asynchronous, storing structured objects directly, with indexes, " +
          "cursors and transactions, and storage measured in **gigabytes**. " +
          "The price is an API designed around events that is genuinely " +
          "unpleasant to use directly."
      },

      num: {
        t: "Browser storage compared",
        h: ["", "Cookies", "localStorage", "IndexedDB"],
        r: [
          ["Capacity", "4 KB", "~5 MB", "**GBs (quota-based)**"],
          ["API", "string parsing", "sync string", "**async, structured**"],
          ["Blocks main thread", "n/a", "**yes**", "no"],
          ["Stores", "strings", "strings", "objects, Blobs, Files"],
          ["Indexes / queries", "no", "no", "**yes**"],
          ["Available in workers", "no", "**no**", "**yes**"]
        ],
        n: "Two rows matter most in practice. **Worker availability** is why " +
          "IndexedDB is the only real option for a service worker — " +
          "`localStorage` is simply unavailable there, so any offline " +
          "architecture needs it. And **quota is not guaranteed**: browsers " +
          "allocate a share of free disk (often ~60% in Chrome) and can " +
          "**evict** your data under storage pressure unless you call " +
          "`navigator.storage.persist()`. Safari is more aggressive still, " +
          "clearing storage after around **7 days of no interaction** under " +
          "ITP. Treat it as a cache that usually survives, never as durable " +
          "storage."
      },

      miss: [
        {
          w: "IndexedDB is a reliable place to store user data.",
          r: "It can be **evicted** under storage pressure, cleared by the user " +
            "with site data, and in Safari is purged after roughly a week of " +
            "inactivity. Request persistent storage, and always design so " +
            "losing it degrades gracefully rather than losing the user's work."
        },
        {
          w: "It is a relational database in the browser.",
          r: "It is an **object store with indexes** — no SQL, no joins, no " +
            "declarative queries. You open a store, use an index, and iterate a " +
            "cursor. Anything join-shaped is application code."
        },
        {
          w: "The API is fine once you learn it.",
          r: "It is widely disliked for good reason: event-based rather than " +
            "promise-based, verbose transaction handling, and transactions that " +
            "**auto-close if you await anything non-IndexedDB inside them** — a " +
            "notorious trap. Nearly everyone uses a wrapper such as **idb** or " +
            "**Dexie**, and that is the right call."
        },
        {
          w: "Bigger storage means you should cache everything locally.",
          r: "Quota is shared and evictable, sync conflicts become your " +
            "problem, and stale local data is a support burden. Cache what " +
            "genuinely enables offline use, not everything you can fit."
        }
      ],

      trade: {
        buys: [
          "Gigabytes of structured client-side storage.",
          "Asynchronous — never blocks the main thread.",
          "Real indexes and cursors for querying.",
          "Stores objects, Blobs and Files directly.",
          "Available in service workers, unlike localStorage."
        ],
        costs: [
          "A genuinely awkward event-based API.",
          "Data can be evicted or cleared without warning.",
          "Transaction lifetime rules are a common source of bugs.",
          "No SQL or joins.",
          "Browser behaviour differs, Safari most of all."
        ],
        avoid: [
          "A few kilobytes of settings — `localStorage` is simpler.",
          "The data must be durable — it belongs on a server.",
          "You need relational queries — consider SQLite via WASM.",
          "There is no offline requirement at all.",
          "You would use the raw API rather than a wrapper."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mainframe",

      why: {
        before: "Computing meant one large shared machine, because a computer " +
          "cost as much as a building. Everything was a mainframe by default.",
        problem: "When minicomputers and then commodity servers arrived, the " +
          "obvious prediction was that mainframes would disappear — they were " +
          "expensive, proprietary and unfashionable. That prediction has been " +
          "made continuously since roughly 1990 and has not come true.",
        shift: "The reason is that mainframes optimise for something " +
          "distributed systems solve expensively: **transaction integrity and " +
          "I/O throughput on one machine**. Rather than achieving reliability " +
          "through redundancy across many unreliable machines, a mainframe " +
          "achieves it through redundancy **inside one** — duplicated " +
          "processors executing in lockstep, hot-swappable everything, and " +
          "hardware that detects and corrects its own errors."
      },

      num: {
        t: "What a modern mainframe actually offers",
        h: ["Property", "Figure"],
        r: [
          ["Availability", "**99.999%+** (~5 min/year)"],
          ["Transactions", "billions per day per system"],
          ["I/O architecture", "**dedicated channel processors**"],
          ["Hardware redundancy", "lockstep CPUs, error-correcting everything"],
          ["Upgrades", "**components replaced while running**"],
          ["Share of world card transactions", "~87%"]
        ],
        n: "The **I/O architecture** is the underappreciated part. A mainframe " +
          "offloads I/O to dedicated channel processors, so the CPU is not " +
          "interrupted by data movement — which is why it sustains transaction " +
          "rates that would saturate a comparable x86 server on interrupt " +
          "handling alone. The economics are genuinely strange: a system costs " +
          "millions and is priced by **MIPS consumed**, so optimising a batch " +
          "job has a direct, large financial return in a way it rarely does on " +
          "commodity hardware. Note also that modern mainframes run **Linux** " +
          "— IBM z/Linux is common — so *mainframe* does not imply COBOL and " +
          "green screens."
      },

      miss: [
        {
          w: "Mainframes are obsolete legacy hardware.",
          r: "IBM ships new z-series generations regularly with current " +
            "process technology, hardware AI inference and modern " +
            "cryptographic acceleration. The **workload** is often decades old; " +
            "the machine is not."
        },
        {
          w: "A cluster of commodity servers can do the same thing more " +
            "cheaply.",
          r: "For most workloads, yes. For **high-volume transaction " +
            "processing with strict integrity**, the distributed equivalent " +
            "needs consensus protocols, distributed transactions and " +
            "significant engineering to approach the same guarantees. Banks " +
            "that modelled the migration frequently found the total cost " +
            "unfavourable."
        },
        {
          w: "Mainframes only run COBOL.",
          r: "They run Java, Python, Node.js and Linux. IBM z/OS supports " +
            "containers and modern toolchains. COBOL dominates because that is " +
            "what the **existing applications** are written in, not because it " +
            "is a limitation of the platform."
        },
        {
          w: "The cloud has made mainframes unnecessary.",
          r: "Some workloads have moved and many have not, and cloud providers " +
            "now offer mainframe-adjacent services precisely because the " +
            "demand persists. The binding constraint is usually not the " +
            "hardware but the **application** — decades of business logic that " +
            "is expensive and risky to move."
        }
      ],

      trade: {
        buys: [
          "Extreme reliability from hardware redundancy within one system.",
          "Enormous transaction throughput with strong integrity.",
          "Hardware upgrades with no downtime.",
          "Decades of backward compatibility — old binaries still run.",
          "Strong hardware-level security and cryptographic acceleration."
        ],
        costs: [
          "Very high acquisition and licensing cost.",
          "MIPS-based pricing makes inefficiency directly expensive.",
          "Specialist skills that are scarce and getting scarcer.",
          "Single-vendor dependency.",
          "Slower development cycles than commodity platforms."
        ],
        avoid: [
          "Any greenfield system — nobody should start here.",
          "The workload is web serving, analytics or general compute.",
          "You need elastic scaling.",
          "Commodity hardware plus a well-designed distributed system meets " +
            "the requirement, which for most workloads it does.",
          "Someone proposes migrating **off** one purely on principle — " +
            "measure the total cost honestly first."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "expert-system",

      why: {
        before: "Early AI pursued **general** reasoning — programs that could " +
          "solve any problem given logic and search. Progress was slow and the " +
          "results were toys.",
        problem: "General intelligence was too hard. But the 1970s insight, " +
          "from Feigenbaum's work on DENDRAL, was that **expertise is largely " +
          "domain-specific knowledge, not general reasoning**. A doctor is not " +
          "a better reasoner than a physicist; they know different things.",
        shift: "Stop trying to be general. Extract a domain expert's rules " +
          "explicitly — `IF fever AND stiff_neck THEN suspect_meningitis` — " +
          "put them in a **knowledge base**, and run a generic **inference " +
          "engine** over them. The separation of knowledge from reasoning is " +
          "the architectural contribution, and it survives everywhere today."
      },

      num: {
        t: "Expert systems against machine learning",
        h: ["Property", "Expert system", "ML model"],
        r: [
          ["Knowledge from", "**interviewing experts**", "labelled data"],
          ["Explainability", "**complete — trace the rules**", "post-hoc, approximate"],
          ["Handling novelty", "**fails outright**", "degrades"],
          ["Updating", "edit a rule", "retrain"],
          ["Cost of scale", "**rules interact combinatorially**", "more data"]
        ],
        n: "**MYCIN** (1976) diagnosed blood infections and reportedly " +
          "outperformed junior doctors — and was **never deployed**, partly " +
          "over liability and partly because integrating it into clinical " +
          "workflow in the 1970s was impractical. The commercial collapse came " +
          "from the maintenance curve: **rules interact**, so a system with a " +
          "thousand rules has an enormous space of interactions, and adding one " +
          "can break behaviour elsewhere in ways nobody predicts. The " +
          "**knowledge acquisition bottleneck** — experts cannot fully " +
          "articulate what they know — was the other wall, and it is precisely " +
          "the wall machine learning walked around by learning from examples " +
          "instead of explanations."
      },

      miss: [
        {
          w: "Expert systems failed and the approach was abandoned.",
          r: "The 1980s **commercial** wave collapsed; the ideas are " +
            "everywhere. Business rules engines (Drools), medical decision " +
            "support, tax software, insurance underwriting and configuration " +
            "systems are all expert systems. They are simply not called that " +
            "any more."
        },
        {
          w: "They are obsolete because machine learning is better.",
          r: "They are better in a specific regime: where **rules are known and " +
            "legally binding**, where **explainability is mandatory**, and " +
            "where **training data does not exist**. Tax law is a rule system; " +
            "learning it from examples would be absurd and unauditable."
        },
        {
          w: "The hard part is building the inference engine.",
          r: "The engine is well-understood and generic. The hard part is " +
            "**knowledge acquisition** — extracting rules from experts who " +
            "reason partly by intuition and cannot articulate it. This is the " +
            "bottleneck that killed the commercial wave."
        },
        {
          w: "LLMs have made rule-based systems irrelevant.",
          r: "They have made **knowledge acquisition** far cheaper, and they " +
            "cannot provide a rule system's guarantees: deterministic output, " +
            "complete audit trail, and provable coverage. The current pattern " +
            "is hybrid — use an LLM to help draft or apply rules, and keep the " +
            "rule engine as the authority where correctness must be provable."
        }
      ],

      trade: {
        buys: [
          "Complete explainability — every conclusion traces to specific rules.",
          "Works with no training data.",
          "Deterministic and auditable, which regulation often requires.",
          "Rules are editable by domain experts, not only engineers.",
          "Encodes knowledge that exists only in people's heads."
        ],
        costs: [
          "Knowledge acquisition is slow and often incomplete.",
          "Rules interact combinatorially; maintenance grows superlinearly.",
          "Brittle — fails completely outside its rules rather than degrading.",
          "Cannot learn from experience.",
          "Handles uncertainty awkwardly."
        ],
        avoid: [
          "The pattern is learnable from data and explainability is not " +
            "required.",
          "The domain is perceptual — vision, speech — where rules cannot " +
            "capture it.",
          "Rules would number in the thousands and interact heavily.",
          "The domain changes faster than rules can be maintained.",
          "No domain expert is available to encode."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
