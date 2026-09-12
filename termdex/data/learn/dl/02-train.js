/* Deep Learning — how training actually works. */
TD.addLessons("dl", [

{
 t: "Loss Functions, Optimisers and Learning Rates",
 m: "train",
 lvl: "core",
 s: "The three settings that decide whether training works, and how to read a loss curve.",
 goal: [
  "Choose the right loss function for a task and know what it punishes",
  "Explain what Adam does that plain gradient descent does not",
  "Diagnose a training run from the shape of its loss curve"
 ],
 b: [
  { p: "Training has three dials that matter: what you are minimising, how you step, and how big the steps are. Almost every failed training run is one of these three, and almost every one is diagnosable from the loss curve alone." },

  { h: "The loss function is the task definition" },
  { p: "The loss is what the model optimises, which means it is the *actual* specification of what you want — not your intention, not the docstring, the loss. Choose it carelessly and the model will faithfully optimise the wrong thing." },

  { tbl: { t: "The losses you will use",
    h: ["Task", "Loss", "In PyTorch", "What it punishes"],
    rows: [
     ["**Binary classification**", "Binary cross-entropy", "`BCEWithLogitsLoss`", "Confident wrong answers, extremely heavily"],
     ["**Multi-class**", "Cross-entropy", "`CrossEntropyLoss`", "Same. **Takes raw logits — do not apply softmax first**"],
     ["**Regression**", "MSE", "`MSELoss`", "Large errors, quadratically. Sensitive to outliers"],
     ["**Regression, robust**", "MAE / Huber", "`L1Loss` / `HuberLoss`", "Errors linearly. **Use when outliers are real data, not noise**"],
     ["**Embeddings**", "Contrastive / InfoNCE", "custom", "Similar things being far apart, and vice versa"],
     ["**Ranking**", "Pairwise / listwise", "custom", "Getting the order wrong, not the score"]
    ] } },

  { trap: "`nn.CrossEntropyLoss` in PyTorch applies log-softmax internally. Applying softmax yourself before passing to it is a classic bug — the model still trains, just badly, and the loss curve looks vaguely plausible while accuracy stalls. The rule: `CrossEntropyLoss` and `BCEWithLogitsLoss` both take **raw logits**. Sigmoid and softmax belong at inference time, not before the loss." },

  { n: "The loss is your real specification. If the business cares about ranking and you train on MSE, the model optimises absolute values and may rank badly while scoring well. If false negatives cost ten times false positives, weight the loss accordingly — `pos_weight` in `BCEWithLogitsLoss` exists for exactly this. Encoding the asymmetry in the loss is far more effective than trying to fix it with a threshold afterwards.",
    nt: "Say what you actually want" },

  { h: "Optimisers" },
  { p: "Plain gradient descent takes the same size step in every direction. Real loss landscapes are not like that — some directions are steep ravines and others are long flat plains — so modern optimisers adapt." },

  { tbl: { t: "Three optimisers and what each adds",
    h: ["Optimiser", "Adds", "Use it when"],
    rows: [
     ["**SGD**", "Nothing. Step opposite the gradient", "Rarely alone — it is slow and gets stuck in ravines"],
     ["**SGD + momentum**", "**Velocity.** Keeps moving in a consistent direction, damping oscillation", "Vision models. Often generalises slightly better than Adam"],
     ["**Adam / AdamW**", "**Per-parameter learning rates**, from the running average and variance of each gradient", "**The default for everything else, and always for transformers**"]
    ] } },

  { ana: "SGD is walking downhill with a fixed stride. In a narrow ravine you bounce off the walls and make almost no forward progress. Momentum is a heavy ball — it smooths the bouncing and carries you along the ravine floor. Adam goes further and gives every direction its own stride length, so parameters with tiny gradients still move and parameters with huge ones do not overshoot.",
    at: "The ball in the ravine" },

  { code: { lang: "python", t: "In practice",
    lines: [
     { c: "import torch", w: "" },
     { c: "", w: "" },
     { c: "opt = torch.optim.AdamW(model.parameters(),", w: "**AdamW, not Adam.** It handles weight decay correctly; Adam's version is subtly wrong and AdamW is the current default everywhere.", hi: true },
     { c: "                        lr=3e-4,", w: "**3e-4 is the standard starting point for transformers.** For fine-tuning, an order of magnitude lower — 1e-5 to 5e-5." },
     { c: "                        weight_decay=0.01)", w: "L2 regularisation, applied as a separate shrinkage step." },
     { c: "", w: "" },
     { c: "sched = torch.optim.lr_scheduler.OneCycleLR(", w: "" },
     { c: "    opt, max_lr=3e-4, total_steps=len(loader)*epochs)", w: "**Warm up, then decay.** Warmup matters enormously for transformers — early gradients are enormous and a full-rate first step can destroy the model in one update.", hi: true }
    ] } },

  { h: "The learning rate, found rather than guessed" },
  { p: "You do not have to guess. Sweep it upward over a couple of hundred batches and plot the loss; the answer is visible." },

  { code: { lang: "python", t: "The learning rate range test",
    lines: [
     { c: "lrs, losses = [], []", w: "" },
     { c: "lr = 1e-7", w: "" },
     { c: "for batch in loader:", w: "" },
     { c: "    for g in opt.param_groups: g['lr'] = lr", w: "" },
     { c: "    loss = train_one_batch(batch)", w: "" },
     { c: "    lrs.append(lr); losses.append(loss)", w: "" },
     { c: "    lr *= 1.1", w: "**Multiply by 1.1 each batch** — a geometric sweep across many orders of magnitude in a couple of hundred steps.", hi: true },
     { c: "    if loss > 4 * min(losses): break", w: "Stop once it clearly diverges." },
     { c: "", w: "" },
     { c: "plt.semilogx(lrs, losses)", w: "**Pick roughly one order of magnitude below the minimum** — the steepest descent, not the lowest point.", hi: true }
    ],
    after: "The curve is flat, then descends steeply, then explodes. The good learning rate is on the steep part, about ten times below where it bottoms out. Ten minutes, and it replaces a day of guessing." } },

  { h: "Reading a loss curve" },
  { tbl: { t: "The shapes, and what each means",
    h: ["Shape", "Diagnosis", "Fix"],
    rows: [
     ["**NaN within a few steps**", "Learning rate far too high, or `log(0)` in the loss", "Divide LR by 10. Check for zeros and clip"],
     ["**Flat from step zero**", "Nothing is connected", "Check `zero_grad`, check gradients are not None, check the optimiser got the parameters"],
     ["**Bouncing, no downward trend**", "LR too high", "Divide by 3"],
     ["**Falling extremely slowly**", "LR too low", "Multiply by 3–10"],
     ["**Falls then rises**", "LR too high for the flatter later landscape", "Add a decay schedule"],
     ["**Falls, then plateaus high**", "Underfitting, or vanishing gradients", "Bigger model, better features, check gradient norms per layer"],
     ["**Train falls, validation rises**", "**Overfitting**", "Regularisation, more data, early stopping"],
     ["**Sudden spike, then recovery**", "One bad batch — a corrupt example or an outlier", "Gradient clipping. Then go and find the batch"]
    ] } },

  { code: { lang: "python", t: "The instrumentation worth having from day one",
    lines: [
     { c: "for epoch in range(epochs):", w: "" },
     { c: "    model.train()", w: "**Turns dropout and batchnorm into training mode.** Forgetting this is a classic silent bug." },
     { c: "    for X, y in train_loader:", w: "" },
     { c: "        opt.zero_grad()", w: "**Clear last step's gradients.** PyTorch accumulates by default." },
     { c: "        loss = criterion(model(X), y)", w: "" },
     { c: "        loss.backward()", w: "" },
     { c: "", w: "" },
     { c: "        gn = torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)", w: "**Clips, and returns the norm before clipping.** Log it — a spiking gradient norm is the earliest possible warning.", hi: true },
     { c: "        opt.step(); sched.step()", w: "" },
     { c: "", w: "" },
     { c: "    model.eval()", w: "**Dropout off, batchnorm uses running statistics.**", hi: true },
     { c: "    with torch.no_grad():", w: "**No gradient tracking during evaluation** — faster and far less memory." },
     { c: "        val = sum(criterion(model(X), y).item() for X, y in val_loader)", w: "" },
     { c: "    print(f'epoch {epoch}  train {loss.item():.4f}  val {val/len(val_loader):.4f}  gnorm {gn:.2f}')", w: "" }
    ] } },

  { h: "Batch size" },
  { l: [
   "**Large batches** — better hardware use, less gradient noise, faster wall-clock epochs. Also more memory, and sometimes slightly worse generalisation.",
   "**Small batches** — noisier gradients, which acts as regularisation and can help escape poor minima. Slower per epoch.",
   "**The practical rule**: use the largest batch that fits in memory, and scale the learning rate roughly with it. Doubling the batch size usually means you can raise the learning rate.",
   "**Gradient accumulation** simulates a large batch on small hardware: run several batches, sum the gradients, step once. This is how people fine-tune large models on a single consumer GPU."
  ] },

  { code: { lang: "python", t: "Gradient accumulation",
    lines: [
     { c: "accum = 8", w: "**Effective batch size = actual batch × 8.**" },
     { c: "opt.zero_grad()", w: "" },
     { c: "for i, (X, y) in enumerate(loader):", w: "" },
     { c: "    loss = criterion(model(X), y) / accum", w: "**Divide the loss**, so the summed gradients average correctly.", hi: true },
     { c: "    loss.backward()", w: "Accumulates. Here the default behaviour is exactly what you want." },
     { c: "    if (i + 1) % accum == 0:", w: "" },
     { c: "        opt.step(); opt.zero_grad()", w: "**Step once every 8 batches.**" }
    ] } },

  { tryit: { t: "Produce every failure deliberately",
    task: "Train a small network on any dataset four times, changing only the learning rate: 1e-6, 1e-3, 1e-1, and 10. Record the loss each epoch and plot all four. Name the failure mode in each.",
    hint: "Use the same seed and the same data every time so the learning rate is the only difference.",
    sol: { lang: "python", code: "import torch, torch.nn as nn\n\ndef run(lr, epochs=30):\n    torch.manual_seed(0)\n    model = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 1))\n    opt = torch.optim.AdamW(model.parameters(), lr=lr)\n    crit = nn.BCEWithLogitsLoss()\n    hist = []\n    for _ in range(epochs):\n        opt.zero_grad()\n        loss = crit(model(X).squeeze(), y)\n        loss.backward(); opt.step()\n        hist.append(loss.item())\n    return hist\n\nfor lr in [1e-6, 1e-3, 1e-1, 10.0]:\n    h = run(lr)\n    print(f'lr={lr:<8} first={h[0]:.4f}  last={h[-1]:.4f}  '\n          f'{\"NaN\" if h[-1] != h[-1] else \"\"}')" },
    w: "At 1e-6 the loss barely moves — it would get there in about a week. At 1e-3 it descends smoothly, which is what healthy looks like. At 1e-1 it oscillates and may or may not converge. At 10 it is NaN within a few steps. Having produced all four deliberately, you will recognise them instantly the next time one appears in real work — and that recognition is worth days." } },

  { vocab: ["Loss Function", "Cross-Entropy", "Adam Optimiser", "Stochastic Gradient Descent", "Learning Rate", "Gradient Clipping"] }
 ],
 k: [
  "The loss is your real specification — encode asymmetric costs there, not in a threshold afterwards.",
  "`CrossEntropyLoss` and `BCEWithLogitsLoss` take raw logits; applying softmax first is a silent bug.",
  "AdamW at 3e-4 with warmup is the default for transformers; 1e-5 to 5e-5 for fine-tuning.",
  "Find the learning rate with a range test instead of guessing — it takes ten minutes.",
  "Log the gradient norm every step; a spike is the earliest warning you will get."
 ],
 r: ["Loss Function", "Cross-Entropy", "Adam Optimiser", "Stochastic Gradient Descent", "Gradient Clipping", "Backpropagation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)", w: "the default optimiser and learning rate" },
   { c: "opt.zero_grad()", w: "clear gradients — PyTorch accumulates by default" },
   { c: "torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)", w: "clip, and return the norm so you can log it" },
   { c: "model.train() / model.eval()", w: "switch dropout and batchnorm behaviour" },
   { c: "with torch.no_grad():", w: "evaluation without building a gradient graph" }
  ]
 }
}

]);
