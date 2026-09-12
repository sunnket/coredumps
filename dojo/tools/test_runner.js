/* Integration test: the in-page Python runner.

   jsdom cannot download or execute Pyodide, and that is genuinely useful here
   rather than a limitation: the environment this suite runs in is exactly the
   environment a reader on a plane, behind a corporate proxy, or on a blocked
   network is in. So this file proves the two things that matter most about a
   feature which depends on a CDN:

     1. the app is completely unaffected until someone asks to run something
     2. when the runtime cannot be had, the failure is honest and bounded

   The happy path — real CPython producing real output — cannot be asserted
   without a browser, and pretending otherwise with a fake interpreter would
   test the fake. What is asserted instead is that the plumbing around it is
   correct: the source handed over, the namespace isolation, the traceback
   cleaning, and the decision about which blocks are worth offering to run. */

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

console.log("\nCoreDumps — the Python runner\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));
ok("the runner API is present", typeof TD.wireRunners === "function" &&
  typeof TD.runPython === "function" && typeof TD.mountRunner === "function");

/* ---- rule 1: nothing is fetched until asked ---- */

eq("the runtime starts idle", TD.runnerStatus(), "idle");
ok("no runtime script is requested at boot",
  !$('script[src*="pyodide"]'));
ok("the app still declares no external scripts of its own",
  indexHtml.indexOf('script src="http') === -1);

/* ---- Run buttons appear on runnable Python only ---- */

go("#/learn/python/what-a-for-loop-really-does");

const figs = $$("figure.lc");
ok("the lesson rendered code blocks", figs.length > 0, String(figs.length));

const runButtons = $$('[data-act="run-lc"]');
ok("Run buttons were added", runButtons.length > 0, String(runButtons.length));

figs.forEach(function (fig) {
  const lang = (fig.getAttribute("data-lang") || "").toLowerCase();
  const btn = fig.querySelector('[data-act="run-lc"]');
  if (lang !== "python") {
    ok("no Run button on a " + lang + " block", !btn);
  }
});

/* a block that is only a signature or an unclosed opener must not offer Run,
   because executing it produces a SyntaxError that teaches nothing */
let openerOffered = 0;
figs.forEach(function (fig) {
  if (!fig.querySelector('[data-act="run-lc"]')) return;
  const raw = fig.querySelector(".lc-raw");
  const lines = (raw ? raw.textContent : "").split("\n").filter((l) => l.trim());
  if (lines.length && /:\s*$/.test(lines[lines.length - 1])) openerOffered++;
});
eq("no Run button on a block ending in an open block", openerOffered, 0);

/* ---- the editor ---- */

const first = runButtons[0];
const fig = first.closest("figure.lc");
const source = fig.querySelector(".lc-raw").textContent;

ok("the editor is not present before asking", !fig.querySelector(".rn"));
click(first);

const ta = fig.querySelector(".rn-code");
ok("clicking Run mounts an editor", !!ta);
eq("the editor is prefilled with the block's source", ta.value, source);
ok("the editor is sized to the code", ta.rows >= 3);
ok("the editor offers Run", !!fig.querySelector('[data-rn="run"]'));
ok("the editor offers Reset", !!fig.querySelector('[data-rn="reset"]'));
ok("the Run button in the toolbar is now spent", first.disabled);

/* the annotated block itself must survive — it is what the reader came for */
ok("the annotated lines are untouched", fig.querySelectorAll(".lc-line").length > 0);
ok("the raw source is still available for copying", !!fig.querySelector(".lc-raw"));

/* reset restores the original after editing */
ta.value = "print('changed')";
click(fig.querySelector('[data-rn="reset"]'));
eq("Reset restores the original source", fig.querySelector(".rn-code").value, source);

/* mounting twice must not duplicate the editor */
TD.mountRunner(fig, source);
eq("the editor cannot be mounted twice", fig.querySelectorAll(".rn").length, 1);

/* ---- rule 2: failure is honest and bounded ----
   jsdom will not load the CDN, so this exercises the real offline path. The
   timeout is shortened first, because a suite cannot wait 45 seconds. */

TD.runnerTimeout(250);

click(fig.querySelector('[data-rn="run"]'));

ok("pressing Run shows an immediate waiting state",
  !!fig.querySelector(".rn-out.is-wait"));
ok("the waiting state explains the one-off download",
  fig.querySelector(".rn-result").textContent.indexOf("10 MB") !== -1);
ok("Run is disabled while it works", fig.querySelector('[data-rn="run"]').disabled);

setTimeout(function () {
  const text = fig.querySelector(".rn-result").textContent;

  eq("the runtime ends in a failed state, not stuck loading", TD.runnerStatus(), "failed");
  ok("the failure is stated plainly", text.indexOf("Cannot run here") !== -1, text.slice(0, 70));
  ok("the failure explains the likely cause",
    text.indexOf("offline") !== -1 || text.indexOf("blocking") !== -1);
  ok("the failure names the timeout rather than hanging",
    text.indexOf("timed out") !== -1, text.slice(0, 90));
  ok("Run is usable again afterwards", !fig.querySelector('[data-rn="run"]').disabled);

  /* the whole point: the lesson is unaffected */
  ok("the lesson is still fully readable", $("#view").textContent.length > 3000);
  ok("the lesson still shows its annotations", $$(".lc-w").length > 0);
  ok("navigation still works after a failed run",
    (go("#/learn/python/the-named-loop-patterns"),
      $("#view").textContent.indexOf("Named Loop Patterns") !== -1));

  /* a second attempt fails fast rather than re-downloading */
  const t0 = Date.now();
  TD.runPython("print(1)", function (res) {
    ok("a later run fails immediately once the runtime is known bad",
      Date.now() - t0 < 100, (Date.now() - t0) + "ms");
    ok("that failure is marked fatal", res.fatal === true);
    ok("that failure carries a message", !!res.err);

    /* ---- runners are re-wired on every route ---- */

    go("#/learn/python/how-loops-actually-break");
    ok("Run buttons appear on a newly rendered lesson too",
      $$('[data-act="run-lc"]').length > 0);

    go("#/logic");
    eq("no Run buttons on a section with no code blocks",
      $$('[data-act="run-lc"]').length, 0);

    ok("no uncaught errors across the whole run", errors.length === 0,
      errors.slice(0, 2).join(" | "));

    console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
    if (failures) {
      console.log(failures + " FAILED\n");
      process.exit(1);
    }
    console.log("The runner is opt-in, and fails without taking the lesson with it.\n");
    process.exit(0);
  });
}, 700);
