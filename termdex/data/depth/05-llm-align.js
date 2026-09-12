/* ==========================================================================
   Depth pass 5 — alignment, preference training and quantisation.

   The through-line for the alignment terms: a pretrained model predicts the
   next token, which is not the same as being helpful, and there is no loss
   function for "helpful". Every method here is a different answer to the
   question *how do you optimise something you can only recognise, not
   define* — and they differ mainly in how much machinery they need to do it.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "rlhf",

      why: {
        before: "Models were fine-tuned by supervised learning on " +
          "demonstrations — show the model good answers, train it to imitate " +
          "them.",
        problem: "Two things break. Writing enough gold-standard answers is " +
          "enormously expensive, and imitation caps the model at the quality of " +
          "the demonstrations. Worse, *helpful* has no loss function — you " +
          "cannot differentiate it. But people can reliably say which of two " +
          "answers is better, even when they could not have written either.",
        shift: "Turn that comparison ability into a gradient. Collect " +
          "preference pairs, train a **reward model** to predict which answer " +
          "humans prefer, then use reinforcement learning to optimise the " +
          "language model against that reward. You are learning the objective, " +
          "then optimising it."
      },

      num: {
        t: "The three stages",
        h: ["Stage", "Data needed", "Output"],
        r: [
          ["1. SFT", "10k–100k demonstrations", "a model that follows instructions"],
          ["2. Reward model", "50k–1M comparisons", "a scorer of response quality"],
          ["3. RL (PPO)", "prompts only", "the aligned policy"]
        ],
        n: "InstructGPT's headline result is the one worth remembering: a " +
          "**1.3B** RLHF model was preferred by human raters over the **175B** " +
          "base GPT-3 — a **100×** parameter difference overturned by " +
          "alignment. The KL penalty against the SFT model is the load-bearing " +
          "detail: without it PPO discovers adversarial text that scores highly " +
          "on the reward model and is gibberish to humans. PPO needs **four " +
          "models in memory** at once — policy, reference, reward, and value — " +
          "which is why it is so expensive and why DPO was such a relief."
      },

      miss: [
        {
          w: "RLHF teaches the model new knowledge.",
          r: "It almost entirely changes *behaviour*, not knowledge. Facts come " +
            "from pretraining. RLHF adjusts which of the things the model " +
            "already could say it actually does say — format, refusal, " +
            "hedging, helpfulness. This is the **superficial alignment " +
            "hypothesis**, and it is why a few thousand good examples can " +
            "change a model's character so much."
        },
        {
          w: "The reward model captures what humans want.",
          r: "It captures what a particular set of labellers preferred on a " +
            "particular distribution of prompts. Push the policy far from that " +
            "distribution and the reward model becomes unreliable — **reward " +
            "hacking**, where the policy finds inputs that score highly and are " +
            "bad. Goodhart's law applied directly: the measure stops being a " +
            "good measure once it is a target."
        },
        {
          w: "More RLHF makes the model better.",
          r: "Past a point it makes it worse in measurable ways — the " +
            "**alignment tax**. Over-optimised models become sycophantic, " +
            "hedge excessively, refuse benign requests and lose diversity in " +
            "their output. The KL budget exists precisely to bound how far the " +
            "policy is allowed to drift."
        },
        {
          w: "RLHF makes a model safe.",
          r: "It makes a model *behave* according to the preferences it was " +
            "trained on, in the situations it was trained on. It is not a " +
            "security boundary — jailbreaks work by finding inputs outside " +
            "that distribution. Alignment is a strong default, not a guarantee."
        }
      ],

      trade: {
        buys: [
          "Optimises a goal nobody can write down, using judgements people can " +
            "actually make.",
          "Enormously more label-efficient than writing demonstrations.",
          "Can exceed the quality of its own training demonstrations.",
          "The technique that made instruction-following assistants usable."
        ],
        costs: [
          "Four models in memory for PPO — the most expensive fine-tuning " +
            "pipeline in common use.",
          "Reward hacking is a persistent and subtle failure mode.",
          "Notoriously unstable; many hyperparameters and hard to reproduce.",
          "Inherits and can amplify labeller bias."
        ],
        avoid: [
          "You have a clear automatic metric — optimise it directly rather " +
            "than through a learned proxy.",
          "You have demonstrations but no comparisons; SFT is simpler and may " +
            "be enough.",
          "Compute is limited — **DPO** gets much of the benefit without the " +
            "reward model or the RL loop.",
          "The task is narrow and objective, like extraction or " +
            "classification, where preference has little meaning."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dpo",

      why: {
        before: "RLHF was the accepted route: train a reward model on " +
          "preferences, then run PPO against it with a KL penalty.",
        problem: "The pipeline is brittle and heavy. Four models in memory, an " +
          "RL algorithm famous for instability, a reward model that can be " +
          "gamed, and a mass of hyperparameters. Most teams simply could not " +
          "run it reliably.",
        shift: "The DPO paper's insight is mathematical: for the KL-constrained " +
          "objective RLHF optimises, the **optimal policy has a closed form in " +
          "terms of the reward**. Invert that relationship and the reward model " +
          "cancels out entirely — you can express the whole thing as a " +
          "classification loss on preference pairs. No reward model, no " +
          "sampling loop, no RL. Just a loss function."
      },

      num: {
        t: "DPO against PPO-based RLHF",
        h: ["Property", "RLHF (PPO)", "DPO"],
        r: [
          ["Models in memory", "4", "2"],
          ["Separate reward model", "yes", "no"],
          ["Sampling during training", "yes", "no"],
          ["Main hyperparameter", "many", "β"],
          ["Stability", "notoriously fiddly", "like supervised training"]
        ],
        n: "The single hyperparameter that matters is **β**, controlling how " +
          "far the policy may drift from the reference — typically **0.1**. " +
          "Low β allows large drift and risks degeneration; high β keeps the " +
          "model close to where it started and barely changes it. The catch " +
          "that shows up in practice: DPO trains only on the *fixed* preference " +
          "dataset, so unlike PPO it never sees its own current outputs. On " +
          "off-policy data it can push down the probability of the rejected " +
          "response **and** the chosen one, which is why online and iterative " +
          "DPO variants exist."
      },

      miss: [
        {
          w: "DPO is a reinforcement learning algorithm.",
          r: "It is supervised learning. There is no environment, no reward " +
            "signal, no policy gradient and no sampling loop — it is a binary " +
            "classification loss over preference pairs. The RL is *derived " +
            "away* analytically, which is the entire contribution."
        },
        {
          w: "DPO has no reward model, so it cannot be reward hacked.",
          r: "The reward is **implicit in the policy** rather than absent. DPO " +
            "has its own failure mode: it can reduce the likelihood of both " +
            "responses in a pair while still increasing their *relative* gap, " +
            "which satisfies the loss and degrades the model."
        },
        {
          w: "DPO always matches or beats RLHF.",
          r: "It is competitive and far cheaper, and the picture is genuinely " +
            "contested. Well-tuned PPO with on-policy data still edges it on " +
            "some benchmarks, precisely because it trains on its own current " +
            "outputs rather than a frozen dataset. DPO's real win is " +
            "reproducibility."
        },
        {
          w: "You can run DPO straight on a base model.",
          r: "It expects to start from a **supervised fine-tuned** model. The " +
            "reference model in the loss is the SFT checkpoint, and the " +
            "preference data is assumed to be roughly on-distribution for it. " +
            "Skipping SFT gives poor results."
        }
      ],

      trade: {
        buys: [
          "Preference alignment with a training loop no harder than SFT.",
          "Half the memory of PPO — no reward or value model.",
          "One meaningful hyperparameter instead of a dozen.",
          "Reproducible, which made preference tuning available to everyone."
        ],
        costs: [
          "Trains off-policy on a fixed dataset; cannot explore.",
          "Can decrease the likelihood of chosen responses as well as rejected.",
          "No reusable reward model for evaluation or for other runs.",
          "Sensitive to how well the preference data matches the SFT model."
        ],
        avoid: [
          "You need a standalone reward model for evaluation, ranking or " +
            "best-of-n sampling.",
          "You can afford proper on-policy RL and want the last few points of " +
            "quality.",
          "Your labels are binary good/bad rather than pairwise — **KTO** takes " +
            "that shape directly.",
          "You want alignment folded into SFT in one stage — that is **ORPO**."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "qlora",

      why: {
        before: "**LoRA** already let you fine-tune by training small low-rank " +
          "adapters while freezing the base model. But the frozen base still " +
          "had to sit in GPU memory at fp16.",
        problem: "A 65B model in fp16 is 130GB of weights before you add " +
          "gradients, optimiser state or activations. That is multiple A100s " +
          "for a *frozen* model you are not even training — fine-tuning large " +
          "models stayed the preserve of well-funded labs.",
        shift: "The base is frozen, so it never receives a gradient — which " +
          "means its precision only has to be good enough for the **forward " +
          "pass**. Quantise it to 4-bit, keep the LoRA adapters in 16-bit, and " +
          "dequantise each layer on the fly as it is used. A 65B model " +
          "fine-tunes on a single 48GB GPU."
      },

      num: {
        t: "Memory to fine-tune, by method",
        h: ["Method", "65B model", "7B model"],
        r: [
          ["Full fine-tuning", ">780 GB", "~84 GB"],
          ["LoRA (fp16 base)", "~160 GB", "~18 GB"],
          ["QLoRA (4-bit base)", "~48 GB", "~6 GB"]
        ],
        n: "Full fine-tuning needs roughly **12–16 bytes per parameter** once " +
          "you count fp16 weights, fp32 master weights, and Adam's two " +
          "optimiser states. QLoRA needs about **0.5 bytes** for the frozen " +
          "base plus a tiny adapter. Three techniques make it work: **NF4**, a " +
          "4-bit datatype information-theoretically optimal for " +
          "normally-distributed weights; **double quantisation**, which " +
          "quantises the quantisation constants themselves; and **paged " +
          "optimisers** that spill to CPU on memory spikes. The QLoRA paper's " +
          "central claim is that this matches 16-bit full fine-tuning quality."
      },

      miss: [
        {
          w: "QLoRA makes the final model 4-bit.",
          r: "It makes **training** memory-cheap. The adapters are trained in " +
            "16-bit, and at the end you can merge them into an fp16 base and " +
            "serve at full precision. Quantisation is a training-time device, " +
            "not a property of the result — though you may separately choose to " +
            "quantise for serving."
        },
        {
          w: "4-bit quantisation must hurt quality.",
          r: "For a **frozen** base it largely does not, because the adapters " +
            "learn in full precision and can compensate for quantisation error " +
            "during training. The paper's Guanaco models reached 99% of " +
            "ChatGPT's Vicuna-benchmark score. Quantising a model you then " +
            "train fully would be a different and worse proposition."
        },
        {
          w: "QLoRA trains as fast as LoRA.",
          r: "It is typically **30–40% slower** per step, because every layer " +
            "is dequantised on the fly during the forward and backward passes. " +
            "You are trading time for memory. It is not a free improvement over " +
            "LoRA — it is what you use when LoRA does not fit."
        },
        {
          w: "A higher LoRA rank always gives better results.",
          r: "Rank matters far less than **which modules you attach to**. The " +
            "QLoRA paper found that applying adapters to *all* linear layers " +
            "mattered much more than rank; r=8 on every layer beats r=64 on " +
            "attention only. Rank 16–64 is the usual range and returns flatten " +
            "quickly."
        }
      ],

      trade: {
        buys: [
          "Fine-tuning a 65B model on one consumer-class GPU.",
          "Quality within noise of 16-bit full fine-tuning.",
          "Tiny artefacts — adapters are megabytes, so you can keep hundreds.",
          "Swappable adapters served against one shared base model."
        ],
        costs: [
          "30–40% slower per training step than plain LoRA.",
          "Quantise/dequantise adds implementation complexity and a dependency.",
          "Cannot change the base model's knowledge, only steer it.",
          "Merging adapters back into a quantised base is lossy and needs care."
        ],
        avoid: [
          "The model fits comfortably in fp16 — plain LoRA is faster.",
          "You need to genuinely teach the model new domain knowledge, which " +
            "wants continued pretraining rather than adapters.",
          "Training a small model where full fine-tuning is affordable and " +
            "slightly better.",
          "Training speed matters more than memory."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mixture-of-experts",

      why: {
        before: "Making a model better meant making every layer wider or the " +
          "stack deeper — and every parameter was used for every token.",
        problem: "Cost scales with parameter count, so quality and inference " +
          "cost were locked together. But most tokens do not need the whole " +
          "model. Processing the word *the* engages the same 175 billion " +
          "parameters as a subtle chemistry question, which is obviously " +
          "wasteful.",
        shift: "Decouple **capacity** from **compute**. Replace the " +
          "feed-forward layer with many parallel experts and a router that " +
          "sends each token to only a couple of them. Total parameters grow " +
          "enormously; the parameters *activated* per token stay small."
      },

      num: {
        t: "Total against active parameters",
        h: ["Model", "Total", "Active per token"],
        r: [
          ["Mixtral 8x7B", "47B", "13B"],
          ["Mixtral 8x22B", "141B", "39B"],
          ["DeepSeek-V3", "671B", "37B"],
          ["Dense 70B", "70B", "70B"]
        ],
        n: "Mixtral 8x7B is **not** 56B — the attention layers are shared and " +
          "only the FFN is replicated, so it is 47B total with 13B active. The " +
          "trade is stark and specific: it needs the **memory of a 47B model** " +
          "but runs at roughly the **speed of a 13B model**. Note also that " +
          "*8x7B* does not mean eight independent 7B models; experts specialise " +
          "at the level of syntax and token type rather than by subject, which " +
          "is a common misreading. Load balancing is essential — without an " +
          "auxiliary loss encouraging even routing, a few experts receive " +
          "everything and the rest are dead weight."
      },

      miss: [
        {
          w: "Each expert specialises in a topic like medicine or code.",
          r: "Interpretability work on Mixtral found routing correlates with " +
            "**syntax and token type**, not subject matter. Experts are not " +
            "domain specialists you could name; the specialisation is learned, " +
            "distributed and largely uninterpretable."
        },
        {
          w: "MoE models are cheaper to run than dense models of the same " +
            "quality.",
          r: "Cheaper in **compute**, not in **memory**. Every expert must be " +
            "resident in GPU memory because any token might route to it. " +
            "Mixtral 8x7B needs ~94GB in fp16 to serve — you are buying speed " +
            "with VRAM, which for many deployments is the more expensive " +
            "resource."
        },
        {
          w: "You can drop the experts that are used least.",
          r: "Usage is highly context-dependent, and an expert that looks idle " +
            "on your evaluation set may be essential on other inputs. Naive " +
            "expert pruning degrades quality unpredictably — this is an active " +
            "research area, not a deployment switch."
        },
        {
          w: "MoE is straightforwardly better, so everyone should use it.",
          r: "It is markedly harder to train — unstable, sensitive to the " +
            "load-balancing loss, and prone to expert collapse. It also " +
            "complicates fine-tuning, and is reported to overfit more readily " +
            "on small downstream datasets. Dense models remain the safer " +
            "default at moderate scale."
        }
      ],

      trade: {
        buys: [
          "Far more capacity for the same inference FLOPs.",
          "Better quality per unit of training compute at large scale.",
          "Faster inference than a dense model of equal parameter count.",
          "Experts parallelise naturally across devices."
        ],
        costs: [
          "All parameters must be in memory, so VRAM is the binding cost.",
          "Training instability and expert collapse without careful balancing.",
          "Routing adds communication overhead in distributed serving.",
          "Fine-tuning is harder and more prone to overfitting."
        ],
        avoid: [
          "GPU memory is the constraint — a dense model of the same *active* " +
            "size is far smaller.",
          "You are fine-tuning on a small dataset, where dense models behave " +
            "more predictably.",
          "Deploying on edge or consumer hardware.",
          "You need interpretable, debuggable behaviour — routing adds a layer " +
            "of opacity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "scaling-laws",

      why: {
        before: "Deciding how big a model to train was guesswork and folklore. " +
          "You picked a size that felt right, trained it, and found out.",
        problem: "Training runs cost millions and take months. You cannot " +
          "afford to discover after the fact that a different allocation of the " +
          "same budget would have produced a much better model.",
        shift: "Kaplan et al. (2020) found loss falls as a smooth **power law** " +
          "in parameters, data and compute — predictable over many orders of " +
          "magnitude. That turns model design into a calculation: measure small " +
          "runs, fit the curve, extrapolate. It is why labs can now promise a " +
          "capability level before the run starts."
      },

      num: {
        t: "Kaplan (2020) against Chinchilla (2022)",
        h: ["", "Kaplan", "Chinchilla"],
        r: [
          ["Tokens per parameter", "~1.7", "~20"],
          ["Given 10× compute", "5.5× params, 1.8× data", "3.2× params, 3.2× data"],
          ["GPT-3 175B verdict", "reasonable", "10× undertrained"],
          ["Chinchilla 70B vs Gopher 280B", "—", "70B wins"]
        ],
        n: "Chinchilla's correction is the important one: parameters and data " +
          "should scale **roughly equally**, and most large models of that era " +
          "were badly undertrained. GPT-3 at 175B saw 300B tokens; Chinchilla " +
          "says it wanted **3.5 trillion**. A 70B model trained on 1.4T tokens " +
          "beat a 280B model trained on 300B — four times smaller and better. " +
          "Modern practice has gone further still and deliberately " +
          "*over*-trains relative to Chinchilla (Llama 3 used 15T tokens for 8B " +
          "parameters, ~1,875 per parameter) because Chinchilla optimises " +
          "**training** compute while ignoring the far larger lifetime cost of " +
          "**inference**."
      },

      miss: [
        {
          w: "Scaling laws say bigger models are better.",
          r: "They say bigger models trained on **proportionally more data** " +
            "are better. A larger model on the same data is often *worse* per " +
            "unit of compute. The whole Chinchilla result is that the field had " +
            "been reading the law as a licence to grow parameters alone."
        },
        {
          w: "Chinchilla-optimal is the right target for a production model.",
          r: "Only if you care exclusively about training cost. If a model will " +
            "serve billions of tokens, a smaller model trained far past " +
            "Chinchilla-optimal is cheaper over its life — you pay once in " +
            "training to save forever in inference. This is why Llama 3 is " +
            "trained so far beyond the compute-optimal point."
        },
        {
          w: "Loss going down means the model is getting better at tasks.",
          r: "Loss is smooth and predictable; **task performance is not**. " +
            "Benchmark scores can stay flat and jump — the *emergent ability* " +
            "debate. Scaling laws predict the loss curve reliably and predict " +
            "downstream capability only loosely."
        },
        {
          w: "Scaling laws will hold indefinitely.",
          r: "They are empirical fits over an observed range, not physical law. " +
            "There is a known irreducible-entropy floor, and the more immediate " +
            "constraint is data: high-quality text is finite, and projections " +
            "put exhaustion of it within this decade. Synthetic data and " +
            "multimodality are partly attempts to route around that wall."
        }
      ],

      trade: {
        buys: [
          "Turns architecture and budget decisions into arithmetic.",
          "Lets small experiments predict very large runs.",
          "Explains why data curation is as valuable as model size.",
          "Provides a shared framework for comparing training efficiency."
        ],
        costs: [
          "Predicts loss, not capability — the thing you actually want.",
          "Fits are architecture- and dataset-specific; constants do not " +
            "transfer.",
          "Compute-optimal ignores inference cost entirely.",
          "Encourages a narrow scale-first mindset over algorithmic work."
        ],
        avoid: [
          "Fine-tuning, where the relevant dynamics are entirely different.",
          "Small-data regimes far outside the fitted range.",
          "You care about a specific capability rather than average loss.",
          "Optimising for a model that will serve enormous inference volume — " +
            "the compute-optimal point is the wrong target."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "byte-pair-encoding",

      why: {
        before: "Text was split either into **words** — giving a vocabulary of " +
          "hundreds of thousands and an out-of-vocabulary problem for anything " +
          "unseen — or into **characters**, which handles anything but makes " +
          "sequences far too long.",
        problem: "Word-level tokenisers cannot represent a typo, a new product " +
          "name or a rare inflection. Character-level ones turn a 500-word " +
          "document into 3,000 tokens, and attention is quadratic.",
        shift: "Take a compression algorithm from 1994 and repurpose it. Start " +
          "from characters, then repeatedly merge the most frequent adjacent " +
          "pair into a new token. Common words end up as single tokens, rare " +
          "words decompose into pieces, and **nothing is ever out of " +
          "vocabulary** because the character level is always available as a " +
          "fallback."
      },

      num: {
        t: "Tokens per word, by language (GPT-4 tokeniser)",
        h: ["Language", "Tokens per word", "Cost multiplier"],
        r: [
          ["English", "~1.3", "1×"],
          ["Spanish, French", "~1.7", "~1.3×"],
          ["Chinese", "~1.5 per char", "~2×"],
          ["Hindi, Tamil", "~4–6", "~3–5×"]
        ],
        n: "This is the **token tax**, and it is a real fairness problem: the " +
          "same sentence costs several times more in Hindi than in English, " +
          "consumes context faster, and is more likely to be truncated. It " +
          "follows directly from training the merge table on a corpus that was " +
          "mostly English. The same mechanism explains the classic " +
          "*strawberry* failure — the model sees a token, not the letters " +
          "inside it, so counting characters is genuinely hard for it. It also " +
          "explains why arithmetic is unreliable: numbers tokenise " +
          "inconsistently, so `1234` may be one token and `1235` two."
      },

      miss: [
        {
          w: "Tokens are words.",
          r: "Sometimes. Common words are single tokens; rare ones split into " +
            "pieces; a leading space is usually **part of** the token, so " +
            "`\" the\"` and `\"the\"` are different tokens. This is why " +
            "trailing whitespace in a prompt can measurably degrade output — " +
            "you have pushed the model off the distribution it was trained on."
        },
        {
          w: "BPE understands language structure.",
          r: "It is purely statistical frequency counting with no linguistic " +
            "knowledge whatsoever. It happily merges across morpheme " +
            "boundaries, producing splits no linguist would choose. It works " +
            "because it compresses well, not because it is right."
        },
        {
          w: "A larger vocabulary is better because sequences get shorter.",
          r: "There is a trade. A larger vocabulary means shorter sequences but " +
            "a much larger embedding matrix and softmax layer, more parameters " +
            "spent on rare tokens, and worse statistics for each. **32k–128k** " +
            "is the usual range, and the recent trend upward is driven by " +
            "multilingual coverage rather than by compression alone."
        },
        {
          w: "I can count tokens by dividing characters by four.",
          r: "That heuristic holds only for English prose. Code, JSON, " +
            "non-Latin scripts and numbers all diverge sharply — JSON " +
            "punctuation tokenises poorly, and non-English can be several times " +
            "denser. If the count matters for cost or truncation, run the " +
            "actual tokeniser."
        }
      ],

      trade: {
        buys: [
          "No out-of-vocabulary tokens, ever — anything decomposes.",
          "A tunable balance between vocabulary size and sequence length.",
          "Frequent words stay single tokens, so common text is efficient.",
          "Language-agnostic algorithm requiring no linguistic resources."
        ],
        costs: [
          "Strongly biased toward the training corpus's dominant language.",
          "Splits ignore morphology, producing linguistically absurd pieces.",
          "Makes character-level tasks — counting, spelling, reversal — hard.",
          "Number tokenisation is inconsistent, which harms arithmetic.",
          "Fixed after training: you cannot add tokens without retraining " +
            "embeddings."
        ],
        avoid: [
          "The task is fundamentally character-level, such as spelling " +
            "correction — consider byte-level or character models.",
          "You are working in a single morphologically rich language and can " +
            "train a tokeniser for it.",
          "You need tokenisation to align with linguistic units for " +
            "downstream analysis.",
          "Byte-level (ByT5) or tokeniser-free approaches suit the domain " +
            "better, accepting longer sequences."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rope",

      why: {
        before: "Position was injected by **adding** a vector to each token " +
          "embedding — sinusoidal in the original transformer, or a learned " +
          "table in BERT and GPT-2.",
        problem: "Learned absolute positions cannot extrapolate at all: a model " +
          "trained to 512 has no embedding for position 513. And absolute " +
          "position is the wrong quantity — what attention actually cares about " +
          "is how far apart two tokens are, which an additive absolute encoding " +
          "expresses only indirectly.",
        shift: "**Rotate** instead of adding. Apply a rotation to the query and " +
          "key vectors whose angle is proportional to position. Because the dot " +
          "product of two rotated vectors depends only on the *difference* of " +
          "their angles, attention becomes naturally relative — while the " +
          "encoding is still applied one token at a time."
      },

      num: {
        t: "Extending context by scaling RoPE",
        h: ["Method", "Idea", "Typical extension"],
        r: [
          ["None", "train at target length", "1×"],
          ["Position Interpolation", "compress positions into trained range", "4–8×"],
          ["NTK-aware scaling", "scale low frequencies more", "8–16×"],
          ["YaRN", "per-frequency, plus attention scaling", "16–32×"]
        ],
        n: "RoPE's base frequency **θ = 10000** is the parameter everything " +
          "turns on. Different dimensions rotate at different rates — fast for " +
          "local detail, slow for long-range — which is why the scaling methods " +
          "treat frequency bands differently rather than uniformly. This " +
          "tunability is the practical reason RoPE won: it is the only common " +
          "position encoding whose context can be **extended after training** " +
          "with a small amount of fine-tuning, and it is used in Llama, " +
          "Mistral, Qwen, DeepSeek and most modern open models."
      },

      miss: [
        {
          w: "RoPE is added to the embeddings like sinusoidal encoding.",
          r: "It is applied to the **queries and keys inside every attention " +
            "layer**, not once to the input embeddings — and it is a rotation, " +
            "not an addition. It therefore re-applies at each layer rather than " +
            "having to survive the whole stack."
        },
        {
          w: "RoPE extrapolates to any length for free.",
          r: "It degrades sharply beyond its trained length. Attention scores " +
            "become unreliable at unseen relative distances, and quality falls " +
            "off a cliff. Position Interpolation, NTK scaling and YaRN exist " +
            "precisely because naive extrapolation does not work."
        },
        {
          w: "RoPE encodes relative position, so absolute position is lost.",
          r: "The rotation is applied by absolute index; relativity emerges in " +
            "the *dot product*. The model can still recover absolute position " +
            "from the pattern, which matters for tasks that genuinely depend on " +
            "where in the document something appears."
        },
        {
          w: "You can change the context length by editing the config.",
          r: "Changing `max_position_embeddings` without applying a scaling " +
            "method and fine-tuning produces incoherent output past the " +
            "original length. The scaling changes the *frequencies*; the model " +
            "still needs a short adaptation phase to work at the new scale."
        }
      ],

      trade: {
        buys: [
          "Relative position behaviour with no extra parameters.",
          "Decays attention smoothly with distance — a useful inductive bias.",
          "Context can be extended after training via frequency scaling.",
          "Compatible with FlashAttention and efficient kernels."
        ],
        costs: [
          "Does not truly extrapolate without an explicit scaling method.",
          "Adds a rotation to every query and key at every layer.",
          "Base frequency is another hyperparameter with real consequences.",
          "Scaling methods trade short-context quality for long-context " +
            "ability."
        ],
        avoid: [
          "Sequences are short and fixed, where learned absolute embeddings " +
            "are simpler.",
          "You need strong extrapolation with zero fine-tuning — **ALiBi** " +
            "handles that more gracefully.",
          "The architecture is not attention-based.",
          "Position genuinely does not matter, as in set-structured inputs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cross-encoder",

      why: {
        before: "Retrieval embedded the query and each document **separately** " +
          "with a bi-encoder, then compared vectors. Documents could be " +
          "embedded in advance, so search was a fast nearest-neighbour lookup.",
        problem: "Separate encoding means the document's representation is " +
          "computed without ever having seen the query. Fine distinctions — " +
          "which of two similar passages actually answers *this* question — " +
          "are lost, because they depend on the interaction between the two.",
        shift: "Feed the query and document **together** through one model, so " +
          "every token of the query can attend to every token of the document. " +
          "Accuracy improves substantially. The price is that nothing can be " +
          "precomputed, so this cannot be your search — only your **reranker**."
      },

      num: {
        t: "Bi-encoder against cross-encoder",
        h: ["Property", "Bi-encoder", "Cross-encoder"],
        r: [
          ["Precompute documents", "yes", "no"],
          ["Forward passes per query", "1", "one per candidate"],
          ["Scoring 1M docs", "~10ms (ANN)", "hours"],
          ["Typical nDCG@10 gain", "baseline", "+10–20%"]
        ],
        n: "The standard architecture uses both: retrieve **top-100** with a " +
          "bi-encoder in milliseconds, then rerank those 100 with a " +
          "cross-encoder in ~50–200ms. You get most of the cross-encoder's " +
          "accuracy at a small fraction of its cost. The number of candidates " +
          "is the dial — reranking 100 rather than 20 catches more but costs " +
          "proportionally more, and the gain flattens quickly. A cross-encoder " +
          "cannot be indexed at all, because its score exists only for a " +
          "*pair*."
      },

      miss: [
        {
          w: "A cross-encoder is just a better embedding model.",
          r: "It produces **no embedding**. Its output is a single relevance " +
            "score for a query-document pair, which is why there is nothing to " +
            "store in a vector database and nothing to index. The two are " +
            "different kinds of object, not two qualities of the same one."
        },
        {
          w: "Reranking more candidates always helps.",
          r: "Returns diminish sharply. If the bi-encoder missed the right " +
            "document entirely, no amount of reranking recovers it — recall is " +
            "capped by the first stage. Going from 100 to 1,000 candidates " +
            "usually costs 10× for a marginal gain."
        },
        {
          w: "Cross-encoders are too slow to use in production.",
          r: "Too slow for **retrieval**, entirely practical for **reranking** " +
            "a shortlist. Small models like `bge-reranker-base` score 100 pairs " +
            "in well under 100ms on a GPU. Nearly every serious RAG system runs " +
            "one."
        },
        {
          w: "A cross-encoder replaces the need for a good retriever.",
          r: "It amplifies a good retriever and cannot rescue a bad one. " +
            "Because it only sees the candidates handed to it, first-stage " +
            "**recall** sets the ceiling on the whole pipeline. Improving " +
            "chunking and the embedding model usually matters more."
        }
      ],

      trade: {
        buys: [
          "Substantially better relevance ranking than vector similarity.",
          "Full query-document interaction, catching subtle distinctions.",
          "Works on the output of any retriever — vector, keyword or hybrid.",
          "Small models are enough; you do not need a large one."
        ],
        costs: [
          "One forward pass per candidate — cost scales with shortlist size.",
          "Nothing can be precomputed or cached across queries.",
          "Adds 50–200ms to the request path.",
          "Another model to deploy, version and monitor."
        ],
        avoid: [
          "Latency budget is very tight and the bi-encoder ranking is good " +
            "enough.",
          "The candidate set is already tiny — reranking five documents rarely " +
            "changes the answer.",
          "You need embeddings for clustering, deduplication or similarity — a " +
            "cross-encoder produces none.",
          "Corpus and queries are so narrow that a keyword search already ranks " +
            "correctly."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
