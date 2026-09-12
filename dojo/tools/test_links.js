/* Integration test: every cross-reference in the content resolves.

   A vocab chip or a related-term link that names a term the dictionary does
   not have is dropped silently by the renderer -- no error, no console
   warning, just a "Look these up" block with four chips where six were
   written. 293 vocab chips and 197 related links were dead before this test
   existed, and nothing in the app surfaced it.

   The same class of silent gap applies to diagrams and to the study/journey
   wiring, so those are checked here too. */

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

let checks = 0, failures = 0;
function ok(label, cond, extra) {
  checks++;
  if (!cond) { failures++; console.log("  FAIL  " + label + (extra ? "  -> " + extra : "")); }
}

console.log("\nCoreDumps — cross-reference integrity\n");

ok("every script in index.html exists", missingFiles === 0, missingFiles + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));
ok("terms loaded", TD.terms.length > 1000, String(TD.terms.length));
ok("lessons loaded", TD.lessons.length > 300, String(TD.lessons.length));

/* ---- vocab chips ---- */

const deadVocab = [];
let vocabCount = 0;
TD.lessons.forEach((L) => {
  (L.b || []).forEach((blk) => {
    (blk.vocab || []).forEach((name) => {
      vocabCount++;
      if (!TD.resolve(name)) deadVocab.push(L.track + "/" + L.slug + " -> " + name);
    });
  });
});
ok("every vocab chip resolves to a real term", deadVocab.length === 0,
  deadVocab.length + " dead: " + deadVocab.slice(0, 6).join("; "));
ok("lessons actually carry vocab chips", vocabCount > 500, String(vocabCount));

/* ---- related terms, on lessons and on studies ---- */

const deadRelated = [];
let relCount = 0;
TD.lessons.forEach((L) => {
  (L.r || []).forEach((name) => {
    relCount++;
    if (!TD.resolve(name)) deadRelated.push(L.track + "/" + L.slug + " -> " + name);
  });
});
(TD.studies || []).forEach((s) => {
  (s.r || []).forEach((name) => {
    relCount++;
    if (!TD.resolve(name)) deadRelated.push("study/" + (s.slug || s.t) + " -> " + name);
  });
});
ok("every related-term link resolves", deadRelated.length === 0,
  deadRelated.length + " dead: " + deadRelated.slice(0, 6).join("; "));
ok("content actually carries related links", relCount > 1000, String(relCount));

/* A resolved name must also route somewhere -- resolve() returning an object
   with no slug would still render a broken href. */
const noSlug = [];
TD.lessons.forEach((L) => {
  (L.b || []).forEach((blk) => (blk.vocab || []).forEach((name) => {
    const t = TD.resolve(name);
    if (t && !t.slug) noSlug.push(name);
  }));
});
ok("every resolved chip has a slug to link to", noSlug.length === 0, noSlug.slice(0, 5).join("; "));

/* ---- diagrams referenced by terms ---- */

const deadDg = [];
TD.terms.forEach((t) => {
  if (t.dg && !TD.hasDiagram(t.dg)) deadDg.push(t.t + " -> " + t.dg);
});
ok("every term diagram key exists", deadDg.length === 0, deadDg.slice(0, 5).join("; "));

/* ---- lesson module ids must match a declared module ---- */

const orphanLessons = [];
TD.lessons.forEach((L) => {
  const tr = TD.trackById[L.track];
  if (!tr) { orphanLessons.push(L.key + " (no track)"); return; }
  if (L.m && !tr.modIndex[L.m]) orphanLessons.push(L.key + " -> module " + L.m);
});
ok("every lesson sits in a declared module", orphanLessons.length === 0,
  orphanLessons.slice(0, 5).join("; "));

/* ---- no declared module may be empty ---- */

const emptyModules = [];
TD.tracks.forEach((t) => {
  (t.modules || []).forEach((m) => {
    if (!m.count) emptyModules.push(t.id + "/" + m.id);
  });
});
ok("no declared module is empty", emptyModules.length === 0, emptyModules.join("; "));

/* ---- the chips really render ---- */

const withVocab = TD.lessons.filter((L) => (L.b || []).some((b) => b.vocab && b.vocab.length));
let rendered = 0, blank = [];
withVocab.slice(0, 60).forEach((L) => {
  const block = (L.b || []).filter((b) => b.vocab && b.vocab.length)[0];
  const box = document.createElement("div");
  box.innerHTML = TD.lessonBlocks ? TD.lessonBlocks([block]) : "";
  const chips = box.querySelectorAll(".chip");
  if (TD.lessonBlocks) {
    rendered++;
    // every name written must survive into the DOM
    if (chips.length !== block.vocab.length) {
      blank.push(L.slug + " wrote " + block.vocab.length + ", rendered " + chips.length);
    }
  }
});
if (rendered) {
  ok("every written chip actually renders", blank.length === 0, blank.slice(0, 5).join("; "));
} else {
  console.log("  (chip rendering not directly checkable — TD.lessonBlocks not exported)");
}

console.log("\n  " + vocabCount + " vocab chips and " + relCount + " related links, all resolving");

ok("no errors across the run", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("Every cross-reference in the content points at something real.\n");
process.exit(0);
