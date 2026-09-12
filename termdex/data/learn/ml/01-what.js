/* Machine Learning — what learning from data means. */
TD.addLessons("ml", [

{
 t: "What It Means for a Program to Learn",
 m: "what",
 lvl: "core",
 s: "The inversion at the centre of the field, and the one question that decides whether it applies.",
 goal: [
  "State what machine learning trades away in exchange for what",
  "Decide whether a problem needs a model or an if-statement",
  "Name the three kinds of learning and recognise which one a problem is"
 ],
 b: [
  { p: "Ordinary programming is: you write the rules, the computer applies them to data, out come answers. Machine learning swaps two of those around: you supply the data **and** the answers, and the computer produces the rules." },

  { vs: { t: "The inversion, concretely", lang: "python",
    bad: { c: "def is_spam(email):\n    if 'lottery' in email.lower():\n        return True\n    if email.count('!') > 5:\n        return True\n    if sender_unknown(email):\n        return True\n    # ... 400 more rules,\n    # each added after a complaint,\n    # none of which can be removed", label: "Rules by hand",
      w: "Every rule was correct when written. Together they contradict each other, nobody dares delete one, and spammers adapt faster than you can add more. This is precisely how expert systems died in the 1980s." },
    good: { c: "model.fit(emails, labels)\n\nmodel.predict(new_email)", label: "Rules from data",
      w: "You supply 50,000 emails already marked spam or not. The algorithm derives the rule. When spammers adapt, you retrain rather than rewrite — and that difference in maintenance cost is why this approach won." } } },

  { p: "The gain is reach: you can now solve problems where the rule exists but no human can state it. The cost is certainty. You no longer have a rule you can read, argue with, or prove correct. You have a system that is right about a distribution and wrong about individual cases you cannot predict in advance." },

  { n: "Hold onto that trade. Every difficulty in the rest of this track descends from it — evaluation exists because you cannot read the rule, monitoring exists because the distribution moves, and interpretability is an entire research field devoted to partially undoing it.",
    nt: "The trade is the subject" },

  { h: "The question to ask first" },
  { p: "Before any of the technique, one question decides whether machine learning is even the right tool: **can you write the rule down?**" },

  { tbl: { t: "Three cases, three answers",
    h: ["Situation", "Example", "What to do"],
    rows: [
     ["**You can state the rule**", "Order over ₹5,000 gets free delivery", "**Write the if-statement.** It is faster, testable, explainable, free to run and cannot drift. This category is far larger than anyone in AI wants to admit"],
     ["**A rule exists but nobody can state it**", "Is this handwriting a 7? Is this review positive? Is this transaction fraudulent?", "**Machine learning.** This is exactly the gap it was invented for"],
     ["**No rule exists; the outcome is genuinely random**", "Which number a fair die will show", "**Nothing will help.** No model, no amount of data. Recognising this saves entire quarters"]
    ] } },

  { trap: "The most expensive mistake in applied AI is reaching for a model when the middle row does not apply. Teams build a classifier to route support tickets that four keyword rules would have routed better, and then spend a year maintaining a training pipeline, a feature store and a monitoring dashboard for it. Senior engineers are recognisable by how often they say *this is three if-statements*. Say it, and be right, and people will listen to you about the cases that genuinely do need a model." },

  { h: "The three kinds of learning" },
  { tbl: { t: "How to tell them apart",
    h: ["Kind", "You give it", "It gives you", "Typical use"],
    rows: [
     ["**Supervised**", "Examples **with** the right answers", "A predictor for new examples", "**Roughly 95% of commercial ML.** Fraud, churn, ranking, pricing, classification"],
     ["**Unsupervised**", "Examples with **no** answers", "Structure it found on its own", "Customer segments, anomaly detection, dimensionality reduction, topic discovery"],
     ["**Reinforcement**", "An environment and a reward signal", "A policy — what to do in each state", "Games, robotics, RLHF for aligning language models. Rare and difficult in ordinary products"]
    ] } },

  { p: "The overwhelming majority of what you will build is supervised, and the reason is prosaic: supervised learning works reliably when you have labels, and the hard part is almost always getting the labels rather than choosing the algorithm." },

  { h: "Supervised, split in two" },
  { l: [
   "**Classification** — the answer is one of a fixed set of categories. Spam or not. Fraud or not. Which of twelve product categories. The output is a probability per class.",
   "**Regression** — the answer is a number on a continuous scale. Tomorrow's demand. The price. Days until churn. The output is a single value.",
   "**The same problem can be framed either way**, and the framing decision matters more than the model choice. *How many days until this customer churns* (regression) and *will this customer churn in the next 30 days* (classification) need different data, different metrics and different actions. Choose deliberately."
  ] },

  { ana: "Supervised learning is teaching by worked examples. You show a student two thousand solved problems and they infer the method. Unsupervised learning is handing someone a box of unlabelled photographs and asking them to sort it into piles — they will find some structure, but nobody can say whether it is the *right* structure, which is exactly why unsupervised results are so much harder to evaluate.",
    at: "Worked examples versus a box of photographs" },

  { h: "Where the work actually goes" },
  { p: "Newcomers expect the job to be choosing and tuning models. The real distribution of effort is close to inverted, and knowing this in advance saves a lot of disappointment." },

  { tbl: { t: "Where a real ML project's time goes",
    h: ["Phase", "Share of the time", "What happens"],
    rows: [
     ["**Framing the problem**", "~10%", "Deciding what to predict and what action the prediction drives. Getting this wrong invalidates everything downstream"],
     ["**Data**", "**~60%**", "Finding it, joining it, cleaning it, discovering the label means something different from what everyone believed"],
     ["**Modelling**", "~10%", "Often three lines of scikit-learn. Genuinely this small"],
     ["**Evaluation**", "~10%", "Building the harness, hunting for leakage, deciding whether the result is real"],
     ["**Shipping and monitoring**", "~10%", "Serving it, watching it decay, retraining"]
    ] } },

  { n: "The 60% is not a failure of tooling and it will not be automated away. Real data is genuinely ambiguous: the `status` column has seven values and three of them mean *cancelled*; the timestamp is in two different timezones depending on which year it came from; the label was applied by a team whose definition changed in March. Every one of those has to be resolved by a person who understands the business, and that person is you.",
    nt: "Why the data phase does not shrink" },

  { tryit: { t: "Classify five problems",
    task: "For each, decide: if-statement, supervised classification, supervised regression, unsupervised, or impossible.\n\n1. Flag orders over ₹50,000 for manual review\n2. Predict how many units of a product will sell next week\n3. Group customers into segments nobody has defined yet\n4. Decide whether a support ticket is angry\n5. Predict which specific customer will contact support tomorrow",
    hint: "For 5, think about the base rate and whether the outcome is actually predictable at that granularity.",
    sol: { lang: "text", code: "1. IF-STATEMENT. The rule is stated in the requirement itself.\n   A model here would be strictly worse in every way.\n\n2. REGRESSION. A continuous number, with history to learn from.\n   Note: framing it as 'will we run out of stock' (classification)\n   is often more useful, because that is the actual decision.\n\n3. UNSUPERVISED (clustering). No labels exist. Expect to argue\n   about whether the clusters are meaningful -- there is no\n   answer key, so evaluation is a judgement call.\n\n4. CLASSIFICATION. A rule exists in people's heads, nobody can\n   state it cleanly, and labelled examples are obtainable.\n   Textbook fit.\n\n5. NEARLY IMPOSSIBLE, as stated. Per-customer, per-day is far too\n   fine-grained -- the base rate is tiny and the signal is not\n   there. Reframe: 'which 1000 customers are most likely to\n   contact support this month' is a ranking problem and is\n   entirely achievable." },
    w: "Question 5 is the one that matters. It is not a modelling failure, it is a framing failure, and it happens constantly: a stakeholder asks for a prediction at a granularity where no signal exists. The valuable move is not to try harder — it is to reframe the ask into something answerable and explain why. That conversation is most of what a senior ML engineer does." } },

  { vocab: ["Machine Learning", "Supervised Learning", "Unsupervised Learning", "Classification", "Regression"] }
 ],
 k: [
  "Machine learning derives rules from data instead of you writing them — reach gained, certainty lost.",
  "Ask first whether you can write the rule down. If you can, write it; that category is bigger than it looks.",
  "Supervised learning is roughly 95% of commercial ML, and its hard part is labels, not algorithms.",
  "Classification predicts a category, regression predicts a number, and the framing choice matters more than the model.",
  "About 60% of a real project is data work, and that share is not shrinking."
 ],
 r: ["Machine Learning", "Supervised Learning", "Unsupervised Learning", "Classification", "Regression", "Reinforcement Learning"]
},

{
 t: "Features, Labels, and the Shape of a Dataset",
 m: "what",
 lvl: "core",
 s: "The vocabulary every ML conversation assumes, and the label problem nobody warns you about.",
 goal: [
  "Use the words feature, label, instance, target and ground truth correctly",
  "Recognise that your label is a definition someone chose, not a fact",
  "Spot the three ways a label goes wrong before you train on it"
 ],
 b: [
  { p: "Machine learning has a small vocabulary and uses it relentlessly. Learning it properly takes ten minutes and makes every paper, tutorial and standup comprehensible." },

  { code: { lang: "python", t: "The whole vocabulary in one dataset",
    lines: [
     { c: "import pandas as pd", w: "" },
     { c: "df = pd.read_csv('customers.csv')", w: "" },
     { c: "df.head(2)", w: "" }
    ],
    out: "   age  orders  spend  days_since  churned\n0   34       7   4200          12        0\n1   28       1    340          89        1" } },

  { tbl: { t: "What each part is called",
    h: ["Term", "In this table", "Also called"],
    rows: [
     ["**Instance / example / sample**", "One row — one customer", "observation, data point, record"],
     ["**Feature**", "`age`, `orders`, `spend`, `days_since`", "predictor, input, independent variable, column, X"],
     ["**Label / target**", "`churned` — the thing you predict", "ground truth, response, y"],
     ["**Feature vector**", "`[34, 7, 4200, 12]` — one row's features", "the input to the model"],
     ["**Feature matrix**", "All rows' features, shape (n, 4)", "**X**, by universal convention"],
     ["**Label vector**", "All the `churned` values, shape (n,)", "**y**, by universal convention"]
    ] } },

  { p: "`X` and `y` are not arbitrary. Every library, tutorial and paper uses them, and `model.fit(X, y)` reads identically in scikit-learn, XGBoost and half of PyTorch. Adopt the convention rather than fighting it." },

  { h: "Your label is a decision, not a fact" },
  { p: "This is the part nobody warns you about, and it causes more wasted work than any modelling mistake. The column called `churned` looks like a fact about the world. It is not. It is the output of a definition somebody chose, and if you do not know that definition your model is learning something other than what you think." },

  { l: [
   "Does `churned = 1` mean cancelled the subscription, or no purchase in 90 days, or asked to close the account, or stopped opening emails?",
   "Who applied the label, and when? A label applied by a rule is learning that rule. A label applied by humans carries their inconsistency.",
   "Did the definition change? Datasets spanning two years frequently span two definitions, and nothing in the file records the change.",
   "What happens to ambiguous cases? Someone decided, and their decision is now the pattern your model will faithfully reproduce."
  ] },

  { trap: "Ask *how was this label produced* before you write a line of modelling code, and keep asking until you get a specific answer. If the answer is *the ops team tags them*, go and watch the ops team tag some. You will discover that two people tag differently, that a category is used as a catch-all, and that the label you are about to spend a month optimising has a ceiling set by human disagreement. That ceiling is real and no model will exceed it." },

  { h: "Three ways labels go wrong" },
  { tbl: { t: "The label failures, and their tells",
    h: ["Failure", "What happens", "The tell"],
    rows: [
     ["**Label noise**", "Some labels are simply wrong. Humans mislabel 5–15% in most real datasets", "The model plateaus well below what you expected and the failures look correct to you when you read them"],
     ["**Label leakage**", "The label's cause is also a feature. `cancellation_reason` predicts churn perfectly", "**Accuracy is suspiciously high.** Treat anything above 0.95 on a hard problem as a bug report about your data"],
     ["**Definition drift**", "The label meant one thing in 2023 and another in 2025", "The model is excellent on old data and poor on recent data, with no other explanation"]
    ] } },

  { n: "Label noise sets a hard ceiling on achievable accuracy. If two expert annotators agree only 85% of the time, no model will exceed roughly 85% — it cannot learn a rule that the labels themselves do not consistently express. Measuring inter-annotator agreement before you start is one of the highest-value hours in any project, and almost nobody spends it.",
    nt: "The ceiling you cannot see" },

  { h: "The shape a model expects" },
  { code: { lang: "python", t: "Getting from a dataframe to X and y",
    lines: [
     { c: "y = df['churned']", w: "**The target column, on its own.** Shape (n,)." },
     { c: "X = df.drop(columns=['churned'])", w: "**Everything else.** Shape (n, features).", hi: true },
     { c: "", w: "" },
     { c: "X.shape, y.shape", w: "Check them. The first number must match." },
     { c: "", w: "" },
     { c: "X = df.drop(columns=['churned', 'customer_id'])", w: "**Drop identifiers too.** A customer ID carries no signal and a model will happily memorise it, which looks like learning and is not.", hi: true }
    ],
    out: "((10000, 4), (10000,))",
    after: "Dropping IDs matters more than it sounds. Sequential IDs correlate with signup date, which correlates with almost everything, so the model gets a real accuracy boost from a column with no causal content — and that boost disappears the moment IDs are assigned differently." } },

  { h: "Two habits worth forming now" },
  { ol: [
   "**Look at the data before modelling.** `df.describe()`, `df.isna().sum()`, `df['label'].value_counts()`, and a histogram of every numeric column. Ten minutes, and it catches most disasters.",
   "**Read twenty rows by hand**, including a few where the label surprises you. Every experienced practitioner does this and it is never a waste — it is where you discover that a third of the *cancelled* rows are actually test accounts."
  ] },

  { code: { lang: "python", t: "The ten-minute check, in full",
    lines: [
     { c: "df.shape", w: "How much data is there, really?" },
     { c: "df.isna().sum()", w: "**Missing values per column.** A column that is 80% empty is not a feature." },
     { c: "df['churned'].value_counts(normalize=True)", w: "**Class balance.** If it is 2% positive, accuracy is a meaningless metric and you know that before you compute it.", hi: true },
     { c: "df.describe()", w: "Ranges. An `age` of -3 or 2,000 tells you the pipeline is broken upstream." },
     { c: "df.duplicated().sum()", w: "**Duplicates.** Duplicated rows split across train and test are a silent, effective leak." },
     { c: "df.dtypes", w: "A numeric column stored as text is a common and confusing bug." }
    ] } },

  { tryit: { t: "Interrogate a label",
    task: "Pick any prediction problem you might build — churn, fraud, ticket priority, whatever fits your world. Write down the exact definition of its label, in one sentence, precise enough that two people would apply it identically. Then list three cases where your definition is genuinely ambiguous.",
    hint: "The ambiguous cases are the interesting ones. If you cannot find three, your definition is not yet specific enough.",
    sol: { lang: "text", code: "Example, for churn:\n\nDefinition: 'churned = 1 if a paying customer made no purchase\nin the 90 days following their last order, measured as of\n2026-01-01.'\n\nAmbiguous cases:\n1. A customer who bought on day 89 and never again. Labelled 0\n   at snapshot time, and will be 1 next month. The label depends\n   on WHEN you look -- a real and common source of drift.\n\n2. A seasonal customer who buys once a year, every year.\n   Labelled churned for 275 days annually. The definition is\n   simply wrong for this segment, and the model will learn to\n   flag your most loyal customers.\n\n3. An account that switched to a different email. Two rows,\n   one labelled churned, one labelled new. Identity resolution\n   is quietly the hardest part of most datasets.\n\nEvery one of these is a data conversation, not a modelling one --\nand every one changes the model's behaviour more than switching\nfrom logistic regression to gradient boosting would." },
    w: "If you produced three good ambiguous cases, you have just done the most valuable hour of the project. Every one of them will otherwise be discovered later, by a stakeholder, in a meeting, after the model has shipped." } },

  { vocab: ["Feature", "Label", "Training Data", "Data Leakage", "Ground Truth"] }
 ],
 k: [
  "X is the feature matrix, y is the label vector, and every library assumes those names.",
  "A label is a definition somebody chose, not a fact — find out who chose it and how.",
  "Label noise sets a hard ceiling; if annotators agree 85% of the time, no model beats 85%.",
  "Drop IDs before training or the model will memorise them and post a fake improvement.",
  "Run the ten-minute check — shape, nulls, class balance, ranges, duplicates, dtypes — before any modelling."
 ],
 r: ["Feature", "Label", "Training Data", "Data Leakage", "Feature Engineering"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "y = df['churned']", w: "pull out the target column" },
   { c: "X = df.drop(columns=['churned', 'customer_id'])", w: "features only — and drop the identifier" },
   { c: "df['churned'].value_counts(normalize=True)", w: "class balance, before you trust any accuracy number" },
   { c: "df.isna().sum()", w: "missing values per column" },
   { c: "df.duplicated().sum()", w: "duplicates, which leak silently across a split" }
  ]
 }
}

]);
