/* Machine Learning — the models worth knowing. */
TD.addLessons("ml", [

{
 t: "Linear and Logistic Regression",
 m: "models",
 lvl: "core",
 s: "The two models you should always try first, and the reason they are still everywhere.",
 goal: [
  "Explain what linear and logistic regression are actually fitting",
  "Read a coefficient and say what it means",
  "Know when a linear model is the right final answer, not just a baseline"
 ],
 b: [
  { p: "Linear models are two hundred years old, and they are still the correct answer to a surprising share of real problems. They train in milliseconds, they can be read by a human, they extrapolate sensibly, and they fail in ways you can see coming." },

  { h: "Linear regression" },
  { p: "Predict a number as a weighted sum of the features, plus a constant. That is the entire model." },

  { syn: { t: "The whole thing",
    parts: [
     { p: "ŷ", w: "The prediction. A number." },
     { p: " = " },
     { p: "w₁x₁ + w₂x₂ + … + wₙxₙ", w: "**Each feature times its weight.** The weights are what training finds." },
     { p: " + b", w: "The **bias** or intercept — the prediction when every feature is zero." }
    ],
    after: "Training means choosing the weights that minimise the squared error over your training data. There is a closed-form solution, which is why it is instant." } },

  { code: { lang: "python", t: "Fitting one, and reading it",
    lines: [
     { c: "from sklearn.linear_model import LinearRegression", w: "" },
     { c: "", w: "" },
     { c: "m = LinearRegression().fit(X_train, y_train)", w: "" },
     { c: "", w: "" },
     { c: "for name, w in zip(X.columns, m.coef_):", w: "" },
     { c: "    print(f'{name:<20} {w:+.2f}')", w: "**This is the model.** Every rule it learned, readable in five lines of output.", hi: true },
     { c: "print(f'{\"intercept\":<20} {m.intercept_:+.2f}')", w: "" }
    ],
    out: "sqft                 +2840.00\nbedrooms             -15200.00\nage_years             -8100.00\ndistance_km           -4300.00\nintercept           +1250000.00",
    after: "Read the second row: an extra bedroom *lowers* the price by ₹15,200. That is not nonsense — it is what happens when square footage is already in the model. Holding size fixed, more bedrooms means smaller ones. Coefficients are always *holding everything else constant*, and forgetting that clause is the most common misreading." } },

  { trap: "You cannot compare coefficient sizes unless the features are on the same scale. A weight of 2,840 on square feet and 15,200 on bedrooms does not mean bedrooms matter more — the units are different. Standardise the features first and then the coefficients become comparable, which is one of several reasons standardisation is routine." },

  { h: "Logistic regression, for classification" },
  { p: "Despite the name it is a classifier. It computes the same weighted sum, then squashes the result through a sigmoid so it lands between 0 and 1 and can be read as a probability." },

  { code: { lang: "python", t: "Same idea, one extra step",
    lines: [
     { c: "z = w @ x + b", w: "**Identical to linear regression.** Any real number, positive or negative." },
     { c: "p = 1 / (1 + np.exp(-z))", w: "**The sigmoid.** Maps (-∞, ∞) into (0, 1). Large positive z gives p near 1; large negative gives p near 0; z = 0 gives exactly 0.5.", hi: true },
     { c: "", w: "" },
     { c: "from sklearn.linear_model import LogisticRegression", w: "" },
     { c: "m = LogisticRegression(max_iter=1000).fit(X_train, y_train)", w: "**`max_iter=1000`** — the default 100 frequently fails to converge and warns about it. Set it and move on." },
     { c: "m.predict_proba(X_test)[:5, 1]", w: "Probability of the positive class." }
    ],
    out: "array([0.08, 0.71, 0.33, 0.94, 0.12])" } },

  { n: "Logistic regression is naturally well **calibrated** — its 0.7 predictions really are right about 70% of the time — because it is trained to optimise exactly that. Gradient boosting and neural networks are typically not, and need calibrating afterwards. If your product acts on the probability itself rather than on a ranking, this is a strong practical argument for logistic regression.",
    nt: "An underrated advantage" },

  { h: "Reading logistic coefficients" },
  { code: { lang: "python", t: "Coefficients as odds ratios",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "odds = np.exp(m.coef_[0])", w: "**Exponentiate to get odds ratios**, which is the only way these numbers are interpretable.", hi: true },
     { c: "for name, o in zip(X.columns, odds):", w: "" },
     { c: "    print(f'{name:<22} x{o:.2f}')", w: "" }
    ],
    out: "days_since_order       x2.41\nsupport_tickets        x1.88\nplan_is_annual         x0.34\ntotal_spend            x0.71",
    after: "Read it as: a one-unit increase in `days_since_order` multiplies the odds of churn by 2.41. An annual plan multiplies them by 0.34 — it cuts churn odds by roughly two-thirds. That sentence can be said in a business meeting and acted on, which is something no gradient boosting model will ever give you." } },

  { h: "When a linear model is the right answer" },
  { tbl: { t: "Not just a baseline",
    h: ["Situation", "Why linear wins"],
    rows: [
     ["**You must explain each decision**", "Credit, insurance, hiring, healthcare — often a legal requirement, and a coefficient table is an explanation"],
     ["**Very little data**", "Fewer parameters means less to overfit. Under a few thousand rows, linear frequently beats boosting"],
     ["**High-dimensional sparse data**", "Text as bag-of-words, with tens of thousands of columns. Linear models handle this well and fast"],
     ["**Latency matters enormously**", "A dot product. Microseconds, and trivial to implement anywhere including inside a database"],
     ["**You need calibrated probabilities**", "Logistic regression gives them by construction"],
     ["**The relationship really is roughly linear**", "Then a more complex model adds variance and buys nothing"]
    ] } },

  { p: "And where they lose: interactions and non-linearity. A linear model cannot learn *this feature matters only when that other one is high* unless you construct the interaction term by hand. Trees find those automatically, which is why they dominate on tabular data with rich structure." },

  { tryit: { t: "Read a model out loud",
    task: "Fit a logistic regression on any binary dataset. Standardise the features first. Print the coefficients as odds ratios, sorted, and write one plain-English sentence for the top three.",
    hint: "Standardise with `StandardScaler` inside a Pipeline, then reach the classifier with `pipe.named_steps['clf'].coef_`.",
    sol: { lang: "python", code: "import numpy as np, pandas as pd\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\npipe = Pipeline([\n    ('sc',  StandardScaler()),\n    ('clf', LogisticRegression(max_iter=1000)),\n]).fit(X_train, y_train)\n\ncoefs = pipe.named_steps['clf'].coef_[0]\nout = pd.Series(np.exp(coefs), index=X.columns).sort_values(ascending=False)\n\nprint(out.head(3))\nprint(out.tail(3))\n\n# 'One standard deviation more X multiplies the odds by N.'\n# Because features are standardised, these ARE comparable." },
    w: "Being able to say *one standard deviation more days-since-order roughly doubles the odds of churn* is worth more in most organisations than two points of AUC from a model nobody can explain. Interpretability is not a consolation prize; it is frequently the product requirement." } },

  { n: "**The assumption:** the relationship between the features and the target is a straight line (or, for logistic regression, a straight line in log-odds). **What breaks it:** genuine curvature, and interactions between features that you have not created columns for. **The tell:** residuals that show a pattern rather than looking like noise, and a tree-based model beating it by a wide margin on the same features.",
    nt: "Assumption, breakage, tell" },

  { vocab: ["Linear Regression", "Logistic Regression", "Sigmoid", "Regularisation"] }
 ],
 k: [
  "Linear regression is a weighted sum; logistic regression squashes that sum through a sigmoid into a probability.",
  "A coefficient means *holding everything else constant*, and is only comparable if features are standardised.",
  "Exponentiate logistic coefficients to read them as odds ratios, which is how you explain them to people.",
  "Logistic regression is naturally calibrated; boosting and neural networks are not.",
  "Linear models genuinely win on small data, sparse text, strict latency, and anywhere you must explain a decision."
 ],
 r: ["Linear Regression", "Logistic Regression", "Regularisation", "L1 and L2 Regularisation", "Feature Engineering"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "LinearRegression().fit(X_train, y_train)", w: "fit a weighted sum" },
   { c: "LogisticRegression(max_iter=1000)", w: "classification with calibrated probabilities" },
   { c: "np.exp(m.coef_[0])", w: "logistic coefficients as readable odds ratios" },
   { c: "m.predict_proba(X)[:, 1]", w: "probability of the positive class" }
  ]
 }
},

{
 t: "Trees, Forests and Gradient Boosting",
 m: "models",
 lvl: "core",
 s: "Why the model that wins most tabular problems is not a neural network.",
 goal: [
  "Explain how a decision tree splits and why one tree overfits",
  "Say what a random forest and a boosted ensemble each do differently",
  "Choose sensible starting hyperparameters for gradient boosting"
 ],
 b: [
  { p: "If you have a table of data and a prediction to make, the model most likely to win is gradient boosting. Not deep learning. This has been true for a decade, it remains true, and knowing it saves people months." },

  { h: "One tree" },
  { p: "A decision tree asks a series of yes/no questions about the features and follows the branches to a prediction. Training means choosing which question to ask at each node." },

  { code: { lang: "python", t: "A tree, printed",
    lines: [
     { c: "from sklearn.tree import DecisionTreeClassifier, export_text", w: "" },
     { c: "", w: "" },
     { c: "t = DecisionTreeClassifier(max_depth=3).fit(X_train, y_train)", w: "" },
     { c: "print(export_text(t, feature_names=list(X.columns)))", w: "**Fully readable.** This is the tree's entire logic.", hi: true }
    ],
    out: "|--- days_since_order <= 45.50\n|   |--- total_spend <= 1200.00\n|   |   |--- class: 1\n|   |--- total_spend >  1200.00\n|   |   |--- class: 0\n|--- days_since_order >  45.50\n|   |--- support_tickets <= 0.50\n|   |   |--- class: 0\n|   |--- support_tickets >  0.50\n|   |   |--- class: 1" } },

  { p: "The split is chosen greedily: at every node, try every threshold on every feature and keep the one that best separates the classes — measured by **Gini impurity** or entropy, which are two ways of asking *how mixed is this group?*" },

  { l: [
   "**Trees find interactions automatically.** The tree above learned that low spend matters only for recent customers. A linear model needs you to construct that term by hand.",
   "**Trees do not care about scale.** No standardisation needed. A split at 45.5 works the same whether the feature is in days or milliseconds.",
   "**Trees handle mixed types easily** and, in modern implementations, missing values natively.",
   "**One tree overfits badly.** Grown to full depth it memorises, exactly as you saw in the overfitting lesson."
  ] },

  { h: "Two ways to fix one tree" },
  { tbl: { t: "Bagging against boosting",
    h: ["", "Random Forest (bagging)", "Gradient Boosting"],
    rows: [
     ["**Idea**", "Train many trees on random subsets, in parallel, and average them", "Train trees **in sequence**, each one correcting the previous ones' mistakes"],
     ["**Each tree is**", "Deep and overfitted — but differently overfitted from its neighbours", "Shallow and weak, typically 3–8 levels"],
     ["**Reduces**", "**Variance.** Independent errors cancel when averaged", "**Bias.** Each round chips away at the remaining error"],
     ["**Overfits?**", "Very reluctantly. More trees is essentially always safe", "**Yes, readily.** Needs early stopping and a learning rate"],
     ["**Speed**", "Parallel, so fast to train", "Sequential, so slower — but modern implementations are heavily optimised"],
     ["**Typical accuracy**", "Good, and hard to get wrong", "**Usually the best available on tabular data**, with some tuning"]
    ] } },

  { ana: "A random forest is a committee of a hundred opinionated experts voting independently — each is wrong in their own way, and the errors cancel. Gradient boosting is an apprenticeship: each new student is taught specifically on the problems the previous ones got wrong. The committee is robust and hard to break; the apprenticeship reaches a higher ceiling and can go badly wrong if you let it run too long.",
    at: "The committee and the apprenticeship" },

  { code: { lang: "python", t: "Both, with sensible defaults",
    lines: [
     { c: "from sklearn.ensemble import RandomForestClassifier", w: "" },
     { c: "from sklearn.ensemble import HistGradientBoostingClassifier", w: "" },
     { c: "", w: "" },
     { c: "rf = RandomForestClassifier(", w: "" },
     { c: "    n_estimators=500,", w: "**More is safe.** Diminishing returns, not overfitting." },
     { c: "    min_samples_leaf=5,", w: "Stop splitting when a leaf gets small. The main brake on memorisation." },
     { c: "    n_jobs=-1, random_state=42).fit(X_tr, y_tr)", w: "**`n_jobs=-1` uses every core.** Bagging is embarrassingly parallel." },
     { c: "", w: "" },
     { c: "gb = HistGradientBoostingClassifier(", w: "**`Hist` is the fast histogram-based version.** Use it, not the old `GradientBoostingClassifier`." },
     { c: "    learning_rate=0.05,", w: "**Lower is better and slower.** 0.05 with early stopping is a good default." },
     { c: "    max_iter=1000,", w: "A ceiling, not a target — early stopping decides the real number." },
     { c: "    early_stopping=True, validation_fraction=0.1,", w: "**Holds out 10% and stops when it stops improving.** This is what keeps boosting honest.", hi: true },
     { c: "    random_state=42).fit(X_tr, y_tr)", w: "" }
    ] } },

  { h: "The four hyperparameters that matter" },
  { tbl: { t: "Tuning boosting, in priority order",
    h: ["Parameter", "Effect", "Where to start"],
    rows: [
     ["**learning_rate**", "How much each tree contributes. Lower means more trees but better results", "0.05, with early stopping. Drop to 0.01 if you have time"],
     ["**max_depth / max_leaf_nodes**", "Capacity per tree. Higher captures more interaction and overfits faster", "depth 4–8, or 31 leaves. Rarely needs more"],
     ["**n_estimators / max_iter**", "How many rounds", "Set it high and let early stopping choose"],
     ["**min_samples_leaf**", "Minimum rows per leaf. The main anti-memorisation brake", "20 for large data, 5 for small"]
    ] } },

  { n: "Tune the learning rate and depth. Leave everything else. Hyperparameter tuning on tabular data is typically worth one or two points, while a good new feature is worth five or ten — so if your time is limited, and it is, spend it on features. People do the opposite because tuning is easy to automate and features require thinking about the domain.",
    nt: "Where to spend your time" },

  { h: "XGBoost, LightGBM, CatBoost" },
  { p: "Three widely used implementations of the same idea. In practice their accuracy is close and the differences are practical rather than fundamental." },
  { l: [
   "**LightGBM** — usually the fastest, excellent on large data. The default choice for many practitioners.",
   "**XGBoost** — the most established, best documented, huge community. If you are learning one, this is a fine one to learn.",
   "**CatBoost** — handles categorical features natively and well, which saves real preprocessing effort when you have many high-cardinality categories.",
   "**scikit-learn's `HistGradientBoosting`** — no extra dependency, genuinely competitive, and the right starting point for most projects."
  ] },

  { h: "Feature importance, carefully" },
  { code: { lang: "python", t: "Permutation importance, which is the trustworthy one",
    lines: [
     { c: "from sklearn.inspection import permutation_importance", w: "" },
     { c: "", w: "" },
     { c: "r = permutation_importance(gb, X_val, y_val, n_repeats=10, random_state=0)", w: "**Shuffle one column and see how much the score drops.** Measured on validation data, so it reflects generalisation rather than training fit.", hi: true },
     { c: "", w: "" },
     { c: "pd.Series(r.importances_mean, index=X.columns).sort_values(ascending=False)", w: "" }
    ],
    after: "Built-in `feature_importances_` is computed on the training data and is biased towards high-cardinality features — it will over-credit a column with many distinct values even when it carries no real signal. Permutation importance on the validation set is slower and much more trustworthy. Use it when the answer matters." } },

  { trap: "Feature importance does not mean causation, and stakeholders will hear it that way every time. *Support tickets are the top predictor of churn* becomes *reduce support tickets to reduce churn* in the retelling, which is precisely backwards — the tickets are a symptom. Say *predictive of*, never *causes*, and say it repeatedly." },

  { tryit: { t: "Race four models",
    task: "On one dataset, fit a dummy baseline, logistic regression, random forest and histogram gradient boosting. Report cross-validated scores with their spreads. Then compare training times.",
    hint: "Use `cross_val_score` for each and `time.perf_counter()` around the fits. Report mean ± std so you can see whether the gaps are real.",
    sol: { lang: "python", code: "import time\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier\nfrom sklearn.model_selection import cross_val_score\n\nmodels = {\n    'dummy':    DummyClassifier(strategy='most_frequent'),\n    'logistic': make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),\n    'forest':   RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=0),\n    'boosting': HistGradientBoostingClassifier(learning_rate=0.05, random_state=0),\n}\n\nfor name, m in models.items():\n    t0 = time.perf_counter()\n    s = cross_val_score(m, X, y, cv=5, scoring='roc_auc')\n    print(f'{name:<10} {s.mean():.3f} +/- {s.std():.3f}   ({time.perf_counter()-t0:.1f}s)')" },
    w: "Two things usually surprise people. First, logistic regression is often within a couple of points of boosting and trains a hundred times faster — which on a latency-critical path or a small dataset makes it the correct choice. Second, the standard deviations frequently overlap, meaning the ranking you just produced is partly noise. Both facts are worth carrying into every model comparison you ever run." } },

  { n: "**The assumption:** the target can be predicted by splitting the feature space into rectangular boxes. **What breaks it:** smooth linear trends, which trees approximate as a staircase, and extrapolation — a tree can never predict outside the range of values it saw in training. **The tell:** a model that flattens at the edges of your data, or that a plain linear regression beats on a clearly linear relationship.",
    nt: "Assumption, breakage, tell" },

  { vocab: ["Decision Tree", "Random Forest", "Gradient Boosting", "XGBoost", "Ensemble Learning", "Feature Importance"] }
 ],
 k: [
  "Gradient boosting is the strongest default for tabular data, and has been for a decade.",
  "One tree overfits; a forest averages many overfitted trees, boosting trains weak trees in sequence to fix errors.",
  "Forests reduce variance and rarely overfit; boosting reduces bias and needs early stopping.",
  "Tune learning rate and depth only, and spend the rest of your time on features.",
  "Prefer permutation importance on validation data, and never let importance be reported as causation."
 ],
 r: ["Decision Tree", "Random Forest", "Gradient Boosting", "XGBoost", "Ensemble Learning", "Feature Importance", "Overfitting"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "HistGradientBoostingClassifier(learning_rate=0.05, early_stopping=True)", w: "the strong default for tabular data" },
   { c: "RandomForestClassifier(n_estimators=500, n_jobs=-1)", w: "a robust ensemble that rarely overfits" },
   { c: "export_text(tree, feature_names=list(X.columns))", w: "print a tree's actual logic" },
   { c: "permutation_importance(model, X_val, y_val, n_repeats=10)", w: "trustworthy importance, measured on held-out data" }
  ]
 }
}

]);
