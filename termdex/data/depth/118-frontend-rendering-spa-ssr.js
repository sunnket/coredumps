/* ==========================================================================
   Depth pass 118 — Web Frontend batch 3: Rendering Architectures & Component Models.
   Focus Management, Single Page Application, Client-Side Rendering,
   Server-Side Rendering, Static Site Generation, Hydration, Virtual DOM.

   ActiveElement DOM tracking, history pushState routing, isomorphic HTML streaming,
   fiber reconciliation trees, and hydration mismatch boundaries power modern web apps.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "focus-management",

      why: {
        before: "Dynamic Single Page Applications (SPAs) updated routes, opened modal dialogs, and deleted list items without moving keyboard focus, stranding blind screen reader users and keyboard navigators in random, disconnected parts of the DOM.",
        problem: "Client-side interactive applications require programmatic control over where the browser's active keyboard focus resides, preventing focus loss, trapping focus within modals, and restoring focus upon dismiss.",
        shift: "**Focus Management: The programmatic control of which DOM element receives keyboard input focus (`document.activeElement`) during user interactions and dynamic view transitions.** Essential for WCAG compliance, it ensures that keyboard and assistive technology users experience a logical, uninterrupted navigation path."
      },

      num: {
        t: "Focus Management Patterns & DOM Invariants",
        h: ["Focus Pattern", "Trigger Interaction", "Target Element Action", "Underlying DOM API / Invariant", "Accessibility Failure Prevented"],
        r: [
          ["Modal Dialog Focus Trap", "Modal opens on screen", "Focus moves to first focusable element inside modal", "Constrains `Tab` within modal bounds; loop on edges", "Prevents keyboard users from tabbing to invisible background page"],
          ["Focus Restoration", "Modal / Drawer closes", "Focus returns to button that initially opened it", "`triggerElement.focus()` stored on open", "Prevents focus from resetting to top `<body>` on close"],
          ["SPA Route Transition", "Client-side URL route changes", "Focus shifts to primary `<h1>` or main container", "`mainHeading.setAttribute('tabindex', '-1'); mainHeading.focus()`", "Informs screen readers that page view has changed"],
          ["List Item Deletion", "Item deleted from interactive list", "Focus moves to adjacent sibling or parent list", "Calculates next sibling; falls back to prev sibling", "Prevents focus dropping into void on node removal"],
          ["Skip Link", "User presses `Tab` on initial page load", "Hidden link appears; jumps directly to `<main>`", "`<a href='#main' class='skip-link'>Skip to Content</a>`", "Saves keyboard users from tabbing through 50 nav links on every page"]
        ],
        n: "Focus management coordinates the browser's **Active Element** pointer (`document.activeElement`). Under WCAG 2.4.3 (Focus Order), focus must proceed in a logical, predictable sequence matching the visual layout. Non-interactive elements (like `<h1>` or `<div>`) cannot receive programmatic focus unless augmented with **`tabindex='-1'`**, which makes the element programmatically focusable via `.focus()` without placing it into the natural `Tab` navigation order. In a **Modal Focus Trap**, the application intercepts the `keydown` event: if `e.key === 'Tab'`, it checks if the current element is the last focusable child; if so, it cancels default browser behavior (`e.preventDefault()`) and focuses the first focusable child, maintaining an unbreakable focus loop until the user presses `Esc`."
      },

      miss: [
        {
          w: "Setting `tabindex='5'` is a great way to ensure an important element is focused first.",
          r: "Using positive `tabindex` values (`tabindex > 0`) is a **severe anti-pattern**. Positive tab indexes disrupt the natural DOM tab order, forcing the browser to jump erratically across the page before following normal source order. Use only `tabindex='0'` (makes element focusable in natural order) or `tabindex='-1'` (programmatic focus only)."
        },
        {
          w: "The browser automatically manages focus when navigating between routes in a React SPA.",
          r: "Browsers only reset focus on **hard MPA page reloads**. In a client-side Single Page Application (React, Vue), navigating to a new route simply swaps DOM nodes: the browser leaves focus wherever it was or resets it to `<body>`, leaving screen reader users with zero indication that navigation occurred. SPAs must explicitly manage route-change focus."
        },
        {
          w: "Removing the visual focus outline (`outline: none`) is acceptable if your site looks cleaner.",
          r: "Removing the focus outline without providing an alternative is one of the most widespread **accessibility violations (WCAG 2.4.7 Focus Visible)**. Without a visible focus indicator, sighted keyboard users cannot see where they are on the page, rendering the site completely unusable."
        },
        {
          w: "Focus traps can be implemented simply by adding CSS `pointer-events: none` to the background.",
          r: "`pointer-events: none` only disables **mouse clicks**. Keyboard users can still press the `Tab` key and navigate through all links, form fields, and buttons in the background behind the modal dialog."
        }
      ],

      trade: {
        buys: [
          "Keyboard navigability: allows motor-impaired and power users to navigate complex web apps without touching a mouse.",
          "Screen reader orientation: announces view changes and modal states unambiguously to assistive tech users.",
          "Seamless modal workflows: focus traps keep user attention isolated within checkout modals and dialog confirmations.",
          "Legal compliance: satisfies core WCAG AA criteria (2.1.1 Keyboard, 2.4.3 Focus Order, 2.4.7 Focus Visible)."
        ],
        costs: [
          "Implementation complexity: managing focus traps, edge loops, and previous trigger references requires dedicated code.",
          "Dynamic list fragility: deleting active elements requires calculating the next focus target before unmounting nodes.",
          "Testing burden: demands end-to-end automated testing with Playwright to verify `document.activeElement` sequences.",
          "Third-party library dependencies: custom focus management is error-prone, usually necessitating libraries like Floating UI or Radix."
        ],
        avoid: [
          "Never remove CSS focus outlines (`:focus { outline: none; }`) without supplying an enhanced custom focus ring (`:focus-visible`).",
          "Do not use positive `tabindex` values (`tabindex='1'`, `tabindex='2'`); rely on natural DOM source order.",
          "Avoid closing a modal dialog without restoring focus to the button or element that opened it.",
          "Never allow focus to be lost when removing an active DOM element; proactively move focus to an adjacent sibling."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "single-page-application",

      why: {
        before: "Every user interaction or link click triggered a full browser reload (Multi-Page Application - MPA), tearing down the DOM, flashing a blank white screen, re-downloading identical CSS/JS bundles, and destroying client-side UI state.",
        problem: "Modern web applications need desktop-like responsiveness: instantaneous route transitions, fluid animations, and persistent client-side state without the jarring latency of full-page browser reloads.",
        shift: "**Single Page Application (SPA): A web application or website that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of the default method of a browser loading entire new pages.** Powered by HTML5 History API routing and client-side JavaScript frameworks, SPAs provide seamless app-like experiences."
      },

      num: {
        t: "SPA vs MPA (Multi-Page Application) Architectural Comparison",
        h: ["Architectural Dimension", "Single Page Application (SPA)", "Multi-Page Application (MPA)", "Core Technical Mechanism", "Operational Trade-off"],
        r: [
          ["Initial Page Load (FCP / LCP)", "Slower (large JS bundle must download & execute)", "Fast (server streams pre-rendered HTML)", "SPA downloads entire application shell upfront", "SPA pays upfront latency penalty for faster subsequent pages"],
          ["Subsequent Route Transitions", "Instantaneous ($10\\text{--}50$ ms, zero full-page reload)", "Slow ($300\\text{--}1000$ ms round-trip server reload)", "HTML5 History API (`pushState`) + client routing", "SPAs provide fluid, app-like page transitions"],
          ["State Persistence", "Preserved across routes (in-memory state, audio playing)", "Destroyed completely on every page navigation", "Client-side state stores (Redux, Zustand, React Context)", "SPAs can maintain background uploads and media playback"],
          ["Search Engine Optimization (SEO)", "Challenging (requires dynamic rendering / pre-rendering)", "Native & effortless (HTML rendered for crawlers)", "Web crawlers must execute client JavaScript", "MPAs historically outperform raw SPAs in search ranking"],
          ["Server Architecture", "Decoupled static hosting (CDN) + Headless API backend", "Coupled server-rendered templates (PHP, Rails, Django)", "REST / GraphQL API boundary", "SPAs decouple frontend hosting from backend microservices"]
        ],
        n: "A Single Page Application operates by intercepting browser navigation. In standard web browsing, clicking an `<a href='/about'>` causes the browser to issue an HTTP GET request and discard the current document. In an SPA, the **Client-Side Router** intercepts the click event via `e.preventDefault()`, invokes **`history.pushState(state, '', '/about')`** to update the browser URL bar without triggering a reload, and instructs the UI framework (React, Vue, Angular) to unmount the old view component and mount the `/about` component. Data fetching occurs asynchronously in the background via JSON APIs (`fetch`), updating only the specific DOM nodes that changed while preserving all ambient in-memory state."
      },

      miss: [
        {
          w: "An SPA consists of literally only one single screen of content.",
          r: "An SPA can contain **thousands of different screens, views, and URLs**. It is called 'single-page' because the browser loads a **single HTML shell** once; all subsequent pages and views are rendered dynamically by JavaScript rewriting the DOM."
        },
        {
          w: "SPAs cannot support browser Back and Forward buttons or bookmarks.",
          r: "SPAs use the **HTML5 History API** (`pushState`, `replaceState`, and the `popstate` event). Clicking Back/Forward triggers `popstate`, allowing the client router to render the previous route while maintaining full URL bookmarkability."
        },
        {
          w: "SPAs are always superior to Multi-Page Applications.",
          r: "SPAs are ideal for interactive, stateful software (Slack, Spotify, Figma). For content-heavy websites (e-commerce, blogs, news portals), traditional MPAs or modern hybrid frameworks (Astro, Next.js) are superior because they offer faster initial loads, lower memory footprints, and superior native SEO."
        },
        {
          w: "Web servers hosting SPAs require no special configuration.",
          r: "SPAs require a **fallback rewrite rule** on the web server (Nginx, Caddy, AWS S3/CloudFront). If a user directly visits `example.com/dashboard/settings`, the server will return a 404 unless configured to rewrite all unknown paths back to `index.html`."
        }
      ],

      trade: {
        buys: [
          "Desktop-like user experience: instantaneous, fluid page transitions with zero white-screen reloads.",
          "Persistent client state: keeps background audio, chat connections, and form drafts alive across navigations.",
          "CDN edge deliverability: static HTML/JS bundles can be distributed globally across edge CDNs at near-zero hosting cost.",
          "Clear API separation: clean decoupled boundary between frontend presentation and backend business logic."
        ],
        costs: [
          "Heavy initial JavaScript bundle: initial page load suffers from high First Contentful Paint (FCP) and Time to Interactive (TTI).",
          "SEO complexity: search engine crawlers may fail to index dynamic client-rendered content without pre-rendering.",
          "Memory leak accumulation: long-running user sessions can accumulate in-memory leaks, degrading browser performance over time.",
          "Server fallback requirement: web servers must be configured to route all deep links back to `index.html`."
        ],
        avoid: [
          "Never deploy an SPA without configuring server-side fallback rewriting (returning `index.html` for all 404s).",
          "Do not ship a monolithic SPA bundle; always implement route-based code splitting (`React.lazy`) to reduce initial load size.",
          "Avoid using pure SPAs for marketing or e-commerce sites where initial load speed and SEO are paramount; use SSR or SSG.",
          "Never forget to manage page title, meta tags, and keyboard focus during client-side route transitions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "client-side-rendering",

      why: {
        before: "Web servers constructed every complete HTML page on the backend and sent full markup over the wire, consuming heavy server CPU cycles and forcing users to wait through network round-trips for every minor view update.",
        problem: "Modern web architectures need to offload view rendering, UI state transitions, and component templating from overloaded backend servers directly to the client's powerful local device CPU.",
        shift: "**Client-Side Rendering (CSR): A rendering technique where a web browser downloads a minimal, empty HTML skeleton and a JavaScript bundle, which then executes on the client device to fetch data and construct the complete DOM dynamically.** The foundational architecture of modern React, Vue, and Angular applications."
      },

      num: {
        t: "Client-Side Rendering (CSR) Loading Pipeline & Bottlenecks",
        h: ["Pipeline Stage", "Browser Activity", "User Visual Experience", "Network Dependency", "Performance Metric Impact"],
        r: [
          ["1. Initial HTML Fetch", "Downloads minimal empty shell (`<div id='root'></div>`)", "Blank white screen", "Fast (tiny $1\\text{--}2$ KB HTML document)", "Instant TTFB (Time to First Byte)"],
          ["2. JavaScript Bundle Fetch", "Downloads heavy application JS bundle (`app.js`)", "Still blank white screen", "Slow (blocking JS download over mobile network)", "Delays First Contentful Paint (FCP)"],
          ["3. JS Parsing & Compilation", "V8 / JavaScriptCore parses, compiles, executes JS", "Still blank white screen (CPU spike)", "Zero network (CPU bound execution)", "Consumes mobile battery and CPU cycles"],
          ["4. Client Data Fetch", "App executes; fires API `fetch('/api/user')` calls", "Renders loading spinners / skeletons", "Second network round-trip for raw JSON data", "Waterfall latency bottleneck"],
          ["5. Final DOM Render", "Framework constructs virtual DOM; paints final UI", "Interactive, meaningful content visible", "Zero network", "Reaches Largest Contentful Paint (LCP) and TTI"]
        ],
        n: "In Client-Side Rendering, the web server acts purely as a static file server: it serves a nearly empty HTML document containing only script tags (`<div id='root'></div><script src='bundle.js'></script>`). The client device performs all computation: the browser downloads the JavaScript bundle, the JavaScript engine parses and compiles it, the framework initializes its component tree, and dynamic `fetch()` requests retrieve raw JSON data from backend APIs. Only after the JSON responses resolve does the framework construct the DOM nodes and paint pixels on screen. This creates the classic **CSR Latency Waterfall**: $\\text{Latency} = \\text{HTML Fetch} + \\text{JS Bundle Download} + \\text{JS Execution} + \\text{API Round-Trip} + \\text{DOM Paint}$."
      },

      miss: [
        {
          w: "Client-Side Rendering is always faster than Server-Side Rendering because browsers are fast.",
          r: "CSR is faster **only for subsequent interactions** after the initial bundle has fully loaded. For the **initial page visit**, CSR is significantly **slower** than SSR on mobile devices with high network latency and constrained mobile CPUs, because it requires multiple round-trips before rendering anything."
        },
        {
          w: "Googlebot cannot index websites that use Client-Side Rendering.",
          r: "Modern Googlebot executes a headless Chromium browser and **can render client-side JavaScript**. However, Googlebot queues JavaScript rendering in a secondary processing tier that can take days or weeks, and other crawlers (Twitter, LinkedIn, Facebook, Bing) often fail to execute complex CSR apps."
        },
        {
          w: "CSR eliminates server costs entirely.",
          r: "While static HTML/JS hosting on CDNs is cheap, the client still makes continuous, chatty JSON API calls back to application servers and databases, shifting compute from template rendering to high-frequency microservice API endpoints."
        },
        {
          w: "Client-Side Rendering is the only way to build rich web apps.",
          r: "Modern hybrid architectures like **Server-Side Rendering (SSR)**, **Static Site Generation (SSG)**, and **React Server Components (RSC)** provide rich interactive web apps while rendering HTML on the server to eliminate CSR loading waterfalls."
        }
      ],

      trade: {
        buys: [
          "Zero server-side rendering compute: backend servers act as stateless JSON APIs, drastically reducing server CPU requirements.",
          "Cheap edge distribution: entire frontend compiles to static files deployable across global CDN edge nodes (Cloudflare, Vercel, S3).",
          "Rich client interactivity: enables high-speed, dynamic state changes, optimistic UI updates, and client animations.",
          "Clean separation of concerns: completely decouples frontend web engineering from backend server stacks."
        ],
        costs: [
          "Poor initial load performance: initial visitors see blank white screens or loading spinners while heavy JS bundles download.",
          "Mobile CPU and battery drain: executes heavy JS parsing and DOM construction on the user's local mobile device.",
          "SEO indexing risks: search engines and social media crawlers struggle with delayed dynamic client rendering.",
          "Network waterfall latency: chaining JS bundle downloads followed by secondary API data requests slows Largest Contentful Paint."
        ],
        avoid: [
          "Never deploy a pure CSR application for public e-commerce or media sites where bounce rates correlate with initial load speed.",
          "Do not ship an un-split, monolithic JavaScript bundle; implement route-based code splitting to minimize initial download size.",
          "Avoid chaining multiple sequential API requests on client mount; combine data fetching into unified backend endpoints.",
          "Never leave initial HTML empty without meaningful skeleton loaders or fallback text for users with slow network connections."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "server-side-rendering",

      why: {
        before: "Client-Side Rendered (CSR) applications forced users to stare at blank white screens and loading spinners while massive JavaScript bundles downloaded and executed, degrading Core Web Vitals and harming search engine rankings.",
        problem: "Modern web applications need the rich interactivity of client-side frameworks alongside the instantaneous initial load speed and universal SEO discoverability of traditional server-rendered HTML.",
        shift: "**Server-Side Rendering (SSR): A rendering technique where a web server executes application components to generate complete HTML markup for a requested URL on-demand, streaming the fully populated HTML document directly to the client browser.** Popularized by Next.js, Remix, and Nuxt, SSR combines instant initial paints with client-side hydration."
      },

      num: {
        t: "SSR vs CSR vs SSG: Lifecycle & Performance Metrics",
        h: ["Metric / Attribute", "Server-Side Rendering (SSR)", "Client-Side Rendering (CSR)", "Static Site Generation (SSG)"],
        r: [
          ["HTML Generation Timing", "On-demand per user request at runtime", "In browser via JavaScript after bundle load", "At build time (ahead-of-time baking)"],
          ["Time to First Byte (TTFB)", "Moderate ($100\\text{--}300$ ms, server compute bound)", "Fast ($20\\text{--}50$ ms from static CDN)", "Fastest ($10\\text{--}30$ ms from edge CDN cache)"],
          ["First Contentful Paint (FCP)", "Fastest (content visible immediately in HTML)", "Slowest (blocked on JS download & execution)", "Fastest (static HTML cached at edge)"],
          ["SEO / Social Sharing", "Perfect (fully populated semantic HTML)", "Challenging (requires crawler JS execution)", "Perfect (static pre-baked HTML)"],
          ["Dynamic User Data", "Native (reads request headers, cookies, auth session)", "Native (fetches user data on client mount)", "Difficult (requires client-side dynamic fetching)"],
          ["Server Compute Cost", "Highest (server CPU renders HTML per request)", "Zero (static CDN hosting)", "Zero runtime compute (static files)"]
        ],
        n: "In Server-Side Rendering, when a user requests a URL, the server (e.g., Node.js running Next.js or Remix) executes the application's component hierarchy, queries required databases or internal microservices, and renders the component tree to a raw HTML string via APIs like **`renderToString()`** or modern **Streaming SSR (`renderToPipeableStream`)**. The browser receives complete, fully populated HTML and immediately paints meaningful text and images (**First Contentful Paint**). Concurrently, the browser downloads a paired client-side JavaScript bundle. Once loaded, the framework attaches event listeners to the existing server-rendered HTML nodes in a process called **Hydration**, transitioning the static document into a fully interactive Single Page Application."
      },

      miss: [
        {
          w: "Server-Side Rendering means you can't use React or client-side interactivity.",
          r: "SSR uses React on **both the server AND the client**! The server renders the initial HTML for fast loading; once loaded in the browser, client-side React **hydrates** the HTML, providing full client-side routing, state management, and rich dynamic interactivity."
        },
        {
          w: "SSR guarantees an instantaneous interactive experience for the user.",
          r: "SSR creates the **Uncanny Valley**: content is visually painted quickly, but the page is **NOT interactive yet** until the heavy client JavaScript bundle finishes downloading and hydratation completes. Users clicking a button during this window will experience frustrating, dead-click delays."
        },
        {
          w: "SSR is always cheaper and simpler to host than Client-Side Rendering.",
          r: "SSR requires running **live Node.js/serverless compute infrastructure** (containers, Lambdas) that scales with traffic, consuming significant CPU, memory, and database connections on every page hit, whereas CSR can be hosted on practically free static object storage (S3/CloudFront)."
        },
        {
          w: "Window and document objects can be accessed anywhere in an SSR codebase.",
          r: "Code executing on the server during SSR runs in a Node.js environment where **`window`, `document`, and `localStorage` do not exist**! Accessing `window` during server render triggers a fatal `ReferenceError: window is not defined`. Client-only code must be wrapped in `useEffect()` or dynamic client-only imports."
        }
      ],

      trade: {
        buys: [
          "Blazing initial paint: users see fully populated content and images immediately upon receiving HTML.",
          "Universal SEO & social preview: search crawlers and social share bots (Facebook, Twitter) read complete metadata and content.",
          "Fast performance on low-end mobile: offloads heavy DOM construction and initial API waterfalls to high-speed server hardware.",
          "Dynamic personalized rendering: generates tailored pages per request using server cookies, auth tokens, and geolocation."
        ],
        costs: [
          "Server infrastructure overhead: requires managing and paying for running Node.js serverless runtimes or Kubernetes clusters.",
          "Hydration latency gap: introduces the 'Uncanny Valley' where content looks clickable before event listeners are hydrated.",
          "Slower Time to First Byte (TTFB): the server must wait for database queries and component rendering before sending the first byte.",
          "Code complexity: developers must maintain isomorphic code that runs safely in both Node.js and browser runtime environments."
        ],
        avoid: [
          "Never access browser-only globals (`window`, `document`, `navigator`) during top-level component execution; use `useEffect`.",
          "Do not perform slow, un-cached external API queries inside blocking SSR page requests; use streaming or edge caching.",
          "Avoid rendering non-deterministic content (timestamps, random numbers) on the server that will mismatch client hydration.",
          "Never use SSR for purely private, authenticated dashboard tools where SEO is irrelevant and CSR provides cheaper hosting."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "static-site-generation",

      why: {
        before: "Serving dynamic content required running expensive application servers that executed database queries and template rendering on every single HTTP request, slowing response times and collapsing under sudden traffic spikes.",
        problem: "Content-driven websites (blogs, documentation, marketing portals, e-commerce product catalogs) need the blazing speed, zero server costs, and infinite scalability of static HTML files, while retaining modern component-based developer workflows.",
        shift: "**Static Site Generation (SSG): A web development method where HTML pages are pre-rendered at build time ahead of user requests, producing static assets that can be served directly from global Content Delivery Networks (CDNs).** Pioneered by Gatsby, Jekyll, Hugo, and Next.js, SSG maximizes web performance and security."
      },

      num: {
        t: "SSG vs SSR vs ISR (Incremental Static Regeneration)",
        h: ["Generation Strategy", "Generation Timing", "Cache Location", "Hosting Cost", "Best Production Fit"],
        r: [
          ["Static Site Generation (SSG)", "Build Time (CI/CD pipeline compilation)", "Global Edge CDN (Cloudflare, CloudFront)", "Near Zero (static file storage)", "Documentation, corporate landing pages, blogs"],
          ["Incremental Static Regeneration (ISR)", "Hybrid: Build Time + Background on-demand revalidation", "Global Edge CDN with background stale-while-revalidate", "Low (occasional serverless regeneration)", "Large e-commerce catalogs ($100{,}000+$ product pages)"],
          ["Server-Side Rendering (SSR)", "Runtime (per incoming user HTTP request)", "Dynamic server compute (optional cache)", "High (active server CPU instances)", "Personalized user dashboards, live auction feeds"],
          ["Edge SSR", "Runtime at edge nodes (V8 isolates)", "Edge worker memory cache", "Moderate", "Geo-personalized content with minimal TTFB"]
        ],
        n: "In Static Site Generation, the build pipeline (e.g., Next.js `getStaticProps`, Astro, Hugo) connects to headless CMS platforms, local markdown files, or databases, executes all component templating, and exports a directory of static `.html`, `.css`, and `.js` files. When deployed, these static files are cached globally across hundreds of **Edge CDN Points of Presence (PoPs)**. When a user requests a URL, the CDN serves the pre-baked HTML file from the closest geographic edge server in under $20\\text{ ms}$, with zero database queries or server compute. To solve the problem of long build times on massive websites, modern frameworks employ **Incremental Static Regeneration (ISR)**: pages are pre-rendered on-demand in the background when requested after a revalidation timeout (`revalidate: 60`), serving stale cached content instantly while updating the cache asynchronously."
      },

      miss: [
        {
          w: "Static Site Generation produces completely static websites with no JavaScript or dynamic functionality.",
          r: "SSG pre-renders the **initial HTML at build time**, but that HTML can include dynamic client-side JavaScript. Once loaded in the browser, the client-side JavaScript executes, hydrating the page, attaching event listeners, and fetching live dynamic client data (e.g., checking user login status, loading shopping cart totals)."
        },
        {
          w: "SSG is impossible for websites with 100,000 pages because builds take hours.",
          r: "Modern architectures use **Incremental Static Regeneration (ISR)** or on-demand rendering (Astro, Next.js). Only the top 1,000 most popular pages are baked during CI/CD build; the remaining 99,000 pages are generated statically on their first request and permanently cached at the edge."
        },
        {
          w: "SSG cannot be used if content changes frequently.",
          r: "With **On-Demand ISR and CMS Webhooks**, updating a product in a headless CMS triggers an automated webhook that revalidates and regenerates only that single specific HTML page at the CDN edge in sub-seconds, without rebuilding the entire website."
        },
        {
          w: "SSG websites are vulnerable to SQL injection attacks.",
          r: "SSG websites have **zero active database connections or backend servers running on request**. The client receives static files from a CDN, eliminating SQL injection, server memory corruption, and server-side remote code execution attack vectors entirely."
        }
      ],

      trade: {
        buys: [
          "Blazing TTFB performance: serves static pre-rendered HTML files from global edge CDNs in single-digit milliseconds.",
          "Near-infinite traffic scalability: effortlessly handles massive viral traffic spikes (Black Friday) without server crashes.",
          "Bulletproof security: eliminates backend server vulnerabilities (SQL injection, SSRF, server memory exploits).",
          "Minimal hosting costs: static files can be hosted for pennies on object storage and CDNs."
        ],
        costs: [
          "Build-time scaling bottlenecks: large websites with millions of pages can suffer from multi-hour CI/CD build times.",
          "Stale content delay: content updates require re-baking pages or configuring complex ISR webhook invalidations.",
          "Unsuitable for private dynamic data: cannot pre-render pages that depend strictly on the user's private cookies or session auth.",
          "CMS integration complexity: requires setting up automated webhooks and cache invalidation pipelines with headless CMSs."
        ],
        avoid: [
          "Never use SSG for user-specific authenticated account dashboards where content varies per individual user.",
          "Do not trigger a complete multi-hour site rebuild for a single typo fix; implement Incremental Static Regeneration (ISR).",
          "Avoid client-side waterfall fetching for critical data on SSG pages; pre-render all essential data at build time.",
          "Never forget to set proper Cache-Control headers on CDN edge distributions when deploying static assets."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hydration",

      why: {
        before: "Server-rendered HTML was completely static; making it interactive required either writing duplicate jQuery/vanilla JS scripts to re-bind events, or throwing away the server HTML and re-rendering everything from scratch on the client.",
        problem: "Client-side frameworks need a mechanism to adopt pre-existing server-rendered DOM nodes, attaching event listeners and internal state without destroying or re-creating the DOM.",
        shift: "**Hydration: A client-side process where a JavaScript framework (such as React or Vue) reads the existing server-rendered HTML markup in the DOM, reconstructs its internal virtual representation, and binds event listeners to make the static page interactive.** Transforming static server HTML into a live dynamic application, hydration is the linchpin of isomorphic SSR."
      },

      num: {
        t: "Hydration Paradigms & Evolutionary Architectures",
        h: ["Hydration Paradigm", "Execution Mechanism", "JavaScript Executed on Client", "Initial Interactivity Latency", "Framework Adoption"],
        r: [
          ["Full Eager Hydration", "Traverses entire DOM tree at once on load", "Downloads & executes 100% of app JS bundle", "High (Uncanny Valley: dead clicks until complete)", "React 16/17, Vue 2/3 classic SSR, standard Next.js"],
          ["Selective / Streaming Hydration", "Hydrates interactive chunks priority-first via Suspense", "Streams HTML chunks; hydrates clicked components first", "Fast (prioritizes elements user interacts with)", "React 18+, Next.js App Router (`Suspense`)"],
          ["Islands Architecture", "Hydrates isolated dynamic 'islands'; rest remains static HTML", "Only downloads JS for specific interactive widgets", "Near instantaneous (zero JS for static text/layout)", "Astro, Fresh (Deno), Marko"],
          ["Progressive Hydration", "Hydrates components as they scroll into viewport", "Delays JS execution until IntersectionObserver triggers", "Moderate (minimizes upfront CPU lockup)", "Custom Vue/React lazy hydration setups"],
          ["Resumability (Zero Hydration)", "Serializes framework state into HTML; resumes execution with 0 hydration", "Zero upfront JS execution; fetches handlers on click", "Instantaneous ($< 50$ ms on low-end mobile)", "Qwik framework"]
        ],
        n: "Hydration executes the critical transition from static markup to reactive framework. The server streams pre-rendered HTML to the browser. Once the browser parses this HTML and downloads the application's client JavaScript bundle, the framework initializes. In React, the client executes the root component, generating a **Client Virtual DOM Tree**. The reconciler traverses the existing physical DOM tree in parallel, matching each virtual node to its physical counterpart and attaching event listeners (`onClick`, `onInput`). Crucially, if the server-rendered HTML differs from the client-rendered output (e.g., due to a mismatch in timestamps or user authentication status), the framework triggers a **Hydration Mismatch Error**: the reconciler must discard the mismatched server DOM node and re-render that branch from scratch, causing jarring visual layout shifts."
      },

      miss: [
        {
          w: "Hydration downloads the HTML from the server.",
          r: "Hydration is purely a **client-side JavaScript process**. The HTML is already downloaded and painted on screen. Hydration is the work the JavaScript framework does *after* the HTML is present to attach event listeners and internal framework state."
        },
        {
          w: "Server-side rendering eliminates the need to download large JavaScript bundles.",
          r: "Standard SSR still requires downloading the **exact same large JavaScript bundle** for hydration! In fact, traditional SSR often requires downloading *more* data overall (the full HTML document PLUS the complete JavaScript bundle)."
        },
        {
          w: "A hydration mismatch error is just a minor console warning that can be safely ignored.",
          r: "Hydration mismatches are **serious performance and UI bugs**. When a mismatch occurs, the framework discards the server-rendered DOM nodes and synchronously re-creates them from scratch on the client, destroying the performance benefits of SSR, causing layout shifts, and dropping active inputs."
        },
        {
          w: "The page is fully interactive the instant server-rendered HTML appears on screen.",
          r: "The time between when HTML appears and when hydration finishes is known as the **Uncanny Valley**. The page *looks* interactive, but clicking buttons or opening dropdowns will do absolutely nothing until hydration completes."
        }
      ],

      trade: {
        buys: [
          "Bridges SSR and SPA: delivers instantaneous initial visual paints while retaining full client-side SPA interactivity.",
          "Single unified component model: developers write one component in React/Vue that runs seamlessly on both server and client.",
          "SEO and social sharing: search crawlers read fully populated markup without waiting for client-side JavaScript execution.",
          "Smooth route transitions: once hydrated, subsequent page transitions execute client-side with zero full-page reloads."
        ],
        costs: [
          "Uncanny Valley latency: users experience dead-click delays if they attempt to interact with buttons before hydration completes.",
          "Double execution cost: the entire component tree executes twice—once on the server to generate HTML, and once on the client to hydrate.",
          "Hydration mismatch fragility: any divergence between server and client state triggers expensive client DOM rebuilds.",
          "CPU thrashing on mobile: executing heavy hydration on budget mobile devices locks the main JavaScript thread for seconds."
        ],
        avoid: [
          "Never render non-deterministic dynamic values (like `new Date()` or `Math.random()`) directly in component JSX during SSR.",
          "Do not access browser-only state (`window.innerWidth`, `localStorage`) to conditionally render different markup on server vs client.",
          "Avoid monolithic eager hydration of entire pages; use Suspense, Streaming SSR, or Islands architecture (Astro).",
          "Never ignore hydration mismatch warnings in development; locate the mismatch and resolve the conflicting logic."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "virtual-dom",

      why: {
        before: "Developers wrote manual, imperative DOM manipulation code (jQuery, vanilla JS) that directly mutated real DOM nodes, leading to severe layout thrashing, messy state synchronization bugs, and spaghetti codebases.",
        problem: "UI frameworks need a declarative programming model where developers express how the UI should look for a given state ($UI = f(\\text{state})$), requiring an efficient reconciliation algorithm that computes minimal real DOM updates behind the scenes.",
        shift: "**Virtual DOM (VDOM): A lightweight, in-memory JavaScript object representation of the real Document Object Model.** Popularized by React in 2013, the Virtual DOM separates declarative UI rendering from direct DOM mutation through a two-step process: Diffing and Reconciliation."
      },

      num: {
        t: "Virtual DOM Reconciliation vs Direct DOM Mutation vs Modern Compilers",
        h: ["UI Updating Paradigm", "In-Memory Tree Representation", "Change Detection Mechanism", "DOM Update Strategy", "Framework Example"],
        r: [
          ["Virtual DOM Diffing", "Lightweight JS objects (`{ type, props, children }`)", "Heuristic $\\mathcal{O}(N)$ tree diffing algorithm", "Batched minimal real DOM patch mutations", "React, Vue 2/3, Preact"],
          ["Reactive Signals / Fine-Grained", "Zero Virtual DOM (direct reactive graph)", "Signal dependency tracking (pub/sub graph)", "Directly updates specific text node in real DOM", "Solid.js, Svelte 5, Angular Signals"],
          ["Compile-Time Static Analysis", "Zero Virtual DOM", "Compiler analyzes templates; generates precise update code", "Targeted DOM mutation code emitted at build time", "Svelte 3/4"],
          ["Manual Imperative DOM", "None (direct browser C++ DOM)", "Manual programmer event handling & element selection", "Immediate synchronous real DOM manipulation", "Vanilla JavaScript, jQuery"]
        ],
        n: "The Virtual DOM is an abstract representation of the UI. When component state changes, the framework re-runs the render function, constructing a new Virtual DOM tree of plain JavaScript objects: `{ type: 'button', props: { className: 'active' }, children: ['Submit'] }`. React's **Reconciler (Fiber)** executes a heuristic **Diffing Algorithm** comparing the new tree against the old tree. While general tree comparison is $\\mathcal{O}(N^3)$, React achieves **$\\mathcal{O}(N)$ linear time** by relying on two foundational assumptions: (1) Two elements of different types produce different trees, and (2) Developers can provide a stable **`key` prop** to identify matching children across renders. Once the diffing phase computes the minimal delta, the **Commit phase** batches and applies only those specific property mutations to the real browser DOM in a single pass."
      },

      miss: [
        {
          w: "The Virtual DOM is faster than the real DOM under all circumstances.",
          r: "The Virtual DOM can never be faster than optimal, hand-crafted vanilla JavaScript manipulating the real DOM directly. The Virtual DOM **adds extra work**: creating VDOM objects, allocating memory, and running diffing algorithms. Its true value is **developer productivity, declarative UI modeling, and predictable baseline performance** without manual DOM management."
        },
        {
          w: "The Virtual DOM is a special browser API or hardware feature.",
          r: "The Virtual DOM is **pure user-space JavaScript code**. It is simply a nested JavaScript object tree (`{ tag: 'div', children: [...] }`) stored in regular heap memory with zero browser-level integration."
        },
        {
          w: "React re-renders the entire real DOM on every single state change.",
          r: "React re-runs the **Virtual DOM render functions**, NOT the real DOM! It creates in-memory JavaScript objects and diffs them. Only the tiny specific properties or text nodes that actually changed are mutated in the real browser DOM during the commit phase."
        },
        {
          w: "Using the array index as a `key` (`key={index}`) is perfectly fine in dynamic lists.",
          r: "Using array index as a key is a **catastrophic reconciliation anti-pattern**. If items are reordered, inserted at the beginning, or deleted, the index keys become desynchronized from the data. React will reuse DOM nodes with the wrong state, leading to broken form inputs, incorrect animations, and corrupted data."
        }
      ],

      trade: {
        buys: [
          "Declarative UI programming: developers write $UI = f(\\text{state})$ without worrying about manual imperative DOM manipulation.",
          "Batched DOM updates: batches multiple state changes into a single real DOM commit, preventing layout thrashing.",
          "Cross-platform abstraction: decoupling rendering from the browser DOM enables targeting mobile (React Native), terminal, or canvas.",
          "Predictable performance: guarantees acceptable baseline update performance across complex component hierarchies."
        ],
        costs: [
          "Memory overhead: allocating and garbage collecting millions of ephemeral Virtual DOM objects creates heap memory churn.",
          "Diffing computation cost: traversing and diffing large component subtrees consumes CPU cycles even if nothing changed.",
          "Lagging behind fine-grained signals: modern signal-based reactive frameworks (Solid.js, Svelte) outperform VDOM by eliminating diffing.",
          "Component re-render cascades: un-memoized parent re-renders trigger wasteful VDOM reconstruction across all children."
        ],
        avoid: [
          "Never use array indices as `key` props in dynamic lists where items can be reordered, inserted, or removed; use unique IDs.",
          "Do not perform expensive calculations inside render functions; memoize with `useMemo` to prevent slowing VDOM generation.",
          "Avoid creating inline object or function references inside JSX props in hot loops if children rely on `React.memo`.",
          "Never assume Virtual DOM eliminates the need for component optimization; use React Profiler to identify wasteful re-renders."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
