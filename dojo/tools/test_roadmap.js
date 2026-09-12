/* Integration test: coverage of the DSA + AI Engineer Mastery Roadmap.

   The handbook names roughly 350 concepts across seventeen parts. A reader
   working through it should be able to look up every one of them here — and
   before this test existed, only 148 had dictionary entries. The rest were
   either absent entirely or taught inside a lesson without being searchable,
   which is the same thing from the reader's point of view.

   The list lives in roadmap_concepts.js so it can be revised when the
   handbook is. */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const CONCEPTS = require("./roadmap_concepts.js");

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
  runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, virtualConsole: vc
});
const { window } = dom;
const { document } = window;

window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
window.scrollTo = () => {};
window.scroll = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

srcs.forEach((src) => {
  const f = path.join(ROOT, src);
  if (!fs.existsSync(f)) return;
  const el = document.createElement("script");
  el.textContent = fs.readFileSync(f, "utf8");
  document.body.appendChild(el);
});

if (document.readyState === "loading") {
  document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
}

const TD = window.TD;
const $ = (s) => document.querySelector(s);

let checks = 0, failures = 0;
function ok(label, cond, extra) {
  checks++;
  if (!cond) { failures++; console.log("  FAIL  " + label + (extra ? "  -> " + extra : "")); }
}

function go(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}

console.log("\nCoreDumps — roadmap handbook coverage\n");

ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* The handbook's wording differs from the dictionary's title in a few places,
   where the clearer title was worth keeping. These are the only permitted
   mappings; everything else must match by name. */
const ALIAS = {
  "Top-K": "Top-K Pattern",
  "ROC-AUC": "ROC Curve",
  "PR-AUC": "Precision-Recall Curve",
  "Eigenvector": "Eigenvalue"
};

function resolve(name) {
  return TD.resolve(name) || (ALIAS[name] ? TD.resolve(ALIAS[name]) : null);
}

const all = Object.values(CONCEPTS).flat();
ok("the concept list loaded", all.length > 300, String(all.length));

/* ---- every concept the handbook names must be lookup-able ---- */

const missingByPart = {};
let missing = 0;
Object.entries(CONCEPTS).forEach(([part, names]) => {
  const gone = names.filter((n) => !resolve(n));
  if (gone.length) { missingByPart[part] = gone; missing += gone.length; }
});

ok("every roadmap concept has a dictionary entry", missing === 0,
  missing + " missing");
if (missing) {
  Object.entries(missingByPart).forEach(([part, gone]) => {
    console.log("     " + part + ": " + gone.join(", "));
  });
}

/* An alias that stops resolving means the dictionary was renamed underneath
   this test, which would otherwise hide a real gap. */
const deadAlias = Object.entries(ALIAS).filter(([, to]) => !TD.resolve(to));
ok("every alias still points at a real term", deadAlias.length === 0,
  deadAlias.map((a) => a.join(" -> ")).join("; "));

/* ---- a resolved term must also be reachable ---- */

const noSlug = all.map(resolve).filter((t) => t && !t.slug);
ok("every resolved concept has a slug", noSlug.length === 0, String(noSlug.length));

/* ---- and must actually render ---- */

const sample = [
  "Monotonic Stack", "Binary Search on the Answer", "Union-Find", "Bitmask DP",
  "KV Cache", "Grouped-Query Attention", "PagedAttention", "Quantisation",
  "Reciprocal Rank Fusion", "Cross-Encoder", "RAGAS", "Faithfulness",
  "vLLM", "Prompt Injection", "Evaluation", "Consistent Hashing"
];
const broken = [];
sample.forEach((n) => {
  const t = resolve(n);
  if (!t) { broken.push(n + " (unresolved)"); return; }
  go("#/t/" + t.slug);
  const v = $("#view");
  if (!v || v.innerHTML.length < 600) broken.push(n + " (thin render)");
  else if (v.textContent.indexOf(t.t) === -1) broken.push(n + " (title missing)");
});
ok("a sample of roadmap terms all render", broken.length === 0, broken.slice(0, 5).join("; "));

/* ---- the topics the handbook singles out as the unfair advantage ---- */

const EDGE = ["Union-Find", "Monotonic Stack", "Topological Sort", "Trie",
  "Binary Search on the Answer", "Evaluation", "Prefix Caching", "p99 Latency"];
const missingEdge = EDGE.filter((n) => !resolve(n));
ok("the 'unfair advantage' topics are all covered", missingEdge.length === 0,
  missingEdge.join(", "));

/* ---- these must be searchable, not merely defined ---- */

const unsearchable = sample.filter((n) => {
  const t = resolve(n);
  return !t || !TD.byName[t.t.toLowerCase().replace(/[^a-z0-9]/g, "")];
});
ok("roadmap terms resolve by name lookup", unsearchable.length === 0,
  unsearchable.slice(0, 5).join(", "));

/* ---- no concept was added as a duplicate of an existing term ---- */

const byTitle = new Map();
TD.terms.forEach((t) => {
  const k = t.t.toLowerCase().trim();
  if (!byTitle.has(k)) byTitle.set(k, []);
  byTitle.get(k).push(t);
});
const dupes = [...byTitle.values()].filter((v) => v.length > 1);
/* Five pairs pre-date this work and are genuinely different concepts that
   share a word: Kernel, ReAct, Benchmark, Latency, Deadlock. */
ok("no new duplicate titles were introduced", dupes.length <= 5,
  dupes.map((v) => v[0].t).join(", "));

const covered = all.length - missing;
console.log("\n  " + covered + " of " + all.length + " roadmap concepts covered across " +
  Object.keys(CONCEPTS).length + " parts");

ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("Every concept the handbook names can be looked up here.\n");
process.exit(0);
