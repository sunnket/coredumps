/* Integration test: the quick-reference cards and the interview rehearsal
   sessions added from the DSA + AI Engineer roadmap.

   The cards exist to be scanned under pressure, so what matters is that every
   row resolves to a real dictionary entry — a cue card row pointing at a term
   that does not exist is worse than no row, because the reader follows it and
   finds nothing. The rehearsal sessions are checked for the structure the
   speaking engine needs to score them at all. */

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
  runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, virtualConsole: vc
});
const { window } = dom;
const { document } = window;

window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
window.scrollTo = () => {};
window.scroll = () => {};
window.print = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

let missingFiles = 0;
srcs.forEach((src) => {
  const f = path.join(ROOT, src);
  if (!fs.existsSync(f)) { missingFiles++; return; }
  const el = document.createElement("script");
  el.textContent = fs.readFileSync(f, "utf8");
  document.body.appendChild(el);
});

if (document.readyState === "loading") {
  document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
}

const TD = window.TD;
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.prototype.slice.call(document.querySelectorAll(s));

let checks = 0, failures = 0;
function ok(label, cond, extra) {
  checks++;
  if (!cond) { failures++; console.log("  FAIL  " + label + (extra ? "  -> " + extra : "")); }
}
function eq(label, a, b) { ok(label, a === b, "got " + JSON.stringify(a) + ", want " + JSON.stringify(b)); }

function go(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}

console.log("\nCoreDumps — cue cards and interview rehearsal\n");

ok("every script in index.html exists", missingFiles === 0, String(missingFiles));
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- the cards are registered and routed ---- */

ok("the cue card view exists", typeof TD.viewCueCard === "function");
ok("the formula card view exists", typeof TD.viewFormulaCard === "function");

go("#/cards/patterns");
let view = $("#view");
ok("the pattern card renders", view.innerHTML.length > 3000, String(view.innerHTML.length));
ok("it is titled as the cue card", /pattern cue card/i.test(view.textContent));
ok("the document title is set", /Pattern cue card/.test(document.title), document.title);

const cueRows = $$("#view .cue-table tbody tr");
ok("the cue card has substantial content", cueRows.length >= 30, String(cueRows.length));

go("#/cards/formulas");
view = $("#view");
ok("the formula card renders", view.innerHTML.length > 2500, String(view.innerHTML.length));
ok("it is titled as the formula card", /formula card/i.test(view.textContent));
ok("the document title is set", /formula card/i.test(document.title), document.title);

/* ---- THE RULE: every link on a card must resolve ----
   The cards are indexes as much as reminders. A row pointing at a term that
   does not exist sends the reader to a dead page, which is worse than
   omitting the row. */

const dead = [];
["#/cards/patterns", "#/cards/formulas"].forEach((route) => {
  go(route);
  $$("#view .cue-link").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const slug = href.replace(/^#\/t\//, "");
    if (!href.startsWith("#/t/") || !TD.bySlug[slug]) {
      dead.push(route + " -> " + (a.textContent || href));
    }
  });
});
ok("every card link points at a real term", dead.length === 0, dead.slice(0, 6).join("; "));

go("#/cards/patterns");
const patternLinks = $$("#view .cue-link").length;
ok("the pattern card actually links into the dictionary", patternLinks >= 25, String(patternLinks));

go("#/cards/formulas");
const formulaLinks = $$("#view .cue-link").length;
ok("the formula card links too", formulaLinks >= 10, String(formulaLinks));

/* the constraint table is the highest-value part of the cue card */
go("#/cards/patterns");
["n ≤ 20", "10⁵", "O(n log n)"].forEach((s) => {
  ok("the constraint table mentions " + s, $("#view").textContent.indexOf(s) !== -1);
});

/* and the VRAM arithmetic is the highest-value part of the formula card */
go("#/cards/formulas");
["KV cache", "INT4", "QLoRA"].forEach((s) => {
  ok("the formula card covers " + s, $("#view").textContent.indexOf(s) !== -1);
});

/* ---- the expanded cue card: the data behind it ----
   The card is now filtered rather than merely long, which means the data has
   invariants the render alone cannot show. Every cue must carry a family the
   filter offers, and a tell — the tell column is the reason the card is a
   decision aid rather than a lookup table, so a row without one is a
   regression even though it renders perfectly well. */

const D = TD.cueData || {};
ok("the cue data is exposed for checking", !!D.cues && !!D.families, Object.keys(D).join(","));

const famIds = (D.families || []).map((f) => f.id);
ok("the filter offers the families the roadmap covers",
  ["array", "string", "tree", "graph", "dp", "search", "struct", "math"]
    .every((f) => famIds.indexOf(f) !== -1), famIds.join(","));

ok("the card is broad enough to be worth filtering", (D.cues || []).length >= 80,
  String((D.cues || []).length));

const badCues = [];
(D.cues || []).forEach((c) => {
  if (!c.f || famIds.indexOf(c.f) === -1) badCues.push(c.t + ": family '" + c.f + "'");
  if (!c.tell || c.tell.length < 25) badCues.push(c.t + ": no tell");
  if (!c.see || !c.use || !c.cx) badCues.push(c.t + ": incomplete row");
});
ok("every cue has a family and a tell", badCues.length === 0, badCues.slice(0, 6).join("; "));

/* Every family must actually carry rows, or the filter offers a button that
   empties the page — worse than not offering it. */
const thinFams = famIds.filter((f) => f !== "all" &&
  (D.cues || []).filter((c) => c.f === f).length < 5);
ok("every family the filter offers has real depth", thinFams.length === 0, thinFams.join(","));

/* The confusion pairs are the judgement half of the card, so both sides of
   every pair must be a real term and the question must be one the reader can
   actually answer at the desk. */
const badPairs = [];
(D.confusions || []).forEach((r) => {
  if (!TD.resolve(r[0])) badPairs.push("left missing: " + r[0]);
  if (!TD.resolve(r[1])) badPairs.push("right missing: " + r[1]);
  if (r[0] === r[1]) badPairs.push("pair with itself: " + r[0]);
  if (!r[2] || r[2].length < 40) badPairs.push(r[0] + "/" + r[1] + ": no discriminator");
});
ok("every confusion pair resolves on both sides", badPairs.length === 0,
  badPairs.slice(0, 6).join("; "));
ok("there are enough confusion pairs to be useful", (D.confusions || []).length >= 10,
  String((D.confusions || []).length));

/* The DP state table answers the question that actually stalls people. */
const badStates = [];
(D.states || []).forEach((r) => {
  if (!TD.resolve(r[3])) badStates.push("term missing: " + r[3]);
  if (!/dp\[/.test(r[1])) badStates.push(r[0] + ": the state is not written as dp[...]");
});
ok("every DP state row names a real term and a state", badStates.length === 0,
  badStates.slice(0, 5).join("; "));

/* The structure table must link to real structures, and the ladder must be
   long enough to actually get someone unstuck. */
const badOps = (D.ops || []).filter((r) => !TD.resolve(r[0])).map((r) => r[0]);
ok("every structure in the cost table resolves", badOps.length === 0, badOps.join(","));
ok("the ladder is long enough to unstick someone", (D.ladder || []).length >= 8,
  String((D.ladder || []).length));
ok("every ladder rung explains itself",
  (D.ladder || []).every((r) => r[1] && r[1].length > 30));
ok("the edge-case table covers the families that break", (D.edges || []).length >= 8,
  String((D.edges || []).length));

/* The constraint ladder must stay monotonic — a reader scans it top to bottom
   and a row out of order would send them to the wrong complexity. */
const bounds = (D.constraints || []).map((r) => {
  const m = String(r[0]).replace(/,/g, "");
  const sup = { "\u2070": 0, "\u00b9": 1, "\u00b2": 2, "\u00b3": 3, "\u2074": 4,
    "\u2075": 5, "\u2076": 6, "\u2077": 7, "\u2078": 8, "\u2079": 9 };
  const p = m.match(/10([\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079]+)/);
  if (p) return Math.pow(10, Number(p[1].split("").map((c) => sup[c]).join("")));
  const n = m.match(/(\d+)/);
  return n ? Number(n[1]) : 0;
});
let mono = true;
for (let i = 1; i < bounds.length; i++) if (bounds[i] < bounds[i - 1]) mono = false;
ok("the constraint ladder climbs in order", mono, bounds.join(" -> "));

/* ---- the sections the expansion added actually render ---- */

go("#/cards/patterns");
const cardText = $("#view").textContent;
[["the ladder for when nothing fires", "the ladder"],
 ["the DP state table", "The state, once you have said"],
 ["the confusion pairs", "the question that separates them"],
 ["the structure cost table", "by the operation you do most"],
 ["the edge-case table", "The cases that actually break it"]].forEach((pair) => {
  ok("the card renders " + pair[0], cardText.indexOf(pair[1]) !== -1);
});

ok("the filter bar is rendered", !!$("#view #cueFilter") && !!$("#view #cueSeg"));
ok("every family has a button in the filter",
  $$("#view #cueSeg button").length === famIds.length,
  $$("#view #cueSeg button").length + " vs " + famIds.length);

/* Every filterable row carries the data the filter reads. A row added to a
   table without the attributes silently ignores the filter and stays on
   screen when the reader has asked for something else. */
const rowsNoQ = $$("#view .cue-table tbody tr").filter((tr) => !tr.getAttribute("data-q"));
ok("every table row is filterable", rowsNoQ.length === 0, String(rowsNoQ.length));

/* ---- the cards are reachable from the navigation ---- */

const navLink = $('a[data-nav="cards"]');
ok("there is a sidebar link to the cards", !!navLink);
if (navLink) {
  ok("and it points at the cue card", (navLink.getAttribute("href") || "").indexOf("cards") !== -1);
}

/* ---- interview rehearsal sessions ---- */

const rehearsal = (TD.speakSessions || []).filter((s) => s.track === "dsa");
ok("the interview rehearsal sessions registered", rehearsal.length >= 6, String(rehearsal.length));

const acts = rehearsal.reduce((n, s) => n + s.acts.length, 0);
ok("with enough activities to be worth doing", acts >= 15, String(acts));

/* Every activity must carry what the scoring engine needs, or it silently
   scores nothing and the session looks broken to the learner. */
const badActs = [];
rehearsal.forEach((s) => {
  if (!s.s || s.s.length < 20) badActs.push(s.slug + ": no summary");
  if (!s.why || s.why.length < 40) badActs.push(s.slug + ": no why");
  if ((s.goal || []).length < 2) badActs.push(s.slug + ": too few goals");
  if ((s.coach || []).length < 2) badActs.push(s.slug + ": too little coaching");

  s.acts.forEach((a) => {
    const tag = s.slug + "/" + (a.t || a.i);
    if (a.kind !== "prompt") badActs.push(tag + ": not a prompt activity");
    if (!a.brief || a.brief.length < 30) badActs.push(tag + ": brief too short");
    if (!a.secs) badActs.push(tag + ": no time limit");
    if ((a.expect || []).length < 3) badActs.push(tag + ": too few expect terms");
    if (!a.tip) badActs.push(tag + ": no tip");
  });
});
ok("every rehearsal activity is scoreable", badActs.length === 0, badActs.slice(0, 6).join("; "));

/* the expect patterns are alternatives, so a synonym is never marked wrong */
let single = 0, total = 0;
rehearsal.forEach((s) => s.acts.forEach((a) => {
  (a.expect || []).forEach((e) => { total++; if (e.indexOf("|") === -1) single++; }); }));
ok("most expect patterns offer alternatives", single / total < 0.4,
  single + " of " + total + " have no alternative");

/* ---- every rehearsal session renders ---- */

const broken = [];
rehearsal.forEach((s) => {
  go("#/speak/" + s.slug);
  const v = $("#view");
  if (!v || v.innerHTML.length < 600) { broken.push(s.slug + " (thin)"); return; }
  if (v.textContent.indexOf(s.t) === -1) broken.push(s.slug + " (title missing)");
});
ok("every rehearsal session renders", broken.length === 0, broken.slice(0, 4).join("; "));

go("#/speak");
ok("they appear in the speaking index", $("#view").textContent.indexOf("Explain attention") !== -1);

/* ---- the topics the roadmap says carry the rounds ---- */

const allText = JSON.stringify(rehearsal).toLowerCase();
["attention", "kv cache", "rag", "eval", "prompt injection", "vram", "gqa"].forEach((topic) => {
  ok("rehearsal covers '" + topic + "'", allText.indexOf(topic) !== -1);
});

/* ---- the filter actually filters ----------------------------------------
   The card's whole claim is that it stays usable at this size because you can
   cut it down. That is behaviour, not markup, so it is driven here rather
   than asserted from the HTML.

   The route renders more than once per navigation (the hash assignment and
   the hashchange both drive it), so the live nodes are looked up only after
   the renders have settled. Holding a node reference across a render would
   test an element that is no longer on the page. */

function settle(ms) { return new Promise((res) => setTimeout(res, ms)); }

function typeInto(el, value) {
  el.value = value;
  el.dispatchEvent(new window.Event("input", { bubbles: true }));
  return settle(200);          /* longer than the 120ms debounce */
}

function shownCues() {
  return $$("#view .cue-main tbody tr").filter((tr) => !tr.hidden).length;
}

(async function drive() {
  go("#/cards/patterns");
  await settle(250);

  const total = shownCues();
  ok("the whole card is visible before filtering", total === (D.cues || []).length,
    total + " vs " + (D.cues || []).length);

  let input = $("#view #cueFilter");
  ok("the filter input is live after the renders settle", !!input);

  /* a word that appears in the tells rather than the pattern names, so this
     also proves the tell column is part of what the filter searches */
  await typeInto(input, "negative");
  const neg = shownCues();
  ok("typing narrows the card", neg > 0 && neg < total, neg + " of " + total);
  ok("the count reflects the filter",
    ($("#view #cueCount").textContent || "").indexOf(String(neg)) === 0,
    $("#view #cueCount").textContent);

  /* a complexity, which lives in the sanity-check column */
  await typeInto(input, "O(log n)");
  const logn = shownCues();
  ok("a complexity is searchable too", logn > 0 && logn < total, String(logn));

  /* nothing matches -> the empty note appears rather than a blank page */
  await typeInto(input, "zzzznotathing");
  ok("an impossible query empties the table", shownCues() === 0, String(shownCues()));
  ok("and says so rather than going blank", !$("#view #cueEmpty").hidden);

  await typeInto(input, "");
  ok("clearing restores every row", shownCues() === total, String(shownCues()));

  /* the family segments */
  const graphBtn = $$("#view #cueSeg button").find((b) => b.getAttribute("data-f") === "graph");
  graphBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await settle(60);
  const graphRows = shownCues();
  const graphData = (D.cues || []).filter((c) => c.f === "graph").length;
  ok("the family segment filters to exactly that family", graphRows === graphData,
    graphRows + " shown vs " + graphData + " in the data");
  ok("only one segment reads as selected", $$("#view #cueSeg button.is-on").length === 1,
    String($$("#view #cueSeg button.is-on").length));

  /* a section with nothing left in it is hidden, so the page does not become
     a column of headings and notes with no rows under them */
  const emptySections = $$("#view .card-sec")
    .filter((sec) => sec.querySelectorAll("[data-q]").length > 0 &&
      sec.querySelectorAll("[data-q]:not([hidden])").length === 0 && !sec.hidden);
  ok("a section with no matching rows is hidden", emptySections.length === 0,
    String(emptySections.length));

  const allBtn = $$("#view #cueSeg button").find((b) => b.getAttribute("data-f") === "all");
  allBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await settle(60);
  ok("All restores the card", shownCues() === total, String(shownCues()));

  /* ---- THE RULE: #view survives re-renders, so wiring must not stack ----
     Bouncing between the two cards re-runs the wiring many times. If a
     listener were bound to anything longer-lived than the rendered nodes the
     handler would run once per visit, and the counts would drift. */

  for (let i = 0; i < 6; i++) { go("#/cards/formulas"); go("#/cards/patterns"); }
  await settle(300);

  ok("only one filter input exists after repeated visits",
    $$("#cueFilter").length === 1, String($$("#cueFilter").length));

  input = $("#view #cueFilter");
  await typeInto(input, "heap");
  const heapRows = shownCues();
  ok("the filter still works after twelve navigations", heapRows > 0 && heapRows < total,
    String(heapRows));

  const dpBtn = $$("#view #cueSeg button").find((b) => b.getAttribute("data-f") === "dp");
  await typeInto(input, "");
  dpBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await settle(60);
  ok("and the segments do too",
    shownCues() === (D.cues || []).filter((c) => c.f === "dp").length, String(shownCues()));
  ok("with exactly one segment still selected",
    $$("#view #cueSeg button.is-on").length === 1,
    String($$("#view #cueSeg button.is-on").length));

  /* ---- report ---- */

  console.log("\n  " + cueRows.length + " cue rows (" + (D.cues || []).length +
    " cues across " + (famIds.length - 1) + " families), " +
    (patternLinks + formulaLinks) + " dictionary links, " +
    (D.confusions || []).length + " confusion pairs, " +
    rehearsal.length + " rehearsal sessions, " + acts + " activities");

  ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

  console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
  if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
  console.log("The cards and rehearsal sessions are wired in correctly.\n");
  process.exit(0);
})();
