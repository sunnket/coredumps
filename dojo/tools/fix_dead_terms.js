/* One-off repair: vocab chips and related-term links that name a term the
   dictionary does not have.

   Both renderers drop an unresolved name silently, so these have been shipping
   as invisible gaps -- a "Look these up" block with four chips where six were
   written. 293 vocab chips and 197 related links were dead when this ran.

   Two actions, and nothing in between:
     RENAME  the name means exactly what an existing term means, and the only
             difference is spelling (-ize/-ise), number, or the term's fuller
             title. Verified by hand, one at a time -- an automatic
             "close enough" pass proposed List -> Linked List and
             Attention -> Flash Attention, which is why this list is manual.
     DROP    no term covers it. Removing the name is honest; pointing it at a
             loosely related term would send the reader somewhere they did not
             ask to go.

   Run:  node dojo/tools/fix_dead_terms.js [--apply]
   Without --apply it reports and changes nothing. */

const fs = require("fs");
const path = require("path");

const APPLY = process.argv.includes("--apply");
const ROOT = path.join(__dirname, "..", "..", "termdex");

/* name as written -> the real term it meant */
const RENAME = {
  // spelling variants: the dictionary is consistently British
  "Tokenization": "Tokenisation",
  "Quantization": "Quantisation",
  "Memoization": "Memoisation",
  "Authorization": "Authorisation",
  "Normalization": "Normalisation",
  "Regularization": "Regularisation",
  "Serialization": "Serialisation",
  "Optimizer": "Optimiser",

  // singular / plural
  "Naming Convention": "Naming Conventions",
  "Comparison Operator": "Comparison Operators",
  "Evaluation Metrics": "Evaluation Metric",
  "Emergent Abilities": "Emergent Ability",
  "Artifacts": "Artifact",
  "Retries": "Retry",

  // the term exists under its fuller title
  "Assignment": "Assignment Operator",
  "N+1 Query": "N+1 Query Problem",
  "Lambda": "Lambda Function",
  "K-Means": "K-Means Clustering",
  "Adam": "Adam Optimiser",
  "Chain-of-Thought": "Chain-of-Thought Prompting",
  "Sorting": "Sorting Algorithm",
  "Airflow": "Apache Airflow",
  "Coreference": "Coreference Resolution",
  "Multi-Head": "Multi-Head Attention",
  "Summarisation": "Text Summarisation",
  "Composition": "Composition over Inheritance",
  "Access Control": "Role-Based Access Control",
  "Baseline": "Baseline Model",
  "Experiment": "Experiment Tracking",
  "Staging": "Staging Environment",
  "Production": "Production Environment",
  "Truthy": "Truthy and Falsy",
  "Falsy": "Truthy and Falsy",
  "Pass by Value": "Pass by Value vs Reference",
  "Reference": "Pass by Value vs Reference",
  "Accessibility": "Web Accessibility",
  "Time Series": "Time Series Forecasting",

  // case studies reference these by their short name
  "TCP/IP": "TCP/IP Model",
  "OAuth": "OAuth 2.0"
};

function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".js")) out.push(p);
  });
  return out;
}

/* Rewrite only inside a vocab:[...] block or an r:[...] list, so a rename
   never touches prose, code samples or a term's own title.

   When every entry in a list is dead the whole property goes, not just its
   contents -- `trail` captures the comma and newline that follow so removing
   it cannot strand a `,` on its own line. Leaving `r: []` behind would render
   identically, but an empty list reads like an oversight in the source. */
function fixList(src, listRe) {
  let renamed = 0, dropped = 0;
  const out = src.replace(listRe, (whole, open, body, close, trail) => {
    const parts = body.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length || !parts.every((p) => /^"[^"\\]*"$/.test(p))) return whole;

    const kept = [];
    parts.forEach((p) => {
      const name = p.slice(1, -1);
      if (RENAME[name]) { kept.push('"' + RENAME[name] + '"'); renamed++; return; }
      if (DEAD.has(name)) { dropped++; return; }
      kept.push(p);
    });
    if (!kept.length) return "";                    // property and its comma
    return open + kept.join(", ") + close + (trail || "");
  });
  return { out, renamed, dropped };
}

/* The set of names with no home. Supplied by the caller so this script never
   has to guess -- it is read from the live app. */
const DEAD = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, "_dead.json"), "utf8")));

/* The optional 4th group is the separator that follows the property, so a
   list emptied completely takes its own comma with it. */
const VOCAB = /(\{\s*vocab:\s*\[)([^\]]*)(\]\s*\})(\s*,?\s*\n?)?/g;
const RLIST = /(\br:\s*\[)([^\]]*)(\])(\s*,\s*\n?)?/g;

let files = walk(path.join(ROOT, "data"), []);
let totalR = 0, totalD = 0, touched = 0;

/* Parse the rewritten source before trusting it. An earlier version of this
   script stranded a `,` where it removed a whole property, and eleven data
   files shipped unparseable for as long as it took to notice -- so nothing is
   written now unless it still parses. */
function parses(code, file) {
  try {
    new (require("vm").Script)(code, { filename: file });
    return true;
  } catch (e) {
    return false;
  }
}

let broken = 0;
files.forEach((f) => {
  const src = fs.readFileSync(f, "utf8");
  let a = fixList(src, VOCAB);
  let b = fixList(a.out, RLIST);
  const r = a.renamed + b.renamed, d = a.dropped + b.dropped;
  if (!r && !d) return;

  if (!parses(b.out, f)) {
    console.log("  SKIPPED (would not parse): " + path.relative(ROOT, f));
    broken++;
    return;
  }

  touched++;
  totalR += r;
  totalD += d;
  console.log(path.relative(ROOT, f) + "  renamed " + r + ", dropped " + d);
  if (APPLY) fs.writeFileSync(f, b.out);
});

console.log("\n" + (APPLY ? "APPLIED" : "DRY RUN") + ": " + totalR + " renamed, " + totalD +
  " dropped across " + touched + " files");
if (broken) console.log(broken + " file(s) skipped because the rewrite did not parse");
if (!APPLY) console.log("re-run with --apply to write");
