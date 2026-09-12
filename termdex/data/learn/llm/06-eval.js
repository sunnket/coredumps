/* LLM Engineering — evaluation. */
TD.addLessons("llm", [

{
 t: "Evaluation: The Skill That Gets You Hired",
 m: "eval",
 lvl: "core",
 s: "Golden sets, judges and regression gates — how you answer 'how would you know it got worse?'",
 goal: [
  "Build a golden set that is worth trusting",
  "Use an LLM judge while knowing exactly how it lies to you",
  "Gate deploys on a regression suite rather than on judgement"
 ],
 b: [
  { p: "Almost every candidate for an AI engineering role can build a RAG demo. Very few can answer *how would you detect a five percent quality regression before a customer does?* That question is the interview, and this lesson is the answer." },

  { h: "Why this is hard" },
  { p: "Ordinary software testing assumes a correct output you can compare against. Language models break that: there are many correct answers, and they are correct to different degrees. Assertion-based testing simply does not apply." },

  { tbl: { t: "Four levels of evaluation",
    h: ["Level", "What it measures", "Cost", "When"],
    rows: [
     ["**Assertions**", "Valid JSON, required fields present, no PII, under N tokens", "Free, instant", "**Always.** Run in CI on every commit"],
     ["**Reference-based**", "Exact match, F1 against a known answer, retrieval recall@k", "Cheap", "**Whenever a right answer exists** — extraction, classification, retrieval"],
     ["**LLM-as-judge**", "Helpfulness, groundedness, tone, correctness against a rubric", "Moderate", "Open-ended generation, where no exact answer exists"],
     ["**Human review**", "Everything, properly", "Expensive, slow", "Calibrating the judge; the final check before a major release"]
    ] } },

  { n: "Use the cheapest level that answers your question. A great deal of what teams route to an expensive LLM judge is actually a reference-based question in disguise — *did it extract the right invoice total* has one right answer, and comparing floats is free and exact.",
    nt: "The cost discipline" },

  { h: "The golden set" },
  { p: "Fifty to two hundred cases with known-good answers. This is the single most valuable artefact your project will produce, and building it is unglamorous work that nobody volunteers for." },

  { code: { lang: "python", file: "golden.jsonl", t: "One case, with everything it needs",
    lines: [
     { c: "{", w: "" },
     { c: "  \"id\": \"limits-001\",", w: "**Stable id.** You will refer to specific failures for months." },
     { c: "  \"question\": \"What is the daily ATM withdrawal limit?\",", w: "" },
     { c: "  \"expected\": \"Rs 50,000 per day for standard accounts\",", w: "" },
     { c: "  \"must_contain\": [\"50,000\"],", w: "**Cheap assertions alongside the reference answer.** Catches most regressions without a judge call.", hi: true },
     { c: "  \"must_not_contain\": [\"25,000\", \"1,00,000\"],", w: "**Old and wrong values.** Directly catches a stale-index regression." },
     { c: "  \"gold_chunk_ids\": [412, 413],", w: "**Which chunks should have been retrieved.** This is what lets you separate a retrieval failure from a generation failure." },
     { c: "  \"category\": \"factual_lookup\",", w: "**Tag every case.** Aggregate scores hide which *kind* of question broke." },
     { c: "  \"difficulty\": \"easy\"", w: "" },
     { c: "}", w: "" }
    ] } },

  { tbl: { t: "What must be in a golden set",
    h: ["Category", "Share", "Why"],
    rows: [
     ["**Common real questions**", "40%", "From actual logs if you have them. Not questions you invented"],
     ["**Edge cases**", "20%", "Ambiguous, multi-part, unusual phrasing"],
     ["**Unanswerable**", "**15%**", "**The most neglected and most important.** Does it correctly say it does not know?"],
     ["**Adversarial**", "10%", "Prompt injection, attempts to extract the system prompt, off-topic pushing"],
     ["**Previous bugs**", "15%", "**Every production failure becomes a permanent case.** This is how the set earns its keep"]
    ] } },

  { trap: "Do not build the golden set by asking the model questions and saving what it says. That certifies current behaviour as correct, which makes the whole exercise circular — you will detect *change* but never *wrongness*. Write the expected answers from the source documents, by hand, before looking at any output." },

  { h: "LLM-as-judge, and its failure modes" },
  { code: { lang: "python", t: "A judge prompt built to be reliable",
    lines: [
     { c: "JUDGE = '''", w: "" },
     { c: "Score the ANSWER against the REFERENCE on groundedness.", w: "**One dimension per call.** A judge asked for five scores at once produces five correlated, meaningless numbers.", hi: true },
     { c: "", w: "" },
     { c: "1 - Contradicts the reference, or invents facts.", w: "" },
     { c: "2 - Partly correct, with unsupported claims.", w: "" },
     { c: "3 - Correct, but omits something important.", w: "" },
     { c: "4 - Correct and complete.", w: "**Define every point on the scale.** *Rate 1-10* produces noise; a defined rubric produces something reproducible." },
     { c: "", w: "" },
     { c: "Give one sentence of reasoning, then the score.", w: "**Reasoning first.** A score produced before reasoning is not improved by reasoning added afterwards." },
     { c: "", w: "" },
     { c: "REFERENCE: {reference}", w: "" },
     { c: "ANSWER: {answer}", w: "" },
     { c: "'''", w: "" }
    ] } },

  { tbl: { t: "How judges lie, and what to do about it",
    h: ["Bias", "What happens", "Mitigation"],
    rows: [
     ["**Position bias**", "In A/B comparison, the first option wins more often regardless of quality", "**Run both orders and average.** Non-negotiable for pairwise judging"],
     ["**Length bias**", "Longer answers score higher, independent of correctness", "Include length in the rubric, or compare only similar-length answers"],
     ["**Self-preference**", "A model rates its own family's output higher", "**Use a different model as judge** than the one generating"],
     ["**Score compression**", "Nearly everything gets a 4 out of 5", "Use a 1–4 scale with defined points; forbid the middle"],
     ["**Sycophancy**", "Confident, fluent, wrong answers score well", "**Judge groundedness against sources, not plausibility**"]
    ] } },

  { code: { lang: "python", t: "Calibrating the judge — the step almost everyone skips",
    lines: [
     { c: "# 1. Label 50 outputs yourself, using the same rubric.", w: "**Two hours of work.**", hi: true },
     { c: "# 2. Run the judge on the same 50.", w: "" },
     { c: "# 3. Measure agreement.", w: "" },
     { c: "", w: "" },
     { c: "from sklearn.metrics import cohen_kappa_score", w: "" },
     { c: "k = cohen_kappa_score(human_scores, judge_scores)", w: "**Agreement corrected for chance.** Plain percentage agreement flatters a judge that always says 4." },
     { c: "", w: "" },
     { c: "# k > 0.6 : usable", w: "" },
     { c: "# k 0.4-0.6: fix the rubric before relying on it", w: "" },
     { c: "# k < 0.4 : the judge is not measuring what you think", w: "**Do not build a regression gate on this.**", hi: true }
    ],
    after: "An uncalibrated judge is a number generator. Teams build dashboards on them, watch them go up, and ship regressions — because nobody ever checked whether the judge agreed with a person. Two hours of manual labelling is the difference between a metric and a decoration." } },

  { h: "The regression gate" },
  { code: { lang: "python", file: "eval.py", t: "What runs in CI",
    lines: [
     { c: "def run_eval(system, golden):", w: "" },
     { c: "    results = []", w: "" },
     { c: "    for case in golden:", w: "" },
     { c: "        out = system.answer(case['question'])", w: "" },
     { c: "        results.append({", w: "" },
     { c: "          'id': case['id'],", w: "" },
     { c: "          'category': case['category'],", w: "" },
     { c: "          'assertions': check_assertions(out, case),", w: "**Free checks first.**" },
     { c: "          'retrieval_hit': set(case['gold_chunk_ids']) & set(out.chunk_ids) != set(),", w: "**Separates retrieval from generation** — the most useful single field here.", hi: true },
     { c: "          'judge': judge(out.text, case['expected']) if case.get('open_ended') else None,", w: "**Only pay for a judge where a reference match cannot decide it.**" },
     { c: "          'tokens': out.tokens, 'cost': out.cost, 'latency': out.latency,", w: "**Quality is not the only regression.** A change that adds 2 points and triples cost is a regression too." },
     { c: "        })", w: "" },
     { c: "    return results", w: "" },
     { c: "", w: "" },
     { c: "# in CI:", w: "" },
     { c: "new, base = run_eval(candidate, G), load('baseline.json')", w: "" },
     { c: "", w: "" },
     { c: "assert new.assertion_pass_rate >= 1.0, 'hard assertions must all pass'", w: "**No tolerance on assertions.** Invalid JSON is never acceptable.", hi: true },
     { c: "assert new.score >= base.score - 0.02, 'quality regression'", w: "**A small tolerance for noise**, sized from your test set — the statistics track tells you how." },
     { c: "assert new.p95_latency <= base.p95_latency * 1.2", w: "" },
     { c: "assert new.mean_cost <= base.mean_cost * 1.1", w: "" },
     { c: "", w: "" },
     { c: "print(regressions_by_category(new, base))", w: "**Which kinds of question got worse.** An aggregate that holds steady can hide one category collapsing." }
    ] } },

  { n: "Every prompt change, model version bump, chunking change and library upgrade goes through this gate. Providers deprecate model versions and silently update them; a system without a regression suite discovers the change through a customer complaint. With one, it is a red CI run and a five-minute conversation.",
    nt: "What the gate is actually protecting you from" },

  { h: "Online evaluation" },
  { p: "Offline evaluation tells you about the questions you thought of. Production tells you about the ones you did not." },
  { l: [
   "**Thumbs up/down.** Low response rate, heavily biased towards the annoyed — but a *change* in the ratio is a real signal.",
   "**Implicit signals.** Did they rephrase and ask again? Did they escalate to a human? Did they copy the answer? Regeneration rate is an excellent proxy for dissatisfaction and costs nothing to collect.",
   "**Sampled human review.** Twenty conversations a week, read properly by someone. Unglamorous and the highest-information thing on this list.",
   "**Automated groundedness checks on live traffic.** Sample 1% and run the judge, so you catch drift between releases.",
   "**Route unanswered questions into the golden set.** Your evaluation set should grow from production, continuously."
  ] },

  { h: "What to report" },
  { code: { lang: "text", t: "The table that ends arguments",
    lines: [
     { c: "                        baseline   candidate   delta" },
     { c: "  ----------------------------------------------------" },
     { c: "  assertion pass          100%       100%        --" },
     { c: "  retrieval recall@5      0.84       0.91      +0.07" },
     { c: "  groundedness (judge)    3.41       3.52      +0.11" },
     { c: "  answered correctly      0.79       0.86      +0.07" },
     { c: "  correctly said unknown  0.61       0.88      +0.27", hi: true },
     { c: "  ----------------------------------------------------" },
     { c: "  mean cost / request    $0.014     $0.019     +36%" },
     { c: "  p95 latency             2.1s       2.8s      +33%" },
     { c: "" },
     { c: "  worst category: multi-hop questions, 0.42 -> 0.39" }
    ],
    after: "Every number a decision-maker needs, including the costs of the improvement and the one category that got worse. Producing this table is what an AI engineer is paid for; producing only the top half is what gets a system shipped that nobody can afford." } },

  { tryit: { t: "Build the harness — the portfolio piece",
    task: "For a RAG system you have built: create a 50-case golden set including 8 unanswerable and 5 adversarial cases. Write assertion checks, retrieval recall, and a calibrated judge for the open-ended ones. Wire it to a CI script that fails on regression. Then write it up.",
    hint: "Calibrate the judge on 20 hand-labelled cases and report the kappa. That number is what makes the harness credible rather than decorative.",
    sol: { lang: "python", code: "# eval/run.py -- the shape that fits in CI\nimport json, sys\n\nGOLDEN   = [json.loads(l) for l in open('eval/golden.jsonl')]\nBASELINE = json.load(open('eval/baseline.json'))\n\nres = run_eval(system, GOLDEN)\nsummary = summarise(res)\n\nfailures = []\nif summary['assertion_pass'] < 1.0:\n    failures.append('assertions failed')\nif summary['recall@5'] < BASELINE['recall@5'] - 0.03:\n    failures.append('retrieval regression')\nif summary['correct'] < BASELINE['correct'] - 0.02:\n    failures.append('answer quality regression')\nif summary['mean_cost'] > BASELINE['mean_cost'] * 1.15:\n    failures.append('cost regression')\n\nprint(format_table(summary, BASELINE))\nif failures:\n    print('BLOCKED:', ', '.join(failures)); sys.exit(1)" },
    w: "This is the single strongest portfolio artefact a junior AI candidate can produce. Write it up with the kappa, the biases you found in your judge, and one regression it actually caught. It signals production thinking louder than any model work, it is the answer to the interview question this lesson opened with, and almost nobody applying for these roles has one." } },

  { vocab: ["Golden Dataset", "Hallucination"] }
 ],
 k: [
  "Use the cheapest level that answers the question: assertions, then reference matching, then a judge, then humans.",
  "Write golden answers from the source documents by hand — never from what the model already says.",
  "Include unanswerable and adversarial cases, and add every production bug permanently.",
  "Calibrate the judge against human labels and report the kappa; an uncalibrated judge is a number generator.",
  "Gate CI on assertions, quality, cost and latency — and report regressions by category, not just in aggregate."
 ],
 r: ["Hallucination", "Retrieval-Augmented Generation", "Benchmark"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "set(case['gold_chunk_ids']) & set(out.chunk_ids)", w: "separate retrieval failure from generation failure" },
   { c: "cohen_kappa_score(human_scores, judge_scores)", w: "does your judge agree with a person?" },
   { c: "assert new.score >= base.score - 0.02", w: "the regression gate, with tolerance for noise" },
   { c: "must_not_contain: ['25,000']", w: "a cheap assertion that catches a stale index" },
   { c: "regressions_by_category(new, base)", w: "find the one category that collapsed" }
  ]
 }
}

]);
