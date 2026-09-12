/* NLP — the practice, at full depth.

   The existing NLP lessons are accurate and short: roughly nine blocks each,
   almost no exercises, and no analogies. They read as a reference someone
   would consult, not a course someone would learn from. That is the gap this
   file closes — not by repeating what those lessons cover, but by teaching
   the things that only appear when you actually build an NLP system:

     - why tokenisation quietly decides your multilingual costs and your
       model's ability to do arithmetic
     - what an embedding space really is, and why cosine similarity
       misleads people about "meaning"
     - the classification pipeline end to end, with the class imbalance and
       threshold decisions that every text classifier meets
     - why NER is harder than it looks and how it is actually evaluated
     - what BLEU and ROUGE do and do not measure, and why the field moved on

   Each lesson is written to the same standard as the strongest tracks in the
   app: an analogy, worked code, the trap that catches people, and an
   exercise with a real solution. */
TD.addLessons("nlp", [

{
 t: "What Tokenisation Costs You",
 m: "text",
 lvl: "intermediate",
 s: "The invisible decision that sets your bill, your context limit, and whether the model can count.",
 goal: [
  "Explain why the same sentence costs different amounts in different languages",
  "Predict which inputs will tokenise badly",
  "Say why tokenisation causes the arithmetic and spelling failures people blame on reasoning"
 ],
 b: [
  { p: "You have met what tokenisation is. This lesson is about what it *costs*, because tokenisation is one of those foundational choices whose consequences show up everywhere and are almost never attributed back to it." },

  { ana: "A tokeniser is a phrasebook compiled by someone who mostly expected English tourists. Common English words each get a single entry. A Hindi sentence has to be spelled out letter by letter from a handful of fragments — same meaning, five times the page count, five times the price.",
    at: "The lopsided phrasebook" },

  { h: "The multilingual tax" },
  { p: "Tokenisers are trained on a corpus, and that corpus is overwhelmingly English. A word that appeared often becomes one token; a word that did not gets chopped into pieces." },
  { tbl: { t: "The same meaning, very different token counts",
    h: ["Language", "Text", "Approx. tokens"],
    rows: [
     ["English", "`The weather is nice today`", "**5**"],
     ["French", "`Il fait beau aujourd'hui`", "**8**"],
     ["Hindi", "`आज मौसम अच्छा है`", "**15–20**"],
     ["Thai", "(no spaces between words)", "**20–30**"],
     ["Code", "`for i in range(10):`", "**8–10**"]
    ] } },
  { p: "The consequences are concrete and they compound:" },
  { ol: [
   "**Cost.** You are billed per token, so the identical product costs three to five times more to serve in Hindi than in English.",
   "**Context window.** A 128k-token window holds perhaps 96,000 English words but only a fraction of that in Thai. Your RAG system retrieves less on the same budget.",
   "**Quality.** More tokens per idea means the meaning is spread thinner, and models generally perform worse on heavily fragmented text.",
   "**Latency.** Generation is per-token, so a reply of the same length takes proportionally longer."
  ] },
  { n: "If you are building for a non-English market, measure your token counts before you cost the product. Teams have shipped pricing models that were profitable in English and loss-making in the language most of their users actually spoke.",
    nt: "Why this is a business fact, not a trivia fact" },

  { h: "Why models cannot count letters" },
  { p: "Ask a model how many *r*s are in **strawberry** and it has historically got it wrong. People conclude the model cannot reason. The real cause is more mundane." },
  { p: "The model never sees `s-t-r-a-w-b-e-r-r-y`. It sees something like `[str][aw][berry]` — three opaque ids. Asking it to count letters is asking it to count something it was never shown. It is not failing at reasoning; it is answering from memory of how such words are usually spelled." },
  { ol: [
   "**Character counting and reversal** — the characters are inside the tokens, invisible.",
   "**Arithmetic** — `1234` may tokenise as `12` + `34`, so digits do not line up in columns the way written arithmetic requires.",
   "**Rhyme and wordplay** — depends on sounds and letters the model sees only indirectly.",
   "**Precise string edits** — *replace the third character* is operating on a representation it does not have."
  ] },
  { p: "The engineering lesson: **do not ask a model to do character-level work.** Use code. `len([c for c in word if c == 'r'])` is exact, instant and free — and knowing *why* to reach for code here is what separates someone who understands the system from someone who keeps rewording the prompt." },

  { h: "What tokenises badly" },
  { tbl: { t: "Watch for these in your inputs",
    h: ["Input", "Why it is expensive"],
    rows: [
     ["Long numbers", "Split into arbitrary digit chunks"],
     ["UUIDs and hashes", "Near-random strings — close to one token per two characters"],
     ["Minified JSON", "Unusual punctuation runs fragment badly"],
     ["Non-Latin scripts", "Under-represented in the training corpus"],
     ["Emoji", "Frequently several tokens each"],
     ["Repeated whitespace", "Often one token per space"]
    ] } },
  { trap: "A common and costly mistake in RAG systems is embedding raw scraped HTML. The tags, attributes and whitespace can be two-thirds of your tokens, you pay for every one of them, and they crowd out the actual content in the context window. Strip to clean text before chunking — it is usually the single largest cost saving available in a naive pipeline." },

  { tryit: { t: "Measure your own token tax",
    task: "Take one sentence, translate it into two other languages, and compare token counts. Then tokenise a UUID and a chunk of HTML and compare tokens to characters.",
    hint: "`tiktoken` works offline for GPT-family tokenisers; `AutoTokenizer` from transformers works for any Hugging Face model.",
    sol: { lang: "python", code: "import tiktoken\nenc = tiktoken.get_encoding('cl100k_base')\n\nsamples = {\n    'english': 'The weather is nice today',\n    'french':  \"Il fait beau aujourd'hui\",\n    'hindi':   'आज मौसम अच्छा है',\n    'uuid':    '550e8400-e29b-41d4-a716-446655440000',\n    'html':    '<div class=\"x\"><p>Hello</p></div>',\n}\n\nfor name, text in samples.items():\n    n = len(enc.encode(text))\n    print(f'{name:8s} {n:3d} tokens  {len(text):3d} chars  '\n          f'{len(text)/n:.1f} chars/token')" },
    w: "English lands near 4 characters per token. The UUID and the Hindi text drop closer to 1–2, which is exactly the multiplier on your bill." } },

  { vocab: ["Tokenisation", "Context Window", "Byte-Pair Encoding"] }
 ],
 k: [
  "Tokenisers are trained mostly on English, so other languages cost 3–5× more tokens for the same meaning.",
  "Token count drives cost, context capacity, latency and quality together.",
  "Models cannot count or manipulate characters because characters are hidden inside tokens — use code instead.",
  "UUIDs, long numbers, raw HTML and emoji tokenise badly; strip HTML before embedding."
 ],
 r: ["Tokenisation", "Context Window", "Byte-Pair Encoding", "WordPiece"]
},

{
 t: "What an Embedding Space Actually Is",
 m: "vectors",
 lvl: "intermediate",
 s: "Similar vectors do not mean similar meaning. Knowing the difference decides whether your search works.",
 goal: [
  "Describe what the dimensions of an embedding actually represent",
  "Explain why cosine similarity finds related-but-wrong results",
  "Choose an embedding model on evidence rather than leaderboard position"
 ],
 b: [
  { p: "An embedding turns text into a list of numbers — typically 384 to 1536 of them — positioned so that similar text lands nearby. Everyone learns that sentence. Very few people learn what *similar* means here, and that gap is the source of most disappointing semantic search." },

  { ana: "Imagine placing every book in a library in a vast hall, so that books about similar things stand near each other. Cookbooks cluster; physics texts cluster elsewhere. Nobody labelled the axes — there is no 'cooking' direction anyone chose. The arrangement emerged from which books get mentioned in similar contexts. That hall is an embedding space, and 'nearby' means 'used in similar contexts', not 'means the same thing'.",
    at: "The library with no labels" },

  { h: "The dimensions mean nothing individually" },
  { p: "People expect dimension 47 to encode *formality* or *sentiment*. It does not. The dimensions are an emergent coordinate system with no individual interpretation — only the geometry as a whole carries meaning. This is why you cannot debug an embedding by reading its numbers, and why interpretability work on embeddings is genuinely difficult." },

  { h: "The failure that matters: opposites are neighbours" },
  { p: "Here is the thing that breaks real systems. Embeddings are trained on *contextual co-occurrence*, and words with opposite meanings appear in nearly identical contexts." },
  { tbl: { t: "High similarity, wrong answer",
    h: ["Pair", "Cosine similarity", "Actually"],
    rows: [
     ["`good` / `great`", "~0.85", "Similar — correct"],
     ["`good` / `bad`", "**~0.75**", "**Opposite** — and still scores high"],
     ["`increase` / `decrease`", "**~0.80**", "**Opposite**"],
     ["`How do I cancel my order?` / `How do I cancel my subscription?`", "**~0.93**", "**Different answers entirely**"]
    ] } },
  { p: "*Good* and *bad* both appear as `the food was ___`, `a ___ experience`, `surprisingly ___`. The contexts are the same, so the vectors are close. The embedding has faithfully learned that these words are used the same way, which is not what you wanted it to learn." },
  { trap: "This is why a semantic search that returns *related* documents is not the same as one that returns *correct* ones, and why a semantic cache with a 0.85 threshold will confidently serve the wrong answer. Negation is the sharpest case: `the patient has diabetes` and `the patient does not have diabetes` embed very closely, which has obvious consequences in clinical or legal retrieval." },

  { h: "What to do about it" },
  { ol: [
   "**Rerank.** Retrieve 50 by embedding, then score each against the query with a cross-encoder that reads both together. This is the single biggest quality improvement available in retrieval, and it exists precisely because embeddings alone are imprecise.",
   "**Go hybrid.** Combine dense retrieval with keyword search (BM25). Keyword search handles exact terms, product codes and names, which embeddings blur; embeddings handle paraphrase, which keywords miss.",
   "**Set thresholds high** and validate them on real queries rather than guessing.",
   "**Handle negation explicitly** where it is safety-relevant — often with a rule or a classifier, not with the embedding."
  ] },

  { h: "Choosing a model without cargo-culting the leaderboard" },
  { p: "The MTEB leaderboard is useful and routinely over-trusted. It averages many tasks on mostly English, mostly clean, mostly general text. Your domain is none of those things." },
  { tbl: { t: "What actually matters when choosing",
    h: ["Factor", "Why"],
    rows: [
     ["**Your own data**", "Build 50 query/document pairs and measure recall@10. This beats every leaderboard."],
     ["**Dimensions**", "1536 costs four times the storage and memory of 384 for often marginal gain"],
     ["**Max sequence length**", "512-token models silently truncate; your chunk size must fit"],
     ["**Language coverage**", "An English-only model on Hindi text produces confident nonsense"],
     ["**Cost and hosting**", "A local model is free per call; an API is not"]
    ] } },
  { n: "Fifty labelled query/document pairs from your own corpus, and an afternoon, will tell you more than any benchmark. It is also the artefact you will keep re-using every time you consider changing models — which you will, because they improve every few months.",
    nt: "The evaluation that pays for itself" },

  { tryit: { t: "Find the opposites that embed as neighbours",
    task: "Embed several pairs of words and sentences, including at least two pairs that are opposites, and print their cosine similarities sorted from highest to lowest.",
    hint: "`sentence-transformers` with `all-MiniLM-L6-v2` runs locally and is small. Include a negation pair.",
    sol: { lang: "python", code: "from sentence_transformers import SentenceTransformer, util\n\nm = SentenceTransformer('all-MiniLM-L6-v2')\npairs = [\n    ('good', 'great'),\n    ('good', 'bad'),\n    ('increase', 'decrease'),\n    ('The patient has diabetes', 'The patient does not have diabetes'),\n    ('How do I cancel my order?', 'How do I cancel my subscription?'),\n    ('cat', 'democracy'),\n]\n\nscored = []\nfor a, b in pairs:\n    va, vb = m.encode([a, b])\n    scored.append((float(util.cos_sim(va, vb)), a, b))\n\nfor s, a, b in sorted(scored, reverse=True):\n    print(f'{s:.3f}  {a!r} vs {b!r}')" },
    w: "The negation pair usually scores above 0.9. If your retrieval threshold is below that, your system cannot tell those two sentences apart — and in a medical or legal context that is not a quality issue, it is a safety one." } },

  { vocab: ["Embedding", "Cosine Similarity", "Cross-Encoder"] }
 ],
 k: [
  "Embedding dimensions have no individual meaning; only the overall geometry carries information.",
  "'Similar' means 'used in similar contexts', which is why opposites and negations embed closely.",
  "Rerank with a cross-encoder and combine with keyword search to recover precision.",
  "Evaluate embedding models on 50 pairs of your own data, not on a leaderboard average."
 ],
 r: ["Embedding", "Cosine Similarity", "Cross-Encoder", "Hybrid Search"]
},

{
 t: "Building a Text Classifier End to End",
 m: "tasks",
 lvl: "intermediate",
 s: "The most common NLP task in production, with the decisions nobody warns you about.",
 goal: [
  "Build a baseline classifier and know when it is already good enough",
  "Handle the class imbalance that every real text dataset has",
  "Choose a decision threshold from the cost of each error type"
 ],
 b: [
  { p: "Spam or not. Which of eight departments should this ticket go to. Is this review positive. Text classification is the most-deployed NLP task by a wide margin, and it is where you should always start before reaching for anything generative." },

  { h: "Start with the boring baseline" },
  { p: "TF-IDF plus a linear model takes about ten lines, trains in seconds on a laptop, and is frequently within a few points of a fine-tuned transformer. Run it first — always." },
  { code: { lang: "python", t: "The baseline, in full",
    lines: [
     { c: "from sklearn.feature_extraction.text import TfidfVectorizer", w: "" },
     { c: "from sklearn.linear_model import LogisticRegression", w: "" },
     { c: "from sklearn.pipeline import make_pipeline", w: "" },
     { c: "", w: "" },
     { c: "clf = make_pipeline(", w: "" },
     { c: "    TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_features=50_000),", w: "**Bigrams matter** — 'not good' is the opposite of 'good' and unigrams cannot see it." },
     { c: "    LogisticRegression(max_iter=1000, class_weight='balanced'),", w: "Balanced weights, because your classes will not be." },
     { c: ")", w: "" },
     { c: "clf.fit(train_texts, train_labels)", w: "" }
    ] } },
  { p: "`ngram_range=(1, 2)` is the setting people leave at default and should not. Unigrams alone cannot represent negation, and negation is most of sentiment." },

  { h: "The imbalance nobody mentions" },
  { p: "Real text datasets are never balanced. Support tickets are 60% *billing* and 2% *legal*. Spam is 5%. The rare classes are usually the ones that matter." },
  { p: "The consequences are exactly as in the ML track: accuracy becomes meaningless, and the model learns to ignore the rare class because ignoring it is cheap." },
  { code: { lang: "python", t: "Report per class, never just overall",
    lines: [
     { c: "from sklearn.metrics import classification_report", w: "" },
     { c: "", w: "" },
     { c: "print(classification_report(y_test, clf.predict(X_test),", w: "" },
     { c: "                            digits=3, zero_division=0))", w: "**Per-class precision and recall.** An overall 0.94 can hide a class with 0.0 recall." }
    ] } },
  { trap: "Macro-F1 and weighted-F1 tell very different stories on imbalanced data. Weighted-F1 is dominated by your largest class and will look excellent while a small class is entirely broken. **Macro-F1 treats every class equally** and is the honest number when rare classes matter. Report both, and be suspicious when they diverge." },

  { h: "Choosing the threshold" },
  { p: "For binary problems, do not accept 0.5. The right threshold comes from the relative cost of each error, and that is a business question you should be asking out loud." },
  { code: { lang: "python", t: "Pick it from what each mistake costs",
    lines: [
     { c: "probs = clf.predict_proba(X_val)[:, 1]", w: "" },
     { c: "", w: "" },
     { c: "for t in [0.3, 0.4, 0.5, 0.6, 0.7]:", w: "" },
     { c: "    pred = (probs >= t).astype(int)", w: "" },
     { c: "    p = precision_score(y_val, pred, zero_division=0)", w: "" },
     { c: "    r = recall_score(y_val, pred)", w: "" },
     { c: "    print(f't={t}  precision={p:.3f}  recall={r:.3f}')", w: "Then choose deliberately, and write down why." }
    ] } },
  { p: "For a spam filter, a false positive means a real email is lost — expensive. Raise the threshold. For cancer screening, a false negative means a missed diagnosis — far more expensive. Lower it. The model is the same; the threshold encodes the values." },

  { h: "When to move beyond the baseline" },
  { tbl: { t: "Escalate only for a reason",
    h: ["Situation", "Try"],
    rows: [
     ["Baseline is within 2 points of your target", "**Ship the baseline.** Faster, cheaper, explainable."],
     ["Order and context matter (sarcasm, negation at distance)", "Fine-tuned transformer (DistilBERT, DeBERTa)"],
     ["Very few labels (< 200)", "Zero- or few-shot with an LLM, or embeddings + logistic regression"],
     ["Many classes with subtle distinctions", "Embeddings + classifier, or a fine-tuned model"],
     ["Labels will change often", "LLM with the taxonomy in the prompt — no retraining"]
    ] } },
  { n: "The embeddings-plus-logistic-regression middle path is underrated. Encode your texts once with a sentence transformer, then train a linear model on those vectors. You get much of the semantic benefit of a transformer, training takes seconds, and you can retrain instantly when labels change.",
    nt: "The option people skip" },

  { tryit: { t: "Baseline, then measure honestly",
    task: "Train a TF-IDF + logistic regression classifier on a text dataset with imbalanced classes. Report macro-F1 and weighted-F1 and explain the gap.",
    hint: "Use `fetch_20newsgroups` with three categories and subsample one class to create imbalance.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.metrics import classification_report, f1_score\n\ncats = ['sci.space', 'rec.autos', 'talk.politics.guns']\ntr = fetch_20newsgroups(subset='train', categories=cats)\nte = fetch_20newsgroups(subset='test', categories=cats)\n\n# make class 2 rare\nrng = np.random.default_rng(0)\nkeep = [i for i, y in enumerate(tr.target)\n        if y != 2 or rng.random() < 0.08]\nX = [tr.data[i] for i in keep]\ny = [tr.target[i] for i in keep]\n\nclf = make_pipeline(\n    TfidfVectorizer(ngram_range=(1, 2), min_df=2),\n    LogisticRegression(max_iter=1000, class_weight='balanced'))\nclf.fit(X, y)\n\npred = clf.predict(te.data)\nprint(classification_report(te.target, pred, target_names=cats, digits=3))\nprint('macro   ', round(f1_score(te.target, pred, average='macro'), 3))\nprint('weighted', round(f1_score(te.target, pred, average='weighted'), 3))" },
    w: "The rare class has visibly worse recall, and macro-F1 sits below weighted-F1 because of it. Removing `class_weight='balanced'` makes that gap dramatically worse — try it." } },

  { vocab: ["Text Classification", "TF-IDF", "Class Imbalance"] }
 ],
 k: [
  "Always run TF-IDF + logistic regression first; it is often within a few points of a transformer.",
  "Use bigrams — unigrams cannot represent negation.",
  "Real text data is imbalanced; report per-class metrics and prefer macro-F1 when rare classes matter.",
  "Choose the decision threshold from the cost of each error type, not from the 0.5 default.",
  "Embeddings + a linear model is a fast middle path when labels change often."
 ],
 r: ["Text Classification", "TF-IDF", "Class Imbalance", "F1 Score"]
},

{
 t: "Why NER Is Harder Than It Looks",
 m: "info",
 lvl: "intermediate",
 s: "Extracting names sounds easy until you meet real documents, and the evaluation is subtler than accuracy.",
 goal: [
  "Explain the BIO tagging scheme and why spans make evaluation hard",
  "Recognise the ambiguities that defeat rule-based extraction",
  "Choose between rules, a fine-tuned model and an LLM for extraction"
 ],
 b: [
  { p: "Named Entity Recognition pulls the people, places, dates and amounts out of text. It sounds like a solved problem and is one of the more deceptive tasks in NLP, because the failures are all in the edges — and real documents are mostly edges." },

  { h: "It is span labelling, not classification" },
  { p: "The output is not a label per document. It is a label per token, marking where each entity begins and ends. The standard is **BIO**: `B-` begins an entity, `I-` continues it, `O` is outside any entity." },
  { code: { lang: "text", t: "BIO tagging",
    lines: [
     { c: "Dr.    Aisha   Khan   flew   to   New     Delhi   in   March", w: "" },
     { c: "B-PER  I-PER   I-PER  O      O    B-LOC   I-LOC   O    B-DATE", w: "Three tokens make one person; two make one location." }
    ] } },
  { p: "This is why the task is hard to evaluate. A prediction of `Aisha Khan` when the answer is `Dr. Aisha Khan` is not simply wrong — it is partially right, and how you count that changes your reported score substantially." },

  { h: "The ambiguities that break rules" },
  { ana: "You are asked to highlight every company name in a newspaper. Then you meet 'Apple announced', 'an apple a day', 'Apple Street', and 'I work at Apple's Delhi office'. A rule that catches all four catches things it should not; a rule that catches none of the wrong ones misses real answers. That tension never resolves — it is the task.",
    at: "Highlighting the newspaper" },
  { ol: [
   "**Ambiguity.** *Washington* is a person, a state, a city and a university, and only context decides.",
   "**Nesting.** *Bank of America Building* contains an organisation inside a location.",
   "**Boundaries.** Does the title belong to the name? Does *Inc.*? Different datasets answer differently, which makes models trained on one dataset disagree with your annotations.",
   "**Novelty.** New companies, new drugs and new slang appear constantly, so a memorised list decays from the day it is written.",
   "**Domain shift.** A model trained on news collapses on clinical notes or legal contracts, where the entities and conventions are completely different."
  ] },

  { h: "Evaluation: strict versus partial" },
  { p: "There are two conventions and they give different numbers, so you must state which you used." },
  { tbl: { t: "Predicted `Aisha Khan` when the gold answer is `Dr. Aisha Khan`",
    h: ["Scheme", "Verdict", "Used by"],
    rows: [
     ["**Strict / exact**", "Wrong — boundaries must match exactly", "CoNLL, most papers"],
     ["**Partial / overlap**", "Partially correct", "MUC-style, many production settings"],
     ["**Type-only**", "Correct — it found a person somewhere here", "Rarely appropriate"]
    ] } },
  { trap: "Token-level accuracy is a meaningless metric for NER and is still occasionally reported. Because most tokens are `O`, a model that predicts `O` for everything scores above 90% accuracy while extracting nothing whatsoever. **Always use entity-level precision, recall and F1**, and say whether they are strict or partial." },

  { h: "Choosing your approach" },
  { tbl: { t: "Three routes, honestly compared",
    h: ["", "Rules / regex", "Fine-tuned model", "LLM"],
    rows: [
     ["**Best for**", "Structured formats — invoice numbers, dates, IDs", "High volume, fixed entity types", "Few examples, changing schema"],
     ["**Training data**", "None", "Hundreds to thousands of labelled spans", "A handful in the prompt"],
     ["**Cost per document**", "Free", "Very low", "Meaningful at scale"],
     ["**Handles novelty**", "No", "Somewhat", "Well"],
     ["**Explainable**", "Completely", "Partly", "Poorly"]
    ] } },
  { p: "The pragmatic answer is usually **hybrid**. Regex for the things with strict formats — dates, amounts, reference numbers — because a rule is exact and free. A model for the things that need context. Do not use an LLM to extract a date that a regular expression matches perfectly." },
  { n: "LLM extraction has changed the economics of this task for small volumes. If you need six entity types from two hundred contracts, a well-prompted model with a JSON schema will beat weeks of annotation. At two million documents a month, the arithmetic reverses completely and a fine-tuned small model wins. Know which regime you are in before choosing.",
    nt: "The volume decides" },

  { tryit: { t: "Find where the extractor fails",
    task: "Run spaCy's NER over a handful of deliberately awkward sentences — ambiguous names, nested entities, an unusual company name — and identify what it gets wrong.",
    hint: "`python -m spacy download en_core_web_sm` first. Try 'Washington', a person named after a place, and a fictional startup.",
    sol: { lang: "python", code: "import spacy\nnlp = spacy.load('en_core_web_sm')\n\ntests = [\n    'Washington met Washington in Washington.',\n    'Dr. Aisha Khan joined the Bank of America Building project.',\n    'Zyntherix Labs raised $4M in March 2026.',\n    'Apple Street is nowhere near Apple.',\n]\n\nfor t in tests:\n    doc = nlp(t)\n    ents = [(e.text, e.label_) for e in doc.ents]\n    print(f'{t}\\n   -> {ents}\\n')" },
    w: "You will see boundary errors, a missed novel company, and at least one confident mislabel. Every one of those is a real production failure mode, and seeing them yourself is worth more than reading about them." } },

  { vocab: ["Named Entity Recognition", "Information Extraction"] }
 ],
 k: [
  "NER labels spans, using BIO tagging, so partial matches make evaluation genuinely ambiguous.",
  "Ambiguity, nesting, boundaries, novelty and domain shift are what make it hard.",
  "Never report token-level accuracy — predicting all-O scores over 90% while extracting nothing.",
  "Use entity-level P/R/F1 and state whether matching is strict or partial.",
  "Hybrid wins: regex for strict formats, models for context-dependent entities."
 ],
 r: ["Named Entity Recognition", "Information Extraction", "Regular Expression"]
},

{
 t: "Why BLEU and ROUGE Stopped Being Enough",
 m: "eval",
 lvl: "intermediate",
 s: "The metrics the field ran on for twenty years, what they measure, and why nobody trusts them alone now.",
 goal: [
  "Explain what BLEU and ROUGE actually compute",
  "Give a concrete case where a perfect answer scores badly",
  "Choose an evaluation approach for generated text in 2026"
 ],
 b: [
  { p: "Machine translation needed a number. Human evaluation is slow and expensive, and you cannot run it after every training step. **BLEU** was the answer in 2002, **ROUGE** followed for summarisation, and between them they shaped two decades of research." },
  { p: "They are also badly misaligned with quality, in ways worth understanding — partly because you will still meet them in papers and benchmarks, and partly because the reasons they fail explain what replaced them." },

  { h: "What they compute" },
  { p: "**BLEU** measures n-gram *precision*: of the word sequences in your output, how many appear in the reference? It adds a brevity penalty so you cannot win by producing three words." },
  { p: "**ROUGE** measures n-gram *recall*: of the word sequences in the reference, how many did you produce? That flip suits summarisation, where coverage matters more than concision." },
  { tbl: { t: "The family",
    h: ["Metric", "Measures", "For"],
    rows: [
     ["**BLEU**", "n-gram precision, plus brevity penalty", "Translation"],
     ["**ROUGE-N**", "n-gram recall", "Summarisation"],
     ["**ROUGE-L**", "Longest common subsequence", "Summarisation, order-sensitive"],
     ["**METEOR**", "Matching with synonyms and stems", "Translation, better human correlation"],
     ["**chrF**", "Character n-grams", "Morphologically rich languages"]
    ] } },

  { h: "The failure, in one example" },
  { p: "Reference: *The cat sat on the mat.*" },
  { tbl: { t: "What the metric rewards",
    h: ["Candidate", "BLEU", "Actually"],
    rows: [
     ["`The cat sat on the mat.`", "**1.00**", "Perfect"],
     ["`The feline rested on the rug.`", "**~0.0**", "**Excellent paraphrase — scored as failure**"],
     ["`The cat sat on the cat.`", "**~0.7**", "**Wrong meaning — scored well**"],
     ["`On the mat the cat sat.`", "**~0.4**", "Correct, slightly awkward"]
    ] } },
  { p: "That second row is the whole problem. A flawless translation using different words scores near zero, because BLEU cannot see synonyms. And the third row — which changes the meaning entirely — scores highly, because it shares most of its n-grams." },
  { ana: "Marking an essay by counting how many of the model answer's exact phrases appear in it. A student who understood the material and wrote it in their own words fails. A student who copied phrases into a nonsensical order passes. You are measuring overlap and calling it comprehension.",
    at: "Marking by phrase-matching" },

  { trap: "BLEU scores are not comparable across papers unless the tokenisation, casing and smoothing match exactly. Differences of two or three points between publications are frequently artefacts of preprocessing rather than real improvements. Use `sacrebleu`, which fixes the configuration and reports a signature string precisely so results can be compared." },

  { h: "What people use now" },
  { tbl: { t: "The current toolkit",
    h: ["Approach", "How it works", "Trade-off"],
    rows: [
     ["**BERTScore**", "Embedding similarity between tokens", "Sees paraphrase; still no reasoning"],
     ["**COMET**", "A model trained to predict human ratings", "Strong correlation; translation-specific"],
     ["**LLM-as-judge**", "A model scores against a rubric", "Flexible and now standard; costs money, needs validation"],
     ["**Task-based**", "Can a person complete the task using this output?", "The most honest; slowest"],
     ["**Human ratings**", "Trained annotators", "The ground truth; expensive"]
    ] } },
  { p: "The field's answer in practice is **LLM-as-judge with a validated rubric**, backed by a small set of human labels to check the judge is agreeing with people. That combination is affordable, sees paraphrase, and can assess criteria n-gram metrics cannot represent at all — faithfulness to a source, tone, whether an answer actually addresses the question." },
  { n: "For anything factual, prefer a check that is not similarity-based at all. *Does the summary contain a claim absent from the source?* is a yes/no question a judge can answer reliably, and it directly measures hallucination — which is what you actually care about and which no n-gram overlap metric can detect.",
    nt: "The check worth building first" },

  { tryit: { t: "Break BLEU yourself",
    task: "Compute BLEU for a perfect paraphrase and for a fluent sentence with the wrong meaning, against the same reference. Then compare with BERTScore.",
    hint: "`sacrebleu` for BLEU; `bert-score` for the embedding version. The paraphrase should score low on one and high on the other.",
    sol: { lang: "python", code: "import sacrebleu\n\nref = ['The cat sat on the mat.']\ncands = {\n    'exact':      'The cat sat on the mat.',\n    'paraphrase': 'The feline rested on the rug.',\n    'wrong':      'The cat sat on the cat.',\n    'reordered':  'On the mat the cat sat.',\n}\n\nfor name, c in cands.items():\n    b = sacrebleu.sentence_bleu(c, ref).score\n    print(f'{name:11s} BLEU={b:6.2f}  {c}')\n\n# then, for contrast:\n# from bert_score import score\n# P, R, F = score(list(cands.values()), ref * len(cands), lang='en')\n# print(F)" },
    w: "The paraphrase scores near zero and the meaning-changing sentence scores well. Once you have seen that inversion, you will never again report a BLEU improvement without checking what actually changed." } },

  { vocab: ["BLEU", "ROUGE", "LLM-as-a-Judge"] }
 ],
 k: [
  "BLEU is n-gram precision for translation; ROUGE is n-gram recall for summarisation.",
  "Both are blind to synonyms, so a perfect paraphrase can score near zero while a meaning-changing sentence scores well.",
  "BLEU is not comparable across papers unless preprocessing matches — use sacrebleu.",
  "Current practice is BERTScore, COMET or a validated LLM judge, checked against human labels.",
  "For factual output, test for unsupported claims directly rather than measuring similarity."
 ],
 r: ["BLEU", "ROUGE", "LLM-as-a-Judge", "Perplexity"]
}

]);
