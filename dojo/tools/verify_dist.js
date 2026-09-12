/* Boot the bundled single-file build and confirm it behaves like the split one. */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const file = path.join(__dirname, "..", "dist", "blueprint-dojo.html");
const html = fs.readFileSync(file, "utf8")
  .replace(/<link rel="(preconnect|stylesheet)"[^>]*https:\/\/fonts[^>]*>/g, "");

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push(e.message));

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom, { document } = window;
if (document.readyState === "loading") {
  document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
}

const $ = (id) => document.getElementById(id);
let bad = 0;
const check = (label, cond) => { if (!cond) { console.log("  FAIL " + label); bad++; } };

check("no errors", errors.length === 0);
check("117 problems", window.PROBLEMS.length === 117);
check("library populated", $("libList").querySelectorAll(".item").length === 117);
check("first problem loaded", $("pTitle").textContent === "Reverse an Array");
check("blueprint ghost drawn", $("layer").querySelectorAll(".gh").length > 0);
check("styles inlined", document.querySelector("style").textContent.indexOf("--syn-kw") !== -1);
check("no leftover file refs", html.indexOf('src="app.js"') === -1 && html.indexOf('href="styles.css"') === -1);

const input = $("input");
input.value = window.PROBLEMS[0].solution;
input.selectionStart = input.selectionEnd = input.value.length;
input.dispatchEvent(new window.Event("input", { bubbles: true }));
check("typing over the blueprint clears the ghost", $("layer").querySelectorAll(".gh").length === 0);
check("match reaches 100%", $("rAccuracy").textContent === "100%");
$("btnCheck").click();
check("compare accepts the reference", $("verdict").className.indexOf("ok") !== -1);

console.log(bad ? "\ndist verification FAILED (" + bad + ")" : "dist build verified");
process.exit(bad ? 1 : 0);
