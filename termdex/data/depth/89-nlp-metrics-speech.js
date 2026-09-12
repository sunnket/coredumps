/* ==========================================================================
   Depth pass 89 — NLP batch 4: Metrics, sentence semantics, acoustics & normalization.
   ROUGE, Sentence Embedding, Text Normalisation, Regular Expression,
   Speech Recognition, Text-to-Speech, Intent Recognition.

   Subword Levenshtein distances regularize lexical anomalies;
   conformer attention bridges continuous acoustic mel-spectrograms to phonemes.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "rouge",

      why: {
        before: "Evaluating text summarization models required human annotators manually scoring documents for coverage and conciseness, which was prohibitively expensive and impossible to automate inside training loops.",
        problem: "Unlike machine translation (which evaluates precision against short sentences), text summarization requires measuring **recall**—how much of the core information in a gold reference summary was captured by the candidate text.",
        shift: "**ROUGE (Recall-Oriented Understudy for Gisting Evaluation): A metric package that measures n-gram, longest common subsequence, and skip-bigram overlap between computer-generated summaries and human reference summaries.** Introduced by Chin-Yew Lin in 2004, ROUGE became the foundational standard for automated summarization benchmarks."
      },

      num: {
        t: "ROUGE Metric Variants: Mathematical Basis, Focus & Typical Benchmark Values",
        h: ["ROUGE Variant", "Mathematical Alignment Basis", "Primary Focus / Inductive Bias", "Typical SOTA Range (CNN/DM)", "Sensitivity"],
        r: [
          ["ROUGE-1", "Unigram (single token) overlap", "Factual vocabulary & content coverage", "44.0 – 48.0 F1", "Word frequency & vocabulary recall"],
          ["ROUGE-2", "Bigram (token pair) overlap", "Fluency, local phrasing & syntactic order", "20.0 – 25.0 F1", "Syntactic collocations and modifier binding"],
          ["ROUGE-L", "Longest Common Subsequence (LCS)", "Sentence-level structure without fixed n-gram size", "40.0 – 44.0 F1", "Preserves relative sequential word order"],
          ["ROUGE-Lsum", "LCS calculated split by newline delimiters", "Summary-level multi-sentence discourse flow", "41.0 – 45.0 F1", "Cross-sentence organization & paragraphing"],
          ["ROUGE-S", "Skip-bigram co-occurrence", "Word pairs with arbitrary gaps in between", "35.0 – 39.0 F1", "Robust to inserted adjectives or adverbs"]
        ],
        n: "Given reference summary set $\\mathcal{R}$ and candidate summary $C$, ROUGE-N recall is formulated as: $\\text{ROUGE-N}_{\\text{recall}} = \\frac{\\sum_{S \\in \\mathcal{R}} \\sum_{\\text{gram}_n \\in S} \\text{Count}_{\\text{match}}(\\text{gram}_n)}{\\sum_{S \\in \\mathcal{R}} \\sum_{\\text{gram}_n \\in S} \\text{Count}(\\text{gram}_n)}$. In modern evaluations, ROUGE is almost universally reported as the harmonic mean (F1-score) of ROUGE precision and recall: $F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}$. ROUGE-L uses dynamic programming to find the Longest Common Subsequence $\\text{LCS}(R, C)$ without requiring contiguous matches, automatically capturing sentence structure flexibility. However, standard ROUGE relies purely on surface-level lexical matching and ignores semantic paraphrasing; a summary using perfect synonyms ('feline' instead of 'cat') receives zero ROUGE credit."
      },

      miss: [
        {
          w: "ROUGE and BLEU are identical metrics under different names.",
          r: "BLEU is fundamentally **precision-oriented** with a brevity penalty, designed for machine translation where omitting target words is penalized. ROUGE is **recall-oriented**, designed for summarization to ensure essential facts from the reference are captured."
        },
        {
          w: "A high ROUGE score guarantees that a summary is factually accurate.",
          r: "ROUGE measures superficial word co-occurrence, not factual logic. A summary stating 'The CEO did NOT resign' can achieve 90%+ ROUGE-1 against a reference stating 'The CEO did resign', despite asserting the exact opposite fact."
        },
        {
          w: "Extractive summarizers score lower on ROUGE than abstractive summarizers.",
          r: "Extractive summarizers often score higher on ROUGE than abstractive summarizers because they lift verbatim sentences directly from source texts, matching reference vocabulary choices far more frequently than paraphrasing models."
        },
        {
          w: "ROUGE implementations in Python produce identical scores across all libraries.",
          r: "Subtle differences in stemmers (Porter vs Snowball), punctuation stripping, newline handling, and tokenization between `rouge-score`, `pyrouge`, and Hugging Face `evaluate` can cause shifts of 1 to 3 F1 points on identical outputs."
        }
      ],

      trade: {
        buys: [
          "Fast, deterministic, and cost-free evaluation enabling automated checkpoint tracking during training.",
          "Directly quantifies whether key information from reference texts was preserved in generated outputs.",
          "Language-independent metric computable on raw text strings without neural inference hardware.",
          "Established gold standard for academic reproducibility across classical benchmarks (CNN/DailyMail, XSum)."
        ],
        costs: [
          "Blind to paraphrasing: penalizes generated text that conveys identical meaning using alternative vocabulary.",
          "Severely decoupled from human assessments of factual consistency and hallucination rates.",
          "Subject to length hacking: un-penalized recall metrics can be gamed by generating excessively verbose summaries.",
          "Cannot evaluate discourse-level coherence, coreference clarity, or rhetorical logic."
        ],
        avoid: [
          "Never evaluate summarization quality exclusively with ROUGE; supplement with BERTScore and NLI faithfulness checks.",
          "Do not report ROUGE recall alone without precision and F1 to prevent rewarding bloated summaries.",
          "Avoid comparing ROUGE numbers across publications without verifying identical stemming and tokenization flags."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sentence-embedding",

      why: {
        before: "Representing entire sentences required either averaging static word vectors (Word2Vec/GloVe), which destroyed syntax and word order, or taking the `[CLS]` token from vanilla BERT, which suffered from severe embedding collapse (anisotropy).",
        problem: "Vanilla BERT embeddings map all sentences into a narrow, high-dimensional cone where cosine similarity between unrelated sentences is artificially high (~0.7 to 0.9), making semantic search and clustering ineffective.",
        shift: "**Sentence Embedding: Dense vector representations that map entire sentences into a semantically meaningful metric space where vector distances reflect semantic similarity.** Pioneered by Sentence-BERT (SBERT, Reimers & Gurevych 2019) using siamese and triplet network training objectives."
      },

      num: {
        t: "Sentence Embedding Models: Architectures, Dimensions & MTEB Retrieval Benchmarks",
        h: ["Model Architecture", "Vector Dimension ($d$)", "Context Window", "MTEB Retrieval (NDCG@10)", "Latency (1k tokens / CPU)"],
        r: [
          ["GloVe Mean Pooling", "300", "Unlimited", "21.4%", "~1 ms"],
          ["Vanilla BERT [CLS] (No Tuning)", "768", "512", "30.1%", "~45 ms"],
          ["all-MiniLM-L6-v2 (SBERT)", "384", "256", "41.9%", "~8 ms"],
          ["bge-large-en-v1.5 (BAAI)", "1024", "512", "54.3%", "~60 ms"],
          ["text-embedding-3-large (OpenAI)", "3072 / 1536 (Matryoshka)", "8192", "55.4%", "API / Cloud Dependent"],
          ["NV-Embed-v2 (NVIDIA)", "4096", "32768", "59.2%", "GPU Mandated (7B LLM)"]
        ],
        n: "Sentence-BERT resolves BERT's representational anisotropy by training siamese networks with a contrastive or Multiple Negatives Ranking (MNR) loss. Given sentence pair $(s_A, s_B)$, representations are computed via mean-pooling across all token hidden states: $u = \\text{MeanPool}(\\text{BERT}(s_A))$, $v = \\text{MeanPool}(\\text{BERT}(s_B))$. For classification tasks (SNLI/MNLI), vectors are concatenated with their absolute difference: $[u, v, |u - v|]$ and passed through a softmax classifier. For retrieval, InfoNCE / MultipleNegativesRankingLoss optimizes: $\\mathcal{L} = -\\sum_{i=1}^B \\log \\frac{\\exp(\\text{sim}(u_i, v_i^+) / \\tau)}{\\sum_{j=1}^B \\exp(\\text{sim}(u_i, v_j) / \\tau)}$, where in-batch negatives serve as negative samples. Modern models integrate **Matryoshka Representation Learning (MRL)**, allowing the front $d' < d$ dimensions to be truncated with minimal loss of retrieval accuracy."
      },

      miss: [
        {
          w: "Taking the `[CLS]` token embedding from an un-fine-tuned BERT produces high-quality sentence embeddings.",
          r: "Reimers & Gurevych proved that raw `[CLS]` embeddings from off-the-shelf BERT perform worse than simple GloVe word-averaging on Semantic Textual Similarity (STS) tasks due to catastrophic representational anisotropy."
        },
        {
          w: "Higher embedding vector dimensionality ($d=4096$ vs $d=384$) always yields better downstream performance.",
          r: "Larger dimensions increase vector storage and nearest-neighbor search latency quadratically without guaranteed gains. A 384-dimensional MiniLM model often matches a 1536-dimensional model on specific domain retrieval while running $10\\times$ faster."
        },
        {
          w: "Sentence embeddings capture exact keyword matches better than BM25.",
          r: "Dense embeddings frequently suffer from the 'vocabulary mismatch' failure mode for rare proper nouns, part serial numbers, and exact codes. Hybrid search combining dense embeddings with sparse lexical BM25 is industry best practice."
        },
        {
          w: "Cosine similarity and dot product are interchangeable for all sentence embeddings.",
          r: "Dot product equals cosine similarity only if the vectors are strictly $L_2$-normalized (unit length $\\|v\\|_2 = 1$). If un-normalized embeddings are queried with dot product, vector magnitude (often correlated with sentence length) will skew rankings."
        }
      ],

      trade: {
        buys: [
          "Enables instantaneous sub-millisecond semantic search and similarity matching over millions of documents via HNSW indexes.",
          "Converts variable-length natural language text into fixed-size mathematical vectors compatible with standard ML classifiers.",
          "Underpins all modern Retrieval-Augmented Generation (RAG) vector retrieval systems.",
          "Matryoshka learning allows dynamic trade-offs between memory footprint and search precision."
        ],
        costs: [
          "Fixed-dimensional compression bottleneck: condensing a 500-word passage into 384 numbers loses fine-grained logical details.",
          "Susceptible to lexical drift: can return passages that share high semantic theme but contradict the query's core premise.",
          "Vector index memory overhead (storing millions of 1536-dim float32 vectors requires gigabytes of RAM).",
          "Fine-tuning requires large datasets of hard negative pairs to prevent false-positive semantic drift."
        ],
        avoid: [
          "Never use un-fine-tuned vanilla BERT `[CLS]` embeddings for cosine similarity or clustering.",
          "Do not deploy pure dense vector search without BM25 hybrid ranking when users query exact model IDs or codes.",
          "Avoid computing pairwise cosine similarities across millions of texts in $O(N^2)$ without vector indexing libraries (FAISS/HNSW)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "text-normalisation",

      why: {
        before: "Text processing systems encountered infinite superficial variations in capitalization, Unicode encodings, whitespace, and punctuation, treating 'apple', 'Apple', and 'apple\u00a0' as three completely unrelated vocabulary tokens.",
        problem: "Vocabulary explosion dilutes statistical counts; unseen typographical variants cause out-of-vocabulary errors, cache misses, and broken downstream parsers.",
        shift: "**Text Normalisation: Transforming noisy, heterogeneous text into a canonical, standardized representation before processing.** Covers Unicode normalization (NFC/NFKD), casing transformations, whitespace cleanup, contraction expansion, and text-to-number expansion (verbalization for TTS)."
      },

      num: {
        t: "Unicode Normalization Forms: Equivalence Rules & Transformation Behaviors",
        h: ["Normalization Form", "Full Name", "Equivalence Principle", "Example Input", "Standardized Output"],
        r: [
          ["NFC", "Normalization Form C", "Canonical Decomposition followed by Canonical Composition", "e + \u0301 (combining acute)", "é (single precomposed codepoint U+00E9)"],
          ["NFD", "Normalization Form D", "Canonical Decomposition", "é (precomposed U+00E9)", "e + \u0301 (base letter + combining mark)"],
          ["NFKC", "Normalization Form KC", "Compatibility Decomposition followed by Canonical Composition", "2⁵ (superscript 5) or ﬁ (ligature)", "25 (standard digit) / 'fi' (separate letters)"],
          ["NFKD", "Normalization Form KD", "Compatibility Decomposition", "ﬁ (ligature U+FB01)", "f + i (separate decomposed characters)"]
        ],
        n: "Text normalization operates across three distinct pipeline layers: (1) **Encoding layer**: Standardizing Unicode representation via NFKC normalization to resolve typographic ligatures (ﬁ $\\rightarrow$ fi), full-width Japanese characters, and non-breaking whitespaces. (2) **Lexical layer**: Lowercasing, contraction expansion ('don't' $\\rightarrow$ 'do not'), spelling correction (Levenshtein distance), and emoji translation. (3) **Verbalization layer**: In speech synthesis (TTS) and ASR, expanding non-standard words (NSW) such as dates ('10/12/24' $\\rightarrow$ 'October twelfth twenty twenty-four'), currency (`$5.00` $\\rightarrow$ 'five dollars'), and abbreviations ('Dr. Smith' $\\rightarrow$ 'Doctor Smith'). Improper normalization can silently corrupt model inputs: stripping accents in French or Spanish fundamentally alters word meaning (e.g., 'ano' vs 'año')."
      },

      miss: [
        {
          w: "Aggressive lowercasing and punctuation removal is always the first step in any NLP pipeline.",
          r: "Aggressive normalization destroys vital features: lowercasing obliterates proper noun capitalization for Named Entity Recognition (NER); stripping punctuation breaks sentence boundaries and code indentation; removing accents corrupts multilingual text."
        },
        {
          w: "Python's `.lower()` is sufficient for complete case normalization.",
          r: "Python `.lower()` fails on language-specific casing rules. In German, 'ß' upper-cases to 'SS', which lower-cases to 'ss', altering string length. In Turkish, lowercase 'I' is 'ı' (dotless), whereas 'İ' (dotted) is the uppercase of 'i'. `str.casefold()` must be used."
        },
        {
          w: "Subword tokenizers (like Byte-Pair Encoding) make text normalization unnecessary.",
          r: "While BPE can tokenize arbitrary byte sequences, un-normalized text bloats the vocabulary with redundant subwords (e.g., separate tokens for 'cat', 'Cat', and typographic ligature variants), diluting token frequency statistics."
        },
        {
          w: "Unicode NFC and NFKC produce identical outputs on standard ASCII text.",
          r: "While identical on pure ASCII, NFKC modifies compatibility characters (converting circled digits \u2460 to standard 1, fractions ½ to 1/2, and superscripts), which can inadvertently destroy mathematical or typographic meaning."
        }
      ],

      trade: {
        buys: [
          "Reduces vocabulary size and eliminates data sparsity across statistical and neural models.",
          "Prevents out-of-vocabulary (OOV) tokens, Unicode encoding mismatches, and broken search queries.",
          "Essential prerequisite for speech synthesis verbalization and reliable text search indexing.",
          "Protects against security vulnerabilities such as homoglyph spoofing attacks (Cyrillic 'а' vs Latin 'a')."
        ],
        costs: [
          "Aggressive normalization discards subtle linguistic signals (casing for NER, punctuation for sentiment/code).",
          "Irreversible information loss: original typographic styling and casing cannot be reconstructed from normalized strings.",
          "Language-specific normalization requires complex linguistic rules and locale-aware libraries.",
          "Preprocessing compute overhead when processing gigabytes of streaming log or web text."
        ],
        avoid: [
          "Never strip casing or punctuation prior to running modern transformer NER or code generation models.",
          "Do not use simple regex character replacement for Unicode text without formal NFKC normalization.",
          "Avoid using basic `.lower()` when normalizing case-sensitive multilingual text; use `.casefold()`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "regular-expression",

      why: {
        before: "Searching for string patterns in text required writing nested imperative loops with endless character indexing checks, creating thousands of lines of fragile, unmaintainable string parsing code.",
        problem: "Text validation (validating emails, phone numbers, IP addresses, log formatting) requires matching formal regular languages with flexible wildcards, alternations, and repetitions.",
        shift: "**Regular Expression (Regex / RE): A formal sequence of characters defining a search pattern according to regular language theory.** Introduced by Stephen Kleene (1951), implemented via Deterministic and Nondeterministic Finite Automata (DFA/NFA), regex remains the backbone of deterministic pattern matching."
      },

      num: {
        t: "Regular Expression Engines: Automata Mechanics, Time Complexity & Backtracking",
        h: ["Engine Type", "Underlying Automaton", "Time Complexity", "Memory Complexity", "Features / Failure Mode"],
        r: [
          ["DFA (Thompson / RE2 / Rust)", "Deterministic Finite Automaton", "$O(N)$ linear time in text length", "$O(2^M)$ state transitions", "No backreferences; immune to catastrophic backtracking (ReDoS)"],
          ["Traditional NFA (PCRE / Python)", "Backtracking recursive traversal", "$O(2^N)$ worst-case exponential", "$O(M)$ small memory stack", "Supports backreferences & lookarounds; vulnerable to ReDoS"],
          ["POSIX NFA", "Exhaustive backtracking NFA", "$O(N \\cdot M^2)$", "$O(M)$ memory", "Finds longest-leftmost match; slow performance on large inputs"],
          ["Hybrid JIT (PCRE2 / V8)", "On-the-fly machine code compilation", "Near-DFA on common paths", "Medium compile-time cost", "Optimized fast paths with fallback to NFA backtracking"]
        ],
        n: "A regular expression denotes a regular language recognized by a finite automaton. Under Chomsky hierarchy level 3, pure regular languages satisfy closure under union ($R_1 | R_2$), concatenation ($R_1 R_2$), and Kleene star ($R^*$). Thompson's NFA construction algorithm compiles a regex of length $M$ into an NFA with $O(M)$ states in $O(M)$ time, and simulates execution over text of length $N$ in strict $O(M \\cdot N)$ time. However, modern regex engines (Python `re`, JavaScript RegExp, Perl PCRE) support non-regular extensions like **backreferences** (`\\1`) and **lookarounds** (`(?<=...)`), turning parsing NP-complete. When evaluating pathological expressions (e.g., `(a+)+$`) against non-matching strings (`aaaa...X`), recursive backtracking engines suffer from **Catastrophic Backtracking** ($O(2^N)$ steps), creating Regular Expression Denial of Service (ReDoS) vulnerabilities."
      },

      miss: [
        {
          w: "Regular expressions can parse recursive, nested data formats like HTML, XML, or JSON.",
          r: "Regular expressions define regular languages (Chomsky Type 3). Arbitrarily nested structures like HTML or JSON require context-free grammars (Chomsky Type 2) with pushdown automata (state stacks) to track opening and closing tag balance."
        },
        {
          w: "All regex engines execute in linear time with text length.",
          r: "Standard engines in Python, Node.js, and Java use backtracking NFAs. A poorly constructed expression like `([a-zA-Z]+)*` can lock up a CPU core for hours on a 30-character string due to exponential backtracking ($O(2^N)$)."
        },
        {
          w: "Using regex in NLP is an obsolete anti-pattern superseded by deep learning.",
          r: "Production NLP pipelines rely heavily on high-speed regex for tokenization (GPT-4's `tiktoken` uses regex splits), PII scrubbing (credit cards, SSNs), URL extraction, and markdown parsing, executing thousands of times faster than neural models."
        },
        {
          w: "Compiling a regex (`re.compile`) is unnecessary because Python caches compiled expressions automatically.",
          r: "While Python maintains an internal LRU cache of recently compiled expressions (default 512 entries), high-throughput services with dynamic or large numbers of expressions risk cache thrashing without explicit pre-compilation."
        }
      ],

      trade: {
        buys: [
          "Zero latency and microsecond execution: unmatched speed for deterministic pattern matching and data extraction.",
          "Universal availability: built into every modern programming language, shell utility (grep, sed, awk), and database.",
          "Compact, concise syntax expressing complex character constraints in a single line of code.",
          "Deterministic execution: guarantees 100% precision for strictly structured patterns (UUIDs, IP addresses, dates)."
        ],
        costs: [
          "Notoriously difficult to read, debug, and maintain; complex patterns become 'write-only' opaque code.",
          "Vulnerable to Catastrophic Backtracking (ReDoS) if untrusted input is evaluated against poorly designed expressions.",
          "Cannot model hierarchical, nested, or recursive grammars (e.g., parsing mathematical ASTs or nested brackets).",
          "Fragile to semantic variations: fails completely when searching for concepts rather than exact character syntax."
        ],
        avoid: [
          "Never parse HTML, XML, or JSON using regular expressions; use dedicated AST and DOM parsers.",
          "Avoid nested quantifiers like `(a+)+` or `(a|a)+` that trigger catastrophic exponential ReDoS backtracking.",
          "Do not use backtracking engines (Python `re`) on untrusted user-supplied regex strings; use Google's `re2`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "speech-recognition",

      why: {
        before: "Converting spoken audio into text required human transcriptionists or rigid phonetic matchers that required speakers to speak in unnatural, isolated staccato words and calibrate models to their individual voice profiles.",
        problem: "Continuous acoustic speech features continuous co-articulation, background noise, accents, varying speech rates, and non-stationary acoustic waveforms that cannot be parsed with discrete text rules.",
        shift: "**Automatic Speech Recognition (ASR): Algorithmic transcription of acoustic spoken audio waveforms into written text.** Evolved from Gaussian Mixture Model-Hidden Markov Models (GMM-HMMs with Kaldi) to end-to-end neural sequence models (CTC, RNN-Transducer) and weakly-supervised transformer encoders (Whisper)."
      },

      num: {
        t: "ASR Architectures: Word Error Rate (WER), Latency & Algorithmic Paradigms",
        h: ["Paradigm", "Representative System", "LibriSpeech Clean WER", "Latency Mode", "Alignment Mechanism"],
        r: [
          ["GMM-HMM Hybrid", "Kaldi Toolkit", "5.0 – 6.5%", "Streaming (< 200 ms)", "Viterbi forced alignment to triphones"],
          ["Connectionist Temporal (CTC)", "DeepSpeech (Baidu)", "4.5 – 5.5%", "Streaming capable", "CTC collapse operator with blank tokens"],
          ["Recurrent Neural Transducer", "RNN-T / Conformer-T", "2.8 – 3.5%", "Streaming real-time (< 100 ms)", "Prediction + Transcription joint network"],
          ["Autoregressive Transformer", "OpenAI Whisper (large-v3)", "1.8 – 2.5%", "Chunked batch (30s windows)", "Cross-attention decoder autoregression"],
          ["Dual-Path Conformer", "Google USM / Emformer", "2.0 – 2.4%", "Streaming / Hybrid", "Chunk-level multi-head self-attention"]
        ],
        n: "ASR transforms raw 16kHz audio waveforms $x(t)$ into text sequences $Y = (y_1, \\dots, y_U)$. Audio is converted into continuous 80-channel log-mel filterbank spectrograms via Short-Time Fourier Transform (STFT). In classical **CTC (Connectionist Temporal Classification)**, an acoustic encoder generates a probability distribution over vocabulary tokens plus a blank token $\\epsilon$ for each time frame $t$: $P(\\pi \\mid X) = \\prod_{t=1}^T P(\\pi_t \\mid X)$. The CTC collapse mapping $\\mathcal{B}$ removes repeated tokens and blanks (e.g., `c c - a a t t` $\\rightarrow$ `cat`). Modern models like OpenAI Whisper utilize weakly supervised pre-training over 680,000+ hours of multilingual audio, processing 30-second spectrogram chunks through an encoder-decoder transformer to joint-predict language identification, timestamp tokens, voice activity detection, and transcribed text."
      },

      miss: [
        {
          w: "ASR systems identify words directly from raw audio waveform pressure points.",
          r: "Raw audio waveforms are first transformed into frequency-domain time-frequency representations (mel-frequency cepstral coefficients or 80-channel log-mel spectrograms) using discrete Fourier transforms."
        },
        {
          w: "Word Error Rate (WER) of 0% means the transcription is flawless in punctuation and casing.",
          r: "Standard academic LibriSpeech WER normalizes text by stripping all punctuation and uppercasing words. An ASR model can achieve 3% WER while failing to punctuate or capitalize financial numbers or names."
        },
        {
          w: "Whisper can be deployed out-of-the-box for low-latency live telephone streaming.",
          r: "Whisper is intrinsically designed for fixed 30-second chunk processing with an autoregressive decoder, incurring 1 to 3 seconds of latency. Live real-time streaming requires streaming Conformer-RNN-T or causal CTC models."
        },
        {
          w: "An ASR model trained on clean studio voice text performs equally well in noisy restaurants.",
          r: "Acoustic models suffer severe performance collapse under reverberation, overlapping speakers (cocktail party problem), and background SNR degradation unless trained with heavy acoustic data augmentation (SpecAugment, noise injection)."
        }
      ],

      trade: {
        buys: [
          "Bridges voice and computation: enables voice assistants, hands-free dictation, automated meeting notes, and call center QA.",
          "Weakly supervised neural models (Whisper) achieve human-level transcription across dozens of global languages.",
          "Provides precise word-level and character-level timestamps for automated video subtitle synchronization.",
          "CTC and RNN-T architectures deliver real-time streaming transcription with under 100ms latency."
        ],
        costs: [
          "High compute requirements: processing audio through large transformer encoders requires dedicated GPU/NPU acceleration.",
          "Degrades on accented speech, specialized domain jargon (medical/legal), and noisy acoustic environments.",
          "Autoregressive models can enter hallucinatory repetition loops during long periods of silence or background music.",
          "Speaker diarization (who spoke when) requires an entirely separate acoustic clustering and embedding pipeline."
        ],
        avoid: [
          "Do not use 30-second chunked transformer decoders (Whisper) for low-latency real-time conversational bots.",
          "Never evaluate ASR performance on specialized medical/financial text using generic LibriSpeech WER benchmarks.",
          "Avoid running full float32 Whisper models on edge devices without int8 or int4 quantization (whisper.cpp)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "text-to-speech",

      why: {
        before: "Early speech synthesizers concatenated pre-recorded snippets of human voice (concatenative synthesis) or used robotic formant oscillators (formant synthesis) that sounded metallic, stuttering, and unnatural.",
        problem: "Human voice contains subtle prosody, emotional inflection, natural breathing pauses, continuous co-articulation, and pitch contours that cannot be produced by stitching audio clips together.",
        shift: "**Text-to-Speech (TTS): Automated neural synthesis of natural, expressive, and human-like spoken acoustic audio from written text.** Advanced from parametric models to two-stage neural pipelines (Tacotron 2 + WaveNet) and modern single-stage diffusion / latent neural codecs (VITS, FastSpeech 2, XTTS, ElevenLabs)."
      },

      num: {
        t: "TTS Paradigms: Audio Fidelity (MOS), Real-Time Factor (RTF) & Architectural Flow",
        h: ["Architecture", "Synthesis Paradigm", "Mean Opinion Score (MOS 1–5)", "Real-Time Factor (RTF)", "Voice Cloning Support"],
        r: [
          ["Concatenative / Unit Selection", "Stitched pre-recorded acoustic diphone slices", "2.8 – 3.2", "< 0.05 (CPU)", "Impossible (requires 50h single speaker)"],
          ["Tacotron 2 + WaveNet", "Seq2Seq mel prediction + Autoregressive vocoder", "4.1 – 4.3", "> 1.5 (Slower than real-time)", "Complex multi-speaker embedding"],
          ["FastSpeech 2 + HiFi-GAN", "Non-autoregressive feedforward + GAN vocoder", "4.2 – 4.4", "< 0.02 (Ultra-fast GPU)", "Speaker conditioning vectors"],
          ["VITS (Variational Inference)", "End-to-end VAE + Normalizing Flows + GAN", "4.4 – 4.6", "~0.05 (Real-time CPU/GPU)", "Few-shot reference adaptation"],
          ["Neural Audio Codec (XTTS/ElevenLabs)", "Autoregressive token LM + Latent flow vocoder", "4.7 – 4.9", "~0.2 – 0.4", "Zero-shot cloning (3-second reference)"]
        ],
        n: "Modern neural Text-to-Speech operates through a structured acoustic pipeline: (1) **Text Normalization and Grapheme-to-Phoneme (G2P)**: Raw text is normalized and converted to phonetic symbols (e.g., IPA: `/fəˈnɛtɪk/`) to eliminate pronunciation ambiguities. (2) **Acoustic Feature Generation**: An acoustic model generates intermediate representations (80-channel mel-spectrograms). In non-autoregressive models like FastSpeech 2, duration, pitch, and energy predictors resolve one-to-many alignment using explicitly predicted phoneme durations. (3) **Neural Vocoder**: A vocoder converts mel-spectrograms into 24kHz or 48kHz audio waveforms. Generative Adversarial Network vocoders (like **HiFi-GAN**) use multi-period and multi-scale discriminators to produce high-fidelity audio with microsecond inference times: $x = G(\\text{mel})$. Zero-shot models (XTTS, Voicebox) treat audio as discrete tokens via neural audio codecs (EnCodec), predicting speech autoregressively conditioned on a speaker prompt vector."
      },

      miss: [
        {
          w: "A TTS model reads raw text characters directly into audio without phonetic conversion.",
          r: "Direct character-to-audio models struggle with English homographs ('read' past vs present, 'live' verb vs adjective). Production TTS pipelines use Grapheme-to-Phoneme (G2P) models and pronunciation dictionaries (CMUDict) to generate explicit phoneme inputs."
        },
        {
          w: "WaveNet is the modern standard vocoder in production TTS systems.",
          r: "Autoregressive WaveNet synthesizes audio sample-by-sample (24,000 forward passes for 1 second of audio), making it far too slow for real-time applications. Modern systems exclusively use parallel GAN vocoders (HiFi-GAN) or normalizing flows."
        },
        {
          w: "TTS systems can generate endless audio without alignment drift or word skipping.",
          r: "Autoregressive attention-based models (like Tacotron) frequently suffer from catastrophic failure modes: skipping difficult words, repeating syllables endlessly, or mumbling at sentence boundaries. Non-autoregressive models (FastSpeech 2) solve this with explicit duration predictors."
        },
        {
          w: "Voice cloning requires hours of high-quality studio audio recordings of the target speaker.",
          r: "Zero-shot neural audio codec models extract speaker timbre and acoustic room reflections from as little as 3 seconds of reference audio using pre-trained speaker encoder embeddings or in-context acoustic prefixing."
        }
      ],

      trade: {
        buys: [
          "Produces natural, expressive, and human-sounding voice audio with emotional nuance and controllable pacing.",
          "Zero-shot voice cloning enables instant localization, personalized audiobooks, and accessibility screen readers.",
          "Non-autoregressive models achieve Real-Time Factors $< 0.05$, enabling real-time voice streaming assistants.",
          "Enables voice accessibility for visually impaired users and speech-impaired individuals (voice banking)."
        ],
        costs: [
          "Severe safety and security risks: facilitates audio deepfakes, voice biometric spoofing, and fraud impersonation.",
          "Pronunciation dictionaries require continual curation for novel brand names, acronyms, and proper nouns.",
          "High GPU compute overhead for cutting-edge zero-shot diffusion and audio language models.",
          "Prosody control (inserting deliberate dramatic pauses, sarcasm, or whispering) remains difficult to direct precisely."
        ],
        avoid: [
          "Never deploy voice cloning capabilities without cryptographic watermarking (e.g., SynthID) and security guardrails.",
          "Do not use autoregressive sample-level vocoders (WaveNet) for low-latency production applications.",
          "Avoid bypassing G2P text normalization when synthesizing domain-specific technical or medical texts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "intent-recognition",

      why: {
        before: "Interactive voice response (IVR) phone systems and customer service bots used rigid keyword matching or numerical phone trees ('press 1 for billing'), frustrating users whose natural phrasing failed to trigger exact keywords.",
        problem: "Users express identical underlying intentions through hundreds of diverse linguistic formulations, colloquialisms, typos, and indirect speech acts ('My card is blocked', 'I can't pay', 'Payment failed').",
        shift: "**Intent Recognition: Classifying an utterance into a semantic category representing the user's intended goal or action.** Evolved from rule-based regex patterns to joint intent classification and slot filling models (Rasa, Snips NLU, BERT-based dialog encoders)."
      },

      num: {
        t: "Intent Recognition Paradigms: Latency, Data Efficiency & Multi-Intent Accuracy",
        h: ["Paradigm", "Representative Tooling", "Few-Shot Accuracy", "Latency (CPU)", "Out-of-Scope (OOS) Detection"],
        r: [
          ["Keyword / Regex Rules", "Custom AST / Rule Engine", "0% (requires explicit rules)", "< 0.5 ms", "Poor (false positives on keywords)"],
          ["Bag-of-Words + SVM", "Scikit-Learn / Classical NLP", "65.0%", "~1 ms", "Moderate (confidence thresholding)"],
          ["Dual Intent-Slot Transformer", "JointBERT / Rasa DIET", "88.5%", "~25 ms", "High (cosine distance to fallbacks)"],
          ["Dense Embedding Matching", "SBERT + SetFit / KNN", "92.0%", "~8 ms", "High (Mahalanobis distance)"],
          ["Instruction-Tuned LLM", "Few-shot In-Context Prompting", "95.5%", "~400 ms", "Very High (natural reasoning on ambiguity)"]
        ],
        n: "In conversational AI systems, Intent Recognition is formalized as mapping utterance $X = (x_1, \\dots, x_T)$ to intent class $y \\in \\mathcal{I}$. It is typically trained jointly with **Slot Filling** (Sequence Labeling) in architectures like JointBERT or Rasa's DIET (Dual Intent and Entity Transformer). The joint loss minimizes: $\\mathcal{L} = \\mathcal{L}_{\\text{intent}} + \\lambda \\mathcal{L}_{\\text{slots}}$, where $\\mathcal{L}_{\\text{intent}}$ is the cross-entropy loss over the `[CLS]` token representation and $\\mathcal{L}_{\\text{slots}}$ is the CRF loss over the remaining sequence token representations. In modern few-shot settings, **SetFit (Sentence Transformer Fine-Tuning)** pairs contrastive Siamese fine-tuning on a handful of examples per intent with a logistic regression head, achieving high classification accuracy with as few as 8 labeled examples per class."
      },

      miss: [
        {
          w: "Intent recognition is simply generic text classification under a different name.",
          r: "Generic text classification categorizes static topics (e.g., sports vs politics). Intent recognition identifies actionable, goal-driven commands in conversational dialog, requiring joint slot extraction ('flight_booking' requiring `origin` and `destination`), context carryover, and out-of-scope fallback handling."
        },
        {
          w: "A high intent classification confidence score means the user definitely wants that action performed.",
          r: "Standard softmax layers output overconfident probabilities even on complete gibberish or out-of-domain queries. Robust systems use Mahalanobis distance, temperature scaling, or dedicated Out-of-Scope (OOS) classification heads."
        },
        {
          w: "Users always express exactly one single intent per message.",
          r: "Real-world conversational utterances frequently contain compound multi-intents ('Cancel my subscription and refund my last payment'). Single-label intent classifiers discard the second intent unless formulated as multi-label or broken down by an intent planner."
        },
        {
          w: "LLMs make dedicated intent recognition models obsolete in chatbots.",
          r: "Calling a generative LLM for simple intent routing incurs 300ms–1000ms latency and high API costs. A lightweight 15MB intent classifier (such as SetFit or DIET) executes in 5ms on CPU with 100% deterministic taxonomy mapping."
        }
      ],

      trade: {
        buys: [
          "Directly converts conversational user language into deterministic API calls and backend business workflows.",
          "Joint intent-slot models resolve both user intent and required parameters in a single forward pass.",
          "Extremely lightweight: modern few-shot models (SetFit) achieve $>90\\%$ accuracy on CPU with 10 examples per intent.",
          "Essential component for building deterministic, regulated conversational bots with reliable fallback logic."
        ],
        costs: [
          "Fixed intent taxonomies struggle to adapt when user queries fall outside predefined business categories.",
          "Multi-intent utterances require complex sentence splitting or multi-label classification architectures.",
          "Overlapping intent definitions create label ambiguity and degrade classifier boundary calibration.",
          "Requires continuous active learning loops to discover and label novel emerging intents from user logs."
        ],
        avoid: [
          "Do not deploy intent classification models without an explicit Out-of-Scope (OOS) or fallback threshold.",
          "Never create overlapping, ambiguous intent classes (e.g., 'check_balance' vs 'view_account') without strict separation.",
          "Avoid using large generative LLMs for high-throughput, latency-critical routing when a 10MB encoder suffices."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
