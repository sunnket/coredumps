/* ML Maths — calculus and gradient descent. */
TD.addLessons("math", [

{
 t: "A Derivative Is Just a Slope",
 m: "calculus",
 lvl: "core",
 s: "The only calculus concept you need, explained without a single limit.",
 goal: [
  "Say what a derivative measures in one sentence",
  "Read the sign and size of a derivative and know what to do about it",
  "Compute a derivative numerically, which is all you will ever need by hand"
 ],
 b: [
  { p: "School calculus spends months on techniques for computing derivatives by hand. Machine learning needs almost none of that, because the computer computes them for you. What it needs is the one idea underneath, which takes about ten minutes." },

  { h: "The idea" },
  { p: "A **derivative** answers one question: *if I nudge the input slightly, how much does the output move, and in which direction?*" },

  { code: { lang: "python", t: "A derivative, computed the honest way",
    lines: [
     { c: "def f(x):", w: "" },
     { c: "    return x ** 2", w: "Some function. Anything at all." },
     { c: "", w: "" },
     { c: "def derivative(f, x, h=1e-6):", w: "" },
     { c: "    return (f(x + h) - f(x)) / h", w: "**Nudge the input by a tiny h. Measure the change in output. Divide by h.** That is the definition, minus the formal limit.", hi: true },
     { c: "", w: "" },
     { c: "derivative(f, 3.0)", w: "≈ 6.0. At x = 3, moving right by 1 raises the output by about 6." },
     { c: "derivative(f, -2.0)", w: "≈ -4.0. **Negative: moving right *lowers* the output.**" },
     { c: "derivative(f, 0.0)", w: "≈ 0.0. **Flat. The bottom of the curve** — nudging in either direction barely changes anything." }
    ],
    out: "6.000001\n-3.999999\n1e-06" } },

  { ana: "You are standing on a hillside in thick fog. You cannot see the valley. But you can feel the ground under your feet, and that tells you which way is downhill and how steep it is. The derivative is that feeling. It is entirely local — it says nothing about where the valley is, only which way the ground falls right here. Training a model is walking downhill in fog, one small step at a time, forever.",
    at: "The hillside in fog" },

  { h: "Reading a derivative" },
  { tbl: { t: "Sign and size, and what each tells you",
    h: ["Derivative", "Means", "To decrease the output, move"],
    rows: [
     ["**Large positive** (+40)", "Steeply uphill to the right", "**Left**, and you can afford a big step"],
     ["**Small positive** (+0.2)", "Gently uphill", "Left, cautiously"],
     ["**Zero**", "Flat — a minimum, a maximum, or a plateau", "Nowhere. **You are stuck**, and this is a real failure mode"],
     ["**Small negative** (-0.2)", "Gently downhill to the right", "Right, cautiously"],
     ["**Large negative** (-40)", "Steeply downhill to the right", "**Right**, and quickly"]
    ] } },

  { p: "The rule that falls out of that table is the entire optimisation algorithm of machine learning: **to decrease a function, move in the opposite direction to its derivative.** Positive slope, step left. Negative slope, step right. Repeat." },

  { h: "The three derivatives worth recognising" },
  { p: "You will not compute these by hand in your job, but recognising them makes model code readable." },

  { tbl: { t: "The ones that actually appear",
    h: ["Function", "Derivative", "Why it shows up"],
    rows: [
     ["`x²`", "`2x`", "Squared error loss. The derivative grows with the error, so big mistakes produce big corrections — which is exactly what you want"],
     ["`c·x`", "`c`", "A linear layer. The slope is the weight itself, which is why weights and gradients have the same shape"],
     ["`max(0, x)`", "1 if x>0, else 0", "**ReLU.** Note the zero: a neuron pushed negative receives no gradient at all, and can stop learning permanently. This is the *dying ReLU* problem"],
     ["`eˣ`", "`eˣ`", "Its own derivative. This is why exponentials appear everywhere in loss functions — the algebra stays clean"]
    ] } },

  { n: "You will never differentiate by hand in this job. PyTorch and JAX build a graph of every operation you perform and apply the chain rule backwards through it automatically — that is what **autograd** means. You need the concepts so you can tell *why* a gradient is zero, or enormous, or NaN. You do not need the technique.",
    nt: "The honest scope" },

  { h: "Partial derivatives" },
  { p: "Real models have millions of inputs, not one. A **partial derivative** answers the same question for one input at a time: *if I nudge this one weight and hold every other weight still, how does the loss move?*" },

  { code: { lang: "python", t: "Two variables, one at a time",
    lines: [
     { c: "def loss(w1, w2):", w: "" },
     { c: "    return w1 ** 2 + 3 * w2 ** 2", w: "A loss depending on two weights." },
     { c: "", w: "" },
     { c: "h = 1e-6", w: "" },
     { c: "w1, w2 = 2.0, 1.0", w: "" },
     { c: "", w: "" },
     { c: "d_w1 = (loss(w1 + h, w2) - loss(w1, w2)) / h", w: "**Nudge w1 only.** ≈ 4.0", hi: true },
     { c: "d_w2 = (loss(w1, w2 + h) - loss(w1, w2)) / h", w: "**Nudge w2 only.** ≈ 6.0" }
    ],
    out: "4.000001\n6.000003",
    after: "w2 has the steeper slope here, so at this point it is the more urgent one to change. That comparison — which parameter is currently most responsible for the error — is what a gradient gives you across all of them at once." } },

  { trap: "The `∂` symbol looks intimidating and means nothing more than *derivative, treating every other variable as a constant*. `∂L/∂w` is read *the partial derivative of the loss with respect to w* and it says: nudge w, hold everything else, watch L. That symbol appears in every deep learning paper and it is the least mysterious thing in any of them." },

  { tryit: { t: "Find a minimum by feel",
    task: "Write a numerical derivative function. Use it on `f(x) = (x - 4)**2 + 1` starting at `x = 0`, repeatedly stepping in the opposite direction to the derivative by 0.1 times its size. Print x every ten steps and watch where it settles.",
    hint: "The update is `x = x - 0.1 * derivative(f, x)`. Run it a hundred times.",
    sol: { lang: "python", code: "def f(x):\n    return (x - 4) ** 2 + 1\n\ndef derivative(f, x, h=1e-6):\n    return (f(x + h) - f(x)) / h\n\nx = 0.0\nfor step in range(101):\n    if step % 20 == 0:\n        print(f'step {step:3d}  x={x:.4f}  f(x)={f(x):.4f}  slope={derivative(f, x):+.4f}')\n    x = x - 0.1 * derivative(f, x)" },
    w: "It converges on x = 4, where the function bottoms out at 1. You just wrote gradient descent — the algorithm that trains every neural network in existence — in three lines, with no library and no calculus beyond a nudge. The next lesson is the same loop with millions of parameters instead of one." } },

  { vocab: ["Derivative", "Partial Derivative", "Gradient"] }
 ],
 k: [
  "A derivative measures how much the output moves when you nudge the input, and in which direction.",
  "To decrease something, move opposite to its derivative. That sentence is the whole optimisation algorithm.",
  "A zero derivative means flat, which means stuck — a real failure mode, not just a curiosity.",
  "A partial derivative nudges one variable and holds the rest still; `∂L/∂w` says exactly that.",
  "Autograd computes all of this for you. You need the intuition, not the technique."
 ],
 r: ["Derivative", "Partial Derivative", "Gradient", "Gradient Descent"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "(f(x + h) - f(x)) / h", w: "a derivative, computed by nudging" },
   { c: "x = x - lr * derivative(f, x)", w: "one step of gradient descent" },
   { c: "np.maximum(0, x)", w: "ReLU, whose derivative is zero for negative inputs" }
  ]
 }
},

{
 t: "Gradients, the Chain Rule, and Rolling Downhill",
 m: "calculus",
 lvl: "core",
 s: "How a model with a hundred million parameters knows which way to move.",
 goal: [
  "Say what a gradient is and what shape it has",
  "Explain backpropagation as the chain rule applied backwards",
  "Diagnose a training run that is not learning, from the gradients alone"
 ],
 b: [
  { p: "A **gradient** is what you get when you take the partial derivative with respect to every parameter and stack them into one vector. If your model has 100 million weights, its gradient is a vector of 100 million numbers, and each one answers the same question: *how much is this particular weight to blame for the current error?*" },

  { n: "The gradient has exactly the same shape as the parameters. A (784, 256) weight matrix has a (784, 256) gradient. That correspondence is not a coincidence — it is what makes the update rule a simple subtraction, and it is a useful thing to remember when a shape error appears during the backward pass.",
    nt: "Shape fact worth keeping" },

  { h: "Gradient descent, in full" },
  { code: { lang: "python", t: "The loop that trains every neural network",
    lines: [
     { c: "for epoch in range(num_epochs):", w: "One epoch is one pass over the data." },
     { c: "    for X_batch, y_batch in loader:", w: "A batch at a time — memory, and a useful amount of noise." },
     { c: "", w: "" },
     { c: "        preds = model(X_batch)", w: "**Forward pass.** Push data through and get predictions." },
     { c: "        loss  = loss_fn(preds, y_batch)", w: "**One number**: how wrong we were. Everything downstream exists to reduce it." },
     { c: "", w: "" },
     { c: "        grads = loss.backward()", w: "**Backward pass.** The chain rule, applied backwards through every operation, producing one gradient per parameter.", hi: true },
     { c: "", w: "" },
     { c: "        for p, g in zip(params, grads):", w: "" },
     { c: "            p -= learning_rate * g", w: "**Step downhill.** Minus, because the gradient points *up* and we want down. Scaled by the learning rate so the step is small.", hi: true }
    ],
    after: "Every model you have heard of was trained by this loop. GPT was trained by this loop. The differences are scale, the optimiser's refinements, and an enormous amount of infrastructure — not the idea." } },

  { h: "The learning rate is the setting that matters most" },
  { p: "`learning_rate` decides how big each step is, and it is the single hyperparameter most likely to be the reason your training is not working." },

  { tbl: { t: "What goes wrong at each end",
    h: ["Learning rate", "What you see", "The fix"],
    rows: [
     ["**Far too high**", "Loss becomes `NaN` within a few steps", "Divide by 10. **`NaN` early is almost always this**, and almost never anything more interesting"],
     ["**Too high**", "Loss bounces around, or rises, and never settles", "Divide by 3. You are overshooting the valley on every step"],
     ["**About right**", "Loss falls quickly, then flattens smoothly", "Nothing. This is what it should look like"],
     ["**Too low**", "Loss falls, very slowly, and appears almost flat", "Multiply by 3. You are wasting hours crawling"],
     ["**Far too low**", "Nothing appears to happen at all", "Multiply by 10 and check the data pipeline while you are at it"]
    ] } },

  { ana: "Learning rate is stride length in the fog. Enormous strides send you flying across the valley and up the opposite hillside — that is the bouncing loss. Tiny shuffling steps get you there eventually, some time next week. The good news is that the diagnosis is visual: plot the loss and the shape of the curve tells you which mistake you are making.",
    at: "Stride length" },

  { h: "The chain rule, which is backpropagation" },
  { p: "A network is functions inside functions. To know how a weight in layer one affects the final loss, you have to trace its influence through every layer in between. The **chain rule** does exactly that, and it is one multiplication." },

  { syn: { t: "The chain rule, said plainly",
    parts: [
     { p: "∂L/∂w", w: "How the loss changes when this weight changes. **The thing we want.**" },
     { p: " = " },
     { p: "∂L/∂h", w: "How the loss changes when this layer's *output* changes. Already computed by the layer above." },
     { p: " × " },
     { p: "∂h/∂w", w: "How this layer's output changes when this weight changes. **Local** — computable from just this layer." }
    ],
    after: "Read it as: *my effect on the final result = my effect on the next step × that step's effect on the final result*. Every layer needs only a local calculation plus one number handed down from above, which is why this scales to a hundred billion parameters." } },

  { ana: "A message passed back down a chain of people. The person at the front knows how wrong the answer was. They turn to the person behind and say *you contributed this much of the error*. That person applies their own small local calculation and passes a corrected message further back. Nobody in the chain understands the whole system, and nobody needs to. That is backpropagation, and it is why training is roughly the same cost as inference rather than millions of times more.",
    at: "Passing blame down the line" },

  { h: "Two failures with names" },
  { p: "Because the chain rule multiplies a number at every layer, deep networks have a compounding problem: multiply fifty numbers together and the result is almost never moderate." },

  { code: { lang: "python", t: "Why depth used to be impossible",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "", w: "" },
     { c: "np.prod([0.5] * 50)", w: "**Vanishing.** Each layer halves the signal; after fifty layers the gradient is 8.9e-16. Early layers receive nothing and never learn.", hi: true },
     { c: "np.prod([1.5] * 50)", w: "**Exploding.** 6.4e+08. Weights leap to absurd values and the loss becomes NaN.", hi: true },
     { c: "np.prod([1.0] * 50)", w: "1.0. Stable — and this is what every architectural trick in deep learning is trying to approximate." }
    ],
    out: "8.881784197001252e-16\n637621500.2140496\n1.0" } },

  { tbl: { t: "The named failures and their standard fixes",
    h: ["Problem", "Symptom", "What people do about it"],
    rows: [
     ["**Vanishing gradient**", "Early layers barely change; loss plateaus high", "Residual connections (a gradient shortcut past layers), better activations, layer normalisation. **This is the single biggest reason transformers have residual connections everywhere**"],
     ["**Exploding gradient**", "Loss becomes NaN; weights blow up", "**Gradient clipping** — cap the gradient norm at, say, 1.0. Crude, universal, and it works"],
     ["**Dead ReLU**", "A fraction of neurons output zero for everything, forever", "Leaky ReLU or GELU, a lower learning rate, better initialisation"]
    ] } },

  { trap: "In PyTorch, gradients **accumulate** by default — a design decision that is genuinely useful for large-batch simulation and a genuine trap otherwise. Forget `optimizer.zero_grad()` at the top of your loop and every step adds to the previous gradients rather than replacing them. Training does not crash. It just quietly fails to converge, and you will spend an afternoon suspecting your architecture." },

  { h: "Diagnosing a training run" },
  { ol: [
   "**Loss is NaN.** Learning rate far too high, or a `log(0)` or division by zero in the loss. Check the learning rate first — it is right most of the time.",
   "**Loss is completely flat from step one.** Nothing is connected. Check `zero_grad`, check the gradients are not `None`, check the optimiser actually received the parameters.",
   "**Loss falls, then rises.** Learning rate too high for the later, flatter part of the landscape. Add a schedule that decays it.",
   "**Loss falls to a plateau well above zero.** Model too small, features insufficient, or a vanishing gradient. Print gradient norms per layer — near-zero in early layers is the tell.",
   "**Training loss falls, validation loss rises.** Not a gradient problem at all. That is overfitting, and the ML track covers it."
  ] },

  { tryit: { t: "Feel all three learning rates",
    task: "Minimise `f(x) = x**2` starting from `x = 10.0` using learning rates 0.001, 0.1 and 1.1. Run 50 steps of each and print x every ten. Predict which diverges before you run it.",
    hint: "The derivative of x² is 2x, so the update is `x = x - lr * 2 * x`, which is `x * (1 - 2*lr)`. Think about what happens when `|1 - 2*lr| > 1`.",
    sol: { lang: "python", code: "def run(lr, steps=50, x=10.0):\n    print(f'\\nlearning rate {lr}')\n    for i in range(steps + 1):\n        if i % 10 == 0:\n            print(f'  step {i:3d}  x = {x:>18.6f}')\n        x = x - lr * (2 * x)      # derivative of x**2 is 2x\n\nrun(0.001)   # crawls: still near 9 after 50 steps\nrun(0.1)     # converges cleanly to ~0\nrun(1.1)     # diverges: x flips sign and grows without bound" },
    w: "At lr = 1.1 the multiplier is `1 - 2.2 = -1.2`, so x flips sign and grows by 20% every step — the loss goes to infinity and then to NaN. That is exactly what a too-high learning rate does in a real network, at a hundred million parameters instead of one, and it is why NaN in the first ten steps almost always means *turn the learning rate down*." } },

  { vocab: ["Gradient", "Gradient Descent", "Backpropagation", "Vanishing Gradient", "Exploding Gradient", "Gradient Clipping"] }
 ],
 k: [
  "A gradient is every partial derivative stacked into one vector, shaped exactly like the parameters.",
  "Training is: forward pass, compute loss, backward pass, subtract learning-rate times gradient. Repeat.",
  "The learning rate is the hyperparameter most likely to be why training is failing; the loss curve names the mistake.",
  "Backpropagation is the chain rule applied backwards — each layer needs one local calculation plus a number from above.",
  "Multiplying a number at every layer causes vanishing or exploding gradients; residuals, normalisation and clipping are the standard answers."
 ],
 r: ["Gradient", "Gradient Descent", "Backpropagation", "Vanishing Gradient", "Exploding Gradient", "Gradient Clipping", "Stochastic Gradient Descent"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "loss.backward()", w: "compute every gradient by applying the chain rule backwards" },
   { c: "optimizer.zero_grad()", w: "clear last step's gradients — forget this and training silently fails" },
   { c: "p -= learning_rate * g", w: "one step downhill, opposite the gradient" },
   { c: "torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)", w: "cap the gradient to stop it exploding" }
  ]
 }
}

]);
