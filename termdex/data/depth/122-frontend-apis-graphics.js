/* ==========================================================================
   Depth pass 122 — Web Frontend batch 7: Advanced Browser APIs & Visual Rendering.
   Fetch API, Debounce and Throttle, Virtual Scrolling, Responsive Images,
   SVG, Canvas, Design System.

   AbortSignal stream readers, temporal sliding window execution, DOM recycle viewport pools,
   DPR density descriptor selection, and resolution-independent vector rendering.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "fetch-api",

      why: {
        before: "Asynchronous network requests in the browser relied on the cumbersome, event-based `XMLHttpRequest` (XHR) API, requiring verbose boilerplate, complex callback chains, and messy error handling.",
        problem: "Modern web applications need a clean, promise-based, standardized interface for fetching network resources across the web, supporting streaming responses, custom headers, and request cancellation.",
        shift: "**Fetch API: A modern, promise-based native JavaScript interface for accessing and manipulating parts of the HTTP pipeline, such as requests and responses.** Replacing `XMLHttpRequest`, Fetch provides a cleaner, more powerful architecture built around Request, Response, Headers, and AbortController."
      },

      num: {
        t: "Fetch API vs XMLHttpRequest (XHR) Architectural Comparison",
        h: ["Feature / Capability", "Fetch API (Modern Standard)", "XMLHttpRequest (XHR - Legacy)", "Technical Mechanism", "Production Advantage"],
        r: [
          ["Promise Integration", "Native Promises / `async/await`", "Event listeners (`onreadystatechange`, `onload`)", "Microtask scheduling", "Clean linear async code; avoids Callback Hell"],
          ["Streaming Body Response", "ReadableStream body (`response.body.getReader()`)", "Buffered full payload in memory", "Streams bytes chunk-by-chunk", "Enables real-time LLM AI response streaming (ChatGPT)"],
          ["Cancellation Mechanism", "Standardized `AbortController` / `AbortSignal`", "`xhr.abort()`", "DOM event signal cancellation", "Universal cancellation protocol shared across Web APIs"],
          ["Service Worker Interception", "Direct 1:1 integration with Service Worker `fetch`", "Indirectly intercepted", "Standard HTTP primitive", "Core foundation of PWA offline caching architecture"],
          ["HTTP Error Handling", "Rejects ONLY on physical network failures (404/500 resolve!)", "Fires `onerror` / `onload`", "`response.ok` boolean status", "Requires explicit `if (!res.ok) throw ...` check"]
        ],
        n: "The Fetch API operates around the unified **WHATWG Fetch standard**. Initiating a request via `fetch(url, options)` returns a Promise that resolves to a **Response** object as soon as the HTTP headers arrive—long before the body finishes downloading. The response body is an asynchronous **ReadableStream** (`ReadableStreamDefaultReader`): data can be read incrementally via `reader.read()`, allowing applications to display streaming text (such as AI chat completions) with zero latency. Request cancellation is mediated through **`AbortController`**: passing `controller.signal` to the fetch options allows calling `controller.abort()`, which immediately terminates the underlying network socket and rejects the Promise with a `DOMException: AbortError`."
      },

      miss: [
        {
          w: "A `fetch()` promise rejects when the server returns a 404 Not Found or 500 Server Error.",
          r: "`fetch()` **DOES NOT REJECT on HTTP error codes (404, 500, 401)**! The Promise resolves successfully as long as the server responded with an HTTP status. It ONLY rejects on true physical network failures, DNS lookup failures, or blocked CORS. Developers must explicitly check **`if (!response.ok)`** (`response.status` in range 200-299) to detect HTTP errors."
        },
        {
          w: "Calling `fetch()` automatically sends cookies to cross-origin APIs.",
          r: "By default, `fetch()` uses `credentials: 'same-origin'`. To include cookies and authorization headers in cross-origin requests, developers must explicitly set **`credentials: 'include'`**, and the server must reply with `Access-Control-Allow-Credentials: true`."
        },
        {
          w: "You can read the response body multiple times (`res.json()` then `res.text()`).",
          r: "The response body is a one-way **ReadableStream** that can be consumed **only once**. Calling `res.json()` followed by `res.text()` throws a fatal `TypeError: Already read`. To read the body multiple times, you must clone the response first: `const clone = res.clone()`."
        },
        {
          w: "You must use Axios because Fetch cannot upload files or cancel requests.",
          r: "Native Fetch supports file uploads natively using **`FormData`** (which automatically sets the correct `multipart/form-data` boundary), and cancels requests natively via **`AbortController`**, eliminating the need for heavy third-party libraries for basic HTTP tasks."
        }
      ],

      trade: {
        buys: [
          "Native browser primitive: requires zero npm dependencies or bundle overhead; available everywhere including Node.js 18+.",
          "Streaming support: consumes and renders streaming chunked responses in real time (critical for Generative AI apps).",
          "Universal cancellation: `AbortController` integrates with React cleanup effects to cancel stale in-flight requests.",
          "Service Worker integration: forms the universal standard for Service Worker caching, request proxies, and offline modes."
        ],
        costs: [
          "Manual error checking: requires manually checking `response.ok` and throwing errors, unlike Axios which rejects automatically.",
          "No native upload progress: lacks easy upload progress events (e.g., tracking a 1GB file upload requires XHR or streams).",
          "No automatic JSON serialization: requires manually calling `JSON.stringify(body)` and setting `Content-Type: application/json`.",
          "Manual timeout handling: lacks a built-in `timeout` option (requires `AbortSignal.timeout(5000)`)."
        ],
        avoid: [
          "Never forget to verify `if (!response.ok)` before parsing the response body.",
          "Do not forget to pass `AbortSignal` in React `useEffect` cleanups to cancel in-flight requests when components unmount.",
          "Avoid reading `response.json()` twice on the same response object without calling `response.clone()` first.",
          "Never hardcode `Content-Type: multipart/form-data` when uploading a `FormData` object; let the browser set the boundary header automatically."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "debounce-and-throttle",

      why: {
        before: "Binding expensive operations (API autocomplete queries, DOM re-renders, window resize calculations) to high-frequency events (`scroll`, `resize`, `mousemove`, `keyup`) fired hundreds of times per second, crashing the browser and overwhelming backend servers.",
        problem: "Software needs rate-limiting control mechanisms to constrain how often a function can execute over time in response to rapid, continuous event streams.",
        shift: "**Debounce and Throttle: Two distinct higher-order timing techniques used to control the execution rate of a function over time.** Debounce groups bursts of events into a single execution after an idle pause, while Throttle guarantees execution at a steady, fixed periodic interval."
      },

      num: {
        t: "Debounce vs Throttle: Timing Mechanics & Production Use Cases",
        h: ["Technique", "Core Execution Rule", "Timer Reset Behavior", "Guaranteed Intermediate Execution", "Canonical Production Use Case"],
        r: [
          ["Debounce (Trailing)", "Executes ONLY after user stops triggering for $N$ ms", "Resets timer on EVERY new trigger event", "No (delays indefinitely while active)", "Search autocomplete input (`keyup`), window resize end"],
          ["Debounce (Leading)", "Executes IMMEDIATELY on first event; ignores rest", "Resets timer on each trigger; locks out next run", "No (runs only on initial burst entry)", "Preventing double-clicks on payment submit buttons"],
          ["Throttle (Periodic)", "Executes at most ONCE per $N$ ms window", "Does NOT reset timer; executes at fixed rate", "Yes (guarantees periodic updates)", "Infinite scroll loading (`scroll`), drag-and-drop coordinates"],
          ["`requestAnimationFrame` Throttle", "Throttles execution to browser display refresh (60Hz / 120Hz)", "Synchronizes with VSync rendering clock", "Yes (exactly once per rendered frame)", "Smooth visual canvas animations, custom scrollbar tracks"]
        ],
        n: "Debounce and Throttle govern the temporal frequency of function execution. A **Debounce** implementation wraps the target function in a closure containing a timer reference: `let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };`. Every incoming event cancels the existing timer and schedules a new one: execution only occurs when the event stream remains silent for the full duration of `delay`. In contrast, a **Throttle** enforces a maximum execution frequency: it records `lastRan = Date.now()` (or uses a trailing timer) to guarantee that the target function executes at most once every $N$ milliseconds regardless of how many thousands of events fire."
      },

      miss: [
        {
          w: "Debounce and Throttle are interchangeable terms for the same concept.",
          r: "They have radically different timing behaviors! **Debounce** waits for the user to **stop doing something** (idle delay). If an event fires continuously for 10 minutes, a debounced function will never run until the user stops. **Throttle** executes **at steady intervals** throughout the entire 10 minutes, guaranteeing continuous periodic updates."
        },
        {
          w: "Throttling a scroll event handler using `setTimeout` is optimal for animations.",
          r: "For visual animations tied to scrolling, **`requestAnimationFrame` (rAF)** is far superior to `setTimeout`. `setTimeout` is disconnected from the monitor's refresh rate and causes screen tearing. A rAF throttle ensures the animation runs exactly once per monitor VSync frame (60 FPS / 16.6ms)."
        },
        {
          w: "A debounced function in React preserves its timer across component re-renders automatically.",
          r: "If you define a debounced function directly inside a React component body without **`useMemo`** or **`useCallback`**, every re-render creates a **brand new debounced function instance** with a new timer! The debounce effect will fail completely. It must be memoized or wrapped in a custom hook."
        },
        {
          w: "Debouncing an input field eliminates the need for backend API rate limiting.",
          r: "Debouncing is a **client-side UX optimization**, not a security control. Malicious users or bots can bypass the frontend debounce and blast your backend API directly. Backend servers must always implement independent API rate limiting."
        }
      ],

      trade: {
        buys: [
          "Prevents server overload: stops search autocomplete inputs from firing an API request on every keystroke.",
          "Eliminates UI jank: restricts expensive DOM recalculations on `resize` or `scroll` to manageable frequencies.",
          "Prevents duplicate submissions: leading-edge debounce stops impatient users from double-submitting forms.",
          "Battery and CPU conservation: reduces wasteful computation on mobile devices during touch scrolling."
        ],
        costs: [
          "Input latency: debouncing introduces an intentional delay before the user sees search results or changes take effect.",
          "Memory management: closures holding timer references must be properly cleaned up on unmount to avoid memory leaks.",
          "React lifecycle complexity: memoizing debounced handlers across renders requires careful hook management (`useCallback`).",
          "Event object pooling: in legacy React synthetic events, accessing `e.target` inside a debounced callback required `e.persist()`."
        ],
        avoid: [
          "Never recreate debounced functions on every render inside a React component; wrap in `useCallback` or `useMemo`.",
          "Do not use debounce for infinite scroll triggers; use Throttle or `IntersectionObserver`.",
          "Avoid setting excessively long debounce delays ($> 500$ ms) on search inputs; $250\\text{--}300$ ms is the ideal human sweet spot.",
          "Never forget to cancel pending timers (`debouncedFn.cancel()`) when a component unmounts to prevent state updates on unmounted nodes."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "virtual-scrolling",

      why: {
        before: "Rendering a dataset with 50,000 items (log feeds, financial tables, social media timelines) injected 50,000 real DOM nodes into the page, consuming gigabytes of RAM, freezing browser scrolling, and causing catastrophic layout reflows.",
        problem: "Web applications need to display massive or infinite datasets smoothly at 60 FPS while keeping browser memory consumption fixed and constant regardless of list size.",
        shift: "**Virtual Scrolling (Virtualization / Windowing): A performance optimization technique that renders only the tiny subset of items currently visible within the user's viewport (plus a small buffer), recycling or repositioning DOM nodes dynamically as the user scrolls.** Popularized by React Virtualized and TanStack Virtual, it transforms $\\mathcal{O}(N)$ DOM complexity into $\\mathcal{O}(1)$ constant memory."
      },

      num: {
        t: "Virtual Scrolling vs Standard DOM Rendering: Architectural Scaling",
        h: ["List Size ($N$ Items)", "Standard DOM Nodes Rendered", "Virtual Scrolling DOM Nodes", "Memory Footprint (Standard vs Virtual)", "Scroll Performance (FPS)"],
        r: [
          ["$100$ items", "100 nodes", "$\\approx 20$ nodes", "$2$ MB vs $2$ MB", "60 FPS / 60 FPS"],
          ["$1{,}000$ items", "1,000 nodes", "$\\approx 20$ nodes", "$25$ MB vs $3$ MB", "45 FPS vs 60 FPS"],
          ["$10{,}000$ items", "10,000 nodes", "$\\approx 20$ nodes", "$250$ MB vs $4$ MB", "10 FPS (Severe stutter) vs 60 FPS"],
          ["$100{,}000$ items", "100,000 nodes", "$\\approx 20$ nodes", "Browser Tab Crash (OOM) vs $5$ MB", "Crashes vs Silky-smooth 60 FPS"],
          ["$1{,}000{,}000$ items", "Impossible", "$\\approx 20$ nodes", "Impossible vs $5$ MB", "Impossible vs 60 FPS"]
        ],
        n: "Virtual scrolling decouples the size of the dataset from the size of the DOM. The virtualizer wraps the list in a scrollable outer container and creates an inner container whose height is set to the **virtual total height**: $H_{\\text{total}} = N \\times \\text{itemHeight}$. Based on the container's current `scrollTop` position, the algorithm calculates the visible index range: $\\text{startIndex} = \\lfloor \\text{scrollTop} / \\text{itemHeight} \\rfloor$ and $\\text{endIndex} = \\lceil (\\text{scrollTop} + \\text{viewportHeight}) / \\text{itemHeight} \\rceil$. Only items within $[\\text{startIndex} - \\text{overscan}, \\; \\text{endIndex} + \\text{overscan}]$ are instantiated in the DOM. Each item is positioned using absolute coordinates (`transform: translateY(index * height)`). When the user scrolls, the same $20\\text{--}30$ DOM elements are continuously recycled and updated with new data, maintaining strictly **$\\mathcal{O}(1)$ DOM memory overhead**."
      },

      miss: [
        {
          w: "Virtual scrolling and infinite scrolling are the exact same thing.",
          r: "**Infinite scrolling** simply appends new data to the bottom of the DOM as the user scrolls, causing the DOM to grow infinitely until the browser crashes. **Virtual scrolling** actively unmounts and removes off-screen items from the DOM, keeping total rendered nodes fixed at $\\approx 20\\text{--}30$ nodes forever."
        },
        {
          w: "Virtual scrolling requires every item in the list to have an identical, fixed pixel height.",
          r: "Early virtualizers required fixed heights, but modern libraries (**TanStack Virtual**, React Virtualized) support **Dynamic Variable Heights**: they dynamically measure rendered elements using `ResizeObserver` and update a predictive offset cache in real time."
        },
        {
          w: "The browser's native 'Find on Page' (Ctrl+F) works seamlessly with virtual lists.",
          r: "Because off-screen items do NOT physically exist in the DOM, the browser's built-in **Ctrl+F search CANNOT find off-screen text**! Applications with virtual lists must implement custom in-app search bars that query the raw in-memory dataset and programmatically scroll the virtualizer to matching indices."
        },
        {
          w: "Virtual scrolling is necessary for any list with more than 50 items.",
          r: "Modern browser engines easily handle $100\\text{--}500$ simple DOM nodes without performance loss. Virtual scrolling adds complexity (scroll jumpiness, accessibility challenges) and should only be introduced when lists exceed several hundred complex items or when profiling proves DOM count is the bottleneck."
        }
      ],

      trade: {
        buys: [
          "Infinite scalability: renders lists with $1{,}000{,}000+$ items with silky-smooth 60 FPS scrolling and low memory.",
          "Constant memory footprint: keeps DOM node count strictly fixed at $\\approx 20\\text{--}30$ elements.",
          "Rapid initial load: initial render mounts only the visible items, achieving instantaneous First Contentful Paint.",
          "Device accessibility on mobile: prevents budget mobile devices from crashing due to DOM tree memory exhaustion."
        ],
        costs: [
          "Breaks native Ctrl+F: browser find-in-page cannot find text that is currently unmounted from the DOM.",
          "Accessibility and screen reader friction: screen readers cannot announce total document length or navigate easily off-screen.",
          "Dynamic height layout jumps: variable-height items can cause scrollbar jitter as items are measured dynamically.",
          "Implementation complexity: requires managing overscan buffers, scroll restoration, and sticky headers."
        ],
        avoid: [
          "Never implement virtual scrolling from scratch in production without deep edge-case testing; use battle-tested libraries (TanStack Virtual).",
          "Do not omit an **overscan buffer** (rendering 3-5 items above and below the viewport) to prevent white flashing during fast scrolling.",
          "Avoid using virtual scrolling on tiny lists ($<100$ items) where standard DOM rendering is simpler and faster.",
          "Never forget to supply custom search functionality when replacing native tables with virtual lists."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "responsive-images",

      why: {
        before: "Websites served a single high-resolution 4000px desktop image to all visitors, forcing mobile phones on slow 3G cellular connections to download 5MB image files, burning mobile data and stalling page loads.",
        problem: "Web browsers need a declarative mechanism to select and download the optimal image asset based on the device's physical screen width, display pixel density (Retina), and supported modern image formats.",
        shift: "**Responsive Images: An architectural approach that serves different image files and resolutions tailored to the user's device characteristics, viewport size, and network conditions.** Built on the HTML `<picture>` element, `srcset`, and `sizes` attributes, responsive images optimize visual fidelity while minimizing bandwidth."
      },

      num: {
        t: "Responsive Image Directives: Resolution vs Art Direction vs Next-Gen Formats",
        h: ["Directive / Syntax", "Primary Engineering Problem Solved", "Browser Decision Mechanism", "HTML Markup Primitive", "Typical Bandwidth Savings"],
        r: [
          ["`srcset` with Width Descriptors (`w`)", "Resolution Switching: serving smaller images to smaller screens", "Browser divides image width by viewport width to pick asset", `<img srcset='small.jpg 400w, large.jpg 1200w' sizes='(max-width: 600px) 400px, 1200px'>`, "$50\\text{--}80\\%$ reduction on mobile"],
          ["`srcset` with Pixel Density (`x`)", "Device Pixel Ratio: serving sharp @2x/@3x images to Retina displays", "Matches device `window.devicePixelRatio`", `<img srcset='icon.png 1x, icon@2x.png 2x'>`, "Serves lightweight 1x images to standard displays"],
          ["`<picture>` with Media Queries", "Art Direction: cropping or re-framing images differently for mobile", "Matches CSS media query in `<source media>`", `<picture><source media='(max-width: 600px)' srcset='mobile-crop.jpg'><img src='desktop.jpg'></picture>`, "Ensures subjects remain visible on small screens"],
          ["`<picture>` with Type Formats", "Format Switching: serving modern formats with fallback", "Browser checks format support in `<source type>`", `<picture><source type='image/avif' srcset='pic.avif'><source type='image/webp' srcset='pic.webp'><img src='pic.jpg'></picture>`, "$30\\text{--}50\\%$ compression over JPEG"],
          ["`sizes` Attribute", "Informs browser of image layout size before CSS loads", "Provides layout width hint to preload scanner", "`sizes='(min-width: 1024px) 33vw, 100vw'`", "Prevents browser from downloading wrong size"]
        ],
        n: "The challenge of responsive images arises from the browser's **Preload Scanner**: the browser initiates image downloads *before* it has downloaded, parsed, or computed CSS styles. Without the **`sizes` attribute**, the browser does not know how wide the image will be rendered on screen, so it conservatively assumes `100vw` (full screen width). The `srcset` attribute supplies candidate files alongside **Width Descriptors** (`800w` means the image is physically 800px wide). The browser evaluates: $\\text{RequiredPixels} = \\text{SlotWidth (from sizes)} \\times \\text{DevicePixelRatio (DPR)}$. The browser then selects the smallest file in `srcset` that satisfies the required pixel density. For next-gen compression formats, the **`<picture>` element** allows progressive degradation: serving cutting-edge **AVIF** (50% smaller than JPEG), falling back to **WebP**, and falling back to standard **JPEG** for legacy clients."
      },

      miss: [
        {
          w: "Setting CSS `max-width: 100%` is all you need to make images responsive.",
          r: "CSS `max-width: 100%` only resizes the **visual display box** on screen. It does NOT stop the mobile browser from downloading the full-size 5MB desktop file over the network. True responsive images require **`srcset` and `sizes`** to physically download smaller image files on mobile."
        },
        {
          w: "You should use the `<picture>` element for standard resolution switching.",
          r: "The W3C explicitly recommends **`<img>` with `srcset` and `sizes`** for resolution switching! The `<picture>` element is intended strictly for **Art Direction** (changing the image crop or aspect ratio) and **Format Switching** (AVIF/WebP fallback). Using `<picture>` for simple resolution scaling creates redundant, unmaintainable markup."
        },
        {
          w: "Omitting the `sizes` attribute when using `srcset` width descriptors is fine.",
          r: "If you use width descriptors (`400w, 800w`) without declaring `sizes`, the browser specification mandates that the browser **assumes `sizes='100vw'`**! If your image is actually in a 3-column grid (taking only 33% of the screen), the browser will download a file $3\\times$ larger than necessary."
        },
        {
          w: "The browser always picks the exact pixel match from the `srcset` list.",
          r: "Browsers use intelligent heuristics: on slow cellular connections (or when user data-saver mode is enabled), modern browsers will intentionally choose a **lower-resolution image from `srcset`** to save bandwidth and accelerate load times."
        }
      ],

      trade: {
        buys: [
          "Massive bandwidth savings: slashes mobile image data payloads by $50\\text{--}80\\%$, accelerating mobile LCP.",
          "Retina display sharpness: delivers crisp, high-density graphics to 2x/3x screens without blurring.",
          "Future-proof format adoption: effortlessly serves modern AVIF and WebP formats with universal JPEG fallbacks.",
          "Artistic control: allows cropping portraits or adjusting aspect ratios specifically for narrow vertical screens."
        ],
        costs: [
          "Image asset pipeline complexity: requires automated build scripts or Image CDNs (Cloudinary, Imgix) to generate 5-8 sizes per image.",
          "Complex markup boilerplate: authoring full `<picture>` tags with multiple `srcset` and `sizes` declarations is verbose.",
          "Disk and storage expansion: storing multiple resolutions and formats increases cloud bucket storage costs.",
          "Mental model friction: developers frequently misunderstand width descriptors (`w`) and `sizes` math."
        ],
        avoid: [
          "Never declare `srcset` width descriptors (`w`) without declaring the companion `sizes` attribute.",
          "Do not use `<picture>` when a simple `<img srcset='...' sizes='...'>` satisfies resolution switching.",
          "Avoid serving uncompressed legacy JPEGs/PNGs without providing WebP/AVIF modern format alternatives.",
          "Never forget to declare native `width` and `height` attributes on the fallback `<img>` to prevent Cumulative Layout Shift (CLS)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "svg",

      why: {
        before: "Website icons, logos, and UI diagrams were stored as raster images (PNG, GIF, JPEG), which became pixelated and blurry on high-DPI Retina screens, or required downloading multiple bulky `@2x` and `@3x` image variants.",
        problem: "Modern web interfaces need resolution-independent vector graphics that scale infinitely to any screen size or zoom level without loss of clarity, while allowing direct manipulation via CSS and JavaScript.",
        shift: "**SVG (Scalable Vector Graphics): An XML-based vector image format for two-dimensional graphics with support for interactivity and animation.** Rendered via mathematical geometry commands (paths, curves, shapes) rather than pixels, SVG is the universal standard for web icons, logos, and data visualizations."
      },

      num: {
        t: "SVG Implementation Methods: Inline vs External vs CSS Background",
        h: ["Implementation Method", "DOM Access & Manipulation", "CSS Styling Capability", "Browser Caching", "Security / XSS Risk"],
        r: [
          ["Inline SVG (`<svg> ... </svg>`)", "Full direct DOM access (`querySelector`)", "Full CSS control (`fill: currentColor`, hover)", "None (inlined into HTML payload)", "High: can execute malicious `<script>` if user-generated"],
          ["External `<img>` (`<img src='icon.svg'>`)", "Zero DOM access (sandboxed image)", "No CSS styling (isolated context)", "Cached independently by browser", "Low: browser disables all scripts inside `<img>` SVGs"],
          ["SVG Sprite (`<svg><use href='#icon'/></svg>`)", "Limited (treats use tag as shadow tree)", "Partial (via CSS custom properties / `fill`)", "External sprite file cached across pages", "Low: safe referencing pattern"],
          ["CSS Background (`background-image: url(...)`)", "Zero DOM access", "Zero CSS control", "Cached independently", "Low: sandboxed context"],
          ["Interactive Canvas (D3.js / WebGL)", "Dynamic SVG DOM generation", "Full JavaScript and CSS animation", "Generated on-demand in client memory", "Moderate: depends on data sanitization"]
        ],
        n: "SVG represents visual graphics mathematically through an XML document tree. Core drawing primitives include `<circle>`, `<rect>`, `<line>`, `<polygon>`, and the universal **`<path d='...'>`**. The path data attribute `d` consists of compact geometry command strings: `M` (Move to absolute), `m` (Move to relative), `L` (Line to), `C` (Cubic Bézier curve), and `Z` (Close path). Crucially, the **`viewBox='min-x min-y width height'`** attribute defines the internal coordinate system: setting `viewBox='0 0 100 100'` allows the SVG to scale responsively to any physical CSS container dimension while preserving internal aspect ratios via `preserveAspectRatio`. When inlined directly into HTML, SVG paths can inherit colors directly from CSS typography using **`fill: currentColor`**."
      },

      miss: [
        {
          w: "SVGs are always smaller in file size than PNGs.",
          r: "SVGs are smaller for **geometric icons, logos, and simple illustrations**. However, for complex photographic images with millions of color gradations, an SVG consisting of hundreds of thousands of path nodes will be **megabytes larger** than an optimized WebP or JPEG raster image."
        },
        {
          w: "SVGs are pure image files and can never contain malicious security vulnerabilities.",
          r: "SVGs are **executable XML documents**! An SVG can contain embedded `<script>` tags, inline event handlers (`onload='fetch(...)'`), and external entity injections (XXE). If an application allows users to upload custom SVGs and renders them inline, it introduces a critical **Stored Cross-Site Scripting (XSS)** vulnerability. User SVGs MUST be sanitized with DOMPurify."
        },
        {
          w: "You cannot animate SVG paths with standard CSS.",
          r: "SVG path properties can be styled and animated directly with CSS, including **`stroke-dasharray` and `stroke-dashoffset`**, enabling beautiful 'line-drawing' animations purely through CSS keyframes."
        },
        {
          w: "Inlining all SVGs directly into HTML is best practice.",
          r: "Inlining hundreds of large SVGs inflates HTML document size and prevents browser caching. The industry best practice for design systems is **SVG Sprites (`<use href='/sprite.svg#icon'>`)**, which allows icons to be cached in a single external file while remaining reusable."
        }
      ],

      trade: {
        buys: [
          "Infinite scalability: renders with crisp, vector clarity on any screen resolution, 4K monitor, or pinch-zoom level.",
          "Tiny file size for iconography: vector paths compress to tiny kilobyte footprints compared to raster bitmaps.",
          "DOM and CSS integration: inline SVGs can be dynamically colored (`fill: currentColor`), hovered, and animated.",
          "Accessible graphics: supports `<title>` and `<desc>` tags to provide screen readers with semantic descriptions."
        ],
        costs: [
          "Security vulnerability vector: unsanitized user-uploaded SVGs can execute arbitrary JavaScript (XSS attacks).",
          "CPU rendering bottlenecks: rendering SVGs with thousands of complex bezier curves can cause CPU layout and paint jank.",
          "Unsuitable for photographs: cannot represent continuous-tone photographic images efficiently.",
          "HTML bloat if inlined: inlining complex illustrations repeatedly bloats HTML transfer size without browser caching."
        ],
        avoid: [
          "Never render user-uploaded SVGs inline without thoroughly sanitizing them with DOMPurify to strip `<script>` tags.",
          "Do not omit the `viewBox` attribute on SVGs, as this prevents them from scaling responsively.",
          "Avoid using SVG for complex photographic textures or photorealistic graphics; use WebP or AVIF.",
          "Never hardcode fixed fill colors inside reusable icon SVGs; use `fill='currentColor'` to inherit typography colors."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "canvas",

      why: {
        before: "Rendering dynamic 2D games, real-time data charts, photo manipulation tools, and 3D graphics in the browser was impossible without clunky third-party proprietary plugins like Adobe Flash or Java Applets.",
        problem: "Modern web applications need a high-performance, immediate-mode procedural bitmap drawing surface that can render millions of dynamic pixels, particles, and graphics at 60 FPS using hardware acceleration.",
        shift: "**Canvas (`<canvas>`): An HTML element which can be used to draw graphics via scripting (usually JavaScript).** Operating in immediate mode via the 2D Context (`CanvasRenderingContext2D`) or 3D WebGL/WebGPU contexts, Canvas powers browser gaming, charting, and image editing."
      },

      num: {
        t: "HTML Canvas vs SVG: Immediate Mode vs Retained Mode Graphics",
        h: ["Architectural Feature", "HTML5 Canvas (`<canvas>`)", "Scalable Vector Graphics (SVG)", "Underlying Graphics Paradigm", "Practical Production Fit"],
        r: [
          ["Rendering Paradigm", "Immediate Mode (draws pixels to flat bitmap buffer)", "Retained Mode (maintains in-memory DOM scene graph)", "Canvas forgets shapes after drawing; SVG retains DOM nodes", "Canvas for 100,000 particles; SVG for 50 UI icons"],
          ["DOM Overhead", "Single DOM node (`<canvas>`) regardless of complexity", "One DOM node per shape, path, circle, or group", "Canvas has $\\mathcal{O}(1)$ DOM footprint", "Canvas never causes DOM memory bloat"],
          ["Event Handling", "Manual pixel raycasting / math hit-testing", "Native DOM event listeners (`element.addEventListener`)", "SVG supports native `:hover` and click events", "SVG is vastly easier for interactive UI controls"],
          ["Hardware Acceleration", "Direct GPU rasterization (OpenGL, WebGL, WebGPU)", "CPU layout + GPU layer compositing", "Canvas executes GPU shader pipelines", "Canvas dominates browser gaming and 3D rendering"],
          ["Accessibility (a11y)", "Opaque pixel bitmap; invisible to screen readers", "Rich semantic DOM with `<title>` and `<desc>`", "Canvas requires manual fallback DOM overlay", "SVG is natively accessible; Canvas requires heavy work"]
        ],
        n: "The HTML `<canvas>` element provides a raw drawing surface that defaults to $300 \\times 150\\text{ pixels}$. In **Immediate Mode**, the application obtains a rendering context: `const ctx = canvas.getContext('2d')`. The API provides procedural drawing commands: `ctx.beginPath()`, `ctx.arc()`, `ctx.fillStyle = 'red'`, `ctx.fill()`. Once a shape is drawn, the canvas immediately rasterizes the pixels into its internal bitmap buffer and **completely forgets the shape ever existed**: there are no internal objects to query or click. Crucially, handling high-DPI (Retina) screens requires manually **scaling the internal bitmap canvas width by the Device Pixel Ratio**: `canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.scale(dpr, dpr);`, otherwise Canvas graphics appear blurry on high-resolution displays."
      },

      miss: [
        {
          w: "Setting canvas width in CSS (`canvas { width: 800px; }`) sets its drawing resolution.",
          r: "CSS width sets only the **display size**, NOT the internal drawing buffer! A canvas has two distinct sizes: its **drawing buffer dimensions** (set via HTML attributes `width='800'` or `canvas.width = 800`) and its **CSS display size**. If you set CSS width to 800px without setting the HTML attribute, the browser will stretch the default $300 \\times 150$ bitmap over 800px, resulting in blurry, pixelated graphics."
        },
        {
          w: "Canvas elements are inherently accessible to screen reader users.",
          r: "A canvas is an **opaque grid of pixels** that is completely invisible to screen readers. To make a Canvas accessible, developers must render fallback semantic HTML elements inside the `<canvas>` tags (`<canvas><button>Play</button></canvas>`) or maintain an invisible **Focus Ring / Accessibility Proxy DOM**."
        },
        {
          w: "You can click on an individual circle drawn on a canvas using `addEventListener`.",
          r: "Because Canvas is immediate-mode, the browser does not know circles or rectangles exist. You can only attach event listeners to the **entire canvas element**. Detecting which circle was clicked requires writing manual **Hit-Testing Math** (measuring click coordinates `(x, y)` and calculating distance using the Pythagorean theorem: $\\sqrt{(x - x_c)^2 + (y - y_c)^2} \\le r$)."
        },
        {
          w: "Canvas is always faster than SVG.",
          r: "Canvas is faster when rendering **thousands of dynamic moving objects** (particles, game sprites, high-frequency stock charts). However, for small numbers of static elements (under 1,000 items), **SVG is often faster and uses less memory** because browsers optimize SVG rendering through native C++ display lists."
        }
      ],

      trade: {
        buys: [
          "Massive object rendering throughput: effortlessly renders 100,000+ dynamic particles at 60 FPS without DOM bloat.",
          "Hardware GPU acceleration: leverages WebGL and WebGPU to execute custom vertex and fragment shaders.",
          "Pixel-level manipulation: allows direct access to raw RGBA pixel arrays via `ctx.getImageData()` for photo filters.",
          "Offscreen multi-threading: `OffscreenCanvas` allows rendering graphics entirely inside background Web Workers."
        ],
        costs: [
          "Zero native event handling: requires writing complex manual math algorithms for clicking, hovering, and dragging objects.",
          "Accessibility blind spot: completely opaque to screen readers without building complex fallback DOM proxies.",
          "Manual Retina scaling: requires manual math to scale the canvas buffer by `devicePixelRatio` to prevent blurriness.",
          "Loss of vector scalability: zooming in on an immediate-mode bitmap reveals jagged pixelation unless manually re-rendered."
        ],
        avoid: [
          "Never set canvas dimensions only in CSS; always set the physical `canvas.width` and `canvas.height` attributes.",
          "Do not forget to scale canvas resolution by `window.devicePixelRatio` to prevent blurry rendering on Retina displays.",
          "Avoid using Canvas for UI buttons, menus, or forms; use native semantic HTML and SVG for standard interface components.",
          "Never run heavy Canvas drawing loops synchronously on the main thread; use `requestAnimationFrame` or `OffscreenCanvas`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "design-system",

      why: {
        before: "Different development teams built buttons, modal dialogs, colors, and form inputs independently, resulting in fragmented user experiences, inconsistent brand colors, duplicate codebases, and accessibility violations.",
        problem: "Enterprise software organizations require a centralized, single source of truth for UI design and development that unifies visual standards, design tokens, and reusable component code across all products.",
        shift: "**Design System: A comprehensive set of standards, documentation, design tokens, and reusable UI components that guides the creation of consistent digital products across an organization.** Unifying designers (Figma) and engineers (code repositories), design systems bridge visual design with production engineering."
      },

      num: {
        t: "Design System Architecture: Layers from Tokens to Patterns",
        h: ["System Layer", "What It Encapsulates", "Technical Representation", "Update Propagation", "Industry Standard Example"],
        r: [
          ["1. Design Tokens", "Atomic design variables (colors, spacing scale, font sizes, shadows)", "JSON / CSS Custom Properties (`--color-primary-500`)", "Automated export from Figma via Style Dictionary", "Tailwind config, Salesforce Theo, W3C Design Tokens"],
          ["2. Design Primitives (Atoms)", "Lowest-level accessible interactive components", "Button, Input, Checkbox, Icon, Typography, Badge", "Component package updates via npm", "Radix UI Primitives, React Aria, Headless UI"],
          ["3. Composite Components", "Molecules combining primitives into functional blocks", "SearchBar, FormField, ModalDialog, NavigationBar", "Composed in application code or library", "Shadcn UI, Material UI, Chakra UI"],
          ["4. Patterns & Templates", "Standardized UX layouts and end-to-end flows", "DashboardLayout, CheckoutWizard, AuthModal", "Documentation guidelines & shared layouts", "Shopify Polaris, IBM Carbon, GitHub Primer"],
          ["5. Governance & Docs", "Usage rules, accessibility guidelines, brand voice", "Interactive component sandbox documentation", "Storybook, zeroheight, Docusaurus", "Storybook Component Driven Development"]
        ],
        n: "A modern Design System is built upon a foundation of **Design Tokens**: technology-agnostic key-value pairs representing design decisions (e.g., `{ 'color-brand': '#4F46E5', 'spacing-md': '16px' }`). Using tools like **Style Dictionary**, tokens are exported automatically from Figma design libraries and transformed into multiple platform targets: CSS Custom Properties for web, Swift constants for iOS, and XML/Compose tokens for Android. Modern component architecture strongly favors **Headless UI Primitives** (Radix UI, React Aria): the design system library provides unstyled, accessible components with built-in ARIA roles, focus traps, and keyboard navigation, allowing frontend teams to style them with Tailwind CSS or CSS Modules without fighting framework opinionation."
      },

      miss: [
        {
          w: "A design system is just a UI component library (like Bootstrap or MUI).",
          r: "A component library is merely **one technical artifact** of a design system. A true **Design System** encompasses the entire holistic ecosystem: design tokens, brand guidelines, content design/voice, accessibility standards, Figma design kits, governance processes, and Storybook documentation."
        },
        {
          w: "A design system prevents developers and designers from being creative.",
          r: "A design system eliminates boring, repetitive decisions (arguing over which shade of blue to use or how many pixels of padding a button needs), freeing engineers and designers to focus on **high-value creative problem solving, user experience flows, and business logic**."
        },
        {
          w: "Hardcoding hexadecimal colors in component CSS is fine if it matches Figma.",
          r: "Hardcoding hex codes (`#3b82f6`) violates design system architecture. Colors and spacing must ALWAYS reference **Design Tokens (CSS Variables)**: `var(--color-primary)`. When the company rebrands or enables Dark Mode, updating the single design token updates the entire application instantly."
        },
        {
          w: "Building a custom design system from scratch is always the best choice.",
          r: "Building accessible components (tabs, comboboxes, date pickers) from scratch requires hundreds of hours of complex ARIA and keyboard navigation engineering. Modern teams build on top of battle-tested **Headless Primitives** (Radix UI, React Aria, Shadcn UI) to gain built-in accessibility while maintaining complete styling freedom."
        }
      ],

      trade: {
        buys: [
          "Brand and visual consistency: ensures all pages, products, and micro-frontends share identical styling and behavior.",
          "Rapid prototyping and delivery: engineers build new features in hours by snapping together pre-existing, accessible components.",
          "Centralized accessibility compliance: auditing and fixing a component in the design system fixes accessibility across the entire enterprise.",
          "Automated theming & Dark Mode: CSS custom property tokens make switching between themes or brands instantaneous."
        ],
        costs: [
          "High maintenance and governance: requires dedicated design system engineers to maintain, version, and document components.",
          "Initial investment overhead: establishing token pipelines and building reusable components requires months of upfront effort.",
          "Breaking change propagation: updates to a core component in the design system can introduce visual regressions across consumer apps.",
          "Adoption resistance: product teams often resist adopting design systems if components feel too rigid or poorly documented."
        ],
        avoid: [
          "Never hardcode raw hex colors or arbitrary pixel margins in components; always reference standardized Design Tokens.",
          "Do not build complex accessible components (Modals, Dropdowns) from scratch; build on top of Headless Primitives (Radix, React Aria).",
          "Avoid building a design system in isolation without active collaboration and feedback from product frontend teams.",
          "Never ship design system components without interactive Storybook documentation and comprehensive accessibility audits."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
