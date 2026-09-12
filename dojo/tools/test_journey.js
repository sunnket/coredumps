/* Integration test: the Journeys section, and the curation it provides.

   This section exists to connect everything else, so the tests are mostly
   about integrity of the connections rather than rendering:

     * every track a journey names must exist (or the phase must openly
       declare itself a gap -- a silent empty phase is the failure mode)
     * every practice link must point at a route the app actually serves
     * no track may be orphaned from the stage system
     * no module anywhere may be declared and left empty

   That last one is here because an empty module shipped once already, and a
   test is the only thing that stops it happening again. */

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
const $$ = (s) => Array.prototype.slice.call(document.querySelectorAll(s));

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
function click(el) {
  el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
}

console.log("\nCoreDumps — Journeys and curation\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- nothing anywhere is declared and empty ---- */

const emptyModules = [];
TD.tracks.forEach((t) => {
  (t.modules || []).forEach((m) => {
    if (!m.count) emptyModules.push(t.id + "/" + m.id);
  });
});
eq("no module anywhere is declared and empty", emptyModules.join(", "), "");

/* ---- no track is orphaned from the stage system ---- */

const staged = Object.create(null);
(TD.stages || []).forEach((st) => {
  (st.tracks || []).forEach((id) => { staged[id] = st.id; });
});
const orphans = TD.tracks.filter((t) => !staged[t.id]).map((t) => t.id);
eq("every track belongs to at least one stage", orphans.join(", "), "");

/* ---- the journeys are registered ---- */

ok("journeys are defined", TD.journeys.length >= 4, String(TD.journeys.length));
ok("the AI journey exists", !!TD.journeyById["ai"]);

TD.journeys.forEach((J) => {
  const tag = '"' + J.short + '"';
  ok(tag + " has a name", !!J.name);
  ok(tag + " has a deck", !!J.deck && J.deck.length > 25);
  ok(tag + " has a description", !!J.desc && J.desc.length > 80);
  ok(tag + " states the market honestly", !!J.market && J.market.length > 40);
  ok(tag + " has phases", J.phases.length >= 5, String(J.phases.length));
  ok(tag + " totals a plausible number of weeks", J.weeks >= 30 && J.weeks <= 80,
    String(J.weeks));

  J.phases.forEach((p) => {
    const ptag = tag + " phase " + p.n;
    ok(ptag + " is named", !!p.name);
    ok(ptag + " names its weeks", !!p.weeks);
    ok(ptag + " counts its weeks", p.weekCount > 0, String(p.weekCount));
    ok(ptag + " has a goal", !!p.goal && p.goal.length > 50);
    ok(ptag + " states its proof", !!p.proof && p.proof.length > 30);

    /* Every declared track must exist. A phase that resolves to nothing is
       only acceptable when the goal openly says the track is unwritten --
       otherwise it is a broken link a reader would have to interpret. */
    const resolved = TD.journeyTracks(p);
    if (p.tracks.length) {
      eq(ptag + " every named track resolves", resolved.length, p.tracks.length);
    } else {
      ok(ptag + " declares its own gap in the goal",
        /not yet written|does not exist|planned but not/i.test(p.goal),
        p.goal.slice(0, 60));
    }

    /* practice links must point somewhere the app serves */
    (p.practice || []).forEach((pr) => {
      ok(ptag + " practice link has a label", !!pr.label);
      ok(ptag + " practice link is a route", /^#\//.test(pr.href), pr.href);
    });
  });
});

/* ---- practice links resolve to real routes ---- */

const routes = [];
TD.journeys.forEach((J) => {
  J.phases.forEach((p) => {
    (p.practice || []).forEach((pr) => { routes.push(pr.href); });
  });
});
const uniqueRoutes = Array.from(new Set(routes));
ok("journeys link out to other sections", uniqueRoutes.length >= 8,
  String(uniqueRoutes.length));

uniqueRoutes.forEach((href) => {
  go(href);
  const text = $("#view").textContent;
  ok("practice route renders: " + href, text.length > 300, String(text.length));
  ok("practice route is not a not-found: " + href,
    text.indexOf("No such") === -1 && text.indexOf("not found") === -1);
});

/* ---- progress is derived, and consistent ---- */

TD.journeys.forEach((J) => {
  const pr = TD.journeyProgress(J);
  ok('"' + J.short + '" totals lessons across its phases', pr.total > 100, String(pr.total));
  ok('"' + J.short + '" percentage is in range', pr.pct >= 0 && pr.pct <= 100, String(pr.pct));

  const next = TD.journeyNext(J);
  ok('"' + J.short + '" can name a next lesson', !!next && !!next.lesson);
  if (next) {
    ok('"' + J.short + '" next lesson is real', !!TD.lessonByKey[next.lesson.key]);
    ok('"' + J.short + '" next lesson names its phase', !!next.phase.name);
  }
});

/* ---- the chooser and the plan pages ---- */

go("#/plan");
ok("the chooser renders", $("#view").textContent.length > 1200);
eq("one card per journey", $$(".jy-card").length, TD.journeys.length);
eq("the section titles itself", document.title, "Your plan — CoreDumps");
ok("the sidebar has a plan entry", !!$('.side-link[data-nav="plan"]'));
ok("the sidebar entry is active here", $('.side-link[data-nav="plan"]').classList.contains("is-active"));

TD.journeys.forEach((J) => {
  go("#/plan/" + J.id);
  const view = $("#view");
  eq("phases render for " + J.id, $$(".jy-phase").length, J.phases.length);
  ok("a next action is offered for " + J.id,
    view.textContent.indexOf("Start here") !== -1 ||
    view.textContent.indexOf("Pick up where") !== -1);
  ok("no undefined leaks into " + J.id, view.innerHTML.indexOf("undefined") === -1);
  ok("no [object Object] leaks into " + J.id, view.innerHTML.indexOf("[object Object]") === -1);
});

go("#/plan/does-not-exist");
ok("an unknown plan degrades gracefully",
  $("#view").textContent.indexOf("No such plan") !== -1);

/* ---- choosing a plan drives the home page ---- */

TD.journeyChoice.set("");
go("#/");
ok("with no plan, home invites you to pick one", !!$(".rz-empty"));
ok("that invitation links to the chooser",
  $(".rz-empty").getAttribute("href") === "#/plan");

go("#/plan/ai");
click($("[data-jy-pick]"));
eq("choosing a plan stores it", TD.journeyChoice.get(), "ai");

go("#/");
const band = $(".rz");
ok("home now shows the resume band", !!band && !band.classList.contains("rz-empty"));
ok("the band names the journey", band.textContent.indexOf("AI Engineer") !== -1);
ok("the band offers a continue link", !!$('.rz-a a[href^="#/learn/"]'));
ok("the band links back to the plan", !!$('.rz-a a[href="#/plan/ai"]'));

/* the control is a toggle, so a reader can undo a choice */
go("#/plan/ai");
click($("[data-jy-pick]"));
eq("choosing again clears it", TD.journeyChoice.get(), "");

/* ---- the listener is bound once, not per render ---- */

TD.journeyChoice.set("");
go("#/plan/backend");
go("#/plan");
go("#/plan/backend");
click($("[data-jy-pick]"));
eq("a single click is handled once after re-renders",
  TD.journeyChoice.get(), "backend");

ok("no jsdom errors across the whole run", errors.length === 0,
  errors.slice(0, 2).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("Journeys connect the sections, and nothing is orphaned or empty.\n");
process.exit(0);
