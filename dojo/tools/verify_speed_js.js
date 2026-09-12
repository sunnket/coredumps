/* Check that the JavaScript in the Speed Coding cards is real JavaScript.

   verify_speed_code.py parses only the Python cards and skips the rest, which
   left the JavaScript set unverified. A typo in a card a reader types two
   hundred times becomes muscle memory for a mistake -- worse than not
   practising at all -- so those cards get the same guarantee here.

   Node's own parser is the checker: `new Function(src)` compiles without
   executing. Rung-1 fragments (`const `, `=> `, `...`) are deliberately not
   complete statements, so they are checked for balanced delimiters instead.

       node tools/verify_speed_js.js
*/

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..", "..", "termdex");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const srcs = [];
const html = indexHtml
  .replace(/<script src="([^"]+)"><\/script>\s*/g, (_, src) => { srcs.push(src); return ""; })
  .replace(/<link rel="(preconnect|stylesheet)"[^>]*https:\/\/fonts[^>]*\/?>/g, "");

const vc = new VirtualConsole();
vc.on("jsdomError", () => {});

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

srcs.forEach((src) => {
  const file = path.join(ROOT, src);
  if (!fs.existsSync(file)) return;
  const el = document.createElement("script");
  el.textContent = fs.readFileSync(file, "utf8");
  document.body.appendChild(el);
});
if (document.readyState === "loading") {
  document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
}

const TD = window.TD;

console.log("\nSpeed Coding — parsing the JavaScript cards\n");

/* A fragment is legal characters but not a whole statement. Checking that
   delimiters balance catches a genuine typo without demanding completeness. */
function balanced(src) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const open = [];
  let quote = null;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") { i++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "(" || c === "[" || c === "{") open.push(c);
    else if (pairs[c]) {
      if (open.pop() !== pairs[c]) return "unbalanced " + c;
    }
  }
  if (quote) return "unterminated string";
  return null;
}

/* A card that opens a block is legitimately incomplete at rung 2/3 too. */
const OPENER = /[{(\[]\s*$|=>\s*$|\bfunction\b[^)]*$/;

let checked = 0, failed = 0, skipped = 0;

TD.speedSets.forEach((S) => {
  const lang = (S.lang || "").toLowerCase();
  if (lang !== "javascript" && lang !== "typescript") {
    skipped += S.cards.length;
    return;
  }

  S.cards.forEach((card) => {
    checked++;
    const src = card.c;
    let err = null;

    if (S.rung === 1 || OPENER.test(src.trim())) {
      err = balanced(src);
    } else {
      try {
        /* compile without running; await needs an async wrapper */
        new Function("return (async () => {\n" + src + "\n});");
      } catch (e) {
        err = e.message;
        /* Only "unexpected END of input" means the snippet was merely
           incomplete -- a card that legitimately opens a block. Any other
           parse error is a real defect, including "unexpected token", which
           an earlier version of this check wrongly forgave: it passed a
           deliberately injected typo. */
        if (/Unexpected end of input/.test(err) && balanced(src) === null) {
          err = null;
        }
      }
    }

    if (err) {
      failed++;
      console.log("  FAIL   [" + S.id + "] " + src.split("\n")[0].slice(0, 52));
      console.log("         " + err);
    }
  });
});

console.log("\n" + (checked - failed) + "/" + checked + " JavaScript cards parse" +
  (skipped ? " (" + skipped + " non-JS cards skipped)" : ""));
if (failed) {
  console.log(failed + " FAILED\n");
  process.exit(1);
}
console.log("Every JavaScript line in Speed Coding is valid JavaScript.\n");
process.exit(0);
