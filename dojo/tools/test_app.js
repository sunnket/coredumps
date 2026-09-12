/* Headless smoke + behaviour tests for the Blueprint Dojo UI.
   Boots index.html in jsdom, then drives the editor the way a user would. */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8")
  // jsdom cannot fetch the font stylesheet; strip the network links
  .replace(/<link rel="(preconnect|stylesheet)"[^>]*https:\/\/fonts[^>]*>/g, "");

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
  ok(label, actual === expected, "got " + JSON.stringify(actual) + ", want " + JSON.stringify(expected));
}

const vc = new VirtualConsole();
const consoleErrors = [];
vc.on("jsdomError", (e) => consoleErrors.push(e.message));
vc.on("error", (...a) => consoleErrors.push(a.join(" ")));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "http://localhost/",
  pretendToBeVisual: true,
  virtualConsole: vc,
  resources: undefined
});

const { window } = dom;
const { document } = window;

// Load the two scripts by hand (jsdom will not fetch relative <script src> without a resource loader)
function runScript(file) {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  const el = document.createElement("script");
  el.textContent = code;
  document.body.appendChild(el);
}

runScript("problems.js");
runScript("app.js");

// jsdom has not fired DOMContentLoaded yet at this point, so app.js is still
// waiting on it. Fire it by hand so boot() runs before the assertions.
if (document.readyState === "loading") {
  document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
}

const $ = (id) => document.getElementById(id);
const input = $("input");
const layer = $("layer");

function type(text) {
  input.value = text;
  input.selectionStart = input.selectionEnd = text.length;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}

function key(k, opts) {
  const init = Object.assign({ key: k, code: k, bubbles: true, cancelable: true }, opts || {});
  input.dispatchEvent(new window.KeyboardEvent("keydown", init));
}

/* ------------------------------------------------------------------ boot */

console.log("\nBlueprint Dojo - UI tests\n");

ok("no script errors during boot", consoleErrors.length === 0, consoleErrors.join(" | "));
ok("problem bank loaded", window.PROBLEMS.length === 117, "n=" + (window.PROBLEMS || []).length);
ok("library rendered", $("libList").querySelectorAll(".item").length === 117,
  "items=" + $("libList").querySelectorAll(".item").length);
ok("pattern groups rendered", $("libList").querySelectorAll(".group-head").length === 18,
  "groups=" + $("libList").querySelectorAll(".group-head").length);
eq("first problem loaded", $("pTitle").textContent, "Reverse an Array");
ok("examples rendered", $("pExamples").querySelectorAll(".example").length === 2);
ok("constraints rendered", $("pConstraints").querySelectorAll("li").length === 3);
ok("tests rendered", $("pTests").querySelectorAll(".test").length === 3);
ok("company chips rendered", $("pMeta").querySelectorAll(".co").length === 4);
eq("complexity shown", $("pTime").textContent, "O(n)");

/* --------------------------------------------------- blueprint rendering */

const p0 = window.PROBLEMS[0];
const solLines = p0.solution.split("\n");

ok("ghost lines rendered before typing", layer.querySelectorAll(".gh").length === solLines.length,
  "gh=" + layer.querySelectorAll(".gh").length + " lines=" + solLines.length);
eq("line count matches solution", layer.querySelectorAll(".ln").length, solLines.length);
eq("gutter matches", $("gutter").querySelectorAll("div").length, solLines.length);
ok("ghost text is the solution", layer.textContent.replace(/\n/g, "") === p0.solution.replace(/\n/g, ""),
  JSON.stringify(layer.textContent.slice(0, 60)));

// type the first line correctly
type(solLines[0]);
ok("correct prefix is not marked wrong", layer.querySelectorAll(".bad-char").length === 0);
ok("first gutter line marked done", $("gutter").firstChild.className === "done here",
  $("gutter").firstChild.className);
ok("match percentage moved off zero", $("rAccuracy").textContent !== "0%", $("rAccuracy").textContent);

// type a wrong character
type(solLines[0] + "\nXYZ");
ok("wrong characters are flagged", layer.querySelectorAll(".bad-char").length === 1);
eq("wrong text is the typo", layer.querySelector(".bad-char").textContent, "XYZ");
ok("readout marks an error", $("rAccuracy").parentNode.className.indexOf("is-bad") !== -1,
  $("rAccuracy").parentNode.className);

// full correct solution
type(p0.solution);
eq("full solution shows no errors", layer.querySelectorAll(".bad-char").length, 0);
eq("no ghost left when complete", layer.querySelectorAll(".gh").length, 0);
eq("match reads 100%", $("rAccuracy").textContent, "100%");
eq("progress track full", $("rTrack").style.width, "100%");

/* --------------------------------------------------------- assist levels */

$("assistSeg").querySelector('[data-assist="outline"]').click();
ok("outline mode is pressed",
  $("assistSeg").querySelector('[data-assist="outline"]').getAttribute("aria-pressed") === "true");
type("");
const outlineText = layer.textContent;
ok("outline hides the body", outlineText.indexOf("nums[left], nums[right]") === -1, outlineText.slice(0, 80));
ok("outline keeps the opening word", outlineText.indexOf("def") === 0, outlineText.slice(0, 20));
ok("outline marks elided content", outlineText.indexOf("…") !== -1);

$("assistSeg").querySelector('[data-assist="off"]').click();
type("");
eq("blank mode shows nothing", layer.textContent.trim(), "");
eq("blank mode hides the match readout", $("rAccuracy").textContent, "—");

type("def reverse_array(nums):");
eq("blank mode does not paint errors", layer.querySelectorAll(".bad-char").length, 0);
ok("blank mode still highlights syntax", layer.querySelectorAll(".kw").length > 0);

$("assistSeg").querySelector('[data-assist="full"]').click();

/* -------------------------------------------------------- editor keys */

type("def f():");
input.selectionStart = input.selectionEnd = input.value.length;
key("Enter");
ok("Enter auto-indents after a colon", /\n {4}$/.test(input.value), JSON.stringify(input.value));

type("x");
input.selectionStart = input.selectionEnd = 1;
key("Tab");
eq("Tab inserts four spaces", input.value, "x    ");

input.value = "        y";
input.selectionStart = input.selectionEnd = 9;
key("Tab", { shiftKey: true });
eq("Shift+Tab outdents four", input.value, "    y");

// Ctrl+Space completes the current line from the blueprint
type("def rev");
input.selectionStart = input.selectionEnd = input.value.length;
key(" ", { code: "Space", ctrlKey: true });
eq("Ctrl+Space completes the line", input.value, solLines[0]);

/* ------------------------------------------------------------- checking */

type(p0.solution);
$("btnCheck").click();
ok("exact match is accepted", $("verdict").className.indexOf("ok") !== -1, $("verdict").textContent);
ok("solving updates the stats", $("sSolved").textContent === "1/117", $("sSolved").textContent);
ok("library dot turns solved", $("libList").querySelector('[data-id="reverse-array"] .dot').className.indexOf("is-solved") !== -1);

type(p0.solution.split("\n").map((l) => "  " + l).join("\n"));
$("btnCheck").click();
ok("indentation-only difference is called out", $("verdict").className.indexOf("near") !== -1,
  $("verdict").textContent);

type("def reverse_array(nums):\n    return nums[::-1]");
$("btnCheck").click();
ok("a real difference is reported", $("verdict").className.indexOf("off") !== -1, $("verdict").textContent);
ok("difference names the line", /line 2/.test($("verdict").textContent), $("verdict").textContent);

type("");
$("btnCheck").click();
ok("empty sheet is handled", /Nothing written/.test($("verdict").textContent), $("verdict").textContent);

/* -------------------------------------------------------------- library */

$("search").value = "linked list";
$("search").dispatchEvent(new window.Event("input", { bubbles: true }));
const listed = $("libList").querySelectorAll(".item").length;
ok("search filters the list", listed > 0 && listed < 117, "listed=" + listed);

$("search").value = "";
$("search").dispatchEvent(new window.Event("input", { bubbles: true }));

document.querySelector('[data-diff="Hard"]').click();
eq("difficulty filter works", $("libList").querySelectorAll(".item").length, 13);
document.querySelector('[data-diff="Hard"]').click();

document.querySelector('[data-status="todo"]').click();
eq("unsolved filter excludes the solved one", $("libList").querySelectorAll(".item").length, 116);
document.querySelector('[data-status="todo"]').click();

$("companyFilter").value = "Google";
$("companyFilter").dispatchEvent(new window.Event("change", { bubbles: true }));
const googleCount = window.PROBLEMS.filter((p) => p.companies.indexOf("Google") !== -1).length;
eq("company filter works", $("libList").querySelectorAll(".item").length, googleCount);
$("companyFilter").value = "";
$("companyFilter").dispatchEvent(new window.Event("change", { bubbles: true }));

$("sortBy").value = "freq";
$("sortBy").dispatchEvent(new window.Event("change", { bubbles: true }));
ok("sorting by frequency reorders", $("libList").querySelectorAll(".group-head").length === 0);
$("sortBy").value = "curriculum";
$("sortBy").dispatchEvent(new window.Event("change", { bubbles: true }));

/* ------------------------------------------------- navigation & problems */

const ids = window.PROBLEMS.map((p) => p.id);
let renderFailures = [];
ids.forEach((id) => {
  const before = consoleErrors.length;
  $("libList").querySelector('[data-id="' + id + '"]').click();
  type(window.PROBLEMS.find((p) => p.id === id).solution);
  const lines = layer.querySelectorAll(".ln").length;
  const expected = window.PROBLEMS.find((p) => p.id === id).solution.split("\n").length;
  if (lines !== expected || layer.querySelectorAll(".bad-char").length !== 0 || consoleErrors.length !== before) {
    renderFailures.push(id + " (lines " + lines + "/" + expected +
      ", bad " + layer.querySelectorAll(".bad-char").length + ")");
  }
});
ok("every problem renders and traces cleanly", renderFailures.length === 0,
  renderFailures.slice(0, 6).join("; "));

/* ------------------------------------------------------- hints & panels */

$("libList").querySelector('[data-id="two-sum"]').click();
eq("hints start hidden", $("pHints").querySelectorAll(".hint").length, 0);
$("btnHint").click();
eq("one hint revealed", $("pHints").querySelectorAll(".hint").length, 1);
$("btnHint").click();
$("btnHint").click();
$("btnHint").click();
eq("hints stop at the last one", $("pHints").querySelectorAll(".hint").length, 3);

ok("approach starts locked", !!document.getElementById("revealApproach"));
document.getElementById("revealApproach").click();
ok("approach reveals", $("approachSlot").textContent.length > 60);

$("btnSolution").click();
ok("solution reveals", $("solutionSlot").querySelector(".solution-view") !== null);
$("btnSolution").click();
ok("solution hides again", $("solutionSlot").querySelector(".solution-view") === null);

$("btnFlag").click();
ok("flagging works", $("btnFlag").textContent.indexOf("★") === 0, $("btnFlag").textContent);

$("notes").value = "watch the complement check order";
$("notes").dispatchEvent(new window.Event("input", { bubbles: true }));

/* ------------------------------------------------------------ persistence */

const stored = JSON.parse(window.localStorage.getItem("blueprint-dojo/v1"));
eq("solved status persisted", stored.progress["reverse-array"].status, "solved");
eq("notes persisted", stored.progress["two-sum"].notes, "watch the complement check order");
eq("flag persisted", stored.progress["two-sum"].flag, true);
eq("hint count persisted", stored.progress["two-sum"].hints, 3);
ok("streak recorded", stored.meta.streak >= 1);

/* ------------------------------------------------------- context problems */

$("libList").querySelector('[data-id="reverse-linked-list"]').click();
ok("linked-list context is shown", $("pContext").textContent.indexOf("class ListNode") !== -1,
  $("pContext").textContent.slice(0, 40));
$("libList").querySelector('[data-id="min-stack"]').click();
ok("test scaffold shown when present", $("pTests").textContent.indexOf("def _run()") !== -1);

$("libList").querySelector('[data-id="two-sum"]').click();
ok("problem without context hides the block", $("pContext").textContent === "");

/* ---------------------------------------------------------------- theme */

$("btnTheme").click();
eq("theme toggles to light", document.documentElement.getAttribute("data-theme"), "light");
$("btnTheme").click();
eq("theme toggles to dark", document.documentElement.getAttribute("data-theme"), "dark");
$("btnTheme").click();
ok("theme returns to auto", document.documentElement.getAttribute("data-theme") === null);

/* --------------------------------------------------------------- report */

ok("no errors accumulated overall", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("All UI checks passed.\n");

process.exit(0);
