/* Machine Learning — time series and forecasting. */
TD.addLessons("ml", [

    {
        t: "Time Series Feature Engineering & Walk-Forward Validation",
        m: "timeseries",
        lvl: "intermediate",
        s: "How to frame time series as supervised tabular learning without leaking future signal.",
        goal: [
            "Build temporal features: lags, rolling statistics, and cyclical calendar signals",
            "Implement expanding-window and rolling walk-forward validation",
            "Transform non-stationary target series into stationary signals"
        ],
        b: [
            { p: "Time series forecasting is supervised learning where time dictates the order. Random train-test splitting on time series is the single fastest way to create a false 99% accuracy model that loses money in production." },

            { h: "Feature Engineering for Time Series" },
            { p: "Supervised models (like LightGBM or XGBoost) do not know about time sequences natively. You must convert sequential observations into tabular columns representing the past." },

            {
                code: {
                    lang: "python", t: "Generating lags, rolling stats, and calendar features",
                    lines: [
                        { c: "import pandas as pd, numpy as np", w: "" },
                        { c: "", w: "" },
                        { c: "# Assume df has datetime index and 'sales' column", w: "" },
                        { c: "df = df.sort_index()", w: "**Ensure chronological order before creating lags.**", hi: true },
                        { c: "", w: "" },
                        { c: "# 1. Lag features (values from previous time steps)", w: "" },
                        { c: "df['lag_1'] = df['sales'].shift(1)", w: "Value from 1 period ago." },
                        { c: "df['lag_7'] = df['sales'].shift(7)", w: "Same day last week for daily series." },
                        { c: "", w: "" },
                        { c: "# 2. Rolling window aggregations (moving averages)", w: "" },
                        { c: "df['rolling_mean_7'] = df['sales'].shift(1).rolling(window=7).mean()", w: "**Shift(1) before rolling prevents target leakage!**", hi: true },
                        { c: "df['rolling_std_7']  = df['sales'].shift(1).rolling(window=7).std()", w: "" },
                        { c: "", w: "" },
                        { c: "# 3. Cyclical calendar features", w: "" },
                        { c: "df['dayofweek'] = df.index.dayofweek", w: "" },
                        { c: "df['sin_day']   = np.sin(2 * np.pi * df['dayofweek'] / 7)", w: "**Cyclical encoding preserves sunday-monday continuity.**", hi: true },
                        { c: "df['cos_day']   = np.cos(2 * np.pi * df['dayofweek'] / 7)", w: "" },
                        { c: "", w: "" },
                        { c: "df = df.dropna()", w: "Drop initial rows created by shift offsets." }
                    ],
                    after: "Notice the `.shift(1)` before computing `.rolling()`. If you compute rolling mean on unshifted sales at time $t$, the current target $y_t$ leaks into feature $x_t$, invalidating the split."
                }
            },

            { trap: "Computing rolling features without a `.shift(1)` offset includes the current timestamp's value in the feature calculation. Your model will score 0.99 during training because it is effectively reading the label from its inputs." },

            { h: "Walk-Forward (Expanding / Rolling Window) Cross-Validation" },
            { p: "In production, models are trained on past history and evaluate predictions into the future. Cross-validation must mimic this exact temporal progression." },

            {
                tbl: {
                    t: "Time series split strategies",
                    h: ["Strategy", "Training Window", "Validation Window", "Best For"],
                    rows: [
                        ["**Expanding Window**", "Grows over time (e.g. T1..T10, then T1..T11)", "Fixed horizon into future (e.g. T11, then T12)", "Datasets where historical patterns remain relevant indefinitely"],
                        ["**Rolling Window**", "Fixed size sliding forward (e.g. last 365 days)", "Fixed horizon into future (e.g. next 30 days)", "Fast-changing domains where ancient history is obsolete"],
                        ["**TimeSeriesSplit**", "Scikit-learn built-in expanding split", "Successive future folds", "Standard baseline evaluation"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Implementing TimeSeriesSplit in scikit-learn",
                    lines: [
                        { c: "from sklearn.model_selection import TimeSeriesSplit", w: "" },
                        { c: "from lightgbm import LGBMRegressor", w: "" },
                        { c: "from sklearn.metrics import mean_absolute_error", w: "" },
                        { c: "", w: "" },
                        { c: "tscv = TimeSeriesSplit(n_splits=5)", w: "**5 temporal folds sliding into the future.**", hi: true },
                        { c: "maes = []", w: "" },
                        { c: "", w: "" },
                        { c: "for train_idx, val_idx in tscv.split(X):", w: "" },
                        { c: "    X_tr, X_va = X.iloc[train_idx], X.iloc[val_idx]", w: "" },
                        { c: "    y_tr, y_va = y.iloc[train_idx], y.iloc[val_idx]", w: "" },
                        { c: "    ", w: "" },
                        { c: "    model = LGBMRegressor(n_estimators=100, random_state=42).fit(X_tr, y_tr)", w: "" },
                        { c: "    preds = model.predict(X_va)", w: "" },
                        { c: "    maes.append(mean_absolute_error(y_va, preds))", w: "" },
                        { c: "", w: "" },
                        { c: "print(f'Walk-Forward MAE: {np.mean(maes):.2f} +/- {np.std(maes):.2f}')", w: "**Report mean and variance across temporal folds.**", hi: true }
                    ]
                }
            },

            {
                tryit: {
                    t: "Build time-lagged features",
                    task: "Take a pandas Series of 100 values. Create lag 1, lag 2, and rolling 3-period mean features. Verify that row 5 contains no future label information.",
                    hint: "Use `s.shift(1).rolling(3).mean()`.",
                    sol: { lang: "python", code: "import pandas as pd, numpy as np\n\ns = pd.Series(np.arange(10, 20), name='target')\ndf = pd.DataFrame({'target': s})\ndf['lag_1'] = df['target'].shift(1)\ndf['lag_2'] = df['target'].shift(2)\ndf['roll_3'] = df['target'].shift(1).rolling(3).mean()\nprint(df.dropna().head())" },
                    w: "Verifying that features at index T depend strictly on index T-1, T-2, etc. guarantees zero temporal leakage."
                }
            },

            { vocab: ["Time Series Forecasting"] }
        ],
        k: [
            "Time series data must be evaluated chronologically — random splitting leaks future information.",
            "Always `.shift(1)` before computing rolling window metrics to prevent target leakage.",
            "Use `TimeSeriesSplit` or rolling walk-forward validation to mirror real-world deployment."
        ],
        r: ["Data Leakage", "Cross-Validation", "Feature Engineering", "Training Data"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "df['lag_1'] = df['sales'].shift(1)", w: "lag feature for previous timestamp" },
                { c: "df['sales'].shift(1).rolling(7).mean()", w: "rolling average without target leakage" },
                { c: "TimeSeriesSplit(n_splits=5)", w: "temporal cross-validation split" }
            ]
        }
    },

    {
        t: "Forecasting Metrics & Multi-Step Prediction Strategies",
        m: "timeseries",
        lvl: "intermediate",
        s: "Evaluating time series models properly and predicting multiple horizons into the future.",
        goal: [
            "Choose proper time series metrics: WAPE, MASE, MAE over flawed MAPE",
            "Implement Direct vs Recursive multi-step forecasting strategies",
            "Construct quantile regression models for prediction intervals"
        ],
        b: [
            { p: "Predicting the next single step (t+1) is simple; predicting demand across the next 30 days requires choosing between recursive error accumulation, direct multi-model strategies, and probabilistic uncertainty bounds." },

            { h: "Forecasting Evaluation Metrics" },
            {
                tbl: {
                    t: "Metrics for time series evaluation",
                    h: ["Metric", "Formula / Concept", "Strengths", "Weaknesses / Flaws"],
                    rows: [
                        ["**MAE**", "`mean(|y - y_hat|)`", "Interpretable in target units", "Not scale-comparable across different series"],
                        ["**WAPE**", "`Σ|y - y_hat| / Σ y`", "Scale-calibrated, robust to zeros", "Weighted by overall volume"],
                        ["**MAPE**", "`mean(|y - y_hat| / y)`", "Percentage scale", "**Fails completely when actual y = 0** (division by zero)"],
                        ["**MASE**", "Error divided by naive baseline error", "Scale-independent, compares vs trivial benchmark", "Slightly less intuitive to business stakeholders"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Computing WAPE (Weighted Absolute Percentage Error)",
                    lines: [
                        { c: "import numpy as np", w: "" },
                        { c: "", w: "" },
                        { c: "def wape(y_true, y_pred):", w: "" },
                        { c: "    return np.sum(np.abs(y_true - y_pred)) / np.sum(np.abs(y_true))", w: "**Handles zero actuals gracefully.**", hi: true },
                        { c: "", w: "" },
                        { c: "y_true = np.array([0, 10, 50, 100])", w: "" },
                        { c: "y_pred = np.array([2, 12, 48, 95])", w: "" },
                        { c: "print(f'WAPE: {wape(y_true, y_pred):.2%}')", w: "" }
                    ],
                    out: "WAPE: 5.62%"
                }
            },

            { h: "Multi-Step Forecasting Strategies" },
            { p: "When you need to forecast $H$ steps into the future (e.g. 7 days ahead), there are two main architectures." },

            {
                tbl: {
                    t: "Recursive vs Direct forecasting",
                    h: ["Strategy", "How it works", "Pros", "Cons"],
                    rows: [
                        ["**Recursive (Autoregressive)**", "Train one t+1 model. Feed its own predictions back as lags for t+2, t+3...", "Requires only 1 model", "Errors compound exponentially over long horizons"],
                        ["**Direct Multi-Model**", "Train $H$ separate models ($M_1$ for t+1, $M_2$ for t+2... $M_H$ for t+H)", "No error compounding across horizons", "Requires training and maintaining $H$ distinct models"],
                        ["**Joint Multi-Output**", "Single neural net or tree model predicting vector $[y_{t+1}, ..., y_{t+H}]$", "Learns cross-horizon correlations in single fit", "Requires multi-output capable architecture"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Direct multi-horizon forecasting with scikit-learn",
                    lines: [
                        { c: "from lightgbm import LGBMRegressor", w: "" },
                        { c: "", w: "" },
                        { c: "# Direct strategy: train separate model per horizon step", w: "" },
                        { c: "horizon_models = {}", w: "" },
                        { c: "for h in range(1, 8):  # Predict days 1 to 7 ahead", w: "" },
                        { c: "    y_h = df['sales'].shift(-h).dropna()", w: "**Target shifted backwards by horizon step.**", hi: true },
                        { c: "    X_h = X.iloc[:len(y_h)]", w: "" },
                        { c: "    ", w: "" },
                        { c: "    m = LGBMRegressor(n_estimators=50, random_state=42).fit(X_h, y_h)", w: "" },
                        { c: "    horizon_models[f'day_{h}'] = m", w: "" }
                    ]
                }
            },

            { h: "Quantile Regression for Prediction Intervals" },
            { p: "Point forecasts (single numbers) carry zero indication of risk. Quantile regression fits lower (10th percentile) and upper (90th percentile) bounds around the forecast." },

            {
                code: {
                    lang: "python", t: "Quantile regression with LightGBM",
                    lines: [
                        { c: "from lightgbm import LGBMRegressor", w: "" },
                        { c: "", w: "" },
                        { c: "# Fit 10th percentile (lower bound)", w: "" },
                        { c: "model_low = LGBMRegressor(objective='quantile', alpha=0.10).fit(X_tr, y_tr)", w: "" },
                        { c: "# Fit 50th percentile (median forecast)", w: "" },
                        { c: "model_mid = LGBMRegressor(objective='quantile', alpha=0.50).fit(X_tr, y_tr)", w: "" },
                        { c: "# Fit 90th percentile (upper bound)", w: "" },
                        { c: "model_hi  = LGBMRegressor(objective='quantile', alpha=0.90).fit(X_tr, y_tr)", w: "" },
                        { c: "", w: "" },
                        { c: "low_pred = model_low.predict(X_val)", w: "" },
                        { c: "mid_pred = model_mid.predict(X_val)", w: "" },
                        { c: "hi_pred  = model_hi.predict(X_val)", w: "**Now business has an 80% prediction interval.**", hi: true }
                    ]
                }
            },

            {
                tryit: {
                    t: "Compute WAPE vs MAPE",
                    task: "Given actuals `[0, 5, 10, 20]` and predictions `[1, 4, 11, 19]`, calculate WAPE. Try calculating MAPE and explain why it fails.",
                    hint: "MAPE contains `abs(0 - 1) / 0` which yields `inf`.",
                    sol: { lang: "python", code: "import numpy as np\ny_act = np.array([0, 5, 10, 20])\ny_pred = np.array([1, 4, 11, 19])\n\nwape = np.sum(np.abs(y_act - y_pred)) / np.sum(np.abs(y_act))\nprint(f'WAPE score: {wape:.2%}')\n\ntry:\n    mape = np.mean(np.abs((y_act - y_pred) / y_act))\n    print('MAPE score:', mape)\nexcept Exception as e:\n    print('MAPE failed with error:', e)" },
                    w: "Because y_act contains a 0, standard MAPE raises a division by zero warning or produces infinity. WAPE sums overall absolute error before dividing by total volume, avoiding zero division."
                }
            },

            ],
        k: [
            "Avoid MAPE on data containing zeros; use WAPE or MASE for scale-independent metrics.",
            "Direct multi-step forecasting trains H separate models to prevent recursive error compounding.",
            "Quantile regression estimates prediction intervals (e.g. 10th and 90th percentiles) for risk management."
        ],
        r: ["Time Series Forecasting", "LightGBM", "Evaluation Metric"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "wape = np.sum(np.abs(y - y_hat)) / np.sum(np.abs(y))", w: "weighted absolute percentage error" },
                { c: "LGBMRegressor(objective='quantile', alpha=0.1)", w: "10th percentile quantile loss regression" },
                { c: "y_h = df['sales'].shift(-h)", w: "target creation for step h direct forecasting" }
            ]
        }
    }

]);
