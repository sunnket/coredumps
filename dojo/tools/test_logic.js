/* Integration test: the Loops & Logics section (the Logic Vault).

   Boots the real CoreDumps app in jsdom in the order index.html declares,
   then drives #/logic and every shelf the way a reader would: filtering,
   revealing a recall line, marking a card, and navigating a deck anchor.

   The content checks matter as much as the UI ones. A card whose `recall`
   line is missing, or whose `trap` is absent, is a card that fails at its
   only job — so those are assertions, not conventions. */

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

console.log("\nCoreDumps — Loops & Logics\n");

/* ---- boot ---- */

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));
ok("TD namespace present", !!TD);
ok("registry API is defined", typeof TD.defineLogicShelves === "function" &&
  typeof TD.addLogicDeck === "function");

/* ---- the section is registered in the shell ---- */

const navLink = $('.side-link[data-nav="logic"]');
ok("sidebar has a Loops & Logics entry", !!navLink);
ok("sidebar entry points at #/logic", navLink && navLink.getAttribute("href") === "#/logic");

/* ---- the bank loaded ---- */

ok("shelves registered", TD.logicShelves.length >= 8, String(TD.logicShelves.length));
ok("decks registered", TD.logicDecks.length >= 12, String(TD.logicDecks.length));
ok("cards registered", TD.logicCards.length >= 80, String(TD.logicCards.length));

/* the AI engineer shelf is the point of the section, so it gets its own bar */
const ai = TD.logicShelfById["aieng"];
ok("the AI engineer shelf exists", !!ai);
ok("AI shelf is the largest", ai && TD.logicShelves.every((S) => S.cards <= ai.cards),
  ai && "aieng has " + ai.cards);
ok("AI shelf has several decks", ai && ai.decks.length >= 4, ai && String(ai.decks.length));

/* the AI shelf must cover the topics the role is actually examined on */
const aiText = TD.logicCards
  .filter((C) => C.shelf === "aieng")
  .map((C) => (C.t + " " + C.recall + " " + C.why + " " + C.trap).toLowerCase())
  .join(" | ");
["token", "context window", "rag", "embedding", "chunk", "hallucination",
 "eval", "agent", "prompt injection", "cost", "structured output", "rerank"]
  .forEach((topic) => {
    ok("AI shelf covers: " + topic, aiText.indexOf(topic) !== -1);
  });

/* ---- every card is complete ---- */

const ids = Object.create(null);
TD.logicCards.forEach((C) => {
  const tag = '"' + C.t + '"';
  ok(tag + " has a unique id", !ids[C.id], C.id);
  ids[C.id] = 1;
  ok(tag + " has a recall line", !!C.recall && C.recall.length > 15);
  ok(tag + " has a why", !!C.why && C.why.length > 60);
  ok(tag + " has at least one use", (C.use || []).length >= 1);
  ok(tag + " has a trap", !!C.trap && C.trap.length > 40);
  ok(tag + " belongs to a real shelf", !!TD.logicShelfById[C.shelf], C.shelf);
  ok(tag + " belongs to a real deck", !!TD.logicDeckById[C.deck], C.deck);
  /* the recall line is what gets memorised, so it must be one sentence-ish,
     not a paragraph that nobody will hold in their head */
  ok(tag + " recall line is short enough to memorise", C.recall.length <= 200,
    C.recall.length + " chars");
});

/* every shelf must actually have content behind it */
TD.logicShelves.forEach((S) => {
  ok('shelf "' + S.name + '" has decks', S.decks.length >= 1);
  ok('shelf "' + S.name + '" has cards', S.cards >= 4, String(S.cards));
  ok('shelf "' + S.name + '" has a description', !!S.desc && S.desc.length > 40);
});

/* code snippets, where present, must be well formed */
TD.logicCards.forEach((C) => {
  if (!C.code) return;
  ok('"' + C.t + '" code has a language', !!C.code.lang);
  ok('"' + C.t + '" code has content', !!C.code.c && C.code.c.length > 5);
});

/* ---- the index view ---- */

go("#/logic");
let view = $("#view");
ok("index renders", view.textContent.length > 1500, view.textContent.length + " chars");
eq("index shows one tile per shelf", $$(".lv-shelf").length, TD.logicShelves.length);
ok("index links to the AI shelf", !!$('a[href="#/logic/aieng"]'));
ok("index explains how to use the section", view.textContent.indexOf("How to use") !== -1);
ok("sidebar entry is marked active", navLink.classList.contains("is-active"));
ok("document title set", document.title.indexOf("Loops") !== -1, document.title);

/* ---- a shelf view ---- */

go("#/logic/aieng");
view = $("#view");
const cardEls = $$(".lv-card");
eq("shelf renders every card in the shelf", cardEls.length, ai.cards);
eq("shelf renders every deck", $$(".lv-deck").length, ai.decks.length);
ok("shelf has a breadcrumb back to the index", !!$('.crumbs a[href="#/logic"]'));
ok("shelf has filter buttons", $$("[data-lv-filter]").length >= 4);
ok("shelf has a search box", !!$("#lvSearch"));
ok("deck anchors exist for the jump nav", !!document.getElementById("deck-" + ai.decks[0].id));

/* the recall line must start hidden — that is the whole design */
const firstCard = cardEls[0];
const recall = firstCard.querySelector(".lv-recall");
ok("a recall line starts hidden", recall && !recall.classList.contains("is-open"));
ok("a hidden card offers a reveal button", !!firstCard.querySelector("[data-reveal]"));

/* ...and reveal on click */
click(firstCard.querySelector("[data-reveal]"));
ok("clicking reveal opens that line",
  firstCard.querySelector(".lv-recall").classList.contains("is-open"));

/* ---- marking a card ---- */

const cardId = firstCard.getAttribute("data-card");
click(firstCard.querySelector('[data-mark="known"]'));
eq("marking solid records it", TD.logicScore.get(cardId), "known");
ok("marking solid styles the card",
  $('.lv-card[data-card="' + cardId + '"]').classList.contains("is-known"));

click($('.lv-card[data-card="' + cardId + '"] [data-mark="known"]'));
eq("clicking the same mark clears it", TD.logicScore.get(cardId), "");

click($('.lv-card[data-card="' + cardId + '"] [data-mark="shaky"]'));
eq("marking shaky records it", TD.logicScore.get(cardId), "shaky");

/* the mark must survive a re-render, which is what makes it progress */
go("#/logic");
go("#/logic/aieng");
eq("a mark survives navigation", TD.logicScore.get(cardId), "shaky");
ok("a marked card renders with its state",
  $('.lv-card[data-card="' + cardId + '"]').classList.contains("is-shaky"));

/* ---- filtering ---- */

const shakyBtn = $('[data-lv-filter="shaky"]');
click(shakyBtn);
eq("filtering to shaky shows only the shaky card", $$(".lv-card").length, 1);
ok("the shaky filter is marked active", $('[data-lv-filter="shaky"]').classList.contains("is-active"));

click($('[data-lv-filter="all"]'));
eq("clearing the filter restores every card", $$(".lv-card").length, ai.cards);

/* ---- reveal all ---- */

click($("#lvRevealAll"));
ok("reveal-all opens every recall line",
  $$(".lv-recall").length > 0 && $$(".lv-recall").every((r) => r.classList.contains("is-open")));
click($("#lvRevealAll"));
ok("toggling it back hides them again",
  $$(".lv-recall").every((r) => !r.classList.contains("is-open")));

/* ---- every shelf route renders ---- */

TD.logicShelves.forEach((S) => {
  go("#/logic/" + S.id);
  const n = $$(".lv-card").length;
  ok("route renders: #/logic/" + S.id, n > 0, n + " cards");
  ok("title set for " + S.id, document.title.indexOf(S.name) !== -1, document.title);
});

/* ---- an unknown shelf must not throw ---- */

go("#/logic/does-not-exist");
ok("an unknown shelf degrades gracefully", $("#view").textContent.indexOf("No such shelf") !== -1);

/* ---- no HTML corruption anywhere ---- */

TD.logicShelves.forEach((S) => {
  go("#/logic/" + S.id);
  const h = $("#view").innerHTML;
  ok("no undefined leaks into " + S.id, h.indexOf("undefined") === -1);
  ok("no [object Object] leaks into " + S.id, h.indexOf("[object Object]") === -1);
});

ok("no jsdom errors after driving the whole section", errors.length === 0,
  errors.slice(0, 2).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("Loops & Logics is wired into CoreDumps correctly.\n");

/* Exit explicitly: the booted app keeps timers alive inside jsdom, so the
   process would linger long after the final check. */
process.exit(0);
