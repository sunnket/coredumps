/* CSS — the box model. */
TD.addLessons("css", [

{
 t: "The Box Model",
 m: "box",
 lvl: "core",
 s: "Every element is a box. Four layers, one setting that fixes the whole thing, and the margin behaviour nobody warns you about.",
 goal: [
  "Name the four layers of a box and what each does",
  "Explain what `box-sizing: border-box` changes and why it is the default you want",
  "Predict margin collapse instead of being surprised by it"
 ],
 b: [
  { p: "Everything the browser renders is a rectangular box. Layout is the arrangement of those boxes, and every layout problem is ultimately a question about one of them." },

  { h: "The four layers" },
  { code: { lang: "text", t: "From the inside out",
    lines: [
     { c: "  +-------------------------------------------+", w: "" },
     { c: "  |               MARGIN                      |", w: "**Space *outside* the border.** Pushes other elements away. Transparent — the background does not extend into it." },
     { c: "  |   +-----------------------------------+   |", w: "" },
     { c: "  |   |            BORDER                 |   |", w: "**A visible edge**, with its own width, style and colour." },
     { c: "  |   |   +---------------------------+   |   |", w: "" },
     { c: "  |   |   |         PADDING           |   |   |", w: "**Space *inside* the border.** The background **does** extend into it — which is the main practical difference from margin." },
     { c: "  |   |   |   +-------------------+   |   |   |", w: "" },
     { c: "  |   |   |   |     CONTENT       |   |   |   |", w: "**The text or image itself.** `width` and `height` refer to this box — or not, depending on `box-sizing`.", hi: true },
     { c: "  |   |   |   +-------------------+   |   |   |", w: "" },
     { c: "  |   |   +---------------------------+   |   |", w: "" },
     { c: "  |   +-----------------------------------+   |", w: "" },
     { c: "  +-------------------------------------------+", w: "" }
    ] } },
  { l: [
   "**Padding when** you want space inside — around text in a button or a card. It takes the background colour and it is part of the clickable area.",
   "**Margin when** you want space between elements. Transparent, and it collapses (see below).",
   "**The test:** should the background colour be there? Padding if yes, margin if no."
  ] },

  { h: "The one line that fixes sizing" },
  { p: "By default, `width` sets the width of the **content box only** — padding and border are added on top. This means a box you declared as 300px wide is not 300px wide." },
  { vs: { t: "The same declaration, two behaviours", lang: "css",
    bad: { c: ".card {\n  box-sizing: content-box;  /* the default */\n  width: 300px;\n  padding: 20px;\n  border: 2px solid;\n}\n\n/* actual width on screen:\n   300 + 20 + 20 + 2 + 2 = 344px */", label: "content-box — the default",
      w: "**You asked for 300 and got 344.** Put two of these in a 600px container expecting a perfect fit and they wrap. Every change to the padding changes the outer width." },
    good: { c: ".card {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid;\n}\n\n/* actual width on screen: 300px\n   content shrinks to 256px to fit */", label: "border-box",
      w: "**300px means 300px.** Padding and border are subtracted from the inside. Change the padding and the outer size does not move — which is what you meant every time." } } },
  { code: { lang: "css", t: "Put this at the top of every project",
    lines: [
     { c: "*, *::before, *::after {", w: "" },
     { c: "  box-sizing: border-box;", w: "**Universally recommended, and there is no real argument against it.** It has been the standard first line of every reset for over a decade.", hi: true },
     { c: "}", w: "" }
    ],
    after: "This is the closest thing CSS has to a free win. Nothing else removes so much confusion for so little typing." } },
  { n: "`width: 100%` with padding is where this bites hardest. Under `content-box` that is *100% of the parent, plus your padding* — so the element overflows its container and a horizontal scrollbar appears. Under `border-box` it fits. That is the mystery scrollbar, solved.",
    nt: "The horizontal scrollbar, explained" },

  { h: "Writing the values" },
  { code: { lang: "css",
    lines: [
     { c: "padding: 20px;", w: "**All four sides.**" },
     { c: "padding: 10px 20px;", w: "**Vertical, horizontal.** The most-used form." },
     { c: "padding: 10px 20px 30px;", w: "Top, horizontal, bottom." },
     { c: "padding: 10px 20px 30px 40px;", w: "**Top, right, bottom, left — clockwise from the top.**" },
     { c: "", w: "" },
     { c: "padding-block: 10px;", w: "**Logical properties: block is the text-flow direction.** In English that is vertical; in a right-to-left or vertical language it adapts automatically." },
     { c: "padding-inline: 20px;", w: "**Inline is across the text direction.** `margin-inline: auto` is the modern way to centre a block, and it is what the first lesson used.", hi: true },
     { c: "", w: "" },
     { c: "border: 2px solid #ddd;", w: "**Width, style, colour.** Without a style, nothing appears — `border: 2px` alone is invisible." },
     { c: "border-radius: 8px;", w: "**Rounded corners.** `50%` on a square makes a circle." },
     { c: "border-block-end: 1px solid;", w: "One side, logically." }
    ] } },

  { h: "Margin collapse" },
  { p: "The behaviour that surprises everyone: **adjacent vertical margins do not add up — the larger one wins.**" },
  { code: { lang: "text", t: "Two paragraphs, 30px apart, not 50px",
    lines: [
     { c: "  <p style=\"margin-bottom: 30px\">First</p>", w: "" },
     { c: "  <p style=\"margin-top: 20px\">Second</p>", w: "" },
     { c: "", w: "" },
     { c: "  gap between them:  30px", w: "**Not 50.** The larger margin absorbs the smaller.", hi: true },
     { c: "", w: "" },
     { c: "  It only happens:", w: "" },
     { c: "    - vertically, never horizontally", w: "" },
     { c: "    - in normal flow  (never in flexbox or grid)", w: "**This is the important exemption.** Inside a flex or grid container, margins never collapse — which is one of many reasons modern layout is easier." },
     { c: "    - with nothing between them: no border, no padding,", w: "" },
     { c: "      no line of content", w: "" }
    ] } },
  { code: { lang: "css", t: "The parent-child version, which looks like a bug",
    lines: [
     { c: ".parent { background: pink; }", w: "" },
     { c: ".child  { margin-top: 40px; }", w: "**The child's top margin escapes the parent** and pushes the *parent* down instead — leaving no gap inside it. Every developer meets this and assumes something is broken.", hi: true },
     { c: "", w: "" },
     { c: "/* any of these stop it: */", w: "" },
     { c: ".parent { padding-top: 1px; }", w: "" },
     { c: ".parent { border-top: 1px solid transparent; }", w: "" },
     { c: ".parent { display: flow-root; }", w: "**The purpose-built fix**, with no visual side effects at all. Use this one." },
     { c: ".parent { display: flex; }", w: "**Or use a flex container**, where collapse does not happen — which is what you would be doing anyway in modern layout." }
    ] } },
  { n: "The cleanest way to sidestep margin collapse entirely: **set margins in one direction only** — `margin-bottom` on everything, never `margin-top` — or use `gap` in a flex or grid container, which does not collapse and is the modern answer. Consistency removes the problem rather than working around it.",
    nt: "How to stop meeting it at all" },

  { h: "Sizing" },
  { code: { lang: "css",
    lines: [
     { c: "width: 300px;", w: "**Fixed. Rarely what you want** — it cannot adapt to a narrow screen." },
     { c: "width: 50%;", w: "**Half the *parent's* width.**" },
     { c: "max-width: 600px;", w: "**Never wider than this.** Combined with a percentage width, this is the foundation of a responsive layout.", hi: true },
     { c: "min-width: 200px;", w: "Never narrower." },
     { c: "width: min(100%, 600px);", w: "**Whichever is smaller** — 600px on a desktop, full width on a phone. One line replacing a media query." },
     { c: "width: clamp(300px, 50%, 800px);", w: "**Minimum, preferred, maximum.** Genuinely useful, and it removes a great many breakpoints." },
     { c: "", w: "" },
     { c: "height: 100vh;", w: "**The full viewport height.** On mobile, `100dvh` accounts for the browser chrome that appears and disappears while scrolling — which is why `100vh` designs jump on phones." },
     { c: "aspect-ratio: 16 / 9;", w: "**Height derived from width.** Replaces the old padding-percentage hack entirely." },
     { c: "", w: "" },
     { c: "width: fit-content;", w: "As wide as its content needs." },
     { c: "min-height: 100%;", w: "**Percentage heights need the parent to have a height**, or they are ignored. A very common source of *why is my height not working*." }
    ] } },

  { h: "Units" },
  { tbl: { h: ["Unit", "Relative to", "Use for"],
    rows: [
     ["`px`", "Nothing — absolute", "Borders, small fixed details"],
     ["**`rem`**", "**The root font size** (16px by default)", "**Font sizes, spacing, most things.** Respects the user's browser font setting"],
     ["`em`", "**The element's own font size**", "Padding that should scale with its text. Compounds when nested — a known trap"],
     ["`%`", "The parent's corresponding dimension", "Widths in a fluid layout"],
     ["`vw` / `vh`", "Viewport width / height", "Full-screen sections. Prefer `dvh` on mobile"],
     ["`ch`", "The width of `0` in the current font", "**Line lengths** — `65ch` is the readable ideal"],
     ["`fr`", "A fraction of leftover grid space", "Grid columns — the layout lesson"]
    ] } },
  { trap: "**Never set font sizes in `px`.** A user who has set their browser's default font to 20px because they need it larger gets 16px anyway, and cannot fix it. `rem` scales with that setting. This is one of the most common real accessibility failures on the web, and it costs three characters to avoid." },

  { h: "display" },
  { code: { lang: "css",
    lines: [
     { c: "display: block;", w: "Full width, starts a new line." },
     { c: "display: inline;", w: "**Flows with text. Ignores width, height and vertical margins** — which is why setting a height on a `<span>` appears to do nothing." },
     { c: "display: inline-block;", w: "**Flows inline but accepts width and height.** Largely superseded by flexbox." },
     { c: "display: flex;", w: "**The next lesson.**" },
     { c: "display: grid;", w: "" },
     { c: "display: none;", w: "**Removed entirely** — no space taken, and invisible to screen readers." },
     { c: "visibility: hidden;", w: "**Invisible but still occupying its space.** Genuinely different from `display: none`, and occasionally what you want." }
    ] } },

  { tryit: { t: "Build a card, and measure it",
    task: "Build a card with a border, padding, a rounded corner and a shadow. Set an explicit width, then use Inspect's box diagram to confirm the rendered width matches. Toggle `box-sizing` between the two values and watch it change.",
    hint: "The box diagram is at the bottom of the Computed tab. Hover each layer to highlight it on the page.",
    sol: { lang: "css", code: "*, *::before, *::after { box-sizing: border-box; }\n\n.card {\n  width: 320px;\n  padding: 1.5rem;\n  border: 1px solid #e5e5e5;\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08),\n              0 8px 24px rgb(0 0 0 / 0.04);\n\n  /* one direction only, so nothing collapses unexpectedly */\n  margin-bottom: 1.5rem;\n}\n\n.card > * { margin-block: 0; }\n.card > * + * { margin-block-start: 0.75rem; }" },
    w: "The last two lines are the *lobotomised owl*, `* + *`: space between siblings but never before the first or after the last. It sidesteps margin collapse entirely and is one of the most quietly useful patterns in CSS." } }
 ],
 k: [
  "Content, padding, border, margin — padding takes the background, margin does not.",
  "`box-sizing: border-box` on everything makes `width` mean the width you see; it is the standard first line of any reset.",
  "Adjacent vertical margins collapse to the larger, and a child's margin can escape its parent — `display: flow-root` or a flex container stops it.",
  "Use `rem` for font sizes so the user's browser setting is respected; `px` fonts ignore it entirely."
 ],
 r: ["Box Model", "CSS", "Responsive Design", "Web Accessibility", "Viewport"],
 drill: {
  lang: "css",
  reps: 4,
  items: [
   { c: "*, *::before, *::after { box-sizing: border-box; }", w: "make width mean the visible width" },
   { c: "padding: 10px 20px;", w: "set vertical and horizontal padding in one line" },
   { c: "margin-inline: auto;", w: "centre a block element horizontally" },
   { c: "max-width: 600px;", w: "cap an element's width so it adapts on small screens" },
   { c: "width: clamp(300px, 50%, 800px);", w: "give a width a minimum, a preference and a maximum" },
   { c: "aspect-ratio: 16 / 9;", w: "derive height from width" },
   { c: "display: flow-root;", w: "stop a child's margin escaping its parent" }
  ]
 }
}

]);
