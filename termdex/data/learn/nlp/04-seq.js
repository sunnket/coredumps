/* NLP — Sequence models & attention. */
TD.addLessons("nlp", [

    {
        t: "Recurrent Neural Networks — Processing Text One Token at a Time",
        m: "seq",
        lvl: "intermediate",
        s: "How RNNs process sequences, why they struggle with long dependencies, and what LSTMs fixed.",
        goal: [
            "Understand how an RNN maintains a hidden state that carries information forward through a sequence",
            "Explain the vanishing gradient problem and why it limits RNN memory",
            "Know the LSTM cell structure and how gating solves long-range dependencies"
        ],
        b: [
            { p: "Before the transformer, sequence processing meant recurrence: read one token at a time, update a hidden state, and carry that state forward. RNNs made NLP aware of word order for the first time — and their limitations directly motivated everything that came after." },

            { h: "The Vanilla RNN" },
            { p: "At each time step, the RNN takes the current input and the previous hidden state, combines them through a weight matrix and a nonlinearity, and produces a new hidden state. In theory, that state carries information about every token seen so far. In practice, the gradient signal weakens exponentially with distance — by twenty tokens back, the model has forgotten." },

            {
                tbl: {
                    t: "RNN architecture evolution",
                    h: ["Architecture", "Key Innovation", "Long-Range Memory", "Training Speed", "Still Used?"],
                    rows: [
                        ["**Vanilla RNN**", "Hidden state carries sequence info", "Poor (vanishing gradients)", "Fast per step", "Rarely — educational only"],
                        ["**LSTM**", "Gated cell with forget/input/output gates", "Good (50-200 tokens)", "Slower per step", "Legacy systems, some edge cases"],
                        ["**GRU**", "Simplified LSTM with 2 gates instead of 3", "Good (similar to LSTM)", "Faster than LSTM", "Lightweight sequence tasks"],
                        ["**Bidirectional**", "Two passes — forward and backward", "Both directions", "2x slower", "BERT uses bidirectional attention"],
                        ["**Transformer**", "Self-attention replaces recurrence", "Excellent (context window)", "Parallelisable", "Dominant architecture"]
                    ]
                }
            },

            { h: "LSTM: Learning What to Remember and What to Forget" },
            { p: "The LSTM adds a **cell state** — a highway that runs through the sequence, modified only by gating operations. The **forget gate** decides what to discard, the **input gate** decides what new information to store, and the **output gate** controls what the hidden state exposes. This solves the vanishing gradient by providing a gradient path that does not pass through repeated squashing functions." },

            {
                code: {
                    lang: "python", t: "LSTM for text classification in PyTorch",
                    lines: [
                        { c: "import torch", w: "" },
                        { c: "import torch.nn as nn", w: "" },
                        { c: "", w: "" },
                        { c: "class TextLSTM(nn.Module):", w: "" },
                        { c: "    def __init__(self, vocab_size, embed_dim, hidden_dim, n_classes):", w: "" },
                        { c: "        super().__init__()", w: "" },
                        { c: "        self.embed = nn.Embedding(vocab_size, embed_dim)", w: "" },
                        { c: "        self.lstm = nn.LSTM(embed_dim, hidden_dim,", w: "" },
                        { c: "                           batch_first=True, bidirectional=True)", w: "**Bidirectional sees future context too.**", hi: true },
                        { c: "        self.fc = nn.Linear(hidden_dim * 2, n_classes)", w: "× 2 because bidirectional." },
                        { c: "", w: "" },
                        { c: "    def forward(self, x):", w: "" },
                        { c: "        emb = self.embed(x)              # (batch, seq, embed)", w: "" },
                        { c: "        out, (h, c) = self.lstm(emb)     # out: (batch, seq, hidden×2)", w: "" },
                        { c: "        last = out[:, -1, :]             # take last timestep", w: "**Final hidden state summarises the sequence.**", hi: true },
                        { c: "        return self.fc(last)", w: "" }
                    ]
                }
            },

            { trap: "RNNs process tokens sequentially — they cannot be parallelised across the sequence dimension. This makes training on long documents painfully slow compared to transformers, which process all tokens simultaneously." },

            { vocab: ["RNN", "Vanishing Gradient", "LSTM", "GRU"] }
        ],
        k: [
            "RNNs process sequences token by token, carrying a hidden state forward — but gradients vanish over long distances.",
            "LSTMs add gated cell states that preserve gradients over 50-200 tokens, solving the vanishing gradient problem.",
            "Sequential processing cannot be parallelised — this fundamental limitation is why transformers replaced RNNs."
        ],
        r: ["Neural Network", "Backpropagation", "Transformer", "Sequence Model"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "nn.LSTM(embed_dim, hidden_dim, batch_first=True, bidirectional=True)", w: "create a bidirectional LSTM layer" },
                { c: "out, (h, c) = self.lstm(embeddings)", w: "run LSTM forward, get outputs and states" },
                { c: "last_hidden = out[:, -1, :]", w: "extract the final timestep hidden state" }
            ]
        }
    },

    {
        t: "The Attention Mechanism — Teaching Models Where to Look",
        m: "seq",
        lvl: "intermediate",
        s: "How attention replaced fixed-length bottlenecks, and how self-attention enabled the transformer.",
        goal: [
            "Explain the query-key-value framework of scaled dot-product attention",
            "Understand why attention removed the information bottleneck in encoder-decoder models",
            "Know how multi-head attention lets a model attend to different relationship types simultaneously"
        ],
        b: [
            { p: "The encoder-decoder model compressed an entire source sentence into one fixed-size vector — a brutal bottleneck. Attention lets the decoder look back at every encoder position and dynamically weight which parts matter for the current output token. This single idea unlocked neural machine translation and led directly to the transformer." },

            { h: "Scaled Dot-Product Attention" },
            { p: "Three matrices: **Query** (what am I looking for?), **Key** (what do I contain?), and **Value** (what should I return?). Attention is: compute similarity between Q and K, scale, softmax to get weights, and take the weighted sum of V. That is the entire mechanism." },

            {
                code: {
                    lang: "python", t: "Attention from scratch — the core formula",
                    lines: [
                        { c: "import torch", w: "" },
                        { c: "import torch.nn.functional as F", w: "" },
                        { c: "import math", w: "" },
                        { c: "", w: "" },
                        { c: "def scaled_dot_product_attention(Q, K, V, mask=None):", w: "" },
                        { c: "    d_k = Q.size(-1)", w: "" },
                        { c: "    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)", w: "**QK^T / √d_k — the attention scores.**", hi: true },
                        { c: "", w: "" },
                        { c: "    if mask is not None:", w: "" },
                        { c: "        scores = scores.masked_fill(mask == 0, float('-inf'))", w: "Mask prevents attending to padding or future tokens." },
                        { c: "", w: "" },
                        { c: "    weights = F.softmax(scores, dim=-1)", w: "**Softmax normalises to a probability distribution.**", hi: true },
                        { c: "    return torch.matmul(weights, V), weights", w: "Weighted sum of values." }
                    ]
                }
            },

            { h: "Multi-Head Attention" },
            { p: "One attention head learns one kind of relationship (e.g. syntactic subject). Multiple heads running in parallel — typically 8 or 12 — let the model attend to several relationship types simultaneously. Their outputs are concatenated and projected." },

            { h: "Self-Attention: The Transformer's Core" },
            { p: "In self-attention, Q, K and V all come from the same sequence. Each token attends to every other token in the sequence — including itself. This is what lets a transformer process all positions in parallel and capture dependencies regardless of distance." },

            {
                tbl: {
                    t: "Attention types in modern NLP",
                    h: ["Type", "Q Source", "K/V Source", "Used In"],
                    rows: [
                        ["**Self-attention**", "Same sequence", "Same sequence", "Transformer encoder (BERT)"],
                        ["**Cross-attention**", "Decoder states", "Encoder outputs", "Transformer decoder (translation, T5)"],
                        ["**Causal self-attention**", "Same sequence", "Same sequence (masked future)", "GPT, autoregressive generation"]
                    ]
                }
            },

            { trap: "Self-attention has O(n²) complexity in sequence length. Doubling the context window quadruples the computation. This is the fundamental constraint behind context window limits, and why long-context models need architectural tricks like sliding windows or sparse attention." },

            { vocab: ["Multi-Head Attention", "Self-Attention", "Softmax"] }
        ],
        k: [
            "Attention computes a weighted sum of values, where weights are determined by query-key similarity — the Q/K/V framework.",
            "Multi-head attention runs multiple attention functions in parallel, capturing different types of relationships.",
            "Self-attention lets every token attend to every other token in parallel — enabling transformers to replace sequential RNNs."
        ],
        r: ["Transformer", "Neural Network", "BERT", "Large Language Model"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)", w: "compute scaled dot-product attention scores" },
                { c: "weights = F.softmax(scores, dim=-1)", w: "normalise attention scores to probabilities" },
                { c: "output = torch.matmul(weights, V)", w: "compute weighted sum of values" }
            ]
        }
    },

    {
        t: "Transformers for NLP — BERT, GPT & the Architecture That Changed Everything",
        m: "seq",
        lvl: "intermediate",
        s: "How encoder-only, decoder-only and encoder-decoder transformers serve different NLP tasks.",
        goal: [
            "Distinguish BERT-style (encoder-only), GPT-style (decoder-only) and T5-style (encoder-decoder) architectures",
            "Know which architecture fits which NLP task",
            "Understand how fine-tuning adapts a pretrained transformer to a downstream task"
        ],
        b: [
            { p: "The transformer architecture has three variants for NLP, and choosing the right one is the first architectural decision. Each sees text differently, which determines what tasks it excels at." },

            { h: "Encoder-Only (BERT family)" },
            { p: "Sees the entire input bidirectionally. Every token attends to every other. Ideal for **understanding** tasks: classification, NER, sentiment, similarity. Not designed for generation." },

            { h: "Decoder-Only (GPT family)" },
            { p: "Sees tokens left-to-right with a causal mask — each position can only attend to positions before it. Designed for **generation**: text completion, conversation, code. Now the dominant architecture for LLMs." },

            { h: "Encoder-Decoder (T5, BART)" },
            { p: "The encoder reads the full input bidirectionally; the decoder generates the output autoregressively, attending to the encoder through cross-attention. Designed for **sequence-to-sequence** tasks: translation, summarisation, question answering." },

            {
                tbl: {
                    t: "Which transformer architecture for which NLP task?",
                    h: ["Task", "Best Architecture", "Why", "Examples"],
                    rows: [
                        ["**Classification**", "Encoder (BERT)", "Needs full bidirectional context", "Sentiment, spam, topic"],
                        ["**NER / Token labelling**", "Encoder (BERT)", "Per-token output from bidirectional input", "Entity extraction, POS tagging"],
                        ["**Text generation**", "Decoder (GPT)", "Autoregressive left-to-right generation", "ChatGPT, code completion"],
                        ["**Translation**", "Enc-Dec (T5, mBART)", "Full input understanding + generation", "Google Translate"],
                        ["**Summarisation**", "Enc-Dec or Decoder", "Input → shorter output", "BART, GPT-4"],
                        ["**Semantic similarity**", "Encoder (Sentence-BERT)", "Paired sentence embeddings", "Search, deduplication"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Fine-tuning BERT for text classification",
                    lines: [
                        { c: "from transformers import AutoModelForSequenceClassification", w: "" },
                        { c: "from transformers import AutoTokenizer, Trainer, TrainingArguments", w: "" },
                        { c: "", w: "" },
                        { c: "model_name = 'bert-base-uncased'", w: "" },
                        { c: "tokenizer = AutoTokenizer.from_pretrained(model_name)", w: "" },
                        { c: "model = AutoModelForSequenceClassification.from_pretrained(", w: "" },
                        { c: "    model_name, num_labels=3)", w: "**Adds a classification head on top of BERT.**", hi: true },
                        { c: "", w: "" },
                        { c: "# Tokenise dataset", w: "" },
                        { c: "def tokenise(batch):", w: "" },
                        { c: "    return tokenizer(batch['text'], truncation=True, padding=True)", w: "" },
                        { c: "", w: "" },
                        { c: "dataset = dataset.map(tokenise, batched=True)", w: "" },
                        { c: "", w: "" },
                        { c: "# Train", w: "" },
                        { c: "args = TrainingArguments(", w: "" },
                        { c: "    output_dir='./results',", w: "" },
                        { c: "    num_train_epochs=3,", w: "" },
                        { c: "    per_device_train_batch_size=16,", w: "" },
                        { c: "    evaluation_strategy='epoch',", w: "**Evaluate after each epoch.**", hi: true },
                        { c: ")", w: "" },
                        { c: "trainer = Trainer(model=model, args=args,", w: "" },
                        { c: "    train_dataset=dataset['train'],", w: "" },
                        { c: "    eval_dataset=dataset['validation'])", w: "" },
                        { c: "trainer.train()", w: "" }
                    ]
                }
            },

            { trap: "Fine-tuning all of BERT on a small dataset (< 1000 examples) risks overfitting badly. For small data, freeze most layers and fine-tune only the top few, or use SetFit / few-shot approaches instead." },

            { vocab: ["Encoder-Decoder", "BERT", "GPT", "Fine-Tuning"] }
        ],
        k: [
            "Encoder-only (BERT) for understanding, decoder-only (GPT) for generation, encoder-decoder (T5) for sequence-to-sequence.",
            "Fine-tuning adds a task-specific head to a pretrained backbone and trains on downstream data.",
            "Match architecture to task: do not use GPT for classification or BERT for open-ended generation."
        ],
        r: ["Transformer", "BERT", "Large Language Model", "Transfer Learning", "Fine-Tuning"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "AutoModelForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)", w: "load BERT with a classification head" },
                { c: "tokenizer(text, truncation=True, padding=True)", w: "tokenise input for a transformer" },
                { c: "trainer = Trainer(model=model, args=args, train_dataset=ds)", w: "set up Hugging Face Trainer for fine-tuning" }
            ]
        }
    }

]);
