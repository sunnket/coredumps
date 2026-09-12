/* ==========================================================================
   Depth pass 44 — the last of the intermediate CS fundamentals: how text
   becomes structure, what the CPU actually runs, and the two rate limiters.

   Token bucket and leaky bucket are the pair most often confused, and the
   difference is exactly one thing: whether bursts are allowed. Almost every
   rate-limiting argument in a design review reduces to that question.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "parser",

      why: {
        before: "Reading structured text meant splitting on delimiters and " +
          "indexing the pieces — `split(',')` for CSV, a regex for a config " +
          "line, string search for tags.",
        problem: "Those techniques handle **flat** text and fail on " +
          "**nesting**. A regex cannot match balanced brackets, because " +
          "regular languages cannot count without bound — that is a theorem, " +
          "not an implementation gap. Nested JSON, arithmetic with " +
          "parentheses, and HTML all require unbounded counting.",
        shift: "**Read according to a grammar and build a structure.** A " +
          "parser consumes tokens, follows grammar rules, and produces a tree. " +
          "It also **reports where and why input was invalid**, which " +
          "ad-hoc splitting never does. The pipeline is standard: characters → " +
          "**lexer** → tokens → **parser** → tree."
      },

      num: {
        t: "Parsing strategies",
        h: ["Strategy", "Direction", "Note"],
        r: [
          ["**Recursive descent**", "**top-down**", "**hand-written, best errors**"],
          ["LL(k)", "top-down", "k tokens of lookahead"],
          ["**LR / LALR**", "**bottom-up**", "**yacc, bison — more grammars**"],
          ["**Pratt / precedence climbing**", "top-down", "**expressions with precedence**"],
          ["PEG / packrat", "top-down", "ordered choice, no ambiguity"],
          ["Combinators", "top-down", "composable, in-language"]
        ],
        n: "**Recursive descent is what production compilers actually use** — " +
          "GCC, Clang, Roslyn and the V8 JavaScript parser are all hand-" +
          "written recursive descent, despite generators being available. The " +
          "reason is **error messages**: a generated LR parser can say " +
          "*syntax error at token 47*, while hand-written code knows it was " +
          "parsing a function argument list and can say *expected `)` to close " +
          "the argument list opened on line 12*. For a modern compiler, error " +
          "quality outweighs the convenience of a grammar file. Two structural " +
          "notes: **Pratt parsing** is the clean solution to operator " +
          "precedence, which naive recursive descent handles with an awkward " +
          "cascade of one function per precedence level; and the **Chomsky " +
          "hierarchy** sets hard limits — regular languages cannot nest, " +
          "context-free languages cannot check that a variable was declared, " +
          "which is why type checking is a **separate pass** after parsing " +
          "rather than part of the grammar."
      },

      miss: [
        {
          w: "A regular expression can parse HTML or JSON with enough effort.",
          r: "**It cannot** — this is a proven limit, not a difficulty. Regular " +
            "languages cannot count arbitrary nesting depth. Some regex " +
            "engines add recursion extensions, which means they are no longer " +
            "regular expressions in the formal sense."
        },
        {
          w: "Real compilers use parser generators.",
          r: "Most **do not**. GCC, Clang, V8 and Roslyn use hand-written " +
            "recursive descent, chosen for **error message quality** and " +
            "control over recovery. Generators are convenient for small " +
            "languages and tools."
        },
        {
          w: "Parsing means going straight from text to a tree.",
          r: "It is two stages. A **lexer** turns characters into tokens — " +
            "handling whitespace, comments and string literals — and the " +
            "**parser** turns tokens into a tree. Separating them makes both " +
            "dramatically simpler."
        },
        {
          w: "A parser's job is to accept valid input.",
          r: "Half its job. **Rejecting invalid input with a useful message** " +
            "and **recovering to continue finding more errors** is what " +
            "separates a usable compiler from a frustrating one. Error " +
            "recovery is often the majority of a real parser's code."
        }
      ],

      trade: {
        buys: [
          "Handles arbitrary nesting, which regex cannot.",
          "Precise error locations and messages.",
          "Produces a structure that later passes can analyse.",
          "Grammar serves as documentation of the language.",
          "Recursive descent maps grammar rules to functions readably."
        ],
        costs: [
          "Far more code than splitting on a delimiter.",
          "Grammar ambiguity is subtle to diagnose.",
          "Error recovery is difficult and often the bulk of the work.",
          "Recursive descent can overflow the stack on deep input.",
          "Left recursion needs restructuring in top-down parsers."
        ],
        avoid: [
          "The format is flat — splitting is correct and clear.",
          "A library parser exists for the format, which it usually does.",
          "The input is trusted and simple.",
          "You need semantic checks — those belong in a later pass."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "machine-code",

      why: {
        before: "Early programs were entered as raw numbers — the actual bit " +
          "patterns the processor decodes. There was no layer between the " +
          "programmer and the instruction encoding.",
        problem: "Writing and reading those numbers is error-prone and " +
          "unproductive, and the encoding is **specific to one processor " +
          "family**. Code written for one architecture is meaningless on " +
          "another.",
        shift: "Everything above — assembly, C, Python, JavaScript — exists to " +
          "avoid writing machine code, and **all of it becomes machine code " +
          "eventually**. Understanding what the CPU actually receives explains " +
          "why some code is fast, why undefined behaviour is dangerous, why " +
          "binaries are not portable, and what a JIT compiler is doing at run " +
          "time."
      },

      num: {
        t: "The layers, and what performs the translation",
        h: ["Layer", "Example", "Translated by"],
        r: [
          ["High-level source", "`x = a + b`", "compiler"],
          ["**Assembly**", "**`add rax, rbx`**", "**assembler — 1:1 mapping**"],
          ["**Machine code**", "**`48 01 D8`**", "**nothing — the CPU decodes it**"],
          ["Bytecode", "JVM, CPython", "**interpreter or JIT**"],
          ["**Micro-ops**", "internal", "**the CPU's own decoder**"]
        ],
        n: "The **micro-ops** row is the part people miss: on modern x86 the " +
          "CPU does not execute machine code directly either. It **decodes " +
          "instructions into internal micro-operations**, reorders them, " +
          "executes them speculatively and out of order, then retires results " +
          "in program order. So x86 is itself an interface, and this is what " +
          "**Spectre and Meltdown** exploited — speculative execution leaving " +
          "observable traces in the cache. Two further points worth carrying: " +
          "**assembly maps almost 1:1 to machine code** while high-level " +
          "languages do not, which is why compiler output can be radically " +
          "restructured relative to your source; and this is exactly why " +
          "**undefined behaviour** is so dangerous — the compiler is permitted " +
          "to assume UB never occurs and may delete the code that checks for " +
          "it, so the generated machine code can differ fundamentally from " +
          "what the source appears to say."
      },

      miss: [
        {
          w: "Machine code and assembly are the same thing.",
          r: "Assembly is **human-readable text**; machine code is the " +
            "**binary encoding**. The mapping is nearly 1:1, and an assembler " +
            "still resolves labels, symbols and addressing modes. You can read " +
            "assembly; you cannot practically read raw bytes."
        },
        {
          w: "The CPU executes machine code directly.",
          r: "Modern x86 processors **decode instructions into micro-ops**, " +
            "reorder them and execute speculatively. The instruction set is an " +
            "interface, not a description of the hardware — which is precisely " +
            "what Spectre exploited."
        },
        {
          w: "Interpreted languages never produce machine code.",
          r: "Any **JIT** compiler does — V8, the JVM's HotSpot and PyPy all " +
            "generate machine code at run time for hot paths. That is why they " +
            "outperform pure interpreters, sometimes approaching C."
        },
        {
          w: "Machine code is portable across operating systems.",
          r: "It is specific to an **instruction set** *and* the OS's calling " +
            "conventions, system call interface and binary format — ELF on " +
            "Linux, PE on Windows, Mach-O on macOS. Same CPU, different OS, " +
            "incompatible binaries."
        }
      ],

      trade: {
        buys: [
          "Maximum control and no abstraction overhead.",
          "Access to instructions no high-level language exposes.",
          "Essential for bootloaders, kernels and reverse engineering.",
          "Explains real performance behaviour."
        ],
        costs: [
          "Architecture and OS specific — not portable.",
          "Extremely difficult to write and maintain.",
          "No type safety or checks of any kind.",
          "Modern compilers usually optimise better than hand-written code.",
          "Hardware behaviour differs from the documented model."
        ],
        avoid: [
          "A compiler can generate it — it almost always can, better.",
          "Portability is required.",
          "The performance gain is unmeasured.",
          "Intrinsics or inline assembly would suffice for the hot path."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "token-bucket",

      why: {
        before: "The obvious rate limit is a **fixed window**: count requests " +
          "per minute, reject above the limit, reset at the boundary.",
        problem: "Fixed windows allow **double the limit at a boundary** — 100 " +
          "requests at 11:59:59 and 100 more at 12:00:01 is 200 in two " +
          "seconds, which is exactly what the limit existed to prevent. And " +
          "they are unfair: a client that stayed quiet for 59 seconds gets no " +
          "credit for it.",
        shift: "**Accumulate credit over time.** A bucket holds tokens, " +
          "refilled at a steady rate up to a capacity. Each request consumes " +
          "one; empty bucket means reject or wait. Idle time **builds credit " +
          "up to the bucket size**, so a client that has been quiet may burst " +
          "— which matches how real clients behave and is why token bucket is " +
          "the default choice for API rate limiting."
      },

      num: {
        t: "Rate limiting algorithms",
        h: ["Algorithm", "Bursts", "State per client", "Boundary problem"],
        r: [
          ["Fixed window", "**yes — double at edges**", "**a counter**", "**yes**"],
          ["Sliding log", "no", "**every timestamp**", "no"],
          ["Sliding window counter", "limited", "two counters", "**mostly solved**"],
          ["**Token bucket**", "**yes — up to capacity**", "**tokens + timestamp**", "**no**"],
          ["**Leaky bucket**", "**no — strictly smooth**", "queue", "no"]
        ],
        n: "Token bucket's practical advantage is the **state per client**: " +
          "two numbers — the token count and the last refill time — with no " +
          "background timer needed, because tokens are computed lazily as " +
          "`elapsed × rate` at request time. A sliding log is exact and stores " +
          "**every timestamp**, which at millions of clients is prohibitive. " +
          "The two parameters express different things and both matter: " +
          "**rate** is the sustained throughput and **capacity** is the burst " +
          "size, so `100/second with a capacity of 500` permits a five-second " +
          "burst then settles to 100/s. This is why AWS, Stripe and most " +
          "public APIs use token bucket — clients naturally arrive in bursts, " +
          "and rejecting a legitimate burst from an otherwise-quiet client is " +
          "bad behaviour. In distributed deployments the bucket must be " +
          "**shared** (typically Redis with an atomic Lua script), or `n` " +
          "instances each permit the full rate."
      },

      miss: [
        {
          w: "Token bucket smooths traffic.",
          r: "It **permits bursts up to the bucket capacity** by design. If " +
            "you need strictly smooth output — a constant rate downstream — " +
            "that is **leaky bucket**. Choosing token bucket and expecting " +
            "smoothing is the most common mix-up between the two."
        },
        {
          w: "It needs a background timer to refill.",
          r: "Refill is computed **lazily**: on each request, add " +
            "`elapsed × rate` tokens, capped at capacity. No timer, no " +
            "background job, and state is just two numbers per client."
        },
        {
          w: "Rate and capacity are the same setting.",
          r: "**Rate** is sustained throughput; **capacity** is maximum burst. " +
            "100/second with capacity 500 allows a 500-request burst then " +
            "settles to 100/s. Setting capacity equal to rate eliminates " +
            "bursting, which usually defeats the purpose."
        },
        {
          w: "It works unchanged across multiple servers.",
          r: "Per-instance buckets mean `n` instances allow `n × rate`. " +
            "Distributed limiting needs **shared state** — Redis with an " +
            "atomic script — or a coordinated allocation scheme. This is a " +
            "routine production oversight."
        }
      ],

      trade: {
        buys: [
          "Allows bursts, matching real client behaviour.",
          "`O(1)` state per client — two numbers.",
          "No boundary artefacts.",
          "Lazy refill needs no timer.",
          "Rate and burst are tuned independently."
        ],
        costs: [
          "Does not smooth output.",
          "Two parameters to tune rather than one.",
          "Needs shared state across instances.",
          "A burst can still overwhelm a fragile downstream.",
          "Clock skew affects lazy refill."
        ],
        avoid: [
          "Downstream needs strictly constant rate — **leaky bucket**.",
          "You need exact counts in a precise window — sliding log.",
          "Bursts are genuinely unacceptable.",
          "There is no shared store and you have many instances."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "leaky-bucket",

      why: {
        before: "Token bucket limits the **average** rate while permitting " +
          "bursts, which suits public APIs where clients arrive irregularly.",
        problem: "Some downstream systems cannot absorb bursts at all. A " +
          "legacy service that handles 100 requests per second collapses if " +
          "given 500 in one second, even when the minute's average is within " +
          "limits. Hardware links, serial devices and fixed-capacity thread " +
          "pools have the same property.",
        shift: "**Queue the requests and drain at a fixed rate.** Water pours " +
          "into a bucket at any rate and leaks out at a constant one; if the " +
          "bucket overflows, requests are dropped. The output is **strictly " +
          "smooth regardless of the input pattern**, which is exactly the " +
          "guarantee a fragile downstream needs — and it is the opposite of " +
          "what token bucket provides."
      },

      num: {
        t: "The two buckets, directly compared",
        h: ["", "Token bucket", "Leaky bucket"],
        r: [
          ["**Output pattern**", "**bursty, up to capacity**", "**strictly constant**"],
          ["**Excess requests**", "**rejected immediately**", "**queued, then dropped**"],
          ["Latency", "**none added**", "**queue wait — can be large**"],
          ["State", "two numbers", "**a queue**"],
          ["Protects", "**your own service**", "**the downstream**"],
          ["Typical use", "**public APIs**", "**traffic shaping, legacy backends**"]
        ],
        n: "The **latency** row is the cost people underestimate. Token bucket " +
          "rejects immediately, so a client learns instantly and can retry; " +
          "leaky bucket **accepts and delays**, so under sustained overload a " +
          "request may sit in the queue for many seconds and then be served " +
          "long after the caller has timed out — work done for nothing, and " +
          "the client cannot distinguish slow from broken. This is why a leaky " +
          "bucket needs a **bounded queue plus a deadline**: drop rather than " +
          "serve requests whose caller has already given up. Note the terms " +
          "are used inconsistently in the literature — some texts describe a " +
          "*leaky bucket as a meter*, which behaves identically to a token " +
          "bucket. When it matters, state the behaviour you mean (*smooth " +
          "output* or *burst allowance*) rather than relying on the name."
      },

      miss: [
        {
          w: "Leaky bucket and token bucket are interchangeable.",
          r: "They are **opposites** on the property that matters. Token " +
            "bucket permits bursts and rejects immediately; leaky bucket " +
            "forbids bursts and queues. Choose by asking whether the " +
            "**downstream** can absorb a burst."
        },
        {
          w: "Queueing is strictly better than rejecting.",
          r: "Queueing **adds latency and hides overload**. A request served " +
            "after the client timed out is wasted work, and the client " +
            "receives no signal to back off. Fast rejection is often the " +
            "kinder behaviour."
        },
        {
          w: "The queue can be unbounded since it drains steadily.",
          r: "If arrivals exceed the drain rate, an unbounded queue grows " +
            "**without limit** — memory exhaustion and unbounded latency. " +
            "The bucket **must** be bounded, and overflow must drop. That " +
            "bound is the whole safety property."
        },
        {
          w: "It protects your service from overload.",
          r: "It protects the **downstream** by smoothing what reaches it. " +
            "Your own service still receives every request and must hold the " +
            "queue. To protect yourself from load, reject early — token bucket " +
            "or a concurrency limit."
        }
      ],

      trade: {
        buys: [
          "Strictly constant output rate regardless of input.",
          "Protects fragile downstream systems.",
          "Absorbs short bursts instead of rejecting them.",
          "Predictable downstream load — capacity planning is simple.",
          "The standard model for network traffic shaping."
        ],
        costs: [
          "Adds queueing latency, unbounded without a deadline.",
          "Requires holding a queue — memory and management.",
          "Hides overload from the client until it drops.",
          "Wastes work on requests whose caller has timed out.",
          "More state than a token bucket."
        ],
        avoid: [
          "Clients need immediate accept/reject feedback — **token bucket**.",
          "Latency matters more than smoothness.",
          "The downstream handles bursts fine.",
          "You cannot bound the queue or enforce deadlines."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
