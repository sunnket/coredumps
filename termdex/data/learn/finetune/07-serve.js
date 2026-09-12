/* Fine-Tuning & Model Adaptation — serving the result. */
TD.addLessons("finetune", [

{
 t: "Serving a Fine-Tuned Model",
 m: "serve",
 lvl: "intermediate",
 s: "Merge or keep adapters, multi-adapter serving, quantising a fine-tune, and the cost of owning a model.",
 goal: [
  "Choose between merging an adapter and serving it separately, with reasons",
  "Serve a fine-tuned model with vLLM and know what its throughput will be",
  "State the full ongoing cost of owning a model rather than calling an API"
 ],
 b: [
  { p: "A fine-tuned model that lives in a notebook is not a result. This lesson is the last mile: how it is served, what it costs, and the decision that determines both — whether the adapter stays separate or is folded into the weights." },

  { h: "Merge, or keep the adapter" },
  { tbl: { t: "The decision",
    h: ["", "Merged", "Adapter kept separate"],
    rows: [
     ["Inference speed", "**Baseline — identical to the base model**", "~5–10% slower"],
     ["Artefact size", "16 GB (full weights)", "**~160 MB**"],
     ["Swapping models", "Reload 16 GB", "**Swap in milliseconds**"],
     ["Many variants", "One full copy each", "**Many adapters, one shared base**"],
     ["Quantising it", "Straightforward", "Awkward"],
     ["Rollback", "Redeploy the artefact", "**Change one identifier**"]
    ] } },

  { n: "**Merge when you serve one model and want maximum throughput.** **Keep adapters when you serve several variants** — per customer, per task, or a champion and a challenger side by side. The second case is the one that makes LoRA economically interesting, because a hundred customers can share one base model's memory and have a hundred behaviours.",
    nt: "The rule" },

  { code: { lang: "python", file: "merge.py", t: "Merging correctly",
    lines: [
     { c: "import torch", w: "" },
     { c: "from transformers import AutoModelForCausalLM, AutoTokenizer", w: "" },
     { c: "from peft import PeftModel", w: "" },
     { c: "", w: "" },
     { c: "base = AutoModelForCausalLM.from_pretrained(", w: "" },
     { c: "    BASE_MODEL,", w: "" },
     { c: "    torch_dtype=torch.bfloat16,", w: "**The ORIGINAL BF16 weights.** Not the 4-bit version you trained against.", hi: true },
     { c: "    device_map='cpu',", w: "**Merge on CPU** if the model does not fit in VRAM. It is slower and it works." },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "model = PeftModel.from_pretrained(base, 'out/run-07/adapter')", w: "" },
     { c: "model = model.merge_and_unload()", w: "**Folds B·A into W and removes the adapter modules.** The result is an ordinary model with no PEFT dependency.", hi: true },
     { c: "", w: "" },
     { c: "model.save_pretrained('models/invoice-8b-v3', safe_serialization=True)", w: "**Safetensors, not pickle.** Faster to load and it cannot execute code." },
     { c: "AutoTokenizer.from_pretrained(BASE_MODEL).save_pretrained('models/invoice-8b-v3')", w: "**Save the tokeniser alongside.** A model directory without one is a support ticket waiting to happen." }
    ],
    after: "Merging into the quantised base rather than the original bakes quantisation error permanently into the weights. It is a one-line mistake with a silent, permanent cost, and it is worth checking explicitly in your merge script." } },

  { h: "Serving it with vLLM" },
  { code: { lang: "bash", t: "The realistic serving setup",
    lines: [
     { c: "# Merged model, single variant:", w: "" },
     { c: "vllm serve models/invoice-8b-v3 \\", w: "" },
     { c: "  --max-model-len 4096 \\", w: "**Set it from your data.** A larger context reserves more KV cache and reduces your batch size for nothing.", hi: true },
     { c: "  --gpu-memory-utilization 0.90 \\", w: "**How much VRAM vLLM may claim for weights plus cache.** 0.90 is aggressive and usually fine on a dedicated card." },
     { c: "  --quantization awq \\", w: "**Weight-only 4-bit for serving.** Roughly doubles decode throughput because decode is memory-bandwidth-bound." },
     { c: "  --enable-prefix-caching \\", w: "**Free win for a fixed system prompt** — its KV cache is computed once and reused across requests.", hi: true },
     { c: "  --port 8000", w: "" },
     { c: "", w: "" },
     { c: "# Many adapters, one base -- the multi-tenant pattern:", w: "" },
     { c: "vllm serve meta-llama/Llama-3.1-8B-Instruct \\", w: "" },
     { c: "  --enable-lora \\", w: "" },
     { c: "  --max-loras 8 \\", w: "**How many adapters may be active at once.** Each costs a little memory." },
     { c: "  --max-lora-rank 32 \\", w: "" },
     { c: "  --lora-modules invoice=./adapters/invoice contract=./adapters/contract", w: "**Then the request names its adapter as the model id.** One GPU, several behaviours, one copy of the weights.", hi: true }
    ] } },

  { code: { lang: "text", t: "What throughput to expect, 8B on one A10G (24 GB)",
    lines: [
     { c: "  BF16, no quantisation" },
     { c: "    weights                    16 GB" },
     { c: "    KV cache available          6 GB  -> ~45k tokens" },
     { c: "    concurrent @ 2k context     ~22" },
     { c: "    decode, single stream      ~38 tok/s" },
     { c: "" },
     { c: "  AWQ 4-bit" },
     { c: "    weights                     5 GB", hi: true },
     { c: "    KV cache available         17 GB  -> ~130k tokens" },
     { c: "    concurrent @ 2k context     ~65", hi: true },
     { c: "    decode, single stream      ~95 tok/s" },
     { c: "" },
     { c: "  Quantising bought 3x the concurrency AND 2.5x the single-" },
     { c: "  stream speed. Both come from the same cause: decode is" },
     { c: "  memory-bandwidth-bound, so fewer bytes is faster.", hi: true },
     { c: "" },
     { c: "  Quality cost, measured on the task eval set: -0.006 F1." },
     { c: "  Take it." }
    ] } },

  { h: "The economics of self-hosting" },
  { code: { lang: "text", t: "When owning beats renting",
    lines: [
     { c: "  A10G on demand              ~Rs 100/hr  = Rs 73,000/month" },
     { c: "  ...but you need 2 for redundancy = Rs 146,000/month", hi: true },
     { c: "  ...plus your time to operate it" },
     { c: "" },
     { c: "  At 65 concurrent x ~0.6 req/s each = ~2.3M requests/month" },
     { c: "  if you actually saturate it, which nobody does." },
     { c: "" },
     { c: "  Realistic 30% utilisation: ~700k requests/month" },
     { c: "    self-hosted   Rs 146,000 / 700k = Rs 0.21 per request" },
     { c: "    small API model                 = Rs 0.05 per request", hi: true },
     { c: "    frontier API                    = Rs 0.60 per request" },
     { c: "" },
     { c: "  CONCLUSION" },
     { c: "    Self-hosting only wins above roughly 2-3 million" },
     { c: "    requests a month of STEADY traffic -- or when the", hi: true },
     { c: "    reason is not cost at all: data residency, latency," },
     { c: "    a model nobody hosts, or an offline requirement." },
     { c: "" },
     { c: "  Serverless GPU (Modal, RunPod, Bedrock custom import)" },
     { c: "  is the middle ground: per-second billing, scale to zero," },
     { c: "  a cold start of 30-90s. Often the right answer for a" },
     { c: "  fine-tune with spiky traffic.", hi: true }
    ] } },

  { trap: "The most common self-hosting mistake is comparing a saturated GPU's theoretical cost per request against an API price. Real utilisation on a product with daily and weekly traffic cycles is 20–40%, so divide your optimistic number by three before comparing. An idle GPU at 3am costs exactly the same as a busy one." },

  { h: "The ongoing cost of owning a model" },
  { l: [
   "**Versioning.** Model artefacts in S3 or a registry, immutably tagged, with the training data, config and evaluation results recorded against each. \"Which version produced this output\" must be answerable.",
   "**Rollback.** A path back to the previous version that takes minutes, and that you have practised.",
   "**Evaluation on a schedule.** Your fine-tune does not drift, but the world does — input distributions change, and a model tuned on last year's documents quietly degrades.",
   "**Base model upgrades.** A better base appears every few months. You are pinned until you redo the work, and that work is the same weeks again.",
   "**On call.** A GPU service is a service. Somebody has to notice when it stops.",
   "**The comparison, repeated.** Re-run the frontier-model comparison every quarter. The cost gap has narrowed repeatedly, and at some point your fine-tune stops being worth its overhead — noticing that early is a good decision, not an admission."
  ] },

  { h: "Shipping it safely" },
  { code: { lang: "text", t: "The rollout",
    lines: [
     { c: "  1. SHADOW      route 100% of traffic to both; serve the old" },
     { c: "                 one; log both. Compare for a week.", hi: true },
     { c: "  2. CANARY      5% of real traffic on the new model." },
     { c: "                 watch task metric, latency, cost, complaints." },
     { c: "  3. RAMP        25%, 50%, 100%, a day or two apart." },
     { c: "  4. KEEP THE OLD ONE WARM until you are certain." },
     { c: "" },
     { c: "  And an automatic fallback:" },
     { c: "    if the fine-tune's output fails schema validation," },
     { c: "    or confidence is low, call the frontier model instead.", hi: true },
     { c: "    -> the small model handles the 90% it is good at," },
     { c: "       the expensive one catches the tail, and the blended" },
     { c: "       quality is higher than either alone." }
    ],
    after: "That fallback pattern is worth more than a few points of model quality. It means you can ship a fine-tune that is imperfect on the hard cases without shipping a worse product, and it gives you a live measurement of exactly which cases the fine-tune cannot handle — which is your next training set." } },

  { tryit: { t: "Serve it, measure it, and cost it",
    task: "Merge your adapter, quantise the result to AWQ or GPTQ, and serve it with vLLM. Measure: single-stream tokens per second, maximum concurrency before latency degrades, and task quality before and after quantisation. Then compute the cost per request at your realistic utilisation and compare it against the API you would otherwise call. State which you would ship.",
    hint: "Measure concurrency by increasing load until p95 latency doubles. That point, not the theoretical maximum, is your real capacity.",
    sol: { lang: "bash", code: "# Load test at increasing concurrency\nfor c in 1 4 8 16 32 64 96; do\n  echo -n \"c=$c  \"\n  vllm bench serve --model models/invoice-8b-v3 \\\n    --dataset-name random --num-prompts 200 \\\n    --max-concurrency $c \\\n    --metric-percentiles 95 | grep -E 'Output token throughput|P95'\ndone\n\n# c=1    38 tok/s   p95  1.9s\n# c=8   240 tok/s   p95  2.4s\n# c=16  410 tok/s   p95  2.9s\n# c=32  680 tok/s   p95  4.1s\n# c=64  890 tok/s   p95  8.2s     <- p95 has doubled from c=16\n# c=96  910 tok/s   p95 17.4s     <- throughput flat, latency awful\n#\n# REAL CAPACITY: ~32 concurrent. Beyond that you are trading\n# user experience for a throughput number nobody experiences.\n\n# Quality after quantisation, on the same held-out set\n#   bf16    F1 0.891\n#   awq4    F1 0.885   (-0.006)   take it\n\n# --- The decision ---\n#\n#   traffic:            420,000 requests/month\n#   realistic capacity: 32 conc x 0.5 req/s x 30% util\n#                       = ~415,000/month on ONE GPU\n#\n#   self-hosted, 2x A10G for redundancy   Rs 146,000/mo\n#                                       = Rs 0.35/request\n#   small API model                      = Rs 0.05/request\n#\n#   SHIP THE API. Self-hosting costs 7x more at this volume\n#   and adds a service to operate.\n#\n#   The fine-tune was still worth doing -- but the right way\n#   to deploy it is a serverless GPU endpoint with scale-to-\n#   zero (Rs 0.09/request at this traffic, 40s cold start,\n#   acceptable for an async document pipeline).\n#\n#   I would revisit self-hosting above ~2M requests/month." },
    w: "This is the exercise that most changes how you talk about fine-tuning. Almost everyone who has trained a model assumes serving it themselves is the natural next step; running the numbers usually says otherwise until the volume is large. Being able to give that answer with a break-even figure attached is a genuinely senior thing to be able to do." } },

  { vocab: ["Quantisation", "LoRA", "Inference Endpoint", "Model Deployment", "Batch Inference", "Cost Per Token"] }
 ],
 k: [
  "Merge for a single high-throughput model; keep adapters when you serve several variants on one base.",
  "Merge into the original BF16 weights, never the quantised ones.",
  "AWQ 4-bit typically triples concurrency and doubles decode speed for a fraction of a point of quality.",
  "Self-hosting only beats an API above roughly 2–3 million steady requests a month; divide optimistic capacity by three for real utilisation.",
  "Ship behind a fallback: schema failure or low confidence routes to the frontier model, and the failures become your next training set."
 ],
 r: ["Quantisation", "LoRA", "Model Deployment", "Inference Endpoint", "Cost Per Token", "Shadow Deployment"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "model = PeftModel.from_pretrained(base_bf16, 'out/adapter').merge_and_unload()", w: "fold the adapter into the original full-precision weights" },
   { c: "vllm serve MODEL --enable-lora --lora-modules a=./adapters/a b=./adapters/b", w: "serve several adapters against one shared base" },
   { c: "--enable-prefix-caching --quantization awq --max-model-len 4096", w: "the three serving flags that decide throughput" }
  ]
 }
}

]);
