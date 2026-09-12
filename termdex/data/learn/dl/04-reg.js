/* Deep Learning — making it generalise. */
TD.addLessons("dl", [

{
 t: "Dropout, Normalisation and the Rest of the Toolkit",
 m: "reg",
 lvl: "core",
 s: "Six techniques, what each actually does, and how to pick the one your model needs.",
 goal: [
  "Explain what dropout does at train time and at inference",
  "Choose between batch and layer normalisation and say why transformers use one",
  "Diagnose which regularisation your training run is asking for"
 ],
 b: [
  { p: "A large neural network can memorise its training set. Every technique here exists to stop it, and they work in genuinely different ways — so picking by diagnosis rather than by habit is worth real accuracy." },

  { h: "Dropout" },
  { p: "During training, randomly set a fraction of activations to zero. Different neurons are dropped in every batch." },

  { code: { lang: "python", t: "What actually happens",
    lines: [
     { c: "drop = nn.Dropout(p=0.2)", w: "20% of activations zeroed." },
     { c: "", w: "" },
     { c: "drop.train()", w: "" },
     { c: "drop(torch.ones(10))", w: "**Note the 1.25.** PyTorch scales the survivors by 1/(1-p) so the expected sum is unchanged. This is *inverted dropout*, and it is why nothing special happens at inference.", hi: true },
     { c: "", w: "" },
     { c: "drop.eval()", w: "" },
     { c: "drop(torch.ones(10))", w: "**All ones.** Dropout is a no-op in eval mode — the full network is used." }
    ],
    out: "tensor([1.25, 0.00, 1.25, 1.25, 0.00, 1.25, 1.25, 1.25, 1.25, 0.00])\ntensor([1., 1., 1., 1., 1., 1., 1., 1., 1., 1.])" } },

  { ana: "A team where a random fifth of people are absent each day. Nobody can become the single indispensable expert, because they might not be there — so knowledge spreads and the team becomes robust. That redundancy is what stops the network relying on one fragile co-adapted pathway.",
    at: "The team with random absences" },

  { l: [
   "**Where to put it**: after activations in fully-connected layers. Rarely in convolutional layers, where spatial dropout variants work better.",
   "**How much**: 0.1–0.3 for most networks; 0.5 was the classic value for large dense layers and is aggressive by modern standards.",
   "**In transformers**: 0.1 is near-universal, applied after attention and after the feed-forward block.",
   "**Forgetting `model.eval()`** means dropout stays active during evaluation, so your validation scores are noisy and pessimistic. This is one of the most common bugs in the field."
  ] },

  { h: "Normalisation" },
  { p: "Normalisation rescales activations so each layer receives inputs in a predictable range. It speeds training dramatically and has a mild regularising effect as a side benefit." },

  { tbl: { t: "Batch against layer normalisation",
    h: ["", "BatchNorm", "LayerNorm"],
    rows: [
     ["**Normalises across**", "The batch, per feature", "The features, per example"],
     ["**Depends on batch size?**", "**Yes.** Unstable with small batches, broken at batch size 1", "**No.** Each example is independent"],
     ["**Train and eval differ?**", "**Yes** — eval uses running statistics gathered during training", "No. Identical behaviour"],
     ["**Works on variable-length sequences?**", "Badly", "**Yes**, which is the point"],
     ["**Used in**", "CNNs, vision", "**Every transformer**, and all NLP"]
    ] } },

  { n: "This is why transformers use LayerNorm. Text batches have variable-length sequences with padding, so batch statistics are contaminated by padding tokens — and at inference you often process one sequence at a time, where batch statistics are meaningless. LayerNorm sidesteps all of it by normalising within each example.",
    nt: "Why the choice is not arbitrary" },

  { code: { lang: "python", t: "Both, and the pre-norm convention",
    lines: [
     { c: "nn.BatchNorm1d(128)", w: "Tabular or 1-D. `BatchNorm2d` for images." },
     { c: "nn.LayerNorm(768)", w: "**The dimension being normalised over** — the model width in a transformer." },
     { c: "", w: "" },
     { c: "# post-norm (original transformer, 2017)", w: "" },
     { c: "x = norm(x + attention(x))", w: "Normalise after the residual. Trains poorly beyond about 12 layers without careful warmup." },
     { c: "", w: "" },
     { c: "# pre-norm (everything modern)", w: "" },
     { c: "x = x + attention(norm(x))", w: "**Normalise before the sublayer.** The residual path stays clean, so gradients flow straight through — this is what made very deep transformers trainable.", hi: true }
    ] } },

  { h: "Weight decay" },
  { code: { lang: "python",
    lines: [
     { c: "opt = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)", w: "**Shrink every weight slightly on each step.** Large weights need justification from the data to survive.", hi: true },
     { c: "", w: "" },
     { c: "# do NOT decay biases and norm parameters", w: "" },
     { c: "decay     = [p for n,p in model.named_parameters() if p.dim() >= 2]", w: "Weight matrices." },
     { c: "no_decay  = [p for n,p in model.named_parameters() if p.dim() <  2]", w: "**Biases and LayerNorm scales.** Decaying them hurts, and every serious training script separates these two groups.", hi: true },
     { c: "opt = torch.optim.AdamW([", w: "" },
     { c: "    {'params': decay,    'weight_decay': 0.01},", w: "" },
     { c: "    {'params': no_decay, 'weight_decay': 0.0}], lr=3e-4)", w: "" }
    ] } },

  { h: "Data augmentation" },
  { p: "The most effective regulariser available, because it genuinely adds information about what should not change the answer." },

  { tbl: { t: "By modality",
    h: ["Data", "Augmentations", "Note"],
    rows: [
     ["**Images**", "Flip, crop, rotate, colour jitter, RandAugment, MixUp, CutMix", "**Enormously effective.** Often worth more than any architecture change"],
     ["**Text**", "Back-translation, synonym swap, LLM paraphrase", "Riskier — small edits can flip the meaning and therefore the label"],
     ["**Audio**", "Time stretch, pitch shift, background noise, SpecAugment", "Very effective, mirrors real acoustic variation"],
     ["**Tabular**", "SMOTE, noise injection", "**Usually disappointing.** There is no natural invariance to exploit"]
    ] } },

  { trap: "Augment training data only, never validation or test. Augmenting the validation set makes your scores incomparable across runs and usually pessimistic. In PyTorch this means two separate transform pipelines — one for the training dataset and a plain one for validation — and mixing them up is a common mistake in tutorial code." },

  { h: "Early stopping" },
  { p: "Watch validation loss, stop when it stops improving, keep the best checkpoint. Free, effective, and it saves compute — which is why it is in the training loop from the previous module." },

  { h: "Diagnosing which one you need" },
  { tbl: { t: "Match the symptom to the remedy",
    h: ["Symptom", "Likely cause", "Try, in order"],
    rows: [
     ["Train 0.99, val 0.72", "Classic overfitting", "**More data or augmentation** → dropout → weight decay → smaller model"],
     ["Both poor, close together", "Underfitting", "**Remove** regularisation, go bigger, train longer"],
     ["Loss unstable, spiky", "Bad conditioning", "Add normalisation, clip gradients, lower the learning rate"],
     ["Val loss falls then rises", "Overfitting from a specific epoch", "**Early stopping.** The best model already happened"],
     ["Val loss noisy between epochs", "Validation set too small, or eval mode not set", "Check `model.eval()` first, then enlarge the validation set"],
     ["Great on your data, poor in production", "Not overfitting — **distribution shift**", "No regulariser fixes this. Change the training data"]
    ] } },

  { n: "That last row matters. Regularisation addresses overfitting to your training *sample*. It does nothing about your training set being unrepresentative of production. If your model is excellent offline and mediocre live, adding dropout is treating the wrong disease — go and look at what production actually sends.",
    nt: "The one regularisation cannot fix" },

  { h: "The order to try things" },
  { ol: [
   "**More data.** Always first if it is obtainable. Nothing else comes close.",
   "**Augmentation**, if the modality supports it. Nearly free and often large.",
   "**Early stopping.** Free, and you should have it regardless.",
   "**Weight decay** at 0.01, correctly excluding biases and norms.",
   "**Dropout** at 0.1–0.3.",
   "**A smaller model.** Last, because it lowers the ceiling as well as the variance — though it is worth trying early if the model is obviously oversized for the data."
  ] },

  { tryit: { t: "Overfit deliberately, then fix it",
    task: "Take a small dataset — a few hundred rows. Train a deliberately oversized network with no regularisation until training accuracy hits 100% and validation clearly declines. Then add, one at a time: early stopping, dropout, weight decay, augmentation if applicable. Record validation accuracy after each.",
    hint: "To force overfitting quickly, use a wide network — say 512 hidden units — on 200 rows with no dropout.",
    sol: { lang: "python", code: "# A representative run on 300 rows, 20 features:\n#\n#   config                          train    val\n#   ------------------------------------------------\n#   512-512, no regularisation      1.000   0.703\n#   + early stopping                0.921   0.746\n#   + dropout 0.3                   0.874   0.771\n#   + weight decay 0.01             0.861   0.783\n#   + smaller (128-64)              0.848   0.798\n#\n# Note the direction of travel: TRAINING accuracy falls at\n# every step, and validation rises. That is what working\n# regularisation looks like, and it is why a falling training\n# score is not automatically bad news." },
    w: "The pattern is the lesson: each technique lowers training accuracy and raises validation accuracy. If you add dropout and training accuracy does not fall, it is not doing anything — check you are in `model.train()` mode and that dropout is actually in the forward path." } },

  { vocab: ["Dropout", "Batch Normalisation", "Layer Normalisation", "Regularisation", "Data Augmentation", "Early Stopping"] }
 ],
 k: [
  "Dropout zeroes random activations in training and scales survivors; it is a no-op in eval mode.",
  "BatchNorm normalises across the batch and breaks on small ones; LayerNorm is per-example, which is why transformers use it.",
  "Pre-norm — normalise before the sublayer — is what made very deep transformers trainable.",
  "Exclude biases and normalisation parameters from weight decay.",
  "Augment training data only, and remember that no regulariser fixes distribution shift."
 ],
 r: ["Dropout", "Batch Normalisation", "Layer Normalisation", "Regularisation", "Data Augmentation", "Overfitting", "Residual Connection"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "nn.Dropout(p=0.1)", w: "the standard transformer dropout rate" },
   { c: "nn.LayerNorm(768)", w: "per-example normalisation, for sequences" },
   { c: "x = x + attention(norm(x))", w: "pre-norm: keep the residual path clean" },
   { c: "[p for n,p in model.named_parameters() if p.dim() >= 2]", w: "the parameters that should get weight decay" }
  ]
 }
}

]);
