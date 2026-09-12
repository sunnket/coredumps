/* NLP — Text preprocessing & representation. */
TD.addLessons("nlp", [

    {
        t: "Tokenisation — Splitting Text into Pieces a Model Can Digest",
        m: "text",
        lvl: "core",
        s: "How raw text is broken into tokens, why the method matters, and how subword tokenisers changed everything.",
        goal: [
            "Understand why models cannot read raw strings and need discrete tokens",
            "Compare word-level, character-level and subword tokenisation strategies",
            "Use Python tokenisers from NLTK, spaCy and Hugging Face in practice"
        ],
        b: [
            { p: "A model does not see text. It sees numbers. Tokenisation is the step that turns a sentence into a sequence of integer IDs, and every decision made here propagates through the entire pipeline. Tokenise badly and no amount of model sophistication recovers the loss." },

            { h: "Three Levels of Tokenisation" },
            { p: "**Word-level** splits on whitespace and punctuation — simple, but any word not in the vocabulary is lost entirely. **Character-level** never loses a character, but sequences become extremely long and the model must learn spelling from scratch. **Subword** (BPE, WordPiece, SentencePiece) is the compromise modern systems use: common words stay whole, rare words split into reusable pieces." },

            {
                tbl: {
                    t: "Tokenisation strategy comparison",
                    h: ["Strategy", "Vocabulary Size", "OOV Handling", "Sequence Length", "Used By"],
                    rows: [
                        ["**Word-level**", "50K–200K", "Unknown token replaces the word", "Short", "Classical NLP, spaCy"],
                        ["**Character-level**", "~100–300", "No OOV possible", "Very long", "Character CNNs, some spelling models"],
                        ["**Subword (BPE)**", "30K–50K", "Splits into known pieces", "Moderate", "GPT, LLaMA, most modern LLMs"],
                        ["**WordPiece**", "30K", "Splits with `##` prefix", "Moderate", "BERT, DistilBERT"],
                        ["**SentencePiece**", "32K–64K", "Language-agnostic splitting", "Moderate", "T5, mBART, multilingual models"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Comparing tokenisers in practice",
                    lines: [
                        { c: "# Word-level tokenisation with NLTK", w: "" },
                        { c: "from nltk.tokenize import word_tokenize", w: "" },
                        { c: "tokens = word_tokenize(\"The cat can't sit on the mat.\")", w: "" },
                        { c: "print(tokens)", w: "**['The', 'cat', 'ca', \"n't\", 'sit', 'on', 'the', 'mat', '.']**", hi: true },
                        { c: "", w: "" },
                        { c: "# Subword tokenisation with Hugging Face", w: "" },
                        { c: "from transformers import AutoTokenizer", w: "" },
                        { c: "tok = AutoTokenizer.from_pretrained('bert-base-uncased')", w: "" },
                        { c: "result = tok.tokenize('unhappiness is unquantifiable')", w: "" },
                        { c: "print(result)", w: "**['un', '##happiness', 'is', 'un', '##quant', '##ifi', '##able']**", hi: true },
                        { c: "", w: "" },
                        { c: "# Token IDs — what the model actually receives", w: "" },
                        { c: "ids = tok.encode('unhappiness is unquantifiable')", w: "" },
                        { c: "print(ids)", w: "Integers the embedding layer indexes into." }
                    ]
                }
            },

            { trap: "Using different tokenisers at training and inference is a silent catastrophe. The model learned meanings for token ID 4217 during training — if your inference tokeniser maps a different string to 4217, every prediction is quietly wrong." },

            { h: "Special Tokens" },
            { p: "Every tokeniser adds tokens the model depends on: `[CLS]` for classification, `[SEP]` to separate segments, `[PAD]` to fill batches to uniform length, and `[MASK]` for masked language modelling. These are not decoration — removing them breaks the model." },

            {
                tryit: {
                    t: "Count the subword tokens",
                    task: "Using the Hugging Face `AutoTokenizer` for `bert-base-uncased`, tokenise the sentence `'Transformers revolutionised NLP'` and print both the tokens and the token count.",
                    hint: "Use `tok.tokenize()` for tokens and `len()` for the count.",
                    sol: { lang: "python", code: "from transformers import AutoTokenizer\ntok = AutoTokenizer.from_pretrained('bert-base-uncased')\ntokens = tok.tokenize('Transformers revolutionised NLP')\nprint(tokens, len(tokens))" },
                    w: "Subword counts are always higher than word counts. This matters because context windows are measured in tokens, not words."
                }
            },

            { vocab: ["Tokenisation", "BPE"] }
        ],
        k: [
            "Tokenisation converts raw text into integer IDs — the only input a model ever sees.",
            "Subword tokenisers (BPE, WordPiece) balance vocabulary size against sequence length and handle rare words gracefully.",
            "The same tokeniser must be used at training and inference — mismatches cause silent, devastating errors."
        ],
        r: ["Natural Language Processing", "Embedding", "BERT", "Large Language Model"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "tok = AutoTokenizer.from_pretrained('bert-base-uncased')", w: "load a pretrained BERT tokeniser" },
                { c: "tokens = tok.tokenize('some input text')", w: "split text into subword tokens" },
                { c: "ids = tok.encode('some input text')", w: "convert text to integer token IDs" }
            ]
        }
    },

    {
        t: "Text Normalisation — Making Text Comparable Before Anything Else Touches It",
        m: "text",
        lvl: "core",
        s: "Unicode normalisation, casing, whitespace and the quiet bugs that live in text encoding.",
        goal: [
            "Apply Unicode NFC/NFKC normalisation to prevent invisible duplicate strings",
            "Make informed decisions about lowercasing, accent stripping and whitespace standardisation",
            "Build a normalisation pipeline that matches training and inference exactly"
        ],
        b: [
            { p: "Before you tokenise, embed or classify, text must be normalised — because `Café`, `Cafe` and `CAFÉ` are three different strings to a computer and one word to a human. The majority of silent NLP bugs are normalisation bugs." },

            { h: "Unicode: The Invisible Problem" },
            { p: "The letter `é` has two Unicode representations: a single codepoint (U+00E9) and a composed pair (e + U+0301 combining accent). They look identical on screen and compare unequal in code. NFC normalisation collapses them to one form." },

            {
                code: {
                    lang: "python", t: "A normalisation pipeline for NLP",
                    lines: [
                        { c: "import unicodedata", w: "" },
                        { c: "import re", w: "" },
                        { c: "", w: "" },
                        { c: "def normalise(text):", w: "" },
                        { c: "    # 1. Unicode normalisation", w: "" },
                        { c: "    text = unicodedata.normalize('NFKC', text)", w: "**Collapses equivalent codepoints.**", hi: true },
                        { c: "", w: "" },
                        { c: "    # 2. Standardise whitespace", w: "" },
                        { c: "    text = re.sub(r'\\s+', ' ', text).strip()", w: "Tabs, non-breaking spaces, newlines → single space." },
                        { c: "", w: "" },
                        { c: "    # 3. Standardise quotes and dashes", w: "" },
                        { c: "    text = text.replace('\\u2018', \"'\").replace('\\u2019', \"'\")", w: "" },
                        { c: "    text = text.replace('\\u201c', '\"').replace('\\u201d', '\"')", w: "**Smart quotes → ASCII quotes.**", hi: true },
                        { c: "    text = text.replace('\\u2014', '-').replace('\\u2013', '-')", w: "" },
                        { c: "", w: "" },
                        { c: "    # 4. Lowercase (only if task does not need case)", w: "" },
                        { c: "    text = text.lower()", w: "Destroys US vs us — skip for NER." },
                        { c: "", w: "" },
                        { c: "    return text", w: "" }
                    ]
                }
            },

            { trap: "Every normalisation step destroys information. Lowercasing merges `US` (country) with `us` (pronoun). Stripping accents merges `résumé` with `resume`. Apply the minimum normalisation your task requires — never more." },

            {
                tryit: {
                    t: "Catch the invisible duplicate",
                    task: "Write Python that demonstrates two strings looking identical but comparing unequal, then fix them with `unicodedata.normalize`.",
                    hint: "Create `'café'` using the single codepoint and the composed form.",
                    sol: { lang: "python", code: "import unicodedata\na = 'caf\\u00e9'       # precomposed\nb = 'cafe\\u0301'      # e + combining accent\nprint(a == b)          # False\nprint(unicodedata.normalize('NFC', a) == unicodedata.normalize('NFC', b))  # True" },
                    w: "This is a real production bug. Two supposedly identical keys in a dictionary silently coexist, and lookups miss one of them."
                }
            },

            { vocab: ["Unicode", "Normalisation", "Encoding"] }
        ],
        k: [
            "Unicode NFC/NFKC normalisation prevents invisible string duplicates that silently break lookups and deduplication.",
            "Every normalisation choice (lowercasing, accent stripping) destroys signal — apply only what the task demands.",
            "The normalisation pipeline must be identical at training and inference, or you introduce systematic skew."
        ],
        r: ["Tokenisation", "Text Normalisation", "Regular Expression"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "text = unicodedata.normalize('NFKC', text)", w: "apply Unicode normalisation" },
                { c: "text = re.sub(r'\\s+', ' ', text).strip()", w: "collapse whitespace to single spaces" },
                { c: "text = text.lower()", w: "lowercase for case-insensitive tasks" }
            ]
        }
    },

    {
        t: "Stemming & Lemmatisation — Reducing Words to Their Roots",
        m: "text",
        lvl: "core",
        s: "When to chop suffixes fast versus when to look words up properly, and why transformers need neither.",
        goal: [
            "Understand the trade-off between stemming speed and lemmatisation accuracy",
            "Apply the Porter stemmer and spaCy lemmatiser in Python",
            "Know when modern pipelines skip both entirely"
        ],
        b: [
            { p: "`running`, `runs`, `ran` and `runner` are variations of one idea. Stemming and lemmatisation both attempt to collapse these forms, but they do it very differently — and the choice matters." },

            { h: "Stemming: Fast and Crude" },
            { p: "The Porter stemmer strips suffixes by rule: `running` → `run`, `studies` → `studi`, `universal` → `univers`. It is fast, needs no dictionary, and produces strings that are often not real words. That is fine for indexing (nobody sees the stems) and terrible for output." },

            { h: "Lemmatisation: Accurate and Slow" },
            { p: "A lemmatiser looks up the word in a dictionary: `better` → `good`, `was` → `be`, `mice` → `mouse`. It needs the word's part of speech — `saw` is `see` as a verb and `saw` as a noun — so it is slower and more complex." },

            {
                code: {
                    lang: "python", t: "Stemming vs lemmatisation side by side",
                    lines: [
                        { c: "from nltk.stem import PorterStemmer", w: "" },
                        { c: "import spacy", w: "" },
                        { c: "", w: "" },
                        { c: "stemmer = PorterStemmer()", w: "" },
                        { c: "words = ['running', 'better', 'studies', 'universal']", w: "" },
                        { c: "print([stemmer.stem(w) for w in words])", w: "**['run', 'better', 'studi', 'univers']**", hi: true },
                        { c: "", w: "" },
                        { c: "nlp = spacy.load('en_core_web_sm')", w: "" },
                        { c: "doc = nlp('She was running better studies')", w: "" },
                        { c: "print([(t.text, t.lemma_) for t in doc])", w: "**[('She','she'), ('was','be'), ('running','run'), ('better','well'), ('studies','study')]**", hi: true }
                    ]
                }
            },

            { trap: "Transformer models with subword tokenisation handle morphology implicitly — they do not need stemming or lemmatisation. Applying either before feeding text to BERT or GPT can actually hurt performance by destroying information the model uses." },

            { vocab: ["Stemming", "Lemmatisation"] }
        ],
        k: [
            "Stemming is fast and rule-based but produces non-words; lemmatisation is slower but produces real dictionary forms.",
            "Lemmatisation needs POS tags to disambiguate — `saw` lemmatises differently as a noun vs a verb.",
            "Modern transformer pipelines skip both — subword tokenisation handles morphology internally."
        ],
        r: ["Stemming", "Lemmatisation", "Part-of-Speech Tagging", "Tokenisation"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "stemmer.stem('running')", w: "apply Porter stemmer to a word" },
                { c: "doc = nlp('She was running'); [(t.text, t.lemma_) for t in doc]", w: "lemmatise with spaCy" },
                { c: "# Transformers: skip both — subword tokenisation handles it", w: "when to skip stemming/lemmatisation" }
            ]
        }
    },

    {
        t: "Stop Words & Regular Expressions — The Two Classical Preprocessing Tools",
        m: "text",
        lvl: "core",
        s: "When stop word removal helps, when it destroys meaning, and when regex is the right tool versus a model.",
        goal: [
            "Make informed decisions about stop word removal based on the downstream model",
            "Write regex patterns for structured extraction tasks in NLP",
            "Know the boundary between regex and model-based extraction"
        ],
        b: [
            { p: "Two classical tools: removing words that carry no meaning (stop words), and matching words by shape (regex). Both are powerful, both have famous failure modes, and both survive in production long after neural models were supposed to kill them." },

            { h: "Stop Words: Think Before Removing" },
            { p: "In TF-IDF and bag-of-words models, dropping `the`, `is`, `at` shrinks the feature space and removes noise. In a transformer, removing them breaks the grammar the model relies on. And in any sentiment task, `not` — which appears on most stop word lists — inverts the meaning." },

            {
                tbl: {
                    t: "Stop word removal: when to and when not to",
                    h: ["Downstream Model", "Remove Stop Words?", "Reason"],
                    rows: [
                        ["**TF-IDF + Logistic Regression**", "Yes", "Common words add dimensions without signal"],
                        ["**Bag of Words**", "Yes", "Same — vocabulary shrinks, discrimination improves"],
                        ["**BERT / Transformer**", "No", "The model needs grammar tokens for contextual understanding"],
                        ["**Sentiment classifier**", "Careful", "`not`, `no`, `never` carry the meaning — check the list"],
                        ["**Keyword search index**", "Usually yes", "But build a custom list per domain"]
                    ]
                }
            },

            { h: "Regex: The Right Tool More Often Than Admitted" },
            { p: "Extracting a postcode, a date in ISO format, a reference number, or a phone number needs a pattern, not a model. Regex is deterministic, instant, testable and explainable. Reach for a model when the target has no rigid shape — names, sentiment, intent." },

            {
                code: {
                    lang: "python", t: "Regex for structured extraction in NLP",
                    lines: [
                        { c: "import re", w: "" },
                        { c: "", w: "" },
                        { c: "# Extract dates in dd/mm/yyyy format", w: "" },
                        { c: "DATE = re.compile(r'\\b(\\d{1,2})[/\\-](\\d{1,2})[/\\-](\\d{4})\\b')", w: "" },
                        { c: "dates = DATE.findall('Invoice dated 15/03/2025, due 15/04/2025')", w: "" },
                        { c: "print(dates)", w: "**[('15', '03', '2025'), ('15', '04', '2025')]**", hi: true },
                        { c: "", w: "" },
                        { c: "# Extract email addresses", w: "" },
                        { c: "EMAIL = re.compile(r'[\\w.+-]+@[\\w-]+\\.[\\w.-]+')", w: "" },
                        { c: "emails = EMAIL.findall('Contact ada@example.com or support@co.uk')", w: "" },
                        { c: "print(emails)", w: "**['ada@example.com', 'support@co.uk']**", hi: true }
                    ]
                }
            },

            { trap: "Catastrophic backtracking: nested quantifiers like `(a+)+b` can cause exponential runtime on crafted input. Always anchor patterns, bound quantifiers, and test against adversarial strings." },

            { vocab: ["Stop Words", "Regular Expression", "Regex", "Backtracking"] }
        ],
        k: [
            "Stop word removal helps classical models (BoW, TF-IDF) and hurts transformers — decide based on your downstream model.",
            "Regex is the right tool for rigidly shaped targets (dates, IDs, codes); use models for soft targets (names, intent).",
            "Always check stop word lists for negation words — `not`, `no`, `never` — before removing them from sentiment tasks."
        ],
        r: ["Stop Words", "Regular Expression", "TF-IDF", "Bag of Words", "Sentiment Analysis"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "from nltk.corpus import stopwords; stops = set(stopwords.words('english'))", w: "load English stop word list" },
                { c: "filtered = [w for w in tokens if w.lower() not in stops]", w: "remove stop words from token list" },
                { c: "matches = re.findall(r'\\b\\d{4}-\\d{2}-\\d{2}\\b', text)", w: "extract ISO dates with regex" }
            ]
        }
    }

]);
