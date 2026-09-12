/* NLP — Evaluation & production. */
TD.addLessons("nlp", [

    {
        t: "NLP Evaluation Metrics — BLEU, ROUGE, Perplexity and Beyond",
        m: "eval",
        lvl: "core",
        s: "The metrics used to evaluate NLP systems, what each actually measures, and what none of them measure.",
        goal: [
            "Compute and interpret BLEU, ROUGE, perplexity and BERTScore",
            "Know which metric fits which task and what each one's blind spots are",
            "Understand why automatic metrics must be paired with human evaluation for generation tasks"
        ],
        b: [
            { p: "Every NLP task has standard metrics, and every standard metric has a blind spot. Understanding what each one actually measures — and what it does not — is the difference between evaluating a system honestly and fooling yourself with numbers." },

            {
                tbl: {
                    t: "NLP evaluation metrics — what each measures and misses",
                    h: ["Metric", "Task", "What It Measures", "What It Misses"],
                    rows: [
                        ["**Accuracy / F1**", "Classification, NER", "Correct predictions vs total", "Class imbalance (use macro F1)"],
                        ["**Perplexity**", "Language modelling", "How surprised the model is by held-out text", "Helpfulness, safety, task quality"],
                        ["**BLEU**", "Translation", "N-gram precision vs reference", "Valid paraphrases with different words"],
                        ["**ROUGE**", "Summarisation", "N-gram recall vs reference", "Faithfulness — overlap ≠ truth"],
                        ["**BERTScore**", "Any generation", "Contextual embedding similarity to reference", "Still just similarity, not correctness"],
                        ["**Exact Match**", "Extractive QA", "Predicted span exactly matches gold", "Partial matches that are still useful"],
                        ["**WER**", "Speech recognition", "Word error rate vs transcript", "Semantic correctness despite word errors"],
                        ["**Human eval**", "Any generation", "Factual accuracy, helpfulness, safety", "Expensive, slow, not reproducible"]
                    ]
                }
            },

            { h: "BLEU: N-gram Precision for Translation" },
            { p: "Count matching n-grams (1-4) between output and reference, clip counts, apply a brevity penalty. Corpus-level correlation with human judgement is decent; sentence-level is poor. A correct translation using different vocabulary scores badly." },

            { h: "ROUGE: Recall for Summarisation" },
            { p: "ROUGE-1 and ROUGE-2 measure unigram and bigram recall. ROUGE-L uses longest common subsequence. Being recall-oriented suits summarisation (did you cover the important content?), but it rewards copying and says nothing about factual accuracy." },

            {
                code: {
                    lang: "python", t: "Computing BLEU, ROUGE and BERTScore",
                    lines: [
                        { c: "# BLEU for translation evaluation", w: "" },
                        { c: "from nltk.translate.bleu_score import sentence_bleu", w: "" },
                        { c: "reference = [['the', 'cat', 'sat', 'on', 'the', 'mat']]", w: "" },
                        { c: "candidate = ['the', 'cat', 'is', 'on', 'the', 'mat']", w: "" },
                        { c: "print(f'BLEU: {sentence_bleu(reference, candidate):.3f}')", w: "**N-gram overlap score.**", hi: true },
                        { c: "", w: "" },
                        { c: "# ROUGE for summarisation evaluation", w: "" },
                        { c: "from rouge_score import rouge_scorer", w: "" },
                        { c: "scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'])", w: "" },
                        { c: "scores = scorer.score(", w: "" },
                        { c: "    'the cat sat on the mat',", w: "" },
                        { c: "    'the cat is on the mat')", w: "" },
                        { c: "print(scores['rouge1'])", w: "**Precision, recall, F-measure for unigrams.**", hi: true },
                        { c: "", w: "" },
                        { c: "# BERTScore — semantic similarity using contextual embeddings", w: "" },
                        { c: "from bert_score import score as bert_score", w: "" },
                        { c: "P, R, F1 = bert_score(", w: "" },
                        { c: "    cands=['the cat is on the mat'],", w: "" },
                        { c: "    refs=['the cat sat on the mat'],", w: "" },
                        { c: "    lang='en')", w: "" },
                        { c: "print(f'BERTScore F1: {F1[0]:.3f}')", w: "**Captures semantic similarity beyond n-gram overlap.**", hi: true }
                    ]
                }
            },

            { trap: "BLEU and ROUGE are deterministic overlap metrics. They reward surface similarity, not meaning, not truth, not helpfulness. A system that copies the input verbatim scores well on ROUGE. Always pair automatic metrics with human evaluation for generation tasks." },

            { vocab: ["BLEU", "ROUGE", "Perplexity", "F1 Score"] }
        ],
        k: [
            "BLEU measures n-gram precision (translation), ROUGE measures n-gram recall (summarisation) — neither measures truth.",
            "BERTScore uses contextual embeddings for semantic similarity, but similarity is still not correctness.",
            "Automatic metrics measure overlap and fluency. Factual accuracy requires human evaluation or faithfulness models."
        ],
        r: ["BLEU", "ROUGE", "Perplexity", "Evaluation Metric", "F1 Score"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "sentence_bleu(reference_tokens, candidate_tokens)", w: "compute BLEU score for translation" },
                { c: "scorer = RougeScorer(['rouge1', 'rougeL']); scorer.score(ref, cand)", w: "compute ROUGE scores for summarisation" },
                { c: "P, R, F1 = bert_score(cands, refs, lang='en')", w: "compute BERTScore for semantic similarity" }
            ]
        }
    },

    {
        t: "NLP in Production — From Research Metrics to Reliable Systems",
        m: "eval",
        lvl: "intermediate",
        s: "Data drift for text, evaluation harnesses, monitoring NLP systems, and the gap between a notebook and a product.",
        goal: [
            "Build an evaluation harness that catches regressions before deployment",
            "Detect text data drift using vocabulary shift and embedding distance",
            "Design a monitoring pipeline for a production NLP system"
        ],
        b: [
            { p: "A model that scores well on a test set in March may score poorly on live data in June. Language drifts — new slang, new product names, seasonal topics, shifting customer complaints. Monitoring NLP systems means watching for this drift and catching it before accuracy drops reach users." },

            { h: "The Evaluation Harness" },
            { p: "Before any NLP model goes to production, build a **golden test set** — a curated, manually labelled dataset that represents the hard cases. Run every candidate model against it before deployment. Automate this as a CI/CD check: no model ships without passing the harness." },

            {
                code: {
                    lang: "python", t: "A minimal evaluation harness for NLP",
                    lines: [
                        { c: "import json", w: "" },
                        { c: "from sklearn.metrics import classification_report", w: "" },
                        { c: "", w: "" },
                        { c: "def evaluate_model(model_fn, golden_path, threshold=0.85):", w: "" },
                        { c: "    '''Run model against golden test set, fail if below threshold.'''", w: "" },
                        { c: "    with open(golden_path) as f:", w: "" },
                        { c: "        golden = json.load(f)  # [{text, label}, ...]", w: "" },
                        { c: "", w: "" },
                        { c: "    texts = [ex['text'] for ex in golden]", w: "" },
                        { c: "    labels = [ex['label'] for ex in golden]", w: "" },
                        { c: "    preds = [model_fn(t) for t in texts]", w: "" },
                        { c: "", w: "" },
                        { c: "    report = classification_report(labels, preds, output_dict=True)", w: "" },
                        { c: "    macro_f1 = report['macro avg']['f1-score']", w: "" },
                        { c: "", w: "" },
                        { c: "    print(classification_report(labels, preds))", w: "" },
                        { c: "", w: "" },
                        { c: "    if macro_f1 < threshold:", w: "" },
                        { c: "        raise ValueError(", w: "" },
                        { c: "            f'Macro F1 {macro_f1:.3f} below threshold {threshold}')", w: "**Blocks deployment on quality regression.**", hi: true },
                        { c: "", w: "" },
                        { c: "    return macro_f1", w: "" }
                    ]
                }
            },

            { h: "Detecting Text Data Drift" },
            { p: "Text drift is subtler than tabular drift. Monitor: 1) **Vocabulary shift** — new words appearing in production that were rare in training. 2) **Embedding distance** — the centroid of production text embeddings drifting from the training centroid. 3) **Prediction distribution** — the class proportions shifting." },

            {
                tbl: {
                    t: "Monitoring signals for production NLP",
                    h: ["Signal", "What It Catches", "How to Measure"],
                    rows: [
                        ["**Prediction distribution shift**", "Model suddenly predicting one class more", "Track class proportions over time"],
                        ["**Confidence score distribution**", "Model becoming less certain overall", "Histogram of prediction probabilities"],
                        ["**OOV rate / vocabulary shift**", "New terms the model has never seen", "Track % of tokens not in training vocab"],
                        ["**Embedding centroid drift**", "Topic or domain shift in input text", "Cosine distance between time-window centroids"],
                        ["**Latency percentiles**", "Input text getting longer or model degrading", "p50, p95, p99 inference latency"]
                    ]
                }
            },

            { trap: "The gap between 'works in a notebook' and 'works in production' is enormous for NLP. The training data was clean; production text has typos, code-switching, emojis, adversarial input and HTML artifacts. Test on messy real data, not just clean benchmarks." },

            {
                tryit: {
                    t: "Spot the distribution shift",
                    task: "Your NLP classifier was trained on customer support tickets with this class distribution: billing (40%), shipping (35%), technical (25%). This week's production traffic shows: billing (25%), shipping (30%), technical (15%), returns (30%). What is wrong and what do you do?",
                    hint: "A new class appeared that the model was never trained on.",
                    sol: { lang: "python", code: "# 1. 'Returns' is a new class the model has never seen\n# 2. The model is forcing 'returns' tickets into the nearest known class\n# 3. Investigate: review misclassifications this week\n# 4. Label 'returns' examples, retrain with 4 classes\n# 5. Set up automated distribution monitoring to catch this faster" },
                    w: "Production data evolves. New categories appear, old ones shift. Distribution monitoring catches this before accuracy degrades."
                }
            },

            { vocab: ["Data Drift", "CI/CD"] }
        ],
        k: [
            "Build a golden test set of hard cases and automate evaluation as a CI/CD gate — no model ships without passing it.",
            "Monitor text drift through vocabulary shift, embedding centroid distance and prediction distribution changes.",
            "Production text is messier than training data — test on real data with typos, emojis and adversarial input."
        ],
        r: ["Model Drift", "MLOps", "Model Deployment", "Data Quality"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "report = classification_report(labels, preds, output_dict=True)", w: "generate evaluation report as a dict" },
                { c: "if macro_f1 < threshold: raise ValueError('Quality gate failed')", w: "block deployment on quality regression" },
                { c: "# Monitor: prediction distribution, confidence, OOV rate, latency", w: "production NLP monitoring signals" }
            ]
        }
    }

]);
