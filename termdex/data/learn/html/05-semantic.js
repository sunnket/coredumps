/* HTML — semantics and accessibility. */
TD.addLessons("html", [

  {
    t: "Semantic HTML and Who Can Use Your Site",
    m: "semantic",
    lvl: "core",
    s: "Choosing the element that means the right thing — and why that decision determines who can use what you build.",
    goal: [
      "Lay out a page with the structural elements instead of unnamed divs",
      "Explain what assistive technology does with your markup",
      "Test a page for the accessibility failures that actually matter"
    ],
    b: [
      { p: "Everything in this track has been building to this. Semantics is the difference between markup that merely renders and markup that *works* — and it is nearly free, because the semantic element is usually the same length as the div you were going to write." },

      { h: "The structural elements" },
      {
        vs: {
          t: "The same page, twice", lang: "html",
          bad: {
            c: "<div class=\"header\">\n  <div class=\"nav\">...</div>\n</div>\n<div class=\"main\">\n  <div class=\"article\">\n    <div class=\"title\">Post</div>\n    <div class=\"content\">...</div>\n  </div>\n  <div class=\"sidebar\">...</div>\n</div>\n<div class=\"footer\">...</div>", label: "Divs with helpful class names",
            w: "**The class names help you and nobody else.** A browser, a screen reader and a search engine see nine identical generic boxes. There is no navigation to skip to and no main content to jump to."
          },
          good: {
            c: "<header>\n  <nav>...</nav>\n</header>\n<main>\n  <article>\n    <h1>Post</h1>\n    <p>...</p>\n  </article>\n  <aside>...</aside>\n</main>\n<footer>...</footer>", label: "Semantic elements",
            w: "**Same rendering, same length, entirely different meaning.** A screen reader can now list the landmarks and jump straight to `<main>` — which is what most users do on every page."
          }
        }
      },
      {
        tbl: {
          t: "What each one means",
          h: ["Element", "Means", "How many"],
          rows: [
            ["`<header>`", "Introductory content for the page or a section", "One per page, plus one per `<article>` if useful"],
            ["`<nav>`", "**A major block of navigation links**", "Usually one or two; label them if there are several"],
            ["`<main>`", "**The unique content of this page.** Excludes header, nav and footer", "**Exactly one**, and it is what *skip to content* targets"],
            ["`<article>`", "**Self-contained** — makes sense removed from the page", "A blog post, a product card, a comment"],
            ["`<section>`", "A thematic grouping. **Should have a heading**", "As many as the content has sections"],
            ["`<aside>`", "Tangentially related — a sidebar, a pull quote", "As needed"],
            ["`<footer>`", "Closing information for its section", "One per page, plus per article if useful"],
            ["`<figure>` / `<figcaption>`", "An image, chart or code block **with its caption**", "As needed"]
          ]
        }
      },
      {
        code: {
          lang: "html", t: "A complete page skeleton",
          lines: [
            { c: "<body>", w: "" },
            { c: "  <a href=\"#main\" class=\"skip-link\">Skip to main content</a>", w: "**The first focusable element on the page.** Hidden until focused; lets a keyboard user jump past the navigation instead of tabbing through forty links on every page.", hi: true },
            { c: "", w: "" },
            { c: "  <header>", w: "" },
            { c: "    <a href=\"/\">Acme</a>", w: "" },
            { c: "    <nav aria-label=\"Main\">", w: "**Label a `<nav>` when there is more than one**, so *Main navigation* and *Footer navigation* are distinguishable in the landmark list." },
            { c: "      <ul>", w: "**Navigation is a list of links** — mark it as one, so it is announced as *list of 5 items* and can be skipped." },
            { c: "        <li><a href=\"/about\">About</a></li>", w: "" },
            { c: "        <li><a href=\"/blog\" aria-current=\"page\">Blog</a></li>", w: "**`aria-current=\"page\"` marks the current page** — announced, and stylable with `[aria-current]`." },
            { c: "      </ul>", w: "" },
            { c: "    </nav>", w: "" },
            { c: "  </header>", w: "" },
            { c: "", w: "" },
            { c: "  <main id=\"main\">", w: "**The skip link's target.**" },
            { c: "    <article>", w: "" },
            { c: "      <h1>The Cost of Cheap Abstractions</h1>", w: "" },
            { c: "      <p><time datetime=\"2026-08-25\">25 August 2026</time></p>", w: "**`<time datetime>` is machine-readable** while the text stays human-readable." },
            { c: "      <p>...</p>", w: "" },
            { c: "", w: "" },
            { c: "      <figure>", w: "" },
            { c: "        <img src=\"chart.png\" alt=\"Review time doubled after the rewrite\"", w: "" },
            { c: "             width=\"800\" height=\"400\">", w: "" },
            { c: "        <figcaption>Median review time, before and after.</figcaption>", w: "**The caption is *associated* with the image**, not merely sitting near it." },
            { c: "      </figure>", w: "" },
            { c: "    </article>", w: "" },
            { c: "", w: "" },
            { c: "    <aside aria-label=\"Related posts\">", w: "" },
            { c: "      <h2>Related</h2>", w: "" },
            { c: "    </aside>", w: "" },
            { c: "  </main>", w: "" },
            { c: "", w: "" },
            { c: "  <footer>", w: "" },
            { c: "    <p>&copy; 2026 Acme</p>", w: "" },
            { c: "  </footer>", w: "" },
            { c: "</body>", w: "" }
          ]
        }
      },
      {
        n: "`<div>` and `<span>` are not deprecated and never will be. They are the correct choice when the only reason for the element is styling or scripting — a wrapper for a grid, a target for a hook. The rule is: **reach for a semantic element first; use a div when no semantic element means the right thing.**",
        nt: "Divs are still fine"
      },

      { h: "What assistive technology does with it" },
      { p: "A screen reader does not read your page top to bottom. It builds a model from your markup and lets the user navigate it — which is only possible if the markup says what things are." },
      {
        l: [
          "**Landmarks.** `<nav>`, `<main>`, `<header>`, `<footer>` and `<aside>` become a list the user can jump between. This is how most people reach your content.",
          "**Headings.** A skimmable outline, navigable with one key.",
          "**Links and form fields.** Listable separately, which is why link text and labels matter so much.",
          "**Roles.** Every element announces what it is — *button*, *link*, *checkbox, not checked*. A `<div onclick>` announces nothing."
        ]
      },
      {
        ana: "Your markup is a building's floor plan. Semantic elements are the labelled rooms, the signposted exits and the lift. A page of unnamed divs is the same building with every door unmarked — someone who can see the layout manages, and everyone else is walking into walls.",
        at: "The labelled floor plan"
      },

      { h: "The div-button problem" },
      {
        vs: {
          t: "*Make this thing clickable*", lang: "html",
          bad: {
            c: "<div class=\"btn\" onclick=\"save()\">\n  Save\n</div>", label: "Looks fine, is broken",
            w: "**Not reachable by Tab. Does not respond to Enter or Space. Announced as nothing.** To fix it properly you need `tabindex=\"0\"`, `role=\"button\"`, keydown handlers for both keys, and a focus style — reimplementing, badly, what one element already does."
          },
          good: {
            c: "<button type=\"button\" onclick=\"save()\">\n  Save\n</button>", label: "Correct, and shorter",
            w: "**Focusable, keyboard operable, announced as a button, styleable to look identical.** Every behaviour above comes free."
          }
        }
      },
      {
        l: [
          "**Something that navigates → `<a href>`.** It should be a link, and middle-click should open it in a tab.",
          "**Something that acts → `<button>`.** Submitting, toggling, opening a dialog.",
          "**Never `<a href=\"#\">` for an action** — it navigates, it pollutes the history, and it announces as a link."
        ]
      },
      { trap: "The most common accessibility regression in a CSS reset is `outline: none` on `:focus`, added because the default ring is considered ugly. It makes the page unusable for keyboard users, who now have no idea where they are. If the default ring does not suit the design, **replace it** — `:focus-visible { outline: 2px solid; outline-offset: 2px; }` — never remove it." },

      { h: "ARIA, and the first rule of it" },
      { p: "**ARIA** adds accessibility information to markup that lacks it. It is genuinely useful, and the specification's own first rule is: **do not use ARIA if a native element would do.**" },
      {
        code: {
          lang: "html",
          lines: [
            { c: "<div role=\"button\" tabindex=\"0\">Save</div>", w: "**Works, and is strictly worse than `<button>`** — you still have to write the keyboard handlers yourself, because `role` changes only what is announced, not what it does." },
            { c: "", w: "" },
            { c: "<button aria-expanded=\"false\" aria-controls=\"menu\">Menu</button>", w: "**A legitimate use.** There is no native element for *this button opens that panel*, and `aria-expanded` is what announces open or closed.", hi: true },
            { c: "<div id=\"menu\" hidden>...</div>", w: "" },
            { c: "", w: "" },
            { c: "<div role=\"status\" aria-live=\"polite\">3 results found</div>", w: "**Announces changes to content that updates without a page load.** Without this a screen reader user has no idea the results changed." },
            { c: "", w: "" },
            { c: "<button aria-label=\"Close\">&times;</button>", w: "**When the visible content is a symbol**, `aria-label` supplies the real name." }
          ]
        }
      },
      { q: "No ARIA is better than bad ARIA. Incorrect roles and states actively mislead, where plain HTML at least tells the truth.", by: "The consensus among accessibility practitioners" },

      { h: "Testing it" },
      {
        ol: [
          "**Unplug the mouse.** Tab through the whole page. Can you reach everything, in a sensible order, and always see where you are? This finds most problems.",
          "**Run an automated checker.** Lighthouse in Chrome DevTools, or the axe DevTools extension. It catches missing alt text, unlabelled inputs and contrast failures in seconds.",
          "**Check the outline.** Chrome's Accessibility pane shows your heading structure and landmarks. Holes in it are real navigation problems.",
          "**Turn on a screen reader for five minutes.** VoiceOver (`Cmd+F5`) on macOS, NVDA free on Windows. Disorienting at first, and nothing else teaches this as fast.",
          "**Zoom to 200 per cent.** Text must reflow, not disappear or overlap."
        ]
      },
      {
        n: "Automated tools find roughly a third of accessibility issues. They cannot tell you whether your alt text is *useful*, whether the heading order makes *sense*, or whether the focus order is *logical*. Run them — they are free and fast — and then do the keyboard test yourself.",
        nt: "What the tools cannot check"
      },

      { h: "Why this matters commercially, if that is what it takes" },
      {
        l: [
          "**Around one in five people** has a disability affecting how they use the web. That is a fifth of your potential users.",
          "**It is a legal requirement** in many jurisdictions — the Equality Act in the UK, the ADA in the US, the European Accessibility Act — and lawsuits are common and rising.",
          "**Search engines read the same signals.** Headings, alt text, semantic structure and link text all feed ranking.",
          "**It helps everyone.** Captions for a noisy train, high contrast in sunlight, keyboard navigation for power users, a large tap target for anyone with a phone in one hand."
        ]
      },

      { h: "Where this track has brought you" },
      { p: "You can now write a complete page from an empty file, mark up any document correctly, build a form that works with no JavaScript, and structure a page so that everyone can navigate it. That is the whole of HTML that matters — the rest is a lookup on MDN when you need it." },
      {
        l: [
          "**Next: CSS**, which is what makes it look like you meant it. Everything here stays true; CSS is added on top.",
          "**Then build something real** — a personal site, a portfolio, a page for a project. Deploy it free with GitHub Pages or Netlify.",
          "**Keep MDN open.** `developer.mozilla.org` is the reference; it is accurate, free, and better than any tutorial for looking up one element."
        ]
      },

      {
        tryit: {
          t: "Rewrite a page in semantic HTML",
          task: "Take a page built from divs — one of your own, or any site's markup pasted into a file — and rewrite it using semantic elements. Add a skip link. Then run Lighthouse and do the keyboard test, and fix what each finds.",
          hint: "Start from the landmarks: what is the header, the navigation, the main content, the footer. Then work inwards.",
          sol: { lang: "html", code: "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Aryan Sharma — Projects</title>\n</head>\n<body>\n  <a href=\"#main\" class=\"skip-link\">Skip to main content</a>\n\n  <header>\n    <nav aria-label=\"Main\">\n      <ul>\n        <li><a href=\"/\">Home</a></li>\n        <li><a href=\"/projects\" aria-current=\"page\">Projects</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <main id=\"main\">\n    <h1>Projects</h1>\n\n    <article>\n      <h2>NodeCraft</h2>\n      <p><time datetime=\"2026-08\">August 2026</time></p>\n      <p>A technical dictionary for engineers.</p>\n      <p><a href=\"/projects/nodecraft\">Read about NodeCraft</a></p>\n    </article>\n\n    <article>\n      <h2>Price Tracker</h2>\n      <p><time datetime=\"2026-05\">May 2026</time></p>\n      <p>Watches a list of URLs and emails when a price drops.</p>\n      <p><a href=\"/projects/price-tracker\">Read about Price Tracker</a></p>\n    </article>\n  </main>\n\n  <footer>\n    <p>&copy; 2026 Aryan Sharma</p>\n  </footer>\n</body>\n</html>" },
          w: "Note that each project's link says *Read about NodeCraft* rather than *Read more*. In the link list a screen reader user pulls up, one of those is navigable and the other is four identical entries — and it took no extra effort to write."
        }
      }
    ],
    k: [
      "`<header> <nav> <main> <article> <section> <aside> <footer>` become landmarks users navigate by — same length as a div, entirely different meaning.",
      "Something that navigates is `<a href>`; something that acts is `<button>`. A clickable div reimplements both, badly.",
      "Never remove the focus outline — restyle it. Removing it makes the page unusable by keyboard.",
      "The first rule of ARIA is not to use it when a native element would do; test with the keyboard, not only with a tool."
    ],
    r: ["Semantic HTML", "Web Accessibility", "WCAG", "ARIA", "SEO", "HTML"],
    drill: {
      lang: "html",
      reps: 4,
      items: [
        { c: "<main id=\"main\">", w: "mark the unique content of the page" },
        { c: "<a href=\"#main\" class=\"skip-link\">Skip to main content</a>", w: "let a keyboard user jump past the navigation" },
        { c: "<nav aria-label=\"Main\">", w: "name a navigation block so several can be told apart" },
        { c: "<a href=\"/blog\" aria-current=\"page\">Blog</a>", w: "mark which navigation link is the current page" },
        { c: "<button type=\"button\" onclick=\"save()\">Save</button>", w: "a control that acts, keyboard-operable for free" },
        { c: "<figure><figcaption>Median review time.</figcaption></figure>", w: "associate a caption with an image rather than placing it nearby" },
        { c: "<time datetime=\"2026-08-25\">25 August 2026</time>", w: "give a date a machine-readable form" }
      ]
    }
  }

]);
