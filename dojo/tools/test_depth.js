/* ==========================================================================
   test_depth.js — the lesson depth ratchet.

   A lesson can render perfectly and still be a stub. This enforces depth as
   a property of the content, not just correctness of the markup, across the
   four tracks that were expanded because they named a subject without
   teaching enough of it to work from.

   The floors are set just under current levels so they **ratchet**: they
   record where the content actually is and stop it sliding back. They are
   not aspirations, and they should be raised when a track is expanded again.

   It also pins the specific topics each expansion existed to add, so a
   later edit cannot quietly drop them and still pass.

   Run: node dojo/tools/test_depth.js
   ========================================================================== */

const { TD, errors } = require("./_boot.js");

let failures = 0;
let checks = 0;

function ok(label, cond, extra) {
  checks++;
  if (!cond) {
    failures++;
    console.log("  FAIL  " + label + (extra ? "  -> " + extra : ""));
  }
}

console.log("\nLesson depth\n");

ok("boots without a jsdom error", errors.length === 0, errors[0]);

function lessonsOf(track) {
  return TD.lessons.filter((l) => l.track === track);
}

/* every block of every lesson, flattened, as searchable text */
function trackText(track) {
  return JSON.stringify(lessonsOf(track)).toLowerCase();
}

function blockCount(l) { return (l.b || []).length; }

/* count blocks of a given kind — a block is an object with one key naming
   its kind: {h:…}, {p:…}, {tryit:…}, {ana:…} and so on */
function kindCount(l, kind) {
  return (l.b || []).filter((b) => b && Object.prototype.hasOwnProperty.call(b, kind)).length;
}

/* ---------------- 1. block floors ----------------
   The headline number. A lesson under the floor is a stub wearing a
   lesson's clothes. */
console.log("  block floors");

const FLOORS = [
  ["zero", 10, "Ground Zero"],
  ["ml", 9, "Machine Learning"],
  ["llm", 15, "LLM Engineering"],
  ["nlp", 6, "NLP"]
];

FLOORS.forEach(([id, floor, name]) => {
  const ls = lessonsOf(id);
  ok(name + " track exists", ls.length > 0);
  const thin = ls.filter((l) => blockCount(l) < floor);
  ok(name + ": no lesson under " + floor + " blocks",
    thin.length === 0,
    thin.map((l) => l.slug + "=" + blockCount(l)).join(", "));
});

/* ---------------- 2. every lesson's frame ----------------
   Goals, takeaways and onward references are what turn a page of prose into
   something a reader can work from and leave. */
console.log("  lesson frame");

const noGoals = TD.lessons.filter((l) => !l.goal || l.goal.length < 3);
ok("every lesson states 3+ goals",
  noGoals.length === 0,
  noGoals.slice(0, 6).map((l) => l.key).join(", "));

const noTake = TD.lessons.filter((l) => !l.k || l.k.length < 3);
ok("every lesson ends with 3+ takeaways",
  noTake.length === 0,
  noTake.slice(0, 6).map((l) => l.key).join(", "));

/* Onward refs are required on the four expanded tracks — that was part of
   what the expansion added. Across all 481 lessons the floor is lower and
   deliberately so: a short reference lesson does not always have three
   places worth sending someone next. */
const DEEP_TRACKS = ["zero", "ml", "llm", "nlp"];
const noRefs = TD.lessons.filter((l) =>
  DEEP_TRACKS.indexOf(l.track) >= 0 && (!l.r || l.r.length < 3));
ok("every lesson on the four deep tracks points onward with 3+ refs",
  noRefs.length === 0,
  noRefs.slice(0, 6).map((l) => l.key).join(", "));

/* ---------------- 3. exercises are real ----------------
   A `tryit` with no task, or with a task and no solution, teaches nothing —
   the reader is asked to do something and then left. */
console.log("  exercises");

const badTry = [];
TD.lessons.forEach((l) => {
  (l.b || []).forEach((b) => {
    if (!b || !b.tryit) return;
    const t = b.tryit;
    if (!t.task || String(t.task).trim().length < 20) badTry.push(l.key + " (no task)");
    else if (!t.sol && !t.solution && !t.hint) badTry.push(l.key + " (no way forward)");
  });
});
ok("every exercise has a real task and a way forward",
  badTry.length === 0, badTry.slice(0, 6).join(", "));

/* ---------------- 4. ML model lessons reason, not recite ----------------
   The "assumption, breakage, tell" framing is what makes model choice
   reasoning rather than folklore, so it is counted rather than hoped for. */
console.log("  ML reasoning");

const mlText = trackText("ml");
["assumption", "breaks", "tell"].forEach((w) => {
  ok("ML track teaches the '" + w + "' framing", mlText.indexOf(w) !== -1);
});

/* ---------------- 5. pinned topics ----------------
   Each expansion existed to add specific things. Pinning them means a later
   rewrite cannot drop the reason the expansion happened and still pass. */
console.log("  pinned topics");

const PINNED = [
  ["ml", ["leakage", "imbalance", "groupkfold", "timeseriessplit",
    "nested", "shap", "drift", "skew"]],
  ["llm", ["allowlist", "step cap", "loop", "golden", "cache", "p95"]],
  ["nlp", ["token", "negation", "macro-f1", "bio", "sacrebleu"]]
];

PINNED.forEach(([track, topics]) => {
  const text = trackText(track);
  topics.forEach((topic) => {
    ok(track + " track still covers " + topic,
      text.indexOf(topic.toLowerCase()) !== -1);
  });
});

/* ---------------- 6. NLP carries what it was missing ----------------
   NLP averaged 9 blocks per lesson with no exercises and no analogies,
   which is what triggered its expansion. */
console.log("  NLP depth");

const nlp = lessonsOf("nlp");
const nlpTry = nlp.reduce((a, l) => a + kindCount(l, "tryit"), 0);
const nlpAna = nlp.reduce((a, l) => a + kindCount(l, "ana"), 0);
const nlpAvg = Math.round(nlp.reduce((a, l) => a + blockCount(l), 0) / nlp.length);

ok("NLP has exercises", nlpTry > 0, String(nlpTry));
ok("NLP has analogies", nlpAna > 0, String(nlpAna));
ok("NLP averages 10+ blocks per lesson", nlpAvg >= 10, nlpAvg + " avg");

/* ---------------- 7. no empty or orphaned lesson ---------------- */
console.log("  integrity");

const empty = TD.lessons.filter((l) => blockCount(l) === 0);
ok("no lesson is empty", empty.length === 0,
  empty.slice(0, 6).map((l) => l.key).join(", "));

const orphan = TD.lessons.filter((l) => !TD.trackById[l.track]);
ok("every lesson belongs to a real track", orphan.length === 0,
  orphan.slice(0, 6).map((l) => l.key).join(", "));

console.log("\n  " + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log("  " + failures + " FAILED\n");
  process.exit(1);
}
console.log("  All four tracks carry the depth they claim.\n");
/* jsdom keeps the loop alive; exit explicitly or this hangs after passing. */
process.exit(0);
