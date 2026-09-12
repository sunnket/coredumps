/* Integration test: the generative-DL module and the OS & Networking track.

   Content checks, not just rendering. An MCQ whose `a` index points at the
   wrong option teaches the wrong answer confidently, and there is no way for
   a reader to tell — so the structural properties of every question are
   asserted here rather than trusted.

   The one thing a test cannot check is whether a claim is true. What it CAN
   check is that the shape is right: four distinct options, an in-range answer,
   an explanation long enough to actually explain, and no duplicated text
   between the options. */

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

console.log("\nCoreDumps — generative DL and OS/Networking\n");

ok("every script in index.html exists", missing === 0, missing + " missing");
ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

/* ---- the DL track gained generative coverage ---- */

const dl = TD.trackById["dl"];
ok("the dl track exists", !!dl);

["gen", "frontier"].forEach((id) => {
  const mod = (dl.modules || []).filter((m) => m.id === id)[0];
  ok("dl declares the " + id + " module", !!mod);
  ok("dl/" + id + " has a description", !!(mod && mod.desc && mod.desc.length > 40));
  ok("dl/" + id + " has lessons behind it", !!(mod && mod.count >= 3), mod && String(mod.count));
});

const genTitles = TD.inModule("dl", "gen").map((L) => L.t).join(" | ").toLowerCase();
["autoencoder", "variational", "gan", "diffusion"].forEach((topic) => {
  ok("generative module covers: " + topic, genTitles.indexOf(topic) !== -1, genTitles);
});

const frontierText = TD.inModule("dl", "frontier")
  .map((L) => (L.t + " " + L.s + " " + L.k.join(" ")).toLowerCase()).join(" | ");
["contrastive", "reinforcement", "rlhf", "mixture of experts"].forEach((topic) => {
  ok("frontier module covers: " + topic, frontierText.indexOf(topic) !== -1);
});

/* ---- the OS & Networking track exists and is complete ---- */

const osnet = TD.trackById["osnet"];
ok("the osnet track is defined", !!osnet);
ok("it has a brief", !!(osnet && osnet.brief && osnet.brief.what));
ok("it declares modules", !!(osnet && osnet.modules.length >= 8), osnet && String(osnet.modules.length));

/* the audit flagged empty modules as a real defect -- do not ship one */
(osnet.modules || []).forEach((m) => {
  ok("osnet/" + m.id + " has at least one lesson", m.count >= 1, String(m.count));
  ok("osnet/" + m.id + " has a description", !!m.desc && m.desc.length > 30);
});

const netText = TD.inTrack("osnet")
  .map((L) => (L.t + " " + L.s + " " + L.k.join(" ")).toLowerCase()).join(" | ");
["system call", "thread", "virtual memory", "deadlock", "file descriptor",
 "tcp", "udp", "dns", "traceroute"].forEach((topic) => {
  ok("osnet covers: " + topic, netText.indexOf(topic) !== -1);
});

/* ---- every new lesson is complete and renders ---- */

const fresh = TD.inTrack("osnet")
  .concat(TD.inModule("dl", "gen"))
  .concat(TD.inModule("dl", "frontier"));

eq("sixteen new lessons registered", fresh.length, 16);

fresh.forEach((L) => {
  const tag = '"' + L.t.slice(0, 34) + '"';
  ok(tag + " has a summary", !!L.s && L.s.length > 25);
  ok(tag + " has goals", L.goal.length >= 3);
  ok(tag + " has takeaways", L.k.length >= 4);
  ok(tag + " has related terms", L.r.length >= 3);
  ok(tag + " has a drill", !!L.drill && L.drill.items.length >= 5);
  ok(tag + " has an exercise", L.b.some((b) => b.tryit));

  go("#/learn/" + L.key);
  const view = $("#view");
  ok(tag + " renders substantially", view.textContent.length > 2500,
    String(view.textContent.length));
  ok(tag + " leaks no undefined", view.innerHTML.indexOf("undefined") === -1);
  ok(tag + " leaks no [object Object]", view.innerHTML.indexOf("[object Object]") === -1);
});

/* ---- the question banks ---- */

function auditBank(track, mod) {
  const qs = TD.mcqIn(track, mod);
  ok(track + "/" + mod + " has questions", qs.length >= 3, String(qs.length));

  qs.forEach((q, i) => {
    const tag = track + "/" + mod + "#" + i;
    ok(tag + " has a question", !!q.q && q.q.length > 30);
    ok(tag + " has four options", (q.o || []).length === 4, String((q.o || []).length));

    /* the answer index must point at a real option -- an off-by-one here
       teaches the wrong answer with total confidence */
    ok(tag + " answer index is in range",
      typeof q.a === "number" && q.a >= 0 && q.a < (q.o || []).length, String(q.a));

    ok(tag + " has an explanation", !!q.x && q.x.length > 80,
      q.x ? String(q.x.length) : "none");
    ok(tag + " has a tag", !!q.tag);
    ok(tag + " has a level", ["core", "intermediate", "advanced"].indexOf(q.lvl) !== -1, q.lvl);

    /* duplicated options make a question unanswerable */
    const uniq = new Set((q.o || []).map((o) => o.trim().toLowerCase()));
    eq(tag + " options are all distinct", uniq.size, (q.o || []).length);

    /* an option that is empty or whitespace. A numeric answer such as
       "1024" is legitimately short, so the bar is non-empty rather than a
       length -- the earlier version of this check flagged correct CIDR
       options as defects. */
    (q.o || []).forEach((o, n) => {
      ok(tag + " option " + n + " is non-empty", !!o && o.trim().length > 0);
    });
  });
  return qs.length;
}

let dlQ = 0;
["gen", "frontier"].forEach((m) => { dlQ += auditBank("dl", m); });
ok("the generative modules have a real bank", dlQ >= 20, String(dlQ));

let netQ = 0;
(osnet.modules || []).forEach((m) => { netQ += auditBank("osnet", m.id); });
ok("every osnet module has questions", netQ >= 30, String(netQ));

/* ---- the quiz routes actually work ---- */

go("#/quiz/osnet");
ok("the osnet quiz track page renders", $("#view").textContent.length > 400);

go("#/quiz/osnet/transport");
ok("an osnet chapter quiz renders", $("#view").textContent.length > 400);

go("#/quiz/dl/gen");
ok("the generative chapter quiz renders", $("#view").textContent.length > 400);

/* ---- the track appears in the Learn index ---- */

go("#/learn");
ok("the Learn index lists OS & Networking",
  $("#view").textContent.indexOf("OS & Networking") !== -1 ||
  $("#view").textContent.indexOf("Operating Systems") !== -1);

go("#/learn/osnet");
ok("the osnet track page renders", $("#view").textContent.length > 1000);
ok("it shows its modules", $("#view").textContent.indexOf("Processes, threads") !== -1);

ok("no jsdom errors across the whole run", errors.length === 0,
  errors.slice(0, 2).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) {
  console.log(failures + " FAILED\n");
  process.exit(1);
}
console.log("Generative DL and OS/Networking are wired in and complete.\n");
process.exit(0);
