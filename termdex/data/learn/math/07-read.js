/* ML Maths — reading the maths in the wild. */
TD.addLessons("math", [

{
 t: "Reading a Paper's Method Section",
 m: "read",
 lvl: "intermediate",
 s: "You do not need to reproduce it. You need to extract the one usable idea.",
 goal: [
  "Read a paper in the order that actually works, not front to back",
  "Decode a loss function you have never seen before",
  "Decide in ten minutes whether a paper is worth an hour"
 ],
 b: [
  { p: "Reading papers is part of an AI engineer's job, not a luxury — the field moves fast enough that the useful techniques arrive in papers a year or two before they arrive in tutorials. But almost nobody reads a paper the way it is printed, and trying to is why people conclude they cannot." },

  { h: "The order to read in" },
  { ol: [
   "**Abstract.** What do they claim? Ninety seconds. Most papers are eliminated here and that is the point.",
   "**Figures and tables.** Skip the words entirely. A good paper's figure 1 shows you the architecture and the results table shows you whether it worked. You now know more than most people who cite it.",
   "**Conclusion and limitations.** Read this before the method. It tells you what they admit does not work, which frames everything else and saves you from being oversold.",
   "**Introduction, last paragraph.** The contributions, listed. Authors always state them explicitly and it is always near the end of the intro.",
   "**Method** — and only now, and only if the first four convinced you. This is the part everyone starts with, and starting here is why they stop.",
   "**Experiments,** sceptically. What did they compare against, on what data, and what did they conveniently not compare against?"
  ] },

  { n: "Ten minutes on steps 1–4 tells you whether the paper is worth an hour. Most are not, and being efficient about the discard is what makes reading sustainable. People who read every paper front to back read about four papers a year and feel bad about it.",
    nt: "The triage" },

  { h: "Decoding a loss function" },
  { p: "The method section's centre of gravity is usually one equation — the loss. If you can read it, you can usually reimplement the paper. Here is a real one: **contrastive loss**, which is how nearly every embedding model you use was trained." },

  { out: "L = -log( exp(sim(q, k⁺)/τ) / Σⱼ exp(sim(q, kⱼ)/τ) )", ot: "InfoNCE, roughly as it appears in papers" },

  { p: "Now take it apart, using the method from the notation lesson: name every symbol, find the loops, read inside out." },

  { code: { lang: "python", t: "The same equation, as code",
    lines: [
     { c: "def info_nce(q, positive, negatives, tau=0.07):", w: "" },
     { c: "    sims = [q @ positive] + [q @ n for n in negatives]", w: "**sim(q, k)** is just a dot product. `k⁺` is the one correct match; `kⱼ` runs over all candidates, right and wrong.", hi: true },
     { c: "    sims = np.array(sims) / tau", w: "**τ (tau) is the temperature.** Dividing by a small number spreads the scores apart, making the softmax sharper and the training signal harsher." },
     { c: "", w: "" },
     { c: "    e = np.exp(sims - sims.max())", w: "The denominator's **Σⱼ exp(…)** — a softmax, with the usual overflow guard." },
     { c: "    probs = e / e.sum()", w: "" },
     { c: "", w: "" },
     { c: "    return -np.log(probs[0])", w: "**The outer -log.** probs[0] is the positive. Loss is low when the model gave the right match a high probability.", hi: true }
    ],
    after: "Read in plain English: *out of this batch of candidates, push the probability of the correct one up and everything else down*. That is the whole idea. The equation looked like a wall and it is a softmax plus a log." } },

  { p: "And now the practical payoff, which is why this was worth doing: you understand why negatives matter so much in embedding training. The denominator sums over the negatives, so if your negatives are all obviously wrong, the loss is trivially small and the model learns nothing useful. **Hard negative mining** — deliberately choosing wrong answers that look right — is not a trick someone invented; it falls directly out of that denominator." },

  { h: "The phrases that recur, translated" },
  { tbl: { t: "Paper English",
    h: ["What it says", "What it means"],
    rows: [
     ["*We leave this to future work*", "It did not work, or we ran out of compute"],
     ["*Notably, our method requires no additional training*", "Genuinely useful. This one is usually a real selling point"],
     ["*We use a slightly modified version of X*", "**Read this part carefully.** The modification is often where the actual gain came from"],
     ["*Results are averaged over 3 seeds*", "Good practice, and rarer than it should be. If seeds are not mentioned at all, treat small improvements sceptically"],
     ["*We outperform the baseline by 2.3%*", "On which benchmark, at what cost, with how much tuning of theirs versus ours?"],
     ["*Ablation study*", "**The most useful section in most papers.** They removed one piece at a time to show which piece mattered. Read it before the main results"],
     ["*Zero-shot*", "No task-specific training examples given"],
     ["*We scale to N parameters*", "You will not be able to reproduce this, and that is fine — take the idea, not the run"]
    ] } },

  { h: "Reading an architecture diagram" },
  { p: "Nearly every architecture figure follows the same conventions once you know them." },
  { l: [
   "**Boxes are operations, arrows are tensors.** The label on the arrow, if any, is the shape.",
   "**An arrow that skips past boxes is a residual connection** — the input added back to the output. It exists to give gradients a clean path, and you now know why from the calculus module.",
   "**Anything drawn stacked or with `× N`** is repeated N times with different weights. That is what *12-layer* means.",
   "**`⊕` is addition, `⊗` or `×` is multiplication, `[ ; ]` is concatenation.**",
   "**A trapezoid or narrowing box** is a projection changing the dimension — a matrix multiply that makes a vector wider or narrower."
  ] },

  { h: "When you are genuinely stuck" },
  { ol: [
   "**Find the code.** Most papers link a repository, and forty lines of PyTorch usually explain the equation faster than the equation does.",
   "**Find a blog post about it.** For any influential paper someone has written the friendly version, often with pictures.",
   "**Check the shapes.** If you can work out what shapes go in and come out, you understand more than you think.",
   "**Skip it and note what you skipped.** A paper you half-understand today is often obvious in six months, after you have met the problem it solves. Reading order is not a moral matter."
  ] },

  { trap: "Do not read papers as authority. A published result is one team's numbers on one benchmark with their own baseline, which they tuned less carefully than their own method — not by dishonesty, usually, but because that is how effort distributes. The reproduction rate for reported improvements in applied machine learning is poor. Read for the *idea*, then evaluate it yourself on your own data with your own harness. The evaluation is your job; the paper is a suggestion." },

  { tryit: { t: "Ten minutes on a real paper",
    task: "Open the abstract of *Attention Is All You Need* (Vaswani et al., 2017). Spend ten minutes doing steps 1–4 only: abstract, figures, conclusion, contributions. Write three sentences on what it claims and what it replaced. Do not open the method section.",
    hint: "Figure 1 is the architecture and it is the most reproduced diagram in the field. The key claim is in the title — attention alone, no recurrence, no convolution.",
    sol: { lang: "text", code: "A reasonable ten-minute summary:\n\n1. Claim: sequence transduction can be done with attention alone,\n   dropping the recurrence and convolutions everyone assumed were\n   necessary.\n\n2. Why it matters: recurrence forces sequential computation --\n   token t must wait for token t-1. Attention lets every position\n   see every other position simultaneously, so the whole sequence\n   trains in parallel. That is a hardware argument as much as a\n   modelling one, and it is why scale became possible.\n\n3. Evidence: better BLEU on translation at a fraction of the\n   training cost. The cost column matters more than the quality\n   column here -- it is what made everything after 2017 affordable.\n\nWhat you can skip on a first pass: the exact positional encoding\nformula, the label smoothing value, the beam search details." },
    w: "You now understand the most important architecture in modern AI well enough to discuss it in an interview, and you did not read a single equation. The method section is worth reading eventually — the deep learning track builds that block line by line — but the shape of the contribution was available in ten minutes." } },

  { vocab: ["Transformer", "Attention Mechanism", "Softmax", "Embedding"] }
 ],
 k: [
  "Read abstract, figures, conclusion and contributions first; the method last, and only if the first four earned it.",
  "Decode a loss function by naming every symbol, unrolling the sums, and reading inside out.",
  "The ablation study is usually the most informative section — it shows which piece actually mattered.",
  "In diagrams: boxes are operations, arrows are tensors, a skipping arrow is a residual connection.",
  "Read for the idea, not for authority. Reported improvements frequently do not reproduce on your data."
 ],
 r: ["Transformer", "Attention Mechanism", "Softmax", "Embedding", "Contrastive Learning"]
}

]);
