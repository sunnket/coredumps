/* ==========================================================================
   Depth pass 123 — Web Frontend batch 8: Modern Tooling, Frameworks & Security.
   Tailwind CSS, Dark Mode, SEO, Next.js,
   Vite, Content Security Policy, Web App Manifest, Performance Budget.

   JIT utility compilation, prefers-color-scheme tokens, Next.js App Router RSC streams,
   ESM Vite dev servers, and CSP nonces complete Web Frontend.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "tailwind-css",

      why: {
        before: "Developers spent excessive time inventing arbitrary CSS class names (BEM), fighting cascading specificity wars, maintaining massive growing stylesheets, and context-switching constantly between HTML templates and CSS files.",
        problem: "Modern component-driven web development needs a constraint-based styling system that styles components directly within markup using predictable design tokens, without generating dead CSS or causing global stylesheet bloat.",
        shift: "**Tailwind CSS: A utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center`, and `rotate-90` that can be composed to build any design, directly in your markup.** Utilizing an on-demand Just-In-Time (JIT) compiler, Tailwind outputs only the exact minimal CSS classes actually used in production."
      },

      num: {
        t: "Tailwind CSS Utility-First Architecture vs Traditional BEM / CSS-in-JS",
        h: ["Styling Approach", "Compilation / Generation Timing", "CSS Bundle Growth Profile", "Specificity Management", "Runtime Performance Overhead"],
        r: [
          ["Tailwind CSS (Utility-First)", "Ahead-of-Time JIT compilation (scans source files)", "Flat / Constant ceiling ($\approx 10\\text{--}20$ KB minified/gzip)", "Uniform single-class specificity `(0, 0, 1, 0)`", "Zero runtime overhead (pure static CSS)"],
          ["Traditional BEM / SASS", "Ahead-of-Time SASS/SCSS compilation", "Linear growth with codebase size ($500$ KB+ on large apps)", "High risk of specificity wars and cascades", "Zero runtime overhead (pure static CSS)"],
          ["Runtime CSS-in-JS (Styled Components)", "Runtime JavaScript evaluation in browser", "Grows with component count + runtime engine bloat", "Dynamically generated hashed class names", "High runtime penalty: parses CSS and injects style tags into DOM"],
          ["Zero-Runtime CSS-in-JS (Vanilla Extract)", "Build-time TypeScript compilation to static CSS", "Linear growth with custom classes", "Hashed static class names", "Zero runtime overhead (pure static CSS)"],
          ["CSS Modules", "Build-time scoped class hashing", "Linear growth with written CSS rules", "Scoped module specificity", "Zero runtime overhead"]
        ],
        n: "Tailwind CSS fundamentally reimagines CSS delivery through **Utility-First Composition**. In early versions, utility frameworks generated multi-megabyte CSS files containing every possible combination of colors, paddings, and margins. Modern **Tailwind (v3+)** utilizes an **On-Demand Just-In-Time (JIT) Compiler**: the compiler scans all template files (JSX, TSX, Vue, HTML) using fast Rust/JS tokenizers, identifying raw class strings (e.g., `md:hover:bg-blue-500`, `w-[327px]`). It generates only the exact CSS rules needed on-the-fly, prepending them to the output stylesheet. Because common utility classes (`flex`, `p-4`, `text-sm`) are reused across thousands of components, **the total production CSS bundle size stops growing after the initial design tokens are loaded**, typically plateauing at an astonishingly small **$10\\text{--}15\\text{ KB}$ gzipped** regardless of application scale."
      },

      miss: [
        {
          w: "Tailwind CSS is just inline styles (`style='...'`) with different syntax.",
          r: "Tailwind is fundamentally superior to inline styles: (1) It enforces a **strict, cohesive design system** (standardized spacing scale, color palette, typography), (2) It fully supports **Media Queries (`md:flex`)**, (3) It supports **Pseudo-classes (`hover:`, `focus:`, `active:`)**, and (4) It supports **Pseudo-elements (`before:`, `after:`)**, none of which are possible with inline styles."
        },
        {
          w: "Tailwind makes HTML unreadable and messy.",
          r: "While Tailwind produces longer `class` attributes, it provides **colocation of concerns**: an engineer reading a component can immediately understand its layout, spacing, responsive behavior, and colors without jumping between separate CSS files or hunting down dead BEM classes."
        },
        {
          w: "You cannot use custom pixel values or dynamic values in Tailwind.",
          r: "Tailwind supports **Arbitrary Values** natively via bracket syntax: `w-[327px]`, `top-[17px]`, `bg-[#bada55]`. The JIT compiler parses the bracketed value and generates the exact matching CSS rule automatically at compile time."
        },
        {
          w: "Dynamic class concatenation (`className={`bg-${color}-500`}`) works fine in Tailwind.",
          r: "Dynamic string interpolation **FAILS IN TAILWIND**! Tailwind's JIT compiler scans source files using static regex pattern matching without executing JavaScript. If you write `bg-${color}-500`, the compiler cannot see the full class name `bg-blue-500` and will NOT generate the CSS. Complete class names must always be written out in full (e.g., using a lookup object or `clsx`)."
        }
      ],

      trade: {
        buys: [
          "Tiny, fixed CSS bundle sizes: production stylesheets rarely exceed 15KB gzipped, even on massive enterprise applications.",
          "Zero specificity wars: every utility class has a flat, uniform single-class specificity `(0, 0, 1, 0)`.",
          "High development velocity: style components directly in JSX/HTML without context-switching between separate CSS files.",
          "Built-in responsive and state modifiers: prefix syntax (`md:`, `lg:`, `hover:`, `dark:`) simplifies responsive and interactive states."
        ],
        costs: [
          "Verbose class attributes: HTML templates become cluttered with dozens of utility class strings.",
          "Learning curve: requires memorizing shorthand class name conventions (`py-2`, `items-center`, `tracking-tight`).",
          "Dynamic class restrictions: requires writing complete class names; cannot use dynamic string concatenation.",
          "Build step dependency: strictly requires running the PostCSS/Tailwind compiler in the build toolchain."
        ],
        avoid: [
          "Never construct dynamic class names using string concatenation (e.g., `'text-' + color`); use full explicit class names.",
          "Do not use `@apply` everywhere to recreate traditional BEM classes; this defeats the bundle-saving power of Tailwind.",
          "Avoid arbitrary values (`w-[137px]`) when a standardized design token (`w-36`) already exists in the scale.",
          "Never ship Tailwind in production without purging unused styles through the JIT content scanner."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dark-mode",

      why: {
        before: "Adding dark theme support required duplicate stylesheets, complex CSS class overrides, and jarring white-screen flashes upon page load as client-side JavaScript evaluated stored theme preferences.",
        problem: "Modern web applications need a seamless, flicker-free mechanism to adapt their visual theme to the user's operating system preferences or explicit manual toggles, respecting OLED battery savings and low-light visual comfort.",
        shift: "**Dark Mode: A user interface display setting that uses light-colored text, icons, and graphical elements on dark backgrounds.** Implemented via the `@media (prefers-color-scheme: dark)` media feature and CSS Custom Properties (variables), dark mode provides ergonomic visual comfort and power efficiency."
      },

      num: {
        t: "Dark Mode Implementation Architectures & Flash Prevention",
        h: ["Architecture", "Trigger Mechanism", "Theme Storage", "Flash of Unstyled Theme (FOUT)", "CSS Implementation Strategy"],
        r: [
          ["Pure OS Media Query", "Automatic via system settings (`@media (prefers-color-scheme)`)", "None (system controlled)", "Zero Flash (handled natively by browser engine)", "`@media (prefers-color-scheme: dark) { :root { ... } }`"],
          ["Class-Based with Script Injection", "User manual toggle (overrides system preference)", "`localStorage.theme = 'dark'`", "Prevented via blocking head `<script>` before render", "`html.dark { --bg: #0f172a; }` with Tailwind `darkMode: 'class'`"],
          ["CSS Custom Properties (Tokens)", "Decoupled design tokens mapped to variables", "`data-theme='dark'` attribute on `<html>`", "Prevented via blocking head attribute injection", "`:root { --bg: white; } [data-theme='dark'] { --bg: black; }`"],
          ["Naive Client-Only Toggle (Anti-pattern)", "Toggled in React `useEffect()` after mount", "`localStorage` read inside component", "Severe White Flash (flashes light theme for 500ms before switching)", "Client-side state hydration delay"]
        ],
        n: "Dark mode implementation centers on avoiding the dreaded **Flash of Inaccurate Color Theme (FOIC / FOUT)**. If a user prefers dark mode, but the browser renders the default light theme while waiting for client-side JavaScript to execute, the user suffers an eye-searing white flash. To achieve **Zero-Flicker Dark Mode**, an application must inject a tiny, synchronous, blocking script in the `<head>` of the HTML *before* the body renders: `const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); if (theme === 'dark') document.documentElement.classList.add('dark');`. This ensures the browser's initial style calculation pass applies the dark theme immediately on the very first frame."
      },

      miss: [
        {
          w: "Dark mode is simply inverting all colors (making white black and black white).",
          r: "Pure color inversion is **visually harsh and un-ergonomic**. Pure black backgrounds (`#000000`) paired with pure white text (`#FFFFFF`) create excessive high-contrast visual vibration. Professional dark modes use **deep slate grays (`#0f172a`, `#121212`)** and soft off-white text (`#f8fafc`), adjusting drop shadows to surface elevations using lighter gray layer washes."
        },
        {
          w: "Checking theme in React's `useEffect()` is the best way to load the user's saved theme.",
          r: "Checking theme in `useEffect()` **guarantees a visible white-screen flash**! `useEffect` runs asynchronously *after* the browser has already painted the initial HTML frame. Theme detection must occur **synchronously in the `<head>`** before the DOM paints."
        },
        {
          w: "Dark mode only saves battery life on all computer and phone screens.",
          r: "Dark mode **ONLY saves battery on OLED / AMOLED displays** (where black pixels turn off physical LEDs completely). On traditional LCD screens with a continuous LED backlight, dark mode consumes the exact same amount of battery power because the backlight remains fully illuminated."
        },
        {
          w: "Dark mode images and icons don't need any adjustment.",
          r: "High-contrast bright images can be blinding in dark mode. Best practice uses CSS filters to soften image brightness in dark mode: `@media (prefers-color-scheme: dark) { img { filter: brightness(0.85) contrast(1.1); } }`."
        }
      ],

      trade: {
        buys: [
          "Enhanced visual comfort: reduces eye strain in low-light environments and accommodates light-sensitive users.",
          "OLED battery conservation: significantly reduces mobile battery power consumption on OLED displays.",
          "User agency and personalization: respects user operating system preferences and explicit aesthetic choices.",
          "Modern design expectation: dark mode is considered an essential feature of enterprise and consumer applications."
        ],
        costs: [
          "Double visual design overhead: requires designing, testing, and maintaining two separate color palettes for every component.",
          "Flash of Unstyled Theme (FOUT) fragility: preventing white flashes requires careful inline script injection in HTML `<head>`.",
          "Image and asset complexity: logos, illustrations, and charts must be created in light and dark variants or use SVG `currentColor`.",
          "Accessibility contrast auditing: contrast ratios (4.5:1) must be audited independently across both light and dark themes."
        ],
        avoid: [
          "Never read `localStorage` theme inside React `useEffect` without an inline blocking `<head>` script to prevent white flashes.",
          "Do not use pure `#000000` black for backgrounds; use soft dark grays (`#121212` or `#0f172a`) to prevent high-contrast vibration.",
          "Avoid hardcoding colors; use CSS Custom Properties or semantic Tailwind classes (`bg-white dark:bg-slate-900`).",
          "Never forget to update `<meta name='theme-color'>` dynamically to match the mobile browser address bar to the active theme."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "seo",

      why: {
        before: "Websites built with heavy client-side JavaScript or un-structured HTML were completely invisible to search engine crawlers, receiving zero organic search traffic and failing to generate link previews when shared on social media.",
        problem: "Web applications need to be discovered, crawled, indexed, and accurately ranked by search engines (Googlebot, Bingbot) and social graph scrapers, requiring structured metadata, semantic HTML, and fast loading performance.",
        shift: "**SEO (Search Engine Optimization): The process of improving the quality and quantity of website traffic to a website or web page from search engines.** Spanning Technical SEO (crawlability, Core Web Vitals, SSR), On-Page SEO (metadata, semantic headings), and Structured Data (JSON-LD), SEO bridges web applications with the global web graph."
      },

      num: {
        t: "Search Engine Optimization (SEO) Technical Hierarchy",
        h: ["SEO Domain", "Core Technical Requirement", "Implementation Mechanism", "Crawler Interpretation", "Failure Consequence"],
        r: [
          ["Technical SEO (Crawlability)", "Allow crawlers to discover and access URLs", "`robots.txt` and XML Sitemap (`sitemap.xml`)", "Maps entire site URL topology for Googlebot", "Entire website or section completely ignored by search engines"],
          ["Rendering Architecture", "Deliver populated HTML without requiring heavy client JS", "Server-Side Rendering (SSR) or Static Site Gen (SSG)", "Crawlers read complete text immediately on first pass", "Client-side JS waterfalls cause crawler timeouts and lost ranking"],
          ["Metadata & Open Graph", "Define page title, description, and social share cards", "`<title>`, `<meta name='description'>`, Open Graph tags (`og:image`)", "Generates search snippet titles and Twitter/LinkedIn cards", "Ugly generic search snippets with poor click-through rates (CTR)"],
          ["Semantic Structure", "Logical document outline with hierarchical headings", "Single `<h1>` per page, sequential `<h2>` - `<h6>`, `<article>`", "Extracts primary conceptual topic and subtopics", "Diluted topical authority in Google's semantic index"],
          ["Structured Data (Schema.org)", "Explicit machine-readable entity semantics", "Embedded JSON-LD (`<script type='application/ld+json'>`)", "Generates Rich Snippets: star ratings, FAQs, product prices", "Misses high-converting visual rich search snippets"]
        ],
        n: "Technical SEO operates through the **Googlebot Crawl-Render-Index Pipeline**. When Googlebot discovers a URL, it retrieves the initial HTTP response. If the site uses Server-Side Rendering (SSR) or Static Site Generation (SSG), Googlebot indexes the complete text and schema metadata immediately. If the site is a pure Client-Side Rendered (CSR) SPA, the URL enters a secondary **Render Queue**: Googlebot must dedicate headless Chromium virtual machine resources to execute the JavaScript, which can delay indexing by days or weeks. Furthermore, search ranking algorithms directly incorporate **Page Experience Signals**: mobile-friendliness, HTTPS security, and passing the **Core Web Vitals thresholds (LCP $\le 2.5$s, INP $\le 200$ms, CLS $\le 0.1$)**."
      },

      miss: [
        {
          w: "Stuffing keywords dozens of times into hidden text or meta tags boosts your ranking.",
          r: "**Keyword stuffing** is a legacy 1990s tactic that modern search engines actively penalize. Google uses advanced NLP transformer models (RankBrain, BERT, MUM) that evaluate **topical semantic authority, natural language intent, and user satisfaction**, completely ignoring spammy keyword repetition."
        },
        {
          w: "Googlebot executes all client-side JavaScript immediately just like a real user.",
          r: "While Googlebot *can* render JavaScript, it operates under a strict **Crawl Budget** and processing constraints. Complex client-side JavaScript API waterfalls frequently time out, causing Googlebot to index an empty page with missing content."
        },
        {
          w: "Social meta tags (Open Graph / Twitter Cards) improve your Google search ranking.",
          r: "Open Graph tags (`og:title`, `og:image`) have **zero direct impact on Google search rankings**. They exist exclusively to format rich visual preview cards when links are shared on social platforms (Slack, Twitter, LinkedIn, Facebook)."
        },
        {
          w: "A page can have multiple `<h1>` tags without any SEO consequence.",
          r: "While HTML5 technically allows multiple `<h1>` tags inside different `<section>` tags, standard SEO best practice mandates **exactly one single `<h1>` tag per page** representing the primary topic of that specific document, followed by a logical hierarchy of `<h2>` and `<h3>` tags."
        }
      ],

      trade: {
        buys: [
          "Compounding organic traffic: drives high-intent, free organic traffic from search engines without ongoing ad spend.",
          "High click-through rates (CTR): rich snippets (star ratings, prices, FAQs) stand out visually in search result pages.",
          "Social sharing previews: Open Graph tags ensure links shared on Slack, Twitter, and LinkedIn render beautiful cards.",
          "Clean site architecture: enforces clean semantic markup, fast page speed, and mobile responsiveness."
        ],
        costs: [
          "Rendering architecture constraints: forces the adoption of SSR (Next.js) or SSG rather than simple static client SPAs.",
          "Ongoing content and link building: maintaining search rankings requires high-quality, authoritative content creation.",
          "Strict URL management: migrating URLs requires maintaining complex 301 redirect maps to preserve SEO link equity.",
          "Algorithm volatility: updates to Google's core ranking algorithms can cause sudden shifts in organic traffic."
        ],
        avoid: [
          "Never launch a production website with `Disallow: /` in your `robots.txt` file (a common staging mistake that delists sites).",
          "Do not use generic identical `<title>` tags across multiple pages; every URL must have a unique, descriptive title.",
          "Avoid using pure Client-Side Rendering (CSR) for pages whose primary purpose is acquiring organic search traffic.",
          "Never change URL paths without setting up permanent HTTP 301 redirects from old URLs to new URLs to preserve link equity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "next-js",

      why: {
        before: "Building a production React application required manually assembling a fragile Frankenstein stack: Webpack configuration, Babel transpilation, React Router, custom Node.js Express SSR servers, code-splitting setups, and manual SEO tags.",
        problem: "Enterprise React applications need an opinionated, production-grade full-stack framework that provides hybrid rendering (SSR, SSG, ISR), file-system routing, automated image optimization, and zero-config bundling out of the box.",
        shift: "**Next.js: A flexible React framework created by Vercel that gives you building blocks to create fast, full-stack web applications.** Standardizing modern React with the App Router, React Server Components (RSC), and Turbopack, Next.js is the dominant enterprise React framework."
      },

      num: {
        t: "Next.js Rendering Paradigms: Pages Router vs App Router (RSC)",
        h: ["Feature / Dimension", "Pages Router (Classic / Next.js 12)", "App Router (Modern / Next.js 13+)", "Underlying Architecture", "Primary Production Advantage"],
        r: [
          ["Directory & Routing", "`pages/` directory (`pages/index.tsx`)", "`app/` directory (`app/page.tsx`)", "File-system convention", "Nested layouts (`layout.tsx`) that preserve state across routes"],
          ["Default Component Model", "Client Components (hydrated in browser)", "React Server Components (RSC - Server by default)", "Server Components execute ONLY on server", "Zero JavaScript shipped to client for static server components"],
          ["Data Fetching Paradigm", "`getStaticProps`, `getServerSideProps`", "Native `async/await` in Server Components", "Extended native `fetch()` with caching", "Fetch data directly inside components with zero boilerplate"],
          ["Streaming & Hydration", "Monolithic full-page SSR", "Streaming SSR via React `<Suspense>`", "`renderToPipeableStream`", "Streams HTML chunks instantly; non-blocking page loads"],
          ["Client Interactivity", "Default for all components", "Explicit `'use client'` directive required", "Client boundary demarcation", "Isolates client JavaScript bundle strictly to interactive widgets"]
        ],
        n: "Next.js centers on **Hybrid Rendering Architecture**. In the modern **App Router**, all components inside `app/` are **React Server Components (RSC)** by default: they execute exclusively on the server, can directly query databases (Prisma, SQL) or internal microservices, and render to a serialized JSON-like virtual stream, shipping **zero kilobytes of JavaScript to the client bundle**. When client interactivity (event listeners, hooks like `useState`) is required, developers add the **`'use client'` directive** at the top of the file, establishing an explicit boundary: the parent server component passes serializable props to the client island. Paired with **Edge Middleware** (running on lightweight V8 isolates for authentication and routing) and **Server Actions** (invoking server functions directly from forms without writing REST API endpoints), Next.js unifies the full stack."
      },

      miss: [
        {
          w: "Adding `'use client'` at the top of a file makes that component run only in the browser.",
          r: "`'use client'` does **NOT mean client-only**! It simply declares that the component is a **Client Component boundary**. On the initial page load, Client Components are still **Server-Side Rendered into HTML on the server**, and then hydrated in the browser. It marks the boundary where client JavaScript bundling begins."
        },
        {
          w: "React Server Components (RSC) and Server-Side Rendering (SSR) are the same thing.",
          r: "**SSR** takes a client component tree and renders it to an HTML string for initial page paint. **RSC** is a completely new component type that **never runs on the client and never downloads its code to the browser**. Server Components output a serialized stream that client React merges dynamically without re-mounting client state."
        },
        {
          w: "Next.js can only be hosted on Vercel.",
          r: "Next.js is completely open source and can be self-hosted anywhere: in a Docker container on AWS ECS/Kubernetes, on virtual machines (Ubuntu with Node.js), or exported as a purely static site (`output: 'export'`) deployed to AWS S3, Cloudflare Pages, or Netlify."
        },
        {
          w: "You can pass functions or classes as props from a Server Component to a Client Component.",
          r: "Props passed across the Server-to-Client boundary must be **strictly JSON-serializable**! Functions, classes, and Symbols cannot be passed across the network boundary; only plain objects, arrays, strings, numbers, booleans, and promises are permitted."
        }
      ],

      trade: {
        buys: [
          "Zero client bundle for server components: write complex backend logic, markdown parsers, and DB calls with 0KB client JS.",
          "Hybrid flexibility: mix SSG, SSR, ISR, and Client Components seamlessly within the exact same application.",
          "Built-in web performance optimization: automated image optimization (`next/image`), font optimization (`next/font`), and scripts.",
          "Full-stack unified workflows: write backend Server Actions and API route handlers alongside UI components in one repository."
        ],
        costs: [
          "High architectural complexity: understanding the boundary between Server Components and Client Components requires deep mental shifts.",
          "Vendor gravity: Next.js features (ISR, Middleware, Image Optimization) are heavily optimized for and prioritized on Vercel's platform.",
          "Build and compilation overhead: compiling complex Next.js applications in CI/CD pipelines requires substantial RAM and CPU.",
          "Rapid breaking ecosystem changes: transition from Pages Router to App Router caused significant churn and library incompatibilities."
        ],
        avoid: [
          "Never put `'use client'` at the root layout of your application; push client boundaries as far down the component leaf tree as possible.",
          "Do not import server-only secrets or database clients into files marked with `'use client'`; use the `server-only` package to catch leaks.",
          "Avoid using standard HTML `<img>` tags in Next.js; always use `next/image` to get automated WebP conversion and responsive sizing.",
          "Never fetch data in Client Components using `useEffect` when it can be fetched directly inside an `async` Server Component."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "vite",

      why: {
        before: "Webpack-based development servers compiled and bundled the entire application upfront before starting, meaning developers on large codebases had to wait 2-5 minutes just to start the dev server, and Hot Module Replacement (HMR) took seconds on every save.",
        problem: "Frontend development needs near-instantaneous dev server startup and sub-millisecond hot module replacement, regardless of project scale or dependency count.",
        shift: "**Vite: A modern frontend build tool that significantly improves the frontend development experience, consisting of a dev server that serves source files over native ES modules, and a build command that bundles code with Rollup.** Created by Evan You (creator of Vue), Vite revolutionized the frontend build ecosystem."
      },

      num: {
        t: "Vite vs Webpack: Architecture & Performance Metrics",
        h: ["Dimension", "Vite (Next-Gen)", "Webpack (Traditional)", "Underlying Mechanism", "Developer Experience Impact"],
        r: [
          ["Dev Server Cold Startup", "Instantaneous ($100\\text{--}300$ ms)", "Slow ($20\\text{--}90$ seconds on large apps)", "Vite uses native browser ESM; Webpack bundles all files upfront", "Vite starts instantly regardless of project size ($10{,}000+$ modules)"],
          ["Hot Module Replacement (HMR)", "Sub-millisecond ($< 50$ ms)", "Slows down as project grows ($2\\text{--}10$ seconds)", "Vite invalidates only the single edited file over HTTP", "Editing a button updates instantly without page reload"],
          ["Dependency Pre-Bundling", "esbuild (written in Go)", "Node.js JavaScript compilation", "esbuild is $10\\text{--}100\\times$ faster than JS-based bundlers", "Converts CommonJS libraries to ESM in milliseconds"],
          ["Production Bundling", "Rollup (multi-page, tree-shaken)", "Webpack custom bundling engine", "Highly optimized static asset packaging", "Outputs battle-tested, hyper-optimized production bundles"],
          ["Configuration Complexity", "Zero-config baseline (out of the box TS/JSX)", "Heavy boilerplate (`webpack.config.js` loaders/plugins)", "Sensible opinionated defaults with clean plugin API", "New projects start coding immediately without config hell"]
        ],
        n: "Vite's architectural breakthrough divides source code into two categories: **Dependencies** (mostly plain JavaScript from `node_modules` that rarely change) and **Source Code** (TypeScript, JSX, CSS that changes constantly). During server startup, Vite pre-bundles dependencies using **esbuild** (written in Go, running $10\\text{--}100\\times$ faster than JS bundlers). For application source code, Vite serves files as **Native Browser ES Modules (ESM)** over native HTTP/2. The browser requests modules on-demand as they are needed: when an engineer edits a file, Vite uses native ESM to update only that single module via HMR, meaning **HMR speed remains constant ($<50\\text{ms}$) whether the project has 10 files or 100,000 files**."
      },

      miss: [
        {
          w: "Vite ships unbundled native ES modules directly to production.",
          r: "Vite only uses native ESM in **development**! For **production**, Vite runs a full **Rollup build pipeline** that performs advanced tree shaking, code splitting, asset inlining, and minification. Shipping unbundled ESM to production would cause devastating network request waterfalls."
        },
        {
          w: "Vite is only for Vue.js applications.",
          r: "While created by Evan You, Vite is **completely framework-agnostic**. Vite provides first-class, official templates and plugins for **React, Preact, Svelte, Solid, Lit, Vanilla JS, and TypeScript**, and has become the universal default toolchain for the entire web ecosystem."
        },
        {
          w: "Vite type-checks your TypeScript code during development.",
          r: "Vite **DOES NOT perform type checking** during dev server execution or production builds! Vite uses esbuild to strip types instantly without checking them, prioritizing raw compilation speed. Type checking must be run in parallel using **`tsc --noEmit`** or IDE language servers."
        },
        {
          w: "Environment variables in Vite use `process.env` like Node.js.",
          r: "Vite does NOT use `process.env`! Vite exposes environment variables on **`import.meta.env`**. Furthermore, to prevent accidentally leaking private backend API keys to the browser, Vite strictly requires public client variables to be prefixed with **`VITE_`** (e.g., `import.meta.env.VITE_API_URL`)."
        }
      ],

      trade: {
        buys: [
          "Instantaneous dev server startup: boots in milliseconds regardless of how many thousands of components exist.",
          "Lightning-fast Hot Module Replacement: code updates reflect on screen in under 50ms without full page reloads.",
          "Clean, minimal configuration: provides out-of-the-box support for TypeScript, JSX, CSS Modules, and PostCSS.",
          "Universal framework ecosystem: standardized plugin architecture works identically across React, Vue, and Svelte."
        ],
        costs: [
          "Dev/Prod divergence: development runs on esbuild + native ESM, while production compiles with Rollup, occasionally causing subtle edge-case differences.",
          "No built-in type checking: requires running a separate background terminal process (`tsc --watch`) for type validation.",
          "CommonJS dependency quirks: legacy non-standard CommonJS npm packages occasionally require manual pre-bundling configuration.",
          "Client-side SPA focus: core Vite is designed for client-side SPAs; full SSR requires meta-frameworks like Nuxt, SvelteKit, or Astro."
        ],
        avoid: [
          "Never attempt to access environment variables using `process.env` in Vite; use `import.meta.env.VITE_*`.",
          "Do not skip running `tsc --noEmit` in CI/CD pipelines, as Vite builds will happily compile invalid TypeScript without errors.",
          "Avoid importing legacy unmaintained CommonJS libraries that cannot be parsed by esbuild's dependency pre-bundler.",
          "Never disable content hashing in production Rollup chunk outputs to preserve immutable CDN caching."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "content-security-policy",

      why: {
        before: "Cross-Site Scripting (XSS) attacks allowed malicious injected scripts to execute with full privileges, stealing cookies, logging keystrokes, and exfiltrating sensitive data with zero browser-level defense-in-depth.",
        problem: "Web applications need an authoritative, browser-enforced security policy that restricts the sources from which scripts, styles, images, and network connections can be loaded and executed.",
        shift: "**Content Security Policy (CSP): An HTTP header and browser security standard that enables site administrators to restrict the resources (such as JavaScript, CSS, Images) that the browser is allowed to load for a given page.** Serving as the ultimate defense-in-depth against XSS, CSP prevents unauthorized code execution."
      },

      num: {
        t: "Content Security Policy (CSP) Directives & Security Enforcement",
        h: ["CSP Directive", "Syntax Example", "Protected Resource Type", "Attack Prevented", "Strict Modern Policy Standard"],
        r: [
          ["`default-src`", "`default-src 'self'`", "Fallback for all un-specified resource fetch directives", "Prevents unapproved resource loading across the board", "Baseline foundation: `'self'`"],
          ["`script-src`", "`script-src 'self' 'nonce-rAnd0m'`", "JavaScript execution sources", "Cross-Site Scripting (XSS); blocks unauthorized inline scripts", "Strict CSP: `'nonce-{random}' 'strict-dynamic'`"],
          ["`style-src`", "`style-src 'self' 'unsafe-inline'`", "CSS stylesheets and inline style tags", "CSS injection attacks, data exfiltration via CSS selectors", "Avoid `'unsafe-inline'`; use nonces or hashes"],
          ["`img-src`", "`img-src 'self' data: https://images.com`", "Image loading sources", "Image tracking beacons, data exfiltration to attacker servers", "Explicit trusted image CDNs"],
          ["`connect-src`", "`connect-src 'self' https://api.example.com`", "Allowed destinations for `fetch`, XHR, WebSockets", "Exfiltration of stolen credentials to malicious APIs", "Strict API endpoint whitelisting"],
          ["`frame-ancestors`", "`frame-ancestors 'none'`", "Who can embed this page in an `<iframe>`", "Clickjacking attacks (replaces legacy `X-Frame-Options`)", "Set to `'none'` for banking and account portals"]
        ],
        n: "Content Security Policy is delivered via the HTTP response header **`Content-Security-Policy: <directives>`** (or a `<meta>` tag). When enabled, the browser's parser validates every resource against the declared whitelist: any script, image, or socket connection from an unauthorized origin is **immediately blocked and logged**. Under modern **Strict CSP** (Google Web Standards), domain whitelisting is abandoned because CDNs often host vulnerable JSONP endpoints. Instead, Strict CSP uses **Cryptographic Nonces**: the server generates a cryptographically random Base64 string for every HTTP response (`nonce='EDNnf03nceIecgn'`): `<script nonce='EDNnf03nceIecgn' src='app.js'></script>`. Any script tag in the HTML lacking the exact matching dynamic nonce is strictly blocked from execution, rendering injected XSS payloads completely harmless."
      },

      miss: [
        {
          w: "Adding `'unsafe-inline'` and `'unsafe-eval'` to `script-src` provides good security.",
          r: "Using `'unsafe-inline'` and `'unsafe-eval'` **completely destroys the security value of CSP**! `'unsafe-inline'` permits executing any inline `<script>` tag or event handler (`onclick`), which is the exact mechanism exploited by Cross-Site Scripting (XSS) attacks. Modern CSP uses **nonces** or **hashes** (`'sha256-...'`) to allow authorized scripts safely."
        },
        {
          w: "A meta tag `<meta http-equiv='Content-Security-Policy'>` can enforce all CSP directives.",
          r: "Certain critical directives **CANNOT be enforced via meta tags**: specifically **`frame-ancestors`**, **`report-uri`**, and **`sandbox`**. These directives **MUST be delivered as a true HTTP response header** from the web server."
        },
        {
          w: "Enabling CSP means you don't need to sanitize user input anymore.",
          r: "CSP is **defense-in-depth**, NOT a replacement for input sanitization! If user input is un-sanitized, attackers can still execute HTML injection, deface the website, or exploit logic flaws. Proper input encoding (DOMPurify, context-aware escaping) remains the first line of defense."
        },
        {
          w: "Testing CSP in production will instantly break your website if misconfigured.",
          r: "You can safely test CSP using the **`Content-Security-Policy-Report-Only`** header! In report-only mode, the browser **does NOT block any resources**; it simply monitors the page and sends JSON violation reports to your specified `report-to` endpoint, allowing you to catch violations before enforcing strict blocking."
        }
      ],

      trade: {
        buys: [
          "Definitive XSS mitigation: neutralizes Cross-Site Scripting attacks even if un-sanitized user input is injected into the DOM.",
          "Clickjacking elimination: `frame-ancestors 'none'` completely stops attackers from embedding your site inside invisible iframe traps.",
          "Data exfiltration prevention: `connect-src` stops compromised client scripts from transmitting passwords to external hacker servers.",
          "Real-time violation monitoring: `report-to` endpoints stream real-time JSON alerts when attacks or script violations occur."
        ],
        costs: [
          "Implementation complexity: retrofitting strict CSP on legacy applications with inline styles and scripts requires major refactoring.",
          "Dynamic nonce overhead: nonce-based CSP prevents pure static HTML caching at CDN edges unless paired with edge middleware.",
          "Third-party tag friction: analytics, ad tags, and chat widgets constantly inject un-vetted external scripts that trigger CSP violations.",
          "Accidental outage risk: an overly aggressive CSP can inadvertently block critical production payment gateways or fonts."
        ],
        avoid: [
          "Never deploy a production CSP containing `'unsafe-inline'` without nonces or hashes; it completely defeats XSS protection.",
          "Do not roll out a blocking CSP directly to production without testing first via `Content-Security-Policy-Report-Only`.",
          "Avoid static, hardcoded nonces; the nonce MUST be generated dynamically as a cryptographically random value on every HTTP response.",
          "Never omit `frame-ancestors 'none'` (or `'self'`) on authenticated application dashboards to prevent Clickjacking."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "web-app-manifest",

      why: {
        before: "Web applications opened exclusively within standard browser window frames with visible URL bars, back buttons, and browser chrome, and could not be installed to a smartphone homescreen or desktop OS app menu like a native application.",
        problem: "Progressive Web Apps need a standardized, declarative configuration file that instructs the operating system on how the web app should appear, launch, and behave when installed as a standalone application.",
        shift: "**Web App Manifest: A JSON text file that provides information about a web application (such as its name, author, icon, and description) in a text file.** Standardized by the W3C, it provides the metadata required for browsers to install web applications to device homescreens and launch in standalone app windows."
      },

      num: {
        t: "Web App Manifest Members: Display Modes & Capabilities",
        h: ["Manifest Member", "JSON Key Syntax", "Configuration Options", "OS / UI Window Impact", "Practical Engineering Use Case"],
        r: [
          ["`display` Mode", `"display": "standalone"`, "`standalone`, `fullscreen`, `minimal-ui`, `browser`", "Removes browser URL bar; renders in dedicated OS app window", "Makes PWA look and feel identical to a native mobile app"],
          ["`icons` Array", `"icons": [{ "src": "icon.png", "sizes": "512x512" }]`, "MIME types, resolutions (`192x192`, `512x512`, `maskable`)", "Homescreen icon, splash screen logo, task switcher", "Mandatory `maskable` icon prevents ugly Android icon cropping"],
          ["`start_url`", `"start_url": "/?source=pwa"`, "Relative or absolute URL path", "Defines exact landing page when launched from homescreen", "Separates PWA launch analytics from web browser traffic"],
          ["`theme_color` / `background_color`", `"theme_color": "#4f46e5"`, "Hexadecimal / CSS color string", "Colors the mobile OS status bar and launch splash screen", "Seamless branded startup experience without white flashes"],
          ["`shortcuts`", `"shortcuts": [{ "name": "New Post", "url": "/new" }]`, "Array of shortcut items", "Long-press app icon context menu in iOS/Android/Windows", "Provides quick action jumping directly into specific features"]
        ],
        n: "The Web App Manifest is linked in the HTML document via: `<link rel='manifest' href='/manifest.webmanifest'>`. Browsers parse this JSON document to evaluate **PWA Installability Criteria**. When the criteria are satisfied (valid manifest + registered Service Worker with fetch handler + served over HTTPS), the browser fires the **`beforeinstallprompt` event**, allowing developers to build customized in-app 'Install App' buttons. Crucially, Android devices require **Maskable Icons** (`'purpose': 'any maskable'`): maskable icons include safe-zone padding that allows the Android operating system to apply adaptive icon masks (squircle, circle, rounded rectangle) without slicing off the company logo."
      },

      miss: [
        {
          w: "A Web App Manifest is all you need to make your website an installable PWA.",
          r: "A Web App Manifest is only **one of three requirements**. For a browser to trigger the installation prompt, the application MUST also: (1) Be served over secure **HTTPS**, and (2) Have an active, registered **Service Worker** with a `fetch` event handler for offline capability."
        },
        {
          w: "The Web App Manifest file must be named `manifest.json`.",
          r: "While `.json` works, the official W3C specification standardizes the file extension as **`.webmanifest`** (`manifest.webmanifest`), served with the official MIME type `application/manifest+json`."
        },
        {
          w: "Setting `display: 'standalone'` prevents the user from navigating back if they click an external link.",
          r: "If a user navigates to an external origin while inside a standalone PWA, modern mobile operating systems automatically display a minimal top navigation bar containing a 'Back' button and the external URL, ensuring users are never trapped."
        },
        {
          w: "Apple iOS ignores the Web App Manifest completely.",
          r: "While iOS historically required proprietary `<meta name='apple-mobile-web-app-capable'>` tags, modern iOS Safari supports the official Web App Manifest standard for icons, names, and standalone display."
        }
      ],

      trade: {
        buys: [
          "Homescreen installation: allows users to install the web app to their iOS, Android, macOS, or Windows desktop/mobile launcher.",
          "Standalone app window: launches without the browser URL address bar, creating a clean, immersive native app feel.",
          "Branded splash screens: `theme_color` and `background_color` automatically generate smooth, native-like startup screens.",
          "OS context shortcuts: long-pressing the app icon exposes quick action shortcuts directly into key application features."
        ],
        costs: [
          "Asset creation overhead: requires designing and generating multiple icon resolutions (`192x192`, `512x512`) and maskable assets.",
          "Service Worker dependency: installation criteria mandate maintaining an active Service Worker with offline handling.",
          "Platform inconsistencies: different operating systems (iOS vs Android vs Windows) handle install dialogs and display modes with subtle variances.",
          "Update latency: cached manifests can take time to update on installed devices when icons or names change."
        ],
        avoid: [
          "Never omit `maskable` icon definitions, or Android will place your icon inside an ugly tiny white box.",
          "Do not set `start_url` to an un-cached page that crashes when launched offline.",
          "Avoid launching intrusive custom install popups immediately upon landing; wait until the user has experienced value.",
          "Never forget to serve the manifest file with the correct MIME type `application/manifest+json` from your server."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "performance-budget",

      why: {
        before: "Teams worked hard to optimize website speed, only for future pull requests to quietly add massive JavaScript dependencies, uncompressed 5MB hero images, and heavy third-party tags, causing performance to slowly degrade back to slow speeds over time.",
        problem: "Engineering organizations need an automated, enforceable threshold on web metrics and asset sizes that acts as a continuous CI/CD quality gate, preventing performance regressions before code ever reaches production.",
        shift: "**Performance Budget: A set of limits imposed on metrics that affect web performance, establishing clear boundaries for bundle sizes, asset weights, network requests, and user-centric timings.** Integrated into automated CI/CD pipelines, performance budgets ensure that performance remains an ongoing non-negotiable constraint."
      },

      num: {
        t: "Performance Budget Categories & CI/CD Enforcement Gates",
        h: ["Budget Category", "Measured Threshold", "Example Budget Limit", "Enforcement Tool", "Failure Action in CI/CD"],
        r: [
          ["Quantity / Size Budget", "Total compressed size of JS / CSS chunks", "Initial JS $< 150\\text{ KB}$ (Brotli)", "Bundlesize, Size Limit, Webpack performance limits", "Fails pull request build if bundle size increases by $> 5\\text{ KB}$"],
          ["Milestone / Timing Budget", "Synthetic lab timings measured in headless Chrome", "First Contentful Paint (FCP) $< 1.5\\text{s}$", "Lighthouse CI (LHCI assertions)", "Blocks merge if Lighthouse Performance score drops below $90$"],
          ["Core Web Vitals Budget", "Real-user field metrics evaluated at p75", "LCP $< 2.5\\text{s}$, INP $< 200\\text{ms}$, CLS $< 0.1$", "Datadog RUM, Sentry Performance, SpeedCurve", "Fires automated PagerDuty alerts on production degradation"],
          ["Asset Count Budget", "Total number of network requests made during load", "$< 25$ total HTTP network requests", "Lighthouse budget.json (`resourceCounts`)", "Flags warning in PR when unnecessary third-party tags are added"]
        ],
        n: "A Performance Budget operationalizes performance as an immutable design constraint: *'If we want to add a new 50KB feature, we must either optimize 50KB out of the existing codebase or reject the feature.'* In modern web engineering, budgets are codified in configuration files: (1) **Size Limit (`.size-limit.json`)** runs in GitHub Actions, computing the exact byte size of production bundles including Brotli compression and running time execution benchmarks; (2) **Lighthouse CI (`lighthouserc.json`)** defines assertion budgets: `assertions: { 'categories:performance': ['error', { minScore: 0.9 }], 'largest-contentful-paint': ['error', { maxNumericValue: 2500 }] }`. If any threshold is breached, the CI/CD pipeline immediately fails the pull request, preventing performance rot from ever entering the main branch."
      },

      miss: [
        {
          w: "A performance budget is just a written guideline document for engineers to read.",
          r: "A written document that is not automated is useless. A true **Performance Budget is an automated CI/CD quality gate** (like a linter or test suite) that automatically checks bundle sizes and blocks pull requests from merging if limits are exceeded."
        },
        {
          w: "Performance budgets only track the raw file size in kilobytes.",
          r: "File size is only one type of budget. Advanced performance budgets track **user-centric timing metrics** (Total Blocking Time $< 200\\text{ms}$, Largest Contentful Paint $< 2.5\\text{s}$) and **CPU parse times**, because 100KB of JavaScript consumes significantly more CPU execution time than 100KB of JPEG images."
        },
        {
          w: "Once a performance budget is set, it can never be changed.",
          r: "Performance budgets should be **reviewed and tuned periodically** as business requirements evolve. If a critical business feature requires exceeding the budget, the team must deliberately evaluate trade-offs: either raising the budget with executive approval or optimizing elsewhere to preserve the threshold."
        },
        {
          w: "Performance budgets prevent developers from shipping features.",
          r: "Performance budgets do not stop features; they **prevent lazy engineering**. They force developers to evaluate dependencies critically: choosing a 2KB date library (`date-fns/light`) instead of a 70KB legacy monolith (`moment.js`), implementing code splitting, and optimizing assets."
        }
      ],

      trade: {
        buys: [
          "Prevents performance rot: permanently stops codebases from slowly accumulating bundle bloat and becoming sluggish over time.",
          "Automated quality gates: catches accidental heavy imports (like importing an entire icon library) before they hit production.",
          "Objective business alignment: provides a clear framework for product managers to weigh the cost of new features against speed.",
          "Protects Core Web Vitals: guarantees that production releases continue passing Google SEO performance thresholds."
        ],
        costs: [
          "CI/CD build pipeline friction: pull requests get blocked when developers introduce heavy dependencies, requiring refactoring.",
          "Maintenance and tuning overhead: requires maintaining budget configuration files and adjusting limits as products grow.",
          "Initial baseline setting effort: requires establishing realistic current baselines before enforcing strict pass/fail gates.",
          "Developer education: requires teaching engineers how to inspect bundle analyzers and optimize dependencies."
        ],
        avoid: [
          "Never set unrealistic performance budgets that fail every build; start with your current baseline and ratchets downwards.",
          "Do not track uncompressed asset sizes; always measure after minification and Brotli/Gzip compression.",
          "Avoid relying only on file size budgets; include User-Centric timing budgets (LCP, TBT) via Lighthouse CI.",
          "Never allow developers to bypass CI performance budget failures without explicit engineering lead sign-off and justification."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
