/* ML Maths — statistics. */
TD.addLessons("math", [

{
 t: "Is This Result Real, or Did You Get Lucky?",
 m: "stats",
 lvl: "core",
 s: "The question that separates engineers people believe from engineers people humour.",
 goal: [
  "Estimate the uncertainty on a measured metric",
  "Say whether a difference between two models is worth acting on",
  "Recognise the four ways a benchmark number lies to you"
 ],
 b: [
  { p: "You changed the chunking strategy and retrieval accuracy went from 71% to 74%. Ship it? The correct answer is *I do not know yet*, and being the person who says that — and then finds out — is worth more to your career than the three points ever were." },

  { h: "Every measurement is a sample" },
  { p: "You did not measure your model's accuracy. You measured its accuracy **on 200 particular test examples**, which are a random draw from the questions users might ask. Draw a different 200 and you get a different number, for no reason but chance." },

  { code: { lang: "python", t: "How much a number moves for no reason at all",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "rng = np.random.default_rng(0)", w: "" },
     { c: "", w: "" },
     { c: "true_accuracy = 0.72", w: "**Suppose the model's real accuracy is exactly 72%.** We are simulating, so for once we know the truth." },
     { c: "", w: "" },
     { c: "for n in [50, 200, 1000, 10000]:", w: "Test set sizes." },
     { c: "    runs = rng.binomial(n, true_accuracy, 1000) / n", w: "**A thousand independent test sets** of size n, each scoring the same model." },
     { c: "    print(f'n={n:>6}: {runs.min():.3f} to {runs.max():.3f}')", w: "The best and worst score the *same model* achieved.", hi: true }
    ],
    out: "n=    50: 0.540 to 0.880\nn=   200: 0.620 to 0.815\nn=  1000: 0.671 to 0.766\nn= 10000: 0.706 to 0.734",
    after: "On 50 examples, an unchanged model scores anywhere from 54% to 88%. If your test set is 50 questions — and a great many are — then a jump from 68% to 76% is entirely consistent with having changed nothing whatsoever." } },

  { n: "Rough rule: the uncertainty on an accuracy measured over n examples is roughly `±1/√n`. Fifty examples gives about ±14 points. Two hundred gives ±7. A thousand gives ±3. Ten thousand gives ±1. Notice the shape — to halve your uncertainty you must **quadruple** the test set, which is why serious evaluation sets are expensive and why people quietly avoid building them.",
    nt: "The rule of thumb to carry around" },

  { h: "The bootstrap: uncertainty without any mathematics" },
  { p: "You do not need a formula. Resample your own results with replacement a few thousand times and look at the spread. This is the **bootstrap**, it works for any metric including ones with no closed form, and it is about six lines." },

  { code: { lang: "python", t: "A confidence interval you can actually defend",
    lines: [
     { c: "results = np.array([1,0,1,1,1,0,1,1,0,1] * 20)", w: "200 test examples, 1 for correct. Accuracy is 0.70." },
     { c: "", w: "" },
     { c: "boots = []", w: "" },
     { c: "for _ in range(10_000):", w: "" },
     { c: "    sample = rng.choice(results, size=len(results), replace=True)", w: "**Resample with replacement** — a plausible alternative test set drawn from what you have.", hi: true },
     { c: "    boots.append(sample.mean())", w: "" },
     { c: "", w: "" },
     { c: "lo, hi = np.percentile(boots, [2.5, 97.5])", w: "**The middle 95%.** This is your confidence interval." },
     { c: "print(f'accuracy 0.70, 95% CI [{lo:.3f}, {hi:.3f}]')", w: "" }
    ],
    out: "accuracy 0.70, 95% CI [0.635, 0.760]",
    after: "Report it as *70%, 95% CI [63.5%, 76.0%]*. Now a rival model scoring 73% is visibly inside your interval, and the honest conclusion is that you cannot tell them apart on this test set. That sentence, said out loud in a review, is what makes people trust your other numbers." } },

  { h: "Comparing two models properly" },
  { p: "The mistake is comparing two intervals and calling it a day. The right test is directly on the difference — and crucially, on the **same** examples, because pairing removes an enormous amount of noise." },

  { code: { lang: "python", t: "Paired comparison, which is the one to use",
    lines: [
     { c: "a = rng.binomial(1, 0.71, 200)", w: "Model A on 200 examples." },
     { c: "b = a.copy()", w: "**Model B evaluated on the same examples** — always do this. Two different test sets is throwing away precision for nothing." },
     { c: "flip = rng.choice(200, 20, replace=False)", w: "" },
     { c: "b[flip] = 1 - b[flip]", w: "B differs from A on 20 examples." },
     { c: "", w: "" },
     { c: "diffs = []", w: "" },
     { c: "for _ in range(10_000):", w: "" },
     { c: "    idx = rng.choice(200, 200, replace=True)", w: "**Resample the example indices**, then score both models on that same resample.", hi: true },
     { c: "    diffs.append(b[idx].mean() - a[idx].mean())", w: "" },
     { c: "", w: "" },
     { c: "lo, hi = np.percentile(diffs, [2.5, 97.5])", w: "" },
     { c: "print(f'B - A = {np.mean(diffs):+.3f}, CI [{lo:+.3f}, {hi:+.3f}]')", w: "**If the interval contains zero, you have not shown a difference.**", hi: true }
    ],
    out: "B - A = +0.010, CI [-0.045, +0.065]",
    after: "One point of improvement, with an interval comfortably spanning zero. B might be better, might be worse. Shipping this as *a 1% improvement* is not a lie exactly, but it is a claim the data does not support, and someone will eventually check." } },

  { h: "The four ways a benchmark lies" },
  { tbl: { t: "What to check before believing any reported number",
    h: ["Failure", "What it looks like", "How to catch it"],
    rows: [
     ["**Test set too small**", "Big swings between runs; every change looks significant", "Compute the interval. If it is ±7 points, stop reporting 2-point wins"],
     ["**Test set contamination**", "Suspiciously excellent results", "Ask whether the test data could have been in training. For any public benchmark and any large model, assume yes"],
     ["**Multiple comparisons**", "You tried 40 configurations and the best one looks great", "**With 40 tries, something scores well by luck.** Hold out a second test set and re-check the winner on it"],
     ["**Distribution shift**", "Great offline, flat or worse online", "Your test set is not what users actually send. This is the most common one in production AI, by a distance"]
    ] } },

  { trap: "Multiple comparisons is the one that quietly destroys credibility. Sweep 40 hyperparameter configurations, pick the best, report its score — and you have reported the maximum of 40 noisy draws, which is biased upward by construction. The best configuration is genuinely likely to be good; its *score* is almost certainly optimistic. The fix is boring and non-negotiable: choose on validation, report on a test set you touched exactly once." },

  { h: "What to actually do" },
  { ol: [
   "**Report an interval, always.** *74% ± 4* rather than *74%*. It costs one line of bootstrap and changes how people read everything else you say.",
   "**Compare on paired examples.** Same test set, same order, both models.",
   "**Decide the threshold before running.** *We ship if it improves by more than 3 points* prevents you from negotiating with yourself afterwards.",
   "**Keep a locked test set** that you use for final decisions only, and never tune against.",
   "**Look at the failures by hand.** Twenty failing examples tell you more about what to fix next than any aggregate metric ever will."
  ] },

  { n: "That last point deserves emphasis, because it is where statistics stops. Aggregate metrics tell you *whether* something changed. Only reading actual failures tells you *why*, and *why* is what you need to fix it. Senior engineers in this field are recognisable by how much time they spend reading individual bad outputs.",
    nt: "The habit that separates people" },

  { tryit: { t: "Test your own instinct",
    task: "Simulate two identical models — both truly 70% accurate — evaluated on 100 examples each, independently. Run this 1,000 times and count how often the gap between them exceeds 5 percentage points.",
    hint: "`rng.binomial(100, 0.7)/100` twice per trial, then count trials where `abs(a - b) > 0.05`.",
    sol: { lang: "python", code: "import numpy as np\nrng = np.random.default_rng(7)\n\ntrials = 10_000\na = rng.binomial(100, 0.70, trials) / 100\nb = rng.binomial(100, 0.70, trials) / 100\ngap = np.abs(a - b)\n\nprint(f'gap > 5 points : {(gap > 0.05).mean():.1%}')\nprint(f'gap > 10 points: {(gap > 0.10).mean():.1%}')\nprint(f'largest gap    : {gap.max():.1%}')" },
    w: "Two identical models differ by more than 5 points about 47% of the time, and by more than 10 points around 12% of the time, on a 100-example test set. Every one of those gaps is pure noise. If your evaluation set is 100 examples — and most people's first one is — then roughly half your apparent improvements are nothing at all. This is the argument for building a larger golden set, and it is far more persuasive than *we should be more rigorous*." } },

  { vocab: ["Confidence Interval", "P-Value", "Hypothesis Testing", "Variance", "Sampling"] }
 ],
 k: [
  "Every metric is measured on a sample; a different sample gives a different number for no reason.",
  "Uncertainty on accuracy is roughly ±1/√n — 50 examples means ±14 points.",
  "The bootstrap gives you a confidence interval for any metric in six lines, with no formula.",
  "Compare models on the same examples, and if the interval on the difference contains zero, you have shown nothing.",
  "Choose on validation, report on a test set touched once, and read the failures by hand."
 ],
 r: ["Confidence Interval", "P-Value", "Hypothesis Testing", "Variance", "Sampling", "Null Hypothesis"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "rng.choice(results, size=len(results), replace=True)", w: "one bootstrap resample" },
   { c: "np.percentile(boots, [2.5, 97.5])", w: "a 95% confidence interval from a bootstrap" },
   { c: "b[idx].mean() - a[idx].mean()", w: "a paired difference on resampled indices" },
   { c: "(gap > 0.05).mean()", w: "the fraction of trials exceeding a threshold" }
  ]
 }
},

{
 t: "Variance, Correlation and the Numbers That Mislead",
 m: "stats",
 lvl: "core",
 s: "Mean, median, spread, correlation — and the specific ways each one is used to deceive.",
 goal: [
  "Choose between mean and median for a given distribution",
  "Read a correlation coefficient and state exactly what it does not tell you",
  "Spot Simpson's paradox and survivorship bias in real reporting"
 ],
 b: [
  { p: "Descriptive statistics are four functions in NumPy and about a dozen ways to be badly wrong. The functions take five minutes; the ways of being wrong are the lesson." },

  { h: "Mean or median" },
  { code: { lang: "python", t: "The salary example, because it is the clearest",
    lines: [
     { c: "salaries = np.array([6, 8, 9, 10, 11, 12, 14, 900])", w: "Seven engineers and one founder, in lakhs." },
     { c: "", w: "" },
     { c: "salaries.mean()", w: "**121.25.** True, and a completely misleading description of what people here earn.", hi: true },
     { c: "np.median(salaries)", w: "**10.5.** What a typical person actually gets. Unmoved by the outlier." },
     { c: "salaries.std()", w: "**295.** An enormous spread, which is itself the signal that the mean is not to be trusted." }
    ],
    out: "121.25\n10.5\n295.06",
    after: "Neither number is false. *Average salary at this company is ₹121 lakh* is arithmetically correct and would be a lie in every sense that matters." } },

  { tbl: { t: "Which to use",
    h: ["Use", "When", "In AI work"],
    rows: [
     ["**Mean**", "Roughly symmetric data, no extreme outliers", "Loss during training, embedding values, accuracy over a test set"],
     ["**Median**", "Skewed or long-tailed data", "**Latency, cost per request, document length, tokens per query** — all long-tailed"],
     ["**Percentiles**", "You care about the bad cases", "p95 and p99 latency. This is the industry standard for a reason"],
     ["**Both, plus the spread**", "Any time you are reporting to someone", "Median tells them the typical case, p99 tells them the worst, and the gap tells them how bad the tail is"]
    ] } },

  { n: "In AI systems, always report cost and latency at p50 **and** p95. The mean hides a specific and expensive failure: a small number of requests with enormous contexts that cost fifty times the typical one. Those are invisible in an average and they are the entire reason your bill is what it is.",
    nt: "Directly applicable" },

  { h: "Variance and standard deviation" },
  { p: "**Variance** is the average squared distance from the mean; **standard deviation** is its square root, which puts it back in the original units and makes it readable. High spread means a single number describes your data poorly." },

  { code: { lang: "python", t: "Where standard deviation appears in your work",
    lines: [
     { c: "x = (x - x.mean()) / x.std()", w: "**Standardisation.** Zero mean, unit spread. Required by any distance-based model, or the feature measured in lakhs drowns out the one measured 0 to 1.", hi: true },
     { c: "", w: "" },
     { c: "outliers = np.abs(x - x.mean()) > 3 * x.std()", w: "The classic 3-sigma outlier rule — **only valid on roughly normal data.** On long-tailed data it flags a great deal of perfectly ordinary stuff." },
     { c: "", w: "" },
     { c: "np.std(scores_across_seeds)", w: "**Run your experiment with five different random seeds.** If the spread across seeds exceeds the improvement you are claiming, you have not shown anything." }
    ],
    after: "That last line is the most underused technique in applied machine learning. Seed variance is real, it is frequently larger than the improvements people report, and checking it takes one afternoon." } },

  { h: "Correlation, and the three things it does not mean" },
  { p: "**Correlation** measures how much two variables move together, from -1 to +1. It is genuinely useful and routinely over-read." },

  { code: { lang: "python",
    lines: [
     { c: "np.corrcoef(x, y)[0, 1]", w: "One number. +1 perfectly together, 0 no linear relationship, -1 perfectly opposed." }
    ] } },

  { l: [
   "**It only sees straight lines.** A perfect U-shaped relationship gives a correlation of about zero. The variables are utterly dependent and the number reports nothing. Always plot before trusting.",
   "**It is not causation**, which everyone recites and few act on. Ice cream sales correlate with drownings; the cause is summer. In feature work this matters directly — a feature correlated with your target may be caused by it, which is **leakage**.",
   "**It is fragile to outliers.** One extreme point can drag a correlation from 0.1 to 0.9. Compute it, then remove the top 1% and compute it again."
  ] },

  { trap: "The most expensive correlation mistake in machine learning is leakage disguised as a great feature. You are predicting whether a customer will churn, and `support_tickets_last_week` is spectacularly predictive — because customers open tickets *while* cancelling. The correlation is real, the model is excellent offline, and it is worthless in production because at prediction time that column is empty. **Ask of every strong feature: would I actually have this value at the moment I need to predict?**" },

  { h: "Simpson's paradox" },
  { p: "A trend that holds in every subgroup can reverse when the groups are combined. This is not a curiosity; it happens in real A/B tests and it will eventually happen to you." },

  { code: { lang: "python", t: "Model B wins in both groups and loses overall",
    lines: [
     { c: "# easy questions", w: "" },
     { c: "# A: 90/100 = 90%    B: 190/200 = 95%", w: "**B wins.**" },
     { c: "", w: "" },
     { c: "# hard questions", w: "" },
     { c: "# A: 100/200 = 50%   B: 55/100 = 55%", w: "**B wins again.**" },
     { c: "", w: "" },
     { c: "(90 + 100) / 300", w: "A overall: **0.633**" },
     { c: "(190 + 55) / 300", w: "B overall: **0.817**", hi: true },
     { c: "", w: "" },
     { c: "# reverse the mix and it flips:", w: "" },
     { c: "# if A had faced mostly easy and B mostly hard,", w: "" },
     { c: "# A would win overall while losing both subgroups.", w: "**The aggregate is decided by the mix, not by the models.**", hi: true }
    ],
    after: "The lesson is not that aggregates lie — it is that an aggregate over an uncontrolled mix is meaningless. If your evaluation set changed composition between two runs, the comparison is void, regardless of what the headline number says." } },

  { h: "Survivorship bias" },
  { p: "Your data describes the things that made it into your data, which is not the same as the things that exist. This is the bias most likely to be invisible, because the missing rows leave no trace." },
  { l: [
   "Your RAG evaluation set was built from questions users asked. The questions they gave up on asking, because the system was bad at them, are absent — so you optimise for what already works.",
   "Your churn model trains on customers you retained long enough to observe. The ones who left in week one are frequently excluded by the join, and they are the ones you cared about.",
   "Your logs contain requests that completed. Timeouts often do not log, which means your latency dashboard is measuring only the successes."
  ] },

  { tryit: { t: "Find the lie",
    task: "A colleague reports: *our new model improved average user satisfaction from 4.1 to 4.4 out of 5*. Write down four questions you would ask before believing it.",
    hint: "Think about: who answered, how many, what the spread is, and whether the population is the same in both measurements.",
    sol: { lang: "python", code: "# 1. How many responses, and what is the confidence interval?\n#    n=30 gives roughly +/- 0.4 -- the whole improvement.\n#\n# 2. Who answered? Satisfaction surveys are answered by the delighted\n#    and the furious. If the new model quietly lost the furious ones\n#    (they left), the average rises with no improvement at all.\n#    -- survivorship bias\n#\n# 3. Is it the same population? If the new model shipped to a\n#    different segment, or during a different period, the mix changed.\n#    -- Simpson's paradox\n#\n# 4. Mean or median, and what does the distribution look like?\n#    4.1 could be everyone-rates-4, or half 5s and half 3s.\n#    Those are entirely different products.\n#\n# 5. (bonus) How many other metrics were checked before this one\n#    was chosen to report?  -- multiple comparisons" },
    w: "None of these questions are hostile, and asking them politely is one of the fastest ways to be taken seriously in a technical organisation. The person who consistently asks *how many samples, and who is missing from them?* becomes the person whose own numbers are believed without being asked." } },

  { vocab: ["Variance", "Covariance", "Confidence Interval", "Sampling", "Data Leakage"] }
 ],
 k: [
  "Mean for symmetric data, median for skewed; report latency and cost at p50 and p95, never as a mean.",
  "Standardisation is `(x - mean) / std`, and it is required by every distance-based model.",
  "Correlation sees only straight lines, is not causation, and is fragile to outliers.",
  "A feature that correlates suspiciously well is usually leakage — ask whether you would have it at prediction time.",
  "Simpson's paradox and survivorship bias both work by changing who is in the data, invisibly."
 ],
 r: ["Variance", "Covariance", "Confidence Interval", "Sampling", "Data Leakage", "Normalisation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "np.median(x)", w: "the typical value, unmoved by outliers" },
   { c: "np.percentile(latency, [50, 95, 99])", w: "how to report latency honestly" },
   { c: "(x - x.mean()) / x.std()", w: "standardise a feature to zero mean, unit spread" },
   { c: "np.corrcoef(x, y)[0, 1]", w: "linear correlation between two variables" },
   { c: "np.std(scores_across_seeds)", w: "seed variance — check it before claiming an improvement" }
  ]
 }
}

]);
