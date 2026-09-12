/* test_guides.js — the how-to recipes and their UI.
   ============================================================================
   Guides are the one part of the site a reader follows with a terminal open,
   so a wrong command is worse than a missing one. These checks guard the
   things that would silently mislead:

     - a command that renders as "[object Object]" because a {win,mac} pair
       was never resolved
     - `touch` or `&&` shown to a Windows reader, neither of which exists in
       PowerShell 5.1
     - a step with no instruction, or a guide with no way to tell it worked
     - a diagram id that names a drawing which does not exist
     - a "next" link pointing at a guide that was renamed
   ========================================================================= */

const { TD, document, window } = require("./_boot.js");

let pass = 0;
const fails = [];

function ok(name, cond, extra) {
  if (cond) pass++;
  else fails.push("  FAIL  " + name + (extra ? "  -> " + extra : ""));
}

function section(n) { console.log("\n  " + n); }

console.log("\nGuides");

setTimeout(function () {
  const guides = TD.guides || [];
  const groups = TD.guideGroups || [];

  /* ---- data shape ---- */
  section("data");
  ok("at least 30 guides exist", guides.length >= 30, guides.length + " found");
  ok("groups are defined", groups.length > 0);

  const ids = Object.create(null);
  guides.forEach(function (g) {
    ok("id is unique: " + g.id, !ids[g.id]);
    ids[g.id] = 1;
  });

  guides.forEach(function (g) {
    ok(g.id + " has a title", !!g.t && g.t.length > 4);
    ok(g.id + " has a why", !!g.why && g.why.length > 25);
    ok(g.id + " belongs to a real group",
      groups.some(function (x) { return x.id === g.g; }), g.g);
    ok(g.id + " has steps", g.steps && g.steps.length >= 3, (g.steps || []).length + " steps");
    ok(g.id + " has an honest time", typeof g.mins === "number" && g.mins > 0);

    (g.steps || []).forEach(function (s, i) {
      ok(g.id + " step " + (i + 1) + " has an instruction",
        !!s.do && s.do.trim().length > 10);
    });

    /* Every guide needs at least one way to tell whether it worked —
       otherwise the reader has no idea when to move on. */
    ok(g.id + " tells you what success looks like",
      (g.steps || []).some(function (s) { return !!s.out; }));

    (g.next || []).forEach(function (n) {
      ok(g.id + " next link resolves: " + n, !!ids[n] ||
        guides.some(function (x) { return x.id === n; }), n);
    });
  });

  /* ---- Windows correctness ----
     The project is Windows-first. A command shown under the Windows tab must
     actually run in PowerShell 5.1. */
  section("windows commands");
  guides.forEach(function (g) {
    (g.steps || []).forEach(function (s, i) {
      const c = s.cmd;
      if (!c) return;
      const winCmd = typeof c === "string" ? c : (c.win || "");
      const where = g.id + " step " + (i + 1);
      /* `touch` and `&&` are the two that bite hardest, and both appear in
         copied tutorials constantly. */
      ok(where + " does not use touch on Windows",
        !/^\s*touch\s/m.test(winCmd), winCmd.slice(0, 40));
      ok(where + " does not use && on Windows",
        winCmd.indexOf("&&") === -1, winCmd.slice(0, 40));
    });
  });

  /* ---- rendering ---- */
  section("render");
  ok("index view exists", typeof TD.viewGuides === "function");
  ok("detail view exists", typeof TD.viewGuide === "function");

  const index = TD.viewGuides();
  ok("index renders every guide as a card",
    (index.match(/class="gd-card"/g) || []).length === guides.length);
  ok("index has a platform switch", index.indexOf("data-gos") !== -1);
  ok("index leaks no raw markdown", !/\*\*[A-Za-z]/.test(index.replace(/<[^>]*>/g, "")));

  let objectLeaks = 0, noSvg = [];
  guides.forEach(function (g) {
    const h = TD.viewGuide(g.id);
    if (h.indexOf("[object Object]") !== -1) objectLeaks++;
    if (g.diag && h.indexOf("<svg") === -1) noSvg.push(g.id + ":" + g.diag);
    ok(g.id + " renders every step",
      (h.match(/class="gd-step[ "]/g) || []).length === g.steps.length);
  });
  ok("no unresolved {win,mac} command objects", objectLeaks === 0, objectLeaks + " guides");
  ok("every declared diagram draws something", noSvg.length === 0, noSvg.join(", "));

  const missing = TD.viewGuide("no-such-guide-at-all");
  ok("an unknown id fails gracefully", missing.indexOf("No such guide") !== -1);

  /* ---- live page ---- */
  window.location.hash = "#/guides";
  setTimeout(function () {
    section("in the page");
    const v = document.getElementById("view");
    ok("the index route renders", !!v && v.querySelectorAll(".gd-card").length === guides.length);

    window.location.hash = "#/guides/" + guides[0].id;
    setTimeout(function () {
      const d = document.getElementById("view");
      ok("a detail route renders", !!d && !!d.querySelector(".gd-detail"));
      ok("steps are visible, not left hidden by the reveal",
        !!d && d.querySelectorAll(".gd-step").length === guides[0].steps.length);
      ok("progress bar is present", !!d && !!d.querySelector("#gdBar"));

      const total = pass + fails.length;
      console.log("");
      if (fails.length) {
        fails.slice(0, 25).forEach(function (f) { console.log(f); });
        console.log("\n  " + pass + "/" + total + " checks passed");
        console.log("  " + fails.length + " FAILED");
        process.exit(1);
      }
      console.log("  " + pass + "/" + total + " checks passed");
      console.log("  " + guides.length + " guides, " +
        guides.reduce(function (a, g) { return a + g.steps.length; }, 0) + " steps");
      console.log("  guides OK");
      process.exit(0);
    }, 350);
  }, 450);
}, 700);
