/* HTML — the skeleton of a page. */
TD.addLessons("html", [

{
 t: "Elements, Attributes and Nesting",
 m: "structure",
 lvl: "core",
 s: "The three-part grammar that every page is built from, and the rules the browser enforces.",
 goal: [
  "Read any HTML element and name its parts",
  "Use attributes correctly, including the ones every element accepts",
  "Nest elements without producing a broken tree"
 ],
 b: [
  { p: "HTML has essentially one piece of grammar, repeated. Learn it once and the rest of the language is vocabulary." },

  { syn: { t: "Every element, taken apart",
    parts: [
     { p: "<", w: "**The opening angle bracket.** Everything between `<` and `>` is markup rather than content." },
     { p: "a", w: "**The tag name** — which element this is. `a` is an anchor, the element that makes a link." },
     { p: " " },
     { p: "href=\"https://example.com\"", w: "**An attribute: name, equals, value in quotes.** Attributes configure the element. `href` is where the link goes." },
     { p: " " },
     { p: "target=\"_blank\"", w: "**Attributes are space-separated.** Any number, in any order." },
     { p: ">", w: "**End of the opening tag.**" },
     { p: "Read the docs", w: "**The content** — what appears on the page, and what a screen reader announces." },
     { p: "</a>", w: "**The closing tag: a slash and the same name.** Everything between the tags belongs to this element." }
    ],
    after: "Opening tag, content, closing tag. That is the shape of almost every element on every page you have ever loaded." } },

  { h: "Elements with nothing inside" },
  { code: { lang: "html",
    lines: [
     { c: "<img src=\"cat.jpg\" alt=\"A ginger cat asleep on a keyboard\">", w: "**A void element** — it has no content, so there is no closing tag. Everything it needs is in its attributes." },
     { c: "<br>", w: "A line break." },
     { c: "<hr>", w: "A thematic break." },
     { c: "<input type=\"email\" name=\"email\">", w: "" },
     { c: "<meta charset=\"utf-8\">", w: "" },
     { c: "", w: "" },
     { c: "<img src=\"cat.jpg\" alt=\"...\" />", w: "**The trailing slash is XHTML style.** Harmless, ignored by HTML5 parsers, and still common in JSX. Neither form is wrong; be consistent." },
     { c: "<img src=\"cat.jpg\" alt=\"...\"></img>", w: "**This is wrong.** A void element cannot have a closing tag, and the browser will do something unpredictable with it." }
    ] } },

  { h: "Nesting" },
  { p: "Elements go inside other elements, forming the tree the browser parses into. The one rule: **close them in the reverse order you opened them.**" },
  { vs: { t: "Overlapping tags", lang: "html",
    bad: { c: "<p>This is <strong>very important</p></strong>", label: "Overlapping — invalid",
      w: "`<strong>` opened inside `<p>` and closed outside it. The browser will silently repair this into something, but *what* it produces varies, and any styling or scripting that relies on the structure breaks." },
    good: { c: "<p>This is <strong>very important</strong></p>", label: "Properly nested",
      w: "`<strong>` opens and closes entirely inside `<p>`. The tree is unambiguous and every tool agrees on what it means." } } },
  { code: { lang: "html", t: "Indentation shows the tree",
    lines: [
     { c: "<article>", w: "" },
     { c: "  <h2>Title</h2>", w: "**Two spaces per level** is the common convention. Purely for humans — the browser ignores whitespace entirely." },
     { c: "  <p>Some text with <em>emphasis</em> in it.</p>", w: "**`<em>` is nested inside `<p>`**, which is inside `<article>`." },
     { c: "  <ul>", w: "" },
     { c: "    <li>First</li>", w: "" },
     { c: "    <li>Second</li>", w: "" },
     { c: "  </ul>", w: "" },
     { c: "</article>", w: "**Closing tags line up with their openings.** When they do not, you have almost certainly missed one." }
    ] } },
  { n: "Set your editor to format HTML on save — VS Code does it with `Shift+Alt+F` or automatically. Correct indentation makes a missing closing tag visible instantly, and misindented HTML is the single most common reason a beginner cannot find their bug.",
    nt: "Let the editor indent it" },

  { h: "Block and inline" },
  { p: "Elements default to one of two display behaviours, and knowing which is which explains most early layout surprises." },
  { tbl: { h: ["", "Block", "Inline"],
    rows: [
     ["Takes up", "**The full width available**, and starts a new line", "**Only as much width as its content**, and stays in the flow of text"],
     ["Examples", "`<p>` `<div>` `<h1>` `<ul>` `<section>`", "`<a>` `<span>` `<strong>` `<em>` `<img>`"],
     ["Can contain", "Block and inline elements", "**Inline elements only** — a `<div>` inside a `<span>` is invalid"],
     ["Width and height", "**Settable in CSS**", "Ignored — you must change `display` first"]
    ] } },
  { trap: "A `<div>` inside a `<p>` is invalid, and the browser's repair is dramatic: it silently closes the paragraph before the div and opens a new one after. Your CSS then targets elements that are not where you think they are. If a paragraph's styling seems to stop halfway, this is very often why — check the Elements panel against your source." },

  { h: "Attributes every element accepts" },
  { code: { lang: "html",
    lines: [
     { c: "<p id=\"intro\">", w: "**`id` — unique on the page.** One element, one id, never repeated. Used for linking to a section (`page.html#intro`) and for labelling form fields." },
     { c: "<p class=\"lead highlight\">", w: "**`class` — reusable, and space-separated for several.** The main hook for CSS. Any number of elements can share a class.", hi: true },
     { c: "<p title=\"Shown on hover\">", w: "**A tooltip.** Note it does not appear on touch devices and is poorly announced by screen readers — never put essential information here." },
     { c: "<p lang=\"fr\">Bonjour</p>", w: "**Marks a language change** so screen readers switch pronunciation." },
     { c: "<p hidden>", w: "**Hides the element entirely**, including from screen readers." },
     { c: "<p data-user-id=\"42\">", w: "**`data-*` — your own custom attributes.** Anything prefixed `data-` is valid HTML and readable from JavaScript. The correct way to attach your own information to an element." }
    ] } },
  { l: [
   "**`id` is for one specific element.** *This* navigation, *this* form field.",
   "**`class` is for a kind of element.** Every card, every warning, every button.",
   "**When in doubt use a class.** Duplicated ids are invalid, break `getElementById`, and break in-page links — and nothing warns you."
  ] },

  { h: "Comments and escaping" },
  { code: { lang: "html",
    lines: [
     { c: "<!-- A comment. Not rendered, but fully visible in View Source -->", w: "**Never put anything sensitive here.** Comments ship to every visitor." },
     { c: "", w: "" },
     { c: "<p>5 &lt; 10 &amp;&amp; 10 &gt; 5</p>", w: "**Character entities.** `<` `>` and `&` have meaning in HTML, so to display them literally you escape them.", hi: true },
     { c: "<p>&nbsp;</p>", w: "**A non-breaking space** — prevents a line break at that point. Useful in `10&nbsp;kg`; abused as a spacing hack, which is CSS's job." },
     { c: "<p>&copy; 2026 &mdash; all rights reserved</p>", w: "`&copy;` `&mdash;` `&hellip;` `&rarr;`. With `charset=\"utf-8\"` set you can usually just type © and — directly." }
    ] } },
  { n: "Escaping is not only cosmetic. Any user-supplied text put into a page unescaped is how **cross-site scripting** happens — a comment containing `<script>` becomes executable code. Every template engine escapes by default for exactly this reason, and the times you turn it off are the times to be certain.",
    nt: "Escaping is also a security control" },
  { dg: "xss-injection" },

  { h: "Validate it" },
  { code: { lang: "text",
    lines: [
     { c: "validator.w3.org/nu/", w: "**Paste a page or a URL and it lists every structural error.** Free, official, and the fastest way to find the unclosed tag you have been staring past." },
     { c: "", w: "" },
     { c: "VS Code + the HTML extensions", w: "Flags mismatched tags as you type." },
     { c: "Inspect > Elements", w: "**Shows the repaired tree.** If it differs from your file, the browser fixed something — and that difference is the bug." }
    ] } },

  { tryit: { t: "Break it, then find it",
    task: "Write a page with a heading, a list and a paragraph containing a link. Then deliberately introduce three errors — an unclosed tag, an overlapping pair, and a `<div>` inside a `<p>` — and find each one using only the validator and the Elements panel.",
    hint: "Compare Inspect's tree against your source. Wherever they differ, the browser repaired something.",
    sol: { lang: "html", code: "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Reading List</title>\n</head>\n<body>\n  <h1>Reading List</h1>\n\n  <ul>\n    <li>Designing Data-Intensive Applications</li>\n    <li>The Pragmatic Programmer</li>\n  </ul>\n\n  <p>Most of these came from\n     <a href=\"https://example.com/list\">this list</a>.</p>\n</body>\n</html>" },
    w: "The `<div>` inside `<p>` is the instructive one: the validator flags it, and Inspect shows the paragraph closed early with a second one opened after. Seeing the browser's repair once explains a whole category of *why is my CSS not applying* for good." } }
 ],
 k: [
  "Opening tag, content, closing tag — with void elements like `<img>` and `<br>` having no content and no closing tag.",
  "Close tags in the reverse order you opened them; overlapping tags get silently repaired into something unpredictable.",
  "Block elements take the full width and can contain anything; inline elements sit in the text flow and take only inline content.",
  "`id` is unique and `class` is reusable — prefer `class`; duplicated ids break scripts and links with no warning."
 ],
 r: ["HTML", "DOM", "XSS", "Semantic HTML", "CSS"],
 drill: {
  lang: "html",
  reps: 3,
  items: [
   { c: "<a href=\"https://example.com\">Read the docs</a>", w: "make a link to another page" },
   { c: "<img src=\"cat.jpg\" alt=\"A ginger cat asleep on a keyboard\">", w: "place an image with a description for people who cannot see it" },
   { c: "<p class=\"lead highlight\">", w: "attach two reusable style hooks to an element" },
   { c: "<p data-user-id=\"42\">", w: "attach your own data to an element, validly" },
   { c: "<p>5 &lt; 10 &amp;&amp; 10 &gt; 5</p>", w: "display characters that would otherwise be read as markup" }
  ]
 }
}

]);
