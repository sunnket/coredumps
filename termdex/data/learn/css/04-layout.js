/* CSS — Flexbox and Grid. */
TD.addLessons("css", [

{
 t: "Flexbox — Layout in One Direction",
 m: "layout",
 lvl: "core",
 s: "The system that made CSS layout genuinely good, and the four properties that cover most of it.",
 goal: [
  "Lay out a row or column and control its alignment",
  "Explain the main axis and cross axis and why the properties swap",
  "Use flex-grow and flex-basis to distribute space"
 ],
 b: [
  { p: "Before 2015, vertically centring a box was a genuine problem with several bad answers. Flexbox made it one line. It is the tool for arranging items **along one axis** — a row or a column — and it is what you reach for most days." },

  { h: "The two axes" },
  { p: "Everything in flexbox depends on this, and it is the reason the property names feel arbitrary until it lands." },
  { code: { lang: "text",
    lines: [
     { c: "  flex-direction: row   (the default)", w: "" },
     { c: "", w: "" },
     { c: "     main axis  ------------------------->   horizontal", w: "**`justify-content` works along the main axis.**", hi: true },
     { c: "     cross axis  |                           vertical", w: "**`align-items` works along the cross axis.**" },
     { c: "                 v", w: "" },
     { c: "", w: "" },
     { c: "  flex-direction: column", w: "" },
     { c: "", w: "" },
     { c: "     main axis   |                          now vertical", w: "**The axes swap, and so do the two properties.** `justify-content` now controls vertical position. This is the single thing to hold on to." },
     { c: "                 v", w: "" },
     { c: "     cross axis  ------------------------->  now horizontal", w: "" }
    ] } },
  { dg: "flexbox" },
  { n: "The mnemonic that sticks: **`justify` = the direction things flow; `align` = across it.** Change `flex-direction` and both meanings rotate. Almost every *why is this not centring* moment in flexbox is having used one when you meant the other.",
    nt: "justify flows, align crosses" },

  { h: "The container properties" },
  { code: { lang: "css",
    lines: [
     { c: ".container {", w: "" },
     { c: "  display: flex;", w: "**Makes the *children* flex items.** The container itself is still a normal block." },
     { c: "", w: "" },
     { c: "  flex-direction: row;", w: "`row` (default), `column`, `row-reverse`, `column-reverse`." },
     { c: "", w: "" },
     { c: "  justify-content: space-between;", w: "**Along the main axis.** `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`.", hi: true },
     { c: "", w: "" },
     { c: "  align-items: center;", w: "**Across the cross axis.** `stretch` (the default — which is why flex children are all the same height), `flex-start`, `center`, `flex-end`, `baseline`." },
     { c: "", w: "" },
     { c: "  gap: 1rem;", w: "**Space between items.** Replaces margins on children entirely — no margin on the first or last, and it never collapses. Use this.", hi: true },
     { c: "", w: "" },
     { c: "  flex-wrap: wrap;", w: "**Items may move to a new line when they run out of room.** The default is `nowrap`, which squashes them instead — and is a common cause of unreadable narrow columns on mobile." },
     { c: "}", w: "" }
    ] } },

  { h: "The patterns you will write constantly" },
  { code: { lang: "css", t: "1 — perfect centring",
    lines: [
     { c: ".center {", w: "" },
     { c: "  display: flex;", w: "" },
     { c: "  justify-content: center;", w: "Horizontally." },
     { c: "  align-items: center;", w: "Vertically. **Three lines for what once took a page of tricks.**", hi: true },
     { c: "  min-height: 100dvh;", w: "" },
     { c: "}", w: "" }
    ] } },
  { code: { lang: "css", t: "2 — a navigation bar",
    lines: [
     { c: ".navbar {", w: "" },
     { c: "  display: flex;", w: "" },
     { c: "  justify-content: space-between;", w: "**Logo left, links right**, with the space between them." },
     { c: "  align-items: center;", w: "**Vertically centred**, whatever the heights differ by." },
     { c: "  gap: 2rem;", w: "" },
     { c: "  padding: 1rem 2rem;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".navbar nav ul {", w: "" },
     { c: "  display: flex;", w: "**Nested flex containers are normal.** A list of links laid out in a row." },
     { c: "  gap: 1.5rem;", w: "" },
     { c: "  list-style: none;", w: "" },
     { c: "  margin: 0; padding: 0;", w: "" },
     { c: "}", w: "" }
    ] } },
  { code: { lang: "css", t: "3 — a card that fills its space, with the button at the bottom",
    lines: [
     { c: ".card {", w: "" },
     { c: "  display: flex;", w: "" },
     { c: "  flex-direction: column;", w: "**Now the main axis is vertical.**" },
     { c: "  height: 100%;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".card-body {", w: "" },
     { c: "  flex-grow: 1;", w: "**Take all the leftover space.** The button below is pushed to the bottom, and every card in a row lines up regardless of how much text each holds.", hi: true },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".card-footer { margin-top: auto; }", w: "**An alternative: `auto` margin absorbs free space.** `margin-left: auto` on a flex item pushes it to the right — the classic *this one goes on the end* trick." }
    ] } },

  { h: "The item properties" },
  { code: { lang: "css",
    lines: [
     { c: ".item {", w: "" },
     { c: "  flex-grow: 1;", w: "**Share of the leftover space.** Two items with `1` split it equally; one with `2` takes twice as much." },
     { c: "  flex-shrink: 1;", w: "**How willingly it gives up space when there is not enough.** `0` means never shrink." },
     { c: "  flex-basis: 200px;", w: "**Starting size before growing or shrinking.** `auto` means *use the content's size*." },
     { c: "", w: "" },
     { c: "  flex: 1;", w: "**The shorthand for `1 1 0` — grow, shrink, and ignore content size.** Equal columns regardless of content. **This is the one you want most of the time.**", hi: true },
     { c: "  flex: 0 0 200px;", w: "**A fixed 200px that never grows or shrinks** — a sidebar." },
     { c: "  flex: 1 1 300px;", w: "**At least 300px, but flexible.** With `flex-wrap: wrap` on the container, this is a responsive card grid with no media queries at all." },
     { c: "", w: "" },
     { c: "  align-self: flex-start;", w: "**Override the container's `align-items` for this item alone.**" },
     { c: "  order: 2;", w: "**Change visual order without changing the HTML.** Use sparingly — it does *not* change tab order, so a keyboard user gets a confusing sequence." },
     { c: "}", w: "" }
    ] } },
  { code: { lang: "css", t: "A sidebar layout in six lines",
    lines: [
     { c: ".layout { display: flex; gap: 2rem; }", w: "" },
     { c: ".sidebar { flex: 0 0 240px; }", w: "**Fixed width, never flexes.**" },
     { c: ".content { flex: 1; }", w: "**Everything else.** Resize the window and the content adapts while the sidebar holds." },
     { c: "", w: "" },
     { c: "@media (max-width: 700px) {", w: "" },
     { c: "  .layout { flex-direction: column; }", w: "**Stacks on a phone.** One property in one media query." },
     { c: "}", w: "" }
    ] } },

  { h: "The traps" },
  { trap: "**A flex item will not shrink below its content's minimum size**, because `min-width` defaults to `auto`. A long unbroken string — a URL, a code sample — forces the item wide and overflows the container. The fix is `min-width: 0` on the flex item, and it is one of the most-searched CSS problems there is." },
  { l: [
   "**`align-items: stretch` is the default**, which is why flex children are all the same height even when you did not ask. Usually helpful; occasionally the surprise.",
   "**`gap` beats margins on children.** No first/last special cases, and no collapse.",
   "**Flexbox is one-dimensional.** If you are fighting to align things in both a row *and* a column, you want Grid — that is the next lesson."
  ] },

  { tryit: { t: "Build a page header",
    task: "Build a header with a logo on the left, navigation links in the centre, and a button on the right — all vertically centred, with sensible spacing. Then make it stack into a column below 600px.",
    hint: "`justify-content: space-between` on the outer container, `flex: 1` on the nav to let it take the middle.",
    sol: { lang: "css", code: ".site-header {\n  display: flex;\n  align-items: center;\n  gap: 2rem;\n  padding: 1rem 1.5rem;\n  border-bottom: 1px solid #eee;\n}\n\n.logo { font-weight: 700; }\n\n.site-nav {\n  flex: 1;                    /* takes the middle */\n  display: flex;\n  justify-content: center;\n  gap: 1.5rem;\n}\n\n.site-nav ul {\n  display: flex;\n  gap: 1.5rem;\n  list-style: none;\n  margin: 0; padding: 0;\n}\n\n@media (max-width: 600px) {\n  .site-header { flex-direction: column; align-items: stretch; }\n  .site-nav ul { flex-wrap: wrap; justify-content: center; }\n}" },
    w: "`flex: 1` on the nav is what centres it properly: it takes all the leftover space, so its own `justify-content: center` centres the links within that space rather than within the whole header. Without it the nav is only as wide as its links and *centre* means something different." } }
 ],
 k: [
  "`justify-content` works along the main axis, `align-items` across it — and both rotate when `flex-direction` changes.",
  "`gap` replaces margins between children: no first/last special cases and no collapse.",
  "`flex: 1` means grow, shrink and ignore content size — equal columns. `flex: 0 0 240px` is a fixed sidebar.",
  "A flex item will not shrink below its content unless you set `min-width: 0` — the fix for long URLs overflowing."
 ],
 r: ["Flexbox", "CSS", "Responsive Design", "Box Model"],
 drill: {
  lang: "css",
  reps: 4,
  items: [
   { c: "display: flex; justify-content: center; align-items: center;", w: "centre something both ways" },
   { c: "justify-content: space-between;", w: "push items to the two ends" },
   { c: "gap: 1rem;", w: "space flex items without margins" },
   { c: "flex: 1;", w: "make an item take an equal share of the space" },
   { c: "flex: 0 0 240px;", w: "a fixed-width item that never flexes" },
   { c: "flex-wrap: wrap;", w: "let items move to a new line instead of squashing" },
   { c: "min-width: 0;", w: "let a flex item shrink below its content", hint: "the long-URL fix" }
  ]
 }
},

{
 t: "Grid — Layout in Two Directions",
 m: "layout",
 lvl: "intermediate",
 s: "Rows and columns at once, and the one line that makes a responsive card grid with no media queries.",
 goal: [
  "Define a grid and place items in it",
  "Use fr, repeat, minmax and auto-fit",
  "Choose between Grid and Flexbox without agonising"
 ],
 b: [
  { p: "Flexbox arranges along one axis. **Grid arranges along two at once** — you define rows and columns and place items into them. For page layout it is the better tool, and for card grids it does something flexbox cannot." },

  { h: "Defining a grid" },
  { code: { lang: "css",
    lines: [
     { c: ".grid {", w: "" },
     { c: "  display: grid;", w: "" },
     { c: "  grid-template-columns: 200px 1fr 200px;", w: "**Three columns: fixed, flexible, fixed.** `1fr` is *one fraction of the leftover space* — a unit that exists only in Grid and is the reason it is so pleasant.", hi: true },
     { c: "  grid-template-rows: auto 1fr auto;", w: "**`auto` sizes to content, `1fr` takes what is left.** A classic header/content/footer split." },
     { c: "  gap: 1rem;", w: "**Same `gap` as flexbox.** `row-gap` and `column-gap` separately if needed." },
     { c: "  min-height: 100dvh;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "  grid-template-columns: repeat(3, 1fr);", w: "**`repeat` avoids writing `1fr 1fr 1fr`.** Three equal columns." },
     { c: "  grid-template-columns: repeat(4, minmax(0, 1fr));", w: "**`minmax(0, 1fr)` rather than plain `1fr`** — it lets the column shrink below its content, which is Grid's version of the flexbox `min-width: 0` trap." }
    ] } },

  { h: "The responsive grid with no media queries" },
  { code: { lang: "css", t: "The single most useful line in modern CSS",
    lines: [
     { c: ".cards {", w: "" },
     { c: "  display: grid;", w: "" },
     { c: "  grid-template-columns:", w: "" },
     { c: "    repeat(auto-fit, minmax(280px, 1fr));", w: "**Fit as many columns as will hold 280px, and share the leftover space between them.** Four columns on a desktop, two on a tablet, one on a phone — automatically, with no breakpoints written at all.", hi: true },
     { c: "  gap: 1.5rem;", w: "" },
     { c: "}", w: "" }
    ],
    after: "This one declaration replaces what used to be three media queries and a float-clearing hack. It also adapts to container widths you never anticipated, which a fixed set of breakpoints cannot." } },
  { l: [
   "**`auto-fit`** collapses empty tracks, so three items stretch to fill the row.",
   "**`auto-fill`** keeps empty tracks, so three items stay at their natural width with a gap after them.",
   "**Use `auto-fit`** unless you specifically want the second behaviour."
  ] },

  { h: "Placing items" },
  { code: { lang: "css",
    lines: [
     { c: ".featured {", w: "" },
     { c: "  grid-column: 1 / 3;", w: "**From line 1 to line 3 — spanning two columns.** Grid counts the *lines* between tracks, not the tracks themselves, which is the one counting quirk to absorb." },
     { c: "  grid-column: span 2;", w: "**Usually easier: span two from wherever this item lands.**", hi: true },
     { c: "  grid-row: 1 / -1;", w: "**`-1` is the last line** — full height, however many rows there are." },
     { c: "}", w: "" }
    ] } },
  { code: { lang: "css", t: "Named areas — a whole page layout you can read",
    lines: [
     { c: ".page {", w: "" },
     { c: "  display: grid;", w: "" },
     { c: "  grid-template-areas:", w: "**Draw the layout as text.** Genuinely readable, and reviewable by someone who does not know CSS.", hi: true },
     { c: "    \"header header\"", w: "" },
     { c: "    \"sidebar main\"", w: "" },
     { c: "    \"footer footer\";", w: "**A repeated name spans those cells.** A `.` means an empty cell." },
     { c: "  grid-template-columns: 240px 1fr;", w: "" },
     { c: "  grid-template-rows: auto 1fr auto;", w: "" },
     { c: "  gap: 1rem;", w: "" },
     { c: "  min-height: 100dvh;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".site-header { grid-area: header; }", w: "**Each item names its area.** No line numbers to count." },
     { c: ".sidebar     { grid-area: sidebar; }", w: "" },
     { c: ".content     { grid-area: main; }", w: "" },
     { c: ".site-footer { grid-area: footer; }", w: "" },
     { c: "", w: "" },
     { c: "@media (max-width: 700px) {", w: "" },
     { c: "  .page {", w: "" },
     { c: "    grid-template-areas: \"header\" \"main\" \"sidebar\" \"footer\";", w: "**Redraw it for mobile — and note the sidebar now comes *after* the main content**, which you cannot do with source order alone." },
     { c: "    grid-template-columns: 1fr;", w: "" },
     { c: "  }", w: "" },
     { c: "}", w: "" }
    ] } },
  { trap: "Reordering visually with `grid-area` or `order` does **not** change the tab order — the keyboard still follows the HTML. Move things far from their source position and a keyboard user tabs around the page in a sequence that makes no sense. Keep visual order close to source order, and reorder only within a small region." },

  { h: "Alignment in Grid" },
  { code: { lang: "css",
    lines: [
     { c: ".grid {", w: "" },
     { c: "  justify-items: center;", w: "**Each item horizontally, within its own cell.**" },
     { c: "  align-items: center;", w: "**Each item vertically, within its cell.**" },
     { c: "  place-items: center;", w: "**Both at once.** `place-items: center` on a grid is the shortest perfect centring in CSS.", hi: true },
     { c: "", w: "" },
     { c: "  justify-content: center;", w: "**The whole *grid* within the container** — relevant when the columns do not fill it." },
     { c: "  align-content: center;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".item { place-self: end center; }", w: "One item's own alignment." }
    ] } },

  { h: "Grid or Flexbox" },
  { tbl: { h: ["", "Flexbox", "Grid"],
    rows: [
     ["Dimensions", "**One** — a row or a column", "**Two** — rows and columns together"],
     ["Sizing driven by", "**The content**", "**The container** — you define the tracks"],
     ["Reach for it for", "Navigation bars, button rows, centring, toolbars, anything in a line", "Page layout, card grids, forms, dashboards, anything aligned in both directions"],
     ["Wrapping", "Items wrap but do not align into columns", "**Items align into columns automatically**"],
     ["Overlapping items", "No", "**Yes** — items can share cells"]
    ] } },
  { n: "They are not competitors and real pages use both constantly: Grid for the page skeleton and the card grid, Flexbox for the contents of each card and each navigation bar. **Two dimensions → Grid. One line of things → Flexbox.** If you are unsure, either will probably work.",
    nt: "Both, on the same page" },

  { h: "Two more things worth knowing" },
  { code: { lang: "css",
    lines: [
     { c: ".grid { grid-auto-rows: minmax(150px, auto); }", w: "**Rows you did not explicitly define** — at least 150px, taller if the content needs it." },
     { c: ".grid { grid-auto-flow: dense; }", w: "**Backfills gaps** left by spanning items. Note it decouples visual order from source order, with the tab-order consequence above." },
     { c: "", w: "" },
     { c: ".stack { display: grid; }", w: "**Every child in cell 1/1 stacks them on top of each other** — a simpler alternative to absolute positioning for overlays." },
     { c: ".stack > * { grid-area: 1 / 1; }", w: "" }
    ] } },

  { tryit: { t: "Build a dashboard layout",
    task: "Build a page with a full-width header, a fixed sidebar, a main area holding a responsive card grid, and a footer. Use named areas for the page and `auto-fit` for the cards. Make it stack sensibly on mobile.",
    hint: "Two grids: the page skeleton with `grid-template-areas`, and the cards with `repeat(auto-fit, minmax(...))`.",
    sol: { lang: "css", code: ".page {\n  display: grid;\n  grid-template-areas:\n    \"header header\"\n    \"sidebar main\"\n    \"footer footer\";\n  grid-template-columns: 240px 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 1.5rem;\n  min-height: 100dvh;\n}\n\n.site-header { grid-area: header; }\n.sidebar     { grid-area: sidebar; }\n.content     { grid-area: main; }\n.site-footer { grid-area: footer; }\n\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 1.5rem;\n}\n\n.card {\n  display: flex;            /* flexbox inside grid — normal */\n  flex-direction: column;\n  gap: 0.75rem;\n  padding: 1.25rem;\n  border: 1px solid #eee;\n  border-radius: 12px;\n}\n\n.card .actions { margin-top: auto; }   /* pin to the bottom */\n\n@media (max-width: 700px) {\n  .page {\n    grid-template-areas: \"header\" \"main\" \"sidebar\" \"footer\";\n    grid-template-columns: 1fr;\n  }\n}" },
    w: "Grid for the two-dimensional structure, Flexbox inside each card for its one-dimensional stack. That combination — Grid outside, Flexbox inside — is how most modern layouts are actually built, and neither tool is doing the other's job." } }
 ],
 k: [
  "`fr` is a fraction of leftover space; `repeat(auto-fit, minmax(280px, 1fr))` is a responsive grid with no media queries.",
  "`grid-template-areas` draws the layout as readable text, and each item claims one with `grid-area`.",
  "`place-items: center` on a grid is the shortest perfect centring in CSS.",
  "Two dimensions → Grid; one line of things → Flexbox. Real pages use Grid outside and Flexbox inside."
 ],
 r: ["CSS Grid", "Flexbox", "CSS", "Responsive Design", "Web Accessibility"],
 drill: {
  lang: "css",
  reps: 4,
  items: [
   { c: "grid-template-columns: 200px 1fr 200px;", w: "two fixed columns with a flexible one between" },
   { c: "grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));", w: "a card grid that reflows with no breakpoints" },
   { c: "grid-column: span 2;", w: "make an item cover two columns" },
   { c: "grid-template-areas: \"header header\" \"sidebar main\";", w: "draw a page layout as text" },
   { c: "place-items: center;", w: "centre every item in its cell, both ways" },
   { c: "grid-auto-rows: minmax(150px, auto);", w: "size rows you did not define explicitly" }
  ]
 }
}

]);
