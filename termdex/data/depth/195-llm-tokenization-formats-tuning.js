(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "wordpiece",
      why: {
        before: "Early NLP models used word-level vocabularies that suffered from severe out-of-vocabulary (OOV) errors on rare or inflected words, or character-level tokenization which created excessively long sequence lengths and weak semantic representations.",
        problem: "Rule-based stemmers and static word lists failed to scale across multi-lingual datasets, while Byte Pair Encoding (BPE) merged pairs purely by raw co-occurrence frequency rather than maximizing corpus probability under a statistical language model.",
        shift: "WordPiece constructs a subword vocabulary by iteratively selecting merges that maximize the likelihood of a unigram language model over the training corpus, marking non-initial subword tokens with a prefix (e.g., `##ing` in BERT) to enable compact vocabularies (30k tokens) with zero out-of-vocabulary failure modes."
      },
      num: {
        t: "Subword Tokenization Algorithms Comparison",
        h: ["Algorithm", "Selection Metric", "Subword Continuation Marker", "Pre-tokenization Requirement", "Primary Architecture"],
        r: [
          ["WordPiece", "Likelihood gain (Mutual Info)", "Prefix ## (e.g. ##ing)", "Whitespace & Punctuation split", "BERT, DistilBERT, MobileBERT"],
          ["Byte-Pair Encoding (BPE)", "Raw frequency of byte pairs", "End-of-word </w> or space marker", "Whitespace / Regex split", "GPT-2, GPT-4, RoBERTa"],
          ["Unigram Language Model", "Prunes low-loss-drop tokens", "Meta-symbol (e.g. _)", "None (raw character stream)", "T5, SentencePiece, ALBERT"],
          ["Byte-level BPE (BBPE)", "Byte frequency over UTF-8", "Leading space byte (Gpt2 Ġ)", "Regex pre-tokenizer", "LLaMA, GPT-NeoX, Mistral"],
          ["Word-Level Dictionary", "Static frequency threshold", "None (full word tokens)", "Language-specific stemmer", "Word2Vec, FastText, GloVe"]
        ],
        n: "WordPiece evaluates candidate pairs $(u, v)$ by maximizing $L = \\frac{\\text{count}(uv)}{\\text{count}(u) \\times \\text{count}(v)}$, prioritizing pairs whose mutual information is highest. At inference time, it applies greedy longest-match-first matching: scanning for the longest prefix in the vocabulary and prefixing subsequent segments with `##`."
      },
      miss: [
        {
          w: "WordPiece and Byte Pair Encoding (BPE) are the exact same algorithm with different names.",
          r: "BPE merges the most frequently occurring pair of subwords, whereas WordPiece chooses pairs that maximize the language model likelihood (normalized by individual token frequencies)."
        },
        {
          w: "WordPiece tokenization can never produce an [UNK] (unknown) token.",
          r: "If an input contains a character not present in the base character alphabet (e.g., an unseen emoji or exotic Unicode glyph), WordPiece marks the entire word as `[UNK]`."
        },
        {
          w: "The '##' prefix in WordPiece adds extra characters to the input text.",
          r: "`##` is purely an internal token string convention denoting that the token is attached to the previous subword without intervening whitespace; it is stripped during detokenization."
        },
        {
          w: "WordPiece operates directly on raw binary bytes without pre-tokenization.",
          r: "WordPiece strictly requires whitespace and punctuation pre-tokenization prior to subword segmentation, unlike byte-level SentencePiece models."
        }
      ],
      trade: {
        buys: [
          "Eliminates out-of-vocabulary issues for all words composed of known base characters.",
          "Statistically grounded vocabulary construction prioritizing high mutual information pairs.",
          "Compact vocabulary sizes (typically 30,000 tokens) minimizing embedding layer memory footprint.",
          "Greedy longest-match inference runs in linear $O(N)$ time relative to word character length."
        ],
        costs: [
          "Requires language-specific pre-tokenization and whitespace rules that fail on non-segmented scripts (Chinese, Japanese).",
          "An unseen single character causes the entire word to collapse into an `[UNK]` token.",
          "Cannot handle arbitrary binary files or raw byte payloads unlike Byte-Level BPE.",
          "Subword split boundaries do not always align with true linguistic morphological stems."
        ],
        avoid: [
          "Avoid using WordPiece without language-specific pre-tokenizers on unspaced languages like Chinese.",
          "Avoid manually altering `##` prefixes without using canonical tokenizer detokenization functions.",
          "Avoid initializing WordPiece vocabularies without comprehensive base character and punctuation coverage.",
          "Avoid assuming subword boundaries correlate perfectly with grammatical syllables or morphemes."
        ]
      }
    },
    {
      slug: "sentencepiece",
      why: {
        before: "Subword tokenizers (standard BPE and WordPiece) relied on language-dependent pre-tokenizers (e.g., Python `str.split()` or Moses tokenizer) that assumed whitespace separated words, breaking down on unsegmented Asian languages (Japanese, Chinese, Thai).",
        problem: "Language-specific preprocessing pipelines were non-deterministic, lossy (destroying original whitespace and casing), and required external Perl/Python dependency scripts, preventing end-to-end, language-agnostic neural network training.",
        shift: "SentencePiece treats the entire input sentence as a raw byte or character sequence without language-specific pre-tokenizers, encoding spaces as an explicit meta-symbol (e.g., `_` U+2581), ensuring completely reversible, lossless detokenization (`Decode(Encode(text)) == text`) with native C++ speed across all human languages."
      },
      num: {
        t: "SentencePiece vs Traditional Tokenization Systems",
        h: ["Feature / Metric", "SentencePiece (Unigram/BPE)", "Standard HuggingFace BPE", "BERT WordPiece", "Moses + FastBPE"],
        r: [
          ["Whitespace Preservation", "Lossless (uses _ U+2581)", "Lossy / Normalized", "Lossy (strips spacing)", "Lossy (escapes entities)"],
          ["Language Agnostic", "Universal (bytes/chars)", "Whitespace dependent", "Whitespace dependent", "Requires language rule packs"],
          ["Subword Regularization", "Supported (sampling/dropout)", "BPE-Dropout only", "None", "None"],
          ["Runtime Implementation", "C++ core (zero dependencies)", "Rust / Python bindings", "Python / C++", "Perl + C++ binaries"],
          ["Byte Fallback Option", "Yes (raw bytes for OOV)", "Yes (Byte-level BPE)", "No ([UNK] fallback)", "No ([UNK] fallback)"]
        ],
        n: "SentencePiece implements both BPE and the Unigram language model. In Unigram mode, it optimizes $\\mathcal{L} = \\sum_{i=1}^N \\log \\left( \\sum_{x \\in S(X_i)} P(x) \\right)$ using the Viterbi algorithm. Subword regularization samples segmentations from $P(x)$ during training, boosting model robustness to typos."
      },
      miss: [
        {
          w: "SentencePiece is a new tokenization algorithm distinct from BPE and Unigram.",
          r: "SentencePiece is a tokenization library and framework that implements both Byte-Pair Encoding (BPE) and Unigram models with language-agnostic whitespace encoding."
        },
        {
          w: "SentencePiece requires text to be cleaned and tokenized with Moses or spaCy beforehand.",
          r: "SentencePiece is deliberately designed to run on raw, unprocessed text streams; feeding pre-tokenized text ruins its whitespace preservation and subword segmentation models."
        },
        {
          w: "The underscore character in SentencePiece output is a standard ASCII underscore '_'.",
          r: "It is the Unicode lower one-eighth block meta-symbol `_` (`U+2581`), specifically chosen to prevent collisions with actual ASCII underscores present in code or text."
        },
        {
          w: "SentencePiece cannot handle languages that do not use whitespace.",
          r: "SentencePiece was specifically invented at Google to solve tokenization for non-spaced languages (Japanese, Chinese) by operating directly on character and byte streams."
        }
      ],
      trade: {
        buys: [
          "100% reversible, lossless text reconstruction: `Decode(Encode(text)) == text`.",
          "Language-independent processing: handles code, English, Chinese, Japanese, and emoji uniformly.",
          "Subword regularization creates data augmentation directly during LLM training.",
          "Self-contained C++ library with zero external NLP library dependencies."
        ],
        costs: [
          "Unigram vocabulary training can be memory intensive on massive gigabyte corpus files.",
          "Produces different token IDs if Unicode normalization (NFKC) configurations differ between train and test.",
          "Special characters like `_` (`U+2581`) require specific rendering handling in terminal consoles.",
          "Byte-fallback mode can increase sequence length for rare languages or emojis."
        ],
        avoid: [
          "Avoid preprocessing text with whitespace-splitting regexes before passing to SentencePiece.",
          "Avoid training SentencePiece models without enabling byte fallback for out-of-vocabulary safety.",
          "Avoid mismatching Unicode normalization rules between training and inference phases.",
          "Avoid confusing the Unicode meta-symbol `_` (`U+2581`) with the standard ASCII underscore `_`."
        ]
      }
    },
    {
      slug: "gguf",
      why: {
        before: "Local LLM inference relied on GGML and older file formats that lacked unified metadata headers, scattering tensor descriptions across separate JSON configs or hardcoded model definitions that broke whenever architectures evolved.",
        problem: "GGML files caused breaking compatibility issues between llama.cpp versions, required multi-file distributions (separate tokenizer and hyperparameters), and could not be extended with new quantization types without breaking existing parsers.",
        shift: "GGUF (GPT-Generated Unified Format) introduced a single-file, binary container format with key-value metadata tables, comprehensive model hyperparameter packing, embedded tokenizers, and arbitrary quantized tensor layouts, enabling zero-copy `mmap` loading across CPU and GPU runtimes."
      },
      num: {
        t: "Local LLM Weights Serialization Formats",
        h: ["Format", "Single-File Self-Contained", "Memory Mapping (mmap)", "Quantization Native", "Extensibility"],
        r: [
          ["GGUF (llama.cpp)", "Yes (model + meta + vocab)", "Instant mmap zero-copy", "Yes (k-quants, IQ, 1-8 bit)", "Key-value pair extensible"],
          ["Safetensors (HuggingFace)", "No (separate json config)", "Instant mmap zero-copy", "Partial (requires external scale)", "Strict header dict"],
          ["PyTorch (.bin / .pt)", "No (requires pickle)", "Slow / Deserialization copy", "No (native fp32/fp16)", "Arbitrary Python objects"],
          ["GGML (Deprecated)", "Partial (hardcoded schema)", "Yes mmap", "Yes (legacy quantizations)", "Rigid binary structs"],
          ["AWQ / GPTQ Safetensors", "No (requires config.json)", "Instant mmap zero-copy", "Yes (int4/int8 packed)", "Safetensors metadata"]
        ],
        n: "GGUF structures data sequentially: Magic Number (`0x46554747`), Format Version (v3), Tensor Count, Metadata KV Map, Tensor Info Array, and Memory-Aligned Tensor Binary Payloads. Memory alignment (typically 32-byte boundaries) enables direct SIMD vector and Metal/CUDA GPU buffer execution via `mmap`."
      },
      miss: [
        {
          w: "GGUF is only capable of 4-bit integer quantization.",
          r: "GGUF supports standard FP32, FP16, BF16, legacy quants (Q4_0, Q8_0), modern k-quants (Q4_K_M, Q5_K_S), and ultra-low precision importance-matrix quants (IQ1_S, IQ2_XXS, IQ3_M)."
        },
        {
          w: "GGUF files require a separate tokenizer.json file to run inference.",
          r: "GGUF embeds the entire tokenizer model (vocabulary tokens, scores, token types, merge tables, and special token IDs) directly into the metadata section of the single file."
        },
        {
          w: "Loading a 16GB GGUF file requires allocating 16GB of system RAM on startup.",
          r: "Because GGUF leverages POSIX `mmap`, pages are loaded into memory on-demand from disk or mapped directly into unified virtual address spaces without reading the entire file up front."
        },
        {
          w: "GGUF is tied exclusively to the llama.cpp engine and cannot be used anywhere else.",
          r: "GGUF is widely supported across Ollama, LM Studio, vLLM, text-generation-webui, Jan, and native bindings in Python, Go, Rust, and C#."
        }
      ],
      trade: {
        buys: [
          "Single-file distribution containing all weights, hyperparameters, and tokenizer data.",
          "Near-instant model startup times via zero-copy memory mapping (`mmap`).",
          "Rich, extensible key-value metadata architecture prevents breaking changes across versions.",
          "State-of-the-art quantized tensor formats (k-quants, IQ) optimized for consumer CPUs and Apple Silicon."
        ],
        costs: [
          "Not natively compatible with standard PyTorch training pipelines without conversion scripts.",
          "Quantization conversions from HuggingFace FP16 are CPU/disk intensive.",
          "Frequent updates to quantization kernels can require updating llama.cpp binaries for best performance.",
          "Binary file format cannot be inspected or modified with standard text editors without specialized CLI tools."
        ],
        avoid: [
          "Avoid using legacy GGML format models; convert to GGUF for bug fixes and performance.",
          "Avoid loading GGUF from slow network shares (NFS) if expecting instant `mmap` page fault performance.",
          "Avoid downloading GGUF files without verifying the quantization type against available VRAM/RAM capacity.",
          "Avoid modifying GGUF binary files manually without using the official `gguf-py` manipulation utilities."
        ]
      }
    },
    {
      slug: "supervised-fine-tuning",
      why: {
        before: "Pre-trained foundation LLMs acted purely as statistical document-completion engines; prompting them with a question often resulted in another question, an unrelated continuation, or an endless web forum repetition.",
        problem: "Prompt engineering alone cannot reliably enforce complex output schemas, domain-specific terminology, conversational turn-taking, or task adherence without consuming prohibitive context window tokens.",
        shift: "Supervised Fine-Tuning (SFT) adapts pre-trained base models on curated (instruction, response) prompt pairs using standard cross-entropy loss computed strictly over the response tokens (masking prompt tokens with $-100$), transforming raw text predictors into reliable, instruction-following AI assistants."
      },
      num: {
        t: "LLM Post-Training Pipeline Stages Breakdown",
        h: ["Stage", "Input Data", "Loss Function / Objective", "Active Gradient Targets", "Primary Goal"],
        r: [
          ["Pre-Training", "Trillions of raw text tokens", "Causal LM (Next-Token Cross-Entropy)", "All tokens in document", "World knowledge & language syntax"],
          ["Supervised Fine-Tuning (SFT)", "Curated Prompt-Response pairs", "Cross-Entropy on target tokens only", "Target response tokens (prompt masked)", "Instruction adherence & format styling"],
          ["Reward Modeling (RM)", "Prompt + Pairwise preferences", "Bradley-Terry ranking loss", "Entire response sequence", "Scoring human preference alignment"],
          ["Direct Preference Opt (DPO)", "Prompt + Chosen/Rejected pairs", "Implicit reward margin loss", "Chosen and rejected responses", "Safety & preference alignment without RM"],
          ["RLHF (PPO)", "Prompts + Environment feedback", "Policy Gradient + KL divergence", "Generated response tokens", "Maximizing reward while bounding drift"]
        ],
        n: "In SFT, the objective minimizes cross-entropy loss over response tokens: $\\mathcal{L}_{\\text{SFT}} = -\\sum_{t=1}^{|Y|} \\log P(y_t \\mid X, y_{<t}; \\theta)$. Prompt tokens $X$ are assigned a loss label of $-100$ in PyTorch `CrossEntropyLoss`, ensuring gradients are only computed on the model's generated answer."
      },
      miss: [
        {
          w: "Supervised fine-tuning should compute loss across both the instruction prompt and the response.",
          r: "Computing loss on prompt tokens teaches the model to memorize user questions rather than learn how to generate answers; prompt tokens must be masked with label `-100`."
        },
        {
          w: "SFT is the best way to inject vast amounts of new factual domain knowledge into an LLM.",
          r: "SFT primarily alters the style, persona, and response formatting; attempting to inject large factual databases via SFT leads to hallucinations, whereas RAG is required for verifiable factual retrieval."
        },
        {
          w: "Full-parameter SFT is always superior to Parameter-Efficient Fine-Tuning (PEFT/LoRA).",
          r: "LoRA and QLoRA achieve comparable instruction adherence to full SFT while saving 75% GPU memory, preventing catastrophic forgetting, and allowing dynamic multi-adapter swapping."
        },
        {
          w: "More training data is always better in Supervised Fine-Tuning.",
          r: "LIMA (Less Is More for Alignment) demonstrated that 1,000 meticulously curated, high-quality instruction pairs often outperform 50,000 noisy, low-quality datasets in SFT."
        }
      ],
      trade: {
        buys: [
          "Transforms unpredictable text completers into reliable, conversational instruction-following assistants.",
          "Drastically reduces prompt length by baking recurring persona instructions and schemas directly into weights.",
          "Teaches complex structured output formats (JSON schemas, SQL dialects) with high syntactic compliance.",
          "Serves as the mandatory, foundational prerequisite base for subsequent RLHF and DPO alignment."
        ],
        costs: [
          "Risk of catastrophic forgetting of pre-trained reasoning abilities if dataset lacks diversity.",
          "High human annotation or synthetic data generation costs for high-quality instruction pairs.",
          "Model can overfit to specific phrasing, leading to 'sycophancy' or repetitive generation patterns.",
          "Fine-tuned weights must be managed, versioned, and hosted separately from base foundation models."
        ],
        avoid: [
          "Avoid computing cross-entropy loss over user prompt tokens; strictly mask prompts with label `-100`.",
          "Avoid using massive quantities of low-quality scraped web dialogues; prioritize data quality and diversity.",
          "Avoid relying on SFT alone for dynamic, rapidly changing factual databases without RAG integration.",
          "Avoid high learning rates during SFT (typically use $10^{-5}$ to $2 \\times 10^{-5}$) to prevent weight collapse."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
