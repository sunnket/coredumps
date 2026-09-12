/* Deep Learning — attention and the transformer. */
TD.addLessons("dl", [

{
 t: "Attention, Taken Apart",
 m: "attn",
 lvl: "core",
 s: "Queries, keys and values — the mechanism behind every model you use, in about fifteen lines.",
 goal: [
  "Explain what a query, a key and a value each are",
  "Write scaled dot-product attention from scratch",
  "Say why the scaling factor and the causal mask exist"
 ],
 b: [
  { p: "*Explain attention* is asked in essentially every AI engineering interview, and most candidates recite a definition. The ones who are remembered can draw it. This lesson builds it from the problem it solves." },

  { h: "The problem" },
  { p: "Consider: **\"The animal didn't cross the street because it was too tired.\"** What does *it* refer to?" },
  { p: "You know instantly — the animal, because *tired* applies to animals rather than streets. Change one word to *too wide* and *it* becomes the street. To process the word *it*, the model must pull information from a specific earlier word, and which word depends on the content of both." },

  { p: "That is the requirement: **every position needs to gather information from other positions, with weights it decides based on content.** Attention is the mechanism for exactly that." },

  { h: "Query, key, value" },
  { ana: "A library search. Your **query** is what you are looking for. Each book has a **key** — its spine label, describing what it is about. You compare your query against every key, get a relevance score for each, then take a weighted blend of the books' actual **contents** — their **values** — in proportion to those scores. Attention does this with vectors, and crucially it does not pick one book. It blends all of them, weighted.",
    at: "Searching a library, but taking a blend" },

  { tbl: { t: "What each is, for one token",
    h: ["", "Means", "Answers"],
    rows: [
     ["**Query (Q)**", "What this position is looking for", "*What information do I need?*"],
     ["**Key (K)**", "What this position offers", "*What am I about?*"],
     ["**Value (V)**", "What this position actually contributes", "*What do I hand over if selected?*"]
    ] } },

  { p: "All three are produced from the same input token embedding, by three different learned matrices. A token's query and its key are different because *what I need* and *what I offer* are different things — and separating them is the whole trick." },

  { h: "The mechanism, line by line" },
  { code: { lang: "python", t: "Scaled dot-product attention, complete",
    lines: [
     { c: "import torch, math", w: "" },
     { c: "import torch.nn.functional as F", w: "" },
     { c: "", w: "" },
     { c: "def attention(Q, K, V, mask=None):", w: "**Q, K, V each shaped (B, T, d)** — batch, tokens, dimension." },
     { c: "    d = Q.size(-1)", w: "" },
     { c: "", w: "" },
     { c: "    scores = Q @ K.transpose(-2, -1)", w: "**Every query against every key.** (B,T,d) @ (B,d,T) → (B,T,T). A T×T grid: how much position i cares about position j.", hi: true },
     { c: "", w: "" },
     { c: "    scores = scores / math.sqrt(d)", w: "**The scaling.** Without it, dot products in high dimensions grow large, softmax saturates to nearly one-hot, and gradients vanish. √d is exactly the standard deviation of a dot product of two random d-dimensional unit-variance vectors.", hi: true },
     { c: "", w: "" },
     { c: "    if mask is not None:", w: "" },
     { c: "        scores = scores.masked_fill(mask == 0, float('-inf'))", w: "**-inf becomes exactly zero after softmax.** This is how a position is forbidden from seeing another.", hi: true },
     { c: "", w: "" },
     { c: "    weights = F.softmax(scores, dim=-1)", w: "**Each row sums to 1** — a probability distribution over which positions to draw from." },
     { c: "", w: "" },
     { c: "    return weights @ V", w: "**Weighted blend of the values.** (B,T,T) @ (B,T,d) → (B,T,d). Same shape in, same shape out." }
    ],
    after: "Fifteen lines. This is the core of every large language model in existence. Everything else in a transformer is arrangement around it." } },

  { h: "Reading an attention matrix" },
  { code: { lang: "python", t: "What the weights actually look like",
    lines: [
     { c: "# tokens: [The, animal, didn't, cross, the, street, because, it, was, tired]", w: "" },
     { c: "# the row for 'it':", w: "" }
    ] } },

  { out: "The     0.02\nanimal  0.61   <- \"it\" is drawing mostly from \"animal\"\ndidn't  0.03\ncross   0.04\nthe     0.02\nstreet  0.11\nbecause 0.05\nit      0.08\nwas     0.02\ntired   0.02", ot: "Attention weights for the token \"it\"" },

  { p: "Nobody taught it that pronouns resolve to nouns. That weighting emerged from predicting the next token across a very large corpus, because getting the reference right helps predict what comes next." },

  { h: "Multi-head attention" },
  { p: "One attention operation produces one weighting pattern. But *animal* relates to *it* by coreference, to *didn't cross* grammatically, and to *tired* semantically — three relationships, and one softmax must choose between them." },

  { p: "So run several in parallel. Split the dimension into **heads**, let each learn its own Q, K and V projections, and concatenate the results." },

  { code: { lang: "python", t: "Multi-head attention, as it is actually written",
    lines: [
     { c: "class MultiHeadAttention(nn.Module):", w: "" },
     { c: "    def __init__(self, d_model, n_heads):", w: "" },
     { c: "        super().__init__()", w: "" },
     { c: "        self.h = n_heads", w: "" },
     { c: "        self.dk = d_model // n_heads", w: "**Split, not multiply.** 768 dims with 12 heads means 64 per head — total compute is roughly unchanged.", hi: true },
     { c: "        self.qkv = nn.Linear(d_model, 3 * d_model)", w: "**All three projections in one matrix.** One bigger matmul is faster than three smaller ones." },
     { c: "        self.out = nn.Linear(d_model, d_model)", w: "Mixes the heads' outputs back together." },
     { c: "", w: "" },
     { c: "    def forward(self, x, mask=None):", w: "" },
     { c: "        B, T, C = x.shape", w: "**Annotate shapes. Always.**" },
     { c: "        qkv = self.qkv(x)", w: "(B, T, 3C)" },
     { c: "        q, k, v = qkv.chunk(3, dim=-1)", w: "Three tensors of (B, T, C)." },
     { c: "", w: "" },
     { c: "        q = q.view(B, T, self.h, self.dk).transpose(1, 2)", w: "**(B, h, T, dk).** The head dimension moves next to batch so attention runs independently per head — this reshape-then-transpose is the line people find fiddly and it appears in every implementation.", hi: true },
     { c: "        k = k.view(B, T, self.h, self.dk).transpose(1, 2)", w: "" },
     { c: "        v = v.view(B, T, self.h, self.dk).transpose(1, 2)", w: "" },
     { c: "", w: "" },
     { c: "        o = F.scaled_dot_product_attention(q, k, v, is_causal=mask is not None)", w: "**PyTorch 2's fused kernel — this is FlashAttention.** Same maths, far less memory, considerably faster. Use it rather than a hand-rolled version.", hi: true },
     { c: "", w: "" },
     { c: "        o = o.transpose(1, 2).contiguous().view(B, T, C)", w: "**Put the heads back together.** `.contiguous()` is needed because transpose leaves memory non-contiguous and `view` requires contiguity." },
     { c: "        return self.out(o)", w: "" }
    ] } },

  { n: "Heads specialise in interpretable ways, which was a genuine surprise when it was first investigated. Some track syntax, some track coreference, some attend to the previous token, some to punctuation. In GPT-2, specific heads were found that reliably perform *copy the earlier occurrence of this token* — the induction heads that appear to underpin much of in-context learning.",
    nt: "What heads learn" },

  { h: "The causal mask" },
  { p: "A model trained to predict the next token must not see the next token. The mask enforces this: position i may attend to positions ≤ i and nothing beyond." },

  { code: { lang: "python", t: "The lower-triangular mask",
    lines: [
     { c: "T = 5", w: "" },
     { c: "mask = torch.tril(torch.ones(T, T))", w: "**Lower triangle of ones.**", hi: true },
     { c: "print(mask)", w: "" }
    ],
    out: "tensor([[1., 0., 0., 0., 0.],\n        [1., 1., 0., 0., 0.],\n        [1., 1., 1., 0., 0.],\n        [1., 1., 1., 1., 0.],\n        [1., 1., 1., 1., 1.]])",
    after: "Row 0 sees only position 0. Row 4 sees everything up to and including itself. Nothing sees the future. This one triangle is the entire difference between a GPT-style decoder and a BERT-style encoder, and it is why one generates text and the other does not." } },

  { tbl: { t: "Masking decides what the model is",
    h: ["Mask", "Each token sees", "Model family", "Good at"],
    rows: [
     ["**Causal** (triangular)", "Itself and everything before", "GPT, Llama, Claude — **decoder-only**", "Generation"],
     ["**None** (full)", "Everything, both directions", "BERT — **encoder-only**", "Classification, embeddings, understanding"],
     ["**Padding mask**", "Real tokens only, not padding", "**Both.** Always required with variable-length batches", "Not breaking on short sequences"]
    ] } },

  { trap: "Forgetting the padding mask is a quiet, damaging bug. Batched sequences are padded to equal length, and without a mask the model attends to padding tokens as if they were content. Nothing errors. Training is simply worse, and worse in a way that scales with how much padding you have — so it looks like a data problem rather than a masking problem." },

  { h: "The cost" },
  { p: "The scores matrix is T×T per head. Double the sequence length and you quadruple the memory and compute for attention. This quadratic term is why long context windows were hard and expensive." },

  { l: [
   "**FlashAttention** — never materialises the full T×T matrix; computes it in tiles inside fast on-chip memory. Same maths, dramatically less memory. Now the default in PyTorch's fused kernel.",
   "**Sliding window** — each token attends only to the nearest k. Linear cost, and used by Mistral among others.",
   "**Grouped-query attention (GQA)** — several query heads share one key/value head. Shrinks the KV cache substantially, which is the real bottleneck at inference. Standard in modern open models.",
   "**Linear attention and state space models** — approximate or replace attention to get linear scaling. An active research direction; Mamba is the best-known example."
  ] },

  { tryit: { t: "Build it and look at the weights",
    task: "Implement scaled dot-product attention from scratch. Feed it random Q, K, V for a 6-token sequence and print the attention weight matrix. Confirm every row sums to 1. Then apply a causal mask and confirm the upper triangle is exactly zero.",
    hint: "Print `weights.sum(dim=-1)` — it should be all ones. After masking, `weights[0]` should have zeros everywhere except position 0.",
    sol: { lang: "python", code: "import torch, math\nimport torch.nn.functional as F\n\ntorch.manual_seed(0)\nB, T, d = 1, 6, 8\nQ, K, V = (torch.randn(B, T, d) for _ in range(3))\n\ndef attention(Q, K, V, causal=False):\n    scores = (Q @ K.transpose(-2, -1)) / math.sqrt(Q.size(-1))\n    if causal:\n        mask = torch.tril(torch.ones(Q.size(-2), K.size(-2)))\n        scores = scores.masked_fill(mask == 0, float('-inf'))\n    w = F.softmax(scores, dim=-1)\n    return w @ V, w\n\n_, w = attention(Q, K, V)\nprint('rows sum to:', w.sum(-1).round(decimals=4))\n\n_, wc = attention(Q, K, V, causal=True)\nprint(wc[0].round(decimals=2))\n# row 0 attends only to itself; each row adds one more column" },
    w: "That triangular weight matrix is what makes a language model generate left to right. Every token you have ever seen streamed out of a model came through one of these, and you have now written it. In an interview, being able to sketch this matrix and explain why the upper triangle is zero puts you ahead of most candidates immediately." } },

  { vocab: ["Attention Mechanism", "Self-Attention", "Multi-Head Attention", "Transformer", "Softmax", "Flash Attention"] }
 ],
 k: [
  "Query is what a position wants, key is what it offers, value is what it contributes — all three from the same input.",
  "Attention is: score every query against every key, scale by √d, softmax, blend the values.",
  "The √d scaling stops softmax saturating; without it gradients vanish in high dimensions.",
  "Multiple heads split the dimension so different relationships can be tracked in parallel.",
  "A causal triangular mask makes a decoder; no mask makes an encoder; a padding mask is always required with variable lengths."
 ],
 r: ["Attention Mechanism", "Self-Attention", "Multi-Head Attention", "Transformer", "Softmax", "Flash Attention", "KV Cache"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "scores = Q @ K.transpose(-2, -1) / math.sqrt(d)", w: "every query against every key, scaled" },
   { c: "scores.masked_fill(mask == 0, float('-inf'))", w: "forbid attending to a position" },
   { c: "weights = F.softmax(scores, dim=-1)", w: "turn scores into a distribution over positions" },
   { c: "torch.tril(torch.ones(T, T))", w: "the causal mask that makes a generator" },
   { c: "q.view(B, T, h, dk).transpose(1, 2)", w: "split into heads and move the head dimension next to batch" }
  ]
 }
},

{
 t: "The Transformer Block, Built",
 m: "attn",
 lvl: "intermediate",
 s: "Attention plus three more pieces, stacked N times — the whole architecture.",
 goal: [
  "Name every component of a transformer block and say what each contributes",
  "Explain why positional encoding is necessary at all",
  "Assemble a working small language model"
 ],
 b: [
  { p: "A transformer block is attention, a feed-forward network, two normalisations and two residual connections. Stack it 12 times for GPT-2, 96 for GPT-3. The block does not change with scale — only how many of them there are and how wide." },

  { h: "Position, which attention destroys" },
  { p: "Attention is a weighted sum, and a sum has no order. **\"Dog bites man\"** and **\"man bites dog\"** produce identical attention outputs — the same set of tokens, blended the same way. Order must be added back explicitly." },

  { tbl: { t: "Three ways to encode position",
    h: ["Method", "How", "Used by"],
    rows: [
     ["**Sinusoidal**", "Fixed sine and cosine waves of different frequencies, added to the embedding", "Original transformer. Elegant; extrapolates poorly in practice"],
     ["**Learned absolute**", "A trainable embedding per position", "GPT-2, BERT. Simple, and **hard-caps the context length**"],
     ["**RoPE** (rotary)", "**Rotate** the query and key vectors by an angle proportional to position", "**Llama, Mistral, most modern models.** Encodes relative distance naturally and extends better"]
    ] } },

  { n: "RoPE won because of a property that falls out of the maths: rotating both query and key means their dot product depends on the *difference* between positions, not the absolute values. The model learns *five tokens back* rather than *position 847*, which is what actually generalises — and it is why context extension techniques operate on RoPE frequencies.",
    nt: "Why rotary encoding took over" },

  { h: "The feed-forward network" },
  { code: { lang: "python", t: "Two thirds of the parameters live here",
    lines: [
     { c: "self.ff = nn.Sequential(", w: "" },
     { c: "    nn.Linear(d_model, 4 * d_model),", w: "**Expand fourfold.** The 4× ratio is near-universal and largely empirical.", hi: true },
     { c: "    nn.GELU(),", w: "**A smoothed ReLU.** Non-zero gradient for slightly negative inputs, which trains better. SwiGLU is the current preference in the largest models." },
     { c: "    nn.Linear(4 * d_model, d_model),", w: "**Project back down.**" },
     { c: "    nn.Dropout(0.1),", w: "" },
     { c: ")", w: "" }
    ],
    after: "Attention moves information *between* positions. The feed-forward network processes each position *independently* — it is where per-token computation happens. Roughly two thirds of a transformer's parameters are here, not in attention, which surprises most people." } },

  { h: "The residual connections" },
  { code: { lang: "python", t: "The block, complete",
    lines: [
     { c: "class Block(nn.Module):", w: "" },
     { c: "    def __init__(self, d_model, n_heads):", w: "" },
     { c: "        super().__init__()", w: "" },
     { c: "        self.ln1  = nn.LayerNorm(d_model)", w: "" },
     { c: "        self.attn = MultiHeadAttention(d_model, n_heads)", w: "" },
     { c: "        self.ln2  = nn.LayerNorm(d_model)", w: "" },
     { c: "        self.ff   = FeedForward(d_model)", w: "" },
     { c: "", w: "" },
     { c: "    def forward(self, x):", w: "" },
     { c: "        x = x + self.attn(self.ln1(x))", w: "**Pre-norm plus residual.** Normalise, attend, add back to the input.", hi: true },
     { c: "        x = x + self.ff(self.ln2(x))", w: "**Same shape again.** Communicate, then compute." },
     { c: "        return x", w: "" }
    ],
    after: "The `x +` is doing more work than it looks. Because the input is added to the output, gradients have an uninterrupted path from the loss back to every layer — the addition's derivative is 1, so nothing shrinks. That is what makes 96 layers trainable at all, and it comes straight from ResNet in 2015." } },

  { ana: "Think of `x` as a shared workspace passing through the stack, sometimes called the residual stream. Each block reads it, computes something, and *adds* its contribution rather than replacing it. Nothing is overwritten, so information from the embedding layer is still present at layer 90, and the gradient path back is clean. Every modern deep architecture is built on this one idea.",
    at: "The residual stream" },

  { h: "The whole model" },
  { code: { lang: "python", file: "gpt.py", t: "A small GPT, end to end",
    lines: [
     { c: "class MiniGPT(nn.Module):", w: "" },
     { c: "    def __init__(self, vocab, d=384, n_heads=6, n_layers=6, T=256):", w: "**About 10M parameters** — trainable on a laptop in an evening." },
     { c: "        super().__init__()", w: "" },
     { c: "        self.tok = nn.Embedding(vocab, d)", w: "**Token id → vector.** A lookup table, and the model's entire vocabulary knowledge starts here." },
     { c: "        self.pos = nn.Embedding(T, d)", w: "**Learned absolute position.** This caps context at T." },
     { c: "        self.blocks = nn.ModuleList([Block(d, n_heads) for _ in range(n_layers)])", w: "**`ModuleList`, not a plain list** — a plain list does not register its contents as parameters, and the model silently trains nothing.", hi: true },
     { c: "        self.ln_f = nn.LayerNorm(d)", w: "A final normalisation before the output head." },
     { c: "        self.head = nn.Linear(d, vocab, bias=False)", w: "**Project to vocabulary size.** One logit per possible next token." },
     { c: "", w: "" },
     { c: "    def forward(self, idx):", w: "**idx is (B, T) integer token ids.**" },
     { c: "        B, T = idx.shape", w: "" },
     { c: "        x = self.tok(idx) + self.pos(torch.arange(T, device=idx.device))", w: "**Meaning plus position, added.** (B, T, d).", hi: true },
     { c: "        for blk in self.blocks:", w: "" },
     { c: "            x = blk(x)", w: "**Same shape all the way through the stack.**" },
     { c: "        return self.head(self.ln_f(x))", w: "**(B, T, vocab).** A prediction for the next token at every position simultaneously — which is why training is efficient." }
    ] } },

  { n: "That last point is worth pausing on. A causal transformer predicts the next token at *every* position in one forward pass. A 256-token sequence yields 256 training signals from one pass. That parallelism during training, combined with the parallelism inside attention, is the entire reason large-scale pretraining is affordable — and it is precisely what an RNN could not do.",
    nt: "Why pretraining is affordable" },

  { h: "Where the parameters are" },
  { tbl: { t: "A GPT-2-sized model, by component",
    h: ["Component", "Parameters", "Share"],
    rows: [
     ["Token embeddings (50k × 768)", "38M", "31%"],
     ["Attention (12 layers)", "28M", "23%"],
     ["**Feed-forward (12 layers)**", "**57M**", "**46%**"],
     ["Norms, positions, misc", "~1M", "1%"],
     ["**Total**", "**124M**", ""]
    ] } },

  { p: "The feed-forward layers hold more parameters than attention, by roughly two to one. This is why mixture-of-experts architectures replace the feed-forward block specifically — it is where the parameters are, so it is where sparsity buys the most." },

  { h: "The families, from one design" },
  { tbl: { t: "Three arrangements of the same block",
    h: ["Family", "Structure", "Trained to", "Examples"],
    rows: [
     ["**Decoder-only**", "Causal mask, one stack", "Predict the next token", "**GPT, Claude, Llama, Mistral.** The dominant design"],
     ["**Encoder-only**", "No mask, one stack", "Fill in masked tokens", "BERT and its descendants. Still excellent for embeddings and classification"],
     ["**Encoder-decoder**", "Both stacks, cross-attention between them", "Map one sequence to another", "T5, original translation models"]
    ] } },

  { tryit: { t: "Train a tiny language model tonight",
    task: "Implement MiniGPT and train it on a plain text file — a book, your own notes, anything a few hundred KB. Use character-level tokenisation to keep it simple. Generate 200 characters after 1 epoch and after 20.",
    hint: "Andrej Karpathy's nanoGPT is the canonical minimal reference for this, but write it yourself first. Character-level means your vocabulary is just `sorted(set(text))`.",
    sol: { lang: "python", code: "# character-level tokenisation -- the whole tokeniser\ntext  = open('input.txt').read()\nchars = sorted(set(text))\nstoi  = {c: i for i, c in enumerate(chars)}\nitos  = {i: c for c, i in stoi.items()}\nencode = lambda s: [stoi[c] for c in s]\ndecode = lambda l: ''.join(itos[i] for i in l)\n\n@torch.no_grad()\ndef generate(model, idx, n, temp=1.0):\n    for _ in range(n):\n        logits = model(idx[:, -256:])[:, -1, :] / temp   # last position only\n        probs  = F.softmax(logits, dim=-1)\n        nxt    = torch.multinomial(probs, 1)             # sample, do not argmax\n        idx    = torch.cat([idx, nxt], dim=1)\n    return idx\n\n# after ~1 epoch:   \"ther sos an the the tho oue and\"\n# after ~20 epochs: \"the streets were quiet and the men\n#                    had gone down to the river before dawn\"" },
    w: "Watching gibberish become word-shaped, then grammatical, over an evening on your own laptop is the single best demystification available in this field. It is the same architecture as the frontier models — six layers instead of ninety-six, and a book instead of the internet. Whatever else you skip, do not skip this one." } },

  { vocab: ["Transformer", "Positional Encoding", "Residual Connection", "Layer Normalisation", "GELU"] }
 ],
 k: [
  "A block is: pre-norm, attention, residual; pre-norm, feed-forward, residual. Stack N of them.",
  "Attention has no notion of order, so position must be added — RoPE is the modern default because it encodes relative distance.",
  "The feed-forward network expands 4×, processes each position independently, and holds most of the parameters.",
  "Residual connections give gradients an uninterrupted path, which is what makes deep stacks trainable.",
  "A causal transformer predicts the next token at every position in one pass — the reason pretraining is affordable."
 ],
 r: ["Transformer", "Positional Encoding", "Residual Connection", "Layer Normalisation", "Self-Attention", "Large Language Model"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "x = x + self.attn(self.ln1(x))", w: "pre-norm attention with a residual" },
   { c: "x = x + self.ff(self.ln2(x))", w: "pre-norm feed-forward with a residual" },
   { c: "nn.Linear(d_model, 4 * d_model)", w: "the 4x expansion where most parameters live" },
   { c: "nn.ModuleList([Block(d, h) for _ in range(n)])", w: "register a stack of blocks — a plain list would not" },
   { c: "self.tok(idx) + self.pos(torch.arange(T))", w: "meaning plus position, the model's actual input" }
  ]
 }
}

]);
