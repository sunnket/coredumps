/* ==========================================================================
   Depth pass 4 — LLM inference and serving internals.

   These are the terms that decide whether a model is affordable to run.
   Almost all of them trace back to one fact that is worth stating once here:
   **generation is memory-bandwidth bound, not compute bound.** Producing one
   token requires reading every weight in the model from memory, and doing
   almost nothing with each one. That single asymmetry explains the KV cache,
   batching, quantisation, MQA/GQA, speculative decoding and the prefill /
   decode split — every one of them is an attempt to get more arithmetic out
   of each byte moved.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "kv-cache",

      why: {
        before: "Generating token 500 meant running the whole prompt plus the " +
          "499 tokens already produced back through every layer, from scratch.",
        problem: "That is quadratic work for a linear amount of output. " +
          "Generating 1,000 tokens would mean roughly 500,000 token-positions " +
          "of computation, and almost every one of them recomputes a key and " +
          "value vector that is *identical* to what it was on the previous step.",
        shift: "Notice that in a causal model, past tokens never see future " +
          "ones — so their keys and values can never change. Store them once " +
          "and reuse them. Each new token then attends against the cache and " +
          "only computes its own K and V. Generation becomes linear."
      },

      num: {
        t: "KV cache size, Llama-3-70B, fp16",
        h: ["Context", "Per sequence", "At batch 32"],
        r: [
          ["1,000 tokens", "~0.31 GB", "~10 GB"],
          ["8,000 tokens", "~2.5 GB", "~80 GB"],
          ["32,000 tokens", "~10 GB", "~320 GB"],
          ["128,000 tokens", "~40 GB", "~1.3 TB"]
        ],
        n: "The formula is `2 × layers × kv_heads × head_dim × context × " +
          "batch × bytes`. The 2 is for K and V. At long context the cache " +
          "**exceeds the model weights** — a 70B model is 140GB in fp16, and " +
          "a batch of 32 at 32k context needs more than twice that again just " +
          "for cache. This is why serving throughput is usually limited by KV " +
          "memory rather than by compute, and why **GQA**, **MQA**, **MLA** " +
          "and **PagedAttention** all exist."
      },

      miss: [
        {
          w: "The KV cache is an optimisation you can turn off if memory is tight.",
          r: "Without it generation is quadratic and unusably slow — a 2,000 " +
            "token response would take minutes rather than seconds. It is not " +
            "optional; the real question is how to make it *smaller*, which is " +
            "what quantised caches, GQA and sliding-window attention address."
        },
        {
          w: "The cache stores the tokens that were generated.",
          r: "It stores the **key and value projections** at every layer for " +
            "every past position — a tensor, not text. That is why it is " +
            "measured in gigabytes rather than kilobytes: a single token's " +
            "entry is `2 × layers × kv_heads × head_dim` numbers."
        },
        {
          w: "A longer context costs more because attention is O(n²).",
          r: "During **decode** it is not. Each new token attends once against " +
            "n cached positions, which is `O(n)` per token. The quadratic cost " +
            "is paid during **prefill**, when the whole prompt is processed at " +
            "once. What long context costs at decode time is *memory* and the " +
            "bandwidth to read the cache."
        },
        {
          w: "Two requests with the same prompt each need their own full cache.",
          r: "Not with **prefix caching**. If the first 2,000 tokens are a " +
            "shared system prompt, that portion of the cache is identical and " +
            "can be computed once and shared across every request — which is " +
            "why providers charge substantially less for cached input tokens."
        }
      ],

      trade: {
        buys: [
          "Turns quadratic generation into linear — the difference between " +
            "unusable and real-time.",
          "Enables prefix sharing across requests with a common system prompt.",
          "Makes the decode step cheap enough that batching becomes the main " +
            "throughput lever."
        ],
        costs: [
          "Memory that grows with context **and** batch size, often exceeding " +
            "the weights themselves.",
          "It is the binding constraint on how many concurrent requests a GPU " +
            "can hold.",
          "Naive allocation wastes most of it — reserving max-context per " +
            "request when most requests are short."
        ],
        avoid: [
          "You are scoring or classifying rather than generating; a single " +
            "forward pass needs no cache at all.",
          "Embedding a document — there is no autoregressive loop to amortise.",
          "The model is encoder-only (BERT-style), where there is no causal " +
            "generation to cache for."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pagedattention",

      why: {
        before: "A serving engine reserved one contiguous block of GPU memory " +
          "per request, sized for the **maximum** possible context, because " +
          "the cache has to grow and contiguous memory cannot be extended.",
        problem: "Most requests never reach the maximum. Reserving 32k tokens " +
          "for a request that generates 200 wastes over 99% of that block, and " +
          "the waste is unrecoverable while the request is live. Measurements " +
          "in the vLLM paper found **60–80%** of KV memory was wasted this way.",
        shift: "This is exactly the problem operating systems solved with " +
          "virtual memory. Break the cache into small fixed-size **pages**, " +
          "keep a per-sequence block table mapping logical positions to " +
          "physical pages, and allocate pages only as they are needed. " +
          "Fragmentation drops to at most one partial page per sequence."
      },

      num: {
        t: "KV memory utilisation",
        h: ["Allocation", "Wasted", "Effective batch size"],
        r: [
          ["Contiguous, max-length", "60–80%", "1×"],
          ["PagedAttention", "<4%", "2–4×"]
        ],
        n: "The gain is not a faster kernel — it is **more requests resident at " +
          "once**, and throughput on a GPU scales almost linearly with batch " +
          "size during decode because decode is bandwidth-bound. vLLM reported " +
          "**2–4× higher throughput** at the same latency purely from " +
          "reclaiming this waste. Pages also make **copy-on-write sharing** " +
          "natural: parallel samples from one prompt share the prompt's pages " +
          "and only diverge where they actually differ."
      },

      miss: [
        {
          w: "PagedAttention is a faster attention algorithm.",
          r: "It changes nothing about the mathematics of attention — the " +
            "computed result is identical. It is a **memory allocator**. The " +
            "attention kernel is modified only so it can read keys and values " +
            "from non-contiguous pages via a block table."
        },
        {
          w: "It reduces how much KV cache a request needs.",
          r: "A request needs exactly as much as before. What changes is that " +
            "it is no longer *reserved in advance* — memory is handed out as " +
            "the sequence actually grows, so the GPU is not holding empty space " +
            "for a request that may never use it."
        },
        {
          w: "Smaller pages are always better because there is less waste.",
          r: "Smaller pages mean less internal fragmentation but a larger block " +
            "table and more indirection per attention step. Block size **16** " +
            "is the common default because it balances the two; going to 1 " +
            "would minimise waste and cost more in lookup overhead than it saves."
        },
        {
          w: "It only helps when serving many different users.",
          r: "It also helps a single user doing beam search or sampling several " +
            "candidates, because all branches share the prompt's pages via " +
            "copy-on-write instead of each holding a full copy."
        }
      ],

      trade: {
        buys: [
          "Near-total elimination of KV fragmentation — under 4% waste.",
          "2–4× effective throughput at unchanged latency.",
          "Free prompt sharing between parallel samples via copy-on-write.",
          "Makes preemption practical: pages can be swapped out and back."
        ],
        costs: [
          "A custom attention kernel that reads through a block table.",
          "Indirection on every attention step, a small constant cost.",
          "Real complexity in the serving engine — a page table, an allocator " +
            "and eviction policy to maintain."
        ],
        avoid: [
          "You are running a single request at a time on dedicated hardware — " +
            "there is no fragmentation to reclaim.",
          "Sequences are short and uniform, so contiguous allocation wastes " +
            "little.",
          "You are not writing a serving engine. This is a property you choose " +
            "by picking vLLM, TGI or SGLang — not something to reimplement."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "continuous-batching",

      why: {
        before: "Requests were gathered into a fixed batch, run together, and " +
          "returned together — **static batching**, the standard approach for " +
          "any other kind of model inference.",
        problem: "Generation lengths vary wildly. A batch of 32 where one " +
          "request wants 2,000 tokens and the rest want 20 runs at the speed of " +
          "the longest: 31 slots sit idle doing padding work for the remaining " +
          "1,980 steps, and no new request can start until the whole batch " +
          "finishes.",
        shift: "Batch at the level of the **iteration**, not the request. After " +
          "every single forward pass, evict any sequence that finished and " +
          "admit a waiting one into its slot. The batch composition changes " +
          "continuously, and the GPU never runs a slot on a finished sequence."
      },

      num: {
        t: "Static against continuous batching",
        h: ["Property", "Static", "Continuous"],
        r: [
          ["GPU utilisation", "low, length-dependent", "consistently high"],
          ["Time to first token", "waits for batch to fill", "next iteration"],
          ["Throughput", "1×", "up to ~23×"],
          ["Slot waste", "pads to longest", "none"]
        ],
        n: "The 23× figure is from Anyscale's benchmark and is a best case — " +
          "highly variable output lengths, which is exactly what real chat " +
          "traffic looks like. The mechanism is simple arithmetic: if outputs " +
          "average 100 tokens but the longest is 2,000, static batching wastes " +
          "**95%** of the slot-steps in that batch. Continuous batching wastes " +
          "none, so throughput approaches the hardware limit rather than the " +
          "tail-latency limit."
      },

      miss: [
        {
          w: "Continuous batching makes each individual request faster.",
          r: "A single request in isolation runs at exactly the same speed. " +
            "What improves is **throughput** and the time a request waits " +
            "before it starts — it joins on the next iteration rather than " +
            "waiting for a batch boundary. Per-token latency under load may " +
            "even rise slightly, because the batch is fuller."
        },
        {
          w: "It is just batching with a smaller batch size.",
          r: "Batch size is unchanged or larger. What changes is *when* " +
            "membership is decided: static batching fixes it at the start and " +
            "holds it; continuous batching re-decides every forward pass. It is " +
            "closer to a scheduler than to a batch size setting."
        },
        {
          w: "It needs PagedAttention to work.",
          r: "They are independent and complementary. Continuous batching " +
            "solves *slot* waste over time; PagedAttention solves *memory* " +
            "waste within a slot. Continuous batching without paged memory " +
            "still helps, but admitting a new request needs a free contiguous " +
            "block, so the two together are far stronger than either alone."
        },
        {
          w: "Longer requests get starved by short ones.",
          r: "Only under a badly chosen policy. Once admitted, a sequence " +
            "occupies its slot until it finishes — it is not preempted by " +
            "arrivals. Starvation applies to requests *waiting to be admitted*, " +
            "which is a scheduling decision the engine makes explicitly."
        }
      ],

      trade: {
        buys: [
          "Order-of-magnitude throughput gains on variable-length workloads.",
          "Much lower queueing delay before a request starts producing tokens.",
          "GPU utilisation that stays high regardless of length distribution."
        ],
        costs: [
          "A real scheduler in the serving loop, with admission and eviction " +
            "policy.",
          "Per-token latency for an individual request rises as the batch " +
            "fills — throughput is bought with a little latency.",
          "Interacts with memory management: admitting a request you cannot " +
            "fit means preempting or recomputing one."
        ],
        avoid: [
          "Output lengths are uniform and known — static batching is simpler " +
            "and gives up almost nothing.",
          "You are running offline batch inference where latency does not " +
            "matter and you can sort by length instead.",
          "Throughput is irrelevant because you serve one request at a time."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "speculative-decoding",

      why: {
        before: "Every generated token required a full forward pass through " +
          "the large model — one pass, one token, no way around it.",
        problem: "Decode is **memory-bandwidth bound**, not compute bound. " +
          "Producing one token reads all 140GB of a 70B model's weights and " +
          "does a trivial amount of arithmetic with each. The GPU's compute " +
          "units sit almost idle while memory is saturated, so a forward pass " +
          "on one token costs nearly the same as on twenty.",
        shift: "Exploit that idle compute. Let a small cheap model **draft** " +
          "several tokens, then have the large model verify all of them in a " +
          "*single* pass. Verification costs about what one token cost before, " +
          "but can accept several. Crucially, the acceptance rule is " +
          "constructed so the output distribution is **provably identical** to " +
          "sampling from the large model directly."
      },

      num: {
        t: "Typical speed-up by acceptance rate",
        h: ["Accepted per pass", "Speed-up", "Notes"],
        r: [
          ["1.0 (none accepted)", "slower", "you paid for the draft"],
          ["2.0", "~1.6×", "modest domain match"],
          ["3.0", "~2.3×", "typical for a good draft model"],
          ["4.0+", "~3×", "code, or highly predictable text"]
        ],
        n: "The economics hinge entirely on **acceptance rate**, which is how " +
          "often the draft model agrees with the target. A draft model that is " +
          "too weak gets rejected constantly and you have paid for it for " +
          "nothing; one that is too strong costs as much as the model it is " +
          "helping. The usual ratio is roughly **1:10 to 1:20** in parameters. " +
          "**Medusa** and **EAGLE** avoid a separate model entirely by adding " +
          "extra prediction heads to the target model itself."
      },

      miss: [
        {
          w: "Speculative decoding approximates the large model's output.",
          r: "It is **exact**. The modified rejection-sampling rule guarantees " +
            "the resulting distribution is mathematically identical to " +
            "sampling from the target model alone. This is the property that " +
            "makes it deployable — you are not trading quality for speed, only " +
            "compute for bandwidth."
        },
        {
          w: "It makes the model cheaper to run.",
          r: "It uses **more** total compute — you run the draft model and then " +
            "verify. What it buys is **latency**, by converting idle compute " +
            "into fewer sequential memory passes. On a GPU already saturated " +
            "with a large batch there is no idle compute to exploit, and the " +
            "gain largely disappears."
        },
        {
          w: "A bigger draft model gives a better speed-up.",
          r: "There is an optimum. A bigger draft has higher acceptance but " +
            "costs more per draft token, and the two effects fight. Past a " +
            "point the draft costs more than the passes it saves — which is " +
            "the same reason drafting 20 tokens ahead is worse than drafting 5."
        },
        {
          w: "It helps every workload equally.",
          r: "It helps most where text is predictable — code, structured " +
            "output, formulaic prose — because acceptance is high. On creative " +
            "or high-entropy generation, acceptance falls and so does the gain. " +
            "Temperature matters too: sampling at high temperature reduces " +
            "agreement between draft and target."
        }
      ],

      trade: {
        buys: [
          "2–3× lower latency per request with **no** change to output quality.",
          "Uses compute that was otherwise idle during bandwidth-bound decode.",
          "Composes with quantisation and other serving optimisations."
        ],
        costs: [
          "A second model to train, store and keep in GPU memory.",
          "More total FLOPs — worse, not better, for pure throughput.",
          "Benefit collapses at large batch sizes, where the GPU is already " +
            "compute-saturated.",
          "Another moving part in the serving loop to tune and monitor."
        ],
        avoid: [
          "You are optimising **throughput** on a busy server — batching gives " +
            "you more, and speculation gives you almost nothing there.",
          "GPU memory is already the constraint; the draft model competes with " +
            "the KV cache.",
          "No suitable small model exists in the same family and tokeniser.",
          "Generation is short — a few tokens per request never amortises the " +
            "setup."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "flash-attention",

      why: {
        before: "A standard attention implementation computed the full " +
          "`n × n` score matrix, wrote it to GPU high-bandwidth memory, read " +
          "it back to apply softmax, wrote it again, then read it once more to " +
          "multiply by V.",
        problem: "That matrix is enormous — at 8k context and 32 heads it is " +
          "billions of numbers — and every write and read crosses the slowest " +
          "link on the GPU. Attention was **memory-bound**: the arithmetic was " +
          "cheap and the traffic to HBM dominated the runtime.",
        shift: "Never build the matrix. Process attention in tiles small " +
          "enough to fit in on-chip SRAM, and use the **online softmax** trick " +
          "to combine tile results without ever needing all scores at once. " +
          "The result is bit-for-bit the same attention; the memory traffic " +
          "drops from quadratic to linear."
      },

      num: {
        t: "GPU memory hierarchy — why this works",
        h: ["Level", "Bandwidth", "Size"],
        r: [
          ["SRAM (on-chip)", "~19 TB/s", "~20 MB"],
          ["HBM (GPU RAM)", "~1.5–3 TB/s", "40–80 GB"],
          ["Attention matrix at 8k", "—", "~2 GB per head-batch"]
        ],
        n: "SRAM is roughly **10× faster** than HBM, and the whole technique is " +
          "about keeping work inside it. FlashAttention-2 reports **2–4×** " +
          "wall-clock speed-up and reduces attention memory from `O(n²)` to " +
          "`O(n)`. Note carefully: the **compute** is still `O(n²)` — the same " +
          "number of multiply-adds happen. Only the memory traffic changes. " +
          "That distinction is why it enabled long context in practice without " +
          "changing the asymptotic cost."
      },

      miss: [
        {
          w: "FlashAttention makes attention O(n) instead of O(n²).",
          r: "It makes **memory** `O(n)`. The arithmetic remains `O(n²)` — " +
            "every query still scores against every key. Confusing the two " +
            "leads people to expect 100k context to be as cheap as 1k, which " +
            "it is not; it is merely *possible* rather than impossible."
        },
        {
          w: "It is an approximation, like sparse or linear attention.",
          r: "It is **exact**. Unlike Linformer, Performer or sliding-window " +
            "attention, it computes the identical result to standard attention " +
            "— it is a fused kernel, not a different algorithm. That is why it " +
            "could be adopted without retraining anything."
        },
        {
          w: "I should implement FlashAttention in my model code.",
          r: "It is a hand-written CUDA kernel tuned per GPU architecture. You " +
            "*use* it — through `F.scaled_dot_product_attention` in PyTorch 2, " +
            "or the `flash-attn` package — you do not write it. PyTorch will " +
            "often select it automatically when the shapes and dtype qualify."
        },
        {
          w: "It speeds up inference as much as training.",
          r: "It helps **prefill** substantially, where the full prompt is " +
            "processed at once. During **decode** there is only one query " +
            "against the cache — there is no large score matrix to avoid " +
            "materialising, so the gain is small. Decode is helped by " +
            "FlashDecoding and by KV-cache work instead."
        }
      ],

      trade: {
        buys: [
          "2–4× faster attention with identical numerical output.",
          "Linear rather than quadratic memory, which is what made long " +
            "context practical.",
          "Drop-in — no retraining, no architecture change.",
          "Larger batches fit, because attention no longer dominates memory."
        ],
        costs: [
          "Hardware-specific: requires a supported GPU architecture and dtype.",
          "Not always applicable — some attention variants and masks fall back " +
            "to the standard path.",
          "An opaque dependency; when it silently does not engage, performance " +
            "quietly halves.",
          "Recomputes some values in the backward pass, trading a little " +
            "compute for the memory saving."
        ],
        avoid: [
          "Running on CPU or an unsupported accelerator.",
          "Sequences are very short, where the fused kernel's setup outweighs " +
            "the saving.",
          "You need a custom attention pattern the kernel does not support.",
          "You are decoding one token at a time — reach for FlashDecoding or " +
            "KV-cache optimisations instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prefill",

      why: {
        before: "Inference was treated as one uniform activity — feed tokens " +
          "in, get tokens out — and tuned as a single thing.",
        problem: "It is two activities with opposite bottlenecks, and tuning " +
          "them together means tuning neither. Processing the prompt runs " +
          "every token in parallel and **saturates compute**; generating the " +
          "reply runs one token at a time and **saturates memory bandwidth**.",
        shift: "Name and separate them. Prefill is the parallel pass over the " +
          "whole prompt that fills the KV cache and produces the first token. " +
          "Everything after is decode. They get different metrics, different " +
          "optimisations and, increasingly, different hardware."
      },

      num: {
        t: "Prefill against decode",
        h: ["Property", "Prefill", "Decode"],
        r: [
          ["Tokens per pass", "all of the prompt", "1"],
          ["Bottleneck", "compute (FLOPs)", "memory bandwidth"],
          ["GPU utilisation", "high", "low without batching"],
          ["Scales with", "prompt length²", "output length"],
          ["Metric", "time to first token", "tokens per second"]
        ],
        n: "A 2,000-token prompt does about **2,000×** the work of one decode " +
          "step, which is why time-to-first-token is dominated by prompt length " +
          "while tokens-per-second is not. The practical consequence: **a long " +
          "prompt is expensive once; a long output is expensive continuously.** " +
          "It is also why batching helps decode enormously and prefill barely " +
          "at all — decode has idle compute to fill, prefill does not."
      },

      miss: [
        {
          w: "Input tokens and output tokens cost the same to process.",
          r: "They are billed differently for a real reason. Input tokens are " +
            "processed in parallel during prefill and are cheap per token; " +
            "output tokens each require a full sequential pass over the model " +
            "weights. Output is typically priced **3–5×** input, and that " +
            "reflects genuine cost."
        },
        {
          w: "Prefill is fast because it is parallel.",
          r: "It is *efficient*, not instant. It is `O(n²)` in prompt length " +
            "because of attention, so a 32k prompt is not 4× a 8k prompt — it " +
            "is closer to 16× for the attention portion. This is why " +
            "time-to-first-token degrades sharply with very long prompts."
        },
        {
          w: "A slow first token means a slow model.",
          r: "It usually means a long prompt, a cold cache, or a queue. First " +
            "token latency is dominated by prefill and scheduling; the " +
            "generation rate afterwards is a separate number. Measuring them " +
            "together hides which one you actually need to fix."
        },
        {
          w: "Prefill and decode should run on the same replica.",
          r: "Increasingly they should not. Because their bottlenecks differ, " +
            "**disaggregated serving** puts prefill and decode on separate " +
            "pools — prefill on compute-dense hardware, decode on " +
            "bandwidth-dense — and transfers the KV cache between them. " +
            "Running both on one replica means a long prefill stalls everyone " +
            "else's decode, which is what chunked prefill exists to mitigate."
        }
      ],

      trade: {
        buys: [
          "Two clear metrics — TTFT and TPOT — instead of one meaningless " +
            "average.",
          "Lets each phase be optimised with the technique that actually helps " +
            "it.",
          "Explains pricing, capacity planning and why batching helps unevenly."
        ],
        costs: [
          "Two things to monitor and reason about rather than one.",
          "Their resource needs conflict on shared hardware.",
          "Disaggregating them means moving the KV cache across machines, " +
            "which is its own engineering problem."
        ],
        avoid: [
          "Prompts and outputs are both short and uniform — the distinction " +
            "buys you nothing operationally.",
          "You are using a hosted API where you control neither phase.",
          "The workload is embeddings or classification, which is prefill only " +
            "with no decode at all."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "decode",

      why: {
        before: "Generation speed was assumed to be a function of model size " +
          "and GPU FLOPs, so faster chips were expected to fix it.",
        problem: "They largely did not. Producing one token requires reading " +
          "**every weight** of the model from GPU memory and performing about " +
          "two floating-point operations per weight. The arithmetic intensity " +
          "is roughly 2 FLOPs per byte, while a modern GPU wants closer to 300 " +
          "to be busy. Over 99% of the compute sits idle waiting on memory.",
        shift: "Once you accept decode is bandwidth-bound, the whole " +
          "optimisation menu follows: make the weights smaller " +
          "(**quantisation**), read them once for many sequences " +
          "(**batching**), shrink what else competes for bandwidth " +
          "(**GQA/MQA**), or get more tokens per read (**speculative " +
          "decoding**)."
      },

      num: {
        t: "Theoretical decode ceiling, single stream",
        h: ["Model, precision", "Weights", "Tokens/s at 2 TB/s"],
        r: [
          ["7B fp16", "14 GB", "~140"],
          ["7B int4", "3.5 GB", "~570"],
          ["70B fp16", "140 GB", "~14"],
          ["70B int4", "35 GB", "~57"]
        ],
        n: "The rule of thumb is simply `bandwidth ÷ model bytes` — you cannot " +
          "generate faster than you can read the weights once per token. Two " +
          "consequences follow directly. **Quantisation gives a near-linear " +
          "speed-up** at decode, because it is a memory saving, not a compute " +
          "one. And **batching is nearly free**: the weights are read once and " +
          "used for the whole batch, so 32 sequences take roughly the time of " +
          "one — which is precisely why serving throughput scales with batch " +
          "size while single-stream latency does not improve at all."
      },

      miss: [
        {
          w: "A faster GPU will generate tokens proportionally faster.",
          r: "Only if its **memory bandwidth** is higher. Doubling FLOPs with " +
            "the same bandwidth changes single-stream decode speed almost not " +
            "at all. This is why the memory-bandwidth spec matters more than " +
            "the TFLOPs number for inference, and why HBM generation is the " +
            "figure to look at."
        },
        {
          w: "Batching makes each user's response slower.",
          r: "Barely, and far less than intuition suggests. Because the weights " +
            "are read once for the whole batch, going from batch 1 to batch 32 " +
            "gives roughly **32× the throughput** for a small increase in " +
            "per-token latency. Refusing to batch does not make one user fast; " +
            "it makes everyone else wait in a queue."
        },
        {
          w: "Quantisation speeds things up because integer maths is faster.",
          r: "At decode the win is almost entirely that there are **fewer bytes " +
            "to read**. Int4 weights are a quarter the size, so they stream in " +
            "a quarter of the time. The arithmetic saving is secondary and, on " +
            "many kernels, the weights are dequantised to fp16 to multiply " +
            "anyway."
        },
        {
          w: "Decode is slow because attention is expensive.",
          r: "Attention during decode is one query against the cache — cheap. " +
            "The cost is reading the **model weights**, which dwarf the KV " +
            "cache for typical contexts. Attention becomes the concern at very " +
            "long context, where the cache itself grows large enough to " +
            "compete for bandwidth."
        }
      ],

      trade: {
        buys: [
          "A clear model of what governs generation speed — and what does not.",
          "Explains why batching, quantisation and GQA all work.",
          "Lets you compute a hardware ceiling before writing any code."
        ],
        costs: [
          "The sequential nature is inherent — you cannot parallelise across " +
            "tokens you have not generated yet.",
          "Single-stream latency has a hard floor set by bandwidth.",
          "Optimising for throughput and for latency pull in opposite " +
            "directions."
        ],
        avoid: [
          "The workload has no generation — embeddings, classification and " +
            "reranking are prefill-shaped and compute-bound.",
          "You are compute-bound because of an enormous batch; then FLOPs " +
            "matter again and the bandwidth model no longer dominates.",
          "Using a very small model on a very fast GPU, where overheads other " +
            "than bandwidth dominate."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grouped-query-attention",

      why: {
        before: "Multi-head attention gave every query head its own key and " +
          "value head. With 32 heads, the KV cache stored 32 separate K and V " +
          "tensors per layer per token.",
        problem: "That cache is what limits how many requests fit on a GPU. " +
          "**Multi-query attention** attacked it by sharing a *single* KV head " +
          "across all 32 query heads — a 32× reduction — but the quality drop " +
          "was measurable, and training was less stable.",
        shift: "Take the middle. Group the query heads and give each group its " +
          "own KV head — say 32 query heads sharing 8 KV heads. Nearly all of " +
          "MQA's memory saving, with quality statistically indistinguishable " +
          "from full MHA. It is now the default in Llama 2/3, Mistral and most " +
          "modern open models."
      },

      num: {
        t: "KV cache per token, 32-layer model, 32 query heads, dim 128",
        h: ["Variant", "KV heads", "Cache per token", "Relative"],
        r: [
          ["MHA", "32", "512 KB", "1×"],
          ["GQA-8", "8", "128 KB", "1/4"],
          ["GQA-4", "4", "64 KB", "1/8"],
          ["MQA", "1", "16 KB", "1/32"]
        ],
        n: "At 8k context, MHA needs **4 GB** of cache per sequence while GQA-8 " +
          "needs **1 GB** — meaning four times the batch size on the same GPU. " +
          "Because decode is bandwidth-bound, a smaller cache is also directly " +
          "faster to read. The published ablations put GQA within noise of MHA " +
          "on quality while MQA shows a small but consistent degradation, which " +
          "is why 8 groups became the common compromise."
      },

      miss: [
        {
          w: "GQA reduces the number of parameters in the model.",
          r: "It removes the K and V *projection* weights for the merged heads, " +
            "which is a small fraction of total parameters. The overwhelming " +
            "benefit is at **inference**: a smaller KV cache. The model is " +
            "barely smaller; the memory needed to *run* it is much smaller."
        },
        {
          w: "Fewer KV heads means the model attends to less information.",
          r: "Every query head still attends over the entire sequence. What is " +
            "shared is the *representation* keys and values are projected " +
            "into — grouped heads see the same K/V but apply their own queries, " +
            "so they still specialise. Capacity is reduced, but far less than " +
            "the head count suggests."
        },
        {
          w: "You can convert an MHA model to GQA by dropping heads.",
          r: "You can **uptrain**: mean-pool the KV heads within each group and " +
            "continue training for a small fraction (~5%) of the original " +
            "compute. Simply discarding heads without that recovery step " +
            "damages the model. This uptraining recipe is the main practical " +
            "contribution of the GQA paper."
        },
        {
          w: "GQA is a compression technique like quantisation.",
          r: "It is an **architectural** choice fixed at training time, not a " +
            "post-hoc compression. You cannot toggle it on an existing " +
            "checkpoint at serving time the way you can apply int8 weights."
        }
      ],

      trade: {
        buys: [
          "4–8× smaller KV cache, and therefore proportionally larger batches.",
          "Faster decode, because less cache to read per token.",
          "Quality essentially matching full MHA, unlike MQA.",
          "Longer context becomes affordable on the same hardware."
        ],
        costs: [
          "A small reduction in model capacity relative to full MHA.",
          "Must be chosen at training time, or paid for with uptraining.",
          "One more architectural hyperparameter to pick.",
          "Still far larger than MLA-style latent compression."
        ],
        avoid: [
          "Training a small model where KV cache is not the constraint — full " +
            "MHA is simpler and slightly stronger.",
          "Absolute maximum quality matters more than serving cost.",
          "You need the very smallest possible cache and can tolerate the " +
            "quality cost — MQA or MLA go further.",
          "You are serving an existing MHA checkpoint and cannot retrain."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
