/* Integration test: the JavaScript & TypeScript track.

   This track closes the last declared gap in the curriculum, so the tests
   check both the content and the fact that the gap is genuinely closed --
   the Full-Stack journey must now resolve a real track rather than rendering
   its "not yet written" note.

   Content checks are weighted towards the things that make a lesson useful:
   every lesson needs an exercise, every MCQ needs a correct answer index and
   an explanation that actually explains. */

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

/* Text that is genuinely rendered as prose, excluding code samples. Used to
   distinguish a template bug from a lesson that legitimately talks about
   these strings -- this track teaches that `[] + {}` produces "[object
   Object]", and a naive innerHTML search reports that content as a defect. */
function proseLeaks(root) {
  const walk = document.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const hits = [];
  let node;
  while ((node = walk.nextNode())) {
    if (node.nodeValue.indexOf("[object Object]") === -1) continue;
    let el = node.parentElement, inCode = false;
    while (el && el !== root) {
      if (/^(CODE|PRE|KBD)$/.test(el.tagName)) { inCode = true; break; }
      el = el.parentElement;
    }
    if (!inCode) hits.push(node.nodeValue.trim().slice(0, 80));
  }
  return hits;
}

console.log("\nCoreDumps — JavaScript & TypeScript\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- the track exists and is placed ---- */

const js = TD.trackById["js"];
ok("the js track is defined", !!js);
ok("it has a brief", !!(js && js.brief && js.brief.what));
ok("its brief.build is an array", Array.isArray(js.brief.build));
ok("its brief.good and bad are arrays",
  Array.isArray(js.brief.good) && Array.isArray(js.brief.bad));
ok("it declares modules", js.modules.length >= 8, String(js.modules.length));

/* the stage system must know about it, or it is unreachable from the roadmap */
const webStage = (TD.stages || []).filter((s) => s.id === "web")[0];
ok("the web stage exists", !!webStage);
ok("js is in the web stage", (webStage.tracks || []).indexOf("js") !== -1,
  (webStage.tracks || []).join(","));

/* ---- no empty modules, here or anywhere ---- */

(js.modules || []).forEach((m) => {
  ok("js/" + m.id + " has at least one lesson", m.count >= 1, String(m.count));
  ok("js/" + m.id + " has a description", !!m.desc && m.desc.length > 25);
});

const emptyAnywhere = [];
TD.tracks.forEach((t) => {
  (t.modules || []).forEach((m) => { if (!m.count) emptyAnywhere.push(t.id + "/" + m.id); });
});
eq("no module anywhere is declared and empty", emptyAnywhere.join(", "), "");

/* ---- the curriculum covers what the role needs ---- */

const lessons = TD.inTrack("js");
ok("the track has real depth", lessons.length >= 9, String(lessons.length));

const corpus = lessons
  .map((L) => (L.t + " " + L.s + " " + L.k.join(" ")).toLowerCase())
  .join(" | ");

["closure", "this", "dom", "event", "promise", "async", "fetch",
 "module", "typescript", "react", "state"].forEach((topic) => {
  ok("the track covers: " + topic, corpus.indexOf(topic) !== -1);
});

/* ---- every lesson is complete and renders ---- */

lessons.forEach((L) => {
  const tag = '"' + L.t.slice(0, 36) + '"';
  ok(tag + " has a summary", !!L.s && L.s.length > 25);
  ok(tag + " has goals", L.goal.length >= 3);
  ok(tag + " has takeaways", L.k.length >= 4);
  ok(tag + " has related terms", L.r.length >= 3);
  ok(tag + " has a drill", !!L.drill && L.drill.items.length >= 5);
  ok(tag + " has an exercise", L.b.some((b) => b.tryit));
  ok(tag + " belongs to a declared module",
    (js.modules || []).some((m) => m.id === L.m), L.m);

  go("#/learn/" + L.key);
  const view = $("#view");
  ok(tag + " renders substantially", view.textContent.length > 2500,
    String(view.textContent.length));
  ok(tag + " leaks no [object Object] into prose", proseLeaks(view).length === 0,
    proseLeaks(view)[0]);
});

/* ---- the question bank ---- */

let total = 0;
(js.modules || []).forEach((m) => {
  const qs = TD.mcqIn("js", m.id);
  total += qs.length;

  qs.forEach((q, i) => {
    const tag = "js/" + m.id + "#" + i;
    ok(tag + " has a question", !!q.q && q.q.length > 30);
    eq(tag + " has four options", (q.o || []).length, 4);
    ok(tag + " answer index is in range",
      typeof q.a === "number" && q.a >= 0 && q.a < 4, String(q.a));
    ok(tag + " explains itself", !!q.x && q.x.length > 90,
      q.x ? String(q.x.length) : "none");
    ok(tag + " has a tag", !!q.tag);
    ok(tag + " has a valid level",
      ["core", "intermediate", "advanced"].indexOf(q.lvl) !== -1, q.lvl);

    const uniq = new Set((q.o || []).map((o) => o.trim().toLowerCase()));
    eq(tag + " options are distinct", uniq.size, (q.o || []).length);
    (q.o || []).forEach((o, n) => {
      ok(tag + " option " + n + " is non-empty", !!o && o.trim().length > 0);
    });
  });
});
ok("the bank is substantial", total >= 25, String(total));

/* ---- routes ---- */

go("#/learn/js");
ok("the track page renders", $("#view").textContent.length > 1000);
ok("it names the modules", $("#view").textContent.indexOf("Asynchronous JavaScript") !== -1);

go("#/quiz/js");
ok("the quiz track page renders", $("#view").textContent.length > 400);

go("#/quiz/js/async");
ok("a quiz chapter renders", $("#view").textContent.length > 400);

/* ---- the last declared gap is closed ---- */

const web = TD.journeyById["web"];
ok("the Full-Stack journey exists", !!web);

const jsPhase = web.phases.filter((p) => p.id === "js")[0];
ok("it has a JavaScript phase", !!jsPhase);
ok("that phase now names a real track",
  jsPhase.tracks.length > 0 && TD.journeyTracks(jsPhase).length === jsPhase.tracks.length,
  jsPhase.tracks.join(","));
ok("its goal no longer declares a gap",
  !/not yet written|planned but not built/i.test(jsPhase.goal));

go("#/plan/web");
ok("the web plan renders no gap note",
  $("#view").innerHTML.indexOf("jy-gapnote") === -1);

/* and no journey anywhere still declares one */
let declaredGaps = 0;
TD.journeys.forEach((J) => {
  J.phases.forEach((p) => { if (!p.tracks.length) declaredGaps++; });
});
eq("no journey phase is left without tracks", declaredGaps, 0);

ok("no jsdom errors across the whole run", errors.length === 0,
  errors.slice(0, 2).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("The JavaScript track is complete, placed, and closes the last gap.\n");
process.exit(0);
