/* Machine Learning — evaluation and metrics. */
TD.addLessons("ml", [

{
 t: "Accuracy Is Usually the Wrong Metric",
 m: "eval",
 lvl: "core",
 s: "Precision, recall, F1 and the confusion matrix — chosen by what each mistake costs.",
 goal: [
  "Read a confusion matrix and compute precision and recall from it",
  "Choose a metric from the business cost of each error type",
  "Explain the precision-recall trade-off and where to set a threshold"
 ],
 b: [
  { p: "Accuracy is the fraction you got right. It is the first metric everyone learns and it is the wrong choice for most problems worth solving, because it treats every mistake as equivalent and in the real world they never are." },

  { h: "The confusion matrix, which everything comes from" },
  { p: "Four numbers. Every classification metric is an arithmetic combination of these four, so learning to read the matrix means never having to memorise a formula again." },

  { tbl: { t: "A fraud model on 10,000 transactions",
    h: ["", "Model says fraud", "Model says fine"],
    rows: [
     ["**Actually fraud**", "**TP = 80** — caught it", "**FN = 20** — missed it. *False negative*"],
     ["**Actually fine**", "**FP = 400** — false alarm. *False positive*", "**TN = 9,500** — correctly left alone"]
    ] } },

  { code: { lang: "python", t: "Every metric, derived from those four",
    lines: [
     { c: "TP, FP, FN, TN = 80, 400, 20, 9500", w: "" },
     { c: "", w: "" },
     { c: "accuracy = (TP + TN) / (TP + FP + FN + TN)", w: "**0.958.** Impressive, and it tells you nothing — predicting *never fraud* would score 0.99." },
     { c: "", w: "" },
     { c: "precision = TP / (TP + FP)", w: "**0.167.** *When it says fraud, how often is it right?* One in six.", hi: true },
     { c: "recall = TP / (TP + FN)", w: "**0.800.** *Of all the real fraud, how much did we catch?* Four in five.", hi: true },
     { c: "", w: "" },
     { c: "f1 = 2 * precision * recall / (precision + recall)", w: "**0.276.** The harmonic mean — punishes a low score in either, so it cannot be gamed by maximising one." }
    ],
    out: "0.958\n0.167\n0.800\n0.276",
    after: "Same model, four numbers ranging from 0.17 to 0.96. Which one you report is a choice, and it is a choice about which mistake matters." } },

  { n: "The memory aid that actually sticks: **precision is about what you said** — of everything you flagged, how much was real. **Recall is about what was there** — of everything real, how much did you find. Precision looks at your predictions; recall looks at the truth.",
    nt: "How to stop mixing them up" },

  { h: "Choosing by what the mistake costs" },
  { p: "There is no universally correct metric. There is only the question of which error is more expensive, and that question is answered by the business, not the data science team." },

  { tbl: { t: "Which error hurts more",
    h: ["Problem", "False positive costs", "False negative costs", "Optimise for"],
    rows: [
     ["**Cancer screening**", "An anxious patient and a follow-up test", "**A missed cancer**", "**Recall.** Overwhelmingly"],
     ["**Spam filter**", "**A real email lost in spam**", "One spam message in the inbox", "**Precision.** Users forgive spam and never forgive a lost invoice"],
     ["**Fraud blocking**", "A furious legitimate customer", "The value of the fraud", "**Balance**, weighted by amount. Block big, review small"],
     ["**Content moderation**", "A wrongly removed post and an appeal", "Harmful content stays up", "Depends on severity. Usually staged: recall first, then human review"],
     ["**RAG retrieval**", "An irrelevant chunk wastes context", "**The answer was not retrieved at all**", "**Recall at the retrieval stage**, precision at the rerank stage"]
    ] } },

  { p: "That last row is worth noting, because it is the design of every good retrieval system: retrieve broadly to avoid missing the answer, then rerank precisely to avoid drowning the model in noise. The two stages optimise different metrics on purpose." },

  { h: "The trade-off, and the threshold" },
  { p: "Precision and recall move against each other, and the dial between them is the threshold — the probability above which you call something positive. It defaults to 0.5 for no better reason than 0.5 being halfway." },

  { code: { lang: "python", t: "Sweeping the threshold",
    lines: [
     { c: "from sklearn.metrics import precision_recall_curve", w: "" },
     { c: "", w: "" },
     { c: "probs = model.predict_proba(X_val)[:, 1]", w: "**Probabilities, not predictions.** `predict()` has already applied 0.5 and thrown away your options.", hi: true },
     { c: "prec, rec, thr = precision_recall_curve(y_val, probs)", w: "" },
     { c: "", w: "" },
     { c: "for t in [0.1, 0.3, 0.5, 0.7, 0.9]:", w: "" },
     { c: "    pred = (probs >= t).astype(int)", w: "**Apply your own threshold.**" },
     { c: "    print(f't={t}  precision={precision_score(y_val, pred):.2f}'", w: "" },
     { c: "          f'  recall={recall_score(y_val, pred):.2f}')", w: "" }
    ],
    out: "t=0.1  precision=0.21  recall=0.94\nt=0.3  precision=0.38  recall=0.79\nt=0.5  precision=0.56  recall=0.61\nt=0.7  precision=0.74  recall=0.38\nt=0.9  precision=0.91  recall=0.12",
    after: "One model, five completely different products. At 0.1 you catch 94% of cases and drown in false alarms; at 0.9 you are almost always right and miss most of them. Nothing about the model changed — only the number you compared against." } },

  { trap: "`model.predict()` silently applies a 0.5 threshold, and 0.5 is almost never the right business answer. Use `predict_proba()`, choose the threshold from the cost of each error — the expected-value arithmetic from the probability lesson — and apply it yourself. Tuning the threshold is frequently the cheapest, largest improvement available in a model that is already trained." },

  { h: "ROC-AUC, and when not to use it" },
  { p: "**AUC** is the probability that a randomly chosen positive scores higher than a randomly chosen negative. It summarises performance across all thresholds in one number, which makes it useful for comparing models and useless for deciding what to deploy." },

  { tbl: { t: "AUC against PR-AUC",
    h: ["", "ROC-AUC", "PR-AUC (average precision)"],
    rows: [
     ["Plots", "True positive rate against false positive rate", "Precision against recall"],
     ["Random model scores", "0.5", "The positive class rate — so 0.02 on a 2% problem"],
     ["**On imbalanced data**", "**Misleadingly high.** The huge negative class makes the false positive rate tiny regardless", "**Honest.** It reflects the false alarm burden directly"],
     ["Use it", "Roughly balanced classes; comparing models across datasets", "**Rare positives — which is most valuable problems.** Prefer this one"]
    ] } },

  { n: "The practical rule: if your positive class is under about 10%, report PR-AUC or average precision rather than ROC-AUC. A fraud model can post an ROC-AUC of 0.95 while being operationally unusable, because ROC's false positive rate divides by a denominator of hundreds of thousands of negatives and stays tiny no matter how many alerts you generate.",
    nt: "The rule to apply" },

  { h: "Regression metrics" },
  { tbl: { t: "For predicting a number",
    h: ["Metric", "What it does", "Use when"],
    rows: [
     ["**MAE** — mean absolute error", "Average distance from the truth, in the original units", "**The default.** Interpretable — '₹340 out on average'. Robust to outliers"],
     ["**RMSE** — root mean squared error", "Squares errors first, so big misses dominate", "Large errors are disproportionately costly. Also what most models optimise by default"],
     ["**MAPE** — mean absolute percentage error", "Error as a percentage of the true value", "Scales vary hugely across rows. **Breaks when the truth can be zero**"],
     ["**R²**", "Fraction of variance explained, 0 to 1", "Reporting to people who want one comparable number. Not actionable on its own"]
    ] } },

  { p: "MAE and RMSE disagree in a useful way. If RMSE is far above MAE, a few large errors are dominating — go and find them. That gap is a diagnostic, not just two numbers." },

  { tryit: { t: "Choose a metric and defend it",
    task: "For each, name the metric you would optimise and the threshold logic, in one sentence each.\n\n1. Flagging fake product reviews on a marketplace\n2. Predicting delivery time shown to a customer\n3. Retrieving documents for a RAG system\n4. Detecting a rare manufacturing defect where a miss means a recall",
    hint: "Ask what each error costs, and to whom. The answer is rarely accuracy and rarely 0.5.",
    sol: { lang: "text", code: "1. Fake reviews -- PRECISION-leaning.\n   Removing a genuine review angers a real customer and is\n   publicly visible. Set a high threshold, auto-remove only\n   the confident cases, queue the rest for human review.\n\n2. Delivery time -- MAE, in minutes, reported to customers.\n   But optimise an ASYMMETRIC loss: being 20 minutes late is\n   far worse than 20 minutes early. Quantile regression at the\n   0.8 quantile beats mean prediction here, because the product\n   requirement is 'rarely late', not 'accurate on average'.\n\n3. RAG retrieval -- RECALL@k at the retrieval stage.\n   If the right chunk is not in the top 50, no amount of\n   clever reranking or prompting recovers it. Then precision\n   at the rerank stage, because context is a scarce budget.\n\n4. Manufacturing defect -- RECALL, close to the maximum.\n   A recall costs crores; a false alarm costs one inspection.\n   Set the threshold very low and staff the review queue.\n   Report PR-AUC, not ROC-AUC, since defects are rare." },
    w: "Notice that in every case the answer came from the cost of a mistake, not from a property of the data. Candidates who reach for F1 by default sound like they learned metrics from a tutorial. Candidates who ask *what does each error cost you?* sound like they have shipped something." } },

  { vocab: ["Precision", "Recall", "F1 Score", "Confusion Matrix", "ROC Curve", "Precision-Recall Curve"] }
 ],
 k: [
  "Every classification metric comes from four numbers: TP, FP, FN, TN.",
  "Precision is about what you said; recall is about what was there.",
  "Choose the metric from what each error costs — the business decides, not the data.",
  "`predict()` hides a 0.5 threshold; use `predict_proba()` and set the threshold yourself.",
  "Under about 10% positives, use PR-AUC rather than ROC-AUC, which flatters imbalanced problems."
 ],
 r: ["Precision", "Recall", "F1 Score", "Confusion Matrix", "ROC Curve", "Precision-Recall Curve", "Mean Squared Error"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "precision = TP / (TP + FP)", w: "of what you flagged, how much was real" },
   { c: "recall = TP / (TP + FN)", w: "of what was real, how much you found" },
   { c: "probs = model.predict_proba(X)[:, 1]", w: "get probabilities, not pre-thresholded predictions" },
   { c: "pred = (probs >= 0.3).astype(int)", w: "apply a threshold you chose for a reason" },
   { c: "average_precision_score(y, probs)", w: "PR-AUC — the honest summary for rare positives" }
  ]
 }
},

{
 t: "Evaluating Honestly When Nobody Is Checking",
 m: "eval",
 lvl: "intermediate",
 s: "Leakage, contamination and the ways a good result is usually a bug report.",
 goal: [
  "Recognise the five kinds of leakage before they reach production",
  "Treat a suspiciously good result as a signal to investigate",
  "Build an evaluation that survives someone else auditing it"
 ],
 b: [
  { p: "There is one rule that will save you more embarrassment than any other in this field: **when a result is surprisingly good, look for the bug first.** Not because you are not capable of good work, but because in supervised learning the base rate of *too good* being a leak is overwhelmingly high." },

  { h: "The five leaks" },
  { tbl: { t: "How information about the answer sneaks into the features",
    h: ["Leak", "Example", "How to catch it"],
    rows: [
     ["**Target leakage**", "`cancellation_date` as a feature for predicting cancellation", "**Ask of every feature: would I have this value at prediction time?** This one question catches most of them"],
     ["**Train-test contamination**", "Scaler fitted on all data; duplicate rows split across both sides", "Use a Pipeline; deduplicate before splitting"],
     ["**Temporal leakage**", "Random split on time series, so the model sees the future", "Split by date, always, when time matters"],
     ["**Group leakage**", "The same customer, patient or document in train and test", "GroupKFold on the entity id"],
     ["**Proxy leakage**", "A feature that is not the label but is caused by it — `assigned_to_fraud_team`", "**The subtlest one.** Check feature importances; anything dominant deserves a hard look"]
    ] } },

  { code: { lang: "python", t: "Finding a leak through feature importance",
    lines: [
     { c: "import pandas as pd", w: "" },
     { c: "", w: "" },
     { c: "imp = pd.Series(model.feature_importances_, index=X.columns)", w: "" },
     { c: "imp.sort_values(ascending=False).head(5)", w: "**One feature carrying most of the signal is a red flag, not a triumph.**", hi: true }
    ],
    out: "support_tickets_last_7d    0.71\ndays_since_last_order      0.09\ntotal_spend                0.06\nplan_type                  0.04\nage                        0.03",
    after: "One feature at 0.71 is not a discovery. Go and ask when `support_tickets_last_7d` is populated. If customers open a ticket while cancelling, it is caused by the outcome you are predicting — perfect offline, empty in production, and a model that quietly collapses on launch day." } },

  { n: "The single most useful sentence in a model review: *would I actually have this value at the moment I need to make the prediction?* Ask it of every feature in the top five. It takes two minutes and it catches the majority of leaks that make it past a first pass.",
    nt: "The question to ask in every review" },

  { h: "The tells" },
  { l: [
   "**Accuracy above 0.95 on a problem humans find hard.** Almost always a leak.",
   "**One feature dominating importance.** Investigate it specifically.",
   "**Perfect separation** — the model gets every training case right with a simple rule. Something in the features is the answer.",
   "**Offline excellent, online flat.** The classic signature. Either leakage or a distribution difference between your test set and reality.",
   "**Removing a feature collapses performance entirely.** A robust model degrades gracefully; a leaking one falls off a cliff."
  ] },

  { h: "The ablation habit" },
  { p: "Drop each feature in turn, retrain, and see what happens. It is slow and it is the most informative thing you can do to a model you are unsure about." },

  { code: { lang: "python", t: "One-at-a-time ablation",
    lines: [
     { c: "base = cross_val_score(model, X, y, cv=5).mean()", w: "" },
     { c: "", w: "" },
     { c: "for col in X.columns:", w: "" },
     { c: "    score = cross_val_score(model, X.drop(columns=[col]), y, cv=5).mean()", w: "" },
     { c: "    print(f'{col:<28} without: {score:.3f}  (drop {base - score:+.3f})')", w: "**A large drop means either a genuinely vital feature or a leak.** The two look identical here — you have to go and ask.", hi: true }
    ],
    out: "support_tickets_last_7d      without: 0.643  (drop +0.244)\ndays_since_last_order        without: 0.858  (drop +0.029)\ntotal_spend                  without: 0.871  (drop +0.016)\nage                          without: 0.884  (drop +0.003)",
    after: "Removing one feature costs 24 points. That is not a strong feature; that is the answer hiding in the input. Meanwhile `age` contributes 0.003 and could be dropped for simplicity with no measurable loss." } },

  { h: "Test set contamination in the LLM era" },
  { p: "A newer problem worth knowing about, because it changes how you read every published benchmark. Large models were trained on a scrape of the public internet, and public benchmarks are on the public internet." },
  { l: [
   "A model scoring well on a public benchmark may have seen its answers during pretraining. This is not hypothetical; it has been demonstrated repeatedly.",
   "**Your own evaluation set must be private.** If you build it from public data, assume the model has read it.",
   "Hand-written evaluation questions about *your* documents are worth more than any public benchmark score, because they cannot have leaked.",
   "When a vendor quotes a benchmark number, the useful question is *was that benchmark public before your training cutoff?*"
  ] },

  { h: "An evaluation somebody else can audit" },
  { ol: [
   "**Write down the split rule** — random, by date, by group — and why. Put it in the README.",
   "**Freeze the test set as a file** with a hash, not a random seed. Seeds change when code changes.",
   "**Record the metric and the threshold** before running, so you cannot pick the flattering one afterwards.",
   "**Report an interval**, not a point. The statistics lesson gives you the bootstrap in six lines.",
   "**Keep every failing example** in a file. This is the most useful artefact your project will produce and it costs nothing to save.",
   "**Version the evaluation set.** When it changes, scores from before and after are not comparable, and someone will compare them anyway unless you label it."
  ] },

  { trap: "The most dangerous evaluation is the one you built after seeing the model's outputs. You look at what it does, write test cases around that, and produce a harness that certifies exactly the behaviour you already have. Write the evaluation from the *requirements* — what a good answer looks like to a user — before you look at what the model produces." },

  { tryit: { t: "Audit an evaluation",
    task: "A colleague reports a churn model at 0.94 AUC and wants to ship. Write the six questions you would ask, in the order you would ask them.",
    hint: "Start with the split and the features, not with the model. Almost all the risk is upstream of the algorithm.",
    sol: { lang: "text", code: "1. How was the data split? If random on time-ordered data,\n   stop here -- the number is not real.\n\n2. What is the top feature by importance, and when is it\n   populated relative to the prediction moment?\n\n3. What is the class balance, and what does a trivial\n   baseline score? 0.94 AUC on a 2% positive rate may still\n   be operationally unusable -- ask for precision at the\n   operating threshold, not AUC.\n\n4. Is any customer in both train and test? Multiple rows per\n   customer is the default in most datasets, and a random\n   split will scatter them.\n\n5. How many times was the test set scored? If it drove any\n   decision, it is a validation set and the estimate is\n   optimistic.\n\n6. What threshold will production use, and what does the\n   confusion matrix look like there? AUC is a summary across\n   all thresholds; you are shipping exactly one." },
    w: "None of those questions is about the model, and that is the point. In supervised learning the model is rarely where things go wrong — the split, the features and the metric choice are. Asking these six in this order is a repeatable review process, and being known for it is a genuinely good thing to be known for." } },

  { vocab: ["Data Leakage", "Cross-Validation", "Overfitting", "Feature Importance", "Benchmark"] }
 ],
 k: [
  "A surprisingly good result is a bug report until proven otherwise.",
  "Five leaks: target, contamination, temporal, group and proxy. The first question catches most of them.",
  "Ask of every feature whether you would have its value at prediction time.",
  "One feature dominating importance is a red flag, and ablation tells you how much anything really contributes.",
  "Keep the test set private, frozen, versioned, and scored once — and keep every failing example."
 ],
 r: ["Data Leakage", "Cross-Validation", "Overfitting", "Feature Importance", "Training Data"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False)", w: "which features the model actually leans on" },
   { c: "cross_val_score(model, X.drop(columns=[col]), y, cv=5).mean()", w: "ablation — the score without one feature" },
   { c: "df.duplicated().sum()", w: "duplicates that would leak across a split" },
   { c: "GroupKFold(n_splits=5)", w: "keep one entity on one side of the split" }
  ]
 }
}

]);
