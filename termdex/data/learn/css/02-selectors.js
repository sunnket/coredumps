/* CSS — selecting and the cascade. */
TD.addLessons("css", [

{
 t: "Selectors, Specificity and the Cascade",
 m: "selectors",
 lvl: "core",
 s: "Why your rule is being ignored, answered properly and once.",
 goal: [
  "Target exactly the elements you mean",
  "Calculate specificity and predict which rule wins",
  "Stop reaching for !important"
 ],
 b: [
  { p: "Two questions account for most CSS frustration: *how do I select this thing* and *why is my rule being ignored*. This lesson answers both, and the second answer is a procedure rather than a mystery." },

  { h: "The selectors worth knowing" },
  { code: { lang: "css",
    lines: [
     { c: "p            { }", w: "**By element type.** Every paragraph." },
     { c: ".card        { }", w: "**By class.** Every element with `class=\"card\"`. **The one you will use most.**", hi: true },
     { c: "#header      { }", w: "**By id.** The single element with `id=\"header\"`. Very high specificity — see below." },
     { c: "*            { }", w: "**Everything.**" },
     { c: "", w: "" },
     { c: "[type=\"email\"]     { }", w: "**By attribute.**" },
     { c: "[href^=\"https\"]    { }", w: "`^=` starts with, `$=` ends with, `*=` contains." },
     { c: "", w: "" },
     { c: ".card.featured     { }", w: "**Both classes on one element.** No space — that is what makes it *and*." },
     { c: ".card .title       { }", w: "**Descendant: a `.title` anywhere inside a `.card`.** The space is the combinator." },
     { c: ".card > .title     { }", w: "**Direct child only.** One level down, not deeper." },
     { c: "h2 + p             { }", w: "**The paragraph immediately after an `h2`.**" },
     { c: "h2 ~ p             { }", w: "**Every paragraph after an `h2`, same parent.**" }
    ] } },
  { code: { lang: "css", t: "Pseudo-classes — a state or a position",
    lines: [
     { c: "a:hover      { }", w: "**Pointer over it.** Nothing on touch, so never hide essential information behind it." },
     { c: "a:focus-visible { }", w: "**Focused via keyboard.** Style this rather than `:focus`, so mouse clicks do not leave a ring behind.", hi: true },
     { c: "button:disabled { }", w: "" },
     { c: "input:checked   { }", w: "" },
     { c: "input:invalid   { }", w: "**Native validation state**, free from the HTML forms lesson." },
     { c: "", w: "" },
     { c: "li:first-child  { }", w: "" },
     { c: "li:last-child   { }", w: "" },
     { c: "li:nth-child(2n) { }", w: "**Every second.** `odd`, `even`, `3n+1` all work." },
     { c: "p:not(.intro)   { }", w: "**Everything except.**" },
     { c: "", w: "" },
     { c: ":is(h1, h2, h3) a  { }", w: "**Shorthand for a long list** — replaces `h1 a, h2 a, h3 a`." },
     { c: ":where(h1, h2) a   { }", w: "**Identical, except `:where` contributes *zero* specificity.** Perfect for base styles you intend to override easily." }
    ] } },
  { code: { lang: "css", t: "Pseudo-elements — a part of an element",
    lines: [
     { c: "p::first-line   { }", w: "**Two colons for pseudo-elements**, one for pseudo-classes. Both forms work for legacy reasons; two is correct." },
     { c: "p::selection    { }", w: "The highlighted text." },
     { c: ".card::before   { content: \"\"; }", w: "**Generates a box before the content.** `content` is required or nothing appears — the single most common reason a `::before` seems not to work.", hi: true },
     { c: "input::placeholder { }", w: "" }
    ] } },

  { h: "Specificity" },
  { p: "When several rules set the same property, specificity decides. It is a three-part score, compared left to right — and **a higher-left value beats any amount of the ones to its right.**" },
  { tbl: { t: "Counting it",
    h: ["Selector", "IDs", "Classes", "Elements", "Score"],
    rows: [
     ["`p`", "0", "0", "1", "**0,0,1**"],
     ["`.card`", "0", "1", "0", "**0,1,0**"],
     ["`p.card`", "0", "1", "1", "**0,1,1**"],
     ["`.card .title`", "0", "2", "0", "**0,2,0**"],
     ["`#header`", "**1**", "0", "0", "**1,0,0**"],
     ["`a:hover`", "0", "1", "1", "**0,1,1** — pseudo-classes count as classes"],
     ["`[type=\"text\"]`", "0", "1", "0", "**0,1,0** — attributes count as classes"],
     ["`:where(.a, .b)`", "0", "0", "0", "**0,0,0** — always zero"]
    ] } },
  { code: { lang: "css", t: "Why the ignored rule was ignored",
    lines: [
     { c: "#sidebar .title { color: blue; }", w: "**1,0,0** — one id." },
     { c: ".title.highlight.big.important { color: red; }", w: "**0,4,0** — four classes, and it still loses.**", hi: true },
     { c: "", w: "" },
     { c: "/* The title is blue. No number of classes ever beats one id. */", w: "**This is why ids are avoided as styling hooks.** They win, permanently, and the only ways out are another id or `!important` — both of which make the next problem worse." }
    ] } },
  { p: "**When specificity ties, the rule that appears later in the source wins.** That is why the order of your stylesheets matters, and why a rule you add at the bottom of a file usually works." },
  { ana: "Specificity is a court hierarchy. An element selector is a local decision, a class is a higher court, an id is the supreme court. A supreme court ruling stands however many local courts disagreed. `!important` is changing the constitution — it works, and you should be extremely reluctant.",
    at: "A hierarchy of courts" },

  { h: "The full cascade order" },
  { code: { lang: "text", t: "Checked in this order; the first one that decides, wins",
    lines: [
     { c: "1. Origin and importance", w: "" },
     { c: "     browser defaults", w: "" },
     { c: "     user styles", w: "" },
     { c: "     YOUR styles", w: "" },
     { c: "     your !important", w: "" },
     { c: "     user !important        <- a user's accessibility override beats", w: "**Deliberate.** Someone who needs 24px text gets 24px text, whatever you wrote.", hi: true },
     { c: "                               your !important, always", w: "" },
     { c: "", w: "" },
     { c: "2. Layers  (@layer, if you use them)", w: "" },
     { c: "3. Specificity  (ids, then classes, then elements)", w: "" },
     { c: "4. Source order  (last one wins)", w: "" }
    ] } },

  { h: "!important" },
  { code: { lang: "css",
    lines: [
     { c: ".title { color: red !important; }", w: "**Beats everything in your stylesheets, regardless of specificity.**" },
     { c: "", w: "" },
     { c: "/* And then, next week: */", w: "" },
     { c: ".title.override { color: blue !important; }", w: "**The only way to beat `!important` is more `!important`**, and now you are in an escalation nobody wins.", hi: true }
    ] } },
  { l: [
   "**Legitimate:** overriding a third-party stylesheet you cannot edit; a utility class whose entire purpose is to win (`.hidden { display: none !important; }`).",
   "**Not legitimate:** anything in your own CSS where you could instead work out which rule is winning and why.",
   "**When you feel the urge**, open Inspect, look at the Styles pane, and find the rule that is beating you. It takes ten seconds and the fix is nearly always to lower *its* specificity rather than raise yours."
  ] },

  { h: "Inheritance" },
  { code: { lang: "css",
    lines: [
     { c: "body {", w: "" },
     { c: "  color: #333;", w: "**Inherited.** Every descendant gets it unless overridden." },
     { c: "  font-family: system-ui;", w: "**Inherited.** So are `line-height`, `font-size`, `text-align`, `visibility`." },
     { c: "  border: 1px solid red;", w: "**Not inherited** — and it would be absurd if it were. Box properties, layout, spacing, backgrounds: none inherit." },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: ".child {", w: "" },
     { c: "  color: inherit;", w: "**Force inheritance** where it does not happen by default." },
     { c: "  border: initial;", w: "Back to the property's built-in default." },
     { c: "  all: revert;", w: "**Every property back to the browser's default** — a useful escape hatch inside third-party widgets." },
     { c: "}", w: "" }
    ] } },
  { n: "Setting `font-family` and `color` once on `body` and letting them inherit is the correct approach — it is why a whole site's typography changes from one place. The exception is form controls, which do not inherit fonts; `input, button, textarea, select { font: inherit; }` from the reset fixes that.",
    nt: "Set typography once, on body" },

  { h: "Keeping specificity low on purpose" },
  { l: [
   "**Style with classes.** Almost exclusively. Ids for JavaScript hooks and in-page links, not for CSS.",
   "**Keep selectors short.** `.card-title` beats `.page .content .card .header h3` — which is fragile, high-specificity and breaks when the markup moves.",
   "**Adopt a naming convention.** BEM (`.card__title--featured`) is the common one. Its real value is that every selector is one class, so specificity stays flat and predictable.",
   "**Use `:where()` for base styles** you expect to override.",
   "**`@layer` if the project is large.** It lets you declare that your components always beat your resets, regardless of specificity — the modern solution to this whole class of problem."
  ] },

  { tryit: { t: "Predict, then verify",
    task: "Write a page with one element carrying an id and two classes, and four rules targeting it with different specificities. Predict the winner for each property before loading it, then check in Inspect's Styles pane.",
    hint: "Count ids, then classes (including attributes and pseudo-classes), then elements. Compare left to right.",
    sol: { lang: "css", code: "/* <p id=\"lead\" class=\"intro highlight\">Text</p> */\n\np                  { color: black; }  /* 0,0,1 */\n.intro             { color: green; }  /* 0,1,0 */\n.intro.highlight   { color: blue;  }  /* 0,2,0 */\n#lead              { color: red;   }  /* 1,0,0  <- wins */\n\n/* and if we add: */\np.intro.highlight[data-x] { color: orange; }  /* 0,3,1 — still loses */\n\n/* the only ways past #lead: another id, or !important.\n   the real fix is to not have styled by id in the first place. */" },
    w: "Inspect's Styles pane lists the matching rules most-specific first and strikes through every declaration that lost. Once you have seen that view a few times, *why is my CSS being ignored* stops being a question you have to think about." } }
 ],
 k: [
  "Style with classes; use ids for scripting and links, because one id beats any number of classes forever.",
  "Specificity is ids, then classes (attributes and pseudo-classes count as classes), then elements — compared left to right.",
  "On a tie, the later rule wins; that is why source order and stylesheet order matter.",
  "`!important` starts an escalation you cannot win — find the rule that is beating you in Inspect instead."
 ],
 r: ["CSS", "Design System", "DOM", "Web Accessibility"],
 drill: {
  lang: "css",
  reps: 4,
  items: [
   { c: ".card .title { }", w: "select an element nested anywhere inside another" },
   { c: ".card > .title { }", w: "select only a direct child" },
   { c: ".card.featured { }", w: "select elements carrying both classes" },
   { c: "a:focus-visible { }", w: "style the keyboard focus state only" },
   { c: ".card::before { content: \"\"; }", w: "generate a box before an element's content", hint: "one property is mandatory" },
   { c: "li:nth-child(2n) { }", w: "select every second item" },
   { c: ":where(h1, h2, h3) a { }", w: "match several elements while adding no specificity" }
  ]
 }
}

]);
