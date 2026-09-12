/* ML Maths — how much you actually need. */
TD.addLessons("math", [

{
 t: "How Much Maths You Actually Need",
 m: "why",
 lvl: "core",
 s: "The honest scope, the order, and how to stop this subject from eating your year.",
 goal: [
  "Name the four subjects and what each one is for in machine learning",
  "Decide what to learn now, what to learn later, and what to never learn",
  "Take maths alongside models rather than as a gate in front of them"
 ],
 b: [
  { p: "More people leave machine learning over maths than over anything else, and almost none of them left because the maths was too hard. They left because nobody told them where the finish line was, so they kept running." },

  { h: "The four subjects, and what each one buys you" },
  { p: "Machine learning borrows from four areas of mathematics. It does not borrow evenly, and the parts it uses heavily are not the parts a university course spends its time on." },

  { tbl: { t: "What each subject is actually for",
    h: ["Subject", "What it explains", "How much you need"],
    rows: [
     ["**Linear algebra**", "Your data is a matrix. A model layer is a transformation of it. An embedding is a vector and searching it is a dot product.", "**The most, and the most useful.** Vectors, matrices, multiplication, shapes, transpose, dot product, norms. About two weeks."],
     ["**Calculus**", "Training is rolling downhill. The gradient is which way is down. Backpropagation is the chain rule applied a lot.", "**Concepts, not technique.** What a derivative is, what a gradient is, what the chain rule does. You will never integrate anything."],
     ["**Probability**", "A model outputs a belief, not an answer. Softmax produces a distribution. Sampling from a language model is a probabilistic choice.", "**Moderate.** Distributions, expectation, conditional probability, Bayes. Enough to know what a 0.83 means."],
     ["**Statistics**", "You measured 2% improvement. Is it real, or did you get lucky on this test set?", "**More than people think.** This is where careers are quietly made and lost, because it is what makes your results believable."]
    ] } },

  { n: "Notice what is missing. No integration by parts. No epsilon-delta proofs. No abstract algebra. No differential equations. Those are real mathematics and they are not what this job runs on.",
    nt: "The list of things you can skip is longer than the list of things you need" },

  { h: "The trap that costs people a year" },
  { p: "There is a script almost everyone follows and it does not work. It goes: *I will do all the maths properly first, then start machine learning.* Six months later they are three-quarters of the way through a linear algebra course, have never trained a model, and have quietly concluded they are not smart enough for the field." },

  { p: "The failure is structural, not personal. Maths learned with no application attached has nothing to stick to. You learn what an eigenvector is, you never use it, and in five weeks it is gone — so you feel like you are forgetting things faster than you learn them, which is demoralising and also completely accurate." },

  { vs: { t: "Two ways to schedule the same material",
    bad: { c: "Month 1-6:  Linear algebra course\nMonth 7-10: Calculus course\nMonth 11-14: Probability\nMonth 15:   finally open scikit-learn\n            (has forgotten months 1-6)", label: "Sequential — the common plan",
      w: "Fourteen months before the first model. Nothing has an application attached, so retention is poor and motivation collapses somewhere in month four. Most people never reach month fifteen." },
    good: { c: "Week 1:  train a model, not sure why it works\nWeek 2:  shape error -> learn matrix shapes\nWeek 4:  loss won't drop -> learn gradients\nWeek 7:  is 2% real? -> learn significance\nWeek 12: read a paper -> learn the notation", label: "Pulled — what actually works",
      w: "Each piece of maths arrives attached to a problem you already have. That attachment is what makes it stay. You are also building things the entire time, which is what makes you employable and what keeps you going." } } },

  { ana: "Nobody learns the grammar of a language for two years before speaking it. They speak badly, get confused about a tense, learn that tense, and speak slightly less badly. Maths for machine learning works the same way, and for the same reason: the confusion is what tells you which grammar to learn next.",
    at: "Learning a language, not a syllabus" },

  { h: "The order that works" },
  { ol: [
   "**Vectors and dot products** first, because they explain embeddings and retrieval, which is what you will build first anyway.",
   "**Matrices, shapes and multiplication** next. This one pays out immediately — most beginner errors in machine learning are shape errors, and shapes are readable.",
   "**Derivatives and gradients** when you first train something and it fails to learn. The concept of rolling downhill is enough at this point.",
   "**Probability** when you first look at a model output and wonder what the number means.",
   "**Statistics** when you first want to claim an improvement — and this one is worth doing properly, because it is the one that makes you trustworthy.",
   "**Notation** last, as a phrasebook, when you start reading papers."
  ] },

  { h: "How to know when you have enough" },
  { p: "There is no certificate. There are four practical tests, and if you can pass them you have enough maths to do this job well." },
  { l: [
   "You can read `(32, 512) @ (512, 10)` and say both what the result shape is and what the operation means.",
   "You can explain why a loss might stop decreasing, in terms of gradients, without using the word *magic*.",
   "You can look at a model's output of `0.83` and say precisely what it is a probability *of*, and what it is not.",
   "Someone claims their change improved a metric by 2%, and you know the two questions to ask before believing it."
  ] },

  { trap: "Do not confuse *being unable to derive it* with *not understanding it*. Almost no working AI engineer can derive backpropagation from scratch on a whiteboard, and none of them need to. Understanding means being able to picture what it does and predict how it fails. That is a different skill, it is the one that matters, and it is very much achievable." },

  { h: "What this track is not" },
  { p: "If you are heading for research — a PhD, a frontier lab, publishing papers — this track is your floor, not your ceiling. You will need real analysis, measure-theoretic probability, optimisation theory and the ability to write proofs. That is a different path and it is a legitimate one." },
  { p: "For applied AI engineering, which is where most of the jobs and most of the money currently are, this track is genuinely sufficient. Nobody has ever been rejected from an applied AI role for being unable to prove the spectral theorem." },

  { tryit: { t: "Before you go further",
    task: "Write down, honestly, which of the four subjects you are most afraid of. Then write one sentence about what that fear is actually about — the notation, a bad teacher, a specific exam, or the subject itself.",
    hint: "For most people the answer is not the subject. It is notation, or one humiliating experience, or the belief that mathematical ability is fixed. All three are fixable and none of them are about mathematics.",
    w: "This is not a motivational exercise. It is diagnostic. If your problem is notation, the *reading the maths* module fixes it in an afternoon and you can stop avoiding papers. If your problem is a bad school experience, the fix is doing one small thing successfully — which the next lesson is designed to be." } },

  { vocab: ["Linear Algebra", "Gradient", "Probability", "Hypothesis Testing"] }
 ],
 k: [
  "Four subjects: linear algebra for data and models, calculus for training, probability for outputs, statistics for believing results.",
  "The sequential plan — all the maths first — is the single most common way people leave the field.",
  "Take maths alongside models, so each idea arrives attached to a problem you already have.",
  "The bar is picturing and predicting, not deriving. That bar is reachable and it is enough."
 ],
 r: ["Linear Algebra", "Gradient", "Probability", "Statistics", "Hypothesis Testing"]
},

{
 t: "Notation Is a Phrasebook, Not a Wall",
 m: "why",
 lvl: "core",
 s: "Most maths anxiety is symbol anxiety. Here are the twenty symbols, in plain English.",
 goal: [
  "Read the common symbols in a machine learning paper without stalling",
  "Translate a summation into a loop, and a loop back into a summation",
  "Stop treating unfamiliar notation as evidence of a knowledge gap"
 ],
 b: [
  { p: "A large amount of what people call *being bad at maths* is being unable to pronounce the symbols. It feels like a conceptual failure and it is a vocabulary failure, which is a much smaller and much more fixable thing." },

  { p: "Consider this, which stops a lot of people cold:" },
  { out: "L = -(1/N) Σᵢ yᵢ log(ŷᵢ)", ot: "A loss function, in symbols" },
  { p: "Now the same thing as code, which most readers of this track find easy:" },

  { code: { lang: "python", t: "Identical meaning, different alphabet",
    lines: [
     { c: "total = 0", w: "the running sum that **Σ** is about to describe" },
     { c: "for i in range(N):", w: "**Σᵢ** — *sum over every i*. That is all the sigma means: a for loop." },
     { c: "    total += y[i] * log(y_hat[i])", w: "**yᵢ** is the true label, **ŷᵢ** (*y-hat*) the prediction. A hat always means *estimated* or *predicted*." },
     { c: "loss = -total / N", w: "**-(1/N)** — negate, then take the average. Nothing else is happening.", hi: true }
    ],
    after: "The equation and the loop are the same object. If the loop is readable and the equation is not, the gap is notation, and notation takes an afternoon." } },

  { h: "The twenty symbols that cover most papers" },
  { tbl: { t: "The phrasebook",
    h: ["Symbol", "Said aloud", "What it means in code"],
    rows: [
     ["Σ", "sum over", "`for` loop that adds things up"],
     ["Π", "product over", "`for` loop that multiplies things"],
     ["x̂ (*x-hat*)", "x-hat", "a predicted or estimated value, as opposed to the true one"],
     ["x̄ (*x-bar*)", "x-bar", "the mean of the x values"],
     ["∈", "is in", "`x in some_set` — membership"],
     ["ℝⁿ", "R-n", "a vector of n real numbers. `x ∈ ℝ⁵` means x is a list of 5 floats"],
     ["θ", "theta", "the model's parameters, collectively. Every weight in one symbol"],
     ["α", "alpha", "almost always the learning rate"],
     ["λ", "lambda", "almost always a regularisation strength"],
     ["ε", "epsilon", "a tiny number, usually added to stop a division by zero"],
     ["∇", "nabla / grad", "the gradient — the vector of all partial derivatives"],
     ["∂", "partial", "a partial derivative: slope with respect to one variable only"],
     ["≈", "approximately", "close enough"],
     ["∝", "proportional to", "scales with, ignoring the constant"],
     ["| |x| |", "norm of x", "the length of vector x"],
     ["argmax", "arg max", "**not** the maximum value — the *index* that produces it"],
     ["𝔼[X]", "expectation of X", "the average of X over its distribution"],
     ["P(A|B)", "probability of A given B", "how likely A is once you already know B"],
     ["𝒩(μ, σ²)", "normal with mean mu, variance sigma squared", "a bell curve with that centre and spread"],
     ["s.t.", "such that", "subject to the following constraint"]
    ] } },

  { n: "`argmax` is the one that catches people. `max([3, 9, 4])` is `9`. `argmax([3, 9, 4])` is `1` — the position. In classification, `argmax` over the output probabilities gives you the predicted class index, which is why you see it at the end of almost every inference snippet.",
    nt: "The one worth memorising today" },

  { h: "Subscripts, superscripts and the layer confusion" },
  { p: "A subscript is usually an index — `xᵢ` is the i-th example, `wⱼ` is the j-th weight. A superscript is usually a power, except when it is a layer, which is the genuinely annoying exception." },
  { l: [
   "`x²` — x squared. A power.",
   "`W⁽²⁾` — the weight matrix of **layer 2**. The brackets are the tell: parenthesised superscripts are labels, not exponents.",
   "`Wᵀ` — W **transpose**, rows and columns swapped. Extremely common, because it is how you make shapes line up.",
   "`W⁻¹` — the **inverse** of W. Rare in deep learning, common in classical statistics."
  ] },

  { trap: "When a paper defines its own notation in a table near the start — and good papers do — read that table properly instead of skimming it. Ten seconds there saves you fifteen minutes of confusion later, because half of all notational confusion is a symbol that means something different in this particular paper." },

  { h: "How to read an equation you have never seen" },
  { ol: [
   "**Find the output.** What is on the left of the equals sign, and what shape is it? A number, a vector, a matrix?",
   "**Name every symbol** out loud, from the phrasebook or the paper's own table. Do not proceed while any symbol is still unnamed.",
   "**Find the loops.** Every Σ and Π is a `for`. Work out what it is looping over.",
   "**Read the innermost part first**, then work outwards, exactly as you would read a nested function call.",
   "**Sanity check the shapes.** If the left side is a single number and the right side produces a vector, you have misread something."
  ] },

  { tryit: { t: "Translate one",
    task: "Here is cosine similarity, which you will meet constantly in retrieval. Translate it into Python with a loop, then into one line of NumPy.\n\n`sim(a, b) = (Σᵢ aᵢbᵢ) / (||a|| · ||b||)`",
    hint: "The numerator is a dot product — multiply matching positions, add them up. `||a||` is the length of a, which is the square root of the sum of its squares.",
    sol: { lang: "python", code: "import numpy as np\n\n# the equation, read literally\ndef cosine_loop(a, b):\n    num = 0\n    for i in range(len(a)):\n        num += a[i] * b[i]\n    len_a = sum(x * x for x in a) ** 0.5\n    len_b = sum(x * x for x in b) ** 0.5\n    return num / (len_a * len_b)\n\n# the same thing, said properly\ndef cosine(a, b):\n    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))" },
    w: "That equation is the entire mathematical content of vector search. Every semantic search engine, every RAG retriever and every recommendation embedding runs on it. It looked like a wall and it was two lines." } },

  { vocab: ["Cosine Similarity", "Dot Product", "Norm", "Softmax"] }
 ],
 k: [
  "Σ is a for loop that adds. Π is a for loop that multiplies. That is most of what stops people.",
  "A hat means predicted, a bar means average, θ means all the parameters, α is the learning rate.",
  "argmax returns the index, not the value — the single most misread symbol in machine learning.",
  "Read an equation by finding the output, naming every symbol, unrolling the loops, then checking the shapes."
 ],
 r: ["Cosine Similarity", "Dot Product", "Norm", "Softmax", "Gradient"],
 drill: {
  lang: "python",
  reps: 2,
  items: [
   { c: "np.argmax(probs)", w: "the index of the highest probability — the predicted class" },
   { c: "np.linalg.norm(a)", w: "the length of a vector" },
   { c: "a @ b", w: "the dot product of two vectors" },
   { c: "(a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))", w: "cosine similarity, the whole of vector search in one line" }
  ]
 }
}

]);
