/* ==========================================================================
   check_slugs.js — verify a list of slugs before writing depth for them.

   Writing a depth block against a slug that does not exist produces content
   nobody ever sees. test_termdepth.js catches it afterwards; this catches it
   before the writing effort is spent.

   Usage:  node dojo/tools/check_slugs.js foo-bar baz-qux
           node dojo/tools/check_slugs.js --level advanced --cat databases
   ========================================================================== */

const { TD } = require("./_boot.js");
const args = process.argv.slice(2);

/* --level X --cat Y : list undeepened terms matching a filter */
if (args[0] === "--level" || args[0] === "--cat") {
  const opt = {};
  for (let i = 0; i < args.length; i += 2) opt[args[i].replace("--", "")] = args[i + 1];
  const hits = TD.terms.filter((t) =>
    (!opt.level || t.l === opt.level) &&
    (!opt.cat || t.c === opt.cat) &&
    !TD.hasDepth(t));
  hits.forEach((t) => console.log(t.slug + " :: " + t.t + " :: " + t.d.slice(0, 70)));
  console.log("\n" + hits.length + " undeepened");
  process.exit(0);
}

/* otherwise: resolve each argument as a slug */
let bad = 0;
args.forEach((s) => {
  const t = TD.bySlug[s];
  if (t) {
    console.log("OK   " + s + "  (" + t.c + ", " + t.l + ")");
  } else {
    bad++;
    /* suggest the closest real slug so the fix is obvious */
    const near = TD.terms
      .filter((x) => x.slug.split("-").some((w) => s.includes(w)))
      .slice(0, 4).map((x) => x.slug);
    console.log("MISS " + s + (near.length ? "  did you mean: " + near.join(", ") : ""));
  }
});
process.exit(bad ? 1 : 0);
