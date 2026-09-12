/* Machine Learning — features and data. */
TD.addLessons("ml", [

  {
    t: "Feature Engineering Is Where the Wins Are",
    m: "features",
    lvl: "core",
    s: "Encoding, scaling, missing values — and the domain knowledge no model can invent.",
    goal: [
      "Encode categorical variables without creating a leak or an explosion",
      "Handle missing values as information rather than as a nuisance",
      "Construct features that carry domain knowledge the raw columns do not"
    ],
    b: [
      { p: "A model can only combine the columns you give it. If the signal lives in a relationship between columns that no split or weighted sum can express, no algorithm will find it — you have to construct it. That is feature engineering, and on tabular data it beats model selection consistently." },

      { h: "Categorical variables" },
      {
        tbl: {
          t: "Four encodings and when each is right",
          h: ["Encoding", "How", "Use when", "Watch out for"],
          rows: [
            ["**One-hot**", "One binary column per category", "**The default.** Few categories, any model", "Explodes on high cardinality — 10,000 cities means 10,000 columns"],
            ["**Ordinal**", "Map to integers 0, 1, 2…", "There is a real order: small/medium/large", "**Never for unordered categories with a linear model** — it invents an order that is not there"],
            ["**Target encoding**", "Replace the category with the mean target for that category", "High cardinality, tree models", "**Leaks badly** unless computed inside cross-validation folds"],
            ["**Native categorical**", "Let LightGBM or CatBoost handle it", "You are using those libraries", "Nothing. Prefer this when available"]
          ]
        }
      },

      {
        code: {
          lang: "python", t: "One-hot, done so it survives production",
          lines: [
            { c: "from sklearn.preprocessing import OneHotEncoder", w: "" },
            { c: "", w: "" },
            { c: "enc = OneHotEncoder(", w: "" },
            { c: "    handle_unknown='ignore',", w: "**Production will send categories training never saw.** Without this the request raises instead of degrading.", hi: true },
            { c: "    min_frequency=20,", w: "**Categories seen fewer than 20 times get merged into one bucket.** Stops the long tail creating thousands of useless columns." },
            { c: "    sparse_output=False)", w: "Dense output is easier to work with unless you have very many columns." }
          ]
        }
      },

      { trap: "Target encoding is the highest-value, highest-risk transformation in tabular machine learning. Computing the target mean per category using the whole dataset, then splitting, gives every row a feature built partly from its own label. The score looks superb and the model is worthless. If you use it, compute it inside each cross-validation fold or with out-of-fold means — and if that sounds fiddly, that is because it is, which is why native categorical support in LightGBM and CatBoost is usually the better answer." },

      { h: "Scaling" },
      { p: "Whether you need it depends entirely on the model, and this is a common source of unnecessary work." },

      {
        tbl: {
          t: "Who needs scaled features",
          h: ["Model", "Needs scaling?", "Why"],
          rows: [
            ["**Linear / logistic regression**", "**Yes**, with regularisation", "The penalty is applied to raw weights, so an unscaled feature is penalised unfairly"],
            ["**k-NN, SVM, k-means**", "**Yes, essential**", "They compute distances. A feature in lakhs drowns out one from 0 to 1 entirely"],
            ["**Neural networks**", "**Yes**", "Unscaled inputs make gradients wildly uneven and training unstable"],
            ["**Trees, forests, boosting**", "**No**", "They split on thresholds. Any monotonic rescaling gives an identical tree"]
          ]
        }
      },

      {
        code: {
          lang: "python", t: "Two scalers, and when the second one matters",
          lines: [
            { c: "from sklearn.preprocessing import StandardScaler, RobustScaler", w: "" },
            { c: "", w: "" },
            { c: "StandardScaler()", w: "`(x - mean) / std`. **The default.** Assumes no extreme outliers." },
            { c: "RobustScaler()", w: "`(x - median) / IQR`. **Use on long-tailed data** — one customer who spent ₹50 lakh will otherwise squash everyone else into a narrow band near zero.", hi: true },
            { c: "", w: "" },
            { c: "np.log1p(x)", w: "**Often better than either.** `log(1+x)` compresses a long tail into something roughly symmetric, and handles zeros safely. Try this first on spend, counts and durations." }
          ]
        }
      },

      { h: "Missing values carry information" },
      { p: "The instinct is to fill missing values and move on. That is usually a mistake, because the *fact* that a value is missing is frequently one of the strongest signals in the dataset." },

      {
        code: {
          lang: "python", t: "Keep the missingness, then fill",
          lines: [
            { c: "X['income_missing'] = X['income'].isna().astype(int)", w: "**Add the indicator before filling.** A missing income might mean *did not want to say*, which is genuinely predictive.", hi: true },
            { c: "X['income'] = X['income'].fillna(X['income'].median())", w: "**Median, computed on training data only.** Filling with the full-dataset median is a small but real leak." },
            { c: "", w: "" },
            { c: "# or skip both -- modern boosting handles NaN natively", w: "" },
            { c: "HistGradientBoostingClassifier()", w: "**Learns which branch to send missing values down**, per split. Usually better than anything you would do by hand." }
          ]
        }
      },

      {
        l: [
          "**Missing at random** — a sensor dropped a reading. Imputation is fine.",
          "**Missing for a reason** — the field is optional and people who skip it differ systematically. **The indicator is the feature.**",
          "**Missing structurally** — the column does not apply to this row, like `cancellation_date` for active customers. Do not impute; ask whether the column should exist at all.",
          "**Missing because of the pipeline** — a join failed. This is a bug, not a modelling problem, and imputing it hides the bug."
        ]
      },

      { h: "The features that actually win" },
      { p: "Generic transformations are worth a little. Features built from understanding the domain are worth a lot, and here is the difference in practice." },

      {
        code: {
          lang: "python", t: "Raw columns against constructed ones",
          lines: [
            { c: "# raw", w: "" },
            { c: "df[['order_count', 'total_spend', 'first_order', 'last_order']]", w: "What the database gave you." },
            { c: "", w: "" },
            { c: "# constructed", w: "" },
            { c: "df['avg_order_value'] = df.total_spend / df.order_count", w: "**A ratio.** Trees can only approximate ratios through many splits; giving it directly is far more efficient.", hi: true },
            { c: "df['tenure_days'] = (df.last_order - df.first_order).dt.days", w: "**A duration**, which is what the two dates actually meant." },
            { c: "df['orders_per_month'] = df.order_count / (df.tenure_days / 30 + 1)", w: "**A rate.** Ten orders in a month and ten orders in three years are entirely different customers, and the raw columns cannot say so." },
            { c: "df['days_since_last'] = (TODAY - df.last_order).dt.days", w: "**Recency.** Frequently the single strongest churn feature there is." },
            { c: "df['spend_vs_segment'] = df.total_spend / df.groupby('segment').total_spend.transform('median')", w: "**Relative to peers.** ₹5,000 is a lot for one segment and nothing for another." }
          ],
          after: "Five lines, and every one encodes something a person knows about customers that no algorithm can derive from four raw columns. This is the part of the job that does not automate."
        }
      },

      {
        tbl: {
          t: "Transformations worth trying on almost any dataset",
          h: ["Pattern", "Example", "Why it helps"],
          rows: [
            ["**Ratios**", "spend per order, clicks per impression", "Normalises for size. Extremely high yield"],
            ["**Differences and durations**", "days between events, change since last month", "Trends are usually more predictive than levels"],
            ["**Rates**", "events per unit time", "Separates intensity from tenure"],
            ["**Aggregations by group**", "customer's mean, max, count over their history", "Turns a transaction table into one row per customer"],
            ["**Relative-to-peer**", "value divided by the segment median", "Makes numbers comparable across contexts"],
            ["**Cyclical time**", "`sin(2π·hour/24)`, `cos(2π·hour/24)`", "**23:00 and 01:00 are close in time and far apart as integers.** Sine and cosine fix that"],
            ["**Text length and counts**", "characters, words, uppercase ratio, digit count", "Cheap, and surprisingly strong on spam, quality and fraud"]
          ]
        }
      },

      {
        n: "The cyclical trick catches people out. Encoding the hour as 0–23 tells the model that midnight and 11pm are 23 units apart, when they are one hour apart. Two columns — sine and cosine of the angle — restore the circle. The same applies to day of week, month and compass direction.",
        nt: "The one that is not obvious"
      },

      { h: "Class imbalance" },
      {
        tbl: {
          t: "Four options, roughly in order of preference",
          h: ["Approach", "What it does", "Verdict"],
          rows: [
            ["**Change the threshold**", "Keep the model, move the decision point", "**Try this first.** Free, reversible, and usually sufficient"],
            ["**Class weights**", "`class_weight='balanced'` — errors on the rare class count more", "Cheap and effective. Second thing to try"],
            ["**Undersample the majority**", "Throw away negatives", "Loses data. Acceptable when you have millions of rows"],
            ["**SMOTE / synthetic oversampling**", "Generate synthetic minority examples", "**Popular and frequently disappointing.** Often no better than class weights, and it must go inside the cross-validation fold or it leaks"]
          ]
        }
      },

      { trap: "Never resample the test set. Balance the training data if you wish, but the test set must reflect the real class distribution or every metric you compute is fiction. Applying SMOTE before splitting — a genuinely common tutorial mistake — puts synthetic points derived from test rows into training, and the resulting scores are nonsense." },

      {
        tryit: {
          t: "Beat your own model with features",
          task: "Take a model you have already trained. Add five constructed features — a ratio, a duration, a rate, a group aggregation and a peer-relative value. Re-run cross-validation and compare. Then use permutation importance to see which of the five earned its place.",
          hint: "Add them one at a time and record the score after each. You will usually find one or two do all the work.",
          sol: { lang: "python", code: "base = cross_val_score(model, X, y, cv=5, scoring='roc_auc').mean()\nprint(f'baseline: {base:.4f}')\n\nnew = {\n    'avg_order_value': df.total_spend / df.order_count.clip(lower=1),\n    'tenure_days':     (df.last_order - df.first_order).dt.days,\n    'orders_per_month': df.order_count / ((df.last_order - df.first_order).dt.days / 30 + 1),\n    'spend_vs_segment': df.total_spend / df.groupby('segment').total_spend.transform('median'),\n    'days_since_last': (df.snapshot_date - df.last_order).dt.days,\n}\n\nX2 = X.copy()\nfor name, col in new.items():\n    X2[name] = col\n    s = cross_val_score(model, X2, y, cv=5, scoring='roc_auc').mean()\n    print(f'+ {name:<20} {s:.4f}  ({s - base:+.4f} cumulative)')" },
          w: "Two things typically happen. One feature — usually recency — gives most of the gain, and one or two give nothing at all and can be dropped for simplicity. And the total improvement is usually larger than anything hyperparameter tuning would have produced, from an hour of thinking about the domain rather than an afternoon of grid search. That ratio is the reason experienced practitioners spend their time here."
        }
      },

      { vocab: ["Feature Engineering", "One-Hot Encoding", "Normalisation", "Class Imbalance", "Data Leakage"] }
    ],
    k: [
      "One-hot by default, native categorical when available, and target encoding only inside folds.",
      "Trees need no scaling; distance-based models and neural networks always do.",
      "Missingness is often a feature — add the indicator before you impute, or let boosting handle NaN natively.",
      "Ratios, durations, rates, group aggregations and peer-relative values are the highest-yield constructions.",
      "For imbalance, change the threshold first, then class weights; never resample the test set."
    ],
    r: ["Feature Engineering", "One-Hot Encoding", "Normalisation", "Class Imbalance", "Data Leakage", "Feature Importance"],
    drill: {
      lang: "python",
      reps: 3,
      items: [
        { c: "OneHotEncoder(handle_unknown='ignore', min_frequency=20)", w: "encoding that survives unseen categories" },
        { c: "X['income_missing'] = X['income'].isna().astype(int)", w: "keep missingness as a feature before filling" },
        { c: "np.log1p(x)", w: "compress a long tail, safely with zeros" },
        { c: "df.groupby('segment').total_spend.transform('median')", w: "a peer-relative baseline per group" },
        { c: "np.sin(2 * np.pi * hour / 24)", w: "cyclical encoding, so 23:00 sits next to 01:00" }
      ]
    }
  },

  {
    t: "Advanced Feature Selection & Out-Of-Fold Encoding",
    m: "features",
    lvl: "intermediate",
    s: "Target encoding without leakage, Mutual Information, and pruning useless features cleanly.",
    goal: [
      "Implement out-of-fold target encoding to eliminate data leakage",
      "Select non-linear features using Mutual Information and RFE",
      "Reduce feature dimensions while retaining maximum predictive signal"
    ],
    b: [
      { p: "Creating 500 features from domain logic is easy; knowing which 30 actually carry signal and removing the 470 that add pure noise is what keeps production models fast, interpretable, and generalizable." },

      { h: "Out-Of-Fold Target Encoding (The safe way)" },
      { p: "Replacing high-cardinality categories (e.g. zip codes, merchant IDs) with the mean target value yields incredible signal — but simple target encoding leaks the label into the feature. Out-of-fold (OOF) encoding fixes this by computing target statistics strictly on training folds." },

      {
        code: {
          lang: "python", t: "Out-of-fold target encoder implementation",
          lines: [
            { c: "import numpy as np, pandas as pd", w: "" },
            { c: "from sklearn.model_selection import KFold", w: "" },
            { c: "", w: "" },
            { c: "def oof_target_encode(df, col, target_col, n_splits=5, smoothing=10):", w: "" },
            { c: "    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)", w: "" },
            { c: "    oof_feature = pd.Series(index=df.index, dtype=float)", w: "" },
            { c: "    global_mean = df[target_col].mean()", w: "" },
            { c: "", w: "" },
            { c: "    for tr_idx, val_idx in kf.split(df):", w: "" },
            { c: "        tr, val = df.iloc[tr_idx], df.iloc[val_idx]", w: "" },
            { c: "        # compute target means ONLY on training fold", w: "" },
            { c: "        stats = tr.groupby(col)[target_col].agg(['count', 'mean'])", w: "**Smoothed mean prevents small category overfitting.**", hi: true },
            { c: "        smooth = (stats['count'] * stats['mean'] + smoothing * global_mean) / (stats['count'] + smoothing)", w: "" },
            { c: "        oof_feature.iloc[val_idx] = val[col].map(smooth).fillna(global_mean)", w: "**Assign to out-of-fold indices.**", hi: true },
            { c: "", w: "" },
            { c: "    return oof_feature", w: "" }
          ],
          after: "With smoothing, a category seen only 2 times is pulled heavily toward the global mean, while a category seen 5,000 times keeps its exact empirical mean. And zero target leakage reaches the validation fold."
        }
      },

      { h: "Feature Selection Methods Compared" },
      {
        tbl: {
          t: "Three feature selection paradigms",
          h: ["Method", "How it works", "Pros", "Cons"],
          rows: [
            ["**Filter (Mutual Info)**", "Measures non-linear dependency between feature and target", "Blazing fast, model-agnostic, captures non-linear relationships", "Evaluates features independently (misses interactions)"],
            ["**Wrapper (RFE)**", "Recursively trains model and drops weakest feature", "Finds optimal feature subset tailored to specific algorithm", "Computationally expensive on large datasets"],
            ["**Embedded (L1 / Permutation)**", "Uses intrinsic model weights or post-hoc permutation drop", "Directly measures true predictive impact", "Tied to specific model architecture"]
          ]
        }
      },

      {
        code: {
          lang: "python", t: "Filter vs Recursive Feature Elimination",
          lines: [
            { c: "from sklearn.feature_selection import mutual_info_classif, RFE", w: "" },
            { c: "from sklearn.ensemble import RandomForestClassifier", w: "" },
            { c: "", w: "" },
            { c: "# 1. Mutual Information filter", w: "" },
            { c: "mi_scores = mutual_info_classif(X_tr, y_tr, random_state=42)", w: "**Measures non-linear dependence.**", hi: true },
            { c: "top_mi = X_tr.columns[np.argsort(mi_scores)[::-1][:15]]", w: "" },
            { c: "", w: "" },
            { c: "# 2. Recursive Feature Elimination wrapper", w: "" },
            { c: "rfe = RFE(estimator=RandomForestClassifier(n_estimators=50, random_state=42), n_features_to_select=10)", w: "" },
            { c: "rfe.fit(X_tr, y_tr)", w: "" },
            { c: "selected_cols = X_tr.columns[rfe.support_]", w: "**RFE prunes lowest-importance features iteratively.**", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Compare Mutual Information vs Correlation",
          task: "Create a non-linear target `y = sin(X1) + noise`. Compute Pearson correlation vs Mutual Information score. Observe which metric detects the non-linear relationship.",
          hint: "Pearson correlation only detects linear trends, whereas Mutual Information handles arbitrary non-linear dependencies.",
          sol: { lang: "python", code: "import numpy as np, pandas as pd\nfrom sklearn.feature_selection import mutual_info_regression\n\nrng = np.random.default_rng(42)\nX1 = rng.uniform(-3, 3, 1000)\ny = np.sin(X1) + rng.normal(0, 0.1, 1000)\n\ndf = pd.DataFrame({'x': X1})\ncorr = abs(df['x'].corr(pd.Series(y)))\nmi = mutual_info_regression(df, y, random_state=42)[0]\n\nprint(f'Pearson correlation: {corr:.4f} (looks completely uninformative!)')\nprint(f'Mutual Information : {mi:.4f} (captures strong non-linear signal!)')" },
          w: "Pearson correlation reports near zero (~0.05) for sinusoidal patterns because positive and negative slopes cancel out. Mutual Information correctly identifies a strong predictive signal (~0.52)."
        }
      },

      { vocab: ["Feature Selection"] }
    ],
    k: [
      "Target encoding without out-of-fold splitting causes severe data leakage.",
      "Mutual Information detects non-linear feature relationships where linear correlation fails.",
      "Recursive Feature Elimination (RFE) finds optimal subsets by iteratively pruning model feature importances."
    ],
    r: ["Feature Engineering", "Data Leakage", "One-Hot Encoding", "Feature Importance", "Overfitting"],
    drill: {
      lang: "python",
      reps: 3,
      items: [
        { c: "mutual_info_classif(X, y, random_state=42)", w: "non-linear feature relevance filtering" },
        { c: "RFE(estimator=model, n_features_to_select=10).fit(X, y)", w: "recursive feature elimination" },
        { c: "kf = KFold(n_splits=5, shuffle=True, random_state=42)", w: "cross-validation for out-of-fold target encoding" }
      ]
    }
  }

]);
