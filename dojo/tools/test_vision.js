/* Integration test: the Computer Vision track and the deepened MLOps track.

   CV was the largest hole in the app — thirty-three dictionary terms with no
   track teaching any of them, and a Deep Learning track whose architecture
   module went from convolutions straight to transformers without ever showing
   what vision does with them. So the first thing this file defends is that the
   track exists, is reachable, and actually covers the terms the dictionary
   already promised.

   The second thing is the diagram registry. vision.js is the *third* wrapper
   around it — diagrams.js, then machine.js, then this — and a wrapper that
   forgets to delegate silently hides every diagram beneath it. Nothing errors;
   figures just render empty. So all three layers are checked explicitly here,
   because that failure is invisible in any single-track test.

   MLOps is checked on depth rather than existence. It was the thinnest track
   in the app at under seven content blocks per lesson, which is a tour of tool
   names rather than a course, and the new lessons are organised around the
   failures those tools exist to prevent. The tests pin those failures. */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..", "..", "termdex");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "assets", "css", "styles.css"), "utf8");

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
function go(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}
function lessonsIn(track, mod) {
  return TD.lessons.filter((l) => l.track === track && (!mod || l.m === mod));
}
function blocks(l) { return l.b || []; }
function has(l, key) { return blocks(l).some((b) => b[key] !== undefined); }

console.log("\nCoreDumps — computer vision, and MLOps in practice\n");

ok("every script in index.html exists", missingFiles === 0, String(missingFiles));
ok("the app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ================= the track exists and is placed ================= */

const cv = TD.trackById["cv"];
ok("the computer vision track exists", !!cv);

const cvLessons = lessonsIn("cv");
ok("it is a full track, not a stub", cvLessons.length >= 15, String(cvLessons.length));

/* CV depends on convolutions, so it belongs after Deep Learning. A reader
   meeting it before dl/nets has nothing to build on. */
const order = TD.tracks.map((t) => t.id);
ok("it sits after Deep Learning", order.indexOf("cv") > order.indexOf("dl"),
  order.slice(Math.max(0, order.indexOf("dl") - 1), order.indexOf("cv") + 1).join(","));

/* THE RULE: no module may have a single lesson. A one-lesson module names a
   subject rather than teaching it, which is the shape this whole expansion
   exists to remove. */
const thinModules = (cv.modules || [])
  .map((m) => [m.id, lessonsIn("cv", m.id).length])
  .filter((p) => p[1] < 2);
ok("no CV module is a single lesson", thinModules.length === 0,
  thinModules.map((p) => p[0] + "=" + p[1]).join(","));

const emptyModules = (cv.modules || [])
  .filter((m) => lessonsIn("cv", m.id).length === 0).map((m) => m.id);
ok("no CV module is empty", emptyModules.length === 0, emptyModules.join(","));

/* ---- THE RULE: the track must cover the terms the dictionary promised ----
   The dictionary carried thirty-three CV terms before any track taught them.
   If the track does not reach the important ones, the gap it was built to
   close is still open. */

const cvText = JSON.stringify(cvLessons).toLowerCase();
[
  "convolution", "pooling", "resnet", "transfer learning", "data augmentation",
  "intersection over union", "non-maximum suppression", "mean average precision",
  "yolo", "anchor", "semantic segmentation", "instance segmentation", "u-net",
  "mask r-cnn", "ocr", "pose estimation", "object tracking", "colour space",
  "edge detection", "imagenet", "opencv", "vision transformer", "clip"
].forEach((topic) => {
  ok("CV teaches '" + topic + "'", cvText.indexOf(topic) !== -1);
});

/* Depth bars, set just under what the track currently achieves so they
   ratchet against thinning rather than merely describing today. */
const thinLessons = cvLessons.filter((l) => blocks(l).length < 15).map((l) => l.slug);
ok("no CV lesson is a stub", thinLessons.length === 0, thinLessons.join(","));

const noCode = cvLessons.filter((l) => !has(l, "code")).map((l) => l.slug);
ok("every CV lesson shows real code", noCode.length === 0, noCode.join(","));

const noPractice = cvLessons.filter((l) => !has(l, "tryit")).map((l) => l.slug);
ok("every CV lesson has an exercise", noPractice.length === 0, noPractice.join(","));

const noTrapOrNote = cvLessons.filter((l) => !has(l, "trap") && !has(l, "n")).map((l) => l.slug);
ok("every CV lesson warns about something", noTrapOrNote.length === 0, noTrapOrNote.join(","));

/* ---- the traps that are specific to vision and cost real time ---- */
[
  ["bgr", "the OpenCV channel-order trap"],
  ["inter_nearest", "mask interpolation"],
  ["letterbox", "aspect-ratio preservation"],
  ["synchronize", "honest GPU benchmarking"],
  ["mAP@0.5:0.95".toLowerCase(), "the incomparable-mAP trap"],
  ["deskew", "the highest-value OCR step"]
].forEach((pair) => {
  ok("CV covers " + pair[1], cvText.indexOf(pair[0]) !== -1, pair[0]);
});

/* The annotation-cost argument is the track's central practical claim —
   choose the least precise task — and losing it would leave the advice
   unmotivated. */
ok("CV explains the annotation cost of each task",
  cvText.indexOf("annotat") !== -1 && /200|20×|20x/.test(cvText));

/* ================= the diagrams ================= */

const vd = TD.visionDiagrams || {};
ok("the vision diagrams are registered", Object.keys(vd).length >= 7,
  String(Object.keys(vd).length));

/* THE RULE: vision.js is the third wrapper on the diagram registry. If it
   fails to delegate, everything beneath it silently renders as nothing — no
   error, just empty figures. All three layers are checked. */
ok("vision diagrams resolve", TD.hasDiagram("cv-convolution"));
ok("machine diagrams still resolve through the wrapper", TD.hasDiagram("mc-cycle"));
ok("base diagrams still resolve through both wrappers", TD.hasDiagram("sql-sublanguages"));
ok("and the base ones still render", (TD.diagram("sql-sublanguages") || "").length > 500);
ok("and the machine ones still render", (TD.diagram("mc-cycle") || "").length > 500);
ok("diagramKeys lists all three sets",
  TD.diagramKeys().length > Object.keys(vd).length + 50, String(TD.diagramKeys().length));

const emptyDg = Object.keys(vd).filter((k) => {
  const out = TD.diagram(k);
  return !out || out.length < 400 || out.indexOf("<svg") === -1;
});
ok("every vision diagram renders real markup", emptyDg.length === 0, emptyDg.join(","));

/* Animation must be decoration, never information: every motion class has to
   be defined and switched off under prefers-reduced-motion. */
const motion = ["mv-slide", "mv-fill", "mv-suppress"];
const undef = motion.filter((c) => css.indexOf("." + c + " {") === -1);
ok("every new motion class is defined in the stylesheet", undef.length === 0, undef.join(","));

const reduceAt = css.indexOf("@media (prefers-reduced-motion: reduce)", css.indexOf(".mv-slide {"));
const reduce = reduceAt === -1 ? "" : css.slice(reduceAt, reduceAt + 1200);
const notCalmed = motion.filter((c) => reduce.indexOf("." + c) === -1);
ok("every new motion class is switched off under reduced motion",
  notCalmed.length === 0, notCalmed.join(","));

/* The still frame must carry the meaning. Convolution's readable still is the
   completed output grid; NMS's is the surviving box. */
ok("the convolution still frame shows a completed output", /\.mv-fill\s*\{\s*opacity:\s*1/.test(reduce));
ok("the NMS still frame shows suppression complete", /\.mv-suppress\s*\{\s*opacity:\s*0/.test(reduce));

motion.forEach((c) => {
  const at = css.indexOf("." + c + " {");
  const body = css.slice(at, at + 260);
  const m = /animation-name:\s*([A-Za-z0-9_-]+)/.exec(body);
  ok("the " + c + " class names a real keyframe",
    !!m && css.indexOf("@keyframes " + m[1]) !== -1, m ? m[1] : "none");
});

Object.keys(vd).forEach((k) => {
  const body = vd[k].body();
  ok("the " + k + " diagram loads nothing external",
    body.indexOf("http://") === -1 && body.indexOf("https://") === -1);
});

/* The convolution diagram is the reason this file animates at all. */
go("#/learn/cv/why-a-normal-network-cannot-see");
const convSvg = $("#view svg.dg");
ok("the convolution diagram is on the CNN lesson", !!convSvg);
if (convSvg) {
  ok("its kernel is animated", convSvg.querySelectorAll(".mv-slide").length === 1,
    String(convSvg.querySelectorAll(".mv-slide").length));
  ok("its output cells fill in", convSvg.querySelectorAll(".mv-fill").length === 9,
    String(convSvg.querySelectorAll(".mv-fill").length));
  ok("the animation is inline, needing no script",
    (convSvg.innerHTML || "").indexOf("animate") !== -1);
}

/* ================= MLOps ================= */

const mlops = lessonsIn("mlops");
ok("the MLOps track grew", mlops.length >= 13, String(mlops.length));

const deepMlops = mlops.filter((l) => blocks(l).length >= 15);
ok("MLOps now has genuinely deep lessons", deepMlops.length >= 4, String(deepMlops.length));

const mlopsText = JSON.stringify(mlops).toLowerCase();
[
  ["cudnn", "full determinism, not just seeds"],
  ["point-in-time", "the leak that looks like a good model"],
  ["as_of", "the parameter that makes shared feature code correct"],
  ["shadow", "deploying without trusting"],
  ["rollback", "criteria written in advance"],
  ["prediction rate", "the health signal that works without labels"],
  ["constant", "the feature that went constant"],
  ["retrain", "why retraining first is wrong"]
].forEach((pair) => {
  ok("MLOps covers " + pair[1], mlopsText.indexOf(pair[0]) !== -1, pair[0]);
});

/* The triage ordering is the lesson's central claim — the model is almost
   never the cause — and it is the thing a reader will actually use at 3 a.m. */
ok("MLOps teaches triage before retraining",
  mlopsText.indexOf("diagnose") !== -1 && mlopsText.indexOf("deploy log") !== -1);

/* ================= shared quality bars ================= */

const all = cvLessons.concat(mlops);

const noGoals = all.filter((l) => (l.goal || []).length < 3).map((l) => l.track + "/" + l.slug);
ok("every lesson states what it is for", noGoals.length === 0, noGoals.slice(0, 4).join(","));

const noKey = all.filter((l) => (l.k || []).length < 3).map((l) => l.track + "/" + l.slug);
ok("every lesson closes with takeaways", noKey.length === 0, noKey.slice(0, 4).join(","));

const noRel = all.filter((l) => (l.r || []).length < 3).map((l) => l.track + "/" + l.slug);
ok("every lesson links onward", noRel.length === 0, noRel.slice(0, 4).join(","));

const dead = [];
all.forEach((l) => {
  (l.r || []).forEach((nm) => {
    if (!TD.resolve(nm)) dead.push(l.track + "/" + l.slug + " -> " + nm);
  });
  blocks(l).forEach((b) => (b.vocab || []).forEach((nm) => {
    if (!TD.resolve(nm)) dead.push(l.track + "/" + l.slug + " vocab -> " + nm);
  }));
});
ok("every term reference resolves", dead.length === 0, dead.slice(0, 4).join("; "));

const badTry = [];
all.forEach((l) => blocks(l).forEach((b) => {
  if (!b.tryit) return;
  if (!b.tryit.task || b.tryit.task.length < 40) badTry.push(l.slug + ": thin task");
  if (!b.tryit.sol || !b.tryit.sol.code) badTry.push(l.slug + ": no solution");
}));
ok("every exercise has a real task and a solution", badTry.length === 0,
  badTry.slice(0, 4).join("; "));

/* ================= it all renders ================= */

const broken = [];
let figures = 0;
all.forEach((l) => {
  go("#/learn/" + l.track + "/" + l.slug);
  const v = $("#view");
  if (!v || v.innerHTML.length < 3000) { broken.push(l.track + "/" + l.slug + " (thin)"); return; }
  if (v.textContent.indexOf(l.t) === -1) broken.push(l.track + "/" + l.slug + " (title)");
  figures += $$("#view svg.dg").length;
});
ok("every lesson renders", broken.length === 0, broken.slice(0, 4).join("; "));
ok("the diagrams reach the pages", figures >= 7, String(figures));

/* A lesson asking for a diagram that does not exist renders an empty figure —
   the silent-drop failure this codebase has met before. */
const deadDg = [];
all.forEach((l) => blocks(l).forEach((b) => {
  if (b.dg && !TD.hasDiagram(b.dg)) deadDg.push(l.slug + " -> " + b.dg);
}));
ok("every diagram a lesson asks for exists", deadDg.length === 0, deadDg.join("; "));

go("#/learn/cv");
ok("the CV track page renders", ($("#view").innerHTML || "").length > 8000);
ok("and lists its modules", $("#view").textContent.indexOf("Convolutional networks") !== -1);

go("#/learn");
ok("CV appears on the Learn index", $("#view").textContent.indexOf("Computer Vision") !== -1);

let codeBlocks = 0, annotated = 0;
all.forEach((l) => blocks(l).forEach((b) => {
  if (!b.code) return;
  codeBlocks++;
  if ((b.code.lines || []).some((x) => x.w && x.w.length > 10)) annotated++;
}));
ok("code blocks are annotated, not just shown", annotated / codeBlocks > 0.9,
  annotated + " of " + codeBlocks);

ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

const mins = all.reduce((n, l) => n + l.mins, 0);
console.log("\n  CV " + cvLessons.length + " lessons · MLOps " + mlops.length +
  " lessons (~" + mins + " min), " + Object.keys(vd).length + " vision diagrams, " +
  codeBlocks + " annotated code blocks");

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("Computer vision is taught, drawn and moving; MLOps carries its depth.\n");
process.exit(0);
