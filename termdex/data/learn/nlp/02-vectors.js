/* NLP — Word & sentence embeddings. */
TD.addLessons("nlp", [

    {
        t: "Bag of Words & TF-IDF — The Classical Text Representations That Still Win",
        m: "vectors",
        lvl: "core",
        s: "How to turn text into numbers without a neural network, and why these baselines deserve respect.",
        goal: [
            "Build a bag-of-words representation and understand its strengths and limits",
            "Compute TF-IDF scores and explain why they outperform raw counts",
            "Use scikit-learn's vectorisers to build a classification baseline in minutes"
        ],
        b: [
            { p: "Before embeddings, before attention, before transformers — there was counting. Bag of words counts how often each word appears; TF-IDF weights those counts so distinctive words rise and common words vanish. These two representations powered search and classification for decades, and they remain the baseline every neural model must beat." },

            { h: "Bag of Words: Shaking the Sentence in a Jar" },
            { p: "`Dog bites man` and `man bites dog` produce the same vector. Word order is gone entirely. Despite this, for tasks where **vocabulary** distinguishes classes — spam vs not-spam, sport vs politics — word counts alone get remarkably far." },

            { h: "TF-IDF: The Word That Makes This Document Special" },
            { p: "Term Frequency (how often it appears here) times Inverse Document Frequency (how rare it is across documents). `the` appears everywhere → IDF collapses → score near zero. `indemnity` appears in nine legal documents → IDF is high → the word stands out." },

            {
                code: {
                    lang: "python", t: "From raw text to a TF-IDF classification baseline",
                    lines: [
                        { c: "from sklearn.feature_extraction.text import TfidfVectorizer", w: "" },
                        { c: "from sklearn.linear_model import LogisticRegression", w: "" },
                        { c: "from sklearn.pipeline import make_pipeline", w: "" },
                        { c: "", w: "" },
                        { c: "# Sample documents and labels", w: "" },
                        { c: "docs = ['great movie, loved it', 'terrible film, waste of time',", w: "" },
                        { c: "        'amazing acting and plot', 'boring and predictable']", w: "" },
                        { c: "labels = [1, 0, 1, 0]  # 1=positive, 0=negative", w: "" },
                        { c: "", w: "" },
                        { c: "# Build pipeline: TF-IDF → Logistic Regression", w: "" },
                        { c: "pipe = make_pipeline(", w: "" },
                        { c: "    TfidfVectorizer(ngram_range=(1, 2), min_df=1),", w: "**Bigrams recover some word order.**", hi: true },
                        { c: "    LogisticRegression()", w: "" },
                        { c: ")", w: "" },
                        { c: "pipe.fit(docs, labels)", w: "" },
                        { c: "", w: "" },
                        { c: "# Predict on new text", w: "" },
                        { c: "print(pipe.predict(['wonderful storyline']))", w: "**[1] — classified as positive.**", hi: true }
                    ]
                }
            },

            { trap: "Adding bigrams and trigrams (ngram_range=(1,3)) recovers local word order but explodes the feature space. Set min_df to prune rare n-grams, or your model memorises the training set." },

            {
                tryit: {
                    t: "Inspect the TF-IDF vocabulary",
                    task: "Fit a `TfidfVectorizer` on the sample docs above, then print the top 5 highest-weighted features for the first document.",
                    hint: "Use `vec.get_feature_names_out()` and `numpy.argsort` on the TF-IDF matrix row.",
                    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.feature_extraction.text import TfidfVectorizer\ndocs = ['great movie, loved it', 'terrible film', 'amazing plot']\nvec = TfidfVectorizer()\nX = vec.fit_transform(docs)\ntop = np.argsort(X[0].toarray()[0])[-5:]\nprint([vec.get_feature_names_out()[i] for i in top])" },
                    w: "Inspecting feature weights is how you debug a TF-IDF classifier — if the top features are noise, fix the preprocessing."
                }
            },

            { vocab: ["Bag of Words", "TF-IDF", "N-gram"] }
        ],
        k: [
            "Bag of words discards order entirely — adequate for topic-level classification, inadequate for anything order-sensitive.",
            "TF-IDF weights words by distinctiveness: frequent here, rare everywhere else. It is still the retrieval baseline to beat.",
            "TF-IDF + logistic regression is a genuinely strong baseline. Always try it before reaching for a transformer."
        ],
        r: ["Bag of Words", "TF-IDF", "N-gram", "Text Classification"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "vec = TfidfVectorizer(ngram_range=(1, 2), min_df=2)", w: "create TF-IDF vectoriser with bigrams" },
                { c: "X = vec.fit_transform(documents)", w: "fit and transform documents to TF-IDF matrix" },
                { c: "pipe = make_pipeline(TfidfVectorizer(), LogisticRegression())", w: "build a TF-IDF classification pipeline" }
            ]
        }
    },

    {
        t: "Word Embeddings — Word2Vec, GloVe & FastText",
        m: "vectors",
        lvl: "intermediate",
        s: "How words become vectors that capture meaning, the three methods that defined the era, and their limits.",
        goal: [
            "Explain how Word2Vec, GloVe and FastText each produce word vectors",
            "Understand the analogy arithmetic (king − man + woman ≈ queen) and its limits",
            "Know when static embeddings are still the right tool and when contextual ones are needed"
        ],
        b: [
            { p: "The idea that changed NLP: represent each word as a dense vector in a continuous space, learned from co-occurrence patterns. Similar words land near each other. The famous arithmetic — king − man + woman ≈ queen — falls out naturally, and so do the corpus's biases." },

            { h: "Word2Vec — Local Context Windows" },
            { p: "Two architectures: **CBOW** predicts the centre word from its neighbours, and **Skip-gram** predicts the neighbours from the centre word. Skip-gram works better on small data and rare words. Both learn from sliding a window over the corpus." },

            { h: "GloVe — Global Co-occurrence" },
            { p: "GloVe builds the full word-word co-occurrence matrix across the corpus and factorises it. The result is similar to Word2Vec but uses global statistics directly. Both are static: one vector per word, regardless of context." },

            { h: "FastText — Character N-grams" },
            { p: "FastText represents each word as a sum of its character n-grams: `where` = `<wh` + `whe` + `her` + `ere` + `re>`. This means a misspelled or rare word still gets a vector built from its parts — crucial for morphologically rich languages." },

            {
                tbl: {
                    t: "Static embedding methods compared",
                    h: ["Method", "Training Signal", "OOV Handling", "Context-Aware?", "Best For"],
                    rows: [
                        ["**Word2Vec**", "Local window (5-10 words)", "No vector at all", "No", "General word similarity"],
                        ["**GloVe**", "Global co-occurrence matrix", "No vector at all", "No", "Analogy tasks, comparable to W2V"],
                        ["**FastText**", "Local window + char n-grams", "Sum of subword vectors", "No", "Morphology, typos, rare words"],
                        ["**BERT (contextual)**", "Masked language model", "Subword tokens", "Yes", "Polysemy, downstream tasks"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Loading and using pretrained word vectors",
                    lines: [
                        { c: "import gensim.downloader as api", w: "" },
                        { c: "", w: "" },
                        { c: "# Load pretrained GloVe vectors (400K words, 100d)", w: "" },
                        { c: "wv = api.load('glove-wiki-gigaword-100')", w: "**Downloads ~128MB on first run.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Find similar words", w: "" },
                        { c: "print(wv.most_similar('python', topn=5))", w: "Returns nearby words by cosine similarity." },
                        { c: "", w: "" },
                        { c: "# The famous analogy", w: "" },
                        { c: "result = wv.most_similar(positive=['king', 'woman'],", w: "" },
                        { c: "                         negative=['man'], topn=1)", w: "" },
                        { c: "print(result)", w: "**[('queen', 0.77)]**", hi: true },
                        { c: "", w: "" },
                        { c: "# Bias check — embeddings encode societal biases", w: "" },
                        { c: "print(wv.most_similar(positive=['doctor', 'woman'],", w: "" },
                        { c: "                      negative=['man'], topn=3))", w: "Results reveal gender bias in the training data." }
                    ]
                }
            },

            { trap: "Static embeddings give one vector per word type. `bank` (financial) and `bank` (river) get the same vector. If your task requires distinguishing word senses, you need contextual embeddings from BERT or similar models." },

            { vocab: ["Word2Vec", "GloVe", "FastText", "Cosine Similarity"] }
        ],
        k: [
            "Word2Vec, GloVe and FastText produce static embeddings — one vector per word type, regardless of context.",
            "FastText handles OOV words via character n-grams; Word2Vec and GloVe produce nothing for unseen words.",
            "Static embeddings encode the biases present in their training corpus — analogy arithmetic reveals them."
        ],
        r: ["Embedding", "GloVe", "FastText", "Word2Vec", "BERT"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "wv = api.load('glove-wiki-gigaword-100')", w: "load pretrained GloVe word vectors" },
                { c: "wv.most_similar('python', topn=5)", w: "find the 5 most similar words" },
                { c: "wv.most_similar(positive=['king','woman'], negative=['man'])", w: "word analogy arithmetic" }
            ]
        }
    },

    {
        t: "Sentence Embeddings & Semantic Search — One Vector for the Whole Meaning",
        m: "vectors",
        lvl: "intermediate",
        s: "How sentence-level embeddings power semantic search, and why averaging word vectors is not enough.",
        goal: [
            "Understand why sentence embeddings require contrastive training, not word vector averaging",
            "Build a semantic search system with sentence-transformers and cosine similarity",
            "Know when to add a cross-encoder reranker for precision"
        ],
        b: [
            { p: "Averaging Word2Vec vectors to represent a sentence is cheap and roughly meaningless. `How do I reset my password` and `I forgot my login details` share almost no words and should land in the same place. Sentence encoders are trained specifically to make semantic similarity meaningful." },

            { h: "Contrastive Learning: What Makes Similarity Work" },
            { p: "Sentence-BERT and its successors are trained on pairs: `(query, relevant passage)` pulled together, `(query, unrelated passage)` pushed apart. After training, cosine similarity between vectors genuinely reflects semantic similarity — which is why retrieval works." },

            {
                code: {
                    lang: "python", t: "Semantic search with sentence-transformers",
                    lines: [
                        { c: "from sentence_transformers import SentenceTransformer, util", w: "" },
                        { c: "", w: "" },
                        { c: "model = SentenceTransformer('all-MiniLM-L6-v2')", w: "**384-dimensional embeddings, fast inference.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Corpus of documents", w: "" },
                        { c: "corpus = [", w: "" },
                        { c: "    'How to reset your account password',", w: "" },
                        { c: "    'Shipping policy for international orders',", w: "" },
                        { c: "    'Steps to recover a forgotten login',", w: "" },
                        { c: "    'Return and refund procedures',", w: "" },
                        { c: "]", w: "" },
                        { c: "", w: "" },
                        { c: "# Embed corpus once (offline)", w: "" },
                        { c: "corpus_emb = model.encode(corpus, convert_to_tensor=True)", w: "" },
                        { c: "", w: "" },
                        { c: "# Embed query and search", w: "" },
                        { c: "query = 'I cannot log in to my account'", w: "" },
                        { c: "query_emb = model.encode(query, convert_to_tensor=True)", w: "" },
                        { c: "scores = util.cos_sim(query_emb, corpus_emb)[0]", w: "" },
                        { c: "top = scores.argsort(descending=True)", w: "" },
                        { c: "for i in top[:2]:", w: "" },
                        { c: "    print(f'{scores[i]:.3f}  {corpus[i]}')", w: "**Top results are semantically relevant, despite no word overlap.**", hi: true }
                    ]
                }
            },

            { h: "Bi-Encoder vs Cross-Encoder" },
            { p: "The bi-encoder (above) encodes query and document independently — fast, scalable, but limited. A **cross-encoder** takes the pair together and produces a single relevance score. It is far more accurate but cannot pre-compute embeddings, so it is used as a **reranker** on the top-k results from the bi-encoder." },

            {
                tbl: {
                    t: "Bi-encoder vs cross-encoder trade-offs",
                    h: ["Property", "Bi-Encoder", "Cross-Encoder"],
                    rows: [
                        ["**Speed at scale**", "Fast — precompute corpus", "Slow — must score each pair"],
                        ["**Accuracy**", "Good", "Better — sees both texts together"],
                        ["**Use case**", "Retrieval (top-k from millions)", "Reranking (rescore top-k)"],
                        ["**Typical pipeline**", "First stage", "Second stage on top-20 results"]
                    ]
                }
            },

            { trap: "Query and corpus must be embedded with the same model. Mixing models produces vectors in incompatible spaces — cosine similarity between them is meaningless noise." },

            { vocab: ["Sentence Embedding", "Contrastive Learning", "Cosine Similarity", "Reranking", "Semantic Search"] }
        ],
        k: [
            "Sentence embeddings are trained contrastively so that cosine similarity reflects semantic similarity — unlike averaged word vectors.",
            "Bi-encoders are fast and scalable for retrieval; cross-encoders are accurate and used for reranking the top-k.",
            "Always use the same model for query and corpus embeddings — mixed models produce incompatible vector spaces."
        ],
        r: ["Sentence Embedding", "Semantic Search", "Embedding", "Retrieval-Augmented Generation", "Contrastive Learning"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "model = SentenceTransformer('all-MiniLM-L6-v2')", w: "load a sentence embedding model" },
                { c: "emb = model.encode(texts, convert_to_tensor=True)", w: "embed a list of texts" },
                { c: "scores = util.cos_sim(query_emb, corpus_emb)", w: "compute cosine similarity for retrieval" }
            ]
        }
    }

]);
