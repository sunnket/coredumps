/* Machine Learning — the algorithms, taught as a family with a decision rule.

   The track had two lessons of models: linear/logistic, and trees/forests/
   boosting. That is enough to pass an exam and not enough to work, because
   the questions that actually come up are "why is my SVM slow on 100k rows",
   "when is Naive Bayes still the right answer" and "how do I choose".

   The organising idea here is that a model is a *shape of assumption*, not a
   button. Linear models assume a straight relationship. kNN assumes nearby
   points are similar. Trees assume the world splits into boxes. Naive Bayes
   assumes features are independent, which is false and works anyway. Once a
   reader can name the assumption, choosing stops being folklore and the
   failure modes stop being surprises.

   Each lesson therefore ends the same way: the assumption, what breaks it,
   and the one line that tells you it broke. */
TD.addLessons("ml", [

{
 t: "k-Nearest Neighbours: Learning by Looking Things Up",
 m: "models",
 lvl: "core",
 s: "The simplest possible model, and a surprisingly good baseline you should always try.",
 goal: [
  "Explain how kNN makes a prediction without any training",
  "Say why scaling features is mandatory rather than optional here",
  "Describe why kNN collapses in high dimensions"
 ],
 b: [
  { p: "Most models compress a dataset into parameters. **k-Nearest Neighbours does not train at all.** It memorises the training set, and when asked about a new point it finds the *k* closest examples it has seen and takes a vote." },
  { p: "That is the entire algorithm. It is worth knowing precisely because it is the floor: if your elaborate gradient-boosted model cannot beat kNN, something is wrong with your elaborate model." },

  { code: { lang: "python", t: "The whole thing",
    lines: [
     { c: "from sklearn.neighbors import KNeighborsClassifier", w: "" },
     { c: "from sklearn.preprocessing import StandardScaler", w: "" },
     { c: "from sklearn.pipeline import make_pipeline", w: "" },
     { c: "", w: "" },
     { c: "model = make_pipeline(", w: "" },
     { c: "    StandardScaler(),", w: "**Not optional.** The reason is two paragraphs down." },
     { c: "    KNeighborsClassifier(n_neighbors=5)", w: "Ask the 5 nearest neighbours and take the majority." },
     { c: ")", w: "" },
     { c: "model.fit(X_train, y_train)", w: "This does almost nothing — it stores the data and builds an index." }
    ] } },

  { h: "Why scaling is mandatory here" },
  { p: "kNN measures distance. If one feature is *salary* (range 20,000–200,000) and another is *years of experience* (range 0–40), then salary dominates the distance calculation completely. A difference of one year of experience is invisible next to a difference of one rupee." },
  { p: "The model is then effectively using one feature and ignoring the rest. It will not error. It will just be quietly mediocre, which is far worse." },
  { trap: "This is the most common kNN mistake and it produces no warning at all. Any model that measures distance — kNN, K-Means, SVM with an RBF kernel — needs its features on comparable scales. Tree-based models do not care, because they split on one feature at a time. Knowing which family you are in tells you whether scaling matters." },

  { h: "Choosing k" },
  { tbl: { t: "What k controls",
    h: ["k", "Behaviour", "Risk"],
    rows: [
     ["`k = 1`", "Copy the single closest point", "Perfect on training data, memorises noise"],
     ["`k = 5–20`", "The usual useful range", "Generally the right place to start"],
     ["`k = n`", "Predict the overall majority every time", "Ignores the input entirely"]
    ] } },
  { p: "So `k` is a smoothness dial, and it is the same bias–variance trade you have already met: small `k` is high variance, large `k` is high bias. Use an odd number for binary classification so votes cannot tie." },

  { h: "Where it falls apart" },
  { p: "kNN has two hard limits, and both matter in practice." },
  { ol: [
   "**Prediction is slow.** Training is instant, but every prediction compares against the whole training set. A model with a million training rows does a million distance calculations per query. This is backwards from most models, and it is fatal for real-time serving.",
   "**High dimensions destroy it.** In 500-dimensional space, essentially every point is roughly the same distance from every other point. \"Nearest\" stops meaning anything. This is the **curse of dimensionality**, and kNN is its most direct victim."
  ] },
  { ana: "In a village, your nearest neighbour is meaningfully similar to you. In a country, your nearest neighbour by geography tells you very little. Add enough dimensions and everyone is equally far from everyone — the concept of a neighbourhood dissolves.",
    at: "The village and the country" },

  { n: "**The assumption:** nearby points have similar labels. **What breaks it:** unscaled features, high dimensionality, and noisy training data (which is memorised rather than smoothed away). **The tell:** good training accuracy, poor test accuracy, and prediction time that scales with your dataset rather than staying flat.",
    nt: "Assumption, breakage, tell" },

  { tryit: { t: "Prove that scaling matters",
    task: "Build a two-feature dataset where one feature has a much larger numeric range than the other. Fit kNN with and without a StandardScaler and compare the test scores.",
    hint: "Multiply one feature by 1000 after generating the data. Use `make_classification` for the data.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nX, y = make_classification(n_samples=2000, n_features=2, n_redundant=0,\n                           n_informative=2, random_state=0)\nX[:, 1] *= 1000          # one feature now dominates every distance\n\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\n\nraw = KNeighborsClassifier(5).fit(Xtr, ytr)\nscaled = make_pipeline(StandardScaler(), KNeighborsClassifier(5)).fit(Xtr, ytr)\n\nprint('unscaled:', round(raw.score(Xte, yte), 3))\nprint('scaled:  ', round(scaled.score(Xte, yte), 3))" },
    w: "The unscaled version is usually several points worse, and nothing warned you. That silence is the lesson." } },

  { vocab: ["Feature Scaling", "Bias-Variance Tradeoff"] }
 ],
 k: [
  "kNN does no training — it stores the data and votes among the k closest points at prediction time.",
  "Feature scaling is mandatory for any distance-based model, and skipping it fails silently.",
  "Small k means high variance, large k means high bias. Use odd k for binary problems.",
  "Prediction cost grows with the training set, and high dimensions make 'nearest' meaningless."
 ],
 r: ["Feature Scaling", "Bias-Variance Tradeoff", "Overfitting", "Clustering"]
},

{
 t: "Support Vector Machines and the Kernel Trick",
 m: "models",
 lvl: "intermediate",
 s: "The most elegant idea in classical ML, and the one with the worst scaling behaviour.",
 goal: [
  "Explain what a maximum-margin boundary is and why it generalises",
  "Describe what a kernel does without doing the maths",
  "Say when an SVM is the right choice and when it is hopeless"
 ],
 b: [
  { p: "Many lines can separate two classes. An SVM asks a sharper question: **which line leaves the most room on both sides?**" },
  { p: "That gap is the **margin**, and maximising it is the whole idea. A boundary crammed against your training points is fragile — a slightly different sample moves it. A boundary with room either side is stable, and stability is generalisation." },
  { p: "Only the points closest to the boundary matter. Those are the **support vectors**, and everything else in your dataset could be deleted without changing the model. That is a genuinely surprising property." },

  { h: "The kernel trick" },
  { p: "Straight lines are limiting. Data shaped like a circle inside a ring cannot be separated by any straight line at all." },
  { p: "The trick: project the data into a higher-dimensional space where it *is* linearly separable, draw a flat boundary there, and let it fold back into a curve in the original space. A circle in two dimensions becomes separable by a flat plane in three." },
  { ana: "Scatter red and blue marbles on a tablecloth so red sits in a ring around blue. No straight stick separates them. Now lift the middle of the cloth — the blue marbles rise, and a flat sheet of card slides between them. You did not move the marbles relative to each other; you changed the space they live in.",
    at: "Lifting the tablecloth" },
  { p: "The clever part is that the maths never actually computes those higher-dimensional coordinates — it only needs the *distances* between points in that space, which a kernel function gives directly. That shortcut is why it is called a trick." },

  { code: { lang: "python", t: "The kernels that matter",
    lines: [
     { c: "from sklearn.svm import SVC", w: "" },
     { c: "", w: "" },
     { c: "SVC(kernel='linear', C=1.0)", w: "Straight boundary. Fast, interpretable, strong on text and wide data." },
     { c: "SVC(kernel='rbf', C=1.0, gamma='scale')", w: "**The default and the usual choice.** Curved boundaries of any shape." },
     { c: "SVC(kernel='poly', degree=3)", w: "Polynomial. Rarely better than RBF in practice." }
    ] } },

  { h: "The two dials" },
  { tbl: { t: "C and gamma",
    h: ["Dial", "Low value", "High value"],
    rows: [
     ["**`C`**", "Tolerates misclassified points — wider margin, more bias", "Insists on classifying training points correctly — overfits"],
     ["**`gamma`** (RBF)", "Each point influences a wide area — smooth boundary", "Each point influences only nearby space — wiggly, overfits"]
    ] } },
  { p: "These two interact, so they are tuned together on a grid. It is the classic example of why hyperparameter search exists." },

  { h: "The fatal limitation" },
  { p: "SVM training scales roughly between O(n²) and O(n³) in the number of samples. That is fine at 10,000 rows and catastrophic at a million." },
  { tbl: { t: "Rough training time, RBF kernel",
    h: ["Rows", "Feasible?"],
    rows: [
     ["1,000", "Instant"],
     ["10,000", "Seconds — comfortable"],
     ["100,000", "Minutes to hours — painful"],
     ["1,000,000", "Effectively impossible; use `LinearSVC` or SGD instead"]
    ] } },
  { p: "This single fact is why SVMs went from dominant in the 2000s to niche today: datasets got bigger, and gradient boosting handles size without complaint." },

  { n: "**The assumption:** classes are separable by a smooth boundary, possibly after warping the space. **What breaks it:** very large datasets (cost), unscaled features (distance again), and heavy class imbalance. **The tell:** training takes minutes and rising, or the model predicts one class for everything.",
    nt: "Assumption, breakage, tell" },

  { p: "Where SVMs still win: **small datasets with many features**. Text classification on a few thousand documents, or biological data with 20,000 genes and 200 patients. Boosting struggles there; a linear SVM is excellent." },

  { vocab: ["Support Vector Machine", "Hyperparameter Tuning", "Feature Scaling"] }
 ],
 k: [
  "An SVM finds the boundary with the widest margin, which is why it generalises well.",
  "Only the support vectors matter — the rest of the data could be discarded.",
  "Kernels let a flat boundary in a higher space become a curve in the original one.",
  "C controls tolerance for errors; gamma controls how local each point's influence is.",
  "Training is roughly O(n²)–O(n³), so SVMs are for small-to-medium data with many features."
 ],
 r: ["Support Vector Machine", "Hyperparameter Tuning", "Feature Scaling", "Overfitting"]
},

{
 t: "Naive Bayes: Wrong Assumptions That Work Anyway",
 m: "models",
 lvl: "intermediate",
 s: "A model built on an assumption that is obviously false, which remains a strong baseline for text.",
 goal: [
  "Explain the independence assumption and why it is wrong",
  "Say why the model works despite that",
  "Choose the right variant for your data type"
 ],
 b: [
  { p: "Naive Bayes applies Bayes' theorem with one simplifying assumption: **every feature is independent of every other, given the class.**" },
  { p: "For text, that means assuming the word *machine* tells you nothing about whether *learning* appears next. This is plainly false. The assumption is not approximately true — it is wrong." },
  { p: "And the model works well anyway. Understanding why is worth more than the algorithm itself." },

  { h: "Why a false assumption still classifies" },
  { p: "Because you are not asking for correct probabilities. You are asking **which class scores highest**." },
  { p: "The independence assumption distorts the probabilities badly — Naive Bayes is notoriously overconfident, cheerfully reporting 0.99999 when it means something like 0.7. But it usually distorts every class's score in the same direction, so the *ranking* survives. The winner stays the winner." },
  { n: "This is a lesson that generalises far beyond this algorithm: **a model can be useless for its probabilities and excellent for its decisions.** If you need calibrated probabilities from Naive Bayes — for thresholding or expected-value calculations — you must calibrate it afterwards. If you only need the argmax, use it as is.",
    nt: "Ranking survives what calibration does not" },

  { code: { lang: "python", t: "Choosing the variant",
    lines: [
     { c: "from sklearn.naive_bayes import MultinomialNB, GaussianNB, BernoulliNB", w: "" },
     { c: "", w: "" },
     { c: "MultinomialNB()", w: "**Counts.** Word frequencies, TF-IDF. The text-classification default." },
     { c: "GaussianNB()", w: "**Continuous features**, assumed roughly bell-shaped per class." },
     { c: "BernoulliNB()", w: "**Binary features** — word present or absent, ignoring how often." }
    ] } },

  { h: "Why it is still worth knowing" },
  { ol: [
   "**It is extremely fast.** Training is a single pass counting frequencies. Millions of documents in seconds, on a laptop, with no GPU.",
   "**It works with very little data.** Where a neural model needs thousands of examples per class, Naive Bayes gives something useful from dozens.",
   "**It is a genuine baseline.** Spam filtering, language identification and topic tagging are still frequently solved this way, because the accuracy difference does not justify the cost difference.",
   "**It updates incrementally.** `partial_fit` lets it learn from a stream without retraining, which few models offer."
  ] },

  { trap: "A word that never appeared with a class in training gives that class a probability of exactly zero — and zero multiplied through the whole calculation makes the entire class impossible, on the strength of one unseen word. The fix is **Laplace smoothing**: add a small count to everything so nothing is ever exactly zero. scikit-learn does this by default with `alpha=1.0`. Set `alpha=0` and you will meet the bug the hard way." },

  { n: "**The assumption:** features are conditionally independent given the class. **What breaks it:** strongly correlated features, which cause double-counting of the same evidence. **The tell:** wildly overconfident probabilities, and degradation when you add redundant features (unlike most models, which shrug them off).",
    nt: "Assumption, breakage, tell" },

  { tryit: { t: "Beat a transformer on speed",
    task: "Train a Naive Bayes text classifier on the 20-newsgroups dataset and time it. Report accuracy and training time.",
    hint: "`fetch_20newsgroups` from sklearn.datasets, then `TfidfVectorizer` piped into `MultinomialNB`.",
    sol: { lang: "python", code: "import time\nfrom sklearn.datasets import fetch_20newsgroups\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.pipeline import make_pipeline\n\ncats = ['sci.space', 'rec.autos', 'talk.politics.guns']\ntr = fetch_20newsgroups(subset='train', categories=cats)\nte = fetch_20newsgroups(subset='test', categories=cats)\n\nmodel = make_pipeline(TfidfVectorizer(), MultinomialNB())\n\nt0 = time.time()\nmodel.fit(tr.data, tr.target)\nprint(f'trained in {time.time() - t0:.2f}s')\nprint('accuracy:', round(model.score(te.data, te.target), 3))" },
    w: "Around 0.95 accuracy in well under a second. Always run this before reaching for anything larger — sometimes the baseline is simply good enough, and knowing that saves weeks." } },

  { vocab: ["Naive Bayes", "Calibration"] }
 ],
 k: [
  "Naive Bayes assumes features are independent given the class, which is false and rarely fatal.",
  "It distorts probabilities but usually preserves the ranking, so decisions survive.",
  "Multinomial for counts, Gaussian for continuous, Bernoulli for present/absent.",
  "Laplace smoothing (alpha) prevents a single unseen feature zeroing a class.",
  "Extremely fast, works with little data, and still a legitimate production choice for text."
 ],
 r: ["Naive Bayes", "Calibration", "TF-IDF", "Text Classification"]
},

{
 t: "Choosing a Model Without Guessing",
 m: "models",
 lvl: "intermediate",
 s: "The decision procedure, and the honest answer about what wins in practice.",
 goal: [
  "Choose a starting model from the shape of your data",
  "Explain why gradient boosting dominates tabular problems",
  "Know when a neural network is and is not justified"
 ],
 b: [
  { p: "Beginners choose models by reputation. Practitioners choose by data shape, and they nearly always start in the same place." },

  { h: "The decision table" },
  { tbl: { t: "Start here",
    h: ["Your data", "Start with", "Why"],
    rows: [
     ["**Tabular, any size**", "Gradient boosting (XGBoost / LightGBM)", "Wins the overwhelming majority of the time"],
     ["**Tabular, need to explain it**", "Logistic or linear regression", "Coefficients a regulator or a manager can read"],
     ["**Text, small data**", "TF-IDF + linear SVM or Naive Bayes", "Fast, strong, no GPU"],
     ["**Text, need real understanding**", "Fine-tuned transformer", "Only when the simple version has been tried"],
     ["**Images / audio**", "Pretrained CNN or transformer, fine-tuned", "Never train vision from scratch"],
     ["**Very few rows (< 1000)**", "Linear model or Naive Bayes", "Complex models cannot be validated at that size"],
     ["**Time-ordered**", "Gradient boosting with lag features", "Beats classical ARIMA more often than not"]
    ] } },

  { h: "Why boosting dominates tabular data" },
  { p: "This is the single most useful empirical fact in applied ML, and it has survived a decade of attempts to overturn it: **on tabular data, gradient-boosted trees beat deep learning almost every time.**" },
  { ol: [
   "Real tabular data is full of sharp thresholds — *approved above 700, declined below*. Trees model steps natively; neural networks approximate them awkwardly.",
   "Columns are heterogeneous. Age, postcode, income and a category code have no shared geometry, and trees do not need one.",
   "Trees are invariant to feature scaling and monotone transformations, removing an entire class of preprocessing error.",
   "Missing values are handled natively — the tree simply learns which way to send them."
  ] },
  { p: "Papers claiming a deep model beat boosting on tabular data are common; papers where that result reproduces on new datasets are rare. Start with boosting. Make the neural network prove itself against it." },

  { h: "The procedure" },
  { ol: [
   "**Baseline first.** Predict the majority class, or the mean. If your model cannot beat this, the problem is your data or your framing.",
   "**Then a linear model.** Fast, and it tells you whether the signal is simple. A linear model at 0.85 and boosting at 0.86 means the extra complexity is not worth deploying.",
   "**Then gradient boosting, default settings.** This is your real candidate.",
   "**Then tune it**, if the gain would matter. Often it does not.",
   "**Only then** consider something exotic — and require it to beat step 3 on the same validation split."
  ] },
  { trap: "The most common failure in applied ML is not choosing the wrong model. It is spending three weeks on model selection when the data has a leak, the target is defined incorrectly, or the metric does not match the business goal. Model choice is usually worth a few percent. Fixing the framing is often worth a factor of two." },

  { n: "Every model on this table is really an **assumption** about your data. Linear models assume a straight relationship; kNN assumes nearby points are alike; trees assume the world splits into boxes; Naive Bayes assumes features are independent. Choosing a model is choosing which assumption you are willing to make, and diagnosing a bad model is usually discovering which assumption your data violates.",
    nt: "Every model is an assumption" },

  { n: "You will be asked *why did you choose that model?* in every interview you sit. \"It performed best\" is a weak answer. \"Tabular data with mixed types and sharp thresholds, so I started with gradient boosting; I checked a linear baseline first and it was four points behind, which told me the interactions mattered\" is the answer that gets offers.",
    nt: "How to answer the interview question" },

  { tryit: { t: "Run the ladder properly",
    task: "On any tabular dataset, evaluate in order: majority-class baseline, logistic regression, and gradient boosting. Report all three and decide which you would ship.",
    hint: "`DummyClassifier(strategy='most_frequent')` is the baseline. Use the same split for all three.",
    sol: { lang: "python", code: "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import HistGradientBoostingClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nX, y = load_breast_cancer(return_X_y=True)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\nfor name, m in [\n    ('baseline', DummyClassifier(strategy='most_frequent')),\n    ('logistic', make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))),\n    ('boosting', HistGradientBoostingClassifier(random_state=0)),\n]:\n    m.fit(Xtr, ytr)\n    print(f'{name:10s} {m.score(Xte, yte):.3f}')" },
    w: "Logistic regression is usually within a point or two of boosting here. On a dataset this clean, the simpler, explainable, faster model is the correct engineering choice — and noticing that is the skill." } },

  { vocab: ["Gradient Boosting", "XGBoost", "Ensemble Learning"] }
 ],
 k: [
  "Choose from data shape, not reputation. Tabular means start with gradient boosting.",
  "Boosting beats deep learning on tabular data because of sharp thresholds, mixed column types and scale invariance.",
  "Always run a dummy baseline and a linear model before anything complex.",
  "Framing errors — leaks, wrong target, wrong metric — cost far more than model choice.",
  "Be able to justify your choice by the data's properties, not by the leaderboard."
 ],
 r: ["Gradient Boosting", "XGBoost", "Ensemble Learning", "Logistic Regression"]
},

{
 t: "Ensembles: Why Combining Beats Choosing",
 m: "models",
 lvl: "intermediate",
 s: "Bagging, boosting and stacking — three ways to be right more often than any one model.",
 goal: [
  "Distinguish bagging from boosting by what each one reduces",
  "Explain why averaging independent errors improves accuracy",
  "Build a stacked ensemble and know when it is not worth it"
 ],
 b: [
  { p: "One model makes systematic mistakes. Several different models make *different* mistakes, and if you average them the mistakes partially cancel while the signal reinforces. That is the whole of ensembling, and it is the closest thing applied ML has to a free lunch." },
  { ana: "One doctor may misdiagnose. Five doctors who trained at different schools, consulted independently, will rarely all misdiagnose in the same direction. You are not seeking a better doctor — you are seeking uncorrelated errors.",
    at: "The second opinion" },

  { h: "The three families" },
  { tbl: { t: "What each one attacks",
    h: ["Family", "How it builds models", "Reduces", "Example"],
    rows: [
     ["**Bagging**", "In parallel, each on a random sample of the data", "**Variance**", "Random Forest"],
     ["**Boosting**", "In sequence, each fixing the previous one's errors", "**Bias**", "XGBoost, LightGBM"],
     ["**Stacking**", "Train diverse models, then a model to combine them", "Both", "Competition winners"]
    ] } },
  { p: "That middle column is the thing to remember. **Bagging fights variance; boosting fights bias.** If your model overfits, bagging helps. If it underfits, boosting helps. Reaching for the wrong one makes things worse." },

  { h: "Bagging, concretely" },
  { p: "Draw many random samples of your data (with replacement), train a deep tree on each, and average their predictions. Each tree overfits its own sample in its own direction, and averaging cancels most of it." },
  { p: "Random Forest adds one more twist: at each split, each tree may only consider a random subset of features. This is deliberate handicapping — it stops every tree seizing on the same dominant feature and makes their errors less correlated. Less correlation means more cancellation." },

  { h: "Boosting, concretely" },
  { p: "Train a weak model. Look at what it got wrong. Train the next model to focus on exactly those errors. Repeat several hundred times, adding each model's contribution scaled by a small learning rate." },
  { p: "This is sequential and therefore cannot be parallelised across trees, and it is far more prone to overfitting than bagging — which is why boosting needs early stopping and bagging largely does not." },
  { code: { lang: "python", t: "The three settings that matter in boosting",
    lines: [
     { c: "model = LGBMClassifier(", w: "" },
     { c: "    n_estimators=2000,", w: "Set it high and let early stopping decide the real number." },
     { c: "    learning_rate=0.05,", w: "Smaller means more trees needed but better final accuracy. 0.01–0.1 is the useful band." },
     { c: "    max_depth=6,", w: "Depth controls interaction complexity. 3–8 covers most problems." },
     { c: ")", w: "" },
     { c: "model.fit(Xtr, ytr, eval_set=[(Xval, yval)],", w: "" },
     { c: "          callbacks=[early_stopping(50)])", w: "**Stop when validation stops improving for 50 rounds.** Without this, boosting overfits." }
    ] } },

  { h: "Stacking" },
  { p: "Train several different models. Then train a final model — the *meta-learner* — whose inputs are the other models' predictions. It learns which model to trust when." },
  { trap: "Stacking must be trained on **out-of-fold** predictions. If the meta-learner sees predictions the base models made on data they were trained on, those predictions are unrealistically good and the meta-learner learns to trust a level of accuracy that will never occur in production. This is one of the subtlest leaks in ML, and `StackingClassifier` handles it correctly by default — do not hand-roll it unless you understand this." },

  { n: "**The assumption:** the models being combined make *different* mistakes. **What breaks it:** training near-identical models — five gradient-boosted trees with slightly different seeds are highly correlated, so averaging them buys almost nothing. **The tell:** the ensemble scores barely above its best single member, which means you bought maintenance cost and no accuracy.",
    nt: "Assumption, breakage, tell" },

  { n: "Stacking wins competitions and is often the wrong choice in production. Five models to maintain, five to serve, five to monitor, for perhaps half a percent. That trade is worth it on a leaderboard and rarely worth it in a system a team has to keep alive at 3 a.m.",
    nt: "Competitions are not production" },

  { tryit: { t: "Watch errors decorrelate",
    task: "Train a single decision tree and a random forest on the same data. Compare their test scores, and check how correlated the errors of individual trees are.",
    hint: "`RandomForestClassifier` exposes `.estimators_`. Predict with two of them separately and compare where each is wrong.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\n\nX, y = make_classification(n_samples=4000, n_features=20, n_informative=8, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\n\ntree = DecisionTreeClassifier(random_state=0).fit(Xtr, ytr)\nforest = RandomForestClassifier(n_estimators=200, random_state=0).fit(Xtr, ytr)\n\nprint('single tree:', round(tree.score(Xte, yte), 3))\nprint('forest:     ', round(forest.score(Xte, yte), 3))\n\nw0 = forest.estimators_[0].predict(Xte) != yte\nw1 = forest.estimators_[1].predict(Xte) != yte\nprint('both wrong on the same rows:', round((w0 & w1).sum() / w0.sum(), 3))" },
    w: "The two trees disagree about which rows they get wrong — that overlap is well under 1.0. That disagreement is precisely what the forest converts into accuracy." } },

  { vocab: ["Ensemble Learning", "Random Forest", "Gradient Boosting", "Stacking"] }
 ],
 k: [
  "Ensembles work by making errors uncorrelated so they cancel under averaging.",
  "Bagging reduces variance (Random Forest); boosting reduces bias (XGBoost, LightGBM).",
  "Boosting needs early stopping; bagging largely does not.",
  "Stacking must use out-of-fold predictions or it leaks badly.",
  "Competition ensembles are usually not worth their maintenance cost in production."
 ],
 r: ["Ensemble Learning", "Random Forest", "Gradient Boosting", "Stacking", "Bagging"]
}

]);
