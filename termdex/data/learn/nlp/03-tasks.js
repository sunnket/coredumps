/* NLP — Core NLP tasks. */
TD.addLessons("nlp", [

    {
        t: "Text Classification — The Most Common NLP Task in Production",
        m: "tasks",
        lvl: "core",
        s: "Building a text classifier from baseline to fine-tuned transformer, with honest evaluation.",
        goal: [
            "Build a TF-IDF + logistic regression baseline and a fine-tuned transformer classifier",
            "Evaluate with precision, recall, F1 and the confusion matrix rather than accuracy alone",
            "Know when a simple baseline is good enough and when to reach for a transformer"
        ],
        b: [
            { p: "Spam detection, support ticket routing, content moderation, intent detection, document type identification — text classification is everywhere. The pipeline is always the same: represent the text, train a classifier, tune the threshold to match the cost of each error type." },

            { h: "The Practical Ladder" },
            { p: "**Step 1:** TF-IDF + logistic regression — fast, interpretable, and often within a few points of a transformer. **Step 2:** Fine-tune a small BERT model — better accuracy, higher cost. **Step 3:** Zero-shot LLM classification — ideal when labelled data does not exist yet, but far more expensive per item." },

            {
                code: {
                    lang: "python", t: "End-to-end text classification with evaluation",
                    lines: [
                        { c: "from sklearn.feature_extraction.text import TfidfVectorizer", w: "" },
                        { c: "from sklearn.linear_model import LogisticRegression", w: "" },
                        { c: "from sklearn.model_selection import train_test_split", w: "" },
                        { c: "from sklearn.metrics import classification_report", w: "" },
                        { c: "", w: "" },
                        { c: "# Split data", w: "" },
                        { c: "X_train, X_test, y_train, y_test = train_test_split(", w: "" },
                        { c: "    texts, labels, test_size=0.2, stratify=labels, random_state=42)", w: "**Stratify preserves class balance.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Baseline pipeline", w: "" },
                        { c: "vec = TfidfVectorizer(ngram_range=(1, 2), max_features=50000)", w: "" },
                        { c: "X_tr = vec.fit_transform(X_train)", w: "" },
                        { c: "X_te = vec.transform(X_test)", w: "**transform, not fit_transform — no data leakage.**", hi: true },
                        { c: "", w: "" },
                        { c: "clf = LogisticRegression(max_iter=1000)", w: "" },
                        { c: "clf.fit(X_tr, y_train)", w: "" },
                        { c: "preds = clf.predict(X_te)", w: "" },
                        { c: "", w: "" },
                        { c: "# Honest evaluation", w: "" },
                        { c: "print(classification_report(y_test, preds))", w: "**Precision, recall, F1 per class — not just accuracy.**", hi: true }
                    ]
                }
            },

            { trap: "A model with 95% accuracy on a dataset where 95% of examples are one class has learned nothing. The confusion matrix and per-class F1 expose this. Never trust accuracy alone on imbalanced data." },

            {
                tryit: {
                    t: "Diagnose class imbalance",
                    task: "Given a binary classification where Class A has 950 samples and Class B has 50, calculate the accuracy of a model that always predicts Class A. Then explain why this accuracy is meaningless.",
                    hint: "950 / 1000 = ?",
                    sol: { lang: "python", code: "# Accuracy = 950 / 1000 = 95%\n# But the model never detects Class B at all.\n# Precision for B = 0, Recall for B = 0, F1 for B = 0.\n# The 95% accuracy is entirely meaningless." },
                    w: "This is the most common evaluation mistake in production classification. Always check the confusion matrix."
                }
            },

            { vocab: ["Text Classification", "Precision", "Recall", "F1 Score", "Confusion Matrix", "Data Leakage"] }
        ],
        k: [
            "TF-IDF + logistic regression is a genuinely strong baseline — try it before any transformer.",
            "Use `transform` (not `fit_transform`) on test data to prevent data leakage from the vectoriser.",
            "Evaluate with per-class precision, recall and F1 — accuracy hides failure on minority classes."
        ],
        r: ["Text Classification", "TF-IDF", "Precision", "Recall", "F1 Score", "BERT"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "X_te = vec.transform(X_test)  # not fit_transform", w: "transform test data without refitting" },
                { c: "print(classification_report(y_test, preds))", w: "print per-class precision, recall, F1" },
                { c: "train_test_split(texts, labels, stratify=labels)", w: "stratified split preserving class balance" }
            ]
        }
    },

    {
        t: "Sentiment Analysis — Beyond Positive, Negative, Neutral",
        m: "tasks",
        lvl: "core",
        s: "Aspect-based sentiment, sarcasm, domain shift and why aggregate trends beat per-message verdicts.",
        goal: [
            "Build a sentiment classifier and understand its systematic failure modes",
            "Apply aspect-based sentiment to avoid averaging opposing opinions",
            "Know when to trust individual predictions versus aggregate trends"
        ],
        b: [
            { p: "A brand tracks ten thousand mentions a day. Sentiment analysis gives a trend line: are people angrier this week than last? It works well in aggregate and badly per message, because sarcasm (`this update is just brilliant`), negation (`not bad at all`), and domain-specific vocabulary break it predictably." },

            { h: "Aspect-Based Sentiment" },
            { p: "`Great camera, terrible battery` should not average to neutral. Aspect-based sentiment separates opinions about different features — and it is what product teams actually need, because a single overall score hides the actionable signal." },

            {
                code: {
                    lang: "python", t: "Quick sentiment analysis with a pretrained model",
                    lines: [
                        { c: "from transformers import pipeline", w: "" },
                        { c: "", w: "" },
                        { c: "sentiment = pipeline('sentiment-analysis',", w: "" },
                        { c: "    model='distilbert-base-uncased-finetuned-sst-2-english')", w: "" },
                        { c: "", w: "" },
                        { c: "# Clear cases work well", w: "" },
                        { c: "print(sentiment('This product is excellent'))", w: "**POSITIVE, 0.99**", hi: true },
                        { c: "", w: "" },
                        { c: "# Sarcasm breaks it", w: "" },
                        { c: "print(sentiment('Oh wonderful, another update that breaks everything'))", w: "**Often misclassified as POSITIVE.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Negation scope is fragile", w: "" },
                        { c: "print(sentiment('Not the worst experience I have ever had'))", w: "Double negation confuses most models." },
                        { c: "", w: "" },
                        { c: "# Domain shift: medical vs product reviews", w: "" },
                        { c: "print(sentiment('The patient reported significant pain'))", w: "A review model sees 'pain' as negative." }
                    ]
                }
            },

            { trap: "A sentiment model trained on movie reviews will classify medical notes as negative because they contain words like `pain`, `chronic`, `failure`. Domain shift is severe — always test on your actual data before trusting any off-the-shelf model." },

            { vocab: ["Sentiment Analysis"] }
        ],
        k: [
            "Sentiment analysis works well for aggregate trends and poorly for individual messages — report accordingly.",
            "Aspect-based sentiment separates opinions about different features instead of averaging them to meaningless neutral.",
            "Sarcasm, negation scope and domain-specific vocabulary are the three systematic failure modes."
        ],
        r: ["Sentiment Analysis", "Text Classification", "Natural Language Processing"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "sentiment = pipeline('sentiment-analysis')", w: "load a pretrained sentiment pipeline" },
                { c: "result = sentiment('This product is excellent')", w: "classify sentiment of a text" },
                { c: "# Always test on your domain data — off-the-shelf models drift", w: "domain shift awareness" }
            ]
        }
    },

    {
        t: "Named Entity Recognition — Extracting the Names, Dates and Amounts",
        m: "tasks",
        lvl: "core",
        s: "NER with BIO tagging, spaCy in practice, domain adaptation, and evaluation with entity-level F1.",
        goal: [
            "Run NER with spaCy and extract entity spans with labels and character offsets",
            "Understand BIO tagging and how token-level tags become entity spans",
            "Know when to fine-tune versus when off-the-shelf NER is sufficient"
        ],
        b: [
            { p: "Feed ten thousand invoices into NER and it pulls out supplier, date and amount — without writing a regex per template. It fails predictably: a model trained on news will not know your product names, and `Apple` in a fruit-supply contract is not an organisation." },

            { h: "BIO Tagging: How Tokens Become Entities" },
            { p: "Each token gets a label: **B-PER** (beginning of a person name), **I-PER** (inside it), **O** (outside any entity). `New York City` becomes `B-LOC I-LOC I-LOC`. The model predicts token-level tags; post-processing merges consecutive tags into spans." },

            {
                code: {
                    lang: "python", t: "Named entity recognition with spaCy",
                    lines: [
                        { c: "import spacy", w: "" },
                        { c: "", w: "" },
                        { c: "nlp = spacy.load('en_core_web_sm')", w: "" },
                        { c: "doc = nlp('Ada Lovelace joined Anthropic in London on 3 March 2025.')", w: "" },
                        { c: "", w: "" },
                        { c: "for ent in doc.ents:", w: "" },
                        { c: "    print(f'{ent.text:20s} {ent.label_:8s} [{ent.start_char}:{ent.end_char}]')", w: "" },
                        { c: "# Ada Lovelace         PERSON   [0:13]", w: "" },
                        { c: "# Anthropic            ORG      [21:30]", w: "" },
                        { c: "# London               GPE      [34:40]", w: "" },
                        { c: "# 3 March 2025         DATE     [44:56]", w: "**Character offsets let you highlight the source.**", hi: true }
                    ]
                }
            },

            { h: "When Off-the-Shelf Fails" },
            { p: "General NER models know people, orgs, locations and dates. They do not know your product names, internal project codes, or medical terms. Domain-specific entities require fine-tuning on a few hundred labelled examples — and the labelling guidelines must define edge cases precisely." },

            {
                tbl: {
                    t: "NER evaluation: token-level vs entity-level",
                    h: ["Metric Level", "What It Measures", "When It Misleads"],
                    rows: [
                        ["**Token-level F1**", "Correct tag per token", "Partial matches score well (getting 2/3 tokens right in `New York City`)"],
                        ["**Entity-level F1** (strict)", "Exact span and label match", "The honest metric — misses partial credit but reflects real extraction quality"],
                        ["**Entity-level F1** (partial)", "Overlapping span, correct label", "Useful during development to see near-misses"]
                    ]
                }
            },

            { trap: "Keep character offsets on every extracted entity. Downstream systems need to point back at the source document — without offsets, no audit trail, no verification, no trust." },

            { vocab: ["NER"] }
        ],
        k: [
            "NER extracts typed entity spans (person, org, date, amount) from unstructured text using BIO token tags.",
            "Off-the-shelf models handle general entities; domain-specific entities require fine-tuning on labelled examples.",
            "Evaluate with entity-level F1 (strict), not token-level — partial span matches hide real extraction failures."
        ],
        r: ["Named Entity Recognition", "Part-of-Speech Tagging", "Information Extraction", "Text Classification"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "doc = nlp('Ada joined Anthropic in London'); doc.ents", w: "run NER on text with spaCy" },
                { c: "[(ent.text, ent.label_, ent.start_char, ent.end_char) for ent in doc.ents]", w: "extract entity text, label and offsets" },
                { c: "# B-PER I-PER O O B-ORG O B-GPE — BIO tag sequence", w: "understand BIO tagging format" }
            ]
        }
    },

    {
        t: "POS Tagging, Dependency Parsing & Coreference — Structural Understanding",
        m: "tasks",
        lvl: "intermediate",
        s: "How NLP models understand grammar, sentence structure and who 'she' refers to.",
        goal: [
            "Use spaCy to extract POS tags and dependency parse trees",
            "Understand how dependency arcs answer 'who did what to whom'",
            "Know why coreference resolution matters for extraction across sentences"
        ],
        b: [
            { p: "Three tasks that give NLP models structural understanding of language. POS tagging labels grammar, dependency parsing draws the syntactic tree, and coreference resolution links pronouns to their referents. Together they let a system understand `She filed the report. It contained errors.` — knowing who `she` is and what `it` refers to." },

            { h: "Part-of-Speech Tagging" },
            { p: "Label each word: noun, verb, adjective, determiner. `book` is a verb in `book a flight` and a noun in `read the book`. Modern taggers hit ~97% accuracy, which sounds excellent until you realise that means roughly one error per paragraph." },

            { h: "Dependency Parsing" },
            { p: "A dependency parse draws directed arcs from each word to its syntactic head. The root is usually the main verb, and the arcs expose subject, object and modifier relationships — exactly what information extraction needs." },

            {
                code: {
                    lang: "python", t: "POS tags and dependency parsing with spaCy",
                    lines: [
                        { c: "import spacy", w: "" },
                        { c: "nlp = spacy.load('en_core_web_sm')", w: "" },
                        { c: "", w: "" },
                        { c: "doc = nlp('The engineer fixed the critical bug yesterday')", w: "" },
                        { c: "", w: "" },
                        { c: "# POS tags", w: "" },
                        { c: "for token in doc:", w: "" },
                        { c: "    print(f'{token.text:12s} {token.pos_:6s} {token.dep_:10s} ← {token.head.text}')", w: "" },
                        { c: "# The          DET    det        ← engineer", w: "" },
                        { c: "# engineer     NOUN   nsubj      ← fixed", w: "**Subject of the verb.**", hi: true },
                        { c: "# fixed        VERB   ROOT       ← fixed", w: "**Root of the parse tree.**", hi: true },
                        { c: "# the          DET    det        ← bug", w: "" },
                        { c: "# critical     ADJ    amod       ← bug", w: "" },
                        { c: "# bug          NOUN   dobj       ← fixed", w: "**Direct object.**", hi: true },
                        { c: "# yesterday    NOUN   npadvmod   ← fixed", w: "" }
                    ]
                }
            },

            { h: "Coreference Resolution" },
            { p: "In `Ada wrote the notes. She filed them yesterday`, resolving `She` → Ada and `them` → the notes is coreference. Without it, information extraction loses most cross-sentence facts. LLMs handle this far better than earlier dedicated systems." },

            { trap: "Dependency parsing degrades on long, complex sentences. Split on punctuation before parsing to improve accuracy. And never assume 97% POS accuracy means your downstream rules are 97% correct — errors compound." },

            { vocab: ["POS Tagging", "Dependency Parsing", "Object", "Coreference Resolution"] }
        ],
        k: [
            "POS tagging labels grammar (noun, verb, adj); dependency parsing draws the syntactic tree showing who did what to whom.",
            "Coreference resolution links pronouns to their referents across sentences — essential for cross-sentence extraction.",
            "These structural tasks feed downstream pipelines; their errors compound into extraction errors."
        ],
        r: ["Part-of-Speech Tagging", "Dependency Parsing", "Coreference Resolution", "Information Extraction"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "[(t.text, t.pos_, t.dep_) for t in doc]", w: "extract POS and dependency labels" },
                { c: "root = [t for t in doc if t.dep_ == 'ROOT'][0]", w: "find the root verb of the sentence" },
                { c: "[t for t in root.children if t.dep_ == 'nsubj']", w: "find the subject of the root verb" }
            ]
        }
    }

]);
