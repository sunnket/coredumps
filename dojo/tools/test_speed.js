/* Integration test: Speed Coding, and the timing layer underneath it.

   Two halves. First the engine: boots the real app and drives the drill the
   way a reader does — typing into the real textarea, pressing Enter, clearing
   the copy reps and then recall — asserting that a clean run from memory is
   timed, scored in characters per minute, and kept as a personal best.

   Then the section: #/speed and its ladder of warm-up sets, every set route,
   and the personalised slow deck.

   Timing is faked by moving a clock the engine reads, not by sleeping: the
   test must be deterministic and fast, and Date.now is the only thing that
   needs to lie. */

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

/* A controllable clock. The engine calls Date.now() for both the drill
   timer and the Leitner schedule, so advancing it here is the only way to
   simulate a reader who took two seconds to type a line. */
let clock = 1700000000000;
const realNow = window.Date.now;
window.Date.now = function () { return clock; };
function advance(ms) { clock += ms; }

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

console.log("\nCoreDumps — drill speed layer\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- the pure helper ---- */

eq("cpm: 20 chars in 6s is 200", TD.drillCpm(20, 6000), 200);
eq("cpm: 40 chars in 60s is 40", TD.drillCpm(40, 60000), 40);
eq("cpm: a paste is rejected", TD.drillCpm(20, 40), 0);
eq("cpm: no timing yields nothing", TD.drillCpm(20, 0), 0);

/* ---- a fresh reader has no speed history ---- */

const fresh = TD.speedStats();
eq("a fresh deck has nothing timed", fresh.timed, 0);
eq("a fresh deck has no median", fresh.median, 0);
eq("a fresh deck offers no slow cards", TD.slowCards().length, 0);

/* ---- drive the real engine ---- */

const mount = document.createElement("div");
document.body.appendChild(mount);

/* one short single-line card, so the test types a known number of chars */
const CARD = { id: "speed-test#0", c: "x = 1", w: "assign one to x", lang: "python" };

function type(input, text) {
  input.value = text;
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
}

function submit(input) {
  input.dispatchEvent(new window.KeyboardEvent("keydown", {
    key: "Enter", bubbles: true, cancelable: true
  }));
}

/* reps:1 keeps the copy phase to a single clean pass */
TD.mountDrill(mount, [CARD], { reps: 1, mode: "lesson", t: "T", sub: "S" });

const input = mount.querySelector("#drInput");
ok("the drill mounted", !!input);
ok("a speed slot exists in the footer", !!mount.querySelector("#drSpeed"));
ok("the speed slot starts empty", !mount.querySelector("#drSpeed").classList.contains("is-on"));

/* copy phase: type it once cleanly */
type(input, "x = 1");
advance(3000);
submit(input);

/* the engine moves to recall after a short timeout, so run the timers */
return void setTimeout(function () {
  const phase = mount.querySelector("#drStage").getAttribute("data-phase");
  eq("one clean copy moves to the recall phase", phase, "recall");

  /* recall: five characters typed over exactly two seconds -> 150 cpm */
  const input2 = mount.querySelector("#drInput");
  type(input2, "x");            /* first keystroke starts the clock */
  advance(2000);
  type(input2, "x = 1");
  submit(input2);

  const rec = TD.drillRecord(CARD.id);
  ok("a clean recall is recorded", !!rec, "no record written");
  eq("the run is timed at 150 cpm", rec && rec.best, 150);
  eq("the first timed run is a personal best", rec && rec.pb, true);
  eq("the run counter starts at one", rec && rec.runs, 1);
  eq("last equals best on a first run", rec && rec.last, 150);

  /* the reader is told their speed */
  const said = mount.querySelector("#drMsg").textContent;
  ok("the message reports the rate", said.indexOf("150 cpm") !== -1, said);
  ok("a first-ever rate is called a personal best",
    said.toLowerCase().indexOf("fastest") !== -1, said);
  ok("the speed slot is now showing", mount.querySelector("#drSpeed").classList.contains("is-on"));

  /* ---- speed now aggregates ---- */

  const after = TD.speedStats();
  eq("one card is now timed", after.timed, 1);
  eq("the median is that card", after.median, 150);
  eq("the best is that card", after.best, 150);

  /* ---- a slower second run must not overwrite the best ---- */

  /* The engine addresses its controls by document-wide id, so only one drill
     may be mounted at a time -- which is exactly what the app does. Reuse the
     same node rather than standing up a second one. */
  TD.mountDrill(mount, [CARD], { reps: 1, mode: "daily", start: "recall" });

  const in2 = mount.querySelector("#drInput");
  type(in2, "x");
  advance(6000);                 /* 5 chars in 6s -> 50 cpm, slower */
  type(in2, "x = 1");
  submit(in2);

  const rec2 = TD.drillRecord(CARD.id);
  eq("a slower run keeps the old best", rec2.best, 150);
  eq("a slower run updates last", rec2.last, 50);
  eq("a slower run is not a personal best", rec2.pb, false);
  eq("the run counter increments", rec2.runs, 2);

  const msg2 = mount.querySelector("#drMsg").textContent;
  ok("a slower run still reports its rate", msg2.indexOf("50 cpm") !== -1, msg2);
  ok("a slower run shows the best to beat", msg2.indexOf("best 150") !== -1, msg2);

  /* ---- a peeked or mistyped run must not be timed ---- */

  const CARD2 = { id: "speed-test#1", c: "y = 2", w: "assign two to y" };
  TD.mountDrill(mount, [CARD2], { reps: 1, mode: "daily", start: "recall" });

  const in3 = mount.querySelector("#drInput");
  mount.querySelector("#drPeek").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  type(in3, "y");
  advance(1000);
  type(in3, "y = 2");
  submit(in3);

  const rec3 = TD.drillRecord(CARD2.id);
  ok("a peeked card is still recorded", !!rec3);
  ok("a peeked card carries no speed", !rec3.best, "best=" + (rec3 && rec3.best));
  ok("a peeked card does not count as a run", !rec3.runs, "runs=" + (rec3 && rec3.runs));

  /* ---- the speed run surfaces slow cards ---- */

  /* CARD sits at 150 and is the only timed card, so nothing is below the
     median yet. Seed a genuinely slow, well-known card and check it appears. */
  const db = TD.store.get("learn:drill", {});
  const lesson = TD.lessons.filter(function (L) {
    return L.drill && L.drill.items && L.drill.items.length >= 6;
  })[0];
  ok("a lesson with enough drill cards exists to seed from", !!lesson);

  const seeded = TD.drillCards(lesson);

  /* Four genuinely slow, well-known cards and one very fast one. The median
     lands between them, so the four below it are the speed queue. */
  [30, 34, 38, 42].forEach(function (rate, n) {
    db[seeded[n].id] = {
      box: 4, ok: 5, miss: 0, seen: clock, due: clock,
      best: rate, last: rate, runs: 3
    };
  });
  db[seeded[4].id] = {
    box: 4, ok: 5, miss: 0, seen: clock, due: clock,
    best: 400, last: 400, runs: 3
  };
  TD.store.set("learn:drill", db);

  const stats = TD.speedStats();
  ok("the median sits among the seeded rates", stats.median > 30 && stats.median < 400,
    String(stats.median));
  eq("the best is the fastest seeded card", stats.best, 400);

  const slow = TD.slowCards();
  const slowIds = slow.map(function (c) { return c.id; });
  ok("slow cards are queued", slow.length >= 3, String(slow.length));
  ok("the slowest card is queued", slowIds.indexOf(seeded[0].id) !== -1);
  ok("the fast card is not queued", slowIds.indexOf(seeded[4].id) === -1);
  ok("slow cards come slowest-first", slow[0].best <= slow[slow.length - 1].best);
  eq("the slowest card is first", slow[0].best, 30);

  /* a card known only shakily (low box) is a recall problem, not a speed one */
  db[seeded[5].id] = { box: 1, ok: 1, miss: 3, seen: clock, due: clock, best: 20, last: 20, runs: 1 };
  TD.store.set("learn:drill", db);
  ok("a barely-known card is not a speed problem",
    TD.slowCards().map(function (c) { return c.id; }).indexOf(seeded[5].id) === -1);

  /* ---- the routes render ---- */

  function go(hash) {
    window.location.hash = hash;
    window.dispatchEvent(new window.Event("hashchange"));
  }

  go("#/drill");
  const drillView = document.querySelector("#view");
  ok("the daily drill still renders", drillView.textContent.length > 200);
  ok("the drill hero shows a typical speed",
    drillView.textContent.indexOf("cpm typical") !== -1);
  ok("the drill links across to the slow deck",
    !!document.querySelector('a[href="#/speed/slow"]'),
    "slow=" + TD.slowCards().length + " median=" + TD.speedStats().median);

  /* ---- Speed Coding is a section of its own ---- */

  const navLink = document.querySelector('.side-link[data-nav="speed"]');
  ok("the sidebar has a Speed Coding entry", !!navLink);
  eq("it points at the section root", navLink && navLink.getAttribute("href"), "#/speed");

  ok("warm-up sets are registered", TD.speedSets.length >= 5, String(TD.speedSets.length));
  ok("the ladder has three rungs", TD.speedRungs().length === 3,
    String(TD.speedRungs().length));
  TD.speedRungs().forEach(function (r) {
    ok("rung " + r.n + " has sets", r.sets.length >= 1);
    ok("rung " + r.n + " is named", !!r.name && !!r.blurb);
  });

  TD.speedSets.forEach(function (S) {
    ok('set "' + S.name + '" has cards', S.cards.length >= 5, String(S.cards.length));
    ok('set "' + S.name + '" explains itself', !!S.why && S.why.length > 40);
    ok('set "' + S.name + '" declares a rung', S.rung >= 1 && S.rung <= 3);
    S.cards.forEach(function (c) {
      ok('a card in "' + S.name + '" has code', !!c.c);
      ok('a card in "' + S.name + '" has an intent', !!c.w);
      ok('a card in "' + S.name + '" has a unique id', c.id.indexOf("speed/" + S.id) === 0);
    });
  });

  go("#/speed");
  const ladder = document.querySelector("#view");
  ok("the ladder renders", ladder.textContent.length > 800);
  eq("the section sets its title", document.title, "Speed Coding — CoreDumps");
  eq("every set has a tile", ladder.querySelectorAll(".sp-set").length, TD.speedSets.length);
  ok("the sidebar entry is active", navLink.classList.contains("is-active"));
  ok("the ladder explains the rules", ladder.textContent.indexOf("clock starts") !== -1);
  ok("the slow deck is offered once it has cards",
    !!document.querySelector('a[href="#/speed/slow"]'));

  /* every set must actually mount the engine */
  TD.speedSets.forEach(function (S) {
    go("#/speed/" + S.id);
    ok("set route mounts the drill: " + S.id, !!document.querySelector("#drInput"));
    ok("set route names the set: " + S.id,
      document.querySelector("#view").textContent.indexOf(S.name) !== -1);
  });

  go("#/speed/slow");
  const slowView = document.querySelector("#view");
  ok("the slow deck renders", slowView.textContent.length > 200);
  eq("the slow deck sets its title", document.title, "Your slow lines — CoreDumps");
  ok("the slow deck mounts the engine", !!document.querySelector("#drInput"));

  go("#/speed/no-such-set");
  ok("an unknown set degrades gracefully",
    document.querySelector("#view").textContent.indexOf("No such set") !== -1);

  /* ---- the teaching beat ----
     Every speed card carries a note explaining the line, shown only once the
     card is cleared. It replaces the auto-advance, so it must also be the
     thing that moves the reader on. */

  let noteless = 0;
  TD.speedSets.forEach(function (S) {
    S.cards.forEach(function (c) { if (!c.why) noteless++; });
  });
  eq("every speed card teaches something", noteless, 0);

  TD.speedSets.forEach(function (S) {
    S.cards.forEach(function (c) {
      ok('a note reads as a real sentence in set ' + S.id,
        c.why.length > 45 && /[.!?]$/.test(c.why.trim()), c.why.slice(0, 40));
    });
  });

  /* drive it: a card with a note must hold the screen and offer a control */
  const teach = [
    { id: "teach#0", c: "x = 1", w: "assign one", why: "A note worth reading, ending properly." },
    { id: "teach#1", c: "y = 2", w: "assign two" }
  ];
  TD.mountDrill(mount, teach, { reps: 1 });

  const t1 = mount.querySelector("#drInput");
  type(t1, "x = 1");
  submit(t1);

  setTimeout(function () {
    const t2 = mount.querySelector("#drInput");
    type(t2, "x");
    advance(2000);
    type(t2, "x = 1");
    submit(t2);

    const note = mount.querySelector("#drWhy");
    ok("a cleared card reveals its note", note && !note.hidden);
    ok("the note carries the text", note.textContent.indexOf("worth reading") !== -1);
    ok("the note offers a way onward", !!note.querySelector("#drNext"));
    ok("the card does not auto-advance past the note",
      mount.querySelector("#drIntent").textContent.indexOf("assign one") !== -1);

    note.querySelector("#drNext").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    ok("clicking onward advances the card",
      mount.querySelector("#drIntent").textContent.indexOf("assign two") !== -1);
    ok("the note is hidden on the next card", mount.querySelector("#drWhy").hidden);

    /* a card with no note keeps the original timed auto-advance */
    const t3 = mount.querySelector("#drInput");
    type(t3, "y");
    advance(2000);
    type(t3, "y = 2");
    submit(t3);
    ok("a card with no note shows none", mount.querySelector("#drWhy").hidden);

    finishUp();
  }, 700);

  /* ---- nothing broke ---- */
  function finishUp() {

    ok("no jsdom errors after driving the speed layer", errors.length === 0,
      errors.slice(0, 2).join(" | "));

    window.Date.now = realNow;

    console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
    if (failures) {
      console.log(failures + " FAILED\n");
      process.exit(1);
    }
    console.log("Speed Coding is wired in, and the drill measures fluency.\n");
    process.exit(0);
  }
}, 700);
