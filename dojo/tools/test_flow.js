/* Integration test for the "How it works, step by step" flowcharts.

   The forking step used to render as a Yes/No decision diamond. It was
   replaced because the two branches in the data are two cases, not two
   answers — see the note at the top of termdex/assets/js/flow.js. This test
   boots the real app, renders every flow in the term set, and checks that
   nothing tells the reader one branch is the correct one.

   Scripts are injected in the order index.html lists them, so this exercises
   the real load order. */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..", "..", "termdex");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const srcs = [];
const html = indexHtml
  .replace(/<script src="([^"]+)"><\/script>\s*/g, (_, src) => { srcs.push(src); return ""; })
  .replace(/<link rel="(preconnect|stylesheet)"[^>]*https:\/\/fonts[^>]*\/?>/g, "");

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push(e.message));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "http://localhost/",
  pretendToBeVisual: true,
  virtualConsole: vc
});

const { window } = dom;
const { document } = window;

window.matchMedia = function () {
  return { matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} };
};
window.scrollTo = function () {};
window.scroll = function () {};
window.HTMLElement.prototype.scrollIntoView = function () {};

srcs.forEach((src) => {
  const file = path.join(ROOT, src);
  if (!fs.existsSync(file)) return;
  const el = document.createElement("script");
  el.textContent = fs.readFileSync(file, "utf8");
  document.body.appendChild(el);
});

if (document.readyState === "loading") {
  document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
}

const TD = window.TD;

let checks = 0, failures = 0;
function ok(label, cond, extra) {
  checks++;
  if (!cond) { failures++; console.log("  FAIL  " + label + (extra ? "  -> " + extra : "")); }
}
function eq(label, a, b) {
  ok(label, a === b, "got " + JSON.stringify(a) + ", want " + JSON.stringify(b));
}

console.log("\nCoreDumps — flowchart steps\n");

ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));
ok("TD.flow present", typeof TD.flow === "function");

/* ---- the forking step renders as a normal numbered step ---- */

const sample = {
  t: "Choosing a representation",
  s: ["Decide what you are trying to isolate",
      { q: "Is colour identity the signal, under changing light?",
        y: "HSV or LAB — they separate colour from brightness",
        n: "RGB is fine, and it is what neural networks expect" },
      { s: "Grayscale for shape and texture", n: "Edges rarely need colour." },
      "Convert once, early"]
};

const box = document.createElement("div");
box.innerHTML = TD.flow(sample);

const nodes = box.querySelectorAll(".flow-node");
eq("every item is a step", nodes.length, 4);

const nums = Array.prototype.map.call(box.querySelectorAll(".flow-num"), (e) => e.textContent);
ok("steps are numbered 1..4 with no gap", nums.join(",") === "1,2,3,4", nums.join(","));
ok("no question-mark badge", box.querySelector(".flow-num-q") === null);

const fork = box.querySelector(".flow-node.is-decision");
ok("the forking step is still marked", fork !== null);
ok("a conditional question gets 'It depends'", /It depends:/.test(fork.textContent));
ok("the question survives", /colour identity the signal/.test(fork.textContent));

/* an open question is not a condition, so it must not say "It depends" */
const openQ = document.createElement("div");
openQ.innerHTML = TD.flow({ s: [{ q: "Which platform?", y: "Cross-platform since .NET Core", n: "Windows desktop and Unity games" }] });
ok("an open question gets 'Worth knowing'", /Worth knowing:/.test(openQ.textContent));
ok("and is not framed as a condition", !/It depends/.test(openQ.textContent));

const cases = fork.querySelectorAll(".flow-case");
eq("both cases render", cases.length, 2);
ok("first case text", /HSV or LAB/.test(cases[0].textContent));
ok("second case text", /RGB is fine/.test(cases[1].textContent));

/* the whole point: neither case is labelled as the right answer */
ok("no YES label", !/\bYES\b/.test(box.textContent));
ok("no NO label", !/\bNO\b/.test(box.textContent));
ok("no is-yes class", box.querySelector(".is-yes") === null);
ok("no is-no class", box.querySelector(".is-no") === null);
ok("both cases share one class", cases[0].className === cases[1].className);

/* ---- inline markup and escaping still work inside a case ---- */

const marked = document.createElement("div");
marked.innerHTML = TD.flow({ s: [{ q: "How do you use it?", y: "`if let` unwraps safely", n: "A **hard** rule <b>x</b>" }] });
ok("code spans render in a case", marked.querySelector(".flow-case code") !== null);
ok("bold renders in a case", marked.querySelector(".flow-case strong") !== null);
ok("raw html is escaped", marked.querySelector(".flow-case b") === null);

/* ---- the screen-reader description ---- */

const label = box.querySelector(".flow").getAttribute("aria-label");
ok("description numbers every step", /1\..*2\..*3\..*4\./s.test(label), label.slice(0, 120));
ok("description frames the fork", /It depends:/.test(label));
ok("description leads every fork", (label.match(/It depends:|Worth knowing:/g) || []).length === 1);
ok("description carries both cases", /Either:/.test(label) && /Or:/.test(label));
ok("description has no yes/no answer framing", !/If yes/.test(label) && !/If no/.test(label));

/* ---- every real flow in the term set ---- */

const terms = TD.terms || [];
ok("term set loaded", terms.length > 100, String(terms.length));

let flows = 0, forks = 0, bad = [];
terms.forEach((t) => {
  if (!t.fl) return;
  flows++;
  let out;
  try { out = TD.flow(t.fl); }
  catch (e) { bad.push(t.t + ": threw " + e.message); return; }
  if (!out) { bad.push(t.t + ": rendered empty"); return; }

  const d = document.createElement("div");
  d.innerHTML = out;

  const forkEls = d.querySelectorAll(".flow-node.is-decision");
  forks += forkEls.length;

  // numbering must be a clean 1..n across steps and forks alike
  const seq = Array.prototype.map.call(d.querySelectorAll(".flow-num"), (e) => Number(e.textContent));
  const wanted = seq.map((_, i) => i + 1);
  if (seq.join(",") !== wanted.join(",")) bad.push(t.t + ": numbering " + seq.join(","));

  // no branch may be dressed as the right or wrong answer
  if (d.querySelector(".is-yes") || d.querySelector(".is-no")) bad.push(t.t + ": yes/no branch class");

  forkEls.forEach((f) => {
    if (f.querySelectorAll(".flow-case").length !== 2) bad.push(t.t + ": fork without two cases");

    const lead = f.querySelector(".flow-depends");
    if (!lead) bad.push(t.t + ": fork with no lead-in");
    else if (!/^(It depends:|Worth knowing:)$/.test(lead.textContent.trim())) {
      bad.push(t.t + ": odd lead-in " + lead.textContent);
    }
    // A bare Yes/No *label* on a branch is what we are ruling out. The words
    // may still appear inside the prose itself — YAML's Norway problem needs a
    // literal NO — so only flag one standing alone as a case's own heading.
    Array.prototype.forEach.call(f.querySelectorAll(".flow-case"), (c) => {
      const head = c.firstElementChild;
      if (head && /^(yes|no)$/i.test(head.textContent.trim())) bad.push(t.t + ": yes/no label");
    });
  });
});

/* ---- THE RULE: a step must be followable by someone who does not already
   know the answer -------------------------------------------------------

   "How it works, step by step" is the section a confused reader opens first,
   and it used to be the densest prose in the app — accurate, compressed, and
   written in exactly the vocabulary it was supposed to be teaching. A step
   reading "each neuron computes a weighted sum plus a bias" is perfectly
   correct and useless to the person who came to find out what a neuron is.

   The five categories below were rewritten in plain language: jargon removed
   unless it is the term being taught, and then explained in the same breath;
   a concrete note on nearly every step. These checks stop that quietly
   eroding back to terseness, because "tighten this up" is a very natural
   edit to make and it is the wrong one here.

   The word list is deliberately narrow — only terms that appeared in the
   rewritten categories and were genuinely undefined at the point of use. It
   is not a ban on vocabulary in general; several of these words are fine as
   the subject of their own entry, which is why the check is scoped to the
   step text of these five categories rather than applied everywhere. */

/* Originally scoped to the five hardest categories. The rewrite has since
   reached every category, so this floor now applies to the whole term set —
   a stronger guarantee, and the one worth defending against future edits. */
const PLAIN_CATS = TD.categories.map((c) => c.id);

/* Words that were used as if already known. Each was either removed or is now
   introduced before use. */
const UNDEFINED = /\b(dereference|memoise|reachability|amortis(?:ed|e)|enclosing scope|composite key|partial dependency|sequential scan|write-ahead|deoptimis|element-wise|nominal|idempoten|orthogonal|stochastic)/i;

const plainTerms = TD.terms.filter((t) => t.fl && t.fl.s && PLAIN_CATS.indexOf(t.c) !== -1);
ok("the term set still has flows to check", plainTerms.length > 1000,
  String(plainTerms.length));

function stepText(item) {
  if (typeof item === "string") return item;
  if (item.q) return [item.q, item.y, item.n].join(" ");
  return [item.s, item.n || ""].join(" ");
}

/* Terms rewritten for plainness. Checked individually because these are the
   entries a beginner actually lands on, and a regression in one of them
   matters more than an average across hundreds. */
const REWRITTEN = ["Neural Network", "Backpropagation", "Perceptron", "Weight",
  "Activation Function", "Softmax", "Batch Normalisation", "Residual Connection",
  "Convolution", "Receptive Field", "Static Typing", "Type Inference",
  "JIT Compilation", "Duck Typing", "Memory Safety", "Null Safety",
  "ACID", "Normalisation", "Index", "Transaction", "Isolation Level", "Sharding",
  "Big O Notation", "Recursion", "Hash Table", "Dynamic Programming", "Pointer",
  "Garbage Collection", "Closure", "Race Condition", "Mutex",
  "Large Language Model", "Token", "Temperature", "Context Window",
  "Hallucination", "Fine-Tuning", "LoRA", "Quantisation", "Embedding",
  /* second pass — the remaining categories */
  "Eigenvalue", "Entropy", "Information Gain", "Dot Product", "Gradient",
  "Partial Derivative", "Monte Carlo Method", "Correlation", "Chain Rule",
  "Normal Distribution", "Expected Value", "Maximum Likelihood Estimation",
  "KL Divergence", "Norm",
  "Bias-Variance Trade-off", "Cross-Entropy", "Principal Component Analysis",
  "Gradient Descent", "Inference", "Regularisation", "Cost Function",
  "Logistic Regression", "Feature Scaling", "Dimensionality Reduction",
  "Stochastic Gradient Descent", "Model Capacity",
  "Variable", "Function", "Loop", "Naming Conventions",
  "Array vs Linked List", "Stack and Queue",
  "React", "Flexbox", "Server-Side Rendering", "Tree Shaking",
  "CQRS", "Retry", "Bulkhead", "Message Queue",
  "Inference Server", "Model Drift", "Shadow Deployment",
  "Data Lineage", "Partitioning", "CUDA", "FPGA", "Bandwidth and Latency",
  "Corpus", "Perplexity", "Observability", "Metrics", "Artifact",
  "Cloud Region", "Ransomware", "Vulnerability Scanning", "Grad-CAM"];

const missingTerm = REWRITTEN.filter((n) => {
  const t = TD.resolve(n);
  return !t || !t.fl || !t.fl.s || !t.fl.s.length;
});
ok("every rewritten term still has a flow", missingTerm.length === 0,
  missingTerm.join(", "));

/* Each rewritten flow must actually explain rather than assert. The floors
   are set just under what the rewrite achieved, so they ratchet against
   thinning rather than merely describing today. */
const tooThin = [];
const tooJargon = [];
const noNotes = [];

REWRITTEN.forEach((name) => {
  const t = TD.resolve(name);
  if (!t || !t.fl || !t.fl.s) return;

  const steps = t.fl.s;
  const words = steps.reduce((n, it) =>
    n + stepText(it).split(/\s+/).filter(Boolean).length, 0);

  /* An explanation needs room. Under ~14 words a step is an assertion. */
  if (words / steps.length < 14) tooThin.push(name + " (" + Math.round(words / steps.length) + " w/step)");

  /* Most steps should carry a concrete note or be a fork with two cases —
     either way the reader gets more than a bare instruction. */
  const carried = steps.filter((it) =>
    typeof it !== "string" && (it.n || it.q)).length;
  if (carried / steps.length < 0.6) noNotes.push(name);

  steps.forEach((it) => {
    const m = UNDEFINED.exec(stepText(it));
    if (m) tooJargon.push(name + ": '" + m[0] + "'");
  });
});

ok("every rewritten flow explains rather than asserts", tooThin.length === 0,
  tooThin.slice(0, 5).join("; "));
ok("every rewritten flow carries concrete notes", noNotes.length === 0,
  noNotes.slice(0, 5).join("; "));
ok("no rewritten flow reintroduces an unexplained term", tooJargon.length === 0,
  tooJargon.slice(0, 6).join("; "));

/* Across the whole of those five categories, the average must stay above the
   level the rewrite reached. This catches thinning spread thinly, which no
   per-term check would see. */
let allSteps = 0, allWords = 0, allNotes = 0;
plainTerms.forEach((t) => t.fl.s.forEach((it) => {
  allSteps++;
  allWords += stepText(it).split(/\s+/).filter(Boolean).length;
  if (typeof it !== "string" && (it.n || it.q)) allNotes++;
}));

const wordsPerStep = allWords / allSteps;
const noteRate = allNotes / allSteps;
ok("the term set stays explanatory overall", wordsPerStep > 15,
  wordsPerStep.toFixed(1) + " words per step");
ok("and most steps still carry a note or a fork", noteRate > 0.6,
  (noteRate * 100).toFixed(0) + "%");

/* No single category may fall far behind the rest. An average across 1,280
   flows would happily hide one category left as terse notes, which is
   precisely the state this whole rewrite existed to remove. */
const perCat = {};
plainTerms.forEach((t) => {
  const c = perCat[t.c] || (perCat[t.c] = { steps: 0, words: 0, notes: 0 });
  t.fl.s.forEach((it) => {
    c.steps++;
    c.words += stepText(it).split(/\s+/).filter(Boolean).length;
    if (typeof it !== "string" && (it.n || it.q)) c.notes++;
  });
});

const laggards = Object.keys(perCat).filter((c) => {
  const v = perCat[c];
  return v.steps >= 40 && (v.words / v.steps < 14 || v.notes / v.steps < 0.5);
}).map((c) => c + " (" + (perCat[c].words / perCat[c].steps).toFixed(1) + "w, " +
  Math.round(perCat[c].notes / perCat[c].steps * 100) + "%)");

ok("no category is left terse", laggards.length === 0, laggards.join("; "));

console.log("  " + plainTerms.length + " flows across " +
  Object.keys(perCat).length + " categories, " + wordsPerStep.toFixed(1) +
  " words per step, " + (noteRate * 100).toFixed(0) + "% carrying a note");

ok("every flow renders", bad.length === 0, bad.slice(0, 5).join("; "));
ok("the term set really has flows", flows > 500, String(flows));
ok("and forking steps among them", forks > 500, String(forks));
console.log("  " + flows + " flows rendered, " + forks + " forking steps, all neutral");

ok("no errors across the run", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("Flowchart steps read as steps, not as right-and-wrong answers.\n");
process.exit(0);
