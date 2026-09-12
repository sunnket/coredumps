/* Integration test: the Crash Course, and the uniqueness rule it exists for.

   The crash course is meant to be the one place a reader can learn everything
   important that no specialist category owns -- API keys, the shell, file
   formats, the everyday habits. That only works if a term appears exactly
   once in the whole dictionary. It did not: thirteen entries duplicated
   cs-fundamentals and software-engineering outright, each getting a "-2" slug
   that nothing linked to, so search returned the same word twice and the
   reader had no way to tell which entry was the real one.

   This test enforces the rule going forward: no crash-course term may share
   its title with a term in any other category, and every entry must be
   complete. */

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
  runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, virtualConsole: vc
});
const { window } = dom;
const { document } = window;

window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
window.scrollTo = () => {};
window.scroll = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

srcs.forEach((src) => {
  const f = path.join(ROOT, src);
  if (!fs.existsSync(f)) return;
  const el = document.createElement("script");
  el.textContent = fs.readFileSync(f, "utf8");
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

function go(hash) {
  window.location.hash = hash;
  window.dispatchEvent(new window.Event("hashchange"));
}

console.log("\nCoreDumps — Crash Course\n");

ok("app booted without errors", errors.length === 0, errors.slice(0, 2).join(" | "));

const crash = TD.terms.filter((t) => t.c === "crash-course");
const others = TD.terms.filter((t) => t.c !== "crash-course");

ok("the crash course is substantial", crash.length >= 200, String(crash.length));

/* ---- THE RULE: every crash-course term is unique in the dictionary ---- */

const otherTitles = new Map();
others.forEach((t) => {
  const k = t.t.toLowerCase().trim();
  if (!otherTitles.has(k)) otherTitles.set(k, t);
});

const collisions = crash.filter((t) => otherTitles.has(t.t.toLowerCase().trim()));
ok("no crash-course term duplicates another category", collisions.length === 0,
  collisions.map((t) => t.t + " (also " + otherTitles.get(t.t.toLowerCase().trim()).c + ")").slice(0, 8).join("; "));

/* the same word written slightly differently is still a duplicate */
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const otherNorm = new Map();
others.forEach((t) => { if (!otherNorm.has(norm(t.t))) otherNorm.set(norm(t.t), t); });
const nearDupes = crash.filter((t) => otherNorm.has(norm(t.t)));
ok("nor a punctuation-only variant of one", nearDupes.length === 0,
  nearDupes.map((t) => t.t + " ~ " + otherNorm.get(norm(t.t)).t).slice(0, 6).join("; "));

/* and no crash-course term is duplicated inside the crash course either */
const seen = new Map();
const internal = [];
crash.forEach((t) => {
  const k = t.t.toLowerCase().trim();
  if (seen.has(k)) internal.push(t.t);
  seen.set(k, t);
});
ok("no term is repeated within the crash course", internal.length === 0, internal.join("; "));

/* A duplicate always shows up as a "-2" slug, so guard that directly. The
   check is that the slug is a numbered variant of ANOTHER term's slug --
   "utf-8" ends in a digit and is simply its own title. */
const bySlug = new Set(TD.terms.map((t) => t.slug));
const suffixed = crash.filter((t) => {
  const m = t.slug.match(/^(.*)-(\d+)$/);
  return m && bySlug.has(m[1]);
});
ok("no crash-course term has a de-duplicated slug", suffixed.length === 0,
  suffixed.map((t) => t.slug).join(", "));

/* ---- every entry is complete ---- */

const incomplete = [];
crash.forEach((t) => {
  const miss = [];
  if (!t.d || t.d.length < 30) miss.push("definition");
  if (!t.b || t.b.length < 2) miss.push("body");
  if (!t.k || t.k.length < 4) miss.push("key points");
  if (!t.r || t.r.length < 3) miss.push("related");
  if (!t.ex || !t.ex.b) miss.push("example");
  if (!t.fl || !t.fl.s || !t.fl.s.length) miss.push("flow");
  if (miss.length) incomplete.push(t.t + ": no " + miss.join("/"));
});
ok("every crash-course term is complete", incomplete.length === 0,
  incomplete.slice(0, 6).join("; "));

/* ---- every cross-reference resolves ---- */

const dead = [];
crash.forEach((t) => {
  (t.r || []).forEach((n) => { if (!TD.resolve(n)) dead.push(t.t + " -> " + n); });
});
ok("every related link resolves", dead.length === 0, dead.slice(0, 6).join("; "));

/* ---- the practical essentials a reader comes here for ---- */

const mustCover = [
  "API Key", "Secret", "Access Token", "SSH Key", "Certificate",
  "PATH", "Working Directory", "Permissions", "Glob Pattern", ".gitignore",
  "URL Anatomy", "URL Encoding", "CRUD", "Rate Limit", "MIME Type",
  "UTF-8", "CSV", "Markdown", "Line Endings", "Escaping",
  "Debugger and Breakpoints", "Log Level", "Profiler",
  "Context Length", "Root Cause Analysis", "Estimation"
];
const absent = mustCover.filter((n) => {
  const t = TD.resolve(n);
  return !t || t.c !== "crash-course";
});
ok("the practical essentials are all here", absent.length === 0, absent.join(", "));

/* ---- it really is the beginner's entry point ---- */

const notCore = crash.filter((t) => t.lvl && t.lvl !== "core");
ok("everything in it is pitched at core level", notCore.length === 0,
  notCore.map((t) => t.t).slice(0, 5).join(", "));

/* ---- every term renders ---- */

const broken = [];
crash.forEach((t) => {
  go("#/t/" + t.slug);
  const view = $("#view");
  if (!view || view.innerHTML.length < 600) { broken.push(t.slug + " (thin)"); return; }
  if (view.textContent.indexOf(t.t) === -1) broken.push(t.slug + " (title missing)");
});
ok("every crash-course term renders", broken.length === 0, broken.slice(0, 5).join("; "));

/* ---- the category page lists them ---- */

go("#/c/crash-course");
const catText = $("#view").textContent;
ok("the category page renders", catText.length > 500);
["API Key", "PATH", "UTF-8"].forEach((n) => {
  ok("the category page lists '" + n + "'", catText.indexOf(n) !== -1);
});

console.log("\n  " + crash.length + " terms, all unique across " +
  new Set(TD.terms.map((t) => t.c)).size + " categories, all complete");

ok("no errors across the whole run", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log("\n" + (checks - failures) + "/" + checks + " checks passed");
if (failures) { console.log(failures + " FAILED\n"); process.exit(1); }
console.log("The crash course covers the essentials, once each.\n");
process.exit(0);
