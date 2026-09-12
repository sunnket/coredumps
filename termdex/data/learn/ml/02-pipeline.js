/* Machine Learning — the supervised pipeline. */
TD.addLessons("ml", [

{
 t: "The Split Is the Most Important Line of Code",
 m: "pipeline",
 lvl: "core",
 s: "Train, validation, test — and why getting this wrong invalidates everything after it.",
 goal: [
  "Explain why a model must be scored on data it has never seen",
  "Use three splits correctly, and say what each one is for",
  "Choose the right split strategy for time series and grouped data"
 ],
 b: [
  { p: "There is one line in a machine learning project that, if wrong, makes every number after it meaningless. It is not the model. It is the split." },

  { h: "Why you cannot score on training data" },
  { code: { lang: "python", t: "A model that is perfect and useless",
    lines: [
     { c: "from sklearn.neighbors import KNeighborsClassifier", w: "" },
     { c: "", w: "" },
     { c: "model = KNeighborsClassifier(n_neighbors=1)", w: "**1-nearest-neighbour**: for any input, find the single closest training example and copy its label." },
     { c: "model.fit(X_train, y_train)", w: "" },
     { c: "", w: "" },
     { c: "model.score(X_train, y_train)", w: "**1.0. Perfect.** And entirely meaningless — for every training point, the nearest neighbour is itself.", hi: true },
     { c: "model.score(X_test, y_test)", w: "0.71. **This is the real number.**" }
    ],
    out: "1.0\n0.712",
    after: "The model memorised. Memorising is not learning, and the only way to tell them apart is to ask about something it has not seen." } },

  { ana: "Give a student the exam paper with the answers to revise from, then set that exact paper as the exam. Everyone scores 100%. You have measured nothing about whether anyone understands the subject, and you will find out the truth when they meet a different paper — which, in production, is every single request.",
    at: "The exam you already have the answers to" },

  { h: "Three splits, three jobs" },
  { tbl: { t: "What each split is for",
    h: ["Split", "Typical size", "What it does", "How often you touch it"],
    rows: [
     ["**Training**", "60–80%", "The model learns from it", "Constantly"],
     ["**Validation**", "10–20%", "**You** learn from it — choosing models, tuning hyperparameters, deciding when to stop", "Hundreds of times"],
     ["**Test**", "10–20%", "The final, honest estimate of real-world performance", "**Once.** Ideally at the very end, and never again"]
    ] } },

  { p: "The two-split version — train and test only — is what most tutorials show, and it is subtly broken the moment you tune anything. If you try forty configurations and pick the one that scores best on the test set, you have used the test set to make a choice, which means it is no longer unseen data. Its score is now optimistically biased, exactly like the multiple-comparisons problem from the statistics track." },

  { code: { lang: "python", t: "Three splits, done correctly",
    lines: [
     { c: "from sklearn.model_selection import train_test_split", w: "" },
     { c: "", w: "" },
     { c: "X_temp, X_test, y_temp, y_test = train_test_split(", w: "" },
     { c: "    X, y, test_size=0.2, random_state=42, stratify=y)", w: "**Carve off the test set first, and then forget it exists.** `random_state` makes it reproducible.", hi: true },
     { c: "", w: "" },
     { c: "X_train, X_val, y_train, y_val = train_test_split(", w: "" },
     { c: "    X_temp, y_temp, test_size=0.25, random_state=42, stratify=y_temp)", w: "0.25 of the remaining 80% is 20% of the whole. Now 60/20/20." },
     { c: "", w: "" },
     { c: "len(X_train), len(X_val), len(X_test)", w: "" }
    ],
    out: "(6000, 2000, 2000)" } },

  { n: "`stratify=y` keeps the class proportions identical in every split. Without it, a random split of an imbalanced dataset can easily land 3% positives in train and 1% in test, and your metrics become incomparable for a reason that has nothing to do with the model. Always stratify on the label for classification. It is one keyword and it prevents a genuinely confusing class of bug.",
    nt: "The keyword to never omit" },

  { h: "Cross-validation, when data is scarce" },
  { p: "With only a few thousand rows, a single validation split is small enough that its score is mostly noise. **K-fold cross-validation** solves this: split into k parts, train k times, each time holding out a different part, and average." },

  { code: { lang: "python", t: "Five folds, five scores, one honest average",
    lines: [
     { c: "from sklearn.model_selection import cross_val_score", w: "" },
     { c: "", w: "" },
     { c: "scores = cross_val_score(model, X_temp, y_temp, cv=5, scoring='f1')", w: "Trains five times. Every row is used for validation exactly once.", hi: true },
     { c: "", w: "" },
     { c: "print(f'{scores.mean():.3f} +/- {scores.std():.3f}')", w: "**Report both.** The spread across folds is as informative as the average — a large spread means your estimate is unstable and small improvements are not real." }
    ],
    out: "0.734 +/- 0.041",
    after: "0.734 ± 0.041 means a rival at 0.75 is well inside the noise. That spread is the cheapest honesty check available and it costs one extra argument." } },

  { h: "When a random split is wrong" },
  { p: "`train_test_split` shuffles by default, and for a large class of real problems shuffling is a bug that produces excellent scores and a model that fails in production." },

  { tbl: { t: "Three cases where random splitting leaks",
    h: ["Data", "Why shuffling breaks it", "What to do instead"],
    rows: [
     ["**Time series**", "You train on Friday and test on Wednesday. **The model sees the future**, which it never will in production", "Split by date. Train on everything before a cutoff, test after it"],
     ["**Grouped rows**", "Ten rows per customer, split randomly — the same customer appears in train and test", "**GroupKFold** on customer id. Split by the entity, not the row"],
     ["**Near-duplicates**", "The same article scraped twice, one copy in each split", "Deduplicate first, then split. Check with a similarity threshold, not exact equality"]
    ] } },

  { code: { lang: "python", t: "The two splits that are not a random split",
    lines: [
     { c: "# time series: split on the clock, never on chance", w: "" },
     { c: "cutoff = '2025-10-01'", w: "" },
     { c: "train = df[df.date <  cutoff]", w: "" },
     { c: "test  = df[df.date >= cutoff]", w: "**This is how the model will actually be used**: trained on the past, applied to the future.", hi: true },
     { c: "", w: "" },
     { c: "# grouped data: split on the entity", w: "" },
     { c: "from sklearn.model_selection import GroupKFold", w: "" },
     { c: "gkf = GroupKFold(n_splits=5)", w: "" },
     { c: "for tr, va in gkf.split(X, y, groups=df.customer_id):", w: "**No customer appears in both sides of any fold.**", hi: true },
     { c: "    ...", w: "" }
    ] } },

  { trap: "A random split on time series data is the single most common way a beginner produces a model with 94% accuracy that loses money in production. It scores brilliantly because tomorrow's price is trivially predictable when you have already seen next week's. The tell is a score that seems too good for the problem — and *too good* is a signal to investigate, never to celebrate." },

  { h: "The full loop" },
  { ol: [
   "**Split first**, before you look at anything or compute any statistic.",
   "**Explore only the training set.** Looking at the test set — even just plotting it — leaks information through your own decisions.",
   "**Fit preprocessing on train only.** A scaler fitted on all the data has seen the test set's mean. This is subtle, common and real.",
   "**Train, evaluate on validation, adjust.** Loop here as many times as you like.",
   "**When you are genuinely finished, score once on test.** Report that number.",
   "**If the test score disappoints, resist re-tuning.** The moment you tune against test, it becomes another validation set and you have no honest estimate left."
  ] },

  { code: { lang: "python", t: "The leak everyone ships at least once",
    lines: [
     { c: "# WRONG", w: "" },
     { c: "X_scaled = StandardScaler().fit_transform(X)", w: "**Fitted on everything, including test.** The scaler now encodes the test set's mean and standard deviation." },
     { c: "X_train, X_test = train_test_split(X_scaled)", w: "Too late — the leak already happened." },
     { c: "", w: "" },
     { c: "# RIGHT", w: "" },
     { c: "X_train, X_test = train_test_split(X)", w: "Split first." },
     { c: "scaler = StandardScaler().fit(X_train)", w: "**Learn the statistics from training data only.**", hi: true },
     { c: "X_train = scaler.transform(X_train)", w: "" },
     { c: "X_test  = scaler.transform(X_test)", w: "**Apply, do not re-fit.** This mirrors production, where you scale new data using statistics you learned in the past." }
    ],
    after: "This leak is small — usually worth a fraction of a percent — which is exactly why it survives review. Use `sklearn.pipeline.Pipeline` and it becomes structurally impossible, which is the better fix." } },

  { tryit: { t: "Build the leak, then measure it",
    task: "Generate a small dataset where the target depends on time. Score a model twice: once with a random split, once with a chronological split. Compare.",
    hint: "Make y depend on a slow trend plus noise — for example `y = (index/n + noise) > 0.5`. A random split lets the model interpolate; a time split does not.",
    sol: { lang: "python", code: "import numpy as np, pandas as pd\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(0)\nn = 2000\nt = np.arange(n)\n\n# target drifts slowly over time plus noise\nsignal = t / n + rng.normal(0, 0.15, n)\ny = (signal > 0.5).astype(int)\nX = pd.DataFrame({'t': t, 'noise': rng.normal(size=n)})\n\n# 1. random split -- the model can interpolate around each test point\nXr_tr, Xr_te, yr_tr, yr_te = train_test_split(X, y, test_size=0.3, random_state=0)\nm1 = RandomForestClassifier(random_state=0).fit(Xr_tr, yr_tr)\nprint(f'random split : {m1.score(Xr_te, yr_te):.3f}')\n\n# 2. chronological split -- the model must extrapolate, as in production\ncut = int(n * 0.7)\nm2 = RandomForestClassifier(random_state=0).fit(X[:cut], y[:cut])\nprint(f'time split   : {m2.score(X[cut:], y[cut:]):.3f}')" },
    w: "The random split scores far higher, and every point of that difference is fictional. The model was surrounded by neighbouring time points from the same period on both sides; in production it will only ever have the past. The time split is the number to believe, and it is the number to put on the slide." } },

  { vocab: ["Training Data", "Cross-Validation", "Data Leakage"] }
 ],
 k: [
  "Score only on data the model has not seen; training accuracy measures memorisation.",
  "Train to learn, validation to choose, test once at the very end to report.",
  "Always `stratify=y` for classification, or your splits will have different class balances.",
  "Random splits leak on time series, grouped rows and near-duplicates — split by date or by entity.",
  "Fit preprocessing on the training set only, and use a Pipeline so you cannot forget."
 ],
 r: ["Training Data", "Cross-Validation", "Data Leakage", "Overfitting"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)", w: "a reproducible, class-balanced split" },
   { c: "cross_val_score(model, X, y, cv=5, scoring='f1')", w: "five folds, five scores — report the spread too" },
   { c: "scaler = StandardScaler().fit(X_train)", w: "fit preprocessing on training data only" },
   { c: "train = df[df.date < cutoff]", w: "a chronological split, the only correct one for time series" },
   { c: "GroupKFold(n_splits=5).split(X, y, groups=ids)", w: "keep one entity's rows on one side of the split" }
  ]
 }
},

{
 t: "Your First Model, End to End",
 m: "pipeline",
 lvl: "core",
 s: "Baseline, model, evaluation — the loop, in about thirty lines.",
 goal: [
  "Build a baseline before building a model, and know why",
  "Run the full scikit-learn loop with a Pipeline",
  "Interpret the first result honestly rather than optimistically"
 ],
 b: [
  { p: "The modelling part of machine learning is genuinely small. Here is a complete, correct project — and then the reasons each line is there, which is the part that takes years." },

  { h: "Start with a baseline you cannot beat by accident" },
  { p: "Before any model, establish what *doing nothing intelligent* scores. Without it you have no idea whether 84% is excellent or embarrassing." },

  { code: { lang: "python", t: "The baseline that reframes every result",
    lines: [
     { c: "from sklearn.dummy import DummyClassifier", w: "" },
     { c: "", w: "" },
     { c: "dummy = DummyClassifier(strategy='most_frequent')", w: "**Always predict the commonest class.** No features, no learning." },
     { c: "dummy.fit(X_train, y_train)", w: "" },
     { c: "dummy.score(X_test, y_test)", w: "**0.82.** On an imbalanced dataset, doing nothing scores 82%.", hi: true }
    ],
    out: "0.82",
    after: "Now an 84% model is visibly worth two points over nothing, not *84% accurate*. That reframing prevents a great many misleading slides, and it takes three lines." } },

  { n: "Also worth building: a **rules baseline**. Three if-statements written by someone who knows the domain often score surprisingly well, and if your model cannot beat them, the honest recommendation is to ship the rules. That is a real outcome, it happens, and being the person willing to say it builds enormous credibility.",
    nt: "The second baseline" },

  { h: "The whole project" },
  { code: { lang: "python", file: "train.py", t: "A complete, correct supervised pipeline",
    lines: [
     { c: "import pandas as pd", w: "" },
     { c: "from sklearn.model_selection import train_test_split, cross_val_score", w: "" },
     { c: "from sklearn.pipeline import Pipeline", w: "" },
     { c: "from sklearn.compose import ColumnTransformer", w: "" },
     { c: "from sklearn.preprocessing import StandardScaler, OneHotEncoder", w: "" },
     { c: "from sklearn.impute import SimpleImputer", w: "" },
     { c: "from sklearn.ensemble import HistGradientBoostingClassifier", w: "" },
     { c: "from sklearn.metrics import classification_report", w: "" },
     { c: "", w: "" },
     { c: "df = pd.read_csv('customers.csv')", w: "" },
     { c: "y = df['churned']", w: "" },
     { c: "X = df.drop(columns=['churned', 'customer_id'])", w: "**Drop the ID** — no signal, and the model will memorise it." },
     { c: "", w: "" },
     { c: "X_tr, X_te, y_tr, y_te = train_test_split(", w: "" },
     { c: "    X, y, test_size=0.2, stratify=y, random_state=42)", w: "**Split before anything else touches the data.**", hi: true },
     { c: "", w: "" },
     { c: "num = X.select_dtypes('number').columns", w: "" },
     { c: "cat = X.select_dtypes('object').columns", w: "Numeric and categorical columns need different treatment." },
     { c: "", w: "" },
     { c: "prep = ColumnTransformer([", w: "" },
     { c: "    ('num', Pipeline([('imp', SimpleImputer(strategy='median')),", w: "**Median, not mean** — robust to the outliers real data always has." },
     { c: "                      ('sc',  StandardScaler())]), num),", w: "" },
     { c: "    ('cat', OneHotEncoder(handle_unknown='ignore'), cat),", w: "**`handle_unknown='ignore'`** — production will send categories the training data never contained, and without this the whole request errors.", hi: true },
     { c: "])", w: "" },
     { c: "", w: "" },
     { c: "model = Pipeline([", w: "" },
     { c: "    ('prep', prep),", w: "" },
     { c: "    ('clf', HistGradientBoostingClassifier(random_state=42)),", w: "**Gradient boosting is the right default for tabular data.** Not a neural network." },
     { c: "])", w: "" },
     { c: "", w: "" },
     { c: "scores = cross_val_score(model, X_tr, y_tr, cv=5, scoring='f1')", w: "**Cross-validate on training data.** Test is still untouched.", hi: true },
     { c: "print(f'cv f1: {scores.mean():.3f} +/- {scores.std():.3f}')", w: "" },
     { c: "", w: "" },
     { c: "model.fit(X_tr, y_tr)", w: "Fit on all the training data once you are satisfied." },
     { c: "print(classification_report(y_te, model.predict(X_te)))", w: "**The single, final look at the test set.**", hi: true }
    ],
    out: "cv f1: 0.641 +/- 0.028\n\n              precision    recall  f1-score   support\n\n           0       0.91      0.95      0.93      1640\n           1       0.69      0.55      0.61       360\n\n    accuracy                           0.88      2000" } },

  { h: "Why the Pipeline object, specifically" },
  { p: "Wrapping preprocessing and model together is not tidiness. It is the structural fix for the leak from the previous lesson, and it removes an entire class of bug." },
  { l: [
   "**Cross-validation becomes correct automatically.** Inside each fold, the scaler and encoder are fitted on that fold's training portion only. Doing this by hand correctly is fiddly, and almost everyone gets it wrong at least once.",
   "**Serving becomes one object.** `joblib.dump(model, 'model.pkl')` saves the preprocessing with the model, so production cannot apply a different transformation from training — a genuinely common and painful production bug.",
   "**New raw data just works.** `model.predict(raw_df)` handles imputation, scaling and encoding in the right order every time."
  ] },

  { h: "Reading that output honestly" },
  { p: "The report says 88% accuracy, which sounds good, and the interesting numbers are elsewhere." },
  { l: [
   "**Class 1 recall is 0.55.** The model misses nearly half the customers who actually churn. If the purpose is to intervene before they leave, that is the number the business cares about — and it is not the one on the summary line.",
   "**Class 1 precision is 0.69.** Of those it flags, roughly a third are fine. Whether that is acceptable depends entirely on what the intervention costs.",
   "**Accuracy of 0.88 against a base rate of 0.82** is six points over doing nothing. Real, but far less impressive than 88% sounds.",
   "**The gap between the classes** is the whole story, and it is invisible if you only print `model.score()`."
  ] },

  { trap: "Never report a single accuracy number for an imbalanced problem. Print the full `classification_report` and read the minority class row, because the minority class is nearly always the one you built the model for. A stakeholder who hears *88% accurate* and later learns the model misses half the churners will not remember that you were technically correct." },

  { h: "What to do next, in order" },
  { ol: [
   "**Look at the errors.** Pull thirty misclassified rows and read them. This tells you what to fix; the metrics only told you that something needs fixing.",
   "**Try better features.** Almost always a bigger win than a better model. The features module covers this.",
   "**Then tune hyperparameters.** Usually worth a point or two. Do it last, because it is the lowest-yield step and the most seductive.",
   "**Only then consider a different model class.** On tabular data the answer is usually still gradient boosting."
  ] },

  { tryit: { t: "Run the loop yourself",
    task: "Load any classification dataset you have — or `sklearn.datasets.fetch_openml('adult')` if you have none. Build a dummy baseline, then the pipeline above. Report both, plus the class balance. Then pull ten misclassified rows and read them.",
    hint: "`model.predict(X_te) != y_te` gives you a boolean mask of the errors; index the original dataframe with it.",
    sol: { lang: "python", code: "from sklearn.datasets import fetch_openml\nfrom sklearn.dummy import DummyClassifier\n\nd = fetch_openml('adult', version=2, as_frame=True)\nX, y = d.data, (d.target == '>50K').astype(int)\n\nX_tr, X_te, y_tr, y_te = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42)\n\nprint('class balance :', y.mean().round(3))\n\nbase = DummyClassifier(strategy='most_frequent').fit(X_tr, y_tr)\nprint('baseline acc  :', base.score(X_te, y_te).round(3))\n\n# ... build the pipeline from the lesson, then:\nmodel.fit(X_tr, y_tr)\nprint(classification_report(y_te, model.predict(X_te)))\n\n# read the errors -- the step almost nobody does\nwrong = model.predict(X_te) != y_te\nprint(X_te[wrong].head(10))\nprint('errors:', wrong.sum(), 'of', len(y_te))" },
    w: "Reading ten errors will teach you more about what to build next than another hour of hyperparameter tuning. You will typically find that the mistakes cluster — one occupation, one age band, one missing field — and that cluster is a feature waiting to be built." } },

  { vocab: ["Baseline Model", "Pipeline", "Cross-Validation", "Gradient Boosting", "One-Hot Encoding"] }
 ],
 k: [
  "Build a dummy baseline and a rules baseline before any model, so you know what your score means.",
  "Wrap preprocessing and model in a Pipeline — it makes cross-validation correct and serving safe.",
  "Use `handle_unknown='ignore'` on encoders, because production will send unseen categories.",
  "Read the per-class report, not the accuracy line; the minority class is why the model exists.",
  "After the first result: read errors, then improve features, then tune, then change model — in that order."
 ],
 r: ["Gradient Boosting", "Cross-Validation", "One-Hot Encoding", "Feature Engineering", "Overfitting"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "DummyClassifier(strategy='most_frequent')", w: "the baseline that reframes every later result" },
   { c: "Pipeline([('prep', prep), ('clf', model)])", w: "preprocessing and model as one object" },
   { c: "OneHotEncoder(handle_unknown='ignore')", w: "survive categories that were not in training" },
   { c: "SimpleImputer(strategy='median')", w: "fill missing numbers robustly" },
   { c: "classification_report(y_te, preds)", w: "per-class precision, recall and f1 — never just accuracy" }
  ]
 }
}

]);
