/* ML Maths — matrices. */
TD.addLessons("math", [

{
 t: "Matrices, Shapes, and Why Your Code Crashed",
 m: "matrices",
 lvl: "core",
 s: "Shape errors are the most common bug in machine learning, and they are completely readable.",
 goal: [
  "Read a shape and say what each dimension represents",
  "Predict the output shape of a matrix multiplication before running it",
  "Diagnose a shape error from the message alone, without guessing"
 ],
 b: [
  { p: "A **matrix** is a grid of numbers, and like a vector it has two readings that are both true at once. As **data**, each row is one example and each column one feature. As a **transformation**, it is a machine that takes a vector in and produces a different vector out." },

  { p: "Machine learning uses both readings in the same line of code, constantly. `X @ W` is your data matrix meeting a transformation matrix, and knowing which is which is how you read a model." },

  { h: "Shape is the thing you check first" },
  { code: { lang: "python",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "", w: "" },
     { c: "X = np.array([[1, 2, 3],", w: "**Rows first, then columns.**" },
     { c: "              [4, 5, 6]])", w: "" },
     { c: "", w: "" },
     { c: "X.shape", w: "**(2, 3)** — two rows, three columns. Read it as *2 examples, 3 features each*.", hi: true },
     { c: "X.ndim", w: "2. How many dimensions. A vector is 1, a matrix is 2, a batch of images is 4." },
     { c: "X.dtype", w: "`int64`. **Check this when something is silently wrong** — an int array where floats were expected truncates every division." }
    ],
    out: "(2, 3)\n2\ndtype('int64')" } },

  { n: "Print the shape. Before anything else, at every step, whenever something misbehaves. Experienced practitioners have `print(x.shape)` permanently in their fingers, and it is not a beginner habit they never grew out of — it is the fastest diagnostic there is, because in machine learning the shapes carry the semantics.",
    nt: "The single most useful debugging habit in the field" },

  { h: "What a shape means in practice" },
  { tbl: { t: "Reading real shapes",
    h: ["Shape", "Almost certainly", "Read aloud"],
    rows: [
     ["`(1000, 8)`", "A tabular dataset", "1,000 rows, 8 features"],
     ["`(32, 784)`", "A batch of flattened images", "batch of 32, each 784 numbers long"],
     ["`(32, 3, 224, 224)`", "A batch of colour images", "32 images, 3 channels, 224 by 224 pixels"],
     ["`(8, 512, 768)`", "A batch of text inside a transformer", "8 sequences, 512 tokens each, 768 numbers per token"],
     ["`(50000, 384)`", "An embedding index", "50,000 documents, 384 dimensions each"],
     ["`(768, 3072)`", "A weight matrix", "takes 768 numbers in, produces 3,072 out"]
    ] } },

  { p: "The first dimension is nearly always the **batch** — how many examples you are processing at once. Batch size is a hardware decision, not a modelling one, and it appears in every shape you will ever print." },

  { h: "Matrix multiplication, and the one rule" },
  { p: "Element (i, j) of the result is the dot product of row i of the first matrix with column j of the second. You will rarely compute one by hand, but you must be able to predict the shape, and there is exactly one rule." },

  { syn: { t: "The shape rule, which is the whole thing",
    parts: [
     { p: "(m × " },
     { p: "n", w: "**These two must be equal.** They are the *inner* dimensions, and they vanish in the result — the multiplication consumes them." },
     { p: ") @ (" },
     { p: "n", w: "The same n. If these do not match, the operation is undefined and NumPy raises an error." },
     { p: " × p) = (" },
     { p: "m × p", w: "**The outer dimensions survive.** Rows of the first, columns of the second." },
     { p: ")" }
    ],
    after: "Inner dimensions must match and disappear; outer dimensions survive. Every shape error in machine learning is a violation of that one sentence." } },

  { code: { lang: "python", t: "One layer of a neural network, which is this and nothing more",
    lines: [
     { c: "X = np.random.randn(32, 784)", w: "**32 images**, each flattened to 784 pixels." },
     { c: "W = np.random.randn(784, 256)", w: "A weight matrix: **takes 784 in, gives 256 out.** This is what a layer's size means." },
     { c: "b = np.zeros(256)", w: "One bias per output. Added to every row." },
     { c: "", w: "" },
     { c: "H = X @ W + b", w: "**(32, 784) @ (784, 256) → (32, 256).** The 784 matched and vanished; 32 and 256 survived.", hi: true },
     { c: "H.shape", w: "Still 32 examples, now described by 256 numbers each instead of 784." }
    ],
    out: "(32, 256)",
    after: "That single line is a dense neural network layer. Add a non-linear function to the result and you have the complete building block that everything from a two-layer classifier to GPT is made of." } },

  { ana: "Think of a weight matrix as a translator with a fixed job description: *I accept 784 numbers and I return 256*. It does not care how many things you hand it — one image or ten thousand — because it processes each row independently. That is why the batch dimension passes straight through untouched, and why increasing your batch size never changes your model, only your memory use.",
    at: "A matrix is a machine with an input size and an output size" },

  { h: "Reading a shape error" },
  { p: "The error message tells you exactly what went wrong. It is worth reading rather than skimming, because it contains the fix." },

  { code: { lang: "python", t: "Deliberately breaking it",
    lines: [
     { c: "X = np.random.randn(32, 784)", w: "" },
     { c: "W = np.random.randn(256, 784)", w: "**The weights are the wrong way round** — a genuinely common mistake, because many papers and frameworks write weights as (out, in)." },
     { c: "", w: "" },
     { c: "H = X @ W", w: "Boom." }
    ],
    out: "ValueError: matmul: Input operand 1 has a mismatch in its core dimension 0,\nwith gufunc signature (n?,k),(k,m?)->(n?,m?) (size 256 is different from 784)" } },

  { ol: [
   "**Read the two numbers at the end.** `256 is different from 784` — those are the inner dimensions that failed to match.",
   "**Print both shapes.** `(32, 784)` and `(256, 784)`. Now the problem is visible: the second matrix's *first* dimension should be 784.",
   "**Decide which is wrong.** Either the weights need transposing, or you meant to multiply in the other order.",
   "**Fix with `W.T`** if the weights are stored as (out, in), which they frequently are. `X @ W.T` gives `(32, 784) @ (784, 256)` and works."
  ] },

  { trap: "`A @ B` and `B @ A` are different operations and usually only one of them is even defined. Matrix multiplication is **not commutative**, which is the single biggest difference from the arithmetic you already know. When you get a shape error, the first thing to try is not adding a transpose everywhere until it stops complaining — it is asking which order actually expresses what you meant. Code that was fixed by flailing at transposes runs without error and computes something else." },

  { h: "Transpose" },
  { code: { lang: "python",
    lines: [
     { c: "A = np.array([[1, 2, 3],", w: "" },
     { c: "              [4, 5, 6]])", w: "Shape (2, 3)." },
     { c: "", w: "" },
     { c: "A.T", w: "**Rows become columns.** `[[1,4],[2,5],[3,6]]`, shape (3, 2).", hi: true },
     { c: "A.T.shape", w: "(3, 2). Transposing always reverses the shape tuple." },
     { c: "A.T.T", w: "Back to A. Transposing twice is a no-op." }
    ],
    after: "Transpose is cheap — NumPy usually just changes how it reads the same memory rather than copying anything. It appears constantly in gradient formulas for exactly the reason you just met: it is how you make inner dimensions line up." } },

  { h: "Broadcasting, which is why `+ b` worked" },
  { p: "In `X @ W + b`, the product has shape (32, 256) and `b` has shape (256,). Adding them should be a shape error — and it is not, because NumPy **broadcasts**: it stretches the smaller array across the larger one when the trailing dimensions are compatible." },

  { code: { lang: "python", t: "Broadcasting rules, by example",
    lines: [
     { c: "H = np.zeros((32, 256))", w: "" },
     { c: "b = np.ones(256)", w: "Shape (256,)." },
     { c: "H + b", w: "**Works.** b is added to every one of the 32 rows. Trailing dimensions 256 and 256 match." },
     { c: "", w: "" },
     { c: "c = np.ones(32)", w: "Shape (32,)." },
     { c: "H + c", w: "**Fails.** Trailing dimensions are 256 and 32. NumPy aligns from the *right*, not the left." },
     { c: "H + c[:, None]", w: "**Works.** `[:, None]` reshapes c to (32, 1), which broadcasts across the 256 columns.", hi: true }
    ],
    after: "`[:, None]` — or equivalently `.reshape(-1, 1)` — is the standard trick for turning a row-shaped vector into a column so it broadcasts down instead of across. You will write it often." } },

  { trap: "Broadcasting is helpful right up to the moment it hides a bug. If you meant to add a per-row value and your vector is the wrong shape, NumPy may broadcast it the other way without complaint, giving you a full-size array of confidently wrong numbers. When the shapes work but the answer is nonsense, suspect broadcasting before you suspect the algorithm." },

  { tryit: { t: "Predict, then check",
    task: "For each pair, write down the output shape before running it — or *error* if it fails.\n\n1. `(64, 128) @ (128, 10)`\n2. `(10, 5) @ (10, 5)`\n3. `(8, 512, 768) @ (768, 768)`\n4. `(3,) @ (3,)`\n5. `(100, 50).T @ (100, 20)`",
    hint: "Inner dimensions must match and vanish; outer ones survive. For (5), apply the transpose first and then read the shapes.",
    sol: { lang: "python", code: "import numpy as np\n\n# 1. (64, 128) @ (128, 10) -> (64, 10)\n#    128 matches and disappears\n\n# 2. (10, 5) @ (10, 5) -> ERROR\n#    inner dims are 5 and 10; they do not match\n\n# 3. (8, 512, 768) @ (768, 768) -> (8, 512, 768)\n#    batched: the leading 8 rides along untouched.\n#    This is exactly a transformer layer over 8 sequences of 512 tokens.\n\n# 4. (3,) @ (3,) -> () a single number\n#    two 1-D vectors give the dot product, a scalar\n\n# 5. (100, 50).T is (50, 100); (50, 100) @ (100, 20) -> (50, 20)\n#    this shape is exactly how a gradient with respect to weights is computed" },
    w: "Case 3 is worth a second look. NumPy multiplies the last two dimensions and carries any leading dimensions along as batch. That is how one line of code processes eight sequences at once inside a transformer, and it is why batching is essentially free on a GPU." } },

  { vocab: ["Matrix", "Matrix Multiplication", "Tensor", "Linear Algebra"] }
 ],
 k: [
  "A matrix reads as data (rows are examples) or as a transformation (in-size by out-size).",
  "The rule: (m×n) @ (n×p) = (m×p). Inner dimensions must match and vanish, outer ones survive.",
  "One neural layer is `X @ W + b`, and nothing more until a non-linearity is added.",
  "`A @ B` is not `B @ A`. Fix shape errors by asking what you meant, not by adding transposes until it runs.",
  "Broadcasting aligns from the right. Use `[:, None]` to make a vector broadcast down a column."
 ],
 r: ["Matrix", "Matrix Multiplication", "Tensor", "Linear Algebra", "Vector"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "X.shape", w: "the first thing to print when anything is wrong" },
   { c: "H = X @ W + b", w: "one dense neural network layer" },
   { c: "A.T", w: "transpose — swap rows and columns to make dimensions line up" },
   { c: "c[:, None]", w: "reshape a row-shaped vector into a column so it broadcasts down" },
   { c: "X @ W.T", w: "the fix when weights are stored as (out, in)" }
  ]
 }
},

{
 t: "Every Model Is Matrices and a Squiggle",
 m: "matrices",
 lvl: "core",
 s: "Why stacking linear layers is pointless, and what one non-linear function fixes.",
 goal: [
  "Show that two stacked linear layers collapse into one",
  "Explain what an activation function adds and why depth needs it",
  "Read a model's architecture from its weight shapes alone"
 ],
 b: [
  { p: "You now know that a layer is `X @ W + b`. The obvious next thought is: stack a few, get a deep network. That thought is wrong in an instructive way, and understanding why is the whole reason activation functions exist." },

  { h: "The collapse" },
  { code: { lang: "python", t: "Two linear layers are one linear layer",
    lines: [
     { c: "X  = np.random.randn(32, 10)", w: "" },
     { c: "W1 = np.random.randn(10, 64)", w: "First layer: 10 in, 64 out." },
     { c: "W2 = np.random.randn(64, 4)", w: "Second layer: 64 in, 4 out." },
     { c: "", w: "" },
     { c: "deep = (X @ W1) @ W2", w: "Two layers, applied in sequence." },
     { c: "", w: "" },
     { c: "W_combined = W1 @ W2", w: "**But matrix multiplication is associative**, so those two matrices can be multiplied together first — into one (10, 4) matrix.", hi: true },
     { c: "shallow = X @ W_combined", w: "One layer." },
     { c: "", w: "" },
     { c: "np.allclose(deep, shallow)", w: "**True.** The two-layer network computes exactly what a single layer computes." }
    ],
    out: "True",
    after: "Stack a hundred linear layers and you still have exactly one linear layer, with a great deal more arithmetic and no more expressive power. Depth bought you nothing." } },

  { ana: "Stretching a rubber sheet, then stretching it again, is the same as one bigger stretch. No number of stretches will fold it. To get a fold you need an operation that is not a stretch — and that operation is the activation function.",
    at: "Why linear stacking cannot fold" },

  { h: "The squiggle" },
  { p: "An **activation function** is any non-linear function applied element by element to a layer's output. The most common one is embarrassingly simple." },

  { code: { lang: "python", t: "ReLU, in full",
    lines: [
     { c: "def relu(x):", w: "" },
     { c: "    return np.maximum(0, x)", w: "**Negative becomes zero; positive passes through unchanged.** That is the entire function.", hi: true },
     { c: "", w: "" },
     { c: "relu(np.array([-2.0, -0.5, 0.0, 1.5, 3.0]))", w: "" }
    ],
    out: "array([0. , 0. , 0. , 1.5, 3. ])",
    after: "It looks far too simple to matter. It is the reason deep learning works, and the reason it works is not that ReLU is clever — it is that ReLU is *not linear*, which is enough to break the collapse." } },

  { code: { lang: "python", t: "The same two layers, with a squiggle between them",
    lines: [
     { c: "H = relu(X @ W1)", w: "Layer one, then bend it." },
     { c: "out = H @ W2", w: "Layer two." },
     { c: "", w: "" },
     { c: "# can this be collapsed into one matrix?", w: "" },
     { c: "# no. relu sits between them and it is not a matrix.", w: "**There is no single W such that `X @ W` equals this.** The network genuinely has two layers of expressive power now.", hi: true }
    ],
    after: "One `np.maximum(0, x)` is the entire difference between a model that can only draw straight lines and one that can, given enough width and depth, approximate essentially any function you like." } },

  { h: "The three activations you will meet" },
  { tbl: { t: "What each one does and where it lives",
    h: ["Function", "Shape", "Where you find it"],
    rows: [
     ["**ReLU** `max(0, x)`", "Flat then straight", "Hidden layers, by default. Cheap, and it does not saturate. Modern variants (GELU, SiLU) are smoothed versions of the same idea and are what transformers actually use"],
     ["**Sigmoid** `1/(1+e⁻ˣ)`", "S-curve, 0 to 1", "The final layer of a **binary** classifier, where the output must be one probability. Rarely used in hidden layers now — it saturates and kills gradients"],
     ["**Softmax**", "Vector to probabilities", "The final layer of a **multi-class** classifier. Turns arbitrary scores into positive numbers summing to 1"]
    ] } },

  { code: { lang: "python", t: "Softmax, which you will meet in every classifier and every language model",
    lines: [
     { c: "def softmax(x):", w: "" },
     { c: "    e = np.exp(x - x.max())", w: "**Subtracting the max is a numerical safety trick**, not mathematics — it prevents `exp` overflowing on large scores. The result is unchanged.", hi: true },
     { c: "    return e / e.sum()", w: "Divide by the total so everything sums to exactly 1." },
     { c: "", w: "" },
     { c: "scores = np.array([2.0, 1.0, 0.1])", w: "**Raw model outputs**, called *logits*. They can be any real number, positive or negative." },
     { c: "softmax(scores)", w: "Now they are a probability distribution over three classes." }
    ],
    out: "array([0.659, 0.242, 0.099])",
    after: "Exponentiating before normalising is what makes softmax different from simply dividing by the sum — it exaggerates differences, so a clear winner becomes a confident one. That exaggeration is also why softmax outputs look more certain than the model deserves." } },

  { n: "A language model's final layer is a softmax over its entire vocabulary — often 100,000 or more numbers, one per possible next token, summing to 1. *Temperature* divides the logits before that softmax: below 1 sharpens the distribution towards the top choice, above 1 flattens it towards randomness. That is the whole mechanism behind a setting you will adjust constantly.",
    nt: "Where you have already met softmax without knowing" },

  { h: "Reading a model from its shapes" },
  { code: { lang: "python", t: "An architecture, inferred entirely from weight shapes",
    lines: [
     { c: "for name, W in model.items():", w: "" },
     { c: "    print(name, W.shape)", w: "" }
    ],
    out: "layer1.weight (784, 512)\nlayer1.bias   (512,)\nlayer2.weight (512, 128)\nlayer2.bias   (128,)\nlayer3.weight (128, 10)\nlayer3.bias   (10,)",
    after: "Read it straight off: input 784 (a 28×28 image flattened), narrowing to 512, then 128, then 10 outputs — ten classes, so this is a digit classifier. Roughly 470,000 parameters. You did not need the source code; the shapes told you the architecture." } },

  { tryit: { t: "Prove the collapse to yourself",
    task: "Build a three-layer linear network with no activations, and find the single matrix that reproduces it exactly. Then insert ReLU between the layers and confirm no such matrix exists — by showing the outputs differ.",
    hint: "For the linear case, `W1 @ W2 @ W3` is your single equivalent matrix. For the ReLU case, try to build the same combined matrix and compare outputs with `np.allclose`.",
    sol: { lang: "python", code: "import numpy as np\nrng = np.random.default_rng(0)\n\nX  = rng.standard_normal((32, 10))\nW1 = rng.standard_normal((10, 64))\nW2 = rng.standard_normal((64, 32))\nW3 = rng.standard_normal((32, 4))\n\n# no activations: three layers collapse into one matrix\nlinear_3 = ((X @ W1) @ W2) @ W3\nW_all    = W1 @ W2 @ W3          # shape (10, 4)\nprint(np.allclose(linear_3, X @ W_all))     # True\n\n# with ReLU, the same collapse fails\nrelu = lambda x: np.maximum(0, x)\nnonlin_3 = relu(relu(X @ W1) @ W2) @ W3\nprint(np.allclose(nonlin_3, X @ W_all))     # False\nprint(W_all.shape)                          # (10, 4) — 40 numbers\n# the ReLU network holds 640+2048+128 numbers it can actually use" },
    w: "The linear network had 3,000 parameters and the expressive power of 40. Every extra parameter was wasted. One `np.maximum` per layer is what turns them all into usable capacity — which is a remarkably good return on one line of code." } },

  { vocab: ["Softmax", "Matrix Multiplication", "Vector"] }
 ],
 k: [
  "Stacked linear layers collapse into a single linear layer — depth alone buys nothing.",
  "An activation function is a non-linear step applied element-wise, and it is what makes depth meaningful.",
  "ReLU is `max(0, x)`, and its simplicity is not a compromise — non-linearity is all that was required.",
  "Softmax turns arbitrary scores into a probability distribution, and temperature scales the logits before it.",
  "Weight shapes alone tell you a model's architecture, its input size and its number of classes."
 ],
 r: ["Softmax", "Matrix Multiplication", "Neural Network", "Vector", "Linear Algebra"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "np.maximum(0, x)", w: "ReLU — the non-linearity that makes depth work" },
   { c: "H = relu(X @ W1)", w: "a hidden layer: multiply, add bias, bend" },
   { c: "e = np.exp(x - x.max())", w: "the numerically safe first half of softmax" },
   { c: "e / e.sum()", w: "normalise to a probability distribution" },
   { c: "np.allclose(a, b)", w: "compare two float arrays without demanding exact equality" }
  ]
 }
}

]);
