/* Deep Learning — neural networks from first principles. */
TD.addLessons("dl", [

{
 t: "One Neuron, and Why You Need More Than One",
 m: "nets",
 lvl: "core",
 s: "The smallest unit of deep learning, and the problem that killed the field for fifteen years.",
 goal: [
  "Write a single neuron from scratch and say what each part does",
  "Explain what a single layer fundamentally cannot learn",
  "Describe how a hidden layer solves it"
 ],
 b: [
  { p: "The whole of deep learning is one small idea, repeated at enormous scale. The idea is a **neuron**: multiply some inputs by some weights, add them up, add a constant, and bend the result." },

  { code: { lang: "python", t: "A neuron, in full",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "", w: "" },
     { c: "def neuron(x, w, b):", w: "" },
     { c: "    z = np.dot(x, w) + b", w: "**The weighted sum.** Exactly the linear model from the ML track." },
     { c: "    return max(0, z)", w: "**The bend.** ReLU. Without this line, depth is impossible — you proved that in the maths track.", hi: true },
     { c: "", w: "" },
     { c: "x = np.array([0.5, 0.8, 0.2])", w: "Three inputs." },
     { c: "w = np.array([0.4, -0.7, 0.9])", w: "**Three weights — what the neuron learned.** Positive means *this input argues for firing*, negative means against." },
     { c: "b = 0.1", w: "**The bias**: how eager the neuron is to fire regardless of input. A high bias means it activates easily." },
     { c: "", w: "" },
     { c: "neuron(x, w, b)", w: "0.4·0.5 + (-0.7)·0.8 + 0.9·0.2 + 0.1 = -0.06 → **max(0, -0.06) = 0.** Silent." }
    ],
    out: "0" } },

  { ana: "A neuron is a committee member with a fixed opinion about how much each piece of evidence matters, plus a personal threshold for speaking up. The weights are the opinion, the bias is the eagerness, and ReLU is the rule that you either say something positive or stay quiet. A network is millions of such members arranged in layers, each listening only to the layer before.",
    at: "The committee member" },

  { h: "A layer is many neurons at once" },
  { p: "You never write one neuron. You write a layer, and a layer is a matrix multiplication — which is why the maths track spent time on shapes." },

  { code: { lang: "python", t: "From one neuron to a layer",
    lines: [
     { c: "x = np.array([0.5, 0.8, 0.2])", w: "3 inputs." },
     { c: "W = np.random.randn(3, 4)", w: "**4 neurons, each with 3 weights.** One column per neuron.", hi: true },
     { c: "b = np.zeros(4)", w: "One bias per neuron." },
     { c: "", w: "" },
     { c: "h = np.maximum(0, x @ W + b)", w: "**All four neurons, one line.** (3,) @ (3,4) → (4,). ReLU applies element-wise.", hi: true },
     { c: "h.shape", w: "(4,) — four numbers, the layer's output." },
     { c: "", w: "" },
     { c: "X = np.random.randn(32, 3)", w: "**A batch of 32 examples.**" },
     { c: "H = np.maximum(0, X @ W + b)", w: "(32,3) @ (3,4) → (32,4). **The same code, 32 times the work, no loop.**" }
    ],
    after: "That is the entire forward pass of a layer, and it will not get more complicated. A hundred-billion-parameter model is this line, with bigger matrices, more of them, and attention deciding which rows talk to which." } },

  { h: "What one layer cannot do" },
  { p: "In 1969 Minsky and Papert published a proof that a single-layer network cannot learn XOR — *one or the other but not both*. The proof was correct, it was widely read as a verdict on the whole approach, and funding for neural networks largely evaporated for the next fifteen years." },

  { code: { lang: "python", t: "The four points that stopped a field",
    lines: [
     { c: "# x1  x2  | XOR", w: "" },
     { c: "#  0   0  |  0", w: "" },
     { c: "#  0   1  |  1", w: "" },
     { c: "#  1   0  |  1", w: "" },
     { c: "#  1   1  |  0", w: "**Try to draw one straight line separating the 1s from the 0s.**", hi: true },
     { c: "", w: "" },
     { c: "# You cannot. The 1s are on opposite corners.", w: "A single layer computes `w1·x1 + w2·x2 + b`, which is a straight line and nothing else." }
    ],
    after: "Any single layer, with any weights, draws one straight boundary. XOR needs a boundary that is not straight, so no single layer can ever learn it — and the same is true of almost every interesting problem." } },

  { h: "The hidden layer" },
  { p: "The fix is one layer in the middle. That layer transforms the input into a new space where the problem *is* linearly separable, and the output layer draws its straight line there." },

  { code: { lang: "python", t: "XOR, solved by hand",
    lines: [
     { c: "X = np.array([[0,0],[0,1],[1,0],[1,1]])", w: "" },
     { c: "", w: "" },
     { c: "W1 = np.array([[1.0, 1.0],", w: "" },
     { c: "               [1.0, 1.0]])", w: "" },
     { c: "b1 = np.array([0.0, -1.0])", w: "**Two hidden neurons with different biases.** Neuron A fires if either input is on; neuron B only if both are.", hi: true },
     { c: "", w: "" },
     { c: "H = np.maximum(0, X @ W1 + b1)", w: "" },
     { c: "print(H)", w: "" },
     { c: "", w: "" },
     { c: "W2 = np.array([[1.0], [-2.0]])", w: "**Output: take 'either' and subtract twice 'both'.** That is exactly XOR." },
     { c: "out = H @ W2", w: "" },
     { c: "print(out.ravel())", w: "" }
    ],
    out: "[[0. 0.]\n [1. 0.]\n [1. 0.]\n [2. 1.]]\n[0. 1. 1. 0.]",
    after: "Look at the hidden layer's output. In the original space the four points were not separable. In this new two-dimensional space — *at least one* and *both* — they are. The hidden layer did not classify anything; it re-described the problem so the output layer could." } },

  { n: "This is what people mean by *learning representations*. Each layer's job is to hand the next layer a more useful description of the input. In a vision model the first layers find edges, the middle ones find shapes, the later ones find objects — and nobody specified any of those. They emerged because they were useful for the layer above.",
    nt: "The core idea of deep learning" },

  { h: "How wide and how deep" },
  { p: "The universal approximation theorem says one hidden layer of sufficient width can approximate any continuous function. It is true, and it is much less useful than it sounds: *sufficient width* can mean exponentially many neurons." },

  { tbl: { t: "Depth against width",
    h: ["", "Wide and shallow", "Narrow and deep"],
    rows: [
     ["Can it represent anything?", "In theory, yes", "In theory, yes"],
     ["Neurons required in practice", "**Often exponentially many**", "**Far fewer** — each layer reuses the last one's work"],
     ["Trains easily?", "Yes", "Harder — vanishing gradients, until residual connections fixed it"],
     ["Used in practice", "Rarely", "**Always.** Depth is the whole point of the name"]
    ] } },

  { p: "Depth wins because it composes. Layer 3 does not rebuild edges from pixels; it uses the shapes layer 2 built from the edges layer 1 found. That reuse is why a 50-layer network beats a 1-layer network with the same parameter count, comfortably." },

  { h: "Counting parameters" },
  { code: { lang: "python", t: "Where the numbers come from",
    lines: [
     { c: "# a layer from n inputs to m outputs:", w: "" },
     { c: "#   weights: n * m", w: "" },
     { c: "#   biases:  m", w: "" },
     { c: "", w: "" },
     { c: "def params(sizes):", w: "" },
     { c: "    return sum(a*b + b for a, b in zip(sizes[:-1], sizes[1:]))", w: "" },
     { c: "", w: "" },
     { c: "params([784, 128, 64, 10])", w: "**109,386.** A small digit classifier.", hi: true },
     { c: "params([784, 512, 512, 512, 10])", w: "934,538. Deeper and wider." }
    ],
    out: "109386\n934538",
    after: "Compare with GPT-3's 175 billion. The arithmetic is identical; only the scale differs — which is genuinely the honest summary of the last decade of the field." } },

  { trap: "More parameters is not better. A network with more parameters than training examples can memorise the training set exactly, and frequently will. The regularisation module is about stopping that, and the practical rule is to start small — a network that underfits tells you something useful, while one that overfits perfectly tells you nothing at all." },

  { tryit: { t: "Break XOR, then fix it",
    task: "Train a single-layer network (no hidden layer) on the four XOR points using gradient descent, and watch it fail to get below 50% accuracy. Then add a two-neuron hidden layer and watch it succeed.",
    hint: "You can do this in scikit-learn: `MLPClassifier(hidden_layer_sizes=())` against `hidden_layer_sizes=(4,)`. Use enough iterations — 5000 — since it is a tiny dataset.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.neural_network import MLPClassifier\n\nX = np.array([[0,0],[0,1],[1,0],[1,1]])\ny = np.array([0, 1, 1, 0])\n\n# no hidden layer -- one straight boundary, and XOR has none\nflat = MLPClassifier(hidden_layer_sizes=(), max_iter=5000,\n                     random_state=0).fit(X, y)\nprint('no hidden layer :', flat.predict(X), 'acc', flat.score(X, y))\n\n# one hidden layer of 4 -- re-describes the problem, then separates it\ndeep = MLPClassifier(hidden_layer_sizes=(4,), max_iter=5000,\n                     random_state=0).fit(X, y)\nprint('hidden layer(4) :', deep.predict(X), 'acc', deep.score(X, y))" },
    w: "The flat network scores 0.5 — it is guessing, and no amount of training helps, because the function it can express does not include XOR. The hidden layer version reaches 1.0. Four data points, and you have reproduced the argument that shaped fifteen years of AI history and the fix that ended it." } },

  { vocab: ["Neural Network", "Perceptron", "Activation Function", "ReLU"] }
 ],
 k: [
  "A neuron is a weighted sum, a bias and a non-linear bend; a layer is all of them as one matrix multiply.",
  "A single layer can only draw a straight boundary, which is why it cannot learn XOR.",
  "A hidden layer re-describes the input in a space where the problem becomes separable.",
  "Depth beats width because each layer reuses the previous layer's work rather than rebuilding it.",
  "Parameters per layer are `in × out + out`; the arithmetic is the same at 100,000 and at 100 billion."
 ],
 r: ["Neural Network", "Perceptron", "Activation Function", "ReLU", "Deep Learning", "Multilayer Perceptron"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "z = np.dot(x, w) + b", w: "the weighted sum inside every neuron" },
   { c: "h = np.maximum(0, X @ W + b)", w: "a full layer: multiply, add bias, bend" },
   { c: "W = np.random.randn(3, 4)", w: "weights for 4 neurons taking 3 inputs each" },
   { c: "sum(a*b + b for a, b in zip(sizes[:-1], sizes[1:]))", w: "count a network's parameters" }
  ]
 }
},

{
 t: "A Network From Scratch, in NumPy",
 m: "nets",
 lvl: "intermediate",
 s: "Write the forward pass, the loss and the backward pass yourself. Once. It changes everything.",
 goal: [
  "Implement a two-layer network's forward pass",
  "Implement backpropagation by hand for that network",
  "Train it and watch the loss fall"
 ],
 b: [
  { p: "This is the most valuable hour in the whole track. Everything after it uses PyTorch, which hides all of this — and the difference between someone who has written it once and someone who has not is visible in every debugging session for the rest of their career." },

  { h: "The network" },
  { p: "Two layers: input → 16 hidden units with ReLU → 1 output with sigmoid. Binary classification. About sixty lines including the training loop." },

  { code: { lang: "python", file: "scratch_net.py", t: "Setup and forward pass",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "rng = np.random.default_rng(0)", w: "" },
     { c: "", w: "" },
     { c: "n_in, n_hidden = 2, 16", w: "" },
     { c: "", w: "" },
     { c: "W1 = rng.normal(0, np.sqrt(2/n_in), (n_in, n_hidden))", w: "**He initialisation** — scale by √(2/fan_in). Initialise too large and activations explode; too small and the signal dies before it reaches the output.", hi: true },
     { c: "b1 = np.zeros(n_hidden)", w: "**Biases start at zero.** Weights must not — symmetric weights make every neuron compute the same thing forever." },
     { c: "W2 = rng.normal(0, np.sqrt(2/n_hidden), (n_hidden, 1))", w: "" },
     { c: "b2 = np.zeros(1)", w: "" },
     { c: "", w: "" },
     { c: "def forward(X):", w: "" },
     { c: "    z1 = X @ W1 + b1", w: "**Pre-activation** of layer 1." },
     { c: "    a1 = np.maximum(0, z1)", w: "ReLU." },
     { c: "    z2 = a1 @ W2 + b2", w: "" },
     { c: "    a2 = 1 / (1 + np.exp(-z2))", w: "Sigmoid → a probability." },
     { c: "    return z1, a1, z2, a2", w: "**Return the intermediates.** The backward pass needs them, which is exactly why training uses more memory than inference.", hi: true }
    ] } },

  { code: { lang: "python", t: "The loss",
    lines: [
     { c: "def bce(y, p):", w: "**Binary cross-entropy.**" },
     { c: "    p = np.clip(p, 1e-9, 1 - 1e-9)", w: "**Essential.** `log(0)` is negative infinity, and one such value turns the whole loss into NaN.", hi: true },
     { c: "    return -np.mean(y*np.log(p) + (1-y)*np.log(1-p))", w: "Punishes confident wrong answers very heavily — `log` of a small number is a large negative." }
    ],
    after: "Read the formula: when y=1 only the first term survives, so the loss is `-log(p)` — zero when p=1, enormous when p is near 0. When y=0 the second term does the same in reverse." } },

  { code: { lang: "python", t: "Backpropagation, by hand",
    lines: [
     { c: "def backward(X, y, z1, a1, z2, a2):", w: "" },
     { c: "    m = len(X)", w: "" },
     { c: "", w: "" },
     { c: "    dz2 = (a2 - y.reshape(-1,1)) / m", w: "**Sigmoid plus cross-entropy collapse to `prediction - truth`.** This elegant cancellation is why that pairing is standard, and why you should not mix and match loss and output activation carelessly.", hi: true },
     { c: "", w: "" },
     { c: "    dW2 = a1.T @ dz2", w: "**Chain rule.** How much each hidden unit contributed, times how wrong the output was. Shape (16,1) — same as W2, as always." },
     { c: "    db2 = dz2.sum(axis=0)", w: "" },
     { c: "", w: "" },
     { c: "    da1 = dz2 @ W2.T", w: "**Push the error backwards** through the weights into layer 1's output." },
     { c: "    dz1 = da1 * (z1 > 0)", w: "**ReLU's derivative is 1 where the input was positive and 0 elsewhere.** A neuron that was silent gets no gradient — this line is literally the dying ReLU problem.", hi: true },
     { c: "", w: "" },
     { c: "    dW1 = X.T @ dz1", w: "" },
     { c: "    db1 = dz1.sum(axis=0)", w: "" },
     { c: "    return dW1, db1, dW2, db2", w: "" }
    ],
    after: "Nine lines. That is backpropagation, complete, for this network. Notice the structure: every gradient is the incoming error times a local derivative, and each layer only needs what the layer above handed it." } },

  { code: { lang: "python", t: "The training loop",
    lines: [
     { c: "from sklearn.datasets import make_moons", w: "" },
     { c: "X, y = make_moons(1000, noise=0.2, random_state=0)", w: "**Two interleaving crescents** — not linearly separable, so a hidden layer is genuinely required." },
     { c: "", w: "" },
     { c: "lr = 0.5", w: "" },
     { c: "for epoch in range(2001):", w: "" },
     { c: "    z1, a1, z2, a2 = forward(X)", w: "" },
     { c: "    loss = bce(y, a2.ravel())", w: "" },
     { c: "    dW1, db1, dW2, db2 = backward(X, y, z1, a1, z2, a2)", w: "" },
     { c: "", w: "" },
     { c: "    W1 -= lr * dW1; b1 -= lr * db1", w: "**Step downhill.** Minus, because gradients point uphill.", hi: true },
     { c: "    W2 -= lr * dW2; b2 -= lr * db2", w: "" },
     { c: "", w: "" },
     { c: "    if epoch % 400 == 0:", w: "" },
     { c: "        acc = ((a2.ravel() > 0.5) == y).mean()", w: "" },
     { c: "        print(f'epoch {epoch:>4}  loss {loss:.4f}  acc {acc:.3f}')", w: "" }
    ],
    out: "epoch    0  loss 0.7213  acc 0.501\nepoch  400  loss 0.2854  acc 0.874\nepoch  800  loss 0.1466  acc 0.951\nepoch 1200  loss 0.0994  acc 0.968\nepoch 1600  loss 0.0812  acc 0.974\nepoch 2000  loss 0.0721  acc 0.978",
    after: "97.8% on a problem no straight line can solve, from about sixty lines of NumPy. Nothing was imported that does gradients. You wrote every one of them." } },

  { h: "Check your gradients" },
  { p: "Analytical gradients are easy to get subtly wrong and the symptom is *training is a bit worse than expected*, which is nearly impossible to notice. The numerical check is slow, definitive and worth knowing." },

  { code: { lang: "python", t: "Gradient checking",
    lines: [
     { c: "def numeric_grad(param, i, j, eps=1e-5):", w: "" },
     { c: "    orig = param[i, j]", w: "" },
     { c: "    param[i, j] = orig + eps", w: "" },
     { c: "    lp = bce(y, forward(X)[3].ravel())", w: "Loss slightly to the right." },
     { c: "    param[i, j] = orig - eps", w: "" },
     { c: "    lm = bce(y, forward(X)[3].ravel())", w: "Loss slightly to the left." },
     { c: "    param[i, j] = orig", w: "**Restore it.** Forgetting this corrupts your model silently." },
     { c: "    return (lp - lm) / (2*eps)", w: "**The central difference** — more accurate than the one-sided version.", hi: true },
     { c: "", w: "" },
     { c: "print(numeric_grad(W1, 0, 0), dW1[0, 0])", w: "**These should agree to about six decimal places.** If they do not, your backward pass has a bug." }
    ],
    out: "-0.014832917  -0.014832919",
    after: "Slow — one forward pass per parameter — so you check three or four parameters, not all of them. Every deep learning framework was validated this way, and when you write a custom layer or loss, this is how you check it." } },

  { trap: "The two failures you will hit writing this yourself. **Shape errors from broadcasting**: `y` of shape (1000,) against `a2` of shape (1000,1) broadcasts into (1000,1000) without complaint and produces confidently wrong gradients. Reshape deliberately and print shapes. **NaN in the loss**: almost always `log(0)`. The clip is not optional." },

  { tryit: { t: "Extend it",
    task: "Add a third layer to the network above — input → 16 → 16 → 1. You will need one more weight matrix, one more ReLU in forward, and three more lines in backward. Verify with gradient checking before you trust the training curve.",
    hint: "The backward pass is mechanical: `da = dz_next @ W_next.T`, then `dz = da * (z > 0)`, then `dW = a_prev.T @ dz`. The same three lines per layer, repeated.",
    sol: { lang: "python", code: "# forward\ndef forward(X):\n    z1 = X @ W1 + b1;  a1 = np.maximum(0, z1)\n    z2 = a1 @ W2 + b2; a2 = np.maximum(0, z2)      # new layer\n    z3 = a2 @ W3 + b3; a3 = 1 / (1 + np.exp(-z3))\n    return z1, a1, z2, a2, z3, a3\n\n# backward -- note the repeating three-line pattern\ndef backward(X, y, z1, a1, z2, a2, z3, a3):\n    m = len(X)\n    dz3 = (a3 - y.reshape(-1, 1)) / m\n    dW3, db3 = a2.T @ dz3, dz3.sum(axis=0)\n\n    da2 = dz3 @ W3.T\n    dz2 = da2 * (z2 > 0)\n    dW2, db2 = a1.T @ dz2, dz2.sum(axis=0)\n\n    da1 = dz2 @ W2.T\n    dz1 = da1 * (z1 > 0)\n    dW1, db1 = X.T @ dz1, dz1.sum(axis=0)\n\n    return dW1, db1, dW2, db2, dW3, db3" },
    w: "Notice that the backward pass is the same three lines per layer, repeated. That regularity is exactly what autograd automates: it records which operations ran forward, then walks the list in reverse applying each one's known local derivative. You have now hand-written the thing PyTorch does, which means you will never again treat `loss.backward()` as magic." } },

  { vocab: ["Backpropagation", "Cross-Entropy", "ReLU", "Sigmoid", "Weight Initialisation"] }
 ],
 k: [
  "Initialise weights with He scaling and biases at zero; symmetric weights make every neuron identical forever.",
  "The forward pass must keep its intermediates, which is why training uses more memory than inference.",
  "Sigmoid plus cross-entropy makes the output gradient simply `prediction - truth`.",
  "ReLU's derivative is 1 where the input was positive and 0 elsewhere — that zero is the dying ReLU problem.",
  "Check gradients numerically with a central difference whenever you write a custom layer or loss."
 ],
 r: ["Backpropagation", "Cross-Entropy", "ReLU", "Weight Initialisation", "Gradient Descent", "Neural Network"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "rng.normal(0, np.sqrt(2/n_in), (n_in, n_out))", w: "He initialisation for a ReLU layer" },
   { c: "np.clip(p, 1e-9, 1 - 1e-9)", w: "stop log(0) turning the loss into NaN" },
   { c: "dz2 = (a2 - y.reshape(-1,1)) / m", w: "sigmoid + cross-entropy gradient: prediction minus truth" },
   { c: "dz1 = da1 * (z1 > 0)", w: "push gradient back through ReLU" },
   { c: "(lp - lm) / (2*eps)", w: "numerical gradient, for checking your maths" }
  ]
 }
}

]);
