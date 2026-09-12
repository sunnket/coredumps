/* Real-world examples and step-by-step flows — Web & Frontend. */
TD.attach("web-frontend", {

"HTML": {
 ex: { h: "The skeleton, not the outfit",
       b: "It says *this is a heading, this is a list, this is a button* — never how any of it should look. That separation is what lets a screen reader announce your page sensibly, a search engine understand it, and a stylesheet restyle it entirely without touching a word of content." },
 fl: { t: "What the browser does with it",
       s: ["The HTML arrives as a stream of bytes",
           { s: "The parser builds the DOM as it reads", n: "Which is why the page can start rendering before it has all arrived." },
           { q: "Does it hit a blocking script?",
             y: "Parsing stops until the script downloads and runs — use `defer`",
             n: "Parsing continues; CSS is fetched in parallel" },
           "Malformed HTML is not an error — the browser guesses, and guesses differently"] }
},

"CSS": {
 ex: { h: "A style guide for a magazine",
       b: "One rule about how headings look, applied everywhere at once. The complication is what happens when two rules disagree — and the answer, specificity plus source order, is why so many stylesheets end up with `!important` sprinkled through them like plaster over a crack." },
 fl: { t: "Why your rule is not applying",
       s: ["A style is not taking effect",
           { q: "Is another rule more specific?",
             y: "An id beats a class beats an element — specificity wins before source order",
             n: "Same specificity? The later rule wins" },
           { s: "Check the computed styles panel", n: "It shows exactly which rule won and which were struck out." },
           { s: "Inline styles beat stylesheets; `!important` beats almost everything", n: "Both are signs the cascade has been lost." },
           "Cascade layers and custom properties are the modern way out of this"] }
},

"DOM": {
 ex: { h: "A live model of the page, not the file you wrote",
       b: "View source shows what the server sent; the DOM is what exists now, after scripts have run. That is why *the element is in my HTML but querySelector returns null* — the script ran before the parser reached it." },
 fl: { t: "Why an element is not found",
       s: ["`document.querySelector` returns null",
           { q: "Where is the script tag?",
             y: "Above the element — the DOM node does not exist yet when it runs",
             n: "Was the element created later by JavaScript?" },
           { s: "Move the script to the end, or use `defer`", n: "Or wait for `DOMContentLoaded`." },
           { s: "For dynamically added nodes, use event delegation", n: "Listen on a stable ancestor instead." },
           "Every DOM read after a write can force a synchronous reflow — batch them"] }
},

"Semantic HTML": {
 ex: { h: "Labelled boxes when you move house",
       b: "Everything fits in unlabelled boxes too, and then nobody can find the kettle. `<div>` works visually and tells assistive technology, search engines and the browser's own keyboard handling nothing at all — whereas `<button>` gets focus, Enter and Space for free." },
 fl: { t: "Choosing the right element",
       s: ["You need something clickable",
           { q: "Does it navigate somewhere?",
             y: "`<a href>` — it gets focus, middle-click, and *open in new tab* for free",
             n: "`<button>` — keyboard activation and the right role, free" },
           { s: "A clickable `<div>` needs role, tabindex and key handlers", n: "Three things to get wrong, for no benefit." },
           "Landmarks — header, nav, main, footer — let screen readers jump around the page"] }
},

"Box Model": {
 ex: { h: "A framed picture",
       b: "Content, then matting (padding), then the frame (border), then the gap to the next picture (margin). The historic argument was whether the stated width includes the matting and frame — `border-box` says yes, which is what almost everyone actually wants." },
 fl: { t: "Why 100% width overflows",
       s: ["An element is set to `width: 100%` with padding",
           { q: "Which box-sizing is in effect?",
             y: "`content-box` (the default) — padding is *added*, so it overflows its parent",
             n: "`border-box` — padding is included, and it fits" },
           { s: "Set `box-sizing: border-box` globally", n: "One rule at the top of every stylesheet, universally." },
           "Margins collapse vertically between siblings — that is separate, and also surprising"] }
},

"Flexbox": {
 ex: { h: "Arranging books on one shelf",
       b: "One direction at a time: distribute the space along the shelf, align them against the back. It is the right tool whenever the content decides the layout — a toolbar, a row of cards, a centred box — and the wrong one when you want a strict grid." },
 fl: { t: "Centring something, finally",
       s: [{ s: "Set the container to `display: flex` and its children line up in a row automatically", n: "You are laying out the box, not each child individually." },
           { s: "One direction is the main one — by default, left to right", n: "The other direction is the cross one, which by default runs top to bottom." },
           { s: "`justify-content` moves things along the main direction", n: "With the default row, that is horizontal. `center` pushes everything into the middle." },
           { s: "`align-items` moves things along the other direction", n: "With the default row, that is vertical — and this is the one everybody forgets when trying to centre something." },
           { q: "What if you set `flex-direction: column`?",
             y: "The two swap meaning entirely. `justify-content` is now vertical and `align-items` is horizontal — this trips absolutely everyone at least once",
             n: "So the rule is not \"justify is horizontal\". It is \"justify follows the direction you chose\"" },
           { s: "Use `gap` for spacing between children rather than margins", n: "It only puts space between them, never on the outer edges." }] }
},

"CSS Grid": {
 ex: { h: "A page layout drawn on graph paper",
       b: "You define the rows and columns first, then place things into them — including overlapping, and including *this item spans two columns from the third row*. Flexbox distributes along a line; Grid places on a plane, and for whole-page layout that is the difference." },
 fl: { t: "A responsive grid with no media queries",
       s: ["Set `display: grid` on the container",
           { s: "`grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`", n: "One line." },
           { q: "What does it do?",
             y: "Fits as many 240px-minimum columns as will go, then shares the remainder",
             n: "Columns reflow automatically as the viewport changes" },
           { s: "Named areas make complex layouts readable", n: "`grid-template-areas` draws the layout in the CSS." },
           "Use Grid for the page, Flexbox for the components inside it"] }
},

"Responsive Design": {
 ex: { h: "Water taking the shape of its container",
       b: "Not three fixed designs for phone, tablet and desktop — one design that flows. The breakpoints should come from where the content starts to look wrong, not from a list of device widths that goes out of date every year." },
 fl: { t: "Building it in the right order",
       s: ["Start with the narrow layout — a single column",
           { s: "Use relative units and `max-width: 100%` on media", n: "Fixed pixel widths are what break." },
           { q: "Where does the layout start to look wrong?",
             y: "Add a breakpoint there — content-driven, not device-driven",
             n: "Add `min-width` media queries to widen progressively" },
           { s: "Test at 320px and in landscape", n: "And with the browser zoomed to 200%." },
           "No horizontal scrolling, ever — that is the one hard rule"] }
},

"Media Query": {
 ex: { h: "*If the room is this wide, arrange it like this*",
       b: "It asks the environment a question and applies rules when the answer is yes. Width is the familiar one, but the same mechanism exposes colour scheme, reduced motion and pointer type — which is how one stylesheet respects a user's accessibility settings." },
 fl: { t: "Beyond width",
       s: ["A rule should apply only in certain conditions",
           { q: "Which condition?",
             y: "`min-width` for layout — mobile-first means min, not max",
             n: "`prefers-color-scheme` for dark mode; `prefers-reduced-motion` for animation" },
           { s: "`pointer: coarse` detects touch", n: "Which is when tap targets need to be 44px." },
           "Container queries ask about the parent, not the viewport — often what you actually wanted"] }
},

"Mobile-First Design": {
 ex: { h: "Packing a small bag first",
       b: "You are forced to decide what genuinely matters, and then you add for the larger case. Starting wide and cutting down produces a phone experience that is a compromised desktop page — which is what most of the web still feels like." },
 fl: { t: "Writing the CSS in this order",
       s: ["Write the base styles with no media query at all",
           { s: "Those are the mobile styles", n: "The narrowest, simplest layout." },
           { s: "Add `min-width` queries to progressively enhance", n: "Never `max-width` to progressively remove." },
           { q: "Why does the order matter?",
             y: "Phones do not download and override desktop rules they will never use",
             n: "And the constraint forces genuine prioritisation of content" }] }
},

"Viewport": {
 ex: { h: "The window you are looking through",
       b: "Without the meta tag, mobile browsers pretend to be 980px wide and shrink the page to fit — which is why an unconfigured site is legible only after pinching. One line fixes it, and the same line must never disable zooming." },
 fl: { t: "The one tag every page needs",
       s: ["`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`",
           { q: "Missing it?",
             y: "The browser assumes a 980px page and scales everything down",
             n: "The layout viewport matches the device and your media queries work" },
           { s: "Never add `user-scalable=no` or `maximum-scale=1`", n: "It blocks zoom, which is an accessibility failure." },
           "Prefer `100dvh` to `100vh` — mobile browser chrome changes the height"] }
},

"Web Accessibility": {
 ex: { h: "A ramp as well as steps",
       b: "It is not a separate build for a minority — it is the same building, designed so more people can use it, and everyone benefits from the handrail. Keyboard navigation, contrast and captions help far more people than the ones they were designed for." },
 fl: { t: "The checks that catch most issues",
       s: ["Unplug the mouse and try to complete a task",
           { q: "Can you reach and activate everything?",
             y: "Focus order matches visual order and is visible",
             n: "That is a blocking failure for a large group of users" },
           { s: "Check colour contrast: 4.5:1 for body text", n: "And never convey information by colour alone." },
           { s: "Every image needs alt text — empty if decorative", n: "Every input needs a real label." },
           "Automated tools catch about a third — the rest needs a person"] }
},

"ARIA": {
 ex: { h: "A sign explaining what an unlabelled door does",
       b: "Useful when there was no proper door. The first rule of ARIA is not to use ARIA: a real `<button>` needs no role attribute, and a wrong role is worse than none because it actively lies to a screen reader." },
 fl: { t: "When to reach for it",
       s: ["An element needs accessible semantics",
           { q: "Is there a native element that does this?",
             y: "Use it — button, dialog, details, input. No ARIA needed",
             n: "You are building a custom widget: tabs, combobox, tree" },
           { s: "Follow the published pattern exactly", n: "Roles, states *and* keyboard behaviour — all three." },
           { s: "`aria-live` announces dynamic updates", n: "Polite for status, assertive only for genuine urgency." },
           "Test with a real screen reader — ARIA is easy to get subtly wrong"] }
},

"WCAG": {
 ex: { h: "Building regulations for the web",
       b: "A published, testable standard rather than an opinion — which is exactly why it is written into procurement contracts and law in many countries. AA is the level almost everyone is actually held to." },
 fl: { t: "The four principles",
       s: [{ s: "Perceivable", n: "Text alternatives, contrast, captions." },
           { s: "Operable", n: "Keyboard access, enough time, no seizure triggers." },
           { s: "Understandable", n: "Readable, predictable, with helpful error messages." },
           { s: "Robust", n: "Valid markup that assistive technology can parse." },
           { q: "Which level applies to you?",
             y: "AA is the usual legal and contractual bar",
             n: "AAA is aspirational and not required on the whole site" }] }
},

"Focus Management": {
 ex: { h: "Where the spotlight goes when the scene changes",
       b: "A sighted mouse user does not notice. A keyboard user who opens a dialog and finds focus still behind it is stranded. Moving focus deliberately — into the dialog, and back to the trigger afterwards — is what makes a custom widget usable at all." },
 fl: { t: "Opening and closing a modal",
       s: ["The trigger button is activated",
           { s: "Remember which element opened it", n: "You will need to return focus there." },
           { s: "Move focus into the dialog", n: "The first control, or the dialog itself." },
           { q: "Can Tab reach the page behind?",
             y: "Trap focus inside the dialog while it is open",
             n: "Escape must close it" },
           { s: "On close, return focus to the trigger", n: "Or the user is dropped back at the top of the page." },
           "Never remove focus outlines without replacing them with something visible"] }
},

"Single Page Application": {
 ex: { h: "A shop that rearranges the window rather than rebuilding",
       b: "The first load is heavy; after that, navigation is instant because only data moves. The cost is that you have taken over jobs the browser used to do for free — the URL, the back button, focus on navigation, and telling a screen reader the page changed." },
 fl: { t: "What you now own",
       s: ["The first request loads the app shell and the bundle",
           { s: "Routing happens client-side", n: "You must keep the URL in sync — deep links have to work." },
           { q: "What did the browser stop doing for you?",
             y: "Scroll restoration, focus on navigation, and announcing the new page",
             n: "You must implement each of them, or the app is inaccessible" },
           { s: "Initial bundle size becomes the main performance risk", n: "Code splitting per route is the standard answer." },
           "Server-side rendering the first paint gets the best of both"] }
},

"Client-Side Rendering": {
 ex: { h: "Being sent flat-pack furniture",
       b: "The box arrives quickly and there is nothing to sit on until you have built it. The browser gets an empty div and a large script, and the user watches a spinner while the JavaScript downloads, parses and runs." },
 fl: { t: "What the user actually experiences",
       s: ["The HTML arrives — nearly empty",
           { s: "The JavaScript bundle downloads and parses", n: "On a mid-range phone, seconds." },
           { s: "The app runs and fetches data", n: "Another round trip before anything is visible." },
           { q: "What has the user seen so far?",
             y: "A blank page or a spinner — and crawlers may see the same",
             n: "Which is why SSR and static generation exist" },
           "Right for authenticated dashboards; wrong for public content pages"] }
},

"Server-Side Rendering": {
 ex: { h: "A meal served ready-plated",
       b: "The server does the assembly, so the browser paints real content on the first response. Better for perceived speed and for search engines — and it moves cost to your servers and introduces the awkward gap where the page looks ready but is not yet interactive." },
 fl: { t: "The trade it makes",
       s: [{ s: "Normally a browser downloads a nearly empty page, then runs JavaScript to build the content", n: "Which means a blank screen until all that finishes." },
           { s: "With this approach the server builds the finished page first, data already filled in", n: "What arrives at the browser is real content, not instructions for making it." },
           { s: "So the visitor sees the actual page almost immediately", n: "Also important for search engines, which may not wait around for JavaScript to run." },
           { q: "Can they click anything yet?",
             y: "Not quite. The page looks finished but is not wired up until the JavaScript downloads and attaches itself to what is already there",
             n: "That gap is genuinely awkward — buttons that look ready and do nothing. Keep the JavaScript small to keep it short" },
           { s: "Better versions send the page in pieces as they become ready", n: "The header appears while the slow part of the page is still being worked out." }] }
},

"Static Site Generation": {
 ex: { h: "Printing the newspaper in advance",
       b: "Every page is built at deploy time and served from a CDN as a plain file. It is the fastest and cheapest option available, and it only works when the content does not depend on who is asking or on what changed a second ago." },
 fl: { t: "Is your page a good candidate?",
       s: ["A page's content is decided before the request",
           { q: "Does it vary per user?",
             y: "It cannot be fully static — hydrate the personal parts client-side",
             n: "Build it at deploy time and serve from the edge" },
           { s: "Content changes require a rebuild", n: "Incremental regeneration rebuilds single pages on a schedule." },
           "Thousands of pages make build times the new bottleneck"] }
},

"Hydration": {
 ex: { h: "A mannequin that becomes a person",
       b: "The server-rendered HTML looks perfect and none of the buttons work. Hydration attaches the event handlers and rebuilds the component state in the browser — and until it finishes, clicks go nowhere, which users notice." },
 fl: { t: "Why clicks do nothing for a moment",
       s: ["Server-rendered HTML paints immediately",
           { s: "The JavaScript bundle downloads and runs", n: "It walks the existing DOM instead of rebuilding it." },
           { q: "Does the client render match the server output?",
             y: "Handlers attach and the page becomes interactive",
             n: "A hydration mismatch — React discards and re-renders, and you see a flash" },
           { s: "Random values and dates are the usual mismatch cause", n: "They differ between server and client." },
           "Islands and server components exist to hydrate less of the page"] }
},

"Islands Architecture": {
 ex: { h: "A printed page with a few interactive kiosks",
       b: "Most of an article does not need JavaScript at all. Ship it as static HTML and hydrate only the search box and the comment form — so the bundle is a fraction of the size and the rest of the page is interactive the instant it paints." },
 fl: { t: "Hydrating only what needs it",
       s: ["Render the whole page to HTML on the server",
           { q: "Which parts actually need interactivity?",
             y: "Mark those as islands — each ships and hydrates independently",
             n: "The rest stays static HTML with no JavaScript at all" },
           { s: "Islands can hydrate lazily", n: "On visibility, or on first interaction." },
           "Astro popularised it; React Server Components are a related answer"] }
},

"Virtual DOM": {
 ex: { h: "Marking up a draft before retyping the page",
       b: "You do not retype the whole document to change one paragraph. React builds a lightweight description of what the UI should be, compares it with the previous one, and applies only the differences — because touching the real DOM is the expensive part." },
 fl: { t: "How a re-render becomes a DOM update",
       s: ["State changes, so the component re-renders",
           { s: "A new virtual tree is produced", n: "Plain objects — cheap to create." },
           { s: "It is diffed against the previous tree", n: "Keys are what let the diff match list items correctly." },
           { q: "What reaches the real DOM?",
             y: "Only the actual differences",
             n: "Using array indexes as keys breaks this and causes state to attach to the wrong row" },
           "Signals-based frameworks skip the diff entirely by tracking dependencies"] }
},

"React": {
 ex: { h: "A recipe that says what the dish should look like",
       b: "You describe the UI for a given state and React works out the DOM operations. That declarative shift is the whole idea, and everything else — hooks, keys, memoisation — is machinery for making it efficient and predictable." },
 fl: { t: "What happens when something on the page changes",
       s: [{ s: "You do not edit the page directly. You change a value, and React works out what the page should now look like", n: "This is the whole idea: describe the result you want, not the steps to get there." },
           { s: "Calling the update function tells React that a value has changed", n: "Changing the value directly does nothing — React would never find out." },
           { s: "React runs your component again to build a fresh description of the page", n: "This is a lightweight description in memory, not the real page. Building it is cheap." },
           { s: "It compares that new description against the previous one and finds the differences", n: "Usually a handful of items. Everything else is left completely alone." },
           { q: "What actually reaches the browser?",
             y: "Only the differences — one changed piece of text, one added row. Not the whole page",
             n: "Which is why this is fast despite apparently rebuilding everything each time" },
           { s: "If you also asked for something to happen after a change, React runs it now", n: "Fetching data, starting a timer. Forgetting to list what it depends on is the single most common bug here — it then runs at the wrong times, or forever." }] }
},

"Component": {
 ex: { h: "A Lego brick, not a bespoke moulding",
       b: "It has a defined shape, snaps together with others, and is used in twenty places. The discipline that makes it work is that a component should not know where it sits — the moment it does, it stops being reusable and becomes a page fragment." },
 fl: { t: "Designing one that stays reusable",
       s: ["Identify a repeated piece of UI",
           { q: "Does it need to know where it is used?",
             y: "That is coupling — pass what it needs in as props instead",
             n: "It renders purely from its props" },
           { s: "Keep presentational and data-fetching concerns separate", n: "The presentational one is trivially testable." },
           "Colocate its styles and tests with it — one folder, one concept"] }
},

"Props": {
 ex: { h: "The arguments you pass to a function",
       b: "Data flows down from parent to child and the child does not write to them. That one-way flow is what makes a React app traceable — when a value is wrong you walk up the tree, and there is exactly one place it could have come from." },
 fl: { t: "One-way data flow",
       s: ["A parent renders a child with props",
           { s: "The child reads them and must not mutate them", n: "They are the parent's data." },
           { q: "The child needs to change something?",
             y: "The parent passes a callback down; the child calls it",
             n: "State lives with whoever owns the data" },
           { s: "Passing through many levels is prop drilling", n: "Context or a store is the escape hatch — used sparingly." }] }
},

"State Management": {
 ex: { h: "Deciding what goes in the shared filing cabinet",
       b: "Not everything belongs there. A dropdown's open/closed state is nobody else's business; the logged-in user is everybody's. Most state-management pain comes from putting local things in the global store and then wondering why every change re-renders the app." },
 fl: { t: "Where should this state live?",
       s: ["You have a piece of state",
           { q: "Does more than one component need it?",
             y: "Lift it to the nearest common ancestor",
             n: "Keep it local — `useState` in the component" },
           { q: "Is it server data?",
             y: "Use a data-fetching library — caching, revalidation and loading states come free",
             n: "Is it genuinely global? Context or a store" },
           "Most *global state* problems turn out to be server cache problems"] }
},

"Web Component": {
 ex: { h: "A part that fits any car",
       b: "Built on browser standards rather than a framework, so the same element works in React, Vue, plain HTML or whatever replaces them. That portability is the promise, and the awkward parts — styling from outside, form participation — are why adoption has been uneven." },
 fl: { t: "What the platform gives you",
       s: ["Define a class extending `HTMLElement` and register a tag name",
           { s: "Attach a shadow root for encapsulated styles and markup", n: "Nothing outside can reach in accidentally." },
           { q: "Does it need to work in a form?",
             y: "Form-associated custom elements — a later and less-supported addition",
             n: "Attributes in, custom events out — the standard interface" },
           "Design systems are the strongest use case: one library, every framework"] }
},

"Shadow DOM": {
 ex: { h: "A room with its own soundproofing",
       b: "Styles inside do not leak out and page styles do not leak in — which is exactly what you want for a shared widget and exactly what frustrates people trying to theme it. CSS custom properties are the deliberate hole in the wall." },
 fl: { t: "Styling something inside a shadow root",
       s: ["A component encapsulates its markup and styles",
           { q: "Can page CSS reach inside?",
             y: "No — that is the whole point",
             n: "Except through documented custom properties and `::part()`" },
           { s: "Expose theming hooks deliberately", n: "`--button-bg` as a custom property the page can set." },
           "Events cross the boundary but are retargeted — check `composed`"] }
},

"Bundler": {
 ex: { h: "Packing a hundred parcels into one crate",
       b: "Hundreds of module files would mean hundreds of requests. A bundler resolves the imports, applies transforms, drops what nothing uses, and produces a handful of optimised files — which is why the shipped output looks nothing like your source tree." },
 fl: { t: "What a build actually does",
       s: ["Start at the entry point and follow every import",
           { s: "Build the module graph", n: "Which files are actually reachable." },
           { s: "Transform each — TypeScript, JSX, CSS imports", n: "Into what browsers understand." },
           { s: "Tree-shake, then split into chunks", n: "Unused exports dropped; routes separated." },
           { q: "Finally?",
             y: "Minify and hash the filenames for long-term caching",
             n: "Source maps let you debug the original code" }] }
},

"Tree Shaking": {
 ex: { h: "Shaking a tree and keeping what stays on",
       b: "You imported one function from a library of four hundred; only that one should ship. It relies on static ES module imports — a dynamic `require` inside a condition cannot be analysed, so nothing gets dropped." },
 fl: { t: "Why unused code still ends up in your bundle",
       s: [{ s: "You import a library to use one function out of two hundred", n: "Ideally your users download only that one." },
           { s: "The build tool traces every import to work out which pieces are actually reachable from your code", n: "Anything nothing refers to can be dropped. That is the shaking." },
           { q: "Can it actually follow your imports?",
             y: "If they are ordinary static imports at the top of the file, yes — it maps the whole tree and drops the rest",
             n: "If a library uses the older module style, or builds import paths while running, the tool cannot know what is needed, so it keeps everything" },
           { s: "It also stops if a file does something on load, not just when called", n: "Adding a global, patching something. The tool cannot tell whether that mattered, so it plays safe and keeps the file." },
           { s: "So import the specific pieces you need, rather than the whole library under one name", n: "Named imports can be traced; grabbing everything as one object often cannot." }] }
},

"Code Splitting": {
 ex: { h: "Handing out the chapter people are reading",
       b: "Nobody needs the admin panel's code to read the home page. Split the bundle at route boundaries and each visitor downloads a fraction of the application — which on a mobile connection is the difference between two seconds and ten." },
 fl: { t: "Where to split",
       s: ["The initial bundle is too large",
           { q: "What is the obvious boundary?",
             y: "Routes — each page loads its own chunk on navigation",
             n: "Heavy components: charts, editors, maps — load on demand" },
           { s: "Use dynamic `import()`", n: "The bundler creates a separate chunk automatically." },
           { s: "Prefetch on hover or on idle", n: "So the chunk is already there when they click." },
           "Too many tiny chunks is its own problem — measure the waterfall"] }
},

"Lazy Loading": {
 ex: { h: "Loading the shop window, not the whole warehouse",
       b: "Images below the fold are not needed until someone scrolls, and most visitors never do. One attribute defers them — and the crucial companion is reserving the space, or the page jumps as each one arrives." },
 fl: { t: "Deferring without causing layout shift",
       s: ["Identify what is not needed for the first paint",
           { s: "Images below the fold: `loading=\"lazy\"`", n: "Never on the hero image — that is your LCP element." },
           { q: "Have you reserved space for them?",
             y: "Width and height attributes, or `aspect-ratio` — no shift when they load",
             n: "The page jumps as each image arrives, wrecking CLS" },
           "Components lazy-load with dynamic import plus a Suspense fallback"] }
},

"Minification": {
 ex: { h: "Removing every unnecessary character",
       b: "Comments gone, whitespace gone, variable names shortened to single letters. It typically halves the file, changes nothing about behaviour, and makes the shipped code unreadable — which is why source maps exist." },
 fl: { t: "What happens to your code",
       s: ["The bundler minifies the output",
           { s: "Whitespace and comments removed; local names shortened", n: "Behaviour identical." },
           { q: "How do you debug the result?",
             y: "Source maps map the minified code back to the original",
             n: "Without them, stack traces point at `a.b.c` on line 1" },
           { s: "Gzip or brotli on top", n: "Compression and minification stack — do both." },
           "Never minify by hand; never commit minified output"] }
},

"Source Map": {
 ex: { h: "A translation key for a compressed document",
       b: "Production runs the minified file; the source map tells the debugger that character 4,182 corresponds to line 40 of your original component. Without it, every production error report points to a meaningless position on a single enormous line." },
 fl: { t: "Getting readable production errors",
       s: ["An error occurs in minified production code",
           { q: "Is a source map available?",
             y: "The stack trace resolves to your original files and line numbers",
             n: "You get `t.n is not a function` at line 1, column 92341" },
           { s: "Upload maps to your error tracker rather than serving them publicly", n: "They contain your original source." },
           "`hidden-source-map` gives you the debugging without exposing the code"] }
},

"Core Web Vitals": {
 ex: { h: "Three questions a visitor asks without knowing it",
       b: "Is it there yet? Does it respond? Is it going to move under my finger? LCP, INP and CLS measure exactly those, they are measured on real users rather than in a lab, and Google uses them in ranking — which is why they get attention." },
 fl: { t: "Diagnosing each one",
       s: [{ s: "LCP — largest content paint", n: "Slow server, render-blocking resources, or an unoptimised hero image." },
           { s: "INP — interaction to next paint", n: "Long JavaScript tasks blocking the main thread." },
           { s: "CLS — cumulative layout shift", n: "Images and ads without reserved space; fonts swapping." },
           { q: "Where do you measure?",
             y: "Field data from real users — that is what counts",
             n: "Lab tools like Lighthouse are for diagnosis, not for the score" }] }
},

"Largest Contentful Paint": {
 ex: { h: "When the main thing you came for appears",
       b: "Usually the hero image or the headline. It is a proxy for *the page felt loaded*, and the target is 2.5 seconds — which sounds generous until you measure it on a mid-range phone on a real network rather than on your laptop." },
 fl: { t: "Improving it",
       s: ["Find which element is the LCP candidate",
           { s: "DevTools performance panel names it", n: "Usually the hero image or a heading." },
           { q: "Is it an image?",
             y: "Preload it, size it correctly, serve modern formats, and never lazy-load it",
             n: "Reduce render-blocking CSS and improve server response time" },
           { s: "Fonts can delay text rendering", n: "`font-display: swap` and preload the critical face." },
           "Target under 2.5s at the 75th percentile of real users"] }
},

"Cumulative Layout Shift": {
 ex: { h: "A newspaper where the article moves as you read",
       b: "You go to tap a link and an advert loads above it, so you tap something else entirely. Nearly every cause is the same: something arrived later and no space was reserved for it." },
 fl: { t: "Eliminating shift",
       s: ["Content moves after the initial paint",
           { q: "Do images have width and height attributes?",
             y: "The browser reserves the space before the file arrives",
             n: "That is almost certainly your biggest source" },
           { s: "Reserve space for ads, embeds and async content", n: "A fixed-height container." },
           { s: "Fonts swapping causes reflow", n: "`size-adjust` and a matched fallback minimise it." },
           "Never insert content above existing content unless the user asked for it"] }
},

"Reflow": {
 ex: { h: "Re-laying out a whole page because one paragraph grew",
       b: "The browser must recompute geometry for everything affected, which is expensive. And reading a layout property immediately after writing one forces it to happen synchronously, right there — which inside a loop is how a smooth page becomes a stuttering one." },
 fl: { t: "Layout thrashing, and how to avoid it",
       s: ["A loop reads `offsetHeight` and then sets a style",
           { s: "The read forces a synchronous layout", n: "The browser must flush pending changes to answer." },
           { q: "Does the next iteration write again?",
             y: "Write invalidates layout; the next read forces it again — n times",
             n: "Batch all reads, then all writes" },
           { s: "Animate `transform` and `opacity`", n: "They skip layout entirely and run on the compositor." },
           "`requestAnimationFrame` is the right place to batch DOM writes"] }
},

"Lighthouse": {
 ex: { h: "An MOT for a web page",
       b: "It runs a standard set of checks and produces a score with specific, actionable failures. It is a lab test on simulated hardware, so it is excellent for finding problems and a poor substitute for what your real users are actually experiencing." },
 fl: { t: "Using the report properly",
       s: ["Run an audit on a page",
           { q: "Chasing the number, or reading the diagnostics?",
             y: "The diagnostics — they name specific files and specific bytes",
             n: "The score varies run to run; it is not the deliverable" },
           { s: "Run it on a throttled connection and CPU", n: "The defaults simulate a mid-range phone deliberately." },
           "Confirm improvements against field data — lab and field often disagree"] }
},

"Progressive Web App": {
 ex: { h: "A website that behaves like an installed app",
       b: "Add to home screen, works offline, sends notifications — without an app store, a review process or a separate codebase. The requirements are modest: HTTPS, a manifest and a service worker. The support gaps are on iOS." },
 fl: { t: "What makes a site installable",
       s: ["Serve over HTTPS",
           { s: "Add a web app manifest", n: "Name, icons, start URL, display mode." },
           { s: "Register a service worker", n: "With a fetch handler — that is what enables offline." },
           { q: "All three present?",
             y: "The browser offers to install it",
             n: "iOS supports installation but restricts push and background sync" },
           "Have an update strategy — a stale service worker can pin users to old code"] }
},

"Service Worker": {
 ex: { h: "A proxy that lives in the browser",
       b: "It sits between your page and the network and can answer requests from a cache, which is what makes offline possible. It is also the most dangerous thing you can deploy: a buggy one can serve stale code to returning visitors indefinitely." },
 fl: { t: "The lifecycle, and the update trap",
       s: ["The page registers the worker; it installs",
           { s: "It stays waiting while the old one still controls open pages", n: "It does not take over immediately." },
           { q: "How does it activate?",
             y: "When every controlled page closes — or `skipWaiting` forces it",
             n: "Which can leave a user running two versions at once" },
           { s: "Never cache the HTML shell indefinitely", n: "Network-first for navigation, cache-first for hashed assets." },
           "Always ship a kill switch — a worker that unregisters itself"] }
},

"Web Worker": {
 ex: { h: "A back office so the counter stays open",
       b: "Heavy computation on the main thread freezes the interface — scrolling stops, clicks queue up. A worker runs it on a separate thread with no DOM access, communicating by messages, so the page stays responsive." },
 fl: { t: "Moving work off the main thread",
       s: ["A long computation is blocking the UI",
           { s: "Move it into a worker script", n: "Separate file, separate thread." },
           { q: "Does it need the DOM?",
             y: "It cannot have it — send the result back and update the DOM on the main thread",
             n: "Communicate with `postMessage`" },
           { s: "Data is copied, not shared", n: "Use transferable objects for large buffers to avoid the copy cost." },
           "Worth it above roughly 50ms of work; below that the overhead dominates"] }
},

"Event Loop": {
 ex: { h: "One waiter serving a whole restaurant",
       b: "They never stand at one table waiting for the kitchen. They take an order, move on, and come back when food is ready. That is how a single thread serves thousands of async operations — and why one guest asking a very long question stops everyone." },
 fl: { t: "What runs when",
       s: ["Synchronous code runs to completion first",
           { s: "Then the microtask queue drains completely", n: "Promise callbacks — all of them, before anything else." },
           { s: "Then one macrotask", n: "setTimeout, I/O callbacks." },
           { q: "Is a task long-running?",
             y: "Nothing else runs — rendering stops and the page freezes",
             n: "Rendering happens between tasks" },
           "A promise chain that never yields can starve the loop just as badly as a while loop"] }
},

"CORS": {
 ex: { h: "A bouncer asking which club sent you",
       b: "The browser blocks cross-origin reads by default, and CORS is the server's way of saying which origins it permits. Critically, it is enforced by the browser only — a CORS error means your server has not given permission, not that anything is broken." },
 fl: { t: "Fixing a CORS error",
       s: ["The console reports a blocked cross-origin request",
           { q: "Where must the fix go?",
             y: "The server — it must send `Access-Control-Allow-Origin`",
             n: "Nothing you change in the browser will help" },
           { q: "Is it a preflight failing?",
             y: "Custom headers or non-simple methods trigger an OPTIONS request first — handle it",
             n: "Sending cookies? You need `credentials` and an explicit origin, not `*`" },
           "curl works because CORS is a browser policy, not a server rejection"] }
},

"Same-Origin Policy": {
 ex: { h: "Flats in a building that cannot see into each other",
       b: "Without it, any site you visited could read your webmail in another tab. Origin is scheme plus host plus port — all three — which is why `http` and `https` on the same domain are different origins, and why localhost:3000 and :8000 cannot see each other." },
 fl: { t: "What counts as the same origin",
       s: ["Compare scheme, host and port",
           { q: "Do all three match exactly?",
             y: "Same origin — full access to the document and its storage",
             n: "Different origin — reads are blocked by default" },
           { s: "Subdomains are different origins", n: "`app.example.com` and `api.example.com` do not share access." },
           "CORS, postMessage and CSP are the controlled ways across the boundary"] }
},

"Cookie": {
 ex: { h: "A cloakroom ticket the browser presents automatically",
       b: "Attached to every matching request without any code doing anything — which is exactly why they are convenient for sessions and exactly why CSRF exists. The three flags that matter are HttpOnly, Secure and SameSite, and all three should be set." },
 fl: { t: "Setting one safely",
       s: ["The server sets a session cookie",
           { s: "`HttpOnly` — JavaScript cannot read it", n: "Which limits the damage from an XSS bug." },
           { s: "`Secure` — sent over HTTPS only", n: "Never in the clear." },
           { q: "SameSite?",
             y: "`Lax` is a sensible default; `Strict` for sensitive actions",
             n: "`None` requires `Secure` and reopens CSRF exposure" },
           "Size is capped around 4KB and it is sent on every request — keep it small"] }
},

"localStorage": {
 ex: { h: "A drawer in this browser, on this device",
       b: "Simple, synchronous and persistent — and readable by any script on the page, which is why an access token stored there is a gift to an XSS attacker. Fine for a theme preference; wrong for anything that grants access." },
 fl: { t: "What belongs in it",
       s: ["You need to persist something in the browser",
           { q: "Would it matter if a malicious script read it?",
             y: "Do not store it here — use an HttpOnly cookie",
             n: "Theme, draft text, collapsed panels — all fine" },
           { s: "It is synchronous and blocks the main thread", n: "Keep it small; use IndexedDB for anything substantial." },
           "It throws in some private modes — always wrap access in try/catch"] }
},

"Fetch API": {
 ex: { h: "A promise-based replacement for the old XHR",
       b: "Cleaner and with one notorious trap: a 404 or a 500 does not reject. The promise resolves happily because the request itself succeeded — you have to check `response.ok` yourself, and forgetting to is one of the most common bugs in modern frontend code." },
 fl: { t: "Handling errors correctly",
       s: ["`await fetch(url)` returns a response",
           { q: "Did the promise reject?",
             y: "Only on a network failure — DNS, offline, CORS block",
             n: "A 404 or 500 resolves normally — you must check yourself" },
           { s: "Check `response.ok` before parsing", n: "Throw explicitly if it is false." },
           { s: "Then `await response.json()`", n: "Which can itself throw on a non-JSON error page." },
           "Use an AbortController to cancel — otherwise stale responses overwrite fresh ones"] }
},

"Debounce and Throttle": {
 ex: { h: "Waiting for silence versus a steady drip",
       b: "Debounce fires once after the flurry stops — right for search-as-you-type, where only the final query matters. Throttle fires at most once per interval — right for scroll position, where you want a regular sample all the way through." },
 fl: { t: "Choosing between them",
       s: ["An event fires far more often than you can handle",
           { q: "Do you need the final value, or a running sample?",
             y: "Final — debounce. Search, autosave, resize recalculation",
             n: "Running sample — throttle. Scroll, drag, progress" },
           { s: "About 300ms suits typing", n: "About 100ms suits scroll." },
           "Debounced fetches must also cancel the request in flight"] }
},

"Virtual Scrolling": {
 ex: { h: "A window onto a very long list",
       b: "Ten thousand rows in the DOM makes a page unusable — memory, layout and scroll all suffer. Render only the twenty currently visible, position them with a spacer of the right total height, and the list feels infinite while the DOM stays tiny." },
 fl: { t: "Rendering only what is visible",
       s: ["Measure the viewport and the row height",
           { s: "Compute which index range is on screen", n: "Plus a small buffer above and below." },
           { s: "Render only those rows", n: "Absolutely positioned inside a container of the full scroll height." },
           { q: "Are row heights variable?",
             y: "Much harder — you must measure and cache each one",
             n: "Fixed heights make the arithmetic trivial" },
           "Keyboard navigation and find-in-page both break — handle them deliberately"] }
},

"Responsive Images": {
 ex: { h: "Not posting a billboard to someone with a phone",
       b: "Serving a 3000px hero to a 375px screen wastes most of the bytes and most of the decode time. `srcset` lets the browser choose based on the actual viewport and pixel density, which is usually the single largest performance win available." },
 fl: { t: "Serving the right file",
       s: ["Provide several widths with `srcset`",
           { s: "And `sizes` to say how wide it will render", n: "Without it the browser assumes full viewport width." },
           { q: "Do you need different crops per breakpoint?",
             y: "`<picture>` with `<source media>` — art direction",
             n: "`srcset` alone handles resolution switching" },
           { s: "Offer AVIF and WebP with a JPEG fallback", n: "Via `<picture>` type sources." },
           "Always set width and height — that is what prevents layout shift"] }
},

"SVG": {
 ex: { h: "A recipe for a shape, not a photograph of one",
       b: "Because it is instructions rather than pixels, it is razor sharp at any size and usually tiny. It is also markup in your DOM — which means CSS can style it and JavaScript can animate it, and also that an SVG from an untrusted source can carry a script." },
 fl: { t: "Inline or as an image?",
       s: ["You need a vector graphic",
           { q: "Do you need to style or animate parts of it?",
             y: "Inline it — CSS and JS can reach the individual paths",
             n: "`<img src>` — cached separately and kept out of the DOM" },
           { s: "Give it a title and role for accessibility", n: "Or `aria-hidden` if purely decorative." },
           "Never inline SVG from user upload without sanitising it"] }
},

"Canvas": {
 ex: { h: "A blank sheet you paint on, pixel by pixel",
       b: "No elements, no DOM, no accessibility tree — just a bitmap you draw into. Perfect for games, visualisations of a hundred thousand points, and image editing; hopeless for anything a screen reader or a search engine needs to read." },
 fl: { t: "Canvas or SVG?",
       s: ["You need to draw graphics",
           { q: "How many objects, and do they need to be interactive?",
             y: "Thousands, redrawn constantly — Canvas. One bitmap, no DOM overhead",
             n: "Dozens, each clickable and stylable — SVG" },
           { s: "Canvas has no accessibility by default", n: "Provide a text alternative or an equivalent table." },
           "You must handle high-DPI scaling yourself or it looks blurry"] }
},

"Design System": {
 ex: { h: "A brand manual with the components already built",
       b: "Not just *use this blue* but a `<Button>` that is already accessible, already themed, already tested. The value is consistency plus the accumulated fixes — an accessibility bug fixed once is fixed in three hundred places." },
 fl: { t: "What makes one succeed",
       s: [{ s: "Design tokens first", n: "Colour, spacing, type — named values, one source of truth." },
           { s: "Then components built on those tokens", n: "Accessible and documented by default." },
           { q: "Is it maintained and adopted?",
             y: "It saves enormous time and raises the floor on quality",
             n: "It becomes another abandoned library people work around" },
           "Documentation and an escape hatch matter as much as the components"] }
},

"Tailwind CSS": {
 ex: { h: "Building with pre-cut lengths instead of milling your own",
       b: "You compose from a constrained set of utilities, which keeps spacing and colour consistent by construction and removes naming from the equation entirely. The markup gets noisy — which is the trade people either accept immediately or never do." },
 fl: { t: "How it stays small",
       s: ["Utility classes are applied directly in the markup",
           { s: "The build scans your source for class names", n: "Only the utilities you actually used are emitted." },
           { q: "Building class names dynamically?",
             y: "The scanner cannot see them — they get purged. Use complete literal strings",
             n: "The output CSS is typically a few kilobytes" },
           { s: "Extract repetition into components, not `@apply`", n: "That is where the reuse belongs." },
           "The config is your design system — customise the scale, do not fight it"] }
},

"Dark Mode": {
 ex: { h: "Two coats of paint on the same building",
       b: "Not inverted colours — a separate palette, because pure white text on pure black is genuinely harder to read and shadows stop working entirely. Both themes need their contrast checked independently; passing in one says nothing about the other." },
 fl: { t: "Implementing it properly",
       s: ["Define every colour as a semantic token",
           { s: "`--surface`, `--text`, `--border` — never raw hex in components", n: "One place to swap." },
           { s: "Redefine the tokens under `prefers-color-scheme: dark`", n: "And under an explicit `[data-theme]` for a manual toggle." },
           { q: "Have you checked contrast in dark mode separately?",
             y: "Good — light-mode ratios do not carry over",
             n: "Pure black and pure white are usually the wrong extremes" },
           "Set `color-scheme` so form controls and scrollbars match"] }
},

"SEO": {
 ex: { h: "Making the librarian's job easy",
       b: "Descriptive titles, sensible headings, real links, fast pages and content that actually answers the question. Most of it overlaps entirely with accessibility and performance, which is why the tricks-based approach has kept losing to simply building the page well." },
 fl: { t: "The technical basics",
       s: ["Give every page a unique title and meta description",
           { s: "One `<h1>`, then a sensible heading hierarchy", n: "Structure, not styling." },
           { q: "Is the content rendered client-side only?",
             y: "Crawlers may not execute your JavaScript — use SSR or static generation",
             n: "Check with the URL inspection tool rather than assuming" },
           { s: "Canonical URLs, a sitemap, and structured data", n: "Plus Core Web Vitals, which are a ranking input." },
           "Real links with real hrefs — a div with an onclick is invisible to a crawler"] }
},

"Next.js": {
 ex: { h: "A React framework with the plumbing already fitted",
       b: "Routing, server rendering, image optimisation, API routes and bundling all decided for you. It saves enormous setup and it is opinionated — the App Router's server components are a genuinely different mental model, and fighting it is unpleasant." },
 fl: { t: "Server or client component?",
       s: ["You are writing a component in the App Router",
           { q: "Does it need state, effects or browser APIs?",
             y: "Add `\"use client\"` — it ships JavaScript to the browser",
             n: "Leave it as a server component — it can fetch data directly and ships no JS" },
           { s: "Keep client components as leaves", n: "The boundary is inherited by everything below it." },
           "Understand the caching layers before debugging *why is my data stale*"] }
},

"Vite": {
 ex: { h: "Serving each module as the browser asks for it",
       b: "Older bundlers rebuilt the whole application before the dev server could start. Vite serves native ES modules straight to the browser, so startup is instant regardless of project size, and updates the single changed module rather than reloading the page." },
 fl: { t: "Why the dev server starts instantly",
       s: ["Dependencies are pre-bundled once with esbuild",
           { s: "Your own source is served as native ES modules", n: "No bundling step at all in development." },
           { q: "You edit a file?",
             y: "Only that module is replaced, in place — state is preserved",
             n: "A full rebuild is never needed" },
           { s: "Production still bundles, with Rollup", n: "Development and production behave differently — test the build." }] }
},

"Content Security Policy": {
 ex: { h: "A guest list for code",
       b: "Even if an attacker injects a script tag, the browser refuses to run it because that source is not on the list. It is the strongest single defence against XSS, and it is also the thing most likely to break a third-party widget on the day you deploy it." },
 fl: { t: "Rolling one out without breaking the site",
       s: ["Start in report-only mode",
           { s: "Violations are reported and nothing is blocked", n: "You find out what the policy would break." },
           { q: "Are inline scripts everywhere?",
             y: "Add nonces or hashes — `unsafe-inline` defeats most of the benefit",
             n: "Tighten script-src to specific origins" },
           { s: "Watch the reports for a while, then enforce", n: "Third-party tags are the usual surprise." },
           "`frame-ancestors` replaces X-Frame-Options for clickjacking"] }
},

"Web App Manifest": {
 ex: { h: "The label on the tin, for the operating system",
       b: "A small JSON file telling the OS the app's name, its icons, what colour the status bar should be and whether to hide the browser chrome. It is what turns *add bookmark* into something that looks like an installed application." },
 fl: { t: "Getting an install prompt",
       s: ["Link a `manifest.json` from every page",
           { s: "Name, short name, start URL, display mode", n: "`standalone` hides the browser chrome." },
           { s: "Icons at 192px and 512px, plus a maskable variant", n: "Android crops icons to its own shape." },
           { q: "Also serving HTTPS with a service worker?",
             y: "The browser offers installation",
             n: "iOS installs from the share sheet and ignores some fields" }] }
},

"Performance Budget": {
 ex: { h: "A weight limit for the page",
       b: "Without one, every sprint adds a script and nobody is ever responsible for the cumulative result. A budget makes the trade explicit: this new analytics tag costs 40KB, so something else has to go or the build fails." },
 fl: { t: "Enforcing it",
       s: ["Agree limits — total JavaScript, LCP, INP",
           { s: "Measure them in CI on every pull request", n: "Not once a quarter." },
           { q: "Does a change exceed the budget?",
             y: "The build fails and the trade-off gets discussed before it ships",
             n: "It merges normally" },
           "Budgets stop the slow accumulation that no single change is blamed for"] }
},

"Offline-First": {
 ex: { h: "Writing in a notebook and syncing later",
       b: "The app reads and writes locally and treats the network as an enhancement. It works on the underground and in a lift — and it forces you to solve conflict resolution, because two devices can now edit the same thing while neither can see the other." },
 fl: { t: "Designing for an unreliable network",
       s: ["Reads come from local storage first",
           { s: "Then revalidate from the network in the background", n: "The UI is never blocked on a request." },
           { s: "Writes go to a local queue and an optimistic UI update", n: "The user sees the change immediately." },
           { q: "Two devices edited the same record?",
             y: "You need a conflict strategy — last-write-wins, or a CRDT",
             n: "Flush the queue when connectivity returns, idempotently" },
           "Show sync state honestly — silent failure is worse than a warning"] }
},

"IndexedDB": {
 ex: { h: "A proper database in the browser",
       b: "Where localStorage is a drawer for small strings, this is a filing system: hundreds of megabytes, structured records, indexes and transactions. The raw API is famously unpleasant, which is why almost everyone uses a wrapper." },
 fl: { t: "When you need it over localStorage",
       s: ["You need client-side persistence",
           { q: "How much, and what shape?",
             y: "Large or structured — IndexedDB, asynchronous and indexed",
             n: "A few small strings — localStorage is simpler" },
           { s: "Use a wrapper like idb or Dexie", n: "The native API is event-based and verbose." },
           { s: "Storage can be evicted under pressure", n: "Request persistent storage, and never treat it as the only copy." },
           "It is the natural store behind an offline-first app"] }
}

});
