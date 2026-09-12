/* Real-world examples and step-by-step flows — MLOps. */
TD.attach("mlops", {

"MLOps": {
 ex: { h: "The model worked. Then it was Tuesday.",
       b: "A notebook with 94% accuracy is roughly 10% of the work. The rest is: where does it run, how does it get features, what happens when it degrades, who is paged, and how do you go back to last week's version at 2am. MLOps is the name for that unglamorous 90%." },
 fl: { t: "From notebook to something you can operate",
       s: ["A model performs well in a notebook",
           { s: "Pin the data, the code and the environment", n: "If you cannot rebuild it identically, you cannot debug it later." },
           { s: "Wrap it behind an interface with versioned inputs and outputs", n: "A service, or a scheduled batch job." },
           { q: "How will you know it has gone wrong?",
             y: "Monitor inputs, outputs and outcomes — before the first deploy, not after",
             n: "You will find out from a customer, which is the expensive way" },
           { s: "Automate the rollback path and test it", n: "Untested rollback is not a rollback." },
           "Every piece is ordinary software engineering — the model is the part that changes without you touching it"] }
},

"Model Deployment": {
 ex: { h: "Getting from a pickle file to a URL",
       b: "The moment a model stops being an artefact and starts being a dependency someone else's page load waits on. Almost every early failure is environmental — a library version differing by a minor release, a feature computed slightly differently — not the model being wrong." },
 fl: { t: "Deploying a model safely",
       s: ["Package model, code and environment together",
           { s: "A container with pinned dependencies", n: "*Works on my machine* is a category of production incident here." },
           { s: "Validate against a golden set of inputs and expected outputs", n: "Same input, same prediction as in training — catches environment drift instantly." },
           { q: "Is this replacing a live model?",
             y: "Shadow first, then canary — never a straight swap",
             n: "Start at low traffic and watch latency and error rate" },
           { s: "Keep the previous version deployable", n: "Rollback is the feature you will use in a hurry." },
           "Log every prediction with its model version — you cannot debug what you did not record"] }
},

"Model Serving": {
 ex: { h: "Fifty milliseconds, ten thousand times a second",
       b: "A recommendation model has to answer inside a page render, so the infrastructure question is not accuracy but throughput per pound: batching requests together to use the GPU efficiently, without any single user waiting for the batch to fill." },
 fl: { t: "Answering a prediction request",
       s: ["A request arrives with a user or item id",
           { s: "Fetch features — this is usually the slow part, not the model", n: "A feature store lookup, or a cache." },
           { q: "Can requests be batched?",
             y: "Micro-batch with a small timeout — far better GPU utilisation",
             n: "Serve individually and scale horizontally" },
           { s: "Run inference and return the prediction", n: "With the model version attached to the response." },
           { s: "Log the input and output asynchronously", n: "Never block the response on logging." },
           "Set a timeout and a fallback — a default recommendation beats a spinning page"] }
},

"Model Registry": {
 ex: { h: "Git for artefacts you cannot diff",
       b: "*Which model is in production?* should not be answered by looking at a filename on a server. A registry gives every trained model a version, its metrics, its training data reference, and a stage — staging, production, archived — so promotion becomes a recorded decision rather than a copy command." },
 fl: { t: "Promoting a model",
       s: ["A training run produces an artefact",
           { s: "Register it with metrics, parameters and data version", n: "Automatically, from the training job — not by hand." },
           { q: "Does it beat the current production model on the holdout set?",
             y: "Promote to staging and run the shadow test",
             n: "Archive it — but keep it, because negative results are evidence" },
           { s: "Promotion to production is an explicit, logged transition", n: "With an approver, in regulated settings." },
           "The registry is what makes *roll back to the model from last Thursday* a one-line operation"] }
},

"Experiment Tracking": {
 ex: { h: "*The good run* was three weeks ago and nobody wrote it down",
       b: "Forty training runs, differing in learning rate, features and seed, and the best one exists as a number in a Slack message. Tracking records every run's parameters, metrics, code commit and artefacts automatically — turning a folder of `model_final_v2_REAL.pkl` into a queryable history." },
 fl: { t: "Instrumenting a training run",
       s: ["Start a run and log its parameters",
           { s: "Including the code commit and the data version", n: "Metrics without those two are not reproducible." },
           { s: "Log metrics as training proceeds", n: "So you can see divergence early and kill the run." },
           { s: "Log artefacts: weights, plots, confusion matrix", n: "Attached to the run, not to a shared drive." },
           { q: "Comparing runs later?",
             y: "Filter and sort by metric — the good run is findable in seconds",
             n: "Promote the winner to the registry" },
           "Log the failures too — knowing what did not work saves the next person a week"] }
},

"MLflow": {
 ex: { h: "The default answer for tracking",
       b: "It covers tracking, packaging, a registry and serving in one open-source tool, which is why it is usually where teams start. Its tracking and registry components carry the weight; its serving side is a reasonable starting point rather than a destination for high-traffic systems." },
 fl: { t: "A typical MLflow loop",
       s: ["Wrap training in a run and log params and metrics",
           { s: "Autologging covers most frameworks with one line", n: "Manual logging for anything bespoke." },
           { s: "Log the model with its signature and environment", n: "The signature records expected input schema — it catches real bugs." },
           { q: "Is this run better than the current champion?",
             y: "Register a new version and move it to staging",
             n: "It stays in the tracking history for comparison" },
           "Point the tracking server at a real database and object store — the local file backend does not survive a team"] }
},

"Model Versioning": {
 ex: { h: "*Why was this loan declined in March?*",
       b: "Answering that requires the exact model that ran, the exact features it received, and the exact code around it. Versioning is what makes the question answerable at all — and in credit, insurance and healthcare it is a legal requirement rather than an engineering nicety." },
 fl: { t: "What a version has to pin",
       s: ["Assign an immutable id to the trained artefact",
           { s: "Never overwrite a version in place", n: "A mutable *latest* destroys every audit trail that points at it." },
           { s: "Bind it to the training data version and code commit", n: "Three coordinates; any one alone is insufficient." },
           { q: "Did the feature computation change without retraining?",
             y: "That is a new effective version — pin the feature pipeline too",
             n: "The model version fully describes the behaviour" },
           "Stamp the version on every prediction you log — that is what makes March answerable"] }
},

"Reproducibility": {
 ex: { h: "Same inputs, same model, eighteen months later",
       b: "The hard part is rarely the seed. It is the library that silently changed a default, the upstream table that was overwritten, and the preprocessing step that lived in someone's notebook. Reproducibility is the discipline of removing each of those, one by one." },
 fl: { t: "Making a training run repeatable",
       s: ["Pin the environment exactly",
           { s: "Lockfiles and a container image digest, not a version range", n: "`>=1.2` is not a pin." },
           { s: "Pin the data by snapshot or content hash", n: "Not by a path that gets overwritten nightly." },
           { s: "Set and record every random seed", n: "Data shuffling, initialisation, augmentation, splits." },
           { q: "Training on a GPU?",
             y: "Bit-exactness may need deterministic kernels — and they are slower",
             n: "Statistical reproducibility is usually the honest target" },
           "Test it: rebuild an old model from its recorded coordinates and compare predictions"] }
},

"Model Drift": {
 ex: { h: "Accuracy did not fall — the world moved",
       b: "A demand forecast trained on 2019 met 2020 and was catastrophically wrong about everything, without a single line of code changing. Every deployed model has a shelf life, and the only question is whether you find out from a monitor or from a quarterly review." },
 fl: { t: "Catching a model going stale before your users do",
       s: [{ s: "A deployed model does not break loudly. It keeps answering confidently while slowly becoming wrong", n: "Nothing errors. There is no alert unless you build one." },
           { s: "The moment you deploy, record what normal looks like", n: "The typical range of each input, how often it predicts each answer, and how accurate it is. This is your reference point." },
           { q: "Do you find out the real answer quickly?",
             y: "Then compare accuracy against that reference directly — the strongest signal available",
             n: "Often you will not know for weeks or months, so watch the inputs and the predictions instead" },
           { s: "Watch for the inputs shifting away from what the model was trained on", n: "Your users changed, or a source system changed. The model has never seen this kind of data." },
           { s: "Watch for the predictions themselves shifting", n: "If it used to flag 3% and now flags 9%, something changed even if you cannot yet say who was right." },
           { s: "Before blaming the world, check whether something upstream broke", n: "A renamed column or a stuck lookup table looks exactly like drift and is far more common." }] }
},

"Data Drift": {
 ex: { h: "The average age of your users has quietly risen",
       b: "The relationship between features and outcome may be perfectly intact — but the model now spends most of its time in a region of the input space it saw little of during training, where it was never accurate. Nothing errors, and the model is confidently outside its competence." },
 fl: { t: "Detecting and responding",
       s: ["Compare live feature distributions against the training baseline",
           { s: "Population Stability Index, KS test, or simple percentile shifts", n: "Simple usually beats clever here — you need it to be readable." },
           { q: "Is the drift genuine, or is a pipeline broken?",
             y: "Check for nulls, unit changes and category renames first",
             n: "It is real — check whether accuracy has actually moved" },
           { s: "Drift without accuracy loss may not need action", n: "Retraining on noise costs money and risks regression." },
           "Monitor the most important features closely — drift in an unused feature is not interesting"] }
},

"Concept Drift": {
 ex: { h: "The same input now means something different",
       b: "*Free* in a subject line was a strong spam signal until legitimate marketers learned that and stopped using it, and spammers moved on. The inputs look the same; the mapping to the target changed underneath. This is the drift that input monitoring cannot see." },
 fl: { t: "Recognising it",
       s: ["Accuracy falls",
           { q: "Have the input distributions moved?",
             y: "Data drift — the model is being asked about unfamiliar territory",
             n: "Concept drift — the same inputs now imply a different answer" },
           { s: "Adversarial domains drift fastest", n: "Fraud and spam actively adapt to your model." },
           { s: "Retraining on recent data is the standard response", n: "Weight recent examples more heavily, or use a shorter window." },
           "In adversarial settings, plan for continuous retraining from the start — it is not an exception"] }
},

"Model Monitoring": {
 ex: { h: "The dashboard that catches a silent failure",
       b: "A feature pipeline started sending nulls for `days_since_last_order`. The model imputed zero, treated every customer as brand new, and recommendations collapsed for a fortnight — with no error, no alert, and perfectly healthy latency graphs." },
 fl: { t: "What to watch, in priority order",
       s: ["Operational health: latency, error rate, throughput",
           { s: "Standard service monitoring — necessary and insufficient", n: "A model can be fast, healthy and wrong." },
           { s: "Input health: nulls, ranges, category sets, drift", n: "This is where the silent failures show up first." },
           { s: "Output health: prediction distribution and confidence", n: "A sudden shift in predicted class mix is a strong early signal." },
           { q: "Do labels eventually arrive?",
             y: "Join them back to predictions and track true accuracy over time",
             n: "Sample and label manually — a hundred a week beats nothing" },
           "Route alerts to the team that owns the model, with a runbook attached"] }
},

"Retraining": {
 ex: { h: "Refreshing the model without breaking the product",
       b: "The seductive framing is *just retrain nightly*. The reality is that each retrain is a new model with new behaviour, and shipping it without evaluation means the recommendation quality of your product is now decided by whatever happened in the last 24 hours of data." },
 fl: { t: "A safe retraining cycle",
       s: ["A trigger fires — schedule, drift alert, or accuracy drop",
           { s: "Assemble a fresh training set and a fixed evaluation set", n: "The evaluation set must not move, or you cannot compare across time." },
           { s: "Train and evaluate against the current champion", n: "Same holdout, same metrics." },
           { q: "Does the challenger beat the champion?",
             y: "Promote through shadow and canary — do not swap straight in",
             n: "Keep the champion and investigate why the new data did not help" },
           "Check subgroup metrics, not just the average — a retrain can improve overall and regress a segment"] }
},

"Continuous Training": {
 ex: { h: "The pipeline that retrains itself",
       b: "In fraud or ranking, a month-old model is already stale, so retraining becomes a scheduled pipeline rather than a project. The essential safeguard is an automated quality gate — without one, you have built a system that can deploy a broken model at three in the morning with nobody watching." },
 fl: { t: "The automated loop",
       s: ["Fresh data lands and passes validation",
           { s: "Data validation is the first gate", n: "Garbage in, automatically deployed garbage out." },
           { s: "Training runs and logs to the registry", n: "Fully automated, fully recorded." },
           { q: "Does it clear every quality gate?",
             y: "Deploy as a canary and watch live metrics",
             n: "Halt the pipeline and alert a human — never deploy on a *close enough*" },
           { s: "Automatic rollback on live metric regression", n: "The gate that makes the whole thing safe to leave unattended." },
           "Do not automate deployment until you have automated the rollback"] }
},

"Training-Serving Skew": {
 ex: { h: "The same feature, computed two different ways",
       b: "Training used a Spark job that computed a 30-day average including today; serving used a service that excluded today. Offline accuracy 91%, live accuracy 74%, and months lost looking at the model. The bug was never in the model." },
 fl: { t: "Finding and preventing it",
       s: ["Offline metrics are good and live performance is not",
           { q: "Are training and serving features computed by the same code?",
             y: "Skew is unlikely — look at data drift instead",
             n: "This is your prime suspect, before anything else" },
           { s: "Log the actual serving features and score them offline", n: "If offline scoring of live features drops, you have found it." },
           { s: "A feature store enforces one definition for both paths", n: "Which is the structural fix rather than a patch." },
           "Beware time leakage: a feature available at training time but not at prediction time produces exactly this"] }
},

"Feature Store": {
 ex: { h: "One definition of *average order value*",
       b: "Three teams computed it three ways, and the model trained on one of them was served another. A feature store makes the definition a shared, versioned artefact — computed once, served to training from an offline store and to inference from a low-latency online one, with point-in-time correctness built in." },
 fl: { t: "How one feature serves both paths",
       s: ["Define the feature once, in code, with an owner",
           { s: "The definition is versioned and reviewable", n: "Changing it is a code change, not a notebook edit." },
           { s: "The offline store holds full history for training", n: "With point-in-time joins so you never leak the future into a training row." },
           { s: "The online store holds current values for inference", n: "Key-value, single-digit millisecond reads." },
           { q: "Do both stores derive from the same definition?",
             y: "Training-serving skew is structurally prevented",
             n: "You have built two pipelines and a future incident" },
           "Worth the operational cost when several models share features — overkill for one model"] }
},

"Shadow Deployment": {
 ex: { h: "Running the new model with the microphone off",
       b: "Live traffic goes to both models; only the old one's answers are used. You get real inputs, real latency and a real comparison with zero user risk — and you routinely discover that the new model is 200ms slower or falls over on inputs your test set never contained." },
 fl: { t: "Testing a new model on real traffic without risking anything",
       s: [{ s: "You have a new model that looks better in testing, but testing cannot see everything", n: "It cannot see real traffic patterns, real speed under load, or data arriving in a slightly different shape." },
           { s: "So send every real request to both models — the live one and the candidate", n: "The user gets the live model's answer, exactly as before. Nothing changes for them." },
           { s: "Run the candidate off to the side, never making the user wait for it", n: "If it is slow or crashes, the real request is completely unaffected. That isolation is the whole point." },
           { s: "Throw away the candidate's answers, but write them down next to the live one's", n: "Same request, two answers, side by side." },
           { q: "What does that actually tell you?",
             y: "Whether it runs, how fast it is, and where the two disagree — which is where you should look first",
             n: "It cannot tell you which one was right, because nobody acted on the candidate's answer, so no outcome ever came back" }] }
},

"A/B Testing": {
 ex: { h: "The model with better accuracy sold less",
       b: "A more accurate recommender ranked safe, obvious items higher and users stopped discovering anything. Offline metrics measure prediction; A/B tests measure outcomes — and they are the only way to learn that your metric and your business are not aligned." },
 fl: { t: "Running a model A/B test",
       s: ["Decide the business metric before you start",
           { s: "Revenue, retention, completion — not model accuracy", n: "Pre-registering the metric is what stops post-hoc rationalising." },
           { s: "Randomise by user, not by request", n: "Otherwise one person sees both models and the experience is incoherent." },
           { q: "Has it reached the pre-computed sample size?",
             y: "Read the result once, at the end",
             n: "Do not peek and stop early — that manufactures significance" },
           { s: "Watch guardrail metrics throughout", n: "Latency, error rate, complaints — stop early for harm, not for a good result." },
           "Novelty effects fade — run long enough to see the steady state"] }
},

"Champion-Challenger": {
 ex: { h: "A standing competition rather than a project",
       b: "The production model is the champion and holds its place until something beats it on a fixed, pre-agreed evaluation. It reframes model work from *ship the new one* to *earn the slot*, which is a much healthier default when several teams propose improvements." },
 fl: { t: "Running the contest",
       s: ["Fix the evaluation set and the metric in advance",
           { s: "Frozen — otherwise every challenger optimises the benchmark", n: "This is where the discipline lives." },
           { s: "Challengers run in shadow against live traffic", n: "Same inputs, same conditions." },
           { q: "Does a challenger beat the champion by a meaningful margin?",
             y: "Promote it — it becomes the new champion, and the old one is archived",
             n: "The champion stays; a marginal win is not worth deployment risk" },
           "Define *meaningful* numerically up front, or every close call becomes an argument"] }
},

"ONNX": {
 ex: { h: "Train in PyTorch, run in C++",
       b: "The research team works in Python; the product is an embedded device or a .NET service. ONNX is the interchange format that lets the model cross that boundary — and the reliable friction is unsupported custom operators, which surface at export rather than at design time." },
 fl: { t: "Exporting a model",
       s: ["Trace or script the model into the ONNX graph",
           { q: "Does it contain a custom or unsupported operator?",
             y: "Rewrite it with supported ops, or implement a custom kernel in the runtime",
             n: "The export succeeds" },
           { s: "Verify numerically: same input, same output as the original", n: "Within a small tolerance. Do not skip this — silent divergence happens." },
           { s: "Run it through the target runtime and benchmark", n: "ONNX Runtime, TensorRT or a mobile equivalent." },
           "Fix opset versions explicitly — a runtime that predates your opset will refuse the model"] }
},

"Model Card": {
 ex: { h: "The label on the tin",
       b: "One page: what this model is for, what it was trained on, how it performs — including per subgroup — and what it must not be used for. Cheap to write, and the reason a model built for one purpose is less likely to be quietly repurposed for another it is unfit for." },
 fl: { t: "Writing one that is actually useful",
       s: ["State the intended use, plainly",
           { s: "And the out-of-scope uses, explicitly", n: "This section prevents more harm than the rest combined." },
           { s: "Describe the training data and its known gaps", n: "Where it came from, what period, who is under-represented." },
           { q: "Do you have disaggregated performance figures?",
             y: "Publish them — an aggregate number hides the failure mode that matters",
             n: "Say so, and treat it as a gap to close" },
           { s: "Record limitations and ethical considerations", n: "Honestly. A card with no limitations is not credible." },
           "Version the card with the model — an outdated card is worse than none"] }
},

"Model Governance": {
 ex: { h: "Who approved this, and can you prove it?",
       b: "In credit and insurance, a model is a regulated artefact: its approval, validation, monitoring and retirement all have to be documented. Even outside regulation, governance is what prevents a model from running in production for two years with an owner who left the company." },
 fl: { t: "A model's controlled lifecycle",
       s: ["Register the model with a named owner and purpose",
           { s: "Unowned models are the root of most governance failures", n: "Ownership must transfer explicitly when people move." },
           { s: "Independent validation before approval", n: "Reviewed by someone who did not build it." },
           { q: "Is it high-impact — credit, health, employment?",
             y: "Formal sign-off, documented testing for bias, and periodic re-review",
             n: "Lightweight review, but still recorded" },
           { s: "Monitor in production and schedule re-validation", n: "Approval is not permanent." },
           "Include retirement — models that quietly outlive their purpose are a real category of risk"] }
},

"Responsible AI": {
 ex: { h: "The recruiting model that learned who gets hired",
       b: "Trained on a decade of decisions, it reproduced the pattern in those decisions faithfully — which was the problem. Nothing in the pipeline was broken; the objective was met exactly. Responsible AI is the practice of asking what the objective is actually optimising before, not after." },
 fl: { t: "Questions to answer before building",
       s: ["Who is affected by this system's decisions?",
           { s: "Including people who are not the user", n: "The person being scored is rarely the person buying the product." },
           { q: "Does the training data encode past decisions you would not defend?",
             y: "The model will reproduce them, confidently and at scale",
             n: "Measure outcomes across groups anyway — proxies exist" },
           { s: "Decide the recourse path", n: "How does someone contest a decision? Who can override it?" },
           { s: "Document limitations and monitor for disparate impact", n: "Continuously — fairness at launch does not stay." },
           "*We did not include the protected attribute* is not a defence — correlated proxies do the work"] }
},

"Bias": {
 ex: { h: "97% accurate, and useless for a third of users",
       b: "A speech model reaching 97% overall was at 78% for one regional accent — invisible in the headline number, obvious the moment the results were disaggregated. Bias in production is usually not a dramatic failure; it is an average that hides an uneven one." },
 fl: { t: "Finding it",
       s: ["Choose the groups you will evaluate across",
           { s: "The ones where unequal performance would cause harm", n: "Requires collecting or inferring group membership — itself a decision with tradeoffs." },
           { s: "Compute your metrics per group, never just overall", n: "This single step catches most of it." },
           { q: "Do error rates differ materially?",
             y: "Investigate the cause — usually data representation, sometimes labels themselves",
             n: "Keep monitoring; drift can introduce disparity later" },
           { s: "Fairness definitions conflict mathematically", n: "You cannot satisfy equal false-positive rates and equal calibration at once — choose deliberately." },
           "Removing the protected attribute does not remove the bias — proxies remain"] }
},

"Human-in-the-Loop": {
 ex: { h: "The model sorts, a person decides",
       b: "A radiology triage model flags likely-urgent scans and reorders the queue; the radiologist still reads every one. Accuracy of 92% is unacceptable as an automated decision and genuinely valuable as a prioritisation — the same model, deployed with a human in a different position." },
 fl: { t: "Designing the handoff",
       s: ["Decide what the model is allowed to decide alone",
           { q: "Is the confidence above the auto-approve threshold?",
             y: "Act automatically and log it",
             n: "Route to a human with the model's reasoning attached" },
           { s: "Show the evidence, not just the score", n: "A human reviewing a bare number will rubber-stamp it." },
           { s: "Capture the human's decision as new training data", n: "The review queue is your best labelling pipeline." },
           { s: "Watch for automation bias", n: "People agree with confident systems more than they should — measure override rates." },
           "Set the threshold from the cost of each error type, not from a round number"] }
},

"Ground Truth": {
 ex: { h: "The answer key is also written by people",
       b: "Two doctors disagree on the same scan a meaningful fraction of the time, so *ground truth* is a consensus label with its own error rate. A model reported at 95% accuracy against labels that are 92% consistent is being measured against a moving target — and the ceiling is not 100%." },
 fl: { t: "Building a trustworthy label set",
       s: ["Write annotation guidelines before labelling anything",
           { s: "Ambiguity in the guidelines becomes noise in the labels", n: "And noise in the labels caps the model's achievable accuracy." },
           { s: "Have multiple annotators label an overlapping sample", n: "Measure inter-annotator agreement." },
           { q: "Is agreement low?",
             y: "The task itself is ambiguous — fix the guidelines before training anything",
             n: "Adjudicate disagreements and record the resolution" },
           "Report model accuracy against the agreement ceiling, not against a notional 100%"] }
},

"Model Rollback": {
 ex: { h: "The thirty-second fix at three in the morning",
       b: "A new model is quietly making bad recommendations. The correct first action is not to debug it — it is to put the previous version back and debug in daylight. That only works if the old artefact, its environment and its features are all still deployable." },
 fl: { t: "Rolling back cleanly",
       s: ["A live metric breaches its threshold",
           { s: "Revert traffic to the previous model version", n: "One command, from the registry — practised in advance." },
           { q: "Did the feature pipeline change along with the model?",
             y: "It must roll back too, or the old model gets inputs it never saw",
             n: "The model revert is sufficient" },
           { s: "Confirm metrics recover, then investigate", n: "Diagnosis after mitigation, always." },
           { s: "Keep the failed version and its logs", n: "It is the evidence for the postmortem." },
           "Rehearse rollback in a drill — the first attempt should not be during an incident"] }
},

"Cold Start": {
 ex: { h: "The recommender's first day with a new user",
       b: "No history means no personalisation, and showing nothing is not an option. The standard answer is a graceful ladder: popular items, then items popular within their inferred segment, then genuine personalisation once a handful of interactions exist." },
 fl: { t: "Handling a user with no history",
       s: ["A request arrives for an unknown user or item",
           { q: "Is there any signal at all?",
             y: "Use it — device, locale, referrer, or the first item they clicked",
             n: "Fall back to global popularity — unpersonalised but never empty" },
           { s: "Content-based features work without interaction history", n: "An item's attributes exist before anyone has clicked it." },
           { s: "Deliberately explore early", n: "A little randomness gathers the signal you need to personalise at all." },
           "The same problem hits serverless inference — a container's first request pays the model load time"] }
},

"Inference Server": {
 ex: { h: "Purpose-built, rather than Flask with a model in it",
       b: "The naive service loads a model into a web framework and serves one request at a time — leaving an expensive GPU idle most of the time. A real inference server batches requests, manages multiple model versions, and uses the accelerator properly, which changes the cost per prediction by an order of magnitude." },
 fl: { t: "What it does that a simple web app does not",
       s: [{ s: "Requests arrive one at a time, from different users, at unpredictable moments", n: "A plain web app would run the model once per request, immediately." },
           { s: "But a graphics card is enormously more efficient handling many at once than one at a time", n: "Running one request uses a fraction of it. Running thirty together costs barely more." },
           { s: "So the server waits a few thousandths of a second, collects whatever arrives, and runs them as one group", n: "Users notice nothing, and you may get several times the throughput from the same hardware. This is the single biggest win available." },
           { s: "It also holds several models, and several versions of each, side by side", n: "So you can send a small share of traffic to a new version without building any new infrastructure." },
           { q: "Is the card sitting mostly idle?",
             y: "Wait slightly longer to gather bigger groups, or load a second model onto the same card",
             n: "If requests are queuing instead, the groups are already as big as they can be and you need more hardware" }] }
},

"Model Compression": {
 ex: { h: "Fitting the model on the phone",
       b: "A 400 MB model is not shipping in a mobile app, and a large model on a GPU cluster costs real money per request. Quantising to 8-bit typically cuts size fourfold for a small accuracy loss — and the loss is only small if you measure it on your own data." },
 fl: { t: "Shrinking a model",
       s: ["Establish the accuracy and latency you must keep",
           { q: "Is size or speed the constraint?",
             y: "Quantisation — smaller weights, faster arithmetic, hardware support",
             n: "Pruning or distillation — remove structure, or train a smaller student" },
           { s: "Post-training quantisation is one line and often enough", n: "Quantisation-aware training recovers more accuracy for more effort." },
           { s: "Re-measure on your own evaluation set, per class", n: "Aggregate accuracy can hold while a minority class collapses." },
           "Check the target hardware actually accelerates the format — otherwise you shrank it for nothing"] }
},

"Batch Inference": {
 ex: { h: "Score everyone overnight, serve from a table",
       b: "A churn score does not need to be computed while a user waits — it needs to be in the CRM by nine. Batch scoring turns an inference service into a scheduled job plus a lookup, which is simpler, cheaper and far easier to operate than real-time serving." },
 fl: { t: "Choosing batch over real-time",
       s: ["Ask how fresh the prediction genuinely needs to be",
           { q: "Is yesterday's score acceptable?",
             y: "Batch — score everything on a schedule, serve from a key-value store",
             n: "Real-time — you need the online path and its operational cost" },
           { s: "Batch gets far better hardware utilisation", n: "Large batches, no latency budget, spot instances." },
           { s: "Write results with the model version and a timestamp", n: "So a stale table is visible rather than silent." },
           "Many *real-time* requirements are batch requirements with an impatient stakeholder attached"] }
},

"Latency Budget": {
 ex: { h: "You have 40ms, not 200ms",
       b: "The page must render in 300ms; the API has 150ms; the model gets 40ms of that after feature fetching and network. That budget, not the leaderboard, is what decides your architecture — and it is the number that rules out the model that would have been 2% more accurate." },
 fl: { t: "Allocating the budget",
       s: ["Start from the user-facing requirement and work inward",
           { s: "Subtract network, auth, feature fetch and serialisation", n: "Feature fetching often takes more than inference does." },
           { q: "Does the model fit in what remains?",
             y: "Ship it, and hold p99 not the average",
             n: "Compress, precompute, cache, or choose a smaller model" },
           { s: "Precomputing turns a latency problem into a freshness tradeoff", n: "Often the cheapest fix available." },
           { s: "Always have a timeout and a fallback", n: "A default answer on time beats a good answer too late." },
           "Measure p99, not the mean — the tail is what users actually experience"] }
},

"Notebook-to-Production Gap": {
 ex: { h: "Cell 47 depends on cell 12, which was deleted",
       b: "Notebooks reward exploration and punish reproducibility: hidden state, out-of-order execution, hardcoded paths, and no tests. The gap is not that the code is bad — it is that a notebook is a lab bench, and production needs a factory." },
 fl: { t: "Closing the gap",
       s: ["Restart the kernel and run top to bottom",
           { q: "Does it still work?",
             y: "Good — the hidden-state problem is at least visible",
             n: "You have discovered you cannot reproduce your own result" },
           { s: "Extract logic into importable modules with tests", n: "The notebook then calls the module, not the reverse." },
           { s: "Parameterise paths and configuration", n: "No absolute paths, no personal credentials." },
           { s: "Put it in version control and run it in CI", n: "The point at which it becomes software." },
           "Keep the notebook for exploration — just stop shipping it"] }
},

"GPU Utilisation": {
 ex: { h: "Paying for a Ferrari to sit in traffic",
       b: "An accelerator at 20% utilisation is an expensive way to run a data loader. The bottleneck is almost never the GPU itself — it is disk reads, CPU-side preprocessing, or a batch size small enough that the device finishes before the next batch arrives." },
 fl: { t: "Diagnosing low utilisation",
       s: ["Watch utilisation during a training step",
           { q: "Is it spiking and dropping rather than staying high?",
             y: "The GPU is waiting on data — fix the input pipeline first",
             n: "Consistently low means the batch is too small for the device" },
           { s: "Increase workers, prefetch, and cache decoded data", n: "Preprocessing on the CPU is the usual culprit." },
           { s: "Raise batch size until memory is nearly full", n: "Then use mixed precision to fit more." },
           { s: "Profile before optimising", n: "The bottleneck is rarely where the intuition says it is." },
           "For inference, batching is the lever — a GPU serving one request at a time is mostly idle"] }
}

});
