/* Machine Learning — the things that actually break in real projects.

   The track taught the pipeline, overfitting and metrics well. What it did
   not have was the set of failures that account for most wasted months in
   real ML work: leakage that survives a correct train/test split, imbalance
   that makes 99% accuracy meaningless, validation schemes that lie because
   the data has structure, models that decay after deployment, and the
   inability to explain a prediction to someone who is entitled to an answer.

   These are grouped here because they share a shape. Every one of them
   produces a model that looks excellent in a notebook and fails in the
   world, which is the most expensive category of mistake in the field —
   expensive because you only discover it after you have told people it
   works.

   The lessons are deliberately blunt about that. A reader who finishes this
   module should be suspicious of a good score, which is the correct
   professional instinct and almost never taught. */
TD.addLessons("ml", [

{
 t: "Data Leakage: The Bug That Looks Like Success",
 m: "fit",
 lvl: "intermediate",
 s: "Your model scores 0.99. That is not good news — it is the most common symptom of a broken experiment.",
 goal: [
  "Recognise the five kinds of leakage by their symptoms",
  "Explain why fitting a scaler before splitting is already a leak",
  "Build a pipeline that makes the common leaks structurally impossible"
 ],
 b: [
  { p: "**Leakage is when information that would not exist at prediction time gets into training.** The model learns from it, scores brilliantly in validation, and collapses in production — because the thing it was relying on is not there any more." },
  { p: "It is the single most expensive bug in machine learning, because it does not look like a bug. It looks like a triumph, and people announce it before discovering otherwise." },
  { q: "If your first model scores far better than you expected, do not celebrate. Go looking for the leak. It is there far more often than a genuine breakthrough is." },

  { h: "The five kinds" },
  { tbl: { t: "Leakage, by how it gets in",
    h: ["Kind", "What happens", "Typical symptom"],
    rows: [
     ["**Target leakage**", "A feature is a consequence of the target", "One feature has enormous importance; accuracy near-perfect"],
     ["**Train-test contamination**", "Preprocessing fitted on all data before splitting", "Validation is optimistic by a small, consistent margin"],
     ["**Temporal leakage**", "Training on rows from after the prediction time", "Great backtest, poor live performance"],
     ["**Group leakage**", "The same entity appears in both train and test", "Excellent scores, fails on genuinely new entities"],
     ["**Duplicate leakage**", "The same row exists in both splits", "Quietly inflated everything"]
    ] } },

  { h: "Target leakage, the worst one" },
  { p: "You are predicting whether a customer will churn. Your dataset includes `cancellation_reason`. The model achieves 0.99." },
  { p: "Of course it does. That column is only populated **after** someone has churned. At prediction time — the moment you actually need an answer — it is empty for everyone. The model has learned to read the answer off a field that will not be there." },
  { p: "The test is a question you must ask of every single feature: **would I have this value, populated, at the moment I need to make the prediction?** If the honest answer is no or *not always*, drop it." },
  { ol: [
   "Predicting loan default with a `days_overdue` column — populated only after defaulting begins.",
   "Predicting a diagnosis with a `treatment_prescribed` column — the treatment follows the diagnosis.",
   "Predicting a purchase with `delivery_address_confirmed` — only exists after buying."
  ] },

  { h: "Contamination, the subtle one" },
  { p: "This one catches careful people, because the code looks obviously correct." },
  { vs: { t: "Scaling, before and after the split", lang: "python",
    bad: { label: "Leaks", c: "scaler = StandardScaler()\nX_all = scaler.fit_transform(X)          # sees everything\nXtr, Xte, ytr, yte = train_test_split(X_all, y)",
      w: "The scaler computed the mean and standard deviation using the test rows. Information about the test set is now baked into every training row." },
    good: { label: "Correct", c: "Xtr, Xte, ytr, yte = train_test_split(X, y)\nscaler = StandardScaler().fit(Xtr)      # training only\nXtr = scaler.transform(Xtr)\nXte = scaler.transform(Xte)             # applied, not refitted",
      w: "The scaler learns only from training data. The test set is transformed by it but never contributes to it." } } },
  { p: "The effect is small — often a fraction of a percent — which is exactly why it survives review. It matters because it is systematic, and because the same mistake with a target-encoded categorical feature is not small at all." },

  { h: "The structural fix" },
  { p: "Do not rely on remembering. Put every preprocessing step inside a `Pipeline`, and leakage of this kind becomes impossible to write." },
  { code: { lang: "python", t: "A pipeline cannot leak this way",
    lines: [
     { c: "from sklearn.pipeline import Pipeline", w: "" },
     { c: "", w: "" },
     { c: "pipe = Pipeline([", w: "" },
     { c: "    ('impute', SimpleImputer(strategy='median')),", w: "" },
     { c: "    ('scale', StandardScaler()),", w: "" },
     { c: "    ('model', LogisticRegression()),", w: "" },
     { c: "])", w: "" },
     { c: "", w: "" },
     { c: "scores = cross_val_score(pipe, X, y, cv=5)", w: "**Every fold refits every step from scratch** on that fold's training portion only. The correct thing happens automatically." }
    ] } },
  { n: "This is the real argument for pipelines, and it is not tidiness. A pipeline makes an entire category of silent bug unwritable. Whenever you can convert a discipline problem into a structural one, do it — you will not remember the discipline at 6 p.m. on a Friday.",
    nt: "Why pipelines exist" },

  { h: "Group leakage" },
  { p: "You have 50,000 medical images from 500 patients — a hundred each. A random split puts images of the same patient in both train and test. The model learns to recognise *patients*, not disease, and scores wonderfully on a test set full of people it has already seen." },
  { p: "Deployed on a new hospital's patients, it is worthless. The fix is to split by the group, never by the row." },
  { code: { lang: "python", t: "Splitting by group",
    lines: [
     { c: "from sklearn.model_selection import GroupKFold", w: "" },
     { c: "", w: "" },
     { c: "cv = GroupKFold(n_splits=5)", w: "" },
     { c: "scores = cross_val_score(pipe, X, y, groups=patient_ids, cv=cv)", w: "No patient can now appear in both sides of a fold." }
    ] } },
  { p: "The same applies to users, sessions, devices, shops and documents. Ask: **what is the unit I will be generalising to?** Split by that." },

  { tryit: { t: "Build a leak and measure it",
    task: "Create a dataset, add a feature that is a noisy copy of the target, and compare the cross-validated score with and without it.",
    hint: "`leaky = y + noise`. Score the model on the honest features, then on the honest features plus the leak.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(0)\nX, y = make_classification(n_samples=3000, n_features=10, n_informative=5, random_state=0)\n\nleak = y + rng.normal(0, 0.35, size=y.shape)      # a consequence of the target\nX_leaky = np.column_stack([X, leak])\n\npipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))\nprint('honest:', round(cross_val_score(pipe, X, y, cv=5).mean(), 3))\nprint('leaky: ', round(cross_val_score(pipe, X_leaky, y, cv=5).mean(), 3))" },
    w: "The leaky version approaches 1.0 and is completely worthless. Nothing in the code, the cross-validation or the metrics warns you — only asking what each column means does." } },

  { vocab: ["Data Leakage", "Cross-Validation", "Feature Scaling"] }
 ],
 k: [
  "Leakage is information at training time that will not exist at prediction time.",
  "An unexpectedly excellent score is evidence of a leak, not of success.",
  "Ask of every feature: would this be populated at the moment I predict?",
  "Fit preprocessing on training data only — use a Pipeline so it is structurally impossible to get wrong.",
  "Split by the unit you must generalise to: patient, user, shop, document."
 ],
 r: ["Data Leakage", "Cross-Validation", "Overfitting", "Feature Scaling"]
},

{
 t: "Imbalanced Data: When 99% Accuracy Is Worthless",
 m: "eval",
 lvl: "intermediate",
 s: "Fraud is 0.2% of transactions. A model that always says “not fraud” is 99.8% accurate and useless.",
 goal: [
  "Explain why accuracy fails on imbalanced problems",
  "Choose between resampling, class weights and threshold tuning",
  "Pick the metric that matches what the business actually loses"
 ],
 b: [
  { p: "Most problems worth solving are imbalanced. Fraud, disease, equipment failure, churn, click-through — the interesting class is rare, and that rarity is exactly why detecting it is valuable." },
  { p: "It also breaks the naive approach completely. With 0.2% fraud, a model that predicts *not fraud* for every transaction is **99.8% accurate** and catches nothing at all." },

  { h: "What to measure instead" },
  { tbl: { t: "Metrics for imbalanced problems",
    h: ["Metric", "Answers", "Use when"],
    rows: [
     ["**Precision**", "Of those I flagged, how many were real?", "False alarms are expensive — blocking good customers"],
     ["**Recall**", "Of the real ones, how many did I catch?", "Misses are expensive — undetected cancer, undetected fraud"],
     ["**F1**", "Harmonic mean of the two", "You need one number and both matter"],
     ["**PR-AUC**", "Precision–recall across all thresholds", "**The default for imbalanced problems**"],
     ["**ROC-AUC**", "Ranking quality across all thresholds", "Balanced data; misleadingly flattering when rare"]
    ] } },
  { trap: "ROC-AUC is the most over-used metric in imbalanced ML. It can sit at a comfortable 0.95 while precision at a usable threshold is 5%, because the false-positive *rate* stays small when negatives are enormously numerous — you can have thousands of false alarms and a rate that still looks tiny. **Use PR-AUC when the positive class is rare.** It is the one that reflects the experience of the person reviewing your alerts." },

  { h: "The three tools" },
  { p: "In the order you should try them." },
  { ol: [
   "**Class weights.** One argument, no data manipulation, no leakage risk. Try this first, always.",
   "**Threshold tuning.** Do not accept 0.5. Choose the threshold that optimises what you actually care about.",
   "**Resampling.** Change the data itself. Powerful, and the easiest of the three to get badly wrong."
  ] },

  { code: { lang: "python", t: "Class weights — start here",
    lines: [
     { c: "LogisticRegression(class_weight='balanced')", w: "Errors on the rare class are weighted more heavily, in proportion to its rarity." },
     { c: "RandomForestClassifier(class_weight='balanced')", w: "Same idea." },
     { c: "LGBMClassifier(scale_pos_weight=neg_count / pos_count)", w: "Boosting spells it differently but means the same thing." }
    ] } },

  { h: "Threshold tuning, which people forget entirely" },
  { p: "A classifier outputs a probability. Turning that into a decision requires a threshold, and 0.5 is a default, not an answer. It is almost never the right number for an imbalanced problem." },
  { code: { lang: "python", t: "Choosing the threshold on purpose",
    lines: [
     { c: "from sklearn.metrics import precision_recall_curve", w: "" },
     { c: "", w: "" },
     { c: "probs = model.predict_proba(X_val)[:, 1]", w: "" },
     { c: "prec, rec, thresh = precision_recall_curve(y_val, probs)", w: "" },
     { c: "", w: "" },
     { c: "# the cheapest threshold that still catches 90% of fraud", w: "" },
     { c: "i = np.argmax(rec >= 0.90)", w: "" },
     { c: "print(f'threshold {thresh[i]:.3f} -> precision {prec[i]:.3f}')", w: "Now you can tell the business exactly what it is buying and what it costs." }
    ] } },
  { n: "This is where ML meets the actual business, and it is the conversation that makes you useful rather than merely technical. *At this threshold we catch 90% of fraud and wrongly block 3% of good customers. At this one, 95% and 11%.* That is a decision the business must make — but only you can produce the options.",
    nt: "The most valuable conversation you will have" },

  { h: "Resampling, and its trap" },
  { p: "**SMOTE** creates synthetic minority examples by interpolating between real ones. It often helps. It also has a rule that people break constantly." },
  { trap: "**Resample only the training fold, never the validation or test set.** Resampling before splitting means synthetic points generated from test rows end up in training — a leak — and a test set that no longer reflects reality, since production will not be balanced. Use `imblearn.pipeline.Pipeline`, which applies resampling only to the training portion of each fold. The scikit-learn pipeline will not do this correctly." },
  { code: { lang: "python", t: "Resampling without leaking",
    lines: [
     { c: "from imblearn.pipeline import Pipeline as ImbPipeline", w: "**Note the import** — imblearn's pipeline, not sklearn's." },
     { c: "from imblearn.over_sampling import SMOTE", w: "" },
     { c: "", w: "" },
     { c: "pipe = ImbPipeline([", w: "" },
     { c: "    ('smote', SMOTE(random_state=0)),", w: "Applied to the training fold only, automatically." },
     { c: "    ('model', LGBMClassifier()),", w: "" },
     { c: "])", w: "" }
    ] } },

  { p: "In practice, class weights plus a properly chosen threshold solve most imbalance problems, and they are simpler and safer than resampling. Reach for SMOTE when the minority class is genuinely tiny — a few dozen examples — and even then, measure whether it helped." },

  { tryit: { t: "Show that accuracy lies",
    task: "Build a dataset with 1% positives. Report accuracy, precision, recall and PR-AUC for a model that always predicts the majority class, and for a real one.",
    hint: "`make_classification(weights=[0.99])`. Use `DummyClassifier(strategy='most_frequent')` for the useless model.",
    sol: { lang: "python", code: "from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score, precision_score, recall_score, average_precision_score\n\nX, y = make_classification(n_samples=20000, weights=[0.99], n_features=15,\n                           n_informative=6, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\n\nfor name, m in [('always-no', DummyClassifier(strategy='most_frequent')),\n                ('logistic', LogisticRegression(max_iter=2000, class_weight='balanced'))]:\n    m.fit(Xtr, ytr)\n    p = m.predict(Xte)\n    print(f'{name:10s} acc={accuracy_score(yte, p):.3f} '\n          f'prec={precision_score(yte, p, zero_division=0):.3f} '\n          f'rec={recall_score(yte, p):.3f}')" },
    w: "The useless model reports about 0.99 accuracy with zero recall. If you had shipped on accuracy alone you would have deployed a model that detects nothing, and the dashboard would have looked excellent." } },

  { vocab: ["Class Imbalance", "Precision", "Recall", "F1 Score"] }
 ],
 k: [
  "On imbalanced data, accuracy is meaningless — a constant prediction can score 99%.",
  "Use PR-AUC, not ROC-AUC, when the positive class is rare.",
  "Try class weights first, then tune the decision threshold, then consider resampling.",
  "0.5 is a default threshold, not a correct one. Choose it from the cost of each error type.",
  "Resample inside the training fold only, using imblearn's pipeline."
 ],
 r: ["Class Imbalance", "Precision", "Recall", "F1 Score", "ROC Curve"]
},

{
 t: "Cross-Validation Schemes That Do Not Lie",
 m: "fit",
 lvl: "intermediate",
 s: "A single train/test split is a coin flip. Choosing the wrong CV scheme is worse than none.",
 goal: [
  "Explain why k-fold beats a single split",
  "Choose the right scheme for grouped, time-ordered and imbalanced data",
  "Set up a nested CV when you are both tuning and estimating"
 ],
 b: [
  { p: "One train/test split gives one number, and that number depends on which rows happened to land where. Move the random seed and it changes — sometimes by several points. You cannot tell a real improvement from that noise." },
  { p: "**Cross-validation** splits the data k ways, trains k times, and reports the mean and spread. You get an estimate plus a sense of how much to trust it." },
  { code: { lang: "python", t: "The spread matters as much as the mean",
    lines: [
     { c: "scores = cross_val_score(pipe, X, y, cv=5, scoring='f1')", w: "" },
     { c: "print(f'{scores.mean():.3f} ± {scores.std():.3f}')", w: "**Always report both.** 0.82 ± 0.01 is a result; 0.82 ± 0.09 is a rumour." }
    ] } },
  { p: "If your improvement is 0.005 and your standard deviation is 0.03, you have not improved anything. This single habit prevents a great deal of self-deception." },

  { h: "Choosing the scheme" },
  { tbl: { t: "The scheme must match the structure of the data",
    h: ["Your data", "Use", "Because"],
    rows: [
     ["Ordinary, balanced", "`KFold(shuffle=True)`", "Plain and fine"],
     ["Imbalanced classes", "`StratifiedKFold`", "Keeps class proportions in every fold"],
     ["Repeated entities", "`GroupKFold`", "No entity in both sides of a fold"],
     ["Time-ordered", "`TimeSeriesSplit`", "Never train on the future"],
     ["Very small (< 500)", "`LeaveOneOut` or repeated k-fold", "Every row is precious"],
     ["Grouped *and* timed", "Custom split by group and date", "Both constraints apply at once"]
    ] } },
  { p: "`StratifiedKFold` is the default for classification in scikit-learn and it is the right one. With a rare class and plain `KFold`, a fold can end up containing none of it at all, which produces either a crash or a meaningless score." },

  { h: "Time series: the one people get wrong" },
  { p: "With time-ordered data, a random split trains on Thursday to predict Tuesday. The model learns from the future, scores beautifully, and fails the moment it faces a genuinely unknown tomorrow." },
  { code: { lang: "python", t: "Walk-forward validation",
    lines: [
     { c: "from sklearn.model_selection import TimeSeriesSplit", w: "" },
     { c: "", w: "" },
     { c: "cv = TimeSeriesSplit(n_splits=5)", w: "" },
     { c: "# fold 1: train [0:100]      test [100:200]", w: "" },
     { c: "# fold 2: train [0:200]      test [200:300]", w: "" },
     { c: "# fold 3: train [0:300]      test [300:400]", w: "Training always precedes testing. This mirrors reality." }
    ] } },
  { n: "Notice that the training set grows each fold and the folds are not independent. That is the price of honesty here — you cannot have both a realistic evaluation and equal-sized independent folds when time matters. Take the honesty.",
    nt: "Why the folds are uneven" },

  { h: "Nested CV: tuning and estimating at the same time" },
  { p: "Here is a subtle problem. You use cross-validation to choose hyperparameters, then report that cross-validated score as your estimate of performance. That number is optimistic — you selected the settings *because* they scored well on those folds." },
  { p: "The correct structure has two loops: an inner one that tunes, and an outer one that evaluates the whole tuning procedure." },
  { code: { lang: "python", t: "Nested cross-validation",
    lines: [
     { c: "inner = GridSearchCV(pipe, param_grid, cv=3, scoring='f1')", w: "Chooses hyperparameters." },
     { c: "scores = cross_val_score(inner, X, y, cv=5, scoring='f1')", w: "**Evaluates the search itself.** Each outer fold runs a complete inner search on data the outer test fold never saw." },
     { c: "print(f'honest estimate: {scores.mean():.3f}')", w: "" }
    ] } },
  { p: "It costs 15 model fits instead of 3, and it is the difference between an estimate and a hope. Use it when you are reporting a number someone will make a decision on." },
  { trap: "The single most common reporting error in applied ML is quoting the best `GridSearchCV` score as expected performance. That number has been optimised against those exact folds — it is a training score for the tuning procedure. Either use nested CV, or hold out a test set that the search never touches and report on that." },

  { tryit: { t: "Show how much a single split can lie",
    task: "Run the same model with ten different random train/test splits and report the range of scores. Then compare to a 10-fold cross-validated estimate.",
    hint: "Loop `random_state` from 0 to 9 in `train_test_split` and collect the scores.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nX, y = load_breast_cancer(return_X_y=True)\npipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=3000))\n\nsingle = []\nfor seed in range(10):\n    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=seed, stratify=y)\n    single.append(pipe.fit(Xtr, ytr).score(Xte, yte))\n\nprint(f'single splits: {min(single):.3f} to {max(single):.3f}')\ncv = cross_val_score(pipe, X, y, cv=10)\nprint(f'10-fold:       {cv.mean():.3f} ± {cv.std():.3f}')" },
    w: "The single splits typically span two to four points. If you tuned against one of them you were partly tuning against the seed." } },

  { vocab: ["Cross-Validation", "Hyperparameter Tuning", "Data Leakage"] }
 ],
 k: [
  "One split gives one noisy number; k-fold gives a mean and a spread. Report both.",
  "An improvement smaller than the fold standard deviation is not an improvement.",
  "Stratify for imbalance, group for repeated entities, TimeSeriesSplit for time.",
  "Never quote the best GridSearchCV score as expected performance — it is optimised against those folds.",
  "Nested CV gives an honest estimate of a tuned model."
 ],
 r: ["Cross-Validation", "Hyperparameter Tuning", "Data Leakage", "Overfitting"]
},

{
 t: "Explaining a Model to Someone Who Can Say No",
 m: "ship",
 lvl: "intermediate",
 s: "Accuracy gets you a prototype. Being able to explain a single prediction gets you deployed.",
 goal: [
  "Distinguish global from local explanations and know when each is required",
  "Use feature importance without the traps that make it misleading",
  "Read a SHAP plot and say what it does and does not prove"
 ],
 b: [
  { p: "Your model refuses someone's loan. They ask why. *A gradient-boosted ensemble assigned you a score of 0.31* is not an answer, and in many jurisdictions it is not a legal one either — under GDPR and equivalent rules, people have a right to meaningful information about automated decisions." },
  { p: "Interpretability is not a nice-to-have that researchers care about. It is frequently the thing standing between your model and production." },

  { h: "Two different questions" },
  { tbl: { t: "Global and local",
    h: ["", "Global", "Local"],
    rows: [
     ["**Question**", "What does this model rely on overall?", "Why *this* prediction?"],
     ["**Audience**", "You, your team, a regulator reviewing the system", "A customer, a doctor, a support agent"],
     ["**Tools**", "Feature importance, permutation importance", "SHAP, LIME, counterfactuals"],
     ["**Used for**", "Debugging, finding leaks, building trust", "Justifying a decision, appeals"]
    ] } },
  { p: "People conflate these constantly. Knowing that *income* is your most important feature overall says nothing about why one specific application was declined." },

  { h: "Feature importance, and why the default lies" },
  { p: "Tree models expose `.feature_importances_`, and it is misleading in a specific, well-known way: it is computed from how often a feature was split on during training, which **inflates high-cardinality features**. A column of random unique IDs will appear important, because there are so many places to split it." },
  { p: "**Permutation importance** is the honest version. Shuffle one column, see how much the score drops, and put it back. If shuffling changes nothing, the model was not really using it." },
  { code: { lang: "python", t: "The trustworthy version",
    lines: [
     { c: "from sklearn.inspection import permutation_importance", w: "" },
     { c: "", w: "" },
     { c: "r = permutation_importance(model, X_val, y_val,", w: "**On validation data**, not training — you want to know what matters for generalisation." },
     { c: "                           n_repeats=10, random_state=0)", w: "Repeat, because shuffling is random." },
     { c: "", w: "" },
     { c: "for i in r.importances_mean.argsort()[::-1][:10]:", w: "" },
     { c: "    print(f'{cols[i]:25s} {r.importances_mean[i]:.4f}')", w: "" }
    ] } },
  { trap: "Permutation importance is unreliable when features are strongly correlated. Shuffle `height_cm` while `height_inches` is still present and the score barely moves — the model just reads the other column — so both appear unimportant. Check correlations before trusting the ranking, and consider dropping duplicates first." },

  { h: "SHAP: per-prediction attribution" },
  { p: "SHAP answers the local question. For one prediction it distributes the difference between the model's average output and this particular output across the features, with a fairness property borrowed from game theory: each feature gets credit for its average marginal contribution across all orderings." },
  { code: { lang: "python", t: "Explaining one decision",
    lines: [
     { c: "import shap", w: "" },
     { c: "", w: "" },
     { c: "explainer = shap.TreeExplainer(model)", w: "Exact and fast for tree models." },
     { c: "sv = explainer.shap_values(X_val)", w: "" },
     { c: "", w: "" },
     { c: "shap.waterfall_plot(shap.Explanation(", w: "" },
     { c: "    values=sv[0], base_values=explainer.expected_value,", w: "" },
     { c: "    data=X_val.iloc[0], feature_names=cols))", w: "One chart, one customer: base rate, then each feature pushing the score up or down." }
    ] } },
  { p: "The output reads as a sentence: *the average applicant scores 0.30; your debt-to-income ratio of 0.61 added 0.22; your six-year credit history subtracted 0.08; your final score is 0.44.* That is something you can put in a letter." },

  { n: "**SHAP explains the model, not the world.** It tells you what the model used, not what causes the outcome. If your model learned a proxy for postcode and postcode correlates with ethnicity, SHAP will faithfully report that the model used it — which is exactly what makes it valuable for auditing. But never present a SHAP value as a causal claim.",
    nt: "The limit worth stating out loud" },

  { h: "The simplest option, which is often correct" },
  { p: "If explanation is a hard requirement, consider using a model that is inherently interpretable. Logistic regression gives you a coefficient per feature — a direct, defensible statement. A shallow decision tree can be printed as rules a person can read and check." },
  { p: "The usual argument is that this costs accuracy. Frequently it costs one or two points, and one or two points is a price many organisations will happily pay for a model they can defend in a meeting. Measure the gap before assuming it is too large." },

  { tryit: { t: "Find out whether your importance ranking is honest",
    task: "Train a model on a dataset with a duplicated feature. Compare the built-in feature importance ranking with permutation importance.",
    hint: "Add a copy of an important column. Watch how each method reacts to the duplication.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.model_selection import train_test_split\n\nX, y = load_breast_cancer(return_X_y=True)\nX = np.column_stack([X, X[:, 0]])          # duplicate the first feature\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\n\nm = RandomForestClassifier(n_estimators=300, random_state=0).fit(Xtr, ytr)\nr = permutation_importance(m, Xte, yte, n_repeats=10, random_state=0)\n\nprint('built-in  feature 0:', round(m.feature_importances_[0], 4),\n      ' copy:', round(m.feature_importances_[-1], 4))\nprint('permutation feature 0:', round(r.importances_mean[0], 4),\n      ' copy:', round(r.importances_mean[-1], 4))" },
    w: "Permutation importance reports both as near-zero, because shuffling one leaves the other intact. That is the correlation trap in action — and now you can recognise it in your own work." } },

  { vocab: ["Interpretability", "SHAP", "Feature Importance"] }
 ],
 k: [
  "Global explanations answer what the model relies on; local ones answer why this prediction.",
  "Built-in tree feature importance inflates high-cardinality columns; permutation importance on validation data is honest.",
  "Correlated features make permutation importance understate both — check correlations first.",
  "SHAP attributes one prediction across its features, and explains the model rather than the world.",
  "An interpretable model that costs one point of accuracy is often the correct engineering choice."
 ],
 r: ["Interpretability", "SHAP", "Feature Importance", "Logistic Regression"]
},

{
 t: "After Deployment: Drift, Monitoring and Retraining",
 m: "ship",
 lvl: "intermediate",
 s: "Your model's accuracy begins decaying the day it ships. Nothing alerts you unless you build the alert.",
 goal: [
  "Distinguish data drift from concept drift",
  "Monitor a model when labels arrive late or never",
  "Decide when to retrain and when the problem is something else"
 ],
 b: [
  { p: "A deployed model is not a finished artefact. It is a claim about the world that slowly stops being true." },
  { p: "The subtle horror is that a decaying model **does not error**. It returns confident predictions with the same latency and the same shape as always, and they get quietly worse. Without monitoring, you find out from a business metric months later, or from a customer complaint." },

  { h: "Two kinds of decay" },
  { tbl: { t: "Data drift and concept drift",
    h: ["", "Data drift", "Concept drift"],
    rows: [
     ["**What changed**", "The inputs", "The relationship between inputs and outcome"],
     ["**Example**", "Your users are now mostly mobile, not desktop", "What makes a transaction fraudulent has changed"],
     ["**Detect with**", "Compare input distributions — no labels needed", "Requires actual outcomes"],
     ["**Fix**", "Retrain on recent data", "Retrain, and possibly rethink the features entirely"]
    ] } },
  { p: "Data drift is detectable immediately and cheaply. Concept drift is the dangerous one, because detecting it needs ground truth — and ground truth often arrives weeks later, if at all." },

  { h: "Monitoring without labels" },
  { p: "For most production models, you do not learn the true answer for a long time. A loan's default status is known in two years. So you monitor proxies." },
  { ol: [
   "**Input distributions.** Has the mean or spread of each feature moved? A population stability index above ~0.2 is the usual alarm.",
   "**Prediction distribution.** If your model used to flag 2% and now flags 9%, something changed — even without knowing who was right.",
   "**Confidence.** A rise in predictions near the decision boundary means the model is meeting inputs it finds unfamiliar.",
   "**Missing and out-of-range values.** Often the first sign of an upstream pipeline change, which is more common than genuine drift.",
   "**Business metrics.** Ultimately the only ones that matter, and the slowest to move."
  ] },
  { code: { lang: "python", t: "The cheapest useful drift check",
    lines: [
     { c: "from scipy.stats import ks_2samp", w: "" },
     { c: "", w: "" },
     { c: "for col in feature_cols:", w: "" },
     { c: "    stat, p = ks_2samp(reference[col], current[col])", w: "Does this week's data look like the training data?" },
     { c: "    if p < 0.01:", w: "" },
     { c: "        print(f'DRIFT: {col} (p={p:.4f})')", w: "" }
    ] } },
  { trap: "With enough traffic, statistical drift tests fire constantly — at a million rows a week, a trivially small shift is statistically significant. Significance is not importance. Set thresholds on **effect size**, not p-values, and always ask whether the drift is large enough to change a decision before you act on it." },

  { h: "When to retrain" },
  { tbl: { t: "Three strategies",
    h: ["Strategy", "How", "Suits"],
    rows: [
     ["**Scheduled**", "Every week or month, regardless", "Steady drift; simple to operate and reason about"],
     ["**Triggered**", "When a drift or performance metric crosses a line", "Sudden shifts; needs reliable monitoring first"],
     ["**Continuous**", "Online learning from a stream", "Fast-moving domains; hardest to operate safely"]
    ] } },
  { p: "Scheduled retraining is the right default for most teams. It is predictable, testable, and does not depend on a monitoring system being correct. Move to triggered only once you trust your monitoring." },
  { n: "Retraining is not automatically safe. A model retrained on drifted data learns the drift — including any feedback loop it caused itself. A fraud model that blocks certain transactions never sees whether they were fraudulent, so its next training set is biased by its own decisions. Always evaluate a retrained model against a held-out recent period before promoting it, and keep the previous version ready to roll back to.",
    nt: "The retraining trap" },

  { h: "Before you blame the model" },
  { p: "Most *the model got worse* incidents are not the model. Check these first, in order:" },
  { ol: [
   "**Did the input pipeline change?** A renamed column, a unit changed from dollars to cents, a nullable field that started being null.",
   "**Is a feature stale?** A lookup table nobody has updated since launch is a very common and very silent failure.",
   "**Is training/serving skew present?** The classic: your training code computed a feature one way and your serving code computes it another. This is the number-one cause of production ML failure, and it is invisible in every offline metric.",
   "**Has the population genuinely changed?** Only now is drift the likely answer."
  ] },
  { p: "Training/serving skew is worth internalising, because it is the failure that fools everyone. Your offline evaluation is perfect. Your online performance is poor. The model is fine — it is being fed something subtly different from what it learned on, and nothing in your notebook can see that." },

  { tryit: { t: "Detect drift you introduced",
    task: "Split a dataset into a reference period and a current period, artificially shift one feature in the current period, and write a check that catches it.",
    hint: "Add a constant to one column in the second half, then run a KS test per column.",
    sol: { lang: "python", code: "import numpy as np\nfrom scipy.stats import ks_2samp\nfrom sklearn.datasets import make_classification\n\nX, _ = make_classification(n_samples=6000, n_features=6, random_state=0)\nref, cur = X[:3000], X[3000:].copy()\ncur[:, 2] += 0.8                      # feature 2 has shifted\n\nfor i in range(X.shape[1]):\n    stat, p = ks_2samp(ref[:, i], cur[:, i])\n    flag = 'DRIFT' if p < 0.01 else 'ok'\n    print(f'feature {i}: p={p:.5f}  {flag}')" },
    w: "Only feature 2 fires. Run this weekly against your training distribution and you will hear about problems before your users do." } },

  { vocab: ["Data Drift", "Concept Drift", "Model Drift"] }
 ],
 k: [
  "A decaying model does not error — it returns confident predictions that are quietly worse.",
  "Data drift is a change in inputs; concept drift is a change in the input-outcome relationship.",
  "Monitor input distributions, prediction rates and confidence when labels arrive late or never.",
  "Use effect size rather than p-values — at scale everything is statistically significant.",
  "Check pipeline changes, stale features and training/serving skew before blaming drift."
 ],
 r: ["Data Drift", "Concept Drift", "Model Drift", "MLOps"]
}

]);
