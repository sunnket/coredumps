/* Integration test: boot the real CoreDumps app in jsdom, then drive the
   Code Dojo section the way a reader would.

   Scripts are injected in the order index.html lists them, so this exercises
   the actual load order — a data file registering before banks.js defines
   TD.addKata would fail here, which is the point. */

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

// jsdom defines scrollTo/scrollIntoView as stubs that throw "Not implemented",
// which every route change would trip. Overwrite them outright — `||` would
// keep jsdom's throwing version, since it is an own property.
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

console.log("\nCoreDumps — Code Dojo integration\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));
ok("TD namespace present", !!TD);

/* ---- bank registration ---- */

eq("117 problems registered", TD.katas.length, 117);
eq("18 patterns", TD.kataPatterns().length, 18);
ok("ids are indexed", !!TD.kataById["two-sum"]);
ok("difficulty maps to a CoreDumps level", TD.kataById["two-sum"].lvl === "core");
ok("hard maps to hardcore", TD.kataById["trapping-rain-water"].lvl === "hardcore");
ok("companies aggregate", TD.kataCompanies().length > 20, String(TD.kataCompanies().length));
ok("solutions carried through", TD.kataById["two-sum"].solution.indexOf("def two_sum") === 0);

/* ---- the index view ---- */

go("#/code");
eq("route resolves", document.title, "Code Dojo — CoreDumps");
ok("sidebar marks the section active",
  $('[data-nav="code"]').classList.contains("is-active"));
eq("all problems listed", $$("#djList .dj-row").length, 117);
eq("pattern groups rendered", $$("#djList .dj-group").length, 18);
ok("count shown", /117 shown/.test($("#djCount").textContent), $("#djCount").textContent);
ok("uses the shared level pill", $$("#djList .lvl[data-lvl]").length === 117);

// filters
$("#djSearch").value = "linked";
$("#djSearch").dispatchEvent(new window.Event("input", { bubbles: true }));
const linked = $$("#djList .dj-row").length;
ok("search filters", linked > 0 && linked < 117, "n=" + linked);

$("#djSearch").value = "";
$("#djSearch").dispatchEvent(new window.Event("input", { bubbles: true }));
eq("clearing search restores", $$("#djList .dj-row").length, 117);

$('[data-diff="Hard"]').click();
eq("difficulty filter", $$("#djList .dj-row").length, 13);
$('[data-diff="Hard"]').click();

$("#djCompany").value = "Google";
$("#djCompany").dispatchEvent(new window.Event("change", { bubbles: true }));
const googles = TD.katas.filter((K) => K.companies.indexOf("Google") >= 0).length;
eq("company filter", $$("#djList .dj-row").length, googles);
$("#djCompany").value = "";
$("#djCompany").dispatchEvent(new window.Event("change", { bubbles: true }));

/* ---- a problem page ---- */

go("#/code/two-sum");
eq("problem title", document.title, "Two Sum — CoreDumps");
ok("crumbs link back", $(".crumbs a[href='#/code']") !== null);
ok("statement rendered", $(".dj-brief p").textContent.indexOf("indices") > 0);
ok("examples rendered", $$(".dj-ex").length === 2);
ok("constraints rendered", $$(".dj-cons li").length === 3);
ok("editor mounted", $(".dj-input") !== null);
ok("coach mounted", $(".dj-coach") !== null);
ok("next problem link", $(".dj-nav a[href*='#/code/']") !== null);

const input = $(".dj-input");
const layer = $(".dj-layer");
const K = TD.kataById["two-sum"];
const lines = K.solution.split("\n");

function type(text) {
  input.value = text;
  input.selectionStart = input.selectionEnd = text.length;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}
function key(k, opts) {
  input.dispatchEvent(new window.KeyboardEvent("keydown",
    Object.assign({ key: k, code: k, bubbles: true, cancelable: true }, opts || {})));
}

eq("blueprint drawn for every line", $$(".dj-ln").length, lines.length);
eq("gutter matches", $$(".dj-gutter div").length, lines.length);
ok("ghost text is the reference",
  layer.textContent.replace(/\n/g, "") === K.solution.replace(/\n/g, ""),
  JSON.stringify(layer.textContent.slice(0, 50)));
ok("uses the shared token classes", $$(".dj-layer .tok-kw").length > 0);

type(lines[0]);
eq("correct typing is not flagged", $$(".dj-bad").length, 0);
ok("finished line marks the gutter", $(".dj-gutter div").className.indexOf("is-done") >= 0,
  $(".dj-gutter div").className);

type(lines[0] + "\n    zzz");
eq("divergence is flagged", $$(".dj-bad").length, 1);
eq("flagged text is the typo", $(".dj-bad").textContent, "zzz");

type(K.solution);
eq("no ghost left when complete", $$(".dj-gh").length, 0);
eq("match reads 100%", $('[data-o="match"]').textContent, "100%");
eq("progress bar full", $(".dj-track i").style.width, "100%");

/* assist levels */
$('[data-mode="outline"]').click();
type("");
ok("outline hides the body", layer.textContent.indexOf("seen[num] = i") < 0);
ok("outline keeps the opening word", layer.textContent.indexOf("def") === 0);

$('[data-mode="off"]').click();
type("");
eq("blank shows nothing", layer.textContent.trim(), "");
eq("blank hides the readout", $('[data-o="match"]').textContent, "—");
type("def two_sum(nums, target):");
eq("blank does not flag divergence", $$(".dj-bad").length, 0);
ok("blank still highlights", $$(".dj-layer .tok-kw").length > 0);
$('[data-mode="full"]').click();

/* editor keys */
type("def f():");
input.selectionStart = input.selectionEnd = input.value.length;
key("Enter");
ok("Enter auto-indents after a colon", /\n {4}$/.test(input.value), JSON.stringify(input.value));

type("x");
input.selectionStart = input.selectionEnd = 1;
key("Tab");
eq("Tab inserts four spaces", input.value, "x    ");

type("def two");
input.selectionStart = input.selectionEnd = input.value.length;
key(" ", { code: "Space", ctrlKey: true });
eq("Ctrl+Space completes the line", input.value, lines[0]);

/* checking */
type(K.solution);
$('[data-act="dj-check"]').click();
ok("exact match accepted", $(".dj-verdict").className.indexOf("is-ok") >= 0, $(".dj-verdict").textContent);
eq("recorded as solved", TD.kataScore.status("two-sum"), "solved");
ok("streak touched", TD.progress.streak.n >= 1);

type(K.solution.split("\n").map((l) => "  " + l).join("\n"));
$('[data-act="dj-check"]').click();
ok("indentation difference called out", $(".dj-verdict").className.indexOf("is-near") >= 0,
  $(".dj-verdict").textContent);

type("def two_sum(nums, target):\n    return []");
$('[data-act="dj-check"]').click();
ok("real difference reported", $(".dj-verdict").className.indexOf("is-off") >= 0);
ok("difference names the line", /line 2/.test($(".dj-verdict").textContent), $(".dj-verdict").textContent);

/* coach */
eq("hints start hidden", $$(".dj-hint").length, 0);
$('[data-act="dj-hint"]').click();
eq("one hint revealed", $$(".dj-hint").length, 1);
ok("approach starts locked", $('[data-act="dj-approach"]') !== null);
$('[data-act="dj-approach"]').click();
ok("approach reveals", $(".dj-approach").textContent.length > 60);
$('[data-act="dj-sol"]').click();
ok("reference reveals", $(".dj-ref") !== null);
ok("reference is highlighted", $$(".dj-ref .tok-kw").length > 0);
$('[data-act="dj-flag"]').click();
ok("flagging persists", TD.kataScore.get("two-sum").flag === true);

$(".dj-notes").value = "check before insert";
$(".dj-notes").dispatchEvent(new window.Event("input", { bubbles: true }));

/* persistence through the app's own store */
const saved = JSON.parse(window.localStorage.getItem("termdex:dojo"));
eq("solved state saved", saved["two-sum"].status, "solved");
eq("notes saved", saved["two-sum"].notes, "check before insert");
eq("flag saved", saved["two-sum"].flag, true);

/* the index reflects it */
go("#/code");
ok("solved dot shows on the index",
  $('[data-kata="two-sum"] .dj-dot').className.indexOf("is-solved") >= 0);
$('[data-status="flagged"]').click();
eq("flagged filter finds it", $$("#djList .dj-row").length, 1);
$('[data-status="flagged"]').click();

/* problems that carry a node class show it */
go("#/code/reverse-linked-list");
ok("given code shown", $(".dj-given") !== null &&
  $(".dj-given").textContent.indexOf("class ListNode") >= 0);

/* every problem mounts and traces cleanly */
const broken = [];
TD.katas.forEach((P) => {
  const before = errors.length;
  go("#/code/" + P.id);
  const inp = $(".dj-input");
  if (!inp) { broken.push(P.id + " (no editor)"); return; }
  inp.value = P.solution;
  inp.selectionStart = inp.selectionEnd = inp.value.length;
  inp.dispatchEvent(new window.Event("input", { bubbles: true }));
  const drawn = $$(".dj-ln").length;
  const want = P.solution.split("\n").length;
  if (drawn !== want || $$(".dj-bad").length || errors.length !== before) {
    broken.push(P.id + " (lines " + drawn + "/" + want + ", bad " + $$(".dj-bad").length + ")");
  }
});
ok("all 117 problems mount and trace cleanly", broken.length === 0, broken.slice(0, 5).join("; "));

/* leaving the section must release the clock and the document keys */
go("#/");
ok("dojo cleaned up on leave", TD.dojoCleanup === null || TD.dojoCleanup === undefined);

/* the rest of the app still works */
go("#/quiz");
ok("question bank still renders", $(".qh h1") !== null && /Question bank/.test($(".qh h1").textContent));
go("#/learn");
ok("learn section still renders", $(".view").innerHTML.length > 500);
go("#/");
ok("home still renders", $(".view").innerHTML.length > 500);
ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("Code Dojo is wired into CoreDumps correctly.\n");
process.exit(0);
