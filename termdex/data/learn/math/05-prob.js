/* ML Maths — probability. */
TD.addLessons("math", [

{
 t: "Distributions, Expectation, and What 0.83 Actually Means",
 m: "prob",
 lvl: "core",
 s: "Every model output is a belief. This is how to read one without over-trusting it.",
 goal: [
  "Read a probability distribution and say what its shape implies",
  "Compute an expectation and use it to make a decision under uncertainty",
  "Explain why a model's 0.83 is not a promise of being right 83% of the time"
 ],
 b: [
  { p: "Classical software returns answers. Machine learning returns beliefs. Confusing the two is the source of a large fraction of production incidents in this field, and the fix starts with being precise about what a probability is." },

  { h: "A distribution is a shape, not a number" },
  { p: "A **probability distribution** describes every outcome that could happen and how likely each is. Two distributions with the same average can behave completely differently, and in machine learning the difference usually matters more than the average." },

  { code: { lang: "python", t: "Same mean, entirely different behaviour",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "rng = np.random.default_rng(42)", w: "**Seeded**, so the numbers are reproducible. Do this in anything you will report." },
     { c: "", w: "" },
     { c: "steady = rng.normal(100, 5, 10000)", w: "Mean 100, standard deviation 5. **API latency on a healthy service.**" },
     { c: "spiky  = rng.normal(100, 50, 10000)", w: "Mean 100, standard deviation 50. **The same average, ten times the spread.**", hi: true },
     { c: "", w: "" },
     { c: "steady.mean(), spiky.mean()", w: "Both about 100. Identical on the metric most dashboards show." },
     { c: "np.percentile(steady, 99)", w: "≈ 112 ms. Your worst users wait 112 ms." },
     { c: "np.percentile(spiky, 99)", w: "**≈ 216 ms.** The same average, and one user in a hundred waits nearly twice as long.", hi: true }
    ],
    out: "(100.04, 99.63)\n111.7\n215.8",
    after: "This is why latency is reported at p95 and p99 rather than as a mean. An average conceals exactly the cases that make people leave, and *the average was fine* is one of the least useful sentences in engineering." } },

  { h: "The distributions you will actually meet" },
  { tbl: { t: "Four shapes and where they show up",
    h: ["Distribution", "Shape", "Where you meet it"],
    rows: [
     ["**Normal** (Gaussian)", "Symmetric bell", "Measurement noise, weight initialisation, heights. The default assumption of most statistics, and frequently wrong"],
     ["**Uniform**", "Flat", "Random sampling, dropout masks, shuffling"],
     ["**Bernoulli / Binomial**", "Two outcomes, counted", "Click or no click, fraud or not fraud, A/B test conversions"],
     ["**Long-tailed** (power law)", "Huge head, endless tail", "**Almost all real data.** Word frequency, sales per product, requests per user, tokens per document. The mean is nearly meaningless here"]
    ] } },

  { trap: "Assuming your data is normal is the most common statistical error in applied machine learning. Real quantities — document lengths, session durations, purchase amounts, followers per account — are overwhelmingly long-tailed, where a handful of extreme values dominate everything. The average document length in your corpus is not a document you will ever see. Plot a histogram before assuming a shape; it takes ten seconds and prevents whole categories of mistakes." },

  { h: "Expectation: the average you would get if you ran it forever" },
  { p: "**Expectation** is a weighted average — each outcome times its probability. It is how you compare options when you cannot know which one will happen, and it is the mathematics of nearly every cost decision in an AI system." },

  { code: { lang: "python", t: "Choosing a model with expectation",
    lines: [
     { c: "# Cheap model: right 80% of the time, ₹0.10 per call", w: "" },
     { c: "# Expensive model: right 95%, ₹2.00 per call", w: "" },
     { c: "# A wrong answer costs ₹50 in support handling.", w: "**Give the failure a price.** Without this number the comparison is unresolvable, which is why product decisions stall.", hi: true },
     { c: "", w: "" },
     { c: "cheap = 0.10 + 0.20 * 50", w: "**₹10.10** per request, expected. The 20% failure rate dominates the price completely." },
     { c: "costly = 2.00 + 0.05 * 50", w: "**₹4.50** per request, expected." }
    ],
    out: "10.10\n4.50",
    after: "The model costing twenty times more per call is less than half the total cost. That reasoning — in one line of arithmetic — is worth more in a design review than any amount of benchmark discussion, and almost nobody brings it." } },

  { n: "This is also how to defend a decision to non-technical stakeholders. *The expensive model is better* invites argument. *The cheap model costs us ₹10.10 per request all-in and the expensive one ₹4.50* ends it. Attaching a cost to failure converts a matter of taste into arithmetic.",
    nt: "The most useful thing in this lesson" },

  { h: "What a model's 0.83 actually means" },
  { p: "Your classifier outputs 0.83. The tempting reading is *it will be right 83% of the time*. That reading is wrong twice over." },

  { l: [
   "**It is a score, not a frequency.** It came out of a softmax, which exaggerates differences by design. A well-trained model is often *over*confident: the cases it labels 0.99 may only be right 92% of the time.",
   "**It is a probability of a class, not of correctness.** 0.83 means *the model's belief that this is class A is 0.83* — nothing about whether the model as a whole is reliable on inputs like this one."
  ] },

  { p: "A model is **calibrated** when its 0.8 predictions are correct about 80% of the time. Most are not calibrated out of the box, and neural networks are typically worse than logistic regression at this. It is fixable and rarely fixed." },

  { code: { lang: "python", t: "Checking calibration in ten lines",
    lines: [
     { c: "def calibration_table(probs, labels, bins=5):", w: "" },
     { c: "    edges = np.linspace(0, 1, bins + 1)", w: "Buckets: 0–0.2, 0.2–0.4, and so on." },
     { c: "    for lo, hi in zip(edges[:-1], edges[1:]):", w: "" },
     { c: "        m = (probs >= lo) & (probs < hi)", w: "Every prediction whose confidence lands in this bucket." },
     { c: "        if m.sum() == 0: continue", w: "" },
     { c: "        print(f'{lo:.1f}-{hi:.1f}: claimed {probs[m].mean():.2f}, '", w: "" },
     { c: "              f'actual {labels[m].mean():.2f}, n={m.sum()}')", w: "**Claimed against actual.** If a well-calibrated model says 0.7, roughly 70% of that bucket should be correct.", hi: true }
    ],
    out: "0.0-0.2: claimed 0.09, actual 0.11, n=412\n0.2-0.4: claimed 0.31, actual 0.36, n=188\n0.4-0.6: claimed 0.50, actual 0.52, n=145\n0.6-0.8: claimed 0.71, actual 0.64, n=201\n0.8-1.0: claimed 0.94, actual 0.81, n=554",
    after: "The top bucket is the problem: the model claims 0.94 and delivers 0.81. It is systematically overconfident exactly where you are most likely to act on it automatically. If your product auto-approves anything above 0.9, you are approving on a promise the model cannot keep." } },

  { trap: "This applies to language models too, and worse. A model's fluency is completely uncorrelated with its accuracy — it will produce a confident, well-structured, entirely fabricated citation in exactly the same tone as a correct one. There is no internal *I am unsure* signal you can read off the text. This is why grounding in retrieved sources and validating outputs against them is not optional." },

  { tryit: { t: "Price a threshold",
    task: "A fraud classifier outputs a probability. Blocking a legitimate transaction costs ₹200 in customer goodwill; letting a fraudulent one through costs ₹5,000. At what probability should you block? Work it out with expectation.",
    hint: "At probability p of fraud, blocking costs `(1-p) × 200` (the chance you were wrong about a good customer) and allowing costs `p × 5000`. Find where they cross.",
    sol: { lang: "python", code: "# Expected cost of each action at fraud probability p:\n#   block : (1 - p) * 200      # cost only if it was legitimate\n#   allow : p * 5000           # cost only if it was fraud\n#\n# Block when allowing costs more:\n#   p * 5000 > (1 - p) * 200\n#   5000p > 200 - 200p\n#   5200p > 200\n#   p > 0.0385\n\nfor p in [0.02, 0.0385, 0.10, 0.50]:\n    block, allow = (1 - p) * 200, p * 5000\n    print(f'p={p:<7} block=Rs{block:>7.2f}  allow=Rs{allow:>7.2f}  -> '\n          f'{\"BLOCK\" if allow > block else \"allow\"}')" },
    w: "The threshold is 3.85%, not 50%. Almost everyone's instinct is to block above 50% because that is where the model is *more likely than not* to be right — and that instinct is expensive, because it ignores the 25:1 asymmetry in what the two mistakes cost. Thresholds should come from the cost of each error, never from the fact that 0.5 is halfway." } },

  { vocab: ["Probability", "Probability Distribution", "Normal Distribution", "Softmax", "Variance"] }
 ],
 k: [
  "A distribution is a shape; two with the same mean can behave completely differently, which is why latency is measured at p99.",
  "Most real data is long-tailed, not normal. Plot a histogram before assuming otherwise.",
  "Expectation is outcome times probability — the arithmetic that settles cost arguments in design reviews.",
  "A model's 0.83 is a score, not a frequency, and most models are overconfident where it matters most.",
  "Set decision thresholds from the cost of each error, not from 0.5."
 ],
 r: ["Probability", "Probability Distribution", "Normal Distribution", "Softmax", "Variance", "Expected Value"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "rng = np.random.default_rng(42)", w: "a seeded random generator, for reproducible results" },
   { c: "np.percentile(latencies, 99)", w: "the p99 — what your worst users actually experience" },
   { c: "expected = p_fail * cost_of_failure + cost_per_call", w: "expected cost, the arithmetic that settles arguments" },
   { c: "(probs >= lo) & (probs < hi)", w: "a boolean mask selecting one confidence bucket" }
  ]
 }
},

{
 t: "Conditional Probability and Bayes, Without the Textbook",
 m: "prob",
 lvl: "core",
 s: "Why a 99%-accurate test can be wrong most of the time, and why it matters for your classifier.",
 goal: [
  "Read `P(A|B)` and explain why it is not `P(B|A)`",
  "Apply Bayes' theorem to a base-rate problem and get the counterintuitive answer",
  "Recognise base-rate neglect in your own model evaluation"
 ],
 b: [
  { p: "This lesson contains the single most useful counterintuitive result in applied statistics. It explains why fraud detectors flood analysts with false alarms, why medical screening is harder than it sounds, and why *99% accurate* is often a meaningless claim." },

  { h: "Conditional probability" },
  { p: "`P(A|B)` — *the probability of A given B* — is how likely A is once you already know B is true. Knowing something changes the odds, which sounds obvious and is routinely forgotten." },

  { l: [
   "`P(rain)` in Bengaluru in June — moderately high.",
   "`P(rain | the sky is black)` — much higher. New information updated the belief.",
   "`P(rain | it is 3pm)` — barely different. Not all information is informative."
  ] },

  { trap: "`P(A|B)` and `P(B|A)` are different numbers and swapping them is the most common probability error there is. `P(has a beard | is a man)` is maybe 0.3. `P(is a man | has a beard)` is close to 1. Same two facts, wildly different probabilities. In machine learning this appears as: `P(flagged | fraud)` is your recall, and `P(fraud | flagged)` is your precision, and confusing them will get a system deployed that nobody can operate." },

  { h: "The result that surprises everyone" },
  { p: "A disease affects 1 person in 1,000. A test is 99% accurate — it correctly identifies 99% of sick people and correctly clears 99% of healthy ones. You test positive. What is the probability you have it?" },

  { p: "Almost everyone says 99%. The answer is about **9%**." },

  { code: { lang: "python", t: "Count actual people. This is the whole proof.",
    lines: [
     { c: "population = 100_000", w: "" },
     { c: "", w: "" },
     { c: "sick    = 100", w: "1 in 1,000." },
     { c: "healthy = 99_900", w: "**Everyone else. Note how many more of them there are.**", hi: true },
     { c: "", w: "" },
     { c: "true_positives  = sick * 0.99", w: "99 sick people correctly caught." },
     { c: "false_positives = healthy * 0.01", w: "**999 healthy people wrongly flagged.** Only 1% of them — but 1% of a very large group.", hi: true },
     { c: "", w: "" },
     { c: "true_positives / (true_positives + false_positives)", w: "99 / (99 + 999) = **0.090**. Nine percent." }
    ],
    out: "99.0\n999.0\n0.09016393442622951",
    after: "The test is not broken and 99% accuracy is not a lie. There are simply a thousand times more healthy people, so even a small error rate applied to the large group swamps the perfect performance on the small one. The rarity of the condition — the **base rate** — dominates everything." } },

  { ana: "Sift a beach for gold with a sieve that catches 99% of gold and only 1% of sand. It sounds superb. But there is a thousand times more sand than gold, so your bucket comes back mostly sand — not because the sieve failed, but because there was so much more sand to let through. Improving the sieve's gold-catching from 99% to 99.9% changes almost nothing; the only thing that helps is letting less sand through.",
    at: "The sieve on the beach" },

  { h: "Bayes' theorem, which is that count written down" },
  { syn: { t: "The same arithmetic, in symbols",
    parts: [
     { p: "P(A|B)", w: "What you want: probability you are sick, **given** the positive test." },
     { p: " = " },
     { p: "P(B|A)", w: "The test's sensitivity — probability of a positive **given** sickness. 0.99." },
     { p: " × " },
     { p: "P(A)", w: "**The base rate.** How common the condition is before any test. 0.001. This is the term everyone omits, and it is the one that decides the answer." },
     { p: " / " },
     { p: "P(B)", w: "How often a positive occurs at all, sick or not. Here 0.01098." }
    ],
    after: "0.99 × 0.001 / 0.01098 = 0.090. Identical to counting people, which is how you should check it whenever the formula feels slippery." } },

  { h: "Why this decides whether your classifier is usable" },
  { p: "Rare-event classification is most of the commercially valuable machine learning there is — fraud, churn, defects, disease, safety violations. In all of them the base rate is low, and a model with excellent-sounding accuracy can be operationally worthless." },

  { code: { lang: "python", t: "A fraud model, evaluated honestly",
    lines: [
     { c: "transactions = 1_000_000", w: "" },
     { c: "fraud_rate = 0.001", w: "**1 in 1,000 transactions is fraud.** Typical, and often optimistic." },
     { c: "", w: "" },
     { c: "fraud, legit = 1_000, 999_000", w: "" },
     { c: "", w: "" },
     { c: "caught = fraud * 0.90", w: "**90% recall** — the model catches 900 of the 1,000 frauds. Genuinely good." },
     { c: "false_alarms = legit * 0.01", w: "**1% false positive rate** — sounds tiny. It is 9,990 legitimate transactions.", hi: true },
     { c: "", w: "" },
     { c: "precision = caught / (caught + false_alarms)", w: "**0.083.** Fewer than one flag in twelve is real fraud." },
     { c: "", w: "" },
     { c: "accuracy = (caught + legit * 0.99) / transactions", w: "**0.9891.** Which is the number that ends up on the slide.", hi: true }
    ],
    out: "0.0827\n0.9891",
    after: "*98.9% accurate* is true and useless. Your analysts receive 10,890 alerts per million transactions, of which 900 matter — eleven wrong for every right one. They will stop trusting the queue within a fortnight, and no amount of model improvement fixes a system whose operators have given up on it." } },

  { n: "This is why a model for a rare event is judged on **precision and recall**, never accuracy. It is also why the right first question about any classifier is *what fraction of the data is the positive class?* If it is 0.1%, a model that predicts *no* every single time is 99.9% accurate, and you should be immediately suspicious of any accuracy figure near the base rate.",
    nt: "The first question to ask about any classifier" },

  { h: "Three ways to make a rare-event system workable" },
  { ol: [
   "**Raise the threshold.** Fewer alerts, higher precision, some missed cases. This is a business decision about which error is more expensive, and it should be made explicitly rather than left at 0.5.",
   "**Narrow the population.** Apply the model only where the base rate is higher — new accounts, unusual amounts, unfamiliar devices. Changing `P(A)` moves the answer far more than improving the model does.",
   "**Stage it.** A cheap high-recall model filters to a manageable set; an expensive high-precision model or a human reviews those. This is what mature fraud and moderation systems actually do, and it is the same architecture as retrieve-then-rerank in a RAG pipeline."
  ] },

  { tryit: { t: "The base rate you will meet at work",
    task: "You built a content moderation classifier: 95% recall, 2% false positive rate. Your platform gets 10 million posts a day and 0.05% violate policy. How many posts are flagged, how many are real violations, and how many human reviewers would you need at 500 reviews per person per day?",
    hint: "5,000 violations, 9,995,000 fine. Recall applies to the first number; the false positive rate applies to the second.",
    sol: { lang: "python", code: "posts = 10_000_000\nviolation_rate = 0.0005\n\nviolations = posts * violation_rate          # 5,000\nfine       = posts - violations             # 9,995,000\n\ncaught       = violations * 0.95            # 4,750 real ones caught\nfalse_alarms = fine * 0.02                  # 199,900 innocent posts flagged\n\nflagged   = caught + false_alarms           # 204,650 in the review queue\nprecision = caught / flagged                # 0.023\n\nprint(f'flagged/day : {flagged:,.0f}')\nprint(f'real ones    : {caught:,.0f}')\nprint(f'precision    : {precision:.3f}')\nprint(f'reviewers    : {flagged / 500:,.0f}')" },
    w: "409 full-time reviewers, to find 4,750 real violations among 204,650 flags — 97.7% of what they read is fine. The model is not bad; 95% recall at a 2% false positive rate is respectable. The system built on it is unaffordable, and no amount of further model work rescues it. Halving the false positive rate to 1% halves the queue, which is worth far more than pushing recall from 95% to 97%. That trade — where to spend the next month of effort — is precisely the judgement this arithmetic buys you." } },

  { vocab: ["Conditional Probability", "Bayes Theorem", "Precision", "Recall", "Naive Bayes"] }
 ],
 k: [
  "`P(A|B)` is not `P(B|A)`. In ML terms, recall is not precision, and confusing them ships unusable systems.",
  "A 99% accurate test for a 1-in-1,000 condition is right about 9% of the time when it fires.",
  "The base rate dominates. When positives are rare, a small false positive rate on the large group swamps everything.",
  "Never judge a rare-event classifier on accuracy; ask for the class balance first, then precision and recall.",
  "Fix rare-event systems by raising the threshold, narrowing the population, or staging cheap then expensive."
 ],
 r: ["Conditional Probability", "Bayes Theorem", "Precision", "Recall", "Naive Bayes", "Confusion Matrix"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "precision = tp / (tp + fp)", w: "of everything flagged, how much was real" },
   { c: "recall = tp / (tp + fn)", w: "of everything real, how much was caught" },
   { c: "false_positives = negatives * fp_rate", w: "the number everyone forgets to compute" }
  ]
 }
}

]);
