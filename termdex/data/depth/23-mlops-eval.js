/* ==========================================================================
   Depth pass 23 — LLM evaluation biases, serving stacks, and recommender
   architecture.

   The three judge-bias terms belong together and are worth reading as a set:
   they are the reason "use an LLM as a judge" is harder than it sounds.
   Each describes a systematic, measurable way an LLM judge produces a
   confident ranking that has nothing to do with quality — and each has a
   specific, cheap mitigation that most teams skip.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "position-bias",

      why: {
        before: "Evaluating two model outputs meant asking a human which was " +
          "better — slow and expensive, but the comparison itself was sound.",
        problem: "Using an LLM as the judge scales that cheaply, and " +
          "introduces an artefact: the judge **prefers whichever response it " +
          "sees first**, regardless of content. Swap the order and the same " +
          "pair of responses can produce the opposite verdict.",
        shift: "Recognise that a judge's output is a **generated token " +
          "sequence**, not a measurement. Attention over the prompt is not " +
          "positionally neutral, so ordering leaks into the verdict. The fix " +
          "is procedural rather than a better prompt: **evaluate both " +
          "orderings** and only count a result when they agree."
      },

      num: {
        t: "Mitigations",
        h: ["Method", "Cost", "Effect"],
        r: [
          ["**Swap and average both orders**", "**2× calls**", "**removes most of it**"],
          ["Swap, count only agreements", "2× calls", "removes it; some ties"],
          ["Prompt the judge to be neutral", "free", "**largely ineffective**"],
          ["Randomise order per sample", "free", "removes systematic bias, not variance"],
          ["Score each independently", "2× calls", "loses comparative signal"]
        ],
        n: "The MT-Bench and Chatbot Arena work quantified this: position bias " +
          "is **substantial and consistent** across judge models, and swapping " +
          "is the standard mitigation for good reason. The important practical " +
          "consequence is that **an evaluation harness that does not swap is " +
          "producing numbers you cannot trust** — and because the bias is " +
          "systematic rather than random, running more samples does not average " +
          "it out. Randomising the order per sample is better than nothing " +
          "(it removes the *systematic* direction) but leaves the variance in, " +
          "so you need more samples for the same confidence. Note the pattern " +
          "is not always *first wins* — some judges favour the last position — " +
          "so measure your specific judge rather than assuming."
      },

      miss: [
        {
          w: "Telling the judge to ignore position fixes it.",
          r: "It does not, reliably. The bias arises from how attention " +
            "processes the prompt, not from a stated intention the model can " +
            "choose to follow. Every published mitigation that works is " +
            "**procedural** — swap the order — rather than instructional."
        },
        {
          w: "Running more samples averages it out.",
          r: "Only for *random* noise. Position bias is **systematic** — it " +
            "leans the same direction every time — so a thousand samples give " +
            "you a precisely-estimated wrong answer. Systematic bias is removed " +
            "by design changes, not by sample size."
        },
        {
          w: "Only weak judge models have this problem.",
          r: "It has been measured across frontier models. Stronger judges are " +
            "somewhat less affected and are not immune. Assuming your judge is " +
            "above it, without measuring, is exactly how the bias enters your " +
            "results."
        },
        {
          w: "It only matters for pairwise comparison.",
          r: "It affects any evaluation where several items appear in one " +
            "prompt — ranking a list of candidates, choosing among retrieved " +
            "documents, selecting a best-of-n. Anywhere order exists in the " +
            "prompt, order can influence the answer."
        }
      ],

      trade: {
        buys: [
          "Knowing about it makes LLM-as-judge usable at all.",
          "Swapping is a cheap, complete-enough fix.",
          "Agreement rate between orderings is itself a useful confidence " +
            "signal.",
          "Applies to any multi-item prompt, not just evaluation."
        ],
        costs: [
          "Doubles evaluation cost and latency.",
          "Disagreements need a tie-breaking policy.",
          "More harness complexity."
        ],
        avoid: [
          "The judge scores each item independently with no comparison.",
          "You are using deterministic metrics — exact match, BLEU, test pass " +
            "rates.",
          "Human annotators are doing the judging, though they have their own " +
            "ordering effects.",
          "The evaluation is directional and rough rather than a reported " +
            "number."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "verbosity-bias",

      why: {
        before: "A judge was asked *which response is better?* — the natural " +
          "phrasing, and the one every evaluation harness starts with.",
        problem: "LLM judges systematically **prefer longer answers**, " +
          "independent of whether the extra length adds anything. A padded " +
          "response with restated premises and unnecessary caveats beats a " +
          "correct, concise one. Since models are themselves trained on such " +
          "judgements, this pressure **compounds through RLHF** — which is a " +
          "large part of why chat models became so verbose.",
        shift: "Treat length as a **confound to control for**, exactly as you " +
          "would in any experiment. Either constrain both responses to " +
          "comparable length, measure the length effect explicitly, or use a " +
          "rubric that scores dimensions where padding cannot help."
      },

      num: {
        t: "Controlling for it",
        h: ["Approach", "Effect", "Cost"],
        r: [
          ["**Length-controlled win rate**", "**removes most of it**", "statistical modelling"],
          ["Rubric scoring per dimension", "reduces it", "more tokens per judgement"],
          ["Constrain both to a length limit", "removes it", "changes the task"],
          ["Tell the judge to ignore length", "**weak**", "free"],
          ["Report length alongside score", "makes it visible", "free"]
        ],
        n: "**AlpacaEval 2.0's length-controlled win rate** is the standard " +
          "answer and worth knowing about: it fits a regression that separates " +
          "the length effect from the quality effect, and the reordering " +
          "against the raw metric was significant enough to change the " +
          "leaderboard. The cheapest thing any team can do is the last row — " +
          "**report mean response length alongside your quality score**. If a " +
          "model's win rate rose and its answers got 40% longer, you have " +
          "learned something important and free. The compounding through RLHF " +
          "is the deeper concern: verbosity bias in judges becomes verbosity in " +
          "models, which then becomes the training signal for the next " +
          "generation."
      },

      miss: [
        {
          w: "Longer answers are usually genuinely better.",
          r: "Sometimes, and the bias persists **after controlling for " +
            "quality** — that is what makes it a bias rather than a " +
            "correlation. Padding with restatement and hedging measurably " +
            "raises judged scores while adding nothing."
        },
        {
          w: "Instructing the judge to prefer concise answers fixes it.",
          r: "It shifts the bias rather than removing it, and can overcorrect " +
            "into penalising answers that genuinely need length. Statistical " +
            "control or dimension-specific rubrics are more reliable than " +
            "instruction."
        },
        {
          w: "This only affects leaderboards, not production evaluation.",
          r: "It affects **any** LLM-judged comparison, including your internal " +
            "A/B tests. A change that made outputs longer will look like a " +
            "quality improvement, and you will ship it."
        },
        {
          w: "Human evaluators do not have this bias.",
          r: "They do, though it is weaker and more context-dependent — " +
            "thoroughness reads as effort and competence. Human evaluation is " +
            "better here, not clean."
        }
      ],

      trade: {
        buys: [
          "Explains a large distortion in LLM-judged evaluation.",
          "Length-controlled metrics are available and validated.",
          "Reporting length alongside scores is free and revealing.",
          "Explains why chat models drifted toward verbosity."
        ],
        costs: [
          "Length-controlled metrics need statistical machinery.",
          "Rubrics cost more tokens per judgement.",
          "Constraining length changes what you are measuring.",
          "Some tasks genuinely reward longer answers, complicating " +
            "correction."
        ],
        avoid: [
          "Responses are naturally length-constrained — classification, " +
            "extraction.",
          "You are using deterministic metrics.",
          "Length is genuinely part of the quality you want.",
          "Human evaluation with explicit rubrics is available."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "self-preference-bias",

      why: {
        before: "Using a strong model as a judge seemed obviously reasonable — " +
          "it is capable, cheap relative to humans, and consistent.",
        problem: "A judge rates outputs **from its own family more highly** " +
          "than equivalent outputs from other models. If you evaluate your " +
          "GPT-based system with a GPT judge, the evaluation is not " +
          "independent — and the effect is invisible in the numbers, which " +
          "look perfectly reasonable.",
        shift: "Treat judge selection as a **conflict of interest** question. " +
          "The likely mechanism is stylistic familiarity — a model recognises " +
          "and favours its own distributional fingerprint — which means the " +
          "fix is a judge from a different family, or several judges from " +
          "different families."
      },

      num: {
        t: "Mitigations, in order of strength",
        h: ["Approach", "Independence", "Cost"],
        r: [
          ["**Judge from a different family**", "**good**", "another API"],
          ["Panel of judges, different families", "**best**", "n× calls"],
          ["Human spot-check calibration", "gold standard", "expensive"],
          ["Same-family judge", "**compromised**", "cheapest"],
          ["Ask the judge to be impartial", "**no effect**", "free"]
        ],
        n: "The failure mode is specific and easy to fall into: you build with " +
          "GPT-4, evaluate with GPT-4, and conclude your GPT-4 pipeline beats " +
          "the Claude alternative. The comparison is structurally unsound and " +
          "the number looks fine. A **panel** of judges from different families " +
          "with majority voting is the strongest practical answer, and it is " +
          "also more robust to position and verbosity bias, since those vary by " +
          "model. The cheapest useful discipline is **periodic human " +
          "calibration** — sample fifty judgements, have a person rate them, " +
          "and measure agreement. If judge-human agreement drifts, your " +
          "automated numbers have stopped meaning what you think."
      },

      miss: [
        {
          w: "Using the strongest available model as judge is the right choice.",
          r: "Capability is one criterion; **independence** is another. The " +
            "strongest model is the wrong judge if it is also the model under " +
            "test, or from the same family. A slightly weaker independent judge " +
            "gives a more trustworthy comparison."
        },
        {
          w: "It only matters when comparing models.",
          r: "It also affects **self-refinement** loops. A model critiquing and " +
            "revising its own output favours its own style, which is part of " +
            "why ungrounded self-reflection shows weaker gains than people " +
            "expect."
        },
        {
          w: "The bias is small enough to ignore.",
          r: "Reported effects are large enough to flip rankings between " +
            "closely-matched systems — which is exactly the case where you " +
            "needed the evaluation. It matters least when the gap is obvious " +
            "and most when the decision is close."
        },
        {
          w: "A prompt asking for impartiality helps.",
          r: "Like position and verbosity bias, this is not something the model " +
            "can choose to stop doing. The mechanism is stylistic preference " +
            "encoded in the weights. Only changing the judge changes the " +
            "outcome."
        }
      ],

      trade: {
        buys: [
          "Makes LLM-judged comparisons trustworthy.",
          "Judge panels also mitigate other biases.",
          "Human calibration gives an ongoing validity check.",
          "Cheap to avoid once you know to."
        ],
        costs: [
          "Multiple API providers to integrate and pay for.",
          "Panels multiply cost and latency.",
          "Human calibration is expensive.",
          "Different judges disagree, needing a resolution policy."
        ],
        avoid: [
          "You are using deterministic metrics.",
          "The comparison is between two variants of the same model, where " +
            "family preference applies equally.",
          "Humans are judging.",
          "The quality gap is large enough that bias cannot flip it — though " +
            "verify that assumption."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "two-tower-model",

      why: {
        before: "Recommending items meant scoring each candidate against the " +
          "user with a model that saw both together — accurate, and requiring " +
          "one forward pass **per item**.",
        problem: "With ten million items and a 100ms budget, that is " +
          "impossible. You cannot run ten million forward passes per request, " +
          "and you cannot precompute anything because the score depends on the " +
          "user-item **pair**.",
        shift: "**Separate the towers.** One encoder embeds the user, another " +
          "embeds the item, and relevance is their dot product. Because the " +
          "item tower does not see the user, **every item embedding can be " +
          "precomputed offline**. At request time you embed the user once and " +
          "do an approximate nearest-neighbour search."
      },

      num: {
        t: "Why the separation is necessary",
        h: ["Architecture", "Forward passes per request", "10M items"],
        r: [
          ["Cross-encoder", "**one per item**", "impossible"],
          ["**Two-tower**", "**one (user) + ANN search**", "**~10ms**"],
          ["Item embeddings", "precomputed nightly", "reused all day"]
        ],
        n: "This is the same **bi-encoder against cross-encoder** trade as in " +
          "text retrieval, and the same resolution: two-tower for retrieval, a " +
          "cross-encoder for **ranking** the shortlist. The cost of separation " +
          "is that the towers cannot model user-item **interactions** — a " +
          "cross-encoder can notice *this user likes long documentaries and " +
          "this is one*, while a dot product can only measure alignment in a " +
          "shared space. Two practical traps: **negative sampling** dominates " +
          "quality (training only on positives teaches nothing about what to " +
          "reject, and in-batch negatives are the standard trick), and " +
          "**embedding staleness** — if item embeddings are recomputed nightly " +
          "but the user tower is retrained more often, the two drift apart and " +
          "quality degrades silently."
      },

      miss: [
        {
          w: "Two-tower models are less accurate, so they are a compromise.",
          r: "They are the **retrieval** stage, not the final answer. The " +
            "standard architecture is two-tower to find 500 candidates from ten " +
            "million, then a cross-encoder to rank those 500. Neither replaces " +
            "the other."
        },
        {
          w: "You can add user-item interaction features to the towers.",
          r: "Doing so **breaks the architecture**. If the item tower needs the " +
            "user, item embeddings cannot be precomputed and you are back to " +
            "per-item inference. The strict separation is what makes it fast, " +
            "and it is not negotiable."
        },
        {
          w: "Training on observed positives is enough.",
          r: "Without negatives the model has no signal about what to rank " +
            "**down**. Negative sampling strategy — in-batch negatives, hard " +
            "negatives, popularity-corrected sampling — is one of the largest " +
            "levers on final quality, and getting it wrong is a common failure."
        },
        {
          w: "Item embeddings only need recomputing when items change.",
          r: "They must be recomputed whenever the **item tower** is retrained, " +
            "or the two towers occupy different spaces and the dot product " +
            "becomes meaningless. Coordinating retraining and re-embedding is " +
            "core operational work in these systems."
        }
      ],

      trade: {
        buys: [
          "Retrieval from millions of items in milliseconds.",
          "Item embeddings precomputed and reused.",
          "Works with standard ANN indexes.",
          "Scales to catalogue sizes cross-encoders cannot approach."
        ],
        costs: [
          "Cannot model user-item interactions.",
          "Negative sampling strategy is critical and easy to get wrong.",
          "Embedding staleness requires coordinated retraining.",
          "Needs a reranking stage for final quality."
        ],
        avoid: [
          "The catalogue is small enough to score exhaustively.",
          "User-item interaction features are essential and cannot be deferred " +
            "to reranking.",
          "You cannot operate the offline embedding pipeline.",
          "Items change constantly, making precomputation impractical."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "train-serve-skew",

      why: {
        before: "A model was validated offline, scored well, and was deployed. " +
          "Serving code was written separately, by whoever owned the " +
          "application.",
        problem: "The two paths compute features **differently**, and nothing " +
          "detects it. Training used pandas over a historical table; serving " +
          "uses application code over a request payload. A null filled with the " +
          "mean in one and with zero in the other, a rolling window that is " +
          "inclusive in one and exclusive in the other, a timezone difference — " +
          "and the model sees inputs it was never trained on. There is **no " +
          "error**, only quietly worse predictions.",
        shift: "Treat feature computation as something that must be " +
          "**identical**, and prove it. Share the code path, or log serving " +
          "features and compare their distributions against training " +
          "continuously."
      },

      num: {
        t: "Where skew comes from",
        h: ["Source", "Example", "Detection"],
        r: [
          ["Different implementations", "pandas vs application code", "**compare logged features**"],
          ["**Time-travel leakage**", "training used future data", "point-in-time joins"],
          ["Different defaults", "null → mean vs null → 0", "distribution comparison"],
          ["Version drift", "library upgrade changes rounding", "pin and test"],
          ["Distribution shift", "the world changed", "drift monitoring"]
        ],
        n: "The single most effective detection method is unglamorous: **log " +
          "the exact feature vector at serving time and compare its " +
          "distribution against the training set**. Most teams monitor " +
          "predictions and accuracy, neither of which localises the problem — " +
          "feature-level comparison points at the specific column that broke. " +
          "The **time-travel** row is the most damaging variant because it " +
          "inflates offline metrics: training on *total lifetime spend* " +
          "computed today leaks the future into every historical row, so the " +
          "model looks excellent offline and fails in production where that " +
          "information does not exist yet. That is what point-in-time correct " +
          "joins and feature stores exist to prevent."
      },

      miss: [
        {
          w: "Good offline validation catches this.",
          r: "It cannot, by definition — offline validation uses the **training** " +
            "feature pipeline. The whole problem is that serving uses a " +
            "different one. Only comparing the two paths, or comparing logged " +
            "serving features against training, can detect it."
        },
        {
          w: "A feature store eliminates it.",
          r: "It eliminates the *different implementations* row, which is the " +
            "largest single source. Distribution shift, version drift and " +
            "upstream data changes remain entirely. It closes one important " +
            "door of several."
        },
        {
          w: "The model will be robust to small differences.",
          r: "Sometimes, and tree models in particular are sensitive to exact " +
            "split boundaries — a feature scaled slightly differently can cross " +
            "thresholds and change predictions substantially. Robustness is not " +
            "something to assume."
        },
        {
          w: "Monitoring accuracy in production will reveal it.",
          r: "Only where labels arrive quickly, which is often weeks later or " +
            "never. And accuracy tells you *something* is wrong, not *what*. " +
            "Feature-level monitoring is both earlier and more actionable."
        }
      ],

      trade: {
        buys: [
          "Naming it makes a silent failure class visible.",
          "Feature logging and comparison is cheap and effective.",
          "Shared feature code removes the largest source.",
          "Points at the specific broken feature rather than a vague " +
            "degradation."
        ],
        costs: [
          "Logging serving features adds storage and pipeline work.",
          "Distribution comparison needs thresholds and produces false alarms.",
          "Sharing code across batch and online paths constrains both.",
          "Feature stores are substantial infrastructure."
        ],
        avoid: [
          "Training and serving genuinely share one code path already.",
          "The model is retrained on production-logged features, which closes " +
            "the loop.",
          "It is batch scoring using the same pipeline as training.",
          "Features come directly from the request with no transformation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pipeline-parallelism",

      why: {
        before: "**Data parallelism** replicates the model on every GPU, and " +
          "**tensor parallelism** splits individual matrices across GPUs " +
          "within a node.",
        problem: "Neither covers the case where a model is too deep for one " +
          "node. Data parallelism needs the whole model per GPU. Tensor " +
          "parallelism communicates twice per layer, so it collapses across " +
          "nodes where interconnect is slower.",
        shift: "Split by **layer**. GPU 0 holds layers 1–10, GPU 1 holds 11–20, " +
          "and activations pass between them at stage boundaries. " +
          "Communication happens only at those boundaries — a few times per " +
          "forward pass rather than per layer — which is exactly what makes it " +
          "viable **across nodes**."
      },

      num: {
        t: "The bubble problem",
        h: ["Micro-batches", "Stages", "Bubble fraction", "Efficiency"],
        r: [
          ["1", "4", "**75%**", "terrible"],
          ["4", "4", "43%", "poor"],
          ["16", "4", "**16%**", "acceptable"],
          ["64", "4", "**4.5%**", "good"]
        ],
        n: "The **bubble** is the core inefficiency: with a naive schedule, " +
          "GPU 1 sits idle waiting for GPU 0's output, and at the end GPU 0 " +
          "idles waiting for the backward pass to come back. Bubble fraction is " +
          "roughly `(stages − 1) / (micro-batches + stages − 1)`, so the fix is " +
          "**many micro-batches** — split the batch into small pieces and keep " +
          "the pipeline full, exactly as a CPU instruction pipeline does. " +
          "**1F1B** (one-forward-one-backward) scheduling further reduces peak " +
          "activation memory by interleaving. In practice pipeline parallelism " +
          "is the **across-node** dimension of 3D parallelism: tensor parallel " +
          "inside a node, pipeline across nodes, data parallel across replicas."
      },

      miss: [
        {
          w: "Pipeline parallelism speeds up training.",
          r: "It makes very large models **fit**. Bubbles mean per-GPU " +
            "efficiency is *lower* than data parallelism. You use it when the " +
            "model cannot fit any other way, not to go faster."
        },
        {
          w: "More stages means better scaling.",
          r: "More stages means a **larger bubble** for a given micro-batch " +
            "count, and more inter-stage communication. Stage count is chosen " +
            "to make the model fit, then micro-batches are increased to hide " +
            "the resulting bubble."
        },
        {
          w: "You can split the model anywhere.",
          r: "Stages should be **balanced in compute and memory**, or the " +
            "slowest stage sets the pace for everything. Transformers make this " +
            "easier since layers are uniform, and embedding and output layers " +
            "are often disproportionately large, which needs care."
        },
        {
          w: "It is an alternative to FSDP.",
          r: "They are usually **combined**. FSDP/ZeRO shards parameters within " +
            "a data-parallel group; pipeline parallelism splits layers across " +
            "nodes. Frontier-scale training uses tensor, pipeline and data " +
            "parallelism together."
        }
      ],

      trade: {
        buys: [
          "Trains models far deeper than one node can hold.",
          "Communication only at stage boundaries — viable across nodes.",
          "Composes with tensor and data parallelism.",
          "Memory per GPU scales down with stage count."
        ],
        costs: [
          "Pipeline bubbles waste GPU time.",
          "Needs many micro-batches to be efficient.",
          "Stages must be balanced or the slowest dominates.",
          "Complex scheduling — 1F1B, interleaving.",
          "Debugging spans machines."
        ],
        avoid: [
          "The model fits with FSDP — simpler and no bubbles.",
          "The batch cannot be split into enough micro-batches.",
          "You have one node — tensor parallelism communicates more but has no " +
            "bubble.",
          "Stages cannot be balanced, as in a very heterogeneous architecture."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prompt-compression",

      why: {
        before: "Longer prompts improved results — more examples, more " +
          "retrieved context, more instructions. The obvious move was to add " +
          "more.",
        problem: "Cost and latency scale with input length, and prefill is " +
          "`O(n²)` in attention. A 32,000-token prompt is expensive on every " +
          "call and slow before a single output token appears. Worse, models " +
          "exhibit **lost in the middle** — information in the centre of a long " +
          "context is attended to less reliably than at either end, so more " +
          "context does not monotonically improve results.",
        shift: "Remove what the model does not need. Either **filter** — drop " +
          "low-information tokens or sentences by a measure of surprisal — or " +
          "**abstract**, summarising context into fewer tokens. Both accept " +
          "some information loss in exchange for cost and latency."
      },

      num: {
        t: "Approaches",
        h: ["Method", "Compression", "Risk"],
        r: [
          ["**LLMLingua-style filtering**", "**2–20×**", "drops something needed"],
          ["Summarise with a small model", "5–10×", "summariser hallucinates"],
          ["Better retrieval (fewer chunks)", "varies", "**usually the right first move**"],
          ["Prefix caching", "**no loss**", "requires shared prefixes"],
          ["Remove few-shot examples", "large", "quality drop"]
        ],
        n: "The third and fourth rows are the honest advice: **most prompts " +
          "are long because retrieval is imprecise**, and fixing retrieval " +
          "reduces tokens with **no information loss at all**. Similarly, " +
          "**prefix caching** cuts the cost of a long prompt without removing " +
          "anything. Compression is what you reach for after those. When you " +
          "do, the failure mode is specific and severe: the compressor cannot " +
          "know which detail the model will need, so it drops a number, a " +
          "negation or a qualifier and the answer is confidently wrong with no " +
          "signal that anything was lost."
      },

      miss: [
        {
          w: "Compression is lossless if the summary captures the meaning.",
          r: "It is **lossy by construction**. Compressing 10,000 tokens to " +
            "1,000 discards information, and the compressor decides what " +
            "without knowing the question that will be asked. For " +
            "detail-sensitive queries this is exactly the wrong trade."
        },
        {
          w: "You should compress before sending to save money.",
          r: "Check the cheaper options first: **better retrieval** removes " +
            "tokens with no loss, and **prefix caching** cuts cost with no " +
            "loss. Compression is the option that trades quality, so it should " +
            "not be the first one tried."
        },
        {
          w: "A compressed prompt that scores well on benchmarks is safe.",
          r: "Compression failures are **query-dependent**. Aggregate benchmark " +
            "scores hide the specific queries whose needed detail was dropped. " +
            "The distribution of failures matters more than the mean."
        },
        {
          w: "Using a small model to compress is cheap.",
          r: "It adds a model call and latency on the request path, and " +
            "introduces a second place hallucination can occur. If the " +
            "summariser invents a detail, the main model treats it as source " +
            "material."
        }
      ],

      trade: {
        buys: [
          "Substantially lower token cost and prefill latency.",
          "Fits more into a limited context window.",
          "Can mitigate lost-in-the-middle by removing filler.",
          "Filtering methods need no extra model at inference."
        ],
        costs: [
          "Lossy — dropped detail causes confident wrong answers.",
          "Failures are query-dependent and hidden by aggregate metrics.",
          "Summarisation adds a call, latency and a hallucination surface.",
          "Another component to evaluate and monitor."
        ],
        avoid: [
          "Better retrieval would shorten the prompt losslessly — try that " +
            "first.",
          "Prefix caching applies — it cuts cost with no loss.",
          "The task needs exact detail: legal, medical, financial.",
          "The prompt is already short enough that the saving is marginal."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "swe-bench",

      why: {
        before: "Code benchmarks were **function-level**: HumanEval and MBPP " +
          "give a docstring and ask for a self-contained function, checked " +
          "against unit tests.",
        problem: "Models reached very high scores on those while remaining " +
          "unable to work in a real repository. Writing an isolated function is " +
          "not software engineering — the actual work is **locating** the " +
          "relevant code in a large codebase, understanding existing " +
          "conventions, and making a change that does not break anything else.",
        shift: "Use real work as the benchmark. Take **actual GitHub issues** " +
          "from real Python repositories, give the model the repository at the " +
          "commit before the fix, and check whether the **project's own tests** " +
          "pass afterwards. The task is now end-to-end and the grader is the " +
          "repository's existing test suite."
      },

      num: {
        t: "Why scores jumped so fast",
        h: ["Variant", "Nature", "Note"],
        r: [
          ["SWE-bench (full)", "2,294 issues, 12 repos", "the original"],
          ["**SWE-bench Verified**", "**500 human-validated**", "**the one to quote**"],
          ["SWE-bench Lite", "300 simpler issues", "cheaper to run"],
          ["Progress 2023 → 2025", "~2% → **70%+**", "on Verified"]
        ],
        n: "**SWE-bench Verified** exists because the original had real " +
          "problems: some issues were **unsolvable** from the information " +
          "given, some tests were broken or environment-dependent, and some " +
          "issue descriptions leaked the solution. OpenAI worked with human " +
          "annotators to filter 500 genuinely solvable, fairly-tested " +
          "instances. Quoting an unqualified *SWE-bench score* is therefore " +
          "ambiguous — always check which variant. The rise from roughly 2% to " +
          "over 70% in two years is genuine and is also partly attributable to " +
          "**scaffolding**: the agent framework doing the file navigation, test " +
          "running and retry logic contributes substantially, so the number " +
          "measures the *system*, not the model alone."
      },

      miss: [
        {
          w: "A high SWE-bench score means the model can do software " +
            "engineering.",
          r: "It means it can resolve **bug-fix-shaped issues in Python " +
            "repositories that have good test coverage**. It does not measure " +
            "design, architecture, working from an ambiguous requirement, or " +
            "any language other than Python."
        },
        {
          w: "The scores are directly comparable across published results.",
          r: "Only within the same variant, and even then **scaffolding " +
            "differs**. A result from a strong agent framework with a weaker " +
            "model can beat a stronger model in a naive harness. The benchmark " +
            "evaluates the whole system."
        },
        {
          w: "Passing tests means the fix is correct.",
          r: "It means it passes **those** tests. A model can produce a change " +
            "that satisfies the test and is wrong in ways the test does not " +
            "check — over-fitting to the assertion rather than fixing the " +
            "underlying issue. This is a known limitation of test-based " +
            "grading."
        },
        {
          w: "Contamination is not a concern since these are real repositories.",
          r: "It is a **significant** concern precisely because they are public " +
            "— the issues, discussions and eventual fixes are all in training " +
            "data. This is a large part of why date-filtered and continuously " +
            "refreshed variants keep appearing."
        }
      ],

      trade: {
        buys: [
          "Far more realistic than function-level benchmarks.",
          "Objective grading via the repository's own tests.",
          "Drove real progress in coding agents.",
          "Verified subset addresses the original's fairness problems."
        ],
        costs: [
          "Python-only, bug-fix-shaped tasks.",
          "Measures the scaffolding as much as the model.",
          "Contamination risk from public repositories.",
          "Expensive to run — a full repository environment per instance.",
          "Test-passing is a proxy for correctness."
        ],
        avoid: [
          "Judging general coding ability — it is narrow.",
          "Comparing models across different scaffolds.",
          "Evaluating design or architectural work.",
          "Non-Python work — the benchmark says nothing about it."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
