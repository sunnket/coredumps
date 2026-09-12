/* Machine Learning — hyperparameter tuning and calibration. */
TD.addLessons("ml", [

    {
        t: "Hyperparameter Search — Grid, Random, and Bayesian Search",
        m: "tuning",
        lvl: "intermediate",
        s: "How to tune models efficiently without overfitting your validation set or wasting compute.",
        goal: [
            "Choose between Grid Search, Random Search, and Bayesian Optimization",
            "Write an Optuna study with pruning to tune LightGBM/XGBoost models",
            "Prevent hyperparameter search leakage with Nested Cross-Validation"
        ],
        b: [
            { p: "Hyperparameters govern how a model learns — tree depth, learning rate, regularization penalties. Tuning them transforms a decent model into a peak performer, but doing it blindly leads to massive compute waste and subtle validation leakage." },

            { h: "Search strategies compared" },
            {
                tbl: {
                    t: "Three optimization paradigms",
                    h: ["Strategy", "How it works", "Best when", "Main downside"],
                    rows: [
                        ["**Grid Search**", "Evaluates every combination on a fixed Cartesian grid", "Small parameter space (<3 params), deterministic baselines", "Combinatorial explosion: 5 values across 5 params = 3,125 fits"],
                        ["**Random Search**", "Samples combinations randomly from defined distributions", "High-dimensional spaces, preliminary exploration", "Does not learn from past evaluations; samples blindly"],
                        ["**Bayesian (TPE)**", "Builds a probabilistic model of score vs params to pick next trial", "Fine-tuning complex models (GBDTs, Neural Nets)", "Sequential evaluation makes parallelization trickier"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Bayesian optimization with Optuna",
                    lines: [
                        { c: "import optuna", w: "" },
                        { c: "from lightgbm import LGBMClassifier", w: "" },
                        { c: "from sklearn.model_selection import cross_val_score", w: "" },
                        { c: "", w: "" },
                        { c: "def objective(trial):", w: "" },
                        { c: "    # 1. Define hyperparameter search space", w: "" },
                        { c: "    params = {", w: "" },
                        { c: "        'n_estimators': trial.suggest_int('n_estimators', 50, 500),", w: "" },
                        { c: "        'max_depth': trial.suggest_int('max_depth', 3, 10),", w: "" },
                        { c: "        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),", w: "**Log scale for learning rates.**", hi: true },
                        { c: "        'subsample': trial.suggest_float('subsample', 0.5, 1.0),", w: "" },
                        { c: "        'random_state': 42,", w: "" },
                        { c: "    }", w: "" },
                        { c: "    clf = LGBMClassifier(**params)", w: "" },
                        { c: "    # 2. Evaluate using internal cross-validation", w: "" },
                        { c: "    return cross_val_score(clf, X_tr, y_tr, cv=5, scoring='f1').mean()", w: "**Returns target metric to maximize.**", hi: true },
                        { c: "", w: "" },
                        { c: "study = optuna.create_study(direction='maximize')", w: "" },
                        { c: "study.optimize(objective, n_trials=50)", w: "**Run 50 Bayesian optimization trials.**", hi: true },
                        { c: "print(f'Best F1: {study.best_value:.3f}')", w: "" },
                        { c: "print('Best Params:', study.best_params)", w: "" }
                    ],
                    out: "Best F1: 0.814\nBest Params: {'n_estimators': 240, 'max_depth': 6, 'learning_rate': 0.042, 'subsample': 0.82}"
                }
            },

            {
                n: "Always use `log=True` when sampling parameters that span orders of magnitude (like learning rates `0.001` to `0.1` or regularisation `C` `0.01` to `100`). Sampling uniformly would spend 90% of trials testing values above 10 and ignore the 0.001–0.1 range where the optimal answer usually lives.",
                nt: "Log scale sampling"
            },

            { h: "Pruning unpromising trials" },
            { p: "When running 100 trials, wasting time fully training a model whose early epochs/folds are clearly failing is inefficient. Optuna's `MedianPruner` stops unpromising trials early." },

            {
                code: {
                    lang: "python", t: "Trial pruning in Optuna",
                    lines: [
                        { c: "study = optuna.create_study(", w: "" },
                        { c: "    direction='maximize',", w: "" },
                        { c: "    pruner=optuna.pruners.MedianPruner(n_warmup_steps=5)", w: "**Stop trial if early score is below median.**", hi: true },
                        { c: ")", w: "" }
                    ]
                }
            },

            { h: "Nested Cross-Validation (The leak-free evaluation)" },
            { p: "If you try 200 hyperparameter combinations on a single validation split and pick the best one, your validation score becomes optimistically biased. Nested CV uses an outer loop for evaluation and an inner loop for hyperparameter search." },

            {
                tbl: {
                    t: "Nested CV structure",
                    h: ["Loop", "Purpose", "Operation"],
                    rows: [
                        ["**Outer Loop (5 folds)**", "Estimates true generalisation score", "Splits data into train_outer and test_outer"],
                        ["**Inner Loop (3 folds)**", "Finds optimal hyperparameters", "Runs Optuna / GridSearchCV on train_outer only"]
                    ]
                }
            },

            {
                tryit: {
                    t: "Tune a Gradient Boosting model with Optuna",
                    task: "Build a small Optuna objective function for a RandomForest. Search `max_depth` (2 to 12) and `n_estimators` (20 to 150). Print the best trial number and score.",
                    hint: "Use `trial.suggest_int('max_depth', 2, 12)` inside the objective.",
                    sol: { lang: "python", code: "import optuna\nfrom sklearn.datasets import make_classification\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\n\nX, y = make_classification(n_samples=1000, n_features=15, random_state=42)\n\ndef objective(trial):\n    d = trial.suggest_int('max_depth', 2, 12)\n    n = trial.suggest_int('n_estimators', 20, 150)\n    clf = RandomForestClassifier(max_depth=d, n_estimators=n, random_state=42)\n    return cross_val_score(clf, X, y, cv=3, scoring='roc_auc').mean()\n\nstudy = optuna.create_study(direction='maximize')\nstudy.optimize(objective, n_trials=20)\nprint('Best trial:', study.best_trial.number)\nprint('Best params:', study.best_params)\nprint('Best ROC-AUC:', round(study.best_value, 4))" },
                    w: "Notice how Bayesian optimization zeroes in on the optimal region in fewer than 20 trials, compared to grid search which would require evaluating every grid point sequentially."
                }
            },

            { vocab: ["Hyperparameter Tuning", "Grid Search"] }
        ],
        k: [
            "Random search beats grid search when tuning high-dimensional spaces; Bayesian optimization with Optuna beats both.",
            "Use log-scale sampling for parameters spanning multiple orders of magnitude (learning rate, C, alpha).",
            "Nested cross-validation separates the evaluation fold from the hyperparameter selection loop, preventing optimistic tuning bias."
        ],
        r: ["Cross-Validation", "Overfitting", "Gradient Boosting", "Random Forest", "Data Leakage"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "trial.suggest_float('lr', 1e-4, 1e-1, log=True)", w: "sample learning rate on logarithmic scale" },
                { c: "optuna.create_study(direction='maximize').optimize(obj, n_trials=50)", w: "run Bayesian hyperparameter search" },
                { c: "cross_val_score(clf, X_tr, y_tr, cv=5)", w: "inner fold evaluation for parameter tuning" }
            ]
        }
    },

    {
        t: "Model Probability Calibration and Thresholding",
        m: "tuning",
        lvl: "intermediate",
        s: "Why model probability predictions lie, and how to calibrate them for decision-making.",
        goal: [
            "Diagnose uncalibrated probabilities using reliability diagrams",
            "Apply Platt Scaling and Isotonic Regression with CalibratedClassifierCV",
            "Evaluate calibration quality using the Brier score metric"
        ],
        b: [
            { p: "When a model outputs `0.85` probability of default for a loan, does that mean 85 out of 100 such applicants actually default? For gradient boosted trees and neural networks, almost certainly not. Modern complex models are often heavily uncalibrated." },

            { h: "The Calibration Problem" },
            { p: "A model is **well-calibrated** if a predicted probability of $p$ matches the empirical frequency of the positive class being $p$. Non-linear tree ensembles push probabilities away from 0.5 toward 0 and 1, creating overconfident predictions." },

            {
                tbl: {
                    t: "Calibration characteristics across algorithms",
                    h: ["Algorithm", "Calibration Status", "Why"],
                    rows: [
                        ["**Logistic Regression**", "**Naturally Calibrated**", "Directly optimizes log-loss (cross-entropy) over linear sum"],
                        ["**Random Forest**", "**Squeezed (underconfident)**", "Averaging tree predictions keeps probabilities away from 0 and 1"],
                        ["**Gradient Boosting (XGB/LGBM)**", "**Overconfident**", "Boosting focuses heavily on hard boundary examples, distorting probabilities"],
                        ["**Naïve Bayes**", "**Extreme (pushed to 0 and 1)**", "Assumes feature independence, multiplying probabilities aggressively"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Checking calibration with scikit-learn",
                    lines: [
                        { c: "from sklearn.calibration import calibration_curve, CalibratedClassifierCV", w: "" },
                        { c: "from sklearn.metrics import brier_score_loss", w: "" },
                        { c: "", w: "" },
                        { c: "# 1. Compute reliability curve points", w: "" },
                        { c: "prob_true, prob_pred = calibration_curve(y_val, probs, n_bins=10)", w: "**Divides predictions into 10 probability bins.**", hi: true },
                        { c: "", w: "" },
                        { c: "# 2. Brier score measures mean squared error of probabilities", w: "" },
                        { c: "brier = brier_score_loss(y_val, probs)", w: "**Lower is better (0.0 is perfect calibration).**", hi: true },
                        { c: "print(f'Uncalibrated Brier Score: {brier:.4f}')" }
                    ]
                }
            },

            { h: "Calibrating a model after training" },
            { p: "Scikit-learn's `CalibratedClassifierCV` fits a secondary mapping model on held-out validation data to transform raw model scores into true probabilities." },

            {
                tbl: {
                    t: "Platt Scaling vs Isotonic Regression",
                    h: ["Method", "Mapping Function", "Best for", "Data Requirement"],
                    rows: [
                        ["**Platt Scaling (`method='sigmoid'`)**", "Logistic sigmoid curve", "Small validation datasets (<1,000 rows), smooth calibration curves", "Low data requirement"],
                        ["**Isotonic Regression (`method='isotonic'`)**", "Non-parametric step function", "Large datasets (>1,000 rows), arbitrary non-linear distortions", "High data requirement (overfits on small data)"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Calibrating a boosted tree model",
                    lines: [
                        { c: "from sklearn.calibration import CalibratedClassifierCV", w: "" },
                        { c: "from sklearn.ensemble import HistGradientBoostingClassifier", w: "" },
                        { c: "", w: "" },
                        { c: "base_model = HistGradientBoostingClassifier(random_state=42)", w: "" },
                        { c: "", w: "" },
                        { c: "# Wrap base model in calibrator using 5-fold CV", w: "" },
                        { c: "calibrated_model = CalibratedClassifierCV(", w: "" },
                        { c: "    estimator=base_model,", w: "" },
                        { c: "    method='isotonic',", w: "**Use isotonic for large validation sets.**", hi: true },
                        { c: "    cv=5", w: "" },
                        { c: ")", w: "" },
                        { c: "calibrated_model.fit(X_tr, y_tr)", w: "" },
                        { c: "cal_probs = calibrated_model.predict_proba(X_te)[:, 1]", w: "**Now true probabilities reflect actual risk.**", hi: true }
                    ]
                }
            },

            {
                tryit: {
                    t: "Compare raw vs calibrated Brier score",
                    task: "Train a GaussianNB classifier on synthetic data. Compute its Brier score before and after calibrating with `CalibratedClassifierCV(method='sigmoid')`.",
                    hint: "Use `brier_score_loss(y_te, probs)` from `sklearn.metrics`.",
                    sol: { lang: "python", code: "from sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.calibration import CalibratedClassifierCV\nfrom sklearn.metrics import brier_score_loss\n\nX, y = make_classification(n_samples=2000, random_state=42)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=42)\n\ngnb = GaussianNB().fit(X_tr, y_tr)\nraw_probs = gnb.predict_proba(X_te)[:, 1]\nprint('Raw GNB Brier Score       :', round(brier_score_loss(y_te, raw_probs), 4))\n\ncal_gnb = CalibratedClassifierCV(GaussianNB(), method='sigmoid', cv=5).fit(X_tr, y_tr)\ncal_probs = cal_gnb.predict_proba(X_te)[:, 1]\nprint('Calibrated GNB Brier Score:', round(brier_score_loss(y_te, cal_probs), 4))" },
                    w: "Notice how calibration drastically reduces the Brier score. Calibrated probabilities allow downstream risk management systems to calculate accurate expected values (Expected Loss = Probability * Cost)."
                }
            },

            ],
        k: [
            "Gradient boosting and neural networks produce uncalibrated probabilities; logistic regression is naturally calibrated.",
            "Brier score measures the mean squared error between predicted probabilities and actual binary outcomes.",
            "Use Platt Scaling (`sigmoid`) for small datasets; use Isotonic Regression (`isotonic`) when ample validation data is available."
        ],
        r: ["Precision", "Recall", "Logistic Regression", "Gradient Boosting", "Evaluation Metric"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "calibration_curve(y_true, probs, n_bins=10)", w: "compute points for reliability diagram" },
                { c: "brier_score_loss(y_true, probs)", w: "measure probability calibration error" },
                { c: "CalibratedClassifierCV(model, method='isotonic', cv=5)", w: "calibrate model output probabilities using CV" }
            ]
        }
    }

]);
