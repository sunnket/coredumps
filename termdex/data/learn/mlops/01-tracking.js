/* MLOps & Pipelines — Experiment tracking & Data versioning. */
TD.addLessons("mlops", [

    {
        t: "Experiment Tracking with MLflow — Runs, Parameters & Artifacts",
        m: "tracking",
        lvl: "core",
        s: "How to log hyperparameter searches, metrics, and trained model artifacts systematically.",
        goal: [
            "Initialize MLflow experiments and structure runs programmatically",
            "Log hyperparameters, training/validation metrics, and model artifacts",
            "Compare runs using MLflow UI and retrieve best models via API"
        ],
        b: [
            { p: "When training machine learning models, ad-hoc tracking in spreadsheet rows or text files breaks down fast. Experiment tracking provides an automated audit trail for every hyperparameter, dataset version, and output artifact." },

            { h: "The Anatomy of an MLflow Run" },
            { p: "MLflow organizes experiment tracking into three primary entities: **Parameters** (inputs like learning rate or depth), **Metrics** (scalar outputs like loss or accuracy logged across epochs), and **Artifacts** (binary files like model weights, plots, or confusion matrices)." },

            {
                code: {
                    lang: "python", t: "Logging an experiment run with MLflow",
                    lines: [
                        { c: "import mlflow", w: "" },
                        { c: "import mlflow.sklearn", w: "" },
                        { c: "from sklearn.ensemble import RandomForestClassifier", w: "" },
                        { c: "from sklearn.metrics import accuracy_score, f1_score", w: "" },
                        { c: "", w: "" },
                        { c: "# Set or create an experiment", w: "" },
                        { c: "mlflow.set_experiment('Customer_Churn_V1')", w: "**Groups related runs together.**", hi: true },
                        { c: "", w: "" },
                        { c: "with mlflow.start_run(run_name='rf_trees_100_depth_10'):", w: "Context manager automatically handles run completion." },
                        { c: "    # 1. Log hyperparameters", w: "" },
                        { c: "    params = {'n_estimators': 100, 'max_depth': 10, 'random_state': 42}", w: "" },
                        { c: "    mlflow.log_params(params)", w: "**Logs key-value parameters.**", hi: true },
                        { c: "", w: "" },
                        { c: "    # 2. Train model", w: "" },
                        { c: "    model = RandomForestClassifier(**params)", w: "" },
                        { c: "    model.fit(X_train, y_train)", w: "" },
                        { c: "", w: "" },
                        { c: "    # 3. Log evaluation metrics", w: "" },
                        { c: "    preds = model.predict(X_val)", w: "" },
                        { c: "    mlflow.log_metric('val_accuracy', accuracy_score(y_val, preds))", w: "" },
                        { c: "    mlflow.log_metric('val_f1', f1_score(y_val, preds))", w: "**Log performance metrics.**", hi: true },
                        { c: "", w: "" },
                        { c: "    # 4. Log trained model artifact", w: "" },
                        { c: "    mlflow.sklearn.log_model(model, artifact_path='model')", w: "Saves model in standard MLmodel format." }
                    ]
                }
            },

            { trap: "Failing to set a fixed random seed or log dataset identifiers makes experiment runs un-reproducible. Logging metric scores without logging hyperparameter configs makes it impossible to reproduce the best run." },

            { h: "Searching and Loading Best Runs via Python API" },
            { p: "Once hundreds of runs are tracked in MLflow, you query the backend database programmatically to fetch the best model." },

            {
                code: {
                    lang: "python", t: "Retrieving the top model from MLflow tracking",
                    lines: [
                        { c: "from mlflow.tracking import MlflowClient", w: "" },
                        { c: "", w: "" },
                        { c: "client = MlflowClient()", w: "" },
                        { c: "exp = client.get_experiment_by_name('Customer_Churn_V1')", w: "" },
                        { c: "", w: "" },
                        { c: "# Query runs sorted by validation F1 score", w: "" },
                        { c: "runs = client.search_runs(", w: "" },
                        { c: "    experiment_ids=[exp.experiment_id],", w: "" },
                        { c: "    order_by=['metrics.val_f1 DESC'],", w: "**Sort runs by performance.**", hi: true },
                        { c: "    max_results=1", w: "" },
                        { c: ")", w: "" },
                        { c: "", w: "" },
                        { c: "best_run = runs[0]", w: "" },
                        { c: "best_model_uri = f'runs:/{best_run.info.run_id}/model'", w: "" },
                        { c: "loaded_model = mlflow.sklearn.load_model(best_model_uri)", w: "**Load binary model directly from tracking server.**", hi: true }
                    ]
                }
            },

            {
                tryit: {
                    t: "Log hyperparameter sweep",
                    task: "Write a python loop that iterates over `n_estimators = [50, 100, 200]`, starts a separate MLflow run for each, and logs the score.",
                    hint: "Use `with mlflow.start_run():` inside your loop.",
                    sol: { lang: "python", code: "import mlflow\n\nfor n in [50, 100, 200]:\n    with mlflow.start_run(run_name=f'rf_trees_{n}'):\n        mlflow.log_param('n_estimators', n)\n        acc = 0.85 + (n * 0.0001)\n        mlflow.log_metric('accuracy', acc)\n        print(f'Logged run with n={n}')" },
                    w: "Running experiment tracking loops programmatically guarantees consistent metadata logging for every trial."
                }
            },

            { vocab: ["MLflow", "Experiment Tracking", "Parameters", "Metrics", "Artifact"] }
        ],
        k: [
            "Always log hyperparameters, metrics, and model artifacts inside an explicit experiment context.",
            "MLflow tracks runs programmatically so any past model can be queried and loaded via API.",
            "Set fixed seeds and log dataset hashes alongside hyperparameters for 100% reproducibility."
        ],
        r: ["MLOps", "Model Registry", "Reproducibility", "Hyperparameter Tuning"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "mlflow.log_param('learning_rate', 0.01)", w: "log hyperparameter key value pair" },
                { c: "mlflow.log_metric('val_loss', 0.24)", w: "log continuous evaluation metric" },
                { c: "mlflow.sklearn.log_model(model, 'model')", w: "save model artifact to MLflow run" }
            ]
        }
    },

    {
        t: "Data and Model Versioning with DVC and Remote Storage",
        m: "tracking",
        lvl: "intermediate",
        s: "How to version large datasets and model binaries alongside Git source code.",
        goal: [
            "Understand why Git cannot handle multi-gigabyte datasets and models directly",
            "Track large dataset pointer files (`.dvc`) in Git while storing payload data in S3/GCS",
            "Implement `dvc repro` pipelines for reproducible data preprocessing and training"
        ],
        b: [
            { p: "Git is designed for text source code. Committing 10GB CSV datasets or 2GB PyTorch checkpoint files directly into Git bloats repositories and ruins version control performance. DVC (Data Version Control) bridges this gap." },

            { h: "How DVC Works — Pointers vs Payloads" },
            { p: "DVC decouples large data payload files from Git tracking. DVC replaces large files with tiny human-readable `.dvc` metadata pointer files containing md5 hashes. The actual data is pushed to remote storage (AWS S3, Google Cloud Storage, or MinIO)." },

            {
                tbl: {
                    t: "Git vs DVC workflow alignment",
                    h: ["Action", "Git (Source Code)", "DVC (Large Data & Models)"],
                    rows: [
                        ["**Track file**", "`git add train.py`", "`dvc add data/raw_features.csv` (creates `data/raw_features.csv.dvc`)"],
                        ["**Commit state**", "`git commit -m 'add training script'`", "`git add data/raw_features.csv.dvc && git commit -m 'track dataset v1'`"],
                        ["**Push to cloud**", "`git push origin main`", "`dvc push` (uploads raw payload to S3 / GCS bucket)"],
                        ["**Pull down state**", "`git checkout v2.0`", "`dvc pull` (downloads payload matching checked-out `.dvc` hashes)"]
                    ]
                }
            },

            {
                code: {
                    lang: "bash", t: "DVC CLI workflow in practice",
                    lines: [
                        { c: "# 1. Track large raw dataset with DVC", w: "" },
                        { c: "dvc add data/raw_features.csv", w: "**Generates data/raw_features.csv.dvc metadata file.**", hi: true },
                        { c: "", w: "" },
                        { c: "# 2. Ignore actual large file in Git", w: "" },
                        { c: "echo 'data/raw_features.csv' >> .gitignore", w: "" },
                        { c: "", w: "" },
                        { c: "# 3. Commit pointer file to Git", w: "" },
                        { c: "git add data/raw_features.csv.dvc .gitignore", w: "" },
                        { c: "git commit -m 'track raw features v1.0'", w: "" },
                        { c: "", w: "" },
                        { c: "# 4. Set remote S3 storage and push payload", w: "" },
                        { c: "dvc remote add -d myremote s3://my-company-mlops-bucket/dvcstore", w: "" },
                        { c: "dvc push", w: "**Uploads data payload to S3.**", hi: true }
                    ]
                }
            },

            { h: "Reproducible Pipelines with `dvc.yaml`" },
            { p: "DVC allows you to define multi-stage pipelines using `dvc.yaml`. DVC tracks inputs (`deps`) and outputs (`outs`). If an input file hasn't changed, DVC skips that pipeline step automatically." },

            {
                code: {
                    lang: "yaml", t: "Sample dvc.yaml pipeline definition",
                    lines: [
                        { c: "stages:", w: "" },
                        { c: "  preprocess:", w: "" },
                        { c: "    cmd: python src/preprocess.py data/raw.csv data/clean.parquet", w: "" },
                        { c: "    deps:", w: "" },
                        { c: "      - data/raw.csv", w: "Dependency input file." },
                        { c: "      - src/preprocess.py", w: "" },
                        { c: "    outs:", w: "" },
                        { c: "      - data/clean.parquet", w: "**Stage output tracked by DVC.**", hi: true },
                        { c: "  train:", w: "" },
                        { c: "    cmd: python src/train.py data/clean.parquet models/model.pkl", w: "" },
                        { c: "    deps:", w: "" },
                        { c: "      - data/clean.parquet", w: "" },
                        { c: "      - src/train.py", w: "" },
                        { c: "    outs:", w: "" },
                        { c: "      - models/model.pkl", w: "" }
                    ]
                }
            },

            {
                tryit: {
                    t: "Inspect DVC file format",
                    task: "Look at the snippet below of a `.dvc` pointer file. Identify how DVC links the Git revision to the payload.",
                    hint: "Notice the `md5` hash value.",
                    sol: { lang: "yaml", code: "outs:\n- md5: 8f9b2c14a901e3d4\n  size: 524288000\n  nfiles: 1\n  path: data/raw_features.csv" },
                    w: "The `.dvc` file records the md5 hash and file size. Git commits this tiny text file, enabling exact data alignment per commit."
                }
            },

            { vocab: ["Data Versioning"] }
        ],
        k: [
            "Git tracks `.dvc` pointer files; DVC stores large payload datasets and model files in cloud remotes (S3/GCS).",
            "`dvc push` and `dvc pull` keep local storage synchronized with remote cloud buckets.",
            "`dvc.yaml` defines dependency graphs (`deps` and `outs`), re-executing only pipeline stages whose inputs change."
        ],
        r: ["Git", "Reproducibility", "MLOps", "Model Registry"],
        drill: {
            lang: "bash",
            reps: 3,
            items: [
                { c: "dvc add data/dataset.csv", w: "track large data file with dvc" },
                { c: "dvc push", w: "upload data payloads to remote S3 bucket" },
                { c: "dvc repro", w: "re-execute dvc pipeline stages whose dependencies changed" }
            ]
        }
    }

]);
