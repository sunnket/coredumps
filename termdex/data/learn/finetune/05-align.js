/* Fine-Tuning & Model Adaptation — preference tuning. */
TD.addLessons("finetune", [

{
 t: "Preference Tuning: DPO and Friends",
 m: "align",
 lvl: "intermediate",
 s: "Why RLHF became DPO, building a preference dataset, and what alignment tuning genuinely fixes.",
 goal: [
  "Explain the three-stage pipeline and why preference tuning follows supervised tuning",
  "Build a preference dataset from production signals rather than from scratch",
  "Choose between DPO, ORPO and KTO for a specific situation"
 ],
 b: [
  { p: "Supervised fine-tuning teaches the model what a good answer looks like. Preference tuning teaches it which of two acceptable answers people actually prefer — which is a different and, for anything user-facing, more valuable thing." },

  { ana: "Supervised tuning is showing somebody a hundred well-written reports and saying *write like these*. Preference tuning is putting two of their own drafts side by side and saying *this one, not that one* — a thousand times. The second is how you convey taste, which cannot be written down as a rule.",
    at: "The difference" },

  { h: "The three stages" },
  { code: { lang: "text", t: "How every instruction-following model is built",
    lines: [
     { c: "  1. PRE-TRAINING" },
     { c: "     trillions of tokens, next-token prediction" },
     { c: "     -> a model that continues text" },
     { c: "" },
     { c: "  2. SUPERVISED FINE-TUNING (SFT)" },
     { c: "     tens of thousands of (instruction, good answer) pairs" },
     { c: "     -> a model that follows instructions", hi: true },
     { c: "" },
     { c: "  3. PREFERENCE TUNING (RLHF / DPO / ...)" },
     { c: "     (prompt, chosen answer, rejected answer) triples" },
     { c: "     -> a model that follows them the way people prefer", hi: true },
     { c: "        -- helpful, correctly formatted, appropriately" },
     { c: "        cautious, the right length" },
     { c: "" },
     { c: "  You do stage 3 AFTER stage 2, on the SAME model, never", hi: true },
     { c: "  instead of it. Preference tuning on a model that cannot" },
     { c: "  yet follow instructions has nothing to refine." }
    ] } },

  { h: "Why RLHF became DPO" },
  { code: { lang: "text", t: "Two routes to the same objective",
    lines: [
     { c: "  RLHF (PPO)" },
     { c: "" },
     { c: "    1. train a REWARD MODEL on preference pairs" },
     { c: "    2. use PPO to maximise reward, with a KL penalty" },
     { c: "       keeping the policy near the SFT model" },
     { c: "" },
     { c: "    needs FOUR models in memory at once:", hi: true },
     { c: "      policy, reference, reward model, value model" },
     { c: "    unstable, many hyperparameters, expensive" },
     { c: "" },
     { c: "  DPO" },
     { c: "" },
     { c: "    Observation: the optimal RLHF policy has a closed form" },
     { c: "    in terms of the reward. Invert it, substitute, and the" },
     { c: "    reward model cancels out entirely.", hi: true },
     { c: "" },
     { c: "    What remains is a classification loss on preference" },
     { c: "    pairs. TWO models: policy and frozen reference." },
     { c: "    Stable, few hyperparameters, roughly SFT-priced." }
    ] } },

  { p: "The DPO objective, for completeness:" },

  { code: { lang: "text", t: "What the loss is doing",
    lines: [
     { c: "  L = -log sigma( beta * [ log pi(y_win|x)/pi_ref(y_win|x)" },
     { c: "                         - log pi(y_lose|x)/pi_ref(y_lose|x) ] )" },
     { c: "" },
     { c: "  In words: raise the probability of the preferred answer" },
     { c: "  RELATIVE TO the reference model, and lower the probability" },
     { c: "  of the rejected one, relative to the same reference.", hi: true },
     { c: "" },
     { c: "  beta controls how far you may drift from the reference." },
     { c: "    beta = 0.1   the usual default" },
     { c: "    lower        more aggressive, more drift, more risk", hi: true },
     { c: "    higher       more conservative, smaller effect" },
     { c: "" },
     { c: "  The reference model is what stops the policy collapsing" },
     { c: "  into something that scores well and is unusable." }
    ] } },

  { h: "The family, and when to use which" },
  { tbl: { t: "Preference methods, honestly compared",
    h: ["Method", "Needs", "Models in memory", "Use when"],
    rows: [
     ["**PPO (RLHF)**", "Reward model + RL", "4", "You are a lab with a reward-modelling team"],
     ["**DPO**", "Chosen/rejected pairs", "2", "**The default.** Stable, well understood"],
     ["**ORPO**", "Chosen/rejected pairs", "**1**", "**You want SFT and preference in one stage.** No reference model, no separate SFT run"],
     ["**KTO**", "**Just thumbs up/down**", "2", "**You have production feedback, not pairs.** Often the only realistic option"],
     ["**SimPO**", "Pairs, length-normalised", "1", "DPO's length bias is hurting you"],
     ["**GRPO**", "A verifiable reward", "2", "Reasoning tasks where correctness is checkable"]
    ] } },

  { n: "**KTO deserves more attention than it gets.** DPO needs pairs — two responses to the same prompt with a judgement between them — and real products do not produce those. They produce thumbs up and thumbs down on individual answers. KTO trains directly on that unpaired signal, which means your existing feedback button is already a preference dataset. For most applied engineers this is the practical route.",
    nt: "The one that fits real products" },

  { h: "Building the dataset" },
  { code: { lang: "python", file: "prefs.py", t: "Where preference pairs come from",
    lines: [
     { c: "# 1. PRODUCTION SIGNALS -- the best source, and free.", w: "" },
     { c: "for turn in logs:", w: "" },
     { c: "    if turn.regenerated:", w: "" },
     { c: "        pairs.append({'prompt': turn.prompt,", w: "" },
     { c: "                      'chosen':  turn.second_answer,", w: "**A regenerate is an implicit rejection.** The user asked for something else, so the second answer is preferred by revealed preference.", hi: true },
     { c: "                      'rejected': turn.first_answer})", w: "" },
     { c: "    if turn.edited_before_sending:", w: "" },
     { c: "        pairs.append({'prompt': turn.prompt,", w: "" },
     { c: "                      'chosen': turn.edited, 'rejected': turn.original})", w: "**An edit is the strongest signal there is** — a human wrote what they actually wanted." },
     { c: "", w: "" },
     { c: "# 2. SAMPLE AND JUDGE -- when you have no production yet.", w: "" },
     { c: "for prompt in prompts:", w: "" },
     { c: "    a, b = model(prompt, temperature=0.9), model(prompt, temperature=0.9)", w: "**Two samples from your own SFT model.** On-policy pairs work better than pairs from some other model, because you are correcting the errors this model actually makes.", hi: true },
     { c: "    winner = judge(prompt, a, b)   # human, or a calibrated LLM judge", w: "" },
     { c: "    if winner is not None:", w: "**Allow ties and discard them.** Forcing a choice on two equally good answers adds noise." },
     { c: "        pairs.append({'prompt': prompt,", w: "" },
     { c: "                      'chosen': winner, 'rejected': loser})", w: "" },
     { c: "", w: "" },
     { c: "# 3. CONSTRUCTED -- for a specific failure you want to remove.", w: "" },
     { c: "pairs.append({", w: "" },
     { c: "    'prompt':   'What is our refund window?',", w: "" },
     { c: "    'chosen':   'The sources provided do not state a refund window.',", w: "" },
     { c: "    'rejected': 'Our refund window is 30 days.',", w: "**Teaching refusal.** A hundred pairs like this measurably reduces confident invention, and it is the highest-leverage constructed category.", hi: true },
     { c: "})", w: "" }
    ] } },

  { h: "Running DPO" },
  { code: { lang: "python", file: "dpo.py", t: "On top of your SFT adapter",
    lines: [
     { c: "from trl import DPOTrainer, DPOConfig", w: "" },
     { c: "", w: "" },
     { c: "cfg = DPOConfig(", w: "" },
     { c: "    output_dir='out/dpo-03',", w: "" },
     { c: "    beta=0.1,", w: "**The KL constraint.** Start here. Lower it only if the effect is too weak, and watch for degeneration when you do.", hi: true },
     { c: "    learning_rate=5e-6,", w: "**Far lower than SFT.** DPO is a refinement; 2e-4 here will wreck the model. This is the single most common DPO mistake.", hi: true },
     { c: "    num_train_epochs=1,", w: "**One epoch, usually.** DPO overfits preference data very fast." },
     { c: "    per_device_train_batch_size=2,", w: "" },
     { c: "    gradient_accumulation_steps=8,", w: "" },
     { c: "    max_length=1024, max_prompt_length=512,", w: "" },
     { c: "    loss_type='sigmoid',", w: "**Standard DPO.** `ipo` and `hinge` are alternatives worth trying if you see degeneration." },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "trainer = DPOTrainer(", w: "" },
     { c: "    model=sft_model,", w: "**Your SFT-tuned model, not the base.**" },
     { c: "    ref_model=None,", w: "**With PEFT you can leave this None** — TRL uses the adapter-disabled model as the reference, halving memory. A neat trick worth knowing." },
     { c: "    args=cfg, train_dataset=pairs, processing_class=tok,", w: "" },
     { c: ")", w: "" },
     { c: "trainer.train()", w: "" }
    ] } },

  { h: "Reading DPO metrics" },
  { code: { lang: "text", t: "Three numbers, and what each tells you",
    lines: [
     { c: "  rewards/accuracies      how often chosen scores above rejected" },
     { c: "    should climb to 0.65-0.85." },
     { c: "    reaching 0.95+ quickly = overfitting to the pairs", hi: true },
     { c: "" },
     { c: "  rewards/margins         the gap between chosen and rejected" },
     { c: "    should grow steadily. A collapse to zero means the model" },
     { c: "    stopped distinguishing them." },
     { c: "" },
     { c: "  logps/chosen            log-prob of the preferred answers" },
     { c: "    WATCH THIS. In DPO both logps usually FALL -- the loss", hi: true },
     { c: "    only cares about the DIFFERENCE, so it can satisfy itself" },
     { c: "    by making the rejected answer much less likely while also" },
     { c: "    making the chosen one less likely." },
     { c: "" },
     { c: "    If logps/chosen falls a long way, the model is becoming" },
     { c: "    less likely to produce ANY of the good answers, which" },
     { c: "    shows up as terse, evasive, degenerate output.", hi: true },
     { c: "    -> raise beta, lower the learning rate, or use ORPO." }
    ] } },

  { trap: "The characteristic DPO failure is **length exploitation**. Human raters and LLM judges both mildly prefer longer answers, so DPO learns to write longer ones — and after a few hundred steps every answer is padded with restatement and hedging. Track mean output length as a first-class metric during DPO. If it is climbing, you are training verbosity rather than quality, and SimPO or length-normalised pairs are the fix." },

  { h: "What preference tuning genuinely fixes" },
  { l: [
   "**Tone, register and length.** The things people notice immediately and cannot specify precisely.",
   "**Refusal behaviour** — when to decline, and how to decline usefully rather than curtly.",
   "**Choosing between two correct answers** — the one that is more directly useful.",
   "**Formatting preferences** that survive across long conversations."
  ] },
  { l: [
   "**It does not fix factual errors.** If both answers are wrong, preferring one teaches nothing about correctness.",
   "**It does not add knowledge.** Same reason as everywhere else in this track.",
   "**It does not fix a bad SFT stage.** Preference tuning refines; it cannot build.",
   "**It does not fix a capability the model lacks.** You cannot prefer your way to reasoning that is not there."
  ] },

  { tryit: { t: "Fix one specific behaviour, and measure only that",
    task: "Identify one concrete behaviour of your SFT model that you dislike — too verbose, too willing to guess, wrong register. Build 300–500 preference pairs targeting only that. Run DPO. Then evaluate three things: did the target behaviour change, did task accuracy hold, and did mean output length move?",
    hint: "Targeting one behaviour is what makes the result readable. A general \"make it better\" preference set produces a change you cannot attribute or defend.",
    sol: { lang: "text", code: "# TARGET: the model answers even when the sources do not\n#         support an answer. It should decline instead.\n\nDATASET  412 pairs\n  180  unanswerable questions\n         chosen   = an honest decline naming what is missing\n         rejected = the model's own confident invention\n  140  answerable questions (CONTROL)\n         chosen   = the correct grounded answer\n         rejected = an unnecessary decline\n   92  partially answerable\n         chosen   = answer the supported part, flag the rest\n\n# The 140 control pairs are the important design decision.\n# Without them DPO learns 'declining is good' in general and\n# the model starts refusing answerable questions -- which is\n# a worse product than the problem you started with.\n\nRESULTS\n                        SFT     +DPO\n  correct refusal      0.31 -> 0.86     the target. Fixed.\n  over-refusal         0.04 -> 0.09     small, acceptable\n  task F1 (answerable) 0.891-> 0.884    held\n  mean output tokens    210 ->  198     did not inflate\n  MMLU                 0.672-> 0.670    unchanged\n\n  rewards/accuracies   0.79 at end      healthy\n  logps/chosen         -18.2 -> -21.4   fell, but not far\n\n# WHAT I WOULD WATCH NEXT\n#   over-refusal went from 4% to 9%. That is the cost, and it\n#   is worth it here because a confident wrong answer about a\n#   refund policy is more expensive than an unnecessary 'I\n#   cannot tell from these sources'. On a different product\n#   that trade could go the other way, and I would want more\n#   control pairs.\n\n# WHAT WOULD HAVE GONE WRONG WITHOUT THE CONTROLS\n#   A pilot run with only the 180 refusal pairs took\n#   over-refusal to 34%. The model had learned that declining\n#   is simply the preferred move." },
    w: "The control pairs are the whole lesson. Every preference dataset teaches a general rule as well as the specific one you intended, and the way you constrain it is by including examples where the opposite behaviour is correct. Being able to describe that design decision — and the pilot run that proved it necessary — is exactly what a senior interviewer wants to hear." } },

  { vocab: ["RLHF", "DPO", "Instruction Tuning", "Fine-Tuning", "Guardrails", "Hallucination"] }
 ],
 k: [
  "Preference tuning follows supervised tuning on the same model; it refines and cannot build.",
  "DPO removes the reward model by inverting the closed-form optimal policy — two models instead of four.",
  "Use a learning rate around 5e-6 and one epoch; DPO overfits preference data fast.",
  "Watch logps/chosen and mean output length — falling log-probs mean degeneration, rising length means you are training verbosity.",
  "Always include control pairs where the opposite behaviour is correct, or DPO learns the general rule instead of the specific one."
 ],
 r: ["RLHF", "DPO", "Instruction Tuning", "Fine-Tuning", "Learning Rate", "Overfitting"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "DPOConfig(beta=0.1, learning_rate=5e-6, num_train_epochs=1)", w: "the DPO settings that do not wreck an SFT model" },
   { c: "DPOTrainer(model=sft_model, ref_model=None, ...)", w: "let PEFT provide the reference by disabling the adapter" },
   { c: "{'prompt': p, 'chosen': good, 'rejected': bad}", w: "the shape of one preference pair" }
  ]
 }
}

]);
