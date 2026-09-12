/* ==========================================================================
   Depth pass 31 — graph decomposition algorithms, string matching, and the
   inference-serving stack.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "tarjan-s-algorithm",

      why: {
        before: "Finding strongly connected components meant **Kosaraju's** " +
          "method: run a DFS recording finish times, reverse every edge, then " +
          "DFS again in decreasing finish order. Correct, linear, and it " +
          "requires building and storing the **reversed graph**.",
        problem: "That doubles memory for the edge list and costs a second full " +
          "traversal. On a large graph both are real costs, and reversing is " +
          "awkward when the graph is streamed or externally stored.",
        shift: "Do it in **one pass**. Track, for each vertex, the lowest " +
          "**discovery index** reachable from its subtree using at most one " +
          "back edge — the **low-link** value. A vertex whose low-link equals " +
          "its own index is the **root** of an SCC, and everything above it on " +
          "the stack is that component."
      },

      num: {
        t: "Tarjan against Kosaraju",
        h: ["", "Tarjan", "Kosaraju"],
        r: [
          ["DFS passes", "**1**", "2"],
          ["Reversed graph needed", "**no**", "**yes**"],
          ["Complexity", "O(V+E)", "O(V+E)"],
          ["Constant factor", "**better**", "worse"],
          ["Output order", "**reverse topological**", "topological"],
          ["Ease of proof", "harder", "**much easier**"]
        ],
        n: "The **reverse topological order** of Tarjan's output is a genuinely " +
          "useful side effect: components are emitted in an order where every " +
          "component appears **after** everything it can reach, which is " +
          "exactly what you want for DP over the condensation without a " +
          "separate topological sort. The classic implementation bug is subtle " +
          "and worth stating: when updating low-link from a neighbour, you use " +
          "the neighbour's **low-link** if it is unvisited (a tree edge) but " +
          "its **index** if it is on the stack (a back edge) — and you must " +
          "**not** update at all from a vertex already assigned to a completed " +
          "SCC. Getting that third case wrong merges components that should be " +
          "separate, and the code still runs."
      },

      miss: [
        {
          w: "Low-link is the smallest index reachable from this vertex.",
          r: "It is the smallest index reachable **using at most one back edge, " +
            "via vertices still on the stack**. That restriction is what makes " +
            "the algorithm correct — without it you would propagate values " +
            "across already-completed components and merge them wrongly."
        },
        {
          w: "The stack holds the current DFS path.",
          r: "It holds **vertices whose SCC has not yet been identified**, " +
            "which is not the same as the recursion path. A vertex stays on the " +
            "stack after its DFS call returns if it might still belong to an " +
            "ancestor's component."
        },
        {
          w: "Tarjan is strictly better than Kosaraju, so always use it.",
          r: "It is faster and uses less memory, and Kosaraju is **much easier " +
            "to explain, implement and verify**. If you are writing this once " +
            "and correctness matters more than constant factors, Kosaraju's " +
            "two-pass structure is far harder to get wrong."
        },
        {
          w: "It works on undirected graphs.",
          r: "SCCs are a **directed graph** concept — in an undirected graph " +
            "every connected component is trivially strongly connected. Tarjan " +
            "has a *related* algorithm for **bridges and articulation " +
            "points** in undirected graphs using the same low-link idea, which " +
            "is a different algorithm often confused with this one."
        }
      ],

      trade: {
        buys: [
          "Single pass, no reversed graph.",
          "Linear time with a good constant factor.",
          "Emits components in reverse topological order.",
          "The low-link technique generalises to bridges and articulation " +
            "points."
        ],
        costs: [
          "Low-link update rules are subtle and error-prone.",
          "Harder to prove correct than Kosaraju.",
          "Recursive form overflows the stack on deep graphs.",
          "Requires an explicit stack and per-vertex state."
        ],
        avoid: [
          "You need clarity over speed — **Kosaraju** is far easier to verify.",
          "The graph is undirected — use connected components.",
          "You only need to detect whether a cycle exists — one DFS with " +
            "colouring.",
          "Recursion depth would overflow and an iterative rewrite is not " +
            "worth the complexity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rabin-karp",

      why: {
        before: "**KMP** and **Boyer-Moore** solve single-pattern search in " +
          "linear time by preprocessing the pattern and reusing match " +
          "information.",
        problem: "Neither extends cleanly to searching for **many patterns at " +
          "once**, or to comparing arbitrary substrings against each other. " +
          "Running KMP k times costs `O(k·n)`, and comparing every pair of " +
          "substrings is quadratic before you start.",
        shift: "Compare **hashes** instead of characters. A **rolling hash** " +
          "updates in `O(1)` as the window slides, so every window's hash is " +
          "computed in one pass, and comparison becomes an integer equality " +
          "test. Multiple patterns are then a **set lookup** of their hashes " +
          "— the same cost for one pattern or a thousand."
      },

      num: {
        t: "Where Rabin-Karp earns its place",
        h: ["Task", "Rabin-Karp", "Alternative"],
        r: [
          ["Single pattern in text", "O(n+m) avg", "**Boyer-Moore is faster**"],
          ["**k patterns of equal length**", "**O(n+km) — one pass**", "Aho-Corasick"],
          ["Compare arbitrary substrings", "**O(1) after preprocessing**", "no good alternative"],
          ["**Plagiarism / dedup**", "**natural fit**", "—"],
          ["Worst case", "**O(nm)**", "KMP is O(n+m) guaranteed"]
        ],
        n: "The **multi-pattern** row is the real argument, and it is why " +
          "Rabin-Karp survives despite being slower than Boyer-Moore on the " +
          "single-pattern case: hashing every window once and checking " +
          "membership in a hash set costs the same whether you are looking for " +
          "one pattern or ten thousand. That is why it underlies plagiarism " +
          "detection and content-defined chunking in deduplication systems. The " +
          "**worst case** row is the honest caveat — with adversarial input " +
          "engineered to collide, every window requires a full verification and " +
          "you get `O(nm)`. Choosing the base and modulus **randomly at " +
          "runtime** prevents precomputed attacks, and **double hashing** makes " +
          "accidental collisions negligible."
      },

      miss: [
        {
          w: "Rabin-Karp is a fast string search algorithm.",
          r: "For a **single** pattern in ordinary text it is typically " +
            "**slower** than Boyer-Moore, which skips ahead rather than " +
            "hashing every window. Its advantage is **multiple patterns** and " +
            "arbitrary substring comparison, not raw single-pattern speed."
        },
        {
          w: "A hash match means the strings match.",
          r: "It means they **probably** match. Rabin-Karp verifies " +
            "character-by-character on a hash hit, which is what keeps it " +
            "correct — and is why an adversary forcing constant collisions " +
            "drives it to `O(nm)`. Skipping verification makes it fast and " +
            "occasionally wrong."
        },
        {
          w: "Using a large prime modulus makes collisions impossible.",
          r: "The **birthday bound** applies: with a 10⁹ modulus, collisions " +
            "become likely after around 10⁵ comparisons. Count your " +
            "comparisons — **double hashing** with two moduli gives an " +
            "effective space near 10¹⁸ and is standard for anything " +
            "substantial."
        },
        {
          w: "It can find patterns of different lengths in one pass.",
          r: "A rolling hash is over a **fixed window size**. Patterns of " +
            "different lengths need one pass per distinct length, or a " +
            "different algorithm — **Aho-Corasick** handles mixed lengths " +
            "natively by building one automaton."
        }
      ],

      trade: {
        buys: [
          "Searches many equal-length patterns in one pass.",
          "`O(1)` comparison of arbitrary substrings after preprocessing.",
          "Simple to implement — rolling hash plus a set.",
          "Natural fit for deduplication and plagiarism detection.",
          "Generalises to 2D pattern matching."
        ],
        costs: [
          "`O(nm)` worst case under collisions.",
          "Probabilistic — needs verification or accepted error.",
          "Vulnerable to adversarial input without randomisation.",
          "Modular arithmetic invites overflow bugs.",
          "One window size per pass."
        ],
        avoid: [
          "Single pattern in ordinary text — **Boyer-Moore** is faster.",
          "You need a guaranteed linear worst case — **KMP** or **Z**.",
          "Patterns have different lengths — **Aho-Corasick**.",
          "Input is adversarial and you cannot randomise the hash."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "avl-tree",

      why: {
        before: "A binary search tree gives `O(log n)` operations **if it stays " +
          "bushy**, and nothing forces it to. Sorted insertion produces a " +
          "linked list with `O(n)` operations.",
        problem: "Sorted or near-sorted input is extremely common — timestamps, " +
          "auto-increment IDs, alphabetised data — so the degenerate case is " +
          "not a theoretical worry but the default outcome of realistic usage.",
        shift: "**Adelson-Velsky and Landis (1962)**, the first self-balancing " +
          "tree: store each node's balance factor (the height difference " +
          "between subtrees) and require it to stay in `{-1, 0, +1}`. When an " +
          "insertion or deletion violates that, restore it with **rotations** " +
          "— constant-time pointer rearrangements that preserve the search " +
          "order."
      },

      num: {
        t: "AVL against red-black",
        h: ["Property", "AVL", "Red-black"],
        r: [
          ["Balance invariant", "**height diff ≤ 1**", "≤ 2× path length"],
          ["Height at n = 10⁶", "**~28**", "~40"],
          ["Lookups", "**faster**", "slower"],
          ["Rotations per insert", "**≤ 2**", "≤ 2"],
          ["**Rotations per delete**", "**O(log n)**", "**≤ 3**"],
          ["Best for", "**read-heavy**", "**write-heavy, mixed**"]
        ],
        n: "The **deletion** row is the whole reason standard libraries chose " +
          "red-black. AVL's strict invariant means a deletion can trigger " +
          "rebalancing all the way to the root, where red-black caps it at " +
          "three rotations. For a general-purpose container facing mixed " +
          "workloads, bounded deletion cost beats a 30% height advantage — " +
          "which is why `std::map`, `TreeMap` and the Linux scheduler all use " +
          "red-black. AVL wins where reads overwhelmingly dominate. The four " +
          "rotation cases (LL, RR, LR, RL) are worth internalising as **two**: " +
          "the *straight* cases need one rotation, the *bent* cases need two, " +
          "with the first straightening the bend."
      },

      miss: [
        {
          w: "AVL trees are balanced, so both subtrees have equal size.",
          r: "It is a **height** invariant, not a size one. A valid AVL tree " +
            "can have one subtree with far more nodes than the other — the " +
            "constraint is only that their *heights* differ by at most one."
        },
        {
          w: "AVL is obsolete because red-black is used everywhere.",
          r: "Red-black won **general-purpose libraries** because of deletion " +
            "cost. AVL is genuinely better for read-dominated workloads, and " +
            "its stricter balance makes it preferred in some database index " +
            "structures. Neither dominates."
        },
        {
          w: "The balance factor must be recomputed from subtree heights.",
          r: "It is **maintained incrementally** — stored per node and updated " +
            "during insertion and deletion as you unwind the recursion. " +
            "Recomputing heights on every operation would make it `O(n)` and " +
            "defeat the purpose."
        },
        {
          w: "Rotations are expensive.",
          r: "A rotation is **three or four pointer assignments** — genuinely " +
            "`O(1)`. The `O(log n)` cost of an operation is the search for the " +
            "position and the walk back up, not the rebalancing itself."
        }
      ],

      trade: {
        buys: [
          "Guaranteed `O(log n)` regardless of insertion order.",
          "Shorter than red-black, so faster lookups.",
          "Sorted iteration and range queries.",
          "Conceptually simpler invariant than red-black."
        ],
        costs: [
          "Deletion can cascade rotations to the root.",
          "Slower writes than red-black.",
          "Balance factor storage per node.",
          "Beaten by hash tables for plain lookup and B-trees on disk."
        ],
        avoid: [
          "The workload is write-heavy — **red-black** bounds deletion cost.",
          "You need only key-value lookup — a **hash table** is faster.",
          "Data lives on disk — use a **B-tree**.",
          "You are implementing it yourself and a **skip list** would be " +
            "simpler with comparable behaviour."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "0-1-bfs",

      why: {
        before: "Shortest paths with weighted edges meant **Dijkstra** — a " +
          "priority queue, `O((V+E) log V)`. Unweighted meant **BFS** with a " +
          "plain queue, `O(V+E)`.",
        problem: "A common special case falls between them: every edge costs " +
          "**0 or 1**. Grid problems where some moves are free, graphs where " +
          "an edge is either *use the existing road* or *build a new one*. " +
          "Dijkstra works and pays `log V` for a heap it barely needs, since " +
          "there are only two distinct edge weights.",
        shift: "Replace the heap with a **deque**. A 0-weight edge does not " +
          "increase the distance, so push that vertex to the **front**; a " +
          "1-weight edge does, so push to the **back**. The deque stays sorted " +
          "by construction — it holds at most two distinct distance values at " +
          "any moment — so you get Dijkstra's correctness at BFS's `O(V+E)`."
      },

      num: {
        t: "Shortest path by edge-weight structure",
        h: ["Weights", "Algorithm", "Complexity"],
        r: [
          ["All equal", "BFS", "O(V+E)"],
          ["**0 or 1**", "**0-1 BFS (deque)**", "**O(V+E)**"],
          ["Small integers 0..k", "Dial's algorithm", "O(V·k + E)"],
          ["Arbitrary non-negative", "Dijkstra", "O((V+E) log V)"],
          ["Negative allowed", "Bellman-Ford", "O(V·E)"]
        ],
        n: "The invariant that makes it work is worth stating precisely: the " +
          "deque contains vertices at **at most two distinct distances**, `d` " +
          "and `d+1`, with all the `d`s in front. Pushing a 0-edge to the front " +
          "keeps it in the `d` group; pushing a 1-edge to the back puts it in " +
          "`d+1`. That is exactly the ordering a priority queue would produce, " +
          "achieved with `O(1)` operations. The table's third row generalises " +
          "the idea: **Dial's algorithm** uses `k+1` buckets for weights in " +
          "`0..k`, which is the same trick with more buckets, and is worth " +
          "knowing when weights are small integers rather than binary. As with " +
          "Dijkstra, you still need the **visited check** — a vertex can be " +
          "pushed several times with different distances."
      },

      miss: [
        {
          w: "0-1 BFS is just BFS with a small modification.",
          r: "It is **Dijkstra with a deque instead of a heap**. The " +
            "correctness argument is Dijkstra's — process vertices in " +
            "non-decreasing distance order — and the deque achieves that " +
            "ordering only because there are just two distinct weights."
        },
        {
          w: "It works for any small set of weights.",
          r: "It requires exactly **0 and 1**. With weights 0, 1 and 2 the " +
            "deque can hold three distinct distances and the ordering breaks. " +
            "**Dial's algorithm** with `k+1` buckets is the correct " +
            "generalisation."
        },
        {
          w: "You do not need a visited check since it is BFS-like.",
          r: "You do. A vertex can be added to the deque multiple times with " +
            "different tentative distances, and processing a stale larger " +
            "distance propagates wrong values. The check is required for " +
            "correctness, exactly as in Dijkstra."
        },
        {
          w: "It only applies to graphs with explicitly weighted edges.",
          r: "It is most useful on **implicit grid graphs**: moving through an " +
            "empty cell costs 0 and breaking a wall costs 1, or turning costs 1 " +
            "and continuing straight costs 0. Recognising the 0-1 structure in " +
            "a grid problem is the usual insight."
        }
      ],

      trade: {
        buys: [
          "Dijkstra's correctness at BFS's linear cost.",
          "No heap — `O(1)` deque operations throughout.",
          "About ten lines, barely more than plain BFS.",
          "Common in grid problems where some moves are free."
        ],
        costs: [
          "Restricted to weights of exactly 0 and 1.",
          "Still needs the visited check.",
          "Recognising the 0-1 structure requires insight.",
          "No advantage when weights are already uniform."
        ],
        avoid: [
          "Weights are arbitrary — **Dijkstra**.",
          "Weights are small integers beyond 0/1 — **Dial's algorithm**.",
          "All weights are equal — plain **BFS**.",
          "Negative weights exist — **Bellman-Ford**."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tensorrt-llm",

      why: {
        before: "Serving a model meant running the framework it was trained " +
          "in. PyTorch executes operations one at a time in Python, " +
          "dispatching each kernel individually with interpreter overhead " +
          "between them.",
        problem: "That is fine for research and wasteful for inference. Each " +
          "small operation launches its own kernel, writes results to memory, " +
          "and the next reads them back — so a sequence of elementwise " +
          "operations is dominated by **memory traffic and launch overhead** " +
          "rather than arithmetic.",
        shift: "**Compile the model into an optimised engine.** TensorRT-LLM " +
          "fuses adjacent operations into single kernels, selects the fastest " +
          "kernel implementation for the specific GPU by benchmarking, applies " +
          "quantisation, and produces an engine specialised for that hardware " +
          "and those shapes."
      },

      num: {
        t: "The serving stack, compared",
        h: ["", "TensorRT-LLM", "vLLM", "SGLang"],
        r: [
          ["Peak performance", "**highest on NVIDIA**", "high", "high"],
          ["Hardware", "**NVIDIA only**", "broad", "broad"],
          ["Setup", "**engine build per config**", "**pip install**", "pip install"],
          ["Flexibility", "**low — rebuild to change**", "high", "high"],
          ["Distinctive feature", "kernel fusion + autotuning", "PagedAttention", "**RadixAttention**"]
        ],
        n: "The **engine build** is the defining operational cost: it takes " +
          "minutes to hours and produces an artefact tied to a **specific GPU " +
          "model, batch size range, sequence length range and precision**. " +
          "Change any of those — deploy to a different GPU generation, raise " +
          "your max context — and you rebuild. That is a genuinely different " +
          "deployment model from `pip install vllm`, and it is why teams often " +
          "choose vLLM despite leaving performance on the table. The rule of " +
          "thumb: **TensorRT-LLM when you are running fixed configurations at " +
          "scale on NVIDIA hardware and the last 20-30% matters " +
          "economically**; vLLM or SGLang when you are iterating, serving " +
          "varied workloads, or value operational simplicity."
      },

      miss: [
        {
          w: "TensorRT-LLM is just a faster runtime you can swap in.",
          r: "It **compiles an engine** ahead of time, and that engine is bound " +
            "to specific hardware and shape ranges. It is a build step in your " +
            "deployment pipeline, not a library you import — a genuinely " +
            "different operational model."
        },
        {
          w: "The engine is portable across machines.",
          r: "It is compiled for a **specific GPU architecture** and often a " +
            "specific driver and TensorRT version. An engine built for an A100 " +
            "will not run on an H100. Engines are build artefacts, not model " +
            "checkpoints."
        },
        {
          w: "Compilation always gives a large speed-up.",
          r: "Gains are largest for **small batches and short sequences**, " +
            "where kernel launch overhead dominates. At large batch sizes with " +
            "long sequences you are memory-bandwidth-bound and already near the " +
            "hardware limit, so fusion buys less. Measure on your actual " +
            "workload."
        },
        {
          w: "You should use it because it benchmarks fastest.",
          r: "Benchmarks measure fixed configurations, which is exactly what it " +
            "is best at. Weigh the **rebuild burden**: every model update, " +
            "every hardware change and every configuration change is a build. " +
            "For many teams that operational cost exceeds the performance gain."
        }
      ],

      trade: {
        buys: [
          "Highest inference performance on NVIDIA hardware.",
          "Kernel fusion and hardware-specific autotuning.",
          "Integrated quantisation, in-flight batching and paged KV.",
          "Production-grade with Triton integration."
        ],
        costs: [
          "NVIDIA only.",
          "Engine build takes minutes to hours per configuration.",
          "Engines are not portable across GPU generations.",
          "Any change requires a rebuild.",
          "Steeper learning curve than pip-installable alternatives."
        ],
        avoid: [
          "You are iterating on models or configurations frequently.",
          "You run on non-NVIDIA hardware.",
          "Operational simplicity matters more than the last 20-30%.",
          "Workloads vary widely in shape — one engine cannot cover them.",
          "**vLLM** or **SGLang** meet your throughput needs, which is often " +
            "the case."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "multi-agent-system",

      why: {
        before: "One agent with one prompt handled the whole task — planning, " +
          "research, writing, review — carrying every instruction and every " +
          "tool in a single context.",
        problem: "That context becomes crowded and the instructions interfere. " +
          "A prompt telling the model to be a careful researcher **and** a " +
          "concise writer **and** a critical reviewer produces mediocre " +
          "performance at all three, and the accumulated conversation crowds " +
          "out the task.",
        shift: "**Specialise and separate.** Give each agent one role, its own " +
          "focused prompt, its own tools and its own context window. A " +
          "researcher gathers, a writer drafts, a critic reviews. Each does one " +
          "thing well — and you have introduced a coordination problem that did " +
          "not previously exist."
      },

      num: {
        t: "What multi-agent costs",
        h: ["Property", "Single agent", "Multi-agent"],
        r: [
          ["Context per agent", "crowded", "**focused**"],
          ["**Token cost**", "**1×**", "**often 3–15×**"],
          ["Latency", "sequential", "**parallel where independent**"],
          ["Error propagation", "contained", "**compounds across handoffs**"],
          ["Debuggability", "one trace", "**many interacting traces**"],
          ["Information loss", "none", "**at every handoff**"]
        ],
        n: "The **token cost** row is the one teams discover late: Anthropic " +
          "reported multi-agent research systems using roughly **15× the tokens** " +
          "of a single chat interaction, because every agent re-establishes " +
          "context and handoffs duplicate information. That is justified when " +
          "the task genuinely parallelises — several independent research " +
          "threads — and pure overhead when it does not. The **information " +
          "loss at handoffs** is the subtler failure: agent A summarises its " +
          "findings for agent B, and the detail B actually needed was in the " +
          "part A judged unimportant. The practical guidance that has emerged " +
          "is to prefer **a single agent with good tools** until you can name " +
          "the specific parallelism or specialisation you are buying."
      },

      miss: [
        {
          w: "More agents means better results.",
          r: "More agents means more **handoffs**, and each handoff loses " +
            "information and adds cost. Systems with many agents frequently " +
            "perform **worse** than one well-prompted agent with good tools, " +
            "while costing several times more."
        },
        {
          w: "Agents will coordinate sensibly if you describe their roles.",
          r: "Coordination is the **hard part** and it does not emerge from " +
            "role descriptions. Without an explicit protocol — who decides, " +
            "how disagreement resolves, when to stop — agents loop, duplicate " +
            "work, or defer to each other indefinitely."
        },
        {
          w: "A debate between agents produces better answers.",
          r: "Sometimes, and less reliably than the framing suggests. Agents " +
            "from the same base model share blind spots and often **converge " +
            "on a confident wrong answer** rather than genuinely challenging " +
            "each other. Grounding in external verification matters far more " +
            "than the number of participants."
        },
        {
          w: "Multi-agent is how you handle complex tasks.",
          r: "It is one option. **Better tools, better prompting, or a " +
            "planner-executor split** frequently outperform it at a fraction " +
            "of the cost. The genuine case for multi-agent is *parallel " +
            "independent subtasks* or *genuinely distinct tool and permission " +
            "scopes*."
        }
      ],

      trade: {
        buys: [
          "Focused context and instructions per role.",
          "Genuine parallelism on independent subtasks.",
          "Separate tool and permission scopes per agent.",
          "Specialised prompts outperform one general prompt at each job."
        ],
        costs: [
          "Often 3–15× the token cost.",
          "Information lost at every handoff.",
          "Coordination requires an explicit protocol.",
          "Errors compound across agents.",
          "Substantially harder to debug and evaluate."
        ],
        avoid: [
          "The task is sequential with no independent parallel work.",
          "A single agent with better tools would suffice — usually true.",
          "Cost or latency is constrained.",
          "You cannot define a clear coordination protocol.",
          "You are adding agents because the architecture sounds " +
            "sophisticated."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reward-model",

      why: {
        before: "Fine-tuning optimised a loss you could write down — " +
          "cross-entropy against a target sequence. Every objective had to be " +
          "expressible as a formula over tokens.",
        problem: "*Helpful*, *harmless* and *well-written* have no such " +
          "formula. You cannot differentiate them, and you cannot enumerate " +
          "the correct output for every prompt. But people can reliably say " +
          "**which of two responses is better**, even when they could not have " +
          "written either.",
        shift: "**Learn the objective.** Train a model on preference " +
          "comparisons to output a scalar score, using the Bradley-Terry " +
          "formulation — the probability a human prefers A over B is a " +
          "function of the score difference. That gives you a differentiable " +
          "proxy for a goal nobody can specify, which RL can then optimise."
      },

      num: {
        t: "Where reward models are used",
        h: ["Use", "How", "Note"],
        r: [
          ["**RLHF / PPO**", "the optimisation target", "the original purpose"],
          ["**Best-of-n sampling**", "**generate n, pick the highest score**", "**no training needed**"],
          ["Rejection sampling", "filter training data", "cheap quality gate"],
          ["Evaluation", "automatic scoring", "biased toward its own training"],
          ["Not needed by", "**DPO, ORPO**", "reward is implicit in the policy"]
        ],
        n: "**Best-of-n sampling is the most under-used application**: with a " +
          "reward model you can generate several candidates at inference and " +
          "return the best-scoring one, with no fine-tuning at all. It is a " +
          "direct quality-for-compute trade, and returns flatten around n=8-16. " +
          "The defining failure is **reward hacking** — the policy finds inputs " +
          "that score highly and are bad, because the reward model was trained " +
          "on a narrow distribution and becomes unreliable outside it. This is " +
          "Goodhart's law operating precisely: the measure stops being a good " +
          "measure once it is a target. The **KL penalty** in RLHF exists to " +
          "bound how far the policy may drift from the distribution the reward " +
          "model actually understands."
      },

      miss: [
        {
          w: "A reward model knows what a good response is.",
          r: "It knows **what a particular set of labellers preferred, on a " +
            "particular distribution of prompts**. Push far from that " +
            "distribution and its scores become unreliable — which is exactly " +
            "what an optimiser will do, since that is where the exploitable " +
            "high scores are."
        },
        {
          w: "Higher reward means a better response.",
          r: "Within the training distribution, usually. Under optimisation " +
            "pressure the relationship **inverts** past a point: responses " +
            "scoring extremely highly are frequently degenerate, exploiting " +
            "artefacts of the reward model rather than being good."
        },
        {
          w: "DPO removed the need for reward models.",
          r: "DPO removes the need to **train one for alignment** — the reward " +
            "is implicit in the policy. A standalone reward model remains " +
            "valuable for **best-of-n sampling, data filtering and automatic " +
            "evaluation**, none of which DPO provides."
        },
        {
          w: "A bigger reward model is more reliable.",
          r: "Scale helps and the binding constraint is usually **preference " +
            "data quality and coverage**. A large reward model trained on " +
            "narrow or inconsistent labels is confidently wrong over a wider " +
            "area. Label agreement between annotators is the number to check " +
            "first."
        }
      ],

      trade: {
        buys: [
          "Turns unspecifiable goals into a differentiable objective.",
          "Enables best-of-n sampling with no fine-tuning.",
          "Reusable for filtering training data and automatic evaluation.",
          "Far more label-efficient than writing demonstrations."
        ],
        costs: [
          "Reward hacking is a persistent and subtle failure.",
          "Unreliable outside its training distribution.",
          "Another model to train, store and serve.",
          "Inherits labeller bias directly.",
          "Requires substantial preference data."
        ],
        avoid: [
          "You have a **verifiable** reward — tests, a checker — which is " +
            "strictly better and cannot be hacked the same way.",
          "You only need alignment and **DPO** would do without one.",
          "You cannot collect enough consistent preference data.",
          "An objective automatic metric already captures what you want."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "raptor",

      why: {
        before: "RAG chunks documents into fixed-size pieces, embeds each, and " +
          "retrieves the top-k most similar. Every chunk sits at the same " +
          "level of abstraction — a few hundred words of detail.",
        problem: "Questions do not all live at that level. *What was the " +
          "revenue in Q3* needs a specific chunk; *what is this report's " +
          "overall argument* needs the whole document, and no collection of " +
          "detail chunks answers it. Flat retrieval can only ever return " +
          "detail.",
        shift: "Build a **tree of summaries**. Cluster related chunks, have an " +
          "LLM summarise each cluster, then cluster and summarise those " +
          "summaries, recursively — producing layers from raw detail up to " +
          "document-level abstraction. Retrieval then searches **all levels " +
          "at once**, so a broad question naturally matches a high-level " +
          "summary and a specific one matches a leaf."
      },

      num: {
        t: "Flat against hierarchical retrieval",
        h: ["Question type", "Flat RAG", "RAPTOR"],
        r: [
          ["Specific fact", "**good**", "good"],
          ["**Thematic / summarising**", "**poor**", "**good**"],
          ["Multi-section synthesis", "poor", "good"],
          ["**Index cost**", "**embedding only**", "**LLM calls per cluster**"],
          ["Update cost", "re-embed one chunk", "**may restructure the tree**"]
        ],
        n: "The **collapsed tree** retrieval mode is RAPTOR's practical " +
          "contribution: rather than traversing the tree top-down, it flattens " +
          "every node from every level into one searchable pool, so the " +
          "appropriate abstraction level is selected by **similarity** rather " +
          "than by a routing decision you have to make. The costs are the same " +
          "shape as GraphRAG's — **LLM calls across the corpus at index " +
          "time**, and awkward incremental updates since adding documents can " +
          "change the clustering. It sits between flat RAG and GraphRAG in both " +
          "capability and expense: cheaper than building an entity graph, more " +
          "capable than flat chunks for thematic questions."
      },

      miss: [
        {
          w: "RAPTOR replaces flat chunking.",
          r: "The **leaves are the original chunks**. RAPTOR adds summary " +
            "layers above them, so specific-fact retrieval works exactly as " +
            "before. It is additive, not a replacement — which is why it does " +
            "not degrade the cases flat RAG already handled."
        },
        {
          w: "You retrieve by traversing the tree from the root.",
          r: "Tree traversal is one mode; the **collapsed tree** — searching " +
            "all nodes at all levels in one flat index — performs better in " +
            "the paper's evaluation and is simpler. The hierarchy is a " +
            "construction device, not necessarily a search path."
        },
        {
          w: "Summaries lose information, so retrieval quality drops.",
          r: "Summaries are **added**, not substituted. A query matching a " +
            "summary retrieves that summary; a query matching detail retrieves " +
            "the leaf. You have widened what the index can answer without " +
            "removing anything."
        },
        {
          w: "It is cheap because summarisation is a one-off cost.",
          r: "It is an LLM call **per cluster at every level** across the whole " +
            "corpus — substantial for a large one. And it is not truly one-off: " +
            "adding documents can change the clustering, so incremental updates " +
            "are awkward and periodic rebuilds are the norm."
        }
      ],

      trade: {
        buys: [
          "Answers thematic and summarising questions flat RAG cannot.",
          "Retrieval picks the right abstraction level automatically.",
          "Leaves preserve specific-fact retrieval unchanged.",
          "Cheaper than building a full knowledge graph."
        ],
        costs: [
          "LLM calls per cluster at every level to index.",
          "Incremental updates can restructure the tree.",
          "Larger index — summaries plus originals.",
          "Summaries can misrepresent their clusters."
        ],
        avoid: [
          "All questions are specific factual lookups.",
          "The corpus changes frequently.",
          "The indexing budget is tight.",
          "**Contextual retrieval** and reranking would address your actual " +
            "failures more cheaply — try those first.",
          "The corpus fits in a context window."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
