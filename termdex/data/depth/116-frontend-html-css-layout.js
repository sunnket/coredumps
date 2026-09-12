/* ==========================================================================
   Depth pass 116 — Web Frontend batch 1: HTML, DOM & CSS Layout Engines.
   HTML, CSS, DOM, Semantic HTML,
   Box Model, Flexbox, CSS Grid.

   Blink/Gecko rendering pipelines, box-tree formatting contexts,
   and 2D grid placement algorithms establish web document architecture.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "html",

      why: {
        before: "Documents on computer networks were stored in proprietary, platform-specific word processing binaries or flat unlinked ASCII text, with no universal hyperlink mechanism to cross-reference resources globally.",
        problem: "The global Internet required an open, human-readable, machine-parseable markup language that could structure text, embed multimedia, and interconnect documents through hyperlinks across any operating system or display hardware.",
        shift: "**HTML (HyperText Markup Language): The standard markup language for documents designed to be displayed in a web browser.** Conceived by Tim Berners-Lee in 1989 and standardized through HTML5 (W3C/WHATWG), HTML defines the syntactic semantic structure that browser parsing engines lower into the Document Object Model (DOM)."
      },

      num: {
        t: "HTML Evolution & Parsing Engine Pipeline: Standard Milestones",
        h: ["Specification / Epoch", "Parser Conformance", "Error Recovery Mechanism", "Multimedia / API Integration", "Primary Structural Advancement"],
        r: [
          ["HTML 2.0 / 3.2 (1995-1997)", "SGML-based; ad-hoc browser parsers", "Undefined; divergent tag soup rendering", "Basic `<img>` tag; no native video/audio", "Tables for layout; font tags; presentation mixed with structure"],
          ["HTML 4.01 / XHTML 1.0 (1999-2000)", "Strict XML parsing (XHTML) vs loose SGML", "Fatal XML drill-down: single syntax error halts render", "Plugins (Flash, Java Applets, ActiveX)", "CSS separation of presentation; strict DTD document validation"],
          ["HTML5 Living Standard (WHATWG)", "Deterministic state machine parser spec", "Strictly standardized error-recovery algorithms", "Native `<video>`, `<audio>`, `<canvas>`, WebSockets", "Semantic elements (`<article>`, `<nav>`), offline storage, Web Workers"],
          ["Modern Streaming HTML", "Incremental chunked tokenization", "Speculative lookahead pre-parsing (preload scanner)", "Declarative Shadow DOM, custom elements", "Server-Side Rendering (SSR) streaming chunks, web components"]
        ],
        n: "HTML parsing operates through a formal state machine defined by the WHATWG Living Standard. In modern browser engines (Blink/Chromium, Gecko/Firefox, WebKit/Safari), the network stack streams raw UTF-8 bytes into the **Tokenizer**, which emits tokens (StartTag, EndTag, Character, Comment, DOCTYPE) into the **Tree Builder**. Unlike strict XML, the HTML5 specification defines exact, deterministic error-handling rules for malformed markup (e.g., automatically closing unclosed `<p>` tags when a `<div>` is encountered). Concurrently, a secondary **Preload Scanner** scans ahead in raw HTML chunks to discover external sub-resources (`<link rel='stylesheet'>`, `<script>`, `<img>`), initiating parallel HTTP/2 or HTTP/3 network requests long before the primary DOM tree builder reaches those nodes."
      },

      miss: [
        {
          w: "HTML is a full programming language.",
          r: "HTML is a **declarative markup language**, not a Turing-complete programming language. It defines the hierarchical semantic structure and metadata of a document, but contains zero conditional branching, loops, memory manipulation, or algorithmic logic (unless combined with CSS/JavaScript)."
        },
        {
          w: "XHTML strict parsing is used by modern web browsers.",
          r: "XHTML failed commercially because its requirement to halt rendering on a single XML syntax error broke the resilient nature of the web. The web industry adopted the **WHATWG HTML5 Living Standard**, which mandates a forgiving, deterministic error-tolerant parser that always produces a valid DOM tree from any input."
        },
        {
          w: "The `<!DOCTYPE html>` declaration tells the browser which HTML version to use.",
          r: "In modern HTML5, `<!DOCTYPE html>` is not a version switch. It exists solely to trigger **Standards Mode** in browser layout engines, preventing the browser from falling back into legacy **Quirks Mode** (which emulates 1990s Netscape Navigator 4 and IE5 layout bugs)."
        },
        {
          w: "Self-closing slashes (`<img />`, `<input />`) are required in modern HTML5.",
          r: "In standard HTML5 (text/html), the trailing slash on void elements (`<img />`, `<br />`) is **completely ignored by the parser**. Void elements cannot have children by definition; `<img />` is parsed identically to `<img>`. The slash is merely an aesthetic remnant of XHTML."
        }
      ],

      trade: {
        buys: [
          "Universal client interoperability: renders reliably across every web browser, mobile device, gaming console, and screen reader.",
          "High streaming resilience: browsers render HTML chunks incrementally as bytes arrive over the network before the download finishes.",
          "Accessibility foundation: provides native semantic roles and ARIA mappings without requiring custom JavaScript widgets.",
          "SEO and discoverability: search engine crawlers and social scrapers parse HTML metadata to index pages and generate previews."
        ],
        costs: [
          "No native layout control: pure HTML requires external CSS styling engines to specify visual placement and responsive breakpoints.",
          "Verbose document bloat: deep nested `div` wrappers ('div soup') inflate DOM node counts, increasing browser memory consumption.",
          "Silent error masking: forgiving parser auto-correction can hide authoring bugs that cause subtle layout or accessibility defects.",
          "Strict parser synchronization: un-deferred `<script>` tags block the HTML tokenizer, stalling rendering pipelines."
        ],
        avoid: [
          "Never omit `<!DOCTYPE html>` at the top of an HTML document, as this forces browsers into legacy Quirks Mode.",
          "Do not use generic `<div>` elements for clickable interactions; use native `<button>` or `<a>` for built-in keyboard and screen-reader accessibility.",
          "Avoid placing synchronous `<script>` tags in the `<head>` without `defer` or `async`, as they block HTML parsing and stall page rendering.",
          "Never use obsolete presentational HTML tags (`<font>`, `<center>`, `<big>`); manage all visual presentation through CSS."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "css",

      why: {
        before: "Visual styling (colors, fonts, borders, alignment) had to be hardcoded directly into HTML markup via attributes (`bgcolor`, `<font size=3>`), requiring developers to manually edit hundreds of individual files to change a single corporate brand color.",
        problem: "Web engineering requires a dedicated, declarative styling language that cleanly separates presentation from document structure, enabling centralized visual design, media adaptivity, and cascading style inheritance.",
        shift: "**CSS (Cascading Style Sheets): A stylesheet language used for describing the presentation of a document written in HTML or XML.** Conceived by Håkon Wium Lie in 1994, CSS computes final visual properties by evaluating the Cascade, Specificity, and Inheritance over a tree of rule selectors."
      },

      num: {
        t: "The CSS Specificity Hierarchy & Cascade Layer Resolution",
        h: ["Cascade Layer / Selector Type", "Specificity Vector `(a, b, c)`", "Selector Example", "Override Strength", "Modern Engineering Standard"],
        r: [
          ["`!important` Rule", "Overrides normal cascade", "`color: red !important;`", "Highest (bypasses standard selector specificity)", "Emergency utility override (anti-pattern in components)"],
          ["Inline Style Attribute", "`(1, 0, 0, 0)` equivalent", `<div style="color: red">`, "Extremely High (overrides all external sheet selectors)", "Dynamic runtime animation calculations via JS"],
          ["ID Selector", "`(0, 1, 0, 0)`", "`#header`, `#checkout-form`", "High ($1$ ID overrides infinite classes)", "Avoid in reusable component design systems"],
          ["Class / Attribute / Pseudo-class", "`(0, 0, 1, 0)`", "`.btn`, `[type='checkbox']`, `:hover`", "Standard modular styling specificity", "BEM naming, Tailwind utility classes, CSS Modules"],
          ["Type / Pseudo-element Selector", "`(0, 0, 0, 1)`", "`div`, `p`, `::before`, `::after`", "Lowest explicit specificity", "CSS resets, global typography base styles"],
          ["`@layer` Cascade Layers", "Explicit layer ordering", "`@layer framework, components;`", "Ordered by layer declaration independent of specificity", "Modern architecture: base < components < utilities"]
        ],
        n: "CSS operates through **The Cascade**: an algorithm that takes multiple competing style declarations and resolves them to a single **Computed Style** for every DOM element. In browser rendering engines, parsing CSS text produces the **CSSOM (CSS Object Model)**. The cascade resolves competing declarations through a strict hierarchy: (1) Importance (`!important`), (2) Origin (User Agent defaults < User custom styles < Author page styles), (3) **Cascade Layers (`@layer`)**, (4) **Specificity** (a 3-tuple vector representing IDs, Classes/Attributes, and Elements), and (5) **Source Order** (last rule declared wins). Once computed values are determined, the browser marries the DOM and CSSOM to build the **Render Tree**, computing layout geometry (Reflow) and pixel rendering (Repaint)."
      },

      miss: [
        {
          w: "CSS is simple and doesn't require architectural design.",
          r: "CSS is a complex declarative constraint solver. Without architectural methodologies (BEM, CSS Modules, Tailwind, `@layer`), large enterprise codebases suffer from specificity wars, global namespace pollution, and dead CSS rules that no engineer dares to delete."
        },
        {
          w: "Writing 11 class selectors (`.a.b.c...`) can override a single `#id` selector.",
          r: "In the CSS specificity calculation, specificity is a tuple `(IDs, Classes, Elements)`, NOT a decimal number. One ID selector `(1, 0, 0)` beats **any number** of chained class selectors `(0, 50, 0)`. The myth originated from early 1990s browsers that used an 8-bit integer for class counts, which overflowed at 256."
        },
        {
          w: "`visibility: hidden` and `display: none` produce the same result.",
          r: "`display: none` removes the element entirely from the **Render Tree**: it occupies zero space, triggers a layout reflow, and hides children. `visibility: hidden` hides the element visually, but the element **still occupies physical space** in the layout and participates in layout geometry."
        },
        {
          w: "CSS animations always run slower than JavaScript animations.",
          r: "CSS animations that only mutate GPU-accelerated compositor properties (`transform` and `opacity`) bypass both the Layout and Paint stages of the browser rendering pipeline, running directly on the **GPU Compositor Thread** at a buttery 60/120 FPS even when the main JavaScript thread is completely frozen."
        }
      ],

      trade: {
        buys: [
          "Complete separation of concerns: alters the visual branding of an entire web application by editing a single stylesheet.",
          "Hardware-accelerated rendering: GPU compositor thread runs CSS transforms and opacity fades with zero main-thread jank.",
          "Device adaptivity: media queries and container queries adjust layouts dynamically to any screen width or orientation.",
          "Declarative constraint solving: delegates complex geometric calculations to high-performance C++ browser layout engines."
        ],
        costs: [
          "Global namespace by default: raw CSS class names are globally scoped, leading to naming collisions without modular tooling.",
          "Dead code accumulation: unused CSS accumulates because safely verifying that a selector isn't used across dynamic DOMs is difficult.",
          "Render-blocking network dependency: external CSS stylesheets block the initial page paint until completely downloaded and parsed.",
          "Specificity creep: teams often resort to `!important` or selector chaining to override legacy rules, destroying maintainability."
        ],
        avoid: [
          "Never use `!important` to resolve routine selector specificity conflicts in component architectures.",
          "Do not animate layout-triggering properties (`width`, `height`, `top`, `left`); animate `transform` and `opacity` for 60 FPS.",
          "Avoid using ID selectors (`#header`) in component styling to prevent specificity inflation.",
          "Never ship massive monolithic stylesheets without minification, purge-pruning (PurgeCSS), or route-level code splitting."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dom",

      why: {
        before: "Web pages were static text streams rendered once by the browser, with no programmatic interface for JavaScript to inspect, manipulate, reorder, or update page elements dynamically in response to user events.",
        problem: "Client-side applications need an in-memory, object-oriented tree representation of the HTML document that exposes standard APIs for dynamically reading and mutating elements, styles, attributes, and event listeners.",
        shift: "**DOM (Document Object Model): A cross-platform and language-independent interface that treats an HTML or XML document as a tree structure wherein each node is an object representing a part of the document.** Maintained by the W3C and WHATWG, the DOM enables JavaScript to execute dynamic client-side interactivity."
      },

      num: {
        t: "DOM Tree Node Hierarchy & Event Propagation Phases",
        h: ["Node / Phase Type", "Inheritance Interface", "Node Type Constant", "Operational Role", "Performance / Architectural Rule"],
        r: [
          ["`Document` Node", "Inherits `Node` -> `EventTarget`", "`Node.DOCUMENT_NODE` (9)", "Root entry point of the entire document tree", "Entry for `getElementById()`, querySelectors"],
          ["`Element` Node", "Inherits `Node` -> `EventTarget`", "`Node.ELEMENT_NODE` (1)", "HTML tags (`<div>`, `<p>`, `<button>`)", "Has attributes, class lists, bounding rects"],
          ["`Text` Node", "Inherits `CharacterData` -> `Node`", "`Node.TEXT_NODE` (3)", "Actual text content inside HTML tags", "Leaf node; white-space creates empty text nodes"],
          ["Capture Phase (Event)", "Top-down propagation (Window -> Target)", "Event Phase 1", "Propagates from root down to event target", "Enabled via `{ capture: true }` in `addEventListener`"],
          ["Target Phase (Event)", "Event arrival at exact clicked element", "Event Phase 2", "Fires listeners registered directly on target", "Event target element executing handlers"],
          ["Bubbling Phase (Event)", "Bottom-up propagation (Target -> Window)", "Event Phase 3", "Bubbles up from target to document root", "Enables **Event Delegation** (1 listener on parent for $1000$ items)"]
        ],
        n: "The Document Object Model (DOM) is an in-memory tree of C++ objects instantiated by the browser's HTML parser. In Chromium's Blink engine, elements inherit from `Node`, which inherits from `EventTarget`. Interacting with the DOM from JavaScript requires **crossing the language boundary**: JavaScript engines (like V8) communicate with the browser's C++ DOM implementation via generated C++ bindings (IDL), incurring pointer serialization overhead. Furthermore, mutating the DOM triggers browser recalculations: reading geometry properties (like `offsetHeight`, `getBoundingClientRect()`) immediately after a style mutation forces **Forced Synchronous Layout (Layout Thrashing)**, where the browser must pause JavaScript execution to recalculate layout geometry."
      },

      miss: [
        {
          w: "The DOM is part of the JavaScript programming language specification.",
          r: "The DOM is **NOT part of ECMAScript (JavaScript)**. ECMAScript specifies core language syntax, prototypes, and types. The DOM is a **Web Platform Host API** provided by the browser (specified separately by WHATWG). JavaScript running in Node.js has no DOM by default."
        },
        {
          w: "The HTML source code you write and the DOM in memory are identical.",
          r: "HTML is a static text serialization; the DOM is a live, dynamic object graph. Browsers automatically correct malformed HTML (inserting missing `<tbody>` tags into `<table>`, closing unclosed tags), and client-side JavaScript dynamically mutates DOM nodes, creating a live tree that differs significantly from initial HTML text."
        },
        {
          w: "The DOM and the visual Render Tree are the same thing.",
          r: "The DOM contains all parsed HTML nodes (including `<head>`, `<meta>`, and elements with `display: none`). The **Render Tree** only contains nodes that are visually rendered on screen. Elements with `display: none` are present in the DOM tree, but completely absent from the Render Tree."
        },
        {
          w: "Direct DOM manipulation in modern browsers is always slow.",
          r: "Direct DOM mutation itself is relatively fast C++ code. The slowness comes from **Layout Thrashing**: interleaving DOM writes and geometry reads, which repeatedly forces the browser to synchronously recompute layout and repaint pixels."
        }
      ],

      trade: {
        buys: [
          "Dynamic interactivity: allows JavaScript to add, delete, update, and animate HTML elements and text in real time.",
          "Standardized event system: provides a unified event model (bubbling, capturing, delegation) for user interactions.",
          "Rich accessibility integration: automatically maps DOM tree nodes to the browser's Accessibility Tree (a11y tree).",
          "Universal ecosystem target: powers modern reactive UI frameworks (React, Vue, Svelte) and web components."
        ],
        costs: [
          "JS-to-C++ boundary overhead: repeatedly calling DOM APIs from JavaScript incurs foreign-function interface overhead.",
          "Memory overhead: each DOM node is a heavy C++ object with dozens of property descriptors, consuming substantial RAM at scale.",
          "Layout thrashing vulnerability: alternating style mutations with geometry reads freezes the main thread with reflows.",
          "Fragile imperative code: manual direct DOM manipulation leads to state synchronization bugs without structured UI frameworks."
        ],
        avoid: [
          "Never read layout properties (`offsetHeight`, `clientWidth`) immediately after writing styles in a loop (Layout Thrashing).",
          "Do not attach separate event listeners to thousands of table rows; attach one listener to the parent table using **Event Delegation**.",
          "Avoid manipulating the live DOM repeatedly inside loops; use a `DocumentFragment` to batch additions off-DOM.",
          "Never insert un-sanitized user strings into the DOM via `innerHTML`; use `textContent` or DOMPurify to prevent Cross-Site Scripting (XSS)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "semantic-html",

      why: {
        before: "Developers constructed entire web page layouts using generic, meaningless `<div>` and `<span>` tags styled with arbitrary classes (`<div class='nav'>`), rendering web documents opaque and uninterpretable to search engines, screen readers, and automated parsers.",
        problem: "Web content needs machine-readable structure that conveys the intrinsic meaning, role, and hierarchy of content to assistive technologies (screen readers), web crawlers (SEO), and browser reader modes.",
        shift: "**Semantic HTML: The use of HTML markup to reinforce the meaning of the information in web pages rather than merely defining its presentation.** Introduced heavily in HTML5, elements like `<nav>`, `<main>`, `<article>`, `<header>`, and `<aside>` provide standardized semantic landmarks."
      },

      num: {
        t: "Semantic HTML Elements vs Generic Containers: Roles & Accessibility",
        h: ["Semantic Element", "Generic Alternative", "Implicit ARIA Landmark Role", "Screen Reader Navigation Behavior", "Primary Content Scope"],
        r: [
          ["`<header>`", "`<div class='header'>`", "`role='banner'` (top-level)", "Announced as page or section banner landmark", "Introductory content, site branding, navigational aids"],
          ["`<nav>`", "`<div class='nav'>`", "`role='navigation'`", "Enables blind users to jump directly to nav links", "Major navigation blocks (primary site menu, pagination)"],
          ["`<main>`", "`<div class='main'>`", "`role='main'`", "Screen reader shortcut: bypasses navigation to main body", "Dominant, unique topic content of the document (only 1 per page)"],
          ["`<article>`", "`<div class='post'>`", "`role='article'`", "Announced as self-contained independent article", "Independent reusable content (blog post, forum comment, tweet)"],
          ["`<section>`", "`<div class='section'>`", "`role='region'` (if named)", "Navigable region when labeled with `aria-label`", "Generic thematic grouping of content with a heading"],
          ["`<aside>`", "`<div class='sidebar'>`", "`role='complementary'`", "Identified as secondary related content", "Sidebars, callout boxes, related links, advertisements"],
          ["`<footer>`", "`<div class='footer'>`", "`role='contentinfo'`", "Announced as site footer landmark", "Copyright, legal notices, contact info, sitemap"]
        ],
        n: "Semantic HTML establishes an explicit contract between document authors and user agents. When a browser parses semantic tags, it automatically populates the **Accessibility Tree (a11y tree)** with built-in ARIA roles, states, and keyboard focus behaviors. For example, using `<button>` automatically gives the element `role='button'`, tab-index focusability (`Tab`), and keyboard activation handlers (`Enter` and `Space`). Replicating this behavior with a generic `<div class='btn'>` requires manually adding `role='button'`, `tabindex='0'`, `aria-pressed`, and custom JavaScript `keydown` listeners. Furthermore, search engine crawlers (Googlebot) parse semantic landmarks and heading structures (`<h1>` to `<h6>`) to extract the document's conceptual outline and assign ranking weights to primary topic content over peripheral footer links."
      },

      miss: [
        {
          w: "Semantic HTML is only for blind people using screen readers.",
          r: "Semantic HTML benefits everyone: it powers browser **Reader Modes** (Safari Reader, Firefox Reader View), enables Googlebot to accurately index primary page content for SEO, provides rich link previews on social platforms, improves developer maintainability, and enhances mobile touch behaviors."
        },
        {
          w: "A web page can have multiple `<main>` tags visible at the same time.",
          r: "The HTML specification strictly mandates that an HTML document must have **only one visible `<main>` element** at any time. `<main>` represents the central unique topic of that specific document."
        },
        {
          w: "Using `<section>` everywhere instead of `<div>` makes your code semantic.",
          r: "A `<section>` should only be used to define a **thematic grouping of content that has a natural heading** (`<h2>` - `<h6>`). Using `<section>` purely for CSS styling or layout wrapping is incorrect; a generic `<div>` is the appropriate element for purely visual layout containers."
        },
        {
          w: "Adding ARIA attributes (`role='button'`) is just as good as using a native semantic `<button>`.",
          r: "The First Rule of ARIA explicitly states: *If you can use a native HTML element or attribute with the semantics and behavior you require, then do so rather than repurposing an element and adding ARIA.* A `<div role='button'>` lacks keyboard activation, focus rings, disabled states, and form submission capabilities by default."
        }
      ],

      trade: {
        buys: [
          "Built-in web accessibility: provides native screen reader navigation landmarks and ARIA roles with zero custom JavaScript.",
          "SEO optimization: search engines prioritize content structured within semantic headings, articles, and main containers.",
          "Keyboard navigability: native interactive elements (`<button>`, `<a>`, `<input>`) provide built-in Tab indexing and key bindings.",
          "Code maintainability: self-describing tags make codebase structure immediately readable to development teams."
        ],
        costs: [
          "Requires strict structural discipline: developers must understand semantic nuances (`<article>` vs `<section>` vs `<aside>`).",
          "Browser default style overrides: semantic elements often come with User-Agent default margins and padding requiring CSS resets.",
          "Legacy browser support: very old legacy browsers (IE8) required HTML5 shims (`html5shiv`) to recognize semantic tags.",
          "Initial design friction: forces teams to think about content taxonomy before jumping into visual layout design."
        ],
        avoid: [
          "Never use `<div onclick='...'>` for clickable buttons; always use the native `<button>` element.",
          "Do not skip heading levels (e.g., jumping from `<h1>` directly to `<h4>`); maintain an orderly sequential heading hierarchy.",
          "Avoid using `<article>` or `<section>` purely as visual CSS styling wrappers; use `<div>` for presentational grouping.",
          "Never nest a `<header>` or `<footer>` inside another `<header>` or `<footer>`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "box-model",

      why: {
        before: "Early layout engines had no consistent mathematical definition for how element width, padding, borders, and margins interacted, leading to wild cross-browser layout bugs where adding padding to an element expanded its overall width and broke multi-column layouts.",
        problem: "Browser rendering engines require a deterministic, standardized geometric model that calculates the physical bounding box dimensions, spacing, and collision boundaries of every visual element on the page.",
        shift: "**CSS Box Model: A foundational module of CSS that defines how rectangular boxes are generated for elements and how their Content, Padding, Border, and Margin layers interact geometrically.** Controlled via the `box-sizing` property, it dictates all document layout math."
      },

      num: {
        t: "Box Model Mathematics: `content-box` vs `border-box`",
        h: ["Dimension / Behavior", "`content-box` (W3C Default)", "`border-box` (Modern Standard)", "Mathematical Difference", "Practical Architectural Consequence"],
        r: [
          ["Total Rendered Width ($W_{\\text{total}}$)", "$\\text{width} + \\text{padding} + \\text{border}$", "Strictly equal to declared `width`", "$W_{\\text{total}} = w + 2p + 2b$ vs $W_{\\text{total}} = w$", "`content-box` breaks grid columns when padding is added"],
          ["Content Area Width ($W_{\\text{content}}$)", "Declared `width` ($w$)", "$\\text{width} - \\text{padding} - \\text{border}$", "Content shrinks to accommodate padding", "Keeps container outer dimensions predictable"],
          ["Margin Behavior", "External spacing outside border", "External spacing outside border", "Identical in both models", "Margins participate in **Margin Collapsing**"],
          ["Calculation for `width: 50%` with `padding: 20px`", "Result $> 50\\%$ (Breaks 2-column flex)", "Result strictly $= 50\\%$ (Columns stay aligned)", "Excess width causes immediate wrapping", "Mandates universal `box-sizing: border-box` reset"],
          ["Universal CSS Reset", "Default browser stylesheet", "`*, *::before, *::after { box-sizing: border-box; }`", "Eliminates unexpected width blowouts", "Standard in Tailwind, Bootstrap, and modern web apps"]
        ],
        n: "The CSS Box Model wraps every HTML element in four concentric rectangular geometric boundaries: (1) **Content Box** (text, images), (2) **Padding Box** (clear spacing around content inside the background), (3) **Border Box** (rendered outline or stroke), and (4) **Margin Box** (transparent outer spacing separating adjacent elements). In the legacy W3C default (`box-sizing: content-box`), declaring `width: 200px; padding: 20px; border: 5px solid black;` yields a physical rendered screen width of $200 + 40 + 10 = 250\\text{ px}$. Modern web architecture universally applies `box-sizing: border-box`: the declared `width: 200px` encompasses content, padding, and borders, shrinking the internal content area to $150\\text{ px}$ and keeping external layout math completely stable and predictable."
      },

      miss: [
        {
          w: "Vertical margins between adjacent block elements always add together.",
          r: "In normal block flow, adjacent vertical margins **collapse** into a single margin! If element A has `margin-bottom: 30px` and element B below it has `margin-top: 20px`, the distance between them is **30px** (the maximum of the two), NOT 50px. Note that margins in Flexbox and CSS Grid containers do NOT collapse."
        },
        {
          w: "Setting `padding` on an inline element (`<span>`) pushes adjacent lines down.",
          r: "On inline elements, horizontal padding and borders push adjacent elements left and right, but **vertical padding and borders do not push surrounding lines away**. They overlap adjacent lines of text without increasing the line-box height."
        },
        {
          w: "The Internet Explorer 5 box model was completely wrong and broken.",
          r: "IE5's 'quirks mode' box model calculated width including padding and border (exactly what `box-sizing: border-box` does today). While IE5 violated the contemporary W3C standard, web developers universally preferred IE's intuitive math. The W3C eventually standardized it as `box-sizing: border-box` in CSS3."
        },
        {
          w: "Negative margins are illegal in CSS.",
          r: "Negative margins are completely valid CSS. A negative margin pulls the element in that direction or pulls subsequent sibling elements closer, commonly used for overlapping hero banners or centering techniques."
        }
      ],

      trade: {
        buys: [
          "Predictable layout dimensions: `box-sizing: border-box` ensures containers never exceed their declared width when padding is added.",
          "Clear separation of spacing concerns: distinguishes internal breathing room (padding) from external separation (margin).",
          "Universal layout standard: forms the common geometric vocabulary across all CSS formatting contexts (Block, Flex, Grid).",
          "Precise hit-testing boundaries: accurately defines pointer click, hover, and collision areas in the browser engine."
        ],
        costs: [
          "Margin collapsing complexity: vertical margin collapsing introduces unexpected spacing bugs between parent-child or sibling elements.",
          "Inline element limitations: inline box models behave differently from block box models, confusing junior developers.",
          "Layout thrashing on mutation: altering box model dimensions via JavaScript forces expensive browser layout reflows.",
          "Legacy default friction: default `content-box` behavior requires an explicit global CSS reset on every new project."
        ],
        avoid: [
          "Never start a modern web project without applying the universal `box-sizing: border-box` CSS reset.",
          "Do not use top/bottom margins on inline elements (`<span>`, `<a>`); set `display: inline-block` or `block` first.",
          "Avoid combining percentage widths with fixed-pixel padding in `content-box` mode; it breaks grid columns.",
          "Never attempt to fix unexpected margin collapsing by adding arbitrary `<br>` tags; use padding or establish a new BFC (Block Formatting Context)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "flexbox",

      why: {
        before: "Multi-column web layouts and vertical centering relied on brittle hacks: HTML tables, CSS floats requiring clearfix hacks, inline-block spacing anomalies, and absolute positioning coordinate math.",
        problem: "Modern web interfaces need a flexible, 1-dimensional layout model that automatically calculates item sizing, alignment, distribution, and wrapping along a single axis (row or column) across dynamic screen sizes.",
        shift: "**Flexbox (CSS Flexible Box Layout): A 1-dimensional CSS layout model that provides space distribution and powerful alignment capabilities along a main axis and cross axis.** Standardized by the W3C, Flexbox revolutionized UI component engineering by making vertical centering and dynamic space distribution trivial."
      },

      num: {
        t: "Flexbox Layout Mechanics: Axis Alignment & Sizing Algorithms",
        h: ["Property / Concept", "Target Entity", "Applicable Axis", "Primary Operational Values", "Engine Calculation Role"],
        r: [
          ["`flex-direction`", "Flex Container", "Defines Main Axis", "`row`, `row-reverse`, `column`, `column-reverse`", "Establishes orientation of main axis vs cross axis"],
          ["`justify-content`", "Flex Container", "Main Axis", "`flex-start`, `center`, `space-between`, `space-around`", "Distributes leftover free space along the main axis"],
          ["`align-items`", "Flex Container", "Cross Axis", "`stretch`, `center`, `flex-start`, `flex-end`, `baseline`", "Aligns all flex items along the cross axis"],
          ["`align-self`", "Flex Item", "Cross Axis", "`auto`, `center`, `flex-start`, `flex-end`, `stretch`", "Overrides container `align-items` for a single specific item"],
          ["`flex-grow`", "Flex Item", "Main Axis", "Non-negative number (default: `0`)", "Determines proportion of positive free space consumed"],
          ["`flex-shrink`", "Flex Item", "Main Axis", "Non-negative number (default: `1`)", "Determines proportion of negative overflow space absorbed"],
          ["`flex-basis`", "Flex Item", "Main Axis", "`auto`, length (e.g., `200px`, `25%`)", "Initial unconstrained size before grow/shrink algorithm runs"]
        ],
        n: "Flexbox is a **1-dimensional layout engine**. Setting `display: flex` establishes a **Flex Formatting Context (FFC)**. The layout operates along two perpendicular axes: the **Main Axis** (defined by `flex-direction`) and the **Cross Axis**. Item sizing is governed by the **Flex Sizing Algorithm** via shorthand `flex: <grow> <shrink> <basis>`. The engine computes the **Free Space** along the main axis: $S_{\\text{free}} = W_{\\text{container}} - \\sum \\text{basis}$. If $S_{\\text{free}} > 0$, space is distributed proportionally according to each item's `flex-grow` factor: $\\Delta w_i = S_{\\text{free}} \\times \\frac{\\text{grow}_i}{\\sum \\text{grow}}$. If $S_{\\text{free}} < 0$, items shrink according to their scaled shrink factor $\\text{shrink}_i \\times \\text{basis}_i$. Vertical centering—historically one of the hardest challenges in CSS—reduces to two trivial declarations: `justify-content: center; align-items: center;`."
      },

      miss: [
        {
          w: "Flexbox and CSS Grid are competing layout systems, and one replaces the other.",
          r: "Flexbox and CSS Grid are complementary. **Flexbox is 1-dimensional** (lays out items along a single axis at a time, either row OR column, ideal for navigation bars, card interiors, and UI widgets). **CSS Grid is 2-dimensional** (lays out items across both rows AND columns simultaneously, ideal for whole-page layouts)."
        },
        {
          w: "Setting `flex: 1` means `flex-grow: 1, flex-shrink: 1, flex-basis: auto`.",
          r: "In the CSS specification, the shorthand `flex: 1` expands to **`flex-grow: 1, flex-shrink: 1, flex-basis: 0%`** (NOT `auto`!). Setting `flex-basis: 0%` ignores the natural content size of the item, forcing all flex items to share container space equally regardless of their text content."
        },
        {
          w: "`justify-content` always aligns items horizontally, and `align-items` always aligns vertically.",
          r: "`justify-content` aligns along the **Main Axis**, and `align-items` aligns along the **Cross Axis**. If `flex-direction: column` is set, the main axis becomes **vertical** (so `justify-content` controls vertical spacing) and the cross axis becomes **horizontal** (so `align-items` controls horizontal alignment)."
        },
        {
          w: "An item with `flex-shrink: 0` will still shrink if the screen is too small.",
          r: "`flex-shrink: 0` strictly prohibits the flex item from shrinking below its `flex-basis` or minimum content size. If container space is insufficient, the item will **overflow** the parent container boundary rather than shrink."
        }
      ],

      trade: {
        buys: [
          "Effortless centering: achieves horizontal and vertical centering with two simple declarative properties.",
          "Dynamic space distribution: automatically fills available screen space and wraps items without media queries.",
          "Directional flexibility: flips layout ordering via `row-reverse` or `flex-direction: column` for mobile responsive views.",
          "Equal-height columns: children in a row automatically stretch to match the height of the tallest sibling item."
        ],
        costs: [
          "1D limitation: cannot coordinate row and column alignments simultaneously (grid misalignment across wrapped lines).",
          "Content-sizing quirks: `flex-basis: auto` versus `0%` causes unexpected sizing discrepancies based on text lengths.",
          "Performance on deep nesting: deeply nested flexbox trees can increase layout computation time on massive DOM trees.",
          "Minimum width trap: flex items have an implicit `min-width: auto`, preventing long text strings from shrinking without `min-width: 0`."
        ],
        avoid: [
          "Never forget to set `min-width: 0` on flex items containing truncating text or ellipsis to prevent container overflow.",
          "Do not use Flexbox for complex 2-dimensional page layouts where elements must align across both rows and columns; use CSS Grid.",
          "Avoid setting hardcoded pixel widths on flex items; use `flex-basis` and `flex-grow` for responsive flexibility.",
          "Never assume `justify-content` is always horizontal; remember it follows `flex-direction`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "css-grid",

      why: {
        before: "Building 2-dimensional page layouts required hacking together nested flexboxes, floating columns, or rigid third-party 12-column CSS frameworks (Bootstrap), resulting in bloated DOM wrapper elements and misaligned grid cells.",
        problem: "Modern web applications require a native 2-dimensional layout system that can position, size, and align elements across both rows and columns simultaneously without cluttering the HTML markup with presentation wrappers.",
        shift: "**CSS Grid Layout: A 2-dimensional layout system for the web that lets authors divide a page into major regions or define relationships between parts of a control in terms of size, position, and layer.** Introducing grid tracks, grid lines, fractional units (`fr`), and named grid areas, CSS Grid is the most powerful layout system ever built into web browsers."
      },

      num: {
        t: "CSS Grid Primitives: Fractional Units, Areas & Tracks",
        h: ["CSS Grid Feature", "Syntax / Function", "Dimensional Role", "Key Behavior / Advantage", "Optimal Use Case"],
        r: [
          ["Fractional Unit (`fr`)", "`1fr 2fr 1fr`", "Track sizing", "Allocates leftover space proportionally", "Fluid multi-column layouts without percentage rounding bugs"],
          ["`repeat(auto-fit, minmax(...))`", "`repeat(auto-fit, minmax(250px, 1fr))`", "Dynamic responsive columns", "Wraps columns automatically with zero media queries", "Responsive card grids adapting from mobile to 4K monitors"],
          ["Named Grid Areas", "`grid-template-areas: 'h h' 's m' 'f f'`", "2D visual mapping", "Maps component positions to readable layout ASCII art", "Top-level application shells (header, sidebar, main, footer)"],
          ["Grid Lines", "`grid-column: 1 / -1;`", "Placement & Spanning", "Spans item across explicit grid track lines", "Full-width hero banners breaking out of container grids"],
          ["`gap` / `row-gap` / `column-gap`", "`gap: 24px;`", "Gutters", "Clean spacing between tracks with zero edge margins", "Consistent gutter spacing without margin collapsing hacks"]
        ],
        n: "Setting `display: grid` creates a **Grid Formatting Context (GFC)**. The layout engine establishes a 2D coordinate system composed of **Grid Tracks** (rows and columns), **Grid Lines** (1-based numerical boundaries separating tracks), and **Grid Cells**. Sizing utilizes the revolutionary **Fractional Unit (`fr`)**: after subtracting non-flexible tracks and gaps, remaining free space is divided by the sum of all `fr` values. The `minmax(min, max)` function establishes track clamping boundaries. When paired with `auto-fill` or `auto-fit`, CSS Grid accomplishes **responsive layout without media queries**: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))` dynamically packs as many 300px columns as will fit on screen, seamlessly expanding them to fill free space as the viewport widens."
      },

      miss: [
        {
          w: "CSS Grid is meant to replace Flexbox entirely.",
          r: "CSS Grid and Flexbox are designed to work **together**. CSS Grid is 2-dimensional, designed for the macro layout of the overall page (headers, sidebars, content grids). Flexbox is 1-dimensional, designed for micro layouts inside components (navigation links, button groups, card headers)."
        },
        {
          w: "The difference between `auto-fill` and `auto-fit` is purely cosmetic.",
          r: "They handle leftover space differently when there are few items. `auto-fill` creates empty, ghost tracks to fill the container width. `auto-fit` collapses empty tracks to $0\\text{ px}$, stretching the existing items to fill the entire remaining container width."
        },
        {
          w: "Grid line numbering starts at 0 just like arrays in programming.",
          r: "CSS Grid lines use **1-based indexing** ($1, 2, 3\\dots$). Negative indices are also supported, counting backwards from the end (`-1` represents the last grid line, meaning `grid-column: 1 / -1` spans the full width of the grid)."
        },
        {
          w: "Subgrid is just an alias for standard nested grids.",
          r: "Standard nested grids define their own independent track sizing completely decoupled from the parent. **`subgrid`** allows a child grid to **adopt and align with the exact row and column tracks of its parent grid**, ensuring nested card titles and buttons align perfectly across sibling cards."
        }
      ],

      trade: {
        buys: [
          "True 2D layout alignment: coordinates placement across rows and columns simultaneously without misalignments.",
          "Zero-media-query responsiveness: `repeat(auto-fit, minmax(...))` creates fluid, responsive grids on any screen size.",
          "Eliminates DOM bloat: removes unnecessary wrapper `div` elements required by legacy column systems.",
          "Visual layout mapping: `grid-template-areas` makes the structural layout of a page readable directly in CSS text."
        ],
        costs: [
          "Steeper learning curve: understanding track lines, implicit vs explicit grids, and sizing functions requires mental shift.",
          "Performance on massive grids: rendering grids with thousands of dynamic items can degrade layout performance compared to virtual lists.",
          "Overkill for 1D widgets: using CSS Grid for simple horizontal navbars or icon alignments adds unnecessary complexity over Flexbox.",
          "Legacy browser limitations: subgrid support required years to achieve universal browser adoption across Safari, Chrome, and Firefox."
        ],
        avoid: [
          "Never use CSS Grid for simple 1-dimensional lists or button alignments; use Flexbox.",
          "Do not use manual media queries for simple card grids; use `repeat(auto-fit, minmax(min, 1fr))`.",
          "Avoid hardcoding explicit pixel row counts if dynamic database content can expand; rely on the implicit grid (`grid-auto-rows`).",
          "Never confuse grid lines with grid tracks; `grid-column: 1 / 3` spans across 2 tracks, ending at line 3."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
