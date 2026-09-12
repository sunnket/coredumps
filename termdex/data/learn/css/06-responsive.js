/* CSS — responsive and modern CSS. */
TD.addLessons("css", [

{
 t: "Responsive Design and the Modern Toolkit",
 m: "responsive",
 lvl: "intermediate",
 s: "Building once for every screen, and the recent features that removed half the old workarounds.",
 goal: [
  "Write mobile-first CSS with breakpoints chosen from the content",
  "Replace media queries with fluid sizing where it is better",
  "Use the modern features worth adopting today"
 ],
 b: [
  { p: "Responsive design is not *a mobile version*. It is one page that works at every width — and the modern approach writes fewer media queries than the old one, not more, because the layout tools now adapt on their own." },

  { h: "Mobile first" },
  { p: "Write the small-screen styles as the base, then add complexity with `min-width` queries. The reverse — desktop first with `max-width` — means every override fights something." },
  { vs: { t: "The same two-column layout, both directions", lang: "css",
    bad: { c: ".layout {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  gap: 2rem;\n  padding: 3rem;\n}\n\n@media (max-width: 700px) {\n  .layout {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n    padding: 1rem;\n  }\n}", label: "Desktop first — undoing",
      w: "The mobile block **undoes** three declarations. Every future change means editing two places and hoping they stay consistent — and a phone still downloads and parses the desktop rules." },
    good: { c: ".layout {\n  display: grid;\n  gap: 1rem;\n  padding: 1rem;\n}\n\n@media (min-width: 700px) {\n  .layout {\n    grid-template-columns: 240px 1fr;\n    gap: 2rem;\n    padding: 3rem;\n  }\n}", label: "Mobile first — adding",
      w: "The base is the simple case. The query **adds** rather than overriding. The single-column default is also what shows if the CSS partly fails to load, which is the better failure." } } },
  { code: { lang: "css", t: "Media queries",
    lines: [
     { c: "@media (min-width: 700px) { }", w: "**700px and wider.** The standard mobile-first form." },
     { c: "@media (min-width: 700px) and (max-width: 1100px) { }", w: "A band." },
     { c: "@media (orientation: landscape) { }", w: "" },
     { c: "@media print { }", w: "**Printing.** Hide navigation, show link URLs, use black on white. Twenty lines that make a page genuinely printable." },
     { c: "", w: "" },
     { c: "@media (prefers-color-scheme: dark) { }", w: "**User preference queries — the most valuable ones.**", hi: true },
     { c: "@media (prefers-reduced-motion: reduce) { }", w: "" },
     { c: "@media (prefers-contrast: more) { }", w: "" },
     { c: "@media (hover: hover) { }", w: "**Only where hover genuinely exists.** Wrap hover-only interactions in this so touch devices are not left with something they can never reach." }
    ] } },
  { n: "**Choose breakpoints from your content, not from device names.** Widen the browser slowly and put a breakpoint wherever the layout starts to look wrong. Device-named breakpoints go stale within a year; content-derived ones do not, and you usually need fewer of them.",
    nt: "Where breakpoints come from" },

  { h: "Fluid sizing — fewer queries" },
  { code: { lang: "css",
    lines: [
     { c: "h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); }", w: "**Minimum, preferred, maximum.** Scales smoothly with the viewport between two bounds — replacing three or four breakpoints for that one heading.", hi: true },
     { c: "", w: "" },
     { c: ".container {", w: "" },
     { c: "  width: min(100% - 2rem, 1100px);", w: "**Full width minus a gutter, up to 1100px.** A whole centred-container pattern in two lines." },
     { c: "  margin-inline: auto;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".section { padding-block: clamp(2rem, 8vw, 6rem); }", w: "**Vertical rhythm that scales too.** Fixed padding looks cramped on a desktop and enormous on a phone." },
     { c: "", w: "" },
     { c: ".cards { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }", w: "**And the grid from the layout lesson** — responsive with no query at all." }
    ] } },
  { p: "Between `clamp`, `min`, `max` and `auto-fit`, a modern layout often needs one or two media queries where an older one needed six." },

  { h: "Container queries" },
  { p: "The genuine limitation of media queries: they only know the **viewport**. A card in a wide main area and the same card in a narrow sidebar get identical styles even though they have very different space." },
  { code: { lang: "css",
    lines: [
     { c: ".card-area {", w: "" },
     { c: "  container-type: inline-size;", w: "**Declares this element a container** its children can query." },
     { c: "  container-name: card;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "@container card (min-width: 400px) {", w: "**Responds to the *container's* width, not the window's.** The same component adapts correctly wherever it is placed.", hi: true },
     { c: "  .card { display: grid; grid-template-columns: 120px 1fr; }", w: "" },
     { c: "}", w: "" }
    ],
    after: "This is what genuinely component-based CSS needed for a decade. Supported in every current browser; check your own audience before relying on it for a critical layout." } },

  { h: "The modern features worth using now" },
  { code: { lang: "css",
    lines: [
     { c: ".card { }", w: "" },
     { c: ".card:has(img) { padding-top: 0; }", w: "**`:has()` — the *parent* selector CSS never had.** Style an element based on what it contains. Genuinely new capability, not a shorthand.", hi: true },
     { c: "form:has(input:invalid) .submit { opacity: 0.5; }", w: "**Styling based on descendant state**, with no JavaScript." },
     { c: "", w: "" },
     { c: ".card {", w: "" },
     { c: "  color: var(--text);", w: "" },
     { c: "  & .title { font-weight: 700; }", w: "**Native nesting.** No preprocessor needed. Keep it two levels deep at most — deep nesting produces high specificity and unreadable selectors." },
     { c: "  &:hover { border-color: var(--accent); }", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "@layer reset, base, components, utilities;", w: "**Cascade layers.** Declares the priority order once, so a component always beats a reset regardless of specificity. The modern answer to specificity wars.", hi: true },
     { c: "@layer components { .button { padding: 1rem; } }", w: "" },
     { c: "", w: "" },
     { c: ".sidebar { position: sticky; top: 1rem; }", w: "**Scrolls normally until it hits the offset, then sticks.** Needs a scrollable ancestor and no `overflow: hidden` on a parent, which is why it sometimes appears not to work." },
     { c: "", w: "" },
     { c: "html { scroll-behavior: smooth; }", w: "" },
     { c: ":target { scroll-margin-top: 5rem; }", w: "**Stops a sticky header covering the section you jumped to.** A one-line fix for a very common annoyance." }
    ] } },

  { h: "Positioning, briefly" },
  { tbl: { h: ["`position`", "Behaviour"],
    rows: [
     ["`static`", "The default. Normal flow, ignores `top`/`left`"],
     ["`relative`", "**Nudged from where it would be**, and space is still reserved. **Mainly used to become a positioning context for a child**"],
     ["`absolute`", "Removed from flow, positioned against the nearest **positioned** ancestor. Overlays, badges, tooltips"],
     ["`fixed`", "Against the viewport, stays put while scrolling"],
     ["`sticky`", "**Normal until it hits a threshold, then fixed.** Headers and sidebars"]
    ] } },
  { code: { lang: "css",
    lines: [
     { c: ".card { position: relative; }", w: "**The parent becomes the reference.** Without this the badge positions against the whole page." },
     { c: ".badge { position: absolute; top: 0.5rem; right: 0.5rem; }", w: "" },
     { c: "", w: "" },
     { c: ".overlay { position: absolute; inset: 0; }", w: "**`inset: 0` is all four offsets at once** — the tidy way to cover a parent completely." }
    ] } },
  { trap: "`z-index` only works on positioned elements, and it is scoped to **stacking contexts**. A `z-index: 9999` inside a parent with `transform`, `opacity` below 1, or `filter` cannot escape that parent — so it still sits behind an element with `z-index: 2` elsewhere. When a z-index appears to be ignored, look up the ancestor chain for whichever property created the trapping context." },

  { h: "Testing it" },
  { ol: [
   "**Drag the browser window narrow.** Slowly. Every breakpoint reveals itself.",
   "**Use device mode** in DevTools (`Ctrl+Shift+M`), but do not trust it entirely — it does not reproduce touch, real fonts or actual performance.",
   "**Test on a real phone.** Serve locally over your network and open it on your device. Nothing else finds the tap target that is too small.",
   "**Zoom to 200%.** A legal requirement in many jurisdictions, and it finds fixed heights that clip their content.",
   "**Check for horizontal scroll.** `document.querySelectorAll('*').forEach(e => { if (e.scrollWidth > document.body.clientWidth) console.log(e) })` finds the element causing it."
  ] },

  { h: "Where this track has brought you" },
  { p: "You started with a rule that had a reputation for being unpredictable and ended with the procedure that governs it. The through-line has been the same three ideas the track promised: **the box model**, **the cascade**, and **how layout is computed**. Every property is easier once those are solid." },
  { l: [
   "**Build something and deploy it.** GitHub Pages, Netlify or Cloudflare Pages will host a static site free in about two minutes — and the Git track already showed you how to get it there.",
   "**Recreate a site you admire**, from a screenshot, without looking at its CSS. Nothing teaches faster.",
   "**Then JavaScript**, which is the third layer and the one that makes a page an application.",
   "**Keep MDN and caniuse.com open.** The reference and the support table; between them they answer almost every CSS question you will have."
  ] },
  { q: "CSS is not hard because the properties are hard. It is hard while you are guessing, and it stops being hard the moment you can predict what a change will do before you save the file.", by: "The whole of this track, in one sentence" },

  { tryit: { t: "Build a complete responsive page",
    task: "Build a landing page: sticky header, hero with fluid type, a responsive feature grid, and a footer. Mobile first, with at most two media queries. Support dark mode from tokens, and honour reduced motion. Then test it on a real phone.",
    hint: "`clamp` for the hero type, `auto-fit` for the grid, and tokens for everything colour-related. If you need more than two queries, look for a fluid alternative.",
    sol: { lang: "css", code: ":root {\n  --bg: hsl(0 0% 100%); --text: hsl(0 0% 12%);\n  --surface: hsl(0 0% 98%); --border: hsl(0 0% 90%);\n  --accent: hsl(220 90% 56%);\n  --space: clamp(1rem, 4vw, 2rem);\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg: hsl(0 0% 8%); --text: hsl(0 0% 92%);\n    --surface: hsl(0 0% 12%); --border: hsl(0 0% 22%);\n  }\n}\n\n*, *::before, *::after { box-sizing: border-box; }\nbody {\n  margin: 0; line-height: 1.6;\n  font-family: system-ui, sans-serif;\n  background: var(--bg); color: var(--text);\n}\nimg { display: block; max-width: 100%; }\n\n.container { width: min(100% - 2rem, 1100px); margin-inline: auto; }\n\n.site-header {\n  position: sticky; top: 0; z-index: 10;\n  background: var(--bg);\n  border-bottom: 1px solid var(--border);\n  padding-block: 1rem;\n}\n.site-header .container { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }\n\n.hero { padding-block: clamp(3rem, 12vw, 8rem); text-align: center; }\n.hero h1 { font-size: clamp(2rem, 6vw, 4rem); line-height: 1.1; margin: 0 0 1rem; }\n.hero p  { max-width: 55ch; margin-inline: auto; }\n\n.features {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: var(--space);\n  padding-block: var(--space);\n}\n.feature {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: var(--space);\n}\n\n:target { scroll-margin-top: 5rem; }\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}" },
    w: "That page has **no media queries at all** for layout — only the two preference queries. `clamp`, `min` and `auto-fit` handle every width on their own. That is the difference between responsive CSS written in 2015 and written now, and it is roughly a third of the code." } }
 ],
 k: [
  "Write mobile first with `min-width` queries so each one adds rather than undoes, and pick breakpoints from your content.",
  "`clamp`, `min` and `auto-fit` replace most media queries — modern responsive CSS has fewer breakpoints, not more.",
  "Container queries let a component respond to its own space rather than the viewport.",
  "`z-index` is scoped to stacking contexts — `transform`, `opacity` or `filter` on an ancestor traps it."
 ],
 r: ["Responsive Design", "CSS", "Media Query", "Viewport", "Dark Mode", "Web Accessibility", "CSS Grid"],
 drill: {
  lang: "css",
  reps: 4,
  items: [
   { c: "@media (min-width: 700px) { }", w: "add styles above a width, mobile first" },
   { c: "h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); }", w: "scale type with the viewport between two bounds" },
   { c: "width: min(100% - 2rem, 1100px);", w: "a centred container with a gutter, in one line" },
   { c: "@container card (min-width: 400px) { }", w: "respond to the container's width rather than the window's" },
   { c: ".card:has(img) { padding-top: 0; }", w: "style an element based on what it contains" },
   { c: "position: sticky; top: 1rem;", w: "scroll normally, then stick at an offset" },
   { c: ":target { scroll-margin-top: 5rem; }", w: "stop a sticky header covering the jumped-to section" }
  ]
 }
}

]);
