/* Integration test: the Python "Loops in depth" module.

   Boots the real CoreDumps app in jsdom exactly as index.html declares it,
   then renders every lesson in the loops module through the real
   TD.lessonBody renderer. A block type that produces no HTML, a lesson that
   never registered, or a broken route all fail here rather than in a
   reader's browser. */

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

let checks = 0, failures = 0;
function ok(label, cond, extra) {
  checks++;
  if (!cond) { failures++; console.log("  FAIL  " + label + (extra ? "  -> " + extra : "")); }
}
function eq(label, a, b) {
  ok(label, a === b, "got " + JSON.stringify(a) + ", want " + JSON.stringify(b));
}

console.log("\nCoreDumps — Python loops module\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));
ok("TD namespace present", !!TD);

/* ---- the module is registered on the track ---- */

const track = TD.trackById["python"];
ok("python track exists", !!track);

const mod = track && track.modules.filter((m) => m.id === "loops")[0];
ok("loops module declared in 00-tracks.js", !!mod);
ok("loops module has a name", !!(mod && mod.name));
ok("loops module has a description", !!(mod && mod.desc));

const lessons = TD.inModule("python", "loops");
eq("six lessons registered in the module", lessons.length, 6);
ok("module lesson count matches", !mod || mod.count === lessons.length,
  mod && mod.count + " vs " + lessons.length);

/* ---- expected lessons, in order ---- */

const titles = lessons.map((L) => L.t);
[
  "What a for Loop Really Does",
  "The Named Loop Patterns",
  "Two Pointers and the Sliding Window",
  "The Underrated Loops",
  "How Loops Actually Break",
  "The Loops an AI Engineer Is Expected to Know"
].forEach((t) => ok("lesson present: " + t, titles.indexOf(t) !== -1));

/* ---- every lesson is complete and renders ---- */

const seenBlockKeys = {};

lessons.forEach((L) => {
  const tag = '"' + L.t + '"';

  ok(tag + " has a summary", !!L.s && L.s.length > 20);
  ok(tag + " has learning goals", L.goal.length >= 3);
  ok(tag + " has key takeaways", L.k.length >= 4);
  ok(tag + " has related terms", L.r.length >= 3);
  ok(tag + " has a drill", !!L.drill && L.drill.items.length >= 5);
  ok(tag + " has a sensible reading time", L.mins >= 3 && L.mins <= 40, L.mins + " min");
  ok(tag + " level is valid", ["core", "intermediate", "advanced"].indexOf(L.lvl) !== -1, L.lvl);
  ok(tag + " belongs to the loops module", L.m === "loops");

  /* every drill item must carry code and an explanation */
  (L.drill ? L.drill.items : []).forEach((it, i) => {
    ok(tag + " drill item " + i + " has code", !!it.c);
    ok(tag + " drill item " + i + " has a why", !!it.w);
  });

  /* the real renderer must produce markup for the whole body */
  let hMain = "";
  try { hMain = TD.lessonBody(L); } catch (e) { hMain = ""; ok(tag + " renders", false, e.message); }
  ok(tag + " renders to HTML", hMain.length > 2000, hMain.length + " chars");

  /* and every individual block must produce something, so a typo in a
     block key cannot silently drop content from the page.

     The context is built once and shared: TD.linkCtx rebuilds a regex set
     over the whole dictionary on every call, so making one per block turns
     this loop into minutes of work. */
  const ctx = TD.linkCtx(L);
  L.b.forEach((b, i) => {
    Object.keys(b).forEach((k) => { seenBlockKeys[k] = true; });
    // `dg` legitimately renders empty when the diagram key is unknown,
    // so it is checked separately below.
    if (b.dg != null) return;
    const one = TD.renderLessonBlock
      ? TD.renderLessonBlock(b, ctx)
      : TD.lessonBody({ b: [b], k: [], r: L.r });
    ok(tag + " block " + i + " (" + Object.keys(b)[0] + ") renders", one.trim().length > 0);
  });
});

/* ---- diagram keys referenced actually exist ---- */

lessons.forEach((L) => {
  L.b.forEach((b) => {
    if (b.dg != null) {
      ok("diagram exists: " + b.dg, TD.hasDiagram && TD.hasDiagram(b.dg));
    }
  });
});

/* ---- the block types this module relies on all got exercised ---- */

["p", "h", "l", "ol", "code", "vs", "tbl", "trap", "n", "ana", "tryit", "dg", "k"]
  .forEach((k) => {
    if (k === "k") return;
    ok("block type used and rendered: " + k, !!seenBlockKeys[k]);
  });

/* ---- annotated code blocks are well formed ---- */

let codeBlocks = 0, annotated = 0;
lessons.forEach((L) => {
  L.b.forEach((b) => {
    if (!b.code) return;
    codeBlocks++;
    const lines = b.code.lines || [];
    ok('"' + L.t + '" code block has lines', lines.length > 0);
    lines.forEach((ln) => {
      ok("code line is a string or blank", ln.c == null || typeof ln.c === "string");
      if (ln.w) annotated++;
    });
  });
});
ok("module has a substantial number of code blocks", codeBlocks >= 15, String(codeBlocks));
ok("most code lines carry an explanation", annotated >= 100, String(annotated));

/* ---- vs blocks always have both sides ---- */

lessons.forEach((L) => {
  L.b.forEach((b) => {
    if (!b.vs) return;
    ok('"' + L.t + '" vs block has a bad side', !!(b.vs.bad && b.vs.bad.c));
    ok('"' + L.t + '" vs block has a good side', !!(b.vs.good && b.vs.good.c));
    ok('"' + L.t + '" vs block explains both', !!(b.vs.bad.w && b.vs.good.w));
  });
});

/* ---- tryit blocks always reveal an answer ---- */

let tryits = 0;
lessons.forEach((L) => {
  L.b.forEach((b) => {
    if (!b.tryit) return;
    tryits++;
    ok('"' + L.t + '" tryit has a task', !!b.tryit.task);
    ok('"' + L.t + '" tryit has a hint', !!b.tryit.hint);
    ok('"' + L.t + '" tryit has a solution', !!(b.tryit.sol && b.tryit.sol.code));
  });
});
eq("one exercise per lesson", tryits, 6);

/* ---- the lesson routes actually resolve ---- */

lessons.forEach((L) => {
  ok("route resolves: #/learn/" + L.key, !!TD.lessonByKey[L.key]);
});

/* ---- rendered HTML is balanced enough to not corrupt the page ---- */

lessons.forEach((L) => {
  const h = TD.lessonBody(L);
  const opens = (h.match(/<figure/g) || []).length;
  const closes = (h.match(/<\/figure>/g) || []).length;
  eq('"' + L.t + '" figure tags balance', opens, closes);
  ok('"' + L.t + '" has no undefined leaking into HTML', h.indexOf("undefined") === -1);
});

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("The loops module renders correctly inside CoreDumps.\n");

/* The booted app leaves timers running inside jsdom (the home view rotates,
   the drill schedules work), so node would otherwise sit for minutes after the
   last check before the event loop drained. test_termdex.js exits explicitly
   for the same reason. */
process.exit(0);
