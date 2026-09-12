/* Speed Coding — JavaScript.

   The JS track needed practice attached like every other track has. These are
   the lines a working front-end engineer types daily, in the same three-rung
   ladder as the Python sets.

   Note the `lang: "javascript"` on each set: verify_speed_code.py only parses
   Python cards, and skips anything declaring another language rather than
   reporting valid JavaScript as a syntax error. */

TD.addSpeedSets([

  /* ================= RUNG 1 — fragments ================= */
  {
    id: "jskeys",
    rung: 1,
    name: "JavaScript fragments",
    lvl: "core",
    time: "4 min",
    lang: "javascript",
    why: "The openers and punctuation of JavaScript. Arrow syntax and template literals in particular are shapes your fingers have never made before, and they appear on nearly every line you will write.",
    cards: [
      { c: "const ", w: "the declaration you should reach for first",
        why: "`const` is the default because it removes a question: this name will never point at anything else. Reserve `let` for values that genuinely change." },
      { c: "let ", w: "for a value that genuinely changes",
        why: "Block-scoped, unlike `var`. That single difference is what fixes the classic closure-in-a-loop bug, where every handler would otherwise share one variable." },
      { c: "=> ", w: "the arrow that defines a function",
        why: "Two keystrokes that appear thousands of times. An arrow also inherits `this` from where it was written, which is why it is the default for callbacks." },
      { c: "===", w: "strict equality, the only one you use",
        why: "`==` coerces its operands using rules that are not even transitive: `0 == \"\"` and `0 == \"0\"` are both true, but `\"\" == \"0\"` is false." },
      { c: "!==", w: "strict inequality",
        why: "Same rule as `===`. Every linter you will meet enforces both." },
      { c: "?.", w: "optional chaining",
        why: "Reads through a chain that might be missing: `user?.profile?.name` is `undefined` rather than a thrown error. It replaces a nest of if-checks." },
      { c: "??", w: "nullish coalescing",
        why: "Falls back only for `null` and `undefined`. `||` also swallows `0` and `\"\"`, which silently discards a configured port of zero." },
      { c: "...", w: "spread and rest",
        why: "One operator, two jobs: spreading a value out (`[...items]`) and collecting the remainder (`...rest`). Copying before mutating is its most common use." },
      { c: "`${}`", w: "a template literal slot",
        why: "Backticks, not quotes. This is JavaScript's f-string, and it also allows genuine multi-line strings." },
      { c: "async ", w: "marks a function as returning a promise",
        why: "It does not make the code inside non-blocking. It wraps the return value in a promise, which is why calling one without `await` gives you a pending promise rather than the value." },
      { c: "await ", w: "pause until a promise settles",
        why: "Pauses this function, not the thread — everything else on the page keeps running. Only legal inside an `async` function or at the top level of a module." },
      { c: "export ", w: "make something available to other files",
        why: "Prefer named exports over a default: a default can be imported under any name, which makes a codebase harder to search and refactor." }
    ]
  },

  /* ================= RUNG 2 — whole lines ================= */
  {
    id: "jslines",
    rung: 2,
    name: "JavaScript lines you type daily",
    lvl: "core",
    time: "6 min",
    lang: "javascript",
    why: "Complete statements from real front-end work — selecting elements, transforming arrays, and the fetch call you will write in every project.",
    cards: [
      { c: "const el = document.querySelector(\".card\");", w: "find the first matching element",
        why: "Returns `null` when nothing matches, and property access on null throws. That error, right after a querySelector, almost always means the script ran before the element existed — add `defer`." },
      { c: "el.textContent = userInput;", w: "insert user data safely",
        why: "`textContent` inserts text with no parsing. Using `innerHTML` here is the cross-site scripting vulnerability: the browser would parse and execute any markup in the string." },
      { c: "el.classList.toggle(\"active\", isOn);", w: "force a class on or off",
        why: "The second argument makes it a setter rather than a toggle, which is clearer than an if/else. Prefer classes over inline styles — inline wins over nearly every stylesheet rule." },
      { c: "const total = items.reduce((a, b) => a + b, 0);", w: "fold an array into one value",
        why: "The `0` is the starting accumulator. Omit it and an empty array throws rather than returning zero, which is a real edge case in production data." },
      { c: "const active = items.filter(i => i.enabled);", w: "keep only the matching items",
        why: "Returns a new array and leaves the original alone — unlike `sort` and `reverse`, which mutate in place and surprise people." },
      { c: "const res = await fetch(url);", w: "make a request and wait for it",
        why: "The promise resolves for a 404 or a 500 — only a network failure rejects. This is why the next card exists." },
      { c: "if (!res.ok) throw new Error(res.status);", w: "the check everyone forgets",
        why: "`res.ok` is true only for 200–299. Without this, an error page flows through your code as though it were data and fails somewhere unrelated." },
      { c: "const data = await res.json();", w: "parse the response body",
        why: "`json()` is itself asynchronous — the body may still be arriving. The second await is not optional." },
      { c: "const sorted = [...items].sort((a, b) => a - b);", w: "sort numbers without mutating",
        why: "Two fixes in one line: the spread avoids mutating the original, and the comparator stops `sort` comparing numbers as strings, where 10 sorts before 9." },
      { c: "export default function App() {", w: "the top of a React component",
        why: "A component is just a function returning markup. The capital letter is required — JSX treats a lowercase name as an HTML tag." },
      { c: "const [count, setCount] = useState(0);", w: "declare a piece of React state",
        why: "Array destructuring of the pair React returns. The names are yours; the order is not." },
      { c: "setCount(c => c + 1);", w: "update state from the previous value",
        why: "The functional form receives the latest pending state. `setCount(count + 1)` twice in one handler increments by one, because both read the same stale value." }
    ]
  },

  /* ================= RUNG 3 — blocks ================= */
  {
    id: "jsblocks",
    rung: 3,
    name: "JavaScript blocks",
    lvl: "intermediate",
    time: "7 min",
    lang: "javascript",
    why: "Multi-line shapes with real indentation — the async function, the event listener, and the React effect that people write incorrectly more often than any other hook.",
    cards: [
      { c: "try {\n  const res = await fetch(url);\n  return await res.json();\n} catch (err) {\n  console.error(err);\n}",
        w: "fetch with error handling", hint: "five lines",
        why: "`try`/`catch` works with `await` exactly as it does with synchronous code — which is the main ergonomic win over promise chains, where errors need a separate `.catch`." },

      { c: "el.addEventListener(\"click\", (e) => {\n  e.preventDefault();\n  handle(e.target);\n});",
        w: "attach a click handler", hint: "four lines",
        why: "`preventDefault` stops the browser's default action — following a link, submitting a form. Without it a form submit reloads the page and your JavaScript never finishes." },

      { c: "list.addEventListener(\"click\", (e) => {\n  const row = e.target.closest(\"[data-id]\");\n  if (!row) return;\n  remove(row.dataset.id);\n});",
        w: "one listener for a whole list", hint: "five lines",
        why: "Event delegation. One listener instead of a thousand, and it keeps working for rows added after it was attached — which per-row listeners never do." },

      { c: "const [a, b] = await Promise.all([\n  fetchA(),\n  fetchB(),\n]);",
        w: "run two requests in parallel", hint: "four lines",
        why: "Both start before either is awaited, so the total is the slower one rather than the sum. Sequential awaits on independent work is the most common async performance bug." },

      { c: "useEffect(() => {\n  const c = new AbortController();\n  load(c.signal);\n  return () => c.abort();\n}, [id]);",
        w: "a React effect with cleanup", hint: "five lines",
        why: "The returned function runs before the effect re-runs and on unmount. Without it, a response arriving after the user navigated away sets state on a component that no longer exists." },

      { c: "for (const [key, value] of Object.entries(obj)) {\n  console.log(key, value);\n}",
        w: "iterate an object's pairs", hint: "three lines",
        why: "Plain `for...in` walks inherited keys too, which is almost never what you want. `Object.entries` gives you exactly the object's own key-value pairs." },

      { c: "if (!res.ok) {\n  const text = await res.text();\n  throw new Error(`${res.status}: ${text}`);\n}",
        w: "fail loudly on a bad status", hint: "four lines",
        why: "Reading the body first gives you the server's explanation. A bare status code sends you looking in the wrong place." }
    ]
  }

]);
