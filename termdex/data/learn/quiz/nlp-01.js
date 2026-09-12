/* NLP — 50+ Hardcore Question Bank (IIT/PhD Level). */

/* ===================================================================
   Module: tok — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("nlp", "tok", [
  {
    "tag": "Byte-Pair Encoding (BPE) Algorithm",
    "lvl": "advanced",
    "q": "In Byte-Pair Encoding (BPE, Sennrich et al.), what is the exact criterion used to iteratively construct the subword vocabulary?",
    "o": [
      "Picks words with lowest TF-IDF",
      "Iteratively identifies and merges the single most frequently co-occurring adjacent pair of characters/byte-tokens in the corpus until the target vocabulary size $V$ is reached",
      "Randomly merges adjacent letters",
      "Splits words on whitespace only"
    ],
    "a": 1,
    "x": "BPE starts with all base characters and iteratively merges the most frequent adjacent symbol pair, creating compact vocabularies that balance frequent full words and rare character subwords."
  },
  {
    "tag": "WordPiece vs BPE Merge Criterion",
    "lvl": "advanced",
    "q": "What is the key algorithmic difference between Byte-Pair Encoding (BPE) and Google's WordPiece tokenization (Schuster & Nakajima)?",
    "o": [
      "WordPiece operates only on vowels",
      "BPE chooses the pair with the highest raw co-occurrence frequency; WordPiece chooses the pair that maximizes the likelihood of the training data under a unigram language model (maximizing $\\frac{P(u, v)}{P(u)P(v)}$)",
      "WordPiece does not use subwords",
      "BPE requires neural network training"
    ],
    "a": 1,
    "x": "While BPE selects pairs based purely on raw count frequencies, WordPiece scores candidate pairs by the increase in training corpus unigram language model likelihood."
  },
  {
    "tag": "UnigramLM Tokenization & Viterbi EM",
    "lvl": "advanced",
    "q": "How does the Unigram Language Model tokenizer (SentencePiece / Kudo, 2018) build its vocabulary compared to bottom-up BPE?",
    "o": [
      "Bottom-up character merging",
      "Starts with a massive over-complete initial vocabulary and iteratively prunes the bottom $p\\%$ of tokens whose removal causes the smallest increase in corpus language model loss using the EM algorithm, finding optimal tokenizations via Viterbi decoding",
      "Alphabetical sorting",
      "Uniform random selection"
    ],
    "a": 1,
    "x": "UnigramLM is top-down: it starts with a large seed vocabulary and uses EM to compute token probabilities, progressively pruning tokens that least impact data likelihood."
  },
  {
    "tag": "Unicode Normalization Forms (NFC vs NFD vs NFKC)",
    "lvl": "advanced",
    "q": "Why is Unicode NFKC (Compatibility Decomposition followed by Canonical Composition) standard in NLP preprocessing pipelines?",
    "o": [
      "NFKC encrypts text",
      "NFKC normalizes visually identical or semantically equivalent glyph variants (e.g. ligature 'ﬁ' $\\rightarrow$ 'fi', exponent '$2^5$' $\\rightarrow$ '25', full-width characters) into standardized canonical representations, preventing vocabulary explosion",
      "NFKC removes all punctuation",
      "NFKC converts text to UTF-32"
    ],
    "a": 1,
    "x": "Compatibility normalization collapses font variations, ligatures, circled letters, and math glyphs into standard ASCII/Unicode equivalents, unifying synonymous tokens."
  },
  {
    "tag": "Subword Regularization Sampling",
    "lvl": "advanced",
    "q": "In Subword Regularization (Kudo, 2018), how does sampling multiple subword segmentations during training improve model robustness?",
    "o": [
      "Translates text to multiple languages",
      "Samples multiple distinct valid subword segmentations for the same word according to their UnigramLM probabilities ($P(x) = \\prod p(x_i)$), acting as a data augmentation that makes the model robust to segmentation noise and typos",
      "Doubles embedding dimension",
      "Prunes rare words"
    ],
    "a": 1,
    "x": "Subword regularization trains models on multiple sampled segmentations of the same input string, preventing the network from overfitting to deterministic BPE boundaries."
  },
  {
    "tag": "Lemmatization vs Stemming Morphological Precision",
    "lvl": "advanced",
    "q": "Why does WordNet Lemmatization outperform Porter/Snowball Stemming in downstream NLP tasks?",
    "o": [
      "Stemming is non-deterministic",
      "Stemming applies crude heuristic string chopping rules that frequently produce non-words (e.g. 'universe' $\\rightarrow$ 'univers'); Lemmatization utilizes full morphological vocabulary analysis and Part-of-Speech context to map inflected forms to their true grammatical lemma ('better' $\\rightarrow$ 'good')",
      "Lemmatization runs in $O(1)$ time",
      "Stemming only works on English"
    ],
    "a": 1,
    "x": "Stemmers use rule-based substring stripping without grammar awareness. Lemmatizers perform dictionary lookups and POS-aware morphological parsing."
  },
  {
    "tag": "Morphological Inflection in Agglutinative Languages",
    "lvl": "advanced",
    "q": "Why do standard word-level tokenizers fail drastically on agglutinative languages (e.g. Turkish, Finnish, Hungarian, Korean)?",
    "o": [
      "These languages have no alphabet",
      "In agglutinative languages, multiple morphological suffixes and grammatical markers are chained onto a single root word (e.g. Turkish 'evlerinizden' = 'from your houses'), causing combinatorial vocabulary explosion and extreme sparsity without subword morphological segmentation",
      "These languages use 64-bit characters",
      "Agglutinative words have zero vowels"
    ],
    "a": 1,
    "x": "Chaining morphemes creates millions of distinct word variations from a single stem. Subword tokenization (BPE/Unigram) decomposes words into constituent grammatical morphemes."
  }
]);

/* ===================================================================
   Module: embed — (10 Hardcore Questions)
   =================================================================== */

TD.addMCQ("nlp", "embed", [
  {
    "tag": "Word2Vec SGNS Objective Loss Derivation",
    "lvl": "advanced",
    "q": "What is the exact mathematical objective of Word2Vec Skip-Gram with Negative Sampling (SGNS, Mikolov et al.) for center word $w_t$ and context word $w_c$ with $k$ negative samples?",
    "o": [
      "$\\mathcal{L} = \\|v_t - v_c\\|_2^2$",
      "$\\mathcal{L}_{\\text{SGNS}} = \\log \\sigma(v_c'^T v_t) + \\sum_{i=1}^k \\mathbb{E}_{w_i \\sim P_n(w)} \\left[ \\log \\sigma(-v_{w_i}'^T v_t) \\right]$",
      "$\\mathcal{L} = -\\log \\text{softmax}(v_c'^T v_t)$",
      "$\\mathcal{L} = v_c^T v_t$"
    ],
    "a": 1,
    "x": "SGNS frames word embedding as binary logistic regression: maximizing the log-sigmoid probability that $(w_t, w_c)$ came from real text while minimizing the probability for $k$ unigram-drawn negative words."
  },
  {
    "tag": "Word2Vec Negative Sampling Distribution 3/4 Power",
    "lvl": "advanced",
    "q": "Why does Word2Vec sample negative words from the unigram distribution raised to the $3/4$ power $P_n(w) = \\frac{U(w)^{3/4}}{\\sum U(w')^{3/4}}$ rather than the raw unigram distribution $U(w)$?",
    "o": [
      "$3/4$ is the speed of light in silicon",
      "Raising frequencies to $0.75$ diminishes the overwhelming dominance of ultra-frequent stop words ('the', 'of') while boosting the sampling probability of rare words relative to their raw frequency",
      "To normalize probabilities to 1.0",
      "Because $3/4$ is an integer in C"
    ],
    "a": 1,
    "x": "For very rare words (e.g. $p=10^{-6}$), $(10^{-6})^{0.75} = 10^{-4.5} \\approx 3.16 \\times 10^{-5}$, giving rare words an order of magnitude higher chance of being selected as negatives."
  },
  {
    "tag": "GloVe Log-Bilinear Matrix Factorization",
    "lvl": "advanced",
    "q": "What fundamental relationship does GloVe (Pennington et al., 2014) fit between word vectors $w_i, w_j$ and global co-occurrence counts $X_{i,j}$?",
    "o": [
      "$w_i^T w_j = X_{i,j}$",
      "$w_i^T \\tilde{w}_j + b_i + \\tilde{b}_j = \\log X_{i,j}$ weighted by non-decreasing clipping function $f(X_{i,j}) = \\min(1, (X_{i,j}/x_{\\max})^\\alpha)$",
      "$w_i + w_j = \\log X_{i,j}$",
      "$w_i^T w_j = \\text{sigmoid}(X_{i,j})$"
    ],
    "a": 1,
    "x": "GloVe proves that word vector dot products should equal the logarithm of co-occurrence probabilities, minimizing weighted least squares on the global co-occurrence matrix."
  },
  {
    "tag": "FastText Character N-Gram Subwords",
    "lvl": "advanced",
    "q": "How does FastText (Bojanowski et al., Facebook 2017) generate high-quality vector representations for Out-Of-Vocabulary (OOV) and misspelled words?",
    "o": [
      "Uses character RNNs",
      "Represents each word as the sum of its constituent character $n$-gram embeddings (e.g. for 'where' with $n=3$: `<wh`, `whe`, `her`, `ere`, `re>`) plus the whole word vector, allowing unseen words to aggregate vectors from shared subwords",
      "Assigns random vectors to OOV words",
      "Translates OOV words to synonyms"
    ],
    "a": 1,
    "x": "By embedding character $n$-grams ($n \\in [3, 6]$), FastText builds words from morphological sub-elements, enabling meaningful representations for unseen compound or misspelled words."
  },
  {
    "tag": "Sentence-BERT (SBERT) Pooling Strategies",
    "lvl": "advanced",
    "q": "In Sentence-BERT (Reimers & Gurevych, 2019), why is Mean Pooling across all token output vectors vastly superior to using the `[CLS]` token embedding for semantic sentence similarity?",
    "o": [
      "Mean pooling runs in $O(1)$ time",
      "The `[CLS]` token in standard BERT is trained solely on Next Sentence Prediction (NSP) and yields poor, un-calibrated sentence representations; Mean Pooling computes the average of all contextual token embeddings, capturing distributed semantics",
      "CLS token is always 0",
      "Mean pooling eliminates attention"
    ],
    "a": 1,
    "x": "Directly using `[CLS]` embeddings yields worse semantic similarity than simple GloVe averaging. Mean Pooling aggregates contextual vectors across the full sentence, achieving state-of-the-art STS scores."
  },
  {
    "tag": "SimCSE Dropout Data Augmentation",
    "lvl": "advanced",
    "q": "How does SimCSE (Gao et al., 2021) perform unsupervised sentence embedding contrastive learning without generating synthetic paraphrases?",
    "o": [
      "Translates sentences to French and back",
      "Feeds the **exact same sentence** twice into the transformer with standard Dropout active; the two forward passes produce slightly different embedding vectors due to independent dropout masks, serving as a minimal, semantic-preserving positive pair",
      "Reverses word order",
      "Deletes adjectives randomly"
    ],
    "a": 1,
    "x": "SimCSE uses independent standard dropout masks within the network as minimal data augmentation, creating positive pairs $(h_i, h_i^+)$ from identical input text."
  },
  {
    "tag": "PPMI (Positive Pointwise Mutual Information)",
    "lvl": "advanced",
    "q": "What is the formula for Pointwise Mutual Information (PMI) between words $x$ and $y$, and why is Positive PMI (PPMI) used in distributional semantics?",
    "o": [
      "$\\text{PMI}(x, y) = P(x, y) - P(x)P(y)$",
      "$\\text{PMI}(x, y) = \\log_2 \\frac{P(x, y)}{P(x)P(y)}$; PPMI sets negative values to 0 ($\\max(0, \\text{PMI})$) because negative PMI scores (words co-occurring less than chance) are statistically unreliable on finite corpora",
      "$\\text{PMI}(x, y) = P(x|y) / P(y|x)$",
      "$\\text{PMI}(x, y) = \\sqrt{P(x)P(y)}$"
    ],
    "a": 1,
    "x": "PMI measures ratio of joint probability to independence. For rare words, sampling noise produces highly negative PMI scores; PPMI truncates negative values to zero."
  },
  {
    "tag": "Normalized Pointwise Mutual Information (NPMI)",
    "lvl": "advanced",
    "q": "What mathematical property makes Normalized PMI $\\text{NPMI}(x, y) = \\frac{\\text{PMI}(x, y)}{-\\ln P(x, y)}$ superior for word collocation discovery?",
    "o": [
      "NPMI is always zero",
      "NPMI scales PMI values into the strict bounded range $[-1, +1]$, where $+1$ represents complete co-occurrence ($P(x,y)=P(x)=P(y)$), $0$ represents independence, and $-1$ represents complete mutual exclusion",
      "NPMI requires no logarithm",
      "NPMI runs in linear time"
    ],
    "a": 1,
    "x": "Standard PMI ranges from $-\\infty$ to $+\\infty$, making threshold selection difficult. NPMI normalizes the metric strictly to $[-1, 1]$."
  },
  {
    "tag": "Latent Semantic Analysis (LSA) SVD Truncation",
    "lvl": "advanced",
    "q": "In Latent Semantic Analysis (LSA / LSI, Deerwester et al.), how does Truncated SVD on term-document matrix $X \\approx U_k \\Sigma_k V_k^T$ solve synonymy and polysemy?",
    "o": [
      "Deletes duplicate words",
      "Projects documents into a low-dimensional $k$-dimensional latent semantic subspace where synonymous words that share similar context documents are mapped to nearby vector coordinates (by Eckart-Young-Mirsky optimal low-rank matrix approximation)",
      "Sorts words alphabetically",
      "Eliminates all stop words"
    ],
    "a": 1,
    "x": "Truncated SVD extracts the top-$k$ principal singular values, capturing latent semantic concepts and mapping words with similar contexts to identical geometric neighborhoods."
  },
  {
    "tag": "TF-IDF Logarithmic Smoothing Dampening",
    "lvl": "advanced",
    "q": "Why is logarithmic term frequency $\\text{TF}(t, d) = 1 + \\ln(f_{t, d})$ standard in information retrieval rather than raw term counts $f_{t, d}$?",
    "o": [
      "Logarithm runs in GPU memory",
      "Raw counts assume a document mentioning a word 100 times is 100x more relevant than a document mentioning it once; logarithmic smoothing dampens diminishing returns ($1 + \\ln(100) \\approx 5.6$), reflecting human relevance judgments",
      "Logarithms prevent negative numbers",
      "Raw counts cannot be multiplied by IDF"
    ],
    "a": 1,
    "x": "Sublinear term frequency scaling ($1 + \\ln \\text{TF}$) reflects diminishing semantic utility: repeating a keyword 100 times does not make a document 100 times more relevant."
  }
]);

/* ===================================================================
   Module: models — (14 Hardcore Questions)
   =================================================================== */

TD.addMCQ("nlp", "models", [
  {
    "tag": "BERT 80/10/10 Masking Rationale",
    "lvl": "advanced",
    "q": "In BERT pre-training Masked Language Modeling (MLM), why are the 15% selected tokens replaced with `[MASK]` 80% of the time, a random word 10% of the time, and kept unchanged 10% of the time?",
    "o": [
      "To balance GPU computation",
      "If `[MASK]` was used 100% of the time, the model would never learn contextual representations for regular words seen during fine-tuning (where `[MASK]` never appears); the 10% random and 10% unchanged tokens force the encoder to maintain high-quality representations for all actual input words",
      "Because 80/10/10 is the Pareto ratio",
      "To prevent overfitting on verbs"
    ],
    "a": 1,
    "x": "The `[MASK]` token never appears during downstream fine-tuning. The 80/10/10 strategy bridges this pretrain-finetune discrepancy by forcing the model to predict tokens even when words are not masked."
  },
  {
    "tag": "RoBERTa Optimization Improvements",
    "lvl": "advanced",
    "q": "What key architectural and training modifications did RoBERTa (Liu et al., 2019) implement over original BERT to dramatically improve performance?",
    "o": [
      "Replaced transformer with CNNs",
      "Removed Next Sentence Prediction (NSP) task, introduced Dynamic Masking (generating different masks across training epochs), trained on 10x larger data with larger mini-batches (8K sequences), and used a Byte-level BPE tokenizer",
      "Added recurrence layers",
      "Reduced hidden dimensions"
    ],
    "a": 1,
    "x": "RoBERTa proved that BERT was severely undertrained. Removing the harmful NSP loss, using dynamic masking, and scaling batch sizes to 8K sequences established massive gains."
  },
  {
    "tag": "DeBERTa Disentangled Attention",
    "lvl": "advanced",
    "q": "How does DeBERTa (He et al., Microsoft 2020) improve attention representations over standard BERT?",
    "o": [
      "Quantizes attention to 8 bits",
      "Represents each token using two separate vectors for **Content** ($c$) and **Relative Position** ($p$), computing attention via 4 disentangled cross-terms: $\\text{Score} = c_i c_j^T + c_i p_{i,j}^T + p_{i,j} c_j^T$ (content-to-content, content-to-position, and position-to-content)",
      "Eliminates relative positions",
      "Runs attention on character level"
    ],
    "a": 1,
    "x": "Standard BERT sums content and position vectors into a single vector. DeBERTa disentangles them into independent matrices, evaluating cross-attention between content and relative position separately."
  },
  {
    "tag": "Linear-Chain CRF Global Normalization",
    "lvl": "advanced",
    "q": "Why does a Linear-Chain Conditional Random Field (CRF) output layer solve the **Label Bias Problem** found in Maximum Entropy Markov Models (MEMMs) for Named Entity Recognition (NER)?",
    "o": [
      "CRFs use decision trees",
      "MEMMs normalize transition probabilities locally at each individual state $\\sum_{y'} P(y'|y) = 1$ (causing states with low entropy transitions to dominate); CRFs compute a **Global Partition Function** $Z(x) = \\sum_{\\mathbf{y}} \\exp(\\text{Score}(x, \\mathbf{y}))$ across the entire sequence via the Forward-Backward algorithm",
      "CRFs run in $O(1)$ time",
      "CRFs eliminate transitions"
    ],
    "a": 1,
    "x": "Local normalization in MEMMs creates label bias where state transitions with few outgoing branches dominate regardless of observation evidence. CRFs normalize globally over the entire tag sequence."
  },
  {
    "tag": "CYK Parsing Algorithm Complexity",
    "lvl": "advanced",
    "q": "What is the time complexity of the Cocke-Younger-Kasami (CYK) dynamic programming algorithm for parsing a sentence of length $n$ with Context-Free Grammar $G$ in Chomsky Normal Form?",
    "o": [
      "$O(n)$",
      "$O(n^3 \\cdot |G|)$",
      "$O(2^n)$",
      "$O(n \\log n)$"
    ],
    "a": 1,
    "x": "CYK builds a 2D triangular chart of constituent non-terminals: for each substring length $l \\in [1, n]$, start position $i$, and split point $k$, it tests binary grammar productions $A \\rightarrow B C$, taking $O(n^3 |G|)$ time."
  },
  {
    "tag": "HMM Viterbi Dynamic Programming Decoding",
    "lvl": "advanced",
    "q": "In a Hidden Markov Model (HMM) for Part-of-Speech tagging, what is the Viterbi recurrence relation $v_t(j)$ for the most likely state sequence ending in state $j$ at time $t$?",
    "o": [
      "$v_t(j) = \\sum_i v_{t-1}(i) a_{i,j}$",
      "$v_t(j) = \\max_{i=1}^N \\left( v_{t-1}(i) \\cdot a_{i,j} \\right) \\cdot b_j(o_t)$ where $a_{i,j}$ is transition probability and $b_j(o_t)$ is emission probability",
      "$v_t(j) = v_{t-1}(j) / b_j(o_t)$",
      "$v_t(j) = \\max(a_{i,j})$"
    ],
    "a": 1,
    "x": "Viterbi maintains the maximum probability path to each state $j$ at timestep $t$ by taking the max over previous state paths multiplied by transition $a_{i,j}$ and current emission $b_j(o_t)$."
  },
  {
    "tag": "HMM Baum-Welch (EM) Training",
    "lvl": "advanced",
    "q": "In unsupervised HMM training, what does the Baum-Welch algorithm calculate in its E-step?",
    "o": [
      "Matrix determinant",
      "Computes forward probabilities $\\alpha_t(i)$ and backward probabilities $\\beta_t(i)$ to estimate the expected state occupancy count $\\gamma_t(i)$ and expected transition count $\\xi_t(i, j)$ given the observation sequence",
      "Viterbi shortest path",
      "Gradient descent step"
    ],
    "a": 1,
    "x": "Baum-Welch is EM for HMMs: the Forward-Backward algorithm calculates state occupancy probabilities $\\gamma_t(i)$ in the E-step, which the M-step uses to re-estimate transition and emission matrices."
  },
  {
    "tag": "Latent Dirichlet Allocation (LDA) Generative Model",
    "lvl": "advanced",
    "q": "In Latent Dirichlet Allocation (LDA, Blei et al., 2003), what distributions govern the document-topic and topic-word generative mixtures?",
    "o": [
      "Gaussian and Uniform",
      "Document-topic mixtures $\\theta_d \\sim \\text{Dirichlet}(\\alpha)$ and topic-word distributions $\\phi_k \\sim \\text{Dirichlet}(\\beta)$, sampled via Dirichlet conjugate priors over multinomial word generations",
      "Poisson and Exponential",
      "Bernoulli and Beta"
    ],
    "a": 1,
    "x": "LDA is a hierarchical Bayesian model where topic proportions per document follow a Dirichlet prior $\\alpha$, and word distributions per topic follow a Dirichlet prior $\\beta$."
  },
  {
    "tag": "Cross-Lingual Pre-training (XLM-R / mBERT)",
    "lvl": "advanced",
    "q": "In Cross-Lingual Language Models (XLM / XLM-RoBERTa), what is the Translation Language Model (TLM) pre-training objective?",
    "o": [
      "Translates text using Google Translate",
      "Concatenates parallel source-target sentence pairs into a single input sequence with shared multilingual BPE, allowing the model to attend across cross-lingual parallel contexts to predict masked tokens in either language",
      "Trains 100 separate mono-lingual encoders",
      "Prunes non-English vocabularies"
    ],
    "a": 1,
    "x": "TLM concatenates bilingual translation pairs (e.g. English + French) into one sequence and applies MLM, forcing attention to leverage cross-lingual representations directly."
  },
  {
    "tag": "Procrustes Alignment for Cross-Lingual Embeddings",
    "lvl": "advanced",
    "q": "How does the Orthogonal Procrustes problem find the optimal alignment matrix $W^*$ between source word embeddings $X$ and target word embeddings $Y$ given a seed dictionary?",
    "o": [
      "Uses gradient descent on neural nets",
      "$W^* = U V^T$ where $U \\Sigma V^T = \\text{SVD}(Y^T X)$, computing the exact closed-form orthogonal rotation matrix that minimizes Frobenius norm $\\|X W - Y\\|_F^2$ while preserving vector dot products and distances",
      "Randomly swaps word vectors",
      "Scales dimensions by eigenvalue ratios"
    ],
    "a": 1,
    "x": "The Orthogonal Procrustes problem has an exact analytical solution via SVD on $Y^T X$. The resulting orthogonal matrix $W = U V^T$ aligns languages while strictly preserving isometric vector space geometry."
  },
  {
    "tag": "Transition-Based Dependency Parsing Arc-Eager Transitions",
    "lvl": "advanced",
    "q": "In the Arc-Eager transition-based dependency parser, what four transitions are executed between the Stack and Buffer?",
    "o": [
      "Push, Pop, Swap, Drop",
      "**Shift** (pushes buffer head to stack), **Left-Arc** (creates head $\\leftarrow$ dependent link and pops stack), **Right-Arc** (creates head $\\rightarrow$ dependent link and pushes to stack), and **Reduce** (pops stack if token already has a head)",
      "Insert, Delete, Update, Select",
      "Left, Right, Up, Down"
    ],
    "a": 1,
    "x": "Arc-Eager parses sentences incrementally in $O(n)$ linear time by creating right-arcs eagerly before dependent tokens have found all their children."
  },
  {
    "tag": "NER BIO vs BIOES Tagging Schemes",
    "lvl": "advanced",
    "q": "What is the advantage of the BIOES (Begin, Inside, Outside, End, Single) tagging scheme over the standard BIO scheme in Named Entity Recognition?",
    "o": [
      "BIOES uses fewer classes",
      "BIOES explicitly distinguishes between single-token entities ('S-PER') and multi-token entity end boundaries ('E-PER'), eliminating ambiguity in sequence boundary transitions during linear CRF decoding",
      "BIOES runs in $O(1)$ time",
      "BIOES removes vowels"
    ],
    "a": 1,
    "x": "BIOES provides distinct token tags for singleton entities ('S') and terminal tokens ('E'), providing richer edge transition signals to sequential CRFs."
  },
  {
    "tag": "Coreference Resolution Mention-Ranking Scoring",
    "lvl": "advanced",
    "q": "In end-to-end coreference resolution (Lee et al., 2017), how is the pairwise coreference score $s(i, j)$ between span $i$ and antecedent span $j$ computed from span representations $g_i, g_j$?",
    "o": [
      "Levenshtein distance between strings",
      "$s(i, j) = s_m(i) + s_m(j) + s_a(i, j)$ where $s_m$ is unary mention score and $s_a(i, j) = w_a^T [g_i, g_j, g_i \\odot g_j, \\phi(i, j)]$ is the pairwise antecedent ranking feature vector",
      "Euclidean distance on word lengths",
      "Boolean regex match"
    ],
    "a": 1,
    "x": "Coreference models compute span embeddings $g_i$ and combine unary mention detection scores with pairwise bilinear feature products and distance embeddings $\\phi(i, j)$."
  },
  {
    "tag": "Focal Loss in Extreme NLP Class Imbalance",
    "lvl": "advanced",
    "q": "In extreme classification tasks (e.g. patent tagging with 10,000 rare classes), how does Focal Loss $\\mathcal{L}_{\\text{FL}} = -\\alpha (1 - p_t)^\\gamma \\log(p_t)$ with $\\gamma = 2$ prevent model degeneration?",
    "o": [
      "Rounds loss to integers",
      "Applies dynamic modulating factor $(1 - p_t)^\\gamma$, heavily down-weighting the gradient of easy well-classified examples ($p_t > 0.9 \\implies (0.1)^2 = 0.01$) so the optimizer focuses entirely on rare hard negative cases",
      "Sets gradients to zero",
      "Replaces cross-entropy with MSE"
    ],
    "a": 1,
    "x": "Focal loss downweights easy background examples by $(1-p_t)^\\gamma$, preventing millions of easy negative tokens from drowning out minority class gradients."
  }
]);

/* ===================================================================
   Module: eval — (10 Hardcore Questions)
   =================================================================== */

TD.addMCQ("nlp", "eval", [
  {
    "tag": "BM25 Ranking Function Term Saturation",
    "lvl": "advanced",
    "q": "In the Okapi BM25 retrieval ranking formula $\\text{Score}(D, Q) = \\sum \\text{IDF}(q_i) \\frac{f(q_i, D)(k_1 + 1)}{f(q_i, D) + k_1(1 - b + b \\frac{|D|}{\\text{avgdl}})}$, what is the role of parameter $k_1$?",
    "o": [
      "Controls document length normalization",
      "Controls **Term Frequency Saturation**: as term frequency $f(q_i, D)$ increases, the score asymptotically approaches $k_1 + 1$, preventing documents with 100 repetitions of a word from dominating over documents with 5 repetitions",
      "Controls learning rate",
      "Controls stop word removal"
    ],
    "a": 1,
    "x": "In pure TF-IDF, score scales linearly with TF. BM25's $k_1$ parameter imposes an asymptotic upper ceiling (saturation curve) on term frequency contributions."
  },
  {
    "tag": "ROUGE-L Longest Common Subsequence",
    "lvl": "advanced",
    "q": "How is ROUGE-L calculated between a generated summary candidate $C$ and a reference text $R$?",
    "o": [
      "Counts matching 4-grams",
      "Computes the **Longest Common Subsequence (LCS)** between $C$ and $R$, measuring sentence-level structure similarity without requiring consecutive $n$-gram matches while preserving in-sequence word order",
      "Computes Levenshtein edit distance",
      "Counts total character overlaps"
    ],
    "a": 1,
    "x": "ROUGE-L identifies the longest series of words that appear in the same relative left-to-right order in both candidate and reference, naturally capturing sentence fluency."
  },
  {
    "tag": "BERTScore Semantic Token Matching",
    "lvl": "advanced",
    "q": "Why is BERTScore (Zhang et al., ICLR 2020) superior to BLEU and ROUGE for evaluating text generation quality?",
    "o": [
      "BERTScore is faster to compute",
      "BLEU/ROUGE rely strictly on exact surface-level $n$-gram string matching and heavily penalize valid paraphrases or synonyms; BERTScore computes maximal cosine similarities between contextual token embeddings from BERT, measuring true semantic alignment",
      "BERTScore eliminates all false positives",
      "BERTScore is rule-based"
    ],
    "a": 1,
    "x": "Surface $n$-gram metrics fail on valid paraphrases (e.g. 'feline' vs 'cat'). BERTScore computes greedy matching between contextual token vectors using cosine similarity."
  },
  {
    "tag": "Kneser-Ney Smoothing Continuation Probability",
    "lvl": "advanced",
    "q": "In Kneser-Ney language model smoothing, why is lower-order unigram probability replaced by the **Continuation Probability** $P_{\\text{continuation}}(w) = \\frac{|\\{w_{i-1} : C(w_{i-1}, w) > 0\\}|}{\\sum_{w'} |\\{w_{i-1} : C(w_{i-1}, w') > 0\\}|}$?",
    "o": [
      "To count total occurrences of word $w$",
      "To prevent frequent unigrams that appear almost exclusively in fixed idioms (e.g. 'San Francisco') from having high unigram probability when predicting un-idiomatic contexts (e.g. 'glasses of ___')",
      "To eliminate zero probabilities",
      "Because it is linear"
    ],
    "a": 1,
    "x": "Even though 'Francisco' has high unigram count, it almost never appears without 'San'. Continuation probability measures how versatile a word is as a continuation after diverse novel contexts."
  },
  {
    "tag": "Good-Turing Frequency Estimation",
    "lvl": "advanced",
    "q": "In Good-Turing frequency estimation for language modeling, how is the adjusted frequency count $r^*$ computed for an $n$-gram that appeared $r$ times in the corpus?",
    "o": [
      "$r^* = r + 1$",
      "$r^* = (r + 1) \\frac{N_{r+1}}{N_r}$ where $N_r$ is the number of distinct $n$-grams that occurred exactly $r$ times, allocating total probability mass $P_0 = \\frac{N_1}{N}$ to unseen events ($r=0$)",
      "$r^* = r / N$",
      "$r^* = \\log(r)$"
    ],
    "a": 1,
    "x": "Good-Turing uses the frequency of items occurring $r+1$ times ($N_{r+1}$) to re-estimate the expected probability of items occurring $r$ times, providing a principled foundation for smoothing."
  },
  {
    "tag": "METEOR Metric WordNet Alignment Hierarchy",
    "lvl": "advanced",
    "q": "In machine translation evaluation, how does the METEOR metric match unigrams between candidate and reference translations?",
    "o": [
      "Counts identical characters only",
      "Matches unigrams through a sequential 4-tier module hierarchy: **Exact string match** $\\rightarrow$ **Stem match** (Porter stemmer) $\\rightarrow$ **Synonym match** (WordNet synsets) $\\rightarrow$ **Paraphrase table match**, penalized by fragmentation chunk score",
      "Uses BLEU score",
      "Calculates word error rate"
    ],
    "a": 1,
    "x": "METEOR aligns words using exact matches, stemmed matches, and WordNet synonyms, avoiding BLEU's rigid exact-string limitations."
  },
  {
    "tag": "Matthews Correlation Coefficient (MCC) in CoLA",
    "lvl": "advanced",
    "q": "Why is the Matthews Correlation Coefficient (MCC) used to evaluate the Corpus of Linguistic Acceptability (CoLA) benchmark instead of standard Accuracy or F1?",
    "o": [
      "MCC is easier to plot",
      "CoLA has severe class imbalance (e.g. 70% acceptable sentences); MCC generates a balanced metric in $[-1, +1]$ taking into account all four confusion matrix quadrants (TP, TN, FP, FN) proportionally",
      "MCC is for multi-class only",
      "MCC requires probability inputs"
    ],
    "a": 1,
    "x": "Accuracy on imbalanced datasets is misleading (predicting all positive gives 70% accuracy). MCC incorporates all quadrants of the confusion matrix equally."
  },
  {
    "tag": "BLEURT Learned Metric Pre-training",
    "lvl": "advanced",
    "q": "In BLEURT (Sellam et al., ACL 2020), how is the evaluation regression model pre-trained before fine-tuning on human ratings?",
    "o": [
      "Trained on Shakespeare",
      "Pre-trained on millions of synthetically perturbed sentence pairs (masking, dropping, inserting Wikipedia sentences) to predict numerical values of BLEU, ROUGE, and BERTScore simultaneously",
      "Trained on character lengths",
      "Trained on dictionary definitions"
    ],
    "a": 1,
    "x": "BLEURT pretrains a transformer on synthetic sentence perturbations to predict multiple synthetic error metrics, giving it deep inductive priors before fine-tuning on human WMT judgments."
  },
  {
    "tag": "SuperGLUE MultiRC Benchmark",
    "lvl": "advanced",
    "q": "What unique multi-sentence challenge makes MultiRC in the SuperGLUE benchmark difficult for basic extractive QA models?",
    "o": [
      "Texts are written in ancient Greek",
      "Each question is associated with a multi-paragraph text where **multiple answer options can be simultaneously correct**, requiring the model to evaluate each candidate option as an independent binary classification problem across disparate paragraphs",
      "Questions have no correct answers",
      "Passages are 1 word long"
    ],
    "a": 1,
    "x": "MultiRC requires multi-hop reasoning across scattered sentences where answer choices are non-mutually exclusive, preventing single-argmax softmax heuristics."
  },
  {
    "tag": "VADER Rule-Based Sentiment Analysis",
    "lvl": "advanced",
    "q": "How does VADER (Hutto & Gilbert, 2014) compute sentiment intensity without deep neural networks?",
    "o": [
      "Word count only",
      "Combines a validated valence sentiment lexicon with grammatical heuristic rules: punctuation boosters (e.g. '!!!'), capitalization emphasis ('GREAT'), degree adverbs/intensifiers ('extremely good'), and contrastive conjunctions ('but')",
      "Random forest classifier",
      "SVD matrix decomposition"
    ],
    "a": 1,
    "x": "VADER applies 5 rule-based heuristics to adjust base valence dictionary scores for social media text (emojis, ALL-CAPS, punctuation, negation, contrastive conjunctions)."
  }
]);

/* ===================================================================
   Module: seq — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("nlp", "seq", [
  {
    "tag": "Bahdanau Additive vs Luong Multiplicative Attention",
    "lvl": "advanced",
    "q": "What is the mathematical formulation of Bahdanau (Additive) Attention alignment score $e_{i,j}$ compared to Luong (Multiplicative) Attention?",
    "o": [
      "Bahdanau: $s_i^T h_j$; Luong: $s_i + h_j$",
      "Bahdanau: $v_a^T \\tanh(W_a s_{i-1} + U_a h_j)$ (single-hidden-layer feedforward network); Luong: $s_i^T W_a h_j$ (bilinear matrix multiplication)",
      "Both use cosine similarity",
      "Bahdanau is non-differentiable"
    ],
    "a": 1,
    "x": "Bahdanau (1914) introduced additive attention with a tanh MLP layer. Luong (2015) simplified attention to a direct bilinear matrix product $s^T W h$."
  },
  {
    "tag": "Teacher Forcing & Exposure Bias",
    "lvl": "advanced",
    "q": "What is the **Exposure Bias Problem** caused by Teacher Forcing during sequence-to-sequence autoregressive training?",
    "o": [
      "The model trains too slowly",
      "During training, the decoder is fed ground-truth previous tokens $y_{t-1}^*$; during inference, the decoder is fed its own potentially erroneous generated tokens $\\hat{y}_{t-1}$, causing errors to rapidly compound and derail generation",
      "Teacher forcing causes vanishing gradients",
      "Exposure bias disables beam search"
    ],
    "a": 1,
    "x": "Teacher forcing guarantees the model only ever sees perfect ground-truth prefixes in training. At test time, a single mistake places the model in unseen territory, causing error cascade."
  },
  {
    "tag": "Beam Search Length Normalization Penalty",
    "lvl": "advanced",
    "q": "Why is length normalization $\\text{Score}(Y) = \\frac{1}{|Y|^\\alpha} \\sum_{t=1}^{|Y|} \\log P(y_t | y_{<t}, X)$ with $\\alpha \\in [0.6, 0.8]$ required in Beam Search decoding?",
    "o": [
      "To prevent division by zero",
      "Because probabilities are numbers $\\le 1.0$, multiplying more tokens causes longer sequences to have strictly lower joint cumulative log-probabilities, causing un-normalized beam search to systematically favor overly short, truncated sentences",
      "To increase beam search speed",
      "To filter duplicate words"
    ],
    "a": 1,
    "x": "Joint log-probability $\\sum \\log P(y_t)$ monotonically decreases with sequence length. Normalizing by $|Y|^\\alpha$ prevents the beam search from always selecting prematurely short hypotheses."
  },
  {
    "tag": "Minimum Bayes Risk (MBR) Decoding",
    "lvl": "advanced",
    "q": "How does Minimum Bayes Risk (MBR) decoding select the final output from a set of sampled translation candidate hypotheses $\\mathcal{H}$?",
    "o": [
      "Picks the candidate with highest log-probability",
      "Selects the candidate $h^* \\in \\mathcal{H}$ that maximizes expected utility (or minimizes expected risk) under a metric like BLEU/COMET against all other sampled candidate translations: $h^* = \\arg\\max_{h \\in \\mathcal{H}} \\sum_{h' \\in \\mathcal{H}} \\text{Utility}(h, h')$",
      "Selects the shortest candidate",
      "Averages the embeddings"
    ],
    "a": 1,
    "x": "MBR finds the consensus hypothesis that shares the highest average overlap/similarity with the entire sampled distribution, avoiding mode collapse and beam search length pathologies."
  },
  {
    "tag": "Connectionist Temporal Classification (CTC) Loss",
    "lvl": "advanced",
    "q": "How does Connectionist Temporal Classification (CTC, Graves et al.) align speech acoustic frames to text sequences without requiring frame-level phonetic timestamps?",
    "o": [
      "Manually labels all audio frames",
      "Introduces a special **Blank Token** ($\\epsilon$) and marginalizes over all possible valid frame-level alignments that collapse to the target transcription under a duplicate-and-blank removal operator $\\mathcal{B}$ using dynamic programming",
      "Converts audio to spectrogram images",
      "Uses cross-entropy on each frame independently"
    ],
    "a": 1,
    "x": "CTC maps input audio frames of length $T$ to text sequences of length $U \\le T$ by summing probabilities over all possible valid monotonic alignment paths using the Forward-Backward algorithm."
  },
  {
    "tag": "Back-Translation Data Augmentation in NMT",
    "lvl": "advanced",
    "q": "In Neural Machine Translation (Sennrich et al., 2016), how does Back-Translation utilize large monolingual target-language corpora to improve translation quality?",
    "o": [
      "Translates text using a dictionary",
      "Trains an intermediate target-to-source model ($T \\rightarrow S$) to translate target monolingual data into synthetic source sentences, creating synthetic parallel pairs $(S_{\\text{synthetic}}, T_{\\text{real}})$ to train the primary model ($S \\rightarrow T$)",
      "Duplicates training data 10 times",
      "Reverses word order in training sentences"
    ],
    "a": 1,
    "x": "Back-translation creates synthetic source data from real target text. Because the target side contains pristine natural language, the primary model learns strong target language modeling priors."
  },
  {
    "tag": "Cross-Encoder vs Bi-Encoder Reranking Trade-Off",
    "lvl": "advanced",
    "q": "In text search reranking pipelines, what is the architectural trade-off between Bi-Encoders and Cross-Encoders?",
    "o": [
      "Bi-encoders use CNNs; Cross-encoders use RNNs",
      "Bi-Encoders encode query and document independently into vectors for $O(1)$ cosine indexing (fast first-stage retrieval); Cross-Encoders pass `[CLS] Query [SEP] Document` through full bidirectional cross-attention layers, yielding superior accuracy at high computational cost per pair",
      "Cross-encoders cannot handle text",
      "Bi-encoders are deprecated"
    ],
    "a": 1,
    "x": "Bi-encoders allow pre-computed document embeddings for sub-millisecond retrieval. Cross-encoders allow full token-level query-document cross-attention, providing deep relevance modeling as a second-stage reranker."
  },
  {
    "tag": "Scheduled Sampling Curriculum Learning",
    "lvl": "advanced",
    "q": "How does Scheduled Sampling (Bengio et al., 2015) mitigate exposure bias during Seq2Seq RNN training?",
    "o": [
      "Trains model on random noise",
      "Gradually decreases the probability of feeding the true ground-truth token $y_{t-1}^*$ according to a scheduled decay function (linear/exponential), increasingly forcing the model to feed its own sampled prediction $\\hat{y}_{t-1}$ as the next input during training",
      "Doubles the learning rate",
      "Prunes recurrent weights"
    ],
    "a": 1,
    "x": "Scheduled sampling starts with 100% teacher forcing and gradually shifts the input distribution toward model-generated tokens, preparing the model for test-time inference dynamics."
  },
  {
    "tag": "Dynamic Time Warping (DTW) Speech Alignment",
    "lvl": "advanced",
    "q": "In speech audio alignment, how does Dynamic Time Warping (DTW) align two time series $X = (x_1, \\dots, x_N)$ and $Y = (y_1, \\dots, y_M)$ with non-linear speed variations?",
    "o": [
      "Linear interpolation",
      "Constructs an $N \\times M$ cost matrix and uses dynamic programming $D(i, j) = \\text{dist}(x_i, y_j) + \\min(D(i-1, j), D(i, j-1), D(i-1, j-1))$ to find the optimal monotonic warping path that minimizes total alignment distance",
      "Fast Fourier Transform",
      "Cosine similarity on averages"
    ],
    "a": 1,
    "x": "DTW finds the optimal non-linear warping path through a distance grid, aligning audio frames spoken at different cadences."
  }
]);

