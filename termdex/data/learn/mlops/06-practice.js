/* MLOps — the practice, at the depth the subject needs.

   This was the thinnest track in the app: ten lessons averaging under seven
   content blocks, which is a tour of tool names rather than a course. The
   existing lessons say what MLflow and Airflow are; they do not say what goes
   wrong, which is the entire subject. MLOps is not a set of tools, it is the
   discipline of making a stochastic artefact behave like a dependable one,
   and every technique in it exists because something failed painfully.

   So these lessons are organised around failures rather than products:

     reproducibility  the model you cannot rebuild, which is the failure that
                      makes every other failure unfixable
     features         training/serving skew, the top cause of the gap between
                      offline metrics and production reality
     deployment       shipping a model without betting the business on it
     oncall           what to do at 3 a.m., which no ML course teaches

   Tools appear, but as instances of an idea, so a reader who meets a
   different stack in their first job is not lost. */
TD.addLessons("mlops", [

{
 t: "Reproducibility: The Model You Cannot Rebuild",
 m: "tracking",
 lvl: "intermediate",
 s: "A model you cannot recreate is a model you cannot fix, audit or improve.",
 goal: [
  "List the five things that must be pinned to reproduce a training run",
  "Explain why pinning the random seed is not enough",
  "Set up tracking that makes reproduction the default rather than an effort"
 ],
 b: [
  { p: "Six months after deployment, your model starts behaving oddly. You want to retrain it, or work out what changed, or answer a regulator asking how a decision was made." },
  { p: "You open the notebook. It no longer runs. The data file has been overwritten. A library upgraded. The colleague who ran it has left. **You cannot rebuild the thing that is currently making decisions about people**, and every option from here is bad." },
  { p: "This is the failure that makes all other failures unfixable, which is why it comes first." },

  { h: "The five things that must be pinned" },
  { tbl: { t: "Pin all five or you have pinned none",
    h: ["", "Why it changes the model", "How to pin it"],
    rows: [
     ["**Code**", "Obviously", "Git commit hash, recorded with the run"],
     ["**Data**", "The same query returns different rows next week", "A content hash, or a versioned snapshot"],
     ["**Environment**", "A library upgrade silently changes an algorithm", "A lockfile, or a container image digest"],
     ["**Hyperparameters**", "Directly", "Logged automatically, never typed into a report"],
     ["**Randomness**", "Initialisation, shuffling, augmentation, splits", "Seeds — necessary, and not sufficient"]
    ] } },
  { p: "People pin one or two of these, usually code and seed, and believe they are safe. Four out of five is not four-fifths reproducible; it is not reproducible." },

  { h: "Why the seed is not enough" },
  { p: "Setting a seed makes *your* random number generator deterministic. It does not control the several other sources of variation in a training run." },
  { code: { lang: "python", t: "What full determinism actually requires",
    lines: [
     { c: "import random, numpy as np, torch, os", w: "" },
     { c: "", w: "" },
     { c: "def pin(seed=42):", w: "" },
     { c: "    random.seed(seed)", w: "" },
     { c: "    np.random.seed(seed)", w: "" },
     { c: "    torch.manual_seed(seed)", w: "" },
     { c: "    torch.cuda.manual_seed_all(seed)", w: "" },
     { c: "    os.environ['PYTHONHASHSEED'] = str(seed)", w: "Set dictionary ordering. Must be set **before** Python starts to fully work." },
     { c: "    torch.backends.cudnn.deterministic = True", w: "**cuDNN picks different algorithms run to run** based on timing. This forces one." },
     { c: "    torch.backends.cudnn.benchmark = False", w: "Benchmarking picks the fastest algorithm, which varies. Costs some speed." },
     { c: "", w: "" },
     { c: "# and in your DataLoader:", w: "" },
     { c: "DataLoader(ds, num_workers=4, worker_init_fn=lambda w: pin(42 + w),", w: "**Each worker has its own RNG.** Without this, augmentation is not reproducible." },
     { c: "           generator=torch.Generator().manual_seed(42))", w: "" }
    ] } },
  { trap: "Even with all of that, GPU floating-point addition is not associative and some CUDA kernels are non-deterministic by design — results can differ in the last decimal places between identical runs, and those differences compound over thousands of steps. Aim for *close enough to diagnose*, not bit-identical. Chasing bit-exactness on a GPU costs real speed and rarely repays it." },

  { h: "Version the data, not just the code" },
  { p: "`SELECT * FROM transactions WHERE date > '2026-01-01'` is not a dataset. It is a question whose answer changes every day, and a model trained on Monday's answer cannot be reproduced on Friday." },
  { code: { lang: "python", t: "Make the data identifiable",
    lines: [
     { c: "import hashlib, json", w: "" },
     { c: "", w: "" },
     { c: "def fingerprint(df):", w: "" },
     { c: "    h = hashlib.sha256(", w: "" },
     { c: "        pd.util.hash_pandas_object(df, index=True).values).hexdigest()", w: "" },
     { c: "    return {'sha': h[:16], 'rows': len(df),", w: "" },
     { c: "            'cols': list(df.columns),", w: "**Column order and dtypes matter** — a reordered frame trains differently." },
     { c: "            'dtypes': {c: str(t) for c, t in df.dtypes.items()}}", w: "" },
     { c: "", w: "" },
     { c: "mlflow.log_dict(fingerprint(train_df), 'data_fingerprint.json')", w: "Now the run identifies its own data." }
    ] } },
  { n: "The dedicated tools — DVC, LakeFS, Delta Lake — do this properly with content-addressed storage and cheap snapshots. But a hash logged with every run gets you most of the benefit for ten lines, and is worth adding today rather than after the migration you are planning.",
    nt: "You do not need the tool to get the benefit" },

  { h: "Tracking that makes reproduction the default" },
  { code: { lang: "python", t: "A run you could rebuild in a year",
    lines: [
     { c: "import mlflow, subprocess", w: "" },
     { c: "", w: "" },
     { c: "with mlflow.start_run(run_name='fraud-v3'):", w: "" },
     { c: "    mlflow.log_param('git_sha', subprocess.check_output(", w: "" },
     { c: "        ['git', 'rev-parse', 'HEAD']).decode().strip())", w: "**Record the commit.**" },
     { c: "    mlflow.log_param('dirty', bool(subprocess.check_output(", w: "" },
     { c: "        ['git', 'status', '--porcelain'])))", w: "**And whether there were uncommitted changes** — a dirty tree makes the sha a lie." },
     { c: "", w: "" },
     { c: "    mlflow.log_params(hyperparams)", w: "" },
     { c: "    mlflow.log_dict(fingerprint(train_df), 'data.json')", w: "" },
     { c: "    mlflow.log_artifact('requirements.lock')", w: "" },
     { c: "", w: "" },
     { c: "    model.fit(X, y)", w: "" },
     { c: "    mlflow.log_metrics({'auc': auc, 'pr_auc': pr})", w: "" },
     { c: "    mlflow.sklearn.log_model(model, 'model')", w: "" }
    ] } },
  { p: "The `dirty` flag is the detail experienced teams add after being burned. A commit hash from a working tree with uncommitted edits identifies code that never existed anywhere, and it looks perfectly trustworthy in the log." },

  { ana: "A recipe that says 'flour, some heat, cook until done' will occasionally produce something excellent, and you will never make it again. Reproducibility is writing down the oven temperature — unglamorous, and the difference between cooking and getting lucky.",
    at: "The recipe with no temperature" },

  { tryit: { t: "Try to reproduce your own work",
    task: "Take a model you trained recently. Without looking at the notebook's output, try to recreate it exactly. Write down every thing you could not pin down.",
    hint: "Check whether you can identify the exact data, the library versions, and whether the code has changed since.",
    sol: { lang: "python", code: "import subprocess, json, sys, hashlib\n\ndef run_context():\n    sha = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip()\n    dirty = bool(subprocess.check_output(['git', 'status', '--porcelain']))\n    pkgs = subprocess.check_output([sys.executable, '-m', 'pip', 'freeze']).decode()\n    return {\n        'git_sha': sha,\n        'dirty': dirty,\n        'python': sys.version.split()[0],\n        'packages_sha': hashlib.sha256(pkgs.encode()).hexdigest()[:16],\n    }\n\nprint(json.dumps(run_context(), indent=2))\n# save this alongside every model you ever train" },
    w: "Most people find they cannot pin the data and cannot pin the environment. Those two are the ones that bite hardest, and both are fixable in an afternoon." } },

  { vocab: ["Reproducibility", "Experiment Tracking", "Data Versioning"] }
 ],
 k: [
  "Reproducing a run needs five things pinned: code, data, environment, hyperparameters and randomness.",
  "Seeds alone are not enough — cuDNN algorithm choice and DataLoader workers each need handling.",
  "GPU non-determinism means aim for close enough to diagnose, not bit-identical.",
  "A SQL query is not a dataset; fingerprint the data and log the hash with the run.",
  "Log the git sha *and* whether the tree was dirty — a dirty sha identifies code that never existed."
 ],
 r: ["Reproducibility", "Experiment Tracking", "Data Versioning", "MLflow"]
},

{
 t: "Training/Serving Skew and the Feature Store",
 m: "serving",
 lvl: "advanced",
 s: "The number one cause of a model that works offline and fails in production.",
 goal: [
  "Recognise the four ways training and serving diverge",
  "Explain point-in-time correctness and why naive joins leak",
  "Decide whether you need a feature store or a shared function"
 ],
 b: [
  { p: "Your model scores 0.92 in validation. Deployed, it performs like 0.71. Nothing errored, nothing was retrained, and the model file is identical." },
  { p: "This is **training/serving skew**, and it is the most common serious failure in production ML. The model is fine. It is being fed something subtly different from what it learned on, and no offline metric can see that." },

  { h: "The four ways it happens" },
  { tbl: { t: "Where the divergence creeps in",
    h: ["Kind", "Example", "Symptom"],
    rows: [
     ["**Different code**", "Training in pandas, serving in Java", "A constant offset in one feature"],
     ["**Different data source**", "Training on the warehouse, serving on the live DB", "Values agree mostly, differ at the edges"],
     ["**Different timing**", "Training used a value computed after the fact", "Excellent offline, poor live — this is leakage"],
     ["**Different defaults**", "Training fills nulls with the median, serving with 0", "Fails only on rows with missing values"]
    ] } },
  { p: "The third is the dangerous one, because it is indistinguishable from a good model until deployment. The others produce a consistent gap; that one produces a model whose entire premise is wrong." },

  { h: "Point-in-time correctness" },
  { p: "Here is the failure in its purest form. You are predicting whether a transaction is fraud, and one feature is `customer_lifetime_chargebacks`." },
  { vs: { t: "Building the training set", lang: "sql",
    bad: { label: "Leaks the future", c: "SELECT t.*, c.lifetime_chargebacks\nFROM transactions t\nJOIN customers c ON t.customer_id = c.id",
      w: "`c.lifetime_chargebacks` is that customer's value **today**, which includes chargebacks caused by this very transaction. The model learns to read the answer." },
    good: { label: "As of the transaction", c: "SELECT t.*, (\n  SELECT COUNT(*) FROM chargebacks cb\n  WHERE cb.customer_id = t.customer_id\n    AND cb.created_at < t.created_at\n) AS lifetime_chargebacks\nFROM transactions t",
      w: "Only chargebacks that had already happened. This is what serving will genuinely have available." } } },
  { p: "**Point-in-time correctness** means every feature value must be what it would have been at the moment of prediction, not what it is now. Getting this wrong produces the best offline scores you will ever see, and it is the reason a suspiciously good result should be investigated rather than announced." },
  { trap: "Any feature computed from an aggregate — counts, averages, running totals, 'number of previous X' — is a candidate for this leak, and a plain join will get it wrong by default. The check is mechanical: for each feature, ask whether it could have been computed using only rows with a timestamp strictly before the prediction time." },

  { h: "The fix, in increasing order of effort" },
  { ol: [
   "**One shared function.** Write feature computation once, import it in both the training pipeline and the serving path. This alone removes the 'different code' class entirely, and it costs nothing.",
   "**Log what you served.** Record the exact feature vector sent to the model at inference time. Now you can compare training and serving distributions directly rather than reasoning about them.",
   "**A feature store.** A system that computes each feature once and serves it to both training and inference, with point-in-time correctness built in."
  ] },
  { code: { lang: "python", t: "The shared function, which most teams should do first",
    lines: [
     { c: "# features.py — imported by BOTH the training job and the API", w: "" },
     { c: "def build_features(raw: dict, as_of: datetime) -> dict:", w: "**`as_of` is the important parameter.**" },
     { c: "    return {", w: "" },
     { c: "        'amount_log': math.log1p(raw['amount']),", w: "" },
     { c: "        'hour': as_of.hour,", w: "" },
     { c: "        'days_since_signup': (as_of - raw['signup']).days,", w: "" },
     { c: "        'prior_chargebacks': count_chargebacks(", w: "" },
     { c: "            raw['customer_id'], before=as_of),", w: "Point-in-time by construction — it cannot see the future because it is not given it." },
     { c: "    }", w: "" }
    ] } },
  { n: "Passing `as_of` explicitly rather than calling `datetime.now()` inside the function is what makes the same code correct in both places. Training passes each row's historical timestamp; serving passes the current time. One implementation, and the leak becomes structurally impossible.",
    nt: "Why the as_of parameter matters" },

  { h: "Do you need a feature store?" },
  { tbl: { t: "Honestly",
    h: ["Situation", "Answer"],
    rows: [
     ["One or two models, one team", "**No.** A shared function and logged inputs"],
     ["Many models reusing the same features", "**Probably** — the reuse is the point"],
     ["Features needed in under 50 ms at serving", "**Yes** — you need the online store"],
     ["Complex time-windowed aggregates", "**Yes** — point-in-time joins are genuinely hard to hand-roll"]
    ] } },
  { p: "Feature stores are frequently adopted too early. They are real infrastructure with real operational cost, and a team with three models gets most of the benefit from `features.py` and a log." },

  { h: "Detecting skew once you are running" },
  { code: { lang: "python", t: "Compare what you served against what you trained on",
    lines: [
     { c: "served = load_logged_features(last_24h)", w: "This is why you log them." },
     { c: "training = load_training_features()", w: "" },
     { c: "", w: "" },
     { c: "for col in training.columns:", w: "" },
     { c: "    t_mean, s_mean = training[col].mean(), served[col].mean()", w: "" },
     { c: "    t_std = training[col].std() or 1e-9", w: "" },
     { c: "    z = abs(t_mean - s_mean) / t_std", w: "**Standardised difference**, so it is comparable across features." },
     { c: "    if z > 0.5:", w: "" },
     { c: "        print(f'SKEW {col}: train {t_mean:.3f}, served {s_mean:.3f}')", w: "" },
     { c: "    miss_t, miss_s = training[col].isna().mean(), served[col].isna().mean()", w: "" },
     { c: "    if abs(miss_t - miss_s) > 0.05:", w: "**Check missingness separately** — a feature that is 2% null in training and 40% null in production is broken upstream." },
     { c: "        print(f'NULLS {col}: train {miss_t:.1%}, served {miss_s:.1%}')", w: "" }
    ] } },

  { tryit: { t: "Find a point-in-time leak",
    task: "Build a small dataset with an aggregate feature. Compute it two ways — naively over all history, and correctly as-of each row's timestamp. Train on each and compare validation scores.",
    hint: "A running count per customer. The naive version includes future events; the correct one does not.",
    sol: { lang: "python", code: "import pandas as pd, numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nrng = np.random.default_rng(0)\nn = 3000\ndf = pd.DataFrame({\n    'customer': rng.integers(0, 200, n),\n    'ts': pd.date_range('2026-01-01', periods=n, freq='h'),\n    'amount': rng.lognormal(3, 1, n),\n})\ndf['fraud'] = (rng.random(n) < 0.05).astype(int)\ndf = df.sort_values('ts').reset_index(drop=True)\n\n# WRONG: total fraud per customer over all time, including the future\ndf['naive'] = df.groupby('customer')['fraud'].transform('sum')\n\n# RIGHT: only fraud strictly before this row\ndf['correct'] = (df.groupby('customer')['fraud'].cumsum() - df['fraud'])\n\nfor col in ['naive', 'correct']:\n    X = df[['amount', col]]\n    s = cross_val_score(LogisticRegression(max_iter=1000), X, df['fraud'], cv=5,\n                        scoring='roc_auc')\n    print(f'{col:8s} AUC {s.mean():.3f}')" },
    w: "The naive version scores far higher and is worthless — it is reading fraud counts that include the row being predicted. That gap is exactly the gap you would see between validation and production." } },

  { vocab: ["Feature Store", "Data Leakage", "Model Serving"] }
 ],
 k: [
  "Training/serving skew comes from different code, different sources, different timing or different defaults.",
  "Point-in-time correctness: every feature must be what it was at prediction time, not what it is now.",
  "Any aggregate feature is a leak candidate; a plain join gets it wrong by default.",
  "Write feature code once with an explicit `as_of` parameter and import it in both places.",
  "Log served feature vectors so skew can be measured rather than argued about."
 ],
 r: ["Feature Store", "Data Leakage", "Model Serving", "Feature Engineering"]
},

{
 t: "Deploying Without Betting the Business",
 m: "serving",
 lvl: "intermediate",
 s: "Shadow, canary and blue-green — how to ship a model you are not yet sure about.",
 goal: [
  "Choose a rollout strategy from the cost of being wrong",
  "Run a shadow deployment and know what it can and cannot tell you",
  "Define rollback criteria before you deploy, not during the incident"
 ],
 b: [
  { p: "Your new model beats the old one on every offline metric. That is evidence, not proof — offline evaluation cannot see skew, cannot see latency, and cannot see the feedback loop the model itself will create." },
  { p: "So you deploy in a way that limits what being wrong costs." },

  { h: "The four strategies" },
  { tbl: { t: "Choose by what a bad model would cost",
    h: ["Strategy", "How", "Catches", "Cost"],
    rows: [
     ["**Shadow**", "New model runs on real traffic; output is logged, not used", "Skew, latency, crashes", "Double compute; **no quality signal**"],
     ["**Canary**", "1% of traffic, then 5%, 25%, 100%", "Real quality problems, early", "Some users get the worse model"],
     ["**Blue-green**", "Two full environments; switch all at once", "Nothing extra — but rollback is instant", "Double infrastructure"],
     ["**A/B test**", "Split traffic, measure a business metric", "**Whether it is actually better**", "Slow — needs statistical power"]
    ] } },
  { p: "These combine, and in a mature setup they are used in sequence: shadow first to check it does not crash and the features match, then canary to check quality, then a proper A/B test if the change is meant to move a business number." },

  { h: "Shadow mode, and its one limitation" },
  { code: { lang: "python", t: "Running the new model without trusting it",
    lines: [
     { c: "async def predict(request):", w: "" },
     { c: "    result = current_model.predict(request)", w: "**This is what the user gets.**" },
     { c: "", w: "" },
     { c: "    asyncio.create_task(shadow(request, result))", w: "**Fire and forget.** Never let the shadow path affect the response." },
     { c: "    return result", w: "" },
     { c: "", w: "" },
     { c: "async def shadow(request, live_result):", w: "" },
     { c: "    try:", w: "" },
     { c: "        with timer() as t:", w: "" },
     { c: "            new = candidate_model.predict(request)", w: "" },
     { c: "        log({'live': live_result, 'candidate': new,", w: "" },
     { c: "             'agree': live_result == new, 'ms': t.ms})", w: "" },
     { c: "    except Exception as e:", w: "" },
     { c: "        log({'shadow_error': str(e)})", w: "**Swallow it.** A crashing candidate must never break production." }
    ] } },
  { p: "Shadow mode answers *does it run, how fast, and does it agree with the current model* — which is genuinely valuable, and catches the skew and latency problems that offline testing cannot." },
  { trap: "Shadow mode cannot tell you the new model is **better**. It shows where the two disagree, but not who was right, because nobody acted on the shadow prediction and so no outcome was ever observed. Teams routinely mistake 'the new model disagrees 8% of the time' for evidence of improvement. It is evidence of difference. Only a canary or an A/B test, where the prediction actually causes something, can tell you which is right." },

  { h: "Canary: define failure before you start" },
  { p: "The essential discipline is writing the rollback criteria down *before* deploying. During an incident, with a dashboard moving and people watching, nobody makes a good judgement about whether a two-point drop is noise." },
  { code: { lang: "python", t: "Automatic rollback criteria",
    lines: [
     { c: "CANARY = {", w: "" },
     { c: "    'max_error_rate': 0.01,", w: "" },
     { c: "    'max_p99_latency_ms': 250,", w: "" },
     { c: "    'min_precision': 0.85,", w: "Only if labels arrive fast enough to measure." },
     { c: "    'max_prediction_rate_shift': 0.20,", w: "**The proxy that works without labels** — if it used to flag 3% and now flags 9%, something changed." },
     { c: "    'min_samples': 1000,", w: "**Do not act on 40 requests.** Noise will trip any threshold." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "def should_rollback(m):", w: "" },
     { c: "    if m['n'] < CANARY['min_samples']:", w: "" },
     { c: "        return False, 'not enough data yet'", w: "" },
     { c: "    for k in ('error_rate', 'p99_latency_ms'):", w: "" },
     { c: "        if m[k] > CANARY['max_' + k]:", w: "" },
     { c: "            return True, f'{k} = {m[k]}'", w: "" },
     { c: "    return False, 'healthy'", w: "" }
    ] } },
  { n: "The prediction-rate check is the most useful line there. Ground truth usually arrives late — sometimes months late — so precision cannot gate a rollout. But a sudden shift in how often the model says yes is visible immediately and catches a large share of real breakages, including skew, a broken feature, and a mis-loaded model file.",
    nt: "The check that works without labels" },

  { ana: "A restaurant does not put a new dish straight onto every table. It cooks one, tastes it, offers it as a special to a few tables, listens, and only then reprints the menu. Nobody calls that timidity — it is how you avoid finding out at scale.",
    at: "The new dish" },

  { h: "Rollback must be boring" },
  { p: "The single most important property of a deployment system is that reverting is fast, obvious and unremarkable. If rolling back requires a meeting, people will argue for keeping a broken model instead." },
  { ol: [
   "**Keep the previous version loaded**, or at minimum immediately available. Rollback should be a config change, not a rebuild.",
   "**Version everything together** — model, features and preprocessing are one artefact. Rolling back a model onto new feature code is its own incident.",
   "**Practise it.** A rollback path that has never been exercised does not work; you simply do not know that yet.",
   "**Make it one command.** If it takes three people and a runbook, it will not happen at 3 a.m."
  ] },

  { tryit: { t: "Write the criteria before you would need them",
    task: "For a model you might deploy, write the exact numeric conditions under which you would roll back — including what you would use if labels arrive too late to measure quality.",
    hint: "Include a minimum sample size. Most bad rollback decisions are made on too little data.",
    sol: { lang: "python", code: "CRITERIA = {\n    # available immediately\n    'max_error_rate':        0.005,\n    'max_p99_latency_ms':    300,\n    'max_positive_rate_shift': 0.25,   # relative to the previous model\n    'max_null_feature_rate': 0.02,\n\n    # available later, if labels arrive\n    'min_precision':         0.80,\n    'min_recall':            0.65,\n\n    # guards\n    'min_samples':           2000,\n    'min_minutes':           30,\n}\n\ndef verdict(m):\n    if m['n'] < CRITERIA['min_samples'] or m['minutes'] < CRITERIA['min_minutes']:\n        return 'WAIT'\n    if m['error_rate'] > CRITERIA['max_error_rate']:\n        return 'ROLLBACK: errors'\n    if m['p99_ms'] > CRITERIA['max_p99_latency_ms']:\n        return 'ROLLBACK: latency'\n    if abs(m['pos_rate'] - m['baseline_pos_rate']) / m['baseline_pos_rate'] > \\\n            CRITERIA['max_positive_rate_shift']:\n        return 'ROLLBACK: prediction rate shifted'\n    return 'PROCEED'" },
    w: "Note that `WAIT` is a distinct verdict. Half of bad rollout decisions are made on twenty minutes of data, in either direction." } },

  { vocab: ["Canary Deployment", "Blue-Green Deployment", "A/B Testing"] }
 ],
 k: [
  "Shadow catches crashes, latency and skew; it cannot tell you the new model is better.",
  "Canary exposes a small share of real traffic, so quality problems surface before everyone sees them.",
  "Write rollback criteria, with a minimum sample size, before deploying.",
  "Prediction-rate shift is the best health signal when ground truth arrives late.",
  "Version model, features and preprocessing together, and make rollback one boring command."
 ],
 r: ["Canary Deployment", "Blue-Green Deployment", "A/B Testing", "Model Serving"]
},

{
 t: "On Call for a Model",
 m: "monitoring",
 lvl: "advanced",
 s: "It is 3 a.m., the alert says the model is wrong, and no ML course has ever told you what to do.",
 goal: [
  "Triage an ML incident in the correct order",
  "Distinguish a model problem from the far more common data problem",
  "Build the four dashboards that make an incident answerable"
 ],
 b: [
  { p: "Software incidents have a shape people are trained for: something errored, there is a stack trace, you find the line. ML incidents mostly have no error at all. The service is healthy, latency is fine, and the predictions are wrong." },
  { p: "This lesson is the runbook, and its main message is that **the model is almost never the cause**." },

  { h: "Triage, in order" },
  { p: "Work down this list. It is ordered by how likely each cause is and how cheap it is to check, and stopping at the first hit will resolve most incidents." },
  { ol: [
   "**Is it actually the model?** Check error rates, latency and upstream services first. A 'bad predictions' report is frequently a timeout somewhere returning defaults.",
   "**Did anything deploy?** Model, feature code, upstream schema, a library. Correlate the start of the problem with the deploy log. This finds the cause more often than everything below it combined.",
   "**Are the inputs the same?** Compare today's feature distributions with training. Look at null rates first — they move most sharply when something breaks.",
   "**Is a feature stale?** A lookup table or cached aggregate that stopped updating. The model receives yesterday's values, or last month's, and never complains.",
   "**Has the population changed?** A marketing campaign, a new market, a seasonal shift. Real drift, but usually gradual — a sudden change is rarely drift.",
   "**Has the relationship changed?** Genuine concept drift. This is last because it is the rarest and the slowest."
  ] },
  { trap: "The instinct under pressure is to retrain immediately. Resist it. If the cause is a broken upstream feature, retraining bakes the breakage into the new model and you now have two problems and no baseline. **Diagnose first.** Retraining is a fix for drift, not a fix for a bug, and it is expensive to undo." },

  { h: "The four dashboards" },
  { p: "You cannot answer any of the questions above without these, and they must exist before the incident." },
  { tbl: { t: "What each one is for",
    h: ["Dashboard", "Shows", "Answers"],
    rows: [
     ["**Service health**", "Requests, errors, p50/p95/p99 latency", "Is it up and fast?"],
     ["**Input health**", "Per-feature mean, null rate, out-of-range count", "Is it being fed the right thing?"],
     ["**Output health**", "Prediction distribution, confidence, rate per class", "Is it behaving as before?"],
     ["**Business**", "The metric someone actually cares about", "Does any of this matter?"]
    ] } },
  { p: "The second and third are the ones ordinary software monitoring does not give you, and they are the ones that resolve ML incidents. Input health in particular: a feature going 90% null at 02:40 is both the alert and the diagnosis." },

  { code: { lang: "python", t: "A health check worth running every hour",
    lines: [
     { c: "def health(recent, reference):", w: "" },
     { c: "    issues = []", w: "" },
     { c: "    for col in reference.columns:", w: "" },
     { c: "        r_null = recent[col].isna().mean()", w: "" },
     { c: "        b_null = reference[col].isna().mean()", w: "" },
     { c: "        if r_null > b_null + 0.05:", w: "**Nulls first** — the sharpest signal of an upstream break." },
     { c: "            issues.append(f'{col}: nulls {b_null:.1%} -> {r_null:.1%}')", w: "" },
     { c: "", w: "" },
     { c: "        if recent[col].nunique() == 1 and reference[col].nunique() > 1:", w: "" },
     { c: "            issues.append(f'{col}: now constant ({recent[col].iloc[0]})')", w: "**A feature that went constant** is a classic broken join or default." },
     { c: "", w: "" },
     { c: "        z = abs(recent[col].mean() - reference[col].mean()) / (reference[col].std() or 1e-9)", w: "" },
     { c: "        if z > 1.0:", w: "" },
     { c: "            issues.append(f'{col}: mean shifted {z:.1f} sd')", w: "" },
     { c: "    return issues", w: "" }
    ] } },
  { n: "The constant-feature check earns its place repeatedly. When an upstream join breaks or a default fires, a feature does not go noisy — it goes to exactly one value for every row. That is unmistakable, trivially detectable, and invisible in any average-based metric.",
    nt: "The check that finds the most bugs" },

  { h: "Alert on symptoms, not on statistics" },
  { p: "The commonest monitoring mistake is alerting on statistical drift tests. At production volume every feature drifts significantly every day, the alerts become noise, and within a fortnight everyone mutes the channel." },
  { tbl: { t: "What to page a human for",
    h: ["Alert on", "Not on"],
    rows: [
     ["Error rate above threshold", "A p-value crossing 0.05"],
     ["A feature going constant or mostly null", "Any distribution shift at all"],
     ["Prediction rate moved more than 25%", "A 2% change in a feature mean"],
     ["p99 latency above the SLA", "Average latency"],
     ["A business metric moving", "Model confidence drifting slightly"]
    ] } },
  { p: "The test for a good alert is simple: **would a human do something differently on receiving it?** If not, it is a dashboard line, not a page." },

  { h: "Write the incident down" },
  { p: "After it is resolved, record what happened, how it was found, and what would have caught it sooner — blamelessly, and in a place the next person will find. ML incidents recur in families: a stale feature this quarter and a different stale feature next. A team with a written history recognises the shape in minutes rather than hours." },
  { ana: "A ship's log. Nobody writes it for the day it happened; they write it so that the next person meeting the same weather in the same waters is not starting from nothing.",
    at: "The ship's log" },

  { tryit: { t: "Write your own runbook",
    task: "For a model you have built or would build, write the triage list in order, the four dashboards you would need, and the exact alerts you would page someone for at 3 a.m.",
    hint: "For each alert, state what a human would actually do about it. Delete any where the answer is 'look at it and go back to sleep'.",
    sol: { lang: "python", code: "RUNBOOK = {\n    'triage_order': [\n        'check service errors and latency',\n        'check the deploy log for the last 24h',\n        'compare input distributions and null rates to training',\n        'check freshness of every lookup table and cached aggregate',\n        'check for a population change (campaign, new market, season)',\n        'only then consider genuine concept drift',\n    ],\n    'page_for': {\n        'error_rate > 1%':            'roll back the last deploy',\n        'any feature > 50% null':     'check the upstream job',\n        'any feature went constant':  'check the join / default path',\n        'prediction rate +/- 25%':    'compare inputs, then roll back',\n        'p99 latency > SLA':          'scale out or roll back',\n    },\n    'do_not_page_for': [\n        'KS test p < 0.05 on any feature',\n        'small movements in mean confidence',\n    ],\n    'never_do_first': 'retrain',\n}" },
    w: "That last line is the one worth arguing for in your own team. Retraining during an incident, before diagnosis, is how a one-hour problem becomes a one-week problem." } },

  { vocab: ["Observability", "Model Drift", "Data Drift"] }
 ],
 k: [
  "ML incidents usually have no error — the service is healthy and the predictions are wrong.",
  "Triage in order: service health, recent deploys, input distributions, stale features, population change, then concept drift.",
  "Never retrain before diagnosing; it bakes a bug into the new model and destroys your baseline.",
  "Build four dashboards: service, input, output and business health.",
  "Alert on symptoms a human would act on, never on statistical significance."
 ],
 r: ["Observability", "Model Drift", "Data Drift", "Concept Drift"]
}

]);
