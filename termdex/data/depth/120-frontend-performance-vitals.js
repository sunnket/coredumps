/* ==========================================================================
   Depth pass 120 — Web Frontend batch 5: Performance & Core Web Vitals.
   Minification, Source Map, Core Web Vitals, Largest Contentful Paint,
   Cumulative Layout Shift, Reflow, Lighthouse.

   AST token mangling, Base64 VLQ source mapping, Chrome user experience report (CrUX)
   p75 telemetry, and Blink layout engine reflow queues quantify web performance.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "minification",

      why: {
        before: "Frontend source code was shipped to production exactly as written by developers, containing long descriptive variable names, extensive comments, formatting whitespace, and dead code that inflated file sizes by hundreds of kilobytes.",
        problem: "Network bandwidth is finite, and cellular networks introduce heavy latency per transferred byte; code sent to browsers must be stripped of all human-readable redundancy while preserving 100% mathematical and operational equivalence.",
        shift: "**Minification: The process of removing all unnecessary characters from source code without changing its functionality.** Parsing source code into an Abstract Syntax Tree (AST) to shorten variable names (mangling), eliminate whitespace, strip comments, and fold constants, minification dramatically shrinks asset transfer sizes."
      },

      num: {
        t: "Minification Pipeline Transformations & Compression Impact",
        h: ["Minification Stage", "Transformation Mechanism", "AST Manipulation", "Typical Size Reduction", "Primary Tooling"],
        r: [
          ["Whitespace & Comment Stripping", "Removes indentation, tabs, newlines, comments", "Token stream filtering", "$15\\text{--}25\\%$ reduction", "esbuild, Terser, SWC, CSSNano"],
          ["Identifier Mangling", "Renames `userAccountBalance` -> `a`, `calculateTotal` -> `b`", "Scope tree identifier substitution", "$30\\text{--}40\\%$ reduction", "Terser, esbuild, UglifyJS"],
          ["Constant Folding & Propagation", "Replaces `60 * 60 * 24` with `86400`", "Static AST node evaluation", "$2\\text{--}5\\%$ reduction", "LLVM-style AST passes in SWC/esbuild"],
          ["Dead Code Elimination (DCE)", "Removes `if (false)` or unreachable return blocks", "Control Flow Graph (CFG) pruning", "Variable ($5\\text{--}30\\%$)", "Terser, Closure Compiler, esbuild"],
          ["Gzip / Brotli Compression", "Lempel-Ziv dictionary + Huffman coding on wire", "Binary transport layer compression", "$60\\text{--}80\\%$ reduction over minified", "Nginx, Cloudflare, Caddy"]
        ],
        n: "Minification is a compiler optimization performed over an **Abstract Syntax Tree (AST)**. Unlike simple regex text replacements (which would corrupt string literals), an AST minifier (like Terser, SWC, or esbuild) understands variable scope hierarchies. During **Identifier Mangling**, the minifier builds a symbol table for every lexical scope: top-level global variables are preserved if exported, but local variables and function parameters are safely renamed to single-letter identifiers (`a`, `b`, `c`), reusing names across disjoint sibling scopes. Minification works synergistically with transport-layer compression (**Brotli** and **Gzip**): minifying repetitive variable names makes the subsequent Huffman coding dictionary significantly smaller and faster to decompress."
      },

      miss: [
        {
          w: "Gzip and Brotli compression make minification obsolete.",
          r: "Minification and compression are **complementary, not mutually exclusive**. Gzip compresses text, but cannot shorten variable names or delete dead code. In production benchmarks, **minifying code before compressing it reduces final payload size by an additional 20-30%** compared to compressing unminified code, and drastically accelerates JavaScript parsing time on client CPUs."
        },
        {
          w: "Minification can be done safely with simple regular expressions.",
          r: "Using regex to minify code is extremely dangerous: regex cannot differentiate between a variable named `let total` and a text string `'total'` inside a template literal, easily breaking runtime code. Minification MUST be performed by an **AST-aware parser**."
        },
        {
          w: "Minification protects your intellectual property from reverse engineering.",
          r: "Minification is an **optimization tool, NOT an obfuscator or security sandbox**. Beautifiers and modern browser devtools de-minify and format code in a single click, and decompilers can reconstruct logic. Proprietary secrets must NEVER be shipped in client-side code."
        },
        {
          w: "Minification only applies to JavaScript files.",
          r: "Minification applies equally to **CSS (CSSNano)** (merging duplicate rules, stripping units on zero values), **HTML (HTMLMinifier)**, **SVG graphics (SVGO)**, and **JSON** payloads."
        }
      ],

      trade: {
        buys: [
          "Significant bandwidth reduction: slashes network transfer size by $60\\text{--}80\\%$ when paired with Brotli/Gzip.",
          "Faster JavaScript parsing: smaller files allow browser JavaScript engines (V8) to tokenize and compile scripts faster.",
          "Lower CDN egress costs: directly reduces monthly cloud bandwidth costs for high-traffic applications.",
          "Mobile-friendly delivery: accelerates Time to Interactive (TTI) on slow 3G/4G cellular networks."
        ],
        costs: [
          "Unreadable production stack traces: error traces output mangled line numbers (`at a.b (app.min.js:1:421)`).",
          "Source Map dependency: requires generating, storing, and securing Source Maps to debug production crashes.",
          "Build time overhead: AST parsing and identifier mangling consumes CPU cycles in CI/CD build pipelines.",
          "Fragile runtime reflection: code that depends on `function.name` or reflection breaks when identifiers are mangled."
        ],
        avoid: [
          "Never write code that relies on `Function.name` or `Class.name` for business logic, as minification mangles them.",
          "Do not skip minification for internal intranet applications; network transfer and parse times still matter.",
          "Avoid shipping un-minified third-party libraries; verify that all production dependencies are bundled and minified.",
          "Never deploy minified code to production without generating Source Maps for error-tracking systems (Sentry)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "source-map",

      why: {
        before: "When minified, bundled, or transpiled code crashed in production, browser error stack traces pointed to incomprehensible line 1 of a massive minified bundle (`bundle.min.js:1:48212`), making debugging impossible.",
        problem: "Developers need a reliable mechanism to reconstruct the original, un-minified TypeScript, JSX, or SASS source code from the executed production bundle during debugging, without sacrificing minification performance.",
        shift: "**Source Map: A standardized JSON file that maps transformed, bundled, and minified code back to its original authored source files.** Governed by the Source Map V3 specification, it decodes Base64 Variable-Length Quantity (VLQ) offsets to restore readable line and column debugging."
      },

      num: {
        t: "Source Map Generation Strategies & Overhead Trade-offs",
        h: ["Devtool Option (Webpack/Vite)", "Generation Speed", "Production Suitability", "Debug Quality", "Primary Engineering Use Case"],
        r: [
          ["`source-map` (External `.map` file)", "Slowest build time", "100% Recommended for production", "Perfect (original source lines & columns)", "Production deployment (uploaded privately to Sentry/Datadog)"],
          ["`hidden-source-map`", "Slow build time", "Recommended for production", "Perfect (omits `//# sourceMappingURL`)", "Production errors tracked without exposing maps to public browser devtools"],
          ["`inline-source-map`", "Slow build time", "STRICTLY FORBIDDEN in production", "Perfect (Base64 data URI inside JS)", "Local unit testing and headless test runners"],
          ["`eval-source-map`", "Fast incremental rebuilds", "Development only", "High (maps generated per module eval)", "Fast local development HMR in Webpack"],
          ["`cheap-module-source-map`", "Fast build time", "Development only", "Medium (line numbers only; omits column accuracy)", "Large codebases prioritizing dev build speed"]
        ],
        n: "A Source Map is a JSON document adhering to the **Source Map V3 specification**. It contains: `version: 3`, `file: 'bundle.js'`, `sources: ['src/App.tsx', 'src/Button.tsx']`, `sourcesContent: [...]`, and a dense string of **`mappings`**. Because mapping millions of source characters naively would create multi-gigabyte files, the `mappings` field uses **Base64 Variable-Length Quantities (VLQ)**. Each comma-separated segment encodes relative numerical deltas: (1) Output generated column, (2) Source file index, (3) Original source line, (4) Original source column, and optional (5) Symbol name index. When an uncaught exception occurs, the browser devtools or crash-reporting agent (Sentry) parses the VLQ deltas to translate `bundle.js:1:9421` back to `src/App.tsx:42:15`."
      },

      miss: [
        {
          w: "Serving source maps to production slows down your website for normal users.",
          r: "Source maps **have zero impact on page load speed for regular users**! The browser does NOT download the `.map` file during normal browsing. The browser only initiates the HTTP request for the `.map` file if and when a user explicitly **opens browser Developer Tools**."
        },
        {
          w: "You should never generate source maps for production because it exposes your proprietary source code.",
          r: "You should ALWAYS generate source maps for production, but use **`hidden-source-map`**. This generates the `.map` files so your build pipeline can upload them privately to error-monitoring tools (Sentry, Datadog), while omitting the public `//# sourceMappingURL` comment from the production JS file so regular users cannot see them."
        },
        {
          w: "Source maps can change the way JavaScript executes in the browser.",
          r: "Source maps are **pure diagnostic metadata**. They are never executed by the JavaScript engine and cannot alter runtime behavior, logic, or performance in any way."
        },
        {
          w: "Inline source maps (`data:application/json;base64,...`) are fine for production.",
          r: "Inline source maps are **catastrophic in production**! Embedding the source map directly inside the production JavaScript file as a Base64 string increases bundle size by **$300\\%\\text{--}500\\%$**, forcing mobile users to download megabytes of debugging text on every page load."
        }
      ],

      trade: {
        buys: [
          "Painless production debugging: maps cryptic minified crashes back to original TypeScript source code and exact line numbers.",
          "Zero regular-user performance cost: external `.map` files are only downloaded when developer tools are actively opened.",
          "Crash reporting telemetry: enables automated error monitoring tools (Sentry) to display legible, actionable stack traces.",
          "Transpilation transparency: allows setting breakpoints in original TypeScript, JSX, or SASS directly in browser devtools."
        ],
        costs: [
          "Increased build time: generating high-precision Base64 VLQ source maps adds substantial time to production CI/CD builds.",
          "Disk and storage overhead: source maps are frequently $2\\text{--}3\\times$ larger in file size than the minified code itself.",
          "Source code exposure risk: deploying public source maps allows competitors to view original, commented source files in devtools.",
          "Complex release artifact management: requires automated CI/CD scripts to upload maps to error platforms and purge them from public servers."
        ],
        avoid: [
          "Never deploy inline source maps (`inline-source-map`) to production, as this inflates bundle sizes astronomically.",
          "Do not publicly expose sensitive internal source maps on public web servers; use `hidden-source-map` and upload to Sentry.",
          "Avoid disabling source maps entirely in production; without them, debugging live production outages is virtually impossible.",
          "Never forget to test that source maps correctly align with the deployed release version during CI/CD deployments."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "core-web-vitals",

      why: {
        before: "Web performance was measured with fragmented, subjective, or synthetic lab metrics (Page Load time, DOMContentLoaded) that failed to reflect the real-world user experience of visual stability, loading speed, and interactivity.",
        problem: "Engineering teams, business stakeholders, and search engines require a standardized, objective set of user-centric metrics that measure the real-world quality of user experience on the web.",
        shift: "**Core Web Vitals (CWV): An initiative by Google to provide unified guidance for quality signals essential to delivering a great user experience on the web.** Comprising Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS), Core Web Vitals directly impact Google search rankings."
      },

      num: {
        t: "Core Web Vitals Thresholds & Measurement Criteria (2024+ Standard)",
        h: ["Metric", "What It Measures", "Good (Pass)", "Needs Improvement", "Poor (Fail)", "Telemetry Source"],
        r: [
          ["Largest Contentful Paint (LCP)", "Perceived Loading Speed: time until largest visible image/text block paints", "$\\le 2.5$ seconds", "$2.5\\text{--}4.0$ seconds", "$> 4.0$ seconds", "PerformanceObserver (`largest-contentful-paint`)"],
          ["Interaction to Next Paint (INP)", "Responsiveness: latency of all user interactions (clicks, keypresses) to next visual paint", "$\\le 200$ milliseconds", "$200\\text{--}500$ ms", "$> 500$ ms", "Replaced FID in March 2024; measures worst interaction latency"],
          ["Cumulative Layout Shift (CLS)", "Visual Stability: unexpected layout shifts during page lifecycle", "$\\le 0.1$", "$0.1\\text{--}0.25$", "$> 0.25$", "Layout Instability API (sum of layout shift scores)"],
          ["First Contentful Paint (FCP) [Supplemental]", "Initial visual feedback: time until first text or image appears", "$\\le 1.8$ seconds", "$1.8\\text{--}3.0$ seconds", "$> 3.0$ seconds", "PerformancePaintTiming API"],
          ["Time to First Byte (TTFB) [Supplemental]", "Server response latency: time until first byte of HTML arrives", "$\\le 800$ milliseconds", "$800\\text{--}1800$ ms", "$> 1800$ ms", "Navigation Timing API"]
        ],
        n: "Core Web Vitals are evaluated against the **75th percentile (p75)** of all user visits over a rolling 28-day window in the **Chrome User Experience Report (CrUX)**: a website passes Core Web Vitals only if at least $75\\%$ of real user experiences meet the 'Good' threshold across all three metrics. In March 2024, Google officially replaced First Input Delay (FID) with **Interaction to Next Paint (INP)**. While FID only measured the delay of the very first click, INP assesses the responsiveness of **every click, tap, and keypress** throughout the entire page lifecycle, recording the worst interaction latency from input event to the physical GPU frame presentation."
      },

      miss: [
        {
          w: "Passing Core Web Vitals in a local Lighthouse test guarantees your production site passes.",
          r: "Lighthouse is a **Lab Tool** running on a fast developer machine with simulated throttling. Google's search algorithm evaluates **Field Data (RUM)** collected from real Chrome users worldwide via CrUX. If real users on budget Android phones on slow 4G experience slow LCP or high INP, your site will **fail Core Web Vitals** regardless of a 100 Lighthouse score."
        },
        {
          w: "First Input Delay (FID) is still the standard interactivity metric for Core Web Vitals.",
          r: "Google **deprecated and removed FID in March 2024**, replacing it with **Interaction to Next Paint (INP)**. FID was too easy to pass because it only measured input delay on the first interaction. INP is significantly more rigorous, measuring the full round-trip to visual paint across all interactions."
        },
        {
          w: "Core Web Vitals only matter for Google SEO rankings.",
          r: "While CWV directly affects Google search ranking, its primary impact is **conversion rates and business revenue**. Studies by Amazon, Walmart, and Google demonstrate that a 100ms improvement in LCP and INP increases e-commerce conversion rates by $1\\%\\text{--}3\\%$ and reduces bounce rates."
        },
        {
          w: "CLS only tracks layout shifts that happen during initial page loading.",
          r: "CLS tracks unexpected layout shifts throughout the **entire lifecycle of the page**, including shifts that occur minutes later when ads dynamically inject, when banners pop up, or when images load as the user scrolls."
        }
      ],

      trade: {
        buys: [
          "SEO ranking boost: passing CWV thresholds directly enhances placement in Google Search and Discover feeds.",
          "Higher conversion rates: faster loading and instantaneous responsiveness directly increase user engagement and sales.",
          "Objective engineering benchmarks: provides clear, quantitative performance KPIs for engineering and product teams.",
          "Real-world user focus: aligns optimization efforts with actual human perception of speed, stability, and smoothness."
        ],
        costs: [
          "Engineering optimization effort: optimizing LCP and INP requires deep architectural work (SSR, streaming, script audits).",
          "Third-party tag restrictions: marketing tags, analytics scripts, and chat widgets are the primary cause of poor INP and LCP.",
          "Design constraints: enforcing CLS requires reserving fixed dimensions for ads, banners, and dynamic content.",
          "Field telemetry monitoring overhead: requires deploying Real User Monitoring (RUM) libraries to capture field data."
        ],
        avoid: [
          "Never rely exclusively on Lighthouse lab audits; deploy real-user telemetry (`web-vitals` npm library) to monitor CrUX field metrics.",
          "Do not allow third-party marketing tags to run on the main thread without profiling their impact on Interaction to Next Paint (INP).",
          "Avoid injecting dynamic banners or notification bars above existing content without reserving space to prevent CLS.",
          "Never lazy-load the Largest Contentful Paint (LCP) hero image; prioritize it with `<link rel='preload'>`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "largest-contentful-paint",

      why: {
        before: "Early performance metrics (like `load` event or First Contentful Paint) measured trivial technical events (like a tiny logo or background color painting), giving a 'fast' score even while the main article text or hero image remained completely invisible for seconds.",
        problem: "Engineers need a metric that accurately captures when the primary, meaningful content of a page has visually rendered on screen from the perspective of a real human user.",
        shift: "**Largest Contentful Paint (LCP): A Core Web Vitals metric that measures the render time of the largest image or text block visible within the viewport, relative to when the page first started loading.** With a target threshold of $\\le 2.5$ seconds, LCP is the definitive benchmark of perceived loading speed."
      },

      num: {
        t: "LCP Optimization Breakdown: The Four Sub-Parts of LCP",
        h: ["LCP Sub-Part", "What It Represents", "Target Budget (% of 2.5s)", "Primary Latency Culprit", "Targeted Engineering Fix"],
        r: [
          ["Time to First Byte (TTFB)", "Time until browser receives first byte of HTML", "$\\approx 40\\%$ ($< 800$ ms)", "Slow backend database queries, un-cached SSR servers", "Edge CDN caching, database indexing, streaming SSR"],
          ["Resource Load Delay", "Time between HTML arrival and browser discovering LCP asset", "$\\approx 10\\%$ ($< 250$ ms)", "Hiding hero image in CSS `background-image` or deep JS", "Preload hero image: `<link rel='preload' as='image'>`"],
          ["Resource Load Duration", "Time taken to physically download the LCP image/font file", "$\\approx 40\\%$ ($< 1000$ ms)", "Uncompressed massive 5MB PNG/JPEG hero images", "Next-gen formats (AVIF/WebP), responsive `srcset`, image CDN"],
          ["Element Render Delay", "Time between asset download complete and element painted on screen", "$\\approx 10\\%$ ($< 250$ ms)", "Main thread blocked by heavy client JS execution", "Code splitting, defer non-critical JS, reduce hydration cost"]
        ],
        n: "The Largest Contentful Paint candidate is dynamically tracked by the browser's **PerformanceObserver** API (`type: 'largest-contentful-paint'`). The engine tracks the largest visual node in the viewport across eligible elements: `<img>`, `<image>` inside SVG, `<video>` poster images, or block-level elements containing text nodes. As new elements render, the browser emits an LCP candidate; tracking permanently stops the instant the user taps, clicks, or presses a key. Mathematically, $\\text{LCP} = \\text{TTFB} + \\text{ResourceLoadDelay} + \\text{ResourceLoadDuration} + \\text{ElementRenderDelay}$. A fast LCP requires that the LCP resource is discovered immediately in the initial HTML markup, NOT delayed behind client-side JavaScript fetching."
      },

      miss: [
        {
          w: "The LCP element is always an image.",
          r: "The LCP element is frequently a **large heading or block of text** (`<h1>`, `<p>`). If a page does not have a large hero image above the fold, the largest paragraph or headline will be selected as the LCP candidate."
        },
        {
          w: "Setting a hero image as a CSS `background-image: url(...)` is best practice.",
          r: "Using CSS `background-image` for your LCP element is a **severe performance anti-pattern**! The browser's high-speed Preload Scanner cannot see images inside CSS files. The image download is delayed until the CSS is completely parsed and the DOM is styled, adding hundreds of milliseconds of Resource Load Delay. Always use an HTML `<img>` tag or `<link rel='preload'>`."
        },
        {
          w: "Adding `loading='lazy'` to your hero image improves LCP.",
          r: "`loading='lazy'` on an LCP hero image **destroys your LCP score**! The browser intentionally delays fetching lazy images until after layout calculation completes, adding up to $1\\text{--}2$ seconds of unnecessary delay. Hero images should ALWAYS be loaded eagerly with high fetch priority: `<img fetchpriority='high'>`."
        },
        {
          w: "LCP stops tracking once the browser fires the `window.onload` event.",
          r: "LCP has nothing to do with the `load` event. The browser continues monitoring and updating the largest painted element until the **user performs their first interaction** (click, keypress, scroll)."
        }
      ],

      trade: {
        buys: [
          "Accurately reflects perceived load speed: tracks what human users actually care about (the primary visual content).",
          "Direct SEO impact: constitutes 1 of the 3 official Google Core Web Vitals ranking signals.",
          "Pinpoints network and render bottlenecks: LCP sub-part analysis exposes whether the bottleneck is server TTFB or asset sizing.",
          "Higher conversion rates: shaving 1 second off LCP measurably reduces bounce rates on marketing landing pages."
        ],
        costs: [
          "Format migration overhead: requires automated build pipelines to convert legacy JPEGs/PNGs to modern AVIF/WebP formats.",
          "Responsive asset complexity: mandates authoring complex responsive `<picture>` tags with multiple `srcset` resolutions.",
          "Preload budget constraints: preloading too many assets starves the network; developers must carefully prioritize only the true LCP element.",
          "Design constraints: requires designers and developers to coordinate on which element will serve as the above-the-fold hero."
        ],
        avoid: [
          "Never add `loading='lazy'` to the above-the-fold hero image; use `fetchpriority='high'` instead.",
          "Do not hide your LCP hero image inside an external CSS `background-image` rule; use a native HTML `<img>` tag.",
          "Avoid serving uncompressed, un-resized raw camera images (3000px wide) to mobile viewports; use responsive image CDNs.",
          "Never block the main thread with heavy synchronous JavaScript before the LCP element can be painted."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cumulative-layout-shift",

      why: {
        before: "Web pages loaded with sudden, unexpected layout jumps: images popped in without dimensions, web fonts swapped abruptly, and third-party ads pushed content down right as the user was about to tap a link, causing accidental clicks on the wrong buttons.",
        problem: "Users need visual stability; software interfaces must guarantee that page elements remain physically stable during and after loading, preventing accidental clicks, user frustration, and cognitive disorientation.",
        shift: "**Cumulative Layout Shift (CLS): A Core Web Vitals metric that measures the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifecycle of a page.** Targeting a score of $\\le 0.1$, CLS enforces visual stability."
      },

      num: {
        t: "Layout Shift Scoring Mathematics & Mitigation Strategies",
        h: ["Root Cause of Shift", "Failure Mechanism", "Math Impact ($D \\times V$)", "Targeted Technical Solution", "CSS / HTML Implementation"],
        r: [
          ["Images without Dimensions", "Image loads; pushes subsequent text down", "High Impact Fraction ($D$) on tall cards", "Declare explicit aspect ratio or width/height", `<img width='800' height='450' style='aspect-ratio: 16/9;'>`],
          ["Dynamic Ad Injection", "Ad script injects banner into empty space", "Entire page shifts down by $250\\text{ px}$", "Reserve static placeholder space upfront", "`min-height: 250px;` on ad container container"],
          ["Web Font FOIT / FOUT", "Fallback font swaps for web font with different metrics", "Text reflows onto multiple new lines", "Match fallback font metrics or preload font", "CSS `@font-face { size-adjust: 92%; }` or `font-display: optional`"],
          ["Dynamic Top Notification", "Cookie banner or promo bar inserts at top", "Shifts entire document downward", "Overlay with `position: fixed` or bottom toast", "`position: fixed; bottom: 0;` (bypasses layout flow)"],
          ["Dynamic Content Injection", "Async API response inserts item above view", "Displaces active reading content", "Append to bottom or wait for user interaction", "Insert content below viewport or use user trigger"]
        ],
        n: "Cumulative Layout Shift is calculated by the browser's **Layout Instability API**. For every unexpected layout shift where an unstable element changes its start position, the browser computes: $\\text{LayoutShiftScore} = \\text{ImpactFraction} \\times \\text{DistanceFraction}$. The **Impact Fraction** ($D$) is the union of the visible areas of the element before and after the shift relative to the viewport. The **Distance Fraction** ($V$) is the maximum vertical or horizontal distance moved divided by the viewport height/width. To calculate CLS, the browser groups shifts into **Session Windows** (bursts of shifts with $<1\\text{ second}$ gap, max $5\\text{ seconds}$ total), recording the score of the worst window. Shifts occurring within $500\\text{ ms}$ of a user input (click, tap) are classified as **expected shifts** and are completely excluded from the CLS score."
      },

      miss: [
        {
          w: "Layout shifts caused by a user clicking a dropdown or accordion hurt your CLS score.",
          r: "Any layout shift that occurs within **500 milliseconds of user input** (click, keypress, tap) has the `hadRecentInput` flag set to true and is **completely excluded from CLS**! CLS only penalizes **unexpected shifts** that happen without direct user interaction."
        },
        {
          w: "CLS only tracks layout shifts that happen during page load.",
          r: "CLS tracks layout shifts throughout the **entire lifespan of the page**! If a user leaves a tab open for three hours, and an automated ad refresh or background WebSocket update causes a layout shift, it directly inflates your production CLS score."
        },
        {
          w: "Responsive images don't need `width` and `height` attributes because CSS handles responsiveness.",
          r: "Modern browsers use HTML `width` and `height` attributes to **automatically calculate the aspect ratio** before the image downloads (`aspect-ratio: attr(width) / attr(height)`). Omitting them forces the browser to treat the unloaded image as $0\\text{px}$ tall, causing a massive layout shift when it loads."
        },
        {
          w: "Transform animations (`transform: translateY()`) cause layout shifts.",
          r: "CSS **`transform` and `opacity` do NOT cause layout shifts**! They operate on composite layers in the GPU without altering document geometry flow. You can animate elements anywhere on screen using `transform: translate()` with a CLS score of strictly **zero**."
        }
      ],

      trade: {
        buys: [
          "Prevents accidental clicks: ensures users don't accidentally click 'Confirm Purchase' when a banner pops in.",
          "Visual reading stability: text stays physically fixed under the user's eyes while assets load in the background.",
          "SEO ranking protection: satisfies 1 of Google's 3 official Core Web Vitals ranking signals ($\le 0.1$).",
          "Polished user experience: eliminates the cheap, janky feel of shifting advertisements and un-dimensioned images."
        ],
        costs: [
          "Placeholder reservation requirements: requires reserving empty space (skeleton loaders) for dynamic ads and content.",
          "Font matching overhead: requires tuning font fallback metrics (`size-adjust`, `ascent-override`) to eliminate FOUT shifts.",
          "Design constraints: discourages inserting dynamic notification bars at the top of pages post-load.",
          "Testing complexity: requires monitoring long-running user sessions in Real User Monitoring (RUM) to detect delayed shifts."
        ],
        avoid: [
          "Never render an `<img>` tag without explicit `width` and `height` attributes or CSS `aspect-ratio`.",
          "Do not insert dynamic content (banners, newsletter prompts) above existing content without reserving fixed space.",
          "Avoid web font layout shifts; use `font-display: optional` or match fallback metrics using `size-adjust`.",
          "Never animate layout properties like `top`, `left`, `height`, or `width`; animate `transform` to avoid triggering layout shifts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reflow",

      why: {
        before: "Developers freely interleaved reading and writing DOM styles inside JavaScript loops (`elem.style.width = elem.offsetWidth + 10 + 'px'`), causing browser engines to freeze completely as they repeatedly recalculated entire page geometry on every loop iteration.",
        problem: "Browser rendering engines need a disciplined execution model for calculating the physical geometric coordinates (positions and dimensions) of every node in the render tree without stalling the main thread.",
        shift: "**Reflow (Layout): The browser rendering process of calculating the positions and geometries of all the elements in the Render Tree for the purpose of visually drawing the page.** Often paired with Repaint (rasterizing pixels), preventing Forced Synchronous Layout (Layout Thrashing) is the bedrock of 60 FPS frontend performance."
      },

      num: {
        t: "Browser Rendering Pipeline Stages: Triggers & Costs",
        h: ["Pipeline Stage", "What It Computes", "Triggered Properties", "Computational Cost", "GPU Thread Offloadable"],
        r: [
          ["1. JavaScript / Style Recalc", "Evaluates JS, parses CSS, matches selectors to DOM", "DOM mutation, class changes, inline styles", "Moderate (proportional to DOM depth and selector complexity)", "No (Main Thread execution)"],
          ["2. Reflow (Layout)", "Calculates physical geometry: width, height, x, y coordinates", "`width`, `height`, `margin`, `padding`, `top`, `display`", "Highest (hierarchical box-tree calculation; reflows children/parents)", "No (CPU Main Thread)"],
          ["3. Repaint (Paint)", "Fills in pixels: colors, backgrounds, borders, shadows", "`color`, `background-color`, `visibility`, `box-shadow`", "Moderate to high (rasterization of pixel drawing commands)", "Partially (software raster or Skia/GPU paint)"],
          ["4. Composite", "Layers drew independently; GPU aligns and composites layers", "`transform` (translate/scale/rotate), `opacity`, `filter`", "Lowest (hardware-accelerated GPU matrix multiplication)", "Yes (Runs entirely on independent GPU Compositor Thread)"]
        ],
        n: "Reflow is the most computationally expensive stage of the browser rendering pipeline. In Chromium's Blink engine, elements generate a **LayoutObject Tree**. Computing the layout of a single element frequently forces the engine to recalculate the geometry of its children, its siblings, and its ancestors up to the document root. Under normal conditions, browsers **batch reflows** asynchronously, executing layout once at the end of the current microtask frame. However, if JavaScript writes a style (`element.style.width = '100px'`) and immediately reads a geometric property (**`element.offsetHeight`**, **`clientWidth`**, **`getBoundingClientRect()`**), the browser is forced to immediately flush the pending style queue and synchronously recompute layout. This is **Forced Synchronous Layout**: repeating it in a loop of $100$ items executes $100$ full-page reflows in a single frame, causing catastrophic frame rate drops (**Layout Thrashing**)."
      },

      miss: [
        {
          w: "Reflow and Repaint are the exact same thing.",
          r: "**Reflow** computes **geometry** (positions, widths, heights). **Repaint** draws **pixels** (colors, backgrounds, shadows). A reflow *always* triggers a subsequent repaint (because changing an element's size requires redrawing its pixels), but a repaint does *not* trigger a reflow (changing `background-color` does not alter geometry)."
        },
        {
          w: "Reading DOM properties never causes performance issues because reading is read-only.",
          r: "Reading geometric properties (`offsetHeight`, `offsetTop`, `scrollTop`, `getComputedStyle()`) **immediately triggers a synchronous reflow** if there are any un-flushed DOM style writes pending in the queue! Reading geometry is one of the most common causes of frozen UI jank."
        },
        {
          w: "All CSS property changes cause reflow.",
          r: "Only geometry-affecting properties trigger reflow (`width`, `height`, `margin`, `font-size`, `display`). Modifying **`transform`** or **`opacity`** bypasses Reflow AND Repaint completely, executing directly on the GPU Compositor thread at 60/120 FPS."
        },
        {
          w: "Hiding an element with `visibility: hidden` triggers a reflow.",
          r: "`visibility: hidden` triggers a **repaint, NOT a reflow**. The element still occupies its exact physical width and height in the layout; only its pixel drawing is hidden. In contrast, `display: none` removes the element from layout geometry, triggering a full reflow."
        }
      ],

      trade: {
        buys: [
          "Pixel-perfect geometry: accurately computes complex fluid, responsive layouts across nested elements.",
          "Dynamic adaptability: recalculates dimensions automatically when window resizes or device rotates.",
          "Natural document flow: elements automatically push sibling and parent containers as text or content expands.",
          "Batched rendering efficiency: modern browsers batch multiple DOM updates into a single layout pass when uninterrupted."
        ],
        costs: [
          "Heavy CPU computational cost: hierarchical layout calculations lock up the main execution thread.",
          "Layout thrashing vulnerability: interleaving DOM writes and geometry reads causes severe frame drops (jank).",
          "Cascading tree invalidation: modifying geometry in a top-level parent can force a reflow of the entire document body.",
          "Battery consumption: excessive reflows and repaints rapidly drain mobile device battery life."
        ],
        avoid: [
          "Never read layout properties (`offsetHeight`, `getBoundingClientRect`) immediately after writing styles in a loop.",
          "Do not animate geometry properties (`left`, `top`, `width`, `height`); animate `transform` and `opacity` instead.",
          "Avoid modifying the live DOM tree repeatedly; batch mutations using a `DocumentFragment` or `requestAnimationFrame`.",
          "Never use complex, deep descendant CSS selectors (`div > ul > li > a > span`) that increase style recalculation time."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lighthouse",

      why: {
        before: "Developers optimized web pages based on subjective hunches, isolated manual checklists, or raw stopwatch timers, with no automated, reproducible tool to audit performance, accessibility, SEO, and best practices comprehensively.",
        problem: "Engineering and marketing teams need an automated, standardized, open-source auditing tool that diagnoses web page quality, generates actionable improvement recommendations, and simulates mobile network constraints.",
        shift: "**Lighthouse: An open-source, automated tool developed by Google for improving the quality of web pages, providing audits for Performance, Accessibility, Progressive Web Apps, SEO, and Best Practices.** Running in Chrome DevTools, CLI, or CI/CD pipelines, Lighthouse is the universal standard for web quality auditing."
      },

      num: {
        t: "Lighthouse Performance Score Weighting (Lighthouse v10/v11 Standard)",
        h: ["Audit Metric", "What It Evaluates", "Performance Score Weight", "Target Threshold for 100%", "Underlying User Impact"],
        r: [
          ["Total Blocking Time (TBT)", "Main-thread blocking time between FCP and TTI (tasks $> 50$ ms)", "25%", "$< 200$ milliseconds", "Lab proxy for INP / input responsiveness"],
          ["Largest Contentful Paint (LCP)", "Perceived loading speed of primary visual hero block", "25%", "$< 2.5$ seconds", "Core Web Vital: perceived loading speed"],
          ["Cumulative Layout Shift (CLS)", "Visual layout stability and unexpected jumps", "25%", "$< 0.1$", "Core Web Vital: visual reading stability"],
          ["First Contentful Paint (FCP)", "Time until first text or image is painted", "10%", "$< 1.8$ seconds", "Initial visual feedback that page is loading"],
          ["Speed Index (SI)", "How quickly the visible contents of page are visually populated", "10%", "$< 3.4$ seconds", "Visual progression smoothness captured via frame video"],
          ["Time to Interactive (TTI)", "Deprecated in v10; historical measure of full interactivity", "0% (Removed)", "N/A", "Replaced by heavier weighting on TBT (25%)"]
        ],
        n: "Lighthouse executes audits using a headless instance of Chrome via the Chrome DevTools Protocol (CDP). During the **Performance Audit**, it applies standardized **Throttling Profiles** (simulating a mid-tier mobile device with a $4\\times$ CPU slowdown and slow 4G network: $150\\text{ ms}$ round-trip latency and $1.6\\text{ Mbps}$ throughput). Lighthouse records a detailed trace log, measuring page lifecycle events and computing the weighted **Performance Score ($0\\text{--}100$)** using log-normal distribution curves based on real-world HTTP Archive data. In modern CI/CD pipelines, **Lighthouse CI (LHCI)** runs automated assertions on pull requests, automatically blocking code merges if performance or accessibility scores drop below defined budgets."
      },

      miss: [
        {
          w: "A 100 Lighthouse score guarantees your site passes Google's Core Web Vitals.",
          r: "Lighthouse is **Lab Data** (simulated synthetic tests in a clean environment). Google's search algorithm ranks sites using **Field Data (CrUX)** collected from real users on diverse devices and networks. A site can score 100 on a high-end MacBook in Lighthouse while failing Core Web Vitals in the real world due to real-world mobile network latency, user ad blockers, or heavy background tabs."
        },
        {
          w: "Running Lighthouse in your regular Chrome browser with extensions produces accurate scores.",
          r: "Installed browser extensions (ad blockers, password managers, dark mode extensions) inject their own scripts and styles into every page, **drastically depressing your Lighthouse score**. Lighthouse audits must ALWAYS be run in an **Incognito / Private Window** with all extensions disabled."
        },
        {
          w: "Lighthouse only audits web page speed and performance.",
          r: "Performance is only one of **five distinct audit categories** in Lighthouse: (1) **Performance**, (2) **Accessibility** (automated axe-core checks), (3) **Best Practices** (HTTPS, security vulnerabilities), (4) **SEO** (meta tags, indexability), and (5) **PWA** (manifest, service worker)."
        },
        {
          w: "Lighthouse scores cannot fluctuate if the website code hasn't changed.",
          r: "Lighthouse scores fluctuate naturally due to **CPU thermal throttling**, background OS processes, variable third-party API response times, and network variability. Authoritative benchmarking requires taking the median of multiple runs (e.g., 3-5 runs in Lighthouse CI)."
        }
      ],

      trade: {
        buys: [
          "Comprehensive diagnostic audits: identifies exact performance bottlenecks (unused JS, un-sized images, render-blocking CSS).",
          "Automated CI/CD quality gates: Lighthouse CI prevents performance and accessibility regressions from merging into production.",
          "Standardized executive metrics: provides simple 0-100 scores understood by engineering, product, and leadership teams.",
          "Actionable code suggestions: pinpoints exact image URLs, script lines, and DOM nodes causing performance degradation."
        ],
        costs: [
          "Lab vs Field divergence: developers can over-optimize for synthetic lab scores while ignoring real-user field data (RUM).",
          "Score variability: background CPU load and network fluctuations cause run-to-run score jitter of $\\pm 5\\text{--}10$ points.",
          "Accessibility blind spots: Lighthouse automated accessibility checks only catch $30\\text{--}40\\%$ of actual a11y issues.",
          "Gaming incentives: teams can 'game' Lighthouse by delaying scripts until user interaction, improving lab score while worsening real UX."
        ],
        avoid: [
          "Never run Lighthouse audits in a normal browser window with active extensions; always use Incognito mode.",
          "Do not treat a 100 Lighthouse score as proof of good performance without checking real-user field data (CrUX/RUM).",
          "Avoid 'gaming' Lighthouse by artificially delaying critical scripts; focus on genuine user experience improvements.",
          "Never ignore the Accessibility, SEO, and Best Practices categories; performance is only one component of web quality."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
