/* ==========================================================================
   Depth pass 87 — NLP batch 2: Language Models, Sequential Tagging & Classification.
   N-gram, Language Model, Perplexity, Part-of-Speech Tagging,
   Named Entity Recognition, Sentiment Analysis, Text Classification.

   Markovian context transitions yield to joint contextual distributions;
   sequence labeling aligns morphological tokens to semantic entities.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "n-gram",

      why: {
        before: "Bag-of-words models discarded all syntactic and sequential word ordering, treating sentences as unordered multisets of tokens where 'dog bit man' and 'man bit dog' produced identical representations.",
        problem: "Natural language semantics depends fundamentally on immediate syntactic adjacency and local grammatical collocations; ignoring order destroys negation, compound nouns, and local dependency structures.",
        shift: "**N-gram Language Modeling: Contiguous sequences of n items from a given sample of text or speech.** By conditioning token probabilities on the immediate preceding $n-1$ history ($P(w_t \\mid w_{t-n+1}, \\dots, w_{t-1})$), n-grams preserved local sequential context without requiring full combinatorial sentence graphs."
      },

      num: {
        t: "N-gram Model Scaling, Parameter Counts & Sparsity Across Context Lengths",
        h: ["N-gram Order", "Formal Name", "Context History ($k$)", "Parameter Complexity ($|V|^n$ for $|V|=10^5$)", "Zero-Frequency Probability"],
        r: [
          ["$n = 1$", "Unigram", "0 tokens (independent)", "$10^5$ (0.1M parameters)", "Near 0% for in-corpus vocabulary"],
          ["$n = 2$", "Bigram", "1 preceding token", "$10^{10}$ (10 Billion pairs)", "~85% to 92% unseen pairs in test text"],
          ["$n = 3$", "Trigram", "2 preceding tokens", "$10^{15}$ (1 Quadrillion triplets)", "~98.5% unseen combinations in typical corpora"],
          ["$n \\ge 4$", "4-gram / 5-gram", "3 to 4 tokens", "$\\ge 10^{20}$ (Intractable dense table)", "> 99.9% unseen; mandatory Kneser-Ney smoothing"]
        ],
        n: "An n-gram model relies on the Markov assumption of order $k = n - 1$, asserting that the conditional probability of token $w_t$ depends exclusively on the previous $n-1$ tokens: $P(w_1, \\dots, w_m) = \\prod_{t=1}^m P(w_t \\mid w_{t-n+1}^{t-1})$. Maximum Likelihood Estimation computes raw transition counts: $P_{MLE}(w_t \\mid w_{t-1}) = \\frac{C(w_{t-1}, w_t)}{C(w_{t-1})}$. Because natural language displays Zipfian long-tail sparsity, unseen n-grams receive zero probability ($C=0$), causing infinite cross-entropy perplexity. Practical implementations require advanced smoothing algorithms—primarily Modified Kneser-Ney smoothing, which interpolates absolute discounting with a lower-order continuation probability reflecting how versatile a word is across diverse preceding contexts."
      },

      miss: [
        {
          w: "Higher n-gram orders ($n=10$) approach human-level sentence comprehension.",
          r: "As $n$ scales linearly, parameter combinatorial state space scales exponentially ($|V|^n$). An order-10 model over a modest vocabulary of 50,000 words requires $50000^{10} \\approx 9.7 \\times 10^{46}$ states—far exceeding the number of atoms on Earth—yielding near-total data sparsity."
        },
        {
          w: "N-grams capture long-range semantic dependencies such as subject-verb agreement across subordinate clauses.",
          r: "N-grams are strictly bounded by their fixed window size ($n-1$). If a subject and verb are separated by 6 words in a relative clause, a 3-gram or 4-gram is mathematically blind to the subject when generating or evaluating the verb."
        },
        {
          w: "Character n-grams are obsolete now that subword tokenizers (BPE/WordPiece) exist.",
          r: "Character n-grams remain state-of-the-art for fast text search, fuzzy string matching (Levenshtein indexing), typo-tolerant spam filtering, and low-latency language identification engines (such as FastText)."
        },
        {
          w: "Laplace (add-one) smoothing is sufficient for modern n-gram language modeling.",
          r: "Add-one smoothing shifts an enormous amount of probability mass to completely impossible combinations in large vocabularies, severely degrading probability calibration. Modified Kneser-Ney or Good-Turing discounting is mandatory."
        }
      ],

      trade: {
        buys: [
          "Extremely fast computation and inference via static hash-table lookups without GPU hardware.",
          "Deterministic, transparent conditional probabilities directly auditable via raw frequency counts.",
          "Sub-millisecond latency for predictive text completion, IME keyboards, and query auto-suggest.",
          "Effective baseline representation for lightweight classification when paired with linear classifiers."
        ],
        costs: [
          "Exponential parameter explosion with context length, capping realistic order at $n \\le 5$.",
          "Zero semantic generalization between related words ('cat sat' provides zero probability mass to 'feline sat').",
          "Catastrophic failure on long-range syntax, discourse structure, and cross-sentence reasoning.",
          "Requires gigabytes of RAM to store compressed n-gram language model tables (e.g., SRILM or KenLM)."
        ],
        avoid: [
          "Do not use n-gram models for complex generative tasks requiring long-range coherence or reasoning.",
          "Never evaluate an n-gram model on out-of-domain text without backoff and discounting smoothing enabled.",
          "Avoid dense matrix representations for n-gram frequency tables; always utilize trie or compressed hash tables."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "language-model",

      why: {
        before: "Linguistic software operated on prescriptive formal rules, syntax trees, and grammar checkers that could validate grammatical legality but had no quantitative way to determine whether a sentence was natural or plausible.",
        problem: "Computers could not assign continuous probabilities to sentences or rank competing hypotheses in speech recognition, machine translation, or text generation.",
        shift: "**Language Model (LM): A probability distribution over sequences of words or tokens ($P(W) = P(w_1, w_2, \\dots, w_n)$).** Language modeling transformed linguistics into statistical and neural prediction, enabling systems to quantitatively measure linguistic plausibility and generate coherent text auto-regressively."
      },

      num: {
        t: "Generations of Language Model Architectures & Foundational Properties",
        h: ["Paradigm", "Representational Form", "Context Capacity", "Inductive Bias", "Zero-Shot Transfer"],
        r: [
          ["Statistical (N-gram)", "Count tables & backoff smoothing", "1–5 tokens", "Local Markovian chain", "None (task-specific count tables)"],
          ["Recurrent Neural (RNN/LSTM)", "Hidden state vector $h_t \\in \\mathbb{R}^d$", "50–200 tokens (gradient decay)", "Sequential temporal recurrence", "Minimal (requires fine-tuning)"],
          ["Masked Transformer (BERT)", "Bidirectional self-attention", "512 tokens", "All-to-all contextual alignment", "Moderate (feature extraction / head tuning)"],
          ["Autoregressive Transformer (GPT)", "Causal masked self-attention", "4k–2M+ tokens", "Causal next-token prediction", "Massive emergent generalization"]
        ],
        n: "Fundamentally, a language model decomposes the joint probability of a sequence $W = (w_1, w_2, \\dots, w_T)$ via the chain rule of probability: $P(W) = \\prod_{t=1}^T P(w_t \\mid w_1, \\dots, w_{t-1})$. The training objective is typically the minimization of cross-entropy loss $\\mathcal{L} = -\\frac{1}{T} \\sum_{t=1}^T \\log P_\\theta(w_t \\mid w_{<t})$, which is mathematically equivalent to minimizing the Kullback-Leibler (KL) divergence between the empirical data distribution and the model's parameterized distribution. Modern autoregressive foundation models demonstrated that next-token prediction at scale compresses world knowledge, syntactic reasoning, common sense, and logic into high-dimensional parameter weights."
      },

      miss: [
        {
          w: "A language model actually 'thinks' and intends what it generates.",
          r: "An LM is an autoregressive probabilistic simulator that samples tokens from a conditional probability distribution over a vocabulary simplex. It has no continuous consciousness, subjective intent, or persistent real-time mental state."
        },
        {
          w: "Language models only predict the single most probable word at every step.",
          r: "Pure greedy decoding ($w_t = \\arg\\max P(w)$) causes repetitive and degenerate text loops. Practical generation uses stochastic sampling methods such as top-$k$, top-$p$ (nucleus), or beam search with length penalties."
        },
        {
          w: "A language model can only generate text, not solve classification or code problems.",
          r: "Any NLP task can be cast as language modeling. Text classification becomes predicting 'positive' vs 'negative' next tokens; programming becomes causal code completion; translation becomes generating target tokens conditioned on source prompts."
        },
        {
          w: "If an LM outputs a fact with high confidence, that fact is guaranteed to be true.",
          r: "Language models optimize statistical linguistic fluency, not factual truth. They frequently generate hallucinated citations, equations, or assertions with high conditional probability if the syntax pattern mimics factual corpora."
        }
      ],

      trade: {
        buys: [
          "Unified conceptual framework: one architecture and objective function solves translation, summarization, and QA.",
          "Pre-training on raw unannotated text extracts rich syntactic, semantic, and encyclopedic representations.",
          "Few-shot and in-context learning capabilities without requiring model parameter gradient updates.",
          "Scalable scaling laws: model performance predictably improves with compute, parameters, and data volume."
        ],
        costs: [
          "Massive computational and energy cost for pre-training large models (millions of GPU hours).",
          "Susceptibility to hallucinations, bias amplification, and memorization of training corpus noise.",
          "High inference latency and memory requirements (KV cache memory scaling linearly with sequence length).",
          "Non-deterministic outputs making verification and deterministic software integration challenging."
        ],
        avoid: [
          "Never rely on raw language model generation for safety-critical or regulatory factual verification without grounding.",
          "Do not train from scratch when open-weights or pre-trained models can be fine-tuned or prompted.",
          "Avoid unconstrained greedy decoding for open-ended creative or conversational text generation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "perplexity",

      why: {
        before: "Evaluating language models required deploying them into downstream end-to-end applications (e.g., measuring Word Error Rate in speech recognition or BLEU in machine translation), which was computationally sluggish and conflated model quality with downstream heuristics.",
        problem: "Researchers lacked an intrinsic, mathematically rigorous, and model-agnostic metric to evaluate how well a probability model fits held-out natural language text independent of specific task decoders.",
        shift: "**Perplexity (PPL): The exponentiated cross-entropy of a language model on held-out text ($e^H$ or $2^H$).** Perplexity quantifies the effective branching factor of the model—how many equally probable words the model is uncertain between at each prediction step."
      },

      num: {
        t: "Perplexity Values Across Historical Model Architectures on Penn Treebank / WikiText-103",
        h: ["Model Architecture", "Typical Test Perplexity", "Average Branching Factor", "Equivalent Cross-Entropy ($H$)"],
        r: [
          ["Uniform Random Baseline", "$|V| \\approx 50,000$", "50,000 equally likely tokens", "10.82 nats / 15.61 bits"],
          ["Unigram Model", "~800 – 1,000", "800 – 1,000 words", "6.68 – 6.91 nats"],
          ["Kneser-Ney 5-gram", "~140 – 170", "140 – 170 words", "4.94 – 5.14 nats"],
          ["Averaged AWD-LSTM (2018)", "~55 – 65", "55 – 65 words", "4.00 – 4.17 nats"],
          ["GPT-2 (345M / 1.5B)", "~18 – 22", "18 – 22 tokens", "2.89 – 3.09 nats"],
          ["Modern SOTA LLMs (70B+)", "~8 – 12", "8 – 12 tokens", "2.07 – 2.48 nats"]
        ],
        n: "Given a held-out test sequence $W = (w_1, w_2, \\dots, w_N)$, the empirical cross-entropy loss is $\\mathcal{L} = -\\frac{1}{N} \\sum_{i=1}^N \\log P(w_i \\mid w_{<i})$. Perplexity is defined as $\\text{PPL}(W) = \\exp(\\mathcal{L}) = \\sqrt[N]{\\prod_{i=1}^N \\frac{1}{P(w_i \\mid w_{<i})}}$. Intuitively, a perplexity of 10 means the model is as confused as if it had to choose uniformly at random among 10 candidate words at every step. Lower perplexity indicates superior predictive confidence and alignment with natural language distribution. However, perplexity is strictly comparable only across models sharing the exact same tokenization vocabulary, because splitting text into finer subword fragments artificially depresses per-token perplexity."
      },

      miss: [
        {
          w: "Perplexity can be compared directly between two models that use different tokenizers (e.g., BPE vs WordPiece vs Character).",
          r: "Comparing perplexity across different tokenizers is mathematically invalid. A character-level model has a tiny vocabulary and low per-character perplexity, but requires many more tokens to express the same word. Perplexity must be normalized by word length (bits per character / byte) to compare across tokenizers."
        },
        {
          w: "A model with a lower perplexity is always better at factual question answering.",
          r: "Perplexity measures surface syntactic and statistical probability calibration. A model that memorizes Wikipedia perfectly may have low perplexity on test passages while failing at deductive multi-step reasoning or logical alignment."
        },
        {
          w: "Perplexity can be calculated on un-normalized scores or un-calibrated logits.",
          r: "Perplexity requires true probability distributions where $\\sum_{w \\in V} P(w) = 1$. Uncalibrated logits must pass through a strict softmax function over the complete closed vocabulary."
        },
        {
          w: "Zero perplexity is achievable by a sufficiently large neural network.",
          r: "Perplexity is lower-bounded by the inherent Shannon entropy of natural human language ($H \\approx 1.0 - 1.5$ bits/character). Because human language contains inherent pragmatic ambiguity, zero perplexity is theoretically impossible without pathological overfitting to fixed test strings."
        }
      ],

      trade: {
        buys: [
          "Intrinsic, task-agnostic metric that can be computed rapidly during model pre-training without labeled task datasets.",
          "Smooth, differentiable objective directly tied to cross-entropy training loss.",
          "Reliable indicator of optimization progress, learning rate decay schedules, and model convergence.",
          "Sensitive diagnostic for detecting dataset contamination, domain mismatch, and model degradation during quantization."
        ],
        costs: [
          "Does not guarantee high semantic factual accuracy, adherence to safety instructions, or conversational coherence.",
          "Invalid across differing vocabulary tokenization schemes unless converted to bits-per-byte (BPB).",
          "Can be heavily skewed by repetitive text sequences (e.g., long tables of numbers) where the model achieves artificially near-1 perplexity.",
          "Insensitive to long-range logical consistency across multi-paragraph discourses."
        ],
        avoid: [
          "Never evaluate perplexity on the training set; test evaluation must strictly use pristine held-out corpora.",
          "Do not use perplexity as the sole acceptance gate for conversational AI or agentic systems; combine with task benchmarks.",
          "Avoid comparing raw perplexities across different tokenizer vocabularies without bits-per-word normalization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "part-of-speech-tagging",

      why: {
        before: "Early NLP pipelines treated words as opaque atomic tokens or raw strings, unable to disambiguate whether 'run' was a verb ('I run fast') or a noun ('scored a run'), leading to syntax parsing errors.",
        problem: "Homographs and lexical polysemy cause grammatical confusion; syntactic parsers, lemmatizers, and text-to-speech synthesizers cannot function without knowing the grammatical category of every word in context.",
        shift: "**Part-of-Speech (POS) Tagging: Assigning grammatical categories (Noun, Verb, Adjective, Adposition, etc.) to each token in a sentence.** Evolved from rule-based morphological disambiguation (Brill tagger) to Hidden Markov Models (Viterbi decoding), Maximum Entropy Markov Models (MEMMs), Conditional Random Fields (CRFs), and contextual transformer token classifiers."
      },

      num: {
        t: "POS Tagging Evolution: Accuracy, Latency & Structural Models on WSJ Penn Treebank",
        h: ["Tagging Methodology", "Representative System", "Accuracy (PTB)", "Throughput (Tokens/Sec)", "Inference Algorithm"],
        r: [
          ["Rule-Based / Transformation", "Brill Tagger (1995)", "96.5%", "~250,000", "Greedy rule-patching cascades"],
          ["Generative Probabilistic", "HMM (TnT Tagger)", "96.7%", "~500,000", "Viterbi dynamic programming ($O(T |S|^2)$)"],
          ["Discriminative Sequence", "CRF (Stanford POS)", "97.3%", "~35,000", "Viterbi over linear-chain potentials"],
          ["Bidirectional LSTM-CRF", "Flair / BiLSTM-CRF (2018)", "97.5%", "~8,000", "Forward-backward + CRF transition matrix"],
          ["Contextual Transformer", "BERT-base / RoBERTa", "97.9%", "~1,500 (GPU)", "Softmax per-token linear head"]
        ],
        n: "Part-of-Speech tagging is fundamentally a sequence labeling problem: given an input sequence $X = (x_1, \\dots, x_T)$, find the sequence of tags $Y = (y_1, \\dots, y_T)$ from tagset $\\mathcal{S}$ (e.g., the 36 tags in the Penn Treebank or the 17 Universal POS tags) that maximizes conditional probability $P(Y \\mid X)$. In classical HMMs, this decomposes via Bayes' rule into transition probabilities $P(y_t \\mid y_{t-1})$ and emission probabilities $P(x_t \\mid y_t)$, solved globally in $O(T |\\mathcal{S}|^2)$ time using the Viterbi dynamic programming algorithm. In modern transformer pipelines, pre-trained contextual embeddings pass directly into a per-token classification head, resolving multi-word polysemy through multi-head self-attention."
      },

      miss: [
        {
          w: "A word possesses a single static part of speech that can be retrieved from a dictionary.",
          r: "English features rampant functional shift (zero-derivation conversion). Words like 'record', 'object', 'lead', and 'content' change grammatical class and phonetic pronunciation based entirely on contextual syntax."
        },
        {
          w: "97% POS tagging accuracy means the sequence labeling problem is essentially solved.",
          r: "A 97% per-token accuracy means an average sentence of 25 words has an error probability of $1 - (0.97)^{25} \\approx 53.3%$. More than half of full sentences contain at least one misclassified tag, which can break downstream dependency parsers."
        },
        {
          w: "Modern LLMs do not need or use POS tags, so POS tagging is obsolete.",
          r: "POS tagging remains critical in lightweight edge devices, deterministic linguistic search, text-to-speech phonemizers (pronouncing 'tear' as /tɪər/ vs /tɛər/), grammar checking engines, and resource-constrained embedded systems."
        },
        {
          w: "POS taggers rely purely on word endings and suffixes to guess categories.",
          r: "While morphological suffixes (-ing, -tion, -ly) provide strong emission cues, syntactic distribution (the surrounding grammatical context and transition constraints) is what resolves ambiguous tokens with identical morphology."
        }
      ],

      trade: {
        buys: [
          "Crucial intermediate linguistic abstraction for downstream tasks: dependency parsing, lemmatization, and phonemization.",
          "High-speed, sub-millisecond execution when deployed with classical HMM or CRF models in C++/Rust.",
          "Enables rule-based linguistic feature engineering and structured query matching over grammatical templates.",
          "Provides interpretability into whether a model understands grammatical sentence construction."
        ],
        costs: [
          "Errors propagate upstream into dependent parsers and downstream semantic extractors.",
          "Performance degrades significantly on informal, unpunctuated, or domain-specific text (social media, code snippets).",
          "Annotating training treebanks requires professional linguistic expertise and consistent annotation guidelines.",
          "Static tagsets often struggle to capture nuanced grammatical phenomena in agglutinative or polysynthetic languages."
        ],
        avoid: [
          "Do not use heavy LLMs for standalone POS tagging in low-latency pipelines when Spacy or FastText runs $1000\\times$ faster.",
          "Never evaluate a POS tagger on social media text using a model trained solely on Wall Street Journal financial news.",
          "Avoid greedy per-token classification without sequence transition modeling when using classical linear features."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "named-entity-recognition",

      why: {
        before: "Search engines and information extraction systems relied on keyword matching and exact dictionary lookups, failing to recognize novel entity names, misidentifying multi-word person names, and confusing proper nouns with common vocabulary.",
        problem: "Entities (people, organizations, locations, drugs, genes) are open-ended, constantly created, ambiguous, and multi-token ('Bank of America' is an organization, not a geological river bank).",
        shift: "**Named Entity Recognition (NER): Locating and classifying unstructured text spans into predefined entity categories.** Transitioned from heuristic gazetteers to BIO sequence tagging using CRFs, BiLSTM-CRF networks, and contextual transformer boundary classifiers."
      },

      num: {
        t: "NER Paradigms, Representation Schemes & Performance on CoNLL-2003 (F1 Score)",
        h: ["Methodology", "Sequence Scheme", "CoNLL-2003 F1", "Span Handling", "Latency / Complexity"],
        r: [
          ["Gazetteer + Regex", "Exact string matching", "~70.0%", "Flat only", "Ultra-fast ($O(M)$ Aho-Corasick)"],
          ["Linear-Chain CRF", "BIO / BIOES tagging", "86.5%", "Flat only", "Fast ($O(T |S|^2)$ Viterbi)"],
          ["BiLSTM-CRF (Flair / GloVe)", "BIOES sequence", "93.1%", "Flat only", "Medium ($O(T)$ recurrent forward pass)"],
          ["BERT-base + Token Linear", "BIO subword tagging", "96.4%", "Flat only", "High ($O(T^2)$ self-attention)"],
          ["Span-Based / LLM Extractors", "Span boundary $(i, j, c)$", "97.1%", "Nested & Discontinuous", "Very High (combinatorial span evaluation)"]
        ],
        n: "Named Entity Recognition is typically formulated as sequence labeling using the **BIO** (Begin, Inside, Outside) or **BIOES** (Begin, Inside, Outside, End, Single) tagging scheme. For a multi-word entity like 'New York City', the tokens are tagged: 'New' (B-LOC), 'York' (I-LOC), 'City' (E-LOC). The state-of-the-art classical formulation combines bidirectional representations with a Conditional Random Field (BiLSTM-CRF). The CRF layer learns a transition score matrix $A_{i,j}$ representing the likelihood of transitioning from tag $i$ to tag $j$, strictly preventing mathematically illegal transitions (e.g., an 'I-PER' tag immediately following an 'O' tag without an intervening 'B-PER'). Modern span-based architectures directly score candidate token spans $[i, j]$ into entity classes, naturally supporting nested entities (e.g., 'Bank of America' as ORG containing 'America' as LOC)."
      },

      miss: [
        {
          w: "NER can be completely solved by maintaining a large, comprehensive database (gazetteer) of all names and places.",
          r: "Gazetteers cannot resolve context ambiguity (e.g., 'Washington' as person, state, or baseball team), nor can they identify novel startups, newly coined medical terms, or informal pseudonyms that did not exist during dictionary compilation."
        },
        {
          w: "BIO token-level classification with independent softmax outputs is just as good as a CRF layer.",
          r: "Independent per-token softmax classifiers lack transition modeling. They regularly emit syntactically invalid sequences, such as an 'I-ORG' immediately following an 'O' tag, whereas a CRF guarantees global structural validity."
        },
        {
          w: "NER works equally well on nested entities (e.g., 'University of California, Berkeley').",
          r: "Standard BIO sequence labeling enforces a single tag per token, making it fundamentally incapable of capturing nested or overlapping entities without multi-label heads, recursive transition networks, or span-based parsing."
        },
        {
          w: "Subword tokenizers (like WordPiece or BPE) make NER trivial for compound words.",
          r: "Subword tokenization fragments complex entities into multiple pieces (e.g., 'Anastrozole' $\\rightarrow$ 'An', '##astro', '##zole'). The model must implement span alignment strategies (first-subword pooling vs max pooling) to avoid tag fragmentation across morphemes."
        }
      ],

      trade: {
        buys: [
          "Transforms unstructured natural language text into structured, queryable entities for databases and knowledge graphs.",
          "Enables high-precision document search, relationship extraction, contract auditing, and clinical record parsing.",
          "BIOES formulation provides clear, standardized evaluation boundaries using exact-match Span F1 metrics.",
          "Pre-trained domain models (e.g., BioBERT, LegalBERT) provide high zero-shot and few-shot entity recognition."
        ],
        costs: [
          "High sensitivity to capitalization, punctuation, and domain drift (models trained on news fail on un-capitalized chat).",
          "Standard sequence labeling cannot model overlapping, nested, or discontinuous entity spans.",
          "Annotating entity boundary ground truth is labor-intensive and subject to low inter-annotator agreement on span edges.",
          "Subword-to-word alignment introduces post-processing complexity in production inference pipelines."
        ],
        avoid: [
          "Do not use token-level accuracy to evaluate NER; always compute strict Span-Level Precision, Recall, and F1.",
          "Never lowercase text during pre-processing for standard NER models, as title casing is a primary signal for proper nouns.",
          "Avoid naive exact dictionary matching when parsing biomedical, legal, or informal conversational entities."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sentiment-analysis",

      why: {
        before: "Market research and customer feedback analysis relied on manual reading, surveys, and focus groups, scaling at high cost and taking weeks to quantify consumer sentiment.",
        problem: "Unstructured text contains subjective emotions, nuanced opinions, sarcasm, and domain-dependent evaluations that simple keyword tallies ('good' vs 'bad') misinterpret.",
        shift: "**Sentiment Analysis (Opinion Mining): Computational identification and categorization of opinions, emotional valence, and subjectivity in text.** Evolved from lexical polarity counting (VADER, SentiWordNet) to aspect-based sentiment analysis (ABSA) powered by fine-tuned contextual transformers."
      },

      num: {
        t: "Sentiment Analysis Methodology Comparison: Granularity, Sarcasm & Accuracy (SST-2 Benchmark)",
        h: ["Paradigm", "Input Representation", "Accuracy (SST-2)", "Aspect Support", "Sarcasm Handling"],
        r: [
          ["Lexicon-Based (VADER)", "Rule-based valence dictionary", "72.4%", "None (document/sentence level)", "Fails completely"],
          ["Bag-of-Words + Naive Bayes", "TF-IDF sparse n-gram vector", "82.1%", "None (bag representation)", "Fails on negation flips"],
          ["BiLSTM with GloVe", "Dense sequential vectors", "87.8%", "Coarse sentence level", "Struggles with distant context"],
          ["BERT / RoBERTa (Fine-Tuned)", "Contextual self-attention", "94.8%", "Sentence and token-level", "Moderate contextual resolution"],
          ["Aspect-Based LLM (Few-Shot)", "Instruction prompting + CoT", "96.2%", "Fine-grained entity-aspect pairs", "High pragmatic reasoning"]
        ],
        n: "Sentiment analysis spans three levels of granularity: document-level, sentence-level, and aspect-level. In **Aspect-Based Sentiment Analysis (ABSA)**, the task is formalised as extracting tuples $(e, a, s)$, where $e$ is the target entity, $a$ is the specific aspect/attribute, and $s \\in \\{ \\text{positive}, \\text{neutral}, \\text{negative} \\}$ is the sentiment polarity. For example, in 'The pizza was incredible, but the waiter was rude', a sentence-level classifier produces an ambiguous neutral score, whereas ABSA correctly extracts `(pizza, food, positive)` and `(waiter, service, negative)`. Modern neural classifiers train by optimizing categorical cross-entropy loss over softmax output layers conditioned on sentence representations or attention pooling across target aspect tokens."
      },

      miss: [
        {
          w: "Sentiment analysis is a simple binary classification problem (Positive vs Negative).",
          r: "Real-world text frequently exhibits neutral statements, mixed sentiment, comparative opinions ('iPhone is better than Galaxy, but too expensive'), conditional desires, and subtle irony that binary classifiers collapse."
        },
        {
          w: "Counting positive and negative words with a sentiment lexicon (like VADER) is sufficient for production customer intelligence.",
          r: "Lexicon models fail on linguistic negation ('not bad at all'), modal verbs ('I wish this worked'), domain inversion ('unpredictable plot' is positive in movies but negative in automotive cruise control), and sarcasm."
        },
        {
          w: "Neutral sentiment represents an absence of emotion or opinion.",
          r: "Neutral sentiment often represents factual objective reporting ('The company reported earnings today') or balanced trade-offs that convey critical domain signals distinct from low-confidence predictions."
        },
        {
          w: "A high-accuracy movie review sentiment classifier can be deployed directly to financial news or healthcare feedback.",
          r: "Sentiment is highly domain-specific. Words like 'volatile', 'aggressive', 'crushed', or 'infectious' have opposite sentiment polarities in financial trading or medical contexts compared to casual consumer reviews."
        }
      ],

      trade: {
        buys: [
          "Automates real-time brand monitoring, social listening, and customer support ticket prioritization at scale.",
          "Aspect-based extraction reveals precise product pain points (battery life vs screen quality) directly from text.",
          "Enables quantitative correlation between public discourse and financial market movements or product churn.",
          "Simple text classification pipelines provide sub-5ms latency on CPU when distilled into lightweight models."
        ],
        costs: [
          "Fragile when faced with cultural slang, irony, subtle sarcasm, and rhetorical questions.",
          "Severe domain transfer degradation: models require domain-specific calibration (e.g., FinBERT for finance).",
          "Subjectivity annotation suffers from low human inter-annotator agreement (often $\\kappa < 0.70$).",
          "Risk of biased decisions if used blindly in automated content moderation or customer de-prioritization."
        ],
        avoid: [
          "Do not use generic out-of-the-box sentiment models on specialized technical, legal, or financial text.",
          "Never evaluate multi-aspect customer reviews with a single aggregate sentence-level score.",
          "Avoid relying on lexical sentiment dictionaries when analyzing complex sentences with multiple subordinate clauses."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "text-classification",

      why: {
        before: "Sorting and organizing documents, emails, and tickets required manual human reading or brittle Boolean keyword filtering rules that required endless manual maintenance.",
        problem: "Text collections grow exponentially; documents contain complex thematic variations, typos, synonyms, and multi-label intersections that simple pattern matching cannot manage.",
        shift: "**Text Classification: Algorithmic categorization of open-ended text into discrete predefined taxonomy classes.** Progressed from Naive Bayes and Support Vector Machines over TF-IDF vectors to deep convolutional networks, Hierarchical Attention Networks (HAN), and transformer encoders."
      },

      num: {
        t: "Text Classification Architectures Across Scale, Latency & Representative Accuracy",
        h: ["Architecture", "Feature Type", "Inference Latency (CPU)", "Multi-Label Support", "Data Requirement"],
        r: [
          ["Naive Bayes / Logistic Regression", "TF-IDF n-grams ($10^4$ features)", "< 1 ms", "Binary relevance / One-vs-Rest", "Small (100–1k examples)"],
          ["FastText (Joulin et al.)", "Averaged bag-of-tricks embeddings", "~2 ms", "Hierarchical Softmax", "Moderate (1k–10k examples)"],
          ["TextCNN (Kim, 2014)", "1D Convolutions over Word2Vec", "~15 ms", "Sigmoid binary cross-entropy", "Moderate (5k–50k examples)"],
          ["DistilBERT / TinyBERT", "Contextual transformer (6 layers)", "~30 ms", "Multi-label classification head", "Low-Moderate (few-shot to 10k)"],
          ["DeBERTa-v3 / RoBERTa-large", "Disentangled attention (24 layers)", "~120 ms (GPU: ~8 ms)", "Joint classification head", "Zero/Few-Shot or Fine-tuned"]
        ],
        n: "Text classification maps an input document $x$ to one or more category labels $y \\in \\mathcal{Y}$. In single-label multiclass problems, the output layer computes a probability distribution via the softmax function: $P(y = c \\mid x) = \\frac{\\exp(w_c^T h + b_c)}{\\sum_{j=1}^C \\exp(w_j^T h + b_j)}$, optimized using categorical cross-entropy. In multi-label classification (where a document simultaneously belongs to 'Legal', 'Finance', and 'Europe'), the problem is formulated as $C$ independent binary decisions using the sigmoid function: $\\sigma(z_c) = \\frac{1}{1 + \\exp(-z_c)}$, optimized using binary cross-entropy loss $\\mathcal{L} = -\\sum_{c=1}^C [y_c \\log \\sigma(z_c) + (1 - y_c) \\log (1 - \\sigma(z_c))]$. Document representation vectors $h$ are typically derived via mean-pooling or extracting the special `[CLS]` token embedding from the final transformer layer."
      },

      miss: [
        {
          w: "More complex models like transformers are always superior to Naive Bayes or Linear SVMs for text classification.",
          r: "On small datasets (< 1,000 samples) with distinct topical keywords, linear models over TF-IDF often match or outperform transformers while training in seconds, executing in sub-milliseconds on CPU, and avoiding severe overfitting."
        },
        {
          w: "Multi-class classification and multi-label classification are interchangeable terms.",
          r: "Multi-class means each document receives exactly ONE mutually exclusive label from $C$ choices (softmax activation). Multi-label means a document can receive zero, one, or multiple non-exclusive labels simultaneously (independent sigmoid activations)."
        },
        {
          w: "Accuracy is the correct metric for evaluating text classification performance.",
          r: "Real-world text categorization suffers from severe class imbalance (e.g., fraud tickets make up 0.1% of volume). A naive classifier predicting the majority class achieves 99.9% accuracy with 0% recall on fraud. Macro-F1 and Precision-Recall AUC must be used."
        },
        {
          w: "Long documents can simply be truncated to the first 512 tokens without losing classification accuracy.",
          r: "Critical evidence often appears at the conclusion or in specific footnotes of a contract or medical record. Truncating to 512 tokens causes false negatives; hierarchical chunk pooling, Longformer, or sliding-window chunk aggregation is required."
        }
      ],

      trade: {
        buys: [
          "Foundational capability automating spam filtering, intent routing, document tagging, and legal discovery.",
          "High operational throughput: fine-tuned small encoders (e.g., MiniLM, FastText) process thousands of texts per second per core.",
          "Clear, unambiguous operational deployment: easily monitored via confidence thresholds and confusion matrices.",
          "Enables active learning loops where low-confidence predictions are automatically routed to human reviewers."
        ],
        costs: [
          "Fixed taxonomy schemas struggle to accommodate evolving real-world concepts without model retraining.",
          "Long-tail classes with few examples suffer from poor precision unless addressed with focal loss or data augmentation.",
          "Susceptible to adversarial perturbation (subtle character substitutions or prompt injection in conversational inputs).",
          "Requires ongoing drift monitoring as vocabulary and linguistic phrasing shift over time."
        ],
        avoid: [
          "Do not deploy a single-label softmax model when classes are not strictly mutually exclusive.",
          "Never rely on global accuracy on imbalanced datasets; always track per-class Precision, Recall, and Macro-F1.",
          "Avoid using 70B parameter generative LLMs when a lightweight 20MB distilled encoder accomplishes the classification task with $100\\times$ lower cost."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
