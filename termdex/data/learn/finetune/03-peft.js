/* Fine-Tuning & Model Adaptation — LoRA and QLoRA. */
TD.addLessons("finetune", [

{
 t: "LoRA, Properly Understood",
 m: "peft",
 lvl: "intermediate",
 s: "What a low-rank update is, why it adds no inference latency, and how to choose rank, alpha and targets.",
 goal: [
  "Explain the low-rank decomposition and why it captures most of the useful update",
  "Choose rank, alpha and target modules with reasons rather than defaults",
  "Say precisely why a merged LoRA is exactly as fast as the base model"
 ],
 b: [
  { p: "LoRA is the reason an individual can fine-tune a serious model at all. It is also one of the few ideas in this field that is genuinely simple once stated, and being able to state it clearly is a reliable interview win — because most candidates can name it and very few can explain why it works." },

  { h: "The idea" },
  { p: "Full fine-tuning updates every weight matrix $W$ by some $\\Delta W$ of the same shape. For a $4096 \\times 4096$ matrix that is 16.8 million numbers to learn, store and keep optimiser state for." },

  { code: { lang: "text", t: "The decomposition",
    lines: [
     { c: "  Full fine-tuning:" },
     { c: "      W' = W + dW          dW is 4096 x 4096 = 16.8M params" },
     { c: "" },
     { c: "  LoRA:" },
     { c: "      W' = W + BA          B is 4096 x r" },
     { c: "                           A is r x 4096" },
     { c: "" },
     { c: "      with r = 16:  4096x16 + 16x4096 = 131,072 params", hi: true },
     { c: "                    = 0.78% of the full update" },
     { c: "" },
     { c: "  W is FROZEN. Only A and B are trained." },
     { c: "" },
     { c: "  Initialisation matters:" },
     { c: "      A ~ small random     (Kaiming)" },
     { c: "      B = 0                so BA = 0 at step 0", hi: true },
     { c: "      -> training starts from exactly the base model," },
     { c: "         not from a randomly perturbed one" }
    ] } },

  { h: "Why it works" },
  { l: [
   "The empirical claim, from the LoRA paper: **the weight update needed to adapt a model to a downstream task has low intrinsic rank**. You are not teaching the model a new capability; you are steering one it already has, and steering is a low-dimensional operation.",
   "This is why LoRA works well for style, format and task specialisation, and less well for genuinely new knowledge — which is another way of arriving at the same *retrieval adds knowledge, tuning changes behaviour* distinction.",
   "It is also why LoRA quality approaches full fine-tuning on narrow tasks and falls behind on broad domain adaptation, where the required update genuinely is high-rank."
  ] },

  { h: "Zero inference latency, and why" },
  { code: { lang: "text", t: "The merge",
    lines: [
     { c: "  During training:" },
     { c: "      y = Wx + (alpha/r) * B(Ax)      two extra matmuls per layer" },
     { c: "" },
     { c: "  After training, merge:" },
     { c: "      W_merged = W + (alpha/r) * BA   computed ONCE, offline", hi: true },
     { c: "      y = W_merged x                  one matmul. Identical shape" },
     { c: "                                      to the base model." },
     { c: "" },
     { c: "  So a merged LoRA is EXACTLY as fast as the base model." },
     { c: "  Not nearly. Exactly -- it is the same computation on the", hi: true },
     { c: "  same tensor shapes." },
     { c: "" },
     { c: "  Contrast with adapter layers (the pre-LoRA approach), which" },
     { c: "  inserted extra modules that could not be merged away and so" },
     { c: "  cost latency forever. That is the problem LoRA solved." }
    ],
    after: "Keeping the adapter unmerged costs a small amount of latency and buys you the ability to serve many adapters against one shared base model — which is the other reason LoRA changed the economics. Both options exist; the serving lesson covers when to pick which." } },

  { h: "The hyperparameters that matter" },
  { code: { lang: "python", file: "lora_config.py", t: "A configuration, with reasons",
    lines: [
     { c: "from peft import LoraConfig", w: "" },
     { c: "", w: "" },
     { c: "config = LoraConfig(", w: "" },
     { c: "    r=16,", w: "**Rank.** 8–16 for style and format; 32–64 for a substantial task; 128+ rarely helps and starts to overfit. **Start at 16.**", hi: true },
     { c: "    lora_alpha=32,", w: "**Scaling.** The update is multiplied by `alpha/r`. The convention `alpha = 2r` gives a scale of 2 and is a sane default." },
     { c: "    lora_dropout=0.05,", w: "**Regularisation on the adapter.** 0.05–0.1 for small datasets, 0 for large ones." },
     { c: "    bias='none',", w: "**Do not train biases.** They add parameters and almost never help." },
     { c: "    task_type='CAUSAL_LM',", w: "" },
     { c: "    target_modules=[", w: "" },
     { c: "        'q_proj', 'k_proj', 'v_proj', 'o_proj',", w: "**Attention projections.** The original paper tuned only these." },
     { c: "        'gate_proj', 'up_proj', 'down_proj',", w: "**The feed-forward projections too.** Current practice: targeting all linear layers consistently outperforms attention-only, for a modest parameter increase.", hi: true },
     { c: "    ],", w: "" },
     { c: "    use_rslora=True,", w: "**Rank-stabilised LoRA.** Scales by `alpha/sqrt(r)` instead of `alpha/r`, which makes higher ranks behave sensibly. Free improvement — turn it on." },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "model = get_peft_model(base_model, config)", w: "" },
     { c: "model.print_trainable_parameters()", w: "**Always print this.** It is the fastest confirmation that your config did what you meant.", hi: true }
    ],
    out: "trainable params: 41,943,040 || all params: 8,072,204,288 || trainable%: 0.5196" } },

  { tbl: { t: "Rank, chosen from the task",
    h: ["r", "Params (8B, all linear)", "Use for"],
    rows: [
     ["**4–8**", "~10–20M", "Tone, a fixed output format, a small style shift"],
     ["**16–32**", "~40–80M", "**The default.** A task with a few thousand examples"],
     ["**64–128**", "~160–320M", "Substantial domain adaptation, large datasets"],
     ["**256+**", "~640M+", "Rarely justified — you are approaching full fine-tuning without its benefits"]
    ] } },

  { n: "**Alpha and rank interact, so do not tune both at once.** The effective scale is `alpha/r` (or `alpha/sqrt(r)` with rsLoRA). Doubling rank while keeping alpha fixed halves the scale, which people then misread as \"higher rank did not help\". Fix `alpha = 2r`, vary `r` alone, and the comparison means something.",
    nt: "The confusion worth avoiding" },

  { h: "The variants worth knowing by name" },
  { tbl: { t: "LoRA and its relatives",
    h: ["Variant", "What it changes", "When to reach for it"],
    rows: [
     ["**LoRA**", "The baseline", "Almost always"],
     ["**QLoRA**", "4-bit frozen base", "**When memory is the constraint.** Next lesson"],
     ["**rsLoRA**", "Scales by `alpha/√r`", "Always — it makes high rank usable"],
     ["**DoRA**", "Separates magnitude and direction", "Slightly better at low rank, slower to train"],
     ["**LoRA+**", "Higher learning rate for B than A", "Faster convergence, one extra parameter"],
     ["**PiSSA**", "Initialises from the base weights' principal components", "Faster early convergence"]
    ] } },

  { h: "Where LoRA falls short, honestly" },
  { l: [
   "**Learning genuinely new knowledge.** The low-rank constraint is exactly wrong for it. Use retrieval, or continued pre-training.",
   "**Broad multi-domain adaptation.** A model that must be better at law *and* medicine *and* code needs a high-rank update.",
   "**Very large datasets.** Past roughly 100k examples, full fine-tuning generally wins — you have enough data to justify updating everything.",
   "**Multiple stacked adapters.** Composing two LoRAs trained separately usually degrades both. Train one adapter on the combined data instead."
  ] },

  { tryit: { t: "Sweep rank and read the result properly",
    task: "Fine-tune the same small model on the same 2,000 examples at r = 4, 16, 64 and 128, keeping `alpha = 2r` throughout. Record trainable parameter count, peak memory, wall-clock time, final validation loss and task metric on a held-out set. Plot the metric against rank and identify where it stops improving.",
    hint: "Also run a general benchmark at each rank. The interesting finding is usually not where task performance peaks — it is where general capability starts falling.",
    sol: { lang: "text", code: "# 2,000 examples, Llama-3.1-8B, 3 epochs, alpha = 2r\n\n  r    params    peak GB   time    val loss   task F1   MMLU\n  ---  --------  -------  ------  ---------  --------  ------\n  base       -        -       -          -     0.612   0.681\n    4     10.5M     14.2    22m      0.841     0.847   0.679\n   16     41.9M     14.8    24m      0.798     0.881   0.676\n   64    167.8M     16.1    29m      0.771     0.886   0.663\n  128    335.5M     17.9    36m      0.744     0.884   0.641   <--\n\n# Read this carefully:\n#\n# 1. Task F1 plateaus at r=16. r=64 buys 0.005 for 4x the\n#    parameters; r=128 is WORSE on task and much worse on\n#    general capability.\n#\n# 2. Validation loss keeps falling all the way to r=128 while\n#    task F1 does not. Loss is measuring fit to the training\n#    distribution, not usefulness. This is the single most\n#    important thing to take from the sweep.\n#\n# 3. MMLU drops 4 points at r=128. That is catastrophic\n#    forgetting, and it is invisible if you only look at the\n#    task metric -- which is what most people do.\n#\n# CHOICE: r = 16. Best task performance, least forgetting,\n#         fastest, smallest adapter to ship.\n#\n# The general lesson: a falling loss curve is not evidence\n# that the model got better at anything you care about." },
    w: "The divergence between validation loss and task metric is the finding worth internalising, and it recurs everywhere in this field. If you can say in an interview \"loss kept improving while the task metric plateaued and MMLU fell, so I picked the smaller rank\", you have demonstrated the exact judgement the question about hyperparameters is really testing." } },

  { vocab: ["LoRA", "QLoRA", "Fine-Tuning", "Hyperparameter", "Catastrophic Forgetting", "Overfitting"] }
 ],
 k: [
  "LoRA learns a low-rank update B·A while the base weights stay frozen; B starts at zero so training begins exactly at the base model.",
  "A merged LoRA is exactly as fast as the base model — same computation, same shapes — which is what adapter layers could not do.",
  "Target all linear layers, not just attention; r = 16 with alpha = 32 is the default worth starting from.",
  "Alpha and rank interact through alpha/r, so vary one at a time or your comparison is meaningless.",
  "Falling validation loss is not evidence of a better model; check the task metric and a general benchmark too."
 ],
 r: ["LoRA", "QLoRA", "Fine-Tuning", "Transfer Learning", "Hyperparameter", "Catastrophic Forgetting"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "LoraConfig(r=16, lora_alpha=32, target_modules=['q_proj','k_proj','v_proj','o_proj','gate_proj','up_proj','down_proj'])", w: "the default adapter configuration, targeting all linear layers" },
   { c: "model.print_trainable_parameters()", w: "confirm the config trains what you intended" },
   { c: "W_merged = W + (alpha/r) * B @ A", w: "the merge that makes inference cost exactly nothing extra" }
  ]
 }
},

{
 t: "QLoRA and the Memory Budget",
 m: "peft",
 lvl: "intermediate",
 s: "Four-bit base weights, the arithmetic that tells you whether it fits, and the levers when it does not.",
 goal: [
  "Compute the memory a fine-tuning run needs before renting anything",
  "Configure QLoRA correctly, including the details that quietly cost quality",
  "Apply the memory levers in the right order when you run out"
 ],
 b: [
  { p: "The question that decides your whole plan is *will this fit on the GPU I can afford*. It is arithmetic, it takes two minutes, and doing it before renting hardware rather than after is the difference between a productive evening and a wasted one." },

  { h: "The arithmetic" },
  { code: { lang: "text", t: "Four terms, always the same four",
    lines: [
     { c: "  For P parameters, mixed precision, Adam:" },
     { c: "" },
     { c: "    BF16 weights          2 bytes/param" },
     { c: "    BF16 gradients        2 bytes/param" },
     { c: "    FP32 master weights   4 bytes/param" },
     { c: "    Adam m                4 bytes/param" },
     { c: "    Adam v                4 bytes/param" },
     { c: "    ------------------------------------" },
     { c: "    FULL FINE-TUNE       16 bytes/param   + activations", hi: true },
     { c: "" },
     { c: "  8B model:  8e9 x 16 = 128 GB, before activations." },
     { c: "             Needs 2x A100-80. Not happening on a rented A10G." },
     { c: "" },
     { c: "  LoRA -- only the adapter has gradients and optimiser state:" },
     { c: "" },
     { c: "    BF16 frozen base      2 bytes/param       16 GB" },
     { c: "    adapter + its Adam    ~16 bytes/adapter    0.7 GB" },
     { c: "    activations (ckpt)                        ~4 GB" },
     { c: "    ------------------------------------------------" },
     { c: "                                             ~21 GB   tight on 24", hi: true },
     { c: "" },
     { c: "  QLoRA -- quantise the frozen base to 4-bit NF4:" },
     { c: "" },
     { c: "    NF4 frozen base       0.5 bytes/param      4.5 GB", hi: true },
     { c: "    adapter + its Adam                         0.7 GB" },
     { c: "    activations (ckpt)                        ~4 GB" },
     { c: "    dequant + fragmentation                   ~1.5 GB" },
     { c: "    ------------------------------------------------" },
     { c: "                                             ~11 GB   comfortable", hi: true },
     { c: "" },
     { c: "  So: 8B QLoRA fits on a 16 GB card, and runs happily on 24." }
    ] } },

  { n: "Three numbers worth memorising, because they answer most hardware questions in seconds:\n\n**Full fine-tune ≈ 16 bytes per parameter. LoRA ≈ 2.1. QLoRA ≈ 0.6.** All plus activations.",
    nt: "The shortcut" },

  { h: "What NF4 actually is" },
  { l: [
   "**NormalFloat4** is a 4-bit datatype whose 16 representable values are placed at the quantiles of a normal distribution — because neural network weights are approximately normally distributed. It is information-theoretically optimal for that distribution, which is why it beats naive INT4.",
   "**Double quantisation** quantises the quantisation constants themselves, saving roughly another 0.4 bits per parameter. Small, free, on by default.",
   "**Paged optimisers** use NVIDIA unified memory to page optimiser state to CPU RAM during memory spikes, so a long sequence does not kill the run outright. Turn it on.",
   "**The base weights stay frozen and quantised.** They are dequantised to BF16 on the fly for each matmul and discarded. The adapter is trained in BF16 throughout — quantisation never touches the thing being learned."
  ] },

  { code: { lang: "python", file: "qlora.py", t: "The configuration, with the details that matter",
    lines: [
     { c: "import torch", w: "" },
     { c: "from transformers import AutoModelForCausalLM, BitsAndBytesConfig", w: "" },
     { c: "from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training", w: "" },
     { c: "", w: "" },
     { c: "bnb = BitsAndBytesConfig(", w: "" },
     { c: "    load_in_4bit=True,", w: "" },
     { c: "    bnb_4bit_quant_type='nf4',", w: "**`nf4`, not `fp4`.** Measurably better for weights, same cost.", hi: true },
     { c: "    bnb_4bit_use_double_quant=True,", w: "**Another ~0.4 bits per parameter saved.** No downside." },
     { c: "    bnb_4bit_compute_dtype=torch.bfloat16,", w: "**The dtype used for the actual matmuls after dequantisation.** Leaving this at float32 silently doubles compute time — a very common misconfiguration.", hi: true },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "model = AutoModelForCausalLM.from_pretrained(", w: "" },
     { c: "    BASE, quantization_config=bnb,", w: "" },
     { c: "    attn_implementation='flash_attention_2',", w: "**Always, if the hardware supports it.** Removes the O(n²) attention matrix from memory entirely." },
     { c: "    device_map={'': 0},", w: "**Pin to one GPU.** `device_map='auto'` can silently offload layers to CPU and make training twenty times slower while appearing to work.", hi: true },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "model = prepare_model_for_kbit_training(", w: "**Required for 4-bit training.** It casts layer norms to FP32, enables gradient checkpointing and makes inputs require grad." },
     { c: "    model, use_gradient_checkpointing=True)", w: "" },
     { c: "model.config.use_cache = False", w: "**Must be off during training.** The KV cache and gradient checkpointing conflict, and leaving it on wastes memory and prints a warning people ignore." },
     { c: "", w: "" },
     { c: "model = get_peft_model(model, LoraConfig(r=16, lora_alpha=32, ...))", w: "" },
     { c: "model.print_trainable_parameters()", w: "" }
    ] } },

  { h: "What QLoRA costs" },
  { tbl: { t: "The honest trade",
    h: ["", "LoRA (BF16 base)", "QLoRA (NF4 base)"],
    rows: [
     ["Memory, 8B", "~21 GB", "**~11 GB**"],
     ["Training speed", "Baseline", "**~30–40% slower** (dequantisation per matmul)"],
     ["Final quality", "Baseline", "Within ~1%, usually indistinguishable"],
     ["Largest model on 24 GB", "~8B", "**~34B**"],
     ["Merging", "Straightforward", "**Merge into the BF16 base, not the quantised one**"]
    ] } },

  { trap: "Never merge a LoRA adapter into the 4-bit quantised weights. Quantise, train, then load the **original BF16 base** and merge the adapter into that — otherwise you bake the quantisation error permanently into the model and lose quality for no reason. This is a genuinely common mistake and it produces a model that is quietly worse than the adapter it came from." },

  { h: "Out of memory: the levers, in order" },
  { ol: [
   "**Gradient checkpointing on.** The single biggest activation saving, ~30% more compute. Should already be on.",
   "**Reduce batch size to 1, raise gradient accumulation.** `per_device_batch=1, grad_accum=16` has the same effective batch as `batch=16` at a fraction of the memory. Almost free.",
   "**Shorter sequences.** Activation memory scales with sequence length. Check your actual length distribution — people commonly set 4096 when the 99th percentile is 900.",
   "**Flash Attention 2.** Removes the O(n²) attention matrix. Should already be on.",
   "**8-bit optimiser** (`optim='paged_adamw_8bit'`). Halves optimiser state; negligible quality effect.",
   "**Lower rank.** r=64 → r=16 is a real saving and often no quality loss at all.",
   "**Fewer target modules.** Attention-only rather than all-linear. A real quality cost — this is a later resort.",
   "**A smaller base model.** Frequently the right answer, and the one people resist longest."
  ] },

  { code: { lang: "bash", t: "Diagnosing an OOM properly",
    lines: [
     { c: "nvidia-smi --query-gpu=memory.used,memory.total --format=csv -l 5", w: "**Watch it during the run.** OOM at step 400 rather than step 1 means a long sequence, not a configuration error.", hi: true },
     { c: "", w: "" },
     { c: "# In Python, find where it actually went:", w: "" },
     { c: "python -c \"import torch; print(torch.cuda.memory_summary())\"", w: "" },
     { c: "", w: "" },
     { c: "# Fragmentation, which looks like OOM with free memory available:", w: "" },
     { c: "export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True", w: "**Often fixes an OOM that makes no sense**, where nvidia-smi shows gigabytes free.", hi: true },
     { c: "", w: "" },
     { c: "# Check your sequence lengths BEFORE setting max_length:", w: "" },
     { c: "# np.percentile([len(tok(x)['input_ids']) for x in data], [50, 95, 99])", w: "**Set max_length from the data.** Setting 4096 when p99 is 900 wastes most of your activation memory on padding." }
    ] } },

  { tryit: { t: "Predict the memory, then measure it",
    task: "Before running anything, compute on paper the peak memory for a QLoRA run: 8B model, r=16 on all linear layers, batch size 2, sequence length 2048, gradient checkpointing on. Then run it and compare your prediction against `torch.cuda.max_memory_allocated()`. Then deliberately cause an OOM by raising the sequence length, and fix it with each lever in turn, recording the memory saved by each.",
    hint: "Your prediction will probably be low. The gap is fragmentation, the CUDA context (~0.5 GB) and dequantisation buffers — worth knowing so you leave headroom rather than sizing to the exact number.",
    sol: { lang: "text", code: "# PREDICTED\n#   NF4 base 8B x 0.5                     4.0 GB\n#   quantisation constants                0.3 GB\n#   adapter 42M x 2 (bf16)                0.08 GB\n#   adapter grads + Adam 42M x 12         0.5 GB\n#   activations, ckpt, b=2 s=2048        ~3.5 GB\n#   ------------------------------------------\n#   predicted                            ~8.4 GB\n\n# MEASURED\n#   torch.cuda.max_memory_allocated()    10.9 GB\n#   nvidia-smi (includes CUDA context)   12.4 GB\n#\n#   Gap: ~2.5 GB of context, fragmentation and dequant\n#   buffers. RULE OF THUMB: add 25% to your estimate.\n\n# --- LEVERS, measured on the same run ---\n#\n#   baseline (b=2, s=2048, ckpt on)          10.9 GB   24 min\n#   s=4096                                    OOM\n#     + b=1, grad_accum=4                    12.1 GB   26 min\n#     + paged_adamw_8bit                     11.8 GB   26 min\n#     + r=16 -> r=8                          11.6 GB   25 min\n#     + attention-only targets               10.9 GB   22 min   <- F1 -1.8\n#   ckpt OFF (b=2, s=2048)                    19.4 GB   17 min\n#\n# Findings worth keeping:\n#   - gradient checkpointing saves 8.5 GB for 7 minutes. Always on.\n#   - batch 1 + accumulation is nearly free and should be the\n#     first thing you reach for.\n#   - narrowing target modules is the only lever here that cost\n#     real quality, which is why it is last on the list.\n#\n#   And: p99 of my actual sequence lengths was 1,180. Setting\n#   s=2048 instead of 4096 was correct anyway, and I only knew\n#   that because I measured the data first." },
    w: "Predicting memory before renting a GPU is a small habit with a large payoff — it stops you paying for an A100 when an A10G would do, and it stops you booking an A10G for a job that will never fit. It is also the kind of specific arithmetic that goes down very well in an interview, because it demonstrates you have actually run these jobs rather than read about them." } },

  { vocab: ["QLoRA", "Quantisation", "LoRA", "Batch Size", "Checkpoint", "Gradient"] }
 ],
 k: [
  "Full fine-tune ≈ 16 bytes/param, LoRA ≈ 2.1, QLoRA ≈ 0.6 — plus activations, plus 25% headroom.",
  "Set `bnb_4bit_compute_dtype=torch.bfloat16` or you silently train in FP32 at half the speed.",
  "Pin `device_map={'': 0}`; 'auto' can offload to CPU and make training twenty times slower without erroring.",
  "Merge the adapter into the original BF16 base, never into the quantised weights.",
  "Batch size 1 with gradient accumulation is the cheapest memory lever; narrowing target modules is the one that costs quality."
 ],
 r: ["QLoRA", "Quantisation", "LoRA", "Batch Size", "Gradient", "Checkpoint"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type='nf4', bnb_4bit_compute_dtype=torch.bfloat16)", w: "quantise the frozen base correctly, with the right compute dtype" },
   { c: "model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)", w: "make a 4-bit model trainable" },
   { c: "per_device_train_batch_size=1, gradient_accumulation_steps=16", w: "the same effective batch at a fraction of the memory" },
   { c: "export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True", w: "fix an OOM that happens with memory apparently free" }
  ]
 }
}

]);
