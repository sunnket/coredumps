/* ==========================================================================
   Depth pass 30 — complexity theory, training infrastructure, and the
   learning strategies that reduce how much labelled data you need.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "np-complete",

      why: {
        before: "Thousands of hard problems — scheduling, routing, packing, " +
          "satisfiability — were each studied separately, with no way to know " +
          "whether a fast algorithm existed for any of them.",
        problem: "Effort was fragmented. A researcher failing to find a " +
          "polynomial algorithm for graph colouring learned nothing about " +
          "whether one existed, and their failure told nobody anything about " +
          "the thousand adjacent problems.",
        shift: "Cook and Levin (1971) proved that **SAT is at least as hard as " +
          "every problem in NP**, and Karp then showed 21 classic problems " +
          "reduce to it. That collapsed thousands of open questions into " +
          "**one**: if any NP-complete problem has a polynomial algorithm, they " +
          "all do. Fifty years of failure to find one is the strongest " +
          "practical evidence that none exists."
      },

      num: {
        t: "What NP-complete means for your project",
        h: ["Response", "When it works"],
        r: [
          ["**Solver** (SAT, ILP, CP-SAT)", "**usually — real instances have structure**"],
          ["Approximation algorithm", "a bounded-quality answer suffices"],
          ["Heuristic / metaheuristic", "good enough, no guarantee needed"],
          ["Exploit special structure", "your graph is planar, bounded treewidth"],
          ["**Fixed-parameter tractable**", "**a parameter is small even if n is not**"],
          ["Exact exhaustive search", "n is genuinely tiny"]
        ],
        n: "The first row is the practically important one and it contradicts " +
          "the usual takeaway. **Modern SAT solvers routinely handle instances " +
          "with millions of variables**, and CP-SAT solves industrial " +
          "scheduling problems that are formally NP-hard every day. " +
          "NP-completeness is a statement about **worst case**, and real " +
          "instances almost never resemble the adversarial constructions the " +
          "hardness proof relies on. The correct response to *this is " +
          "NP-complete* is therefore **not** *give up* — it is *stop looking " +
          "for a general polynomial algorithm and reach for a solver*. Note " +
          "also **NP-hard** is the broader class: at least as hard as NP, but " +
          "not necessarily *in* NP — the halting problem is NP-hard and " +
          "undecidable."
      },

      miss: [
        {
          w: "NP-complete problems cannot be solved in practice.",
          r: "They are solved constantly. SAT solvers handle millions of " +
            "variables; industrial TSP instances with tens of thousands of " +
            "cities are solved **optimally**. The hardness is worst case, and " +
            "real instances have structure that solvers exploit aggressively."
        },
        {
          w: "NP-hard and NP-complete are the same thing.",
          r: "**NP-complete = NP-hard AND in NP** — solutions must be " +
            "verifiable in polynomial time. NP-hard alone is broader and " +
            "includes undecidable problems. The halting problem is NP-hard and " +
            "is not NP-complete because it is not in NP."
        },
        {
          w: "Proving your problem is NP-complete means you should stop.",
          r: "It means **stop searching for an exact general polynomial " +
            "algorithm** and redirect. It is genuinely useful information " +
            "arriving early: it tells you to reach for a solver, an " +
            "approximation, or a structural restriction rather than continuing " +
            "to look."
        },
        {
          w: "You prove NP-completeness by showing the problem is hard.",
          r: "You prove it by **reduction** — showing a known NP-complete " +
            "problem transforms into yours in polynomial time, so solving yours " +
            "would solve theirs. Reducing in the wrong direction proves " +
            "nothing, and it is the standard error."
        }
      ],

      trade: {
        buys: [
          "Tells you early to stop searching for an exact fast algorithm.",
          "One reduction covers thousands of problems.",
          "Redirects effort to solvers, approximations and structure.",
          "Underpins cryptographic hardness assumptions."
        ],
        costs: [
          "Worst-case framing understates what solvers achieve.",
          "Often quoted as a reason to give up prematurely.",
          "Says nothing about average-case difficulty.",
          "The reduction itself can be intricate to construct."
        ],
        avoid: [
          "Your instances are small or structured — try a **solver** first.",
          "Approximation within a few percent is acceptable.",
          "A parameter is small even though n is large — check fixed-parameter " +
            "tractability.",
          "You are using it to justify not trying, which is the most common " +
            "misuse."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "binary-search-on-the-answer",

      why: {
        before: "Binary search was understood as a way to find a value **in a " +
          "sorted array** — halve the range, compare, repeat.",
        problem: "Many optimisation problems have no array to search. *What is " +
          "the minimum capacity needed to ship all packages in D days?* has an " +
          "answer somewhere in a numeric range, and the range is not stored " +
          "anywhere.",
        shift: "Search the **answer space** instead. If you can write a " +
          "predicate `feasible(x)` that is **monotonic** — false, false, false, " +
          "then true forever — you can binary search for the boundary. The " +
          "array does not need to exist; the monotonicity is what binary search " +
          "actually requires."
      },

      num: {
        t: "When the pattern applies",
        h: ["Requirement", "Test"],
        r: [
          ["**Monotonic predicate**", "**if x works, does x+1 always work?**"],
          ["Bounded answer range", "you can state lo and hi"],
          ["Feasibility is checkable", "`check(x)` in reasonable time"],
          ["Complexity", "**O(check × log(range))**"]
        ],
        n: "The **monotonicity test** is the entire skill: *if capacity 20 " +
          "works, does capacity 21 also work?* Yes — so the predicate is " +
          "monotonic and binary search applies. If the answer is *not " +
          "necessarily*, it does not, and applying it anyway silently returns a " +
          "wrong boundary. The complexity is the reason this is so powerful: " +
          "**log of the range** is tiny — searching integers up to a billion " +
          "takes 30 iterations — so even an expensive `check` becomes " +
          "affordable. For **floating-point** answers, iterate a fixed 100 " +
          "times rather than comparing `lo < hi`, which may never terminate " +
          "due to precision. The `mid = lo + (hi - lo) / 2` form also avoids " +
          "the classic overflow bug that sat in Java's standard library for " +
          "nine years."
      },

      miss: [
        {
          w: "You need a sorted array to binary search.",
          r: "You need a **monotonic predicate**. The array is one source of " +
            "monotonicity, not the requirement. This reframing is what turns " +
            "binary search from a lookup technique into an optimisation " +
            "technique."
        },
        {
          w: "Any optimisation problem can be solved this way.",
          r: "Only if feasibility is **monotonic** in the answer. If a larger " +
            "value can be infeasible when a smaller one was feasible — capacity " +
            "constraints with fixed costs, for instance — the search converges " +
            "on the wrong boundary and gives no error."
        },
        {
          w: "The check function should be efficient for this to be worth it.",
          r: "The log factor is so small that even a slow check is usually " +
            "fine. Searching a billion-wide range is **30 checks**. If a single " +
            "greedy pass verifies feasibility in `O(n)`, the total is " +
            "`O(n log(range))` — very fast."
        },
        {
          w: "The same implementation works for integers and floats.",
          r: "Float search must run a **fixed iteration count** — around 100 " +
            "— because `lo < hi` may never become false with floating-point " +
            "precision, producing an infinite loop. Integer search terminates " +
            "naturally."
        }
      ],

      trade: {
        buys: [
          "Turns hard optimisation into easy feasibility checking.",
          "Logarithmic in the range, so it barely matters how wide it is.",
          "Applies wherever the predicate is monotonic.",
          "Short and hard to get asymptotically wrong."
        ],
        costs: [
          "Requires monotonicity, which must be verified not assumed.",
          "The boundary convention is easy to get off by one.",
          "Float search needs fixed iteration counts.",
          "Only finds a threshold, not a full solution."
        ],
        avoid: [
          "Feasibility is not monotonic in the answer.",
          "There is a direct formula or a greedy construction.",
          "The answer space is not a totally ordered range.",
          "You need the solution itself and reconstructing it from the " +
            "threshold is not straightforward."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "deepspeed-zero",

      why: {
        before: "Data parallelism replicated **everything** on every GPU — " +
          "parameters, gradients and optimiser state. Simple, and each GPU " +
          "holds an identical copy of state that only one of them needs at any " +
          "moment.",
        problem: "With Adam, each parameter costs roughly **16 bytes** across " +
          "fp16 weights, fp32 master weights and two optimiser moments. A 7B " +
          "model needs ~112GB of state per GPU, and eight GPUs hold eight " +
          "identical copies. Seven eighths of that memory is pure duplication.",
        shift: "Shard it in **stages**, so you can take exactly as much memory " +
          "saving as you need for as much extra communication as you can " +
          "afford. ZeRO-1 shards optimiser state, ZeRO-2 adds gradients, " +
          "ZeRO-3 adds parameters — and each stage is a strict superset of the " +
          "one before."
      },

      num: {
        t: "Memory per GPU, 7B model with Adam, 8 GPUs",
        h: ["Stage", "Shards", "Per-GPU", "Extra communication"],
        r: [
          ["ZeRO-0 (DDP)", "nothing", "~112 GB", "baseline"],
          ["**ZeRO-1**", "optimiser state", "~48 GB", "**none extra**"],
          ["**ZeRO-2**", "+ gradients", "~34 GB", "none extra"],
          ["**ZeRO-3**", "+ parameters", "**~14 GB**", "**~1.5×**"],
          ["+ ZeRO-Offload", "to CPU RAM", "less again", "**PCIe becomes the limit**"]
        ],
        n: "**ZeRO-1 and ZeRO-2 are close to free** — they replace an " +
          "all-reduce with a reduce-scatter plus all-gather, which moves the " +
          "same total volume. That makes ZeRO-2 a sensible default whenever " +
          "memory is at all tight. **ZeRO-3** is where you pay: parameters must " +
          "be gathered per layer during forward and backward, raising " +
          "communication roughly 50%, which is fine on NVLink and painful over " +
          "PCIe or Ethernet. **PyTorch FSDP is essentially ZeRO-3** — same " +
          "algorithm, native implementation — so for new PyTorch projects FSDP " +
          "is usually the better choice, with DeepSpeed retaining an edge in " +
          "offloading and its broader optimisation suite."
      },

      miss: [
        {
          w: "ZeRO is a different training algorithm.",
          r: "It computes **identical gradients and identical updates** to " +
            "plain data parallelism. It is purely a memory optimisation — the " +
            "resulting model is bit-for-bit what DDP would produce, given the " +
            "same seed."
        },
        {
          w: "Higher ZeRO stages are always better.",
          r: "Higher stages save memory and **cost communication**. If the " +
            "model fits at ZeRO-2, using ZeRO-3 makes training slower for " +
            "nothing. Use the **lowest stage that fits** — that is the whole " +
            "point of having stages."
        },
        {
          w: "ZeRO-Offload lets you train any model on one GPU.",
          r: "It moves optimiser state and optionally parameters to CPU RAM, " +
            "which works and makes **PCIe bandwidth** the bottleneck. Training " +
            "can become several times slower. It is a *fits at all* mechanism, " +
            "not a performance one."
        },
        {
          w: "You need DeepSpeed to use ZeRO.",
          r: "**PyTorch FSDP implements ZeRO-3 natively** and is generally the " +
            "better-integrated choice for new PyTorch work. DeepSpeed remains " +
            "valuable for its offloading, its Infinity NVMe support and its " +
            "wider optimisation suite."
        }
      ],

      trade: {
        buys: [
          "Memory falls roughly linearly with GPU count.",
          "Stages let you take exactly the saving you need.",
          "ZeRO-1 and ZeRO-2 are nearly free.",
          "Offloading enables training that otherwise would not fit.",
          "Identical results to plain data parallelism."
        ],
        costs: [
          "ZeRO-3 adds ~50% communication.",
          "Needs fast interconnect to be worthwhile.",
          "Offloading makes PCIe the bottleneck.",
          "Configuration is complex — many interacting options.",
          "Checkpointing sharded state is more involved."
        ],
        avoid: [
          "The model fits with plain DDP — that is faster.",
          "Interconnect is slow; ZeRO-3 will be dominated by communication.",
          "You are on PyTorch and **FSDP** covers your needs more simply.",
          "You are fine-tuning with LoRA, where optimiser state is already " +
            "tiny."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "active-learning",

      why: {
        before: "Building a labelled dataset meant sampling randomly from the " +
          "unlabelled pool and annotating until the budget ran out.",
        problem: "Random sampling wastes most of the budget. In a typical " +
          "dataset the model becomes confident about the easy majority very " +
          "quickly, and further random samples are overwhelmingly examples it " +
          "already handles. The **informative** examples — near the decision " +
          "boundary, or from rare classes — are exactly the ones random " +
          "sampling rarely picks.",
        shift: "Let the model choose what to label. Train on what you have, " +
          "score the unlabelled pool by **how much labelling each example " +
          "would teach**, and send the top ones to the annotator. Repeat. The " +
          "same accuracy for a fraction of the labels."
      },

      num: {
        t: "Query strategies",
        h: ["Strategy", "Selects", "Weakness"],
        r: [
          ["**Uncertainty sampling**", "lowest confidence", "**picks outliers and noise**"],
          ["Margin sampling", "smallest gap between top-2", "same, milder"],
          ["Query by committee", "where models disagree", "needs an ensemble"],
          ["**Diversity / core-set**", "**covers the space**", "ignores difficulty"],
          ["**Hybrid**", "**uncertain + diverse**", "**the usual answer**"]
        ],
        n: "The trap is that **pure uncertainty sampling selects outliers and " +
          "mislabelled data**, because the model is least confident about " +
          "genuinely ambiguous or corrupted examples — and labelling noise " +
          "teaches nothing. It also selects **near-duplicates**: a batch of the " +
          "50 most uncertain examples is often 50 variations of one hard case. " +
          "That is why practical systems combine uncertainty with " +
          "**diversity**, and why batch-mode selection is a distinct problem " +
          "from picking one example at a time. The other structural cost: the " +
          "labelled set is **no longer i.i.d.**, so it is biased toward the " +
          "boundary and cannot be used as a test set — you need a separate " +
          "randomly-sampled evaluation set."
      },

      miss: [
        {
          w: "Active learning always reduces labelling cost.",
          r: "It can be **worse than random** on datasets with high label " +
            "noise, on very small initial models that pick badly, or when " +
            "uncertainty concentrates on outliers. It also has a cold-start " +
            "problem: with almost no labels, the model's uncertainty estimates " +
            "are meaningless."
        },
        {
          w: "You can use the actively-selected data as a test set.",
          r: "It is **deliberately non-representative** — biased toward the " +
            "decision boundary by construction. Evaluating on it gives " +
            "pessimistic and misleading numbers. Hold out a **randomly " +
            "sampled** test set before starting."
        },
        {
          w: "Selecting the most uncertain examples is the right strategy.",
          r: "Uncertainty alone picks outliers, mislabelled data and " +
            "near-duplicates within a batch. **Combining uncertainty with " +
            "diversity** is standard practice for good reason, and pure " +
            "uncertainty sampling is a well-documented way to waste a labelling " +
            "budget."
        },
        {
          w: "It works with any model.",
          r: "It needs **meaningful uncertainty estimates**. Modern neural " +
            "networks are badly overconfident, so raw softmax scores are poor " +
            "uncertainty proxies — which is why calibration, ensembles or MC " +
            "dropout are usually needed to make the selection sensible."
        }
      ],

      trade: {
        buys: [
          "Comparable accuracy from far fewer labels.",
          "Focuses expensive expert annotation where it matters.",
          "Naturally surfaces rare classes and edge cases.",
          "Works with any pool of unlabelled data."
        ],
        costs: [
          "Requires an iterative human-in-the-loop pipeline.",
          "Uncertainty sampling selects noise and duplicates without " +
            "diversity.",
          "Labelled set is biased and unusable for evaluation.",
          "Cold start — early selections are poor.",
          "Retraining between rounds costs compute."
        ],
        avoid: [
          "Labelling is cheap — random sampling is simpler.",
          "You cannot run an iterative annotation loop.",
          "Label noise is high; uncertainty will select the noise.",
          "The unlabelled pool is small or unrepresentative.",
          "You have no calibrated uncertainty estimates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "online-learning",

      why: {
        before: "Models were trained in **batch**: collect data, train, " +
          "validate, deploy. Updating meant retraining on the full dataset and " +
          "shipping a new model.",
        problem: "That cycle is too slow when the world moves quickly — " +
          "recommendations, fraud, ad ranking, pricing. It also requires " +
          "holding the entire dataset, which becomes impossible for a stream " +
          "that never ends.",
        shift: "Update the model **incrementally** as each example arrives. " +
          "Memory is `O(model)` rather than `O(data)`, adaptation is immediate, " +
          "and the model never needs the historical dataset. The trade is that " +
          "you give up the ability to validate before deploying — the model " +
          "*is* the deployment."
      },

      num: {
        t: "Batch against online",
        h: ["Property", "Batch", "Online"],
        r: [
          ["Memory", "O(dataset)", "**O(model)**"],
          ["Adaptation", "next retrain", "**immediate**"],
          ["Validation before deploy", "**yes**", "**no**"],
          ["Reproducibility", "**yes — same data, same model**", "**order-dependent**"],
          ["Vulnerable to poisoning", "at retrain time", "**continuously**"],
          ["Rollback", "redeploy old model", "**hard — state has moved**"]
        ],
        n: "The last three rows are the operational reality that decides " +
          "whether this is a good idea. **Order dependence** means two runs on " +
          "the same data produce different models, so debugging *why did it " +
          "predict this* requires the full update history. **Continuous " +
          "poisoning exposure** is real: an attacker who can influence the " +
          "input stream steers the model in real time, with no retraining " +
          "checkpoint at which anyone reviews the data. And **rollback is " +
          "genuinely hard** — the model has no clean previous version, so " +
          "recovering from a bad update means restoring a snapshot and " +
          "replaying, which is why production systems checkpoint frequently and " +
          "monitor for drift aggressively. **Catastrophic forgetting** applies " +
          "too: without replay or regularisation the model drifts toward " +
          "whatever it saw most recently."
      },

      miss: [
        {
          w: "Online learning means the model improves continuously.",
          r: "It means the model **changes** continuously. Whether that is " +
            "improvement depends on the data quality, and it can degrade — " +
            "drifting toward recent noise, forgetting older patterns, or being " +
            "steered by adversarial input. Continuous change is not continuous " +
            "improvement."
        },
        {
          w: "It is the same as retraining frequently.",
          r: "Frequent batch retraining keeps a **validation gate** — you can " +
            "test the new model before deploying it. True online learning " +
            "updates the deployed model directly, with no checkpoint at which " +
            "to catch a problem. Frequent retraining is often the better " +
            "engineering answer."
        },
        {
          w: "Any model can be trained online.",
          r: "Models with **incremental update rules** can: linear models with " +
            "SGD, Naive Bayes, some tree ensembles. Others cannot be updated " +
            "one example at a time in any meaningful way, and neural networks " +
            "updated online are prone to catastrophic forgetting."
        },
        {
          w: "It removes the need to store data.",
          r: "You will still want data for **evaluation, debugging and " +
            "recovery**. And most practical systems keep a replay buffer " +
            "precisely to combat forgetting. The memory saving is real for the " +
            "training itself and rarely eliminates storage entirely."
        }
      ],

      trade: {
        buys: [
          "Immediate adaptation to changing conditions.",
          "Constant memory regardless of stream length.",
          "No retraining pipeline to schedule and run.",
          "Handles data too large to store."
        ],
        costs: [
          "No validation gate before changes take effect.",
          "Order-dependent and hard to reproduce.",
          "Continuously exposed to data poisoning.",
          "Rollback requires checkpoints and replay.",
          "Catastrophic forgetting without a replay buffer."
        ],
        avoid: [
          "**Frequent batch retraining** would meet the requirement — usually " +
            "true, and far safer.",
          "You need reproducibility or an audit trail.",
          "The input stream is untrusted.",
          "The data distribution is stable.",
          "You cannot monitor for degradation in real time."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "markov-chain",

      why: {
        before: "Modelling a sequence meant conditioning on the whole history — " +
          "`P(next | everything that came before)` — which requires " +
          "exponentially many parameters and exponentially much data.",
        problem: "That is intractable. For any interesting alphabet and any " +
          "reasonable history length, you cannot estimate the distribution and " +
          "you cannot store it.",
        shift: "Assume the **Markov property**: the next state depends only on " +
          "the current one. That reduces the model to a **transition matrix** " +
          "— one row per state — which is estimable, storable, and analysable " +
          "with linear algebra. The assumption is usually false in detail and " +
          "often close enough to be useful."
      },

      num: {
        t: "What the transition matrix tells you",
        h: ["Question", "Answer via"],
        r: [
          ["State after n steps", "`P^n` — matrix power"],
          ["**Long-run distribution**", "**eigenvector for λ = 1**"],
          ["Does it converge?", "**second-largest \\|λ\\|** — the mixing rate"],
          ["Expected time to reach a state", "solve a linear system"],
          ["Is it ergodic?", "irreducible + aperiodic"]
        ],
        n: "The **stationary distribution** is where this becomes genuinely " +
          "powerful: it is the eigenvector of the transition matrix for " +
          "eigenvalue 1, and it describes where the chain spends its time in " +
          "the long run regardless of where it started. **PageRank is exactly " +
          "this** — a random surfer's stationary distribution over web pages, " +
          "with a damping factor to guarantee the chain is irreducible and " +
          "aperiodic so the distribution exists and is unique. The " +
          "**second-largest eigenvalue** governs how fast it converges, which " +
          "in MCMC determines how long you must burn in. And **hidden Markov " +
          "models** extend the idea to the case where you observe something " +
          "correlated with the state rather than the state itself — the basis " +
          "of pre-neural speech recognition and much of bioinformatics."
      },

      miss: [
        {
          w: "The Markov property means the process has no memory.",
          r: "It means the **current state** contains everything relevant. If " +
            "history matters, put it in the state — a second-order chain " +
            "conditions on the last two observations by defining states as " +
            "*pairs*. The property constrains state design, not the phenomenon."
        },
        {
          w: "Every Markov chain has a stationary distribution.",
          r: "It requires the chain to be **irreducible** (every state " +
            "reachable from every other) and **aperiodic**. A chain with " +
            "absorbing states converges to those; a periodic chain oscillates " +
            "forever. PageRank's damping factor exists precisely to force these " +
            "conditions."
        },
        {
          w: "Markov chains are a simple toy model, superseded by neural " +
            "networks.",
          r: "They underpin **PageRank**, **MCMC** (the workhorse of Bayesian " +
            "inference), queueing theory, reliability modelling and hidden " +
            "Markov models. Their **analysability** is the point — you can " +
            "prove things about a Markov chain that you cannot prove about a " +
            "network."
        },
        {
          w: "A higher-order chain is a different kind of model.",
          r: "An order-k chain **is** a first-order chain over a state space of " +
            "k-tuples. The theory is identical; the state space grows " +
            "exponentially in k, which is exactly why higher orders become " +
            "impractical quickly."
        }
      ],

      trade: {
        buys: [
          "Tractable sequence modelling with few parameters.",
          "Rich analytical results — stationary distributions, hitting times.",
          "Underpins PageRank, MCMC, queueing and HMMs.",
          "Provable convergence conditions."
        ],
        costs: [
          "The memoryless assumption is usually false in detail.",
          "State space explodes for higher orders.",
          "Cannot capture long-range dependence.",
          "Estimating transitions needs data proportional to state pairs."
        ],
        avoid: [
          "Long-range dependencies matter — that is what transformers address.",
          "The state space would be unmanageably large.",
          "You need to model continuous dynamics — consider an SDE.",
          "A neural sequence model is available and you do not need " +
            "analysability."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-governance",

      why: {
        before: "Models were shipped by the team that built them. Deployment " +
          "was an engineering decision, and what happened afterwards was " +
          "monitored the way any service is monitored.",
        problem: "Models make **consequential decisions about people** — " +
          "credit, hiring, insurance, medical triage — and they degrade " +
          "silently, encode training-data bias, and cannot easily explain " +
          "themselves. Regulators noticed: the **EU AI Act**, the US " +
          "**SR 11-7** guidance for banks, and sector rules all now impose " +
          "obligations that are not satisfiable retrospectively.",
        shift: "Treat a model as a **governed asset** rather than a code " +
          "artefact. Documented purpose, recorded lineage, an approval gate " +
          "before deployment, ongoing monitoring, periodic review, and a named " +
          "accountable owner. Much of it is bureaucracy and the underlying " +
          "question is legitimate: *can you demonstrate this system does what " +
          "you claim?*"
      },

      num: {
        t: "What governance actually requires",
        h: ["Element", "Question it answers"],
        r: [
          ["**Model card**", "what is it for, and what is it **not** for"],
          ["**Lineage**", "**which data and code produced these weights**"],
          ["Approval gate", "who signed off, on what evidence"],
          ["Bias assessment", "does performance differ across groups"],
          ["Monitoring", "is it still working"],
          ["**Rollback plan**", "**what happens when it is not**"]
        ],
        n: "**Lineage is the one most teams cannot produce and most regulators " +
          "ask for first.** Given a deployed model, can you name the exact " +
          "dataset version, the preprocessing code, the hyperparameters and " +
          "the training run? Without it you cannot reproduce the model, explain " +
          "a decision, or investigate a complaint — and reconstructing it after " +
          "the fact is usually impossible. The **EU AI Act** classifies systems " +
          "by risk, with obligations rising sharply for high-risk uses " +
          "(employment, credit, education, law enforcement) including human " +
          "oversight and technical documentation. Note that governance is " +
          "**proportional**: a spam filter and a loan decision system warrant " +
          "very different levels, and applying bank-grade process to everything " +
          "produces theatre and resentment rather than safety."
      },

      miss: [
        {
          w: "Model governance is paperwork that slows teams down.",
          r: "Badly implemented, yes. The underlying questions — *what is this " +
            "for, what data made it, how do we know it works, who is " +
            "accountable* — are ones a serious team should be able to answer " +
            "anyway. Governance failures usually surface as **incidents**, not " +
            "as audit findings."
        },
        {
          w: "Explainability requirements mean you must use interpretable " +
            "models.",
          r: "Usually they require **meaningful information about the logic " +
            "involved** — which post-hoc methods, documented feature " +
            "importance and clear decision criteria can satisfy. Some " +
            "high-stakes contexts do push toward inherently interpretable " +
            "models; it is not a blanket rule."
        },
        {
          w: "Governance applies at deployment.",
          r: "It spans the **lifecycle**. Data provenance and consent are " +
            "collection-time concerns; bias assessment happens at training; " +
            "monitoring and periodic review continue for as long as the model " +
            "runs. Retrofitting it at deployment means the earlier evidence " +
            "does not exist."
        },
        {
          w: "Documenting the model is the main deliverable.",
          r: "**Monitoring and the ability to act** matter more. A model card " +
            "describing a model that has silently degraded for eight months is " +
            "worse than useless — it documents something that is no longer " +
            "true, with an official signature on it."
        }
      ],

      trade: {
        buys: [
          "Lineage makes models reproducible and decisions explicable.",
          "Bias assessment catches harm before deployment.",
          "Clear accountability and a rollback path.",
          "Regulatory compliance where it is required.",
          "Forces the questions a serious team should answer anyway."
        ],
        costs: [
          "Real process overhead on every deployment.",
          "Approval gates slow iteration.",
          "Documentation goes stale without discipline.",
          "Easily becomes theatre — signatures without substance."
        ],
        avoid: [
          "The model is internal, low-stakes and affects no individual — " +
            "scale the process down.",
          "It is a research prototype not going to production.",
          "The process would be theatre with no capacity to act on findings.",
          "Basic monitoring and versioning are not in place — do those first, " +
            "they deliver most of the value."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "glove",

      why: {
        before: "**word2vec** learned embeddings by predicting words from " +
          "local context windows — a shallow neural network sliding over the " +
          "corpus. It worked remarkably well and its objective was implicit.",
        problem: "Local windows discard **global statistics**. The full " +
          "co-occurrence matrix — how often every word appears near every " +
          "other across the entire corpus — is computed and thrown away one " +
          "window at a time. Meanwhile older count-based methods (LSA) used " +
          "global statistics and produced worse analogy performance.",
        shift: "Use the global matrix **explicitly**. GloVe's insight is that " +
          "meaning is captured by **ratios of co-occurrence probabilities**: " +
          "`P(ice|solid)/P(steam|solid)` is large, the reverse for *gas*, and " +
          "near 1 for *water*. Fit embeddings so that dot products predict " +
          "log co-occurrence counts, and the ratio structure — which is what " +
          "makes analogies work — falls out."
      },

      num: {
        t: "GloVe against word2vec",
        h: ["Property", "word2vec", "GloVe"],
        r: [
          ["Uses", "local windows", "**global co-occurrence matrix**"],
          ["Training", "streaming, online", "**matrix factorisation**"],
          ["Memory", "low", "**large matrix**"],
          ["Rare words", "weaker", "**better — global counts**"],
          ["Out-of-vocabulary", "**none**", "**none**"],
          ["Practical difference", "**small — both are static**", "small"]
        ],
        n: "The honest summary is the last row: **the two perform comparably " +
          "in practice**, and the choice rarely matters. Both share the " +
          "defining limitation of that generation — **static** embeddings, one " +
          "vector per word regardless of context, so *bank* has a single " +
          "meaning. That is what contextual embeddings from ELMo and BERT " +
          "onward fixed. GloVe's lasting value is partly historical and partly " +
          "practical: pretrained vectors are small, load instantly, need no " +
          "GPU, and remain a perfectly reasonable choice for lightweight " +
          "similarity work where a transformer is disproportionate. The " +
          "famous `king − man + woman ≈ queen` analogy is also known to be " +
          "**overstated** — it works for some relation types and fails for " +
          "many, and the standard evaluation excludes the input words from the " +
          "answer, which flatters the result."
      },

      miss: [
        {
          w: "GloVe is substantially better than word2vec.",
          r: "Published comparisons are close and dataset-dependent. Both are " +
            "static embeddings with the same fundamental limitation. Choosing " +
            "between them is one of the lower-stakes decisions in an NLP " +
            "pipeline."
        },
        {
          w: "Word embeddings capture meaning.",
          r: "They capture **distributional similarity** — words appearing in " +
            "similar contexts get similar vectors. That conflates antonyms " +
            "(*hot* and *cold* appear in near-identical contexts and embed " +
            "closely), and it cannot distinguish word senses at all."
        },
        {
          w: "The vector arithmetic shows the model understands relationships.",
          r: "Analogy performance is **weaker than the famous examples " +
            "suggest** — it works for some relation types and fails for many, " +
            "and the standard evaluation protocol excludes the query words from " +
            "the candidate answers, which substantially inflates the numbers."
        },
        {
          w: "Static embeddings are obsolete.",
          r: "For **lightweight similarity, clustering and keyword expansion** " +
            "they remain practical: tiny, instant to load, no GPU, no inference " +
            "cost. Contextual embeddings are better and disproportionate for " +
            "many small tasks."
        }
      ],

      trade: {
        buys: [
          "Uses global corpus statistics rather than local windows only.",
          "Better on rare words than window-based methods.",
          "Small, fast, CPU-only.",
          "Pretrained vectors freely available for many languages."
        ],
        costs: [
          "Static — one vector per word regardless of context.",
          "No vector for unseen words.",
          "Co-occurrence matrix is memory-intensive to build.",
          "Cannot distinguish word senses.",
          "Encodes corpus biases directly."
        ],
        avoid: [
          "The task needs context sensitivity or sense disambiguation.",
          "You need out-of-vocabulary handling — use **FastText**.",
          "Accuracy matters and a transformer is affordable.",
          "The domain has vocabulary unlike the pretraining corpus."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
