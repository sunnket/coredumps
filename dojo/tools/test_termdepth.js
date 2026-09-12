/* ==========================================================================
   test_depth.js — the four reasoning sections.

   The depth pass runs over many sessions, so the thing that has to be
   guarded is not "is it finished" but "is every block that exists correct,
   attached, and rendered". Specifically:

   1. ATTACHMENT. A depth block is keyed by slug and merged onto a term. A
      typo in that slug silently writes content nobody will ever see — the
      exact silent-drop failure this codebase has been bitten by before. So
      every block must resolve, and nothing may be dropped.

   2. ADDITIVE. Depth must never overwrite what a term already said. The
      definition, paragraphs, key points, example and flow are the existing
      contract; these sections sit alongside them.

   3. SHAPE. Each section has a schema. A misconception with no correction,
      a numbers table with ragged rows, or a trade-off with nothing in it
      renders as something visibly broken rather than as an error.

   4. SUBSTANCE. This is the point of the pass. A "deepened" term with a
      one-line why and two misconceptions has not been deepened. The
      thresholds here are deliberately low enough to pass real writing and
      high enough to fail filler.

   Run: node dojo/tools/test_depth.js
   ========================================================================== */

const path = require("path");

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

const { TD, window, document, errors } = require("./_boot.js");

console.log("\nDepth sections\n");

ok("boots without a jsdom error", errors.length === 0, errors[0]);

/* ---------------- 1. attachment ---------------- */
console.log("  attachment");

const blocks = TD.depth || [];
ok("depth blocks are loaded", blocks.length > 0, String(blocks.length));
ok("the merge ran", typeof TD.depthCount === "number");

/* The one that matters: a slug that does not resolve means content written
   and never shown. */
eq("every depth block attached to a real term", (TD.depthMissing || []).length, 0);
ok("nothing was dropped between loading and merging",
  TD.depthCount === blocks.length,
  TD.depthCount + " applied of " + blocks.length);

/* two blocks claiming the same slug means one silently wins */
const seen = Object.create(null);
const dupes = [];
blocks.forEach((b) => {
  if (!b || !b.slug) return;
  if (seen[b.slug]) dupes.push(b.slug);
  seen[b.slug] = 1;
});
ok("no slug is claimed by two blocks", dupes.length === 0, dupes.join(", "));

const deep = TD.terms.filter((t) => TD.hasDepth(t));
eq("every attached block is visible on its term", deep.length, blocks.length);

/* ---------------- 2. additive ---------------- */
console.log("  additive");

/* A depth block must not carry the fields that already belong to a term.
   If one did, the merge would either overwrite real content or silently
   ignore it — both bad, and both easy to introduce by copy-paste. */
const OWNED = ["t", "d", "b", "k", "x", "ex", "fl", "r", "g", "l", "c", "dg"];
const trespass = [];
blocks.forEach((b) => {
  OWNED.forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(b, f)) trespass.push(b.slug + "." + f);
  });
});
ok("no depth block touches an existing term field",
  trespass.length === 0, trespass.join(", "));

/* and the terms themselves still have everything they had */
const stripped = deep.filter((t) => !t.d || !t.b || !t.b.length || !t.k || !t.k.length);
ok("deepened terms kept their definition, paragraphs and key points",
  stripped.length === 0, stripped.map((t) => t.slug).join(", "));

/* ---------------- 3. shape ---------------- */
console.log("  shape");

deep.forEach((t) => {
  const id = t.slug;

  if (t.why && typeof t.why === "object") {
    ok(id + ": why has a problem statement", !!t.why.problem);
    ok(id + ": why says what came before", !!t.why.before);
  }

  if (t.miss) {
    ok(id + ": misconceptions is a list", Array.isArray(t.miss));
    (t.miss || []).forEach((m, i) => {
      ok(id + ": misconception " + (i + 1) + " states the wrong belief", !!m.w);
      /* a wrong belief with no correction is worse than nothing — it is a
         claim printed with no answer */
      ok(id + ": misconception " + (i + 1) + " corrects it", !!m.r);
    });
  }

  if (t.trade) {
    ok(id + ": trade-off says what it buys",
      Array.isArray(t.trade.buys) && t.trade.buys.length > 0);
    ok(id + ": trade-off says what it costs",
      Array.isArray(t.trade.costs) && t.trade.costs.length > 0);
    /* the "when not to" list is the part that separates understanding from
       recitation, so it is required rather than optional */
    ok(id + ": trade-off says when NOT to use it",
      Array.isArray(t.trade.avoid) && t.trade.avoid.length > 0);
  }

  if (t.num && typeof t.num === "object" && t.num.r) {
    const width = t.num.h ? t.num.h.length : (t.num.r[0] || []).length;
    const ragged = t.num.r.filter((r) => r.length !== width);
    ok(id + ": every numbers row matches the header width",
      ragged.length === 0,
      "expected " + width + " columns, " + ragged.length + " rows differ");
    ok(id + ": the numbers table says what to notice", !!t.num.n);
  }
});

/* ---------------- 4. substance ---------------- */
console.log("  substance");

const words = (s) => String(s || "").split(/\s+/).filter(Boolean).length;

function depthWords(t) {
  let w = 0;
  if (t.why) {
    w += typeof t.why === "string"
      ? words(t.why)
      : words(t.why.before) + words(t.why.problem) + words(t.why.shift);
  }
  (t.miss || []).forEach((m) => { w += words(m.w) + words(m.r); });
  if (t.trade) {
    ["buys", "costs", "avoid"].forEach((k) => {
      (t.trade[k] || []).forEach((i) => { w += words(i); });
    });
  }
  if (t.num) {
    w += typeof t.num === "string" ? words(t.num) : words(t.num.n);
  }
  return w;
}

/* Thresholds set to pass real writing and fail filler. A term carrying all
   four sections properly lands around 500-800 words of added reasoning. */
const thin = deep.filter((t) => depthWords(t) < 300);
ok("every deepened term carries real depth, not filler",
  thin.length === 0,
  thin.map((t) => t.slug + "=" + depthWords(t) + "w").join(", "));

const fewMiss = deep.filter((t) => t.miss && t.miss.length < 3);
ok("misconception lists are worth having (3+)",
  fewMiss.length === 0,
  fewMiss.map((t) => t.slug + "=" + t.miss.length).join(", "));

/* A misconception whose correction is one clause is not a correction. */
const shallow = [];
deep.forEach((t) => {
  (t.miss || []).forEach((m, i) => {
    if (words(m.r) < 12) shallow.push(t.slug + "#" + (i + 1));
  });
});
ok("every correction actually explains itself",
  shallow.length === 0, shallow.join(", "));

/* ---------------- 5. render ---------------- */
console.log("  render");

const sample = deep[0];
ok("there is something to render", !!sample);

window.location.hash = "#/t/" + sample.slug;

setTimeout(() => {
  const view = document.getElementById("view");

  ok("the term page rendered", !!view.querySelector(".article"));
  ok("why it exists rendered", !!view.querySelector(".dp-why"));
  ok("the numbers table rendered", !!view.querySelector(".dp-num-t"));
  ok("misconceptions rendered", !!view.querySelector(".dp-miss"));
  ok("the trade-off rendered", !!view.querySelector(".dp-bal"));
  ok("the when-not-to list rendered", !!view.querySelector(".dp-avoid"));

  /* every wrong belief must be paired with its correction in the DOM, not
     just in the data */
  const wrongs = view.querySelectorAll(".dp-miss-w").length;
  const rights = view.querySelectorAll(".dp-miss-r").length;
  eq("every rendered wrong belief has a rendered correction", rights, wrongs);

  /* the sections must land in the order the page was designed around:
     context first, then the entry, then the reasoning */
  const heads = [...view.querySelectorAll(".art-h2")].map((e) => e.textContent.trim());
  const iWhy = heads.indexOf("Why it exists");
  const iKey = heads.findIndex((h) => h.indexOf("Key points") >= 0);
  const iNum = heads.indexOf("The numbers");
  const iMiss = heads.indexOf("What people get wrong");
  const iTrade = heads.indexOf("The trade-off");

  ok("why it exists comes first", iWhy === 0, heads.join(" | "));
  ok("the reasoning sections come after key points",
    iNum > iKey && iMiss > iKey && iTrade > iKey, heads.join(" | "));
  ok("the reasoning sections are in order",
    iNum < iMiss && iMiss < iTrade, heads.join(" | "));

  /* markup written into the content must survive TD.rich() rather than
     being printed as literal backticks or asterisks */
  const html = view.innerHTML;
  ok("inline code is formatted, not printed raw",
    html.indexOf("<code>") !== -1);
  ok("no stray markdown leaked into the page",
    !/\*\*[A-Za-z]/.test(view.textContent), "found ** in rendered text");

  /* A term without depth must render exactly as before. Once every term is
     deepened there is no such term left to check — that is the goal state,
     not a failure, so the case is skipped rather than crashing on undefined. */
  const plain = TD.terms.find((t) => !TD.hasDepth(t));
  if (!plain) {
    ok("every term is deepened, so the no-depth render case is moot", true);
    done();
    return;
  }
  window.location.hash = "#/t/" + plain.slug;

  setTimeout(() => {
    const v2 = document.getElementById("view");
    ok("a term without depth still renders", !!v2.querySelector(".article"));
    ok("a term without depth shows no depth sections",
      !v2.querySelector(".dp-why") && !v2.querySelector(".dp-miss") &&
      !v2.querySelector(".dp-bal") && !v2.querySelector(".dp-num-t"));

    done();
  }, 220);
}, 400);

function done() {
  console.log("\n  " + (checks - failures) + "/" + checks + " checks passed");
  console.log("  " + deep.length + " of " + TD.terms.length + " terms deepened (" +
    Math.round(deep.length / TD.terms.length * 100) + "%)");
  if (failures) {
    console.log("  " + failures + " FAILED\n");
    process.exit(1);
  }
  console.log("  depth sections OK\n");
  /* jsdom keeps the event loop alive; without this the process hangs for
     minutes after the last assertion has passed. */
  process.exit(0);
}
