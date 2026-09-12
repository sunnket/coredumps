/* Fine-Tuning & Model Adaptation — did it actually work? */
TD.addLessons("finetune", [

{
 t: "Did It Actually Work?",
 m: "eval",
 lvl: "core",
 s: "Held-out evaluation, catastrophic forgetting, contamination, and reporting a negative result honestly.",
 goal: [
  "Design an evaluation that could show your fine-tune failed",
  "Detect catastrophic forgetting before your users do",
  "Report the result — including a negative one — in a way that survives scrutiny"
 ],
 b: [
  { p: "This is the module that separates a fine-tune worth putting on a resume from one that is merely finished. Almost everyone can produce a model. Very few can answer *how do you know it is better*, and that question is the interview." },

  { h: "The four comparisons" },
  { code: { lang: "text", t: "Every one of these is necessary",
    lines: [
     { c: "  1. AGAINST THE BASE MODEL, prompted well" },
     { c: "     the honest floor. If your fine-tune does not beat the" },
     { c: "     base model with a good prompt and five examples in" },
     { c: "     context, you have spent three weeks for nothing.", hi: true },
     { c: "" },
     { c: "  2. AGAINST A LARGER MODEL, prompted" },
     { c: "     the economic comparison. A tuned 8B beating a prompted" },
     { c: "     frontier model at a twentieth of the cost IS the result." },
     { c: "     Beating it outright is a bonus.", hi: true },
     { c: "" },
     { c: "  3. AGAINST ITSELF ON GENERAL CAPABILITY" },
     { c: "     did you break anything else? Almost always yes, a" },
     { c: "     little. The question is how much.", hi: true },
     { c: "" },
     { c: "  4. AGAINST PRODUCTION, EVENTUALLY" },
     { c: "     offline numbers are a filter, not a verdict." }
    ] } },

  { n: "Comparison 1 is the one people skip, and it is the one that most often kills the project. A prompted base model with a handful of in-context examples is a genuinely strong baseline, and \"the fine-tune beat zero-shot\" is not evidence of anything — zero-shot was never the alternative.",
    nt: "The comparison that matters most" },

  { h: "The evaluation set" },
  { l: [
   "**200–500 examples**, held out from the beginning and never used for any decision during development. Not the validation set — a separate, untouched one.",
   "**Stratified across what varies in production**: task type, input length, language, difficulty, and the categories your training data under-represented.",
   "**Include the unanswerable and the adversarial.** If every evaluation question has a good answer, you cannot measure over-confidence, and over-confidence is what a fine-tune most often adds.",
   "**Machine-checkable where possible.** Exact match, schema validity, arithmetic consistency, execution. Every metric you can compute without a judge is a metric you can trust.",
   "**A calibrated judge where not.** With human agreement reported alongside the score, as covered in the LLM track's evaluation module."
  ] },

  { h: "Catastrophic forgetting" },
  { code: { lang: "text", t: "What it looks like, and how to see it",
    lines: [
     { c: "  A model tuned hard on invoice extraction:" },
     { c: "" },
     { c: "    invoice extraction F1     0.61 -> 0.93    the goal" },
     { c: "    MMLU                      0.68 -> 0.61    -7 points", hi: true },
     { c: "    general chat quality      good -> terse and odd" },
     { c: "    other languages           fine -> noticeably worse", hi: true },
     { c: "    following a new format    fine -> ignores it, uses the" },
     { c: "                                      trained one instead" },
     { c: "" },
     { c: "  That last one is the sharpest symptom. A heavily tuned" },
     { c: "  model stops being steerable -- it does the trained task" },
     { c: "  regardless of what you ask for.", hi: true },
     { c: "" },
     { c: "  Mitigations, in order of usefulness:" },
     { c: "    - fewer epochs (usually the whole problem)" },
     { c: "    - lower rank" },
     { c: "    - mix 5-15% general instruction data into training", hi: true },
     { c: "    - lower learning rate" },
     { c: "    - LoRA rather than full fine-tuning (already helps a lot)" }
    ] } },

  { code: { lang: "python", file: "guard.py", t: "The general-capability guard",
    lines: [
     { c: "# Run this at every checkpoint, not once at the end.", w: "" },
     { c: "GUARD = {", w: "" },
     { c: "    'mmlu_sample':    load('mmlu', n=200),", w: "**A 200-question subset is enough** to detect a multi-point drop, and it runs in a minute." },
     { c: "    'gsm8k_sample':   load('gsm8k', n=100),", w: "**Reasoning**, which degrades early and is not covered by MMLU." },
     { c: "    'instruction':    load('ifeval', n=100),", w: "**Instruction following.** This is the one that catches 'the model stopped being steerable'.", hi: true },
     { c: "    'your_languages': load('local_eval', n=100),", w: "**If production is multilingual, an English-only guard is blind** to the failure that will actually hurt you." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "for name, subset in GUARD.items():", w: "" },
     { c: "    before, after = score(base, subset), score(tuned, subset)", w: "" },
     { c: "    delta = after - before", w: "" },
     { c: "    flag = 'REGRESSION' if delta < -0.02 else 'ok'", w: "**Decide the threshold in advance.** Two points is a reasonable line for a narrow tune; deciding afterwards is how a regression gets rationalised.", hi: true },
     { c: "    print(f'{name:16} {before:.3f} -> {after:.3f}  ({delta:+.3f})  {flag}')", w: "" }
    ],
    out: "mmlu_sample      0.681 -> 0.672  (-0.009)  ok\ngsm8k_sample     0.544 -> 0.491  (-0.053)  REGRESSION\ninstruction      0.812 -> 0.798  (-0.014)  ok\nyour_languages   0.703 -> 0.641  (-0.062)  REGRESSION" } },

  { trap: "Aggregate benchmarks hide uneven damage. In the output above MMLU barely moved while reasoning and non-English both fell by five to six points — because the training data was English and non-reasoning. Had only MMLU been checked, this model would have shipped and then failed for a third of the user base. **Guard the capabilities your users rely on, not the ones that are easy to measure.**" },

  { h: "Contamination" },
  { l: [
   "**Your own contamination**: a training example that resembles an evaluation example. The decontamination step in the data module handles this — and it must be run, not intended.",
   "**The base model's contamination**: public benchmarks are in pre-training corpora. A base model scoring well on GSM8K may have memorised part of it, which makes it a poor reference point. Use it for *relative* comparison between your checkpoints, never as an absolute claim.",
   "**Judge contamination**: if the same model family generated your training data and judges your outputs, it will prefer them. Use a different family to judge.",
   "**Prompt leakage**: an evaluation prompt that appeared in training makes the model look better than it is. Check for exact and near-exact overlap of prompts, not just of answers."
  ] },

  { h: "The report" },
  { code: { lang: "text", t: "What a defensible result looks like",
    lines: [
     { c: "  RESULT: invoice field extraction, Llama-3.1-8B QLoRA r=16" },
     { c: "" },
     { c: "                          F1     Rs/1k   p50      n=412" },
     { c: "  base, zero-shot        0.612    22    640ms" },
     { c: "  base, 5-shot           0.734    31    810ms   <- the real baseline", hi: true },
     { c: "  frontier, 5-shot       0.907   690   1940ms   <- the ceiling" },
     { c: "  TUNED 8B, zero-shot    0.891    22    640ms   <- the result", hi: true },
     { c: "" },
     { c: "  Per field, because the aggregate hides the failure:" },
     { c: "    invoice_number   0.99    vendor_name     0.96" },
     { c: "    total            0.97    line_items      0.71   <- weakest", hi: true },
     { c: "    tax              0.94    currency        0.99" },
     { c: "" },
     { c: "  General capability:" },
     { c: "    MMLU     0.681 -> 0.672   (-0.9)" },
     { c: "    GSM8K    0.544 -> 0.491   (-5.3)   accepted: this model" },
     { c: "                                       never does arithmetic;" },
     { c: "                                       totals are checked in code" },
     { c: "" },
     { c: "  CONCLUSION" },
     { c: "    98% of frontier quality at 3% of the cost and a third of" },
     { c: "    the latency. Ship it, with line_items routed to the" },
     { c: "    frontier model until the next data collection round." },
     { c: "" },
     { c: "  WHAT WOULD CHANGE THIS" },
     { c: "    line_items is 0.71 because multi-page invoices are 4% of" },
     { c: "    training data and 15% of production. Next iteration:" },
     { c: "    collect 400 multi-page examples." }
    ],
    after: "Note what makes this defensible: the honest baseline is included, the ceiling is included, results are broken down per field, the regression is named and its acceptance is *justified*, and the weakest number has a diagnosis and a plan attached. Every one of those is a place a weak report would have rounded up." } },

  { h: "Reporting a negative result" },
  { vs: { t: "The fine-tune did not win. Two ways to say so.",
    lang: "text",
    bad: { label: "The version that reads badly", c: "\"I fine-tuned a model on the task. It\ngot 0.87 which is pretty good. There\nwere some issues with the data.\"\n\nProblems:\n  - 0.87 against what? No baseline.\n  - 'pretty good' is not a decision.\n  - 'some issues' is not a diagnosis.\n  - no conclusion, so nobody can act.",
      w: "It is not that the result was negative. It is that there is no result — just an activity." },
    good: { label: "The version that reads well", c: "\"I fine-tuned Llama-3.1-8B on 6,400\nexamples of the task. It reached 0.87\nF1 against a 5-shot baseline of 0.86\non the same base model -- so the fine-\ntune bought one point for three weeks\nof work and a model to maintain.\n\nThe diagnosis is that my training data\nwas drawn from the same distribution\nthe base model already handles well.\nThe 14% of production traffic it gets\nwrong is multi-page and multilingual,\nand almost none of that was in the\ntraining set -- I checked afterwards\nand it was 3%.\n\nRecommendation: do not ship the fine-\ntune. Spend the next two weeks\ncollecting the hard cases instead, and\nre-run. If that does not move it, the\nanswer is retrieval, not tuning.\"",
      w: "A number against a baseline, a mechanism, a recommendation, and a stated condition for changing the recommendation. This is a better interview answer than a successful fine-tune with no baseline." } } },

  { n: "Interviewers ask about fine-tuning partly to see whether you will claim a win you cannot support. A candidate who says *I fine-tuned a model and it did not beat prompting, here is why, and here is what I did instead* is more credible than one whose every project succeeded — because in this field most of them do not.",
    nt: "Why the negative result is worth having" },

  { tryit: { t: "Evaluate your own fine-tune properly, and be willing to lose",
    task: "Take the model you trained. Build the four comparisons: base zero-shot, base few-shot, a larger model few-shot, and your tuned model. Run all four on the same held-out set with the same scoring. Add a general-capability guard covering at least reasoning and, if relevant, your users' languages. Break the task metric down by the dimension that varies most. Then write the one-page report, including the recommendation.",
    hint: "Decide before you look at the results what result would make you not ship it. Writing that line first is the difference between an evaluation and a justification.",
    sol: { lang: "python", code: "# Same scoring function for every variant -- this matters more\n# than it sounds. Comparing a fine-tune scored one way against\n# a baseline scored another is the commonest way people fool\n# themselves.\n\nVARIANTS = {\n    'base_0shot':     lambda x: base(PROMPT, x),\n    'base_5shot':     lambda x: base(PROMPT + SHOTS, x),\n    'frontier_5shot': lambda x: frontier(PROMPT + SHOTS, x),\n    'tuned_0shot':    lambda x: tuned(PROMPT, x),\n}\n\nfor name, fn in VARIANTS.items():\n    preds  = [fn(e['input']) for e in HELD_OUT]\n    scores = [score_one(p, e['expected']) for p, e in zip(preds, HELD_OUT)]\n\n    print(name, f1(scores), cost_per_1k(name), p50_latency(name))\n\n    # per-slice, which is where the truth is\n    for slice_name, idx in SLICES.items():\n        print('   ', slice_name, f1([scores[i] for i in idx]))\n\n# SLICES that are usually worth having:\n#   by field / label\n#   by input length bucket\n#   by language\n#   by whether the answer exists at all\n#   by document type\n\n# And bootstrap a confidence interval, because on 400 examples\n# a two-point difference is often noise:\nimport numpy as np\ndef ci(scores, n=2000):\n    boots = [np.mean(np.random.choice(scores, len(scores), replace=True))\n             for _ in range(n)]\n    return np.percentile(boots, [2.5, 97.5])\n\n# tuned      0.891  CI [0.862, 0.918]\n# base_5shot 0.734  CI [0.699, 0.768]\n#   -> intervals do not overlap. Real difference.\n#\n# In an earlier run:\n# tuned      0.871  CI [0.840, 0.899]\n# base_5shot 0.862  CI [0.831, 0.891]\n#   -> intervals overlap almost entirely. That fine-tune did\n#      NOT beat the baseline, whatever the point estimate said." },
    w: "The bootstrap interval is the detail that makes an evaluation credible, and almost nobody includes it. On a 400-example set, differences under about three points are usually indistinguishable from noise — so a project reporting a two-point win without an interval has reported nothing. Adding four lines of code lets you say \"the intervals do not overlap\", which is a claim rather than a number." } },

  { vocab: ["Benchmark", "Catastrophic Forgetting", "Overfitting", "Data Leakage", "Training, Validation and Test Split", "Perplexity"] }
 ],
 k: [
  "The real baseline is the base model prompted well with few-shot examples — not zero-shot.",
  "Guard general capability at every checkpoint, covering reasoning and your users' languages, not just MMLU.",
  "Break the metric down by slice; aggregate numbers hide the field or language that broke.",
  "Bootstrap a confidence interval — under about three points on 400 examples is usually noise.",
  "A well-reported negative result is a stronger interview answer than an unsupported win."
 ],
 r: ["Benchmark", "Catastrophic Forgetting", "Data Leakage", "Overfitting", "Training, Validation and Test Split", "Cross-Validation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "VARIANTS = {'base_0shot':…, 'base_5shot':…, 'frontier_5shot':…, 'tuned':…}", w: "the four comparisons every fine-tune report needs" },
   { c: "flag = 'REGRESSION' if delta < -0.02 else 'ok'", w: "decide the regression threshold before you see the result" },
   { c: "np.percentile([np.mean(np.random.choice(s, len(s), True)) for _ in range(2000)], [2.5, 97.5])", w: "bootstrap a confidence interval so a two-point win is not mistaken for a result" }
  ]
 }
}

]);
