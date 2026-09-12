/* HTML — text, links, images and lists. */
TD.addLessons("html", [

{
 t: "Text, Headings and Lists",
 m: "content",
 lvl: "core",
 s: "The elements that carry most of the content on the web, and choosing between the ones that look identical.",
 goal: [
  "Use headings to build a correct document outline",
  "Pick the right element for emphasis, quotation and code",
  "Build the three kinds of list"
 ],
 b: [
  { p: "Most of the web is text. These elements carry it — and several pairs look identical on screen while meaning entirely different things to a machine." },

  { h: "Headings" },
  { code: { lang: "html",
    lines: [
     { c: "<h1>The Cost of Cheap Abstractions</h1>", w: "**One `<h1>` per page** — what the page is about. Search engines and screen readers both treat it as the title of the content." },
     { c: "  <h2>Where the cost shows up</h2>", w: "**A major section.**" },
     { c: "    <h3>In review</h3>", w: "**A subsection of that section.**" },
     { c: "    <h3>In onboarding</h3>", w: "" },
     { c: "  <h2>When it is worth paying</h2>", w: "**Back up a level.** The indentation here is illustrative — headings are not actually nested in the markup." },
     { c: "", w: "" },
     { c: "<h4>Looks smaller, so I'll use it</h4>", w: "**Never choose a heading level for its size.** Levels are structure; size is CSS. This is the most common misuse of headings and it wrecks navigation.", hi: true }
    ] } },
  { n: "Screen reader users navigate by heading. Pressing `H` jumps to the next one, and many people get a list of every heading and use it like a table of contents. Skip from `<h2>` to `<h4>` and that outline has a hole in it — the equivalent of a book whose contents page skips a chapter. Never skip a level going down; going back up any number of levels is fine.",
    nt: "Why the order matters more than the size" },

  { h: "Paragraphs and breaks" },
  { code: { lang: "html",
    lines: [
     { c: "<p>A paragraph. The browser collapses", w: "" },
     { c: "   all whitespace — newlines, tabs, runs of", w: "**Every run of whitespace becomes one space.** You cannot lay out text by pressing space or Enter; that is CSS's job." },
     { c: "   spaces — into single spaces.</p>", w: "" },
     { c: "", w: "" },
     { c: "<p>123 High Street<br>Manchester<br>M1 2AB</p>", w: "**`<br>` is for line breaks *within* one block of text** — an address, a poem. Not for spacing between paragraphs.", hi: true },
     { c: "", w: "" },
     { c: "<p>First point</p><br><br><p>Second point</p>", w: "**Wrong.** Spacing between blocks is `margin` in CSS. Stacked `<br>`s are the classic beginner tell." },
     { c: "", w: "" },
     { c: "<hr>", w: "**A thematic break** — a shift in topic. Semantic, not merely a line; style it however you like." }
    ] } },

  { h: "The pairs that look the same" },
  { tbl: { t: "Identical on screen, different to a machine",
    h: ["Use", "Not", "Because"],
    rows: [
     ["`<strong>`", "`<b>`", "**`<strong>` means *this is important*.** A screen reader may change tone. `<b>` means *make it bold* with no meaning"],
     ["`<em>`", "`<i>`", "**`<em>` means *emphasised***, changing the sentence's stress. `<i>` is for a technical term, a ship's name, a foreign phrase"],
     ["`<del>` / `<ins>`", "`<s>` / `<u>`", "`<del>` and `<ins>` mark an actual edit to the document"],
     ["`<mark>`", "a span with a background", "`<mark>` means *relevant to what you are looking for* — a search hit"]
    ] } },
  { code: { lang: "html",
    lines: [
     { c: "<p>You <strong>must</strong> back up before running this.</p>", w: "**Importance.**" },
     { c: "<p>It is <em>not</em> a backup if it is on the same disk.</p>", w: "**Emphasis** — the sentence means something different when *not* is stressed." },
     { c: "<p>The <i>Endeavour</i> sailed in 1768.</p>", w: "**Italic with no emphasis** — a ship's name. `<i>` is correct here and `<em>` would be wrong." },
     { c: "<p>Price: <del>£40</del> <ins>£25</ins></p>", w: "**A recorded change**, announced as such." }
    ] } },
  { n: "In practice `<b>` and `<i>` are rarely the right answer, and reaching for `<strong>` and `<em>` by default is a safe habit. Neither should be used to make something merely *look* bold — a heading that needs to be bold is a heading, and CSS makes it bold.",
    nt: "The safe default" },

  { h: "Quotations and code" },
  { code: { lang: "html",
    lines: [
     { c: "<blockquote cite=\"https://example.com/paper\">", w: "**A block-level quotation.** `cite` gives the source URL — machine-readable, not displayed." },
     { c: "  <p>Premature optimisation is the root of all evil.</p>", w: "**Put a `<p>` inside it** — `<blockquote>` expects block content." },
     { c: "  <footer>— <cite>Donald Knuth</cite></footer>", w: "**`<cite>` marks the title of a work or its author.**" },
     { c: "</blockquote>", w: "" },
     { c: "", w: "" },
     { c: "<p>As <q>the docs say</q>, it depends.</p>", w: "**An inline quotation.** The browser adds the quote marks — correct for the page's language, which is why you should not type them yourself." },
     { c: "", w: "" },
     { c: "<p>Run <code>npm install</code> first.</p>", w: "**Inline code.** Rendered monospace by default." },
     { c: "<pre><code>function add(a, b) {", w: "**`<pre>` preserves whitespace and newlines** — the one element where your formatting survives." },
     { c: "  return a + b;", w: "" },
     { c: "}</code></pre>", w: "**`<pre><code>` together** is the standard pairing for a code block: preformatted *and* marked as code.", hi: true },
     { c: "", w: "" },
     { c: "<kbd>Ctrl</kbd> + <kbd>K</kbd>", w: "Keys the user should press. `<samp>` for program output, `<abbr title=\"...\">` for abbreviations." }
    ] } },
  { trap: "Inside `<pre>`, the first newline after the opening tag is swallowed but every other space is kept — so an indented `<pre>` block in nicely formatted HTML renders with all that indentation visible. It is the one place where your source formatting leaks onto the page, and it always looks like a bug the first time." },

  { h: "Lists" },
  { code: { lang: "html",
    lines: [
     { c: "<ul>", w: "**Unordered — the order does not matter.** Bulleted by default." },
     { c: "  <li>Coffee</li>", w: "**Only `<li>` may be a direct child of `<ul>` or `<ol>`.** Anything else is invalid." },
     { c: "  <li>Tea</li>", w: "" },
     { c: "</ul>", w: "" },
     { c: "", w: "" },
     { c: "<ol start=\"3\" reversed>", w: "**Ordered — the sequence is part of the meaning.** `start` and `reversed` control the numbering." },
     { c: "  <li>Preheat the oven</li>", w: "" },
     { c: "  <li>Mix the dry ingredients</li>", w: "" },
     { c: "</ol>", w: "" },
     { c: "", w: "" },
     { c: "<dl>", w: "**A description list — term and definition pairs.** Underused, and exactly right for glossaries, metadata and FAQs." },
     { c: "  <dt>DOM</dt>", w: "**The term.**" },
     { c: "  <dd>The tree the browser builds from your HTML.</dd>", w: "**Its description.** Several `<dd>`s may follow one `<dt>`." },
     { c: "</dl>", w: "" }
    ] } },
  { code: { lang: "html", t: "Nesting a list",
    lines: [
     { c: "<ul>", w: "" },
     { c: "  <li>Frontend", w: "" },
     { c: "    <ul>", w: "**The nested list goes *inside* the `<li>`**, before its closing tag — not between two `<li>`s.", hi: true },
     { c: "      <li>HTML</li>", w: "" },
     { c: "      <li>CSS</li>", w: "" },
     { c: "    </ul>", w: "" },
     { c: "  </li>", w: "**And the outer `<li>` closes after it.** Getting this wrong is the most common list error." },
     { c: "  <li>Backend</li>", w: "" },
     { c: "</ul>", w: "" }
    ] } },
  { n: "Lists are worth reaching for more often than people do. A screen reader announces *list of five items* and lets the user skip it — information that a series of `<p>` elements with bullet characters typed in front of them cannot convey. Navigation menus in particular should be a `<ul>`: it is a list of links, and marking it as one is what makes it navigable.",
    nt: "Use lists for things that are lists" },

  { h: "Tables — for data, not layout" },
  { code: { lang: "html",
    lines: [
     { c: "<table>", w: "" },
     { c: "  <caption>Revenue by region, Q1 2026</caption>", w: "**A caption belongs on every data table.** It is what a screen reader announces first, and it is what tells a reader what they are looking at." },
     { c: "  <thead>", w: "" },
     { c: "    <tr>", w: "**A table row.**" },
     { c: "      <th scope=\"col\">Region</th>", w: "**`<th>` is a header cell. `scope=\"col\"` says it heads a column** — which is how a screen reader knows to announce *Region: East* when reading a data cell.", hi: true },
     { c: "      <th scope=\"col\">Revenue</th>", w: "" },
     { c: "    </tr>", w: "" },
     { c: "  </thead>", w: "" },
     { c: "  <tbody>", w: "" },
     { c: "    <tr>", w: "" },
     { c: "      <th scope=\"row\">East</th>", w: "**`scope=\"row\"` for a row header.**" },
     { c: "      <td>412,500</td>", w: "**`<td>` is an ordinary data cell.**" },
     { c: "    </tr>", w: "" },
     { c: "  </tbody>", w: "" },
     { c: "</table>", w: "" }
    ] } },
  { trap: "Tables were used for page layout throughout the 1990s and 2000s because CSS could not do it. CSS Grid and Flexbox now can, and a layout table is a genuine accessibility failure — a screen reader announces *table with 3 rows and 4 columns* and reads your page cell by cell in an order that makes no sense. **Tables are for tabular data only.**" },

  { tryit: { t: "Mark up a real document",
    task: "Take an article or a recipe and mark it up properly: one `<h1>`, correctly nested subheadings, an ordered list for the steps, an unordered list for ingredients, a blockquote with attribution, and a small data table with headers and a caption. Do not add any CSS.",
    hint: "Choose each element by what the content *is*, not by how you want it to look. It will be plain, and it should be completely readable.",
    sol: { lang: "html", code: "<article>\n  <h1>Overnight Focaccia</h1>\n  <p>A slow-rise dough that does most of the work while you sleep.</p>\n\n  <h2>Ingredients</h2>\n  <ul>\n    <li>500 g strong white flour</li>\n    <li>400 ml water</li>\n    <li>10 g salt</li>\n    <li>2 g dried yeast</li>\n  </ul>\n\n  <h2>Method</h2>\n  <ol>\n    <li>Mix everything until no dry flour remains.</li>\n    <li>Cover and leave at room temperature for 12 hours.</li>\n    <li>Bake at 220&deg;C for 20 minutes.</li>\n  </ol>\n\n  <h2>Timings</h2>\n  <table>\n    <caption>Rise time by room temperature</caption>\n    <thead>\n      <tr>\n        <th scope=\"col\">Temperature</th>\n        <th scope=\"col\">Hours</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr><th scope=\"row\">18&deg;C</th><td>14</td></tr>\n      <tr><th scope=\"row\">22&deg;C</th><td>10</td></tr>\n    </tbody>\n  </table>\n\n  <blockquote>\n    <p>The dough should look wetter than you are comfortable with.</p>\n    <footer>&mdash; <cite>Every focaccia recipe ever written</cite></footer>\n  </blockquote>\n</article>" },
    w: "Read it with the CSS off — which is what it already is. If the unstyled page is clear and navigable, the markup is right, and everything CSS does afterwards is improvement rather than rescue." } }
 ],
 k: [
  "Headings are structure, not size — never skip a level, because screen reader users navigate by them.",
  "`<strong>` and `<em>` carry meaning; `<b>` and `<i>` are visual only and rarely what you want.",
  "`<pre><code>` is the standard code block, and it is the one place your source whitespace survives.",
  "Tables are for tabular data — with `<caption>` and `<th scope>` — never for layout."
 ],
 r: ["HTML", "Semantic HTML", "Web Accessibility", "ARIA", "SEO"],
 drill: {
  lang: "html",
  reps: 3,
  items: [
   { c: "<h1>The Cost of Cheap Abstractions</h1>", w: "the page's single main heading" },
   { c: "<p>You <strong>must</strong> back up before running this.</p>", w: "mark a word as important, not merely bold" },
   { c: "<pre><code>function add(a, b) {</code></pre>", w: "a code block that keeps its formatting" },
   { c: "<ul><li>Coffee</li><li>Tea</li></ul>", w: "a list whose order does not matter" },
   { c: "<th scope=\"col\">Region</th>", w: "a header cell that labels a whole column" },
   { c: "<caption>Revenue by region, Q1 2026</caption>", w: "tell a reader what a table contains" }
  ]
 }
},

{
 t: "Links, Images and Media",
 m: "content",
 lvl: "core",
 s: "The two elements that made it a web, and how to use them so everyone can.",
 goal: [
  "Write links with paths that survive being moved",
  "Write alt text that is actually useful",
  "Serve images and video responsibly"
 ],
 b: [
  { p: "The link is the reason the web is a web rather than a pile of documents. The image is the reason people stayed. Both have a handful of details that separate a page that works for everyone from one that does not." },

  { h: "Links" },
  { code: { lang: "html",
    lines: [
     { c: "<a href=\"https://example.com\">Example</a>", w: "**Absolute** — the full address. For anything on another site." },
     { c: "<a href=\"/about\">About</a>", w: "**Root-relative: starts at the site root.** Works from any page on the site, which is why it is usually the right choice." },
     { c: "<a href=\"about.html\">About</a>", w: "**Relative to the current page.** Breaks the moment you move the file into a subfolder." },
     { c: "<a href=\"../index.html\">Back</a>", w: "**`..` goes up one directory** — the same notation as the terminal." },
     { c: "", w: "" },
     { c: "<a href=\"#pricing\">Pricing</a>", w: "**A fragment: jumps to `id=\"pricing\"` on this page.**", hi: true },
     { c: "<a href=\"/plans#pricing\">Pricing</a>", w: "Another page, then that section." },
     { c: "<a href=\"mailto:hi@example.com\">Email us</a>", w: "Opens a mail client. `tel:` for phone numbers, which matters on mobile." },
     { c: "<a href=\"/report.pdf\" download>Download the report</a>", w: "**`download` saves rather than navigates.**" }
    ] } },
  { code: { lang: "html", t: "Opening in a new tab",
    lines: [
     { c: "<a href=\"https://example.com\"", w: "" },
     { c: "   target=\"_blank\"", w: "**Opens in a new tab.** Use sparingly — it takes control away from the reader, who has a perfectly good middle-click." },
     { c: "   rel=\"noopener noreferrer\">Example</a>", w: "**Required with `target=\"_blank\"`.** Without `noopener` the new page can manipulate yours through `window.opener` — a real phishing vector. Modern browsers imply it, and older ones do not.", hi: true }
    ] } },
  { h: "Link text" },
  { vs: { t: "Screen reader users can list every link on a page", lang: "html",
    bad: { c: "<p>To read the report,\n   <a href=\"/report\">click here</a>.</p>\n\n<p>More info <a href=\"/pricing\">here</a>.</p>", label: "Meaningless out of context",
      w: "A list of this page's links reads: *click here, here, here, read more*. None of them says where they go, so the list is useless — and that list is how many people navigate." },
    good: { c: "<p>Read the\n   <a href=\"/report\">2026 annual report</a>.</p>\n\n<p>See our\n   <a href=\"/pricing\">pricing plans</a>.</p>", label: "Makes sense alone",
      w: "Every link describes its destination. It reads better for everyone, and search engines use link text to understand what the target page is about." } } },

  { h: "Images" },
  { code: { lang: "html",
    lines: [
     { c: "<img src=\"/img/chart.png\"", w: "**Where the file is.**" },
     { c: "     alt=\"Revenue rose from £2m to £5m between 2024 and 2026\"", w: "**Alt text: what the image *conveys*, not what it depicts.** For a chart, that is the finding, not *a bar chart*.", hi: true },
     { c: "     width=\"800\" height=\"400\"", w: "**Always give both.** The browser reserves the right space before the image loads, so the page does not jump as it arrives — the single biggest cause of that infuriating shift while reading." },
     { c: "     loading=\"lazy\">", w: "**Do not download it until it is near the viewport.** One attribute, large saving on a long page. Omit it for anything visible on first load." }
    ] } },
  { tbl: { t: "Writing alt text",
    h: ["Image", "Good alt", "Why"],
    rows: [
     ["A chart", "`\"Revenue rose from £2m to £5m, 2024–2026\"`", "**Convey the information**, not the format"],
     ["A photo of a product", "`\"Blue ceramic mug with a curved handle\"`", "Describe what a buyer needs to know"],
     ["A logo that links home", "`\"Acme — home\"`", "Describe the **destination**, since it is a link"],
     ["Purely decorative", "`alt=\"\"`", "**Empty, but present.** Tells the screen reader to skip it entirely"],
     ["Anything", "~~`alt=\"image\"`~~", "Worse than nothing — it announces noise"]
    ] } },
  { trap: "**Omitting `alt` and setting `alt=\"\"` are different.** With no `alt` at all, a screen reader falls back to announcing the filename — *chart underscore final underscore v2 dot p n g*. With `alt=\"\"` it skips the image silently, which is correct for decoration. Every `<img>` needs the attribute; only decorative ones should have it empty." },

  { h: "Serving the right image" },
  { code: { lang: "html", t: "Modern formats with a fallback",
    lines: [
     { c: "<picture>", w: "**The browser takes the first `<source>` it understands.**" },
     { c: "  <source srcset=\"hero.avif\" type=\"image/avif\">", w: "**AVIF: smallest, newest.**" },
     { c: "  <source srcset=\"hero.webp\" type=\"image/webp\">", w: "**WebP: widely supported, much smaller than JPEG.**" },
     { c: "  <img src=\"hero.jpg\" alt=\"...\" width=\"1200\" height=\"600\">", w: "**The `<img>` is required** — it is both the fallback and where `alt`, `width` and `height` live.", hi: true },
     { c: "</picture>", w: "" },
     { c: "", w: "" },
     { c: "<img srcset=\"photo-400.jpg 400w,", w: "**`srcset` offers several sizes of the *same* image...**" },
     { c: "             photo-800.jpg 800w,", w: "" },
     { c: "             photo-1600.jpg 1600w\"", w: "" },
     { c: "     sizes=\"(max-width: 600px) 100vw, 50vw\"", w: "**...and `sizes` tells the browser how wide it will be displayed**, so it can pick before layout happens. A phone downloads the 400px file rather than the 1600px one." },
     { c: "     src=\"photo-800.jpg\" alt=\"...\">", w: "**`src` is the fallback** for anything that does not understand `srcset`." }
    ] } },
  { tbl: { t: "Which format",
    h: ["Format", "For"],
    rows: [
     ["**SVG**", "**Logos, icons, diagrams.** Vector — sharp at any size, usually tiny, and stylable with CSS"],
     ["**AVIF / WebP**", "**Photographs.** 30–50% smaller than JPEG at the same quality"],
     ["**JPEG**", "Photographs, as the universal fallback"],
     ["**PNG**", "Screenshots, and anything needing transparency with hard edges"],
     ["**GIF**", "Nothing. Use a short muted video — it is smaller and better in every respect"]
    ] } },

  { h: "Video and audio" },
  { code: { lang: "html",
    lines: [
     { c: "<video controls", w: "**Without `controls` there is no way to play it.** Easy to forget." },
     { c: "       poster=\"thumb.jpg\"", w: "The still shown before playback." },
     { c: "       width=\"800\" height=\"450\"", w: "" },
     { c: "       preload=\"metadata\">", w: "**Fetch only the duration and dimensions**, not the whole file. `none` is even lighter." },
     { c: "  <source src=\"demo.webm\" type=\"video/webm\">", w: "" },
     { c: "  <source src=\"demo.mp4\" type=\"video/mp4\">", w: "**MP4 as the universal fallback.**" },
     { c: "  <track kind=\"captions\" src=\"demo.vtt\" srclang=\"en\" label=\"English\" default>", w: "**Captions.** Required for deaf users, and used by the very large number of people who watch with the sound off.", hi: true },
     { c: "  <p>Your browser cannot play this. <a href=\"demo.mp4\">Download it</a>.</p>", w: "Fallback content." },
     { c: "</video>", w: "" }
    ] } },
  { trap: "Autoplaying video with sound is blocked by every modern browser, and rightly. If you need autoplay it must be `muted` as well — `<video autoplay muted loop playsinline>` is the incantation for a background video, and `playsinline` is what stops iOS opening it fullscreen." },

  { tryit: { t: "Audit a real page",
    task: "Open a site you use and check three things in Inspect: do the images have meaningful `alt` text, do the links make sense read out of context, and do images have `width` and `height`. Then fix an equivalent page of your own.",
    hint: "In the Console, `$$('img:not([alt])').length` counts images missing the attribute entirely, and `$$('a')` lets you read all the link text.",
    sol: { lang: "html", code: "<!-- a considered image -->\n<picture>\n  <source srcset=\"/img/hero.avif\" type=\"image/avif\">\n  <source srcset=\"/img/hero.webp\" type=\"image/webp\">\n  <img src=\"/img/hero.jpg\"\n       alt=\"Three people looking at a whiteboard covered in system diagrams\"\n       width=\"1200\" height=\"600\">\n</picture>\n\n<!-- decorative: present but empty -->\n<img src=\"/img/divider.svg\" alt=\"\" width=\"400\" height=\"8\">\n\n<!-- link text that survives being read alone -->\n<p>Full details are in the\n   <a href=\"/reports/2026\">2026 annual report</a>.</p>" },
    w: "In the Console, `$$('img')` returns every image on the page as an array you can inspect — it is the fastest way to audit alt text on a page you did not write, and the same trick works for links, headings and form labels." } }
 ],
 k: [
  "Root-relative paths (`/about`) survive moving files; page-relative ones do not.",
  "Link text must make sense read alone — *click here* is useless in the link list many people navigate by.",
  "Alt text conveys what the image *tells you*; `alt=\"\"` for decoration, and never omit the attribute.",
  "`width` and `height` on every image stop the page jumping as it loads; `<picture>` and `srcset` serve the right file."
 ],
 r: ["HTML", "Web Accessibility", "Responsive Images", "SVG", "Lazy Loading", "Core Web Vitals"],
 drill: {
  lang: "html",
  reps: 3,
  items: [
   { c: "<a href=\"/about\">About</a>", w: "link to another page on the same site, from anywhere" },
   { c: "<a href=\"#pricing\">Pricing</a>", w: "jump to a section of the current page" },
   { c: "<a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example</a>", w: "open another site in a new tab, safely" },
   { c: "<img src=\"/img/chart.png\" alt=\"Revenue rose from £2m to £5m\" width=\"800\" height=\"400\" loading=\"lazy\">", w: "an image that describes itself and does not shift the page" },
   { c: "<img src=\"/img/divider.svg\" alt=\"\">", w: "mark an image as decorative so it is skipped" },
   { c: "<track kind=\"captions\" src=\"demo.vtt\" srclang=\"en\" label=\"English\" default>", w: "add captions to a video" }
  ]
 }
}

]);
