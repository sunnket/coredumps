/* HTML — what it is and is not. */
TD.addLessons("html", [

{
 t: "Markup Is Not Programming",
 m: "brief",
 lvl: "core",
 s: "The distinction that makes the whole language make sense, and what the browser does with your file.",
 goal: [
  "Explain what markup means and why HTML is not a programming language",
  "Describe what the browser does between your file and the pixels",
  "Write and open your first page"
 ],
 b: [
  { p: "HTML is the shortest track here and one of the most useful, because the loop between writing and seeing is seconds long. But the first lesson is not syntax — it is what the language is *for*, because that decides whether you write good HTML or a pile of divs." },

  { h: "What markup means" },
  { p: "HTML has no variables, no conditions, no loops and no arithmetic. It cannot make a decision. What it does is take content and **label what each piece is**." },
  { code: { lang: "html", t: "The same words, marked up",
    lines: [
     { c: "The Cost of Cheap Abstractions", w: "**Plain text.** A browser shows it as a line of words. Nothing knows it is a title." },
     { c: "", w: "" },
     { c: "<h1>The Cost of Cheap Abstractions</h1>", w: "**Now it is labelled as the page's main heading.** A screen reader announces it as a heading, a search engine weights it, the browser's outline lists it, and a keyboard user can jump to it.", hi: true }
    ] } },
  { p: "That labelling is the entire job, and it matters more than beginners expect — because the label is what every machine reading the page acts on." },
  { ana: "HTML is the labelling in a museum, not the objects. The exhibits are your content. The cards saying *this is a painting, this is its title, this is the artist* are the markup — and they are what lets a visitor who cannot see the room still navigate it, and what lets a catalogue be generated automatically.",
    at: "The labels, not the objects" },

  { h: "The three layers" },
  { tbl: { t: "Each layer has one job, and mixing them is the mistake",
    h: ["Layer", "Answers", "Example"],
    rows: [
     ["**HTML**", "**What is this content?**", "This is a heading; this is a button"],
     ["**CSS**", "**What does it look like?**", "Headings are 32px and dark blue"],
     ["**JavaScript**", "**What does it do?**", "When the button is clicked, submit the form"]
    ] } },
  { n: "You can build a genuinely useful site with HTML alone. It will be plain, and it will work — every link, every form, on every device, with a keyboard, with a screen reader. CSS makes it look deliberate and JavaScript makes it interactive, but the order matters: content that works first, appearance second, behaviour third. That order has a name, **progressive enhancement**, and it is why the web still renders documents written in 1995.",
    nt: "Why this order matters" },

  { h: "What the browser actually does" },
  { code: { lang: "text", t: "From your file to pixels",
    lines: [
     { c: "1. FETCH      the browser downloads index.html as plain text", w: "" },
     { c: "", w: "" },
     { c: "2. PARSE      it reads the text and builds the DOM —", w: "" },
     { c: "              a tree of objects, one per element", w: "**The DOM is the live tree the browser holds in memory.** Your file describes it; JavaScript can change it afterwards.", hi: true },
     { c: "", w: "" },
     { c: "3. STYLE      CSS rules are matched against the tree,", w: "" },
     { c: "              giving every node a final set of styles", w: "" },
     { c: "", w: "" },
     { c: "4. LAYOUT     work out where every box goes and how big", w: "**Also called reflow.** The expensive step." },
     { c: "", w: "" },
     { c: "5. PAINT      draw pixels", w: "" }
    ] } },
  { p: "Two things follow from that, and both come up constantly." },
  { l: [
   "**The browser is forgiving.** Forget a closing tag and it guesses rather than refusing to render. This is deliberate — the web would have collapsed otherwise — and it means your mistakes produce *odd layout* rather than an error message.",
   "**The DOM is not your file.** Once JavaScript runs, the tree can differ from what you wrote. This is why the browser's *Inspect* panel shows something different from *View Source* — and why Inspect is the one you want."
  ] },
  { dg: "dom-tree" },

  { h: "Your first page" },
  { code: { lang: "html", file: "index.html",
    lines: [
     { c: "<!doctype html>", w: "**Must be the first line.** It tells the browser to use modern standards rather than a 1990s compatibility mode. It is not a tag, and it takes no closing." },
     { c: "<html lang=\"en\">", w: "**The root element.** `lang` matters more than it looks — it tells screen readers which pronunciation to use and helps translation tools." },
     { c: "<head>", w: "**Information *about* the page.** Nothing here is displayed in the page itself." },
     { c: "  <meta charset=\"utf-8\">", w: "**Which character encoding.** Without it, accented characters, curly quotes and emoji turn into mojibake. Put it first in the head." },
     { c: "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", w: "**Without this line a phone renders your page as a zoomed-out desktop site.** The single most important line for mobile.", hi: true },
     { c: "  <title>My First Page</title>", w: "**The browser tab, the bookmark name, and the headline in search results.** Never leave it as *Document*." },
     { c: "</head>", w: "" },
     { c: "<body>", w: "**Everything the visitor sees.**" },
     { c: "  <h1>Hello</h1>", w: "" },
     { c: "  <p>This is my first page.</p>", w: "" },
     { c: "</body>", w: "" },
     { c: "</html>", w: "" }
    ],
    after: "Save it as `index.html` and double-click it. That is the entire toolchain — no build step, no server, no install. Nothing else you learn will have a shorter loop between writing and seeing." } },
  { n: "`index.html` is a special name: a web server asked for a directory serves `index.html` from it by default. That is why `example.com/about/` works without naming a file. Locally it makes no difference, but the habit is worth having.",
    nt: "Why index.html" },

  { h: "The one tool you need" },
  { l: [
   "**Right-click → Inspect** (or F12) opens developer tools. The Elements panel shows the live DOM and lets you edit it in place to try things.",
   "**Hover over an element in Elements** and the browser highlights it on the page. This is how you find out which element is causing something.",
   "**The Console tab** shows errors. When something is not appearing, look here first.",
   "**In VS Code**, the Live Server extension reloads the page every time you save — which turns the loop from *save, switch, refresh* into *save*."
  ] },

  { h: "Where HTML is the wrong tool" },
  { l: [
   "**Logic of any kind.** No conditions, no loops. That is JavaScript's job.",
   "**Appearance.** `<font>` and `<center>` exist in old pages and are gone for good reasons; use CSS.",
   "**Anything dynamic on its own.** HTML describes a document at a moment in time."
  ] },
  { q: "Any HTML you write today will still render in thirty years. Almost nothing else in this dictionary can make that claim.", by: "The web's most unusual property" },

  { tryit: { t: "Make a page and inspect it",
    task: "Write the boilerplate above from memory, add a heading, two paragraphs and a link to a site you use. Open it, then use Inspect to change the heading text in the browser and watch it update live.",
    hint: "A link is `<a href=\"https://example.com\">text</a>`. In Inspect, double-click the text in the Elements panel to edit it.",
    sol: { lang: "html", code: "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Notes on Learning to Build</title>\n</head>\n<body>\n  <h1>Notes on Learning to Build</h1>\n  <p>I am learning HTML. This page has no styling yet and it works anyway.</p>\n  <p>Reference I keep going back to:\n     <a href=\"https://developer.mozilla.org\">MDN Web Docs</a>.</p>\n</body>\n</html>" },
    w: "Editing in Inspect changes only the browser's copy of the DOM — refresh and it is gone. That is exactly what makes it safe to experiment in, and it is how most people try a change before committing it to the file." } }
 ],
 k: [
  "HTML labels what content **is**; it has no logic and no appearance of its own.",
  "HTML is structure, CSS is appearance, JavaScript is behaviour — build in that order.",
  "The browser parses your file into the **DOM**, a live tree; Inspect shows the DOM, View Source shows your file.",
  "`<!doctype html>`, `charset`, `viewport` and `title` belong on every page — the viewport line is what makes phones work."
 ],
 r: ["HTML", "DOM", "Semantic HTML", "Client-Side Rendering", "Progressive Web App", "Web Accessibility"],
 drill: {
  lang: "html",
  reps: 3,
  items: [
   { c: "<!doctype html>", w: "tell the browser to use modern standards" },
   { c: "<meta charset=\"utf-8\">", w: "declare the character encoding so accents and emoji survive" },
   { c: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", w: "make the page render at phone width instead of zoomed out" },
   { c: "<title>My First Page</title>", w: "set the tab name and the search-result headline" }
  ]
 }
}

]);
