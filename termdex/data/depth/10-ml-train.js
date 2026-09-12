/* ==========================================================================
   Depth pass 10 — distributed training, and the statistics that decide
   whether a model is trustworthy.

   The training terms all answer one question: a model no longer fits on one
   GPU, so what do you split — the batch, the layers, or the weights
   themselves? Each answer has a different communication cost, and
   communication is what actually bounds distributed training.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "data-parallelism",

      why: {
        before: "Training ran on one GPU. Bigger datasets simply meant waiting " +
          "longer.",
        problem: "Waiting longer stopped being viable — a run that takes three " +
          "months cannot be iterated on. The obvious fix is more GPUs, but a " +
          "model's parameters must stay consistent across all of them, or you " +
          "are training several different models badly.",
        shift: "Replicate the model on every GPU, give each a **different " +
          "slice of the batch**, and average the gradients before the update. " +
          "Every replica then applies the same update and stays identical. " +
          "Mathematically it is one large batch; physically it is n small ones."
      },

      num: {
        t: "The three ways to split, compared",
        h: ["Strategy", "Splits", "Communication", "Use when"],
        r: [
          ["Data parallel", "the batch", "gradients, every step", "model fits on one GPU"],
          ["Tensor parallel", "each weight matrix", "**activations, every layer**", "one layer is too big"],
          ["Pipeline parallel", "the layers", "activations at boundaries", "model too deep for one GPU"],
          ["FSDP / ZeRO-3", "params + grads + optimiser", "params on demand", "the usual answer today"]
        ],
        n: "Data parallelism communicates one **all-reduce of the full gradient " +
          "per step** — for a 7B model in fp16 that is ~14GB moved every " +
          "iteration. This is why interconnect matters more than raw GPU speed: " +
          "**NVLink at ~600 GB/s** against **PCIe at ~32 GB/s** is the " +
          "difference between scaling well and not scaling at all. The other " +
          "hard limit is that data parallelism requires the **whole model plus " +
          "optimiser state on every GPU** — roughly 16 bytes per parameter with " +
          "Adam, so a 7B model needs ~112GB and does not fit on an 80GB card. " +
          "That is precisely the constraint FSDP and ZeRO remove."
      },

      miss: [
        {
          w: "Data parallelism with 8 GPUs makes training 8× faster.",
          r: "Never quite. Communication overhead, stragglers and imperfect " +
            "overlap mean real scaling efficiency is typically **70–90%** on " +
            "good interconnect and far worse on poor. Scaling to hundreds of " +
            "GPUs requires deliberate work — gradient bucketing, overlapping " +
            "communication with the backward pass, compression."
        },
        {
          w: "Each GPU trains on its own data, so it is like having 8 models.",
          r: "Gradients are averaged every step, so all replicas remain " +
            "**bit-identical**. There is one model. If they diverged you would " +
            "have a bug, not an ensemble."
        },
        {
          w: "You can scale the batch size indefinitely by adding GPUs.",
          r: "Large batches need a proportionally **larger learning rate** " +
            "(the linear scaling rule) plus warmup, and past a critical batch " +
            "size — often a few thousand — convergence degrades and you are " +
            "spending compute for nothing. Gradient noise has a useful " +
            "regularising role that very large batches remove."
        },
        {
          w: "Batch norm works the same way in data parallel training.",
          r: "It does not, and this is a real bug source. Each replica " +
            "normalises over its **local** slice, so with batch size 8 per GPU " +
            "the statistics come from 8 samples rather than 64. **SyncBatchNorm** " +
            "communicates statistics across replicas at extra cost. LayerNorm " +
            "and RMSNorm are unaffected, which is one reason transformers avoid " +
            "batch norm."
        }
      ],

      trade: {
        buys: [
          "Near-linear speed-up on good interconnect, with almost no code " +
            "change.",
          "Conceptually simple — every GPU does the same thing.",
          "Supported first-class by every framework.",
          "Composes with the other parallelism strategies."
        ],
        costs: [
          "Whole model plus optimiser state on every GPU.",
          "Full gradient all-reduce every step; bandwidth becomes the limit.",
          "Effective batch grows with GPU count, forcing learning-rate changes.",
          "Batch-dependent layers need special handling."
        ],
        avoid: [
          "The model does not fit on one GPU — use **FSDP/ZeRO** or tensor " +
            "parallelism.",
          "Interconnect is slow; communication will dominate and you will " +
            "scale badly.",
          "The batch is already at the critical size where larger stops helping.",
          "A single GPU trains it in an acceptable time — the complexity is " +
            "not free."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "fsdp",

      why: {
        before: "Data parallelism replicated everything on every GPU: " +
          "parameters, gradients and optimiser state. Simple, and hugely " +
          "redundant.",
        problem: "With Adam, each parameter costs roughly **16 bytes** — fp16 " +
          "weights, fp32 master weights, and two fp32 optimiser moments. A 7B " +
          "model therefore needs about 112GB of state per GPU, and every one of " +
          "your eight GPUs is holding an identical copy of it. Seven eighths of " +
          "that memory is pure duplication.",
        shift: "Shard it. Each GPU holds `1/N` of the parameters, gradients and " +
          "optimiser state, and **gathers** the full parameters for a layer " +
          "only for the moment it is needed, then frees them again. Memory " +
          "drops nearly linearly with GPU count, at the cost of extra " +
          "communication."
      },

      num: {
        t: "Memory per GPU, 7B model, Adam, 8 GPUs",
        h: ["Stage", "Shards", "Per-GPU state"],
        r: [
          ["DDP (ZeRO-0)", "nothing", "~112 GB"],
          ["ZeRO-1", "optimiser state", "~48 GB"],
          ["ZeRO-2", "+ gradients", "~34 GB"],
          ["ZeRO-3 / FSDP", "+ parameters", "~14 GB"]
        ],
        n: "The 16-bytes-per-parameter figure is worth memorising: **2 (fp16 " +
          "weights) + 4 (fp32 master) + 4 + 4 (Adam moments) + 2 (gradients)**. " +
          "ZeRO-3 shards all of it, so memory falls roughly as `1/N` — but it " +
          "adds an all-gather **per layer, twice** (forward and backward). " +
          "Communication volume rises about **50%** over plain data " +
          "parallelism, which is fine on NVLink and painful on PCIe. Activation " +
          "checkpointing is usually stacked on top, trading ~30% more compute " +
          "for a further large memory saving."
      },

      miss: [
        {
          w: "FSDP is a different algorithm from data parallelism.",
          r: "It computes exactly the same gradients and the same updates. It " +
            "is data parallelism with the redundant copies removed — a **memory " +
            "optimisation**, not a different training procedure. The resulting " +
            "model is identical."
        },
        {
          w: "Sharding parameters means each GPU only computes part of the " +
            "model.",
          r: "Every GPU computes the **whole** forward and backward pass. It " +
            "temporarily gathers each layer's full parameters when it reaches " +
            "that layer, uses them, and frees them. Splitting the computation " +
            "itself is **tensor parallelism**, which is a different thing."
        },
        {
          w: "FSDP is always better than DDP.",
          r: "If the model comfortably fits, DDP is **faster** — less " +
            "communication and less complexity. FSDP buys memory with " +
            "bandwidth. Use DDP until memory forces you to stop."
        },
        {
          w: "You should wrap the whole model in one FSDP unit.",
          r: "Then you gather every parameter at once and save nothing. The " +
            "granularity of the **wrapping policy** is the main tuning knob — " +
            "typically one unit per transformer block. Too coarse wastes " +
            "memory; too fine floods the interconnect with tiny transfers."
        }
      ],

      trade: {
        buys: [
          "Memory falls roughly linearly with GPU count.",
          "Trains models far larger than any single GPU could hold.",
          "Mathematically identical results to DDP.",
          "Native in PyTorch, composable with mixed precision and checkpointing."
        ],
        costs: [
          "~50% more communication than DDP.",
          "Needs fast interconnect to be worthwhile.",
          "Wrapping policy and prefetch settings need tuning.",
          "Checkpointing and resuming is more involved with sharded state."
        ],
        avoid: [
          "The model and optimiser fit comfortably — DDP is simpler and faster.",
          "Interconnect is slow; the extra all-gathers will dominate.",
          "The model is so large that one **layer** does not fit — you need " +
            "tensor parallelism as well.",
          "You are fine-tuning with LoRA, where optimiser state is tiny anyway."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mixed-precision-training",

      why: {
        before: "Everything was fp32. Weights, activations, gradients and " +
          "arithmetic all in 32-bit, because that is what numerical stability " +
          "seemed to require.",
        problem: "It wastes both memory and the hardware. Modern GPUs have " +
          "**tensor cores** that perform 16-bit matrix multiplies several times " +
          "faster than 32-bit ones, and half-precision halves memory traffic. " +
          "Training in fp32 leaves most of the chip's throughput unused.",
        shift: "Use fp16 or bf16 where precision does not matter — the matrix " +
          "multiplies — and keep fp32 where it does: the master weights and " +
          "the accumulations. Two safeguards make it work: a **master copy** " +
          "of weights in fp32, and **loss scaling** to stop small gradients " +
          "vanishing to zero in fp16's narrow range."
      },

      num: {
        t: "The formats",
        h: ["Format", "Exponent / mantissa", "Range", "Needs loss scaling?"],
        r: [
          ["fp32", "8 / 23", "~1e±38", "no"],
          ["fp16", "5 / 10", "~6e-5 to 65504", "**yes**"],
          ["bf16", "8 / 7", "same as fp32", "no"],
          ["fp8 (E4M3)", "4 / 3", "very narrow", "yes, plus scaling"]
        ],
        n: "The key insight is that **bf16 trades precision for range**: it has " +
          "the same exponent as fp32, so it cannot overflow or underflow where " +
          "fp32 would not, which removes the need for loss scaling entirely. " +
          "That is why bf16 is now the default on Ampere and later, and why " +
          "fp16 training was so fiddly before it. Typical gains are **2–3× " +
          "faster** with **~50% less activation memory**. The reason a master " +
          "fp32 copy is required: with fp16 weights, adding a small update to a " +
          "large weight rounds to no change at all, and training silently " +
          "stalls."
      },

      miss: [
        {
          w: "Mixed precision halves memory usage.",
          r: "It roughly halves **activation** memory, which is often the " +
            "largest component. Weights and optimiser state are usually kept in " +
            "fp32, so total savings are less than half — commonly 30–40%. It is " +
            "**FSDP/ZeRO** that attacks the optimiser state."
        },
        {
          w: "Loss scaling is a hyperparameter you tune.",
          r: "Modern implementations use **dynamic** loss scaling: start high, " +
            "halve on overflow, gradually increase when stable. You should not " +
            "be tuning it by hand, and with bf16 you do not need it at all."
        },
        {
          w: "bf16 is strictly better than fp16.",
          r: "Better for **training**, because range matters more than " +
            "precision when gradients span many orders of magnitude. fp16's " +
            "extra mantissa bits can be preferable for **inference**, where " +
            "values are well-scaled and precision is the binding constraint. " +
            "bf16 also needs Ampere or newer hardware."
        },
        {
          w: "If loss becomes NaN, mixed precision is the cause.",
          r: "It is a common cause and not the only one. A too-high learning " +
            "rate, a division by zero, or an unstable loss function all produce " +
            "NaN in fp32 too. Test by switching to fp32 — if the NaN persists, " +
            "precision was not the problem."
        }
      ],

      trade: {
        buys: [
          "2–3× faster training on tensor-core hardware.",
          "Roughly halves activation memory, enabling larger batches.",
          "Effectively free — one or two lines in modern frameworks.",
          "Accuracy matches fp32 when done correctly."
        ],
        costs: [
          "fp16 needs loss scaling and can still overflow.",
          "Numerically sensitive operations must stay in fp32.",
          "Debugging numerical issues gets harder.",
          "bf16 requires recent hardware."
        ],
        avoid: [
          "The hardware has no tensor cores — you gain memory and not speed.",
          "The model is numerically delicate and known to be precision-" +
            "sensitive.",
          "You are debugging a convergence problem — eliminate precision as a " +
            "variable first.",
          "Scientific computing where full precision is a correctness " +
            "requirement."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "knowledge-distillation",

      why: {
        before: "A large model was accurate and too slow or expensive to " +
          "deploy, so you either shipped it anyway or trained a smaller model " +
          "from scratch and accepted worse accuracy.",
        problem: "A small model trained on hard labels learns only *this is a " +
          "cat*. The large model knows much more than that — it knows this cat " +
          "looks somewhat like a dog and nothing like a car. Those relative " +
          "probabilities encode real structure, and one-hot labels throw all " +
          "of it away.",
        shift: "Train the student on the teacher's **full output " +
          "distribution** rather than on the label. Hinton called these " +
          "probabilities **dark knowledge**: the information in the wrong " +
          "answers. A temperature parameter softens the distribution so those " +
          "small probabilities carry enough signal to learn from."
      },

      num: {
        t: "What distillation typically achieves",
        h: ["Student", "Size of teacher", "Speed", "Accuracy retained"],
        r: [
          ["DistilBERT", "60%", "60% faster", "~97%"],
          ["TinyBERT", "~13%", "9× faster", "~96%"],
          ["Typical CV student", "10–25%", "4–10×", "95–99%"]
        ],
        n: "The **temperature** is the mechanism worth understanding. At T=1 a " +
          "confident teacher outputs something like `[0.99, 0.009, 0.001]` and " +
          "the informative structure is invisible. At T=3–5 it softens to " +
          "`[0.7, 0.2, 0.1]`, exposing the relative similarities. Gradients " +
          "scale as `1/T²`, so the soft-target loss is multiplied by `T²` to " +
          "keep it balanced against the hard-label loss — a detail that is easy " +
          "to omit and quietly ruins the result."
      },

      miss: [
        {
          w: "Distillation compresses the teacher model.",
          r: "It **trains a new model** to imitate the teacher's behaviour. " +
            "Nothing is compressed — the student has its own architecture and " +
            "its own weights, learned from scratch. Compression is quantisation " +
            "and pruning; distillation is transfer."
        },
        {
          w: "The student can only be as good as the teacher.",
          r: "Usually true, and not always. **Self-distillation** — a student " +
            "with the *same* architecture as the teacher — frequently improves " +
            "on it, because soft targets act as a regulariser and carry " +
            "information about label noise. *Born-again networks* show this " +
            "repeatedly."
        },
        {
          w: "You need the original training labels.",
          r: "You need **inputs**; the teacher supplies the targets. This is " +
            "why distillation works on unlabelled data, and why it is such a " +
            "practical technique when labels are the scarce resource."
        },
        {
          w: "Distillation always works.",
          r: "The **capacity gap** matters: a student far smaller than the " +
            "teacher may lack the capacity to represent its function at all, " +
            "and distillation from a very large teacher to a very small student " +
            "often underperforms distilling through an intermediate model. " +
            "Distribution mismatch between distillation data and deployment " +
            "data also degrades it sharply."
        }
      ],

      trade: {
        buys: [
          "Much smaller and faster models retaining most of the accuracy.",
          "Works on unlabelled data, since the teacher provides targets.",
          "Can transfer across architectures — transformer to CNN.",
          "Soft targets regularise, sometimes beating the teacher."
        ],
        costs: [
          "Requires training a second model — real compute cost.",
          "Needs a good teacher, which must be trained first.",
          "Extra hyperparameters: temperature, loss weighting.",
          "Student inherits the teacher's biases and errors."
        ],
        avoid: [
          "The teacher is already small enough to deploy.",
          "**Quantisation** or **pruning** would meet the target more cheaply " +
            "— they need no retraining.",
          "You have abundant labels and can simply train a small model " +
            "directly.",
          "The capacity gap is so wide the student cannot represent the " +
            "function."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "calibration",

      why: {
        before: "A classifier output a probability and the number was taken at " +
          "face value. Accuracy was measured; the probabilities themselves " +
          "were not.",
        problem: "Accuracy only asks whether the top class is right. It says " +
          "nothing about whether *0.9* means *right nine times out of ten*. " +
          "And modern deep networks are badly **overconfident** — they " +
          "routinely say 0.99 and are correct 80% of the time.",
        shift: "Measure the probabilities separately. Bin predictions by " +
          "confidence and check whether the observed accuracy in each bin " +
          "matches. This matters wherever the number is used as a number: " +
          "thresholds, expected-value decisions, human handoff, ensembling."
      },

      num: {
        t: "Fixes, and what they cost",
        h: ["Method", "Parameters", "Changes accuracy?"],
        r: [
          ["Temperature scaling", "**1**", "no — ranking preserved"],
          ["Platt scaling", "2", "no"],
          ["Isotonic regression", "non-parametric", "no, but can overfit"],
          ["Label smoothing", "1, during training", "slightly"]
        ],
        n: "**Temperature scaling is the right first answer**: divide the " +
          "logits by a single scalar T fitted on a validation set. It is a " +
          "monotonic transform, so **accuracy and ranking are completely " +
          "unchanged** — only the probabilities move. Guo et al. (2017) showed " +
          "it fixes most miscalibration in modern networks, and that " +
          "miscalibration has *worsened* as networks got deeper: LeNet was " +
          "reasonably calibrated, ResNet is not. **Expected Calibration Error** " +
          "is the usual metric, though it is sensitive to how you bin."
      },

      miss: [
        {
          w: "A more accurate model is better calibrated.",
          r: "They are independent. A model can be 95% accurate and wildly " +
            "overconfident, or 70% accurate and perfectly calibrated. Deeper " +
            "networks have generally become *more* accurate and *less* " +
            "calibrated at the same time."
        },
        {
          w: "Softmax outputs are probabilities.",
          r: "They are numbers between 0 and 1 that sum to 1, which is not the " +
            "same as being calibrated. Cross-entropy training actively pushes " +
            "them toward 0 and 1 — the loss keeps rewarding more confidence " +
            "even once the prediction is right — which is a direct cause of " +
            "overconfidence."
        },
        {
          w: "Calibration fixes bad predictions.",
          r: "It changes **confidence**, not **ranking**. A wrong prediction " +
            "stays wrong; it is now wrong with an honest 0.6 instead of a " +
            "misleading 0.98. The value is in what you do downstream: route " +
            "low-confidence cases to a human, threshold sensibly, combine " +
            "models correctly."
        },
        {
          w: "You can calibrate on the training set.",
          r: "The model is overconfident on training data by construction, so " +
            "you would fit a temperature near 1 and change nothing. " +
            "Calibration must be fitted on a **held-out** set, and it does not " +
            "transfer across distribution shift — a model calibrated in " +
            "training data is miscalibrated again once the world moves."
        }
      ],

      trade: {
        buys: [
          "Probabilities you can actually use in a decision rule.",
          "Temperature scaling is one parameter and does not touch accuracy.",
          "Enables sensible human-in-the-loop routing on low confidence.",
          "Necessary for correctly combining models or costs."
        ],
        costs: [
          "Needs a held-out calibration set.",
          "Must be redone after retraining or under distribution shift.",
          "Isotonic regression can overfit on small validation sets.",
          "Another artefact to version alongside the model."
        ],
        avoid: [
          "Only the top-1 label is used and confidence is never read.",
          "The ranking matters but the magnitude does not, as in some search " +
            "applications.",
          "There is no held-out data to fit on.",
          "The deployment distribution differs so much that calibration will " +
            "not hold anyway."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "simpson-s-paradox",

      why: {
        before: "Aggregate statistics were trusted. Group A has a higher " +
          "success rate than group B, therefore A is better.",
        problem: "That inference can be **exactly backwards**. A trend present " +
          "in every subgroup can reverse when the subgroups are combined, " +
          "because the groups differ in size and in baseline rate. Nothing is " +
          "wrong with the arithmetic; the aggregate genuinely says the " +
          "opposite of every part.",
        shift: "Recognise that the aggregate is a weighted average with weights " +
          "you did not choose. Whether to aggregate is a **causal** question, " +
          "not a statistical one — you have to know whether the grouping " +
          "variable is a confounder or a mediator, and no amount of staring at " +
          "the numbers will tell you."
      },

      num: {
        t: "UC Berkeley admissions, 1973",
        h: ["", "Men applied", "Men admitted", "Women applied", "Women admitted"],
        r: [
          ["Overall", "8,442", "**44%**", "4,321", "**35%**"],
          ["Dept A", "825", "62%", "108", "**82%**"],
          ["Dept B", "560", "63%", "25", "**68%**"],
          ["Dept C", "325", "37%", "593", "34%"],
          ["Dept F", "373", "6%", "341", "7%"]
        ],
        n: "The overall figures look like clear discrimination against women. " +
          "Yet most individual departments admitted women at a **higher** rate. " +
          "The explanation is that women applied disproportionately to " +
          "departments with low admission rates overall, and men to " +
          "departments with high ones. Department is a **confounder**: it " +
          "affects both which group applies and the admission rate. Here you " +
          "**must** disaggregate. The trap is that the opposite is sometimes " +
          "true — if the grouping variable is a *consequence* of the treatment, " +
          "splitting on it introduces bias rather than removing it."
      },

      miss: [
        {
          w: "The paradox means you should always look at subgroups.",
          r: "It means you must decide **which** analysis answers your " +
            "question, and that decision is causal. If the grouping variable is " +
            "affected *by* the treatment — a **mediator** — conditioning on it " +
            "blocks part of the effect you were trying to measure and gives a " +
            "wrong answer. Neither *always aggregate* nor *always split* is " +
            "correct."
        },
        {
          w: "It is a statistical artefact or a mistake in the maths.",
          r: "Every number is correct. It is a genuine feature of weighted " +
            "averages: combining groups with different sizes and different " +
            "baseline rates can reverse a comparison. No error occurred."
        },
        {
          w: "Randomised experiments are immune.",
          r: "Randomisation removes confounding at the *design* stage, which is " +
            "why it is the gold standard. But post-hoc subgroup analysis, " +
            "differential dropout, or conditioning on a post-treatment variable " +
            "can reintroduce exactly the same reversal in an RCT."
        },
        {
          w: "It only matters in academic examples.",
          r: "It appears constantly in A/B testing. A variant can win on every " +
            "device type and lose overall, because the variant shifted the " +
            "device mix. Teams ship the wrong thing on the strength of an " +
            "aggregate number regularly."
        }
      ],

      trade: {
        buys: [
          "A concrete reason to distrust aggregate comparisons.",
          "Forces the causal question — what am I actually asking?",
          "Explains a large class of contradictory analyses.",
          "Makes the case for pre-registering the analysis plan."
        ],
        costs: [
          "Resolving it needs causal assumptions the data cannot supply.",
          "Invites endless subgroup slicing, which finds spurious effects.",
          "Small subgroups have wide confidence intervals of their own."
        ],
        avoid: [
          "You have a properly randomised experiment analysed as designed — " +
            "the aggregate is what you wanted.",
          "The grouping variable is a **mediator**; splitting on it biases the " +
            "estimate.",
          "Subgroups are too small to say anything with confidence.",
          "You are slicing after seeing the result — that is p-hacking, not " +
            "analysis."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kl-divergence",

      why: {
        before: "Comparing two probability distributions meant comparing " +
          "summary statistics — means, variances — which can be identical for " +
          "distributions of completely different shape.",
        problem: "You need a single number for *how different are these two " +
          "distributions*, and it should have a meaning rather than being an " +
          "arbitrary distance.",
        shift: "Ask an information-theoretic question: if I encode data drawn " +
          "from `P` using a code optimised for `Q`, how many **extra bits** do " +
          "I need? That quantity is the KL divergence. It is zero exactly when " +
          "the distributions match, and it grows as the mismatch costs you " +
          "more."
      },

      num: {
        t: "The two directions behave completely differently",
        h: ["Form", "Called", "Behaviour"],
        r: [
          ["`KL(P‖Q)`", "forward, mean-seeking", "**covers** all of P's mass"],
          ["`KL(Q‖P)`", "reverse, mode-seeking", "**collapses** onto one mode"]
        ],
        n: "Fit a single Gaussian to a two-peaked distribution and the " +
          "direction decides the answer. Forward KL is infinite wherever `P` " +
          "has mass and `Q` has none, so it **spreads out to cover both peaks** " +
          "— placing mass in the empty valley between them. Reverse KL is " +
          "penalised for putting mass where `P` has none, so it **picks one " +
          "peak** and ignores the other. This is why VAEs (reverse KL) produce " +
          "blurry-but-safe outputs, and why maximum likelihood (forward KL) " +
          "produces models that hedge. Cross-entropy loss *is* forward KL up to " +
          "a constant, which is why minimising it is minimising divergence " +
          "from the true distribution."
      },

      miss: [
        {
          w: "KL divergence is a distance between distributions.",
          r: "It is not a metric. It is **asymmetric** — `KL(P‖Q) ≠ KL(Q‖P)` — " +
            "and it violates the triangle inequality. Calling it a distance " +
            "leads directly to using the wrong direction. **Jensen-Shannon " +
            "divergence** is the symmetric version, and its square root is a " +
            "true metric."
        },
        {
          w: "The direction is a convention you can pick either way.",
          r: "It changes the answer qualitatively, as the table above shows. " +
            "*Which direction* is one of the most consequential decisions in " +
            "variational inference, and picking the wrong one gives you a model " +
            "that fails in a specific, predictable way."
        },
        {
          w: "KL divergence is always finite.",
          r: "It is **infinite** whenever `P` assigns probability to something " +
            "`Q` says is impossible. This is a practical problem, not a " +
            "theoretical curiosity: it is why you smooth distributions, add " +
            "epsilon, or use JS divergence when the supports may not overlap. " +
            "It is also why the original GAN objective was unstable."
        },
        {
          w: "Cross-entropy and KL divergence are different objectives.",
          r: "`CrossEntropy(P, Q) = Entropy(P) + KL(P‖Q)`, and the entropy of " +
            "the true labels is a constant with respect to your parameters. So " +
            "minimising cross-entropy **is** minimising forward KL. Every " +
            "classifier you have trained was minimising a KL divergence."
        }
      ],

      trade: {
        buys: [
          "A principled measure with a real interpretation in bits.",
          "The foundation of variational inference, VAEs and the ELBO.",
          "Its asymmetry is a feature — you choose the behaviour you want.",
          "Directly connected to cross-entropy and maximum likelihood."
        ],
        costs: [
          "Not a metric, so intuitions about distance mislead.",
          "Infinite when supports do not overlap.",
          "Hard to estimate from samples in high dimensions.",
          "The direction is easy to get wrong and the failure is silent."
        ],
        avoid: [
          "You need a symmetric measure — use **Jensen-Shannon**.",
          "Supports may not overlap — **Wasserstein** distance handles that " +
            "gracefully, which is why WGAN exists.",
          "You need a true metric satisfying the triangle inequality.",
          "You only have samples in high dimensions, where estimation is " +
            "unreliable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inductive-bias",

      why: {
        before: "Learning was framed as finding the pattern in the data, as " +
          "though the data alone determined the answer.",
        problem: "It does not. Infinitely many functions fit any finite set of " +
          "points exactly, and they disagree everywhere else. Without some " +
          "preference over which function to choose, generalisation is " +
          "**logically impossible** — this is Hume's problem of induction, and " +
          "the **No Free Lunch** theorem is its formal statement.",
        shift: "Accept that every learning algorithm must make assumptions, and " +
          "make them explicit. A CNN assumes nearby pixels are related and that " +
          "features are translation-invariant. An RNN assumes sequence order " +
          "matters. Those assumptions are what let it generalise — and what " +
          "make it wrong when they do not hold."
      },

      num: {
        t: "What each architecture assumes",
        h: ["Model", "Assumption", "Data needed"],
        r: [
          ["CNN", "locality, translation invariance", "low"],
          ["RNN", "sequential order, recency", "low"],
          ["GNN", "relational structure given by edges", "low"],
          ["Transformer", "**almost none**", "**high**"],
          ["Linear model", "linearity", "very low"]
        ],
        n: "This is the trade in one line: **weaker inductive bias needs more " +
          "data**. A Vision Transformer *underperforms* a comparable CNN on " +
          "ImageNet-scale data and *beats* it once pretrained on 300M+ images — " +
          "with enough data it learns locality rather than being told, and " +
          "having learned it can then exceed what was assumed. That is the " +
          "whole story of the last decade: as data and compute grew, weaker " +
          "priors won. The bitter lesson."
      },

      miss: [
        {
          w: "Inductive bias is a flaw to be minimised.",
          r: "Without it, learning is impossible — you cannot prefer one " +
            "fitting function over another. The question is never *how do I " +
            "remove bias* but *is my bias appropriate for this problem*. A " +
            "correct bias is worth an enormous amount of data."
        },
        {
          w: "Transformers have no inductive bias.",
          r: "They have **weaker** bias, not none. Self-attention is " +
            "permutation-equivariant, the residual stream encourages iterative " +
            "refinement, and positional encodings inject an assumption about " +
            "order. The claim is relative to CNNs and RNNs, not absolute."
        },
        {
          w: "More data always beats a better inductive bias.",
          r: "Only past a threshold that depends on the problem. In small-data " +
            "regimes — medicine, science, most business problems — a strong " +
            "appropriate prior beats a general model decisively. It is why " +
            "gradient boosting still dominates tabular data, where a " +
            "transformer has no useful structure to exploit."
        },
        {
          w: "Inductive bias is only about architecture.",
          r: "It is present in every choice: the loss function, the optimiser " +
            "(SGD's implicit bias toward flat minima), regularisation, data " +
            "augmentation (which asserts what transformations preserve the " +
            "label), and initialisation. Augmentation in particular is *pure* " +
            "inductive bias — you are stating an invariance you believe holds."
        }
      ],

      trade: {
        buys: [
          "Makes generalisation possible at all.",
          "Correct bias dramatically reduces the data required.",
          "Explains why architectures suit particular domains.",
          "A framework for choosing a model rather than guessing."
        ],
        costs: [
          "Wrong bias caps performance no matter how much data you add.",
          "Strong bias prevents learning patterns that violate it.",
          "The assumptions are often implicit and undocumented.",
          "Bias appropriate for training data may not hold in deployment."
        ],
        avoid: [
          "You have enormous data and compute — a weaker prior may find " +
            "better structure than you would impose.",
          "The domain is poorly understood and your assumptions are guesses.",
          "The bias is demonstrably wrong — a CNN on tabular data assumes a " +
            "locality that does not exist.",
          "You are comparing architectures without controlling for data " +
            "scale; the comparison is meaningless."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
