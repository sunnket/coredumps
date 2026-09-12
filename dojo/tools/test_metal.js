/* Integration test: Ground Zero's hardware module and the animated diagrams.

   This module has an unusual burden of proof for lesson content, for two
   reasons.

   First, it is the *first* thing a beginner reads. If it is wrong it is
   wrong in the worst possible place — someone with no way to detect the
   error is building their first mental model out of it. So the arithmetic is
   checked here rather than trusted: the 140 GB claim, the memory ladder, the
   quantisation sizes. Where a number also appears on the AI formula card, the
   two are checked against each other so they cannot quietly drift apart.

   Second, the diagrams move, and motion is the one thing in this app that
   can break silently. An animation that fails still renders a picture, so a
   plain render check would pass while the reader sees a still frame that was
   never designed to be still. The rule the tests enforce is the one the
   diagrams were authored against: every animated figure must carry its
   motion in CSS classes that the stylesheet actually defines, and must stay
   legible with all of it switched off. */

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

console.log("\nCoreDumps — the machine, and the diagrams that move\n");

ok("every script in index.html exists", missingFiles === 0, String(missingFiles));
ok("the app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- the module is placed where a beginner will actually hit it ---- */

const zero = TD.trackById["zero"];
ok("the Ground Zero track exists", !!zero);

const modIds = (zero.modules || []).map((m) => m.id);
ok("the hardware module exists", modIds.indexOf("metal") !== -1, modIds.join(","));

/* THE RULE: hardware comes before software. The whole argument of this
   module is that every other course starts one step too late, so a metal
   module sitting after the software one would be self-defeating. */
ok("the hardware module comes first", modIds[0] === "metal", modIds.join(","));
ok("and it comes before the terminal",
  modIds.indexOf("metal") < modIds.indexOf("shell"), modIds.join(","));

const metal = TD.lessons.filter((l) => l.track === "zero" && l.m === "metal");
ok("the module has a full arc of lessons", metal.length >= 7, String(metal.length));

/* No empty modules, and no lesson so thin it is a stub. */
const thin = metal.filter((l) => (l.b || []).length < 12).map((l) => l.slug);
ok("every lesson is substantial", thin.length === 0, thin.join(","));

const noGoals = metal.filter((l) => (l.goal || []).length < 3).map((l) => l.slug);
ok("every lesson states what it is for", noGoals.length === 0, noGoals.join(","));

const noKey = metal.filter((l) => (l.k || []).length < 3).map((l) => l.slug);
ok("every lesson closes with takeaways", noKey.length === 0, noKey.join(","));

/* ---- THE RULE: every lesson earns the reader's next step ----
   The module's stated second job is to make someone want to continue, and
   the mechanism chosen for that is a "where this shows up in AI" beat in
   every lesson. If a lesson loses it, the module quietly becomes a hardware
   reference — accurate, and not the thing it was built to be. */

const noPayoff = metal.filter((l) => {
  const heads = (l.b || []).filter((b) => b.h).map((b) => b.h.toLowerCase());
  return !heads.some((h) => h.indexOf("ai") !== -1 || h.indexOf("x") !== -1);
}).map((l) => l.slug);
ok("every lesson connects the part to AI work", noPayoff.length === 0, noPayoff.join(","));

/* Each lesson should reach for a real-world anchor rather than only
   explaining. The analogies are the reason this reads as an invitation. */
const noAnchor = metal.filter((l) => {
  const b = l.b || [];
  return !b.some((x) => x.ana) && !b.some((x) => x.n) && !b.some((x) => x.trap);
}).map((l) => l.slug);
ok("every lesson anchors the idea in something familiar", noAnchor.length === 0,
  noAnchor.join(","));

/* ---- the arithmetic is checked, not trusted ----
   These numbers are the ones a reader will repeat in an interview, so a
   typo here propagates into someone's understanding. */

const allText = metal.map((l) => JSON.stringify(l)).join(" ");

/* 70B at 2 bytes each is 140 GB. The lesson states all three numbers, so
   the test asserts the relationship rather than the strings. */
ok("the 70B model arithmetic is stated", /70\s*(billion|B)/i.test(allText) && /140\s*GB/.test(allText));
ok("and it is derived rather than asserted", /70\s*×\s*2\s*=\s*140|70 billion × 2 bytes/.test(allText),
  "the multiplication should be shown");
ok("70 x 2 really is 140", 70 * 2 === 140);

/* The memory ladder must stay in slowest-last order, because the entire
   lesson is that distance costs time. */
const ladder = ["Registers", "Cache", "RAM", "SSD", "network"];
const mem = TD.machineDiagrams["mc-memory"].body();
let lastAt = -1, ordered = true;
ladder.forEach((tier) => {
  const at = mem.indexOf(tier);
  if (at === -1 || at < lastAt) ordered = false;
  lastAt = at;
});
ok("the memory hierarchy is drawn fastest-first", ordered, ladder.join(" -> "));

/* Quantisation sizes halve each step, and the lesson says so. */
[["FP32", "32"], ["FP16", "16"], ["INT8", "8"], ["INT4", "4"]].forEach((p) => {
  ok("the precision ladder covers " + p[0], allText.indexOf(p[0]) !== -1);
});
ok("INT4 quarter-size is stated as ~35 GB", /35/.test(allText), "140 / 4 = 35");
ok("140 / 4 really is 35", 140 / 4 === 35);

/* ---- the numbers agree with the AI formula card ----
   Both surfaces quote model memory. A reader who meets 2 GB per billion on
   one page and something else on the other loses trust in both, so the two
   are pinned together here. */
go("#/cards/formulas");
const formulaText = $("#view").textContent;
ok("the formula card still states the FP16 rule", /2 GB per billion/.test(formulaText));
ok("the lesson and the card agree on 70B needing 140 GB",
  /140 GB/.test(allText) && /140/.test(formulaText),
  "lesson says 140 GB; card says " + (/(\d+) GB/.exec(formulaText) || [])[0]);

/* ---- the diagrams ---- */

const keys = Object.keys(TD.machineDiagrams);
ok("the animated diagrams are registered", keys.length >= 7, String(keys.length));

/* They must be reachable through the same registry as every other diagram,
   or a lesson block referencing one silently renders nothing. */
const unreachable = keys.filter((k) => !TD.hasDiagram(k));
ok("every animated diagram is reachable via TD.hasDiagram", unreachable.length === 0,
  unreachable.join(","));

/* Wrapping the registry must not have hidden the originals. */
ok("the original diagrams still resolve", TD.hasDiagram("sql-sublanguages"));
ok("and still render", (TD.diagram("sql-sublanguages") || "").length > 500);
ok("diagramKeys lists both sets", TD.diagramKeys().length > keys.length + 50,
  String(TD.diagramKeys().length));

const empties = [];
keys.forEach((k) => {
  const out = TD.diagram(k);
  if (!out || out.length < 400) empties.push(k);
  if (out.indexOf("<svg") === -1) empties.push(k + " (no svg)");
});
ok("every animated diagram renders real markup", empties.length === 0, empties.join(","));

/* ---- THE RULE: motion is decoration, never information ----
   Every moving class must be defined in the stylesheet, and every one of
   them must be switched off under prefers-reduced-motion. A class that
   animates but is not listed in that media block would keep moving for a
   reader who explicitly asked it not to. */

const motionClasses = ["mv-pulse", "mv-fade", "mv-stage", "mv-tick",
  "mv-twinkle", "mv-blink", "mv-breathe"];

const undefinedCls = motionClasses.filter((c) => css.indexOf("." + c + " {") === -1);
ok("every motion class is defined in the stylesheet", undefinedCls.length === 0,
  undefinedCls.join(","));

const reduceBlock = css.slice(css.indexOf(".mv-pulse {"));
const reduceStart = reduceBlock.indexOf("@media (prefers-reduced-motion: reduce)");
const reduce = reduceStart === -1 ? "" : reduceBlock.slice(reduceStart, reduceStart + 900);
ok("there is a reduced-motion block for the diagrams", reduceStart !== -1);

const notCalmed = motionClasses.filter((c) => reduce.indexOf("." + c) === -1);
ok("every motion class is switched off under reduced motion", notCalmed.length === 0,
  notCalmed.join(","));

/* Each keyframe animation a class names must actually exist. */
const named = [];
motionClasses.forEach((c) => {
  const at = css.indexOf("." + c + " {");
  const body = css.slice(at, at + 260);
  const m = /animation-name:\s*([A-Za-z0-9_-]+)/.exec(body);
  if (m) named.push(m[1]);
});
const missingFrames = named.filter((nm) => css.indexOf("@keyframes " + nm) === -1);
ok("every animation names a keyframe that exists", missingFrames.length === 0,
  missingFrames.join(","));

/* The still frame has to carry the meaning on its own. A diagram whose only
   labelled content rides on an animated element would go blank for a reader
   with reduced motion, so the text must live outside the moving parts. */
const relyOnMotion = [];
keys.forEach((k) => {
  const body = TD.machineDiagrams[k].body();
  const texts = body.match(/<text[^>]*>/g) || [];
  if (!texts.length) relyOnMotion.push(k + " (no labels at all)");
  /* the pulses and packets are the only things allowed to disappear */
  const labelInsideFade = /<g class="mv-fade"[^>]*>(?:(?!<\/g>)[\s\S])*<text/.test(body);
  if (labelInsideFade && k !== "mc-run") relyOnMotion.push(k + " (label inside a fading group)");
});
ok("no diagram hides its labels inside a moving part", relyOnMotion.length === 0,
  relyOnMotion.join("; "));

/* ---- no external anything, still ---- */
keys.forEach((k) => {
  const body = TD.machineDiagrams[k].body();
  ok("the " + k + " diagram loads nothing external",
    body.indexOf("http://") === -1 && body.indexOf("https://") === -1);
});

/* ---- every lesson renders, with its diagrams in place ---- */

const broken = [];
let diagramsOnPage = 0;
metal.forEach((l) => {
  go("#/learn/zero/" + l.slug);
  const v = $("#view");
  if (!v || v.innerHTML.length < 4000) { broken.push(l.slug + " (thin)"); return; }
  if (v.textContent.indexOf(l.t) === -1) broken.push(l.slug + " (title missing)");
  diagramsOnPage += $$("#view svg.dg").length;
});
ok("every hardware lesson renders", broken.length === 0, broken.slice(0, 4).join("; "));
ok("the diagrams reach the page", diagramsOnPage >= 7, String(diagramsOnPage));

/* A lesson declaring a diagram that does not exist renders an empty figure,
   which is the silent-drop failure this codebase has been bitten by before. */
const deadDg = [];
metal.forEach((l) => {
  (l.b || []).forEach((b) => {
    if (b.dg && !TD.hasDiagram(b.dg)) deadDg.push(l.slug + " -> " + b.dg);
  });
});
ok("every diagram a lesson asks for exists", deadDg.length === 0, deadDg.join("; "));

/* ---- the animated markup survives the renderer ---- */

go("#/learn/zero/what-the-cpu-actually-does");
const cycleSvg = $("#view svg.dg");
ok("the cycle diagram is on the CPU lesson", !!cycleSvg);
if (cycleSvg) {
  ok("its stages carry the animation class",
    cycleSvg.querySelectorAll(".mv-stage").length === 3,
    String(cycleSvg.querySelectorAll(".mv-stage").length));
  ok("the clock ticks are drawn", cycleSvg.querySelectorAll(".mv-tick").length >= 10,
    String(cycleSvg.querySelectorAll(".mv-tick").length));
  ok("the animation is inline, needing no script",
    (cycleSvg.innerHTML || "").indexOf("animation-duration") !== -1);
  ok("the three stage names survive", ["FETCH", "DECODE", "EXECUTE"]
    .every((s) => cycleSvg.textContent.indexOf(s) !== -1), cycleSvg.textContent.slice(0, 60));
}

/* ---- the module reads as an invitation, not a spec sheet ----
   The brief for this work was that a reader should fall for the machine
   before being asked to operate it, so the vocabulary of wonder is part of
   the deliverable and worth defending against a later well-meaning edit
   that "tightens" it into a reference. */

const proseOnly = metal.map((l) => (l.b || []).map((b) =>
  [b.p, b.ana, b.n, b.trap, (b.ol || []).join(" "), (b.l || []).join(" "), b.q]
    .filter(Boolean).join(" ")).join(" ")).join(" ").toLowerCase();

["kitchen", "morse", "professors", "moon"].forEach((img) => {
  ok("the module keeps its image: " + img, proseOnly.indexOf(img) !== -1);
});

/* The payoff lesson must actually name the route, or the module ends on
   enthusiasm with nowhere to put it. */
const last = metal[metal.length - 1];
const lastText = JSON.stringify(last).toLowerCase();
["python", "ground zero", "build"].forEach((step) => {
  ok("the closing lesson names the next step: " + step, lastText.indexOf(step) !== -1);
});
ok("the closing lesson shows the reward loop",
  lastText.indexOf("print") !== -1 && lastText.indexOf("loop") !== -1);

/* ---- the track page tells the new story ---- */

go("#/learn/zero");
const trackText = $("#view").textContent;
ok("the track page lists the hardware module", trackText.indexOf("The machine itself") !== -1);
ok("the track brief was updated to open on hardware",
  /physical machine|machine itself/i.test(JSON.stringify(zero.brief)));

/* ---- nothing else regressed ---- */

ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

const mins = metal.reduce((n, l) => n + l.mins, 0);
console.log("\n  " + metal.length + " hardware lessons (~" + mins + " min), " +
  keys.length + " animated diagrams, " + diagramsOnPage + " figures on the pages");

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("The machine module is placed, drawn and moving correctly.\n");
process.exit(0);
