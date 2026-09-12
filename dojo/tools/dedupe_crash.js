/* One-off: remove the crash-course entries that duplicate a term another
   category already owns.

   Thirteen concepts were defined twice -- once in cs-fundamentals or
   software-engineering, and again in the crash course. The second copy got a
   "-2" slug (recursion-2, hash-table-2, ...) that nothing in the app links to,
   so it was reachable only by accident, and search returned the same word
   twice.

   Both halves have to go together. TD.attach falls back to TD.resolve when a
   name is not in its own category's bucket, so deleting the term while leaving
   its extras entry would silently re-point that example and flow onto the
   SURVIVING cs-fundamentals term and overwrite the one written for it.

   Run:  node dojo/tools/dedupe_crash.js [--apply] */

const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const ROOT = path.join(__dirname, "..", "..", "termdex");

/* title -> the category that keeps it */
const DUPES = {
  "Recursion": "cs-fundamentals",
  "Time Complexity": "cs-fundamentals",
  "Space Complexity": "cs-fundamentals",
  "Stack and Heap Memory": "cs-fundamentals",
  "Pure Function": "cs-fundamentals",
  "Immutability": "cs-fundamentals",
  "Garbage Collection": "cs-fundamentals",
  "Race Condition": "cs-fundamentals",
  "Binary Search": "cs-fundamentals",
  "Hash Table": "cs-fundamentals",
  "Binary Search Tree": "cs-fundamentals",
  "Deadlock": "cs-fundamentals",
  "Technical Debt": "software-engineering"
};

const TERM_FILES = ["19-crash-course-code.js", "20-crash-course-tools.js",
  "21-crash-course-web.js", "22-crash-course-ai.js"].map((f) => path.join(ROOT, "data", f));
const EXTRA_FILES = ["x19-crash-course-code.js", "x20-crash-course-tools.js",
  "x21-crash-course-web.js", "x22-crash-course-ai.js"].map((f) => path.join(ROOT, "data", "extras", f));

/* Walk from an opening brace to its match, respecting strings and escapes, so
   a `}` inside a code sample or a prose string never ends the entry early. */
function matchBrace(src, open) {
  let depth = 0, i = open, q = null;
  while (i < src.length) {
    const c = src[i];
    if (q) {
      if (c === "\\") i++;
      else if (c === q) q = null;
    } else if (c === '"' || c === "'" || c === "`") q = c;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (!depth) return i; }
    i++;
  }
  return -1;
}

function removeTermEntries(src, titles) {
  let out = src, removed = [];
  titles.forEach((title) => {
    const marker = '{t:"' + title + '"';
    const at = out.indexOf(marker);
    if (at < 0) return;
    const end = matchBrace(out, at);
    if (end < 0) return;
    /* take the entry plus the comma and blank line that follow it */
    let stop = end + 1;
    while (stop < out.length && /[,\s]/.test(out[stop])) stop++;
    out = out.slice(0, at) + out.slice(stop);
    removed.push(title);
  });
  return { out, removed };
}

function removeExtraEntries(src, titles) {
  let out = src, removed = [];
  titles.forEach((title) => {
    const marker = '"' + title + '": {';
    const at = out.indexOf(marker);
    if (at < 0) return;
    const open = out.indexOf("{", at);
    const end = matchBrace(out, open);
    if (end < 0) return;
    let stop = end + 1;
    while (stop < out.length && /[,\s]/.test(out[stop])) stop++;
    out = out.slice(0, at) + out.slice(stop);
    removed.push(title);
  });
  return { out, removed };
}

function parses(code, file) {
  try { new (require("vm").Script)(code, { filename: file }); return true; }
  catch (e) { console.log("    parse error: " + e.message); return false; }
}

const titles = Object.keys(DUPES);
let totalT = 0, totalX = 0, refused = 0;

TERM_FILES.forEach((f) => {
  const src = fs.readFileSync(f, "utf8");
  const r = removeTermEntries(src, titles);
  if (!r.removed.length) return;
  if (!parses(r.out, f)) { refused++; return; }
  totalT += r.removed.length;
  console.log(path.basename(f) + ": removed " + r.removed.length + " -> " + r.removed.join(", "));
  if (APPLY) fs.writeFileSync(f, r.out);
});

EXTRA_FILES.forEach((f) => {
  const src = fs.readFileSync(f, "utf8");
  const r = removeExtraEntries(src, titles);
  if (!r.removed.length) return;
  if (!parses(r.out, f)) { refused++; return; }
  totalX += r.removed.length;
  console.log(path.basename(f) + ": removed " + r.removed.length + " extras -> " + r.removed.join(", "));
  if (APPLY) fs.writeFileSync(f, r.out);
});

console.log("\n" + (APPLY ? "APPLIED" : "DRY RUN") + ": " + totalT + " terms, " + totalX + " extras removed");
if (refused) console.log(refused + " file(s) refused -- rewrite did not parse");
if (!APPLY) console.log("re-run with --apply to write");
