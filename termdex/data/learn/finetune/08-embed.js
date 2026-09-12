/* Fine-Tuning & Model Adaptation — retrievers, rerankers and distillation. */
TD.addLessons("finetune", [

{
 t: "Fine-Tuning Retrievers and Rerankers",
 m: "embed",
 lvl: "intermediate",
 s: "Contrastive training, hard negatives, and the fine-tune with the best return that almost nobody does.",
 goal: [
  "Decide whether to tune the embedding model or the reranker, and why the second is usually first",
  "Mine hard negatives without poisoning the dataset with false ones",
  "Train and evaluate a retriever adaptation on your own corpus"
 ],
 b: [
  { p: "Everyone who wants to fine-tune reaches for the generator. But in a RAG system the generator is rarely the bottleneck — retrieval is. Adapting an embedding model or a reranker to your own vocabulary is cheaper, faster, less risky and frequently produces a larger end-to-end improvement, and it is the fine-tune the fewest people have done." },

  { h: "Exhaust the cheap fixes first" },
  { ol: [
   "**Add BM25 and fuse with RRF.** Dense retrieval fails on exact tokens — part numbers, error codes, rare acronyms. This is usually the single largest improvement available and it costs an afternoon.",
   "**Add an off-the-shelf cross-encoder reranker.** Retrieve 100, rerank to 8. Another large, cheap win.",
   "**Fix chunking.** Contextual headers on chunks routinely move recall more than any model change.",
   "**Then, and only then, train.** Saying this order out loud before proposing training is most of a good interview answer."
  ] },

  { h: "Which model to tune" },
  { tbl: { t: "Bi-encoder or cross-encoder",
    h: ["", "Bi-encoder (embedding)", "Cross-encoder (reranker)"],
    rows: [
     ["Reads", "Query and document **separately**", "Query and document **together**"],
     ["Output", "Two vectors, compared by cosine", "One relevance score"],
     ["Precomputable?", "**Yes** — the corpus is indexed offline", "No — every pair at query time"],
     ["Scale", "Millions of documents, milliseconds", "~100 documents, tens of ms"],
     ["Accuracy", "Good", "**Much better**"],
     ["Cost of retraining", "**Re-embed the whole corpus**", "**Nothing — no re-index**"]
    ] } },

  { n: "That last row decides it. Training a new embedding model means re-embedding every chunk, a migration, and a dual-index rollout. Training a reranker means deploying a new model and nothing else. **Train the reranker first** — it is cheaper to build, cheaper to ship, and it is where the precision gains are.\n\nDiagnose which you need from your own numbers: if **recall@100 is high but recall@5 is low**, the right documents are being found and mis-ranked — that is a reranker problem. If **recall@100 is itself low**, the retriever never finds them and no reranker can help.",
    nt: "The diagnosis, and the answer" },

  { h: "Contrastive training, in one picture" },
  { code: { lang: "text", t: "What the model is being taught",
    lines: [
     { c: "  For a query q with its correct passage d+ and negatives d-:" },
     { c: "" },
     { c: "    pull  sim(q, d+)  UP" },
     { c: "    push  sim(q, d-)  DOWN" },
     { c: "" },
     { c: "  InfoNCE loss:" },
     { c: "" },
     { c: "    L = -log   exp(sim(q,d+)/T)" },
     { c: "             -----------------------------" },
     { c: "             sum over d+ and all d- of exp(sim/T)" },
     { c: "" },
     { c: "  T (temperature) around 0.02-0.05." },
     { c: "  Lower T sharpens the distribution and weights the HARDEST" },
     { c: "  negatives most -- too low and training destabilises.", hi: true },
     { c: "" },
     { c: "  The negatives are the entire signal. Everything below is" },
     { c: "  about getting them right.", hi: true }
    ] } },

  { h: "Negatives: the whole difficulty" },
  { l: [
   "**In-batch negatives.** Every other document in the batch counts as a negative. Free, which is why contrastive training wants large batches — more negatives per step. But a random document is trivially distinguishable from the right one, so the gradient signal saturates quickly.",
   "**Hard negatives.** Documents your *current* retriever ranks highly and that are nonetheless wrong. These teach the distinctions that actually matter. Mine them by running your existing retriever over the training queries and taking ranks roughly 10–50.",
   "**Not the top ranks.** Ranks 1–10 are disproportionately *correct* documents you have not labelled. Taking them as negatives teaches the model that right answers are wrong.",
   "**False negatives are the failure mode.** A mined hard negative is often a second correct passage. Filter with a cross-encoder or a model check before training — this single step is what separates a retriever fine-tune that helps from one that quietly makes things worse."
  ] },

  { code: { lang: "python", file: "mine.py", t: "Mining hard negatives safely",
    lines: [
     { c: "def mine_hard_negatives(pairs, retriever, judge, n_neg=8):", w: "" },
     { c: "    out = []", w: "" },
     { c: "    for q, positive in pairs:", w: "" },
     { c: "        cands = retriever.search(q, k=60)", w: "**Retrieve deep.** You are looking for plausible wrong answers, and they are not at rank 2." },
     { c: "", w: "" },
     { c: "        pool = [c for c in cands[10:50]", w: "**Skip the top 10.** They are disproportionately unlabelled positives.", hi: true },
     { c: "                if c.id != positive.id]", w: "" },
     { c: "", w: "" },
     { c: "        negatives = []", w: "" },
     { c: "        for c in pool:", w: "" },
     { c: "            if judge.is_relevant(q, c.text):", w: "**The false-negative filter.** A cheap cross-encoder or a small model asked 'does this passage answer the question'.", hi: true },
     { c: "                continue                       # it IS a positive", w: "" },
     { c: "            if near_duplicate(c.text, positive.text):", w: "**Near-duplicates of the positive are also positives.** Corpora are full of them." },
     { c: "                continue", w: "" },
     { c: "            negatives.append(c)", w: "" },
     { c: "            if len(negatives) == n_neg:", w: "" },
     { c: "                break", w: "" },
     { c: "", w: "" },
     { c: "        if len(negatives) >= 4:", w: "**Drop queries with too few clean negatives** rather than padding with random ones." },
     { c: "            out.append({'query': q, 'positive': positive.text,", w: "" },
     { c: "                        'negatives': [n.text for n in negatives]})", w: "" },
     { c: "    return out", w: "" }
    ],
    out: "queries               2,140\ncandidates mined    107,000\nfiltered: relevant  -18,412   <- would have been FALSE negatives\nfiltered: near-dup   -4,905\nusable negatives     83,683\nqueries kept          2,018" } },

  { trap: "In that output, 18,412 of the mined \"hard negatives\" were actually relevant passages. Training on them teaches the model that correct answers are wrong, and the result is a retriever that is *worse* than the one you started with — while the training loss looks perfectly healthy. This filter is not optional, and skipping it is the most common way a retriever fine-tune fails." },

  { h: "Training a reranker" },
  { code: { lang: "python", file: "train_reranker.py", t: "The cheaper, higher-return option",
    lines: [
     { c: "from sentence_transformers import CrossEncoder", w: "" },
     { c: "from sentence_transformers.cross_encoder.losses import BinaryCrossEntropyLoss", w: "" },
     { c: "", w: "" },
     { c: "model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L6-v2',", w: "**Start from a trained reranker**, never from a plain language model. It already knows what relevance means.", hi: true },
     { c: "                     num_labels=1)", w: "" },
     { c: "", w: "" },
     { c: "# (query, passage, label) triples", w: "" },
     { c: "train = []", w: "" },
     { c: "for ex in mined:", w: "" },
     { c: "    train.append((ex['query'], ex['positive'], 1.0))", w: "" },
     { c: "    for neg in ex['negatives'][:4]:", w: "" },
     { c: "        train.append((ex['query'], neg, 0.0))", w: "**Roughly 1:4 positive to negative.** Far more negatives and the model learns to say no to everything." },
     { c: "", w: "" },
     { c: "model.fit(train, epochs=2, warmup_steps=500,", w: "**Two epochs.** Rerankers overfit quickly on a few thousand queries." },
     { c: "          optimizer_params={'lr': 2e-5})", w: "**Full fine-tuning here is fine** — these models are 20–130M parameters, not 8B." },
     { c: "", w: "" },
     { c: "model.save('models/reranker-v2')", w: "**And no re-indexing.** Deploy it and the whole corpus benefits immediately.", hi: true }
    ] } },

  { h: "Training an embedding model" },
  { code: { lang: "python", file: "train_embed.py", t: "When the reranker is not enough",
    lines: [
     { c: "from sentence_transformers import SentenceTransformer, losses", w: "" },
     { c: "from sentence_transformers.training_args import SentenceTransformerTrainingArguments", w: "" },
     { c: "", w: "" },
     { c: "model = SentenceTransformer(BASE_EMBEDDING_MODEL)", w: "**Start from a strong current model.** Training from scratch is never the answer here." },
     { c: "", w: "" },
     { c: "loss = losses.MultipleNegativesRankingLoss(model)", w: "**InfoNCE with in-batch negatives, plus your explicit hard negatives.**", hi: true },
     { c: "", w: "" },
     { c: "args = SentenceTransformerTrainingArguments(", w: "" },
     { c: "    output_dir='out/embed-v2',", w: "" },
     { c: "    num_train_epochs=1,", w: "**One epoch.** Embedding models drift from their general capability very fast." },
     { c: "    per_device_train_batch_size=64,", w: "**As large as memory allows.** Batch size *is* the number of in-batch negatives, so it directly controls signal strength.", hi: true },
     { c: "    learning_rate=2e-5,", w: "" },
     { c: "    warmup_ratio=0.1,", w: "" },
     { c: "    bf16=True,", w: "" },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "# And remember: this means re-embedding the entire corpus,", w: "" },
     { c: "# a dual index and a shadow-read rollout. Budget for it.", w: "**The reason to try the reranker first.**", hi: true }
    ] } },

  { h: "Distillation: the other high-return fine-tune" },
  { l: [
   "**The idea.** A large model does your task well and costs too much. Log its inputs and outputs on real traffic, verify them, and train a small model on the survivors. The small model inherits the behaviour at a fraction of the cost.",
   "**Verification is what makes it work.** Schema validity, arithmetic consistency, execution, entailment against a source. Unverified distillation copies the teacher's mistakes and pays for the privilege.",
   "**Use real inputs.** A model trained on synthetic inputs is good at synthetic inputs.",
   "**Expect 90–98% of teacher quality** on a narrow task, at 3–10% of the cost. That ratio is the business case, and it is the most defensible reason to fine-tune anything.",
   "**Check the provider's terms.** Some prohibit using outputs to train competing models. This is a real constraint, not a technicality, and raising it unprompted in an interview reads well.",
   "**The same trick works for rerankers.** Distil a cross-encoder's judgements into a bi-encoder, and you get a retriever that behaves more like a reranker at index-time cost."
  ] },

  { tryit: { t: "Move retrieval recall with the cheapest change available",
    task: "On your own RAG corpus: measure recall@5, recall@20 and recall@100 on 200 labelled queries. Use the pattern to diagnose whether you have a retrieval or a ranking problem. Then apply fixes in order — hybrid search, an off-the-shelf reranker, a fine-tuned reranker — measuring after each. Stop when you hit your target and report what each step bought.",
    hint: "Recall@100 high and recall@5 low means ranking. Recall@100 low means retrieval. Fixing the wrong one wastes a week, and the diagnosis takes ten minutes.",
    sol: { lang: "text", code: "# 200 labelled queries, 84,000 chunks\n\n                              r@5    r@20   r@100   answer F1\n  dense only                  0.61   0.78   0.91      0.68\n  + BM25, RRF fused           0.74   0.88   0.96      0.79   <- 1 afternoon\n  + off-the-shelf reranker    0.83   0.91   0.96      0.85   <- 1 day\n  + fine-tuned reranker       0.89   0.94   0.96      0.89   <- 4 days\n  + fine-tuned embeddings     0.91   0.95   0.98      0.90   <- 2 weeks\n                                                              + re-index\n\n# DIAGNOSIS, read from the first row:\n#   r@100 = 0.91 but r@5 = 0.61.\n#   The right chunk is found 91% of the time and ranked into\n#   the top 5 only 61% of the time. That is a RANKING problem,\n#   and it says the reranker is where the return is.\n#\n#   Had r@100 been 0.62, no reranker could have helped and the\n#   retriever would have been the only place to work.\n\n# WHAT EACH STEP COST AND BOUGHT:\n#   BM25 fusion       1 afternoon   +13 r@5, +11 answer F1\n#   OTS reranker      1 day         + 9 r@5, + 6 F1, +40ms\n#   tuned reranker    4 days        + 6 r@5, + 4 F1, no re-index\n#   tuned embeddings  2 weeks       + 2 r@5, + 1 F1, FULL re-index\n#\n# I stopped at the fine-tuned reranker. The embedding fine-tune\n# bought one point of answer quality for two weeks of work and a\n# migration -- and that migration is a permanent operational\n# cost, because every future model change now needs the same\n# dual-index dance.\n#\n# The whole exercise: 5 days, +21 points of answer F1, and the\n# generator was never touched." },
    w: "This table is one of the most useful things you can carry into an AI engineering interview. It shows a diagnosis, an ordered set of interventions, a measured return for each, and a decision to stop — which is the judgement being assessed. It also quietly makes the point that most people miss: the generator was never the problem." } },

  { vocab: ["Embedding", "Reranking", "Contrastive Learning", "Knowledge Distillation", "Sentence Embedding", "Retrieval-Augmented Generation"] }
 ],
 k: [
  "Train the reranker before the embedding model — same signal, no re-indexing, far cheaper to ship.",
  "Diagnose from recall: high r@100 with low r@5 is a ranking problem; low r@100 is a retrieval problem.",
  "Hard negatives are the entire training signal, and false negatives among them are how the fine-tune silently fails.",
  "Skip the top 10 candidates when mining negatives — they are disproportionately unlabelled positives.",
  "Distillation with verification is the most defensible fine-tune there is: 90–98% of teacher quality at 3–10% of cost."
 ],
 r: ["Embedding", "Reranking", "Contrastive Learning", "Knowledge Distillation", "Retrieval-Augmented Generation", "Vector Database"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "pool = [c for c in retriever.search(q, k=60)[10:50]]", w: "mine hard negatives from the middle ranks, not the top" },
   { c: "if judge.is_relevant(q, c.text): continue", w: "filter out false negatives before training on them" },
   { c: "loss = losses.MultipleNegativesRankingLoss(model)", w: "contrastive loss using in-batch plus explicit negatives" },
   { c: "CrossEncoder('cross-encoder/ms-marco-MiniLM-L6-v2', num_labels=1)", w: "start a reranker from a model that already knows relevance" }
  ]
 }
}

]);
