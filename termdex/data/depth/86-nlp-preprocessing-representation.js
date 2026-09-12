/* ==========================================================================
   Depth pass 86 — NLP batch 1: foundational preprocessing & classical representation.
   Natural Language Processing, Corpus, Stemming, Lemmatisation,
   Stop Words, Bag of Words, TF-IDF.

   Morphological normalization reduces lexical inflection; inverse document
   frequencies weight domain-specific signals across sparse vector spaces.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "natural-language-processing",

      why: {
        before: "Early computer science relied on formal programming languages with rigid, unambiguous grammars, " +
          "leaving computers completely unable to parse messy, idiomatic, and ambiguous human speech and text.",
        problem: "Human language is intrinsically ambiguous, multi-modal, context-dependent, and evolving; " +
          "understanding language requires modeling phonetic, syntactic, semantic, and pragmatic layers simultaneously.",
        shift: "**Natural Language Processing (NLP): Computational modeling of human linguistic communication.** " +
          "Transitioned from rule-based Chomsky grammars (1950s-1980s) to statistical empirical models (1990s-2000s) " +
          "and neural foundation transformers (2018-present), unifying comprehension, translation, and generative reasoning."
      },

      num: {
        t: "NLP historical paradigm evolution & architectural milestones",
        h: ["Era / Paradigm", "Core Mathematical Mechanism", "Knowledge Representation", "Primary Failure Mode"],
        r: [
          ["**1. Symbolic / Rule-Based (1950-1990)**", "Expert rules, context-free grammars, parsers", "Hand-coded semantic ontologies & dictionaries", "Brittle: collapses on un-modeled idioms, slang, and typos"],
          ["**2. Statistical NLP (1990-2013)**", "Markov chains, N-grams, Naive Bayes, HMMs, CRFs", "Sparse feature counts & conditional probabilities", "Curse of dimensionality; zero cross-word generalization"],
          ["**3. Neural Embeddings (2013-2018)**", "Word2Vec, GloVe, LSTMs, GRUs, Seq2Seq", "Dense continuous vector spaces ($d \\approx 300$)", "Fixed context bottlenecks; vanishing gradients across time"],
          ["**4. Transformer LLMs (2018-Present)**", "**Self-Attention, Pre-training, RLHF (BERT, GPT)**", "**Distributed contextual foundation models** ($10^{11}$ params)", "Hallucinations, non-determinism, compute intensity"]
        ],
        n: "Natural Language Processing (NLP) is the interdisciplinary domain " +
          "at the intersection of computer science, artificial intelligence, and formal " +
          "linguistics. Linguistic communication operates across five hierarchical layers: " +
          "(1) **Phonetics/Phonology** (acoustic speech signals), " +
          "(2) **Morphology** (internal structure of words and stems), " +
          "(3) **Syntax** (grammatical sentence structure and parse trees), " +
          "(4) **Semantics** (literal meaning of words and propositions), and " +
          "(5) **Pragmatics** (intent, social context, metaphor, and sarcasm). " +
          "Historically, NLP attempted to model these layers through handcrafted symbolic rules " +
          "(Chomsky generative grammars), which failed because human language is full of exceptions. " +
          "The statistical revolution (1990s) introduced probabilistic models evaluated on annotated corpora. " +
          "Finally, the deep learning and **Transformer revolution** unified all sub-disciplines into a " +
          "single paradigm: self-supervised pre-training over trillions of raw tokens, where neural networks " +
          "implicitly learn syntax, world knowledge, translation, and reasoning within a single unified vector space."
      },

      miss: [
        {
          w: "NLP is just regular expressions and string search.",
          r: "String matching searches exact characters. NLP models semantic intent, syntactic structure, grammatical dependencies, coreference, sentiment, and latent conceptual meaning."
        },
        {
          w: "Modern LLMs have completely eliminated all traditional NLP pipelines.",
          r: "High-throughput industrial systems still rely heavily on lightweight classical NLP: spaCy tokenizers, regex normalizers, Lemmatizers, and BM25 search engines process millions of docs/sec at 1,000x lower cost than LLMs."
        },
        {
          w: "NLP models process text in the same way human brains process language.",
          r: "Humans learn language grounded in visual, auditory, and social embodiment. NLP models learn statistical co-occurrence manifolds over discrete token IDs via mathematical loss minimization."
        },
        {
          w: "Syntax and semantics are the exact same thing in NLP.",
          r: "Syntax is grammar (rules of sentence structure); semantics is meaning. As Noam Chomsky famously proved: *'Colorless green ideas sleep furiously'* is syntactically perfect, but semantically nonsensical."
        }
      ],

      trade: {
        buys: [
          "Unlocks automated extraction, summarization, translation, and sentiment analysis over unstructured enterprise text.",
          "Enables human-computer interaction through natural conversational speech and prose.",
          "Scales qualitative human document auditing across millions of customer interactions."
        ],
        costs: [
          "Linguistic ambiguity (polysemy, sarcasm, idioms) causes unpredictable edge-case errors.",
          "High compute requirements for deep neural models compared to deterministic software.",
          "Data privacy and compliance challenges when processing unstructured text containing personal data."
        ],
        avoid: [
          "Deploying massive LLMs for simple keyword extraction or regular expression tasks.",
          "Ignoring morphological normalization when building classical search and classification pipelines."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "corpus",

      why: {
        before: "Linguists and computer scientists tested models on tiny, hand-crafted toy sentences (e.g. 50 examples), " +
          "which failed to capture the vast statistical variability and vocabulary of real-world language.",
        problem: "Statistical and neural models require massive, structured, representative collections of real-world text " +
          "to learn robust probability distributions, syntactic patterns, and factual knowledge.",
        shift: "**Corpus (Plural: Corpora): Curated machine-readable text archive.** " +
          "Assemble large, standardized, structured digital text collections (Brown Corpus, Common Crawl, The Pile, FineWeb) " +
          "equipped with metadata, balanced domain distributions, and rigorous deduplication filtering."
      },

      num: {
        t: "Landmark NLP corpora scale evolution & composition",
        h: ["Corpus Name", "Era / Year", "Token / Word Scale", "Primary Composition", "Significance"],
        r: [
          ["**Brown Corpus**", "1961", "$1.0$ Million words", "15 genres of American English (press, fiction)", "**First digital linguistic corpus**; benchmark for POS tagging"],
          ["**Penn Treebank**", "1993", "$4.5$ Million words", "Wall Street Journal articles with syntactic trees", "Gold standard for syntactic parsing and grammar evaluation"],
          ["**Wikipedia Dump**", "2010s", "$\\approx 4.0$ Billion tokens", "Clean, encyclopedic, peer-reviewed articles", "Bedrock of Word2Vec, GloVe, and early BERT pre-training"],
          ["**Common Crawl**", "2015-Present", "Petabytes of raw web scrapes", "Unfiltered global internet text", "Raw source material for modern frontier LLM pre-training"],
          ["**FineWeb (Hugging Face)**", "2024", "**15 Trillion tokens**", "Heuristically filtered, deduplicated web data", "**Current open-source gold standard** for pre-training high-quality LLMs"]
        ],
        n: "A Corpus (plural: corpora) is a curated, machine-readable body " +
          "of natural language text assembled for linguistic analysis and machine learning. " +
          "The design and curation of a corpus dictates the foundational capabilities and biases " +
          "of any downstream model. In modern deep learning, pre-training corpora (such as " +
          "**FineWeb**, **RedPajama**, or **Dolma**) scale to tens of trillions of tokens and require " +
          "a massive multi-stage engineering pipeline: " +
          "(1) **Text Extraction and Language Identification**: filtering out HTML boilerplates, " +
          "non-text markup, and verifying target language via FastText classifiers; " +
          "(2) **Quality Filtering**: heuristic rules that discard machine-generated spam, repetitive text, " +
          "and low-entropy boilerplate; " +
          "(3) **Deduplication**: utilizing **MinHash Locality-Sensitive Hashing (LSH)** to identify and " +
          "remove near-duplicate documents, which slashes training compute by 30% and prevents models " +
          "from memorizing repetitive web pages; and " +
          "(4) **Safety and PII Scrubbing**: stripping social security numbers, API keys, phone numbers, " +
          "and toxic hate speech to build compliant foundation models."
      },

      miss: [
        {
          w: "More tokens in a corpus always produces a better language model.",
          r: "Data quality trumps raw quantity. A model trained on 3 trillion meticulously filtered, deduplicated, high-educational-value tokens routinely outperforms a model trained on 10 trillion tokens of uncurated web scrape noise."
        },
        {
          w: "Web-scraped corpora represent an objective, unbiased reflection of human knowledge.",
          r: "Internet crawls (Common Crawl) reflect severe systemic demographic skews: they are overwhelmingly English-centric, skew heavily toward young male internet demographics, and contain abundant commercial marketing spam."
        },
        {
          w: "A corpus is just a raw folder of .txt files.",
          r: "Production corpora are structured datasets with rich schema metadata: document source URLs, crawl timestamps, language confidence scores, perplexity quality filters, and document boundary IDs."
        },
        {
          w: "Deduplicating a corpus has negligible impact on pre-training.",
          r: "Lee et al. (2021) proved that deduplicating training corpora reduces model memorization by an order of magnitude and prevents severe training perplexity degradation."
        }
      ],

      trade: {
        buys: [
          "Provides the foundational training substrate that endows models with world knowledge, syntax, and reasoning.",
          "Standardized corpora enable reproducible academic benchmarking and fair model comparisons.",
          "High-quality domain-specific corpora (e.g. PubMed, SEC filings) enable specialized enterprise adaptation."
        ],
        costs: [
          "High infrastructure storage and ETL compute costs: managing petabyte-scale raw text pipelines.",
          "Copyright, licensing, and legal liability: web crawls often contain copyrighted books and personal data.",
          "Data contamination risks: test benchmarks accidentally included in web crawls artificially inflate evaluation scores."
        ],
        avoid: [
          "Training language models on raw web scrapes without aggressive MinHash deduplication and quality filtering.",
          "Failing to inspect domain distributions when assembling evaluation corpora."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stemming",

      why: {
        before: "Text search engines treated grammatical inflections of the same word " +
          "('running', 'runs', 'ran') as completely distinct, unrelated tokens, failing to retrieve relevant documents.",
        problem: "Vocabulary sizes exploded due to pluralizations and verb conjugations, " +
          "diluting statistical term frequencies and inflating memory in Bag-of-Words and TF-IDF tables.",
        shift: "**Stemming: Heuristic suffix stripping.** " +
          "Chop off word affixes using crude, deterministic algorithmic rules (e.g. Porter Stemmer) " +
          "to reduce inflectional variants to a common base stem string, shrinking vocabulary size at near-zero compute cost."
      },

      num: {
        t: "Stemming algorithm comparison & error modes",
        h: ["Stemming Algorithm / Metric", "Operational Mechanism", "Speed / Complexity", "Error Characteristics"],
        r: [
          ["**Porter Stemmer (1980)**", "5 sequential phases of algorithmic suffix stripping rules", "**Blistering fast**: pure string matching", "Crude: produces non-words (`comput`, `relat`); high over-stemming"],
          ["**Snowball (Porter2)**", "Refined Porter rules with improved English exception handling", "Very fast; compiled C/Python", "Slightly more conservative; standard in search engines (Elasticsearch)"],
          ["**Lancaster (Paice-Husk)**", "Aggressive rule table (~120 rules) applied iteratively", "Fastest", "**Extremely aggressive**: conflates unrelated words (`arm`, `army` $\\to$ `arm`)"],
          ["**Over-Stemming Error**", "Chops too much: merges unrelated words into same stem", "$\\text{dist}('universe', 'university') \\to 0$", "Degrades search precision by retrieving irrelevant topics"],
          ["**Under-Stemming Error**", "Chops too little: fails to merge true morphological relatives", "$\\text{dist}('alumnus', 'alumni') > 0$", "Degrades search recall by missing legitimate variants"]
        ],
        n: "Stemming is an elementary, rule-based text normalization technique " +
          "introduced by Martin Porter in 1980 (**The Porter Stemmer**). " +
          "The algorithm operates entirely via heuristic string manipulation without any " +
          "morphological dictionary or knowledge of grammar. It applies a cascaded series " +
          "of condition-action replacement rules based on syllable structure (consonant-vowel " +
          "sequences $C(VC)^m V$). For example: " +
          "- Rule 1a: `SSES -> SS` (*caresses -> caress*); `IES -> I` (*ponies -> poni*) " +
          "- Rule 1b: `ING -> [null]` if stem contains a vowel (*motoring -> motor*) " +
          "- Rule 2: `ATIONAL -> ATE` (*relational -> relate*) " +
          "Because stemming relies on crude heuristics rather than a linguistic lexicon, " +
          "the resulting stem is frequently **not a real grammatical dictionary word**: " +
          "for example, 'operate', 'operating', and 'operations' all collapse to the stem string `oper`. " +
          "Stemming is prone to two fundamental failure modes: " +
          "(1) **Over-stemming** (chopping too aggressively, merging unrelated words like *'organization'* " +
          "and *'organ'* to `organ`); and (2) **Under-stemming** (failing to connect irregular variants " +
          "like *'run'* and *'ran'*). Despite its crudeness, stemming is exceptionally fast and remains " +
          "a workhorse in classical search engines (Lucene, Elasticsearch) to improve search recall."
      },

      miss: [
        {
          w: "Stemming always produces a real, valid dictionary word.",
          r: "Stemming deliberately does NOT guarantee valid words. It chops suffixes algorithmically: words like 'university' and 'universal' are often stemmed to non-words like `univers`."
        },
        {
          w: "Stemming and Lemmatization are identical techniques.",
          r: "Stemming is crude, heuristic suffix chopping with no dictionary. Lemmatization performs true grammatical analysis using Part-of-Speech tags and a morphological dictionary to return the true root lemma (e.g. 'better' -> 'good')."
        },
        {
          w: "Modern deep learning models (like Transformers) require stemming text during preprocessing.",
          r: "Transformers use Subword Tokenization (BPE/WordPiece), which preserves morphological inflections natively. Applying stemming prior to feeding text to a Transformer destroys grammatical syntax and degrades accuracy."
        },
        {
          w: "The Porter Stemmer handles irregular verbs like 'go' and 'went'.",
          r: "Because stemming only chops common affixes (-ed, -ing, -ly), it is completely blind to irregular grammatical inflections: 'went' is left completely untouched and will never match 'go'."
        }
      ],

      trade: {
        buys: [
          "Extreme computational speed: processes millions of words per second via simple C string operations.",
          "Substantially reduces vocabulary dimensionality in sparse Bag-of-Words and TF-IDF tables.",
          "Boosts keyword search recall by matching different grammatical forms of user search terms."
        ],
        costs: [
          "Produces non-words that impair human interpretability in downstream analysis.",
          "High error rates: over-stemming merges unrelated concepts; under-stemming misses irregular verbs.",
          "Incompatible with modern deep learning and Transformer tokenizers."
        ],
        avoid: [
          "Applying stemming to text intended for modern Transformer models (BERT, GPT).",
          "Using aggressive stemmers (Lancaster) when search precision is critical."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lemmatisation",

      why: {
        before: "Stemming used crude algorithmic chopping rules that created invalid non-words (`comput`, `organ`) " +
          "and failed completely on irregular linguistic inflections ('better' vs 'good', 'ran' vs 'run').",
        problem: "Linguistic text analysis requires identifying the true grammatical root dictionary form (lemma) " +
          "without destroying vocabulary validity or conflating unrelated words.",
        shift: "**Lemmatisation: Morphological vocabulary reduction with Part-of-Speech analysis.** " +
          "Utilize a complete linguistic dictionary (e.g. WordNet) and contextual Part-of-Speech (POS) tagging " +
          "to resolve words to their canonical dictionary base form (Lemma), preserving semantic validity."
      },

      num: {
        t: "Lemmatisation vs Stemming operational comparison",
        h: ["Dimension / Property", "Stemming (Porter / Snowball)", "Lemmatisation (WordNet / spaCy)"],
        r: [
          ["**Underlying Mechanism**", "Crude heuristic suffix-stripping rules", "**Morphological lexicon lookup + POS analysis**"],
          ["**Dictionary Word Output?**", "**No**: outputs truncated stems (`studi`, `oper`)", "**Yes**: strictly outputs valid dictionary lemmas"],
          ["**Irregular Inflection Handling**", "**Fails**: 'went' $\\to$ 'went'; 'better' $\\to$ 'better'", "**Flawless**: 'went' $\\to$ 'go'; 'better' $\\to$ 'good'"],
          ["**Context / POS Dependency**", "Zero: operates on isolated word string alone", "**High**: 'meeting' (noun) $\\to$ 'meeting'; 'meeting' (verb) $\\to$ 'meet'"],
          ["**Computational Latency**", "**Sub-microsecond**: pure string slicing", "$10\\times - 50\\times$ slower: requires dictionary hash lookups & POS parsing"]
        ],
        n: "Lemmatisation is the linguistically rigorous alternative to stemming. " +
          "Its objective is to reduce any inflected word form to its **Lemma**—the canonical, " +
          "unmarked base form found in a dictionary (e.g. *am, are, is $\\to$ be*; *mice $\\to$ mouse*). " +
          "Lemmatisation requires two core technical components: " +
          "(1) A comprehensive **Morphological Lexicon** (such as Princeton's WordNet database) " +
          "containing complete mapping tables of irregular nouns, verbs, and adjectives; and " +
          "(2) A **Part-of-Speech (POS) Tagger**: the lemma of a word often depends strictly on " +
          "its grammatical role in the sentence. For example: " +
          "- In *'I left the meeting'* ('meeting' is a Noun), the lemma is **`meeting`**. " +
          "- In *'We are meeting tomorrow'* ('meeting' is a Verb), the lemma is **`meet`**. " +
          "Passing the word without a POS tag causes standard lemmatizers (like NLTK's `WordNetLemmatizer`) " +
          "to default to treating words as nouns, failing to lemmatize verbs. " +
          "Modern NLP libraries (like **spaCy**) integrate dependency parsing and morphological analysis " +
          "into unified C-optimized pipelines, providing industrial-speed lemmatization for legal, " +
          "medical, and search indexing applications."
      },

      miss: [
        {
          w: "Calling `WordNetLemmatizer().lemmatize('running')` in NLTK will automatically return 'run'.",
          r: "By default, NLTK assumes every word is a NOUN. Because 'running' as a noun is an activity, it returns 'running'. You must explicitly pass the POS tag: `lemmatize('running', pos='v')` to obtain 'run'."
        },
        {
          w: "Lemmatisation and Stemming can be used interchangeably with identical results.",
          r: "Stemming chops characters heuristically; Lemmatization conducts dictionary and grammatical analysis. Lemmatisation produces valid words and handles irregular verbs, but is computationally slower."
        },
        {
          w: "Lemmatisation is needed before training modern LLMs.",
          r: "LLMs utilize subword tokenizers (BPE) that thrive on natural grammatical inflections. Lemmatizing text removes critical verb tense, pluralization, and syntactic signals, degrading LLM training."
        },
        {
          w: "Lemmatisation works identically across all human languages without custom rules.",
          r: "Lemmatisation requires deep, language-specific morphological dictionaries. Highly inflected languages (Russian, Arabic, Finnish) require complex morphological analyzers far more sophisticated than English lemmatizers."
        }
      ],

      trade: {
        buys: [
          "Guarantees that all normalized outputs are valid, human-readable dictionary words.",
          "Correctly resolves irregular linguistic inflections (verbs, plurals, comparatives) that defeat stemming.",
          "Essential for high-precision text mining, topic modeling, and legal document indexing."
        ],
        costs: [
          "Substantially higher computational latency and memory overhead than heuristic stemming.",
          "Requires accurate upstream Part-of-Speech tagging to disambiguate noun vs verb lemmas.",
          "Requires maintaining comprehensive, language-specific morphological lexicons."
        ],
        avoid: [
          "Using NLTK lemmatizers without supplying contextual Part-of-Speech tags.",
          "Applying lemmatization to training corpora destined for modern Transformer language models."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stop-words",

      why: {
        before: "Early information retrieval and document classification algorithms treated every single word equally, " +
          "allowing ubiquitous function words ('the', 'is', 'at', 'which') to dominate frequency counts and bloat index sizes.",
        problem: "High-frequency function words appear in virtually every document, carrying near-zero discriminative " +
          "information for distinguishing document topics while consuming 30% of database memory.",
        shift: "**Stop Word Filtering: Pruning low-information grammatical function words.** " +
          "Filter out a standardized list of high-frequency closed-class words (articles, prepositions, pronouns) " +
          "prior to building classical Bag-of-Words and TF-IDF representations, slashing dimensionality without losing topic signal."
      },

      num: {
        t: "Stop words impact on vocabulary size, storage & search queries",
        h: ["Metric / Property", "Value with Stop Words", "Value after Stop Word Removal", "Operational Consequence"],
        r: [
          ["**Typical Corpus Volume Share**", "**$\\approx 30 - 40\\%$ of all word tokens**", "Reduced to $0\\%$", "Slashes inverted index postings list size by **$\\approx 35\\%$**"],
          ["**Vocabulary Size Impact**", "Minimal (only $\\approx 100 - 500$ unique words)", "Slightly smaller vocabulary", "Massive reduction in total row occurrences"],
          ["**Search Precision Failure**", "Matches 'The Who' correctly", "Strips 'The' and 'Who' $\\to$ **Zero tokens left!**", "Blindly filtering stop words breaks titles and phrases"],
          ["**Zipf's Law Confirmation**", "Top 10 words account for $\\approx 20\\%$ of tokens", "Flattens power-law distribution", "Focuses statistical models on salient content words"],
          ["**Transformer Relevance**", "**Mandatory to KEEP stop words**", "Filtering breaks syntax", "Self-attention requires prepositions to model grammatical relationships"]
        ],
        n: "Stop Words are high-frequency grammatical function words—such as " +
          "articles (*the, a, an*), pronouns (*he, she, it*), prepositions (*in, on, at*), " +
          "and conjunctions (*and, but, or*). In classical Natural Language Processing " +
          "and Information Retrieval (1970s-2010s), removing stop words was a mandatory " +
          "preprocessing step. In accordance with **Zipf's Law** ($f(r) \\propto 1/r$), " +
          "the top 100 most frequent words account for nearly **40% of all running text** " +
          "in any English corpus, yet carry almost zero topical discriminative value for distinguishing " +
          "between a biology article and a financial report. Standard libraries (NLTK, spaCy, Scikit-Learn) " +
          "provide pre-compiled stop word lists containing 150 to 500 words. Stripping them drastically " +
          "compresses sparse **Bag-of-Words** feature matrices and shrinks inverted search indices. " +
          "However, stop word removal is a destructive heuristic: it destroys phrase queries " +
          "like *'To be or not to be'* (where every word is a stop word!) and breaks entity names " +
          "like *'The Who'* or *'Take That'*. In modern **Transformer-based deep learning**, " +
          "**stop words must NEVER be removed**: self-attention heads depend crucially on prepositions " +
          "and auxiliary verbs to establish grammatical syntax and semantic relationships."
      },

      miss: [
        {
          w: "You should always remove stop words before fine-tuning BERT or training an LLM.",
          r: "Removing stop words destroys grammatical syntax and sentence coherence. Transformers are designed to process natural language end-to-end; stripping stop words severely degrades modern deep learning performance."
        },
        {
          w: "There is a single universal, officially certified list of English stop words.",
          r: "There is no standard list: NLTK contains 179 stop words, spaCy contains 326, and Scikit-Learn contains 318. Different lists include or exclude words like 'no', 'not', or 'never', which can invert sentiment analysis."
        },
        {
          w: "Removing stop words never changes the meaning of a sentence.",
          r: "Removing 'not' from 'The movie was not good' transforms the text into 'movie good', completely inverting the classification label in sentiment analysis pipelines."
        },
        {
          w: "Stop words have zero impact on modern vector databases.",
          r: "Embedding models process full sentences with stop words intact. Removing stop words before generating embeddings degrades vector quality by producing disjointed, ungrammatical phrasing."
        }
      ],

      trade: {
        buys: [
          "Slashes index storage requirements and memory footprints in classical search engines (Lucene, BM25).",
          "Accelerates training of classical models (TF-IDF, Naive Bayes, Latent Dirichlet Allocation).",
          "Focuses term-frequency statistics purely on high-signal topical content words."
        ],
        costs: [
          "Destroys grammatical structure and word order, breaking syntax parsing and Transformer models.",
          "Can catastrophically invert sentiment if negation words ('not', 'no', 'never') are included in the stop list.",
          "Breaks phrase search for titles, idioms, and proper entities composed of stop words."
        ],
        avoid: [
          "Removing stop words when preparing text for Transformer foundation models (BERT, GPT).",
          "Using default stop word lists in sentiment analysis without explicitly removing negation tokens ('not', 'no')."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bag-of-words",

      why: {
        before: "Computers could not process variable-length strings of text directly in numerical machine learning algorithms.",
        problem: "Machine learning algorithms (Logistic Regression, SVMs, Naive Bayes) strictly require fixed-length, " +
          "numerical feature vectors as inputs, but documents contain variable numbers of words in diverse orders.",
        shift: "**Bag of Words (BoW / Vector Space Model): Order-invariant term frequency histograms.** " +
          "Represent a document as a fixed-length numerical vector where each element counts the frequency of a vocabulary word, " +
          "completely discarding grammar and word order while preserving lexical occurrence signals."
      },

      num: {
        t: "Bag of Words representation mechanics & sparsity scaling",
        h: ["Property / Metric", "Mathematical Formulation", "Typical Empirical Scale", "Operational Impact"],
        r: [
          ["**Vector Representation**", "$v_d = [c(w_1), c(w_2), \\dots, c(w_V)]^T$", "$v_d \\in \\mathbb{R}^V$", "Fixed-length representation matching vocabulary size $V$"],
          ["**Matrix Sparsity**", "$\\frac{\\text{Non-Zero Elements}}{N \\times V}$", "**$>99.5\\%$ sparse zeros**", "Requires `scipy.sparse.csr_matrix` to avoid RAM exhaustion"],
          ["**Word Order Retention**", "**Zero**: strictly permutation-invariant", "Grammar erased", "'Dog bites man' and 'Man bites dog' yield identical vectors"],
          ["**Vocabulary Dimension ($V$)**", "Set of all unique words in corpus", "$10,000 - 100,000$ columns", "Prone to the curse of dimensionality without frequency clipping"],
          ["**Implementation Standard**", "`sklearn.feature_extraction.text.CountVectorizer`", "$\\mathcal{O}(N \\cdot L)$ tokenization", "Fastest baseline feature extractor for tabular text pipelines"]
        ],
        n: "The Bag-of-Words (BoW) model is the classical **Vector Space Model** " +
          "of information retrieval (Salton et al. 1975). Given a corpus with a vocabulary " +
          "of $V$ unique words, any document of arbitrary length is transformed into a fixed-length " +
          "sparse vector $v \\in \\mathbb{R}^V$, where index $j$ represents the frequency count " +
          "of word $w_j$ in that document. The model is called a 'bag' because it metaphorically " +
          "tosses all words into a sack, **completely discarding word order, grammar, and syntax** " +
          "while retaining lexical frequency. For example: " +
          "- Document A: *'The cat sat on the mat'* $\\to$ `{the: 2, cat: 1, sat: 1, on: 1, mat: 1}`. " +
          "Because typical documents contain only a tiny fraction of the global vocabulary, " +
          "the resulting document-term matrix is **extreme sparse (>99% zeros)**. " +
          "Storing this matrix as standard dense floating-point arrays would cause immediate out-of-memory " +
          "crashes; software implementations strictly utilize **Compressed Sparse Row (CSR)** matrices. " +
          "While Bag-of-Words is completely blind to syntax (e.g. assigning identical vectors to " +
          "*'not bad, really good'* and *'not good, really bad'*), it remains an extraordinarily effective, " +
          "computationally instantaneous baseline for topic classification and spam filtering."
      },

      miss: [
        {
          w: "Bag of Words preserves sentence grammar if the vocabulary is large enough.",
          r: "BoW is fundamentally order-invariant by mathematical definition. No matter how large the vocabulary is, word order and syntactic dependency are completely erased."
        },
        {
          w: "Bag of Words accounts for synonyms like 'huge' and 'gigantic'.",
          r: "In BoW, 'huge' and 'gigantic' are completely orthogonal, independent feature dimensions with zero mathematical connection. Semantic relationships require dense embeddings (Word2Vec, Transformers)."
        },
        {
          w: "A Bag-of-Words matrix should be stored in memory as a standard NumPy array.",
          r: "A dense NumPy matrix for 100,000 documents across 50,000 vocabulary words requires 40 Gigabytes of RAM! Storing it as a `scipy.sparse` matrix requires only a few megabytes."
        },
        {
          w: "Bag of Words can only use raw word counts.",
          r: "BoW vectors can be binary indicators ($1$ if present, $0$ if absent), normalized relative frequencies, or weighted using TF-IDF."
        }
      ],

      trade: {
        buys: [
          "Converts unstructured variable-length text into fixed-length numeric vectors for classical ML models.",
          "Computationally instantaneous: vectorizes gigabytes of text in seconds on a standard single-core CPU.",
          "High interpretability: individual linear regression coefficients or decision tree splits map directly to specific words."
        ],
        costs: [
          "Complete loss of syntactic word order, grammar, and semantic context.",
          "Extreme matrix sparsity and high dimensionality ($V > 50,000$) exacerbates the curse of dimensionality.",
          "Blind to polysemy and synonyms: treats related words as completely orthogonal feature dimensions."
        ],
        avoid: [
          "Converting a `CountVectorizer` output into a dense NumPy array (`.toarray()`) on large datasets.",
          "Using pure Bag-of-Words for sentiment analysis tasks where word order and negation ('not good') reverse meaning."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "tf-idf",

      why: {
        before: "Bag of Words measured pure word frequency, allowing ubiquitous common words " +
          "to dominate vector representations while burying rare, highly informative topical keywords.",
        problem: "If the word 'contract' appears 5 times in a legal document, but also appears in 100% of all other legal documents, " +
          "it carries near-zero discriminative signal for distinguishing that specific contract from others.",
        shift: "**TF-IDF (Term Frequency-Inverse Document Frequency, Spärck Jones 1972): Information-theoretic term weighting.** " +
          "Scale term frequency (TF) inversely by the document frequency (IDF): $\\text{TF-IDF} = \\text{TF}(t, d) \\times \\log\\frac{N}{\\text{DF}(t)}$, " +
          "rewarding words that appear frequently in the target document but rarely across the general corpus."
      },

      num: {
        t: "TF-IDF mathematical components & scoring mechanics",
        h: ["Component / Metric", "Mathematical Formulation", "Theoretical Value / Range", "Information Role"],
        r: [
          ["**Term Frequency (TF)**", "$\\frac{f(t, d)}{\\sum_{t'} f(t', d)}$ or $1 + \\log(f)$", "$[0, 1]$ (or sublinear)", "Measures local importance of term $t$ within document $d$"],
          ["**Inverse Document Freq (IDF)**", "$\\log\\left(\\frac{1 + N}{1 + \\text{DF}(t)}\\right) + 1$", "$[1, \\ln(N)]$", "Measures global rarity; heavily penalizes words that appear everywhere"],
          ["**TF-IDF Score**", "$\\text{TF}(t, d) \\times \\text{IDF}(t)$", "$[0, \\infty)$", "High score: frequent in this document, rare across the corpus"],
          ["**L2 Vector Normalization**", "$v_{\\text{norm}} = \\frac{v}{\\|v\\|_2}$", "$\\sum v_i^2 = 1.0$", "Cancels out document length bias; makes dot product equal cosine similarity"],
          ["**Search Engine Baseline**", "Foundation of **BM25** ranking", "Industrial standard", "Dominant baseline scoring mechanism in Lucene and Elasticsearch"]
        ],
        n: "TF-IDF (Term Frequency-Inverse Document Frequency) was formulated " +
          "by British computer scientist Karen Spärck Jones in 1972, serving as the mathematical " +
          "bedrock of modern search engines and text mining. " +
          "The algorithm balances two competing statistical forces: " +
          "(1) **Term Frequency (TF)**: measures how often a word $t$ appears in document $d$. " +
          "The more times a word occurs, the more likely the document is to be about that topic. " +
          "(2) **Inverse Document Frequency (IDF)**: quantifies the general rarity of word $t$ " +
          "across the entire corpus of $N$ documents: $\\text{IDF}(t) = \\log\\left(\\frac{N}{\\text{DF}(t)}\\right)$. " +
          "If a word appears in every single document (like *'the'* or *'system'*), $\\text{DF} = N$, " +
          "so $\\text{IDF} = \\log(1) = 0$, completely neutralizing the word's weight! " +
          "Conversely, if a word like *'CRISPR'* appears 10 times in a biology paper but in only " +
          "3 documents across a 1-million document corpus, its IDF score is astronomical, assigning " +
          "the feature an enormous weight. " +
          "After computing the raw score $\\text{TF-IDF} = \\text{TF} \\times \\text{IDF}$, " +
          "each document vector is normalized to unit Euclidean length (L2 normalization: $\\|v\\|_2 = 1.0$), " +
          "which eliminates document length bias and allows document relevance to be evaluated " +
          "as an instantaneous **dot product**. In modern enterprise search, TF-IDF was refined into " +
          "**BM25 (Best Matching 25)**, which adds non-linear saturation to term frequency."
      },

      miss: [
        {
          w: "TF-IDF understands the semantic meaning and synonyms of words.",
          r: "TF-IDF is strictly a statistical frequency counting algorithm. It has zero understanding of semantics: 'automobile' and 'car' receive completely independent, orthogonal weights with zero semantic connection."
        },
        {
          w: "A word that appears 10 times in a document is 10 times more important than a word that appears once.",
          r: "Relevance scales with diminishing returns. Modern implementations (like sublinear TF scaling in Scikit-Learn: `sublinear_tf=True`) replace raw counts with $1 + \\log(\\text{TF})$ to prevent frequency explosion."
        },
        {
          w: "IDF should be recalculated on the fly during inference for every new incoming document.",
          r: "IDF values are fixed statistical parameters derived from the historical training corpus. When scoring incoming test queries, the pre-computed training IDF weights must be applied."
        },
        {
          w: "TF-IDF has been completely superseded by neural embeddings in real-world search.",
          r: "TF-IDF (specifically its modern evolution BM25) remains an essential component of modern search: dense embeddings struggle with exact keywords, part numbers, and proper names where BM25 excels."
        }
      ],

      trade: {
        buys: [
          "Automatically downweights ubiquitous non-discriminative words without requiring manual stop word lists.",
          "Assigns high statistical importance to domain-specific, rare keyword terms.",
          "Exceptional speed: builds sparse document representations in seconds, running efficiently on low-cost CPUs."
        ],
        costs: [
          "Complete loss of word order, syntax, and grammatical context (inheriting all BoW limitations).",
          "Cannot capture semantic synonyms or cross-lingual analogies without dense embedding hybridization.",
          "High dimensionality ($V > 50,000$) requires sparse matrix storage and memory management."
        ],
        avoid: [
          "Using raw linear term frequency on long documents without enabling sublinear log scaling (`sublinear_tf=True`).",
          "Discarding BM25 / TF-IDF entirely when building production search engines (always pair with vector embeddings via Hybrid Search)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
