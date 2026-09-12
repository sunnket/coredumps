/* ==========================================================================
   Depth pass 22 — the last of the advanced LLM terms: attention variants,
   compression, sampling and agent memory.

   The attention variants here (MQA, MLA) and the serving techniques
   (prefix caching, chunked prefill) are all attacking the same constraint
   from different angles: the KV cache is what limits how many requests fit
   on a GPU, so shrink it, share it, or schedule around it.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "multi-head-latent-attention",

      why: {
        before: "**GQA** shrank the KV cache by having several query heads " +
          "share one key/value head — a 4–8× reduction with quality " +
          "essentially matching full attention.",
        problem: "That is a *structural* saving: you are simply storing fewer " +
          "heads. It does not exploit the fact that the keys and values " +
          "themselves are **highly redundant** — much of what is stored is " +
          "predictable from the rest.",
        shift: "Compress instead of dropping. Project keys and values down " +
          "into a **low-rank latent vector**, cache only that, and decompress " +
          "on the fly during attention. The compression matrices are learned, " +
          "so the model decides what to keep. DeepSeek-V2 introduced it and " +
          "V3 relies on it."
      },

      num: {
        t: "KV cache per token, by attention variant",
        h: ["Variant", "Cached per token", "Relative to MHA", "Quality"],
        r: [
          ["MHA", "`2 × layers × heads × d_head`", "1×", "baseline"],
          ["GQA-8", "8 KV heads", "~1/4", "≈ MHA"],
          ["MQA", "1 KV head", "~1/32", "measurably worse"],
          ["**MLA**", "**one latent vector**", "**~1/10 to 1/20**", "**≥ MHA**"]
        ],
        n: "The remarkable claim in the DeepSeek-V2 paper is the last cell: " +
          "MLA reportedly matches **or slightly exceeds** full MHA quality " +
          "while using a fraction of the cache — where MQA clearly trades " +
          "quality away. The intuition is that the low-rank projection acts as " +
          "a mild regulariser rather than a lossy shortcut. There is a real " +
          "complication though: **RoPE does not commute with the " +
          "compression**, because rotating a compressed representation is not " +
          "the same as compressing a rotated one. DeepSeek's answer is a " +
          "**decoupled** design where part of the head carries RoPE " +
          "uncompressed and part carries the compressed content — which works " +
          "and makes the architecture noticeably more intricate than GQA."
      },

      miss: [
        {
          w: "MLA is just aggressive GQA.",
          r: "GQA **shares** heads — it stores fewer complete key/value " +
            "vectors. MLA **compresses** — it stores a learned low-rank " +
            "projection that is decompressed at use. One is structural " +
            "sharing, the other is learned dimensionality reduction, and they " +
            "could in principle be combined."
        },
        {
          w: "Compression must lose information, so quality must drop.",
          r: "Keys and values are empirically low-rank — much of their content " +
            "is redundant. The learned projection keeps what matters, and the " +
            "reported results show quality at or above MHA. It is closer to " +
            "PCA than to truncation."
        },
        {
          w: "You can apply MLA to an existing model to shrink its cache.",
          r: "It is an **architectural** choice fixed at training time. The " +
            "compression matrices are learned parameters. There is no " +
            "post-training conversion, unlike quantising a KV cache which is a " +
            "serving-time decision."
        },
        {
          w: "The extra compute for decompression cancels the benefit.",
          r: "Decode is **memory-bandwidth bound**, not compute bound, so " +
            "trading a small amount of arithmetic for a large reduction in " +
            "bytes read is exactly the right direction. The decompression is " +
            "nearly free in wall-clock terms."
        }
      ],

      trade: {
        buys: [
          "10–20× smaller KV cache than MHA.",
          "Quality reportedly matching or exceeding full attention.",
          "Much larger batch sizes on the same hardware.",
          "Long contexts become affordable at serving time."
        ],
        costs: [
          "Substantially more complex than GQA to implement.",
          "The RoPE interaction requires a decoupled design.",
          "Must be chosen at training time.",
          "Less widely supported in serving frameworks than GQA."
        ],
        avoid: [
          "You want a simple, well-supported option — **GQA** is the safe " +
            "default.",
          "You are serving an existing checkpoint; this cannot be retrofitted.",
          "Your serving stack lacks kernels for it.",
          "KV cache is not your binding constraint."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prefix-caching",

      why: {
        before: "Every request ran prefill over its **entire** prompt, " +
          "computing keys and values for every token from scratch.",
        problem: "In production, prompts are largely identical. A chat " +
          "application sends the same system prompt on every request; a RAG " +
          "system sends the same instructions and often the same retrieved " +
          "documents; an agent loop resends the whole conversation each turn. " +
          "You are recomputing the same KV state thousands of times a second.",
        shift: "Cache the KV state of the **shared prefix** and reuse it. " +
          "Because attention is causal, a prefix's keys and values do not " +
          "depend on anything after it — so if two requests start with the " +
          "same tokens, that portion of the cache is provably identical."
      },

      num: {
        t: "A 2,000-token system prompt, 50-token question",
        h: ["", "Without prefix cache", "With"],
        r: [
          ["Tokens prefilled", "2,050", "**50**"],
          ["Time to first token", "~500ms", "**~15ms**"],
          ["Input cost", "full", "**~10% of cached portion**"],
          ["Cache hit requires", "—", "**exact prefix match**"]
        ],
        n: "The **exact prefix match** requirement drives a real design " +
          "consequence: put everything static at the **front** of the prompt " +
          "and everything variable at the back. A single differing character " +
          "early on — a timestamp, a user name, a randomised greeting — " +
          "invalidates the entire cache from that point. Teams routinely lose " +
          "the benefit by injecting `Current time: 14:32:07` into the system " +
          "prompt. Anthropic and OpenAI both price cached input tokens at " +
          "roughly a tenth of normal, and vLLM's **automatic prefix caching** " +
          "does this at the block level with no application changes. Agent " +
          "loops benefit most, since each turn re-sends everything before it."
      },

      miss: [
        {
          w: "Prefix caching caches the model's responses.",
          r: "It caches **KV state**, not outputs. The model still generates " +
            "fresh tokens every time — you have skipped recomputing the " +
            "attention state for the prompt, not skipped inference. Caching " +
            "responses is **semantic caching**, a different and riskier thing."
        },
        {
          w: "It works on any repeated content in the prompt.",
          r: "Only on a **contiguous prefix from position zero**. Shared text " +
            "in the middle of two otherwise different prompts cannot be reused, " +
            "because every token's KV depends on everything before it. Order " +
            "matters absolutely."
        },
        {
          w: "The cache persists indefinitely.",
          r: "GPU memory is finite and hosted APIs typically expire entries in " +
            "**minutes** — Anthropic's default is around five. A low-traffic " +
            "endpoint may never hit the cache. It rewards steady traffic on " +
            "consistent prompts."
        },
        {
          w: "You should cache as much of the prompt as possible.",
          r: "Cached blocks occupy GPU memory that would otherwise hold KV " +
            "cache for **concurrent requests**. Caching an enormous prefix used " +
            "by one user reduces overall throughput. The win comes from prefixes " +
            "shared across **many** requests."
        }
      ],

      trade: {
        buys: [
          "Dramatically lower time-to-first-token on repeated prefixes.",
          "Roughly 90% cost reduction on the cached portion.",
          "Large throughput gains for agent loops and chat.",
          "Automatic in modern serving engines — no code change."
        ],
        costs: [
          "Requires exact prefix matching, constraining prompt design.",
          "Cached blocks consume memory that competes with concurrency.",
          "Cache entries expire; low traffic means low hit rates.",
          "Adds a cache-management layer to the serving engine."
        ],
        avoid: [
          "Prompts are entirely unique per request.",
          "Traffic is too sparse for entries to survive.",
          "The prompt is short enough that prefill is already cheap.",
          "You cannot restructure prompts to put static content first."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "chunked-prefill",

      why: {
        before: "A serving engine ran prefill and decode as separate " +
          "iterations: process a whole prompt in one step, then generate " +
          "tokens one step at a time.",
        problem: "A long prompt's prefill **monopolises the GPU**. While a " +
          "32,000-token prompt is being processed, every other user's " +
          "generation stalls — their tokens simply stop arriving for hundreds " +
          "of milliseconds. One long request degrades everyone's experience, " +
          "and the effect is highly visible as stuttering output.",
        shift: "Split the prefill into **chunks** and interleave them with " +
          "decode steps for other requests. Each iteration does a slice of " +
          "prefill plus a batch of decode, so nobody is starved and the GPU " +
          "stays busy with a mix that uses both its compute and its bandwidth."
      },

      num: {
        t: "Effect on a mixed workload",
        h: ["Metric", "Without chunking", "With"],
        r: [
          ["Decode stall during long prefill", "**hundreds of ms**", "~one chunk"],
          ["Inter-token latency variance", "**high**", "low"],
          ["Time to first token (long prompt)", "lower", "slightly higher"],
          ["GPU utilisation", "swings", "**steady**"]
        ],
        n: "The trade is explicit and worth naming: chunked prefill **slightly " +
          "worsens time-to-first-token for the long request** in exchange for " +
          "**much steadier inter-token latency for everyone else**. That is " +
          "almost always the right trade in a multi-tenant service, because " +
          "users notice stuttering output more than a marginally slower start. " +
          "It also improves utilisation for a structural reason: prefill is " +
          "**compute-bound** and decode is **memory-bandwidth-bound**, so " +
          "mixing them in one batch uses parts of the GPU that would otherwise " +
          "idle. Chunk size is the tuning knob — too small and per-iteration " +
          "overhead dominates, too large and you are back to stalling."
      },

      miss: [
        {
          w: "Chunked prefill makes prefill faster.",
          r: "It makes prefill **marginally slower** for that request — you " +
            "add per-chunk overhead. What it buys is scheduling fairness and " +
            "steady latency for concurrent decode. It is a scheduling " +
            "improvement, not a throughput one for the individual request."
        },
        {
          w: "It is the same as continuous batching.",
          r: "**Continuous batching** decides which requests are in the batch, " +
            "re-evaluated every iteration. **Chunked prefill** decides how a " +
            "single long prefill is split across iterations. They are " +
            "complementary and modern engines do both."
        },
        {
          w: "Smaller chunks are always better for fairness.",
          r: "Each chunk carries fixed overhead — kernel launches, scheduling. " +
            "Very small chunks reduce throughput measurably. The default in " +
            "vLLM is a token budget per iteration that balances the two, and " +
            "it is worth tuning against your prompt length distribution."
        },
        {
          w: "You need it only if you serve very long prompts.",
          r: "The threshold is lower than expected — even a few thousand tokens " +
            "produces a visible decode stall at high concurrency. If users " +
            "report stuttering token output under load, this is a likely cause."
        }
      ],

      trade: {
        buys: [
          "Eliminates decode stalls caused by long prefills.",
          "Much lower inter-token latency variance.",
          "Better GPU utilisation by mixing compute- and bandwidth-bound work.",
          "Fairer scheduling across tenants."
        ],
        costs: [
          "Slightly higher time-to-first-token for long prompts.",
          "Per-chunk scheduling overhead.",
          "Chunk size is another parameter to tune.",
          "More complex scheduler."
        ],
        avoid: [
          "You serve one request at a time — there is nothing to interleave.",
          "All prompts are short.",
          "Time-to-first-token on long prompts is the only metric you are " +
            "judged on.",
          "You are not writing the serving engine — this is a property of " +
            "vLLM, TGI or SGLang."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "min-p-sampling",

      why: {
        before: "Sampling used **top-k** (keep the k most likely tokens) or " +
          "**top-p / nucleus** (keep tokens until cumulative probability " +
          "reaches p). Both cut the distribution at a fixed point.",
        problem: "A fixed cut ignores how **confident** the model is. When one " +
          "token has probability 0.95 — the model is certain — top-p at 0.9 " +
          "still admits several near-zero alternatives, letting nonsense " +
          "through. When the distribution is flat and many tokens are " +
          "genuinely plausible, the same threshold truncates valid options.",
        shift: "Make the threshold **relative to the top token**. Keep tokens " +
          "whose probability is at least `p × P(top token)`. A confident model " +
          "produces a narrow set automatically; an uncertain one produces a " +
          "wide one. The filter adapts to the distribution instead of imposing " +
          "a fixed shape on it."
      },

      num: {
        t: "The same p, two different distributions",
        h: ["Distribution", "top-p = 0.9 keeps", "min-p = 0.1 keeps"],
        r: [
          ["Confident: `[0.95, 0.02, 0.01, …]`", "**several junk tokens**", "**1 token**"],
          ["Uncertain: `[0.2, 0.18, 0.15, …]`", "~5 tokens", "**all above 0.02**"]
        ],
        n: "This is why min-p is popular for **creative generation at high " +
          "temperature**: it lets you raise temperature for variety without " +
          "the usual degeneration, because the relative floor still excludes " +
          "genuinely implausible tokens. Typical values are **0.05–0.1**. The " +
          "order of operations matters and is a common source of confusion — " +
          "most implementations apply min-p **after** temperature scaling, so " +
          "the two interact. It is not a universal replacement: for factual or " +
          "structured output you usually want **low temperature or greedy " +
          "decoding**, where sampling strategy barely matters."
      },

      miss: [
        {
          w: "min-p is strictly better than top-p.",
          r: "It is better at **adapting to model confidence**, which matters " +
            "most at high temperature and for creative work. For low-temperature " +
            "factual generation the difference is negligible, and top-p remains " +
            "the more widely supported default."
        },
        {
          w: "A higher min-p value means more diverse output.",
          r: "The opposite. min-p is a **floor** — raising it excludes more " +
            "tokens and narrows the output. `min_p = 0.1` keeps tokens above " +
            "10% of the top token's probability; `min_p = 0.3` is stricter. " +
            "This inverts the intuition from top-p."
        },
        {
          w: "You should combine min-p with top-p and top-k for best results.",
          r: "Stacking filters makes behaviour hard to reason about and they " +
            "often conflict. The usual advice is **min-p alone**, with " +
            "temperature. If you are also setting top-p and top-k, you " +
            "probably cannot say what the effective distribution is."
        },
        {
          w: "Sampling strategy is a minor detail.",
          r: "It is the difference between coherent and degenerate output at " +
            "high temperature, and it is one of the cheapest quality " +
            "improvements available — no retraining, no extra compute. It is " +
            "under-tuned in most deployments."
        }
      ],

      trade: {
        buys: [
          "Adapts to model confidence automatically.",
          "Allows higher temperature without degeneration.",
          "One parameter instead of tuning top-k and top-p together.",
          "Notably better for creative generation."
        ],
        costs: [
          "Less widely supported than top-p across APIs.",
          "The parameter's direction is counterintuitive.",
          "Interacts with temperature in ways that need care.",
          "Little benefit for low-temperature factual work."
        ],
        avoid: [
          "You need deterministic output — use greedy decoding.",
          "The API does not support it.",
          "Generation is structured (JSON, code) where constrained decoding " +
            "matters more.",
          "You are already at low temperature, where it changes little."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pruning",

      why: {
        before: "Making a model smaller meant training a smaller model, or " +
          "quantising the weights you had.",
        problem: "Neural networks are **massively over-parameterised**. Many " +
          "weights contribute almost nothing to the output — they are near " +
          "zero, or redundant with others. Training a smaller model from " +
          "scratch loses the benefit of the large model's training; " +
          "quantisation reduces precision but keeps every weight.",
        shift: "Remove the weights that do not matter. Rank them by some " +
          "importance criterion — magnitude, gradient sensitivity, second-order " +
          "effect — delete the least important, and fine-tune to recover. The " +
          "question that decides everything is **what shape** you remove."
      },

      num: {
        t: "Structured against unstructured pruning",
        h: ["Type", "Removes", "Actual speed-up?", "Sparsity achievable"],
        r: [
          ["Unstructured", "individual weights", "**only with special HW**", "80–95%"],
          ["**2:4 semi-structured**", "2 of every 4 weights", "**~2× on Ampere+**", "50%"],
          ["Structured", "whole neurons / heads / layers", "**yes, anywhere**", "20–50%"]
        ],
        n: "The middle column is the trap that catches almost everyone. " +
          "**Unstructured pruning to 90% sparsity gives no speed-up at all on " +
          "standard hardware** — the weight is zero, and a dense matrix " +
          "multiply still multiplies by it. You have saved storage (if you use " +
          "a sparse format) and not time. NVIDIA's **2:4 pattern** is the " +
          "compromise that works: exactly two of every four weights are zero, " +
          "which Ampere and later can exploit for roughly 2× throughput. " +
          "**Structured** pruning removes whole units so the matrix genuinely " +
          "shrinks and any hardware benefits — which is why it is what people " +
          "actually deploy, despite achieving lower sparsity."
      },

      miss: [
        {
          w: "Pruning 90% of weights makes the model 10× faster.",
          r: "Only with sparse-aware hardware or kernels. On ordinary GPUs a " +
            "zeroed weight costs the same as any other — the multiply still " +
            "happens. Unstructured sparsity is a **storage** win by default, " +
            "not a latency one."
        },
        {
          w: "Magnitude pruning is naive; better criteria are much better.",
          r: "Magnitude is a remarkably strong baseline and repeatedly " +
            "competitive with far more sophisticated criteria. **SparseGPT** " +
            "and **Wanda** improve on it for LLMs specifically, and the gap is " +
            "smaller than the complexity difference suggests."
        },
        {
          w: "You prune once after training.",
          r: "**Iterative** pruning — prune a fraction, fine-tune to recover, " +
            "repeat — reaches far higher sparsity than a single pass at the " +
            "same quality. The lottery ticket hypothesis work made this " +
            "explicit. One-shot pruning is quicker and reaches less."
        },
        {
          w: "Pruning and quantisation are alternatives.",
          r: "They compose. A pruned model can also be quantised, and the " +
            "savings multiply. In practice **quantisation is usually tried " +
            "first** because it is easier, needs no retraining, and delivers " +
            "reliable speed-ups on real hardware."
        }
      ],

      trade: {
        buys: [
          "Smaller models retaining most accuracy.",
          "Structured pruning gives genuine speed-ups on any hardware.",
          "Composes with quantisation and distillation.",
          "Can reveal which parts of a model matter."
        ],
        costs: [
          "Unstructured sparsity needs special hardware to pay off.",
          "Usually requires fine-tuning to recover accuracy.",
          "Iterative pruning is a long process.",
          "Structured pruning reaches lower sparsity."
        ],
        avoid: [
          "**Quantisation** would meet the target — it is simpler and needs no " +
            "retraining.",
          "You have no hardware support for sparsity and cannot do structured " +
            "pruning.",
          "You cannot fine-tune afterwards.",
          "A smaller pretrained model already exists — use it rather than " +
            "pruning a large one down."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grpo",

      why: {
        before: "**PPO** needs a **value model** — a second network estimating " +
          "the expected return from each state — to compute advantages. That " +
          "is a whole additional model to hold in memory and train.",
        problem: "The value model roughly doubles memory beyond the policy and " +
          "reference, is itself hard to train stably, and for language tasks " +
          "estimating the value of a partial sequence is genuinely difficult. " +
          "It is a large cost for what is essentially a variance-reduction " +
          "baseline.",
        shift: "Get the baseline from the data instead. Sample a **group** of " +
          "responses to the same prompt, score them all, and use the group's " +
          "**mean score as the baseline**. Advantage is a response's score " +
          "relative to its peers. The value model disappears entirely."
      },

      num: {
        t: "Models in memory during training",
        h: ["Method", "Policy", "Reference", "Reward", "Value", "Total"],
        r: [
          ["PPO", "✓", "✓", "✓", "**✓**", "**4**"],
          ["**GRPO**", "✓", "✓", "✓ (or a verifier)", "—", "**3**"],
          ["DPO", "✓", "✓", "—", "—", "2"]
        ],
        n: "GRPO is what DeepSeek used for **R1's reasoning training**, and " +
          "that is the clue to where it fits: it pairs naturally with " +
          "**verifiable rewards**. If a maths answer can be checked or code can " +
          "be run against tests, you do not need a learned reward model at all " +
          "— the verifier scores the group directly. Sampling a group of " +
          "**4–16** responses per prompt costs more generation per step than " +
          "PPO, which is the honest trade: you have swapped a value model's " +
          "memory for extra sampling compute. Note also that the group " +
          "baseline is **only meaningful within a prompt**, so all comparisons " +
          "are relative — which is why it suits tasks with a clear per-prompt " +
          "quality signal."
      },

      miss: [
        {
          w: "GRPO is just PPO without the value model.",
          r: "Removing the value model requires **replacing what it did** — " +
            "providing a baseline to reduce gradient variance. GRPO's " +
            "contribution is that the group mean serves that role, which only " +
            "works because you sample several responses per prompt. It is a " +
            "different estimator, not a deletion."
        },
        {
          w: "It is cheaper than PPO.",
          r: "Cheaper in **memory**, more expensive in **generation** — you " +
            "produce 4–16 responses per prompt instead of one. Whether that is " +
            "a net win depends on whether memory or compute is your " +
            "constraint."
        },
        {
          w: "You need a learned reward model.",
          r: "Its strength is that you often do not. With **verifiable " +
            "rewards** — unit tests, a maths checker, a format validator — the " +
            "verifier scores the group and there is no reward model to train or " +
            "to be hacked. This is the configuration that produced R1."
        },
        {
          w: "A larger group always gives a better baseline.",
          r: "Variance falls with group size and generation cost rises " +
            "linearly. Returns flatten quickly; typical values are 4–16. Beyond " +
            "that you are paying substantially more compute for a marginally " +
            "better baseline."
        }
      ],

      trade: {
        buys: [
          "Removes the value model — a quarter less memory than PPO.",
          "Works directly with verifiable rewards, avoiding reward models.",
          "Simpler to implement and tune than PPO.",
          "Demonstrated at scale on reasoning tasks."
        ],
        costs: [
          "Several generations per prompt — more inference compute.",
          "The baseline is only meaningful within a prompt group.",
          "Newer and less studied than PPO or DPO.",
          "Needs a scoring function of some kind."
        ],
        avoid: [
          "You have pairwise preference data and no verifier — **DPO** is " +
            "simpler.",
          "Generation is expensive and memory is plentiful; PPO may cost less " +
            "overall.",
          "There is no way to score responses automatically.",
          "The task has no clear per-prompt quality signal to compare against."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "multi-hop",

      why: {
        before: "RAG retrieved once and generated. Embed the question, fetch " +
          "the top chunks, answer from them.",
        problem: "Some questions **cannot** be answered from any single " +
          "retrieval, because the information needed to find the second piece " +
          "is contained in the first. *Who directed the film that won Best " +
          "Picture the year Casablanca was released?* — you cannot search for " +
          "the director until you know the film, and you cannot know the film " +
          "without a first lookup. One retrieval structurally cannot reach it.",
        shift: "**Retrieve, reason, retrieve again.** Use what the first hop " +
          "returned to construct the next query, iterating until the question " +
          "can be answered. Each hop's output becomes the next hop's input."
      },

      num: {
        t: "Error compounding across hops",
        h: ["Hops", "Per-hop accuracy 90%", "Per-hop 80%"],
        r: [
          ["1", "90%", "80%"],
          ["2", "**81%**", "**64%**"],
          ["3", "73%", "**51%**"],
          ["4", "66%", "41%"]
        ],
        n: "This multiplication is the defining problem: **errors compound**, " +
          "and a wrong first hop guarantees a wrong answer no matter how good " +
          "the rest is. It is why practical systems **cap hops at two or " +
          "three**, and why verification between hops matters more than " +
          "improving any single hop. Latency compounds identically — each hop " +
          "is a retrieval plus a generation, so a three-hop query can take " +
          "several seconds. The other failure mode is **not knowing when to " +
          "stop**: without a clear termination condition an agent either halts " +
          "early with insufficient information or loops, re-retrieving " +
          "variations of the same query."
      },

      miss: [
        {
          w: "More hops means the system can answer harder questions.",
          r: "More hops means **compounding error and latency**. Accuracy " +
            "typically *falls* past two or three hops. The engineering goal is " +
            "to answer in the fewest hops possible, not to support many."
        },
        {
          w: "Multi-hop is the same as agentic RAG.",
          r: "Multi-hop is specifically **iterative retrieval where each query " +
            "depends on the last**. Agentic RAG is broader — the agent decides " +
            "*whether* to retrieve, from which source, and whether the result " +
            "is sufficient. Multi-hop is one behaviour an agentic system might " +
            "exhibit."
        },
        {
          w: "You can detect multi-hop questions and route them.",
          r: "Classification helps and is unreliable — many questions look " +
            "single-hop and are not, particularly when the corpus splits " +
            "information across documents in ways the asker does not know " +
            "about. Systems generally attempt retrieval and decide afterwards " +
            "whether it sufficed."
        },
        {
          w: "Better retrieval removes the need for multiple hops.",
          r: "It reduces it — **contextual retrieval** and larger chunks can " +
            "put related facts in one place. It cannot remove genuine " +
            "compositional questions where the second entity is unknown until " +
            "the first is resolved."
        }
      ],

      trade: {
        buys: [
          "Answers compositional questions single retrieval cannot reach.",
          "Follows chains of reasoning across documents.",
          "Intermediate steps are inspectable and explain the answer.",
          "Handles questions the user could not have phrased as one query."
        ],
        costs: [
          "Errors compound multiplicatively across hops.",
          "Latency multiplies — each hop is retrieval plus generation.",
          "Needs a termination condition that is easy to get wrong.",
          "Substantially more complex to build and debug."
        ],
        avoid: [
          "Questions are answerable from one retrieval — the common case.",
          "Latency is tight.",
          "Per-hop retrieval accuracy is low; compounding will destroy it.",
          "Improving chunking or adding a knowledge graph would put the facts " +
            "together in the first place."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dspy",

      why: {
        before: "Prompt engineering meant writing strings by hand, testing " +
          "them, and adjusting the wording. Chains of prompts were strings " +
          "concatenated with more strings.",
        problem: "That does not survive change. Switch models and every prompt " +
          "needs retuning, because phrasing that works on one model does not " +
          "transfer. There is no way to **measure** whether a change helped " +
          "beyond eyeballing outputs, and no way to systematically improve a " +
          "multi-stage pipeline where the stages interact.",
        shift: "Treat the pipeline as a **program to be compiled**. Declare " +
          "*what* each step does with a signature — `question -> answer` — " +
          "and let an optimiser search for the prompts and few-shot examples " +
          "that maximise a metric you define. The framing is deliberately " +
          "PyTorch-like: modules, a compiler, and a metric to optimise against."
      },

      num: {
        t: "What DSPy actually optimises",
        h: ["Component", "Hand-written", "DSPy"],
        r: [
          ["Instructions", "you write them", "**searched**"],
          ["Few-shot examples", "you pick them", "**selected from your data**"],
          ["Multi-stage interaction", "tuned by hand", "**optimised jointly**"],
          ["Model change", "**retune everything**", "**recompile**"],
          ["Requires", "intuition", "**a metric and examples**"]
        ],
        n: "The last row is the real barrier to adoption. DSPy needs a " +
          "**programmatic metric** and a set of examples to optimise against " +
          "— if you cannot score an output automatically, there is nothing to " +
          "compile toward. Teams that already have an evaluation set find it " +
          "transformative; teams that do not discover that building one is the " +
          "actual work, and DSPy has simply made that unavoidable. The " +
          "**recompile-on-model-change** row is the clearest practical " +
          "benefit: prompts tuned for one model are famously brittle, and " +
          "having a compilation step rather than a pile of strings makes " +
          "switching models a build step rather than a rewrite."
      },

      miss: [
        {
          w: "DSPy writes better prompts than a human.",
          r: "It **searches** over prompts and examples against your metric. " +
            "Whether that beats a skilled human depends entirely on the " +
            "metric's quality. A poor metric optimised well produces a pipeline " +
            "that scores highly and is worse."
        },
        {
          w: "You can use it without evaluation data.",
          r: "The optimiser needs examples and a metric — that is the " +
            "mechanism. Without them there is nothing to compile against, and " +
            "DSPy degrades to a slightly more structured way of writing " +
            "prompts by hand."
        },
        {
          w: "It replaces prompt engineering entirely.",
          r: "It replaces **manual iteration on wording**. You still design " +
            "the pipeline, choose the modules, define signatures and — most " +
            "importantly — define what *good* means. That is arguably the " +
            "harder half of the work."
        },
        {
          w: "The optimised prompts will be readable and instructive.",
          r: "They are often strange — unusual phrasings and example " +
            "selections that work for reasons that are not obvious. This is a " +
            "real cost: debugging a pipeline whose prompts you did not write " +
            "and cannot fully explain is harder than debugging your own."
        }
      ],

      trade: {
        buys: [
          "Systematic optimisation instead of manual guessing.",
          "Model changes become a recompilation.",
          "Optimises multi-stage pipelines jointly.",
          "Forces an evaluation metric to exist, which is valuable in itself.",
          "Reproducible and version-controllable."
        ],
        costs: [
          "Requires evaluation data and a programmatic metric.",
          "Compilation costs many LLM calls.",
          "Optimised prompts can be opaque.",
          "A framework to learn, with its own abstractions.",
          "Overkill for a single simple prompt."
        ],
        avoid: [
          "You have no evaluation set and will not build one.",
          "It is one simple prompt — write it.",
          "Output quality cannot be scored automatically.",
          "The team cannot maintain a framework dependency.",
          "You need to read and hand-tune the exact prompt text."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
