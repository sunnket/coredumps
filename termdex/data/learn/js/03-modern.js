/* JavaScript — modules, tooling, TypeScript and React.

   The part of the ecosystem that is genuinely large, taught by explaining what
   each tool is FOR rather than listing its options. A beginner does not need
   to configure a bundler; they need to know why one exists, so that when they
   meet a config file it is not frightening. */

TD.addLessons("js", [

/* ==================================================================== */
{
 t: "Modules, npm and What a Bundler Does",
 m: "modern",
 lvl: "intermediate",
 s: "import/export, the package that changed everything, and the build step nobody explains.",
 goal: [
  "Split code across files with import and export",
  "Read a package.json and know what node_modules actually is",
  "Say what a bundler does and why the browser needs one"
 ],
 b: [
  { h: "Modules" },
  { p: "Before 2015 every script shared one global namespace, and the way to avoid collisions was to wrap everything in a function. Modules fixed that: each file has its own scope, and you say explicitly what leaves it and what enters." },

  { code: { lang: "javascript", file: "math.js", t: "Two kinds of export",
    lines: [
     { c: "export function add(a, b) { return a + b; }", w: "**Named export.** A file may have many." },
     { c: "export const PI = 3.14159;", w: "" },
     { c: "", w: "" },
     { c: "export default class Calculator { }", w: "**Default export.** At most one per file. The importer chooses its own name for it, which is why default exports make a codebase harder to search." }
    ] } },

  { code: { lang: "javascript", file: "app.js", t: "And importing them",
    lines: [
     { c: "import Calculator from \"./math.js\";", w: "The default. No braces, and the name is yours to pick." },
     { c: "import { add, PI } from \"./math.js\";", w: "Named. **Braces, and the names must match** what was exported.", hi: true },
     { c: "import { add as sum } from \"./math.js\";", w: "Renaming on import, when two modules export the same name." },
     { c: "import * as math from \"./math.js\";", w: "Everything as one object: `math.add(1, 2)`." },
     { c: "", w: "" },
     { c: "const { render } = await import(\"./heavy.js\");", w: "**Dynamic import.** Loads only when this line runs, which is how you keep a rarely-used feature out of the initial download.", hi: true }
    ] } },

  { n: "Named exports over default, as a habit. With a default, three files can import the same thing under three different names, and searching for usages becomes guesswork. Named exports also let an editor autocomplete and auto-import correctly, which matters more day to day than the extra braces cost.",
    nt: "Prefer named exports" },

  { h: "npm and package.json" },
  { code: { lang: "json", file: "package.json", t: "The file that defines a project",
    lines: [
     { c: "{", w: "" },
     { c: "  \"name\": \"my-app\",", w: "" },
     { c: "  \"type\": \"module\",", w: "**Opts into `import`/`export` in Node.** Without it, Node expects the older `require()` syntax and your imports fail with a confusing error.", hi: true },
     { c: "  \"scripts\": {", w: "" },
     { c: "    \"dev\": \"vite\",", w: "Run with `npm run dev`. Scripts are the project's documented commands — read this section first in any repository you are handed." },
     { c: "    \"build\": \"vite build\",", w: "" },
     { c: "    \"test\": \"vitest\"", w: "" },
     { c: "  },", w: "" },
     { c: "  \"dependencies\": {", w: "Needed at runtime, and shipped." },
     { c: "    \"react\": \"^18.3.1\"", w: "**The caret allows minor and patch updates** — 18.3.1 up to but not including 19.0.0. Exact pinning goes in the lockfile instead.", hi: true },
     { c: "  },", w: "" },
     { c: "  \"devDependencies\": {", w: "Needed only to build or test. Not shipped to users." },
     { c: "    \"vite\": \"^5.0.0\"", w: "" },
     { c: "  }", w: "" },
     { c: "}", w: "" }
    ] } },

  { trap: "Commit `package-lock.json`. `package.json` says *roughly* which versions are acceptable; the lockfile records exactly what was installed, down to every transitive dependency. Without it committed, two developers running `npm install` a week apart get different code, and the resulting bug — works on my machine, fails in CI — is genuinely hard to trace. Use `npm ci` in CI, which installs from the lockfile only and fails if the two files disagree." },

  { h: "What a bundler is for" },
  { p: "A browser loading a hundred separate module files makes a hundred requests. A bundler follows your imports, produces a small number of optimised files, and does several other jobs along the way." },

  { l: [
   "**Bundling** — many files into few, so there are fewer round trips.",
   "**Tree shaking** — removing exports nobody imported, so an unused half of a library is not shipped.",
   "**Transpiling** — rewriting modern syntax for older browsers, and compiling TypeScript and JSX, neither of which a browser understands.",
   "**Minifying** — shortening names and stripping whitespace.",
   "**Hashing** — `app.a3f9c2.js`, so a cached file is never stale after a deploy.",
   "**Dev server with hot reload** — the change appears without losing your page state."
  ] },

  { p: "**Vite** is the current default and worth starting with: `npm create vite@latest`. Webpack is older, more configurable and far more common in existing codebases, so you will read its config even if you never write one." },

  { tryit: { t: "Read the lockfile question",
    task: "A colleague says lockfiles are unnecessary because `package.json` already lists the versions. Give the concrete failure their view produces.",
    hint: "Look at what the caret means, and at dependencies you did not choose.",
    sol: { lang: "text", code: "package.json says \"react\": \"^18.3.1\".\n\nThat means \"18.3.1 or any later 18.x\". So:\n\n  Monday   npm install -> react 18.3.1\n  Friday   react 18.4.0 published\n  Friday   colleague npm install -> react 18.4.0\n\nYou are now running different code with identical\npackage.json files. If 18.4.0 has a regression, one of you sees\na bug the other cannot reproduce -- and nothing in the repo\nrecords the difference.\n\nIt is worse than that, because the caret applies to every\nTRANSITIVE dependency too. A project with 40 direct\ndependencies typically has 800+ in node_modules, all of them\nfloating. Any of them can change between two installs.\n\nThe lockfile records the exact resolved version and integrity\nhash of every one. Commit it, and use `npm ci` in CI:\n\n  npm install   updates the lockfile if it can\n  npm ci        installs the lockfile exactly, and FAILS if it\n                disagrees with package.json\n\nThis is also a supply-chain control: the integrity hash means a\nrepublished package with altered contents is rejected." },
    w: "\"Works on my machine\" is the symptom and floating transitive dependencies are usually the cause. The lockfile is also the only record of what was actually deployed, which matters when you need to reproduce a build from three months ago." } }
 ],
 k: [
  "Each module has its own scope; `export` and `import` are explicit.",
  "Prefer named exports — defaults make a codebase harder to search.",
  "`\"type\": \"module\"` is what lets Node use `import` rather than `require`.",
  "Commit the lockfile and use `npm ci` in CI, or installs drift between machines.",
  "A bundler bundles, tree-shakes, transpiles, minifies and hashes."
 ],
 r: ["Module", "npm", "Package Manager", "JavaScript"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "export function add(a, b) {", w: "a named export" },
   { c: "import { add, PI } from \"./math.js\";", w: "import named exports" },
   { c: "const { render } = await import(\"./heavy.js\");", w: "load a module only when needed" },
   { c: "npm ci", w: "install exactly what the lockfile says", lang: "bash" },
   { c: "npm create vite@latest", w: "start a new project with a modern toolchain", lang: "bash" }
  ]
 }
},

/* ==================================================================== */
{
 t: "TypeScript: Types That Vanish at Runtime",
 m: "ts",
 lvl: "intermediate",
 s: "What the compiler checks, what it cannot, and the one misunderstanding that causes production bugs.",
 goal: [
  "Annotate variables, functions and objects",
  "Use interfaces, unions and generics where they earn their place",
  "Explain why types do not validate data arriving from a server"
 ],
 b: [
  { p: "TypeScript is JavaScript plus a type checker. It compiles to plain JavaScript by **deleting the types** — nothing it says exists when the code runs. That single fact explains both why it is cheap to adopt and where it stops helping." },

  { h: "The basics" },
  { code: { lang: "typescript", t: "Annotations, and when to skip them",
    lines: [
     { c: "let name: string = \"Aryan\";", w: "Explicit — and unnecessary here." },
     { c: "let name = \"Aryan\";", w: "**Inferred as string.** Let inference do the work; annotate only where it cannot, or where the annotation documents intent.", hi: true },
     { c: "", w: "" },
     { c: "function add(a: number, b: number): number {", w: "**Parameters always need annotating.** The return type is usually inferred, but stating it catches the case where a later edit accidentally changes it." },
     { c: "  return a + b;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "const ids: number[] = [];", w: "An empty array cannot be inferred from — this annotation is doing real work." },
     { c: "const pair: [string, number] = [\"a\", 1];", w: "A tuple: fixed length, fixed types per position." },
     { c: "", w: "" },
     { c: "let value: any;", w: "**Turns checking off entirely.** Every `any` is a hole in the type system; `unknown` is the safe version that forces you to narrow before use.", hi: true }
    ] } },

  { h: "Describing shapes" },
  { code: { lang: "typescript", t: "Interfaces, unions and narrowing",
    lines: [
     { c: "interface User {", w: "" },
     { c: "  id: number;", w: "" },
     { c: "  name: string;", w: "" },
     { c: "  email?: string;", w: "**Optional.** Its type is `string | undefined`, and the compiler forces you to handle the undefined case." },
     { c: "  readonly createdAt: Date;", w: "Assignable once, at construction." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "type Status = \"idle\" | \"loading\" | \"done\" | \"error\";", w: "**A union of literals**, and one of TypeScript's best features — a typo in a status string becomes a compile error rather than a silent no-op.", hi: true },
     { c: "", w: "" },
     { c: "type Result =", w: "A discriminated union: the `ok` field tells the compiler which shape you have." },
     { c: "  | { ok: true; data: User }", w: "" },
     { c: "  | { ok: false; error: string };", w: "" },
     { c: "", w: "" },
     { c: "if (result.ok) {", w: "" },
     { c: "  result.data.name;", w: "**Narrowed.** Inside this branch the compiler knows `data` exists and `error` does not.", hi: true },
     { c: "} else {", w: "" },
     { c: "  result.error;", w: "And here, the reverse. This is how you model success-or-failure without exceptions." },
     { c: "}", w: "" }
    ] } },

  { h: "Generics" },
  { code: { lang: "typescript", t: "A type that depends on another type",
    lines: [
     { c: "function first<T>(items: T[]): T | undefined {", w: "`T` is a placeholder filled in at each call site." },
     { c: "  return items[0];", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "first([1, 2, 3]);        // number | undefined", w: "" },
     { c: "first([\"a\", \"b\"]);       // string | undefined", w: "**One function, correct types for both.** Without generics you would write `any[]` and lose all information about what came out.", hi: true },
     { c: "", w: "" },
     { c: "interface ApiResponse<T> {", w: "The common real use: one envelope shape, many payloads." },
     { c: "  data: T;", w: "" },
     { c: "  status: number;", w: "" },
     { c: "}", w: "" },
     { c: "const res: ApiResponse<User[]> = await getUsers();", w: "" }
    ] } },

  { h: "The misunderstanding that causes bugs" },
  { trap: "**Types are erased at compile time. They validate nothing at runtime.** Writing `const user: User = await res.json()` tells the compiler to *assume* the response matches `User` — it does not check. If the API changed a field, TypeScript is silent and your code fails later with an error pointing somewhere unrelated. The type system covers your own code, not data crossing a boundary." },

  { vs: { t: "Data arriving from outside", lang: "typescript",
    bad: { c: "const user: User = await res.json();\n\n// compiles cleanly\n// no runtime check whatsoever\n// user.name may be undefined", label: "An assumption dressed as a type",
      w: "`res.json()` returns `any`. Annotating the variable silences the compiler without verifying anything — arguably worse than no annotation, because it reads as a guarantee." },
    good: { c: "import { z } from \"zod\";\n\nconst User = z.object({\n  id: z.number(),\n  name: z.string(),\n});\n\nconst user = User.parse(await res.json());", label: "Validated, then typed",
      w: "`parse` checks at runtime and throws immediately if the shape is wrong — at the boundary, where the cause is obvious. The static type is *derived* from the same schema, so the two can never drift apart." } } },

  { n: "The rule: **validate at the boundary, trust inside.** Anything crossing into your program — an API response, a form, a URL parameter, a config file, JSON from localStorage — needs a runtime check. Everything your own code produces is already covered by the compiler.",
    nt: "Where types stop working" },

  { tryit: { t: "Type the function",
    task: "Write a typed function that takes an array of `User` and a key name, and returns an array of that field's values — so `pluck(users, \"name\")` returns `string[]` and `pluck(users, \"id\")` returns `number[]`, both checked.",
    hint: "You need two type parameters, and the second must be constrained to the keys of the first.",
    sol: { lang: "typescript", code: "function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {\n  return items.map(item => item[key]);\n}\n\n// K extends keyof T  -- K can only be a key that T actually has\n// T[K][]             -- an array of the type of that property\n\nconst names = pluck(users, \"name\");   // string[]\nconst ids   = pluck(users, \"id\");     // number[]\n\npluck(users, \"nmae\");\n// Error: Argument of type '\"nmae\"' is not assignable to\n// parameter of type 'keyof User'\n\n// That last line is the whole value proposition. A typo in a\n// property name is caught while you type it, not at 2am when\n// the report renders empty because every value was undefined.\n//\n// In plain JavaScript this function is three characters shorter\n// and silently returns [undefined, undefined, undefined]." },
    w: "`keyof` with a constrained generic is the pattern behind most well-typed utility libraries, and it is worth recognising even before you write it. It converts a whole class of typo into a compile error." } }
 ],
 k: [
  "TypeScript compiles by deleting types — nothing is checked at runtime.",
  "Let inference work; annotate parameters, empty arrays, and where intent needs stating.",
  "Unions of string literals turn typos into compile errors.",
  "A discriminated union plus a check narrows the type inside each branch.",
  "Validate at the boundary with a runtime schema; a type annotation is an assumption."
 ],
 r: ["TypeScript", "JavaScript", "Static Typing"],
 drill: {
  lang: "typescript",
  reps: 3,
  items: [
   { c: "function add(a: number, b: number): number {", w: "annotate parameters and return" },
   { c: "type Status = \"idle\" | \"loading\" | \"done\";", w: "a union of literal strings" },
   { c: "interface User { id: number; name: string; }", w: "describe the shape of an object" },
   { c: "function first<T>(items: T[]): T | undefined {", w: "a generic that preserves the element type" },
   { c: "const user = User.parse(await res.json());", w: "validate data at the boundary" }
  ]
 }
},

/* ==================================================================== */
{
 t: "React: Components, State and the Rule About Effects",
 m: "react",
 lvl: "advanced",
 s: "The mental model that makes the rest obvious — UI as a function of state, and the hook people misuse.",
 goal: [
  "Explain what re-rendering actually does",
  "Use useState correctly, including with objects and arrays",
  "Say when useEffect is right and, more importantly, when it is not"
 ],
 b: [
  { p: "React's whole idea fits in one line: **your UI is a function of your state.** You never write instructions to update the page. You describe what it should look like for a given state, change the state, and React works out the minimum set of DOM changes needed." },

  { ana: "A thermostat display, not a to-do list. You do not tell it 'erase the 2, draw a 3'. You set the temperature to 21 and the display shows 21. What changed on screen is React's problem, not yours.",
    at: "Describe, do not instruct" },

  { h: "A component" },
  { code: { lang: "javascript", file: "Counter.jsx", t: "The smallest useful component",
    lines: [
     { c: "import { useState } from \"react\";", w: "" },
     { c: "", w: "" },
     { c: "function Counter({ start = 0 }) {", w: "A component is a function that returns markup. `{ start = 0 }` destructures props with a default." },
     { c: "  const [count, setCount] = useState(start);", w: "**State.** The value, and the only way to change it. `start` is used once, on the first render — later changes to it are ignored.", hi: true },
     { c: "", w: "" },
     { c: "  return (", w: "" },
     { c: "    <button onClick={() => setCount(count + 1)}>", w: "**JSX.** Not HTML — it compiles to function calls. Attributes are camelCase (`onClick`, `className`)." },
     { c: "      Clicked {count} times", w: "`{}` drops back into JavaScript." },
     { c: "    </button>", w: "" },
     { c: "  );", w: "" },
     { c: "}", w: "" }
    ],
    after: "Calling `setCount` does not change `count` in this function — it schedules a re-render, and the function runs again from the top with the new value. Understanding that the whole function re-runs is most of understanding React." } },

  { h: "State updates you must not get wrong" },
  { code: { lang: "javascript", t: "Three rules",
    lines: [
     { c: "count = count + 1;", w: "**Never.** Mutating state directly changes the variable and does not tell React anything. Nothing re-renders." },
     { c: "setCount(count + 1);", w: "Correct for a single update." },
     { c: "", w: "" },
     { c: "setCount(count + 1);", w: "" },
     { c: "setCount(count + 1);", w: "**Both read the same stale `count`.** The result is +1, not +2 — updates are batched and `count` does not change until the next render.", hi: true },
     { c: "setCount(c => c + 1);", w: "" },
     { c: "setCount(c => c + 1);", w: "**The functional form receives the latest value.** +2. Use this whenever the new state depends on the old.", hi: true },
     { c: "", w: "" },
     { c: "items.push(newItem);", w: "**Never.** Same array reference, so React sees no change." },
     { c: "setItems([...items, newItem]);", w: "A new array. React compares by reference, so a new object is what signals a change." },
     { c: "setUser({ ...user, name: \"Sam\" });", w: "The same rule for objects — spread, then override." }
    ] } },

  { h: "The hook people misuse" },
  { p: "`useEffect` exists to synchronise with something **outside React**: a subscription, a timer, a browser API, a network request. It is not a general-purpose 'run this after render' hook, and using it as one is the most common source of bugs in React codebases." },

  { vs: { t: "Deriving a value from state", lang: "javascript",
    bad: { c: "const [items, setItems] = useState([]);\nconst [total, setTotal] = useState(0);\n\nuseEffect(() => {\n  setTotal(items.reduce((a, b) => a + b.price, 0));\n}, [items]);", label: "An effect, and a second render",
      w: "This renders with a stale total, *then* runs the effect, *then* renders again. It is slower, briefly wrong on screen, and there are now two sources of truth that can disagree." },
    good: { c: "const [items, setItems] = useState([]);\n\nconst total = items.reduce((a, b) => a + b.price, 0);", label: "Just calculate it",
      w: "Derived state is not state. Calculate during render — it is simpler, always correct, and one render instead of two. Reach for `useMemo` only if profiling shows the calculation is genuinely expensive." } } },

  { code: { lang: "javascript", t: "What an effect is actually for",
    lines: [
     { c: "useEffect(() => {", w: "" },
     { c: "  const controller = new AbortController();", w: "" },
     { c: "", w: "" },
     { c: "  fetch(`/api/user/${id}`, { signal: controller.signal })", w: "Synchronising with a server: genuinely outside React." },
     { c: "    .then(r => r.json())", w: "" },
     { c: "    .then(setUser)", w: "" },
     { c: "    .catch(e => { if (e.name !== \"AbortError\") setError(e); });", w: "" },
     { c: "", w: "" },
     { c: "  return () => controller.abort();", w: "**The cleanup function.** Runs before the effect re-runs and when the component unmounts. Without it, a response arriving after the user navigated away sets state on a component that is gone.", hi: true },
     { c: "}, [id]);", w: "**The dependency array.** Re-run only when `id` changes. Omit it entirely and the effect runs after *every* render — which, if it sets state, is an infinite loop.", hi: true }
    ] } },

  { trap: "The classic infinite loop: an effect with no dependency array that calls `setState`. Set state, re-render, effect runs, set state, re-render — forever. The second most common is an object or array in the dependency array: `useEffect(fn, [{ id }])` creates a new object every render, so the comparison always fails and it runs every time. Depend on primitives." },

  { h: "Keys in lists" },
  { code: { lang: "javascript", t: "The warning nobody should ignore",
    lines: [
     { c: "{items.map((item, i) => <Row key={i} item={item} />)}", w: "**Index as key.** Fine only for a static list. Delete the first item and every index shifts — React reuses the wrong DOM nodes, and text typed into an input jumps to a different row.", hi: true },
     { c: "{items.map(item => <Row key={item.id} item={item} />)}", w: "A stable id. React can now track which element is which across reorders and deletions." }
    ] } },

  { tryit: { t: "Find the three bugs",
    task: "This component fetches a user, has a stale-count bug and an infinite loop. Identify all three.\n\n`const [n, setN] = useState(0); useEffect(() => { fetch(url).then(r => r.json()).then(setUser); }); const add = () => { setN(n + 1); setN(n + 1); };`",
    hint: "Look at the dependency array, the double set, and what happens when the fetch resolves after unmount.",
    sol: { lang: "javascript", code: "// BUG 1 -- no dependency array on useEffect.\n//   The effect runs after every render. It calls setUser, which\n//   triggers a render, which runs the effect... an infinite\n//   fetch loop that will hammer the API until the tab is closed.\n\n// BUG 2 -- setN(n + 1) twice.\n//   Both calls read the same stale `n` from this render's\n//   closure, so the result is +1, not +2.\n\n// BUG 3 -- no cleanup.\n//   If the component unmounts before the fetch resolves,\n//   setUser runs on a component that no longer exists: a\n//   memory leak, and in older React a warning.\n\nfunction Profile({ url }) {\n  const [n, setN] = useState(0);\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n\n    fetch(url, { signal: controller.signal })\n      .then(r => r.json())\n      .then(setUser)\n      .catch(e => { if (e.name !== \"AbortError\") console.error(e); });\n\n    return () => controller.abort();   // fix 3\n  }, [url]);                           // fix 1\n\n  const add = () => {\n    setN(c => c + 1);                  // fix 2\n    setN(c => c + 1);\n  };\n\n  return <button onClick={add}>{n}</button>;\n}" },
    w: "All three are extremely common in real codebases, and none of them throws an error — the infinite loop shows up as an inexplicable API bill, the stale count as a counter that increments by one when it should increment by two, and the missing cleanup as a leak that only appears under navigation." } }
 ],
 k: [
  "UI is a function of state — describe the result, do not instruct the DOM.",
  "Setting state schedules a re-render; the whole component function runs again.",
  "Use the functional form `setX(prev => ...)` whenever the new value depends on the old.",
  "Never mutate state — spread into a new array or object so the reference changes.",
  "`useEffect` is for synchronising with things outside React, not for deriving values."
 ],
 r: ["React", "Virtual DOM", "State Management", "JavaScript"],
 drill: {
  lang: "javascript",
  reps: 3,
  items: [
   { c: "const [count, setCount] = useState(0);", w: "declare a piece of state" },
   { c: "setCount(c => c + 1);", w: "update based on the previous value" },
   { c: "setItems([...items, newItem]);", w: "add to state without mutating" },
   { c: "return () => controller.abort();", w: "clean up when an effect re-runs or unmounts" },
   { c: "{items.map(item => <Row key={item.id} />)}", w: "render a list with stable keys" }
  ]
 }
}

]);
