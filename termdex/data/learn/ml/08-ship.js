/* Machine Learning — from notebook to production. */
TD.addLessons("ml", [

{
 t: "The Notebook Is Not the Deliverable",
 m: "ship",
 lvl: "intermediate",
 s: "Reproducibility, serving and the moment your model meets data you did not choose.",
 goal: [
  "Make a training run reproducible by someone who is not you",
  "Serve a model behind an interface, with the preprocessing attached",
  "Design for the fact that the world will move away from your training data"
 ],
 b: [
  { p: "A model that exists only inside a notebook on your laptop has produced knowledge, not value. The gap between the two is smaller than people fear and larger than they plan for." },

  { h: "Reproducibility, at three levels" },
  { tbl: { t: "What each level costs and buys",
    h: ["Level", "What it means", "Effort"],
    rows: [
     ["**Rerunnable**", "You can produce the same model again tomorrow", "One afternoon. **Do this always**"],
     ["**Transferable**", "A colleague can produce it on their machine", "A day. Do this for anything that ships"],
     ["**Auditable**", "You can reproduce the model from six months ago that made a specific decision", "A week of tooling. Required in regulated work"]
    ] } },

  { code: { lang: "python", file: "train.py", t: "The minimum that makes a run reproducible",
    lines: [
     { c: "import json, joblib, subprocess, numpy as np", w: "" },
     { c: "from datetime import datetime, timezone", w: "" },
     { c: "", w: "" },
     { c: "SEED = 42", w: "**One seed, set everywhere.** Without it, two runs of identical code give different models." },
     { c: "np.random.seed(SEED)", w: "" },
     { c: "", w: "" },
     { c: "# ... build and fit the pipeline ...", w: "" },
     { c: "", w: "" },
     { c: "joblib.dump(model, 'model.pkl')", w: "**The Pipeline, so preprocessing travels with the model.** This is the single most important line here.", hi: true },
     { c: "", w: "" },
     { c: "meta = {", w: "" },
     { c: "  'trained_at': datetime.now(timezone.utc).isoformat(),", w: "" },
     { c: "  'git_commit': subprocess.getoutput('git rev-parse HEAD'),", w: "**Which code produced this.** Costs nothing, answers the question that always gets asked." },
     { c: "  'data_rows': len(X_train),", w: "" },
     { c: "  'data_hash': hash_file('customers.csv'),", w: "**Which data.** Data changes far more often than code and is rarely versioned." },
     { c: "  'features': list(X.columns),", w: "**The exact column list and order.** Production sending columns in a different order is a real and confusing bug." },
     { c: "  'metrics': {'roc_auc': float(auc), 'pr_auc': float(ap)},", w: "" },
     { c: "  'seed': SEED,", w: "" },
     { c: "}", w: "" },
     { c: "json.dump(meta, open('model.meta.json', 'w'), indent=2)", w: "**Next to the model file.** Six months from now this is the difference between an answer and a shrug.", hi: true }
    ] } },

  { n: "The most common production ML bug is training/serving skew: the preprocessing at inference differs subtly from training. A missing `.lower()`, a different imputation value, columns in another order. Saving the whole `Pipeline` rather than just the estimator removes most of this by construction, which is why it was worth the earlier lesson.",
    nt: "The bug this prevents" },

  { h: "Serving it" },
  { p: "Three shapes, and the choice is about how the prediction is consumed rather than about the model." },

  { tbl: { t: "Three ways to serve",
    h: ["Shape", "How it works", "Right when"],
    rows: [
     ["**Batch**", "A nightly job scores everyone and writes to a table", "**Start here.** Predictions are consumed the next day anyway — churn risk, lead scores, forecasts. Simplest thing that works"],
     ["**Real-time API**", "An HTTP endpoint scores one request in milliseconds", "The prediction depends on something that just happened — fraud on a live transaction, ranking for this session"],
     ["**Embedded**", "The model runs inside the application or on the device", "Latency or privacy forbids a network call"]
    ] } },

  { code: { lang: "python", file: "serve.py", t: "A real-time endpoint, complete",
    lines: [
     { c: "from fastapi import FastAPI", w: "" },
     { c: "from pydantic import BaseModel", w: "" },
     { c: "import joblib, pandas as pd", w: "" },
     { c: "", w: "" },
     { c: "app = FastAPI()", w: "" },
     { c: "model = joblib.load('model.pkl')", w: "**Loaded once at startup**, not per request. Loading per request is a common and expensive mistake.", hi: true },
     { c: "meta = json.load(open('model.meta.json'))", w: "" },
     { c: "", w: "" },
     { c: "class Customer(BaseModel):", w: "" },
     { c: "    age: int", w: "" },
     { c: "    orders: int", w: "" },
     { c: "    total_spend: float", w: "**Typed input.** Pydantic rejects malformed requests before they reach the model, with a clear error." },
     { c: "", w: "" },
     { c: "@app.post('/predict')", w: "" },
     { c: "def predict(c: Customer):", w: "" },
     { c: "    df = pd.DataFrame([c.model_dump()])[meta['features']]", w: "**Reorder to the exact training column order.** This one line prevents a whole family of silent bugs.", hi: true },
     { c: "    p = float(model.predict_proba(df)[0, 1])", w: "" },
     { c: "    return {'probability': p,", w: "" },
     { c: "            'decision': p >= 0.32,", w: "**Return the raw probability as well as the decision.** The threshold is a business setting and will change without retraining." },
     { c: "            'model_version': meta['git_commit'][:8]}", w: "**Which model answered.** Essential when debugging a complaint about a specific prediction." }
    ] } },

  { h: "Everything decays" },
  { p: "A deployed model is a photograph of a world that keeps moving. This is not a failure mode to be prevented; it is a certainty to be planned for." },

  { tbl: { t: "Three kinds of drift",
    h: ["Type", "What changed", "Example", "Detect by"],
    rows: [
     ["**Data drift**", "The inputs look different", "A marketing campaign brings a younger cohort", "Comparing feature distributions against the training set"],
     ["**Concept drift**", "The relationship changed", "Post-pandemic, working from home stopped predicting churn", "**Monitoring the actual outcome.** No input check catches this"],
     ["**Upstream break**", "The pipeline changed under you", "A team renames a category; a field starts arriving null", "Schema and null-rate checks, which catch it fastest"]
    ] } },

  { code: { lang: "python", t: "A drift check worth running nightly",
    lines: [
     { c: "from scipy.stats import ks_2samp", w: "" },
     { c: "", w: "" },
     { c: "for col in numeric_features:", w: "" },
     { c: "    stat, p = ks_2samp(train[col].dropna(), live[col].dropna())", w: "**Kolmogorov-Smirnov**: are these two samples from the same distribution?" },
     { c: "    if p < 0.01:", w: "" },
     { c: "        print(f'DRIFT  {col}: train mean {train[col].mean():.1f} '", w: "" },
     { c: "              f'-> live {live[col].mean():.1f}')", w: "**Report the direction and size**, not just a flag. *Drift detected* with no numbers gets ignored.", hi: true },
     { c: "", w: "" },
     { c: "for col in all_features:", w: "" },
     { c: "    tr_null, lv_null = train[col].isna().mean(), live[col].isna().mean()", w: "" },
     { c: "    if abs(tr_null - lv_null) > 0.05:", w: "**Null-rate change is the fastest signal that an upstream pipeline broke** — and it is far more common than genuine concept drift.", hi: true },
     { c: "        print(f'NULLS  {col}: {tr_null:.1%} -> {lv_null:.1%}')", w: "" }
    ] } },

  { trap: "With enough features and a nightly test, you will get statistically significant drift alerts constantly, and the team will learn to ignore the channel within a fortnight. Alert on *effect size*, not on p-values — a 0.3% shift in mean age is significant on a million rows and means nothing. Set thresholds that correspond to something worth waking up for." },

  { h: "What to monitor, in priority order" },
  { ol: [
   "**Is it running?** Prediction volume against expectation. The most common production failure is that the job silently stopped, not that the model got worse.",
   "**Null rates and schema.** Catches upstream breakage within hours.",
   "**Prediction distribution.** If the average predicted probability jumps from 0.12 to 0.31 overnight, something changed and you want to know before a stakeholder does.",
   "**Feature drift**, on the top ten features only. Alert on size, not significance.",
   "**Actual performance**, whenever labels arrive. This is the only thing that truly matters and it is always delayed — sometimes by months.",
   "**Business metric.** The model exists to move a number. Watch that number."
  ] },

  { n: "The delay between prediction and label is the fundamental difficulty of monitoring machine learning. You predict churn today and find out in ninety days. During those ninety days every proxy — drift, distributions, volumes — is all you have. Building those proxies is not optional; it is the only feedback available inside the loop.",
    nt: "Why proxies exist" },

  { h: "Retraining" },
  { l: [
   "**On a schedule** — weekly or monthly. Simple, predictable, and right for most systems.",
   "**On a trigger** — when performance or drift crosses a threshold. Better in principle, more moving parts, and needs the monitoring to be trustworthy first.",
   "**Never automatically deploy a retrained model.** Score it against the current one on a frozen test set and require an improvement. Automatic retraining plus automatic deployment is how a broken upstream pipeline becomes a broken model in production overnight.",
   "**Keep the previous model and a rollback path.** The fastest fix for a bad model is the old model."
  ] },

  { tryit: { t: "Ship one end to end",
    task: "Take a model you have trained. Save the Pipeline with joblib plus a metadata JSON. Write a FastAPI endpoint that loads it once, validates input with Pydantic, reorders columns from the metadata, and returns probability, decision and model version. Call it with curl.",
    hint: "`uvicorn serve:app --reload`, then open `http://localhost:8000/docs` — FastAPI generates an interactive page from your Pydantic model, and you can test it there without writing any curl at all.",
    sol: { lang: "bash", code: "# terminal 1\nuvicorn serve:app --reload\n\n# terminal 2\ncurl -X POST http://localhost:8000/predict \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"age\": 34, \"orders\": 7, \"total_spend\": 4200}'\n\n# {\"probability\":0.183,\"decision\":false,\"model_version\":\"a3f91c02\"}\n\n# then try sending a string where a number belongs --\n# Pydantic returns a 422 with a precise message, and the\n# model is never reached. That is the boundary doing its job." },
    w: "You now have something you can send someone a link to, which changes what your project *is*. In a portfolio this is the difference between a notebook a reviewer will not open and a URL they will click. The backend and docker tracks take this considerably further, but this endpoint is already a real deployment." } },

  { vocab: ["Model Serving", "Model Drift", "MLOps", "Feature Store", "Reproducibility"] }
 ],
 k: [
  "Save the whole Pipeline plus a metadata file with commit, data hash, feature order and metrics.",
  "Training/serving skew is the most common production ML bug; shipping the Pipeline prevents most of it.",
  "Start with batch scoring; move to a real-time API only when the prediction depends on something that just happened.",
  "Every model decays — monitor volume, nulls, prediction distribution, drift by effect size, then actual performance.",
  "Retrain on a schedule, but never auto-deploy: score the new model against the old one and keep a rollback."
 ],
 r: ["Model Serving", "Model Drift", "MLOps", "Feature Store", "Model Registry", "Data Leakage"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "joblib.dump(model, 'model.pkl')", w: "save the whole pipeline, preprocessing included" },
   { c: "model = joblib.load('model.pkl')", w: "load once at startup, never per request" },
   { c: "df = pd.DataFrame([payload])[meta['features']]", w: "reorder columns to the exact training order" },
   { c: "ks_2samp(train[col], live[col])", w: "test whether live data still looks like training data" },
   { c: "live[col].isna().mean()", w: "null rate — the fastest signal an upstream pipeline broke" }
  ]
 }
}

]);
