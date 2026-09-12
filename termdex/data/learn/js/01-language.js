/* JavaScript — the language itself.

   Written for someone who has finished the basics track and possibly Python,
   so the concepts are known and only the spelling is new. Where JavaScript
   differs from Python in a way that causes real bugs, the difference is
   called out explicitly rather than left to be discovered.

   House rule: every quirk that gets taught as "JavaScript is weird" is either
   explained or omitted. A quirk with a reason is a rule; a quirk without one
   is trivia. */

TD.addLessons("js", [

/* ==================================================================== */
{
 t: "Why JavaScript Is Everywhere",
 m: "brief",
 lvl: "core",
 s: "The language nobody chose and everybody uses — and what it is genuinely good at.",
 goal: [
  "Say why a browser will run JavaScript and nothing else",
  "Explain what ECMAScript means when a job advert says ES6",
  "Know where JavaScript is the right tool and where it is not"
 ],
 b: [
  { p: "JavaScript was written in ten days in 1995, to make a webpage do something when you clicked it. It was never designed for what it now does, and that history explains almost every strange corner of the language. It also has no competition: a browser runs JavaScript, and that is the end of the discussion." },

  { h: "The name is a marketing accident" },
  { p: "It has nothing to do with Java. Netscape had a deal with Sun, Java was popular, and the language was renamed from LiveScript to ride the association. The confusion has cost the industry thirty years of clarification and will never be fixed." },

  { n: "**ECMAScript** is the standard; JavaScript is the implementation. When a job advert says *ES6* it means the 2015 edition, which added `let`, `const`, arrow functions, classes, promises and modules — the version where the language became pleasant. Anything written before it looks noticeably different, which is why old tutorials are actively misleading.",
    nt: "ES6, ES2015 and ECMAScript" },

  { h: "Where it runs now" },
  { l: [
   "**Every browser.** No alternative exists. WebAssembly runs alongside it, not instead of it.",
   "**Servers**, through Node.js — the same language on both ends of a request.",
   "**Build tools**, almost universally, including tooling for projects written in other languages.",
   "**Mobile and desktop**, through React Native and Electron. VS Code is a JavaScript application.",
   "**Databases and edge functions**, increasingly."
  ] },

  { h: "What it is good at, honestly" },
  { vs: { t: "The trade at the centre of the language", lang: "text",
    bad: { c: "Heavy computation\n\nOne thread. A long calculation\nfreezes the entire page --\nno clicks, no scrolling, no\nrendering.\n\nThere are workers, but they\nare a separate mechanism with\nreal friction.", label: "Where it struggles",
      w: "Single-threaded by design. This is a genuine ceiling, not a temporary limitation, and it is why numerical work stays in Python." },
    good: { c: "Waiting on many things\n\nOne thread, an event loop, and\nnothing ever blocks. Ten\nthousand open connections cost\nalmost nothing because almost\nall of them are idle.\n\nThis is why Node is fast at\nexactly what servers do.", label: "Where it wins",
      w: "The same single thread that hurts computation is what makes IO-heavy work cheap. The design is coherent; it is simply aimed at a specific kind of problem." } } },

  { p: "So the honest summary: JavaScript is the correct choice for anything a person clicks on, and for servers that mostly wait. It is the wrong choice for anything that mostly calculates. Most web work is the former." },

  { h: "Running it" },
  { code: { lang: "javascript", t: "Three places to type JavaScript today",
    lines: [
     { c: "// 1. The browser console — F12, then Console", w: "Instant, no setup, and it operates on the page you are looking at. This is where you should experiment." },
     { c: "console.log(\"hello\");", w: "`console.log` is JavaScript's `print`. It is not part of the language — it is provided by the browser and by Node — which is why it does slightly different things in each." },
     { c: "", w: "" },
     { c: "// 2. A file loaded by a page", w: "" },
     { c: "// <script src=\"app.js\" defer></script>", w: "**`defer` matters.** Without it the browser stops parsing HTML to fetch and run the script, so the elements your code wants may not exist yet.", hi: true },
     { c: "", w: "" },
     { c: "// 3. Node, on the command line", w: "" },
     { c: "// $ node app.js", w: "The same language, no browser, no page. This is how build tools and servers run it." }
    ] } },

  { tryit: { t: "Read the console",
    task: "Open your browser's console on any page and type `document.title`, then `document.title = \"changed\"`. What happens, and what does that tell you about the relationship between JavaScript and the page?",
    hint: "Look at the browser tab after the second line.",
    sol: { lang: "javascript", code: "document.title            // the current title, as a string\ndocument.title = \"changed\"  // the tab title changes immediately\n\n// What it demonstrates:\n//\n// JavaScript does not 'generate' the page and hand it over. It has\n// a LIVE reference to the document, and assigning to a property\n// changes what is on screen at that instant.\n//\n// That is the whole model of front-end work: the page is an object\n// graph in memory, and your code mutates it. HTML is only the\n// initial state.\n\n// Refresh the page and the title reverts -- because nothing was\n// saved anywhere. The document is rebuilt from the HTML each load." },
    w: "This is the single most important mental shift from HTML/CSS to JavaScript: the page is not a document you produced, it is a live object you are holding. Everything in the DOM lesson follows from that." } }
 ],
 k: [
  "A browser runs JavaScript and nothing else — there is no alternative to choose.",
  "ECMAScript is the standard; ES6 (2015) is where the modern language begins.",
  "One thread and an event loop: excellent at waiting, poor at calculating.",
  "`console.log` comes from the environment, not the language.",
  "The page is a live object your code mutates, not a document it generates."
 ],
 r: ["JavaScript", "Node.js", "DOM"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "console.log(value);", w: "print something to the console" },
   { c: "<script src=\"app.js\" defer></script>", w: "load a script without blocking the parser", lang: "html" },
   { c: "document.title", w: "read a live property of the page" },
   { c: "node app.js", w: "run a file outside the browser", lang: "bash" },
   { c: "typeof value", w: "ask what kind of value this is" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Values, Variables and the Equality Trap",
 m: "syntax",
 lvl: "core",
 s: "let, const, the seven types, and why `==` is a rule you simply do not use.",
 goal: [
  "Choose between `const` and `let` without thinking",
  "Name the falsy values and predict what an `if` will do",
  "Explain why `==` is avoided and what `===` does differently"
 ],
 b: [
  { h: "Declaring things" },
  { code: { lang: "javascript", t: "Two keywords, and one you must never use",
    lines: [
     { c: "const name = \"Aryan\";", w: "**Default to this.** The binding cannot be reassigned. It is not a deep freeze — see the trap below." },
     { c: "let count = 0;", w: "Use when the value genuinely changes: a counter, an accumulator, a loop variable." },
     { c: "count = 1;", w: "Fine." },
     { c: "", w: "" },
     { c: "// name = \"Sam\";", w: "TypeError: Assignment to constant variable." },
     { c: "", w: "" },
     { c: "var old = 1;", w: "**The pre-2015 keyword. Do not use it.** It is function-scoped rather than block-scoped, which produces surprises `let` does not have. It exists in old code and in tutorials that have not been updated.", hi: true }
    ] } },

  { trap: "`const` freezes the *binding*, not the contents. `const list = []` means the name `list` can never point at a different array — but `list.push(1)` works perfectly, and so does changing any property of a `const` object. People read `const` as 'immutable' and are then surprised when an object changes underneath them. If you need real immutability, `Object.freeze()` gives you one shallow level." },

  { h: "The types" },
  { code: { lang: "javascript", t: "Seven primitives and one everything-else",
    lines: [
     { c: "typeof \"text\"      // \"string\"", w: "" },
     { c: "typeof 42          // \"number\"", w: "**One number type.** No separate integer — every number is a 64-bit float, which is why `0.1 + 0.2` is not `0.3` here either." },
     { c: "typeof true        // \"boolean\"", w: "" },
     { c: "typeof undefined   // \"undefined\"", w: "A variable that exists and has not been given a value." },
     { c: "typeof null        // \"object\"", w: "**A bug from 1995, preserved forever** because fixing it would break the web. `null` is not an object; the check is `x === null`.", hi: true },
     { c: "typeof 10n         // \"bigint\"", w: "For integers beyond the safe range of a float. Rare, but the reason exists." },
     { c: "typeof Symbol()    // \"symbol\"", w: "Unique keys. You will meet these before you write them." },
     { c: "", w: "" },
     { c: "typeof [1, 2]      // \"object\"", w: "Arrays are objects. Use `Array.isArray(x)` to test for one — `typeof` cannot tell you." },
     { c: "typeof (() => {})  // \"function\"", w: "Functions are objects too, but `typeof` gives them their own answer because it is useful." }
    ] } },

  { h: "Truthy, falsy, and the values that surprise" },
  { p: "Everything in JavaScript can be used in an `if`. The falsy values are a short, fixed list, and everything not on it is truthy." },

  { code: { lang: "javascript", t: "The complete falsy list — worth memorising",
    lines: [
     { c: "false, 0, -0, 0n, \"\", null, undefined, NaN", w: "That is all of them. Eight values." },
     { c: "", w: "" },
     { c: "if ([]) { }        // runs — an empty array is truthy", w: "**Different from Python**, where an empty list is falsy. This catches every Python developer exactly once.", hi: true },
     { c: "if ({}) { }        // runs — an empty object is truthy", w: "" },
     { c: "if (\"0\") { }       // runs — a non-empty string is truthy", w: "Even though `0` is falsy and `\"0\" == 0` is true. This is why `==` is a problem." }
    ] } },

  { h: "The equality rule" },
  { vs: { t: "Two equality operators, one answer", lang: "javascript",
    bad: { c: "0 == \"\"        // true\n0 == \"0\"       // true\n\"\" == \"0\"      // false\nnull == undefined  // true\n[] == false    // true\n[] == \"\"       // true", label: "== coerces, and is not transitive",
      w: "`==` converts the operands to a common type before comparing, following rules nobody memorises. Note rows one to three: the relation is not even transitive, which makes it impossible to reason about." },
    good: { c: "0 === \"\"       // false\n0 === \"0\"      // false\n\"\" === \"0\"     // false\nnull === undefined // false\n[] === false   // false\n[] === \"\"      // false", label: "=== compares type and value",
      w: "No conversion. Different types are never equal. Every answer here is the one you would predict, which is the entire argument." } } },

  { n: "The rule is simple and absolute: **always use `===` and `!==`.** The one accepted exception is `x == null`, which is true for both `null` and `undefined` and is a genuinely useful shorthand. Every linter enforces exactly this.",
    nt: "The rule" },

  { h: "The operators worth knowing early" },
  { code: { lang: "javascript", t: "Three that remove a lot of defensive code",
    lines: [
     { c: "const name = user?.profile?.name;", w: "**Optional chaining.** If `user` or `profile` is null or undefined, the whole expression is `undefined` instead of throwing. This replaces a nest of `if` checks." },
     { c: "", w: "" },
     { c: "const port = config.port ?? 8080;", w: "**Nullish coalescing.** Falls back only for `null` or `undefined`.", hi: true },
     { c: "const bad  = config.port || 8080;", w: "`||` falls back for *any* falsy value — so a configured port of `0`, or an empty string, is silently replaced. This is a real bug class, and `??` exists to fix it.", hi: true },
     { c: "", w: "" },
     { c: "const { name, age = 0 } = user;", w: "**Destructuring**, with a default. Pull properties out by name in one line." },
     { c: "const [first, ...rest] = items;", w: "The same for arrays. `...rest` collects everything remaining." }
    ] } },

  { tryit: { t: "Predict the output",
    task: "What does each of these print, and why? `console.log([] + [])`, `console.log([] + {})`, `console.log(0 || \"default\")`, `console.log(0 ?? \"default\")`",
    hint: "The `+` operator on two non-numbers converts both to strings. The last two differ on exactly one value.",
    sol: { lang: "javascript", code: "console.log([] + []);        // \"\"  (empty string)\n// Both arrays convert to strings. [].toString() is \"\", so\n// \"\" + \"\" is \"\". `+` has no array meaning, so it falls back\n// to string concatenation.\n\nconsole.log([] + {});        // \"[object Object]\"\n// [] becomes \"\", {} becomes \"[object Object]\".\n\nconsole.log(0 || \"default\"); // \"default\"\n// 0 is falsy, so || takes the right side. If 0 was a real\n// configured value -- a port, a timeout, a quantity -- it has\n// just been silently discarded. THIS IS THE BUG.\n\nconsole.log(0 ?? \"default\"); // 0\n// ?? only falls back for null/undefined. 0 is a real value and\n// survives. This is why ?? was added to the language.\n\n// The first two are trivia. The last two are a bug you will\n// write if you do not know the difference." },
    w: "The array coercions are the kind of thing people share to make JavaScript look absurd — and they are absurd, but you will never write them. The `||` versus `??` difference is the one that costs real time, and it appears in nearly every configuration file you will read." } }
 ],
 k: [
  "`const` by default, `let` when it changes, never `var`.",
  "`const` freezes the binding, not the contents — a const object can still be mutated.",
  "Eight falsy values; `[]` and `{}` are truthy, unlike Python.",
  "Always `===`. `==` coerces and is not even transitive.",
  "`??` falls back only for null/undefined; `||` also swallows `0` and `\"\"`."
 ],
 r: ["JavaScript", "Truthy and Falsy", "Variable"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "const name = \"Aryan\";", w: "declare something that will not be reassigned" },
   { c: "if (a === b) {", w: "compare without coercion" },
   { c: "const port = config.port ?? 8080;", w: "a default that survives a zero" },
   { c: "const name = user?.profile?.name;", w: "read through possibly-missing objects" },
   { c: "const { name, age = 0 } = user;", w: "destructure with a default" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Functions, Arrays and the Methods You Will Actually Use",
 m: "syntax",
 lvl: "core",
 s: "Arrow functions, map/filter/reduce, and the array methods that replace almost every loop.",
 goal: [
  "Write an arrow function and say how it differs from `function`",
  "Choose between map, filter, reduce, find and some",
  "Know which array methods mutate and which return a new array"
 ],
 b: [
  { h: "Two ways to write a function" },
  { code: { lang: "javascript", t: "The old form and the one you will mostly write",
    lines: [
     { c: "function add(a, b) {", w: "The classic form. Hoisted — you can call it above where it is defined." },
     { c: "  return a + b;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "const add = (a, b) => a + b;", w: "**Arrow function.** One expression, implicitly returned. This is the form you will read and write most.", hi: true },
     { c: "", w: "" },
     { c: "const greet = name => {", w: "One parameter needs no brackets. Multiple statements need braces — and then an explicit `return`." },
     { c: "  const upper = name.toUpperCase();", w: "" },
     { c: "  return `Hello, ${upper}`;", w: "**Template literal.** Backticks, and `${}` for interpolation. This is JavaScript's f-string." },
     { c: "};", w: "" }
    ] } },

  { n: "Arrow functions are not just shorter — they treat `this` differently, taking it from the surrounding scope instead of from how they are called. That difference is the subject of the next lesson, and it is the reason arrows are the default in modern code.",
    nt: "The real difference" },

  { h: "The array methods" },
  { p: "JavaScript's array methods replace almost every loop you would otherwise write, and reading them fluently is most of reading modern JavaScript." },

  { code: { lang: "javascript", t: "The five that cover nearly everything",
    lines: [
     { c: "const nums = [1, 2, 3, 4, 5];", w: "" },
     { c: "", w: "" },
     { c: "nums.map(n => n * 2)", w: "**Transform.** Same length out, every item changed. `[2,4,6,8,10]`" },
     { c: "nums.filter(n => n % 2 === 0)", w: "**Keep some.** Shorter array, items unchanged. `[2,4]`" },
     { c: "nums.reduce((sum, n) => sum + n, 0)", w: "**Fold to one value.** The `0` is the starting accumulator — omit it and an empty array throws.", hi: true },
     { c: "nums.find(n => n > 3)", w: "**First match, or undefined.** Stops as soon as it finds one. `4`" },
     { c: "nums.some(n => n > 4)", w: "**Any?** Short-circuits on the first true. `true`" },
     { c: "nums.every(n => n > 0)", w: "**All?** Short-circuits on the first false. `true`" }
    ] } },

  { p: "They chain, and chaining is how most real data work is written:" },

  { code: { lang: "javascript", t: "A pipeline, read left to right",
    lines: [
     { c: "const total = orders", w: "" },
     { c: "  .filter(o => o.status === \"paid\")", w: "Narrow first — every later step then does less work." },
     { c: "  .map(o => o.amount)", w: "" },
     { c: "  .reduce((a, b) => a + b, 0);", w: "One number out. Each step reads as a sentence, which is the point." }
    ] } },

  { h: "Mutating versus returning" },
  { trap: "Some array methods change the array in place and some return a new one, and the names give you no clue which. `sort` and `reverse` **mutate** — `const sorted = items.sort()` also reorders `items`, which surprises people and quietly corrupts data someone else was holding. `map`, `filter` and `slice` return new arrays and leave the original alone." },

  { tbl: { t: "The ones worth knowing by category",
    h: ["Mutates the original", "Returns a new array"],
    rows: [
     ["`push`, `pop`, `shift`, `unshift`", "`map`, `filter`, `slice`, `concat`"],
     ["`sort`, `reverse`, `splice`", "`toSorted`, `toReversed`, `toSpliced` (2023+)"],
     ["`fill`, `copyWithin`", "`flat`, `flatMap`, `with`"]
    ] } },

  { code: { lang: "javascript", t: "Sorting without destroying the original",
    lines: [
     { c: "const sorted = [...items].sort();", w: "Spread into a new array first. This is the standard idiom, and it works everywhere." },
     { c: "const sorted = items.toSorted();", w: "The 2023 method that does it directly. Cleaner, but check your target environments support it." },
     { c: "", w: "" },
     { c: "[10, 9, 1].sort()", w: "`[1, 10, 9]`. **`sort` converts to strings by default**, so numbers sort alphabetically. This is a genuine design mistake and it catches everyone.", hi: true },
     { c: "[10, 9, 1].sort((a, b) => a - b)", w: "`[1, 9, 10]`. Always pass a comparator for numbers. Negative means a comes first." }
    ] } },

  { tryit: { t: "Write the pipeline",
    task: "Given an array of `{ name, score, passed }` objects, produce the average score of the students who passed, rounded to one decimal place — and return 0 rather than NaN if nobody passed.",
    hint: "Filter, map, reduce. The empty case is what the exercise is really testing.",
    sol: { lang: "javascript", code: "const average = (students) => {\n  const scores = students\n    .filter(s => s.passed)\n    .map(s => s.score);\n\n  if (scores.length === 0) return 0;\n\n  const total = scores.reduce((a, b) => a + b, 0);\n  return Math.round((total / scores.length) * 10) / 10;\n};\n\n// The empty case is the whole exercise. Without the guard:\n//   [].reduce((a, b) => a + b, 0)  ->  0     (fine, we passed 0)\n//   0 / 0                          ->  NaN   (the bug)\n//\n// And NaN is the worst possible failure value, because it\n// propagates silently -- every later calculation involving it\n// becomes NaN, and nothing throws. You find out at the UI.\n\n// Also note: Math.round(x * 10) / 10 rather than toFixed(1),\n// because toFixed returns a STRING and you will do arithmetic\n// on it later and get concatenation." },
    w: "Two traps in one small function: dividing by zero gives `NaN` rather than an error, and `toFixed` returns a string. Both fail silently and surface far from the cause, which is the shape of most real JavaScript bugs." } }
 ],
 k: [
  "`const f = (a, b) => a + b` is the form you will read most.",
  "Template literals use backticks and `${}` — JavaScript's f-string.",
  "map transforms, filter narrows, reduce folds to one value; they chain.",
  "`sort` and `reverse` mutate — spread into a new array first, or use `toSorted`.",
  "`sort()` compares as strings by default; always pass `(a, b) => a - b` for numbers."
 ],
 r: ["JavaScript", "Higher-Order Function", "Array", "Closure"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "const add = (a, b) => a + b;", w: "an arrow function returning one expression" },
   { c: "items.filter(x => x.active)", w: "keep only the matching items" },
   { c: "items.reduce((sum, x) => sum + x.n, 0)", w: "fold a list into one number" },
   { c: "const sorted = [...items].sort((a, b) => a - b);", w: "sort numbers without mutating" },
   { c: "return `Hello, ${name}`;", w: "a template literal with interpolation" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Scope, Closures and the Truth About `this`",
 m: "funcs",
 lvl: "intermediate",
 s: "The mechanism behind half of JavaScript — and the keyword that behaves differently depending on how you call a function.",
 goal: [
  "Explain what a closure captures and why it stays alive",
  "Predict what `this` refers to in a given call",
  "Say why arrow functions fixed the most common `this` bug"
 ],
 b: [
  { p: "Closures are not an advanced topic in JavaScript — they are the ordinary way things work, and you have been using them since your first event handler. Understanding them explicitly is what makes callbacks, module patterns and React hooks stop being mysterious." },

  { h: "A closure is a function plus where it was born" },
  { code: { lang: "javascript", t: "The counter that has no global variable",
    lines: [
     { c: "function makeCounter() {", w: "" },
     { c: "  let count = 0;", w: "A local variable. Normally it would vanish when the function returns." },
     { c: "", w: "" },
     { c: "  return () => {", w: "But this inner function *references* it..." },
     { c: "    count += 1;", w: "" },
     { c: "    return count;", w: "" },
     { c: "  };", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "const next = makeCounter();", w: "`makeCounter` has returned, but `count` survives — because the returned function still holds it.", hi: true },
     { c: "next();  // 1", w: "" },
     { c: "next();  // 2", w: "" },
     { c: "", w: "" },
     { c: "const other = makeCounter();", w: "" },
     { c: "other(); // 1", w: "**A separate closure with its own `count`.** Each call to `makeCounter` creates a new private variable." }
    ] } },

  { ana: "A function is a recipe; a closure is a recipe that came with its own pantry. You cannot reach into that pantry from outside, and it stays stocked for as long as the recipe exists — even after the kitchen it was written in has closed.",
    at: "The recipe and the pantry" },

  { p: "That privacy is the point. `count` cannot be read or modified except through the returned function, which is real encapsulation without a class." },

  { h: "The classic closure bug" },
  { vs: { t: "Three buttons that all report the same number", lang: "javascript",
    bad: { c: "for (var i = 0; i < 3; i++) {\n  buttons[i].onclick = () => {\n    console.log(i);\n  };\n}\n\n// every button logs 3", label: "With var",
      w: "`var` is function-scoped, so all three handlers close over **the same** `i`. By the time any of them runs, the loop has finished and `i` is 3." },
    good: { c: "for (let i = 0; i < 3; i++) {\n  buttons[i].onclick = () => {\n    console.log(i);\n  };\n}\n\n// buttons log 0, 1, 2", label: "With let",
      w: "`let` is block-scoped and gets a **fresh binding each iteration**, so each handler closes over its own `i`. This is the single best argument for `let` over `var`, and it is why the fix is one word." } } },

  { n: "If you have met Python's late-binding closure bug — where `[lambda: i for i in range(3)]` gives three functions all returning 2 — this is the same mechanism, and JavaScript fixed it at the language level with `let`. Python has no equivalent fix; you still bind with a default argument.",
    nt: "The same bug, in two languages" },

  { h: "`this`, and why it is confusing" },
  { p: "In most languages `this` means *the object whose method is running*. In JavaScript it means *whatever the function was called on*, decided at call time rather than where the function was written. Same function, different `this`, depending purely on how you invoke it." },

  { code: { lang: "javascript", t: "Four calls, four values of this",
    lines: [
     { c: "const user = {", w: "" },
     { c: "  name: \"Aryan\",", w: "" },
     { c: "  greet() { return this.name; }", w: "" },
     { c: "};", w: "" },
     { c: "", w: "" },
     { c: "user.greet();          // \"Aryan\"", w: "Called *on* `user`, so `this` is `user`." },
     { c: "", w: "" },
     { c: "const fn = user.greet;", w: "" },
     { c: "fn();                  // undefined", w: "**The same function, detached.** Nothing is to the left of the call, so `this` is not `user`. This is the bug people hit when passing a method as a callback.", hi: true },
     { c: "", w: "" },
     { c: "fn.call(user);         // \"Aryan\"", w: "`call` sets `this` explicitly." },
     { c: "const bound = fn.bind(user);", w: "`bind` returns a new function with `this` locked in permanently." },
     { c: "bound();               // \"Aryan\"", w: "" }
    ] } },

  { h: "Why arrows fixed it" },
  { code: { lang: "javascript", t: "The bug that made arrow functions necessary",
    lines: [
     { c: "const timer = {", w: "" },
     { c: "  seconds: 0,", w: "" },
     { c: "  start() {", w: "" },
     { c: "    setInterval(function () {", w: "**Broken.** A plain function called by `setInterval` has its own `this`, which is not `timer`." },
     { c: "      this.seconds++;", w: "Increments a property on the wrong object. No error — it silently does nothing useful." },
     { c: "    }, 1000);", w: "" },
     { c: "", w: "" },
     { c: "    setInterval(() => {", w: "**Correct.** An arrow function has no `this` of its own; it uses the one from where it was written — which is `start`, where `this` is `timer`.", hi: true },
     { c: "      this.seconds++;", w: "" },
     { c: "    }, 1000);", w: "" },
     { c: "  }", w: "" },
     { c: "};", w: "" }
    ],
    after: "Before arrows, the standard workaround was `const self = this;` on the first line of the method, and then using `self` inside the callback. You will still see that in older code, and now you know what it was working around." } },

  { trap: "Because an arrow takes `this` from its surroundings, it is the wrong choice for an object method: `const obj = { name: 'x', greet: () => this.name }` does not work, because there is no enclosing method to inherit from. The rule: **arrows for callbacks, `function` or shorthand for methods.**" },

  { tryit: { t: "Fix the handler",
    task: "This class logs `undefined` instead of the label when the button is clicked. Why, and give two fixes.\n\n`class Btn { constructor(l) { this.label = l } attach(el) { el.onclick = function () { console.log(this.label) } } }`",
    hint: "What is `this` inside a plain function that the browser calls as an event handler?",
    sol: { lang: "javascript", code: "// When the browser fires an event handler written as a plain\n// function, it calls it with `this` set to the ELEMENT, not to\n// your instance. el.label is undefined, so it logs undefined.\n\n// Fix 1 -- an arrow function inherits `this` from attach():\nclass Btn {\n  constructor(label) { this.label = label; }\n  attach(el) {\n    el.onclick = () => console.log(this.label);\n  }\n}\n\n// Fix 2 -- bind explicitly. Useful when you need a named\n// handler you can later remove:\nclass Btn {\n  constructor(label) {\n    this.label = label;\n    this.handle = this.handle.bind(this);\n  }\n  handle() { console.log(this.label); }\n  attach(el) { el.addEventListener(\"click\", this.handle); }\n}\n\n// Fix 2 is the version you need for removeEventListener, because\n// an inline arrow creates a new function every time and you\n// cannot pass the same reference back to remove it." },
    w: "The second fix matters more than it looks: `removeEventListener` needs the *same function reference* you added. An inline arrow is a new object each render, so handlers added that way can never be removed — a real memory-leak source in long-lived pages." } }
 ],
 k: [
  "A closure is a function plus the variables it was born with — they stay alive.",
  "`let` gives a fresh binding per loop iteration; `var` does not, which is the classic bug.",
  "`this` is decided by how a function is *called*, not where it is written.",
  "Arrow functions have no `this` of their own — they inherit it from the surrounding scope.",
  "Arrows for callbacks; `function` or method shorthand for object methods."
 ],
 r: ["Closure", "Scope", "JavaScript", "Callback"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "for (let i = 0; i < 3; i++) {", w: "a loop whose closures capture separately" },
   { c: "el.onclick = () => console.log(this.label);", w: "a handler that keeps the surrounding this" },
   { c: "this.handle = this.handle.bind(this);", w: "lock this into a named handler" },
   { c: "const self = this;", w: "the pre-arrow workaround you will see in old code" },
   { c: "return () => { count += 1; return count; };", w: "return a closure over a private variable" }
  ]
 }
}

]);
