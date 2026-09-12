/* Emit the set of vocab / related names with no matching term, minus the ones
   fix_dead_terms.js renames. Written to _dead.json for that script to consume,
   so the drop list is derived from the live app rather than hand-typed. */
const fs = require("fs");
const path = require("path");
const { TD } = require("./_boot");

const src = fs.readFileSync(path.join(__dirname, "fix_dead_terms.js"), "utf8");
const block = src.slice(src.indexOf("const RENAME = {"), src.indexOf("};", src.indexOf("const RENAME = {")));
const renamed = new Set();
block.replace(/"((?:[^"\\]|\\.)*)"\s*:/g, (_, k) => { renamed.add(k); return _; });

const dead = new Set();
TD.lessons.forEach((L) => {
  (L.b || []).forEach((blk) => (blk.vocab || []).forEach((nm) => {
    if (!TD.resolve(nm) && !renamed.has(nm)) dead.add(nm);
  }));
  (L.r || []).forEach((nm) => {
    if (!TD.resolve(nm) && !renamed.has(nm)) dead.add(nm);
  });
});
(TD.studies || []).forEach((s) => {
  (s.r || []).forEach((nm) => {
    if (!TD.resolve(nm) && !renamed.has(nm)) dead.add(nm);
  });
});

const list = [...dead].sort();
fs.writeFileSync(path.join(__dirname, "_dead.json"), JSON.stringify(list, null, 1));
console.log("renames declared: " + renamed.size);
console.log("names with no term (will be dropped): " + list.length);

// sanity: every rename target must actually exist
let bad = 0;
renamed.forEach((k) => {
  const to = src.match(new RegExp('"' + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"\\s*:\\s*"([^"]+)"'));
  if (to && !TD.resolve(to[1])) { console.log("  BAD TARGET: " + k + " -> " + to[1]); bad++; }
});
console.log(bad ? bad + " rename targets do not exist" : "all rename targets resolve");
process.exit(0);
