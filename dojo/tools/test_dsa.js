/* Integration test: the DSA track, after the advanced build-out.

   The track shipped with eight modules and exactly one lesson in each -- 46
   minutes total, against 313 for Python -- while its own brief promised "the
   dozen patterns that cover most interview questions". Backtracking, tries,
   union-find, topological sort, intervals and bit manipulation were all named
   in the track description and taught nowhere.

   This test holds the track to what it claims: every promised pattern is
   actually taught, every module has real depth, and every lesson meets the
   same structural bar the other tracks are held to. */

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
function eq(label, a, b) { ok(label, a === b, "got " + JSON.stringify(a) + ", want " + JSON.stringify(b)); }

function go(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}

console.log("\nCoreDumps — DSA track\n");

ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

const dsa = TD.trackById["dsa"];
ok("the track exists", !!dsa);

const lessons = TD.inTrack("dsa");

/* ---- depth ---- */

ok("the track has real depth", lessons.length >= 20, String(lessons.length));
ok("and enough reading time to be a course", dsa.mins >= 100, dsa.mins + " min");

/* It was dead last among technical tracks on minutes. It should now sit
   comfortably inside the pack rather than at the bottom. */
const technical = TD.tracks.filter((t) => t.kind === "field" && t.id !== "dsa");
const median = technical.map((t) => t.mins).sort((a, b) => a - b)[Math.floor(technical.length / 2)];
ok("it is no longer thinner than a typical technical track", dsa.mins >= median,
  "dsa " + dsa.mins + " vs median " + median);

/* ---- every module has more than a token lesson ---- */

const thin = [];
(dsa.modules || []).forEach((m) => {
  const n = TD.inModule("dsa", m.id).length;
  if (n < 2) thin.push(m.id + " has " + n);
});
ok("every module has at least two lessons", thin.length === 0, thin.join("; "));

(dsa.modules || []).forEach((m) => {
  ok("module '" + m.id + "' is not empty", m.count > 0);
});

/* ---- the patterns the track description promises are actually taught ---- */

const allText = lessons.map((L) => JSON.stringify(L)).join(" ").toLowerCase();

const promised = [
  "two pointers", "sliding window", "binary search", "backtracking",
  "dynamic programming", "topological sort", "union-find", "trie",
  "bit manipulation", "dijkstra", "prefix sum", "monotonic stack",
  "heap", "interval", "quickselect", "memois"
];
const untaught = promised.filter((p) => allText.indexOf(p) === -1);
ok("every promised pattern is taught somewhere", untaught.length === 0, untaught.join(", "));

/* the specific gaps that motivated this work -- each needs a lesson of its
   own, not a passing mention in a table */
[
  ["backtracking", /backtrack/i],
  ["topological sort", /topological/i],
  ["union-find", /union-find|union_find|DSU/i],
  ["tries", /\btries?\b/i],
  ["bit manipulation", /bit manipulation|bitmask/i],
  ["intervals", /interval/i],
  ["recurrences", /recurrence|master theorem/i],
  ["amortised cost", /amortis/i]
].forEach(([name, re]) => {
  const owning = lessons.filter((L) => re.test(L.t) || re.test(L.s));
  ok("'" + name + "' has a lesson of its own", owning.length > 0);
});

/* ---- structural quality, the same bar test_newtracks applies ---- */

lessons.forEach((L) => {
  const tag = '"' + L.t.slice(0, 38) + '"';
  ok(tag + " has a summary", !!L.s && L.s.length > 25);
  ok(tag + " has goals", L.goal.length >= 3);
  ok(tag + " has takeaways", L.k.length >= 4);
  ok(tag + " has related terms", L.r.length >= 3);
  ok(tag + " has an exercise", L.b.some((b) => b.tryit));
  ok(tag + " sits in a declared module", !!dsa.modIndex[L.m], L.m);
});

/* every cross-reference in this track must resolve -- the renderer drops
   unknown names silently, so a typo would just vanish */
const deadRefs = [];
lessons.forEach((L) => {
  (L.r || []).forEach((n) => { if (!TD.resolve(n)) deadRefs.push(L.slug + " r:" + n); });
  (L.b || []).forEach((b) => (b.vocab || []).forEach((n) => {
    if (!TD.resolve(n)) deadRefs.push(L.slug + " vocab:" + n);
  }));
});
ok("every term reference resolves", deadRefs.length === 0, deadRefs.slice(0, 5).join("; "));

/* ---- the code in the lessons is Python that parses ---- */

const badCode = [];
lessons.forEach((L) => {
  (L.b || []).forEach((b) => {
    if (b.code && b.code.lines) {
      b.code.lines.forEach((ln) => {
        // a line of annotated code should never be an unclosed bracket soup
        // strip string literals first -- "if ch in '([{'" is balanced code
        // carrying deliberately unbalanced text
        const c = String(ln.c || "").replace(/'[^']*'|"[^"]*"/g, "''");
        const opens = (c.match(/[([{]/g) || []).length;
        const closes = (c.match(/[)\]}]/g) || []).length;
        if (Math.abs(opens - closes) > 2) badCode.push(L.slug + ": " + c.slice(0, 40));
      });
    }
  });
});
ok("annotated code lines look balanced", badCode.length === 0, badCode.slice(0, 3).join("; "));

/* ---- every lesson renders in the real app ---- */

const broken = [];
lessons.forEach((L) => {
  go("#/learn/" + L.key);
  const view = $("#view");
  if (!view || view.innerHTML.length < 800) { broken.push(L.slug + " (thin render)"); return; }
  if (view.textContent.indexOf(L.t) === -1) broken.push(L.slug + " (title missing)");
});
ok("every DSA lesson renders", broken.length === 0, broken.slice(0, 4).join("; "));

/* ---- the module list on the track page reflects the new depth ---- */

go("#/learn/dsa");
const trackText = $("#view").textContent;
["Complexity", "Arrays", "Trees and graphs", "Recursion and dynamic programming"].forEach((name) => {
  ok("the track page lists '" + name + "'", trackText.indexOf(name) !== -1);
});

/* ---- the quiz bank still lines up with the modules ---- */

let banked = 0;
(dsa.modules || []).forEach((m) => {
  banked += (TD.quizzes || []).filter((q) => q.track === "dsa" && q.m === m.id).length;
});
ok("the DSA question bank is still wired to the modules", banked > 20, String(banked));

ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log("\n  " + lessons.length + " lessons, " + dsa.mins + " minutes, " +
  (dsa.modules || []).length + " modules, " + banked + " banked questions");

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("The DSA track teaches what it promises.\n");
process.exit(0);
