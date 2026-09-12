/* ==========================================================================
   Depth pass 46 — measuring a retrieval-augmented system.

   "The RAG isn't working" is not a diagnosis. A wrong answer has two
   completely different causes with completely different fixes: retrieval
   failed to find the information, or generation failed to use what it was
   given. Every metric here exists to separate those two, because tuning the
   wrong half is the most common way teams waste weeks.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "context-recall",

      why: {
        before: "RAG systems were judged by looking at final answers. If the " +
          "answer was wrong, the prompt was rewritten or a bigger model was " +
          "tried.",
        problem: "That treats two unrelated failures as one. If retrieval " +
          "never returned the necessary passage, **no prompt and no model can " +
          "fix it** — the information was not in the context window. Weeks get " +
          "spent tuning generation for a retrieval bug.",
        shift: "**Measure whether retrieval returned everything the answer " +
          "needed.** Context recall asks: of the facts required by the " +
          "ground-truth answer, what fraction is present in the retrieved " +
          "context? It is the **ceiling on the whole system** — generation can " +
          "never exceed what retrieval supplied, so this is the first number " +
          "to look at when answers are wrong."
      },

      num: {
        t: "Diagnosing from the metric pair",
        h: ["Context recall", "Faithfulness", "Diagnosis"],
        r: [
          ["**low**", "high", "**retrieval failed — fix chunking, embeddings, k**"],
          ["high", "**low**", "**generation ignores context — fix the prompt or model**"],
          ["**low**", "**low**", "**fix retrieval first — the other is unmeasurable**"],
          ["high", "high", "**working — look at precision and cost**"]
        ],
        n: "This table is the reason to measure recall separately at all: the " +
          "same wrong answer maps to opposite fixes depending on which row you " +
          "are in. **Always fix retrieval first** — faithfulness measured " +
          "against context that lacks the answer tells you nothing useful. " +
          "Computing recall requires **ground-truth answers**, which is the " +
          "real cost: someone must write, for a representative set of " +
          "questions, what a correct answer contains. Fifty carefully chosen " +
          "questions covering the failure modes you actually see beats five " +
          "hundred generic ones. The common causes of low recall are worth " +
          "knowing in order: **chunks too small** to contain a complete fact, " +
          "**chunk boundaries splitting** the answer across two pieces, " +
          "**embedding mismatch** between question and document vocabulary, " +
          "and **`k` too low**. Raising `k` is the cheapest first experiment — " +
          "if recall does not improve, the problem is upstream in chunking or " +
          "embeddings."
      },

      miss: [
        {
          w: "Context recall measures whether the answer was correct.",
          r: "It measures whether the **information needed** was retrieved. " +
            "Recall can be perfect while the answer is wrong, because " +
            "generation ignored or misused the context. That is what " +
            "**faithfulness** measures."
        },
        {
          w: "Retrieving more documents always improves recall.",
          r: "It usually does, and it **lowers precision** and adds cost and " +
            "latency. More context also risks the *lost in the middle* effect, " +
            "where models attend less to material in the centre of a long " +
            "context. Raise `k` deliberately, not reflexively."
        },
        {
          w: "You can compute it without ground truth.",
          r: "You need to know **what the answer requires** in order to check " +
            "whether it was retrieved. That means annotated reference answers. " +
            "An LLM judge can automate the comparison; it cannot invent the " +
            "reference."
        },
        {
          w: "Perfect context recall means the system works.",
          r: "It means retrieval is not the bottleneck. Generation can still " +
            "hallucinate, contradict the context, or bury the answer. Recall " +
            "sets the **ceiling**; faithfulness and answer relevance measure " +
            "how much of it is realised."
        }
      ],

      trade: {
        buys: [
          "Separates retrieval failures from generation failures.",
          "Establishes the system's achievable ceiling.",
          "Directly actionable — points at chunking, embeddings or `k`.",
          "Comparable across retrieval configuration changes.",
          "Prevents wasted effort tuning the wrong half."
        ],
        costs: [
          "Requires ground-truth answers, which are expensive to write.",
          "LLM-based scoring is itself noisy and costs money.",
          "Says nothing about precision or answer quality.",
          "Sensitive to how facts are decomposed for counting."
        ],
        avoid: [
          "There is no retrieval step — the metric does not apply.",
          "You cannot produce reference answers.",
          "The failures are clearly generation-side and already diagnosed.",
          "The corpus is tiny enough to fit entirely in context."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "context-precision",

      why: {
        before: "Once recall was measured, the obvious response to any gap was " +
          "to retrieve more — raise `k` from 5 to 20 and the needed passage is " +
          "far more likely to be present.",
        problem: "That trades one problem for another. Twenty chunks means " +
          "mostly irrelevant text: cost rises, latency rises, and the model " +
          "must locate the signal inside noise. Worse, the *lost in the " +
          "middle* effect means information placed in the centre of a long " +
          "context is attended to less reliably than material at either end.",
        shift: "**Measure how much of what was retrieved was actually " +
          "relevant, and whether the relevant items ranked highly.** Precision " +
          "is the counterweight to recall, and the rank-awareness matters: " +
          "relevant material at position 1 is far more useful than the same " +
          "material at position 20."
      },

      num: {
        t: "The recall/precision trade as k grows",
        h: ["k", "Recall", "Precision", "Cost & latency"],
        r: [
          ["**3**", "**may miss**", "**high**", "**low**"],
          ["5", "usually good", "good", "low"],
          ["**10**", "**high**", "**falling**", "moderate"],
          ["**20**", "**marginal gain**", "**low**", "**high + lost-in-middle**"],
          ["**Reranked 20 → 5**", "**high**", "**high**", "**moderate**"]
        ],
        n: "The **last row is the resolution** of the whole trade and the " +
          "reason reranking exists: retrieve widely to capture recall, then " +
          "**rerank and keep only the top few** to restore precision. You get " +
          "both, paying only for the reranker. Without that step you are " +
          "choosing one at the expense of the other. Precision is also the " +
          "metric that most directly tracks **cost**, since irrelevant chunks " +
          "are tokens paid for on every request. Note the rank-aware framing " +
          "matters: two systems can retrieve the same five relevant documents " +
          "out of twenty and differ enormously in usefulness depending on " +
          "whether those five are ranked 1–5 or 16–20, which is why " +
          "**context precision weights by position** rather than simply " +
          "counting."
      },

      miss: [
        {
          w: "Precision matters less than recall, since the model can ignore " +
            "noise.",
          r: "Models are **measurably degraded** by irrelevant context. The " +
            "*lost in the middle* finding shows accuracy drops when relevant " +
            "information sits in the centre of a long context. Noise is not " +
            "free."
        },
        {
          w: "You should maximise both metrics.",
          r: "They **trade off against each other** through `k`. The way to " +
            "get both is architectural — **retrieve widely, then rerank " +
            "narrowly** — not by tuning `k` to a compromise value that " +
            "satisfies neither."
        },
        {
          w: "Precision is just the fraction of retrieved chunks that are " +
            "relevant.",
          r: "Context precision as used in RAG evaluation is **rank-aware**. " +
            "Relevant chunks ranked highly score better than the same chunks " +
            "ranked low, because position affects how well the model uses " +
            "them."
        },
        {
          w: "Low precision is acceptable if context windows are large.",
          r: "Large windows remove the hard limit and not the cost or the " +
            "attention dilution. You still pay per token, latency still rises, " +
            "and accuracy on the buried material still degrades. Window size " +
            "is not a substitute for precision."
        }
      ],

      trade: {
        buys: [
          "Quantifies the cost of over-retrieval.",
          "Rank-aware — rewards putting the best material first.",
          "Tracks token cost and latency directly.",
          "Justifies adding a reranker with a measurable number.",
          "Balances recall so `k` is not raised blindly."
        ],
        costs: [
          "Requires relevance judgements per chunk.",
          "Trades off against recall.",
          "LLM-judged relevance is noisy at the margin.",
          "Says nothing about whether the answer was correct."
        ],
        avoid: [
          "Recall is the current bottleneck — fix that first.",
          "`k` is already small and cost is not a concern.",
          "You have no way to judge chunk relevance.",
          "The pipeline has no ranking step to improve."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "faithfulness",

      why: {
        before: "RAG was adopted largely to reduce hallucination: give the " +
          "model source documents and it will answer from them rather than " +
          "from memory.",
        problem: "It does not automatically do that. Models **blend** " +
          "retrieved context with parametric knowledge, add plausible " +
          "connecting detail, and produce confident claims the sources never " +
          "made. The answer looks grounded and cites real documents while " +
          "containing assertions those documents do not support — which is " +
          "**more** dangerous than an obviously wrong answer, because it " +
          "carries the appearance of sourcing.",
        shift: "**Check every claim in the answer against the retrieved " +
          "context.** Decompose the answer into individual factual claims and " +
          "verify each is supported. Faithfulness is the fraction that are. It " +
          "measures grounding specifically — **not** correctness, and the " +
          "distinction is the whole point."
      },

      num: {
        t: "Faithfulness against correctness",
        h: ["Answer", "Faithful?", "Correct?", "Meaning"],
        r: [
          ["Supported by context, true", "**yes**", "**yes**", "**working**"],
          ["**Supported, but source is wrong**", "**yes**", "**no**", "**data quality problem**"],
          ["**True, not in the context**", "**no**", "**yes**", "**model used memory — lucky**"],
          ["Neither", "no", "no", "hallucination"]
        ],
        n: "**Row three is the important one.** A model answering correctly " +
          "from parametric memory rather than from the retrieved context looks " +
          "like success and is a **latent failure** — it will produce the same " +
          "confident tone when its memory is outdated or wrong, and your " +
          "retrieval is doing nothing. Faithfulness catches this where an " +
          "accuracy metric cannot. Row two matters for a different reason: a " +
          "perfectly faithful answer to a wrong document is wrong, so " +
          "faithfulness measures the pipeline, not the truth of the corpus. " +
          "In practice, the measurement is done by an **LLM judge** " +
          "decomposing the answer into atomic claims and checking each against " +
          "the context — which is why claim decomposition granularity affects " +
          "the score, and why the same answer can score differently across " +
          "evaluation runs. The most effective interventions when faithfulness " +
          "is low are **explicit instructions to answer only from context and " +
          "say when the answer is absent**, and **requiring inline citations**, " +
          "which makes unsupported claims visible."
      },

      miss: [
        {
          w: "Faithfulness measures whether the answer is correct.",
          r: "It measures whether claims are **supported by the retrieved " +
            "context**. A faithful answer to a wrong document is faithful and " +
            "wrong. Correctness additionally requires the sources themselves " +
            "to be right."
        },
        {
          w: "A correct answer is a good outcome regardless of grounding.",
          r: "An answer correct **from memory rather than context** means " +
            "retrieval contributed nothing, and the same behaviour will " +
            "produce confident errors when memory is outdated. It is a latent " +
            "failure that only faithfulness detects."
        },
        {
          w: "RAG prevents hallucination.",
          r: "It **reduces** it and does not prevent it. Models add plausible " +
            "connective detail and blend parametric knowledge with context. " +
            "Measuring faithfulness is how you find out how much, and the " +
            "figure is rarely 100%."
        },
        {
          w: "Faithfulness scores are objective.",
          r: "They are usually produced by an **LLM judge**, so they depend on " +
            "the judge model, the prompt and how finely claims are " +
            "decomposed. Use them as a **relative** signal across " +
            "configurations, not as an absolute truth."
        }
      ],

      trade: {
        buys: [
          "Detects hallucination that looks well-sourced.",
          "Catches correct-from-memory answers that mask retrieval failure.",
          "Directly actionable via prompt changes and citation requirements.",
          "Independent of retrieval quality — isolates generation.",
          "Automatable with an LLM judge."
        ],
        costs: [
          "Requires an LLM judge — cost and latency per evaluation.",
          "Judge-dependent and noisy at the margins.",
          "Sensitive to claim decomposition granularity.",
          "Does not measure correctness of the sources.",
          "Can penalise reasonable inference from context."
        ],
        avoid: [
          "Context recall is low — the measurement is meaningless.",
          "The task is creative rather than factual.",
          "You have no judge model or budget for one.",
          "The sources themselves are unreliable — fix data quality first."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "recall-k",

      why: {
        before: "Retrieval quality was assessed by looking at results and " +
          "judging whether they seemed reasonable. That does not scale and is " +
          "not comparable across changes.",
        problem: "Changing an embedding model, chunk size or `k` needs a " +
          "**number** to compare against, and the number must reflect what " +
          "matters downstream: since only the top `k` results enter the " +
          "prompt, anything ranked below `k` is invisible to the model no " +
          "matter how good the ranking is beyond that point.",
        shift: "**Measure the fraction of relevant documents that appear in " +
          "the top `k`.** Recall@k is the standard retrieval metric because " +
          "`k` is exactly the number of chunks the pipeline forwards. It is " +
          "cheap to compute, needs no LLM judge, and gives a direct answer to " +
          "*did retrieval put the right material where the model can see it?*"
      },

      num: {
        t: "Retrieval metrics and what each captures",
        h: ["Metric", "Captures", "Rank-aware?"],
        r: [
          ["**Recall@k**", "**did relevant docs make the cut**", "**no**"],
          ["Precision@k", "how much of the top k is relevant", "no"],
          ["**MRR**", "**how high the first correct result ranks**", "**yes**"],
          ["**NDCG**", "**graded relevance, position-discounted**", "**yes**"],
          ["Hit rate@k", "**was there at least one**", "no"]
        ],
        n: "Recall@k is **not rank-aware**, which is its main limitation and " +
          "sometimes exactly right. A relevant document at position 1 and the " +
          "same document at position 10 score identically at `k = 10`. For a " +
          "RAG pipeline that forwards all ten chunks to the model, that is " +
          "arguably correct — position within the prompt matters less than " +
          "presence. For a search results page where users read from the top, " +
          "it is clearly wrong, and **MRR** or **NDCG** are the right choices. " +
          "The practical guidance is to **evaluate at the `k` you actually " +
          "use**: reporting recall@100 for a pipeline that forwards 5 chunks " +
          "describes a system you are not running. And when a reranker is " +
          "involved, measure recall at the **retriever's** `k` and precision " +
          "after the **reranker's** cut, because those are the two stages doing " +
          "different jobs."
      },

      miss: [
        {
          w: "Higher recall@k always means better retrieval.",
          r: "Recall rises monotonically with `k` — recall@100 is trivially " +
            "high and meaningless if you forward 5 chunks. Compare at a " +
            "**fixed `k` matching production**, or the number describes " +
            "nothing real."
        },
        {
          w: "Recall@k accounts for ranking quality.",
          r: "It is **not rank-aware**: position 1 and position `k` count " +
            "equally. If ranking order matters — a results page, or a " +
            "reranker's output — use **MRR** or **NDCG** instead."
        },
        {
          w: "It needs LLM-judged relevance.",
          r: "It needs **labelled relevant documents**, which can come from " +
            "click logs, human annotation, or synthetic question-answer pairs " +
            "generated from your own corpus. It is far cheaper than " +
            "LLM-judged metrics and runs in CI."
        },
        {
          w: "Good recall@k means the RAG system works.",
          r: "It means retrieval is doing its job. Generation can still ignore " +
            "the context or hallucinate. Recall@k is the **retrieval half** of " +
            "the picture; faithfulness and answer relevance cover the rest."
        }
      ],

      trade: {
        buys: [
          "Cheap and fast — no LLM judge needed.",
          "Directly matches what the pipeline forwards.",
          "Comparable across embedding and chunking changes.",
          "Runs in CI to catch retrieval regressions.",
          "Well understood, with standard tooling."
        ],
        costs: [
          "Requires labelled relevance judgements.",
          "Not rank-aware.",
          "Trivially inflated by raising `k`.",
          "Says nothing about generation quality.",
          "Binary relevance ignores degrees of usefulness."
        ],
        avoid: [
          "Ranking order matters — use **MRR** or **NDCG**.",
          "Relevance is graded rather than binary — NDCG.",
          "You have no labelled data and cannot generate it.",
          "The bottleneck is generation, not retrieval."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mean-reciprocal-rank",

      why: {
        before: "Recall@k answers *was a relevant document in the top k?* — a " +
          "binary question that ignores where in those `k` it landed.",
        problem: "Position matters enormously in some contexts. A search " +
          "engine returning the right answer at rank 1 and one returning it at " +
          "rank 10 are very different products, and recall@10 scores them " +
          "identically. Users read from the top and stop early.",
        shift: "**Score by the reciprocal of the first correct result's " +
          "rank**, averaged over queries. Rank 1 scores 1.0, rank 2 scores " +
          "0.5, rank 5 scores 0.2. The steep decay encodes the empirical " +
          "reality that users rarely look past the first few results, and the " +
          "metric rewards getting the answer to the top rather than merely " +
          "including it somewhere."
      },

      num: {
        t: "How steeply MRR decays",
        h: ["First correct at rank", "Score", "Interpretation"],
        r: [
          ["**1**", "**1.00**", "**perfect**"],
          ["2", "0.50", "**half credit already**"],
          ["3", "0.33", "noticeably worse"],
          ["5", "0.20", "poor"],
          ["10", "**0.10**", "**barely counts**"],
          ["**Not found**", "**0**", "**total failure**"]
        ],
        n: "The **rank-2 row** shows how aggressive the decay is: one position " +
          "down costs half the score. That is a deliberate model of user " +
          "behaviour and it makes MRR the right metric for **navigational** " +
          "queries where one correct answer exists — a specific document, a " +
          "question with a single source. It is the **wrong** metric when " +
          "several documents are genuinely relevant, because it looks only at " +
          "the **first** correct hit and ignores everything after it: a system " +
          "returning one relevant document and a system returning ten score " +
          "identically if both put the first at rank 1. For multi-relevant " +
          "cases use **NDCG**, which considers every relevant result with a " +
          "position discount and supports graded relevance. For a RAG pipeline " +
          "forwarding `k` chunks, **recall@k usually matters more than MRR**, " +
          "since all `k` reach the model regardless of order — MRR earns its " +
          "place when a reranker's top result drives the answer."
      },

      miss: [
        {
          w: "MRR measures overall ranking quality.",
          r: "It measures **only the position of the first correct result**. " +
            "Everything after it is ignored, so a system returning one " +
            "relevant document scores the same as one returning ten, provided " +
            "the first is in the same place."
        },
        {
          w: "It works well when several documents are relevant.",
          r: "It does not — that is exactly its blind spot. Use **NDCG** or " +
            "**MAP**, which account for every relevant result and support " +
            "graded relevance."
        },
        {
          w: "An MRR of 0.5 means half the queries succeeded.",
          r: "It means the **average reciprocal rank** is 0.5 — consistent " +
            "with every query returning its answer at rank 2, or half at rank " +
            "1 and half failing entirely. The distribution matters and the " +
            "mean hides it."
        },
        {
          w: "MRR is the right primary metric for RAG.",
          r: "For a pipeline forwarding `k` chunks, **recall@k** usually " +
            "matters more — all `k` reach the model whatever their order. MRR " +
            "is appropriate when the top result specifically drives the " +
            "outcome, such as after a reranker."
        }
      ],

      trade: {
        buys: [
          "Rewards ranking the answer first, not merely including it.",
          "Models real user behaviour on search results.",
          "Simple to compute and interpret.",
          "Sensitive to reranker improvements.",
          "Standard in information retrieval literature."
        ],
        costs: [
          "Ignores every relevant result after the first.",
          "Unsuitable when many documents are relevant.",
          "Binary relevance only — no grading.",
          "The mean hides the distribution.",
          "Steep decay can overstate small rank differences."
        ],
        avoid: [
          "Multiple documents are relevant — use **NDCG** or **MAP**.",
          "All `k` results are forwarded anyway — **recall@k**.",
          "Relevance is graded rather than binary.",
          "You need to understand the failure distribution, not an average."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ragas",

      why: {
        before: "Every team building RAG invented its own evaluation: a " +
          "spreadsheet of test questions, manual review, and an intuition " +
          "about whether the latest change helped.",
        problem: "Manual review does not scale, is not reproducible, and gives " +
          "no signal on **which component** failed. Teams could not compare " +
          "configurations reliably or catch regressions, so RAG development " +
          "proceeded by anecdote.",
        shift: "**A standard metric suite that separates retrieval from " +
          "generation.** RAGAS provides context recall and precision for the " +
          "retrieval half, faithfulness and answer relevance for the " +
          "generation half, computed largely by LLM judges. The decomposition " +
          "is the real contribution — it turns *the RAG is bad* into *retrieval " +
          "recall is 0.6, so fix chunking*."
      },

      num: {
        t: "The metric suite, by component",
        h: ["Metric", "Measures", "Needs ground truth?"],
        r: [
          ["**Context recall**", "**retrieval found what was needed**", "**yes**"],
          ["Context precision", "retrieved material was relevant", "yes"],
          ["**Faithfulness**", "**answer is grounded in context**", "**no**"],
          ["Answer relevance", "answer addresses the question", "**no**"],
          ["Answer correctness", "answer matches the reference", "yes"]
        ],
        n: "The **ground truth** column is what determines how far you can get " +
          "cheaply: **faithfulness and answer relevance need no reference " +
          "answers**, so they can run on production traffic continuously, " +
          "while the recall and correctness metrics require a curated test " +
          "set. The practical sequence is to build a **small, deliberately " +
          "chosen evaluation set** — 50 questions covering the failure modes " +
          "you actually see beats 500 generic ones — and run the full suite in " +
          "CI on every retrieval or prompt change. The important caveat is " +
          "that these are **LLM-judged** metrics: they cost money per " +
          "evaluation, vary between judge models and prompt versions, and " +
          "carry real noise. **Treat them as relative signals across " +
          "configurations, not as absolute scores** — a move from 0.72 to 0.79 " +
          "on the same judge is meaningful; 0.79 as a published number is not. " +
          "Pin the judge model version, or your baseline shifts underneath you."
      },

      miss: [
        {
          w: "RAGAS scores are objective measurements.",
          r: "Most are produced by **LLM judges** and depend on the judge " +
            "model, its version and the prompt. They are **relative** signals " +
            "for comparing configurations, not absolute quality figures. Pin " +
            "the judge version or your baseline drifts."
        },
        {
          w: "You need ground-truth answers for all of it.",
          r: "**Faithfulness and answer relevance need none** — they compare " +
            "the answer against the retrieved context and the question. Those " +
            "two can run on live production traffic; recall and correctness " +
            "need a labelled set."
        },
        {
          w: "A large evaluation set gives better signal.",
          r: "A **small, deliberately chosen** set covering your real failure " +
            "modes is more useful than a large generic one, and far cheaper to " +
            "run in CI. Fifty targeted questions beat five hundred " +
            "uninformative ones."
        },
        {
          w: "Good RAGAS scores mean users will be satisfied.",
          r: "They measure specific technical properties. Tone, format, " +
            "latency, appropriate refusals and handling of unanswerable " +
            "questions are not covered. Automated metrics are a **regression " +
            "guard**, not a substitute for looking at real outputs."
        }
      ],

      trade: {
        buys: [
          "Separates retrieval failures from generation failures.",
          "Reproducible comparison across configurations.",
          "Runs in CI to catch regressions.",
          "Two metrics need no ground truth — usable on live traffic.",
          "Standard vocabulary teams can share."
        ],
        costs: [
          "LLM judges cost money and add latency.",
          "Scores vary with judge model and prompt version.",
          "Ground-truth metrics need a curated dataset.",
          "Noisy at the margin — small differences may be meaningless.",
          "Does not cover tone, format, latency or refusal behaviour."
        ],
        avoid: [
          "There is no retrieval step.",
          "You cannot budget for judge calls.",
          "The system is prototype-stage and manual review is faster.",
          "The quality question is subjective rather than factual."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "llm-as-a-judge",

      why: {
        before: "Evaluating open-ended output meant human review — accurate, " +
          "slow and expensive — or automated metrics like BLEU and ROUGE that " +
          "compare word overlap with a reference.",
        problem: "Overlap metrics are close to useless for generation. Two " +
          "answers can share almost no vocabulary and be equally correct, or " +
          "share most of it and differ on the one word that matters. And human " +
          "review cannot run on every commit.",
        shift: "**Use a model to grade the output against explicit criteria.** " +
          "Given the question, the answer and a rubric, a capable model " +
          "produces judgements correlating reasonably well with human " +
          "ratings — fast enough for CI and cheap enough for large sets. It is " +
          "now the default for evaluating anything open-ended, including most " +
          "of the RAG metrics above."
      },

      num: {
        t: "Known biases, and what they cost you",
        h: ["Bias", "Effect", "Mitigation"],
        r: [
          ["**Position**", "**favours the first option shown**", "**swap order, average**"],
          ["**Verbosity**", "**prefers longer answers**", "**control for length in the rubric**"],
          ["**Self-preference**", "**favours its own family's output**", "**judge from a different family**"],
          ["Leniency", "clusters scores high", "**force a discrete rubric**"],
          ["Format", "rewards confident phrasing", "score criteria separately"]
        ],
        n: "**Position bias is the most measurable and most ignored**: in " +
          "pairwise comparison, judges favour whichever answer appears first " +
          "at rates well above chance, so any A/B evaluation must **run both " +
          "orderings and average** or the result is partly an artefact of " +
          "presentation. Two design choices improve reliability a great deal. " +
          "**Pairwise comparison beats absolute scoring** — models are much " +
          "better at *which of these is better* than at *rate this 1–10*, " +
          "where scores cluster around 7–8 regardless of quality. And a " +
          "**concrete rubric with discrete levels** and examples outperforms " +
          "an open request to rate quality. Finally, **validate the judge " +
          "against human labels** on a sample before trusting it: measure the " +
          "agreement rate, and if it is poor the judge is measuring something " +
          "other than what you intended — an unvalidated judge is a number " +
          "generator, not an evaluation."
      },

      miss: [
        {
          w: "A capable judge model gives unbiased scores.",
          r: "Judges show measurable **position bias** (favouring the first " +
            "option), **verbosity bias** (favouring longer answers) and " +
            "**self-preference** (favouring their own family's output). These " +
            "must be mitigated by design, not assumed away."
        },
        {
          w: "Absolute scoring out of 10 works well.",
          r: "Models are far better at **pairwise comparison** than absolute " +
            "rating. Absolute scores cluster around 7–8 with poor " +
            "discrimination. Prefer *which is better* or a discrete rubric " +
            "with defined levels."
        },
        {
          w: "The judge should be the strongest available model.",
          r: "Strength matters less than **not sharing a family with the model " +
            "under test**, because of self-preference bias. A different-family " +
            "judge with a good rubric is more trustworthy than a stronger " +
            "judge grading its own relatives."
        },
        {
          w: "Judge scores can replace human evaluation.",
          r: "They **scale** human evaluation and must be **calibrated** " +
            "against it. Validate agreement on a human-labelled sample first, " +
            "and re-check periodically. An unvalidated judge produces numbers " +
            "with no established relationship to quality."
        }
      ],

      trade: {
        buys: [
          "Evaluates open-ended output that overlap metrics cannot.",
          "Fast and cheap enough for CI and large test sets.",
          "Correlates reasonably with human judgement when validated.",
          "Handles criteria that are hard to specify programmatically.",
          "Explains its reasoning, aiding debugging."
        ],
        costs: [
          "Position, verbosity and self-preference biases.",
          "Scores shift with judge model and prompt version.",
          "Costs money and latency per evaluation.",
          "Poor at absolute scoring.",
          "Requires human validation to be trustworthy."
        ],
        avoid: [
          "An exact check exists — string match, schema validation, tests.",
          "The judge cannot be validated against human labels.",
          "The criteria are subjective in ways the rubric cannot capture.",
          "Budget rules out per-evaluation model calls."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "benchmark",

      why: {
        before: "Model quality was argued from demonstrations and impressions. " +
          "Every vendor claimed the best model and there was no common ground " +
          "to compare on.",
        problem: "Without a shared dataset and metric, progress cannot be " +
          "measured and claims cannot be checked. Research needs a fixed " +
          "target to optimise against and a way to tell whether a new method " +
          "actually helped.",
        shift: "**Fix a dataset and a metric, and publish both.** MMLU, " +
          "HumanEval, GSM8K, MT-Bench and SWE-bench each define a capability, " +
          "a set of items and a scoring rule. Benchmarks made progress legible " +
          "and comparable — and created a second, structural problem: **once a " +
          "benchmark becomes the target, it stops being a good measure**."
      },

      num: {
        t: "Why benchmark numbers overstate real capability",
        h: ["Problem", "Effect"],
        r: [
          ["**Contamination**", "**test items are in the training data**"],
          ["**Goodhart's law**", "**optimising the metric, not the capability**"],
          ["Saturation", "top models cluster, differences vanish"],
          ["**Narrow coverage**", "**measures one skill, generalised to all**"],
          ["Prompt sensitivity", "**scores swing on formatting alone**"],
          ["Self-reported", "vendors choose favourable configurations"]
        ],
        n: "**Contamination is the deepest problem** and is largely " +
          "unfalsifiable from outside: models train on web-scale corpora that " +
          "include benchmark datasets, their solutions and discussions of " +
          "them, so a high score may reflect memorisation rather than " +
          "capability. This is why **held-out and continuously refreshed " +
          "benchmarks** — LiveCodeBench, LiveBench, and human-preference " +
          "arenas — carry more weight than static ones, and why a benchmark's " +
          "value decays from the moment it is published. **Prompt sensitivity** " +
          "is the practically important one: the same model can move several " +
          "points on MMLU purely from answer formatting or few-shot examples, " +
          "so cross-paper comparisons of numbers obtained under different " +
          "harnesses are not really comparisons. The working conclusion is to " +
          "**treat public benchmarks as a coarse filter and build your own " +
          "evaluation set from your own task**, which cannot be contaminated " +
          "and measures what you actually need."
      },

      miss: [
        {
          w: "A higher benchmark score means a better model for my use case.",
          r: "Benchmarks measure **specific capabilities on specific " +
            "distributions**. A model leading on MMLU may be worse at your " +
            "task, your format or your latency budget. Build a small " +
            "evaluation set from your real workload."
        },
        {
          w: "Contamination is a marginal concern.",
          r: "Training corpora include benchmark items, solutions and " +
            "discussion. High scores can reflect memorisation, and it is " +
            "**hard to prove either way from outside**. This is why " +
            "continuously refreshed benchmarks are increasingly preferred."
        },
        {
          w: "Scores from different papers are comparable.",
          r: "Prompt format, few-shot count, decoding settings and answer " +
            "extraction all move scores by several points. Unless the harness " +
            "matches, the numbers measure different things and the comparison " +
            "is not meaningful."
        },
        {
          w: "Saturated benchmarks should be discarded.",
          r: "Saturation means they no longer **discriminate at the top**, and " +
            "they remain useful as **regression checks** — a large drop " +
            "signals real damage. They stop being leaderboards and stay useful " +
            "as floors."
        }
      ],

      trade: {
        buys: [
          "A common target that makes progress measurable.",
          "Comparable evaluation across labs and methods.",
          "Reveals capability gaps and failure classes.",
          "Cheap and fast relative to human evaluation.",
          "Useful as regression checks even after saturation."
        ],
        costs: [
          "Contamination inflates scores unpredictably.",
          "Goodhart's law — optimising the proxy, not the capability.",
          "Narrow coverage over-generalised into broad claims.",
          "Prompt-sensitive, so numbers are not portable.",
          "Saturation removes discrimination at the top."
        ],
        avoid: [
          "You need to choose a model for a specific task — build your own " +
            "set.",
          "The benchmark is saturated and you need discrimination.",
          "Contamination is likely and matters.",
          "Real quality depends on tone, latency or refusal behaviour."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
