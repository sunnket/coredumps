/* Fine-Tuning & Model Adaptation — should you fine-tune at all? */
TD.addLessons("finetune", [

{
 t: "Should You Fine-Tune At All?",
 m: "decide",
 lvl: "core",
 s: "The decision procedure, the baseline you must measure first, and the cost nobody mentions.",
 goal: [
  "Route a problem to prompting, retrieval, fine-tuning or none of them",
  "Measure the prompting baseline before committing to a training run",
  "State the full cost of owning a fine-tuned model, not just the GPU hours"
 ],
 b: [
  { p: "Most fine-tuning projects should not have happened. They were started because fine-tuning sounds like the serious option, and they ended with a model that was slightly different, no better, and now somebody's responsibility forever. This lesson exists to make sure yours is not one of them." },

  { ana: "Fine-tuning is like sending an employee on a training course. Excellent for *how we do things here* — the format, the tone, the procedure. Useless for *what happened in yesterday's meeting*, which is a thing you tell them, not a thing you train them on. Reaching for a training course when you needed to send an email is how most fine-tuning budgets are spent.",
    at: "The distinction that decides everything" },

  { h: "The sentence to memorise" },
  { n: "**Retrieval adds knowledge. Fine-tuning changes behaviour.**\n\nFine-tuning a model on your documentation to make it *know* your product produces a model that has learned the *style* of your documentation and confidently invents its contents in that style. That is worse than not knowing, because a fluent wrong answer is harder to catch than an admission of ignorance.",
    nt: "One line, most of the field" },

  { h: "The decision order" },
  { code: { lang: "text", t: "Work down. Stop at the first one that works.",
    lines: [
     { c: "  1. PROMPTING" },
     { c: "     cost: an afternoon" },
     { c: "     fixes: format, tone, task framing, reasoning steps" },
     { c: "     -> try this first, ALWAYS. Even if you are certain it", hi: true },
     { c: "        will not be enough, you need the baseline number." },
     { c: "" },
     { c: "  2. FEW-SHOT / better context" },
     { c: "     cost: a day" },
     { c: "     fixes: consistency, edge cases, output shape" },
     { c: "" },
     { c: "  3. RETRIEVAL" },
     { c: "     cost: a week or two" },
     { c: "     fixes: KNOWLEDGE. Facts the model does not have," },
     { c: "            facts that change, facts needing citation,", hi: true },
     { c: "            facts with per-user access control" },
     { c: "" },
     { c: "  4. FINE-TUNING" },
     { c: "     cost: 2-6 weeks, mostly on data, plus ongoing ownership" },
     { c: "     fixes: BEHAVIOUR prompting cannot hold reliably;" },
     { c: "            making a small model match a large one on ONE task", hi: true },
     { c: "" },
     { c: "  5. CONTINUED PRE-TRAINING" },
     { c: "     cost: months, and real money" },
     { c: "     fixes: a genuinely new vocabulary -- a low-resource" },
     { c: "            language, a specialised notation" }
    ] } },

  { h: "What each one actually fixes" },
  { tbl: { t: "Route the symptom, not the vibe",
    h: ["Symptom", "Route to", "Why"],
    rows: [
     ["\"It does not know our product\"", "**Retrieval**", "That is knowledge, and it changes with every release"],
     ["\"It hallucinates policy details\"", "**Retrieval + citations**", "Grounding turns recall into reading"],
     ["\"It ignores our JSON schema sometimes\"", "**Structured output first**, then fine-tuning", "Constrained decoding is exact; tuning is a probability shift"],
     ["\"It is too chatty and off-brand\"", "**Prompting**, then fine-tuning if it drifts on long inputs", "Style is exactly what tuning is for — but prompting often holds"],
     ["\"It is right but costs too much\"", "**Fine-tune a small model**", "**The strongest case there is.** A 7B matching a frontier model on one task"],
     ["\"It is bad at our language / dialect\"", "**Fine-tuning**, possibly continued pre-training", "Genuinely a capability gap"],
     ["\"Retrieval returns the wrong chunks\"", "**Fine-tune the retriever**, not the generator", "The overlooked answer, and often the highest return"],
     ["\"It cannot do this reasoning at all\"", "**A better model**", "Tuning rarely adds a capability that is not latent"]
    ] } },

  { h: "The baseline is not optional" },
  { code: { lang: "python", file: "baseline.py", t: "Two days that decide whether the next month happens",
    lines: [
     { c: "# Before you are allowed to say 'we should fine-tune', produce this.", w: "" },
     { c: "", w: "" },
     { c: "EVAL = load_jsonl('eval/held_out_200.jsonl')", w: "**200 real examples with known-correct outputs.** If you cannot assemble these, you cannot build a training set either — and that is the finding.", hi: true },
     { c: "", w: "" },
     { c: "variants = {", w: "" },
     { c: "    'zero_shot':      PROMPT_V1,", w: "" },
     { c: "    'with_schema':    PROMPT_V1 + JSON_SCHEMA_INSTRUCTION,", w: "" },
     { c: "    'few_shot_5':     PROMPT_V1 + five_examples(),", w: "**Few-shot examples are the closest thing to fine-tuning that costs an hour.**" },
     { c: "    'few_shot_20':    PROMPT_V1 + twenty_examples(),", w: "**If 20 examples in context beat 5, more data will help — that is a signal that tuning may pay.**", hi: true },
     { c: "    'small_model':    (SMALL, PROMPT_V1 + five_examples()),", w: "**The comparison that matters most.** If the small model prompted well is already close, tuning it will close the gap cheaply." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "for name, prompt in variants.items():", w: "" },
     { c: "    score, cost, p50 = run_eval(EVAL, prompt)", w: "**Three numbers per variant**, not one. A variant that scores 2% higher and costs 6× is not better." },
     { c: "    print(f'{name:16} acc={score:.3f}  Rs/1k={cost:.1f}  p50={p50}ms')", w: "" },
     { c: "", w: "" },
     { c: "# zero_shot         acc=0.681  Rs/1k=410  p50=1840ms", w: "" },
     { c: "# with_schema       acc=0.774  Rs/1k=415  p50=1890ms", w: "**Nine points for one paragraph of prompt.** This is why you always try prompting first." },
     { c: "# few_shot_5        acc=0.842  Rs/1k=480  p50=2010ms", w: "" },
     { c: "# few_shot_20       acc=0.871  Rs/1k=690  p50=2300ms", w: "**Still improving with more examples -> a fine-tune probably helps.**", hi: true },
     { c: "# small_model       acc=0.702  Rs/1k= 22  p50= 640ms", w: "**A twentieth of the cost and 17 points behind. If tuning closes that gap, the business case is obvious.**", hi: true }
    ],
    after: "That table is the argument. It tells you fine-tuning is plausible (few-shot was still improving), which model to tune (the small one), and what success looks like (0.87 at ₹22 per thousand). Without it you are guessing, and a month of guessing is expensive." } },

  { h: "The costs people forget" },
  { l: [
   "**The dataset is 70–80% of the work.** Not the training. Collecting, cleaning, deduplicating and checking a thousand good examples is where the weeks go, and it is the part that cannot be skipped or bought cheaply.",
   "**An evaluation set you did not have before.** You cannot tell whether a fine-tune helped without one, and building it is a real cost that the fine-tune has now forced on you. (This is a benefit in disguise, but budget for it.)",
   "**General capability regresses.** Tuning hard on a narrow task degrades everything else. You need a general benchmark as a guard, and you have to actually run it.",
   "**Every base model upgrade means doing it again.** A new, better base model appears every few months. Your fine-tune is pinned to the old one until you redo the work.",
   "**Deployment gets harder.** A custom model to version, store, roll back and serve — and if you self-host it, a GPU bill and an on-call rotation you did not have before.",
   "**It cannot be un-learned per user.** Anything in the weights is available to everyone who can call the model. That alone rules fine-tuning out for per-document access control."
  ] },

  { trap: "The most expensive mistake in this field is fine-tuning to teach facts. It looks like it works — the outputs mention your products, use your terminology and sound authoritative. Then somebody checks a number and it is invented. Retrieval would have taken a week and been correct." },

  { h: "When fine-tuning is clearly right" },
  { ol: [
   "**Cost reduction with a fixed task.** You have thousands of logged examples of a frontier model doing one narrow job well. Distil it into a 7B and cut inference cost by an order of magnitude. This is the single most common commercial justification and the easiest to defend.",
   "**A format that prompting cannot hold.** Long documents, many fields, an output shape the model drifts from after a few thousand tokens.",
   "**A domain register.** Legal drafting, clinical notes, financial commentary — where *how it is written* is the requirement.",
   "**A language the base model is weak in.** Indic languages in particular: base models are far weaker in Hindi, Tamil or Bengali than in English, and the gain from tuning is correspondingly large.",
   "**Retrieval quality.** Fine-tuning an embedding model or a reranker on your own corpus — cheaper, faster and more often worthwhile than tuning a generator. Covered in the last module of this track.",
   "**A latency budget.** A tuned small model that runs in 200 ms where the frontier model takes 2 seconds."
  ] },

  { tryit: { t: "Write the decision document before you write any code",
    task: "Take a problem you actually want to solve. Write a one-page document with: the task in one sentence; the metric and its target; the prompting baseline you measured with at least four variants; the number of training examples you can realistically obtain and where from; the cost of the current approach and the projected cost after tuning; and an explicit statement of what you would conclude if the fine-tune does not beat the baseline.",
    hint: "That last item is the one that matters. Deciding in advance what counts as failure is what stops a fine-tuning project running for three months on sunk cost.",
    sol: { lang: "text", code: "# Fine-tuning decision -- support ticket categorisation\n\nTASK\n  Route incoming tickets into 14 categories, from the subject\n  line and first message.\n\nMETRIC\n  Macro-F1 on a held-out set of 400 human-labelled tickets.\n  Target: >= 0.88 (current human agreement is 0.91, so that\n  is close to the ceiling).\n\nBASELINE (measured, 2 days)\n  frontier, zero-shot        0.79   Rs 0.42/ticket   1.4s\n  frontier, 14 few-shot      0.89   Rs 0.61/ticket   1.9s\n  small model, 14 few-shot   0.74   Rs 0.02/ticket   0.3s\n  TF-IDF + logistic reg      0.86   Rs 0.00/ticket   0.008s   <-- !\n\nFINDING\n  The classical baseline is 0.86 for nothing. The frontier\n  model buys 3 points for Rs 0.61 per ticket, which at\n  4,000 tickets/day is Rs 8.9 lakh a year.\n\nDECISION\n  Do NOT fine-tune an LLM. Ship the classical model with a\n  confidence threshold; anything below 0.6 confidence goes\n  to the frontier model (about 9% of volume). Blended cost\n  Rs 0.06/ticket, F1 0.89.\n\nWHAT WOULD CHANGE THIS\n  If categories grow past ~30, or if the input becomes\n  multilingual, the classical model will degrade and a tuned\n  small LLM becomes the right answer. Revisit then.\n\nIF WE HAD FINE-TUNED ANYWAY\n  ~3 weeks of work, ~Rs 15,000 of GPU, a model to own -- to\n  land somewhere near where a two-hour scikit-learn baseline\n  already was." },
    w: "This is a real outcome and a common one: the honest baseline killed the project, and that is a success. Being the person who writes this document — rather than the person who spends three weeks and produces a slightly different model — is exactly the judgement that gets someone promoted. It is also a superb interview story, because almost nobody has one where the answer was no." } },

  { vocab: ["Fine-Tuning", "Transfer Learning", "Retrieval-Augmented Generation", "Prompt Engineering", "Few-Shot Prompting", "Instruction Tuning"] }
 ],
 k: [
  "Retrieval adds knowledge; fine-tuning changes behaviour. Most misuse comes from confusing the two.",
  "Measure a prompting baseline with at least four variants before committing — including a small model prompted well.",
  "If few-shot is still improving as you add examples, a fine-tune will probably help; if it plateaued at three, it will not.",
  "The dataset is 70–80% of the work, and every base model upgrade means doing it again.",
  "Fine-tuning cannot give per-user access control, because weights cannot be un-learned for one person."
 ],
 r: ["Fine-Tuning", "Transfer Learning", "Retrieval-Augmented Generation", "Prompt Engineering", "Few-Shot Prompting", "Instruction Tuning"],
 drill: {
  lang: "text",
  reps: 3,
  items: [
   { c: "Retrieval adds knowledge. Fine-tuning changes behaviour.", w: "the sentence that resolves most fine-tuning questions" },
   { c: "baseline: zero-shot, schema, few-shot 5, few-shot 20, small model", w: "the five variants to measure before proposing a fine-tune" },
   { c: "acc, cost per 1k, p50 latency", w: "the three numbers to report per variant, never just accuracy" }
  ]
 }
}

]);
