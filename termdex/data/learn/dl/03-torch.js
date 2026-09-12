/* Deep Learning — PyTorch. */
TD.addLessons("dl", [

{
 t: "PyTorch: Tensors and Autograd",
 m: "torch",
 lvl: "core",
 s: "NumPy with two additions — a GPU and a memory of what you did to it.",
 goal: [
  "Move between NumPy and PyTorch tensors without copying by accident",
  "Explain what `requires_grad` builds and when it is released",
  "Debug the three device and dtype errors everyone hits"
 ],
 b: [
  { p: "A PyTorch tensor is a NumPy array with two extra abilities: it can live on a GPU, and it can remember every operation performed on it so those operations can be differentiated. Everything else you already know from NumPy transfers directly." },

  { code: { lang: "python", t: "Almost entirely familiar",
    lines: [
     { c: "import torch, numpy as np", w: "" },
     { c: "", w: "" },
     { c: "t = torch.tensor([1.0, 2.0, 3.0])", w: "" },
     { c: "t.shape, t.dtype, t.device", w: "**Three attributes you will check constantly.** Device and dtype are new; shape you already know." },
     { c: "", w: "" },
     { c: "torch.zeros(3, 4); torch.randn(32, 128)", w: "Same names as NumPy." },
     { c: "t.mean(); t.sum(); t @ t", w: "Same operations." },
     { c: "x[:, 0]; x.reshape(-1, 8)", w: "Same indexing." },
     { c: "", w: "" },
     { c: "a = t.numpy()", w: "**Shares memory.** Modify `a` and `t` changes too — occasionally useful, frequently a surprise.", hi: true },
     { c: "b = torch.from_numpy(np_array)", w: "Also shares memory. Use `.clone()` if you want a copy." }
    ] } },

  { h: "Autograd" },
  { code: { lang: "python", t: "The graph, built and consumed",
    lines: [
     { c: "x = torch.tensor([2.0], requires_grad=True)", w: "**Track everything that happens to this.**", hi: true },
     { c: "", w: "" },
     { c: "y = x ** 2", w: "PyTorch records: *y came from squaring x*." },
     { c: "z = 3 * y + 1", w: "And: *z came from y*. A graph is being built as you go." },
     { c: "", w: "" },
     { c: "z.backward()", w: "**Walk the graph backwards, applying the chain rule.**", hi: true },
     { c: "x.grad", w: "**tensor([12.])** — dz/dx = 3·2x = 12 at x=2. Exactly what you computed by hand in the maths track." },
     { c: "", w: "" },
     { c: "z.backward()", w: "**RuntimeError.** The graph is freed after one backward pass, to release memory. Pass `retain_graph=True` if you genuinely need a second pass — but usually this error means a bug." }
    ],
    out: "tensor([12.])" } },

  { n: "This is the machinery you hand-wrote in the scratch network. PyTorch records the operations as they execute — *define by run* — which is why you can use ordinary Python `if` statements and loops inside a model and it still differentiates correctly. TensorFlow 1 required you to declare the graph up front, and that difference is most of why PyTorch won.",
    nt: "What you built by hand, automated" },

  { h: "Three things that turn autograd off, and why" },
  { code: { lang: "python",
    lines: [
     { c: "with torch.no_grad():", w: "**Inference and evaluation.** No graph is built — faster, and a large memory saving.", hi: true },
     { c: "    preds = model(X)", w: "" },
     { c: "", w: "" },
     { c: "t.detach()", w: "**Cut one tensor out of the graph.** Use when storing a value for logging: `losses.append(loss.detach())` — without it you retain the entire graph and leak memory across epochs." },
     { c: "", w: "" },
     { c: "loss.item()", w: "**Python float from a single-element tensor.** The standard way to log a loss, and it detaches implicitly." },
     { c: "", w: "" },
     { c: "for p in model.parameters(): p.requires_grad = False", w: "**Freeze a layer.** Standard when fine-tuning: freeze the backbone, train only the head." }
    ] } },

  { trap: "`losses.append(loss)` instead of `losses.append(loss.item())` is the most common memory leak in PyTorch. The tensor keeps a reference to the whole computation graph that produced it, so after a hundred batches you are holding a hundred graphs. Memory climbs steadily and you run out mid-epoch, usually on the longest training run you have started." },

  { h: "Devices" },
  { code: { lang: "python", t: "GPU, or gracefully not",
    lines: [
     { c: "device = 'cuda' if torch.cuda.is_available() else 'cpu'", w: "**Write this once at the top.** Code that hardcodes `.cuda()` will not run on a laptop, which is where you develop.", hi: true },
     { c: "", w: "" },
     { c: "model = model.to(device)", w: "**Modifies in place and returns self.** Either form works for models." },
     { c: "X = X.to(device)", w: "**Tensors are different — `.to()` returns a new tensor.** `X.to(device)` on its own line does nothing.", hi: true },
     { c: "", w: "" },
     { c: "# in the training loop", w: "" },
     { c: "for X, y in loader:", w: "" },
     { c: "    X, y = X.to(device), y.to(device)", w: "**Both. Forgetting the labels is the single most common device error.**" }
    ] } },

  { tbl: { t: "The three errors, and what each actually means",
    h: ["Error", "Cause", "Fix"],
    rows: [
     ["`Expected all tensors on the same device`", "Model on GPU, data on CPU — or one tensor missed", "`.to(device)` on everything entering the model"],
     ["`expected scalar type Float but found Long`", "Integer tensor into a float operation", "`.float()`. **Labels for `CrossEntropyLoss` must be Long; for `BCEWithLogitsLoss` must be Float** — that inconsistency catches everyone"],
     ["`CUDA out of memory`", "Batch too large, or graphs retained", "Smaller batch, gradient accumulation, `no_grad` in evaluation, and check for `.append(loss)` without `.item()`"]
    ] } },

  { h: "Shapes, in the PyTorch idiom" },
  { code: { lang: "python", t: "The reshaping operations you will actually use",
    lines: [
     { c: "x.view(-1, 128)", w: "**Reshape without copying.** Requires contiguous memory; fails after some operations." },
     { c: "x.reshape(-1, 128)", w: "**Same, but copies if it must.** Safer default — use this unless you have measured a reason not to." },
     { c: "", w: "" },
     { c: "x.squeeze()", w: "Drop dimensions of size 1. `(32,1)` → `(32,)`." },
     { c: "x.unsqueeze(1)", w: "**Add a dimension of size 1** at position 1. `(32,)` → `(32,1)`. The standard fix for a broadcasting mismatch.", hi: true },
     { c: "", w: "" },
     { c: "x.permute(0, 2, 1)", w: "**Reorder dimensions.** Essential in attention code, where you constantly move the head dimension." },
     { c: "x.transpose(1, 2)", w: "Swap exactly two dimensions." },
     { c: "", w: "" },
     { c: "torch.cat([a, b], dim=1)", w: "Join along an existing dimension." },
     { c: "torch.stack([a, b])", w: "**Join along a new dimension.** cat versus stack is a constant source of confusion — cat extends, stack adds." }
    ] } },

  { p: "One habit worth adopting immediately: annotate shapes in comments as you write model code. `# (B, T, C)` for batch, time, channels. Every serious model implementation does this, and it turns a shape bug from a twenty-minute investigation into a five-second read." },

  { h: "Reproducibility" },
  { code: { lang: "python", t: "The seeding block worth pasting into every project",
    lines: [
     { c: "import random, numpy as np, torch", w: "" },
     { c: "", w: "" },
     { c: "def seed_everything(s=42):", w: "" },
     { c: "    random.seed(s); np.random.seed(s)", w: "" },
     { c: "    torch.manual_seed(s)", w: "" },
     { c: "    torch.cuda.manual_seed_all(s)", w: "**All GPUs.**" },
     { c: "    torch.backends.cudnn.deterministic = True", w: "**Costs perhaps 10% speed** and makes GPU convolutions reproducible. Worth it while debugging; often turned off for long runs.", hi: true }
    ],
    after: "Even with all of this, GPU floating-point reduction order is not fully deterministic in every operation. Two runs can differ in the last few decimal places, which occasionally compounds. Do not spend a day chasing a 0.001 difference — it may be the hardware." } },

  { tryit: { t: "Verify autograd against your own maths",
    task: "Take `f(x) = 3x³ - 2x² + 5`. Compute df/dx by hand at x = 2. Then verify with autograd, and again with a numerical difference. All three should agree.",
    hint: "The derivative is `9x² - 4x`. At x=2 that is 36 - 8 = 28.",
    sol: { lang: "python", code: "import torch\n\nx = torch.tensor([2.0], requires_grad=True)\nf = 3*x**3 - 2*x**2 + 5\nf.backward()\nprint('autograd :', x.grad.item())        # 28.0\n\n# by hand: 9x^2 - 4x = 9(4) - 4(2) = 28\nprint('by hand  :', 9*2**2 - 4*2)          # 28\n\n# numerically\nh = 1e-5\ng = lambda v: 3*v**3 - 2*v**2 + 5\nprint('numeric  :', (g(2+h) - g(2-h)) / (2*h))   # 27.99999..." },
    w: "Three independent routes to 28. Do this once, deliberately, and `loss.backward()` stops being a black box — it becomes the same chain rule you applied by hand, executed by a graph walker. That shift matters when you eventually meet a gradient that is zero, or NaN, or the wrong shape, and need to reason about why." } },

  { vocab: ["PyTorch", "Tensor", "Autograd", "GPU", "Backpropagation"] }
 ],
 k: [
  "A tensor is a NumPy array that can live on a GPU and remember what was done to it.",
  "`requires_grad` builds a graph; `backward()` consumes it, and it is freed afterwards.",
  "Use `no_grad` for evaluation, `.detach()` or `.item()` when storing — `.append(loss)` leaks the whole graph.",
  "`.to(device)` returns a new tensor but modifies a model in place; move data and labels both.",
  "Annotate shapes in comments — `# (B, T, C)` — and shape bugs become readable instead of investigable."
 ],
 r: ["PyTorch", "Tensor", "Autograd", "GPU", "CUDA", "Backpropagation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "device = 'cuda' if torch.cuda.is_available() else 'cpu'", w: "one line that keeps code portable" },
   { c: "X, y = X.to(device), y.to(device)", w: "move both, every batch" },
   { c: "with torch.no_grad():", w: "evaluate without building a graph" },
   { c: "losses.append(loss.item())", w: "log a float, not a graph" },
   { c: "x.unsqueeze(1)", w: "add a dimension to fix broadcasting" }
  ]
 }
},

{
 t: "nn.Module and the Training Loop You Will Write Forever",
 m: "torch",
 lvl: "core",
 s: "The structure every PyTorch project shares, written once, properly.",
 goal: [
  "Define a model as an nn.Module and understand what the base class provides",
  "Write a Dataset and DataLoader for your own data",
  "Write a training loop with validation, checkpointing and early stopping"
 ],
 b: [
  { p: "Every PyTorch project has the same four parts: a Dataset, a DataLoader, a Module and a loop. Learn these once and you can read any research repository on GitHub." },

  { h: "The model" },
  { code: { lang: "python", file: "model.py",
    lines: [
     { c: "import torch.nn as nn", w: "" },
     { c: "", w: "" },
     { c: "class Classifier(nn.Module):", w: "**Always subclass nn.Module.**" },
     { c: "    def __init__(self, n_in, n_hidden=128, n_out=2, p_drop=0.2):", w: "" },
     { c: "        super().__init__()", w: "**Non-negotiable.** Without it, PyTorch cannot register parameters and `model.parameters()` returns nothing.", hi: true },
     { c: "        self.net = nn.Sequential(", w: "**Assigning modules to `self` registers them automatically** — that is the base class's main job." },
     { c: "            nn.Linear(n_in, n_hidden),", w: "" },
     { c: "            nn.BatchNorm1d(n_hidden),", w: "Stabilises training. Note it behaves differently in train and eval mode." },
     { c: "            nn.ReLU(),", w: "" },
     { c: "            nn.Dropout(p_drop),", w: "**Also mode-dependent** — active in training, off in eval." },
     { c: "            nn.Linear(n_hidden, n_out),", w: "" },
     { c: "        )", w: "**No softmax.** `CrossEntropyLoss` expects raw logits.", hi: true },
     { c: "", w: "" },
     { c: "    def forward(self, x):", w: "**Define forward; never call it directly.**" },
     { c: "        return self.net(x)", w: "" }
    ],
    after: "Call the model as `model(x)`, not `model.forward(x)`. The `__call__` wrapper runs registered hooks, which is what profilers, gradient inspectors and several libraries depend on." } },

  { code: { lang: "python", t: "What the base class gives you",
    lines: [
     { c: "model.parameters()", w: "Every registered tensor with `requires_grad`. What you hand the optimiser." },
     { c: "model.state_dict()", w: "**All weights as a dictionary.** This is what you save — not the model object, which pickles your class definition and breaks on refactor.", hi: true },
     { c: "model.train() / model.eval()", w: "Flips dropout and batchnorm across every submodule at once." },
     { c: "model.to(device)", w: "Moves every parameter." },
     { c: "sum(p.numel() for p in model.parameters())", w: "**Parameter count.** Worth printing at startup." }
    ] } },

  { h: "Data" },
  { code: { lang: "python", t: "Dataset and DataLoader",
    lines: [
     { c: "from torch.utils.data import Dataset, DataLoader", w: "" },
     { c: "", w: "" },
     { c: "class TabularDataset(Dataset):", w: "**Three methods, always the same three.**" },
     { c: "    def __init__(self, X, y):", w: "" },
     { c: "        self.X = torch.tensor(X, dtype=torch.float32)", w: "**float32.** float64 doubles memory for no benefit on a GPU." },
     { c: "        self.y = torch.tensor(y, dtype=torch.long)", w: "**long for CrossEntropyLoss.** float for BCEWithLogitsLoss." },
     { c: "    def __len__(self):", w: "" },
     { c: "        return len(self.y)", w: "" },
     { c: "    def __getitem__(self, i):", w: "**Return ONE example.** The DataLoader assembles batches.", hi: true },
     { c: "        return self.X[i], self.y[i]", w: "" },
     { c: "", w: "" },
     { c: "train_loader = DataLoader(train_ds, batch_size=64,", w: "" },
     { c: "    shuffle=True,", w: "**True for training, False for validation.** Shuffling matters — ordered data makes gradients correlated within a batch." },
     { c: "    num_workers=4,", w: "**Parallel loading.** On Windows this must be inside `if __name__ == '__main__':` or it spawns endlessly." },
     { c: "    pin_memory=True,", w: "Faster CPU-to-GPU transfer. Free win when using CUDA." },
     { c: "    drop_last=True)", w: "**Drop a final partial batch.** BatchNorm fails on a batch of size 1, which is a genuinely annoying way to lose an epoch.", hi: true }
    ] } },

  { h: "The loop, complete" },
  { code: { lang: "python", file: "train.py", t: "Everything a real training loop needs",
    lines: [
     { c: "best_val, patience, bad = float('inf'), 5, 0", w: "**Early stopping state.**" },
     { c: "", w: "" },
     { c: "for epoch in range(100):", w: "" },
     { c: "    model.train()", w: "" },
     { c: "    train_loss = 0.0", w: "" },
     { c: "    for X, y in train_loader:", w: "" },
     { c: "        X, y = X.to(device), y.to(device)", w: "" },
     { c: "        opt.zero_grad()", w: "" },
     { c: "        loss = criterion(model(X), y)", w: "" },
     { c: "        loss.backward()", w: "" },
     { c: "        nn.utils.clip_grad_norm_(model.parameters(), 1.0)", w: "" },
     { c: "        opt.step()", w: "" },
     { c: "        train_loss += loss.item() * len(y)", w: "**Weight by batch size** — the last batch may be smaller, and an unweighted mean is subtly wrong." },
     { c: "    train_loss /= len(train_loader.dataset)", w: "" },
     { c: "", w: "" },
     { c: "    model.eval()", w: "" },
     { c: "    val_loss, correct = 0.0, 0", w: "" },
     { c: "    with torch.no_grad():", w: "" },
     { c: "        for X, y in val_loader:", w: "" },
     { c: "            X, y = X.to(device), y.to(device)", w: "" },
     { c: "            out = model(X)", w: "" },
     { c: "            val_loss += criterion(out, y).item() * len(y)", w: "" },
     { c: "            correct += (out.argmax(1) == y).sum().item()", w: "**argmax over the class dimension** — no softmax needed, since it does not change the ranking." },
     { c: "    val_loss /= len(val_loader.dataset)", w: "" },
     { c: "", w: "" },
     { c: "    print(f'{epoch:>3}  train {train_loss:.4f}  val {val_loss:.4f}  '", w: "" },
     { c: "          f'acc {correct/len(val_loader.dataset):.4f}')", w: "" },
     { c: "", w: "" },
     { c: "    if val_loss < best_val:", w: "" },
     { c: "        best_val, bad = val_loss, 0", w: "" },
     { c: "        torch.save(model.state_dict(), 'best.pt')", w: "**Save the best, not the last.** The final epoch is frequently worse than epoch 30.", hi: true },
     { c: "    else:", w: "" },
     { c: "        bad += 1", w: "" },
     { c: "        if bad >= patience:", w: "" },
     { c: "            print(f'early stop at epoch {epoch}'); break", w: "**Free regularisation**, and it saves hours of compute." },
     { c: "", w: "" },
     { c: "model.load_state_dict(torch.load('best.pt'))", w: "**Reload the best checkpoint before evaluating on test.**", hi: true }
    ] } },

  { trap: "Save `state_dict()`, never the model object. `torch.save(model)` pickles the class definition along with the weights, so renaming your file or moving the class breaks every checkpoint you ever produced. Saving the state dict means the weights survive any refactor — you just need the class definition available to load them into." },

  { h: "A checklist for when it does not train" },
  { ol: [
   "**Can it overfit 10 examples?** Take ten rows and train until the loss is near zero. If it cannot, the bug is in the model or the loop, not the data — and this test takes thirty seconds.",
   "**Are gradients flowing?** `print(p.grad.norm())` for a few parameters. All zeros means the graph is disconnected somewhere.",
   "**Are the shapes right?** Print inside `forward`. Broadcasting hides mistakes in silence.",
   "**Is the loss the right one?** Softmax before `CrossEntropyLoss`; Long labels for BCE; wrong dimension in argmax.",
   "**Is `zero_grad` there, and in the right place?**",
   "**Is the data correct?** Print one batch and look at it. Check the labels are not all one class."
  ] },

  { n: "The overfit-ten-examples test is the single best debugging habit in deep learning. A correct network with a correct loop can memorise ten examples in seconds. If it cannot, no amount of tuning, architecture change or extra data will help, and you have just localised the bug to about forty lines of code.",
    nt: "The test to run first, always" },

  { tryit: { t: "The full loop, on real data",
    task: "Build a classifier on any tabular dataset: Dataset class, DataLoaders, an nn.Module with dropout, AdamW, early stopping and best-checkpoint saving. Print the parameter count at startup. Then deliberately break something — remove `zero_grad` — and observe what happens.",
    hint: "Without `zero_grad`, gradients accumulate across batches. The loss usually falls at first and then becomes erratic, because the effective step size grows every batch.",
    sol: { lang: "python", code: "# after removing opt.zero_grad(), a typical run:\n#\n#   0  train 0.6821  val 0.6533  acc 0.6120\n#   1  train 0.5904  val 0.6210  acc 0.6640\n#   2  train 0.7733  val 0.8901  acc 0.5980   <- turning\n#   3  train 1.9042  val 2.4410  acc 0.5010\n#   4  train nan     val nan     acc 0.5010\n#\n# It improves briefly, which is what makes this bug survive\n# review. Gradients from every previous batch keep adding, so\n# the effective step size grows without bound until it blows up.\n#\n# Compare with the correct version, which descends smoothly\n# and triggers early stopping around epoch 25-40." },
    w: "That shape — improves, then destabilises, then NaN — is worth memorising. It is what accumulating gradients looks like, and it is distinguishable from a too-high learning rate, which is unstable from the very first step rather than after a few good epochs." } },

  { vocab: ["PyTorch", "Dropout", "Batch Normalisation", "Early Stopping", "Checkpoint"] }
 ],
 k: [
  "Subclass `nn.Module`, call `super().__init__()`, assign submodules to `self`, define `forward`, call the model not forward.",
  "A Dataset returns one example; the DataLoader batches, shuffles and parallelises.",
  "Save `state_dict()`, save the best epoch rather than the last, and reload it before testing.",
  "Weight epoch losses by batch size, and use `drop_last=True` so BatchNorm never sees a batch of one.",
  "When training fails, first check whether the model can overfit ten examples."
 ],
 r: ["PyTorch", "Dropout", "Batch Normalisation", "Early Stopping", "Tensor", "Autograd"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "class Net(nn.Module): def __init__(self): super().__init__()", w: "the base-class call that registers parameters" },
   { c: "DataLoader(ds, batch_size=64, shuffle=True, drop_last=True)", w: "batching, shuffling, and no partial final batch" },
   { c: "torch.save(model.state_dict(), 'best.pt')", w: "save weights, not the class" },
   { c: "correct += (out.argmax(1) == y).sum().item()", w: "count correct predictions from raw logits" },
   { c: "sum(p.numel() for p in model.parameters())", w: "how many parameters the model has" }
  ]
 }
}

]);
