/* Deep Learning — architectures before the transformer. */
TD.addLessons("dl", [

{
 t: "CNNs and RNNs — and the Bottleneck That Ended Them",
 m: "arch",
 lvl: "core",
 s: "Two architectures that shaped a decade, and the specific failure that produced attention.",
 goal: [
  "Explain what a convolution assumes about its data and why that assumption pays",
  "Describe how an RNN processes a sequence and where it fails",
  "State precisely the bottleneck that attention was invented to remove"
 ],
 b: [
  { p: "You will rarely build these from scratch now. You need them because they explain *why* the transformer looks the way it does, and because the interview question after *explain attention* is usually *what was wrong with what came before*." },

  { h: "The problem with dense layers on images" },
  { code: { lang: "python", t: "The arithmetic that killed the naive approach",
    lines: [
     { c: "# a 224x224 colour image, flattened", w: "" },
     { c: "224 * 224 * 3", w: "**150,528 inputs.**" },
     { c: "", w: "" },
     { c: "150528 * 1000", w: "**150 million parameters in the first layer alone**, for a modest 1,000-unit layer.", hi: true },
     { c: "", w: "" },
     { c: "# and it learns nothing transferable:", w: "" },
     { c: "# a cat detector learned at the top-left corner", w: "" },
     { c: "# knows nothing about cats at the bottom-right.", w: "**Every position must be learned separately.** This is the deeper problem — the parameter count is only the symptom." }
    ] } },

  { h: "Convolution" },
  { p: "A **convolution** slides a small filter across the image, computing the same weighted sum at every position. Two ideas, and both are assumptions about the data that happen to be true for images." },

  { l: [
   "**Local connectivity** — a pixel relates to its neighbours, not to a pixel 200 across. So the filter only looks at a small window, typically 3×3.",
   "**Weight sharing** — an edge is an edge wherever it appears. So the *same* filter runs at every position, and a feature learned in one corner works everywhere.",
   "**The consequence**: a 3×3 filter over 3 input channels producing 64 output channels is `3·3·3·64 + 64` = **1,792 parameters**, replacing 150 million. Four orders of magnitude, from one assumption about the world."
  ] },

  { code: { lang: "python", t: "A small CNN",
    lines: [
     { c: "net = nn.Sequential(", w: "" },
     { c: "    nn.Conv2d(3, 32, kernel_size=3, padding=1),", w: "**3 channels in, 32 filters out.** `padding=1` keeps the spatial size unchanged." },
     { c: "    nn.BatchNorm2d(32), nn.ReLU(),", w: "" },
     { c: "    nn.MaxPool2d(2),", w: "**Halve the spatial size.** Each subsequent filter therefore sees twice as much of the original image.", hi: true },
     { c: "", w: "" },
     { c: "    nn.Conv2d(32, 64, 3, padding=1),", w: "**Channels grow as space shrinks** — the standard CNN shape." },
     { c: "    nn.BatchNorm2d(64), nn.ReLU(),", w: "" },
     { c: "    nn.MaxPool2d(2),", w: "" },
     { c: "", w: "" },
     { c: "    nn.AdaptiveAvgPool2d(1),", w: "**Collapse whatever spatial size remains to 1×1.** Makes the network accept any input size." },
     { c: "    nn.Flatten(),", w: "" },
     { c: "    nn.Linear(64, 10),", w: "" },
     { c: ")", w: "" }
    ],
    after: "Early filters learn edges and colour blobs. Middle ones learn textures and parts. Late ones respond to whole objects. Nobody programmed that hierarchy — it emerged because it was the most efficient way to satisfy the loss." } },

  { n: "In 2026 you will almost never train a CNN from scratch. You take a pretrained backbone — ResNet, EfficientNet, or a vision transformer — and fine-tune it. Three lines of `timm` or `torchvision`, and it will outperform anything you train from random initialisation on a normal dataset, by a wide margin.",
    nt: "What you will actually do" },

  { h: "Sequences, and the recurrent idea" },
  { p: "Text, audio and time series have order and variable length. A dense layer needs a fixed size and has no notion of order at all. The recurrent answer: process one element at a time, carrying a hidden state forward." },

  { code: { lang: "python", t: "An RNN, written out",
    lines: [
     { c: "h = torch.zeros(hidden_size)", w: "**The memory.** Starts empty." },
     { c: "", w: "" },
     { c: "for token in sequence:", w: "**One step at a time. This loop is the whole problem.**", hi: true },
     { c: "    x = embed(token)", w: "" },
     { c: "    h = torch.tanh(W_x @ x + W_h @ h + b)", w: "**New state from the current input and the previous state.** The same weights at every step — weight sharing again, but across time." },
     { c: "", w: "" },
     { c: "output = W_out @ h", w: "**The final state is supposed to summarise the entire sequence.**" }
    ] } },

  { h: "Two failures" },
  { p: "**Vanishing gradients over time.** Backpropagating through 100 steps means multiplying by the same factor 100 times — and you saw in the maths track what that does. Information from step 5 cannot reach step 95." },
  { p: "LSTMs and GRUs partly fixed this with gates: explicit, learned decisions about what to keep, what to forget and what to output. They worked, they powered translation and speech for years, and they made long sequences merely difficult rather than impossible." },

  { p: "**The sequential bottleneck, which no gate could fix.** Step t requires step t-1. There is nothing to parallelise. A GPU with thousands of cores processes a sequence one element at a time, mostly idle." },

  { code: { lang: "python", t: "Why this decided the field",
    lines: [
     { c: "# RNN over 512 tokens:", w: "" },
     { c: "#   512 sequential steps, each depending on the last", w: "**Cannot be parallelised. Ever.**", hi: true },
     { c: "", w: "" },
     { c: "# Transformer over 512 tokens:", w: "" },
     { c: "#   ONE matrix multiply, all positions at once", w: "**Perfectly parallel — exactly what a GPU is built for.**", hi: true },
     { c: "", w: "" },
     { c: "# Same FLOPs, wildly different wall-clock time.", w: "This was a hardware argument as much as a modelling one, and it is the reason scaling became affordable." }
    ] } },

  { h: "The encoder-decoder bottleneck" },
  { p: "There was a second, sharper failure. In sequence-to-sequence translation, an encoder RNN compressed the entire source sentence into one fixed-size vector, and a decoder generated the translation from it." },

  { ana: "You read a forty-word sentence, write one 512-number summary, then hand only that summary to a translator who never sees the original. For a short sentence it works. For a long one, information is unavoidably lost — and it was, measurably: translation quality fell off sharply with sentence length, in a way no amount of extra training fixed.",
    at: "The one-vector summary" },

  { p: "In 2014 Bahdanau and colleagues proposed the fix. Instead of one summary, let the decoder look back at **every** encoder state, and learn which ones matter for the word it is currently producing. That mechanism was called **attention**." },

  { n: "Attention was originally an *addition* to an RNN — a patch on the bottleneck. In 2017 the transformer paper asked what happens if you delete the RNN and keep only the attention. The answer, in the title, was *Attention Is All You Need*, and everything since has been a consequence of it being correct.",
    nt: "How the transformer happened" },

  { h: "What survives" },
  { tbl: { t: "Where each architecture still lives",
    h: ["Architecture", "Status", "Still used for"],
    rows: [
     ["**CNN**", "**Alive and well**", "Efficient vision, edge devices, medical imaging with limited data. Cheaper than a ViT and often as good below a certain data scale"],
     ["**RNN / LSTM**", "Largely displaced", "Very long time series, tiny embedded devices, streaming with strict memory limits"],
     ["**Transformer**", "**Dominant**", "Text, vision, audio, code, protein structure, multimodal — everything"],
     ["**State space models** (Mamba)", "Emerging", "Linear-time long sequences. A genuine RNN revival with modern training tricks. Worth watching"]
    ] } },

  { p: "The vocabulary transfers too, which is why this lesson exists. Residual connections came from ResNet. Normalisation came from BatchNorm in CNNs. The encoder-decoder split came from sequence-to-sequence RNNs. A transformer is not a clean-sheet design; it is an accumulation." },

  { tryit: { t: "Measure the bottleneck",
    task: "Time an LSTM and a self-attention layer processing the same batch of sequences at lengths 128, 512 and 2048. Compare how each scales.",
    hint: "`nn.LSTM(256, 256, batch_first=True)` against `nn.MultiheadAttention(256, 8, batch_first=True)`. Use `time.perf_counter()` around ten forward passes each.",
    sol: { lang: "python", code: "import torch, torch.nn as nn, time\n\nd, B = 256, 16\nlstm = nn.LSTM(d, d, batch_first=True)\nattn = nn.MultiheadAttention(d, 8, batch_first=True)\n\nfor T in [128, 512, 2048]:\n    x = torch.randn(B, T, d)\n\n    t0 = time.perf_counter()\n    for _ in range(10): lstm(x)\n    t_lstm = time.perf_counter() - t0\n\n    t0 = time.perf_counter()\n    for _ in range(10): attn(x, x, x)\n    t_attn = time.perf_counter() - t0\n\n    print(f'T={T:>5}  lstm {t_lstm:.3f}s  attention {t_attn:.3f}s')" },
    w: "LSTM time scales linearly with sequence length and stays linear — 512 tokens take four times as long as 128, exactly as the loop implies. Attention is much faster at short lengths because it is one parallel operation, then starts to catch up at long lengths because its cost is quadratic in sequence length. That quadratic term is attention's own weakness, and it is why context windows were expensive to extend and why FlashAttention and its successors were such significant engineering." } },

  { vocab: ["Convolutional Neural Network", "Recurrent Neural Network", "LSTM", "Attention Mechanism", "Transformer"] }
 ],
 k: [
  "Convolution assumes locality and translation invariance, which cuts parameters by orders of magnitude.",
  "You will fine-tune a pretrained CNN rather than train one from scratch.",
  "RNNs carry a hidden state forward, and their loop cannot be parallelised — that was the fatal limitation.",
  "Attention began as a patch on the encoder-decoder bottleneck; the transformer deleted the RNN and kept the patch.",
  "Attention is parallel but quadratic in sequence length, which is why long context is expensive."
 ],
 r: ["Convolutional Neural Network", "Recurrent Neural Network", "LSTM", "Attention Mechanism", "Transformer", "Vanishing Gradient"],
 drill: {
  lang: "python",
  reps: 2,
  items: [
   { c: "nn.Conv2d(3, 32, kernel_size=3, padding=1)", w: "32 filters over 3 channels, spatial size preserved" },
   { c: "nn.MaxPool2d(2)", w: "halve the spatial size, widen what later filters see" },
   { c: "h = torch.tanh(W_x @ x + W_h @ h + b)", w: "one recurrent step — and the loop that could not be parallelised" },
   { c: "nn.MultiheadAttention(256, 8, batch_first=True)", w: "all positions at once, in one parallel operation" }
  ]
 }
}

]);
