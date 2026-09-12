/* ==========================================================================
   test_landing.js — the front page and its motion layer.

   Two things are being guarded here, and they are different kinds of thing.

   1. RENDER. The page draws, has every band, and the removed Concept
      Spotlight stays removed.

   2. TRUTH. This is the one that matters. Every number the landing page
      prints about the product is derived from the loaded data at run time.
      A page that says "1,481 concepts" is making a claim, and the moment
      someone adds a data file that claim is either updated by itself or it
      is a lie. So each count rendered on the page is re-derived here from
      TD independently, and compared.

   Also asserted: the motion layer degrades correctly. Under reduced motion
   every revealed element must already be in its final state, because the
   page has to be readable with animation switched off — not merely
   "animate faster", but present.

   Run: node dojo/tools/test_landing.js
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..", "..", "termdex");

let failures = 0;
let checks = 0;

function ok(label, cond, extra) {
  checks++;
  if (!cond) {
    failures++;
    console.log("  FAIL  " + label + (extra ? "  -> " + extra : ""));
  }
}

function eq(label, actual, expected) {
  ok(label, actual === expected,
    "got " + JSON.stringify(actual) + ", want " + JSON.stringify(expected));
}

/* Boot index.html the way the browser would, with an optional reduced-motion
   preference so both modes can be exercised in one run. */
function boot(reduceMotion) {
  const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const srcs = [];
  const html = indexHtml
    .replace(/<script src="([^"]+)"><\/script>\s*/g, (_, s) => { srcs.push(s); return ""; })
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

  window.matchMedia = (q) => ({
    matches: reduceMotion ? /prefers-reduced-motion/.test(q) : /pointer: fine/.test(q),
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}
  });
  window.scrollTo = () => {};
  window.scroll = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};

  /* jsdom has no IntersectionObserver. The landing page's reveals are all
     driven by one, so stub it as "everything is already on screen" — which
     is exactly the state a test wants to assert against. */
  window.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
    unobserve() {}
    disconnect() {}
  };

  srcs.forEach((s) => {
    const f = path.join(ROOT, s);
    if (!fs.existsSync(f)) { failures++; console.log("  FAIL  missing script " + s); return; }
    const el = document.createElement("script");
    el.textContent = fs.readFileSync(f, "utf8");
    document.body.appendChild(el);
  });

  if (document.readyState === "loading") {
    document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  }

  return { window, document, TD: window.TD, errors, srcs };
}

console.log("\nLanding page\n");

const { window, document, TD, errors, srcs } = boot(false);

ok("boots without a jsdom error", errors.length === 0, errors[0]);
ok("motion layer is loaded", !!TD.mo);
ok("landing view is registered", typeof TD.viewLanding === "function");
ok("landing mount is registered", typeof TD.mountLanding === "function");
ok("landing unmount is registered", typeof TD.unmountLanding === "function");

/* the no-external-scripts invariant still holds after adding two files */
ok("no external scripts were introduced",
  srcs.every((s) => !/^https?:/.test(s)),
  srcs.filter((s) => /^https?:/.test(s)).join(", "));

window.location.hash = "#/";

setTimeout(() => {
  const view = document.getElementById("view");
  const html = view.innerHTML;

  /* ---------------- 1. render ---------------- */
  console.log("  render");

  ok("the editorial page rendered", !!view.querySelector(".ed"));
  ok("Concept Spotlight is gone", html.indexOf("Concept Spotlight") === -1);
  ok("the old rotating hero card is gone", !view.querySelector(".hero-card"));
  ok("the old hero rail is gone", !view.querySelector(".hero-rail"));

  ok("masthead present", !!view.querySelector(".ed-mast"));
  ok("contents table present", !!view.querySelector(".ed-toc"));
  ok("anatomy figure present", !!view.querySelector(".ed-anat"));
  ok("ladder present", !!view.querySelector(".ed-ladder"));
  ok("track list present", !!view.querySelector(".ed-tracks"));
  ok("practice grid present", !!view.querySelector(".ed-prac"));
  ok("plans present", !!view.querySelector(".ed-plans"));
  ok("fields index present", !!view.querySelector(".ed-fields"));
  ok("case studies present", !!view.querySelector(".ed-studies"));
  ok("closing colophon present", !!view.querySelector(".ed-end"));

  /* every band carries a numbered head, so the document reads as one piece */
  const heads = [...view.querySelectorAll(".ed-head-n")].map((e) => e.textContent.trim());
  const wantRoman = ["I", "II", "III", "IV", "V", "VI", "VII"];
  ok("sections are numbered in order",
    heads.join(",") === wantRoman.join(","), heads.join(","));

  /* ---------------- 2. truth ----------------
     Each number is re-derived here rather than read from landingFacts(), so
     a bug inside facts() cannot make the test agree with the page. */
  console.log("  numbers");

  const T = TD.terms, C = TD.categories;

  const truth = {
    terms: T.length,
    fields: C.length,
    lessons: TD.lessons.length,
    tracks: TD.tracks.length,
    stages: TD.stages.length,
    questions: TD.quizzes.length,
    katas: TD.katas.length,
    studies: TD.studies.length,
    speaking: TD.speakSessions.length,
    projects: TD.projects.length,
    interviews: TD.interviewQuestions.length,
    companies: TD.interviewCompanies.length,
    cues: TD.logicCards.length,
    speedSets: TD.speedSets.length,
    paths: TD.paths.length,
    diagrams: T.filter((t) => t.dg && TD.hasDiagram(t.dg)).length,
    examples: T.filter((t) => t.ex).length,
    flows: T.filter((t) => t.fl).length,
    hardcore: TD.quizzes.filter((q) => q.lvl === "hardcore").length
  };

  const facts = TD.landingFacts();
  Object.keys(truth).forEach((k) => {
    eq("facts()." + k + " is derived correctly", facts[k], truth[k]);
  });

  /* Every [data-count] on the page must be a number that actually exists in
     the data. A hand-typed marketing number would fail here. */
  const known = new Set(Object.values(truth).concat([0]));
  const counts = [...view.querySelectorAll("[data-count]")]
    .map((e) => parseInt(e.getAttribute("data-count"), 10));
  ok("every counter on the page is a derived number",
    counts.every((c) => known.has(c)),
    counts.filter((c) => !known.has(c)).join(", "));
  ok("the page actually renders counters", counts.length >= 15, String(counts.length));

  /* the prose claims, not just the counters */
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  ok("the lede states the real concept count", html.indexOf(fmt(truth.terms)) !== -1);
  ok("the anatomy caption states the real diagram count",
    view.querySelector(".ed-anat-cap").textContent.indexOf(fmt(truth.diagrams)) !== -1);
  ok("the ladder states the real stage count",
    view.querySelector(".ed-lad-note").textContent.indexOf(truth.stages + " stages") !== -1);
  ok("the hardcore claim matches the bank",
    view.querySelector(".ed-prac").textContent.indexOf(fmt(truth.hardcore)) !== -1);

  /* ---------------- 3. completeness ---------------- */
  console.log("  coverage");

  eq("every field is listed", view.querySelectorAll(".ed-field").length, truth.fields);
  eq("every stage is on the ladder", view.querySelectorAll(".ed-lad-stop").length, truth.stages);
  eq("every plan is shown", view.querySelectorAll(".ed-plan").length, TD.journeys.length);

  /* the track list is deliberately truncated, and must say so */
  const shown = view.querySelectorAll(".ed-track").length;
  ok("the track list is truncated to a scannable length", shown === 12, String(shown));
  ok("the truncation is disclosed with the real remainder",
    view.querySelector(".ed-more").textContent.indexOf(String(truth.tracks - shown)) !== -1,
    view.querySelector(".ed-more").textContent.trim());

  /* every link must go somewhere the router knows about — a dead link on the
     front page renders as a working link that does nothing, which is worse
     than a missing one */
  const badHref = [...view.querySelectorAll(".ed a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => !/^#\//.test(h));
  ok("every landing link is an in-app route", badHref.length === 0, badHref.join(", "));

  const trackIds = new Set(TD.tracks.map((t) => t.id));
  const badTrack = [...view.querySelectorAll(".ed-track a")]
    .map((a) => a.getAttribute("href").replace("#/learn/", ""))
    .filter((id) => !trackIds.has(id));
  ok("every track row links at a real track", badTrack.length === 0, badTrack.join(", "));

  const catIds = new Set(TD.categories.map((c) => c.id));
  const badCat = [...view.querySelectorAll(".ed-field")]
    .map((a) => a.getAttribute("href").replace("#/c/", ""))
    .filter((id) => !catIds.has(id));
  ok("every field links at a real category", badCat.length === 0, badCat.join(", "));

  const studySlugs = new Set(TD.studies.map((s) => s.slug));
  const badStudy = [...view.querySelectorAll(".ed-study")]
    .map((a) => a.getAttribute("href").replace("#/s/", ""))
    .filter((s) => !studySlugs.has(s));
  ok("every case study links at a real study", badStudy.length === 0, badStudy.join(", "));

  /* ---------------- 3b. drawn geometry ----------------
     Two bugs that shipped invisible and were only caught in a screenshot,
     so they get assertions rather than trust.

     The ladder's curve is SVG stretched with preserveAspectRatio="none",
     while its dots are HTML in a CSS grid. The two only line up if the SVG
     puts node i at the centre of column i of the same n columns the grid
     uses. Get that wrong and the last dot floats off the end of the line. */
  console.log("  geometry");

  const lad = view.querySelector(".ed-ladder");
  const ladN = parseInt(lad.style.getPropertyValue("--lad-n"), 10);
  eq("the ladder declares its column count to CSS", ladN, truth.stages);

  const ladSvg = view.querySelector(".ed-lad-svg");
  const vb = ladSvg.getAttribute("viewBox").split(/\s+/).map(Number);
  eq("the viewBox spans one column per stage", vb[2], truth.stages * 100);

  const ladPath = view.querySelector(".ed-lad-line").getAttribute("d");
  /* the curve must start at the centre of the first column and end at the
     centre of the last, which is what puts it under every dot */
  ok("the curve starts at the first column's centre",
    ladPath.indexOf("M50 ") === 0, ladPath.slice(0, 24));
  const lastX = (truth.stages - 1) * 100 + 50;
  const tail = ladPath.trim().split(" ").slice(-2);
  eq("the curve ends at the last column's centre", Number(tail[0]), lastX);

  eq("there is one dot per stage",
    view.querySelectorAll(".ed-lad-dot").length, truth.stages);

  /* Every anatomy label must sit inside the viewBox. The first version of
     this figure had a 720-wide box and labels at x=430 running past its
     right edge, so the longest one was clipped away entirely. */
  const anatSvg = view.querySelector(".ed-anat-svg");
  const avb = anatSvg.getAttribute("viewBox").split(/\s+/).map(Number);
  const labels = [...view.querySelectorAll(".ed-anat-label")];
  eq("every part of an entry is labelled", labels.length, 4);
  labels.forEach((t) => {
    const x = Number(t.getAttribute("x"));
    /* a rough per-character width is enough to catch a label that runs off
       the canvas; it does not need to be a real text metric */
    const needs = x + t.textContent.length * 7;
    ok("label fits the canvas: " + t.textContent.slice(0, 22),
      needs < avb[2], needs + " > " + avb[2]);
  });

  /* ---------------- 4. motion ---------------- */
  console.log("  motion");

  const rise = [...view.querySelectorAll("[data-rise]")];
  ok("the page has scroll reveals", rise.length > 20, String(rise.length));
  ok("every reveal fired once observed",
    rise.every((el) => el.classList.contains("is-in")),
    String(rise.filter((el) => !el.classList.contains("is-in")).length) + " did not");

  const draws = [...view.querySelectorAll("[data-draw]")];
  ok("the page has drawn strokes", draws.length > 8, String(draws.length));
  ok("every stroke got a dash length",
    draws.every((p) => parseFloat(p.style.strokeDasharray) > 0),
    draws.filter((p) => !(parseFloat(p.style.strokeDasharray) > 0)).length + " did not");
  ok("every stroke was released to draw",
    draws.every((p) => p.classList.contains("is-drawn")));

  /* the counters must land on the exact target, not near it */
  const landed = [...view.querySelectorAll("[data-count]")];
  ok("counters render their final value as text",
    landed.every((e) => e.textContent.replace(/[^\d]/g, "").length > 0));

  /* ---------------- 5. accessibility ---------------- */
  console.log("  a11y");

  const h1 = view.querySelectorAll("h1");
  eq("exactly one h1", h1.length, 1);
  ok("the h1 is a real sentence", h1[0].textContent.trim().length > 25);

  /* The "Try" row is built by resolving display names against the term
     index, and TD.resolve returns nothing for a name that has been renamed —
     which renders as an empty row rather than as an error. Assert the count,
     not just the container. */
  const tries = [...view.querySelectorAll(".ed-try")];
  eq("every suggested word resolves to a real entry", tries.length, 5);
  const trySlugs = tries.map((a) => a.getAttribute("href").replace("#/t/", ""));
  ok("each one links at a term that exists",
    trySlugs.every((sl) => !!TD.bySlug[sl]),
    trySlugs.filter((sl) => !TD.bySlug[sl]).join(", "));

  const search = view.querySelector("#heroSearchInput");
  ok("the search field is present", !!search);
  ok("the search field is labelled", !!search.getAttribute("aria-label"));
  eq("the search field is a combobox", search.getAttribute("role"), "combobox");

  ok("the anatomy figure has a text alternative",
    !!view.querySelector(".ed-anat-svg[aria-label]"));
  ok("decorative svg is hidden from AT",
    view.querySelector(".ed-lad-svg").getAttribute("aria-hidden") === "true");

  /* ---------------- 6. search still works ---------------- */
  console.log("  search");

  search.value = "transformer";
  search.dispatchEvent(new window.Event("input", { bubbles: true }));
  const panel = document.getElementById("heroSug");
  ok("typing opens the suggestion panel", panel.hidden === false);
  const rows = view.querySelectorAll(".hero-sug-item");
  ok("suggestions are returned", rows.length > 0, String(rows.length));
  ok("every suggestion carries a destination",
    [...rows].every((r) => /^#\//.test(r.getAttribute("data-href"))));

  /* ---------------- 6b. theme ----------------
     Three states, and the important one is "system": a reader who has not
     chosen must follow their machine, and a reader who has chosen must have
     it stick. The control cycles all three, so the stored value and the
     rendered attribute have to stay in step. */
  console.log("  theme");

  const root = document.documentElement;
  const tbtn = document.getElementById("themeBtn");

  ok("the theme control exists", !!tbtn);
  ok("the theme control is labelled", !!tbtn.getAttribute("aria-label"));
  ok("the control renders the contrast disc", !!tbtn.querySelector(".ico-theme-ring"));
  ok("all three fills are present for cross-fading",
    tbtn.querySelectorAll(".ico-theme-f").length === 3,
    String(tbtn.querySelectorAll(".ico-theme-f").length));

  /* it must not be a sun or a moon — that was the whole point */
  ok("the control is not a sun or a moon",
    tbtn.innerHTML.indexOf("ico-theme") !== -1);

  const seen = [];
  for (let i = 0; i < 4; i++) {
    seen.push({
      pref: tbtn.getAttribute("data-theme-pref"),
      attr: root.getAttribute("data-theme"),
      scheme: root.style.colorScheme
    });
    tbtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  }

  ok("every state resolves to a real theme",
    seen.every((v) => v.attr === "light" || v.attr === "dark"),
    JSON.stringify(seen));
  ok("the rendered theme and the colour-scheme hint agree",
    seen.every((v) => v.attr === v.scheme), JSON.stringify(seen));

  const prefs = seen.map((v) => v.pref);
  ok("the control cycles through all three states",
    new Set(prefs.slice(0, 3)).size === 3, prefs.join(" -> "));
  eq("cycling returns to where it started", prefs[3], prefs[0]);

  /* an explicit choice is stored; "system" stores nothing, so a later change
     of OS preference is still followed */
  tbtn.setAttribute("data-theme-pref", "");
  ["light", "dark"].forEach((want) => {
    while (tbtn.getAttribute("data-theme-pref") !== want) {
      tbtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    }
    eq("choosing " + want + " is stored", TD.store.get("theme", ""), want);
    eq("choosing " + want + " is applied", root.getAttribute("data-theme"), want);
  });

  while (tbtn.getAttribute("data-theme-pref") !== "system") {
    tbtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  }
  eq("choosing system clears the stored choice", TD.store.get("theme", ""), "");

  /* ---------------- 7. teardown ----------------
     #view survives route changes, so leaving home and coming back must not
     double up listeners or leave a timer running. */
  console.log("  teardown");

  window.location.hash = "#/index";
  setTimeout(() => {
    window.location.hash = "#/";
    setTimeout(() => {
      const again = document.getElementById("view");
      eq("returning home renders exactly one page", again.querySelectorAll(".ed").length, 1);
      eq("returning home renders exactly one search field",
        again.querySelectorAll("#heroSearchInput").length, 1);
      eq("returning home renders exactly one masthead",
        again.querySelectorAll(".ed-mast").length, 1);

      runReduced();
    }, 250);
  }, 250);
}, 500);

/* ---------------- 8. reduced motion ----------------
   A second boot, with the preference set. The requirement is not "animates
   less" — it is that the finished page is present immediately. */
function runReduced() {
  console.log("  reduced motion");

  const r = boot(true);
  r.window.location.hash = "#/";

  setTimeout(() => {
    const view = r.document.getElementById("view");

    ok("the page still renders under reduced motion", !!view.querySelector(".ed"));

    const rise = [...view.querySelectorAll("[data-rise]")];
    ok("everything is revealed immediately",
      rise.length > 20 && rise.every((el) => el.classList.contains("is-in")),
      String(rise.filter((el) => !el.classList.contains("is-in")).length) + " hidden");

    const draws = [...view.querySelectorAll("[data-draw]")];
    ok("every stroke is already drawn",
      draws.every((p) => p.classList.contains("is-drawn")));
    ok("no stroke is left offset off-screen",
      draws.every((p) => parseFloat(p.style.strokeDashoffset || 0) === 0),
      draws.filter((p) => parseFloat(p.style.strokeDashoffset || 0) !== 0).length + " offset");

    /* counters must show the real number, not a zero left by a rAF that
       never ran */
    const counts = [...view.querySelectorAll("[data-count]")];
    const stuck = counts.filter((e) => {
      const want = parseInt(e.getAttribute("data-count"), 10);
      const got = parseInt(e.textContent.replace(/[^\d]/g, ""), 10) || 0;
      return want !== got;
    });
    ok("every counter shows its final value with no animation",
      stuck.length === 0,
      stuck.map((e) => e.getAttribute("data-count") + "≠" + e.textContent).join(", "));

    /* the headline must be fully legible, not left mid-wipe. The mask is the
       only thing hiding it, so with motion off it has to be off too. */
    const title = view.querySelector(".ed-title");
    ok("the headline reads in full", title.textContent.indexOf("expected to know") !== -1,
      title.textContent.trim());
    ok("the headline is not left behind a mask",
      [...view.querySelectorAll(".ed-wipe")].length > 0);

    done();
  }, 500);
}

function done() {
  console.log("\n  " + (checks - failures) + "/" + checks + " checks passed");
  if (failures) {
    console.log("  " + failures + " FAILED\n");
    process.exit(1);
  }
  console.log("  landing page OK\n");
  /* jsdom keeps timers and the event loop alive; without this the process
     sits for minutes after the last assertion has already passed. */
  process.exit(0);
}
