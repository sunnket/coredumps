/* MLOps & Pipelines — Data Drift & Model Observability. */
TD.addLessons("mlops", [

    {
        t: "Data & Concept Drift Monitoring with Evidently AI & PSI",
        m: "monitoring",
        lvl: "intermediate",
        s: "How to detect statistical distribution shifts in live input features and target targets.",
        goal: [
            "Distinguish Data Drift (input features shifted) vs Concept Drift (feature-target relationship shifted)",
            "Calculate Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) test statistics",
            "Generate statistical drift reports using Evidently AI"
        ],
        b: [
            { p: "A software API that works today will work tomorrow unless code changes. An ML model can break silently tomorrow because the underlying real-world data distribution moved (Data Drift) or customer habits changed (Concept Drift)." },

            { h: "Data Drift vs Concept Drift" },
            {
                tbl: {
                    t: "Types of model degradation in production",
                    h: ["Drift Type", "Definition", "Example Scenario", "Detection Method"],
                    rows: [
                        ["**Data Drift (Covariate Shift)**", "Distribution of input $P(X)$ changes over time", "Inflation causes average loan request amount to double", "PSI > 0.2, Kolmogorov-Smirnov test"],
                        ["**Concept Drift**", "Relationship between inputs and target $P(Y|X)$ changes", "Post-pandemic remote work changes fraud patterns", "Tracking live accuracy/MAE on labeled feedback"],
                        ["**Prior Drift (Label Shift)**", "Distribution of target variable $P(Y)$ changes", "Systemic recession increases overall default rate", "Monitoring target distribution variance"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Calculating Population Stability Index (PSI) in Python",
                    lines: [
                        { c: "import numpy as np", w: "" },
                        { c: "", w: "" },
                        { c: "def calculate_psi(baseline, target, num_bins=10):", w: "" },
                        { c: "    # Bin data into quantile buckets", w: "" },
                        { c: "    quantiles = np.linspace(0, 100, num_bins + 1)", w: "" },
                        { c: "    bins = np.percentile(baseline, quantiles)", w: "" },
                        { c: "    ", w: "" },
                        { c: "    # Compute relative frequencies", w: "" },
                        { c: "    base_counts = np.histogram(baseline, bins=bins)[0] / len(baseline)", w: "" },
                        { c: "    target_counts = np.histogram(target, bins=bins)[0] / len(target)", w: "" },
                        { c: "    ", w: "" },
                        { c: "    # Prevent log(0) division", w: "" },
                        { c: "    base_counts = np.where(base_counts == 0, 0.0001, base_counts)", w: "" },
                        { c: "    target_counts = np.where(target_counts == 0, 0.0001, target_counts)", w: "" },
                        { c: "    ", w: "" },
                        { c: "    # Formula: sum((Target % - Base %) * ln(Target % / Base %))", w: "" },
                        { c: "    psi = np.sum((target_counts - base_counts) * np.log(target_counts / base_counts))", w: "**Standard PSI formula.**", hi: true },
                        { c: "    return psi", w: "" },
                        { c: "", w: "" },
                        { c: "psi_score = calculate_psi(reference_features, production_features)", w: "" },
                        { c: "print(f'Feature Drift PSI: {psi_score:.4f}')", w: "**PSI > 0.2 indicates significant data drift!**", hi: true }
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Generating Evidently AI drift report HTML dashboard",
                    lines: [
                        { c: "from evidently.report import Report", w: "" },
                        { c: "from evidently.metric_preset import DataDriftPreset", w: "" },
                        { c: "", w: "" },
                        { c: "# Compare training reference dataset against live production batch", w: "" },
                        { c: "drift_report = Report(metrics=[DataDriftPreset()])", w: "" },
                        { c: "drift_report.run(reference_data=ref_df, current_data=prod_df)", w: "**Run drift check across all columns.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Save interactive visual report", w: "" },
                        { c: "drift_report.save_html('reports/data_drift_dashboard.html')", w: "Generates visual inspection report." }
                    ]
                }
            },

            {
                tryit: {
                    t: "Interpret PSI threshold",
                    task: "If feature 'user_age' has a PSI score of 0.28 between training and current month, what should the MLOps pipeline do?",
                    hint: "PSI > 0.2 indicates high drift requiring model retraining or feature investigation.",
                    sol: { lang: "text", code: "Trigger an automated retraining alert! PSI > 0.2 indicates significant data drift requiring retraining on recent data or updating feature preprocessing." },
                    w: "Industry standard PSI interpretation: <0.1 (No drift), 0.1–0.2 (Moderate drift), >0.2 (Significant drift)."
                }
            },

            { vocab: ["Data Drift", "Concept Drift"] }
        ],
        k: [
            "Data drift happens when input feature distributions shift; Concept drift occurs when the target relationship changes.",
            "PSI (Population Stability Index) > 0.2 is the universal signal for significant feature drift.",
            "Evidently AI automates statistical hypothesis testing and generates visual drift dashboards for production monitoring."
        ],
        r: ["MLOps", "Evaluation Metric", "Model Drift"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "psi = np.sum((target_pct - base_pct) * np.log(target_pct / base_pct))", w: "calculate population stability index" },
                { c: "drift_report = Report(metrics=[DataDriftPreset()])", w: "initialize evidently data drift report" },
                { c: "drift_report.run(reference_data=df_ref, current_data=df_prod)", w: "run drift analysis on production batch" }
            ]
        }
    },

    {
        t: "Production Alerting, Rollback & Automated Fallback",
        m: "monitoring",
        lvl: "advanced",
        s: "How to build self-healing ML pipelines with instant rollback and rule-based fallback heuristics.",
        goal: [
            "Set up Prometheus & Grafana alerting rules for drift & latency breaches",
            "Implement automated rollback mechanisms to restore previous `@champion` versions",
            "Design fallback heuristics (e.g. rule-based decision trees) when ML service fails"
        ],
        b: [
            { p: "When an ML model fails or outputs invalid predictions in production, the system must degrade gracefully. Having an automated fallback heuristic or instant rollback mechanism ensures business continuity." },

            { h: "The 3 Layers of Resilience" },
            {
                tbl: {
                    t: "ML System failure safeguards",
                    h: ["Layer", "Trigger Condition", "Automated Action"],
                    rows: [
                        ["**1. Instant Rollback**", "Model error rate > 1% or latency > 200ms", "Revert `@champion` alias to previous version instantly via API"],
                        ["**2. Automated Fallback**", "Inference service timed out or unavailable", "Route requests to rule-based fallback heuristic (e.g. baseline average)"],
                        ["**3. Retraining Trigger**", "PSI > 0.20 on critical features", "Emit webhook payload to trigger Airflow DAG retraining pipeline"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "FastAPI inference handler with rule-based fallback",
                    lines: [
                        { c: "from fastapi import FastAPI", w: "" },
                        { c: "import logging", w: "" },
                        { c: "", w: "" },
                        { c: "app = FastAPI()", w: "" },
                        { c: "", w: "" },
                        { c: "def rule_based_fallback(user_data):", w: "" },
                        { c: "    # Simple deterministic heuristic if model inference crashes", w: "" },
                        { c: "    if user_data['credit_score'] > 750: return 0.05", w: "" },
                        { c: "    return 0.50", w: "Conservative default estimate." },
                        { c: "", w: "" },
                        { c: "@app.post('/predict_safe')", w: "" },
                        { c: "async def predict_safe(req: UserSchema):", w: "" },
                        { c: "    try:", w: "" },
                        { c: "        # Primary path: ML Model prediction", w: "" },
                        { c: "        prediction = model.predict(req.to_numpy())", w: "" },
                        { c: "        return {'status': 'success', 'prediction': float(prediction)}", w: "" },
                        { c: "    except Exception as e:", w: "" },
                        { c: "        logging.error(f'ML Model inference failed! Falling back to rule engine. Error: {e}')", w: "**Log failure alert.**", hi: true },
                        { c: "        fallback_val = rule_based_fallback(req.dict())", w: "" },
                        { c: "        return {'status': 'fallback', 'prediction': fallback_val}", w: "**Ensures service returns 200 OK.**", hi: true }
                    ]
                }
            },

            { vocab: ["Rollback", "Prometheus"] }
        ],
        k: [
            "Always wrap model inference in try-except blocks that call deterministic rule-based fallback heuristics.",
            "Configure Prometheus alert manager to trigger automated rollback to the previous `@champion` model version.",
            "Log status flags (`success` vs `fallback`) in response payloads for production observability."
        ],
        r: ["MLOps", "Model Serving", "Rollback", "Observability"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "except Exception: return rule_based_fallback(data)", w: "graceful fallback heuristic execution" },
                { c: "client.set_registered_model_alias(name, 'champion', prev_version)", w: "rollback champion alias to previous version" },
                { c: "logger.error('Model failure, fallback engaged')", w: "log production fallback event for alerting" }
            ]
        }
    }

]);
