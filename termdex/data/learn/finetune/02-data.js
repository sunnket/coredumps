/* Fine-Tuning & Model Adaptation — the dataset is the model. */
TD.addLessons("finetune", [

{
 t: "The Dataset Is the Model",
 m: "data",
 lvl: "core",
 s: "Where examples come from, how many you need, and the cleaning that decides the result.",
 goal: [
  "Source or generate a training set from what you already have",
  "Clean, deduplicate and decontaminate it before training on it",
  "Split it so that your evaluation number is not a lie"
 ],
 b: [
  { p: "Everything else in this track is mechanical. The training script is thirty lines and the hyperparameters have sensible defaults. **The dataset is the entire craft**, it is where four of the six weeks go, and it is the only part where more effort reliably produces a better model." },

  { h: "How many examples" },
  { tbl: { t: "Realistic thresholds, for LoRA on a 7–8B model",
    h: ["Count", "What you can expect"],
    rows: [
     ["**Under 100**", "Overfitting, and worse than few-shot prompting. Do not bother"],
     ["**300–1,000**", "Format and tone reliably learned. This is the sweet spot for a style or schema task"],
     ["**1,000–10,000**", "A genuine task capability. Most successful production fine-tunes live here"],
     ["**10,000–100,000**", "Domain adaptation, multi-task. Diminishing returns begin"],
     ["**Over 100,000**", "You are approaching continued pre-training territory, and full fine-tuning may beat LoRA"]
    ] } },

  { n: "**A thousand carefully checked examples beat ten thousand scraped ones**, consistently and by a wide margin. This is the most reliable empirical finding in applied fine-tuning, and it is the opposite of the instinct people bring from classical machine learning. Every hour spent removing bad examples is worth several hours spent adding more.",
    nt: "The finding that governs the whole module" },

  { h: "Where examples come from" },
  { ol: [
   "**Production logs, filtered by outcome.** The best source there is. Requests where the user accepted the answer, copied it, closed the ticket, or did not retry. You have been collecting training data without knowing it — this is why logging outcomes from day one pays off later.",
   "**Existing human work.** Support tickets and their resolutions, code reviews, translated documents, historical reports. Somebody already did the task correctly, thousands of times.",
   "**Distillation from a stronger model.** Have a frontier model do the task, filter its output, and train a small model on what survives. This is how most cost-reduction fine-tunes are actually built. Check the provider's terms — some prohibit training competing models on their outputs.",
   "**Synthetic generation with a verifier.** Generate examples, then *verify* them — run the code, check the schema, confirm the arithmetic, have a second model check entailment. Unverified synthetic data teaches the model your generator's mistakes.",
   "**Hand-written.** Slow and irreplaceable for the hard cases. Fifty hand-written examples covering the failure modes you care about are worth more than five thousand easy ones."
  ] },

  { h: "The cleaning that decides the result" },
  { code: { lang: "python", file: "clean.py", t: "The pipeline, in the order that matters",
    lines: [
     { c: "import hashlib, re", w: "" },
     { c: "from datasketch import MinHash, MinHashLSH", w: "" },
     { c: "", w: "" },
     { c: "def clean(examples):", w: "" },
     { c: "    out, seen_exact = [], set()", w: "" },
     { c: "", w: "" },
     { c: "    for ex in examples:", w: "" },
     { c: "        # 1. Structural validity", w: "" },
     { c: "        if not ex['output'].strip():", w: "**Empty outputs teach the model to produce nothing.** More common than you would think in scraped logs." },
     { c: "            continue", w: "" },
     { c: "        if ex['task'] == 'json' and not valid_json(ex['output']):", w: "**If you are training a JSON task, every output must be valid JSON.** One malformed example in a thousand teaches the model that malformed is sometimes acceptable.", hi: true },
     { c: "            continue", w: "" },
     { c: "", w: "" },
     { c: "        # 2. Length sanity", w: "" },
     { c: "        n = count_tokens(ex['input']) + count_tokens(ex['output'])", w: "" },
     { c: "        if n > MAX_SEQ_LEN:", w: "**Anything over your sequence length is silently truncated during training** — so the model learns to produce outputs that stop mid-sentence. Drop these, do not truncate them.", hi: true },
     { c: "            continue", w: "" },
     { c: "", w: "" },
     { c: "        # 3. Exact deduplication", w: "" },
     { c: "        h = hashlib.sha256((ex['input'] + ex['output']).encode()).hexdigest()", w: "" },
     { c: "        if h in seen_exact:", w: "**Duplicates are effectively a higher learning rate on that one example.** Logs are full of them." },
     { c: "            continue", w: "" },
     { c: "        seen_exact.add(h)", w: "" },
     { c: "        out.append(ex)", w: "" },
     { c: "", w: "" },
     { c: "    # 4. Near-duplicate removal (MinHash LSH, Jaccard >= 0.85)", w: "" },
     { c: "    out = dedupe_near(out, threshold=0.85)", w: "**The one people skip.** Ten support tickets that differ only in a customer name are one example repeated ten times, and they will dominate the gradient.", hi: true },
     { c: "", w: "" },
     { c: "    # 5. PII scrub", w: "" },
     { c: "    out = [redact(ex) for ex in out]", w: "**Anything in the training data is in the weights**, recoverable by a determined prompt. Scrub before training, not after." },
     { c: "", w: "" },
     { c: "    # 6. Decontamination against the eval set", w: "" },
     { c: "    out = remove_overlapping(out, EVAL_SET, threshold=0.8)", w: "**The step that keeps your number honest.** If a training example resembles an evaluation example, your score measures memorisation.", hi: true },
     { c: "", w: "" },
     { c: "    return out", w: "" }
    ],
    out: "loaded    14,208\nvalid     12,940   (-1,268 empty / malformed / too long)\nexact     10,112   (-2,828 duplicates)\nnear       6,431   (-3,681 near-duplicates)   <- the big one\nclean      6,431\ndecontam   6,388   (-43 overlapping the eval set)" } },

  { trap: "Near-duplicate removal routinely cuts a log-derived dataset by a third or more, and people are tempted to skip it because the dataset gets smaller and smaller feels worse. It is not. A dataset where one phrasing appears 400 times trains a model that produces that phrasing regardless of input — and this failure is invisible in aggregate loss and obvious to the first user." },

  { h: "Diversity is a property you have to check" },
  { l: [
   "**Cover the input distribution**, not the convenient part of it. If 30% of production traffic is in Hindi and 2% of your training data is, the fine-tune will make Hindi worse.",
   "**Include the hard cases deliberately.** Logs are dominated by easy requests; the model already handles those. Over-sample the failures.",
   "**Include refusals and edge cases.** If your data contains only successful answers, the model learns that an answer always exists — and it will invent one when it should decline.",
   "**Check the output distribution.** If 80% of your training outputs are the same category, the model will predict that category. Stratify or reweight.",
   "**Plot the length distribution.** A dataset of short outputs produces a model that cannot write long ones, and vice versa. This surprises people."
  ] },

  { h: "The split" },
  { code: { lang: "text", t: "How to split, and how people get it wrong",
    lines: [
     { c: "  TRAIN       ~90%      what the model sees" },
     { c: "  VALIDATION  ~5%       watched during training, for early stopping" },
     { c: "  TEST        ~5%       touched ONCE, at the very end", hi: true },
     { c: "" },
     { c: "  Splitting rules that matter more than the ratio:" },
     { c: "" },
     { c: "   - split by DOCUMENT or CUSTOMER, not by row.", hi: true },
     { c: "     Two chunks of the same contract in train and test is" },
     { c: "     leakage, and it will flatter your score by several points." },
     { c: "" },
     { c: "   - split by TIME if the task drifts. Train on Jan-Jun," },
     { c: "     test on Jul-Aug. A random split hides temporal drift" },
     { c: "     completely, and production is always the future.", hi: true },
     { c: "" },
     { c: "   - the TEST set is not for tuning. Every time you look at" },
     { c: "     it and change something, it becomes a validation set," },
     { c: "     and your final number becomes optimistic." },
     { c: "" },
     { c: "   - keep a GENERAL benchmark outside all three, to detect" },
     { c: "     capability you destroyed while improving one task.", hi: true }
    ] } },

  { h: "Distillation, concretely" },
  { code: { lang: "python", file: "distil.py", t: "Building a training set from a stronger model",
    lines: [
     { c: "# The most common commercially-justified fine-tune:", w: "" },
     { c: "# teach a small model to do one job a big model already does.", w: "" },
     { c: "", w: "" },
     { c: "for row in production_inputs.sample(20_000):", w: "**Use real inputs.** Synthetic inputs produce a model good at synthetic inputs.", hi: true },
     { c: "    out = frontier_model(TASK_PROMPT, row.text)", w: "" },
     { c: "", w: "" },
     { c: "    # VERIFY. This is the step that separates a good distillation", w: "" },
     { c: "    # set from an expensive way to copy a model's mistakes.", w: "" },
     { c: "    if not schema.validate(out):", w: "**Machine-checkable verification wherever possible** — schema, arithmetic, compilation, entailment against a source.", hi: true },
     { c: "        continue", w: "" },
     { c: "    if not arithmetic_consistent(out):", w: "" },
     { c: "        continue", w: "" },
     { c: "", w: "" },
     { c: "    dataset.append({'input': row.text, 'output': out})", w: "" },
     { c: "", w: "" },
     { c: "# 20,000 attempted -> ~16,000 verified -> ~11,000 after dedup", w: "**Expect to lose 40-50% to verification and deduplication.** Budget for it." },
     { c: "# cost: 20,000 x Rs 0.5 = Rs 10,000 of frontier inference", w: "**₹10,000 to build a dataset that saves ₹40,000 a month.** That arithmetic is the business case, and it is worth stating in an interview exactly this way.", hi: true }
    ] } },

  { tryit: { t: "Build and audit a real dataset",
    task: "Assemble at least 1,000 examples for a task you care about, from logs or by distillation. Run the full cleaning pipeline and record how many examples each stage removes. Then audit the result: plot the length distribution of inputs and outputs, count the outputs by category, and read 30 random examples yourself. Fix anything you would not want the model to learn.",
    hint: "Reading 30 examples by hand is the step everyone skips and the one that finds the real problems — a truncated field, a template that leaked in, a systematic mislabel.",
    sol: { lang: "python", code: "# The audit that finds what the pipeline missed\n\nimport collections, statistics\n\nlens_in  = [count_tokens(e['input'])  for e in data]\nlens_out = [count_tokens(e['output']) for e in data]\n\nprint('input  p50/p95/max', statistics.median(lens_in),\n      pct(lens_in, 95), max(lens_in))\nprint('output p50/p95/max', statistics.median(lens_out),\n      pct(lens_out, 95), max(lens_out))\n\nprint(collections.Counter(e['category'] for e in data).most_common())\nprint(collections.Counter(e['language'] for e in data).most_common())\n\n# --- what one real audit turned up ---\n#\n# input  p50/p95/max  340 / 2180 / 8940\n# output p50/p95/max   95 /  210 /  512\n#\n# [('billing', 3120), ('technical', 1890), ('other', 41), ...]\n#     -> 'other' is 0.6% of training data and 11% of production.\n#        The model will be terrible at it. Over-sample or exclude\n#        the category from the task entirely.\n#\n# [('en', 6180), ('hi', 208), ('ta', 43)]\n#     -> production is 30% Hindi. This fine-tune will make Hindi\n#        WORSE than the base model. Found before training, this\n#        costs a week of data collection. Found after, it costs\n#        the whole project.\n#\n# And from reading 30 by hand:\n#   - 4 outputs ended with 'Let me know if you need anything else!'\n#     -- a template from the old system. Training on it teaches\n#     the model to append it always. Strip it.\n#   - 2 inputs contained the correct answer already, pasted in by\n#     an agent. Pure leakage. Removed.\n\n# None of these are visible in the loss curve. All of them would\n# have shown up as 'the fine-tune is worse and we do not know why'." },
    w: "This audit takes an hour and it is the highest-value hour in a fine-tuning project. Every problem it finds would otherwise appear as an unexplained bad result three weeks later, at which point diagnosing it means going back to the data anyway — having spent the three weeks." } },

  { vocab: ["Training, Validation and Test Split", "Data Leakage", "Knowledge Distillation", "Overfitting", "Benchmark"] }
 ],
 k: [
  "A thousand checked examples beat ten thousand scraped ones — reliably, and by a lot.",
  "Near-duplicate removal typically cuts a log-derived set by a third; skipping it lets one phrasing dominate the gradient.",
  "Decontaminate against your evaluation set, or your score measures memorisation.",
  "Split by document, customer or time — never by row — and keep a general benchmark outside all splits.",
  "Distillation needs verification: unverified synthetic data teaches you the generator's mistakes at your own expense."
 ],
 r: ["Training, Validation and Test Split", "Data Leakage", "Knowledge Distillation", "Overfitting", "Benchmark", "Exploratory Data Analysis"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "out = dedupe_near(out, threshold=0.85)", w: "remove near-duplicates that would otherwise dominate training" },
   { c: "out = remove_overlapping(out, EVAL_SET, threshold=0.8)", w: "decontaminate the training set against the evaluation set" },
   { c: "collections.Counter(e['language'] for e in data).most_common()", w: "check whether the data covers the production distribution" }
  ]
 }
},

{
 t: "Chat Templates and Loss Masking",
 m: "data",
 lvl: "intermediate",
 s: "The two formatting details that silently ruin a fine-tune, and how to verify you got them right.",
 goal: [
  "Format examples with the exact chat template the base model was trained with",
  "Mask the loss so the model learns to produce answers, not to repeat questions",
  "Verify both by decoding a batch before you start training"
 ],
 b: [
  { p: "These two details cause more silently-bad fine-tunes than every hyperparameter combined. Neither raises an error. Both produce a model that trains happily, shows a falling loss curve, and behaves oddly at inference in ways that are hard to attribute." },

  { h: "The chat template" },
  { p: "An instruction-tuned model was trained with specific special tokens marking where each turn starts and ends. Those tokens are not decoration — the model learned to condition on them, and to stop at them. If you train with different markers, you are teaching it a second, conflicting convention." },

  { code: { lang: "text", t: "Three families, three conventions",
    lines: [
     { c: "  Llama 3 style" },
     { c: "    <|begin_of_text|><|start_header_id|>system<|end_header_id|>" },
     { c: "    You are a contracts analyst.<|eot_id|>" },
     { c: "    <|start_header_id|>user<|end_header_id|>" },
     { c: "    Summarise clause 4.<|eot_id|>" },
     { c: "    <|start_header_id|>assistant<|end_header_id|>" },
     { c: "    The clause limits liability to...<|eot_id|>", hi: true },
     { c: "" },
     { c: "  ChatML style (Qwen, and others)" },
     { c: "    <|im_start|>system" },
     { c: "    You are a contracts analyst.<|im_end|>" },
     { c: "    <|im_start|>user" },
     { c: "    Summarise clause 4.<|im_end|>" },
     { c: "    <|im_start|>assistant" },
     { c: "    The clause limits liability to...<|im_end|>" },
     { c: "" },
     { c: "  Mistral style" },
     { c: "    <s>[INST] Summarise clause 4. [/INST] The clause limits...</s>" },
     { c: "" },
     { c: "  Do NOT write these by hand. Ask the tokeniser:", hi: true },
     { c: "    tokenizer.apply_chat_template(messages, tokenize=False)" }
    ] } },

  { code: { lang: "python", file: "format.py", t: "Formatting, done safely",
    lines: [
     { c: "from transformers import AutoTokenizer", w: "" },
     { c: "", w: "" },
     { c: "tok = AutoTokenizer.from_pretrained(BASE_MODEL)", w: "" },
     { c: "", w: "" },
     { c: "def to_text(example):", w: "" },
     { c: "    messages = [", w: "" },
     { c: "        {'role': 'system',    'content': SYSTEM},", w: "**Include the system prompt you will actually use at inference.** Training without one and serving with one is a mismatch the model was never shown.", hi: true },
     { c: "        {'role': 'user',      'content': example['input']},", w: "" },
     { c: "        {'role': 'assistant', 'content': example['output']},", w: "" },
     { c: "    ]", w: "" },
     { c: "    return tok.apply_chat_template(", w: "**The tokeniser knows its own template.** Writing the tokens by hand is how a subtle mismatch gets in.", hi: true },
     { c: "        messages, tokenize=False, add_generation_prompt=False", w: "**`add_generation_prompt=False` for training** — the assistant turn is already present. Set it True only when generating." },
     { c: "    )", w: "" },
     { c: "", w: "" },
     { c: "# VERIFY. Print one, and read every character.", w: "" },
     { c: "print(repr(to_text(dataset[0])))", w: "**Do this every time.** Two minutes here saves a training run.", hi: true }
    ] } },

  { h: "Loss masking" },
  { code: { lang: "text", t: "What the model should be graded on",
    lines: [
     { c: "  WITHOUT masking -- loss on every token:" },
     { c: "" },
     { c: "    <|user|> Summarise clause 4. <|assistant|> The clause limits..." },
     { c: "    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^" },
     { c: "    model is graded on predicting THIS too   and on this", hi: true },
     { c: "" },
     { c: "    -> the model learns to generate plausible USER messages" },
     { c: "    -> at inference it sometimes continues past its answer and" },
     { c: "       writes the next question itself", hi: true },
     { c: "    -> and gradient is spent on tokens you do not care about" },
     { c: "" },
     { c: "  WITH masking -- labels = -100 on the prompt:" },
     { c: "" },
     { c: "    <|user|> Summarise clause 4. <|assistant|> The clause limits..." },
     { c: "    ---------- ignored ---------           ^^^^^^^^^^^^^^^^^^^^^" },
     { c: "                                            graded on this only", hi: true },
     { c: "" },
     { c: "    -100 is PyTorch's ignore_index for cross-entropy." }
    ] } },

  { code: { lang: "python", file: "mask.py", t: "Two ways to do it",
    lines: [
     { c: "# The easy way: let TRL handle it.", w: "" },
     { c: "from trl import SFTTrainer, SFTConfig", w: "" },
     { c: "", w: "" },
     { c: "cfg = SFTConfig(", w: "" },
     { c: "    completion_only_loss=True,", w: "**One flag.** With a prompt/completion dataset, TRL masks the prompt for you.", hi: true },
     { c: "    max_length=2048,", w: "" },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "# The manual way, when you need to know it is right:", w: "" },
     { c: "def build(example):", w: "" },
     { c: "    prompt = tok.apply_chat_template(", w: "" },
     { c: "        messages[:-1], tokenize=False, add_generation_prompt=True)", w: "**Everything up to and including the assistant header.**" },
     { c: "    full = tok.apply_chat_template(messages, tokenize=False)", w: "" },
     { c: "", w: "" },
     { c: "    p_ids = tok(prompt, add_special_tokens=False)['input_ids']", w: "**`add_special_tokens=False`** — the template already added them. Doubling BOS is a classic silent bug.", hi: true },
     { c: "    f_ids = tok(full,   add_special_tokens=False)['input_ids']", w: "" },
     { c: "", w: "" },
     { c: "    labels = list(f_ids)", w: "" },
     { c: "    labels[:len(p_ids)] = [-100] * len(p_ids)", w: "**Mask the prompt portion.**", hi: true },
     { c: "    return {'input_ids': f_ids, 'labels': labels,", w: "" },
     { c: "            'attention_mask': [1] * len(f_ids)}", w: "" }
    ] } },

  { h: "Verify before you train" },
  { code: { lang: "python", file: "verify.py", t: "The five-minute check that saves a run",
    lines: [
     { c: "batch = next(iter(dataloader))", w: "" },
     { c: "", w: "" },
     { c: "ids    = batch['input_ids'][0]", w: "" },
     { c: "labels = batch['labels'][0]", w: "" },
     { c: "", w: "" },
     { c: "print('--- FULL SEQUENCE ---')", w: "" },
     { c: "print(tok.decode(ids))", w: "**Does it look exactly like the template? Are the special tokens present and not doubled?**", hi: true },
     { c: "", w: "" },
     { c: "print('--- WHAT THE LOSS SEES ---')", w: "" },
     { c: "supervised = [i for i, l in zip(ids, labels) if l != -100]", w: "" },
     { c: "print(tok.decode(supervised))", w: "**This must be the assistant's answer and nothing else.** If you see the user's question here, masking is wrong.", hi: true },
     { c: "", w: "" },
     { c: "print('supervised tokens:', len(supervised), 'of', len(ids))", w: "**A sanity ratio.** For a short answer to a long question, 5–20% is normal. 100% means no masking is happening at all." },
     { c: "", w: "" },
     { c: "print('eos present:', tok.eos_token_id in ids.tolist())", w: "**No EOS in training means the model never learns to stop**, and generates until it hits max_tokens. A very common and very confusing failure.", hi: true },
     { c: "", w: "" },
     { c: "print('pad != eos:', tok.pad_token_id != tok.eos_token_id)", w: "**If pad and eos are the same token and padding is not masked**, the model is trained to predict EOS constantly and produces empty outputs. Set a distinct pad token." }
    ],
    out: "--- WHAT THE LOSS SEES ---\nThe clause limits liability to the fees paid in the preceding twelve months.<|eot_id|>\nsupervised tokens: 21 of 187\neos present: True\npad != eos: True" } },

  { trap: "The three failures this check catches, all of which train without any error: **(1)** no EOS in the sequence, so the model never stops; **(2)** the prompt not masked, so the model writes its own next question; **(3)** a template mismatch, so the model is fighting its own pre-training convention. Every one of them produces a falling loss curve and a model that behaves strangely, and every one is two minutes to catch here." },

  { tryit: { t: "Break each of the three, and see what it does",
    task: "Prepare a small dataset correctly and confirm the verification output looks right. Then deliberately produce three broken versions — no EOS token, no loss masking, and a hand-written template that does not match the tokeniser's — train each for 100 steps on 200 examples, and generate from all four. Write down how each failure presents at inference.",
    hint: "Use a very small model and a tiny dataset so each run takes minutes. The point is the symptom, not the quality.",
    sol: { lang: "text", code: "# What each broken version actually does at inference\n\nCORRECT\n  > Summarise clause 4.\n  The clause limits liability to the fees paid in the\n  preceding twelve months.\n  [stops cleanly]\n\nNO EOS IN TRAINING DATA\n  > Summarise clause 4.\n  The clause limits liability to the fees paid in the\n  preceding twelve months. The clause limits liability\n  to the fees paid in the preceding twelve months. The\n  clause limits...\n  [runs to max_tokens every single time]\n  -> looks like a repetition-penalty problem. It is not.\n\nNO LOSS MASKING\n  > Summarise clause 4.\n  The clause limits liability to the fees paid in the\n  preceding twelve months.\n\n  Summarise clause 7.\n  The clause requires...\n  [answers, then invents the next question and answers it]\n  -> looks like a stop-sequence problem. It is not.\n\nWRONG CHAT TEMPLATE\n  > Summarise clause 4.\n  ### Response: The clause limits liability... <|im_end|>\n  [leaks markers from both conventions, ignores the system\n   prompt, quality noticeably down across the board]\n  -> looks like the fine-tune 'made the model worse',\n     which is the least actionable diagnosis there is.\n\n# The lesson: all three present as something else. Without\n# the verification step you will spend days on the wrong\n# hypothesis, and this is exactly how fine-tuning acquires\n# its reputation for being unpredictable." },
    w: "Having seen these three symptoms once, you will recognise them instantly for the rest of your career — and you will be the person in the room who says \"decode a batch and show me what the loss is computed over\" while everyone else is adjusting the learning rate." } },

  { vocab: ["Tokenisation", "Token", "Prompt Template", "System Prompt", "Instruction Tuning"] }
 ],
 k: [
  "Use `tokenizer.apply_chat_template` — never hand-write the special tokens.",
  "Mask the prompt with -100 so loss is computed only on the assistant's answer.",
  "Decode one batch before training and check: template correct, only the answer supervised, EOS present, pad distinct from eos.",
  "No EOS in training produces a model that never stops; no masking produces one that writes its own next question.",
  "Train with the system prompt you will serve with, or you have introduced a mismatch the model never saw."
 ],
 r: ["Tokenisation", "Token", "Prompt Template", "System Prompt", "Instruction Tuning", "Fine-Tuning"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)", w: "format an example with the model's own template, for training" },
   { c: "labels[:len(p_ids)] = [-100] * len(p_ids)", w: "mask the prompt so loss is only on the answer" },
   { c: "print(tok.decode([i for i, l in zip(ids, labels) if l != -100]))", w: "print exactly what the loss is computed over" }
  ]
 }
}

]);
