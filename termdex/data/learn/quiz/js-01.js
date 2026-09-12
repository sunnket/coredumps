/* JavaScript & TypeScript — question bank.

   Weighted towards the things that cause real bugs rather than trivia. The
   coercion questions are here because `||` versus `??` and `===` versus `==`
   appear in production code constantly; the array-coercion party tricks are
   deliberately absent, because nobody writes them. */

TD.addMCQ("js", "syntax", [
  {
    "tag": "const is not immutable",
    "lvl": "core",
    "q": "`const config = { retries: 3 };` — which of these throws?",
    "o": [
      "config.retries = 5;",
      "config = { retries: 5 };",
      "Object.keys(config);",
      "None of them throw"
    ],
    "a": 1,
    "x": "`const` freezes the binding, not the contents. Reassigning the variable itself is a TypeError; mutating a property of the object it points at is perfectly legal. This is why people are surprised when a `const` object changes underneath them — `Object.freeze()` is what prevents that, and only one level deep."
  },
  {
    "tag": "Falsy values",
    "lvl": "core",
    "q": "Which of these is truthy in JavaScript?",
    "o": [
      "0",
      "[]",
      "\"\"",
      "NaN"
    ],
    "a": 1,
    "x": "An empty array is truthy — it is an object, and all objects are truthy. This differs from Python, where an empty list is falsy, and it catches every Python developer exactly once. The complete falsy list is: false, 0, -0, 0n, \"\", null, undefined, NaN. Everything else is truthy."
  },
  {
    "tag": "Nullish coalescing",
    "lvl": "intermediate",
    "q": "`const port = config.port || 8080;` — what bug does this contain, and what fixes it?",
    "o": [
      "It throws if config is undefined; use optional chaining",
      "A configured port of 0 is falsy and silently replaced by 8080; use ?? instead of ||",
      "It compares types incorrectly; use ===",
      "There is no bug"
    ],
    "a": 1,
    "x": "`||` falls back for any falsy value, so a legitimate `0` — or an empty string, for a configured prefix — is discarded. `??` falls back only for `null` and `undefined`, which is almost always what you meant. This is exactly why `??` was added to the language, and the bug appears in configuration handling constantly."
  },
  {
    "tag": "Equality",
    "lvl": "core",
    "q": "Why is `==` avoided in favour of `===`?",
    "o": [
      "`==` is slower at runtime",
      "`==` coerces operands to a common type using rules that are not even transitive — 0 == \"\" and 0 == \"0\" are both true, but \"\" == \"0\" is false",
      "`==` does not work on objects",
      "`===` is required by newer ECMAScript versions"
    ],
    "a": 1,
    "x": "Non-transitivity is the decisive argument: if a relation can hold between A and B, and between A and C, but not between B and C, it cannot be reasoned about. `===` compares type and value with no conversion, so every result is the one you would predict. The single accepted exception is `x == null`, which conveniently matches both null and undefined."
  },
  {
    "tag": "typeof null",
    "lvl": "intermediate",
    "q": "`typeof null` returns \"object\". How should you actually test for null?",
    "o": [
      "typeof x === \"null\"",
      "x === null",
      "x == undefined",
      "Object.isNull(x)"
    ],
    "a": 1,
    "x": "`typeof null === \"object\"` is a bug from the original 1995 implementation, preserved because fixing it would break existing sites. Use `x === null` for null specifically, or `x == null` when you want to catch both null and undefined — the one place loose equality is idiomatic."
  },
  {
    "tag": "Array sort",
    "lvl": "intermediate",
    "q": "`[10, 9, 1].sort()` returns `[1, 10, 9]`. Why, and what is the fix?",
    "o": [
      "The array was already partially sorted; call sort() twice",
      "sort() converts elements to strings by default, so \"10\" sorts before \"9\" — pass a comparator: sort((a, b) => a - b)",
      "sort() only works on arrays of length 4 or more",
      "The numbers must be wrapped in Number() first"
    ],
    "a": 1,
    "x": "Default `sort` performs string comparison, so \"10\" < \"9\" lexicographically. A comparator returning a negative number means the first argument comes first, which makes `(a, b) => a - b` the standard numeric sort. `sort` also mutates the original array — use `[...items].sort()` or `toSorted()` to avoid that."
  }
]);

TD.addMCQ("js", "funcs", [
  {
    "tag": "Closures in a loop",
    "lvl": "intermediate",
    "q": "A loop attaches click handlers that each log `i`. With `var i`, every button logs 3. With `let i`, they log 0, 1, 2. Why?",
    "o": [
      "let is faster and completes before the handlers attach",
      "var is function-scoped so all handlers close over one shared binding; let is block-scoped and creates a fresh binding each iteration",
      "let automatically binds the value with .bind()",
      "var hoists the handlers above the loop"
    ],
    "a": 1,
    "x": "With `var` there is exactly one `i` for the whole function, and by the time any handler runs the loop has finished, leaving it at 3. `let` creates a new binding per iteration, so each closure captures its own. This is the single strongest argument for `let` over `var`, and the same mechanism as Python's late-binding closure bug — which Python has no language-level fix for."
  },
  {
    "tag": "this in a detached method",
    "lvl": "intermediate",
    "q": "`const fn = user.greet; fn();` returns undefined even though `user.greet()` works. Why?",
    "o": [
      "Assigning a method to a variable copies it incorrectly",
      "`this` is determined by how a function is called, not where it is defined — with nothing to the left of the call, `this` is not `user`",
      "greet must be declared with the function keyword",
      "The variable needs to be declared with let"
    ],
    "a": 1,
    "x": "JavaScript binds `this` at call time from the call site, not lexically from the definition. `user.greet()` has `user` to the left of the dot; a bare `fn()` has nothing. This is the bug people hit when passing a method as a callback, and the fixes are `fn.bind(user)`, an arrow wrapper, or making the method an arrow-valued class field."
  },
  {
    "tag": "Arrow functions and this",
    "lvl": "intermediate",
    "q": "Why does an arrow function fix the classic `setInterval` / `this` bug?",
    "o": [
      "Arrow functions run synchronously",
      "An arrow has no `this` of its own, so it uses the `this` from the scope where it was written",
      "Arrow functions automatically call .bind(this)",
      "setInterval treats arrow functions differently"
    ],
    "a": 1,
    "x": "An arrow function does not create its own `this` binding at all, so the identifier resolves lexically to the enclosing scope — which inside a method is the object. This is why the pre-2015 workaround was `const self = this;` before the callback. It also means an arrow is the wrong choice *for* an object method, since there is then no enclosing method to inherit from."
  },
  {
    "tag": "removeEventListener",
    "lvl": "advanced",
    "q": "Why can a handler added as an inline arrow function never be removed with removeEventListener?",
    "o": [
      "Arrow functions cannot be removed by design",
      "removeEventListener needs the same function reference that was added, and an inline arrow creates a new function object every time",
      "The event type must match exactly, which arrows prevent",
      "Inline handlers are added to a different phase"
    ],
    "a": 1,
    "x": "Removal is by identity, not by content. `el.addEventListener(\"click\", () => f())` then `el.removeEventListener(\"click\", () => f())` passes two distinct function objects that merely look alike. Store the handler in a variable (or a bound method) and pass that same reference to both calls. This is a genuine memory-leak source in long-lived pages."
  }
]);

TD.addMCQ("js", "dom", [
  {
    "tag": "XSS via innerHTML",
    "lvl": "core",
    "q": "Displaying a user-submitted comment with `el.innerHTML = comment` is a security vulnerability. Which one, and what is the fix?",
    "o": [
      "SQL injection; escape the quotes",
      "Cross-site scripting — the browser parses and executes any markup in the string; use el.textContent instead",
      "CSRF; add a token",
      "There is no vulnerability if the server validated the input"
    ],
    "a": 1,
    "x": "`innerHTML` parses the string as HTML, so `<img src=x onerror=\"...\">` executes. `textContent` inserts the string as text with no parsing, so there is nothing to exploit. The rule: `innerHTML` only for markup you wrote yourself — the moment any part came from a user, a database or an API, use `textContent` or `createElement`."
  },
  {
    "tag": "Event delegation",
    "lvl": "intermediate",
    "q": "Why attach one click listener to a list container rather than one to each row?",
    "o": [
      "Listeners on children are ignored by the browser",
      "One listener instead of many, and it keeps working for rows added after the listener was attached",
      "Container listeners fire before child listeners",
      "It avoids the need for preventDefault"
    ],
    "a": 1,
    "x": "Events bubble up from the target, so a container listener sees clicks on any descendant — including elements created later, which per-row listeners would miss entirely. `event.target.closest(selector)` finds the row that was clicked. This is the standard pattern for any dynamically rendered list."
  },
  {
    "tag": "querySelector returning null",
    "lvl": "core",
    "q": "`Cannot read properties of null (reading 'textContent')` immediately after a querySelector. What is the usual cause?",
    "o": [
      "The element has display:none",
      "The selector matched nothing — commonly because the script ran before the element existed in the DOM",
      "textContent is not a valid property",
      "The element is inside a different stylesheet scope"
    ],
    "a": 1,
    "x": "`querySelector` returns null when nothing matches, and property access on null throws. The most common cause is a script tag in the head without `defer`, so it executes before the body is parsed. Add `defer`, or guard with `if (!el) return;` where the element is genuinely optional."
  }
]);

TD.addMCQ("js", "async", [
  {
    "tag": "Event loop ordering",
    "lvl": "advanced",
    "q": "What order do these log?\n`console.log(\"1\"); setTimeout(() => console.log(\"2\"), 0); Promise.resolve().then(() => console.log(\"3\")); console.log(\"4\");`",
    "o": [
      "1, 2, 3, 4",
      "1, 4, 3, 2",
      "1, 4, 2, 3",
      "1, 3, 4, 2"
    ],
    "a": 1,
    "x": "Synchronous code first: 1 and 4. Then the stack empties, and the microtask queue (promises) is drained completely before a single macrotask (setTimeout) is taken — so 3 precedes 2. `setTimeout(fn, 0)` means 'as soon as possible after current work', never 'now'."
  },
  {
    "tag": "Sequential awaits",
    "lvl": "intermediate",
    "q": "Three independent fetches, each ~300ms, awaited on consecutive lines take 900ms. What is the fix and what does it change?",
    "o": [
      "Use .then() chains instead — they are faster than await",
      "Promise.all([a(), b(), c()]) — all three requests start before any is awaited, so the total is the slowest rather than the sum",
      "Increase the browser's connection limit",
      "Move the awaits into a for loop"
    ],
    "a": 1,
    "x": "Each `await` suspends until the previous promise settles, so independent work runs in series for no reason. Calling the functions inside `Promise.all` starts all three immediately; the await then waits for the slowest. This is the most common performance bug in async JavaScript — though at large N, bounded concurrency beats unlimited parallelism."
  },
  {
    "tag": "Promise.all versus allSettled",
    "lvl": "intermediate",
    "q": "You fetch 20 records and want every successful result even if some fail. Which combinator?",
    "o": [
      "Promise.all — it returns all results",
      "Promise.allSettled — it waits for every promise and reports {status, value} or {status, reason} per item",
      "Promise.race",
      "Promise.any"
    ],
    "a": 1,
    "x": "`Promise.all` rejects as soon as any one promise rejects, discarding the successful results you already had. `allSettled` never rejects: it waits for all of them and reports each outcome individually, which is what you want whenever partial success is useful. `race` gives the first to settle; `any` the first to succeed."
  },
  {
    "tag": "async return value",
    "lvl": "core",
    "q": "`const user = loadUser();` where loadUser is async. Why is `user.name` undefined?",
    "o": [
      "loadUser needs a return statement",
      "An async function always returns a promise, not the resolved value — the call must be awaited or .then()'d",
      "user must be declared with let",
      "The property is named differently"
    ],
    "a": 1,
    "x": "Marking a function `async` wraps whatever it returns in a promise. `user` is therefore a pending Promise object, which has no `name` property. Either `const user = await loadUser()` inside an async function, or `loadUser().then(u => ...)`. Forgetting the await is one of the most frequent beginner errors and produces `undefined` rather than an error."
  }
]);

TD.addMCQ("js", "fetch", [
  {
    "tag": "fetch and HTTP errors",
    "lvl": "intermediate",
    "q": "A fetch to an endpoint returning 404 does not enter the catch block. Why?",
    "o": [
      "The catch must be attached with .catch() not try/catch",
      "fetch rejects only on network failure — an HTTP error status is a successful round trip, so you must check res.ok yourself",
      "404 responses are cached and skipped",
      "The response body must be read before the status is available"
    ],
    "a": 1,
    "x": "From fetch's perspective the request left, the server answered, and the promise resolves. Only a network-level failure — DNS, connection dropped, CORS block — rejects. Always check `if (!res.ok) throw ...`, where `ok` is true for 200–299. This is the single most common fetch bug, and it lets an error page flow through your code as if it were data."
  },
  {
    "tag": "fetch timeouts",
    "lvl": "advanced",
    "q": "How do you give a fetch request a 5-second timeout?",
    "o": [
      "Pass { timeout: 5000 } in the options object",
      "Use an AbortController and call controller.abort() from a setTimeout, passing controller.signal to fetch",
      "Wrap it in Promise.race with a rejecting promise — there is no other way",
      "Set the server's Keep-Alive header"
    ],
    "a": 1,
    "x": "`fetch` has no timeout option. `AbortController` is the built-in mechanism: pass its `signal` to fetch and call `abort()` on a timer. The rejection has `err.name === \"AbortError\"`, which you should distinguish from a genuine failure. The same controller also cancels requests when a user navigates away or types a newer query."
  },
  {
    "tag": "CORS",
    "lvl": "intermediate",
    "q": "A fetch fails with 'blocked by CORS policy: No Access-Control-Allow-Origin header'. Where can this be fixed?",
    "o": [
      "In your JavaScript, by adding the header to the request",
      "On the server being called, or by proxying the call through your own backend — the browser enforces it and your code cannot override it",
      "By using XMLHttpRequest instead of fetch",
      "By setting mode: 'no-cors' to get the response"
    ],
    "a": 1,
    "x": "CORS is enforced by the browser to protect users: without it, any page could read your logged-in responses from other sites. The request usually reached the server and got a reply — the browser then refused to hand it to your code. Only the server can permit your origin, or you call it from a backend where no browser is involved. `mode: 'no-cors'` returns an opaque response you cannot read."
  }
]);

TD.addMCQ("js", "modern", [
  {
    "tag": "Lockfiles",
    "lvl": "intermediate",
    "q": "Why commit package-lock.json when package.json already lists versions?",
    "o": [
      "It makes npm install faster",
      "package.json allows ranges like ^18.3.1, so two installs a week apart can resolve to different versions — including across hundreds of transitive dependencies",
      "It is required for TypeScript projects",
      "It stores authentication tokens for private packages"
    ],
    "a": 1,
    "x": "The caret permits any compatible later version, and that applies to every transitive dependency too — a project with 40 direct dependencies typically resolves 800+. The lockfile records exactly what was installed, with integrity hashes. Use `npm ci` in CI, which installs from the lockfile only and fails if it disagrees with package.json."
  },
  {
    "tag": "Named versus default exports",
    "lvl": "core",
    "q": "What is the practical argument for preferring named exports over a default export?",
    "o": [
      "Default exports are slower to bundle",
      "A default export can be imported under any name, so searching a codebase for its usages becomes guesswork and editors autocomplete less reliably",
      "Default exports cannot be tree-shaken",
      "Only one named export is allowed per file"
    ],
    "a": 1,
    "x": "With `import Whatever from './x'`, three files can refer to the same thing by three different names. Named exports force the identifier to match, which makes grep, rename-refactoring and auto-import all work correctly. The extra braces are a small price for a codebase that can be searched."
  },
  {
    "tag": "What a bundler does",
    "lvl": "core",
    "q": "Which of these is NOT something a bundler like Vite or Webpack does?",
    "o": [
      "Combining many modules into fewer files to reduce requests",
      "Executing your server-side database queries at build time",
      "Removing exports that nothing imports (tree shaking)",
      "Compiling TypeScript and JSX into plain JavaScript"
    ],
    "a": 1,
    "x": "A bundler operates on your source files: bundling, tree shaking, transpiling, minifying and content-hashing filenames so caches invalidate correctly on deploy. It has no runtime connection to a database. Understanding what it does is what makes an unfamiliar config file legible rather than intimidating."
  }
]);

TD.addMCQ("js", "ts", [
  {
    "tag": "Types at runtime",
    "lvl": "advanced",
    "q": "`const user: User = await res.json();` compiles cleanly but user.name is undefined in production. Why?",
    "o": [
      "The await was misplaced",
      "TypeScript types are erased at compile time — the annotation asserts a shape without checking it, so an API that changed its response is not caught",
      "User must be a class rather than an interface",
      "res.json() returns a string that needs parsing"
    ],
    "a": 1,
    "x": "`res.json()` returns `any`, and annotating the variable merely silences the compiler. Nothing verifies the actual shape at runtime, so a changed API produces undefined fields that surface far from the cause. The rule is validate at the boundary — with a runtime schema library such as Zod — and trust types only inside your own code."
  },
  {
    "tag": "any versus unknown",
    "lvl": "intermediate",
    "q": "What is the difference between `any` and `unknown`?",
    "o": [
      "They are identical; unknown is just newer",
      "`any` disables checking entirely and allows any operation; `unknown` accepts any value but forces you to narrow the type before using it",
      "`unknown` can only hold objects",
      "`any` is a runtime check and unknown is compile-time"
    ],
    "a": 1,
    "x": "`any` is a hole in the type system — every operation on it is permitted and unchecked, and it spreads through the code that touches it. `unknown` is the safe top type: you can assign anything to it, but you must narrow with a typeof check, an instanceof, or a schema parse before doing anything with it. Prefer `unknown` at every boundary."
  },
  {
    "tag": "Discriminated unions",
    "lvl": "advanced",
    "q": "Why does `type Result = { ok: true; data: User } | { ok: false; error: string }` let TypeScript know which fields exist inside `if (result.ok)`?",
    "o": [
      "TypeScript infers it from the variable name",
      "The literal-typed `ok` field discriminates the union, so a check on it narrows the type within each branch",
      "Both branches must declare all fields as optional",
      "It only works if User is a class"
    ],
    "a": 1,
    "x": "The shared field with distinct literal types is the discriminant. Testing it eliminates one branch, so inside `if (result.ok)` the compiler knows `data` exists and `error` does not — accessing `result.error` there is an error. This is the standard way to model success-or-failure without exceptions, and it makes the failure case impossible to forget."
  }
]);

TD.addMCQ("js", "react", [
  {
    "tag": "Stale state in a batch",
    "lvl": "advanced",
    "q": "Calling `setCount(count + 1)` twice in one handler increments by 1, not 2. What is the fix?",
    "o": [
      "Wrap both calls in a setTimeout",
      "Use the functional form: setCount(c => c + 1), which receives the latest value rather than the one captured at render",
      "Call the second one inside useEffect",
      "Declare count with useRef instead"
    ],
    "a": 1,
    "x": "Both calls read `count` from the closure of the current render, where it has one value — updates are batched and the variable does not change until the next render. The updater form is passed the most recent pending state, so the two compose correctly. Use it whenever the new state derives from the old."
  },
  {
    "tag": "Derived state",
    "lvl": "advanced",
    "q": "A component keeps `items` in state and uses useEffect to recompute a `total` into another state variable whenever items change. What is wrong with this?",
    "o": [
      "useEffect cannot depend on arrays",
      "Derived values should be calculated during render, not stored — the effect causes an extra render and creates a second source of truth that can disagree",
      "The dependency array should be empty",
      "total should be stored in a ref"
    ],
    "a": 1,
    "x": "This renders with a stale total, runs the effect, then renders again — slower, briefly wrong on screen, and now two pieces of state that can drift apart. `const total = items.reduce(...)` during render is simpler and always correct. `useEffect` is for synchronising with things outside React; reach for `useMemo` only when profiling shows the calculation is genuinely expensive."
  },
  {
    "tag": "Effect cleanup",
    "lvl": "advanced",
    "q": "What does returning a function from useEffect do, and why does a fetch usually need one?",
    "o": [
      "It memoises the effect's result",
      "It is the cleanup, run before the effect re-runs and on unmount — for a fetch it aborts the request, so a late response cannot set state on a component that is gone",
      "It determines the dependency array",
      "It converts the effect to synchronous"
    ],
    "a": 1,
    "x": "Without cleanup, a response arriving after the user navigated away calls setState on an unmounted component — a leak, and in a rapid-navigation case a race where an older response overwrites a newer one. `return () => controller.abort()` handles both. The same pattern applies to subscriptions, timers and event listeners."
  },
  {
    "tag": "Infinite render loop",
    "lvl": "advanced",
    "q": "A component fetches in a useEffect and the network tab shows endless requests. What is the most likely cause?",
    "o": [
      "The API is returning a redirect",
      "The effect has no dependency array, so it runs after every render — and because it sets state, it triggers the next render",
      "React StrictMode double-invokes effects",
      "The fetch is missing an await"
    ],
    "a": 1,
    "x": "Omitting the dependency array entirely means 'run after every render'. Combined with a setState inside, that is a self-sustaining loop. The second most common variant is an object or array literal in the array — `[{ id }]` creates a new object each render, so the reference comparison always fails. Depend on primitives."
  },
  {
    "tag": "List keys",
    "lvl": "intermediate",
    "q": "Why is using the array index as a React `key` a problem for a list that can be reordered or filtered?",
    "o": [
      "Indexes are strings and keys must be numbers",
      "Indexes shift when items are added or removed, so React reuses the wrong DOM nodes — visibly, text typed into an input can jump to a different row",
      "React ignores numeric keys entirely",
      "It prevents the list from re-rendering at all"
    ],
    "a": 1,
    "x": "Keys tell React which element corresponds to which item across renders. If item 0 is deleted, every subsequent index shifts down, so React matches the wrong component instances to the wrong data — preserving state such as input values or focus in the wrong place. A stable id from the data is correct; the index is acceptable only for a list that never changes order."
  }
]);
