/* MLOps & Pipelines — Model Registries & Governance. */
TD.addLessons("mlops", [

    {
        t: "Model Registries & Lifecycle Governance — Staging to Production",
        m: "registry",
        lvl: "intermediate",
        s: "How to govern model release stages, aliases, and tags in an enterprise Model Registry.",
        goal: [
            "Understand the role of a centralized Model Registry (MLflow Model Registry / SageMaker)",
            "Register candidate models and transition lifecycle states (Staging -> Production -> Archived)",
            "Use Model Aliases (`@champion`, `@candidate`) for reliable downstream inference routing"
        ],
        b: [
            { p: "Saving a `.pkl` file on a server drive is a recipe for catastrophic outage. A Model Registry provides a centralized store for managing model metadata, versioning, stage transitions, and approval workflows." },

            { h: "Model Registry Lifecycle Stages" },
            { p: "Models progress through formal stages. A new model run begins in **Development**, is registered as a **Candidate**, undergoes automated evaluation in **Staging**, and is promoted to **Production** upon passing validation gates." },

            {
                code: {
                    lang: "python", t: "Registering a model and transitioning lifecycle stages",
                    lines: [
                        { c: "import mlflow", w: "" },
                        { c: "from mlflow.tracking import MlflowClient", w: "" },
                        { c: "", w: "" },
                        { c: "client = MlflowClient()", w: "" },
                        { c: "", w: "" },
                        { c: "# 1. Register a logged model run to the registry", w: "" },
                        { c: "run_id = 'e7a1b2c3d4e5'", w: "Run ID from MLflow experiment tracking." },
                        { c: "model_uri = f'runs:/{run_id}/model'", w: "" },
                        { c: "reg_model = mlflow.register_model(model_uri, name='Fraud_Detection_GBDT')", w: "**Creates version 1 of registered model.**", hi: true },
                        { c: "", w: "" },
                        { c: "# 2. Assign modern model alias (@champion / @candidate)", w: "" },
                        { c: "client.set_registered_model_alias(", w: "" },
                        { c: "    name='Fraud_Detection_GBDT',", w: "" },
                        { c: "    alias='champion',", w: "**Sets alias '@champion' to point to this version.**", hi: true },
                        { c: "    version=reg_model.version", w: "" },
                        { c: ")", w: "" },
                        { c: "", w: "# 3. Downstream production serving app loads by alias:" },
                        { c: "prod_model = mlflow.pyfunc.load_model('models:/Fraud_Detection_GBDT@champion')", w: "**Serving service loads latest approved champion automatically.**", hi: true }
                    ]
                }
            },

            { trap: "Hardcoding explicit version numbers (`v3`, `v4`) in microservice serving code forces code deployments every time a model is retrained. Using aliases (`@champion`) decouples model promotion from code changes." },

            { vocab: ["Model Registry", "Staging Environment", "Production Environment"] }
        ],
        k: [
            "A Model Registry governs versioning, metadata approval, and stage promotion for production models.",
            "Assign aliases like `@champion` and `@challenger` so serving microservices don't need code updates when models change.",
            "Automate stage promotions via CI/CD pipelines instead of manual manual UI updates."
        ],
        r: ["MLOps", "Model Deployment", "Reproducibility"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "mlflow.register_model(model_uri, 'MyModel')", w: "register experiment run to model registry" },
                { c: "client.set_registered_model_alias('MyModel', 'champion', '1')", w: "assign champion alias to version 1" },
                { c: "mlflow.pyfunc.load_model('models:/MyModel@champion')", w: "load latest champion model by alias" }
            ]
        }
    },

    {
        t: "CI/CD Evaluation Gating for ML Pipelines",
        m: "registry",
        lvl: "intermediate",
        s: "Automating evaluation criteria in GitHub Actions to block regression models before production.",
        goal: [
            "Build automated GitHub Actions workflows for model validation",
            "Enforce evaluation gates: metric thresholds, latency SLA, and baseline comparison",
            "Prevent silent model regression from reaching production"
        ],
        b: [
            { p: "In traditional software, CI runs unit tests to check if code breaks. In MLOps, CI/CD must also check if new model candidate weights regress on validation benchmark datasets." },

            { h: "The 3 Evaluation Gates for Candidate Models" },
            {
                tbl: {
                    t: "Model gating checklist",
                    h: ["Gate", "Check Description", "Action on Failure"],
                    rows: [
                        ["**Absolute Metric Floor**", "F1 score must exceed 0.85 on golden holdout set", "Fail CI build instantly"],
                        ["**Baseline Comparison**", "Candidate F1 must be higher than current `@champion` F1", "Reject promotion; keep existing champion"],
                        ["**Inference SLA Gate**", "p99 batch inference latency must be under 50ms", "Reject deployment due to performance SLA breach"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Python script evaluating candidate vs champion in CI",
                    lines: [
                        { c: "import sys, mlflow", w: "" },
                        { c: "from sklearn.metrics import f1_score", w: "" },
                        { c: "", w: "" },
                        { c: "# Load candidate and existing champion model", w: "" },
                        { c: "candidate = mlflow.pyfunc.load_model('models:/FraudModel@candidate')", w: "" },
                        { c: "champion  = mlflow.pyfunc.load_model('models:/FraudModel@champion')", w: "" },
                        { c: "", w: "" },
                        { c: "# Compute performance on golden test set", w: "" },
                        { c: "cand_f1 = f1_score(y_golden, candidate.predict(X_golden))", w: "" },
                        { c: "champ_f1 = f1_score(y_golden, champion.predict(X_golden))", w: "" },
                        { c: "", w: "" },
                        { c: "print(f'Candidate F1: {cand_f1:.4f} | Champion F1: {champ_f1:.4f}')", w: "" },
                        { c: "", w: "" },
                        { c: "if cand_f1 < champ_f1 + 0.01:", w: "**Require minimum +1% performance gain!**", hi: true },
                        { c: "    print('CRITICAL: Candidate failed to outperform Champion. Gating failed!')", w: "" },
                        { c: "    sys.exit(1)", w: "**Exit 1 aborts GitHub Actions workflow.**", hi: true },
                        { c: "", w: "" },
                        { c: "print('PASSED: Promoting candidate to @champion!')", w: "" }
                    ]
                }
            },

            {
                tryit: {
                    t: "Write a threshold check script",
                    task: "Complete the python snippet below so it exits with error 1 if accuracy is below 0.90.",
                    hint: "Use `if acc < 0.90: sys.exit(1)`.",
                    sol: { lang: "python", code: "import sys\nacc = 0.88\nif acc < 0.90:\n    print('Accuracy below threshold! Blocking deployment.')\n    sys.exit(1)" },
                    w: "CI script exit code 1 causes GitHub Actions or GitLab CI to fail the job and block auto-merge."
                }
            },

            { vocab: ["Golden Dataset"] }
        ],
        k: [
            "CI/CD for ML must evaluate model performance against a golden validation set before deployment.",
            "Enforce strict gating rules: minimum performance floors, superiority over current champion, and latency SLAs.",
            "Non-zero script exit codes in CI scripts halt deployment pipelines automatically when gating fails."
        ],
        r: ["MLOps", "Evaluation Metric", "Model Deployment"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "if candidate_metric < champion_metric: sys.exit(1)", w: "evaluation gating failure check" },
                { c: "mlflow.pyfunc.load_model('models:/MyModel@candidate')", w: "load candidate version for evaluation" },
                { c: "f1_score(y_golden, preds)", w: "evaluate candidate against golden benchmark set" }
            ]
        }
    }

]);
