/* ==========================================================================
   Depth pass 12 — vector retrieval and model quantisation.

   The retrieval terms all descend from one uncomfortable fact: exact nearest
   neighbour search in high dimensions is not meaningfully faster than
   scanning everything. Every index here buys speed by giving up the
   guarantee of finding the true nearest vector, and the interesting question
   is always what you give up and how you measure it.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "approximate-nearest-neighbour",

      why: {
        before: "Finding the nearest vector meant comparing against every " +
          "vector — a brute-force scan, exact and `O(n·d)`.",
        problem: "At a million 1536-dimensional vectors that is 1.5 billion " +
          "multiply-adds per query. Worse, the tree structures that make " +
          "low-dimensional search fast — k-d trees, ball trees — **stop working " +
          "above roughly 10–20 dimensions**. This is the *curse of " +
          "dimensionality*: in high dimensions almost all points are " +
          "approximately equidistant, so there is little structure left for a " +
          "tree to exploit and it degenerates to a full scan.",
        shift: "Give up exactness. Accept finding *almost* the nearest " +
          "neighbours — 95–99% of them — and the problem becomes tractable by " +
          "orders of magnitude. For search, recommendation and RAG, the tenth " +
          "result being genuinely eleventh is invisible to the user."
      },

      num: {
        t: "One million 768-dim vectors",
        h: ["Method", "Query time", "Recall@10", "Memory"],
        r: [
          ["Brute force", "~500ms", "100%", "3 GB"],
          ["IVFFlat (nprobe=10)", "~5ms", "~90%", "3 GB + index"],
          ["HNSW (ef=100)", "~1ms", "~98%", "**3 GB + ~1.5 GB**"],
          ["IVF-PQ", "~2ms", "~80%", "**~200 MB**"]
        ],
        n: "Two dials, always. **Recall against latency**: HNSW's `ef_search` " +
          "and IVF's `nprobe` both trade one directly for the other, and both " +
          "are tunable **at query time** without rebuilding. And **memory " +
          "against recall**: product quantisation compresses vectors ~16× and " +
          "costs perhaps 15 points of recall. Measure recall against a " +
          "brute-force ground truth on a sample — a vector database that " +
          "reports no recall number is hiding the only metric that matters."
      },

      miss: [
        {
          w: "Approximate means the results are unreliable.",
          r: "It means the *ranking* may differ slightly from exact. At 98% " +
            "recall, 98 of your top 100 are the true top 100 — and given that " +
            "the embedding itself is an approximation of meaning, that error is " +
            "usually far smaller than the error already present in the vectors."
        },
        {
          w: "A better index gives better search results.",
          r: "The index only affects **recall against the embedding's own " +
            "ranking**. If the embedding model does not capture your notion of " +
            "similarity, a perfect index returns perfectly wrong results faster. " +
            "Embedding quality dominates index quality in almost every real " +
            "system."
        },
        {
          w: "You should use cosine similarity for everything.",
          r: "Cosine and dot product are **identical for normalised vectors**, " +
            "and most modern embedding models output normalised vectors — so " +
            "the choice is often moot. What is not moot is *matching the metric " +
            "the model was trained with*: using cosine on a model trained with " +
            "dot product on unnormalised vectors silently degrades results."
        },
        {
          w: "Adding vectors to the index is cheap.",
          r: "It depends heavily on the index. HNSW supports incremental " +
            "insertion but **degrades with heavy deletion** — deleted nodes are " +
            "usually only tombstoned, and the graph's navigability decays until " +
            "you rebuild. IVF needs its centroids retrained if the distribution " +
            "shifts. Neither handles a fully dynamic corpus for free."
        }
      ],

      trade: {
        buys: [
          "Two to three orders of magnitude faster than brute force.",
          "Makes semantic search over millions of documents interactive.",
          "Recall against latency is tunable per query.",
          "Quantised variants cut memory dramatically."
        ],
        costs: [
          "Recall is below 100% and must be measured, not assumed.",
          "Index memory on top of the vectors themselves.",
          "Build time can be substantial for graph indexes.",
          "Deletions and updates degrade quality over time."
        ],
        avoid: [
          "Fewer than ~10,000 vectors — brute force is simpler and fast enough.",
          "You genuinely need exact results, as in some legal or compliance " +
            "search.",
          "Dimensionality is low (under ~10), where a k-d tree is exact and " +
            "fast.",
          "The corpus changes constantly and rebuilds are impractical — " +
            "consider a different architecture."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hnsw",

      why: {
        before: "Graph-based search connects each vector to its neighbours and " +
          "walks greedily toward the query. Effective locally, and it gets " +
          "trapped: from a distant start it takes many small hops, and it can " +
          "settle in a local minimum far from the true nearest.",
        problem: "You need both **long-range** moves to cross the space quickly " +
          "and **short-range** ones to refine at the end. A single graph gives " +
          "you one or the other depending on how densely you connect it.",
        shift: "Borrow the **skip list** idea and apply it to a graph. Build " +
          "several layers: the top is sparse with long edges for coarse " +
          "navigation, and each layer down is denser with shorter edges. Search " +
          "descends from the top, taking big jumps first and refining as it " +
          "goes."
      },

      num: {
        t: "The parameters that matter",
        h: ["Parameter", "Controls", "Typical", "Raising it"],
        r: [
          ["`M`", "edges per node", "16–48", "better recall, more memory"],
          ["`ef_construction`", "build-time search width", "100–500", "better graph, slower build"],
          ["`ef_search`", "query-time search width", "50–200", "**better recall, slower query**"]
        ],
        n: "`ef_search` is the one to know: it is tunable **per query with no " +
          "rebuild**, so you can serve a fast approximate result by default and " +
          "raise it for queries that matter. Memory overhead is roughly " +
          "`M × 2 × 4 bytes` per vector for the edge lists — at M=16 that is " +
          "about **128 bytes per vector on top of the vector itself**, which " +
          "for 768-dim fp32 vectors is a ~4% overhead but for compressed " +
          "vectors can dominate. Search is `O(log n)` in expectation, which is " +
          "why it scales so well."
      },

      miss: [
        {
          w: "HNSW is the best vector index, so always use it.",
          r: "Best on **recall-per-latency**, and it is memory-hungry and slow " +
            "to build. For a hundred million vectors the graph may not fit in " +
            "RAM, and **IVF-PQ** or DiskANN become the practical choice. HNSW " +
            "wins for millions, not necessarily for billions."
        },
        {
          w: "Deleting vectors from HNSW frees the memory.",
          r: "Most implementations only **tombstone** — the node stays in the " +
            "graph as a routing hop and is filtered from results. Memory is not " +
            "reclaimed, and heavy deletion progressively damages navigability. " +
            "A periodic rebuild is part of operating it."
        },
        {
          w: "Higher M always improves recall.",
          r: "It improves recall with diminishing returns and rising memory and " +
            "build time. Past roughly M=64 the gain is negligible for most " +
            "data. It also interacts with dimensionality — higher-dimensional " +
            "data benefits from larger M more than low-dimensional does."
        },
        {
          w: "You can filter results by metadata after searching.",
          r: "Post-filtering is the naive approach and it breaks: if your " +
            "filter is selective, the top-k unfiltered results may contain " +
            "**zero** matches and you get an empty response. Real systems need " +
            "**filtered search** support in the index, and doing it well inside " +
            "a graph index is genuinely hard."
        }
      ],

      trade: {
        buys: [
          "Best-in-class recall for a given latency budget.",
          "Logarithmic search complexity.",
          "Recall tunable at query time with no rebuild.",
          "Supports incremental insertion."
        ],
        costs: [
          "Significant memory for the graph on top of the vectors.",
          "Slow to build, especially at high `ef_construction`.",
          "Deletions degrade it; rebuilds are periodically required.",
          "Filtered search is awkward and implementation-dependent."
        ],
        avoid: [
          "Memory is the binding constraint — use **IVF-PQ** or a disk-based " +
            "index.",
          "The corpus is small enough for brute force.",
          "Write and delete rates are very high.",
          "You need exact results, which no ANN index provides."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reciprocal-rank-fusion",

      why: {
        before: "Combining a keyword search and a vector search meant " +
          "normalising their scores onto a common scale and taking a weighted " +
          "sum.",
        problem: "The scores are not comparable and cannot be made so. BM25 is " +
          "unbounded and corpus-dependent; cosine similarity sits in a narrow " +
          "band near 0.8; both distributions shift per query. Any normalisation " +
          "is a guess, and the weights need retuning whenever anything changes.",
        shift: "Throw the scores away and keep only the **ranks**. Sum " +
          "`1/(k + rank)` across the lists. Rank is comparable across any two " +
          "retrievers by construction, so there is nothing to calibrate — and " +
          "it turns out to be remarkably hard to beat."
      },

      num: {
        t: "Fusing two lists, k = 60",
        h: ["Document", "Rank in BM25", "Rank in vector", "RRF score"],
        r: [
          ["A", "1", "50", "0.0164 + 0.0091 = **0.0255**"],
          ["B", "3", "2", "0.0159 + 0.0161 = **0.0320**"],
          ["C", "2", "—", "0.0161 + 0 = 0.0161"]
        ],
        n: "Document B wins despite topping neither list — **agreement across " +
          "retrievers outweighs a single strong signal**, which is exactly the " +
          "behaviour you want from a fusion method. The constant **k=60** comes " +
          "from the original 2009 paper and is used almost universally without " +
          "tuning; it damps the influence of the very top ranks so one " +
          "retriever cannot dominate. The whole method has **no trained " +
          "parameters and no score normalisation**, which is why it survives " +
          "changes to either retriever."
      },

      miss: [
        {
          w: "RRF is a simple baseline you should replace with something " +
            "learned.",
          r: "It is a strong baseline that repeatedly matches or beats tuned " +
            "score-based fusion, and it was competitive with learned methods in " +
            "the original evaluation. Learned fusion needs training data and " +
            "retuning; RRF needs neither."
        },
        {
          w: "You should tune k for your corpus.",
          r: "Results are notably insensitive to it — anything from about 20 to " +
            "100 behaves similarly. Tuning it is usually effort spent for noise. " +
            "The default of 60 is the sensible choice."
        },
        {
          w: "RRF requires the retrievers to return the same documents.",
          r: "A document missing from one list simply contributes zero from " +
            "that list. This is a feature: a document found only by keyword " +
            "search still ranks, just lower than one found by both."
        },
        {
          w: "Fusing more retrievers is always better.",
          r: "Only if they are **complementary**. Fusing three vector " +
            "retrievers that agree adds nothing while triple-counting the same " +
            "bias. The classic pairing works precisely because BM25 and " +
            "embeddings fail differently — lexical catches exact terms, " +
            "acronyms and rare names; vectors catch paraphrase."
        }
      ],

      trade: {
        buys: [
          "Fuses any retrievers with no score normalisation.",
          "No training data and no parameters to fit.",
          "Robust to a retriever being swapped or retuned.",
          "Rewards cross-retriever agreement, which is a good prior."
        ],
        costs: [
          "Discards score magnitude, losing genuine confidence information.",
          "Cannot weight one retriever above another without modification.",
          "A document ranked #1 by a highly confident retriever can be beaten " +
            "by consensus."
        ],
        avoid: [
          "The scores are genuinely calibrated and comparable — then use them.",
          "One retriever is known to be far better; fusion will drag it down.",
          "You have abundant labelled relevance data — a learned reranker will " +
            "beat it.",
          "There is only one retriever, in which case there is nothing to fuse."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gptq",

      why: {
        before: "Quantising weights meant simple rounding — map each fp16 " +
          "weight to the nearest of 16 int4 levels. Fast and, at 4 bits, " +
          "destructive: perplexity rose sharply.",
        problem: "Round-to-nearest treats every weight independently, but " +
          "weights are not independent — they interact through the layer's " +
          "output. What matters is not the error in each weight but the error " +
          "in the **layer's output**, and naive rounding ignores that entirely.",
        shift: "Quantise **one weight at a time, and compensate**. After " +
          "rounding a weight, update the remaining unquantised weights in that " +
          "row to absorb the error it introduced — using second-order " +
          "information (the Hessian of the layer's reconstruction error) to " +
          "know how. The result is 4-bit weights whose layer outputs stay close " +
          "to the original."
      },

      num: {
        t: "Post-training quantisation methods",
        h: ["Method", "Needs", "Speed", "Quality at 4-bit"],
        r: [
          ["Round-to-nearest", "nothing", "instant", "poor"],
          ["**GPTQ**", "calibration set + Hessian", "~hours for 70B", "good"],
          ["**AWQ**", "activation statistics", "~minutes", "good, often better"],
          ["bitsandbytes NF4", "nothing", "instant", "good for training"]
        ],
        n: "GPTQ typically holds perplexity within **~0.1** of fp16 at 4 bits " +
          "while cutting memory **~4×** — a 70B model from 140GB to ~35GB, " +
          "which is the difference between four GPUs and one. The calibration " +
          "set matters more than people expect: a few hundred samples, and they " +
          "should **resemble your deployment data**, because the Hessian is " +
          "estimated from them. AWQ takes a different route — it identifies the " +
          "**~1% of salient weights** by looking at activation magnitudes and " +
          "scales to protect them — and is much faster to apply."
      },

      miss: [
        {
          w: "4-bit quantisation makes the model 4× faster.",
          r: "It makes it ~4× **smaller**, and at decode that translates into " +
            "roughly proportional speed-up because decode is " +
            "memory-bandwidth-bound. But many kernels **dequantise to fp16 to " +
            "compute**, so the arithmetic is not 4× cheaper and at large batch " +
            "sizes — where you become compute-bound — the gain shrinks " +
            "substantially."
        },
        {
          w: "GPTQ quantises activations too.",
          r: "It is **weight-only**. Activations stay in fp16. That is why the " +
            "memory saving is on the weights and why the KV cache is unaffected " +
            "— quantising the KV cache is a separate decision with its own " +
            "quality cost."
        },
        {
          w: "The calibration data does not matter much.",
          r: "It determines the Hessian estimate. Calibrating on generic web " +
            "text and deploying on code, or on a different language, measurably " +
            "degrades quality. Use a few hundred samples that look like your " +
            "actual traffic."
        },
        {
          w: "Quantisation degrades all capabilities equally.",
          r: "It does not. Reported evaluations show **multi-step reasoning, " +
            "maths and long-context recall degrade first**, while fluency and " +
            "simple factual recall survive well. A model can look fine on " +
            "casual chat and be measurably worse at the reasoning you deployed " +
            "it for — so evaluate on your task, not on perplexity alone."
        }
      ],

      trade: {
        buys: [
          "~4× smaller weights, so far larger models fit on one GPU.",
          "Near-proportional decode speed-up, since decode is bandwidth-bound.",
          "No retraining — applied to an existing checkpoint.",
          "Quality close to fp16 on most tasks."
        ],
        costs: [
          "Hours of calibration for a large model.",
          "Quality depends on calibration data matching deployment.",
          "Reasoning and long-context ability degrade before fluency does.",
          "Kernel support varies; not every serving stack handles every format."
        ],
        avoid: [
          "The model already fits and latency is acceptable.",
          "You need maximum quality on reasoning-heavy work.",
          "You are going to fine-tune — quantise **after**, or use QLoRA.",
          "Your serving stack lacks efficient kernels for the format, in which " +
            "case you save memory and lose speed."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "semantic-caching",

      why: {
        before: "LLM responses were cached by exact string match on the prompt, " +
          "like any other cache key.",
        problem: "Almost nothing matches exactly. *How do I reset my password?* " +
          "and *I forgot my password, what now?* are the same question with a " +
          "0% cache hit rate. Natural language has effectively infinite " +
          "surface forms for one intent, so an exact-match cache is nearly " +
          "useless.",
        shift: "Key the cache by **meaning**. Embed the query, search the cache " +
          "for a vector within a similarity threshold, and return that stored " +
          "answer. The cache lookup becomes a nearest-neighbour search rather " +
          "than a hash probe."
      },

      num: {
        t: "The threshold is the whole design",
        h: ["Threshold", "Hit rate", "Risk"],
        r: [
          ["0.99", "very low", "safe, barely useful"],
          ["0.95", "moderate", "occasional wrong answers"],
          ["0.85", "high", "**frequently wrong**"]
        ],
        n: "A cache hit that is *close enough* semantically can still be " +
          "**exactly wrong**: *What is the refund policy for Europe?* and " +
          "*...for Asia?* embed very closely and have different answers. " +
          "Negation is worse — *Is X supported?* and *Is X **not** supported?* " +
          "are near-identical in embedding space with opposite answers. This is " +
          "why semantic caching is safe for broad FAQ-style queries and " +
          "dangerous for anything parameterised. Savings are real when it fits: " +
          "a cache hit costs ~1ms and a few thousandths of a cent against " +
          "~1000ms and full token pricing."
      },

      miss: [
        {
          w: "Semantic caching is just caching with embeddings.",
          r: "Ordinary caching is **exact** — a hit is provably the right " +
            "answer. Semantic caching is **probabilistic**: a hit is a guess " +
            "that two questions mean the same thing, and that guess can be " +
            "wrong. It is a different risk category, not a different lookup " +
            "mechanism."
        },
        {
          w: "A high similarity score means the answers are interchangeable.",
          r: "Embeddings capture topical similarity, not logical equivalence. " +
            "Two questions about the same subject with different parameters — " +
            "a different region, date, user or negation — score very highly and " +
            "have different correct answers."
        },
        {
          w: "You can cache any LLM response.",
          r: "Only responses that do not depend on hidden context. Anything " +
            "personalised, time-sensitive, or dependent on conversation history " +
            "must not be shared across users. Caching per-user is safer and " +
            "collapses the hit rate, which often removes the point."
        },
        {
          w: "Tune the threshold until the hit rate looks good.",
          r: "Hit rate is the wrong optimisation target — you can always reach " +
            "100% by lowering the threshold to zero. Tune on **hit rate at an " +
            "acceptable error rate**, measured by sampling hits and checking " +
            "whether the cached answer was actually correct."
        }
      ],

      trade: {
        buys: [
          "Large cost and latency savings on repetitive query patterns.",
          "Absorbs traffic spikes on common questions.",
          "Reduces load on rate-limited model APIs."
        ],
        costs: [
          "Can return confidently wrong answers.",
          "Threshold tuning is a genuine risk decision, not a performance one.",
          "Embedding every query adds latency and cost to the miss path.",
          "Invalidation is harder — which cached entries does a policy change " +
            "affect?"
        ],
        avoid: [
          "Answers are personalised or depend on conversation state.",
          "Queries are parameterised, where near-identical wording means " +
            "different answers.",
          "Correctness matters more than cost — most transactional systems.",
          "Query diversity is high enough that hits will be rare anyway."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-cascade",

      why: {
        before: "One model served every request. Choosing it meant picking a " +
          "point on the cost-quality curve and applying it uniformly.",
        problem: "Requests are not uniform. *What is your return policy* and " +
          "*analyse this contract for liability exposure* both hit the same " +
          "expensive model, and the easy one is the overwhelming majority. You " +
          "are paying frontier prices for questions a small model answers " +
          "perfectly.",
        shift: "**Try cheap first.** Route every request to a small model, " +
          "judge whether its answer is good enough, and escalate only the ones " +
          "that are not. Cost tracks the *difficulty distribution* of your " +
          "traffic rather than its worst case."
      },

      num: {
        t: "Two-stage cascade economics",
        h: ["Escalation rate", "Cost vs large-only", "Avg latency"],
        r: [
          ["10%", "**~15%**", "slightly higher"],
          ["30%", "~38%", "higher"],
          ["50%", "~57%", "notably higher"],
          ["80%", "~85%", "**worse than large-only**"]
        ],
        n: "The break-even is the point to internalise: **past roughly 70–80% " +
          "escalation the cascade costs more than just calling the large " +
          "model**, because you pay for the small call *and* the large one. " +
          "Latency is also worse for escalated requests by exactly the small " +
          "model's time. The mechanism only pays when most traffic is genuinely " +
          "easy — which it usually is, following a long tail — and when the " +
          "**router is cheap and accurate**. A router that itself requires a " +
          "large model has eaten the saving."
      },

      miss: [
        {
          w: "A cascade always saves money.",
          r: "Only when the escalation rate is low. At high escalation you pay " +
            "twice for most requests. Measure the actual rate on real traffic " +
            "before committing — and note that it drifts as your traffic mix " +
            "changes."
        },
        {
          w: "The small model should decide whether to escalate.",
          r: "Self-assessed confidence from an LLM is poorly calibrated — " +
            "models are confidently wrong routinely. More reliable signals are " +
            "logprob-based uncertainty, a small trained classifier on the " +
            "query, or a verifier checking the answer against retrieved " +
            "evidence."
        },
        {
          w: "Cascading and routing are the same thing.",
          r: "**Routing** predicts the right model *before* generating and " +
            "calls exactly one. **Cascading** generates with the cheap one " +
            "first and escalates after. Routing is cheaper when the classifier " +
            "is good; cascading is more robust because it judges the actual " +
            "answer rather than a prediction about it."
        },
        {
          w: "It only makes sense with two models.",
          r: "Three-stage cascades are common — a tiny classifier, a mid-size " +
            "model, then a frontier model. Each stage adds latency for the " +
            "requests that traverse it, so more stages help only when the " +
            "difficulty distribution is genuinely spread across that many " +
            "levels."
        }
      ],

      trade: {
        buys: [
          "Large cost reduction when most traffic is easy.",
          "Lower average latency, since most requests finish at stage one.",
          "Graceful capacity management — escalate less under load.",
          "Frontier quality preserved for the requests that need it."
        ],
        costs: [
          "Worse latency for escalated requests.",
          "Costs more than a single model above the break-even escalation rate.",
          "Two or more models to deploy, monitor and evaluate.",
          "The quality judge is itself a hard component to get right."
        ],
        avoid: [
          "Requests are uniformly difficult — there is nothing to route.",
          "Latency is critical and any escalation delay is unacceptable.",
          "You have no reliable way to judge answer quality automatically.",
          "Volume is too low for the saving to justify the complexity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tensor-parallelism",

      why: {
        before: "A model too large for one GPU was split by **layers** — " +
          "pipeline parallelism — putting the first ten layers on GPU 0, the " +
          "next ten on GPU 1, and so on.",
        problem: "That helps only if each individual layer fits. In very large " +
          "models a **single** weight matrix can exceed one GPU's memory. " +
          "Pipeline parallelism also introduces bubbles: GPU 1 idles while GPU " +
          "0 processes the first micro-batch.",
        shift: "Split the matrices themselves. A matrix multiply can be " +
          "partitioned by columns or by rows across GPUs, each computing a " +
          "slice of the output, with a collective operation to reassemble. One " +
          "layer is now computed by several GPUs **simultaneously**."
      },

      num: {
        t: "Parallelism strategies compared",
        h: ["Strategy", "Splits", "Communication per layer", "Needs"],
        r: [
          ["Data", "the batch", "gradients, once per step", "any interconnect"],
          ["Pipeline", "layers", "activations at boundaries", "moderate"],
          ["**Tensor**", "**weight matrices**", "**2 all-reduces per block**", "NVLink"],
          ["Sequence", "the sequence dimension", "varies", "long context"]
        ],
        n: "Tensor parallelism communicates **twice per transformer block** — " +
          "once after attention, once after the MLP — which at 80 layers is 160 " +
          "all-reduces per forward pass. That is why it is **confined within a " +
          "node**, over NVLink at ~600 GB/s, and why crossing to another node " +
          "over InfiniBand kills it. The standard large-scale recipe is **3D " +
          "parallelism**: tensor parallel *inside* a node, pipeline parallel " +
          "*across* nodes, data parallel *across* replicas. Megatron-LM's " +
          "column-then-row split is the clever part — splitting the first " +
          "matrix by columns and the second by rows means only one " +
          "communication is needed per pair, not two."
      },

      miss: [
        {
          w: "Tensor parallelism speeds up training like data parallelism does.",
          r: "It exists to make a model **fit**, not to make it faster. It adds " +
            "substantial communication and generally *reduces* throughput per " +
            "GPU. You use it when the alternative is not being able to train " +
            "the model at all."
        },
        {
          w: "You can use it across machines.",
          r: "You can, and it usually performs terribly. The all-reduce " +
            "frequency assumes NVLink-class bandwidth. Across nodes on " +
            "Ethernet, communication dominates entirely — which is why the " +
            "conventional degree is 8, the number of GPUs in a node."
        },
        {
          w: "It splits the model evenly, so each GPU does 1/N of the work.",
          r: "Each GPU does 1/N of the *matrix multiplication*, and they all " +
            "process the **full batch** and hold the full activations. Memory " +
            "for activations is not reduced by tensor parallelism, only " +
            "parameter memory — which is why it is combined with activation " +
            "checkpointing and sequence parallelism."
        },
        {
          w: "It is only needed for training.",
          r: "It is heavily used for **inference** of large models. A 405B " +
            "model in fp16 needs ~810GB and cannot fit on any single GPU, so " +
            "serving it requires tensor parallelism across a node — and there " +
            "the per-token all-reduce latency becomes a direct component of " +
            "generation speed."
        }
      ],

      trade: {
        buys: [
          "Enables models whose individual layers exceed one GPU.",
          "No pipeline bubbles — all GPUs work on the same batch " +
            "simultaneously.",
          "Reduces per-GPU parameter and optimiser memory.",
          "Composes with pipeline and data parallelism."
        ],
        costs: [
          "Very high communication frequency — needs NVLink.",
          "Does not scale beyond a node in practice.",
          "Activation memory is not reduced.",
          "Substantially more complex implementation."
        ],
        avoid: [
          "The model fits with **FSDP/ZeRO**, which is simpler and " +
            "communicates less.",
          "You only have Ethernet or PCIe between devices.",
          "You need to scale beyond one node — combine with pipeline " +
            "parallelism instead.",
          "You are fine-tuning with adapters, where memory is not the " +
            "constraint."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "emergent-ability",

      why: {
        before: "Model capability was assumed to improve smoothly with scale, " +
          "as loss does — a bigger model is a bit better at everything.",
        problem: "Some abilities did not behave that way. Multi-step " +
          "arithmetic, chain-of-thought reasoning and instruction-following " +
          "appeared to sit at near-zero across many model sizes and then jump " +
          "sharply past a threshold. If capabilities appear unpredictably, " +
          "safety evaluation of a model you have not yet trained becomes " +
          "impossible.",
        shift: "The 2022 claim was that these are genuinely **emergent** — " +
          "qualitatively new, not present in smaller models. The 2023 rebuttal " +
          "(Schaeffer et al.) argued the sharpness is largely an artefact of " +
          "**discontinuous metrics**, and that is now the more widely held view."
      },

      num: {
        t: "The same ability, measured two ways",
        h: ["Metric", "Curve shape", "Why"],
        r: [
          ["Exact match", "**flat, then a jump**", "all-or-nothing per answer"],
          ["Token edit distance", "smooth improvement", "partial credit"],
          ["Per-token accuracy", "smooth improvement", "continuous"]
        ],
        n: "Consider 5-digit addition scored by exact match. If per-digit " +
          "accuracy rises smoothly from 90% to 99%, exact-match accuracy — " +
          "which needs *all five digits* right — goes from `0.9⁵ = 59%` to " +
          "`0.99⁵ = 95%`. The underlying improvement is smooth; the metric " +
          "makes it look like a cliff. **Change the metric and the emergence " +
          "largely disappears.** This does not settle the question entirely — " +
          "some capabilities still look sharp under continuous metrics — but it " +
          "means *emergent* should be treated as a claim about measurement " +
          "until shown otherwise."
      },

      miss: [
        {
          w: "Emergent abilities prove models develop genuinely new capabilities " +
            "at scale.",
          r: "This is the contested claim. The mirage argument shows the " +
            "sharpness is often produced by all-or-nothing metrics over " +
            "smoothly improving underlying performance. Some cases resist that " +
            "explanation; most do not."
        },
        {
          w: "Emergence means capabilities appear unpredictably.",
          r: "That was the alarming implication, and it is weakened by the " +
            "metric explanation. Under continuous metrics much of the " +
            "improvement is in fact predictable from smaller models — which is " +
            "the entire basis of scaling-law-driven development."
        },
        {
          w: "In-context learning is an emergent ability.",
          r: "It is the standard example and it also shows smooth improvement " +
            "under continuous measurement. What jumps is the point at which it " +
            "becomes *reliable enough to be useful*, which is a threshold in " +
            "utility rather than in the underlying capability."
        },
        {
          w: "The debate is settled.",
          r: "It is not. The mirage paper is influential and does not explain " +
            "every observation — some capabilities appear sharp even under " +
            "smooth metrics, and *why* remains open. The right position is that " +
            "the burden of proof is now on claims of emergence, not that " +
            "emergence has been disproved."
        }
      ],

      trade: {
        buys: [
          "Focused attention on how capability is measured, not just achieved.",
          "Motivated serious work on predicting capabilities before training.",
          "A concrete lesson: discontinuous metrics manufacture " +
            "discontinuities.",
          "Directly relevant to pre-deployment safety evaluation."
        ],
        costs: [
          "The term is used loosely and often means only *we were surprised*.",
          "Fuels both hype and alarm beyond what the evidence supports.",
          "Metric artefacts are easy to mistake for real phenomena.",
          "Hard to study — training many model scales is enormously expensive."
        ],
        avoid: [
          "You are measuring with exact match — check a continuous metric " +
            "before calling anything emergent.",
          "You need to predict a capability; scaling laws on smooth metrics " +
            "are more reliable.",
          "The claim is being used to argue capabilities are unknowable — that " +
            "overstates the current evidence."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
