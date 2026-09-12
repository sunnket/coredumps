/* Deep Learning — fine-tuning and adaptation. */
TD.addLessons("dl", [

{
 t: "LoRA, Quantisation, and When Not to Fine-Tune",
 m: "adapt",
 lvl: "intermediate",
 s: "How to adapt a model you did not train — and the senior judgement of whether to bother.",
 goal: [
  "Decide correctly between prompting, RAG and fine-tuning",
  "Explain what LoRA changes and why it needs so little memory",
  "Run a fine-tune and evaluate it honestly against not fine-tuning"
 ],
 b: [
  { p: "Fine-tuning is the most requested and least necessary technique in applied AI. Knowing when *not* to do it is a senior-level judgement, and demonstrating it as a fresher is disproportionately impressive — so this lesson starts there." },

  { h: "The decision, before the technique" },
  { tbl: { t: "What each approach actually fixes",
    h: ["Problem", "Right tool", "Why"],
    rows: [
     ["*It does not know our internal documents*", "**RAG**", "Fine-tuning teaches style, not facts. Facts change; a retrieval index updates in seconds, a fine-tune does not"],
     ["*It gets the format wrong*", "**Prompting + structured output**", "Almost always solvable with a schema and a couple of examples"],
     ["*It does not follow our tone of voice*", "**Fine-tuning** — or a good system prompt first", "Style is exactly what fine-tuning is good at. Try the prompt first; it is free"],
     ["*It is too slow and expensive*", "**Fine-tune a smaller model**", "The strongest real case: distil a big model's behaviour into a small one for a narrow task"],
     ["*It cannot do our specialised task*", "**Fine-tuning**, if you have 1,000+ good examples", "Genuine domain adaptation. Needs real labelled data"],
     ["*It hallucinates*", "**RAG + grounding + evaluation**", "**Fine-tuning frequently makes this worse** — it teaches confident output in your style, including when confidently wrong"]
    ] } },

  { n: "The last row is the one that costs teams months. Fine-tuning on your documents does not make the model *know* them; it makes it produce text that sounds like them. The model becomes more confident and no more correct, which is strictly worse than before. If the problem is factual accuracy, the answer is retrieval.",
    nt: "The expensive misconception" },

  { h: "The order to try things" },
  { ol: [
   "**Better prompt.** Free, instant, and solves more than people expect.",
   "**Few-shot examples in the prompt.** Still free. Often matches a fine-tune for format tasks.",
   "**RAG.** If the issue is knowledge, this is the answer and fine-tuning is not.",
   "**A bigger or better model.** Sometimes the cheapest fix by far when you count engineering time.",
   "**Then fine-tune** — with a specific hypothesis and an evaluation set ready before you start."
  ] },

  { h: "Why full fine-tuning is impractical" },
  { code: { lang: "python", t: "The memory arithmetic",
    lines: [
     { c: "# Full fine-tuning a 7B model in fp16:", w: "" },
     { c: "#   weights            7B x 2 bytes  =  14 GB", w: "" },
     { c: "#   gradients          7B x 2 bytes  =  14 GB", w: "" },
     { c: "#   Adam states (x2)   7B x 8 bytes  =  56 GB", w: "**Adam keeps two running averages per parameter, in fp32.**", hi: true },
     { c: "#   activations                      ~  10 GB", w: "" },
     { c: "#   ----------------------------------------", w: "" },
     { c: "#   total                            ~  94 GB", w: "**Two A100s minimum.** And that is a small model by 2026 standards.", hi: true }
    ] } },

  { h: "LoRA" },
  { p: "**Low-Rank Adaptation** rests on one observation: the *change* a fine-tune makes to a weight matrix is low-rank. It does not span the full space. So do not store the full change — store two small matrices whose product approximates it." },

  { code: { lang: "python", t: "The whole idea",
    lines: [
     { c: "# original layer:  h = x @ W          W is (4096, 4096) = 16.7M params", w: "" },
     { c: "", w: "" },
     { c: "# LoRA:            h = x @ W + x @ A @ B", w: "" },
     { c: "#                  A is (4096, 8)   B is (8, 4096)", w: "**r = 8.** 65,536 parameters instead of 16.7 million — 0.4% of the original.", hi: true },
     { c: "", w: "" },
     { c: "# W is FROZEN. Only A and B are trained.", w: "**No gradients and no optimiser states for W** — which is where the 94 GB went.", hi: true },
     { c: "# A starts random, B starts at ZERO,", w: "" },
     { c: "# so at step 0 the adapter contributes exactly nothing", w: "The model begins identical to the base and diverges gradually. This is why LoRA training is stable." }
    ] } },

  { ana: "You are not rewriting the book. You are writing margin notes on a copy you are not allowed to alter. The notes are tiny compared with the book, you can keep several sets for different purposes, and you can hand someone the notes alone — twenty megabytes rather than fourteen gigabytes. That last property is why model-sharing sites are full of LoRA adapters rather than full models.",
    at: "Margin notes, not a rewrite" },

  { code: { lang: "python", file: "finetune.py", t: "QLoRA — a 7B fine-tune on one consumer GPU",
    lines: [
     { c: "from transformers import AutoModelForCausalLM, BitsAndBytesConfig", w: "" },
     { c: "from peft import LoraConfig, get_peft_model", w: "" },
     { c: "", w: "" },
     { c: "bnb = BitsAndBytesConfig(", w: "" },
     { c: "    load_in_4bit=True,", w: "**Base weights in 4 bits instead of 16.** 14 GB becomes about 4 GB.", hi: true },
     { c: "    bnb_4bit_compute_dtype=torch.bfloat16,", w: "Stored in 4-bit, computed in bf16 — quality holds up remarkably well." },
     { c: "    bnb_4bit_quant_type='nf4')", w: "**NormalFloat4**, designed for the roughly-normal distribution of neural network weights." },
     { c: "", w: "" },
     { c: "model = AutoModelForCausalLM.from_pretrained(", w: "" },
     { c: "    'mistralai/Mistral-7B-v0.3', quantization_config=bnb, device_map='auto')", w: "" },
     { c: "", w: "" },
     { c: "cfg = LoraConfig(", w: "" },
     { c: "    r=16,", w: "**Rank.** 8–16 for style, 32–64 for genuinely new capability. Higher is not automatically better." },
     { c: "    lora_alpha=32,", w: "Scaling. **The convention is alpha = 2r** and it is a reasonable default." },
     { c: "    target_modules=['q_proj','k_proj','v_proj','o_proj'],", w: "**Which layers get adapters.** Attention projections are the standard choice; adding the MLP layers helps on harder tasks and costs more.", hi: true },
     { c: "    lora_dropout=0.05, task_type='CAUSAL_LM')", w: "" },
     { c: "", w: "" },
     { c: "model = get_peft_model(model, cfg)", w: "" },
     { c: "model.print_trainable_parameters()", w: "" }
    ],
    out: "trainable params: 6,815,744 || all params: 7,248,547,840 || trainable%: 0.094",
    after: "0.094% of the parameters are trainable. Total memory drops from ~94 GB to roughly 8 GB, which fits on a single consumer GPU. This is the technique that moved fine-tuning from *a lab with a cluster* to *anyone with a gaming machine or a Colab session*." } },

  { h: "Quantisation for inference" },
  { tbl: { t: "Precision against cost",
    h: ["Precision", "7B model size", "Quality", "Use for"],
    rows: [
     ["fp32", "28 GB", "Reference", "Nothing. Wasteful"],
     ["**fp16 / bf16**", "**14 GB**", "Effectively identical", "**The standard for serving**"],
     ["int8", "7 GB", "Very slightly worse", "Memory-constrained serving"],
     ["**int4 (nf4, GPTQ, AWQ)**", "**3.5 GB**", "Noticeably worse on hard reasoning, fine for most tasks", "**Local and edge deployment.** Test on *your* task, not on a benchmark"]
    ] } },

  { trap: "Quantisation degradation is task-dependent and does not show up on general benchmarks. A 4-bit model may match fp16 on summarisation and fall apart on multi-step arithmetic or precise instruction-following. Always evaluate the quantised model on your own task before deploying it — the published perplexity number will not tell you what you need to know." },

  { h: "Doing a fine-tune properly" },
  { ol: [
   "**Build the evaluation set first.** Before any training. If you cannot measure it, you cannot know whether the fine-tune helped, and *it feels better* is not a result.",
   "**Establish the prompting baseline.** Score the base model with your best prompt. This is what you must beat, and sometimes you will not.",
   "**Data quality over quantity.** 500 excellent examples beat 5,000 mediocre ones, consistently. Read your data by hand.",
   "**Match the format exactly.** Use the model's own chat template. A mismatched template is the most common reason a fine-tune produces garbage.",
   "**Hold out a test set** from the same distribution.",
   "**Compare honestly** — and report the result even when fine-tuning lost."
  ] },

  { code: { lang: "python", t: "The comparison that should end every fine-tuning project",
    lines: [
     { c: "results = {", w: "" },
     { c: "  'base + zero-shot':     evaluate(base, test, prompt_v1),", w: "" },
     { c: "  'base + good prompt':   evaluate(base, test, prompt_v3),", w: "**Frequently the winner.** Prompt iteration is cheap and often sufficient." },
     { c: "  'base + few-shot':      evaluate(base, test, prompt_v3, shots=5),", w: "" },
     { c: "  'base + RAG':           evaluate(base_rag, test, prompt_v3),", w: "" },
     { c: "  'fine-tuned':           evaluate(ft, test, prompt_v1),", w: "" },
     { c: "  'bigger model + prompt': evaluate(big, test, prompt_v3),", w: "**Include this.** Sometimes the answer is simply to use a better model." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "# report cost per 1k requests alongside quality", w: "**Quality alone is not a decision.** A 2-point gain that triples cost may be a bad trade, and only the table shows it.", hi: true }
    ] } },

  { n: "That table, with an honest conclusion, is one of the strongest portfolio artefacts a junior candidate can produce — *especially* if fine-tuning lost. It demonstrates that you evaluate rather than assume, which is the exact quality applied AI teams are short of and the thing they probe for in interviews.",
    nt: "Why the negative result is worth publishing" },

  { h: "Serving adapters" },
  { l: [
   "**Keep them separate** — load the base model once and swap adapters per request. This is how one GPU serves many customer-specific models.",
   "**Or merge them** — `model.merge_and_unload()` folds the adapter into the base weights. No inference overhead, but no swapping either.",
   "**Version them with their data.** An adapter without a record of what it was trained on is unmaintainable within a month.",
   "**Adapters are small** — tens of megabytes. Store them like configuration, not like models."
  ] },

  { tryit: { t: "Fine-tune, and be honest about the result",
    task: "Pick a narrow task with a clear right answer — extracting fields from invoices, classifying support tickets, converting text to a fixed JSON schema. Build a 100-example test set. Score: base model with a good prompt, base with five-shot examples, and a LoRA fine-tune on 500 examples. Report all three, with cost per 1,000 requests.",
    hint: "Use a small open model — Qwen 2.5 1.5B or Llama 3.2 3B — so this fits on free Colab. Build the evaluation set before you train anything.",
    sol: { lang: "text", code: "A realistic result table for invoice field extraction:\n\n  approach              exact match   cost/1k   latency p95\n  ------------------------------------------------------------\n  base, zero-shot           0.61       $0.40       1.2s\n  base, good prompt         0.79       $0.55       1.4s\n  base, 5-shot              0.84       $1.90       1.9s\n  LoRA fine-tune (500ex)    0.91       $0.35       1.1s\n  GPT-class API             0.93       $8.20       2.4s\n\nConclusion: the fine-tune wins on quality-per-rupee, and it\nwins because the task is NARROW and the format is FIXED --\nexactly the conditions where fine-tuning is the right tool.\nNote also that few-shot cost 5x more per request than the\nfine-tune, because those examples are re-sent every single\ntime. That is a real and frequently overlooked cost." },
    w: "Write this up with the table, the failure cases and the reasoning. It is a better portfolio piece than a chatbot demo, it gives you a genuine forty-minute conversation in a project deep-dive, and it demonstrates the exact judgement — measure, compare, decide on cost as well as quality — that separates hires from rejections." } },

  { vocab: ["Fine-Tuning", "LoRA", "QLoRA", "Quantisation", "PEFT", "Knowledge Distillation"] }
 ],
 k: [
  "Fine-tuning teaches style and format, not facts — if the problem is knowledge, the answer is RAG.",
  "Try prompt, few-shot, RAG and a better model before fine-tuning, in that order.",
  "LoRA trains two small matrices instead of the full weights, cutting trainable parameters to under 1%.",
  "QLoRA adds 4-bit base weights, bringing a 7B fine-tune onto a single consumer GPU.",
  "Build the evaluation set before training, and report the result honestly even when fine-tuning loses."
 ],
 r: ["Fine-Tuning", "LoRA", "QLoRA", "Quantisation", "PEFT", "Knowledge Distillation", "Retrieval-Augmented Generation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "LoraConfig(r=16, lora_alpha=32, target_modules=['q_proj','v_proj'])", w: "a standard LoRA configuration" },
   { c: "BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type='nf4')", w: "4-bit base weights, the QLoRA half" },
   { c: "model.print_trainable_parameters()", w: "confirm how little you are actually training" },
   { c: "model.merge_and_unload()", w: "fold the adapter into the base for zero inference overhead" }
  ]
 }
}

]);
