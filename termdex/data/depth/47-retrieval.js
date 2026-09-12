/* ==========================================================================
   Depth pass 47 — the retrieval half of RAG, mechanism by mechanism.

   Vector search is the part everyone builds first and the part that fails in
   the most confusing way: it returns results that are topically similar and
   miss the exact term the user typed. Every technique here — BM25, hybrid,
   reranking, query rewriting, metadata filters — exists to patch a specific
   hole that pure embedding search leaves open.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "semantic-gap",

      why: {
        before: "Search matched the words the user typed against the words in " +
          "the document. If both used the same term, it worked.",
        problem: "They frequently do not. A user asks *why is my laptop so " +
          "slow*; the document says *performance degradation caused by " +
          "thermal throttling*. Not one content word overlaps, and the " +
          "document is exactly the right answer. Users describe **symptoms in " +
          "their own vocabulary**; documents describe **causes in domain " +
          "vocabulary**.",
        shift: "Naming the mismatch as the **semantic gap** clarifies what " +
          "every retrieval technique is attempting. Synonym lists, query " +
          "expansion, embeddings and LLM query rewriting are all attacks on " +
          "the same problem: **the words a searcher uses are not the words the " +
          "answer uses**."
      },

      num: {
        t: "The gap, and what closes each form of it",
        h: ["Form of mismatch", "Example", "What helps"],
        r: [
          ["**Vocabulary**", "**car / automobile**", "**embeddings, synonyms**"],
          ["**Abstraction**", "**slow laptop / thermal throttling**", "**query rewriting, HyDE**"],
          ["Expertise", "layman vs domain terms", "embeddings, glossaries"],
          ["**Specificity**", "**a product code**", "**keyword search — BM25**"],
          ["Intent", "ambiguous question", "clarification, multi-query"]
        ],
        n: "The table is the argument for **hybrid search**, because the fixes " +
          "point in opposite directions. Embeddings close the vocabulary and " +
          "expertise rows by mapping meaning rather than characters — and they " +
          "**open a new gap on the specificity row**, where a product code, an " +
          "error number or a person's name must match exactly and an embedding " +
          "will happily return something topically adjacent instead. That is " +
          "why keyword search never went away: dense retrieval solves one half " +
          "of the semantic gap and creates the other half. The **abstraction** " +
          "row is the hardest and the one embeddings handle worst, since " +
          "symptom and cause are genuinely different concepts rather than " +
          "different words for one concept — that is what **query rewriting** " +
          "and **HyDE** (generating a hypothetical answer and embedding *that*) " +
          "exist to bridge."
      },

      miss: [
        {
          w: "Embeddings solve the semantic gap.",
          r: "They close the **vocabulary** gap and open an **exactness** gap. " +
            "Product codes, error numbers and proper nouns need literal " +
            "matching, and embeddings return topically similar results " +
            "instead. Hybrid search exists because both gaps are real."
        },
        {
          w: "It is a search problem, not a content problem.",
          r: "Much of it is **content**. Documents written in internal jargon " +
            "cannot be found by users who do not know that jargon. Adding an " +
            "FAQ phrased in user language, or symptom sections to " +
            "documentation, often beats any retrieval tuning."
        },
        {
          w: "Bigger embedding models close the gap.",
          r: "They help with vocabulary and barely touch **abstraction** — " +
            "symptom versus cause is a reasoning step, not a synonym " +
            "relationship. That is why query rewriting and HyDE exist as " +
            "separate techniques."
        },
        {
          w: "It only affects search systems.",
          r: "It affects **RAG identically**, and more consequentially: if " +
            "retrieval misses the document because of the gap, the model " +
            "answers from memory or refuses, and the user sees a confident " +
            "wrong answer rather than an empty results page."
        }
      ],

      trade: {
        buys: [
          "Names why keyword search fails on natural questions.",
          "Explains what each retrieval technique is actually fixing.",
          "Points at content changes, not only retrieval tuning.",
          "Justifies hybrid search with a concrete mechanism."
        ],
        costs: [
          "No single technique closes every form of it.",
          "Fixes for one form worsen another.",
          "Hard to measure directly — visible only through failures.",
          "Content-side fixes require writing effort, not configuration."
        ],
        avoid: [
          "Users and documents share vocabulary — internal code search.",
          "Queries are exact identifiers.",
          "The corpus is small enough to read entirely.",
          "The mismatch is intent ambiguity — ask a clarifying question."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bm25",

      why: {
        before: "Keyword ranking used **TF-IDF**: score a document by how " +
          "often the query terms appear, weighted down by how common those " +
          "terms are across the corpus.",
        problem: "TF-IDF's term frequency grows **linearly**, so a document " +
          "mentioning a word 100 times scores 100 times a document mentioning " +
          "it once — which does not match relevance at all. The tenth mention " +
          "adds far less information than the second. Long documents also " +
          "accumulate matches simply by being long.",
        shift: "**Saturate term frequency and normalise for length.** BM25 " +
          "adds two parameters: `k1` controls how quickly extra occurrences " +
          "stop mattering, and `b` controls how strongly length is penalised. " +
          "The result has been the standard keyword ranking function since the " +
          "1990s and, remarkably, **remains competitive with neural retrieval** " +
          "on exact-match queries."
      },

      num: {
        t: "BM25 against dense retrieval",
        h: ["Query type", "BM25", "Embeddings"],
        r: [
          ["**Exact term — `ERR_1042`**", "**excellent**", "**poor**"],
          ["Proper noun, rare name", "**excellent**", "unreliable"],
          ["**Paraphrased question**", "**poor**", "**excellent**"],
          ["Synonyms", "poor", "**excellent**"],
          ["**Out-of-domain vocabulary**", "**works — no training needed**", "**degrades**"],
          ["Cost to index", "**cheap, CPU**", "GPU embedding pass"]
        ],
        n: "The **out-of-domain** row is BM25's underrated advantage: it needs " +
          "**no training and no model**, so it works identically on a new " +
          "domain, a new language's technical terms, or a corpus of internal " +
          "codenames — where an embedding model trained on general web text " +
          "degrades sharply. Combined with the exact-match rows, this is why " +
          "**every serious production RAG system runs BM25 alongside vector " +
          "search** rather than replacing it. Practical defaults: `k1` around " +
          "1.2–2.0 and `b` around 0.75, which are the values Elasticsearch and " +
          "Lucene ship and are rarely worth changing before other tuning. The " +
          "genuine limitation is that BM25 matches **tokens, not meaning** — " +
          "zero overlap means zero score, however relevant the document is, " +
          "which is exactly the vocabulary half of the semantic gap."
      },

      miss: [
        {
          w: "BM25 is obsolete now that embeddings exist.",
          r: "It **outperforms dense retrieval** on exact terms, rare proper " +
            "nouns, product codes and out-of-domain vocabulary. Production " +
            "systems run both. It is the sparse half of every hybrid search " +
            "system in use today."
        },
        {
          w: "BM25 is TF-IDF with a different name.",
          r: "It adds **term frequency saturation** — the tenth occurrence " +
            "contributes far less than the second — and **document length " +
            "normalisation**. Both correct specific TF-IDF failures, and both " +
            "matter on real corpora."
        },
        {
          w: "It understands synonyms if the corpus is large enough.",
          r: "It matches **tokens**. `car` and `automobile` are unrelated to " +
            "BM25 regardless of corpus size. Closing that gap requires synonym " +
            "expansion, query rewriting or embeddings."
        },
        {
          w: "Tuning `k1` and `b` is the first thing to try.",
          r: "Defaults of roughly `k1 = 1.2–2.0` and `b = 0.75` are well " +
            "chosen and rarely the bottleneck. **Tokenisation, stemming, " +
            "stopwords and field weighting** usually matter far more, and are " +
            "where real gains come from."
        }
      ],

      trade: {
        buys: [
          "Excellent on exact terms, codes and proper nouns.",
          "No training, no model, no GPU.",
          "Works immediately on any domain or vocabulary.",
          "Cheap to index and query at scale.",
          "Interpretable — you can see which terms matched."
        ],
        costs: [
          "No understanding of synonyms or paraphrase.",
          "Zero overlap gives zero score however relevant.",
          "Sensitive to tokenisation and stemming choices.",
          "Poor on natural-language questions.",
          "Language-specific preprocessing required."
        ],
        avoid: [
          "Queries are paraphrased questions — add dense retrieval.",
          "Vocabulary mismatch dominates.",
          "You are already running hybrid and want the dense half tuned.",
          "The corpus is multilingual without per-language analysers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hybrid-search",

      why: {
        before: "Teams picked one retrieval method. Keyword search missed " +
          "paraphrases; vector search missed exact terms. Each looked like the " +
          "wrong choice from the other's failures.",
        problem: "The failures are **complementary rather than overlapping**. " +
          "BM25 fails where vocabulary differs; embeddings fail where an exact " +
          "token must match. Choosing one guarantees a whole class of queries " +
          "returns nothing useful, and no amount of tuning within one method " +
          "fixes the other's blind spot.",
        shift: "**Run both and fuse the results.** Hybrid search retrieves " +
          "with BM25 and with embeddings, then combines the two ranked lists. " +
          "It is consistently better than either alone, and the standard " +
          "fusion method — **Reciprocal Rank Fusion** — needs no score " +
          "calibration, which turns out to be the crucial practical detail."
      },

      num: {
        t: "Fusion strategies",
        h: ["Method", "How", "Needs score calibration?"],
        r: [
          ["**Reciprocal Rank Fusion**", "**sum of 1/(k + rank)**", "**no — the usual choice**"],
          ["Weighted score sum", "α·dense + (1−α)·sparse", "**yes — scores differ in scale**"],
          ["**Rerank the union**", "**cross-encoder over both lists**", "**no — best quality**"],
          ["Interleaving", "alternate from each list", "no"]
        ],
        n: "**RRF is the default because it uses ranks rather than scores**, " +
          "and that sidesteps a genuinely hard problem: BM25 scores are " +
          "unbounded and corpus-dependent while cosine similarities sit in a " +
          "narrow band around 0.7–0.9, so combining them numerically requires " +
          "normalisation that must be re-tuned whenever the corpus changes. " +
          "RRF ignores magnitudes entirely — typically with `k = 60` — and is " +
          "robust without tuning. The **rerank the union** row is the highest " +
          "quality option and the standard production shape: retrieve maybe 50 " +
          "from each method, fuse, then rerank down to 5 with a cross-encoder. " +
          "That gets recall from breadth and precision from the reranker. The " +
          "cost is real — two indexes to build and keep in sync, two queries " +
          "per request — which is why it is worth confirming with " +
          "**recall@k** that your queries actually include the exact-match " +
          "kind before adding the complexity."
      },

      miss: [
        {
          w: "Hybrid search means averaging two similarity scores.",
          r: "Score scales are **incomparable** — BM25 is unbounded and " +
            "corpus-dependent, cosine similarity sits near 0.7–0.9. Averaging " +
            "raw scores is dominated by whichever has larger magnitude. Use " +
            "**RRF**, which combines ranks."
        },
        {
          w: "It always improves results.",
          r: "It improves results **when the query mix includes both kinds**. " +
            "A corpus queried only in natural language gains little from " +
            "BM25; a code search queried only by identifier gains little from " +
            "embeddings. Measure before adding the complexity."
        },
        {
          w: "The weighting between methods needs careful tuning.",
          r: "With **RRF there is no weight to tune** — that is its main " +
            "practical advantage. Weighted score fusion does need tuning and " +
            "re-tuning as the corpus changes, which is why RRF is preferred."
        },
        {
          w: "Hybrid search replaces the need for reranking.",
          r: "They solve different problems. Fusion improves **recall** by " +
            "combining two candidate sets; reranking improves **precision** by " +
            "scoring those candidates more accurately. The strongest pipelines " +
            "do both."
        }
      ],

      trade: {
        buys: [
          "Covers both exact-match and paraphrase queries.",
          "RRF needs no score calibration or tuning.",
          "Substantially better recall than either method alone.",
          "Robust when embeddings are out of domain.",
          "Composes naturally with a reranking stage."
        ],
        costs: [
          "Two indexes to build, store and keep in sync.",
          "Two queries per request — latency and cost.",
          "More infrastructure and more failure modes.",
          "Fusion adds a stage to debug.",
          "Little benefit when the query mix is one-sided."
        ],
        avoid: [
          "Queries are uniformly one type.",
          "Latency budget rules out two retrievals.",
          "You have not measured whether recall is the bottleneck.",
          "Operational simplicity outweighs the recall gain."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reranking",

      why: {
        before: "Vector search compares a query embedding against document " +
          "embeddings computed **independently and in advance**. That is what " +
          "makes it fast enough to search millions of documents in " +
          "milliseconds.",
        problem: "Independence is also the weakness. A **bi-encoder** never " +
          "sees the query and document together — it compresses each into a " +
          "vector separately and compares, so subtle relevance signals that " +
          "depend on the interaction between them are lost before comparison " +
          "happens.",
        shift: "**Re-score the top candidates with a model that reads query " +
          "and document jointly.** A **cross-encoder** takes the pair as one " +
          "input and attends across both, producing a much more accurate " +
          "relevance score. It is far too slow to run over a whole corpus and " +
          "perfectly affordable over 50 candidates — so retrieve broadly and " +
          "cheaply, then rerank narrowly and accurately."
      },

      num: {
        t: "Bi-encoder against cross-encoder",
        h: ["", "Bi-encoder (retrieval)", "Cross-encoder (rerank)"],
        r: [
          ["Sees query and doc together", "**no**", "**yes**"],
          ["Doc embeddings precomputed", "**yes**", "**no — per pair**"],
          ["Cost per query", "**one vector comparison**", "**one forward pass per candidate**"],
          ["**Scales to millions**", "**yes**", "**no**"],
          ["Accuracy", "good", "**substantially better**"],
          ["Typical use", "retrieve top 50", "**rerank to top 5**"]
        ],
        n: "The **precomputation** row is the entire architectural reason for " +
          "the two-stage design: a bi-encoder embeds documents once at index " +
          "time, so query time is a vector search; a cross-encoder must run a " +
          "forward pass for **every query-document pair**, which cannot be " +
          "precomputed because it depends on the query. That makes it " +
          "impossible over a corpus and cheap over a shortlist. Typical shape " +
          "is retrieve 50, rerank to 5, adding roughly **50–200 ms** — the " +
          "main cost, and usually worth it. Reranking is also **the strongest " +
          "single quality improvement available to most RAG systems**, often " +
          "outweighing embedding model upgrades, because it improves precision " +
          "directly where it matters. It cannot, however, rescue a document " +
          "retrieval never returned: **reranking is bounded by recall**, so if " +
          "context recall is low, fix retrieval first."
      },

      miss: [
        {
          w: "A reranker is a better embedding model.",
          r: "It is a **different architecture**. A cross-encoder reads query " +
            "and document **together** in one forward pass; an embedding model " +
            "encodes each separately. That joint attention is where the " +
            "accuracy comes from, and why it cannot be precomputed."
        },
        {
          w: "Reranking can fix poor retrieval.",
          r: "It only reorders **what retrieval returned**. A document not in " +
            "the candidate set can never be surfaced. Reranking raises " +
            "precision and is bounded by recall — fix recall first."
        },
        {
          w: "You should rerank as many candidates as possible.",
          r: "Cost scales **linearly** with candidate count. Beyond roughly " +
            "50–100 the quality gain flattens while latency keeps rising. " +
            "Retrieve enough for good recall, then stop."
        },
        {
          w: "Reranking is an optional refinement.",
          r: "It is usually the **single largest quality improvement** " +
            "available to a RAG pipeline, often exceeding what a better " +
            "embedding model delivers. Teams routinely skip it and then tune " +
            "prompts to compensate for poor context."
        }
      ],

      trade: {
        buys: [
          "Substantially better relevance than embedding similarity.",
          "Enables retrieve-wide-then-narrow, giving recall and precision.",
          "Fewer, better chunks — lower generation cost.",
          "Model-agnostic; drops into an existing pipeline.",
          "Often the biggest single quality win available."
        ],
        costs: [
          "50–200 ms added latency.",
          "A forward pass per candidate — compute cost.",
          "Another model to host, version and monitor.",
          "Bounded by retrieval recall.",
          "Cost scales linearly with candidates."
        ],
        avoid: [
          "Recall is the bottleneck — fix retrieval first.",
          "Latency budget is very tight.",
          "Only a handful of candidates exist anyway.",
          "The context window comfortably holds everything retrieved."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "query-rewriting",

      why: {
        before: "The user's question was sent to the retriever exactly as " +
          "typed, on the assumption that it expressed what they wanted.",
        problem: "Raw questions are poor search queries. They contain " +
          "conversational filler, pronouns referring to earlier turns " +
          "(*what about the second one?*), several questions at once, and " +
          "symptom vocabulary rather than the domain terms documents use. A " +
          "follow-up like *and the pricing?* is meaningless to a retriever " +
          "with no conversation history.",
        shift: "**Use a model to turn the raw question into a better search " +
          "query before retrieving.** Resolve pronouns against history, strip " +
          "filler, expand abbreviations, split compound questions, and " +
          "translate symptom language into domain terms. It is the cheapest " +
          "large improvement available to a multi-turn RAG system, because " +
          "**conversational follow-ups are otherwise close to unretrievable**."
      },

      num: {
        t: "Rewriting strategies",
        h: ["Strategy", "Does what", "Best for"],
        r: [
          ["**Contextualisation**", "**resolve pronouns from history**", "**multi-turn chat — essential**"],
          ["**Multi-query**", "**generate several phrasings**", "**recall — fuse the results**"],
          ["**HyDE**", "**embed a hypothetical answer**", "**abstraction gap**"],
          ["Decomposition", "split compound questions", "multi-hop questions"],
          ["Step-back", "ask a more general question", "grounding in principles"]
        ],
        n: "**Contextualisation is not optional in a chat interface** — " +
          "without it, *and the pricing?* retrieves essentially nothing, and " +
          "this single fix often outweighs every other retrieval improvement " +
          "in a conversational product. **HyDE** is the clever one and worth " +
          "understanding: rather than embedding the question, generate a " +
          "**hypothetical answer** and embed that, because an answer is " +
          "lexically and structurally much closer to real documents than a " +
          "question is. It attacks the abstraction gap directly, and it works " +
          "even when the hypothetical answer is factually wrong, since only " +
          "its vocabulary and shape are being used. The costs are the usual " +
          "ones for adding a model call to the critical path: **latency " +
          "(200–800 ms), cost, and a new failure mode** where a rewrite " +
          "changes the meaning of the question. Always keep the original query " +
          "in the retrieval mix rather than replacing it outright."
      },

      miss: [
        {
          w: "Rewriting always improves retrieval.",
          r: "A rewrite can **change the meaning** or discard a critical exact " +
            "term, retrieving worse results. Run the **original query " +
            "alongside** the rewritten one and fuse, rather than replacing it."
        },
        {
          w: "HyDE only works if the hypothetical answer is correct.",
          r: "It works because the hypothetical answer is **lexically and " +
            "structurally similar to real documents** — the right vocabulary " +
            "in the right shape. Factual accuracy is not required; the text is " +
            "used as an embedding probe, not as content."
        },
        {
          w: "It is a nice-to-have for chat interfaces.",
          r: "It is **essential** in multi-turn conversation. Follow-ups full " +
            "of pronouns and ellipsis are close to unretrievable without " +
            "contextualisation, and this is often the highest-impact fix in a " +
            "conversational RAG system."
        },
        {
          w: "One rewrite is enough.",
          r: "**Multi-query** — generating several phrasings and fusing the " +
            "results — reliably improves recall, because different phrasings " +
            "surface different documents. The cost is more retrievals per " +
            "request."
        }
      ],

      trade: {
        buys: [
          "Makes conversational follow-ups retrievable at all.",
          "Bridges the abstraction gap via HyDE.",
          "Multi-query improves recall measurably.",
          "Handles compound and multi-hop questions.",
          "Cheap relative to the improvement in chat systems."
        ],
        costs: [
          "200–800 ms of added latency on the critical path.",
          "An extra model call per query.",
          "A rewrite can change or narrow the meaning.",
          "Multi-query multiplies retrieval cost.",
          "Another component to monitor and debug."
        ],
        avoid: [
          "Queries are single-turn and already well formed.",
          "Latency budget is very tight.",
          "Queries are exact identifiers that must not be altered.",
          "You cannot measure whether it helps."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "metadata-filtering",

      why: {
        before: "Vector search ranks the whole corpus by semantic similarity, " +
          "which treats every document as equally eligible.",
        problem: "Eligibility is often a hard constraint, not a preference. " +
          "A user must not see another tenant's documents. A question about " +
          "current policy must not be answered from a 2019 version. *Similar " +
          "but not permitted* and *similar but superseded* are **correctness " +
          "and security failures**, not ranking imperfections — and no amount " +
          "of similarity tuning makes them safe.",
        shift: "**Attach structured attributes to each chunk and constrain the " +
          "search by them.** Tenant, date, document type, source, access " +
          "level. Filtering turns soft ranking into a hard boundary — which is " +
          "the only acceptable mechanism for access control, since similarity " +
          "scores can never guarantee exclusion."
      },

      num: {
        t: "How filters are applied, and why it matters",
        h: ["Strategy", "How", "Problem"],
        r: [
          ["**Pre-filter**", "**restrict, then search**", "**can be slow — breaks index pruning**"],
          ["**Post-filter**", "**search, then discard**", "**may return fewer than k, or none**"],
          ["**Filtered index (native)**", "**filter inside traversal**", "**best — needs DB support**"],
          ["Partitioned indexes", "one index per tenant", "**strong isolation, more overhead**"]
        ],
        n: "**Post-filtering is the trap** and it is very common: search for " +
          "the top 10, then discard those failing the filter, and you may be " +
          "left with two results — or none — while perfectly good matching " +
          "documents sat at rank 11 to 50. Users see empty results for a " +
          "well-stocked corpus. **Pre-filtering** is correct but can be slow, " +
          "because approximate indexes like HNSW rely on graph traversal that " +
          "a restrictive filter disrupts, in the worst case degrading to a " +
          "brute-force scan. Modern vector databases implement **filtered " +
          "search natively** inside the traversal, which is what you want — " +
          "check which strategy yours actually uses, because the failure is " +
          "silent. For **multi-tenancy specifically**, a filter is the minimum " +
          "and separate indexes or namespaces per tenant are safer: a filter " +
          "omitted through a code path bug leaks data across tenants, and that " +
          "is a much worse outcome than a slow query."
      },

      miss: [
        {
          w: "Post-filtering is equivalent to pre-filtering.",
          r: "Post-filtering retrieves `k` then discards, so it can return " +
            "**far fewer than `k`** — sometimes zero — while valid matches sat " +
            "just outside the original cut. It produces empty results on " +
            "corpora that clearly contain answers."
        },
        {
          w: "Filters make vector search faster by reducing the candidate set.",
          r: "Often the **opposite**. Approximate indexes such as HNSW depend " +
            "on graph traversal, and a restrictive filter disrupts it — in the " +
            "worst case forcing a brute-force scan. Native filtered search " +
            "exists specifically to avoid this."
        },
        {
          w: "A tenant filter is sufficient isolation for multi-tenancy.",
          r: "It is the **minimum**. One code path that forgets the filter " +
            "leaks data across tenants. Separate indexes or namespaces make " +
            "the isolation structural rather than dependent on every query " +
            "being written correctly."
        },
        {
          w: "You can add metadata later when you need it.",
          r: "Metadata is attached at **ingestion**. Adding a field later " +
            "usually means **re-ingesting the corpus**. Decide the attributes " +
            "up front — tenant, date, source, type, access level — even if you " +
            "do not filter on all of them yet."
        }
      ],

      trade: {
        buys: [
          "Hard constraints where similarity cannot be trusted.",
          "The only sound mechanism for access control in retrieval.",
          "Freshness control — exclude superseded documents.",
          "Improves precision by removing ineligible material.",
          "Enables per-tenant and per-source scoping."
        ],
        costs: [
          "Can slow approximate search substantially.",
          "Post-filtering silently returns too few results.",
          "Metadata must be decided at ingestion time.",
          "Adding fields later means re-ingesting.",
          "A filter is weaker isolation than separate indexes."
        ],
        avoid: [
          "The corpus is single-tenant and uniformly current.",
          "The attribute is a preference, not a constraint — rank on it.",
          "Your vector store only supports post-filtering and results " +
            "matter.",
          "The filter would exclude nearly everything — restructure instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grounding",

      why: {
        before: "A model answers from **parametric knowledge** — whatever it " +
          "absorbed during training. That knowledge is frozen at a cutoff, " +
          "unattributable, and impossible to correct without retraining.",
        problem: "For most real applications that is disqualifying. Answers " +
          "about current policy, private documents or recent events are either " +
          "unavailable or confidently wrong, and there is **no way to check " +
          "where an answer came from**. A user cannot verify it and an auditor " +
          "cannot trace it.",
        shift: "**Supply source material at inference time and require the " +
          "answer to come from it.** Grounding shifts the model's role from " +
          "*recall the answer* to *read these sources and answer from them*, " +
          "which makes answers **current** (sources are updated, not the " +
          "model), **verifiable** (citations point at real text) and " +
          "**correctable** (fix the document, not the weights)."
      },

      num: {
        t: "What grounding changes",
        h: ["Property", "Parametric only", "Grounded"],
        r: [
          ["Freshness", "**frozen at cutoff**", "**as current as the source**"],
          ["**Verifiability**", "**none**", "**citations to real text**"],
          ["Private data", "**impossible**", "**yes**"],
          ["Correcting an error", "**retrain**", "**edit the document**"],
          ["**Hallucination**", "**high**", "**reduced, not eliminated**"],
          ["Cost per query", "low", "**retrieval + more tokens**"]
        ],
        n: "The **hallucination** row is the one to be honest about: grounding " +
          "**reduces** ungrounded claims and does not remove them. Models " +
          "blend retrieved context with parametric knowledge and add plausible " +
          "connective detail, which is why **faithfulness must be measured** " +
          "rather than assumed. Two things materially improve grounding beyond " +
          "simply supplying documents. **Requiring inline citations** makes " +
          "unsupported claims visible to the user and measurably reduces them. " +
          "And **explicitly instructing the model to say when the context does " +
          "not contain the answer** matters more than it sounds — the default " +
          "behaviour is to produce something helpful-looking, and *I don't " +
          "have that information* is a correct answer that models will not " +
          "give unless asked to. Grounding is also weaker than it appears when " +
          "the sources conflict or are outdated: **a faithful answer to a " +
          "wrong document is still wrong**, so corpus quality becomes the " +
          "limiting factor."
      },

      miss: [
        {
          w: "Grounding eliminates hallucination.",
          r: "It **reduces** it. Models still blend parametric knowledge with " +
            "the provided context and add plausible detail. Measuring " +
            "**faithfulness** is how you find out how much — the figure is " +
            "rarely 100%."
        },
        {
          w: "Providing documents is enough to ground an answer.",
          r: "The model must be **instructed to use only them** and to say " +
            "when the answer is absent. Without that, it happily supplements " +
            "from memory. Requiring **citations** makes unsupported claims " +
            "visible."
        },
        {
          w: "A grounded answer is a correct answer.",
          r: "It is **faithful to the sources**. If a source is outdated or " +
            "wrong, the answer is faithfully wrong. Grounding moves the " +
            "correctness problem into **corpus quality**, which is more " +
            "tractable but not solved."
        },
        {
          w: "Longer context windows remove the need for retrieval.",
          r: "They raise the ceiling and do not remove the need. Cost scales " +
            "with tokens, attention dilutes over long contexts, and most " +
            "corpora are far larger than any window. Retrieval selects **what " +
            "is worth putting in**."
        }
      ],

      trade: {
        buys: [
          "Answers as current as the underlying sources.",
          "Verifiable through citations.",
          "Access to private and proprietary data.",
          "Errors fixed by editing documents, not retraining.",
          "Substantially reduced hallucination."
        ],
        costs: [
          "Retrieval infrastructure to build and operate.",
          "More tokens per request — higher cost and latency.",
          "Bounded by retrieval quality and corpus quality.",
          "Does not eliminate ungrounded claims.",
          "A faithful answer to a wrong source is still wrong."
        ],
        avoid: [
          "The task is creative rather than factual.",
          "There is no authoritative source to ground against.",
          "The corpus is unreliable — fix data quality first.",
          "Everything needed fits in the prompt already."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "in-context-learning",

      why: {
        before: "Adapting a model to a new task meant **fine-tuning**: collect " +
          "labelled examples, run a training job, produce and host a new set " +
          "of weights. Days of work and a separate artefact per task.",
        problem: "That is far too slow and expensive for the long tail of " +
          "tasks. Most practical needs — extract these fields, classify in " +
          "this taxonomy, match this output format — do not justify a training " +
          "run, and each fine-tuned model is another thing to version and " +
          "serve.",
        shift: "**Put examples in the prompt.** Sufficiently large models " +
          "infer the task from demonstrations at inference time, with **no " +
          "weight updates at all**. This was not designed — it **emerged** " +
          "with scale, and it is the single property that made LLMs generally " +
          "useful, because it collapses adaptation from a training pipeline " +
          "into a prompt edit."
      },

      num: {
        t: "In-context learning against fine-tuning",
        h: ["", "In-context", "Fine-tuning"],
        r: [
          ["Setup time", "**minutes**", "**hours to days**"],
          ["Examples needed", "**1–50**", "**hundreds to thousands**"],
          ["Weights changed", "**none**", "yes"],
          ["Cost per request", "**higher — examples are tokens**", "**lower**"],
          ["**Switch tasks**", "**change the prompt**", "**a separate model**"],
          ["**Best at high volume**", "**no**", "**yes — amortises**"]
        ],
        n: "The economics decide between them: in-context learning pays " +
          "**per request** because the examples occupy tokens every time, " +
          "while fine-tuning pays **once** and then serves cheaply — so " +
          "prompting wins for low-volume and experimental work and fine-tuning " +
          "wins at high volume. **Prompt caching changes this arithmetic " +
          "substantially**, since a stable block of examples at the front of " +
          "the prompt becomes roughly 90% cheaper to reuse. Two practical " +
          "findings worth carrying: the **format and distribution of examples " +
          "matter more than their labels being correct** — research has shown " +
          "models still learn the task from demonstrations with randomised " +
          "labels, indicating they are learning the shape of the task more " +
          "than the mapping; and **example order affects results measurably**, " +
          "with recency effects favouring whatever appears last. Diverse " +
          "examples covering edge cases beat many similar ones."
      },

      miss: [
        {
          w: "The model learns from the examples the way training does.",
          r: "**No weights change.** The examples condition the forward pass " +
            "only, and the effect disappears entirely when the prompt does. " +
            "*Learning* here is inference-time conditioning, not parameter " +
            "adaptation."
        },
        {
          w: "More examples always give better results.",
          r: "Gains flatten quickly — often after 5 to 10 — while cost keeps " +
            "rising and long prompts risk the *lost in the middle* effect. " +
            "**Diverse examples covering edge cases** beat many similar ones."
        },
        {
          w: "The labels in the examples must be correct.",
          r: "Research found models still learn the task with **randomised " +
            "labels**, indicating they learn the **format and distribution** " +
            "more than the mapping. Correct labels help, and the shape of the " +
            "demonstration matters more than expected."
        },
        {
          w: "In-context learning always beats fine-tuning now.",
          r: "Fine-tuning wins on **high-volume production** — no example " +
            "tokens per request, lower latency, and better consistency on " +
            "narrow tasks. Prompting wins on speed of iteration and task " +
            "switching. Volume decides."
        }
      ],

      trade: {
        buys: [
          "Task adaptation in minutes with no training.",
          "Works from a handful of examples.",
          "Switch tasks by changing the prompt.",
          "No model artefacts to version or host.",
          "Fast iteration — edit and rerun."
        ],
        costs: [
          "Examples consume tokens on every request.",
          "Higher latency from longer prompts.",
          "Consumes context that could hold retrieved material.",
          "Sensitive to example order and formatting.",
          "Less consistent than fine-tuning on narrow tasks."
        ],
        avoid: [
          "Volume is high and the task is fixed — **fine-tune**.",
          "The context window is needed for retrieved documents.",
          "The task needs behaviour no prompt reliably produces.",
          "Latency is critical and examples are long."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
