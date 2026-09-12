/* CSS — what CSS is doing. */
TD.addLessons("css", [

{
 t: "How a Stylesheet Reaches an Element",
 m: "brief",
 lvl: "core",
 s: "The shape of a rule, the three ways to attach one, and what the browser does with all of them.",
 goal: [
  "Read any CSS rule and name its parts",
  "Attach a stylesheet the way real projects do",
  "Say what the browser is doing when several rules apply to one element"
 ],
 b: [
  { p: "CSS has a reputation for being fiddly, and it is almost entirely undeserved. What makes it feel unpredictable is not knowing the procedure the browser follows — and that procedure is short." },

  { h: "The shape of a rule" },
  { syn: { t: "Every rule, taken apart",
    parts: [
     { p: "h1", w: "**The selector** — which elements this applies to. Here, every `<h1>` on the page." },
     { p: " { " },
     { p: "color", w: "**A property** — which aspect of appearance you are setting." },
     { p: ": " },
     { p: "#1a1a1a", w: "**The value.**" },
     { p: "; ", w: "**The semicolon ends the declaration.** Required between declarations; conventional after the last one too, so adding another does not break it." },
     { p: "font-size: 2rem;", w: "**Another declaration.** Any number inside the braces." },
     { p: " }" }
    ],
    after: "Selector, then a block of property-value pairs. Every rule in every stylesheet ever written is this shape." } },
  { code: { lang: "css",
    lines: [
     { c: "h1 {", w: "" },
     { c: "  color: #1a1a1a;", w: "**One declaration per line**, indented. Not required, universally done." },
     { c: "  font-size: 2rem;", w: "" },
     { c: "  margin-bottom: 0.5em;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "h1, h2, h3 {", w: "**A comma-separated selector list** — the rule applies to all three." },
     { c: "  font-family: system-ui, sans-serif;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "/* a comment. There is no line-comment form in CSS. */", w: "**Only `/* */`.** `//` is not valid CSS, though preprocessors accept it — which is why it sometimes appears to work." }
    ] } },

  { h: "Attaching it" },
  { code: { lang: "html", t: "Three ways, one of which you should use",
    lines: [
     { c: "<link rel=\"stylesheet\" href=\"/css/styles.css\">", w: "**An external file, linked from `<head>`. This is the answer.** Cached across pages, editable in one place, and it keeps the markup readable.", hi: true },
     { c: "", w: "" },
     { c: "<style>", w: "**Embedded in the page.** Fine for a single-file demo, and used deliberately for a small block of critical CSS that must apply before an external file downloads." },
     { c: "  h1 { color: red; }", w: "" },
     { c: "</style>", w: "" },
     { c: "", w: "" },
     { c: "<h1 style=\"color: red\">Hello</h1>", w: "**Inline. Avoid it.** It applies to one element, cannot be reused, cannot handle hover or media queries, and beats almost everything else in the cascade — which makes it very hard to override later." }
    ] } },

  { h: "What the browser does" },
  { p: "Several rules can target the same element, and they can disagree. Rather than guessing, the browser follows a fixed procedure for every property of every element." },
  { code: { lang: "text", t: "How one property gets its final value",
    lines: [
     { c: "1. COLLECT   every declaration that targets this element", w: "**From your stylesheets, from inline styles, and from the browser's own defaults.**" },
     { c: "", w: "" },
     { c: "2. CASCADE   sort them: origin & importance, then specificity,", w: "" },
     { c: "             then source order. The last one standing wins.", w: "**This is what *cascading* means**, and it is the next lesson.", hi: true },
     { c: "", w: "" },
     { c: "3. INHERIT   if nothing targeted it, some properties are", w: "" },
     { c: "             taken from the parent (color, font); most are not", w: "" },
     { c: "", w: "" },
     { c: "4. DEFAULT   otherwise use the property's initial value", w: "" },
     { c: "", w: "" },
     { c: "5. COMPUTE   resolve relative units — em, %, rem — into", w: "" },
     { c: "             absolute values", w: "" }
     ] } },
  { n: "Almost every moment of *why is my CSS being ignored* is really step 2. The element is being styled, correctly, by a different rule that won. The Inspect panel's Styles pane shows every rule that matched and strikes through the ones that lost — which turns the question into a two-second look.",
    nt: "Where the confusion actually comes from" },

  { h: "The browser's own stylesheet" },
  { p: "An unstyled page is not unstyled. Every browser ships defaults — headings are bold and large, links are blue and underlined, lists have bullets, `<body>` has a margin." },
  { code: { lang: "css", t: "A minimal, modern reset",
    lines: [
     { c: "*, *::before, *::after {", w: "**Every element and its generated boxes.**" },
     { c: "  box-sizing: border-box;", w: "**The single most valuable line in CSS.** The box-model lesson explains exactly what it fixes; put it in every project.", hi: true },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "body {", w: "" },
     { c: "  margin: 0;", w: "**Removes the default 8px margin** that causes the mysterious white gap around a full-width page." },
     { c: "  line-height: 1.5;", w: "**The default is around 1.2, which is too tight for body text.**" },
     { c: "  -webkit-font-smoothing: antialiased;", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "img, picture, video, canvas, svg {", w: "" },
     { c: "  display: block;", w: "**Images are inline by default**, which leaves a few pixels of gap underneath for the text baseline. This removes the most-asked-about mystery gap in CSS." },
     { c: "  max-width: 100%;", w: "**No image can ever overflow its container.** One line, and a whole class of mobile layout bug disappears." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "input, button, textarea, select {", w: "" },
     { c: "  font: inherit;", w: "**Form controls do not inherit fonts** — they use the OS default unless told otherwise." },
     { c: "}", w: "" }
    ],
    after: "Around fifteen lines that remove almost every default that fights you. Larger resets exist — normalize.css, Josh Comeau's — and this is the core of all of them." } },
  { trap: "A reset that includes `*:focus { outline: none }` — and several old ones do — makes the site unusable by keyboard. If you adopt someone's reset, read it for that line. The HTML track's semantics lesson covers why it matters; the fix is to restyle the focus ring, never to remove it." },

  { h: "Debugging with Inspect" },
  { l: [
   "**The Styles pane** lists every rule that matched, most specific first. **Overridden declarations are struck through** — that strike-through is the answer to *why is this being ignored*.",
   "**The Computed tab** shows the final value of every property, and clicking one reveals which rule produced it.",
   "**Edit values live.** Click any value and type; arrow keys nudge numbers. This is how you find the right value rather than guessing and refreshing.",
   "**The box diagram** at the bottom shows content, padding, border and margin as measured. Hovering each part highlights it on the page."
  ] },
  { n: "Learn to work in Inspect first and move the change to your file afterwards. It removes the save-and-refresh loop entirely, and the visual feedback while dragging a number teaches you what each property does far faster than reading about it.",
    nt: "Try it in the browser first" },

  { h: "Where CSS is the wrong tool" },
  { l: [
   "**Logic and data.** CSS is not a programming language and bending it into one produces things nobody can maintain.",
   "**Content.** `::before { content: \"Warning: \" }` is generated content — often invisible to search engines, and inconsistently announced by screen readers. Anything meaningful belongs in the HTML.",
   "**Pixel-identical rendering everywhere.** This was never achievable and was never the goal. Different devices, fonts and preferences produce different results, and a design that survives that is a better design."
  ] },

  { tryit: { t: "Style a page you already wrote",
    task: "Take a page from the HTML track. Link an external stylesheet, add the reset above, then set a font, a text colour and a maximum width on the body. Do it all in Inspect first, then copy the values into the file.",
    hint: "`max-width: 65ch; margin-inline: auto;` on the body is the two-line trick that makes any text page instantly readable.",
    sol: { lang: "css", code: "/* styles.css */\n*, *::before, *::after { box-sizing: border-box; }\n\nbody {\n  margin: 0;\n  padding: 2rem 1rem;\n  line-height: 1.6;\n  font-family: system-ui, -apple-system, sans-serif;\n  color: #1a1a1a;\n  background: #fdfdfc;\n\n  max-width: 65ch;      /* about 65 characters per line */\n  margin-inline: auto;  /* centred */\n}\n\nimg { display: block; max-width: 100%; }\n\nh1, h2, h3 { line-height: 1.2; }" },
    w: "`65ch` is worth knowing: `ch` is the width of the digit zero in the current font, so `65ch` is roughly 65 characters — the line length typographers have settled on as most readable. It adapts automatically when the font changes, which a pixel value cannot." } }
 ],
 k: [
  "A rule is a selector plus a block of property-value declarations; comments are only `/* */`.",
  "Link an external stylesheet; avoid inline `style` — it cannot be reused and is very hard to override.",
  "The browser collects every matching declaration, sorts by the cascade, then inherits or defaults, then computes.",
  "Inspect's Styles pane strikes through losing declarations, which answers *why is my CSS ignored* immediately."
 ],
 r: ["CSS", "DOM", "Client-Side Rendering", "Design System", "HTML"],
 drill: {
  lang: "css",
  reps: 3,
  items: [
   { c: "<link rel=\"stylesheet\" href=\"/css/styles.css\">", w: "attach an external stylesheet to a page" },
   { c: "*, *::before, *::after { box-sizing: border-box; }", w: "make every element size itself sanely" },
   { c: "img { display: block; max-width: 100%; }", w: "stop images overflowing and remove the baseline gap" },
   { c: "body { max-width: 65ch; margin-inline: auto; }", w: "constrain text to a readable line length and centre it" }
  ]
 }
}

]);
