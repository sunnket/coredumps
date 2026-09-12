/* Integration test: every track has a question bank, and every question is
   structurally sound.

   Eight tracks shipped with no questions at all -- including `basics`, where a
   beginner spends six weeks, and `hunt`, whose content has to be said out loud
   under pressure. This test asserts the coverage does not regress, and audits
   every MCQ on the platform rather than only the newly added ones.

   The structural checks matter because an MCQ with an out-of-range answer
   index teaches the wrong answer with total confidence, and there is no way
   for a reader to tell.
*/

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

let missing = 0;
srcs.forEach((src) => {
  const file = path.join(ROOT, src);
  if (!fs.existsSync(file)) { console.log("  MISSING FILE " + src); missing++; return; }
  const el = document.createElement("script");
  el.textContent = fs.readFileSync(file, "utf8");
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
function eq(label, a, b) {
  ok(label, a === b, "got " + JSON.stringify(a) + ", want " + JSON.stringify(b));
}
function go(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}

console.log("\nCoreDumps — question bank coverage\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- coverage ---- */

const bare = [];
TD.tracks.forEach((t) => {
  let n = 0;
  (t.modules || []).forEach((m) => { n += TD.mcqIn(t.id, m.id).length; });
  if (!n) bare.push(t.id);
});
eq("every track has at least one question", bare.join(", "), "");

/* the tracks that were previously empty, named explicitly so a regression
   points at the right place rather than a generic count */
["zero", "basics", "git", "html", "css", "backend", "hunt", "mlops", "js"]
  .forEach((id) => {
    const t = TD.trackById[id];
    ok("track exists: " + id, !!t);
    let n = 0;
    (t.modules || []).forEach((m) => { n += TD.mcqIn(id, m.id).length; });
    ok(id + " has questions", n >= 3, String(n));
  });

/* ---- every question on the platform is structurally sound ---- */

let total = 0;
const seen = Object.create(null);

TD.tracks.forEach((t) => {
  (t.modules || []).forEach((m) => {
    const qs = TD.mcqIn(t.id, m.id);
    qs.forEach((q, i) => {
      total++;
      const tag = t.id + "/" + m.id + "#" + i;

      /* A stem must exist and be legible. Length alone is the wrong bar: an
         arithmetic drill such as "47 squared = ?" is a complete question in
         seven characters, and an earlier version of this check reported
         fifteen valid aptitude questions as defects. */
      ok(tag + " has a question", !!q.q && String(q.q).trim().length >= 6,
        q.q ? String(q.q).slice(0, 30) : "none");
      ok(tag + " has options", Array.isArray(q.o) && q.o.length >= 2, String((q.o || []).length));
      ok(tag + " answer index is in range",
        typeof q.a === "number" && q.a >= 0 && q.a < (q.o || []).length, String(q.a));
      /* An explanation must exist and say something. The bar is length for
         prose, but a worked calculation is legitimately terse -- "n(n+1)/2 =
         50 x 51 / 2 = 1275" is a COMPLETE explanation in 34 characters, and
         an earlier version of this check reported 61 correct aptitude
         answers as defects. So a short explanation passes when it actually
         shows the working. */
      const x = String(q.x || "");
      const showsWorking = /[=+−×÷*/^]|\d\s*(mod|%)/.test(x);
      ok(tag + " has an explanation", !!x && (x.length > 40 || (x.length > 15 && showsWorking)),
        x ? String(x.length) + ": " + x.slice(0, 40) : "none");

      const uniq = new Set((q.o || []).map((o) => String(o).trim().toLowerCase()));
      eq(tag + " options are distinct", uniq.size, (q.o || []).length);

      (q.o || []).forEach((o, n) => {
        ok(tag + " option " + n + " is non-empty", !!o && String(o).trim().length > 0);
      });

      /* a duplicated question stem across the whole platform is almost always
         a copy-paste that was never edited */
      const key = String(q.q).trim().toLowerCase();
      ok(tag + " question is not a duplicate", !seen[key], seen[key] || "");
      seen[key] = tag;
    });
  });
});

ok("the platform has a substantial bank", total >= 1100, String(total));

/* ---- the routes render for every track that has questions ---- */

TD.tracks.forEach((t) => {
  let n = 0;
  (t.modules || []).forEach((m) => { n += TD.mcqIn(t.id, m.id).length; });
  if (!n) return;

  go("#/quiz/" + t.id);
  ok("quiz track page renders: " + t.id, $("#view").textContent.length > 300);

  /* and one chapter that actually has questions */
  const mod = (t.modules || []).filter((m) => TD.mcqIn(t.id, m.id).length)[0];
  if (mod) {
    go("#/quiz/" + t.id + "/" + mod.id);
    ok("quiz chapter renders: " + t.id + "/" + mod.id,
      $("#view").textContent.length > 300);
  }
});

/* ---- speed coding covers JavaScript as well as Python ---- */

const langs = new Set(TD.speedSets.map((s) => (s.lang || "python").toLowerCase()));
ok("speed coding covers python", langs.has("python"));
ok("speed coding covers javascript", langs.has("javascript"));
ok("speed coding covers the shell", langs.has("bash"));

TD.speedRungs().forEach((r) => {
  const jsSets = r.sets.filter((s) => (s.lang || "").toLowerCase() === "javascript");
  ok("rung " + r.n + " has a JavaScript set", jsSets.length >= 1, String(jsSets.length));
});

TD.speedSets.forEach((S) => {
  S.cards.forEach((c) => {
    ok('speed card in "' + S.id + '" teaches something', !!c.why && c.why.length > 40);
  });
});

ok("no jsdom errors across the whole run", errors.length === 0,
  errors.slice(0, 2).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("Every track has questions, and every question is sound.\n");
process.exit(0);
