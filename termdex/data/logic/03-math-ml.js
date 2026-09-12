/* Logic Vault — the maths that appears in real work, and ML core logic.

   Nothing here is included for completeness. Every card is something that
   turns up in a paper, a code review, a metric argument or an interview. */

TD.addLogicDeck("math", {
  id: "math-working",
  name: "The working set",
  lvl: "core",
  why: "Enough to read a paper, size a model and refuse to be fooled by a number.",
  cards: [

    { t: "Bayes' theorem",
      recall: "P(A|B) = P(B|A) x P(A) / P(B). Posterior = likelihood x prior / evidence.",
      why: "It is how you update a belief when evidence arrives, and it is the reason a highly accurate test for a rare disease still yields mostly false positives. The prior dominates when the base rate is low — which is the single most misunderstood fact in applied statistics.",
      num: [["Disease rate", "1 in 1,000"], ["Test accuracy", "99%"], ["P(sick | positive)", "~9%"]],
      use: ["Spam filtering", "Medical and fraud screening", "Reasoning about any rare-event classifier",
            "Explaining why 99% accuracy can be worthless"],
      trap: "Base rate neglect. If your positive class is 0.1% of traffic, a model with 99% accuracy that predicts 'negative' every time beats it. Always ask what the base rate is before quoting accuracy.",
      r: ["Bayes' Theorem", "Prior Probability", "Base Rate"] },

    { t: "Expectation and variance",
      recall: "Expectation is the long-run average. Variance is how far things typically sit from it.",
      why: "Expectation is linear — E[X + Y] = E[X] + E[Y] — whether or not the variables are independent, which makes it enormously useful for decomposing costs. Variance is not linear unless the variables are independent, and forgetting that is a common error.",
      use: ["Estimating average cost per request", "Reasoning about randomised algorithms",
            "Sizing how much a metric will bounce between runs"],
      trap: "A low variance and a good average can still hide a terrible tail. In latency and in model behaviour, the tail is what users experience.",
      r: ["Expected Value", "Variance", "Standard Deviation"] },

    { t: "Log rules and why logs are everywhere",
      recall: "log(ab) = log a + log b. Logs turn multiplication into addition, and tiny numbers into manageable ones.",
      why: "Probabilities multiply and underflow fast — a hundred probabilities of 0.01 multiplied together is 10^-200, which is zero in floating point. Summing their logs is numerically stable. That is why every model reports log-likelihood, cross-entropy uses a log, and perplexity is an exponentiated log.",
      use: ["Loss functions", "Naive Bayes", "Any product of many probabilities",
            "Log-scale plots when values span orders of magnitude"],
      trap: "log(0) is negative infinity. Always add a small epsilon before taking a log of anything that could be zero — this is why you see `log(p + 1e-9)` throughout ML code.",
      r: ["Logarithm", "Cross-Entropy", "Numerical Stability"] },

    { t: "Vectors and the dot product",
      recall: "The dot product measures alignment. Divide by both magnitudes and you get cosine similarity, from -1 to 1.",
      why: "It is the operation underneath all of retrieval. Two embeddings pointing the same direction have a large dot product regardless of length; cosine normalises out length so only direction — meaning — counts. Every vector search you will build is this arithmetic at scale.",
      use: ["Semantic search and RAG", "Recommendation", "Attention scores",
            "Any 'how similar are these two things' question"],
      trap: "Cosine similarity ignores magnitude entirely, which is usually what you want for text but not always. And a similarity of 0.8 means nothing in the abstract — it is only meaningful relative to the distribution of scores in your own corpus.",
      r: ["Dot Product", "Cosine Similarity", "Embedding"] },

    { t: "Matrix shapes",
      recall: "(m x n) times (n x p) gives (m x p). The inner dimensions must match and they disappear.",
      why: "Nearly every deep learning error is a shape error, and this one rule diagnoses most of them. A batch of 32 sentences with 128 tokens embedded in 768 dimensions is (32, 128, 768) — being able to read that shape aloud and say what each axis means is a core fluency.",
      num: [["(32, 768) x (768, 10)", "(32, 10)"], ["batch, seq, hidden", "the standard order"]],
      use: ["Debugging any shape mismatch", "Reading a model definition",
            "Sizing a linear layer's parameter count"],
      trap: "Broadcasting silently makes some wrong shapes work. A (32, 1) and a (1, 32) combine into (32, 32) without complaint, which is almost never what you meant — and it surfaces as a nonsensical loss rather than an error.",
      r: ["Matrix Multiplication", "Broadcasting", "Tensor"] },

    { t: "The normal distribution and the 68-95-99.7 rule",
      recall: "One sigma covers 68%, two covers 95%, three covers 99.7%.",
      why: "It gives you an instant sense of whether something is unusual. It also underpins confidence intervals and A/B tests, and the central limit theorem means averages of almost anything tend to normal even when the underlying data is not.",
      use: ["Anomaly detection thresholds", "Reading error bars", "Sizing an A/B test"],
      trap: "Latency and income are not normal — they are long-tailed, so mean plus standard deviation badly understates the extremes. For those, use percentiles, not sigmas.",
      r: ["Normal Distribution", "Central Limit Theorem", "Percentile"] },

    { t: "Gradient, in one sentence",
      recall: "The vector of partial derivatives — it points in the direction of steepest increase.",
      why: "Training walks the opposite way, downhill, scaled by the learning rate. That is the entirety of gradient descent, and understanding it as 'which way is up, so go the other way' demystifies most of deep learning.",
      use: ["Explaining any optimiser", "Reasoning about learning rate",
            "Understanding why gradients vanish or explode"],
      trap: "Too large a learning rate overshoots and diverges; too small crawls or sticks in a bad region. It is the hyperparameter that matters most, and it is the first one to tune.",
      r: ["Gradient Descent", "Learning Rate", "Backpropagation"] }
  ]
});

TD.addLogicDeck("ml", {
  id: "ml-core",
  name: "The core logic",
  lvl: "core",
  why: "These decide whether a model is genuinely good or merely looks good, which is most of the job.",
  cards: [

    { t: "Bias-variance",
      recall: "Bias is wrong assumptions (underfitting). Variance is sensitivity to the training data (overfitting).",
      why: "High bias means the model is too simple to capture the pattern — it fails on training and test alike. High variance means it memorised noise — near-perfect on training, poor on test. The gap between training and validation score tells you which one you have, and therefore what to do next.",
      num: [["Train 60%, test 58%", "high bias — bigger model"],
            ["Train 99%, test 62%", "high variance — more data or regularisation"]],
      use: ["Diagnosing any underperforming model", "Deciding between more data and a bigger model"],
      trap: "More data fixes variance, not bias. If the model underfits, collecting another million rows changes nothing — you need more capacity or better features.",
      r: ["Bias-Variance Tradeoff", "Overfitting", "Underfitting"] },

    { t: "Precision versus recall",
      recall: "Precision: of what I flagged, how much was right. Recall: of what was really there, how much did I catch.",
      why: "They trade off through the decision threshold, and which one matters is a product decision, not a technical one. A cancer screen wants recall — missing a case is catastrophic and a false alarm is a follow-up test. A spam filter wants precision — a lost legitimate email is worse than a spam that got through.",
      num: [["Precision", "TP / (TP + FP)"], ["Recall", "TP / (TP + FN)"], ["F1", "harmonic mean of both"]],
      use: ["Any classifier conversation", "Choosing a threshold", "Reporting results honestly"],
      trap: "Quoting accuracy on imbalanced data is the classic error. At 1% positives, always predicting negative scores 99%. Quote precision, recall and the base rate together or the number is meaningless.",
      r: ["Precision", "Recall", "F1 Score", "Confusion Matrix"] },

    { t: "Train / validation / test",
      recall: "Train fits the model, validation tunes your choices, test is touched once at the very end.",
      why: "Every time you look at a set and change something, you leak information into the model — so a set you have tuned against is no longer an unbiased estimate. The test set exists to answer 'how will this do on data nobody has seen', and it only answers that while it stays untouched.",
      use: ["Any experiment", "Explaining why the reported number dropped in production"],
      trap: "For time series, never split randomly. Training on future data to predict the past is leakage, gives an excellent offline number, and fails immediately in production. Split by time, always.",
      r: ["Train-Test Split", "Cross-Validation", "Data Leakage"] },

    { t: "Data leakage",
      recall: "Any information in training that will not exist at prediction time.",
      why: "It produces results that look too good, and they are. The classic forms: a feature computed after the outcome, normalising with statistics from the full dataset before splitting, or duplicate rows spanning both sides of the split.",
      use: ["Auditing a suspiciously strong result"],
      trap: "The rule of thumb: if a result is dramatically better than expected, look for leakage before celebrating. Fit the scaler on training data only, then apply it to validation and test.",
      code: { lang: "python", c: "scaler.fit(X_train)          # fit on train ONLY\nX_train = scaler.transform(X_train)\nX_val   = scaler.transform(X_val)" },
      r: ["Data Leakage", "Feature Engineering"] },

    { t: "Regularisation",
      recall: "Penalise complexity so the model prefers a simpler explanation. L1 zeroes features out; L2 shrinks them.",
      why: "Overfitting is a model using more flexibility than the evidence supports. Adding a penalty on weight size makes large weights cost something, so they only appear when the data justifies them. L1's penalty produces exact zeros, which is why it doubles as feature selection.",
      use: ["Any model overfitting", "Reducing feature count automatically (L1)"],
      trap: "Dropout, early stopping, data augmentation and weight decay are all regularisation. The question is never whether to regularise but which form suits the model — and stacking several without measuring is how you end up underfitting instead.",
      r: ["Regularisation", "Dropout"] },

    { t: "The confusion matrix",
      recall: "Four cells: true positive, false positive, false negative, true negative. Every classification metric is built from them.",
      why: "Once you can place the four numbers, you can derive precision, recall, specificity and accuracy without memorising formulas. It also forces the question that matters: which of the two error types is worse here?",
      use: ["Reporting classifier results", "Choosing a threshold with stakeholders"],
      trap: "False positive and false negative get swapped constantly under pressure. Anchor on the word after 'false' meaning what the *model* said: a false positive is the model saying yes when the truth is no.",
      r: ["Confusion Matrix", "Type I Error", "Type II Error"] },

    { t: "Supervised, unsupervised, reinforcement",
      recall: "Labels; no labels; rewards.",
      why: "It determines what data you need before anything else. Supervised needs labelled examples, which is usually the expensive part of the project. Unsupervised finds structure without them. Reinforcement learns from a reward signal over a sequence of actions.",
      use: ["Framing any new problem", "Estimating what the data will cost"],
      trap: "Most business problems are supervised, and most of the effort is labelling rather than modelling. A project that assumes labels exist and finds out otherwise has just doubled.",
      r: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"] }
  ]
});

TD.addLogicDeck("dl", {
  id: "dl-core",
  name: "Deep learning logic",
  lvl: "intermediate",
  why: "The mechanisms behind the models you will be asked to reason about, fine-tune and debug.",
  cards: [

    { t: "Backpropagation",
      recall: "The chain rule applied backwards through the network, reusing intermediate results.",
      why: "Each layer's gradient depends on the one after it, so computing from the output back means every partial derivative is used rather than recomputed. That reuse is what makes training a billion-parameter model feasible at all.",
      use: ["Explaining how any network learns", "Understanding why the graph must be kept during the forward pass"],
      trap: "The stored activations are why training uses far more memory than inference. Inference under `no_grad` frees that, which is the difference between a model that fits on your GPU and one that does not.",
      r: ["Backpropagation", "Chain Rule", "Autograd"] },

    { t: "Vanishing and exploding gradients",
      recall: "Multiply many small numbers and the signal dies; many large ones and it blows up.",
      why: "Gradients are products of per-layer terms, so depth compounds them. This is why deep networks were untrainable before residual connections, better initialisation and normalisation layers gave the gradient a clean path backwards.",
      use: ["Explaining why loss becomes NaN", "Justifying residual connections and gradient clipping"],
      trap: "NaN loss is almost always exploding gradients or a log of zero. Gradient clipping is the standard first response, and a lower learning rate the second.",
      r: ["Vanishing Gradient", "Gradient Clipping", "Residual Connection"] },

    { t: "Activation functions",
      recall: "Without a non-linearity, any stack of layers collapses into a single linear layer.",
      why: "That is the whole reason activations exist. ReLU won because it is cheap and does not saturate for positive inputs, which keeps gradients alive. GELU and SiLU are smoother variants used in modern transformers.",
      use: ["Explaining why depth helps at all", "Reading a model definition"],
      trap: "Dying ReLU: a unit stuck outputting zero has zero gradient forever and never recovers. Leaky ReLU and GELU exist partly to avoid this.",
      r: ["Activation Function", "ReLU", "Non-linearity"] },

    { t: "Attention, in one sentence",
      recall: "Every token computes a weighted average of every other token's value, weighted by query-key similarity.",
      why: "It removes the sequential bottleneck of recurrence — every position sees every other in one step rather than through a chain of hidden states. That parallelism is why transformers train on data at a scale RNNs never could.",
      num: [["Complexity", "O(n squared) in sequence length"],
            ["Doubling context", "quadruples attention cost"]],
      use: ["Explaining transformers", "Reasoning about why long context is expensive"],
      trap: "The quadratic cost is why context windows are the hard engineering problem they are. Flash attention changes the memory pattern, not the asymptotic cost.",
      r: ["Attention Mechanism", "Transformer", "Self-Attention"] },

    { t: "Normalisation layers",
      recall: "Batch norm normalises across the batch; layer norm normalises across features within one example.",
      why: "Both keep activations in a stable range so gradients behave. Layer norm won in transformers because it does not depend on batch size or on other examples — which matters when generating one token at a time with a batch of one.",
      use: ["Reading any modern architecture", "Explaining why batch norm behaves oddly at inference"],
      trap: "Batch norm behaves differently in training and evaluation — it uses running statistics at inference. Forgetting `model.eval()` gives subtly wrong predictions with no error message.",
      r: ["Batch Normalization", "Layer Normalization"] },

    { t: "Parameters, memory and the 4-byte rule",
      recall: "Roughly: parameters x 4 bytes in fp32, x 2 in fp16. Training needs about 4x the inference memory.",
      why: "It lets you answer 'will this fit' instantly. A 7B model is ~28 GB in fp32, ~14 GB in fp16, ~7 GB in int8. Training also stores gradients and optimiser state — Adam keeps two extra values per parameter — which is where the 4x comes from.",
      num: [["7B fp16 inference", "~14 GB"], ["7B fp32 training with Adam", "~112 GB"],
            ["Quantised to 4-bit", "~3.5 GB"]],
      use: ["Choosing a GPU", "Deciding whether to fine-tune or use an API",
            "Explaining why LoRA exists"],
      trap: "This ignores activations and KV cache, which grow with batch size and sequence length and are often what actually causes the out-of-memory error.",
      r: ["Quantisation", "LoRA", "GPU Memory"] }
  ]
});
