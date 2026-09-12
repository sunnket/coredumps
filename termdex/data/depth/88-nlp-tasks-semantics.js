/* ==========================================================================
   Depth pass 88 — NLP batch 3: Semantic discovery, translation, synthesis & evaluation.
   Topic Modelling, Machine Translation, Text Summarisation,
   Question Answering, Information Extraction, Knowledge Graph, BLEU.

   Latent Dirichlet priors decompose thematic discourse mixtures;
   bilingual cross-entropy decoders ground cross-lingual syntactic transfers.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "topic-modelling",

      why: {
        before: "Exploratory analysis of large text corpora required reading thousands of documents manually or assigning documents to static, rigid human taxonomies that failed to capture emergent themes.",
        problem: "Massive text collections (customer support logs, scientific literature, news feeds) contain overlapping, unobserved thematic structures that cannot be discovered with simple keyword search or supervised classification without labels.",
        shift: "**Topic Modelling: Unsupervised probabilistic discovery of latent semantic themes across document collections.** Advanced from Latent Semantic Analysis (LSA via SVD) to Latent Dirichlet Allocation (LDA with Bayesian priors) and modern neural clustering models (BERTopic, Top2Vec)."
      },

      num: {
        t: "Topic Modelling Paradigms: Statistical Assumptions, Scalability & Coherence",
        h: ["Methodology", "Core Mechanism", "Topic Representation", "Semantic Coherence", "Handling Out-of-Vocabulary"],
        r: [
          ["LSA (Deerwester 1990)", "Truncated SVD on TF-IDF ($X \\approx U \\Sigma V^T$)", "Orthogonal singular vectors", "Low (orthogonal constraint)", "Fold-in projection"],
          ["pLSA (Hofmann 1999)", "Maximum Likelihood via EM", "Conditional distributions $P(w \\mid z)$", "Moderate (overfits easily)", "Cannot model unseen documents"],
          ["LDA (Blei et al. 2003)", "Hierarchical Bayesian model (Dirichlet priors)", "Multinomial word distributions", "High (interpretable word lists)", "Variational inference / Gibbs"],
          ["BERTopic (Grootendorst 2022)", "Sentence Transformer + UMAP + HDBSCAN + c-TF-IDF", "Contextual clusters + key terms", "Very High (preserves syntax & context)", "Direct embedding inference"]
        ],
        n: "Latent Dirichlet Allocation (LDA) models documents as finite mixtures over an underlying set of $K$ latent topics, where each topic is characterized by a Dirichlet distribution over words. The generative process assumes: for each document $d$, draw topic proportions $\\theta_d \\sim \\text{Dirichlet}(\\alpha)$; for each token $w_{d,n}$, sample a topic assignment $z_{d,n} \\sim \\text{Multinomial}(\\theta_d)$, and sample a word from $P(w \\mid z_{d,n}, \\beta) \\sim \\text{Multinomial}(\\beta_{z_{d,n}})$, where $\\beta \\sim \\text{Dirichlet}(\\eta)$. Because the true posterior distribution $P(\\theta, z, \\beta \\mid w)$ is analytically intractable due to coupling across terms, inference is conducted using collapsed Gibbs sampling or mean-field variational inference. Modern frameworks such as BERTopic replace bag-of-words assumptions by projecting pre-trained contextual embeddings into low-dimensional topological manifolds via UMAP, clustering via HDBSCAN, and extracting class-based TF-IDF (c-TF-IDF) keywords."
      },

      miss: [
        {
          w: "Topic models assign each document to a single topic.",
          r: "LDA is fundamentally a mixed-membership model; every document is represented as a continuous probability distribution across all $K$ topics (e.g., 60% technology, 30% finance, 10% politics)."
        },
        {
          w: "LDA automatically determines the optimal number of topics ($K$).",
          r: "The hyperparameter $K$ must be specified beforehand. Practitioners must sweep across multiple values of $K$ and evaluate topic coherence metrics ($C_v$ or $U_{\\text{mass}}$) alongside human interpretability checks to select an optimal $K$."
        },
        {
          w: "LDA works effectively on short texts such as tweets, SMS, or search queries.",
          r: "LDA relies on word co-occurrence frequencies within the same document. Short texts suffer from extreme document-level word sparsity, leading to unstable topic distributions unless aggregated into pseudo-documents or modeled with Biterm Topic Models (BTM)."
        },
        {
          w: "Topic modelling is superseded by clustering raw word embeddings.",
          r: "Naive $k$-means on average document embeddings collapses due to the curse of dimensionality and anisotropic embedding spaces, producing dense uninterpretable centroids. Dimensionality reduction (UMAP) and density clustering (HDBSCAN) are required."
        }
      ],

      trade: {
        buys: [
          "Zero human labeling required: discovers emergent patterns, trend shifts, and hidden themes directly from raw text.",
          "Provides interpretable quantitative distributions of document themes suitable for downstream filtering and analytics.",
          "Modern neural methods (BERTopic) preserve semantic nuance and handle subword polysemy.",
          "Generates document-level semantic coordinates useful for similarity search, recommendation, and deduplication."
        ],
        costs: [
          "Classical LDA is sensitive to stop words, vocabulary pruning, and hyperparameter tuning ($\\alpha, \\beta, K$).",
          "Interpreting topic labels requires human post-processing or auxiliary LLM zero-shot labeling.",
          "Gibbs sampling inference on massive text corpora can be computationally intensive.",
          "Topics can fluctuate significantly between random initialization seeds unless random state is fixed."
        ],
        avoid: [
          "Do not run classical LDA without rigorous stop-word removal and low-frequency token filtering.",
          "Never evaluate topic models purely on perplexity; perplexity often anti-correlates with human topic interpretability.",
          "Avoid applying standard LDA to single-sentence inputs without prior sentence pooling or clustering."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "machine-translation",

      why: {
        before: "Cross-lingual communication required human translators or rule-based machine translation (RBMT) systems with thousands of handcrafted grammatical transfer rules and bilingual dictionaries that broke down on idiomatic expressions.",
        problem: "Natural languages do not map one-to-one; syntactic word order, morphological inflections, grammatical gender, and idioms diverge radically across language families.",
        shift: "**Machine Translation (MT): Automated translation of text or speech from a source language to a target language.** Progressed from phrase-based statistical MT (SMT with IBM models and Moses) to neural encoder-decoder architectures (Seq2Seq with attention) and transformer foundation models (NLLB, DeepL, Google Translate)."
      },

      num: {
        t: "Machine Translation Paradigms: Latency, Resource Cost & BLEU Benchmarks (WMT En-De)",
        h: ["Paradigm", "Core Mathematical Formulation", "WMT En-De BLEU", "Inference Latency", "Alignment Mechanism"],
        r: [
          ["Rule-Based (RBMT)", "Hand-crafted syntactic tree transfer", "~14.0", "~20 ms", "Morphological & syntactic parse trees"],
          ["Statistical (SMT / Moses)", "$P(T \\mid S) \\propto P(S \\mid T) P(T)$ (Noisy channel)", "22.5", "~150 ms", "Phrase table + lexical distortion model"],
          ["RNN Seq2Seq + Attention", "Bidirectional LSTM + Bahdanau attention", "28.4", "~350 ms", "Soft alignment cross-attention matrix"],
          ["Transformer Base (Vaswani)", "Multi-head cross-attention ($6+6$ layers)", "34.5", "~80 ms", "Full multi-head dot-product attention"],
          ["Multilingual Foundation (NLLB)", "Massive MoE Transformer (200+ languages)", "38.8+", "~180 ms", "Shared universal multilingual semantic space"]
        ],
        n: "In modern Neural Machine Translation (NMT), the standard architecture is an autoregressive encoder-decoder transformer. The encoder maps source sentence tokens $X = (x_1, \\dots, x_S)$ into contextual hidden representations $H = \\text{Encoder}(X) \\in \\mathbb{R}^{S \\times d}$. The autoregressive decoder generates target tokens $Y = (y_1, \\dots, y_T)$ sequentially by maximizing conditional log-likelihood: $\\mathcal{L} = \\sum_{t=1}^T \\log P(y_t \\mid y_{<t}, H)$. Each decoder layer incorporates two attention mechanisms: causal masked self-attention over previously generated target tokens, and cross-attention over encoder output representations $H$, allowing the decoder to dynamically attend to relevant source words regardless of word order reordering (e.g., German verb-final syntax vs English SVO)."
      },

      miss: [
        {
          w: "Machine translation translates sentences word-by-word using bilingual lookup tables.",
          r: "Word-by-word translation produces incoherent output because grammatical structure differs across languages. Modern NMT translates whole phrases in context, rearranging sentence clauses to respect target language syntax."
        },
        {
          w: "High BLEU score guarantees that a translation is completely fluent and factual.",
          r: "BLEU only measures surface n-gram overlap with reference translations. A translation can achieve high BLEU while hallucinating negation (turning 'do not enter' into 'enter') or misgendering pronouns."
        },
        {
          w: "NMT models translate between rare languages by training direct bilingual pairs.",
          r: "Low-resource language pairs lack bilingual parallel text. Modern multilingual systems use pivot translation (translating through English) or zero-shot multilingual pre-training sharing a single universal semantic embedding space."
        },
        {
          w: "Greedy decoding produces the best translations in NMT.",
          r: "Greedy decoding frequently falls into local sub-optimal syntactic traps. Practical NMT systems employ beam search ($k = 4 \\text{ to } 6$) with length penalty normalization $\\alpha$ to balance fluency and completeness."
        }
      ],

      trade: {
        buys: [
          "Bridges global linguistic barriers: enables instantaneous real-time translation across hundreds of languages.",
          "End-to-end differentiable neural training eliminates complex multi-stage statistical pipelines (phrase extraction, tuning).",
          "Naturally handles complex grammatical reordering, morphological inflections, and gender agreements.",
          "Zero-shot transfer allows translation between language pairs that never co-occurred in bilingual training pairs."
        ],
        costs: [
          "Decoder autoregression generates tokens sequentially, incurring linear latency with target sentence length.",
          "Catastrophic hallucinations can occur on out-of-domain inputs, noisy OCR text, or adversarial prompts.",
          "Severe performance degradation on low-resource and dialectal languages lacking large parallel corpora.",
          "Document-level coherence and gender consistency across long paragraphs remain challenging for sentence-level models."
        ],
        avoid: [
          "Never evaluate translation quality exclusively with BLEU; incorporate COMET, chrF, and human MQM assessments.",
          "Do not use sentence-by-sentence translation for long legal or literary texts where cross-sentence coreference matters.",
          "Avoid deploying unconstrained beam search with beam size $> 10$, which often causes translation brevity penalties."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "text-summarisation",

      why: {
        before: "Condensing long legal documents, research papers, or news articles required human domain experts spending hours reading and synthesizing source text into abstracts.",
        problem: "Information overload overwhelms readers; documents contain redundant phrasing, rhetorical filler, and complex structural diversions that obscure core factual takeaways.",
        shift: "**Text Summarisation: Generating a concise, coherent, and factual distillation of a longer source document.** Evolved from extractive sentence ranking (TextRank, LexRank) to abstractive neural generation using sequence-to-sequence transformers (BART, T5, Pegasus, LLMs)."
      },

      num: {
        t: "Summarisation Paradigms: Extractive vs Abstractive Architectures & Trade-offs",
        h: ["Paradigm", "Representative System", "Primary Mechanism", "ROUGE-1 Score", "Hallucination Risk"],
        r: [
          ["Graph Extractive", "TextRank / LexRank", "PageRank over sentence TF-IDF similarity graphs", "~35.0", "Zero (exact source extraction)"],
          ["Neural Extractive", "BERTSumExt", "Binary sentence classification on `[CLS]` tokens", "~43.2", "Zero (extracts verbatim sentences)"],
          ["Encoder-Decoder Abstractive", "BART-large / Pegasus", "Pre-trained denoising autoencoder + generation", "~47.5", "Low-to-Moderate (subtle factual drift)"],
          ["Long-Context Abstractive", "LED / Longformer", "Local window + global sparse self-attention", "~46.8", "Moderate (long-range source confusion)"],
          ["Instruction-Tuned LLM", "Claude 3.5 / GPT-4o", "Direct autoregressive multi-step synthesis", "~51.0+", "Low (with CoT & source grounding)"]
        ],
        n: "Summarization bifurcates into two distinct paradigms: **Extractive** and **Abstractive**. Extractive summarization identifies and extracts key sentences directly from the source without alteration, framing the task as sentence scoring: $y_i = \\sigma(W h_{\\text{sent}_i} + b)$. It guarantees 100% factual faithfulness to the text but suffers from poor narrative flow and redundancy. Abstractive summarization generates novel sentences, paraphrasing and consolidating ideas using sequence-to-sequence models: $P(S_{\\text{summary}} \\mid D_{\\text{source}}) = \\prod_{t=1}^L P(w_t \\mid w_{<t}, D_{\\text{source}})$. Models like PEGASUS are pre-trained specifically on Gap Sentences Generation (GSG), where principal sentences are masked and reconstructed. While abstractive models deliver human-like fluency, they introduce the risk of factual hallucinations and unfaithful entity binding."
      },

      miss: [
        {
          w: "Abstractive summarization is strictly superior to extractive summarization for all industrial applications.",
          r: "In high-liability domains such as legal discovery, financial compliance, and clinical patient trials, extractive summarization is often legally mandated because abstractive models risk introducing fabricated claims or subtle negation errors."
        },
        {
          w: "ROUGE score measures the factual accuracy of a summary.",
          r: "ROUGE only measures surface n-gram overlap between candidate and reference summaries. An abstractive summary can flip a critical medical fact ('patient showed NO cancer') and still score 90%+ on ROUGE."
        },
        {
          w: "Summarizing long documents is solved by simply truncating to the first few paragraphs.",
          r: "While news articles follow an 'inverted pyramid' structure where the lead paragraph contains key facts, scientific papers, financial SEC 10-K filings, and legal briefs place critical findings, risks, and conclusions at the end."
        },
        {
          w: "Compression ratio does not affect summary quality.",
          r: "Aggressive compression ratios (e.g., condensing 10,000 words to 100 words) drastically increase hallucination rates because the model is forced to over-generalize and synthesize across disparate claims."
        }
      ],

      trade: {
        buys: [
          "Dramatically reduces cognitive load: distills hours of reading material into actionable takeaways in seconds.",
          "Abstractive systems synthesize disparate paragraphs, resolving coreferences and eliminating rhetorical fluff.",
          "Enables multi-document summarization (aggregating news coverage from 20 outlets into one briefing).",
          "Customizable summarization styles (executive bullet points, technical abstract, layman explanation)."
        ],
        costs: [
          "Abstractive models introduce hallucination risk: unfaithful entity, numerical, or causal attribution.",
          "High compute and memory overhead when processing long-context source documents ($> 100\\text{k}$ tokens).",
          "Automated evaluation metrics (ROUGE/BLEU) correlate poorly with human judgments of factual consistency.",
          "Prone to 'lost in the middle' phenomenon: transformers attend disproportionately to the start and end of source texts."
        ],
        avoid: [
          "Never deploy abstractive summarization in regulated medical/legal workflows without automated fact-checking guardrails.",
          "Do not rely solely on ROUGE to assess summarization models; use LLM-as-a-judge or NLI-based faithfulness checkers.",
          "Avoid summarizing documents exceeding context window limits with naive chunk concatenation without hierarchical aggregation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "question-answering",

      why: {
        before: "Finding answers in text required entering keywords into a search engine, clicking through ranked documents, and skimming full pages manually to locate the exact sentence containing the answer.",
        problem: "Users ask natural language questions ('What is the capital of Peru?') requiring precise factual answers, not an unordered list of 10 blue links containing thousands of irrelevant words.",
        shift: "**Question Answering (QA): Automated extraction or synthesis of natural language answers to user queries grounded in unstructured text or knowledge bases.** Transitioned from rule-based factoid systems to reading comprehension span extractors (SQuAD with BiDAF and BERT) and generative RAG systems."
      },

      num: {
        t: "Question Answering Benchmarks & Architectural Evolution (SQuAD 2.0 & Natural Questions)",
        h: ["Architecture / Benchmark", "Paradigm", "SQuAD 2.0 F1", "NQ Exact Match", "Unanswerable Query Handling"],
        r: [
          ["BiDAF (Seo et al. 2016)", "Bidirectional Attention Flow (RNN)", "67.7%", "24.5%", "Poor (forces span prediction)"],
          ["BERT-large (Devlin 2018)", "Cross-attention span classification", "83.1%", "39.8%", "Predicts null token $[0, 0]$"],
          ["RoBERTa-large (Liu 2019)", "Optimized pre-trained masked LM", "89.8%", "45.2%", "Null token thresholding"],
          ["Dense Passage Retrieval + RAG", "Dual encoder retrieval + BART generator", "91.2%", "48.5%", "Retrieval threshold gating"],
          ["State-of-the-Art LLM (CoT)", "In-context generative retrieval", "94.5%+", "58.2%+", "Generates 'Not found in context'"]
        ],
        n: "Question Answering is primarily framed in two modes: **Extractive QA** (Reading Comprehension) and **Generative QA** (Open-Domain QA). In extractive QA (e.g., SQuAD), given question $Q$ and passage $P$, the system predicts the start index $s$ and end index $e$ of the answer span directly inside $P$. A transformer scores tokens via start vector $w_{\\text{start}}$ and end vector $w_{\\text{end}}$: $P_{\\text{start}}(i) = \\frac{\\exp(h_i \\cdot w_{\\text{start}})}{\\sum_j \\exp(h_j \\cdot w_{\\text{start}})}$ and $P_{\\text{end}}(j) = \\frac{\\exp(h_j \\cdot w_{\\text{end}})}{\\sum_k \\exp(h_k \\cdot w_{\\text{end}})}$. The predicted span maximizes $P_{\\text{start}}(i) \\cdot P_{\\text{end}}(j)$ subject to $i \\le j \\le i + L_{\\max}$. In open-domain QA, dense retrieval (DPR) first retrieves top-$k$ relevant passages from millions of documents, followed by an autoregressive reader synthesizing a unified answer."
      },

      miss: [
        {
          w: "Extractive QA models can answer questions where the answer must be synthesized from multiple separate sentences.",
          r: "Standard extractive span predictors can only select a single contiguous string slice from the text. If an answer requires multi-hop reasoning or aggregating facts across two paragraphs, extractive QA fails completely."
        },
        {
          w: "If a passage contains the exact answer, an extractive QA model is guaranteed to find it.",
          r: "Extractive models often suffer from lexical distractors—distractor sentences that share high word overlap with the question but make contradictory assertions, tricking the attention mechanism."
        },
        {
          w: "Generative QA is always superior to extractive QA in production.",
          r: "Generative QA models can hallucinate plausible-sounding facts, introduce conversational fluff, and cost $50\\times$ more in latency and compute. Extractive QA remains the gold standard for high-speed, zero-hallucination compliance queries."
        },
        {
          w: "Unanswerable questions can simply be ignored during QA model training.",
          r: "Training only on answerable questions causes models to develop severe over-confidence, forcing them to guess false spans when confronted with unanswerable queries. SQuAD 2.0 introduced mandatory null-span training."
        }
      ],

      trade: {
        buys: [
          "Transforms document search from passive browsing into direct, precise factual answering.",
          "Extractive QA delivers sub-10ms inference with zero risk of fabricated hallucinated vocabulary.",
          "Open-domain QA and RAG scale factual retrieval to multi-million document corporate repositories.",
          "Supports conversational multi-turn inquiry when integrated with conversation state tracking."
        ],
        costs: [
          "Extractive models are constrained to contiguous text spans and cannot synthesize or paraphrase.",
          "Multi-hop question answering requires complex graph reasoning or multi-step retrieval chains.",
          "Performance is bounded by retrieval recall: if the retriever fails to fetch the passage, the reader fails.",
          "Generative QA introduces operational costs for guardrails to detect and suppress ungrounded answers."
        ],
        avoid: [
          "Never evaluate QA systems without testing unanswerable, adversarial, or out-of-passage questions.",
          "Do not deploy extractive QA models on questions requiring mathematical calculation or multi-hop synthesis.",
          "Avoid naive keyword retrieval as the sole passage retrieval engine for complex semantic questions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "information-extraction",

      why: {
        before: "Populating relational databases from news articles, medical reports, or police records required armies of data entry analysts reading unstructured prose and manually keying records into SQL tables.",
        problem: "Human language is unstructured, noisy, and grammatically diverse; converting billions of web pages or medical charts into machine-readable relation tuples at scale is manually impossible.",
        shift: "**Information Extraction (IE): Algorithmic extraction of structured information (entities, relationships, events, attributes) from unstructured natural language text.** Unified named entity recognition, relation extraction (RE), coreference resolution, and event extraction into coherent automated structured data pipelines."
      },

      num: {
        t: "Information Extraction Sub-Tasks, Target Representations & SOTA Methodologies",
        h: ["IE Sub-Task", "Input Example", "Extracted Structured Output", "SOTA Approach", "Key Difficulty"],
        r: [
          ["Entity Extraction (NER)", "'Satya Nadella leads Microsoft'", "`[('Satya Nadella', PER), ('Microsoft', ORG)]`", "Transformer Token Classifier / Spans", "Boundary disambiguation"],
          ["Relation Extraction (RE)", "'Marie Curie was born in Warsaw'", "`BornIn(Marie Curie, Warsaw)`", "Cross-Encoder / Joint Entity-Relation", "Distant supervision noise"],
          ["Coreference Resolution", "'Alice arrived. She sat down.'", "`Cluster: {Alice, She}`", "Higher-Order Span Ranking (e.g. c2f)", "Long-range pronoun binding"],
          ["Event Extraction (EE)", "'The earthquake struck Peru on Monday'", "`Event: NaturalDisaster, Loc: Peru, Time: Monday`", "Template-filling autoregressive models", "Multi-argument role assignment"],
          ["Slot Filling / Dialog", "'Book a flight to Boston tomorrow'", "`{destination: 'BOS', date: '+1d'}`", "Joint Intent-Slot Encoders", "Normalization of dates/places"]
        ],
        n: "Information Extraction transforms unstructured documents $\\mathcal{D}$ into structured relational tuples: $\\mathcal{R} = \\{ (e_1, r, e_2) \\mid e_1, e_2 \\in \\mathcal{E}, r \\in \\mathcal{T} \\}$. In supervised **Relation Extraction**, the model is trained to classify the semantic connection between entity pairs marked with special tokens in the text: `[E1] Marie Curie [/E1] was born in [E2] Warsaw [/E2]`. Cross-encoders process the concatenated sequence through self-attention layers, outputting a relation distribution $P(r \\mid x)$. In large-scale settings where manual labeling is impossible, **Distant Supervision** aligns existing Knowledge Base facts with text to generate noisy training data automatically, resolved using multi-instance learning where loss is computed over bags of sentences containing entity pairs."
      },

      miss: [
        {
          w: "Information extraction is simply another name for Named Entity Recognition.",
          r: "NER is merely the initial step of IE. IE encompasses relation extraction, entity linking (grounding 'Paris' to Wikidata Q90), coreference resolution, event temporal ordering, and database schema mapping."
        },
        {
          w: "Distant supervision produces clean, human-quality training data for relation extraction.",
          r: "Distant supervision generates severe false positive noise (e.g., matching the KB relation `BornIn(Obama, Hawaii)` with the sentence 'Obama held a rally in Hawaii'). Multi-instance learning and reinforcement learning denoisers are necessary."
        },
        {
          w: "A pipeline approach (NER first, then Relation Extraction) is optimal for production IE.",
          r: "Pipeline architectures suffer from catastrophic error propagation: if the NER stage misses an entity boundary, the relation classifier never sees the entity pair. Joint Entity-Relation models learn shared representations that avoid this bottleneck."
        },
        {
          w: "LLMs have made formal Information Extraction schemas obsolete.",
          r: "LLMs generate free-form text that often fails strict JSON schemas, produces non-deterministic entity IDs, and invents hallucinated relation types unless constrained by strict structured decoding tools (Outlines, Instructor, Pydantic)."
        }
      ],

      trade: {
        buys: [
          "Bridges the gap between unstructured human narrative and structured SQL/graph databases.",
          "Enables automated construction and continuous maintenance of enterprise knowledge graphs.",
          "Powers automated competitive intelligence, pharmacovigilance adverse event mining, and financial contract auditing.",
          "Standardizes entity mentions to canonical global identifiers (Wikidata, UMLS, Freebase)."
        ],
        costs: [
          "Pipeline architectures suffer from compound errors cascading across each extraction phase.",
          "Joint models are computationally demanding, scaling quadratically with the number of candidate entity pairs.",
          "Extracting rare or domain-specific relations requires expensive expert annotation or complex prompt tuning.",
          "Struggles with coreference resolution across multi-page, multi-speaker conversational documents."
        ],
        avoid: [
          "Do not build cascading pipelines where downstream relation extractors cannot flag upstream NER errors.",
          "Never ingest distant supervision relation labels directly without probabilistic filtering or multi-instance weighting.",
          "Avoid unconstrained LLM parsing for mission-critical databases without Pydantic/JSON schema validation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "knowledge-graph",

      why: {
        before: "Relational databases enforced rigid tabular schemas that made querying multi-hop relationships computationally prohibitive, while unstructured text documents left conceptual connections buried across disconnected silos.",
        problem: "Real-world knowledge is inherently networked, heterogeneous, and deeply interconnected; finding non-obvious links across entities (e.g., supply chain vulnerabilities or corporate ownership structures) requires traversing multi-hop relationship paths.",
        shift: "**Knowledge Graph (KG): A graph-structured knowledge base that stores factual knowledge as interconnected networks of entities and relations (triples: subject-predicate-object).** Pioneers include Google Knowledge Graph, Wikidata, and DBpedia, pairing graph databases (Neo4j, RDF/SPARQL) with graph embedding models (TransE, RotatE)."
      },

      num: {
        t: "Knowledge Graph Embedding Models: Geometric Spaces, Relations & Symmetries",
        h: ["Model", "Mathematical Scoring Function $f_r(h, t)$", "Geometric Embedding Space", "Symmetry Support", "Inversion Support"],
        r: [
          ["TransE (Bordes 2013)", "$- \\| h + r - t \\|_2$", "Real translation vector space $\\mathbb{R}^d$", "No (fails on symmetric $r$)", "Yes ($r_{\\text{inv}} = -r$)"],
          ["DistMult (Yang 2014)", "$h^T \\text{diag}(r) t$", "Real bilinear vector space $\\mathbb{R}^d$", "Yes (symmetric only)", "No (cannot model asymmetric)"],
          ["ComplEx (Trouillon 2016)", "$\\text{Re}(h^T \\text{diag}(r) \\bar{t})$", "Complex vector space $\\mathbb{C}^d$", "Yes (via Hermitian inner product)", "Yes"],
          ["RotatE (Sun 2019)", "$- \\| h \\circ r - t \\|_2$", "Complex rotation space ($|r_i| = 1$)", "Yes (rotation by $\\pi$)", "Yes (conjugate rotation)"],
          ["GNN / R-GCN (Schlichtkrull)", "Relational message-passing convolutions", "Multi-layer graph neighborhood states", "Yes", "Yes"]
        ],
        n: "A Knowledge Graph $\\mathcal{G} = (\\mathcal{E}, \\mathcal{R}, \\mathcal{T})$ represents facts as RDF triples: $(h, r, t) \\in \\mathcal{T}$, where $h \\in \\mathcal{E}$ is the head entity, $r \\in \\mathcal{R}$ is the relation, and $t \\in \\mathcal{E}$ is the tail entity (e.g., `(Turing, Awarded, NobelPrize)`). Knowledge Graph Embeddings (KGE) project entities and relations into continuous vector spaces $\\mathbb{R}^d$ to perform **Link Prediction**—predicting missing facts $(h, r, ?)$ or $(?, r, t)$. In translational models like TransE, valid triples satisfy the geometric constraint $h + r \\approx t$. In modern Graph Neural Networks (such as Relational Graph Convolutional Networks, R-GCN), entity node embeddings update by accumulating normalized messages across relational edge types: $h_i^{(l+1)} = \\sigma \\left( \\sum_{r \\in \\mathcal{R}} \\sum_{j \\in \\mathcal{N}_i^r} \\frac{1}{c_{i,r}} W_r^{(l)} h_j^{(l)} + W_0^{(l)} h_i^{(l)} \\right)$. KGs serve as the deterministic factual backbone grounding probabilistic LLMs in GraphRAG systems."
      },

      miss: [
        {
          w: "Knowledge graphs and relational databases are identical except for visual graph rendering.",
          r: "Relational tables enforce fixed schemas where joining across 5 hops requires 4 expensive SQL `JOIN` operations that degrade performance exponentially. Graph databases treat relations as first-class physical pointers, enabling constant-time pointer chasing regardless of database scale."
        },
        {
          w: "Once built, a Knowledge Graph contains only verified ground-truth facts.",
          r: "Real-world enterprise KGs contain noisy extractions, contradictory claims from different sources, temporal obsolescence, and incomplete coverage, necessitating continuous link prediction and truth discovery algorithms."
        },
        {
          w: "Graph Neural Networks (GNNs) can replace symbolic Knowledge Graphs entirely.",
          r: "GNNs are continuous, opaque neural representations subject to over-smoothing and catastrophic forgetting. Symbolic KGs provide deterministic provenance, auditable SPARQL/Cypher queries, and absolute factual reproducibility required by regulators."
        },
        {
          w: "GraphRAG is merely querying a vector database with extra steps.",
          r: "Vector databases perform flat nearest-neighbor semantic search on isolated text chunks. GraphRAG traverses structured semantic entity hierarchies, combining global thematic summaries with multi-hop reasoning that vector search cannot discover."
        }
      ],

      trade: {
        buys: [
          "Provides deterministic, auditable, and interpretable factual representations with explicit data provenance.",
          "Enables multi-hop logical reasoning and semantic traversal that vector similarity search cannot perform.",
          "Acts as the definitive factual grounding layer to eliminate hallucinations in enterprise LLM deployments.",
          "Integrates structured and unstructured enterprise silos into a unified ontology-driven semantic data layer."
        ],
        costs: [
          "High manual cost to design, curate, and govern formal ontologies, schemas, and entity resolution pipelines.",
          "Entity disambiguation and resolution at scale across millions of messy records is computationally difficult.",
          "Graph databases require specialized query languages (SPARQL, Cypher) and specialized engineering expertise.",
          "Scalability bottlenecks during massive distributed graph updates and complex multi-hop path traversals."
        ],
        avoid: [
          "Do not build an enterprise knowledge graph without a well-defined business ontology and entity resolution strategy.",
          "Never rely solely on vector search when queries require structural multi-hop relationships across entities.",
          "Avoid using TransE for complex relations involving one-to-many, many-to-one, or symmetric patterns."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bleu",

      why: {
        before: "Evaluating machine translation required human bilingual evaluators manually rating translations for fluency and adequacy, which cost hundreds of dollars per document and took weeks, making rapid iterative model training impossible.",
        problem: "Neural and statistical MT models require evaluating thousands of checkpoint translations per hour; human evaluation is non-reproducible, subjective, and too slow to serve as a fast benchmark metric.",
        shift: "**BLEU (Bilingual Evaluation Understudy): An automated metric computing modified n-gram precision between machine translation output and human references, penalised by a brevity penalty.** Introduced by Papineni et al. in 2002, BLEU became the universal benchmark metric that governed machine translation research for two decades."
      },

      num: {
        t: "BLEU Score Interpretation, N-Gram Weights & Practical Benchmarks",
        h: ["BLEU Score Range", "Qualitative Translation Quality", "Typical Domain Context", "Human Correlation"],
        r: [
          ["$< 10$", "Almost useless, incoherent word salad", "Untrained model / zero-shot distant language", "Very High correlation with failure"],
          ["10 – 19", "Hard to get the gist, heavy grammatical errors", "Low-resource language translation", "Poor"],
          ["20 – 29", "The gist is clear, significant syntactic errors", "Baseline statistical MT or early NMT", "Moderate"],
          ["30 – 40", "Understandable to good translations", "Standard production NMT (WMT benchmarks)", "High on corpus level"],
          ["40 – 50", "High quality, fluent and accurate", "Close language pairs (e.g., Spanish to English)", "Strong on lexical matches"],
          ["$> 60$", "Often higher than human reference agreement", "Near-duplicate sentences or memorized text", "Inverse correlation (overfitting)"]
        ],
        n: "BLEU calculates the geometric mean of modified n-gram precisions $p_n$ (typically for $n=1, 2, 3, 4$) between candidate translation $c$ and reference translations $r$: $\\text{BLEU} = \\text{BP} \\cdot \\exp \\left( \\sum_{n=1}^N w_n \\log p_n \\right)$, where weights are uniformly $w_n = \\frac{1}{4}$. Modified precision clips candidate n-gram matches to the maximum frequency seen in any single reference, preventing repetition gaming ('the the the'). To prevent short translations from inflating precision, the **Brevity Penalty (BP)** heavily penalizes candidates shorter than the effective reference length $r_{\\text{ref}}$: $\\text{BP} = 1$ if $c > r_{\\text{ref}}$, and $\\text{BP} = \\exp(1 - r_{\\text{ref}} / c)$ if $c \\le r_{\\text{ref}}$. BLEU is designed strictly as a corpus-level metric, as individual sentences frequently suffer from zero matches at $n=4$ (causing $\\log(0) = -\\infty$ unless smoothed via Lin or Chen-Cherry smoothing)."
      },

      miss: [
        {
          w: "A sentence-level BLEU score of 0 means the translation is completely incorrect.",
          r: "Sentence-level BLEU evaluates up to 4-grams. If an accurate, fluent translation rephrases the thought using valid synonyms not present in the reference, it may have zero 4-gram matches, producing a sentence BLEU of exactly 0 despite being a good translation."
        },
        {
          w: "BLEU scores can be compared across papers regardless of tokenization or software tools.",
          r: "BLEU is hyper-sensitive to text normalization, tokenization flags, compound splitting, and reference casing. Comparing SacreBLEU scores against custom Python scripts or Moses multi-bleu.perl can produce discrepancies of 2 to 5 BLEU points on identical outputs."
        },
        {
          w: "BLEU measures semantic meaning and factual correctness.",
          r: "BLEU is purely a surface-level lexical string matching metric. It has no concept of semantic embeddings, synonyms, or world facts. Dropping a single negation word ('not') reverses semantic meaning while barely reducing 1-gram precision."
        },
        {
          w: "BLEU of 100 is the ultimate goal of machine translation systems.",
          r: "Two skilled human translators translating the same book rarely achieve higher than 60 BLEU with each other due to natural stylistic divergence. A BLEU near 100 indicates catastrophic overfitting to a specific test set."
        }
      ],

      trade: {
        buys: [
          "Instantaneous, deterministic, and zero-cost computation for continuous regression testing during training.",
          "Corpus-level BLEU historically correlated well with general human adequacy rankings on benchmark competitions.",
          "Language-independent metric that requires no neural models, embeddings, or GPU hardware to evaluate.",
          "Standardized implementations like SacreBLEU provide reproducible comparisons across global academic research."
        ],
        costs: [
          "Completely penalizes valid synonyms, paraphrasing, and alternate syntactic structures absent from references.",
          "Performs poorly at the sentence level due to geometric mean zero-precision clipping.",
          "Blind to critical factual errors: misses swapped entity names, negation flips, and numerical hallucinations.",
          "Gradually superseded in industrial benchmarks by neural evaluation metrics (COMET, BLEURT, and LLM-as-a-Judge)."
        ],
        avoid: [
          "Never report BLEU without specifying the exact SacreBLEU signature (tokenizer, version, case-sensitivity).",
          "Do not optimize loss functions directly against sentence-level BLEU without smoothing algorithms.",
          "Avoid using BLEU as the sole evaluation metric when evaluating LLM-based creative translations."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
