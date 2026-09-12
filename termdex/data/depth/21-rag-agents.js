/* ==========================================================================
   Depth pass 21 — retrieval strategies and agent patterns.

   The RAG terms share a diagnosis worth stating once: **retrieval quality
   caps everything downstream**. A perfect model reasoning over the wrong
   chunks gives a confident wrong answer, and no amount of prompt work
   recovers it. Nearly every technique here is an attempt to fix retrieval
   rather than generation, because that is where the errors actually are.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "contextual-retrieval",

      why: {
        before: "Documents were split into chunks of a few hundred tokens and " +
          "embedded independently. Simple, and it is what every RAG tutorial " +
          "does.",
        problem: "A chunk read alone is often **meaningless**. *The company's " +
          "revenue grew 3% that quarter* — which company, which quarter? The " +
          "embedding captures a generic sentence about revenue growth, so it " +
          "matches badly and, if retrieved, gives the model no way to know what " +
          "it refers to. Splitting destroyed the context that gave the text its " +
          "meaning.",
        shift: "Before embedding, have an LLM write a **short situating " +
          "description** of where each chunk sits in its document, and prepend " +
          "it. The chunk now carries its own context — *This is from Acme " +
          "Corp's Q2 2024 report, in the section on European operations* — so " +
          "both the embedding and the retrieved text stand alone."
      },

      num: {
        t: "Reported retrieval failure reduction (Anthropic, 2024)",
        h: ["Method", "Failure rate reduction"],
        r: [
          ["Embeddings only (baseline)", "—"],
          ["+ BM25 hybrid", "~**–35%**"],
          ["**+ contextual embeddings**", "~**–49%**"],
          ["+ contextual BM25 too", "~**–67%**"],
          ["+ reranking on top", "~**–67%** further improved"]
        ],
        n: "The cost is the obvious objection: an LLM call **per chunk** at " +
          "index time. Prompt caching makes it affordable — the document is " +
          "cached once and each chunk's context generated against it, which " +
          "Anthropic reported at roughly **$1.02 per million document " +
          "tokens**. The important structural point is that this is an " +
          "**index-time** cost paid once, not a query-time cost paid forever, " +
          "which is the right place to spend. Note also that hybrid retrieval " +
          "and reranking stack with it — these are complementary fixes to " +
          "different failure modes, not alternatives."
      },

      miss: [
        {
          w: "Bigger chunks solve the context problem.",
          r: "They trade one failure for another. Large chunks dilute the " +
            "embedding — a 2,000-token chunk covering four topics embeds to " +
            "something matching none of them well — and waste context window " +
            "on irrelevant text. Contextual retrieval keeps chunks small and " +
            "**adds** the missing context."
        },
        {
          w: "You can generate the context with a template instead of an LLM.",
          r: "Metadata templates — document title, section heading — help and " +
            "are much cheaper. They cannot express *this paragraph continues " +
            "the argument about pricing from the previous section*, which is " +
            "the kind of situating an LLM writes. Template first, LLM where it " +
            "pays."
        },
        {
          w: "This replaces the need for reranking.",
          r: "They fix **different** problems. Contextual retrieval improves " +
            "what the first stage finds; reranking improves the ordering of " +
            "what was found. The published numbers show them compounding, and " +
            "the best configuration uses both."
        },
        {
          w: "The added context should be shown to the user.",
          r: "It is there to improve **embedding and matching**, and to orient " +
            "the model. It is generated text, so it can be wrong, and " +
            "presenting it as source material misattributes an LLM's summary to " +
            "the document. Keep it in the index, cite the original."
        }
      ],

      trade: {
        buys: [
          "Roughly halves retrieval failures on its own.",
          "Chunks become independently meaningful.",
          "Index-time cost, paid once rather than per query.",
          "Compounds with hybrid search and reranking."
        ],
        costs: [
          "An LLM call per chunk at index time.",
          "Re-indexing is more expensive, so updates cost more.",
          "Generated context can itself be wrong.",
          "Larger index — every chunk carries extra tokens."
        ],
        avoid: [
          "Chunks are already self-contained — FAQ entries, product records.",
          "The corpus changes constantly, making re-indexing costly.",
          "The document set is tiny and everything fits in context anyway.",
          "You have not yet tried hybrid search and reranking, which are " +
            "cheaper first moves."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hyde",

      why: {
        before: "RAG embeds the **question** and searches for similar chunks. " +
          "The assumption is that a question and its answer land near each " +
          "other in embedding space.",
        problem: "They often do not. *What causes the tyre pressure warning to " +
          "stay on after inflation?* is a question; the manual says *The TPMS " +
          "sensor requires a reset procedure following inflation*. They share " +
          "little vocabulary and read as different **kinds of text** — an " +
          "interrogative against a declarative technical statement. This is the " +
          "**asymmetry problem**.",
        shift: "Close the gap by generating a **hypothetical answer** with an " +
          "LLM and embedding *that* instead. The fake answer need not be " +
          "factually correct — it only needs to look like the kind of document " +
          "you want, so the search compares document to document rather than " +
          "question to document."
      },

      num: {
        t: "Where HyDE helps and where it does not",
        h: ["Situation", "Effect"],
        r: [
          ["Zero-shot, no training data", "**helps notably**"],
          ["Question/answer vocabulary differs", "**helps**"],
          ["Fine-tuned domain embedder available", "**little or no gain**"],
          ["Query is already keyword-like", "no gain"],
          ["Niche domain the LLM knows nothing about", "**can hurt**"]
        ],
        n: "The honest limitation is the last row. HyDE assumes the model can " +
          "produce something *shaped like* a plausible answer. On a domain it " +
          "has no knowledge of — internal jargon, a proprietary product, recent " +
          "events — it hallucinates in the wrong direction and pulls retrieval " +
          "away from the right documents. The other cost is structural: it adds " +
          "**an LLM call to every query**, so latency rises by hundreds of " +
          "milliseconds on the critical path. Where a **fine-tuned embedding " +
          "model** for your domain is available, it usually beats HyDE and " +
          "costs nothing at query time."
      },

      miss: [
        {
          w: "The hypothetical answer needs to be accurate.",
          r: "It explicitly does **not**. It is a retrieval probe, never shown " +
            "to the user and never used as an answer. What matters is that it " +
            "occupies roughly the right region of embedding space — correct " +
            "*style and vocabulary*, not correct facts."
        },
        {
          w: "HyDE improves the answer quality.",
          r: "It improves **retrieval**, which improves answers only if " +
            "retrieval was the bottleneck. If the right chunks were already " +
            "being found, HyDE adds latency and cost for nothing. Diagnose " +
            "where the failures actually are first."
        },
        {
          w: "It works better with a bigger generator model.",
          r: "A small fast model is usually sufficient — the output only needs " +
            "the right shape. Using a frontier model to write a throwaway probe " +
            "on every query is an expensive way to buy very little."
        },
        {
          w: "You should replace the query embedding with the HyDE embedding.",
          r: "Averaging the two, or searching with both and fusing the results, " +
            "is generally more robust — it hedges against a bad hypothetical. " +
            "Replacing outright means one poor generation ruins that query's " +
            "retrieval entirely."
        }
      ],

      trade: {
        buys: [
          "Closes the question-document asymmetry with no training.",
          "Works zero-shot on a new corpus.",
          "Especially effective where question and answer vocabularies differ.",
          "Simple to add to an existing pipeline."
        ],
        costs: [
          "An LLM call on every query — latency and cost.",
          "Can actively hurt on domains the model does not know.",
          "Non-deterministic: the same query may retrieve differently.",
          "Little benefit once a domain-tuned embedder exists."
        ],
        avoid: [
          "Latency is tight — this is on the critical path.",
          "The domain is proprietary and the model cannot fake a plausible " +
            "answer.",
          "You have or can train a domain-specific embedding model.",
          "Queries are already keyword-shaped, where BM25 does the work."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reflection",

      why: {
        before: "An agent produced an answer in one pass. Whatever it generated " +
          "first was the output, correct or not.",
        problem: "Models make mistakes they can **recognise** when asked to " +
          "look again — a missing edge case, an unstated assumption, a step " +
          "that does not follow. Single-pass generation throws away that " +
          "capacity entirely.",
        shift: "Add a **critic step**. Generate, then evaluate the output " +
          "against the requirements, then revise using the critique. The " +
          "insight is that **evaluating is easier than generating** — the same " +
          "reason code review works — so a second look catches errors the " +
          "first pass produced."
      },

      num: {
        t: "What reflection needs to actually work",
        h: ["Ingredient", "Without it"],
        r: [
          ["**External signal** (tests, compiler, tool)", "**gains largely vanish**"],
          ["Bounded iterations", "loops indefinitely, cost unbounded"],
          ["A stopping criterion", "revises past the point of improvement"],
          ["Distinct critic framing", "the model just agrees with itself"]
        ],
        n: "The first row is the finding that matters and it is frequently " +
          "ignored. Reflexion and similar results show large gains when the " +
          "critique is grounded in **external feedback** — failing unit tests, " +
          "a compiler error, a retrieval that returned nothing. Purely " +
          "**self**-critique with no external signal shows much weaker and " +
          "sometimes negligible improvement, because a model that could not " +
          "spot the error while writing frequently cannot spot it while " +
          "reviewing either. The practical rule: **reflection over a verifier " +
          "is powerful; reflection over vibes is expensive**. Cost also " +
          "multiplies — three rounds is roughly 3–5× the tokens and latency."
      },

      miss: [
        {
          w: "Asking the model to check its work reliably improves the answer.",
          r: "Only when the critique is **grounded**. Ungrounded " +
            "self-evaluation often produces confident approval of a wrong " +
            "answer, or worse, revision *away* from a correct one. The " +
            "improvement comes from the external signal, not from the act of " +
            "asking."
        },
        {
          w: "More reflection rounds give better results.",
          r: "Gains flatten quickly, typically after **two or three** rounds, " +
            "and can reverse — the model starts making changes for the sake of " +
            "having something to say. Bound the loop and stop on a criterion, " +
            "not on a fixed count."
        },
        {
          w: "The critic should be the same model with the same prompt.",
          r: "It needs a **different framing** at minimum — an explicit " +
            "checklist, a rubric, an adversarial role. A different model, or " +
            "one with access to tools the generator lacked, is better still. " +
            "Same model, same framing tends to reproduce the same blind spots."
        },
        {
          w: "Reflection is what makes agents work.",
          r: "It is one pattern among several, and it is a **multiplier on " +
            "cost and latency**. For tasks with a cheap verifier — code with " +
            "tests, SQL you can run, JSON you can validate — it is excellent. " +
            "For open-ended generation it often is not worth 3× the tokens."
        }
      ],

      trade: {
        buys: [
          "Substantial gains on tasks with an external verifier.",
          "Catches errors the first pass produced.",
          "Explicit critique is auditable and debuggable.",
          "Composes with tool use naturally."
        ],
        costs: [
          "3–5× tokens and latency.",
          "Weak or negative without a grounded signal.",
          "Needs a stopping criterion or it loops.",
          "Can revise a correct answer into a wrong one."
        ],
        avoid: [
          "There is no external signal to ground the critique.",
          "Latency or cost is constrained.",
          "The task is simple enough that the first pass is reliably right.",
          "You would be adding it because it sounds sophisticated rather than " +
            "because you measured a gain."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "planner-executor",

      why: {
        before: "A **ReAct** agent interleaved thinking and acting in one loop: " +
          "think, call a tool, observe, think again. Flexible, and the plan " +
          "exists only implicitly in the conversation.",
        problem: "That has real failure modes. The agent **loses the thread** " +
          "on long tasks, repeats steps, wanders, and there is no artefact you " +
          "can inspect before execution begins. It is also expensive — every " +
          "step carries the full accumulated history.",
        shift: "**Separate deciding from doing.** A planner decomposes the task " +
          "into explicit steps up front; an executor carries each out, " +
          "typically with a cheaper model and a narrower tool set. The plan " +
          "becomes an **artefact** — reviewable, cacheable, and something a " +
          "human can approve before anything executes."
      },

      num: {
        t: "Planner-executor against ReAct",
        h: ["Property", "ReAct", "Planner-executor"],
        r: [
          ["Plan visibility", "implicit", "**explicit artefact**"],
          ["Adaptivity", "**high** — replans every step", "lower"],
          ["Cost", "full history each step", "**cheap executor per step**"],
          ["Long-task drift", "**common**", "reduced"],
          ["Human approval point", "hard to insert", "**natural — approve the plan**"],
          ["Handles surprises", "**well**", "needs replanning"]
        ],
        n: "The trade is **adaptivity against structure**. A plan made before " +
          "any tool has run is made with the least information you will ever " +
          "have — so step four may be based on a wrong assumption about what " +
          "step two returns. The standard mitigation is **replanning**: the " +
          "executor reports back, and the planner revises the remaining steps " +
          "when reality diverges (Plan-and-Solve, LLMCompiler). The human " +
          "approval row is the one that matters most in production: a plan is " +
          "something a person can read and approve in seconds, where reviewing " +
          "an agent's step-by-step reasoning in real time is not practical."
      },

      miss: [
        {
          w: "Planning first is always better than reacting.",
          r: "It is better for **decomposable tasks with predictable steps**. " +
            "For exploratory work where each result changes what to do next — " +
            "debugging, research — **ReAct's** step-by-step adaptivity is " +
            "genuinely superior. Planning ahead in a fog produces a confident " +
            "wrong plan."
        },
        {
          w: "The executor can be a much smaller model.",
          r: "Often yes, and only if steps are genuinely simple and " +
            "well-specified. A vague step — *handle the edge cases* — needs the " +
            "same reasoning the planner has. The saving depends on the planner " +
            "producing genuinely mechanical steps."
        },
        {
          w: "A good plan means the task will succeed.",
          r: "Plans are made with **incomplete information**. The dominant " +
            "production failure is a plan that was reasonable and became wrong " +
            "at step two. Without a replanning path, the executor faithfully " +
            "carries out the remaining steps into a wall."
        },
        {
          w: "This is just breaking the prompt into smaller prompts.",
          r: "The structural gains are the **explicit artefact** — inspectable, " +
            "approvable, cacheable, resumable — and the ability to run " +
            "independent steps in parallel. Those are architectural properties, " +
            "not prompt formatting."
        }
      ],

      trade: {
        buys: [
          "An explicit plan a human can review before execution.",
          "Cheaper execution with a smaller model per step.",
          "Independent steps can run in parallel.",
          "Less drift and repetition on long tasks.",
          "Resumable — a failed step need not restart everything."
        ],
        costs: [
          "Less adaptive than step-by-step reaction.",
          "Plans made with incomplete information go stale.",
          "Replanning logic adds real complexity.",
          "Poor decomposition propagates through every step."
        ],
        avoid: [
          "The task is exploratory and each result reshapes the next step.",
          "It is short enough that one pass would do.",
          "Steps cannot be specified without doing them first.",
          "The environment changes faster than a plan survives."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "graphrag",

      why: {
        before: "RAG retrieves the top-k **chunks** most similar to a query. " +
          "That works well when the answer sits in one passage.",
        problem: "It fails on questions whose answer is **distributed**. *What " +
          "are the main themes across these 200 reports?* has no top-5 chunks " +
          "— the answer requires aggregating across the whole corpus. So does " +
          "*how is person A connected to organisation B?*, where the link runs " +
          "through documents that mention neither together.",
        shift: "Extract **entities and relationships** into a knowledge graph, " +
          "then retrieve over structure rather than similarity. Community " +
          "detection groups related entities, and pre-generated summaries per " +
          "community let global questions be answered by aggregating summaries " +
          "instead of chunks."
      },

      num: {
        t: "Where GraphRAG earns its cost",
        h: ["Question type", "Vector RAG", "GraphRAG"],
        r: [
          ["*What did the Q2 report say about pricing?*", "**good**", "overkill"],
          ["*How is X connected to Y?*", "**poor**", "**good**"],
          ["*What are the main themes overall?*", "**poor**", "**good**"],
          ["*Summarise everything about Z*", "partial", "**good**"],
          ["Indexing cost", "cheap", "**LLM call per chunk+**"]
        ],
        n: "The cost is the honest headline: building the graph requires LLM " +
          "extraction over the **entire corpus** — entities, relationships, " +
          "then community summaries — which for a large corpus runs to " +
          "**thousands of dollars** and hours of processing. Microsoft's " +
          "GraphRAG paper reports strong gains on global sensemaking " +
          "questions specifically. The mistake teams make is adopting it for " +
          "an ordinary question-answering workload where vector RAG was fine, " +
          "and paying the indexing cost for questions nobody asks. Incremental " +
          "updates are also awkward — a new document can change community " +
          "structure."
      },

      miss: [
        {
          w: "GraphRAG is a better version of RAG.",
          r: "It is a **different retrieval strategy for different questions**. " +
            "For specific factual lookups, vector RAG is faster, cheaper and " +
            "frequently better. GraphRAG targets global and relational " +
            "questions that vector similarity structurally cannot answer."
        },
        {
          w: "You need a graph database to do it.",
          r: "The graph can live in Parquet files, in a relational database, or " +
            "in memory. Microsoft's implementation does not require Neo4j. " +
            "What matters is the **extracted structure**, not the storage " +
            "engine."
        },
        {
          w: "The extracted graph is accurate.",
          r: "It is **LLM-extracted**, so entities are missed, duplicated under " +
            "different surface forms, and relationships hallucinated. Entity " +
            "resolution — deciding that *IBM*, *I.B.M.* and *International " +
            "Business Machines* are one node — is a genuine unsolved-in-general " +
            "problem, and errors propagate into every answer."
        },
        {
          w: "It replaces vector search.",
          r: "Production systems typically run **both**, routing by question " +
            "type. Local factual questions go to vector search; global and " +
            "relational ones go to the graph. Treating it as a replacement " +
            "means paying graph costs for lookups that did not need them."
        }
      ],

      trade: {
        buys: [
          "Answers global and thematic questions vector RAG cannot.",
          "Multi-hop relational reasoning across documents.",
          "Community summaries give corpus-level overview.",
          "Explicit structure is inspectable and debuggable."
        ],
        costs: [
          "Very expensive indexing — LLM calls across the whole corpus.",
          "Extraction errors and entity resolution problems propagate.",
          "Incremental updates are awkward.",
          "Substantially more infrastructure and complexity.",
          "Overkill for specific factual retrieval."
        ],
        avoid: [
          "Questions are specific lookups — vector RAG is cheaper and better.",
          "The corpus changes frequently.",
          "The indexing budget is limited.",
          "You have not first tried hybrid search, reranking and contextual " +
            "retrieval, which are far cheaper.",
          "The corpus is small enough to fit in a context window."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ndcg",

      why: {
        before: "Ranking quality was measured with **precision@k** — how many " +
          "of the top k results are relevant.",
        problem: "That ignores two things that matter enormously. It treats " +
          "relevance as **binary** when results are more usefully graded " +
          "(perfect, good, marginal, irrelevant). And it ignores **position** " +
          "— a perfect result at rank 1 and at rank 10 count the same, though " +
          "users overwhelmingly click the first few.",
        shift: "Discount gain by position and normalise. **DCG** sums each " +
          "result's relevance divided by `log₂(rank + 1)`, so lower positions " +
          "contribute less. **nDCG** divides by the DCG of the ideal ordering, " +
          "producing a 0–1 score comparable across queries with different " +
          "numbers of relevant documents."
      },

      num: {
        t: "The position discount",
        h: ["Rank", "Discount 1/log₂(r+1)", "A relevance-3 item contributes"],
        r: [
          ["1", "1.00", "**3.00**"],
          ["2", "0.63", "1.89"],
          ["3", "0.50", "1.50"],
          ["5", "0.39", "1.16"],
          ["10", "0.29", "**0.87**"]
        ],
        n: "A perfect result at rank 10 contributes less than a third of what " +
          "it would at rank 1 — which is roughly how users behave, and is the " +
          "point of the metric. The **normalisation** is what makes it " +
          "comparable: a query with two relevant documents and one with fifty " +
          "produce DCGs on completely different scales, and dividing by the " +
          "ideal DCG puts both on 0–1. Two practical cautions: nDCG needs " +
          "**graded relevance judgements**, which are expensive to collect and " +
          "subjective; and it **says nothing about what you failed to " +
          "retrieve** — a system with perfect ordering of a bad candidate set " +
          "scores well, which is why recall must be measured separately."
      },

      miss: [
        {
          w: "nDCG@10 of 0.85 means the ranking is 85% correct.",
          r: "It means the discounted gain achieved 85% of the **ideal " +
            "ordering's** discounted gain — for the documents that were " +
            "retrieved. It is not an accuracy percentage, and 0.85 with poor " +
            "recall can mean an excellent ordering of the wrong documents."
        },
        {
          w: "Higher nDCG always means a better user experience.",
          r: "It measures ranking against **your relevance labels**. If those " +
            "labels do not reflect what users want — collected by annotators " +
            "with different priorities, or stale — you are optimising toward " +
            "the wrong target with high confidence."
        },
        {
          w: "You can compare nDCG across different systems freely.",
          r: "Only with the **same judgements, the same cutoff k, and the same " +
            "gain formula**. Exponential gain `(2^rel − 1)` and linear gain " +
            "give different numbers, and papers use both. Comparing nDCG@10 to " +
            "nDCG@20, or across different labelled sets, is meaningless."
        },
        {
          w: "Binary relevance is fine — just use 0 and 1.",
          r: "Then nDCG largely reduces to a position-discounted precision and " +
            "you have discarded its main advantage. Graded relevance is what " +
            "distinguishes *perfect answer* from *tangentially related*, which " +
            "is exactly the distinction that matters for ranking."
        }
      ],

      trade: {
        buys: [
          "Accounts for both position and graded relevance.",
          "Normalised, so comparable across queries.",
          "The standard metric in information retrieval — comparable to " +
            "literature.",
          "Correlates reasonably with user satisfaction."
        ],
        costs: [
          "Requires graded relevance judgements, which are expensive.",
          "Says nothing about recall or coverage.",
          "Sensitive to the choice of k and gain formula.",
          "Labels can be subjective and go stale."
        ],
        avoid: [
          "Relevance is genuinely binary — precision and recall are simpler.",
          "You have click data — online metrics like CTR or MRR may reflect " +
            "reality better.",
          "There is only one correct answer — **MRR** is the natural metric.",
          "You have no labelled judgements and cannot obtain them."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kto",

      why: {
        before: "**DPO** simplified preference alignment enormously, and it " +
          "still requires **pairwise comparisons**: for each prompt, a chosen " +
          "and a rejected response.",
        problem: "That data is expensive and unnatural. Real product feedback " +
          "is not paired — it is a thumbs up, a thumbs down, a support " +
          "escalation, a completed purchase. Constructing pairs from it means " +
          "either discarding most of the signal or manufacturing comparisons " +
          "that were never made.",
        shift: "Take the data as it comes. **KTO** needs only a binary " +
          "*desirable* or *undesirable* label per response, with no pairing. " +
          "The loss is derived from **prospect theory** — Kahneman and " +
          "Tversky's model of how people actually value gains and losses, " +
          "which is why it is asymmetric."
      },

      num: {
        t: "Preference methods by data requirement",
        h: ["Method", "Data needed", "Stages"],
        r: [
          ["RLHF/PPO", "pairs + reward model", "3"],
          ["DPO", "**pairs**", "2 (SFT + DPO)"],
          ["ORPO", "pairs", "**1** — folded into SFT"],
          ["**KTO**", "**binary labels, unpaired**", "2"],
          ["GRPO", "groups of samples + a scorer", "2"]
        ],
        n: "The practical unlock is that **binary feedback is what production " +
          "systems already collect**. A deployed assistant accumulates thumbs " +
          "up/down continuously; turning that into pairs requires two responses " +
          "to the same prompt, which you rarely have. KTO reportedly matches " +
          "or exceeds DPO in several settings while using data you already " +
          "own. The asymmetry from prospect theory is deliberate: **losses " +
          "loom larger than gains**, so an undesirable example pushes harder " +
          "than a desirable one — which matches how you would want a model " +
          "trained on real feedback to behave, since a bad response costs more " +
          "than a good one gains."
      },

      miss: [
        {
          w: "KTO is just DPO with worse data.",
          r: "It is a **different loss** with a different theoretical basis, " +
            "not a degraded version. Reported results show it competitive with " +
            "and sometimes better than DPO — the point is not that unpaired " +
            "data is worse but that it is far more available."
        },
        {
          w: "The desirable and undesirable sets should be balanced.",
          r: "KTO handles imbalance and exposes weighting hyperparameters " +
            "precisely because real feedback is skewed — most interactions are " +
            "fine and a minority are bad. Forcing balance by discarding data " +
            "throws away signal you paid to collect."
        },
        {
          w: "You can label anything good or bad and it will work.",
          r: "Label **quality and consistency** matter as much as in any " +
            "preference method. Thumbs-down clicked for irrelevant reasons — " +
            "slow response, misunderstood question, user error — teaches the " +
            "model the wrong lesson. The signal must reflect response quality."
        },
        {
          w: "It removes the need for supervised fine-tuning first.",
          r: "Like DPO, it expects to start from an **SFT model**. The " +
            "reference model in the loss is that checkpoint. Applying it " +
            "directly to a base model gives poor results — **ORPO** is the " +
            "method that genuinely folds alignment into SFT."
        }
      ],

      trade: {
        buys: [
          "Trains on binary feedback you already collect.",
          "No pairwise comparison data required.",
            "Handles imbalanced feedback naturally.",
          "Competitive with DPO in reported evaluations.",
          "Simple training loop, like DPO."
        ],
        costs: [
          "Less studied than DPO or RLHF.",
          "Sensitive to label quality — noisy feedback teaches noise.",
          "Still requires an SFT starting point.",
          "Fewer reference implementations and less tuning knowledge."
        ],
        avoid: [
          "You already have high-quality pairwise data — DPO is better " +
            "understood.",
          "You want alignment in a single stage — that is **ORPO**.",
          "Your binary signal is noisy or measures something other than " +
            "response quality.",
          "You need a reusable reward model for evaluation or best-of-n."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sliding-window-attention",

      why: {
        before: "Full attention lets every token attend to every other, at " +
          "`O(n²)` cost — the wall that bounds context length.",
        problem: "Most of that computation is arguably wasted. Language has " +
          "strong locality: the token you are predicting depends far more on " +
          "the last few hundred tokens than on token 40,000. Paying quadratic " +
          "cost to model dependencies that are usually weak is a poor trade.",
        shift: "Restrict each token to the last **W** tokens. Cost becomes " +
          "`O(n·W)` — **linear** in sequence length. And crucially, stacking " +
          "layers recovers reach: with window 4,096 and 32 layers, information " +
          "propagates up to **131,072 tokens** through the layer stack, " +
          "exactly as a CNN's receptive field grows with depth."
      },

      num: {
        t: "Effective reach through layers",
        h: ["Window W", "Layers", "Theoretical reach", "Cost"],
        r: [
          ["4,096", "1", "4,096", "`O(n·W)`"],
          ["**4,096**", "**32**", "**131,072**", "`O(n·W)`"],
          ["full attention", "any", "n", "**`O(n²)`**"]
        ],
        n: "The layer-stacking argument is what makes this work — Mistral 7B " +
          "used a 4,096 window across 32 layers for exactly this reason. But " +
          "note the same caveat as CNN receptive fields: **theoretical reach " +
          "is not effective reach**. Information passed through 32 layers of " +
          "mixing is heavily attenuated, so distant recall is weaker than full " +
          "attention. The **KV cache** benefit is more clear-cut and often the " +
          "real motivation: you only need to keep W tokens of cache rather than " +
          "all n, so memory during generation stops growing with context. " +
          "Hybrids are common — a few full-attention layers among many " +
          "windowed ones — to recover exact long-range recall where it matters."
      },

      miss: [
        {
          w: "Sliding window attention limits the model to W tokens of context.",
          r: "One **layer** sees W tokens; the stack propagates information " +
            "much further, roughly `W × layers`. The model can use context far " +
            "beyond its window — with attenuation, not with a hard cutoff."
        },
        {
          w: "It is an approximation of full attention.",
          r: "It is a **different architecture**, trained that way from the " +
            "start. It is not an approximation applied afterwards — you cannot " +
            "take a full-attention model and impose a window without " +
            "degradation, because it learned to rely on long-range attention."
        },
        {
          w: "Larger windows are always better.",
          r: "Cost scales linearly with W, so a large window gives up the " +
            "efficiency that motivated the design. The choice balances local " +
            "modelling quality against cost, and depends on the layer count " +
            "available to propagate information."
        },
        {
          w: "It solves the long-context problem.",
          r: "It makes long context **affordable**, and precise recall of a " +
            "specific distant token is weaker than full attention. This is why " +
            "long-context benchmarks like needle-in-a-haystack matter, and why " +
            "hybrid attention patterns exist."
        }
      ],

      trade: {
        buys: [
          "Linear rather than quadratic attention cost.",
          "KV cache bounded by W, not by context length.",
          "Long contexts become affordable at inference.",
          "Reach extends through the layer stack."
        ],
        costs: [
          "Weaker precise recall of distant tokens.",
          "Must be trained with the window, not applied post-hoc.",
          "Window size is another architectural hyperparameter.",
          "Effective reach is much shorter than the theoretical figure."
        ],
        avoid: [
          "The task needs exact retrieval from far back — use full attention " +
            "or a hybrid.",
          "Sequences are short, where quadratic cost does not bind.",
          "You are serving an existing full-attention model.",
          "Long-range dependencies are the core of the task rather than an " +
            "occasional need."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
